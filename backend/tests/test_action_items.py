def test_list_action_items_seeded(seeded_client):
    res = seeded_client.get("/api/meetings/1/action-items")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 3


def test_action_item_crud(seeded_client):
    meeting_id = 1
    create = seeded_client.post(
        f"/api/meetings/{meeting_id}/action-items",
        json={"title": "Ship feature flag", "assignee": "Jordan"},
    )
    assert create.status_code == 201
    item_id = create.json()["id"]

    patch = seeded_client.patch(
        f"/api/meetings/{meeting_id}/action-items/{item_id}",
        json={"is_completed": True, "title": "Ship feature flag (updated)"},
    )
    assert patch.status_code == 200
    assert patch.json()["is_completed"] is True
    assert patch.json()["title"] == "Ship feature flag (updated)"

    delete = seeded_client.delete(
        f"/api/meetings/{meeting_id}/action-items/{item_id}"
    )
    assert delete.status_code == 204
