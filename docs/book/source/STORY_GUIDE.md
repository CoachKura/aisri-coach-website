# Story-layer guide ("Born to Run" style) — AKURA book

The author wants the book to read like Christopher McDougall's *Born to Run*: a gripping narrative that pulls
the reader through the science. We keep every science chapter, and add story.

## Voice
- Vivid, cinematic, fast. Present-tense scene openings are welcome ("It is 5:10 a.m. on Marina Beach...").
- Short punchy sentences mixed with longer ones. Curiosity, tension, surprise, humour, wonder.
- Questions that pull the reader forward. Each story ends by handing the reader to the science ("To understand
  why, we need to look inside the heart itself.").
- Indian texture: places, weather, food, trains, Army barracks, village roads, monsoon, Nilgiri mist, Chennai heat.
- Original prose only. Do not imitate or quote *Born to Run* text.

## Truth rules (non-negotiable)
- Real people: use ONLY facts in the research dossiers (research/indian_elite_men.md, research/indian_elite_women.md,
  research/indian_system.md). Never invent dialogue, thoughts, feelings, private scenes or details about real people.
  Direct quotes ONLY if copied exactly from the dossier with its source.
- Do not use facts marked UNVERIFIED or CONFLICT, or Wikipedia-only facts, as certainties (either omit or say "reported").
- Scene-setting of PLACES and GENERAL conditions (the heat of a Chennai morning, mist over Ooty) is fine.
- Imagined scenes are allowed only with anonymous, clearly generic people ("a club runner", "a school coach in
  Pudukkottai"), never presented as a specific real person.
- Doping: mention only sustained, documented cases where directly relevant, neutrally. Do NOT mention pending cases.
- Never stereotype by ethnicity, caste, region or nationality.
- Every STORY ends with a `SOURCES:` line listing the main URLs used (from the dossiers), separated by " ; ".

## Format (a parser reads this — see FORMAT.md)
- Story chapter: a line `## STORY: <title>` placed immediately AFTER the Part's `PARTINTRO:` line (blank line between).
  Then body paragraphs (one per line), optional `### ` subheads, optional `QUOTE:` (only real sourced quotes, format
  `QUOTE: text — Name`), then `SOURCES: url ; url ; ...`. No KEY/COACH/CHECK boxes in stories. 1,200–1,800 words.
- Chapter-opening hooks: for every numbered chapter (`## N. Title`) in your file, REPLACE the first body paragraph
  after the heading with a narrative hook paragraph of 110–190 words (a scene, a real documented moment from the
  dossiers, or a generic Indian scene) that leads into the chapter's point, then keep the original first paragraph's
  information as the second paragraph (lightly edited so it flows). Do not change anything else in the chapter
  except factual corrections below.
- Factual corrections: if any existing sentence in your file contradicts the dossiers (e.g. a national record, a
  coach's dates), correct it minimally.
