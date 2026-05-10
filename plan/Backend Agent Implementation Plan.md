# BACKEND + AGENT IMPLEMENTATION PLAN

> This document defines EXACTLY how backend and AI orchestration should be built.

---

# 1. BACKEND RESPONSIBILITIES

Backend handles:
- AI orchestration
- research
- vector retrieval
- reflection loops
- streaming logs
- state management

Frontend should remain thin.

---

# 2. LANGGRAPH STATE

```ts
export type AgentState = {
  topic: string

  researchNotes: string[]

  styleExamples: {
    hooks: string[]
    ctas: string[]
    transitions: string[]
  }

  draft: string

  critique: {
    pass: boolean
    issues: string[]
  }

  retries: number

  logs: string[]

  finalOutput?: string
}
```

# 3. LANGGRAPH FLOW

```
START
  ↓
Researcher
  ↓
Style Matcher
  ↓
Drafter
  ↓
Critic
  ↓
Pass?
 ├── YES → END
 └── NO → Drafter
```

# 4. RESEARCH AGENT

## Responsibilities
- search web
- scrape content
- extract insights
- summarize sources

## APIs

Use:
- Firecrawl search
- Firecrawl scrape

## Output Format
```json
{
  "topic": "AI automation",
  "insights": [
    "Insight 1",
    "Insight 2"
  ],
  "sources": [
    "url1",
    "url2"
  ]
}
```

# 5. STYLE MATCHER AGENT

## Responsibilities
- query Pinecone
- retrieve atomic snippets

## Query Types

Retrieve:
- hooks
- storytelling
- CTAs
- transitions

## Example Pinecone Metadata
```json
{
  "type": "HOOK",
  "author": "userId"
}
```

# 6. DRAFTER AGENT

## Inputs
- research
- style examples

## Responsibilities

Generate:
- title
- hook
- body
- CTA

## IMPORTANT RULES

Avoid:
- "In today's fast-paced world"
- "Unlock the power"
- "Dive into"

Prioritize:
- specificity
- strong opinions
- short punchy lines

# 7. CRITIC AGENT

The critic should act like:
- a harsh editor
- not an assistant

## Checks

### Hook Quality
Questions:
- Is it specific?
- Is it curiosity-driven?

### AI Detection
Reject:
- corporate fluff
- overpoliteness
- generic wording

### Hallucinations
Verify:
- claims
- numbers
- facts

### CTA
Check:
- urgency
- clarity

# 8. REFLECTION LOOP

## Retry Logic

If:
- pass == false

Then:
- draft → critique → rewrite

Maximum retries:
- 3

If still failing:
- return best version
- attach warnings

# 9. PROMPT STORAGE

Store prompts separately.

`/packages/prompts`

Files:
- researcher.prompt.ts
- drafter.prompt.ts
- critic.prompt.ts
- transformer.prompt.ts

NEVER hardcode prompts in nodes.

# 10. STREAMING SYSTEM

Emit events:
- research_started
- research_finished
- draft_started
- draft_finished
- critique_started
- revision_started
- completed

Frontend subscribes via:
- WebSockets
- OR
- Pusher

# 11. DATABASE FLOW

## Agent Run Lifecycle

### Start
Create:
- AgentRun(status="running")

### During Workflow
Update:
- logs
- current step
- outputs

### Completion
Update:
- status="completed"

# 12. INGESTION PIPELINE

## Upload Newsletter

### Step 1
Split into:
- hooks
- stories
- CTAs
- transitions

### Step 2
Generate embeddings

### Step 3
Upload to Pinecone

### Step 4
Save metadata in PostgreSQL

# 13. EMBEDDING STRATEGY

Recommended:
- text-embedding-3-small
- OR
- Gemini embedding model

Metadata:
```json
{
  "type": "CTA",
  "newsletterId": "123",
  "userId": "abc"
}
```

# 14. ERROR HANDLING

## Firecrawl Failure
Fallback:
- retry
- backup source

## LLM Failure
Fallback:
- retry generation

## Pinecone Failure
Fallback:
- generate without style matching

System should NEVER fully crash.

# 15. PERFORMANCE OPTIMIZATION

## Cache Research
Avoid duplicate scraping.

## Parallel Execution
Possible:
- research + style retrieval simultaneously

## Streaming
Stream partial updates.

# 16. SECURITY

- validate inputs
- sanitize markdown
- secure API keys
- rate limit endpoints

# 17. API ENDPOINTS

## POST /api/generate
Start generation

## GET /api/run/:id
Get run state

## GET /api/logs/:id
Get live logs

## POST /api/ingest
Upload newsletters

# 18. BACKEND MVP CHECKLIST

Backend complete when:
- graph works
- reflection loop works
- Pinecone retrieval works
- streaming works
- retries work
- logs persist
