# ── Stage 1: Install dependencies ──────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy workspace root manifests and config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY tsconfig.base.json ./

# Copy only the package.json files needed for dependency resolution
COPY packages/recipe-engine-core/package.json ./packages/recipe-engine-core/
COPY apps/web/package.json ./apps/web/

# Copy all source so pnpm can resolve workspace packages correctly
COPY packages/recipe-engine-core/ ./packages/recipe-engine-core/
COPY apps/web/ ./apps/web/

RUN pnpm install --frozen-lockfile

# ── Stage 2: Build ────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy everything from deps (includes proper node_modules with resolved symlinks)
COPY --from=deps /app ./

# Declare build-time env variable for Next.js inlining
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build recipe-engine-core first, then web
RUN pnpm turbo build --filter=@algochef/recipe-engine-core... --filter=@algochef/web...

# ── Stage 3: Production runner ─────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat curl
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

ENV NODE_ENV=production

# Copy the entire workspace with node_modules and built artifacts
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["sh", "-c", "cd apps/web && npx next start -p 3000"]