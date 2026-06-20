package api

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

type cspReportPayload struct {
	CSPReport struct {
		DocumentURI        string `json:"document-uri"`
		Referrer           string `json:"referrer"`
		ViolatedDirective  string `json:"violated-directive"`
		EffectiveDirective string `json:"effective-directive"`
		OriginalPolicy     string `json:"original-policy"`
		Disposition        string `json:"disposition"`
		BlockedURI         string `json:"blocked-uri"`
		StatusCode         int    `json:"status-code"`
		SourceFile         string `json:"source-file"`
		LineNumber         int    `json:"line-number"`
		ColumnNumber       int    `json:"column-number"`
	} `json:"csp-report"`
}

func (r *Router) handleCSPReport(w http.ResponseWriter, req *http.Request) {
	var payload cspReportPayload
	if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 1048576)).Decode(&payload); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	rep := payload.CSPReport

	sanitize := func(s string) string {
		s = strings.ReplaceAll(s, "\n", "")
		s = strings.ReplaceAll(s, "\r", "")
		return s
	}

	log.Printf("[CSP Violation] Document: %q, Blocked: %q, Violated Directive: %q, Source: %q:%d:%d",
		sanitize(rep.DocumentURI), sanitize(rep.BlockedURI), sanitize(rep.ViolatedDirective), sanitize(rep.SourceFile), rep.LineNumber, rep.ColumnNumber)

	w.WriteHeader(http.StatusNoContent)
}
