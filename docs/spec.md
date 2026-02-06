\# Women’s Health Symptom Tracker — MVP Spec (Phase 0)



\## Problem

Women track symptoms across notes apps, calendars, and memory. Doctors don’t see longitudinal data.



\## MVP Goal

A secure system where a user can log daily symptoms and view simple summaries, then export a doctor-friendly CSV for a chosen date range.



\## In Scope (MVP)



\### 1) Authentication

\- Register (email + password)

\- Login (email + password)

\- JWT-based auth for API requests (access token)

\- Passwords stored as strong hashes (never plaintext)



\### 2) Symptom Entries (CRUD)

A user can:

\- Create a symptom entry

\- List their entries (default: last 30 days, adjustable via query params)

\- Update an entry

\- Delete an entry



Entry fields:

\- `date\_time` (required)

\- `category` (required): e.g., cramps, headache, mood, fatigue, sleep

\- `severity` (required): integer 1–10

\- `notes` (optional): free-text

\- `tags` (optional): list of strings (e.g., "period day 2", "post-workout")



\### 3) Insights (simple aggregations)

No ML. Use aggregation rules:

\- Weekly counts per category (last 7 days)

\- Monthly counts per category (last 30 days)

\- Average severity per category (last 7/30 days)

\- Simple “correlation-ish” insight:

&nbsp; - Example rule: if a user logs `sleep\_hours` in tags or notes in a consistent format later, we can surface a heuristic like:

&nbsp;   “Cramps severity tends to be higher on days with sleep < 6h”

&nbsp; - For Phase 0, this is defined but not implemented.



\### 4) Export for doctor (CSV)

\- User requests export for a date range (e.g., last 30/90 days)

\- System generates a CSV file containing entries in that range

\- In local dev: store file locally and record it in the database

\- In cloud phase later: store to S3 and return an expiring pre-signed URL



\### 5) Audit log (minimal)

Log major actions:

\- `login`

\- `export\_created`



Audit logs must not contain secrets (passwords, JWTs).



\## Non-Goals (Phase 0)

\- No AWS resources provisioned yet (Terraform comes later)

\- No PDF export yet (CSV only)

\- No doctor accounts / sharing workflows yet

\- No mobile app yet

\- No ML or advanced analytics



\## Local Development Requirements (Phase 0)

\- `docker compose up` starts Postgres + API

\- API provides `GET /health` → 200 OK

\- Basic safe error handling (no stack traces exposed by default in prod mode later)

\- Input validation via Pydantic models

\- Tests skeleton exists (pytest)



\## API (Phase 0 minimum)

\- `GET /health` → `{ "status": "ok" }`



