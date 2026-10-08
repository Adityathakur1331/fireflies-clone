# M1–M25 verification gate

**Gate completed:** 2025-10-08 (automated API tests + frontend build/smoke + code review)

| ID | Requirement | Verification method | Status |
|----|-------------|---------------------|--------|
| M1 | List past meetings | `test_list_meetings_seeded`, UI `/meetings` | Pass |
| M2 | Title, date, duration, participants | `MeetingTable` + API list schema | Pass |
| M3 | Search meetings | `test_search_by_title`, debounced `q` param | Pass |
| M4 | Filter title/date/participant | `test_filter_*`, `test_filter_date_range` | Pass |
| M5 | Sort by recency | `test_sort_by_recency_desc`, default sort | Pass |
| M6 | Navbar profile/settings | `TopNav` dropdown + `/settings` | Pass |
| M7 | Interactive transcript | `TranscriptPanel` + API transcript | Pass |
| M8 | Speaker labels + timestamps | Segment fields in UI | Pass |
| M9 | Media player + seek bar | `MediaPlayer` native controls | Pass |
| M10 | Placeholder media | `public/media/sample-meeting.*` | Pass |
| M11 | Click line → seek | `useTranscriptSync` + click handler | Pass |
| M12 | Playback highlights line | `timeupdate` → active segment | Pass |
| M13 | Transcript search + highlight | `TranscriptPanel` client filter | Pass |
| M14 | Mock summary | Seed + `GET /summary` | Pass |
| M15 | Action items | Seed + CRUD UI/API | Pass |
| M16 | Topics + chapters | `SummaryPanel` + `test_transcript_summary` | Pass |
| M17 | Create meeting | `CreateMeetingDialog` + POST | Pass |
| M18 | Edit metadata | `EditMeetingDialog` + PATCH | Pass |
| M19 | Delete meeting | `DeleteMeetingDialog` + DELETE | Pass |
| M20 | Action item CRUD | `test_action_item_crud`, edit UI | Pass |
| M21 | SQLite persistence | Alembic + CRUD tests | Pass |
| M22 | Fireflies-like UX | Shell, tabs, modals, toasts | Pass |
| M23 | Seeded meetings (6) | `python -m app.seed`, tests | Pass |
| M24 | README | Root `README.md` | Pass |
| M25 | Working local demo | `pytest`, `npm run test:smoke` | Pass |

## Manual UX checks (recommended before submit)

- [ ] Resize browser to mobile width — bottom nav appears, library usable
- [ ] Create meeting → success toast → lands on detail
- [ ] Delete meeting → toast → returns to library
- [ ] Toggle action item → persists after refresh
