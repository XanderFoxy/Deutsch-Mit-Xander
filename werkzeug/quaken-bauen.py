#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DAS QUAKEN — EIN GERECHNETER FROSCHRUF
---------------------------------------------------------------------
XANDER (Runde 76): „Frosch-Sprung."
In der Tonkiste lag kein Frosch. Also gerechnet, wie Zwitschern,
Wecker und Platsch auch.

RUNDE 85 — XANDER: „und er quakt nicht richtig."
Das war die LAENGE: die Datei enthielt drei Rufe, und jeder Sprung
schnitt sie mittendrin ab. Seitdem enthaelt sie genau EINEN Ruf.

RUNDE 88 — XANDER: „und das Quakgeraeusch ist auch unmoeglich. Das
ist ueberhaupt nicht realistisch."
NACHGEMESSEN an der alten Datei, und er hat recht — man sieht den
Fehler in der Huellkurve. Sie stand 340 ms lang bei -13 dB, ohne
Anstieg und ohne Abfall, und der Klang war eine Summe aus fuenf
reinen Sinuskurven (184, 233, 466, 699 … Hz). Beides zusammen ist
genau das, was ein Synthesizer macht und kein Tier: ein Ton, der
angeknipst und ausgeknipst wird.

WAS EIN QUAKEN WIRKLICH AUSMACHT — und warum es anders gerechnet
werden muss:
  · Ein Froschruf ist KEIN Ton, sondern eine PULSFOLGE. Der
    Kehlsack schlaegt 40 bis 60 Mal in der Sekunde.
  · Und jeder einzelne Puls ist ein ANSTOSS, der im Kehlsack
    NACHKLINGT und wieder abklingt, bevor der naechste kommt —
    wie ein Schlag auf ein Fell. Die alte Rechnung hat stattdessen
    einen durchlaufenden Ton mit einem Tor zerhackt; dabei hat jeder
    Puls dieselbe Farbe von Anfang bis Ende, und das hoert man als
    Brummen. Hier wird deshalb richtig herum gerechnet: ein kurzer
    Anstoss geht in drei Resonatoren (Quelle-Filter-Modell, dasselbe
    Prinzip wie bei der menschlichen Stimme), und was man hoert, ist
    deren Ausklingen.
  · Die Pulsrate faellt waehrend des Rufs ab (54 -> 38 Hz) — der
    Sack wird leerer. Das ist das „Knarren".
  · Kein Tier ist ein Metronom: Abstand und Lautstaerke der Pulse
    schwanken um ein paar Prozent.
  · Und der Ruf hat eine FORM: er setzt in 45 ms an, steht kurz und
    faellt dann ab. Danach klingt der Sack noch aus.

  0,005 s  erster Puls, Rate 54 Hz
  0,355 s  letzter Puls, Rate 38 Hz, Lautstaerke schon bei null
  danach   das Ausschwingen des Sacks (die schmale vierte Resonanz)
  0,620 s  Dateilaenge (so lang wie der Mindestabstand zweier Rufe
           in app.js — so kann sich nie einer mit dem naechsten
           ueberlagern)

Die alte Datei liegt in werkzeug/backup/ton-runde88/quaken.opus,
die noch aeltere mit drei Rufen in ton-runde85/quaken-drei.opus.

    python3 werkzeug/quaken-bauen.py
=====================================================================
"""
import math, os, struct, subprocess, sys

import numpy as np
from scipy.signal import lfilter

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
AUS = os.path.join(WURZEL, "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")

RATE = 24000
DAUER = 0.62
NAME = "quaken"

ERSTER = 0.005      # erster Puls
LETZTER = 0.355     # letzter Puls
RATE0 = 54.0        # Pulse je Sekunde am Anfang
RATE1 = 38.0        # und am Ende — der Sack wird leerer

# Die Resonanzen des Kehlsacks. Die Breite sagt, wie schnell ein
# Anstoss darin ausklingt: 42 Hz Breite heisst, der Puls ist nach
# 7,3 ms auf die Haelfte gefallen — deutlich kuerzer als der Abstand
# zweier Pulse (18 bis 26 ms). Genau deshalb hoert man die einzelnen
# Schlaege und kein Brummen.
# DURCHGEMESSEN, weil es hier eine Abwaegung gibt: je schmaler die
# Resonanz, desto laenger klingt jeder Schlag nach (gut), aber desto
# weniger still wird es dazwischen (schlecht). Verhaeltnis von Abfall
# zu Anstieg / Tiefe zwischen zwei Pulsen:
#     55 Hz -> 1,31 / 0,079     42 Hz -> 1,76 / 0,134
#     34 Hz -> 1,94 / 0,191     26 Hz -> 2,24 / 0,283
# 42 Hz ist der Punkt, an dem beides noch stimmt. Zum Vergleich: die
# alte Datei kam auf 0,94 — der Puls fiel also genauso schnell ab wie
# er anstieg, und das ist kein Schlag, sondern ein Wabern.
FORMANTEN = [(432.0, 42.0, 1.00),
             (1185.0, 130.0, 0.42),
             (2240.0, 240.0, 0.15),
             # Und eine vierte, ganz schmale (16 Hz Breite, also rund
             # 20 ms Nachklang) und leise: das ist der Sack, der nach
             # dem letzten Puls noch ausschwingt. Ohne sie bricht der
             # Ruf ab wie ein gezogener Stecker — gemessen fiel er in
             # 10 ms von -11 auf -48 dB.
             (398.0, 16.0, 0.13)]


def resonator(x, f, breite):
    """Zwei Pole — ein Anstoss klingt darin aus wie ein Fell."""
    r = math.exp(-math.pi * breite / RATE)
    th = 2 * math.pi * f / RATE
    # y[n] = x[n] + 2 r cos(th) y[n-1] - r^2 y[n-2]
    return lfilter([1.0 - r], [1.0, -2 * r * math.cos(th), r * r], x)


def pulszeiten():
    """Die Zeitpunkte der Anstoesse, mit fallender Rate und Zittern."""
    zt = []
    t = ERSTER
    zufall = np.random.RandomState(4711)
    while t <= LETZTER:
        zt.append(t)
        anteil = (t - ERSTER) / (LETZTER - ERSTER)
        rate = RATE0 + (RATE1 - RATE0) * anteil
        # +-4 % Zittern: ein Frosch ist kein Metronom.
        t += (1.0 / rate) * (1.0 + 0.04 * zufall.uniform(-1, 1))
    return zt


def huelle(t):
    """Die Form des ganzen Rufs: ansetzen, stehen, abfallen."""
    if t < 0.045:
        return 0.16 + 0.84 * (t / 0.045) ** 0.7
    if t < 0.21:
        # Ein leichtes Wogen im Koerper des Rufs — nicht brettgerade.
        return 1.0 - 0.10 * (0.5 - 0.5 * math.cos((t - 0.045) / 0.165 * 2 * math.pi))
    a = (t - 0.21) / (LETZTER - 0.21)
    # Bis auf NULL herunter, sonst endet der Ruf mitten im Schlag.
    return max(0.0, (1.0 - a) ** 1.7)


def main():
    n = int(RATE * DAUER)
    anstoss = np.zeros(n)
    luft = np.zeros(n)
    zufall = np.random.RandomState(1729)
    # Ein Anstoss ist kein einzelner Wert, sondern eine kurze Keule von
    # 1,5 ms. Die Breite bestimmt die Helligkeit: ein Einzelwert waere
    # ein Knacken, eine breite Keule ein dumpfes Klopfen.
    kb = int(RATE * 0.0015)
    keule = 0.5 - 0.5 * np.cos(2 * math.pi * np.arange(kb) / kb)
    for t in pulszeiten():
        i = int(t * RATE)
        laut = huelle(t) * (1.0 + 0.08 * zufall.uniform(-1, 1))
        if i + kb <= n:
            anstoss[i:i + kb] += keule * laut
            # Etwas Luft geht am Sack vorbei — sonst klingt es zu sauber.
            luft[i:i + kb] += keule * laut * 0.18 * zufall.normal(0, 1, kb)
    klang = np.zeros(n)
    for f, breite, laut in FORMANTEN:
        klang += laut * resonator(anstoss + luft * 0.6, f, breite)
    # Frueher stand hier ein selbstgebauter Hochpass (der Klang minus
    # sein eigener gleitender Mittelwert ueber 200 Werte). Der hat die
    # Pulse BREITGEZOGEN: 200 Werte sind 8,3 ms, und ein gleitender
    # Mittelwert schmiert symmetrisch nach vorn UND nach hinten.
    # Gemessen wurde daraus ein Puls mit 3,5 ms Anstieg und 4,8 ms
    # Abfall — also fast symmetrisch, und damit wieder ein Wabern
    # statt eines Schlages. Das Rumpeln nimmt jetzt der Hochpass von
    # ffmpeg weiter unten weg, der das nicht tut.
    spitze = float(np.max(np.abs(klang)))
    if spitze:
        klang = klang / spitze * 0.9
    roh = b"".join(struct.pack("<h", int(max(-32000, min(32000, w * 32000))))
                   for w in klang)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        # Der Kehlsack als Koerper: eine Glocke um 700 Hz.
                        # Und ein Limiter MIT level=disabled — ohne das
                        # macht alimiter die ganze Kette stumm.
                        "-af", "highpass=f=150,equalizer=f=700:t=q:w=1.4:g=4,"
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
