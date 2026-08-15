/**
 * Smoke parity check: localhost vs avenewdemo.online
 *
 * Unlocks the demo gate, then compares structural/layout markers at
 * mobile (400) and desktop (1280) for homepage + category landings.
 *
 * Usage:
 *   node scripts/smoke-demo-parity.mjs
 *
 * Env:
 *   LOCAL_BASE=http://localhost:3000
 *   DEMO_BASE=https://avenewdemo.online
 *   DEMO_ACCESS_CODE=cmedical2026
 *   SMOKE_OUT=tmp/demo-parity-smoke
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(
  ROOT,
  process.env.SMOKE_OUT || "tmp/demo-parity-smoke",
);
const LOCAL = (process.env.LOCAL_BASE || "http://localhost:3000").replace(
  /\/$/,
  "",
);
const DEMO = (process.env.DEMO_BASE || "https://avenewdemo.online").replace(
  /\/$/,
  "",
);
const CODE = process.env.DEMO_ACCESS_CODE || "cmedical2026";

const PAGES = [
  { id: "home", local: "/no", demo: "/" },
  { id: "gynekologi", local: "/no/gynekologi", demo: "/gynekologi" },
  { id: "fertilitet", local: "/no/fertilitet", demo: "/fertilitet" },
  { id: "urologi", local: "/no/urologi", demo: "/urologi" },
  { id: "ortopedi", local: "/no/ortopedi", demo: "/ortopedi" },
  { id: "graviditet", local: "/no/graviditet", demo: "/graviditet" },
];

const VIEWPORTS = [
  { id: "mobile", width: 400, height: 800 },
  { id: "desktop", width: 1280, height: 900 },
];

fs.mkdirSync(OUT, { recursive: true });

async function unlockDemo(page) {
  const gate = page.getByRole("heading", { name: /Tilgang kreves/i });
  try {
    await gate.waitFor({ timeout: 6000 });
  } catch {
    return false;
  }
  const input = page
    .locator('input[type="password"], input[placeholder*="Tilgang"], input')
    .first();
  await input.fill(CODE);
  const btn = page.getByRole("button", { name: /logg inn|log in|fortsett/i });
  if (await btn.count()) await btn.first().click();
  else await page.getByRole("button").first().click();
  await page.waitForTimeout(1500);
  return true;
}

async function probe(page) {
  await page.waitForTimeout(1200);

  return page.evaluate(() => {
    const body = document.body;
    const overflowX = Math.max(
      0,
      Math.ceil(body.scrollWidth - window.innerWidth),
    );

    const buttons = [...document.querySelectorAll("button, a.inline-flex")]
      .filter((el) => {
        const t = (el.textContent || "").trim().toLowerCase();
        return (
          t.includes("bestill") ||
          t.includes("ring oss") ||
          t.includes("book")
        );
      })
      .slice(0, 6)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          text: (el.textContent || "").trim().slice(0, 48),
          width: Math.round(r.width),
          fullish: r.width >= window.innerWidth * 0.85,
        };
      });

    const videos = [...document.querySelectorAll("video")].map((v) => {
      const r = v.getBoundingClientRect();
      const box = v.parentElement?.getBoundingClientRect();
      return {
        src: (v.currentSrc || v.src || "").slice(-40),
        w: Math.round(r.width),
        h: Math.round(r.height),
        parentH: box ? Math.round(box.height) : 0,
        visible: r.width > 40 && r.height > 40,
      };
    });

    const heroImgs = [...document.querySelectorAll("header img, header video")]
      .slice(0, 4)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          w: Math.round(r.width),
          h: Math.round(r.height),
          visible: r.width > 40 && r.height > 80,
        };
      });

    const snapCards = [
      ...document.querySelectorAll(
        'article.snap-start, a.snap-start, [class*="snap-start"]',
      ),
    ];
    const snapSample = snapCards.slice(0, 3).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        w: Math.round(r.width),
        pct: Math.round((r.width / window.innerWidth) * 100),
      };
    });

    const lifePhaseHeading = [...document.querySelectorAll("h2")].find((h) =>
      /Kroppen endrer|endrer seg gjennom/i.test(h.textContent || ""),
    );
    let lifePhaseMode = "missing";
    if (lifePhaseHeading) {
      const section =
        lifePhaseHeading.closest("section") || lifePhaseHeading.parentElement;
      const hasSnap = !!section?.querySelector(
        '[class*="snap-start"], .snap-start',
      );
      const hasAccordion = !!section?.querySelector(
        '[data-orientation], [data-state]',
      );
      lifePhaseMode = hasSnap
        ? "carousel"
        : hasAccordion
          ? "accordion"
          : "other";
    }

    const h2s = [...document.querySelectorAll("h1, h2")]
      .map((h) => (h.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80))
      .filter(Boolean)
      .slice(0, 14);

    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim();
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();

    return {
      title: document.title,
      overflowX,
      buttons,
      videos,
      heroImgs,
      snapSample,
      lifePhaseMode,
      h2s,
      tokens: { background: bg, accent },
    };
  });
}

function compareProbe(local, demo, viewportId) {
  const issues = [];

  if (local.overflowX > 8 || demo.overflowX > 8) {
    if (Math.abs(local.overflowX - demo.overflowX) > 12) {
      issues.push(
        `overflowX local=${local.overflowX} demo=${demo.overflowX}`,
      );
    }
  }

  if (viewportId === "mobile") {
    const localFull = local.buttons.filter((b) => b.fullish).length;
    const demoFull = demo.buttons.filter((b) => b.fullish).length;
    if (demoFull > 0 && localFull === 0) {
      issues.push("mobile CTAs not full-width (demo has full-width CTAs)");
    }

    if (
      demo.lifePhaseMode === "carousel" &&
      local.lifePhaseMode === "accordion"
    ) {
      issues.push("life-phases is accordion on mobile; demo uses carousel");
    }

    const demoSnap = demo.snapSample[0];
    const localSnap = local.snapSample[0];
    if (demoSnap && localSnap) {
      if (Math.abs(demoSnap.pct - localSnap.pct) > 12) {
        issues.push(
          `snap card width local=${localSnap.pct}% demo=${demoSnap.pct}%`,
        );
      }
    } else if (demoSnap && !localSnap) {
      issues.push("demo has snap carousel cards; local missing");
    }

    const demoHeroVisible = [...demo.heroImgs, ...demo.videos].some(
      (m) => m.visible,
    );
    const localHeroVisible = [...local.heroImgs, ...local.videos].some(
      (m) => m.visible,
    );
    if (demoHeroVisible && !localHeroVisible) {
      issues.push("hero media not visible on local (demo has visible media)");
    }
  }

  // Token drift check (allow tiny formatting differences)
  if (demo.tokens.accent && local.tokens.accent) {
    if (
      demo.tokens.accent.replace(/\s/g, "") !==
      local.tokens.accent.replace(/\s/g, "")
    ) {
      issues.push(
        `accent token local="${local.tokens.accent}" demo="${demo.tokens.accent}"`,
      );
    }
  }

  return issues;
}

async function main() {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });
  const results = [];
  let failCount = 0;

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      locale: "nb-NO",
    });
    const demoPage = await context.newPage();
    const localPage = await context.newPage();

    // Unlock once per viewport context
    await demoPage.goto(DEMO + "/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await unlockDemo(demoPage);

    for (const pageDef of PAGES) {
      const row = {
        page: pageDef.id,
        viewport: vp.id,
        issues: [],
        ok: true,
      };

      try {
        await Promise.all([
          demoPage.goto(DEMO + pageDef.demo, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          }),
          localPage.goto(LOCAL + pageDef.local, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          }),
        ]);
        // Re-unlock if redirected to gate
        await unlockDemo(demoPage);

        const [demoProbe, localProbe] = await Promise.all([
          probe(demoPage),
          probe(localPage),
        ]);

        const shotBase = `${pageDef.id}-${vp.id}`;
        const shotOpts = {
          fullPage: false,
          timeout: 10000,
          animations: "disabled",
        };
        try {
          await demoPage.screenshot({
            path: path.join(OUT, `${shotBase}-demo.png`),
            ...shotOpts,
          });
        } catch {
          /* screenshot is best-effort */
        }
        try {
          await localPage.screenshot({
            path: path.join(OUT, `${shotBase}-local.png`),
            ...shotOpts,
          });
        } catch {
          /* screenshot is best-effort */
        }

        row.issues = compareProbe(localProbe, demoProbe, vp.id);
        row.local = {
          overflowX: localProbe.overflowX,
          lifePhaseMode: localProbe.lifePhaseMode,
          heroVisible: [...localProbe.heroImgs, ...localProbe.videos].some(
            (m) => m.visible,
          ),
          snapPct: localProbe.snapSample[0]?.pct ?? null,
          tokens: localProbe.tokens,
          h2s: localProbe.h2s.slice(0, 6),
        };
        row.demo = {
          overflowX: demoProbe.overflowX,
          lifePhaseMode: demoProbe.lifePhaseMode,
          heroVisible: [...demoProbe.heroImgs, ...demoProbe.videos].some(
            (m) => m.visible,
          ),
          snapPct: demoProbe.snapSample[0]?.pct ?? null,
          tokens: demoProbe.tokens,
          h2s: demoProbe.h2s.slice(0, 6),
        };
        row.ok = row.issues.length === 0;
        if (!row.ok) failCount += 1;
      } catch (err) {
        row.ok = false;
        row.issues = [`ERROR: ${err.message}`];
        failCount += 1;
      }

      results.push(row);
      console.log(
        `${row.ok ? "PASS" : "FAIL"} ${pageDef.id}@${vp.id}` +
          (row.issues.length ? ` — ${row.issues.join("; ")}` : ""),
      );
    }

    await context.close();
  }

  await browser.close();

  const report = {
    generatedAt: new Date().toISOString(),
    local: LOCAL,
    demo: DEMO,
    failCount,
    passCount: results.length - failCount,
    results,
  };
  fs.writeFileSync(
    path.join(OUT, "report.json"),
    JSON.stringify(report, null, 2),
  );

  console.log("\n--- summary ---");
  console.log(`pass=${report.passCount} fail=${report.failCount}`);
  console.log(`report: ${path.join(OUT, "report.json")}`);
  console.log(`shots:  ${OUT}`);

  if (failCount > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
