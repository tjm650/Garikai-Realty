#!/usr/bin/env bash
set -euo pipefail

# Supabase CLI expects a ./supabase directory. The existing student project
# lives in ./student-realty; stage only that project so the future
# main-realty project can never be included in student CLI operations.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STUDENT_BACKEND_DIR="$ROOT_DIR/student-realty"
if [[ ! -d "$STUDENT_BACKEND_DIR" ]]; then
  echo "Student backend directory not found: $STUDENT_BACKEND_DIR" >&2
  exit 2
fi

if [[ $# -eq 0 ]]; then
  echo "Usage: scripts/supabase.sh <supabase-cli-command> [arguments...]" >&2
  echo "Example: scripts/supabase.sh functions deploy whatsapp-webhook --project-ref fpktfufvnfauahriwjuf" >&2
  exit 2
fi

# The checked-in student migration history is incomplete. Block commands that
# could mutate or reconcile a database until the migration baseline is recovered.
if [[ "${1:-}" == "db" && "${2:-}" =~ ^(push|reset|pull|repair|diff)$ ]]; then
  echo "Blocked: database mutation/reconciliation is disabled until student-realty/migrations history is fully recovered and reviewed." >&2
  exit 2
fi
if [[ "${1:-}" == "migration" && "${2:-}" =~ ^(up|repair|squash)$ ]]; then
  echo "Blocked: migration history is incomplete; do not replay or repair it automatically." >&2
  exit 2
fi

TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT
mkdir -p "$TEMP_DIR/supabase"
cp -R "$STUDENT_BACKEND_DIR/." "$TEMP_DIR/supabase/"

supabase --workdir "$TEMP_DIR" "$@"
