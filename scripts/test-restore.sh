#!/bin/sh
set -eu
if [ -z "${1:-}" ]; then echo "Usage: $0 /chemin/database-TIMESTAMP.dump"; exit 1; fi
dump=$1; [ -f "$dump" ] || { echo "Dump introuvable"; exit 1; }; test_db="pulsefood_restore_test_$(date +%s)"
cleanup(){ docker compose exec -T db dropdb -U pulse --if-exists "$test_db" >/dev/null 2>&1 || true; }; trap cleanup EXIT INT TERM
docker compose exec -T db pg_restore --list < "$dump" >/dev/null; docker compose exec -T db createdb -U pulse "$test_db"; docker compose exec -T db pg_restore -U pulse -d "$test_db" --exit-on-error < "$dump"
tables=$(docker compose exec -T db psql -U pulse -d "$test_db" -Atc "select count(*) from information_schema.tables where table_schema='public'"); [ "$tables" -gt 0 ] || { echo "Restauration vide"; exit 1; }; echo "Restauration isolée validée : $tables tables"
