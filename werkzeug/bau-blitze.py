#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
BLITZE BAUEN — MIT VERÄSTELUNG UND VERJÜNGUNG
---------------------------------------------------------------------
XANDER: „Die filigranen Stromstöße — das sind nur irgendwie
Knicklinien, aber die haben keine Verästelungen und Verjüngung, wie
das richtige Blitze haben. Das soll richtig wie Blitze aussehen von
der Struktur, trotzdem filigran bleiben."

Er hat den Fehler genau benannt. In korrekturen.css standen drei
fertige SVG-Bilder, und darin war jeder Blitz EIN Pfad mit EINER
Strichstärke von Anfang bis Ende — also eine geknickte Linie. Ein
echter Blitz hat zwei Eigenschaften, die dieser Linie fehlen:

  1. VERJÜNGUNG. Der Kanal ist oben am dicksten und läuft zur Spitze
     hin dünn aus. Ein Pfad kann seine Strichstärke aber nicht
     unterwegs ändern — deshalb wird jeder Blitz hier aus EINZELNEN
     Abschnitten gezeichnet, jeder etwas dünner als der vorige.
  2. VERÄSTELUNG. An mehreren Knoten zweigen kleinere Kanäle ab, die
     ihrerseits dünner sind und wieder auslaufen. Ohne sie sieht es
     aus wie ein Kabel, nicht wie eine Entladung.

Drei Schichten übereinander machen das Leuchten: ein dunkler Saum
(damit er auf hellem Grund steht), ein blauer Mantel und ein weisser
Kern. Filigran bleibt es, weil der Kern nie dicker als 0,8 ist.

    python3 werkzeug/bau-blitze.py          # zeigt nur an
    python3 werkzeug/bau-blitze.py --machen # schreibt korrekturen.css
=====================================================================
"""
import math, random, sys, io, os, re
from urllib.parse import quote

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SAUM  = ("#0a1428", 1.55, .26)   # dunkel, damit er auf Creme steht
MANTEL= ("#4fb0ff", 1.00, .46)   # das blaue Glimmen
KERN  = ("#ffffff", 0.34, .92)   # der weisse Kanal

def kanal(x, y, rich, lang, teile, dick, tiefe, aus):
    """Ein Kanal aus einzelnen, immer dünner werdenden Abschnitten.
       Gibt die Knoten zurück, an denen ein Ast abzweigen darf."""
    knoten = []
    for i in range(teile):
        # Der Blitz zuckt: die Richtung dreht bei jedem Abschnitt.
        rich += random.uniform(-0.55, 0.55)
        s = lang / teile * random.uniform(0.7, 1.3)
        nx, ny = x + math.cos(rich) * s, y + math.sin(rich) * s
        # Die Verjüngung: linear vom Anfang bis zur Spitze.
        d0 = dick * (1 - i / teile * 0.86)
        d1 = dick * (1 - (i + 1) / teile * 0.86)
        aus.append(((x, y), (nx, ny), max(0.12, (d0 + d1) / 2)))
        if 0 < i < teile - 1:
            knoten.append((nx, ny, rich, d1))
        x, y = nx, ny
        if not (0 <= x <= 100 and 0 <= y <= 100):
            break
    # Die Äste: schmaler, kürzer, und sie laufen ganz aus.
    if tiefe > 0:
        random.shuffle(knoten)
        for (bx, by, br, bd) in knoten[:random.randint(1, 2)]:
            ab = br + random.choice([-1, 1]) * random.uniform(0.5, 1.1)
            kanal(bx, by, ab, lang * random.uniform(0.3, 0.5),
                  max(2, teile // 2), bd * 0.62, tiefe - 1, aus)
    return aus

def blitz_svg(saat, wieviel=4):
    random.seed(saat)
    striche = []
    for _ in range(wieviel):
        # Von einer Kante zur gegenüberliegenden — so durchzieht er das Bild.
        rand = random.randint(0, 3)
        if rand == 0:   x, y, r = random.uniform(15, 85), 3, math.pi / 2
        elif rand == 1: x, y, r = random.uniform(15, 85), 97, -math.pi / 2
        elif rand == 2: x, y, r = 3, random.uniform(15, 85), 0
        else:           x, y, r = 97, random.uniform(15, 85), math.pi
        r += random.uniform(-0.5, 0.5)
        # Mehr, kürzere Abschnitte: dann ist die Verjüngung fein
        # statt stufig, und es bleibt filigran.
        kanal(x, y, r, random.uniform(70, 95), random.randint(9, 12),
              random.uniform(1.15, 1.5), 2, striche)
    teile = []
    for farbe, mal, deck in (SAUM, MANTEL, KERN):
        for (a, b, d) in striche:
            teile.append(
                '<path d="M%.1f,%.1f L%.1f,%.1f" fill="none" stroke="%s"'
                ' stroke-width="%.2f" stroke-linecap="round" opacity="%.2f"/>'
                % (a[0], a[1], b[0], b[1], farbe, max(0.1, d * mal), deck))
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
