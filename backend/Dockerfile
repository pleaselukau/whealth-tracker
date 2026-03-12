FROM python:3.11-slim

WORKDIR /app

# copy dependency files first (better Docker cache)
COPY backend/pyproject.toml /app/

RUN pip install --no-cache-dir -U pip

# copy full project
COPY backend /app

RUN pip install --no-cache-dir .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]