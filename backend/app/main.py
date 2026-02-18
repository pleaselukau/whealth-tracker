from fastapi import FastAPI

from app.core.logging import configure_logging
from app.api.routes import auth, symptoms, insights

configure_logging()

app = FastAPI(
    title="Women’s Health Symptom Tracker API",
    version="0.1.0",
)

# Health stays simple
@app.get("/health")
def health():
    return {"status": "ok"}


# API routers (Phase 1)
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(symptoms.router, prefix="/symptoms", tags=["symptoms"])
app.include_router(insights.router, prefix="/insights", tags=["insights"])
