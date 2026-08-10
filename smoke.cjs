const { chromium } = require("playwright");
const assert = require("node:assert/strict");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });

  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
  if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/title.png`, fullPage: true });
  await page.click("#new-game");
  assert.equal(await page.locator("#view-title").textContent(), "案件桌面");
  if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/desk.png`, fullPage: true });
  await page.click('[data-desk="intake"]');
  assert.equal(await page.locator("#evidence-count").textContent(), "1");

  await page.click('[data-view="map"]');
  await page.click('[data-loc="alley"]');
  const alleySpots = page.locator("[data-spot]");
  assert.equal(await alleySpots.count(), 4);
  for (let i = 0; i < 4; i++) {
    await alleySpots.nth(i).click();
    await page.click("#modal-close");
  }
  await page.click("[data-back-map]");
  await page.click('[data-loc="bar"]');
  const barSpots = page.locator("[data-spot]");
  for (let i = 0; i < 3; i++) {
    await barSpots.nth(i).click();
    await page.click("#modal-close");
  }
  await page.click('[data-view="board"]');
  await page.click('[data-puzzle="02"]');
  await page.click('[data-answer="02:1"]');
  await page.click('[data-view="desk"]');
  assert.equal(await page.locator('[data-desk="advance"]').isEnabled(), true);
  await page.click('[data-desk="advance"]');
  await page.waitForTimeout(50);
  assert.match(await page.locator("#chapter-chip").textContent(), /第二章/);

  const allEvidence = Array.from({ length: 75 }, (_, i) => `E${String(i + 1).padStart(3, "0")}`);
  const solved = {
    chapter: 6, evidence: allEvidence,
    deductions: ["T01","T02","T03","T04","T05","T06","T07","T08","T09","T10"],
    visited: [], spots: [], puzzles: ["01","02","03","04","05","06","07","08","09","10","11","12","13","14"],
    interviews: {huang:3}, selected: [], notes: "smoke", pressure: 18, wrong: 0,
    sunSafe: true, timeline: true, photo: true, ending: null, actions: 6
  };
  await page.evaluate(value => localStorage.setItem("north-of-pier-seven-save-v1", JSON.stringify(value)), solved);
  await page.reload({ waitUntil: "networkidle" });
  await page.click("#continue-game");
  await page.click('[data-view="report"]');
  const answers = [1,1,1,1,0,0,2,0,0,2];
  for (let i = 0; i < answers.length; i++) await page.selectOption(`[name="q${i}"]`, String(answers[i]));
  await page.selectOption("#report-title", { index: 1 });
  await page.selectOption("#classification", "constructed");
  await page.click('#report-form button[type="submit"]');
  await page.waitForTimeout(50);
  assert.match(await page.locator(".ending h3").textContent(), /没有连环杀手/);
  if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/ending.png`, fullPage: true });
  assert.deepEqual(errors, []);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
  await mobile.evaluate(() => localStorage.clear());
  await mobile.reload({ waitUntil: "networkidle" });
  await mobile.click("#new-game");
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  assert.equal(await mobile.locator(".sidebar").isVisible(), true);
  if (process.env.SCREENSHOT_DIR) await mobile.screenshot({ path: `${process.env.SCREENSHOT_DIR}/mobile.png`, fullPage: true });
  console.log("Smoke test passed: opening chapter, investigation loop, save/load, and hidden ending.");
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
