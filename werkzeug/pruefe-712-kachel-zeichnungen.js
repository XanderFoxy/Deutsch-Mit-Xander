#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 712: DIE ECHTEN ZEICHNUNGEN AUF DEN KACHELN
   ---------------------------------------------------------------------
   XANDER (Funk 158): „da steht nur Hörer … du kannst auch Musik
   hinschreiben … die Hörer genauso machen wie wir das Symbol haben für
   die Apple airpods Max … die Lokomotive … den Delfin … den Frosch …
   klein runter skaliert … dass es auf die Kachel passt".
   Android-Telefon (360 px).
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75 });
  const pg = await ctx.newPage();
  const kf = []; pg.on("pageerror", (e) => kf.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEFUNG && window.DMA_PRUEF, { timeout: 25000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true,
      leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
  });
  console.log("\nPLATZMENÜ BEI BEA\n");
  await pg.evaluate(() => window.DMA_PRUEFUNG.platzMenue(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]')));
  await pg.waitForTimeout(250);
  const m = await pg.evaluate(() => {
    const k = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")];
    const wort = (b) => (b.querySelector(".lc-platzmenue-wort") || {}).textContent;
    const mus = k.find((b) => wort(b) === "Musik");
    const s = mus && mus.querySelector("svg");
    const r = s ? s.getBoundingClientRect() : { width: 0, height: 0 };
    const kr = mus ? mus.getBoundingClientRect() : { left: 0, right: 0 };
    return { hoerer: k.some((b) => wort(b) === "H\u00f6rer"), musik: !!mus,
      echt: !!(s && s.classList.contains("lc-mini-echt")),
      apm: !!(s && s.querySelector("#apmKL") && s.querySelector("#apmKBlau")),
      buegel: s ? s.querySelectorAll('path[stroke="url(#apmKStahl)"]').length : 0,
      w: Math.round(r.width), h: Math.round(r.height),
      drin: s ? r.left >= kr.left - 1 && r.right <= kr.right + 1 : false,
      kannWeg: !!(s && getComputedStyle(s).position === "static") };
  });
  sage(m.musik && !m.hoerer, "Kachel heißt „Musik“ statt „Hörer“");
  sage(m.echt && m.apm && m.buegel === 2, "Musik zeigt die echte AirPods-Max-Zeichnung (Brücke, zwei Bügel, eigene Verläufe)", "Bügel " + m.buegel);
  sage(m.w >= 24 && m.w <= 40 && m.h >= 18 && m.kannWeg && m.drin, "Größe passt auf die Kachel", m.w + "×" + m.h);
  await pg.evaluate(() => { const b = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")].find((x) => /Musik/.test(x.textContent)); b.scrollIntoView({ block: "center" }); });
  const mus = pg.locator("#lcPlatzMenue .lc-platzmenue-knopf", { hasText: "Musik" }).first();
  const kb = await mus.boundingBox();
  await pg.screenshot({ path: "/tmp/claude-0/p-712-musik.png", clip: { x: 0, y: Math.max(0, kb.y - 60), width: 360, height: 160 } });
  await pg.evaluate(() => { const m = document.getElementById("lcPlatzMenue"); if (m) m.remove(); });

  console.log("\nANREISE: LOK, DELFIN, FROSCH\n");
  /* Lok und Frosch stehen im Anreise-Menue (freier Platz halten). */
  const frei = await pg.evaluate(() => { const f = [...document.querySelectorAll(".lc-platz")].find((p) => p.classList.contains("lc-platz-frei"));
    if (f) window.DMA_PRUEFUNG.anreiseMenue(f); return !!f; });
  sage(frei, "freier Platz für das Anreise-Menü gefunden");
  await pg.waitForTimeout(300);
  const r = await pg.evaluate(() => {
    const k = [...document.querySelectorAll(".lc-anreise-knopf")];
    const name = (b) => (b.title || (b.querySelector(".lc-platzmenue-wort") || {}).textContent || "").trim();
    const aus = {};
    ["Dampflok", "Delfin", "Frosch"].forEach((n) => {
      const b = k.find((x) => name(x) === n); const s = b && b.querySelector("svg");
      const rr = s ? s.getBoundingClientRect() : { width: 0, height: 0 };
      aus[n] = { da: !!b, echt: !!(s && s.classList.contains("lc-mini-echt")), w: Math.round(rr.width), h: Math.round(rr.height),
        teile: s ? s.querySelectorAll("path,circle,rect,ellipse").length : 0,
        beine: s ? [...s.querySelectorAll(".lc-frosch-hbein")].map((g) => g.children.length) : [],
        rad: s ? s.querySelectorAll(".lc-lok-speiche").length : 0,
        farbe: s && s.querySelector(".lc-delfin-leib") ? getComputedStyle(s.querySelector(".lc-delfin-leib")).fill : "",
        lauf: s ? [...s.querySelectorAll("*")].some((e) => getComputedStyle(e).animationName !== "none") : true };
    });
    return aus;
  });
  sage(r.Dampflok.echt && r.Dampflok.rad === 24, "Dampflok: dieselbe Lok wie bei der Fahrt (drei Räder mit je acht Speichen)", r.Dampflok.w + "×" + r.Dampflok.h + ", Speichen " + r.Dampflok.rad);
  sage(r.Delfin.echt && /111, 138, 166|6f8aa6/.test(r.Delfin.farbe), "Delfin: dieselbe Zeichnung, Farbe aus der Animation", r.Delfin.farbe);
  sage(r.Frosch.echt && r.Frosch.beine.length === 2 && r.Frosch.beine.every((n) => n >= 3), "Frosch: dieselbe Zeichnung, sitzende Hinterbeine gerechnet", "Beine " + r.Frosch.beine.join("/"));
  sage(["Dampflok", "Delfin", "Frosch"].every((n) => !r[n].lauf), "auf der Kachel läuft keine Animation (ruhig, sparsam)");
  sage(["Dampflok", "Delfin", "Frosch"].every((n) => r[n].w >= 24 && r[n].w <= 40 && r[n].h >= 18 && r[n].h <= 30), "alle passen auf die Kachel",
    ["Dampflok", "Delfin", "Frosch"].map((n) => n + " " + r[n].w + "×" + r[n].h).join(", "));
  await pg.evaluate(() => { const m = document.querySelector(".lc-anreise-reihe"); if (m) m.scrollIntoView({ block: "center" }); });
  await pg.locator(".lc-anreise-reihe").first().screenshot({ path: "/tmp/claude-0/p-712-reisen.png" });

  /* Lupe: die vier Kacheln nebeneinander, vierfach vergroessert. */
  await pg.evaluate(() => {
    const k = [...document.querySelectorAll(".lc-anreise-knopf")].filter((b) => /^(Dampflok|Delfin|Frosch)$/.test((b.title || "").trim()));
    const l = document.createElement("div"); l.id = "lupe712";
    l.style.cssText = "position:fixed;left:0;top:0;z-index:99999;display:flex;gap:8px;padding:8px;background:#1b2130;transform:scale(3);transform-origin:0 0";
    k.forEach((b) => l.appendChild(b.cloneNode(true)));
    const m = document.createElement("button"); m.className = "lc-platzmenue-knopf"; m.style.cssText = "width:56px";
    m.innerHTML = '<span class="lc-platzmenue-zeichen">' + window.DMA_PRUEF.zeichnungen.apm().replace(/<svg class="/, '<svg class="lc-mini-echt ').replace(/viewBox="[^"]*"/, 'viewBox="-3 -6 168 112"').replace(/(id="|#)apm/g, "$1apmZ") + '</span><span class="lc-platzmenue-wort">Musik</span>';
    l.insertBefore(m, l.firstChild); document.body.appendChild(l);
  });
  await pg.waitForTimeout(100);
  await pg.screenshot({ path: "/tmp/claude-0/p-712-lupe.png", clip: { x: 0, y: 0, width: 360, height: 180 } });
  await pg.evaluate(() => document.getElementById("lupe712").remove());

  console.log("\nDIE ANIMATIONEN NEHMEN WEITER IHRE ZEICHNUNG\n");
  const a = await pg.evaluate(() => ({
    lok: /lc-lok-speiche/.test(window.DMA_PRUEF.zeichnungen.lok()), del: /lc-delfin-leib/.test(window.DMA_PRUEF.zeichnungen.delfin()),
    fro: /lc-frosch-hbein/.test(window.DMA_PRUEF.zeichnungen.frosch()), apm: /id="apmL"/.test(window.DMA_PRUEF.zeichnungen.apm()) }));
  sage(a.lok && a.del && a.fro && a.apm, "Lok, Delfin, Frosch und AirPods behalten am Platz ihre Zeichnung (Verläufe ohne Kürzel)", JSON.stringify(a));

  sage(kf.length === 0, "keine Fehler in der Konsole", kf.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 712: " + fehler + " rot." : "Fassung 712 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close(); process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
