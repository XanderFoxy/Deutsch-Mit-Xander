#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 100 — SCHIFFE VERSENKEN OHNE GLITCH
   ---------------------------------------------------------------------
   XANDER (Walkie-Talkie, 24.09.2026): „Schiffe versenken glitcht noch
   extrem. Die Wellen sitzen nicht mittig auf den Positionen, die unteren
   Reihen sind ueberhaupt nicht anwaehlbar, es fehlen dazugehoerige
   Erkennungssounds fuer das Wasser und das Versenken. Die Ansage, dass
   jemand dran ist, verschiebt immer noch das Livestream-Design. Die
   Ansage, dass jemand dran ist, ist besser als transparentes Overlay
   ueber dem Spielfeld."
   GEMESSEN WIRD — im ECHTEN Raum (renderLiveChat), auf 390 x 844:
     1. Der Schiedsrichter nimmt Schuesse auf ALLE 16 Felder an
        (vorher: 9 bis 16 wurden verworfen, „nr > PLAETZE" mit 8).
     2. Jedes Zeichen sitzt genau auf der Kreismitte (vorher 6 px tiefer).
     3. Die Ansage verschiebt nichts: der Chat steht vor dem Spiel, mit
        „Bea ist dran" und mit „Du bist dran" am selben Pixel (vorher
        +44 und +38 px). Sie liegt UEBER dem Brett und laesst Tipps durch.
     4. Zum letzten Schuss kommt genau EIN Ton — Wasser oder Versenken —
        und beim Neuzeichnen kein zweites Mal.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (dazu ? "   " + dazu : ""));
};
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF
    && window.DMA_SCHIFFE, { timeout: 25000 });

  console.log("RUNDE 100 — Schiffe versenken\n\n1  DER SCHIEDSRICHTER NIMMT ALLE 16 FELDER AN\n");
  const schuesse = await pg.evaluate(() => {
    const aus = [];
    for (let nr = 1; nr <= 16; nr++) {
      const r = window.LiveChat.pruefSchiffeSchuss(nr) || [];
      const s = r.find((d) => d.t === "schuss");
      aus.push(s && s.nr === nr && s.treffer ? "" : String(nr));
    }
    return aus.filter(Boolean);
  });
  sage(schuesse.length === 0, "ein Schuss auf jedes der 16 Felder kommt an und trifft",
    schuesse.length ? "verworfen: " + schuesse.join(", ") : "1 bis 16");

  await pg.evaluate(() => {
    const leute = {};
    ["Bea", "Cem"].forEach((n, i) => { leute["p" + i] = { id: "p" + i, name: n, seit: 2000 + i * 100 }; });
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
  });
  await pg.waitForTimeout(600);
  const chatOben = () => pg.evaluate(() => Math.round(document.querySelector(".lc-chat").getBoundingClientRect().top));
  /* Erst wenn die Seite ruht: in den ersten Sekunden setzt sie noch
     um ein, zwei Pixel nach (Schriften, Bilder) — das waere kein Spiel. */
  let vorher = await chatOben();
  for (let i = 0; i < 20; i++) { await pg.waitForTimeout(250); const j = await chatOben(); if (j === vorher) break; vorher = j; }
  /* Die Toene werden mitgeschrieben statt gespielt. */
  await pg.evaluate(() => {
    /* Gezaehlt wird jedes play() — die Toene werden vorgehalten und
       wiederverwendet, ein Zaehler an „new Audio" saehe den zweiten
       Schuss mit demselben Ton gar nicht. */
    window.__toene = [];
    const spiel = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene.push(String(this.currentSrc || this.src || ""));
      return spiel.apply(this, arguments);
    };
  });
  const tafel = { 2: "daneben", 7: "daneben", 9: "daneben", 12: "daneben", 14: "daneben", 16: "daneben" };
  await pg.evaluate((t) => window.DMA_SCHIFFE({ phase: "schiessen", ichBin: "ich", dran: "p0", dranName: "Bea",
    tafel: t, meins: 5, plaetze: 16, text: "Alex schießt auf Platz 16 — daneben.",
    letzter: { nr: 16, treffer: false, zeit: Date.now() } }), tafel);
  await pg.waitForTimeout(400);
  const beaDran = await chatOben();
  await pg.evaluate((t) => window.DMA_SCHIFFE({ phase: "schiessen", ichBin: "ich", dran: "ich",
    tafel: t, meins: 5, plaetze: 16, text: "", letzter: { nr: 16, treffer: false, zeit: Date.now() - 50 } }), tafel);
  await pg.waitForTimeout(300);
  const ichDran = await chatOben();

  console.log("\n2  DIE ZEICHEN SITZEN AUF DER KREISMITTE\n");
  const mitte = await pg.evaluate(() => [...document.querySelectorAll("#lcPlaetze .lc-platz")].map((p) => {
    const z = p.querySelector(".lc-schiff-zeichen");
    if (!z || !z.dataset.art) return null;
    const k = p.querySelector(".lc-kreis").getBoundingClientRect(), r = z.getBoundingClientRect();
    return Math.max(Math.abs(r.left + r.width / 2 - k.left - k.width / 2), Math.abs(r.top + r.height / 2 - k.top - k.height / 2));
  }).filter((v) => v !== null));
  sage(mitte.length >= 7 && Math.max.apply(null, mitte) <= 1,
    "jedes Zeichen genau mittig im Kreis", mitte.length + " Zeichen, groesste Abweichung "
      + (mitte.length ? Math.max.apply(null, mitte).toFixed(1) : "-") + " px");
  const emoji = await pg.evaluate(() => [...document.querySelectorAll(".lc-schiff-zeichen")]
    .map((z) => z.textContent.trim()).filter(Boolean));
  sage(emoji.length === 0, "und gezeichnet, kein Emoji als Grafik", emoji.join(" ") || "nur SVG");

  console.log("\n3  DIE ANSAGE VERSCHIEBT NICHTS\n");
  sage(beaDran === vorher && ichDran === vorher, "der Chat bleibt am selben Pixel",
    "vorher " + vorher + ", Bea dran " + beaDran + ", ich dran " + ichDran);
  const schicht = await pg.evaluate(() => {
    const z = document.getElementById("lcSchiffeZeile");
    if (!z) return null;
    const cs = getComputedStyle(z), r = z.getBoundingClientRect(), b = document.getElementById("lcPlaetze").getBoundingClientRect();
    return { pos: cs.position, pe: cs.pointerEvents, drin: r.top >= b.top && r.bottom <= b.bottom, text: z.textContent.trim() };
  });
  sage(schicht && schicht.pos === "absolute" && schicht.drin, "sie liegt als Schicht ueber dem Brett",
    schicht ? schicht.text : "keine Ansage");
  sage(schicht && schicht.pe === "none", "... und Tipps gehen durch sie hindurch");

  console.log("\n4  EIN TON ZUM LETZTEN SCHUSS\n");
  /* Wie im Betrieb: EIN Schuss, eine Marke — und das Brett wird danach
     noch zweimal neu gezeichnet (jede Nachricht zeichnet es neu). */
  const toene = await pg.evaluate(async (t) => {
    window.__toene = [];
    const tafel2 = Object.assign({}, t, { 11: "daneben" });
    const letzter = { nr: 11, treffer: false, zeit: Date.now() };
    const stand = { phase: "schiessen", ichBin: "ich", dran: "ich", tafel: tafel2, meins: 5,
                    plaetze: 16, text: "", letzter: letzter };
    for (let i = 0; i < 3; i++) { window.DMA_SCHIFFE(stand); await new Promise((f) => setTimeout(f, 150)); }
    return window.__toene.filter((s) => /schiff(wasser|versenkt)/.test(s)).map((s) => s.split("/").pop());
  }, tafel);
  sage(toene.length === 1 && /schiffwasser/.test(toene[0]),
    "zum Fehlschuss klingt das Wasser — genau einmal, auch wenn das Brett dreimal neu gezeichnet wird",
    toene.join(", ") || "kein Ton");
  const toene2 = await pg.evaluate(async (t) => {
    window.__toene = [];
    const tafel3 = Object.assign({}, t, { 11: "daneben", 3: "treffer" });
    const stand = { phase: "schiessen", ichBin: "ich", dran: "ich", tafel: tafel3, meins: 5, plaetze: 16,
                    text: "", letzter: { nr: 3, treffer: true, zeit: Date.now() } };
    window.DMA_SCHIFFE(stand); await new Promise((f) => setTimeout(f, 150)); window.DMA_SCHIFFE(stand);
    return window.__toene.filter((s) => /schiff(wasser|versenkt)/.test(s)).map((s) => s.split("/").pop());
  }, tafel);
  sage(toene2.length === 1 && /schiffversenkt/.test(toene2[0]), "zum Treffer klingt das Versenken — genau einmal",
    toene2.join(", ") || "kein Ton");

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
