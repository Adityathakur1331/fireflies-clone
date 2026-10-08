import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  CheckSquare,
  Home,
  LayoutGrid,
  MessageCircle,
  Mic,
  Plug,
  Settings,
  Sparkles,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
};

export const primaryNav: NavItem[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/askfred", label: "AskFred", icon: MessageCircle },
  { href: "/meetings", label: "Meetings", icon: LayoutGrid },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
];

export const productNav: NavItem[] = [
  { href: "/ai-skills", label: "AI Skills", icon: Sparkles },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/voice-agents", label: "Voice Agents", icon: Mic },
];

export const bottomNav: NavItem[] = [
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const mobileNav: NavItem[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/meetings", label: "Meetings", icon: LayoutGrid },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/askfred", label: "AskFred", icon: Bot },
];
