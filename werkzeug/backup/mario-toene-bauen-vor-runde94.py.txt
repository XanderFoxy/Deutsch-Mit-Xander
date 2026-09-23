#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DIE ZWEI TOENE FUER DEN MARIO-MODUS
---------------------------------------------------------------------
XANDER (Runde 88): „wenn ich mich unter der oberen Reihe bewege, dass
ich wie bei Super Mario an die Plaetze dran schlagen kann, wo Leute
sitzen, und dann Power-up rauskommt oder Muenzen — ja, dass ich kurz
mit dem Kopf da dran huepfe und dann kriege ich ne Muenze und noch mal
ne Muenze … da koennte auch ne Vergroesserung von meinem Profilbild
sein, also wie bei Mario, wenn er waechst."

WARUM NICHT EINER DER VORHANDENEN TOENE. Im Ordner liegt „muenze"
(2,0 s) und „muenze2" (5,5 s) — das sind fallende und klimpernde
Geldstuecke, also Geraeusche. Was hier gebraucht wird, ist kein
Geraeusch, sondern ein SIGNAL: zwei Toene, sofort da, sofort weg.
Deshalb zwei neue Dateien, und beide sind so gebaut, wie ein
Achtziger-Spielgeraet klang — mit Rechteckwellen, nicht mit Samples.

  mariomuenze  0,60 s   H5 (988 Hz), 75 ms, dann E6 (1319 Hz), der
                        ausklingt. Die reine Quart nach oben ist das,
                        was man als „Muenze" im Ohr hat.
  mariopilz    0,95 s   eine Leiter aus kurzen Rechtecktoenen, die in
                        vier Schueben immer hoeher ansetzt — der
                        Klang des Wachsens.

Rechteck heisst hier wirklich Rechteck: sign(sin). Ein Sinus klaenge
weich und nach Floete, und genau daran erkennt man den Unterschied
zwischen „Achtziger" und „nachgemacht".

    python3 werkzeug/mario-toene-bauen.py
=====================================================================
"""
import os, struct, subprocess, sys

import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
AUS = os.path.join(WURZEL, "ton")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")
RATE = 24000


def rechteck(hz, dauer, anteil=0.5):
    """Eine Rechteckwelle. „anteil" ist das Tastverhaeltnis — 0,5 ist
       hohl, 0,25 klingt duenner und naeher an der Spielkonsole."""
    n = int(RATE * dauer)
    t = np.arange(n) / RATE
    phase = (t * hz) % 1.0
    return np.where(phase < anteil, 1.0, -1.0)


def huelle(n, an=0.004, ab=0.06):
    """Kurz an, langsam aus — ohne das knackt jeder Ton am Rand."""
    h = np.ones(n)
    a = min(int(RATE * an), n)
    b = min(int(RATE * ab), n - a)
    if a:
        h[:a] = np.linspace(0, 1, a)
    if b:
        h[n - b:] = np.linspace(1, 0, b)
    return h


def schreiben(name, klang, hoehe=0.8):
    sp = float(np.max(np.abs(klang))) or 1.0
    klang = klang / sp * hoehe
    roh = b"".join(struct.pack("<h", int(max(-32000, min(32000, w * 32000))))
                   for w in klang)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        "-af", "alimiter=limit=0.92:level=disabled",
                        "-ac", "2", "-c:a", "libopus", "-b:a", "64k",
                        os.path.join(AUS, name + ".opus")], input=roh)
    if p.returncode:
        sys.exit("opus fehlgeschlagen: " + name)
    p = subprocess.run([FF, "-y", "-v", "error",
                        "-i", os.path.join(AUS, name + ".opus"),
                        "-c:a", "aac", "-b:a", "80k",
                        os.path.join(AUS, name + ".m4a")])
    if p.returncode:
        sys.exit("m4a fehlgeschlagen: " + name)
    for e in ("opus", "m4a"):
        d = os.path.join(AUS, name + "." + e)
        print("  %s.%s  %d Bytes" % (name, e, os.path.getsize(d)))


def muenze():
    """H5, dann E6 — und der zweite Ton klingt aus."""
    kurz, lang = 0.075, 0.525
    a = rechteck(987.77, kurz, 0.5)
    b = rechteck(1318.51, lang, 0.5)
    a *= huelle(len(a), 0.002, 0.004)
    # Der zweite Ton faellt gleichmaessig ab — wie eine angeschlagene
    # Saite, nicht wie ein abgeschnittenes Band.
    t = np.arange(len(b)) / RATE
    b *= np.exp(-t * 4.4) * huelle(len(b), 0.002, 0.10)
    klang = np.concatenate([a, b]) * 0.5
    print("Muenze: H5 %d ms, dann E6 %d ms" % (kurz * 1000, lang * 1000))
    schreiben("mariomuenze", klang, 0.82)
    return (kurz + lang)


def pilz():
    """Vier Schuebe einer Tonleiter, jeder hoeher als der vorige."""
    # Halbtonschritte ueber einem Grundton; die vier Schuebe setzen
    # jeweils drei Halbtoene hoeher an.
    grund = 392.0            # G4
    schritt = 0.0405         # Laenge eines Tons
    stufen = [0, 4, 7, 12, 16]
    stuecke = []
    gezaehlt = 0
    for schub in range(4):
        for s in stufen:
            hz = grund * (2 ** ((schub * 3 + s) / 12.0))
            ton = rechteck(hz, schritt, 0.25)
            ton *= huelle(len(ton), 0.002, 0.006)
            stuecke.append(ton)
            gezaehlt += 1
    klang = np.concatenate(stuecke)
    # Ganz am Ende sanft ausblenden, damit nichts abreisst.
    klang *= huelle(len(klang), 0.002, 0.05)
    print("Pilz: %d Toene von %d bis %d Hz" % (
        gezaehlt, grund, grund * (2 ** ((3 * 3 + 16) / 12.0))))
    schreiben("mariopilz", klang * 0.42, 0.72)
    return len(klang) / RATE


def main():
    d1 = muenze()
    d2 = pilz()
    print("Dauern: mariomuenze %.2f s, mariopilz %.2f s" % (d1, d2))


main()
