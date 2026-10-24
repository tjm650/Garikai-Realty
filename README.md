# Garikai Realty

Garikai Realty is an AI-powered student accommodation platform that helps students find suitable accommodation through WhatsApp conversations.

## Architecture

- **Frontend:** Next.js, React and TypeScript in `frontend/`; deployed independently on Vercel.
- **Backend and workflows:** Supabase Database and Supabase Edge Functions source are stored in `backend/`.
- **WhatsApp transport:** Meta WhatsApp Cloud API, with the public webhook source at `backend/functions/whatsapp-webhook`.
- **Privacy:** Public-facing privacy pages in `frontend/` and policy documents in `privacy/`.

The repository directory is named `backend/`, while the hosted backend remains Supabase. The Supabase CLI configuration lives at `backend/config.toml`. Use `./scripts/supabase.sh` from the repository root; it stages a temporary CLI-compatible `supabase/` directory and removes it afterwards. No permanent `supabase/` directory is required.

The Django backend and its Render deployment have been retired. Do not reintroduce Django as a dependency of the active Meta WhatsApp integration.

## Meta WhatsApp and Supabase

The Meta callback must continue pointing to the deployed Supabase `whatsapp-webhook` Edge Function. That function verifies Meta webhook signatures, records inbound events and delivery statuses, sends outbound messages through Meta's Graph API, and routes messages to the relevant Supabase Edge Functions.

Configure credentials as server-side Supabase Edge Function secrets, never in frontend code or committed files. These typically include the WhatsApp verification token, Meta app secret, access token, phone-number ID, and the internal provider webhook secret. See `backend/README.md` for the function map and deployment procedure.

## Project structure

```text
Garikai Realty/
├── frontend/   # Next.js website and privacy pages
├── backend/    # Supabase config, migrations and Edge Functions source
├── scripts/    # Supabase CLI compatibility wrapper
├── privacy/    # Privacy policy documents
├── docs/       # Release and migration reference material
├── .github/    # Repository automation
├── Makefile    # Frontend development shortcuts
└── README.md
```

## Frontend development

Requirements: Node.js 20 or a compatible supported version.

```bash
cd frontend
npm ci
npm run dev
```

Run frontend checks before submitting changes:

```bash
cd frontend
npm run lint
npm run build
```

## Supabase CLI

Authenticate once on your development machine with `supabase login`, then use the wrapper for CLI commands. For example:

```bash
./scripts/supabase.sh functions deploy whatsapp-webhook --project-ref fpktfufvnfauahriwjuf
```

Deploy one reviewed function at a time. The wrapper blocks database migration/push/reset/pull/repair/diff commands because the repository's historical migration source is incomplete. Do not bypass this safeguard until migration history has been recovered and reviewed. Never commit credentials.

## Operational notes

- Keep the public Meta webhook on Supabase; do not point Meta back to a retired Django endpoint.
- Keep WhatsApp credentials server-side.
- Preserve the existing Supabase schema, migrations, and active workflow functions unless a separate change explicitly authorizes modifying them.
- Payment processing remains a separate future phase.

This project is proprietary software. All rights reserved.
