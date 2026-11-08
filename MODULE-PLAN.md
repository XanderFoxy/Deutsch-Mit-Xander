# Bauplan 887 und Module (verbindlich)

Stand 01.11.2026. Grundlage: 886-Stand `7e23e157`. Dieser Plan gilt für beide Arbeitsbäume.
Was hier steht, wird gebaut. Was sichtbar wäre, wird nur im Funk vorgeschlagen (CLAUDE.md, Regel 3).

| Strang | Baum | Zweig | liefert | Commit-Präfix |
|---|---|---|---|---|
| LIVE | `/home/user/dmx-live` | `live-haenger` | Fassung 887 (alter Aufbau) | `WIP 887 live: …` |
| MODUL | `/home/user/dmx-module` | `module-umbau` | Vite-Grundlage und erste Module (nächste freie Nummer nach 887) | `WIP Modul: …` |

Xander, wörtlich: „Der Livestream ist das Wichtigste, weil der am meisten hängt.“ Daraus folgt: LIVE geht vor.
Wenn sich beide um Chromium, Platte oder Zeit streiten, gewinnt LIVE.

---

## 0. Feste Regeln für beide Stränge

1. **Nur im eigenen Baum arbeiten.** Nie pushen, denn die Sicherung `/tmp/claude-0/sicherung.sh` lädt alle 2 min jeden
   Arbeitsstand hoch. Nie den Verlauf umschreiben (kein rebase, amend oder reset auf geteilte Commits). Andere Zweige
   nicht anfassen. Lesen ist erlaubt (`git show live-haenger:app.js`), schreiben nicht. `SYNQUENZER.html` und den Zweig
   `dirigent-synth` nie anfassen.
2. **Früh und oft committen, mindestens alle 30 min und nach jedem grünen Teilschritt.** Ungesicherte Arbeit über
   20 min gibt es nicht. Der Pre-Commit-Haken baut `min/` und die Stempel. `min/` und die Stempel nie von Hand bearbeiten.
3. **Kein Supabase.** Messen nur gegen Attrappen. Die Sparsamkeit der Fassung 885 und die Zählung von `885-sparsam`
   dürfen nicht schlechter werden.
4. **Chromium nur über die Sperre:** `flock /tmp/claude-0/chrom.lock <befehl>`. Playwright über
   `require("/tmp/claude-0/node_modules/playwright")`, Chromium aus `/opt/pw-browsers/chromium`, Schalter
   `--no-proxy-server`. Kurzer TMPDIR: `/tmp/claude-0/t-live` bzw. `/tmp/claude-0/t-modul`.
   - MODUL hält die Sperre höchstens 10 min am Stück (kleine Sondenreihen), damit LIVE nicht verhungert.
   - Lange Messreihen macht MODUL nur, wenn LIVE gerade nicht misst.
5. **Messen:** verschränkt gegen die Vorfassung, Median, A/A-Rauschgrenze (`werkzeug/ladezeit-messen.js --gegen/--aa`).
   Ein Gewinn zählt erst über der Rauschgrenze. Ergebnisse liegen unter
   `/tmp/claude-0/-home-user-Deutsch-Mit-Xander/3dee9a82-acfe-58e0-bbb5-49b0760fb918/scratchpad/m887/<strang>/`.
6. **Platte (~17 GB frei):** keine Vollkopie des Baums. Vergleichsstände mit `git archive <commit> <pfade>`, danach
   löschen. npm nur mit `--prefix` im eigenen Baum, und erst wenn `node_modules/` in `.gitignore` steht.
7. **Nichts Sichtbares ohne Freigabe.** Aussehen, Größe und Bedienung bleiben, wie Xander sie festgelegt hat.
   - Nie ein Neuladen mitten im Klassenzimmer.
   - Ton und WebRTC (Funk 310) nicht berühren. Sonden `884-ton310`, `884-leitung` und `885-praesenz` bleiben grün.
8. **Die Fassungsnummer setzt nur die Auslieferung im Hauptbaum** (`node werkzeug/fassung-setzen.js 887`). Die Stränge
   lassen `DMA_VERSION` stehen. Im 886-Baum steht dort noch „885“.
9. **Logbuch:**
   - LIVE schreibt seinen 887-Abschnitt in `SPIELSYSTEM.md`.
   - MODUL schreibt bis zu seiner ersten Auslieferung NUR in dieses Dokument (Abschnitt 7, „Logbuch Modul“). Zwei
     Anhänge ans Ende derselben Datei würden beim Einmischen kollidieren.
10. **Zwischenstände für Xander:** Nach jeder Stufe meldet der Strang eine Zeile mit Messwert („L1 grün: Chatzeile
    180 → 70 ms, Blockade 96 → 30 %“). Der Dirigent gibt sie in den Funk weiter.
11. **Einmischen:** Nur `git merge`, kein rebase. Bei Konflikten in `min/` oder den Stempeln in `index.html` wird mit
    `node werkzeug/fassung-setzen.js --nur-stempel` neu gebaut, nie von Hand gemischt. Danach `node --check` auf alle
    geänderten `.js` und die Sonden der Fassung.

### 0.1 Erster Commit in BEIDEN Bäumen: Sonden prüfen den eigenen Baum

55 Sonden haben den Hauptbaum fest eingetragen (49× `const WURZEL = "…"`, 4× `const W = "…"`, 1× ohne Leerzeichen,
`pruefe-tutor-stuecke.js` mit zwei festen Pfaden). In `dmx-live` und `dmx-module` prüfen sie still den HAUPTBAUM und
melden damit falsches Grün.

Beide Stränge führen GENAU diesen Befehl aus. Ein Probelauf ergab 55 Dateien, `node --check` bei allen 55 ohne Fehler.
Weil die Änderungen auf beiden Seiten byte-gleich sind, gibt es beim späteren Einmischen keinen Konflikt.

```sh
sed -i -E 's#^const (WURZEL|W) ?= ?"/home/user/Deutsch-Mit-Xander";#const \1 = process.env.WURZEL || require("path").join(__dirname, "..");#; s#"/home/user/Deutsch-Mit-Xander/#require("path").join(__dirname, "..") + "/#g' werkzeug/pruefe-*.js
grep -rn '/home/user/Deutsch-Mit-Xander' werkzeug/pruefe-*.js   # muss leer sein
```

Commit-Text: `WIP 887 live: Sonden prüfen den eigenen Baum` bzw. `WIP Modul: Sonden prüfen den eigenen Baum`.

---

## 1. Kritische Prüfung der vier Analysen (Stichproben im Code, 886-Stand)

| Behauptung | Nachgesehen | Ergebnis |
|---|---|---|
| Jede Chatzeile schreibt den ganzen Verlauf neu | `livechat.js:2900–2983`; Aufruf in `nachrichtAnhaengen` bei **7634** (7611 ist der Funktionskopf); `CHAT_VERLAUF = 20000` (Z. 105) | **bestätigt.** `JSON.stringify(schlank)` geht ins Lager, zusätzlich 300 Zeilen in den localStorage, beides bei jeder Zeile |
| Doppelprüfung mit O(n) | `zustand.nachrichten.some(id)` in `nachrichtAnhaengen` | **bestätigt** |
| Jede Meldung zeichnet alles | `melden()` → `lage()` kopiert `nachrichten.slice()` (Z. 651ff). Der Zuhörer in `app.js:70255` ruft für jede Art außer „plaetze“ `renderLiveChat()` | **bestätigt** |
| Fotos stehen in jeder Zeile | `profilbilderEinsetzen` (Z. 2189), `bildKuerzen`/`bildEinsetzen` (Z. 6141ff) | **bestätigt.** Fürs SENDEN gibt es den Fingerabdruck `bildH` + `bildLager` schon. Maßnahme 1b nutzt diesen Weg, ohne einen neuen zu erfinden |
| Auto-Blätter synchron vorab gemalt | `app.js:57948` drawImage auf 16×16 (Fassung 811); `lcAuto3dVorladen` holt alle Arten im Abstand von 1,5 s (Z. 58658) | **bestätigt** |
| Spieltakt schreibt localStorage | `spiel.js:16771ff`: 2× `setItem` pro Takt, dazu 14 Pflege-Funktionen nacheinander | **bestätigt** |
| eval und synchrones XHR in app.js | `app.js:39` `dmaTeilAuswerten`, `dmaTeilSofort` Z. ~295 | **bestätigt** |
| supabase-js ungepinnt | `index.html:444` `@supabase/supabase-js@2` | **bestätigt** |
| Haken schluckt Fehler | `.git/hooks/pre-commit`: `node werkzeug/fassung-setzen.js --nur-stempel >/dev/null && git add index.html min; exit 0`, gemeinsam für alle Bäume | **bestätigt.** Er ruft das `fassung-setzen.js` des JEWEILIGEN Baums. MODUL kann das Werkzeug also ändern, ohne den Haken-Text anzufassen |
| 49 Sonden mit festem Hauptbaum | grep | **berichtigt: 55 Dateien** (siehe 0.1) |
| Walkie wird einzeln nachgeladen | `index.html:1127` `dmaWalkieLaden` mit Rückfall bei Fehler | **bestätigt.** Das ist der ideale erste Modul-Pilot |

**Wertungen und Berichtigungen:**

- **Hauptursache Livestream:** Die Analyse LIVE trägt, ihr Nachbau passt zu den Felddaten. Die Feld-INP auf
  `#livechatArea`/`lc-platz`/`#tutorReiter` sind reine Wartezeit auf den Hauptfaden, keine teuren Handler. Deshalb
  steht Maßnahme 1 (chatSichern) an erster Stelle.
- **Module beheben die Hänger nicht.** Darin sind sich alle vier Analysen einig. Ein Vite-Bau allein ist 0,99× so groß
  wie heute. Gewinn bringen nur Aufteilen, Laden bei Bedarf, Code-Cache statt `eval` und kleinere Updates. Darum läuft
  LIVE im alten Aufbau und wird nicht auf die Module warten.
- **Auto-Blätter (LIVE-Maßnahme 3), Speicher:** Alle Blätter dauerhaft als `ImageBitmap` halten heißt etwa 92 MB fest
  belegt. Auf einem 4-GB-Telefon mit WebRTC-Video kann das die WebView abschießen, und dann ist das Klassenzimmer weg.
  Darum wird zuerst mit `img.decode()` dekodiert: abseits des Hauptfadens, der Speicher bleibt wie heute. Ein
  ImageBitmap gibt es nur für den laufenden Auftritt, danach folgt `close()`.
- **chatSichern (LIVE-Maßnahme 1a):** Auch der localStorage-Teil (300 Zeilen) muss ohne Fotos geschrieben werden, sonst
  bleibt er bei Foto-Autoren teuer.
- **Ausgabeordner:** Die Analyse MODUL schlägt `m/` vor, die Analyse BETRIEB `bau/`. **Entscheidung: `bau/`.** Kein
  Name beginnt mit `_` oder `.`, Jekyll veröffentlicht ihn also. Das Manifest liegt als `bau/manifest.json` NICHT in
  `.vite/`.
- **`package.json` darf KEIN `"type": "module"` haben.** Sonst behandelt Node alle `werkzeug/*.js` als ES-Module, und
  sämtliche Sonden (`require`) brechen. Die Vite-Einstellungen stehen deshalb in `vite.config.mjs`.
- **Version von supabase-js:** Die Analysen nennen 2.117.3 bzw. 2.118.0. Gepinnt wird genau die Fassung, die jsDelivr am
  Bautag für `@2` ausliefert (`curl -sI …@2/dist/umd/supabase.js`, Weiterleitung lesen). Sie kommt ins Logbuch.
- **Nicht in 887**, weil Verbindung und Ton berührt sind oder etwas sichtbar würde:
  - Realtime `worker:true` und „Raumverkehr in Stufen“ aus der Analyse LEISTUNG (Nr. 6 und Nr. 1): später, mit
    Ton-Sonde.
  - Folgende Punkte nur als Vorschlag im Funk: Film-Kontext (Nr. 6), Deko-Animationen (Nr. 7), Sprechring (Nr. 9) und
    Verlauf erst beim Hochrollen (Nr. 2b).
- **Pilot aus app.js (tutor/betonung):** Die Funktionen liegen über die ganze Datei verstreut (Z. 6950 … 100954).
  Machbar, aber nicht der schnellste Anfang. Erster Pilot ist deshalb `rueckfrage.js`: eine ganze Datei mit eigenem
  Lader und eingebautem Rückfall.

---

## 2. Strang LIVE → Fassung 887 (alter Aufbau)

**Ziel:** Der Dauerhänger bei Chat-Flut verschwindet, Eingaben antworten ohne Wartezeit, und das Betreten des Raums
blockiert nicht mehr sekundenlang. Alles bleibt unsichtbar, die Supabase-Abfragen werden gleich viele oder weniger.

**Reihenfolge:** L0 → L1 → L7 → L6 → L4 → L2 → L3 → L5. Jede Stufe bekommt einen eigenen Commit, eine eigene Sonde und
eine Messung gegen 886.

### L0. Grundlinie
- Zuerst Befehl 0.1 ausführen und committen.
- Danach die Werkzeuge aus `scratchpad/m887/livestream/` (`lsh.js`, `mikro.js`, `spur.js`, `ana.js`) auf den Baum
  `dmx-live` richten.
- Die 886-Grundlinie einmal festhalten: 7 000 Zeilen, 6 andere im Raum, Flut von 1 Zeile/s für 20 s, CPU 4× und 6×,
  ohne Fotos und mit Fotos (3 von 30 Autoren).
- Gemessen werden: Blockade-Anteil, längster Rahmen, Wartezeit eines Tipps, Kosten je Zeile und je Verlauf-Seite.

### L1. chatSichern vom Empfang entkoppeln (größter Hebel)
- `chatSichernBald()` ersetzt an allen Aufrufstellen den direkten Aufruf: `nachrichtAnhaengen` (7634) sowie die
  Stellen 6765, 7902, 7945 und 8284.
  - Es setzt eine Marke „schmutzig“ und plant einen Lauf per `requestIdleCallback({timeout: 5000})`, ersatzweise
    `setTimeout`.
  - Zwischen zwei echten Läufen liegen mindestens 20 s.
- **Sofort und synchron** läuft `chatSichern()` bei `pagehide`, `visibilitychange → hidden`, in `verlassen()` (8540,
  bzw. dem bestehenden Aufruf 8609), in `chatLeeren` und beim Raumwechsel. `pruefVerlaufSetzen` bleibt sofort.
- **Fotos einmal:**
  - In der gespeicherten Zeile (Lager UND localStorage-300) wird ein `data:image` in `n.bild` durch `bildH`
    (`bildFinger`) ersetzt.
  - Das Foto selbst geht je Autor und `bildH` einmal über `lagerEinmal` ins Lager, unter dem Schlüssel
    `"chatbild:" + bildH`.
  - Beim Lesen wird es wieder eingesetzt. Das alte Format mit dem Foto in der Zeile bleibt lesbar.
- **Doppelprüfung:** ein Kennungs-Set neben `zustand.nachrichten`. Wechselt die Array-Referenz, wird das Set neu
  aufgebaut (Wächter `set.quelle !== zustand.nachrichten`). So muss nicht jede Ersetz-Stelle angefasst werden.
- Der `lagerGelesen`-Schutz bleibt unverändert: kein Überschreiben vor dem Lesen.
- **Neue Sonde `werkzeug/pruefe-887-sichern.js`:**
  - (a) Bei einer Flut läuft chatSichern höchstens 1× in 20 s.
  - (b) Nach `pagehide` enthalten Lager und localStorage alle Zeilen.
  - (c) Nach dem Neuladen ist der Verlauf vollständig, die Fotos sind wieder da, Sprachnachrichten und Bilder kommen
    aus dem Lager.
  - (d) Ein Speicherstand im 886-Format wird richtig gelesen.
  - (e) Gegenprobe gegen 886 ist rot.
- **Mitlaufen** müssen alle Sonden zu Verlauf, Lager, Sprachnachrichten und Bildern sowie `884-leitung`,
  `885-praesenz` und `885-sparsam`.
- **Ziel bei CPU 4×:**
  - eine Zeile ≤ 90 ms (heute 178 ms ohne Fotos, 587 ms mit Fotos)
  - Blockade in der Flut ≤ 35 % (heute 79–96 %)
  - kein Rahmen über 300 ms

### L7. supabase-js pinnen (eine Zeile, Stabilität)
- In `index.html:444` wird `@2` durch die am Bautag ausgelieferte Fassung ersetzt.
- Sonden: `884-leitung`, `885-praesenz`, `884-ton310`, `885-sparsam`.

### L6. Feldmessung schärfen
- **`messung.js`, `loafObs` (Z. 369ff):** Je Long Animation Frame werden die 3 längsten Skripte festgehalten, mit
  `invoker`, `invokerType`, `sourceURL@charPosition` und Dauer. Dazu kommen `blockingDuration`, `renderStart` und
  `styleAndLayoutStart`.
- **`raumBauen` (Z. 422ff):** zusätzlich die Zahl der Verlaufzeilen, die Zeichenzahl der letzten Sicherung und die
  Zahl der Sicherungen pro Minute.
- Alles läuft in derselben Sendung, ohne zusätzliche Anfrage. Die Größenbremse gilt, Inhalte werden keine
  mitgeschickt.

### L4. Auto-Blätter ohne Ruck
- **Vorab-Malen ersetzen:** Statt des synchronen Vorab-Malens (`app.js:57948`) läuft
  `Promise.all(bilder.map(i => i.decode()))`.
  - Das dekodiert abseits des Hauptfadens, der Speicher bleibt wie heute.
  - Ohne `decode` gilt der alte Weg, aber nur in einer Leerlauf-Pause.
- **Im Auftritt (`lcAuftrittAuto3d`, Schleife Z. 58238):**
  - Vor dem ersten Bild werden die nötigen Blätter per `createImageBitmap` vorbereitet, asynchron und mit höchstens
    250 ms Warten. Gelingt das nicht, zeichnet der Auftritt wie heute.
  - Nach dem Auftritt folgt `close()`.
- **Unverändert bleiben:** der Vorlade-Plan, welche Arten wann geladen werden, und die Blattgröße. Halbe Blätter für
  Telefone wären sichtbar, das geht nur als Vorschlag.
- **Neue Sonde `werkzeug/pruefe-887-auto.js`:**
  - Das Vorladen erzeugt bei CPU 4× keinen Langläufer über 100 ms (heute 1 130 ms).
  - Der Auftritt startet nicht später als bei 886 (innerhalb der Rauschgrenze).
  - Erstes und mittleres Bild sind pixelgleich mit 886.

### L2. Verlauf schlank verarbeiten (Maßnahme 2a, unsichtbar)
- `verschmelzen` (2486) wird ein Merge zweier sortierter Listen statt `concat` + Sortieren.
- **Nach Hintergrund-Seiten** (`verlaufRestHolen` 7862) kein volles `melden()` mehr. Stattdessen `melden("aeltere")`:
  Der Zuhörer frischt dann nur Zahl und Knopf der älteren Zeilen auf.
- **`verlaufFrischHolen` (7907)** hängt nur neue Zeilen an.
- Seiten werden in Leerlauf-Stücken verarbeitet. Gesichert wird nur über L1.
- **NICHT bauen:** Das Vorholen bis 20 000 Zeilen bleibt (2b ist ein Vorschlag im Funk).
- **Sonden:** Doppelzeilen, Bildzwillinge, `ZUSATZ_FELDER`, Hochrollen/`lcAeltereLaden`.
- **Ziel:** je Verlauf-Seite ≤ 120 ms bei CPU 4× (heute 237–390 ms, mit Fotos 1,45 s).

### L3. Neue Zeile nur anhängen, Zeichnen pro Bild bündeln
- **Eigene Meldeart:** `empfangen("text")` und `nachrichtAnhaengen` melden `melden("zeile")`.
- **Zuhörer** (`app.js:70255`): Bei „zeile“ zeichnet er nur `livechatChatAuffrischen`, nicht Plätze, großes Bild und
  Streifen.
- **Bündeln:** Alle Meldungen eines Bildes werden per `requestAnimationFrame` zu EINEM Zeichnen zusammengefasst.
  - Ist eine Meldung ohne Art dabei, folgt ein volles `renderLiveChat()`.
  - Bei `document.hidden` wird nur eine Marke gesetzt, gezeichnet wird beim Zurückkommen.
- Die Marke wird nur für neue oder geänderte Zeilen gebildet.
- `lcNachUnten` läuft einmal pro Bild, ohne direkt nach dem Schreiben zu lesen.
- **Sonden:** alle Chat-Sonden, `livechatEffekteAb`, Lehrer-Zustand, Aufgabe/Bezug, Bilder aus dem Lager, Halten am
  Ende beim Rollen. Wo eine Sonde direkt nach dem Ereignis ins DOM sieht, wird ein Bild gewartet. Die Sonde wird dafür
  nicht abgeschwächt.
- **Ziel:** eine Zeile ≤ 40 ms bei CPU 4×.

### L5. Spieltakt entschärfen
- In `zeichnen()`/`schmuck()`/den LP-Bögen (`spiel.js:6007/6086/6233`) erst alle Maße lesen, dann alle Stile
  schreiben. Stile nur bei Änderung setzen.
- `localStorage.setItem(dma_spiel_dabei/raum)` nur bei Änderung.
- **DOM-Pflege** (zeichnen … schnellZeichnen) nur, wenn sich das Zeichen aus Stand, Plätzen und Sichtbarkeit geändert
  hat oder das Klassenzimmer sichtbar ist.
- **Unverändert:** `abrufen()` und das ganze Netzverhalten (`885-sparsam`).
- **Erhalten bleiben müssen:** flüchtige Klassen (`sp-feuert`, Tierreaktionen), `platzWaechter` und alle
  `pruefe-spiel*`.

### Schnitt und Übergabe
- **Lieferpunkt A (Mindest-887):** L0 + L1 + L7 + L6 grün und gemessen. Ist 886 schon auf main und brauchen L4/L2/L3/L5
  danach mehr als 3 h, liefert der Dirigent A sofort als 887. Der Rest folgt dann als 888.
- **Lieferpunkt B (volles 887):** zusätzlich L4 und L2. L3 und L5 kommen nur mit, wenn sie bis dahin grün sind, sonst
  in 888.
- **Übergabe:**
  - zuerst den finalen 886-Commit per `git merge` einmischen (Stempel neu bauen, siehe 0.11)
  - alle Sonden der Stufen + `885-sparsam`, `885-rueckkehr`, `885-swvorladen`, `884-notweg`, `884-leitung`,
    `885-praesenz`, `884-ton310` laufen lassen
  - den 887-Abschnitt in `SPIELSYSTEM.md` schreiben
  - einen Prüfbericht mit Messtabelle (886 gegen 887, Median, Rauschgrenze, CPU 4×/6×, ohne/mit Fotos)
- Ausgeliefert wird im Hauptbaum.

---

## 3. Strang MODUL → Vite-Grundlage und erste Module

**Schnitt gegen LIVE:**
- MODUL fasst bis zum Einmischen von 887 diese Dateien NICHT an: `livechat.js`, `spiel.js`, `messung.js`,
  `filmspieler.js`, `klassenzimmer.js`, `livechat.css`.
- In `app.js` sind diese Bereiche gesperrt: `lcAuto3d*` (Z. 57900–58700), `livechatChatAuffrischen`, `lcAmEndeHalten`,
  `lcNachUnten`, `renderLiveChat` (Z. 67800–69400) und der LiveChat-Zuhörer (Z. 70200–70300).
- Vor jedem Commit, der `app.js` berührt: `git diff 7e23e157 live-haenger -- app.js` lesen, um Überschneidungen
  auszuschließen. Das ist nur Lesen.

### M0. Sicherung zuerst
- `.gitignore` bekommt `node_modules/` (die Zeile `.claude/` bleibt). Committen, BEVOR irgendein `npm install` läuft.
  Sonst landen rund 32 MB in `claude/sicherung-module`.
- Befehl 0.1 ausführen. Beides committen.

### M1. Gerüst (ohne Verhaltensänderung)
- **Pakete:**
  - `package.json` mit `"private": true`, OHNE `"type"`.
  - `npm install --prefix /home/user/dmx-module --save-dev --save-exact vite@6.3.5`
  - `package-lock.json` committen.
- **`vite.config.mjs`:**
  - Allgemein: `base: "./"`, `publicDir: false`.
  - `build`:
    - Ausgabe: `outDir: "bau"`, `emptyOutDir: false`, `manifest: "manifest.json"` (also `bau/manifest.json`).
    - Ziel und Verkleinern: `target: "es2020"`, `modulePreload: { polyfill: false }`, `minify: "esbuild"`,
      `sourcemap: false`.
  - `rollupOptions`:
    - `input` = jede Datei in `src/*.js` als eigener Eingang.
    - `preserveEntrySignatures: "strict"`, `treeshake: { moduleSideEffects: true }`.
    - `output.entryFileNames "[name]-[hash].js"`, `chunkFileNames "t-[name]-[hash].js"`,
      `assetFileNames "t-[name]-[hash][extname]"`.
    - `onwarn`: `EMPTY_BUNDLE`, `MISSING_EXPORT`, `CIRCULAR_DEPENDENCY` und `EVAL` werfen einen Fehler.
- **Flacher Graph (gegen die Hash-Kaskade):**
  - Eingänge importieren einander nicht statisch.
  - Geteilt wird über die bestehende window-Brücke (`window.LiveChat`, `Backend`, `DMA_*`).
  - Laden bei Bedarf geht über den Namen aus `DMA_MODUL`, nicht über `import("./x.js")` im Aufrufer.
  - Kleine Helfer kommen lieber doppelt in jedes Stück als in einen gemeinsamen Kern.
- **`werkzeug/fassung-setzen.js --nur-stempel`** wird erweitert. Der Haken-Text bleibt unverändert.
  - (a) Eine Prüfsumme über `src/**`, `vite.config.mjs` und `package-lock.json` wird mit `bau/quelle.json` verglichen.
    Gebaut wird nur bei einer Änderung, mit `node_modules/.bin/vite build`.
  - (b) Aus `bau/manifest.json` entsteht die Zeile `window.DMA_MODUL = {"rueckfrage":"bau/rueckfrage-XXXXXXXX.js",…}`
    direkt hinter `DMA_STEMPEL`.
  - (c) `git add bau index.html` übernimmt das Werkzeug selbst.
  - (d) Bei einem Baufehler bleiben der alte `bau/` und das alte `DMA_MODUL` stehen, es gibt eine laute Meldung auf
    stderr und Rückgabe ≠ 0. Ohne Vite (kein `node_modules`) gilt dasselbe.
  - (e) Aufräumen: Gelöscht wird nur, was keines der letzten 3 Manifeste aus git mehr nennt.
  - `min/` bleibt bis zum Ende des Umbaus bestehen.
- **`sw.js`:**
  - Neue Regel für `bau/*-[A-Za-z0-9_-]{8}.(js|css|json)`: erst aus dem Speicher, sonst aus dem Netz, OHNE
    SHA-1-Nachrechnen.
  - Je Grundname höchstens 2 Generationen.
  - Die Konstanten-Namen (`KASTEN`, `SEITE`, „draussen“) bleiben.
  - Die Sonden `885-swvorladen` und `885-rueckkehr` werden um Fälle für `bau/` erweitert.
- **Sonden:**
  - `werkzeug/pruefe-887-bau.js` prüft:
    - keine Eingangsdatei ist leer
    - kein Name beginnt mit `_` oder `.`
    - Manifest, `DMA_MODUL` und Dateien stimmen überein
    - die Stücke der letzten 3 Fassungen sind vorhanden
    - beim Start gibt es keine 404
    - `src`-Prüfsumme = `bau/quelle.json` (fängt einen Commit, bei dem der Bau fehlgeschlagen ist)
    - Kaskaden-Test: eine 1-Zeilen-Änderung benennt nur ihr eigenes Stück um
  - `werkzeug/pruefe-887-bruecke.js` (Brückenwächter):
    - Geprüft wird nach dem Laden in drei Fällen: als Gast, mit Konto und mit offenem Klassenzimmer, jeweils mit `min`
      und mit `?quelle`.
    - Die window- und globalen const-Namen müssen eine Obermenge von `werkzeug/bruecke-liste.json` bleiben.
    - Die Reihenfolge stimmt, und es gibt keinen `pageerror`.
  - `werkzeug/quelle-lesen.js`: liefert die „logische Datei“ (z. B. `app.js` + `src/app/**`). Die Sonden, die
    Quelltext lesen, stellen erst um, wenn etwas aus ihrer Datei umzieht.

### M2. Pilot: `rueckfrage.js` (Walkie) als Modul
- `src/rueckfrage.js` ist der Inhalt der IIFE als Modulkörper, 1:1. Die window-Exporte bleiben (`window.Rueckfrage` …).
- **`dmaWalkieLaden` in `index.html` (Z. 1127):**
  - Steht `DMA_MODUL.rueckfrage` und kein `?quelle`, gilt `s.type = "module"; s.src = <bau-Datei>`.
  - Mit `?quelle` wird `src/rueckfrage.js` als natives Modul geladen.
  - `onerror` führt zum klassischen `min/rueckfrage.js` und von dort zur Quelle, so wie heute. Der Walkie hat damit
    immer einen Rückweg.
- Die klassische Datei bleibt eine Fassung lang als Rückfall liegen.
- **Sonden:** alle `pruefe-*rueckfrage*`/Walkie-Sonden, `pruefe-887-bau`, `pruefe-887-bruecke`, `884-notweg`,
  `885-sparsam`.
- **Messung:** Fälle kalt, wieder und sw gegen 886 (es darf nicht langsamer werden).
- **Damit ist das Muster einmal von Anfang bis Ende erprobt:** Haken, Bau, Lader, SW, `?quelle`, Rückfall, Sonden.
- **Lieferbar** als erste Modul-Fassung (nächste freie Nummer nach 887).
- **Übergabe (MODUL, gilt für jede Modul-Fassung):**
  1. `node werkzeug/pruefe-887-bau.js` (B und S) muss grün sein, VOR jeder Auslieferung und vor jedem Einmischen.
     Grund: Der Haken vor dem Commit meldet einen gescheiterten Vite-Bau nur auf stderr und lässt den Commit durch
     (der Haken-Text bleibt für alle Bäume gleich). B5 fängt einen solchen Commit.
  2. `node werkzeug/fassung-setzen.js <zahl>` bricht bei einem Baufehler oder auseinanderlaufendem Gleichlauf ab,
     BEVOR `DMA_VERSION` oder `fassung.json` sich ändern (Rückgabe 1, 887-bau B8).
  3. Mit Daten-Stücken (M3): `node werkzeug/pruefe-887-daten.js` grün.
  4. Danach die Sonden und die Messung der Stufe wie oben.

### M3. Übungsdaten als JSON (echter Gewinn für schwache Geräte)
- **Neues Werkzeug** `werkzeug/daten-bauen.js`:
  - Es erzeugt aus der unveränderten JS-Quelle `bau/daten/<name>-<hash>.json`.
  - Ein Tiefenvergleich prüft, dass nichts verloren geht. Bearbeitet wird weiter die JS-Quelle.
  - Die Einträge kommen in `DMA_MODUL`.
- **Reihenfolge:**
  1. `data-uebungen.js` (6,1 MB, nach Kategorie geteilt, geladen nur die gebrauchte Kategorie)
  2. `vokabeln/*.js`
  3. `kalender/*.js`
  4. die übrigen reinen `data-*.js`
- **Ausgenommen:** `data-lesetexte` (Bau-Funktion), `data-exercises` und `data-vocab` (Code).
- Geholt wird per `fetch`, das Parsen läuft mit `JSON.parse`. Die Nutzer warten auf ein Promise (`ladeDatenteil`,
  `wortschatzNachziehen`).
- **Gemessen** (Node, Parsen): JS → JSON 2,4× (`data-uebungen`), 7× (`vokabeln/alltag`), 2,9× (`kalender`).
- **Sonden:** alle Übungs-, Wortschatz- und Kalender-Sonden. Neue Sonde `pruefe-887-daten.js`: JSON = Quelle,
  Kategorie lädt einzeln.
- **Ergebnis 01.11. (Logbuch Modul): JSON ist im Browser LANGSAMER als das Skript** (Chromium, CPU 4×; eine Kategorie
  kalt +15 ms, wieder +27 ms; ganze Datei +647/+787 ms; mit Service Worker dasselbe). Das Skript wird beim Laden
  nebenher übersetzt und ab dem dritten Laden aus dem Code-Speicher genommen, JSON nicht. **M3 als JSON entfällt.**
- **M3b (vom Dirigenten freigegeben, gebaut im Zweig `module-umbau` ab 19b63a53, Logbuch Abschnitt 7): nach Kategorie teilen, aber als SKRIPT.** Der Hebel
  ist nicht das Format, sondern die Menge: „Lernen“ wartet heute auf die ganze Sammlung (6,0 MB, 1,2 MB gepackt:
  4G ~1,1 s, 3G ~6 s Leitung, dazu 262 ms Ausführen bei CPU 4× mit einem Langläufer von 75 ms). Die Übersicht
  braucht ohne gewählte Kategorie gar keine Aufgaben (nur `maxAvailable` der GEWÄHLTEN Kategorien liest die Sammlung);
  eine Kategorie wiegt gepackt 9 KB (Median) bis 86 KB (`it-alltag`) und braucht 31 ms kalt, 10 ms wieder.
  - Bau: aus `data-uebungen.js` je Kategorie eine Skript-Datei (erzeugt wie `min/`, Name aus dem Inhalt), Karte der
    Kategorien in `DMA_MODUL` (+1,3 KB gepackt in `index.html`) oder ein kleines Verzeichnis.
  - App: `ladeUebungen(ids)` lädt nur diese; `renderSetup` zeichnet sofort und lädt bei der Wahl; „Runde starten“
    wartet auf die gewählten. Ganze Sammlung weiter für Kalenderrücken (Tagesaufgabe), Wörterbuch-Erweiterung und
    `spiel.js` (gesperrt, lädt `data-uebungen.js` selbst).
  - Messen: neuer Fall „Übung öffnen“ (Tipp „Lernen“ → Karten; Wahl → Start) in `ladezeit-messen.js`, 4G/3G,
    kalt/wieder/sw, gegen die Vorfassung.
  - Platz: GitHub Pages steht bei 947,6 MB von 1 GB (Abschnitt 6, Nr. 6). Die geteilten Dateien kämen zur ganzen
    Datei dazu (einmal +6 MB; danach je Änderung nur die geänderten Kategorien, weil der Name aus dem Inhalt kommt).

### M4. app.js-Pilot: tutor + betonung
- Die Gruppen ziehen nach `src/app/tutor.js` bzw. `betonung.js`.
  - Helfer bekommt das Modul über `window.DMA_APP` (in app.js gesetzt und erst beim Aufruf gelesen).
  - Die Eingänge stellt `src/bruecke.js` unter dem alten Namen auf `window`, mit einer Prüfung, dass nichts
    überschrieben wird.
  - In app.js bleiben dünne Weiterleitungen.
- `teile-bauen.js` lässt die verschwundenen Namen von selbst weg.
- Erst nach M2, mit Brückenwächter und `quelle-lesen` für die betroffenen Sonden.

### M5. Stadt als eigene Vite-Seiten (dritter Agent möglich, sobald M1 steht)
- `stadt.html`/`stadt-leicht.html` werden Vite-Mehrseiten-Einträge. Die Packer `stadt-packen.js`/`leicht-packen.js`
  entfallen.
- Die Hauptseite ist dabei nicht berührt.
- Sonden: `pruefe-stadt-*`, `-844`, `?quelle=1`, Ladebild.

---

## 4. Danach bis zum vollständigen Umbau (Reihenfolge verbindlich)

Jeder Schritt ist eine eigene Fassung und wird verschränkt gegen die Vorfassung gemessen. Der Brückenwächter muss grün
sein. Notweg und `?quelle` bleiben als Rückfall.

| # | Schritt | Voraussetzung | Kern |
|---|---|---|---|
| 5 | **887 einmischen** in `module-umbau` (`git merge main`) | 887 (und ggf. 888) live | Ab hier gilt der Klassenzimmer-Code mit den 887-Änderungen |
| 6 | **spiel.js → `src/spiel/`** | 5 | `dmaSpielLaden` ruft `import()`. Danach Aufteilen in einen Raum-Takt-Kern und die Inhalte als dynamische Stücke |
| 7 | **Klassenzimmer A: `livechat.js` 1:1 als Modul** | 5 | Gleicher Code, gleicher Platz in der Reihenfolge, window-Brücke. Sonden `884-leitung`, `885-praesenz`, `884-ton310` |
| 8 | **Klassenzimmer B: lc/livechat/kz aus app.js** in dünnen Scheiben nach `src/raum/` | 7 | 215 eigene Hüllvariablen ziehen mit, die 25 geteilten werden zu `raumZustand`. EINE asynchrone Grenze beim Öffnen und Zurückkehren (`import`), danach gibt es im Raum kein synchrones XHR und kein `eval` mehr (Code-Cache: −300…−500 ms je Öffnen auf dem schwachen Android). Die Scheibe mit der Grenze wird einzeln ausgeliefert |
| 9 | **Klassenzimmer C: Chat-Effekte** als je eigenes dynamisches Stück | 8 | Vorladen in der Ruhepause wie heute |
| 10 | **Startpfad:** core, bildverwaltung, data-vocab, quiz, baukasten, backend 1:1 als Module, supabase-js als eigenes gepinntes Stück `bau/supabase-*.js` | 9 | backend.js OHNE Logikänderung (Bremse 885, Start-Tor 886, `885-sparsam` 162 Prüfungen). Der Inline-Lader in `index.html` bleibt klassisch |
| 11 | **Rest von app.js** (Postfach, Freunde, Admin, Beta, Reise, Profil …) als dynamische Stücke. Danach `dmaTeil*`, `teile-bauen.js`, `app-teile.json` und `min/` stilllegen | 10 | Update-Download nur noch für echte Änderungen (885→886 heute 1 075 KB gz, mit Stücken etwa 290 KB) |
| 12 | **Brücke abbauen:** window-Namen, die kein klassisches Skript mehr liest, fallen weg | 11 | Was Sonden und Messung brauchen, bleibt |

Parallel und unabhängig: M5 Stadt. Ebenfalls unabhängig ist Kritisches CSS nach Bereichen (Analyse LEISTUNG, Nr. 5).
Dafür ist vorher ein Pixelvergleich je Ansicht Pflicht.

---

## 5. Zeitplan (ehrlich)

Geschätzt, nicht gemessen. Der Engpass ist die eine Chromium-Reihe (443 Browser-Sonden), nicht das Schreiben des Codes.
Dazu kommen das Wochenlimit und Freigaben von Xander. Die Daten nehmen an, dass ohne lange Pausen gearbeitet wird.

| Was | Arbeitszeit | fertig zum Ausliefern |
|---|---|---|
| 886 | Hauptbaum, letzte Prüfung | heute (01.11.) |
| **887 Lieferpunkt A** (L1 chatSichern + L7 + L6) | 4–6 h | **heute Nacht / 02.11. früh** |
| **887 voll** (+ L4 Auto, L2 Verlauf; L3/L5 wenn grün) | weitere 5–8 h | **02.11.** |
| 888 (L3/L5, falls nicht in 887) | 3–5 h | 02.–03.11. |
| M0 + M1 Gerüst, SW, Bau- und Brücken-Sonde | 1 Tag (parallel zu 887) | 02.11. |
| M2 Pilot Walkie → **erste Modul-Fassung** | ½ Tag | **03.11.** |
| M3 Übungsdaten JSON | 1–1½ Tage | 05.11. |
| M4 tutor/betonung; M5 Stadt (parallel) | je 1–2 Tage | 06.–07.11. |
| 6–7 Spiel und Klassenzimmer A | 2–3 Tage | ~11.11. |
| 8–9 Klassenzimmer B und C (mehrere Fassungen) | 1½–2 Wochen | ~22.11. |
| 10–12 Startpfad, Rest, Abschluss | 1 Woche | **~29.11.–06.12.** |

**Ganzer Umbau: 3½–5 Wochen, Ende November bis Anfang Dezember.** Der Livestream-Gewinn kommt mit 887 sofort und hängt
nicht am Umbau. Der zweite spürbare Gewinn im Raum kommt mit Schritt 8: kein `eval` und kein synchrones Nachladen mehr.

---

## 6. Vorschläge an Xander (brauchen sein Ja, werden NICHT gebaut)

1. Ältere Chatzeilen erst beim Hochrollen nachladen statt beim Betreten bis 20 000 vorzuholen. Das spart Abfragen und
   Rechenzeit; beim Hochrollen gibt es ein kurzes Nachladen.
2. Deko-Animationen (Wetter-Sterne, Tutor-Atmen, verdeckte Laufschrift) pausieren, solange das Klassenzimmer offen ist.
   Vorher wird das mit einer Gerätespur bestätigt.
3. Halb so große Auto-Blätter für Telefone (ein Viertel Speicher und Dekodierzeit).
4. Auf schwachen Geräten bei Szenen-Filmen keine Vollbild-Unschärfe.
5. Sprechring mit kurzer Mindesthaltezeit gegen Flattern.
6. `werkzeug/backup` (234 MB) aus der Veröffentlichung nehmen (Pages-Grenze 1 GB, heute 947,6 MB).

---

## 7. Logbuch Modul (bis zur ersten Modul-Auslieferung hier, danach in SPIELSYSTEM.md)

- 01.11. Bauplan festgelegt (dieses Dokument). Stichproben siehe Abschnitt 1. Der Sed-Befehl aus 0.1 wurde an einer
  Kopie geprüft: 55 Dateien, `node --check` 55/55 ohne Fehler.
- 01.11. **Modul-Umbau — Schritt 1 (M0, M1, M2): Vite-Grundlage und das Walkie als erstes Modul.** Zweig
  `module-umbau`, Grundlage 7e23e157 (886). Alles unsichtbar; Gäste und Schüler laden nichts anderes als bisher.
  - **M0:** `.gitignore` + `node_modules/` (eigener Commit vor jedem npm), dann Befehl 0.1: 55 Dateien, grep leer,
    `node --check` 55/55.
  - **M1 Gerüst:** `package.json` (privat, ohne `"type"`), `vite@6.3.5` und **`esbuild@0.28.2` exakt gepinnt**.
    Grund für esbuild oben: Vite bringt esbuild 0.25.12 mit; `require("esbuild")` in `fassung-setzen.js`,
    `teile-bauen.js`, `stadt-packen.js` … hätte sonst dieses gegriffen und `min/` anders verkleinert (neue Stempel für
    alle Dateien, jedes Gerät hätte alles neu geholt). Geprüft: `min/rueckfrage.js`, `core.js`, `quiz.js` mit dem
    gepinnten esbuild Byte für Byte gleich; `fassung-setzen.js` nimmt für `min/` nur 0.28.2 (Fassung geprüft).
    `vite.config.mjs` wie Plan (base `./`, outDir `bau`, Manifest `bau/manifest.json`, es2020, kein
    modulePreload-Polyfill, `[name]-[hash].js`, `preserveEntrySignatures: "strict"`, onwarn EMPTY_BUNDLE /
    MISSING_EXPORT / CIRCULAR_DEPENDENCY / EVAL = Baufehler; Eingänge = `src/*.js`, flacher Graph).
    `werkzeug/modul-bauen.js` (aus `fassung-setzen.js --nur-stempel`, Haken-Text unverändert): Prüfsumme über
    `src/**`, `vite.config.mjs`, `package-lock.json` gegen `bau/quelle.json`, gebaut nur bei Änderung, in einen
    leeren Ordner außerhalb des Baums, erst nach ganzem Erfolg nach `bau/` (Manifest zuletzt); Baufehler oder kein
    Vite → `bau/` und `DMA_MODUL` bleiben, laute Meldung, Rückgabe 2 (Stempel für `min/` trotzdem). `git add
    index.html min bau` macht das Werkzeug selbst (bei Rückgabe ≠ 0 fügt der Haken nichts mehr an – `min/` muss
    aber zu den Stempeln passen). Aufräumen nur, was weder das neue noch eines der letzten 3 Manifeste aus git nennt.
    `window.DMA_MODUL` steht direkt hinter `DMA_STEMPEL`; `DMA_STEMPEL` nennt jetzt auch `src/rueckfrage.js`
    (für `?quelle`). Ein Bau dauert 0,7 s.
  - **sw.js:** Regel für `bau/…-<8 Zeichen>.(js|css|json)` ohne Abfrage: zuerst aus `dma-dateien-1`, sonst Netz,
    ohne SHA-1; je Grundname (`bau/rueckfrage.js`) höchstens 2 Generationen (die zuletzt abgelegten). Konstanten
    unverändert.
  - **M2 Walkie als Modul:** `src/rueckfrage.js` = Körper der Hülle 1:1 (2 Leerzeichen weniger eingerückt,
    `return {` → `window.Rueckfrage = {`; „use strict“ bleibt). `dmaWalkieLaden`: mit `DMA_MODUL.rueckfrage`
    `<script type="module" src="bau/rueckfrage-CfC8vCNA.js">`, mit `?quelle` `src/rueckfrage.js` nativ; Fehler →
    der bisherige klassische Weg (min/ → Quelle); Browser ohne Module (`noModule` fehlt) → gleich klassisch. Bau:
    30 308 B (gz 11 327) gegen `min/rueckfrage.js` 30 344 B (gz 11 335) – gleich groß, wie erwartet (Module allein
    machen nichts kleiner, Abschnitt 1).
  - **Gleichlauf:** `rueckfrage.js` bleibt eine Fassung lang als Rückfall. **Bearbeitet wird ab jetzt
    `src/rueckfrage.js`**; den Rückfall schreibt `node werkzeug/quelle-lesen.js --klassisch rueckfrage.js >
    rueckfrage.js` (Rundreise Byte für Byte geprüft). Laufen beide auseinander, meldet es jeder Commit laut
    (Rückgabe 2) und 887-bau B6 ist rot.
  - **Neue Sonden:** `pruefe-887-bau.js` (B1–B9 ohne Browser, S im Browser) und `pruefe-887-bruecke.js`
    (Brückenwächter, Liste `werkzeug/bruecke-liste.json` aus 7e23e157: gast 353, konto 356, raum 357 Namen,
    Schnittmenge aus min/ und `?quelle`); `885-swvorladen` Prüfung 12 (bau/); `885-schlank` kennt das Modul
    (Muster `rueckfrage(-<hash>)?.js`, Teil F: Rückweg bau → min → Quelle, Teil Q zählt die Zeile `DMA_MODUL` wie
    `DMA_STEMPEL` nicht mit; ein Kommentar in index.html fiel dafür weg, Budget 6 500 Zeichen).
  - **M3-Vorarbeit:** `werkzeug/daten-bauen.js` (nur Prüfen; schreibt erst mit `--schreiben`): alle 76 Kandidaten
    JSON-fähig, Mischen/Ersetzen je Pfad erkannt, doppelter Tiefenvergleich (leeres window und fremder Vorbestand).
  - **Sonden (Stand 08:05 UTC, dieser Baum, über die Sperre, nacheinander):**
    - grün: `887-bau` B1–B10 + S (Gast/Betreiber min/`?quelle`/ohne Module); `887-bruecke` 18/18 (gast, konto, raum ×
      min/`?quelle`); `885-swvorladen` inkl. neuer Prüfung 12 und 11 (694 gleich wie mit altem sw.js);
      `885-schlank` Q A–G; `runde99-rueckfrage`; `walkie207-flug`; `884-notweg` („alles grün“); `884-vollbild` mit
      `?quelle` und `MIN=1` (nach Sonden-Berichtigung, s. u.); `884-diktat` `?quelle` (der ganze Lauf braucht > 10 min,
      daher geteilt; min/ steht noch aus); `885-sparsam` A–E, G, H, L, M, N, R, P, U, X3, X5, V, NT, SB, SM, SWa, SWc
      (90 Prüfungen, 0 rot; in Stücken, weil der ganze Lauf > 10 min braucht); `885-rueckkehr` R, K, G, F, T, Z, Y, W, N, S
      (0 rot).
    - **Gegenproben rot wie erwartet:** `887-bau` gegen 7e23e157: B 19 rot (u. a. B10 mit 55 Dateien), S 2 rot (Walkie
      klassisch statt Modul; die 3 übrigen roten S-Zeilen sind 404 für Bilder/Filme, die der Vergleichsordner nicht
      hatte); `887-bruecke` mit `BRUCH=Rueckfrage`: konto-min und konto-quelle rot („fehlt: Rueckfrage“);
      `885-swvorladen` gegen 7e23e157: Prüfung 12 dreimal rot.
    - **Rot, aber schon auf 886 rot (nicht durch den Umbau):** `694-leistung` 3a (min/spiel.js-Wettlauf, seit 884
      bekannt, steht in 885-swvorladen); `885-rueckkehr` B1 (CPU 4×, Zeitgrenze 1 220 ms: neu 1 323/1 236 ms, 886
      1 334 ms im selben Zeitraum – Rechner belastet).
    - **`884-vollbild` B2m war auch auf 886 rot** (gleiche Zahlen): die Funk-Attrappe der Sonde kannte das zweistufige
      Holen aus 885 NB1 (`.in("id", …)`) nicht, die „mittlere“ Leiste bekam nie ihren Text. Attrappe berichtigt
      (76c600b1), danach grün mit `?quelle` und `MIN=1`.
    - **Offen, nicht erklärt:** `885-rueckkehr` O, zweites „Öffnen ohne Helfer, Update“: auf diesem Stand in 2 von 4
      Durchgängen statt „sofort hinein + Blase“ ein Neuladen auf die neue Fassung (betreten auf Seite 2 nach 492 ms);
      auf 886 2 von 2 grün. Der Fall ist ein Wettlauf zwischen „betreten“ (~260 ms) und der Antwort von fassung.json
      (D = 250 ms); der Walkie-Lader läuft dort nicht (kein Betreiber), sw.js ist aus („ohne Helfer“) – einen Weg, auf
      dem der Umbau das ändert, sehe ich nicht. Verschränkte Wiederholung (je 2× neu/886) steht in `rest.sh`.
  - **Messung (CPU 4×, verschränkt, A = 886 = 7e23e157, B = dieser Stand):**
    - Walkie (Sonde 885-schlank M, 8 Paare, Datenbank 150 ms, Profil 300 ms) – vorher festgelegtes Maß „Reiter da“:
      mit Merker 1 878 → 1 867 ms (gepaart **+1 ms**, 4↓/4↑), ohne Merker 1 858 → 1 866 ms (**+7 ms**, 3↓/5↑). Erste
      Walkie-Abfrage +2/+4 ms, Datei geholt −17/+2 ms. **Nicht langsamer.**
    - Gast kalt (ladezeit-messen 4G, 5 Paare): bereit 1 758 → 1 945 ms, gepaart **+134 ms [−41…+332]** (4↑/1↓),
      DOMContentLoaded +129 [−44…+340]; Wissen-Tipp −39 [−153…+27]; Langläufer-Summe +53 [−241…+325]. **Nicht
      gesichert** (der Bereich enthält 0, Rauschgrenze für bereit bei 4G Gast kalt laut 886-Gesamtmessung ±100 ms).
      Für Gäste ändert sich nur index.html um ~0,5 KB (eine Zeile DMA_MODUL, ein Stempel, der längere Walkie-Lader, der
      für Gäste nie läuft) – einen Mechanismus für +130 ms gibt es nicht; auch der DCL der Walkie-Messung lag +109 ms
      (7↑/1↓). Bevor diese Fassung geliefert wird: A/A-Lauf und Wiederholung (`rest.sh`, Punkt 1). Bleibt B danach
      über der Rauschgrenze langsamer, wird M2 NICHT geliefert.
    - Fälle „wieder“ und „sw“ stehen noch aus (`rest.sh`).
  - **M3-Vormessung ohne Browser** (Node, frischer Prozess, min/data-uebungen.js 6,0 MB): Ausführen 151–170 ms,
    JSON.parse 69–87 ms. Im Browser noch nicht gemessen (Chromium hat für Skripte einen Code-Speicher, für JSON nicht) –
    deshalb noch NICHTS eingebaut; Messskript `scratchpad/m887/modul/m3-json-messen.js` (kalt/wieder, CPU 4×).
  - **Nicht angefasst:** app.js, livechat.js, spiel.js, messung.js, filmspieler.js, klassenzimmer.js, livechat.css,
    backend.js; `DMA_VERSION` bleibt 885. Logbuch hier statt in SPIELSYSTEM.md (Plan 0.9; der Auftragstext nannte
    SPIELSYSTEM.md, der verbindliche Plan sagt bis zur ersten Modul-Auslieferung dieses Dokument).
  - **Nachtrag:** `fassung-setzen.js` schreibt `index.html` nur noch, wenn sich etwas geändert hat (vorher bei jedem
    Commit – ein Server, der die Datei gerade an eine Sonde ausliefert, konnte eine halbe lesen).
  - **Chromium-Pause ab 08:05 UTC** auf Bitte des Dirigenten (LIVE-Schlussreihe 887). Restliche Läufe:
    `scratchpad/m887/modul/rest.sh` (ab ~09:30 UTC, ein Läufer, alles über die Sperre).
- 01.11. **Modul-Umbau — Schritt M3 (Übungsdaten als JSON): gemessen, NICHT eingebaut.** Grundlage fc5e3ae3.
  - **Schritt 0, Mängel aus der M2-Prüfung (8a3a027b):**
    - a) `window.DMA_MODUL` steht nicht mehr in einem eigenen `<script>`, sondern vorn im Block von `DMA_STEMPEL`:
      `<script>window.DMA_MODUL = {…};window.DMA_STEMPEL = {…};</script>` (der Prüfer maß beim Betreiber
      DOMContentLoaded +13…+19 ms, immer in derselben Richtung). Vorn, weil `sw.js` (auch die alten Helfer auf den
      Geräten) `DMA_STEMPEL` mit `/window\.DMA_STEMPEL = (\{[^\n]*?\});<\/script>/` liest – dahinter stünde
      `DMA_MODUL` mit im Fang, `JSON.parse` scheiterte, der Helfer hielte keine Datei mehr für gestempelt.
      `modul-bauen.zeileSetzen` zieht die alte eigene Zeile hinein; `fassung-setzen.js` lässt den Vorsatz stehen.
      887-bau B3 prüft die Stelle und dass sw.js die Liste weiter liest, B8 das Ersetzen.
    - b) Name aus dem Inhalt: `daten-bauen.js` benennt nach sha256 der GESCHRIEBENEN Bytes (base64url, 8 Zeichen),
      überschreibt nie einen Namen mit anderem Inhalt (Fehler), schreibt über eine Zwischendatei und rechnet
      zurückgelesen nach. 887-bau B11: jede Datei in `bau/daten/` heißt nach ihrem Inhalt (mit Gegenprobe: fremder
      Inhalt wird erkannt), kein Hash-Name unter `bau/` hatte in git je zwei Inhalte, Arbeitsbaum = git.
    - c) `fassung-setzen.js <zahl>` baut zuerst und bricht bei Vite-Baufehler oder Gleichlauf-Bruch ab, BEVOR
      `DMA_VERSION`/`fassung.json` sich ändern (Rückgabe 1; 887-bau B8 im Wegwerf-Ordner). Gegenprobe mit dem
      Werkzeug aus fc5e3ae3: setzt „9999“ trotz Baufehler (Rückgabe 2). Übergabe MODUL in Abschnitt 3 (nach M2):
      `pruefe-887-bau.js` vor jeder Auslieferung.
    - 887-bau B (ohne Browser) grün; Gegenprobe gegen fc5e3ae3 (Vergleichsbaum aus Verweisen): B3 Stelle, B8 Ersetzen
      und B8 echte Fassung rot (dazu B4/B11 „kein git“).
  - **Messung Format (Chromium, CPU 4×, Datei vom eigenen Server ohne Leitungsbremse, je Paar beide Arten im frischen
    Profil, Reihenfolge gedreht; kalt = 1. Laden, wieder = 3. Laden im selben Profil mit HTTP-Speicher und
    V8-Code-Speicher; Maß „Daten da“ = vom Anstoß bis die Werte auf window liegen; Skript
    `scratchpad/m887/modul/m3-json-messen2.js`, Ergebnisse `…/m3/`):**
    - eine Kategorie (`wortstellung`, 212 KB), 6 Paare: Skript kalt 31 ms (25…40), JSON (`fetch` + `json()`) 46 ms
      (35…62), gepaart **JSON +15 ms** (+4…+37, 6/6 langsamer); wieder Skript **10 ms** (6…16), JSON 37 ms (30…45),
      gepaart **JSON +27 ms** (+18…+39, 6/6). Langläufer keine.
    - ganze Datei (`min/data-uebungen.js`, 6,0 MB), 5 Paare: Skript kalt 262 ms (246…293), JSON 918 ms (851…930),
      gepaart **JSON +647 ms** (5/5); wieder Skript **63 ms**, JSON 850 ms, gepaart **+787 ms** (5/5). Dafür ohne
      Langläufer (Skript: einer, 75 ms kalt / 60 ms wieder).
    - **Ergebnis: JSON ist im Browser NICHT schneller, sondern langsamer** – kalt Faktor 0,68 (Kategorie) bzw. 0,29
      (ganz), wieder 0,26 bzw. 0,07. Der Node-Vorteil (2,4×) gilt im Browser nicht: das Skript wird beim Laden
      nebenher übersetzt (Streaming) und ab dem dritten Laden aus dem Code-Speicher genommen; für JSON gibt es beides
      nicht. Nach Plan 0.5 („ein Gewinn zählt erst über der Rauschgrenze“) und Auftrag wird M3 als JSON **nicht
      eingebaut**; `daten-bauen.js` bleibt ein Prüfwerkzeug (schreibt nur mit `--schreiben`, `bau/daten/` bleibt leer).
    - **Gegenproben zum Format (alle in derselben Richtung):** mit Service Worker (CacheStorage, wie `sw.js`): Kategorie
      kalt +20 ms (6/6), wieder +30 ms (Skript 9 ms, JSON 37 ms); ganz kalt +566 ms, wieder +846 ms. `text()` +
      `JSON.parse` statt `json()`: Kategorie kalt +24 ms, wieder +34 ms; ganz +649/+898 ms. Die Schritte 2 und 3 des
      Plans ebenso: `vokabeln/alltag.js` (437 KB) wieder Skript 15 ms, JSON 64 ms (+50 ms, 6/6; mit Helfer +49 ms),
      kalt +21 ms (−23…+51, nicht eindeutig; mit Helfer +49 ms, 5/5); `kalender/10.js` (625 KB) kalt +53 ms (6/6),
      wieder Skript 10 ms, JSON 89 ms (+78 ms, 6/6). Die Node-Zahlen des Plans (2,4×/7×/2,9× für JSON) gelten im
      Browser nicht. Damit entfallen auch M3 Schritt 2–4 (vokabeln, kalender, übrige `data-*`).
    - Auffällig: JSON zeigte bei der ganzen Datei keinen Langläufer (> 50 ms), das Skript einen (53–75 ms). Der Browser
      liest den Körper in vielen kleinen Aufgaben; der Hauptfaden ist trotzdem länger belegt (850–940 ms bis „Daten
      da“ gegen 57–300 ms).
  - **Der eigentliche Hebel ist die Menge, nicht das Format** → Vorschlag M3b in Abschnitt 3 (Kategorie als Skript;
    „Lernen“ wartet heute auf 1,2 MB gepackt, eine Kategorie 9–86 KB). Braucht das Ja des Dirigenten.
  - **Sonden Schritt 0 (über die Sperre, nacheinander):** `887-bau` B (ohne Browser) und S grün (Gast, Betreiber
    min/`?quelle`/ohne Module); `885-schlank` A–G grün, Q: der Knotenvergleich war rot – die Sonde nahm für den
    Vergleich mit BASIS „die Zeile DMA_MODUL“ heraus und erwischte jetzt den ganzen Stempel-Block (ein Knoten zu
    wenig); berichtigt (2c2b583c), nur noch eine EIGENE Zeile fällt weg – danach Q 16/16 grün. Dazu die beiden
    Sonden, die `DMA_STEMPEL` selbst aus `index.html` lesen: `876-start-schlank` 62/62, `858-ladeweg` 14/14 grün.
  - **Messung Schritt 0 a (A = fc5e3ae3, B = neu, verschränkt):** Betreiber (885-schlank M, CPU 4×, 8 Paare)
    DOMContentLoaded mit Merker 1 291 → 1 302 ms (gepaart −7, 4↓/4↑), ohne Merker 1 321 → 1 301 (−26, 5↓/3↑); Reiter
    da +28/+16 ms (Grenze der Sonde 100 ms, grün). Die +13…+19 ms der Prüfung sind damit nicht mehr in einer
    Richtung zu sehen. Gast kalt 4G (5 Paare): bereit 2 255 → 2 126 ms, gepaart −22 ms [−335…+454],
    DOMContentLoaded −15 [−320…+452], Wissen-Tipp +27 [−178…+167] – kein Unterschied über dem Rauschen; der Rechner
    war während des Laufs stark belegt (bereit 2,2 s statt 1,76 s im A/A-Lauf am Morgen, A/A-Grenze dort ±~60 ms).
  - **Nicht gelaufen und warum:** Übungs-, Wortschatz- und Kalender-Sonden und die Messung „Übung öffnen“ 4G/3G – an den
    Daten-Wegen hat sich nichts geändert (nichts eingebaut). Kommt M3b, gehören sie dazu (mit neuer Sonde
    `pruefe-887-daten.js` und neuem Messfall „Übung öffnen“).
- 07.11. **Modul-Umbau — M3b: Übungsdaten je Kategorie, als SKRIPT.** Zweig `module-umbau`, Grundlage d9637a22; der
  Zwischenstand vor dem Wochenlimit (5129e779, `werkzeug/uebungen-teilen.js`) ist aufgenommen. Für Xander unsichtbar:
  gleiche Karten, gleiche Texte, gleiche Bedienung – nur ohne die 1,2 MB Wartezeit beim Öffnen von „Lernen“.
  - **Bau:** `werkzeug/uebungen-teilen.js` (5129e779; dort stand U+2028/U+2029 roh im Suchmuster – Syntaxfehler,
    berichtigt) führt die UNVERÄNDERTE `data-uebungen.js` in einem leeren Sandkasten aus (nur `DMA_DATEN.ZUSATZ_FRAGEN`,
    jede Kategorie `[a-z0-9-]`, alles JSON-fähig – sonst kein Eintrag) und schreibt 90 Teile
    `bau/uebungen/<kategorie>-<hash>.js` (zusammen 6,1 MB, gepackt 1,21 MB; Median 10 KB, größter 84 KB) und das
    Verzeichnis `bau/uebungen-<hash>.js` (2,2 KB, gepackt 1,3 KB). Name = sha256 der geschriebenen Bytes (wie
    `daten-bauen.js`), nie ein Name mit anderem Inhalt; Tiefenvergleich Verzeichnis + Teile (umgekehrt ausgeführt) =
    Quelle, Wert für Wert und in der Reihenfolge der Schlüssel (die Tagesaufgabe hängt daran). `fassung-setzen.js`
    ruft es vor jedem Commit (0,75 s, nur bei geänderter Quelle oder geändertem Werkzeug) und setzt
    `DMA_MODUL.uebungen`; scheitert es, fällt der Eintrag weg (die Seite lädt die ganze Datei, nie falsche Daten),
    laut, Rückgabe 2; eine echte Fassung bricht ab. `modul-bauen.js` räumt `bau/uebungen*` nicht weg, ein Vite-Eingang
    „uebungen“ ist ein Baufehler. Die `sw.js`-Regel für `bau/` (Unterordner, ungefragt aus dem Speicher, 2 Generationen
    je Grundname) trägt schon – je Kategorie ein eigener Grundname. Aufräumen: nur, was weder das neue Verzeichnis noch
    einer der letzten 3 Commits mit Verzeichnis nennt.
  - **Seite:** `data-exercises.js` – `ladeUebungen(ids)` holt Verzeichnis + nur diese Teile (ohne ids: alle, für
    Kalenderrücken und Wörterbuch); `uebungenDa(ids)`; sind alle Teile da, steht `ZUSATZ_FRAGEN` wie bisher (Ereignis
    `dma-uebungen-ganz`, app.js setzt dann den Topf der Tagesaufgabe neu); `alleRohfragen()` liest weiter nur die
    ganze Sammlung (alles oder nichts, wie bisher). Rückfall auf die ganze Datei: `?quelle`, ohne min/
    (`dma-ohne-min`), Notweg (`dma-ganz` nennt `data-uebungen.js`), kein Eintrag in `DMA_MODUL`, ein Teil oder das
    Verzeichnis kommt nicht. `app.js` – Tipp auf „Lernen“, `renderSetup` und „Runde starten“ warten nur auf die
    GEWÄHLTEN Kategorien (ohne Wahl: auf nichts). Steht die Übersicht schon, bleibt sie beim Tipp auf eine Karte
    stehen (kein „wird geladen“ über den Karten), das Häkchen kommt sofort. Nach dem ersten Bild der Übersicht holt
    `uebungenVorladen` die übrigen Kategorien in Ruhepausen (Karten der Übersicht zuerst, höchstens 4 zugleich,
    `fetchPriority low`), solange „Lernen“ offen ist (Spiele, Wörterbuch, Artikel-Garten … lesen die Sammlung auch;
    bisher kam sie dort mit dem Tipp auf „Lernen“ ganz) und nicht im Klassenzimmer; sonst hält es an und macht beim
    nächsten Öffnen weiter.
  - **Drei Nebenwirkungen, gefunden mit dem neuen Messfall und behoben:** (1) `getBank()` jeder Kategorie liest
    Datenblöcke aus `min/data-exercises-teil.js` (88 KB gepackt); kam der Karten-Tipp, bevor sie da waren, holte die
    Seite sie SYNCHRON – auf dem alten Stand 0,2–0,3 s, neu 1,7 s gesperrter Hauptfaden, weil der Wortschatz
    (2,26 MB) jetzt gleichzeitig die Leitung füllt. Jetzt: ein gemeinsamer asynchroner Abruf (`dmaUebTextHolen`),
    beim Tipp auf „Lernen“ als erstes und mit hoher Priorität; `ladeUebungen(ids)` wartet darauf. (2) „Runde
    starten“ rief `wortschatzBereit()` – das steht im app-Stück rest2, das jetzt noch fehlte: SYNCHRON geholt,
    1,1–1,4 s gesperrt. Jetzt `dmaTeileFuer([wortschatzBereit, merkeZustand, renderQuestion])`: die Stücke dieser
    Funktionen über die Leitung abwarten (höchstens 8 s, dann wie bisher), „Lernen“ holt sie vor. (3) Die Leitung
    teilt sich gerecht auf alle laufenden Abrufe: auf 3G teilte sich der Karten-Tipp sie mit den 26 Wortschatz-Dateien,
    bis „Runde starten“ frei war, vergingen 13,9 s (alter Stand 2,2 s – nach 20 s „wird geladen“). Jetzt eine
    Reihenfolge: zuerst der Teil von data-exercises.js (dann erst der Wortschatz, `uebungenVorrang`, höchstens 3 s),
    die ersten 8 Karten gleich nach dem ersten Bild, die übrigen 82 Teile erst nach dem Wortschatz (auf ihn wartet
    „Runde starten“). Dieselben Bytes, nur in der Reihenfolge, in der sie gebraucht werden. (Ein Zwischenstand, der den
    Wortschatz auch auf die 8 Karten warten ließ, machte 4G gesamt um 1 s schlechter – verworfen, d83b2ab6.)
  - **Platz (GitHub Pages):** +6,26 MB (`bau/uebungen/` 6 253 978 B, Verzeichnis 2 209 B, Merkzettel 109 B) →
    ≈ 954 von 1 000 MB. Danach je Änderung der Daten nur die geänderten Kategorien (+ 2 KB Verzeichnis); die ganze
    Datei bleibt als Rückfall und für `spiel.js`.
  - **Vierte Nebenwirkung (a2cafbbe): das Wörterbuch.** `extractExtendedVocabulary()` (Wörter aus den Übungstexten,
    „Sonstiges") merkt sich sein Ergebnis je Lernraum. War das Wörterbuch gebaut, bevor die Sammlung ganz da war, fehlten
    diese Wörter für die ganze Sitzung – das gab es schon auf d9637a22 (Fenster: bis die eine Datei kam), mit M3b ist das
    Fenster länger (die Teile kommen nach dem Wortschatz). Jetzt merkt es sich, ob es mit der ganzen Sammlung gebaut war;
    sonst wird es bei `dma-uebungen-ganz` (und damit das Wörterbuch) beim nächsten Gebrauch neu gebaut. Sonde
    887-daten B10 (früh gebaut → danach so viele Übungswörter wie in einer Seite, die erst alles abwartet).
  - **Weitere Prüfung: „Runde starten" wartet auf den ganzen Wortschatz.** Das ist nicht entbehrlich: quiz.js stuft
    JEDE Aufgabe auch nach den Wörtern darin ein (`wortNiveauKarte` aus `VocabData.WORDS`), die Niveau-Auswahl der Runde
    hängt also am Wortschatz. Darum bleibt das Warten (wie auf d9637a22); siehe „Offen".
  - **Endlauf 08.11. 01:42–03:10 UTC auf a2cafbbe (Code; d5a96a2f nur Logbuch), A = d9637a22, B = neu, verschränkt,
    Chromium CPU 4×, Gast, Tipp sofort, je Eintrag eine Sperre (nach der Prüfung der Auslieferung 887; Rechnerlast
    1,2–4,0 bei 4 Kernen). Ergebnisse `scratchpad/m887/modul/m3b/end/`, Zusammenfassung mit `m3b/zusammen.js`.**
    - **Vorher festgelegtes Maß:** „Lernen: Tipp → Karten" (darauf wartete „Lernen" heute 1,2 MB gepackt), daneben
      „Lernen-Tipp → Frage" (ganzer Weg bis zur ersten Frage).
    - **Rauschgrenze (A/A, derselbe Stand zweimal, 4G kalt, 6 Paare):** Lernen → Karten −8 ms [−124…1]; Karte → startklar
      −222 [−269…−57] (6/6 – dieses Maß hat eine feste Schieflage zwischen den beiden Herkünften, es entscheidet nichts);
      Runde starten −69 [−464…55]; Lernen-Tipp → Frage −573 [−793…0]; bereit +16 [−127…79].
    - **4G kalt, 6 Paare (Median A → B, gepaarter Median B−A [95 %]):**
      - **Lernen: Tipp → Karten 3 779 → 337 ms, −3 442 [−3 538…−3 400], 6/6, Faktor 11,2** (weit über der Rauschgrenze).
      - Karte: Tipp → startklar 520 → 410 ms, −115 [−161…104] – im Rauschen. **Berichtigt (Nachbesserung 1): zu
        günstig** – gemessen war nur „tiere", eine der ersten 8 vorgeladenen Karten. Für die übrigen 82 Kategorien wartet
        der Tipp länger (wortstellung, unten unter „Nachbesserung 1").
      - Runde starten: Tipp → Frage 442 → 2 067 ms, **+1 650 [1 339…1 767], 6/6 langsamer**: hier wartet jetzt der
        Wortschatz (2,26 MB), der früher während der 3,8 s „Lernen" mitkam (siehe „Weitere Prüfung" oben).
      - **Lernen-Tipp → Frage 5 098 → 3 100 ms, −2 065 [−2 126…−1 672], 6/6, Faktor 1,64**; ab Öffnen 6 514 → 4 435 ms
        (−2 109, Faktor 1,47).
      - synchron geholt 461 → 0 ms; längster Langläufer 389 → 246 ms (−132), Summe 1 514 → 932 ms (−526).
      - bereit 1 332 → 1 326 ms (−30 [−117…34]), KB bis bereit 646 → 647, KB 0–10 s +54 (Verzeichnis + Teile statt
        einer Datei), Anfragen 89 → 179.
    - **3G kalt, 4 Paare:** Lernen → Karten **20 039 → 279 ms (Faktor 72)**; Karte → startklar 2 173 → 3 462 ms
      (+1 279, 4/4: der Teil der Karte teilt sich die Leitung mit dem Wortschatz); Runde starten 2 392 → 13 832 ms
      (+11 440, 4/4: Wortschatz, ~11 s bei 1,6 Mbit/s); **Lernen-Tipp → Frage 24 973 → 17 807 ms (−7 155, 4/4,
      Faktor 1,40)**, ab Öffnen 29 142 → 22 015 ms (Faktor 1,32); synchron 4 114 → 0 ms. Langläufer-Summe 0–10 s
      399 → 668 ms (+280): bei A fiel das Ausführen der ganzen Sammlung erst nach 20 s, also aus dem Messfenster.
    - **4G wieder (3. Öffnen, Code-Speicher), 3 Paare:** Lernen → Karten 409 → 204 ms (−179, 3/3, Faktor 2,0);
      Lernen-Tipp → Frage 1 045 → 1 025 ms (−50 [−157…34], im Rauschen); längster Langläufer 115 → 149 ms (+28 [6…47],
      3/3 – klein, Summe +5). **3G wieder, 2 Paare:** Lernen → Karten 465 → 281 ms; gesamt 1 212 → 1 142 ms (−70);
      Karte +81 [1…161].
    - **Gast-Start (Standardfall, 4G):** kalt, 5 Paare: bereit 1 298 → 1 312 ms (+43 [−39…48], 4↑/1↓; innerhalb der
      Rauschgrenze ±100 ms bzw. A/A oben [−127…79]), erstes Bild −12, Wissen-Tipp +2, Klassenzimmer-Tipp −51 (5/5 –
      ohne Mechanismus, nicht beansprucht), Langläufer-Summe +12. wieder, 3 Paare: bereit −9 [−9…53], Wissen −38,
      Klassenzimmer +8 [3…27]. Für den Start kommen gepackt +2,0 KB dazu (min/data-exercises.js +1,4 KB,
      min/app.js +0,6 KB, index.html +32 B). **Kein Nachteil beim Start über der Rauschgrenze.**
    - **Ergebnis:** schneller, wo es zählt – „Lernen" steht sofort (4G 11×, 3G 72×), der ganze Weg bis zur ersten Frage
      ist auf 4G 2,1 s und auf 3G 7,2 s kürzer, nichts mehr synchron. Ehrlich: der Tipp auf „Runde starten" wartet jetzt
      auf den Wortschatz (4G +1,7 s, 3G +11,4 s bei sofortigem Tipp); wer sich die Übersicht ein paar Sekunden ansieht,
      merkt das nicht, weil der Wortschatz dabei im Hintergrund kommt. **Nachtrag (Nachbesserung 1):** diese Zahlen gelten
      für „tiere" (vorgeladen); für eine der 82 übrigen Karten wartet auch der Tipp auf die Karte länger (4G +0,5 s, 3G
      +1,5 s) und der ganze Weg ist kürzer um 4G 1,3–1,5 s (Faktor 1,33), 3G 7,3 s (Faktor 1,41) – siehe unten.
  - **Sonden (Endlauf, a2cafbbe, über die Sperre):**
    - `887-daten`: D1–D6 grün (ohne Browser), B1–B10 grün (42/42). **Gegenprobe d9637a22: 16 rot** (B2, B3, B4, B8,
      B9 „uebung"/„rest2", B10 „danach 0 statt 658"; dazu D: 10 rot, 07.11.). B5–B7 sind auf beiden grün (Ablauf,
      Rückfall, ?quelle/Notweg – sie prüfen, dass nichts kaputtgeht).
    - grün: `887-bau` (B ohne Browser und S), `887-bruecke`, `885-bereiche`, `885-stuecke`, `885-schlank` Q A–G,
      `885-swvorladen` (ohne 694), `853-beugung`, `galgenmaennchen`, `858-ladeweg`, `876-start-schlank`,
      `636-kein-italienisch`, `868-italienisch-nachladen`, `843-italienisch-nur-im-raum`, `betonung-uebung` (Ausgabe bis
      auf die Kennung gleich wie auf d9637a22), `mehrdeutige-aufgaben`, `betonung-regeln`. (Die Zählung „1 rot" bei
      betonung-uebung/843 im Läufer ist falsch: „BEFEHL" bzw. „SEITENFEHLER" enthält „FEHL".)
    - `884-notweg`: „alles grün" (379 s; die Zählung „4 rot" sind Überschriften mit „FEHLT"), wie am 07.11. auf
      d9637a22.
  - **Offen / Vorschläge:**
    1. **„Runde starten" ohne den ganzen Wortschatz (unsichtbar, größter Rest-Hebel):** quiz.js braucht `VocabData.WORDS`
       nur, um jede Aufgabe auch nach ihren Wörtern einzustufen (`wortNiveauKarte`). Das ließe sich beim Bau
       vorberechnen (ein Niveau je Aufgabe in den Teilen, `uebungen-teilen.js`); dann wartete die Runde nur noch auf den
       Wortschatz, wenn die Kategorie ihn wirklich liest (Wortschatz-Kategorien). 3G: −11 s beim Tipp, 4G −1,7 s.
       Braucht einen Gleichlauf-Prüfer (Niveau vorberechnet = Niveau zur Laufzeit) – eigener Schritt.
    2. Karten-Tipp auf 3G (+1,3 s): der Teil der Karte teilt sich die Leitung mit dem Wortschatz. Ein Zwischenstand,
       der den Wortschatz auf die ersten 8 Karten warten ließ, machte 4G gesamt 1 s schlechter (d83b2ab6, verworfen);
       mit Punkt 1 entfiele der Zielkonflikt.
    3. **Platz:** +6,26 MB → ≈ 954 von 1 000 MB. `min/data-uebungen.js` (6,0 MB, gepackt 1,22 MB) ist fast so groß wie
       die Quelle (6,5 MB, gepackt 1,23 MB); nähmen Rückfall und `spiel.js` die Quelle, wäre der Zuwachs ausgeglichen
       (betrifft `fassung-setzen.js`/Stempel, `spiel.js` gesperrt – nur nach Einmischen von 887 und mit Freigabe).
    4. `DMA_VERSION` unverändert (885); ausgeliefert wird erst über den Hauptbaum.
  - **Nachbesserung 1 (Prüfer, Runde 1), 08.11.: dc04b613 + a3add543 (Code), Sonde 887-daten B6/B11/B12.** Für Xander
    unsichtbar (keine neue Anzeige, gleiche Bedienung).
    1. **Duell-Wege warteten nicht auf die Aufgaben (wichtig).** „Annehmen" (Profil → Freunde) startete die Runde sofort
       mit `Quiz.startSession`, ohne `ladeUebungen(ids)` wie „Runde starten". Mit M3b fehlten dann nicht vorgeladene
       Kategorien (beim Prüfer: tiere/wortstellung/stil 0 Fragen – dann brach `renderQuestion` an `q.correct` ab –,
       artikel 106 statt 705). Den Grundfehler gab es schon auf d9637a22, wenn „Lernen" in der Sitzung nie offen war; M3b
       machte ihn nach einem kurzen Besuch zum Normalfall. Jetzt `duellRundeVorbereiten(ids)`: erst die Teile der
       Kategorien (und den Teil von data-exercises.js), dazu die app-Stücke der Runde über die Leitung (höchstens 8 s,
       dann wie bisher); ein zweiter Tipp währenddessen startet nichts doppelt. Der zweite genannte Weg
       (`renderChallengePicker` → `challengeErstellen`) ist im Code toter Zweig – `renderChallengePicker` wird nirgends
       aufgerufen, `friendChallengeTarget` nie gesetzt; „Freund herausfordern" läuft in Wirklichkeit über „Duell starten"
       in der Übersicht, also über den Knopf von „Runde starten", der schon wartet. Dort ist die Wartezeit trotzdem mit
       eingebaut (Vorsorge, falls der Zweig wieder angeschlossen wird).
    2. **Vorladen hörte nach einer Unterbrechung auf (wichtig).** „Anhalten" hieß bisher aufhören; weiter ging es nur über
       `renderSetup` oder einen neuen Tipp auf „Lernen" (beim Prüfer 40 s nach 3 s Bildschirm-aus: 4 von 90 Kategorien;
       daran hängen Wortblasen, Kanone, Wackelturm, die `fragenFuerNiveau`-Spiele, IT-Einstufung, Artikel-Garten,
       Wörterbuch-Erweiterung, offline der Rückfall). Jetzt heißt anhalten WARTEN: `darf()` wird alle 3 s, beim
       Zurückkommen der Seite (`visibilitychange`) und bei jedem neuen Aufruf wieder gefragt. Angestoßen wird es weiter nur
       aus „Lernen" (die Seite zeichnet „Lernen" beim Start unsichtbar vor – dort nichts holen); danach lädt es zu Ende,
       wo man auch ist, wie früher die eine Datei – außer bei verdeckter Seite, im Klassenzimmer/Raum (`ruheImRaum`) und in
       den ersten 8 s von „Wissen" (der Weg ins Klassenzimmer; dieselbe Frist wie beim Wortschatz). Fehlt am Ende ein
       Teil oder kommt das Verzeichnis nicht, holt es von selbst die ganze Datei (a3add543; vorher blieb die Sammlung in
       diesem Fall ohne Kartentipp halb). Der Weg über die ganze Datei (?quelle, Notweg, Rückfall) meldet jetzt auch
       `dma-uebungen-ganz` (Tagesaufgabe und Wörterbuch bauen dann neu, wenn sie vorher gebaut waren).
    3. **Sonden (über die Sperre, 08.11. 06:30–07:10 UTC):**
       - `887-daten` neu (a3add543): D 21/21, B1–B6 32/32, B7–B10 15/15, B11–B12 16/16 grün.
       - **B11** Duell annehmen (der echte Knopf, Backend als Attrappe in der Seite; wortstellung + stil): neu beide Fälle
         grün (beim Start 600/100 = ganz, Runde 10 Fragen). **Gegenprobe d9637a22:** „Lernen nie offen" rot (0/0, Runde
         0 Fragen, Seitenfehler „reading 'correct'" – der alte Grundfehler); „Lernen 1 s offen" dort grün (die ganze
         Datei kam). **edc48fc5 (vor der Nachbesserung): 4 rot** (beide Fälle 0/0 und Seitenfehler).
       - **B12** Vorladen nach Unterbrechung, ohne neuen Tipp auf „Lernen" (Bildschirm 3 s aus in „Lernen → Spiele",
         Profil, Wissen nach der 8-s-Frist, nach 12 s Klassenzimmer): neu alle 4 von selbst zu Ende (90/90, jeder Teil
         einmal); verdeckt, in den ersten 3 s von „Wissen" und 12 s im Klassenzimmer nichts Neues (0–3 Teile, nur die
         unterwegs). **Gegenprobe edc48fc5: 4/4 rot** (4 → 4, 8 → 8, 6 → 8, 8 → 8 von 90, nicht fertig); **d9637a22:
         4/4 rot** (keine Teile, nur die ganze Datei).
       - **B6** neu dazu: Rückfall beim Vorladen (nur „Lernen" offen, keine Karte): Teil `stil` 404 bzw. Verzeichnis 404 →
         von selbst die ganze Datei, Daten = Quelle; neu grün, **edc48fc5: 2 rot** („nicht fertig"), **d9637a22: 2 rot**
         (kein Teil angefragt; die ganze Datei kommt dort, aber ohne Teile und ohne `dma-uebungen-ganz`).
       - Bestehende Sonden der berührten Bereiche auf a3add543 (07:22–07:53 UTC): grün `galgenmaennchen`,
         `858-ladeweg`, `876-start-schlank`, `betonung-uebung`, `853-beugung`, `885-bereiche`, `885-stuecke`,
         `887-bruecke`, `887-bau`, `885-schlank`, `885-swvorladen`, `843-italienisch-nur-im-raum` (die Zählung „1 rot"
         bei betonung-uebung/843 sind die Überschriften „BEFEHL"/„SEITENFEHLER"), `884-notweg` „alles grün" (die
         Zählung „4 rot" sind Überschriften mit „FEHLT"). Kein Rot, also nichts gegen d9637a22 zu vergleichen.
    4. **Messung nach der Nachbesserung (a3add543, A = d9637a22, B = neu, verschränkt, Chromium CPU 4×, Gast, Tipp sofort;
       08.11. 07:05–07:40 UTC, Rechnerlast 3–4 bei 4 Kernen; `scratchpad/m887/modul/m3b/nb1/messung/`).**
       - **Karte, die NICHT unter den ersten 8 vorgeladenen ist (`--kategorie wortstellung`; so sind 82 der 90):**
         - 4G kalt, 6 Paare: **Karte: Tipp → startklar 565 → 1 178 ms, +523 [129…810], 5/6 langsamer** (Kreuzschätzer
           +557). Das ist der Teil der Karte, der sich die Leitung mit dem Wortschatz teilt; „Runde starten" bleibt so lange
           gesperrt, ohne Hinweis. Die A/A-Probe des Endlaufs hatte bei diesem Maß eine feste Schieflage von −222 ms
           zugunsten von B – der wahre Nachteil kann also eher größer sein. Runde starten 460 → 1 756 ms (+1 297, 6/6;
           Wortschatz). **Lernen-Tipp → Frage 5 248 → 3 939 ms, −1 285 [−1 861…−1 107], 6/6, Faktor 1,33**; ab Öffnen
           6 663 → 5 460 ms (Faktor 1,22); Lernen → Karten 3 817 → 386 ms (Faktor 9,9); längster Langläufer −88,
           Summe −461 ms.
         - 3G kalt, 4 Paare: **Karte 2 256 → 3 759 ms, +1 475 [994…1 788], 4/4 langsamer**; Runde starten 2 405 →
           13 642 ms (+11 245, 4/4: 13,6 s „Aufgaben werden geholt …", der Wortschatz); **Lernen-Tipp → Frage 25 160 →
           17 862 ms, −7 303 [−7 567…−6 814], 4/4, Faktor 1,41**; ab Öffnen 29 429 → 22 174 ms (Faktor 1,33); Lernen →
           Karten 20 053 → 307 ms (Faktor 65). Langläufer-Summe 0–10 s +169 ms (bei A fällt das Ausführen der ganzen
           Sammlung erst nach 20 s, also aus dem Fenster).
         - Der Prüfer kam unabhängig auf dasselbe (4G Karte 447 → 948, 3G 2 210 → 3 736; gesamt 4G Faktor 1,51, 3G 1,39).
           **Das Logbuch nannte oben nur „tiere" (vorgeladen, Karte im Rauschen) – für die Mehrzahl gilt diese Zahl.**
           Insgesamt bleibt es schneller, weil „Lernen" nicht mehr auf die ganze Sammlung wartet; der Tipp auf eine
           nicht vorgeladene Karte und „Runde starten" warten sichtbar länger als auf d9637a22.
       - **3G Gast-Start (Standardfall), mehr Paare:** 10 Paare gegen d9637a22, dazu 7 Paare A/A (derselbe Stand
         zweimal). Auf 3G hat das Werkzeug einen starken Reihenfolge-Effekt: innerhalb eines Laufs ist die zweite Seite
         rund 300–400 ms langsamer (A/A: B−A +371 ms, wenn A zuerst lief, −305 ms, wenn B zuerst lief). Weil bei ungerader
         Laufzahl A öfter zuerst läuft, verfälscht der einfache gepaarte Median; ausgewertet wird darum über Kreuz
         (Median B−A je Reihenfolge, Mittel der beiden; `nb1/kreuz.js`). **bereit: +66 [38…121] ms gegen d9637a22,
         A/A +33 [−5…84]**; erstes Bild +118 [67…135], A/A +71 [46…122]; Wissen-Tipp +25 (A/A −2); Klassenzimmer-Tipp
         −10 (A/A +2); ab Start bis Klassenzimmer +64 (A/A +50); Langläufer-Summe +38 (A/A +47). Abzüglich der A/A-
         Schieflage bleiben +33 ms (bereit) bzw. +47 ms (erstes Bild), innerhalb der Rauschgrenze; der Mechanismus ist
         klein (+2,4 KB gepackt bis bereit gegen d9637a22 ≈ 12 ms bei 1,6 Mbit/s). **Kein Nachteil über dem Rauschen gesichert; ein
         Rest von ~+30–50 ms ist nicht auszuschließen.** (Die früheren 3G-Zahlen −53/+79/+186 ms stammen aus je 2 Paaren
         ohne diese Kreuzauswertung.) Bei „Übung öffnen" ist der Effekt kleiner; über Kreuz nachgerechnet bleiben die
         Aussagen: Endlauf 4G (tiere) Lernen-Tipp → Frage −1 884 statt −2 065 ms (Faktor ≈ 1,59 statt 1,64), 3G −7 129
         statt −7 155; wortstellung 4G −1 457 statt −1 285, Karte +557 statt +523, Runde starten +1 203 statt +1 297.
    5. **Platz:** keine neuen Dateien (die Daten sind unverändert, `bau/uebungen/` bleibt gleich); geändert sind nur
       `data-exercises.js`, `app.js` und ihre `min/`-Stücke (gepackt +0,8 KB, davon bis „bereit" +0,4 KB:
       min/app.js +0,23, min/data-exercises.js +0,19). Weiter ≈ 954 von 1 000 MB.
    6. **Offen / Vorschläge (aktualisiert):**
       1. **„Runde starten" ohne den ganzen Wortschatz** bleibt der größte Rest-Hebel (nachgemessen 4G +1,2–1,3 s, 3G
          +11,2 s, 13,6 s „Aufgaben werden geholt …"). Neu gezählt (Node, `getBank()` aller 62 Kategorien des
          Deutsch-Raums): **in 41 Kategorien hat jede Aufgabe ein festes Niveau** – für sie liest quiz.js den Wortschatz
          zur Einstufung gar nicht (`questionLevel` nimmt `q.level`); nur 21 Kategorien haben Aufgaben ohne Niveau
          (zusammen 2 625 von 24 173, meist je ~100 eingebaute). Unter den 41 braucht „wortschatz" ihn trotzdem, weil es
          seine Aufgaben aus dem Wortschatz baut. Nächster Schritt (eigener Schritt mit Gleichlauf-Prüfer, unsichtbar): Niveau der 2 625 beim Bau
          vorberechnen oder nur für diese Kategorien warten; vorher prüfen, ob andere Teile der Runde (z. B. Betonung) den
          Wortschatz brauchen.
       2. **Karte, die nicht vorgeladen ist** (4G +0,5 s, 3G +1,5 s; „Runde starten" bleibt so lange ohne Hinweis
          gesperrt): der Teil teilt sich die Leitung mit dem Wortschatz. Unsichtbar denkbar: den Teil der getippten Karte
          vor die laufenden Wortschatz-Dateien ziehen – nicht gebaut, nicht gemessen. Ein Hinweis am Knopf wäre sichtbar
          → nur als Vorschlag. Mit Punkt 1 entfiele der Zielkonflikt.
       3. Der Zweig `renderChallengePicker` (Duell aus einer Kategorie-Liste) ist nicht angeschlossen – nur gemeldet,
          nicht entfernt.
