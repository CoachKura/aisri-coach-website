# Generates the book's diagrams (PNG) and figures.json (chapter -> figure + caption).
import json, os, math
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Circle, FancyArrowPatch, Wedge, Rectangle

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "figures")
os.makedirs(OUT, exist_ok=True)
NAVY, TEAL, SAFF, GREY, RED, LIGHT = "#0B2545", "#13807A", "#D9731A", "#6B7280", "#B23A3A", "#F3F6F9"
TEAL_L, SAFF_L, NAVY_L = "#E6F4F2", "#FDF1E6", "#E8EDF4"
plt.rcParams.update({
    "font.family": "DejaVu Sans", "font.size": 10, "axes.edgecolor": "#9CA3AF", "axes.labelcolor": NAVY,
    "xtick.color": GREY, "ytick.color": GREY, "axes.spines.top": False, "axes.spines.right": False,
    "axes.titleweight": "bold", "axes.titlecolor": NAVY, "axes.titlesize": 11,
})
FIGS = {}

def save(fig, name, chapter, caption):
    path = os.path.join(OUT, name + ".png")
    fig.savefig(path, dpi=200, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    FIGS.setdefault(str(chapter), []).append({"file": name + ".png", "caption": caption})

def canvas(w=7.0, h=3.2):
    fig, ax = plt.subplots(figsize=(w, h)); ax.set_xlim(0, 100); ax.set_ylim(0, 100 * h / w); ax.axis("off"); return fig, ax

def box(ax, x, y, w, h, text, fc=NAVY_L, ec=NAVY, tc=NAVY, fs=9, bold=False, r=2.0):
    ax.add_patch(FancyBboxPatch((x - w / 2, y - h / 2), w, h, boxstyle=f"round,pad=0.3,rounding_size={r}", fc=fc, ec=ec, lw=1.4))
    ax.text(x, y, text, ha="center", va="center", color=tc, fontsize=fs, fontweight="bold" if bold else "normal", wrap=True)

def arrow(ax, x1, y1, x2, y2, c=GREY, rad=0.0, lw=1.6):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-|>", mutation_scale=13, color=c, lw=lw, connectionstyle=f"arc3,rad={rad}"))

def cycle(ax, labels, cx, cy, R, colors=None, fs=8.5, bw=17, bh=7.5, center=None):
    n = len(labels)
    pts = []
    for i, lab in enumerate(labels):
        a = math.pi / 2 - 2 * math.pi * i / n
        pts.append((cx + R * math.cos(a) * 1.35, cy + R * math.sin(a)))
    for i in range(n):
        x1, y1 = pts[i]; x2, y2 = pts[(i + 1) % n]
        dx, dy = x2 - x1, y2 - y1; d = math.hypot(dx, dy)
        sh = 0.36
        arrow(ax, x1 + dx * sh, y1 + dy * sh, x2 - dx * sh, y2 - dy * sh, c=SAFF, rad=-0.15)
    for i, (x, y) in enumerate(pts):
        c = (colors or [NAVY])[i % len(colors or [NAVY])]
        box(ax, x, y, bw, bh, labels[i], fc="white", ec=c, tc=c, fs=fs, bold=True)
    if center:
        ax.text(cx, cy, center, ha="center", va="center", fontsize=11, fontweight="bold", color=SAFF)

# 1 research chain
fig, ax = canvas(7, 3.6)
cycle(ax, ["Hypothesis", "Measurement", "Intervention", "Response", "Interpretation", "Revised\nprescription"], 50, 25, 17,
      colors=[NAVY, TEAL, SAFF], center="THE AKURA\nRESEARCH CHAIN")
save(fig, "f01_research_chain", 1, "The AKURA research chain. Every coaching belief becomes a testable hypothesis; the loop repeats for the athlete's entire career.")

# 2 performance web
fig, ax = canvas(7, 3.8)
cx, cy = 50, 27
ax.add_patch(Circle((cx, cy), 8.5, fc=SAFF, ec="none"))
ax.text(cx, cy, "Race\nperformance", ha="center", va="center", color="white", fontweight="bold", fontsize=9)
facs = ["VO₂max", "Oxygen\ndelivery", "Running\neconomy", "Lactate\nkinetics", "Fuel use", "Body\ncomposition",
        "Training\nhistory", "Recovery", "Psychology", "Environment", "Social\nfactors"]
for i, f in enumerate(facs):
    a = 2 * math.pi * i / len(facs) + 0.2
    x, y = cx + 38 * math.cos(a), cy + 20 * math.sin(a)
    ax.plot([cx + 9 * math.cos(a), x - 6 * math.cos(a)], [cy + 8.5 * math.sin(a), y - 3.5 * math.sin(a)], color="#C9D3DE", lw=1.2, zorder=0)
    box(ax, x, y, 13, 6.2, f, fc=[NAVY_L, TEAL_L][i % 2], ec=[NAVY, TEAL][i % 2], tc=NAVY, fs=7.5)
save(fig, "f02_performance_web", 2, "Elite endurance performance emerges from many interacting systems. No single factor, including birthplace or genetics, explains it alone.")

# 3 oxygen chain
fig, ax = canvas(7.2, 2.6)
steps = [("Air", "O₂ at 20.9%"), ("Lungs", "ventilation &\ngas exchange"), ("Blood", "haemoglobin\ncarries O₂"), ("Heart", "cardiac output\n= HR × SV"),
         ("Muscle", "capillaries\ndeliver O₂"), ("Mito-\nchondria", "aerobic ATP"), ("Movement", "economy turns\nenergy into speed")]
for i, (t, s) in enumerate(steps):
    x = 7 + i * 14.3
    c = [TEAL, TEAL, RED, RED, NAVY, NAVY, SAFF][i]
    ax.add_patch(FancyBboxPatch((x - 6, 17), 12, 12, boxstyle="round,pad=0.3,rounding_size=2", fc=c, ec="none"))
    ax.text(x, 23, t, ha="center", va="center", color="white", fontweight="bold", fontsize=7.6)
    ax.text(x, 9, s, ha="center", va="center", color=NAVY, fontsize=7.2)
    if i < len(steps) - 1: arrow(ax, x + 6.6, 23, x + 7.8, 23, c=GREY)
save(fig, "f03_oxygen_chain", 7, "The endurance chain. A limitation at any link can affect performance, but improving one link does not guarantee a faster race.")

# 4 cardiac output
fig, axs = plt.subplots(1, 2, figsize=(7, 2.9))
ath = ["Athlete X", "Athlete Y"]; hr = [160, 140]; sv = [110, 126]
co = [h * s / 1000 for h, s in zip(hr, sv)]
axs[0].bar(ath, hr, color=[NAVY, TEAL], width=0.55); axs[0].set_title("Heart rate (beats/min)"); axs[0].set_ylim(0, 190)
for i, v in enumerate(hr): axs[0].text(i, v + 4, str(v), ha="center", color=NAVY, fontweight="bold")
axs[1].bar(ath, sv, color=[NAVY, TEAL], width=0.55); axs[1].set_title("Stroke volume (mL/beat)"); axs[1].set_ylim(0, 150)
for i, v in enumerate(sv): axs[1].text(i, v + 3, str(v), ha="center", color=NAVY, fontweight="bold")
fig.suptitle(f"Same pace, similar cardiac output (~{co[0]:.1f} L/min), different heart rates", color=SAFF, fontweight="bold", fontsize=10.5)
fig.tight_layout()
save(fig, "f04_cardiac_output", 8, "Illustrative example: cardiac output = heart rate × stroke volume. A larger stroke volume lets Athlete Y deliver similar blood flow at a lower heart rate.")

# 5 concentration vs mass
fig, ax = canvas(7, 3.8)
sc = [("Baseline", 45, 55, "Hb conc: normal"), ("Plasma expansion\n(e.g. heat)", 45, 68, "Hb conc: ↓ LOWER\nHb mass: unchanged"),
      ("Red-cell increase\n(e.g. altitude)", 50, 55, "Hb conc: ↑ higher\nHb mass: ↑ HIGHER"), ("Dehydration", 45, 45, "Hb conc: ↑ HIGHER\nHb mass: unchanged")]
for i, (t, rc, pl, note) in enumerate(sc):
    x = 20 + i * 22
    scale = 0.3
    ax.add_patch(Rectangle((x - 5, 8), 10, rc * scale, fc=RED, ec="none"))
    ax.add_patch(Rectangle((x - 5, 8 + rc * scale), 10, pl * scale, fc="#F6D7A7", ec="none"))
    ax.add_patch(Rectangle((x - 5, 8), 10, (rc + pl) * scale, fc="none", ec=NAVY, lw=1.2))
    ax.text(x, 52, t, ha="center", va="top", fontsize=7.4, fontweight="bold", color=NAVY)
    ax.text(x, 3.5, note, ha="center", va="center", fontsize=7, color=GREY)
ax.add_patch(Rectangle((2, 44), 3, 2.5, fc=RED)); ax.text(6, 45.2, "red cells", fontsize=7, va="center", color=NAVY)
ax.add_patch(Rectangle((2, 40), 3, 2.5, fc="#F6D7A7")); ax.text(6, 41.2, "plasma", fontsize=7, va="center", color=NAVY)
save(fig, "f05_conc_vs_mass", 10, "Schematic only: why haemoglobin concentration and haemoglobin mass can move in different directions. Concentration depends on plasma volume as well as red-cell mass.")

# 6 economy
fig, ax = plt.subplots(figsize=(7, 3.2))
sp = np.linspace(10, 18, 50)
ax.plot(sp, 3.3 * sp + 5, color=NAVY, lw=2.4, label="Runner A: less economical")
ax.plot(sp, 3.0 * sp + 3, color=TEAL, lw=2.4, label="Runner B: more economical")
ax.axhline(60, color=NAVY, ls="--", lw=1); ax.axhline(58, color=TEAL, ls="--", lw=1)
ax.text(10.1, 61, "A's VO₂max 60", color=NAVY, fontsize=8); ax.text(10.1, 55.5, "B's VO₂max 58", color=TEAL, fontsize=8)
ax.axvline(15, color=SAFF, lw=1); ax.text(14.9, 22, "race pace\n15 km/h", ha="right", color=SAFF, fontsize=8)
ax.set_xlabel("Running speed (km/h)"); ax.set_ylabel("Oxygen cost (mL/kg/min)"); ax.set_ylim(20, 66)
ax.legend(frameon=False, fontsize=8, loc="lower right"); ax.set_title("Lower oxygen cost at the same speed = more reserve")
save(fig, "f06_economy", 14, "Illustrative values. Runner B has the lower VO₂max but uses less oxygen at race pace, so runs at a smaller fraction of maximum and may race faster.")

# 7 lactate curve
fig, ax = plt.subplots(figsize=(7, 3.2))
s = np.linspace(10, 19, 100)
lac = 1.0 + 0.02 * np.exp(0.55 * (s - 10))
ax.plot(s, lac, color=RED, lw=2.6)
ax.fill_between(s, 0, 8, where=s < 14.2, color=TEAL_L); ax.fill_between(s, 0, 8, where=(s >= 14.2) & (s < 16.3), color=SAFF_L)
ax.fill_between(s, 0, 8, where=s >= 16.3, color="#FBEAEA")
ax.text(11.5, 6.5, "Steady\n(aerobic)", color=TEAL, fontweight="bold", fontsize=8.5, ha="center")
ax.text(15.2, 6.5, "Threshold\nzone", color=SAFF, fontweight="bold", fontsize=8.5, ha="center")
ax.text(17.7, 6.5, "Severe", color=RED, fontweight="bold", fontsize=8.5, ha="center")
ax.set_ylim(0, 8); ax.set_xlabel("Running speed (km/h)"); ax.set_ylabel("Blood lactate (mmol/L)")
ax.set_title("A typical lactate–speed curve (illustrative)")
save(fig, "f07_lactate_curve", 17, "As speed rises, blood lactate stays low, then accumulates increasingly quickly. Threshold is best treated as a zone, and its definition depends on the test protocol.")

# 8 fuel mix
fig, ax = plt.subplots(figsize=(7, 3.0))
inten = np.linspace(25, 95, 60)
carb = np.clip(15 + (inten - 25) * 1.2, 0, 100); fat = 100 - carb
ax.stackplot(inten, fat, carb, colors=[SAFF, NAVY], labels=["Fat", "Carbohydrate"], alpha=0.9)
ax.axvline(75, color="white", ls="--", lw=1.4); ax.text(75.5, 88, "typical marathon\nintensity range", color="white", fontsize=8)
ax.set_xlabel("Exercise intensity (% of VO₂max)"); ax.set_ylabel("Share of energy (%)"); ax.set_ylim(0, 100); ax.set_xlim(25, 95)
ax.legend(loc="lower left", frameon=False, fontsize=8, labelcolor="white"); ax.set_title("Fuel mix shifts towards carbohydrate as intensity rises (schematic)")
save(fig, "f08_fuel_mix", 18, "Schematic of the general pattern. Individual fuel use varies with training, diet, sex and duration, which is why marathon fuelling must be practised.")

# 9 heat HR drift
fig, ax = plt.subplots(figsize=(7, 3.1))
t = np.linspace(0, 60, 61)
ax.plot(t, 142 + 6 * (1 - np.exp(-t / 8)) + 0.08 * t, color=TEAL, lw=2.4, label="Cool morning (~22 °C)")
ax.plot(t, 146 + 8 * (1 - np.exp(-t / 8)) + 0.35 * t, color=RED, lw=2.4, label="Humid Chennai evening (~32 °C, high humidity)")
ax.set_xlabel("Minutes at the same steady pace"); ax.set_ylabel("Heart rate (beats/min)"); ax.set_ylim(135, 180)
ax.legend(frameon=False, fontsize=8, loc="upper left"); ax.set_title("Same pace, different day: heat raises and drifts heart rate (illustrative)")
save(fig, "f09_heat_drift", 19, "Illustrative example of cardiovascular drift. In the heat, blood is shared between muscle and skin and fluid is lost, so heart rate rises at the same pace.")

# 10 heat acclimation timeline
fig, ax = plt.subplots(figsize=(7, 2.9))
items = [("Heart rate at fixed workload falls", 3, 7, TEAL), ("Plasma volume expands", 3, 6, NAVY), ("Core temperature response improves", 5, 10, SAFF),
         ("Sweating earlier / more effective", 5, 14, RED), ("Exercise capacity in heat improves", 7, 14, GREY)]
for i, (lab, a, b, c) in enumerate(items):
    ax.barh(i, b - a, left=a, color=c, height=0.55); ax.text(b + 0.3, i, lab, va="center", fontsize=8, color=NAVY)
ax.set_yticks([]); ax.set_xlim(0, 24); ax.set_xlabel("Days of repeated heat exposure (approximate)"); ax.invert_yaxis()
ax.spines["left"].set_visible(False); ax.set_title("Heat acclimation: the usual order of adaptations (approximate)")
save(fig, "f10_heat_timeline", 20, "Approximate time course summarised from heat-acclimation reviews. Timing varies with protocol, humidity, fitness and individual response.")

# 11 altitude pressure
fig, ax = plt.subplots(figsize=(7, 3.3))
h = np.linspace(0, 3000, 100)
P = 760 * (1 - 2.25577e-5 * h) ** 5.25588
PiO2 = 0.2093 * (P - 47)
ax.plot(h, PiO2, color=NAVY, lw=2.6)
places = [("Chennai", 7), ("Bengaluru", 920), ("Kodaikanal", 2130), ("Ooty", 2240)]
for i, (n, e) in enumerate(places):
    p = 0.2093 * (760 * (1 - 2.25577e-5 * e) ** 5.25588 - 47)
    ax.scatter([e], [p], color=SAFF, zorder=5, s=40)
    off = {"Chennai": (80, 3), "Bengaluru": (80, 3), "Kodaikanal": (-900, -14), "Ooty": (120, 5)}[n]
    ax.annotate(f"{n}\n~{e} m · {p:.0f} mmHg", (e, p), xytext=(e + off[0], p + off[1]), fontsize=7.8, color=NAVY,
                arrowprops=dict(arrowstyle="-", color="#9CA3AF", lw=0.8))
ax.set_xlabel("Elevation (m)"); ax.set_ylabel("Inspired PO₂ (mmHg)"); ax.set_ylim(100, 160)
ax.set_title("Oxygen fraction stays ~20.9%, but the pressure of oxygen falls")
save(fig, "f11_altitude_po2", 24, "Approximate inspired oxygen pressure by elevation, calculated from the standard-atmosphere model (weather changes actual values). The Indian hill stations offer a moderate hypoxic stimulus.")

# 12 20.9% truth
fig, axs = plt.subplots(1, 2, figsize=(7, 2.9))
for ax, (t, p) in zip(axs, [("Sea level (Chennai)", 760), ("~2,200 m (Ooty)", 580)]):
    ax.pie([20.9, 79.1], colors=[TEAL, "#D5DEE8"], startangle=90, radius=p / 760, wedgeprops=dict(width=0.35 * p / 760, edgecolor="white"))
    ax.text(0, 0, "20.9%\nO₂", ha="center", va="center", fontsize=11, fontweight="bold", color=TEAL)
    ax.set_title(f"{t}\n≈ {p} mmHg total pressure", fontsize=9.5)
fig.suptitle("Same percentage, fewer molecules per breath", color=SAFF, fontweight="bold", y=1.08)
save(fig, "f12_209_truth", 25, "The ring size represents total air pressure. The oxygen fraction is unchanged at altitude; what falls is barometric pressure, and with it the partial pressure of oxygen.")

# 13 LHTL
fig, ax = canvas(7, 3.2)
ax.fill([5, 55, 105], [4, 42, 4], color=NAVY_L, ec=NAVY, lw=1.4)
ax.fill_between([0, 100], 0, 4, color="#E5E7EB")
box(ax, 55, 36, 30, 7, "LIVE HIGH  ~2,200 m\nsleep & rest in hypoxia", fc="white", ec=NAVY, tc=NAVY, fs=7.8, bold=True)
box(ax, 14, 9, 22, 7, "TRAIN LOW\nquality sessions", fc="white", ec=SAFF, tc=SAFF, fs=7.8, bold=True)
arrow(ax, 44, 33, 22, 14, c=SAFF, rad=0.25); arrow(ax, 26, 10, 46, 31, c=NAVY, rad=0.25)
ax.text(33, 26, "descend\nto train", color=SAFF, fontsize=7.5, ha="center"); ax.text(24, 23, "", fontsize=7)
ax.text(88, 34, "Aim: red-cell adaptation\nwithout losing\ntraining quality", fontsize=8, color=NAVY, ha="center")
save(fig, "f13_lhtl", 27, "Live high, train low: the athlete sleeps at altitude for the hypoxic stimulus and descends for high-quality training. Responses vary between athletes.")

# 14 heat vs altitude venn
fig, ax = canvas(7, 3.5)
ax.add_patch(Circle((36, 25), 21, fc=SAFF, alpha=0.18, ec=SAFF, lw=2)); ax.add_patch(Circle((64, 25), 21, fc=NAVY, alpha=0.14, ec=NAVY, lw=2))
ax.text(28, 44, "HEAT", color=SAFF, fontweight="bold", fontsize=12, ha="center"); ax.text(72, 44, "ALTITUDE", color=NAVY, fontweight="bold", fontsize=12, ha="center")
ax.text(26, 25, "Plasma volume ↑\nSweating earlier\nLower core temp\nThermal comfort", ha="center", va="center", fontsize=8.3, color=NAVY)
ax.text(74, 25, "EPO signalling ↑\nRed-cell mass ↑\n(with iron, time)\nVentilatory change", ha="center", va="center", fontsize=8.3, color=NAVY)
ax.text(50, 25, "Cardiovascular\nstress\nHR at fixed\nworkload\nNeed for\nrecovery", ha="center", va="center", fontsize=7.8, color=TEAL, fontweight="bold")
save(fig, "f14_heat_vs_altitude", 30, "Heat and altitude overlap in cardiovascular stress but have different primary adaptations. Define the target adaptation before choosing the environment.")

# 15 marathon fade
fig, ax = plt.subplots(figsize=(7, 3.1))
km = np.arange(5, 43, 5).tolist() + [42.2]
even = [4.25] * len(km)
pos = [4.10, 4.10, 4.12, 4.15, 4.22, 4.35, 4.55, 4.80, 4.95]
ax.plot(km, even, "-o", color=TEAL, lw=2.2, label="Even pacing")
ax.plot(km, pos, "-o", color=RED, lw=2.2, label="Fast start, late fade")
ax.axvspan(32, 42.2, color=SAFF_L); ax.text(33, 4.9, "The last 10 km", color=SAFF, fontweight="bold", fontsize=9)
ax.invert_yaxis(); ax.set_xlabel("Distance (km)"); ax.set_ylabel("Pace (min/km, decimal)")
ax.legend(frameon=False, fontsize=8, loc="lower left"); ax.set_title("Many marathons are lost in the first half (illustrative)")
save(fig, "f15_marathon_fade", 35, "Illustrative split profiles. A fast start raises carbohydrate use and heat load, and the cost appears in the final 10 km.")

# 16 distance-specific profile
fig, ax = plt.subplots(figsize=(7, 3.0))
d = ["5K", "10K", "Half", "Marathon"]; a = [92, 88, 80, 68]; b = [82, 82, 81, 80]
x = np.arange(4)
ax.bar(x - 0.18, a, 0.36, color=NAVY, label="Athlete A: speed-dominant"); ax.bar(x + 0.18, b, 0.36, color=TEAL, label="Athlete B: durable")
ax.set_xticks(x, d); ax.set_ylim(50, 100); ax.set_ylabel("Relative performance index")
ax.legend(frameon=False, fontsize=8); ax.set_title("Distance-specific expression (illustrative)")
save(fig, "f16_distance_profile", 36, "Illustrative only. The gap between short-distance and marathon expression shows where endurance breaks down, which one number would hide.")

# 17 AEI architecture
fig, ax = canvas(7.2, 3.6)
box(ax, 17, 39, 30, 9, "AEI-FITNESS\nWhat can the athlete do?", fc=NAVY, ec=NAVY, tc="white", fs=7.6, bold=True)
box(ax, 17, 14, 30, 9, "AEI-READINESS\nHow ready are they today?", fc=TEAL, ec=TEAL, tc="white", fs=7.6, bold=True)
ax.text(17, 30.5, "race results · threshold · economy\nVO₂ tests · durability", ha="center", fontsize=7, color=NAVY)
ax.text(17, 4.8, "sleep · HRV trend · resting HR\nfatigue · load · heat", ha="center", fontsize=7, color=TEAL)
box(ax, 52, 27, 18, 10, "Training\nprescription", fc=SAFF, ec=SAFF, tc="white", fs=9, bold=True)
box(ax, 84, 27, 22, 10, "Session done +\nnew data", fc="white", ec=NAVY, tc=NAVY, fs=8.5, bold=True)
arrow(ax, 33, 38, 42.5, 30); arrow(ax, 33, 15, 42.5, 24); arrow(ax, 61.5, 27, 72.5, 27, c=SAFF)
arrow(ax, 84, 21, 20, 20.5, c=GREY, rad=-0.35); ax.text(60, 3, "updates AEI", color=GREY, fontsize=8, ha="center")
save(fig, "f17_aei_architecture", 39, "AEI architecture. Stable fitness and daily readiness are separate layers that together inform the prescription; every session feeds new data back.")

# 18 radar
fig = plt.figure(figsize=(6.2, 4.2)); ax = fig.add_subplot(111, polar=True)
dom = ["P Performance", "A Aerobic", "T Threshold", "E Economy", "O Oxygen", "C Cardio", "R Recovery", "H Heat", "X Altitude", "D Durability"]
v1 = [78, 85, 70, 72, 75, 70, 60, 55, 50, 58]; v2 = [74, 70, 78, 88, 68, 72, 75, 80, 45, 82]
ang = np.linspace(0, 2 * np.pi, len(dom), endpoint=False).tolist(); ang += ang[:1]
for v, c, l in [(v1, NAVY, "Athlete A"), (v2, SAFF, "Athlete B")]:
    vv = v + v[:1]; ax.plot(ang, vv, color=c, lw=2, label=l); ax.fill(ang, vv, color=c, alpha=0.12)
ax.set_xticks(ang[:-1], dom, fontsize=8, color=NAVY); ax.set_yticks([25, 50, 75], ["", "", ""]); ax.set_ylim(0, 100)
ax.spines["polar"].set_color("#C9D3DE"); ax.legend(loc="upper right", bbox_to_anchor=(1.3, 1.1), frameon=False, fontsize=8)
save(fig, "f18_aei_radar", 40, "Two illustrative AEI domain profiles. The shape, not a single total, tells the coach where to look. Values are invented and not validated scores.")

# 19 trend
fig, ax = plt.subplots(figsize=(7, 3.1))
rng = np.random.default_rng(3); days = np.arange(120)
base = 60 + 0.05 * days + 2 * np.sin(days / 9); daily = base + rng.normal(0, 3, 120); daily[70:76] -= 9
def roll(x, w): return np.convolve(x, np.ones(w) / w, mode="valid")
ax.plot(days, daily, color="#C9D3DE", lw=1, label="Daily value")
ax.plot(days[6:], roll(daily, 7), color=TEAL, lw=1.8, label="7-day"); ax.plot(days[27:], roll(daily, 28), color=NAVY, lw=2.2, label="28-day")
ax.axvspan(70, 76, color="#FBEAEA"); ax.text(70.5, 50, "illness", color=RED, fontsize=8)
ax.axvspan(30, 44, color=SAFF_L); ax.text(31, 50, "heat block", color=SAFF, fontsize=8)
ax.set_xlabel("Day"); ax.set_ylabel("Index value"); ax.legend(frameon=False, fontsize=8, ncol=3, loc="upper left")
ax.set_title("Trends with annotations tell the story (illustrative)")
save(fig, "f19_aei_trend", 43, "Rolling 7- and 28-day trends with annotations for interventions and illness make cause and effect visible. A single day's number hides this.")

# 20 WBGT
fig, ax = plt.subplots(figsize=(7, 2.3))
bands = [(10, 18, "#2E8B57", "Lower risk"), (18, 23, "#D4B000", "Caution"), (23, 28, SAFF, "High risk:\nmodify session"), (28, 34, RED, "Very high:\nconsider cancelling")]
for a, b, c, l in bands:
    ax.barh(0, b - a, left=a, color=c, height=0.6); ax.text((a + b) / 2, 0, l, ha="center", va="center", color="white", fontsize=8, fontweight="bold")
ax.set_yticks([]); ax.set_xlim(10, 34); ax.set_xlabel("WBGT (°C)"); ax.spines["left"].set_visible(False)
ax.set_title("Example WBGT risk bands: follow local sports-medicine guidance")
save(fig, "f20_wbgt", 51, "Example categories in the style of widely used athletic heat-safety flag systems. Local federation and medical guidelines take precedence.")

# 21 decoupling
fig, ax = plt.subplots(figsize=(7, 3.1))
t = np.linspace(0, 90, 91); pace = 12 - 0.004 * t; hr = 140 + 0.18 * t
ax.plot(t, hr, color=RED, lw=2.2, label="Heart rate"); ax.set_ylabel("Heart rate (bpm)", color=RED); ax.set_ylim(130, 165)
ax2 = ax.twinx(); ax2.plot(t, pace, color=NAVY, lw=2.2, label="Speed"); ax2.set_ylabel("Speed (km/h)", color=NAVY); ax2.set_ylim(10.5, 12.5)
ax2.spines["right"].set_visible(True)
ax.axvline(45, color=GREY, ls="--"); ax.text(12, 162, "1st half: speed/HR ratio", fontsize=8, color=NAVY); ax.text(53, 162, "2nd half: ratio falls", fontsize=8, color=NAVY)
ax.set_xlabel("Minutes"); ax.set_title("Pace–HR decoupling: speed holds while heart rate drifts up")
save(fig, "f21_decoupling", 52, "Illustrative long run. Decoupling (%) = (first-half speed:HR − second-half speed:HR) ÷ first-half ratio × 100. It is a signal to interpret, not a diagnosis.")

# 22 intensity domains
fig, ax = canvas(7, 3.4)
doms = [("Speed", RED, "sprints, strides"), ("Power", "#C0561A", "VO₂max intervals"), ("Threshold", SAFF, "controlled-hard"), ("Endurance", TEAL, "long runs, steady"),
        ("Aerobic", NAVY, "easy volume"), ("Recovery", GREY, "very easy, restorative")]
for i, (n, c, d) in enumerate(doms):
    w = 24 + i * 9; y = 42 - i * 7
    ax.add_patch(Rectangle((50 - w / 2, y - 3), w, 6, fc=c, ec="white"))
    ax.text(50, y, n, ha="center", va="center", color="white", fontweight="bold", fontsize=9)
    ax.text(50 + w / 2 + 1.5, y, d, va="center", fontsize=7.8, color=NAVY)
ax.text(0, 44, "harder,\nless volume", fontsize=8, color=RED); ax.text(0, 5, "easier,\nmost volume", fontsize=8, color=NAVY)
save(fig, "f22_intensity_domains", 55, "The six AKURA intensity domains. Most weekly volume sits at the base; harder domains are used in smaller, planned doses.")

# 23 3-3-1 week
fig, ax = canvas(7.2, 2.4)
wk = [("Mon", "Aerobic", NAVY), ("Tue", "Threshold", SAFF), ("Wed", "Aerobic +\nstrength", NAVY), ("Thu", "Recovery", GREY), ("Fri", "Aerobic", NAVY), ("Sat", "Long run", TEAL), ("Sun", "Reset", "#9CA3AF")]
for i, (d, s, c) in enumerate(wk):
    x = 7.5 + i * 14
    ax.add_patch(FancyBboxPatch((x - 6, 4), 12, 20, boxstyle="round,pad=0.3,rounding_size=1.5", fc=c, ec="none"))
    ax.text(x, 20, d, ha="center", color="white", fontweight="bold", fontsize=9); ax.text(x, 11, s, ha="center", va="center", color="white", fontsize=7.6)
ax.text(50, 30, "An illustrative 3–3–1 week (individualise every element)", ha="center", color=NAVY, fontweight="bold", fontsize=9.5)
save(fig, "f23_331_week", 56, "One possible reading of the 3–3–1 rhythm. The value lies in how load is distributed, not in the numbers themselves.")

# 24 confidence gauge
fig, ax = canvas(7, 2.8)
for i, (lab, c, crit) in enumerate([("LIMITED", RED, "old race · missing HR\nno recent tests"), ("MODERATE", SAFF, "recent race · partial\nrecovery data"), ("HIGH", TEAL, "recent race · complete HR\nrepeated lab tests")]):
    x = 18 + i * 32
    ax.add_patch(FancyBboxPatch((x - 13, 14), 26, 12, boxstyle="round,pad=0.3,rounding_size=2", fc=c, ec="none"))
    ax.text(x, 20, lab + "\nCONFIDENCE", ha="center", va="center", color="white", fontweight="bold", fontsize=8.5)
    ax.text(x, 7, crit, ha="center", va="center", fontsize=7.6, color=NAVY)
arrow(ax, 8, 32, 92, 32, c=GREY); ax.text(50, 34.5, "more complete, recent and standardised data →", ha="center", fontsize=8, color=GREY)
save(fig, "f24_confidence", 67, "Every AEI output carries a confidence tier. Confidence falls when critical data are old or missing: no data, no false precision.")

# 25 AEI + AISRi
fig, ax = canvas(7, 3.0)
ax.add_patch(Circle((32, 21), 17, fc=NAVY, alpha=0.9)); ax.add_patch(Circle((68, 21), 17, fc=TEAL, alpha=0.9))
ax.text(32, 25, "AEI", color="white", fontweight="bold", fontsize=16, ha="center"); ax.text(32, 16, "capacity & profile\nchanges over weeks", color="white", fontsize=8, ha="center")
ax.text(68, 25, "AISRi", color="white", fontweight="bold", fontsize=16, ha="center"); ax.text(68, 16, "today's readiness\nchanges daily", color="white", fontsize=8, ha="center")
arrow(ax, 49.5, 21, 50.5, 21, c=SAFF); ax.text(50, 3, "together → the right session today", ha="center", color=SAFF, fontweight="bold", fontsize=9)
save(fig, "f25_aei_aisri", 70, "Two questions, two layers: AEI describes what the athlete can do; AISRi advises what the athlete should do today.")

# 26 closed loop
fig, ax = canvas(7.2, 4.2)
cycle(ax, ["1 Intake", "2 Baseline", "3 AEI profile", "4 Prescription", "5 Execution", "6 Environment\n& recovery", "7 Readiness", "8 Adaptation\ndecision", "9 Retest", "10 AEI update"],
      50, 30, 22, colors=[NAVY, TEAL, SAFF], fs=7.2, bw=15, bh=6.8, center="CLOSED-LOOP\nCOACHING")
save(fig, "f26_closed_loop", 71, "The ten-step AKURA closed loop: a digital coaching system that behaves like a longitudinal research study, not a static plan.")

# 27 dashboard
fig, ax = canvas(7.2, 3.4)
ax.add_patch(FancyBboxPatch((2, 2), 96, 44, boxstyle="round,pad=0.3,rounding_size=2", fc=LIGHT, ec="#C9D3DE"))
for i, (q, v, c) in enumerate([("What can the\nathlete do?", "Fitness 78\n▲ 28-day", NAVY), ("How ready are\nthey today?", "Ready: modify\nsession", SAFF), ("What changed\nrecently?", "Heat block wk 2\nsleep ↓", TEAL)]):
    x = 18 + i * 32
    ax.add_patch(FancyBboxPatch((x - 13, 14), 26, 26, boxstyle="round,pad=0.3,rounding_size=2", fc="white", ec=c, lw=1.6))
    ax.text(x, 34, q, ha="center", va="center", fontsize=8.5, color=GREY); ax.text(x, 22, v, ha="center", va="center", fontsize=10, color=c, fontweight="bold")
ax.text(50, 7, "confidence: moderate  ·  raw data one click away  ·  coach notes", ha="center", fontsize=8, color=GREY)
save(fig, "f27_dashboard", 79, "Dashboard concept (mock-up): three questions answered at a glance, with confidence and raw data always visible.")

# 28 train measure understand adapt
fig, ax = canvas(7, 3.4)
cycle(ax, ["TRAIN", "MEASURE", "UNDERSTAND", "ADAPT"], 50, 24, 16, colors=[NAVY, TEAL, SAFF, RED], fs=10, bw=20, bh=8, center="the athlete")
save(fig, "f28_tmua", 83, "Train. Measure. Understand. Adapt. The cycle repeats for the athlete's entire career.")

# cover art
fig, ax = plt.subplots(figsize=(7, 3.0)); ax.set_xlim(0, 100); ax.set_ylim(0, 43); ax.axis("off")
ax.add_patch(Rectangle((0, 0), 100, 43, fc=NAVY))
xs = np.linspace(0, 100, 400)
ax.fill_between(xs, 0, 6 + 24 * np.exp(-((xs - 72) / 13) ** 2) + 14 * np.exp(-((xs - 52) / 9) ** 2), color="#133B63")
ax.fill_between(xs, 0, 3 + 2 * np.sin(xs / 5), color="#1C4D7A")
ecg = np.full_like(xs, 22.0)
for c in range(8, 100, 18):
    ecg += 12 * np.exp(-((xs - c) / 0.7) ** 2) - 5 * np.exp(-((xs - c - 1.4) / 0.6) ** 2) + 2.5 * np.exp(-((xs - c + 4) / 1.8) ** 2)
ax.plot(xs, ecg, color=SAFF, lw=2.4)
ax.text(3, 38, "CHENNAI  ·  SEA LEVEL", color="#9FB6CF", fontsize=8, fontweight="bold")
ax.text(97, 38, "OOTY  ·  ~2,240 m", color="#9FB6CF", fontsize=8, fontweight="bold", ha="right")
fig.savefig(os.path.join(OUT, "cover.png"), dpi=220, bbox_inches="tight", pad_inches=0, facecolor=NAVY); plt.close(fig)

json.dump(FIGS, open(os.path.join(OUT, "figures.json"), "w"), indent=1, ensure_ascii=False)
print(sum(len(v) for v in FIGS.values()), "figures")
