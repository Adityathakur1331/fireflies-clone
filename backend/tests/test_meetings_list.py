def test_list_meetings_seeded(seeded_client):
    res = seeded_client.get("/api/meetings")
    assert res.status_code == 200
    body = res.json()
    assert body["total"] == 6
    assert len(body["items"]) == 6


def test_search_by_title(seeded_client):
    res = seeded_client.get("/api/meetings", params={"q": "QBR"})
    assert res.status_code == 200
    assert res.json()["total"] >= 1


def test_filter_participant(seeded_client):
    res = seeded_client.get("/api/meetings", params={"participant": "Maya"})
    assert res.status_code == 200
    assert res.json()["total"] >= 1


def test_filter_date_range(seeded_client):
    res = seeded_client.get(
        "/api/meetings",
        params={"date_from": "2025-09-01T00:00:00", "date_to": "2025-09-30T23:59:59"},
    )
    assert res.status_code == 200
    assert res.json()["total"] >= 1


def test_sort_by_recency_desc(seeded_client):
    res = seeded_client.get("/api/meetings", params={"sort": "occurred_at_desc"})
    assert res.status_code == 200
    items = res.json()["items"]
    assert len(items) >= 2
    first = items[0]["occurred_at"]
    second = items[1]["occurred_at"]
    assert first >= second
