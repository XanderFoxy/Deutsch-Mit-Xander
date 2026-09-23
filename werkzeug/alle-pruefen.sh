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
  # WIE LANGE DARF EINE SONDE LAUFEN?
  # -------------------------------------------------------------------
  # 120 Sekunden reichen fuer fast alle. Zwei Sonden gehen aber ueber
  # ALLE Effekte und messen jeden bis zu seinem Ende — die
  # Strichlinien-Sonde braucht 122 Effekte mal 7,3 Sekunden, also rund
  # eine Viertelstunde. Mit dem alten festen Limit wurde sie nach zwei
  # Minuten abgeschossen und galt als ROT, obwohl sie nur noch nicht
  # fertig war. Eine Sammlung, in der die gruendlichste Sonde immer rot
  # ist, schaut sich niemand mehr an — genau der Fehler, vor dem oben
  # unter Punkt 2 gewarnt wird.
  # Deshalb haben die langen Sonden hier ihre eigene Frist. Wer eine
  # neue lange Sonde schreibt, traegt sie hier ein.
  # RUNDE 97 NACHGETRAGEN. NACHGEMESSEN, nicht geschaetzt: die
  # Betriebs-Sonde schafft 28 Effekte in 23 Minuten, also rund 49
  # Sekunden je Effekt (dreimal messen plus Aufbau) — 96 Effekte sind
  # damit gut 78 Minuten. Deshalb 5400 s; die Ebenen-Sonde misst nur
  # einmal je Effekt und ist in rund 35 Minuten durch (3600 s):
  # die beiden Sonden aus Runde 92 gehen
  # ebenfalls ueber ALLE 96 Effekte, die eine sogar dreimal
  # (ungestoert / Auffrischen / Neuzeichnen). Sie standen hier nicht
  # drin und wurden deshalb nach 120 Sekunden abgeschossen — im
  # Sammelbericht sahen sie aus wie abgestuerzt („Node.js v22..."),
  # dabei waren sie nur mitten in der Arbeit. Genau der Fehler, vor
  # dem oben unter Punkt 2 gewarnt wird.
  case "$n" in
    pruefe-runde87-strichlinien) frist=2400 ;;
    pruefe-runde92-betrieb)      frist=5400 ;;
    pruefe-runde92-grundebene)   frist=3600 ;;
    pruefe-platzdesign)          frist=600  ;;
    pruefe-jeder-befehl)         frist=600  ;;
    # RUNDE 98 — diese vier messen ueber mehrere Fensterbreiten oder
    # ueber mehrere Sekunden Animation; 120 s reichen ihnen nicht.
    pruefe-runde98-lesekopf)     frist=420  ;;
    pruefe-runde98-aufdecken)    frist=420  ;;
    pruefe-runde98-spraybild)    frist=420  ;;
    pruefe-runde98-gesichter)    frist=300  ;;
    # Diese faehrt 16 Fahrzeuge je zweimal ab (mit und ohne gemaltem
    # Weg) — gemessen 152 s, mit 120 s wurde sie mitten im Lauf
    # abgeschnitten und stand als ROT in der Liste, obwohl sie gruen
    # ist. Deshalb 420 s.
    pruefe-runde98-wegfahrzeuge) frist=420  ;;
    # Zehn Mario-Laeufe hintereinander, damit der Zufall nachzaehlbar
    # ist (Runde 98) — das dauert laenger als zwei Minuten.
    pruefe-runde88-mario)        frist=600  ;;
    pruefe-runde98-mario)        frist=600  ;;
    *)                           frist=120  ;;
  esac
  aus=$(timeout "$frist" node "$f" 2>&1)
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
