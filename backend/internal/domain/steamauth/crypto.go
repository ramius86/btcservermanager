package steamauth

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"strings"
)

// minSecretKeyLength makes a guessable key impractical: the key is the only
// thing protecting the stored Steam password once the DB file is copied.
const minSecretKeyLength = 32

// isPlaceholderSecret catches the values shipped in .env.example and the
// obvious "I will change it later" ones. Encrypting with a key that is
// published next to the code is the same as storing the password in clear.
func isPlaceholderSecret(secret string) bool {
	lower := strings.ToLower(secret)
	for _, needle := range []string{"change-me", "changeme", "change_me", "your-secret", "placeholder", "replace-me"} {
		if strings.Contains(lower, needle) {
			return true
		}
	}

	return false
}

// deriveKey validates the caller-supplied secret and turns it into the AES
// key. The secret arrives from Config; reading os.Getenv here (as an earlier
// version did) left Config.SecretKey as a decoy that nothing encrypted with,
// so a validated key and the key actually in use could silently differ (the
// config value is not trimmed, this one is).
func deriveKey(secret string) ([]byte, error) {
	secret = strings.TrimSpace(secret)

	if secret == "" {
		return nil, errors.New("FATAL SECURITY ERROR: SECRET_KEY environment variable must be set to secure Steam credentials")
	}

	if isPlaceholderSecret(secret) {
		return nil, errors.New("FATAL SECURITY ERROR: SECRET_KEY still contains the placeholder from .env.example; generate a unique key with `openssl rand -base64 32`")
	}

	if len(secret) < minSecretKeyLength {
		return nil, fmt.Errorf("FATAL SECURITY ERROR: SECRET_KEY must be at least %d characters long (got %d); generate one with `openssl rand -base64 32`", minSecretKeyLength, len(secret))
	}

	hash := sha256.Sum256([]byte(secret))

	return hash[:], nil
}

func encrypt(secret, plaintext string) (string, error) {
	if plaintext == "" {
		return "", nil
	}

	key, err := deriveKey(secret)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, aesGCM.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := aesGCM.Seal(nonce, nonce, []byte(plaintext), nil)

	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func decrypt(secret, encoded string) (string, error) {
	if encoded == "" {
		return "", nil
	}

	key, err := deriveKey(secret)
	if err != nil {
		return "", err
	}

	data, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonceSize := aesGCM.NonceSize()
	if len(data) < nonceSize {
		return "", errors.New("ciphertext too short")
	}

	nonce, ciphertext := data[:nonceSize], data[nonceSize:]

	plaintext, err := aesGCM.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}
