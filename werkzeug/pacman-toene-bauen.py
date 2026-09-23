#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
ZWEI TOENE FUER PAC-MAN
---------------------------------------------------------------------
XANDER (23.09.2026): „bei Pac-Man soll er die Leute richtig auffressen
und gerade wenn auf Plaetzen jemand sitzt, soll er ein bisschen dicker
werden aber nur in dem Moment, dann soll er weiter fressen und immer
wenn er jemanden frisst, dann soll er ruelpsen und die Leute sollen
von der Buehne verschwinden und die Futterpunkte soll er auch
realistisch essen."

  ruelps    0,62 s  Ein Ruelpser ist kein Ton, sondern eine FLATTERNDE
                    Luftsaeule: ein tiefer Grundton um 105 Hz, dessen
                    Tonhoehe zittert (7 Hz), dazu ein gefiltertes
                    Rauschen, das mit ihm schwankt. Am Ende faellt
                    beides ab — so hoert ein Ruelpser auf.
  pacbiss   0,10 s  Der Happen: der klassische „Waka" ist ein kurzer
                    Ton, der in 55 ms von 440 auf 880 Hz steigt und
                    gleich wieder faellt. Dreieckwelle, nicht
                    Rechteck: er soll neben den Muenzen nicht
                    schneidend klingen.

    python3 werkzeug/pacman-toene-bauen.py
=====================================================================
"""
import os, struct, subprocess, sys

import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
AUS = os.path.join(WURZEL, "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")
RATE = 24000


def huelle(n, an=0.006, ab=0.08):
    h = np.ones(n)
    a = min(int(RATE * an), n)
    b = min(int(RATE * ab), n - a)
    if a:
        h[:a] = np.linspace(0, 1, a)
    if b:
        h[n - b:] = np.linspace(1, 0, b)
    return h


def schreiben(name, klang, hoehe=0.8):
    sp = float(np.max(np.abs(klang))) or 1.0
    klang = klang / sp * hoehe
    roh = b"".join(struct.pack("<h", int(max(-32000, min(32000, w * 32000))))
                   for w in klang)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        "-af", "alimiter=limit=0.92:level=disabled",
                        "-ac", "2", "-c:a", "libopus", "-b:a", "64k",
                        os.path.join(AUS, name + ".opus")], input=roh)
    if p.returncode:
        sys.exit("opus fehlgeschlagen: " + name)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-i", os.path.join(AUS, name + ".opus"),
                        "-c:a", "aac", "-b:a", "80k",
                        os.path.join(AUS, name + ".m4a")])
    if p.returncode:
        sys.exit("m4a fehlgeschlagen: " + name)
    for e in ("opus", "m4a"):
        d = os.path.join(AUS, name + "." + e)
        print("  %s.%s  %d Bytes" % (name, e, os.path.getsize(d)))


def ruelps():
    """Eine flatternde Luftsaeule, tief und nass."""
    n = int(RATE * 0.62)
    t = np.arange(n) / RATE
    # Die Tonhoehe zittert — DAS ist der Ruelpser. Ohne das Zittern
    # klingt es nur nach einem Brummen.
    flatter = 1.0 + 0.30 * np.sin(2 * np.pi * 7.0 * t) \
                  + 0.12 * np.sin(2 * np.pi * 17.0 * t + 1.1)
    hz = 105.0 * flatter * np.exp(-t * 0.9)
    phase = np.cumsum(hz) / RATE
    # Saegezahn: viele Obertoene, wie eine gepresste Luftsaeule.
    ton = 2.0 * ((phase % 1.0) - 0.5)
    # Das Nasse: Rauschen, das mit derselben Flatterkurve schwankt.
    r = np.random.RandomState(41).uniform(-1, 1, n)
    r = np.convolve(r, np.ones(9) / 9.0, mode="same")
    nass = r * (0.5 + 0.5 * np.sin(2 * np.pi * 7.0 * t)) * 0.4
    # Erst laut, dann ausklingen — ein Ruelpser hoert langsam auf.
    lauter = np.minimum(t / 0.02, 1.0) * np.exp(-t * 2.6)
    klang = (ton * 0.7 + nass) * lauter * huelle(n, 0.004, 0.10)
    print("Ruelpser: 105 Hz mit 7 Hz Flattern, %.2f s" % (n / RATE))
    schreiben("ruelps", klang, 0.8)
    return n / RATE


def pacbiss():
    """Der Happen: hoch hinauf und gleich wieder herunter."""
    n = int(RATE * 0.10)
    t = np.arange(n) / RATE
    # Hinauf in 55 ms, dann zurueck.
    f = np.clip(t / 0.055, 0, 2)
    hz = np.where(f <= 1, 440 + 440 * f, 880 - 440 * (f - 1))
    phase = np.cumsum(hz) / RATE
    # Dreieck: weicher als Rechteck, aber immer noch eckig genug.
    dreieck = 2.0 * np.abs(2.0 * ((phase % 1.0) - 0.5)) - 1.0
    klang = dreieck * huelle(n, 0.003, 0.03) * 0.8
    print("Happen: 440 -> 880 -> 440 Hz, %.0f ms" % (n / RATE * 1000))
    schreiben("pacbiss", klang, 0.7)
    return n / RATE


def main():
    d1 = ruelps()
    d2 = pacbiss()
    print("Dauern: ruelps %.2f s, pacbiss %.2f s" % (d1, d2))


main()
