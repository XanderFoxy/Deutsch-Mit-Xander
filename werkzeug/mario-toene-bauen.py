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


def stampf():
    """DER SPRUNG AUF DEN GEGNER.

    XANDER (23.09.2026): „Beim Ueberspringen der Personen im Mario-Modus
    moechte ich, dass die typischen Geraeusche kommen — denn Mario
    bespringt diese Personen entweder von oben oder kickt sie weg,
    genauso wie mit den Muenzen. Da hast du ja auch einen typischen
    Sound."

    Bisher lag dort „bonk" — ein Holzklopfen. Das ist ein Geraeusch,
    kein Signal. Der Tritt von oben klingt in einem Achtziger-Spiel
    anders: ein kurzer, TIEF FALLENDER Rechteckton (von 300 auf 90 Hz
    in 90 ms), darunter ein Rauschstoss von 40 ms fuer den Aufprall.
    Das Fallen ist das Entscheidende — es ist der Klang von „etwas
    wird flachgedrueckt".
    """
    n = int(RATE * 0.26)
    t = np.arange(n) / RATE
    # Der fallende Ton: die Frequenz sinkt exponentiell.
    hz = 300.0 * np.power(90.0 / 300.0, np.clip(t / 0.09, 0, 1))
    phase = np.cumsum(hz) / RATE
    ton = np.where((phase % 1.0) < 0.25, 1.0, -1.0)
    ton *= np.exp(-t * 14.0)
    # Der Aufprall: kurzes Rauschen, gleich wieder weg.
    rausch = np.zeros(n)
    m = int(RATE * 0.04)
    schritt = np.random.RandomState(7).uniform(-1, 1, m)
    rausch[:m] = schritt * np.linspace(1, 0, m) ** 2
    klang = (ton * 0.75 + rausch * 0.5) * huelle(n, 0.002, 0.08)
    schreiben("mariostampf", klang, 0.8)
    return len(klang) / RATE


def kick():
    """DAS WEGKICKEN.

    Anders als der Stampfer geht der Kick nach OBEN: der Gegner fliegt
    davon. Ein kurzer Anschlag, dann ein Rechteckton, der in 220 ms von
    180 auf 900 Hz STEIGT — der Klang von „weg damit". Dazu ein
    Zischen, das mit ihm nach oben zieht.
    """
    n = int(RATE * 0.34)
    t = np.arange(n) / RATE
    hz = 180.0 * np.power(900.0 / 180.0, np.clip(t / 0.22, 0, 1))
    phase = np.cumsum(hz) / RATE
    ton = np.where((phase % 1.0) < 0.5, 1.0, -1.0) * np.exp(-t * 6.0)
    zisch = np.random.RandomState(13).uniform(-1, 1, n) * np.exp(-t * 9.0) * 0.35
    anschlag = np.zeros(n)
    m = int(RATE * 0.02)
    anschlag[:m] = np.random.RandomState(3).uniform(-1, 1, m) * np.linspace(1, 0, m)
    klang = (ton * 0.7 + zisch + anschlag * 0.6) * huelle(n, 0.002, 0.1)
    schreiben("mariokick", klang, 0.78)
    return len(klang) / RATE


def geheim():
    """DAS GEHEIME FELD.

    XANDER (23.09.2026): „manchmal kann er auch ein Geheimnis Feld
    freischalten, wenn er irgendwie unterwegs ist und ueber ihm ist
    vielleicht irgendwas, dass er dann dran springt und das geheime
    Feld freischaltet und vielleicht ein Power-up kriegt."

    Ein Fund klingt nicht wie eine Muenze. Er klingt wie ein kleiner
    Dreiklang, der nach oben aufgeht und stehen bleibt: C6, E6, G6,
    dann C7 lang. Vier Rechtecktoene, der letzte klingt aus — das ist
    im Ohr das Zeichen fuer „da war noch etwas versteckt".
    """
    stufen = [(1046.50, 0.07), (1318.51, 0.07), (1567.98, 0.07), (2093.00, 0.42)]
    stuecke = []
    for hz, d in stufen:
        ton = rechteck(hz, d, 0.5)
        t = np.arange(len(ton)) / RATE
        if d > 0.2:
            ton *= np.exp(-t * 5.0)
        ton *= huelle(len(ton), 0.002, 0.008 if d < 0.2 else 0.10)
        stuecke.append(ton)
    klang = np.concatenate(stuecke) * 0.5
    print("Geheimfeld: C6-E6-G6-C7, %.2f s" % (len(klang) / RATE))
    schreiben("mariogeheim", klang, 0.8)
    return len(klang) / RATE


def feuer():
    """DER FEUERBALL AUS DER FEUERBLUME.

    XANDER: „vielleicht koennte er dann 'ne Feuerblume haben und dann
    noch mal die Leute anbrennen."

    Ein Feuerball ist kurz und heiss: ein Rechteckton, der in 130 ms
    von 1200 auf 260 Hz FAELLT (er fliegt weg), darueber ein
    gefiltertes Rauschen, das wie ein Zischen anschwillt und sofort
    wieder verglueht.
    """
    n = int(RATE * 0.30)
    t = np.arange(n) / RATE
    hz = 1200.0 * np.power(260.0 / 1200.0, np.clip(t / 0.13, 0, 1))
    phase = np.cumsum(hz) / RATE
    ton = np.where((phase % 1.0) < 0.35, 1.0, -1.0) * np.exp(-t * 9.0)
    # Das Zischen: Rauschen, das erst anschwillt und dann verglueht.
    r = np.random.RandomState(29).uniform(-1, 1, n)
    # Einfache Glaettung = weniger Hoehen, mehr „Flamme" statt „Sand".
    r = np.convolve(r, np.ones(5) / 5.0, mode="same")
    zisch = r * np.minimum(t / 0.03, 1.0) * np.exp(-t * 7.5) * 0.55
    klang = (ton * 0.62 + zisch) * huelle(n, 0.002, 0.09)
    schreiben("mariofeuer", klang, 0.78)
    return len(klang) / RATE


def main():
    d1 = muenze()
    d2 = pilz()
    d3 = stampf()
    d4 = kick()
    d5 = geheim()
    d6 = feuer()
    print("Dauern: mariomuenze %.2f s, mariopilz %.2f s, "
          "mariostampf %.2f s, mariokick %.2f s, mariogeheim %.2f s, "
          "mariofeuer %.2f s" % (d1, d2, d3, d4, d5, d6))


main()
