#!/usr/bin/env node
/* =====================================================================
   SONDE 885 — VORAB-LADEN DER SEITE IM SERVICE WORKER (Fassung 886,
   Ladezeit-Entwurf Schritt C: navigation preload)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller" · (Funk
   263): „sofort im Livestream wie bei HelloTalk" · (Funk 310/312): „das
   Maximum rausholen". Feldmessung 14.10. (Android 11, Service Worker
   an): erstes Byte der Seite nach 616 ms, obwohl nur 1 KB übers Netz
   ging – der Browser weckte erst den Helfer, dann fragte der das Netz.
   Jetzt fragt der Browser das Netz, WÄHREND er den Helfer weckt.

   Der Server dieser Sonde schreibt jede Anfrage mit (Pfad, Kopf
   „Service-Worker-Navigation-Preload") und spielt Funkloch und Stau für
   /index.html. Geprüft:
     1  Anmeldung: sw.js schaltet das Vorab-Laden ein (getState).
     2  Hauptseite, Helfer wach: je Öffnen GENAU EINE Anfrage für
        /index.html, und sie trägt den Vorab-Kopf; die Seite kam über
        den Helfer (workerStart > 0).
     3  Hauptseite, Helfer schlafend (gestoppt wie nach einer Pause –
        der Fall, für den es gebaut ist): dasselbe.
     4  Andere Seiten im Bereich (Prüfseiten, Weiterleitung, 404): je
        Öffnen genau eine Anfrage – ohne respondWith fragte Chrome sie
        zweimal (Vorab + Rückfall, gemessen) –, Inhalt, Ziel und Status
        unverändert.
     5  Der Speicher der Seite (Ausweichseite) wird aus der Vorab-Antwort
        aufgefrischt.
     6  Funkloch (der Server bricht /index.html ab): sofort die
        gespeicherte Seite (< 2,5 s), mit dem Stand aus 5.
     7  Stau (/index.html antwortet erst nach 9 s): nach 6 s die
        gespeicherte Seite (≥ 5,8 s und ≤ 6,9 s), dabei nur EINE Anfrage
        ans Netz; die späte Antwort landet trotzdem im Speicher.
     8  fassung.json kommt immer frisch vom Netz (zweimal gefragt =
        zweimal beim Server), gestempelte Dateien weiter aus dem Speicher.
     9  Update: ein Gerät mit dem alten Helfer (884) bekommt das
        Vorab-Laden beim nächsten Öffnen – ohne dass die offene Seite neu
        lädt (kein Neuladen mitten im Klassenzimmer).
    10  ?ohne-sw meldet den Helfer weiter ab.
    11  Sonde 694 (Zwischenspeicher, min/, fassung.json, Leerlauf)
        unverändert: mit diesem sw.js wie mit dem sw.js aus 02613a71 alles
        grün – bis auf 694 Prüfung 3a, die schon mit 884 meist rot ist
        (min/spiel.js kommt erst in der Ruhepause; siehe unten).
   Gegenprobe 17.10.: alter Stand (02613a71) 6 rot (1, 2b, 3b, 5, 9b,
   9d); „naives" Vorab-Laden (eingeschaltet, aber nicht benutzt) 12 rot
   (2, 3, 4, 5, 7, 9: doppelte Anfragen); ohne waitUntil 1 rot (7c).

   FASSUNG 886 — S1 (pruefe-885-schale.js): seitdem kommt die Hauptseite
   zuerst aus dem Speicher. Die Sonde erkennt das am sw.js (Kopf
   x-dma-fassung) und prüft in 5 und 7 dann: 5 – die Seite ist die
   gespeicherte oder (hat das Netz schon geantwortet, als der Helfer den
   Speicher gelesen hatte – hier im schnellen Prüfnetz oft) die frische;
   der Speicher wird aus der Vorab-Antwort aufgefrischt;
   7 – im Stau kommt die gespeicherte Seite SOFORT (< 2,5 s) statt nach
   6 s. Alles andere (eine Anfrage je Öffnen, Vorab-Kopf, späte Antwort im
   Speicher, andere Seiten, fassung.json, ?ohne-sw, 694) gilt unverändert.

   Aufruf:  node werkzeug/pruefe-885-swvorladen.js
   Gegenprobe: WURZEL=<ordner mit altem index.html, sw.js, min/> node …
   (OHNE_694=1 lässt Prüfung 11 weg.)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const { execFileSync, spawnSync } = require("child_process");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const REPO = path.join(__dirname, "..");
/* FASSUNG 886 — S1: Hauptseite zuerst aus dem Speicher (Prüfungen 5 und 7 entsprechend) */
const S1 = /x-dma-fassung/.test(fs.readFileSync(path.join(WURZEL, "sw.js"), "utf8"));
const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".mp3": "audio/mpeg", ".woff2": "font/woff2" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));

/* der alte Helfer (884, ohne Vorab-Laden) für Prüfung 9 – aus git, nicht aus WURZEL */
let ALT_SW = null;
try { ALT_SW = execFileSync("git", ["-C", REPO, "show", "02613a71:sw.js"], { stdio: ["ignore", "pipe", "ignore"] }); } catch (e) {}

(async () => {
  /* ---------- Server ---------- */
  const anfragen = [];
  const S = { index: "", marke: "", stauMs: 0, swAlt: false };
  const srv = http.createServer((q, a) => {
    const i = q.url.indexOf("?");
    let p = decodeURIComponent(i < 0 ? q.url : q.url.slice(0, i)); if (p === "/") p = "/index.html";
    anfragen.push({ p, url: q.url, vorab: q.headers["service-worker-navigation-preload"] || "", t: Date.now() });
    /* erfundene Seiten im Bereich des Helfers (nicht im Ordner) */
    if (p === "/__sonde-andere.html") { a.writeHead(200, { "Content-Type": TYP[".html"] }); return a.end("<!doctype html><title>andere</title><p id=x>andere Seite " + (q.url.split("?")[1] || "") + "</p>"); }
    if (p === "/__sonde-weg") { a.writeHead(302, { Location: "/__sonde-andere.html?von=weg" }); return a.end(); }
    if (p === "/__sonde-fehlt.html") { a.writeHead(404, { "Content-Type": TYP[".html"] }); return a.end("<!doctype html><p id=x>gibt es nicht</p>"); }
    if (p === "/sw.js" && S.swAlt && ALT_SW) { a.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-cache" }); return a.end(ALT_SW); }
    if (p === "/index.html" && S.index === "aus") { q.socket.destroy(); return; }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    let body = fs.readFileSync(f);
    const kopf = { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream" };
    if (p === "/index.html") {
      kopf["Cache-Control"] = "no-cache";
      if (S.marke) body = Buffer.from(String(body).replace("<head>", "<head><!-- SONDE-MARKE:" + S.marke + " -->"));
      if (S.index === "stau") {
        return setTimeout(() => { if (!a.destroyed) { a.writeHead(200, kopf); a.end(body); } }, S.stauMs);
      }
    }
    if (p === "/sw.js" || p === "/fassung.json") kopf["Cache-Control"] = "no-cache";
    a.writeHead(200, kopf); a.end(body);
  }).listen(0, "127.0.0.1");
  await new Promise((r) => srv.on("listening", r));
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--no-proxy-server", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1"] });
  const fenster = async () => {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    const pg = await ctx.newPage();
    const seitenfehler = [];
    pg.on("pageerror", (e) => seitenfehler.push(String(e.message || e).slice(0, 120)));
    const cdp = await ctx.newCDPSession(pg);
    await cdp.send("ServiceWorker.enable").catch(() => {});
    return { ctx, pg, cdp, seitenfehler };
  };
  const indexAb = (ab) => anfragen.slice(ab).filter((x) => x.p === "/index.html");
  /* bis eine Abfrage in der Seite (darf ein Versprechen liefern) wahr ist – von hier aus gefragt, alle 100 ms */
  const bis = async (pg, f, ms) => { const ende = Date.now() + ms; while (Date.now() < ende) { if (await pg.evaluate(f).catch(() => false)) return true; await schlaf(100); } return false; };
  const anmelden = async (pg) => {
    await pg.goto(HIER + "/index.html?mit-sw", { waitUntil: "load" });
    return pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).then(() => true, () => false);
  };
  const vorabStand = (pg) => pg.evaluate(async () => {
    const r = await navigator.serviceWorker.ready;
    return r.navigationPreload ? r.navigationPreload.getState() : "fehlt";
  }).catch((e) => "FEHLER " + e.message);
  const ueberHelfer = (pg) => pg.evaluate(() => { const n = performance.getEntriesByType("navigation")[0]; return !!(n && n.workerStart > 0); }).catch(() => false);
  const gespeichert = (pg) => pg.evaluate(async () => {
    const k = await caches.open("dma-seite-1"); const r = await k.match("seite");
    if (!r) return null; const t = await r.text(); const m = t.match(/SONDE-MARKE:(\w+)/); return m ? m[1] : "ohne Marke";
  }).catch((e) => "FEHLER " + e.message);
  const marke = (pg) => pg.evaluate(() => { const m = document.head && document.head.innerHTML.match(/SONDE-MARKE:(\w+)/); return m ? m[1] : null; }).catch(() => null);
  const schlafen = async (cdp) => { await cdp.send("ServiceWorker.stopAllWorkers").catch(() => {}); await schlaf(300); };

  console.log("\nSONDE 885 — Vorab-Laden im Service Worker   (Stand: " + WURZEL + ")\n");

  /* ---------- 1–8, 10: ein Gerät ---------- */
  {
    const { ctx, pg, cdp, seitenfehler } = await fenster();
    const ok = await anmelden(pg);
    sage(ok, "sw.js führt die Seite (?mit-sw)");
    const st = await vorabStand(pg);
    sage(st && st.enabled === true, "1  sw.js schaltet das Vorab-Laden ein", JSON.stringify(st));

    /* 2: Helfer wach */
    console.log("");
    let ein = 0, kopf = 0, helfer = 0; const n2 = [];
    for (let k = 0; k < 3; k++) {
      const ab = anfragen.length;
      await pg.goto(HIER + "/index.html?mit-sw", { waitUntil: "load" });
      await schlaf(200);
      const ix = indexAb(ab); n2.push(ix.length + (ix[0] && ix[0].vorab ? "v" : ""));
      if (ix.length === 1) ein++;
      if (ix.length && ix.every((x) => x.vorab === "true")) kopf++;
      if (await ueberHelfer(pg)) helfer++;
    }
    sage(ein === 3, "2  Helfer wach: je Öffnen genau EINE Anfrage für /index.html", n2.join(" "));
    sage(kopf === 3, "2  … und sie trägt den Vorab-Kopf (Service-Worker-Navigation-Preload: true)", n2.join(" "));
    sage(helfer === 3, "2  … die Seite kam über den Helfer (workerStart > 0)", helfer + "/3");

    /* 3: Helfer schlafend */
    ein = 0; kopf = 0; helfer = 0; n2.length = 0;
    for (let k = 0; k < 3; k++) {
      await schlafen(cdp);
      const ab = anfragen.length;
      await pg.goto(HIER + "/index.html?mit-sw", { waitUntil: "load" });
      await schlaf(200);
      const ix = indexAb(ab); n2.push(ix.length + (ix[0] && ix[0].vorab ? "v" : ""));
      if (ix.length === 1) ein++;
      if (ix.length && ix.every((x) => x.vorab === "true")) kopf++;
      if (await ueberHelfer(pg)) helfer++;
    }
    sage(ein === 3, "3  Helfer schlafend (nach einer Pause): je Öffnen genau EINE Anfrage", n2.join(" "));
    sage(kopf === 3, "3  … mit Vorab-Kopf: das Netz wird gefragt, während der Helfer aufwacht", n2.join(" "));
    sage(helfer === 3, "3  … die Seite kam über den Helfer", helfer + "/3");

    /* 4: andere Seiten im Bereich */
    console.log("");
    const andere = async (pfad, schlaeft) => {
      if (schlaeft) await schlafen(cdp);
      const ab = anfragen.length;
      const r = await pg.goto(HIER + pfad, { waitUntil: "load" }).catch((e) => null);
      await schlaf(150);
      const a = anfragen.slice(ab).filter((x) => /^\/__sonde-/.test(x.p));
      return { status: r ? r.status() : "FEHLER", url: pg.url().replace(HIER, ""), text: await pg.evaluate(() => (document.getElementById("x") || {}).textContent || "").catch(() => ""),
        n: a.length, liste: a.map((x) => x.url + (x.vorab ? "[v]" : "")).join(" ") };
    };
    const a1 = await andere("/__sonde-andere.html?eins", false);
    sage(a1.n === 1 && a1.status === 200 && a1.text === "andere Seite eins", "4  andere Seite im Bereich: genau eine Anfrage, Inhalt unverändert", JSON.stringify(a1));
    const a2 = await andere("/__sonde-andere.html?zwei", true);
    sage(a2.n === 1 && a2.status === 200 && a2.text === "andere Seite zwei", "4  … auch mit schlafendem Helfer", JSON.stringify(a2));
    const a3 = await andere("/__sonde-weg", false);
    sage(a3.n === 2 && a3.url === "/__sonde-andere.html?von=weg" && a3.text === "andere Seite von=weg", "4  Weiterleitung (302): landet am Ziel, je Schritt eine Anfrage", JSON.stringify(a3));
    const a4 = await andere("/__sonde-fehlt.html", false);
    sage(a4.n === 1 && a4.status === 404 && a4.text === "gibt es nicht", "4  404 bleibt 404, eine Anfrage", JSON.stringify(a4));

    /* 5: Speicher aus der Vorab-Antwort */
    console.log("");
    const g4 = await gespeichert(pg);
    S.marke = "A1";
    await schlafen(cdp);
    let ab = anfragen.length;
    await pg.goto(HIER + "/index.html?mit-sw", { waitUntil: "load" });
    await schlaf(600);
    const m5 = await marke(pg), g5 = await gespeichert(pg), ix5 = indexAb(ab);
    sage((S1 ? m5 === "A1" || m5 === (g4 === "ohne Marke" ? null : g4) : m5 === "A1") && g5 === "A1" && ix5.length === 1 && ix5[0].vorab === "true",
      "5  der Speicher der Seite wird aus der Vorab-Antwort aufgefrischt" + (S1 ? " (S1: die Seite ist die gespeicherte oder – schon da – die frische)" : ""),
      "Seite " + m5 + ", Speicher vorher " + g4 + ", nachher " + g5 + ", " + ix5.length + " Anfrage(n)" + (ix5[0] && ix5[0].vorab ? " mit Vorab-Kopf" : ""));

    /* 6: Funkloch */
    S.index = "aus"; S.marke = "";
    await schlafen(cdp);
    let t0 = Date.now();
    const r6 = await pg.goto(HIER + "/index.html?mit-sw", { waitUntil: "commit", timeout: 20000 }).then(() => true, (e) => e.message.split("\n")[0]);
    const dt6 = Date.now() - t0;
    await pg.waitForLoadState("domcontentloaded").catch(() => {});
    const m6 = await marke(pg);
    sage(r6 === true && m6 === "A1" && dt6 < 2500, "6  Funkloch: sofort die gespeicherte Seite", dt6 + " ms, Marke " + m6 + (r6 === true ? "" : ", " + r6));
    const da6 = await pg.waitForFunction(() => window.LiveChat && document.querySelector('.tape-tab[data-target="view-knowledge"]'), null, { timeout: 20000 }).then(() => true, () => false);
    sage(da6, "6  … und sie läuft (LiveChat und Reiter da)");

    /* 7: Stau */
    S.index = "stau"; S.stauMs = 9000; S.marke = "B2";
    await schlafen(cdp);
    ab = anfragen.length; t0 = Date.now();
    const r7 = await pg.goto(HIER + "/index.html?mit-sw", { waitUntil: "commit", timeout: 20000 }).then(() => true, (e) => e.message.split("\n")[0]);
    const dt7 = Date.now() - t0;
    await pg.waitForLoadState("domcontentloaded").catch(() => {});
    const m7 = await marke(pg);
    sage(r7 === true && m7 === "A1" && (S1 ? dt7 < 2500 : dt7 >= 5800 && dt7 <= 6900), S1 ? "7  Stau: sofort die gespeicherte Seite (S1; bis 884 nach 6 s)" : "7  Stau: nach 6 s die gespeicherte Seite (≤ 6 s + Anlauf)", dt7 + " ms, Marke " + m7 + (r7 === true ? "" : ", " + r7));
    await schlaf(Math.max(0, 9000 - (Date.now() - t0)) + 1500);
    const ix7 = indexAb(ab), g7 = await gespeichert(pg);
    sage(ix7.length === 1, "7  … dabei nur EINE Anfrage ans Netz (keine zweite neben der Vorab-Anfrage)", ix7.map((x) => x.url + (x.vorab ? "[v]" : "")).join(" "));
    sage(g7 === "B2", "7  … und die späte Antwort landet trotzdem im Speicher (nächstes Funkloch zeigt den neuen Stand)", "Speicher " + g7);
    S.index = ""; S.marke = "";

    /* 8: fassung.json frisch, Gestempeltes aus dem Speicher */
    console.log("");
    await pg.goto(HIER + "/index.html?mit-sw", { waitUntil: "load" });
    await pg.waitForFunction(() => window.LiveChat && window.DMA_SPIEL, null, { timeout: 30000 }).catch(() => {});
    await schlaf(1500);
    ab = anfragen.length;
    const r8 = await pg.evaluate(async () => {
      const a = await fetch("fassung.json?t=" + Date.now(), { cache: "no-store" }).then((r) => r.status);
      const b = await fetch("fassung.json?t=" + (Date.now() + 1), { cache: "no-store" }).then((r) => r.status);
      return [a, b];
    }).catch((e) => e.message);
    const n8 = anfragen.slice(ab).filter((x) => x.p === "/fassung.json").length;
    sage(n8 === 2 && String(r8) === "200,200", "8  fassung.json: zweimal gefragt = zweimal beim Server (nie aus dem Speicher)", n8 + "×, " + r8);
    ab = anfragen.length;
    await pg.reload({ waitUntil: "load" });
    await pg.waitForFunction(() => window.LiveChat && window.DMA_SPIEL, null, { timeout: 30000 }).catch(() => {});
    await schlaf(800);
    const gest = anfragen.slice(ab).filter((x) => /[?&]v=[0-9a-f]{10}$/.test(x.url));
    sage(gest.length === 0, "8  gestempelte Dateien kommen weiter aus dem Speicher des Helfers", gest.length + " übers Netz" + (gest.length ? ": " + gest.slice(0, 3).map((x) => x.p).join(", ") : ""));
    sage(!seitenfehler.length, "   keine Seitenfehler", seitenfehler.slice(0, 2).join(" | "));

    /* 10: Notaus */
    await pg.goto(HIER + "/index.html?ohne-sw", { waitUntil: "load" });
    const weg = await bis(pg, () => navigator.serviceWorker.getRegistrations().then((r) => r.length === 0), 8000);
    sage(weg, "10 ?ohne-sw meldet den Helfer weiter ab");
    await ctx.close();
  }

  /* ---------- 9: Update vom alten Helfer ---------- */
  console.log("");
  if (!ALT_SW) sage(false, "9  alter Helfer (git show 02613a71:sw.js) nicht lesbar");
  else {
    const { ctx, pg, cdp } = await fenster();
    S.swAlt = true;
    const ok = await anmelden(pg);
    const vor = await vorabStand(pg);
    sage(ok && vor && vor.enabled === false, "9  Ausgangslage: Gerät mit dem alten Helfer (884), Vorab-Laden aus", JSON.stringify(vor));
    S.swAlt = false;
    await pg.evaluate(() => { window.__sondeSeite = "dieselbe"; window.__sondeWechsel = 0;
      navigator.serviceWorker.addEventListener("controllerchange", () => { window.__sondeWechsel++; }); });
    /* der Browser prüft sw.js bei jedem Öffnen; hier wie beim Öffnen eines zweiten Fensters: update() */
    await pg.evaluate(() => navigator.serviceWorker.getRegistration().then((r) => r && r.update())).catch(() => {});
    await pg.waitForFunction(() => window.__sondeWechsel > 0, null, { timeout: 15000 }).catch(() => {});
    /* controllerchange kommt laut Regel VOR dem activate-Ereignis; eingeschaltet wird darin – also warten, bis der
       neue Helfer „activated" ist (dann ist activate samt waitUntil durch) */
    const aktiv = await bis(pg, () => navigator.serviceWorker.getRegistration().then((r) => !!(r && r.active && r.active.state === "activated" && !r.installing && !r.waiting)), 15000);
    if (!aktiv) console.log("       (der neue Helfer wurde in 15 s nicht „activated\")");
    const nach = await vorabStand(pg);
    const gleich = await pg.evaluate(() => window.__sondeSeite).catch(() => null);
    sage(nach && nach.enabled === true, "9  nach dem Update des Helfers ist das Vorab-Laden an", JSON.stringify(nach));
    sage(gleich === "dieselbe", "9  die offene Seite lädt dabei NICHT neu (Klassenzimmer bleibt)", "Seite " + gleich);
    await schlafen(cdp);
    const ab = anfragen.length;
    await pg.goto(HIER + "/index.html?mit-sw", { waitUntil: "load" });
    await schlaf(200);
    const ix = indexAb(ab);
    sage(ix.length === 1 && ix[0].vorab === "true", "9  beim nächsten Öffnen: eine Anfrage mit Vorab-Kopf", ix.map((x) => x.url + (x.vorab ? "[v]" : "")).join(" "));
    await ctx.close();
  }

  await br.close(); srv.close();

  /* ---------- 11: Sonde 694 – mit diesem sw.js dasselbe Ergebnis wie mit dem alten ----------
     Die Sonde 694 läuft zweimal gegen WURZEL: einmal mit dem sw.js aus WURZEL, einmal mit dem sw.js aus 02613a71 (nur
     diese eine Datei getauscht). Verglichen wird, WELCHE Prüfungen grün und rot sind. Hinweis (17.10.): 694 Prüfung 3a
     („beim erneuten Öffnen kommt KEINE gestempelte Datei mehr übers Netz") ist schon mit 884 meist rot – min/spiel.js
     wird erst nach dem Start in der Ruhepause geholt und ist beim zweiten Öffnen (1,5 s später) oft noch nicht im
     Speicher (gemessen 17.10.: 884-sw.js 7 von 8 Läufen rot, neues sw.js 8 von 8; jedes Mal NUR min/spiel.js). Ein
     solches Rot zählt hier als „bekannt"; jede andere rote Prüfung oder eine andere Datei in 3a ist ein Fehler. */
  console.log("");
  if (process.env.OHNE_694) console.log("  (11 übersprungen: OHNE_694)");
  else if (!ALT_SW) sage(false, "11 alter Helfer (git show 02613a71:sw.js) nicht lesbar");
  else {
    const quelle = fs.readFileSync(path.join(__dirname, "pruefe-694-leistung.js"), "utf8");
    const z1 = 'const WURZEL = path.join(__dirname, "..");', z2 = "    const f = path.join(WURZEL, p);", z3 = "|| !f.startsWith(WURZEL) ||";
    if (![z1, z2, z3].every((z) => quelle.split(z).length === 2)) sage(false, "11 Sonde 694: die zu ersetzenden Zeilen sind nicht (genau einmal) da");
    else {
      const d = fs.mkdtempSync(path.join(os.tmpdir(), "dma-885-sw-694-"));
      const f = path.join(d, "pruefe-694-leistung.js"), alt = path.join(d, "sw-884.js");
      fs.writeFileSync(alt, ALT_SW);
      fs.writeFileSync(f, quelle.replace(z1, "const WURZEL = " + JSON.stringify(WURZEL) + ";")
        .replace(z2, '    const f = p === "/sw.js" && process.env.SW_DATEI ? process.env.SW_DATEI : path.join(WURZEL, p);')
        .replace(z3, "|| !(f.startsWith(WURZEL) || f === process.env.SW_DATEI) ||"));
      const lauf694 = (sw) => {
        const r = spawnSync(process.execPath, [f], { encoding: "utf8", timeout: 240000, env: Object.assign({}, process.env, { SW_DATEI: sw || "" }) });
        /* je Prüfung „ok"/„FEHL" + Text; 3a rot NUR wegen min/spiel.js = der bekannte Wettlauf aus 884 (Ruhepause) */
        const zeilen = String(r.stdout || "").split("\n").filter((z) => /^\s+(ok|FEHL)\b/.test(z)).map((z) => {
          const [kopf, rest] = [z.trim().split(/\s{3,}/)[0], z.trim().split(/\s{3,}/).slice(1).join(" ")];
          const gest = (rest.match(/\/[^\s,]+\?v=[0-9a-f]{10}/g) || []);
          return /^FEHL beim erneuten Öffnen kommt KEINE gestempelte/.test(kopf) && gest.length && gest.every((u) => /^\/min\/spiel\.js\?/.test(u)) ? "bekannt (spiel.js-Wettlauf, 884) " + kopf.slice(5) : kopf;
        });
        return { zeilen, rot: zeilen.filter((z) => /^(FEHL|bekannt)/.test(z)), status: r.status };
      };
      const neu = lauf694(""), vorher = lauf694(alt);
      fs.rmSync(d, { recursive: true, force: true });
      const ohne = (z) => z.map((x) => x.replace(/^bekannt \(spiel\.js-Wettlauf, 884\) /, "ok   "));
      const gleich = neu.zeilen.length >= 10 && ohne(neu.zeilen).join("\n") === ohne(vorher.zeilen).join("\n") && !neu.zeilen.some((z) => /^FEHL/.test(z));
      sage(gleich, "11 Sonde 694 unverändert: mit diesem sw.js alles grün wie mit dem alten (02613a71) – bis auf den bekannten spiel.js-Wettlauf in 3a",
        neu.zeilen.length + " Prüfungen, rot neu: " + (neu.rot.join(" | ") || "keine") + " · rot alt: " + (vorher.rot.join(" | ") || "keine"));
    }
  }

  console.log("\n  " + (fehler ? fehler + " FEHLER" : "Alles in Ordnung.") + "\n");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
