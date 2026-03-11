FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -U pip && pip install --no-cache-dir -r requirements.txt

COPY alembic.ini /app/
COPY alembic /app/alembic
COPY app /app/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]