import { useCallback, useEffect, useMemo, useState } from "react";
import type { TranscriptSegment } from "@/types/meeting";

export function useTranscriptSync(
  segments: TranscriptSegment[],
  mediaRef: React.RefObject<HTMLMediaElement | null>
) {
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(null);
  const [followTranscript, setFollowTranscript] = useState(true);

  const sorted = useMemo(
    () => [...segments].sort((a, b) => a.sequence - b.sequence),
    [segments]
  );

  const findSegmentForTime = useCallback(
    (timeMs: number) => {
      for (let i = sorted.length - 1; i >= 0; i--) {
        const seg = sorted[i];
        if (timeMs >= seg.start_ms) return seg;
      }
      return sorted[0] ?? null;
    },
    [sorted]
  );

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;

    const onTimeUpdate = () => {
      const ms = Math.floor(el.currentTime * 1000);
      const seg = findSegmentForTime(ms);
      if (seg) setActiveSegmentId(seg.id);
    };

    el.addEventListener("timeupdate", onTimeUpdate);
    return () => el.removeEventListener("timeupdate", onTimeUpdate);
  }, [mediaRef, findSegmentForTime]);

  const seekToSegment = useCallback(
    (segment: TranscriptSegment) => {
      const el = mediaRef.current;
      if (!el) return;
      el.currentTime = segment.start_ms / 1000;
      setActiveSegmentId(segment.id);
      void el.play().catch(() => undefined);
    },
    [mediaRef]
  );

  return {
    activeSegmentId,
    seekToSegment,
    followTranscript,
    setFollowTranscript,
  };
}
