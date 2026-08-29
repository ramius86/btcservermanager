# --- Build Frontend ---
FROM node:26-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --ignore-scripts
COPY frontend/ ./
RUN npm run build

# --- Build Backend ---
FROM golang:1.27.0-alpine AS backend-build
WORKDIR /app/backend
COPY backend/go.* ./
RUN go mod download
COPY backend/ ./
ARG VERSION=dev
RUN go build -ldflags="-X 'btcservermanager/internal/domain/system.Version=${VERSION}'" \
    -o btcservermanager ./cmd/server/main.go

# --- Final Image ---
FROM cm2network/steamcmd:root AS runtime

USER root

# Install dependencies for Arma/DayZ, create app directories and ensure they're writable by steam user
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    tzdata \
    wget \
    && dpkg --add-architecture i386 \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
          expect \
          lib32gcc-s1 \
          lib32stdc++6  \
          libcap2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app /app/storage/logs /app/storage/data /home/steam/Steam \
    && chown -R steam:steam /app /home/steam

WORKDIR /app

# Copy binaries and frontend assets with correct ownership
COPY --chmod=555 --chown=steam:steam --from=backend-build /app/backend/btcservermanager ./
COPY --chmod=555 --chown=steam:steam --from=frontend-build /app/frontend/dist ./public

# Environment variables
ENV STEAMCMD_PATH=/home/steam/steamcmd/steamcmd.sh
ENV STORAGE_PATH=/app/storage
ENV PORT=8080
ENV HOME=/home/steam

EXPOSE 8080

USER steam

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT:-8080}/health" || exit 1

ENTRYPOINT ["./btcservermanager"]

