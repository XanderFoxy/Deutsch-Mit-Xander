#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DAS FAHRGERAEUSCH — EIN MOTOR, DER NICHT AUFHOERT
---------------------------------------------------------------------
XANDER (Runde 85): „beim Reisen hoert man kein Fahrgeraeusch, man
hoert nur das quietschende Bremsen am Schluss."
XANDER (Runde 88): „Ich weiss auch nicht, ob du das Autofahrer-
Geraeusch schon gemacht hast."

NACHGESEHEN, und er hat beide Male recht gehabt. In Runde 85 wurde
zwar „lcTonReise" eingebaut, das die Plan-Dauer auf die wirkliche
Fahrzeit streckt — aber gestreckt wird damit nur, wann ABGEBLENDET
wird. Ob die Datei von vorn anfaengt, entscheidet „schleife", und
das stand bei „fahren" nicht. GEMESSEN: ton/fahrt.opus war 1,00 s
lang, eine Fahrt ueber vier Felder dauert aber 2,6 bis 4 Sekunden.
Man hoerte also eine Sekunde Motor und danach Stille — genau das,
was er beschrieben hat.

ZWEI SACHEN GEHOEREN DAZU, und eine allein nuetzt nichts:
  1. „schleife: true" im Tonplan (app.js), damit die Datei von vorn
     anfaengt, solange gefahren wird.
  2. EINE DATEI, DIE SICH SCHLEIFEN LAESST. Die alte blendete am
     Ende aus (gemessen: Anfang 0,049 RMS, Ende 0,000 — 52 dB
     Unterschied). Im Kreis gespielt haette das im Sekundentakt
     gepumpt.

DESHALB IST DIESE DATEI SO GEBAUT, DASS SIE NAHTLOS IST — nicht
„ungefaehr", sondern rechnerisch:
  · Die Laenge ist 1,20 s. Alles, was darin klingt, hat eine
    Frequenz, die ein ganzzahliges Vielfaches von 1/1,20 s ist.
    Damit endet jede einzelne Schwingung genau dort, wo sie anfaengt.
  · Der Motor ist eine PULSFOLGE: ein Vierzylinder-Viertakter zuendet
    zweimal je Umdrehung, bei rund 2200 Umdrehungen in der Minute
    sind das 73,3 Zuendungen je Sekunde. 73,3 mal 1,2 sind GENAU 88
    Pulse — deshalb diese Zahl.
  · Jeder Puls geht durch den Auspuff, und der ist ein Resonator.
    Gefaltet wird ZYKLISCH (ueber die Fourier-Transformierte), damit
    auch der Nachklang des letzten Pulses vorn wieder hereinkommt
    statt abgeschnitten zu werden.
  · Das Rollgeraeusch der Reifen ist gefiltertes Rauschen, und es
    wird im Frequenzbereich erzeugt: nur auf den Vielfachen von
    1/1,20 s, mit zufaelliger Phase. So ist auch das Rauschen
    periodisch und knackt an der Nahtstelle nicht.

Die alte Datei liegt in werkzeug/backup/ton-runde88/fahrt.opus.

    python3 werkzeug/fahrgeraeusch-bauen.py
=====================================================================
"""
import math, os, struct, subprocess, sys

import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
AUS = os.path.join(WURZEL, "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")

RATE = 24000
DAUER = 1.20
PULSE = 88          # Zuendungen je Schleife -> 73,3 Hz
NAME = "fahrt"


def resonator(n, f, breite, laut):
    """Die Impulsantwort eines Zwei-Pol-Resonators, auf n Werte."""
    r = math.exp(-math.pi * breite / RATE)
    th = 2 * math.pi * f / RATE
    t = np.arange(n)
    return laut * (r ** t) * np.sin(th * t)


def main():
    n = int(RATE * DAUER)
    zufall = np.random.RandomState(5150)

    # --- DIE ZUENDUNGEN -------------------------------------------
    # Genau 88 Pulse auf n Werte: der Abstand ist n/88, und weil der
    # letzte Puls so weit vom Ende weg ist wie der erste vom Anfang,
    # passt die Folge im Kreis.
    anstoss = np.zeros(n)
    kb = int(RATE * 0.0016)
    keule = 0.5 - 0.5 * np.cos(2 * math.pi * np.arange(kb) / kb)
    for k in range(PULSE):
        i = int(round(k * n / PULSE))
        # Ein Motor laeuft nie voellig gleich: die Zylinder zuenden
        # minimal verschieden stark. 4 Zylinder -> Muster von 4.
        laut = (1.0, 0.94, 1.02, 0.97)[k % 4] * (1.0 + 0.04 * zufall.uniform(-1, 1))
        for j in range(kb):
            anstoss[(i + j) % n] += keule[j] * laut

    # --- DER AUSPUFF ----------------------------------------------
    # Drei Resonanzen: der tiefe Koerper des Endtopfs, der Mittelton
    # des Kruemmers und ein heller Rest vom Ventiltrieb.
    antwort = (resonator(n, 96.0, 26.0, 1.00)
               + resonator(n, 232.0, 60.0, 0.46)
               + resonator(n, 640.0, 180.0, 0.16))
    # ZYKLISCHE Faltung ueber die Fourier-Transformierte: der
    # Nachklang des letzten Pulses laeuft vorn wieder herein.
    motor = np.real(np.fft.ifft(np.fft.fft(anstoss) * np.fft.fft(antwort)))

    # --- DIE REIFEN AUF DEM ASPHALT -------------------------------
    # Im Frequenzbereich erzeugt: nur auf den Vielfachen von 1/DAUER,
    # mit zufaelliger Phase. Damit ist es periodisch.
    halb = n // 2 + 1
    f = np.fft.rfftfreq(n, 1.0 / RATE)
    form = np.zeros(halb)
    gut = f > 1
    # Breitbandig mit Schwerpunkt um 700 Hz, darueber abfallend.
    form[gut] = (1.0 / (1.0 + (f[gut] / 700.0) ** 2.2)) * (1.0 - 1.0 / (1.0 + (f[gut] / 120.0) ** 3))
    phase = zufall.uniform(0, 2 * math.pi, halb)
    spek = form * np.exp(1j * phase)
    spek[0] = 0.0
    if n % 2 == 0:
        spek[-1] = np.abs(spek[-1])
    rollen = np.fft.irfft(spek, n)
    if np.max(np.abs(rollen)):
        rollen = rollen / np.max(np.abs(rollen))

    klang = motor / (np.max(np.abs(motor)) or 1) * 0.82 + rollen * 0.30
    klang = klang / (np.max(np.abs(klang)) or 1) * 0.88

    roh = b"".join(struct.pack("<h", int(max(-32000, min(32000, w * 32000))))
                   for w in klang)
    # KEIN Ein- und Ausblenden und KEIN Limiter mit Nachlauf: beides
    # wuerde die Nahtstelle wieder kaputt machen. Nur ein Hochpass
    # gegen Gerumpel unter 50 Hz.
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        "-af", "highpass=f=50",
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
    for e in ("opus", "m4a"):
        d = os.path.join(AUS, NAME + "." + e)
        print("%s.%s  %d Bytes" % (NAME, e, os.path.getsize(d)))


main()
