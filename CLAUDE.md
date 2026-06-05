# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**Project Cleo** is an AI-powered clinical decision support web app for prescribers. It ingests free-text clinical transcripts and runs a multi-step agentic pipeline to extract medications, check formulary coverage, flag FDA drug interactions, generate recommendations, draft prior authorization (PA) letters, and produce EHR-ready progress notes. It also supports multi-council consultations and longitudinal patient tracking.

## Commands

```bash
npm run dev      # http://localhost:3000
npm run build
npm start
npm run lint
```

No tests — no jest or testing framework is configured.

**Required:** create `.env.local` from `.env.local.example` with `ANTHROPIC_API_KEY`.

## Architecture

### Analysis Pipeline (`app/api/analyze/route.ts`)

5-step sequential pipeline streaming progress via **SSE**:

1. **Extract** — Claude parses transcript into `Medication[]`
2. **Formulary** — (optional) checks insurance coverage
3. **OpenFDA** — fetches FDA drug labels for interaction data
4. **Synthesize** — Claude generates `AnalysisResult`
5. **Berries Note** — Claude writes an EHR-ready progress note

Each step emits `data: {...}\n\n` SSE events; `app/page.tsx` reads these to update step status in real time.

### Multi-Council Deliberation (`app/api/council/route.ts`)

Three councils (Clinical, Business, High-Stakes) run in parallel via `Promise.all`. Each council contains multiple Claude personas, each an independent SDK call with its own system prompt. See the route file for the full persona list.

### Other API Routes

- `app/api/chat/route.ts` — follow-up Q&A with full analysis context in system prompt
- `app/api/draft-pa/route.ts` — generates a PA letter for a specific medication

All routes use the Anthropic SDK with `claude-sonnet-4-6`.

### Frontend State (`app/page.tsx`)

All state is local `useState` in a single component — no global state manager. Key slices: transcript, patient, step statuses, `AnalysisResult`, formulary, PA drafts, council responses, chat history.

### Persistence (`lib/storage.ts`)

Browser `localStorage` only — no backend database. Stores `Patient` and `Visit` records; each `Visit` holds the full `AnalysisResult`, formulary data, and Berries Note for cross-visit outcome trends.

### Core Types (`lib/types.ts`)

Source of truth for all shared interfaces. Read this before modifying API routes or components.

## Key Conventions

- **SSE streaming**: new pipeline steps must emit `data: {...}\n\n` and be handled in the fetch reader in `app/page.tsx`.
- **Tailwind only**: no CSS modules or styled-components.
- **Direct SDK usage**: system prompts are inline strings in each route file — no abstraction layer.
- **`@/*`** resolves to the repo root.
- **Strict TypeScript**: avoid `any`; use types from `lib/types.ts`.
- **Deployment**: Vercel — set `ANTHROPIC_API_KEY` in project environment variables.
