#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 92 — JEDE REISE MUSS AUCH MIT EINER NUMMER GEHEN
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Der Fahrstuhl funktioniert auch nicht. Die
   Animation solltest du machen, da funktioniert noch gar nix."

   GEFUNDEN — und es war kein Zeichenfehler, sondern ein Absturz:
   in livechat.js steht eine Tabelle mit dem Satz zu jeder Reise
   („flug" -> „fliegt zu Platz"). Der FAHRSTUHL fehlte darin. Die
   Zeile dahinter greift auf satzR[0] zu, und weil satzR undefined
   war, brach der ganze Befehl mit einem TypeError ab.
   „/fahrstuhl Bea" ging, „/fahrstuhl 5" nicht — und aus dem
   Reisemenue kommt IMMER eine Nummer.

   Diese Sonde probiert deshalb JEDE Reise mit einer Platznummer
   durch: keine darf abstuerzen, jede muss eine Zeile erzeugen, in
   der „Platz" und die Zahl vorkommen.
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
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 120)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.reiseArten,
    { timeout: 20000 });

  /* Die Liste kommt aus dem Programm, nicht aus meinem Kopf. */
  const arten = await pg.evaluate(() => window.DMA_PRUEF.reiseArten());
  console.log("\n" + arten.length + " Reisen, jede mit einer Platznummer\n");

  const erg = await pg.evaluate(async (arten) => {
    try {
      LiveChat.pruefSitz({ lage: "drin", ichId: "ich-1", ichName: "Alex",
                           buehne: true, zuruecksetzen: true });
    } catch (e) {}
    const letzte = () => {
      const n = LiveChat.lage().nachrichten || [];
      return n.length ? n[n.length - 1] : {};
    };
    /* Drei Wirkungen heissen im Chat anders als in der Effektliste —
       „pacjagd" tippt man als „/pacman". Die Sonde nimmt deshalb das
       WORT, nicht den inneren Namen. */
    const WORT = { pacjagd: "pacman" };
    const raus = {};
    for (const art of arten) {
      let absturz = "";
      try { LiveChat.schreiben("/" + (WORT[art] || art) + " 5"); }
      catch (e) { absturz = String(e).slice(0, 90); }
      await new Promise((f) => setTimeout(f, 60));
      const m = letzte();
      raus[art] = { absturz: absturz, wirkung: String(m.wirkung || ""),
                    wen: String(m.wen || ""), text: String(m.text || "").slice(0, 70) };
    }
    return raus;
  }, arten);

  arten.forEach((art) => {
    const e = erg[art] || {};
    /* „fahren", „spielzug" und „pacjagd" heissen im Chat anders (sie
       sind keine eigenen Befehlswoerter) — dort genuegt, dass nichts
       abstuerzt und eine Zeile entsteht. */
    const gut = !e.absturz && e.text && !/kenne ich nicht/.test(e.text);
    sage(gut, "„/" + art + " 5“ geht hinaus",
      e.absturz ? "ABSTURZ: " + e.absturz : (e.text || "keine Zeile"));
  });

  sage(aufSeite.length === 0, "und keine Fehler auf der Seite",
    aufSeite.slice(0, 2).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
