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
- **Vorschlag M3b (braucht das Ja des Dirigenten, nicht gebaut): nach Kategorie teilen, aber als SKRIPT.** Der Hebel
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
- **Stand 07.11.: gebaut auf `modul-m4`** (Logbuch Abschnitt 7). Start und Tutor-Öffnen gleich schnell (im Rauschen);
  ein Update nach einer Tutor-/Betonungs-Änderung kostet 7,9 statt 848 KB gz. **08.11.: Nachbesserung Runde 1
  eingebaut** (Notweg im Funkloch, fremde Funktion, Werkzeug und Strings, Warteschlange) – Sonden grün, Gegenproben
  auf d9637a22 und 2417165d rot. **08.11.: Nachbesserung Runde 2 eingebaut** (Helferwechsel 887 → dieser sw.js im
  Funkloch, Rückweg erst bei DOMContentLoaded) – Sonde 887-modul-app W auf d9637a22 grün, auf 542e4250 rot.

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
- 07.11. **Modul-Umbau — Schritt M4 (app.js-Pilot: Tutor und Betonung als Modul).** Zweig `modul-m4`, Grundlage
  d9637a22. Fortsetzung zweier von Nutzungslimits abgebrochener Läufe (01.11.: Zwischenstand 896a6846, nur
  `betonungBeobachten()` als Funktion; 07.11. ~17 Uhr: Code, Sonden und Messung bis 04fa3f17 fertig, Logbuch und
  A/A der 4G-Ladezeit fehlten). Für Xander unsichtbar: Tutor und Betonung tun genau dasselbe wie vorher.
  - **Werkzeug `werkzeug/app-modul-ziehen.js`** (Gruppen in `werkzeug/app-gruppen/tutor.json`, `betonung.json`): nimmt
    die Deklarationen einer Gruppe von der obersten Ebene der app.js-Hülle samt Kommentar davor und schreibt sie
    Zeichen für Zeichen (2 Leerzeichen weniger eingerückt – **berichtigt 08.11.:** nicht in Strings, siehe
    Nachbesserung Runde 1) nach `src/app/<gruppe>.js`; lehnt ab, wenn ein Name fehlt,
    eine Deklaration halb dazugehört, das Modul eine VARIABLE von app.js liest oder app.js eine Variable der Gruppe.
    Tutor 44 Deklarationen (37 184 Zeichen), Betonung 17 (17 398 Zeichen). Anweisungen bleiben in app.js und rufen die
    Weiterleitung (gleiche Reihenfolge der Ohren am Dokument): die beiden Fokus-Ohren des Tutors stehen dafür in
    `tutorSchreibOhren()`, der Beobachter der Betonung in `betonungBeobachten()`.
  - **app.js:** 14 dünne Weiterleitungen, z. B. `function tutorRufen(bereich, nochmal) { return dmaModul("tutorRufen",
    arguments); }` (nur, was der Rest von app.js ruft); `dmaModul` ruft `window[name]` (**seit 08.11.:**
    `DMA_BRUECKE.fn[name]`, Nachbesserung Runde 1); fehlt das Modul, gibt es einen
    Ersatz (`tutorAn` → false, `tutorArt` → "comic", `betonungNachschlagen`/`…AusGrundform` → null) oder der Ruf wird
    gemerkt und nachgeholt (höchstens 500; seit 08.11. ohne Rufe mit einem Ereignis). `window.DMA_APP` = die 11 Helfer, die die Module brauchen (showToast,
    brDatei, applyStressToTree …); die Module lesen es erst beim Aufruf. Rückweg: ist die Brücke vor app.js nicht
    gelaufen (bau/ nicht ladbar), lädt app.js `src/bruecke.js` nach.
  - **`src/bruecke.js`** importiert beide Stücke (Vite: EIN Stück `bau/bruecke-CL1VLwwc.js`, 20 167 B, gz 7 889) und
    stellt die Eingänge unter dem alten Namen auf window – überschreibt nichts (`DMA_BRUECKE.konflikt`, laut auf der
    Konsole; app.js nimmt dann den Ersatz statt des fremden Codes – **das stimmte nur für einen fremden Wert, nicht
    für eine fremde Funktion; berichtigt 08.11.:** app.js ruft immer das eigene Modul aus `DMA_BRUECKE.fn`).
  - **index.html:** Eintrag `"@bruecke"` in der Liste der Startskripte VOR app.js – `type="module"` läuft in derselben
    defer-Reihe, also in fester Reihenfolge; mit `?quelle` oder wenn app.js aus der Quelle kommt (Notweg)
    `src/bruecke.js` nativ (**berichtigt 08.11.:** der Notweg nimmt jetzt auch bau/ – offline fielen dort sonst
    Betonung und Ohren aus; `src/` nur mit `?quelle` oder ohne Bau). Ein erster Entwurf mit Importkarte und eigenem Fehler-Lader machte 885-schlank Q rot
    (Kommentare 6 805 > 6 500 Zeichen, gepackt nur −4 684 B statt ≥ −5 000 B gegenüber vor K) – jetzt eine Zeile ohne
    Kommentar, Rückweg in app.js, Stempel nur für die Eingänge `src/*.js` (fassung-setzen.js; die Stücke in `src/app/`
    kommen über `import`). index.html gz +103 B gegenüber d9637a22.
  - **min/:** `teile-bauen.js` unverändert – es lässt Namen, die es in app.js nicht mehr findet, von selbst weg
    („nicht gefunden“); eine Änderung am Werkzeug hätte über die Kennung auch min/data-exercises*.js neu benannt
    (197 KB gz für jedes Gerät). Die gezogenen Namen stehen trotzdem nicht mehr in `app-teile.json` (teile/kern; Vermerk
    in kern_warum), die Weiterleitungen stehen in keiner Liste und bleiben so im Kern; `teile-messen.js` lässt
    Weiterleitungen beim Neu-Messen im Kern. min/app.js 746 579 → 733 198 B (gz 203 669 → 199 673), rest1/2/3/7 je
    0,5–1,1 KB gz kleiner.
  - **Update-Download (gerechnet, kein Rauschen):** eine Ein-Zeichen-Änderung am Tutor benannte auf d9637a22 alle 16
    app-Dateien neu (min/app.js + 15 Stücke über `dmaTeilPasst`): **848 361 B gz** (gzip -9). Jetzt nur
    `bau/bruecke-*.js`: **7 889 B gz (Faktor ~108)** – geprüft mit 887-bau B7 „Kaskade (Stück)“ (Änderung in
    src/app/tutor.js benennt nur bruecke um, rueckfrage und sonde-zwei bleiben). Änderungen anderswo in app.js kosten
    wie bisher.
  - **Platz (GitHub Pages, ≈948 MB von 1 GB):** alle Dateien im Baum zusammen +48 KB (2 212 703 278 → 2 212 751 350 B:
    src/app + bruecke + bau/bruecke + Sonde/Werkzeug, app.js und min/ kleiner). Jede spätere Tutor-Änderung legt ein
    neues bau/bruecke (~20 KB) dazu; `modul-bauen.js` räumt alles weg, was keines der letzten 3 Manifeste nennt.
  - **Browser ohne Module:** kein Rückfall wie beim Walkie nötig – app.js braucht schon auf d9637a22 ES2020 (612× `?.`),
    jeder Browser, der app.js ausführt, kann auch Module.
  - **Messung Start und „Tutor-Reiter öffnen“ (A = d9637a22, B = M4, verschränkt; Chromium, CPU 4×, Telefonfenster,
    eigener Server je Stand, je Paar frisches Profil auf der Platte: Laden 1 = kalt, Laden 3 = wieder mit
    V8-Code-Speicher; Maße in der Seite; Tutor über Tipp auf „Lernen“, dann echter Tipp auf 🎓 bis zum Bild, in dem
    Alex mit Text steht; Skript `scratchpad/m4/m4-messen.js`, Daten `…/m4/messung/`). Median A → B, gepaart B − A
    [95-%-Bereich], ↓/↑:**
    - Gast, 8 Paare: DOMContentLoaded kalt 595 → 621 ms, **+4 [−65…+56]** (4↓/4↑); wieder 574 → 589, **+23
      [−103…+63]** (2↓/6↑); app.js fertig kalt +4 [−64…+59], wieder +24 [−103…+64]; load kalt +12, wieder +23 (alle
      Bereiche enthalten 0). Tutor-Reiter öffnen kalt 79 → 76 ms, **−4 [−8…+6]** (6↓/2↑); wieder 74 → 69, **−5
      [−11…+2]** (5↓/3↑).
    - Konto (Betreiber, Datenbank 150 ms), 8 Paare: DOMContentLoaded kalt 602 → 613, **−16 [−96…+65]** (5↓/3↑);
      wieder 591 → 580, **−12 [−34…+5]** (6↓/2↑); Tutor-Reiter öffnen kalt 69 → 70, **−5 [−17…+11]**; wieder 74 → 71,
      **−2 [−6…+6]**.
    - **Rauschgrenze (A/A, derselbe Stand zweimal):** Gast 6 Paare DOMContentLoaded kalt −5 [−52…+115], wieder −22
      [−71…+35]; Reiter öffnen +5 [−11…+18] / −1 [−11…+6]. Konto 4 Paare DOMContentLoaded kalt −26 [−55…−13] – reines
      Rauschen trifft mit 4 Paaren „deutlich“ (4/4 auf einer Seite: 1 zu 8), wieder −22 [−47…+35].
  - **Ladezeit 4G (`ladezeit-messen.js`, Gast, 9 Mbit/s, CPU 4×, HTTP/2, Profil auf der Platte, Tipp sofort nach
    bereit; 5 Läufe verschränkt; `…/m4/messung/lz-gegen.*`). d9637a22 → M4, gepaart M4 − alt [Bereich], ↑/↓:**
    - kalt: bereit 1 334 → 1 357 ms, **+45 [−38…+88]** (4↑/1↓); DOMContentLoaded +46 [−35…+88]; erstes Bild 564 →
      552, −8; Wissen-Tipp → Bild 0 [−82…+192]; Sperrzeit (Σ Langläufer über 50 ms) 375 → 460, +68 [−30…+133] (4↑/1↓);
      über die Leitung bis bereit 646 → 650 KB, 64 → 65 Dateien (die Brücke).
    - wieder: bereit 680 → 675, +32 [−41…+80] (3↑/2↓); DOMContentLoaded +30 [−36…+76]; Wissen-Tipp +35 [−53…+66];
      Langläufer-Summe 408 → 321, **−97 [−169…−18] (0↑/5↓)**, Sperrzeit 165 → 121, −47 [−119…−18] (0↑/5↓).
    - Das Werkzeug nennt bei 0 von 68 Maßen „deutlich“; kalt und wieder zeigen in entgegengesetzte Richtungen (kalt
      eher langsamer, wieder weniger Langläufer). Rauschgrenze für bereit, 4G Gast kalt: ±100 ms (886-Gesamtmessung),
      ±~60 ms (A/A 01.11.).
    - **Eigener A/A-Lauf und zweite Reihe stehen noch aus**: der A/A-Lauf am 07.11. ~18 Uhr brach mit dem Nutzungslimit
      ab, danach hielt die Prüfung der Auslieferung 887 den Rechner (vorrang-887 ab 19:35). Bis dahin gilt: kein Maß
      über der Rauschgrenze; die −97 ms Langläufer „wieder“ (5/5) zählen erst nach dem A/A.
  - **Neue Sonde `pruefe-887-modul-app.js`:** A (ohne Browser) Gruppen im Modul und aus app.js verschwunden,
    Weiterleitungen = Exporte (14), Helfer in DMA_APP, Weiterleitungen in min/app.js echte Funktionen im Kern, kein
    gezogener Name mehr in min/app.js, Lader vor app.js, Rückweg in app.js, DMA_MODUL.bruecke = Manifest; B (gast min,
    gast ?quelle, konto min) Brücke läuft vor app.js, Tutor kommt (Tipp auf „Lernen“), „ד und 🎓, Betonung durch Tippen
    an/aus und nach dem Neuzeichnen wieder da, Ohren beim Schreiben, kein pageerror; K Konflikt (window.tutorAn schon
    da: nicht überschrieben, laut, Ersatz statt fremdem Code – seit 08.11. K1/K2 mit Wert und fremder Funktion); R Rückweg (bau/bruecke gesperrt → src/bruecke.js kommt,
    gemerkte Rufe nachgeholt, alles geht). **Grün: A 14/14, B 30/30, K 4/4, R 9/9. Gegenprobe d9637a22: A 9 rot, B1 6
    rot** (B2–B5 dort grün: dasselbe Verhalten wie vorher, so gewollt).
  - **Sonden umgestellt:** runde30, runde60, tutorbild62, betonung-regeln lesen `logisch("app.js")` (app.js +
    src/app/**, `quelle-lesen`); 885-stuecke zählt „kern“-Namen, die mit ihrer Gruppe ins Modul gezogen sind, dort;
    887-bau kopiert ganz src/ (B7 Kopie scheiterte sonst an `./app/tutor.js`) und prüft neu „wiederholbar je Eingang“
    und „Kaskade (Stück)“; 885-schlank Q kennt die Zeile „@bruecke“; 694-leistung zählt bau/-Module wie min/
    (885-swvorladen 11 war deshalb rot); 887-modul-app B2 tippt „Lernen“ (der allererste Aufbau ohne #… ruft activateTab
    nicht – der Tutor kommt dort auch auf d9637a22 nicht von selbst). Welche Sonden die gezogenen Namen lesen, per grep
    über alle 481 Sonden: 885-stuecke, 887-modul-app, betonung-regeln, runde30, runde60, tutor, tutorbild62 – alle oben.
  - **Sonden (Code-Stand 47b3e31b = 04fa3f17 ohne die 694-Sonde; verschränkt neu/alt = d9637a22, gebündelt über die
    Sperre):** grün und mit gleicher Ausgabe wie alt: 887-bau B (ohne Browser) und S, **887-bruecke 18/18
    (Brückenwächter)**, 885-schlank Q/A–G, 876-start-schlank, 885-swvorladen (alle Prüfungen; neu liegt in Prüfung 12
    zusätzlich bau/bruecke im Speicher des Helfers – beim Start geholt, wie gewollt), 885-stuecke, tutor (Ausgabe bis
    auf Zeitstempel gleich), tutorreiter, tutorstimme34, tutorbild62, tutor-stuecke, runde24, runde29, runde30,
    betonung-uebung, betonung-regeln, 766/771/772/773/882-aussprache; 783-aussprache grün (der Vergleichslauf auf
    d9637a22 fiel in die Zeit von vorrang-887 und steht aus). Rot auf beiden Ständen gleich (nicht durch
    M4): runde60 (3× Tondauer 0,00 s) und tutorfilm34 (Alphaspur) – ffmpeg fehlt auf dem Rechner. 887-bau B auf der
    Vergleichskopie: nur B4/B11 rot („kein git“, Kopie ohne .git).
  - **Ergebnis: am Start und beim Öffnen des Tutors weder schneller noch langsamer** – jeder Unterschied liegt in der
    Rauschgrenze (Faktor alt/neu: Tutor-Reiter öffnen 0,99–1,07, DOMContentLoaded 0,96–1,02, 4G bereit 0,98/1,01).
    Erwartet: am Start ändert sich nur, WO der Code steht (min/app.js −4 KB gz, Brücke +7,9 KB gz parallel geholt, beide
    aus dem Code-Speicher); auf d9637a22 lagen 49 der 61 Deklarationen im Kern von min/app.js, 12 (Betonung
    nachschlagen/setzen, tutorAnSetzen/ArtSetzen, Maske …) in rest-Stücken – jetzt alle in der Brücke. Der messbare
    Gewinn von M4 ist das Update: nach einer Änderung am Tutor oder an der Betonung holt jedes Gerät **7,9 KB statt 848
    KB gz (Faktor ~108)**. Nach der Regel „was nicht schneller ist, wird nicht ausgeliefert“ gilt: M4 macht die Seite
    nicht schneller, sondern künftige Updates kleiner; ob er allein oder mit den nächsten Gruppen (Abschnitt 4, Schritt
    11) ausgeliefert wird, entscheidet der Dirigent. Sichtbar ändert sich nichts.
  - **Offen:** der erste Tipp auf einen Textkasten holt weiter rest-Stücke synchron (applyStressToTree, ruleMarkWord und
    der Wortschatz liegen noch in app.js bzw. in min/app-teil-rest*) – das gehört zu Schritt 11, nicht zu M4. Brücke
    abbauen erst in Schritt 12. **Vor einer Auslieferung nachzuholen** (vorrang-887 hielt den Rechner von 19:35 bis
    mindestens 23:35): 4G-A/A dieses Stands (`node werkzeug/ladezeit-messen.js 4g <baum> --aa --arten kalt,wieder
    --laeufe 5 --ohne-spur`), eine zweite Reihe gegen d9637a22 und der Vergleichslauf 783 auf d9637a22. Die
    Vergleichskopie `/tmp/claude-0/t-m4/basis` (1,7 GB) ist gelöscht (Platte); für die Nachläufe neu mit `git archive
    d9637a22` bauen.
  - **Nachbesserung nach der Prüfung, Runde 1 (08.11., Code-Commit d9ea1fb1).** Für Xander unsichtbar (Aussehen,
    Größe, Bedienung gleich). Die Befunde des Prüfers, was daraus wurde:
    1. **Notweg im Funkloch (wichtig, Rückschritt gegen d9637a22).** Auf dem Notweg (`dma-ohne-min`/`dma-ganz`,
       app.js aus der Quelle) und mit `?quelle` lud index.html `src/bruecke.js`. Die Stücke `src/app/*.js` haben
       keinen `?v`-Stempel, sw.js legt sie nie ab (nur 10 min im HTTP-Speicher); ohne Leitung scheiterte die Brücke,
       der Rückweg in app.js an derselben Adresse ebenso: Betonung durch Tippen und die Schreib-Ohren fielen aus (auf
       d9637a22 gingen sie – dort standen sie in app.js). Gerade wer im Funkloch ist, landet im Notweg (ein
       min/-Stück scheitert, `dma-ohne-min` bleibt die ganze Fassung). **Behoben mit Weg (a):** die `@bruecke`-Zeile
       nimmt jetzt auch auf dem Notweg `bau/bruecke-*.js` – bau/ hängt nicht an min/, heißt nach seinem Inhalt und
       liegt im Speicher des Helfers (`bauHolen`); `src/bruecke.js` nur noch mit `?quelle` oder ohne Bau. Gleich lang
       wie vorher (885-schlank Q grün: gepackt −5 085 B). Nicht gewählt: (b) sw.js legt `src/**` ab – änderte den
       Helfer jedes Geräts, gebraucht nur für `?quelle` und den Rückweg; (c) Stempel für die Stücke – ginge nur über
       eine Importkarte (885-schlank Q, siehe oben) oder umgeschriebene `import`-Zeilen. **Bleibt (klein, offen):**
       mit `?quelle` (Schalter für Entwickler) und auf dem Rückweg (bau/ nicht ladbar) kommen die Stücke weiter ohne
       Stempel: offline geht dort die Betonung nicht, und bis zu 10 min nach einem Update kann dort ein neues
       `src/bruecke.js` mit einem alten Stück laufen.
    2. **Konflikt mit einer fremden Funktion (klein).** Die Behauptung „app.js nimmt dann den Ersatz statt des
       fremden Codes“ stimmte nur für einen fremden Wert: `dmaModul` rief jedes `window[name]`, das eine Funktion war
       (nachgestellt: fremdes `window.tutorBereichRufen` wurde gerufen). Jetzt legt `src/bruecke.js` jede Funktion in
       die eigene Tabelle `DMA_BRUECKE.fn` (auch bei Konflikt), `dmaModul` ruft nur von dort. Der fremde Wert bleibt
       auf window stehen (überschrieben wird weiter nichts), app.js ruft immer das eigene Modul.
    3. **Werkzeug und Strings (klein).** `app-modul-ziehen.js` rückte jede Zeile aus, auch Zeilen in mehrzeiligen
       Template-Literalen – das änderte den Inhalt eines Strings (innerHTML der Tutor-Bühne 2 578 → 2 504 Zeichen,
       nur Leerraum zwischen Elementen; Bildvergleich des Prüfers: kein Unterschied). Jetzt bleibt jede Zeile, die
       in einem String beginnt (Template-Teil oder String mit „\“ am Zeilenende), wie sie ist; neu
       `--pruefen <alte app.js>` vergleicht ein Modul Deklaration für Deklaration mit der alten app.js. Gegen
       d9637a22: **tutor 43 Deklarationen Zeichen für Zeichen gleich** (vorher 42, `tutorBuehne` anders), **betonung
       16 gleich**, je 1 neu (`tutorSchreibOhren`, `betonungBeobachten` – vor dem Ziehen aus Anweisungen gefasst,
       gewollt). `tutorBuehne` ist wieder genau wie in d9637a22.
    4. **Warteschlange ohne Ereignisse (klein).** `dmaModul` merkt sich keine Rufe mehr, die ein Ereignis tragen
       (`betonungTippen` hängt am Dokument, jeder Klick kam samt Ziel in die Schlange). Ein Tipp, solange die Brücke
       fehlt (nur auf dem Rückweg), bleibt ohne Wirkung, statt Sekunden später umzuschalten, und die Schlange hält
       keine Knoten fest. Auf dem normalen Weg und dem Notweg ist die Brücke vor app.js da – dort ändert sich nichts.
    5. **Sondenliste (klein).** 884-notweg gehört dazu (gelaufen, siehe unten); 887-modul-app prüft den Notweg jetzt
       selbst (N). Weiter lesen 63 Sonden die rohe app.js ohne `logisch()`; 6 davon haben „nicht enthalten“-Prüfungen
       (864-uhr-ohne-intl, 882-tafel-ordner-griff, runde15, runde22, runde80, tonschleifen) – keine nennt Tutor oder
       Betonung. Bei jeder weiteren Gruppe (Schritt 11) gehört dazu: per grep, welche Sonde ihre Namen nennt, und die
       auf `logisch()` umstellen.
    - **Größe und Platz:** bau/bruecke 20 167 → 20 278 B (gz 7 909 → 7 931); index.html gz 22 941 B (d9637a22:
      22 842); min/app.js 733 475 B (gz 199 719). Das nie ausgelieferte `bau/bruecke-CL1VLwwc.js` bleibt liegen
      (`modul-bauen.js` behält, was die letzten 3 Manifeste nennen), +20 KB. Alle Dateien im Baum: gegen 2417165d
      +35 760 B, gegen d9637a22 +96 105 B (vor diesem Logbuch-Absatz) – für GitHub Pages (≈948 MB) unerheblich.
    - **Messung (A = d9637a22 als schlanke Kopie, B = d9ea1fb1, verschränkt, CPU 4×, Telefonfenster; Daten
      `/tmp/claude-0/m4nb/mess/`). Median A → B, gepaart B − A [95-%-Bereich], ↓/↑, Faktor A/B:**
      - **Notweg** (Skript des Prüfers `scratchpad/m3b4/messen.js`: erst ein normaler Besuch, dann wie `dmaGanzLaden`
        `dma-ganz = ["app.js"]` und die Quelle vorab geholt; gemessen das Neuladen bei 4G, 60 ms / 9 Mbit/s),
        6 Paare: DOMContentLoaded 1. Neuladen 7 767 → 7 664 ms, **−90 [−206…+20]** (5↓/1↑, Faktor 1,013); 2. Neuladen
        7 751 → 7 700, **−25 [−74…+58]** (3↓/3↑, 1,007). A/A (d9637a22 gegen sich, 4 Paare): +45 [−104…+121] /
        +118 [−192…+132]. Vor der Nachbesserung (Prüfer, 4 Paare): +81 / +72. Im Rauschen – kein Verlust mehr.
      - **Start Gast** (`scratchpad/m4/m4-messen.js`, 6 Paare): DOMContentLoaded kalt 644 → 653, +6 [−25…+17]; wieder
        628 → 622, +7 [−139…+52]; Tutor-Reiter öffnen kalt 80 → 79, −11 [−24…+13]; wieder 71 → 68, +1 [−30…+21].
      - **Start Konto** (Betreiber, Datenbank 150 ms; 2 Reihen, 12 Paare): DOMContentLoaded kalt 673 → 633, −30
        [−121…+3] (9↓/3↑); **wieder 633 → 690, +37 [+4…+61] (3↓/9↑, „deutlich“)**; Tutor-Reiter öffnen kalt 87 → 76,
        −8 [−16…+8]; wieder 79 → 93, +10 [−14…+18]. Gegenprüfung des „deutlich“: A/A Konto (d9637a22 gegen sich, 6
        Paare) wieder +6 [−19…+100] bei Medianen 590 / 659 (69 ms Abstand OHNE Unterschied im Code); nur die
        Nachbesserung (2417165d → d9ea1fb1, 6 Paare) wieder +57 [−107…+178]; die erste M4-Reihe (07.11., 8 Paare)
        wieder −12 [−34…+5]. Die Reihen widersprechen sich – kein belegter Unterschied; Konto „wieder“ ist aber das Maß,
        das vor einer Auslieferung mit mehr Paaren (≥ 16) noch einmal gemessen gehört.
      - **4G, zweite Reihe gegen d9637a22** (`ladezeit-messen.js 4g … --gegen`, Gast, 5 Läufe; hier M4 − alt): kalt
        bereit 1 323 → 1 342, +15 [−147…+78] (4↑/1↓); erstes Bild 524 → 544, +32 [−56…+48]; Wissen Tipp → Bild
        233 → 396, +141 [−174…+182]; Sperrzeit 323 → 383, +60 [−106…+136]; wieder bereit 627 → 652, +91
        [−136…+151] (4↑/1↓); Wissen +4 [−4…+119]; Langläufer-Summe wieder 370 → 356 – die −97 (5/5) der ersten Reihe
        kamen nicht wieder (wie vermutet Rauschen). „Alte Spalte“ Wissen-Tipp → Knopf +62 / +56 (5/5) – laut Werkzeug
        mit dessen eigenen Pausen (Messfehler), im A/A dieselbe Spalte −1 [−258…+37] / −41 [−63…+84]. Das Werkzeug
        nennt 0 von 68 Maßen „deutlich“.
      - **4G-A/A (nachgeholt; M4 gegen sich, 5 Läufe):** Rauschgrenze kalt bereit ±109, Wissen ±234,
        Klassenzimmer-Knopf ±37, erstes Bild ±32; wieder bereit ±85, Wissen ±53, Knopf ±28, erstes Bild ±26. Kein Maß
        der beiden 4G-Reihen liegt darüber.
      - **Ergebnis:** die Nachbesserung behebt den Rückschritt im Funkloch und ist sonst unsichtbar; schneller wird
        dadurch nichts. Für M4 insgesamt bleibt es bei: Start und Tutor-Öffnen im Rauschen (Faktor alt/neu 4G bereit
        0,99 kalt / 0,96 wieder, Gast DOMContentLoaded 0,99 / 1,01, Notweg 1,01), der Gewinn ist das kleine Update
        (7,9 statt 848 KB gz nach einer Tutor-/Betonungs-Änderung).
    - **Sonden nach der Nachbesserung (Code d9ea1fb1; verschränkt: je Sonde erst M4, dann d9637a22 als schlanke Kopie,
      alles über die Sperre; Ausgaben `/tmp/claude-0/m4nb/aus-*`, `/tmp/claude-0/m4r2/`):**
      - **887-modul-app grün 75/75** (A 20, B 30, K 8, R 10, N 7). **Gegenprobe d9637a22: 29 rot** (A 14, B1 6, K 6,
        R 2, N 1 – dort gibt es keine Brücke; dass Betonung und Ohren dort offline gehen, ist der Ausgangsstand, den N
        für M4 verlangt). **Gegenprobe 2417165d (vor der Nachbesserung): 18 rot, genau die neuen Fälle** – A5 Notweg,
        Tabelle, Ereignis, `DMA_BRUECKE.fn` (4); A6 Werkzeug (2: Zeilen im Template-Literal um 2 Leerzeichen kürzer,
        kein `--pruefen`); B1 „0 in fn“ (3); K1/K2 (3: die fremde `tutorBereichRufen` wurde gerufen, „fremd gerufen:
        1“); R (1: ein Tipp vor der Brücke schaltete die Betonung später ein); N (5: keine Brücke, 0 markierte Silben,
        Ohren aus – der Rückschritt aus Befund 1).
      - **Gegenprüfung mit der Sonde des Prüfers** (`scratchpad/m3b4/wege.js`, unverändert; je Fall M4, dann
        d9637a22): **swnotweg** (Laden 1 und 2 mit Helfer, Laden 3 ohne Leitung) M4: Brücke aus bau/ (14 Namen),
        Betonung an (24 Silben), wieder, aus, Ohren ok – **genau wie d9637a22** (vor der Nachbesserung beim Prüfer:
        br=null, Betonung an=false, Ohren=false); der Tutor kommt offline auf beiden nicht. **konfliktfn** (fremde
        `window.tutorBereichRufen`) M4: Konflikt gemeldet, Tutor kommt, **fremd=0** (beim Prüfer vorher 1); d9637a22
        fremd=0. **notweg** (online) M4 und d9637a22: Tutor, Reiter, Ohren, Betonung (43) alles da.
        **ohnebau** (bau/bruecke gesperrt) M4: bau/ scheitert, `src/bruecke.js` kommt über den Rückweg, alles da.
        **quelle** M4: `src/bruecke.js` vor app.js, alles da. **min** M4: bau/bruecke vor min/app.js, alles da. Auf
        d9637a22 jeweils dasselbe Verhalten (ohne Brücke). Kein pageerror in den 12 Läufen.
      - **Grün und gleich wie auf d9637a22** (Ausgabe bis auf Zeiten und Hash-Namen gleich): 884-notweg 91/91 (A–O; G:
        `/app.js` genau einmal vom Server), 887-bruecke 19/19 (Brückenwächter), 885-schlank 43/43 (Q mit der Zeile
        „@bruecke“: gepackt −5 085 B), 876-start-schlank 62/62, 885-swvorladen 32/32 (Prüfung 12: bau/bruecke liegt im
        Speicher des Helfers), 885-stuecke 43/43, 887-bau 42/42 (auf der Kopie von d9637a22 37 ok, B4/B11 rot „kein
        git“ – Kopie ohne .git), tutor (gleich bis auf Zeitstempel), tutorreiter, tutorstimme34 10/10, tutorbild62 7/7,
        tutor-stuecke 6/6, runde24 32/32, runde29 32/32, runde30 78/78, betonung-uebung 17/17, betonung-regeln,
        766 10/10, 771 19/19, 772 17/17, 773 11/11, 882 8/8, **783 10/10 – der Vergleichslauf auf d9637a22 ist
        nachgeholt: gleich**. runde60 23/23 und tutorfilm34 31/31 sind jetzt auf beiden Ständen grün (am 07.11. auf
        beiden rot, weil ffmpeg fehlte – es ist inzwischen da).
      - **Rot auf beiden Ständen gleich (nicht durch M4):** 694-leistung 1 rot „beim erneuten Öffnen kommt KEINE
        gestempelte Datei mehr übers Netz“ (`min/spiel.js` – der bekannte spiel.js-Wettlauf aus 884, den
        885-swvorladen 11 als bekannt führt). Der erste Lauf von 885-schlank auf der d9637a22-Kopie brach nach 342 s ab
        (Rechner geteilt); der zweite verschränkte Lauf beider Stände war grün.
      - **Damit ist von der Liste „vor einer Auslieferung nachzuholen“ erledigt:** 4G-A/A, zweite 4G-Reihe, 783 auf
        d9637a22. Offen bleibt nur, was oben steht: Konto „wieder“ mit ≥ 16 Paaren, und (klein) `?quelle`/Rückweg
        offline ohne Stempel für `src/app/*`.
  - **Nachbesserung nach der Prüfung, Runde 2 (08.11., Code-Commit 9d82ff6f, Sonde 5230e92d).** Für Xander
    unsichtbar (Aussehen, Größe, Bedienung gleich). Die Befunde des Prüfers, was daraus wurde:
    1. **Helferwechsel im Funkloch (wichtig, Rückschritt gegen d9637a22).** Heute hat jedes Gerät den sw.js der
       Fassung 887 (origin/main). Der kennt die Regel für bau/ nicht: er legt nur Dateien mit `?v=` ab, bau/ geht an
       ihm vorbei ins Netz. Im Besuch mit dem Update auf diese Fassung kam die Brücke deshalb nur aus dem Netz; der neue
       Helfer übernimmt erst am Ende des Besuchs (controllerchange) und holt nichts vorab. Im nächsten Besuch ohne
       Leitung scheiterten `bau/bruecke-*.js` und der Rückweg `src/bruecke.js` – Betonung durch Tippen aus (0 Silben),
       Ohren aus, `tutorAn()` lieferte den Ersatz false (Einstellung zeigte den Tutor-Schalter aus), kein pageerror.
       Auf d9637a22 gingen Betonung (73 Silben) und Ohren (dort stand beides in min/app.js mit Stempel, also im
       Speicher). Einmal je Gerät, genau im Funkloch; heilte sich mit dem nächsten Besuch mit Leitung.
       **Behoben nach dem Vorschlag des Prüfers** (app.js, `dmaBauSichern`): War die Seite beim Start schon gesteuert,
       holt sie nach `controllerchange` und einmal in der Ruhepause (8 s nach load, `requestIdleCallback`) jede
       bau/-Datei, die sie geladen hat (Skript-Elemente und Resource Timing) und die in `dma-dateien-1` fehlt, einmal
       über den Helfer – `bauHolen` in sw.js legt sie ab. Liegt alles im Speicher (jeder Besuch nach dem Wechsel), geht
       keine Anfrage hinaus, es bleibt ein `caches.match` je Datei. Beim allerersten Besuch (noch kein Helfer beim
       Start) bleibt alles wie bisher. Die Ruhepause fängt den Fall, dass der Wechsel kam, bevor app.js zuhörte.
       Nicht gewählt: die bau/-Regel eine Fassung vor M4 ausliefern – hilft nur Geräten, die dazwischen online waren.
       **Sonde 887-modul-app W** (neu): der alte Helfer wird aus dem eigenen sw.js ohne die bau/-Regel nachgebildet –
       Byte für Byte der sw.js von origin/main (die Sonde vergleicht und meldet es); Laden 1 und 2 mit ihm, dann ein
       Besuch mit Leitung, in dem dieser sw.js übernimmt, dann ohne Leitung: Betonung (an, nach Neuzeichnen wieder,
       aus) und Ohren gehen, die Brücke liegt nach dem Wechsel im Speicher und kommt offline aus bau/. W1 wie im
       Betrieb, W2 ohne das Ohr für controllerchange (nachgestellt: Wechsel vor app.js – dann die Ruhepause).
       Dazu A7 (ohne Browser): Rückweg bei DOMContentLoaded, Sicherung nur mit Helfer beim Start, nach
       controllerchange und in der Ruhepause, derselbe Speichername wie `KASTEN` in sw.js.
    2. **Konto „wieder“ (klein, Messung).** Neue Reihe mit 16 Paaren A/A und 16 Paaren A/B, siehe Messung unten.
    3. **`?quelle` und Rückweg ohne Stempel für `src/app/*` (klein) – bleibt offen.** Mit Befund 1 behoben ist der
       Fall, der Geräte im Betrieb trifft (normaler Weg und Notweg holen bau/, und bau/ liegt jetzt auch nach dem
       Helferwechsel im Speicher). Ohne Stempel bleiben nur `?quelle` (Schalter für Entwickler) und der Rückweg, wenn
       bau/ mit Leitung nicht ladbar ist. Eine Abhilfe bräuchte entweder sw.js, das `src/**` ablegt (ändert den Helfer
       jedes Geräts für einen Fall, den im Betrieb fast niemand hat), oder Stempel in den `import`-Zeilen
       (Importkarte: 885-schlank Q, siehe oben; oder umgeschriebene Quelle). Vorschlag: mit Schritt 10/12, wenn bau/
       alles trägt und `src/` nur noch Quelle ist.
    4. **Reihenfolge in Safari (klein).** Auf dem Rechner gibt es kein WebKit. Unabhängig davon ist der Rückweg jetzt
       reihenfolgefest: er lädt `src/bruecke.js` erst bei DOMContentLoaded – dann ist jedes Modul der defer-Reihe
       gelaufen oder gescheitert. Läuft das Modul in einem Browser doch erst nach app.js, kommt so nicht zusätzlich die
       Quelle (vorher: Brücke doppelt, `src/` ohne Stempel); die Rufe bis dahin holt `nachholen` wie bisher nach. Sonde
       R prüft das jetzt (`src/bruecke.js` angefragt erst bei DOMContentLoaded, genau einmal: 193 / 194 ms).
       Neu `DMA_APP.brueckeVorher` (true = das Modul lief vor app.js) für die Prüfung auf dem Gerät. **Vor der
       Auslieferung einmal auf einem echten iPhone:** Safari-Web-Inspektor, Konsole `DMA_APP.brueckeVorher` → true,
       im Netzwerk keine Anfrage an `src/bruecke.js`.
    - **Größe und Platz:** min/app.js 733 475 → 734 730 B (gz 199 712 → 200 192, +480 B); app.js +3 374 B; bau/ und
      src/ unverändert (gleiche Brücke `bau/bruecke-CSGLwKEs.js`), index.html nur Stempel. Alle Dateien im Baum gegen
      542e4250 +12 808 B (vor diesem Logbuch-Absatz).
    - **Sonden (Code 9d82ff6f/5230e92d; verschränkt: je Sonde erst M4, dann d9637a22 als schlanke Kopie – für die
      Sonden mit `git show` mit eigenem `.git` über die Objekte des Hauptbaums –, alles über die Sperre; Ausgaben
      `/tmp/claude-0/m4r3/aus/`):**
      - **887-modul-app grün 97/97** (A 23, B 30, K 8, R 11, N 7, W 18). **Gegenprobe d9637a22: W grün** (W1/W2:
        Ausgangslage, offline Seite aus dem Helfer, Ohren, Betonung an/wieder/aus mit 24 Silben, kein pageerror – dort
        steht beides in app.js; die Brücken-Prüfungen entfallen, „Stand ohne Brücke“), A 17 rot (keine Brücke, kein
        A7). **Gegenprobe 542e4250 (vor dieser Nachbesserung): 15 rot** – W1/W2 je 6 (Brücke nach dem Wechsel nicht im
        Speicher, offline keine Brücke, Ohren aus, 0 Silben, Betonung nicht wieder, nicht aus: der Befund des Prüfers),
        A7 3; R neu 1 rot (`src/bruecke.js` angefragt bei 205 ms, DOMContentLoaded erst bei 228 ms).
      - **Grün und gleich wie auf d9637a22:** 887-bruecke 19/19 (Brückenwächter), 885-schlank 43/43 (Q mit der Zeile
        „@bruecke“), 876-start-schlank 62/62, 885-swvorladen 32/32 (9: Gerät mit dem alten Helfer 884 bekommt den
        neuen ohne Neuladen), 884-notweg 91/91, 885-stuecke 43/43, 885-schale 72/72, 887-bau 42/42 (auf der Kopie
        B4/B11 rot: „git-Baum nötig“, Kopie ohne Verlauf – wie in Runde 1).
      - **Rot auf beiden Ständen gleich (nicht durch M4):** 694-leistung „beim erneuten Öffnen kommt KEINE
        gestempelte Datei mehr übers Netz“ (`min/spiel.js`, der bekannte Wettlauf; 4 Läufe je Stand verschränkt:
        d9637a22 1× grün, 3× rot; M4 4× rot – alle Roten mit genau dieser einen Datei, keine Anfrage an bau/).
      - Tutor-, Betonungs- und Aussprache-Sonden: laufen noch (verschränkt), Ergebnis folgt.
    - **Messung Konto (Befund 2; A = d9637a22 als schlanke Kopie, B = 9d82ff6f, `scratchpad/m4/m4-messen.js`, Betreiber,
      Datenbank 150 ms, CPU 4×, eigener Server je Stand mit max-age=600, ohne Helfer; je 4 Paare pro Sperre, A/B und
      A/A abwechselnd, 16 + 16 Paare; Daten `/tmp/claude-0/m4r3/mess/`). Median A → B, gepaart B − A [95-%-Bereich],
      ↓/↑, Vorzeichentest p (zweiseitig), Faktor A/B:**
      - **wieder: DOMContentLoaded 659 → 662 ms, +13 [−16…+40], 6↓/10↑, p = 0,45, Faktor 0,995**; app.js-Start +3
        [−18…+27]; app.js-Dauer +4 [−11…+32] (8↓/8↑); Tutor-Reiter öffnen −4 [−12…+8].
      - kalt: DOMContentLoaded 685 → 699, +16 [−64…+71], 6↓/10↑, p = 0,45, Faktor 0,98; app.js-Dauer −5 [−47…+23];
        Tutor-Reiter öffnen −2 [−15…+3].
      - **Rauschgrenze (A/A, d9637a22 gegen sich, 16 Paare):** wieder DOMContentLoaded +6 [−58…+77]; kalt +22
        [−50…+72]. Im A/A ist ein Maß „deutlich“, ohne Unterschied im Code: kalt app.js-Dauer +22 [+1…+42], 3↓/13↑,
        p = 0,02 (dazu Tutor-Reiter kalt +14 [+1…+38]) – bei 12 Maßen trifft reines Rauschen das allein.
      - **Mit allen früheren Paaren zusammen** (20 Paare des Bauers und des Prüfers auf d9ea1fb1, Code bis auf diese
        Nachbesserung gleich, + 16 neue = 36): wieder DOMContentLoaded +27 [−1…+50], 12↓/24↑, p = 0,07, Faktor 0,97;
        kalt −19 [−67…+16] (20↓/16↑). A/A zusammen (6 + 16 = 22 Paare): wieder +6 [−27…+77].
      - **Ergebnis:** kein belegter Verlust – die neue Reihe allein liegt mitten im Rauschen, und kalt zeigt in die
        andere Richtung. Über alle 36 Paare neigt „wieder“ zu etwa +1…+4 % (p = 0,07, nicht signifikant, innerhalb des
        A/A-Bereichs). Ausschließen lässt sich ein kleiner Preis beim Laden mit warmem Speicher (ein Modul mehr vor
        app.js: holen, übersetzen, verknüpfen) damit nicht; nach oben begrenzt auf etwa +50 ms bei CPU 4×. Schneller
        wird der Start durch M4 nicht – das stand schon so im Ergebnis oben; der Gewinn bleibt das kleine Update.
