"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { DeleteMeetingDialog } from "@/components/meetings/DeleteMeetingDialog";
import { EditMeetingDialog } from "@/components/meetings/EditMeetingDialog";
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
import { formatDate, formatDuration } from "@/lib/utils";
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
      <AppShell title="Meeting">
        <p className="text-slate-500">Loading...</p>
      </AppShell>
    );
  }

  if (!meeting) {
    return (
      <AppShell title="Meeting">
        <p className="text-red-600">Meeting not found.</p>
        <Link href="/meetings" className="text-violet-700 underline">Back to library</Link>
      </AppShell>
    );
  }

  return (
    <AppShell title={meeting.title}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/meetings" className="inline-flex items-center gap-1 text-sm text-violet-700">
          <ArrowLeft className="h-4 w-4" /> Back to library
        </Link>
        <div className="flex gap-2">
          <EditMeetingDialog meeting={meeting} />
          <DeleteMeetingDialog meetingId={meeting.id} />
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">
          {formatDate(meeting.occurred_at)} · {formatDuration(meeting.duration_ms)}
        </p>
        {meeting.summary_gist && (
          <p className="mt-1 text-sm text-slate-800">{meeting.summary_gist}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:gap-6">
        {/* Primary workspace: player + transcript */}
        <section
          className="flex min-h-[28rem] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white lg:col-span-3 lg:min-h-[calc(100vh-15rem)]"
          aria-label="Transcript workspace"
        >
          <div className="shrink-0 space-y-2 border-b border-slate-100 bg-gradient-to-b from-violet-50/80 to-white p-3">
            <MediaPlayer meeting={meeting} mediaRef={mediaRef} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFollowTranscript((f) => !f)}
            >
              {followTranscript ? "Following transcript" : "Follow transcript off"}
            </Button>
          </div>
          <div className="min-h-0 flex-1">
            {transcriptQuery.isLoading && (
              <p className="p-4 text-sm text-slate-500">Loading transcript...</p>
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

        {/* Summary intelligence panel */}
        <aside
          className="flex min-h-[20rem] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white lg:col-span-2 lg:min-h-[calc(100vh-15rem)]"
          aria-label="Meeting summary"
        >
          <header className="shrink-0 border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Summary &amp; notes</h2>
            <p className="text-xs text-slate-500">Topics, chapters, and action items</p>
          </header>
          <div className="min-h-0 flex-1">
            {(summaryQuery.isLoading || actionItemsQuery.isLoading) && (
              <p className="p-4 text-sm text-slate-500">Loading summary...</p>
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
      </div>
    </AppShell>
  );
}
