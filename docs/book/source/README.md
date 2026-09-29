# AKURA World Athlete Research Book — source

- `content/*.md` — book text in the simple line format described in `FORMAT.md` (one file per group of Parts).
- `toolkit.py` — computes the AKURA pace and race-equivalence charts and writes Part XVII (`content/09_part17_toolkit.md`).
- `figures.py` — draws the diagrams into `figures/` (needs `pip install matplotlib numpy`).
- `build.js` — typesets the content into the `.docx` (needs `npm install docx`).
- `topdf.py` — opens the `.docx` in LibreOffice, updates the table of contents and exports the PDF.

```bash
cd docs/book/source
npm install docx
python3 toolkit.py
python3 figures.py
node build.js ../AKURA_World_Athlete_Research_Book_Complete_Edition.docx
python3 topdf.py ../AKURA_World_Athlete_Research_Book_Complete_Edition.docx ../AKURA_World_Athlete_Research_Book_Complete_Edition.pdf
```

## Tamil edition

- `content_ta/` — Tamil translation (same line format), plus `strings.json` (labels, cover, copyright) and `figures_ta.json` (figure captions).
- `TAMIL_GUIDE.md` — terminology and style guide used for the translation.

```bash
# Word file (Nirmala UI, built into Windows)
BOOK_LANG=ta node build.js ../AKURA_World_Athlete_Research_Book_Tamil_Edition.docx
# PDF (Noto Serif/Sans Tamil fonts)
BOOK_LANG=ta TA_BODY_FONT="Noto Serif Tamil" TA_HEAD_FONT="Noto Sans Tamil" node build.js ta_pdf.docx
python3 topdf.py ta_pdf.docx ../AKURA_World_Athlete_Research_Book_Tamil_Edition.pdf
```

## Story layer and India analysis

- `STORY_GUIDE.md` — style and truth rules for the narrative ("Born to Run"-style) story chapters.
- `research/` — sourced dossiers on Indian elite men, women and the Indian endurance system (every fact with a URL), plus `chart_data.json` for the Part XVIII charts.
- Story chapters are written as `## STORY: <title>` and end with a `SOURCES:` line.

## Tamil diagrams

Tamil labels (`fig_labels_ta.py`) are drawn as SVG text and rendered by Chromium so Tamil script is shaped correctly:

```bash
FIG_LANG=ta FIG_OUT=figures_ta_svg python3 figures.py
NODE_PATH=$(npm root -g) node render_svg.js figures_ta_svg figures_ta
```

## Infographics, review team and author photo

- `infographics/spec.json` — one infographic per Part (English + Tamil); render with `NODE_PATH=$(npm root -g) node render_infographics.js`.
- `reviews/` — findings from the eight review agents (facts, science ×2, copyright, English proofreading ×2, Tamil ×2); `apply_reviews.py` applies them (idempotent). See `../REVIEW_REPORT.md`.
- Author photo: `python3 make_author.py <photo.jpg>` writes `author/author_circle.png`; the build places it on the About the Author page automatically.
