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
export NODE_ENV=production

cleanup() {
  kill "$UVICORN_PID" 2>/dev/null || true
}
trap cleanup EXIT

# Brief wait for API before Next proxies /api/* (avoids first health-check race)
for _ in $(seq 1 40); do
  if PYTHONPATH="$BACKEND_DIR" python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=1)" 2>/dev/null; then
    break
  fi
  sleep 0.25
done

if [[ ! -x "$FRONTEND_DIR/node_modules/.bin/next" ]]; then
  echo "Missing Next.js runtime at $FRONTEND_DIR/node_modules/.bin/next" >&2
  exit 1
fi

exec "$FRONTEND_DIR/node_modules/.bin/next" start -p "$PORT" -H 0.0.0.0
