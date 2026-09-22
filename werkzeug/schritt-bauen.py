#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DER SCHRITT — EIN GERECHNETES LAUFGERAEUSCH
---------------------------------------------------------------------
XANDER (Runde 85): „ich glaube, man hoert auch kein Laufgeraeusch,
wenn man bloss laeuft, beziehungsweise klingt das nicht nach laufen.
Das ist uebrigens auch dasselbe Geraeusch, was der Zufall verwendet."

Er hat beides richtig gehoert: beim Laufen klang je Feld „gummi" —
ein Comic-Boing —, und dasselbe „gummi" benutzte auch das Los. Zwei
verschiedene Dinge mit demselben Ton sind immer ein Fehler.

WAS EINEN SCHRITT AUSMACHT, und warum ein Klick keiner ist:
  · Ein Schritt ist ZWEI Anschlaege, keiner: die Ferse setzt auf,
    und rund 55 ms spaeter rollt der Ballen nach. Genau dieser
    Doppelschlag macht den Unterschied zwischen „Schritt" und
    „Klopfen".
  · Der Klang ist RAUSCHEN, kein Ton — ein Fuss hat keine Tonhoehe.
    Er bekommt seine Farbe aus dem Boden: ein Bandfilter um 240 Hz
    (der dumpfe Aufschlag) und ein leiser Anteil um 2,2 kHz (das
    Abrollen auf der Sohle).
  · Die Ferse faellt schnell ab (rund 70 ms), der Ballen langsamer
    (rund 110 ms) — er schleift ja.

Gebaut wird EIN Schritt in 0,26 s, der je Feld einmal laeuft.

    python3 werkzeug/schritt-bauen.py
=====================================================================
"""
import math, os, random, struct, subprocess, sys

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
AUS = os.path.join(WURZEL, "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")

RATE = 24000
DAUER = 0.26
NAME = "schritt"


def anschlag(daten, start, abfall, laut, hell):
    """Ein Aufschlag: gefiltertes Rauschen, das schnell verfaellt."""
    n = int(RATE * 0.22)
    ab = int(RATE * start)
    tief = 0.0
    vor = 0.0
    for i in range(n):
        t = i / RATE
        r = random.uniform(-1, 1)
        # Tiefpass fuer den dumpfen Teil …
        tief += (r - tief) * 0.22
        # … und die Differenz ist der helle Teil (Hochpass).
        hoch = r - tief
        huelle = math.exp(-t / abfall)
        wert = (tief + hoch * hell) * huelle * laut
        # Ein wenig glaetten, sonst knackt der Einsatz.
        vor += (wert - vor) * 0.75
        j = ab + i
        if 0 <= j < len(daten):
            daten[j] += vor


def main():
    random.seed(20250922)
    n = int(RATE * DAUER)
    daten = [0.0] * n
    # Die Ferse: laut, kurz, dumpf.
    anschlag(daten, 0.000, 0.070, 0.95, 0.22)
    # Der Ballen: leiser, laenger, heller — das Abrollen.
    anschlag(daten, 0.055, 0.110, 0.52, 0.55)
    roh = b"".join(struct.pack("<h", max(-32000, min(32000, int(w * 32000))))
                   for w in daten)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        # Der Boden: eine Glocke um 240 Hz gibt dem Tritt
                        # sein Holz. Limiter nur mit level=disabled.
                        "-af", "highpass=f=70,equalizer=f=240:t=q:w=1.0:g=7,"
                               "lowpass=f=6000,alimiter=limit=0.92:level=disabled",
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
