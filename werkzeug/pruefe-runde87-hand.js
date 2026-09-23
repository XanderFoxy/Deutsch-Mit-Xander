/* =====================================================================
   SONDE RUNDE 87 — DAS REALISTISCHE GREIFEN
   ---------------------------------------------------------------------
   XANDER: „Hände mit realistischen Zeichnungen für alle Handstellungen,
   ein realistisches Greifen, eine realistische Greifanimation aus einem
   Ursprungszustand in einen Griff in einzelnen Stationen, wie so etwas
   animiert werden muss, dass es wirklich realistisch aussieht."

   Gemessen wird deshalb nicht, ob es „schön" aussieht, sondern ob die
   Hand die Stationen wirklich durchläuft:
     1. Hat jeder Finger drei Glieder mit je einem eigenen Gelenk?
     2. STRECKT sich die Hand vor dem Greifen (Vorformung)? Das ist
        die Station, die man am ehesten vergisst — ohne sie wirkt
        jeder Griff hölzern.
     3. BEUGEN sich danach alle drei Gelenke, und zwar das
        Mittelgelenk am stärksten (so ist eine Hand gebaut)?
     4. Läuft das Schliessen als WELLE vom kleinen Finger zum
        Zeigefinger?
     5. Stellt sich der Daumen gegenüber?
     6. Und öffnet sich alles beim Loslassen wieder?
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
  console.log("RUNDE 87 — das Greifen in Stationen");
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
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("gotteshand", "Bea", "Alex", {}));

  /* Aus der Matrix eines Elements den Drehwinkel und die Streckung in
     y holen. getComputedStyle gibt eine matrix(a,b,c,d,e,f); der
     Winkel steckt in atan2(b,a), die y-Streckung in der Laenge der
     zweiten Spalte. */
  const messen = () => pg.evaluate(() => {
    const zahl = (el) => {
      const m = getComputedStyle(el).transform;
      if (!m || m === "none") return { winkel: 0, sy: 1 };
      const z = m.match(/matrix\(([^)]+)\)/);
      if (!z) return { winkel: 0, sy: 1 };
      const [a, b, c, d] = z[1].split(",").map(Number);
      return { winkel: Math.round(Math.atan2(b, a) * 180 / Math.PI * 10) / 10,
               sy: Math.round(Math.hypot(c, d) * 1000) / 1000 };
    };
    const vorn = document.querySelector(".lc-riesenhand-vorn");
    const hinten = document.querySelector(".lc-riesenhand:not(.lc-riesenhand-vorn)");
    if (!vorn) return null;
    /* RUNDE 99 NACHGEZOGEN: die Hand wird seit dieser Runde ZWEIMAL
       gezeichnet — einmal als dunkle Silhouette darunter, einmal
       gefuellt darueber (damit kein Umriss mehr mitten in der Hand
       liegt). Jedes Gelenk gibt es deshalb doppelt, und ein blosses
       Zaehlen faende acht Finger statt vier. Gemessen wird der
       FUELLDURCHGANG — das ist das, was man sieht; die Silhouette
       darunter macht dieselbe Bewegung (das prueft
       werkzeug/pruefe-runde99-haende.js eigens nach). */
    const fuell = vorn.querySelector(".lc-rh-fuell") || vorn;
    const hol = (kl) => [...fuell.querySelectorAll("." + kl)]
      .sort((a, b) => Number(a.dataset.rf) - Number(b.dataset.rf))
      .map((el) => Object.assign({ rf: Number(el.dataset.rf) }, zahl(el)));
    const bild = document.querySelector(".lc-riesenhand-last");
    const bb = bild ? bild.getBoundingClientRect() : null;
    const spitzen = [...fuell.querySelectorAll(".lc-rf-dip")].map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
    });
    return {
      mcp: hol("lc-rf-mcp"), pip: hol("lc-rf-pip"), dip: hol("lc-rf-dip"),
      daumenCmc: hinten && hinten.querySelector(".lc-rh-fuell .lc-rd-cmc")
        ? zahl(hinten.querySelector(".lc-rh-fuell .lc-rd-cmc")) : null,
      daumenMcp: hinten && hinten.querySelector(".lc-rh-fuell .lc-rd-mcp")
        ? zahl(hinten.querySelector(".lc-rh-fuell .lc-rd-mcp")) : null,
      naegel: fuell.querySelectorAll(".lc-rhand-nagel").length
              + (hinten ? hinten.querySelectorAll(".lc-rh-fuell .lc-rhand-nagel").length : 0),
      bild: bb ? { x: Math.round(bb.left + bb.width / 2), y: Math.round(bb.top + bb.height / 2),
                   b: Math.round(bb.width) } : null,
      spitzen: spitzen
    };
  });

  /* Statt an geratenen Zeitpunkten zu messen, wird die GANZE Kurve
     abgetastet — alle 120 ms, bis die Hand wieder weg ist. Danach
     wird an der Kurve geprueft. Das ist der einzige ehrliche Weg:
     feste Zeitpunkte gehen schief, sobald sich die Dauer aendert. */
  const kurve = [];
  const los = Date.now();
  for (let i = 0; i < 60; i++) {
    const m = await messen();
    if (!m) break;
    kurve.push(Object.assign({ t: Date.now() - los }, m));
    await pg.waitForTimeout(120);
  }
  const mittel = (a) => a.reduce((s, x) => s + x.sy, 0) / a.length;
  const winkelMittel = (a) => a.reduce((s, x) => s + x.winkel, 0) / a.length;

  /* --- 1. Der Bau ---------------------------------------------------- */
  const bau = kurve[0];
  console.log("\n  Der Bau der Hand   (" + kurve.length + " Messpunkte ueber "
    + (kurve.length ? kurve[kurve.length - 1].t : 0) + " ms)");
  sage(bau && bau.mcp.length === 4, "Vier Finger mit Grundgelenk",
    bau ? bau.mcp.length + "" : "keine Hand");
  sage(bau && bau.pip.length === 4, "… jeder mit Mittelgelenk");
  sage(bau && bau.dip.length === 4, "… und mit Endgelenk");
  sage(bau && bau.daumenCmc && bau.daumenMcp, "Der Daumen hat zwei Gelenke");
  sage(bau && bau.naegel === 5, "Fünf Nägel — vier Finger und der Daumen",
    bau ? bau.naegel + "" : "-");

  /* Die drei Punkte der Kurve, um die es geht. */
  /* Der Kraftschluss ist der ERSTE Punkt, an dem der Griff seinen
     tiefsten Wert erreicht — nicht der letzte. Waehrend des Tragens
     gibt der Griff um ein Hundertstel nach und zieht wieder an
     („Nachgeben"), und ein Vergleich auf das absolute Minimum landet
     sonst am Ende des Tragens statt an seinem Anfang. */
  const tiefsten = Math.min.apply(null, kurve.map((k) => mittel(k.pip)));
  let iZu = 0;
  for (let i = 0; i < kurve.length; i++) {
    if (mittel(kurve[i].pip) <= tiefsten + 0.015) { iZu = i; break; }
  }
  let iOffen = 0;
  for (let i = 0; i < iZu; i++) if (mittel(kurve[i].pip) >= mittel(kurve[iOffen].pip)) iOffen = i;
  let iAuf = -1;
  for (let i = iZu + 1; i < kurve.length; i++) if (mittel(kurve[i].pip) > 0.9) { iAuf = i; break; }

  /* --- 2. Die Vorformung --------------------------------------------- */
  console.log("\n  Station „Öffnen\" (die Vorformung) bei " + kurve[iOffen].t + " ms");
  sage(winkelMittel(kurve[iOffen].mcp) < winkelMittel(kurve[0].mcp) - 2,
    "Die Grundgelenke strecken sich WEITER als in der Ruhe",
    "Ruhe " + winkelMittel(kurve[0].mcp).toFixed(1) + "°, offen "
    + winkelMittel(kurve[iOffen].mcp).toFixed(1) + "°");
  sage(mittel(kurve[iOffen].mcp) > 0.995 && mittel(kurve[iOffen].pip) > 0.995,
    "Und die Finger stehen dabei in voller Länge",
    mittel(kurve[iOffen].pip).toFixed(3));
  sage(kurve[iOffen].daumenCmc && kurve[iOffen].daumenCmc.winkel > 6,
    "Der Daumen spreizt sich dabei ab",
    kurve[iOffen].daumenCmc ? kurve[iOffen].daumenCmc.winkel + "°" : "-");

  /* --- 3. Die Welle beim Schliessen ---------------------------------- */
  const wellePunkte = kurve.slice(iOffen, iZu).filter((k) => {
    const kl = k.pip.find((x) => x.rf === 3), ze = k.pip.find((x) => x.rf === 0);
    return kl && ze && mittel(k.pip) < 0.98 && mittel(k.pip) > 0.66;
  });
  const welleOk = wellePunkte.some((k) => {
    const kl = k.pip.find((x) => x.rf === 3), ze = k.pip.find((x) => x.rf === 0);
    return kl.sy < ze.sy - 0.01;
  });
  console.log("\n  Station „Umschliessen\" — die Welle");
  sage(welleOk, "Der kleine Finger schliesst VOR dem Zeigefinger",
    wellePunkte.map((k) => k.t + "ms: " + k.pip.map((x) => x.sy).join("/")).join("  ") || "kein Zwischenschritt gemessen");

  /* --- 4. Der Kraftschluss ------------------------------------------- */
  const g = kurve[iZu];
  console.log("\n  Station „Kraftschluss\" bei " + g.t + " ms");
  sage(mittel(g.mcp) < 0.9 && mittel(g.pip) < 0.72 && mittel(g.dip) < 0.68,
    "Alle drei Gelenkreihen sind gebeugt",
    "Grund " + mittel(g.mcp).toFixed(2) + ", Mittel " + mittel(g.pip).toFixed(2)
    + ", End " + mittel(g.dip).toFixed(2));
  sage(mittel(g.pip) < mittel(g.mcp),
    "Das Mittelgelenk beugt sich am stärksten — so ist eine Hand gebaut");
  sage(g.daumenCmc && g.daumenCmc.winkel < -18,
    "Der Daumen stellt sich gegenüber",
    g.daumenCmc ? g.daumenCmc.winkel + "°" : "-");
  if (g.bild && g.spitzen.length) {
    const drauf = g.spitzen.filter((s) =>
      Math.hypot(s.x - g.bild.x, s.y - g.bild.y) < g.bild.b * 0.75).length;
    sage(drauf >= 3, "Mindestens drei Fingerspitzen liegen auf dem Bild",
      drauf + " von " + g.spitzen.length);
  } else sage(false, "Das getragene Bild war nicht zu finden");

  /* --- 5. Halten ------------------------------------------------------ */
  const halten = kurve.slice(iZu, iAuf > 0 ? iAuf : kurve.length)
    .filter((k) => mittel(k.pip) < 0.72).length;
  console.log("\n  Station „Tragen\"");
  sage(halten >= 5, "Der Griff hält, solange getragen wird",
    halten + " Messpunkte lang");

  /* --- 6. Loesen ------------------------------------------------------ */
  console.log("\n  Station „Lösen\"" + (iAuf > 0 ? " bei " + kurve[iAuf].t + " ms" : ""));
  sage(iAuf > 0, "Die Hand öffnet sich wieder, bevor sie verschwindet");
  if (iAuf > 0) {
    sage(kurve[iAuf].daumenCmc && Math.abs(kurve[iAuf].daumenCmc.winkel) < 12,
      "Und der Daumen steht wieder ab",
      kurve[iAuf].daumenCmc ? kurve[iAuf].daumenCmc.winkel + "°" : "-");
    /* Loslassen ist der vorsichtige Teil: es darf nicht schneller
       gehen als das Zupacken. */
    const zuDauer = kurve[iZu].t - kurve[iOffen].t;
    const aufDauer = kurve[iAuf].t - kurve[iZu].t;
    sage(aufDauer > 0, "Zwischen Zupacken und Loslassen liegt das Tragen",
      "zu in " + zuDauer + " ms, danach " + aufDauer + " ms bis zum Loesen");
  }

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
