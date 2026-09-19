#!/bin/bash
# =====================================================================
# ALLE SONDEN AUF EINMAL — MIT EINEM URTEIL, DEM MAN TRAUEN KANN
# ---------------------------------------------------------------------
# Warum es dieses Werkzeug gibt:
#
# 1. Zwei Sonden waren KAPUTT, ohne dass es jemandem aufgefallen ist —
#    eine brach sogar mit einem Fehler ab. Sie liefen einzeln nur dann,
#    wenn ich gerade an ihrer Ecke gearbeitet habe. Eine Sammlung von
#    Sonden, die nie zusammen laufen, ist keine Sammlung, sondern ein
#    Haufen.
#
# 2. Mein erster Sammel-Durchlauf hat dann eine GRÜNE Sonde als rot
#    gemeldet: Er suchte im Text nach „FEHL" — und diese vier
#    Buchstaben stecken auch in „BEFEHL". Ein Prüfwerkzeug, das
#    falschen Alarm schlägt, ist schlimmer als keines: Beim dritten
#    Fehlalarm schaut niemand mehr hin.
#
# Deshalb entscheidet hier in erster Linie der RÜCKGABEWERT (0 = gut),
# und die Textsuche achtet auf Wortgrenzen: „FEHL " am Zeilenanfang,
# das rote Kreuz, „N Abweichung(en)". „Befehl" trifft das nicht mehr.
#
# Aufruf:  bash werkzeug/alle-pruefen.sh
#          bash werkzeug/alle-pruefen.sh note     (nur Sonden mit „note“)
# =====================================================================
cd "$(dirname "$0")/.." || exit 1
muster="${1:-}"
gruen=0; rot=0; namen=""
for f in werkzeug/pruefe-*.js; do
  n=$(basename "$f" .js)
  [ -n "$muster" ] && [[ "$n" != *"$muster"* ]] && continue
  # ACHTUNG: erst laufen lassen, DANN filtern. Stuende hier eine Pipe,
  # laese $? den Rueckgabewert von grep — und der sagt nur, ob grep
  # etwas gefunden hat, nicht ob die Sonde gut war. Genau daran ist
  # der erste Entwurf gescheitert: eine stumme Sonde galt als rot,
  # eine abgestuerzte als gruen.
  aus=$(timeout 120 node "$f" 2>&1)
  code=$?
  aus=$(printf '%s' "$aus" | grep -v "agent-proxy")
  # Wortgenau: nur echte Meldungen zaehlen, nicht „Befehl“.
  if [ $code -ne 0 ] \
     || echo "$aus" | grep -qE '(^|[^A-Za-zÄÖÜäöü])FEHL($|[^A-Za-zÄÖÜäöü])' \
     || echo "$aus" | grep -q '❌' \
     || echo "$aus" | grep -qE '[0-9]+ Abweichung'; then
    rot=$((rot+1)); namen="$namen $n"
    printf 'ROT   %-32s %s\n' "$n" "$(echo "$aus" | grep -v '^[[:space:]]*$' | tail -1 | cut -c1-60)"
    echo "$aus" | grep -E '(^|[^A-Za-zÄÖÜäöü])FEHL($|[^A-Za-zÄÖÜäöü])|❌' | head -4 | sed 's/^/        /'
  else
    gruen=$((gruen+1))
    printf 'ok    %-32s %s\n' "$n" "$(echo "$aus" | grep -v '^[[:space:]]*$' | tail -1 | cut -c1-58)"
  fi
done
echo
echo "  $gruen grün, $rot rot${namen:+ —$namen}"
[ $rot -eq 0 ] || exit 1
