BACKMATTER

## Appendix A — AEI v0.1 Research Specification

AEI is proposed here as an original AKURA research framework. It is not presented as a validated replacement for VDOT, VO₂max testing, medical assessment or established performance models. The domains, fields and formula below are a research specification for prototype use only and require independent validation before any high-stakes application.

|Domain|Primary examples|Interpretation|Confidence|
|AEI-P Performance|5K/10K/HM/Marathon results|Current race expression|High when recent and standardised|
|AEI-A Aerobic|VO₂-related tests, submax HR-pace|Aerobic capacity|Protocol dependent|
|AEI-T Threshold|Lactate/threshold pace|Sustainable high intensity|Protocol dependent|
|AEI-E Economy|O₂ cost at fixed speed|Movement efficiency|Needs repeatability|
|AEI-O Oxygen|Hb mass, Hb concentration|O₂ transport context|Specialist testing for Hb mass|
|AEI-C Cardiovascular|HR, stroke-volume-related measures|Circulatory response|Context dependent|
|AEI-R Recovery|Sleep, HRV trend, RHR, fatigue|Today's expression capacity|Baseline dependent|
|AEI-H Heat|Heat exposure, thermal response|Heat adaptation|Environment must be logged|
|AEI-X Altitude|Sleeping altitude, Hb mass response|Hypoxic adaptation|Dose dependent|
|AEI-D Durability|Long-run degradation|Marathon-specific resilience|Needs standardised protocol|

### Proposed data fields

|Category|Fields|
|Identification|Athlete ID, Date/time, Device, Protocol version|
|Session and performance|Race/test type, Distance, Time, Pace|
|Physiological response|HR, RPE, HRV, RHR, Body mass|
|Environment|Temperature, Humidity/WBGT, Elevation|
|Recovery and wellness|Sleep, Fatigue, Soreness|
|Load and inputs|Training load, Fuel/hydration|
|Intervention|Intervention, Pre/post status|
|Quality and notes|Clinician/technician note, Data quality, Confidence|

### Calculation philosophy

- Do not assign arbitrary weights simply to produce a 0–100 score.
- Keep raw measurements permanently available.
- Normalise within athlete and, where appropriate, against a reference population.
- Use recent performance as the primary expression anchor.
- Separate Fitness from Readiness.
- Attach confidence and missing-data penalties.
- Validate every derived score prospectively before high-stakes use.

### Example research formula (prototype only)

A future AEI score could be modelled as a calibrated function rather than a hand-built average:

AEI = f(Performance, Economy, Threshold, Oxygen Transport, Cardiovascular Response, Durability, Recovery, Environment)

Here f is learned and validated from longitudinal athlete data, not chosen by hand. Until that validation exists, the components should be reported separately, each with its own raw data, date, method and confidence level.

## Appendix B — Athlete Research Worksheet

Use one worksheet per athlete per intervention. Record the baseline and post-intervention values under the same protocol, note the change, and add a confidence rating and short coach note in the final column.

|Field|Baseline|Post|Change|Confidence / Note|
|Race performance| | | | |
|Easy pace at fixed HR| | | | |
|Threshold marker| | | | |
|VO₂-related measure| | | | |
|Running economy| | | | |
|Hb / Hb mass| | | | |
|Resting HR| | | | |
|HRV trend| | | | |
|Sleep| | | | |
|Body mass| | | | |
|Heat exposure| | | | |
|Altitude exposure| | | | |
|Long-run durability| | | | |

## Appendix C — Heat Session Log Template

Complete one log for every heat session. Stop the session immediately if any heat-illness warning sign appears, begin cooling and seek emergency medical care.

|Field|Entry|
|Date and start time| |
|Location and surface| |
|Temperature / humidity / WBGT| |
|Session type (run, heated room, passive)| |
|Duration and target pace or intensity| |
|Average and peak HR| |
|RPE and thermal comfort (end)| |
|Body mass before / after| |
|Fluid intake| |
|Core or skin temperature (if measured)| |
|Symptoms or warning signs| |
|Supervisor and coach note| |

## Appendix D — Altitude Camp Log Template

Complete daily during any camp at Ooty, Kodaikanal or elsewhere. Report worsening headache, vomiting, breathlessness at rest or confusion to the medical lead immediately.

|Field|Entry|
|Date and camp day number| |
|Sleeping altitude| |
|Training altitude| |
|Hours at altitude| |
|Morning SpO₂ and resting HR| |
|Sleep duration and quality| |
|Session and training load| |
|RPE and HR at fixed pace| |
|Wellness and appetite| |
|Iron supplementation (as prescribed)| |
|Symptoms or warning signs| |
|Coach and clinician note| |

## Appendix E — Daily Readiness Check-in

A short morning check-in supports the AISRi readiness layer. It is a conversation starter, not a diagnosis; any concerning symptom should be discussed with the coach and, where needed, a clinician.

|Item|Scale|Notes|
|Sleep duration|Hours| |
|Sleep quality|1 (very poor) – 5 (excellent)| |
|Resting HR|beats per minute| |
|HRV (if available)|Device value; compare to trend| |
|Fatigue|1 (fresh) – 5 (exhausted)| |
|Muscle soreness|1 (none) – 5 (severe)| |
|Mood / stress|1 (very low) – 5 (very good)| |
|Illness symptoms|Yes / No| |
|Menstrual-cycle note (optional)|Free text| |
|Unusual context (travel, work, exams)|Free text| |

## Glossary

**AEI**: AKURA Endurance Index; a proposed research framework for organising endurance performance data into domains. Not yet validated.

**AISRi**: The AKURA daily readiness and training decision layer in the proposed coaching ecosystem.

**Cardiac output**: The volume of blood pumped by the heart per minute; the product of heart rate and stroke volume.

**Confidence interval**: A range of values, calculated from data, that expresses the uncertainty around an estimate such as a mean change.

**Decoupling**: The drift of heart rate relative to pace (or power) during prolonged steady exercise; often used as an informal marker of aerobic durability.

**Durability**: The ability to maintain performance and physiological characteristics as exercise duration and fatigue increase.

**EPO**: Erythropoietin; a hormone, produced mainly by the kidneys, involved in red-cell production.

**Erythropoiesis**: The production of new red blood cells, which can be stimulated by hypoxia.

**Ferritin**: A protein that stores iron; blood ferritin is commonly used as an indicator of iron stores and should be interpreted by a clinician.

**Fractional utilisation**: The percentage of VO₂max an athlete can sustain over a given duration or race distance.

**Glycogen**: The stored form of carbohydrate in muscle and liver; an important fuel in prolonged and high-intensity exercise.

**Haemoglobin mass**: The total mass of haemoglobin in the circulation; distinct from haemoglobin concentration.

**Heat acclimation vs acclimatisation**: Acclimation refers to adaptation produced by artificial or controlled heat exposure (for example a heated room); acclimatisation refers to adaptation produced by natural environmental exposure.

**HRV**: Heart-rate variability; a context-dependent autonomic and recovery signal best interpreted as a trend.

**Hypoxia**: A reduced availability of oxygen to the body or tissues, as occurs at altitude.

**Lactate threshold**: A workload region where lactate dynamics change markedly; its exact definition depends on the protocol used.

**Normalisation**: Expressing a value relative to a reference, such as the athlete's own baseline or a population range, so that different measures can be compared.

**Partial pressure**: The pressure exerted by one gas within a mixture. At altitude the oxygen fraction of air is unchanged, but the partial pressure of oxygen falls because total pressure falls.

**Plasma volume**: The volume of the liquid component of blood.

**RPE**: Rating of perceived exertion; the athlete's subjective rating of how hard an effort feels, on a defined scale.

**Running economy**: The oxygen (or energy) cost of running at a given submaximal speed.

**Smallest worthwhile change**: The smallest change in a measure that is considered practically meaningful for performance or health.

**Stroke volume**: The volume of blood ejected by the heart with each beat.

**Thermoregulation**: The body's processes for controlling core temperature, including sweating and changes in skin blood flow.

**Typical error**: The typical variation in a measurement when it is repeated under the same conditions; used to judge whether a change is real.

**VDOT**: An established running-performance and training framework based on current running ability.

**VO₂max**: Maximum oxygen uptake during severe or maximal exercise.

**WBGT**: Wet-bulb globe temperature; an environmental heat-stress index that combines temperature, humidity, radiant heat and air movement.

## Final Research Principles

1) Never confuse concentration with total mass.

2) Never confuse oxygen fraction with oxygen partial pressure.

3) Never confuse VO₂max with complete running ability.

4) Never confuse heat adaptation with altitude adaptation.

5) Never treat a single wearable metric as a diagnosis.

6) Never assign score weights without validation.

7) Always document the protocol.

8) Always separate current fitness from today's readiness.

9) Always allow the data to disagree with the hypothesis.

10) Always keep the athlete at the centre of the system.

These ten principles are the shortest possible summary of this book. They will outlast any particular version of AEI. Equations will be revised, devices will change and new research will overturn some of today's assumptions. What should remain is the habit of careful measurement, honest interpretation and respect for the individual athlete. If this edition helps even a few coaches ask better questions and test their beliefs more carefully, it will have done its work.

## About the Author

Kura is the founder of the AKURA Endurance Research System and the AISRi coaching ecosystem, based in Chennai, India. The work grows from years of practical involvement with endurance athletes training in South Indian heat and humidity, and from a conviction that Indian coaching can build its own evidence base rather than borrowing assumptions from elsewhere. This Prototype Edition 0.1 is offered as a starting framework for discussion, collaboration and validation with coaches, athletes, scientists and clinicians. Feedback, criticism and research partnerships are welcome.

REFS:

- Gore CJ, Sharpe K, Garvican-Lewis LA, et al. Altitude training and haemoglobin mass from the optimised carbon monoxide rebreathing method determined by a meta-analysis. British Journal of Sports Medicine. 2013;47(Suppl 1):i31–i39. PMID 24282204.
- Brown HA, et al. Quantifying Exercise Heat Acclimatisation in Athletes and Military Personnel: A Systematic Review and Meta-analysis. Sports Medicine. 2024. PMID 38051495.
- Benjamin CL, et al. Physiological Responses to Heat Acclimation: A Systematic Review and Meta-Analysis of Randomized Controlled Trials. Journal of Sports Science and Medicine. 2019. PMID 31191102.
- Solomon & Laye. The effect of post-exercise heat exposure (passive heat acclimation) on endurance exercise performance: a systematic review and meta-analysis. BMC Sports Science, Medicine and Rehabilitation. 2025. PMID 39762944.
- Levine BD, Stray-Gundersen J. "Living high-training low": effect of moderate-altitude acclimatization with low-altitude training on performance. Journal of Applied Physiology. 1997;83(1):102–112.
- Racinais S, et al. Consensus recommendations on training and competing in the heat. British Journal of Sports Medicine. 2015;49(18):1164–1173.
- Périard JD, Racinais S, Sawka MN. Adaptations and mechanisms of human heat acclimation: applications for competitive athletes and sports. Scandinavian Journal of Medicine & Science in Sports. 2015;25(Suppl 1):20–38.
- Hopkins WG. Measures of reliability in sports medicine and science. Sports Medicine. 2000;30(1):1–15.
- Joyner MJ, Coyle EF. Endurance exercise performance: the physiology of champions. Journal of Physiology. 2008;586(1):35–44.
- Maunder E, Seiler S, Mildenhall MJ, Kilding AE, Plews DJ. The importance of 'durability' in the physiological profiling of endurance athletes. Sports Medicine. 2021;51(8):1619–1628.
- Daniels J. Daniels' Running Formula. Human Kinetics (VDOT framework and training paces).
