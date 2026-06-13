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

## License

Private — All rights reserved.
