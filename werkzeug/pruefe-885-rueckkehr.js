#!/usr/bin/env node
/* =====================================================================
   SONDE 885 — RÜCKKEHR IN DEN RAUM NACH DEM NEULADEN KOMMT AUF DER NEUEN
   FASSUNG AN (S1-Nachtrag; Prüfer, dritte Prüfung von S1)
   ---------------------------------------------------------------------
   XANDER (Funk 263): „sofort im Livestream wie bei HelloTalk" · (Funk
   255): „die schnelle Performance und die Verbindung zu den anderen haben
   oberste Priorität" · (Funk 310/312): „das Maximum rausholen".

   Der Fall: Man ist im Raum und lädt denselben Tab neu (Ziehen zum
   Aktualisieren, ein vom Browser verworfener Tab; Merker
   dma_livechat_zurueck, 30 min). Draußen liegt inzwischen eine neue
   Fassung. Seit S1 kommt die Seite zuerst aus dem Speicher des Helfers;
   die Rückkehr ging dann auf der ALTEN Seite in den Raum, bevor der
   Fassungs-Wächter antwortete, und der zeigte bei „verbindet" nur die
   Blase – die alte Fassung blieb die ganze Sitzung (Prüfer: CPU 1×,
   fassung.json nach 0,25 s: 0 von 3 auf der neuen; vor S1 immer neu).

   LiveChat.betreten wird durch eine FALLE ersetzt (setzt nur „verbindet",
   wie der echte Aufbau; ohne Supabase fiele er sonst sofort auf
   „fehler"). Sie schreibt je Aufruf Seite, Seitenuhr und Uhrzeit mit.
   Server wie GitHub Pages: Bereich /Deutsch-Mit-Xander/, index.html mit
   max-age=600; index.html und fassung.json je D ms.

   TEILE
     R  Rückkehr bei Update (Server Fassung + 1), CPU 1× und 4×, D = 250
        und 800 ms, Neuladen (reload) – dazu Öffnen derselben Adresse
        (goto, wie ein verworfener Tab, CPU 1×, D = 250; dort reicht der
        Helfer oft die alte index.html aus dem Speicher des Browsers durch,
        „schon da“): am Ende die NEUE Fassung, höchstens ein Neuladen,
        betreten genau EINMAL und nur auf der neuen Seite (nie auf der
        alten), keine Blase. Dazu eine grobe Zeitgrenze: betreten nach
        höchstens D + 0,9 s (CPU 1×) bzw. D + 1,8 s (CPU 4×) – fängt jedes
        Warten auf eine Frist ab (die feine Messung ist Teil M).
     K  Update schon bekannt: die Seite im Raum hat die Blase schon gezeigt
        (der Wächter prüft beim Sichtbarwerden), dann Neuladen: der Helfer
        weiß es („draussen“) und holt die Seite wie bis 884 aus dem Netz – am
        Ende die neue Fassung OHNE zweites Laden, betreten einmal, die Seite
        ohne Speicher-Marke; hängt fassung.json, wartet die Rückkehr auf
        dieser frischen Seite nicht (< 3 s).
     G  Rückkehr ohne Update (CPU 1× und 4×, D = 250/800): betreten genau
        einmal, kein Neuladen, keine Blase; Zeitgrenze wie R; am Ende alle
        ganzen Stilblätter da (Fassung 886).
     R/Z  dazu (Fassung 886): die vom Helfer ersetzte Seite hat keine ganzen
        Stilblätter eingehängt (sie warten auf seine Entscheidung), die
        neue Seite am Ende alle.
     F  (Nachbesserung 1) fassung.json antwortet mit 500 oder hängt, Update:
        betreten einmal auf der NEUEN Fassung, < 3 s (der Helfer weiß es aus
        der Vorab-Anfrage – wie 884, das die Seite aus dem Netz nahm; vorher
        ging es hier auf der alten Seite hinein). fassung.json hängt, ohne
        Update: hinein ohne zu warten (der Helfer sagt beim Neuladen
        „gleich“), < 3 s. index.html UND fassung.json hängen: hinein nach der
        Frist (6 s ab dem Öffnen, 5,5 … 7,5 s), kein Neuladen.
     T  (Nachbesserung 1, Prüfer) Tipp während des Wartens: Update, Antwort
        nach > 2 s, ein Tipp nach 1,2 s (Klassenzimmer nicht offen) – am Ende
        die neue Fassung, betreten einmal, keine Blase. Zwei Wege: der Helfer
        weiß es (index.html und fassung.json je 2,5 s) und der Wächter
        entscheidet (fassung.json 2,5 s, index.html 4,5 s; dort zählte
        bleiben() den Tipp). CPU 1× und 4×.
     Z  (Fassung 886) Die Antwort des Servers kommt, während die alte Seite aus
        dem Speicher ihre Skripte ausführt (der Server hält index.html, bis
        auf der alten Seite livechat.js läuft; CPU 4× und 1×): am Ende die
        neue Fassung, ein Neuladen, betreten einmal auf der neuen Seite, die
        alte Seite hat keine ganzen Stilblätter eingehängt, die neue alle
        (ob app.js auf der alten noch anlief, wird nur mitgeschrieben).
        Dazu in R und Z: kein Eintrag
        „dma-mess-abbruch“ der vom Helfer ersetzten Seite (messung.js zählte
        ihn als abgebrochenes Laden).
     W  (Nachbesserung 1) Merker dma-wechsel: „<Fassung> <Zeit>“ und „* <Zeit>
        <alte Fassung>“ (vom Helfer geladen) gelten nur jünger als 20 s und
        nur für eine ANDERE Fassung als „*“ nennt; Öffnen (dort zählt das
        „gleich“ des Helfers nicht), fassung.json hängt: frisch < 3 s, sonst
        erst nach der Frist (6 s).
     N  (Nachbesserung 1) Antwort „neu“, aber das Neuladen scheitert (die
        Sonde bricht es mit window.stop ab, der Helfer bekommt keine Meldung):
        nach 15 s doch hinein, genau einmal, auf dieser Seite.
     O  Ohne Helfer, Neuladen (der Browser fragt beim Server nach, wie bis
        884), fassung.json hängt: betreten wartet NICHT (< 3 s) – die Seite
        ist frisch. Ohne Helfer, gewöhnliches Öffnen bei Update: index.html
        kommt aus dem Speicher des Browsers (max-age=600, alt) → betreten
        erst auf der neuen Seite, genau einmal (884: betreten auf der alten,
        dann Neuladen mitten im Verbinden und noch einmal betreten).
     S  Die gespeicherte Seite trägt die Marke data-dma-speicher (daran
        erkennt die Rückkehr, dass sie aus dem Speicher kam), die frisch
        geholte nicht. Stempel ↔ Inhalt (sw.js): liefert der Server unter einem
        Datei-Stempel einen anderen Inhalt (eine alte Seite holt nach einem
        Update eine Datei, die nicht im Speicher liegt), geht er an die
        Seite, aber NICHT in den Speicher des Helfers; der richtige Inhalt
        wird abgelegt und danach aus dem Speicher geliefert; Ordner-Stempel
        (szenen/) und ?v=<Fassung> werden wie bisher abgelegt. Dazu
        (Nachbesserung 1, Prüfer): index.html schreibt „draussen“ in genau
        den Seitenspeicher, den sw.js als SEITE führt (Name steht in
        index.html fest).
     H  (nur mit GEGEN und NUR=…H…) Helfer füllt seinen Speicher: zweites
        Öffnen, jede gestempelte Datei ein Fehltreffer (wie nach einem
        Update), CPU 4× (die Bremse gilt nur für die Seite, nicht für den
        Helfer): load A/B gepaart; B hat in keinem Lauf weniger Einträge im
        Speicher als A im besten Lauf (A streut um eins, das Ablegen läuft
        nach load weiter – nach einem roten Lauf von „gleich viele“ so
        gefasst, siehe SPIELSYSTEM.md).
     M  Messung (nur mit GEGEN=<alter Stand>): Neuladen → betreten ab dem
        Neuladen (Uhrzeit), verschränkt A B / B A, A = GEGEN, B = WURZEL,
        mit und ohne Update (Standard: Update CPU 1× D = 250, CPU 4× D = 250
        und 800; ohne Update CPU 1× D = 250, CPU 4× D = 800; MFAELLE=…);
        dazu die Fassung am Ende. Median, B − A gepaart.

   Schalter:
     WURZEL=<ordner>   Stand, der geprüft wird (Standard: dieser Baum)
     GEGEN=<ordner>    alter Stand für Teil M
     N=n               Läufe je Fall in R/G (Standard 2)
     PAARE=n           Paare je Messfall in M (Standard 6)
     NUR=RKGFTZWNOSHM  nur diese Teile (Standard RKGFTZWNOS, mit GEGEN dazu M)
     JSON=<datei>      Ergebnisse (Läufe, Messung) als JSON, laufend
   Aufruf:  node werkzeug/pruefe-885-rueckkehr.js
   Gegenprobe: WURZEL=<ordner mit altem Stand> node …  (c30a68f7: R rot;
   6b724580, vor S1: R grün; 864324e7, vor Nachbesserung 1: T rot)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const GEGEN = process.env.GEGEN ? path.resolve(process.env.GEGEN) : null;
const N = Math.max(1, Number(process.env.N || 2));
const PAARE = Math.max(1, Number(process.env.PAARE || 6));
const NUR = process.env.NUR || "RKGFTZWNOS" + (GEGEN ? "M" : "");
const JSON_AUS = process.env.JSON || "";
const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".mp3": "audio/mpeg", ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json" };
const PRE = "/Deutsch-Mit-Xander";
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const info = (t) => console.log("       " + t);
const abschnitt = (k, t) => console.log("\n" + k + "  " + t);
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const grund = (w) => (fs.readFileSync(path.join(w, "index.html"), "utf8").match(/window\.DMA_VERSION = "(\d+)"/) || [])[1];
const med = (a) => { const s = a.filter((x) => typeof x === "number" && isFinite(x)).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
const ERG = { wurzel: WURZEL, gegen: GEGEN, laeufe: [], messung: [] };
const schreiben = () => { if (JSON_AUS) try { fs.writeFileSync(JSON_AUS, JSON.stringify(ERG, null, 1)); } catch (e) {} };

/* ---------- Server (je Stand einer, eigene Herkunft = eigener Helfer) ---------- */
function serverBauen(wurzel) {
  const S = { seite: "", stau: 0, fjStau: 0, fjArt: "", anders: {}, zaehler: {}, zwang: null };
  const srv = http.createServer((q, a) => {
    const i = q.url.indexOf("?");
    let p = decodeURIComponent(i < 0 ? q.url : q.url.slice(0, i));
    if (!p.startsWith(PRE + "/")) { a.writeHead(404); return a.end(); }
    p = p.slice(PRE.length); if (p === "/") p = "/index.html";
    S.zaehler[p] = (S.zaehler[p] || 0) + 1;
    /* Teil Z (Fassung 886): die alte Seite meldet „meine Skripte laufen“ (livechat.js) – erst dann geht die gehaltene
       index.html hinaus (so kommt die Antwort an den Helfer genau dann, wenn die alte Seite ihre Skripte ausführt) */
    if (p === "/__interaktiv") {   /* Name von früher: das Signal kommt jetzt, wenn livechat.js läuft */ if (S.zwang && S.zwang.los) S.zwang.los(); a.writeHead(204); return a.end(); }
    if (p === "/fassung.json") {
      const kopf = { "Content-Type": "application/json", "Cache-Control": "max-age=600" };
      if (S.fjArt === "haengt") return;   /* nie eine Antwort */
      const los = () => {
        if (a.destroyed) return;
        if (S.fjArt === "500") { a.writeHead(500, kopf); return a.end("{}"); }
        a.writeHead(200, kopf); a.end(JSON.stringify({ fassung: S.seite || grund(wurzel) }));
      };
      return S.fjStau ? setTimeout(los, S.fjStau) : los();
    }
    const f = path.join(wurzel, p);
    if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    let body = fs.readFileSync(f);
    const kopf = { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream" };
    if (p === "/index.html") {
      let t = String(body);
      if (S.seite) t = t.replace(/window\.DMA_VERSION = "[^"]*";/, 'window.DMA_VERSION = "' + S.seite + '";');
      body = Buffer.from(t); kopf["Cache-Control"] = "max-age=600";
      if (S.zwang && !S.zwang.belegt) {
        /* genau die erste index.html nach dem Scharfschalten: bis zum Signal (höchstens 2 s), dann gleich */
        const z = S.zwang; z.belegt = true;
        const raus = () => { if (z.raus) return; z.raus = Date.now(); if (!a.destroyed) { a.writeHead(200, kopf); a.end(body); } };
        z.los = raus; setTimeout(raus, 2000);
        return;
      }
      if (S.stau) return setTimeout(() => { if (!a.destroyed) { a.writeHead(200, kopf); a.end(body); } }, S.stau);
    }
    if (S.anders[p]) body = Buffer.concat([body, Buffer.from("\n/* anders: neuer Inhalt unter altem Stempel */\n")]);
    if (p === "/sw.js") kopf["Cache-Control"] = "no-cache";
    a.writeHead(200, kopf); a.end(body);
  }).listen(0, "127.0.0.1");
  return new Promise((r) => srv.on("listening", () => r({ S, srv, hier: "http://127.0.0.1:" + srv.address().port + PRE, wurzel })));
}

/* Falle für LiveChat.betreten + Rückkehr-Merker (nur, wenn __rueck gesetzt ist) */
function falle(rueck) {
  if (window.top !== window) return;
  try {
    localStorage.setItem("dma_tour_seen", "1");
    const n = Number(sessionStorage.getItem("__s") || 0) + 1; sessionStorage.setItem("__s", String(n));
    const l = JSON.parse(sessionStorage.getItem("__a") || "[]"); l.push(location.search); sessionStorage.setItem("__a", JSON.stringify(l));
    if (rueck && sessionStorage.getItem("__rueck") === "1")
      sessionStorage.setItem("dma_livechat_zurueck", JSON.stringify({ raum: "pruefraum885", name: "Pruef", mitBild: false, zeit: Date.now() }));
    /* Teil W: Merker dma-wechsel vorgeben (einmal, beim nächsten Start) */
    const wv = sessionStorage.getItem("__wechselVor");
    if (wv) { sessionStorage.removeItem("__wechselVor"); const [art, alter, f] = wv.split("|"); sessionStorage.setItem("dma-wechsel", art === "*" ? "* " + (Date.now() - Number(alter)) + " " + f : f + " " + (Date.now() - Number(alter))); }
    /* Teil N: die Seite meldet dem Helfer nichts, und das Neuladen des Wächters wird abgebrochen (window.stop) – „bleibt die Seite wider Erwarten“ */
    if (sessionStorage.getItem("__ohneNeuladen") === "1") {
      try { ServiceWorker.prototype.postMessage = function () { throw new Error("Sonde: keine Meldung"); }; } catch (e) {}
      const si = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, w) {
        if (k === "dma-wechsel" && !/^\*/.test(String(w))) {
          const l = JSON.parse(sessionStorage.getItem("__stopp") || "[]"); l.push(Math.round(performance.now())); si.call(this, "__stopp", JSON.stringify(l));
          queueMicrotask(() => { try { window.stop(); } catch (e) {} });
        }
        return si.apply(this, arguments);
      };
    }
    /* Teil Z (Fassung 886): die erste Seite nach dem Neuladen meldet dem Server, dass ihre Skripte laufen (livechat.js setzt
       window.LiveChat – das kommt in der Reihe vor app.js) */
    const zwang = n === 1 && sessionStorage.getItem("__zwang") === "1";
    const melden = () => { try { fetch(location.pathname.replace(/[^/]*$/, "") + "__interaktiv?t=" + Date.now()).catch(() => {}); } catch (e) {} };
    /* Fassung 886: auf welcher Seite app.js gelaufen ist (window.DMA_TEILE setzt app.js gleich am Anfang) */
    let dt;
    Object.defineProperty(window, "DMA_TEILE", { configurable: true, get: () => dt, set: (v) => { dt = v;
      const l = JSON.parse(sessionStorage.getItem("__app") || "[]"); l.push({ seite: n, t: Math.round(performance.now()) }); sessionStorage.setItem("__app", JSON.stringify(l)); } });
    /* Fassung 886: wie viele ganze Stilblätter die Seite eingehängt hatte, als sie ging */
    addEventListener("pagehide", () => { const l = JSON.parse(sessionStorage.getItem("__voll") || "[]"); l.push({ seite: n, voll: document.querySelectorAll("link[data-dma-voll-da]").length }); sessionStorage.setItem("__voll", JSON.stringify(l)); });
    /* Teil T: Uhrzeit der ersten Berührung */
    addEventListener("pointerdown", () => { if (!sessionStorage.getItem("__tipp")) sessionStorage.setItem("__tipp", String(Math.round(performance.now()))); }, { capture: true });
    let lc;
    Object.defineProperty(window, "LiveChat", { configurable: true, get: () => lc, set: (v) => {
      lc = v;
      if (zwang) melden();
      try {
        v.betreten = function () {
          const b = JSON.parse(sessionStorage.getItem("__b") || "[]");
          b.push({ seite: n, t: Math.round(performance.now()), uhr: Date.now(), f: String(window.DMA_VERSION), abbruch: localStorage.getItem("dma-mess-abbruch") });
          sessionStorage.setItem("__b", JSON.stringify(b));
          try { v.pruefLageSetzen("verbindet"); } catch (e) {}
          return new Promise(() => {});
        };
      } catch (e) {}
    } });
  } catch (e) {}
}

/* Ein Lauf: anmelden (Helfer), Seite V speichern, „im Raum", dann draußen V1 (oder V), Netz D, Neuladen */
async function lauf(br, sv, o) {
  const { S, hier } = sv;
  const G = Number(grund(sv.wurzel));
  const V = String(G + 10 * (++lauf.k)), V1 = o.update ? String(Number(V) + 1) : V;
  S.seite = V; S.stau = 0; S.fjStau = 0; S.fjArt = "";
  const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(falle, true);
  const pg = await ctx.newPage();
  const cdp = await ctx.newCDPSession(pg);
  const q = o.helfer === false ? "" : "?mit-sw";
  await pg.goto(hier + "/index.html" + q, { waitUntil: "load" });
  if (o.helfer !== false) await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
  await pg.goto(hier + "/index.html" + q, { waitUntil: "load" });
  await schlaf(1500);
  const gesteuert = await pg.evaluate(() => Boolean(navigator.serviceWorker && navigator.serviceWorker.controller));
  await pg.evaluate((o) => { sessionStorage.setItem("__rueck", "1"); sessionStorage.setItem("__s", "0"); sessionStorage.setItem("__a", "[]"); sessionStorage.setItem("__b", "[]");
    sessionStorage.removeItem("__tipp"); sessionStorage.removeItem("__stopp"); sessionStorage.setItem("__app", "[]"); sessionStorage.setItem("__voll", "[]");
    if (o.zwang) sessionStorage.setItem("__zwang", "1"); else sessionStorage.removeItem("__zwang");
    if (o.wechselVor) sessionStorage.setItem("__wechselVor", o.wechselVor);
    if (o.ohneNeuladen) sessionStorage.setItem("__ohneNeuladen", "1"); }, { wechselVor: (o.wechselVor || "").replace("{V}", V), ohneNeuladen: Boolean(o.ohneNeuladen), zwang: Boolean(o.zwang) });
  let blaseVorher = null;
  if (o.bekannt) {
    /* die Seite im Raum hat die neue Fassung schon gesehen: der Wächter prüft beim Sichtbarwerden → Blase */
    S.seite = V1;
    await pg.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
    blaseVorher = await pg.waitForFunction(() => document.getElementById("dmaNeueFassung"), null, { timeout: 5000 }).then(() => true, () => false);
    await schlaf(400);
  }
  S.seite = V1; S.stau = o.D; S.fjStau = o.fjD != null ? o.fjD : o.D; S.fjArt = o.fjArt || ""; S.zwang = o.zwang ? {} : null;
  if (o.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: o.cpu });
  const t0 = Date.now();
  if (o.art === "goto") await pg.goto(hier + "/index.html" + q, { waitUntil: "commit" }).catch(() => {});
  else await pg.reload({ waitUntil: "commit" }).catch(() => {});
  /* Teil T: ein Tipp, bevor die Antwort da ist (Prüfer: nach 1,2 s; das Klassenzimmer ist dabei nicht offen) */
  if (o.tipp != null) { await schlaf(Math.max(0, o.tipp - (Date.now() - t0))); await pg.touchscreen.tap(200, 500).catch(() => {}); }
  const bis = Date.now() + (o.warten || 9000);
  let l = null;
  while (Date.now() < bis) {
    await schlaf(250);
    l = await pg.evaluate(() => ({ b: JSON.parse(sessionStorage.getItem("__b") || "[]"), s: Number(sessionStorage.getItem("__s") || 0) })).catch(() => null);
    if (l && l.b.length && Date.now() - l.b[l.b.length - 1].uhr > (o.ruhe || 2500)) break;
  }
  const e = await pg.evaluate(() => ({ f: String(window.DMA_VERSION), seiten: Number(sessionStorage.getItem("__s") || 0),
    marke: document.documentElement.hasAttribute("data-dma-speicher"),
    adressen: JSON.parse(sessionStorage.getItem("__a") || "[]"), betreten: JSON.parse(sessionStorage.getItem("__b") || "[]"),
    tipp: sessionStorage.getItem("__tipp"), stopp: JSON.parse(sessionStorage.getItem("__stopp") || "[]"), app: JSON.parse(sessionStorage.getItem("__app") || "[]"),
    vollWeg: JSON.parse(sessionStorage.getItem("__voll") || "[]"), voll: document.querySelectorAll("link[data-dma-voll-da]").length, vollAlle: document.querySelectorAll("link[data-dma-voll]").length,
    lage: window.LiveChat && window.LiveChat.lage ? window.LiveChat.lage().lage : "?",
    blase: (document.getElementById("dmaNeueFassung") || {}).textContent || "" })).catch((x) => ({ fehler: x.message.split("\n")[0] }));
  await ctx.close();
  e.zwangRaus = S.zwang && S.zwang.raus ? S.zwang.raus - t0 : null; S.zwang = null;
  e.V = V; e.V1 = V1; e.gesteuert = gesteuert; e.t0 = t0; e.blaseVorher = blaseVorher;
  e.abNeuladen = e.betreten && e.betreten.length ? e.betreten[0].uhr - t0 : null;
  ERG.laeufe.push(Object.assign({ teil: o.teil, wurzel: sv.wurzel }, o, e)); schreiben();
  return e;
}
lauf.k = 0;
/* grobe Zeitgrenze für betreten ab dem Neuladen (Nachbesserung 1) */
const grenze = (fa) => fa.D + (fa.cpu > 1 ? 1800 : 900);
const zeile = (e) => "Fassung " + e.V + "→" + e.V1 + " am Ende " + e.f + ", Seiten " + e.seiten + ", betreten " + JSON.stringify((e.betreten || []).map((b) => b.seite + ":" + b.t + "ms/" + b.f))
  + ", ab Neuladen " + e.abNeuladen + " ms, Blase " + JSON.stringify(e.blase) + (e.gesteuert ? "" : ", OHNE Helfer") + (e.marke ? ", aus dem Speicher" : ", frisch")
  + (e.blaseVorher != null ? ", Blase vorher " + e.blaseVorher : "");

(async () => {
  console.log("SONDE 885 — Rückkehr nach dem Neuladen   WURZEL " + WURZEL + " (Fassung " + grund(WURZEL) + ")" + (GEGEN ? "   GEGEN " + GEGEN : ""));
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--no-proxy-server", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1"] });
  const sv = await serverBauen(WURZEL);

  if (NUR.includes("R")) {
    abschnitt("R", "Rückkehr bei Update: am Ende die neue Fassung, betreten nur auf der neuen Seite");
    const faelle = [{ cpu: 1, D: 250 }, { cpu: 1, D: 800 }, { cpu: 4, D: 250 }, { cpu: 4, D: 800 }, { cpu: 1, D: 250, art: "goto" }];
    for (const fa of faelle) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, Object.assign({ teil: "R", update: true, art: "reload" }, fa));
      const b = e.betreten || [];
      /* höchstens ein Neuladen (aus dem Speicher: die alte Seite, dann die neue; frisch aus dem Netz: gleich die neue) */
      const gut = e.f === e.V1 && e.seiten <= 2 && b.length === 1 && b[0].seite === e.seiten && b[0].f === e.V1 && !e.blase && e.gesteuert;
      sage(gut, "R CPU " + fa.cpu + "× D=" + fa.D + " " + (fa.art || "reload") + " Lauf " + (n + 1) + ": neue Fassung, höchstens ein Neuladen, betreten einmal und nur auf der neuen Seite", zeile(e));
      /* Nachbesserung 1: grobe Zeitgrenze (884 brauchte hier höchstens ~D + 0,3 s bei CPU 1×, ~D + 0,9 s bei CPU 4×) –
         fängt jedes Warten auf eine Frist (6 s, 15 s) ab; die feine Messung ist Teil M */
      sage(e.abNeuladen != null && e.abNeuladen <= grenze(fa), "R CPU " + fa.cpu + "× D=" + fa.D + " " + (fa.art || "reload") + " Lauf " + (n + 1) + ": betreten nach höchstens " + grenze(fa) + " ms", e.abNeuladen + " ms");
      /* Fassung 886: hat der Helfer die alte Seite vor DOMContentLoaded ersetzt, schrieb ihr pagehide „dma-mess-abbruch“
         (messung.js zählte das als abgebrochenes Laden) – die neue Seite räumt diesen Eintrag weg */
      const ab = b.length ? b[0].abbruch : null;
      sage(!ab || JSON.parse(ab).f !== e.V, "R CPU " + fa.cpu + "× D=" + fa.D + " " + (fa.art || "reload") + " Lauf " + (n + 1) + ": kein falscher Abbruch-Eintrag der ersetzten Seite (messung.js)", "dma-mess-abbruch " + (ab || "–"));
      /* Fassung 886: solange der Helfer entscheidet, hängt die alte Seite die ganzen Stilblätter (und spiel.js) nicht ein – ihr
         Lesen hielt den Wechsel auf die neue Seite bis ~0,25 s auf (CPU 4×); die neue Seite hat sie am Ende alle */
      const alt = (e.vollWeg || []).find((x) => x.seite === 1);
      if (e.seiten === 2 && (fa.art || "reload") === "reload" && alt) sage(alt.voll === 0, "R CPU " + fa.cpu + "× D=" + fa.D + " Lauf " + (n + 1) + ": die ersetzte Seite hängte keine ganzen Stilblätter ein", "eingehängt " + alt.voll);
      sage(e.voll > 0 && e.voll === e.vollAlle, "R CPU " + fa.cpu + "× D=" + fa.D + " " + (fa.art || "reload") + " Lauf " + (n + 1) + ": am Ende alle ganzen Stilblätter da", e.voll + " von " + e.vollAlle);
    }
  }

  if (NUR.includes("K")) {
    abschnitt("K", "Update schon bekannt (Blase vor dem Neuladen): die Seite kommt wie bis 884 aus dem Netz, kein zweites Laden");
    for (const fa of [{ cpu: 1, D: 250 }, { cpu: 4, D: 250 }]) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, Object.assign({ teil: "K", update: true, bekannt: true, art: "reload" }, fa));
      const b = e.betreten || [];
      sage(e.blaseVorher === true && e.f === e.V1 && e.seiten === 1 && b.length === 1 && b[0].f === e.V1 && !e.blase && !e.marke,
        "K CPU " + fa.cpu + "× D=" + fa.D + " Lauf " + (n + 1) + ": neue Fassung frisch aus dem Netz, ein Laden, betreten einmal", zeile(e));
    }
    /* frisch aus dem Netz wartet die Rückkehr nicht auf fassung.json (die hängt hier ganz) */
    const e = await lauf(br, sv, { teil: "K", update: true, bekannt: true, art: "reload", cpu: 1, D: 250, fjArt: "haengt", warten: 8000, ruhe: 1500 });
    const b = e.betreten || [];
    sage(e.f === e.V1 && e.seiten === 1 && b.length === 1 && b[0].t < 3000 && !e.marke, "K frisch aus dem Netz, fassung.json hängt: betreten wartet nicht (< 3 s)", zeile(e));
  }

  if (NUR.includes("G")) {
    abschnitt("G", "Rückkehr ohne Update: betreten einmal, kein Neuladen");
    for (const fa of [{ cpu: 1, D: 250 }, { cpu: 4, D: 800 }]) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, Object.assign({ teil: "G", update: false, art: "reload" }, fa));
      const b = e.betreten || [];
      sage(e.f === e.V && e.seiten === 1 && b.length === 1 && !e.blase && e.gesteuert, "G CPU " + fa.cpu + "× D=" + fa.D + " Lauf " + (n + 1) + ": betreten einmal, kein Neuladen, keine Blase", zeile(e));
      sage(e.voll > 0 && e.voll === e.vollAlle, "G CPU " + fa.cpu + "× D=" + fa.D + " Lauf " + (n + 1) + ": die ganzen Stilblätter sind da (nach der Antwort des Helfers)", e.voll + " von " + e.vollAlle);
      sage(e.abNeuladen != null && e.abNeuladen <= grenze(fa), "G CPU " + fa.cpu + "× D=" + fa.D + " Lauf " + (n + 1) + ": betreten nach höchstens " + grenze(fa) + " ms", e.abNeuladen + " ms");
    }
  }

  if (NUR.includes("F")) {
    abschnitt("F", "fassung.json mit Fehler oder hängend (Nachbesserung 1: der Helfer weiß beim Neuladen, welche Fassung der Server hat)");
    {
      /* bis zur Nachbesserung: hinein auf der ALTEN Seite, kein Neuladen (der Wächter wusste nichts). Jetzt wie 884: die neue */
      const e = await lauf(br, sv, { teil: "F", update: true, art: "reload", cpu: 1, D: 250, fjD: 0, fjArt: "500" });
      const b = e.betreten || [];
      sage(e.f === e.V1 && e.seiten <= 2 && b.length === 1 && b[0].f === e.V1 && b[0].seite === e.seiten && e.abNeuladen < 3000 && e.gesteuert,
        "F fassung.json 500, Update: betreten einmal auf der NEUEN Fassung (< 3 s) – wie 884", zeile(e));
    }
    {
      const e = await lauf(br, sv, { teil: "F", update: true, art: "reload", cpu: 1, D: 250, fjArt: "haengt", warten: 8000, ruhe: 1500 });
      const b = e.betreten || [];
      sage(e.f === e.V1 && e.seiten <= 2 && b.length === 1 && b[0].f === e.V1 && e.abNeuladen < 3000 && e.gesteuert,
        "F fassung.json hängt, Update: betreten einmal auf der NEUEN Fassung (< 3 s)", zeile(e));
    }
    {
      /* ohne Update: der Helfer hat beim Neuladen dieselbe Fassung vom Server – nicht auf fassung.json warten (884: sofort) */
      const e = await lauf(br, sv, { teil: "F", update: false, art: "reload", cpu: 1, D: 250, fjArt: "haengt", warten: 8000, ruhe: 1500 });
      const b = e.betreten || [];
      sage(e.seiten === 1 && b.length === 1 && e.abNeuladen < 3000 && e.gesteuert, "F fassung.json hängt, ohne Update: hinein ohne auf fassung.json zu warten (< 3 s), kein Neuladen", zeile(e));
    }
    {
      /* index.html UND fassung.json hängen: niemand weiß etwas – hinein nach der Frist (6 s ab dem Öffnen), kein Neuladen */
      const e = await lauf(br, sv, { teil: "F", update: true, art: "reload", cpu: 1, D: 30000, fjArt: "haengt", warten: 11000, ruhe: 1500 });
      const b = e.betreten || [];
      sage(e.seiten === 1 && b.length === 1 && b[0].t >= 5500 && b[0].t <= 7500 && e.gesteuert, "F index.html und fassung.json hängen: hinein nach der Frist (6 s ab dem Öffnen), kein Neuladen", zeile(e));
    }
  }

  if (NUR.includes("T")) {
    /* Prüfer (Nachbesserung 1): ein Tipp, bevor die erste Antwort da ist – bleiben() hielt die Seite dann wegen „eingabe && > 2 s“
       an, nur die Blase, und die Rückkehr ging auf der ALTEN Fassung hinein (für die ganze Sitzung). */
    abschnitt("T", "Tipp während des Wartens (Update, Antwort nach > 2 s): trotzdem die neue Fassung");
    const faelle = [
      { cpu: 1, D: 2500, tipp: 1200, wer: "Helfer weiß es (index.html und fassung.json je 2,5 s)" },
      { cpu: 4, D: 2500, tipp: 1200, wer: "Helfer weiß es (index.html und fassung.json je 2,5 s)" },
      /* index.html später als fassung.json: hier entscheidet der Wächter (bleiben) */
      { cpu: 1, D: 4500, fjD: 2500, tipp: 1200, wer: "Wächter entscheidet (fassung.json 2,5 s, index.html 4,5 s)" },
      { cpu: 4, D: 4500, fjD: 2500, tipp: 1200, wer: "Wächter entscheidet (fassung.json 2,5 s, index.html 4,5 s)" }
    ];
    for (const fa of faelle) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, Object.assign({ teil: "T", update: true, art: "reload", warten: 14000 }, fa));
      const b = e.betreten || [];
      sage(e.tipp != null && e.f === e.V1 && b.length === 1 && b[0].f === e.V1 && !e.blase && e.gesteuert,
        "T CPU " + fa.cpu + "× " + fa.wer + ", Tipp nach " + fa.tipp + " ms, Lauf " + (n + 1) + ": am Ende die neue Fassung, betreten einmal, keine Blase", zeile(e) + ", Tipp bei " + e.tipp + " ms");
    }
  }

  if (NUR.includes("Z")) {
    /* FASSUNG 886 (Auftrag: „nie langsamer als 884“): die Antwort des Servers kommt genau dann, wenn die alte Seite (aus
       dem Speicher) ihre Skripte ausführt (livechat.js läuft). Bis 886 kam der Wechsel erst, nachdem der Helfer die neue Seite
       abgelegt und wieder gelesen hatte – bis dahin war die alte Seite in app.js, und der Wechsel wartete, bis ihr Hauptfaden
       frei war (gemessen bis ~0,45 s bei CPU 4×). Jetzt entscheidet der Helfer, sobald er die Antwort gelesen hat, und
       liefert die neue Seite aus dem Gedächtnis; die alte Seite hängt die ganzen Stilblätter erst nach der Entscheidung ein. */
    abschnitt("Z", "Antwort des Servers, während die alte Seite ihre Skripte ausführt: Wechsel auf die neue, einmal hinein, nichts Halbes");
    for (const cpu of [4, 1]) for (let n = 0; n < N; n++) {
      /* fassung.json erst nach 3 s: sonst lädt der Wächter selbst neu, bevor die alte Seite fertig gelesen hat */
      const e = await lauf(br, sv, { teil: "Z", update: true, art: "reload", cpu, D: 0, fjD: 3000, zwang: true });
      const b = e.betreten || [], app = e.app || [];
      const alt = app.filter((x) => x.seite === 1 && e.seiten > 1);
      sage(e.f === e.V1 && e.seiten <= 2 && b.length === 1 && b[0].f === e.V1 && b[0].seite === e.seiten && !e.blase,
        "Z CPU " + cpu + "× Lauf " + (n + 1) + ": neue Fassung, höchstens ein Neuladen, betreten einmal auf der neuen Seite", zeile(e) + ", Antwort nach " + e.zwangRaus + " ms");
      /* Ob app.js auf der alten Seite noch anläuft, hängt am Zufall der Reihenfolge (ob der Browser zwischen den Skripten eine
         Lücke lässt; CPU 4× 1 von 8, CPU 1× 2 von 4 Läufen) – nur mitgeschrieben. Geprüft wird, was sicher gelten muss: die alte
         Seite hat keine ganzen Stilblätter eingehängt (I48), die neue am Ende alle. */
      info("Z CPU " + cpu + "× Lauf " + (n + 1) + ": app.js auf Seite " + JSON.stringify(app.map((x) => x.seite + ":" + x.t + "ms")) + " (nicht geprüft)");
      /* ohne alte Seite (884: die Seite kommt aus dem Netz, der Server hält sie bis 2 s) gilt nur „am Ende alle“ */
      const vollAlt = e.seiten === 2 ? (e.vollWeg || []).find((x) => x.seite === 1) : { voll: 0 };
      sage(vollAlt && vollAlt.voll === 0 && e.voll > 0 && e.voll === e.vollAlle, "Z CPU " + cpu + "× Lauf " + (n + 1) + ": eine ersetzte Seite hängte keine ganzen Stilblätter ein, die letzte hat am Ende alle",
        "ersetzt " + (e.seiten === 2 ? (vollAlt ? vollAlt.voll : "–") : "keine") + ", am Ende " + e.voll + " von " + e.vollAlle);
      const ab = b.length ? b[0].abbruch : null;
      sage(!ab || JSON.parse(ab).f !== e.V, "Z CPU " + cpu + "× Lauf " + (n + 1) + ": kein falscher Abbruch-Eintrag", "dma-mess-abbruch " + (ab || "–"));
    }
  }

  if (NUR.includes("W")) {
    /* Merker dma-wechsel: nur jünger als 20 s gilt die Seite als frisch (Öffnen, damit die Antwort des Helfers nicht zählt;
       fassung.json hängt – ohne Merker wartet die Rückkehr also bis zur Frist von 6 s) */
    abschnitt("W", "Merker dma-wechsel (Seite eben vom Wächter oder Helfer geladen): jünger als 20 s frisch, älter nicht");
    const faelle = [
      { vor: "f|5000|{V}", frisch: true, was: "Fassung, 5 s alt" },
      { vor: "f|25000|{V}", frisch: false, was: "Fassung, 25 s alt" },
      { vor: "*|5000|1", frisch: true, was: "„*“ (Helfer) mit älterer Fassung, 5 s alt" },
      { vor: "*|5000|{V}", frisch: false, was: "„*“ mit DIESER Fassung (nicht neu geladen), 5 s alt" },
      { vor: "*|25000|1", frisch: false, was: "„*“ mit älterer Fassung, 25 s alt" }
    ];
    for (const fa of faelle) {
      const e = await lauf(br, sv, { teil: "W", update: false, art: "goto", cpu: 1, D: 250, fjArt: "haengt", wechselVor: fa.vor, warten: 11000, ruhe: 1500 });
      const b = e.betreten || [];
      const t = b.length ? b[0].t : null;
      sage(e.seiten === 1 && b.length === 1 && (fa.frisch ? t < 3000 : t >= 5500 && t <= 7500),
        "W Merker " + fa.was + ": " + (fa.frisch ? "frisch, hinein ohne zu warten (< 3 s)" : "nicht frisch, hinein erst nach der Frist (6 s)"), zeile(e));
    }
  }

  if (NUR.includes("N")) {
    /* „neu“, aber die Seite bleibt (das Neuladen des Wächters wird abgebrochen, der Helfer bekommt keine Meldung): nach 15 s
       doch hinein, genau einmal, auf dieser Seite */
    abschnitt("N", "Antwort „neu“, aber das Neuladen scheitert: nach 15 s doch hinein");
    const e = await lauf(br, sv, { teil: "N", update: true, art: "reload", cpu: 1, D: 250, ohneNeuladen: true, warten: 22000, ruhe: 2500 });
    const b = e.betreten || [];
    const st = (e.stopp || [])[0];
    sage(st != null && e.seiten === 1 && e.f === e.V && b.length === 1 && b[0].t - st >= 14500 && b[0].t - st <= 17000,
      "N Neuladen abgebrochen: betreten einmal auf dieser Seite, 15 s nach der Antwort (die Blase darf stehen: draußen liegt eine neuere)", zeile(e) + ", abgebrochen bei " + st + " ms, betreten " + (b.length ? b[0].t - (st || 0) : "–") + " ms danach");
  }

  if (NUR.includes("O")) {
    abschnitt("O", "ohne Helfer: kein Warten (die Seite kommt frisch aus dem Netz)");
    const e = await lauf(br, sv, { teil: "O", update: false, helfer: false, art: "reload", cpu: 1, D: 250, fjArt: "haengt", warten: 8000, ruhe: 1500 });
    const b = e.betreten || [];
    sage(!e.gesteuert && e.seiten === 1 && b.length === 1 && b[0].t < 3000, "O ohne Helfer, Neuladen, fassung.json hängt: betreten wartet nicht (< 3 s)", zeile(e));
    /* gewöhnliches Öffnen ohne Helfer: index.html kommt aus dem Speicher des Browsers (max-age=600) – kann alt sein */
    for (let n = 0; n < N; n++) {
      const e2 = await lauf(br, sv, { teil: "O", update: true, helfer: false, art: "goto", cpu: 1, D: 250 });
      const b2 = e2.betreten || [];
      sage(!e2.gesteuert && e2.f === e2.V1 && e2.seiten <= 2 && b2.length === 1 && b2[0].seite === e2.seiten && !e2.blase,
        "O ohne Helfer, Öffnen (alte index.html aus dem Browser-Speicher), Update: betreten einmal, erst auf der neuen Seite", zeile(e2));
    }
  }

  if (NUR.includes("S")) {
    abschnitt("S", "Stempel ↔ Inhalt im Speicher des Helfers");
    const { S, hier } = sv;
    S.seite = ""; S.stau = 0; S.fjStau = 0; S.fjArt = ""; S.anders = {};
    const ctx = await br.newContext();
    const pg = await ctx.newPage();
    await pg.goto(hier + "/index.html?mit-sw", { waitUntil: "load" });
    await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
    await pg.goto(hier + "/index.html?mit-sw", { waitUntil: "load" });
    await schlaf(1500);
    const st = await pg.evaluate(() => window.DMA_STEMPEL || {});
    {
      /* Prüfer (Nachbesserung 1): index.html schreibt „draussen“ in den Seitenspeicher des Helfers; der Name steht dort fest */
      const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8"), sw = fs.readFileSync(path.join(WURZEL, "sw.js"), "utf8");
      const a = (/caches\.open\("([^"]+)"\)\.then\(function \(k\) \{ return k\.put\(new URL\("draussen"/.exec(html) || [])[1], b = (/var SEITE = "([^"]+)";/.exec(sw) || [])[1];
      sage(a && a === b, "S index.html schreibt „draussen“ in genau den Seitenspeicher des Helfers (SEITE in sw.js)", "index.html " + a + ", sw.js " + b);
    }
    {
      const m = await pg.evaluate(async () => { const k = await caches.open("dma-seite-1"); const r = await k.match("seite"); const t = r ? await r.text() : "";
        return { gespeichert: /<html[^>]*data-dma-speicher/.test(t), diese: document.documentElement.hasAttribute("data-dma-speicher") }; });
      sage(m.gespeichert && !m.diese, "S die gespeicherte Seite trägt die Marke data-dma-speicher, die frisch geholte nicht", JSON.stringify(m));
    }
    const szene = fs.readdirSync(path.join(WURZEL, "szenen")).filter((n) => /\.js$/.test(n)).sort()[0];
    const holen = (u) => pg.evaluate(async (u) => {
      const t = await fetch(u).then((a) => a.text(), () => "");
      await new Promise((r) => setTimeout(r, 700));
      const k = await caches.open("dma-dateien-1");
      const da = await k.match(u);
      return { anders: /anders: neuer Inhalt/.test(t), laenge: t.length, abgelegt: Boolean(da), gespeichertAnders: da ? /anders: neuer Inhalt/.test(await da.text()) : null };
    }, u);
    const dl = "min/data-logik.js?v=" + st["min/data-logik.js"];
    S.anders = { "/min/data-logik.js": true };
    const a1 = await holen(dl);
    sage(a1.anders && !a1.abgelegt, "S anderer Inhalt unter dem Datei-Stempel: an die Seite, NICHT in den Speicher", JSON.stringify(a1));
    S.anders = {};
    const z0 = S.zaehler["/min/data-logik.js"] || 0;
    const a2 = await holen(dl);
    sage(!a2.anders && a2.abgelegt && a2.gespeichertAnders === false, "S richtiger Inhalt: abgelegt", JSON.stringify(a2));
    const a3 = await holen(dl);
    sage(!a3.anders && (S.zaehler["/min/data-logik.js"] || 0) === z0 + 1, "S danach aus dem Speicher (der Server sieht die Datei nicht noch einmal)", "Server-Abrufe nach dem Wechsel: " + ((S.zaehler["/min/data-logik.js"] || 0) - z0));
    const sz = await holen("szenen/" + szene + "?v=" + st["szenen/"]);
    sage(sz.abgelegt, "S Ordner-Stempel (szenen/" + szene + "): wie bisher abgelegt", JSON.stringify(sz));
    const fv = await holen("manifest.webmanifest?v=" + grund(WURZEL));
    sage(fv.abgelegt, "S ?v=<Fassung> (manifest.webmanifest): wie bisher abgelegt", JSON.stringify(fv));
    await ctx.close();
  }

  if (NUR.includes("M") && GEGEN) {
    abschnitt("M", "Messung: Neuladen → betreten, verschränkt (A = GEGEN, B = WURZEL), " + PAARE + " Paare je Fall");
    const sa = await serverBauen(GEGEN);
    /* MFAELLE=u1-250,u4-800,g1-250-goto … (u = Update, k = Update schon bekannt (Blase), g = gleich; CPU; D; -goto = Öffnen
       derselben Adresse statt Neuladen) */
    const faelle = (process.env.MFAELLE || "u1-250,u4-250,u4-800,g1-250,g4-800").split(",").map((x) => {
      const m = /^([ugk])(\d+)-(\d+)(-goto)?$/.exec(x.trim());
      return m ? { update: m[1] !== "g", bekannt: m[1] === "k", cpu: Number(m[2]), D: Number(m[3]), art: m[4] ? "goto" : "reload" } : null;
    }).filter(Boolean);
    for (const fa of faelle) {
      const A = [], B = [], diff = [];
      for (let n = 0; n < PAARE; n++) {
        const reihe = n % 2 ? [["B", sv], ["A", sa]] : [["A", sa], ["B", sv]];
        const r = {};
        for (const [wer, s] of reihe) r[wer] = await lauf(br, s, Object.assign({ teil: "M" }, fa, { wer }));
        A.push(r.A); B.push(r.B);
        if (r.A.abNeuladen != null && r.B.abNeuladen != null) diff.push(r.B.abNeuladen - r.A.abNeuladen);
        ERG.messung.push({ fall: fa, paar: n, A: r.A.abNeuladen, B: r.B.abNeuladen, Af: r.A.f === r.A.V1, Bf: r.B.f === r.B.V1 }); schreiben();
      }
      const neuA = A.filter((e) => e.f === e.V1).length, neuB = B.filter((e) => e.f === e.V1).length;
      const schneller = diff.filter((d) => d < 0).length, langsamer = diff.filter((d) => d > 0).length;
      info((fa.bekannt ? "bekannt  " : fa.update ? "Update   " : "ohne Upd ") + " CPU " + fa.cpu + "× D=" + fa.D + " " + fa.art + ": betreten ab Neuladen A " + med(A.map((e) => e.abNeuladen)) + " ms, B " + med(B.map((e) => e.abNeuladen))
        + " ms, B − A gepaart " + med(diff) + " ms (B schneller " + schneller + ", langsamer " + langsamer + " von " + diff.length + "; Einzel " + JSON.stringify(diff) + "); neue Fassung am Ende A " + neuA + "/" + A.length + ", B " + neuB + "/" + B.length);
    }
    sa.srv.close();
  }

  if (NUR.includes("H") && GEGEN) {
    abschnitt("H", "Helfer füllt seinen Speicher (2. Öffnen, jede gestempelte Datei ein Fehltreffer – wie nach einem Update): Stempel-Prüfung kostet? (A = GEGEN, B = WURZEL)");
    const sa = await serverBauen(GEGEN);
    const A = [], B = [], diff = [];
    for (let n = 0; n < PAARE; n++) {
      const r = {};
      for (const [wer, s] of n % 2 ? [["B", sv], ["A", sa]] : [["A", sa], ["B", sv]]) {
        s.S.seite = ""; s.S.stau = 0; s.S.fjStau = 0; s.S.fjArt = ""; s.S.anders = {};
        const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true });
        const pg = await ctx.newPage(); const cdp = await ctx.newCDPSession(pg);
        await pg.goto(s.hier + "/index.html?mit-sw", { waitUntil: "load" });
        await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
        await schlaf(500);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await pg.goto(s.hier + "/index.html?mit-sw", { waitUntil: "load" });
        await schlaf(4000);
        r[wer] = await pg.evaluate(async () => {
          const nv = performance.getEntriesByType("navigation")[0];
          const k = await caches.open("dma-dateien-1"); const e = (await k.keys()).length;
          return { dcl: Math.round(nv.domContentLoadedEventStart), load: Math.round(nv.loadEventStart), eintraege: e };
        });
        await ctx.close();
      }
      A.push(r.A); B.push(r.B); diff.push(r.B.load - r.A.load);
      ERG.messung.push({ fall: "H", paar: n, A: r.A, B: r.B }); schreiben();
    }
    info("load A " + med(A.map((x) => x.load)) + " ms, B " + med(B.map((x) => x.load)) + " ms, B − A gepaart " + med(diff) + " ms (Einzel " + JSON.stringify(diff) + "); DOMContentLoaded A "
      + med(A.map((x) => x.dcl)) + ", B " + med(B.map((x) => x.dcl)) + "; Einträge im Dateispeicher A " + JSON.stringify(A.map((x) => x.eintraege)) + ", B " + JSON.stringify(B.map((x) => x.eintraege)));
    /* je Lauf nie weniger als vorher (A streut um eins: das Ablegen läuft nach load weiter) */
    sage(B.every((x) => x.eintraege >= Math.max(...A.map((y) => y.eintraege))), "H nie weniger Dateien im Speicher des Helfers als vorher (jede echte Datei passt zu ihrem Stempel)");
    sa.srv.close();
  }

  await br.close(); sv.srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
