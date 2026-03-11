FROM python:3.11-slim

WORKDIR /app

# Install project
COPY backend/alembic.ini /app/
COPY backend/alembic /app/alembic
COPY backend/app /app/app
COPY backend/tests /app/tests

RUN pip install --no-cache-dir -U pip && pip install --no-cache-dir ".[dev]"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]