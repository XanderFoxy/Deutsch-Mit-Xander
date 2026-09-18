#!/bin/sh
# BAUT DEN NEUTRALEN SCHREI-TON.
# ---------------------------------------------------------------
# GEWUENSCHT: „Vielleicht kannst du einen Sound-Effekt reinmachen,
# der neutral dazu passt — egal was man schreit —, der irgendwie
# Schall vermittelt oder wie ein Echo, aber so allgemein, dass es
# kein Wort widerspiegelt, sondern wie ein menschlicher Klang."
#
# Also KEIN Wort und keine Aufnahme: ein gerechneter Klang.
#   * Zwei Sinustoene (196 Hz und 294 Hz, eine Quinte) — eine
#     Quinte klingt offen und nach niemandem Bestimmten.
#   * Ein Formantfilter um 700 und 1150 Hz: das sind die beiden
#     Bereiche, die einen menschlichen Vokal ausmachen. Dadurch
#     klingt es nach Stimme, ohne ein Wort zu sein.
#   * Eine Huellkurve, die schnell aufgeht und langsam abfaellt,
#     wie ein Ruf.
#   * Drei Echos in abnehmender Lautstaerke — das ist der Raum.
#
# Aufruf:  sh werkzeug/schrei-ton-bauen.sh
FF=/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg
AUS=/home/user/Deutsch-Mit-Xander/ton

"$FF" -y -v error \
  -f lavfi -i "sine=frequency=196:duration=1.9:sample_rate=48000" \
  -f lavfi -i "sine=frequency=294:duration=1.9:sample_rate=48000" \
  -f lavfi -i "anoisesrc=duration=1.9:color=pink:amplitude=0.12:sample_rate=48000" \
  -filter_complex "\
   [0:a]volume=0.55[a]; \
   [1:a]volume=0.32[b]; \
   [2:a]volume=0.30[c]; \
   [a][b][c]amix=inputs=3:normalize=0[mix]; \
   [mix]equalizer=f=700:width_type=q:w=1.4:g=11, \
        equalizer=f=1150:width_type=q:w=1.6:g=8, \
        equalizer=f=2600:width_type=q:w=1.2:g=-6, \
        highpass=f=130, lowpass=f=4200, \
        afade=t=in:st=0:d=0.06:curve=exp, \
        afade=t=out:st=0.30:d=1.58:curve=log, \
        aecho=0.8:0.85:190|370|640:0.38|0.22|0.12, \
        loudnorm=I=-19:TP=-2:LRA=8[out]" \
  -map "[out]" -t 2.1 -c:a libopus -b:a 48k "$AUS/schrei.opus"

"$FF" -y -v error -i "$AUS/schrei.opus" -c:a aac -b:a 64k "$AUS/schrei.m4a"

ls -l "$AUS/schrei.opus" "$AUS/schrei.m4a"
