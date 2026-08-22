#!/bin/sh
set -eu
project_dir=${PULSE_PROJECT_DIR:-/opt/pulsefood}; cd "$project_dir"
if curl -fsS --max-time 10 http://127.0.0.1:3000/api/health | grep -q status; then exit 0; fi
echo "Healthcheck en échec, redémarrage de l'application" >&2; docker compose restart app; sleep 10
curl -fsS --max-time 10 http://127.0.0.1:3000/api/health | grep -q status
