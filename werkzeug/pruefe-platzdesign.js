#!/usr/bin/env node
/* =========================================================
   DAS PLATZDESIGN BLEIBT STEHEN — BEI JEDEM EFFEKT
   ---------------------------------------------------------
   XANDER hat das in einer einzigen Liste rund zwanzigmal
   gemeldet, an zwanzig verschiedenen Effekten:
   · „der Strudel saugt die Platzzahl mit weg und die
      Strichlinie"
   · „das Knüllen knallt den Platz mit weg, also die
      Strichlinie und die Positionsnummer"
   · „beim Tennis ist die Strichlinie und die Platznummer
      komplett weg"
   · „die Sanduhr beeinflusst auch die Strichlinie und die
      Platznummer"
   · „wenn man jemanden auffrisst, dann wird die Strichlinie
      und die Nummer auch aufgefressen"
   · „das Flugzeug hinterlässt eine Inkonsistenz im
      Platznummer-Design"
   und seine Regel dazu: „das Design soll niemals berührt
   sein, wenn ich es nicht ausdrücklich sage."

   ES IST IMMER DERSELBE FEHLER: der Kreis IST das Design des
   Platzes. Schrumpft, dreht oder faehrt ihn eine Animation
   weg, ist der Platz nackt.

   Seit Runde 79 liegt der Platzhalter IMMER darunter (siehe
   korrekturen.css, „DER PLATZ BEHÄLT SEIN DESIGN, IMMER").
   Diese Sonde haelt das fest — und zwar nicht an einer
   einzigen Stelle, sondern fuer eine ganze Reihe Effekte auf
   einmal. Wer kuenftig einen neuen Effekt baut, der den Kreis
   anfasst, faellt hier auf.
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

/* Effekte, die den Kreis anfassen — und wann man am besten
   hinsieht (mitten in der Bewegung, nicht am Anfang). */
const PROBEN = [
  ["sog",        1500], ["knuell",   900], ["sanduhr", 1400],
  ["tennis",     1200], ["aufessen", 1500], ["muenze",  2600],
  ["schneekugel", 1200], ["wischer",  900], ["strohhalm", 1500],
  ["zwille",     1200], ["hammer",   700], ["tritt",   900]
];

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
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEF, { timeout: 20000 });

  console.log("\nDER PLATZHALTER LIEGT IMMER BEREIT\n");
  const bau = await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    const pl = document.querySelectorAll(".lc-platz")[2];
    const sch = pl.querySelector(".lc-schild");
    const nr = pl.querySelector(".lc-nummer");
    if (!sch || !nr) return { fehlt: true };
    const ss = getComputedStyle(sch), vs = getComputedStyle(sch, "::before");
    return { z: ss.zIndex, ring: vs.borderStyle, zahl: getComputedStyle(nr).display,
             kreisHg: getComputedStyle(pl.querySelector(".lc-kreis")).backgroundColor };
  });
  /* Die Pruefbuehne hatte bis Runde 79 gar kein Schild — dann kann
     keine Sonde je finden, was Xander sieht. */
  pruefe("die Pruefbuehne hat ueberhaupt ein Schild mit Nummer", !bau.fehlt);
  pruefe("es liegt HINTER dem Bild, nicht davor", bau.z === "-1", "z-index " + bau.z);
  pruefe("und traegt die gestrichelte Linie", bau.ring === "dashed", bau.ring);
  pruefe("die Zahl ist angelegt", bau.zahl === "grid", bau.zahl);
  /* Nur ein undurchsichtiger Kreis kann den Platzhalter verdecken. */
  pruefe("der besetzte Kreis deckt ihn zu — er ist undurchsichtig",
    /^rgb\(/.test(bau.kreisHg), bau.kreisHg);

  console.log("\nUND ER HAELT BEI JEDEM EFFEKT\n");
  for (const [art, wann] of PROBEN) {
    const m = await pg.evaluate(async ([a, w]) => {
      document.querySelectorAll(".lc-zp, .lc-sprechfeld").forEach((x) => x.remove());
      window.DMA_PRUEF.effektBuehne();
      const pl = document.querySelectorAll(".lc-platz")[2];
      const vorher = pl.querySelector(".lc-schild").getBoundingClientRect();
      window.DMA_PRUEFUNG.wirkung(a, "2", "Alex");
      await new Promise((f) => setTimeout(f, w));
      const sch = pl.querySelector(".lc-schild");
      const b = sch.getBoundingClientRect();
      const nr = pl.querySelector(".lc-nummer");
      const ns = nr ? getComputedStyle(nr) : null;
      return { breit: Math.round(b.width), hoch: Math.round(b.height),
               vorBreit: Math.round(vorher.width),
               obenWeg: Math.round(b.top - vorher.top),
               zahl: ns ? ns.display : "-",
               zahlSicht: ns ? ns.visibility : "-" };
    }, [art, wann]);
    /* Drei Dinge duerfen sich nicht aendern: die Groesse des
       Platzhalters, seine Lage und dass die Zahl angelegt ist. */
    pruefe("/" + art + ": Strichlinie und Zahl bleiben",
      m.breit === m.vorBreit && m.hoch === m.vorBreit
      && Math.abs(m.obenWeg) <= 1 && m.zahl === "grid" && m.zahlSicht === "visible",
      m.breit + "x" + m.hoch + " px, " + m.obenWeg + " px verschoben, Zahl " + m.zahl);
  }

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
                     : "\nDas Platzdesign bleibt stehen.\n");
  process.exit(fehler ? 1 : 0);
})();
