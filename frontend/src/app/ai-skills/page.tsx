"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";
import { Mail, ListChecks, LineChart, Briefcase, Package, UserRound, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const skills = [
  {
    id: "summary",
    title: "Meeting Summary",
    category: "Productivity",
    description: "Generate overview, gist, and key topics from your notepad intelligence.",
    icon: ListChecks,
    available: true,
  },
  {
    id: "actions",
    title: "Action Item Extraction",
    category: "Productivity",
    description: "Surface and track tasks across meetings in the Tasks view.",
    icon: ListChecks,
    available: true,
  },
  {
    id: "email",
    title: "Follow-up Email",
    category: "Sales",
    description: "Draft a recap email from meeting notes.",
    icon: Mail,
    available: false,
  },
  {
    id: "sales",
    title: "Sales Insights",
    category: "Sales",
    description: "Deal signals and objection patterns.",
    icon: Briefcase,
    available: false,
  },
  {
    id: "product",
    title: "Product Insights",
    category: "Product",
    description: "Feature requests and prioritization themes.",
    icon: Package,
    available: false,
  },
  {
    id: "interview",
    title: "Interview Summary",
    category: "HR",
    description: "Candidate highlights and scorecard notes.",
    icon: UserRound,
    available: false,
  },
  {
    id: "digest",
    title: "Analytics digest",
    category: "Analytics",
    description: "Workspace trends from your meeting library.",
    icon: LineChart,
    available: true,
  },
];

const tabs = ["Discover", "Active Skills", "Feed"] as const;

export default function AiSkillsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Discover");
  const [category, setCategory] = useState("All");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState(skills[0].id);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(skills.map((s) => s.category)))],
    []
  );

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (q && !s.title.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [category, q]);

  const selected = skills.find((s) => s.id === selectedId) ?? skills[0];

  return (
    <AppShell title="AI Skills" flush>
      <div className="flex min-h-0 flex-1 flex-col border-b border-[var(--ff-border-subtle)] px-4 py-3 md:px-5">
        <div className="flex gap-4 border-b border-[var(--ff-border-subtle)]">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "pb-2 text-sm font-medium",
                tab === t
                  ? "text-[var(--ff-text)] border-b-2 border-[var(--ff-accent)]"
                  : "text-[var(--ff-text-muted)]"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "Discover" && (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="w-full shrink-0 border-b border-[var(--ff-border-subtle)] p-4 lg:w-[320px] lg:border-b-0 lg:border-r">
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ff-text-muted)]" />
              <Input
                className="h-8 pl-8 text-sm"
                placeholder="Search skills"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="mb-3 flex flex-wrap gap-1">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                    category === c
                      ? "bg-[var(--ff-accent)]/20 text-[var(--ff-accent-muted)]"
                      : "text-[var(--ff-text-muted)] hover:bg-[var(--ff-sidebar-hover)]"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <ul className="max-h-[50vh] space-y-1 overflow-y-auto lg:max-h-none">
              {filtered.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(s.id)}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-md px-2 py-2 text-left",
                      selectedId === s.id
                        ? "bg-[var(--ff-sidebar-active)]"
                        : "hover:bg-[var(--ff-sidebar-hover)]"
                    )}
                  >
                    <s.icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ff-text-muted)]" />
                    <div>
                      <p className="text-[13px] font-medium text-[var(--ff-text)]">{s.title}</p>
                      <p className="text-[10px] text-[var(--ff-text-muted)]">{s.category}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 flex-1 p-5">
            <selected.icon className="h-6 w-6 text-[var(--ff-accent-muted)]" aria-hidden />
            <h2 className="mt-2 text-lg font-semibold text-[var(--ff-text)]">{selected.title}</h2>
            <p className="mt-2 max-w-lg text-sm text-[var(--ff-text-secondary)]">{selected.description}</p>
            <p
              className={cn(
                "mt-4 text-xs font-medium",
                selected.available ? "text-[var(--ff-success)]" : "text-[var(--ff-text-muted)]"
              )}
            >
              {selected.available ? "Available in this workspace" : "Coming soon — not connected"}
            </p>
          </div>
        </div>
      )}

      {tab !== "Discover" && (
        <div className="flex flex-1 items-center justify-center p-12 text-sm text-[var(--ff-text-muted)]">
          {tab} is a placeholder in this assignment build.
        </div>
      )}
    </AppShell>
  );
}
