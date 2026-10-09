"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { bottomNav, primaryNav, productNav } from "./nav-config";
import { useSidebarCollapse } from "./SidebarCollapseContext";

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
  badge,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  pathname: string;
  badge?: string;
  collapsed: boolean;
}) {
  const base = href.split("#")[0];
  const active =
    pathname === base ||
    (base === "/home" && pathname === "/") ||
    (base !== "/home" && pathname.startsWith(base));

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center rounded-md text-[13px] font-medium transition-colors",
        collapsed ? "justify-center px-2 py-2" : "gap-2.5 px-2.5 py-[7px]",
        active
          ? "bg-[var(--ff-sidebar-active)] text-[var(--ff-text)] shadow-[inset_2px_0_0_0_var(--ff-accent)]"
          : "text-[var(--ff-text-secondary)] hover:bg-[var(--ff-sidebar-hover)] hover:text-[var(--ff-text)]"
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && badge && (
        <span className="ml-auto rounded bg-[var(--ff-success-muted)]/50 px-1.5 py-0.5 text-[9px] font-semibold text-[var(--ff-success)]">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarCollapse();

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-[var(--ff-border-subtle)] bg-[var(--ff-sidebar)] transition-[width] duration-200 md:flex",
        collapsed ? "w-[52px]" : "w-[200px]"
      )}
    >
      <button
        type="button"
        className={cn(
          "mx-2 mt-3 flex items-center rounded-md px-2 py-2 text-left hover:bg-[var(--ff-sidebar-hover)]",
          collapsed ? "justify-center" : "gap-2"
        )}
        aria-label="Workspace selector"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--ff-accent)] text-xs font-bold text-white">
          A
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--ff-text)]">
              ADITYA
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-[var(--ff-text-muted)]" />
          </>
        )}
      </button>

      <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-3" aria-label="Main">
        <div className="flex flex-col gap-0.5">
          {primaryNav.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} collapsed={collapsed} />
          ))}
        </div>

        <div className="my-3 h-px bg-[var(--ff-border-subtle)]" />

        <div className="flex flex-col gap-0.5">
          {productNav.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} collapsed={collapsed} />
          ))}
        </div>

        <div className="my-3 h-px bg-[var(--ff-border-subtle)]" />

        <Link
          href="/analytics"
          title={collapsed ? "Upgrade" : undefined}
          className={cn(
            "ff-subnav-item text-[var(--ff-text-secondary)]",
            collapsed && "justify-center px-2"
          )}
        >
          <Zap className="h-[18px] w-[18px]" />
          {!collapsed && (
            <>
              Upgrade
              <span className="ml-auto rounded bg-[var(--ff-success-muted)]/40 px-1.5 py-0.5 text-[9px] font-semibold text-[var(--ff-success)]">
                Demo
              </span>
            </>
          )}
        </Link>
      </nav>

      {!collapsed && (
        <div className="border-t border-[var(--ff-border-subtle)] px-2 py-2">
          <div className="mb-2 rounded-md border border-[var(--ff-border)] bg-[var(--ff-surface)] p-2.5">
            <p className="text-[11px] font-medium text-[var(--ff-text)]">Invite teammates</p>
            <p className="mt-0.5 text-[10px] text-[var(--ff-text-muted)]">
              Collaboration is a placeholder in this build.
            </p>
            <button
              type="button"
              className="mt-2 w-full rounded-md bg-[var(--ff-accent)] py-1.5 text-xs font-medium text-white hover:bg-[var(--ff-accent-hover)]"
            >
              Create team
            </button>
          </div>
          {bottomNav.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} collapsed={false} />
          ))}
        </div>
      )}

      {collapsed && (
        <div className="border-t border-[var(--ff-border-subtle)] px-2 py-2">
          {bottomNav.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} collapsed={true} />
          ))}
        </div>
      )}

      <div className="border-t border-[var(--ff-border-subtle)] px-2 py-2">
        <button
          type="button"
          onClick={toggle}
          className="flex w-full items-center justify-center gap-1 rounded-md py-1.5 text-[11px] text-[var(--ff-text-muted)] hover:bg-[var(--ff-sidebar-hover)] hover:text-[var(--ff-text)]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
        {!collapsed && (
          <div className="mt-2 flex items-center gap-2 px-1 text-[11px] text-[var(--ff-text-muted)]">
            <Layers className="h-3.5 w-3.5" />
            <span className="truncate">Demo workspace</span>
            <Sparkles className="ml-auto h-3.5 w-3.5 text-[var(--ff-accent-muted)]" />
          </div>
        )}
      </div>
    </aside>
  );
}
