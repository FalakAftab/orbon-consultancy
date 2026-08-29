# Deploying to Hostinger VPS via Dokploy

This app is two services + a database:

| Resource | What it is | Runs from |
|---|---|---|
| `postgres` | Postgres 15+ database | Dokploy-managed database (no Dockerfile needed) |
| `backend` | Laravel 12 API | [backend/Dockerfile](backend/Dockerfile) |
| `frontend` | React (Vite) SPA, served by nginx | [frontend-react/Dockerfile](frontend-react/Dockerfile) |

Dokploy builds each app straight from a Git repo, so the one prerequisite before
any of this works is: **the code needs to be in a Git repo Dokploy can pull
from** (GitHub is easiest — Dokploy has a native GitHub App integration with
auto-deploy on push; GitLab/Bitbucket/plain Git-over-SSH work too).

```bash
# from the project root, if you haven't already:
git init
git add .
git commit -m "Initial commit"
# create an empty repo on GitHub, then:
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin main
```

> Your `backend/.env` currently has real secrets in it (DB password, Gmail app
> password, Google OAuth client secret). It's excluded by [.gitignore](.gitignore)
> so it won't get pushed — good — but since those secrets have been sitting in
> plaintext, it's worth rotating the Gmail app password and the Google OAuth
> client secret at some point before/after going live.

---

## 1. Point your domain at the VPS

In your domain's DNS (at your registrar, or Hostinger's DNS panel if you
bought the domain there), add two **A records** pointing at your VPS's public
IP:

| Type | Name | Value |
|---|---|---|
| A | `app` (→ `app.yourdomain.com`) | `<VPS_IP>` |
| A | `api` (→ `api.yourdomain.com`) | `<VPS_IP>` |

Using separate subdomains for frontend and backend keeps things simple (no
path-based routing needed). DNS propagation can take a few minutes to a
couple of hours.

---

## 2. Install Dokploy on the VPS

SSH into the Hostinger VPS as root, then:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

Requirements the script needs (Hostinger's standard Ubuntu VPS plans meet
these): a non-containerized Linux host, **ports 80, 443, and 3000 free**, and
run as root. The script installs Docker itself and sets up a Docker Swarm +
Traefik automatically.

When it finishes, it prints a URL like `http://<VPS_IP>:3000` — open that,
create your admin account. From then on, do the domain-facing admin over
`https://<a domain/subdomain you point at :3000>` if you want it TLS'd too
(optional, separate from the app domains above).

---

## 3. Create a Project

In the Dokploy dashboard: **Projects → Create Project** (e.g. `orbon-consultancy`).
Everything below (database, backend, frontend) gets created inside this one
project so they share an internal Docker network.

---

## 4. Add the Postgres database

Inside the project: **Create Service → Database → PostgreSQL**.

- Name: `postgres`
- Database name: `germany_consultancy`
- User / Password: set your own (not the local dev ones)

Deploy it. Once running, open its **Connection** tab — Dokploy gives you an
**internal host** (normally just the service name, e.g. `postgres`) and
**internal port** (`5432`). Apps in the same project reach it at that
hostname over the internal network — no public exposure needed.

---

## 5. Deploy the backend (Laravel API)

**Create Service → Application**, connect it to your Git repo.

- **Build type:** Dockerfile
- **Dockerfile path:** `backend/Dockerfile`
- **Docker context path:** `backend`
- **Container port:** `80`

### Environment variables

Paste these into the app's **Environment** tab (adjust values in `<>`):

```
APP_NAME=Germany Study Recommender
APP_ENV=production
APP_KEY=<generate — see note below>
APP_DEBUG=false
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://app.yourdomain.com

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=germany_consultancy
DB_USERNAME=<the user you set in step 4>
DB_PASSWORD=<the password you set in step 4>

SESSION_DRIVER=database
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=database
FILESYSTEM_DISK=public
BROADCAST_CONNECTION=log

CORS_ALLOWED_ORIGINS=https://app.yourdomain.com

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<your gmail address>
MAIL_PASSWORD=<gmail app password>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=<your gmail address>
MAIL_FROM_NAME=Germany Study Recommender

GOOGLE_CLIENT_ID=<your Google OAuth client id>
GOOGLE_CLIENT_SECRET=<your Google OAuth client secret>
GOOGLE_REDIRECT_URI=https://api.yourdomain.com/api/v1/auth/google/callback
```

**Generating `APP_KEY`:** run this once locally and paste the result in
(don't reuse the one from your local `.env` for production):

```bash
php artisan key:generate --show
```

If you also update `GOOGLE_REDIRECT_URI`, add the same URL as an authorized
redirect URI in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
for that OAuth client.

### Domain

In the app's **Domains** tab: **Add Domain**
- Host: `api.yourdomain.com`
- Container Port: `80`
- HTTPS: On, Certificate: **Let's Encrypt**

### Deploy

Click **Deploy**. The image build runs [backend/Dockerfile](backend/Dockerfile);
on container start, [backend/docker/entrypoint.sh](backend/docker/entrypoint.sh)
waits for Postgres, then runs `config:cache`, `route:cache`, `view:cache`,
`migrate --force`, and `storage:link` automatically — so migrations apply on
every deploy without you SSH-ing in.

---

## 6. Deploy the frontend (React)

**Create Service → Application** again, same repo.

- **Build type:** Dockerfile
- **Dockerfile path:** `frontend-react/Dockerfile`
- **Docker context path:** `frontend-react`
- **Container port:** `80`

### Build argument

Vite bakes `VITE_*` vars into the JS bundle at *build* time, not runtime, so
this goes under **Build Args**, not Environment:

```
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Domain

**Domains → Add Domain**
- Host: `app.yourdomain.com`
- Container Port: `80`
- HTTPS: On, Certificate: **Let's Encrypt**

Deploy it.

---

## 7. Verify

- `https://api.yourdomain.com` → should return Laravel's default response (200).
- `https://app.yourdomain.com` → the React app loads, and network requests in
  devtools go to `https://api.yourdomain.com/api/v1/...` and succeed.
- Try registering an account and logging in to confirm the DB connection and
  CORS are correctly wired.

---

## Ongoing

- **Auto-deploy:** enable the Git provider webhook on each app (Dokploy sets
  this up automatically for GitHub) so pushes to `main` redeploy.
- **Logs:** each app's **Logs** tab streams container output — check here
  first if something 500s.
- **Backups:** the Postgres service's **Backups** tab can schedule dumps to
  S3-compatible storage.
- **Scaling:** Dokploy apps default to a single replica, which is fine for
  this app (the entrypoint runs migrations on boot, which isn't safe to run
  concurrently from multiple replicas without extra care).
