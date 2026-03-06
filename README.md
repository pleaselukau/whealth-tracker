# Women’s Health Symptom Tracker (Cloud-Native, HIPAA-Aware)

A cloud-native (AWS-first) symptom logging system focused on women’s health.
Users can log daily symptoms and later view summaries and export doctor-friendly reports.

The project is designed with cloud infrastructure, security awareness, and extensibility in mind, even during local development.

## Project Status

Phase 1: Backend MVP — Completed

The backend currently supports:

user registration and authentication

protected symptom logging

symptom CRUD operations

insight summaries and timelines

audit logging

reproducible database migrations

Docker-based local development

automated tests

Frontend development and cloud deployment will follow in later phases.

## Repo Structure

The backend uses a backend/app/ layout rather than a src/ layout.

This structure integrates cleanly with:

FastAPI imports

Alembic migrations

Docker container builds

pytest test discovery

Current project structure:

```bash
backend/
│
├── app/
│   ├── api/
│   │   ├── deps.py
│   │   └── routes/
│   │       ├── auth.py
│   │       ├── insights.py
│   │       └── symptoms.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py
│   │   └── security.py
│   │
│   ├── db/
│   │   ├── base.py
│   │   └── session.py
│   │
│   ├── models/
│   │   ├── audit_log.py
│   │   ├── export.py
│   │   ├── symptom_entry.py
│   │   └── user.py
│   │
│   ├── schemas/
│   │   ├── insight.py
│   │   ├── symptom.py
│   │   └── user.py
│   │
│   ├── services/
│   │   ├── insights.py
│   │   ├── symptoms.py
│   │   └── users.py
│   │
│   └── main.py
│
├── tests/
│   ├── test_auth.py
│   ├── test_health.py
│   ├── test_insights.py
│   └── test_symptoms.py
│
├── alembic/
├── Dockerfile
├── alembic.ini
└── pyproject.toml
```
If the backend grows significantly later, migrating to a src/ layout may still be considered, but it is not required for the current scale of the project.

## Local Development
### Prerequisites

* Docker Desktop
* Git

### Run the stack

From the repository root:

```bash
docker compose up --build
```
This starts:

* FastAPI API server on http://localhost:8000
* Postgres 16 database in a Docker container

### Apply database migrations

Once the containers are running:

```bash
docker compose exec api alembic upgrade head
```

This creates the database schema using Alembic migrations.

### Run tests
```bash
docker compose exec api pytest
```

Tests currently cover:

* health endpoint
* authentication flow
* symptom CRUD
* insights calculations

### Health check
```bash
curl http://localhost:8000/health
```

Expected response:

```bash
{"status":"ok"}
```

## Local Architecture

Local development stack:
```bash
User (browser / curl)
        ↓
FastAPI API (Docker container, port 8000)
        ↓
Postgres 16 (Docker container, named volume: pgdata)
```

Key components:

* FastAPI handles API routing, validation, and authentication
* PostgreSQL stores users, symptom entries, audit logs, and export metadata
* Alembic manages database schema migrations
* Docker Compose orchestrates the API and database containers

Environment variables configure secrets such as:

+ DATABASE_URL
+ JWT_SECRET

Logs currently output to container stdout.

## Backend Features (so far)
### Authentication

Endpoints:

```bash
POST /auth/register
POST /auth/login
GET  /auth/me
```

Authentication uses JWT access tokens.

Passwords are securely hashed using bcrypt via passlib.

### Symptom Tracking

Users can create and manage symptom entries.

#### Endpoints:

```bash
POST   /symptoms
GET    /symptoms
GET    /symptoms/{id}
PUT    /symptoms/{id}
DELETE /symptoms/{id}
```
Each entry records:

* timestamp
* symptom category
* severity (1–10)
* optional notes
* optional tags

All symptom records are user-scoped and protected by authentication.

### Insights

Basic analytics endpoints are available:

```bash
GET /insights/summary
GET /insights/timeline?category=...
```
Summary provides:

* total entries
* number of days tracked
* average severity per category

Timeline provides:
* daily average severity for a specific category

These calculations are performed directly in SQL using aggregation queries.

### Audit Logging

Key user actions are recorded in an audit_logs table.

Examples of recorded events:

* user login
* symptom creation
* symptom update
* symptom deletion

Audit metadata is stored as JSON.

Sensitive data such as passwords or tokens are never logged.

## Documentation

Additional documentation is available in the docs/ folder.

* MVP specification: docs/spec.md
* Database schema: docs/schema.md

## Current Limitations

The project currently focuses on the backend MVP only.

Not yet implemented:

* frontend user interface

* cloud deployment (AWS ECS / RDS / S3)

* export generation (CSV / PDF)

* refresh tokens for authentication

* CI/CD pipeline

* production observability stack

## Compliance Note

This project is HIPAA-aware by design, meaning architectural decisions consider healthcare data sensitivity.

However:

The project is not HIPAA compliant or certified.

Compliance requires additional controls including:

* encrypted storage
* audit infrastructure
* formal policies
* production security reviews

These concerns will be addressed in later phases.

