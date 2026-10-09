"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import type { TranscriptSegment } from "@/types/meeting";
import { formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { speakerColorClass, speakerInitials } from "@/lib/speaker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [matchIndex, setMatchIndex] = useState(0);

  const sorted = useMemo(
    () => [...segments].sort((a, b) => a.sequence - b.sequence),
    [segments]
  );

  const q = searchQuery.trim().toLowerCase();

  const matchingIds = useMemo(() => {
    if (!q) return [];
    return sorted
      .filter(
        (seg) =>
          seg.content.toLowerCase().includes(q) ||
          seg.speaker_label.toLowerCase().includes(q)
      )
      .map((s) => s.id);
  }, [sorted, q]);

  useEffect(() => {
    setMatchIndex(0);
  }, [q]);

  useEffect(() => {
    if (!followTranscript || activeSegmentId == null) return;
    const el = rowRefs.current[activeSegmentId];
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeSegmentId, followTranscript]);

  const scrollToMatch = (index: number) => {
    const id = matchingIds[index];
    if (id == null) return;
    const el = rowRefs.current[id];
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    onLineClick(sorted.find((s) => s.id === id)!);
  };

  const goPrev = () => {
    if (!matchingIds.length) return;
    const next = (matchIndex - 1 + matchingIds.length) % matchingIds.length;
    setMatchIndex(next);
    scrollToMatch(next);
  };

  const goNext = () => {
    if (!matchingIds.length) return;
    const next = (matchIndex + 1) % matchingIds.length;
    setMatchIndex(next);
    scrollToMatch(next);
  };

  const visibleSegments = q
    ? sorted.filter((seg) => matchingIds.includes(seg.id))
    : sorted;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--ff-border)] bg-[var(--ff-surface)] px-3 py-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ff-text-muted)]"
              aria-hidden
            />
            <Input
              id="transcript-search-input"
              className="h-8 pl-8 pr-8 text-sm"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search transcript"
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--ff-text-muted)] hover:text-[var(--ff-text)]"
                aria-label="Clear search"
                onClick={() => onSearchChange("")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {q && (
            <div className="flex items-center gap-1 text-xs text-[var(--ff-text-secondary)]">
              <span className="whitespace-nowrap tabular-nums">
                {matchingIds.length
                  ? `${matchIndex + 1} / ${matchingIds.length}`
                  : "0 results"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={!matchingIds.length}
                onClick={goPrev}
                aria-label="Previous match"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={!matchingIds.length}
                onClick={goNext}
                aria-label="Next match"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {q && !matchingIds.length && (
          <p className="px-2 py-8 text-center text-sm text-[var(--ff-text-muted)]">
            No matches for &ldquo;{searchQuery.trim()}&rdquo;
          </p>
        )}
        {visibleSegments.map((seg) => {
          const isActive = seg.id === activeSegmentId;
          const isMatch = q.length > 0;
          return (
            <div
              key={seg.id}
              ref={(el) => {
                rowRefs.current[seg.id] = el;
              }}
              onClick={() => onLineClick(seg)}
              className={cn(
                "mb-1 flex cursor-pointer gap-2.5 rounded-md border px-2 py-2 transition-colors",
                isActive
                  ? "ff-transcript-line-active border-transparent pl-[6px]"
                  : "border-transparent pl-2 hover:bg-[var(--ff-sidebar-hover)]",
                isMatch && !isActive && "bg-amber-950/30"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                  speakerColorClass(seg.speaker_label)
                )}
              >
                {speakerInitials(seg.speaker_label)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex flex-wrap items-baseline gap-2">
                  <span className="text-[13px] font-semibold text-[var(--ff-text)]">
                    {seg.speaker_label}
                  </span>
                  <button
                    type="button"
                    className="font-mono text-[11px] text-[var(--ff-accent-muted)] hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLineClick(seg);
                    }}
                  >
                    {formatTimestamp(seg.start_ms)}
                  </button>
                </div>
                <p className="text-[13px] leading-relaxed text-[var(--ff-text-secondary)]">
                  {highlightAll(seg.content, q)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function highlightAll(text: string, query: string) {
  if (!query) return text;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts: ReactNode[] = [];
  let start = 0;
  let idx = lower.indexOf(q, start);
  while (idx >= 0) {
    if (idx > start) parts.push(text.slice(start, idx));
    parts.push(
      <mark key={idx} className="rounded bg-amber-400/30 px-0.5 text-[var(--ff-text)]">
        {text.slice(idx, idx + q.length)}
      </mark>
    );
    start = idx + q.length;
    idx = lower.indexOf(q, start);
  }
  if (start < text.length) parts.push(text.slice(start));
  return parts.length ? parts : text;
}
