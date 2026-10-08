import re

from app.schemas.meeting import TranscriptSegmentInput

LINE_PATTERN = re.compile(
    r"^\[(\d{1,2}):(\d{2}):(\d{2})\]\s*([^:]+):\s*(.+)$",
    re.MULTILINE,
)


def parse_timestamp_to_ms(h: str, m: str, s: str) -> int:
    return (int(h) * 3600 + int(m) * 60 + int(s)) * 1000


def parse_transcript_raw(raw: str) -> list[TranscriptSegmentInput]:
    segments: list[TranscriptSegmentInput] = []
    lines = [ln.strip() for ln in raw.strip().splitlines() if ln.strip()]
    for i, line in enumerate(lines):
        match = LINE_PATTERN.match(line)
        if not match:
            raise ValueError(
                f"Line {i + 1} invalid. Use format: [HH:MM:SS] Speaker Name: text"
            )
        h, m, s, speaker, content = match.groups()
        start_ms = parse_timestamp_to_ms(h, m, s)
        end_ms = start_ms + 5000
        if i + 1 < len(lines):
            next_match = LINE_PATTERN.match(lines[i + 1])
            if next_match:
                nh, nm, ns, _, _ = next_match.groups()
                end_ms = parse_timestamp_to_ms(nh, nm, ns)
        segments.append(
            TranscriptSegmentInput(
                speaker_label=speaker.strip(),
                start_ms=start_ms,
                end_ms=end_ms,
                content=content.strip(),
            )
        )
    if not segments:
        raise ValueError("Transcript is empty or could not be parsed.")
    return segments
