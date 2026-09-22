#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
ZWEI TÖNE FÜR DEN HAMMER IN FÜNF STUFEN
---------------------------------------------------------------------
XANDER (Runde 86): „Bei dem Hammer möchte ich den Zufallsmodus raus
haben … wenn man einmal schlägt, passiert noch nix. Beim zweiten Mal
hört man schon so ein erstes Knack … beim dritten Mal platzt dann die
Scheibe und beim vierten Mal splittert alles raus."

Für Stufe 3 gibt es „glasbruch" schon. Es fehlten zwei:

  knack.opus     0,32 s — EIN einzelner Riss, der durch die Scheibe
                 läuft. Ein Knack ist kein Bruch: ganz kurzer Anstieg
                 (2 ms), ein heller, trockener Körper um 2,6 kHz und
                 ein winziges Nachzittern. Nichts fällt herunter,
                 nichts klirrt — es GIBT nur nach.
  splitter.opus  0,90 s — die Scherben, die danach herausfallen. Viele
                 kleine, helle Anschläge (zwischen 3 und 7 kHz), die
                 mit der Zeit seltener und leiser werden, wie
                 Glasstücke, die nacheinander aufkommen.

    python3 werkzeug/knack-bauen.py
=====================================================================
"""
import math, os, random, struct, subprocess, sys

HIER = os.path.dirname(os.path.abspath(__file__))
AUS = os.path.join(os.path.dirname(HIER), "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")
RATE = 24000


def mischen(daten, start, werte):
    ab = int(RATE * start)
    for i, w in enumerate(werte):
        j = ab + i
        if 0 <= j < len(daten):
            daten[j] += w


def rauschen(laenge, mitte, guete, huelle):
    """Gefiltertes Rauschen — ein Resonanzfilter zweiter Ordnung."""
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


def klingel(laenge, f, huelle):
    """Ein reiner Ton — der Rest, der im Glas nachzittert."""
    n = int(RATE * laenge)
    return [math.sin(2 * math.pi * f * i / RATE) * huelle(i / n)
            for i in range(n)]


def schreiben(name, daten):
    roh = b"".join(struct.pack("<h", max(-32000, min(32000, int(w * 30000))))
                   for w in daten)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        "-af", "highpass=f=140,alimiter=limit=0.95:level=disabled",
                        "-ac", "2", "-c:a", "libopus", "-b:a", "56k",
                        os.path.join(AUS, name + ".opus")], input=roh)
    if p.returncode:
        sys.exit(name + ": opus fehlgeschlagen")
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-i", os.path.join(AUS, name + ".opus"),
                        "-c:a", "aac", "-b:a", "72k",
                        os.path.join(AUS, name + ".m4a")])
    if p.returncode:
        sys.exit(name + ": m4a fehlgeschlagen")
    for e in ("opus", "m4a"):
        f = os.path.join(AUS, name + "." + e)
        print("%s.%s  %d Bytes" % (name, e, os.path.getsize(f)))


def knack():
    random.seed(861)
    n = int(RATE * 0.32)
    daten = [0.0] * n

    # Der Riss selbst: 2 ms Anstieg, dann in 30 ms weg.
    def stoss(t):
        ms = t * 110.0
        if ms < 2:
            return ms / 2.0
        return math.exp(-(ms - 2) / 11.0)
    mischen(daten, 0.00, rauschen(0.11, 2600, 1.1, lambda t: 1.20 * stoss(t)))
    # Darunter der Körper, damit es nach Scheibe klingt und nicht nach Tick.
    mischen(daten, 0.00, rauschen(0.09, 980, 2.0,
                                  lambda t: 0.42 * math.exp(-t * 9.0)))
    # Und das Nachzittern: zwei hohe Töne, die leise ausklingen.
    mischen(daten, 0.01, klingel(0.30, 3180, lambda t: 0.10 * math.exp(-t * 7.0)))
    mischen(daten, 0.01, klingel(0.30, 4460, lambda t: 0.06 * math.exp(-t * 9.0)))
    schreiben("knack", daten)


def splitter():
    random.seed(862)
    n = int(RATE * 0.90)
    daten = [0.0] * n
    # 26 einzelne Scherben. Sie kommen zuerst dicht, dann immer
    # seltener — und die spaeteren sind leiser, weil weniger uebrig ist.
    zeit = 0.02
    for i in range(26):
        laut = 0.50 * math.exp(-zeit * 2.6) * (0.5 + random.random() * 0.5)
        hoch = 3000 + random.random() * 4000
        mischen(daten, zeit, rauschen(
            0.05, hoch, 1.4,
            lambda t, l=laut: l * math.exp(-t * 16.0)))
        mischen(daten, zeit, klingel(
            0.12, hoch * 1.3,
            lambda t, l=laut: l * 0.35 * math.exp(-t * 11.0)))
        zeit += 0.012 + random.random() * 0.055 * (1 + i / 10.0)
        if zeit > 0.82:
            break
    schreiben("splitter", daten)


knack()
splitter()
