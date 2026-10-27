#!/bin/bash
# Vorher/Nachher 886: alle Bedingungen nacheinander (eine Chromium-Reihe), fortsetzbar über die JSONL-Dateien
V=/tmp/claude-0/-home-user-Deutsch-Mit-Xander/3dee9a82-acfe-58e0-bbb5-49b0760fb918/scratchpad/l886/vornach
G=/tmp/claude-0/-home-user-Deutsch-Mit-Xander/3dee9a82-acfe-58e0-bbb5-49b0760fb918/scratchpad/l886/grund
FOTO=/tmp/claude-0/-home-user-Deutsch-Mit-Xander/3dee9a82-acfe-58e0-bbb5-49b0760fb918/scratchpad/foto/original/9ob2nzt2.jpeg
LAEUFE=${LAEUFE:-10}
export TMPDIR=/tmp/claude-0/t886
mkdir -p $TMPDIR
cd $V
for cfg in ${REIHE:-"4g:gast:0" "4g:mitglied:0" "3g:gast:0" "3g:mitglied:0" "4g:gast:5000" "4g:mitglied:5000" "3g:gast:5000" "3g:mitglied:5000"}; do
  IFS=: read netz konto tipp <<< "$cfg"
  name=$netz-$konto-$tipp
  if grep -q '"typ":"fertig"' $V/$name.jsonl 2>/dev/null; then echo "$(date +%T) $name schon fertig"; continue; fi
  for versuch in 1 2 3; do
    frei=$(df --output=avail -BG / | tail -1 | tr -dc 0-9)
    if [ "$frei" -lt 3 ]; then echo "$(date +%T) Platte knapp ($frei G) – Abbruch"; exit 3; fi
    find $TMPDIR -maxdepth 1 -name 'dma-mess-profil-*' -mmin +120 -exec rm -rf {} + 2>/dev/null
    echo "$(date +%T) $name Versuch $versuch (frei ${frei}G, Last $(cut -d' ' -f1-3 /proc/loadavg))"
    node mess.js $netz --staende 886=$G/886,885=$G/885,884=$G/884,886b=$G/886 --konto $konto --tipp-nach $tipp --foto $FOTO \
      --laeufe $LAEUFE --arten kalt,warm,wieder,sw --jsonl $V/$name.jsonl --json $V/$name.json --leise >> $V/$name.log 2>&1
    rc=$?
    echo "$(date +%T) $name Ende rc=$rc"
    if [ $rc -eq 0 ] || [ $rc -eq 1 ]; then echo '{"typ":"fertig","rc":'$rc'}' >> $V/$name.jsonl; break; fi
  done
done
echo "$(date +%T) Reihe fertig"
