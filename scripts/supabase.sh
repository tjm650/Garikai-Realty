#!/usr/bin/env bash
set -euo pipefail

# Supabase CLI expects a ./supabase directory. The repository intentionally
# stores that directory's contents in ./backend, so stage a temporary CLI
# project without reintroducing a permanent ./supabase directory.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ $# -eq 0 ]]; then
  echo "Usage: scripts/supabase.sh <supabase-cli-command> [arguments...]" >&2
  echo "Example: scripts/supabase.sh functions deploy whatsapp-webhook --project-ref fpktfufvnfauahriwjuf" >&2
  exit 2
fi

# The checked-in migration history is incomplete. Block commands that could
# mutate or reconcile a database until the migration baseline is recovered.
if [[ "${1:-}" == "db" && "${2:-}" =~ ^(push|reset|pull|repair|diff)$ ]]; then
  echo "Blocked: database mutation/reconciliation is disabled until backend/migrations history is fully recovered and reviewed." >&2
  exit 2
fi
if [[ "${1:-}" == "migration" && "${2:-}" =~ ^(up|repair|squash)$ ]]; then
  echo "Blocked: migration history is incomplete; do not replay or repair it automatically." >&2
  exit 2
fi

TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT
mkdir -p "$TEMP_DIR/supabase"
cp -R "$ROOT_DIR/backend/." "$TEMP_DIR/supabase/"

supabase --workdir "$TEMP_DIR" "$@"
