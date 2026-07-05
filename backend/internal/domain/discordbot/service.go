package discordbot

import (
	"bytes"
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/bwmarrin/discordgo"
)

const (
	embedColor       = 16048263 // Giallo paglierino
	maxFieldLength   = 1024
	goingCustomID    = "rsvp_going"
	notGoingCustomID = "rsvp_notgoing"
	maybeCustomID    = "rsvp_maybe"

	labelGoing      = "Going"
	labelNotGoing   = "Not Going"
	labelMaybe      = "Maybe"
	labelNoResponse = "No Response"

	btnLabelGoing    = "\u00A0\u00A0\u00A0Going\u00A0\u00A0\u00A0"
	btnLabelNotGoing = "Not Going"
	btnLabelMaybe    = "\u00A0\u00A0\u00A0Maybe\u00A0\u00A0\u00A0"

	fieldTitleFormat = "%s (%d)\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"

	errBotNotConfigured = "discord bot not configured"
	attachmentURL       = "attachment://event_image.jpg"
	dateTimeFormat      = "2006-01-02T15:04"
)

type Service struct {
	session *discordgo.Session
	guildID string
	repo    *Repository
}

func New(token, guildID string, repo *Repository) (*Service, error) {
	if token == "" || guildID == "" {
		return nil, errors.New("discord token or guild ID is missing")
	}

	session, err := discordgo.New("Bot " + token)
	if err != nil {
		return nil, fmt.Errorf("failed to create discord session: %w", err)
	}

	svc := &Service{
		session: session,
		guildID: guildID,
		repo:    repo,
	}

	session.AddHandler(svc.handleInteraction)

	return svc, nil
}

func (s *Service) Open() error {
	return s.session.Open()
}

func (s *Service) Close() {
	if s.session != nil {
		s.session.Close()
	}
}

func (s *Service) IsConfigured() bool {
	return s.session != nil
}

func (s *Service) GetChannels() ([]Channel, error) {
	if s.session == nil {
		return nil, errors.New(errBotNotConfigured)
	}

	discordChannels, err := s.session.GuildChannels(s.guildID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch channels: %w", err)
	}

	var channels []Channel
	for _, c := range discordChannels {
		if c.Type == discordgo.ChannelTypeGuildText {
			channels = append(channels, Channel{
				ID:   c.ID,
				Name: c.Name,
			})
		}
	}
	return channels, nil
}

func (s *Service) GetRoles(ctx context.Context) ([]DiscordRole, error) {
	if s.session == nil {
		return nil, errors.New(errBotNotConfigured)
	}

	var roles []DiscordRole
	guilds := s.session.State.Guilds
	for _, g := range guilds {
		guildRoles, err := s.session.GuildRoles(g.ID)
		if err != nil {
			continue
		}
		for _, r := range guildRoles {
			if r.Name == "@everyone" {
				continue
			}
			roles = append(roles, DiscordRole{
				ID:   r.ID,
				Name: fmt.Sprintf("@%s", r.Name),
			})
		}
	}
	return roles, nil
}

func (s *Service) CreateEventMessage(ctx context.Context, channelID, title, datetime, gameType, imageBase64, mentions string) (*Event, error) {
	if s.session == nil {
		return nil, errors.New(errBotNotConfigured)
	}

	formattedDateTime := datetime
	if t, err := time.ParseInLocation(dateTimeFormat, datetime, time.Local); err == nil {
		formattedDateTime = fmt.Sprintf("%s (<t:%d:R>)", t.Format("02/01/2006 15:04"), t.Unix())
	}

	description := fmt.Sprintf("**Game:** %s\n**Date & Time:** %s", gameType, formattedDateTime)

	allUsers, _ := s.repo.GetAllUsers(ctx)
	var noRespNames []string
	for _, u := range allUsers {
		noRespNames = append(noRespNames, u.Username)
	}

	embed := &discordgo.MessageEmbed{
		Title:       title,
		Description: description,
		Color:       embedColor,
		Fields: []*discordgo.MessageEmbedField{
			{Name: fmt.Sprintf(fieldTitleFormat, labelGoing, 0), Value: "-", Inline: true},
			{Name: fmt.Sprintf(fieldTitleFormat, labelNotGoing, 0), Value: "-", Inline: true},
			{Name: fmt.Sprintf(fieldTitleFormat, labelMaybe, 0), Value: "-", Inline: true},
			{Name: fmt.Sprintf(fieldTitleFormat, labelNoResponse, len(noRespNames)), Value: formatUsersForField(noRespNames), Inline: true},
		},
	}

	components := []discordgo.MessageComponent{
		discordgo.ActionsRow{
			Components: []discordgo.MessageComponent{
				discordgo.Button{
					Label:    btnLabelGoing,
					Style:    discordgo.SuccessButton,
					CustomID: goingCustomID,
				},
				discordgo.Button{
					Label:    btnLabelNotGoing,
					Style:    discordgo.DangerButton,
					CustomID: notGoingCustomID,
				},
				discordgo.Button{
					Label:    btnLabelMaybe,
					Style:    discordgo.PrimaryButton,
					CustomID: maybeCustomID,
				},
			},
		},
	}

	var files []*discordgo.File
	if imageBase64 != "" {
		// Remove the data URI prefix if it exists
		b64data := imageBase64
		if idx := strings.Index(imageBase64, ","); idx != -1 {
			b64data = imageBase64[idx+1:]
		}

		imgBytes, err := base64.StdEncoding.DecodeString(b64data)
		if err == nil {
			files = append(files, &discordgo.File{
				Name:        "event_image.jpg",
				ContentType: "image/jpeg",
				Reader:      bytes.NewReader(imgBytes),
			})
			embed.Image = &discordgo.MessageEmbedImage{
				URL: attachmentURL,
			}
		} else {
			log.Printf("⚠️  Failed to decode base64 image for event: %v", err)
		}
	}

	msgSend := &discordgo.MessageSend{
		Content:    mentions,
		Embeds:     []*discordgo.MessageEmbed{embed},
		Components: components,
		Files:      files,
		AllowedMentions: &discordgo.MessageAllowedMentions{
			Parse: []discordgo.AllowedMentionType{
				discordgo.AllowedMentionTypeRoles,
				discordgo.AllowedMentionTypeUsers,
				discordgo.AllowedMentionTypeEveryone,
			},
		},
	}
	msg, err := s.session.ChannelMessageSendComplex(channelID, msgSend)
	if err != nil {
		return nil, fmt.Errorf("failed to send message: %w", err)
	}

	event := &Event{
		ChannelID: channelID,
		MessageID: msg.ID,
		Title:     title,
		DateTime:  datetime,
		GameType:  gameType,
	}

	id, err := s.repo.SaveEvent(ctx, event)
	if err != nil {
		// Try to delete the discord message if saving to DB fails
		_ = s.session.ChannelMessageDelete(channelID, msg.ID)
		return nil, fmt.Errorf("failed to save event to db: %w", err)
	}

	event.ID = id
	return event, nil
}

func (s *Service) GetEvent(ctx context.Context, id int64) (*DiscordEventDetail, error) {
	event, err := s.repo.GetEventByID(ctx, id)
	if err != nil {
		return nil, err
	}

	detail := &DiscordEventDetail{
		Event:      *event,
		Going:      []string{},
		NotGoing:   []string{},
		Maybe:      []string{},
		NoResponse: []string{},
	}

	allUsers, _ := s.repo.GetAllUsers(ctx)
	respondedMap := make(map[string]bool)

	parts, err := s.repo.GetEventParticipations(ctx, id)
	if err == nil {
		for _, p := range parts {
			respondedMap[p.UserID] = true
			switch p.Status {
			case "going":
				detail.Going = append(detail.Going, p.Username)
			case "not_going":
				detail.NotGoing = append(detail.NotGoing, p.Username)
			case "maybe":
				detail.Maybe = append(detail.Maybe, p.Username)
			}
		}
	}

	for _, u := range allUsers {
		if !respondedMap[u.ID] {
			detail.NoResponse = append(detail.NoResponse, u.Username)
		}
	}

	return detail, nil
}

func (s *Service) DeleteEvent(ctx context.Context, id int64) error {
	event, err := s.repo.GetEventByID(ctx, id)
	if err != nil {
		return err
	}

	if s.session != nil {
		err := s.session.ChannelMessageDelete(event.ChannelID, event.MessageID)
		if err != nil {
			log.Printf("⚠️  Failed to delete discord message for event %d: %v", id, err)
			// Continue deleting from DB even if discord deletion fails
		}
	}

	return s.repo.DeleteEvent(ctx, id)
}

func (s *Service) UpdateEventMessage(ctx context.Context, id int64, title, datetime, gameType string) (*Event, error) {
	if s.session == nil {
		return nil, errors.New(errBotNotConfigured)
	}

	event, err := s.repo.GetEventByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get event: %w", err)
	}

	msg, err := s.session.ChannelMessage(event.ChannelID, event.MessageID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch message from discord: %w", err)
	}

	if len(msg.Embeds) == 0 {
		return nil, errors.New("original message has no embeds")
	}

	embed := msg.Embeds[0]

	formattedDateTime := datetime
	if t, err := time.ParseInLocation(dateTimeFormat, datetime, time.Local); err == nil {
		formattedDateTime = fmt.Sprintf("%s (<t:%d:R>)", t.Format("02/01/2006 15:04"), t.Unix())
	}

	description := fmt.Sprintf("**Game:** %s\n**Date & Time:** %s", gameType, formattedDateTime)

	embed.Title = title
	embed.Description = description

	if embed.Image != nil && embed.Image.URL != "" {
		embed.Image.URL = attachmentURL
	}

	embeds := []*discordgo.MessageEmbed{embed}
	components := msg.Components

	_, err = s.session.ChannelMessageEditComplex(&discordgo.MessageEdit{
		Channel:    event.ChannelID,
		ID:         event.MessageID,
		Embeds:     &embeds,
		Components: &components,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to edit message: %w", err)
	}

	if err := s.repo.UpdateEvent(ctx, id, title, datetime, gameType); err != nil {
		return nil, fmt.Errorf("failed to update event in db: %w", err)
	}

	event.Title = title
	event.DateTime = datetime
	event.GameType = gameType

	return event, nil
}

func getInteractionUsername(i *discordgo.InteractionCreate) string {
	if i.Member != nil && i.Member.Nick != "" {
		return i.Member.Nick
	} else if i.Member != nil && i.Member.User != nil {
		return i.Member.User.Username
	} else if i.User != nil {
		return i.User.Username
	}
	return "Unknown User"
}

func getInteractionUserID(i *discordgo.InteractionCreate) string {
	if i.Member != nil && i.Member.User != nil {
		return i.Member.User.ID
	} else if i.User != nil {
		return i.User.ID
	}
	return ""
}

func statusFromCustomID(customID string) string {
	switch customID {
	case goingCustomID:
		return "going"
	case notGoingCustomID:
		return "not_going"
	case maybeCustomID:
		return "maybe"
	}
	return ""
}

func groupParticipants(parts []Participation) (going, notGoing, maybe []string) {
	for _, p := range parts {
		switch p.Status {
		case "going":
			going = append(going, p.Username)
		case "not_going":
			notGoing = append(notGoing, p.Username)
		case "maybe":
			maybe = append(maybe, p.Username)
		}
	}
	return going, notGoing, maybe
}

func (s *Service) handleInteraction(sess *discordgo.Session, i *discordgo.InteractionCreate) {
	if i.Type != discordgo.InteractionMessageComponent {
		return
	}

	data := i.MessageComponentData()
	status := statusFromCustomID(data.CustomID)
	if status == "" {
		return
	}

	if len(i.Message.Embeds) == 0 {
		return
	}
	embed := i.Message.Embeds[0]

	userID := getInteractionUserID(i)
	username := getInteractionUsername(i)

	ctx := context.Background()

	event, err := s.repo.GetEventByMessageID(ctx, i.Message.ID)
	if err != nil {
		log.Printf("⚠️  Failed to find event for message %s: %v", i.Message.ID, err)
		return
	}

	// If the event datetime has passed, do not process the interaction and freeze the message
	if eventTime, err := time.ParseInLocation(dateTimeFormat, event.DateTime, time.Local); err == nil && time.Now().After(eventTime) {
		err = sess.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseUpdateMessage,
			Data: &discordgo.InteractionResponseData{
				Embeds:     []*discordgo.MessageEmbed{embed},
				Components: []discordgo.MessageComponent{}, // clear components
			},
		})
		if err != nil {
			log.Printf("⚠️  Failed to freeze expired event via interaction: %v", err)
		}
		return
	}

	if err := s.repo.UpsertUser(ctx, userID, username); err != nil {
		log.Printf("⚠️  Failed to upsert discord user: %v", err)
	}

	if err := s.repo.UpsertParticipation(ctx, event.ID, userID, status); err != nil {
		log.Printf("⚠️  Failed to upsert participation: %v", err)
	}

	if err := s.buildEmbedFields(ctx, event.ID, embed); err != nil {
		log.Printf("⚠️  Failed to build embed fields: %v", err)
	}

	// Respond with the updated embed.
	err = sess.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseUpdateMessage,
		Data: &discordgo.InteractionResponseData{
			Embeds:     []*discordgo.MessageEmbed{embed},
			Components: i.Message.Components,
		},
	})
	if err != nil {
		log.Printf("⚠️  Failed to respond to interaction: %v", err)
	}
}

func (s *Service) buildEmbedFields(ctx context.Context, eventID int64, embed *discordgo.MessageEmbed) error {
	parts, err := s.repo.GetEventParticipations(ctx, eventID)
	if err != nil {
		return err
	}

	going, notGoing, maybe := groupParticipants(parts)

	allUsers, _ := s.repo.GetAllUsers(ctx)
	respondedMap := make(map[string]bool)
	for _, p := range parts {
		respondedMap[p.UserID] = true
	}
	var noResponse []string
	for _, u := range allUsers {
		if !respondedMap[u.ID] {
			noResponse = append(noResponse, u.Username)
		}
	}

	embed.Fields = []*discordgo.MessageEmbedField{
		{Name: fmt.Sprintf(fieldTitleFormat, labelGoing, len(going)), Value: formatUsersForField(going), Inline: true},
		{Name: fmt.Sprintf(fieldTitleFormat, labelNotGoing, len(notGoing)), Value: formatUsersForField(notGoing), Inline: true},
		{Name: fmt.Sprintf(fieldTitleFormat, labelMaybe, len(maybe)), Value: formatUsersForField(maybe), Inline: true},
		{Name: fmt.Sprintf(fieldTitleFormat, labelNoResponse, len(noResponse)), Value: formatUsersForField(noResponse), Inline: true},
	}

	if embed.Image != nil && embed.Image.URL != "" {
		// Discord API returns the CDN URL in the interaction payload.
		// If we send it back as-is, Discord detaches the physical attachment from the embed,
		// causing it to either duplicate (standalone + embed) or disappear.
		// By forcing it back to the attachment:// scheme, we retain the proper link.
		embed.Image.URL = attachmentURL
	}
	return nil
}

func (s *Service) updateEventMessageEmbed(ctx context.Context, event *Event) error {
	msg, err := s.session.ChannelMessage(event.ChannelID, event.MessageID)
	if err != nil {
		return err
	}

	if len(msg.Embeds) == 0 {
		return errors.New("original message has no embeds")
	}

	embed := msg.Embeds[0]
	if err := s.buildEmbedFields(ctx, event.ID, embed); err != nil {
		return err
	}

	embeds := []*discordgo.MessageEmbed{embed}
	_, err = s.session.ChannelMessageEditComplex(&discordgo.MessageEdit{
		Channel:    event.ChannelID,
		ID:         event.MessageID,
		Embeds:     &embeds,
		Components: &msg.Components,
	})
	return err
}

func (s *Service) GetGuildMembers(ctx context.Context) ([]GuildMember, error) {
	if s.session == nil {
		return nil, errors.New(errBotNotConfigured)
	}

	var allMembers []*discordgo.Member
	var after string
	for {
		members, err := s.session.GuildMembers(s.guildID, after, 1000)
		if err != nil {
			return nil, fmt.Errorf("failed to fetch guild members: %w", err)
		}
		if len(members) == 0 {
			break
		}
		allMembers = append(allMembers, members...)
		if len(members) < 1000 {
			break
		}
		after = members[len(members)-1].User.ID
	}

	var result []GuildMember
	for _, m := range allMembers {
		if m.User.Bot {
			continue
		}
		displayName := m.User.Username
		if m.Nick != "" {
			displayName = m.Nick
		}
		result = append(result, GuildMember{
			ID:          m.User.ID,
			Username:    m.User.Username,
			DisplayName: displayName,
		})
	}

	return result, nil
}

func (s *Service) UpdateManualParticipation(ctx context.Context, eventID int64, userID, username, status string) error {
	event, err := s.repo.GetEventByID(ctx, eventID)
	if err != nil {
		return err
	}

	if status == "none" {
		if err := s.repo.DeleteParticipation(ctx, eventID, userID); err != nil {
			return err
		}
	} else {
		if err := s.repo.UpsertUser(ctx, userID, username); err != nil {
			return err
		}
		if err := s.repo.UpsertParticipation(ctx, eventID, userID, status); err != nil {
			return err
		}
	}

	return s.updateEventMessageEmbed(ctx, event)
}

func (s *Service) DeleteUser(ctx context.Context, userID string) error {
	return s.repo.DeleteUserAndParticipations(ctx, userID)
}

func formatUsersForField(users []string) string {
	if len(users) == 0 {
		return "-"
	}

	var result string
	for i, u := range users {
		newLine := u
		if result != "" {
			newLine = "\n" + u
		}

		// 1024 is max limit, we need to leave room for the "and N others" message
		if len(result)+len(newLine) > maxFieldLength-30 {
			remaining := len(users) - i
			result += fmt.Sprintf("\n... e altri %d", remaining)
			break
		}
		result += newLine
	}
	return result
}
