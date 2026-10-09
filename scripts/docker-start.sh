#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$ROOT/backend"
FRONTEND_DIR="$ROOT/frontend"
PORT="${PORT:-3000}"

cd "$BACKEND_DIR"
alembic upgrade head
PYTHONPATH=. python -m app.seed

uvicorn app.main:app --host 127.0.0.1 --port 8000 &
UVICORN_PID=$!

cd "$FRONTEND_DIR"
export BACKEND_URL="${BACKEND_URL:-http://127.0.0.1:8000}"
export HOSTNAME=0.0.0.0

cleanup() {
  kill "$UVICORN_PID" 2>/dev/null || true
}
trap cleanup EXIT

exec npm run start -- -p "$PORT" -H 0.0.0.0
