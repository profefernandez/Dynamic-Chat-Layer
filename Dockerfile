# ============================================================
# Dynamic Chat Layer - Dockerfile (Self-hosted / Production)
# Builds the API server + shared libraries
# ============================================================

FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tsconfig*.json ./

# Copy all package.json files for dependency resolution
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY lib/db/package.json ./lib/db/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/integrations-gemini-ai/package.json ./lib/integrations-gemini-ai/
COPY lib/object-storage-web/package.json ./lib/object-storage-web/

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY . .

# Build shared libraries and the API server
RUN pnpm --filter @workspace/db build || true
RUN pnpm --filter @workspace/api-zod build || true
RUN pnpm --filter @workspace/integrations-gemini-ai build || true
RUN pnpm --filter @workspace/api-server build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built API
COPY --from=builder /app/artifacts/api-server/dist ./dist
COPY --from=builder /app/artifacts/api-server/package.json ./package.json

# Copy node_modules (production only)
COPY --from=deps /app/node_modules ./node_modules

# Expose API port
EXPOSE 5000

CMD ["node", "dist/index.mjs"]
