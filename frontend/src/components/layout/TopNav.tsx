"use client";

import { ChevronDown, UserCircle2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function TopNav({ title }: { title?: string }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title ?? "Meetings"}</h1>
        <p className="text-xs text-slate-500">Signed in as Demo User</p>
      </div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
          <UserCircle2 className="h-5 w-5 text-slate-500" />
          <span>Demo User</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-[180px] rounded-md border border-slate-200 bg-white p-1 shadow-md"
            sideOffset={6}
          >
            <DropdownMenu.Item className="cursor-default rounded px-3 py-2 text-sm text-slate-500 outline-none">
              Profile (placeholder)
            </DropdownMenu.Item>
            <DropdownMenu.Item className="cursor-default rounded px-3 py-2 text-sm text-slate-500 outline-none">
              Sign out (placeholder)
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  );
}
