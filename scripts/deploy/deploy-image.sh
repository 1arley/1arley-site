#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
PROD_ENV_FILE="${ROOT_DIR}/.env.prod"
DEPLOY_ENV_FILE="${SCRIPT_DIR}/.env.deploy"

if [ ! -f "$PROD_ENV_FILE" ]; then
  echo "❌ Arquivo .env.prod não encontrado em ${PROD_ENV_FILE}"
  echo "   Copie .env.prod.example para .env.prod na raiz do projeto e preencha os valores."
  exit 1
fi

if [ ! -f "$DEPLOY_ENV_FILE" ]; then
  echo "❌ Arquivo .env.deploy não encontrado em ${DEPLOY_ENV_FILE}"
  echo "   Copie scripts/deploy/.env.deploy.example para scripts/deploy/.env.deploy e preencha os valores."
  exit 1
fi

set -a
source <(sed 's/\r$//' "$PROD_ENV_FILE")
source <(sed 's/\r$//' "$DEPLOY_ENV_FILE")
set +a

cd "$ROOT_DIR"

OUTPUT_DIR="${ROOT_DIR}/images"
OUTPUT_FILE="${OUTPUT_DIR}/${IMAGE_NAME}.tar.gz"

echo "🔨 Buildando imagem com docker compose..."
docker compose --env-file "$PROD_ENV_FILE" -f docker-compose.prod.yml build

echo "📦 Exportando imagem para ${OUTPUT_FILE}..."
mkdir -p "$OUTPUT_DIR"
docker save "${IMAGE_NAME}:${IMAGE_TAG}" | gzip > "$OUTPUT_FILE"

echo "🚀 Enviando para a VPS via rsync..."
rsync -avz --progress \
  -e "ssh" \
  "$OUTPUT_FILE" \
  "${VPS_USER}@${VPS_HOST}:${VPS_DEST}/"

echo "✅ Concluído! Imagem disponível na VPS em ${VPS_DEST}"