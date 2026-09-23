#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DER KLATSCHER AUF DEN PO
---------------------------------------------------------------------
XANDER (Walkie-Talkie, 23.09.2026): „der Sound soll schlagend sein,
und das klingt jetzt komisch wie eine Snare — ich glaube, das klang
vorher besser."

GEMESSEN, bevor etwas geaendert wurde (werkzeug: numpy ueber die
entpackten Dateien):
    klatsch   2,00 s, Spitze nach 6 ms, Schwerpunkt 2053 Hz,
              26 % der Energie kommt NACH den ersten 150 ms
    ohrfeige  1,76 s, Spitze nach 73 ms, Schwerpunkt 2285 Hz,
               0 % nach 150 ms
Der „klatsch" hat einen langen, rauschenden Nachhall — genau das ist
der Snare-Teppich, den er hoert. Eine Hand auf Haut klingt trocken:
ein kurzer, satter Schlag und sofort Stille.

Deshalb wird der Po-Klatscher aus der OHRFEIGE gebaut (ein echter
Schlag auf Haut, schon im Haus):
  · 18 % tiefer gestimmt — der Po ist eine groessere, weichere Flaeche
    als eine Wange, er klingt voller und dumpfer,
  · oberhalb von 5 kHz abgesenkt (kein Zischen),
  · nach 380 ms ist Schluss (kurzes Ausblenden) — kein Nachhall,
  · Spitze bei -3 dBFS.
Ausgabe: ton/popoklatsch.opus und ton/popoklatsch.m4a, mono.

RUNDE 100 — ERSETZT DURCH EINEN ECHTEN KLATSCHER (ElevenLabs)
XANDER (Walkie-Talkie): „auf jeden Fall das Klatschgeraeusch
verbessern" — und den alten Schmerzlaut dabei lassen.
Vier Vorschlaege erzeugt (eleven_text_to_sound_v2, 0,8 s, „single firm
open-palm spank … meaty fleshy smack … very dry, no snare"), gemessen:
    a  1 Einschlag bei 50 ms, 30 ms laut, kein Nachhall   <- genommen
    b  verschmiert (90 ms laut, steigt vorher an)
    c  nur 20 ms, duenn
    d  zwei Einschlaege (10 und 60 ms) — klingt doppelt
Der Anfang wird um 35 ms gekuerzt, damit der Schlag auf den Aufprall
der Hand faellt (LC_TREFFER klaps: 600 ms). Rohdatei und die bisherige
Fassung liegen in .sicherung/ton-vor-r100/. Dieses Skript baut die
ALTE Fassung aus der Ohrfeige und wird nicht mehr aufgerufen.
=====================================================================
"""
import subprocess, os

FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg"
TON = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ton")
QUELLE = os.path.join(TON, "ohrfeige.opus")

# asetrate senkt Tonhoehe UND Tempo (wie ein langsamer abgespieltes
# Band) — bei einem Schlag ist genau das richtig: tiefer und etwas
# breiter. aresample bringt es danach wieder auf 48 kHz.
FILTER = ("aresample=48000,asetrate=48000*0.82,aresample=48000,"
          "lowpass=f=5000,atrim=0:0.42,afade=t=out:st=0.30:d=0.12,"
          "loudnorm=I=-14:TP=-3:LRA=7")
for endung, codec in (("opus", ["-c:a", "libopus", "-b:a", "48k"]),
                      ("m4a", ["-c:a", "aac", "-b:a", "96k"])):
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", QUELLE, "-ac", "1",
                    "-af", FILTER] + codec + [os.path.join(TON, "popoklatsch." + endung)],
                   check=True)
print("popoklatsch gebaut")
