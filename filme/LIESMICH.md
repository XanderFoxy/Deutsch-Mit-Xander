# Filme — die echten Animationen

Hier liegen freigestellte Videos: Bilder ohne Hintergrund, die sich über
den Chat legen lassen. Das ist dasselbe Verfahren, mit dem TikTok seine
grossen Geschenke macht — dort liegt eine Abspieldatei mit
Durchsichtigkeit über der Seite, und das Telefon rechnet nichts, es
spielt nur ab.

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

3. Heraus kommen vier Dateien:

   | Datei | wofür |
   |---|---|
   | `loewe.webm` | durchsichtig — Chrome, Firefox, Android |
   | `loewe-maske.mp4` | Bild und Maske nebeneinander — **Safari, iPhone** |
   | `loewe.jpg` | Standbild für die Vorschau |
   | `loewe.json` | Masse und Dauer, damit die Seite nicht raten muss |

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
