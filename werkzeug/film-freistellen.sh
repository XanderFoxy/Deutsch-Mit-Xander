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
if [ "$ART" = "schwarz" ]; then
  SCHLUESSEL="colorkey=0x000000:0.22:0.10"
  ENTFAERBEN=""
else
  SCHLUESSEL="chromakey=0x00B140:0.20:0.06"
  ENTFAERBEN=",despill=type=green:mix=0.6:expand=0.3"
fi
# Kanten weich machen: sonst treppt der Umriss.
KETTE="format=rgba,${SCHLUESSEL}${ENTFAERBEN},format=yuva420p"

echo "1/4  freistellen (${ART}) …"
"$FF" -y -hide_banner -loglevel error -i "$QUELLE" \
  -vf "$KETTE" -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 \
  -b:v 0 -crf 34 -row-mt 1 -an "$ZIEL/$NAME.webm"

echo "2/4  Safari-Fassung (Bild und Maske nebeneinander) …"
"$FF" -y -hide_banner -loglevel error -i "$QUELLE" \
  -filter_complex "[0:v]${KETTE},split=2[a][b];\
[a]format=yuv420p[bild];\
[b]alphaextract,format=yuv420p[maske];\
[bild][maske]hstack=inputs=2,format=yuv420p" \
  -c:v libx264 -preset slow -crf 24 -movflags +faststart -an "$ZIEL/$NAME-maske.mp4"

echo "3/4  Vorschaubild …"
"$FF" -y -hide_banner -loglevel error -i "$QUELLE" \
  -vf "${KETTE},scale=480:-2" -frames:v 1 -q:v 4 "$ZIEL/$NAME.jpg"

echo "4/4  Maße festhalten …"
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

echo
ls -la "$ZIEL/$NAME".* | awk '{printf "     %-34s %8.0f kB\n", $9, $5/1024}'
echo
echo "Fertig. Im Klassenzimmer:  /film $NAME"
