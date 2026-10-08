/**
 * Lightweight smoke checks: production build artifacts and optional live API.
 * Run: node scripts/smoke.mjs
 * Set API_URL=http://localhost:8000 to verify backend when servers are up.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

console.log("Smoke: running next build...");
execSync("npm run build", { stdio: "inherit" });

if (!existsSync(".next/BUILD_ID")) {
  throw new Error("Build failed: .next/BUILD_ID missing");
}
console.log("Smoke: build OK");

if (apiUrl) {
  const health = await fetch(`${apiUrl}/api/health`);
  if (!health.ok) throw new Error(`Health check failed: ${health.status}`);
  const meetings = await fetch(`${apiUrl}/api/meetings`);
  if (!meetings.ok) throw new Error(`Meetings list failed: ${meetings.status}`);
  const data = await meetings.json();
  if (data.total < 1) throw new Error("Expected at least one meeting in API");
  console.log(`Smoke: API OK (${data.total} meetings)`);
} else {
  console.log("Smoke: skip API checks (set API_URL to enable)");
}

console.log("Smoke: all checks passed");
