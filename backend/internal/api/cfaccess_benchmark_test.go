package api

import (
	"crypto/rand"
	"crypto/rsa"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func BenchmarkCFAccessMiddleware(b *testing.B) {
	// 1. Setup Mock KeySet and JWT
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		b.Fatal(err)
	}

	kid := "test-key-id"

	// Create a signed token
	tok := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"sub": "benchmark-user",
		"iss": "cloudflare-access",
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(time.Hour).Unix(),
	})
	tok.Header["kid"] = kid

	tokenStr, err := tok.SignedString(privateKey)
	if err != nil {
		b.Fatal(err)
	}

	// 2. Setup Validator with a mocked Keyfunc
	validator := &cfAccessValidator{
		teamDomain: "https://test.cloudflareaccess.com",
		jwks: func(token *jwt.Token) (interface{}, error) {
			return &privateKey.PublicKey, nil
		},
	}

	// Mock Handler
	handler := validator.middleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest("GET", "/api/test", nil)
	req.Header.Set("Cf-Access-Jwt-Assertion", tokenStr)

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			b.Fatalf("Auth failed: %d", w.Code)
		}
	}
}

func BenchmarkJWTParsingOnly(b *testing.B) {
	// Same setup but benchmark only the core jwt.Parse call
	privateKey, _ := rsa.GenerateKey(rand.Reader, 2048)
	kid := "test"

	tok := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{"sub": "user"})
	tok.Header["kid"] = kid
	tokenStr, _ := tok.SignedString(privateKey)

	mockKeyFunc := func(token *jwt.Token) (interface{}, error) {
		return &privateKey.PublicKey, nil
	}

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		_, _ = jwt.Parse(tokenStr, mockKeyFunc)
	}
}
