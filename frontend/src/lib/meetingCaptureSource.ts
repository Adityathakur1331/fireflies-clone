import type { MeetingListItem } from "@/types/meeting";
import {
  Bot,
  Globe,
  Mic2,
  Monitor,
  Upload,
  Video,
  type LucideIcon,
} from "lucide-react";

export type CaptureSourceId =
  | "notetaker"
  | "chrome"
  | "desktop"
  | "audio"
  | "upload"
  | "voice_agent";

export type CaptureSourceMeta = {
  id: CaptureSourceId;
  label: string;
  icon: LucideIcon;
};

/** Deterministic capture icons for the six seeded meetings (by stable seed id). */
const SEED_CAPTURE: Record<number, CaptureSourceId> = {
  1: "notetaker",
  2: "chrome",
  3: "desktop",
  4: "audio",
  5: "upload",
  6: "voice_agent",
};

const META: Record<CaptureSourceId, CaptureSourceMeta> = {
  notetaker: { id: "notetaker", label: "Meeting notetaker", icon: Video },
  chrome: { id: "chrome", label: "Chrome extension", icon: Globe },
  desktop: { id: "desktop", label: "Desktop app", icon: Monitor },
  audio: { id: "audio", label: "Audio recording", icon: Mic2 },
  upload: { id: "upload", label: "Upload", icon: Upload },
  voice_agent: { id: "voice_agent", label: "Voice agent", icon: Bot },
};

export function getMeetingCaptureSource(meetingId: number): CaptureSourceMeta {
  const id = SEED_CAPTURE[meetingId] ?? "notetaker";
  return META[id];
}

export function filterMeetingsByChannelView(
  meetings: MeetingListItem[],
  view: string
): MeetingListItem[] {
  switch (view) {
    case "uploads":
      return meetings.filter((m) => m.id === 5);
    case "voice":
      return meetings.filter((m) => m.id === 6);
    default:
      return meetings;
  }
}
