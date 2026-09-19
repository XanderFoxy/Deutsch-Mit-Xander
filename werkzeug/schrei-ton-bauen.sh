#!/bin/sh
# BAUT DEN SCHREI-TON — GERECHNET, NICHT AUFGENOMMEN.
# ---------------------------------------------------------------
# GEWUENSCHT, erste Runde: „Ein Sound-Effekt, der neutral dazu
# passt — egal was man schreit —, der Schall vermittelt oder wie
# ein Echo, aber so allgemein, dass es kein Wort widerspiegelt."
#
# GEWUENSCHT, jetzt: „Kannst du beim Schreien noch mehr Effekt
# draufmachen, also von der Stimme her, dass das wirklich wie ein
# Schreien klingt — ein bisschen mehr mit HALL, nicht nur Echo.
# Und vielleicht die Lautstaerke am Anfang so peaken, als wenn man
# wirklich bruellt, und der Rest verliert sich ein bisschen in der
# Hoehe, weil es dann abklingt, so wie ein Schrei in der Natur
# auch ist."
#
# DREI DINGE MACHEN DAS AUS, UND ALLE DREI SIND NACHGEBILDET:
#
# 1. DIE SPITZE AM ANFANG. Ein Ruf ist im ersten Moment am
#    lautesten und faellt dann. Also: Anstieg in 30 Millisekunden,
#    ein kurzer lauter Scheitel, danach ein langer logarithmischer
#    Abfall. Ein gleichmaessig lauter Ton klingt nach Sirene.
#
# 2. DIE HOEHE VERLIERT SICH. In der Natur werden hohe Frequenzen
#    von der Luft und von jeder Reflexion staerker geschluckt als
#    tiefe — ein Schrei wird beim Abklingen dumpfer. Ein Filter,
#    der sich mit der Zeit bewegt, gibt es hier nicht; also wird
#    der Klang in ZWEI Lagen gebaut: eine helle mit kurzer
#    Huellkurve und eine dunkle mit langer. Zusammen ergibt das
#    genau diesen Verlauf.
#
# 3. HALL STATT ECHO. Drei einzelne Echos hoert man als drei
#    Schlaege („Ruf … ruf … ruf") — das ist eine Schlucht, keine
#    Halle. Ein Hall ist eine DICHTE Wolke von Reflexionen.
#    Erzeugt wird sie hier, indem mehrere Echostufen hintereinander
#    geschaltet werden: jede vervielfacht die Anzahl der Taps, aus
#    4 mal 4 mal 3 werden achtundvierzig — und krumme Abstaende
#    sorgen dafuer, dass sie nicht aufeinanderfallen.
#
# NACHGEBESSERT: die Huellkurve lag zuerst VOR den Echos. Dadurch
# kamen die spaeten Reflexionen des lauten Anfangs in voller
# Staerke zurueck, und gemessen war der Ton bei 1,5 Sekunden wieder
# lauter als bei 1,0 — eine Welle statt eines Abklingens. Die
# grosse Huellkurve liegt jetzt HINTER dem Hall: erst der Raum,
# dann das Leiserwerden. So faellt alles zusammen ab, wie es soll.
#
# Aufruf:  sh werkzeug/schrei-ton-bauen.sh
FF=/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg
AUS=/home/user/Deutsch-Mit-Xander/ton

"$FF" -y -v error \
  -f lavfi -i "sine=frequency=196:duration=2.6:sample_rate=48000" \
  -f lavfi -i "sine=frequency=294:duration=2.6:sample_rate=48000" \
  -f lavfi -i "anoisesrc=duration=2.6:color=pink:amplitude=0.14:sample_rate=48000" \
  -filter_complex "\
   [0:a]volume=0.55[a]; \
   [1:a]volume=0.32[b]; \
   [2:a]volume=0.34[c]; \
   [a][b][c]amix=inputs=3:normalize=0,\
     equalizer=f=700:width_type=q:w=1.4:g=11, \
     equalizer=f=1150:width_type=q:w=1.6:g=8, \
     highpass=f=130,asplit=2[roh1][roh2]; \
   \
   [roh1]lowpass=f=1400, \
         afade=t=in:st=0:d=0.03:curve=exp, \
         afade=t=out:st=0.34:d=2.10:curve=log, \
         volume=1.0[dunkel]; \
   \
   [roh2]highpass=f=1300,lowpass=f=5200, \
         equalizer=f=2600:width_type=q:w=1.1:g=4, \
         afade=t=in:st=0:d=0.025:curve=exp, \
         afade=t=out:st=0.10:d=0.55:curve=log, \
         volume=1.25[hell]; \
   \
   [dunkel][hell]amix=inputs=2:normalize=0,\
     aecho=0.82:0.72:97|151|233|317:0.42|0.33|0.26|0.19,\
     aecho=0.88:0.62:431|619|787:0.30|0.22|0.15,\
     aecho=0.92:0.50:761|929:0.13|0.08,\
     lowpass=f=4600,\
     afade=t=out:st=0.45:d=2.10:curve=log,\
     loudnorm=I=-15:TP=-1.5:LRA=7[out]" \
  -map "[out]" -t 2.6 -c:a libopus -b:a 56k "$AUS/schrei.opus"

"$FF" -y -v error -i "$AUS/schrei.opus" -c:a aac -b:a 72k "$AUS/schrei.m4a"

ls -l "$AUS/schrei.opus" "$AUS/schrei.m4a"
