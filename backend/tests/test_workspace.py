def test_list_tasks_seeded(seeded_client):
    res = seeded_client.get("/api/tasks")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 5
    assert "meeting_title" in items[0]
    assert "meeting_id" in items[0]


def test_workspace_stats_seeded(seeded_client):
    res = seeded_client.get("/api/workspace/stats")
    assert res.status_code == 200
    body = res.json()
    assert body["total_meetings"] >= 6
    assert body["total_action_items"] >= 5
    assert body["total_duration_ms"] > 0
