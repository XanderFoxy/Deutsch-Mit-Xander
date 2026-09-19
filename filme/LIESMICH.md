# Filme — die echten Animationen

Hier liegen freigestellte Videos: Bilder ohne Hintergrund, die sich über
den Chat legen lassen. Das ist dasselbe Verfahren, mit dem TikTok seine
grossen Geschenke macht — dort liegt eine Abspieldatei mit
Durchsichtigkeit über der Seite, und das Telefon rechnet nichts, es
spielt nur ab.

## Drei Sorten Film

**Freigestellt** (`gruen`) — liegt durchsichtig über dem Chat, man liest
weiter mit. Dafür muss der Hintergrund flächig grün sein; Umgebung geht
nur, soweit sie am Motiv hängt (Staub, Funken, Tropfen).

**Dunkel** (`dunkel`) — für Nacht, Weltraum und Tiefsee. Die Deckung
kommt aus der **Helligkeit**: wo das Bild schwarz ist, ist es
durchsichtig und der Chat scheint hindurch; wo es leuchtet — Sterne,
Triebwerk, Bullaugen, Mond — steht es voll da. Kein Greenscreen nötig,
und es verschmilzt von selbst mit der Seite, weil Dunkelheit nichts
verdeckt. Gemessen am U-Boot: 79 % durchsichtig, 16 % halbdurchsichtig,
5 % voll.

**Szene** (`szene`) — das volle Bild mit Welt, Boden, Horizont und
Kamerafahrt. Wird gar nicht freigestellt, sondern als Kinobild über den
Chat gelegt: dunkler Grund ringsum, wolkiger Rand. Keine Maskendatei,
kein WebGL, überall derselbe Weg.

Fertige Prompts für beides stehen in `PROMPTS.md` — 30 Stück.

Nachgemessen am 19. September: ein Szenenfilm läuft im Browser mit
400×712, dunklem Grund dahinter, 22 px runden Ecken, weicher Maske am
Rand und nicht stummgeschaltet — ohne Maskendatei und ohne WebGL.
`werkzeug/pruefe-film-freistellen.js` prüft die Sorte bei jedem Lauf
mit.

## Der Ton pumpt nicht

`loudnorm` läuft **zweistufig**: erst wird der ganze Film gemessen, dann
liegt eine feste lineare Verstärkung an. Einstufig regelt es während des
Abspielens nach — bei einem Brüllen hört man, wie es leiser dreht und
danach wieder auf. Gemessen über die fünf Filme: Streuung der mittleren
Lautheit **0,9 dB** (einstufig 1,7 dB, ungeregelt 5,5 dB).

## Der wolkige Rand

`dunkel`- und `szene`-Filme laufen am Rand nicht als Ellipse aus,
sondern mit einer gerechneten Maske (`werkzeug/bau-wolkenrand.js` →
`filme/rand-wolke.png`): ein weicher Verlauf, dessen Radius von
fraktalem Rauschen verschoben wird. Gemessen schwankt die Kante um
**8,5 %** im Radius — eine Ellipse hätte 0 %, und genau die erkennt
man sofort als Ellipse.

## Aus 16:9 ein 9:16 machen

`SCHNITT=1` schneidet die Mitte heraus. Beim Weihnachtsschlitten
geprüft, Kontaktbogen alle 2,5 Sekunden: der Schlitten bleibt über die
ganzen 15 Sekunden mittig, der Schluss mit dem Mond sitzt ohnehin
zentriert. Aus 1280×720 werden 405×720 — immer noch breiter als die
400 Punkte, auf die verkleinert wird.

## Es sieht nicht nach Video aus

**Es wird gar kein Video mehr gezeigt.** Das Format ist nicht der
Punkt — der Vollbildknopf gehört zum `<video>`-Element, nicht zur
Datei; ein WebM oder GIF ändert daran nichts. Also hängt das Video
unsichtbar bei `left: -9999px` und liefert nur Bilder und Ton, und zu
sehen ist ein `<canvas>`. Ein Canvas hat keine Bedienleiste, kein
Vollbild, kein Bild-im-Bild, kein „Video speichern unter" — für den
Browser ist es ein Bild, das sich bewegt. Der Alphakanal überlebt das:
`drawImage` überträgt ihn aus einem VP9-WebM mit `yuva420p` mit.

Zusätzlich, doppelt genäht: kein `controls`,
`disablePictureInPicture`, `controlslist` ohne Vollbild und
Herunterladen, `x-webkit-airplay="deny"`, `pointer-events: none` auf
der ganzen Schicht und ein Stilblatt gegen die WebKit-Leiste. Der
YouTube-Rahmen im Musikspieler hat `fs=0` und kein `allowfullscreen`
mehr — mehr geht dort nicht, es ist YouTubes eigener Spieler in einem
fremden Rahmen.

## Wie ein Film hier hereinkommt

1. **Video erzeugen** — in einer beliebigen App (Grok Imagine, Leonardo,
   ElevenLabs, Sora …). Zwei Regeln entscheiden über alles:
   * **9:16**, hochkant.
   * **Kein Boden.** Das Tier darf nicht auf einer Wiese stehen, sondern
     muss frei vor einem satten, gleichmässigen Grün sein. Sobald Boden
     im Bild ist, lässt er sich nicht sauber wegschneiden.

   Der feste Schluss für jeden Prompt — er macht den Look überall gleich:

   > shot on a professional film camera, 50mm lens, dramatic cinematic key
   > light from the front left, crisp fur and skin detail, subject fully in
   > frame from head to feet, vertical 9:16 framing, the entire background
   > is one flat uniform saturated chroma key green filling the whole frame
   > behind and below the subject, no ground, no horizon, no shadow on the
   > background, no props, no text, no logo, no vignette

2. **Freistellen** — eine Zeile:

   ```
   bash werkzeug/film-freistellen.sh ~/loewe.mp4 loewe gruen
   ```

   War der Hintergrund schwarz statt grün, `schwarz` statt `gruen`.

3. Heraus kommen vier Dateien (und `liste.json` wird mitgeschrieben):

   | Datei | wofür |
   |---|---|
   | `loewe.webm` | durchsichtig — Chrome, Firefox, Android |
   | `loewe-maske.mp4` | Bild und Maske nebeneinander — **Safari, iPhone** |
   | `loewe.jpg` | Standbild für die Vorschau |
   | `loewe.json` | Masse und Dauer, damit die Seite nicht raten muss |
   | `liste.json` | alle vorhandenen Filme — `/film` ohne Namen zeigt sie |

## Wieviel Farbe darf abweichen: 0,16 — nicht 0,22

`chromakey` vergleicht nur die **Farbigkeit**, nicht die Helligkeit.
Alles Graue, Schwarze und Weisse liegt deshalb rechnerisch genau 0,227
vom Grün entfernt. Mit dem alten Wert 0,22 (+ 0,08 weicher Rand) fiel
das mit hinein — gemessen an der Dampflok blieben von ihr nur noch 1 %
voll deckende Bildpunkte, 30 % waren halb durchsichtig; sie lief als
Gespenst durchs Bild. Auch der weisse Adlerkopf und der Rauch waren
betroffen. Mit 0,16 + 0,04 steht die Lok mit 38 % satt da, bei Löwe,
T-Rex und Adler ändert sich nichts (0,1 Prozentpunkte), und grüne
Reste bleiben bei allen fünf Filmen bei 0,00 %.

Wer doch einmal andere Werte braucht:

```
AEHNLICH=0.20 WEICH=0.06 bash werkzeug/film-freistellen.sh ~/x.mp4 x gruen
```

## Grösse: 400 Punkte breit, crf 46

Gemessen am Löwen, dem schwersten der fünf: 540 Punkte/crf 38 = 5,7 MB,
480/crf 40 = 4,1 MB, **400/crf 46 = 1,9 MB**. 400 Punkte entsprechen
etwa der Breite eines Telefons — mehr sieht dort niemand. Alle fünf
Filme zusammen wiegen jetzt 5,9 MB statt 15,5 MB; sie werden beim
Betreten des Klassenzimmers im Hintergrund vorgeladen, einer nach dem
anderen, und bei „Datensparen" oder im 2G-Netz gar nicht.

## Der Ton bleibt drin

Bis Fassung 330 warf die Kette die Tonspur weg (`-an`), und im Chat lief
statt dessen der Geschenk-Jubel. Jetzt wandert der Originalton mit —
Opus im WebM, AAC im MP4 —, der Spieler spielt ihn, und der Jubel des
gezeichneten Geschenks schweigt, sobald ein Film läuft. Erlaubt ein
Telefon Ton erst nach einer Berührung, läuft der Film stumm weiter
statt gar nicht; `/befund` sagt dann, dass es so war.

**Gleich laut.** Gemeldet war „der Ton ist inkonsistent, am Anfang ist
er da, dann wird er dünner". Gemessen stimmte das, und es lag an den
Quellen: T-Rex −15,1 dB, Löwe −14,0, Lok −14,5, Adler und zweite Lok
−19,5 — über fünf Stufen Unterschied zwischen zwei Geschenken.
`loudnorm` (EBU R128, −16 LUFS) zieht das gerade; nachher liegen alle
fünf zwischen −15,7 und −17,4 dB.

## Welcher Effekt zu welchem Film

Der sechste Wert beim Aufruf sagt, was die Seite dazuzeichnet. Staub
gehört unter schwere Füsse und sonst nirgends:

| Wirkung | wofür | was man sieht |
|---|---|---|
| `erde` | schwere Schritte (T-Rex) | Staub am Boden, warmer Schein |
| `glanz` | Raubtier im Satz (Löwe) | warmer Schein, wenige Funken |
| `wind` | Flug (Adler) | feine Luftstreifen |
| `dampf` | Dampfmaschine (Lok) | aufsteigende Dampfwolken |
| `keiner` | alles andere | nur der Film |

Beim T-Rex und bei der Lok geht zusätzlich der **Chatverlauf** leicht
mit: beim Dino den Tritten folgend, bei der Lok als feines
gleichmässiges Zittern wie über Schienenstösse. Verschoben wird dabei
**nur der Verlaufskasten** — nie `<body>` und nie die Filmschicht.

**Am Dokument wird nie gewackelt.** Das Beben lag als `transform` auf `<body>` —
und sobald ein Vorfahr eine `transform` hat, gilt `position: fixed`
nicht mehr gegenüber dem Bildschirm, sondern gegenüber diesem Vorfahren.
Die Filmschicht sprang dadurch beim ersten Stoss nach oben und beim
Nachlassen zurück. Gemessen wird das jetzt in `werkzeug/pruefe-film-platz.js`: während die
Lok läuft und der Chat rattert, 456 Messungen der Filmschicht, Spanne
**0 Punkte** — bei 419 verschiedenen Lagen des Chatverlaufs.

## Warum zwei Videodateien

Safari kann kein WebM mit Alphakanal. Ohne die zweite Fassung sähen
iPhone-Leute einen grünen Kasten — und das sind die meisten. Deshalb
entsteht daneben ein MP4, in dem Bild und Maske nebeneinanderliegen;
die Seite setzt beides wieder zusammen.

## Nachgeprüft

`node werkzeug/pruefe-film-freistellen.js` baut sich ein Testvideo
(roter Ball vor Grün), schickt es durch die Kette und misst danach im
Browser die Bildpunkte: an den Ecken muss Alpha 0 stehen, am Ball 255,
und die Farbe darf keinen Grünstich haben.
