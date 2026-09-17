# -*- coding: utf-8 -*-
"""Die Stadt — eine Karte von schraeg oben statt einer Tabelle.

GEWUENSCHT: „die Stadt in 3-D, so eine Uebersicht wie bei Google Maps,
mit einem Wegweiser, und Strassen, die zu den einzelnen Orten fuehren."

VORHER: sieben gleiche Dreierhaeuschen in einem Raster, darunter je ein
Schild. Das war eine Liste mit Bildern, keine Stadt: alle Viertel sahen
gleich aus, die Strassen fuehrten nirgendwohin, und von Tiefe konnte
keine Rede sein.

JETZT: eine isometrische Karte. Jedes Viertel hat sein eigenes Gesicht —
die Innenstadt schmale hohe Buergerhaeuser mit Kirchturm, das
Behoerdenviertel einen Bau mit Saeulen und Fahne, das Kulturviertel ein
Haus mit Kuppel, das Wohnviertel Einfamilienhaeuser mit Garten, das
Gewerbegebiet flache Hallen mit Schornstein und Kran, der Stadtrand
Hoefe und Felder, im Gruenen Baeume und ein See mit Steg. Dazwischen
Strassen, die die Viertel wirklich verbinden, und unten am Eingang ein
hoelzerner Wegweiser mit sieben Armen.

DIE ABBILDUNG: eine zweifach-isometrische (2:1) Projektion.
    sx = MX + (wx - wy) * BREIT
    sy = MY + (wx + wy) * TIEF - wz * HOCH
Eine gerade Linie in der Welt bleibt dabei eine gerade Linie im Bild —
deshalb lassen sich Strassen als einfache Polygonzuege zeichnen.

Aufruf:  python3 werkzeug/bau-stadt.py
         python3 werkzeug/bau-stadt.py -p   (nur ausgeben)
"""
import json, math, os, shutil, sys, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from zeichenwerk import z, kurve, dunkler as mischen

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SZENE  = os.path.join(WURZEL, "szenen", "stadt.js")

BREITE, HOEHE = 380, 290
MX, MY = 190.0, 34.0
BREIT, TIEF, HOCH = 3.2, 2.5, 2.8

def P(wx, wy, wz=0.0):
    return (MX + (wx - wy) * BREIT, MY + (wx + wy) * TIEF - wz * HOCH)

def pfad(punkte, zu=True):
    return ("M" + " L".join("%s %s" % (z(x), z(y)) for x, y in punkte)
            + (" Z" if zu else ""))

# ----------------------------------------------------------------- Farben
G = {
    "wiese_h":  "#a9cf7e", "wiese":  "#8cbd63", "wiese_d": "#6ea34c",
    "strasse":  "#9aa0a6", "strasse_d": "#7d838a", "mittel": "#f2f2ee",
    "wasser":   "#7fb8d4", "wasser_d": "#5d9cbd",
    "sand":     "#e3d4a8",
    "kontur":   "#43483f",
    "schild":   "#2d4356", "schildtext": "#ffffff",
    "holz":     "#a67c48", "holz_d": "#7d5a31",
}

def wand(grund, licht):
    """Drei Toene fuer einen Koerper: Dach/Deckflaeche hell, die zum
    Betrachter linke Flanke mittel, die rechte dunkel. Genau dieser
    Unterschied macht aus einem Vieleck einen Koerper."""
    return (mischen(grund, licht), mischen(grund, licht * 0.82),
            mischen(grund, licht * 0.64))

def quader(x, y, bx, by, h, grund, licht=1.0, z0=0.0):
    hell, mit, dun = wand(grund, licht)
    oben = [P(x, y, z0+h), P(x+bx, y, z0+h), P(x+bx, y+by, z0+h), P(x, y+by, z0+h)]
    links = [P(x, y+by, z0+h), P(x+bx, y+by, z0+h), P(x+bx, y+by, z0), P(x, y+by, z0)]
    rechts = [P(x+bx, y, z0+h), P(x+bx, y+by, z0+h), P(x+bx, y+by, z0), P(x+bx, y, z0)]
    return ('<path d="%s" fill="%s"/><path d="%s" fill="%s"/><path d="%s" fill="%s"/>'
            % (pfad(oben), hell, pfad(links), mit, pfad(rechts), dun))

def satteldach(x, y, bx, by, h, grund, licht=1.0, rh=2.6):
    hell, mit, dun = wand(grund, licht)
    first_y = y + by / 2.0
    a = [P(x, y, h), P(x+bx, y, h), P(x+bx, first_y, h+rh), P(x, first_y, h+rh)]
    b = [P(x, y+by, h), P(x+bx, y+by, h), P(x+bx, first_y, h+rh), P(x, first_y, h+rh)]
    giebel = [P(x+bx, y, h), P(x+bx, y+by, h), P(x+bx, first_y, h+rh)]
    return ('<path d="%s" fill="%s"/><path d="%s" fill="%s"/><path d="%s" fill="%s"/>'
            % (pfad(a), hell, pfad(b), mit, pfad(giebel), dun))

def fenster(x, y, bx, by, h, reihen=2, spalten=2, farbe="#cfe4f2"):
    """Fenster auf die linke Flanke (y+by) — die dem Betrachter
    zugewandte Seite."""
    s = []
    for r in range(reihen):
        for c in range(spalten):
            fx = x + bx * (0.18 + c * 0.64 / max(spalten-1, 1)) if spalten > 1 else x + bx*0.5
            fz = h * (0.22 + r * 0.46 / max(reihen-1, 1)) if reihen > 1 else h*0.42
            w, hh = bx * 0.2, h * 0.17
            p = [P(fx-w/2, y+by, fz+hh), P(fx+w/2, y+by, fz+hh),
                 P(fx+w/2, y+by, fz-hh), P(fx-w/2, y+by, fz-hh)]
            s.append('<path d="%s" fill="%s" opacity="0.92"/>' % (pfad(p), farbe))
    return "".join(s)

def tuer(x, y, bx, by, farbe="#7d5a31"):
    w = bx * 0.2
    fx = x + bx * 0.5
    p = [P(fx-w/2, y+by, 1.9), P(fx+w/2, y+by, 1.9),
         P(fx+w/2, y+by, 0), P(fx-w/2, y+by, 0)]
    return '<path d="%s" fill="%s"/>' % (pfad(p), farbe)

def baum(wx, wy, groesse=1.0, farbe="#4f8f45"):
    sx, sy = P(wx, wy, 0)
    st = 3.4 * groesse
    return ('<path d="M%s %s L%s %s" stroke="%s" stroke-width="%s" stroke-linecap="round"/>'
            '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s"/>'
            '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" opacity="0.5"/>'
            % (z(sx), z(sy), z(sx), z(sy - st), G["holz_d"], z(1.3*groesse),
               z(sx), z(sy - st - 2.6*groesse), z(4.0*groesse), z(3.4*groesse), farbe,
               z(sx - 1.1*groesse), z(sy - st - 3.4*groesse), z(2.4*groesse),
               z(1.9*groesse), mischen(farbe, 1.22)))

def strasse(punkte, breite=2.6):
    """Eine Strasse als Polygonzug in WELTkoordinaten: erst die Kante,
    dann die Fahrbahn, dann der Mittelstrich."""
    sp = [P(x, y, 0) for x, y in punkte]
    d = pfad(sp, zu=False)
    return ('<path d="%s" fill="none" stroke="%s" stroke-width="%s" '
            'stroke-linejoin="round" stroke-linecap="round"/>'
            '<path d="%s" fill="none" stroke="%s" stroke-width="%s" '
            'stroke-linejoin="round" stroke-linecap="round"/>'
            '<path d="%s" fill="none" stroke="%s" stroke-width="0.6" '
            'stroke-dasharray="3 3.4" stroke-linecap="round" opacity="0.75"/>'
            % (d, G["strasse_d"], z(breite * 2.6 + 1.6),
               d, G["strasse"], z(breite * 2.6),
               d, G["mittel"]))

def schild(sx, sy, text, breite=None):
    b = breite if breite else max(34.0, len(text) * 4.4 + 12)
    return ('<g><rect x="%s" y="%s" width="%s" height="14" rx="4" fill="%s" '
            'opacity="0.93"/><text x="%s" y="%s" text-anchor="middle" '
            'font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" '
            'font-size="8.4" font-weight="700" fill="%s" letter-spacing="0.3">%s</text></g>'
            % (z(sx-b/2), z(sy), z(b), G["schild"], z(sx), z(sy+9.7),
               G["schildtext"], text))

# ------------------------------------------------------------- Die Viertel
VIERTEL = [
    # id, deutsch, italienisch, englisch, weltmitte, lupe
    ("sv_innenstadt", "die Innenstadt",  ( 7.2,  7.2)),
    ("sv_behoerden",  "das Behördenviertel", ( 1.0, 27.4)),
    ("sv_kultur",     "das Kulturviertel",   (27.4,  1.0)),
    ("sv_wohnen",     "das Wohnviertel",     (13.4, 43.0)),
    ("sv_gewerbe",    "das Gewerbegebiet",   (42.0, 12.4)),
    ("sv_rand",       "der Stadtrand",       (22.2, 22.2)),
    ("sv_gruen",      "am Wasser und im Grünen", (38.2, 38.2)),
]

def bau_innenstadt(cx, cy):
    """Schmale, hohe Buergerhaeuser in einer Reihe, dazu ein Kirchturm."""
    s = []
    farben = ["#e8d6b6", "#dcc6a0", "#efe2c8", "#d8c3a6", "#e5d2b0"]
    for i in range(5):
        x = cx - 5 + i * 2.2
        y = cy - 2.0
        h = 7.0 + (i % 3) * 1.4
        f = farben[i]
        s.append(quader(x, y, 2.0, 3.4, h, f, 1.0))
        s.append(satteldach(x, y, 2.0, 3.4, h, "#a85440", 1.0, 2.2))
        s.append(fenster(x, y, 2.0, 3.4, h, reihen=2, spalten=2))
        s.append(tuer(x, y, 2.0, 3.4))
    # Kirche mit Turm
    s.append(quader(cx - 6.6, cy + 2.4, 2.4, 2.4, 13.5, "#e9e4da", 1.0))
    s.append('<path d="%s" fill="%s"/>' % (
        pfad([P(cx-6.6, cy+2.4, 13.5), P(cx-4.2, cy+2.4, 13.5),
              P(cx-5.4, cy+3.6, 20.5)]), "#6c7b73"))
    s.append('<path d="%s" fill="%s"/>' % (
        pfad([P(cx-6.6, cy+4.8, 13.5), P(cx-4.2, cy+4.8, 13.5),
              P(cx-5.4, cy+3.6, 20.5)]), "#55635c"))
    return "".join(s)

def bau_behoerden(cx, cy):
    """Ein breiter Bau mit Saeulenvorbau und Fahne."""
    s = []
    s.append(quader(cx-5, cy-3, 9.0, 5.2, 7.6, "#d9d2c4", 1.0))
    s.append(fenster(cx-5, cy-3, 9.0, 5.2, 7.6, reihen=2, spalten=4))
    # Vorbau mit Saeulen
    s.append(quader(cx-2.4, cy+2.2, 4.4, 1.6, 5.4, "#eae5da", 1.0))
    for i in range(4):
        sx0 = cx - 2.0 + i * 1.2
        s.append(quader(sx0, cy+3.4, 0.4, 0.4, 5.2, "#f4f1ea", 1.06))
    s.append('<path d="%s" fill="%s"/>' % (
        pfad([P(cx-2.4, cy+2.2, 5.4), P(cx+2.0, cy+2.2, 5.4),
              P(cx+2.0, cy+3.8, 5.4), P(cx-2.4, cy+3.8, 5.4)]), "#cbc3b3"))
    # Fahnenmast
    fx, fy = P(cx+4.4, cy-3.2, 0)
    s.append('<path d="M%s %s L%s %s" stroke="#8b8b8b" stroke-width="0.8" '
             'stroke-linecap="round"/>' % (z(fx), z(fy), z(fx), z(fy-22)))
    s.append('<path d="M%s %s h9 v6 h-9 Z" fill="#c8362f"/>' % (z(fx), z(fy-22)))
    s.append('<path d="M%s %s h9 v2 h-9 Z" fill="#2b2b2b"/>' % (z(fx), z(fy-22)))
    s.append('<path d="M%s %s h9 v2 h-9 Z" fill="#e3b52e"/>' % (z(fx), z(fy-18)))
    return "".join(s)

def bau_kultur(cx, cy):
    """Ein Haus mit Kuppel und ein flacher Theaterbau."""
    s = []
    s.append(quader(cx-5.4, cy-2.6, 6.0, 5.0, 6.4, "#e6dcc8", 1.0))
    s.append(fenster(cx-5.4, cy-2.6, 6.0, 5.0, 6.4, reihen=2, spalten=3))
    kx, ky = P(cx-2.4, cy-0.1, 6.4)
    s.append('<path d="M%s %s a11 9 0 0 1 22 0 Z" fill="#8fb5b0" '
             'transform="translate(%s,%s)"/>' % (z(-11), z(0), z(kx), z(ky)))
    s.append('<path d="M%s %s a11 9 0 0 1 11 -9 l0 9 Z" fill="#a6c9c4" '
             'transform="translate(%s,%s)"/>' % (z(-11), z(0), z(kx), z(ky)))
    s.append('<circle cx="%s" cy="%s" r="1.5" fill="#e3b52e"/>' % (z(kx), z(ky-10.4)))
    s.append(quader(cx+2.0, cy+1.4, 4.2, 4.2, 4.6, "#d7c7ab", 1.0))
    s.append(satteldach(cx+2.0, cy+1.4, 4.2, 4.2, 4.6, "#9c7f5e", 1.0, 1.8))
    return "".join(s)

def bau_wohnen(cx, cy):
    """Einfamilienhaeuser mit Garten und Hecke."""
    s = []
    farben = ["#f0e2c8", "#e7d9bd", "#f4ead6"]
    plaetze = [(-5.4, -2.6), (-0.6, -3.4), (-4.0, 2.4), (1.6, 1.6)]
    for i, (dx, dy) in enumerate(plaetze):
        x, y = cx + dx, cy + dy
        s.append(quader(x, y, 3.2, 3.0, 4.4, farben[i % 3], 1.0))
        s.append(satteldach(x, y, 3.2, 3.0, 4.4, "#b5624a", 1.0, 2.0))
        s.append(fenster(x, y, 3.2, 3.0, 4.4, reihen=1, spalten=2))
        s.append(tuer(x, y, 3.2, 3.0))
        s.append(baum(x + 3.8, y + 2.2, 0.72))
    return "".join(s)

def bau_gewerbe(cx, cy):
    """Flache Hallen, ein Schornstein und ein Kran."""
    s = []
    s.append(quader(cx-5.6, cy-2.4, 7.0, 4.6, 4.0, "#c9ccd1", 1.0))
    s.append('<path d="%s" fill="%s"/>' % (
        pfad([P(cx-5.6, cy-2.4, 4.0), P(cx+1.4, cy-2.4, 4.0),
              P(cx+1.4, cy+2.2, 4.0), P(cx-5.6, cy+2.2, 4.0)]), "#aeb3ba"))
    for i in range(4):
        x0 = cx - 5.2 + i * 1.7
        s.append('<path d="%s" fill="#dfe3e7" opacity="0.9"/>' % pfad(
            [P(x0, cy+2.2, 3.4), P(x0+1.1, cy+2.2, 3.4),
             P(x0+1.1, cy+2.2, 1.4), P(x0, cy+2.2, 1.4)]))
    s.append(quader(cx+2.4, cy-0.6, 3.4, 3.4, 3.0, "#b9bec4", 1.0))
    # Schornstein
    s.append(quader(cx+6.0, cy-2.2, 1.0, 1.0, 13.0, "#c2b09c", 1.0))
    s.append('<path d="%s" fill="#a8341f" opacity="0.8"/>' % pfad(
        [P(cx+6.0, cy-1.2, 9.4), P(cx+7.0, cy-1.2, 9.4),
         P(cx+7.0, cy-1.2, 8.0), P(cx+6.0, cy-1.2, 8.0)]))
    # Kran
    kx, ky = P(cx-1.0, cy+4.4, 0)
    s.append('<path d="M%s %s L%s %s" stroke="#e0a32c" stroke-width="1.3"/>'
             % (z(kx), z(ky), z(kx), z(ky-30)))
    s.append('<path d="M%s %s L%s %s" stroke="#e0a32c" stroke-width="1.3"/>'
             % (z(kx-8), z(ky-30), z(kx+18), z(ky-30)))
    s.append('<path d="M%s %s L%s %s" stroke="#7d838a" stroke-width="0.5"/>'
             % (z(kx+13), z(ky-30), z(kx+13), z(ky-18)))
    return "".join(s)

def bau_rand(cx, cy):
    """Hoefe und Felder — wo die Stadt aufhoert."""
    s = []
    # Felder
    for i in range(3):
        x0 = cx - 6.4 + i * 4.4
        s.append('<path d="%s" fill="%s" opacity="0.9"/>' % (
            pfad([P(x0, cy+2.0), P(x0+3.8, cy+2.0), P(x0+3.8, cy+6.4), P(x0, cy+6.4)]),
            ["#cbb46a", "#a8bf6a", "#c0a95e"][i]))
        for j in range(4):
            yy = cy + 2.5 + j * 1.1
            s.append('<path d="%s" stroke="%s" stroke-width="0.4" fill="none" '
                     'opacity="0.45"/>' % (
                pfad([P(x0, yy), P(x0+3.8, yy)], zu=False), "#7d6a33"))
    s.append(quader(cx-4.4, cy-3.2, 4.0, 3.4, 4.2, "#efe0c6", 1.0))
    s.append(satteldach(cx-4.4, cy-3.2, 4.0, 3.4, 4.2, "#9c5a3c", 1.0, 2.2))
    s.append(tuer(cx-4.4, cy-3.2, 4.0, 3.4))
    s.append(quader(cx+0.8, cy-2.6, 3.4, 2.6, 3.0, "#c9a882", 1.0))
    s.append(satteldach(cx+0.8, cy-2.6, 3.4, 2.6, 3.0, "#7f5a3b", 1.0, 1.6))
    s.append(baum(cx+5.4, cy-1.4, 0.9))
    return "".join(s)

def bau_gruen(cx, cy):
    """Ein See mit Steg, Baeume, eine Wiese."""
    s = []
    mitte = P(cx + 1.0, cy + 1.6, 0)
    s.append('<ellipse cx="%s" cy="%s" rx="30" ry="14" fill="%s"/>'
             % (z(mitte[0]), z(mitte[1]), G["wasser"]))
    s.append('<ellipse cx="%s" cy="%s" rx="30" ry="14" fill="none" stroke="%s" '
             'stroke-width="1.2" opacity="0.6"/>' % (z(mitte[0]), z(mitte[1]), G["wasser_d"]))
    for i in range(3):
        s.append('<path d="M%s %s q5 -2 10 0" fill="none" stroke="#ffffff" '
                 'stroke-width="0.7" opacity="0.5" stroke-linecap="round"/>'
                 % (z(mitte[0]-12+i*9), z(mitte[1]-3+i*4)))
    # Steg
    s.append('<path d="%s" fill="%s"/>' % (
        pfad([P(cx-4.6, cy-1.0), P(cx-1.4, cy-1.0), P(cx-1.4, cy+0.2), P(cx-4.6, cy+0.2)]),
        G["holz"]))
    for dx, dy, g in [(-6.2, -3.4, 1.05), (-3.0, -4.6, 0.85), (5.2, -2.0, 1.0),
                      (6.4, 2.6, 0.9), (-5.8, 4.2, 0.95), (2.0, 5.4, 0.8)]:
        s.append(baum(cx+dx, cy+dy, g, "#4a8a41" if (dx+dy) % 2 else "#5d9a4c"))
    return "".join(s)

BAUER = {
    "sv_innenstadt": bau_innenstadt, "sv_behoerden": bau_behoerden,
    "sv_kultur": bau_kultur, "sv_wohnen": bau_wohnen,
    "sv_gewerbe": bau_gewerbe, "sv_rand": bau_rand, "sv_gruen": bau_gruen,
}

# ------------------------------------------------------------- Die Kulisse
def kulisse():
    s = []
    s.append('<rect x="0" y="0" width="%d" height="%d" fill="#bfe0ef"/>' % (BREITE, HOEHE))
    # Der Boden als grosse Raute
    rand = [P(-4, -4), P(46, -4), P(46, 47), P(-4, 47)]
    s.append('<path d="%s" fill="%s"/>' % (pfad(rand), G["wiese"]))
    s.append('<path d="%s" fill="none" stroke="%s" stroke-width="1.6" '
             'opacity="0.55"/>' % (pfad(rand), G["wiese_d"]))
    # Ein paar hellere Wiesenfelder, damit der Boden nicht tot wirkt
    for x0, y0, bx, by, f in [(-2, 10, 9, 9, G["wiese_h"]), (30, -2, 10, 8, G["wiese_h"]),
                              (8, 30, 11, 10, G["wiese_h"]), (33, 26, 9, 12, G["wiese_h"])]:
        s.append('<path d="%s" fill="%s" opacity="0.5"/>' % (
            pfad([P(x0, y0), P(x0+bx, y0), P(x0+bx, y0+by), P(x0, y0+by)]), f))
    # Der Fluss laeuft quer durch — er trennt das Gruene vom Rest
    fluss = [P(-4, 33), P(8, 31), P(18, 33.6), P(28, 37), P(40, 38), P(46, 40)]
    s.append('<path d="%s" fill="none" stroke="%s" stroke-width="13" '
             'stroke-linejoin="round" stroke-linecap="round"/>'
             % (pfad(fluss, zu=False), G["wasser_d"]))
    s.append('<path d="%s" fill="none" stroke="%s" stroke-width="10.4" '
             'stroke-linejoin="round" stroke-linecap="round"/>'
             % (pfad(fluss, zu=False), G["wasser"]))

    # Die Strassen. Sie verbinden die Viertel WIRKLICH miteinander —
    # vorher war die Fahrbahn ein Muster ohne Ziel.
    mitte = (22.2, 22.2)
    for ziel in [(7.2, 7.2), (1.0, 27.4), (27.4, 1.0), (13.4, 43.0),
                 (42.0, 12.4), (38.2, 38.2)]:
        s.append(strasse([mitte, ziel], 1.1))
    s.append(strasse([(22.2, 22.2), (24.0, 46.5)], 1.3))   # Zufahrt von unten
    s.append(strasse([(1.0, 27.4), (13.4, 43.0)], 0.9))
    s.append(strasse([(27.4, 1.0), (42.0, 12.4)], 0.9))
    s.append(strasse([(7.2, 7.2), (1.0, 27.4)], 0.9))

    # Ein paar Baeume als Strassengruen
    for wx, wy, g in [(14, 2, 0.8), (33, 6, 0.75), (3, 16, 0.8), (36, 20, 0.75),
                      (10, 34, 0.7), (30, 30, 0.75), (44, 30, 0.8), (18, 12, 0.7)]:
        s.append(baum(wx, wy, g, "#5a9a4e"))

    # Ueberschrift
    s.append('<rect x="14" y="12" width="150" height="30" rx="8" fill="%s" '
             'opacity="0.94"/>' % G["schild"])
    s.append('<text x="30" y="33" font-family="system-ui,-apple-system,Segoe UI,'
             'Roboto,sans-serif" font-size="18" font-weight="800" fill="#fff" '
             'letter-spacing="0.6">DIE STADT</text>')
    s.append('<text x="200" y="30" font-family="system-ui,-apple-system,Segoe UI,'
             'Roboto,sans-serif" font-size="9.4" font-weight="700" fill="#2d4356">'
             'Tippe ein Viertel an — du gehst hinein.</text>')
    return "".join(s)

def wegweiser():
    """Der hoelzerne Wegweiser am Eingang der Stadt, mit sieben Armen.
    Er steht dort, wo die Zufahrt die Karte betritt."""
    sx, sy = P(25.6, 45.4, 0)
    s = ['<ellipse cx="%s" cy="%s" rx="7" ry="2.6" fill="#000" opacity="0.14"/>'
         % (z(sx), z(sy))]
    s.append('<path d="M%s %s L%s %s" stroke="%s" stroke-width="2.6" '
             'stroke-linecap="round"/>' % (z(sx), z(sy), z(sx), z(sy-42), G["holz_d"]))
    s.append('<path d="M%s %s L%s %s" stroke="%s" stroke-width="1.4" '
             'stroke-linecap="round"/>' % (z(sx-0.5), z(sy), z(sx-0.5), z(sy-42), G["holz"]))
    arme = [("Innenstadt", -1, 40), ("Behörden", -1, 34), ("Kultur", 1, 40),
            ("Wohnen", -1, 28), ("Gewerbe", 1, 34), ("Stadtrand", 1, 28),
            ("Im Grünen", -1, 22)]
    for text, richtung, hoehe in arme:
        b = len(text) * 3.5 + 9
        x0 = sx + (1.4 if richtung > 0 else -1.4 - b)
        y0 = sy - hoehe
        spitze = 4.2
        if richtung > 0:
            d = ("M%s %s h%s l%s 3.2 l%s 3.2 h-%s Z"
                 % (z(x0), z(y0), z(b-spitze), z(spitze), z(-spitze), z(b-spitze)))
        else:
            d = ("M%s %s h%s v6.4 h-%s l%s -3.2 Z"
                 % (z(x0+spitze), z(y0), z(b-spitze), z(b-spitze), z(-spitze)))
        s.append('<path d="%s" fill="%s" stroke="%s" stroke-width="0.4"/>'
                 % (d, G["holz"], G["holz_d"]))
        s.append('<text x="%s" y="%s" font-family="system-ui,-apple-system,'
                 'Segoe UI,Roboto,sans-serif" font-size="4.4" font-weight="700" '
                 'fill="#4a3417" text-anchor="middle">%s</text>'
                 % (z(x0 + b/2 + (spitze/2 if richtung > 0 else -spitze/2)),
                    z(y0 + 4.6), text))
    return "".join(s)

# ---------------------------------------------------------------- Einbauen
def zeichne_teile():
    """Jedes Viertel wird EIN Teil: die Haeuser und das Schild darunter.
    Der Ursprung des Teils liegt in seiner Weltmitte."""
    teile = {}
    for tid, _de, (wx, wy) in VIERTEL:
        ox, oy = P(wx, wy, 0)
        stueck = BAUER[tid](wx, wy)
        name = dict((v[0], v[1]) for v in VIERTEL)[tid]
        text = name.split(" ", 1)[1] if " " in name else name
        s = schild(ox, oy + 6, text.upper())
        # alles auf den Ursprung des Teils beziehen
        teile[tid] = ('<g transform="translate(%s,%s)">' % (z(-ox), z(-oy))
                      + stueck + s + "</g>")
    return teile

def einbauen():
    txt = open(SZENE, encoding="utf-8").read()
    i = txt.index('{"id"'); j = txt.rindex("};")
    d = json.loads(txt[i:j+1])
    sicher = os.path.join(WURZEL, "sicherung",
                          datetime.datetime.now().strftime("%Y-%m-%d") + "-stadt")
    os.makedirs(sicher, exist_ok=True)
    if not os.path.exists(os.path.join(sicher, "stadt.js")):
        shutil.copy2(SZENE, sicher)

    d["kulisse"] = kulisse()
    teile = zeichne_teile()
    for t in d["teile"]:
        if t["id"] in teile:
            wx, wy = dict((v[0], v[2]) for v in VIERTEL)[t["id"]]
            ox, oy = P(wx, wy, 0)
            t["x"] = round(ox, 1)
            t["y"] = round(oy, 1)
            t["kunst"] = teile[t["id"]]
    if not any(t["id"] == "wegweiser" for t in d["teile"]):
        wx, wy = 25.6, 45.4
        ox, oy = P(wx, wy, 0)
        d["teile"].append({
            "id": "wegweiser", "de": "der Wegweiser", "syl": "der Weg-wei-ser",
            "it": "il cartello indicatore", "itSyl": "il car-tel-lo in-di-ca-to-re",
            "en": "the signpost",
            "x": round(ox, 1), "y": round(oy, 1),
            "kunst": '<g transform="translate(%s,%s)">%s</g>'
                     % (z(-ox), z(-oy), wegweiser()),
        })
    open(SZENE, "w", encoding="utf-8").write(
        txt[:i] + json.dumps(d, ensure_ascii=False, separators=(",", ":")) + txt[j+1:])
    print("Stadt neu: Kulisse %d Zeichen, %d Teile" % (len(d["kulisse"]), len(d["teile"])))

if __name__ == "__main__":
    if "-p" in sys.argv:
        t = zeichne_teile()
        print('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d">%s%s%s</svg>'
              % (BREITE, HOEHE, BREITE*2, kulisse(),
                 "".join(t.values()).replace('transform="translate(', 'transform="translate(')
                 if False else "".join(
                    '<g transform="translate(%s,%s)">%s</g>' % (
                        z(P(v[2][0], v[2][1])[0]), z(P(v[2][0], v[2][1])[1]), t[v[0]])
                    for v in VIERTEL),
                 wegweiser()))
    else:
        einbauen()
