# ── Stage 1: Install dependencies ──────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy workspace root manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy only the package.json files needed for dependency resolution
COPY packages/database/package.json ./packages/database/
COPY packages/prompts/package.json ./packages/prompts/
COPY packages/recipe-engine-core/package.json ./packages/recipe-engine-core/
COPY apps/api/package.json ./apps/api/

# Install dependencies (no lockfile freeze in CI-like builds; adjust as needed)
RUN pnpm install --frozen-lockfile

# ── Stage 2: Build workspace packages + API ────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=deps /app/packages/prompts/node_modules ./packages/prompts/node_modules
COPY --from=deps /app/packages/recipe-engine-core/node_modules ./packages/recipe-engine-core/node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

COPY . .

# Generate Prisma client
RUN cd packages/database && npx prisma generate

# Build internal packages first (turbo respects dependsOn)
RUN pnpm turbo build --filter=@algochef/database... --filter=@algochef/api...

# ── Stage 3: Production image ──────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl curl
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

ENV NODE_ENV=production

# Copy only production node_modules and built artifacts
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json

COPY --from=builder /app/packages/prompts/dist ./packages/prompts/dist
COPY --from=builder /app/packages/prompts/node_modules ./packages/prompts/node_modules
COPY --from=builder /app/packages/prompts/package.json ./packages/prompts/package.json

COPY --from=builder /app/packages/recipe-engine-core/dist ./packages/recipe-engine-core/dist
COPY --from=builder /app/packages/recipe-engine-core/node_modules ./packages/recipe-engine-core/node_modules
COPY --from=builder /app/packages/recipe-engine-core/package.json ./packages/recipe-engine-core/package.json

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Copy Prisma generated client & schema for runtime query building
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "apps/api/dist/main.js"]