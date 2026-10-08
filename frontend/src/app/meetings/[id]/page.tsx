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
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export default function MeetingDetailPage() {
  const params = useParams();
  const meetingId = Number(params.id);
  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const [tab, setTab] = useState("transcript");
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

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <MediaPlayer meeting={meeting} mediaRef={mediaRef} />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFollowTranscript((f) => !f)}
            >
              {followTranscript ? "Following transcript" : "Follow transcript off"}
            </Button>
          </div>
        </div>

        <div className="min-h-[480px] rounded-lg border border-slate-200 bg-white">
          <Tabs.Root value={tab} onValueChange={setTab}>
            <Tabs.List className="flex border-b border-slate-200">
              {["transcript", "summary"].map((t) => (
                <Tabs.Trigger
                  key={t}
                  value={t}
                  className={cn(
                    "flex-1 px-4 py-3 text-sm font-medium capitalize",
                    tab === t
                      ? "border-b-2 border-violet-600 text-violet-700"
                      : "text-slate-500"
                  )}
                >
                  {t}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <Tabs.Content value="transcript" className="h-[420px]">
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
            </Tabs.Content>
            <Tabs.Content value="summary" className="h-[420px]">
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
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </AppShell>
  );
}
