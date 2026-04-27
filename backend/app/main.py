from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, exports, insights, symptoms
from app.core.logging import configure_logging

origins = [
    "http://localhost:5173",
    "https://whealth-tracker.vercel.app",
    "https://whealth-tracker-git-main-pleaselukau.vercel.app",
]

configure_logging()

app = FastAPI(
    title="Women’s Health Symptom Tracker API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(symptoms.router, prefix="/symptoms", tags=["symptoms"])
app.include_router(insights.router, prefix="/insights", tags=["insights"])
app.include_router(exports.router, prefix="/exports", tags=["exports"])