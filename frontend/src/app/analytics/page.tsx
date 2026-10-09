"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { fetchWorkspaceStats } from "@/lib/api/workspace";
import { ApiError } from "@/lib/api/client";
import { formatDuration } from "@/lib/utils";

export default function AnalyticsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workspace-stats"],
    queryFn: fetchWorkspaceStats,
  });

  const errMsg =
    error instanceof ApiError
      ? `${error.message} (${error.status})`
      : error instanceof Error
        ? error.message
        : "Unknown error";

  return (
    <AppShell title="Analytics" subtitle="Insights from your meeting library">
      {isLoading && (
        <p className="text-sm text-[var(--ff-text-muted)]">Loading analytics…</p>
      )}
      {isError && (
        <div className="ff-panel border-red-900/50 bg-red-950/30 p-4 text-sm text-red-300">
          Could not load analytics from <code className="text-red-200">/api/workspace/stats</code>.
          <br />
          {errMsg}
          <br />
          <span className="mt-2 block text-[var(--ff-text-secondary)]">
            Ensure the API is running with the latest code (restart uvicorn with{" "}
            <code className="text-[var(--ff-text)]">--reload</code>).
          </span>
        </div>
      )}
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
                <p className="text-xs text-[var(--ff-text-muted)]">{m.label}</p>
                <p className="mt-1 text-2xl font-semibold text-[var(--ff-text)]">{m.value}</p>
              </div>
            ))}
          </div>

          <section className="ff-panel p-4">
            <h2 className="text-sm font-semibold text-[var(--ff-text)]">Meetings by month</h2>
            <ul className="mt-3 space-y-2">
              {data.meetings_by_month.map((row) => (
                <li key={row.month} className="flex items-center gap-3 text-sm">
                  <span className="w-20 shrink-0 font-mono text-xs text-[var(--ff-text-muted)]">
                    {row.month}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--ff-surface-elevated)]">
                    <div
                      className="h-full rounded-full bg-[var(--ff-accent)]"
                      style={{
                        width: `${Math.min(100, (row.count / Math.max(data.total_meetings, 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right tabular-nums text-[var(--ff-text-secondary)]">
                    {row.count}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="ff-panel p-4">
            <h2 className="text-sm font-semibold text-[var(--ff-text)]">Top discussion topics</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {data.top_topics.map((t) => (
                <li
                  key={t.topic}
                  className="rounded-md border border-[var(--ff-accent)]/30 bg-[var(--ff-accent)]/10 px-2.5 py-1 text-xs font-medium text-[var(--ff-accent-muted)]"
                >
                  {t.topic}{" "}
                  <span className="text-[var(--ff-text-secondary)]">({t.count})</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </AppShell>
  );
}
