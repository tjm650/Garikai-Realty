# Garikai Realty Frontend

The Garikai Realty website is a Next.js application that presents the student accommodation platform, its information, and its privacy policy.

## Technology

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Motion animations
- Font Awesome icons
- DOMPurify and sanitize-html for safe content rendering

## Project structure

```text
frontend/
├── app/
│   ├── components/       # Shared navigation and footer
│   ├── controller/       # Next.js route handlers
│   ├── pages/home/       # Landing page content
│   ├── pages/privacy/    # Privacy page content
│   └── privacy/          # /privacy route
├── public/               # Static images, icons, and media
├── package.json
└── next.config.ts
```

## Local development

Requirements: Node.js 20 or a compatible supported version.

```bash
npm ci
npm run dev
```

Open http://localhost:3000 in your browser.

## Checks

```bash
npm run lint
npm run build
```

## Pages

- `/` — Garikai Realty landing page
- `/privacy` — privacy policy

## Deployment and architecture

The frontend is deployed through Vercel. The active WhatsApp conversation workflows and Meta WhatsApp webhook are handled by Supabase Edge Functions; Meta's webhook must point to `supabase/functions/whatsapp-webhook`. This frontend does not use a Django backend.

Keep credentials and service-role secrets out of frontend code. Public environment variables should contain only values safe to expose to website visitors.
