#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=====================================================================
DAS PSSST — DER TON VOR EINER GEFLUESTERTEN SPRACHNACHRICHT
---------------------------------------------------------------------
XANDER (23.09.2026): „wenn man fluestert und eine Sprachnachricht
schicken will, dass diese von einem PSSST angekuendigt wird. Also ein
Soundeffekt, der dieses Fluestern auf diese Weise andeutet, damit man
nicht instinktiv auf denjenigen antwortet."

Selbst gebaut, also lizenzfrei. So klingt ein menschliches „Pssst":
  · Ein kurzes „P": die Lippen gehen auf, ein dumpfer Luftstoss —
    15 ms Rauschen unter 900 Hz, schnell abklingend.
  · Dann das „sss": ein ZISCHEN, das im Mund entsteht, zwischen Zunge
    und Zaehnen. Physikalisch ist das Rauschen mit dem meisten Druck
    zwischen 4 und 9 kHz (der S-Laut hat seinen Schwerpunkt um
    6 kHz). Es schwillt in 40 ms an, haelt 480 ms und wird zum Ende
    hin leiser, weil die Luft ausgeht.
  · Gefluestert ist es LEISE: Spitze bei -9 dBFS, damit es nicht
    lauter ist als eine normale Stimme.
Ausgabe: ton/pssst.opus und ton/pssst.m4a, 48 kHz, mono.
=====================================================================
"""
import numpy as np, subprocess, os, sys

RATE = 48000
FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg"
ZIEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ton")
rng = np.random.default_rng(99)

def band(x, lo, hi):
    """Bandpass im Frequenzraum — weich, ohne Klirren an den Kanten."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / RATE)
    w = np.ones_like(f)
    w *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    w *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * w, len(x))

dauer = 0.72
n = int(RATE * dauer)
t = np.arange(n) / RATE
aus = np.zeros(n)

# --- „P": ein dumpfer Luftstoss ---------------------------------------
p_n = int(RATE * 0.05)
p = band(rng.standard_normal(p_n), 80, 900)
p *= np.exp(-np.arange(p_n) / (RATE * 0.012))
aus[:p_n] += p / np.max(np.abs(p)) * 0.45

# --- „sss": das Zischen ------------------------------------------------
s_ab = 0.045
s_n = n - int(RATE * s_ab)
s = band(rng.standard_normal(s_n), 4000, 9000)
ts = np.arange(s_n) / RATE
huelle = np.minimum(1, ts / 0.04)                         # anschwellen
huelle *= np.where(ts < 0.52, 1 - 0.25 * ts / 0.52,       # langsam leiser
                   0.75 * np.exp(-(ts - 0.52) / 0.05))    # Luft geht aus
# ein kaum hoerbares Flattern der Zunge, 7 Hz
huelle *= 1 + 0.06 * np.sin(2 * np.pi * 7 * ts)
s *= huelle
aus[int(RATE * s_ab):] += s / np.max(np.abs(s)) * 0.9

# --- Pegel: Spitze bei -9 dBFS ----------------------------------------
aus *= (10 ** (-9 / 20)) / np.max(np.abs(aus))
roh = "/tmp/claude-0/pssst.f32"
aus.astype(np.float32).tofile(roh)
for endung, codec in (("opus", ["-c:a", "libopus", "-b:a", "48k"]),
                      ("m4a", ["-c:a", "aac", "-b:a", "96k"])):
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(RATE),
                    "-ac", "1", "-i", roh] + codec + [os.path.join(ZIEL, "pssst." + endung)],
                   check=True)
print("pssst: %.2f s, Spitze -9 dBFS" % dauer)
