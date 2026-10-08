import { AppShell } from "@/components/layout/AppShell";
import { Mail, ListChecks, LineChart, Briefcase, Package, UserRound } from "lucide-react";

const skills = [
  {
    title: "Meeting Summary",
    description: "Overview, gist, and key topics from your notepad.",
    icon: ListChecks,
    status: "Available in meeting notepad",
  },
  {
    title: "Action Item Extraction",
    description: "Track tasks across meetings in Tasks view.",
    icon: ListChecks,
    status: "Available",
  },
  {
    title: "Follow-up Email",
    description: "Draft a recap email from meeting intelligence.",
    icon: Mail,
    status: "Coming soon",
  },
  {
    title: "Sales Insights",
    description: "Deal signals and objection patterns.",
    icon: Briefcase,
    status: "Coming soon",
  },
  {
    title: "Product Insights",
    description: "Feature requests and prioritization themes.",
    icon: Package,
    status: "Coming soon",
  },
  {
    title: "Interview Summary",
    description: "Candidate highlights and scorecard notes.",
    icon: UserRound,
    status: "Coming soon",
  },
  {
    title: "Analytics digest",
    description: "Workspace trends from your meeting library.",
    icon: LineChart,
    status: "See Analytics",
  },
];

export default function AiSkillsPage() {
  return (
    <AppShell title="AI Skills" subtitle="Automations powered by your meeting data">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <article key={s.title} className="ff-panel p-4">
            <s.icon className="h-5 w-5 text-violet-600" aria-hidden />
            <h2 className="mt-2 text-sm font-semibold text-zinc-900">{s.title}</h2>
            <p className="mt-1 text-sm text-zinc-600">{s.description}</p>
            <p className="mt-3 text-xs font-medium text-zinc-500">{s.status}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
