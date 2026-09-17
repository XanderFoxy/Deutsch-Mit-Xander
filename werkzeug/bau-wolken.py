#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ECHTE WATTEWOLKEN FÜR DIE WETTERECKE
====================================

GEMELDET: „Die Wolken sind nicht realistisch. Die sind viel zu
comicartig. Bring da wieder absoluten Realismus rein. Weiche schöne
Wattewolken, die so Strukturen haben, dass man im Himmel so Sachen
erkennen kann, wie das im Original auch ist. Die sind nicht alle so
gleich, die sind eher zufällig und haben unterschiedliche Formen, sind
interessant, haben manchmal Spitzen, manchmal weiche Züge und wirken
eher wie rauchige Nebel manchmal. Die sind ziemlich unberechenbar."

WARUM DER ERSTE VERSUCH COMICARTIG BLIEB — und es auch bleiben MUSSTE:
er bestand aus radialen Farbverläufen. Ein Farbverlauf ist ein Kreis
oder eine Ellipse, sonst nichts. Man kann dreissig davon nebeneinander
legen und sie ineinander laufen lassen — es bleiben dreissig Ellipsen,
und der Rand bleibt eine Kette von Bögen. Genau daran erkennt das Auge
eine gezeichnete Wolke.

Eine echte Wolke hat einen ZERFRANSTEN Rand: hier eine Spitze, dort
eine ausgefranste Kante, da ein Stück, das sich schon in Dunst
auflöst. Diese Unregelmässigkeit ist nicht hübsches Beiwerk — sie IST
das, was eine Wolke ausmacht.

DER WEG DAHIN: ein Rauschfilter. feTurbulence erzeugt fraktales
Rauschen, wie es in der Natur vorkommt (dieselbe Mathematik steckt
hinter gezeichneten Bergketten, Feuer und Marmor). feDisplacementMap
schiebt damit jeden Punkt der Wolkenform ein Stück beiseite — viel an
manchen Stellen, wenig an anderen. Aus einer glatten Ellipsenkette wird
so ein Rand, der sich nicht vorhersagen lässt: an einer Stelle spitz,
an der nächsten weich, an der dritten in Fetzen.

WIE ES IN DIE SEITE KOMMT: die Farbe darf nicht im Bild stecken,
sonst liessen sich die Wolken nicht mehr nach der Tageszeit einfärben.
Deshalb ist das Erzeugte kein Bild, sondern eine MASKE — schwarz, wo
Wolke ist, durchsichtig, wo Himmel ist. Die Farbe kommt weiterhin aus
den CSS-Werten (--w-wolke-hell und so fort). Drei Lagen übereinander:
Unterseite, Körper, beleuchtete Krone — jede mit ihrer eigenen Maske,
ihrem eigenen Rauschen und ihrem eigenen Versatz.

    python3 werkzeug/bau-wolken.py
"""

import io
import math
import os
import random
import urllib.parse

HIER = os.path.dirname(os.path.abspath(__file__))
ZIEL = os.path.join(os.path.dirname(HIER), "app-styles.css")

MARKE_AUF = "/* WOLKEN-ANFANG — erzeugt von werkzeug/bau-wolken.py */"
MARKE_ZU = "/* WOLKEN-ENDE */"

# Die Kachel. Sie wiederholt sich seitlich, also muss alles, was am
# rechten Rand hinausragt, links wieder hereinkommen — darum wird jede
# Wolke, die den Rand berührt, ein zweites Mal um eine Kachelbreite
# versetzt gezeichnet.
BREIT = 600
HOCH = 100


def haufen(r, mitte_x, boden, breite, hoehe, wieviel):
    """Eine Haufenwolke: viele Buckel, oben bauschig, unten flach.

    Das ist nur die GROBFORM. Das Rauschen macht daraus gleich etwas,
    das nicht mehr nach Ellipsen aussieht.
    """
    ballen = []
    for i in range(wieviel):
        t = (i + 0.5) / wieviel
        # Die Kuppe ist in der Mitte am hoechsten, aber nicht symmetrisch:
        # eine echte Wolke hat ihren Gipfel selten in der Mitte.
        schief = 0.35 + r.random() * 0.3
        kuppe = math.sin(min(1.0, t / schief if t < schief else
                             (1 - t) / (1 - schief)) * math.pi / 2) ** 0.8
        x = mitte_x + (t - 0.5) * breite + r.uniform(-breite * 0.04, breite * 0.04)
        gross = (0.3 + 0.7 * kuppe) * (0.75 + r.random() * 0.5)
        rx = breite * 0.15 * gross
        ry = hoehe * 0.6 * gross
        y = boden - ry * 0.5 - hoehe * 0.38 * kuppe
        ballen.append((x, y, rx, ry))
    return ballen


def form(ballen):
    return "".join(
        '<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f"/>' % b for b in ballen
    )


def wolkensvg(lage, saat):
    """Eine Maske: schwarz, wo Wolke ist. Die Farbe kommt aus der CSS.

    lage: 0 = Unterseite, 1 = Koerper, 2 = Krone
    """
    r = random.Random(saat)

    # Drei bis vier Wolken je Kachel, alle verschieden gross und
    # verschieden weit oben — nichts soll sich wiederholen.
    # WICHTIG: die Kachel bleibt an ihren Raendern LEER. Eine Wolke,
    # die ueber den Rand hinausragt, muesste drueben nahtlos wieder
    # hereinkommen — und genau das kann das Rauschen nicht: es haengt
    # an der Stelle im Bild, nicht an der Form. An der Nahtstelle
    # entstuende ein sichtbarer Schnitt. Bleibt der Rand frei, faellt
    # die Naht in leeren Himmel und ist unsichtbar.
    RAND = 70
    wolken = []
    x = RAND + r.uniform(10, 50)
    while x < BREIT - RAND:
        breite = r.uniform(90, 220)
        if x + breite / 2 > BREIT - RAND:
            break
        hoehe = r.uniform(26, 52)
        boden = r.uniform(HOCH * 0.52, HOCH * 0.78)
        wieviel = r.randint(9, 16)
        wolken.append(haufen(r, x, boden, breite, hoehe, wieviel))
        x += breite * r.uniform(0.9, 1.6)

    # Die Krone ist kleiner und sitzt hoeher, die Unterseite groesser
    # und tiefer.
    hoch = {0: 4.0, 1: 0.0, 2: -3.2}[lage]
    weit = {0: 1.03, 1: 1.0, 2: 0.74}[lage]

    inhalt = []
    for ballen in wolken:
        verschoben = [(bx, by + hoch, brx * weit, bry * weit) for (bx, by, brx, bry) in ballen]
        inhalt.append(form(verschoben))

    # Das Rauschen. Grobe Frequenz = grosse Ausbuchtungen, feine =
    # ausgefranste Kanten. Beides zusammen ergibt eine Wolke, die von
    # Weitem eine Form hat und von Nahem zerfasert ist.
    grob = 0.006 + r.random() * 0.004
    fein = 0.03 + r.random() * 0.02
    staerke = {0: 22, 1: 26, 2: 18}[lage]
    weich = {0: 2.4, 1: 1.6, 2: 1.1}[lage]

    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" '
        'viewBox="0 0 %d %d">'
        # Der Filterbereich muss WEIT groesser sein als die Form:
        # das Rauschen schiebt Punkte nach aussen, und was ausserhalb
        # des Bereichs landet, wird abgeschnitten — als schnurgerade
        # Kante mitten in der Wolke. Genau die war beim ersten Versuch
        # zu sehen.
        '<filter id="f" x="-80%%" y="-200%%" width="260%%" height="500%%" '
        'color-interpolation-filters="sRGB">'
        '<feTurbulence type="fractalNoise" baseFrequency="%.4f %.4f" '
        'numOctaves="5" seed="%d" stitchTiles="stitch" result="rau"/>'
        # ERST WEICHZEICHNEN, DANN VERZERREN. Sonst stehen an den
        # Raendern kleine harte Quadrate: die Verzerrung greift eine
        # scharfe Kante und schiebt sie als Block beiseite. Eine
        # weiche Kante dagegen zerfliesst dabei — und genau das soll
        # eine Wolke tun.
        '<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="weich"/>'
        '<feDisplacementMap in="weich" in2="rau" scale="%d" '
        'xChannelSelector="R" yChannelSelector="G" result="verzerrt"/>'
        '<feGaussianBlur in="verzerrt" stdDeviation="%.1f"/>'
        '</filter>'
        '<g filter="url(#f)" fill="#000">%s</g>'
        '</svg>'
        % (BREIT, HOCH, BREIT, HOCH, grob, fein, saat % 900,
           staerke, weich, "".join(inhalt))
    )
    return svg


def alsUrl(svg):
    return 'url("data:image/svg+xml,%s")' % urllib.parse.quote(svg, safe="")


def bauen():
    unten = alsUrl(wolkensvg(0, 20260917))
    koerper = alsUrl(wolkensvg(1, 20260917))
    krone = alsUrl(wolkensvg(2, 20260917))

    css = [MARKE_AUF, """/* Drei Lagen, jede eine eigene Maske aus fraktalem Rauschen:
   ::before  die Unterseite (tiefer, kuehler)
   der Kern  der Koerper der Wolke
   ::after   die beleuchtete Krone (hoeher, kleiner, heller)

   Die Masken sind schwarzweiss — die FARBE kommt aus den CSS-Werten,
   damit die Tageszeit sie weiterhin einfaerben kann. */""",
".w-wolkenband {",
"  position: absolute;",
"  top: 0; left: 0;",
"  width: 200%; height: 100%;",
"  background-color: var(--w-wolke-hell);",
"  -webkit-mask-image: " + koerper + ";",
"          mask-image: " + koerper + ";",
"  -webkit-mask-repeat: repeat-x;",
"          mask-repeat: repeat-x;",
"  -webkit-mask-size: var(--w-kachel) 100%;",
"          mask-size: var(--w-kachel) 100%;",
"  animation: wZiehen 96s linear infinite;",
"  will-change: transform;",
"}",
".w-wolkenband::before,",
".w-wolkenband::after {",
"  content: \"\";",
"  position: absolute;",
"  inset: 0;",
"  pointer-events: none;",
"  -webkit-mask-repeat: repeat-x;",
"          mask-repeat: repeat-x;",
"  -webkit-mask-size: var(--w-kachel) 100%;",
"          mask-size: var(--w-kachel) 100%;",
"}",
".w-wolkenband::before {",
"  z-index: -1;",
"  background-color: var(--w-wolke-schatten);",
"  -webkit-mask-image: " + unten + ";",
"          mask-image: " + unten + ";",
"}",
".w-wolkenband::after {",
"  background-color: var(--w-wolke-oben);",
"  -webkit-mask-image: " + krone + ";",
"          mask-image: " + krone + ";",
"}",
"@keyframes wZiehen {",
"  from { transform: translate3d(0, 0, 0); }",
"  to   { transform: translate3d(calc(-1 * var(--w-kachel)), 0, 0); }",
"}",
"""/* Drei Schichten, drei Tempi, drei Größen — vorn groß und etwas
   schneller, hinten klein, blass und sehr langsam. Daraus entsteht
   Tiefe. Und sie ziehen langsam: Wolken rennen nicht. */
.w-wb1 { --w-kachel: 460px; opacity: 0.92; animation-duration: 104s; }
.w-wb2 { --w-kachel: 600px; opacity: 0.6;  animation-duration: 172s; height: 86%; }
.w-wb3 { --w-kachel: 760px; opacity: 0.34; animation-duration: 248s; height: 70%; }""",
MARKE_ZU]
    return "\n".join(css)


def main():
    s = io.open(ZIEL, encoding="utf-8").read()
    neu = bauen()
    if MARKE_AUF not in s or MARKE_ZU not in s:
        raise SystemExit("Marken nicht gefunden — nichts geändert.")
    a = s.index(MARKE_AUF)
    b = s.index(MARKE_ZU) + len(MARKE_ZU)
    io.open(ZIEL, "w", encoding="utf-8").write(s[:a] + neu + s[b:])
    print("Wolken neu geschrieben (%d Zeichen CSS)" % len(neu))


if __name__ == "__main__":
    main()
