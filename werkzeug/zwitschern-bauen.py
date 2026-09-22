#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DAS ZWITSCHERN — EIN GERECHNETER VOGELRUF
---------------------------------------------------------------------
XANDER (Runde 80): „vielleicht koennte man den Vogel auch zwitschern
hoeren."

In der Tonkiste lag kein Zwitschern — nur „greifvogel" (ein Schrei)
und „vogelkot" (das Pfeifen im Fall plus Aufschlag). Also gerechnet,
wie Wecker, Bonk und Platsch auch (werkzeug/geraeusche-bauen.sh).

WAS EINEN VOGELRUF AUSMACHT, und warum ein Piepsen keiner ist:
  · Die Tonhoehe steht nie still. Ein Sperlingsruf ist ein SCHNELLER
    Frequenzwisch — ueber 2 bis 5 kHz in achtzig Millisekunden. Ein
    gleichbleibender Sinus klingt dagegen wie ein Geraet.
  · Die Rufe kommen in Gruppen mit ungleichen Pausen. Gleiche
    Abstaende klingen nach Metronom.
  · Jeder Ruf hat einen leisen Oberton bei der doppelten Frequenz —
    daher das Metallische, das ein Vogel hat und eine Floete nicht.
  · Und er setzt weich ein und hoert weich auf (5 ms Rampen), sonst
    knackt es.

Gebaut werden fuenf Rufe in 1,5 s:
  0,00 s  Wisch 2600 -> 4300 Hz, 90 ms   (der Anruf)
  0,17 s  Wisch 4400 -> 2900 Hz, 80 ms   (die Antwort, faellt)
  0,42 s  Wisch 3100 -> 5000 Hz, 70 ms
  0,56 s  Wisch 5000 -> 3400 Hz, 70 ms
  0,95 s  langer Triller 3000 <-> 4200 Hz, 210 ms, 18 Hz Zittern

    python3 werkzeug/zwitschern-bauen.py
=====================================================================
"""
import math, os, struct, subprocess, sys

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
AUS = os.path.join(WURZEL, "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")

RATE = 24000
DAUER = 1.5


def rampe(i, n, ms=5):
    """Weich ein und aus — sonst knackt jeder Ruf."""
    k = max(1, int(RATE * ms / 1000))
    if i < k:
        return i / k
    if i > n - k:
        return max(0.0, (n - i) / k)
    return 1.0


def wisch(daten, start, laenge, f0, f1, laut, triller=0.0):
    """Ein Ruf: die Tonhoehe wischt von f0 nach f1."""
    n = int(RATE * laenge)
    ab = int(RATE * start)
    phase = 0.0
    for i in range(n):
        t = i / n
        f = f0 + (f1 - f0) * t
        if triller:
            f += 700 * math.sin(2 * math.pi * triller * (i / RATE))
        phase += 2 * math.pi * f / RATE
        h = rampe(i, n)
        # Grundton plus ein leiser Oberton — das Metallische am Vogel.
        wert = (math.sin(phase) + 0.28 * math.sin(2 * phase)) * laut * h
        j = ab + i
        if 0 <= j < len(daten):
            daten[j] += wert


def main():
    n = int(RATE * DAUER)
    daten = [0.0] * n
    wisch(daten, 0.00, 0.090, 2600, 4300, 0.62)
    wisch(daten, 0.17, 0.080, 4400, 2900, 0.55)
    wisch(daten, 0.42, 0.070, 3100, 5000, 0.58)
    wisch(daten, 0.56, 0.070, 5000, 3400, 0.50)
    wisch(daten, 0.95, 0.210, 3000, 4200, 0.48, triller=18)
    roh = b"".join(struct.pack("<h", max(-32000, min(32000, int(w * 32000))))
                   for w in daten)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        # Kein „alimiter" ohne level=disabled, kein
                        # „silenceremove", kein „loudnorm" unter einer
                        # Sekunde — das sind die drei Fallen, die diese
                        # Kette frueher stumm gemacht haben.
                        "-af", "highpass=f=900,alimiter=limit=0.92:level=disabled",
                        "-ac", "2", "-c:a", "libopus", "-b:a", "56k",
                        os.path.join(AUS, "zwitschern.opus")], input=roh)
    if p.returncode:
        sys.exit("opus fehlgeschlagen")
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-i", os.path.join(AUS, "zwitschern.opus"),
                        "-c:a", "aac", "-b:a", "72k",
                        os.path.join(AUS, "zwitschern.m4a")])
    if p.returncode:
        sys.exit("m4a fehlgeschlagen")
    for e in ("opus", "m4a"):
        f = os.path.join(AUS, "zwitschern." + e)
        print("zwitschern.%s  %d Bytes" % (e, os.path.getsize(f)))


main()
