/* =====================================================================
   SONDE RUNDE 88 — DER COWBOYHUT UND SEIN RUF
   ---------------------------------------------------------------------
   XANDER, woertlich:
   · „Bei dem Cowboyhut sieht man auch noch nicht, dass er am Ende mit
      seiner Hand den Cowboyhut ausrichtet."
   · „Die Animation kann auch ein bisschen laenger sein."
   · „das YIHAAH Geraeusch ist immer noch abgeschnitten."

   Drei Wuensche, drei Messungen — und zwar so, wie er es sieht und
   hoert, nicht so, wie es im Quelltext steht:

   AM BILD (die Drehung des Hutes wird aus der berechneten
   transform-Matrix gelesen, Grad fuer Grad ueber die ganze Laufzeit):
     1. Faellt der Hut SCHIEF auf den Kopf und bleibt er so liegen,
        solange gerufen wird? (Vorher sass er gerade — dann kann eine
        Hand nichts mehr ausrichten.)
     2. Ist die Hand waehrend des Rufs unsichtbar? (Seine Regel aus
        Runde 76: „Die Hand soll vorher gar nicht zu sehen sein.")
     3. Wie lange ist sie ueberhaupt zu sehen? Unter einer Sekunde
        sieht man nichts — das war der eigentliche Fehler.
     4. AENDERT sich die Lage des Hutes, waehrend die Hand daran ist?
        Eine Hand, unter der nichts passiert, ist Zierrat.
     5. Und sitzt er am Ende GERADE? „Ausrichten" heisst gerade, nicht
        schief.

   AM TON (ton/cowboy.opus, in 10-ms-Fenstern):
     6. Faellt der Ruf am Ende noch mit 45 dB in 80 ms ab? Dann ist er
        abgeschnitten. Ein Ruf klingt aus, er reisst nicht ab.
     7. Ist er so lang, dass die Hand danach noch Platz hat?
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FF = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

/* ---------------------------------------------------------------
   DER TON. Gemessen wird nicht die Dateilaenge allein — eine Datei
   kann lang sein und trotzdem abgeschnitten enden —, sondern das
   STEILSTE Gefaelle in den letzten 400 ms. */
function tonMessen(name) {
  const roh = execFileSync(FF, ["-v", "error", "-i",
    path.join(WURZEL, "ton", name + ".opus"),
    "-f", "f32le", "-ar", "48000", "-ac", "1", "-"],
    { maxBuffer: 1 << 28 });
  const n = roh.length / 4;
  const F = 480;                                 /* 10 ms */
  const db = [];
  for (let s = 0; s + F <= n; s += F) {
    let q = 0;
    for (let i = s; i < s + F; i++) { const v = roh.readFloatLE(i * 4); q += v * v; }
    db.push(10 * Math.log10(q / F + 1e-12));
  }
  /* Das letzte Fenster, in dem noch etwas zu hoeren ist (-60 dB). */
  let letzte = db.length - 1;
  while (letzte > 0 && db[letzte] < -60) letzte--;
  /* Und der steilste Sturz ueber drei Fenster (30 ms) im Ausklang,
     also in den 400 ms davor. */
  let steilste = 0, wo = 0;
  for (let i = Math.max(0, letzte - 40); i < letzte - 3; i++) {
    const d = db[i] - db[i + 3];
    if (d > steilste) { steilste = d; wo = i; }
  }
  return { dauer: n / 48000, hoerbarBis: (letzte + 1) * F / 48000,
           steilste, wo: wo * F / 48000 };
}

(async () => {
  console.log("RUNDE 88 — der Cowboyhut und sein Ruf\n");
  console.log("DER RUF — klingt er aus oder reisst er ab?\n");
  const t = tonMessen("cowboy");
  console.log("  gemessen: " + t.dauer.toFixed(2) + " s Datei, hoerbar bis "
    + t.hoerbarBis.toFixed(2) + " s, steilster Sturz im Ausklang "
    + t.steilste.toFixed(1) + " dB/30 ms bei " + t.wo.toFixed(2) + " s");
  /* Die alte Datei stuerzte um 45 dB in 80 ms, also rund 20 dB je
     30 ms. Eine Stimme, die von selbst verklingt, faellt mit hoechstens
     4 bis 6 dB in 30 ms. 12 dB ist die Grenze, unterhalb derer kein
     Mensch von „abgeschnitten" spricht. */
  sage(t.steilste < 12,
    "der Ruf verklingt, er reisst nicht ab (unter 12 dB/30 ms)",
    t.steilste.toFixed(1) + " dB/30 ms");
  sage(t.hoerbarBis > 2.1,
    "und er klingt lange genug nach (ueber 2,1 s hoerbar)",
    t.hoerbarBis.toFixed(2) + " s");
  /* Er darf aber auch nicht so lang werden, dass die Hand keinen
     Platz mehr hat: Start 120 ms + Ton, dann muss vor 2700 ms
     Schluss sein. Gemessen wird das HOERBARE Ende (-60 dB) und
     nicht die Dateilaenge: die letzten 190 ms der Hallfahne liegen
     darunter, die verdecken nichts mehr. */
  sage(0.12 + t.hoerbarBis <= 2.7,
    "und er ist verklungen, bevor die Hand kommt (vor 2700 ms)",
    Math.round((0.12 + t.hoerbarBis) * 1000) + " ms");
  sage(fs.existsSync(path.join(WURZEL, "werkzeug", "backup", "ton-runde88", "cowboy.opus")),
    "der alte Ruf liegt im Backup");
  sage(fs.existsSync(path.join(WURZEL, "werkzeug", "cowboyruf-bauen.py")),
    "und es ist nachvollziehbar, wie der neue entstanden ist");

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
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  /* Die ganze Animation wird in 50-ms-Schritten abgetastet. Aus der
     Matrix von .lc-hut-bild kommt die Drehung in Grad, aus der von
     .lc-hut-hand die Sichtbarkeit. */
  const reihe = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("hut", "2", "Alex", {});
    const grad = (el) => {
      const m = getComputedStyle(el).transform;
      if (!m || m === "none") return 0;
      const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
      return Math.atan2(z[1], z[0]) * 180 / Math.PI;
    };
    const aus = [];
    const t0 = performance.now();
    for (let i = 0; i <= 90; i++) {
      await new Promise((f) => setTimeout(f, 50));
      const hut = document.querySelector(".lc-hut-bild");
      const hand = document.querySelector(".lc-hut-hand");
      aus.push({
        t: Math.round(performance.now() - t0),
        hut: hut ? Number(grad(hut).toFixed(2)) : null,
        hutSicht: hut ? Number(getComputedStyle(hut).opacity) : 0,
        hand: hand ? Number(getComputedStyle(hand).opacity) : 0
      });
      if (!hut && i > 4) break;
    }
    return aus;
  });
  await br.close(); srv.close();

  const bei = (ms) => reihe.reduce((a, b) =>
    Math.abs(b.t - ms) < Math.abs(a.t - ms) ? b : a, reihe[0]);

  console.log("\nDAS BILD — faellt er schief und wird er gerade gerueckt?\n");
  /* 1. Waehrend des Rufs (1000 bis 2400 ms) muss er SCHIEF sitzen.
        Vorher sass er bei -1 Grad, also praktisch gerade. */
  const wahrendRuf = reihe.filter((r) => r.t >= 1000 && r.t <= 2400 && r.hutSicht > 0.5);
  const schiefste = wahrendRuf.reduce((a, r) => Math.min(a, r.hut), 0);
  sage(wahrendRuf.length > 5 && wahrendRuf.every((r) => r.hut < -4),
    "waehrend des Rufs sitzt der Hut schief (unter -4 Grad)",
    wahrendRuf.length + " Messpunkte, schiefste " + schiefste.toFixed(1) + " Grad");

  /* 2. Und die Hand ist in dieser Zeit nicht da. */
  const handImRuf = reihe.filter((r) => r.t <= 2420 && r.hand > 0.02);
  sage(handImRuf.length === 0,
    "die Hand ist waehrend des Rufs unsichtbar (bis 2420 ms)",
    handImRuf.length ? "sichtbar ab " + handImRuf[0].t + " ms" : "kein einziger Punkt");

  /* 3. Wie lange ist sie zu sehen? */
  const sichtbar = reihe.filter((r) => r.hand > 0.5);
  const von = sichtbar.length ? sichtbar[0].t : 0;
  const bis = sichtbar.length ? sichtbar[sichtbar.length - 1].t : 0;
  sage(sichtbar.length > 0 && bis - von >= 1300,
    "man sieht die Hand lange genug (ueber 1300 ms; vorher 510 ms)",
    von + " bis " + bis + " ms = " + (bis - von) + " ms");

  /* 4. Und unter ihr passiert wirklich etwas: die Drehung des Hutes
        muss sich in dieser Zeit um mehr als 5 Grad aendern. */
  const beiHand = reihe.filter((r) => r.t >= von && r.t <= bis && r.hutSicht > 0.5);
  const min = Math.min.apply(null, beiHand.map((r) => r.hut));
  const max = Math.max.apply(null, beiHand.map((r) => r.hut));
  sage(beiHand.length > 3 && max - min > 5,
    "waehrend die Hand da ist, richtet sich der Hut wirklich auf",
    "von " + min.toFixed(1) + " bis " + max.toFixed(1) + " Grad");

  /* 5. Am Schluss sitzt er gerade. Gemessen bei 3900 ms, also nach
        dem Ausrichten und vor dem Abblenden. */
  const spaet = bei(3900);
  sage(Math.abs(spaet.hut) < 1.5,
    "und am Ende sitzt er gerade (unter 1,5 Grad schief)",
    "bei " + spaet.t + " ms " + spaet.hut.toFixed(2) + " Grad");

  /* 6. Die Animation laeuft wirklich laenger. */
  const letzterHut = reihe.filter((r) => r.hut !== null).pop();
  sage(letzterHut && letzterHut.t >= 4200,
    "die Animation dauert laenger als vorher (ueber 4200 ms statt 3000)",
    "Hut zuletzt gesehen bei " + (letzterHut ? letzterHut.t : 0) + " ms");

  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
                     : "\nDer Hut faellt schief, die Hand richtet ihn aus, der Ruf klingt aus.\n");
  process.exit(fehler ? 1 : 0);
})();
