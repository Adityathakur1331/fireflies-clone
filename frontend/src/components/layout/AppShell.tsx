"use client";

import { AppSidebar } from "./AppSidebar";
import { SidebarCollapseProvider } from "./SidebarCollapseContext";
import { TopNav } from "./TopNav";
import { WorkspaceSearchProvider } from "./WorkspaceSearchContext";

export function AppShell({
  children,
  title,
  subtitle,
  actions,
  fullWidth,
  flush,
  searchPlaceholder,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  fullWidth?: boolean;
  /** No padding on main — for split layouts */
  flush?: boolean;
  searchPlaceholder?: string;
}) {
  return (
    <SidebarCollapseProvider>
      <WorkspaceSearchProvider>
        <div className="flex min-h-screen bg-[var(--ff-bg)]">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopNav
              title={title}
              subtitle={subtitle}
              actions={actions}
              searchPlaceholder={searchPlaceholder}
            />
        <main
          className={
            flush
              ? "flex min-h-0 flex-1 flex-col"
              : fullWidth
                ? "flex-1 p-0"
                : "mx-auto w-full max-w-[1280px] flex-1 p-4 md:p-5"
          }
        >
          {children}
        </main>
          </div>
        </div>
      </WorkspaceSearchProvider>
    </SidebarCollapseProvider>
  );
}
