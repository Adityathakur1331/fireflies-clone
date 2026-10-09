import { AppShell } from "@/components/layout/AppShell";
import { Mail, ListChecks, LineChart, Briefcase, Package, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const skills = [
  {
    title: "Meeting Summary",
    description: "Overview, gist, and key topics from your notepad.",
    icon: ListChecks,
    status: "Available in meeting notepad",
    available: true,
  },
  {
    title: "Action Item Extraction",
    description: "Track tasks across meetings in Tasks view.",
    icon: ListChecks,
    status: "Available",
    available: true,
  },
  {
    title: "Follow-up Email",
    description: "Draft a recap email from meeting intelligence.",
    icon: Mail,
    status: "Coming soon",
    available: false,
  },
  {
    title: "Sales Insights",
    description: "Deal signals and objection patterns.",
    icon: Briefcase,
    status: "Coming soon",
    available: false,
  },
  {
    title: "Product Insights",
    description: "Feature requests and prioritization themes.",
    icon: Package,
    status: "Coming soon",
    available: false,
  },
  {
    title: "Interview Summary",
    description: "Candidate highlights and scorecard notes.",
    icon: UserRound,
    status: "Coming soon",
    available: false,
  },
  {
    title: "Analytics digest",
    description: "Workspace trends from your meeting library.",
    icon: LineChart,
    status: "See Analytics",
    available: true,
  },
];

export default function AiSkillsPage() {
  return (
    <AppShell title="AI Skills" subtitle="Automations powered by your meeting data">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <article
            key={s.title}
            className={cn(
              "ff-panel p-4",
              !s.available && "opacity-90"
            )}
          >
            <s.icon
              className={cn(
                "h-5 w-5",
                s.available ? "text-[var(--ff-accent-muted)]" : "text-[var(--ff-text-muted)]"
              )}
              aria-hidden
            />
            <h2 className="mt-2 text-sm font-semibold text-[var(--ff-text)]">{s.title}</h2>
            <p className="mt-1 text-sm text-[var(--ff-text-secondary)]">{s.description}</p>
            <p
              className={cn(
                "mt-3 text-xs font-medium",
                s.available ? "text-[var(--ff-success)]" : "ff-disabled-label"
              )}
            >
              {s.status}
            </p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
