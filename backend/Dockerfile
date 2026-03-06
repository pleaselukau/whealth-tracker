FROM python:3.11-slim

WORKDIR /app

# Install project
COPY pyproject.toml setup.cfg /app/
COPY alembic.ini /app/
COPY alembic /app/alembic
COPY app /app/app
COPY tests /app/tests

RUN pip install --no-cache-dir -U pip && pip install --no-cache-dir ".[dev]"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]