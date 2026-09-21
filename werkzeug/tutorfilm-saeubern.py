#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=========================================================
DIE TUTOR-FILME SAUBER FREISTELLEN — UND AUF DIE GROESSE
DES STANDBILDS BRINGEN
---------------------------------------------------------
GEMELDET: „Pass auch auf, dass das im Video immer konsistent
ist, weil ich hab in einem gekippten Video gesehen, dass da
unten rechts irgend so ein Symbol liegt, was da nicht
hingehoert … Pass einfach auf, dass das richtig schoen sauber
und fluessig ist." Und: „der Avatar soll von der Groessen-
Dimension genauso gross wie der alte sein, meiner ist jetzt
fast doppelt so gross … das ungefaehr ausmessen und abgleichen
mit dem Standbild-Avatar, wie gross der ist."

WAS WIRKLICH KAPUTT WAR — nachgemessen, nicht vermutet
tutorvideo-bauen.sh stellt mit „colorkey=0x020202" frei. Der
Hintergrund ist (2,2,2) — aber die SCHWARZEN COMIC-LINIEN sind
es auch. Der Schluessel hat also die Zeichnung selbst
weggeschnitten: gezaehlt 180 bis 247 getrennte Teile pro
Einzelbild, wo eins stehen muesste. Auf hellem Grund scheint
der Hintergrund durch jede Linie durch — das ist der weisse
Saum, der ums Bild und um jeden Aermel lief.

DER WEG HIER
  1. Maske schliessen (Kreis r=3): die Linien sind 2 bis 3 px
     breit, danach ist die Figur wieder EIN Stueck.
  2. Loecher fuellen.
  3. Kern erodieren (r=2), groesstes Teil nehmen, wieder
     aufweiten: das trennt duenne Bruecken zu losem Zeug —
     genau die Kruemel, die unten rechts herumlagen.
  4. Rand weich rechnen (Gauss), damit keine Treppen entstehen.
  5. EINE Verschiebung/Streckung fuer den ganzen Film, damit
     die Figur genauso hoch steht und genauso weit rechts wie
     im Standbild tutor/alex-comic.png. Gemessen wird ueber
     alle Einzelbilder, nicht an einem einzigen.
Die RGB-Werte bleiben unangetastet — nur der Alphakanal wird
neu gerechnet. Das alte Bild ist damit nicht uebermalt.

Die Vorgaenger liegen in der Git-Geschichte; deshalb wird hier
nichts zusaetzlich kopiert.

Aufruf:  python3 werkzeug/tutorfilm-saeubern.py [name ...]
         (ohne Namen: alle Filme aus tutor/video/)
=========================================================
"""
import os, subprocess, sys
import numpy as np
from PIL import Image
from scipy import ndimage

WURZEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ORDNER = os.path.join(WURZEL, "tutor", "video")
FF = os.environ.get("FF", "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg")
B, H = 360, 636
BYTES = B * H * 4


def scheibe(r):
    y, x = np.ogrid[-r:r + 1, -r:r + 1]
    return x * x + y * y <= r * r


def groesstes(m):
    lab, k = ndimage.label(m)
    if k <= 1:
        return m
    gr = ndimage.sum(m, lab, range(1, k + 1))
    return lab == int(np.argmax(gr)) + 1


def maske(bild, r=3, kern=2):
    """Aus dem Alphakanal eines Einzelbildes die richtige Figur."""
    m = bild[:, :, 3] > 40
    zu = ndimage.binary_fill_holes(ndimage.binary_closing(m, structure=scheibe(r)))
    k = groesstes(ndimage.binary_erosion(zu, structure=scheibe(kern)))
    zu = ndimage.binary_dilation(k, structure=scheibe(kern)) & zu
    return ndimage.binary_fill_holes(zu)


def lesen(pfad):
    """Einzelbilder als RGBA aus dem webm — Alpha nur mit -c:v vor -i."""
    p = subprocess.Popen(
        [FF, "-hide_banner", "-loglevel", "error", "-c:v", "libvpx-vp9",
         "-i", pfad, "-f", "rawvideo", "-pix_fmt", "rgba", "-"],
        stdout=subprocess.PIPE)
    while True:
        # Eine Pipe liefert nicht immer alles auf einmal — sonst faengt
        # man ein halbes Einzelbild und haelt den Film fuer zu Ende.
        teile, fehlt = [], BYTES
        while fehlt > 0:
            st = p.stdout.read(fehlt)
            if not st:
                break
            teile.append(st); fehlt -= len(st)
        if fehlt > 0:
            break
        yield np.frombuffer(b"".join(teile), np.uint8).reshape(H, B, 4)
    p.stdout.close(); p.wait()


def ziel_aus_standbild():
    a = np.array(Image.open(os.path.join(WURZEL, "tutor", "alex-comic.png")).convert("RGBA"))
    h, b = a.shape[:2]
    ys, xs = np.where(a[:, :, 3] > 40)
    return dict(hoch=(ys.max() - ys.min() + 1) / h,          # Figurhoehe je Bildhoehe
                oben=ys.min() / h,
                rechts=(b - 1 - xs.max()) / h)               # Abstand zum rechten Rand


def saeubern(name, ziel):
    quelle = os.path.join(ORDNER, name + ".webm")
    if not os.path.exists(quelle):
        print("fehlt:", quelle); return
    # --- erster Durchgang: wo steht die Figur ueber den ganzen Film? ---
    o, u, re = [], [], []
    n = 0
    for bild in lesen(quelle):
        if n % 5 == 0:
            m = maske(bild)
            ys, xs = np.where(m)
            if len(ys):
                o.append(ys.min()); u.append(ys.max()); re.append(xs.max())
        n += 1
    if not o:
        print("keine Figur gefunden:", name); return
    oben, unten, rechts = float(np.min(o)), float(np.max(u)), float(np.max(re))
    hoch = unten - oben + 1
    s = (ziel["hoch"] * H) / hoch                       # Streckung
    dy = ziel["oben"] * H - oben * s                    # danach verschieben
    dx = (B - 1 - ziel["rechts"] * H) - rechts * s
    print("%-10s %4d Bilder  Figur %.1f px (Ziel %.1f)  Faktor %.4f  dx %.1f dy %.1f"
          % (name, n, hoch, ziel["hoch"] * H, s, dx, dy))

    # --- zweiter Durchgang: saeubern, verschieben, schreiben ---
    # FALLE, schon einmal zugeschnappt: ffmpeg waehlt das Format nach der
    # ENDUNG. Auf „name.webm.neu" schreibt es gar nichts. Also erst in eine
    # richtige .webm daneben, dann umbenennen.
    zwischen = os.path.join(ORDNER, "_neu_" + name + ".webm")
    aus = subprocess.Popen(
        [FF, "-hide_banner", "-loglevel", "error", "-y",
         "-f", "rawvideo", "-pix_fmt", "rgba", "-s", "%dx%d" % (B, H), "-r", "25", "-i", "-",
         "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0",
         "-b:v", "0", "-crf", "32", "-an",
         zwischen],
        stdin=subprocess.PIPE)
    for bild in lesen(quelle):
        m = maske(bild)
        weich = ndimage.gaussian_filter(m.astype(np.float32), 0.8)
        alpha = np.clip((weich - 0.38) / 0.28, 0, 1)
        neu = bild.copy()
        neu[:, :, 3] = (alpha * 255).astype(np.uint8)
        if abs(s - 1) > 0.002 or abs(dx) > 0.5 or abs(dy) > 0.5:
            im = Image.fromarray(neu).transform(
                (B, H), Image.AFFINE, (1 / s, 0, -dx / s, 0, 1 / s, -dy / s),
                resample=Image.BICUBIC)
            neu = np.array(im)
        aus.stdin.write(neu.tobytes())
    aus.stdin.close(); aus.wait()
    os.replace(zwischen, quelle)

    # --- die Maskenfassung fuers iPhone gleich mit ---
    subprocess.run(
        [FF, "-hide_banner", "-loglevel", "error", "-y", "-c:v", "libvpx-vp9", "-i", quelle,
         "-vf", "format=yuva420p,split[a][b];[b]alphaextract,format=gray,format=yuv420p[m];"
                "[a]format=yuv420p[c];[c][m]hstack",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "26", "-an",
         os.path.join(ORDNER, name + "-maske.mp4")], check=True)


if __name__ == "__main__":
    ziel = ziel_aus_standbild()
    print("Standbild: Figur %.1f %% der Bildhoehe, oben %.2f %%, rechts %.2f %%"
          % (ziel["hoch"] * 100, ziel["oben"] * 100, ziel["rechts"] * 100))
    namen = sys.argv[1:] or sorted(
        f[:-5] for f in os.listdir(ORDNER)
        if f.endswith(".webm") and not f.endswith("-maske.webm"))
    for nm in namen:
        saeubern(nm, ziel)
