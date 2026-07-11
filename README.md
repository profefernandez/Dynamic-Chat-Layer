# Dynamic Chat Layer

A full-stack TypeScript platform for dynamic, editable websites with integrated AI chat, content management, and admin tools. Built with React + Vite (frontend), Express + Drizzle (API), Postgres, Clerk auth, and Gemini AI.

## Self-Hosting (Recommended)

This project was originally developed on Replit. The changes below make it portable to any standard server (VPS, ScalaHosting, Docker, etc.).

### 1. Prerequisites
- Node.js 20+ (or use Docker)
- pnpm 9+
- PostgreSQL database (your ScalaHosting DB on port 6543 works)
- Clerk account (for authentication)
- Google Gemini API key (for image generation)
- Google Cloud Storage bucket (for file uploads) — note: some Replit-specific credential code may need small updates for full production use

### 2. Environment Variables

```bash
cp .env.example .env
# Edit .env with your real values (never commit secrets)
```

Key variables:
- `DATABASE_URL` — your Postgres connection string
- `CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`
- `AI_INTEGRATIONS_GEMINI_API_KEY`
- Object storage paths

Set these in your hosting control panel (sPanel) or Docker.

### 3. Build

```bash
pnpm install
pnpm run build          # typecheck + build all packages
```

Frontend builds to `artifacts/lemonade-chat/dist/public`.
API builds to `artifacts/api-server/dist/index.mjs`.

### 4. Run the API Server

```bash
cd artifacts/api-server
node dist/index.mjs
```

Or use PM2 / your hosting's Node process manager.

### 5. Serve the Frontend

Options:
- Use your web server (Nginx/Caddy) to serve the static files from `artifacts/lemonade-chat/dist/public`
- Or enhance the Express app to serve static files from a `public` folder

### 6. Database

```bash
cd lib/db
pnpm run push   # or use proper migrations
```

### Docker (Easiest for most servers)

```bash
# Coming soon - Dockerfile and docker-compose.yml will be added
# For now you can build and run the services manually as above
```

## Development (original Replit flow)

See `replit.md` for original dev commands.

## Architecture

- `artifacts/lemonade-chat` — Main React frontend + admin UI
- `artifacts/api-server` — Express backend (chat, content, elements, images, storage)
- `lib/*` — Shared packages (DB, API client, Gemini integration, object storage)

## Notes for Self-Hosting on ScalaHosting / Custom Domain

- Clerk proxy (`/api/__clerk`) already supports custom domains via `x-forwarded-*` headers.
- Set proper allowed origins in your Clerk dashboard.
- Object storage currently has some Replit sidecar code. For full self-host you may want to update `artifacts/api-server/src/lib/objectStorage.ts` to use standard `@google-cloud/storage` credentials + native `getSignedUrl()`.

## Next Steps / Roadmap

- Full multi-stage Dockerfile + docker-compose
- Improved object storage for standard GCS / S3
- Production logging, healthchecks, and deployment scripts

Built with human-centered AI principles.
