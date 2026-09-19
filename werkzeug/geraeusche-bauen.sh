#!/usr/bin/env bash
# =====================================================================
# VIER GERECHNETE GERAEUSCHE FUER DIE PROFILBILD-ANIMATIONEN
# ---------------------------------------------------------------------
# GEWUENSCHT: „Da brauch ich dann noch einen Sound. Vielleicht hast du
# ja schon einen in deiner Soundkiste. Ansonsten machen wir das später
# über ElevenLabs."
#
# Ich habe in der Kiste nachgesehen: einen Wecker gab es nicht, und
# was ich stattdessen genommen hatte (die Noten), klingt nach allem,
# nur nicht nach einem Wecker. Diese vier sind deshalb GERECHNET —
# so wie der Schrei auch (werkzeug/schrei-ton-bauen.sh). Das kostet
# nichts, verlaesst die Seite nicht und laesst sich jederzeit wieder
# aendern, weil die Zahlen hier stehen und nicht in einer Datei.
#
# WAS EIN GERAEUSCH ECHT MACHT, IST SEIN VERLAUF — nicht sein Klang:
#
#   wecker   Zwei Glocken, leicht verstimmt (1720 und 2150 Hz), und
#            dazwischen schlaegt der Kloeppel hin und her — das ist
#            die schnelle Schwebung, 34-mal in der Sekunde. Drei
#            Stoesse mit Pause, genau im Takt der Animation
#            (lcScheppern in korrekturen.css: drei Stoesse in 2,4 s).
#   bonk     Ein Hammerschlag ist ein Ton, der beim Aufprall nach
#            UNTEN rutscht: 190 auf 85 Hz in einer Zehntelsekunde.
#            Darum klingt ein Schlag auf Holz tiefer als sein Anfang.
#   tritt    Ein Ball: ein sehr kurzer Knall (Leder) und darunter ein
#            tiefer Stoss (die Luft im Ball). Beides zusammen dauert
#            keine Viertelsekunde — laenger waere ein Tritt gegen
#            eine Wand.
#   platsch  Wasser ist gefiltertes Rauschen mit zwei Teilen: erst
#            der Guss (breit, anschwellend), dann die Tropfen
#            (kurze, hellere Spritzer).
#
# Aufruf:  bash werkzeug/geraeusche-bauen.sh
# =====================================================================
set -euo pipefail
FF="${FF:-/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg}"
AUS="$(cd "$(dirname "$0")/.." && pwd)/ton"
mkdir -p "$AUS"

fertig () {   # Name, Dauer -> opus und m4a
  local N="$1"
  "$FF" -y -v error -i "$AUS/$N.opus" -c:a aac -b:a 72k "$AUS/$N.m4a"
  echo "  $N  $(du -h "$AUS/$N.opus" | cut -f1) / $(du -h "$AUS/$N.m4a" | cut -f1)"
}

echo "wecker …"
# Drei Stoesse: bei 0,00 / 0,62 / 1,24 Sekunden, jeder mit hartem
# Anschlag und Ausklingen. Genau dieser Takt steht in der Animation.
STOSS="between(t,0,0.46)*exp(-5.5*t)\
+between(t,0.62,1.08)*exp(-5.5*(t-0.62))\
+between(t,1.24,1.70)*exp(-5.5*(t-1.24))"
"$FF" -y -v error \
  -f lavfi -i "sine=frequency=1720:duration=2.2:sample_rate=48000" \
  -f lavfi -i "sine=frequency=2153:duration=2.2:sample_rate=48000" \
  -f lavfi -i "sine=frequency=3460:duration=2.2:sample_rate=48000" \
  -filter_complex "\
   [0:a]volume=0.62[g1]; \
   [1:a]volume=0.52[g2]; \
   [2:a]volume=0.18[g3]; \
   [g1][g2][g3]amix=inputs=3:normalize=0, \
     tremolo=f=34:d=0.85, \
     volume='${STOSS}':eval=frame, \
     highpass=f=900, \
     aecho=0.9:0.35:37|71:0.22|0.12, \
     loudnorm=I=-16:TP=-1.5:LRA=7[out]" \
  -map "[out]" -t 2.2 -ac 2 -c:a libopus -b:a 56k "$AUS/wecker.opus"
fertig wecker

echo "bonk …"
# Ein fallender Ton: Phase = 2*PI*(f0*t + (f1-f0)*t^2/(2*T)).
# Mit f0=190, f1=85, T=0.10 ergibt das den Rutsch nach unten.
"$FF" -y -v error \
  -f lavfi -i "aevalsrc='sin(2*PI*(190*t+(85-190)*t*t/(2*0.10)))':d=0.7:s=48000" \
  -f lavfi -i "anoisesrc=d=0.7:c=pink:r=48000:a=0.5" \
  -filter_complex "\
   [0:a]volume='exp(-9*t)':eval=frame,volume=1.0[tief]; \
   [1:a]bandpass=f=1600:width_type=h:w=1800, \
        volume='exp(-46*t)':eval=frame,volume=0.9[klack]; \
   [tief][klack]amix=inputs=2:normalize=0, \
     lowpass=f=5200, \
     loudnorm=I=-16:TP=-1.5:LRA=7[out]" \
  -map "[out]" -t 0.7 -ac 2 -c:a libopus -b:a 56k "$AUS/bonk.opus"
fertig bonk

echo "tritt …"
"$FF" -y -v error \
  -f lavfi -i "aevalsrc='sin(2*PI*(150*t+(70-150)*t*t/(2*0.08)))':d=0.5:s=48000" \
  -f lavfi -i "anoisesrc=d=0.5:c=white:r=48000:a=0.6" \
  -filter_complex "\
   [0:a]volume='exp(-13*t)':eval=frame,volume=1.0[luft]; \
   [1:a]bandpass=f=2400:width_type=h:w=2600, \
        volume='exp(-70*t)':eval=frame,volume=1.0[leder]; \
   [luft][leder]amix=inputs=2:normalize=0, \
     lowpass=f=6000, \
     loudnorm=I=-16:TP=-1.5:LRA=7[out]" \
  -map "[out]" -t 0.5 -ac 2 -c:a libopus -b:a 56k "$AUS/tritt.opus"
fertig tritt

echo "platsch …"
"$FF" -y -v error \
  -f lavfi -i "anoisesrc=d=1.6:c=white:r=48000:a=0.7" \
  -f lavfi -i "anoisesrc=d=1.6:c=white:r=48000:a=0.7" \
  -filter_complex "\
   [0:a]lowpass=f=1500,highpass=f=180, \
        volume='min(1,t/0.12)*exp(-2.6*t)':eval=frame,volume=1.1[guss]; \
   [1:a]bandpass=f=3200:width_type=h:w=2800, \
        volume='(between(t,0.18,0.24)+between(t,0.31,0.36)*0.8\
+between(t,0.47,0.52)*0.7+between(t,0.66,0.71)*0.5\
+between(t,0.92,0.97)*0.4)*exp(-1.2*t)':eval=frame,volume=1.0[spritzer]; \
   [guss][spritzer]amix=inputs=2:normalize=0, \
     lowpass=f=7000, \
     loudnorm=I=-16:TP=-1.5:LRA=7[out]" \
  -map "[out]" -t 1.6 -ac 2 -c:a libopus -b:a 56k "$AUS/platsch.opus"
fertig platsch

echo
echo "Fertig. Jetzt noch:  node werkzeug/geraeusche-liste.js"
