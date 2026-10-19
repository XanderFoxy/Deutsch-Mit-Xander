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
        Stau (9 s, hängende Leitung): sofort die gespeicherte Seite (bis
        884: nach 6 s), die späte Antwort landet im Speicher. Funkloch
        (Verbindung bricht sofort ab): sofort die gespeicherte Seite – das
        war schon bis 884 so (Gegenprobe grün), hier nur festgehalten.
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
     F  Rücknahme auf dem Server (Fassung wieder kleiner), Netz 400 ms
        (langsamer als der Helfer, also zuerst die gespeicherte Seite):
        der Wächter lädt einmal auf ?f=<ältere> neu, und DIESE Seite ist
        schon die zurückgenommene (der Helfer wartet auch bei einem
        älteren ?f= auf die laufende Auffrischung) – keine Blase, kein
        zweiter Start der alten; das nächste Öffnen gleich die
        zurückgenommene. (Nachbesserung 1; bis dahin prüfte F im schnellen
        Netz nur den Weg „schon da“.)
     G  Alte Adresse ?f=<ältere Fassung> (der Browser öffnet sie wieder):
        die gespeicherte Seite, sofort, kein Neuladen.
     H  Gespeicherte Seite älter als 12 h: zuerst das Netz (wie bis 884).
        Seite aus der Zeit vor S1 (ohne eigene Köpfe, Datum frisch): sofort
        aus dem Speicher, danach mit Köpfen. Älter als 12 h und Stau 9 s:
        nach 6 s die gespeicherte Seite (die Ausweichfrist). ?f=<neuer>,
        eine Auffrischung hängt, die Leitung hängt (12 s): spätestens nach
        6 s ab dem Öffnen die gespeicherte Seite – die Frist zählt ab dem
        Öffnen, nicht nach den 3 s Warten (vorher bis 9 s; Nachbesserung 1).
     U  Unterordner (wie sicherung/<x>/ mit eigener alter DMA_VERSION 175):
        der Helfer reicht ihn unverändert durch (eine Anfrage), der Speicher
        bleibt die Hauptseite, das nächste Öffnen zeigt sofort die
        laufende Fassung (Nachbesserung 1; vorher: Fassung 175). Liegt
        noch eine Unterordner-Seite aus der Zeit vor S1 im Speicher (bis
        884 legte der Helfer jede Navigation auf …/ ab), wird sie nicht
        ausgeliefert: zuerst das Netz.
     I  Schwaches Telefon (der Helfer rechnet beim Aufwachen 400 ms, die
        Zeile steht vorn in sw.js): hat das Netz schon geantwortet, kommt
        die FRISCHE Seite – nach einem Update also ohne Neuladen; ist die
        frische Antwort älter als die gespeicherte (aus dem Browser-
        Speicher, max-age), kommt die gespeicherte.
     K  Fassungs-Wächter (index.html, ohne Helfer): kommt die Antwort
        „neue Fassung" erst, wenn man das Klassenzimmer selbst geöffnet hat
        (echte Tipps), man im Raum ist (LiveChat „drin") oder etwas tippt →
        KEIN Neuladen, die Blase „Neue Fassung" erscheint. Gegenprobe ohne
        diese Lage: ein Neuladen – und die übrige Adresse bleibt (?sonde=k,
        #…; Nachbesserung 2, vorher nur ?f=).
        Nachbesserung 2: Klassenzimmer VON SELBST offen (Einladung #raum=,
        Rückweg dma-notweg-ziel, Einladung ?raum=), nichts angetippt → ein
        Neuladen, danach wieder im Klassenzimmer, ?raum= bleibt (vorher:
        Blase, die alte Fassung blieb die ganze Sitzung). Schon etwas
        angetippt und die Antwort kommt nach
        mehr als 2 s → kein Neuladen, die Blase (vorher: Neuladen unter dem
        Finger). Angetippt, Antwort vor 2 s → ein Neuladen (wie vorher).
     L  Einladung mit Helfer (Nachbesserung 2, der Fall des Prüfers): Server
        hat Fassung+1, index.html und fassung.json je 1,5 s, Öffnen über
        index.html?mit-sw#raum=… → am Ende die neue Fassung im
        Klassenzimmer, ein Neuladen, Adresse ?mit-sw&f=… .
     N  NOTAUS ?ohne-sw, während auf dem Server schon eine neuere Fassung
        liegt (Nachbesserung 2): die Seite kommt frisch aus dem Netz, kein
        Neuladen, der Helfer ist abgemeldet, das nächste Öffnen läuft ohne
        ihn (vorher: gespeicherte Seite, Neuladen auf ?f=… ohne ?ohne-sw,
        Helfer blieb angemeldet).
     M  messung.js „neu" (mess-start): 1 nur auf der ersten Seite nach dem
        Neuladen durch den Wächter, 0 nach einem Neuladen von Hand im
        selben Tab (Nachbesserung 1; vorher blieb es 1).
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
    /* U: ein Unterordner wie sicherung/<x>/ – eine eigene Seite mit alter DMA_VERSION */
    if (p === "/alt/" || p === "/alt/index.html") {
      a.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
      return a.end('<!doctype html><meta charset="utf-8"><title>Sicherung</title><script>window.DMA_VERSION = "175";</script>'
        /* wie die echten Sicherungen: Dateien relativ und mit altem Stempel (im Unterordner 404; unter /index.html
           ausgeliefert landete min/styles.css?v=175 im Dateispeicher und verdrängte den gültigen Eintrag) */
        + '<link rel="stylesheet" href="min/styles.css?v=175"><p id="alt">Sicherung 175</p>');
    }
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
    const k = await caches.open("dma-seite-1"); const r = await k.match("/seite");   /* Schlüssel neben sw.js (auch aus einem Unterordner gelesen) */
    if (!r) return null;
    const t = await r.text(), m = t.match(/SONDE-MARKE:(\w+)/), v = t.match(/window\.DMA_VERSION = "([^"]*)"/);
    return { marke: m ? m[1] : null, fassung: v ? v[1] : null, kopfFassung: r.headers.get("x-dma-fassung"), kopfZeit: Number(r.headers.get("x-dma-zeit")) || null };
  }).catch((e) => ({ fehler: e.message }));
  const lage = (pg) => pg.evaluate(() => ({
    marke: (document.head && document.head.innerHTML.match(/SONDE-MARKE:(\w+)/) || [])[1] || null, fassung: String(window.DMA_VERSION || ""),
    seiten: Number(sessionStorage.getItem("__sondeSeiten") || 0), adressen: JSON.parse(sessionStorage.getItem("__sondeAdressen") || "[]"),
    blase: (document.getElementById("dmaNeueFassung") || {}).textContent || "", url: location.pathname + location.search,
    hash: location.hash, kz: (() => { const v = document.getElementById("view-knowledge"), s = document.getElementById("sub-livechat");
      return Boolean(v && s && v.dataset.active === "true" && s.dataset.active === "true"); })(),
  })).catch((e) => ({ fehler: e.message.split("\n")[0] }));
  const istKz = (pg) => pg.evaluate(() => { const v = document.getElementById("view-knowledge"), s = document.getElementById("sub-livechat");
    return Boolean(v && s && v.dataset.active === "true" && s.dataset.active === "true"); }).catch(() => false);
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

    /* F: Rücknahme auf dem Server (F(3) → F(1)), Netz 400 ms – langsamer als der Helfer, also zuerst die gespeicherte F(3) */
    {
      S.seite = F(1); S.index = "stau"; S.stauMs = 400;
      const x = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await bis(x.pg, () => document.readyState === "complete", 15000);
      await schlaf(4000);
      const l = await lage(x.pg), ix = indexAb(x.ab);
      await zu(x);
      sage(l.fassung === F(1) && l.seiten <= 2 && l.adressen.filter((a) => /[?&]f=/.test(a)).length <= 1 && !l.blase,
        "F  Rücknahme " + F(3) + " → " + F(1) + " (Netz 400 ms): schon das ERSTE Öffnen endet bei " + F(1) + ", höchstens ein Neuladen, keine Blase",
        JSON.stringify({ f: l.fassung, adressen: l.adressen, blase: l.blase, anfragen: ix.map((y) => y.url.replace(/^\/index\.html/, "") + (y.vorab ? "[v]" : "") + (y.cc ? "[" + y.cc + "]" : "")) }));
      const y = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await bis(y.pg, () => document.readyState === "complete", 15000);
      await schlaf(3000);
      const l2 = await lage(y.pg);
      sage(l2.fassung === F(1) && l2.seiten === 1, "F  … das nächste Öffnen: gleich " + F(1) + ", kein Neuladen",
        JSON.stringify({ f: l2.fassung, adressen: l2.adressen }));
      S.index = "";
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

      /* H3: älter als 12 h und Stau 9 s – die Ausweichfrist (nach 6 s die gespeicherte Seite) */
      const h3 = await nebenbei(G, (pg) => setzen(pg, "alt"));
      const h3vor = await nebenbei(G, gespeichert);
      S.index = "stau"; S.stauMs = 9000;
      const z = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await z.pg.waitForLoadState("domcontentloaded").catch(() => {});
      const lz = await lage(z.pg);
      sage(z.ok === true && z.ms >= 5500 && z.ms <= 7500 && lz.marke === h3vor.marke,
        "H  älter als 12 h und Stau 9 s: nach 6 s die gespeicherte Seite (Ausweichfrist)", z.ms + " ms, Seite " + lz.marke + ", Speicher " + h3vor.marke + " (" + h3 + ")");
      /* die späte Antwort (9 s) frischt den Speicher auf – danach ist er wieder jünger als 12 h */
      await schlaf(Math.max(0, 9000 - (Date.now() - ersteIndex(z.ab))) + 1200);
      await zu(z);

      /* H4: ?f=<neuer>, eine Auffrischung hängt, die Leitung hängt (12 s) – höchstens 6 s ab dem Öffnen */
      S.stauMs = 12000;
      const h4vor = await nebenbei(G, gespeichert);
      const a = await oeffnen(G, "/index.html?mit-sw&h=4");   /* sofort aus dem Speicher; die Auffrischung hängt 12 s */
      const b = await oeffnen(G, "/index.html?mit-sw&f=" + F(4));
      await b.pg.waitForLoadState("domcontentloaded").catch(() => {});
      const lb = await lage(b.pg);
      sage(a.ok === true && a.ms < 1500 && b.ok === true && b.ms >= 5000 && b.ms <= 7000 && lb.marke === h4vor.marke,
        "H  ?f=" + F(4) + " (neuer), Auffrischung und Leitung hängen: nach 6 s ab dem Öffnen die gespeicherte Seite (vorher 3 + 6 s)",
        "erstes Öffnen " + a.ms + " ms, ?f= " + b.ms + " ms, Seite " + lb.marke + ", Speicher " + (h4vor && h4vor.marke) + " (" + JSON.stringify(h4vor && { f: h4vor.fassung, zeit: h4vor.kopfZeit && Math.round((Date.now() - h4vor.kopfZeit) / 1000) + " s alt" }) + ")");
      /* die hängenden Antworten auslaufen lassen (sie landen im Speicher), dann weiter */
      await schlaf(Math.max(0, 12000 - (Date.now() - ersteIndex(a.ab))) + 1500);
      S.index = "";
      await zu(a); await zu(b);
    }

    /* U: Unterordner (wie sicherung/<x>/) – nie als Hauptseite behandeln */
    console.log("");
    {
      const vor = await nebenbei(G, gespeichert);
      for (const pfad of ["/alt/", "/alt/index.html"]) {
        const x = await oeffnen(G, pfad, { schlafen: true });
        await x.pg.waitForLoadState("domcontentloaded").catch(() => {});
        await schlaf(1500);
        const t = await x.pg.evaluate(() => ({ v: String(window.DMA_VERSION), alt: !!document.getElementById("alt") })).catch((e) => ({ fehler: e.message }));
        const ax = anfragen.slice(x.ab).filter((y) => y.p === pfad);
        const g = await gespeichert(x.pg);
        sage(x.ok === true && t.v === "175" && t.alt, "U  " + pfad + ": der Helfer reicht die Seite des Unterordners unverändert durch", JSON.stringify(t));
        sage(ax.length === 1, "U  … genau EINE Anfrage (kein Nachfragen „nie rückwärts“)", ax.map((y) => y.url + (y.vorab ? "[v]" : "") + (y.cc ? "[" + y.cc + "]" : "")).join(" "));
        sage(g && vor && g.fassung === vor.fassung && g.marke === vor.marke, "U  … der Speicher bleibt die Hauptseite (" + (vor && vor.fassung) + ")", "Speicher " + JSON.stringify(g && { f: g.fassung, marke: g.marke }));
        await zu(x);
      }
      S.index = "stau"; S.stauMs = 3000;
      const y = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await y.pg.waitForLoadState("domcontentloaded").catch(() => {});
      await schlaf(1500);
      const l = await lage(y.pg);
      sage(y.ms < 1500 && vor && l.fassung === vor.fassung && l.seiten === 1, "U  danach die Hauptseite: sofort " + (vor && vor.fassung) + " aus dem Speicher, kein Neuladen", y.ms + " ms, " + JSON.stringify({ f: l.fassung, seiten: l.seiten }));
      const kasten = await y.pg.evaluate(async () => { const k = await caches.open("dma-dateien-1"); return (await k.keys()).filter((q) => /[?&]v=175\b/.test(q.url)).length; }).catch(() => -1);
      sage(kasten === 0, "U  … und im Dateispeicher liegt nichts mit ?v=175", "Einträge mit v=175: " + kasten);
      await schlaf(Math.max(0, 3000 - (Date.now() - ersteIndex(y.ab))) + 900);
      S.index = "";
      await zu(y);

      /* U2: so legte der Helfer bis 884 einen Unterordner ab (die Antwort selbst, ohne eigene Köpfe, Datum frisch) –
         beim ersten Öffnen nach dem Update auf 885 darf sie nicht ausgeliefert werden */
      const u2 = await nebenbei(G, (pg) => pg.evaluate(async () => {
        const k = await caches.open("dma-seite-1"); const r = await fetch("/alt/", { cache: "no-store" });
        await k.put("/seite", r); const m = await k.match("/seite"); return m ? m.url.replace(location.origin, "") + " " + (m.headers.get("x-dma-fassung") || "ohne Kopf") : "leer";
      }).catch((e) => "fehler " + e.message));
      S.index = "stau"; S.stauMs = 3000;
      const z = await oeffnen(G, "/index.html?mit-sw", { schlafen: true });
      await z.pg.waitForLoadState("domcontentloaded").catch(() => {});
      await schlaf(1000);
      const lz = await lage(z.pg), gz = await gespeichert(z.pg), iz = indexAb(z.ab);
      sage(z.ok === true && z.ms >= 2800 && lz.fassung === vor.fassung && iz[0] && lz.marke === iz[0].marke && gz && gz.fassung === vor.fassung && gz.kopfFassung === vor.fassung,
        "U  Unterordner-Seite aus der Zeit vor S1 im Speicher (wie 884 sie ablegte): nicht ausgeliefert – zuerst das Netz, danach liegt die Hauptseite im Speicher",
        z.ms + " ms, Seite " + JSON.stringify({ f: lz.fassung, marke: lz.marke }) + ", Speicher vorher „" + u2 + "“, nachher " + JSON.stringify(gz && { f: gz.fassung, kopf: gz.kopfFassung }));
      S.index = "";
      await zu(z);
    }
    sage(!G.seitenfehler.length, "   keine Seitenfehler (A–U)", G.seitenfehler.slice(0, 3).join(" | "));
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
    /* o.adresse (Standard /index.html), o.vorher(pg) vor dem Öffnen, o.frueh(pg) gleich nach domcontentloaded (vor „läuft"),
       o.warte: Bedingung am Ende (Standard: Blase oder zweite Seite) */
    const fall = async (name, vorbereiten, o = {}) => {
      const { pg } = await K.neuerTab();
      if (o.vorher) await o.vorher(pg);
      await pg.goto(HIER + (o.adresse || "/index.html"), { waitUntil: "domcontentloaded" });
      const fr = o.frueh ? await o.frueh(pg) : "";
      await laeuft(pg, 20000);
      const lageVor = vorbereiten ? await vorbereiten(pg) : fr;
      await bis(pg, o.warte || (() => !!document.getElementById("dmaNeueFassung") || Number(sessionStorage.getItem("__sondeSeiten")) > 1), o.warteMs || 9000);
      await schlaf(1500);
      const l = await lage(pg);
      await pg.close();
      return { l, lageVor };
    };
    /* Nachbesserung 2: das Klassenzimmer mit echten Tipps öffnen (pointerdown) – so öffnet es ein Mensch */
    const kz = await fall("kz", async (pg) => {
      await pg.tap('.tape-tab[data-target="view-knowledge"]');
      await bis(pg, () => !!document.querySelector('.subnav-pill[data-sub="sub-livechat"]'), 8000);
      await pg.tap('.subnav-pill[data-sub="sub-livechat"]');
      await bis(pg, () => { const v = document.getElementById("view-knowledge"), s = document.getElementById("sub-livechat"); return v && s && v.dataset.active === "true" && s.dataset.active === "true"; }, 8000);
      return pg.evaluate(() => document.getElementById("sub-livechat").dataset.active + " bei " + Math.round(performance.now()) + " ms");
    });
    sage(kz.l.seiten === 1 && /Neue Fassung/.test(kz.l.blase), "K  Klassenzimmer selbst geöffnet (Tipps), dann „neue Fassung\": KEIN Neuladen, die Blase erscheint", JSON.stringify({ kz: kz.lageVor, seiten: kz.l.seiten, blase: kz.l.blase }));
    const drin = await fall("drin", (pg) => pg.evaluate(() => { const alt = window.LiveChat.lage; window.LiveChat.lage = function () { const l = alt.apply(this, arguments); l.lage = "drin"; return l; }; return window.LiveChat.lage().lage; }));
    sage(drin.l.seiten === 1 && /Neue Fassung/.test(drin.l.blase), "K  im Raum (LiveChat „drin\"): KEIN Neuladen, die Blase", JSON.stringify({ lage: drin.lageVor, seiten: drin.l.seiten, blase: drin.l.blase }));
    const tippt = await fall("tippt", (pg) => pg.evaluate(() => {
      const e = document.createElement("textarea"); e.id = "__sondeEingabe"; document.body.appendChild(e); e.focus(); e.value = "Hallo, ich schreibe gerade";
      return document.activeElement === e ? "tippt" : "nicht fokussiert";
    }));
    sage(tippt.l.seiten === 1 && /Neue Fassung/.test(tippt.l.blase), "K  mitten in einer Eingabe: KEIN Neuladen, die Blase", JSON.stringify({ lage: tippt.lageVor, seiten: tippt.l.seiten, blase: tippt.l.blase }));
    const frei = await fall("frei", null, { adresse: "/index.html?sonde=k#view-knowledge" });
    sage(frei.l.seiten === 2 && frei.l.fassung && /[?&]f=/.test(frei.l.url), "K  Gegenprobe ohne diese Lage: der Wächter lädt wie bisher einmal neu", JSON.stringify({ seiten: frei.l.seiten, url: frei.l.url, adressen: frei.l.adressen }));
    sage(frei.l.url === "/index.html?sonde=k&f=" + F(5) && frei.l.hash === "#view-knowledge", "K  … und die übrige Adresse bleibt (?sonde=k, #view-knowledge; nur f wird gesetzt – Nachbesserung 2)", frei.l.url + frei.l.hash);

    /* Nachbesserung 2: Klassenzimmer VON SELBST offen, nichts angetippt → einmal neu laden, danach wieder im Klassenzimmer */
    const zweiteImKz = () => Number(sessionStorage.getItem("__sondeSeiten")) > 1 && (() => { const v = document.getElementById("view-knowledge"), s = document.getElementById("sub-livechat");
      return Boolean(v && s && v.dataset.active === "true" && s.dataset.active === "true"); })();
    const einl = await fall("einladung", null, { adresse: "/index.html#raum=sondenraum1", warte: zweiteImKz, warteMs: 15000,
      frueh: (pg) => bis(pg, () => { const s = document.getElementById("sub-livechat"); return s && s.dataset.active === "true"; }, 4000).then((j) => j ? "Klassenzimmer von selbst offen" : "nicht offen") });
    /* (#raum= selbst ersetzt app.js schon auf der ersten Seite durch #view-knowledge – activateTab; das ist älter als S1.
       Zurück ins Klassenzimmer führt hier dma-notweg-ziel.) */
    sage(einl.l.seiten === 2 && einl.l.kz && /[?&]f=/.test(einl.l.url),
      "K  Einladung (#raum=), Klassenzimmer von selbst offen, nichts angetippt: EIN Neuladen, danach wieder im Klassenzimmer (vorher: Blase, alte Fassung blieb)",
      JSON.stringify({ vorher: einl.lageVor, seiten: einl.l.seiten, kz: einl.l.kz, url: einl.l.url + einl.l.hash, blase: einl.l.blase }));
    /* Einladung mit ?raum= (bleibt in der Adresse): nach dem Neuladen derselbe Raum (vorher fiel ?raum= beim Neuladen weg) */
    const einlQ = await fall("einladung-q", null, { adresse: "/index.html?raum=sondenraum3", warte: zweiteImKz, warteMs: 15000,
      frueh: (pg) => bis(pg, () => { const s = document.getElementById("sub-livechat"); return s && s.dataset.active === "true"; }, 4000).then((j) => j ? "Klassenzimmer von selbst offen" : "nicht offen") });
    sage(einlQ.l.seiten === 2 && einlQ.l.kz && einlQ.l.url === "/index.html?raum=sondenraum3&f=" + F(5),
      "K  Einladung (?raum=): EIN Neuladen, danach im Klassenzimmer, Adresse ?raum=sondenraum3&f=" + F(5) + " (der Raum bleibt)",
      JSON.stringify({ vorher: einlQ.lageVor, seiten: einlQ.l.seiten, kz: einlQ.l.kz, url: einlQ.l.url + einlQ.l.hash }));
    const rueck = await fall("rueckweg", null, { warte: zweiteImKz, warteMs: 15000,
      vorher: (pg) => pg.addInitScript(() => { try { if (!sessionStorage.getItem("__sondeZiel")) { sessionStorage.setItem("__sondeZiel", "1"); sessionStorage.setItem("dma-notweg-ziel", "klassenzimmer"); } } catch (e) {} }),
      frueh: (pg) => bis(pg, () => { const s = document.getElementById("sub-livechat"); return s && s.dataset.active === "true"; }, 4000).then((j) => j ? "Klassenzimmer von selbst offen" : "nicht offen") });
    sage(rueck.l.seiten === 2 && rueck.l.kz && /[?&]f=/.test(rueck.l.url),
      "K  Rückweg (dma-notweg-ziel), Klassenzimmer von selbst offen: EIN Neuladen, danach wieder im Klassenzimmer (dma-notweg-ziel neu gesetzt)",
      JSON.stringify({ vorher: rueck.lageVor, seiten: rueck.l.seiten, kz: rueck.l.kz, url: rueck.l.url }));

    /* Nachbesserung 2: schon etwas angetippt (hier „Wissen“), die Antwort kommt nach > 2 s → kein Neuladen, die Blase */
    const tipp = await fall("tipp", async (pg) => {
      await pg.tap('.tape-tab[data-target="view-knowledge"]');
      return pg.evaluate(() => "getippt bei " + Math.round(performance.now()) + " ms");
    });
    sage(tipp.l.seiten === 1 && /Neue Fassung/.test(tipp.l.blase), "K  „Wissen“ angetippt, die Antwort kommt nach 5 s: KEIN Neuladen, die Blase (vorher: Neuladen unter dem Finger)",
      JSON.stringify({ tipp: tipp.lageVor, seiten: tipp.l.seiten, blase: tipp.l.blase, url: tipp.l.url }));
    /* … die Antwort kommt vor 2 s: wie bisher einmal neu laden (vorher wartete man auf die frische Seite) */
    S.fjStau = 1500;
    const frueh = await fall("frueh", null, {
      frueh: async (pg) => { await pg.mouse.click(200, 700).catch(() => {}); return pg.evaluate(() => "geklickt bei " + Math.round(performance.now()) + " ms").catch(() => "?"); } });
    sage(frueh.l.seiten === 2 && /[?&]f=/.test(frueh.l.url), "K  angetippt, die Antwort kommt nach 1,5 s (vor 2 s): einmal neu laden wie bisher",
      JSON.stringify({ klick: frueh.lageVor, seiten: frueh.l.seiten, url: frueh.l.url }));
    S.fj = ""; S.fjStau = 0;
    await K.ctx.close();
  }

  /* ================= L: Einladung mit Helfer, langsame Leitung (Nachbesserung 2, Fall T1 des Prüfers) ================= */
  console.log("");
  {
    S.seite = F(20); S.fj = ""; S.index = ""; S.fjStau = 0; S.maxAge = false;
    const L = await geraet();
    const x0 = await oeffnen(L, "/index.html?mit-sw");
    await x0.pg.waitForLoadState("load").catch(() => {});
    await x0.pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
    await zu(x0);
    const x1 = await oeffnen(L, "/index.html?mit-sw");
    await x1.pg.waitForLoadState("load").catch(() => {});
    await schlaf(1200);
    const g = await gespeichert(x1.pg);
    await zu(x1);
    /* Server hat F(21); index.html und fassung.json je 1,5 s */
    S.seite = F(21); S.index = "stau"; S.stauMs = 1500; S.fjStau = 1500;
    const x = await oeffnen(L, "/index.html?mit-sw#raum=sondenraum2", { schlafen: true });
    const fr = await bis(x.pg, () => { const s = document.getElementById("sub-livechat"); return s && s.dataset.active === "true" && Number(sessionStorage.getItem("__sondeSeiten")) === 1; }, 4000);
    const ende = await bis(x.pg, (f) => String(window.DMA_VERSION) === f && (() => { const v = document.getElementById("view-knowledge"), s = document.getElementById("sub-livechat");
      return Boolean(v && s && v.dataset.active === "true" && s.dataset.active === "true"); })(), 15000, F(21));
    await schlaf(2000);
    const l = await lage(x.pg);
    sage(g && g.fassung === F(20) && x.ms < 1500 && ende && l.fassung === F(21) && l.kz && l.seiten === 2,
      "L  Einladung #raum= mit Helfer (Netz 1,5 s, Server " + F(21) + ", gespeichert " + F(20) + "): erst die gespeicherte Seite, EIN Neuladen, am Ende " + F(21) + " im Klassenzimmer (vorher: " + F(20) + " + Blase)",
      x.ms + " ms, " + JSON.stringify({ kzVorDemNeuladen: fr, f: l.fassung, kz: l.kz, seiten: l.seiten, blase: l.blase, adressen: l.adressen }));
    sage(l.url === "/index.html?mit-sw&f=" + F(21), "L  … Adresse ?mit-sw&f=" + F(21) + " (die übrige Adresse bleibt)", l.url + l.hash);
    S.index = ""; S.fjStau = 0;
    await zu(x);
    sage(!L.seitenfehler.length, "   keine Seitenfehler (L)", L.seitenfehler.slice(0, 3).join(" | "));
    await L.ctx.close();
  }

  /* ================= N: NOTAUS ?ohne-sw, während draußen schon eine neuere Fassung liegt (Nachbesserung 2) ================= */
  console.log("");
  for (const fj of [0, 300]) {
    S.seite = F(30); S.fj = ""; S.index = ""; S.fjStau = 0;
    const N = await geraet();
    const x0 = await oeffnen(N, "/index.html?mit-sw");
    await x0.pg.waitForLoadState("load").catch(() => {});
    await x0.pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
    await zu(x0);
    const x1 = await oeffnen(N, "/index.html?mit-sw");
    await x1.pg.waitForLoadState("load").catch(() => {});
    await schlaf(1200);
    await zu(x1);
    S.seite = F(31); S.index = "stau"; S.stauMs = 400; S.fjStau = fj;
    const x = await oeffnen(N, "/index.html?ohne-sw");
    await x.pg.waitForLoadState("load").catch(() => {});
    await schlaf(2500);
    const l = await lage(x.pg), ix = indexAb(x.ab);
    const regs = await x.pg.evaluate(() => navigator.serviceWorker.getRegistrations().then((r) => r.length)).catch(() => -1);
    await zu(x);
    S.index = ""; S.fjStau = 0;
    await schlaf(1500);
    const y = await oeffnen(N, "/index.html");
    await y.pg.waitForLoadState("load").catch(() => {});
    const gef = await y.pg.evaluate(() => !!(navigator.serviceWorker && navigator.serviceWorker.controller)).catch(() => null);
    await zu(y);
    const was = " (fassung.json " + fj + " ms)";
    sage(l.fassung === F(31) && l.seiten === 1 && ix[0] && l.marke === ix[0].marke, "N  ?ohne-sw, Server hat " + F(31) + ": die Seite kommt frisch aus dem Netz, kein Neuladen" + was,
      JSON.stringify({ f: l.fassung, marke: l.marke, adressen: l.adressen, netz: ix.map((q) => q.url + " " + q.marke) }));
    sage(regs === 0, "N  … nach 2,5 s ist der Helfer abgemeldet" + was, "Anmeldungen " + regs);
    sage(gef === false, "N  … das nächste Öffnen läuft ohne Helfer" + was, "geführt " + gef);
    sage(!N.seitenfehler.length, "   keine Seitenfehler (N)" + was, N.seitenfehler.slice(0, 3).join(" | "));
    await N.ctx.close();
  }
  S.seite = "";

  /* ================= M: messung.js „neu" nur auf der ersten Seite nach dem Neuladen durch den Wächter ================= */
  console.log("");
  {
    const M = await geraet();
    await M.ctx.addInitScript(() => { try { localStorage.setItem("dma-mess-pruef", "schnell"); } catch (e) {} });
    const zeilen = (pg) => pg.evaluate(() => { try { return (JSON.parse(localStorage.getItem("dma-mess-kiste") || "[]") || []).filter((x) => x.a === "mess-start").map((x) => ({ f: x.d.f, typ: x.d.typ, neu: x.d.neu })); } catch (e) { return []; } }).catch(() => []);
    /* Seite 1 = F(11); fassung.json sagt (1,5 s später) F(12), und der Server hat inzwischen F(12) → der Wächter lädt einmal neu */
    S.seite = F(11); S.fj = F(12); S.fjStau = 1500;
    const { pg } = await M.neuerTab();
    await pg.goto(HIER + "/index.html", { waitUntil: "commit" });
    S.seite = F(12);
    const da = await bis(pg, (f) => String(window.DMA_VERSION) === f && document.readyState === "complete", 20000, F(12));
    const z1 = await bis(pg, () => { try { return JSON.parse(localStorage.getItem("dma-mess-kiste") || "[]").some((x) => x.a === "mess-start"); } catch (e) { return false; } }, 20000);
    const l1 = await lage(pg), r1 = await zeilen(pg);
    sage(da && z1 && l1.seiten === 2 && r1.length === 1 && r1[0].f === F(12) && r1[0].typ === "navigate" && r1[0].neu === 1,
      "M  erste Seite nach dem Neuladen durch den Wächter: mess-start neu = 1", JSON.stringify({ adressen: l1.adressen, zeilen: r1 }));
    S.fjStau = 0; S.fj = "";
    await pg.reload({ waitUntil: "load" });
    const z2 = await bis(pg, () => { try { return JSON.parse(localStorage.getItem("dma-mess-kiste") || "[]").filter((x) => x.a === "mess-start").length >= 2; } catch (e) { return false; } }, 20000);
    const r2 = await zeilen(pg);
    sage(z2 && r2.length === 2 && r2[1].typ === "reload" && r2[1].neu === 0, "M  danach ein Neuladen von Hand im selben Tab: neu = 0 (vorher 1)", JSON.stringify(r2));
    sage(!M.seitenfehler.length, "   keine Seitenfehler (M)", M.seitenfehler.slice(0, 3).join(" | "));
    S.seite = "";
    await M.ctx.close();
  }

  await br.close(); srv.close();
  console.log("\n  " + (fehler ? fehler + " FEHLER" : "Alles in Ordnung.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
