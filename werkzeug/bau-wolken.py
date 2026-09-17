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

    # NACHGEBESSERT: „Bei den Wolken gibt es zu lange Strecken ohne
    # Wolken." Das stimmte, und es waren zwei Ursachen zugleich:
    #
    #   1. Der Schritt war x += breite * uniform(0.9, 1.6). Bei 1.6
    #      bleibt hinter einer Wolke eine Luecke von 0.6 ihrer Breite
    #      stehen — bei 220 Einheiten Breite also 130 Einheiten blauer
    #      Himmel am Stueck.
    #   2. Beide Raender blieben 70 Einheiten frei, zusammen 140 von
    #      600. Fast ein Viertel der Kachel war von vornherein leer.
    #
    # Der freie Rand hat einen echten Grund, und er gilt weiter: eine
    # Wolke, die ueber den Rand hinausragt, muesste drueben nahtlos
    # wieder hereinkommen. Das Rauschen haengt aber an der STELLE im
    # Bild, nicht an der Form — an der Naht entstuende ein sichtbarer
    # Schnitt. Bleibt der Rand frei, faellt die Naht in leeren Himmel.
    #
    # Also wird der Rand nur SCHMALER (30 statt 70), und dafuer wird
    # der Rest dicht gefuellt: Schritte, die sich ueberlappen, und in
    # die verbleibenden Luecken kommen kleine Fetzen. Ein Himmel ohne
    # jede Luecke waere kein Himmel, sondern eine Decke — es geht um
    # LANGE Luecken, nicht um alle.
    # 34 Einheiten Rand. Das Rauschen schiebt die Kanten um bis zu 26
    # nach aussen und der Weichzeichner noch ein Stueck — weniger
    # Rand, und die Franse wuerde am Kachelrand abgeschnitten.
    RAND = 34
    wolken = []
    belegt = []          # (von, bis) je Wolke, aus den ECHTEN Ballen

    def weite(ballen):
        """Wie weit reicht diese Wolke wirklich?

        NICHT die nominelle Breite nehmen. Genau daran lag es beim
        ersten Versuch: haufen() verteilt die Ballen mit
        unterschiedlicher Groesse, und die aeusseren sind die
        kleinsten — die Wolke ist also deutlich SCHMALER als ihre
        Breite angibt. Gerechnet wurde aber mit der Breite, und
        deshalb hielt der Fueller eine Luecke fuer geschlossen, in der
        in Wahrheit 90 Einheiten blauer Himmel standen."""
        return (min(bx - brx for (bx, by, brx, bry) in ballen),
                max(bx + brx for (bx, by, brx, bry) in ballen))

    x = RAND + r.uniform(4, 18)
    while x < BREIT - RAND:
        breite = r.uniform(90, 220)
        hoehe = r.uniform(26, 52)
        boden = r.uniform(HOCH * 0.52, HOCH * 0.78)
        wieviel = r.randint(9, 16)
        ballen = haufen(r, x, boden, breite, hoehe, wieviel)
        von, bis = weite(ballen)
        # Wer ueber den Rand ragt, kommt nicht hinein. Ein Stueck
        # Wolke, das an der Naht abgeschnitten wird, sieht man sofort.
        if von < RAND or bis > BREIT - RAND:
            x += breite * 0.4
            if x > BREIT - RAND:
                break
            continue
        wolken.append(ballen)
        belegt.append((von, bis))
        # 0.62 bis 1.05: die Wolken beruehren sich meist oder ueber-
        # lappen leicht. Ueber 1.0 gibt es noch Luecken, aber kurze.
        x += breite * r.uniform(0.62, 1.05)

    # Und jetzt die Luecken schliessen, die trotzdem geblieben sind.
    # Nicht mit weiteren Haufenwolken — dann saehe der Himmel aus wie
    # eine Reihe gleicher Ballen. Mit FETZEN: flach, klein, tiefer
    # haengend. So sieht es aus wie abgerissene Wolkenreste zwischen
    # den grossen, und das ist genau das, was zwischen Haufenwolken
    # wirklich steht.
    LUECKE_MAX = 40      # laenger darf kein Stueck blanker Himmel sein
    # So lange fuellen, bis nichts mehr zu fuellen ist. Ein einziger
    # Durchgang reicht nicht: ein Fetzen ist selbst schmaler, als er
    # aussieht, und hinterlaesst wieder eine kleine Luecke.
    for durchgang in range(4):
        belegt.sort()
        kante = RAND
        luecken = []
        for (von, bis) in belegt + [(BREIT - RAND, BREIT - RAND)]:
            if von - kante > LUECKE_MAX:
                luecken.append((kante, von))
            kante = max(kante, bis)
        if not luecken:
            break
        for (von, bis) in luecken:
            stelle = von
            steckt = 0
            while bis - stelle > LUECKE_MAX and steckt < 6:
                # Der Fetzen wird so breit gemacht, wie die Luecke es
                # zulaesst — aber nie breiter als 110, sonst ist es
                # kein Fetzen mehr, sondern wieder eine Haufenwolke.
                #
                # WICHTIG: passt er nicht, wird er KLEINER versucht und
                # nicht aufgegeben. Genau daran scheiterte der Versuch
                # davor: am rechten Rand passte der erste Vorschlag
                # nicht, die Schleife brach ab — und hundert Einheiten
                # Himmel blieben leer.
                gelegt = False
                for fb in (min(110, max(50, (bis - stelle) * 1.5)), 86, 68, 54, 44):
                    ballen = haufen(r, stelle + fb * 0.32,
                                    r.uniform(HOCH * 0.56, HOCH * 0.80),
                                    fb, r.uniform(14, 26), r.randint(6, 10))
                    fvon, fbis = weite(ballen)
                    if fvon < RAND or fbis > BREIT - RAND or fbis <= stelle:
                        continue
                    wolken.append(ballen)
                    belegt.append((fvon, fbis))
                    stelle = fbis
                    gelegt = True
                    break
                if not gelegt:
                    steckt += 1
                    stelle += 18

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


def luecke_messen(svg):
    """Wie lang ist die laengste Strecke ohne Wolke?

    GEMELDET: „Bei den Wolken gibt es zu lange Strecken ohne Wolken."

    Das ist eine ZAHL, keine Geschmacksfrage — also wird sie gemessen
    statt beurteilt. Aus der fertigen Maske werden alle Ellipsen
    gelesen und ihre waagerechten Ausdehnungen zusammengelegt; was
    dazwischen frei bleibt, ist blauer Himmel am Stueck.

    Das Rauschen schiebt die Raender noch einmal um bis zu 26
    Einheiten nach aussen, die Luecke ist in Wirklichkeit also eher
    kleiner. Hier wird bewusst die STRENGERE Zahl genommen: lieber zu
    dicht gerechnet als zu grosszuegig.
    """
    import re
    stuecke = []
    for m in re.finditer(r'cx="([\d.]+)" cy="[\d.]+" rx="([\d.]+)"', svg):
        cx, rx = float(m.group(1)), float(m.group(2))
        stuecke.append((cx - rx, cx + rx))
    if not stuecke:
        return BREIT, 0
    stuecke.sort()
    laengste = stuecke[0][0]          # vom linken Rand bis zur ersten Wolke
    kante = stuecke[0][1]
    for (von, bis) in stuecke[1:]:
        if von > kante:
            laengste = max(laengste, von - kante)
        kante = max(kante, bis)
    laengste = max(laengste, BREIT - kante)   # und bis zum rechten Rand
    return laengste, len(stuecke)


def bauen():
    roh_unten = wolkensvg(0, 20260917)
    roh_koerper = wolkensvg(1, 20260917)
    roh_krone = wolkensvg(2, 20260917)

    # Die Probe aufs Exempel, bei JEDEM Bauen. Reisst die laengste
    # Luecke wieder auf, bricht das Werkzeug ab, statt einen luechrigen
    # Himmel hochzuladen. Grenze: 70 von 600 Einheiten. Auf dem
    # vordersten Band (460 Pixel breit) sind das rund 54 Pixel — eine
    # Luecke zwischen zwei Wolken, kein Loch.
    GRENZE = 70
    schlimm = []
    for name, roh in (("Unterseite", roh_unten), ("Koerper", roh_koerper),
                      ("Krone", roh_krone)):
        luecke, wieviele = luecke_messen(roh)
        print("  %-11s %3d Ballen, laengste Luecke %5.1f von %d"
              % (name, wieviele, luecke, BREIT))
        if luecke > GRENZE:
            schlimm.append("%s: %.1f" % (name, luecke))
    if schlimm:
        raise SystemExit("ZU LANGE LUECKEN — nichts geschrieben: " + ", ".join(schlimm))

    unten = alsUrl(roh_unten)
    koerper = alsUrl(roh_koerper)
    krone = alsUrl(roh_krone)

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
