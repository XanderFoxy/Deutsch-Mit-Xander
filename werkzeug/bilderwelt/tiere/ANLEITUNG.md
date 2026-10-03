# Tier-Bibliothek – Anleitung für jede Gruppe (FASSUNG 854)

XANDER (Auftrag vom 03.10., Antwort Funk 290), wörtlich: „ich möchte, dass die großen Tiere und die anderen Kleintiere noch mal richtig überarbeitet werden
… die sollen ihren natürlichen Original entsprechen … Ich möchte einen perfekten Löwen. Ich möchte einen perfekten Tiger, einen
perfekten Wolf, einen perfekten Fuchs. Ich möchte perfekte Dinosaurier unmissverständlich auf höchstem Niveau wie in Jurassic
Park … als perfekter Spieledesigner, als Profi-Grafikdesigner auf Hollywood-Niveau, sei ein schärfster Chef, ein strengster
Kunde, detailverliebter Perfektionist und Recherche-Profi auf höchstem Level“.

Die Insekten (Biene, Ameise …) bleiben, wie sie sind – sie sind laut Xander schon perfekt.

## Format

Eine Gruppe ist eine Datei `werkzeug/bilderwelt/tiere/<gruppe>.js`, die eine Liste exportiert:

```js
"use strict";
module.exports = [
  { id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion",
    gruppe: "Raubtiere", lebensraum: "Savanne",
    laenge: 2.9, hoehe: 1.2,               // Umrissbox in METERN (Nase bis Schwanzspitze, Boden bis höchster Punkt)
    // fliegt: true | schwimmt: true       // dann kein Bodenschatten
    zeichne(T) { …; return { svg, box: [x0, y0, x1, y1] }; } },
];
```

- `zeichne` arbeitet in **Zentimetern**: Blick nach **rechts**, Boden bei **y = 0** (Füße/Hufe/Pfoten berühren y = 0, box[3] = 0),
  y nach oben negativ. `box` ist die echte Umrissbox (passt zu `laenge`/`hoehe` × 100).
- Wörter: Duden, mit Artikel; Silben mit Bindestrich, betonte Silbe in GROSSBUCHSTABEN; `it`/`itSyl`/`en` Pflicht.
- Nur Arten, die man kennt – keine Unterarten („angolanische Wüstenrennmaus“ nein).

## Werkzeug `T` (kern.js)

`T.lg / T.rg` (Verläufe, je Art einmal), `T.glatt(pts, zu, sp)` (glatte Kurve; `[x, y, 1]` = harte Ecke), `T.koerper(pts|d, fill, { innen, vol, volx, rand, randA, rw })`
(Füllung + geklippte Innenzeichnung + Volumen-Licht + feiner Rand), `T.form`, `T.linie`, `T.striche(n, x0, y0, x1, y1, dx, dy, farbe, w, op)` (Fell/Federn als EIN Pfad),
`T.auge(x, y, r, iris, { pupille: "rund"|"schlitz"|"quer", flach })`, `T.rnd()` (fester Zufall), `T.r()`. Eigene Hilfsfunktionen in deiner Datei sind erwünscht.

## Was jedes Tier erfüllen muss (der strengste Kunde prüft)

1. **Recherche zuerst** (Websuche, 1–2 je Art): echte Maße, Körperproportionen (Kopf : Rumpf : Beine : Schwanz), Gangart
   (Zehengänger, Sohlengänger, Huftier), Gelenkwinkel (Knie vorn, Sprunggelenk hinten), Fell-/Federmuster und Farben,
   Kennzeichen (Löwe: Mähne bis Brust/Bauch, Quaste am Schwanz; Tiger: einzelne Doppelstreifen, weiße Flecken hinter den Ohren;
   Leopard: Rosetten; Gepard: Tränenstreifen, schlank, kleiner Kopf; Wolf: lange Beine, buschiger hängender Schwanz, graue
   Maske; Fuchs: rote Decke, schwarze „Strümpfe“, weiße Schwanzspitze …). Schreibe das Ergebnis je Art als Kommentar
   `RECHERCHE` in die Datei.
2. **Anatomie stimmt**: Schädelform, Augen an der richtigen Stelle (Raubtiere vorn, Beutetiere seitlich), Ohren, Nase/Maul,
   Muskeln an Schulter und Keule sichtbar, Gelenke richtig gebogen, Zehen/Krallen/Hufe richtig, Schwanzansatz richtig.
   Natürliche Haltung (stehend oder schreitend, ruhig), Seitenansicht; der Kopf darf leicht zum Betrachter gedreht sein.
3. **Kein Comic**: keine Kulleraugen, kein Grinsen, keine dicken schwarzen Umrisse, keine Flachfarben. Realistische Augengröße,
   Glanzlicht klein. Licht von links oben, weiche Verläufe, Bauch/Unterseite dunkler, ferne Beine dunkler (Tiefe).
4. **Fell/Haut/Federn**: Fellstriche in Wuchsrichtung (wenige Pfade mit `T.striche`), Muster als echte Formen (Streifen folgen
   der Körperrundung), Schuppen/Platten bei Reptilien und Sauriern, Federkanten bei Vögeln. Feine Details: Schnurrhaare,
   Krallen, Hufkanten, Nasenlöcher, Lidrand.
5. **Größe**: SVG je Art ≤ 12 KB (Saurier ≤ 16 KB) – `blatt.js` zeigt die Bytes. Detail entsteht durch gute Formen und
   Verläufe, nicht durch tausend Einzelteile.
6. **Saurier** nach heutigem Wissen: waagerechte Haltung, Schwanz in der Luft (nie schleifend), Theropoden mit Händen nach innen
   (keine „Hasenhände“), Velociraptor gefiedert (Truthahngröße!), T. rex massiger Schädel, kleine zweifingrige Arme;
   Spinosaurus mit Segel und Paddelschwanz; Brachiosaurus mit längeren Vorderbeinen und hoch erhobenem Hals; Stegosaurus mit
   zwei Reihen versetzter Platten und vier Schwanzstacheln; Triceratops mit Nackenschild und drei Hörnern; Pteranodon (Flugsaurier,
   kein Dinosaurier – im Tipp sagen) mit Kopfkamm. Wirkung wie im Film: mächtig, glaubwürdig, aber realistisch gefärbt.

## Arbeitsweise

1. Lies `werkzeug/bilderwelt/tiere/kern.js` und diese Anleitung. Sieh dir das Blatt der ALTEN Tiere an
   (`node werkzeug/bilderwelt/tiere/alt-blatt.js <ordner>/alt.png`) – genau das soll deutlich übertroffen werden.
2. Je Art: recherchieren, zeichnen, dann `node werkzeug/bilderwelt/tiere/blatt.js <ordner>/<gruppe>.png --nur <gruppe>` und das
   PNG ansehen (Read). Streng kritisieren, verbessern, wieder ansehen – mindestens zweimal je Art. Zum Schluss einmal
   `--massstab` für deine Gruppe (stimmen die Größen zueinander?).
3. Nur deine Datei schreiben. Kein git, keine anderen Dateien, keine Szenen ändern.

---

## MASSSTAB 2 – gilt ab sofort und hat Vorrang (Xander, 03.10., zweiter Auftrag)

XANDER, wörtlich: „Die sollen fast fotorealistisch sein … mehr Struktur, mehr Details, mehr Wiedererkennungswert … Ich will
Augen sehen. Ich will Wimpern sehen … jede Pore … jedes einzelne Haar … Zähne, Augen, Glieder, Muskeln, Sehnen, Pupillen,
Krallen, Pfotenfell, Fellstruktur … alles mit Licht und Schatten realistisch plastisch massiv … Nimm dir für jedes einzelne
Tier mindestens 10 Minuten … Sag deinem Kritiker, dass er das Schärfste durchdenken soll, bevor er überhaupt ein Okay gibt …
viel mehr Vielfalt bei den Tieren.“

**Ziel: so nah am Naturfoto, wie Vektorgrafik kommt.** Vorbild ist hochwertige naturkundliche Illustration (Field-Guide-
Tafeln, Museumsillustration), nicht Clipart.

### Was jetzt Pflicht ist
1. **Augen** mit `T.augeReal`: Lidspalte, Iris mit Fasern und dunklem Rand, artgerechte Pupille (Katzen: rund bei Großkatzen,
   Schlitz bei Hauskatze/Fuchs; Ziege/Schaf/Pferd: quer; Krokodil: senkrechter Schlitz), Lidschatten, Glanzlicht, feuchter
   Lidrand, Wimpern wo das Tier welche hat (Pferd, Kuh, Kamel, Giraffe, Elefant: ja – lang; Katzen: kaum; Vögel/Reptilien: nein,
   dafür Nickhaut/Augenring).
2. **Fell Haar für Haar**: `T.haare` in Wuchsrichtung, mehrere Lagen (dunkle Unterwolle, Deckhaar, helle Haarspitzen am Licht),
   Fellstrich folgt dem Körper (Wirbel an Schulter/Flanke, Bauchkante, Ohrrand, Mähne lang und strähnig). Dazu `T.textur`
   mit `T.rauschen` (gestreckt in Wuchsrichtung) für die feine Grundstruktur.
3. **Haut, Poren, Schuppen, Runzeln** mit `T.relief` (Elefant, Nashorn, Nilpferd, Krokodil, Saurier, Füße, Nasen):
   fein dosiert – zuerst schwach (tiefe 0,3–0,8), am Bild prüfen; es darf nie nach Stein/Rinde aussehen, außer es IST so.
4. **Anatomie sichtbar**: Muskelgruppen (Schulter, Oberarm, Oberschenkel, Hals) als weiche Licht-/Schattenformen, Sehnen an
   den Läufen, Gelenke (Ellbogen, Handwurzel, Knie, Sprunggelenk), Zehenballen, Krallen (Farbe, Krümmung, Glanz), Hufe mit
   Kronrand, Zähne (Eckzähne, Schneidezähne, Zahnfleisch) wo das Maul offen oder die Zähne sichtbar sind, Nasenspiegel mit
   Nasenlöchern und feuchtem Glanz, Ohrmuschel mit Innenhaar, Tasthaare.
5. **Licht und Schatten**: Licht von links oben; Eigenschatten unter Bauch, Hals, Kinn; Kernschatten und Reflexlicht an der
   Unterseite; Glanz auf Nase, Augen, Krallen, Hufen, nasser Haut. Plastisch, massiv.
6. **Wiedererkennungswert**: Ein Kind erkennt das Tier sofort – und ein Biologe findet keinen Fehler.

### Größe (neu)
- Volle Feinheit (`T.fein = true`): ≤ 70 KB je Art (Saurier ≤ 90 KB) – `blatt.js` zeigt „fein / Szene“.
- Szene (`T.fein = false`, kleine Darstellung): ≤ 25 KB. `T.haare` macht das von selbst (ein Viertel der Haare); eigene
  Mikrodetails (Poren-Linien, einzelne Schuppen) ebenfalls nur bei `T.fein` zeichnen.

### Ablauf je Tier (mindestens 10 Minuten, mit unabhängigem Kritiker)
1. Recherche (Websuche): Naturfotografie-Beschreibungen, Anatomie, Fell-/Federzonen, Farben – als `RECHERCHE`-Kommentar.
2. Zeichnen; `node werkzeug/bilderwelt/tiere/blatt.js <ordner>/<id>.png --gross <id> --breite 1600` erzeugt
   `<id>.png` (ganz groß, rechts unten zusätzlich klein wie in einer Szene) und `<id>-kopf.png` (Kopf in doppelter Auflösung).
   Beide ansehen (Read).
3. **Kritiker**: Starte für jedes Tier einen eigenen, frischen Kritiker (Agent-Werkzeug, Typ general-purpose) mit den drei
   Bildpfaden, der Art und deinen Recherche-Stichpunkten. Auftrag an ihn: „Du bist der strengste Art Director der Welt und
   Biologe. Recherchiere selbst (Websuche) das Aussehen der Art. Sieh dir die Bilder an. Bewerte 1–10: Anatomie/Proportionen,
   Kopf/Gesicht, Augen, Fell/Haut/Federn, Details (Zähne, Krallen, Hufe, Muskeln, Sehnen), Licht/Schatten/Plastizität,
   Wiedererkennung, Wirkung klein in der Szene. Gib eine Liste konkreter Mängel mit Ort und genauer Korrektur. OK NUR, wenn
   jede Note ≥ 9. Im Zweifel: nicht OK.“
4. Mängel beheben, neu rendern, **wieder einen frischen Kritiker** fragen – bis OK (höchstens 5 Runden; danach die
   verbleibenden Mängel ehrlich melden).

## Kritiker-Ablauf (gilt ab sofort) und die häufigsten Mängel aus Runde 1

Subagenten haben kein Agent-Werkzeug. Den unabhängigen Kritiker startet der Hauptlauf: Die Gruppe meldet je Art die
frisch gerenderten Pfade (`<id>.png`, `<id>-kopf.png`), der Hauptlauf lässt je Art einen Kritiker urteilen und schickt die
Mängelliste (Datei in `scratchpad/kritik/<id>-r<N>.md`) zurück; dann neue Runde, bis alle Noten ≥ 9 (höchstens 5 Runden).

Die fünf Raubsaurier bekamen in Runde 1 nur 2–7 von 10. Fast alle Mängel wiederholen sich – vor der Meldung selbst prüfen:
1. **Beine als Säulen**: Hinterbeine von Zweibeinern/Vögeln/Laufvögeln und von digitigraden Säugern sind ein Z – Oberschenkel
   schräg nach vorn, Knie, Unterschenkel schräg nach hinten, sichtbare Ferse (Sprunggelenk), Mittelfuß steil nach vorn,
   nur die Zehen am Boden, Zehen einzeln mit Ballen/Schildern. Nie ein senkrechtes Oval-auf-Oval.
2. **Ferne Gliedmaßen als schwarze Silhouette**: im Körperton, nur 25–30 % dunkler, Form und Textur sichtbar.
3. **Keine Lichtrichtung**: EIN Licht oben links (vorn). Rückenkante hell, Kernschatten-Band im unteren Rumpfdrittel
   (−30…−35 %), Bodenreflex am Bauch (+10 %), Okklusion an Ansätzen (Hals/Kopf, Arm, Bein), Schlagschatten (Kopf auf Hals,
   Arm auf Brust). Keine zufälligen hellen „Airbrush-Flecken“.
4. **Umrisslinien** um Teile (Arm, Kopf) wirken wie Aufkleber/Papierschnitt – weg; Teile in Körperfarbe, Übergänge weich.
5. **Rauschen/Relief als Sandpapier**: Kontrast −50…−60 %, voll nur am Terminator; dafür gezeichnete Struktur in
   Hierarchie (große Schilde/Scuta auf Rücken und Gesicht, mittlere an der Flanke, feine am Bauch; Fell: Strähnen in
   Wuchsrichtung). Keine hellen „Risslinien“.
6. **Augen zu klein, ohne Höhle**: Auge in einer Augenhöhle, Brauen-/Knochenwulst wirft Schatten auf das obere Drittel,
   dicker Lidrand, Glanzpunkt; Größe nach Referenz (meist größer als gedacht).
7. **Zähne als Pünktchen/Sägedreiecke**: echte Kegel, nach hinten gekrümmt, Größenfolge, Elfenbein mit dunklerer Basis,
   Lippen/Zahnfleisch verdecken die Basis teilweise; Rachen nach hinten dunkel.
8. **Kopfproportion**: an Schädelmaßen messen (z. B. T. rex Schädel ≈ 11,5 % der Länge, L:H ≈ 1,6).
9. **Bodenschatten**: macht `setze()` jetzt selbst – gib in zeichne() `fuesse: [x, …]` (cm, Mitte jedes Fußes am Boden)
   zurück, dann liegt der weiche Schatten genau unter den Füßen mit Kontaktkernen. Eigene Schattenellipsen weglassen.
10. **Kopf-Ausschnitt**: gib `kopf: [x0, y0, x1, y1]` (cm) zurück, dann zeigt `<id>-kopf.png` genau den Kopf.
11. **Klein in der Szene**: gleiche Farbwerte wie groß (kein Plastikglanz), Kopf/Auge/Krallen hell absetzen, die dunkelste
    Masse nicht im Schwanz.
12. **Weichzeichner-Farbstich**: jeder eigene `<filter>` (feGaussianBlur usw.) braucht `color-interpolation-filters="sRGB"`,
    sonst verschiebt Chrome halbtransparente Farben (gemessen: Braun wird Oliv). Die Filter in kern.js haben es schon.
13. **Volumen je Körperteil (neu, `T.volumen`)** – Profi-Technik gegen „flach wie Airbrush" (Licht 3–4 in fast allen
    Kritiken): Jeder Körperteil kommt in eine eigene Gruppe mit `filter="${T.volumen("<teil>", { weich })}"` – Rumpf,
    Hals, Kopf, jedes Bein (Ober- und Unterschenkel dürfen eine Gruppe sein), Schwanz, Ohr. Der Filter blurrt die
    eigene Silhouette und beleuchtet sie von links oben: Rundung, Kernschatten zur Unterkante, Licht zur Oberkante
    entstehen automatisch und passen zueinander. `weich` (cm) ≈ 20–30 % der Dicke des Teils (Rumpf eines Löwen ≈ 12,
    Bein ≈ 3), `tiefe` 3–7, `umgebung` 0,25–0,45. Deine gemalten Verläufe bleiben (Farbe, Muster, Fell) – nur die
    groben Airbrush-Schattenflecken fallen weg. Haare, die über den Rand ragen, gehören in dieselbe Gruppe. In Szenen
    (`T.fein = false`) liefert der Helfer `"none"` – also kein Leistungsverlust. Ergebnis immer im Großbild prüfen:
    zu starke `tiefe` wirkt wie Plastik.
