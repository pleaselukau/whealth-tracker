FROM python:3.11-slim

WORKDIR /app

# Install project
COPY pyproject.toml setup.cfg /app/
COPY app /app/app
RUN pip install --no-cache-dir -U pip && pip install --no-cache-dir .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
