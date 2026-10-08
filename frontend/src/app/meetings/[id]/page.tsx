"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, ListTree } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MeetingHeader } from "@/components/meetings/MeetingHeader";
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

  const meeting = meetingQuery.data;

  if (meetingQuery.isLoading) {
    return (
      <AppShell title="Meeting" fullWidth>
        <div className="p-6 text-sm text-zinc-500">Loading meeting…</div>
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
    <AppShell title={meeting.title} fullWidth>
      <div className="border-b border-[var(--ff-border)] bg-white px-4 py-2 md:px-5">
        <Link
          href="/meetings"
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-violet-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          All meetings
        </Link>
      </div>

      <div className="px-4 py-4 md:px-5">
        <MeetingHeader meeting={meeting} />

        <div
          className="flex min-h-[calc(100vh-12rem)] flex-col gap-4 lg:grid lg:grid-cols-5 lg:gap-0 lg:border lg:border-[var(--ff-border)] lg:bg-white"
        >
          {/* Intelligence — left on desktop, below transcript on mobile */}
          <aside
            className="order-2 flex min-h-[20rem] flex-col overflow-hidden lg:order-1 lg:col-span-2 lg:min-h-0 lg:border-r lg:border-[var(--ff-border)]"
            aria-label="Meeting intelligence"
          >
            <header className="shrink-0 border-b border-[var(--ff-border)] bg-zinc-50/80 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-900">Notepad</h2>
              <p className="text-xs text-zinc-500">AI summary, notes, and action items</p>
            </header>
            <div className="min-h-0 flex-1 bg-white">
              {(summaryQuery.isLoading || actionItemsQuery.isLoading) && (
                <p className="p-4 text-sm text-zinc-500">Loading summary…</p>
              )}
              {(summaryQuery.isError || actionItemsQuery.isError) && (
                <p className="p-4 text-sm text-red-600">Failed to load summary or action items.</p>
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

          {/* Transcript + recording — right on desktop, first on mobile */}
          <section
            className="order-1 flex min-h-[24rem] flex-col overflow-hidden lg:order-2 lg:col-span-3 lg:min-h-0"
            aria-label="Transcript workspace"
          >
            <div className="shrink-0 border-b border-[var(--ff-border)] bg-zinc-50/50 p-3">
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
                <span className="text-xs text-zinc-500">
                  Click any line to seek playback
                </span>
              </div>
            </div>
            <div className="min-h-[20rem] flex-1 lg:min-h-0">
              {transcriptQuery.isLoading && (
                <p className="p-4 text-sm text-zinc-500">Loading transcript…</p>
              )}
              {transcriptQuery.isError && (
                <p className="p-4 text-sm text-red-600">Failed to load transcript.</p>
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
