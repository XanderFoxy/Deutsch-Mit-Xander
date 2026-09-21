#!/bin/bash
# =====================================================================
# DEN STUMMEN VORLAUF VON GERÄUSCHDATEIEN ABSCHNEIDEN
# ---------------------------------------------------------------------
# WARUM ES DIESES WERKZEUG GIBT:
#
# XANDER: „Das Schmerzgeräusch nach dem Ohrfeigen-Klatschgeräusch kommt
# viel zu spät. Das muss in dem Moment, wenn es aufprallt, schon weh tun
# und hörbar sein." Und: „Bei der Zwille hört man vorher schon das
# Schmerzgeräusch, bevor die Zwille überhaupt losschießt."
#
# Im Code standen die Zeitpunkte richtig — der Klatsch bei 730 ms, der
# Schmerzlaut 200 ms später. Gemessen hatte die Datei aber einen
# STUMMEN VORLAUF: billardstoss 0,83 s, peitsche2 0,32 s, ohrfeige
# 0,25 s. Ein Ton, der bei 730 ms angesetzt wird und erst nach 250 ms
# Stille anfängt, ist in Wirklichkeit bei 980 ms. So verschiebt sich
# alles, und keine Zeitangabe im Code stimmt mehr.
#
# Deshalb wird der Vorlauf hier EINMAL abgeschnitten, und zwar an der
# Datei. Dann heisst „bei 730 ms" auch wirklich 730 ms.
#
#   bash werkzeug/ton-vorlauf-kappen.sh            # zeigt nur an
#   bash werkzeug/ton-vorlauf-kappen.sh --machen   # schneidet wirklich
#
# NACHGEMESSEN: mit -45 dB blieb „zwille" unentdeckt — die Datei ist
# dort 1,52 s lang zwar unhoerbar, aber nicht digital still (ein ganz
# leises Grundrauschen liegt darunter). Deshalb -38 dB: das ist immer
# noch sehr leise, faengt aber genau diese Faelle. Der Schwellwert
# laesst sich setzen:  SCHWELLE=-42dB bash werkzeug/ton-vorlauf-kappen.sh
# =====================================================================
set -u
FF=${FFMPEG:-/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg}
SCHWELLE=${SCHWELLE:--38dB}
WURZEL="$(cd "$(dirname "$0")/.." && pwd)"
MACHEN=0
[ "${1:-}" = "--machen" ] && MACHEN=1
# Ab dieser Länge lohnt das Schneiden. Darunter hört man es nicht.
GRENZE=0.12

cd "$WURZEL" || exit 1
for f in ton/*.opus; do
  n=$(basename "$f" .opus)
  d1=$("$FF" -hide_banner -i "$f" 2>&1 | grep Duration | sed 's/.*Duration: 00:00:\([0-9.]*\).*/\1/')
  "$FF" -hide_banner -loglevel error -i "$f" \
     -af "silenceremove=start_periods=1:start_threshold=${SCHWELLE}:start_silence=0" \
     -y /tmp/tonkappen.wav 2>/dev/null || continue
  d2=$("$FF" -hide_banner -i /tmp/tonkappen.wav 2>&1 | grep Duration | sed 's/.*Duration: 00:00:\([0-9.]*\).*/\1/')
  v=$(awk -v a="$d1" -v b="$d2" 'BEGIN{printf "%.3f", a-b}')
  gross=$(awk -v v="$v" -v g="$GRENZE" 'BEGIN{print (v>=g)?1:0}')
  # Eine Datei, die NUR aus Stille besteht, darf nicht gekappt werden —
  # sonst bleibt nichts übrig. Die muss neu aufgenommen werden.
  leer=$(awk -v b="$d2" 'BEGIN{print (b<0.15)?1:0}')
  [ "$gross" = "1" ] || continue
  if [ "$leer" = "1" ]; then
    echo "LEER  $n — die Datei ist ganz still, sie muss neu aufgenommen werden"
    continue
  fi
  if [ "$MACHEN" = "1" ]; then
    # Die Zieldatei braucht die RICHTIGE Endung: ffmpeg waehlt das
    # Format danach aus. „name.opus.neu" kennt es nicht, und dann
    # entsteht gar keine Datei — das war beim ersten Versuch so.
    "$FF" -hide_banner -loglevel error -i "$f" \
      -af "silenceremove=start_periods=1:start_threshold=${SCHWELLE}:start_silence=0,loudnorm=I=-18:TP=-2:LRA=11" \
      -c:a libopus -b:a 24k -ac 1 -ar 24000 -y /tmp/tonkappen-neu.opus 2>/dev/null || continue
    "$FF" -hide_banner -loglevel error -i "ton/$n.m4a" \
      -af "silenceremove=start_periods=1:start_threshold=${SCHWELLE}:start_silence=0,loudnorm=I=-18:TP=-2:LRA=11" \
      -c:a aac -b:a 40k -ac 1 -ar 24000 -y /tmp/tonkappen-neu.m4a 2>/dev/null || continue
    mv /tmp/tonkappen-neu.opus "ton/$n.opus"
    mv /tmp/tonkappen-neu.m4a "ton/$n.m4a"
    echo "GEKAPPT  $n  -$v s"
  else
    echo "vorn still  $n  $v s"
  fi
done
