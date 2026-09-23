#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 97 — DER HUT WIRD NACH LINKS UND NACH RECHTS GERUECKT
   ---------------------------------------------------------------------
   XANDER (21.09.2026): „Bei dem Cowboyhut sieht man auch noch nicht,
   dass er am Ende mit seiner Hand den Cowboyhut nach links und nach
   rechts so um ihn auszurichten."
   XANDER (23.09.2026): „Der Cowboyhut hat immer noch kein
   realistisches Zurechtruecken."

   Die alte Sonde (pruefe-runde88-hut) prueft, DASS er sich aufrichtet:
   von -7 Grad auf 0. Das tat er auch — in EINER Bewegung. So rueckt
   aber niemand einen Hut zurecht. Diese Sonde misst deshalb die
   Bewegung selbst: der Hut muss in der Ruecke-Phase nach BEIDEN Seiten
   gehen (erst negativ, dann positiv, oder umgekehrt) und danach
   ruhig auf null stehen.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\nDIE RUECKE-BEWEGUNG, GRAD FUER GRAD\n");
  const spur = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("hut", "Bea", "Alex", {});
    /* ERST WARTEN, DANN MESSEN. Beim ersten Versuch lief die Schleife
       sofort los und die Beschriftung war geraten — gemessen wurde in
       Wirklichkeit die FALLPHASE. Jetzt steht die Zeit an der Uhr,
       nicht an der Schleife. */
    const t0 = performance.now();
    await new Promise((f) => setTimeout(f, 3250));
    const punkte = [];
    for (let i = 0; i <= 18; i++) {
      await new Promise((f) => setTimeout(f, 45));
      const t = Math.round(performance.now() - t0);
      /* Gemessen wird „.lc-hut-bild" selbst — dort haengt die
         Animation. Der Elternknoten traegt keine Drehung; beim ersten
         Versuch stand deshalb ueberall 0 Grad. */
      const h = document.querySelector(".lc-hut-bild");
      if (!h) { punkte.push(null); continue; }
      const m = new DOMMatrixReadOnly(getComputedStyle(h).transform);
      punkte.push({ t: t, grad: Math.round(Math.atan2(m.b, m.a) * 180 / Math.PI * 10) / 10 });
    }
    return punkte.filter(Boolean);
  });

  const grade = spur.map((p) => p.grad);
  const kleinste = Math.min.apply(null, grade);
  const groesste = Math.max.apply(null, grade);
  console.log("  " + spur.map((p) => p.t + ":" + p.grad).join("  ") + "\n");
  sage(kleinste < -2, "er geht nach LINKS", kleinste + " Grad");
  sage(groesste > 2, "und nach RECHTS", groesste + " Grad");
  sage(groesste - kleinste >= 6, "das ist ein echtes Hin und Her, kein Zucken",
    (groesste - kleinste).toFixed(1) + " Grad Weg");
  const zuletzt = grade.slice(-3);
  sage(zuletzt.every((g) => Math.abs(g) <= 1.5), "und danach sitzt er still und gerade",
    zuletzt.join(", ") + " Grad");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
