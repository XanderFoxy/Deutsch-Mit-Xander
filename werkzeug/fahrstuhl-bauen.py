#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DER FAHRSTUHL — TÜR, FAHRT UND ANKUNFT
---------------------------------------------------------------------
XANDER (Runde 85): „ich möchte beim Reisen noch eine Fahrstuhltür."

Ein Fahrstuhl klingt in drei Abschnitten, und jeder ist hörbar etwas
anderes:

  0,00–0,55 s  DIE TÜR SCHLIESST. Ein Rollen (tiefes Rauschen um
               170 Hz, das lauter wird, weil die Tür Fahrt aufnimmt)
               und am Schluss der Anschlag: ein kurzer, harter Stoß,
               wenn beide Flügel aufeinandertreffen.
  0,55–1,75 s  DIE FAHRT. Ein ruhiger Brummton (108 Hz mit Oktave und
               Quinte darüber) und ein leises Seilrauschen. Er steigt
               ganz leicht an und fällt am Ende wieder ab — das ist
               das Anfahren und Abbremsen.
  1,75–2,40 s  DAS ANKOMMEN. Zwei helle Glockenschläge (1480 und
               1180 Hz, wie die zwei Töne einer Fahrstuhlglocke),
               danach das Rollen der öffnenden Tür.

    python3 werkzeug/fahrstuhl-bauen.py
=====================================================================
"""
import math, os, random, struct, subprocess, sys

HIER = os.path.dirname(os.path.abspath(__file__))
AUS = os.path.join(os.path.dirname(HIER), "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")
RATE = 24000
DAUER = 2.40

random.seed(851)


def mischen(daten, start, werte):
    ab = int(RATE * start)
    for i, w in enumerate(werte):
        j = ab + i
        if 0 <= j < len(daten):
            daten[j] += w


def rauschen(laenge, mitte, guete, huelle):
    n = int(RATE * laenge)
    w = 2 * math.pi * mitte / RATE
    r = math.exp(-w / (2 * guete))
    a1, a2 = 2 * r * math.cos(w), -r * r
    y1 = y2 = 0.0
    raus = []
    for i in range(n):
        x = random.uniform(-1, 1)
        y = x + a1 * y1 + a2 * y2
        y2, y1 = y1, y
        raus.append(y * (1 - r) * huelle(i / n))
    return raus


def ton(laenge, f, huelle):
    n = int(RATE * laenge)
    return [math.sin(2 * math.pi * f * i / RATE) * huelle(i / n) for i in range(n)]


def main():
    n = int(RATE * DAUER)
    daten = [0.0] * n

    # 1. Die Tuer schliesst: ein Rollen, das Fahrt aufnimmt.
    mischen(daten, 0.00, rauschen(0.50, 170, 1.6,
                                  lambda t: 0.30 * (0.3 + 0.7 * t)))
    mischen(daten, 0.00, rauschen(0.50, 620, 1.1,
                                  lambda t: 0.10 * (0.2 + 0.8 * t)))

    # Der Anschlag, wenn beide Fluegel aufeinandertreffen.
    def stoss(t):
        ms = t * 90.0
        if ms < 3:
            return ms / 3.0
        return math.exp(-(ms - 3) / 14.0)
    mischen(daten, 0.50, rauschen(0.09, 420, 1.0, lambda t: 0.55 * stoss(t)))
    mischen(daten, 0.50, rauschen(0.07, 1500, 1.2, lambda t: 0.22 * stoss(t)))

    # 2. Die Fahrt: ein ruhiges Brummen mit Oktave und Quinte.
    def fahrt(t):
        an = min(1.0, t * 6)          # anfahren
        ab = min(1.0, (1 - t) * 5)    # abbremsen
        return 0.20 * an * ab
    mischen(daten, 0.56, ton(1.20, 108, fahrt))
    mischen(daten, 0.56, ton(1.20, 216, lambda t: fahrt(t) * 0.45))
    mischen(daten, 0.56, ton(1.20, 162, lambda t: fahrt(t) * 0.28))
    # Das Seil.
    mischen(daten, 0.56, rauschen(1.20, 900, 2.2, lambda t: 0.05 * fahrt(t) * 5))

    # 3. Die Glocke: zwei Toene, wie an jedem Fahrstuhl.
    mischen(daten, 1.76, ton(0.42, 1480, lambda t: 0.34 * math.exp(-t * 4.5)))
    mischen(daten, 1.76, ton(0.42, 2960, lambda t: 0.08 * math.exp(-t * 6.0)))
    mischen(daten, 1.98, ton(0.40, 1180, lambda t: 0.28 * math.exp(-t * 4.5)))
    # Und die Tuer geht wieder auf.
    mischen(daten, 2.00, rauschen(0.38, 170, 1.6,
                                  lambda t: 0.24 * (1 - t * 0.6)))

    roh = b"".join(struct.pack("<h", max(-32000, min(32000, int(w * 30000))))
                   for w in daten)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        "-af", "highpass=f=70,alimiter=limit=0.95:level=disabled",
                        "-ac", "2", "-c:a", "libopus", "-b:a", "56k",
                        os.path.join(AUS, "fahrstuhl.opus")], input=roh)
    if p.returncode:
        sys.exit("opus fehlgeschlagen")
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-i", os.path.join(AUS, "fahrstuhl.opus"),
                        "-c:a", "aac", "-b:a", "72k",
                        os.path.join(AUS, "fahrstuhl.m4a")])
    if p.returncode:
        sys.exit("m4a fehlgeschlagen")
    for e in ("opus", "m4a"):
        f = os.path.join(AUS, "fahrstuhl." + e)
        print("fahrstuhl.%s  %d Bytes" % (e, os.path.getsize(f)))


main()
