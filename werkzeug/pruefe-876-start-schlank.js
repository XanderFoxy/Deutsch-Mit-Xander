#!/usr/bin/env node
/* =====================================================================
   SONDE 876 — DER START IST SCHLANK, NICHTS FEHLT (Fassung 876)
   ---------------------------------------------------------------------
   XANDER (Funk 263/271): „die Ladezeit der Seite deutlich verringern …
   dass man wirklich sofort in den Livestream kommt" · „alles insgesamt
   nur zehn Mal schneller".
   Seit 876 ist min/app.js geteilt (werkzeug/teile-bauen.js), und von
   korrekturen.css, app-styles.css und spiel.css hält nur ein kleines
   Startblatt das erste Bild an (werkzeug/stil-bauen.js); spiel.js kommt
   beim Öffnen des Klassenzimmers oder in der ersten Ruhepause.
   Geprüft:
     1  Bau: min/app.js passt zur Quelle, jeder Teil passt zu min/app.js,
        die Startblätter und ihre Stempel sind da.
     2  Start: bis die Reiter antworten, wird kein app-teil-*.js, kein
        ganzes korrekturen/app-styles/spiel.css und kein spiel.js geholt;
        kein Platzhalter musste sofort nachladen.
     3  Gleich danach kommen die ganzen Blätter – direkt hinter ihr
        Startblatt; Kopfzeile und Reiter sehen davor und danach gleich aus.
     4  Wissen → Klassenzimmer holt den Teil „raum", spiel.css und dann
        spiel.js; in der Ruhepause kommt alles und wird eingesetzt.
     5  Die Bereiche funktionieren: Spiele, Einstellungen, Postfach,
        Klassenzimmer mit Raum; ein Auftritt, der im Chat ankommt, läuft.
     6  Ganz früh (vor jedem Vorladen) kommt ein Auftritt im Chat an: er
        läuft trotzdem (der Platzhalter holt seinen Teil sofort).
     7  ?quelle lädt die Quelle ganz, ohne Teile – auch da läuft alles.
     8  Keine Seitenfehler.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path"), crypto = require("crypto");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  /* ---- 1. Bau ---- */
  console.log("\n1) DER BAU\n");
  const minApp = fs.readFileSync(path.join(WURZEL, "min/app.js"), "utf8");
  /* die Zeile, die der Bau eingesetzt hat (esbuild fasst sie mit anderen var zusammen: Klammern zählen) */
  const bau = (() => {
    const i = minApp.search(/DMA_TEILE_BAU\s*=\s*\{/);
    if (i < 0) return null;
    let p = minApp.indexOf("{", i), tiefe = 0, e = p;
    for (; e < minApp.length; e++) { if (minApp[e] === "{") tiefe++; else if (minApp[e] === "}" && --tiefe === 0) break; }
    try { return new Function("return " + minApp.slice(p, e + 1))(); } catch (x) { return null; }
  })();
  sage(Boolean(bau && bau.id && bau.teile.some((t) => /^raum/.test(t)) && bau.teile.some((t) => /^rest/.test(t)) && bau.fn.length > 500), "min/app.js ist geteilt", bau ? bau.teile.join(", ") + ", " + bau.fn.length + " Funktionen" : "keine DMA_TEILE_BAU-Zeile");
  sage(/var DMA_TEILE_BAU = null;/.test(fs.readFileSync(path.join(WURZEL, "app.js"), "utf8")), "in der Quelle bleibt DMA_TEILE_BAU null (?quelle lädt alles)");
  const merk = JSON.parse(fs.readFileSync(path.join(WURZEL, "min/.quelle.json"), "utf8"));
  const teileBauen = require(path.join(WURZEL, "werkzeug/teile-bauen.js"));
  sage(merk["app.js"] === teileBauen.bauSumme(fs.readFileSync(path.join(WURZEL, "app.js"), "utf8")), "min/app.js ist aus der jetzigen Quelle gebaut");
  const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");
  const stempel = JSON.parse((html.match(/window\.DMA_STEMPEL = (\{[^\n]*\});<\/script>/) || [0, "{}"])[1]);
  const sha = (f) => crypto.createHash("sha1").update(fs.readFileSync(path.join(WURZEL, f))).digest("hex").slice(0, 10);
  (bau ? bau.teile : []).forEach((t) => {
    const f = "min/app-teil-" + t + ".js";
    const da = fs.existsSync(path.join(WURZEL, f));
    const kopf = da ? fs.readFileSync(path.join(WURZEL, f), "utf8").slice(0, 60) : "";
    sage(da && kopf.indexOf(bau.id) >= 0, f + " gehört zu min/app.js", da ? kopf.slice(0, 40) : "fehlt");
    sage(stempel[f] === (da && sha(f)), f + " hat seinen Stempel in index.html", String(stempel[f]));
  });
  {
    const f = "min/data-exercises-teil.js", da = fs.existsSync(path.join(WURZEL, f));
    sage(da && /var DMA_UEB_BAU\s*=\s*\{/.test(fs.readFileSync(path.join(WURZEL, "min/data-exercises.js"), "utf8")) && stempel[f] === sha(f),
      "min/data-exercises.js ist geteilt, " + f + " gestempelt");
    sage(merk["data-exercises.js"] === teileBauen.bauSumme(fs.readFileSync(path.join(WURZEL, "data-exercises.js"), "utf8")), "min/data-exercises.js ist aus der jetzigen Quelle gebaut");
  }
  ["korrekturen", "app-styles", "spiel"].forEach((n) => {
    const f = "min/" + n + "-start.css";
    sage(fs.existsSync(path.join(WURZEL, f)) && stempel[f] === sha(f), f + " ist da und gestempelt");
  });
  sage(stempel["min/app.js"] === sha("min/app.js"), "min/app.js hat den passenden Stempel");

  /* ---- Server, der mitschreibt ---- */
  const anfragen = [];
  let teileZurueck = false;
  const srv = http.createServer(async (q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    anfragen.push({ p, t: Date.now() });
    if (teileZurueck && /app-teil-/.test(p)) await schlaf(1500);
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); a.end(fs.readFileSync(f));
  }).listen(0);
  await new Promise((r) => srv.on("listening", r));
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  async function fenster() {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); sessionStorage.setItem("dma-neu-geladen", "x"); } catch (e) {} });
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e).split("\n")[0]));
    pg.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::ERR/.test(m.text())) pg.__fehler.push("console: " + m.text().slice(0, 160)); });
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    return { ctx, pg };
  }
  const bereit = (pg) => pg.waitForFunction(() => window.LiveChat && window.DMA_TAFEL_STAND && window.DMA_TEILE && document.querySelector('.tape-tab[data-target="view-knowledge"]'), null, { timeout: 60000, polling: 20 });
  const pfade = (ab) => anfragen.slice(ab).map((x) => x.p);
  /* Was in Spiele, Einstellungen und Postfach steht (ohne Anmeldung: der Hinweis) – mit und ohne Teile gleich? */
  let bereicheNeu = null;
  const bereicheMessen = (pg) => pg.evaluate(async () => {
    const warte = (ms) => new Promise((r) => setTimeout(r, ms));
    const aus = {};
    document.querySelector('.tape-tab[data-target="view-learn"]').click(); await warte(300);
    document.querySelector('#learnSubnav [data-sub="sub-games"]').click(); await warte(500);
    aus.spiele = (document.getElementById("sub-games") || {}).innerText.length;
    document.querySelector('.tape-tab[data-target="view-profile"]').click(); await warte(300);
    document.querySelector('[data-sub="sub-settings"]').click(); await warte(500);
    aus.einstellungen = (document.getElementById("settingsArea") || {}).innerText.length;
    document.querySelector('[data-sub="sub-inbox"]').click(); await warte(500);
    aus.postfach = (document.getElementById("inboxArea") || {}).innerText.length;
    /* aus dem ausgelagerten Datenblock von data-exercises.js (Deutschland-Quiz) */
    aus.quizThemen = ExerciseData.getQuizTopics().join(",");
    aus.quizFragen = ExerciseData.activeCategories().filter((c) => /quiz/i.test(c.id)).map((c) => (c.getBank ? c.getBank().length : 0)).join(",");
    return aus;
  });

  /* ---- 2.–5. normaler Weg ---- */
  console.log("\n2) DER START\n");
  {
    const { ctx, pg } = await fenster();
    const ab = anfragen.length;
    await pg.goto(HIER + "/index.html", { waitUntil: "commit" });
    await bereit(pg);
    const start = pfade(ab);
    const st0 = await pg.evaluate(() => window.DMA_TEILE.stand());
    sage(st0.gebaut, "die Seite läuft mit der geteilten min/app.js");
    sage(!start.some((p) => /app-teil-|data-exercises-teil/.test(p)), "kein app-teil-*.js und kein data-exercises-teil.js beim Start", start.filter((p) => /-teil/.test(p)).join(", "));
    /* Die ganzen Blätter dürfen erst kommen, wenn die Startskripte gelaufen sind (DOMContentLoaded) – nicht vorher,
       sonst hielten sie wieder das erste Bild an. Gemessen mit den Zeiten der Seite selbst. */
    await pg.waitForFunction(() => performance.getEntriesByType("navigation")[0].domContentLoadedEventStart > 0, null, { timeout: 20000 });
    const zeiten = await pg.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      return { dcl: nav.domContentLoadedEventStart, fcp: (performance.getEntriesByName("first-contentful-paint")[0] || {}).startTime || 0,
        voll: performance.getEntriesByType("resource").filter((r) => /\/min\/(korrekturen|app-styles|spiel)\.css/.test(r.name)).map((r) => [r.name.replace(/^.*\/min\//, "").replace(/\?.*$/, ""), Math.round(r.startTime)]) };
    });
    sage(["korrekturen", "app-styles", "spiel"].every((n) => start.indexOf("/min/" + n + "-start.css") >= 0) && zeiten.voll.every((v) => v[1] >= zeiten.dcl - 1),
      "beim Start nur die Startblätter; die ganzen erst nach DOMContentLoaded", "DCL " + Math.round(zeiten.dcl) + " ms, ganze: " + JSON.stringify(zeiten.voll));
    sage(!start.some((p) => /spiel\.js$/.test(p)), "spiel.js noch nicht geholt");
    sage(st0.sofort.length === 0, "kein Platzhalter musste beim Start nachladen", st0.sofort.join(" | "));

    console.log("\n3) GLEICH DANACH DIE GANZEN BLÄTTER\n");
    const vorher = await pg.evaluate(() => [".site-header", ".tape-tab", ".brand-name", "body", ".view[data-active=true]"].map((s) => { const e = document.querySelector(s); if (!e) return s + ":-"; const c = getComputedStyle(e); return s + ":" + [c.color, c.backgroundColor, c.fontSize, c.fontFamily, c.padding, c.display, Math.round(e.getBoundingClientRect().height)].join("/"); }));
    /* Erst nur geholt (Zwischenspeicher), nicht eingehängt – eingehängt wird mit dmaStileAn */
    const geholt = pfade(ab).filter((p) => /\/min\/(korrekturen|app-styles)\.css$/.test(p));
    const vorAn = await pg.evaluate(() => [...document.querySelectorAll('link[rel="stylesheet"]')].filter((l) => /\/min\/(korrekturen|app-styles)\.css/.test(l.href)).length);
    sage(geholt.length >= 2 && vorAn === 0, "die ganzen Blätter werden nach DOMContentLoaded geholt, aber noch nicht eingehängt", geholt.join(" ") + ", eingehängt: " + vorAn);
    await pg.evaluate(() => window.dmaStileAn());
    await pg.waitForFunction(() => [...document.styleSheets].filter((s) => /\/min\/(korrekturen|app-styles)\.css/.test(s.href || "")).length === 2, null, { timeout: 20000 }).catch(() => {});
    const reihe = await pg.evaluate(() => [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => (l.getAttribute("href") || "").replace(/\?.*$/, "")).filter((h) => /^min\//.test(h)));
    const iK = reihe.indexOf("min/korrekturen-start.css"), iA = reihe.indexOf("min/app-styles-start.css");
    sage(iK >= 0 && reihe[iK + 1] === "min/korrekturen.css" && iA >= 0 && reihe[iA + 1] === "min/app-styles.css", "eingehängt stehen korrekturen.css und app-styles.css direkt hinter ihrem Startblatt", reihe.join(" "));
    await schlaf(300);
    const nachher = await pg.evaluate(() => [".site-header", ".tape-tab", ".brand-name", "body", ".view[data-active=true]"].map((s) => { const e = document.querySelector(s); if (!e) return s + ":-"; const c = getComputedStyle(e); return s + ":" + [c.color, c.backgroundColor, c.fontSize, c.fontFamily, c.padding, c.display, Math.round(e.getBoundingClientRect().height)].join("/"); }));
    sage(JSON.stringify(vorher) === JSON.stringify(nachher), "Kopfzeile, Reiter und Ansicht sehen davor und danach gleich aus", vorher.filter((x, i) => x !== nachher[i]).join(" ≠ "));

    console.log("\n4) WISSEN → KLASSENZIMMER\n");
    const ab2 = anfragen.length;
    await pg.evaluate(() => document.querySelector('.tape-tab[data-target="view-knowledge"]').click());
    await pg.waitForFunction(() => document.querySelector('.subnav-pill[data-sub="sub-livechat"]'), null, { timeout: 20000 });
    await pg.evaluate(() => document.querySelector('.subnav-pill[data-sub="sub-livechat"]').click());
    await pg.waitForFunction(() => { const b = document.querySelector("#lcBetreten, #lcZumKlassenzimmer"); return b && b.getBoundingClientRect().height > 0; }, null, { timeout: 20000 });
    await pg.waitForFunction(() => window.DMA_SPIEL, null, { timeout: 20000 }).catch(() => {});
    const kz = pfade(ab2).concat(start);
    const iCss = anfragen.findIndex((x) => /\/min\/spiel\.css$/.test(x.p)), iJs = anfragen.findIndex((x) => /\/min\/spiel\.js$/.test(x.p));
    sage(kz.some((p) => /app-teil-raum/.test(p)) || pfade(ab).some((p) => /app-teil-raum/.test(p)), "der Teil „raum\" wird geholt");
    sage(await pg.evaluate(() => Boolean(window.DMA_SPIEL)) && iCss >= 0 && iJs > iCss, "erst spiel.css, dann spiel.js – und das Spiel ist da");
    await pg.waitForFunction(() => { const s = window.DMA_TEILE.stand(); return s.teile.every((t) => s.da[t]); }, null, { timeout: 30000 }).catch(() => {});
    const st1 = await pg.evaluate(() => window.DMA_TEILE.stand());
    sage(st1.teile.every((t) => st1.da[t]), "in der Ruhepause werden alle Teile eingesetzt", JSON.stringify(st1.da));
    sage(st1.sofort.length === 0 && st1.fehler.length === 0, "ohne Sofort-Nachladen und ohne Fehler", st1.sofort.concat(st1.fehler).join(" | "));

    console.log("\n5) DIE BEREICHE FUNKTIONIEREN\n");
    bereicheNeu = await bereicheMessen(pg);
    sage(bereicheNeu.spiele > 50 && bereicheNeu.einstellungen > 10 && bereicheNeu.postfach > 10 && bereicheNeu.quizThemen.split(",").length >= 3,
      "Spiele, Einstellungen, Postfach zeichnen sich; das Deutschland-Quiz hat seine Themen", JSON.stringify(bereicheNeu));
    const ueb = await pg.evaluate(() => window.DMA_TEIL_SOFORT || []);
    sage(!ueb.length, "auch dafür musste nichts sofort nachgeladen werden (alles in der Ruhepause)", ueb.join(" | "));
    /* Im Raum: ein Auftritt, der im Chat ankommt */
    await pg.evaluate(() => {
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: {} });
      document.querySelector('.tape-tab[data-target="view-knowledge"]').click();
      document.querySelector('.subnav-pill[data-sub="sub-livechat"]').click();
    });
    await schlaf(600);
    await pg.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "cem", name: "Cem", buehne: true, seit: 7000, auftritt: "rakete" }));
    await pg.waitForFunction(() => document.querySelector(".lc-auftritt-rakete"), null, { timeout: 5000 }).catch(() => {});
    const r5 = await pg.evaluate(() => ({ buehne: Boolean(document.querySelector(".lc-auftritt-rakete")), platz: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="cem"]')) }));
    sage(r5.buehne && r5.platz, "im Raum: Cem kommt mit „Rakete\" – der Auftritt läuft", JSON.stringify(r5));
    sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 3).join(" | "));
    await ctx.close();
  }

  /* ---- 6. ganz früh: ein Effekt kommt an, bevor irgendein Teil da ist ---- */
  console.log("\n6) GANZ FRÜH: DER EFFEKT WARTET, STATT VERLOREN ZU GEHEN\n");
  {
    teileZurueck = true;   /* das Vorladen kommt erst spät an – der Platzhalter muss selbst holen */
    const { ctx, pg } = await fenster();
    await pg.goto(HIER + "/index.html", { waitUntil: "commit" });
    await bereit(pg);
    const r6 = await pg.evaluate(() => {
      const vor = window.DMA_TEILE.stand();
      window.__quizFrueh = ExerciseData.getQuizTopics().join(",");
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: {} });
      document.querySelector('.tape-tab[data-target="view-knowledge"]').click();
      document.querySelector('.subnav-pill[data-sub="sub-livechat"]').click();
      window.LiveChat.pruefEmpfangen({ art: "hallo", von: "cem", name: "Cem", buehne: true, seit: 7000, auftritt: "rakete" });
      return { vorDa: Object.keys(vor.da).length };
    });
    await pg.waitForFunction(() => document.querySelector(".lc-auftritt-rakete"), null, { timeout: 8000 }).catch(() => {});
    const st = await pg.evaluate(() => Object.assign(window.DMA_TEILE.stand(), { buehne: Boolean(document.querySelector(".lc-auftritt-rakete")) }));
    sage(r6.vorDa === 0, "vorher war noch kein Teil eingesetzt");
    sage(Object.keys(st.da).some((t) => /^raum/.test(t) && st.da[t]) && st.sofort.length >= 1, "der Platzhalter hat sein Stück sofort geholt", st.sofort.join(" | "));
    sage(st.buehne, "der Auftritt läuft trotzdem");
    const qf = await pg.evaluate(() => window.__quizFrueh);
    sage(qf && bereicheNeu && qf === bereicheNeu.quizThemen, "ganz früh gefragt: das Deutschland-Quiz ist trotzdem vollständig", qf);
    sage(!pg.__fehler.length && !st.fehler.length, "keine Seitenfehler", pg.__fehler.concat(st.fehler).slice(0, 3).join(" | "));
    teileZurueck = false;
    await ctx.close();
  }

  /* ---- 7. ?quelle ---- */
  console.log("\n7) ?QUELLE: ALLES IN EINER DATEI WIE VORHER\n");
  {
    const { ctx, pg } = await fenster();
    const ab = anfragen.length;
    await pg.goto(HIER + "/index.html?quelle", { waitUntil: "commit" });
    await bereit(pg);
    await pg.waitForFunction(() => window.DMA_SPIEL, null, { timeout: 30000 }).catch(() => {});
    const st = await pg.evaluate(() => window.DMA_TEILE.stand());
    const p = pfade(ab);
    sage(!st.gebaut && !p.some((x) => /app-teil-|-start\.css/.test(x)) && p.indexOf("/app.js") >= 0 && p.indexOf("/korrekturen.css") >= 0, "Quelle ganz, keine Teile, keine Startblätter");
    const b7 = await bereicheMessen(pg);
    sage(JSON.stringify(b7) === JSON.stringify(bereicheNeu) && Boolean(await pg.evaluate(() => window.DMA_SPIEL)), "Spiele, Einstellungen, Postfach wie mit Teilen, das Spiel läuft", JSON.stringify(b7));
    sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 3).join(" | "));
    await ctx.close();
  }

  await br.close(); srv.close();
  console.log("\nFassung 876 (Sonde 876): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
