/* =====================================================================
   SONDE RUNDE 99 — DAS WALKIE-TALKIE
   ---------------------------------------------------------------------
   XANDER: „dass ich praktisch immer wieder ein Pop-up bekomme, in dem
   Moment, wenn du etwas brauchst … ja oder nein … und dann Auswahl-
   Antworten … multiple Sachen."
   Gemessen mit einer nachgebauten Datenbank (keine echte Anfrage):
     1. Wer NICHT Betreiber ist, sieht keine Karte.
     2. Der Betreiber sieht sie, mit Frage und Thema.
     3. „Nein" klappt die Moeglichkeiten auf, mehrere ankreuzbar.
     4. „Senden" schreibt genau das zurueck, was angekreuzt war.
     5. Ein Klick in die Karte greift nicht zum Platz dahinter durch.
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
  console.log("RUNDE 99 — das Walkie-Talkie\n");
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
  const pg = await br.newPage({ viewport: { width: 900, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.Rueckfrage && typeof Backend !== "undefined", { timeout: 25000 });

  /* Die nachgebaute Datenbank: eine offene Frage, und jede Antwort
     wird mitgeschrieben. */
  const aufbauen = (betreiber) => pg.evaluate((b) => {
    window.__rfAntworten = [];
    const frage = { id: 7, thema: "Blume", frage: "Passt die Blume jetzt?",
      art: "ja_nein", optionen: ["zu gross", "nicht mittig", "Staengel falsch"] };
    const kette = {
      select() { return this; }, is() { return this; }, order() { return this; },
      limit() { return Promise.resolve({ data: [frage], error: null }); },
      update(werte) {
        return { eq(feld, wert) {
          window.__rfAntworten.push({ id: wert, werte: werte });
          return Promise.resolve({ error: null });
        } };
      }
    };
    Backend.isOwner = () => b;
    Backend.zugang = () => ({ from: () => kette });
    document.querySelectorAll(".rf-karte").forEach((k) => k.remove());
    window.Rueckfrage.holen();
  }, betreiber);

  await aufbauen(false);
  await pg.waitForTimeout(300);
  sage(await pg.evaluate(() => !document.querySelector(".rf-karte")),
    "Wer nicht Betreiber ist, sieht keine Karte");

  await aufbauen(true);
  await pg.waitForSelector(".rf-karte", { timeout: 4000 });
  const k = await pg.evaluate(() => {
    const c = document.querySelector(".rf-karte");
    return { frage: c.querySelector(".rf-frage").textContent,
             thema: (c.querySelector(".rf-thema") || {}).textContent,
             listeZu: c.querySelector(".rf-liste").hidden };
  });
  sage(k.frage === "Passt die Blume jetzt?" && k.thema === "Blume",
    "Der Betreiber sieht die Frage mit Thema", k.thema + " — " + k.frage);
  sage(k.listeZu, "Solange nichts falsch ist, bleibt die Karte klein");

  /* Durchgriff: ein Klick in die Karte darf nicht bis zum Dokument. */
  const durch = await pg.evaluate(() => {
    let angekommen = false;
    const h = () => { angekommen = true; };
    document.addEventListener("click", h);
    document.querySelector(".rf-frage").click();
    document.removeEventListener("click", h);
    return angekommen;
  });
  sage(!durch, "Ein Klick in die Karte greift nicht dahinter durch");

  await pg.evaluate(() => document.querySelector(".rf-nein").click());
  const n = await pg.evaluate(() => {
    const c = document.querySelector(".rf-karte");
    return { offen: !c.querySelector(".rf-liste").hidden,
             kaesten: c.querySelectorAll(".rf-option input[type=checkbox]").length };
  });
  sage(n.offen && n.kaesten === 3, "„Nein“ klappt drei ankreuzbare Möglichkeiten auf",
    n.kaesten + " Kästchen");

  await pg.evaluate(() => {
    const h = document.querySelectorAll(".rf-option input");
    h[0].checked = true; h[1].checked = true;
    document.querySelector(".rf-notiz").value = "etwas nach links";
    document.querySelector(".rf-senden").click();
  });
  await pg.waitForTimeout(200);
  const a = await pg.evaluate(() => window.__rfAntworten);
  const w = a[0] && a[0].werte;
  sage(w && w.antwort.ja === false && w.antwort.gewaehlt.join("|") === "zu gross|nicht mittig"
    && w.notiz === "etwas nach links" && w.beantwortet,
    "Zurück geht genau das, was angekreuzt war",
    w ? JSON.stringify(w.antwort) + " / " + w.notiz : "nichts");

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
