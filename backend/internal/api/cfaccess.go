package api

import (
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
)

// cfAccessValidator verifies JWTs issued by Cloudflare Access.
// It uses keyfunc to handle the fetching and auto-refreshing of public keys (JWK Set) in the background.
type cfAccessValidator struct {
	teamDomain string
	debugMode  bool
	jwks       jwt.Keyfunc
	mu         sync.RWMutex
}

func newCFAccessValidator(teamDomain string, debugMode bool) *cfAccessValidator {
	v := &cfAccessValidator{
		teamDomain: teamDomain,
		debugMode:  debugMode,
	}

	if teamDomain != "" {
		go func() {
			jwksURL := teamDomain + "/cdn-cgi/access/certs"
			for {
				// keyfunc.NewDefault performs the initial fetch and starts a timer for automatic refresh
				k, err := keyfunc.NewDefault([]string{jwksURL})
				if err == nil {
					v.mu.Lock()
					v.jwks = k.Keyfunc
					v.mu.Unlock()
					break
				}
				
				log.Printf("Warning: Failed to fetch Cloudflare Access keys, retrying in 1m: %v", err)
				// Retry if Cloudflare is temporarily unreachable or the network is not yet ready
				time.Sleep(1 * time.Minute)
			}
		}()
	}

	return v
}

// Middleware to apply to all /api routes.
// Rejects requests without a valid Cloudflare Access JWT.
func (v *cfAccessValidator) middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if v.handleDebugMode(w, r, next) {
			return
		}

		tokenStr := v.getToken(r)
		if tokenStr == "" {
			http.Error(w, "Unauthorized: missing CF Access token", http.StatusUnauthorized)
			return
		}

		if status, ok := v.validateToken(tokenStr); !ok {
			if status == http.StatusServiceUnavailable {
				http.Error(w, "Service Unavailable: cannot validate token (keys not fetched yet)", http.StatusServiceUnavailable)
				return
			}
			http.Error(w, "Forbidden: invalid CF Access token", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (v *cfAccessValidator) handleDebugMode(w http.ResponseWriter, r *http.Request, next http.Handler) bool {
	if v.teamDomain == "" {
		if v.debugMode {
			next.ServeHTTP(w, r)
			return true
		}
		http.Error(w, "Unauthorized: Cloudflare Access team domain is not configured and Debug Mode is disabled.", http.StatusUnauthorized)
		return true
	}
	return false
}

func (v *cfAccessValidator) getToken(r *http.Request) string {
	tokenStr := r.Header.Get("Cf-Access-Jwt-Assertion")
	if tokenStr == "" {
		if cookie, err := r.Cookie("CF_Authorization"); err == nil {
			tokenStr = cookie.Value
		}
	}
	return tokenStr
}

func (v *cfAccessValidator) validateToken(tokenStr string) (int, bool) {
	v.mu.RLock()
	k := v.jwks
	v.mu.RUnlock()

	if k == nil {
		// Keys have not been successfully downloaded yet
		return http.StatusServiceUnavailable, false
	}

	token, err := jwt.Parse(tokenStr, k)
	if err != nil || !token.Valid {
		return http.StatusForbidden, false
	}

	return 0, true
}
