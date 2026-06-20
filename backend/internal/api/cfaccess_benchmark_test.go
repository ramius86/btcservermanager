package api

import (
	"crypto/rand"
	"crypto/rsa"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/lestrrat-go/jwx/v2/jwa"
	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/lestrrat-go/jwx/v2/jwt"
)

func BenchmarkCFAccessMiddleware(b *testing.B) {
	// 1. Setup Mock KeySet and JWT
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		b.Fatal(err)
	}

	key, err := jwk.FromRaw(privateKey)
	if err != nil {
		b.Fatal(err)
	}
	_ = key.Set(jwk.KeyIDKey, "test-key-id")
	_ = key.Set(jwk.AlgorithmKey, jwa.RS256)

	keySet := jwk.NewSet()
	_ = keySet.AddKey(key)

	publicKey, _ := jwk.FromRaw(privateKey.PublicKey)
	_ = publicKey.Set(jwk.KeyIDKey, "test-key-id")
	_ = publicKey.Set(jwk.AlgorithmKey, jwa.RS256)
	publicSet := jwk.NewSet()
	_ = publicSet.AddKey(publicKey)

	// Create a signed token
	tok, err := jwt.NewBuilder().
		Subject("benchmark-user").
		Issuer("cloudflare-access").
		IssuedAt(time.Now()).
		Expiration(time.Now().Add(time.Hour)).
		Build()
	if err != nil {
		b.Fatal(err)
	}

	signed, err := jwt.Sign(tok, jwt.WithKey(jwa.RS256, key))
	if err != nil {
		b.Fatal(err)
	}
	tokenStr := string(signed)

	// 2. Setup Validator
	validator := &cfAccessValidator{
		teamDomain: "https://test.cloudflareaccess.com",
		keySet:     publicSet,
		lastFetch:  time.Now(),
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
	key, _ := jwk.FromRaw(privateKey)
	_ = key.Set(jwk.KeyIDKey, "test")
	_ = key.Set(jwk.AlgorithmKey, jwa.RS256)

	publicKey, _ := jwk.FromRaw(privateKey.PublicKey)
	_ = publicKey.Set(jwk.KeyIDKey, "test")
	_ = publicKey.Set(jwk.AlgorithmKey, jwa.RS256)
	ks := jwk.NewSet()
	_ = ks.AddKey(publicKey)

	tok, _ := jwt.NewBuilder().Subject("user").Build()
	signed, _ := jwt.Sign(tok, jwt.WithKey(jwa.RS256, key))

	b.ResetTimer()
	b.ReportAllocs()

	for b.Loop() {
		_, _ = jwt.Parse(signed, jwt.WithKeySet(ks), jwt.WithValidate(true))
	}
}
