"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { GlobalIconRail } from "./GlobalIconRail";
import { SidebarCollapseProvider } from "./SidebarCollapseContext";
import { TopNav } from "./TopNav";
import { WorkspaceSearchProvider } from "./WorkspaceSearchContext";

function useIconRailOnlyLayout() {
  const pathname = usePathname();
  if (pathname.startsWith("/askfred")) return true;
  // Icon rail matches Fireflies list views only; notepad uses the full sidebar.
  return pathname === "/meetings";
}

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
  const iconRailOnly = useIconRailOnlyLayout();

  return (
    <SidebarCollapseProvider>
      <WorkspaceSearchProvider>
        <div className="flex min-h-screen bg-[var(--ff-bg)]">
          {iconRailOnly ? <GlobalIconRail /> : <AppSidebar />}
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
