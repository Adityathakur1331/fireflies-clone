"use client";

import { Mic2 } from "lucide-react";
import type { MeetingDetail } from "@/types/meeting";

export function MediaPlayer({
  meeting,
  mediaRef,
}: {
  meeting: MeetingDetail;
  mediaRef: React.RefObject<HTMLMediaElement | null>;
}) {
  const src = meeting.media_url ?? "/media/sample-meeting.mp3";
  const isVideo = meeting.media_type === "video";

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--ff-border-subtle)] bg-[var(--ff-surface)]">
      <div className="flex items-center gap-2 border-b border-[var(--ff-border-subtle)] px-3 py-1.5">
        <Mic2 className="h-3.5 w-3.5 text-[var(--ff-accent-muted)]" aria-hidden />
        <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--ff-text-muted)]">
          Recording
        </span>
      </div>
      <div className="p-2.5">
        {isVideo ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            controls
            className="max-h-[200px] w-full rounded-md bg-black"
          />
        ) : (
          <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={src}
            controls
            className="h-9 w-full accent-[var(--ff-accent)]"
          />
        )}
      </div>
    </div>
  );
}
