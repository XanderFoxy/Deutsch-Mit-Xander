#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 90 — „FLUGZEUG" IST DAS WORT, DAS ER BENUTZT
   ---------------------------------------------------------------------
   XANDER (22.09.2026): „der soll uns transportieren … Alternativ
   koennte ich mir in der Zukunft noch im Flugzeug vorstellen."

   NACHGESEHEN, und das ist der ganze Punkt: die Reise GIBT es seit
   langem — sie heisst „/flug", und das Flugzeug darin ist in Runde 73
   und 80 nach seinen Angaben nachgezeichnet worden (beide Tragflaechen
   sichtbar, Hoehenleitwerk, Triebwerk, spitze Nase). Was fehlte, war
   nur das WORT: wer „/flugzeug" tippt, bekam „Diesen Befehl gibt es
   nicht". Genau das ist der Unterschied zwischen „nicht gebaut" und
   „nicht gefunden" — und beides fuehlt sich gleich an.

   Gemessen wird deshalb an der laufenden Seite: dieselbe Reise unter
   allen vier Woertern.
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
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\nDIESELBE REISE UNTER VIER WOERTERN\n");
  const erg = await pg.evaluate(async () => {
    try {
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich-1", ichName: "Alex",
                                  buehne: true, zuruecksetzen: true });
    } catch (e) {}
    const letzte = () => {
      const n = window.LiveChat.lage().nachrichten || [];
      return n.length ? n[n.length - 1] : {};
    };
    const eins = async (zeile) => {
      try { window.LiveChat.schreiben(zeile); } catch (e) {}
      await new Promise((f) => setTimeout(f, 60));
      const z = letzte();
      return { zeile: zeile, wirkung: String(z.wirkung || ""),
               wen: String(z.wen || ""), text: String(z.text || "") };
    };
    return { flug: await eins("/flug 5"), flugzeug: await eins("/flugzeug 5"),
             flieger: await eins("/flieger 5"), jet: await eins("/jet 5") };
  });

  const wie = erg.flug;
  sage(wie.wirkung === "flug" && wie.wen === "5",
    "„/flug 5“ ist die Reise — so war es immer",
    wie.text.trim());
  ["flugzeug", "flieger", "jet"].forEach((w) => {
    const z = erg[w];
    sage(z.wirkung === "flug" && z.wen === "5" && z.text === wie.text,
      "„/" + w + " 5“ macht genau dasselbe",
      z.wirkung ? z.text.trim() : "nichts passiert");
  });

  console.log("\nUND DAS FLUGZEUG IST WIRKLICH EINS\n");
  const bild = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    /* Bei einer Reise ist der ZWEITE Wert das ZIEL und der dritte
       der Reisende: „Alex fliegt zu Bea". Mit einer Platznummer
       statt eines Namens findet lcReise niemanden — genau daran ist
       diese Sonde beim ersten Lauf gescheitert. */
    window.DMA_PRUEFUNG.wirkung("flug", "Bea", "Alex", {});
    await new Promise((f) => setTimeout(f, 800));
    const f = document.querySelector(".lc-flieger");
    if (!f) return null;
    const svg = f.querySelector(".lc-flieger-form");
    return { fluegel: f.querySelectorAll(".lc-flieger-fluegel").length,
             fenster: Boolean(f.querySelector(".lc-flieger-fenster")
                           || f.querySelector(".lc-flieger-kanzel")),
             sicht: svg ? svg.getAttribute("viewBox") : "" };
  });
  sage(Boolean(bild), "das Flugzeug haengt in der Sitzreihe");
  sage(Boolean(bild && bild.fluegel >= 2),
    "es hat beide Tragflaechen und das Leitwerk",
    bild ? bild.fluegel + " Flaechen" : "-");
  sage(Boolean(bild && bild.fenster),
    "und das Profilbild sitzt hinter dem Fenster");

  /* Die Flugzeit haengt an der Strecke (bis zu vier Plaetze), und
     aufgeraeumt wird erst 400 ms nach der Landung. Deshalb wird hier
     bis 6 Sekunden gewartet — die Strichlinien-Sonde misst ohnehin
     jede Reise bis 8 Sekunden. */
  await pg.waitForTimeout(6000);
  const rest = await pg.evaluate(() => document.querySelectorAll(".lc-flieger").length);
  sage(rest === 0, "nach der Landung bleibt nichts stehen", rest + " Reste");

  sage(aufSeite.length === 0, "keine Fehler auf der Seite",
    aufSeite.slice(0, 3).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
