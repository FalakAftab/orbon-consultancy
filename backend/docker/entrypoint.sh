#!/bin/sh
set -e

# Wait for the database to accept connections (useful when Postgres and the
# app start at roughly the same time, e.g. right after a Dokploy deploy).
if [ -n "$DB_HOST" ]; then
  echo "Waiting for database at ${DB_HOST}:${DB_PORT:-5432}..."
  ATTEMPTS=0
  until php -r "new PDO('pgsql:host=${DB_HOST};port=${DB_PORT:-5432};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}');" >/dev/null 2>&1; do
    ATTEMPTS=$((ATTEMPTS+1))
    if [ "$ATTEMPTS" -ge 30 ]; then
      echo "Database did not become ready in time, continuing anyway..."
      break
    fi
    sleep 2
  done
fi

php artisan config:cache
php artisan route:cache
# No php artisan view:cache: this is an API-only app with no resources/views
# directory, so that command fails outright (and would abort this script,
# since we run with set -e).
php artisan migrate --force
php artisan storage:link || true

exec "$@"
