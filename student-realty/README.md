# Garikai Realty — Students Realty Backend (Supabase)

This directory contains the existing production student accommodation backend source: Supabase Edge Functions, CLI configuration, and SQL migration files. It is maintained at the repository root so the student system has a clear, stable location separate from the future national realty backend scaffold.

## Production project
- Project ref: `fpktfufvnfauahriwjuf`
- This is the existing student system. Moving the source directory does not create or change the hosted Supabase project.
- Production schema and deployed function inventory are authoritative.
- Django is retired and out of scope.

## Supabase CLI configuration

`student-realty/config.toml` contains the project ref and per-function settings, including existing JWT-verification behavior and each function's Deno import-map file. The CLI conventionally expects a directory named `supabase/`, so use the repository wrapper from the repository root:

```bash
# Inspect CLI help through the student backend layout
./scripts/supabase.sh --help

# Deploy one explicitly selected function only
./scripts/supabase.sh functions deploy whatsapp-webhook --project-ref fpktfufvnfauahriwjuf
```

The wrapper stages only `student-realty/` as a temporary `supabase/` directory for the CLI and removes that temporary copy afterwards. It does not include `backend/main-realty/`. Authenticate the Supabase CLI first using `supabase login`; do not put access tokens in repository files.

**Production safety:** the checked-in migration history is incomplete. The wrapper intentionally blocks database migration/push/reset/pull/repair/diff operations until the missing historical migrations are recovered and reviewed. Deploy only a specific Edge Function after reviewing its source and confirming the required server-side secrets are configured. Do not deploy all functions as a batch.

## Function map
| Function | Responsibility |
|---|---|
| whatsapp-webhook | Meta webhook verification, inbound event ledger, delivery statuses, outbound messages and Student/Provider dispatch |
| student-accommodation-search | Student accommodation workflow, guided/all-in-one requirements, property results, selection and booking-request progression |
| property-search | Retained matching/ranking endpoint called by student-accommodation-search; do not merge or delete |
| student-my-bookings | Student booking history, linked by WhatsApp phone and conversation |
| provider-conversation | Provider identity gate and menu router |
| provider-manage-bookings | Provider pending booking review, accept/decline and student update |
| provider-manage-properties | Provider-owned property listing/details and availability toggle |
| provider-property-insights | Provider-owned property and booking summary |
| about-us | Shared company information endpoint |
| provider-booking-webhook | Legacy/internal provider booking RPC endpoint; retain until callers and compatibility are verified |
| jeff-conversation | Legacy Student conversation endpoint retained during transition |

## Security contract
- Public Meta webhook: JWT verification is disabled by design; Meta signature verification must remain enabled in the function.
- Internal functions: JWT verification is disabled only where server-to-server calls require it. The functions must validate the appropriate internal bearer token or `PROVIDER_WEBHOOK_SECRET` header.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.
- Provider mutations must filter by the provider ID resolved from the verified provider phone and must not trust a provider ID supplied by the caller.
- Never commit Supabase access tokens, database passwords, WhatsApp credentials, or other secrets.

## Migration notes
Production migration history contains versions whose original SQL is not all present in this repository. Do not fabricate historical migrations. Recover and compare the original migrations or a reviewed baseline before running any migration replay or database mutation commands. Add future database changes as new migration files and review them before production application.
