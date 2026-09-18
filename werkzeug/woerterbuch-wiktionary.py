# -*- coding: utf-8 -*-
"""ZWEITE MEINUNG: das deutsche Wiktionary.

Die Rechtschreibdatenbank igerman98 kennt 75 873 Eintraege — viel,
aber nicht alles. „umtopfen", „entkalken", „puerieren", „graetschen"
und „striegeln" stehen dort nicht und sind trotzdem tadelloses
Deutsch. Wer sie auf dieser Grundlage streicht, zerstoert guten
Wortschatz.

Deshalb wird jedes Wort, das die erste Pruefung nicht kannte, hier
ein zweites Mal nachgeschlagen — im deutschen Wiktionary, ueber die
offizielle Schnittstelle, 50 Woerter je Anfrage. Steht es dort, ist
es belegt. Steht es dort AUCH nicht, kommt es auf die Liste, die ein
Mensch ansehen muss — und erst dort wird entschieden.

Aufruf:  python3 werkzeug/woerterbuch-wiktionary.py
"""
import json, io, re, time, urllib.parse, urllib.request

offen = json.load(io.open("/tmp/claude-0/offen.json", encoding="utf-8"))
def kern(w): return re.sub(r"^(der|die|das)\s+", "", str(w).strip(), flags=re.I).strip()

woerter = []
gesehen = set()
for e in offen:
    w = kern(e["w"])
    if w and w not in gesehen:
        gesehen.add(w); woerter.append(w)
print(len(woerter), "verschiedene Woerter nachzuschlagen")

belegt, unbekannt = set(), []
KOPF = {"User-Agent": "deutsch-mit-alex-woerterbuchpruefung/1.0 (Lernseite)"}
for i in range(0, len(woerter), 50):
    teil = woerter[i:i + 50]
    url = ("https://de.wiktionary.org/w/api.php?action=query&format=json&redirects=1&titles="
           + urllib.parse.quote("|".join(teil)))
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=KOPF), timeout=30) as a:
            d = json.load(a)
    except Exception as fehler:
        print("  Anfrage fehlgeschlagen:", fehler); time.sleep(2); continue
    seiten = (d.get("query") or {}).get("pages") or {}
    da = set()
    for s in seiten.values():
        if "missing" not in s: da.add(s.get("title", ""))
    for norm in (d.get("query") or {}).get("normalized", []) or []:
        if norm.get("to") in da: da.add(norm.get("from"))
    for r in (d.get("query") or {}).get("redirects", []) or []:
        if r.get("to") in da: da.add(r.get("from"))
    for w in teil:
        if w in da: belegt.add(w)
    if i % 500 == 0: print("  …", i, "von", len(woerter), "—", len(belegt), "belegt", flush=True)
    time.sleep(0.12)

unbekannt = [w for w in woerter if w not in belegt]
print()
print("  im Wiktionary belegt :", len(belegt))
print("  auch dort unbekannt  :", len(unbekannt))
io.open("/tmp/claude-0/unbekannt.json", "w", encoding="utf-8").write(
    json.dumps(unbekannt, ensure_ascii=False))
print("\nDie Liste steht in /tmp/claude-0/unbekannt.json")
