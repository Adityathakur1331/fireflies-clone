from datetime import datetime

from sqlalchemy.orm import Session

from app.models import ActionItem
from app.schemas.meeting import ActionItemCreate, ActionItemUpdate


def create_action_item(db: Session, meeting_id: int, data: ActionItemCreate) -> ActionItem:
    item = ActionItem(
        meeting_id=meeting_id,
        title=data.title,
        assignee=data.assignee,
        due_at=data.due_at,
        sort_order=0,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_action_item(
    db: Session, meeting_id: int, item_id: int, data: ActionItemUpdate
) -> ActionItem | None:
    item = db.get(ActionItem, item_id)
    if not item or item.meeting_id != meeting_id:
        return None
    if data.title is not None:
        item.title = data.title
    if data.assignee is not None:
        item.assignee = data.assignee
    if data.due_at is not None:
        item.due_at = data.due_at
    if data.is_completed is not None:
        item.is_completed = data.is_completed
    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


def delete_action_item(db: Session, meeting_id: int, item_id: int) -> bool:
    item = db.get(ActionItem, item_id)
    if not item or item.meeting_id != meeting_id:
        return False
    db.delete(item)
    db.commit()
    return True
