"use client";

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
    <div className="rounded-lg border border-slate-200 bg-slate-900 p-3">
      {isVideo ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={src}
          controls
          className="w-full rounded-md"
        />
      ) : (
        <audio
          ref={mediaRef as React.RefObject<HTMLAudioElement>}
          src={src}
          controls
          className="w-full"
        />
      )}
    </div>
  );
}
