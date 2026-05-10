# FRONTEND UI/UX EXECUTION PLAN

> This document defines the frontend experience and implementation details.

---

# 1. FRONTEND GOALS

The frontend should feel:
- modern
- intelligent
- realtime
- premium
- transparent

The UI should make users feel:
"The AI is actually thinking."

---

# 2. DESIGN STYLE

Use:
- dark mode default
- glassmorphism cards
- clean typography
- spacious layout

Inspired by:
- Perplexity
- Linear
- Cursor
- Vercel dashboard

---

# 3. TECH STACK

- Next.js 14
- App Router
- TailwindCSS
- shadcn/ui
- Framer Motion
- Zustand (optional)

---

# 4. PAGE STRUCTURE

## Dashboard
Route:
```txt
/dashboard
```

Features:
- recent generations
- analytics
- quick actions

## Generator Page
Route:
```txt
/generate
```

Features:
- topic input
- generate button
- live agent logs
- markdown preview

## Run Detail Page
Route:
```txt
/run/[id]
```

Features:
- generation timeline
- logs
- revisions
- final output

## Style Library
Route:
```txt
/library
```

Features:
- uploaded newsletters
- snippet viewer
- snippet categories

# 5. MAIN GENERATOR UX

## Layout
```
-----------------------------------
| Topic Input                    |
-----------------------------------
| Live Logs      | Markdown View |
|                 |               |
-----------------------------------
```

# 6. LIVE LOG EXPERIENCE

Display:
```
[✓] Researching AI trends...
[✓] Matching writing style...
[✓] Drafting newsletter...
[ ] Critiquing hooks...
```

This is one of the MOST important features.

# 7. MARKDOWN RENDERING

Use:
- react-markdown

Support:
- headings
- bullet points
- bold
- code blocks

Add:
- copy button
- export button

# 8. STREAMING IMPLEMENTATION

Use:
- Pusher
- OR
- Socket.io

The frontend should:
- subscribe to run updates
- append logs live
- update markdown progressively

# 9. COMPONENT STRUCTURE

```
/components
  /dashboard
  /editor
  /logs
  /markdown
  /analytics
  /ui
```

# 10. IMPORTANT COMPONENTS

## TopicInput
Responsibilities:
- validate input
- trigger generation

## AgentLogs
Responsibilities:
- stream logs
- animate updates

## MarkdownViewer
Responsibilities:
- render generated content
- syntax highlighting

## AnalyticsCards
Show:
- hook score
- readability
- engagement prediction

# 11. UI ANIMATIONS

Use Framer Motion.

Animate:
- log entries
- loading states
- cards
- transitions

Keep animations subtle.

# 12. LOADING EXPERIENCE

DO NOT use:
```
Loading...
```

Use:
```
Researching sources...
Finding writing patterns...
Rewriting weak hooks...
```

# 13. DASHBOARD ANALYTICS

Cards:
- newsletters generated
- average hook score
- top-performing hooks
- engagement predictions

# 14. EXPORT FEATURES

Allow:
- copy markdown
- export TXT
- export MD

Future:
- PDF export
- Substack publish

# 15. RESPONSIVE DESIGN

Must work:
- desktop first
- tablet
- mobile

Important:
- logs collapse on mobile
- markdown stays readable

# 16. AUTHENTICATION

Optional MVP:
- Clerk
- OR
- NextAuth

Features:
- user sessions
- protected dashboard
- saved runs

# 17. STATE MANAGEMENT

Recommended:
- server components where possible
- Zustand for client state

Avoid overengineering.

# 18. FRONTEND API FLOW

## Generate
```
User clicks generate
    ↓
POST /api/generate
    ↓
Receive runId
    ↓
Subscribe to logs
    ↓
Render updates live
```

# 19. ERROR STATES

Show friendly errors:
```
Research failed.
Retrying...
```

NEVER show raw stack traces.

# 20. EMPTY STATES

Examples:
```
No newsletters yet.
Generate your first AI-powered newsletter.
```

# 21. ACCESSIBILITY

Ensure:
- keyboard navigation
- proper contrast
- semantic HTML

# 22. PERFORMANCE

Use:
- React Server Components
- lazy loading
- dynamic imports

Avoid:
- giant client bundles

# 23. MVP UI CHECKLIST

Frontend complete when:
- generator works
- logs stream live
- markdown renders
- analytics visible
- responsive layout works
- polished UX achieved

# 24. FINAL FRONTEND GOAL

The frontend should make the product feel:
- autonomous
- intelligent
- trustworthy
- premium

The user should WANT to watch the AI think.
