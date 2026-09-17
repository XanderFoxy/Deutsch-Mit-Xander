#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
WATTEWOLKEN FÜR DIE WETTERECKE
==============================

GEWÜNSCHT: „Die Wolkenanimation im Header kann noch realistischer sein.
Die sehen zwar schon deutlich besser aus als vorher, aber die können
noch filigranere Struktur haben und wirklich schön langsam und gemütlich
richtig schöne Wattewolken sein — klare weisse Wattewolken, je nach
Tageszeit, dass sie dann ein bisschen angepasst sind."

WAS EINE WATTEWOLKE AUSMACHT — und was bisher fehlte:

  1. VIELE Ballen, nicht drei. Eine Haufenwolke ist ein Gedränge aus
     zwölf bis zwanzig Buckeln unterschiedlicher Grösse. Vorher waren
     es drei grosse Ellipsen je Wolke; das liest sich als Schleier,
     nicht als Watte.

  2. EIN LICHTRAND OBEN. Die Sonne steht über der Wolke, also ist die
     Oberseite jedes Buckels heller als seine Unterseite. Genau dieser
     Rand macht aus einem Fleck einen Körper.

  3. EINE FLACHE UNTERSEITE. Haufenwolken schweben auf einer
     gemeinsamen Höhe — dort, wo der Wasserdampf kondensiert. Sie sind
     oben bauschig und unten fast waagerecht abgeschnitten.

  4. LANGSAM. Wolken ziehen, sie rennen nicht.

Der Aufbau je Ballen: drei Lagen übereinander — Schatten (tief,
kühl), Körper (die eigentliche Wolke), Lichtrand (oben, schmal,
hell). Alles als radiale Farbverläufe in EINEM Element, das sich
seitlich wiederholt; bewegt wird es um genau eine Kachelbreite, dann
ist der Übergang nahtlos.

    python3 werkzeug/bau-wolken.py
"""

import io
import math
import os
import random
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
ZIEL = os.path.join(os.path.dirname(HIER), "app-styles.css")

MARKE_AUF = "/* WOLKEN-ANFANG — erzeugt von werkzeug/bau-wolken.py */"
MARKE_ZU = "/* WOLKEN-ENDE */"


def haufen(mitte_x, mitte_y, breite, hoehe, wieviel, saat):
    """Ein Wolkenhaufen: viele Buckel, oben bauschig, unten flach."""
    r = random.Random(saat)
    ballen = []
    for i in range(wieviel):
        # Waagerecht gleichmaessig verteilt, mit etwas Unruhe
        t = (i + 0.5) / wieviel
        x = mitte_x + (t - 0.5) * breite + r.uniform(-breite * 0.05, breite * 0.05)
        # Die Kuppe ist in der Mitte am hoechsten (eine flache Glocke)
        kuppe = math.sin(t * math.pi) ** 0.75
        gross = (0.34 + 0.66 * kuppe) * (0.8 + r.uniform(0, 0.4))
        rx = breite * 0.13 * gross
        ry = hoehe * 0.55 * gross
        # Unten flach: alle Ballen sitzen mit ihrer Unterkante auf
        # derselben Hoehe, nur die Oberkante wandert.
        y = mitte_y - ry * 0.55 - hoehe * 0.34 * kuppe
        ballen.append((round(x, 1), round(y, 1), round(rx, 1), round(ry, 1)))
    return ballen


def wolke(x, y, breite, hoehe, wieviel, saat):
    return haufen(x, y, breite, hoehe, wieviel, saat)


# Drei Haufen und ein feiner Schleier je Kachel (300 px breit, 44 px hoch).
# Unterschiedlich gross, damit sich kein Muster einprägt.
KACHEL = [
    wolke(x=62, y=30, breite=96, hoehe=26, wieviel=13, saat=11),
    wolke(x=168, y=28, breite=74, hoehe=21, wieviel=11, saat=23),
    wolke(x=246, y=31, breite=52, hoehe=15, wieviel=9, saat=37),
]
SCHLEIER = [
    (110, 34, 54, 5),
    (206, 33, 42, 4),
    (24, 35, 36, 4),
]


def lage(ballen, farbe, dy=0.0, gross=1.0, voll=74, weg=96):
    """Eine Lage aller Ballen als Farbverlauf-Liste.

    voll = bis wohin die Farbe deckt, weg = wo sie ganz verschwunden
    ist. Je hoeher `voll`, desto fester der Ballen — und desto mehr
    verschmelzen die Nachbarn zu EINER Wolke. Genau daran lag es, dass
    die Wolke vorher wie ein Haufen einzelner Kreise aussah: der Abfall
    begann schon bei der Haelfte, also blieb jeder Ballen fuer sich.
    """
    aus = []
    for (x, y, rx, ry) in ballen:
        aus.append(
            "radial-gradient(%gpx %gpx at %gpx %gpx, %s 0 %d%%, transparent %d%%)"
            % (round(rx * gross, 2), round(ry * gross, 2), x, round(y + dy, 2),
               farbe, voll, weg)
        )
    return aus


def bauen():
    alle = [b for w in KACHEL for b in w]

    lagen = []
    # 1. Schleier ganz hinten — ein Hauch, der die Haufen verbindet
    for (x, y, rx, ry) in SCHLEIER:
        lagen.append(
            "radial-gradient(%gpx %gpx at %gpx %gpx, var(--w-wolke-schleier) 0 58%%, "
            "transparent 94%%)" % (rx, ry, x, y)
        )
    # 2. Schatten: dieselben Ballen, ein Stueck tiefer und kuehler
    lagen += lage(alle, "var(--w-wolke-schatten)", dy=4.2, voll=72, weg=95)
    # 3. Der Koerper — fest genug, dass die Nachbarn verschmelzen
    lagen += lage(alle, "var(--w-wolke-hell)", dy=0, voll=76, weg=97)
    # 4. Die beleuchtete Krone: ein KLEINERER Ballen, nach oben
    #    versetzt. Kein Ring — ein Ring zeichnet Donuts, und genau die
    #    waren vorher zu sehen.
    lagen += lage(alle, "var(--w-wolke-oben)", dy=-2.6, gross=0.7, voll=62, weg=94)

    # Zuletzt gezeichnet steht in CSS ZUERST in der Liste.
    lagen = list(reversed(lagen))

    css = [MARKE_AUF]
    css.append("/* %d Ballen in drei Haufen, je drei Lagen (Schatten, Körper," % len(alle))
    css.append("   Lichtrand) plus drei Schleier — siehe werkzeug/bau-wolken.py. */")
    css.append(".w-wolkenband {")
    css.append("  position: absolute;")
    css.append("  top: 0; left: 0;")
    css.append("  width: 200%; height: 100%;")
    css.append("  background-repeat: repeat-x;")
    css.append("  background-size: var(--w-kachel) 100%;")
    css.append("  background-image:")
    css.append(",\n".join("    " + l for l in lagen) + ";")
    css.append("  animation: wZiehen 96s linear infinite;")
    css.append("  will-change: transform;")
    css.append("}")
    css.append("@keyframes wZiehen {")
    css.append("  from { transform: translate3d(0, 0, 0); }")
    css.append("  to   { transform: translate3d(calc(-1 * var(--w-kachel)), 0, 0); }")
    css.append("}")
    css.append("""/* Drei Schichten, drei Tempi, drei Größen — vorn groß und etwas
   schneller, hinten klein, blass und sehr langsam. Daraus entsteht
   Tiefe. GEWÜNSCHT war „schön langsam und gemütlich": die Tempi sind
   deshalb rund doppelt so ruhig wie vorher. */
.w-wb1 { --w-kachel: 300px; opacity: 0.86; animation-duration: 96s; }
.w-wb2 { --w-kachel: 392px; opacity: 0.55; animation-duration: 158s; height: 84%; }
.w-wb3 { --w-kachel: 486px; opacity: 0.32; animation-duration: 232s; height: 68%; }""")
    css.append(MARKE_ZU)
    return "\n".join(css)


def main():
    s = io.open(ZIEL, encoding="utf-8").read()
    neu = bauen()
    if MARKE_AUF in s and MARKE_ZU in s:
        a = s.index(MARKE_AUF)
        b = s.index(MARKE_ZU) + len(MARKE_ZU)
        s = s[:a] + neu + s[b:]
    else:
        # Beim ersten Mal den alten Block ersetzen
        a = s.index(".w-wolkenband {")
        # Kommentar davor mitnehmen
        k = s.rfind("/* ---------------- Wolkenschichten", 0, a)
        if k < 0:
            k = a
        b = s.index(".w-wb3 {", a)
        b = s.index("\n", b) + 1
        s = s[:k] + neu + "\n" + s[b:]
    io.open(ZIEL, "w", encoding="utf-8").write(s)
    anzahl = sum(len(w) for w in KACHEL)
    print("%d Wolkenballen in drei Haufen geschrieben" % anzahl)


if __name__ == "__main__":
    main()
