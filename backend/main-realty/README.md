# Garikai Realty — Main Realty Backend

This directory is the scaffold for the future national Garikai Realty backend. It is deliberately separate from `students-realty`.

## Status

- Scaffold only; no production code or database migrations have been added.
- No Supabase project reference is configured yet.
- Do not point this directory at the student production project `fpktfufvnfauahriwjuf`.
- Create and verify the dedicated main-realty Supabase project before adding its project-specific `config.toml`, functions, migrations, or deployment commands.

## Planned contents

Use the standard Supabase CLI layout within this project directory:

- `config.toml` — main-realty project ref and Edge Function settings, added once the dedicated project exists.
- `functions/` — national realty APIs and configured city-specific WhatsApp bot workflows.
- `migrations/` — reviewed schema changes for the national realty database.

The main-realty system will serve as one national source of truth. Provinces, cities, suburbs, property types and bot assignments should be data/configuration, not separate backend projects per city.

Do not copy student accommodation functions or production migration history into this directory.
