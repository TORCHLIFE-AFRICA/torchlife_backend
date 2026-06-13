#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PORT=${PORT:-3000}
APP_HEALTHCHECK_URL=${APP_HEALTHCHECK_URL:-http://127.0.0.1:${PORT}/api/health}

node "$SCRIPT_DIR/verify-db.mjs"
node "$SCRIPT_DIR/verify-redis.mjs"

echo "Validating application health endpoint at ${APP_HEALTHCHECK_URL}..."
curl -fsS "$APP_HEALTHCHECK_URL"
echo
echo "Stack validation passed."
