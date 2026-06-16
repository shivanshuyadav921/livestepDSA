# ── Stage 1: Install dependencies ──────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy workspace root manifests and config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY tsconfig.base.json ./

# Copy package.json files for all workspace packages
COPY packages/database/package.json ./packages/database/
COPY packages/prompts/package.json ./packages/prompts/
COPY packages/recipe-engine-core/package.json ./packages/recipe-engine-core/
COPY apps/api/package.json ./apps/api/

# Copy all source so pnpm can resolve workspace packages correctly
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN pnpm install --frozen-lockfile

# ── Stage 2: Build workspace packages + API ────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy everything from deps (includes proper node_modules with resolved symlinks)
COPY --from=deps /app ./

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

# Copy the entire workspace with node_modules and built artifacts
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "apps/api/dist/main.js"]