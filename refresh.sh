#!/usr/bin/env bash
# Manual weekly refresh for the AI Tools Directory Index.
#
# Requirements:
#   - A checkout of the AIToolbox site repo (contains scripts/export-public-index.mjs)
#   - Node.js 20+ with that repo's dependencies installed (npm ci)
#   - A read-only Postgres URL in an env file, under one of these names:
#       SUPABASE_DATABASE_URL   (preferred)
#       DATABASE_URL
#   - Never commit the env file. This repo's .gitignore excludes .env files.
#
# Usage:
#   AITOOLBOX_REPO=/path/to/ai-tools-website ./refresh.sh
#
# Optional:
#   AITOOLBOX_ENV_FILE=/path/to/env-file   (default: $AITOOLBOX_REPO/.env.local)
#
# The script prints no credential values. Review data/ changes, then commit.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
: "${AITOOLBOX_REPO:?set AITOOLBOX_REPO to the ai-tools-website checkout}"
ENV_FILE="${AITOOLBOX_ENV_FILE:-$AITOOLBOX_REPO/.env.local}"
EXPORTER="$AITOOLBOX_REPO/scripts/export-public-index.mjs"

if [ ! -f "$EXPORTER" ]; then
  echo "missing exporter: $EXPORTER" >&2
  exit 1
fi
if [ ! -f "$ENV_FILE" ]; then
  echo "missing env file: $ENV_FILE" >&2
  echo "it must define SUPABASE_DATABASE_URL or DATABASE_URL (read-only)" >&2
  exit 1
fi
if ! command -v node >/dev/null 2>&1; then
  echo "node is required" >&2
  exit 1
fi

echo "refresh: exporting to $ROOT/data"
node "$EXPORTER" --env-file "$ENV_FILE" --out-dir "$ROOT/data"
node "$EXPORTER" --check-pii --out-dir "$ROOT/data"
node "$ROOT/scripts/validate.mjs"

echo
echo "refresh: done. Review the diff, then commit and push:"
echo "  git -C \"$ROOT\" diff --stat -- data/"
echo "  git -C \"$ROOT\" add data/"
echo "  git -C \"$ROOT\" commit -m \"data: weekly refresh\""
echo "  git -C \"$ROOT\" push"
