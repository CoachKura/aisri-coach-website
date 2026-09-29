// Renders SVG diagrams to PNG with Chromium so complex scripts (Tamil) are shaped correctly.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
(async () => {
  const [src, dst] = process.argv.slice(2);
  fs.mkdirSync(dst, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2.6 });
  for (const f of fs.readdirSync(src).filter((f) => f.endsWith(".svg"))) {
    const svg = fs.readFileSync(path.join(src, f), "utf8");
    await page.setContent(`<html><body style="margin:0;background:#fff">${svg}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const el = await page.$("svg");
    await el.screenshot({ path: path.join(dst, f.replace(/\.svg$/, ".png")) });
  }
  await browser.close();
  console.log("rendered", fs.readdirSync(dst).filter((f) => f.endsWith(".png")).length);
})();
