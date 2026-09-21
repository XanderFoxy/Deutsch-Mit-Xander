#!/usr/bin/env node
/* =========================================================
   RUNDE 53 — DIE MÜNZE UND DAS WHITEBOARD
   ---------------------------------------------------------
   GEMELDET:
   · die Muenze soll auf dem NAMEN landen, nicht im Bild.
   · „bei dem Whiteboard moechte ich die Werkzeuge ausblenden
      koennen und vielleicht eine Rueckschritt- und
      Fortschritt-Funktion ... Bilder sichern."

   Bei der Muenze wird die STELLE gemessen, an der sie liegen
   bleibt — vorher hoerte sie bei 27 % der Bildhoehe auf, und
   das ist noch mitten im Bild.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

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
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEF, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  console.log("\nDIE MÜNZE LANDET AUF DEM NAMEN\n");
  const muenze = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-muenze").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("muenze", "3", "Alex");
    /* Erst ganz am Ende nachsehen — vorher trudelt sie noch.
       RUNDE 72 NACHGEFUEHRT: die Muenze laeuft jetzt 5,4 s statt 4,2 s,
       weil ihr Aufschlag im Ton gemessen bei 4,59 s liegt und das
       Ausscheppern bis 5,3 s geht (siehe lcMuenzeR72). Bei 4100 ms
       war sie noch in der Luft — gemessen 39 px neben der
       Namensmitte. Das war die Sonde, nicht die Animation.
       5600 ms waeren allerdings schon ZU spaet: bei 5400 ms nimmt
       lcMuenze die Klasse wieder ab, und dann steht das Bild wieder
       aufrecht an seinem Platz (gemessen 103 x 103 px). Deshalb
       5300 ms — das letzte Bild, in dem sie noch liegt. */
    await new Promise((f) => setTimeout(f, 5300));
    const pl = document.querySelectorAll(".lc-platz")[2];
    const k = pl.querySelector(".lc-kreis");
    const n = pl.querySelector(".lc-platz-name");
    const kb = k.getBoundingClientRect(), nb = n.getBoundingClientRect();
    return { muenzeMitteY: kb.top + kb.height / 2,
             nameMitteY: nb.top + nb.height / 2,
             hoch: kb.height,
             /* Flach liegend: die Muenze ist viel breiter als hoch. */
             breit: kb.width };
  });
  const weg = Math.abs(muenze.muenzeMitteY - muenze.nameMitteY);
  pruefe("sie liegt auf der Namenszeile",
    weg < 12, Math.round(weg) + " px neben der Namensmitte");
  /* Eine liegende Muenze ist eine duenne Ellipse, kein Kreis. */
  pruefe("und sie liegt flach, sie steht nicht",
    muenze.hoch < muenze.breit * 0.4,
    Math.round(muenze.breit) + " × " + Math.round(muenze.hoch) + " px");

  console.log("\nDAS WHITEBOARD: AUSBLENDEN, ZURÜCK, VOR, SICHERN\n");
  const tafel = await pg.evaluate(async () => {
    /* Die Tafel geht auf, sobald ein Stand hereinkommt. */
    window.DMA_TAFEL({ t: "stand", q: "", zuege: [], blick: { z: 1, x: .5, y: .5 } });
    await new Promise((f) => setTimeout(f, 220));
    const t = document.getElementById("lcTafel");
    if (!t) return { da: false };
    const knopf = (w) => t.querySelector('[data-tafel="' + w + '"]');
    const raus = { da: true,
      zurueck: Boolean(knopf("zurueck")), vor: Boolean(knopf("vor")),
      sichern: Boolean(knopf("sichern")), griff: Boolean(t.querySelector("#lcTafelGriff")) };
    /* Ohne Striche darf nichts zu holen sein. */
    raus.leerAus = knopf("zurueck") ? knopf("zurueck").disabled : null;
    /* Drei Striche hereinreichen, so wie sie von aussen kaemen. */
    for (let i = 0; i < 3; i++) {
      window.DMA_TAFEL({ t: "strich", zug: { f: "#e03e3e", d: .005,
        p: [[.2 + i * .1, .3], [.4 + i * .1, .6]] } });
    }
    await new Promise((f) => setTimeout(f, 60));
    raus.nachDrei = knopf("zurueck").disabled;
    raus.vorNochAus = knopf("vor").disabled;
    /* Einen zurueck. */
    knopf("zurueck").click();
    await new Promise((f) => setTimeout(f, 60));
    raus.vorJetztAn = !knopf("vor").disabled;
    /* Und wieder vor. */
    knopf("vor").click();
    await new Promise((f) => setTimeout(f, 60));
    raus.vorWiederAus = knopf("vor").disabled;
    /* Werkzeuge ausblenden. */
    const leiste = t.querySelector(".lc-tafel-leiste");
    const vorher = leiste.getBoundingClientRect().top;
    t.querySelector("#lcTafelGriff").click();
    await new Promise((f) => setTimeout(f, 380));
    raus.leisteWeg = t.classList.contains("lc-tafel-ohne-werkzeug")
      && leiste.getBoundingClientRect().top > vorher + 4;
    raus.blattOhneRand =
      parseFloat(getComputedStyle(t.querySelector(".lc-tafel-blatt")).paddingBottom) < 1;
    /* Und wieder her. */
    t.querySelector("#lcTafelGriff").click();
    await new Promise((f) => setTimeout(f, 380));
    raus.leisteZurueck = !t.classList.contains("lc-tafel-ohne-werkzeug");
    return raus;
  });
  pruefe("die Tafel steht", tafel.da);
  pruefe("es gibt einen Zurück-Knopf", Boolean(tafel.zurueck));
  pruefe("einen Vor-Knopf", Boolean(tafel.vor));
  pruefe("einen Sichern-Knopf", Boolean(tafel.sichern));
  pruefe("und einen Griff zum Ausblenden", Boolean(tafel.griff));
  pruefe("ohne Striche ist Zurück abgeblendet", tafel.leerAus === true);
  pruefe("mit Strichen nicht mehr", tafel.nachDrei === false);
  pruefe("und Vor ist es noch", tafel.vorNochAus === true);
  pruefe("nach einem Zurück ist Vor bedienbar", tafel.vorJetztAn === true);
  pruefe("nach dem Vor wieder nicht", tafel.vorWiederAus === true);
  pruefe("der Griff blendet die Werkzeuge aus", tafel.leisteWeg === true);
  /* Sonst bliebe ein leerer Streifen stehen, und gewonnen waere nichts. */
  pruefe("und das Blatt nimmt den frei gewordenen Platz", tafel.blattOhneRand === true);
  pruefe("ein zweiter Tipp holt sie zurück", tafel.leisteZurueck === true);

  /* Das Sichern baut eine eigene Leinwand mit Blatt UND Strichen. */
  const bild = await pg.evaluate(() => {
    const c = document.getElementById("lcTafelStift");
    if (!c) return { da: false };
    /* Denselben Weg gehen wie lcTafelSichern, nur ohne Herunterladen. */
    const aus = document.createElement("canvas");
    aus.width = c.width; aus.height = c.height;
    const g = aus.getContext("2d");
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, aus.width, aus.height);
    g.drawImage(c, 0, 0);
    let url = "";
    try { url = aus.toDataURL("image/png"); } catch (e) { return { da: false }; }
    return { da: true, breit: aus.width, hoch: aus.height, laenge: url.length };
  });
  pruefe("die Leinwand laesst sich als Bild ausgeben",
    bild.da && bild.laenge > 500,
    bild.da ? bild.breit + " × " + bild.hoch + " px" : "geht nicht");

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nDie Muenze liegt auf dem Namen, die Tafel kann zurueck.\n");
  process.exit(fehler ? 1 : 0);
})();
