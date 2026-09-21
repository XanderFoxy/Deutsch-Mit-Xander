#!/usr/bin/env node
/* =========================================================
   RUNDE 60 — DAS KATAPULT IST EIN ONAGER GEWORDEN
   ---------------------------------------------------------
   GEMELDET: „Der Katapult sieht auch nicht schoen animiert
   aus." Vorher war es ein Trapez, zwei Kreise und ein gerader
   Balken — daran erkennt niemand ein Katapult.

   Nachgebaut ist ein Onager, und zwar an den Teilen, die ihn
   ausmachen. Genau die werden hier gezaehlt und gemessen:
     · zwei Speichenraeder unter einer Grundschwelle,
     · ein A-Bock aus zwei Streben,
     · das Torsionsbuendel AN der Achse (der Antrieb eines
       Onagers — kein Gegengewicht),
     · der Prellbalken mit Polster, an dem der Arm anschlaegt,
     · und der Wurfarm mit Schale.

   DIE WICHTIGSTE MESSUNG steht ganz unten: der Arm dreht um
   „transform-origin: 50% 100%" seines EIGENEN Kastens. Liegt
   in der Gruppe irgendwann etwas unterhalb der Achse, wandert
   der Drehpunkt mit — und der Arm eiert, statt zu schnellen.
   Deshalb wird nachgerechnet, ob die untere Mitte der Gruppe
   wirklich auf der Achse liegt.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
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
  const pg = await br.newPage({ viewport: { width: 900, height: 760 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  const k = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-katapult").forEach((x) => x.remove());
    const n = (document.querySelector(".lc-platz .lc-platz-name") || {}).textContent || "";
    window.DMA_PRUEFUNG.wirkung("katapult", String(n).trim(), String(n).trim());
    await new Promise((f) => setTimeout(f, 260));
    const sv = document.querySelector(".lc-katapult-bild");
    if (!sv) return null;
    const arm = sv.querySelector(".lc-katapult-arm");
    const bb = arm && arm.getBBox ? arm.getBBox() : null;
    return {
      /* Gezaehlt wird im SVG-Koordinatensystem, nicht auf dem Schirm —
         das ist unabhaengig davon, wie gross der Platz gerade ist. */
      raeder: sv.querySelectorAll("circle[r='6']").length,
      speichen: sv.querySelectorAll("g path[stroke='#40280f']").length,
      streben: [...sv.querySelectorAll("path")].filter((p) =>
        p.getAttribute("fill") === "#8a5a28").length,
      buendel: Boolean(sv.querySelector("circle[fill='#c9a86a']")),
      polster: Boolean(sv.querySelector("rect[fill='#9a6a3a']")),
      schale: [...sv.querySelectorAll(".lc-katapult-arm path")].length,
      arm: Boolean(arm),
      armLaeuft: arm ? getComputedStyle(arm).animationName : "-",
      /* Der Kasten der Armgruppe — daraus errechnet der Browser den
         Drehpunkt. */
      kasten: bb ? { x: bb.x, y: bb.y, w: bb.width, h: bb.height,
                     mitteX: bb.x + bb.width / 2, unten: bb.y + bb.height } : null,
      dreh: arm ? getComputedStyle(arm).transformOrigin : "-",
      box: arm ? getComputedStyle(arm).transformBox : "-"
    };
  });

  console.log("\nDIE TEILE, DIE EIN ONAGER HAT\n");
  pruefe("das Katapult steht da", Boolean(k));
  if (k) {
    pruefe("zwei Speichenraeder", k.raeder === 2, k.raeder + " Stueck");
    pruefe("und die Speichen sind wirklich gezeichnet", k.speichen >= 2,
      k.speichen + " Speichenkreuz(e)");
    pruefe("ein A-Bock aus zwei Streben", k.streben === 2, k.streben + " Streben");
    pruefe("das Torsionsbuendel an der Achse", k.buendel);
    pruefe("der Prellbalken hat ein Polster", k.polster);
    pruefe("der Wurfarm ist da", k.arm);
    pruefe("mit Balken, Bindung und Schale", k.schale >= 4, k.schale + " Teile");
    pruefe("und er schnellt auch", k.armLaeuft !== "none" && k.armLaeuft !== "-",
      k.armLaeuft);

    console.log("\nUND ER DREHT UM DIE ACHSE, NICHT UM SICH SELBST\n");
    /* ACHTUNG, FALLE: getComputedStyle gibt transform-origin in PIXELN
       zurueck, nicht als „50% 100%". Gegen den Text zu pruefen faellt
       immer durch. Also wird nachgerechnet: die halbe Kastenbreite und
       die volle Kastenhoehe. */
    const tp = String(k.dreh).match(/([\d.]+)px\s+([\d.]+)px/);
    pruefe("der Drehpunkt ist die untere Mitte seines Kastens",
      k.box === "fill-box" && Boolean(tp) && k.kasten
      && Math.abs(Number(tp[1]) - k.kasten.w / 2) < 0.6
      && Math.abs(Number(tp[2]) - k.kasten.h) < 0.6,
      k.box + " / " + k.dreh
      + (k.kasten ? "  (erwartet " + (k.kasten.w / 2).toFixed(2) + "px "
          + k.kasten.h.toFixed(2) + "px)" : ""));
    if (k.kasten) {
      /* Die Achse liegt im Bild bei (34|38). Genau dort muss die
         untere Mitte der Armgruppe liegen. */
      pruefe("und dieser Punkt liegt auf der Achse (34|38)",
        Math.abs(k.kasten.mitteX - 34) < 0.6 && Math.abs(k.kasten.unten - 38) < 0.6,
        "(" + k.kasten.mitteX.toFixed(1) + "|" + k.kasten.unten.toFixed(1) + ")");
      pruefe("der Arm ist lang genug, um zu schleudern",
        k.kasten.h >= 28, k.kasten.h.toFixed(1) + " von 60 Einheiten");
    }
  }

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nDas Katapult sitzt.\n");
  process.exit(fehler ? 1 : 0);
})();
