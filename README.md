# Garikai Realty

Garikai Realty is an AI-powered student accommodation platform that helps students find suitable accommodation through WhatsApp conversations.

## Architecture

- **Frontend:** Next.js, React and TypeScript in `frontend/`; deployed independently on Vercel.
- **Backend and workflows:** Supabase Database and Supabase Edge Functions source are stored in `backend/`.
- **WhatsApp transport:** Meta WhatsApp Cloud API, with the public webhook source at `backend/functions/whatsapp-webhook`.
- **Privacy:** Public-facing privacy pages in `frontend/` and policy documents in `privacy/`.

The `backend/` directory contains the repository's Supabase migrations and Edge Function source. Renaming this folder does not rename or migrate the hosted Supabase project, deployed functions, database, secrets, or Meta webhook URL. The Supabase CLI and deployment scripts must be configured to use this non-default directory before running CLI-based deploy or migration commands.

The Django backend and its Render deployment have been retired from this repository. Do not reintroduce Django as a dependency of the active Meta WhatsApp integration.

## Meta WhatsApp and Supabase

The Meta callback must continue pointing to the deployed Supabase `whatsapp-webhook` Edge Function. That function verifies Meta webhook signatures, records inbound events and delivery statuses, sends outbound messages through Meta's Graph API, and routes messages to the relevant Supabase Edge Functions.

Configure credentials as server-side Supabase Edge Function secrets, never in frontend code or committed files. These typically include the WhatsApp verification token, Meta app secret, access token, phone-number ID, and the internal provider webhook secret. Follow `backend/README.md` and the release checklist in `docs/` for the current function map and deployment checks.

## Project structure

```text
Garikai Realty/
├── frontend/   # Next.js website and privacy pages
├── backend/    # Supabase migrations and Edge Functions source
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

## Supabase development and deployment

Use the Supabase CLI and the project-specific instructions in `backend/README.md`. The repository folder is named `backend/`, but the hosted backend remains Supabase. Review migrations before applying them to a live project. Ensure the CLI/deployment tooling is explicitly pointed at this folder before deploying functions or applying migrations. Never commit credentials.

## Operational notes

- Keep the public Meta webhook on Supabase; do not point Meta back to a retired Django endpoint.
- Keep WhatsApp credentials server-side.
- Preserve the existing Supabase schema, migrations, and active workflow functions unless a separate change explicitly authorizes modifying them.
- Payment processing remains a separate future phase.

This project is proprietary software. All rights reserved.
