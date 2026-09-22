#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DAS QUAKEN — EIN GERECHNETER FROSCHRUF
---------------------------------------------------------------------
XANDER (Runde 76): „Frosch-Sprung."
In der Tonkiste lag kein Frosch. Also gerechnet, wie Zwitschern,
Wecker und Platsch auch.

WAS EIN QUAKEN AUSMACHT, und warum ein tiefer Ton keins ist:
  · Ein Froschruf ist KEIN Ton, sondern eine PULSFOLGE. Der Kehlsack
    schlaegt 45 bis 70 Mal in der Sekunde; was man hoert, ist diese
    Schlagfolge, und die Tonhoehe darin ist nur die Farbe. Ein
    glatter Sinus klingt nach Nebelhorn, nicht nach Teich.
  · Die Pulsrate faellt waehrend des Rufs leicht ab — der Sack wird
    leerer. Genau das macht das „Knarren".
  · Der Klang hat starke Obertoene (2f, 3f, 4f) mit einem Schwerpunkt
    um 900 Hz: der Kehlsack ist ein Resonator, kein Lautsprecher.
  · Die Rufe kommen in ungleichen Abstaenden. Gleiche Pausen klingen
    nach Maschine.

RUNDE 85 — XANDER: „und er quakt nicht richtig."
GEFUNDEN, und es war nicht der Klang, sondern die LAENGE: die Datei
enthielt DREI Rufe in 1,8 s, und der Frosch spielte sie bei jedem
Sprung neu an — abgeschnitten nach der Sprungdauer (oft 320 ms).
Damit hoerte man jedes Mal denselben angeschnittenen ersten Ruf mit
einem Knack am Ende. Ein Ruf gehoert zu einem Sprung, also enthaelt
die Datei jetzt GENAU EINEN Ruf, der ausklingen darf:

  0,00 s  252 Hz, Puls 60 -> 46 Hz, 340 ms Ruf
  danach  das Nachhallen des Kehlsacks bis 0,62 s

Die alte Aufnahme mit drei Rufen liegt in
werkzeug/backup/ton-runde85/quaken-drei.opus.

    python3 werkzeug/quaken-bauen.py
=====================================================================
"""
import math, os, struct, subprocess, sys

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
AUS = os.path.join(WURZEL, "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")

RATE = 24000
DAUER = 0.62
NAME = "quaken"


def rampe(i, n, ms=8):
    k = max(1, int(RATE * ms / 1000))
    if i < k:
        return i / k
    if i > n - k:
        return max(0.0, (n - i) / k)
    return 1.0


def ruf(daten, start, laenge, grund, puls0, puls1, laut):
    """Ein Quak: Grundton mit Obertoenen, zerhackt von der Pulsfolge."""
    n = int(RATE * laenge)
    ab = int(RATE * start)
    phase = 0.0
    pphase = 0.0
    for i in range(n):
        t = i / n
        f = grund * (1.0 - 0.10 * t)          # der Ruf sackt leicht ab
        puls = puls0 + (puls1 - puls0) * t
        phase += 2 * math.pi * f / RATE
        pphase += 2 * math.pi * puls / RATE
        # Die Pulsfolge: ein steiler Huegel, kein Sinus — daher das
        # Knarren. Hoch 4 macht aus der Welle einen Schlag.
        tor = (0.5 + 0.5 * math.sin(pphase)) ** 4
        klang = (math.sin(phase)
                 + 0.85 * math.sin(2 * phase)
                 + 0.60 * math.sin(3 * phase)
                 + 0.32 * math.sin(4 * phase)
                 + 0.18 * math.sin(5 * phase))
        wert = klang * tor * laut * rampe(i, n)
        j = ab + i
        if 0 <= j < len(daten):
            daten[j] += wert


def main():
    n = int(RATE * DAUER)
    daten = [0.0] * n
    ruf(daten, 0.00, 0.340, 252, 60, 46, 0.32)
    # Der Nachhall: derselbe Ruf, sehr leise und tiefer — so klingt
    # ein Kehlsack aus, statt abrupt aufzuhoeren.
    ruf(daten, 0.30, 0.260, 214, 44, 34, 0.09)
    roh = b"".join(struct.pack("<h", max(-32000, min(32000, int(w * 32000))))
                   for w in daten)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        # Der Kehlsack als Resonator: eine Glocke um
                        # 900 Hz. Und ein Limiter MIT level=disabled —
                        # ohne das macht alimiter die Kette stumm.
                        "-af", "highpass=f=140,equalizer=f=900:t=q:w=1.1:g=6,"
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
