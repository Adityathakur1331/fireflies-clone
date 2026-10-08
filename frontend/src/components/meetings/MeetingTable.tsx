"use client";

import Link from "next/link";
import type { MeetingListItem } from "@/types/meeting";
import { formatDate, formatDuration } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function MeetingTable({ meetings }: { meetings: MeetingListItem[] }) {
  if (!meetings.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
        No meetings match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Duration</th>
            <th className="px-4 py-3 font-medium">Participants</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((m) => (
            <tr key={m.id} className="border-b border-slate-100 hover:bg-violet-50/40">
              <td className="px-4 py-3">
                <Link
                  href={`/meetings/${m.id}`}
                  className="font-medium text-violet-700 hover:underline"
                >
                  {m.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">{formatDate(m.occurred_at)}</td>
              <td className="px-4 py-3 text-slate-600">{formatDuration(m.duration_ms)}</td>
              <td className="px-4 py-3">
                <div className="flex -space-x-1">
                  {m.participants.slice(0, 4).map((p) => (
                    <span
                      key={p}
                      title={p}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white bg-violet-100 text-[10px] font-semibold text-violet-800"
                    >
                      {initials(p)}
                    </span>
                  ))}
                  {m.participants.length > 4 && (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-600">
                      +{m.participants.length - 4}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
