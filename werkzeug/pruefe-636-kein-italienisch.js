#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 636: KEIN ITALIENISCH IM DEUTSCHKURS
   ---------------------------------------------------------------------
   XANDER (25.09.): „diese italienischen Sachen dürfen auch nicht mehr
   auftauchen".
   Prüfbericht 25.09.: Im Satzbaukasten („Beispiele lesen") stand unter
   jedem deutschen Satz auch im Deutsch-Raum die italienische
   Übersetzung. Geprüft: im Deutsch-Raum keine, im Italienisch-Raum
   weiterhin eine je Satz.

   FASSUNG 839 — XANDER (Funk 225): „in jeglichen deutschen Bereichen wo
   noch italienische restübersetzungen sind … sollst du diese entfernen
   die italienischen Wörter Sätze und Inhalte gehören ausschließlich in
   den italienisch Raum“. Erweitert um:
     · der deutsche Satzbaukasten auf allen Niveaus, in allen drei
       Ansichten (bauen, Satz legen, Beispiele) ohne italienisches Wort,
       auch wenn man vorher im Italienisch-Raum war;
     · die italienische Engine (satzbau-it.js) wird im Deutsch-Raum gar
       nicht geladen;
     · keine it-Übungskategorie, keine italienische Grammatik im
       Deutsch-Raum;
     · Bilderwelt-Wortkarte ohne 🇮🇹-Zeile (bei der voreingestellten
       Hilfssprache; wer Italienisch ausdrücklich als Hilfssprache wählt,
       bekommt sie absichtlich).
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
/* Wörter, die es nur im Italienischen gibt (kein deutsches Wort sieht so aus) */
const IT = /(?<![\p{L}'])(perché|della|delle|dello|nella|nelle|dalla|alla|sono|siamo|andato|andata|mangio|vado|domani|ieri|stasera|grazie|buongiorno|ciao|il mio|la mia|con mia|non ho|in treno|al mare|l'italiano|voglio|posso|devo|anche)(?![\p{L}])/iu;
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.Satzbau && document.querySelector('#learnSubnav [data-sub="sub-satzbaukasten-de"]'), { timeout: 25000 });
  const zaehle = (ziel) => pg.evaluate(async (ziel) => {
    const area = document.getElementById(ziel);
    if (!area) return { da: false };
    let knopf = ziel === "satzbaukastenDeArea" ? document.querySelector('#learnSubnav [data-sub="sub-satzbaukasten-de"]') : null;
    if (knopf) knopf.click();
    await new Promise((r) => setTimeout(r, 300));
    const b = area.querySelector('[data-sbk-ansicht="beispiele"]'); if (b) b.click();
    await new Promise((r) => setTimeout(r, 300));
    return { da: true, saetze: area.querySelectorAll(".beispiel-satz").length, it: area.querySelectorAll(".beispiel-it").length };
  }, ziel);
  console.log("\nSATZBAUKASTEN, BEISPIELE LESEN\n");
  const de = await zaehle("satzbaukastenDeArea");
  sage(de.saetze > 0, "im Deutsch-Raum stehen Beispielsätze", de.saetze + " Sätze");
  sage(de.it === 0, "… ohne italienische Übersetzung", de.it + " italienische Zeilen");

  console.log("\nFASSUNG 839: DEUTSCHER SATZBAUKASTEN ÜBERALL OHNE ITALIENISCH\n");
  /* Auch nachdem man im Italienisch-Raum war — der Raum wird zurückgestellt. */
  const texte = await pg.evaluate(async () => {
    const t = (ms) => new Promise((r) => setTimeout(r, ms));
    try { ExerciseData.setLernraum("it"); ExerciseData.setLernraum("de"); } catch (e) {}
    document.body.classList.remove("lernraum-it");
    const area = document.getElementById("satzbaukastenDeArea");
    const out = [];
    for (const lv of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
      for (const ansicht of ["bauen", "ueben", "beispiele"]) {
        const n = area.querySelector('[data-sbk-niveau="' + lv + '"]'); if (n) n.click(); await t(120);
        const a = area.querySelector('[data-sbk-ansicht="' + ansicht + '"]'); if (a) a.click(); await t(160);
        out.push({ lv, ansicht, text: area.innerText });
      }
      const bauen = area.querySelector('[data-sbk-ansicht="bauen"]'); if (bauen) bauen.click(); await t(100);
      for (let i = 0; i < 4; i++) { const z = document.getElementById("sbkZufallBtn"); if (z) z.click(); await t(120); out.push({ lv, ansicht: "zufall", text: area.innerText }); }
    }
    return { out, engine: Boolean(window.SatzbauIt) };
  });
  const funde = texte.out.filter((x) => IT.test(x.text)).map((x) => x.lv + "/" + x.ansicht + ": " + (x.text.match(IT) || [""])[0]);
  sage(texte.out.length >= 40 && !funde.length, texte.out.length + " Ansichten des deutschen Satzbaukastens (A1–C2, bauen/legen/Beispiele, Zufallssätze) ohne italienisches Wort", funde.slice(0, 4).join(" | "));
  sage(!texte.engine, "die italienische Engine (satzbau-it.js) wird im Deutsch-Raum nicht geladen");

  console.log("\nFASSUNG 839: ÜBUNGEN, GRAMMATIK, WÖRTERBUCH, BILDERWELT\n");
  const rest = await pg.evaluate(async () => {
    const t = (ms) => new Promise((r) => setTimeout(r, ms));
    const kats = (ExerciseData.activeCategories ? ExerciseData.activeCategories() : []).map((c) => c.id);
    const gram = ExerciseData.activeGrammatik ? JSON.stringify(ExerciseData.activeGrammatik()).slice(0, 4000) : "";
    const ansichten = {};
    for (const sub of ["sub-exercises", "sub-grammatik", "sub-dictionary", "sub-erste-schritte", "sub-games", "sub-aussprache"]) {
      const p = document.querySelector('[data-sub="' + sub + '"]'); if (!p) continue;
      p.click(); await t(400);
      ansichten[sub] = (document.getElementById(sub) || {}).innerText || "";
    }
    /* Bilderwelt: eine Szene öffnen und ein Wort antippen */
    let karte = "";
    const tab = document.querySelector('.tape-tab[data-target="view-knowledge"]'); if (tab) tab.click(); await t(200);
    const bw = document.querySelector('[data-sub="sub-bilderwelt"]');
    if (bw) {
      bw.click(); await t(800);
      const sz = document.querySelector("#bilderweltArea [data-bw-szene]"); if (sz) { sz.click(); await t(1500); }
      const teil = document.querySelector("#bilderweltArea [data-bw-teil]"); if (teil) { teil.dispatchEvent(new MouseEvent("click", { bubbles: true })); await t(500); }
      karte = (document.getElementById("bilderweltArea") || {}).innerText || "";
    }
    return { kats, gram, ansichten, karte };
  });
  sage(!rest.kats.some((k) => /^it-/.test(k)), "keine italienische Übungskategorie im Deutsch-Raum", rest.kats.filter((k) => /^it-/.test(k)).join(","));
  const gFunde = Object.entries(rest.ansichten).filter(([, txt]) => IT.test(txt)).map(([k, txt]) => k + ": " + (txt.match(IT) || [""])[0]);
  sage(!gFunde.length, "Übungen, Grammatik, Wörterbuch, Erste Schritte, Spiele, Aussprache ohne italienisches Wort", gFunde.join(" | "));
  sage(rest.karte.length > 0 && !/🇮🇹/.test(rest.karte) && !IT.test(rest.karte), "Bilderwelt-Wortkarte ohne italienische Zeile (voreingestellte Hilfssprache)", rest.karte.length ? (rest.karte.match(/🇮🇹[^\n]*/) || [""])[0] : "keine Karte");

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nKein Italienisch im Deutsch-Raum.\n");
  process.exit(fehler ? 1 : 0);
})();
