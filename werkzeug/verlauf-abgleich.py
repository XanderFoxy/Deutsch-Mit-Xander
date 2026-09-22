#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DER ABGLEICH: WELCHER SATZ VON IHM WIRD VON EINER SONDE GEMESSEN?
---------------------------------------------------------------------
XANDER: „Du sollst echt in diesem Chat-Verlauf gucken und echte
Ergebnisse liefern, die wirklich hier sind, mit Beweisen, dass die von
hier sind." Und: „mache dir eine Liste, eine komplette Aufstellung von
den Sachen, die wirklich noch nie abgearbeitet worden."

WIE DAS GEHT, OHNE DASS ICH MIR ETWAS EINBILDE:
Jede Sonde traegt seine Saetze woertlich im Kopf. Dieses Werkzeug
zerlegt seinen Verlauf in Saetze, zerlegt alle Sondenkoepfe in Saetze
und vergleicht beide Mengen ueber Dreiergruppen von Buchstaben
(Trigramme). Ein Satz von ihm, der in keinem Sondenkopf ein Echo hat,
ist ein Kandidat fuer „noch nicht angefasst" — mehr behauptet dieses
Werkzeug nicht, und weniger auch nicht.

WARUM TRIGRAMME UND KEIN WORTVERGLEICH: er diktiert, das Programm
schreibt mit. „Kopfhoerer" wird zu „Kopf Hoerer", „Pac-Man" zu
„Pacman". Ueber Dreiergruppen faellt das kaum ins Gewicht.

AUFRUF
    python3 werkzeug/verlauf-abgleich.py <verlauf.json> [--ab 240] [--grenze 0.34]

Die Verlaufsdatei ist eine Liste aus {"zeit": ..., "text": ...} und
gehoert NICHT ins Repository — sie ist sein privater Chat.
=====================================================================
"""
import sys, os, json, re, unicodedata

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def platt(s):
    """Kleinschreibung, Umlaute aufgeloest, nur Buchstaben und Zahlen."""
    s = s.lower()
    s = (s.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue")
          .replace("ß", "ss"))
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return " ".join(s.split())

def tri(s):
    s = platt(s)
    return set(s[i:i + 3] for i in range(max(0, len(s) - 2)))

def saetze(text):
    roh = re.split(r"(?<=[.!?])\s+|\n+", text)
    return [t.strip() for t in roh if len(t.strip()) >= 40]

def aehnlich(a, b):
    if not a or not b:
        return 0.0
    return len(a & b) / float(min(len(a), len(b)))

def stichwortkarte(koepfe):
    """Ein kleiner Suchindex: Trigramm -> welche Sondensaetze es enthalten.

    Ohne ihn vergleicht jeder seiner Saetze gegen JEDEN Sondensatz —
    bei 2500 Sondensaetzen und Tausenden von Saetzen im Verlauf laeuft
    das minutenlang. Mit ihm werden nur die Saetze angefasst, die
    ueberhaupt ein Trigramm gemeinsam haben.
    """
    karte = {}
    for nr, (_name, _satz, tt) in enumerate(koepfe):
        for g in tt:
            karte.setdefault(g, []).append(nr)
    return karte


def bester_treffer(t, koepfe, karte):
    zaehler = {}
    for g in t:
        for nr in karte.get(g, ()):  # nur die, die etwas gemeinsam haben
            zaehler[nr] = zaehler.get(nr, 0) + 1
    beste, wer = 0.0, ""
    for nr, gemeinsam in zaehler.items():
        tt = koepfe[nr][2]
        w = gemeinsam / float(min(len(t), len(tt)) or 1)
        if w > beste:
            beste, wer = w, koepfe[nr][0]
    return beste, wer


def sondenkoepfe():
    """Alle Saetze aus den Koepfen aller Sonden — das ist das Gedaechtnis."""
    raus = []
    ordner = os.path.join(WURZEL, "werkzeug")
    for f in sorted(os.listdir(ordner)):
        if not (f.startswith("pruefe-") and f.endswith(".js")):
            continue
        with open(os.path.join(ordner, f), encoding="utf8") as fh:
            quelle = fh.read()
        ende = quelle.find("*/")
        kopf = quelle[:ende] if ende > 0 else quelle[:4000]
        for s in saetze(kopf):
            raus.append((f[:-3], s, tri(s)))
    return raus

def main():
    if len(sys.argv) < 2:
        print("Aufruf: python3 werkzeug/verlauf-abgleich.py <verlauf.json> [--ab N] [--grenze X]")
        return 2
    pfad = sys.argv[1]
    ab = 0
    grenze = 0.34
    for i, a in enumerate(sys.argv):
        if a == "--ab" and i + 1 < len(sys.argv):
            ab = int(sys.argv[i + 1])
        if a == "--grenze" and i + 1 < len(sys.argv):
            grenze = float(sys.argv[i + 1])
    with open(pfad, encoding="utf8") as fh:
        verlauf = json.load(fh)
    koepfe = sondenkoepfe()
    karte = stichwortkarte(koepfe)
    print("%d Sonden-Saetze im Gedaechtnis.\n" % len(koepfe))
    offen = 0
    gedeckt = 0
    for i, eintrag in enumerate(verlauf, start=1):
        if i < ab:
            continue
        for satz in saetze(eintrag.get("text", "")):
            t = tri(satz)
            beste, wer = bester_treffer(t, koepfe, karte)
            if beste >= grenze:
                gedeckt += 1
                continue
            offen += 1
            print("[%03d] %s" % (i, eintrag.get("zeit", "")[:16]))
            print("      %s" % (" ".join(satz.split())[:400]))
            print("      naechste Sonde: %s (%.2f)\n" % (wer or "-", beste))
    print("%d Saetze mit Echo in einer Sonde, %d ohne." % (gedeckt, offen))
    return 0

if __name__ == "__main__":
    sys.exit(main())
