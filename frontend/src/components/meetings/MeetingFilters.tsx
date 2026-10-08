"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface FilterState {
  q: string;
  participant: string;
  date_from: string;
  date_to: string;
}

export function MeetingFilters({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <div>
        <Label>Search</Label>
        <Input
          placeholder="Title or participant"
          value={filters.q}
          onChange={(e) => onChange({ ...filters, q: e.target.value })}
        />
      </div>
      <div>
        <Label>Participant</Label>
        <Input
          placeholder="Filter by name"
          value={filters.participant}
          onChange={(e) => onChange({ ...filters, participant: e.target.value })}
        />
      </div>
      <div>
        <Label>From date</Label>
        <Input
          type="date"
          value={filters.date_from}
          onChange={(e) => onChange({ ...filters, date_from: e.target.value })}
        />
      </div>
      <div>
        <Label>To date</Label>
        <Input
          type="date"
          value={filters.date_to}
          onChange={(e) => onChange({ ...filters, date_to: e.target.value })}
        />
      </div>
    </div>
  );
}
