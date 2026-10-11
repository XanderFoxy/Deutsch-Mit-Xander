#!/usr/bin/env node
/* =====================================================================
   SONDE 884 — VOLLBILD: ERST AUS, DANN ROLLEN; WALKIE-FELD BLEIBT ÜBER
   DER TASTATUR (Walkie 313, Funk 252)
   ---------------------------------------------------------------------
   XANDER (Walkie 313 / Funk 252): Klassenzimmer – kein Schwarzbild beim
   Öffnen der Tastatur, kein schwarzer Rand beim Verlassen.
   Befund (alter Stand, Android-Kontext 390×844): wer das Klassenzimmer
   verließ, bekam ZUERST das weiche Rollen zum neuen Bereich (rAF, +16 ms)
   und erst 63/65 ms nach dem Tipp das Ende des Vollbilds (60-ms-Zeitgeber
   im Fang-Hörer). Android baut beim Vollbild-Ende das Fenster um – mitten
   in einer laufenden Rollbewegung. Und das Walkie-Schreibfeld „An Claude"
   lag 707 px tief, bei offener Tastatur sind nur ~506 px frei.
   Geprüft (Playwright, Chromium, index.html?quelle=1, Android-Kontext mit
   isMobile/hasTouch und Pixel-Kennung):
     A  Vollbild (echte Tipps auf „Wissen" und „Klassenzimmer"; Verlassen
        per el.click(), damit Playwright nicht selbst rollt)
        A1 nach dem Betreten ist das Vollbild an
        A2 Unterreiter Kompass: a) exitFullscreen ≤ 10 ms nach dem Klick,
           b) gerollt wird erst nach fullscreenchange, c) Endlage: Anfang
           von #sub-kompass oben (±4 px), d) danach kein Vollbild, Kino aus
        A3 Hauptreiter Lernen: a) exitFullscreen ≤ 10 ms, b) Lernen offen,
           kein Vollbild
        A4 bleibt drin: Tipp auf „Wissen" und wieder „Klassenzimmer" –
           weiter Vollbild, kein exitFullscreen
        A5 Netz: exitFullscreen tut nichts, fullscreenchange kommt nie –
           gerollt wird trotzdem 400–700 ms nach dem Klick
        A6 ohne Vollbild (wie am iPhone): gerollt wird ≤ 40 ms nach dem Klick
        A7 schnell zurück: Kompass, nach 100 ms wieder Klassenzimmer –
           am Ende wieder Vollbild, und der Kompass rollt nicht hinterher
        A8 Tipp aufs ⓘ einer Pille (wechselt nichts): Vollbild bleibt
     B  Walkie (Betreiber und Datenbank nachgebaut; visualViewport ist ein
        nachgebauter EventTarget mit setzbarer Höhe)
        B1 Leiste ohne Tastatur: Lage und Größe gemerkt
        B2 ganz hinuntergerollt, „An Claude"-Feld angetippt, vv-Höhe 506
           (390×844) bzw. 468 (360×780) → Feld-Unterkante ≤ vv-Höhe − 8
        B3 Lage, Größe und Hintergrundfarbe der Leiste unverändert (±1 px)
        B4 Feld verlässt den Fokus, vv-Höhe zurück → Polster wieder leer;
           der getippte Text bleibt im Feld und im Entwurf
        B2m/B4m dasselbe mit einer kürzeren Leiste (keine Frage, die Leiste
           reicht aber unter die Tastatur): Feld hinauf, Höhe bleibt gleich
           (sie wird solange festgehalten), danach wieder wie vorher
        B5 am Rechner (kein grober Zeiger): Fokus ändert weder Rollstand
           noch Polster
     C  Wächter für den Befund: Klassenzimmer im Vollbild, Chatfeld
        fokussiert, Fenster 844 → 520 hoch: die Seite ruft in 1,5 s weder
        scrollTo noch scrollIntoView. Dazu keine Seitenfehler.
   EHRLICHE GRENZE: die Sonde beweist die REIHENFOLGE (Vollbild-Ende vor
   dem Rollen) und die Lage des Walkie-Felds – nicht das Ausbleiben des
   Android-Schwarz. Das entsteht im Android-Fenster, nicht in der Seite;
   Chromium ändert beim Vollbild keine Größe. Bestätigen kann das nur
   Xander auf dem Telefon.
   Gegenprobe: GEGEN=<ordner> legt app.js und rueckfrage.js aus diesem
   Ordner über WURZEL (z. B. git show HEAD:app.js > $SCRATCH/alt/app.js)
   → A2a, A2b, A3a, A5, B2 und B2m rot (gemessen: exitFullscreen +61/+62 ms,
   gerollt +11 ms vor fullscreenchange +88 ms, Feld-Unterkante 707 > 498).
   Aufruf: node werkzeug/pruefe-884-vollbild.js
           MIN=1 node werkzeug/pruefe-884-vollbild.js      (min/ statt ?quelle)
           GEGEN=/pfad/zum/alten/stand node werkzeug/pruefe-884-vollbild.js
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const GEGEN = process.env.GEGEN ? path.resolve(process.env.GEGEN) : "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
const PIXEL = "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) "
  + "Chrome/129.0.0.0 Mobile Safari/537.36";
let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const r1 = (x) => (x == null || isNaN(x)) ? String(x) : (Math.round(x * 10) / 10).toFixed(1);
setTimeout(() => { console.log("\nZeitlimit erreicht."); process.exit(2); }, 8 * 60 * 1000).unref();

/* Der Server: WURZEL, nur app.js und rueckfrage.js auf Wunsch aus GEGEN. Dateien einmal lesen. */
function server() {
  const cache = new Map();
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    let f = path.join(WURZEL, p);
    if (GEGEN && (p === "/app.js" || p === "/rueckfrage.js") && fs.existsSync(path.join(GEGEN, p))) f = path.join(GEGEN, p);
    if (!cache.has(f)) {
      const da = (f.startsWith(WURZEL) || (GEGEN && f.startsWith(GEGEN))) && fs.existsSync(f) && !fs.statSync(f).isDirectory();
      cache.set(f, da ? fs.readFileSync(f) : null);
    }
    const inhalt = cache.get(f);
    if (!inhalt) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    a.end(inhalt);
  }).listen(0);
  return new Promise((r) => srv.on("listening", () => r(srv)));
}

/* Was die Sonde in der Seite mitschreibt (vor jedem Skript der Seite):
   Klick (Fang-Hörer auf window, läuft vor allen anderen), exitFullscreen,
   requestFullscreen, fullscreenchange, scrollTo/scrollIntoView, Rollen
   der Seite, lange Aufgaben. Auf Wunsch ein nachgebautes visualViewport. */
function mitschreiber(o) {
  try {
    localStorage.setItem("dma_tour_seen", "1");
    localStorage.setItem("dma_tutor", "aus");
    if (o.walkie) localStorage.setItem("dma_funk_offen", "true");
  } catch (e) {}
  const P = window.__vb = { log: [], klick: -1 };
  const jetzt = () => performance.now();
  const merk = (art, dazu) => { P.log.push(Object.assign({ art: art, t: jetzt() }, dazu || {})); };
  P.merk = merk;
  window.addEventListener("click", (e) => {
    P.klick = jetzt();
    const z = e.target && e.target.closest && e.target.closest("[data-sub], [data-target]");
    merk("klick", { ziel: z ? (z.dataset.sub || z.dataset.target) : "" });
  }, true);
  const exitEcht = Document.prototype.exitFullscreen;
  if (exitEcht) {
    Document.prototype.exitFullscreen = function () {
      merk("exit");
      if (window.__keinVollbildEnde) return Promise.resolve();
      return exitEcht.apply(this, arguments);
    };
  }
  const reqEcht = Element.prototype.requestFullscreen;
  if (reqEcht) {
    Element.prototype.requestFullscreen = function () { merk("request"); return reqEcht.apply(this, arguments); };
    P.reqNeu = Element.prototype.requestFullscreen;
  }
  document.addEventListener("fullscreenchange", () => merk("fsc", { voll: Boolean(document.fullscreenElement) }), true);
  const umhuellen = (ding, name, art) => {
    const echt = ding[name];
    if (typeof echt !== "function") return;
    ding[name] = function () {
      merk(art, { ziel: (this && this.id) || "" });
      return echt.apply(this, arguments);
    };
  };
  umhuellen(window, "scrollTo", "rollen");
  umhuellen(window, "scroll", "rollen");
  umhuellen(window, "scrollBy", "rollen");
  umhuellen(Element.prototype, "scrollIntoView", "rollen");
  window.addEventListener("scroll", (e) => {
    if (e.target === document) merk("scroll", { y: Math.round(window.scrollY) });
  }, { capture: true, passive: true });
  try {
    new PerformanceObserver((l) => l.getEntries().forEach((x) => merk("lang", { start: x.startTime, dauer: x.duration })))
      .observe({ type: "longtask", buffered: true });
  } catch (e) {}
  if (o.vv) {
    /* Die Tastatur in Chromium nachgebaut: visualViewport mit setzbarer Höhe. */
    const vv = new EventTarget();
    Object.defineProperties(vv, {
      height: { get: () => window.__vvH || window.innerHeight },
      width: { get: () => window.innerWidth },
      offsetTop: { get: () => 0 }, offsetLeft: { get: () => 0 },
      pageTop: { get: () => window.scrollY }, pageLeft: { get: () => window.scrollX },
      scale: { get: () => 1 }
    });
    Object.defineProperty(window, "visualViewport", { configurable: true, get: () => vv });
    window.__vvSetzen = (h) => { window.__vvH = h; vv.dispatchEvent(new Event("resize")); };
  }
}

(async () => {
  console.log("SONDE 884 — Vollbild beim Verlassen, Walkie-Feld über der Tastatur"
    + (GEGEN ? "   (GEGENPROBE: app.js/rueckfrage.js aus " + GEGEN + ")" : "") + (process.env.MIN ? "   (min/)" : "   (?quelle)"));
  const srv = await server();
  /* MIN=1: die verkleinerte Kopie (min/, mit den Teilen) statt der Quellen – so, wie die Seite ausgeliefert wird. */
  const url = "http://127.0.0.1:" + srv.address().port + "/index.html" + (process.env.MIN ? "" : "?quelle=1");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const seitenfehler = [];

  async function fenster(o) {
    const ctx = await br.newContext(Object.assign({
      viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
      userAgent: PIXEL, serviceWorkers: "block"
    }, o.ctx || {}));
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await ctx.addInitScript(mitschreiber, { vv: Boolean(o.vv), walkie: Boolean(o.walkie) });
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => seitenfehler.push((o.name || "") + ": " + String(e.message || e).split("\n")[0]));
    await pg.goto(url, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.DMA_PRUEF && window.DMA_PRUEF.kinoStand
      && document.getElementById("knowledgeSubnav") && window.Rueckfrage, null, { timeout: 60000 });
    await pg.waitForFunction(() => document.readyState === "complete", null, { timeout: 60000 });
    await schlaf(1800);   /* Rueckfrage.start() läuft 1,5 s nach DOMContentLoaded */
    return { ctx, pg };
  }
  const stand = (pg) => pg.evaluate(() => Object.assign(DMA_PRUEF.kinoStand(), { fs: Boolean(document.fullscreenElement) }));
  const marke = (pg) => pg.evaluate(() => { window.__vb.log = []; window.__vb.klick = -1; return performance.now(); });
  const protokoll = (pg) => pg.evaluate(() => window.__vb.log.slice());
  const ersterNach = (log, art, t0, pruef) => log.find((x) => x.art === art && x.t >= t0 && (!pruef || pruef(x)));
  async function insKlassenzimmer(pg) {
    await pg.tap('.tape-tab[data-target="view-knowledge"]');
    await schlaf(450);
    await pg.tap('#knowledgeSubnav [data-sub="sub-livechat"]');
    await schlaf(1100);
  }
  const verlassenPer = (pg, sel) => pg.evaluate((s) => document.querySelector(s).click(), sel);

  /* ================================================================ A */
  console.log("\nA  Vollbild beim Verlassen des Klassenzimmers (390×844, Android)");
  {
    const { ctx, pg } = await fenster({ name: "A" });
    await insKlassenzimmer(pg);
    const s1 = await stand(pg);
    sage(s1.fs && s1.laeuft, "A1 nach dem Betreten ist das Vollbild an",
      s1.fs ? JSON.stringify(s1) : "Vollbild in diesem Chromium nicht verfügbar – " + JSON.stringify(s1));

    /* A2 — Unterreiter Kompass */
    await marke(pg);
    await verlassenPer(pg, '#knowledgeSubnav [data-sub="sub-kompass"]');
    await schlaf(1600);
    let log = await protokoll(pg);
    let k = ersterNach(log, "klick", 0);
    let ex = k && ersterNach(log, "exit", k.t);
    let fc = k && ersterNach(log, "fsc", k.t, (x) => !x.voll);
    let ro = k && ersterNach(log, "rollen", k.t);
    sage(Boolean(ex) && ex.t - k.t <= 10, "A2a Kompass: exitFullscreen ≤ 10 ms nach dem Klick",
      ex ? "+" + r1(ex.t - k.t) + " ms" : "kein exitFullscreen");
    sage(Boolean(fc && ro) && ro.t >= fc.t, "A2b gerollt wird erst nach fullscreenchange",
      "fullscreenchange " + (fc ? "+" + r1(fc.t - k.t) : "–") + " ms, erstes Rollen "
      + (ro ? "+" + r1(ro.t - k.t) + " ms" : "–"));
    const lage = await pg.evaluate(() => {
      const el = document.getElementById("sub-kompass");
      const smt = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      const spt = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const r = el.getBoundingClientRect();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const soll = Math.max(0, Math.min(window.scrollY + r.top - smt - spt, max));
      return { y: Math.round(window.scrollY), soll: Math.round(soll), oben: Math.round(r.top), max: Math.round(max) };
    });
    sage(Math.abs(lage.y - lage.soll) <= 4, "A2c Endlage: Anfang von #sub-kompass oben (±4 px)",
      "Rollstand " + lage.y + ", soll " + lage.soll + ", Oberkante bei " + lage.oben + " px");
    const s2 = await stand(pg);
    sage(!s2.fs && !s2.laeuft && !s2.wach, "A2d danach kein Vollbild, Kino aus, Bildschirm nicht mehr wachgehalten",
      JSON.stringify(s2));
    const lang2 = log.filter((x) => x.art === "lang" && x.start >= k.t - 5);
    console.log("       (zur Kenntnis) lange Aufgaben im Übergang: " + (lang2.length
      ? lang2.map((x) => "+" + r1(x.start - k.t) + " ms/" + r1(x.dauer) + " ms").join(", ") : "keine"));

    /* A3 — Hauptreiter Lernen */
    await insKlassenzimmer(pg);
    await marke(pg);
    await verlassenPer(pg, '.tape-tab[data-target="view-learn"]');
    await schlaf(1200);
    log = await protokoll(pg);
    k = ersterNach(log, "klick", 0);
    ex = k && ersterNach(log, "exit", k.t);
    sage(Boolean(ex) && ex.t - k.t <= 10, "A3a Lernen: exitFullscreen ≤ 10 ms nach dem Klick",
      ex ? "+" + r1(ex.t - k.t) + " ms" : "kein exitFullscreen");
    const s3 = await pg.evaluate(() => ({ lernen: document.getElementById("view-learn").dataset.active === "true",
      fs: Boolean(document.fullscreenElement) }));
    sage(s3.lernen && !s3.fs, "A3b Lernen ist offen, kein Vollbild mehr", JSON.stringify(s3));

    /* A4 — bleibt drin */
    await insKlassenzimmer(pg);
    const s4a = await stand(pg);
    await marke(pg);
    await pg.tap('.tape-tab[data-target="view-knowledge"]');
    await schlaf(400);
    await pg.tap('#knowledgeSubnav [data-sub="sub-livechat"]');
    await schlaf(900);
    log = await protokoll(pg);
    const s4 = await stand(pg);
    sage(s4a.fs && s4.fs && s4.laeuft && !log.some((x) => x.art === "exit"),
      "A4 Tipp auf „Wissen“ und wieder „Klassenzimmer“: weiter Vollbild, kein exitFullscreen",
      "vorher " + s4a.fs + ", nachher " + JSON.stringify(s4) + ", exit " + log.filter((x) => x.art === "exit").length + "×");

    /* A8 — ein Tipp aufs ⓘ in einer Pille wechselt nichts (eigener Fang-Hörer), also bleibt auch das Vollbild */
    await marke(pg);
    await pg.tap('#knowledgeSubnav [data-sub="sub-kompass"] .subnav-info-icon');
    await schlaf(700);
    log = await protokoll(pg);
    const s8 = await pg.evaluate(() => Object.assign(DMA_PRUEF.kinoStand(), { fs: Boolean(document.fullscreenElement),
      drin: document.getElementById("sub-livechat").dataset.active === "true" }));
    sage(s8.fs && s8.laeuft && s8.drin && !log.some((x) => x.art === "exit"),
      "A8 Tipp aufs ⓘ der Kompass-Pille: man bleibt im Klassenzimmer, das Vollbild bleibt",
      JSON.stringify(s8) + ", exit " + log.filter((x) => x.art === "exit").length + "×");

    /* A7 — schnell zurück */
    await marke(pg);
    await verlassenPer(pg, '#knowledgeSubnav [data-sub="sub-kompass"]');
    await schlaf(100);
    const tZurueck = await pg.evaluate(() => performance.now());
    await pg.tap('#knowledgeSubnav [data-sub="sub-livechat"]');
    await schlaf(1400);
    log = await protokoll(pg);
    const s7 = await stand(pg);
    const kompassNach = log.filter((x) => x.art === "rollen" && x.ziel === "sub-kompass" && x.t >= tZurueck);
    sage(s7.fs && s7.laeuft, "A7 schnell zurück (Kompass, nach 100 ms Klassenzimmer): am Ende wieder Vollbild",
      JSON.stringify(s7) + ", requestFullscreen " + log.filter((x) => x.art === "request").length + "×");
    sage(kompassNach.length === 0, "A7b der Kompass rollt nach der Rückkehr nicht mehr hinterher",
      kompassNach.length ? kompassNach.length + "× scrollIntoView(#sub-kompass) nach der Rückkehr" : "");

    /* A5 — Netz: das Vollbild-Ende kommt nie */
    if (!s7.fs) await insKlassenzimmer(pg);
    await pg.evaluate(() => { window.__keinVollbildEnde = true; });
    await marke(pg);
    await verlassenPer(pg, '#knowledgeSubnav [data-sub="sub-kompass"]');
    await schlaf(1200);
    log = await protokoll(pg);
    k = ersterNach(log, "klick", 0);
    ro = k && ersterNach(log, "rollen", k.t);
    sage(Boolean(ro) && ro.t - k.t >= 400 && ro.t - k.t <= 700,
      "A5 Netz (kein fullscreenchange): gerollt wird trotzdem, 400–700 ms nach dem Klick",
      ro ? "+" + r1(ro.t - k.t) + " ms" : "nie gerollt");
    await pg.evaluate(() => { window.__keinVollbildEnde = false; return document.fullscreenElement ? document.exitFullscreen() : null; });
    await schlaf(400);

    /* A6 — ohne Vollbild (wie am iPhone) */
    await pg.evaluate(() => {
      window.__reqWeg = [Element.prototype.requestFullscreen, Element.prototype.webkitRequestFullscreen];
      delete Element.prototype.requestFullscreen;
      Element.prototype.requestFullscreen = undefined;
      Element.prototype.webkitRequestFullscreen = undefined;
    });
    await insKlassenzimmer(pg);
    const s6a = await stand(pg);
    await marke(pg);
    await verlassenPer(pg, '#knowledgeSubnav [data-sub="sub-kompass"]');
    await schlaf(900);
    log = await protokoll(pg);
    k = ersterNach(log, "klick", 0);
    ro = k && ersterNach(log, "rollen", k.t);
    sage(!s6a.fs && Boolean(ro) && ro.t - k.t <= 40, "A6 ohne Vollbild (iPhone): gerollt wird ≤ 40 ms nach dem Klick, wie bisher",
      (ro ? "+" + r1(ro.t - k.t) + " ms" : "nie gerollt") + (s6a.fs ? " (Vollbild war doch an)" : ""));
    await pg.evaluate(() => { Element.prototype.requestFullscreen = window.__reqWeg[0]; Element.prototype.webkitRequestFullscreen = window.__reqWeg[1]; });
    await ctx.close();
  }

  /* ================================================================ B */
  /* art „lang": eine offene Frage und eine lange Meldung (die Leiste ist voll, 84vh). art „mittel": keine Frage, eine
     sehr lange Meldung – die Leiste ist kürzer als ihre Höchsthöhe, reicht aber unter die Tastatur. */
  const walkieAufbauen = (pg, art) => pg.evaluate((art) => {
    const lang = (art === "mittel" ? "Kurz zum Stand von heute, damit du weißt, was du prüfen kannst, wenn du wieder im "
      + "Klassenzimmer bist. Die Leitung, der Platzwechsel und das Profilfoto sind schon drin; jetzt kommt das Vollbild "
      + "dran, und danach schaue ich mir noch einmal die Ladezeit von „Lernen“ an. " : "")
      + "Ich baue gerade Fassung 884: Verbindung, Chat und Klassenzimmer. "
      + "Beim Verlassen des Klassenzimmers geht das Vollbild jetzt zuerst aus, und erst danach rollt die Seite "
      + "zum neuen Bereich. Das Walkie-Schreibfeld soll über der Tastatur bleiben, damit du beim Schreiben siehst, "
      + "was du tippst. Bitte prüfe auf deinem Telefon, ob beim Öffnen der Tastatur noch ein schwarzes Bild kommt "
      + "und ob beim Verlassen ein schwarzer Rand bleibt. Wenn ja, schreib mir, wo genau und wie lange.";
    const fragen = art === "mittel" ? [] : [{ id: 901, thema: "Vollbild", frage: "Kommt beim Verlassen des Klassenzimmers noch ein schwarzer Rand?",
      art: "ja_nein", optionen: ["nur kurz", "bleibt stehen", "nur beim Lernen"], wo: "Wissen → Klassenzimmer → Kompass" }];
    const meldungen = [{ id: 31, erstellt: new Date().toISOString(), von: "claude", text: lang, gelesen: null }];
    const kette = (tab) => ({
      select() { return this; }, is() { return this; }, order() { return this; },
      limit() { return Promise.resolve({ data: tab === "betreiber_funk" ? meldungen : fragen, error: null }); },
      update() { return { eq() { return Promise.resolve({ error: null }); }, in() { return Promise.resolve({ error: null }); } }; },
      insert() { return Promise.resolve({ error: null }); }
    });
    Backend.isOwner = () => true;
    Backend.zugang = () => ({ from: (t) => kette(t) });
    window.Rueckfrage.holen();
  }, art || "lang");
  const leisteMessen = (pg) => pg.evaluate(() => {
    const l = document.querySelector(".rf-leiste");
    if (!l) return null;
    const r = l.getBoundingClientRect();
    const f = l.querySelector("textarea.rf-vorschlag-text");
    const fr = f ? f.getBoundingClientRect() : null;
    return { top: r.top, left: r.left, breite: r.width, hoehe: r.height, unten: r.bottom,
      farbe: getComputedStyle(l).backgroundColor, polster: l.style.paddingBottom, festHoehe: l.style.maxHeight, rollen: l.scrollTop,
      feldUnten: fr ? fr.bottom : null, fokus: document.activeElement === f };
  });

  for (const [b, h, vvH] of [[390, 844, 506], [360, 780, 468]]) {
    console.log("\nB  Walkie-Feld über der Tastatur (" + b + "×" + h + ", Android, Tastatur lässt " + vvH + " px)");
    const { ctx, pg } = await fenster({ name: "B" + b, vv: true, walkie: true, ctx: { viewport: { width: b, height: h } } });
    await walkieAufbauen(pg);
    await pg.waitForSelector(".rf-leiste textarea.rf-vorschlag-text", { timeout: 5000 });
    await schlaf(400);
    const grob = await pg.evaluate(() => matchMedia("(pointer: coarse)").matches);
    const b1 = await leisteMessen(pg);
    sage(Boolean(b1) && b1.hoehe > 100, "B1 Leiste ohne Tastatur gemerkt",
      b1 ? Math.round(b1.breite) + "×" + Math.round(b1.hoehe) + " bei " + Math.round(b1.left) + "/" + Math.round(b1.top)
        + ", grober Zeiger " + grob : "keine Leiste");
    await pg.evaluate(() => { const l = document.querySelector(".rf-leiste"); l.scrollTop = l.scrollHeight; });
    await schlaf(150);
    const b1u = await leisteMessen(pg);
    await pg.tap(".rf-leiste textarea.rf-vorschlag-text");
    await schlaf(120);
    await pg.evaluate((x) => window.__vvSetzen(x), vvH);
    await schlaf(700);
    const b2 = await leisteMessen(pg);
    sage(b2 && b2.fokus && b2.feldUnten <= vvH - 8, "B2 „An Claude“-Feld steht über der Tastatur (Unterkante ≤ " + (vvH - 8) + ")",
      "Feld-Unterkante " + r1(b1u.feldUnten) + " → " + r1(b2 && b2.feldUnten) + " px, Polster „" + (b2 && b2.polster) + "“");
    const gleich = b2 && Math.abs(b2.top - b1.top) <= 1 && Math.abs(b2.left - b1.left) <= 1
      && Math.abs(b2.breite - b1.breite) <= 1 && Math.abs(b2.hoehe - b1.hoehe) <= 1 && b2.farbe === b1.farbe;
    sage(gleich, "B3 Lage, Größe und Farbe der Leiste unverändert (±1 px)",
      b2 ? Math.round(b2.breite) + "×" + Math.round(b2.hoehe) + " bei " + Math.round(b2.left) + "/" + Math.round(b2.top) + ", " + b2.farbe : "");
    await pg.keyboard.type("Test 884 Vollbild");
    await pg.evaluate(() => document.activeElement && document.activeElement.blur());
    await pg.evaluate(() => window.__vvSetzen(window.innerHeight));
    await schlaf(500);
    const b4 = await pg.evaluate(() => {
      const l = document.querySelector(".rf-leiste");
      const f = l && l.querySelector("textarea.rf-vorschlag-text");
      let ent = {};
      try { ent = JSON.parse(localStorage.getItem("dma_funk_entwurf") || "{}"); } catch (e) {}
      return { polster: l ? l.style.paddingBottom : "?", festHoehe: l ? l.style.maxHeight : "?", feld: f ? f.value : "", entwurf: ent._vorschlag || "" };
    });
    sage(b4.polster === "" && b4.festHoehe === "" && /Test 884 Vollbild/.test(b4.feld) && /Test 884 Vollbild/.test(b4.entwurf),
      "B4 nach dem Schreiben: Polster wieder leer, Text bleibt im Feld und im Entwurf", JSON.stringify(b4));

    /* B2m — die kürzere Leiste (keine Frage): mit Polster allein wüchse sie erst nach unten, bevor sie rollen kann.
       Auch hier muss das Feld hinauf, und Lage, Größe und Farbe bleiben, wie sie waren. */
    await walkieAufbauen(pg, "mittel");
    await pg.waitForFunction(() => !document.querySelector(".rf-leiste .rf-frage-box"), null, { timeout: 5000 });
    await schlaf(300);
    const m1 = await leisteMessen(pg);
    const mittel = m1 && m1.unten > vvH + 20 && m1.hoehe < (h * 0.84) - 20;
    await pg.tap(".rf-leiste textarea.rf-vorschlag-text");
    await schlaf(120);
    await pg.evaluate((x) => window.__vvSetzen(x), vvH);
    await schlaf(700);
    const m2 = await leisteMessen(pg);
    sage(mittel && m2.fokus && m2.feldUnten <= vvH - 8 && Math.abs(m2.top - m1.top) <= 1 && Math.abs(m2.left - m1.left) <= 1
      && Math.abs(m2.breite - m1.breite) <= 1 && Math.abs(m2.hoehe - m1.hoehe) <= 1 && m2.farbe === m1.farbe,
      "B2m kürzere Leiste (" + Math.round(m1.hoehe) + " px, Unterkante " + Math.round(m1.unten) + "): Feld über der Tastatur, Größe gleich",
      "Feld-Unterkante " + r1(m1.feldUnten) + " → " + r1(m2.feldUnten) + " px, Höhe " + Math.round(m1.hoehe) + " → "
      + Math.round(m2.hoehe) + ", oben " + Math.round(m1.top) + " → " + Math.round(m2.top)
      + (mittel ? "" : " – KEIN mittlerer Fall, Meldung anpassen"));
    await pg.evaluate(() => document.activeElement && document.activeElement.blur());
    await pg.evaluate(() => window.__vvSetzen(window.innerHeight));
    await schlaf(500);
    const m3 = await leisteMessen(pg);
    sage(m3.polster === "" && m3.festHoehe === "" && Math.abs(m3.hoehe - m1.hoehe) <= 1, "B4m danach wieder die alte Höhe, kein Polster",
      Math.round(m3.hoehe) + " px, Polster „" + m3.polster + "“");
    await ctx.close();
  }

  console.log("\nB5 Walkie am Rechner (1280×800, Maus)");
  {
    const { ctx, pg } = await fenster({ name: "B5", vv: true, walkie: true,
      ctx: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false, userAgent: undefined } });
    await walkieAufbauen(pg);
    await pg.waitForSelector(".rf-leiste textarea.rf-vorschlag-text", { timeout: 5000 });
    await schlaf(300);
    for (const wo of ["unten", "mitte"]) {
      await pg.evaluate((w) => {
        const l = document.querySelector(".rf-leiste");
        if (w === "unten") l.scrollTop = l.scrollHeight;
        else { const f = l.querySelector("textarea.rf-vorschlag-text"); l.scrollTop = Math.max(0, f.offsetTop - l.clientHeight + f.offsetHeight + 4); }
      }, wo);
      await schlaf(150);
      const v = await leisteMessen(pg);
      await pg.click(".rf-leiste textarea.rf-vorschlag-text");
      await pg.evaluate(() => window.__vvSetzen(window.innerHeight));
      await schlaf(600);
      const n = await leisteMessen(pg);
      sage(n.fokus && n.rollen === v.rollen && n.polster === "" && n.festHoehe === "",
        "B5 am Rechner (Feld " + wo + "): Fokus ändert weder Rollstand noch Polster",
        "Rollstand " + v.rollen + " → " + n.rollen + ", Polster „" + n.polster + "“");
      await pg.evaluate(() => document.activeElement && document.activeElement.blur());
      await schlaf(250);
    }
    await ctx.close();
  }

  /* ================================================================ C */
  console.log("\nC  Wächter: Chatfeld im Vollbild, Fenster 844 → 520");
  {
    const { ctx, pg } = await fenster({ name: "C" });
    /* Damit das Chatfeld gezeichnet wird, steht die Lage auf „drin" (wie in pruefe-runde87-kino.js). */
    await pg.evaluate(() => {
      const echt = LiveChat.lage;
      LiveChat.moeglich = () => true;
      LiveChat.lage = () => Object.assign(echt(), { lage: "drin", raum: "klassenzimmer", ichId: "pruef", ichName: "Alex", moeglich: true, frei: 7 });
    });
    await insKlassenzimmer(pg);
    const vor = await pg.evaluate(() => {
      const form = document.getElementById("lcForm");
      if (form && !form.offsetParent) form.style.display = "flex";
      const feld = document.getElementById("lcFeld");
      return { feld: Boolean(feld), sichtbar: Boolean(feld && feld.offsetParent), fs: Boolean(document.fullscreenElement) };
    });
    await schlaf(600);
    await marke(pg);
    await pg.evaluate(() => { const f = document.getElementById("lcFeld"); if (f) f.focus(); });
    await pg.setViewportSize({ width: 390, height: 520 });
    await schlaf(1500);
    const log = await protokoll(pg);
    const ro = log.filter((x) => x.art === "rollen");
    sage(vor.feld && vor.sichtbar && ro.length === 0,
      "C  Chatfeld fokussiert, Fenster schrumpft: die Seite ruft weder scrollTo noch scrollIntoView",
      "Feld " + (vor.sichtbar ? "sichtbar" : vor.feld ? "unsichtbar" : "fehlt") + ", Vollbild " + vor.fs + ", Rollrufe " + ro.length
      + (ro.length ? " (" + ro.map((x) => "+" + r1(x.t) + " " + x.ziel).join(", ") + ")" : ""));
    await pg.setViewportSize({ width: 390, height: 844 });
    await ctx.close();
  }

  sage(seitenfehler.length === 0, "keine Seitenfehler", seitenfehler.slice(0, 5).join(" | "));
  console.log("\n  Ehrliche Grenze: bewiesen sind die REIHENFOLGE (Vollbild-Ende vor dem Rollen) und die Lage des"
    + "\n  Walkie-Felds – nicht das Ausbleiben des Android-Schwarz. Das zeigt nur ein echtes Telefon.");
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.log("ABSTURZ " + (e && e.stack || e)); process.exit(3); });
