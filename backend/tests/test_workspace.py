def test_workspace_routes_in_openapi(client):
    res = client.get("/openapi.json")
    assert res.status_code == 200
    paths = res.json()["paths"]
    assert "/api/tasks" in paths
    assert "/api/workspace/stats" in paths


def test_list_tasks_seeded(seeded_client):
    res = seeded_client.get("/api/tasks")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 5
    assert "meeting_title" in items[0]
    assert "meeting_id" in items[0]


def test_list_tasks_open_only(seeded_client):
    all_res = seeded_client.get("/api/tasks", params={"include_completed": True})
    open_res = seeded_client.get("/api/tasks", params={"include_completed": False})
    assert all_res.status_code == 200
    assert open_res.status_code == 200
    all_items = all_res.json()
    open_items = open_res.json()
    assert len(open_items) <= len(all_items)
    assert all(not i["is_completed"] for i in open_items)


def test_workspace_stats_seeded(seeded_client):
    res = seeded_client.get("/api/workspace/stats")
    assert res.status_code == 200
    body = res.json()
    assert body["total_meetings"] >= 6
    assert body["total_action_items"] >= 5
    assert body["total_duration_ms"] > 0
