// Builds the complete AKURA book (.docx) from content/*.md files.
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, PageBreak, Header, Footer, PageNumber, TableOfContents,
  LevelFormat, VerticalAlign, TabStopType,
} = require("docx");

const OUT = process.argv[2] || "AKURA_World_Athlete_Research_Book_Complete_Edition.docx";
const CONTENT_DIR = process.env.CONTENT_DIR || path.join(__dirname, "content");

// ---------- design tokens ----------
const C = {
  navy: "0B2545", teal: "13807A", saffron: "D9731A", ink: "222222", grey: "666666",
  light: "F3F6F9", tealLight: "E6F4F2", saffronLight: "FDF1E6", navyLight: "E8EDF4", redLight: "FBEAEA", red: "B23A3A",
};
const BODY_FONT = "Georgia";
const HEAD_FONT = "Arial";
const PAGE_W = 11906, PAGE_H = 16838, MARGIN = 1440;
const CW = PAGE_W - 2 * MARGIN; // content width (DXA)

// ---------- inline parsing ----------
function runs(text, base = {}) {
  const out = [];
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
const body = (t) => new Paragraph({ children: runs(t), spacing: { after: 160, line: 312 }, alignment: AlignmentType.JUSTIFIED });

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
  // width proportional to content length, bounded
  const lens = Array.from({ length: ncol }, (_, i) => Math.max(...rows.map((r) => Math.min(60, (r[i] || "").length + 6))));
  const tot = lens.reduce((a, b) => a + b, 0);
  let widths = lens.map((l) => Math.max(1100, Math.round((CW * l) / tot)));
  const s = widths.reduce((a, b) => a + b, 0);
  widths = widths.map((w) => Math.floor((w * CW) / s));
  widths[widths.length - 1] += CW - widths.reduce((a, b) => a + b, 0);
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
          children: [new Paragraph({ spacing: { after: 0, line: 264 }, children: runs(cell.trim(), ri === 0
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
  const cs = tamil(q) ? { font: { ascii: BODY_FONT, hAnsi: BODY_FONT, cs: "Nirmala UI" } } : {};
  const out = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 80, line: 340 },
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: C.saffron, space: 10 } },
      children: [new TextRun({ text: q.trim(), italics: true, size: 28, color: C.navy, ...cs })] }),
  ];
  if (who) out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 280 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.saffron, space: 10 } },
    children: [new TextRun({ text: "— " + who.trim(), size: 20, color: C.saffron, bold: true, font: HEAD_FONT })] }));
  return out;
}

function partPage(label, title, intro) {
  const spacer = () => new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "", size: 40 })] });
  return [
    new Paragraph({ pageBreakBefore: true, children: [] }),
    ...Array.from({ length: 8 }, spacer),
    new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 360 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: C.saffron, space: 12 } },
      children: [new TextRun({ text: label + " — ", color: C.saffron }), new TextRun({ text: title })] }),
    ...(intro ? [new Paragraph({ spacing: { after: 200, line: 360 }, children: runs(intro, { size: 24, color: C.grey, italics: true }) })] : []),
  ];
}

// ---------- parse content ----------
function parseFile(txt, state) {
  const out = [];
  const lines = txt.replace(/\r/g, "").split("\n");
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
    if (line === "FRONTMATTER" || line === "BACKMATTER") { state.section = line; continue; }
    if ((m = line.match(/^PART\s+([IVXLC]+)\s*[—–-]\s*(.+)$/))) {
      flushPart(); endList();
      state.section = "PART";
      pendingPart = { label: "PART " + m[1], title: m[2].trim() };
      state.parts.push(pendingPart.label + " — " + pendingPart.title);
      state.currentPart = pendingPart.label + " — " + pendingPart.title;
      continue;
    }
    if ((m = line.match(/^PARTINTRO:\s*(.+)$/))) { if (pendingPart) { out.push(...partPage(pendingPart.label, pendingPart.title, m[1])); pendingPart = null; } continue; }
    flushPart();
    if ((m = line.match(/^##\s+(.+)$/)) && !line.startsWith("###")) {
      endList();
      const t = m[1].trim();
      const isFrontBack = state.section !== "PART";
      if (isFrontBack) {
        out.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun(t)] }));
      } else {
        const cm = t.match(/^(\d+)\.\s*(.+)$/);
        state.chapters++;
        out.push(new Paragraph({ pageBreakBefore: true, spacing: { before: 600, after: 0 }, children: [new TextRun({ text: cm ? "CHAPTER " + cm[1] : "", font: HEAD_FONT, size: 20, bold: true, color: C.saffron, characterSpacing: 40 })] }));
        out.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] }));
        out.push(new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: state.currentPart || "", font: HEAD_FONT, size: 17, color: C.grey })] }));
      }
      continue;
    }
    if ((m = line.match(/^###\s+(.+)$/))) { endList(); out.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(m[1].trim())] })); continue; }
    if ((m = line.match(/^[-*]\s+(.+)$/))) { if (listType !== "b") { listType = "b"; inst = ++listInstance; } out.push(listItem(m[1], false, inst)); continue; }
    if ((m = line.match(/^(\d+)[).]\s+(.+)$/))) { if (listType !== "n") { listType = "n"; inst = ++listInstance; } out.push(listItem(m[2], true, inst)); continue; }
    endList();
    if ((m = line.match(/^KEY:\s*(.+)$/))) { out.push(...box("Key idea", m[1], C.navyLight, C.navy)); continue; }
    if ((m = line.match(/^COACH:\s*(.+)$/))) { out.push(...box("Coach's corner", m[1], C.tealLight, C.teal)); continue; }
    if ((m = line.match(/^FIELD:\s*(.+)$/))) {
      const steps = m[1].split(/\s+;\s+/);
      out.push(...box("Field protocol", steps.length > 1 ? steps.map((s, i) => `${i + 1}. ${s.trim()}`) : steps, C.saffronLight, C.saffron));
      continue;
    }
    if ((m = line.match(/^MYTH:\s*(.+)$/))) {
      const [myth, fact] = m[1].split(/\s*\|\|\s*/);
      out.push(...box("Myth vs evidence", [`**Myth:** ${myth.trim()}`, `**Evidence:** ${(fact || "").trim()}`], C.redLight, C.red));
      continue;
    }
    if ((m = line.match(/^QUOTE:\s*(.+)$/))) { out.push(...quote(m[1])); continue; }
    if ((m = line.match(/^CHECK:\s*(.+)$/))) { out.push(...box("Checkpoint", m[1], C.light, C.grey)); continue; }
    out.push(body(line));
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
    new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun("References and Further Reading")] }),
    body("The sources below were used as starting points for the evidence discussed in this book. Readers should consult the original papers; inclusion here does not imply that the authors endorse the AKURA Endurance Index."),
    ...list.map((r) => new Paragraph({ spacing: { after: 100, line: 276 }, indent: { left: 360, hanging: 360 }, children: runs(r, { size: 19 }) })),
  ];
}

// ---------- cover & preliminaries ----------
function cover() {
  const t = (text, o = {}) => new TextRun({ text, font: HEAD_FONT, ...o });
  return [
    new Paragraph({ spacing: { before: 1200, after: 0 }, children: [t("AKURA", { size: 72, bold: true, color: C.saffron, characterSpacing: 200 })] }),
    new Paragraph({ spacing: { after: 600 }, border: { bottom: { style: BorderStyle.SINGLE, size: 24, color: C.saffron, space: 8 } }, children: [t("WORLD ATHLETE RESEARCH BOOK", { size: 30, bold: true, color: C.navy, characterSpacing: 60 })] }),
    new Paragraph({ spacing: { after: 200 }, children: [t("The AKURA Endurance Index™ (AEI)", { size: 56, bold: true, color: C.navy })] }),
    new Paragraph({ spacing: { after: 900 }, children: [t("From Myth to Measurement", { size: 40, color: C.teal, italics: true })] }),
    new Paragraph({ spacing: { after: 120 }, children: [t("MEASURE THE ATHLETE  •  UNDERSTAND THE BODY  •  BUILD THE PERFORMANCE", { size: 20, bold: true, color: C.grey, characterSpacing: 30 })] }),
    new Paragraph({ spacing: { after: 2600 }, children: [t("Complete English Edition  •  Indian Sports Context", { size: 22, color: C.grey })] }),
    new Paragraph({ spacing: { after: 60 }, children: [t("KURA", { size: 32, bold: true, color: C.navy, characterSpacing: 80 })] }),
    new Paragraph({ spacing: { after: 60 }, children: [t("AKURA Endurance Research System", { size: 22, color: C.navy })] }),
    new Paragraph({ children: [t("Prototype Edition 0.1  •  2026", { size: 20, color: C.grey })] }),
  ];
}

function copyright() {
  const small = (text, o = {}) => new Paragraph({ spacing: { after: 140, line: 288 }, children: runs(text, { size: 18, color: C.grey, font: HEAD_FONT, ...o }) });
  return [
    new Paragraph({ pageBreakBefore: true, spacing: { before: 6000 }, children: [] }),
    small("**AKURA World Athlete Research Book — The AKURA Endurance Index™ (AEI): From Myth to Measurement**"),
    small("Complete English Edition. Prototype Edition 0.1, 2026."),
    small("© 2026 Kura / AKURA Endurance Research System. All rights reserved. No part of this publication may be reproduced without the prior written permission of the author, except for brief quotations in reviews and academic work with attribution."),
    small("AKURA, AKURA Endurance Index™, AEI and AISRi are names used by the AKURA Endurance Research System. VDOT is associated with Jack Daniels and V.O2; it is referenced for educational comparison only. Garmin and Strava are trademarks of their respective owners."),
    small("**Important notice.** This book is an educational and research document. It is not medical advice. The AKURA Endurance Index is a proposed research framework that has not yet been validated; its equations and categories must not be used for high-stakes selection, medical or safety decisions. Blood testing, cardiac screening, hypoxic exposure and heat-acclimation interventions should be conducted only with appropriate medical oversight and, for research, with informed consent and ethics committee approval."),
    small("Chennai, Tamil Nadu, India."),
  ];
}

function tocPage() {
  return [
    new Paragraph({ pageBreakBefore: true, spacing: { after: 300 }, children: [new TextRun({ text: "Contents", font: HEAD_FONT, size: 44, bold: true, color: C.navy })] }),
    new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }),
  ];
}

// ---------- assemble ----------
const state = { refs: [], parts: [], chapters: 0, section: "FRONT", currentPart: null };
const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).sort();
let main = [];
let back = [];
for (const f of files) {
  const txt = fs.readFileSync(path.join(CONTENT_DIR, f), "utf8");
  const els = parseFile(txt, state);
  main.push(...els);
}
// Insert references before "About the Author" if present
const aboutIdx = main.findIndex((p) => p instanceof Paragraph && JSON.stringify(p).includes("About the Author"));
const refEls = refsSection(state.refs);
if (aboutIdx > 0) main.splice(aboutIdx, 0, ...refEls); else main.push(...refEls);

const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "AKURA World Athlete Research Book  •  The AKURA Endurance Index™", font: HEAD_FONT, size: 16, color: "999999" })] })] });
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
