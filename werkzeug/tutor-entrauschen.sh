#!/bin/sh
# ENTRAUSCHT DIE TUTOR-AUFNAHMEN.
# ---------------------------------------------------------------
# GEWUENSCHT: „Die Audioaufnahmen sollen entrauscht sein."
#
# Drei Schritte, in dieser Reihenfolge:
#   highpass=f=70   Trittschall und Netzbrummen weg. Unter 70 Hz
#                   steht in einer Sprachaufnahme nichts Nuetzliches.
#   afftdn          Der eigentliche Entrauscher. nr=14 dB ist
#                   bewusst zurueckhaltend — dreht man hoeher, klingt
#                   die Stimme blechern („unter Wasser").
#   loudnorm        Alle Stuecke auf dieselbe Lautheit, damit beim
#                   Tutor nicht ein Satz fluestert und der naechste
#                   schreit.
#
# GEMESSEN (Abstand Spitze zu Rauschboden, vorher → nachher):
#   ueber-01  45,5 → 62,4 dB   (+16,9)
#   lern-01   42,0 → 55,9 dB   (+13,9)
#   wiss-02   42,4 → 56,3 dB   (+13,9)
#   prof-04   37,3 → 49,2 dB   (+11,9)
#
# ACHTUNG beim Nachmessen: der ABSOLUTE Rauschboden wird durch
# loudnorm scheinbar schlechter, weil alles angehoben wird. Was
# zaehlt, ist der ABSTAND zur Stimme.
FF=${FF:-/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg}
KETTE="highpass=f=70,afftdn=nr=14:nf=-42:tn=1,loudnorm=I=-17:TP=-1.5:LRA=9"
for f in "$@"; do
  name=$(basename "$f" | sed 's/\.[^.]*$//')
  "$FF" -y -loglevel error -i "$f" -af "$KETTE" -ar 44100 "/tmp/$name.entrauscht.wav"
  "$FF" -y -loglevel error -i "/tmp/$name.entrauscht.wav" -c:a libopus -b:a 40k -ac 1 "tutor/$name.opus"
  "$FF" -y -loglevel error -i "/tmp/$name.entrauscht.wav" -c:a aac -b:a 64k -ac 1 -movflags +faststart "tutor/$name.m4a"
  echo "$name fertig"
done
