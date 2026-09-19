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
#   bash werkzeug/film-freistellen.sh <video> <name> [gruen|schwarz|szene] [farbe] [breite] [wirkung]
#   bash werkzeug/film-freistellen.sh ~/loewe.mp4 loewe gruen "" 480 glanz
#
# DER TON BLEIBT DRIN. Er wurde bis Fassung 330 weggeworfen (-an), und
# gemeldet wurde genau das: „man hoert nicht den Sound von den Videos,
# man hoert diesen Geschenk-Jubel von vorher." Jetzt wandert die
# Tonspur mit: Opus im WebM, AAC im MP4.
#
# WIRKUNG — was die Seite zu diesem Film dazuzeichnet. Nicht mehr bei
# jedem Film dasselbe: „mach gemessen an dem, was es darstellen soll,
# einen passenden Effekt zur Szene."
#   erde   Beben und Staub        (schwere Schritte: T-Rex)
#   glanz  warmer Schein, Funken  (Raubtier im Sprung: Loewe)
#   wind   Luftstreifen, Federn   (Flug: Adler)
#   dampf  Dampfwolken, Rattern   (Lokomotive)
#   keiner nur der Film
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
# DRITTE ART: „szene" — GAR NICHT FREISTELLEN.
# GEWÜNSCHT: „nicht unbedingt nur die Objekte oder Tiere, sondern
# mit Umgebung … hohe Palmen, die wackeln, mit Kameraführung, mit
# Effekt, in epischem Ausmass."
# Das geht mit einem Greenscreen NICHT zusammen: was man wegschneidet,
# ist genau die Umgebung. Deshalb gibt es diese zweite Sorte Film —
# das volle Bild, ohne Maske, das die Seite als Kinobild über den
# Chat legt (dunkler Grund, weiche Kante, runde Ecken). Freigestellt
# bleibt, was ÜBER dem Chat laufen soll; als Szene kommt, was eine
# WELT zeigen soll.
# VIERTE ART: „dunkel" — DER CHAT SCHEINT DURCH.
# GEWÜNSCHT: „Bei dem Raumschiff ist viel Schwarz dabei. Vielleicht
# kann man an der Stelle, wo es am Planeten mit den Ringen vorbei
# fliegt, ein bisschen den Chat durchscheinen lassen, dass man das
# mehr verbindet, mehr eins sein lässt."
# Genau das geht bei einer nächtlichen Szene: die Deckung wird aus
# der HELLIGKEIT genommen. Wo das Bild schwarz ist, ist es
# durchsichtig; wo es leuchtet — Sterne, Triebwerk, Planetenringe,
# Bullaugen — steht es voll da. Kein Greenscreen nötig, und es
# verschmilzt von selbst mit dem Chat, weil Dunkelheit eben nichts
# verdeckt. Fuer Weltraum und Unterwasser ist das die richtige Art.
if [ "$ART" = "dunkel" ]; then
  SCHLUESSEL="lumakey=threshold=${SCHWELLE:-0.055}:tolerance=${TOLERANZ:-0.20}:softness=${WEICHE:-0.35}"
  ENTFAERBEN=""
elif [ "$ART" = "szene" ]; then
  SCHLUESSEL=""
  ENTFAERBEN=""
elif [ "$ART" = "schwarz" ]; then
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
  # WIE WEIT DARF DIE FARBE ABWEICHEN? 0,16 — NICHT 0,22.
  # Gemessen an der Dampflok: bei 0,22 blieb von ihr nur ein Schatten
  # uebrig (1 % voll deckend, 30 % halb durchsichtig), bei 0,16 stand
  # sie satt da (38 % voll). Der Grund steckt in chromakey selbst: es
  # vergleicht nur die FARBIGKEIT, nicht die Helligkeit. Alles Graue,
  # Schwarze und Weisse liegt damit genau 0,227 vom Gruen entfernt —
  # eine schwarze Lok, ein weisser Adlerkopf, eine Rauchwolke also
  # knapp innerhalb von 0,22 + 0,08 und damit halb weggeschnitten.
  # 0,16 + 0,04 bleibt sicher darunter. Bei Loewe, T-Rex und Adler
  # aendert sich dadurch nichts (gemessen: 0,1 Prozentpunkte), und
  # gruene Reste bleiben bei allen fuenf Filmen bei 0,00 %.
  SCHLUESSEL="chromakey=${FARBE}:${AEHNLICH:-0.16}:${WEICH:-0.04}"
  # WIE STARK ENTGRUENEN? Beim Kaetzchen lag deutlich Gruen im
  # hellen Fell („mit dem Gruen, was auf dem Fell ist, koennte das
  # besser sein"). Flauschiges helles Fell schluckt besonders viel
  # Streulicht vom Hintergrund. Deshalb einstellbar: ENTGRUEN
  # (wieviel herausgerechnet wird) und AUSDEHNEN (wie weit ueber
  # den Umriss hinaus).
  ENTFAERBEN=",despill=type=green:mix=${ENTGRUEN:-0.6}:expand=${AUSDEHNEN:-0.3}"
fi
# WIE GROSS? NICHT SO GROSS WIE DIE QUELLE.
# Der erste echte Film kam mit 720x1280 herein und ergab 11,6 MB.
# Das laedt auf einem Handy im Mobilfunk quaelend lange — und
# ueber einem Chat wird das Bild ohnehin auf Bildschirmbreite
# gezogen. 400 Punkte Breite entsprechen etwa der Breite eines
# Telefons; mehr sieht dort niemand. Gemessen am Loewen, dem
# schwersten der fuenf: 540 Punkte/crf 38 = 5,7 MB, 480/crf 40 =
# 4,1 MB, 400/crf 46 = rund 2,0 MB. Andere Breite als fuenfter
# Wert, andere Guete ueber GUETE=…
# AUS 16:9 EIN 9:16 MACHEN.
# GEWÜNSCHT: „Versuch mal bei dem Weihnachtsvideo das Seitenverhältnis
# auf 9:16 zu machen, das müsste technisch gehen, weil der Schlitten
# sehr klein angeflogen kommt und immer mittig bleibt."
# Stimmt — nachgesehen mit einem Kontaktbogen alle 2,5 Sekunden: der
# Schlitten bleibt über die ganzen 15 Sekunden in der Mitte, und der
# Schluss mit dem Mond sitzt ohnehin zentriert. Also wird die Mitte
# herausgeschnitten: aus 1280x720 werden 405x720, und das ist immer
# noch breiter als die 400 Punkte, auf die wir sowieso verkleinern.
# Mit SCHNITT=1 einschalten.
ZUSCHNITT=""
if [ "${SCHNITT:-0}" != "0" ]; then
  ZUSCHNITT="crop=ih*9/16:ih:(iw-ih*9/16)/2:0,"
fi
BREITE="${5:-400}"
WIRKUNG="${6:-keiner}"
VERKLEINERN=""
if [ "$BREITE" != "0" ]; then
  VERKLEINERN="scale='min(${BREITE},iw)':-2:flags=lanczos,"
fi
# WENN DOCH BODEN IM BILD IST.
# Die Regel im Prompt lautet „kein Boden" — die Bild-KI haelt sich
# nicht immer daran. Beim Loewen kippt das Video nach etwa acht
# Sekunden in eine echte Szene mit einem Felsen: gemessen sind die
# untersten elf Prozent der Bildhoehe voll deckend, und das laege
# als harter Balken ueber dem Chat. BODEN=0.14 laesst die Deckung
# auf den untersten vierzehn Prozent sanft auf null auslaufen —
# der Felsen loest sich auf, die Pfoten (bei 80 bis 85 Prozent)
# bleiben unangetastet. Ohne BODEN aendert sich nichts.
BODEN="${BODEN:-0}"
AUSLAUF=""
if [ "$BODEN" != "0" ]; then
  AUSLAUF=",geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='alpha(X,Y)*min(1,(H-Y)/(H*${BODEN}))'"
fi
# Kanten weich machen: sonst treppt der Umriss.
if [ "$ART" = "szene" ]; then
  KETTE="${ZUSCHNITT}${VERKLEINERN}format=yuv420p"
else
  KETTE="${ZUSCHNITT}${VERKLEINERN}format=rgba,${SCHLUESSEL}${ENTFAERBEN}${AUSLAUF},format=yuva420p"
fi

# GLEICH LAUT — GEMELDET: „Der Ton ist immer ein bisschen
# inkonsistent, am Anfang scheint er da zu sein, dann wird er
# schwaecher oder duenner."
# Gemessen stimmt das, und es liegt an den Quellen: der T-Rex
# kommt mit -15,1 dB mittlerer Lautheit herein, der Loewe mit
# -14,0, die Lok mit -14,5, Adler und zweite Lok mit -19,5. Das
# sind ueber fuenf Stufen Unterschied zwischen zwei Geschenken.
# loudnorm rechnet jeden Film auf dieselbe Lautheit (EBU R128,
# -16 LUFS) und haelt auch INNERHALB eines Films die Schwankung
# klein. Die Spitze bleibt unter -1,5 dB, damit nichts zerrt.
# ZWEISTUFIG, NICHT EINSTUFIG — sonst pumpt es.
# GEMELDET: „Der Sound kann noch ein bisschen verbessert werden, hier
# sind glaube ich immer noch so Ausdehnungen drin."
# Genau das macht loudnorm in einem Durchgang: es kennt den Film noch
# nicht und regelt WÄHREND des Abspielens nach. Bei einem Brüllen hört
# man, wie es leiser dreht und danach wieder auf — das ist die
# „Ausdehnung". Zweistufig wird zuerst der ganze Film GEMESSEN, und im
# zweiten Durchgang liegt eine feste, lineare Verstärkung an: kein
# Nachregeln, keine Pumperei.
# WIE LAUT? -14 LUFS, NICHT -16.
# GEMELDET: „Achte darauf, dass der Ton überall gut zu hören ist, weil
# das bis jetzt immer noch nicht der Fall ist."
# -16 ist der Wert für Podcasts, die man ungestört hört. Ein Geschenk
# im Chat konkurriert mit allem anderen auf dem Telefon; TikTok und
# Instagram fahren ihre Filme auf etwa -14. Dahinter steht ein
# Begrenzer, damit die zwei Stufen mehr nicht ins Zerren laufen.
TONKETTE="loudnorm=I=-14:TP=-1.0:LRA=9"
MESS=$("$FF" -hide_banner -i "$QUELLE" -af "loudnorm=I=-14:TP=-1.0:LRA=9:print_format=json" \
  -f null - 2>&1 | sed -n '/^{/,/^}/p')
if [ -n "$MESS" ]; then
  W=$(printf '%s' "$MESS" | node -e '
    let t=""; process.stdin.on("data",(d)=>t+=d).on("end",()=>{
      try {
        const j = JSON.parse(t);
        /* Misst ffmpeg „-inf" (ein Film ganz ohne Ton), dann lieber
           gar nichts anwenden als eine unendliche Verstaerkung. */
        const z = [j.input_i, j.input_tp, j.input_lra, j.input_thresh];
        if (z.some((v) => !isFinite(Number(v)))) return;
        process.stdout.write("measured_I=" + j.input_i
          + ":measured_TP=" + j.input_tp
          + ":measured_LRA=" + j.input_lra
          + ":measured_thresh=" + j.input_thresh
          + ":offset=" + (j.target_offset || 0) + ":linear=true:print_format=summary");
      } catch (e) {}
    });')
  if [ -n "$W" ]; then
    TONKETTE="loudnorm=I=-14:TP=-1.0:LRA=9:${W},alimiter=limit=0.94:level=disabled"
    echo "     Ton gemessen und fest eingestellt (zweistufig)"
  fi
fi

echo "1/4  freistellen (${ART}) …"
if [ "$ART" = "szene" ]; then
  "$FF" -y -hide_banner -loglevel error -i "$QUELLE" \
    -vf "$KETTE" -c:v libvpx-vp9 -pix_fmt yuv420p \
    -b:v 0 -crf "${GUETE:-40}" -row-mt 1 -deadline good -cpu-used 2 \
    -af "$TONKETTE" -c:a libopus -b:a 72k -ac 2 "$ZIEL/$NAME.webm"
else
  "$FF" -y -hide_banner -loglevel error -i "$QUELLE" \
    -vf "$KETTE" -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 \
    -b:v 0 -crf "${GUETE:-46}" -row-mt 1 -deadline good -cpu-used 2 \
    -af "$TONKETTE" -c:a libopus -b:a 72k -ac 2 "$ZIEL/$NAME.webm"
fi

# -map 0:a:0? ist kein Zierrat: sobald filter_complex im Spiel ist,
# sucht ffmpeg sich KEINE Tonspur mehr von selbst — sie faellt
# stillschweigend weg. Genau so waere der Ton auf dem iPhone wieder
# verschwunden, waehrend er auf Android da ist.
echo "2/4  Safari-Fassung (Bild und Maske nebeneinander) …"
if [ "$ART" = "szene" ]; then
  echo "     entfaellt — ein Szenenfilm hat nichts freizustellen."
else
"$FF" -y -hide_banner -loglevel error -i "$QUELLE" \
  -filter_complex "[0:v]${KETTE},split=2[a][b];\
[a]format=yuv420p[bild];\
[b]alphaextract,format=yuv420p[maske];\
[bild][maske]hstack=inputs=2,format=yuv420p" \
  -map 0:a:0? -c:v libx264 -preset slow -crf "${GUETE_MASKE:-32}" -movflags +faststart \
  -af "$TONKETTE" -c:a aac -b:a 80k -ac 2 "$ZIEL/$NAME-maske.mp4"
fi

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
  "bild": "filme/$NAME.jpg", "art": "$ART", "wirkung": "$WIRKUNG", "ton": true }
EOF

# Alle vorhandenen Filme in EINE Liste schreiben. Auf GitHub Pages
# kann die Seite keinen Ordner durchblaettern — ohne diese Liste
# muesste man raten, wie ein Film heisst. „/film" ohne Namen zeigt sie.
node - "$ZIEL" <<'JSNODE'
const fs = require("fs"), pfad = process.argv[2];
/* Namen mit zwei Unterstrichen vorn sind Sondenfilme (pruefe-film-
   freistellen.js baut sich einen). Die gehoeren nicht in die Liste —
   sonst steht im Chat ein Film, den es nach der Pruefung nicht mehr
   gibt. Genau das ist einmal passiert. */
const filme = fs.readdirSync(pfad)
  .filter((f) => /\.json$/.test(f) && f !== "liste.json" && f.slice(0, 2) !== "__")
  .map((f) => { try { return JSON.parse(fs.readFileSync(pfad + "/" + f, "utf8")); } catch (e) { return null; } })
  .filter(Boolean)
  .map((d) => ({ name: d.name, sekunden: d.sekunden, bild: d.bild, wirkung: d.wirkung || "keiner" }))
  .sort((a, b) => a.name.localeCompare(b.name, "de"));
fs.writeFileSync(pfad + "/liste.json", JSON.stringify({ filme: filme }, null, 1) + "\n");
console.log("     Liste: " + filme.map((f) => f.name).join(", "));
JSNODE

# Die Tritte aus der Tonspur lesen — damit der Chat GENAU dann
# bebt, wenn der Fuss aufkommt, und nicht im Takt danebenwackelt.
echo "5/5  Stösse aus der Tonspur lesen …"
node "$WURZEL/werkzeug/stoesse-finden.js" "$QUELLE" "$ZIEL/$NAME.json" || true

echo
ls -la "$ZIEL/$NAME".* | awk '{printf "     %-34s %8.0f kB\n", $9, $5/1024}'
echo
echo "Fertig. Im Klassenzimmer:  /film $NAME"
