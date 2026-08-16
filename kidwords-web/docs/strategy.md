# KidWords Architecture & Migration Strategy

This document explains how the KidWords app is structured today, why it is structured this way, and how to safely evolve it from a web app into a fully native mobile application.

**Separate track:** moving vocabulary onto RDS is documented in [rds-migration.md](./rds-migration.md) (schema: [rds.md](./rds.md), local setup: [local-dev.md](./local-dev.md)). That work does not replace this UI-layer plan.

---

## 1. High-Level Goal

Build a kid-friendly vocabulary app that:
- Ships quickly on the web
- Can later become a fully native iOS app
- Avoids rewriting business logic
- Keeps UI flexible and replaceable
- Can overlay word copy from RDS while keeping a bundled fallback

The guiding principle is **separation of concerns**.

---

## 2. Architectural Layers

```
┌──────────────────────────┐
│      UI Layer            │  ← Chakra UI (Web) / React Native (later)
├──────────────────────────┤
│     Application Logic    │  ← State, orchestration, glue
├──────────────────────────┤
│     Core Domain Logic    │  ← Data + pure functions (portable)
└──────────────────────────┘
```

### 2.1 Core Domain (Portable)
Located in: `src/core/`

Contains:
- Word definitions and metadata (bundled + `applyDbWords` overlay helpers)
- Client fetch/hooks for RDS overlay (`fetchWords`, `useWords`)
- Search and filtering logic
- Validation and helpers

**Rules:**
- No UI component libraries inside core helpers that must stay portable
- Prefer pure functions for merge/search; isolate `fetch` / hooks at the edges

This code can run in:
- Web (React)
- React Native (Expo) — domain helpers especially
- Node scripts / Vercel `lib/` (shared types and grade mapping)
- Tests

### 2.2 UI Layer (Replaceable)
Located in: `src/ui-web/`

Responsibilities:
- Rendering components
- Layout and visuals
- User interaction

This layer is expected to be **replaced** when moving to React Native.

### 2.3 App Composition
`src/App.tsx` wires everything together:
- Holds shared state (selected word, level)
- Calls core logic
- Chooses which UI components to render

---

## 3. Why This Structure Works

### ✅ Easy migration to native
When moving to React Native:
- Keep `core/` as-is
- Replace `ui-web/` with `ui-native/`
- Minimal rewrite required

### ✅ Testable and stable
Core logic can be tested without rendering UI.

### ✅ Scales cleanly
Adding more words, languages, or features doesn’t affect UI architecture.

---

## 4. File Layout Overview

See [structure.md](./structure.md) for the current tree (`api/`, `lib/`, `src/core/`, `src/ui-web/`).

Server-only RDS/S3 code lives under `api/` and `lib/` so the Vite client bundle stays thin. Core still owns the bundled word list and the merge rules used after fetch.

---

## 5. Data migration (bundled → RDS)

In parallel with the UI plan below:

- Default: bundled words in `src/core/words.ts`
- Overlay: `GET /api/words` → per-grade merge for any matching word
- Feedback and S3 images require published RDS rows

Full checklist and architecture: [rds-migration.md](./rds-migration.md).

---

## 6. Future Migration Plan (Web → Native)

### Phase 1 — Current (Web)
- Chakra UI
- Browser-based development
- Fast iteration

### Phase 2 — Transition
- Create `ui-native/`
- Replace Chakra components with React Native primitives
- Keep all core logic intact

### Phase 3 — Native Enhancements
- Add offline support
- Add audio (TTS)
- Add animations & gestures
- Ship via App Store

---

## 7. Design Rules Going Forward

- Never import UI libraries inside portable `core/` helpers
- Never embed vocabulary rows inside UI components
- Prefer pure functions over side effects
- Keep visual styling replaceable
- Keep secrets and DB access in `lib/` / Vercel env — never in the client bundle

---

## 8. Why This Matters

This structure lets you:
- Move fast today
- Avoid rewrites later
- Scale from prototype → product
- Support multiple platforms with one logic layer

---

If you ever feel unsure where something belongs:

> **If it’s about *what* the app does → core**  
> **If it’s about *how it looks* → UI**

That rule will keep this codebase healthy long-term.

