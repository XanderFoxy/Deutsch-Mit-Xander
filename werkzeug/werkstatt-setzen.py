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

GEWÜNSCHT, zweiter Teil: „Du sollst mir zeigen, an was du gerade
arbeitest, dass du einzelne Sachen schon hochlädst und dass ich sehe,
welche Sachen gerade fertig sind — Schritt für Schritt, damit ich es
direkt überprüfen kann."

Deshalb schreibt dieses Werkzeug ZWEI Listen: was offen ist und was
seit dem letzten Hochladen fertig wurde. Beides mit Uhrzeit.

AUFRUF
    python3 werkzeug/werkstatt-setzen.py \
        --stand "Runde 18 — Animationen" \
        --offen "erste Baustelle" "zweite Baustelle" \
        --fertig "was schon oben ist" "und das auch"
    python3 werkzeug/werkstatt-setzen.py --aus        (beide Listen leeren)

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

   5. ZWEI LISTEN: OFFEN UND FERTIG.
      „Dass ich sehe, welche Sachen gerade fertig sind, Schritt für
      Schritt, damit ich es direkt überprüfen kann." Unter „fertig"
      steht deshalb, was mit dem letzten Hochladen oben angekommen
      ist — mit Uhrzeit, damit man weiss, was man sich ansehen kann.
   ========================================================= */
window.DMA_WERKSTATT = {
  /* true = nur der Betreiber sieht die Blase. Ausdrücklich so
     gewünscht: „sie soll für normale Benutzer gar nicht sichtbar
     sein, nur für mich als Betreiber." */
  nurBetreiber: true,
%s
  inArbeit: [
'''

MITTE = '''  ],

  /* Was mit dem letzten Hochladen fertig geworden ist. */
  fertig: [
'''

FUSS = '''  ],
};
'''


def zeilen_bauen(zeilen, jetzt):
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
    return teile


def schreiben(offen, fertig, stand=""):
    jetzt = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M")
    a = zeilen_bauen(offen, jetzt)
    b = zeilen_bauen(fertig, jetzt)
    kopfzeile = ('\n  /* Woran gerade gearbeitet wird — eine Zeile Klartext. */\n'
                 '  stand: %s,\n' % json.dumps(stand, ensure_ascii=False)) if stand else ""
    with io.open(ZIEL, "w", encoding="utf-8") as f:
        f.write((KOPF % kopfzeile) + "".join(a) + MITTE + "".join(b) + FUSS)
    return len(a), len(b)


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return 1
    if args[0] == "--aus":
        a, b = schreiben([], [])
    else:
        offen, fertig, stand, topf = [], [], "", None
        i = 0
        while i < len(args):
            if args[i] == "--offen":
                topf = offen
            elif args[i] == "--fertig":
                topf = fertig
            elif args[i] == "--stand":
                i += 1
                stand = args[i] if i < len(args) else ""
            elif topf is not None:
                topf.append(args[i])
            else:
                offen.append(args[i])       # ohne Schalter: alles offen
            i += 1
        a, b = schreiben(offen, fertig, stand)
    print("Werkstatt neu geschrieben: %d offen, %d fertig — in %s"
          % (a, b, os.path.relpath(ZIEL, WURZEL)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
