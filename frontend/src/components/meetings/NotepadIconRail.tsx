"use client";

import { toast } from "sonner";
import {
  Bookmark,
  ListTree,
  MessageSquare,
  Scissors,
  Search,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NotepadRailAction =
  | "summary"
  | "topics"
  | "actions"
  | "chapters"
  | "transcript-search";

const ITEMS: {
  id: NotepadRailAction | "comments" | "soundbites" | "bookmarks";
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  available: boolean;
}[] = [
  { id: "summary", icon: Sparkles, label: "Summary", available: true },
  { id: "transcript-search", icon: Search, label: "Transcript search", available: true },
  { id: "topics", icon: ListTree, label: "Topics index", available: true },
  { id: "actions", icon: ListTree, label: "Action items", available: true },
  { id: "chapters", icon: ListTree, label: "Chapters", available: true },
  { id: "soundbites", icon: Scissors, label: "Soundbites", available: false },
  { id: "comments", icon: MessageSquare, label: "Comments", available: false },
  { id: "bookmarks", icon: Bookmark, label: "Bookmarks", available: false },
];

export function NotepadIconRail({
  onNavigate,
  className,
}: {
  onNavigate: (action: NotepadRailAction) => void;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "flex shrink-0 flex-row items-center justify-center gap-1 border-b border-[var(--ff-border-subtle)] bg-[var(--ff-canvas)] px-2 py-2 lg:w-12 lg:flex-col lg:justify-start lg:gap-2 lg:border-b-0 lg:border-r lg:py-3",
        className
      )}
      aria-label="Notepad tools"
    >
      {ITEMS.map(({ id, icon: Icon, label, available }) => (
        <button
          key={id}
          type="button"
          title={available ? label : `${label} (unavailable)`}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md text-[var(--ff-text-secondary)] transition-colors",
            available
              ? "hover:bg-[var(--ff-sidebar-hover)] hover:text-[var(--ff-text)]"
              : "cursor-not-allowed opacity-35"
          )}
          onClick={() => {
            if (!available) {
              toast.message("Not available", {
                description: `${label} is not included in this demo build.`,
              });
              return;
            }
            if (
              id === "summary" ||
              id === "topics" ||
              id === "actions" ||
              id === "chapters" ||
              id === "transcript-search"
            ) {
              onNavigate(id);
            }
          }}
        >
          <Icon className="h-4 w-4" aria-hidden />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </nav>
  );
}
