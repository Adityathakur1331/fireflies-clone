"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceSearch } from "./WorkspaceSearchContext";

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
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const workspace = useWorkspaceSearch();

  const query = value ?? workspace.query;
  const setQuery = onChange ?? workspace.setQuery;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const runMeetingSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      if (pathname.startsWith("/meetings")) {
        workspace.applyMeetingsSearch(trimmed);
      } else {
        router.push(`/meetings?q=${encodeURIComponent(trimmed)}`);
      }
      setFocused(false);
      inputRef.current?.blur();
    },
    [pathname, router, workspace]
  );

  const showMenu = focused && query.trim().length > 0;

  return (
    <div className={cn("relative mx-auto w-full max-w-xl", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ff-text-muted)]"
        aria-hidden
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            runMeetingSearch(query);
          }
        }}
        placeholder={placeholder}
        className="h-9 w-full rounded-full border border-[var(--ff-border)] bg-[var(--ff-surface)] py-1 pl-9 pr-16 text-sm text-[var(--ff-text)] placeholder:text-[var(--ff-text-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ff-accent)]"
        aria-label="Search workspace"
        aria-controls={showMenu ? "workspace-search-menu" : undefined}
      />
      <kbd
        className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--ff-border)] bg-[var(--ff-bg)] px-1.5 py-0.5 text-[10px] text-[var(--ff-text-muted)] sm:inline"
      >
        ⌘K
      </kbd>

      {showMenu && (
        <div
          id="workspace-search-menu"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-lg border border-[var(--ff-border)] bg-[var(--ff-surface-elevated)] py-1 shadow-xl"
          role="listbox"
        >
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[var(--ff-text)] hover:bg-[var(--ff-sidebar-hover)]"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runMeetingSearch(query)}
          >
            <Search className="h-4 w-4 text-[var(--ff-text-muted)]" aria-hidden />
            Search meetings for &ldquo;{query.trim()}&rdquo;
          </button>
          <Link
            href={`/askfred?q=${encodeURIComponent(query.trim())}`}
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-[var(--ff-text)] hover:bg-[var(--ff-sidebar-hover)]"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setFocused(false)}
          >
            <Sparkles className="h-4 w-4 text-[var(--ff-accent-muted)]" aria-hidden />
            Ask Fred about &ldquo;{query.trim()}&rdquo;
          </Link>
        </div>
      )}
    </div>
  );
}
