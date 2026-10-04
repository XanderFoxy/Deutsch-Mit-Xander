# Tier-Bibliothek – Anleitung für jede Gruppe (FASSUNG 854, WERKZEUG 880/881)

XANDER (Auftrag vom 03.10., Antwort Funk 290), wörtlich: „ich möchte, dass die großen Tiere und die anderen Kleintiere noch mal richtig überarbeitet werden
… die sollen ihren natürlichen Original entsprechen … Ich möchte einen perfekten Löwen. Ich möchte einen perfekten Tiger, einen
perfekten Wolf, einen perfekten Fuchs. Ich möchte perfekte Dinosaurier unmissverständlich auf höchstem Niveau wie in Jurassic
Park … als perfekter Spieledesigner, als Profi-Grafikdesigner auf Hollywood-Niveau, sei ein schärfster Chef, ein strengster
Kunde, detailverliebter Perfektionist und Recherche-Profi auf höchstem Level“.

Die Insekten (Biene, Ameise …) bleiben, wie sie sind – sie sind laut Xander schon perfekt.

## WERKZEUG 880 (gilt ab sofort, hat Vorrang)

XANDER (Funk 299, wörtlich): „die nächste Priorität sollte der Abschluss der Tiere sein mache bitte nur deine Aufgaben und
nicht irgendwas anderes was du hinein interpretierst … kümmere Dich jetzt mal bitte intensiv um das alles“.

FASSUNG 880 — Warum: Die Kritiken R1–R5 fanden immer dieselben Fehler – Proportionen nach Augenmaß, die sich von Runde zu
Runde verschieben, Teile mit eigenem Rand („Aufkleber“), Licht je Teil („aufgeklebte Kissen“, `T.volumen`), Fell als
gleichmäßig verstreute Striche („Kratzer“), Hufe als Pantoffel, Grinse-Münder. Darum gibt es jetzt EIN Werkzeug, mit dem
jede neue oder neu gebaute Art in derselben Reihenfolge entsteht. Es steckt in eigenen Modulen und ist in `kern.js`
eingehängt – jedes `T` hat die Funktionen unten. Alte Arten zeichnen unverändert (geprüft: alle 116 Arten im Großbild
bitgleich, außer dem neu gebauten Wolf; FASSUNG 881: weiterhin alle alten Arten im Großbild bitgleich).

### Ablauf je Art (Reihenfolge ist Pflicht)

1. **Bauplan → Skelett**: `T.skelett(bauplan, { W, …Überschreibungen }, pose)` – Knochenlängen und Ruhewinkel aus der
   Tabelle (Quellen stehen in `bauplan.js`), nur wenige Art-Parameter ändern (Rumpflänge, Brusttiefe, Kopf, Hals, Schwanz).
2. **Silhouette**: Kopf (`T.kopf`), Füße (`T.fuss`) → `T.silhouette(sk, profil)` = EIN geschlossener Körperumriss mit
   Fellzugabe. Keine Einzelteile mit Rand. Ferne Beine/Ohr dahinter mit `T.glied(…, { fern: true })`.
3. **Licht**: `T.licht(sil, o)` – Querverläufe über Rumpf (mit Hals und Kopf) und Läufe, Terminator bei 60–65 %,
   Okklusion, Muskellichter. Licht von links oben. Kein Weichzeichner.
4. **Muster**: `T.muster(achse, o)` – Sattel, Bauch, Maske, Streifen, Läufe folgen der Körperrundung (Achse, nicht Box).
5. **Fell/Details**: `T.unterhaar` (dichtes kurzes Haar), `T.fell` (Strähnen + Konturfell), `T.federn`,
   `T.oberflaeche` (Schuppen/Platten/Poren); dann Kopfdetails (`kp.auge`, `kp.nase`, `kp.lefze`, `kp.ohrSvg` …).
6. **Sonde**: `node werkzeug/bilderwelt/tiere/pruefe-tier.js <id> [--art <entwurf.js>] [--aus <ordner>]` – misst
   (FASSUNG 881) die Proportionen am BILD gegen unabhängige Soll-Spannen aus der Recherche (`SOLL` in `bauplan.js`,
   eigene Spannen mit `art.soll`), ⚠ wenn ein Art-Parameter > 15 % vom Basis-Bauplan abweicht, die echte Lichtwirkung
   (Doppelrender mit/ohne `T.licht`, oben − unten ≥ 20 Graustufen), Verbote (auch NaN/undefined), Größe und Zeit.
   `--alle [--bilder]` misst jede Art (alte Arten am Pixelumriss), `--alle --schnell` nur Verbote/Größe. Erst wenn alles ✓ ist:
7. **Kritiker** (wie bisher, Abschnitt „Kritiker-Ablauf“) mit `blatt.js --gross <id>`; Szene prüfen mit
   `blatt.js <aus.png> --nur <gruppe> --szene`.

**Zurückgenommen: Nr. 13 („Volumen je Körperteil“, `T.volumen` je Teil).** Licht je Teil erzeugt genau die Nähte und
„Kissen“, die die Kritiker bemängeln. Neue Arten nehmen `T.licht` auf der EINEN Silhouette. (`T.volumen` bleibt nur für
alte Arten bestehen, damit sie unverändert zeichnen; die Sonde meldet es als Verbot.)

Weitere Regeln: Größe fein ≤ 70 KB (Saurier ≤ 90 KB), Szene ≤ 25 KB; im Szene-Modus (`T.fein = false`) keine Filter –
`T.rauschen`/`T.relief` liefern dort `"none"`, `T.textur` liefert `""` (für Flecken in Szenen: `T.fleckMuster`).
`T.koerper` zeichnet seinen Standard-Rand nur noch für alte Aufrufe (sobald `T.skelett`/`T.silhouette` lief, gilt
`T.stil = 880` → kein Rand). Kein Grinsen: die Mundlinie steigt nach hinten nicht an (`T.kopf` erzwingt das).

### Kurz-API (alle Maße in cm, Blick nach rechts, Boden y = 0, oben negativ)

- `T.skelett(bauplan, art, pose)` → `{ W, gang, zwei, beine: { vn, vf, hn, hf }, lm, ruecken, hals, kopf, schwanz,
  masse, fuesse }`. Baupläne (12): `hund, katze, baer, pferd, rind, hirsch, elefant, primat, echse, robbe, theropode,
  vogel`. Alias (`ALIAS` in `bauplan.js`, gilt für Skelett, Kopf und Sonde gleich): wolf/fuchs/polarfuchs/hyaene → hund;
  loewe/tiger/leopard/jaguar/gepard/luchs/saebelzahnkatze → katze; Bären/panda → baer; esel/zebra → pferd;
  kuh/ziege/schaf/gnu/wisent/moschusochse → rind; reh/elch/rentier/riesenhirsch/antilope/gazelle → hirsch; mammut →
  elefant; Menschenaffen → primat; Echsen/Krokodile → echse; seehund/walross → robbe; Raubsaurier → theropode;
  Hühnervögel → vogel. Unbekannter Name → Fehler (kein stiller Rückfall auf den Hund mehr).
  `art`: `{ W (Widerrist/Hüfthöhe cm, Pflicht), rumpfL, brustTiefe, kruppe, aufzug (je in W), kopf: { laenge (W),
  winkel (Grad) }, hals: { winkel, laenge, dickeA, dickeE }, schwanz: {…}, vorn/hinten: { knochen: [Länge, Winkel] },
  soll: { … eigene Soll-Spannen für die Sonde } }`; `pose`: `{ art: "stehen"|"schritt", weite, fernVorn, fernHinten, x0 }`.
  Landmarken `lm`: widerrist, kruppe, hueftHoecker, sitzbein, huefte, buggelenk, bugspitze, brustbein, brustTief,
  flanke, schwanzansatz; je Bein `p` (Gelenke) und `extra` (fersenhoecker, ellbogenhoecker, karpalballen, kniescheibe).
- `T.kopf(bauplan, sk.kopf, o)` → `kp` mit `umrissSil`, `achse`, `punkte` (auge, nase, mundwinkel, kinn, kehlPunkt …),
  `ohr.nah/fern` und Zeichnern `kp.auge(o)`, `kp.nase(o)`, `kp.lefze(o)`, `kp.plastik(o)`, `kp.ohrSvg(o, nah)`,
  `kp.tasthaare(o)`. Vorlagen (12, eine je Bauplan): hund, katze, baer, pferd, rind, hirsch, elefant, primat, echse,
  robbe, theropode, vogel; unbekannt → Fehler. Schalter in `o` überschreiben jeden Vorlagen-Schlüssel: `stop`
  (Mulde in Kopflängen, Wolf 0,03), `stopX`, `fang`, `auge: {…}`, `ohr: { form: "spitz"|"rund"|"blatt"|"lappen"|"keins",
  … }`, `mund: {…}`. Das ferne Ohr steht 0,12 Kopflängen versetzt, mit eigener Schattensichel.
- `T.fuss(sk, "vn"|"hn"|"vf"|"hf", o)` wählt nach Gangart: `T.pfote`, `T.huf`, `T.klaue`, `T.sohle`, `T.vogelfuss`,
  `T.theropodenfuss`, beim Zweibeiner vorn `T.hand(sk, wo, o)`, bei Gangart „flosse“ `T.flosse(fessel, spitze, breite, o)`
  (kein stiller Rückfall auf die Pfote) – je `{ pts (Umriss), svg (Zehen, Ballen, Krallen …), boden, spitze, achse }`.
  o: `{ fell, krallen, afterkralle, lang (Faktor Fußlänge), fern, op }`.
- `T.silhouette(sk, profil)` → `sil` = `{ pts, id, clip, achsen: [rumpf, vn, hn, kopf, …], kanten: { ruecken, nacken,
  kehle, vorbrust, unten, hose, vnVorn, vnHinten, hnVorn, hnHinten }, punkte, arm, schwanz }`. profil: `{ kopf,
  fussVorn, fussHinten, fell: { ruecken, nacken, brust, bauch, hose } (W), nackenKamm, kehle, vorbrust, hose,
  schwanz (true/false: Schwanz im Umriss; Standard bei theropode/echse) }`. Gilt für ALLE Baupläne: Zweibeiner
  (theropode, vogel) ohne Vorderbein im Umriss – der Arm liegt frei in `sil.arm` (mit `T.glied` + `T.hand` zeichnen);
  Robbe mit `T.silhouette` + Flossen; hohe Kruppe (Rind, Pferd) als Bogen; `sil.schwanz` = Schwanz-Achse im Umriss.
- `T.glied(kette, breiten, o)` – Strang entlang einer Gelenkkette (Bein, Schwanz, Hals, Arm); `o: { fuss, fussAchse,
  extraA, ersetzeA, farbe, fern, schatten: [y0, y1], schattenStaerke (0,55), quer (Füllung für die Rundung quer,
  z. B. T.lg-Verlauf), innen (SVG im Clip des Glieds, z. B. Unterhaar/Fell des fernen Laufs), name }`;
  `T.beinKette(sk, wo, { oben })` liefert `{ kette, breiten, extraA, ersetzeA }` aus dem Skelett (Karpalballen inklusive).
- `T.licht(sil, { staerke, terminator, muskeln, okklusion, nur, extra, verwindung })` → `{ svg (geklippt), innen
  (dieselbe Schattierung UNGEKLIPPT, für Arten, die ohnehin alles in EINE <g clip-path> legen), hell(x, y) → −1…+1,
  daten }`; je Achse einstellbar: `achse.staerke`, `achse.schritt`, `achse.rausB`. Verdrehte Abschnitte werden fein
  unterteilt (keine Facetten mehr).
- `T.muster(achse, { art: "fleck"|"laengs"|(weiches Band), t0, t1 (quer), s0, s1 (längs), farbe, op, weichS })`,
  `T.zone(achse, t0, t1, s0, s1)` → Vieleck (für Fell-, Muster-, Oberflächenzonen).
- `T.fluss(sil, o)` → Wuchsrichtungsfeld; `T.fell(sil, { fluss, hell, zonen: [{ pts, laenge, dichte, breite,
  straehnen, hell, dunkel, unterwolle, grannen }], kanten: [{ pts, laenge, abstand, farbe, op, raus }], aus })`;
  `T.unterhaar([{ pts, winkel, kachel, dichte, laenge, streu, hell, dunkel, einfach }])` (nur Großbild);
  `T.federn.flur(pts, o)`, `T.federn.schwinge(basis, o)`; `T.oberflaeche([{ pts, art, achse, groesse, … }])`.
- `T.augeReal(x, y, r, { …, hoehle: true })`; `T.fleckMuster(name, { farbe, fx, fy, deckung, gruppe })` → `url(#…)`
  einer Fleckenlage ohne Filter; `T.fleckFlaeche(name, [x0, y0, x1, y1], { farbe, fx, fy, deckung, gruppe, variante })`
  → zwei überlagerte Lagen mit verschiedener Kachelgröße (keine Tapeten-Wiederholung; mehrere Tiere einer Szene teilen
  mit `gruppe` dieselben Muster, `variante` verschiebt sie); `T.form880` – Geometrie-Helfer (glatt, eckig, lerp, box,
  mischFarbe, weichEllipse …).
- `BAU.SOLL` (`bauplan.js`): unabhängige Soll-Spannen je Art/Bauplan aus der Recherche (Bauchfreiheit, Rumpflänge,
  Kopflänge, Kruppe, Sprunggelenkwinkel, Fersenhöhe; mit Quelle); `BAU.sollFuer(id, bauplan, art)`,
  `BAU.abweichungen(bauplan, art)` (Art-Parameter > 15 % vom Basis-Bauplan → ⚠ in der Sonde).

### Einheiten (verbindlich)

| Wert | Einheit |
|---|---|
| alle Koordinaten, `laenge`, `breite`, `abstand`, `kachel` | cm (W = Widerristhöhe in cm) |
| `art.rumpfL`, `brustTiefe`, `kruppe`, `aufzug`, `kopf.laenge`, `hals.laenge`, `profil.fell.*` | Anteil von W |
| Winkel (`kopf.winkel`, `knochen`, `unterhaar.winkel`) | Grad; Kopf: Nase tiefer = positiv; Wuchs 180 = nach hinten, 90 = nach unten |
| `T.fell` Zone `dichte` | Büschel je 100 cm² (Abstand ≈ √(100 / dichte) cm); `laenge` cm; `breite` halbe Büschelbreite cm |
| `T.unterhaar` `kachel` / `dichte` / `laenge` | Kachelkante cm (5,5) / Haare je cm² (1,1) / Haarlänge cm (1,6) |
| `kp.*`, `T.kopf` Schalter (`stop`, `fang`) | Kopflängen |
| Achsen `s`, `t` | 0…1 entlang/quer (Werte < 0 und > 1 erlaubt: reichen über den Rand hinaus) |

### Koordinaten der Achsen (für `T.zone`, `T.muster`, Fellzonen)

```
                t < 0 (über dem Rücken, z. B. Nackenkamm/Fellkante)
          t = 0  Strang A ─────────────────────────────── Rücken/Nacken/Stirn
   s = 0  ┌──────────────────────────────────────────────┐  s = 1
  Gesäß   │  Rumpfachse „rumpf“ (läuft in Hals und Kopf  │  Nase
          │  weiter)          t = 0,5 Mitte              │
          └──────────────────────────────────────────────┘
          t = 1  Strang B ─────────────────────────────── Bauch/Brust/Kehle
                t > 1 (unter dem Bauch)
   Glieder („vn“, „hn“, „vf“, „hf“, „schwanz“, „arm“): s = 0 oben (Schulter/Hüfte/Ansatz) … s = 1 Fuß/Spitze;
   Strang A = Hinterkante, Strang B = Vorderkante des Laufs.
```

### Vorlage statt Beispiel: `vorlage880.js` (lauffähig, vollständig)

`werkzeug/bilderwelt/tiere/vorlage880.js` enthält den GANZEN Ablauf als Funktion `vorlage(T, bauplan, o)` → `{ svg,
box, umriss, fuesse, sk, kopf }` – Skelett, Kopf, Füße, Silhouette, fernes Ohr, ferne Glieder (mit Querverlauf,
Unterhaar und Fell), Schwanz/Steuerfedern, Arm + Hand (Zweibeiner), Vorderflosse (Robbe), Flügel (Vogel), Licht,
Muster, Unterhaar, Fell bzw. Schuppen/Federn, Kopfdetails. Eine neue Art kopiert `vorlage()` in ihre Gruppendatei und
ersetzt die Platzhalter (Farben, Muster, Fellzonen, Kopfdetails) nach der RECHERCHE. Die Datei wird nicht als Gruppe
geladen (`kern.js` überspringt sie); die Demo-Art `vorlage_hund` prüft man mit
`node werkzeug/bilderwelt/tiere/pruefe-tier.js vorlage_hund --art werkzeug/bilderwelt/tiere/vorlage880.js`
(Stand 881: 0 ✗, 0 ⚠; fein 41,4 KB, Szene 17,6 KB).

Minimal (in einer Gruppendatei):
```js
const { vorlage } = require("./vorlage880");
module.exports = [{ id: "testhund", de: "der Hund", laenge: 1.1, hoehe: 0.7, /* … */
  zeichne(T) { return vorlage(T, "hund", { W: 60, art: { rumpfL: 1.06, brustTiefe: 0.46 }, farbe: "#8a6a48" }); } }];
```

### Was tatsächlich funktioniert (Stand FASSUNG 881)

- **Alle 12 Baupläne** (hund, katze, baer, pferd, rind, hirsch, elefant, primat, echse, robbe, theropode, vogel)
  laufen durch `vorlage()` fein und Szene ohne Fehler, ohne NaN, ohne Filter in der Szene – das ist die GRUNDFORM
  (Skelett, Umriss, Licht, Haut). Alle 12 Kopfvorlagen und alle Fußarten (Pfote, Huf, Klaue, Sohle, Hand, Flosse,
  Vogel-/Theropodenfuß) zeichnen. Grundform heißt: Proportion und Haut stimmen grob, Feinheiten (Bärentatze,
  Primatenhand am Boden, Elefantenohr, Größe der Vogel-Grundform in der Szene ≈ 28 KB) stellt erst die echte Art ein.
- **Mit Sonde UND Kritiker geprüft: nur `hund` (Wolf).** Alle anderen Baupläne sind Grundform – vor der ersten echten
  Art je Bauplan Soll-Spannen in `SOLL` ergänzen (bisher: hund, wolf, hyaene, katze, baer, pferd, rind, hirsch,
  elefant) und Kopf/Fuß am Bild prüfen.

### Wolf (`hunde_baeren.js`, komplett auf Werkzeug 880/881) – Messwerte

Sonde Wolf (FASSUNG 881, 04.10.): Widerrist 1,02 W, Kruppe 0,93, Bauchfreiheit 0,56, Rumpflänge 1,09 W, Kopf 0,37 W
(Soll 0,35–0,4), Sprunggelenk 138°, Fersenhöcker 0,27 W; Lichtwirkung mit − ohne `T.licht` oben/Mitte/unten
+14/−9/−55; fein 68,7 KB, Szene 23,9 KB, 0 Filter; 0 ✗, 0 ⚠. Gegenprobe: derselbe Wolf mit Dackelbrust, Riesenrumpf
und Mini-Kopf (Prüfer-Entwurf) → 6 ✗, 4 ⚠.

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
13. **ZURÜCKGENOMMEN (WERKZEUG 880, siehe oben): nicht mehr für neue Arten verwenden – Licht kommt aus `T.licht` auf der
    EINEN Silhouette.** Alter Text zur Nachvollziehbarkeit: **Volumen je Körperteil (`T.volumen`)** – Profi-Technik gegen „flach wie Airbrush" (Licht 3–4 in fast allen
    Kritiken): Jeder Körperteil kommt in eine eigene Gruppe mit `filter="${T.volumen("<teil>", { weich })}"` – Rumpf,
    Hals, Kopf, jedes Bein (Ober- und Unterschenkel dürfen eine Gruppe sein), Schwanz, Ohr. Der Filter blurrt die
    eigene Silhouette und beleuchtet sie von links oben: Rundung, Kernschatten zur Unterkante, Licht zur Oberkante
    entstehen automatisch und passen zueinander (stufenlos: Innen-Schatten/Innen-Glanz aus der verschobenen
    Silhouette, keine Höhenlinien-Streifen). `weich` (cm) ≈ 20–30 % der Dicke des Teils (Rumpf eines Löwen ≈ 12,
    Bein ≈ 3), `tiefe` 3–7, `umgebung` 0,25–0,45. Deine gemalten Verläufe bleiben (Farbe, Muster, Fell) – nur die
    groben Airbrush-Schattenflecken fallen weg. Haare, die über den Rand ragen, gehören in dieselbe Gruppe. In Szenen
    (`T.fein = false`) liefert der Helfer `"none"` – also kein Leistungsverlust. Ergebnis immer im Großbild prüfen:
    zu starke `tiefe` wirkt wie Plastik.
