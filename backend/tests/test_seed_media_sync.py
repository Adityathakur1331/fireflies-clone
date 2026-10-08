from app.seed.meetings_data import MEETING_DEFINITIONS, REQUIRED_MEDIA_DURATION_SEC


def test_seed_transcript_within_media_cap():
    max_end_ms = max(
        seg["end_ms"] for defn in MEETING_DEFINITIONS for seg in defn["segments"]
    )
    assert max_end_ms <= REQUIRED_MEDIA_DURATION_SEC * 1000


def test_meeting_duration_matches_transcript_end():
    for defn in MEETING_DEFINITIONS:
        max_end = max(seg["end_ms"] for seg in defn["segments"])
        assert defn["duration_ms"] == max_end
