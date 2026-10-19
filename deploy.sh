#!/usr/bin/env bash
# Compila el sitio (base "/") y lo sincroniza con el servidor de producción (alias SSH: rox-prod).
set -euo pipefail

HOST="${DEPLOY_HOST:-rox-prod}"
DEST="/var/www/roxfinance/"

npm run build
rsync -az --delete dist/ "$HOST:$DEST"
ssh "$HOST" "chown -R www-data:www-data $DEST"
echo "Desplegado en $HOST:$DEST"
