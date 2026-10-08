from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings
from app.db.base import Base

connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def dev_create_all() -> None:
    """Optional fallback when DEV_BOOTSTRAP=1 — Alembic is the primary path."""
    from app.models import (  # noqa: F401 — register models
        action_item,
        meeting,
        meeting_participant,
        meeting_summary,
        summary_chapter,
        transcript_segment,
    )

    Base.metadata.create_all(bind=engine)
