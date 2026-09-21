#!/usr/bin/env node
/* =========================================================
   RUNDE 38 — PAINTBALL, MÜNZE, WECKERKLÖPPEL
   ---------------------------------------------------------
   XANDER:
   1. „Bei dem Paintball sind die Farbklecksen immer nur auf
      einer Stelle die sollen über das ganze Bild … und dann
      runter fließen."
   2. „Bei der Münze sollen diese Bewegungeffekte weg und die
      Münze soll einfach drehen realistisch und sie soll am
      Boden landen und nicht in der Mitte vom Bild."
   3. „bei den Wecker musst du diesen Klöppel da zwischen den
      zwei schallkuppeln hin und her schlägt."

   Alle drei hatten DIESELBE Ursache im Kleinen: eine laufende
   CSS-Animation setzt „transform" und schlägt damit jede
   Regel im Stylesheet. Streuung und Größe der Kleckse standen
   aber genau dort — und wurden deshalb in dem Moment
   überschrieben, in dem der Klecks auftauchte. Diese Sonde
   misst deshalb die TATSÄCHLICHEN Kästen im Browser, nicht
   das, was in der Datei steht.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
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
  const pg = await br.newPage({ viewport: { width: 420, height: 820 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const nachbar = () => pg.evaluate(() =>
    ((document.querySelectorAll(".lc-platz .lc-platz-name")[1] || {}).textContent || "").trim());

  /* ---------- PAINTBALL ---------- */
  console.log("\nDIE FARBKLECKSE ÜBER DAS GANZE BILD\n");
  const pb = await pg.evaluate(async (name) => {
    document.querySelectorAll(".lc-paintfleck").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("paintfleck", name);
    await new Promise((f) => setTimeout(f, 1500));
    const platz = document.querySelectorAll(".lc-platz")[1];
    const kreis = platz.querySelector(".lc-kreis").getBoundingClientRect();
    const kl = [...document.querySelectorAll(".lc-paintfleck-klecks")].map((x) => {
      const r = x.getBoundingClientRect();
      return { x: r.left + r.width / 2 - kreis.left, y: r.top + r.height / 2 - kreis.top,
               b: r.width };
    });
    return { bild: Math.round(kreis.width), kleckse: kl,
             laeufer: document.querySelectorAll(".lc-paintfleck-laeufer").length };
  }, await nachbar());
  const xs = pb.kleckse.map((k) => k.x), ys = pb.kleckse.map((k) => k.y);
  const spanneX = xs.length ? Math.max(...xs) - Math.min(...xs) : 0;
  const spanneY = ys.length ? Math.max(...ys) - Math.min(...ys) : 0;
  pruefe("es sind mehrere Kleckse", pb.kleckse.length >= 6, pb.kleckse.length + " Stück");
  /* Auf EINER Stelle hiesse: alle Mitten dicht beieinander. Ueber die
     halbe Bildbreite verteilt ist das Gegenteil davon. */
  pruefe("sie liegen über das ganze Bild verteilt (quer)",
    spanneX > pb.bild * 0.4, Math.round(spanneX) + " von " + pb.bild + " px");
  pruefe("… und auch der Höhe nach",
    spanneY > pb.bild * 0.4, Math.round(spanneY) + " von " + pb.bild + " px");
  /* Und keiner darf das ganze Bild zudecken — sonst sieht man die
     anderen nicht mehr, und genau so sah es vorher aus. */
  const groesster = pb.kleckse.length ? Math.max(...pb.kleckse.map((k) => k.b)) : 0;
  pruefe("kein Klecks deckt das ganze Bild zu",
    groesster < pb.bild * 0.55, Math.round(groesster) + " px breitester");
  pruefe("und es läuft Farbe herunter", pb.laeufer > 0, pb.laeufer + " Schlieren");

  /* ---------- MÜNZE ---------- */
  console.log("\nDIE MÜNZE LANDET AM BODEN\n");
  const mz = await pg.evaluate(async (name) => {
    document.querySelectorAll(".lc-muenze").forEach((x) => x.remove());
    const platz = document.querySelectorAll(".lc-platz")[1];
    const kreis = platz.querySelector(".lc-kreis");
    const vorher = kreis.getBoundingClientRect();
    window.DMA_PRUEFUNG.wirkung("muenze", name);
    await new Promise((f) => setTimeout(f, 4000));
    const nachher = kreis.getBoundingClientRect();
    return { gefallen: nachher.top + nachher.height / 2 - (vorher.top + vorher.height / 2),
             hoch: nachher.height, bild: vorher.height,
             glanz: document.querySelectorAll(".lc-muenze-funkeln").length };
  }, await nachbar());
  pruefe("die Münze sinkt nach unten, statt in der Mitte zu bleiben",
    mz.gefallen > mz.bild * 0.12, Math.round(mz.gefallen) + " px tiefer");
  pruefe("sie liegt am Ende flach (auf dem Rücken)",
    mz.hoch < mz.bild * 0.35, Math.round(mz.hoch) + " von " + Math.round(mz.bild) + " px hoch");
  pruefe("der Glanzstreifen ist weg („diese Bewegungeffekte weg“)",
    mz.glanz === 0, mz.glanz + " gefunden");

  /* ---------- WECKERKLÖPPEL ---------- */
  console.log("\nDER KLÖPPEL SCHLÄGT ZWISCHEN DEN SCHELLEN\n");
  const wk = await pg.evaluate(async (name) => {
    document.querySelectorAll(".lc-wecker").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("wecker", name);
    await new Promise((f) => setTimeout(f, 260));
    const h = document.querySelector(".lc-schelle-hammer");
    if (!h) return { da: false };
    /* Wie weit schlaegt er aus? ZWEI Messungen im Abstand eines
       halben Schlages treffen nicht zuverlaessig die Umkehrpunkte —
       je nach Bildtakt liegt eine davon mittendrin, und dann sieht
       ein schwingender Kloeppel aus wie ein stehender. Deshalb ueber
       einen ganzen Schlag hinweg messen und die Spanne nehmen. */
    const orte = [];
    for (let t = 0; t < 14; t++) {
      await new Promise((f) => setTimeout(f, 50));
      const r = h.getBoundingClientRect();
      orte.push(r.left + r.width / 2);
    }
    const buegel = document.querySelector(".lc-schelle-buegel").getBoundingClientRect();
    return { da: true, weg: Math.max.apply(null, orte) - Math.min.apply(null, orte),
             breite: buegel.width,
             ursprung: getComputedStyle(h).transformOrigin };
  }, await nachbar());
  pruefe("der Klöppel ist da", wk.da === true);
  pruefe("er hängt oben am Bügel, nicht unten",
    wk.da && /^\s*[\d.]+px\s+0px/.test(String(wk.ursprung || "")), String(wk.ursprung || "-"));
  pruefe("er schlägt wirklich hin und her",
    wk.da && wk.weg > wk.breite * 0.15,
    wk.da ? Math.round(wk.weg) + " px Ausschlag bei " + Math.round(wk.breite) + " px Bügel" : "-");

  /* ---------- BILLARD ---------- */
  console.log("\nDIE BILLARDKUGEL ROLLT ÜBER DAS FELD\n");
  /* XANDER: „die Person immer in ihrem eigenen Platz verschwindet.
     Sie soll ein bisschen durch das Feld rollen, an den Ecken so
     abprallen." Auf der Prüfbühne ist JEDER Platz besetzt — das ist
     genau der Fall, in dem vorher der Rückfall „weggestossen" griff
     und das Bild auf der Stelle versank. Gemessen wird deshalb der
     zurückgelegte Weg über die Zeit. */
  const bi = await pg.evaluate(async (name) => {
    document.querySelectorAll(".lc-billard").forEach((x) => x.remove());
    const platz = document.querySelectorAll(".lc-platz")[1];
    const kreis = platz.querySelector(".lc-kreis");
    const heim = kreis.getBoundingClientRect().left;
    window.DMA_PRUEFUNG.wirkung("billard", name);
    const weg = [];
    for (let t = 0; t < 32; t++) {
      await new Promise((f) => setTimeout(f, 110));
      weg.push(kreis.getBoundingClientRect().left - heim);
    }
    return { breit: kreis.getBoundingClientRect().width,
             links: Math.min.apply(null, weg), rechts: Math.max.apply(null, weg) };
  }, await nachbar());
  pruefe("die Kugel rollt weit über den eigenen Platz hinaus",
    bi.rechts > bi.breit * 1.2, Math.round(bi.rechts) + " px nach rechts bei "
      + Math.round(bi.breit) + " px Bild");
  pruefe("… und prallt ab, kommt also auch zurück",
    bi.links < -bi.breit * 1.0, Math.round(bi.links) + " px nach links");

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nPaintball, Münze, Weckerklöppel und Billard sitzen.\n");
  process.exit(fehler ? 1 : 0);
})();
