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
