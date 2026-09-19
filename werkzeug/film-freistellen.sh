#!/bin/bash
# =====================================================================
# EIN VIDEO FREISTELLEN — AUS GRÜN ODER SCHWARZ WIRD DURCHSICHTIG
# ---------------------------------------------------------------------
# GEWÜNSCHT: „Wie machen die das bei TikTok, dass da ein Löwe durchs
# Bild rennt und das einfach nur über dem Chat liegt?"
#
# Genau so: bei TikTok liegt eine Abspieldatei mit Durchsichtigkeit
# über der Seite. Das Telefon rechnet nichts, es spielt nur ab.
#
# Keine der Bild-KIs liefert Durchsichtigkeit. Das muss sie auch
# nicht: man lässt das Tier vor einem satten Grün (oder vor Schwarz)
# erzeugen und schneidet die Farbe hier heraus. Heraus kommt ein
# WebM mit Alphakanal — das legt der Browser transparent über alles.
#
# Für Safari, das kein WebM mit Alpha kann, entsteht daneben eine
# zweite Datei: das Bild und seine Maske nebeneinander in EINEM MP4.
# Die Seite setzt beides wieder zusammen. Ohne diesen zweiten Weg
# sähen iPhone-Leute einen grünen Kasten — und das sind die meisten.
#
# AUFRUF
#   bash werkzeug/film-freistellen.sh <video> <name> [gruen|schwarz]
#   bash werkzeug/film-freistellen.sh ~/loewe.mp4 loewe gruen
#
# Heraus kommen in filme/:
#   <name>.webm       durchsichtig (Chrome, Firefox, Android)
#   <name>-maske.mp4  Bild + Maske nebeneinander (Safari, iPhone)
#   <name>.jpg        Standbild fürs Vorschaubild
#   <name>.json       Maße und Dauer, damit die Seite nicht raten muss
# =====================================================================
set -e
FF="/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg"
[ -x "$FF" ] || FF=$(command -v ffmpeg) || { echo "ffmpeg fehlt"; exit 1; }
FP="/tmp/claude-0/node_modules/ffmpeg-static/ffprobe"
[ -x "$FP" ] || FP=$(command -v ffprobe) || FP=""

QUELLE="$1"; NAME="$2"; ART="${3:-gruen}"
[ -f "$QUELLE" ] || { echo "Datei nicht gefunden: $QUELLE"; exit 1; }
[ -n "$NAME" ] || { echo "Kein Name angegeben."; exit 1; }
WURZEL="$(cd "$(dirname "$0")/.." && pwd)"
ZIEL="$WURZEL/filme"
mkdir -p "$ZIEL"

# Die Schlüsselfarbe. „despill" nimmt den grünen Saum aus dem Fell —
# ohne ihn hat jedes Haar einen giftgrünen Rand.
# WELCHES GRÜN GENAU? NICHT RATEN — MESSEN.
# Jede KI liefert einen anderen Grünton. Das erste Video von Grok
# hatte #11ea0c, mein Standardwert war #00B140 — das sind über
# vierzig Stufen Unterschied, und damit wäre der Rand fransig
# geworden. Deshalb wird die Farbe aus der linken oberen Ecke des
# ersten Bildes GELESEN. Wer es anders will, gibt sie als vierten
# Wert mit (z. B. 0x11EA0C).
if [ "$ART" = "schwarz" ]; then
  SCHLUESSEL="colorkey=0x000000:0.22:0.10"
  ENTFAERBEN=""
else
  FARBE="$4"
  if [ -z "$FARBE" ]; then
    ROH=$(mktemp)
    "$FF" -y -hide_banner -loglevel error -i "$QUELLE" \
      -vf "crop=8:8:4:4,scale=1:1" -frames:v 1 -f rawvideo -pix_fmt rgb24 "$ROH" 2>/dev/null || true
    if [ -s "$ROH" ]; then
      FARBE=$(od -An -tu1 -N3 "$ROH" | awk '{printf "0x%02X%02X%02X", $1, $2, $3}')
      echo "     gemessene Hintergrundfarbe: $FARBE"
    fi
    rm -f "$ROH"
  fi
  [ -n "$FARBE" ] || FARBE="0x00B140"
  SCHLUESSEL="chromakey=${FARBE}:0.22:0.08"
  ENTFAERBEN=",despill=type=green:mix=0.6:expand=0.3"
fi
# WIE GROSS? NICHT SO GROSS WIE DIE QUELLE.
# Der erste echte Film kam mit 720x1280 herein und ergab 11,6 MB.
# Das laedt auf einem Handy im Mobilfunk quaelend lange — und
# ueber einem Chat wird das Bild ohnehin auf Bildschirmbreite
# gezogen. 540 Punkte Breite sehen dort genauso aus und wiegen
# einen Bruchteil. Andere Breite als fuenfter Wert.
BREITE="${5:-540}"
VERKLEINERN=""
if [ "$BREITE" != "0" ]; then
  VERKLEINERN="scale='min(${BREITE},iw)':-2:flags=lanczos,"
fi
# Kanten weich machen: sonst treppt der Umriss.
KETTE="${VERKLEINERN}format=rgba,${SCHLUESSEL}${ENTFAERBEN},format=yuva420p"

echo "1/4  freistellen (${ART}) …"
"$FF" -y -hide_banner -loglevel error -i "$QUELLE" \
  -vf "$KETTE" -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 \
  -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 -an "$ZIEL/$NAME.webm"

echo "2/4  Safari-Fassung (Bild und Maske nebeneinander) …"
"$FF" -y -hide_banner -loglevel error -i "$QUELLE" \
  -filter_complex "[0:v]${KETTE},split=2[a][b];\
[a]format=yuv420p[bild];\
[b]alphaextract,format=yuv420p[maske];\
[bild][maske]hstack=inputs=2,format=yuv420p" \
  -c:v libx264 -preset slow -crf 28 -movflags +faststart -an "$ZIEL/$NAME-maske.mp4"

echo "3/4  Vorschaubild …"
"$FF" -y -hide_banner -loglevel error -i "$QUELLE" \
  -vf "${KETTE},scale=480:-2" -frames:v 1 -q:v 4 "$ZIEL/$NAME.jpg"

echo "4/5  Maße festhalten …"
# ffprobe liegt nicht überall daneben (ffmpeg-static bringt nur ffmpeg
# mit). Beim ersten Lauf standen deshalb Nullen in der Datei, und die
# Seite hätte die Größe raten müssen. ffmpeg selbst sagt es auch —
# es steht in seiner Startmeldung.
LESE=$("$FF" -hide_banner -i "$QUELLE" 2>&1 || true)
B=$(echo "$LESE" | grep -oE '[0-9]{2,5}x[0-9]{2,5}' | head -1 | cut -dx -f1)
H=$(echo "$LESE" | grep -oE '[0-9]{2,5}x[0-9]{2,5}' | head -1 | cut -dx -f2)
D=$(echo "$LESE" | grep -oE 'Duration: [0-9:.]+' | head -1 | sed 's/Duration: //' \
    | awk -F: '{printf "%.2f", $1*3600+$2*60+$3}')
[ -n "$B" ] || B=0; [ -n "$H" ] || H=0; [ -n "$D" ] || D=0
cat > "$ZIEL/$NAME.json" <<EOF
{ "name": "$NAME", "breite": ${B:-0}, "hoehe": ${H:-0}, "sekunden": ${D:-0},
  "webm": "filme/$NAME.webm", "maske": "filme/$NAME-maske.mp4",
  "bild": "filme/$NAME.jpg", "art": "$ART" }
EOF

# Die Tritte aus der Tonspur lesen — damit der Chat GENAU dann
# bebt, wenn der Fuss aufkommt, und nicht im Takt danebenwackelt.
echo "5/5  Stösse aus der Tonspur lesen …"
node "$WURZEL/werkzeug/stoesse-finden.js" "$QUELLE" "$ZIEL/$NAME.json" || true

echo
ls -la "$ZIEL/$NAME".* | awk '{printf "     %-34s %8.0f kB\n", $9, $5/1024}'
echo
echo "Fertig. Im Klassenzimmer:  /film $NAME"
