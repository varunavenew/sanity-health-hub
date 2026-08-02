import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
const bundled = await bundle({ entryPoint: "/dev-server/remotion/src/index.ts", webpackOverride: (c)=>c });
const browser = await openBrowser("chrome", { browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium", chromiumOptions:{args:["--no-sandbox","--disable-gpu","--disable-dev-shm-usage"]}, chromeMode:"chrome-for-testing" });
const composition = await selectComposition({ serveUrl: bundled, id: "main", puppeteerInstance: browser });
console.log("duration", composition.durationInFrames);
for (const f of [110, 250, 520, 700, 950, 1120, 1660, 3560, 3950, 4130]) {
  await renderStill({ composition, serveUrl: bundled, output: `/tmp/still-${f}.png`, frame: f, puppeteerInstance: browser, overwrite: true });
  console.log("ok", f);
}
await browser.close({ silent: false });
