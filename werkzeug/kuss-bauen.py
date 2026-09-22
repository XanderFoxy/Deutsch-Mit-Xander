#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DER KUSS — SCHMATZ UND EIN „MMMH" HINTERHER
---------------------------------------------------------------------
XANDER (Runde 87): „Der Kuss hat immer noch keinen Sound, keinen
S-M-A-C-K Sound mit M-M-M-H Geraeusch — also wenn man jemanden mit
Sound kuesst, mit so einem Humming."

WAS BISHER DA WAR: „kussmann" und „kussfrau" aus Runde 77 — 0,63 s,
und sie enthalten NUR den Schmatz. Das Brummen, das er beschreibt,
fehlte ganz. Die alten Dateien liegen in
werkzeug/backup/ton-runde87/.

WORAUS EIN KUSS BESTEHT, und warum jeder Teil hier steht:

  1. DER SOG (0,00 bis 0,07 s). Beim Schliessen der Lippen entsteht
     ein Unterdruck. Man hoert ihn als kurzes, gefiltertes Rauschen,
     das ansteigt — ohne ihn beginnt der Knall aus dem Nichts.
  2. DER KNALL (bei 0,07 s). Das Loesen der Lippen. 1,2 ms Anstieg,
     dann ein Abfall ueber rund 90 ms. Das ist der eigentliche
     „Smack", und er ist der lauteste Punkt der Datei.
  3. DER MUNDRAUM. Knall und Sog werden von zwei Formanten gefaerbt;
     genau daran hoert man, dass es ein MUND ist und nicht ein
     Klatschen. Frau 720/1250 Hz, Mann 470/880 Hz — dieselben Werte
     wie in Runde 77, sie waren richtig.
  4. DAS BRUMMEN „MMMH" (0,17 bis 0,95 s). Ein M ist ein stimmhafter
     NASAL: die Lippen sind geschlossen, der Ton geht durch die Nase.
     Deshalb drei Dinge:
       · ein Grundton mit Obertoenen (Frau 215 Hz, Mann 118 Hz),
       · eine Nasenresonanz um 250 bis 300 Hz und eine Senke
         („Antiformant") um 1000 Hz — das ist es, was ein M von
         einem A unterscheidet,
       · und alles oberhalb 1,8 kHz faellt weg, weil der Mund zu ist.
     Die Tonhoehe steigt zuerst leicht und faellt dann ab — das
     „mmMMhh" eines zufriedenen Kusses, nicht ein gerader Summton.

DIE REIHENFOLGE IST ABSICHT. Der Effekt spielt die Datei bei 520 ms
an, und dort kommt der Mund am Bild an (LC_TREFFER.kuss). Der Knall
muss also VORN liegen; das Brummen gehoert danach.

    python3 werkzeug/kuss-bauen.py
=====================================================================
"""
import math, os, random, struct, subprocess, sys

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
AUS = os.path.join(WURZEL, "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")

RATE = 24000
DAUER = 1.00
KNALL = 0.070          # Sekunde, in der die Lippen sich loesen


def zwei_pole(daten, f, q, laut):
    """Ein Resonator (Formant). Faerbt das, was schon da liegt."""
    aus = [0.0] * len(daten)
    w = 2 * math.pi * f / RATE
    r = math.exp(-w / (2 * q))
    a1 = 2 * r * math.cos(w)
    a2 = -r * r
    y1 = y2 = 0.0
    for i, x in enumerate(daten):
        y = x + a1 * y1 + a2 * y2
        y2, y1 = y1, y
        aus[i] = y * laut
    return aus


def main(name, f1, f2, grund):
    n = int(RATE * DAUER)
    zisch = [0.0] * n          # Sog und Knall, durch den Mund gefaerbt
    summen = [0.0] * n         # das „mmmh"
    rnd = random.Random(87)

    # --- 1./2. Sog und Knall --------------------------------------
    ab = int(RATE * KNALL)
    sog = int(RATE * 0.070)
    for i in range(sog):
        # Der Sog steigt zum Knall hin an: quadratisch, damit er
        # nicht als gleichmaessiges Rauschen auffaellt.
        h = (i / sog) ** 2 * 0.22
        zisch[ab - sog + i] += (rnd.random() * 2 - 1) * h
    # Der Knall selbst: 1,2 ms Anstieg, dann exponentiell herunter.
    anstieg = max(1, int(RATE * 0.0012))
    for i in range(n - ab):
        h = (i / anstieg) if i < anstieg else math.exp(-(i - anstieg) / (RATE * 0.030))
        # WICHTIG: erst NACH dem Anstieg abbrechen. Beim ersten
        # Durchgang ist h gleich 0 (i = 0), und ein Abbruch dort
        # loescht den ganzen Knall — gemessen lag dann bei 0,10 s
        # digitale Stille, und man hoerte nur noch das Brummen.
        if i > anstieg and h < 0.0005:
            break
        zisch[ab + i] += (rnd.random() * 2 - 1) * h

    # --- 3. Der Mundraum ------------------------------------------
    a = zwei_pole(zisch, f1, 7.0, 0.55)
    b = zwei_pole(zisch, f2, 9.0, 0.30)
    mund = [a[i] + b[i] + zisch[i] * 0.18 for i in range(n)]

    # --- 4. Das Brummen -------------------------------------------
    von, bis = 0.17, 0.95
    i0, i1 = int(RATE * von), int(RATE * bis)
    phase = 0.0
    for i in range(i0, i1):
        t = (i - i0) / (i1 - i0)
        # steigt kurz an, faellt dann ab — „mmMMhh"
        f = grund * (1.0 + 0.06 * math.sin(math.pi * min(1.0, t * 2.4))
                     - 0.10 * max(0.0, t - 0.45))
        phase += 2 * math.pi * f / RATE
        klang = (math.sin(phase)
                 + 0.55 * math.sin(2 * phase)
                 + 0.28 * math.sin(3 * phase)
                 + 0.12 * math.sin(4 * phase))
        # Huellkurve: schnell auf, lange aus.
        if t < 0.10:
            h = t / 0.10
        elif t < 0.55:
            h = 1.0
        else:
            h = max(0.0, 1.0 - (t - 0.55) / 0.45) ** 1.6
        summen[i] += klang * h * 0.30
    # Die Nase: eine Resonanz tief unten, und alles Helle faellt weg.
    nase = zwei_pole(summen, 270, 6.0, 0.6)
    summen = [summen[i] * 0.55 + nase[i] for i in range(n)]

    # BEIDE TEILE GETRENNT AUSSTEUERN. Wuerde man die Summe als
    # Ganzes normieren, entschiede der lautere Teil ueber den
    # leiseren — und gemessen war das Brummen 40 dB lauter als der
    # Knall, obwohl der Knall der Kuss IST. Jeder Teil wird deshalb
    # auf 1 gebracht und dann bewusst gemischt: der Schmatz voll, das
    # Brummen bei 0,45 (rund -7 dB darunter).
    def norm(x):
        h = max(1e-9, max(abs(v) for v in x))
        return [v / h for v in x]
    mund = norm(mund)
    summen = norm(summen)
    daten = [mund[i] * 0.95 + summen[i] * 0.45 for i in range(n)]
    hoch = max(1e-9, max(abs(x) for x in daten))
    daten = [x / hoch * 0.92 for x in daten]

    roh = b"".join(struct.pack("<h", max(-32000, min(32000, int(w * 32000))))
                   for w in daten)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        # Der Antiformant des M: eine Senke um 1 kHz.
                        # Darueber macht der geschlossene Mund zu.
                        # Der Limiter braucht level=disabled, sonst
                        # macht er die ganze Kette stumm.
                        "-af", "highpass=f=70,"
                               "equalizer=f=1000:t=q:w=1.4:g=-7,"
                               "lowpass=f=4200,"
                               "alimiter=limit=0.94:level=disabled",
                        "-ac", "2", "-c:a", "libopus", "-b:a", "56k",
                        os.path.join(AUS, name + ".opus")], input=roh)
    if p.returncode:
        sys.exit("opus fehlgeschlagen")
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-i", os.path.join(AUS, name + ".opus"),
                        "-c:a", "aac", "-b:a", "72k",
                        os.path.join(AUS, name + ".m4a")])
    if p.returncode:
        sys.exit("m4a fehlgeschlagen")
    for e in ("opus", "m4a"):
        f = os.path.join(AUS, name + "." + e)
        print("%s.%s  %d Bytes" % (name, e, os.path.getsize(f)))


# Frau: hoeherer Mundraum, hoeherer Grundton. Mann: tiefer.
main("kussfrau", 720, 1250, 215)
main("kussmann", 470, 880, 118)
