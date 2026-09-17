# -*- coding: utf-8 -*-
"""Der Tyrannosaurus — neu gezeichnet.

WARUM NEU: an der alten Zeichnung stimmte fast nichts, was einen
Tyrannosaurus ausmacht. Der Schaedel war schmal und klein wie bei einem
Raubvogel (in Wirklichkeit ist er der massigste Kopf, den je ein
Landraubtier getragen hat), der Hals fehlte ganz, der Rumpf war eine
gleichmaessig dicke Roehre ohne Brustkorb, der Oberschenkel hing als
dunkle Platte neben dem Koerper, der Fuss hatte keine drei Zehen, und
der Bodenschatten war mit 81 Einheiten Halbachse mehr als doppelt so
breit wie das Tier hoch ist — ein grauer Nebel quer durchs Bild.

WAS JETZT STIMMT (Maszverhaeltnisse nach dem Skelett von „Sue",
Field Museum, FMNH PR2081):
  Gesamtlaenge 12,3 m          -> 162 Einheiten   (13,2 Einh. je Meter)
  Schaedellaenge 1,50 m        ->  28 Einheiten   (mit Unterkiefer)
  Schaedelhoehe hinten 0,90 m  ->  13 Einheiten
  Hueftgelenk ueber Boden      ->  36 Einheiten
  Oberschenkel : Schienbein : Mittelfuss = 1,32 : 1,17 : 0,72 m
  Schwanz laenger als Rumpf+Hals+Kopf zusammen — er ist das Gegengewicht,
  deshalb liegt die Wirbelsaeule waagerecht und nicht aufgerichtet.

BAUWEISE wie im uebrigen Bilderwerk: EIN geschlossener Umriss fuer
Kopf, Hals, Rumpf und Schwanz (keine sichtbaren Fugen), darauf ein
senkrechter Verlauf vom dunklen Ruecken zum hellen Bauch, darauf die
Modellierung (Brustkorb, Schulterblatt, Huefte), alles am Umriss
beschnitten. Die fernen Gliedmassen liegen dahinter und sind
abgedunkelt — daran erkennt das Auge die Tiefe.

Aufruf:  python3 werkzeug/bau-tyrannosaurus.py       (schreibt die Szene)
         python3 werkzeug/bau-tyrannosaurus.py -p    (nur ausgeben)
"""
import json, math, os, re, shutil, sys, datetime

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SZENE  = os.path.join(WURZEL, "szenen", "dinosaurier.js")
TEIL   = "tyrannosaurus"
P      = "tr"        # Namensvorsilbe fuer alle Kennungen in dieser Datei

# ---------------------------------------------------------------- Farben
FARBE = {
    "ruecken":  "#4d4130",
    "flanke":   "#8a7551",
    "bauch":    "#cbb894",
    "tief":     "#332b1e",
    "kontur":   "#2b2418",
    "zahn":     "#f4ecd8",
    "maul":     "#8f4c4c",
    "rachen":   "#5e2f31",
    "auge":     "#d9ad33",
    "kralle":   "#241d13",
    "licht":    "#e9dcbd",
}

def z(v):
    """Zahl kurz schreiben — spart in 170 Szenen viele Kilobyte."""
    s = "%.1f" % v
    return s[:-2] if s.endswith(".0") else s

def dunkler(hexfarbe, anteil):
    h = hexfarbe.lstrip("#")
    r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    return "#%02x%02x%02x" % (max(0, int(r*anteil)), max(0, int(g*anteil)), max(0, int(b*anteil)))

# ------------------------------------------------------- Kurven & Formen
def kurve(pkt, zu=True, spannung=0.5):
    """Catmull-Rom durch die Punkte, als kubische Bezierkurve ausgegeben.

    Von Hand geschriebene C-Befehle waren die Quelle des alten
    Pfadfehlers (ein C mit vier statt sechs Zahlen loeschte den ganzen
    Pfad). Hier kann das nicht mehr passieren.
    """
    n = len(pkt)
    if n < 3:
        return "M" + " L".join("%s %s" % (z(x), z(y)) for x, y in pkt)
    hol = (lambda i: pkt[i % n]) if zu else (lambda i: pkt[min(max(i, 0), n-1)])
    teile = ["M%s %s" % (z(pkt[0][0]), z(pkt[0][1]))]
    ende = n if zu else n - 1
    for i in range(ende):
        p0, p1, p2, p3 = hol(i-1), hol(i), hol(i+1), hol(i+2)
        c1 = (p1[0] + (p2[0]-p0[0])*spannung/3.0, p1[1] + (p2[1]-p0[1])*spannung/3.0)
        c2 = (p2[0] - (p3[0]-p1[0])*spannung/3.0, p2[1] - (p3[1]-p1[1])*spannung/3.0)
        teile.append("C%s %s %s %s %s %s" % (z(c1[0]), z(c1[1]), z(c2[0]), z(c2[1]),
                                             z(p2[0]), z(p2[1])))
    return " ".join(teile) + (" Z" if zu else "")

def schlauch(punkte, breiten):
    """Ein Glied als sich verjuengender Schlauch.

    ACHTUNG, alter Fehler: hier stehen HALBE Breiten. Wurden volle
    uebergeben, schlug sich das Polygon selbst und ergab eine Schleife
    weit ausserhalb des Beins.
    """
    links, rechts = [], []
    for i, (x, y) in enumerate(punkte):
        if i == 0:
            dx, dy = punkte[1][0]-x, punkte[1][1]-y
        elif i == len(punkte)-1:
            dx, dy = x-punkte[-2][0], y-punkte[-2][1]
        else:
            dx, dy = punkte[i+1][0]-punkte[i-1][0], punkte[i+1][1]-punkte[i-1][1]
        laenge = math.hypot(dx, dy) or 1.0
        nx, ny = -dy/laenge, dx/laenge
        b = breiten[i]
        links.append((x + nx*b, y + ny*b))
        rechts.append((x - nx*b, y - ny*b))
    return kurve(links + rechts[::-1], zu=True, spannung=0.35)

def drehe(punkte, winkel, um):
    """Punkte um einen Drehpunkt drehen — der Unterkiefer oeffnet sich so.
    Gerechnet wird in Python, NICHT als SVG-transform: ein transform
    verschoebe auch den Verlauf darunter (userSpaceOnUse), und der Kiefer
    bekaeme eine andere Stelle des Tonwertbogens als der Schaedel."""
    a = math.radians(winkel)
    co, si = math.cos(a), math.sin(a)
    ux, uy = um
    return [(ux + (x-ux)*co - (y-uy)*si, uy + (x-ux)*si + (y-uy)*co) for x, y in punkte]

# ------------------------------------------------------------ Landmarken
#  Blickrichtung nach LINKS, Boden bei y = 0, Kopf bei negativem x.
#  Der Schaedel ist das, was den Tyrannosaurus ausmacht: 1,50 m lang bei
#  12,3 m Gesamtlaenge, also fast ein Achtel des ganzen Tieres. In der
#  alten Zeichnung war er ein Zwoelftel — daher der Raubvogel-Eindruck.
HUEFTE   = (30.0, -34.0)     # Hueftgelenk (Acetabulum)
SCHULTER = (-12.0, -33.0)    # Schultergelenk (Glenoid)
KIEFER   = (-30.0, -41.0)    # Kiefergelenk (Quadratum) — Drehpunkt des Mauls

RUECKEN = [                              # Schaedeldach, Hals, Ruecken, Schwanz
    (-70.5, -46.5),   # Schnauzenspitze — die Praemaxilla steht fast senkrecht
    (-71.0, -50.0),
    (-69.6, -53.4),   # Praemaxillare oben
    (-64.0, -56.4),   # Nasenruecken
    (-54.0, -60.4),
    (-45.0, -63.4),   # Schaedeldach ueber der Augenhoehle
    (-36.0, -63.0),   # hoechster Punkt: der Schaedel ist tiefer als der Hals
    (-32.0, -58.0),   # Hinterhaupt — hier faellt der Umriss als STUFE ab
    (-26.0, -53.6),   # Nacken
    (-18.0, -50.0),
    (-8.0,  -47.4),   # Widerrist
    (5.0,   -47.0),   # Ruecken
    (18.0,  -47.4),
    (28.0,  -46.6),   # Darmbeinkamm
    (40.0,  -43.6),   # Schwanzwurzel
    (56.0,  -39.6),
    (72.0,  -37.0),
    (84.0,  -35.4),
    (92.0,  -34.2),   # Schwanzspitze, stumpf: der Schwanz ist ein Muskel,
]                     # kein Draht — er traegt das halbe Gewicht des Tieres
BAUCH = [                                # Schwanzunterseite, Bauch, Kehle
    (92.0, -32.6),
    (84.0, -31.4),
    (72.0, -30.4),
    (56.0, -30.4),
    (42.0, -29.4),    # Schwanzwurzel unten
    (34.0, -25.0),    # hinter dem Oberschenkel
    (26.0, -22.6),
    (14.0, -22.0),    # tiefster Punkt des Bauches
    (0.0,  -24.0),
    (-11.0, -29.6),   # Brust
    (-20.0, -34.6),   # Kehle
    (-26.0, -38.4),
    (-30.0, -41.0),   # Kiefergelenk
]
OBERKIEFER = [                           # Zahnreihe des Oberkiefers, nach vorn
    (-30.0, -41.0),
    (-40.0, -43.8),
    (-50.0, -45.0),
    (-60.0, -45.2),
    (-68.0, -45.8),
    (-70.5, -46.5),
]
UMRISS = RUECKEN + BAUCH[:-1] + OBERKIEFER[1:-1]

UNTERKIEFER = [                          # tiefes Dentale, geschlossen gedacht
    (-30.2, -40.4),
    (-40.0, -43.2),
    (-50.0, -44.4),
    (-60.0, -44.6),
    (-68.2, -45.2),
    (-70.8, -46.0),
    (-70.6, -53.4),
    (-60.0, -53.6),
    (-48.5, -52.0),
    (-36.0, -46.6),
]
MAULOEFFNUNG = 23.0                      # Grad

# Beine: Oberschenkel, Schienbein, Mittelfuss, Zehen. Der Oberschenkel
# ist der schwerste Muskel des Tieres (M. caudofemoralis) — er steckt
# zum groessten Teil IM Rumpfumriss, deshalb liegt sein oberes Ende
# ueber der Bauchlinie.
BEIN_GLIED = [
    ([(31.0, -38.5), (25.0, -30.0), (17.5, -21.2)], [10.2, 8.4, 5.0]),  # Femur
    ([(17.5, -21.2), (21.5, -16.0), (26.0, -11.0), (27.5, -7.0),
      (25.8, -4.0),  (24.0, -1.6)],
     [5.2, 4.2, 3.4, 3.0, 2.6, 2.3]),                        # Tibia + Mittelfuss
]
ZEHEN = [
    ([(24.0, -1.6), (16.5, -0.5), (9.0, 0.3)],   [2.2, 1.7, 1.0]),      # III, mittig
    ([(24.0, -1.6), (18.0, 0.4),  (12.0, 1.2)],  [1.9, 1.4, 0.9]),      # II, innen
    ([(24.0, -1.6), (19.5, -0.4), (14.0, -1.0)], [1.8, 1.3, 0.8]),      # IV, aussen
]
# Das ferne Bein steht nicht daneben, sondern NACHGESTELLT: das Tier
# geht. Ein zweites Bein an derselben Stelle waere nur ein Schatten des
# ersten und das Tier stuende wie ein Brett.
FERN_GLIED = [
    ([(33.0, -38.5), (34.0, -30.0), (33.0, -22.5)], [9.6, 8.0, 4.8]),
    ([(33.0, -22.5), (37.0, -17.0), (41.5, -11.5), (44.0, -7.5),
      (44.5, -4.0),  (44.0, -1.8)], [5.0, 4.0, 3.2, 2.9, 2.5, 2.2]),
]
FERN_ZEHEN = [
    ([(44.0, -1.8), (37.5, -0.7), (31.0, 0.2)],  [2.1, 1.6, 1.0]),
    ([(44.0, -1.8), (39.0, 0.3),  (34.0, 1.0)],  [1.8, 1.3, 0.8]),
]

# Die Arme sind winzig: knapp 1 m an einem 12 m langen Tier. Sie haengen
# nicht herab, sondern liegen angewinkelt unter der Kehle.
ARM_GLIED = [
    ([(-12.0, -33.0), (-7.6, -30.2), (-10.4, -27.4)], [2.2, 1.8, 1.4]),
]
FINGER = [
    ([(-10.4, -27.4), (-14.0, -26.6), (-17.0, -26.2)], [1.1, 0.8, 0.5]),
    ([(-10.4, -27.4), (-13.6, -28.4), (-16.2, -29.2)], [1.0, 0.75, 0.45]),
]

# ------------------------------------------------------------- Bausteine
def verlauf_koerper():
    return ('<linearGradient id="%sk" x1="0" y1="-58" x2="0" y2="-20" '
            'gradientUnits="userSpaceOnUse">'
            '<stop offset="0" stop-color="%s"/>'
            '<stop offset="0.42" stop-color="%s"/>'
            '<stop offset="1" stop-color="%s"/></linearGradient>'
            % (P, FARBE["ruecken"], FARBE["flanke"], FARBE["bauch"]))

def verlauf_glied():
    """Eigener Verlauf fuer die Gliedmassen. Nimmt man den Koerperverlauf,
    faellt der Oberschenkel in dessen helle Bauchzone und leuchtet als
    blasse Platte neben dem Tier — genau der Fehler der alten Zeichnung."""
    return ('<linearGradient id="%sg" x1="0" y1="-40" x2="0" y2="0" '
            'gradientUnits="userSpaceOnUse">'
            '<stop offset="0" stop-color="%s"/>'
            '<stop offset="0.55" stop-color="%s"/>'
            '<stop offset="1" stop-color="%s"/></linearGradient>'
            % (P, FARBE["flanke"], dunkler(FARBE["flanke"], 0.86),
               dunkler(FARBE["flanke"], 0.7)))

def verlauf_oberschenkel():
    """Oben genau der Flankenton, damit der Uebergang zum Rumpf nicht
    als Kante sichtbar wird; nach unten hin dunkler."""
    return ('<linearGradient id="%so" x1="0" y1="-44" x2="0" y2="-18" '
            'gradientUnits="userSpaceOnUse">'
            '<stop offset="0" stop-color="%s"/>'
            '<stop offset="0.45" stop-color="%s"/>'
            '<stop offset="1" stop-color="%s"/></linearGradient>'
            % (P, dunkler(FARBE["flanke"], 0.82), dunkler(FARBE["flanke"], 0.94),
               dunkler(FARBE["flanke"], 0.76)))

def schuppenmuster():
    """Haut als Kachel statt als tausend Einzelellipsen — genau der
    Kniff, der den T-Rex frueher von 3114 kB auf 317 kB gebracht hat."""
    kachel = []
    for r in range(6):
        for s in range(6):
            cx = s*1.1 + (0.55 if r % 2 else 0.0)
            cy = r*1.0
            kachel.append('<ellipse cx="%s" cy="%s" rx="0.42" ry="0.34"/>' % (z(cx), z(cy)))
    return ('<pattern id="%ss" width="6.6" height="6.0" patternUnits="userSpaceOnUse">'
            '<g fill="%s" fill-opacity="0.09">%s</g></pattern>'
            % (P, FARBE["tief"], "".join(kachel)))

def glied(punkte, breiten, fuell, strich=True, deckkraft=None):
    d = schlauch(punkte, breiten)
    o = ' opacity="%s"' % z(deckkraft) if deckkraft is not None else ""
    k = ' stroke="%s" stroke-width="0.45"' % FARBE["kontur"] if strich else ' stroke="none"'
    return '<path d="%s" fill="%s"%s%s/>' % (d, fuell, k, o)

def zaehne(reihe, nach_unten, anzahl=11, laenge=2.6):
    """Zaehne entlang einer Zahnreihe, quer zur Reihe gestellt.

    Vorn sind sie am laengsten — der groesste gefundene Zahn misst mit
    Wurzel 30 cm, die hinteren sind gut ein Drittel kuerzer. Deshalb
    laeuft die Laenge ueber einen Sinusbogen und nicht gleichmaessig.
    """
    stuecke = []
    for i in range(anzahl):
        t = (i + 0.5) / anzahl
        pos = t * (len(reihe) - 1)
        j = min(int(pos), len(reihe) - 2)
        f = pos - j
        (x0, y0), (x1, y1) = reihe[j], reihe[j+1]
        x, y = x0 + (x1-x0)*f, y0 + (y1-y0)*f
        dx, dy = x1-x0, y1-y0
        d = math.hypot(dx, dy) or 1.0
        bx, by = dx/d, dy/d                      # Tangente
        nx, ny = -by, bx                         # Normale
        if (ny > 0) != nach_unten:
            nx, ny = -nx, -ny
        l = laenge * (0.58 + 0.42 * math.sin(math.pi * (0.22 + 0.78*t)))
        b = 1.15 * (0.72 + 0.28*(1.0-t))
        stuecke.append('<path d="M%s %s L%s %s L%s %s Z"/>' % (
            z(x - bx*b), z(y - by*b),
            z(x + bx*b), z(y + by*b),
            z(x + nx*l + bx*b*0.2), z(y + ny*l + by*b*0.2)))
    return '<g fill="%s">%s</g>' % (FARBE["zahn"], "".join(stuecke))

# ------------------------------------------------------------------ Bild
def zeichne():
    t = []
    a = t.append

    # 1. Bodenschatten — unter den FUESSEN. Vorher lag er mit 81 Einheiten
    #    Halbachse als grauer Nebel quer durch das halbe Bild.
    a('<ellipse class="bw-bodenschatten" cx="26" cy="0.8" rx="30" ry="5.0" '
      'fill="url(#bs_dinosaurier)" opacity="0.3"/>')

    a("<defs>%s%s%s%s" % (verlauf_koerper(), verlauf_glied(),
                      verlauf_oberschenkel(), schuppenmuster()))
    a('<clipPath id="%sc"><path d="%s"/></clipPath>' % (P, kurve(UMRISS)))
    a('<radialGradient id="%sb"><stop offset="0" stop-color="%s" stop-opacity="0.5"/>'
      '<stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>'
      % (P, FARBE["tief"], FARBE["tief"]))
    a("</defs>")

    # 2. FERNE Gliedmassen — dahinter, abgedunkelt und leicht versetzt.
    #    Daran erkennt das Auge, dass da zwei Beine stehen und nicht eins.
    a('<g opacity="0.96">')
    for punkte, breiten in FERN_GLIED + FERN_ZEHEN:
        a(glied(punkte, breiten, dunkler(FARBE["flanke"], 0.66), strich=False))
    for (px, py) in [(31.0, 0.2), (34.0, 1.0)]:
        a('<path d="M%s %s L%s %s L%s %s Z" fill="%s" opacity="0.75"/>'
          % (z(px), z(py-0.9), z(px-2.6), z(py+0.5), z(px), z(py+0.9), FARBE["kralle"]))
    for punkte, breiten in ARM_GLIED + FINGER:
        p2 = [(x + 2.4, y + 1.4) for x, y in punkte]
        a(glied(p2, breiten, dunkler(FARBE["flanke"], 0.66), strich=False))
    a("</g>")

    # 3. Unterkiefer (geoeffnet): erst der Rachen, dann der Knochen.
    uk = drehe(UNTERKIEFER, -MAULOEFFNUNG, KIEFER)
    rachen = OBERKIEFER + uk[5::-1]
    a('<path d="%s" fill="%s"/>' % (kurve(rachen, spannung=0.25), FARBE["rachen"]))
    a('<path d="%s" fill="url(#%sg)" stroke="%s" stroke-width="0.5" '
      'stroke-linejoin="round"/>' % (kurve(uk, spannung=0.35), P, FARBE["kontur"]))
    a('<path d="%s" fill="none" stroke="%s" stroke-width="1.4" stroke-opacity="0.5" '
      'stroke-linecap="round"/>' % (kurve(uk[:6], zu=False, spannung=0.3), FARBE["maul"]))
    a(zaehne(uk[:6][::-1], nach_unten=False, anzahl=9, laenge=2.8))

    # 4. Der Koerper: EIN geschlossener Umriss, keine sichtbaren Fugen.
    a('<path d="%s" fill="url(#%sk)" stroke="%s" stroke-width="0.55" '
      'stroke-linejoin="round"/>' % (kurve(UMRISS), P, FARBE["kontur"]))

    # 5. Modellierung, am Umriss beschnitten.
    a('<g clip-path="url(#%sc)">' % P)
    a('<rect x="-70" y="-64" width="172" height="68" fill="url(#%ss)"/>' % P)
    # Brustkorb: Rippenbogen und der Schatten unter ihm
    a('<ellipse cx="0" cy="-26" rx="22" ry="7" fill="url(#%sb)"/>' % P)
    for i in range(7):
        x = -8.0 + i*4.4
        a('<path d="M%s -42.5 C%s -36 %s -30 %s -25" fill="none" stroke="%s" '
          'stroke-width="0.8" stroke-opacity="0.11" stroke-linecap="round"/>'
          % (z(x), z(x-1.4), z(x-1.8), z(x-0.8), FARBE["tief"]))
    # Schulterblatt und Darmbein als helle Kuppen
    a('<ellipse cx="-9" cy="-39" rx="7" ry="8.5" fill="%s" opacity="0.15" '
      'transform="rotate(12 -9 -39)"/>' % FARBE["licht"])
    a('<ellipse cx="26" cy="-41" rx="12" ry="6.5" fill="%s" opacity="0.14"/>' % FARBE["licht"])
    # Zeichnung: dunkle Querbaender ueber Ruecken und Schwanz, wie bei einem Waran
    for i in range(10):
        x = -32.0 + i*12.5
        w = 6.0 - i*0.34
        a('<path d="M%s -56 C%s -50 %s -45 %s -40" fill="none" stroke="%s" '
          'stroke-width="%s" stroke-opacity="0.17" stroke-linecap="round"/>'
          % (z(x), z(x+1.8), z(x+2.6), z(x+2.0), FARBE["tief"], z(max(w, 2.2))))
    # Lichtsaum auf dem Ruecken, Schatten unten in der Flanke
    a('<path d="%s" fill="none" stroke="%s" stroke-width="1.8" stroke-opacity="0.28" '
      'stroke-linecap="round"/>' % (kurve(RUECKEN[4:], zu=False, spannung=0.5), FARBE["licht"]))
    a('<path d="%s" fill="none" stroke="%s" stroke-width="3.0" stroke-opacity="0.2" '
      'stroke-linecap="round"/>' % (kurve(BAUCH[:9], zu=False, spannung=0.5), FARBE["tief"]))
    # Halsfalten
    for i in range(3):
        x = -26.0 + i*5.0
        a('<path d="M%s -53 C%s -47 %s -42 %s -36" fill="none" stroke="%s" '
          'stroke-width="0.7" stroke-opacity="0.18" stroke-linecap="round"/>'
          % (z(x), z(x+1.6), z(x+2.6), z(x+3.4), FARBE["tief"]))
    a("</g>")

    # 6. Kopf: Zaehne, Nasenloch, Antorbitalfenster, Brauenhorn, Auge.
    a(zaehne(OBERKIEFER, nach_unten=True, anzahl=10, laenge=3.4))
    a('<ellipse cx="-65.2" cy="-50.6" rx="1.7" ry="1.0" fill="%s" opacity="0.7" '
      'transform="rotate(-28 -65.2 -50.6)"/>' % FARBE["tief"])
    a('<path d="M-56.5 -50.2 C-53.6 -53.4 -49.2 -53.8 -47.0 -51.4 C-48.6 -48.2 -53.4 '
      '-47.6 -56.5 -50.2 Z" fill="%s" opacity="0.3"/>' % FARBE["tief"])
    a('<path d="M-50.6 -59.0 C-47.0 -60.4 -44.0 -60.0 -42.4 -58.2 C-45.2 -57.2 -48.2 '
      '-57.4 -50.6 -59.0 Z" fill="%s" opacity="0.45"/>' % FARBE["tief"])
    a('<ellipse cx="-48.6" cy="-57.4" rx="2.1" ry="1.95" fill="#1b1710"/>')
    a('<ellipse cx="-48.6" cy="-57.4" rx="1.5" ry="1.4" fill="%s"/>' % FARBE["auge"])
    a('<ellipse cx="-48.6" cy="-57.4" rx="0.42" ry="1.2" fill="#17130c"/>')
    a('<circle cx="-49.4" cy="-58.2" r="0.42" fill="#fff" opacity="0.8"/>')
    a('<circle cx="-30.6" cy="-41.4" r="0.8" fill="%s" opacity="0.5"/>' % FARBE["tief"])

    # 7. NAHE Gliedmassen. Der Oberschenkel steckt im Rumpf — deshalb
    #    keine Kontur an seiner Oberkante, sonst laege dort eine Naht.
    # Der Oberschenkel steckt zur Haelfte im Rumpf. Bekaeme er ringsum eine
    # Kontur, klebte er als Platte auf der Flanke — genau der Eindruck der
    # alten Zeichnung. Er wird deshalb OHNE Kontur gefuellt; nur seine
    # Vorder- und Unterkante bekommt einen weichen Saum.
    ober, oberbreit = BEIN_GLIED[0]
    a(glied(ober, oberbreit, "url(#%so)" % P, strich=False))
    a('<path d="%s" fill="none" stroke="%s" stroke-width="1.6" stroke-opacity="0.22" '
      'stroke-linecap="round"/>'
      % (kurve([(x-b*0.95, y+b*0.5) for (x, y), b in zip(ober, oberbreit)],
               zu=False, spannung=0.4), FARBE["tief"]))
    for punkte, breiten in BEIN_GLIED[1:]:
        a(glied(punkte, breiten, "url(#%sg)" % P))
    for punkte, breiten in ZEHEN:
        a(glied(punkte, breiten, "url(#%sg)" % P))
    for (px, py) in [(9.0, 0.3), (12.0, 1.2), (14.0, -1.0)]:
        a('<path d="M%s %s L%s %s L%s %s Z" fill="%s"/>'
          % (z(px), z(py-1.0), z(px-3.0), z(py+0.6), z(px), z(py+1.0), FARBE["kralle"]))
    # Muskelzeichnung am Oberschenkel und die Kniekehle
    a('<ellipse cx="25" cy="-30" rx="7.0" ry="5.0" fill="%s" opacity="0.10" '
      'transform="rotate(-38 25 -31)"/>' % FARBE["licht"])
    a('<path d="M21 -37 C17.5 -31 16 -26 17 -21.5" fill="none" stroke="%s" '
      'stroke-width="1.2" stroke-opacity="0.18" stroke-linecap="round"/>' % FARBE["tief"])
    a('<path d="M30 -20.5 C27 -17 25.5 -13.5 26.5 -10" fill="none" stroke="%s" '
      'stroke-width="1.0" stroke-opacity="0.16" stroke-linecap="round"/>' % FARBE["tief"])
    # Arm mit zwei Krallenfingern
    for punkte, breiten in ARM_GLIED + FINGER:
        a(glied(punkte, breiten, "url(#%sg)" % P))
    for (px, py) in [(-17.0, -26.2), (-16.2, -29.2)]:
        a('<path d="M%s %s L%s %s L%s %s Z" fill="%s"/>'
          % (z(px), z(py-0.6), z(px-2.4), z(py+0.1), z(px), z(py+0.7), FARBE["kralle"]))
    return "".join(t)

# -------------------------------------------------------------- Einbauen
def einbauen(kunst):
    txt = open(SZENE, encoding="utf-8").read()
    i = txt.index('{"id"'); j = txt.rindex("};")
    d = json.loads(txt[i:j+1])
    for teil in d["teile"]:
        if teil["id"] == TEIL:
            teil["kunst"] = kunst
            break
    else:
        raise SystemExit("Teil %s steht nicht in der Szene" % TEIL)
    sicher = os.path.join(WURZEL, "sicherung",
                          datetime.datetime.now().strftime("%Y-%m-%d") + "-tyrannosaurus")
    os.makedirs(sicher, exist_ok=True)
    if not os.path.exists(os.path.join(sicher, "dinosaurier.js")):
        shutil.copy2(SZENE, sicher)
    open(SZENE, "w", encoding="utf-8").write(
        txt[:i] + json.dumps(d, ensure_ascii=False, separators=(",", ":")) + txt[j+1:])
    print("eingebaut: %d Zeichen (vorher %d)" % (len(kunst), len(txt)))

if __name__ == "__main__":
    k = zeichne()
    if "-p" in sys.argv:
        print(k)
    else:
        einbauen(k)
