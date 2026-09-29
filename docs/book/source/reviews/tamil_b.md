# tamil_b — Tamil proofread, Parts X–XVIII + back matter, strings, figure captions, diagram labels

Scope: content_ta 06, 07, 08, 09, 09b, 10 checked line by line against content/*.md (365/302/363/168/340/150 non-empty lines, all aligned), plus strings.json, figures_ta.json (checked against the captions in figures.py) and fig_labels_ta.py.

Automated checks: line alignment; markers (##, ###, KEY/COACH/FIELD/MYTH/QUOTE/CHECK/FIG/SOURCES/REFS, tables); pipe counts; " ; " and " || " separators; **bold**; FIG filenames; numbers on every line; untranslated lines; ratio of Tamil to English length (to catch omissions). All passed. The only difference in numbers is harmless (the Tamil adds "(Project 2:09)" in brackets). REFS and SOURCES are verbatim.

Overall quality is high: the Tamil is natural and faithful, and I found no omissions.

## Batch 1: 121 findings, already applied (see _applied_log.json and tamil_b_batch1_applied.json)
- consistency 90, tamil 17, grammar 9, spelling 3, style 2 (19 medium, 102 low)
- Athlete names unified: தொனக்கல்→தோனக்கல் கோபி; கவிதா ராவத்→ராவுத் (the old form clashed with Nitendra Singh Rawat); சிவ்நாத்→ஷிவ்நாத்; பிரீஜா→ப்ரீஜா; பெயின்ஸ்→பெய்ன்ஸ்; அதரே→அதாரே; அகில்லெஸ்→அகிலிஸ்; கட்வால்→கர்வால்
- 09b: numeral suffixes hyphenated (2015இல்→2015-இல், about 55); Latin-script "Colorado Springs" / "Simmons" put into Tamil script; டயமண்ட்→டைமண்ட்; ஸ்டீபிள்சேஸ்→ஸ்டீப்பிள்சேஸ் (08)
- Mistranslation: "That is exactly the point" had been rendered "அதுதான் சரியான கருத்து" ("the correct opinion"); now "அதுதான் இங்கே முக்கியமான விஷயம்" (08, and again in 09 in batch 2)
- Leftover English "Case Study B/E" changed to நிகழ்வு ஆய்வு B/E (07)
- Grammar fixes: suffix placed after the English bracket ("(running economy)-க்கு", "பேஸ் (pace)-இல்"); பயிற்சியாளரேவா?→பயிற்சியாளரேதானா?; வீரர்களை அழுத்தம்→வீரர்களுக்கு; முழுமையாக்க (round)→முழு எண்ணாக்க; missing sandhi (தவறாகப்)

## Batch 2 (this file, reviews/tamil_b.json): 27 findings, not yet applied
- consistency 18, tamil 5, grammar 3, style 1 (1 medium, 26 low)
- Diagram labels: Reset→மீட்டமைப்பு; Taper→டேப்பர்; Specific strength→குறிப்பிட்ட வலிமை; மூடிய-வளைய→மூடிய-சுழற்சி; heat block→வெப்பத் தொகுதி, and the dropped "(warm race)" restored; "தோற்கப்படுகின்றன" (ungrammatical)→இழக்கப்படுகின்றன; "Pace–HR decoupling" title translated
- Figure caption for f28 now matches the ch.83 title (பயிற்சி. அளவீடு. புரிதல். தகவமைப்பு.); f22 "தீவிரக் களங்கள்"→"தீவிரப் பிரிவுகள்" (glossary)
- 09b: St Moritz into Tamil script; இருதய→இதய; compound nouns fixed (உயரக்/வெப்பக் களம்); Athletics Integrity Unit→தடகள நேர்மைப் பிரிவு; கிராஸ் கண்ட்ரி→கன்ட்ரி
- 10: glossary "பிரிவு நகர்வு (Decoupling)"→விலகல்; 08 WBGT term aligned with 03/05/10

Not changed (acceptable variants, noted only): நொடி and விநாடி are both used for "second"; 09b uses இராணுவ while other files use ராணுவ; there are three different words for cadence in ch.72; ch.05 renders decoupling as "பிரிவு".
