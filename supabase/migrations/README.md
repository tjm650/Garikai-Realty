# Supabase Migration Inventory and Recovery Notes

This file records production migration history for project `fpktfufvnfauahriwjuf`. Django is explicitly out of scope.

## Production migration history (read from Supabase on 2026-10-21)

| Production version | Name | Source status on main |
|---|---|---|
| 20260812104549 | initial_jeff_core_schema | Historical SQL not found on main |
| 20260812104918 | align_core_schema_with_django_inventory | Candidate source exists on branch `agent/migrate-to-supabase-foundation` under a different filename/version; not copied into active migrations pending schema-diff review |
| 20260812105223 | conversation_workflow_primitives | Candidate source exists on branch `agent/migrate-to-supabase-foundation` under a different filename/version; not copied into active migrations pending schema-diff review |
| 20260812105405 | property_matching_rpc | Candidate source exists on branch `agent/migrate-to-supabase-foundation` under a different filename/version; not copied into active migrations pending schema-diff review |
| 20260812105634 | booking_provider_payment_workflow | Candidate source exists on branch `agent/migrate-to-supabase-foundation` under a different filename/version; not copied into active migrations pending schema-diff review |
| 20260812111440 | harden_payment_confirmation_idempotency | Historical SQL not found on main |
| 20260812144053 | add_provider_insights_rpc | Historical SQL not found on main |
| 20260814095040 | whatsapp_transport_ledger | Main has a candidate file named `20260814120000_whatsapp_transport_ledger.sql`; filename version differs from production |
| 20260815114316 | remove_unused_token_entitlement_tables | Historical SQL not found on main |
| 20261021162623 | restrict_anonymous_provider_booking_response | Historical SQL not found on main |
| 20261021185923 | secure_privileged_rpcs_and_private_transport_tables | Tracked in main with matching version |
| 20261021185937 | allow_trusted_service_role_provider_booking_rpc | Tracked in main with matching version |
| 20261021190232 | remove_excess_public_table_privileges | Tracked in main with matching version |
| 20261021190609 | restrict_payment_and_provider_insights_rpcs_to_server | Tracked in main with matching version |
| 20261021190827 | index_uncovered_foreign_keys | Tracked in main with matching version |

## Why the old migration candidates are not automatically copied into the active folder

The foundation branch contains four historical SQL files, but their version identifiers differ from production's migration history. Renaming them into the active migration directory without comparing their effects to the live schema could make a fresh database replay duplicate or conflicting DDL. Keep those files on the source branch as recovery candidates until a schema diff proves which exact production migration each represents.

## Required completion work

1. Recover the initial schema and the missing historical SQL from commit history, branch files, or an approved schema export.
2. Compare every recovered migration against the production schema, RPC definitions, grants, policies and constraints.
3. Keep active migration filenames aligned with the versions recorded by Supabase.
4. Run a clean local reset/replay only after the history is reconciled; do not run this incomplete history against production.
5. Add every future database change as a versioned migration and commit it with the code that depends on it.
