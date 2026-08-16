# RDS vocabulary migration

Guide for moving KidWords word copy (and related assets) from the bundled client data in `src/core/words.ts` onto **AWS RDS Postgres**, served through Vercel serverless APIs.

Related docs:

- [rds.md](./rds.md) — table schemas (`words`, `feedback`) and grade enum mapping
- [local-dev.md](./local-dev.md) — env vars, `vercel dev`, and curl checks
- [strategy.md](./strategy.md) — web → native UI migration (separate from this data path)

---

## Goals

1. Keep the app usable if RDS or `/api/words` is down (bundled words remain the default).
2. Overlay **any matching word+grade** from RDS onto the bundled list (no per-word client flag).
3. Merge **per grade**: if RDS has copy for `K` but not `preK`, keep bundled `preK`.
4. Auth to RDS with **Vercel OIDC → IAM → RDS IAM auth** (no long-lived DB passwords in the app).

---

## Architecture

```
Browser (Vite/React)
  └─ useWords() → WORDS (bundled) + fetchWords() → GET /api/words
                      └─ applyDbWords() overlays matching word+grade from RDS

Vercel serverless
  api/words.ts      → lib/wordsRepository.ts → lib/db.ts (pg + RDS Signer)
                    → lib/s3.ts (presign image_s3_key → level.imageUrl)
  api/feedback.ts   → lib/feedbackRepository.ts → same pool
```

| Layer | Role |
|-------|------|
| `src/core/words.ts` | Bundled vocabulary + `applyDbWords` / `dbLevels` |
| `src/core/fetchWords.ts` / `useWords.ts` | Client fetch + hook; failures leave bundled data |
| `api/words.ts` | GET JSON `WordEntry[]` |
| `api/feedback.ts` | POST feedback for published word+grade rows |
| `lib/db.ts` | Lazy `pg` pool; OIDC AWS creds + `@aws-sdk/rds-signer` token |
| `lib/wordsRepository.ts` | SQL → app shape; grade mapping via `src/core/grades.ts` |
| `lib/s3.ts` | Presigned GET URLs for `image_s3_key` |

Production Node ESM requires **`.js` extensions** on relative imports under `api/` and `lib/` (e.g. `./db.js`). `vercel dev` can hide that; production does not.

---

## Overlay model

1. Seed word+grade rows into RDS (`words` table).
2. Client always loads bundled `WORDS` first, then calls `GET /api/words`.
3. `applyDbWords(bundled, fromDb)` walks the **bundled** list. For each word present in the API response, any grade with a non-empty RDS `definition` replaces that grade’s bundled copy.
4. After a successful merge, `dbLevels` lists grades that came from RDS (Feedback only shows for those grades — FK to published rows).
5. Words that exist only in RDS (not in the bundle) are **not** added to the UI yet; extend the bundle (or merge logic) if you need RDS-only entries.

Partial grades are intentional: missing / empty RDS definitions fall back to bundled level copy.

---

## Data flow (words)

1. `GET /api/words` reads all rows from `RDS_WORDS_TABLE` (default `words`).
2. Rows keyed by `(word, grade)` collapse into one `WordEntry` with `levels.preK|K|G1`.
3. Grade enum in Postgres: `preschool` / `kindergarten` / `grade1` (or legacy aliases) → app `preK` / `K` / `G1`.
4. `image_s3_key` → short-lived HTTPS `imageUrl` on that level (see [local-dev.md](./local-dev.md)).
5. Client `applyDbWords` overlays matching bundled words.

On API failure: UI keeps bundled words; feedback stays hidden until `dbLevels` is set.

---

## Feedback

- Stored in `feedback` with FK to `words(word, grade)`.
- UI submits only when the selected grade is in `dbLevels` (published in RDS).
- See schema in [rds.md](./rds.md) and curls in [local-dev.md](./local-dev.md).

---

## Environments & auth

| Concern | Notes |
|---------|--------|
| Local API | Use **`vercel dev`**, not `npm run dev` alone |
| Env file | `.env.local` via `vercel env pull` (gitignored) |
| Scope | Enable RDS/AWS vars for **Development** in Vercel, or pull won’t include them |
| Restart | Restart `vercel dev` after pulling env — Vite HMR does not reload the API process |
| Secrets | Never commit `.env.local` or paste `AWS_ROLE_ARN` / tokens into docs |

Required keys are listed in [local-dev.md](./local-dev.md).

---

## Operational checklist

**Publish a word grade**

1. Insert `words` rows for each grade (definition, example, try_it, speak, tags, optional `image_s3_key`).
2. Confirm `GET /api/words` includes the word.
3. Ensure the word exists in the bundled list (otherwise it won’t appear in the UI).
4. Verify UI copy for each grade; confirm Feedback appears only for RDS grades.

**Debug overlay**

- Server logs: `[KidWords]` / `logRds` in `lib/logger.ts` (pool, query, errors).
- Security group / VPN if local IP cannot reach RDS.

**Production**

- Preview/Production env vars set in Vercel (same names as Development).
- Relative imports under `api/` / `lib/` use `.js` suffixes.
- Cache header on words: `s-maxage=60, stale-while-revalidate=300`.

---

## Out of scope (for now)

- Showing RDS-only words that are absent from the bundle
- Removing the bundled word list entirely
- CDN public image URLs (presigned GET is the current path)
- Auth’d admin UI for editing copy
- Native app offline sync (see [strategy.md](./strategy.md) for UI-native plans)

---

## Doc map

| Doc | Use when |
|-----|----------|
| **rds-migration.md** (this file) | Understanding the system and rollout |
| **rds.md** | Exact Postgres schema |
| **local-dev.md** | Running and verifying locally |
| **structure.md** | Where files live |
| **development.md** | Day-to-day engineering conventions |
