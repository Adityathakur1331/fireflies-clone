import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";

export function AppShell({
  children,
  title,
  subtitle,
  actions,
  fullWidth,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--ff-canvas)]">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav title={title} subtitle={subtitle} actions={actions} />
        <main
          className={
            fullWidth
              ? "flex-1 p-0"
              : "mx-auto w-full max-w-[1400px] flex-1 p-4 md:p-5"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
