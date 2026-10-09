"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, ListTree } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { NotepadToolbar } from "@/components/meetings/NotepadToolbar";
import { NotepadIconRail, type NotepadRailAction } from "@/components/meetings/NotepadIconRail";
import { MediaPlayer } from "@/components/transcript/MediaPlayer";
import { TranscriptPanel } from "@/components/transcript/TranscriptPanel";
import { SummaryPanel } from "@/components/summary/SummaryPanel";
import { useTranscriptSync } from "@/hooks/useTranscriptSync";
import {
  fetchActionItems,
  fetchMeeting,
  fetchSummary,
  fetchTranscript,
} from "@/lib/api/meetings";
import { Button } from "@/components/ui/button";

export default function MeetingDetailPage() {
  const params = useParams();
  const meetingId = Number(params.id);
  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const intelligenceScrollRef = useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const meetingQuery = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => fetchMeeting(meetingId),
    enabled: !Number.isNaN(meetingId),
  });

  const transcriptQuery = useQuery({
    queryKey: ["transcript", meetingId],
    queryFn: () => fetchTranscript(meetingId),
    enabled: !Number.isNaN(meetingId),
  });

  const summaryQuery = useQuery({
    queryKey: ["summary", meetingId],
    queryFn: () => fetchSummary(meetingId),
    enabled: !Number.isNaN(meetingId),
  });

  const actionItemsQuery = useQuery({
    queryKey: ["action-items", meetingId],
    queryFn: () => fetchActionItems(meetingId),
    enabled: !Number.isNaN(meetingId),
  });

  const segments = transcriptQuery.data ?? [];
  const { activeSegmentId, seekToSegment, followTranscript, setFollowTranscript } =
    useTranscriptSync(segments, mediaRef);

  const seekMedia = (ms: number) => {
    const el = mediaRef.current;
    if (!el) return;
    el.currentTime = ms / 1000;
    void el.play().catch(() => undefined);
  };

  const handleRailNavigate = (action: NotepadRailAction) => {
    if (action === "transcript-search") {
      document.getElementById("transcript-search-input")?.focus();
      return;
    }
    const sectionId: Record<Exclude<NotepadRailAction, "transcript-search">, string> = {
      summary: "notepad-summary",
      topics: "notepad-topics",
      actions: "notepad-actions",
      chapters: "notepad-chapters",
    };
    const el = document.getElementById(sectionId[action]);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    intelligenceScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const meeting = meetingQuery.data;

  if (meetingQuery.isLoading) {
    return (
      <AppShell title="Meeting" fullWidth flush>
        <div className="p-6 text-sm text-[var(--ff-text-muted)]">Loading meeting…</div>
      </AppShell>
    );
  }

  if (!meeting) {
    return (
      <AppShell title="Meeting">
        <p className="text-red-600">Meeting not found.</p>
        <Link href="/meetings" className="text-sm text-violet-700 hover:underline">
          Back to meetings
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell title={meeting.title} fullWidth flush>
      <div className="border-b border-[var(--ff-border-subtle)] bg-[var(--ff-canvas)] px-3 py-2 md:px-4">
        <Link
          href="/meetings"
          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--ff-text-secondary)] hover:text-[var(--ff-accent-muted)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          All meetings
        </Link>
      </div>

      <NotepadToolbar meeting={meeting} />

      <div className="ff-notepad-workspace">
        <NotepadIconRail onNavigate={handleRailNavigate} />

        <div
          className="flex min-h-0 min-w-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:gap-0"
        >
          <aside
            className="order-2 flex min-h-[18rem] flex-col overflow-hidden border-t border-[var(--ff-border)] bg-[var(--ff-surface)] lg:order-1 lg:min-h-0 lg:border-r lg:border-t-0"
            aria-label="Meeting intelligence"
          >
            <div className="shrink-0 border-b border-[var(--ff-border-subtle)] px-4 py-2.5">
              <h2 className="text-[13px] font-semibold text-[var(--ff-text)]">Notes</h2>
              <p className="text-[11px] text-[var(--ff-text-muted)]">Summary, topics, action items & chapters</p>
            </div>
            <div ref={intelligenceScrollRef} className="min-h-0 flex-1 overflow-y-auto">
              {(summaryQuery.isLoading || actionItemsQuery.isLoading) && (
                <p className="p-4 text-sm text-[var(--ff-text-muted)]">Loading summary…</p>
              )}
              {(summaryQuery.isError || actionItemsQuery.isError) && (
                <p className="p-4 text-sm text-red-400">Failed to load summary or action items.</p>
              )}
              {summaryQuery.data && actionItemsQuery.data && (
                <SummaryPanel
                  meetingId={meetingId}
                  summary={summaryQuery.data}
                  actionItems={actionItemsQuery.data}
                  onChapterClick={seekMedia}
                />
              )}
            </div>
          </aside>

          <section
            className="order-1 flex min-h-[22rem] flex-col overflow-hidden lg:order-2 lg:min-h-0"
            aria-label="Transcript workspace"
          >
            <div className="sticky top-0 z-10 shrink-0 border-b border-[var(--ff-border)] bg-[var(--ff-surface-elevated)] p-3">
              <MediaPlayer meeting={meeting} mediaRef={mediaRef} />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button
                  variant={followTranscript ? "default" : "outline"}
                  size="sm"
                  type="button"
                  onClick={() => setFollowTranscript((f) => !f)}
                >
                  <ListTree className="h-3.5 w-3.5" aria-hidden />
                  {followTranscript ? "Auto-scroll on" : "Auto-scroll off"}
                </Button>
                <span className="text-xs text-[var(--ff-text-muted)]">
                  Click any line to seek playback
                </span>
              </div>
            </div>
            <div className="min-h-[16rem] flex-1 lg:min-h-0">
              {transcriptQuery.isLoading && (
                <p className="p-4 text-sm text-[var(--ff-text-muted)]">Loading transcript…</p>
              )}
              {transcriptQuery.isError && (
                <p className="p-4 text-sm text-red-400">Failed to load transcript.</p>
              )}
              {transcriptQuery.data && (
                <TranscriptPanel
                  segments={segments}
                  activeSegmentId={activeSegmentId}
                  onLineClick={seekToSegment}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  followTranscript={followTranscript}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
