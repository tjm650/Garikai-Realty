#!/usr/bin/env bash
set -euo pipefail

# Source the existing student Supabase project from backend/student-realty.
# Only this project is staged for student CLI operations; main-realty is excluded.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STUDENT_BACKEND_DIR="$ROOT_DIR/backend/student-realty"
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
  echo "Blocked: database mutation/reconciliation is disabled until backend/student-realty/migrations history is fully recovered and reviewed." >&2
  exit 2
fi
if [[ "${1:-}" == "migration" && "${2:-}" =~ ^(up|repair|squash)$ ]]; then
  echo "Blocked: migration history is incomplete; do not replay or repair it automatically." >&2
  exit 2
fi

# Supabase CLI expects the project files in a supabase/ directory under workdir.
# Copy only from backend/student-realty; never mix in backend/main-realty.
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT
mkdir -p "$TEMP_DIR/supabase"
cp -R "$STUDENT_BACKEND_DIR/." "$TEMP_DIR/supabase/"
supabase --workdir "$TEMP_DIR" "$@"
