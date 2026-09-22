#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DIE BIRNE IN DIE FASSUNG DREHEN
---------------------------------------------------------------------
XANDER (Runde 88): „wenn man die Birne in die Fassung dreht und somit
das Licht [anmacht], hat man nicht denselben Drehsound, den er hat,
wenn man die Birne raus dreht. Wenn man die Birne rein dreht, klingt
[es] … nicht realistisch."

NACHGEMESSEN, und er hat genau recht:
  ton/birneschrauben.opus (HERAUSdrehen, 3,20 s)
      Schwerpunkt 5572 Hz, die Huellkurve springt zwischen -10 und
      -60 dB — das sind einzelne Schabgeraeusche mit Stille
      dazwischen, also ein Gewinde, das sich dreht.
  ton/birnedrehen.opus (HINEINdrehen, 2,31 s, alt)
      Schwerpunkt 674 Hz, die Huellkurve steht fast durchgehend bei
      -25 dB — ein tiefes Brummen ohne Luecken. Das ist ein Motor,
      kein Gewinde.

WAS BEIM EINSCHRAUBEN WIRKLICH PASSIERT — und warum es nicht
dasselbe ist wie beim Ausschrauben:
  · Ein Gewinde laeuft nicht gleichmaessig, es RUCKT: der Messingsockel
    haftet, loest sich, haftet wieder (Haftgleiten). Jedes Loesen ist
    ein kurzes, helles Schaben.
  · Beim HINEINdrehen wird es enger, nicht weiter. Die Schabgeraeusche
    kommen deshalb dichter, werden lauter und heller, je weiter sie
    hineingeht — beim Herausdrehen ist es umgekehrt.
  · Am Ende sitzt sie fest, und der Kontakt rastet ein. Dieser Klick
    liegt nicht in dieser Datei, sondern kommt in app.js als
    „birneplopp" bei 2320 ms — genau dann, wenn hier Schluss ist.

  0,00 s  erstes Schaben, 4,6 je Sekunde, noch locker und dumpf
  2,30 s  letztes Schaben, 9,2 je Sekunde, eng und hell
  2,40 s  Dateiende (der Kontakt klickt in app.js)

Die alte Datei liegt in werkzeug/backup/ton-runde88/birnedrehen.opus.

    python3 werkzeug/birnedrehen-bauen.py
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
DAUER = 2.40
ENDE = 2.30          # bis hierhin wird gedreht
RATE0 = 4.6          # Schabgeraeusche je Sekunde am Anfang
RATE1 = 9.2          # und am Ende, wenn es eng wird
NAME = "birnedrehen"


def resonator(x, f, breite):
    r = math.exp(-math.pi * breite / RATE)
    th = 2 * math.pi * f / RATE
    return lfilter([1.0 - r], [1.0, -2 * r * math.cos(th), r * r], x)


def main():
    n = int(RATE * DAUER)
    klang = np.zeros(n)
    zufall = np.random.RandomState(6113)

    # --- DIE ZEITPUNKTE DER SCHABGERAEUSCHE -----------------------
    zt = []
    t = 0.01
    while t <= ENDE:
        zt.append(t)
        a = t / ENDE
        rate = RATE0 + (RATE1 - RATE0) * a
        # Haftgleiten ist nie gleichmaessig: +-18 % Zittern.
        t += (1.0 / rate) * (1.0 + 0.18 * zufall.uniform(-1, 1))

    for t in zt:
        a = t / ENDE
        # Je weiter hinein, desto kuerzer und haerter das Schaben.
        lang = 0.026 - 0.012 * a
        m = int(RATE * lang)
        if m < 8:
            continue
        i = int(t * RATE)
        if i + m > n:
            break
        # Das Schaben selbst ist Rauschen, das in einer Metallresonanz
        # steckt. Die Resonanz wandert nach oben, weil das Gewinde
        # enger wird: 2600 Hz locker, 5200 Hz fest.
        roh = zufall.normal(0, 1, m)
        # Eine kurze Keule: schnell an, langsamer aus — ein Ruck.
        h = np.arange(m) / m
        keule = np.exp(-h * 5.5) * (1 - np.exp(-h * 60))
        f1 = 2600 + 2600 * a
        stueck = resonator(roh * keule, f1, 900)
        stueck += 0.45 * resonator(roh * keule, f1 * 1.9, 1500)
        # Lauter, je fester sie sitzt.
        laut = (0.42 + 0.58 * a) * (1.0 + 0.22 * zufall.uniform(-1, 1))
        sp = float(np.max(np.abs(stueck))) or 1.0
        klang[i:i + m] += stueck / sp * laut

    # Ein ganz leises Grundreiben, damit zwischen den Ruckern nicht
    # voellige Stille ist — die Hand dreht ja weiter.
    grund = zufall.normal(0, 1, n)
    grund = resonator(grund, 3200, 2600)
    huelle = np.clip(np.arange(n) / (RATE * ENDE), 0, 1)
    # LEISE. Beim ersten Versuch lag dieses Grundreiben bei 0,045 bis
    # 0,095, und damit fuellte es die Luecken zwischen den Ruckern
    # auf: gemessen kam die Huellkurve auf nur 18 dB Spanne, waehrend
    # die gute Datei (birneschrauben) 56 dB hat. Die Stille ZWISCHEN
    # den Schabgeraeuschen ist aber genau das, was ein Gewinde
    # ausmacht.
    grund = grund / (np.max(np.abs(grund)) or 1) * (0.010 + 0.016 * huelle)
    grund[int(RATE * ENDE):] *= np.linspace(1, 0, n - int(RATE * ENDE))
    klang += grund

    sp = float(np.max(np.abs(klang))) or 1.0
    klang = klang / sp * 0.88
    roh = b"".join(struct.pack("<h", int(max(-32000, min(32000, w * 32000))))
                   for w in klang)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        # Unter 400 Hz hat ein Gewinde nichts zu suchen —
                        # genau das war der Fehler der alten Datei.
                        "-af", "highpass=f=400,alimiter=limit=0.92:level=disabled",
                        "-ac", "2", "-c:a", "libopus", "-b:a", "64k",
                        os.path.join(AUS, NAME + ".opus")], input=roh)
    if p.returncode:
        sys.exit("opus fehlgeschlagen")
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-i", os.path.join(AUS, NAME + ".opus"),
                        "-c:a", "aac", "-b:a", "80k",
                        os.path.join(AUS, NAME + ".m4a")])
    if p.returncode:
        sys.exit("m4a fehlgeschlagen")
    print("%d Schabgeraeusche" % len(zt))
    for e in ("opus", "m4a"):
        d = os.path.join(AUS, NAME + "." + e)
        print("%s.%s  %d Bytes" % (NAME, e, os.path.getsize(d)))


main()
