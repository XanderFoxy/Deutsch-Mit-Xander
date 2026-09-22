#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DER ZAUBERPUFF — RAUCHWOLKE UND FUNKENREGEN
---------------------------------------------------------------------
XANDER (Runde 76): „Zylinder mit Kaninchen."
Zu einem Zauberzylinder gehoert der Ton dazu, und in der Tonkiste lag
keiner. „bling" ist ein einzelner Glockenschlag, „portal" ein
Wirbelrauschen — beides ist etwas anderes.

WORAUS EIN ZAUBERGERAEUSCH BESTEHT, und warum ein Klingeln keins ist:
  · DER PUFF. Eine Rauchwolke ist ein RAUSCHSTOSS, der sofort da ist
    und in rund 200 ms verfaellt, tief gefiltert. Ein Ton kann das
    nicht — Rauch hat keine Tonhoehe.
  · DER FUNKENREGEN. Danach steigt eine Folge kurzer Glockentoene
    auf. Wichtig ist, dass sie ANSTEIGEN: absteigend klingt es nach
    Verschwinden, aufsteigend nach Erscheinen.
  · Jeder Funke ist eine Glocke, kein Sinus: Grundton plus ein
    Oberton beim 2,76fachen (das ist das Glockenverhaeltnis, kein
    ganzzahliges) — daher das Glaserne.
  · Und am Ende der zweite Puff, wenn das Kaninchen herauskommt.

Gebaut werden 2,4 s:
  0,00 s  Puff (Rauschstoss, 220 ms)
  0,18 s  zwoelf Funken, 700 -> 2600 Hz, steigend
  1,55 s  Puff (Rauschstoss, 260 ms)
  1,70 s  drei helle Funken als „ta-daa" (1500/1900/2500 Hz)

    python3 werkzeug/zauberpuff-bauen.py
=====================================================================
"""
import math, os, random, struct, subprocess, sys

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
AUS = os.path.join(WURZEL, "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")

RATE = 24000
DAUER = 2.4
NAME = "zauberpuff"


def puff(daten, start, laenge, laut):
    """Die Rauchwolke: ein Rauschstoss, der sofort verfaellt."""
    n = int(RATE * laenge)
    ab = int(RATE * start)
    tief = 0.0
    for i in range(n):
        t = i / n
        r = random.uniform(-1, 1)
        # Ein einfacher Tiefpass — Rauch klingt dumpf, nicht zischend.
        tief += (r - tief) * 0.16
        # Sofort da, dann exponentiell weg.
        huelle = math.exp(-5.2 * t)
        wert = tief * huelle * laut
        j = ab + i
        if 0 <= j < len(daten):
            daten[j] += wert


def funke(daten, start, f, laut, laenge=0.22):
    """Ein Glockenfunke: Grundton plus der 2,76fache Oberton."""
    n = int(RATE * laenge)
    ab = int(RATE * start)
    for i in range(n):
        t = i / n
        z = i / RATE
        huelle = math.exp(-9.0 * t)
        wert = (math.sin(2 * math.pi * f * z)
                + 0.45 * math.sin(2 * math.pi * f * 2.76 * z)
                + 0.18 * math.sin(2 * math.pi * f * 5.40 * z)) * huelle * laut
        j = ab + i
        if 0 <= j < len(daten):
            daten[j] += wert


def main():
    random.seed(4711)
    n = int(RATE * DAUER)
    daten = [0.0] * n
    puff(daten, 0.00, 0.220, 0.85)
    # Der aufsteigende Funkenregen. Die Abstaende werden kuerzer —
    # das zieht den Blick nach oben.
    wann, f = 0.18, 700.0
    for k in range(12):
        funke(daten, wann, f, 0.26 - k * 0.010)
        wann += 0.105 - k * 0.0035
        f *= 1.125
    puff(daten, 1.55, 0.260, 0.80)
    # Das „ta-daa" beim Auftauchen — drei Funken, der letzte laenger.
    funke(daten, 1.70, 1500, 0.30)
    funke(daten, 1.82, 1900, 0.30)
    funke(daten, 1.96, 2500, 0.34, 0.40)
    roh = b"".join(struct.pack("<h", max(-32000, min(32000, int(w * 32000))))
                   for w in daten)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        # Limiter NUR mit level=disabled, sonst wird die
                        # Kette stumm. Kein silenceremove: die Pausen
                        # zwischen den Funken gehoeren dazu.
                        "-af", "highpass=f=90,alimiter=limit=0.92:level=disabled",
                        "-ac", "2", "-c:a", "libopus", "-b:a", "56k",
                        os.path.join(AUS, NAME + ".opus")], input=roh)
    if p.returncode:
        sys.exit("opus fehlgeschlagen")
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-i", os.path.join(AUS, NAME + ".opus"),
                        "-c:a", "aac", "-b:a", "72k",
                        os.path.join(AUS, NAME + ".m4a")])
    if p.returncode:
        sys.exit("m4a fehlgeschlagen")
    for e in ("opus", "m4a"):
        f2 = os.path.join(AUS, NAME + "." + e)
        print("%s.%s  %d Bytes" % (NAME, e, os.path.getsize(f2)))


main()
