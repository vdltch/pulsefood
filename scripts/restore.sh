#!/bin/sh
set -eu
if [ "${1:-}" != "--confirm" ] || [ -z "${2:-}" ]; then echo "Usage: $0 --confirm /chemin/database-TIMESTAMP.dump [uploads-TIMESTAMP.tar.gz]"; exit 1; fi
project_dir=${PULSE_PROJECT_DIR:-/opt/pulsefood}; database_file=$2; uploads_file=${3:-}
[ -f "$database_file" ] || { echo "Dump introuvable"; exit 1; }; cd "$project_dir"
docker compose exec -T db pg_restore --list < "$database_file" >/dev/null
docker compose exec -T db dropdb -U pulse --if-exists pulsefood
docker compose exec -T db createdb -U pulse pulsefood
docker compose exec -T db pg_restore -U pulse -d pulsefood --clean --if-exists < "$database_file"
if [ -n "$uploads_file" ]; then [ -f "$uploads_file" ] || { echo "Archive uploads introuvable"; exit 1; }; docker compose exec -T app tar -xzf - -C /app/public/uploads < "$uploads_file"; fi
docker compose restart app; echo "Restauration terminée. Vérifie immédiatement /api/health."
