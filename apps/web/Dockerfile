# ── Stage 1: Install dependencies ──────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy workspace root manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy only the package.json files needed for dependency resolution
COPY packages/recipe-engine-core/package.json ./packages/recipe-engine-core/
COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile

# ── Stage 2: Build ────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/recipe-engine-core/node_modules ./packages/recipe-engine-core/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

COPY . .

# Build recipe-engine-core first, then web
RUN pnpm turbo build --filter=@algochef/recipe-engine-core... --filter=@algochef/web...

# ── Stage 3: Production runner ─────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

ENV NODE_ENV=production

# Copy only production node_modules for the web app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/recipe-engine-core/dist ./packages/recipe-engine-core/dist
COPY --from=builder /app/packages/recipe-engine-core/node_modules ./packages/recipe-engine-core/node_modules
COPY --from=builder /app/packages/recipe-engine-core/package.json ./packages/recipe-engine-core/package.json

# Copy the built Next.js app
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/next.config.ts ./apps/web/next.config.ts

# Copy public directory if it exists
COPY --from=builder /app/apps/web/public/ ./apps/web/public/

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "apps/web/node_modules/.bin/next", "start", "apps/web", "-p", "3000"]