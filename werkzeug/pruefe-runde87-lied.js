/* =====================================================================
   SONDE RUNDE 87 — DAS EIGENE LIED WIRKLICH HOEREN
   ---------------------------------------------------------------------
   XANDER: „mache das möglich, dass ich mein Lied selber hören kann,
   nicht nur einstellen kann, sondern sofort hören kann. Ich kann es
   immer noch nicht hören." Und: „Das Musikstück kann ich immer noch
   nicht für mich einstellen über die Note oder über den Kopfhörer
   selber."

   Gemessen wird:
     1. Bietet die Note (Musik für alle) einen Weg „Nur für mich"?
     2. Laeuft das Lied nach dem Aussuchen SOFORT — also im selben
        Fingertipp und ohne den Umweg ueber die Chatzeile?
     3. Laeuft es auch dann, wenn die kurzen Aufkleber-Toene
        abgeschaltet sind? (Das war die eigentliche Sperre.)
     4. Faengt es nicht doppelt an, wenn die eigene Zeile aus dem Raum
        zurueckkommt?
     5. Wirkt der Ausschnitt (ab/bis)?
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 87 — das eigene Lied");
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    /* WICHTIG FUER DIESE MESSUNG: Teilanfragen (Range) beantworten.
       Ohne sie kann ein Abspieler NICHT springen — er bekommt die
       Datei nur von vorn. Ein erster Anlauf dieser Sonde meldete
       deshalb „der Ausschnitt faengt bei 0 an", und das lag an
       diesem Server hier, nicht an der Seite. Ein echter Webserver
       (auch GitHub Pages) kann das laengst. */
    const st = fs.statSync(f);
    const typ = TYP[path.extname(f)] || "application/octet-stream";
    const bereich = q.headers.range && /bytes=(\d+)-(\d*)/.exec(q.headers.range);
    if (bereich) {
      const von = Number(bereich[1]);
      const bis = bereich[2] ? Number(bereich[2]) : st.size - 1;
      a.writeHead(206, { "Content-Type": typ, "Accept-Ranges": "bytes",
        "Content-Range": "bytes " + von + "-" + bis + "/" + st.size,
        "Content-Length": bis - von + 1 });
      return fs.createReadStream(f, { start: von, end: bis }).pipe(a);
    }
    a.writeHead(200, { "Content-Type": typ, "Accept-Ranges": "bytes",
      "Content-Length": st.size });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=document-user-activation-required"] });
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  /* Die Buehne hat einen Platz „Alex" mit der Klasse lc-platz-ich —
     genau das braucht lcMusikFuerMich. Zusaetzlich muss LiveChat.lage()
     denselben Namen melden, sonst findet der Weg „Nur fuer mich" ueber
     die Note niemanden. Und geschickte Zeilen laufen ins Leere, weil
     keine Verbindung steht — das ist fuer diese Messung genau richtig:
     was trotzdem laeuft, laeuft OHNE den Rueckweg. */
  await pg.evaluate(() => {
    const echt = LiveChat.lage;
    LiveChat.lage = () => Object.assign(echt(), { lage: "drin", ichName: "Alex" });
    window.__geschickt = [];
    LiveChat.schreiben = (z) => { window.__geschickt.push(z); return Promise.resolve(); };
    /* Die kurzen Aufkleber-Toene ausdruecklich ABSCHALTEN — das war
       die Sperre, die das Lied stumm gemacht hat. */
    try { localStorage.setItem("dma_livechat_toene", "aus"); } catch (e) {}
  });

  /* --- 1. Der Weg „Nur fuer mich" bei der Note ----------------------- */
  await pg.evaluate(() => window.DMA_PRUEF.musikWaehler && window.DMA_PRUEF.musikWaehler());
  let wegDa = await pg.evaluate(() => Boolean(document.querySelector(".lc-musik-nurich")));
  if (!wegDa) {
    /* Ohne Pruefzugang ueber den Knopf selbst. */
    await pg.evaluate(() => {
      const k = document.getElementById("lcMusikKnopf");
      if (k) k.click();
    });
    await pg.waitForTimeout(300);
    wegDa = await pg.evaluate(() => Boolean(document.querySelector(".lc-musik-nurich")));
  }
  sage(wegDa, "Die Note bietet „Nur für mich — Lied aussuchen\"");

  /* --- 2./3. Das Lied laeuft sofort, auch mit stummen Aufklebern ------ */
  const erg = await pg.evaluate(async () => {
    document.getElementById("lcPlatzMenue")?.remove();
    /* Den Weg gehen, den ein Mensch geht: Liedliste fuer MICH, erstes
       Lied, dann „Ganzes Lied". Alles ueber echte Klicks. */
    window.DMA_PRUEF.musikWaehler("Alex");
    await new Promise((r) => setTimeout(r, 200));
    const lied = document.querySelector("#lcPlatzMenue .lc-lese-text");
    if (!lied) return { fehlt: "Liedliste" };
    lied.click();
    await new Promise((r) => setTimeout(r, 250));
    const ganz = document.querySelector("#lcPlatzMenue .lc-lese-text");
    if (!ganz) return { fehlt: "Ganz-oder-Stueck" };
    ganz.click();
    await new Promise((r) => setTimeout(r, 900));
    const a = document.querySelector("audio[playsinline]");
    return {
      toeneAus: (() => { try { return localStorage.getItem("dma_livechat_toene"); } catch (e) { return "?"; } })(),
      audioDa: Boolean(a),
      quelle: a ? decodeURIComponent((a.currentSrc || a.src || "").split("/").pop()) : "",
      laeuft: a ? !a.paused : false,
      stelle: a ? Number(a.currentTime.toFixed(2)) : -1,
      geschickt: window.__geschickt.slice()
    };
  });
  sage(!erg.fehlt, "Der Weg über das Menü führt bis zum Lied", erg.fehlt || "");
  sage(erg.toeneAus === "aus", "Die kurzen Aufkleber-Töne sind für die Messung aus");
  sage(erg.audioDa === true, "Ein Abspieler ist da");
  sage(erg.laeuft === true, "Das Lied läuft wirklich — sofort, ohne Umweg über den Raum",
    erg.quelle + ", bei " + erg.stelle + " s");
  sage(/^\/kopfhoerer Alex 1/.test(String(erg.geschickt[0] || "")),
    "Die Zeile geht trotzdem an den Raum (damit andere die Kopfhörer sehen)",
    String(erg.geschickt[0] || "nichts"));

  /* --- 4. Die eigene Zeile kommt zurueck: kein zweiter Anfang -------- */
  const doppelt = await pg.evaluate(async () => {
    const a = document.querySelector("audio[playsinline]");
    const vorher = a ? a.currentTime : -1;
    let lieder = [];
    try { lieder = LiveChat.lieder(); } catch (e) {}
    /* Genau das, was lcKopfhoerer beim Eintreffen der Nachricht tut. */
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Alex", "Alex",
      { lied: lieder[0].datei, liedTitel: lieder[0].titel });
    await new Promise((r) => setTimeout(r, 500));
    const b = document.querySelector("audio[playsinline]");
    return { vorher: Number(vorher.toFixed(2)),
             nachher: b ? Number(b.currentTime.toFixed(2)) : -1,
             laeuft: b ? !b.paused : false };
  });
  sage(doppelt.laeuft === true, "Es läuft danach immer noch");
  sage(doppelt.nachher >= doppelt.vorher,
    "Es fängt nicht noch einmal von vorn an",
    "vorher " + doppelt.vorher + " s, danach " + doppelt.nachher + " s");

  /* --- 4b. Die Kopfhoerer bleiben auf dem Kopf ----------------------
     XANDER: „die Kopfhoerer bleiben auch nicht auf meinem Kopf."
     Ein zweites Lied darf sie nicht abnehmen — nur das blosse
     Aufsetzen ein zweites Mal tut das. */
  const bleiben = await pg.evaluate(async () => {
    let lieder = [];
    try { lieder = LiveChat.lieder(); } catch (e) {}
    /* NUR an Beas Platz zaehlen: Alex traegt aus der Messung davor
       noch welche, und die wuerden hier mitgezaehlt. */
    const beaPlatz = [...document.querySelectorAll(".lc-platz")].find(
      (p) => (p.querySelector(".lc-platz-name") || {}).textContent === "Bea");
    const zaehlen = () => beaPlatz ? beaPlatz.querySelectorAll(".lc-kopfhoerer").length : -1;
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Bea", "Alex",
      { lied: lieder[0].datei, liedTitel: lieder[0].titel });
    await new Promise((r) => setTimeout(r, 350));
    const nachErstem = zaehlen();
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Bea", "Alex",
      { lied: lieder[1].datei, liedTitel: lieder[1].titel });
    await new Promise((r) => setTimeout(r, 350));
    const nachZweitem = zaehlen();
    /* Und ohne Lied nimmt der zweite Griff sie ab. */
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Bea", "Alex", {});
    await new Promise((r) => setTimeout(r, 350));
    return { nachErstem, nachZweitem, nachOhneLied: zaehlen() };
  });
  sage(bleiben.nachErstem === 1, "Das erste Lied setzt die Kopfhörer auf");
  sage(bleiben.nachZweitem === 1, "Ein zweites Lied lässt sie AUF dem Kopf",
    "gezählt: " + bleiben.nachZweitem);
  sage(bleiben.nachOhneLied === 0, "Ein blosses Aufsetzen ohne Lied nimmt sie ab",
    "gezählt: " + bleiben.nachOhneLied);

  /* --- 5. Der Ausschnitt ------------------------------------------- */
  const stueck = await pg.evaluate(async () => {
    let lieder = [];
    try { lieder = LiveChat.lieder(); } catch (e) {}
    window.DMA_PRUEF.musikSpielen(lieder[0].datei, lieder[0].titel, 40, 70, true);
    await new Promise((r) => setTimeout(r, 900));
    const a = document.querySelector("audio[playsinline]");
    return { stelle: a ? Number(a.currentTime.toFixed(1)) : -1, laeuft: a ? !a.paused : false };
  });
  sage(stueck.laeuft && stueck.stelle >= 39.5,
    "Ein Ausschnitt fängt an der gewünschten Stelle an",
    "bei " + stueck.stelle + " s (gewollt: ab 40 s)");

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
