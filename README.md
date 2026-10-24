# Garikai Realty

Garikai Realty is an AI-powered student accommodation platform that helps students find suitable accommodation through WhatsApp conversations, with a separate backend area reserved for future national realty capabilities.

## Architecture

- **Frontend:** Next.js, React and TypeScript in `frontend/`; deployed independently on Vercel.
- **Student system:** Existing production Supabase functions, configuration and migrations live in `student-realty/`.
- **Main realty system:** `backend/main-realty/` is the separate starting point for the future national realty backend. It is intentionally not connected to a Supabase project yet.
- **WhatsApp transport:** Meta WhatsApp Cloud API, with the public webhook source at `student-realty/functions/whatsapp-webhook`.
- **Privacy:** Public-facing privacy pages in `frontend/` and policy documents in `privacy/`.

The student system source is maintained in [`student-realty/`](https://github.com/tjm650/Jeff/tree/main/student-realty). The future national backend scaffold remains in `backend/main-realty/`. The repository separates these two systems in source control. The hosted student backend remains the existing Supabase project `fpktfufvnfauahriwjuf`; moving its source directory does not create a new Supabase project or deploy any code. The CLI wrapper stages only `student-realty/` as a temporary CLI-compatible `supabase/` directory. No permanent `supabase/` directory is required.

The Django backend and its Render deployment have been retired. Do not reintroduce Django as a dependency of the active Meta WhatsApp integration.

## Meta WhatsApp and Supabase

The Meta callback must continue pointing to the deployed Supabase `whatsapp-webhook` Edge Function. That function verifies Meta webhook signatures, records inbound events and delivery statuses, sends outbound messages through Meta's Graph API, and routes messages to the relevant Supabase Edge Functions.

Configure credentials as server-side Supabase Edge Function secrets, never in frontend code or committed files. These typically include the WhatsApp verification token, Meta app secret, access token, phone-number ID, and the internal provider webhook secret. See `student-realty/README.md` for the function map and deployment procedure.

## Project structure

```text
Garikai Realty/
├── frontend/                 # Next.js website and privacy pages
├── backend/
├── student-realty/          # Existing student accommodation Supabase project source
│   ├── functions/
│   ├── migrations/
│   └── config.toml
└── backend/
    └── main-realty/          # Scaffold for the future national realty backend
├── scripts/                  # Supabase CLI compatibility wrapper
├── privacy/                  # Privacy policy documents
├── docs/                     # Release and migration reference material
├── .github/                  # Repository automation
├── Makefile                  # Frontend development shortcuts
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

## Student Supabase CLI

Authenticate once on your development machine with `supabase login`, then use the wrapper for student backend CLI commands. For example:

```bash
./scripts/supabase.sh functions deploy whatsapp-webhook --project-ref fpktfufvnfauahriwjuf
```

Deploy one reviewed function at a time. The wrapper blocks database migration/push/reset/pull/repair/diff commands because the repository's historical migration source is incomplete. Do not bypass this safeguard until migration history has been recovered and reviewed. Never commit credentials.

## Operational notes

- Keep the public Meta webhook on Supabase; do not point Meta back to a retired Django endpoint.
- Keep WhatsApp credentials server-side.
- Preserve the existing Supabase schema, migrations, and active workflow functions unless a separate change explicitly authorizes modifying them.
- The main-realty scaffold must not be connected to or deployed against the student production project.
- Payment processing remains a separate future phase.

This project is proprietary software. All rights reserved.
