"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";
import {
  Mail,
  ListChecks,
  LineChart,
  Briefcase,
  Package,
  UserRound,
  Search,
  Zap,
  Sparkles,
  ChevronDown,
  Code2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const skills = [
  {
    id: "summary",
    title: "Meeting Summary",
    category: "Productivity",
    description: "Generate overview, gist, and key topics from your notepad intelligence.",
    icon: ListChecks,
    iconBg: "bg-sky-600",
    available: true,
    uses: "12.4k",
    enabled: true,
  },
  {
    id: "actions",
    title: "Action Item Extraction",
    category: "Productivity",
    description: "Surface and track tasks across meetings in the Tasks view.",
    icon: ListChecks,
    iconBg: "bg-emerald-600",
    available: true,
    uses: "9.1k",
    enabled: true,
  },
  {
    id: "automation",
    title: "Automation Finder",
    category: "Engineering",
    description: "Identify tasks that could benefit from automation.",
    icon: Code2,
    iconBg: "bg-blue-600",
    available: false,
    uses: "59.6k",
    enabled: false,
  },
  {
    id: "email",
    title: "Follow-up Email",
    category: "Sales",
    description: "Draft a recap email from meeting notes.",
    icon: Mail,
    iconBg: "bg-violet-600",
    available: false,
    uses: "4.2k",
    enabled: false,
  },
  {
    id: "sales",
    title: "Sales Insights",
    category: "Sales",
    description: "Deal signals and objection patterns.",
    icon: Briefcase,
    iconBg: "bg-amber-600",
    available: false,
    uses: "3.8k",
    enabled: false,
  },
  {
    id: "product",
    title: "Product Insights",
    category: "Product",
    description: "Feature requests and prioritization themes.",
    icon: Package,
    iconBg: "bg-orange-600",
    available: false,
    uses: "2.1k",
    enabled: false,
  },
  {
    id: "interview",
    title: "Interview Summary",
    category: "HR",
    description: "Candidate highlights and scorecard notes.",
    icon: UserRound,
    iconBg: "bg-pink-600",
    available: false,
    uses: "1.6k",
    enabled: false,
  },
  {
    id: "digest",
    title: "Analytics digest",
    category: "Analytics",
    description: "Workspace trends from your meeting library.",
    icon: LineChart,
    iconBg: "bg-indigo-600",
    available: true,
    uses: "11.8k",
    enabled: true,
  },
];

const tabs = ["Discover", "Active Skills (3)", "Feed"] as const;

export default function AiSkillsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Discover");
  const [category, setCategory] = useState("Engineering");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState("automation");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(skills.map((s) => [s.id, s.enabled]))
  );

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

  const toggleSkill = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AppShell title="AI Skills" flush>
      <div className="border-b border-[var(--ff-border-subtle)] px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-4">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "pb-2 text-sm font-medium",
                  tab === t
                    ? "border-b-2 border-[var(--ff-accent)] text-[var(--ff-text)]"
                    : "text-[var(--ff-text-muted)]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <Button size="sm" variant="default" className="shrink-0">
            + Create Skill
          </Button>
        </div>
        <div
          className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--ff-border-subtle)] bg-[var(--ff-surface)] px-4 py-3"
        >
          <p className="text-sm text-[var(--ff-text-secondary)]">
            <span className="font-medium text-[var(--ff-text)]">Meet AI Skills</span> — Automate meeting
            insights, follow-ups, and reports.
          </p>
          <span className="text-xs text-[var(--ff-accent-muted)]">See how it works (demo)</span>
        </div>
      </div>

      {tab === "Discover" && (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="w-full shrink-0 border-b border-[var(--ff-border-subtle)] p-4 lg:w-[360px] lg:border-b-0 lg:border-r">
            <div className="mb-3 flex items-center gap-2">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-between rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface)] px-2.5 py-1.5 text-left text-xs text-[var(--ff-text-secondary)]"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5" />
                  {category}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--ff-text-muted)]" />
              </button>
              <div className="relative w-[120px]">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ff-text-muted)]" />
                <Input
                  className="h-8 pl-7 text-xs"
                  placeholder="Search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
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
                  <div
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md border px-2 py-2",
                      selectedId === s.id
                        ? "border-[var(--ff-accent)]/50 bg-[var(--ff-sidebar-active)]"
                        : "border-transparent hover:bg-[var(--ff-sidebar-hover)]"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(s.id)}
                      className="flex min-w-0 flex-1 items-start gap-2 text-left"
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white",
                          s.iconBg
                        )}
                      >
                        <s.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-[var(--ff-text)]">{s.title}</p>
                        <p className="text-[10px] text-[var(--ff-text-muted)]">
                          Fireflies · <Zap className="inline h-2.5 w-2.5" /> {s.uses}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={enabled[s.id]}
                      onClick={() => toggleSkill(s.id)}
                      className={cn(
                        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                        enabled[s.id] ? "bg-[var(--ff-accent)]" : "bg-[var(--ff-border)]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                          enabled[s.id] ? "left-[18px]" : "left-0.5"
                        )}
                      />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 flex-1 p-5 md:p-6">
            <div
              className={cn(
                "mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-white",
                selected.iconBg
              )}
            >
              <selected.icon className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ff-text)]">{selected.title}</h2>
            <p className="mt-1 text-xs text-[var(--ff-text-muted)]">
              Fireflies · <Zap className="inline h-3 w-3" /> {selected.uses} uses
            </p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--ff-text-secondary)]">
              {selected.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" disabled={!selected.available}>
                Enable
              </Button>
              <Button size="sm" variant="outline">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Try Skill
              </Button>
            </div>
            <p
              className={cn(
                "mt-4 text-xs font-medium",
                selected.available ? "text-[var(--ff-success)]" : "text-[var(--ff-text-muted)]"
              )}
            >
              {selected.available
                ? "Available in this workspace (seeded notepad data)"
                : "Coming soon — not connected to live models"}
            </p>
            <div className="mt-8 max-w-md rounded-lg border border-[var(--ff-border)] bg-[var(--ff-surface)] p-4">
              <p className="text-sm font-medium text-[var(--ff-text)]">Get insights on Slack</p>
              <p className="mt-1 text-xs text-[var(--ff-text-muted)]">
                Receive skills output to your Slack channel —{" "}
                <span className="text-[var(--ff-accent-muted)]">Connect (demo)</span>
              </p>
            </div>
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
