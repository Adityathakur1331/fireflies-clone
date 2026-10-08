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
    <div className="overflow-hidden rounded-md border border-zinc-800/50 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-1.5">
        <Mic2 className="h-3.5 w-3.5 text-violet-300" aria-hidden />
        <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          Recording
        </span>
      </div>
      <div className="p-2">
        {isVideo ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            controls
            className="max-h-[220px] w-full rounded-sm bg-black"
          />
        ) : (
          <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={src}
            controls
            className="h-10 w-full accent-violet-500"
          />
        )}
      </div>
    </div>
  );
}
