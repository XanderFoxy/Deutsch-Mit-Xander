#!/usr/bin/env node
/* =========================================================
   ZIEHT DER BROWSER DIE SEITE VON SELBST HERAN?
   ---------------------------------------------------------
   GEMELDET: „Man wählt irgendwas an und dann muss man immer
   dieses Pinch machen mit den Fingern, damit man das Bild
   wieder zusammenzieht, weil das plötzlich ein bisschen
   aufgegangen ist."

   Ursache ist kein Fehler im Layout, sondern eine Regel des
   Browsers: ein Eingabefeld mit weniger als 16 px Schrift
   laesst Safari auf dem iPhone die ganze Seite heranzoomen,
   sobald man es antippt — und wieder hinaus zoomt es nicht.
   Chrome auf Android ebenso.

   Diese Sonde tippt nicht, sie misst: jedes Feld, in das man
   schreiben kann, muss auf einem Finger-Geraet mindestens
   16 px Schrift haben. Gemessen wird am fertig gerechneten
   Wert im Browser, nicht an der CSS-Datei — nur der zaehlt.

   Gesucht wird in der ganzen Seite: im Startbild, in allen
   vier Bereichen und im Klassenzimmer.

   Aufruf:  node werkzeug/pruefe-kein-zoom.js
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".mp4": "video/mp4" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

const SAMMELN = () => {
  const raus = [];
  const aus = ["checkbox", "radio", "range", "color", "file", "hidden", "submit", "button", "image", "reset"];
  document.querySelectorAll('input, textarea, select, [contenteditable="true"], [contenteditable=""]').forEach((e) => {
    if (e.tagName === "INPUT" && aus.indexOf((e.type || "").toLowerCase()) >= 0) return;
    const px = parseFloat(getComputedStyle(e).fontSize);
    raus.push({ wo: e.tagName.toLowerCase() + (e.id ? "#" + e.id : "")
                  + (e.className ? "." + String(e.className).trim().split(/\s+/)[0] : ""), px: px });
  });
  return raus;
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
  /* hasTouch + isMobile: nur so gilt im Browser „pointer: coarse", und
     nur dafuer ist die Regel gemacht. Mit der Maus soll sich nichts
     aendern — dort zoomt auch nichts. */
  const pg = await br.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);

  const grob = await pg.evaluate(() => window.matchMedia("(pointer: coarse)").matches);
  pruefe("das Geraet gilt als Finger-Geraet (pointer: coarse)", grob, grob ? "ja" : "nein — die Messung waere wertlos");

  let alle = [];
  const runde = async (name, vorher) => {
    if (vorher) { try { await vorher(); } catch (e) {} await pg.waitForTimeout(900); }
    const f = await pg.evaluate(SAMMELN);
    const klein = f.filter((x) => x.px < 16);
    alle = alle.concat(klein);
    pruefe(name + ": " + f.length + " Felder, keines unter 16 px", klein.length === 0,
      klein.length ? klein.slice(0, 6).map((x) => x.wo + " " + x.px + "px").join(", ") : "kleinstes "
        + (f.length ? Math.min.apply(null, f.map((x) => x.px)) + "px" : "—"));
  };

  console.log("\nJEDES FELD, IN DAS MAN SCHREIBEN KANN\n");
  await runde("Startbild");
  for (const id of ["view-learn", "view-knowledge", "view-profile", "view-about"]) {
    await runde(id, () => pg.evaluate((v) => {
      const k = document.querySelector('.tape-tab[data-target="' + v + '"]');
      if (k) k.click();
    }, id));
  }
  /* Und das Klassenzimmer: es haengt nicht an einem Reiter, sondern
     wird von der Buehne aufgebaut. Dort sitzt das Feld, in das man im
     Chat schreibt — genau das, das am haeufigsten angetippt wird. */
  await runde("Klassenzimmer", () => pg.evaluate(() => {
    if (window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne) window.DMA_PRUEF.effektBuehne();
  }));

  await br.close(); srv.close();
  console.log("\n" + (fehler
    ? fehler + " Abweichung(en) — " + alle.length + " Feld(er) zu klein"
    : "Kein Feld zwingt den Browser zum Hineinzoomen.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
