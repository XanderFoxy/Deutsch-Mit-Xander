#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DIE LOKGLOCKE — „ALLES AUSSTEIGEN"
---------------------------------------------------------------------
XANDER (23.09.2026): „Vielleicht kann man, wenn die Lok ankommt, noch
so ein typisches Glockenklingeln machen, dass man weiss: alles
aussteigen."

Selbst gebaut, also lizenzfrei. Eine Glocke ist kein Ton mit
Obertoenen, sondern ein Metallkoerper mit UNHARMONISCHEN Teiltoenen —
genau daran hoert man, dass es Metall ist. Hier die klassische
Glockenreihe (Hum, Prime, Terz, Quint, Nominal …) auf eine kleine
Messingglocke von 1180 Hz gesetzt:
    0.5  1.0  1.183  1.506  2.0  2.514  2.662  3.011
Die hohen Teiltoene klingen schneller ab als die tiefen — so
schwingt Metall wirklich aus.
Geschlagen wird zweimal zweimal: „ding-ding … ding-ding", wie eine
Strassenbahn- oder Rangierglocke. Spitze bei -6 dBFS.
Ausgabe: ton/lokglocke.opus und ton/lokglocke.m4a.
=====================================================================
"""
import numpy as np, subprocess, os

RATE = 48000
FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg"
ZIEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ton")

GRUND = 1180.0
TEIL = [(0.5, 0.35, 1.6), (1.0, 1.0, 1.3), (1.183, 0.55, 0.9), (1.506, 0.4, 0.8),
        (2.0, 0.6, 0.6), (2.514, 0.25, 0.45), (2.662, 0.2, 0.4), (3.011, 0.18, 0.3)]

def schlag(dauer, staerke):
    n = int(RATE * dauer)
    t = np.arange(n) / RATE
    x = np.zeros(n)
    for f, a, abkling in TEIL:
        x += a * np.sin(2 * np.pi * GRUND * f * t) * np.exp(-t / abkling)
    # der Anschlag: ein kurzer metallischer Klick
    x[:int(RATE * 0.004)] += np.random.default_rng(7).standard_normal(int(RATE * 0.004)) * 0.6
    x *= np.minimum(1, t / 0.0015)
    return x * staerke

dauer = 2.4
n = int(RATE * dauer)
aus = np.zeros(n)
for ab, st in ((0.00, 1.0), (0.17, 0.8), (0.62, 0.95), (0.79, 0.75)):
    s = schlag(dauer - ab, st)
    i = int(RATE * ab)
    aus[i:i + len(s)] += s[:n - i]
aus *= np.minimum(1, (dauer - np.arange(n) / RATE) / 0.25)   # sauberes Ende
aus *= (10 ** (-6 / 20)) / np.max(np.abs(aus))
roh = "/tmp/claude-0/lokglocke.f32"
aus.astype(np.float32).tofile(roh)
for endung, codec in (("opus", ["-c:a", "libopus", "-b:a", "64k"]),
                      ("m4a", ["-c:a", "aac", "-b:a", "112k"])):
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(RATE),
                    "-ac", "1", "-i", roh] + codec + [os.path.join(ZIEL, "lokglocke." + endung)],
                   check=True)
print("lokglocke: %.1f s, vier Schlaege" % dauer)
