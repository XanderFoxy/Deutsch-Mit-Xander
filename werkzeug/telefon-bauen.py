#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DAS TELEFON — KLINGELN UND ABHEBEN
---------------------------------------------------------------------
XANDER (Runde 76): „Telefon mit Audio."
Ein Telefon ohne Ton ist kein Telefon — man sieht ja nur einen Hoerer
liegen. In der Tonkiste lag keiner: „wecker" ist eine Glocke,
„weckeranalog" ein Rasseln, „ticken" ein Uhrwerk.

WAS EIN DEUTSCHES FREIZEICHEN AUSMACHT:
  · Es ist EIN Ton von 425 Hz, nicht zwei wie in England oder
    Amerika. Genau deshalb klingt ein amerikanischer Klingelton fuer
    deutsche Ohren falsch.
  · Der TAKT macht es: eine Sekunde Ton, vier Sekunden Pause. Fuer
    eine Animation von vier Sekunden ist das zu langsam, deshalb hier
    zweimal 0,9 s mit 0,55 s dazwischen — die Tonhoehe stimmt, das
    Warten ist gekuerzt.
  · Der Ton setzt weich ein (20 ms) und hoert weich auf, sonst knackt
    es an beiden Enden.
  · Und er hat einen leisen Oberton bei 850 Hz: eine Telefonleitung
    ist schmalbandig, aber nicht sauber.
Dazu am Ende das ABHEBEN: zwei kurze Klicks (Gabel und Hoerer) und
ein kurzes Rauschen — die offene Leitung.

Gebaut werden 3,4 s:
  0,00 s  Klingeln 0,90 s
  1,45 s  Klingeln 0,90 s
  2,80 s  Klick (Gabel)
  2,90 s  Klick (Hoerer)
  3,00 s  Leitungsrauschen bis zum Schluss

    python3 werkzeug/telefon-bauen.py
=====================================================================
"""
import math, os, random, struct, subprocess, sys

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
AUS = os.path.join(WURZEL, "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")

RATE = 24000
DAUER = 3.4
NAME = "telefon"


def klingeln(daten, start, laenge, laut):
    n = int(RATE * laenge)
    ab = int(RATE * start)
    k = int(RATE * 0.020)
    for i in range(n):
        z = i / RATE
        h = 1.0
        if i < k:
            h = i / k
        elif i > n - k:
            h = max(0.0, (n - i) / k)
        wert = (math.sin(2 * math.pi * 425 * z)
                + 0.22 * math.sin(2 * math.pi * 850 * z)) * h * laut
        j = ab + i
        if 0 <= j < len(daten):
            daten[j] += wert


def klick(daten, start, laut):
    """Ein Klick ist ein Knall von wenigen Millisekunden."""
    n = int(RATE * 0.012)
    ab = int(RATE * start)
    for i in range(n):
        t = i / n
        wert = random.uniform(-1, 1) * math.exp(-9 * t) * laut
        j = ab + i
        if 0 <= j < len(daten):
            daten[j] += wert


def leitung(daten, start, laenge, laut):
    """Die offene Leitung: leises, dumpfes Rauschen."""
    n = int(RATE * laenge)
    ab = int(RATE * start)
    tief = 0.0
    for i in range(n):
        tief += (random.uniform(-1, 1) - tief) * 0.07
        j = ab + i
        if 0 <= j < len(daten):
            daten[j] += tief * laut


def main():
    random.seed(1913)
    n = int(RATE * DAUER)
    daten = [0.0] * n
    klingeln(daten, 0.00, 0.90, 0.42)
    klingeln(daten, 1.45, 0.90, 0.42)
    klick(daten, 2.80, 0.55)
    klick(daten, 2.90, 0.40)
    leitung(daten, 3.00, 0.40, 0.16)
    roh = b"".join(struct.pack("<h", max(-32000, min(32000, int(w * 32000))))
                   for w in daten)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        # Die Telefonleitung selbst: 300 bis 3400 Hz, mehr
                        # geht durch kein Telefon. Limiter nur mit
                        # level=disabled, sonst wird die Kette stumm.
                        "-af", "highpass=f=300,lowpass=f=3400,"
                               "alimiter=limit=0.92:level=disabled",
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
        f = os.path.join(AUS, NAME + "." + e)
        print("%s.%s  %d Bytes" % (NAME, e, os.path.getsize(f)))


main()
