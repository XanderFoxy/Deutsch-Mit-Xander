#!/usr/bin/env node
/* =====================================================================
   SONDE 885 — S1: DIE SEITE ZUERST AUS DEM SPEICHER (stale-while-
   revalidate im Service Worker; Ladezeit-Entwurf S1, freigegeben Funk 311)
   ---------------------------------------------------------------------
   XANDER (Funk 263): „sofort im Livestream wie bei HelloTalk" · (Funk
   271): „alles insgesamt nur zehn Mal schneller" · (Funk 310/312): „das
   Maximum rausholen", „die maximal professionellste Lösung".

   Der Server dieser Sonde schreibt jede Anfrage mit (Pfad, Vorab-Kopf,
   Cache-Control der Anfrage) und kann: die Fassung in index.html und in
   fassung.json getrennt umstellen (ein Update, auch ein halbes wie bei
   einem Server, der fassung.json schon neu, index.html noch alt
   ausliefert), /index.html abbrechen (Funkloch) oder verzögern (Stau),
   fassung.json verzögern und index.html mit max-age=600 schicken (wie
   GitHub Pages – der Browser hebt sie dann 10 min selbst auf).
   Jede ausgelieferte index.html trägt eine Marke „n<Nummer der Anfrage>".

   Geprüft:
     A  Grundlage: das erste Öffnen mit Helfer holt die Seite aus dem Netz
        und speichert sie MIT Fassung und Zeit (x-dma-fassung, x-dma-zeit).
     B  Zuerst aus dem Speicher: Netz langsam (3 s) → die gespeicherte
        Seite kommt sofort (< 1,5 s), je Öffnen genau EINE Anfrage
        (die Vorab-Anfrage), der Speicher wird dahinter aufgefrischt;
        Funkloch und Stau (9 s): sofort die gespeicherte Seite, sie läuft,
        die späte Antwort landet im Speicher.
     C  Update (Netz 400 ms – langsamer als der Helfer, also zuerst die
        gespeicherte Seite): genau EIN Neuladen, am Ende die neue Fassung;
        die neue Seite kommt aus der Auffrischung (Marke der ersten
        Anfrage) – keine zweite Rundreise; danach kein weiteres Neuladen.
     D  Kein Neulade-Kreis, wenn fassung.json schon neu und index.html noch
        alt ist (Netz 400 ms): ein Neuladen, dann die Blase, kein drittes
        Laden.
     E  Nie rückwärts: der Browser hat eine ältere index.html selbst
        aufgehoben (max-age) – der Speicher bleibt neu, das nächste Öffnen
        zeigt gleich die neue Fassung (ohne Neuladen).
     F  Rücknahme auf dem Server (Fassung wieder kleiner) kommt an:
        spätestens beim zweiten Öffnen die zurückgenommene Fassung, nie
        mehr als ein Neuladen je Öffnen.
     G  Alte Adresse ?f=<ältere Fassung> (der Browser öffnet sie wieder):
        die gespeicherte Seite, sofort, kein Neuladen.
     H  Gespeicherte Seite älter als 12 h: zuerst das Netz (wie bis 884).
        Seite aus der Zeit vor S1 (ohne eigene Köpfe, Datum frisch): sofort
        aus dem Speicher, danach mit Köpfen.
     I  Schwaches Telefon (der Helfer rechnet beim Aufwachen 400 ms, die
        Zeile steht vorn in sw.js): hat das Netz schon geantwortet, kommt
        die FRISCHE Seite – nach einem Update also ohne Neuladen; ist die
        frische Antwort älter als die gespeicherte (aus dem Browser-
        Speicher, max-age), kommt die gespeicherte.
     K  Fassungs-Wächter (index.html, ohne Helfer): kommt die Antwort
        „neue Fassung" erst, wenn das Klassenzimmer offen ist, man im Raum
        ist (LiveChat „drin") oder etwas tippt → KEIN Neuladen, die Blase
        „Neue Fassung" erscheint. Gegenprobe ohne diese Lage: ein Neuladen.
   Die Sonden 885-swvorladen (Vorab-Laden, andere Seiten, ?ohne-sw,
   fassung.json frisch, Gestempeltes aus dem Speicher) und 694 laufen
   getrennt.

   Aufruf:  node werkzeug/pruefe-885-schale.js
   Gegenprobe: WURZEL=<ordner mit altem index.html und sw.js> node …
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".mp3": "audio/mpeg", ".woff2": "font/woff2" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const GRUND = (fs.readFileSync(path.join(WURZEL, "index.html"), "utf8").match(/window\.DMA_VERSION = "(\d+)"/) || [])[1];
if (!GRUND) { console.error("DMA_VERSION nicht gefunden"); process.exit(2); }
const F = (k) => String(Number(GRUND) + k);

(async () => {
  /* ---------- Server ---------- */
  const anfragen = [];
  const S = { seite: "", fj: "", index: "", stauMs: 0, fjStau: 0, maxAge: false, swWach: 0 };
  let nr = 0;
  const srv = http.createServer((q, a) => {
    const i = q.url.indexOf("?");
    let p = decodeURIComponent(i < 0 ? q.url : q.url.slice(0, i)); if (p === "/") p = "/index.html";
    const eintrag = { p, url: q.url, vorab: q.headers["service-worker-navigation-preload"] || "", cc: q.headers["cache-control"] || "", t: Date.now() };
    anfragen.push(eintrag);
    if (p === "/index.html" && S.index === "aus") { q.socket.destroy(); return; }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    let body = fs.readFileSync(f);
    const kopf = { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream" };
    if (p === "/index.html") {
      eintrag.marke = "n" + (++nr);
      let t = String(body).replace("<head>", "<head><!-- SONDE-MARKE:" + eintrag.marke + " -->");
      if (S.seite) t = t.replace(/window\.DMA_VERSION = "[^"]*";/, 'window.DMA_VERSION = "' + S.seite + '";');
      body = Buffer.from(t);
      kopf["Cache-Control"] = S.maxAge ? "max-age=600" : "no-cache";
      if (S.index === "stau") return setTimeout(() => { if (!a.destroyed) { a.writeHead(200, kopf); a.end(body); } }, S.stauMs);
    }
    if (p === "/fassung.json") {
      kopf["Cache-Control"] = "no-cache";
      const v = S.fj || S.seite;
      if (v) body = Buffer.from(JSON.stringify({ fassung: v, stand: "sonde" }));
      if (S.fjStau) return setTimeout(() => { if (!a.destroyed) { a.writeHead(200, kopf); a.end(body); } }, S.fjStau);
    }
    if (p === "/sw.js") {
      kopf["Cache-Control"] = "no-cache";
      if (S.swWach) body = Buffer.concat([Buffer.from("(function(){var t=Date.now();while(Date.now()-t<" + S.swWach + "){}})();\n"), body]);
    }
    a.writeHead(200, kopf); a.end(body);
  }).listen(0, "127.0.0.1");
  await new Promise((r) => srv.on("listening", r));
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--no-proxy-server", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1"] });

  /* Ein Gerät (Kontext) mit Zähler je Tab: wie viele Seiten (Dokumente) hintereinander geladen wurden */
  const geraet = async () => {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await ctx.addInitScript(() => {
      if (window.top !== window) return;
      try {
        localStorage.setItem("dma_tour_seen", "1");
        const n = Number(sessionStorage.getItem("__sondeSeiten") || 0) + 1;
        sessionStorage.setItem("__sondeSeiten", String(n));
        const l = JSON.parse(sessionStorage.getItem("__sondeAdressen") || "[]"); l.push(location.pathname + location.search); sessionStorage.setItem("__sondeAdressen", JSON.stringify(l));
      } catch (e) {}
    });
    const seitenfehler = [];
    const neuerTab = async () => {
      const pg = await ctx.newPage();
      pg.on("pageerror", (e) => seitenfehler.push(String(e.message || e).slice(0, 120)));
      const cdp = await ctx.newCDPSession(pg);
      await cdp.send("ServiceWorker.enable").catch(() => {});
      return { pg, cdp };
    };
    return { ctx, neuerTab, seitenfehler };
  };
  const indexAb = (ab) => anfragen.slice(ab).filter((x) => x.p === "/index.html");
  const ersteIndex = (ab) => { const i = indexAb(ab)[0]; return i ? i.t : Date.now(); };
  const bis = async (pg, f, ms, arg) => { const ende = Date.now() + ms; while (Date.now() < ende) { if (await pg.evaluate(f, arg).catch(() => false)) return true; await schlaf(100); } return false; };
  const gespeichert = (pg) => pg.evaluate(async () => {
    const k = await caches.open("dma-seite-1"); const r = await k.match("seite");
    if (!r) return null;
    const t = await r.text(), m = t.match(/SONDE-MARKE:(\w+)/), v = t.match(/window\.DMA_VERSION = "([^"]*)"/);
    return { marke: m ? m[1] : null, fassung: v ? v[1] : null, kopfFassung: r.headers.get("x-dma-fassung"), kopfZeit: Number(r.headers.get("x-dma-zeit")) || null };
  }).catch((e) => ({ fehler: e.message }));
  const lage = (pg) => pg.evaluate(() => ({
    marke: (document.head && document.head.innerHTML.match(/SONDE-MARKE:(\w+)/) || [])[1] || null, fassung: String(window.DMA_VERSION || ""),
    seiten: Number(sessionStorage.getItem("__sondeSeiten") || 0), adressen: JSON.parse(sessionStorage.getItem("__sondeAdressen") || "[]"),
    blase: (document.getElementById("dmaNeueFassung") || {}).textContent || "", url: location.pathname + location.search,
  })).catch((e) => ({ fehler: e.message.split("\n")[0] }));
  /* nebenbei: ein Tab auf einer kleinen Datei derselben Herkunft (für den Speicher des Helfers), danach zu */
  const nebenbei = async (G, f) => {
    const t = await G.neuerTab();
    await t.pg.goto(HIER + "/fassung.json?sonde=" + Date.now(), { waitUntil: "load" }).catch(() => {});
    const r = await f(t.pg); await t.pg.close(); return r;
  };
  const schlafen = async (cdp) => { await cdp.send("ServiceWorker.stopAllWorkers").catch(() => {}); await schlaf(300); };
  /* öffnen: neuer Tab, Zeit bis die Antwort da ist (commit) */
  const oeffnen = async (G, adresse, o = {}) => {
    const { pg, cdp } = await G.neuerTab();
    if (o.schlafen) await schlafen(cdp);
    const ab = anfragen.length, t0 = Date.now();
    const r = await pg.goto(HIER + adresse, { waitUntil: "commit", timeout: 30000 }).then(() => true, (e) => e.message.split("\n")[0]);
    return { pg, cdp, ab, ms: Date.now() - t0, ok: r };
  };
  const zu = async (x) => { await x.pg.close().catch(() => {}); };
  const laeuft = (pg, ms) => pg.waitForFunction(() => window.LiveChat && document.querySelector('.tape-tab[data-target="view-knowledge"]'), null, { timeout: ms || 20000 }).then(() => true, () => false);

  console.log("\nSONDE 885 — S1: die Seite zuerst aus dem Speicher   (Stand: " + WURZEL + ", Fassung " + GRUND + ")\n");

  /* ================= A, B, C, D, E, F, G, H: ein Gerät mit Helfer ================= */
  const G = await geraet();
  {
    /* A: anmelden, dann das erste Öffnen über den Helfer */
    const x0 = await oeffnen(G, "/index.html?mit-sw");
    await x0.pg.waitForLoadState("load").catch(() => {});
    const an = await x0.pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).then(() => true, () => false);
    sage(an, "A  sw.js führt die Seite (?mit-sw)");
    await zu(x0);
    const x1 = await oeffnen(G, "/index.html?mit-sw");
    await x1.pg.waitForLoadState("load").catch(() => {});
    await schlaf(800);
    const g1 = await gespeichert(x1.pg), l1 = await lage(x1.pg);
    sage(g1 && g1.marke === l1.marke && g1.fassung === GRUND, "A  das erste Öffnen über den Helfer speichert die Seite", JSON.stringify({ seite: l1.marke, speicher: g1 }));
    sage(g1 && g1.kopfFassung === GRUND && g1.kopfZeit && Math.abs(Date.now() - g1.kopfZeit) < 60000, "A  … mit Fassung und Zeit (x-dma-fassung, x-dma-zeit)", JSON.stringify(g1));
    await zu(x1);

    /* B1: Netz langsam (3 s): die gespeicherte Seite sofort, genau eine Anfrage, Speicher aufgefrischt */
    console.log("");
    for (const schlaeft of [false, true]) {
      const vorher = await nebenbei(G, gespeichert);
      S.index = "stau"; S.stauMs = 3000;
      const x = await oeffnen(G, "/index.html?mit-sw", { schlafen: schlaeft });
      await x.pg.waitForLoadState("domcontentloaded").catch(() => {});
      const l = await lage(x.pg);
      const was = schlaeft ? " (Helfer schlief)" : " (Helfer wach)";
      sage(x.ok === true && x.ms < 1500 && vorher && l.marke === vorher.marke, "B  Netz langsam: die gespeicherte Seite kommt sofort" + was, x.ms + " ms, Seite " + l.marke + ", Speicher vorher " + (vorher && vorher.marke));
      sage(await laeuft(x.pg), "B  … und sie läuft (LiveChat und Reiter da)" + was);
      await schlaf(Math.max(0, 3000 - (Date.now() - ersteIndex(x.ab))) + 900);
      const ix = indexAb(x.ab), g = await gespeichert(x.pg);
      sage(ix.length === 1 && ix[0].vorab === "true", "B  … je Öffnen genau EINE Anfrage für /index.html (die Vorab-Anfrage)" + was, ix.map((y) => y.url + (y.vorab ? "[v]" : "") + " " + y.marke).join(" "));
      sage(g && ix[0] && g.marke === ix[0].marke, "B  … und die Antwort frischt den Speicher dahinter auf" + was, "Speicher " + (g && g.marke) + ", Netz " + (ix[0] && ix[0].marke));
      S.index = "";
      await zu(x);
    }

    /* B2: Funkloch */
    {
      const vor = await nebenbei(G, gespeichert);
      S.index = "aus";
      const x = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await x.pg.waitForLoadState("domcontentloaded").catch(() => {});
      const l = await lage(x.pg);
      sage(x.ok === true && x.ms < 1500 && l.marke === vor.marke, "B  Funkloch: sofort die gespeicherte Seite", x.ms + " ms, Seite " + l.marke);
      sage(await laeuft(x.pg), "B  … und sie läuft");
      S.index = "";
      await zu(x);
    }
    /* B3: Stau 9 s (bis 884: erst nach 6 s die gespeicherte Seite) */
    {
      S.index = "stau"; S.stauMs = 9000;
      const x = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await x.pg.waitForLoadState("domcontentloaded").catch(() => {});
      const l = await lage(x.pg);
      sage(x.ok === true && x.ms < 1500, "B  Stau (9 s): sofort die gespeicherte Seite (bis 884: nach 6 s)", x.ms + " ms, Seite " + l.marke);
      await schlaf(Math.max(0, 9000 - (Date.now() - ersteIndex(x.ab))) + 1200);
      const ix = indexAb(x.ab), g = await gespeichert(x.pg);
      sage(ix.length === 1 && g && g.marke === ix[0].marke, "B  … eine Anfrage, die späte Antwort landet im Speicher", ix.map((y) => y.url + " " + y.marke).join(" ") + ", Speicher " + (g && g.marke));
      S.index = "";
      await zu(x);
    }

    /* C: Update – genau ein Neuladen, die neue Seite aus der Auffrischung */
    console.log("");
    {
      S.seite = F(1); S.fj = ""; S.index = "stau"; S.stauMs = 400;
      const x = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      const da = await bis(x.pg, (f) => String(window.DMA_VERSION) === f && document.readyState === "complete", 20000, F(1));
      await schlaf(4000);
      const l = await lage(x.pg), ix = indexAb(x.ab);
      sage(da && l.fassung === F(1), "C  Update auf " + F(1) + ": am Ende läuft die neue Fassung", JSON.stringify({ fassung: l.fassung, url: l.url }));
      sage(l.seiten <= 2 && l.adressen.filter((a) => /[?&]f=/.test(a)).length <= 1, "C  … höchstens EIN Neuladen (index.html?f=" + F(1) + "), danach Ruhe (4 s)", JSON.stringify(l.adressen));
      sage(l.seiten === 1 || (ix[0] && l.marke === ix[0].marke), "C  … die neue Seite kam aus der Auffrischung des ersten Öffnens (keine zweite Rundreise abgewartet)",
        "Seite " + l.marke + ", Anfragen " + ix.map((y) => y.url.replace(/^\/index\.html/, "") + (y.vorab ? "[v]" : "") + " " + y.marke).join(" "));
      sage(!G.seitenfehler.length, "   keine Seitenfehler", G.seitenfehler.slice(0, 2).join(" | "));
      S.index = "";
      await zu(x);
      /* noch einmal öffnen: jetzt sofort die neue Fassung, ohne Neuladen */
      S.index = "stau"; S.stauMs = 3000;
      const y = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await y.pg.waitForLoadState("domcontentloaded").catch(() => {});
      await schlaf(1500);
      const l2 = await lage(y.pg);
      sage(y.ms < 1500 && l2.fassung === F(1) && l2.seiten === 1, "C  nächstes Öffnen: sofort " + F(1) + " aus dem Speicher, kein Neuladen", y.ms + " ms, " + JSON.stringify({ f: l2.fassung, seiten: l2.seiten }));
      S.index = "";
      await schlaf(2000);
      await zu(y);
    }

    /* D: fassung.json schon neu, index.html noch alt – kein Kreis */
    {
      S.seite = F(1); S.fj = F(2); S.index = "stau"; S.stauMs = 400;
      const x = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await bis(x.pg, () => !!document.getElementById("dmaNeueFassung"), 15000);
      await schlaf(4000);
      const l = await lage(x.pg);
      sage(l.seiten <= 2 && l.adressen.filter((a) => /[?&]f=/.test(a)).length <= 1, "D  fassung.json " + F(2) + ", index.html noch " + F(1) + ": höchstens ein Neuladen, kein Kreis", JSON.stringify(l.adressen));
      sage(/Neue Fassung/.test(l.blase) && l.blase.indexOf(F(2)) >= 0, "D  … danach die Blase „Neue Fassung " + F(2) + "\"", JSON.stringify(l.blase));
      S.fj = ""; S.index = "";
      await zu(x);
    }

    /* E: nie rückwärts (der Browser hebt index.html 10 min selbst auf) */
    console.log("");
    {
      S.seite = F(2); S.fj = ""; S.maxAge = true;
      /* der Browser legt sich die Seite F(2) mit max-age=600 hin (gleiche Adresse wie unten) */
      const x = await oeffnen(G, "/index.html?mit-sw&e=1", { schlafen: true });
      await bis(x.pg, (f) => String(window.DMA_VERSION) === f && document.readyState === "complete", 20000, F(2));
      await schlaf(1500);
      await zu(x);
      /* Update auf F(3): erstes Öffnen lädt einmal neu (über ?f=, am Browser-Speicher vorbei) */
      S.seite = F(3);
      const y = await oeffnen(G, "/index.html?mit-sw&e=1", { schlafen: true });
      const da = await bis(y.pg, (f) => String(window.DMA_VERSION) === f && document.readyState === "complete", 20000, F(3));
      await schlaf(2000);
      sage(da, "E  Update auf " + F(3) + " kommt an, obwohl der Browser " + F(2) + " noch aufhebt", JSON.stringify((await lage(y.pg)).adressen));
      await zu(y);
      /* jetzt öffnen: Vorab-Antwort aus dem Browser-Speicher wäre F(2) – der Speicher des Helfers muss F(3) bleiben */
      const ab = anfragen.length;
      const z = await oeffnen(G, "/index.html?mit-sw&e=1", { schlafen: true });
      await bis(z.pg, () => document.readyState === "complete", 15000);
      await schlaf(2500);
      const l = await lage(z.pg), g = await gespeichert(z.pg);
      sage(l.fassung === F(3) && l.seiten === 1, "E  nächstes Öffnen: gleich " + F(3) + ", ohne Neuladen", JSON.stringify({ f: l.fassung, adressen: l.adressen }));
      sage(g && g.fassung === F(3), "E  … und der Speicher bleibt " + F(3) + " (eine ältere Seite aus dem Browser-Speicher verdrängt ihn nicht)",
        "Speicher " + (g && g.fassung) + ", Anfragen " + anfragen.slice(ab).filter((y) => y.p === "/index.html").map((y) => y.url + (y.cc ? "[" + y.cc + "]" : "") + (y.vorab ? "[v]" : "")).join(" "));
      await zu(z);
      /* wieder öffnen: noch einmal dasselbe (jetzt ganz sicher aus dem Speicher des Helfers) */
      const w = await oeffnen(G, "/index.html?mit-sw&e=1", { schlafen: true });
      await bis(w.pg, () => document.readyState === "complete", 15000);
      await schlaf(1500);
      const l3 = await lage(w.pg);
      sage(l3.fassung === F(3) && l3.seiten === 1, "E  und noch einmal: " + F(3) + " ohne Neuladen", JSON.stringify({ f: l3.fassung, adressen: l3.adressen }));
      S.maxAge = false;
      await zu(w);
    }

    /* F: Rücknahme auf dem Server (F(3) → F(1)) */
    {
      S.seite = F(1);
      const x = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await bis(x.pg, () => document.readyState === "complete", 15000);
      await schlaf(4000);
      const l = await lage(x.pg);
      await zu(x);
      const y = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await bis(y.pg, () => document.readyState === "complete", 15000);
      await schlaf(3000);
      const l2 = await lage(y.pg);
      sage(l2.fassung === F(1) && l.seiten <= 2 && l2.seiten <= 2, "F  Rücknahme " + F(3) + " → " + F(1) + ": spätestens beim zweiten Öffnen " + F(1) + ", je Öffnen höchstens ein Neuladen",
        JSON.stringify({ erstes: [l.fassung, l.adressen], zweites: [l2.fassung, l2.adressen] }));
      await zu(y);
    }

    /* G: alte Adresse ?f=<älter> */
    console.log("");
    {
      S.index = "stau"; S.stauMs = 3000;
      const x = await oeffnen(G, "/index.html?mit-sw&f=" + GRUND, { schlafen: true });
      await x.pg.waitForLoadState("domcontentloaded").catch(() => {});
      await schlaf(1500);
      const l = await lage(x.pg);
      sage(x.ms < 1500 && l.fassung === F(1) && l.seiten === 1, "G  alte Adresse ?f=" + GRUND + " (gespeichert " + F(1) + "): sofort die gespeicherte Seite, kein Neuladen", x.ms + " ms, " + JSON.stringify({ f: l.fassung, seiten: l.seiten }));
      S.index = "";
      await schlaf(2000);
      await zu(x);
    }

    /* H: älter als 12 h → Netz; Seite aus der Zeit vor S1 (ohne Köpfe, Datum frisch) → Speicher */
    {
      const setzen = (pg, art) => pg.evaluate(async (art) => {
        const k = await caches.open("dma-seite-1"); const r = await k.match("seite"); if (!r) return "leer";
        const t = await r.text(), h = new Headers(r.headers);
        if (art === "alt") h.set("x-dma-zeit", String(Date.now() - 13 * 3600 * 1000));
        else { h.delete("x-dma-fassung"); h.delete("x-dma-zeit"); h.set("date", new Date().toUTCString()); }
        await k.put("seite", new Response(t, { status: 200, headers: h })); return "gesetzt";
      }, art);
      const h1 = await nebenbei(G, (pg) => setzen(pg, "alt"));
      S.index = "stau"; S.stauMs = 3000;
      const x = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      sage(x.ok === true && x.ms >= 2800, "H  gespeicherte Seite älter als 12 h: zuerst das Netz (wartet die 3 s)", x.ms + " ms (" + h1 + ")");
      await x.pg.waitForLoadState("domcontentloaded").catch(() => {});
      await schlaf(1500);
      await zu(x);
      const h2 = await nebenbei(G, (pg) => setzen(pg, "vorS1"));
      const y = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await y.pg.waitForLoadState("domcontentloaded").catch(() => {});
      sage(y.ok === true && y.ms < 1500, "H  Seite aus der Zeit vor S1 (ohne eigene Köpfe, Datum frisch): sofort aus dem Speicher", y.ms + " ms (" + h2 + ")");
      await schlaf(Math.max(0, 3000 - (Date.now() - ersteIndex(y.ab))) + 900);
      const g = await gespeichert(y.pg);
      sage(g && g.kopfFassung === F(1) && g.kopfZeit, "H  … danach mit Köpfen gespeichert", JSON.stringify(g));
      S.index = "";
      await zu(y);
    }
    sage(!G.seitenfehler.length, "   keine Seitenfehler (A–H)", G.seitenfehler.slice(0, 3).join(" | "));
    await G.ctx.close();
  }

  /* ================= I: schwaches Telefon – der Helfer wacht langsam auf ================= */
  console.log("");
  {
    S.swWach = 400; S.seite = F(6); S.fj = ""; S.maxAge = false; S.index = "";
    const I = await geraet();
    const x0 = await oeffnen(I, "/index.html?mit-sw");
    await x0.pg.waitForLoadState("load").catch(() => {});
    await x0.pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
    await zu(x0);
    const x1 = await oeffnen(I, "/index.html?mit-sw");
    await x1.pg.waitForLoadState("load").catch(() => {});
    await schlaf(1200);
    const g1 = await gespeichert(x1.pg);
    await zu(x1);
    /* Update F(6) → F(7), Helfer schläft: die Vorab-Antwort ist da, bevor er wach ist */
    S.seite = F(7);
    const x = await oeffnen(I, "/index.html?mit-sw", { schlafen: true });
    await bis(x.pg, () => document.readyState === "complete", 15000);
    await schlaf(3000);
    const l = await lage(x.pg), ix = indexAb(x.ab);
    sage(g1 && g1.fassung === F(6) && x.ms >= 350 && l.fassung === F(7) && l.seiten === 1 && ix[0] && l.marke === ix[0].marke,
      "I  Helfer wacht langsam (400 ms), Update " + F(6) + " → " + F(7) + ": gleich die frische Seite, KEIN Neuladen",
      x.ms + " ms, " + JSON.stringify({ gespeichert: g1 && g1.fassung, f: l.fassung, marke: l.marke, netz: ix.map((y) => y.marke), adressen: l.adressen }));
    const g2 = await gespeichert(x.pg);
    sage(g2 && g2.fassung === F(7) && g2.kopfFassung === F(7), "I  … und sie liegt danach im Speicher", JSON.stringify(g2));
    await zu(x);
    /* Browser hebt eine ältere Seite auf (max-age): sie ist beim Aufwachen „schon da", aber älter als die gespeicherte */
    S.maxAge = true;
    const y0 = await oeffnen(I, "/index.html?mit-sw&i=1", { schlafen: true });
    await bis(y0.pg, (f) => String(window.DMA_VERSION) === f && document.readyState === "complete", 15000, F(7));
    await schlaf(1500);
    await zu(y0);
    S.seite = F(8);
    const y1 = await oeffnen(I, "/index.html?mit-sw&i=1", { schlafen: true });
    await bis(y1.pg, (f) => String(window.DMA_VERSION) === f && document.readyState === "complete", 15000, F(8));
    await schlaf(2500);
    await zu(y1);
    const y2 = await oeffnen(I, "/index.html?mit-sw&i=1", { schlafen: true });
    await bis(y2.pg, () => document.readyState === "complete", 15000);
    await schlaf(2500);
    const l2 = await lage(y2.pg), g3 = await gespeichert(y2.pg);
    sage(l2.fassung === F(8) && l2.seiten === 1 && g3 && g3.fassung === F(8),
      "I  die Antwort aus dem Browser-Speicher (" + F(7) + ") ist älter als die gespeicherte (" + F(8) + "): die gespeicherte, kein Neuladen, Speicher bleibt",
      JSON.stringify({ f: l2.fassung, adressen: l2.adressen, speicher: g3 && g3.fassung }));
    sage(!I.seitenfehler.length, "   keine Seitenfehler (I)", I.seitenfehler.slice(0, 3).join(" | "));
    S.swWach = 0; S.maxAge = false; S.seite = "";
    await I.ctx.close();
  }

  /* ================= K: Fassungs-Wächter ohne Helfer ================= */
  console.log("");
  {
    S.seite = ""; S.fj = F(5); S.fjStau = 5000;
    const K = await geraet();
    const fall = async (name, vorbereiten) => {
      const { pg } = await K.neuerTab();
      await pg.goto(HIER + "/index.html", { waitUntil: "domcontentloaded" });
      await laeuft(pg, 20000);
      const lageVor = vorbereiten ? await vorbereiten(pg) : "";
      await bis(pg, () => !!document.getElementById("dmaNeueFassung") || Number(sessionStorage.getItem("__sondeSeiten")) > 1, 9000);
      await schlaf(1500);
      const l = await lage(pg);
      await pg.close();
      return { l, lageVor };
    };
    const kz = await fall("kz", async (pg) => {
      await pg.evaluate(() => document.querySelector('.tape-tab[data-target="view-knowledge"]').click());
      await bis(pg, () => !!document.querySelector('.subnav-pill[data-sub="sub-livechat"]'), 8000);
      await pg.evaluate(() => document.querySelector('.subnav-pill[data-sub="sub-livechat"]').click());
      await bis(pg, () => { const v = document.getElementById("view-knowledge"), s = document.getElementById("sub-livechat"); return v && s && v.dataset.active === "true" && s.dataset.active === "true"; }, 8000);
      return pg.evaluate(() => document.getElementById("sub-livechat").dataset.active);
    });
    sage(kz.l.seiten === 1 && /Neue Fassung/.test(kz.l.blase), "K  Klassenzimmer offen, dann „neue Fassung\": KEIN Neuladen, die Blase erscheint", JSON.stringify({ kz: kz.lageVor, seiten: kz.l.seiten, blase: kz.l.blase }));
    const drin = await fall("drin", (pg) => pg.evaluate(() => { const alt = window.LiveChat.lage; window.LiveChat.lage = function () { const l = alt.apply(this, arguments); l.lage = "drin"; return l; }; return window.LiveChat.lage().lage; }));
    sage(drin.l.seiten === 1 && /Neue Fassung/.test(drin.l.blase), "K  im Raum (LiveChat „drin\"): KEIN Neuladen, die Blase", JSON.stringify({ lage: drin.lageVor, seiten: drin.l.seiten, blase: drin.l.blase }));
    const tippt = await fall("tippt", (pg) => pg.evaluate(() => {
      const e = document.createElement("textarea"); e.id = "__sondeEingabe"; document.body.appendChild(e); e.focus(); e.value = "Hallo, ich schreibe gerade";
      return document.activeElement === e ? "tippt" : "nicht fokussiert";
    }));
    sage(tippt.l.seiten === 1 && /Neue Fassung/.test(tippt.l.blase), "K  mitten in einer Eingabe: KEIN Neuladen, die Blase", JSON.stringify({ lage: tippt.lageVor, seiten: tippt.l.seiten, blase: tippt.l.blase }));
    const frei = await fall("frei", null);
    sage(frei.l.seiten === 2 && frei.l.fassung && /[?&]f=/.test(frei.l.url), "K  Gegenprobe ohne diese Lage: der Wächter lädt wie bisher einmal neu", JSON.stringify({ seiten: frei.l.seiten, url: frei.l.url, adressen: frei.l.adressen }));
    S.fj = ""; S.fjStau = 0;
    await K.ctx.close();
  }

  await br.close(); srv.close();
  console.log("\n  " + (fehler ? fehler + " FEHLER" : "Alles in Ordnung.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
