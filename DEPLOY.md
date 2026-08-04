# Deploying AthleteConnect to maketheroster.com (Vercel + GitHub)

Production build is verified (`npm run build`). The build runs `prisma generate`
before `next build`, so the git-ignored Prisma client is regenerated in CI.

## 1. Push to GitHub
This folder is already a git repo with an initial commit. Create an **empty**
GitHub repo (no README), then:

```bash
git remote add origin https://github.com/<you>/maketheroster.git
git branch -M main
git push -u origin main
```

## 2. Import into Vercel
1. vercel.com → **Add New → Project** → import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected). Leave build/output defaults —
   the `build` script already handles `prisma generate`.
3. Add the **Environment Variables** below (Production scope), then **Deploy**.

## 3. Environment variables (copy values from your local `.env`)
| Name | Value |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** string (has `-pooler`) — from local `.env` |
| `DIRECT_URL` | Neon **direct** string (no `-pooler`) — from local `.env` |
| `AUTH_SECRET` | from local `.env` (or run `openssl rand -base64 32` for a new one) |
| `AUTH_TRUST_HOST` | `true` |
| `AUTH_URL` | `https://maketheroster.com` |

> The DB is the existing Neon project (soft/demo launch) — already migrated, so
> no migration step is needed. If you later want a clean prod DB, create a new
> Neon database, set the two URLs to it, and run `npx prisma migrate deploy`.

## 4. Connect the domain
Vercel → Project → **Settings → Domains** → add `maketheroster.com` and
`www.maketheroster.com`. Vercel shows the exact DNS records; at your registrar add:

- **A** record `@` → `76.76.21.21` (Vercel shows the current value)
- **CNAME** `www` → `cname.vercel-dns.com`

Then set `AUTH_URL` to your final canonical domain and redeploy.

## ⚠️ Before this is a real public launch
- **Remove/secure test logins** — the DB has `admin@athleteconnect.test /
  Password123!` and other seeded accounts. Anyone can log in as admin. Delete or
  rotate these (or use a fresh prod DB).
- **Payments are stubbed** — "paid member" gating works but there is no Stripe
  checkout; upgrading just flips the `plan` field.
- **Media licensing** — Unsplash/Mixkit assets are free-licensed but lack model
  releases; confirm rights for commercial use.
