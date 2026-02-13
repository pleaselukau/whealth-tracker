\# Database Schema 



This document defines the MVP database schema for the Women’s Health Symptom Tracker.

Target DB: Postgres.



---



\## 1) users

Stores user identity and password hashes.



Columns:

\- `id` UUID PRIMARY KEY

\- `email` TEXT UNIQUE NOT NULL

\- `password\_hash` TEXT NOT NULL

\- `created\_at` TIMESTAMPTZ NOT NULL DEFAULT now()



Indexes:

\- Unique index on `email`



---



\## 2) symptom\_entries

Stores daily symptom logs.



Columns:

\- `id` UUID PRIMARY KEY

\- `user\_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE

\- `date\_time` TIMESTAMPTZ NOT NULL

\- `category` TEXT NOT NULL

\- `severity` INTEGER NOT NULL   (validated at API layer: 1..10)

\- `notes` TEXT NULL

\- `tags` JSONB NULL             (array of strings)

\- `created\_at` TIMESTAMPTZ NOT NULL DEFAULT now()



Indexes:

\- Index on (`user\_id`, `date\_time`)



Notes:

\- `tags` is JSONB to support multiple user-defined labels.

\- We keep category flexible (TEXT) to avoid migrations for new categories.



---



\## 3) exports

Tracks generated export artifacts.



Columns:

\- `id` UUID PRIMARY KEY

\- `user\_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE

\- `type` TEXT NOT NULL          (MVP: "csv")

\- `storage\_key` TEXT NOT NULL   (Phase 0: local filepath; later: S3 key)

\- `created\_at` TIMESTAMPTZ NOT NULL DEFAULT now()

\- `expires\_at` TIMESTAMPTZ NULL (later used for expiring download links)



Indexes:

\- Index on (`user\_id`, `created\_at`)



---



\## 4) audit\_logs

Captures major security/ops-relevant actions.



Columns:

\- `id` UUID PRIMARY KEY

\- `user\_id` UUID NULL REFERENCES users(id) ON DELETE SET NULL

\- `action` TEXT NOT NULL         ("login", "export\_created")

\- `metadata\_json` JSONB NULL     (non-sensitive metadata only)

\- `created\_at` TIMESTAMPTZ NOT NULL DEFAULT now()



Indexes:

\- Index on (`user\_id`, `created\_at`)



Security requirements:

\- Do NOT store passwords, JWTs, or secrets in `metadata\_json`.



