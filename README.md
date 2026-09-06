# AlgoChef

**Learn the recipe. Cook the solution.**

AlgoChef is an AI-powered algorithm thinking coach. It teaches you *how to think* — not what to code.

## Phase 1 — The Core Loop

```
Input Problem → Pattern Detection → Recipe Generation → Hints → User Submission → AI Feedback
```

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** NestJS
- **Database:** PostgreSQL + Prisma
- **AI:** OpenAI (with mock fallback when no API key)

## Quick Start

### 1. Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

### 2. Install dependencies

```bash
pnpm install
# or if pnpm is not installed globally:
npx pnpm@9.15.0 install
```

### 3. Start PostgreSQL

Docker Desktop must be running.

```bash
docker compose up -d
```

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and optionally add your `OPENAI_API_KEY`. Without it, the app runs in **mock mode** with sample Two Sum responses.

### 5. Set up database

```bash
pnpm db:generate
pnpm db:push
```

### 6. Build packages

```bash
pnpm build
```

### 7. Run development servers

```bash
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001

## Project Structure

```
algochef/
├── apps/
│   ├── web/          # Next.js coach UI
│   └── api/          # NestJS API
├── packages/
│   ├── recipe-engine-core/  # Types, ladder FSM, validators
│   ├── prompts/             # Versioned AI prompts
│   └── database/            # Prisma schema
```

## The Recipe Engine

The heart of AlgoChef — not just another module:

- **Pattern Detector** — identifies algorithmic patterns
- **Observation Generator** — surfaces what to notice
- **Step Generator** — creates atomic recipe steps
- **Hint Generator** — progressive, Socratic hints
- **Complexity Coach** — guides time/space reasoning
- **Feedback Analyzer** — reviews submissions

## Thinking Ladder

1. Understand
2. Observe
3. Pattern Match
4. Create Recipe
5. Predict Complexity
6. Implement
7. Reflect

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/sessions` | Start a coaching session |
| GET | `/sessions/:id` | Get session state |
| POST | `/sessions/:id/advance` | Move to next ladder stage |
| POST | `/sessions/:id/reveal-step` | Unlock next recipe step |
| POST | `/sessions/:id/hint` | Get a progressive hint |
| POST | `/sessions/:id/submit` | Submit code for feedback |

## Deployment

### Vercel (Web Frontend)

AlgoChef is ready for Vercel out of the box with zero-config support for both monorepo root and `apps/web` root directory settings!

#### Option A: Full Serverless on Vercel (Recommended for Quick Deploy)

The Next.js app in `apps/web` includes built-in API route handlers (`/api/sessions`, etc.) mirroring the NestJS API. You can run the entire platform on Vercel with a managed PostgreSQL database (such as Supabase, Neon, or Vercel Postgres).

1. **Connect your repository:**
   - Go to [vercel.com/new](https://vercel.com/new) and import your repository.
   - Set **Root Directory** to `apps/web` (or leave as root `.`, both are supported).
   - Vercel auto-detects Next.js and pnpm.
2. **Configure Environment Variables:**
   - `DATABASE_URL`: Your production PostgreSQL connection string (e.g., from Neon or Supabase).
   - `OPENAI_API_KEY`: *(Optional)* Your OpenAI key. Without it, mock mode runs automatically.
   - `OPENAI_MODEL`: *(Optional)* Defaults to `gpt-4o-mini`.
3. **Deploy:**
   - Click **Deploy**. Vercel will run `pnpm install` (with automatic Prisma client generation via `postinstall`) and build the web application.

#### Option B: Frontend on Vercel + Backend on VPS

If you run the NestJS API on your VPS using Docker:

1. Follow step 1 above.
2. Add the environment variable:
   - `NEXT_PUBLIC_API_URL`: `https://your-api-domain.com` (your VPS API endpoint).
3. The frontend will route requests to your VPS API instead of the internal Next.js handlers.

---

### Docker (Full Stack on VPS)

To deploy the entire stack (PostgreSQL, NestJS API, and Next.js Web) on a VPS with Docker:

#### 1. Configure environment

```bash
cp .env.production .env
# Edit .env and set a strong POSTGRES_PASSWORD at minimum
```

#### 2. Build and start

```bash
./deploy.sh --build
```

#### 3. Run database migrations

```bash
./deploy.sh --migrate
```

#### 4. Verify

- Web: http://localhost:3000
- API Health: http://localhost:3001/health

#### Useful commands

```bash
./deploy.sh            # Start without rebuilding
./deploy.sh --logs     # Tail all logs
./deploy.sh --status   # Show service status
./deploy.sh --down     # Stop all services
```

## License

Private — All rights reserved.
