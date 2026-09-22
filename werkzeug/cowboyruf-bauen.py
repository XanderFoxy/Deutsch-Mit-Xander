#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=========================================================
DER YIHAAH-RUF BEKOMMT SEIN ENDE ZURUECK
---------------------------------------------------------
XANDER, Runde 88: „das YIHAAH Geraeusch ist immer noch
abgeschnitten."

NACHGEMESSEN an ton/cowboy.opus in 10-ms-Fenstern:

  1,60 s  -19,8 dB      1,72 s  -29,7 dB
  1,64 s  -21,1 dB      1,73 s  -35,6 dB
  1,68 s  -26,0 dB      1,75 s  -44,2 dB
  1,71 s  -26,8 dB      1,80 s  -72,5 dB

Bis 1,71 s faellt der Ruf mit rund 5 dB pro 50 ms — das ist
sein natuerliches Ausklingen. Ab 1,72 s faellt er mit 45 dB
in 80 ms. Das ist kein Ausklingen mehr, das ist ein SCHNITT:
beim Erzeugen lag eine harte Ausblende von etwa 100 ms auf
der Datei. Genau den hoert er.

WAS HIER PASSIERT — und was ausdruecklich NICHT passiert:
Es wird keine Stimme erfunden und nichts dazugesungen. Der
Ruf selbst bleibt Ton fuer Ton, wie er ist. Nur zwei Dinge
aendern sich:

 1. Der kuenstliche Schnitt wird weggeschnitten. Die Datei
    endet dort, wo der Ruf noch von selbst ausklingt.
 2. Der Ruf bekommt den Raum zurueck, in dem er gerufen
    wird: eine gefaltete Nachhallfahne (Impulsantwort mit
    zwei Canyon-Reflexionen bei 185 und 327 ms und einem
    dichten, exponentiell abfallenden Schwanz, RT60 = 0,9 s).
    Das ist derselbe Ruf, nur von den Felsen zurueck — und
    er verklingt, statt abzureissen.

Aufruf:  python3 werkzeug/cowboyruf-bauen.py
Ergebnis: ton/cowboy.opus und ton/cowboy.m4a (das Alte
liegt in werkzeug/backup/ton-runde88/).
========================================================= """
import os, subprocess, sys
import numpy as np

FF = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg"
WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUELLE = os.path.join(WURZEL, "werkzeug", "backup", "ton-runde88", "cowboy.opus")
SR = 48000

def lese(pfad):
    roh = subprocess.run(
        [FF, "-v", "error", "-i", pfad, "-f", "f32le", "-ar", str(SR), "-ac", "1", "-"],
        stdout=subprocess.PIPE, check=True).stdout
    return np.frombuffer(roh, dtype="<f4").astype(np.float64)

def huellkurve(x, fenster_ms=10):
    f = int(SR * fenster_ms / 1000)
    n = len(x) // f
    q = x[:n * f].reshape(n, f)
    return 10 * np.log10((q * q).mean(axis=1) + 1e-12), f

def schnitt_finden(x):
    """Wo faengt die kuenstliche Ausblende an?

       Das natuerliche Ausklingen dieser Stimme faellt mit rund
       0,7 dB je 10-ms-Fenster, die Blende im Mittel mit 5. Gesucht
       ist das erste Fenster im letzten Drittel, ab dem der Pegel
       ueber drei Fenster im SCHNITT steiler als 3,5 dB je Fenster
       faellt — einzelne Fenster schwanken zu stark, um sie einzeln
       zu pruefen — und das vier Fenster spaeter unter -40 dB liegt,
       damit eine Atempause im Ruf nicht als Blende durchgeht."""
    db, f = huellkurve(x)
    ab = int(len(db) * 0.6)
    for i in range(ab, len(db) - 4):
        if (db[i] - db[i + 3]) / 3 > 3.5 and db[i + 4] < -40:
            return i, db, f
    return len(db) - 1, db, f


def blende_zuruecknehmen(x, i0, db, f):
    """Die Blende WEGRECHNEN statt wegschneiden.

       Die Abtastwerte hinter i0 sind nicht leer — sie sind nur
       heruntergeregelt worden. Wer die Regelung umkehrt, bekommt
       den echten Ausklang zurueck; es wird nichts erfunden, nur
       eine bekannte Daempfung rueckgaengig gemacht.

       Wie stark? So stark, dass der Pegel mit derselben Neigung
       weiterfaellt, mit der er VOR der Blende gefallen ist
       (Ausgleichsgerade ueber die 300 ms davor). Mehr als 20 dB
       wird nie angehoben — darunter liegt nur noch das Rauschen
       des Kodierers —, und
       wo die Gerade unter -55 dB kommt, ist wirklich Schluss."""
    n_vor = int(300 / 10)
    j0 = max(0, i0 - n_vor)
    xs = np.arange(j0, i0, dtype=float)
    ys = db[j0:i0]
    neigung, achse = np.polyfit(xs, ys, 1)      # dB je Fenster
    neigung = min(neigung, -0.4)                # nie ansteigend rechnen
    print("   natuerliche Neigung davor: %.2f dB je 10 ms" % neigung)
    gewinn_db = np.zeros(len(db))
    letztes = i0
    for i in range(i0, len(db)):
        ziel = achse + neigung * i
        if ziel < -55:
            break
        g = ziel - db[i]
        if g > 20:
            break
        gewinn_db[i] = max(0.0, g)
        letztes = i
    # Der Gewinn wird je Fenster berechnet, aber Abtastwert fuer
    # Abtastwert weich dazwischen gelegt — eine Treppe im Gewinn
    # waere selbst wieder hoerbar.
    kanten = np.arange(len(db)) * f + f / 2
    y = x.copy()
    bis = min(len(x), (letztes + 1) * f)
    idx = np.arange(i0 * f, bis)
    g = np.interp(idx, kanten, gewinn_db)
    y[i0 * f:bis] *= 10 ** (g / 20)
    return y[:bis], letztes


def impulsantwort():
    """Ein Tal, kein Badezimmer. Direkter Schall, zwei klare
       Reflexionen von den Felswaenden, dazwischen und danach
       ein dichter Schwanz aus gefiltertem Rauschen, der in
       1,1 s um 60 dB faellt.

       NACHGEMESSEN und danach geaendert: in der ersten Fassung
       lagen die beiden Reflexionen bei 0,42 und 0,24 und der
       Schwanz setzte erst nach 25 ms ein. Zwischen dem Ende des
       Rufs und der ersten Reflexion klaffte dadurch eine Luecke —
       der Pegel fiel bei 1,85 s um 11,8 dB in 30 ms und stieg
       danach wieder an. Das ist zwar kein Abriss, klingt aber wie
       einer. Jetzt traegt der dichte Schwanz mehr (0,70 statt
       0,55), faellt langsamer und setzt schon nach 12 ms ein; die
       Reflexionen sind entsprechend leiser."""
    laenge = int(SR * 1.05)
    rng = np.random.default_rng(1876)          # 1876: das Jahr, Rauschen soll reproduzierbar sein
    ir = np.zeros(laenge)
    # Der dichte Schwanz. Er setzt erst nach 25 ms ein — vorher
    # ist der Raum noch leer (Anfangszeitluecke).
    t = np.arange(laenge) / SR
    schwanz = rng.normal(0.0, 1.0, laenge) * np.exp(-6.9078 * t / 1.1)
    schwanz[: int(SR * 0.012)] = 0.0
    ir += schwanz * 0.70
    # Die zwei Felsreflexionen: kurze, leicht verschmierte Stoesse.
    for verzug, staerke in ((0.185, 0.26), (0.327, 0.15)):
        i0 = int(SR * verzug)
        stoss = rng.normal(0.0, 1.0, int(SR * 0.03))
        stoss *= np.hanning(len(stoss))
        ir[i0:i0 + len(stoss)] += stoss * staerke
    # Hoehen weg: Luft und Fels schlucken sie. Zwei einfache
    # Tiefpassdurchlaeufe (ein Pol, 3,2 kHz), vorwaerts genuegt.
    a = np.exp(-2 * np.pi * 3200 / SR)
    for _ in range(2):
        y = np.empty_like(ir); z = 0.0
        for i in range(len(ir)):
            z = (1 - a) * ir[i] + a * z
            y[i] = z
        ir = y
    ir /= np.abs(ir).max()
    return ir

def schreibe(x, name):
    x = np.clip(x, -1.0, 1.0).astype("<f4").tobytes()
    roh = "/tmp/claude-0/cowboyruf.f32"
    open(roh, "wb").write(x)
    for endung, args in (
        (".opus", ["-c:a", "libopus", "-b:a", "56k"]),
        (".m4a", ["-c:a", "aac", "-b:a", "72k"]),
    ):
        ziel = os.path.join(WURZEL, "ton", name + endung)
        subprocess.run([FF, "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1",
                        "-i", roh] + args + [ziel, "-y"], check=True)
        print("  geschrieben:", ziel, os.path.getsize(ziel), "Bytes")

def main():
    x = lese(QUELLE)
    print("Quelle: %.3f s" % (len(x) / SR))
    i0, db, f = schnitt_finden(x)
    print("Kuenstliche Ausblende beginnt bei %.3f s (dort noch %.1f dB)"
          % (i0 * f / SR, db[i0]))
    trocken, letztes = blende_zuruecknehmen(x, i0, db, f)
    print("Ausklang zurueckgerechnet bis %.3f s" % (len(trocken) / SR))
    trocken = trocken.copy()
    # Der Anfang: 8 ms Anlauf, damit kein Knacken am Nullpunkt steht.
    n0 = int(SR * 0.008)
    trocken[:n0] *= np.linspace(0.0, 1.0, n0) ** 0.5

    ir = impulsantwort()
    from scipy.signal import fftconvolve
    nass = fftconvolve(trocken, ir)[: len(trocken) + len(ir)]
    # Der Hall wird auf denselben Spitzenwert gebracht wie der
    # trockene Ruf und dann leise dazugemischt: der Ruf bleibt
    # der Ruf, der Raum steht nur dahinter.
    nass *= np.abs(trocken).max() / max(1e-9, np.abs(nass).max())
    misch = np.zeros(len(nass))
    misch[: len(trocken)] += trocken
    misch += nass * 0.34

    # Wo ist es wirklich zu Ende? Dort, wo der Hall unter -66 dB
    # faellt — alles danach ist Stille und braucht keine Datei.
    db, f = huellkurve(misch)
    letzte = np.where(db > -66)[0]
    schluss = min(len(misch), (letzte[-1] + 1) * f + int(SR * 0.12))
    misch = misch[:schluss]
    # Und die allerletzten 120 ms sanft auf Null — eine Blende,
    # die unter -66 dB liegt, hoert kein Mensch, aber sie
    # verhindert den Sprung am Dateiende.
    n1 = int(SR * 0.12)
    misch[-n1:] *= np.linspace(1.0, 0.0, n1) ** 2

    misch *= 0.89 / max(1e-9, np.abs(misch).max())
    print("Ergebnis: %.3f s (vorher 1,86 s)" % (len(misch) / SR))
    db, f = huellkurve(misch)
    for s in range(int(1.55 * SR / f), len(db)):
        print("   %.2f s  %.1f dB" % (s * f / SR, db[s]))
    schreibe(misch, "cowboy")

main()
