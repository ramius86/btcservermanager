# --- Build Frontend ---
FROM node:26-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --ignore-scripts
COPY frontend/ ./
RUN npm run build

# --- Build Backend ---
FROM golang:1.26.8-alpine AS backend-build
WORKDIR /app/backend
COPY backend/go.* ./
RUN go mod download
COPY backend/ ./
ARG VERSION=dev
RUN go build -ldflags="-X 'btcservermanager/internal/domain/system.Version=${VERSION}'" \
    -o btcservermanager ./cmd/server/main.go

# --- Final Image ---
FROM ghcr.io/steamcmd/steamcmd:debian-13 AS runtime

USER root

# Create unprivileged steam user (UID 1000) and install dependencies for Arma/DayZ
RUN useradd -u 1000 -m -s /bin/bash steam \
    && dpkg --add-architecture i386 \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
          ca-certificates \
          expect \
          lib32gcc-s1 \
          lib32stdc++6 \
          libavahi-client3 \
          libavahi-client3:i386 \
          libavahi-common3 \
          libavahi-common3:i386 \
          libcap2 \
          tzdata \
          wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app /app/storage/logs /app/storage/data /home/steam/Steam \
    && chown -R steam:steam /app /home/steam

WORKDIR /app

# Copy binaries and frontend assets with correct ownership
COPY --chmod=555 --chown=steam:steam --from=backend-build /app/backend/btcservermanager ./
COPY --chmod=555 --chown=steam:steam --from=frontend-build /app/frontend/dist ./public

# Environment variables
ENV STEAMCMD_PATH=/usr/games/steamcmd
ENV STORAGE_PATH=/app/storage
ENV PORT=8080
ENV HOME=/home/steam

EXPOSE 8080

USER steam

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT:-8080}/health" || exit 1

ENTRYPOINT ["./btcservermanager"]

