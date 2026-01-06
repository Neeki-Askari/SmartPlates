#!/usr/bin/env bash
set -euo pipefail

# Pull connection info from env (set in docker-compose)
CS="$ConnectionStrings__Default"
PGHOST=$(echo "$CS" | sed -n 's/.*Host=\([^;]*\).*/\1/p')
PGPORT=$(echo "$CS" | sed -n 's/.*Port=\([^;]*\).*/\1/p')
PGUSER=$(echo "$CS" | sed -n 's/.*Username=\([^;]*\).*/\1/p')
PGDB=$(echo "$CS" | sed -n 's/.*Database=\([^;]*\).*/\1/p')
PGPWD=$(echo "$CS" | sed -n 's/.*Password=\([^;]*\).*/\1/p')
export PGPASSWORD="$PGPWD"

echo "Waiting for Postgres at $PGHOST:$PGPORT ..."
until pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres; do
  sleep 2
done

# DEV ONLY: drop & recreate the app DB
echo "Recreating database '$PGDB' (dev only)..."
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -v ON_ERROR_STOP=1 <<SQL
-- terminate existing connections, then drop if exists
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$PGDB' AND pid <> pg_backend_pid();
DROP DATABASE IF EXISTS "$PGDB";
CREATE DATABASE "$PGDB";
SQL

# Run the API
echo "Starting API..."
cd /src/RecipeApi
exec dotnet run --urls=http://0.0.0.0:8080 --no-launch-profile
