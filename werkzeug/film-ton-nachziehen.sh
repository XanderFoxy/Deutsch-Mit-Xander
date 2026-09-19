#!/usr/bin/env bash
# =====================================================================
# DEN TON EINES FERTIGEN FILMS NACHZIEHEN — OHNE DAS BILD ANZUFASSEN
# ---------------------------------------------------------------------
# GEMELDET, zweimal: „Der Sound ist noch immer sehr duenn … der Sound
# muss unbedingt passen, dass er nicht mehr duenn ist."
#
# ERST GEMESSEN, DANN GEBAUT (werkzeug/film-ton-messen.js):
#   T-Rex   20–120 Hz: 87 % der Energie · ueber 2 kHz: 0,6 %
#   Lok     20–120 Hz: 82 %              · ueber 2 kHz: 0,8 %
#   U-Boot  20–120 Hz: 89 %              · ueber 2 kHz: 0,2 %
#
# Das ist die Ursache, und sie ist das Gegenteil von dem, was „duenn"
# vermuten laesst: der Ton ist nicht zu wenig Bass, er ist FAST NUR
# Bass. Ein Telefonlautsprecher gibt unter 200 Hz so gut wie nichts
# wieder — es bleiben also die letzten zehn Prozent uebrig, und die
# klingen duenn. Mein eigener Griff hat es verschlimmert: die alte
# Kette hatte „bass=g=4:f=110" drin und hat den Berg noch erhoeht;
# loudnorm hat danach ALLES leiser gemacht, um auf -14 LUFS zu
# kommen — also auch die Mitten, die man wirklich hoert.
#
# WAS HIER PASSIERT
#   1. Unter 45 Hz wird abgeschnitten. Das hoert kein Geraet, es
#      frisst nur Aussteuerung.
#   2. Der Berg bei 80 Hz wird um 6 dB GESENKT statt angehoben.
#   3. ZWEI Oberton-Erzeuger. Der Bass wird kopiert und durch eine
#      weiche Kennlinie geschickt (tanh); dabei entstehen Obertoene
#      bei 160, 240, 320 Hz. Ein kleiner Lautsprecher spielt die —
#      und das Ohr hoert den Grundton trotzdem mit („missing
#      fundamental"). So bleibt das Grollen ein Grollen, auch auf
#      dem Telefon. Der zweite tut dasselbe mit dem Band um 300 Hz
#      und fuellt damit 500 bis 2000 Hz, wo das Telefon am besten
#      spielt.
#   4. Koerper bei 260 Hz, Mitten bei 1,2 kHz, Praesenz bei 3 kHz.
#   5. Erst danach Kompressor, loudnorm (zweistufig) und Begrenzer.
#
# DAS BILD WIRD NICHT NEU GERECHNET (-c:v copy). Ein Film verliert
# hier also nichts an Schaerfe — nur die Tonspur wird neu gesetzt.
#
#   werkzeug/film-ton-nachziehen.sh filme/trex.webm
#   werkzeug/film-ton-nachziehen.sh            # alle auf einmal
# =====================================================================
set -euo pipefail
FF="${FF:-/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg}"
WURZEL="$(cd "$(dirname "$0")/.." && pwd)"

# Der Oberton-Erzeuger und die Entzerrung als ein Filtergraph.
KETTE='[0:a]asplit=3[trocken][tief][mitte];
[tief]lowpass=f=150,aeval=tanh(5*val(0)):c=same,highpass=f=170,lowpass=f=1200,volume=0.85[ober1];
[mitte]bandpass=f=300:width_type=h:w=340,aeval=tanh(4.5*val(0)):c=same,highpass=f=500,lowpass=f=4000,volume=0.55[ober2];
[trocken]highpass=f=45,bass=g=-9:f=130:w=0.7[grund];
[grund][ober1][ober2]amix=inputs=3:weights=1 1.05 0.75:normalize=0,
equalizer=f=260:width_type=q:w=0.8:g=4,
equalizer=f=1200:width_type=q:w=1.0:g=3,
equalizer=f=3000:width_type=q:w=0.9:g=5,
acompressor=threshold=-20dB:ratio=2.6:attack=10:release=200:makeup=1.3[aus]'

nachziehen () {
  local DATEI="$1"
  local NAME
  NAME="$(basename "$DATEI" .webm)"
  local TMP="/tmp/claude-0/ton-$NAME"
  mkdir -p "$TMP"
  echo "  $NAME …"

  # Erster Durchgang: messen, was herauskommt.
  local MESS
  # ACHTUNG: loudnorm schreibt seinen Befund auf der Stufe „info" —
  # mit „-v error" kaeme gar nichts zurueck, und der zweite Durchgang
  # liefe blind. Das hat den ersten Entwurf hier abbrechen lassen.
  MESS="$("$FF" -hide_banner -i "$DATEI" -filter_complex \
      "${KETTE};[aus]loudnorm=I=-14:TP=-1.0:LRA=9:print_format=json[m]" \
      -map '[m]' -f null - 2>&1 | tail -24 || true)"
  local I TP LRA TH
  I=$(echo "$MESS"   | grep -o '"input_i"[^,]*'  | grep -o -- '-\?[0-9.]\+' | head -1 || true)
  TP=$(echo "$MESS"  | grep -o '"input_tp"[^,]*' | grep -o -- '-\?[0-9.]\+' | head -1 || true)
  LRA=$(echo "$MESS" | grep -o '"input_lra"[^,]*'| grep -o -- '-\?[0-9.]\+' | head -1 || true)
  TH=$(echo "$MESS"  | grep -o '"input_thresh"[^,]*'|grep -o -- '-\?[0-9.]\+'| head -1 || true)

  local NORM="loudnorm=I=-14:TP=-1.0:LRA=9"
  if [ -n "${I:-}" ] && [ -n "${TP:-}" ] && [ -n "${LRA:-}" ] && [ -n "${TH:-}" ]; then
    NORM="loudnorm=I=-14:TP=-1.0:LRA=9:measured_I=${I}:measured_TP=${TP}:measured_LRA=${LRA}:measured_thresh=${TH}:linear=true"
  fi

  "$FF" -v error -y -i "$DATEI" -filter_complex \
    "${KETTE};[aus]${NORM},alimiter=limit=0.94[end]" \
    -map 0:v:0 -map '[end]' -c:v copy -c:a libopus -b:a 96k \
    "$TMP/$NAME.webm"

  mv "$TMP/$NAME.webm" "$DATEI"
  echo "     fertig: $(du -h "$DATEI" | cut -f1)"
}

if [ $# -gt 0 ]; then
  for f in "$@"; do nachziehen "$f"; done
else
  for f in "$WURZEL"/filme/*.webm; do nachziehen "$f"; done
fi
