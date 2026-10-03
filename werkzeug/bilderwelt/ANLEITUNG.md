# Bilderwelt neu bauen – Anleitung für jede Szene (FASSUNG 852)

Xander, wörtlich:
- Funk 263: „jeder Ort soll identisch mit seinem Originalvorlage sein … recherchiere bis ins kleinste Detail … dass man auch
  wenn jemand auf dem Stuhl sitzt den Stuhl noch anwählen kann … sie sollen richtig klickbar sein … mit der Lupen Funktion“.
- Funk 286: „alle Bilderwelten komplett nach demselben Schema fertig machen dass sich nichts mehr blockiert und alle
  Hintergründe die logischen Stationen zeigen wo die Leute sind und das typisch für diesen Fall authentisch mit der höchsten
  Präzision und Detailverliebtheit so wie es in einer Bäckerei aussieht“.

Der Maßstab ist die Bäckerei: `werkzeug/bilderwelt/szenen/baeckerei.js`. Lies sie einmal ganz, bevor du baust.

## Ablauf je Szene `<id>`

1. **Alte Wörter holen:** `node werkzeug/bilderwelt/woerter.js <id>`.
   - Jedes alte Wort bleibt mit derselben `id`, demselben `de`, `syl`, `it`, `itSyl` und `en`.
   - Hat ein altes Teil `lupe` (Verweis auf eine Detail-Szene), bleibt `lupe` am neuen Teil.
   - Nur ein sachlich falsches Wort darfst du korrigieren; schreibe den Grund als Kommentar dazu.
   - Ein „unter“-Teil, das in der neuen Szene einzeln im Bild sinnvoller ist, darf ein normales Teil werden und umgekehrt.
2. **Recherche (kurz, 1–3 Suchen):** Wie sieht dieser Ort in Deutschland heute wirklich aus? Welche Stationen gibt es, wo stehen
   sie, wo sind die Leute?
   - Beispiel Postamt: Schalter mit Glas und Waage, Paketannahme, Packstation, Briefkasten draußen, Wartemarken-Automat,
     Regal mit Kartons und Umschlägen.
   - Schreibe das Ergebnis oben in die Bau-Datei als Kommentar „RECHERCHE“ (wie bei der Bäckerei).
3. **Bau-Datei schreiben:** `werkzeug/bilderwelt/szenen/<id>.js`.
   - Kopf: `neueSzene({ id, titel, emoji, thema, kuerzel, fassung: 852 })`.
   - `titel`, `emoji` und `thema` stehen in `bilderwelt-neu/data-szenen.js` und bleiben gleich.
   - `kuerzel` ist ein eindeutiges Kürzel aus 2–4 Buchstaben für die Verlaufs-ids (z. B. „pa“ für postamt). Es darf nicht mit
     einer anderen Szene kollidieren.
   - Am Ende `S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/<id>.js"))`. Sieh dir an, wie die Bäckerei das
     macht.
4. **Bauen und prüfen:**
   - `node werkzeug/bilderwelt/szenen/<id>.js`
   - `node werkzeug/bilderwelt/pruefe-szene.js bilderwelt-neu/szenen/<id>.js` muss „alle Teile gut erreichbar“ melden.
   - `node werkzeug/bilderwelt/vorschau.js bilderwelt-neu/szenen/<id>.js <scratch>/<id>.png --breite 1280`. Das Bild
     **ansehen** (Read) und kritisch prüfen wie der strengste Kunde. Dazu einmal `--rahmen` (Trefferflächen) und, wenn es
     Lupen gibt, `--unter`.
   - Fehler beheben und wiederholen, bis es stimmt.

## Was eine Szene erfüllen muss

- **Ort statt Personen:**
  - Im Mittelpunkt stehen der Ort und seine Dinge. Höchstens 1–3 Menschen, und nur dort, wo sie wirklich wären (hinter dem
    Schalter, an der Kasse).
  - Menschen verdecken kein anderes Teil.
- **Logik und Maßstab:**
  - Alles steht auf dem Boden oder auf einer Fläche: die Unterkante des Dings liegt genau auf dieser Fläche, mit weichem
    Schatten (`schatten(...)`).
  - Nichts schwebt, nichts ist verschoben, nichts ist zum leichteren Antippen aufgetürmt.
  - Echte Größenverhältnisse: Lege oben den Maßstab fest (z. B. „Wand ≈ 45 Einheiten je Meter“). Ein Mensch ist 1,60–1,85 m,
    eine Tür 2 m, eine Theke 0,9 m, ein Tisch 0,75 m, ein Stuhlsitz 0,45 m.
- **Perspektive:**
  - Eine durchgehende Augenhöhe.
  - Boden in Fluchtperspektive (Fliesen, Dielen, Pflaster), Rückwand mit Sockelleiste.
  - Seitenwände bzw. Fluchtlinien zum selben Fluchtpunkt; keine schwarzen Lücken am Bildrand.
- **Rund und echt:**
  - Verläufe statt Flachfarben, abgerundete Kanten, Lichtkanten, Spiegelungen auf Glas und Metall.
  - Texturen sparsam mit `zufall(seed)`.
  - Kein Comic, keine Emoji-Grafik.
- **Jedes Ding einzeln antippbar:**
  - Die Zeichnung selbst ist die Trefferfläche; ein Ding zeichnet nur sich selbst.
  - Was auf oder in einem größeren Ding liegt (Bon auf der Theke, Tasse auf der Maschine) oder sehr klein bzw. dünn ist,
    bekommt `oben: true`.
  - Der Stuhl unter einer sitzenden Person bleibt antippbar (eigene Fläche sichtbar oder `oben`).
  - Keine großen unsichtbaren Rechtecke über fremden Dingen.
  - Die Reihenfolge der `S.teil`-Aufrufe ist die Tiefe: hinten zuerst.
- **Lupe:**
  - Viele kleine Dinge in einem Möbel (Regal, Vitrine, Schrank, Schreibtisch) werden „unter“-Teile mit `zoom: {x, y, w, h}`
    (Ausschnitt etwa 3:2).
  - Im ganzen Bild malt das große Ding sie mit; in der Lupe sind sie einzeln anwählbar.
  - Siehe Brotregal und Vitrine der Bäckerei.
- **Glas, Licht und Spiegelung über allem:** `S.davor(svg)`. Das fängt keinen Tipp ab.
- **Wörter:**
  - Mindestens so viele wie die alte Szene, gern mehr: typische Dinge des Ortes, 18–35 Wörter einschließlich der Lupe.
  - Rechtschreibung nach Duden, immer mit Artikel (`de: "die Waage"`).
  - Silben mit Bindestrich, die betonte Silbe in GROSSBUCHSTABEN (`"BRIEF-mar-ke"`).
  - `it` und `itSyl` (Italienisch, gleiche Form) sowie `en` sind Pflicht.
  - `tipp` ist ein kurzer, wahrer Satz zum Ding (optional, gern bei 3–6 Dingen).
- **Größe:**
  - Zeichenfläche `breite: 320, hoehe: 200` (Standard).
  - Die fertige Datei gepackt unter 70 KB (die Prüfung zeigt es): Verläufe und `<pattern>` statt tausender Einzelteile. Die Seite muss schnell laden.
- **Menschen** nur über `B.mensch(spec, hoehe)` aus `bilderwelt-neu/figuren/mensch.js`, siehe Verkäuferin und Kundin der
  Bäckerei.
  - Immer bekleidet, Kinder immer bekleidet.
  - Im Bad nur mit Badekleidung oder Handtuch; keine nackten Figuren, keine Geschlechtsteile.

## Grenzen

- Ändere nur deine eigenen Dateien: `werkzeug/bilderwelt/szenen/<id>.js` und `bilderwelt-neu/szenen/<id>.js`.
  - Kein git, kein Ändern von `app.js`, `index.html`, `bau.js` oder `data-szenen.js` und keiner anderen Szene.
  - Fehlt etwas im Baukasten, baue es als Hilfsfunktion in deine Bau-Datei.
- Vorschaubilder nur in den Arbeitsordner, den dir der Auftrag nennt, nicht ins Repo.
- Kein Browser außer den beiden Werkzeugen oben; keine Netzwerkdienste außer der Websuche.
