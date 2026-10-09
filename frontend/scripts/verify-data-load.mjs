import { chromium } from "playwright";

const base = "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.goto(`${base}/meetings`, { waitUntil: "networkidle" });
const meetingsFail = await page.getByText("Could not load meetings").count();
const meetingRow = await page.getByText("QBR — Horizon Analytics Account").count();

await page.goto(`${base}/tasks`, { waitUntil: "networkidle" });
const tasksFail = await page.getByText("Could not load tasks").count();

await browser.close();

if (meetingsFail || tasksFail || meetingRow === 0) {
  console.error({ meetingsFail, tasksFail, meetingRow, errors });
  process.exit(1);
}
console.log("Meetings and tasks load seeded data in the UI.");
