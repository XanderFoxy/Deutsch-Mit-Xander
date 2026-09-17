#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SCHREIBT DIE WERKSTATT NEU — bei jedem Hochladen.

GEMELDET: „Die Werkstatt zeigt mir überhaupt nicht, woran du gerade
arbeitest. Mit jedem einzelnen Ding, was du hochlädst, soll sich die
Werkstatt auch aktualisieren. Und sie soll für normale Benutzer gar
nicht sichtbar sein, nur für mich als Betreiber."

Der Grund, warum sie veraltete: data-werkstatt.js wurde von Hand
gepflegt und dabei vergessen. Von Hand gepflegte Listen veralten
immer — also wird sie jetzt geschrieben, nicht gepflegt.

AUFRUF
    python3 werkzeug/werkstatt-setzen.py "erste Baustelle" "zweite" ...
    python3 werkzeug/werkstatt-setzen.py --aus        (Liste leeren)
    python3 werkzeug/werkstatt-setzen.py --datei liste.txt

Eine Zeile, die mit „!" beginnt, geht nur den Betreiber an.
Der Zeitpunkt ist immer JETZT — das ist der Sinn der Sache: man soll
sehen, wie frisch die Baustelle ist.
"""
import sys, io, os, json, datetime

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZIEL = os.path.join(WURZEL, "data-werkstatt.js")

KOPF = '''/* =========================================================
   DIE WERKSTATT — woran GERADE gebaut wird
   ---------------------------------------------------------
   DIESE DATEI WIRD GESCHRIEBEN, NICHT GEPFLEGT.
   Sie entsteht bei jedem Hochladen neu aus
   werkzeug/werkstatt-setzen.py. Von Hand geänderte Zeilen sind
   beim nächsten Mal weg.

   GEWÜNSCHT, und zwar genau so:
   „Zeige in der Werkstatt, woran du jetzt zuletzt gearbeitet
    hast — nicht nur das Datum, sondern auch die Uhrzeit. Dabei
    sind alle Sachen, die erledigt sind, irrelevant. Alles was
    jetzt gerade geupdatet wird, ist relevant. Und wenn Updates
    nicht mehr in Arbeit sind, verschwindet das Zeichen auch
    wieder."
   „Mit jedem einzelnen Ding, was du hochlädst, soll sich die
    Werkstatt auch aktualisieren. Und sie soll für normale
    Benutzer gar nicht sichtbar sein, nur für mich als
    Betreiber."

   Daraus folgen vier harte Regeln, und die Datei kann gar nichts
   anderes:

   1. HIER STEHT NUR, WAS OFFEN IST.
      Es gibt keine Liste „fertig" mehr. Was fertig ist, ist
      fertig — es gehört in den Ticker oder nirgendwohin, aber
      nicht in eine Werkstatt.

   2. JEDE ZEILE TRÄGT TAG UND UHRZEIT.
      „seit" ist der Zeitpunkt, an dem die Arbeit begonnen hat.

   3. IST DIE LISTE LEER, IST DAS ZEICHEN WEG.
      Kein leerer Knopf, kein „zurzeit nichts".

   4. NUR DER BETREIBER SIEHT SIE.
      nurBetreiber steht fest auf true. Eine Baustellenliste geht
      niemanden etwas an, der die Seite benutzen will.
   ========================================================= */
window.DMA_WERKSTATT = {
  /* true = nur der Betreiber sieht die Blase. Ausdrücklich so
     gewünscht: „sie soll für normale Benutzer gar nicht sichtbar
     sein, nur für mich als Betreiber." */
  nurBetreiber: true,

  inArbeit: [
'''

FUSS = '''  ],
};
'''


def schreiben(zeilen):
    jetzt = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M")
    teile = []
    for roh in zeilen:
        text = roh.strip()
        if not text:
            continue
        nur = text.startswith("!")
        if nur:
            text = text[1:].strip()
        marke = ' nurBetreiber: true,' if nur else ''
        teile.append('    { seit: "%s",%s\n      text: %s },\n'
                     % (jetzt, marke, json.dumps(text, ensure_ascii=False)))
    with io.open(ZIEL, "w", encoding="utf-8") as f:
        f.write(KOPF + "".join(teile) + FUSS)
    return len(teile)


def main():
    args = sys.argv[1:]
    if args and args[0] == "--aus":
        n = schreiben([])
    elif args and args[0] == "--datei":
        with io.open(args[1], encoding="utf-8") as f:
            n = schreiben(f.read().splitlines())
    elif args:
        n = schreiben(args)
    else:
        print(__doc__)
        return 1
    print("Werkstatt neu geschrieben: %d Baustelle(n) in %s"
          % (n, os.path.relpath(ZIEL, WURZEL)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
