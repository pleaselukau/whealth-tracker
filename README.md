\# Women’s Health Symptom Tracker (Cloud-Native, HIPAA-Aware)



A cloud-native (AWS-first) symptom logging system focused on women’s health. Users can log daily symptoms and later view summaries and export doctor-friendly reports.



\## Repo Structure



\## Local Development



\### Prereqs

\- Docker Desktop

\- Git



\### Run the stack

From repo root:



```bash

docker compose up --build





Documentation



MVP Spec: docs/spec.md



DB Schema: docs/schema.md


---

\## Local Architecture

Local development stack:

User (browser / curl)
        ↓
FastAPI (Docker container, port 8000)
        ↓
Postgres 16 (Docker container, named volume: pgdata)

- API communicates with Postgres via `DATABASE_URL`
- Secrets provided via environment variables
- Logs currently default container stdout

Cloud architecture (AWS ECS + RDS + ALB + S3) will be introduced in later phases.

---

\## Known Limitations

- No authentication implemented yet (design locked, implementation in Phase 1)
- No database migrations implemented yet (Phase 1 via Alembic)
- No AWS infrastructure provisioned yet (Terraform in later phase)
- No structured JSON logging yet (planned for Phase 1)
- Not HIPAA compliant — project is HIPAA-aware by design but not certified

