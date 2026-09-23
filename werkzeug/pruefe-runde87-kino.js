/* =====================================================================
   SONDE RUNDE 87 — ADRESSZEILE WEG UND BILDSCHIRM AN
   ---------------------------------------------------------------------
   XANDER: „Ich habe auch noch immer nicht den Modus, dass oben die
   Adresszeile ausgeblendet wird beim Klassenzimmer und des Weiteren
   möchte ich einen Screen-on-Modus haben in dieser Situation, dass man
   dort länger bleiben kann … ich möchte, dass der Bildschirm hier offen
   gezwungen bleibt."

   RUNDE 97 UMGESTELLT — XANDER: „Ausserdem solltest du den
   Vollbildknopf wegmachen. Du solltest das nur so funktionieren
   lassen." Der Knopf ist also weg; der Modus selbst bleibt und geht
   beim Betreten von allein an. Die Sonde prueft deshalb jetzt genau
   andersherum: dass es den Knopf NICHT mehr gibt und trotzdem alles
   funktioniert.

   Gemessen wird:
     1. Ist der Knopf wirklich weg — aus der Seite und aus dem Code?
     2. Bringt schon das Betreten die Seite ins Vollbild? (Nur das
        nimmt die Adresszeile wirklich weg — Rollen tut es nicht.)
     3. Wird der Bildschirm wachgehalten? (Ablesbar ueber
        DMA_PRUEF.kinoStand(), seit der Knopf weg ist.)
     4. Kommt es beim naechsten Betreten von allein wieder?
     5. Geht beides aus, wenn man das Klassenzimmer verlaesst?
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 87 — Vollbild und Bildschirm-an");
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
  await pg.waitForFunction(() => window.LiveChat && document.getElementById("knowledgeSubnav"),
    { timeout: 20000 });

  /* Das Klassenzimmer braucht Supabase und WebRTC, beides gibt es in
     dieser Pruefung nicht. Damit die KOPFZEILE ueberhaupt gezeichnet
     wird — und nur um die geht es hier —, wird die Lage auf „drin"
     gestellt. Am Kino-Modus selbst aendert das nichts: der haengt am
     Tippen auf den Reiter und auf den Knopf, nicht an der Verbindung. */
  await pg.evaluate(() => {
    const echt = LiveChat.lage;
    LiveChat.moeglich = () => true;
    LiveChat.lage = () => Object.assign(echt(), {
      lage: "drin", raum: "klassenzimmer", ichId: "pruef", ichName: "Alex",
      moeglich: true, frei: 7
    });
  });

  const insKlassenzimmer = async () => {
    await pg.click('[data-target="view-knowledge"]');
    await pg.waitForTimeout(500);
    await pg.click('#knowledgeSubnav [data-sub="sub-livechat"]');
    await pg.waitForTimeout(900);
  };

  /* --- 1. Der Knopf ist WEG ------------------------------------------ */
  await insKlassenzimmer();
  const knopfWeg = await pg.evaluate(() => {
    const k = document.getElementById("lcKino");
    const stand = window.DMA_PRUEF && window.DMA_PRUEF.kinoStand
      ? window.DMA_PRUEF.kinoStand() : null;
    return { knopf: Boolean(k), stand: stand,
             text: document.body.innerText.indexOf("Vollbild") >= 0 };
  });
  sage(knopfWeg.knopf === false, "Der Vollbildknopf ist weg",
    knopfWeg.knopf ? "er steht noch da" : "kein #lcKino mehr");
  sage(knopfWeg.text === false, "und das Wort ,Vollbild\u2018 steht auch nirgends mehr auf der Seite");

  /* --- 2. Schon das Betreten bringt Vollbild -------------------------- */
  const beimEintritt = await pg.evaluate(() => {
    const stand = window.DMA_PRUEF && window.DMA_PRUEF.kinoStand
      ? window.DMA_PRUEF.kinoStand() : {};
    return { voll: Boolean(document.fullscreenElement), stand: stand,
             wachKann: Boolean(navigator.wakeLock) };
  });
  sage(beimEintritt.voll === true,
    "Schon das Betreten blendet die Adresszeile aus (Vollbild)");
  sage(beimEintritt.stand.laeuft === true,
    "der Kino-Modus laeuft, ohne dass jemand etwas antippen musste",
    JSON.stringify(beimEintritt.stand));

  /* --- 3. Der Bildschirm bleibt an ----------------------------------- */
  /* Die Sperre kann nur halten, wo der Browser sie kennt. In diesem
     Chromium gibt es navigator.wakeLock; wo nicht, wird es gesagt und
     nicht als Fehler gezaehlt — sonst behauptete die Sonde etwas ueber
     ein Geraet, das gar nicht mitspielt. */
  if (beimEintritt.wachKann) {
    sage(beimEintritt.stand.wach === true, "Und der Bildschirm wird wachgehalten",
      JSON.stringify(beimEintritt.stand));
  } else {
    console.log("  (zur Kenntnis) dieser Browser kennt navigator.wakeLock nicht");
  }

  /* --- 4. Beim Betreten kommt es von allein wieder -------------------- */
  await pg.evaluate(() => { try { localStorage.removeItem("dma_lc_kino"); } catch (e) {} });
  await pg.click('#knowledgeSubnav [data-sub="sub-wegweiser"]');
  await pg.waitForTimeout(500);
  await pg.click('#knowledgeSubnav [data-sub="sub-livechat"]');
  await pg.waitForTimeout(900);
  const beimBetreten = await pg.evaluate(() => Boolean(document.fullscreenElement));
  sage(beimBetreten === true,
    "Beim Betreten geht es von allein an, solange es nicht abgeschaltet wurde");

  /* --- 5. Beim Verlassen geht es wieder aus --------------------------- */
  await pg.click('#knowledgeSubnav [data-sub="sub-wegweiser"]');
  await pg.waitForTimeout(800);
  const nachWeg = await pg.evaluate(() => Boolean(document.fullscreenElement));
  sage(nachWeg === false, "Wer das Klassenzimmer verlaesst, ist auch aus dem Vollbild");

  /* --- 6. Der Bildschirm-an-Teil ------------------------------------- */
  const wach = await pg.evaluate(() => Boolean(navigator.wakeLock));
  console.log("  (zur Kenntnis) navigator.wakeLock in diesem Browser: " + wach);

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
