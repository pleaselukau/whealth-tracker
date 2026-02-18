from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def list_symptoms():
    return {"detail": "not implemented"}
