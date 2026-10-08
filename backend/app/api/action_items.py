from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.meeting import ActionItemCreate, ActionItemOut, ActionItemUpdate
from app.services import action_items as action_item_service
from app.services import meetings as meeting_service

router = APIRouter(prefix="/meetings/{meeting_id}/action-items", tags=["action-items"])


@router.get("", response_model=list[ActionItemOut])
def list_action_items(meeting_id: int, db: Session = Depends(get_db)) -> list[ActionItemOut]:
    if not meeting_service.get_meeting_detail(db, meeting_id):
        raise HTTPException(status_code=404, detail="Meeting not found")
    items = meeting_service.get_action_items(db, meeting_id)
    return [ActionItemOut.model_validate(i) for i in items]


@router.post("", response_model=ActionItemOut, status_code=201)
def create_action_item(
    meeting_id: int, data: ActionItemCreate, db: Session = Depends(get_db)
) -> ActionItemOut:
    if not meeting_service.get_meeting_detail(db, meeting_id):
        raise HTTPException(status_code=404, detail="Meeting not found")
    item = action_item_service.create_action_item(db, meeting_id, data)
    return ActionItemOut.model_validate(item)


@router.patch("/{item_id}", response_model=ActionItemOut)
def update_action_item(
    meeting_id: int,
    item_id: int,
    data: ActionItemUpdate,
    db: Session = Depends(get_db),
) -> ActionItemOut:
    item = action_item_service.update_action_item(db, meeting_id, item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    return ActionItemOut.model_validate(item)


@router.delete("/{item_id}", status_code=204)
def delete_action_item(
    meeting_id: int, item_id: int, db: Session = Depends(get_db)
) -> None:
    if not action_item_service.delete_action_item(db, meeting_id, item_id):
        raise HTTPException(status_code=404, detail="Action item not found")
