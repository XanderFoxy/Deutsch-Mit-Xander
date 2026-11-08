#!/usr/bin/env node
/* =========================================================
   DIE FASSUNGSNUMMER STEHT AN EINER STELLE — NICHT AN ZWEI
   ---------------------------------------------------------
   XANDER: „Ich weiss nicht, ob du die Adressen richtig
   aufgesetzt hast. Alles, was du mir in dem Update
   beschreibst, ist nirgendswo sichtbar."

   GEFUNDEN, und es ist keine Kleinigkeit: die Seite haengt
   JEDE Datei an „?v=" + DMA_VERSION — Skripte, Stilblaetter,
   Toene. Das wirkt aber nur, wenn die index.html selbst neu
   geholt wird. Genau das tut ein Browser nicht: GitHub Pages
   schickt seine eigenen Cache-Header mit, und die drei
   <meta http-equiv="Cache-Control">-Zeilen oben in der Datei
   beachtet kein Browser fuer das Dokument selbst (sie gelten
   nur fuer Dinge, die ueber echte HTTP-Kopfzeilen laufen).
   Wer die Seite einmal geladen hat, bekommt also weiter die
   ALTE index.html — mit der alten Fassungsnummer, und damit
   das alte Javascript, das alte Aussehen und die alten Toene.
   Im privaten Fenster ging es, weil das nie einen Cache hat.

   Deshalb gibt es jetzt „fassung.json": eine winzige Datei,
   die die Seite beim Start mit „cache: no-store" holt — das
   umgeht jeden Zwischenspeicher. Steht dort eine andere Zahl
   als die geladene, laedt sich die Seite EINMAL unter einer
   neuen Adresse neu und ist damit auf dem Stand.

   Damit die beiden Zahlen nie auseinanderlaufen, setzt dieses
   Werkzeug sie gemeinsam.

   AUFRUF:  node werkzeug/fassung-setzen.js 421
            node werkzeug/fassung-setzen.js --nur-stempel

   FUNK 101 — XANDER: „warum es im Chat manchmal so extrem lange
   lädt … liegt das an diesen Updates … bitte mach das der Chat
   immer flüssig bleibt und dass er von den Updates nicht
   beeinträchtigt ist."

   GEMESSEN (werkzeug/pruefe-ladezeit.js, 10 Mbit/s, Rechner
   vierfach gebremst): nach einem Update holte jedes Gerät ALLE
   Skripte neu, 3,1 MB, 4,4 s — auch die, an denen sich nichts
   geändert hatte, weil jede Adresse an der Fassungsnummer hing.
   Ohne Update waren es 1 KB und 0,8 s. Bei mehreren Updates am
   Tag zahlte man die 3,1 MB also jedes Mal.

   Jetzt bekommt jede Datei ihren EIGENEN Stempel aus ihrem Inhalt
   (window.DMA_STEMPEL in index.html). Eine Datei, die sich nicht
   geändert hat, behält ihre Adresse und kommt aus dem
   Zwischenspeicher. Neu geladen wird nur, was wirklich neu ist.

   Damit ein Stempel nie hinter dem Inhalt herhinkt, legt dieses
   Werkzeug einen git-Haken an (.git/hooks/pre-commit): vor JEDEM
   Commit werden die Stempel neu gerechnet (--nur-stempel).
   ========================================================= */
const fs = require("fs");
const path = require("path");
const WURZEL = path.dirname(__dirname);

const indexPfad = path.join(WURZEL, "index.html");

/* Jede Skript- und Stildatei im Hauptordner bekommt einen Stempel aus
   ihrem Inhalt; die Ordner mit Tönen, Tutor und Szenen je einen für den
   ganzen Ordner (ändert sich ein Ton, gilt der neue Stempel für alle
   Töne — das ist selten und hält die Liste klein). */
const STEMPEL_ORDNER = ["ton", "tutor", "szenen", "aussprache", "figuren", "bilderwelt-neu"];   // FASSUNG 840: neue Bilderwelt in eigenem Ordner
const STEMPEL_EINZELN = ["vokabeln", "kalender"];   // FASSUNG 837: Stempel je Datei (siehe stempelSetzen)

/* =========================================================
   FASSUNG 694 — DIE SEITE LÄDT VERKLEINERTE KOPIEN
   ---------------------------------------------------------
   XANDER: „wenn die Ladl nicht so groß wäre oder man das alles
   so ein bisschen professioneller aufteilen könnte … ohne dass
   jemand ne Grafikeinbuße"

   GEMESSEN: app.js wiegt 6 MB, fast ein Drittel davon sind
   Kommentare wie dieser hier. Der Browser holt und liest jede
   Zeile davon, bevor er etwas zeigt. Alle Startdateien zusammen:
   3,46 MB gepackt, verkleinert 1,87 MB.

   JETZT liegt in min/ zu jeder Skript- und Stildatei eine Kopie
   ohne Kommentare und ohne Leerraum (esbuild). Am Programm und an
   den Bildern ändert das nichts — es fehlen nur die Erklärungen,
   und die bleiben in den Quellen stehen (die Werkzeuge lesen die
   Quellen, nicht die Kopien).

   DAMIT NIE EINE ALTE KOPIE AUSGELIEFERT WIRD: min/.quelle.json
   merkt sich, aus welchem Quellstand jede Kopie stammt. Passt der
   nicht mehr und kann nicht neu verkleinert werden (esbuild fehlt,
   Fehler), wird die Kopie GELÖSCHT — dann steht für sie kein
   Stempel „min/…" in index.html, und die Seite lädt die Quelle.
   ========================================================= */
const MIN_ORDNER = path.join(WURZEL, "min");
function esbuildHolen() {
  /* MODUL-UMBAU: seit node_modules/ (Vite) im Baum liegt, fände require("esbuild") auch ein anderes esbuild –
     min/ wird aber nur mit genau 0.28.2 verkleinert (sonst bekämen alle Kopien neue Stempel und jedes Gerät holte
     alles neu). package.json pinnt 0.28.2 deshalb oben; hier wird die Fassung zusätzlich geprüft. */
  const passt = (m) => (m && m.version === "0.28.2" ? m : null);
  const suchen = () => {
    try { const m = passt(require("esbuild")); if (m) return m; } catch (e) {}
    const basis = path.join(require("os").homedir(), ".npm", "_npx");
    try {
      for (const d of fs.readdirSync(basis)) {
        const p = path.join(basis, d, "node_modules", "esbuild");
        if (fs.existsSync(path.join(p, "package.json"))) { const m = passt(require(p)); if (m) return m; }
      }
    } catch (e) {}
    return null;
  };
  let eb = suchen();
  if (!eb) {
    try {
      require("child_process").execSync("npx --yes esbuild@0.28.2 --version", { stdio: "ignore", timeout: 180000 });
    } catch (e) {}
    eb = suchen();
  }
  return eb;
}
function verkleinern() {
  const crypto = require("crypto");
  if (!fs.existsSync(MIN_ORDNER)) fs.mkdirSync(MIN_ORDNER);
  const merkPfad = path.join(MIN_ORDNER, ".quelle.json");
  let merk = {};
  try { merk = JSON.parse(fs.readFileSync(merkPfad, "utf8")); } catch (e) {}
  /* sw.js wird unter seinem eigenen Namen angemeldet — keine Kopie. */
  const quellen = fs.readdirSync(WURZEL).filter((n) => /^[a-z0-9-]+\.(js|css)$/i.test(n) && n !== "sw.js").sort();
  let eb = null, ebGesucht = false, neu = 0, weg = 0;
  /* FASSUNG 876 — XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller". min/app.js wird geteilt:
     was Start und Klassenzimmer nicht brauchen, steht in min/app-teil-*.js (werkzeug/teile-bauen.js erklärt es).
     Die Prüfsumme für app.js umfasst deshalb auch die Liste und das Bauwerkzeug. Geht das Teilen nicht,
     entsteht min/app.js wie bisher ganz. */
  let teile = null, stil = null, stilListe = null;
  try { teile = require("./teile-bauen.js"); } catch (e) { teile = null; }
  /* FASSUNG 876 — dazu für korrekturen.css, app-styles.css und spiel.css ein kleines Startblatt
     min/<name>-start.css (werkzeug/stil-bauen.js erklärt es); das ganze Blatt kommt gleich danach. */
  try { stil = require("./stil-bauen.js"); stilListe = stil.listeLesen(); } catch (e) { stil = null; }
  const mitStart = (n) => Boolean(stil && stilListe && stilListe.spaet && stilListe.spaet[n] && /\.css$/.test(n));
  quellen.forEach((n) => {
    const roh = fs.readFileSync(path.join(WURZEL, n), "utf8");
    const h = (n === "app.js" || n === "data-exercises.js") && teile ? teile.bauSumme(roh)
      : mitStart(n) ? stil.bauSumme(roh) : crypto.createHash("sha1").update(roh).digest("hex");
    const ziel = path.join(MIN_ORDNER, n);
    if (merk[n] === h && fs.existsSync(ziel) && (!mitStart(n) || fs.existsSync(path.join(MIN_ORDNER, stil.startName(n))))) return;
    if (!ebGesucht) { eb = esbuildHolen(); ebGesucht = true; }
    delete merk[n];
    try {
      if (!eb) throw new Error("esbuild fehlt");
      if (n === "app.js" && teile) {
        const t = teile.verkleinertTeilen(roh, eb, (m) => console.error("  " + m));
        if (t) { teile.schreiben(MIN_ORDNER, t); merk[n] = h; neu++; return; }
        teile.teileLoeschen(MIN_ORDNER);
      }
      if (n === "data-exercises.js" && teile) {
        const u = teile.uebungTeilen(roh, eb, (m) => console.error("  " + m));
        const tz = path.join(MIN_ORDNER, "data-exercises-teil.js");
        if (u) { teile.ersetzen(ziel, u.kern); teile.ersetzen(tz, u.teil); merk[n] = h; neu++; return; }
        if (fs.existsSync(tz)) fs.unlinkSync(tz);
      }
      const r = eb.transformSync(roh, { loader: n.endsWith(".css") ? "css" : "js", minify: true,
        legalComments: "none", charset: "utf8" });
      if (!r.code || r.code.length >= roh.length) throw new Error("nicht kleiner");
      fs.writeFileSync(ziel, r.code);
      if (stil && /\.css$/.test(n)) {
        const sz = path.join(MIN_ORDNER, stil.startName(n));
        let start = null;
        try { start = mitStart(n) ? stil.startBlattMin(n, roh, eb) : null; } catch (e) { start = null; }
        if (start != null) fs.writeFileSync(sz, start); else if (fs.existsSync(sz)) fs.unlinkSync(sz);
      }
      merk[n] = h;
      neu++;
    } catch (e) {
      if (fs.existsSync(ziel)) { fs.unlinkSync(ziel); weg++; }
      if (stil && /\.css$/.test(n) && fs.existsSync(path.join(MIN_ORDNER, stil.startName(n)))) fs.unlinkSync(path.join(MIN_ORDNER, stil.startName(n)));
      if (n === "app.js" && teile) teile.teileLoeschen(MIN_ORDNER);
      console.error("  min/" + n + " nicht verkleinert (" + (e.message || e).toString().split("\n")[0] + ") — die Seite lädt die Quelle");
    }
  });
  /* Kopien, deren Quelle es nicht mehr gibt, fliegen raus (die Teile von app.js gehören zu app.js). */
  fs.readdirSync(MIN_ORDNER).filter((n) => /\.(js|css)$/.test(n) && quellen.indexOf(n) < 0
    && !(teile && teile.istTeil(n) && fs.existsSync(path.join(MIN_ORDNER, "app.js")))
    && !(teile && n === "data-exercises-teil.js" && fs.existsSync(path.join(MIN_ORDNER, "data-exercises.js")))
    && !(stil && stil.istStart(n) && quellen.indexOf(n.replace(/-start\.css$/, ".css")) >= 0 && mitStart(n.replace(/-start\.css$/, ".css")))).forEach((n) => {
    fs.unlinkSync(path.join(MIN_ORDNER, n)); delete merk[n]; weg++;
  });
  fs.writeFileSync(merkPfad, JSON.stringify(merk, null, 1) + "\n");
  return { neu, weg };
}

/* MODUL-UMBAU (Schritt 1, MODULE-PLAN.md Abschnitt 3, M1): der Vite-Bau steht in werkzeug/modul-bauen.js. Scheitert er,
   bleiben bau/ und DMA_MODUL, wie sie waren; die Stempel für min/ werden trotzdem gesetzt, Rückgabe am Ende 2. */
let modulFehler = null;
/* MODUL-UMBAU M3b (MODULE-PLAN.md Abschnitt 3): die Übungsdaten je Kategorie als Skript (werkzeug/uebungen-teilen.js,
   aus der unveränderten data-uebungen.js). Scheitert das, gibt es keinen Eintrag „uebungen" in DMA_MODUL (die Seite lädt
   die ganze Datei), laut auf stderr, Rückgabe 2. Fehlt das Werkzeug (Vergleichsstand), passiert nichts. */
function uebungenTeilen() {
  let ut = { eintrag: null, gebaut: false, neu: 0, geloescht: 0, fehler: null };
  if (!fs.existsSync(path.join(__dirname, "uebungen-teilen.js"))) return ut;
  try { ut = require("./uebungen-teilen.js").bauen(WURZEL); } catch (e) { ut = { eintrag: null, fehler: "uebungen-teilen.js: " + (e.message || e) }; }
  if (ut.fehler) { modulFehler = modulFehler || "Übungsteile"; console.error("\n!!! ÜBUNGSTEILE: " + ut.fehler + " – DMA_MODUL ohne „uebungen“, die Seite lädt die ganze data-uebungen.js\n"); }
  if (ut.gebaut) console.log("bau/uebungen: neu gebaut (" + ut.eintrag + ", " + ut.neu + " Dateien neu)");
  if (ut.geloescht) console.log("bau/uebungen: " + ut.geloescht + " alte Teile gelöscht");
  return ut;
}
function stempelSetzen() {
  const crypto = require("crypto");
  let mb = { karte: null, gebaut: false, fehler: null, geloescht: 0 };
  try { mb = require("./modul-bauen.js").bauen(WURZEL); } catch (e) { mb.fehler = "modul-bauen.js: " + (e.message || e); }
  if (mb.fehler) { modulFehler = mb.fehler; console.error("\n!!! MODUL-BAU: " + mb.fehler + "\n"); }
  if (mb.gebaut) console.log("bau/: neu gebaut (" + Object.keys(mb.karte || {}).join(", ") + ")");
  if (mb.geloescht) console.log("bau/: " + mb.geloescht + " alte Stücke gelöscht");
  const ut = uebungenTeilen();
  const vk = verkleinern();
  if (vk.neu || vk.weg) console.log("min/: " + vk.neu + " neu verkleinert, " + vk.weg + " entfernt");
  let html = fs.readFileSync(indexPfad, "utf8");
  const stempel = {};
  fs.readdirSync(WURZEL).filter((n) => /^[a-z0-9-]+\.(js|css)$/i.test(n)).sort().forEach((n) => {
    stempel[n] = crypto.createHash("sha1").update(fs.readFileSync(path.join(WURZEL, n))).digest("hex").slice(0, 10);
  });
  /* Fassung 694 — die verkleinerten Kopien mit eigenem Stempel. Steht
     eine Datei hier nicht drin, lädt die Seite die Quelle. */
  fs.readdirSync(MIN_ORDNER).filter((n) => /^[a-z0-9-]+\.(js|css)$/i.test(n)).sort().forEach((n) => {
    stempel["min/" + n] = crypto.createHash("sha1").update(fs.readFileSync(path.join(MIN_ORDNER, n))).digest("hex").slice(0, 10);
  });
  const alleDateien = (ordner) => fs.readdirSync(ordner, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? alleDateien(path.join(ordner, e.name)) : [path.join(ordner, e.name)]).sort();
  STEMPEL_ORDNER.forEach((o) => {
    const wo = path.join(WURZEL, o);
    if (!fs.existsSync(wo)) return;
    const h = crypto.createHash("sha1");
    alleDateien(wo).forEach((f) => { h.update(path.relative(WURZEL, f)); h.update(fs.readFileSync(f)); });
    stempel[o + "/"] = h.digest("hex").slice(0, 10);
  });
  /* FASSUNG 837 — XANDER (Funk 263): „die Ladezeit … ca. 10 mal schneller". Wortschatz (vokabeln/, 2,26 MB gepackt)
     und Kalender (kalender/) hingen an ?v=DMA_VERSION und kamen nach JEDER Fassung komplett neu – am 29. und 30.09.
     waren das 24 bzw. 31 Fassungen am Tag. Jetzt hat jede Datei ihren eigenen Stempel aus dem Inhalt: neu geladen wird
     nur, was sich wirklich geändert hat. Je Datei statt je Ordner, damit ein geändertes Wort nicht alle 33 Dateien
     neu holt. */
  STEMPEL_EINZELN.forEach((o) => {
    const wo = path.join(WURZEL, o);
    if (!fs.existsSync(wo)) return;
    fs.readdirSync(wo).filter((n) => /\.js$/.test(n)).sort().forEach((n) => {
      stempel[o + "/" + n] = crypto.createHash("sha1").update(fs.readFileSync(path.join(wo, n))).digest("hex").slice(0, 10);
    });
  });
  /* MODUL-UMBAU (M2): die Modul-Quellen in src/ mit eigenem Stempel – ?quelle lädt sie als natives Modul.
     M4: nur die Eingänge (src/*.js); die Stücke in src/app/ holt der Browser über ihren import, ohne Stempel – ein
     Eintrag für sie machte index.html nur größer (885-schlank Q: gepackt mindestens 5 KB kleiner als vor K). */
  const srcOrdner = path.join(WURZEL, "src");
  if (fs.existsSync(srcOrdner)) fs.readdirSync(srcOrdner).map((n) => path.join(srcOrdner, n)).filter((f) => fs.statSync(f).isFile() && /\.(js|css|json)$/.test(f)).sort().forEach((f) => {
    stempel[path.relative(WURZEL, f).split(path.sep).join("/")] = crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex").slice(0, 10);
  });
  /* MODUL-UMBAU (M3, Prüfung M2 a): im selben Block steht vorn window.DMA_MODUL = {…}; – der bleibt stehen */
  const zeile = "window.DMA_STEMPEL = " + JSON.stringify(stempel) + ";</script>";
  const muster = /(<script>(?:window\.DMA_MODUL = \{[^\n]*?\};)?)window\.DMA_STEMPEL = \{[^\n]*\};<\/script>/;
  if (muster.test(html)) html = html.replace(muster, (m, vor) => vor + zeile);
  else html = html.replace(/(<script>window\.DMA_VERSION = "\d+";<\/script>)/, (m, v) => v + "\n<script>" + zeile);
  /* FASSUNG 886 (S8, Funk 311) — Bilder, die index.html selbst nennt (das Foto auf „Über mich“, werkzeug/foto-ueber.js),
     tragen ihren Stempel fest in der Adresse (kein Skript setzt sie zusammen, also kein Warten auf DMA_STEMPEL), und
     der Service Worker gibt „?v=…“ ohne Nachfrage aus dem Speicher. Ändert sich ein Bild, bekommt es hier den neuen
     Stempel – wie alle anderen Dateien vor jedem Commit. */
  html = html.replace(/(["' ,])(bilder\/[a-z0-9-]+\.(?:webp|avif|jpe?g|png))\?v=[0-9a-f]+/g, (alt, vor, datei) => {
    const f = path.join(WURZEL, datei);
    return fs.existsSync(f) ? vor + datei + "?v=" + crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex").slice(0, 10) : alt;
  });
  /* MODUL-UMBAU (M1 b, seit M3 im Block von DMA_STEMPEL, vorn): window.DMA_MODUL (bei einem Baufehler bleibt die alte Angabe) */
  /* M3b: dazu „uebungen" (das Verzeichnis der Übungsteile). Scheitert das Teilen, fällt der Eintrag weg – die Seite lädt
     dann die ganze data-uebungen.js wie bisher (nie falsche Daten). Scheitert nur Vite, bleiben dessen alte Einträge. */
  try {
    const MB = require("./modul-bauen.js");
    let k = mb.karte;
    if (k == null) { k = Object.assign({}, MB.karteLesen(html) || {}); delete k.uebungen; }
    else k = Object.assign({}, k);
    if (ut.eintrag) k.uebungen = ut.eintrag;
    html = MB.zeileSetzen(html, (mb.karte == null && !Object.keys(k).length && !MB.karteLesen(html)) ? null : k);
  } catch (e) {}
  /* MODUL-UMBAU: nur schreiben, wenn sich etwas geändert hat – sonst läse ein Server, der index.html gerade
     ausliefert (Sonden, Messung), im falschen Augenblick eine halbe Datei */
  if (html !== fs.readFileSync(indexPfad, "utf8")) fs.writeFileSync(indexPfad, html);
  /* MODUL-UMBAU (M1 c): selbst anlegen – bei Rückgabe ≠ 0 tut der Haken es nicht mehr, und min/ muss mit den Stempeln
     zusammenpassen. Nur in einem git-Baum (nicht in Vergleichsständen aus git archive). */
  if (fs.existsSync(path.join(WURZEL, ".git"))) {
    try {
      require("child_process").execFileSync("git", ["-C", WURZEL, "add", "--", "index.html", "min"].concat(fs.existsSync(path.join(WURZEL, "bau")) ? ["bau"] : []),
        { stdio: ["ignore", "ignore", "pipe"] });
    } catch (e) { console.error("git add index.html min bau gescheitert: " + String(e.message || e).split("\n")[0]); }
  }
  return Object.keys(stempel).length;
}

function hakenAnlegen() {
  try {
    const haken = path.join(WURZEL, ".git", "hooks", "pre-commit");
    const inhalt = "#!/bin/sh\n# FUNK 101: Stempel vor jedem Commit neu rechnen (werkzeug/fassung-setzen.js)\n"
      + "grep -q nur-stempel werkzeug/fassung-setzen.js 2>/dev/null || exit 0\n"
      + "node werkzeug/fassung-setzen.js --nur-stempel >/dev/null && git add index.html min\n"
      + "exit 0\n";
    if (!fs.existsSync(haken) || fs.readFileSync(haken, "utf8") !== inhalt) {
      fs.writeFileSync(haken, inhalt);
      fs.chmodSync(haken, 0o755);
    }
  } catch (e) {}
}

/* Fassung 628 — beim Zusammenführen zweier Zweige ging ein Kommentar-
   Anfang verloren; das übrig gebliebene Kommentar-Ende verschluckte die
   nächste CSS-Regel, still.
   Jetzt prüft jede Fassung alle Stildateien auf offene oder streunende
   Kommentare und unausgeglichene Klammern. */
function cssPruefen() {
  const fehler = [];
  fs.readdirSync(WURZEL).filter((n) => /\.css$/.test(n)).forEach((n) => {
    const s = fs.readFileSync(path.join(WURZEL, n), "utf8");
    let p = 0, kom = false, tiefe = 0;
    while (p < s.length) {
      if (!kom && s.startsWith("/*", p)) { kom = true; p += 2; continue; }
      if (kom && s.startsWith("*/", p)) { kom = false; p += 2; continue; }
      if (!kom) {
        if (s.startsWith("*/", p)) fehler.push(n + ": streunendes */ in Zeile " + (s.slice(0, p).split("\n").length));
        if (s[p] === "{") tiefe++;
        else if (s[p] === "}") tiefe--;
        if (tiefe < 0) { fehler.push(n + ": } ohne { in Zeile " + (s.slice(0, p).split("\n").length)); tiefe = 0; }
      }
      p++;
    }
    if (kom) fehler.push(n + ": Kommentar am Ende nicht geschlossen");
    if (tiefe) fehler.push(n + ": " + tiefe + " offene {");
  });
  return fehler;
}
const cssFehler = cssPruefen();
if (cssFehler.length) {
  console.error("CSS-FEHLER:\n  " + cssFehler.join("\n  "));
  if (process.argv[2] !== "--nur-stempel") process.exit(1);
}

/* FASSUNG 887 (Prüfung Runde 1) — supabase-js mit fester Fassung.
   Beim Einmischen des Livestream-Strangs ging die Pinnung (@2.118.0) still verloren; index.html lud wieder „@2“, also
   das, was jsDelivr gerade für die höchste 2.x hält – eine neue supabase-js-Fassung käme dann ungeprüft zu allen.
   Jetzt: index.html muss supabase-js als @2.x.y laden. Beim Setzen einer Fassungsnummer bricht das Werkzeug sonst ab;
   beim Stempeln (git-Haken) warnt es nur. Geprüft auch von werkzeug/pruefe-887-supabase.js.
   Prüfung Runde 2: auch die anderen Seiten im Stamm, die supabase-js laden (stadt-leicht.html, __kz.html) – dort stand
   noch das lose „@2“ (auch ohne Pfad, „…supabase-js@2"“), darum zählt jetzt jede Adresse mit „supabase-js“, nicht nur
   die mit „@…/“. index.html muss supabase-js laden, die anderen Seiten dürfen es weglassen. */
function supabaseFassungPruefen(html, name, muss) {
  const treffer = html.match(/<script[^>]+src="[^"]*supabase-js[^"]*"/g) || [];
  if (!treffer.length) return muss ? name + " lädt supabase-js nicht über <script src=…supabase-js@…>" : "";
  const lose = treffer.filter((t) => !/supabase-js@2\.\d+\.\d+\//.test(t));
  return lose.length ? name + " lädt supabase-js ohne feste Fassung (@2.x.y): " + lose.join(" | ") : "";
}
const supaFehler = [supabaseFassungPruefen(fs.readFileSync(indexPfad, "utf8"), "index.html", true)]
  .concat(fs.readdirSync(WURZEL).filter((f) => /\.html$/.test(f) && f !== "index.html")
    .map((f) => supabaseFassungPruefen(fs.readFileSync(path.join(WURZEL, f), "utf8"), f, false)))
  .filter(Boolean).join("\n  ");
if (supaFehler) {
  console.error("SUPABASE-JS: " + supaFehler);
  if (process.argv[2] !== "--nur-stempel") process.exit(1);
}

/* MODUL-UMBAU (M2): eine Datei, die als Modul (src/<name>) UND eine Fassung lang als klassischer Rückfall (<name>)
   liegt, muss in beiden gleich sein – sonst bekäme der Betreiber im Modul anderen Code als im Rückfall. Bearbeitet wird
   src/<name>; läuft es auseinander, sagt es jeder Commit laut (Rückgabe 2; Sonde pruefe-887-bau.js B6). */
function gleichlaufPruefen() {
  const src = path.join(WURZEL, "src");
  if (!fs.existsSync(src)) return;
  let ql = null;
  try { ql = require("./quelle-lesen.js"); } catch (e) { return; }
  fs.readdirSync(src).filter((n) => /\.js$/.test(n) && fs.existsSync(path.join(WURZEL, n))).forEach((n) => {
    const g = ql.gleichlauf(n, WURZEL);
    if (!g.gleich) {
      modulFehler = modulFehler || "Gleichlauf";
      console.error("\n!!! GLEICHLAUF: src/" + n + " und " + n + " (klassischer Rückfall) laufen auseinander – " + g.grund
        + "\n    Bearbeitet wird src/" + n + "; den Rückfall danach neu schreiben: node werkzeug/quelle-lesen.js --klassisch " + n + " > " + n + "\n");
    }
  });
}

if (process.argv[2] === "--nur-stempel") {
  const n = stempelSetzen();
  gleichlaufPruefen();
  hakenAnlegen();
  console.log("Stempel für " + n + " Dateien gesetzt");
  process.exit(modulFehler ? 2 : 0);
}

const zahl = String(process.argv[2] || "").trim();
if (!/^\d+$/.test(zahl)) {
  console.error("Bitte eine Zahl angeben, z. B.:  node werkzeug/fassung-setzen.js 421");
  process.exit(1);
}

/* MODUL-UMBAU (M3, Prüfung M2 c): Der Haken vor dem Commit lässt einen Commit mit gescheitertem Vite-Bau durch (er
   meldet ihn nur auf stderr; der Haken-Text bleibt für alle Bäume gleich). Eine ECHTE Fassung dagegen wird damit nie
   gesetzt: erst bauen (und den Gleichlauf src/ ↔ Rückfall prüfen); scheitert das, bricht das Werkzeug ab, BEVOR
   DMA_VERSION oder fassung.json sich ändern. */
{
  let mb = null;
  try { mb = require("./modul-bauen.js").bauen(WURZEL); } catch (e) { mb = { fehler: "modul-bauen.js: " + (e.message || e) }; }
  if (mb && mb.fehler) {
    console.error("\n!!! MODUL-BAU: " + mb.fehler + "\n!!! Fassung NICHT gesetzt (DMA_VERSION und fassung.json unverändert). Erst den Bau richten, dann"
      + " node werkzeug/pruefe-887-bau.js, dann erneut.\n");
    process.exit(1);
  }
  /* M3b: dasselbe für die Übungsteile */
  if (uebungenTeilen().fehler) {
    console.error("!!! Fassung NICHT gesetzt (Übungsteile, siehe oben; DMA_VERSION und fassung.json unverändert). Danach node werkzeug/pruefe-887-daten.js.\n");
    process.exit(1);
  }
  gleichlaufPruefen();
  if (modulFehler) { console.error("!!! Fassung NICHT gesetzt (Gleichlauf, siehe oben)."); process.exit(1); }
}

let html = fs.readFileSync(indexPfad, "utf8");
const muster = /<script>window\.DMA_VERSION = "(\d+)";<\/script>/;
const treffer = html.match(muster);
if (!treffer) {
  console.error("In index.html steht keine Zeile  window.DMA_VERSION = \"…\";  — abgebrochen.");
  process.exit(1);
}
const vorher = treffer[1];
html = html.replace(muster, '<script>window.DMA_VERSION = "' + zahl + '";</script>');
fs.writeFileSync(indexPfad, html);

fs.writeFileSync(path.join(WURZEL, "fassung.json"),
  JSON.stringify({ fassung: zahl, stand: new Date().toISOString() }, null, 2) + "\n");

const n = stempelSetzen();
gleichlaufPruefen();
hakenAnlegen();
console.log("Fassung " + vorher + " → " + zahl + " (index.html und fassung.json), Stempel für " + n + " Dateien");
if (modulFehler) process.exit(2);
