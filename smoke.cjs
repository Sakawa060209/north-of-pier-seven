const { chromium } = require("playwright");
const assert = require("node:assert/strict");

const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const url = "http://127.0.0.1:4173";

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: edge });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });

  const closeModal = async () => {
    if (await page.locator("#modal").getAttribute("open") !== null) await page.click("#modal-close");
  };
  const nav = async view => page.click(`[data-view="${view}"]`);
  const inspect = async (location, spots) => {
    await nav("map");
    await page.click(`[data-loc="${location}"]`);
    for (const i of spots) {
      await page.click(`[data-spot="${i}"]`);
      await closeModal();
    }
  };
  const puzzle = async (id, answer) => {
    await nav("board");
    await page.click(`[data-puzzle="${id}"]`);
    if (answer !== undefined) await page.click(`[data-answer="${id}:${answer}"]`);
  };
  const intake = async () => { await nav("desk"); await page.click('[data-desk="intake"]'); };
  const advance = async chapterText => {
    await nav("desk");
    assert.equal(await page.locator('[data-desk="advance"]').isEnabled(), true);
    await page.click('[data-desk="advance"]');
    assert.match(await page.locator("#chapter-chip").textContent(), new RegExp(chapterText));
  };
  const combine = async ids => {
    await nav("evidence");
    for (const id of ids) await page.click(`[data-evidence-select="${id}"]`);
    await page.click("[data-combine]");
  };
  const interview = async id => {
    await nav("people");
    await page.click(`[data-person="${id}"]`);
    await closeModal();
  };

  await page.goto(url, { waitUntil: "networkidle" });
  if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/title-v2.png`, fullPage: true });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.click("#new-game");

  // Gating: a visible puzzle must not reveal its choices before the evidence exists.
  await puzzle("02");
  assert.match(await page.locator("#modal-body").textContent(), /分析条件不足|不能开始/);
  assert.equal(await page.locator("[data-answer]").count(), 0);
  await closeModal();
  await nav("people");
  assert.equal(await page.locator("[data-person]").count(), 2, "only two people should exist in chapter one");

  // Chapter 1 — natural UI path.
  await intake();
  await inspect("alley", [0,1,2,3]);
  await inspect("bar", [0,1,2]);
  await nav("evidence");
  await page.click('[data-evidence-view="E005"]');
  assert.match(await page.locator("#modal-body").textContent(), /每周五 23:20/);
  await closeModal();
  await puzzle("02", 1);
  await advance("第二章");

  // Chapter 2.
  await intake();
  await inspect("sewer", [0,1,2]);
  await inspect("fanghome", [0,1]);
  await inspect("hotel", [0,1,2]);
  await puzzle("04", 2);
  await advance("第三章");

  // Chapter 3 — two-step target inference.
  await intake();
  await inspect("warehouse", [0,1,2]);
  await inspect("studio", [0,1,2]);
  await inspect("bookstore", [0,1,2]);
  await nav("board");
  await page.click('[data-puzzle="05"]');
  await page.click('[data-answer="05a:1"]');
  assert.match(await page.locator("#modal-body").textContent(), /第二步|为何只取走/);
  await page.click('[data-answer="05b:1"]');
  await advance("第四章");

  // Old locations must advertise newly unlocked investigation directions.
  await nav("map");
  assert.ok(await page.locator(".map-node.new").count() > 0, "revisited locations should show ! state");
  if(process.env.SCREENSHOT_DIR) await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/map-revisit-v2.png`,fullPage:true});

  // Chapter 4 — staged old-case reasoning and recovery path if pressure destroyed E059.
  await intake();
  await inspect("office", [1]);
  await inspect("printworks", [0,1,2]);
  await inspect("basement", [0,1,2]);
  await inspect("clinic", [0,1]);
  await inspect("police", [0]);
  await inspect("zhao", [0,1]);
  await inspect("bookstore", [0,1,2]);
  await puzzle("07", 0);

  const hasE059 = await page.evaluate(() => JSON.parse(localStorage.getItem("north-of-pier-seven-save-v1")).evidence.includes("E059"));
  if (!hasE059) {
    await interview("zhou");
    await interview("zhou");
    await interview("zhou");
  }
  await combine(["E050","E059"]);
  await combine(["E052","E053"]);
  await combine(["E050","E055"]);

  await nav("map");
  await page.click('[data-loc="studio"]');
  await page.click('[data-spot="3"]');
  await page.locator("#bright").evaluate(el => { el.value = 80; el.dispatchEvent(new Event("input", { bubbles: true })); });
  await page.locator("#contrast").evaluate(el => { el.value = 140; el.dispatchEvent(new Event("input", { bubbles: true })); });
  assert.equal(await page.locator(".photo-readout .ok").count(), 3);
  await page.click("[data-photo-submit]");
  await advance("第五章");

  // Chapter 5 — optional safety action and evidence-table comparison.
  await intake();
  await page.click("[data-protect-sun]");
  await inspect("booth", [0,1]);
  await nav("map"); await page.click('[data-loc="news"]');
  await page.click('[data-spot="0"]'); await closeModal();
  await page.click('[data-spot="1"]'); await page.fill("#phone-code", "1210"); await page.click("[data-phone-submit]");
  await nav("map"); await page.click('[data-loc="news"]'); await page.click('[data-spot="2"]'); await closeModal();
  await inspect("bus", [0,1,2]);
  await nav("board"); await page.click('[data-puzzle="10"]');
  if(process.env.SCREENSHOT_DIR) await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/case-compare-v2.png`,fullPage:true});
  for (let i=0;i<5;i++) await page.check(`[data-case-anomaly="${i}"]`);
  await page.selectOption("#case5-nature", "silence");
  await page.click("[data-case-compare-submit]");
  await puzzle("12", 1);
  await advance("第六章");

  // Chapter 6 — all four cases, then evidence-gated interrogation.
  await intake();
  await nav("timeline");
  const times=["23:18","23:21","23:24","23:31","21:51","21:54","22:03","22:11","20:46","20:49","20:52","21:04","22:21","22:26","22:37","22:47"];
  for (let i=0;i<times.length;i++) await page.selectOption(`[data-time-select="${i}"]`, times[i]);
  if(process.env.SCREENSHOT_DIR) await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/timeline-v2.png`,fullPage:true});
  await page.click("[data-check-timeline]");
  await interview("huang");
  await interview("huang");
  await interview("huang");

  const base = await page.evaluate(() => JSON.parse(localStorage.getItem("north-of-pier-seven-save-v1")));
  assert.equal(base.chapter, 6);
  assert.equal(base.timeline, true);
  assert.equal(base.sunOutcome, "safe");

  const submitEnding = async (patch, suspect, titleIndex, classification, expected) => {
    const next={...base,...patch,ending:null};
    await page.evaluate(v => localStorage.setItem("north-of-pier-seven-save-v1", JSON.stringify(v)), next);
    await page.reload({ waitUntil: "networkidle" });
    await page.click("#continue-game");
    await nav("report");
    const answers=[1,1,1,1,0,0,2,0,0,suspect];
    for (let i=0;i<answers.length;i++) await page.selectOption(`[name="q${i}"]`, String(answers[i]));
    await page.selectOption("#report-title", { index:titleIndex });
    await page.selectOption("#classification", classification);
    await page.click('#report-form button[type="submit"]');
    assert.match(await page.locator(".ending h3").textContent(), new RegExp(expected));
  };

  // Five endings, plus dynamic wrong-suspect copy.
  await submitEnding({},2,1,"constructed","没有连环杀手");
  if(process.env.SCREENSHOT_DIR) await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/ending-v2.png`,fullPage:true});
  await submitEnding({},2,0,"serial","照片上的人");
  await submitEnding({photo:false,evidence:base.evidence.filter(id=>id!=="E057")},2,0,"serial","七码头杀手");
  await submitEnding({sunSafe:false,sunOutcome:"dead"},2,0,"serial","第六个数字");
  await submitEnding({},1,0,"serial","错误的人");
  assert.match(await page.locator(".ending").textContent(), /赵启明/);

  // The optional protection objective cannot block chapter 5 completion.
  const ch5={...base,chapter:5,sunSafe:false,sunOutcome:"pending",sunDeadline:base.actions,pressure:40,ending:null};
  await page.evaluate(v=>localStorage.setItem("north-of-pier-seven-save-v1",JSON.stringify(v)),ch5);
  await page.reload({waitUntil:"networkidle"}); await page.click("#continue-game");
  assert.equal(await page.locator('[data-desk="advance"]').isEnabled(),true);
  await page.click('[data-desk="advance"]');
  const darkReach=await page.evaluate(()=>JSON.parse(localStorage.getItem("north-of-pier-seven-save-v1")));
  assert.equal(darkReach.chapter,6); assert.equal(darkReach.sunOutcome,"dead");

  // Interrogation gating: without evidence, Huang cannot advance beyond round one.
  const noEvidence={...base,evidence:[],deductions:[],interviews:{},ending:null};
  await page.evaluate(v=>localStorage.setItem("north-of-pier-seven-save-v1",JSON.stringify(v)),noEvidence);
  await page.reload({waitUntil:"networkidle"}); await page.click("#continue-game"); await nav("people");
  await page.click('[data-person="huang"]'); await closeModal();
  assert.equal(await page.locator('[data-person="huang"]').isDisabled(),true);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(url,{waitUntil:"networkidle"}); await mobile.evaluate(()=>localStorage.clear()); await mobile.reload({waitUntil:"networkidle"}); await mobile.click("#new-game");
  assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
  if(process.env.SCREENSHOT_DIR) await mobile.screenshot({path:`${process.env.SCREENSHOT_DIR}/mobile-v2.png`,fullPage:true});

  assert.deepEqual(errors,[]);
  console.log("Regression passed: natural six-chapter run, gating, revisit states, five endings, dark-ending reachability, and mobile layout.");
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
