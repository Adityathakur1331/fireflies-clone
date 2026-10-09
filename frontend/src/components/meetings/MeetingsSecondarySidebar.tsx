"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Hash, LayoutGrid, Mic, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const links = [
  { id: "mine", label: "My Meetings", icon: LayoutGrid, href: "/meetings?view=mine" },
  { id: "all", label: "All Meetings", icon: LayoutGrid, href: "/meetings?view=all" },
  { id: "voice", label: "Voice Agent Meetings", icon: Mic, href: "/meetings?view=voice", soon: true },
  { id: "uploads", label: "Uploads", icon: Upload, href: "/meetings?view=uploads", badge: "NEW" },
];

export function MeetingsSecondarySidebar() {
  const params = useSearchParams();
  const view = params.get("view") ?? "mine";

  return (
    <aside
      className="hidden w-[220px] shrink-0 flex-col border-r border-[var(--ff-border-subtle)] bg-[var(--ff-canvas)] lg:flex"
      aria-label="Meetings navigation"
    >
      <div className="p-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ff-text-muted)]"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search channels"
            className="h-8 w-full rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface)] py-1 pl-8 pr-2 text-xs text-[var(--ff-text)] placeholder:text-[var(--ff-text-muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ff-accent)]"
            aria-label="Search channels"
          />
        </div>
      </div>
      <nav className="flex flex-col gap-0.5 px-2">
        {links.map(({ id, label, icon: Icon, href, soon, badge }) => {
          const active = view === id;
          return (
            <Link
              key={id}
              href={href}
              className={cn("ff-subnav-item", active && "ff-subnav-item-active")}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" />
              <span className="truncate">{label}</span>
              {badge && (
                <span className="ml-auto rounded bg-[var(--ff-success-muted)]/50 px-1 text-[9px] font-semibold text-[var(--ff-success)]">
                  {badge}
                </span>
              )}
              {soon && (
                <span className="ml-auto text-[10px] text-[var(--ff-text-muted)]">Soon</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 px-3">
        <p className="mb-2 text-[11px] font-medium text-[var(--ff-text-muted)]">All channels</p>
        <div className="ff-panel px-3 py-6 text-center">
          <Hash className="mx-auto h-6 w-6 text-[var(--ff-text-muted)]" />
          <p className="mt-2 text-xs text-[var(--ff-text-secondary)]">
            Create channels to organize conversations
          </p>
          <button
            type="button"
            className="mt-3 rounded-md border border-[var(--ff-border)] px-3 py-1.5 text-xs text-[var(--ff-text-secondary)] hover:bg-[var(--ff-sidebar-hover)]"
          >
            + Channel
          </button>
        </div>
      </div>
    </aside>
  );
}
