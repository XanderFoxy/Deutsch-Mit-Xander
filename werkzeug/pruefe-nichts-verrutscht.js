#!/usr/bin/env node
/* =========================================================
   VERSCHIEBT SICH DAS BILD DURCH EINE ANIMATION?
   ---------------------------------------------------------
   GEMELDET: „Achte darauf, dass sich das Bild nicht mehr
   verschiebt durch die Dinos, oder dass sich generell das
   Bild nie wieder verschiebt durch irgendeine Einstellung,
   die man macht."

   Der Grund sass in der Buehne, auf der die Effekte liegen.
   Sie wurde ueber getBoundingClientRect() gesetzt — und das
   liefert den GEMALTEN Kasten, in dem jede laufende Animation
   schon steckt. Waehrend der Dinosaurier stampft, wackelt die
   Karte; also wackelte die Buehne mit, und mit ihr alles
   darauf. Jetzt wird ueber offsetLeft/offsetTop gemessen, und
   die kennen kein transform.

   Die Sonde misst beides gleichzeitig: den gemalten Kasten
   (der WACKELN darf und soll) und den Layout-Kasten (der
   STILL stehen muss). Danach dasselbe fuer die Buehne selbst.

   Aufruf:  node werkzeug/pruefe-nichts-verrutscht.js
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".mp4": "video/mp4" };

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
  const pg = await br.newPage({ viewport: { width: 420, height: 800 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 150)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.kartenKasten, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.waitForTimeout(300);

  console.log("\nOHNE ANIMATION MUESSEN BEIDE MESSUNGEN GLEICH SEIN\n");
  let ruhe = await pg.evaluate(() => window.DMA_PRUEF.kartenKasten());
  const abw = (a, b) => Math.abs(a.left - b.left) + Math.abs(a.top - b.top)
                      + Math.abs(a.width - b.width) + Math.abs(a.height - b.height);
  pruefe("Layout-Kasten und gemalter Kasten stimmen ueberein",
    ruhe && abw(ruhe.layout, ruhe.gemalt) <= 2,
    ruhe ? Math.round(abw(ruhe.layout, ruhe.gemalt)) + " px Unterschied" : "keine Karte");

  console.log("\nWAEHREND DER DINOSAURIER STAMPFT\n");
  const beben = await pg.evaluate(async () => {
    /* Erst etwas AUF die Buehne legen — sie raeumt sich selbst ab,
       sobald nichts mehr darauf liegt, und eine Buehne, die gar nicht
       da ist, kann auch nicht wackeln. Das Konfetti laeuft lange
       genug fuer die Messung. */
    window.DMA_PRUEFUNG.wirkung("konfetti", "");
    /* Eine Animation ruft den Chat an seinen Platz — das ist eine
       echte Fahrt und darf die Karte bewegen. Erst abwarten, bis sie
       steht, sonst misst die Sonde das Scrollen statt das Wackeln. */
    await new Promise((f) => setTimeout(f, 1100));
    document.documentElement.classList.add("lc-dino-beben");
    const layout = [], gemalt = [], buehne = [];
    for (let i = 0; i < 26; i++) {
      await new Promise((f) => requestAnimationFrame(f));
      const k = window.DMA_PRUEF.kartenKasten();
      if (!k) continue;
      layout.push(k.layout.top); gemalt.push(k.gemalt.top);
      const b = document.getElementById("lcEffektBuehne");
      if (b) buehne.push(b.getBoundingClientRect().top);
    }
    document.documentElement.classList.remove("lc-dino-beben");
    const spanne = (a) => a.length ? Math.max.apply(null, a) - Math.min.apply(null, a) : -1;
    return { layout: spanne(layout), gemalt: spanne(gemalt), buehne: spanne(buehne),
             bilder: layout.length };
  });
  /* Nach dem Anfahren liegt die Karte woanders als vorher — das ist
     richtig so. Der Ruhestand wird deshalb neu genommen. */
  ruhe = await pg.evaluate(() => window.DMA_PRUEF.kartenKasten());
  pruefe("die Karte wackelt wirklich (sonst waere die Messung wertlos)",
    beben.gemalt > 0.4, beben.gemalt.toFixed(2) + " px Ausschlag in " + beben.bilder + " Bildern");
  pruefe("der Layout-Kasten steht dabei still",
    beben.layout <= 0.5, beben.layout.toFixed(2) + " px");
  pruefe("und die Buehne mit den Effekten steht still",
    beben.buehne >= 0 && beben.buehne <= 1, beben.buehne.toFixed(2) + " px");

  console.log("\nUND NACH DEM BEBEN LIEGT ALLES WIEDER, WO ES WAR\n");
  await pg.waitForTimeout(400);
  const danach = await pg.evaluate(() => window.DMA_PRUEF.kartenKasten());
  pruefe("die Karte liegt danach an derselben Stelle",
    danach && abw(danach.layout, ruhe.layout) <= 1,
    danach ? Math.round(abw(danach.layout, ruhe.layout)) + " px verschoben" : "-");

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)"
    : "Nichts verrutscht — auch nicht, waehrend es wackelt.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
