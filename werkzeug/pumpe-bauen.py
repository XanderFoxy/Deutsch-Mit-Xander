#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
ZWEI TÖNE FÜR DEN LUFTBALLON
---------------------------------------------------------------------
XANDER (Runde 86): „Ach so und das mit dem Luftballon hast du auch
noch nicht gemacht, dass man jemand aufblasen kann wie ne Luftballon."

Aufblasen hat zwei Geräusche, und beide fehlten im Ordner:

  pumpe.opus     0,42 s — EIN Pumpenhub. Zwei Teile, die zusammen
                 gehören: das Drücken (Luft wird durch eine Düse
                 gepresst, Rauschen um 900 Hz, das in 0,18 s
                 anschwillt und wieder abfällt) und das Klacken des
                 Ventils am Ende (ein kurzer, harter Anschlag).
                 Ohne das Ventil klingt es wie Wind, nicht wie Arbeit.
  luftraus.opus  1,30 s — die Luft, die wieder entweicht, wenn man
                 den Ballon loslässt. Ein Rauschen, dessen Mitte von
                 2,6 kHz auf 700 Hz FÄLLT (ein Ballon wird leiser und
                 tiefer, während er kleiner wird), mit einem schnellen
                 Flattern von 34 Hz darüber — das ist das Zittern der
                 Gummilippe, und genau daran erkennt man den Ballon.

    python3 werkzeug/pumpe-bauen.py
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


def rauschen(laenge, mitte, guete, huelle, mitteEnde=None,
             flattern=0.0, flatterHz=0.0):
    """Gefiltertes Rauschen. „mitteEnde" laesst die Filtermitte im
       Verlauf wandern — damit wird der Ballon tiefer, waehrend er
       kleiner wird."""
    n = int(RATE * laenge)
    y1 = y2 = 0.0
    raus = []
    for i in range(n):
        t = i / n
        f = mitte if mitteEnde is None else mitte + (mitteEnde - mitte) * t
        w = 2 * math.pi * f / RATE
        r = math.exp(-w / (2 * guete))
        a1, a2 = 2 * r * math.cos(w), -r * r
        x = random.uniform(-1, 1)
        y = x + a1 * y1 + a2 * y2
        y2, y1 = y1, y
        v = y * (1 - r) * huelle(t)
        if flattern:
            v *= 1 - flattern + flattern * (0.5 + 0.5 * math.sin(
                2 * math.pi * flatterHz * i / RATE))
        raus.append(v)
    return raus


def schreiben(name, daten):
    roh = b"".join(struct.pack("<h", max(-32000, min(32000, int(w * 30000))))
                   for w in daten)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        "-af", "highpass=f=120,alimiter=limit=0.95:level=disabled",
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


def pumpe():
    random.seed(863)
    daten = [0.0] * int(RATE * 0.42)
    # Der Hub: Luft durch die Duese. Anschwellen, dann abfallen.
    mischen(daten, 0.00, rauschen(
        0.26, 900, 1.2,
        lambda t: 0.52 * math.sin(math.pi * min(1.0, t * 1.25)) ** 1.4))
    # Etwas Tiefe darunter, sonst klingt es duenn.
    mischen(daten, 0.01, rauschen(
        0.22, 320, 1.8, lambda t: 0.22 * math.sin(math.pi * min(1.0, t * 1.3))))
    # Und das Ventil am Ende des Hubs.
    def klack(t):
        ms = t * 70.0
        if ms < 1.5:
            return ms / 1.5
        return math.exp(-(ms - 1.5) / 7.0)
    mischen(daten, 0.24, rauschen(0.07, 1900, 1.0, lambda t: 0.62 * klack(t)))
    mischen(daten, 0.24, rauschen(0.05, 620, 2.4, lambda t: 0.3 * klack(t)))
    schreiben("pumpe", daten)


def luftraus():
    random.seed(864)
    daten = [0.0] * int(RATE * 1.30)
    # Die entweichende Luft: hoch und laut am Anfang, tief und leise
    # am Ende — genau so, wie ein Ballon kleiner wird.
    mischen(daten, 0.00, rauschen(
        1.22, 2600, 1.1,
        lambda t: 0.6 * (1 - t) ** 1.25 * (1 if t > 0.012 else t / 0.012),
        mitteEnde=700, flattern=0.5, flatterHz=34))
    # Das Zittern der Gummilippe noch einmal tiefer darunter.
    mischen(daten, 0.00, rauschen(
        1.15, 480, 2.6, lambda t: 0.2 * (1 - t) ** 1.6,
        mitteEnde=210, flattern=0.65, flatterHz=27))
    schreiben("luftraus", daten)


pumpe()
luftraus()
