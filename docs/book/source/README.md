# AKURA World Athlete Research Book — source

- `content/*.md` — book text in the simple line format described in `FORMAT.md` (one file per group of Parts).
- `figures.py` — draws the diagrams into `figures/` (needs `pip install matplotlib numpy`).
- `build.js` — typesets the content into the `.docx` (needs `npm install docx`).
- `topdf.py` — opens the `.docx` in LibreOffice, updates the table of contents and exports the PDF.

```bash
cd docs/book/source
npm install docx
python3 figures.py
node build.js ../AKURA_World_Athlete_Research_Book_Complete_Edition.docx
python3 topdf.py ../AKURA_World_Athlete_Research_Book_Complete_Edition.docx ../AKURA_World_Athlete_Research_Book_Complete_Edition.pdf
```
