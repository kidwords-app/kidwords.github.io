# Local dev — RDS API testing

Use **`vercel dev`** (not `npm run dev` alone) to run the React app and `/api/words` on one port. The API connects to RDS via Vercel OIDC + IAM auth (`lib/db.ts`).

```bash
cd kidwords-web
vercel link          # once
vercel env pull .env.local   # see note below — may only include OIDC token
vercel dev
```

**`vercel env pull` defaults to the Development environment.** Vars must be enabled for **Development** in the dashboard (not only Preview/Production), or pull will skip them.

If RDS vars are only on Preview/Production, pull gives you just `VERCEL_OIDC_TOKEN`. Fix either way:

1. **Recommended:** Vercel → Settings → Environment Variables → edit each RDS/AWS var → check **Development** → `vercel env pull .env.local`
2. **Workaround:** `vercel env pull .env.local --environment=production` (pulls Preview+Production vars into `.env.local` for local use)

`vercel dev` reads `.env.local` plus Development-scoped dashboard vars. **After `vercel env pull`, stop and restart `vercel dev`** — a Vite-only reload does not refresh the API process env.

Confirm all seven keys are present:

```bash
grep -E '^RDS_|^AWS_|^VERCEL_OIDC' .env.local | cut -d= -f1
# expect: RDS_PORT RDS_HOSTNAME RDS_DATABASE RDS_USERNAME AWS_REGION AWS_ROLE_ARN VERCEL_OIDC_TOKEN
```

If `AWS_ROLE_ARN` is missing, enable **Development** for that var in the dashboard and pull again.

- App: http://localhost:3000  
- API: http://localhost:3000/api/words  

Bundled words load immediately. Only words with `dbFetch: true` in `src/core/words.ts` are replaced from RDS (currently **empathy** and **happy**). Feedback appears only after a successful overlay for the selected grade (`dbLevels`).

---

## Required environment variables

All six are required by `lib/db.ts`, plus `VERCEL_OIDC_TOKEN` (from `vercel env pull` / `vercel dev`) for local AWS auth.

| Also needed locally | Source |
|---------------------|--------|
| `VERCEL_OIDC_TOKEN` | `vercel env pull` or auto during `vercel dev` |

Ensure RDS settings and `AWS_ROLE_ARN` are checked for **Development** in Vercel (not only Preview/Production), then `vercel env pull`.

| Variable | Value | Notes |
|----------|-------|-------|
| `RDS_PORT` | `5432` | Postgres port |
| `RDS_HOSTNAME` | `kidwords.cluster-cufu24caaexv.us-east-1.rds.amazonaws.com` | Aurora/RDS cluster endpoint |
| `RDS_DATABASE` | `kidwords_app` | Database name |
| `RDS_USERNAME` | `kidwords_app_user` | IAM-enabled DB user |
| `AWS_REGION` | `us-east-1` | Must match RDS region |
| `AWS_ROLE_ARN` | *(set in Vercel only)* | IAM role for OIDC → RDS IAM auth. Vercel → Project → Settings → OIDC / AWS. **Do not paste into docs or git.** |

### Optional

| Variable | Default | Notes |
|----------|---------|-------|
| `RDS_WORDS_TABLE` | `words` | Postgres table name |
| `RDS_FEEDBACK_TABLE` | `feedback` | Postgres feedback table name |
| `RDS_SSL` | SSL on | Set to `false` only for local non-TLS debugging |
| `S3_IMAGES_BUCKET` | *(none)* | Required when `image_s3_key` is a bare object key (not `s3://` or HTTPS S3 URL) |
| `S3_PRESIGN_EXPIRES_SECONDS` | `3600` | Lifetime of presigned image URLs returned by `/api/words` |

Word images: `/api/words` reads `image_s3_key` from RDS and returns a short-lived presigned GET URL on each level’s `imageUrl` (via `@aws-sdk/client-s3` + the same OIDC IAM role). The UI uses that URL when present and does not fall back to local `/cartoons` files.

---

## `.env.local` example

Typical `.env.local` after `vercel env pull` **plus** your RDS settings:

```env
# From vercel env pull (OIDC for local AWS auth)
VERCEL_OIDC_TOKEN=...

# Add these yourself (Vercel dashboard → Development, or by hand locally)
RDS_PORT=5432
RDS_HOSTNAME=kidwords.cluster-cufu24caaexv.us-east-1.rds.amazonaws.com
RDS_DATABASE=kidwords_app
RDS_USERNAME=kidwords_app_user
AWS_REGION=us-east-1
# AWS_ROLE_ARN — from Vercel OIDC/AWS integration; do not commit or paste in docs
```

`.env.local` is gitignored.

---

## Quick checks

```bash
# Words — expect JSON array or 500 if RDS/network/OIDC fails
curl http://localhost:3000/api/words

# Feedback — 201 when word+grade exists in words; 404 if not published
curl -X POST http://localhost:3000/api/feedback \
  -H 'Content-Type: application/json' \
  -d '{"word":"empathy","level":"K","feedback":"clear definition"}'

# UI — open a published word+grade; Feedback appears bottom-right after RDS overlay
open http://localhost:3000
```

If `/api/words` returns 500, the app still works with bundled words (feedback stays hidden until RDS overlay sets `dbLevels`). Check:

1. All six RDS/AWS vars are set **and** `VERCEL_OIDC_TOKEN` is present (re-run `vercel env pull` or `vercel dev`)
2. RDS security group allows your IP (or VPN/bastion)
3. `empathy` exists in `words` for at least one grade

---

## Vite vs `vercel dev`

| Command | Serves UI | Serves `/api/*` |
|---------|-----------|-----------------|
| `npm run dev` | Yes (port 5173) | No (unless you also run `vercel dev` and use the Vite proxy) |
| `vercel dev` | Yes (port 3000, via Vite) | Yes |

See [rds.md](./rds.md) for the `words` and `feedback` table schemas.
