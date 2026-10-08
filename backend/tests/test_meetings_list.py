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
