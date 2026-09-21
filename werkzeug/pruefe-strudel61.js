#!/usr/bin/env node
/* =========================================================
   RUNDE 61 — DER STRUDEL IST EIN WIRBEL, KEINE ZIELSCHEIBE
   ---------------------------------------------------------
   GEMELDET: „der Strudel-Animationseffekt sieht immer noch
   nicht gut aus."

   Der Grund war nicht Geschmack, sondern Geometrie: dort lagen
   fuenf RINGE, die sich drehten. Ein Ring ist
   rotationssymmetrisch — ein Kreis, der sich dreht, sieht aus
   wie ein Kreis, der steht. Man sah nur den hellen Punkt am
   border-top im Kreis herumlaufen.

   Deshalb misst diese Sonde nicht „dreht sich etwas", sondern
   ob die Form ueberhaupt eine Drehung ZEIGEN kann:
     · Es gibt keine Ringe mehr.
     · Die Arme sind Spiralen — gemessen am Abstand zur Mitte
       am Anfang und am Ende des Weges. Bei einem Kreis waere
       er gleich; bei einer logarithmischen Spirale um ein
       Vielfaches groesser.
     · Zwei Lagen, damit Tiefe entsteht.
     · Der Trichter ist gekippt (flach waere eine Zielscheibe).
     · Es gibt einen Schlund und Schaum, der nach innen laeuft.
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
  const pg = await br.newPage({ viewport: { width: 760, height: 700 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  const st = await pg.evaluate(async () => {
    document.getElementById("lcStrudel")?.remove();
    window.DMA_PRUEFUNG.wirkung("strudel", "", "");
    await new Promise((f) => setTimeout(f, 300));
    const s = document.getElementById("lcStrudel");
    if (!s) return null;
    const arme = [...s.querySelectorAll(".lc-strudel-arm")];
    /* Fuer jeden Arm: wie weit liegt sein ANFANG von der Mitte, und
       wie weit sein Ende des Hinweges? Bei einem Kreis waere beides
       gleich. */
    const spiralig = arme.map((p) => {
      const d = p.getAttribute("d") || "";
      const zahlen = d.match(/-?\d+(?:\.\d+)?/g);
      if (!zahlen || zahlen.length < 8) return 0;
      const x0 = Number(zahlen[0]), y0 = Number(zahlen[1]);
      /* Die Haelfte der Punkte ist der Hinweg; sein letzter Punkt
         liegt ungefaehr in der Mitte der Zahlenliste. */
      const m = Math.floor(zahlen.length / 4) * 2;
      const x1 = Number(zahlen[m]), y1 = Number(zahlen[m + 1]);
      const r0 = Math.hypot(x0 - 50, y0 - 50);
      const r1 = Math.hypot(x1 - 50, y1 - 50);
      return Math.max(r0, r1) / Math.max(0.01, Math.min(r0, r1));
    });
    const lagen = [...s.querySelectorAll(".lc-strudel-arme")];
    const tr = s.querySelector(".lc-strudel-trichter");
    const schlund = s.querySelector(".lc-strudel-schlund");
    const schaum = [...s.querySelectorAll(".lc-strudel-schaum")];
    return {
      ringe: s.querySelectorAll("u").length,
      arme: arme.length,
      spiralMin: spiralig.length ? Math.min.apply(null, spiralig) : 0,
      lagen: lagen.length,
      drehen: lagen.map((g) => getComputedStyle(g).animationName),
      tempo: lagen.map((g) => getComputedStyle(g).animationDuration),
      kippung: tr ? getComputedStyle(tr).transform : "-",
      schlund: Boolean(schlund),
      schlundLaeuft: schlund ? getComputedStyle(schlund).animationName : "-",
      schaum: schaum.length,
      schaumLaeuft: schaum.length ? getComputedStyle(schaum[0]).animationName : "-"
    };
  });

  console.log("\nKEINE RINGE MEHR — SPIRALEN\n");
  pruefe("der Strudel steht da", Boolean(st));
  if (st) {
    pruefe("es gibt keine Ringe mehr", st.ringe === 0, st.ringe + " Ringe");
    pruefe("dafuer vierzehn Spiralarme (zwei Lagen zu sieben)",
      st.arme === 14, st.arme + " Arme");
    /* Bei einem Kreis waere das Verhaeltnis 1. Gerechnet ist die
       Spirale auf r0 = 3,4 bis r = 46, also rund das Dreizehnfache;
       gemessen wird nur, dass es DEUTLICH mehr als 1 ist. */
    pruefe("und sie sind wirklich Spiralen, keine Kreise",
      st.spiralMin >= 3, "schwaechster Arm: Faktor " + st.spiralMin.toFixed(1));
    pruefe("zwei Lagen fuer die Tiefe", st.lagen === 2, st.lagen + " Lagen");
    pruefe("beide drehen sich", st.drehen.every((n) => n && n !== "none"),
      st.drehen.join(" / "));
    pruefe("und zwar verschieden schnell", st.tempo[0] !== st.tempo[1],
      st.tempo.join(" / "));

    console.log("\nTRICHTER, SCHLUND UND SCHAUM\n");
    pruefe("der Trichter ist gekippt, nicht flach",
      /matrix3d|rotateX/.test(st.kippung), String(st.kippung).slice(0, 44));
    pruefe("in der Mitte ist ein Schlund", st.schlund);
    pruefe("und er atmet", st.schlundLaeuft !== "none" && st.schlundLaeuft !== "-",
      st.schlundLaeuft);
    pruefe("sechzehn Schaumflocken", st.schaum === 16, st.schaum + " Stueck");
    pruefe("die nach innen laufen", st.schaumLaeuft !== "none" && st.schaumLaeuft !== "-",
      st.schaumLaeuft);
  }

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nDer Strudel zieht.\n");
  process.exit(fehler ? 1 : 0);
})();
