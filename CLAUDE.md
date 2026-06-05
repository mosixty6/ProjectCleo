# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**Project Cleo** is an AI-powered clinical decision support web app for prescribers. It ingests free-text clinical transcripts and runs a multi-step agentic pipeline to extract medications, check formulary coverage, flag FDA drug interactions, generate recommendations, draft prior authorization (PA) letters, and produce EHR-ready progress notes. It also supports multi-council consultations and longitudinal patient tracking.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint via next lint
```

There are no tests. No jest or testing framework is configured.

**Required environment variable** — create `.env.local` from `.env.local.example`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Architecture

### Analysis Pipeline (`app/api/analyze/route.ts`)

The core feature is a 5-step sequential pipeline that streams progress via **Server-Sent Events (SSE)**:

1. **Extract** — Claude parses the transcript into structured `Medication[]`
2. **Formulary** — (optional) checks coverage for the patient's insurance plan
3. **OpenFDA** — fetches FDA drug labels for interaction checking
4. **Synthesize** — Claude generates `AnalysisResult` (recommendations, interactions, adherence flags, symptom scores, next-visit prep)
5. **Berries Note** — Claude writes an EHR-ready SOAP-style progress note

Each step emits a `data:` SSE event with a JSON payload; the frontend (`app/page.tsx`) handles these events to update step status in real time.

### Multi-Council Deliberation (`app/api/council/route.ts`)

Three councils run **in parallel** (via `Promise.all`), each containing multiple Claude personas with distinct system prompts:

- **Clinical**: Psychiatrist, Pharmacist, Patient Advocate, Internist, Professor
- **Business**: CEO, Marketer, CFO, Operations, Referral Strategist, Legal
- **High-Stakes**: Strategist, Risk Analyst, Devil's Advocate, Ethicist, Diminishing Returns

Each persona is an independent Claude call. Results are returned as a single JSON response keyed by council type.

### Other API Routes

| Route | Purpose |
|---|---|
| `app/api/chat/route.ts` | Follow-up Q&A; receives full analysis context in system prompt |
| `app/api/draft-pa/route.ts` | Generates a PA letter for a specific medication |

All routes call the **Anthropic SDK** using `claude-sonnet-4-6`.

### Frontend State (`app/page.tsx`)

All application state lives in a single large React component with `useState` hooks. There is no global state manager (no Redux, Zustand, etc.). Key state slices: transcript, patient selection, step statuses, `AnalysisResult`, formulary results, PA drafts, council responses, chat history.

### Persistence (`lib/storage.ts`)

All patient data is persisted to **browser `localStorage`** only — there is no backend database. The storage layer exposes functions to get/create/update `Patient` and `Visit` records. `Visit` objects store the full `AnalysisResult`, formulary data, and the Berries Note so outcome trends can be computed across visits.

### Core Types (`lib/types.ts`)

All shared interfaces live here. Key types: `Medication`, `AnalysisResult`, `FormularyResult`, `FormularyItem`, `AdherenceFlag`, `SymptomScore`, `NextVisitPrep`, `PADraft`, `Visit`, `Patient`. Understand these before modifying any API routes or components.

## Key Conventions

- **Streaming responses**: The analyze pipeline uses `ReadableStream` + SSE. New pipeline steps must emit `data: {...}\n\n` events and be handled in the `EventSource`/fetch reader in `app/page.tsx`.
- **Tailwind only**: All styling uses Tailwind utility classes. No CSS modules or styled-components.
- **No abstraction layer over the Anthropic SDK**: API routes call the SDK directly. System prompts are inline strings within route files.
- **`@/*` path alias** resolves to the repo root (e.g., `import { Patient } from '@/lib/types'`).
- **Strict TypeScript**: `strict: true` is set. Avoid `any`; use the types in `lib/types.ts`.
- **Deployment target**: Vercel. Set `ANTHROPIC_API_KEY` in Vercel environment variables.
