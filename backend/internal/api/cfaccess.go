package api

import (
	"context"
	"log"
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/lestrrat-go/jwx/v2/jwt"
)

// cfAccessValidator verifica i JWT emessi da Cloudflare Access.
// Scarica le chiavi pubbliche dal team domain e le aggiorna ogni ora.
type cfAccessValidator struct {
	teamDomain  string
	debugMode   bool
	keySet      jwk.Set
	mu          sync.RWMutex
	lastFetch   time.Time
	lastAttempt time.Time
	refreshing  atomic.Bool
}

func newCFAccessValidator(teamDomain string, debugMode bool) *cfAccessValidator {
	v := &cfAccessValidator{
		teamDomain: teamDomain,
		debugMode:  debugMode,
	}
	if teamDomain != "" {
		go func() {
			if err := v.refreshKeys(); err != nil {
				log.Printf("Warning: Failed to fetch Cloudflare Access keys: %v", err)
				// Log dell'errore ma non panic: il middleware rifiuterà tutte le request
				// finché le chiavi non sono disponibili
			}
		}()
	}

	return v
}

func (v *cfAccessValidator) refreshKeys() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	set, err := jwk.Fetch(ctx, v.teamDomain+"/cdn-cgi/access/certs")
	if err != nil {
		return err
	}

	v.mu.Lock()
	v.keySet = set
	v.lastFetch = time.Now()
	v.mu.Unlock()

	return nil
}

// Middleware da applicare a tutte le route /api.
// Rifiuta le request prive di un JWT Cloudflare Access valido.
func (v *cfAccessValidator) middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if v.handleDebugMode(w, r, next) {
			return
		}

		v.refreshKeysIfNeeded()

		tokenStr := v.getToken(r)
		if tokenStr == "" {
			http.Error(w, "Unauthorized: missing CF Access token", http.StatusUnauthorized)
			return
		}

		if status, ok := v.validateToken(tokenStr); !ok {
			if status == http.StatusServiceUnavailable {
				http.Error(w, "Service Unavailable: cannot validate token", http.StatusServiceUnavailable)
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

func (v *cfAccessValidator) refreshKeysIfNeeded() {
	v.mu.RLock()
	stale := time.Since(v.lastFetch) > time.Hour
	rateLimited := time.Since(v.lastAttempt) < 5*time.Minute
	v.mu.RUnlock()

	shouldRefresh := stale && !rateLimited
	if shouldRefresh && v.refreshing.CompareAndSwap(false, true) {
		v.mu.Lock()
		v.lastAttempt = time.Now()
		v.mu.Unlock()

		go func() {
			defer v.refreshing.Store(false)

			if err := v.refreshKeys(); err != nil {
				log.Printf("Error refreshing CF Access keys in background: %v", err)
			}
		}()
	}
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
	ks := v.keySet
	v.mu.RUnlock()

	if ks == nil {
		return http.StatusServiceUnavailable, false
	}

	_, err := jwt.Parse(
		[]byte(tokenStr),
		jwt.WithKeySet(ks),
		jwt.WithValidate(true),
	)
	if err != nil {
		return http.StatusForbidden, false
	}

	return 0, true
}
