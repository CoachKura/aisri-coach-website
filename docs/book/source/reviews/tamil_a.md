# tamil_a — Tamil language review (files 01–05)

Scope: content_ta/01_front_part1.md, 02_part2.md, 03_part3_5.md, 04_part6_7.md, 05_part8_9.md, read line by line against content/ (1,650 aligned non-blank lines).

Automated checks (all passed): the marker sequence matches English on every line; numbers, times and records match (no mismatches); SOURCES/REFS are verbatim; FIG, FIELD ` ; ` counts, MYTH ` || `, table cell counts and `**` are intact; no leftover English sentences outside REFS. Tamil tables have blank lines between rows, but build.js drops those blank lines, so this is fine.

Overall quality: high. The Tamil is natural, faithful and uses the glossary. 50 findings in reviews/tamil_a.json: 2 high, 13 medium, 35 low.
- tamil 21, consistency 18, grammar 7, style 3, science 1.

Top issues:
1. HIGH – 02: 'lactate shuttle' is translated as விண்கலம் (spacecraft) in the heading and in the body. Changed to இடைக்கடத்தி / இடைக்கடத்தல்.
2. MEDIUM – 05: 'efficiency' is translated as செயல்திறன், which the whole book uses for 'performance'. This affects aerobic efficiency, efficiency indicators and the decoupling 'efficiency ratio'. Replaced with வினைத்திறன் (efficiency) in 10 places.
3. MEDIUM – meaning slips: 'more than three minutes short' / '52 seconds short' written as குறைவு, which reads as faster (01, 03); 'almost always' reduced to 'always' (02); 'veins' written as நரம்புகள் (nerves) (02); 'drink station' written as நீர் நிலையம் (reservoir) (04).
4. The same things are spelled differently across files (null notes with suggestions):
   - steeplechase: ஸ்டீப்பிள்சேஸ் vs ஸ்டீபிள்சேஸ்
   - Delhi: டெல்லி vs தில்லி
   - Diamond: டயமண்ட் vs டைமண்ட்
   - second: விநாடி vs வினாடி
   - adaptation: தழுவல் vs தகவமைப்பு
   - relative humidity: ஒப்பு vs சார்பு ஈரப்பதம்
   - names: Vally, Kwizera, Iklauta, Surinder/Surendra Bhandari (the English source is inconsistent too)
5. 03 uses bare English 'pace' about 46 times, where the other files use பேஸ். Flagged for a file-wide pass.
6. Minor sandhi and grammar: பயிற்சிப் பரிந்துரை; transitive/intransitive தகவமை-; 'Part'/'Chapter' left in English in 04.
