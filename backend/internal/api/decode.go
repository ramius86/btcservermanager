package api

import (
	"bytes"
	"encoding/json"
)

// strictUnmarshal decodes raw into v and rejects unknown fields. Without it a
// typo in a payload (for example "maxPlayerss") is silently ignored and the
// real field keeps its zero value, which is indistinguishable from the user
// asking to reset it.
func strictUnmarshal(raw []byte, v any) error {
	dec := json.NewDecoder(bytes.NewReader(raw))
	dec.DisallowUnknownFields()
	return dec.Decode(v)
}
