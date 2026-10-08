"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkspaceSearch({
  className,
  placeholder = "Search by title or keyword",
  value,
  onChange,
}: {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className={cn("relative mx-auto w-full max-w-xl", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ff-text-muted)]"
        aria-hidden
      />
      <input
        type="search"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-full border border-[var(--ff-border)] bg-[var(--ff-surface)] py-1 pl-9 pr-16 text-sm text-[var(--ff-text)] placeholder:text-[var(--ff-text-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ff-accent)]"
        aria-label="Search workspace"
      />
      <kbd
        className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--ff-border)] bg-[var(--ff-bg)] px-1.5 py-0.5 text-[10px] text-[var(--ff-text-muted)] sm:inline"
      >
        ⌘K
      </kbd>
    </div>
  );
}
