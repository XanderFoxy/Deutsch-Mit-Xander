#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 832 (Arbeitsnummer 853): BEUGUNG IM WÖRTERBUCH
   ---------------------------------------------------------------------
   XANDER (Funk 255, wörtlich): „Beugungsknöpfe (ich/du/er …) für Verben
   im Wörterbuch wie im Duden".
   Geprüft (Handy 360 px):
     - konjugation.js wird beim Start NICHT geladen, erst mit dem Wörterbuch
     - „gehen" hat den Knopf „ich/du"; er klappt die Tabelle auf:
       Präsens „du gehst", Perfekt „ich bin gegangen", Imperativ
     - eine Zeile antippen liest sie vor („er geht", nicht „er/sie/es")
     - „aufstehen": „ich stehe auf", „ich bin aufgestanden"
     - Nomen und Adjektive („offen") haben keinen Knopf
     - die aufgeklappte Karte bleibt in der Spalte (kein Überlauf)
     - zweites Antippen klappt wieder zu
   Mit dem Stand 831 ist das rot (es gab keinen Knopf).
   Aufruf: node werkzeug/pruefe-853-beugung.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  try {
    const pg = await br.newPage({ viewport: { width: 360, height: 760 } });
    const seitenFehler = [];
    pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => typeof Core !== "undefined" && document.querySelector('#learnSubnav [data-sub="sub-dictionary"]'), null, { timeout: 30000 });
    await pg.waitForTimeout(1500);
    const vorher = await pg.evaluate(() => ({ k: !!window.Konjugation, s: [...document.scripts].some((s) => /konjugation\.js/.test(s.src)) }));
    sage(!vorher.k && !vorher.s, "beim Start wird konjugation.js nicht geladen (erst mit dem Wörterbuch)", JSON.stringify(vorher));

    await pg.evaluate(() => {
      window.__gesagt = [];
      Core.speak = function (t) { window.__gesagt.push(String(t)); };
      const tab = document.querySelector('.tape-tab[data-target="view-learn"]'); if (tab) tab.click();
      document.querySelector('#learnSubnav [data-sub="sub-dictionary"]').click();
    });
    await pg.waitForFunction(() => window.Konjugation && document.getElementById("dictSearch"), null, { timeout: 20000 });
    /* der Wortschatz kommt in Teilen nach (vokabeln/*.js) */
    await pg.waitForFunction(() => VocabData.WORDS.some((w) => w.word === "gehen") && VocabData.WORDS.some((w) => w.word === "aufstehen"), null, { timeout: 30000 });
    const suchen = async (w) => {
      await pg.evaluate((w) => { const s = document.getElementById("dictSearch"); s.value = w; s.dispatchEvent(new Event("input", { bubbles: true })); }, w);
      await pg.waitForTimeout(500);
    };
    const karte = (w) => pg.evaluate((w) => {
      const k = [...document.querySelectorAll("#dictGrid .vocab-card")].find((c) => (c.querySelector(".vocab-word") || {}).firstChild && c.querySelector(".vocab-word").firstChild.textContent.trim() === w);
      return k ? { knopf: !!k.querySelector(".beug-btn"), text: (k.querySelector(".beug-btn") || {}).textContent || "" } : null;
    }, w);
    const tippe = (w, sel) => pg.evaluate(({ w, sel }) => {
      const k = [...document.querySelectorAll("#dictGrid .vocab-card")].find((c) => c.querySelector(".vocab-word").firstChild.textContent.trim() === w);
      const b = k && k.querySelector(sel); if (b) b.click(); return !!b;
    }, { w, sel });
    const feld = (w) => pg.evaluate((w) => {
      const k = [...document.querySelectorAll("#dictGrid .vocab-card")].find((c) => c.querySelector(".vocab-word").firstChild.textContent.trim() === w);
      const p = k && k.querySelector(".beug-panel");
      if (!p) return null;
      const kr = k.getBoundingClientRect(), pr = p.getBoundingClientRect();
      return { text: p.innerText, zeilen: [...p.querySelectorAll(".beug-zeile")].map((z) => z.textContent.trim()),
        reiter: [...p.querySelectorAll(".beug-zeit")].map((z) => z.textContent.trim()),
        breit: { karteR: Math.round(kr.right), panelR: Math.round(pr.right), seite: document.documentElement.scrollWidth, fenster: innerWidth },
        knoepfe: [...p.querySelectorAll("button")].map((b) => Math.round(b.getBoundingClientRect().height)) };
    }, w);

    await suchen("gehen");
    const g = await karte("gehen");
    sage(g && g.knopf && /ich\/du/.test(g.text), "„gehen“ hat den Knopf „ich/du“", JSON.stringify(g));
    await tippe("gehen", ".beug-btn");
    await pg.waitForTimeout(200);
    let f = await feld("gehen");
    sage(f && f.zeilen.includes("du gehst") && f.zeilen.includes("ich gehe") && f.zeilen.includes("er/sie/es geht"), "Präsens: ich gehe, du gehst, er/sie/es geht", f && f.zeilen.join(" · "));
    sage(f && ["Präsens", "Präteritum", "Perfekt", "Imperativ"].every((r) => f.reiter.includes(r)), "Reiter Präsens, Präteritum, Perfekt, Imperativ", f && f.reiter.join(","));
    sage(f && /gegangen/.test(f.text) && /sein/.test(f.text), "Fußzeile: Partizip II gegangen, Perfekt mit sein", f && f.text.split("\n").pop());
    sage(f && f.breit.panelR <= f.breit.karteR + 1 && f.breit.seite <= f.breit.fenster + 1, "die aufgeklappte Tabelle bleibt in der Karte, kein Seitenüberlauf", f && JSON.stringify(f.breit));
    sage(f && f.knoepfe.every((h) => h >= 26), "Reiter und Zeilen sind tippbar (≥ 26 px)", f && JSON.stringify(f.knoepfe));
    if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-praesens.png" });

    await pg.evaluate(() => { window.__gesagt.length = 0; const z = [...document.querySelectorAll(".beug-zeile")].find((b) => /er\/sie\/es geht/.test(b.textContent)); if (z) z.click(); });
    const gesagt = await pg.evaluate(() => window.__gesagt.slice());
    sage(gesagt.includes("er geht"), "Zeile antippen liest vor: „er geht“", JSON.stringify(gesagt));

    await pg.evaluate(() => { const r = document.querySelector('.beug-panel [data-beugzeit="Perfekt"]'); if (r) r.click(); });
    f = await feld("gehen");
    sage(f && f.zeilen.includes("ich bin gegangen") && f.zeilen.includes("ihr seid gegangen"), "Perfekt: ich bin gegangen, ihr seid gegangen", f && f.zeilen.join(" · "));
    await pg.evaluate(() => { const r = document.querySelector('.beug-panel [data-beugzeit="Präteritum"]'); if (r) r.click(); });
    f = await feld("gehen");
    sage(f && f.zeilen.includes("ich ging") && f.zeilen.includes("du gingst"), "Präteritum: ich ging, du gingst", f && f.zeilen.join(" · "));
    await pg.evaluate(() => { const r = document.querySelector('.beug-panel [data-beugzeit="Imperativ"]'); if (r) r.click(); });
    f = await feld("gehen");
    sage(f && f.zeilen.length === 3 && f.zeilen.some((z) => /geht!$/.test(z)) && f.zeilen.some((z) => /gehen Sie!$/.test(z)), "Imperativ: drei Formen (du, ihr, Sie)", f && f.zeilen.join(" · "));

    await tippe("gehen", ".beug-btn");
    await pg.waitForTimeout(150);
    sage(!(await feld("gehen")), "zweites Antippen klappt die Tabelle wieder zu");

    await suchen("aufstehen");
    await tippe("aufstehen", ".beug-btn");
    await pg.waitForTimeout(200);
    f = await feld("aufstehen");
    sage(f && f.zeilen.includes("ich stehe auf") && f.zeilen.includes("du stehst auf"), "trennbar: ich stehe auf, du stehst auf", f && f.zeilen.slice(0, 3).join(" · "));
    await pg.evaluate(() => { const r = document.querySelector('.beug-panel [data-beugzeit="Perfekt"]'); if (r) r.click(); });
    f = await feld("aufstehen");
    sage(f && f.zeilen.includes("ich bin aufgestanden"), "Perfekt: ich bin aufgestanden", f && f.zeilen[0]);

    await suchen("offen");
    const o = await karte("offen");
    sage(o && !o.knopf, "Adjektiv „offen“ hat keinen Beugungsknopf", JSON.stringify(o));
    await suchen("Haus");
    const h = await pg.evaluate(() => [...document.querySelectorAll("#dictGrid .vocab-card")].slice(0, 10).filter((c) => /^(der|die|das) /.test(c.querySelector(".vocab-word").textContent) && c.querySelector(".beug-btn")).length);
    sage(h === 0, "Nomen haben keinen Beugungsknopf", String(h));
    const anzahl = await pg.evaluate(() => { document.getElementById("dictSearch").value = ""; document.getElementById("dictSearch").dispatchEvent(new Event("input", { bubbles: true })); return new Promise((r) => setTimeout(() => r(document.querySelectorAll("#dictGrid .beug-btn").length), 500)); });
    sage(anzahl > 0, "beim Blättern tragen Verben den Knopf", anzahl + " Knöpfe auf der ersten Seite");
    sage(!seitenFehler.length, "keine Skriptfehler", JSON.stringify(seitenFehler.slice(0, 3)));
  } finally { await br.close(); srv.close(); }
  console.log("\n" + (fehler ? fehler + " Fehler" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})();
