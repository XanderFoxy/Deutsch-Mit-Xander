# -*- coding: utf-8 -*-
"""ENTFERNT NUR, WAS BEWEISBAR DOPPELT IST.

Von 367 doppelten Stichwoertern sind 353 HOMONYME oder
Artikelvarianten — „der Schild" (Schutzwaffe) und „das Schild"
(Tafel), „der Rasen" und „rasen". Die gehoeren beide hinein.
Entfernt wird nur, was wirklich zweimal dasselbe ist: gleiches
Stichwort UND gleiche Bedeutung. Das sind 14 Eintraege.

Vorher wird jede angefasste Datei gesichert.
"""
import io, os, re, json, subprocess, collections, datetime, shutil

W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
alle = json.loads(subprocess.check_output(["node", "/tmp/claude-0/dump.js"], cwd=W).decode())
def kern(w): return re.sub(r"^(der|die|das)\s+", "", str(w).strip(), flags=re.I).strip()

nach = collections.defaultdict(list)
for e in alle: nach[kern(e["w"]).lower()].append(e)
weg = []
for w, liste in nach.items():
    if len(liste) < 2: continue
    if len({str(e["de"]).strip().lower() for e in liste}) == 1 \
       and len({str(e["w"]).strip() for e in liste}) == 1:
        weg.append((liste[0]["w"], liste[0]["de"]))
print(len(weg), "beweisbare Doppelungen")

sicher = os.path.join(W, "sicherung",
    datetime.datetime.now().strftime("%Y-%m-%d") + "-doppelte", "vokabeln")
os.makedirs(sicher, exist_ok=True)
entfernt = 0
schon = set()
for datei in sorted(os.listdir(os.path.join(W, "vokabeln"))):
    if not datei.endswith(".js"): continue
    pfad = os.path.join(W, "vokabeln", datei)
    text = io.open(pfad, encoding="utf-8").read()
    neu = text
    for wort, bed in weg:
        muster = re.compile(
            r'\{[^{}]*?"word"\s*:\s*' + re.escape(json.dumps(wort, ensure_ascii=False))
            + r'[^{}]*?\}\s*,?')
        for t in reversed(list(muster.finditer(neu))):
            # Der ERSTE Fund ueberhaupt bleibt stehen, auch wenn er in
            # einer anderen Datei liegt. Deshalb zaehlt "schon" ueber
            # alle Dateien hinweg, nicht je Datei.
            schluessel = wort
            if schluessel not in schon:
                schon.add(schluessel)
                continue
            neu = neu[:t.start()] + neu[t.end():]
            entfernt += 1
    if neu != text:
        shutil.copy(pfad, os.path.join(sicher, datei))
        io.open(pfad, "w", encoding="utf-8").write(neu)
        print("  ", datei, "angepasst")
print(entfernt, "Eintraege entfernt — Sicherung in", sicher)
