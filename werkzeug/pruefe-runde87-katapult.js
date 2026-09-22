/* =====================================================================
   SONDE RUNDE 87 — DAS KATAPULT
   ---------------------------------------------------------------------
   XANDER: „Der Katapult schießt nach links. Er soll aber nach rechts
   schießen." Und, mehrfach: „Er sollte realistisch die Ladung erst mal
   aufnehmen und dann wegschmeißen, das kann auch ein bisschen länger
   sein", „der Katapult nimmt das Profilbild immer noch nicht als Ladung
   auf".

   Gemessen wird in Bildbreiten, vom Mittelpunkt des Profilbildes aus:
     1. Steht das Geraet auf der Seite dessen, der wirft?
     2. Schaut es von sich WEG — also wirft es ueber die Bildmitte
        hinweg und nicht ueber den eigenen Ruecken?
     3. Liegt die Ladung zwischendurch WIRKLICH in der Schale?
     4. Wie lange dauert das Aufnehmen?
     5. Fliegt sie danach von der Maschine weg?
     6. Und gilt das fuer beide Seiten?
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
  console.log("RUNDE 87 — das Katapult");
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
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });

  /* Alles in Bildbreiten, vom Mittelpunkt des Profilbildes aus. Negativ
     heisst links davon. */
  const lauf = async (ziel, zielNr, von) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate(([z, v]) => window.DMA_PRUEFUNG.wirkung("katapult", z, v, {}), [ziel, von]);
    const reihe = [];
    let vorher = 0;
    for (const t of [300, 700, 900, 1000, 1100, 1250, 1500, 2000, 3400]) {
      await pg.waitForTimeout(t - vorher); vorher = t;
      reihe.push(await pg.evaluate(([t, nr]) => {
        const pl = document.querySelectorAll(".lc-platz")[nr];
        const kr = pl.querySelector(".lc-kreis");
        const k = kr.getBoundingClientRect();
        const mitte = { x: k.left + k.width / 2, y: k.top + k.height / 2, b: k.width };
        const rel = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: +(((r.left + r.width / 2) - mitte.x) / mitte.b).toFixed(3),
                   y: +(((r.top + r.height / 2) - mitte.y) / mitte.b).toFixed(3),
                   gr: +(r.width / mitte.b).toFixed(2) };
        };
        const arm = pl.querySelector(".lc-katapult-arm");
        const pfade = arm ? [...arm.querySelectorAll("path")] : [];
        const last = pl.querySelector(".lc-kata-last");
        return { t,
          geraet: rel(pl.querySelector(".lc-katapult-bild")),
          schale: pfade.length ? rel(pfade[pfade.length - 1]) : null,
          ladung: rel(last),
          sichtbar: last ? +getComputedStyle(last).opacity : 0,
          platzLeer: kr.classList.contains("lc-kata-leer") };
      }, [t, zielNr]));
    }
    return reihe;
  };

  /* --- Werfender sitzt LINKS (Alex, Platz 1) -------------------------- */
  console.log("\n  Der Werfende sitzt links");
  const links = await lauf("Bea", 1, "Alex");
  const gL = links[1].geraet;
  sage(gL && gL.x < -0.1, "Das Geraet steht auf der Seite des Werfenden (links)",
    "x = " + (gL && gL.x));
  /* Die Schale ist das hintere Ende: steht das Geraet links und schaut
     nach rechts, liegt sie GANZ links. */
  sage(links[2].schale && links[2].schale.x < -0.5,
    "Die Schale (das hintere Ende) liegt aussen — das Geraet schaut zur Bildmitte",
    "Schale x = " + (links[2].schale && links[2].schale.x));
  /* Die Ladung liegt in der Schale. */
  const inSchale = links.filter((m) => m.schale && m.ladung && m.sichtbar > 0.9
    && Math.hypot(m.ladung.x - m.schale.x, m.ladung.y - m.schale.y) < 0.12);
  sage(inSchale.length >= 2, "Die Ladung liegt wirklich in der Schale",
    inSchale.map((m) => m.t + "ms (" + Math.hypot(m.ladung.x - m.schale.x,
      m.ladung.y - m.schale.y).toFixed(3) + ")").join(", ") || "nie");
  const aufnahmeVon = links.find((m) => m.sichtbar > 0.9);
  const abwurf = links.find((m) => m.ladung && m.ladung.x > 0);
  sage(aufnahmeVon && abwurf && (abwurf.t - aufnahmeVon.t) >= 400,
    "Das Aufnehmen dauert sichtbar lange",
    aufnahmeVon && abwurf ? (abwurf.t - aufnahmeVon.t) + " ms (frueher rund 130 ms)" : "?");
  /* Und der Flug: die Ladung muss NACH RECHTS, also von der Maschine weg. */
  const weitL = links[links.length - 3];
  sage(weitL.ladung && weitL.ladung.x > 0.4,
    "Sie fliegt nach RECHTS — von der Maschine weg, nicht ueber ihren Ruecken",
    "x = " + (weitL.ladung && weitL.ladung.x) + " bei " + weitL.t + " ms");
  sage(links.some((m) => m.platzLeer), "Der Platz ist leer, solange die Kopie unterwegs ist");
  const endeL = links[links.length - 1];
  sage(!endeL.platzLeer, "Am Ende sitzt das Bild wieder auf seinem Platz");
  sage(endeL.ladung === null || Math.abs(endeL.ladung.x) < 0.08,
    "Und die Kopie liegt genau darauf, nicht daneben",
    endeL.ladung ? "x = " + endeL.ladung.x : "schon weggeraeumt");

  /* --- Werfender sitzt RECHTS (Cem, Platz 3, wirft auf Bea, Platz 2) -- */
  console.log("\n  Der Werfende sitzt rechts");
  const rechts = await lauf("Bea", 1, "Cem");
  const gR = rechts[1].geraet;
  sage(gR && gR.x > 0.1, "Das Geraet steht rechts", "x = " + (gR && gR.x));
  sage(rechts[2].schale && rechts[2].schale.x > 0.5,
    "Die Schale liegt aussen rechts — es schaut wieder zur Bildmitte",
    "Schale x = " + (rechts[2].schale && rechts[2].schale.x));
  const inSchaleR = rechts.filter((m) => m.schale && m.ladung && m.sichtbar > 0.9
    && Math.hypot(m.ladung.x - m.schale.x, m.ladung.y - m.schale.y) < 0.12);
  sage(inSchaleR.length >= 2, "Auch hier liegt die Ladung in der Schale",
    inSchaleR.map((m) => m.t + "ms").join(", ") || "nie");
  const weitR = rechts[rechts.length - 3];
  sage(weitR.ladung && weitR.ladung.x < -0.4,
    "Sie fliegt nach LINKS — wieder von der Maschine weg",
    "x = " + (weitR.ladung && weitR.ladung.x) + " bei " + weitR.t + " ms");

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
