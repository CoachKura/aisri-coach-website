// Renders infographics/spec.json into one PNG per Part and language (infographics/en/*.png, infographics/ta/*.png).
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");

const SD = __dirname;
const spec = JSON.parse(fs.readFileSync(path.join(SD, "infographics", "spec.json"), "utf8"));
const C = { navy: "#0B2545", teal: "#13807A", saff: "#D9731A", red: "#B23A3A", grey: "#6B7280", light: "#F3F6F9" };
const ACC = [C.teal, C.saff, C.navy, C.red, "#2A9D8F", "#C0561A"];

// Simple line icons (24x24 viewBox, stroke = currentColor)
const P = {
  heart: '<path d="M12 21s-7.5-4.6-9.5-9.2C1 8 3.4 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.6 0 6 3.5 4.5 7.3C19.5 16.4 12 21 12 21z"/>',
  lungs: '<path d="M12 3v8M12 11c-1.5 1-3 1-3 3M12 11c1.5 1 3 1 3 3"/><path d="M8.5 6.5C5 7 3 12 3 17c0 2 1.5 3 3 2.5s3-1.5 3-4V7.5zM15.5 6.5C19 7 21 12 21 17c0 2-1.5 3-3 2.5s-3-1.5-3-4V7.5z"/>',
  blood: '<path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
  drop: '<path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z"/>',
  sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
  mountain: '<path d="M2 20l7-12 4 6 3-4 6 10z"/><path d="M7.5 10.5l1.5 1 1.5-1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  chart: '<path d="M3 21h18M6 17v-5M11 17V8M16 17v-8M20 17V5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4z"/>',
  shoe: '<path d="M3 16l1-7 4 1c1 2 3 3 5 3l6 1c1.5.3 2 1.5 2 3H3z"/><path d="M3 19h18"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',
  gear: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  people: '<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M2.5 20c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6M13 15.5c1-.7 2.2-1 3.5-1 2.8 0 5 2.2 5 5.5"/>',
  thermometer: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 9v7"/>',
  route: '<circle cx="5" cy="19" r="2"/><circle cx="19" cy="5" r="2"/><path d="M7 19h8a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h8"/>',
  medal: '<circle cx="12" cy="15" r="5"/><path d="M8.5 11L6 3h4l2 5 2-5h4l-2.5 8"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M7.5 12.5l3 3 6-6.5"/>',
};
const icon = (n, col) => `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[n] || P.check}</svg>`;
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

function html(b, lang, idx) {
  const ta = lang === "ta";
  const font = ta ? "'Noto Sans Tamil','Noto Sans',sans-serif" : "'Liberation Sans','Arial',sans-serif";
  const n = b.panels.length; const cols = n <= 4 ? 2 : 3;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:820px;font-family:${font};color:${C.navy};background:#fff}
  .page{padding:34px 36px 30px;border-top:14px solid ${C.navy}}
  .kick{font-size:13px;font-weight:700;letter-spacing:${ta ? 0 : 3}px;color:${C.saff};text-transform:uppercase}
  h1{font-size:${ta ? 30 : 36}px;line-height:1.2;margin:8px 0 8px;font-weight:800}
  .sub{font-size:${ta ? 15 : 16}px;color:${C.grey};line-height:1.45;margin-bottom:22px}
  .hero{display:flex;align-items:center;gap:22px;background:${C.navy};color:#fff;border-radius:16px;padding:22px 26px;margin-bottom:22px}
  .hero .v{font-size:${ta ? 40 : 46}px;font-weight:800;color:#FFC98B;white-space:nowrap}
  .hero .l{font-size:${ta ? 15 : 17}px;line-height:1.4}
  .grid{display:grid;grid-template-columns:repeat(${cols},1fr);gap:14px;margin-bottom:22px}
  .card{border-radius:14px;background:${C.light};padding:16px 16px 14px;border-top:5px solid var(--a)}
  .top{display:flex;align-items:center;gap:10px;margin-bottom:8px}
  .val{font-size:${ta ? 20 : 22}px;font-weight:800;color:var(--a)}
  .hd{font-size:${ta ? 14 : 15}px;font-weight:700;margin-bottom:5px;line-height:1.3}
  .tx{font-size:${ta ? 12.5 : 13.5}px;line-height:1.45;color:#333}
  .flowt{font-size:12px;font-weight:700;letter-spacing:${ta ? 0 : 2}px;color:${C.teal};margin-bottom:10px}
  .flow{display:flex;align-items:stretch;gap:0;margin-bottom:22px}
  .st{flex:1;background:${C.teal};color:#fff;font-weight:700;font-size:${ta ? 12.5 : 13.5}px;padding:12px 10px 12px 22px;text-align:center;line-height:1.3;
      clip-path:polygon(0 0,calc(100% - 14px) 0,100% 50%,calc(100% - 14px) 100%,0 100%,14px 50%);display:flex;align-items:center;justify-content:center}
  .st:first-child{clip-path:polygon(0 0,calc(100% - 14px) 0,100% 50%,calc(100% - 14px) 100%,0 100%);padding-left:12px}
  .st:nth-child(even){background:#0F6B66}
  .take{border-left:6px solid ${C.saff};background:#FDF1E6;padding:14px 18px;font-size:${ta ? 15 : 16.5}px;font-weight:700;line-height:1.45;border-radius:0 12px 12px 0}
  .foot{margin-top:16px;font-size:11px;color:${C.grey};display:flex;justify-content:space-between}
  </style></head><body><div class="page">
  <div class="kick">${esc(b.kicker)}</div><h1>${esc(b.title)}</h1><div class="sub">${esc(b.subtitle)}</div>
  <div class="hero"><div class="v">${esc(b.hero.value)}</div><div class="l">${esc(b.hero.label)}</div></div>
  <div class="grid">${b.panels.map((p, i) => `<div class="card" style="--a:${ACC[i % ACC.length]}"><div class="top">${icon(p.icon, ACC[i % ACC.length])}<div class="val">${esc(p.value)}</div></div><div class="hd">${esc(p.heading)}</div><div class="tx">${esc(p.text)}</div></div>`).join("")}</div>
  <div class="flowt">${ta ? "செயல்முறை" : "THE PROCESS"}</div>
  <div class="flow">${b.flow.map((f) => `<div class="st">${esc(f)}</div>`).join("")}</div>
  <div class="take">${esc(b.takeaway)}</div>
  <div class="foot"><span>AKURA Endurance Index${ta ? "" : "™"}</span><span>${ta ? "தகவல் வரைபடம்" : "Infographic"} ${idx + 1} / ${spec.length}</span></div>
  </div></body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2.2, viewport: { width: 820, height: 1000 } });
  for (const lang of ["en", "ta"]) {
    const out = path.join(SD, "infographics", lang); fs.mkdirSync(out, { recursive: true });
    for (const [i, item] of spec.entries()) {
      await page.setContent(html(item[lang], lang, i), { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const el = await page.$(".page");
      await el.screenshot({ path: path.join(out, item.file + ".png") });
    }
  }
  await browser.close();
  console.log("rendered", spec.length * 2);
})();
