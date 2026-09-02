# Vakpon Tours — Backend API

NestJS + MongoDB API for the Vakpon Tours platform: auth, offers, reservations,
customer CRM, staff/team management, an audit log, and transactional email.

Frontend apps (landing site, admin back-office, espace client) live in the
separate [VakponApp](https://github.com/Parisius/VakponApp) repo and talk to
this API over HTTP.

## Setup

### Option A — Docker (recommended)

```bash
cp .env.example .env
```

Fill in `.env` — at minimum `JWT_SECRET` and the `SMTP_*` values (see Option B
below for field notes). Leave `MONGODB_URI` as-is; Compose overrides it
automatically so the API talks to the containerized Mongo.

```bash
docker compose up --build
```

This starts three containers:
- `api` — the NestJS backend on `http://localhost:3001/api` (see `docker-compose.yml` for the exact port mapping)
- `mongo` — MongoDB, data persisted in a named volume (`mongo-data`)
- `mongo-express` — a small DB viewer at `http://localhost:8081` (`admin`/`admin`) —
  dev convenience only, remove this service before deploying to production

Seed your first admin account (in a second terminal, while the stack is running):

```bash
docker compose exec api node dist/seed-admin.js
```

Everyday commands:

```bash
docker compose up -d       # run in the background
docker compose logs -f api # tail the API logs
docker compose down        # stop everything (data is kept in the volume)
docker compose down -v     # stop AND wipe the database volume
docker compose up --build  # rebuild after changing backend code
```

### Option B — Run locally with Node

```bash
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGODB_URI` — a MongoDB connection string (local `mongodb://localhost:27017/vakpon-tours`, or MongoDB Atlas)
- `JWT_SECRET` — any long random string
- `SMTP_*` — credentials from your email provider (Brevo/Sendinblue or Resend both have generous free tiers)
- `MAIL_FROM` — must be on the same domain as `SMTP_USER`, or most providers will reject the send with a sender-verification error
- `ADMIN_ALERT_EMAIL` — where new-reservation notifications go
- `CLIENT_URL` — the deployed Espace Client URL, linked to from customer emails
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — your first admin login

## Deployment topology

The domain (`vakpon-tours.com`) stays on cPanel for DNS + mail (MX records
untouched) — all app hosting lives on a VPS instead. This API runs on its own
subdomain, `api.vakpon-tours.com`, while `site/`, `admin/`, and
`espace-client/` (from the [VakponApp](https://github.com/Parisius/VakponApp)
repo) are deployed as **subpaths of the root domain**, on the same VPS:

- `https://vakpon-tours.com/` → the landing site
- `https://vakpon-tours.com/admin/index.html` → the back-office
- `https://vakpon-tours.com/espace-client/index.html` → the customer portal

Because all three are one origin, production `CORS_ORIGIN` is just
`https://vakpon-tours.com` — a single value, unlike local dev's three ports.
`CLIENT_URL` becomes `https://vakpon-tours.com/espace-client/index.html`.

`deploy/nginx-api.conf` reverse-proxies `api.vakpon-tours.com` to the `api`
container, which `docker-compose.yml` binds to `127.0.0.1:3001` only — it
must never be reachable directly from the public internet. See
[VakponApp's `deploy/`](https://github.com/Parisius/VakponApp/tree/main/deploy)
for the matching frontend Nginx config.

```bash
npm run build
npm run seed:admin
npm run start:dev   # http://localhost:3000/api
```

## API docs

Swagger UI is served at `/api/docs` once the server is running
(e.g. `http://localhost:3001/api/docs`) — every route, DTO, and the bearer-auth
flow for testing endpoints directly.

## Roles

Staff accounts (`role`, beyond the customer-facing `customer` role):

| Role | Access |
|---|---|
| `admin` | everything, including team management |
| `operations` | everything, including team management |
| `service_client` / `support` | reservations (manage) + customer CRM |
| `financial` | reservations (read-only) |
| `marketing` | offers only |

See `src/common/roles.ts` for the exact permission groups, applied via
`@Roles(...)` guards on each controller.

## How a booking flows end-to-end

1. Visitor fills out the public reservation form → `POST /api/reservations/public`
2. If no account exists for that email, one is created and a temporary password is emailed
3. Customer gets a confirmation email; staff get an alert at `ADMIN_ALERT_EMAIL`
4. Staff review it in the back-office, move the status through
   `pending → confirmed → awaiting_payment → paid → completed` (or `cancelled`),
   and can message the customer — each status change and message triggers an email
5. Customer follows all of this from Espace Client, including replying

Payment stays manual — no online payment is wired in. Adding Stripe later would
be a contained addition to the `reservations` module.

## Everything logged

Every meaningful staff action (status changes, offer edits, team member
create/remove, password resets/changes, CRM edits) is recorded to the
`auditlogs` collection and readable at `GET /api/admin/logs`.
