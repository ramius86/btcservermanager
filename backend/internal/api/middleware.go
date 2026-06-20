package api

import (
	"net/http"
	"strings"

	"github.com/go-chi/cors"
)

const cacheControlNoStore = "no-store"

// securityHeaders returns a middleware that injects security-related HTTP headers.
// The Content-Security-Policy value is computed once at registration time
// (it depends only on the static config fields AllowedOrigin and CSPMode)
// so that strings.Join and the surrounding string manipulations are not
// repeated on every request.
func (r *Router) securityHeaders(next http.Handler) http.Handler {
	// Pre-compute the CSP header name and value once.
	var cspHeader, cspValue string

	if r.config.CSPEnabled && r.config.AllowedOrigin != "" {
		domain := strings.TrimSpace(r.config.AllowedOrigin)
		// wss:// per il WebSocket sullo stesso dominio
		wsDomain := "wss://" + strings.TrimPrefix(
			strings.TrimPrefix(domain, "https://"), "http://",
		)

		cspValue = strings.Join([]string{
			"default-src 'self'",
			// Script: solo self + Cloudflare Web Analytics
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
			// Stili: self + Google Fonts
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			// Font: self + Google Fonts CDN
			"font-src 'self' https://fonts.gstatic.com",
			// Connessioni: self + WebSocket stesso dominio + Cloudflare Web Analytics
			"connect-src 'self' " + domain + " " + wsDomain + " https://cloudflareinsights.com",
			// Immagini: self + data URI (per SVG inline di Vite) + Steam CDNs + Bohemia Interactive Reforger CDNs
			"img-src 'self' data: https://images.steamusercontent.com https://shared.fastly.steamstatic.com https://steamuserimages-a.akamaihd.net https://reforger.armaplatform.com https://ar-gcp-cdn.bistudio.com",
			// Frame: nessuno (già coperto da X-Frame-Options ma ridondanza utile)
			"frame-ancestors 'none'",
			// Form: solo self
			"form-action 'self'",
			// Base URI: solo self (previene base tag injection)
			"base-uri 'self'",
			// CSP reporting endpoint
			"report-uri /api/csp-report",
		}, "; ")

		cspHeader = "Content-Security-Policy"
		if r.config.CSPMode == "report-only" {
			cspHeader = "Content-Security-Policy-Report-Only"
		}
	}

	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		// Prevent caching of API responses (Browser + CDN)
		// no-transform tells Cloudflare (and any CDN) to not modify the response body,
		// preventing automatic injection of beacon.min.js and other scripts.
		w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, no-transform, max-age=0")
		w.Header().Set("CDN-Cache-Control", cacheControlNoStore)
		w.Header().Set("Cloudflare-CDN-Cache-Control", cacheControlNoStore)
		w.Header().Set("Surrogate-Control", cacheControlNoStore)
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")

		if cspValue != "" {
			w.Header().Set(cspHeader, cspValue)
		}

		next.ServeHTTP(w, req)
	})
}

// CorsHandler restituisce un middleware CORS configuration con origine specifica.
// Usa la libreria go-chi/cors già presente nel go.mod.
func CorsHandler(allowedOrigin string) func(http.Handler) http.Handler {
	sanitizedOrigin := strings.TrimSpace(allowedOrigin)
	origins := []string{sanitizedOrigin}
	if sanitizedOrigin == "" {
		// Fallback per sviluppo locale se ALLOWED_ORIGIN non è impostato
		origins = []string{"http://localhost:3000", "http://localhost:5173", "http://localhost:4173"}
	}

	return cors.Handler(cors.Options{
		AllowedOrigins:   origins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Cf-Access-Jwt-Assertion"},
		AllowCredentials: true,
		MaxAge:           300,
	})
}
