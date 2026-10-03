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
