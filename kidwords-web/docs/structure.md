# App structure

Create and maintain the structure of this app as follows:

```
docs/
  structure.md          # this file
  strategy.md           # web → native architecture
  rds-migration.md      # RDS vocabulary migration (overview)
  rds.md                # Postgres schemas
  local-dev.md          # vercel dev + env for RDS APIs
  development.md
  product.md

api/                    # Vercel serverless (Node ESM; use .js import suffixes)
  words.ts              # GET /api/words
  feedback.ts           # POST /api/feedback

lib/                    # Shared server helpers (not shipped in the Vite bundle)
  db.ts                 # pg pool + OIDC / RDS IAM auth
  wordsRepository.ts
  feedbackRepository.ts
  s3.ts                 # presign image_s3_key → imageUrl
  aws.ts
  logger.ts

src/
  App.tsx
  main.tsx
  core/                 # portable domain (no UI component libraries)
    words.ts            # bundled vocabulary + applyDbWords
    words-data.json     # optional overlay data for moderation tooling
    fetchWords.ts
    useWords.ts
    search.ts
    grades.ts
    categories.ts
    feedback.ts
    submitFeedback.ts
    selfTests.ts
  ui-web/
    HeaderBar.tsx
    Sidebar.tsx
    CategorySidebar.tsx
    WordList.tsx
    DefinitionCard.tsx
    EmptyState.tsx
    TipsTabs.tsx
    FeedbackButton.tsx
  test/
    fixtures/
    setup.ts
```

## Data path (short)

Bundled words in `src/core/words.ts` load first. `GET /api/words` overlays any matching word+grade from RDS. Details: [rds-migration.md](./rds-migration.md).
