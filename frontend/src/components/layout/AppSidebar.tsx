"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { bottomNav, primaryNav, productNav } from "./nav-config";

function NavLink({
  href,
  label,
  icon: Icon,
  soon,
  pathname,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
  pathname: string;
}) {
  const base = href.split("#")[0];
  const active =
    !soon &&
    (pathname === base ||
      (base === "/home" && pathname === "/") ||
      (base !== "/home" && pathname.startsWith(base)));
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
        active
          ? "bg-[var(--ff-sidebar-active)] text-white"
          : "text-zinc-300 hover:bg-[var(--ff-sidebar-hover)] hover:text-white",
        soon && "text-zinc-500 hover:text-zinc-400"
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-90" />
      <span className="truncate">{label}</span>
      {soon && <span className="ml-auto text-[10px] font-normal">Soon</span>}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden w-[232px] shrink-0 flex-col border-r border-black/20 bg-[var(--ff-sidebar)] text-zinc-200 md:flex"
    >
      <div className="flex items-center gap-2.5 px-4 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 text-white">
          <Sparkles className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Fireflies</p>
          <p className="text-[11px] text-zinc-500">Demo workspace</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-1" aria-label="Main">
        <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Workspace
        </p>
        <div className="flex flex-col gap-0.5">
          {primaryNav.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} />
          ))}
        </div>

        <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Intelligence
        </p>
        <div className="flex flex-col gap-0.5">
          {productNav.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} />
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 px-2 py-2">
        {bottomNav.map((item) => (
          <NavLink key={item.href} {...item} pathname={pathname} />
        ))}
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/30 text-xs font-semibold text-violet-200">
            DU
          </span>
          <div className="min-w-0 text-xs">
            <p className="truncate font-medium text-zinc-200">Demo User</p>
            <p className="truncate text-zinc-500">demo@workspace.local</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
