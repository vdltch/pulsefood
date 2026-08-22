#!/bin/sh
set -eu
mkdir -p backups
stamp=$(date +%Y%m%d-%H%M%S)
docker compose exec -T db pg_dump -U pulse -d pulsefood -Fc > "backups/pulsefood-$stamp.dump"
find backups -type f -name 'pulsefood-*.dump' -mtime +14 -delete
echo "Sauvegarde créée : backups/pulsefood-$stamp.dump"
