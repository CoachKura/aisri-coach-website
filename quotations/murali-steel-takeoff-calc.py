#!/usr/bin/env python3
"""
Steel (TMT rod) take-off / Bar Bending Schedule summary
Project : ID-1369  Mr. Murali / Mr. Sathyamoorthi
Drawings: DEEPSPACE 1369-01 .. 1369-13  (rev 01, 2026-09-07)
Steel   : Fe550 TMT (ARS), standard stock length 12 m

All source data below is transcribed from the drawing schedules.
Every ASSUMPTION is tagged  # >>ASSUMPTION<<  and collected at the end.
"""

FT = 0.3048                      # m per foot
IN = 0.0254                      # m per inch
ROD = 12.0                       # m  - ARS TMT stock length
def kgm(d): return d*d/162.0     # kg per m for dia d (mm)

# ---------------------------------------------------------------- assumptions
LAP        = 57                  # x dia, tension lap  (drawing note 5)
COV_COL    = 0.040               # m  (drawing note 4)
COV_BEAM   = 0.025
COV_FTG    = 0.050
WASTAGE    = 0.03                # >>ASSUMPTION<< 3% cutting waste

# storey heights  >>ASSUMPTION<< - NOT given anywhere in the drawing set
H_FTG_TO_PLINTH = 8.5*FT         # footing top -> plinth beam top
H_GF            = 10.0*FT        # plinth -> GF roof   (FFL to FFL)
H_FF            = 10.0*FT        # GF roof -> FF roof (terrace)
H_STUB          = 9.0*FT         # stub column C1 (footing top -> plinth)

rows = []   # (group, item, dia, total_length_m)
def add(group, item, dia, length_m, nos=1):
    rows.append((group, item, dia, length_m*nos))

# =============================================================== 1. COLUMNS
# schedule sheet 1369-03 : main bars + Y8 @ 8" c/c ties, "upto terrace floor"
COLS = {   # name : (nos, [(dia,count),...], b_m, d_m)
 'C1 stub 9"x9"'      : (2, [(12,4)],            9*IN,  9*IN),
 'C2 9"x1\'0"'        : (3, [(16,4),(12,2)],     9*IN, 12*IN),
 'C3 9"x1\'3"'        : (6, [(16,4),(12,4)],     9*IN, 15*IN),
 'C4 9"x1\'3"'        : (4, [(16,6),(12,2)],     9*IN, 15*IN),
}
TIE_SP = 8*IN

for name,(nos, bars, b, d) in COLS.items():
    stub = name.startswith('C1')
    H = H_FTG_TO_PLINTH + H_STUB*0 if stub else H_FTG_TO_PLINTH + H_GF + H_FF
    if stub: H = H_STUB
    for dia, cnt in bars:
        # vertical bar = height + footing L-bend (12d) + laps
        nlap = max(0, int(H // ROD))          # one lap per 12 m stock joint
        L = H + 12*dia/1000 + nlap*LAP*dia/1000
        add('1. COLUMNS', f'{name} main {dia}mm', dia, L, cnt*nos)
    # ties: perimeter + 2 hooks(10d each) ; n = H/spacing + 1
    per = 2*((b-2*COV_COL)+(d-2*COV_COL)) + 2*10*8/1000
    n   = int(H/TIE_SP)+1
    add('1. COLUMNS', f'{name} ties 8mm', 8, per, n*nos)

# =============================================================== 2. FOOTINGS
# schedule sheet 1369-03
FTGS = {  # name:(nos, L_ft, B_ft, D_ft, spacing_in)
 'F1 3\'6"x3\'6"x1\'0"' : (2, 3.5, 3.5, 1.0,  8),
 'F2 4\'6"x4\'0"x1\'3"' : (2, 4.5, 4.0, 1.25, 7),
 'F3 4\'9"x4\'0"x1\'6"' : (6, 4.75,4.0, 1.5,  6),
 'F4 5\'0"x4\'0"x1\'6"' : (3, 5.0, 4.0, 1.5,  5),
 'CF1 7\'3"x5\'0"x1\'6"': (1, 7.25,5.0, 1.5,  5),
}
for name,(nos,Lf,Bf,Df,sp) in FTGS.items():
    L,B,D,s = Lf*FT, Bf*FT, Df*FT, sp*IN
    bend = 2*(D-2*COV_FTG)                       # >>ASSUMPTION<< end bends up
    nL = int((L-2*COV_FTG)/s)+1                  # bars running long way
    nB = int((B-2*COV_FTG)/s)+1
    add('2. FOOTINGS', f'{name} long 10mm', 10, (L-2*COV_FTG)+bend, nB*nos)
    add('2. FOOTINGS', f'{name} short 10mm',10, (B-2*COV_FTG)+bend, nL*nos)

# =============================================================== 3. BEAMS
# sections: sheet 1369-07 (PB), 1369-10 (GFB), 1369-13 (FFB)
SEC = {  # mark : (b_in, d_in, [(dia,nos_top+bot straight)], curtail, stirrup_sp_in)
 'PB1': (9,12, [(12,3),(12,3)],           [], 8),
 'PB2': (9,12, [(12,2),(12,2)],           [(12,2)], 8),
 'PB3': (9,15, [(12,3),(12,3)],           [], 8),   # >>ASSUMPTION<< PB3 = PB1 bars, 1'3" deep
 'GFB1':(9,12, [(12,3),(12,3)],           [], 7),
 'GFB2':(9,15, [(16,2),(16,2)],           [(12,2)], 8),
 'GFB3':(9,15, [(16,3),(12,3)],           [], 8),
 'GFB4':(9,12, [(12,2),(12,2)],           [(12,2)], 7),
 'GFB5':(9,15, [(12,3),(12,3)],           [], 7),
 'FFB1':(9,12, [(12,3),(12,3)],           [], 7),
 'FFB2':(9,15, [(16,3),(12,3)],           [], 8),
 'FFB3':(9,15, [(16,2),(12,2)],           [(12,2)], 8),
 'FFB4':(9,12, [(16,2),(12,2)],           [(12,2)], 8),
 'CB1' :(9, 5, [(10,3)],                  [], 6),   # concealed beam, D assumed = slab
}

# beam runs measured off the layouts (grid: 1-2=4'11", 2-3=11'0", 3-4=11'0";
#                                    E-D=7'9", D-B=18'1.5", B-A=12'9")
PB_RUNS = [   # (mark, length_ft, nos)
 ('PB2',11.0,2), ('PB2',11.0,2),            # E and D lines, bays 2-3 & 3-4
 ('PB1',11.0,2),                            # C line + 4'0" offset beam, bay 3-4
 ('PB2',4.917,1), ('PB2',11.0,1),           # B line bays 1-2, 2-3
 ('PB3',15.917,1), ('PB3',11.0,1),          # A line bays 1-3, 3-4
 ('PB3',7.75,1), ('PB3',18.125,1),          # grid 2 vertical  E-D, D-B
 ('PB1',7.75,1), ('PB1',9.75,1), ('PB1',8.375,1), ('PB1',12.75,1),   # grid 3
 ('PB2',7.75,1), ('PB2',9.75,1), ('PB2',8.375,1), ('PB2',12.75,1),   # grid 4
 ('PB1',12.75,1),                           # grid 1  B-A
]
GFB_RUNS = [
 ('GFB2',11.0,4),                           # E & D lines, bays 2-3, 3-4
 ('GFB1',11.0,3),                           # 3 internal beams bay 3-4
 ('GFB3',4.917,1), ('GFB3',11.0,1),         # B line
 ('GFB3',15.917,1), ('GFB4',11.0,1),        # A line
 ('GFB2',7.75,1), ('GFB2',18.125,1), ('GFB2',12.75,1),   # grid 3 vertical
 ('GFB4',7.75,1), ('GFB2',18.125,1), ('GFB2',12.75,1),   # grid 4 vertical
 ('GFB4',12.75,1),                          # grid 1  B-A
 ('GFB3',25.875,1), ('GFB5',25.875,1),      # twin beams near grid 2, E-B
 ('CB1',2.5,2),                             # concealed beams, sunken area
]
FFB_RUNS = [   # first-floor roof beam layout, sheet 1369-11
 ('FFB2',11.0,4), ('FFB1',11.0,3),
 ('FFB3',4.917,1), ('FFB3',11.0,1),
 ('FFB3',15.917,1), ('FFB4',11.0,1),
 ('FFB2',7.75,1), ('FFB2',18.125,1), ('FFB2',12.75,1),
 ('FFB4',7.75,1), ('FFB2',18.125,1), ('FFB2',12.75,1),
 ('FFB4',12.75,1),
 ('FFB3',25.875,1), ('FFB3',25.875,1),
 ('CB1',2.5,2),
]
def do_beams(group, runs):
    for mark, Lft, nos in runs:
        b_in,d_in,bars,curt,sp = SEC[mark]
        L = Lft*FT
        b,d,s = b_in*IN, d_in*IN, sp*IN
        for dia,cnt in bars:
            nlap = max(0,int(L//ROD))
            bl = L + 2*(12*dia/1000) + nlap*LAP*dia/1000   # +12d hooks each end
            add(group, f'{mark} main {dia}mm', dia, bl, cnt*nos)
        for dia,cnt in curt:
            add(group, f'{mark} curtail {dia}mm', dia, 0.30*L, cnt*nos)  # 0.15L each end
        per = 2*((b-2*COV_BEAM)+(d-2*COV_BEAM)) + 2*10*8/1000
        n = int(L/s)+1
        add(group, f'{mark} stirrups 8mm', 8, per, n*nos)

do_beams('3. PLINTH BEAMS', PB_RUNS)
do_beams('4. GF ROOF BEAMS', GFB_RUNS)
do_beams('5. FF ROOF BEAMS', FFB_RUNS)

# =============================================================== 6. SLABS
# reinforcement legend (sheets 08/11/12): 1-10mm@7"c/c, 2-8mm@6"c/c, 3-10mm@8"c/c
# >>ASSUMPTION<< main 10mm@7" one way + distribution 8mm@6" other way,
#                plus 10mm@8" extra top over supports taken as 0.3 x area
SLAB_AREA_SF = {'GF roof slab':1014, 'FF roof slab':1014}   # title-block areas
for nm, sf in SLAB_AREA_SF.items():
    A = sf*FT*FT                      # m2
    side = A**0.5                     # equivalent square side
    n1 = side/(7*IN); n2 = side/(6*IN); n3 = side/(8*IN)
    add('6. SLABS', f'{nm} main 10mm@7"', 10, side*n1)
    add('6. SLABS', f'{nm} dist 8mm@6"',   8, side*n2)
    add('6. SLABS', f'{nm} extra-top 10mm@8"', 10, side*n3*0.30)

# =============================================================== 7. UG SUMP
# 4'6" x 10'0" x 8'0" internal = 10,000 L  (sheet 1369-02)
# walls: horiz Y10@6" + vert Y10@6" ; base Y10@6" ; cover slab Y10@4" bothways
sl,sb,sh = 10.0*FT, 4.5*FT, 8.0*FT
wall_per = 2*(sl+sb)
n_h = int(sh/(6*IN))+1
add('7. UG SUMP', 'wall horizontal 10mm@6"', 10, wall_per, n_h)
n_v = int(wall_per/(6*IN))+1
add('7. UG SUMP', 'wall vertical 10mm@6"',   10, sh+0.6, n_v)
add('7. UG SUMP', 'base 10mm@6" both ways',  10, (sl*int(sb/(6*IN))+sb*int(sl/(6*IN))))
add('7. UG SUMP', 'cover slab 10mm@4" b/w',  10, (sl*int(sb/(4*IN))+sb*int(sl/(4*IN))))
add('7. UG SUMP', 'opening extra 12mm',      12, 2.0, 4)

# =============================================================== summary
from collections import defaultdict
per_group = defaultdict(lambda: defaultdict(float))
per_dia   = defaultdict(float)
for g,i,d,l in rows:
    per_group[g][d] += l
    per_dia[d] += l

DIAS = [8,10,12,16]
print('='*78)
print('STEEL TAKE-OFF  |  Project ID-1369  |  Fe550 TMT (ARS)  |  12 m rods')
print('='*78)
hdr = f'{"ELEMENT":<20}' + ''.join(f'{str(d)+"mm":>13}' for d in DIAS) + f'{"kg":>10}'
print(hdr); print('-'*78)
gtot = defaultdict(float)
for g in sorted(per_group):
    line = f'{g:<20}'; kg=0
    for d in DIAS:
        L = per_group[g][d]; gtot[d]+=L
        w = L*kgm(d); kg+=w
        line += f'{(str(round(L))+"m" if L else "-"):>13}'
    print(line + f'{round(kg):>10}')
print('-'*78)
line = f'{"TOTAL LENGTH":<20}'
for d in DIAS: line += f'{str(round(gtot[d]))+"m":>13}'
tot_kg = sum(gtot[d]*kgm(d) for d in DIAS)
print(line + f'{round(tot_kg):>10}')

print()
print('='*78)
print('ROD COUNT  (12 m stock length, ARS TMT)')
print('='*78)
print(f'{"Dia":<8}{"Length (m)":>13}{"Rods (net)":>13}{"+3% waste":>13}{"Weight kg":>13}{"Bundles*":>10}')
print('-'*78)
import math
grand_kg=0; grand_rods=0
for d in DIAS:
    L = gtot[d]
    rods = L/ROD
    rods_w = math.ceil(rods*(1+WASTAGE))
    kg = rods_w*ROD*kgm(d)
    grand_kg += kg; grand_rods += rods_w
    print(f'{str(d)+"mm":<8}{round(L):>13}{math.ceil(rods):>13}{rods_w:>13}{round(kg):>13}{"":>10}')
print('-'*78)
print(f'{"TOTAL":<8}{round(sum(gtot.values())):>13}{"":>13}{grand_rods:>13}{round(grand_kg):>13}')
print()
print(f'  => {round(grand_kg/1000,2)} tonnes  ({grand_rods} nos of 12 m rods)')
print('='*78)

# ------------------------------------------------ detailed item-wise listing
print()
print('='*78)
print('ITEM-WISE DETAIL')
print('='*78)
det = defaultdict(lambda: defaultdict(float))
for g,i,d,l in rows: det[g][(i,d)] += l
for g in sorted(det):
    print(f'\n--- {g} ---')
    for (i,d),L in sorted(det[g].items()):
        print(f'   {i:<34}{round(L,1):>9} m {round(L*kgm(d),1):>9} kg {L/ROD:>7.1f} rods')

# sanity check
print()
BUA = 2028
print(f'SANITY: {round(tot_kg)} kg over {BUA} sqft built-up = {tot_kg/BUA:.2f} kg/sqft')
print('        (typical G+1 residential framed structure = 2.5 - 4.0 kg/sqft)')
