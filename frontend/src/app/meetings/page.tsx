"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MeetingFilters, type FilterState } from "@/components/meetings/MeetingFilters";
import { MeetingList } from "@/components/meetings/MeetingList";
import { MeetingsSecondarySidebar } from "@/components/meetings/MeetingsSecondarySidebar";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchMeetings } from "@/lib/api/meetings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function MeetingsPageContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "mine";
  const [hostTab, setHostTab] = useState<"hosted" | "shared">("hosted");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    q: "",
    participant: "",
    date_from: "",
    date_to: "",
  });
  const debouncedQ = useDebounce(filters.q);

  const queryParams = useMemo(
    () => ({
      q: debouncedQ || undefined,
      participant: filters.participant || undefined,
      date_from: filters.date_from ? `${filters.date_from}T00:00:00` : undefined,
      date_to: filters.date_to ? `${filters.date_to}T23:59:59` : undefined,
      sort: "occurred_at_desc",
    }),
    [debouncedQ, filters]
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["meetings", queryParams],
    queryFn: () => fetchMeetings(queryParams),
  });

  const showList =
    hostTab === "hosted" && view !== "channels" && view !== "voice";

  return (
    <AppShell title="Meetings" flush searchPlaceholder="Search by title or keyword">
      <div className="flex min-h-0 flex-1">
        <MeetingsSecondarySidebar />
        <div className="min-w-0 flex-1 overflow-auto p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-md border border-[var(--ff-border)] p-0.5">
              <button
                type="button"
                onClick={() => setHostTab("hosted")}
                className={cn(
                  "rounded px-3 py-1.5 text-xs font-medium",
                  hostTab === "hosted"
                    ? "bg-[var(--ff-sidebar-active)] text-[var(--ff-text)]"
                    : "text-[var(--ff-text-secondary)]"
                )}
              >
                Hosted by me
              </button>
              <button
                type="button"
                onClick={() => setHostTab("shared")}
                className={cn(
                  "rounded px-3 py-1.5 text-xs font-medium",
                  hostTab === "shared"
                    ? "bg-[var(--ff-sidebar-active)] text-[var(--ff-text)]"
                    : "text-[var(--ff-text-secondary)]"
                )}
              >
                Shared with me
              </button>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters((f) => !f)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mb-4">
              <MeetingFilters filters={filters} onChange={setFilters} />
            </div>
          )}

          {view === "channels" && (
            <div className="ff-panel px-6 py-16 text-center">
              <p className="text-sm font-medium text-[var(--ff-text)]">Channels</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--ff-text-secondary)]">
                Channel organization is not enabled in this assignment demo.
              </p>
            </div>
          )}

          {view === "voice" && (
            <div className="ff-panel px-6 py-16 text-center text-sm text-[var(--ff-text-secondary)]">
              Voice agent meetings — coming soon.
            </div>
          )}

          {hostTab === "shared" && view !== "channels" && view !== "voice" && (
            <div className="ff-panel px-6 py-16 text-center">
              <p className="text-sm text-[var(--ff-text-secondary)]">
                No meetings shared with you in this demo workspace.
              </p>
            </div>
          )}

          {showList && (
            <>
              {isLoading && (
                <div className="ff-panel p-10 text-center text-sm text-[var(--ff-text-muted)]">
                  Loading meetings…
                </div>
              )}
              {isError && (
                <div className="rounded-md border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-300">
                  Could not load meetings. {(error as Error).message}
                </div>
              )}
              {!isLoading && !isError && data && <MeetingList meetings={data.items} />}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function MeetingsPage() {
  return (
    <Suspense
      fallback={
        <AppShell title="Meetings">
          <p className="text-sm text-[var(--ff-text-muted)]">Loading…</p>
        </AppShell>
      }
    >
      <MeetingsPageContent />
    </Suspense>
  );
}
