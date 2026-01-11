# development.md — Kids Dictionary (Web) w/ Chakra UI

This repo is a **kids dictionary web app**. Optimize for **shipping fast** with clean, testable increments. Prefer small PRs, clear acceptance criteria, and predictable patterns.

---

## Product Goal

Build a kid-friendly dictionary that:
- Lets kids search for a word quickly
- Shows a simple definition + examples (age-appropriate)
- Works well on mobile/tablet
- Is safe (no inappropriate content surfaced to kids)

**Non-goals (for now):**
- Full authentication system
- Payments/subscriptions
- Complex personalization
- Social features

---

## Tech Stack (initial)

- Web app: **React + TypeScript**
- UI: **Chakra UI**
- Router: (choose one) React Router or Next.js router
- Testing: Vitest + React Testing Library
- Lint/format: ESLint + Prettier

> If the repo already uses different tooling, follow the repo.

---

## Development Principles

### Ship in Thin Slices
Each change should ideally be a vertical slice:
- UI → state → data → error/empty/loading → tests

### Keep Modules Small and Boring
Prefer small focused modules over clever abstractions.

### Don’t Break Main
Main branch should always be deployable.

### Kid Safety Is a Feature
Avoid surfacing unsafe words/content without guardrails.

---

## Repo Conventions (recommended)
- Follow structure.md to understand the structure of this code base 


### Naming
- Components: `PascalCase.tsx`
- Hooks: `useSomething.ts`
- Utilities: `camelCase.ts`
- Tests: `*.test.ts(x)`

---

## UI Guidelines (Chakra)

- Use Chakra primitives for layout: `Box`, `Stack`, `Flex`, `Grid`
- Keep typography consistent: use `Text`, `Heading`
- Use theme tokens instead of hard-coded values
- Default to accessible components (Chakra helps—don’t fight it)
- Ensure mobile-first: test at 375px width

**Spacing & sizing defaults**
- Prefer `Stack` with `spacing={3|4|6}`
- Prefer `maxW="container.md"` on content pages
- Ensure tap targets ≥ 44px where possible


### “Golden Set”
Maintain a small curated list of words for regression tests:
- `src/test/fixtures/goldenWords.json`
Use this for:
- Search tests
- Rendering tests
- Content validation tests

---

## Error/Empty/Loading States (Required)

Every fetch-driven screen must include:
- Loading: skeleton or spinner with layout preserved
- Empty: friendly message + suggestion
- Error: retry button + non-technical message

---

## Performance & UX

- Debounce search input (e.g., 150–250ms)
- Cache last N lookups (e.g., 50–200) in localStorage/IndexedDB later
- Avoid large bundle additions early
- Prefer simple client-side search until dataset grows

---

## Testing Expectations

### Minimum Bar for Each Ticket
- Add/update tests for domain logic and any tricky UI behavior
- Add at least one test for:
  - Search behavior OR
  - Word page rendering OR
  - Error state handling

### Suggested Testing Layers
- Unit tests: `domain/` and `services/`
- Component tests: key UI components
- Page tests: route-level smoke tests

---

## Code Review Checklist (Self-Review Before Commit)

- [ ] Feature works end-to-end locally
- [ ] Handles loading/empty/error states
- [ ] Types are correct; no `any` without reason
- [ ] Tests updated/added
- [ ] No secrets or API keys committed
- [ ] No unrelated refactors mixed in
- [ ] UI is usable on mobile width
- [ ] Accessibility: labels, focus states, keyboard nav basics

---

## Cursor Agent Workflow

### How to Work in This Repo
**Always start by reading:**
- `docs/development.md`
- `docs/product.md` (if present)
- `docs/quality-bar.md` (if present)

### Ticket Format (use this in issues/PRs)
**Title:** short and specific  
**Context:** why we’re doing it  
**Acceptance criteria:** 3–7 bullets  
**Out of scope:** explicit non-goals  
**Test plan:** how to verify

### Agent Instructions
When implementing a ticket:
1. Propose a plan (files to touch, approach, edge cases)
2. Implement minimal change
3. Add tests
4. Summarize what changed + how to verify
5. Call out risks and follow-ups

**Hard constraints**
- Do not change unrelated files
- Do not introduce new libraries unless necessary
- Prefer readability over cleverness
- Keep PR small (< ~300 LOC changed if possible)

---

## Local Setup (fill these in once repo exists)

```bash
# install
npm install

# run
npm run dev

# test
npm run test:coverage

# lint
npm run lint

# typescript 
npm run typecheck

# build (for production - no tests, just typecheck and build)
npm run build

# CI script (runs typecheck, tests, and build - use in CI/CD)
npm run ci
```

## Pre-commit Hooks

This repository uses [Husky](https://typicode.github.io/husky/) to run checks before every commit. The pre-commit hook automatically runs:

1. **TypeScript type checking** (`npm run typecheck`)
2. **Test suite with coverage** (`npm run test:coverage`)

If either check fails, the commit will be blocked. This ensures that:
- All TypeScript errors are caught before committing
- All tests pass before code is committed
- Code quality is maintained automatically

To bypass the hook in an emergency (not recommended), use `git commit --no-verify`, but this should be avoided.

## Build vs CI

- **`npm run build`**: Used by Vercel and other deployment platforms. Only runs TypeScript type checking and builds the production bundle. Does NOT run tests (UI tests require a browser environment that deployment platforms don't provide).
- **`npm run ci`**: Full CI pipeline script that runs typecheck, tests, and build. Use this in CI/CD environments that support running tests.
- **Pre-commit hooks**: Run tests locally before every commit to catch issues early.
