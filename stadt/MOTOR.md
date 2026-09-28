# Baukasten-Stadt — Anleitung für Modellbauer

Seite: `stadt.html` (eigene Oberfläche, stört das Spiel nicht).
Dateien: `stadt/kern.js` (3D-Gerüst), `stadt/pinsel.js` (Werkstoffe), `stadt/boden.js` (WebGL-Boden),
`stadt/szene.js` (Zusammensetzen), `stadt/start.js` (Kamera, Werkbank), `stadt/modelle.js` (Liste der Modelldateien),
`stadt/modelle/<name>.js` (je ein Modell).

## Was Xander will (wörtlich, das ist der Maßstab)

> „richtig filigran. Richtig schön ausarbeiten mit schönen Texturen" · „keine Comic Grafik … viel mehr am Realismus"
> „feinen Texturen im Fensterglas, Blumenkästen auf dem Fensterbrett, ne Klingel an der Tür, Hausnummer. Alles mit Struktur, so der Mörtel und … Beton, alles mal schön die Häuserwände"
> „ohne Pixelkanten und komische Vektorrückstände" · „die Häuser fast schon begehbar … ihren Liebreiz haben. Man soll sie in jedem Winkel aufstellen können"
> „Man soll das Fundament sehen beim Aufbauen … wie das nach 2 Minuten aussieht, nach 5 … 10 … 15 Minuten, bis es fertig ist"
> „Du bist dein schlimmster Kritiker … Ich möchte nicht wieder zehnmal sagen verändert das"
> Weihnachtsdorf zuerst: „mit schmücken, mit Schnee, mit Santa Claus" – später dasselbe „in einen Frühlingsgewand".
> Vorbild: Simpsons Tapped Out – aber „noch besser … nicht Comic", Stil „von Anno oder geiler", „trotzdem mit SVG Grafiken" (= alles Vektor, gezeichnet, keine Fotos/Bitmaps).

## Koordinaten

- Welt in **Metern**. x = Osten, y = Süden, z = oben. Ein Modell steht mit der **Mitte seines Grundrisses auf (0,0,0)**.
- `grund: [b, t]` = Grundriss in x und y (für Platzieren/Kollision), `hoehe` = ungefähre Gesamthöhe.
- Die Kamera ist orthografisch, 2:1 (wie klassische Aufbauspiele). Das Modell wird mit `gier` (Grad, **jeder Winkel**) gedreht.
  Licht kommt immer von links oben (Kameraraum) – deshalb malen die Pinsel „Werkstoff bei weißem Licht", der Kern legt Licht darüber.

## Modell anmelden

```js
(function () {
  const ST = window.STADT, PI = ST.pinsel;
  ST.modell("fachwerkhaus", {
    name: "Fachwerkhaus", gruppe: "Häuser", grund: [8, 10], hoehe: 13, bauzeit: 15 * 60,
    bauen(M, o) {
      // o.jahr: "winter" | "fruehling" | "sommer" | "herbst"
      // o.bau: 0…1 (1 = fertig) — Bauphasen
      // o.saat: Zahl für Varianten (Farben etc.), o.variante: frei
      ...
    }
  });
})();
```
Datei in `stadt/modelle/<name>.js`, Namen in `STADT.MODELL_DATEIEN` (stadt/modelle.js) eintragen.

## Der Bauer `M`

- `M.teil(name, {ebene, schatten, mitte})` – neues Teil (Gruppe von Flächen). Teile werden nach der Nähe ihrer Mitte
  zum Betrachter sortiert (hinten zuerst). `ebene` (Ganzzahl) erzwingt Reihenfolge (höher = später gemalt).
  Innerhalb eines Teils werden Flächen nach ihrer Mitte sortiert. **Konvexe Körper = je ein Teil** ist am sichersten.
- `M.flaeche({ name, o:[x,y,z], u:[…], v:[…], w, h, umriss?, malen, leuchten?, danach?, beidseitig?, keinLicht?, ao?, traufe?, traufeY?, ebene? })`
  - `o` = linke **obere** Ecke der Fläche **von außen gesehen**, `u` = nach rechts, `v` = nach **unten** (Einheitsvektoren, werden normiert).
  - Außen = Seite, auf die `u × v` zeigt. Rückseiten werden weggelassen (außer `beidseitig`).
  - `umriss` = Vieleck in Flächenkoordinaten (Meter), z. B. Giebel-Fünfeck. Standard: Rechteck w×h.
  - `malen(g, F)` zeichnet **in der Fläche**: Einheit Meter, (0,0) links oben, y nach unten. Der Kern hat schon affin
    transformiert und auf den Umriss beschnitten. Danach multipliziert der Kern das Licht darüber (außer `keinLicht`).
  - `leuchten(g, F)` wird **nach** dem Licht gemalt, nur wenn `F.nacht > 0` (Fensterlicht, Lichterketten). Leuchtet etwas,
    `F.leuchtPunkt(a, b, radiusMeter, "r,g,b", staerke, flackern)` anmelden → weicher Schein in der Szene.
  - `ao: true` → Kontaktschatten unten an der Wand. `traufe: überstand` → Schatten des Dachüberstands oben.
  - Durchsichtige Flächen (Eiszapfen-Ebene, Geländer): `keinLicht: true` und selbst mit `F.licht` schattieren
    (sonst dunkelt die Lichtschicht auch das dahinter Gemalte ab).
- `M.quader({x,y,z,b,t,h}, {sued, nord, ost, west, oben}, opt)` – Kasten; Werte sind Malfunktionen oder Farben. Fehlende Seite = keine Fläche.
  Flächenkoordinaten: sued (+y) u=+x; nord u=−x; ost (+x) u=−y; west u=+y; v = nach unten; oben: u=+x, v=+y.
- `M.satteldach({x,y,b,t,z,hf,ueT,ueG,dicke}, malenSued, malenNord, {kante, traufeMalen, ortMalen})` – Satteldach, First entlang x
  über dem Rechteck (x…x+b, y…y+t), Traufe auf Höhe z, First z+hf, Überstände. Dachfläche: x entlang der Traufe, y vom First (0) zur Traufe.
  Gibt `{zt, neig, zE, …}` zurück. `STADT.dachHoehe(d, y)` = Dachhöhe über y (für Gauben/Kamine).
  Andere Dachformen (Walm, Krüppelwalm, Mansarde, Turmhelm) mit `M.flaeche` und `umriss` selbst bauen.
- `M.figur({x,y,z, breite, hoehe, malen(g, s, F), schatten})` – aufrecht Gemaltes (Baum, Mensch, Laterne): Ursprung am
  Fußpunkt im Bild, `s` = Pixel je Meter, nach oben = **negativ y**. Schatten wird automatisch aus der Zeichnung geworfen.
  `F.gier` = Drehung (Grad), `F.nacht`, `F.jahr`, `F.leuchtPunkt(dx, dy, rPx, farbe, k, flacker)` (hier in Pixeln).
- `M.licht(x,y,z, r, "r,g,b", k)` – Lichtschein (Laterne), `M.rauchAus(x,y,z,k)` – Rauch aus dem Schornstein.
- `M.lebendig(fn)` – wird **jedes Bild** gemalt (Animation): `fn(g, P)` mit `P.proj(x,y,z)` → Bildpunkt (Modellkoordinaten!),
  `P.s` (Pixel/m), `P.t` (Sekunden), `P.Z.nacht`. Sparsam einsetzen (Arbeiter, Fahne, Flackern).

## F (in `malen`/`leuchten`)

`F.w, F.h` (Meter), `F.px` (Pixel je Meter entlang der Fläche – **Detailstufe danach wählen**: bei `F.px < 8` keine
Einzelziegel, bei `F.px > 60` Schrauben, Maserung, Schrift), `F.rng()` (fester Zufall je Fläche), `F.jahr`, `F.nacht` (0…1),
`F.bau` (0…1), `F.o` (Optionen), `F.licht` (0…1 Sonne auf der Fläche), `F.schatten(tiefe)` → `[dx,dy]` Versatz, um den ein
Vorsprung der Tiefe `tiefe` (m) seinen Schatten auf die Fläche wirft (oder `null`, wenn die Fläche im Schatten liegt) –
**für Laibungen, Fensterbänke, Balken, Blumenkästen benutzen**, dann stimmt die Tiefe in jedem Drehwinkel.

## Pinsel (`STADT.pinsel`, alles in Flächenkoordinaten)

`putz`, `schliere`, `balken`, `quader` (Sandstein), `biberschwanz`, `schneeDach`, `eiszapfen`, `fenster` + `fensterLicht`,
`laeden`, `blumenkasten`, `tuer`, `klingel`, `hausnummer`, `rauschen`/`bleichen` (nahtlose Rauschmuster, multiply/screen),
`rundRechteck`, Farbhilfen `hex rgb misch hell streu`. Man darf sie verbessern/erweitern (wer `pinsel.js` gerade besitzt,
steht im Auftrag) – oder eigene Helfer in der Modelldatei schreiben.

## Werkbank und Bilder

```
node werkzeug/stadt-bild.js <aus.png> "werkbank=<id>&gier=30&jahr=winter&zeit=abend&still=1" 900 900 1
```
Parameter: `gier` (Grad), `jahr` (winter|fruehling|sommer|herbst), `zeit` (tag|abend|nacht), `bau` (0…1),
`s` (Pixel je Meter, CSS; leer = passend), `kx`,`ky` (Kameramitte in Metern, zum Heranfahren an Tür/Fenster),
`saat`, `weg=0` (kein Weg), `flocken=1` (Schneefall), `still=1` (ein Bild, dann fertig), `t` (Zeit in ms für Animation).
Letzte Argumente: Breite, Höhe, Pixeldichte. **Bilder immer ansehen** (Read auf die PNG).

Pflichtbilder vor „fertig": Drehwinkel 0, 30, 60, 90, 135, 180, 225, 300 · Nah (s=110 an Tür und Fenster) · Übersicht
(s=12, wirkt es im Kleinen?) · tag/abend/nacht · winter/fruehling · Bauphasen 0.05, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.
Keine Konsolenfehler. Rechenzeit eines Sprites: `STADT.spriteMalen` bei s=40 Gerätepixel/m unter ~250 ms halten
(bei kleinem `F.px` Details weglassen).

## Regeln

- Kommentare auf Deutsch; Xander wörtlich zitieren, wo es um seine Wünsche geht.
- Keine Emojis, keine Bilddateien, keine fremden Skripte. Alles gezeichnet.
- Realismus vor Niedlichkeit: echte Proportionen (Geschosshöhe ~2,6–2,9 m, Tür ~2,1 m, Fenster ~0,9×1,3 m),
  echte Bauweise (Fachwerk: Schwelle, Ständer, Rähm, Riegel, Streben/Mann-Figur, Stockwerksauskragung mit Balkenköpfen,
  Sockel aus Bruch- oder Sandstein, Biberschwanz-Doppeldeckung, Gauben, Kamin mit Kaminkopf).
- Duden-Rechtschreibung in allen Namen und Texten.

## Lebendes, Baustelle, Himmel (Ergänzung)

- **Lebende Modelle** (Menschen, Tiere, Schlitten auf dem Boden): `ST.modell(id, { live: true, grund:[0.6,0.6], hoehe: 1.8,
  zeichnen(g, P), schatten(sg, P), bewegen(o, dt, t, SZ) })`. Sie haben kein Sprite, werden **jedes Bild** gemalt und trotzdem
  richtig vor/hinter Häusern einsortiert. `bewegen` ändert `o.x`, `o.y`, `o.gier` (Welt) – z. B. entlang von Wegen
  (`STADT.boden.wert(x, y, 0)` > 0,5 = Pflaster, `…,1)` = Wasser/Eis, `…,3)` = Rasen). `SZ.passt(typ,x,y,gier,o)` prüft Kollision.
- **P** (für `zeichnen`, `schatten`, Baustellen-Haken, Leben): `P.proj(x,y,z)` → Bildpunkt eines Punkts in **Modellkoordinaten**
  (schon gedreht), `P.schattenAuf(x,y,z)` → Bildpunkt seines Schattens am Boden, `P.s` (Gerätepixel/m), `P.t` (s), `P.Z` (Licht:
  `amb`, `sonne`, `nacht`), `P.gier` (Grad inkl. Kamera), `P.jahr`, `P.dpr`, `P.objekt` (das Objekt), `P.def`.
  Im Schatten-Kontext `sg` alles in **Schwarz** malen (die Szene färbt die ganze Schattenebene einheitlich ein).
- **Baustelle** (`stadt/baustelle.js`): `ST.baustelle = { hinten(g,P,o,bau), vorne(g,P,o,bau), schatten(sg,P,o,bau) }` –
  wird für jedes Objekt mit laufendem Bau aufgerufen: `hinten` vor dem Gebäude (Gerüstteile dahinter, Kran-Mast hinten),
  `vorne` danach (Gerüst vorn, Arbeiter, Bagger). Grundriss: `P.def.grund`, Höhe `P.def.hoehe`, Fortschritt `bau` 0…1.
- **Himmel** (`stadt/himmel.js`): `ST.himmel = { bewegen(dt, t, SZ), zeichnen(g, t, Z, SZ) }` – nach allen Dingen, vor dem
  Schneefall, im Bildraum (Gerätepixel). `ST.proj(x,y,z)` rechnet Weltpunkte in Bildpunkte, `ST.kamera` (`s`, `W`, `H`, `dpr`).
- **Stadt-Prüfbilder**: `stadt.html?neu=1&still=1&t=8000&s=16&kx=0&ky=0&zeit=abend&dazu=tanne,laterne` – `neu=1` baut Winterhausen
  frisch, `dazu=` lädt zusätzliche Modelldateien, `t` = Zeitpunkt (Bewegungen werden bis dahin vorgespult).
