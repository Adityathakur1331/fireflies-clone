from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.seed import run_seed

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/seed")
def seed_database(db: Session = Depends(get_db)) -> dict[str, str]:
    run_seed(db)
    return {"status": "ok", "message": "Database seeded with 6 meetings"}
