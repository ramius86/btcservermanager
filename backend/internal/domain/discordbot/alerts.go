package discordbot

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/bwmarrin/discordgo"
)

const (
	colorAlertCrash   = 0xED4245 // Red
	colorAlertWarning = 0xE67E22 // Orange
	colorAlertMod     = 0x5865F2 // Blurple
	colorAlertGame    = 0xFEE75C // Amber/Yellow
	colorAlertTest    = 0x57F287 // Green

	footerText = "BTC Server Manager"
)

func (s *Service) SendServerOfflineAlert(channelID, serverName, serverType string, isCrash bool, exitErr error) error {
	if s.session == nil {
		return errors.New(errBotNotConfigured)
	}
	if channelID == "" {
		return errors.New("channel ID is empty")
	}

	now := time.Now().Unix()
	var embed *discordgo.MessageEmbed

	if isCrash {
		errMsg := "Unknown error"
		if exitErr != nil {
			errMsg = exitErr.Error()
		}

		embed = &discordgo.MessageEmbed{
			Title:       "🔴 Server Crash Detected",
			Description: fmt.Sprintf("Server **%s** stopped unexpectedly with an error.", serverName),
			Color:       colorAlertCrash,
			Fields: []*discordgo.MessageEmbedField{
				{Name: "Server", Value: serverName, Inline: true},
				{Name: "Game", Value: serverType, Inline: true},
				{Name: "Exit Status", Value: errMsg, Inline: true},
				{Name: "Timestamp", Value: fmt.Sprintf("<t:%d:F> (<t:%d:R>)", now, now), Inline: false},
			},
			Footer: &discordgo.MessageEmbedFooter{Text: footerText},
		}
	} else {
		embed = &discordgo.MessageEmbed{
			Title:       "⚠️ Server Stopped Unexpectedly",
			Description: fmt.Sprintf("Server **%s** went offline without a manual stop command.", serverName),
			Color:       colorAlertWarning,
			Fields: []*discordgo.MessageEmbedField{
				{Name: "Server", Value: serverName, Inline: true},
				{Name: "Game", Value: serverType, Inline: true},
				{Name: "Timestamp", Value: fmt.Sprintf("<t:%d:F> (<t:%d:R>)", now, now), Inline: false},
			},
			Footer: &discordgo.MessageEmbedFooter{Text: footerText},
		}
	}

	_, err := s.session.ChannelMessageSendEmbed(channelID, embed)
	return err
}

func (s *Service) SendModUpdateAlert(channelID, modName string, modID int64, serverType, thumbnail string) error {
	if s.session == nil {
		return errors.New(errBotNotConfigured)
	}
	if channelID == "" {
		return errors.New("channel ID is empty")
	}

	now := time.Now().Unix()
	modIDStr := strconv.FormatInt(modID, 10)
	workshopURL := fmt.Sprintf("https://steamcommunity.com/sharedfiles/filedetails/?id=%s", modIDStr)

	embed := &discordgo.MessageEmbed{
		Title:       "⚠️ Workshop Mod Update Available",
		Description: fmt.Sprintf("A new update was detected on Steam Workshop for **%s**.", modName),
		Color:       colorAlertMod,
		Fields: []*discordgo.MessageEmbedField{
			{Name: "Mod", Value: modName, Inline: true},
			{Name: "Mod ID", Value: modIDStr, Inline: true},
			{Name: "Game", Value: serverType, Inline: true},
			{Name: "Workshop Link", Value: workshopURL, Inline: false},
			{Name: "Detected At", Value: fmt.Sprintf("<t:%d:F>", now), Inline: false},
		},
		Footer: &discordgo.MessageEmbedFooter{Text: footerText},
	}

	if thumbnail != "" {
		embed.Thumbnail = &discordgo.MessageEmbedThumbnail{URL: thumbnail}
	}

	_, err := s.session.ChannelMessageSendEmbed(channelID, embed)
	return err
}

func (s *Service) SendGameUpdateAlert(channelID, serverType, currentBuildID, newBuildID string) error {
	if s.session == nil {
		return errors.New(errBotNotConfigured)
	}
	if channelID == "" {
		return errors.New("channel ID is empty")
	}

	now := time.Now().Unix()
	installed := currentBuildID
	if installed == "" {
		installed = "Unknown"
	}

	embed := &discordgo.MessageEmbed{
		Title:       "⚠️ Game Server Update Available",
		Description: "A new dedicated server build was published on Steam.",
		Color:       colorAlertGame,
		Fields: []*discordgo.MessageEmbedField{
			{Name: "Game", Value: serverType, Inline: true},
			{Name: "Installed Build", Value: installed, Inline: true},
			{Name: "Available Build", Value: newBuildID, Inline: true},
			{Name: "Action Required", Value: "Run SteamCMD update via BTC Server Manager", Inline: false},
			{Name: "Detected At", Value: fmt.Sprintf("<t:%d:F>", now), Inline: false},
		},
		Footer: &discordgo.MessageEmbedFooter{Text: footerText},
	}

	_, err := s.session.ChannelMessageSendEmbed(channelID, embed)
	return err
}

func (s *Service) SendTestAlert(_ context.Context, channelID string) error {
	if s.session == nil {
		return errors.New(errBotNotConfigured)
	}
	if channelID == "" {
		return errors.New("channel ID is empty")
	}

	now := time.Now().Unix()
	embed := &discordgo.MessageEmbed{
		Title:       "⚠️ BTC Server Manager Alert Test",
		Description: "Operational alert delivery verified successfully.",
		Color:       colorAlertTest,
		Fields: []*discordgo.MessageEmbedField{
			{Name: "Status", Value: "Delivery Verified", Inline: true},
			{Name: "Channel", Value: fmt.Sprintf("<#%s>", channelID), Inline: true},
			{Name: "Timestamp", Value: fmt.Sprintf("<t:%d:F>", now), Inline: false},
		},
		Footer: &discordgo.MessageEmbedFooter{Text: footerText},
	}

	_, err := s.session.ChannelMessageSendEmbed(channelID, embed)
	return err
}
