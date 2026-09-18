# -*- coding: utf-8 -*-
"""HAELT JEDES WOERTERBUCHWORT GEGEN EINE BESTEHENDE DEUTSCHE DATENBANK.

GEWUENSCHT: „Ich entdecke immer noch echt komische Woerter in den
Uebungen oder im Woerterbuch. Schau bitte nach, was da alles Muell
ist. Ueberpruefe das stichhaltig und gleiche das bitte einfach mit dem
Duden ab. Keine Halluzinationen mehr, das ist ganz wichtig."

WAS HIER GEPRUEFT WIRD — und was NICHT.
Der Duden hat keine offene Schnittstelle, die man abfragen darf.
Geprueft wird deshalb gegen igerman98, die freie deutsche
Rechtschreibdatenbank, aus der auch die Rechtschreibpruefung in
LibreOffice und Firefox gespeist wird: 75 873 Eintraege mit
Beugungsregeln. Das ist eine ECHTE Datenbank, keine Vermutung von mir.

DREI STUFEN, in dieser Reihenfolge:
  1. steht das Wort (mit seinen Beugungsformen) in der Datenbank?
  2. sonst: zerfaellt es in Woerter, die dort stehen? Deutsch setzt
     zusammen — „Kuehlschranktuer" steht in keinem Woerterbuch der
     Welt und ist trotzdem ein Wort.
  3. sonst: es kommt auf die Liste ZUM ANSEHEN. Diese Liste ist
     ausdruecklich KEINE Muellliste. Sie ist das, was ein Mensch
     nachsehen muss.

ERSTER ANLAUF, und warum er falsch war: ich hatte nur die Grundformen
aus der .dic-Datei gelesen, ohne die Beugungsregeln der .aff-Datei.
Damit galten „die Schuhe", „die Socken", „Fussboden", „Vorhang",
„Heizung" und „Fernbedienung" als unbekannt — 12 555 angebliche
Fehler, fast alle davon gute Woerter. Haette ich das gemeldet, waere
es genau das gewesen, was nicht passieren soll.

Aufruf:  python3 werkzeug/woerterbuch-pruefen.py
"""
import io, re, json, subprocess, sys, os
from spylls.hunspell import Dictionary

BASIS = "/tmp/claude-0/hs/de_DE"
d = Dictionary.from_files(BASIS)

_merk = {}
def kennt(w):
    if w in _merk: return _merk[w]
    try: r = bool(d.lookup(w))
    except Exception: r = False
    _merk[w] = r
    return r

FUGEN = ("", "s", "n", "en", "es", "er", "e")
def zusammengesetzt(w, tiefe=0):
    if kennt(w) or kennt(w.capitalize()): return True
    if tiefe >= 2 or len(w) < 8: return False
    for i in range(4, len(w) - 3):
        a, b = w[:i], w[i:]
        for f in FUGEN:
            if f and not a.endswith(f): continue
            kern = a[:len(a) - len(f)] if f else a
            if len(kern) < 3: continue
            if kennt(kern.capitalize()) or kennt(kern):
                if zusammengesetzt(b.capitalize(), tiefe + 1) or zusammengesetzt(b, tiefe + 1):
                    return True
    return False

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
js = r'''
const fs=require("fs");global.window={};
for (const f of fs.readdirSync("vokabeln")) if (f.endsWith(".js")) { try{eval(fs.readFileSync("vokabeln/"+f,"utf8"));}catch(e){} }
const raus=[];
const sammeln=(o)=>{for(const k of Object.keys(o||{})){const v=o[k];
  if(Array.isArray(v)&&v.length&&v[0]&&v[0].word) v.forEach(e=>raus.push({w:e.word,de:e.de||e.meaning||"",lvl:e.level||"",thema:e.theme||"",syl:e.syl||""}));}};
sammeln(window.DMA_VOKABELN); sammeln(window.DMA_VOKABELN_ZUSATZ);
process.stdout.write(JSON.stringify(raus));
'''
io.open("/tmp/claude-0/dump.js", "w").write(js)
daten = json.loads(subprocess.check_output(["node", "/tmp/claude-0/dump.js"], cwd=WURZEL).decode())

def kern(w):
    return re.sub(r"^(der|die|das)\s+", "", str(w).strip(), flags=re.I).strip()

bekannt, zusammen, offen = [], [], []
for i, e in enumerate(daten):
    w = kern(e["w"])
    if not w: continue
    if " " in w:                      # Wendungen wie „zu Mittag essen"
        teile = [t for t in w.split() if t]
        if all(kennt(t) or kennt(t.capitalize()) or zusammengesetzt(t) for t in teile):
            bekannt.append(e); continue
        offen.append(e); continue
    if kennt(w): bekannt.append(e)
    elif zusammengesetzt(w): zusammen.append(e)
    else: offen.append(e)
    if i % 2000 == 0:
        print("  …", i, "von", len(daten), flush=True)

print()
print("Woerterbuch:", len(daten), "Eintraege")
print("  in der Datenbank        :", len(bekannt))
print("  als Zusammensetzung     :", len(zusammen))
print("  ZUM ANSEHEN             :", len(offen))
io.open("/tmp/claude-0/offen.json", "w", encoding="utf-8").write(
    json.dumps(offen, ensure_ascii=False))
print("\nDie Liste steht in /tmp/claude-0/offen.json")
