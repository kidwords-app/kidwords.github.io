# KidWords Architecture & Migration Strategy

This document explains how the KidWords app is structured today, why it is structured this way, and how to safely evolve it from a web app into a fully native mobile application.

---

## 1. High-Level Goal

Build a kid-friendly vocabulary app that:
- Ships quickly on the web
- Can later become a fully native iOS app
- Avoids rewriting business logic
- Keeps UI flexible and replaceable

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
- Word definitions and metadata
- Search and filtering logic
- Validation and helpers

**Rules:**
- No React imports
- No UI logic
- No browser APIs

This code can run in:
- Web (React)
- React Native (Expo)
- Node scripts
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

```
src/
  core/
    words.ts          # Vocabulary data
    search.ts         # Filtering + helpers
    selfTests.ts      # Validation checks

  ui-web/
    HeaderBar.tsx
    Sidebar.tsx
    DefinitionCard.tsx
    TipsTabs.tsx

  App.tsx             # App composition
```

---

## 5. Future Migration Plan (Web → Native)

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

## 6. Design Rules Going Forward

- Never import UI libraries inside `core/`
- Never embed data inside UI components
- Prefer pure functions over side effects
- Keep visual styling replaceable

---

## 7. Why This Matters

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

