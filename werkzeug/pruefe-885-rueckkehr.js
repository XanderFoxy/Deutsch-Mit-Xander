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
        (goto, wie ein verworfener Tab, CPU 1×, D = 250): am Ende die NEUE
        Fassung, genau ein Neuladen, betreten genau EINMAL und erst auf
        der neuen Seite (nie auf der alten), keine Blase.
     K  Update schon bekannt: die Seite im Raum hat die Blase schon gezeigt
        (der Wächter prüft beim Sichtbarwerden), dann Neuladen: der Helfer
        weiß es („draussen“) und holt die Seite wie bis 884 aus dem Netz – am
        Ende die neue Fassung OHNE zweites Laden, betreten einmal, die Seite
        ohne Speicher-Marke; hängt fassung.json, wartet die Rückkehr auf
        dieser frischen Seite nicht (< 3 s).
     G  Rückkehr ohne Update (CPU 1× und 4×, D = 250/800): betreten genau
        einmal, kein Neuladen, keine Blase.
     F  fassung.json antwortet mit 500: sofort hinein (betreten < 3 s, kein
        Neuladen). fassung.json hängt ganz: hinein nach der Frist (6 s ab
        dem Öffnen, nicht früher als 5,5 s, spätestens 7,5 s), kein
        Neuladen.
     O  Ohne Helfer (Seite immer aus dem Netz, wie bis 884), fassung.json
        hängt: betreten wartet NICHT (< 3 s) – dort ist die Seite frisch.
     S  Die gespeicherte Seite trägt die Marke data-dma-speicher (daran
        erkennt die Rückkehr, dass sie aus dem Speicher kam), die frisch
        geholte nicht. Stempel ↔ Inhalt (sw.js): liefert der Server unter einem
        Datei-Stempel einen anderen Inhalt (eine alte Seite holt nach einem
        Update eine Datei, die nicht im Speicher liegt), geht er an die
        Seite, aber NICHT in den Speicher des Helfers; der richtige Inhalt
        wird abgelegt und danach aus dem Speicher geliefert; Ordner-Stempel
        (szenen/) und ?v=<Fassung> werden wie bisher abgelegt.
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
     NUR=RKGFOSM       nur diese Teile
     JSON=<datei>      Ergebnisse (Läufe, Messung) als JSON, laufend
   Aufruf:  node werkzeug/pruefe-885-rueckkehr.js
   Gegenprobe: WURZEL=<ordner mit altem Stand> node …  (c30a68f7: R rot;
   6b724580, vor S1: R grün)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const GEGEN = process.env.GEGEN ? path.resolve(process.env.GEGEN) : null;
const N = Math.max(1, Number(process.env.N || 2));
const PAARE = Math.max(1, Number(process.env.PAARE || 6));
const NUR = process.env.NUR || "RKGFOS" + (GEGEN ? "M" : "");
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
  const S = { seite: "", stau: 0, fjStau: 0, fjArt: "", anders: {}, zaehler: {} };
  const srv = http.createServer((q, a) => {
    const i = q.url.indexOf("?");
    let p = decodeURIComponent(i < 0 ? q.url : q.url.slice(0, i));
    if (!p.startsWith(PRE + "/")) { a.writeHead(404); return a.end(); }
    p = p.slice(PRE.length); if (p === "/") p = "/index.html";
    S.zaehler[p] = (S.zaehler[p] || 0) + 1;
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
    let lc;
    Object.defineProperty(window, "LiveChat", { configurable: true, get: () => lc, set: (v) => {
      lc = v;
      try {
        v.betreten = function () {
          const b = JSON.parse(sessionStorage.getItem("__b") || "[]");
          b.push({ seite: n, t: Math.round(performance.now()), uhr: Date.now(), f: String(window.DMA_VERSION) });
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
  await pg.evaluate(() => { sessionStorage.setItem("__rueck", "1"); sessionStorage.setItem("__s", "0"); sessionStorage.setItem("__a", "[]"); sessionStorage.setItem("__b", "[]"); });
  let blaseVorher = null;
  if (o.bekannt) {
    /* die Seite im Raum hat die neue Fassung schon gesehen: der Wächter prüft beim Sichtbarwerden → Blase */
    S.seite = V1;
    await pg.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
    blaseVorher = await pg.waitForFunction(() => document.getElementById("dmaNeueFassung"), null, { timeout: 5000 }).then(() => true, () => false);
    await schlaf(400);
  }
  S.seite = V1; S.stau = o.D; S.fjStau = o.fjD != null ? o.fjD : o.D; S.fjArt = o.fjArt || "";
  if (o.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: o.cpu });
  const t0 = Date.now();
  if (o.art === "goto") await pg.goto(hier + "/index.html" + q, { waitUntil: "commit" }).catch(() => {});
  else await pg.reload({ waitUntil: "commit" }).catch(() => {});
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
    lage: window.LiveChat && window.LiveChat.lage ? window.LiveChat.lage().lage : "?",
    blase: (document.getElementById("dmaNeueFassung") || {}).textContent || "" })).catch((x) => ({ fehler: x.message.split("\n")[0] }));
  await ctx.close();
  e.V = V; e.V1 = V1; e.gesteuert = gesteuert; e.t0 = t0; e.blaseVorher = blaseVorher;
  e.abNeuladen = e.betreten && e.betreten.length ? e.betreten[0].uhr - t0 : null;
  ERG.laeufe.push(Object.assign({ teil: o.teil, wurzel: sv.wurzel }, o, e)); schreiben();
  return e;
}
lauf.k = 0;
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
      const gut = e.f === e.V1 && e.seiten === 2 && b.length === 1 && b[0].seite === 2 && b[0].f === e.V1 && !e.blase && e.gesteuert;
      sage(gut, "R CPU " + fa.cpu + "× D=" + fa.D + " " + (fa.art || "reload") + " Lauf " + (n + 1) + ": neue Fassung, ein Neuladen, betreten einmal auf der neuen Seite", zeile(e));
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
    }
  }

  if (NUR.includes("F")) {
    abschnitt("F", "fassung.json mit Fehler oder hängend");
    {
      const e = await lauf(br, sv, { teil: "F", update: true, art: "reload", cpu: 1, D: 250, fjD: 0, fjArt: "500" });
      const b = e.betreten || [];
      sage(e.seiten === 1 && b.length === 1 && b[0].t < 3000 && e.gesteuert, "F fassung.json 500: sofort hinein (< 3 s), kein Neuladen", zeile(e));
    }
    {
      const e = await lauf(br, sv, { teil: "F", update: true, art: "reload", cpu: 1, D: 250, fjArt: "haengt", warten: 11000, ruhe: 1500 });
      const b = e.betreten || [];
      sage(e.seiten === 1 && b.length === 1 && b[0].t >= 5500 && b[0].t <= 7500 && e.gesteuert, "F fassung.json hängt: hinein nach der Frist (6 s ab dem Öffnen), kein Neuladen", zeile(e));
    }
  }

  if (NUR.includes("O")) {
    abschnitt("O", "ohne Helfer: kein Warten (die Seite kommt frisch aus dem Netz)");
    const e = await lauf(br, sv, { teil: "O", update: false, helfer: false, art: "reload", cpu: 1, D: 250, fjArt: "haengt", warten: 8000, ruhe: 1500 });
    const b = e.betreten || [];
    sage(!e.gesteuert && e.seiten === 1 && b.length === 1 && b[0].t < 3000, "O ohne Helfer, fassung.json hängt: betreten wartet nicht (< 3 s)", zeile(e));
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

  await br.close(); sv.srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
