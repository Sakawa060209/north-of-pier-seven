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
      const ids = await page.locator("[data-collect-evidence]").evaluateAll(nodes => nodes.map(n => n.dataset.collectEvidence));
      await closeModal();
      for (const id of ids) {
        await page.click(`[data-spot="${i}"]`);
        await page.click(`[data-collect-evidence="${id}"]`);
        await closeModal();
      }
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
  assert.doesNotMatch(await page.locator("#title-screen").textContent(), /共同点未必属于死者/);
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
  assert.equal(await page.locator('[data-desk="intake"]').isDisabled(), true, "chapter intake cannot be repeated");
  await inspect("alley", [0,1,2,3]);
  await inspect("bar", [0,1,2]);
  await nav("evidence");
  await page.click('[data-evidence-view="E005"]');
  assert.match(await page.locator("#modal-body").textContent(), /每周五 23:20/);
  assert.doesNotMatch(await page.locator("#modal-body").textContent(), /等级 A|核心证据|误导方向/);
  await closeModal();
  await puzzle("01", 1);
  await puzzle("02", 1);
  await advance("第二章");

  // Chapter 2.
  await intake();
  await inspect("sewer", [0,1,2]);
  await inspect("fanghome", [0,1]);
  await inspect("hotel", [0,1,2]);
  await nav("evidence");
  await page.click('[data-evidence-view="E016"]');
  assert.match(await page.locator("#modal-body").textContent(), /吴峰住所[\s\S]*吴峰曾参与北七巷拆迁管线工程/);
  await closeModal();
  await puzzle("03", 1);
  await puzzle("04", 2);
  await nav("desk");
  assert.match(await page.locator(".card").last().textContent(), /共同点未必属于死者|观察他们的人/);
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
  await inspect("printworks", [0,2]);
  await nav("map");
  assert.equal(await page.locator('[data-loc="basement"]').count(),0,"later old-case locations stay hidden during phase one");
  await puzzle("06", 2);
  await puzzle("07", 0);
  await nav("desk");
  assert.match(await page.locator(".chapter-recap").textContent(), /阶段二[\s\S]*林正国 \/ 电影院[\s\S]*陈某 \/ 社区诊所[\s\S]*周成开始明显紧张/);
  await nav("map");
  assert.equal(await page.locator('[data-loc="basement"]').count(),1,"phase two unlocks witness and archive locations");
  await inspect("office", [1]);
  await inspect("printworks", [1]);
  await inspect("basement", [0,1,2]);
  await inspect("clinic", [0,1]);
  await inspect("police", [0]);
  await inspect("zhao", [0,1]);
  await inspect("bookstore", [0,1,2]);
  await puzzle("09", 1);

  const hasE059 = await page.evaluate(() => JSON.parse(localStorage.getItem("north-of-pier-seven-save-v1")).evidence.includes("E059"));
  if (!hasE059) {
    await interview("zhou");
    await interview("zhou");
    await interview("zhou");
  }
  await combine(["E050","E059"]);
  await combine(["E052","E053"]);
  await combine(["E050","E055"]);
  await nav("desk");
  assert.match(await page.locator(".chapter-recap").textContent(), /阶段三|恢复目击序列/);

  await nav("map");
  await page.click('[data-loc="studio"]');
  await page.click('[data-spot="4"]');
  assert.match(await page.locator("#modal-body").textContent(), /不会生成证物编号/);
  await closeModal();
  await page.click('[data-spot="3"]');
  await page.locator("#bright").evaluate(el => { el.value = 80; el.dispatchEvent(new Event("input", { bubbles: true })); });
  await page.locator("#contrast").evaluate(el => { el.value = 140; el.dispatchEvent(new Event("input", { bubbles: true })); });
  assert.match(await page.locator("#read-quality").textContent(), /高/);
  await page.click("[data-photo-submit]");
  await page.selectOption("#photo-q1", "luo");
  await page.selectOption("#photo-q2", "break");
  await page.click("[data-photo-observe]");
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
  await nav("people");
  assert.match(await page.locator('[data-person="huang"]').locator("xpath=ancestor::article").textContent(), /临川公交司机/);
  assert.doesNotMatch(await page.locator('[data-person="huang"]').locator("xpath=ancestor::article").textContent(), /17 路晚班/);
  const beforeCaseCompare=await page.evaluate(()=>JSON.parse(localStorage.getItem("north-of-pier-seven-save-v1")));
  await nav("board"); await page.click('[data-puzzle="10"]');
  await page.check('[data-case-anomaly="method"]');
  await page.selectOption("#case5-nature", "silence");
  await page.click("[data-case-compare-submit]");
  assert.match(await page.locator("#case-feedback").textContent(), /前四案死亡方式本来就各不相同/);
  await page.evaluate(v=>localStorage.setItem("north-of-pier-seven-save-v1",JSON.stringify(v)),beforeCaseCompare);
  await page.reload({waitUntil:"networkidle"}); await page.click("#continue-game");
  await nav("board"); await page.click('[data-puzzle="10"]');
  if(process.env.SCREENSHOT_DIR) await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/case-compare-v2.png`,fullPage:true});
  for (const id of ["date","call","paper","writing","setup"]) await page.check(`[data-case-anomaly="${id}"]`);
  assert.equal(await page.locator("[data-case-anomaly]").count(),8,"comparison table mixes broken and preserved patterns");
  await page.selectOption("#case5-nature", "silence");
  await page.click("[data-case-compare-submit]");
  await puzzle("12", 1);
  await nav("people");
  assert.match(await page.locator('[data-person="huang"]').locator("xpath=ancestor::article").textContent(), /17 路晚班司机/);
  await nav("map");
  assert.match(await page.locator('[data-loc="bus"]').textContent(), /17 路公交总站/);
  await advance("第六章");

  // Chapter 6 — all four cases, then evidence-gated interrogation.
  await intake();
  // Puzzle 13 must rely on E012's entry time, not the unrelated address slip E013.
  const beforeTimeline=await page.evaluate(()=>JSON.parse(localStorage.getItem("north-of-pier-seven-save-v1")));
  await page.evaluate(v=>localStorage.setItem("north-of-pier-seven-save-v1",JSON.stringify({...v,evidence:v.evidence.filter(id=>id!=="E013")})),beforeTimeline);
  await page.reload({waitUntil:"networkidle"}); await page.click("#continue-game");
  await nav("board"); await page.click('[data-puzzle="13"]');
  assert.match(await page.locator("#view-title").textContent(),/时间线/);
  await page.evaluate(v=>localStorage.setItem("north-of-pier-seven-save-v1",JSON.stringify(v)),beforeTimeline);
  await page.reload({waitUntil:"networkidle"}); await page.click("#continue-game");
  await nav("timeline");
  assert.equal(await page.locator('[data-time-select="5"] option').filter({hasText:"22:00"}).count(),1,"minute distractors carry into the next hour");
  assert.equal(await page.locator('[data-time-select="5"] option').filter({hasText:"21:00"}).count(),0,"timeline must not wrap minutes without the hour");
  const times=["23:18","23:21","23:24","23:31","21:51","21:54","22:03","22:11","20:46","20:49","20:52","21:04","22:21","22:26","22:37","22:47"];
  for (let i=0;i<times.length;i++) await page.selectOption(`[data-time-select="${i}"]`, times[i]);
  if(process.env.SCREENSHOT_DIR) await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/timeline-v2.png`,fullPage:true});
  await page.click("[data-check-timeline]");
  await puzzle("14", 1);
  await interview("huang");
  await interview("huang");
  await nav("people"); await page.click('[data-person="huang"]');
  await page.click('[data-huang-evidence="E034"]');
  await page.click('[data-huang-evidence="E073"]');
  await page.click('[data-huang-evidence="E057"]');
  assert.match(await page.locator("#modal-body").textContent(), /22:41[\s\S]*22:43[\s\S]*22:46[\s\S]*22:47[\s\S]*22:48/);
  assert.match(await page.locator("#modal-body").textContent(), /……后面还有/);
  await page.click("[data-huang-playback]");
  assert.match(await page.locator("#modal-body").textContent(),/三次口供已由不同事实逐层击穿/);
  await closeModal();

  const base = await page.evaluate(() => JSON.parse(localStorage.getItem("north-of-pier-seven-save-v1")));
  assert.equal(base.chapter, 6);
  assert.equal(base.timeline, true);
  assert.equal(base.sunOutcome, "safe");
  assert.ok(base.findings.length >= 7, "analysis findings should be separate from raw evidence");
  assert.equal(base.pressure, 0, "correct investigation and ordinary interviews should not add pressure");

  // A weak confrontation choice raises pressure but does not erase progress or end the run.
  const wrongConfrontation={...base,interviews:{...base.interviews,huang:2},huangConfrontation:0,pressure:0,ending:null};
  await page.evaluate(v=>localStorage.setItem("north-of-pier-seven-save-v1",JSON.stringify(v)),wrongConfrontation);
  await page.reload({waitUntil:"networkidle"}); await page.click("#continue-game"); await nav("people");
  await page.click('[data-person="huang"]'); await page.click('[data-huang-evidence="E035"]');
  const afterWrong=await page.evaluate(()=>JSON.parse(localStorage.getItem("north-of-pier-seven-save-v1")));
  assert.equal(afterWrong.pressure,1); assert.equal(afterWrong.huangConfrontation,0); assert.equal(afterWrong.interviews.huang,2);
  await closeModal();

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

  // Contradictory title and classification are rejected before any ending is selected.
  await page.evaluate(v => localStorage.setItem("north-of-pier-seven-save-v1", JSON.stringify({...v,ending:null})), base);
  await page.reload({waitUntil:"networkidle"}); await page.click("#continue-game"); await nav("report");
  const coherentAnswers=[1,1,1,1,0,0,2,0,0,2];
  for (let i=0;i<coherentAnswers.length;i++) await page.selectOption(`[name="q${i}"]`, String(coherentAnswers[i]));
  await page.selectOption("#report-title", {index:1}); await page.selectOption("#classification", "serial");
  await page.click('#report-form button[type="submit"]');
  assert.match(await page.locator("#report-conflict").textContent(), /报告标题与案件定性存在逻辑冲突/);
  assert.equal(await page.locator(".ending").count(),0);

  // Five endings, coherent title/classification pairs, plus dynamic wrong-suspect copy.
  await submitEnding({},2,1,"constructed","没有连环杀手");
  if(process.env.SCREENSHOT_DIR) await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/ending-v2.png`,fullPage:true});
  await submitEnding({evidence:base.evidence.filter(id=>id!=="E059")},2,1,"constructed","照片上的人");
  await submitEnding({},2,0,"serial","七码头杀手");
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
  console.log("Regression passed: evidence schema, natural six-chapter run, case feedback, photo playback, report coherence, five endings, and mobile layout.");
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

