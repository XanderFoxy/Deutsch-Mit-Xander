#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 92 — EIN ZUGESENDETES LIED GEHT NIE STILL UNTER
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Die Kopfhoerer bleiben immer noch nicht auf dem
   Kopf und ich kann jemand anderem immer noch nicht mein Lied zeigen."
   Und frueher schon: „Du sagst, dass ich mir ein Lied anhoeren kann.
   Ich kann's mir immer noch nicht anhoeren … ich hoere gar nix … es
   passiert einfach nichts."

   DER STILLE AUSGANG, den diese Sonde bewacht: lcMusikSpielen bricht
   ab, wenn die Toene ausgeschaltet sind. Fuer Hintergrundmusik ist das
   richtig. Ein Lied, das MIR jemand aufsetzt, ist aber eine Zusendung —
   die darf nicht spurlos verschwinden. Gemessen wird deshalb:

     1. Toene AN   -> das Lied laeuft sofort.
     2. Toene AUS  -> es erscheint eine Leiste mit Absender und Titel.
     3. Ein Tipp darauf spielt es doch.
     4. Und die Kopfhoerer bleiben liegen: auch nach einem Auffrischen
        und nach einem kompletten Neuzeichnen der Sitzreihe.
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

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\n1) TOENE AN — das Lied laeuft sofort\n");
  const mitTon = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.toeneSetzen(true);
    window.DMA_PRUEF.effektBuehne();
    const lieder = window.LiveChat.lieder();
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Alex", "Bea",
      { lied: lieder[0].datei, liedTitel: lieder[0].titel });
    await new Promise((f) => setTimeout(f, 700));
    const st = window.DMA_PRUEFUNG.musikStand();
    return { laeuft: st.laeuft, quelle: (st.quelle || "").split("/").pop(),
             angebot: Boolean(document.getElementById("lcLiedAngebot")) };
  });
  sage(mitTon.laeuft === true, "das Lied spielt bei mir", mitTon.quelle || "-");
  sage(mitTon.angebot === false, "und es braucht kein Angebot");

  console.log("\n2) TOENE AUS — es kommt trotzdem an\n");
  const ohneTon = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.wirkung("musikaus", "", "Alex", {});
    window.DMA_PRUEFUNG.toeneSetzen(false);
    window.DMA_PRUEF.effektBuehne();
    const lieder = window.LiveChat.lieder();
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Alex", "Bea",
      { lied: lieder[1].datei, liedTitel: lieder[1].titel, name: "Bea" });
    await new Promise((f) => setTimeout(f, 500));
    const band = document.getElementById("lcLiedAngebot");
    return { angebot: Boolean(band),
             text: band ? (band.textContent || "").trim() : "",
             laeuft: window.DMA_PRUEFUNG.musikStand().laeuft };
  });
  sage(ohneTon.angebot === true, "eine Leiste sagt, dass ein Lied fuer mich da ist",
    ohneTon.text.slice(0, 60));
  sage(/Bea/.test(ohneTon.text), "und von wem es kommt", ohneTon.text.slice(0, 60));

  console.log("\n3) EIN TIPP DARAUF — und es spielt doch\n");
  const nachTipp = await pg.evaluate(async () => {
    const band = document.getElementById("lcLiedAngebot");
    if (!band) return { fehlt: true };
    band.querySelector('[data-tun="los"]').click();
    await new Promise((f) => setTimeout(f, 800));
    const st = window.DMA_PRUEFUNG.musikStand();
    return { laeuft: st.laeuft, quelle: (st.quelle || "").split("/").pop(),
             weg: !document.getElementById("lcLiedAngebot") };
  });
  sage(nachTipp.laeuft === true, "jetzt laeuft es", nachTipp.quelle || "-");
  sage(nachTipp.weg === true, "und die Leiste macht sich wieder aus dem Staub");

  console.log("\n4) DIE KOPFHOERER BLEIBEN LIEGEN\n");
  const bleibt = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    const lieder = window.LiveChat.lieder();
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Bea", "Alex",
      { lied: lieder[0].datei, liedTitel: lieder[0].titel });
    await new Promise((f) => setTimeout(f, 400));
    /* Nur AN BEAS PLATZ zaehlen: auf meinem eigenen liegt aus den
       Abschnitten davor schon ein Paar. */
    const beaPlatz = () => [...document.querySelectorAll(".lc-platz")]
      .find((p) => ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .trim().toLowerCase().indexOf("bea") === 0);
    const zaehl = () => { const p = beaPlatz();
      return p ? p.querySelectorAll(".lc-kopfhoerer").length : -1; };
    const gleich = zaehl();
    window.DMA_PRUEF.auffrischen();
    await new Promise((f) => setTimeout(f, 250));
    const nachAuf = zaehl();
    window.DMA_PRUEF.neuZeichnen();
    await new Promise((f) => setTimeout(f, 450));
    return { gleich: gleich, nachAuf: nachAuf, nachNeu: zaehl() };
  });
  sage(bleibt.gleich === 1, "sie sitzen auf", bleibt.gleich + " Paar");
  sage(bleibt.nachAuf === 1, "ein Auffrischen nimmt sie nicht ab", bleibt.nachAuf + " Paar");
  sage(bleibt.nachNeu === 1, "und ein komplettes Neuzeichnen auch nicht",
    bleibt.nachNeu + " Paar");

  sage(aufSeite.length === 0, "keine Fehler auf der Seite",
    aufSeite.slice(0, 2).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
