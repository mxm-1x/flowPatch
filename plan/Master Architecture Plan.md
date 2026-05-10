# MASTER ARCHITECTURE PLAN
# AI Newsletter Content Engine

> This document is the SINGLE SOURCE OF TRUTH for the entire project.
> Read this file before coding anything.

---

# 1. PROJECT OVERVIEW

We are building an agentic AI platform that:
- Researches topics
- Learns a user's writing style
- Generates newsletters
- Critiques its own output
- Rewrites weak sections
- Repurposes content for multiple platforms

The platform should feel like:
- Cursor for newsletter creators
- Perplexity + Copywriter + AI Editor
- AI content operating system

---

# 2. CORE DIFFERENTIATORS

## A. Agentic Workflow
Instead of one prompt:
- Multiple specialized AI agents collaborate

## B. Atomic RAG
We DO NOT embed full newsletters.

We embed:
- hooks
- CTA sections
- analogies
- transitions
- storytelling snippets

This enables much stronger writing style transfer.

## C. Reflection Loop
The AI critiques itself.

If:
- hook weak
- writing generic
- hallucination detected

The system rewrites automatically.

## D. Real-Time Thinking UI
Users can watch:
- research
- drafting
- revising
- reviewing

This massively improves UX.

---

# 3. SYSTEM ARCHITECTURE

```txt
Frontend (Next.js)
    ↓
API Layer
    ↓
LangGraph Orchestrator
    ↓
Research Agent
    ↓
Style Retrieval Agent
    ↓
Drafting Agent
    ↓
Critic Agent
    ↓
Reflection Loop
    ↓
Final Output
```

# 4. TECH STACK

## Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- shadcn/ui
- React Server Components
- Server Actions

## Backend
- Node.js
- LangGraph.js

## AI Models

### Primary:
- Gemini 2.5 Pro

### Secondary:
- Claude Sonnet
- GPT-4.1

## Database
- PostgreSQL
- Prisma ORM

## Vector Store
- Pinecone

## Research
- Firecrawl API

## Realtime
- Pusher OR Socket.io

## Deployment

### Frontend:
- Vercel

### Backend:
- Railway / Render / AWS

# 5. MONOREPO STRUCTURE

```
/apps
  /web
  /worker

/packages
  /ai
  /db
  /prompts
  /types
  /utils

/langgraph
  graph.ts
  state.ts

  /nodes
    researcher.ts
    styleMatcher.ts
    drafter.ts
    critic.ts

/prisma
  schema.prisma

/scripts
  ingest-newsletters.ts
```

# 6. DATABASE DESIGN

## User
Stores:
- account info
- ownership

## Newsletter
Stores:
- generated newsletters
- previous user newsletters

## AgentRun
Stores:
- logs
- current state
- workflow progress
- outputs

## StyleSnippet
Stores:
- atomic chunks
- embedding IDs
- snippet type

# 7. ATOMIC RAG STRATEGY

CRITICAL:
DO NOT chunk by character length only.

Chunk by INTENT.

GOOD:
```json
{
  "type": "HOOK",
  "content": "Most newsletters fail before sentence two."
}
```

BAD:
```
Paragraph chunk 1
Paragraph chunk 2
Paragraph chunk 3
```

# 8. AGENT WORKFLOW

## STEP 1 — Research Agent

Input:
- topic

Responsibilities:
- search internet
- scrape sources
- clean content
- summarize findings

Uses:
- Firecrawl

Output:
- structured research notes

## STEP 2 — Style Retrieval Agent

Responsibilities:
- embed topic intent
- query Pinecone
- retrieve matching snippets

Returns:
- hooks
- transitions
- CTAs
- storytelling examples

## STEP 3 — Drafting Agent

Responsibilities:
- generate newsletter
- create strong hooks
- write human-like copy

Must avoid:
- generic AI language
- overexplaining
- robotic tone

## STEP 4 — Critic Agent

Responsibilities:
- critique generated output

Checks:
- weak hook
- low specificity
- hallucinations
- generic phrasing
- weak CTA

Returns:
```json
{
  "pass": false,
  "issues": [
    "Hook weak",
    "CTA generic"
  ]
}
```

## STEP 5 — Reflection Loop

If critique fails:
- critic → drafter

Maximum:
- 3 retries

# 9. FRONTEND UX

## Generator Page

Features:
- topic input
- generate button
- live logs
- markdown preview

## Dashboard

Features:
- recent generations
- analytics
- engagement scores

## Style Library

Features:
- uploaded newsletters
- chunk viewer
- snippet types

# 10. REAL-TIME LOGGING

User must see:
```
[✓] Research completed
[✓] Style matched
[ ] Revising hook...
```

NEVER hide the agent process.

# 11. DISTRIBUTION LAYER

Convert newsletter into:
- LinkedIn posts
- X threads
- summaries

Rules:
- platform-specific formatting
- shorter paragraphs
- optimized hooks

# 12. ANALYTICS (MVP)

Fake but useful metrics:
- Hook Score
- Curiosity Gap Score
- Readability
- Engagement Prediction

Purpose:
- demo value
- portfolio impact

# 13. DEPLOYMENT

## Frontend
Vercel

## Backend Worker
Railway

## Database
Neon / Supabase

## Vector DB
Pinecone cloud

# 14. IMPORTANT ENGINEERING RULES

## ALWAYS
- stream progress
- retry failed nodes
- save workflow state
- modularize prompts

## NEVER
- use giant prompts
- store full newsletters as embeddings
- block frontend during generation
- hide AI reasoning

# 15. FINAL PRODUCT GOAL

The app should feel:
- intelligent
- autonomous
- transparent
- premium

The user should believe:
"This AI actually thinks."
