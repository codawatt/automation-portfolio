#!/bin/bash
set -euo pipefail

psql -v ON_ERROR_STOP=1 \
     -v n8n_password="$N8N_DB_PASSWORD" \
     -v app_db="$POSTGRES_DB" \
     --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'EOSQL'
CREATE ROLE n8n WITH LOGIN PASSWORD :'n8n_password';
CREATE DATABASE n8n OWNER n8n;
REVOKE CONNECT ON DATABASE :"app_db" FROM PUBLIC;
EOSQL
