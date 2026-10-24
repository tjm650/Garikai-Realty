# Garikai Realty Backend (Supabase)

This directory contains the repository source for the hosted Supabase backend: Edge Functions and SQL migrations. The folder name is `backend/` for project organization; the deployed platform remains Supabase.

## Production project
- Project ref: fpktfufvnfauahriwjuf
- Production schema and deployed function inventory are authoritative until repository recovery is complete.
- Django is retired and out of scope.

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
| jeff-conversation | Legacy Student conversation endpoint retained during transition; webhook now defaults to student-accommodation-search |

## Internal security contract
- Public Meta webhook: JWT verification is disabled by design; Meta signature verification is required in the function.
- Student/Provider internal functions: JWT verification is disabled only because these are server-to-server endpoints. They must validate the appropriate internal bearer token or PROVIDER_WEBHOOK_SECRET header.
- Never expose SUPABASE_SERVICE_ROLE_KEY to browser code.
- Provider mutations must filter by the provider ID resolved from the verified provider phone and must not trust a provider ID supplied by the caller.

## Migration notes
- Production had ten migrations before this implementation wave.
- The source repository previously tracked fewer migration files than production. Do not fabricate historical migrations. Capture the live schema baseline and recover original migrations where possible.
- New database changes must be added as migration files and verified against production.

## Deployment caution
The Supabase CLI normally expects a `supabase/` directory. Since this repository stores the source in `backend/`, do not run CLI deploy or migration commands until the CLI/deployment workflow is explicitly configured for the renamed directory. This folder rename does not change deployed Supabase resources.
