# -*- coding: utf-8 -*-
"""HOLT EIN EINZELNES SZENENTEIL AUS EINER FRUEHEREN FASSUNG ZURUECK.

GEMELDET: „Falls das der Dinosaurier sein soll, der da ist, dann ist
das nicht der originale … der hatte naemlich Schuppen. Die Version vor
diesem Dinosaurier, das war die originale."

Nachgesehen: der Tyrannosaurus hat in der Geschichte fuenf Fassungen.
Die vom 14.09. (90 kB, 189 Ellipsen) hat die Schuppenreihen an der
Flanke, den grossen Kopf mit offenem Rachen, den muskuloesen
Oberschenkel und den dreizehigen Fuss mit Krallen. Die vom 15.09.,
die heute drinsteht, hat das alles nicht mehr.

Warum ein Werkzeug und kein Handgriff: die Szenendateien sind
maschinengeschrieben und enthalten ein einziges grosses JSON. Von Hand
darin herumzuschneiden ist genau die Art Eingriff, bei der man
versehentlich ein zweites Teil mitnimmt. Hier wird GENAU EIN Teil
ersetzt, alles andere bleibt Zeichen fuer Zeichen stehen — und vorher
wird gesichert.

Aufruf:
    python3 werkzeug/teil-zurueckholen.py <szene.js> <teil> <commit>
    python3 werkzeug/teil-zurueckholen.py dinosaurier.js tyrannosaurus c672846
"""
import json, os, sys, shutil, subprocess, datetime

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def kunst_aus(commit, datei, teil):
    """Das Kunststueck aus einer alten Fassung holen — ueber node,
       weil die Szenendateien JavaScript sind und kein reines JSON."""
    roh = subprocess.run(["git", "show", "%s:szenen/%s" % (commit, datei)],
                         cwd=WURZEL, capture_output=True, text=True, check=True).stdout
    """Ueber eine Datei statt ueber -e: eine Szene ist schnell ein
       halbes Megabyte, und die Kommandozeile hat eine Grenze
       („Argument list too long"). Das Ausgeben in eine Datei hat
       sie nicht."""
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        q = os.path.join(tmp, "szene.js")
        open(q, "w", encoding="utf-8").write(roh)
        lauf = os.path.join(tmp, "lauf.js")
        open(lauf, "w", encoding="utf-8").write(
            "global.window={};\n"
            "eval(require('fs').readFileSync(%s,'utf8'));\n"
            "const s=window.DMA_SZENE[Object.keys(window.DMA_SZENE)[0]];\n"
            "const t=s.teile.find(q=>q.id===%s);\n"
            "if(!t){console.error('Teil fehlt');process.exit(1);}\n"
            "require('fs').writeFileSync(%s, JSON.stringify({kunst:t.kunst,x:t.x,y:t.y}));\n"
            % (json.dumps(q), json.dumps(teil), json.dumps(os.path.join(tmp, "raus.json"))))
        subprocess.run(["node", lauf], check=True)
        return json.load(open(os.path.join(tmp, "raus.json"), encoding="utf-8"))

def setzen(datei, teil, neu):
    pfad = os.path.join(WURZEL, "szenen", datei)
    txt = open(pfad, encoding="utf-8").read()
    i = txt.index('{"id"')
    j = txt.rindex("}")
    d = json.loads(txt[i:j+1])
    for t in d["teile"]:
        if t["id"] == teil:
            vorher = len(t["kunst"])
            t["kunst"] = neu["kunst"]
            break
    else:
        raise SystemExit("Teil %s steht nicht in %s" % (teil, datei))
    ordner = os.path.join(WURZEL, "sicherung",
                          datetime.datetime.now().strftime("%Y-%m-%d") + "-" + teil)
    os.makedirs(ordner, exist_ok=True)
    if not os.path.exists(os.path.join(ordner, datei)):
        shutil.copy2(pfad, ordner)
    open(pfad, "w", encoding="utf-8").write(
        txt[:i] + json.dumps(d, ensure_ascii=False, separators=(",", ":")) + txt[j+1:])
    print("%s in %s ersetzt: %d -> %d Zeichen (gesichert in sicherung/)"
          % (teil, datei, vorher, len(neu["kunst"])))

if __name__ == "__main__":
    if len(sys.argv) < 4:
        raise SystemExit(__doc__)
    datei, teil, commit = sys.argv[1], sys.argv[2], sys.argv[3]
    setzen(datei, teil, kunst_aus(commit, datei, teil))
