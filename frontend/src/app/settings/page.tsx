import { AppShell } from "@/components/layout/AppShell";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="max-w-lg rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold">Workspace settings</h2>
        <p className="mt-2 text-sm text-slate-600">
          This is a placeholder settings page. Authentication, integrations, and team
          preferences are out of scope for this assignment demo.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Profile — placeholder</li>
          <li>Notifications — placeholder</li>
          <li>Calendar connect — placeholder</li>
        </ul>
      </div>
    </AppShell>
  );
}
