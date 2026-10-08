"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { fetchWorkspaceStats } from "@/lib/api/workspace";
import { formatDuration } from "@/lib/utils";

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["workspace-stats"],
    queryFn: fetchWorkspaceStats,
  });

  return (
    <AppShell title="Analytics" subtitle="Insights from your meeting library">
      {isLoading && <p className="text-sm text-zinc-500">Loading analytics…</p>}
      {isError && <p className="text-sm text-red-600">Could not load analytics.</p>}
      {data && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total meetings", value: data.total_meetings },
              { label: "Total duration", value: formatDuration(data.total_duration_ms) },
              { label: "Action items", value: data.total_action_items },
              {
                label: "Completion rate",
                value:
                  data.total_action_items === 0
                    ? "—"
                    : `${Math.round(
                        (data.completed_action_items / data.total_action_items) * 100
                      )}%`,
              },
            ].map((m) => (
              <div key={m.label} className="ff-panel p-4">
                <p className="text-xs text-zinc-500">{m.label}</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-900">{m.value}</p>
              </div>
            ))}
          </div>

          <section className="ff-panel p-4">
            <h2 className="text-sm font-semibold text-zinc-900">Meetings by month</h2>
            <ul className="mt-3 space-y-2">
              {data.meetings_by_month.map((row) => (
                <li key={row.month} className="flex items-center gap-3 text-sm">
                  <span className="w-20 shrink-0 font-mono text-xs text-zinc-500">{row.month}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{
                        width: `${Math.min(100, (row.count / Math.max(data.total_meetings, 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right tabular-nums text-zinc-700">{row.count}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="ff-panel p-4">
            <h2 className="text-sm font-semibold text-zinc-900">Top discussion topics</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {data.top_topics.map((t) => (
                <li
                  key={t.topic}
                  className="rounded-md border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-900"
                >
                  {t.topic} <span className="text-violet-600">({t.count})</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </AppShell>
  );
}
