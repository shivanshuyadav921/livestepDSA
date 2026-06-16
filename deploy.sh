#!/usr/bin/env bash
set -euo pipefail

# ── AlgoChef Deployment Script ─────────────────────────────────
# Usage:
#   ./deploy.sh              — Build and start all services
#   ./deploy.sh --build      — Force rebuild images
#   ./deploy.sh --down       — Stop and remove all services
#   ./deploy.sh --logs       — Tail logs from all services
#   ./deploy.sh --migrate    — Run Prisma migrations
#   ./deploy.sh --status     — Show service status

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[deploy]${NC} $*"; }
warn() { echo -e "${YELLOW}[deploy]${NC} $*"; }
err() { echo -e "${RED}[deploy]${NC} $*" >&2; }

# Check prerequisites
check_prereqs() {
  if ! command -v docker &>/dev/null; then
    err "Docker is not installed. Please install Docker first."
    exit 1
  fi
  if ! docker compose version &>/dev/null; then
    err "Docker Compose v2 is not available."
    exit 1
  fi
  if [ ! -f "$ENV_FILE" ]; then
    warn ".env file not found. Copying from .env.production..."
    cp .env.production "$ENV_FILE"
    warn "Please edit .env and set a strong POSTGRES_PASSWORD before continuing."
    exit 1
  fi
}

# Run Prisma migrations
run_migrations() {
  log "Running Prisma migrations..."
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" run --rm api \
    sh -c "cd packages/database && npx prisma migrate deploy"
  log "Migrations complete."
}

# Build and start services
deploy() {
  local build_flag="${1:-}"
  log "Building and starting services..."
  if [ "$build_flag" = "--build" ]; then
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build
  else
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d
  fi
  log "Services started. Waiting for health checks..."
  sleep 5
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
  log "Deployment complete!"
  log "  Web:  http://localhost:3000"
  log "  API:  http://localhost:3001"
  log "  Health: http://localhost:3001/health"
}

# Stop services
stop() {
  log "Stopping services..."
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
  log "Services stopped."
}

# Tail logs
logs() {
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f
}

# Show status
status() {
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
}

# Main
check_prereqs

case "${1:-}" in
  --build)
    deploy --build
    ;;
  --down)
    stop
    ;;
  --logs)
    logs
    ;;
  --migrate)
    run_migrations
    ;;
  --status)
    status
    ;;
  *)
    deploy
    ;;
esac