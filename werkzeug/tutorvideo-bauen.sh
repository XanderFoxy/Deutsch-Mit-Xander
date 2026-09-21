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
# ---------------------------------------------------------
# WARUM ES JETZT GRUEN IST — und das ist der Kern
# GEMELDET: „ich sehe jetzt immer noch Freistellungsluecken in
# den Schuhen … Ich glaube, du schaffst das nicht mit dem
# Alpha-Kanal. Wenn wir kein Green Screen nehmen, dann wird es
# wahrscheinlich nicht professionell aussehen."
#
# Er hat recht, und die Ursache ist genau benennbar: NICHT der
# Alphakanal ist das Problem, sondern die SCHLUESSELFARBE. Bis
# jetzt wurde auf Schwarz (2,2,2) freigestellt — und Alex traegt
# einen schwarzen Pullover, schwarze Schuhe, eine schwarze
# Muetze, und die Comiczeichnung hat schwarze Konturlinien.
# Gezaehlt an einem Einzelbild der alten Fassung: 180 bis 247
# getrennte Teile, wo EINS stehen muesste. Der Schluessel hat
# die Zeichnung selbst weggeschnitten. Mit keiner Toleranz ist
# das zu retten: zwei Dinge, die dieselbe Farbe haben, kann man
# nicht auseinanderhalten.
#
# Auf GRUEN passiert das nicht, weil an Alex nichts gruen ist.
# Deshalb ist Gruen hier der Normalfall; Schwarz bleibt nur als
# Rueckfall fuer die alten Rohfilme stehen.
#
# ZWEI FALLEN, beide schon einmal zugeschnappt:
#   1. ffmpeg liest die Alphaspur eines VP9-Films NUR mit
#      „-c:v libvpx-vp9" VOR dem -i. Ohne das kommt eine
#      Maske heraus, die ueberall deckend ist (gemessen:
#      100 % voll) — und niemand sieht es der Datei an.
#   2. Der alte schwarze Hintergrund ist nicht reines Schwarz,
#      sondern etwa (2,2,2). Der Schluesselwert steht deshalb
#      hier und nicht im Kopf.
#
# Aufruf:
#   werkzeug/tutorvideo-bauen.sh roh.mp4 ueber-02b
#   GRUND=schwarz werkzeug/tutorvideo-bauen.sh alt.mp4 lern-09
#   GRUND=0x1ab24a werkzeug/tutorvideo-bauen.sh roh.mp4 name
# =========================================================
set -e
FF="${FF:-/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg}"
ROH="$1"; NAME="$2"
if [ -z "$ROH" ] || [ -z "$NAME" ]; then
  echo "Aufruf: $0 <rohfilm.mp4> <name-ohne-endung>"; exit 1
fi
ZIEL="$(dirname "$0")/../tutor/video"
mkdir -p "$ZIEL"

# Welcher Hintergrund? Gruen ist der Normalfall.
GRUND="${GRUND:-gruen}"
case "$GRUND" in
  gruen|green|"")
    # Das uebliche Chroma-Key-Gruen. „similarity" etwas grosszuegig,
    # „blend" weich, damit die Kante nicht ausfranst — und danach
    # DESPILL: der gruene Schimmer, der sich auf Haare und Schultern
    # legt, wird herausgerechnet, sonst hat Alex einen gruenen Saum.
    SCHLUESSEL="chromakey=0x00b140:0.30:0.10"
    DESPILL=",despill=type=green:mix=0.5:expand=0"
    ;;
  schwarz|black)
    # DER ALTE WEG. Er bleibt nur stehen, damit die vorhandenen
    # Rohfilme noch verarbeitet werden koennen — fuer neue Aufnahmen
    # ist er die falsche Wahl (siehe oben).
    SCHLUESSEL="colorkey=0x020202:0.06:0.03"
    DESPILL=""
    ;;
  *)
    SCHLUESSEL="chromakey=$GRUND:0.30:0.10"
    DESPILL=",despill=type=green:mix=0.5:expand=0"
    ;;
esac
echo "Hintergrund: $GRUND  ->  $SCHLUESSEL$DESPILL"

"$FF" -hide_banner -loglevel error -y -i "$ROH" \
  -vf "scale=360:636,format=rgba,${SCHLUESSEL}${DESPILL},format=yuva420p" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf 32 -an \
  "$ZIEL/$NAME.webm"

# Nachbehandlung: Loecher schliessen, loses Zeug wegwerfen, Rand
# weich rechnen, und die Figur auf die Masse des Standbilds ziehen.
# Das ist derselbe Weg wie bei den vorhandenen Filmen.
python3 "$(dirname "$0")/tutorfilm-saeubern.py" "$NAME" || true

echo "fertig: $ZIEL/$NAME.webm  und  $ZIEL/$NAME-maske.mp4"
ls -la "$ZIEL/$NAME.webm" "$ZIEL/$NAME-maske.mp4"
