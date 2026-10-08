"""Seed definitions for six realistic meetings."""

from __future__ import annotations

from typing import Any

DEFAULT_MEDIA = "/media/sample-meeting.mp3"
# Bundled placeholder media in frontend/public/media/ must be at least this long (seconds).
REQUIRED_MEDIA_DURATION_SEC = 255


def _lines(*pairs: tuple[str, str]) -> list[dict[str, str]]:
    return [{"speaker": s, "text": t} for s, t in pairs]


def _build_segments(
    lines: list[dict[str, str]], start_offset_ms: int = 0, ms_per_line: int = 12000
) -> list[dict[str, Any]]:
    segments = []
    t = start_offset_ms
    for i, line in enumerate(lines):
        end = t + ms_per_line
        segments.append(
            {
                "speaker_label": line["speaker"],
                "start_ms": t,
                "end_ms": end,
                "content": line["text"],
                "sequence": i,
            }
        )
        t = end
    return segments


MEETING_DEFINITIONS: list[dict[str, Any]] = []


def _add_meeting(defn: dict[str, Any]) -> None:
    MEETING_DEFINITIONS.append(defn)


# 1 — Product sync
_add_meeting(
    {
        "id": 1,
        "title": "Weekly Product Sync — Atlas Launch",
        "occurred_at": "2025-09-22T15:00:00",
        "media_url": DEFAULT_MEDIA,
        "media_type": "audio",
        "description": "Cross-functional sync on Atlas v2 launch readiness.",
        "participants": [
            {"display_name": "Maya Chen", "email": "maya@northstar.io"},
            {"display_name": "Jordan Blake", "email": "jordan@northstar.io"},
            {"display_name": "Priya Nair", "email": "priya@northstar.io"},
            {"display_name": "Sam Ortiz", "email": "sam@northstar.io"},
            {"display_name": "Elena Ruiz", "email": "elena@northstar.io"},
        ],
        "lines": _lines(
            (
                "Maya Chen",
                "Thanks everyone. Goal today is launch readiness for Atlas v2 on October 3.",
            ),
            (
                "Jordan Blake",
                "Engineering is green on API stability. We fixed the pagination bug from last week.",
            ),
            (
                "Priya Nair",
                "Design shipped final onboarding screens. Mobile polish is in review.",
            ),
            (
                "Sam Ortiz",
                "QA found two regressions in billing exports. Both are P1 but scoped.",
            ),
            (
                "Elena Ruiz",
                "Marketing needs final feature bullets by Thursday for the blog post.",
            ),
            (
                "Maya Chen",
                "Let's walk through the risk register. Biggest item is SSO for enterprise.",
            ),
            (
                "Jordan Blake",
                "SSO lands next Tuesday. We can soft-launch without it for SMB tier.",
            ),
            (
                "Priya Nair",
                "Agreed. Enterprise pilot customers need SSO; everyone else can wait.",
            ),
            (
                "Sam Ortiz",
                "I'll rerun the smoke suite after tonight's deploy to staging.",
            ),
            (
                "Elena Ruiz",
                "Can we get a 60-second demo clip for social? Even screen recording works.",
            ),
            (
                "Maya Chen",
                "Jordan and Priya will record after staging is stable tomorrow.",
            ),
            (
                "Jordan Blake",
                "Performance on dashboard load is under two seconds at p95 now.",
            ),
            (
                "Priya Nair",
                "We should highlight that in release notes — it's a big win.",
            ),
            (
                "Sam Ortiz",
                "Export bug: root cause was timezone formatting in CSV headers.",
            ),
            (
                "Elena Ruiz",
                "Support wants a known-issues doc. I'll draft from Sam's ticket list.",
            ),
            (
                "Maya Chen",
                "Decision: launch date stays Oct 3 unless SSO slips past Monday.",
            ),
            (
                "Jordan Blake",
                "I'll post daily standup updates in #atlas-launch until we're live.",
            ),
            (
                "Priya Nair",
                "I'll sync with docs team on updated admin guide screenshots.",
            ),
            (
                "Sam Ortiz",
                "Need one more QA pass on migration flow for legacy workspaces.",
            ),
            (
                "Elena Ruiz",
                "Webinar dry run scheduled Friday 10am Pacific with customer council.",
            ),
            (
                "Maya Chen",
                "Action recap in chat. Anything blocking anyone before we wrap?",
            ),
            (
                "Jordan Blake",
                "All good from eng — just need final copy for error messages.",
            ),
            (
                "Priya Nair",
                "Copy is in Figma comments; legal approved yesterday.",
            ),
            (
                "Sam Ortiz",
                "I'll close the export tickets once staging build is green.",
            ),
            (
                "Maya Chen",
                "Great work team. Same time next week for post-launch retro prep.",
            ),
        ),
        "summary": {
            "overview": "The team reviewed Atlas v2 launch readiness for October 3. Engineering reported API stability and improved dashboard performance. QA flagged billing export regressions with a known fix. SSO for enterprise remains the main schedule risk with a soft-launch option for SMB. Marketing and support coordination for comms and known-issues documentation was aligned.",
            "gist": "Atlas v2 on track for Oct 3 launch with SSO as primary risk.",
            "key_topics": [
                "Launch timeline",
                "SSO enterprise requirement",
                "Billing export fixes",
                "Marketing assets",
                "QA and staging deploy",
            ],
        },
        "chapters": [
            {"title": "Launch goals", "start_ms": 0},
            {"title": "Engineering status", "start_ms": 12000},
            {"title": "Risk register", "start_ms": 60000},
            {"title": "Decisions and next steps", "start_ms": 180000},
        ],
        "action_items": [
            {
                "title": "Record staging demo clip for marketing",
                "assignee": "Jordan Blake",
                "is_completed": False,
            },
            {
                "title": "Rerun smoke suite after staging deploy",
                "assignee": "Sam Ortiz",
                "is_completed": False,
            },
            {
                "title": "Draft known-issues doc for support",
                "assignee": "Elena Ruiz",
                "is_completed": True,
            },
            {
                "title": "Post daily updates in #atlas-launch",
                "assignee": "Jordan Blake",
                "is_completed": False,
            },
        ],
    }
)

# Additional meetings - I'll add 2-5 in a second file chunk to keep manageable
# For brevity in the write tool, I'll import from a generated approach

# Let me add meetings 2-6 with similar structure but shorter in the same file using a helper

def _meeting(
    id_: int,
    title: str,
    occurred_at: str,
    participants: list[dict],
    lines: list[tuple[str, str]],
    summary: dict,
    chapters: list[dict],
    action_items: list[dict],
    media_type: str = "audio",
    media_url: str = DEFAULT_MEDIA,
) -> dict[str, Any]:
    line_dicts = _lines(*lines)
    segments = _build_segments(line_dicts, ms_per_line=10000)
    return {
        "id": id_,
        "title": title,
        "occurred_at": occurred_at,
        "media_url": media_url,
        "media_type": media_type,
        "description": summary.get("gist", ""),
        "participants": participants,
        "segments": segments,
        "duration_ms": segments[-1]["end_ms"] if segments else 60000,
        "summary": {
            "overview": summary["overview"],
            "gist": summary["gist"],
            "key_topics": summary["key_topics"],
        },
        "chapters": chapters,
        "action_items": action_items,
    }


# Fix meeting 1 to use segments built
_m1 = MEETING_DEFINITIONS[0]
_m1_lines = _m1.pop("lines")
_m1["segments"] = _build_segments(_m1_lines, ms_per_line=10000)
_m1["duration_ms"] = _m1["segments"][-1]["end_ms"]
MEETING_DEFINITIONS[0] = _m1

MEETING_DEFINITIONS.extend(
    [
        _meeting(
            2,
            "Enterprise Discovery — Acme Corp",
            "2025-09-18T14:00:00",
            [
                {"display_name": "Alex Turner", "email": "alex@northstar.io"},
                {"display_name": "Rina Koh", "email": "rina@northstar.io"},
                {"display_name": "Dana Walsh", "email": "dana@acmecorp.com"},
                {"display_name": "Chris Park", "email": "chris@acmecorp.com"},
            ],
            [
                ("Alex Turner", "Thanks for joining. We'd love to understand your meeting workflow today."),
                ("Dana Walsh", "We use Teams for calls but notes live in scattered OneNote pages."),
                ("Chris Park", "Our reps spend hours cleaning transcripts before CRM updates."),
                ("Rina Koh", "Our assistant captures speakers and action items — is that your pain?"),
                ("Dana Walsh", "Exactly. We need reliable speaker labels for compliance reviews."),
                ("Chris Park", "Integration with Salesforce is non-negotiable for a pilot."),
                ("Alex Turner", "CRM sync is on our roadmap; today we offer export and API."),
                ("Rina Koh", "We can walk through a sample workspace with role-based access."),
                ("Dana Walsh", "How do you handle data residency for EU employees?"),
                ("Alex Turner", "EU data stays in Frankfurt region; DPA is standard."),
                ("Chris Park", "What does pricing look like for 400 seats?"),
                ("Rina Koh", "We tier by recorded hours and admin seats — I'll send a proposal."),
                ("Dana Walsh", "We'd want a 90-day pilot with success metrics on note quality."),
                ("Alex Turner", "Typical pilot measures time-to-CRM and action-item completion."),
                ("Chris Park", "Can we redact sensitive segments before sharing externally?"),
                ("Rina Koh", "Yes — manual redaction and admin-only links are supported."),
                ("Dana Walsh", "Security team will need SOC 2 report and pen test summary."),
                ("Alex Turner", "I'll share the trust packet right after this call."),
                ("Chris Park", "If pilot works, procurement needs six-week lead time."),
                ("Rina Koh", "We'll align a mutual success plan with your ops lead."),
                ("Dana Walsh", "Let's schedule a technical deep dive with our IT architect."),
                ("Alex Turner", "I'll propose slots for next week and include solutions engineer."),
                ("Chris Park", "Please include sample API payloads for Salesforce custom objects."),
                ("Rina Koh", "Noted. We'll tailor examples to your opportunity schema."),
                ("Dana Walsh", "Good progress — looking forward to the follow-up."),
            ],
            {
                "overview": "Northstar met Acme Corp stakeholders to explore meeting intelligence needs. Acme struggles with fragmented notes and manual CRM updates. Compliance requires strong speaker attribution. Acme requested Salesforce integration, EU residency, and a 90-day pilot with measurable outcomes.",
                "gist": "Strong enterprise fit; pilot hinging on security review and CRM path.",
                "key_topics": [
                    "Current workflow pain",
                    "Compliance and speaker ID",
                    "Salesforce integration",
                    "Pricing and pilot",
                    "Security documentation",
                ],
            },
            [
                {"title": "Current state", "start_ms": 0},
                {"title": "Product fit", "start_ms": 30000},
                {"title": "Security and compliance", "start_ms": 90000},
                {"title": "Pilot next steps", "start_ms": 150000},
            ],
            [
                {"title": "Send trust packet to Acme security", "assignee": "Alex Turner", "is_completed": True},
                {"title": "Draft 400-seat pricing proposal", "assignee": "Rina Koh", "is_completed": False},
                {"title": "Schedule technical deep dive", "assignee": "Alex Turner", "is_completed": False},
                {"title": "Prepare Salesforce API examples", "assignee": "Rina Koh", "is_completed": False},
            ],
        ),
        _meeting(
            3,
            "1:1 — Growth and Project Feedback",
            "2025-09-25T16:30:00",
            [
                {"display_name": "Nina Alvarez", "email": "nina@northstar.io"},
                {"display_name": "Marcus Lee", "email": "marcus@northstar.io"},
            ],
            [
                ("Nina Alvarez", "How are you feeling about the search project this quarter?"),
                ("Marcus Lee", "Better after we simplified the ranking model. Less burnout."),
                ("Nina Alvarez", "Your doc on tradeoffs was excellent — very clear for leadership."),
                ("Marcus Lee", "Thanks. I want more ownership of the discovery interview program."),
                ("Nina Alvarez", "Let's define what that looks like. Facilitating two calls a month?"),
                ("Marcus Lee", "Yes, and summarizing insights for the roadmap review."),
                ("Nina Alvarez", "I'll sponsor that. It's good growth toward staff track."),
                ("Marcus Lee", "On feedback: I need sharper prioritization from product on P0s."),
                ("Nina Alvarez", "Fair. I'll tighten the intake form and push back on slack requests."),
                ("Marcus Lee", "Appreciate that. Team morale improved after we killed the sidebar experiment."),
                ("Nina Alvarez", "What skills do you want to develop in the next six months?"),
                ("Marcus Lee", "System design for retrieval at scale and mentoring junior engineers."),
                ("Nina Alvarez", "We can pair you with Priya on the indexing spike."),
                ("Marcus Lee", "I'd like that. Also interested in presenting at the eng forum."),
                ("Nina Alvarez", "Slot you for October on search latency wins."),
                ("Marcus Lee", "Any concerns on my performance I should address?"),
                ("Nina Alvarez", "Only to keep communicating risks earlier — last minute SSO flag was tight."),
                ("Marcus Lee", "Understood. I'll raise dependency risks in Monday leads sync."),
                ("Nina Alvarez", "Compensation review is in November; I'll advocate for your scope growth."),
                ("Marcus Lee", "Thank you. Overall I'm motivated and aligned on Q4 goals."),
                ("Nina Alvarez", "Great. Let's check in biweekly until year end."),
            ],
            {
                "overview": "Marcus and Nina discussed project health, career growth, and feedback. Marcus wants more customer discovery ownership and mentoring opportunities. Nina committed to clearer prioritization and a forum talk slot.",
                "gist": "Positive 1:1 with growth plan around discovery and system design.",
                "key_topics": [
                    "Search project health",
                    "Career development",
                    "Prioritization feedback",
                    "Mentoring and visibility",
                ],
            },
            [
                {"title": "Project check-in", "start_ms": 0},
                {"title": "Growth goals", "start_ms": 40000},
                {"title": "Feedback", "start_ms": 100000},
            ],
            [
                {"title": "Facilitate two customer interviews per month", "assignee": "Marcus Lee", "is_completed": False},
                {"title": "Tighten product intake form for P0 requests", "assignee": "Nina Alvarez", "is_completed": False},
                {"title": "Schedule eng forum talk on search latency", "assignee": "Nina Alvarez", "is_completed": False},
            ],
        ),
    ]
)

MEETING_DEFINITIONS.extend(
    [
        _meeting(
            4,
            "Incident Retrospective — API Outage #4421",
            "2025-09-12T11:00:00",
            [
                {"display_name": "Omar Haddad", "email": "omar@northstar.io"},
                {"display_name": "Lily Tran", "email": "lily@northstar.io"},
                {"display_name": "Dev Patel", "email": "dev@northstar.io"},
                {"display_name": "Kate Morrison", "email": "kate@northstar.io"},
                {"display_name": "Ian Brooks", "email": "ian@northstar.io"},
            ],
            [
                ("Omar Haddad", "Welcome to the retro for Friday's API outage. Blameless tone please."),
                ("Lily Tran", "Timeline: elevated 5xx at 14:02 UTC, customer impact until 15:18."),
                ("Dev Patel", "Root cause was a bad config push to the rate limiter service."),
                ("Kate Morrison", "We rolled back within twelve minutes but cache invalidation lagged."),
                ("Ian Brooks", "Status page update went out at 14:25 — we can improve that by ten minutes."),
                ("Omar Haddad", "What early signals did we miss?"),
                ("Lily Tran", "CPU looked fine; error budget burn on auth edge was the clue."),
                ("Dev Patel", "Our dashboard didn't page on limiter saturation — gap in alerts."),
                ("Kate Morrison", "Runbook step three referenced deprecated kubectl context."),
                ("Ian Brooks", "Support ticket volume peaked at 180 concurrent chats."),
                ("Omar Haddad", "Customer comms: who owns the follow-up email to enterprise accounts?"),
                ("Lily Tran", "I'll draft with success managers by end of day."),
                ("Dev Patel", "Proposed fix: canary deploy for limiter config with auto rollback."),
                ("Kate Morrison", "We should add integration test that simulates config reload."),
                ("Ian Brooks", "Documentation update for on-call handoff is in progress."),
                ("Omar Haddad", "Any human factors? Fatigue from prior night's release?"),
                ("Dev Patel", "Yes — we skipped peer review on a one-line change."),
                ("Lily Tran", "Action: mandatory second reviewer for infra repos."),
                ("Kate Morrison", "I'll schedule game day in October for limiter failure mode."),
                ("Ian Brooks", "SLA credits calculated — finance approved for three accounts."),
                ("Omar Haddad", "Let's vote top three follow-ups and assign owners."),
                ("Dev Patel", "Canary deploy, alert fix, and runbook refresh are my picks."),
                ("Lily Tran", "Agreed. We'll track in Jira epic OUT-4421."),
                ("Kate Morrison", "I'll post retro notes in #incidents within an hour."),
                ("Omar Haddad", "Thanks everyone. Good learning — let's execute on the actions."),
            ],
            {
                "overview": "The team reviewed a rate-limiter misconfiguration that caused a 76-minute API outage. Rollback was fast but alerting and runbooks need improvement. Follow-ups include canary deploys, new alerts, mandatory review, and a game day.",
                "gist": "Config push caused outage; process and alerting improvements agreed.",
                "key_topics": [
                    "Incident timeline",
                    "Root cause analysis",
                    "Alerting gaps",
                    "Customer communication",
                    "Preventive actions",
                ],
            },
            [
                {"title": "Timeline review", "start_ms": 0},
                {"title": "Root cause", "start_ms": 20000},
                {"title": "Process gaps", "start_ms": 80000},
                {"title": "Action items", "start_ms": 160000},
            ],
            [
                {"title": "Implement canary deploy for limiter config", "assignee": "Dev Patel", "is_completed": False},
                {"title": "Add saturation alert to monitoring", "assignee": "Lily Tran", "is_completed": False},
                {"title": "Refresh on-call runbook", "assignee": "Kate Morrison", "is_completed": True},
                {"title": "Draft enterprise follow-up email", "assignee": "Lily Tran", "is_completed": False},
                {"title": "Schedule October game day", "assignee": "Kate Morrison", "is_completed": False},
            ],
        ),
        _meeting(
            5,
            "Design Critique — Onboarding Flow v3",
            "2025-09-28T13:00:00",
            [
                {"display_name": "Holly Kim", "email": "holly@northstar.io"},
                {"display_name": "Maya Chen", "email": "maya@northstar.io"},
                {"display_name": "Jordan Blake", "email": "jordan@northstar.io"},
                {"display_name": "Priya Nair", "email": "priya@northstar.io"},
            ],
            [
                ("Holly Kim", "Today we're critiquing onboarding v3 — focus on time-to-first-value."),
                ("Maya Chen", "Users must connect calendar before they see value — that's friction."),
                ("Holly Kim", "Option A delays calendar connect until after first sample meeting."),
                ("Priya Nair", "I like showing a seeded demo transcript immediately."),
                ("Jordan Blake", "We can ship seeded content without backend changes."),
                ("Holly Kim", "Option B keeps calendar first but adds progress checklist."),
                ("Maya Chen", "Checklists tested well in user interviews last month."),
                ("Priya Nair", "Concern: checklist feels long on mobile — five steps max."),
                ("Holly Kim", "Agreed. I'll collapse import and invite into one step."),
                ("Jordan Blake", "Empty states need clearer CTAs — current copy is vague."),
                ("Holly Kim", "New headline: 'Turn your next meeting into searchable notes.'"),
                ("Maya Chen", "Stronger. Legal wants consent copy above recording toggle."),
                ("Priya Nair", "I'll add inline tooltip for recording compliance."),
                ("Holly Kim", "Color contrast on purple buttons passes WCAG AA in latest build."),
                ("Jordan Blake", "Skeleton loaders should mirror final layout to reduce shift."),
                ("Holly Kim", "Noted — I'll update loading components in Figma."),
                ("Maya Chen", "Can we A/B test Option A vs B for two weeks?"),
                ("Priya Nair", "Yes if we limit to new signups in US region first."),
                ("Holly Kim", "I'll prepare spec doc with flows and edge cases by Wednesday."),
                ("Jordan Blake", "Eng estimate is one sprint for Option A, two for B."),
                ("Maya Chen", "Let's decide after we see Holly's final flows."),
                ("Priya Nair", "I'll run quick usability test with five participants Friday."),
                ("Holly Kim", "I'll incorporate feedback before dev kickoff Monday."),
                ("Jordan Blake", "Please flag any new API fields early."),
                ("Maya Chen", "Thanks team — excited to improve activation metrics."),
            ],
            {
                "overview": "Design reviewed onboarding v3 alternatives to reduce friction before first value. Team favored a demo transcript path and a shorter mobile checklist. Compliance copy and A/B test plan were discussed.",
                "gist": "Onboarding critique aligned on demo-first experiment and checklist limits.",
                "key_topics": [
                    "Time-to-first-value",
                    "Calendar connect friction",
                    "Mobile checklist",
                    "Compliance copy",
                    "A/B testing plan",
                ],
            },
            [
                {"title": "Problem framing", "start_ms": 0},
                {"title": "Option A vs B", "start_ms": 30000},
                {"title": "Visual and accessibility", "start_ms": 100000},
                {"title": "Next steps", "start_ms": 170000},
            ],
            [
                {"title": "Publish onboarding v3 spec by Wednesday", "assignee": "Holly Kim", "is_completed": False},
                {"title": "Run five-user usability test Friday", "assignee": "Priya Nair", "is_completed": False},
                {"title": "Add compliance tooltip to recording toggle", "assignee": "Priya Nair", "is_completed": False},
                {"title": "Provide eng estimate after spec review", "assignee": "Jordan Blake", "is_completed": False},
            ],
        ),
        _meeting(
            6,
            "QBR — Horizon Analytics Account",
            "2025-10-01T10:00:00",
            [
                {"display_name": "Elena Ruiz", "email": "elena@northstar.io"},
                {"display_name": "Alex Turner", "email": "alex@northstar.io"},
                {"display_name": "Jamie Foster", "email": "jamie@horizonanalytics.com"},
                {"display_name": "Morgan Ellis", "email": "morgan@horizonanalytics.com"},
            ],
            [
                ("Elena Ruiz", "Thanks for joining our Q3 business review for Horizon Analytics."),
                ("Jamie Foster", "Usage is up 34% quarter over quarter — teams love transcript search."),
                ("Morgan Ellis", "Adoption in sales is lagging; they still prefer manual notes."),
                ("Alex Turner", "We can run a sales enablement session with templates."),
                ("Elena Ruiz", "Health score is 82 — green, with one yellow on admin churn."),
                ("Jamie Foster", "We lost two admin seats after reorg — not product dissatisfaction."),
                ("Morgan Ellis", "Renewal is up in December. We need ROI summary for finance."),
                ("Alex Turner", "I'll pull hours saved report from your workspace analytics."),
                ("Elena Ruiz", "Feature requests: Slack summaries and custom vocabulary."),
                ("Jamie Foster", "Slack integration is beta in November — want early access?"),
                ("Morgan Ellis", "Yes, loop in our RevOps lead Sarah Chen."),
                ("Alex Turner", "Custom vocabulary helps with industry acronyms — easy win."),
                ("Elena Ruiz", "Support tickets down 18% after you enabled auto action items."),
                ("Jamie Foster", "That's a great stat for our internal newsletter."),
                ("Morgan Ellis", "Security asked about retention policy for deleted meetings."),
                ("Alex Turner", "Hard delete within 30 days; soft delete recoverable for 7."),
                ("Elena Ruiz", "We'll send updated DPA appendix reflecting that."),
                ("Jamie Foster", "Training for new hires in October — can you join 30 minutes?"),
                ("Elena Ruiz", "Absolutely — I'll bring a customer success engineer."),
                ("Morgan Ellis", "Pricing for adding 50 seats?"),
                ("Alex Turner", "I'll extend co-termed quote with volume discount."),
                ("Elena Ruiz", "Goal is signed expansion before Thanksgiving."),
                ("Jamie Foster", "Works for us if ROI doc lands by Oct 15."),
                ("Morgan Ellis", "Thanks — strong partnership this quarter."),
                ("Elena Ruiz", "We'll follow up with action items and calendar holds."),
            ],
            {
                "overview": "QBR with Horizon Analytics showed strong usage growth and healthy account score. Sales adoption and ROI documentation are focus areas ahead of December renewal. Slack beta and seat expansion were discussed.",
                "gist": "Healthy QBR; renewal path via ROI doc and sales enablement.",
                "key_topics": [
                    "Usage and adoption",
                    "Renewal timeline",
                    "ROI reporting",
                    "Integrations roadmap",
                    "Seat expansion",
                ],
            },
            [
                {"title": "Usage review", "start_ms": 0},
                {"title": "Adoption gaps", "start_ms": 40000},
                {"title": "Renewal and expansion", "start_ms": 120000},
                {"title": "Partnership next steps", "start_ms": 180000},
            ],
            [
                {"title": "Deliver ROI hours-saved report by Oct 15", "assignee": "Alex Turner", "is_completed": False},
                {"title": "Enroll Horizon in Slack beta", "assignee": "Elena Ruiz", "is_completed": False},
                {"title": "Send co-termed quote for 50 seats", "assignee": "Alex Turner", "is_completed": False},
                {"title": "Schedule October new-hire training", "assignee": "Elena Ruiz", "is_completed": True},
            ],
            media_type="video",
            media_url="/media/sample-meeting.mp4",
        ),
    ]
)
