/** Read uploaded transcript files into raw text for the existing API parser. */

const ALLOWED = [".txt", ".vtt", ".json"];

export function isAllowedTranscriptFile(name: string): boolean {
  const lower = name.toLowerCase();
  return ALLOWED.some((ext) => lower.endsWith(ext));
}

export async function fileToTranscriptRaw(file: File): Promise<string> {
  const text = await file.text();
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".json")) {
    return jsonToRaw(text);
  }
  if (lower.endsWith(".vtt")) {
    return vttToRaw(text);
  }
  return text;
}

function jsonToRaw(jsonText: string): string {
  const data = JSON.parse(jsonText) as unknown;
  if (!Array.isArray(data)) {
    throw new Error("JSON must be an array of segments.");
  }
  const lines: string[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const seg = item as Record<string, unknown>;
    const start = Number(seg.start_ms ?? seg.startMs ?? 0);
    const speaker = String(seg.speaker_label ?? seg.speaker ?? "Speaker");
    const content = String(seg.content ?? seg.text ?? "");
    lines.push(`[${msToHms(start)}] ${speaker}: ${content}`);
  }
  if (!lines.length) throw new Error("No segments found in JSON.");
  return lines.join("\n");
}

function vttToRaw(vtt: string): string {
  const lines = vtt.split(/\r?\n/);
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.includes("-->")) {
      const start = line.split("-->")[0].trim();
      const hms = vttTimeToHms(start);
      i++;
      const textLines: string[] = [];
      while (i < lines.length && lines[i].trim() && !lines[i].includes("-->")) {
        textLines.push(lines[i].trim());
        i++;
      }
      const full = textLines.join(" ");
      const colon = full.indexOf(":");
      if (colon > 0) {
        out.push(`[${hms}] ${full.slice(0, colon).trim()}: ${full.slice(colon + 1).trim()}`);
      } else {
        out.push(`[${hms}] Speaker: ${full}`);
      }
      continue;
    }
    i++;
  }
  if (!out.length) throw new Error("Could not parse VTT file.");
  return out.join("\n");
}

function vttTimeToHms(t: string): string {
  const parts = t.split(":").map((p) => p.replace(",", "."));
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return `${h}:${m}:${s.split(".")[0].padStart(2, "0")}`;
  }
  return t;
}

function msToHms(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
