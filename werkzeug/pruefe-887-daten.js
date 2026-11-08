#!/usr/bin/env node
/* =====================================================================
   SONDE 887 — ÜBUNGSDATEN JE KATEGORIE (MODULE-PLAN.md Abschnitt 3, M3b)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller" · (Funk
   255): „die schnelle Performance und die Verbindung zu den anderen haben
   oberste Priorität".

   Was gebaut ist: „Lernen" wartete auf die ganze Aufgabensammlung
   (data-uebungen.js, 6,0 MB, 1,2 MB gepackt). Jetzt legt
   werkzeug/uebungen-teilen.js (vom Haken vor jedem Commit über
   fassung-setzen.js) aus der UNVERÄNDERTEN Quelle je Kategorie ein Skript
   an (bau/uebungen/<kategorie>-<hash>.js) und ein Verzeichnis
   (bau/uebungen-<hash>.js, in DMA_MODUL.uebungen). Die Übersicht braucht
   ohne Wahl keine Aufgabe; eine Kategorie lädt einzeln
   (ExerciseData.ladeUebungen(ids)); nach dem ersten Bild der Übersicht
   holt uebungenVorladen() den Rest in Ruhepausen. Rückfall auf die ganze
   Datei, wenn ein Teil fehlt; ?quelle und Notweg laden sie wie bisher.

   TEILE
     D  ohne Browser
       D1 Teile zusammen = Quelle: Verzeichnis + alle Teile aus bau/ (in
          umgekehrter Reihenfolge ausgeführt), nach dem Verzeichnis
          zusammengesetzt = data-uebungen.js – Wert für Wert und in derselben
          Reihenfolge der Schlüssel (Tiefenvergleich)
       D2 DMA_MODUL.uebungen in index.html = Verzeichnis des Merkzettels
          (bau/uebungen-quelle.json); jede Datei heißt nach sha256(Inhalt);
          Merkzettel-Summe = Quelle + Werkzeug (fängt einen Commit, bei dem
          das Teilen gescheitert ist); alles in git (sonst 404 auf Pages)
       D3 die ganze Datei (min/data-uebungen.js, der Rückfall) = Quelle
       D4 sw.js: Verzeichnis und Teile fallen unter die bau/-Regel
          (ungefragt aus dem Speicher), je Kategorie ein eigener Grundname
       D5 Fehler im Wegwerf-Ordner: Quelle mit nicht JSON-fähigem Wert bzw.
          fremdem Namen → kein Verzeichnis, Fehler gemeldet; fassung-setzen.js
          --nur-stempel lässt „uebungen" in DMA_MODUL weg (Rückgabe 2); ein
          Name mit anderem Inhalt wird nie überschrieben
       D6 modul-bauen.js (Vite-Aufräumen) lässt bau/uebungen* stehen
     B  im Browser (Chromium, ohne Helfer, Gast)
       B1 Start: keine Übungsdaten (weder Datei noch Teile noch Verzeichnis)
       B2 „Lernen": die Übersicht steht ohne data-uebungen.js; Teile erst nach
          dem ersten Bild der Übersicht, höchstens 4 zugleich, niedrige
          Priorität
       B3 Vorladen fertig: ZUSATZ_FRAGEN = Quelle (JSON gleich, Reihenfolge
          gleich), Ereignis dma-uebungen-ganz, alleRohfragen vollständig
       B4 eine Kategorie lädt einzeln: ladeUebungen(["wortstellung"]) holt
          Verzeichnis + genau diesen Teil; uebungenDa([…]) ja, uebungenDa()
          nein; getBank so lang wie mit der ganzen Sammlung
       B5 Ablauf gleich nach „bereit": Lernen → Karte (Häkchen sofort) → Runde
          starten → Frage, ohne synchrones Holen (min/data-exercises-teil.js
          kommt mit ladeUebungen)
       B6 Rückfall: Teil fehlt (404) → ganze Datei; Verzeichnis fehlt → ganze
          Datei; Daten danach = Quelle – über ladeUebungen(ids) und über das
          Vorladen (nur „Lernen" offen, Nachbesserung 1)
       B7 ?quelle und Notweg (dma-ganz): die ganze Quelle wie bisher, keine
          Teile
       B9 ein Stück kommt langsam (6 s; je einmal min/data-exercises-teil.js
          und min/app-teil-rest2.js): Lernen → Karte → Runde starten holt
          nichts synchron (DMA_TEIL_SOFORT leer)
       B8 Vorladen hält an, sobald „Lernen" zu ist und „Wissen" offen (die
          ersten 8 s; Wissen ist der Weg ins Klassenzimmer), und macht beim
          Zurückkommen weiter; in einem anderen Unterbereich von „Lernen"
          (Spiele) läuft es weiter
       B10 Wörterbuch früh gebaut (gleich nach dem Tipp auf „Lernen", vor der
          ganzen Sammlung): sobald sie ganz da ist, stehen die Wörter aus den
          Übungstexten drin – so viele wie in einer Seite, die erst alles
          abwartet (die Teile kommen nach dem Wortschatz; ohne Neubau fehlten
          sie für die ganze Sitzung)
       B11 Duell annehmen (Profil → Freunde → „Annehmen", der echte Knopf;
          Backend als Attrappe in der Seite): die Runde startet erst, wenn
          die Kategorien ganz da sind – „Lernen" nie offen und „Lernen" 1 s
          offen, dann Profil (Nachbesserung 1, Prüfer)
       B12 Vorladen nach einer Unterbrechung: es wartet und macht von selbst
          weiter, ohne neuen Tipp auf „Lernen" – Bildschirm 3 s aus (in
          „Lernen → Spiele"), Profil, Wissen (nach 8 s Frist), nach dem
          Klassenzimmer; im Klassenzimmer kommt nichts dazu (Nachbesserung 1)

   Aufruf:     node werkzeug/pruefe-887-daten.js            (NUR=D|B, z. B. NUR=B TEIL=B2,B4)
   Gegenprobe: WURZEL=<ordner mit d9637a22> node werkzeug/pruefe-887-daten.js  → rot
   ===================================================================== */
const fs = require("fs"), path = require("path"), os = require("os"), http = require("http"), vm = require("vm"), crypto = require("crypto");
const { execFileSync, spawnSync } = require("child_process");
const HIER = path.join(__dirname, "..");
const WURZEL = path.resolve(process.env.WURZEL || HIER);
const NUR = process.env.NUR || "DB";
const TEIL = process.env.TEIL ? new Set(process.env.TEIL.split(",")) : null;
const soll = (k) => !TEIL || TEIL.has(k);
let fehler = 0;
const sage = (gut, was, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : "")); };
const lies = (f) => { try { return fs.readFileSync(path.join(WURZEL, f), "utf8"); } catch (e) { return null; } };
const jsonLies = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return null; } };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
let UT = null;
try { UT = require(path.join(WURZEL, "werkzeug", "uebungen-teilen.js")); } catch (e) { UT = null; }

/* Tiefenvergleich mit Reihenfolge der Schlüssel – eigene Fassung (nicht die des Werkzeugs) */
function gleich(a, b, p) {
  if (a === b) return "";
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return p + ": " + String(JSON.stringify(a)).slice(0, 50) + " ≠ " + String(JSON.stringify(b)).slice(0, 50);
  if (Array.isArray(a) !== Array.isArray(b)) return p + ": Feld/Objekt";
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length || ka.some((k, i) => k !== kb[i])) return p + ": Schlüssel " + ka.slice(0, 3) + "… / " + kb.slice(0, 3) + "…";
  for (const k of ka) { const e = gleich(a[k], b[k], p + "." + k); if (e) return e; }
  return "";
}
function ausfuehren(codes) {
  const ctx = vm.createContext({});
  vm.runInContext("var window = globalThis;", ctx);
  codes.forEach(([name, code]) => vm.runInContext(code, ctx, { filename: name, timeout: 60000 }));
  return JSON.parse(JSON.stringify(ctx.DMA_DATEN || {}));
}
const QUELLE = (() => { try { return ausfuehren([["data-uebungen.js", fs.readFileSync(path.join(HIER, "data-uebungen.js"), "utf8")]]).ZUSATZ_FRAGEN; } catch (e) { return null; } })();
const QUELLE_JSON = QUELLE ? JSON.stringify(QUELLE) : "";
const html = lies("index.html") || "";
const modulZeile = /window\.DMA_MODUL = (\{[^\n]*?\});(?:window\.DMA_STEMPEL = |<\/script>)/.exec(html);
let DMA_MODUL = null; try { DMA_MODUL = modulZeile ? JSON.parse(modulZeile[1]) : null; } catch (e) { DMA_MODUL = null; }

(async () => {
  console.log("SONDE 887 — Übungsdaten je Kategorie (M3b)   WURZEL " + WURZEL + "\n");
  sage(Boolean(QUELLE) && Object.keys(QUELLE).length > 20, "Quelle data-uebungen.js lesbar", QUELLE ? Object.keys(QUELLE).length + " Kategorien" : "");

  if (NUR.includes("D")) {
    const merk = jsonLies(path.join(WURZEL, "bau", "uebungen-quelle.json"));
    const karteDatei = merk && merk.karte;
    let K = null;
    try { K = karteDatei ? ausfuehren([[karteDatei, fs.readFileSync(path.join(WURZEL, karteDatei), "utf8")]]).ZUSATZ_KARTE : null; } catch (e) { K = null; }
    /* D1 */
    if (soll("D1")) {
      sage(Boolean(UT), "D1 Werkzeug werkzeug/uebungen-teilen.js da");
      let zus = null, grund = "";
      try {
        const teile = Object.keys(K || {}).map((k) => "bau/uebungen/" + k + "-" + K[k] + ".js").reverse();
        const D = ausfuehren([[karteDatei, fs.readFileSync(path.join(WURZEL, karteDatei), "utf8")]].concat(teile.map((t) => [t, fs.readFileSync(path.join(WURZEL, t), "utf8")])));
        const Z = {};
        Object.keys(D.ZUSATZ_KARTE).forEach((k) => { Z[k] = D.ZUSATZ_TEILE[k]; });
        zus = Z;
        grund = Object.keys(D).sort().join(",") !== "ZUSATZ_KARTE,ZUSATZ_TEILE" ? "Teile legen mehr an: " + Object.keys(D).join(",") : "";
      } catch (e) { grund = String(e.message || e).slice(0, 120); }
      const abw = zus && QUELLE ? gleich(zus, QUELLE, "Z") : "nicht lesbar";
      sage(Boolean(K) && !grund && !abw, "D1 Teile zusammen = Quelle (Tiefenvergleich, Reihenfolge der Schlüssel; Teile umgekehrt ausgeführt)",
        (K ? Object.keys(K).length + " Teile" : "kein Verzeichnis") + (grund ? "; " + grund : "") + (abw ? "; " + abw : ""));
      sage(Boolean(K) && QUELLE && Object.keys(QUELLE).every((k) => K[k]) && Object.keys(K).length === Object.keys(QUELLE).length,
        "D1 jede Kategorie der Quelle hat genau einen Teil");
    }
    /* D2 */
    if (soll("D2")) {
      sage(Boolean(DMA_MODUL && DMA_MODUL.uebungen) && DMA_MODUL.uebungen === karteDatei, "D2 DMA_MODUL.uebungen in index.html = Verzeichnis des Merkzettels",
        (DMA_MODUL ? JSON.stringify(DMA_MODUL.uebungen) : "kein DMA_MODUL") + " / " + karteDatei);
      const namen = karteDatei && K ? [karteDatei].concat(Object.keys(K).map((k) => "bau/uebungen/" + k + "-" + K[k] + ".js")) : [];
      const falsch = namen.filter((n) => {
        const m = /-([A-Za-z0-9_-]{8})\.js$/.exec(n);
        return !m || !fs.existsSync(path.join(WURZEL, n)) || crypto.createHash("sha256").update(fs.readFileSync(path.join(WURZEL, n))).digest("base64url").slice(0, 8) !== m[1];
      });
      sage(namen.length > 1 && !falsch.length, "D2 Verzeichnis und jeder Teil liegen da und heißen nach sha256(Inhalt)", namen.length + " Dateien" + (falsch.length ? "; falsch: " + falsch.slice(0, 3).join(", ") : ""));
      let s = null; try { s = UT ? UT.summe(WURZEL) : null; } catch (e) { s = null; }
      sage(Boolean(merk && s) && merk.summe === s, "D2 Merkzettel-Summe = Quelle + Werkzeug (sonst ist das Teilen beim Commit gescheitert)", (merk && merk.summe) + " / " + s);
      let inGit = new Set();
      try { inGit = new Set(execFileSync("git", ["-C", WURZEL, "ls-files", "bau"], { encoding: "utf8", maxBuffer: 1 << 26 }).split("\n").filter(Boolean)); } catch (e) {}
      const nichtInGit = namen.filter((n) => !inGit.has(n));
      sage(namen.length > 1 && !nichtInGit.length, "D2 Verzeichnis und Teile sind in git (sonst 404 auf GitHub Pages)", nichtInGit.slice(0, 3).join(", "));
      const zuViel = fs.existsSync(path.join(WURZEL, "bau", "uebungen")) ? fs.readdirSync(path.join(WURZEL, "bau", "uebungen")).filter((n) => !namen.includes("bau/uebungen/" + n)) : [];
      let alt = null; try { alt = UT ? UT.eigeneDateien(WURZEL) : null; } catch (e) {}
      sage(!zuViel.some((n) => !/-[A-Za-z0-9_-]{8}\.js$/.test(n)), "D2 in bau/uebungen/ liegt nur Benanntes (keine Zwischendatei)", zuViel.filter((n) => !/-[A-Za-z0-9_-]{8}\.js$/.test(n)).join(", "));
      void alt;
    }
    /* D3 */
    if (soll("D3")) {
      let g = null; try { g = ausfuehren([["min/data-uebungen.js", fs.readFileSync(path.join(WURZEL, "min", "data-uebungen.js"), "utf8")]]).ZUSATZ_FRAGEN; } catch (e) { g = null; }
      const abw = g && QUELLE ? gleich(g, QUELLE, "min") : "nicht lesbar";
      sage(!abw, "D3 die ganze Datei (min/data-uebungen.js, Rückfall) = Quelle", abw);
    }
    /* D4 */
    if (soll("D4")) {
      const sw = lies("sw.js") || "";
      const m = /var BAU = (\/.*\/);\n/.exec(sw);
      let BAU = null; try { BAU = m ? eval(m[1]) : null; } catch (e) { BAU = null; }
      const beispiele = K ? [karteDatei].concat(Object.keys(K).map((k) => "bau/uebungen/" + k + "-" + K[k] + ".js")) : [];
      const nicht = beispiele.filter((b) => !(BAU && BAU.test(b)));
      sage(Boolean(BAU) && beispiele.length > 1 && !nicht.length, "D4 sw.js: Verzeichnis und alle Teile fallen unter die bau/-Regel (aus dem Speicher ohne Nachfrage)", nicht.slice(0, 3).join(", "));
      const grund = (p) => { const x = p.slice(p.lastIndexOf(".")); return p.slice(0, p.length - x.length - 9) + x; };
      const gr = new Set(beispiele.map(grund));
      sage(beispiele.length > 1 && gr.size === beispiele.length && gr.has("bau/uebungen/wortstellung.js"), "D4 je Kategorie ein eigener Grundname (2 Generationen je Kategorie im Speicher)", gr.size + " Grundnamen");
    }
    /* D5/D6 im Wegwerf-Ordner */
    if (soll("D5") || soll("D6")) {
      if (!UT) { sage(false, "D5 Fehlerfälle: Werkzeug nötig"); }
      else {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dma-887-daten-"));
        try {
          const W = path.join(tmp, "w");
          fs.mkdirSync(path.join(W, "werkzeug"), { recursive: true });
          ["uebungen-teilen.js", "fassung-setzen.js", "modul-bauen.js", "quelle-lesen.js", "teile-bauen.js", "app-teile.json"].forEach((n) => {
            if (fs.existsSync(path.join(WURZEL, "werkzeug", n))) fs.copyFileSync(path.join(WURZEL, "werkzeug", n), path.join(W, "werkzeug", n));
          });
          const T = require(path.join(W, "werkzeug", "uebungen-teilen.js"));
          /* klein und gültig */
          fs.writeFileSync(path.join(W, "data-uebungen.js"), "(window.DMA_DATEN = window.DMA_DATEN || {}).ZUSATZ_FRAGEN = {\n  \"b-zwei\": [[\"x\", \"y\", [\"z\"], \"e\", \"A1\"]],\n  \"a-eins\": [[\"p\\u2028q\", \"r\", [\"s\"], \"t\", \"B2\", \"ü\"]],\n};\n");
          const r0 = T.bauen(W);
          let K0 = null; try { K0 = r0.eintrag ? ausfuehren([[r0.eintrag, fs.readFileSync(path.join(W, r0.eintrag), "utf8")]]).ZUSATZ_KARTE : null; } catch (e) {}
          sage(!r0.fehler && Boolean(r0.eintrag) && K0 && Object.keys(K0).join(",") === "b-zwei,a-eins", "D5 kleine Quelle: Verzeichnis in der Reihenfolge der Quelle", r0.fehler || Object.keys(K0 || {}).join(","));
          const zeilenEnde = K0 ? fs.readFileSync(path.join(W, "bau", "uebungen", "a-eins-" + K0["a-eins"] + ".js"), "utf8") : "";
          sage(/p\\u2028q/.test(zeilenEnde) && zeilenEnde.indexOf(" ") < 0, "D5 U+2028 steht maskiert im Teil (ältere Browser lasen es als Zeilenende)");
          /* fremder Inhalt unter einem bestehenden Namen: nie überschreiben */
          const teil = K0 ? path.join(W, "bau", "uebungen", "b-zwei-" + K0["b-zwei"] + ".js") : null;
          if (teil) {
            const echt = fs.readFileSync(teil);
            fs.writeFileSync(teil, "/* fremd */");
            fs.writeFileSync(path.join(W, "bau", "uebungen-quelle.json"), "{}");
            const r1 = T.bauen(W);
            sage(Boolean(r1.fehler) && /anderer Inhalt/.test(r1.fehler) && r1.eintrag === null && fs.readFileSync(teil, "utf8") === "/* fremd */",
              "D5 ein Name mit anderem Inhalt wird nie überschrieben (Fehler, kein Verzeichnis)", String(r1.fehler || "kein Fehler").slice(0, 80));
            fs.writeFileSync(teil, echt);
          }
          /* nicht JSON-fähig und fremder Name */
          const kaputt = [
            ["einer Funktion", "(window.DMA_DATEN = window.DMA_DATEN || {}).ZUSATZ_FRAGEN = { \"a\": [[\"x\", function () {}, [], \"e\", \"A1\"]] };\n"],
            ["fremdem Namen", "(window.DMA_DATEN = window.DMA_DATEN || {}).ZUSATZ_FRAGEN = { \"A b/c\": [[\"x\", \"y\", [], \"e\", \"A1\"]] };\n"],
            ["mehr als ZUSATZ_FRAGEN", "(window.DMA_DATEN = window.DMA_DATEN || {}).ZUSATZ_FRAGEN = { \"a\": [] }; window.DMA_DATEN.ANDERES = 1;\n"],
          ];
          kaputt.forEach(([was, code]) => {
            fs.writeFileSync(path.join(W, "data-uebungen.js"), code);
            const r = T.bauen(W);
            sage(Boolean(r.fehler) && r.eintrag === null, "D5 Quelle mit " + was + ": kein Verzeichnis, Fehler gemeldet", String(r.fehler || "kein Fehler").slice(0, 90));
          });
          /* fassung-setzen.js --nur-stempel lässt „uebungen" weg (Rückgabe 2) */
          ["index.html", "package.json"].forEach((n) => { if (fs.existsSync(path.join(WURZEL, n))) fs.copyFileSync(path.join(WURZEL, n), path.join(W, n)); });
          fs.mkdirSync(path.join(W, "min"), { recursive: true });
          const r2 = spawnSync(process.execPath, [path.join(W, "werkzeug", "fassung-setzen.js"), "--nur-stempel"], { cwd: W, encoding: "utf8", timeout: 300000 });
          const h2 = fs.readFileSync(path.join(W, "index.html"), "utf8");
          const m2 = /window\.DMA_MODUL = (\{[^\n]*?\});window\.DMA_STEMPEL = /.exec(h2);
          let k2 = null; try { k2 = m2 ? JSON.parse(m2[1]) : null; } catch (e) {}
          sage(r2.status === 2 && Boolean(k2) && !("uebungen" in k2) && /ÜBUNGSTEILE/.test(r2.stderr || ""),
            "D5 fassung-setzen.js --nur-stempel bei kaputter Quelle: DMA_MODUL ohne „uebungen“ (die Seite lädt die ganze Datei), laut, Rückgabe 2",
            "Rückgabe " + r2.status + ", DMA_MODUL " + (k2 ? JSON.stringify(k2) : "–"));
          /* echte Fassung bricht ab */
          const vorI = fs.readFileSync(path.join(W, "index.html"));
          const r3 = spawnSync(process.execPath, [path.join(W, "werkzeug", "fassung-setzen.js"), "9999"], { cwd: W, encoding: "utf8", timeout: 300000 });
          sage(r3.status === 1 && vorI.equals(fs.readFileSync(path.join(W, "index.html"))) && !fs.existsSync(path.join(W, "fassung.json")),
            "D5 echte Fassung (fassung-setzen.js 9999) bei kaputter Quelle: Abbruch, index.html unverändert", "Rückgabe " + r3.status);
          /* D6: das Vite-Aufräumen lässt bau/uebungen* stehen */
          let MB = null; try { MB = require(path.join(WURZEL, "werkzeug", "modul-bauen.js")); } catch (e) {}
          const proben = ["uebungen/wortstellung-ocN_pzDI.js", "uebungen-8HuLU728.js", "daten/x-12345678.json"];
          sage(Boolean(MB && MB.FREMD) && proben.every((p) => MB.FREMD.test(p) && MB.STUECK.test(p)) && !MB.FREMD.test("rueckfrage-CfC8vCNA.js"),
            "D6 modul-bauen.js räumt bau/uebungen/ und bau/uebungen-<hash>.js nicht weg (nur Vite-Stücke)");
        } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
      }
    }
  }

  /* ===================== B: im Browser ===================== */
  if (NUR.includes("B")) {
    console.log("");
    const { chromium } = require("/tmp/claude-0/node_modules/playwright");
    const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png",
      ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".webmanifest": "application/manifest+json", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".gif": "image/gif" };
    const log = [];
    const S = { sperre: null, verzug: 25, offen: 0, maxOffen: 0, langsam: null, langsamMs: 0 };
    const srv = http.createServer((q, a) => {
      let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
      const f = path.join(WURZEL, p);
      const da = f.startsWith(WURZEL) && fs.existsSync(f) && !fs.statSync(f).isDirectory() && !(S.sperre && S.sperre.test(p));
      const z = { p, url: q.url, s: da ? 200 : 404, t: Date.now() };
      log.push(z);
      if (!da) { a.writeHead(404); return a.end(); }
      const senden = () => {
        a.writeHead(200, { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
        fs.createReadStream(f).pipe(a);
      };
      /* Teile: kleiner Verzug, damit sich zählen lässt, wie viele zugleich unterwegs sind */
      if (S.langsam && S.langsam.test(p)) setTimeout(senden, S.langsamMs);
      else if (/^\/bau\/uebungen\//.test(p)) {
        S.offen++; S.maxOffen = Math.max(S.maxOffen, S.offen);
        a.on("finish", () => { S.offen--; }); a.on("close", () => { z.zu = 1; });
        setTimeout(senden, S.verzug);
      } else senden();
    });
    await new Promise((r) => srv.listen(0, "127.0.0.1", r));
    const BASIS = "http://127.0.0.1:" + srv.address().port;
    const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });
    const istTeil = (x) => /^\/bau\/uebungen\/[a-z0-9-]+-[A-Za-z0-9_-]{8}\.js$/.test(x.p);
    const istVerz = (x) => /^\/bau\/uebungen-[A-Za-z0-9_-]{8}\.js$/.test(x.p);
    const istGanz = (x) => /^\/(min\/)?data-uebungen\.js$/.test(x.p);
    const seite = async (o) => {
      o = o || {};
      S.sperre = o.sperre || null; S.verzug = o.verzug || 25; S.maxOffen = 0; S.langsam = o.langsam || null; S.langsamMs = o.langsamMs || 0;
      const ctx = await br.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
      await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
      await ctx.addInitScript((ls) => {
        try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); Object.keys(ls || {}).forEach((k) => localStorage.setItem(k, ls[k])); } catch (e) {}
        /* wann die Übersicht steht: Einfügen und das erste Bild danach (rAF, dann setTimeout 0) */
        window.__ueb = { grid: null, bild: null, ganz: null };
        new MutationObserver(function (l, mo) {
          if (window.__ueb.grid != null || !document.querySelector("#exerciseSetup .category-grid .category-card")) return;
          window.__ueb.grid = performance.now();
          requestAnimationFrame(function () { setTimeout(function () { window.__ueb.bild = performance.now(); }, 0); });
          mo.disconnect();
        }).observe(document, { childList: true, subtree: true });
        addEventListener("dma-uebungen-ganz", function () { window.__ueb.ganz = performance.now(); });
      }, o.ls || {});
      const pg = await ctx.newPage();
      const pe = [];
      pg.on("pageerror", (e) => pe.push(String(e.message || e).slice(0, 160) + (process.env.STAPEL ? " @ " + String(e.stack || "").split("\n").slice(1, 4).join(" ").slice(0, 300) : "")));
      const ab = log.length;
      await pg.goto(BASIS + "/index.html" + (o.query || ""), { waitUntil: "load", timeout: 60000 });
      await pg.waitForFunction(() => typeof ExerciseData !== "undefined" && window.LiveChat && window.DMA_TAFEL_STAND && document.readyState !== "loading"
        && document.querySelector('.tape-tab[data-target="view-learn"]'), null, { timeout: 30000 });
      await pg.waitForTimeout(o.ruhe || 2500);
      return { ctx, pg, pe, ab, seit: (n) => log.slice(n == null ? ab : n) };
    };
    const lernen = async (pg) => {
      await pg.evaluate(() => document.querySelector('.tape-tab[data-target="view-learn"]').click());
      return pg.waitForFunction(() => { const g = document.querySelector("#exerciseSetup .category-grid .category-card"); return g && g.offsetParent !== null; }, null, { timeout: 60000 })
        .then(() => true, () => false);
    };

    /* B1 + B2 + B3 in einer Seite */
    let laengen = null;
    if (soll("B1") || soll("B2") || soll("B3")) {
      const s = await seite();
      const start = s.seit();
      sage(!start.some((x) => istTeil(x) || istVerz(x) || istGanz(x)), "B1 Start (Gast): keine Übungsdaten geholt", start.filter((x) => istTeil(x) || istVerz(x) || istGanz(x)).map((x) => x.p).join(", "));
      const n0 = log.length;
      const ok = await lernen(s.pg);
      const bisGrid = log.slice(n0);
      const z = await s.pg.evaluate(() => window.__ueb);
      sage(ok && !bisGrid.some(istGanz), "B2 „Lernen“: die Übersicht steht, ohne data-uebungen.js", ok ? "" : "Übersicht nicht da");
      await s.pg.waitForFunction(() => window.__ueb.ganz != null, null, { timeout: 60000 }).catch(() => {});
      const z2 = await s.pg.evaluate(() => window.__ueb);
      const nachher = log.slice(n0);
      const teilZeiten = await s.pg.evaluate(() => performance.getEntriesByType("resource").filter((e) => /\/bau\/uebungen\//.test(e.name)).map((e) => e.startTime));
      sage(nachher.some(istVerz) && !nachher.some(istGanz), "B2 geholt wird das Verzeichnis, nie die ganze Datei", nachher.filter(istVerz).map((x) => x.p).join(", "));
      const frueh = teilZeiten.filter((t) => z2.bild == null || t < z2.bild);
      sage(teilZeiten.length > 0 && z2.bild != null && !frueh.length, "B2 Teile erst nach dem ersten Bild der Übersicht",
        "Bild " + Math.round(z2.bild) + " ms, erster Teil " + Math.round(Math.min.apply(null, teilZeiten.concat([Infinity]))) + " ms" + (frueh.length ? ", " + frueh.length + " davor" : ""));
      sage(S.maxOffen > 0 && S.maxOffen <= 4, "B2 Vorladen: höchstens 4 Teile zugleich unterwegs", "höchstens " + S.maxOffen);
      const prio = await s.pg.evaluate(() => [...document.querySelectorAll('script[src*="bau/uebungen/"]')].map((x) => x.fetchPriority));
      sage(prio.length > 0 && prio.every((x) => x === "low"), "B2 Vorladen mit niedriger Priorität (fetchPriority low)", prio.length + " Skripte, " + [...new Set(prio)].join("/"));
      /* B3 */
      const r = await s.pg.evaluate(() => ({
        json: window.DMA_DATEN && window.DMA_DATEN.ZUSATZ_FRAGEN ? JSON.stringify(window.DMA_DATEN.ZUSATZ_FRAGEN) : "",
        da: ExerciseData.uebungenDa(), roh: ExerciseData.alleRohfragen ? ExerciseData.alleRohfragen().length : -1,
        l: { wortstellung: ExerciseData.getCategory("wortstellung").getBank().length, artikel: ExerciseData.getCategory("artikel").getBank().length },
      }));
      laengen = r.l;
      const zeilen = QUELLE ? Object.keys(QUELLE).reduce((n, k) => n + QUELLE[k].length, 0) : -1;
      sage(z2.ganz != null && r.da, "B3 Vorladen fertig: Ereignis dma-uebungen-ganz, uebungenDa() ja", z2.ganz != null ? "nach " + Math.round(z2.ganz - z2.grid) + " ms" : "nicht fertig");
      sage(Boolean(r.json) && r.json === QUELLE_JSON, "B3 ZUSATZ_FRAGEN = Quelle (JSON gleich, also auch die Reihenfolge)", r.json ? (r.json.length + " / " + QUELLE_JSON.length + " Zeichen") : "fehlt");
      sage(r.roh === zeilen, "B3 alleRohfragen() vollständig (Tagesaufgabe, Wörterbuch)", r.roh + " / " + zeilen);
      sage(nachher.filter(istTeil).length === (QUELLE ? Object.keys(QUELLE).length : -1) && !nachher.filter(istTeil).some((x, i, a) => a.findIndex((y) => y.p === x.p) !== i),
        "B3 jeder Teil genau einmal geholt", nachher.filter(istTeil).length + " Teile");
      sage(!s.pe.length, "B1–B3 keine Seitenfehler", s.pe.slice(0, 3).join(" | "));
      await s.ctx.close();
    }
    /* B4 */
    if (soll("B4")) {
      const s = await seite();
      const n0 = log.length;
      const r = await s.pg.evaluate(async () => {
        const vor = ExerciseData.getCategory("artikel").getBank().length;
        const ok = await ExerciseData.ladeUebungen(["wortstellung"]);
        return { ok, vor, teile: Object.keys((window.DMA_DATEN && window.DMA_DATEN.ZUSATZ_TEILE) || {}), w: JSON.stringify(window.DMA_DATEN.ZUSATZ_TEILE && window.DMA_DATEN.ZUSATZ_TEILE.wortstellung),
          da1: ExerciseData.uebungenDa(["wortstellung"]), da0: ExerciseData.uebungenDa(), daA: ExerciseData.uebungenDa(["artikel"]), daLeer: ExerciseData.uebungenDa([]),
          lw: ExerciseData.getCategory("wortstellung").getBank().length, ganz: Boolean(window.DMA_DATEN.ZUSATZ_FRAGEN) };
      });
      await s.pg.waitForTimeout(1500);
      const l1 = log.slice(n0);
      sage(r.ok === true && l1.filter(istVerz).length === 1 && l1.filter(istTeil).length === 1 && /\/wortstellung-/.test((l1.find(istTeil) || {}).p || "") && !l1.some(istGanz),
        "B4 ladeUebungen([\"wortstellung\"]) holt das Verzeichnis und genau diesen Teil", l1.filter((x) => istVerz(x) || istTeil(x) || istGanz(x)).map((x) => x.p).join(", "));
      sage(r.teile.join(",") === "wortstellung" && QUELLE && r.w === JSON.stringify(QUELLE.wortstellung) && !r.ganz, "B4 nur diese Kategorie ist da, Wert für Wert wie in der Quelle", r.teile.join(","));
      sage(r.da1 === true && r.da0 === false && r.daA === false && r.daLeer === true, "B4 uebungenDa([wortstellung]) ja, uebungenDa() nein, uebungenDa([artikel]) nein, uebungenDa([]) ja",
        [r.da1, r.da0, r.daA, r.daLeer].join("/"));
      sage(laengen == null || r.lw === laengen.wortstellung, "B4 getBank(wortstellung) so lang wie mit der ganzen Sammlung", r.lw + " / " + (laengen ? laengen.wortstellung : "–"));
      const n1 = log.length;
      const r2 = await s.pg.evaluate(async () => {
        const ok = await ExerciseData.ladeUebungen(["artikel", "meinwortschatz"]);
        return { ok, teile: Object.keys(window.DMA_DATEN.ZUSATZ_TEILE || {}).sort().join(","), la: ExerciseData.getCategory("artikel").getBank().length };
      });
      const l2 = log.slice(n1);
      sage(r2.ok === true && l2.filter(istTeil).length === 1 && /\/artikel-/.test((l2.find(istTeil) || {}).p || "") && !l2.some(istVerz) && r2.teile === "artikel,wortstellung",
        "B4 dazu [artikel, meinwortschatz]: genau ein weiterer Teil (Meine Wörter hat keinen), Verzeichnis nicht neu", l2.map((x) => x.p).join(", "));
      sage(laengen == null || r2.la === laengen.artikel, "B4 getBank(artikel) (eingebaut + Zusatz) so lang wie mit der ganzen Sammlung", r.vor + " → " + r2.la + " / " + (laengen ? laengen.artikel : "–"));
      sage(!s.pe.length, "B4 keine Seitenfehler", s.pe.slice(0, 3).join(" | "));
      await s.ctx.close();
    }
    /* B5 */
    if (soll("B5")) {
      /* gleich nach „bereit" (wie das Messwerkzeug): der Teil von data-exercises.js ist dann noch nicht vorgeladen */
      const s = await seite({ verzug: 200, ruhe: 50 });
      const ok = await lernen(s.pg);
      const h = await s.pg.evaluate(() => {
        const c = document.querySelector('.category-card[data-cat="wortstellung"]');
        if (!c) return null;
        c.click();
        const neu = document.querySelector('.category-card[data-cat="wortstellung"]');
        return { sofort: neu.classList.contains("selected") && /✓/.test(neu.querySelector(".cat-checkbox").textContent) };
      });
      sage(ok && h && h.sofort, "B5 Tipp auf eine Karte: Häkchen sofort (auch wenn ihr Teil noch unterwegs ist)");
      const bereit = await s.pg.waitForFunction(() => { const b = document.getElementById("startBtn"); return b && !b.disabled && document.querySelector('.category-card.selected[data-cat="wortstellung"]'); }, null, { timeout: 30000 }).then(() => true, () => false);
      sage(bereit, "B5 danach ist „Runde starten“ frei");
      await s.pg.evaluate(() => document.getElementById("startBtn").click());
      const frage = await s.pg.waitForFunction(() => { const p = document.getElementById("exercisePlay"); return p && p.style.display !== "none" && p.offsetParent !== null && p.textContent.trim().length > 20; }, null, { timeout: 30000 }).then(() => true, () => false);
      const st = await s.pg.evaluate(() => { const q = typeof Quiz !== "undefined" && Quiz.getState(); return q ? { n: q.questions.length, kat: [...new Set(q.questions.map((x) => x.categoryId || x.catId || ""))].join(",") } : null; });
      sage(frage && st && st.n >= 5, "B5 Runde startet mit der gewählten Kategorie", (frage ? "Frage da" : "keine Frage zu sehen") + ", " + (st ? st.n + " Fragen" : "kein Quiz-Zustand"));
      const sofort = await s.pg.evaluate(() => (window.DMA_TEIL_SOFORT || []).map(String));
      sage(!sofort.length, "B5 nichts synchron geholt (Teil von data-exercises.js mit ladeUebungen, app-Stücke vor „Runde starten“ über die Leitung)", sofort.join(" | ").slice(0, 160));
      sage(!s.pe.length, "B5 keine Seitenfehler", s.pe.slice(0, 3).join(" | "));
      await s.ctx.close();
    }
    /* B9: die Stücke kommen langsam (Leitung voll) – der Ablauf holt nichts synchron (Gegenprobe d9637a22: synchron) */
    if (soll("B9")) {
      /* je eines langsam (die Sonde hat HTTP/1.1 mit 6 Verbindungen – alle langsam zugleich hielten auch den alten Weg auf) */
      for (const [was, langsam] of [["min/data-exercises-teil.js", /^\/min\/data-exercises-teil\.js$/], ["min/app-teil-rest2.js (wortschatzBereit)", /^\/min\/app-teil-rest2\.js$/]]) {
        const s = await seite({ ruhe: 50, langsam, langsamMs: 6000 });
        const ok = await lernen(s.pg);
        const tKarte = await s.pg.evaluate(() => { document.querySelector('.category-card[data-cat="wortstellung"]').click(); return Math.round(performance.now()); });
        const bereit = await s.pg.waitForFunction(() => { const b = document.getElementById("startBtn"); return b && !b.disabled && document.querySelector('.category-card.selected[data-cat="wortstellung"]'); }, null, { timeout: 30000 }).then(() => true, () => false);
        if (bereit) await s.pg.evaluate(() => document.getElementById("startBtn").click());
        const frage = bereit && await s.pg.waitForFunction(() => { const p = document.getElementById("exercisePlay"); return p && p.style.display !== "none" && p.offsetParent !== null && p.textContent.trim().length > 20; }, null, { timeout: 30000 }).then(() => true, () => false);
        const sofort = await s.pg.evaluate(() => (window.DMA_TEIL_SOFORT || []).map(String));
        const spur = await s.pg.evaluate(() => performance.getEntriesByType("resource").filter((e) => /data-exercises-teil|app-teil-rest2|data-uebungen|bau\/uebungen-/.test(e.name))
          .map((e) => e.name.replace(/^.*\//, "").replace(/\?.*$/, "") + " " + Math.round(e.startTime) + "→" + Math.round(e.responseEnd)).join(", "));
        console.log("       (" + was + " 6 s langsam; Karte getippt bei " + tKarte + " ms; Abrufe: " + spur.slice(0, 300) + ")");
        sage(ok && frage, "B9 " + was + " kommt langsam (6 s): Lernen → Karte → Runde starten → Frage");
        sage(!sofort.length, "B9 … dabei nichts synchron geholt (der Hauptfaden steht nie auf der Leitung)", sofort.map((x) => x.split(" ")[0]).join(", "));
        sage(!s.pe.length, "B9 … keine Seitenfehler", s.pe.slice(0, 3).join(" | "));
        await s.ctx.close();
      }
    }
    /* B6 */
    if (soll("B6")) {
      for (const [was, sperre] of [["ein Teil fehlt (404)", /^\/bau\/uebungen\/wortstellung-/], ["das Verzeichnis fehlt (404)", /^\/bau\/uebungen-[A-Za-z0-9_-]{8}\.js$/]]) {
        const s = await seite({ sperre });
        const n0 = log.length;
        const r = await s.pg.evaluate(async () => {
          const ok = await ExerciseData.ladeUebungen(["wortstellung"]);
          return { ok, da: ExerciseData.uebungenDa(), json: window.DMA_DATEN && window.DMA_DATEN.ZUSATZ_FRAGEN ? JSON.stringify(window.DMA_DATEN.ZUSATZ_FRAGEN) : "" };
        });
        const l = log.slice(n0);
        sage(r.ok === true && r.da === true && l.some((x) => x.p === "/min/data-uebungen.js" && x.s === 200) && r.json === QUELLE_JSON,
          "B6 Rückfall: " + was + " → ganze Datei (min/data-uebungen.js), Daten = Quelle", l.filter((x) => istVerz(x) || istTeil(x) || istGanz(x)).map((x) => x.p + " " + x.s).join(", "));
        sage(!s.pe.length, "B6 … keine Seitenfehler", s.pe.slice(0, 3).join(" | "));
        await s.ctx.close();
      }
      /* Nachbesserung 1: derselbe Rückfall auf dem Weg des Vorladens („Lernen" offen, keine Karte getippt) – sonst blieb
         die Sammlung für die Sitzung halb (Spiele, Wörterbuch, offline). Gegenprobe edc48fc5 (vor der Nachbesserung): rot. */
      for (const [was, sperre, angefragt] of [["ein Teil fehlt (404)", /^\/bau\/uebungen\/stil-/, istTeil], ["das Verzeichnis fehlt (404)", /^\/bau\/uebungen-[A-Za-z0-9_-]{8}\.js$/, istVerz]]) {
        const s = await seite({ sperre });
        const n0 = log.length;
        const ok = await lernen(s.pg);
        const fertig = await s.pg.waitForFunction(() => window.__ueb.ganz != null, null, { timeout: 60000 }).then(() => true, () => false);
        const r = await s.pg.evaluate(() => ({ da: ExerciseData.uebungenDa(), json: window.DMA_DATEN && window.DMA_DATEN.ZUSATZ_FRAGEN ? JSON.stringify(window.DMA_DATEN.ZUSATZ_FRAGEN) : "" }));
        const l = log.slice(n0);
        sage(ok && fertig && r.da && l.some((x) => angefragt(x) && x.s === 404) && l.some((x) => x.p === "/min/data-uebungen.js" && x.s === 200) && r.json === QUELLE_JSON,
          "B6 Rückfall beim Vorladen (nur „Lernen“ offen): " + was + " → von selbst die ganze Datei, Daten = Quelle",
          (fertig ? "" : "nicht fertig; ") + l.filter((x) => istVerz(x) || istGanz(x) || (istTeil(x) && x.s !== 200)).map((x) => x.p.replace(/^.*\//, "") + " " + x.s).join(", "));
        sage(!s.pe.length, "B6 … keine Seitenfehler", s.pe.slice(0, 3).join(" | "));
        await s.ctx.close();
      }
    }
    /* B7 */
    if (soll("B7")) {
      const fass = (/window\.DMA_VERSION = "(\d+)"/.exec(html) || [])[1] || "";
      for (const [was, o] of [["?quelle", { query: "?quelle" }], ["Notweg (dma-ganz nennt data-uebungen.js)", { ls: { "dma-ganz": JSON.stringify({ f: fass, d: ["data-uebungen.js"] }) } }]]) {
        const s = await seite(o);
        const n0 = log.length;
        const ok = await lernen(s.pg);
        await s.pg.waitForTimeout(2500);
        const l = log.slice(n0);
        sage(ok && l.some((x) => x.p === "/data-uebungen.js" && x.s === 200) && !l.some((x) => istTeil(x) || istVerz(x)),
          "B7 " + was + ": die ganze Quelle data-uebungen.js wie bisher, keine Teile", l.filter((x) => istVerz(x) || istTeil(x) || istGanz(x)).map((x) => x.p).join(", "));
        await s.ctx.close();
      }
    }
    /* B8 */
    if (soll("B8")) {
      const s = await seite({ verzug: 250 });
      const n0 = log.length;
      await lernen(s.pg);
      /* über die ersten Karten hinaus (danach wartet das Vorladen einmal auf den Wortschatz) */
      await s.pg.waitForFunction(() => performance.getEntriesByType("resource").filter((e) => /\/bau\/uebungen\//.test(e.name)).length >= 12, null, { timeout: 30000 }).catch(() => {});
      /* anderer Unterbereich von „Lernen" (Spiele lesen die Sammlung auch): weiter */
      const nSp = log.slice(n0).filter(istTeil).length;
      await s.pg.evaluate(() => document.querySelector('#learnSubnav [data-sub="sub-games"]').click());
      await s.pg.waitForTimeout(1200);
      const nSp2 = log.slice(n0).filter(istTeil).length;
      sage(nSp2 > nSp + 2, "B8 in „Lernen → Spiele“ läuft das Vorladen weiter", nSp + " → " + nSp2 + " Teile in 1,2 s");
      await s.pg.evaluate(() => document.querySelector('.tape-tab[data-target="view-knowledge"]').click());
      const nWeg = log.slice(n0).filter(istTeil).length;
      await s.pg.waitForTimeout(3000);
      const nDanach = log.slice(n0).filter(istTeil).length;
      const ganzWeg = await s.pg.evaluate(() => window.__ueb.ganz != null);
      sage(!ganzWeg && nDanach - nWeg <= 4, "B8 „Lernen“ zu (Wissen): das Vorladen hält an (höchstens die 4 unterwegs)", nWeg + " → " + nDanach + " Teile in 3 s");
      await s.pg.evaluate(() => document.querySelector('.tape-tab[data-target="view-learn"]').click());
      const weiter = await s.pg.waitForFunction(() => window.__ueb.ganz != null, null, { timeout: 60000 }).then(() => true, () => false);
      const nEnde = log.slice(n0).filter(istTeil).length;
      sage(weiter && nEnde === (QUELLE ? Object.keys(QUELLE).length : -1), "B8 zurück in „Lernen“: es macht weiter bis alles da ist (jeder Teil einmal)", nDanach + " → " + nEnde + " Teile");
      sage(!s.pe.length, "B8 keine Seitenfehler", s.pe.slice(0, 3).join(" | "));
      await s.ctx.close();
    }
    /* B10 Wörterbuch: früh gebaut (vor der ganzen Sammlung) – sind die Wörter aus den Übungstexten danach drin?
       Vergleich: dieselbe Zahl wie in einer Seite, die erst alles abwartet und dann baut. */
    if (soll("B10")) {
      const zaehlen = () => {
        const a = window.DMA_PRUEF.ausspracheAlle();
        return { n: a.length, sonst: a.filter((e) => e && e.verified === false && e.category === "Sonstiges").length };
      };
      const allesDa = () => ExerciseData.uebungenDa() && (!VocabData.alleThemenDa || VocabData.alleThemenDa());
      /* die ganze Datei (alter Weg) kommt hier 3 s spät, damit „früh" auch dort vor der Sammlung liegt */
      const s1 = await seite({ verzug: 120, langsam: /^\/(min\/)?data-uebungen\.js$/, langsamMs: 3000 });
      await s1.pg.evaluate(() => document.querySelector('.tape-tab[data-target="view-learn"]').click());
      const frueh = await s1.pg.evaluate(zaehlen);
      const da1 = await s1.pg.waitForFunction(allesDa, null, { timeout: 90000 }).then(() => true, () => false);
      await s1.pg.waitForTimeout(300);
      const spaet = await s1.pg.evaluate(zaehlen);
      const pe1 = s1.pe.slice();
      await s1.ctx.close();
      const s2 = await seite();
      await lernen(s2.pg);
      const da2 = await s2.pg.waitForFunction(allesDa, null, { timeout: 90000 }).then(() => true, () => false);
      await s2.pg.waitForTimeout(300);
      const ref = await s2.pg.evaluate(zaehlen);
      const pe2 = s2.pe.slice();
      await s2.ctx.close();
      sage(da1 && da2 && ref.sonst > frueh.sonst && spaet.sonst === ref.sonst && spaet.n === ref.n,
        "B10 Wörterbuch vor der ganzen Sammlung gebaut: danach mit den Wörtern aus den Übungstexten (wie ohne frühen Bau)",
        "früh " + frueh.sonst + " · danach " + spaet.sonst + " · Vergleich " + ref.sonst + " (aus Übungstexten; Einträge " + spaet.n + "/" + ref.n + ")");
      sage(!pe1.length && !pe2.length, "B10 keine Seitenfehler", pe1.concat(pe2).slice(0, 3).join(" | "));
    }
    /* B11 Duell annehmen: die Runde startet erst mit den ganzen Kategorien (Nachbesserung 1, Prüfer: tiere/wortstellung/
       stil 0 Fragen, artikel 106 statt 705 – bei 0 Fragen brach die Ansicht ab). Backend ist eine Attrappe in der Seite
       (ein Konto, eine offene Herausforderung); Knopf und Empfänger sind die echten. Vergleich in derselben Seite: getBank
       der Kategorien beim Start = nach dem Laden der Kategorien. */
    if (soll("B11")) {
      const DUELL = ["wortstellung", "stil"];
      for (const [was, vorher] of [["„Lernen“ nie offen", null], ["„Lernen“ 1 s offen, dann Profil", 1000]]) {
        const s = await seite({ verzug: 200, ruhe: 50 });
        if (vorher != null) { await lernen(s.pg); await s.pg.waitForTimeout(vorher); }
        /* erst Profil öffnen (zeichnet die Kontoseite als Gast), dann die Attrappe – sonst fehlt der Kontoseite das Profil */
        await s.pg.evaluate(() => document.querySelector('.tape-tab[data-target="view-profile"]').click());
        await s.pg.waitForTimeout(400);
        await s.pg.evaluate((ids) => {
          const ch = { id: "pruef-duell-1", categories: ids, status: "pending", fromName: "Prüf-Freund", fromId: "pruef-freund",
            extra: { raum: "de" }, createdAt: new Date().toISOString() };
          Backend.currentUser = () => ({ id: "pruef-ich", email: "pruef@example.org" });
          Backend.getFriends = async () => [];
          Backend.getIncomingRequests = async () => [];
          Backend.getMyChallenges = async () => ({ incoming: [ch], incomingAlle: [ch], outgoing: [] });
          window.__duell = [];
          const alt = Quiz.startSession;
          Quiz.startSession = function (cats) {
            try { window.__duell.push({ cats: cats.slice(), len: cats.map((k) => ExerciseData.getCategory(k).getBank().length) }); }
            catch (e) { window.__duell.push({ fehler: String(e) }); }
            return alt.apply(this, arguments);
          };
        }, DUELL);
        await s.pg.evaluate(() => document.querySelector('#profileSubnav [data-sub="sub-friends"]').click());
        const knopf = await s.pg.waitForSelector('[data-accept-challenge="pruef-duell-1"]', { timeout: 20000 }).then(() => true, () => false);
        if (knopf) await s.pg.evaluate(() => document.querySelector('[data-accept-challenge="pruef-duell-1"]').click());
        const frage = knopf && await s.pg.waitForFunction(() => { const p = document.getElementById("exercisePlay"); return p && p.style.display !== "none" && p.offsetParent !== null && p.textContent.trim().length > 20; }, null, { timeout: 30000 }).then(() => true, () => false);
        const st = await s.pg.evaluate(async (ids) => {
          const d = window.__duell[0] || null;
          const q = Quiz.getState();
          await ExerciseData.ladeUebungen(ids);   /* Vergleich (auf d9637a22 die ganze Datei) */
          return { d, n: q && q.questions ? q.questions.length : 0, voll: ids.map((k) => ExerciseData.getCategory(k).getBank().length) };
        }, DUELL);
        sage(knopf && frage && st.d && st.d.len && st.n >= 5 && st.d.len.join(",") === st.voll.join(","),
          "B11 Duell annehmen (" + was + "): die Runde startet mit allen Aufgaben der Kategorien",
          (knopf ? "" : "kein Annehmen-Knopf; ") + (frage ? "" : "keine Frage; ") + DUELL.join("/") + " beim Start " + (st.d && st.d.len ? st.d.len.join("/") : "–")
          + ", ganz " + st.voll.join("/") + ", Runde " + st.n + " Fragen");
        sage(!s.pe.length, "B11 … keine Seitenfehler", s.pe.slice(0, 3).join(" | "));
        await s.ctx.close();
      }
    }
    /* B12 Vorladen nach einer Unterbrechung (Nachbesserung 1, Prüfer: nach 3 s Bildschirm aus blieb es bei 4 von 90): es
       wartet und macht von selbst weiter, ohne neuen Tipp auf „Lernen"; im Klassenzimmer kommt nichts dazu. */
    if (soll("B12")) {
      const verdecken = (an) => {
        if (an) {
          Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
          Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
        } else { delete document.hidden; delete document.visibilityState; }
        document.dispatchEvent(new Event("visibilitychange"));
      };
      const alle = QUELLE ? Object.keys(QUELLE).length : -1;
      const teile = (n0) => log.slice(n0).filter(istTeil).length;
      const ganz = (pg, ms) => pg.waitForFunction(() => window.__ueb.ganz != null, null, { timeout: ms }).then(() => true, () => false);
      const klick = (pg, sel) => pg.evaluate((x) => document.querySelector(x).click(), sel);
      const faelle = [
        ["Bildschirm 3 s aus (in „Lernen → Spiele“)", async (pg, n0) => {
          await klick(pg, '#learnSubnav [data-sub="sub-games"]');
          await pg.evaluate(verdecken, true);
          const a = teile(n0); await pg.waitForTimeout(3000); const b = teile(n0);
          await pg.evaluate(verdecken, false);
          return { still: b - a, wo: "verdeckt" };
        }],
        ["Profil", async (pg) => { await klick(pg, '.tape-tab[data-target="view-profile"]'); return null; }],
        ["Wissen (Kompass, nach der Frist von 8 s)", async (pg, n0) => {
          await klick(pg, '.tape-tab[data-target="view-knowledge"]');
          const a = teile(n0); await pg.waitForTimeout(3000); const b = teile(n0);
          return { still: b - a, wo: "die ersten 3 s in Wissen" };
        }],
        ["nach dem Klassenzimmer (12 s drin, dann Kompass)", async (pg, n0) => {
          await klick(pg, '.tape-tab[data-target="view-knowledge"]');
          await klick(pg, '#knowledgeSubnav [data-sub="sub-livechat"]');
          const a = teile(n0); await pg.waitForTimeout(12000); const b = teile(n0);
          const g = await pg.evaluate(() => window.__ueb.ganz != null);
          await klick(pg, '#knowledgeSubnav [data-sub="sub-kompass"]');
          return { still: b - a + (g ? 100 : 0), wo: "12 s im Klassenzimmer" };
        }],
      ];
      for (const [was, weg] of faelle) {
        const s = await seite({ verzug: 250 });
        const n0 = log.length;
        await lernen(s.pg);
        await s.pg.waitForFunction(() => performance.getEntriesByType("resource").filter((e) => /\/bau\/uebungen\//.test(e.name)).length >= 4, null, { timeout: 30000 }).catch(() => {});
        const vor = teile(n0);
        /* ohne Teile (Stand vor M3b: die ganze Datei) gibt es nichts weiterzuladen – gleich rot, statt 60 s zu warten */
        if (!vor) {
          sage(false, "B12 " + was + ": kein Teil geholt (Stand ohne Teile?)", log.slice(n0).filter(istGanz).length ? "die ganze Datei" : "");
          await s.ctx.close();
          continue;
        }
        const r = await weg(s.pg, n0);
        if (r) sage(r.still <= 4, "B12 " + was + ": " + r.wo + " kommt nichts dazu (höchstens die 4 unterwegs)", r.still + " Teile dazu");
        const fertig = await ganz(s.pg, 60000);
        const nEnde = teile(n0);
        const lernenOffen = await s.pg.evaluate(() => document.getElementById("view-learn").dataset.active === "true");
        sage(fertig && nEnde === alle && (was.startsWith("Bildschirm") || !lernenOffen),
          "B12 " + was + ": danach von selbst zu Ende (ohne neuen Tipp auf „Lernen“), jeder Teil einmal", vor + " → " + nEnde + " / " + alle + " Teile" + (fertig ? "" : ", nicht fertig"));
        sage(!s.pe.length, "B12 … keine Seitenfehler", s.pe.slice(0, 3).join(" | "));
        await s.ctx.close();
      }
    }
    await br.close(); srv.close();
  }

  console.log("\n  " + (fehler ? fehler + " FEHL" : "Alles in Ordnung.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
