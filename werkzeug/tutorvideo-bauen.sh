#!/usr/bin/env bash
# =========================================================
# AUS EINEM ROHFILM ZWEI DATEIEN FUER DEN TUTOR
# ---------------------------------------------------------
# GEWUENSCHT: „den Tutor auf dem Android sieht man ihn
# freigestellt. Auf dem iPhone sieht man ihn mit einem
# schwarzen Hintergrund. Kannst du das nicht machen wie bei
# dem Green Screen, dass wir das ausrechnen koennen, dass es
# ueberall gleich aussieht?"
#
# Deshalb entstehen hier ZWEI Dateien aus demselben Rohfilm:
#   <name>.webm        — VP9 mit echter Alphaspur (Android,
#                        Firefox, Chrome)
#   <name>-maske.mp4   — links das Bild, rechts die Maske;
#                        der Tutor rechnet daraus im WebGL
#                        die Durchsichtigkeit (iPhone).
#
# ZWEI FALLEN, beide schon einmal zugeschnappt:
#   1. ffmpeg liest die Alphaspur eines VP9-Films NUR mit
#      „-c:v libvpx-vp9" VOR dem -i. Ohne das kommt eine
#      Maske heraus, die ueberall deckend ist (gemessen:
#      100 % voll) — und niemand sieht es der Datei an.
#   2. Der Hintergrund ist nicht reines Schwarz, sondern
#      etwa (2,2,2). Der Schluesselwert steht deshalb hier
#      und nicht im Kopf.
#
# Aufruf:  werkzeug/tutorvideo-bauen.sh roh.mp4 ueber-02b
# =========================================================
set -e
FF="${FF:-/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg}"
ROH="$1"; NAME="$2"
if [ -z "$ROH" ] || [ -z "$NAME" ]; then
  echo "Aufruf: $0 <rohfilm.mp4> <name-ohne-endung>"; exit 1
fi
ZIEL="$(dirname "$0")/../tutor/video"
mkdir -p "$ZIEL"

"$FF" -hide_banner -loglevel error -y -i "$ROH" \
  -vf "scale=360:636,colorkey=0x020202:0.06:0.03,format=yuva420p" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf 34 -an \
  "$ZIEL/$NAME.webm"

"$FF" -hide_banner -loglevel error -y -c:v libvpx-vp9 -i "$ZIEL/$NAME.webm" \
  -vf "format=yuva420p,split[a][b];[b]alphaextract,format=gray,format=yuv420p[m];[a]format=yuv420p[c];[c][m]hstack" \
  -c:v libx264 -pix_fmt yuv420p -crf 26 -an \
  "$ZIEL/$NAME-maske.mp4"

echo "fertig: $ZIEL/$NAME.webm  und  $ZIEL/$NAME-maske.mp4"
ls -la "$ZIEL/$NAME.webm" "$ZIEL/$NAME-maske.mp4"
