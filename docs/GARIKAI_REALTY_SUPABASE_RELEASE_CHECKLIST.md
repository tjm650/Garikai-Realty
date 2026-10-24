# Production completion checklist — Garikai Realty Supabase

Scope is Supabase Edge Functions and database only. Django is explicitly excluded. The existing student function and migration source is in `student-realty/`; `backend/main-realty/` is a separate scaffold and is not part of the existing student deployment.

## Current inventory

- Production migration ledger: 15 entries (verified 2026-10-21).
- Dedicated workflow functions: `student-accommodation-search`, `student-my-bookings`, `about-us`, `provider-manage-bookings`, `provider-manage-properties`, `provider-property-insights`.
- Existing transport/orchestration functions remain: `whatsapp-webhook`, `jeff-conversation` (legacy compatibility path), `provider-conversation`, `provider-booking-webhook`, and `property-search`.
- `property-search` is intentionally retained and is not merged into accommodation search.

## Migration recovery status

Four SQL candidates from `agent/migrate-to-supabase-foundation` have been copied to `docs/supabase-migration-recovery/`. They are explicitly marked candidate-only and are NOT active migrations. Production versions differ from the source filenames and initial schema plus several historical migrations remain unrecovered. Do not run `supabase db reset`, replay this incomplete history against production, or promote candidates until each has been compared to the live schema, functions, policies, constraints and grants.

The active student migration directory is `student-realty/migrations/` and contains the transport-ledger migration and the October security/performance migrations. The October migrations have already been applied to production and tracked in GitHub. Future schema changes must use new migrations; do not rewrite historical applied migrations to match current source. The Supabase CLI normally expects `supabase/`; the repository wrapper stages only `student-realty/` as the CLI project.

## Mandatory pre-release environment checks

The internal calls from `whatsapp-webhook` to student workflow endpoints pass `x-jeff-provider-secret`, and the receiving endpoints reject requests when `PROVIDER_WEBHOOK_SECRET` is absent or mismatched. Confirm that the same strong secret is configured in the Supabase Edge Function secrets for the webhook and every internal receiving function before treating student routing as production-ready. Never commit the secret or place it in client-side code. This connector does not expose secret-value verification.

## End-to-end release test matrix

Run with a dedicated test WhatsApp number and disposable test records. Record timestamps, function logs, expected and actual outcomes, and the WhatsApp message IDs. Do not use a real customer booking or payment as a test.

| ID | Test | Pass criteria |
|---|---|---|
| W-01 | WhatsApp webhook verification challenge | Valid Meta verification succeeds; invalid challenge fails safely. |
| W-02 | Student main menu | Student menu appears and each menu selection dispatches to the correct function. |
| W-03 | Accommodation search | Search criteria persist; `student-accommodation-search` calls retained `property-search`; results are filtered/ranked correctly. |
| W-04 | Property selection | Selecting a returned property preserves its exact property ID and advances to booking details without losing conversation state. |
| W-05 | My Bookings | Student sees only their own bookings and useful status/date/property details. |
| W-06 | About Us | Shared About Us content works from both menus. |
| W-07 | Provider menu | Only verified, active provider numbers receive provider functions. Unknown/unverified numbers are denied. |
| W-08 | Provider booking list | Provider sees only bookings linked to their provider ID. |
| W-09 | Accept booking | Only the owning provider can accept; state transition and student notification occur once. |
| W-10 | Decline booking | Only the owning provider can decline; state transition and student notification occur once. |
| W-11 | Property management | Provider can list and update only properties they own; invalid property IDs are rejected. |
| W-12 | Property insights | Metrics match database records; valid updates persist; malformed JSON and invalid numeric values are rejected safely. |
| W-13 | Unauthorized internal request | Calls without the shared secret return 401 and make no database changes. |
| W-14 | Duplicate webhook delivery | Replaying the same Meta event does not duplicate messages, bookings, state changes or notifications. |
| W-15 | Notification failure | Failed WhatsApp delivery is logged and can be retried without repeating the business action. |
| W-16 | Legacy endpoint compatibility | Existing integrations relying on `jeff-conversation` continue to behave as documented or are intentionally redirected. |

## Required automated checks

1. Run `deno check` against each function entrypoint with its import map.
2. Run lint/type checks and unit tests for parsing, routing, ownership guards and idempotency.
3. Run a clean local Supabase migration replay only after the full historical baseline is recovered and the CLI is configured for the student project.
4. Check Supabase security and performance advisors after the final changes.
5. Confirm production logs for each test case and capture the exact deployed function versions.
6. Verify rollback by redeploying the previous known-good function source and documenting the migration forward-fix strategy.

## Sign-off rule

Do not mark production sign-off complete until migration replay has been verified in a clean disposable database, the shared secret is confirmed configured, all critical test cases pass, and remaining security-advisor findings are either fixed or explicitly accepted with documented rationale. Deployment success alone is not an end-to-end test.
