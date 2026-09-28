#!/usr/bin/env python3
"""
LEICHTE STADT — ZWERGBILDER für den kleinen Dorfrahmen des Spiels
---------------------------------------------------------------------
Die Maße: jedes Zwergbild zielt auf 7,5 Bildpunkte je Meter (kleine Häuser
40 %, Wahrzeichen mit gröberem _k bis 75 %).

XANDER: „die neue Map in der Miniaturansicht fast noch kleiner als unsere
alte … damit wir keinen Ladebalken haben, wenn wir zur neuen Version
gehen, damit es sofort auch da ist … wie Steve Jobs zu denken, das
Unmögliche möglich zu machen, und dass es trotzdem gut und gestochen
scharf aussieht".

Im kleinen Rahmen (etwa 280 × 175 Punkte) ist die ganze Stadt nur so
breit wie ein Daumen lang ist: jedes Haus braucht dort kaum 6 Bildpunkte
je Meter. Die kleinen Bilder (_k, 18 px/m) sind dafür dreimal zu fein.
Dieses Werkzeug rechnet aus jedem _k-Bild (und seinem Schatten) ein
Zwergbild _z mit 40 % Kantenlänge und trägt es ins Verzeichnis ein
(Maße, Ankerpunkt, Maßstab, Lichter und Rauch mitgerechnet).
bilder.js nimmt es nur im kleinen Rahmen, solange es scharf genug ist;
mit der Lupe kommt wieder _k.

Wiederholbar: vorhandene Zwergbilder bleiben, neue _k-Bilder bekommen
eins. Aufruf: python3 werkzeug/leicht-zwerg.py (auch aus leicht-packen.js).
"""
import json, os, sys
from PIL import Image

WURZEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ORDNER = os.path.join(WURZEL, "stadt-leicht", "bilder")
VZ = os.path.join(ORDNER, "verzeichnis.json")
ZIEL_S = 7.5   # Bildpunkte je Meter im kleinen Rahmen (Überblick ≈ 6,6 bei 2,75-facher Pixeldichte)

def klein(quelle, ziel, f):
    if os.path.exists(ziel) and os.path.getmtime(ziel) >= os.path.getmtime(quelle):
        try:
            with Image.open(ziel) as z, Image.open(quelle) as q:
                if abs(z.width - round(q.width * f)) <= 1: return True
        except Exception:
            pass
    try:
        im = Image.open(quelle).convert("RGBA")
    except Exception:
        return False
    w, h = max(1, round(im.width * f)), max(1, round(im.height * f))
    im.resize((w, h), Image.LANCZOS).save(ziel, "WEBP", quality=72, method=6)
    return True

def main():
    vz = json.load(open(VZ))
    neu = 0
    # FASSUNG 807 — auch die Baustellenbilder (_m) bekommen Zwerge (_n): im kleinen Rahmen sieht man den Bau wachsen.
    for k in [k for k in vz if k.endswith("_k") or k.endswith("_m")]:
        m = vz[k]
        basis = k[:-2]
        zk = basis + ("_z" if k.endswith("_k") else "_n")
        F = min(0.8, max(0.3, ZIEL_S / float(m.get("s") or 18)))
        if not klein(os.path.join(ORDNER, k + ".webp"), os.path.join(ORDNER, zk + ".webp"), F):
            continue
        z = dict(m)
        for a in ("w", "h", "ax", "ay"):
            if a in z: z[a] = round(m[a] * F, 1) if a in ("ax", "ay") else max(1, round(m[a] * F))
        z["s"] = round(m["s"] * F, 3)
        z["l"] = [[l[0] * F, l[1] * F, l[2] * F] + list(l[3:]) for l in (m.get("l") or [])]
        z["r"] = [[r[0] * F, r[1] * F] + list(r[2:]) for r in (m.get("r") or [])]
        if m.get("sn"):
            sn = m["sn"]
            zsn = sn[:-4] + "_z_s" if sn.endswith("_k_s") else sn[:-4] + "_n_s" if sn.endswith("_m_s") else sn + "_z"
            if klein(os.path.join(ORDNER, sn + ".webp"), os.path.join(ORDNER, zsn + ".webp"), F):
                z["sn"] = zsn
                for a in ("sw", "sh"):
                    if a in z: z[a] = max(1, round(m[a] * F))
                for a in ("sax", "say"):
                    if a in z: z[a] = round(m[a] * F, 1)
            else:
                z.pop("sn", None)
        if vz.get(zk) != z:
            vz[zk] = z; neu += 1
    # FASSUNG 809 — die Eisenbahn (Laufblätter l_bahn_…, 8 Richtungen) bekommt je Blatt ein Zwergblatt _z für den
    # kleinen Rahmen: gleiche Zellen, nur kleiner (7,5 Bildpunkte je Meter), damit der Zug dort kaum etwas kostet.
    for k in [k for k in vz if k.startswith("l_bahn_") and not k.endswith("_z")]:
        m = vz[k]; zk = k + "_z"
        q = os.path.join(ORDNER, k + ".webp"); ziel = os.path.join(ORDNER, zk + ".webp")
        if not os.path.exists(q): continue
        F = ZIEL_S / float(m["s"])
        zw, zh = max(1, round(m["zw"] * F)), max(1, round(m["zh"] * F))
        n = m.get("n", 1)
        if not (os.path.exists(ziel) and os.path.getmtime(ziel) >= os.path.getmtime(q)):
            Image.open(q).convert("RGBA").resize((zw * n, zh * 8), Image.LANCZOS).save(ziel, "WEBP", quality=72, alpha_quality=45, method=6)
        z = dict(m, zw=zw, zh=zh, ax=round(m["ax"] * zw / m["zw"], 1), ay=round(m["ay"] * zh / m["zh"], 1), s=round(m["s"] * zw / m["zw"], 3))
        if vz.get(zk) != z:
            vz[zk] = z; neu += 1
    if neu:
        tmp = VZ + ".tmp"
        with open(tmp, "w") as f:
            json.dump(vz, f, separators=(",", ":"))
        os.replace(tmp, VZ)
    # Das kleine Verzeichnis für den Rahmen im Spiel: nur _z und _k (keine großen, keine Baustellen-, keine Leute-Bilder).
    # FASSUNG 805 — die Fensterlichter machten 85 % davon aus: im kleinen Rahmen reichen ganze Bildpunkte.
    def rund(v):
        v = dict(v)
        if v.get("l"): v["l"] = [[round(x) if isinstance(x, float) else x for x in l] for l in v["l"]]
        if v.get("r"): v["r"] = [[round(x) if isinstance(x, float) else x for x in r] for r in v["r"]]
        if v.get("l") == []: del v["l"]
        return v
    kv = {k: rund(v) for k, v in vz.items() if k.endswith("_z") or k.endswith("_k") or k.endswith("_n")}
    # Die _k-Einträge brauchen ihre Lichter hier nicht: bilder.js rechnet sie aus denen des Zwergbilds hoch.
    for k in list(kv):
        if k.endswith("_k") and "l" in kv[k] and (k[:-2] + "_z") in kv: kv[k] = {a: b for a, b in kv[k].items() if a != "l"}; kv[k]["lz"] = 1
    alt = None
    try: alt = json.load(open(os.path.join(ORDNER, "verzeichnis-klein.json")))
    except Exception: pass
    if alt != kv:
        with open(os.path.join(ORDNER, "verzeichnis-klein.json"), "w") as f:
            json.dump(kv, f, separators=(",", ":"))
    zg = sum(os.path.getsize(os.path.join(ORDNER, k + ".webp")) for k in vz if k.endswith("_z") and os.path.exists(os.path.join(ORDNER, k + ".webp")))
    kg = sum(os.path.getsize(os.path.join(ORDNER, k + ".webp")) for k in vz if k.endswith("_k") and os.path.exists(os.path.join(ORDNER, k + ".webp")))
    print("Zwergbilder: %d neu/geändert, zusammen %d KB (die _k-Bilder: %d KB)" % (neu, zg // 1024, kg // 1024))

if __name__ == "__main__":
    main()
