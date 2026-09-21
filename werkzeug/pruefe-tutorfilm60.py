#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=========================================================
GEMESSEN AN DEN FILMEN SELBST — RUNDE 60
---------------------------------------------------------
Drei Dinge waren gemeldet, drei Dinge werden hier gezaehlt:

  „unten rechts liegt irgend so ein Symbol, was da nicht
   hingehoert"  ->  wie viele getrennte Teile hat ein
   Einzelbild? Es darf genau EINS sein: die Figur.
  „der Avatar ist fast doppelt so gross"  ->  wie hoch steht
   die Figur im Film, verglichen mit dem Standbild?
  „pass auf, dass das konsistent ist"  ->  gilt das fuer
   jeden Film und ueber den ganzen Film, nicht nur im ersten
   Bild.

Aufruf:  python3 werkzeug/pruefe-tutorfilm60.py
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
fehler = 0


def sage(was, gut, zusatz=""):
    global fehler
    if not gut:
        fehler += 1
    print(("  ok   " if gut else "  FEHL ") + was + ("   " + zusatz if zusatz else ""))


def bilder(pfad, jedes=7):
    p = subprocess.Popen([FF, "-hide_banner", "-loglevel", "error", "-c:v", "libvpx-vp9",
                          "-i", pfad, "-f", "rawvideo", "-pix_fmt", "rgba", "-"],
                         stdout=subprocess.PIPE)
    n = 0
    while True:
        teile, fehlt = [], BYTES
        while fehlt > 0:
            st = p.stdout.read(fehlt)
            if not st:
                break
            teile.append(st); fehlt -= len(st)
        if fehlt > 0:
            break
        if n % jedes == 0:
            yield np.frombuffer(b"".join(teile), np.uint8).reshape(H, B, 4)
        n += 1
    p.stdout.close(); p.wait()


a = np.array(Image.open(os.path.join(WURZEL, "tutor", "alex-comic.png")).convert("RGBA"))
sh, sb = a.shape[:2]
ys, xs = np.where(a[:, :, 3] > 40)
ZIEL_H = (ys.max() - ys.min() + 1) / sh
ZIEL_O = ys.min() / sh
ZIEL_R = (sb - 1 - xs.max()) / sh
print("\nDAS STANDBILD ist das Mass: Figur %.2f %% der Bildhoehe, oben %.2f %%, rechts %.2f %%\n"
      % (ZIEL_H * 100, ZIEL_O * 100, ZIEL_R * 100))

namen = sorted(f[:-5] for f in os.listdir(ORDNER) if f.endswith(".webm"))
for n in namen:
    teile_max, hoch, oben, rechts, leer = 0, [], [], [], 0
    for bild in bilder(os.path.join(ORDNER, n + ".webm")):
        m = bild[:, :, 3] > 40
        if not m.any():
            leer += 1
            continue
        lab, k = ndimage.label(m)
        teile_max = max(teile_max, k)
        yy, xx = np.where(m)
        hoch.append(yy.max() - yy.min() + 1); oben.append(yy.min()); rechts.append(B - 1 - xx.max())
    if not hoch:
        sage(n + ": ueberhaupt eine Figur", False); continue
    fh, fo, fr = max(hoch) / H, min(oben) / H, min(rechts) / H
    sage("%-10s ein Stueck, kein loses Zeug" % n, teile_max == 1, "%d Teile" % teile_max)
    sage("%-10s so hoch wie das Standbild" % n, abs(fh - ZIEL_H) < 0.012,
         "%.2f %% statt %.2f %%" % (fh * 100, ZIEL_H * 100))
    sage("%-10s steht genauso weit oben" % n, abs(fo - ZIEL_O) < 0.012,
         "%.2f %% statt %.2f %%" % (fo * 100, ZIEL_O * 100))
    sage("%-10s steht genauso weit rechts" % n, abs(fr - ZIEL_R) < 0.012,
         "%.2f %% statt %.2f %%" % (fr * 100, ZIEL_R * 100))
    sage("%-10s kein leeres Bild dazwischen" % n, leer == 0, "%d leer" % leer)

print("\nROT: %d Abweichung(en)\n" % fehler if fehler else "\nDie Filme sitzen.\n")
sys.exit(1 if fehler else 0)
