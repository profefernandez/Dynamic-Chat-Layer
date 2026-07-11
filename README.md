# Dynamic Chat Layer

Full-stack platform for dynamic editable websites with AI chat, content management, and admin tools.

**Replit has been removed** from the core functionality. The project now supports normal self-hosted servers and Docker.

## Quick Start (Self-Hosted)

### 1. Environment Variables

```bash
cp .env.example .env
# Edit .env with your real values (Clerk, Gemini, DATABASE_URL, etc.)
```

### 2. Build

```bash
pnpm install
pnpm run build
```

### 3. Run with Docker (Recommended)

```bash
# Build and start the API
docker compose up -d --build

# View logs
docker compose logs -f api
```

The API will be available on port 5000.

### 4. Without Docker

```bash
cd artifacts/api-server
node dist/index.mjs
```

Serve the built frontend (`artifacts/lemonade-chat/dist/public`) with Nginx, Caddy, or your hosting's static file serving.

## Database

This project uses your external Postgres (ScalaHosting on port 6543 is supported).
Set `DATABASE_URL` in your environment.

## Important Notes

- **Object Storage**: Uses Google Cloud Storage. On self-hosted servers it uses standard credentials (`GOOGLE_APPLICATION_CREDENTIALS` or ADC). Make sure your service account has proper permissions for the buckets.
- **Clerk Auth**: Works with custom domains. The proxy at `/api/__clerk` is already production-ready.
- **Frontend**: Built with Vite. Output is in `artifacts/lemonade-chat/dist/public`.

## Project Structure

- `artifacts/lemonade-chat` — React frontend + admin UI
- `artifacts/api-server` — Express backend
- `lib/*` — Shared libraries (DB, API client, Gemini, storage)

## Files Added for Self-Hosting

- `Dockerfile`
- `docker-compose.yml`
- `.env.example`
- `README.md` (this file)

Replit-specific code has been made conditional or removed where possible.
