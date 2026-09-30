#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 841: BATMOBIL ÜBER DEN KÖPFEN, SAUGNAPF OBEN AM KOPF
   ---------------------------------------------------------------------
   XANDER (Funk 230, wörtlich): „(1) BATMOBIL-AUFTRITT (DMA_AUFTRITT
   "batmobil", LC_AUTO3D): Das Auto fährt HINTER den Plätzen/Profil-
   bildern durch (falscher Layer). Soll wie in anderen Livestreams im
   VORDERGRUND über die Köpfe fahren, sauber einfahren und dann
   aussteigen. (2) SAUGNAPF-PFEIL (/pfeil Name, saugpfeil): Bei Nachbar-
   plätzen bleibt der Schaft quer über dem Gesicht des Schützen liegen,
   nur der Saugnapf berührt den Rand des Ziels. Soll oben am Kopf des
   Ziels kleben, Gesichtsmitte frei. Beides ist fürs Werbevideo nötig."

   Geprüft, am Telefon (360 × 740) und am Rechner (1280 × 800), acht
   Leute im Klassenzimmer:
     Batmobil
       • wo das Auto (deckend) über einem fremden Profilbild gemalt ist,
         trifft elementFromPoint die Leinwand des Autos – nicht das Bild
         und keine Kopie des Bildes darüber (vorher: die Kopien aus
         Fassung 698 lagen über dem Auto)
       • das Auto fährt wirklich über mehrere Köpfe
       • das eigene Bild sitzt am Steuer ÜBER dem Auto, steigt aus, solange
         das Auto noch steht, und landet auf dem eigenen Platz
       • am Ende ist das Auto weg, die Bühne aufgeräumt
     Saugnapf-Pfeil (Nachbar links/rechts, darüber/darunter, schräg,
     weit weg)
       • die Mitte des Saugnapfs liegt im oberen Drittel des Ziel-Bildes
       • die Nocke (hinten) liegt höher als der Napf: der Schaft zeigt
         vom Kopf weg nach oben/außen
       • vom Aufprall bis zum Ausblenden (auch während des Drills) liegt
         nichts vom Pfeil auf dem mittleren Drittel (Gesichtsmitte) des
         Schützen oder des Ziels (elementFromPoint auf einem Raster)
     • keine Fehler in der Konsole
   Bildschirmfotos: BILD=/pfad/praefix (Einzelbilder der Fahrt und des
   Pfeilflugs). Gegenprobe: WURZEL=/pfad/zum/alten/stand.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
const BILD = process.env.BILD || "";
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const LEUTE = ["Bea", "Cem", "Dora", "Emil", "Finn", "Gina", "Hana"];

(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  const kf = [];

  const seite = async (breite) => {
    const ctx = await br.newContext(breite > 500 ? { viewport: { width: breite, height: 800 }, deviceScaleFactor: 1 } : { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => kf.push(breite + ": " + String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEFUNG && window.DMA_PRUEF && window.DMA_AUFTRITT, { timeout: 30000 });
    await pg.evaluate((namen) => {
      const leute = {};
      namen.forEach((n, i) => { const id = n.toLowerCase(); leute[id] = { id, name: n, seit: 2000 + i * 1000, gesehen: 9e15, buehne: true, bild: "" }; });
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute });
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
      window.DMA_PRUEF.neuZeichnen();
      document.documentElement.style.scrollBehavior = "auto";
      document.getElementById("lcPlaetze").scrollIntoView({ block: "center" });
    }, LEUTE);
    await pg.waitForTimeout(700);
    return pg;
  };

  for (const breite of [360, 1280]) {
    const pg = await seite(breite);
    const B = breite > 500 ? 1280 : 360;
    console.log("\nBATMOBIL · " + breite + " px\n");
    await pg.evaluate(() => { window.DMA_AUTO3D = null; window.DMA_AUFTRITT_HALTEN = true; window.DMA_AUFTRITT("ich", "batmobil", "rein"); });
    let da = false;
    try { await pg.waitForFunction(() => document.querySelector(".lc-auftritt canvas.lc-auftritt-3d") && window.DMA_AUTO3D, null, { timeout: 15000 }); da = true; } catch (e) {}
    sage(da, "das Batmobil fährt als 3D-Auto (Leinwand)", "");
    if (da) {
      const plan = await pg.evaluate(() => window.DMA_AUTO3D.plan);
      const platz = await pg.evaluate(() => { const r = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width]; });
      /* Zeit anhalten und stellen; dann an den Mitten (und im mittleren Drittel) der fremden Bilder messen */
      const messen = (t) => pg.evaluate((t) => new Promise((fertig) => {
        const b = document.querySelector(".lc-auftritt");
        if (!b) return fertig(null);
        b.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = t * 1000; });
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const lw = b.querySelector("canvas.lc-auftritt-3d"), g = lw.getContext("2d"), lr = lw.getBoundingClientRect(), s = lw.width / lr.width;
          const alle = [...b.querySelectorAll("canvas, .lc-auftritt-bild")];
          alle.forEach((e) => { e.style.pointerEvents = "auto"; });
          const ueber = [];
          document.querySelectorAll("#lcPlaetze .lc-platz").forEach((pl) => {
            if (pl.dataset.lcId === "ich") return;
            const k = pl.querySelector(".lc-kreis"), r = k.getBoundingClientRect();
            for (const [fx, fy] of [[0.5, 0.5], [0.4, 0.4], [0.6, 0.4], [0.4, 0.6], [0.6, 0.6]]) {
              const x = r.left + r.width * fx, y = r.top + r.height * fy;
              if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
              const px = g.getImageData(Math.floor((x - lr.left) * s), Math.floor((y - lr.top) * s), 1, 1).data;
              if (px[3] < 230) continue;          /* dort ist das Auto nicht (deckend) gemalt */
              const e = document.elementFromPoint(x, y);
              /* das eigene Bild sitzt am Steuer bzw. springt heraus – es liegt mit Absicht über dem Auto */
              if (e && e.closest && e.closest(".lc-auftritt-bild:not(.lc-auftritt-nachbar)")) continue;
              ueber.push({ wer: pl.dataset.lcId, oben: e === lw ? "auto" : (e && e.closest(".lc-auftritt-nachbar")) ? "kopie" : (e && (e.className.baseVal !== undefined ? "svg" : String(e.className).slice(0, 30))) || "nichts" });
            }
          });
          const bild = b.querySelector(".lc-auftritt-bild:not(.lc-auftritt-nachbar)"), rb = bild.getBoundingClientRect();
          const mitte = document.elementFromPoint(rb.left + rb.width / 2, rb.top + rb.height / 2);
          alle.forEach((e) => { e.style.pointerEvents = ""; });
          fertig({ auto: window.DMA_AUTO3D.jetzt(), ueber, kopien: b.querySelectorAll(".lc-auftritt-nachbar").length,
            bild: [rb.left + rb.width / 2, rb.top + rb.height / 2, rb.width], bildOben: !!(mitte && bild.contains(mitte)) });
        }));
      }), t);
      const reihe = [];
      for (let t = 0; t <= plan.D + 1e-6; t += plan.D / 60) reihe.push(await messen(t));
      const alleUeber = [].concat(...reihe.filter(Boolean).map((z) => z.ueber));
      const falsch = alleUeber.filter((u) => u.oben !== "auto");
      const koepfe = new Set(alleUeber.filter((u) => u.oben === "auto").map((u) => u.wer));
      sage(alleUeber.length > 0 && falsch.length === 0, "wo das Auto über einem fremden Profilbild gemalt ist, liegt die Leinwand oben (elementFromPoint trifft das Auto)",
        alleUeber.length + " Messpunkte, falsch: " + falsch.length + (falsch.length ? " z. B. " + JSON.stringify(falsch.slice(0, 3)) : ""));
      sage(koepfe.size >= 2, "das Auto fährt über mehrere Köpfe (" + [...koepfe].join(", ") + ")", "");
      sage(reihe.every((z) => !z || z.kopien === 0), "keine Bild-Kopien über dem Auto", "");
      /* Einsteigen/Aussteigen: am Halt sitzt das Bild im Auto (über der Leinwand), dann landet es auf dem Platz, solange das Auto noch steht */
      const halt = await messen(plan.Ta + 0.05);
      sage(halt && halt.bildOben && halt.bild[0] > halt.auto.links && halt.bild[0] < halt.auto.rechts && halt.bild[1] > halt.auto.oben && halt.bild[1] < halt.auto.unten,
        "am Halt sitzt das eigene Bild im Auto und liegt über dem Auto", JSON.stringify(halt && { bild: halt.bild.map(Math.round), auto: [halt.auto.links, halt.auto.rechts, halt.auto.oben, halt.auto.unten] }));
      let tSitz = null;
      for (let t = plan.Ta; t <= plan.D; t += 0.02) { const z = await messen(t); if (z && Math.hypot(z.bild[0] - platz[0], z.bild[1] - platz[1]) < 3 && Math.abs(z.bild[2] - platz[2]) < 6) { tSitz = { t, z }; break; } }
      sage(tSitz && tSitz.t <= plan.Th + 0.05 && tSitz.z.auto.rechts > 0 && tSitz.z.auto.links < B,
        "das Bild steigt aus, solange das Auto noch steht, und sitzt auf dem eigenen Platz", JSON.stringify(tSitz && { t: +tSitz.t.toFixed(2), abfahrt: plan.Th, auto: [tSitz.z.auto.links, tSitz.z.auto.rechts] }));
      const E = await messen(plan.D - 0.001);
      sage(E && (E.auto.rechts < 0 || E.auto.links > B || E.auto.unten < 0 || E.auto.deck < 0.02), "am Ende ist das Auto weg", JSON.stringify(E && [E.auto.links, E.auto.rechts, E.auto.deck]));
      if (BILD) {
        const zeiten = [["anfahrt", plan.tKurve - 0.3], ["kurve", plan.tKurve], ["heran", plan.Ta - 0.25], ["halt", plan.Ta + 0.05], ["aussteigen", plan.Ta + 0.35], ["abfahrt", plan.Th + 0.4], ["davon", plan.Th + 1.1]];
        for (const [n, t] of zeiten) { await messen(t); await pg.screenshot({ path: BILD + "-bat-" + breite + "-" + n + ".png" }); }
      }
      await pg.evaluate(() => { window.DMA_AUFTRITT_HALTEN = false; });
      await pg.waitForTimeout(700);
      const weg = await pg.evaluate(() => { const b = document.querySelector(".lc-auftritt"); if (b) { b.getAnimations({ subtree: true }).forEach((a) => a.play()); } return !b; });
      if (!weg) await pg.waitForTimeout(plan.D * 1000 + 600);
      const weg2 = await pg.evaluate(() => !document.querySelector(".lc-auftritt") && ![...document.querySelectorAll("style")].some((s) => /visibility: hidden !important/.test(s.textContent)));
      sage(weg2, "danach aufgeräumt (Bühne weg, eigenes Bild wieder sichtbar)", "");
    }

    console.log("\nSAUGNAPF-PFEIL · " + breite + " px\n");
    const PAARE = [["Alex", "Bea", "Nachbar rechts"], ["Bea", "Alex", "Nachbar links"], ["Dora", "Cem", "Nachbar links (Randplatz)"], ["Emil", "Alex", "darunter"], ["Alex", "Emil", "darüber"],
      ["Finn", "Alex", "schräg unten"], ["Alex", "Finn", "schräg oben"], ["Emil", "Bea", "schräg unten links"], ["Hana", "Cem", "schräg unten rechts"], ["Alex", "Hana", "weit weg"], ["Dora", "Emil", "weit weg (oben rechts)"]];
    for (const [von, wen, wie] of PAARE) {
      await pg.evaluate(([von, wen]) => { document.querySelectorAll(".lc-pfeil").forEach((x) => x.remove()); window.DMA_PRUEFUNG.wirkung("saugpfeil", wen, von); }, [von, wen]);
      try { await pg.waitForFunction(() => document.querySelector(".lc-pfeil .lc-pfeil-napf"), null, { timeout: 3000 }); } catch (e) {}
      const bei = (ms) => pg.evaluate(([ms, von, wen]) => new Promise((fertig) => {
        document.getAnimations().forEach((a) => { const el = a.effect && a.effect.target; if (el && el.closest && (el.closest(".lc-pfeil") || el.classList.contains("lc-gepfeilt"))) { a.pause(); a.currentTime = ms; } });
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const pfeil = document.querySelector(".lc-pfeil");
          if (!pfeil) return fertig(null);
          const platzVon = (n) => [...document.querySelectorAll("#lcPlaetze .lc-platz")].find((p) => ((p.querySelector(".lc-name") || {}).textContent || "").trim() === n)
            || document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + n.toLowerCase() + '"]') || (n === "Alex" ? document.querySelector("#lcPlaetze .lc-platz-ich") : null);
          const kz = platzVon(wen).querySelector(".lc-kreis").getBoundingClientRect(), ks = platzVon(von).querySelector(".lc-kreis").getBoundingClientRect();
          const napf = pfeil.querySelector(".lc-pfeil-napf").getBoundingClientRect(), nocke = pfeil.querySelector(".lc-pfeil-nocke").getBoundingClientRect();
          const teile = [...pfeil.querySelectorAll("svg, svg *")];
          teile.forEach((e) => { e.style.pointerEvents = "auto"; });
          /* Raster 9 × 9 über dem mittleren Drittel */
          const deckt = (r) => { let n = 0; for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) { const x = r.left + r.width / 3 + r.width / 3 * i / 8, y = r.top + r.height / 3 + r.height / 3 * j / 8; const e = document.elementFromPoint(x, y); if (e && e.closest && e.closest(".lc-pfeil")) n++; } return n; };
          const erg = { napf: [napf.left + napf.width / 2, napf.top + napf.height / 2], nocke: [nocke.left + nocke.width / 2, nocke.top + nocke.height / 2],
            ziel: [kz.left, kz.top, kz.width, kz.height], schuetze: deckt(ks), zielMitte: deckt(kz), sichtbar: getComputedStyle(pfeil.querySelector(".lc-pfeil-bild")).opacity };
          teile.forEach((e) => { e.style.pointerEvents = ""; });
          fertig(erg);
        }));
      }), [ms, von, wen]);
      const Z = await bei(2400);
      if (!Z) { sage(false, wie + " (" + von + " → " + wen + "): Pfeil erscheint", ""); continue; }
      const [zl, zo, zb, zh] = Z.ziel, relY = (Z.napf[1] - zo) / zh, relX = (Z.napf[0] - zl) / zb;
      sage(relY >= -0.05 && relY < 1 / 3 && relX > 0 && relX < 1, wie + " (" + von + " → " + wen + "): Saugnapf-Mitte im oberen Drittel des Ziels", "bei " + Math.round(relX * 100) + " % / " + Math.round(relY * 100) + " % des Bildes");
      sage(Z.nocke[1] < Z.napf[1] - zh * 0.3, wie + ": der Schaft zeigt vom Kopf weg nach oben/außen (Nocke " + Math.round(Z.napf[1] - Z.nocke[1]) + " px über dem Napf)", "");
      let schlimm = null;
      for (const ms of [720, 900, 1100, 1400, 1800, 2400, 3000]) { const q = await bei(ms); if (q && (q.schuetze || q.zielMitte) && !schlimm) schlimm = { ms, schuetze: q.schuetze, ziel: q.zielMitte }; }
      sage(!schlimm, wie + ": Gesichtsmitte von Schütze und Ziel bleibt frei (Aufprall bis Ausblenden, auch im Drill)", schlimm ? JSON.stringify(schlimm) + " von 81 Rasterpunkten bedeckt" : "");
      if (BILD) {
        await bei(2400);
        await pg.screenshot({ path: BILD + "-pfeil-" + breite + "-" + von + "-" + wen + ".png" });
        if (von === "Alex" && wen === "Bea") for (const ms of [120, 260, 420, 600, 714, 900]) { await bei(ms); await pg.screenshot({ path: BILD + "-pfeilflug-" + breite + "-" + ms + ".png" }); }
      }
      await pg.evaluate(() => { document.querySelectorAll(".lc-pfeil").forEach((x) => x.remove()); document.querySelectorAll(".lc-gepfeilt").forEach((x) => x.classList.remove("lc-gepfeilt")); });
    }
    await pg.context().close();
  }
  sage(kf.length === 0, "keine Fehler in der Konsole", kf.slice(0, 3).join(" | "));
  console.log("\nFassung 841 (Batmobil über den Köpfen, Saugnapf oben am Kopf): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
