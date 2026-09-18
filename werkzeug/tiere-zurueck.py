# -*- coding: utf-8 -*-
"""NIMMT MEINE NEUZEICHNUNGEN VON TIEREN ZURUECK.

GEMELDET: „Ich moechte, dass du zu dem alten Tyrannosaurus Rex
zurueckkehrst, den wir gemacht hatten — also den ich hatte, als ich
noch nicht mit dir in Code gearbeitet habe. Da war der Tyrannosaurus
Rex noch richtig schoen mit Texturen. Du hast den verschlimmbessert,
und falls du andere Tiere ebenso behandelt hast, dann nimm diese
Sachen auch zurueck."

Zwei Tiere habe ich damals neu gezeichnet, beide mit Sicherung:
  Tyrannosaurus  (Commit „Der Tyrannosaurus, neu gezeichnet")
                 sicherung/2026-09-17-tyrannosaurus/dinosaurier.js
  Hund + Welpe   (Commit „Der Hund und der Welpe, neu gezeichnet")
                 sicherung/2026-09-17-hund/{haustiere,bauernhof}.js

Zurueckgeholt wird NUR die Zeichnung („kunst") der betroffenen Tiere.
Alles, was seither an denselben Dateien richtig geworden ist — der
neue Himmel in 23 Bilderwelten zum Beispiel —, bleibt stehen. Ein
schlichtes Zurueckkopieren der ganzen Datei wuerde das mitreissen.

Aufruf:  python3 werkzeug/tiere-zurueck.py
"""
import io, os, re, json, datetime, shutil

W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEUTE = datetime.datetime.now().strftime("%Y-%m-%d")
ZURUECK = [
    ("sicherung/2026-09-17-tyrannosaurus/dinosaurier.js", "szenen/dinosaurier.js",
     ["tyrannosaurus"]),
    ("sicherung/2026-09-17-hund/haustiere.js", "szenen/haustiere.js", ["hund", "welpe"]),
    ("sicherung/2026-09-17-hund/bauernhof.js", "szenen/bauernhof.js", ["hund", "welpe"]),
]

def laden(pfad):
    t = io.open(pfad, encoding="utf-8").read()
    i = t.index('{"id"'); j = t.rindex('};')
    return t[:i], json.loads(t[i:j + 1]), t[j + 1:]

sicher = os.path.join(W, "sicherung", HEUTE + "-tiere-zurueck")
os.makedirs(sicher, exist_ok=True)

for alt_rel, neu_rel, tiere in ZURUECK:
    alt_pfad = os.path.join(W, alt_rel)
    neu_pfad = os.path.join(W, neu_rel)
    if not os.path.exists(alt_pfad):
        print("  Sicherung fehlt:", alt_rel); continue
    _, alt, _ = laden(alt_pfad)
    kopf, neu, schwanz = laden(neu_pfad)
    altTeile = {t["id"]: t for t in alt.get("teile", [])}
    getauscht = []
    for teil in neu.get("teile", []):
        if teil["id"] in tiere and teil["id"] in altTeile:
            frueher = altTeile[teil["id"]]
            if teil.get("kunst") != frueher.get("kunst"):
                teil["kunst"] = frueher.get("kunst", "")
                getauscht.append(teil["id"] + " ("
                    + str(len(teil["kunst"]) // 1024) + " KB)")
    if getauscht:
        shutil.copy(neu_pfad, os.path.join(sicher, os.path.basename(neu_pfad)))
        io.open(neu_pfad, "w", encoding="utf-8").write(
            kopf + json.dumps(neu, ensure_ascii=False, separators=(",", ":")) + schwanz)
        print("  " + os.path.basename(neu_pfad) + ": " + ", ".join(getauscht))
    else:
        print("  " + os.path.basename(neu_pfad) + ": nichts zu tun")
print("Sicherung des Vorzustands in", sicher)
