#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 776: SEQUENZEN FÜR GEMALTE WEGE (FUNK 196)
   ---------------------------------------------------------------------
   XANDER: „dass man den Weg im zweiten Modul verändern kann wie sie
   weiter fährt nachdem sie eine Runde gemacht hat und dass man das
   multiplizieren kann … und die Sequenz auch … fixieren kann platzieren
   kann multiplizieren kann".
   Gemessen: Runde malen (zurück auf den Start), × pro Modul, zweites
   Modul ab dem Ende des ersten, × für alles, gesendete Kette, Merken,
   Platzieren, und dass Lok und Auto eine Runde bis zum Start fahren.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2 });
  const seitenFehler = [];
  pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.removeItem("dma_weg_sequenzen"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne && window.DMA_PRUEF.wegFolge, null, { timeout: 25000 });
  const SP = process.env.SP || "/tmp";

  console.log("\n1  DIE KETTE AUS MODULEN\n");
  const k = await pg.evaluate(() => {
    const F = window.DMA_PRUEF.wegFolge;
    return {
      runde2: F.kette({ module: [{ weg: [1, 2, 6, 5, 1], mal: 2 }], gesamt: 1 }).join("-"),
      zwei: F.kette({ module: [{ weg: [1, 2, 6, 5, 1], mal: 2 }, { weg: [1, 2, 3], mal: 1 }], gesamt: 1 }).join("-"),
      offen: F.kette({ module: [{ weg: [1, 2, 3], mal: 2 }], gesamt: 1 }).join("-"),
      alles: F.kette({ module: [{ weg: [1, 2], mal: 1 }, { weg: [2, 6], mal: 1 }], gesamt: 3 }).join("-"),
      deckel: F.kette({ module: [{ weg: [1, 2, 6, 5, 1], mal: 9 }], gesamt: 9 }).length
    };
  });
  sage(k.runde2 === "1-2-6-5-1-2-6-5-1", "Runde ×2 schließt nahtlos an", k.runde2);
  sage(k.zwei === "1-2-6-5-1-2-6-5-1-2-3", "Modul 2 fährt nach der Runde weiter", k.zwei);
  sage(k.offen === "1-2-3-1-2-3", "offener Weg ×2 fängt wieder vorn an", k.offen);
  sage(k.alles === "1-2-6-1-2-6-1-2-6", "ganze Folge ×3", k.alles);
  sage(k.deckel === 80, "sehr lange Folgen werden bei 80 Halten gekappt", String(k.deckel));

  console.log("\n2  MALEN, VERVIELFACHEN, WEITERMALEN, SENDEN\n");
  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    window.__zeilen = [];
    window.LiveChat.schreiben = (z) => { window.__zeilen.push(z); return true; };
  });
  const mitte = (nr) => pg.evaluate((nr) => { const e = document.querySelector('#lcPruefBuehne [data-lc-platz="' + nr + '"]'); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, nr);
  const zieh = async (liste) => {
    const a = await mitte(liste[0]);
    await pg.mouse.move(a.x, a.y); await pg.mouse.down();
    for (const nr of liste.slice(1)) { const m = await mitte(nr); await pg.mouse.move(m.x, m.y, { steps: 6 }); await pg.waitForTimeout(40); }
    await pg.mouse.up(); await pg.waitForTimeout(250);
  };
  await pg.evaluate(() => window.DMA_PRUEF.wegFolge.malen(document.querySelector('#lcPruefBuehne [data-lc-platz="5"]')));
  await zieh([1, 2, 6, 5, 1]);
  let m = await pg.evaluate(() => { const k = document.getElementById("lcPlatzMenue"); return k ? { kopf: k.querySelector(".lc-platzmenue-kopf").textContent, seq: !!k.querySelector(".lc-seq"), runde: !!k.querySelector(".lc-seq-runde") } : null; });
  sage(!!m && m.kopf === "Dein Weg: 1–2–6–5–1", "Runde gemalt: zurück auf den Start", m && m.kopf);
  sage(!!m && m.seq && m.runde, "Folgen-Leiste mit Runden-Zeichen da");
  await pg.click("#lcPlatzMenue .lc-seq-zeile .lc-seq-plus"); await pg.waitForTimeout(100);
  m = await pg.evaluate(() => document.querySelector("#lcPlatzMenue .lc-platzmenue-kopf").textContent);
  sage(/Deine Folge: 9 Halte/.test(m), "Weg 1 ×2 → 9 Halte", m);
  await pg.click("#lcPlatzMenue .lc-seq-mehr"); await pg.waitForTimeout(200);
  const hinweis = await pg.evaluate(() => (document.querySelector(".lc-wegmal-hinweis") || {}).textContent || "");
  sage(/wie es weitergeht/.test(hinweis), "Weiter-Weg: Malfeld offen", hinweis);
  await zieh([1, 2, 3]);
  m = await pg.evaluate(() => { const k = document.getElementById("lcPlatzMenue"); return k ? { kopf: k.querySelector(".lc-platzmenue-kopf").textContent, zeilen: k.querySelectorAll(".lc-seq-zeile").length } : null; });
  sage(!!m && m.zeilen === 2 && /11 Halte/.test(m.kopf), "zwei Module, 11 Halte", JSON.stringify(m));
  const zaehler = await pg.$$("#lcPlatzMenue .lc-seq-ganz .lc-seq-plus");
  await zaehler[0].click(); await pg.waitForTimeout(80);
  m = await pg.evaluate(() => document.querySelector("#lcPlatzMenue .lc-platzmenue-kopf").textContent);
  sage(/Deine Folge: 22 Halte/.test(m), "alles ×2 → 22 Halte (von 3 geht es zurück zur 1)", m);
  const lay = await pg.evaluate(() => { const k = document.getElementById("lcPlatzMenue"); const r = k.getBoundingClientRect();
    const zu = [...k.querySelectorAll(".lc-seq button")].map((b) => b.getBoundingClientRect()).filter((q) => q.height < 30 || q.width < 30).length;
    const raus = [...k.querySelectorAll(".lc-seq *")].some((e) => { const q = e.getBoundingClientRect(); return q.width && (q.right > r.right + 1 || q.left < r.left - 1); });
    return { rechts: r.right, klein: zu, raus: raus }; });
  sage(lay.rechts <= 360 && lay.klein === 0 && !lay.raus, "Menü passt auf 360 px, alle Knöpfe ≥30 px, nichts ragt heraus", JSON.stringify(lay));
  await pg.screenshot({ path: SP + "/p776_folge.png" });
  await pg.click("#lcPlatzMenue .lc-seq-merk"); await pg.waitForTimeout(80);
  const gm = await pg.evaluate(() => window.DMA_PRUEF.wegFolge.gemerkt());
  sage(gm.length === 1 && gm[0].module.length === 2 && gm[0].gesamt === 2, "Merken: Folge fixiert", JSON.stringify(gm[0]));
  await pg.evaluate(() => { const b = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")].find((x) => /Fahren/.test(x.textContent)); b.click(); });
  await pg.waitForTimeout(150);
  const zeile = await pg.evaluate(() => window.__zeilen.slice(-1)[0] || "");
  sage(zeile === "/fahren 1-2-6-5-1-2-6-5-1-2-3-1-2-6-5-1-2-6-5-1-2-3", "Fahren sendet die ganze Kette", zeile);

  console.log("\n3  GEMERKT, PLATZIERT, WIEDER EINGESETZT\n");
  const pl = await pg.evaluate(() => {
    const F = window.DMA_PRUEF.wegFolge;
    const s = { module: [{ weg: [1, 2, 6, 5, 1], mal: 1 }], gesamt: 1 };
    return { verschoben: F.platzieren(s, 2).module[0].weg.join("-"), passtNicht: F.platzieren(s, 4).module.map((x) => x.weg.join("-")).join(" | ") };
  });
  sage(pl.verschoben === "2-3-7-6-2", "Platzieren: dieselbe Runde ab Platz 2", pl.verschoben);
  sage(pl.passtNicht === "4-1 | 1-2-6-5-1", "passt sie nicht ins Raster: erst hin, dann die Runde", pl.passtNicht);
  await pg.evaluate(() => { document.getElementById("lcPlatzMenue")?.remove(); window.DMA_PRUEF.wegFolge.menue(document.querySelector('#lcPruefBuehne [data-lc-platz="3"]'), null); });
  await pg.waitForTimeout(120);
  const liste = await pg.evaluate(() => [...document.querySelectorAll("#lcPlatzMenue .lc-seq-laden")].map((b) => b.textContent));
  sage(liste.length === 1 && /1–2–6–5–1 ×2 → 1–2–3/.test(liste[0]), "ohne gemalten Weg: gemerkte Folge zur Wahl", liste[0]);
  await pg.click("#lcPlatzMenue .lc-seq-laden"); await pg.waitForTimeout(150);
  m = await pg.evaluate(() => { const k = document.getElementById("lcPlatzMenue"); return k ? k.querySelector(".lc-platzmenue-kopf").textContent : ""; });
  sage(/Deine Folge: 22 Halte/.test(m), "Einsetzen lädt die ganze Folge wieder", m);

  console.log("\n4  LOK UND AUTO FAHREN EINE RUNDE BIS ZUM START\n");
  for (const art of ["lok", "fahren"]) {
    const r = await pg.evaluate(async (art) => {
      document.getElementById("lcPlatzMenue")?.remove();
      window.DMA_PRUEF.effektBuehne();
      const p = (nr) => { const e = document.querySelector('[data-lc-platz="' + nr + '"]').getBoundingClientRect(); return { x: e.left + e.width / 2, y: e.top + e.height / 2 }; };
      const st6 = p(6);
      window.DMA_PRUEFUNG.wirkung(art, "1-2-6-5-1", "Alex", {});
      let naeh = 1e9, gesehen = false;
      const bis = performance.now() + 9000;
      await new Promise((f) => setTimeout(f, 150));
      while (performance.now() < bis) {
        const el = document.querySelector(art === "lok" ? ".lc-lok" : ".lc-platz-ich .lc-kreis, .lc-fahrt, .lc-auto");
        const alle = document.querySelectorAll(art === "lok" ? ".lc-lok" : ".lc-fahrzeug, .lc-auto, .lc-fahrt-bild, .lc-kreis-faehrt, .lc-unterwegs");
        (alle.length ? alle : (el ? [el] : [])).forEach((e) => { const k = e.getBoundingClientRect(); if (!k.width) return; gesehen = true; naeh = Math.min(naeh, Math.hypot(k.left + k.width / 2 - st6.x, k.top + k.height / 2 - st6.y)); });
        if (art === "lok" && gesehen && !document.querySelector(".lc-lok")) break;
        await new Promise((f) => requestAnimationFrame(f));
      }
      return { gesehen: gesehen, naeh: Math.round(naeh), ueberfahren: document.querySelectorAll('[data-lc-platz="1"] .lc-ueberfahren, [data-lc-platz="1"].lc-platt').length };
    }, art);
    sage(r.gesehen && r.naeh <= 60, "/" + art + " 1-2-6-5-1 fährt die Runde (kommt an Platz 6 vorbei)", JSON.stringify(r));
  }
  sage(!seitenFehler.length, "keine Seitenfehler", seitenFehler.join(" | ").slice(0, 200));
  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
