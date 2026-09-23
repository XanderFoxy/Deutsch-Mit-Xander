#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 94 — HEIMLICH TELEFONIEREN
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Das Anrufen ist auch noch nicht da, wo ich mit
   jemand heimlich telefonieren kann."

   WAS „HEIMLICH" HIER HEISST, und was nicht: geheim ist, WAS die
   beiden sagen. Dass sie telefonieren, sieht man — sonst redet der
   Raum ins Leere. Gemessen wird deshalb beides:

     1. Der Befehl „/anruf Name" schickt den Stand an den Raum.
     2. Auf JEDEM Geraet gilt dieselbe Regel:
          · wer telefoniert, hoert NUR seinen Gegenueber,
          · wer nicht telefoniert, hoert die beiden NICHT.
     3. An beiden Plaetzen steht ein Hoerer, und eine Leiste sagt,
        was los ist.
     4. „/anruf aus" macht alles rueckgaengig.
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
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.DMA_PRUEF
    && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  console.log("\n1) DER BEFEHL\n");
  const start = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    try {
      LiveChat.pruefSitz({ lage: "drin", ichId: "ich-1", ichName: "Alex",
                           buehne: true, zuruecksetzen: true });
    } catch (e) {}
    try { LiveChat.pruefPersonSetzen("bea-1", "Bea"); } catch (e) {}
    try { LiveChat.pruefPersonSetzen("cem-1", "Cem"); } catch (e) {}
    const raus = [];
    const alt = LiveChat.pruefSenden ? null : null;
    LiveChat.schreiben("/anruf Bea");
    await new Promise((f) => setTimeout(f, 120));
    const n = (LiveChat.lage().nachrichten || []).slice(-1)[0] || {};
    return { text: String(n.text || ""),
             hoerer: document.querySelectorAll(".lc-telefonat").length,
             band: Boolean(document.getElementById("lcTelefonband")),
             bandText: (document.getElementById("lcTelefonband") || {}).textContent || "" };
  });
  sage(/telefonierst mit Bea/.test(start.text), "\u201e/anruf Bea\u201c sagt, dass es laeuft",
    start.text.slice(0, 60));
  sage(start.hoerer === 2, "an BEIDEN Plaetzen haengt ein Hoerer",
    start.hoerer + " Hoerer");
  sage(start.band && /Bea/.test(start.bandText), "und eine Leiste sagt, mit wem",
    start.bandText.slice(0, 60));

  console.log("\n2) WER HOERT WEN — die Regel, auf jedem Geraet\n");
  const regel = await pg.evaluate(() => {
    /* Dieselbe Regel, wie sie livechat.js anwendet — hier fuer alle
       drei Sichten durchgespielt. */
    const f = LiveChat.pruefTelefonRegel;
    if (!f) return null;
    return { alexHoertBea: f("ich-1", "bea-1"), alexHoertCem: f("ich-1", "cem-1"),
             beaHoertAlex: f("bea-1", "ich-1"), beaHoertCem: f("bea-1", "cem-1"),
             cemHoertAlex: f("cem-1", "ich-1"), cemHoertBea: f("cem-1", "bea-1") };
  });
  if (!regel) {
    sage(false, "die Regel laesst sich nachrechnen (LiveChat.pruefTelefonRegel)");
  } else {
    sage(regel.alexHoertBea === true, "Alex hoert Bea");
    sage(regel.beaHoertAlex === true, "Bea hoert Alex");
    sage(regel.alexHoertCem === false, "aber Alex hoert Cem NICHT");
    sage(regel.beaHoertCem === false, "und Bea auch nicht");
    sage(regel.cemHoertAlex === false && regel.cemHoertBea === false,
      "und Cem hoert die beiden NICHT — das ist der Sinn der Sache");
  }

  console.log("\n3) AUFLEGEN\n");
  const aus = await pg.evaluate(async () => {
    LiveChat.schreiben("/anruf aus");
    await new Promise((f) => setTimeout(f, 120));
    const n = (LiveChat.lage().nachrichten || []).slice(-1)[0] || {};
    const f = LiveChat.pruefTelefonRegel;
    return { text: String(n.text || ""),
             hoerer: document.querySelectorAll(".lc-telefonat").length,
             band: Boolean(document.getElementById("lcTelefonband")),
             cemHoertAlex: f ? f("cem-1", "ich-1") : null };
  });
  sage(/Aufgelegt/.test(aus.text), "\u201e/anruf aus\u201c legt auf", aus.text.slice(0, 50));
  sage(aus.hoerer === 0 && !aus.band, "die Hoerer und die Leiste sind weg");
  sage(aus.cemHoertAlex === true, "und alle hoeren sich wieder");

  sage(aufSeite.length === 0, "keine Fehler auf der Seite",
    aufSeite.slice(0, 2).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
