# Review team guide — AKURA World Athlete Research Book

Book text lives in line-based files (one paragraph/element per line; format in FORMAT.md):
- English: SD/content/*.md   - Tamil: SD/content_ta/*.md (mirrors English line-for-line)
- Research dossiers (source of truth for facts about real Indian athletes): SD/research/*.md
- Style/truth rules: SD/STORY_GUIDE.md, SD/TAMIL_GUIDE.md
(SD = /tmp/claude-0/-home-user-aisri-coach-website/1a5ac2b9-95a3-5cfc-be11-af9ef5c72bc0/scratchpad)

## DO NOT edit the book files. Report fixes as JSON findings.
Write your findings to SD/reviews/<your-team-name>.json — a JSON list of objects:
  {"file": "02_part2.md", "lang": "en" | "ta",
   "old": "<exact substring copied from ONE line of the file, long enough to be unique in that file>",
   "new": "<replacement text for that substring>",
   "category": "spelling|grammar|style|science|fact|copyright|attribution|tamil|consistency|format",
   "severity": "high|medium|low",
   "note": "<one-line reason; for fact/science include the source URL or reference>"}
Rules for fixes:
- "old" must be copied exactly (same characters, including curly quotes/dashes) from a single line; never span lines.
- "new" must not contain a newline. Do not add or remove lines/paragraphs.
- Keep line markers intact (KEY:, COACH:, FIELD:, MYTH: ... || ..., CHECK:, QUOTE:, SOURCES:, FIG:, |table|cells|, ## , ###).
- Keep fixes minimal and surgical. Do not rewrite for taste; fix real errors, unclear sentences, inconsistencies and risks.
- If something is wrong but you cannot fix it confidently, add a finding with "new": null and explain in "note".
Also write a short human-readable summary to SD/reviews/<your-team-name>.md (what you checked, counts, top issues).
Validate your JSON with python3 (json.load) and check that each "old" occurs exactly once in its file before finishing.
