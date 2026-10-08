from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class MeetingSummary(Base):
    __tablename__ = "meeting_summaries"

    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id", ondelete="CASCADE"), primary_key=True
    )
    overview: Mapped[str | None] = mapped_column(Text)
    gist: Mapped[str | None] = mapped_column(Text)
    key_topics_json: Mapped[str | None] = mapped_column(Text)

    meeting = relationship("Meeting", back_populates="summary")
