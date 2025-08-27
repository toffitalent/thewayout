#!/bin/sh
set -o errexit
set -o pipefail
set -u

DB_HOST=${API_DB_HOSTNAME:-}
DB_PORT=${API_DB_PORT:=5432}
NO_MIGRATE=${API_DB_NO_MIGRATE:-}

# Run database migrations
if [ -n "$DB_HOST" ] && [ -z "$NO_MIGRATE" ]; then
  ../../wait-for $DB_HOST:$DB_PORT --timeout=30 -- yarn run db:migrate
fi

exec "$@"
