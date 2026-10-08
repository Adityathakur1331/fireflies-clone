"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "mine", label: "My Meetings", href: "/meetings?view=mine" },
  { id: "all", label: "All Meetings", href: "/meetings?view=all" },
  { id: "channels", label: "Channels", href: "/meetings?view=channels", placeholder: true },
];

export function MeetingsSubNav() {
  const params = useSearchParams();
  const view = params.get("view") ?? "mine";

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex gap-1 border-b border-[var(--ff-border)] sm:border-0" aria-label="Meetings views">
        {tabs.map((tab) => {
          const active = view === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "text-violet-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-violet-600 sm:after:-bottom-1"
                  : "text-zinc-600 hover:text-zinc-900"
              )}
            >
              {tab.label}
              {tab.placeholder && (
                <span className="ml-1.5 text-[10px] font-normal text-zinc-400">Soon</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
