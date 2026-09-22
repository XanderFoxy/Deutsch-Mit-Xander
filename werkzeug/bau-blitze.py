#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
BLITZE BAUEN — AUS DER MITTE, WIE IN EINER PLASMAKUGEL
---------------------------------------------------------------------
XANDER (Runde 73): „Die filigranen Stromstoesse — das sind nur
irgendwie Knicklinien, aber die haben keine Veraestelungen und
Verjuengung, wie das richtige Blitze haben."

XANDER (Runde 80): „Der Strom ist mir ein bisschen filigran … es
sieht immer noch nicht nach diesen typischen Blitzen aus. Ausserdem
sollen die von der Mitte ausgehen."

Drei Aenderungen, und jede hat ihren Grund:

  1. AUS DER MITTE. Vorher startete jeder Kanal an einer BILDKANTE
     und lief quer durchs Bild — deshalb sah es aus wie ein Netz,
     nicht wie eine Entladung. Jetzt sitzt der Fusspunkt im Kern
     (50,50), und die Kanaele laufen nach aussen bis kurz vor den
     Rand: das ist die Plasmakugel, die er meint.
  2. TYPISCHE BLITZFORM. Ein echter Blitz laeuft ein Stueck GERADE
     und knickt dann ABRUPT — er schlaengelt nicht. Deshalb dreht
     die Richtung jetzt nicht mehr bei jedem Abschnitt ein bisschen,
     sondern bleibt meistens fast stehen und springt an wenigen
     Stellen scharf (KNICK_CHANCE). Dazwischen ziehen laengere
     Abschnitte durch.
  3. NICHT MEHR SO FILIGRAN. „Ein bisschen filigran" heisst: zu
     duenn. Der Kern war 0,34 breit — das ist unter einem Pixel.
     Jetzt 0,62, Mantel und Saum entsprechend. Die AESTE bleiben
     haarfein, damit die Struktur fein bleibt und nur der Hauptkanal
     traegt.

Drei Schichten uebereinander machen das Leuchten: ein dunkler Saum
(damit er auf hellem Grund steht), ein blauer Mantel und ein weisser
Kern.

    python3 werkzeug/bau-blitze.py          # zeigt nur an
    python3 werkzeug/bau-blitze.py --machen # schreibt korrekturen.css
=====================================================================
"""
import math, random, sys, io, os, re
from urllib.parse import quote

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# RUNDE 80 — „ein bisschen filigran": jede Schicht ein gutes Stueck
# breiter als vorher (Kern war 0,34 — unter einem Bildpunkt).
SAUM  = ("#0a1428", 1.70, .30)   # dunkel, damit er auf Creme steht
MANTEL= ("#4fb0ff", 1.05, .52)   # das blaue Glimmen
KERN  = ("#ffffff", 0.62, .95)   # der weisse Kanal

MITTE = 50.0
RAND  = 47.0        # so weit darf ein Kanal hoechstens nach aussen
KNICK_CHANCE = 0.34 # an so vielen Knoten knickt es scharf
MAX_AB = 1.26       # 72 Grad — soweit darf ein Kanal von "nach aussen" abweichen


def kanal(x, y, rich, lang, teile, dick, tiefe, aus, ast=False):
    """Ein Kanal aus einzelnen, immer duenner werdenden Abschnitten.
       Gibt die Knoten zurueck, an denen ein Ast abzweigen darf."""
    knoten = []
    for i in range(teile):
        # RUNDE 80 — die typische Blitzform: meistens fast geradeaus,
        # an wenigen Stellen ein scharfer Knick. Vorher drehte es bei
        # JEDEM Abschnitt um bis zu 0,55 rad — das schlaengelt.
        if random.random() < KNICK_CHANCE:
            rich += random.choice([-1, 1]) * random.uniform(0.45, 0.85)
        else:
            rich += random.uniform(-0.10, 0.10)
        # Ein Blitz aus der Mitte laeuft NACH AUSSEN. Knickt er soweit,
        # dass er zurueck zum Kern zeigt, sieht es aus wie ein Nervenbild
        # statt wie eine Entladung — also wird er auf hoechstens 72 Grad
        # neben der Richtung nach aussen zurueckgeholt.
        raus = math.atan2(y - MITTE, x - MITTE)
        ab = (rich - raus + math.pi) % (2 * math.pi) - math.pi
        if abs(ab) > MAX_AB:
            rich = raus + math.copysign(MAX_AB, ab)
        s = lang / teile * random.uniform(0.75, 1.25)
        nx, ny = x + math.cos(rich) * s, y + math.sin(rich) * s
        # Die Verjuengung: linear vom Anfang bis zur Spitze.
        d0 = dick * (1 - i / teile * 0.86)
        d1 = dick * (1 - (i + 1) / teile * 0.86)
        aus.append(((x, y), (nx, ny), max(0.12, (d0 + d1) / 2)))
        if 0 < i < teile - 1:
            knoten.append((nx, ny, rich, d1))
        x, y = nx, ny
        # Der Kanal endet am Bildrand — nicht daneben.
        if math.hypot(x - MITTE, y - MITTE) > RAND:
            break
    # Die Aeste: schmaler, kuerzer, und sie laufen ganz aus.
    if tiefe > 0:
        random.shuffle(knoten)
        for (bx, by, br, bd) in knoten[:random.randint(1, 2)]:
            ab = br + random.choice([-1, 1]) * random.uniform(0.5, 1.1)
            # Auch ein Ast zeigt nach aussen, sonst kriecht er zurueck
            # in den Kern.
            braus = math.atan2(by - MITTE, bx - MITTE)
            d = (ab - braus + math.pi) % (2 * math.pi) - math.pi
            if abs(d) > 1.45:
                ab = braus + math.copysign(1.45, d)
            kanal(bx, by, ab, lang * random.uniform(0.3, 0.5),
                  max(2, teile // 2), bd * 0.58, tiefe - 1, aus, True)
    return aus


def blitz_svg(saat, wieviel=7):
    random.seed(saat)
    striche = []
    # RUNDE 80 — „die sollen von der Mitte ausgehen": alle Kanaele
    # haben denselben Fusspunkt. Die Richtungen werden gleichmaessig
    # auf den Vollkreis verteilt (und leicht verwackelt), damit keine
    # Seite leer bleibt.
    grund = random.uniform(0, 2 * math.pi)
    for k in range(wieviel):
        r = grund + k * (2 * math.pi / wieviel) + random.uniform(-0.28, 0.28)
        # Der Fusspunkt sitzt im Kern, nicht exakt auf dem Punkt —
        # sonst treffen sich sieben Linien in einem Pixel.
        fx = MITTE + math.cos(r) * random.uniform(1.5, 4.5)
        fy = MITTE + math.sin(r) * random.uniform(1.5, 4.5)
        kanal(fx, fy, r, random.uniform(40, 52), random.randint(7, 10),
              random.uniform(1.25, 1.65), 2, striche)
    teile = []
    for farbe, mal, deck in (SAUM, MANTEL, KERN):
        for (a, b, d) in striche:
            teile.append(
                '<path d="M%.1f,%.1f L%.1f,%.1f" fill="none" stroke="%s"'
                ' stroke-width="%.2f" stroke-linecap="round" opacity="%.2f"/>'
                % (a[0], a[1], b[0], b[1], farbe, max(0.1, d * mal), deck))
    # Der gluehende Kern der Plasmakugel — daher kommen die Blitze.
    teile.append('<circle cx="50" cy="50" r="6.2" fill="%234fb0ff"'
                 ' opacity="0.30"/>'.replace("%23", "#"))
    teile.append('<circle cx="50" cy="50" r="2.8" fill="#ffffff"'
                 ' opacity="0.85"/>')
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
            + "".join(teile) + "</svg>")


def main():
    machen = "--machen" in sys.argv
    zeilen = []
    for i in range(3):
        svg = blitz_svg(4711 + i * 97)
        zeilen.append('  --lc-strom-%d: url("data:image/svg+xml,%s");'
                      % (i, quote(svg, safe="")))
        print("Blitzbild %d: %d Striche, %d Zeichen"
              % (i, svg.count("<path"), len(zeilen[-1])))
    if not machen:
        print("\n(nur angezeigt — mit --machen wird korrekturen.css geschrieben)")
        return
    p = os.path.join(WURZEL, "korrekturen.css")
    s = io.open(p, encoding="utf-8").read()
    for i in range(3):
        muster = re.compile(r'^  --lc-strom-%d: url\("data:image/svg\+xml,[^"]*"\);$' % i,
                            re.M)
        assert muster.search(s), "--lc-strom-%d nicht gefunden" % i
        s = muster.sub(lambda m, z=zeilen[i]: z, s, count=1)
    io.open(p, "w", encoding="utf-8").write(s)
    print("\nkorrekturen.css geschrieben.")


main()
