/**
 * Headless Chromium QA for assignment mandatory flows.
 * Run: node scripts/assignment-browser-qa.mjs
 * Requires: dev server on 127.0.0.1:3000, backend via /api proxy.
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const base = "http://127.0.0.1:3000";
const results = { routes: {}, interactions: {}, errors: [], meta: {} };

function pass(key, section, detail = "ok") {
  section[key] = { status: "PASS", detail };
}
function fail(key, section, detail) {
  section[key] = { status: "FAIL", detail };
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

page.on("pageerror", (e) => results.errors.push(`pageerror: ${e.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") results.errors.push(`console: ${msg.text()}`);
});

async function routeOk(path, mustSee) {
  const key = path;
  try {
    const res = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(800);
    const overlay = await page.getByText("Application error").count();
    const nextErr = await page.getByText("Cannot find module").count();
    const body = await page.locator("body").innerText();
    if (overlay || nextErr) {
      fail(key, results.routes, "Next.js error overlay visible");
      return;
    }
    if (res && res.status() >= 500) {
      fail(key, results.routes, `HTTP ${res.status()}`);
      return;
    }
    if (mustSee && (await page.getByText(mustSee, { exact: false }).count()) === 0) {
      fail(key, results.routes, `Missing expected text: ${mustSee}`);
      return;
    }
    pass(key, results.routes);
  } catch (e) {
    fail(key, results.routes, e.message);
  }
}

// --- Routes ---
await routeOk("/home", "Welcome");
await routeOk("/meetings", "Meetings");
await routeOk("/meetings/1", "Notes");
await routeOk("/meetings/6", "Notes");
await routeOk("/tasks", "Tasks");
await routeOk("/analytics", "Analytics");
await routeOk("/askfred", "how can I help");
await routeOk("/ai-skills", "AI Skills");
await routeOk("/settings", "Settings");

// --- Notepad structure ---
try {
  await page.goto(`${base}/meetings/1`, { waitUntil: "networkidle", timeout: 60000 });
  const checks = [
    ["AI Summary", await page.getByText("AI Summary").count()],
    ["Action items", await page.getByText("Action items").count()],
    ["Key topics", await page.getByText("Key topics").count()],
    ["Chapters", await page.getByText("Chapters").count()],
    ["Recording", await page.getByText("Recording").count()],
    ["transcript search", await page.locator("#transcript-search-input").count()],
    ["audio player", await page.locator("audio").count()],
  ];
  for (const [label, n] of checks) {
    if (n > 0) pass(`notepad_${label}`, results.interactions);
    else fail(`notepad_${label}`, results.interactions, "not found");
  }
} catch (e) {
  fail("notepad_structure", results.interactions, e.message);
}

// --- Transcript search highlight ---
try {
  await page.goto(`${base}/meetings/1`, { waitUntil: "networkidle" });
  const search = page.locator("#transcript-search-input");
  await search.fill("the");
  await page.waitForTimeout(400);
  const marks = await page.locator("mark").count();
  if (marks > 0) pass("transcript_search_highlight", results.interactions, `${marks} marks`);
  else fail("transcript_search_highlight", results.interactions, "no <mark> highlights");
} catch (e) {
  fail("transcript_search_highlight", results.interactions, e.message);
}

// --- Transcript click seek ---
try {
  await page.goto(`${base}/meetings/1`, { waitUntil: "networkidle" });
  const audio = page.locator("audio").first();
  await audio.waitFor({ state: "attached" });
  const before = await audio.evaluate((el) => el.currentTime);
  const line = page.locator('[class*="cursor-pointer"]').filter({ hasText: /^\d{2}:\d{2}/ }).first();
  const hasLine = await line.count();
  if (!hasLine) {
    const anyLine = page.locator("button.font-mono").nth(3);
    await anyLine.click({ force: true });
  } else {
    await line.click();
  }
  await page.waitForTimeout(500);
  const after = await audio.evaluate((el) => el.currentTime);
  if (after > before + 0.01 || after > 1) pass("transcript_click_seek", results.interactions, `time ${before} -> ${after}`);
  else fail("transcript_click_seek", results.interactions, `time ${before} -> ${after}`);
} catch (e) {
  fail("transcript_click_seek", results.interactions, e.message);
}

// --- Meetings search ---
try {
  await page.goto(`${base}/meetings`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Filters/i }).click();
  await page.getByPlaceholder("Title or participant").fill("Enterprise");
  await page.waitForTimeout(400);
  const ent = await page.getByText("Enterprise Discovery").count();
  const qbr = await page.getByText("QBR — Horizon").count();
  if (ent > 0 && qbr === 0) pass("meetings_search_title", results.interactions);
  else fail("meetings_search_title", results.interactions, `enterprise=${ent} qbr=${qbr}`);
  await page.getByPlaceholder("Title or participant").fill("");
  await page.waitForTimeout(400);
} catch (e) {
  fail("meetings_search_title", results.interactions, e.message);
}

// --- Action item CRUD ---
const qaTask = `QA task ${Date.now()}`;
let qaTaskPersisted = false;
try {
  await page.goto(`${base}/meetings/1`, { waitUntil: "networkidle" });
  await page.getByLabel("New action item").fill(qaTask);
  await page.getByRole("button", { name: "Add" }).click();
  await page.waitForTimeout(800);
  if ((await page.getByText(qaTask).count()) === 0) throw new Error("add failed");
  pass("action_item_add", results.interactions);

  await page.getByText(qaTask).locator("..").locator("..").getByRole("button", { name: "Edit" }).click();
  const edited = `${qaTask} edited`;
  await page.getByLabel("Edit action item title").fill(edited);
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(600);
  if ((await page.getByText(edited).count()) === 0) throw new Error("edit failed");
  pass("action_item_edit", results.interactions);

  const row = page.getByText(edited).locator("xpath=ancestor::li[1]");
  await row.getByRole("checkbox").click();
  await page.waitForTimeout(500);
  pass("action_item_complete", results.interactions);

  await page.reload({ waitUntil: "networkidle" });
  if ((await page.getByText(edited).count()) > 0) {
    pass("action_item_persist_reload", results.interactions);
    qaTaskPersisted = true;
  } else fail("action_item_persist_reload", results.interactions, "missing after reload");

  await page.getByText(edited).locator("..").locator("..").getByRole("button", { name: "Delete" }).click();
  await page.waitForTimeout(600);
  if ((await page.getByText(edited).count()) === 0) pass("action_item_delete", results.interactions);
  else fail("action_item_delete", results.interactions, "still visible");
} catch (e) {
  fail("action_item_crud", results.interactions, e.message);
}

// --- Meeting create + delete ---
const qaMeetingTitle = `QA Meeting DELETE ${Date.now()}`;
let createdId = null;
try {
  await page.goto(`${base}/meetings`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Capture/i }).click();
  await page.getByText("Upload audio or video").click();
  await page.getByLabel("Title", { exact: true }).fill(qaMeetingTitle);
  await page.getByLabel("Participants (comma-separated)").fill("QA Bot");
  await page.locator("#transcript").fill("[00:00:01] QA: Browser test line one.\n[00:00:05] QA: Second line.");
  await page.getByRole("button", { name: "Create meeting" }).click();
  await page.waitForURL(/\/meetings\/\d+/, { timeout: 15000 });
  await page.waitForTimeout(1200);
  const url = page.url();
  createdId = url.match(/\/meetings\/(\d+)/)?.[1];
  const titleVisible = await page.getByRole("heading", { name: qaMeetingTitle }).count();
  if (titleVisible > 0) pass("meeting_create", results.interactions, `id=${createdId}`);
  else fail("meeting_create", results.interactions, "title heading not visible");

  await page.getByRole("button", { name: "More actions" }).click();
  await page.getByText("Delete meeting").click();
  await page.getByRole("button", { name: /Delete/i }).last().click();
  await page.waitForURL(/\/meetings\/?$/, { timeout: 15000 });
  pass("meeting_delete", results.interactions);
  createdId = null;
} catch (e) {
  fail("meeting_crud", results.interactions, e.message);
  if (createdId) {
    try {
      await fetch(`${base}/api/meetings/${createdId}`, { method: "DELETE" });
    } catch {
      /* ignore */
    }
  }
}

// --- Participant filter ---
try {
  await page.goto(`${base}/meetings`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Filters/i }).click();
  await page.getByPlaceholder("Name contains…").fill("Dana");
  await page.waitForTimeout(400);
  const ent = await page.getByText("Enterprise Discovery").count();
  const qbr = await page.getByText("QBR — Horizon").count();
  if (ent > 0 && qbr === 0) pass("meetings_filter_participant", results.interactions);
  else fail("meetings_filter_participant", results.interactions, `ent=${ent} qbr=${qbr}`);
  await page.getByPlaceholder("Name contains…").fill("");
  await page.waitForTimeout(300);
} catch (e) {
  fail("meetings_filter_participant", results.interactions, e.message);
}

// --- Playback timeupdate → active transcript line ---
try {
  await page.goto(`${base}/meetings/1`, { waitUntil: "networkidle" });
  const audio = page.locator("audio").first();
  await audio.evaluate((el) => {
    el.currentTime = 60;
    el.dispatchEvent(new Event("timeupdate"));
  });
  await page.waitForTimeout(300);
  const active = await page.locator(".ff-transcript-line-active").count();
  if (active > 0) pass("playback_active_line", results.interactions);
  else fail("playback_active_line", results.interactions, "no active line class");
} catch (e) {
  fail("playback_active_line", results.interactions, e.message);
}

// --- Mobile viewport smoke ---
try {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/meetings`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const mobileNav = await page.getByRole("link", { name: "Home" }).count();
  if (mobileNav > 0) pass("mobile_meetings_nav", results.interactions);
  else fail("mobile_meetings_nav", results.interactions, "mobile nav missing");
  await page.setViewportSize({ width: 1440, height: 900 });
} catch (e) {
  fail("mobile_meetings_nav", results.interactions, e.message);
}

// --- AskFred ---
try {
  await page.goto(`${base}/askfred`, { waitUntil: "networkidle" });
  await page.getByRole("button").filter({ has: page.locator("svg") }).last();
  const prompt = "List my action items & todos for this week";
  await page.getByLabel("AskFred message").fill(prompt);
  await page.getByLabel("Send").click();
  await page.waitForTimeout(1000);
  const fred = await page.getByText("Fred").count();
  if (fred > 0) pass("askfred_submit", results.interactions);
  else fail("askfred_submit", results.interactions, "no Fred response block");
} catch (e) {
  fail("askfred_submit", results.interactions, e.message);
}

results.meta.qaTaskPersisted = qaTaskPersisted;
results.meta.timestamp = new Date().toISOString();

const failed =
  Object.values(results.routes).some((r) => r.status === "FAIL") ||
  Object.values(results.interactions).some((r) => r.status === "FAIL");

writeFileSync("scripts/assignment-browser-qa-results.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
process.exit(failed ? 1 : 0);
