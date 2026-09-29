# Content format (strict — a parser reads this)
Write plain UTF-8 text. One element per line; separate elements with a blank line.

PART <roman> — <TITLE>          -> Part title (only first line of a part file section; exact existing part title)
PARTINTRO: <text>               -> 1 paragraph intro shown on the Part divider page (80-120 words)
## <n>. <Chapter title>         -> chapter heading (keep the exact number and title from the source TOC)
### <Subheading>                -> section heading inside a chapter
<plain paragraph text>          -> body paragraph (one paragraph per line, no hard wraps)
- <bullet text>                 -> bullet item (consecutive lines = one list)
1) <numbered text>              -> numbered item
|Header A|Header B|Header C|     -> table; first row is the header; consecutive rows; max 5 columns, short cell text
KEY: <text>                     -> "Key idea" shaded box (1-3 sentences)
COACH: <text>                   -> "Coach's corner" box – practical application (2-4 sentences)
FIELD: <text>                   -> "Field protocol" box – a concrete step-by-step test/session (use " ; " between steps)
MYTH: <myth> || <fact>          -> Myth vs evidence box
QUOTE: <quote> — <attribution>  -> pull quote (only use quotes from the source by Kura, or none)
CHECK: <text>                   -> end-of-chapter "Checkpoint" reflection question(s) for coach/athlete

Inline: **bold** allowed. No other markdown (no italics underscores, no links, no footnote markers). Subscripts: use Unicode (VO₂max, O₂).
