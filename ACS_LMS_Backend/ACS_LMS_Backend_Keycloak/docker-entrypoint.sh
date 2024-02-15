#!/bin/bash
set -e

initdb -D /var/lib/postgres/data


pg_ctl -D "/var/lib/postgres/data" -o "-c listen_addresses=''" -w start

# start postgres
# run your SQL commands
  echo "Test test test"
psql -h localhost -U postgres -d keycloak -c "CREATE ROLE keycloak WITH LOGIN PASSWORD 'password' CREATEDB CREATEROLE;"
psql -h localhost -U postgres -d keycloak -c "GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;"

# continue with the main command
exec "$@"
