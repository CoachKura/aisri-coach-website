// Builds the complete AKURA book (.docx) from content/*.md files.
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, PageBreak, Header, Footer, PageNumber, TableOfContents,
  LevelFormat, VerticalAlign, TabStopType, ImageRun,
} = require("docx");

const OUT = process.argv[2] || "AKURA_World_Athlete_Research_Book_Complete_Edition.docx";
const LANG = process.env.BOOK_LANG || "en";
const TA = LANG === "ta";
const CONTENT_DIR = process.env.CONTENT_DIR || path.join(__dirname, TA ? "content_ta" : "content");
const FIG_DIR = process.env.FIG_DIR || path.join(__dirname, TA ? "figures_ta" : "figures");
const FIG_JSON = TA ? path.join(CONTENT_DIR, "figures_ta.json") : path.join(FIG_DIR, "figures.json");
const FIGS = fs.existsSync(FIG_JSON) ? JSON.parse(fs.readFileSync(FIG_JSON, "utf8")) : {};
const EN = {
  story: "THE STORY", sources: "Sources", keyIdea: "Key idea", coachCorner: "Coach's corner", fieldProtocol: "Field protocol", mythVsEvidence: "Myth vs evidence",
  myth: "Myth:", evidence: "Evidence:", checkpoint: "Checkpoint", chapter: "CHAPTER", part: "PART", inThisPart: "IN THIS PART",
  atAGlance: "AT A GLANCE", glanceSub: "The key idea from each chapter, for quick revision.", figure: "Figure", contents: "Contents",
  header: "AKURA World Athlete Research Book  •  The AKURA Endurance Index™",
  refsTitle: "References and Further Reading",
  refsIntro: "The sources below were used as starting points for the evidence discussed in this book. Readers should consult the original papers; inclusion here does not imply that the authors endorse the AKURA Endurance Index.",
  coverBrand: "WORLD ATHLETE RESEARCH BOOK", coverTitle: "The AKURA Endurance Index™ (AEI)", coverSubtitle: "From Myth to Measurement",
  coverTagline: "MEASURE THE ATHLETE  •  UNDERSTAND THE BODY  •  BUILD THE PERFORMANCE", coverEdition: "Complete English Edition  •  Indian Sports Context",
  coverAuthor: "KURA", coverSystem: "AKURA Endurance Research System", coverProto: "Prototype Edition 0.1  •  2026",
  copyright: [
    "**AKURA World Athlete Research Book — The AKURA Endurance Index™ (AEI): From Myth to Measurement**",
    "Complete English Edition. Prototype Edition 0.1, 2026.",
    "© 2026 Kura / AKURA Endurance Research System. All rights reserved. No part of this publication may be reproduced without the prior written permission of the author, except for brief quotations in reviews and academic work with attribution.",
    "AKURA, AKURA Endurance Index™, AEI and AISRi are names used by the AKURA Endurance Research System. VDOT® is a registered trademark of The Run SMART Project, LLC. Garmin and Garmin Connect are trademarks of Garmin Ltd. or its subsidiaries; Strava is a trademark of Strava, Inc. TCS World 10K, Tata Mumbai Marathon, World Athletics, Olympics.com and other event, organisation and product names belong to their respective owners and are used only to identify them. This book is independent and is not affiliated with, sponsored or endorsed by any of these owners, or by any athlete, coach or organisation named in it.",
    "All figures, diagrams and infographics are original works created for this book. Short quotations from published news reports and interviews are reproduced for the purposes of criticism, review and reporting, with attribution to their source.",
    "**Important notice.** This book is an educational and research document. It is not medical advice. The AKURA Endurance Index is a proposed research framework that has not yet been validated; its equations and categories must not be used for high-stakes selection, medical or safety decisions. Blood testing, cardiac screening, hypoxic exposure and heat-acclimation interventions should be conducted only with appropriate medical oversight and, for research, with informed consent and ethics committee approval.",
    "Chennai, Tamil Nadu, India.",
  ],
};
const S = TA ? { ...EN, ...JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "strings.json"), "utf8")) } : EN;
if (TA) for (const k of Object.keys(S)) S[k] = Array.isArray(S[k]) ? S[k].map((x) => x.replace(/™/g, "")) : String(S[k]).replace(/™/g, "");
let figNo = 0;
// Part infographics (one full page after each Part opener) and optional author photo
const IG_SPEC = path.join(__dirname, "infographics", "spec.json");
const IG = fs.existsSync(IG_SPEC) ? Object.fromEntries(JSON.parse(fs.readFileSync(IG_SPEC, "utf8")).map((x) => [x.part, x.file])) : {};
function infographic(roman) {
  const f = IG[roman]; if (!f) return [];
  const file = path.join(__dirname, "infographics", TA ? "ta" : "en", f + ".png");
  if (!fs.existsSync(file)) return [];
  const data = fs.readFileSync(file); const { w, h } = pngSize(data);
  let width = 602, height = Math.round((602 * h) / w);
  if (height > 900) { width = Math.round((width * 900) / height); height = 900; }
  return [new Paragraph({ pageBreakBefore: true, alignment: AlignmentType.CENTER, children: [new ImageRun({ type: "png", data, transformation: { width, height }, altText: { title: "Infographic", description: "Part " + roman + " at a glance", name: f } })] })];
}
const AUTHOR_PHOTO = path.join(__dirname, "author", "author_circle.png");
// PNG pixel size from the IHDR chunk
function pngSize(buf) { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; }
function figure(file, caption) {
  const data = fs.readFileSync(path.join(FIG_DIR, file));
  const { w, h } = pngSize(data);
  const width = 600; const height = Math.round((width * h) / w);
  figNo++;
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 200, after: 80 },
      children: [new ImageRun({ type: "png", data, transformation: { width, height }, altText: { title: `${S.figure} ${figNo}`, description: caption, name: file } })] }),
    new Paragraph({ spacing: { after: 240, line: 264 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "C9D3DE", space: 6 } },
      children: [new TextRun({ text: `${S.figure} ${figNo}.  `, bold: true, color: C.saffron, font: HEAD_FONT, size: 17 }), ...runs(caption, { italics: !TA, color: C.grey, size: 18 })] }),
  ];
}

// ---------- design tokens ----------
const C = {
  navy: "0B2545", teal: "13807A", saffron: "D9731A", ink: "222222", grey: "666666",
  light: "F3F6F9", tealLight: "E6F4F2", saffronLight: "FDF1E6", navyLight: "E8EDF4", redLight: "FBEAEA", red: "B23A3A",
};
// Tamil script uses the complex-script (cs) font slot; Latin keeps Georgia/Arial.
const TA_BODY = process.env.TA_BODY_FONT || "Nirmala UI", TA_HEAD = process.env.TA_HEAD_FONT || "Nirmala UI";
const BODY_FONT = TA ? { ascii: "Georgia", hAnsi: "Georgia", cs: TA_BODY, eastAsia: "Georgia" } : "Georgia";
const HEAD_FONT = TA ? { ascii: "Arial", hAnsi: "Arial", cs: TA_HEAD, eastAsia: "Arial" } : "Arial";
const LINE = TA ? 360 : 312;
const PAGE_W = 11906, PAGE_H = 16838, MARGIN = 1440;
const CW = PAGE_W - 2 * MARGIN; // content width (DXA)

// ---------- inline parsing ----------
function runs(text, base = {}) {
  const out = [];
  if (TA) text = String(text).replace(/™/g, "");
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  for (const p of parts) {
    if (!p) continue;
    if (p.startsWith("**") && p.endsWith("**")) out.push(new TextRun({ ...base, text: p.slice(2, -2), bold: true }));
    else out.push(new TextRun({ ...base, text: p }));
  }
  return out;
}
const tamil = (s) => /[஀-௿]/.test(s);

// ---------- element builders ----------
const body = (t) => new Paragraph({ children: runs(t), spacing: { after: 160, line: LINE }, alignment: TA ? AlignmentType.LEFT : AlignmentType.JUSTIFIED });

function box(label, text, fill, accent, extraParas = []) {
  const children = [
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: label.toUpperCase(), bold: true, font: HEAD_FONT, size: 18, color: accent, characterSpacing: 20 })] }),
    ...(Array.isArray(text) ? text : [text]).map((t) => new Paragraph({ spacing: { after: 60, line: 300 }, children: runs(t, { size: 21 }) })),
    ...extraParas,
  ];
  const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return [
    new Table({
      width: { size: CW, type: WidthType.DXA }, columnWidths: [CW],
      rows: [new TableRow({ cantSplit: true, children: [new TableCell({
        width: { size: CW, type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR, color: "auto" },
        margins: { top: 140, bottom: 140, left: 240, right: 240 },
        borders: { top: none, bottom: none, right: none, left: { style: BorderStyle.SINGLE, size: 24, color: accent } },
        children,
      })] })],
    }),
    new Paragraph({ spacing: { after: 120 }, children: [] }),
  ];
}

function table(rows) {
  const ncol = Math.max(...rows.map((r) => r.length));
  rows = rows.map((r) => { while (r.length < ncol) r.push(""); return r; });
  // width proportional to content length, but never narrower than the longest word
  const lens = Array.from({ length: ncol }, (_, i) => Math.max(...rows.map((r) => Math.min(60, (r[i] || "").length + 6))));
  const minW = Array.from({ length: ncol }, (_, i) => Math.max(...rows.map((r, ri) =>
    Math.max(0, ...String(r[i] || "").replace(/\*\*/g, "").split(/\s+/).map((w) => w.length * (ri === 0 ? 118 : 105)))) ) + 260);
  const tot = lens.reduce((a, b) => a + b, 0);
  let widths = lens.map((l, i) => Math.max(minW[i], Math.round((CW * l) / tot)));
  let over = widths.reduce((a, b) => a + b, 0) - CW;
  while (over > 0) { // shrink columns that have slack above their minimum
    const slack = widths.map((w, i) => w - minW[i]); const totS = slack.reduce((a, b) => a + Math.max(0, b), 0);
    if (totS <= 0) break;
    widths = widths.map((w, i) => w - Math.floor((over * Math.max(0, slack[i])) / totS));
    over = widths.reduce((a, b) => a + b, 0) - CW; if (over <= ncol) break;
  }
  const s = widths.reduce((a, b) => a + b, 0);
  widths = widths.map((w) => Math.floor((w * CW) / s));
  widths[widths.length - 1] += CW - widths.reduce((a, b) => a + b, 0);
  const keep = rows.length <= 32; // keep short tables on one page
  const border = { style: BorderStyle.SINGLE, size: 4, color: "C9D3DE" };
  const borders = { top: border, bottom: border, left: border, right: border };
  return [
    new Table({
      width: { size: CW, type: WidthType.DXA }, columnWidths: widths,
      rows: rows.map((r, ri) => new TableRow({
        tableHeader: ri === 0,
        cantSplit: true,
        children: r.map((cell, ci) => new TableCell({
          width: { size: widths[ci], type: WidthType.DXA }, borders,
          verticalAlign: VerticalAlign.CENTER,
          shading: { fill: ri === 0 ? C.navy : ri % 2 === 0 ? C.light : "FFFFFF", type: ShadingType.CLEAR, color: "auto" },
          margins: { top: 70, bottom: 70, left: 110, right: 110 },
          children: [new Paragraph({ keepNext: keep && ri < rows.length - 1, spacing: { after: 0, line: 264 }, children: runs(cell.trim(), ri === 0
            ? { bold: true, color: "FFFFFF", font: HEAD_FONT, size: 18 }
            : { size: 18, font: HEAD_FONT }) })],
        })),
      })),
    }),
    new Paragraph({ spacing: { after: 160 }, children: [] }),
  ];
}

let listInstance = 0;
function listItem(t, numbered, inst) {
  return new Paragraph({
    numbering: { reference: numbered ? "numbers" : "bullets", level: 0, instance: inst },
    spacing: { after: 80, line: 300 }, children: runs(t),
  });
}

function quote(t) {
  let [q, who] = t.split(/\s+—\s+(?=[^—]*$)/);
  const cs = tamil(q) ? { font: { ascii: "Georgia", hAnsi: "Georgia", cs: TA_BODY } } : {};
  const out = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 80, line: 340 },
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: C.saffron, space: 10 } },
      children: [new TextRun({ text: q.trim(), italics: !TA, size: 28, color: C.navy, ...cs })] }),
  ];
  if (who) out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 280 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.saffron, space: 10 } },
    children: [new TextRun({ text: "— " + who.trim(), size: 20, color: C.saffron, bold: true, font: HEAD_FONT })] }));
  return out;
}

function partPage(label, title, intro, chapters = []) {
  const spacer = () => new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "", size: 40 })] });
  return [
    new Paragraph({ pageBreakBefore: true, children: [] }),
    ...Array.from({ length: 8 }, spacer),
    new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 360 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: C.saffron, space: 12 } },
      children: [new TextRun({ text: label + " — ", color: C.saffron }), new TextRun({ text: title })] }),
    ...(intro ? [new Paragraph({ spacing: { after: 200, line: 360 }, children: runs(intro, { size: 24, color: C.grey, italics: !TA }) })] : []),
    ...(chapters.length ? [new Paragraph({ spacing: { before: 360, after: 120 }, children: [new TextRun({ text: S.inThisPart, font: HEAD_FONT, size: 18, bold: true, color: C.teal, characterSpacing: 40 })] })] : []),
    ...chapters.map(([n, t]) => new Paragraph({ spacing: { after: 70 }, indent: { left: 0 },
      children: [new TextRun({ text: `${n}   `, font: HEAD_FONT, size: 22, bold: true, color: C.saffron }), new TextRun({ text: t, font: HEAD_FONT, size: 22, color: C.navy })] })),
  ];
}

function partSummary(state) {
  const ks = state.partKeys || []; state.partKeys = [];
  if (!ks.length || !state.currentPart) return [];
  const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const rows = ks.map(([n, t, k]) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 1100, type: WidthType.DXA }, borders: { top: none, left: none, right: none, bottom: { style: BorderStyle.SINGLE, size: 4, color: "C9D3DE" } },
      margins: { top: 90, bottom: 90, left: 80, right: 80 }, children: [new Paragraph({ children: [new TextRun({ text: n, font: HEAD_FONT, bold: true, size: 30, color: C.saffron })] })] }),
    new TableCell({ width: { size: CW - 1100, type: WidthType.DXA }, borders: { top: none, left: none, right: none, bottom: { style: BorderStyle.SINGLE, size: 4, color: "C9D3DE" } },
      margins: { top: 90, bottom: 90, left: 80, right: 80 }, children: [
        new Paragraph({ spacing: { after: 30 }, children: [new TextRun({ text: t, font: HEAD_FONT, bold: true, size: 19, color: C.navy })] }),
        new Paragraph({ spacing: { after: 0, line: 280 }, children: runs(k, { size: 20 }) })] }),
  ] }));
  return [
    new Paragraph({ keepNext: true, spacing: { before: 520, after: 60 }, shading: { type: ShadingType.CLEAR, fill: C.navy, color: "auto" },
      children: [new TextRun({ text: "  " + state.currentPart.split(" — ")[0] + " " + S.atAGlance, font: HEAD_FONT, bold: true, size: 22, color: "FFFFFF", characterSpacing: 40 })] }),
    new Paragraph({ keepNext: true, spacing: { after: 120 }, children: [new TextRun({ text: S.glanceSub, italics: !TA, size: 19, color: C.grey })] }),
    new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [1100, CW - 1100], rows }),
  ];
}

// ---------- parse content ----------
function parseFile(txt, state) {
  const out = [];
  const raw0 = txt.replace(/\r/g, "").split("\n");
  // drop blank lines that sit between two table rows, so a table is never split
  const lines = raw0.filter((l, i) => {
    if (l.trim()) return true;
    let a = i - 1; while (a >= 0 && !raw0[a].trim()) a--;
    let b = i + 1; while (b < raw0.length && !raw0[b].trim()) b++;
    return !(a >= 0 && b < raw0.length && raw0[a].trim().startsWith("|") && raw0[b].trim().startsWith("|"));
  });
  let tableBuf = null; let listType = null; let inst = 0; let pendingPart = null;
  const flushTable = () => { if (tableBuf) { out.push(...table(tableBuf)); tableBuf = null; } };
  const endList = () => { listType = null; };
  const flushPart = () => { if (pendingPart) { out.push(...partPage(pendingPart.label, pendingPart.title, null)); pendingPart = null; } };
  let mode = "body";
  for (let raw of lines) {
    const line = raw.trim();
    if (mode === "refs") { if (line.startsWith("- ")) state.refs.push(line.slice(2).trim()); continue; }
    if (!line) { flushTable(); continue; }
    if (line.startsWith("|")) {
      endList();
      const cells = line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue; // markdown separator
      (tableBuf = tableBuf || []).push(cells); continue;
    }
    flushTable();
    let m;
    if (line === "REFS:" || line.startsWith("REFS:")) { mode = "refs"; continue; }
    if (line === "FRONTMATTER" || line === "BACKMATTER") { if (line === "BACKMATTER") out.push(...partSummary(state)); state.section = line; continue; }
    if ((m = line.match(/^PART\s+([IVXLC]+)\s*[—–-]\s*(.+)$/))) {
      flushPart(); endList();
      out.push(...partSummary(state));
      state.section = "PART";
      pendingPart = { label: S.part + " " + m[1], title: m[2].trim() };
      state.parts.push(pendingPart.label + " — " + pendingPart.title);
      state.currentPart = pendingPart.label + " — " + pendingPart.title;
      continue;
    }
    if ((m = line.match(/^PARTINTRO:\s*(.+)$/))) { if (pendingPart) { out.push(...partPage(pendingPart.label, pendingPart.title, m[1], state.partChapters[pendingPart.label] || [])); out.push(...infographic(pendingPart.label.split(" ").pop())); pendingPart = null; state.afterPart = true; } continue; }
    flushPart();
    if ((m = line.match(/^##\s+(.+)$/)) && !line.startsWith("###")) {
      endList();
      const t = m[1].trim();
      const isFrontBack = state.section !== "PART";
      if (isFrontBack) {
        const idx = state.section === "BACKMATTER" ? (state.backIdx = (state.backIdx ?? -1) + 1) : (state.frontIdx = (state.frontIdx ?? -1) + 1);
        const newPage = state.section === "BACKMATTER" ? [0, 5, 6, 7].includes(idx) : idx === 0;
        if (state.section === "BACKMATTER" && idx === 7) out.push({ __refs: true });
        const isAbout = state.section === "BACKMATTER" && idx === 7;
        out.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: newPage, keepNext: true,
          spacing: newPage ? undefined : { before: 600, after: 280 }, children: [new TextRun(t)] }));
        if (isAbout && fs.existsSync(AUTHOR_PHOTO)) {
          const d = fs.readFileSync(AUTHOR_PHOTO); const { w, h } = pngSize(d);
          out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new ImageRun({ type: "png", data: d, transformation: { width: 200, height: Math.round((200 * h) / w) }, altText: { title: "Author", description: "Photograph of the author", name: "author" } })] }));
        }
        state.leadNext = false;
      } else {
        const sm = t.match(/^STORY:\s*(.+)$/);
        const cm = sm ? null : t.match(/^(\d+)\.\s*(.+)$/);
        state.chapters++;
        const brk = !!state.afterPart; state.afterPart = false;
        out.push(new Paragraph({ pageBreakBefore: brk, keepNext: true, keepLines: true, spacing: { before: brk ? 0 : 560, after: 0 },
          border: brk ? undefined : { top: { style: BorderStyle.SINGLE, size: 12, color: C.saffron, space: 18 } },
          children: [new TextRun({ text: sm ? S.story : cm ? S.chapter + " " + cm[1] : "", font: HEAD_FONT, size: 20, bold: true, color: C.saffron, characterSpacing: 40 })] }));
        out.push(new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: [new TextRun(sm ? sm[1] : t)] }));
        out.push(new Paragraph({ keepNext: true, spacing: { after: 240 }, children: [new TextRun({ text: state.currentPart || "", font: HEAD_FONT, size: 17, color: C.grey })] }));
        state.chTitle = cm ? [cm[1], cm[2]] : null; state.keyTaken = false;
        state.leadNext = true; state.figQueue = cm ? [...(FIGS[cm[1]] || [])] : [];
      }
      continue;
    }
    if ((m = line.match(/^###\s+(.+)$/))) { endList(); out.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(m[1].trim())] })); continue; }
    if ((m = line.match(/^[-*]\s+(.+)$/))) { if (listType !== "b") { listType = "b"; inst = ++listInstance; } out.push(listItem(m[1], false, inst)); continue; }
    if ((m = line.match(/^(\d+)[).]\s+(.+)$/))) { if (listType !== "n") { listType = "n"; inst = ++listInstance; } out.push(listItem(m[2], true, inst)); continue; }
    endList();
    if ((m = line.match(/^KEY:\s*(.+)$/))) {
      if (state.section === "PART" && state.chTitle && !state.keyTaken) { (state.partKeys = state.partKeys || []).push([state.chTitle[0], state.chTitle[1], m[1]]); state.keyTaken = true; }
      out.push(...box(S.keyIdea, m[1], C.navyLight, C.navy)); continue; }
    if ((m = line.match(/^COACH:\s*(.+)$/))) { out.push(...box(S.coachCorner, m[1], C.tealLight, C.teal)); continue; }
    if ((m = line.match(/^FIELD:\s*(.+)$/))) {
      const steps = m[1].split(/\s+;\s+/);
      out.push(...box(S.fieldProtocol, steps.length > 1 ? steps.map((s, i) => `${i + 1}. ${s.trim()}`) : steps, C.saffronLight, C.saffron));
      continue;
    }
    if ((m = line.match(/^MYTH:\s*(.+)$/))) {
      const [myth, fact] = m[1].split(/\s*\|\|\s*/);
      out.push(...box(S.mythVsEvidence, [`**${S.myth}** ${myth.trim()}`, `**${S.evidence}** ${(fact || "").trim()}`], C.redLight, C.red));
      continue;
    }
    if ((m = line.match(/^SOURCES:\s*(.+)$/))) {
      out.push(new Paragraph({ spacing: { before: 120, after: 240, line: 264 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: "C9D3DE", space: 6 } },
        children: [new TextRun({ text: S.sources + ": ", bold: true, font: HEAD_FONT, size: 16, color: C.grey }), ...runs(m[1], { size: 16, color: C.grey })] }));
      continue;
    }
    if ((m = line.match(/^FIG:\s*([^|]+)\|\s*(.+)$/))) { out.push(...figure(m[1].trim(), m[2].trim())); continue; }
    if ((m = line.match(/^QUOTE:\s*(.+)$/))) { out.push(...quote(m[1])); continue; }
    if ((m = line.match(/^CHECK:\s*(.+)$/))) { out.push(...box(S.checkpoint, m[1], C.light, C.grey)); continue; }
    if (state.leadNext) {
      state.leadNext = false;
      out.push(new Paragraph({ children: runs(line, { size: 25, color: C.navy }), spacing: { after: 200, line: 336 } }));
    } else out.push(body(line));
    if (state.figQueue && state.figQueue.length) { const f = state.figQueue.shift(); out.push(...figure(f.file, f.caption)); }
  }
  flushTable(); flushPart();
  return out;
}

// ---------- references ----------
function refsSection(refs) {
  const seen = new Map();
  const keyOf = (r) => {
    const sur = (r.match(/^[^\s,.]+/) || [""])[0].toLowerCase();
    const yr = (r.match(/(19|20)\d\d/) || [""])[0];
    return sur + yr;
  };
  for (const r of refs) {
    const clean = r.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
    const key = keyOf(clean);
    if (!seen.has(key) || clean.length > seen.get(key).length) seen.set(key, clean);
  }
  // drop undated entries when a dated entry by the same first author exists
  for (const k of [...seen.keys()]) if (!/\d{4}$/.test(k) && [...seen.keys()].some((o) => o !== k && o.startsWith(k))) seen.delete(k);
  const list = [...seen.values()].sort((a, b) => a.localeCompare(b));
  return [
    new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun(S.refsTitle)] }),
    body(S.refsIntro),
    ...list.map((r) => new Paragraph({ spacing: { after: 100, line: 276 }, indent: { left: 360, hanging: 360 }, children: runs(r, { size: 19 }) })),
  ];
}

// ---------- cover & preliminaries ----------
function cover() {
  const t = (text, o = {}) => new TextRun({ text, font: HEAD_FONT, ...o });
  const cov = path.join(FIG_DIR, "cover.png");
  const art = fs.existsSync(cov) ? (() => { const d = fs.readFileSync(cov); const { w, h } = pngSize(d); return [new Paragraph({ spacing: { before: 0, after: 360 },
    children: [new ImageRun({ type: "png", data: d, transformation: { width: 602, height: Math.round((602 * h) / w) }, altText: { title: "Cover art", description: "Heart-rate trace over the Chennai-to-Ooty elevation profile", name: "cover" } })] })]; })() : [];
  return [
    ...art,
    new Paragraph({ spacing: { before: 200, after: 0 }, children: [t("AKURA", { size: 72, bold: true, color: C.saffron, characterSpacing: 200 })] }),
    new Paragraph({ spacing: { after: 600 }, border: { bottom: { style: BorderStyle.SINGLE, size: 24, color: C.saffron, space: 8 } }, children: [t(S.coverBrand, { size: 30, bold: true, color: C.navy, characterSpacing: 60 })] }),
    new Paragraph({ spacing: { after: 200 }, children: [t(S.coverTitle, { size: 56, bold: true, color: C.navy })] }),
    new Paragraph({ spacing: { after: 900 }, children: [t(S.coverSubtitle, { size: 40, color: C.teal, italics: !TA })] }),
    new Paragraph({ spacing: { after: 120 }, children: [t(S.coverTagline, { size: 20, bold: true, color: C.grey, characterSpacing: 30 })] }),
    new Paragraph({ spacing: { after: 1400 }, children: [t(S.coverEdition, { size: 22, color: C.grey })] }),
    new Paragraph({ spacing: { after: 60 }, children: [t(S.coverAuthor, { size: 32, bold: true, color: C.navy, characterSpacing: 80 })] }),
    new Paragraph({ spacing: { after: 60 }, children: [t(S.coverSystem, { size: 22, color: C.navy })] }),
    new Paragraph({ children: [t(S.coverProto, { size: 20, color: C.grey })] }),
  ];
}

function copyright() {
  const small = (text, o = {}) => new Paragraph({ spacing: { after: 140, line: 288 }, children: runs(text, { size: 18, color: C.grey, font: HEAD_FONT, ...o }) });
  return [
    new Paragraph({ pageBreakBefore: true, spacing: { before: 6000 }, children: [] }),
    ...S.copyright.map((c) => small(c)),
  ];
}

function tocPage() {
  return [
    new Paragraph({ pageBreakBefore: true, spacing: { after: 300 }, children: [new TextRun({ text: S.contents, font: HEAD_FONT, size: 44, bold: true, color: C.navy })] }),
    new TableOfContents(S.contents, { hyperlink: true, headingStyleRange: "1-2" }),
  ];
}

// ---------- assemble ----------
const state = { refs: [], parts: [], chapters: 0, section: "FRONT", currentPart: null, partChapters: {} };
{
  let cur = null;
  for (const f of fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).sort()) {
    for (const l of fs.readFileSync(path.join(CONTENT_DIR, f), "utf8").split("\n")) {
      let m;
      if ((m = l.trim().match(/^PART\s+([IVXLC]+)\s*[—–-]/))) { cur = "PART " + m[1]; state.partChapters[cur] = []; }
      else if (/^(BACKMATTER|FRONTMATTER)/.test(l.trim())) cur = null;
      else if (cur && (m = l.trim().match(/^##\s+(\d+)\.\s*(.+)$/))) state.partChapters[cur].push([m[1], m[2]]);
    }
  }
}
const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).sort();
let main = [];
let back = [];
for (const f of files) {
  const txt = fs.readFileSync(path.join(CONTENT_DIR, f), "utf8");
  const els = parseFile(txt, state);
  main.push(...els);
}
// Insert references before "About the Author" if present
const aboutIdx = main.findIndex((p) => p && p.__refs);
if (aboutIdx >= 0) main.splice(aboutIdx, 1);
const refEls = refsSection(state.refs);
if (aboutIdx > 0) main.splice(aboutIdx, 0, ...refEls); else main.push(...refEls);

const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: S.header, font: HEAD_FONT, size: 16, color: "999999" })] })] });
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font: HEAD_FONT, size: 18, color: C.grey })] })] });
const page = { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN, header: 700, footer: 700 } };

const doc = new Document({
  creator: "Kura — AKURA Endurance Research System",
  title: "AKURA World Athlete Research Book — The AKURA Endurance Index (AEI)",
  description: "Complete English Edition, Prototype Edition 0.1 (2026)",
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: BODY_FONT, size: 22, color: C.ink } } },
    paragraphStyles: [
      { id: "TOC1", name: "toc 1", basedOn: "Normal", next: "Normal", run: { font: BODY_FONT, size: 21, bold: true, color: C.navy }, paragraph: { spacing: { before: 120, after: 40 } } },
      { id: "TOC2", name: "toc 2", basedOn: "Normal", next: "Normal", run: { font: BODY_FONT, size: 20 }, paragraph: { spacing: { after: 20 }, indent: { left: 360 } } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: HEAD_FONT, size: 48, bold: true, color: C.navy }, paragraph: { spacing: { before: 240, after: 280 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: HEAD_FONT, size: 38, bold: true, color: C.navy }, paragraph: { spacing: { before: 60, after: 80 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: HEAD_FONT, size: 26, bold: true, color: C.teal }, paragraph: { spacing: { before: 300, after: 120 }, keepNext: true, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ] },
  sections: [
    { properties: { page }, children: [...cover()] },
    { properties: { page }, headers: { default: header }, footers: { default: footer }, children: [...copyright(), ...tocPage(), ...main] },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log(`Wrote ${OUT}: ${state.parts.length} parts, ${state.chapters} chapters, ${new Set(state.refs).size} refs`);
});
