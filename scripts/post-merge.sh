#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push
if [ -n "$DATABASE_URL" ]; then
  psql "$DATABASE_URL" -f scripts/seed-site-settings.sql
fi
