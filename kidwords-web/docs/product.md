# Vision 

This is Kidwords, a dictionary for children that helps them learn complex concepts. 

# Problem 

When kids ask "what does that mean", their caregivers are often stumped. How do you explain a nuanced concept like empathy? Or they don't have time to think of good examples, or pronounciation or spelling. 

Kidwords solves that by creating simple, age-appropriate explanations with accompanying images. 

# Current iteration 

The web app ships a **bundled** vocabulary in `src/core/words.ts` (plus optional `words-data.json` merges) so the UI works when the API is down.

Word copy is also stored in **AWS RDS Postgres** and served by `GET /api/words`. After load, matching word+grade rows from RDS overlay the bundle (per grade). RDS-backed grades can include S3 images (presigned URLs) and can accept **feedback** for published word+grade rows.

See [rds-migration.md](./rds-migration.md) for the migration overview, [rds.md](./rds.md) for schema, and [local-dev.md](./local-dev.md) for running the API locally.
