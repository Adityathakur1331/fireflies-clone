"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { CreateMeetingDialog } from "@/components/meetings/CreateMeetingDialog";
import { MeetingFilters, type FilterState } from "@/components/meetings/MeetingFilters";
import { MeetingTable } from "@/components/meetings/MeetingTable";
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
    <AppShell title="Meetings library">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-600">
            Sorted by recency · {data?.total ?? 0} meetings
          </p>
        </div>
        <CreateMeetingDialog />
      </div>
      <div className="mb-4">
        <MeetingFilters filters={filters} onChange={setFilters} />
      </div>
      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading meetings...
        </div>
      )}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {(error as Error).message}
        </div>
      )}
      {data && <MeetingTable meetings={data.items} />}
    </AppShell>
  );
}
