FROM python:3.11-slim

WORKDIR /app

# install build tools required for some python packages
RUN apt-get update && apt-get install -y build-essential

# copy dependency file
COPY pyproject.toml .

# install dependencies
RUN pip install --no-cache-dir .

# copy backend code
COPY backend ./backend

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]