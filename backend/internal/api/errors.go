package api

import (
	"log"
	"net/http"
)

// errInternalResponse is everything a client sees for an unexpected failure.
// Absolute paths, SQL text and driver messages are diagnostic material for the
// server log, not copy for a UI toast.
const errInternalResponse = "internal server error"

// respondInternalError logs err and answers with a generic 500. Handlers that
// need to keep a specific status (404, 409) handle it before calling this.
func (r *Router) respondInternalError(w http.ResponseWriter, err error) {
	log.Printf("[API] internal error: %v", err)
	http.Error(w, errInternalResponse, http.StatusInternalServerError)
}
