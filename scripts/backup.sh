#!/bin/sh
set -eu
project_dir=${PULSE_PROJECT_DIR:-/opt/pulsefood}
backup_dir=${PULSE_BACKUP_DIR:-$project_dir/backups}
mkdir -p "$backup_dir"; chmod 700 "$backup_dir"; stamp=$(date -u +%Y%m%d-%H%M%S)
database_file="$backup_dir/database-$stamp.dump"; uploads_file="$backup_dir/uploads-$stamp.tar.gz"
cd "$project_dir"
docker compose exec -T db pg_dump -U pulse -d pulsefood -Fc > "$database_file"
docker compose exec -T app tar -czf - -C /app/public/uploads . > "$uploads_file"
docker compose exec -T db pg_restore --list < "$database_file" >/dev/null
sha256sum "$database_file" "$uploads_file" > "$backup_dir/checksums-$stamp.sha256"
find "$backup_dir" -type f \( -name 'database-*.dump' -o -name 'uploads-*.tar.gz' -o -name 'checksums-*.sha256' \) -mtime +14 -delete
echo "Sauvegarde vérifiée : $stamp"
