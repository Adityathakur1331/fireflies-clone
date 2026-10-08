"use client";

import { useEffect, useMemo, useRef } from "react";
import type { TranscriptSegment } from "@/types/meeting";
import { formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function TranscriptPanel({
  segments,
  activeSegmentId,
  onLineClick,
  searchQuery,
  onSearchChange,
  followTranscript,
}: {
  segments: TranscriptSegment[];
  activeSegmentId: number | null;
  onLineClick: (seg: TranscriptSegment) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  followTranscript: boolean;
}) {
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const sorted = useMemo(
    () => [...segments].sort((a, b) => a.sequence - b.sequence),
    [segments]
  );

  const q = searchQuery.trim().toLowerCase();

  useEffect(() => {
    if (!followTranscript || activeSegmentId == null) return;
    const el = rowRefs.current[activeSegmentId];
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeSegmentId, followTranscript]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-3">
        <Input
          placeholder="Search in transcript..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {sorted.map((seg) => {
          const matches =
            q.length > 0 &&
            (seg.content.toLowerCase().includes(q) ||
              seg.speaker_label.toLowerCase().includes(q));
          if (q && !matches) return null;
          const isActive = seg.id === activeSegmentId;
          return (
            <div
              key={seg.id}
              ref={(el) => {
                rowRefs.current[seg.id] = el;
              }}
              onClick={() => onLineClick(seg)}
              className={cn(
                "mb-2 cursor-pointer rounded-md border px-3 py-2 transition-colors",
                isActive
                  ? "border-violet-400 bg-violet-50 ring-1 ring-violet-300"
                  : "border-transparent hover:bg-slate-50",
                matches && !isActive && "bg-amber-50"
              )}
            >
              <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono">{formatTimestamp(seg.start_ms)}</span>
                <span className="font-semibold text-violet-700">{seg.speaker_label}</span>
              </div>
              <p className="text-sm text-slate-800">
                {highlightText(seg.content, q)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function highlightText(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-yellow-200 px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}
