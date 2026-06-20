package ws

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/coder/websocket"
	"github.com/coder/websocket/wsjson"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10
)

type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan Event

	// Context is now passed as parameter

	// Ensures send channel is only closed once
	closeOnce sync.Once
}

func (c *Client) readPump(ctx context.Context, cancel context.CancelFunc) {
	defer func() {
		c.hub.Unregister(c)
		cancel()
	}()

	for {
		var msg struct {
			Type    string          `json:"type"`
			Payload json.RawMessage `json:"payload"`
		}

		err := wsjson.Read(ctx, c.conn, &msg)
		if err != nil {
			break
		}

		switch msg.Type {
		case "subscribe":
			var sub Subscription
			if err := json.Unmarshal(msg.Payload, &sub); err == nil {
				log.Printf("[WS Client] Subscribing to domain: %s (ServerID: %d)", sub.Domain, sub.ServerID)
				c.hub.subscribe <- clientSub{client: c, sub: sub}
			}
		case "unsubscribe":
			var unsub struct {
				Domain   string `json:"domain"`
				ServerID int64  `json:"server_id,omitempty"`
			}

			if err := json.Unmarshal(msg.Payload, &unsub); err == nil {
				c.hub.unsubscribe <- clientUnsub{
					client:   c,
					domain:   unsub.Domain,
					serverID: unsub.ServerID,
				}
			}
		}
	}
}

func (c *Client) writePump(ctx context.Context, cancel context.CancelFunc) {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		cancel()
		ticker.Stop()

		if c.conn != nil {
			c.conn.Close(websocket.StatusNormalClosure, "")
		}
	}()

	for {
		select {
		case event, ok := <-c.send:
			if !ok {
				return
			}

			writeCtx, cancelWrite := context.WithTimeout(ctx, writeWait)
			err := wsjson.Write(writeCtx, c.conn, event)

			cancelWrite()

			if err != nil {
				return
			}
		case <-ticker.C:
			pingCtx, cancelPing := context.WithTimeout(ctx, writeWait)
			err := c.conn.Ping(pingCtx)

			cancelPing()

			if err != nil {
				return
			}
		case <-ctx.Done():
			return
		}
	}
}

func (c *Client) close() {
	c.closeOnce.Do(func() {
		close(c.send)
	})
	if c.conn != nil {
		c.conn.Close(websocket.StatusNormalClosure, "")
	}
}

func ServeWs(hub *Hub, w http.ResponseWriter, r *http.Request, allowedOrigin string) {
	opts := &websocket.AcceptOptions{}
	if allowedOrigin == "" {
		opts.InsecureSkipVerify = true
	} else {
		opts.OriginPatterns = []string{allowedOrigin}
	}

	conn, err := websocket.Accept(w, r, opts)
	if err != nil {
		log.Printf("failed to accept websocket: %v", err)
		return
	}

	// Create a context that lasts as long as the connection
	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()

	client := &Client{
		hub:  hub,
		conn: conn,
		send: make(chan Event, 64),
	}
	client.hub.register <- client

	// Run pumps. readPump is blocking, writePump in goroutine
	done := make(chan struct{})
	go func() {
		client.writePump(ctx, cancel)
		close(done)
	}()

	client.readPump(ctx, cancel)
	<-done
}
