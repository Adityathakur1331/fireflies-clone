/**
 * API base URL. Empty string = same-origin `/api` (proxied by Next.js rewrites in dev/prod).
 * Set NEXT_PUBLIC_API_URL only when the browser must call FastAPI directly (e.g. separate host).
 */
function resolveApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (raw === undefined || raw.trim() === "") {
    return "";
  }
  return raw.replace(/\/$/, "");
}

const API_BASE = resolveApiBase();

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* ignore */
    }
    throw new ApiError(String(detail), res.status);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}
