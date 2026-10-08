def test_create_get_patch_delete_meeting(seeded_client):
    create = seeded_client.post(
        "/api/meetings",
        json={
            "title": "Test Standup",
            "occurred_at": "2025-10-05T12:00:00",
            "participants": [{"display_name": "Alice"}],
            "transcript_raw": "[00:00:01] Alice: Hello team\n[00:00:10] Alice: Updates",
        },
    )
    assert create.status_code == 201
    meeting_id = create.json()["id"]

    get_res = seeded_client.get(f"/api/meetings/{meeting_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Test Standup"

    patch = seeded_client.patch(
        f"/api/meetings/{meeting_id}",
        json={"title": "Renamed Standup"},
    )
    assert patch.status_code == 200
    assert patch.json()["title"] == "Renamed Standup"

    delete = seeded_client.delete(f"/api/meetings/{meeting_id}")
    assert delete.status_code == 204
    assert seeded_client.get(f"/api/meetings/{meeting_id}").status_code == 404
