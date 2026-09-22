#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DAS SPUCKGERÄUSCH — NEU GERECHNET
---------------------------------------------------------------------
XANDER (Runde 80): „das Spukgeraeusch koennte realistischer klingen."

GEMESSEN am alten „rotze.opus" (0,05-s-Fenster, RMS):
  0,00–0,30 s  das Hochziehen im Rachen   rund -24 dB
  0,45 s       das „ptt", der Auswurf          -31 dB
  0,60 s       der nasse Aufschlag             -17 dB

Da steht der Fehler: der AUSWURF ist die leiseste Stelle des ganzen
Geraeusches. In Wirklichkeit ist er das Lauteste am Anfang — ein
Plosiv, ein kurzer Luftstoss mit sehr schnellem Anstieg. Wenn er
leiser ist als das Raeuspern davor, hoert man kein Spucken, sondern
ein Raeuspern mit Nachklang. Genau das meint er.

Jetzt sind es vier Abschnitte, und jeder hat seinen Grund:

  0,00–0,30 s  DAS HOCHZIEHEN. Gefiltertes Rauschen um 420 Hz mit
               einem Rasseln von 26 Hz — das Rasseln ist es, woran
               man den Rachen hoert; ohne es klingt es wie Wind.
  0,34–0,44 s  LUFT HOLEN. Leiser werdendes Rauschen, das die
               Spannung vor dem Stoss macht.
  0,46 s       DAS „PTT". Ein Plosiv: 4 ms Anstieg, 90 ms Abfall,
               breitbandig mit Schwerpunkt um 2,4 kHz. Der lauteste
               Punkt des Geraeusches — deshalb 1,0 statt 0,25.
  0,62 s       DER AUFSCHLAG. Ein tiefer Stoss (110 Hz, fallend) und
               darueber ein nasses, kurzes Rauschen — zusammen das
               „platsch".
  0,70–1,25 s  DER FADEN. Ein sehr leises, tiefes Schaben, das
               langsam ausklingt — das Ziehen, das danach bleibt.

    python3 werkzeug/rotze-bauen.py
=====================================================================
"""
import math, os, random, struct, subprocess, sys

HIER = os.path.dirname(os.path.abspath(__file__))
AUS = os.path.join(os.path.dirname(HIER), "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")
RATE = 24000
DAUER = 1.35

random.seed(80)


def mischen(daten, start, werte):
    ab = int(RATE * start)
    for i, w in enumerate(werte):
        j = ab + i
        if 0 <= j < len(daten):
            daten[j] += w


def rauschen(laenge, mitte, guete, huelle, zittern=0.0, zitterHz=0.0):
    """Gefiltertes Rauschen: ein einfacher Resonanzfilter zweiter
       Ordnung um „mitte" Hertz."""
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
        v = y * (1 - r) * huelle(i / n)
        if zittern:
            v *= 1 - zittern + zittern * (0.5 + 0.5 * math.sin(
                2 * math.pi * zitterHz * i / RATE))
        raus.append(v)
    return raus


def stoss(laenge, f0, f1, huelle):
    """Ein Ton, der im Fallen tiefer wird — der Koerper eines Schlags."""
    n = int(RATE * laenge)
    phase = 0.0
    raus = []
    for i in range(n):
        t = i / n
        phase += 2 * math.pi * (f0 + (f1 - f0) * t) / RATE
        raus.append(math.sin(phase) * huelle(t))
    return raus


def main():
    n = int(RATE * DAUER)
    daten = [0.0] * n

    # 1. Das Hochziehen im Rachen.
    mischen(daten, 0.00, rauschen(
        0.30, 420, 2.2,
        lambda t: 0.33 * (0.35 + 0.65 * math.sin(math.pi * min(1, t * 1.15))),
        zittern=0.55, zitterHz=26))

    # 2. Luft holen — leiser, hoeher, kurz.
    mischen(daten, 0.34, rauschen(
        0.10, 900, 1.1, lambda t: 0.13 * (1 - t)))

    # 3. DAS „PTT" — der Auswurf. 4 ms Anstieg, dann schnell weg.
    def plosiv(t):
        ms = t * 90.0
        if ms < 4:
            return ms / 4.0
        return math.exp(-(ms - 4) / 16.0)
    mischen(daten, 0.46, rauschen(0.09, 2400, 0.9, lambda t: 1.35 * plosiv(t)))
    # Darunter der Luftstoss selbst — tiefer und etwas laenger.
    mischen(daten, 0.46, rauschen(0.12, 700, 1.4,
                                  lambda t: 0.34 * math.exp(-t * 5.5)))

    # 4. Der nasse Aufschlag.
    mischen(daten, 0.62, stoss(0.09, 150, 70,
                               lambda t: 0.55 * math.exp(-t * 6.0)))
    mischen(daten, 0.62, rauschen(0.16, 1500, 1.0,
                                  lambda t: 0.40 * math.exp(-t * 4.2)))

    # 5. Der Faden, der nachzieht.
    mischen(daten, 0.72, rauschen(
        0.52, 260, 3.0, lambda t: 0.16 * (1 - t) * (1 - t),
        zittern=0.4, zitterHz=13))

    roh = b"".join(struct.pack("<h", max(-32000, min(32000, int(w * 30000))))
                   for w in daten)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        "-af", "highpass=f=90,alimiter=limit=0.95:level=disabled",
                        "-ac", "2", "-c:a", "libopus", "-b:a", "56k",
                        os.path.join(AUS, "rotze.opus")], input=roh)
    if p.returncode:
        sys.exit("opus fehlgeschlagen")
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-i", os.path.join(AUS, "rotze.opus"),
                        "-c:a", "aac", "-b:a", "72k",
                        os.path.join(AUS, "rotze.m4a")])
    if p.returncode:
        sys.exit("m4a fehlgeschlagen")
    for e in ("opus", "m4a"):
        f = os.path.join(AUS, "rotze." + e)
        print("rotze.%s  %d Bytes" % (e, os.path.getsize(f)))


main()
