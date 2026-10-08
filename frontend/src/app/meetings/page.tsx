"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { CreateMeetingDialog } from "@/components/meetings/CreateMeetingDialog";
import { MeetingFilters, type FilterState } from "@/components/meetings/MeetingFilters";
import { MeetingList } from "@/components/meetings/MeetingList";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchMeetings } from "@/lib/api/meetings";

export default function MeetingsPage() {
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

  return (
    <AppShell
      title="Meetings"
      subtitle={
        data ? `${data.total} meeting${data.total === 1 ? "" : "s"} · newest first` : undefined
      }
      actions={<CreateMeetingDialog />}
    >
      <div className="mb-4">
        <MeetingFilters filters={filters} onChange={setFilters} />
      </div>
      {isLoading && (
        <div className="ff-panel p-10 text-center text-sm text-zinc-500">Loading meetings…</div>
      )}
      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Could not load meetings. Ensure the API is running at{" "}
          {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}.
          <br />
          {(error as Error).message}
        </div>
      )}
      {!isLoading && !isError && data && <MeetingList meetings={data.items} />}
    </AppShell>
  );
}
