def test_transcript_and_summary_for_seeded_meeting(seeded_client):
    res = seeded_client.get("/api/meetings/1/transcript")
    assert res.status_code == 200
    segments = res.json()
    assert len(segments) >= 20
    assert segments[0]["sequence"] == 0
    assert "speaker_label" in segments[0]

    summary = seeded_client.get("/api/meetings/1/summary")
    assert summary.status_code == 200
    body = summary.json()
    assert body["overview"]
    assert len(body["key_topics"]) >= 3
    assert len(body["chapters"]) >= 3


def test_meeting_not_found(seeded_client):
    assert seeded_client.get("/api/meetings/99999").status_code == 404
    assert seeded_client.get("/api/meetings/99999/transcript").status_code == 404
