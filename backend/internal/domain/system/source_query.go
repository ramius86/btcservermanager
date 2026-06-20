package system

import (
	"bytes"
	"encoding/binary"
	"errors"
	"fmt"
	"net"
	"strings"
	"time"
)

// SourceQueryInfo represents the response from an A2S_INFO query.
type SourceQueryInfo struct {
	Protocol    byte
	Name        string
	Map         string
	Folder      string
	Game        string
	ID          uint16
	Players     byte
	MaxPlayers  byte
	Bots        byte
	ServerType  byte
	Environment byte
	Visibility  byte
	VAC         byte
	Version     string
	Tags        string
	Mission     string
}

// QueryServerInfo sends an A2S_INFO request to a server and parses the response.
func QueryServerInfo(address string) (*SourceQueryInfo, error) {
	conn, err := net.DialTimeout("udp", address, 2*time.Second)
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	// A2S_INFO Request
	request := []byte{0xFF, 0xFF, 0xFF, 0xFF, 0x54, 0x53, 0x6F, 0x75, 0x72, 0x63, 0x65, 0x20, 0x45, 0x6E, 0x67, 0x69, 0x6E, 0x65, 0x20, 0x51, 0x75, 0x65, 0x72, 0x79, 0x00}

	_, err = conn.Write(request)
	if err != nil {
		return nil, err
	}

	buffer := make([]byte, 1400)
	_ = conn.SetReadDeadline(time.Now().Add(2 * time.Second))

	n, err := conn.Read(buffer)
	if err != nil {
		return nil, err
	}

	data := buffer[:n]
	if len(data) < 5 {
		return nil, errors.New("response too short")
	}

	// Check if challenge is required (0x41)
	if data[4] == 0x41 {
		if len(data) < 9 {
			return nil, errors.New("challenge response too short")
		}

		challenge := data[5:9]

		// Resend A2S_INFO with challenge
		challengeRequest := append(request, challenge...)

		_, err = conn.Write(challengeRequest)
		if err != nil {
			return nil, err
		}

		_ = conn.SetReadDeadline(time.Now().Add(2 * time.Second))

		n, err = conn.Read(buffer)
		if err != nil {
			return nil, err
		}

		data = buffer[:n]
	}

	return parseA2SInfo(data)
}

func parseA2SInfo(data []byte) (*SourceQueryInfo, error) {
	if len(data) < 5 {
		return nil, errors.New("response too short")
	}

	reader := bytes.NewReader(data[4:]) // Skip header 0xFFFFFFFF

	header, _ := reader.ReadByte()
	if header != 0x49 { // 'I' for Info
		return nil, fmt.Errorf("invalid response header: %02X", header)
	}

	info := &SourceQueryInfo{}
	info.Protocol, _ = reader.ReadByte()
	info.Name = readString(reader)
	info.Map = readString(reader)
	info.Folder = readString(reader)
	info.Game = readString(reader)

	_ = binary.Read(reader, binary.LittleEndian, &info.ID)
	info.Players, _ = reader.ReadByte()
	info.MaxPlayers, _ = reader.ReadByte()
	info.Bots, _ = reader.ReadByte()
	info.ServerType, _ = reader.ReadByte()
	info.Environment, _ = reader.ReadByte()
	info.Visibility, _ = reader.ReadByte()
	info.VAC, _ = reader.ReadByte()
	info.Version = readString(reader)

	// Extra Data Flags (EDF)
	if reader.Len() > 0 {
		edf, _ := reader.ReadByte()
		parseEDF(reader, edf, info)
	}

	// Fallback for Mission: if it's empty, some servers put mission in the 'Game' field
	// or we can just use the 'Map' field if 'Mission' is still empty for Arma 3
	missionIsEmpty := info.Mission == ""
	isOtherGame := info.Game != "" && info.Game != "Arma 3" && info.Game != "DayZ"
	if missionIsEmpty && isOtherGame {
		info.Mission = info.Game
	}

	return info, nil
}

func parseEDF(reader *bytes.Reader, edf byte, info *SourceQueryInfo) {
	// Port (0x80)
	if edf&0x80 != 0 {
		var port uint16
		_ = binary.Read(reader, binary.LittleEndian, &port)
	}

	// SteamID (0x40)
	if edf&0x40 != 0 {
		var steamID uint64
		_ = binary.Read(reader, binary.LittleEndian, &steamID)
	}

	// Tags (0x20)
	if edf&0x20 != 0 {
		info.Tags = readString(reader)
		info.Mission = extractMissionFromTags(info.Tags)
	}

	// GameID (0x10)
	if edf&0x10 != 0 {
		var gameID uint64
		_ = binary.Read(reader, binary.LittleEndian, &gameID)
	}
}

const missionNameTag = "missionName:"

func extractMissionFromTags(tags string) string {
	// Try to extract mission name from tags for Arma 3
	// Usually in format "...missionName:NAME,..." or "...m:NAME,..."
	if strings.Contains(tags, missionNameTag) {
		parts := strings.Split(tags, ",")
		for _, p := range parts {
			if strings.HasPrefix(p, missionNameTag) {
				return strings.TrimPrefix(p, missionNameTag)
			}
		}
	}
	return ""
}

func readString(r *bytes.Reader) string {
	str := []byte{}

	for {
		b, err := r.ReadByte()
		if err != nil || b == 0 {
			break
		}

		str = append(str, b)
	}

	return string(str)
}
