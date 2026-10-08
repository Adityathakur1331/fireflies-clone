"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface FilterState {
  q: string;
  participant: string;
  date_from: string;
  date_to: string;
}

const emptyFilters: FilterState = {
  q: "",
  participant: "",
  date_from: "",
  date_to: "",
};

export function MeetingFilters({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const hasActiveFilters = Object.values(filters).some((v) => v.length > 0);

  return (
    <div className="space-y-3">
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
    {hasActiveFilters && (
      <Button type="button" variant="outline" size="sm" onClick={() => onChange(emptyFilters)}>
        Clear filters
      </Button>
    )}
    </div>
  );
}
