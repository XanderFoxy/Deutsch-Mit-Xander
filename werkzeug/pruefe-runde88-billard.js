/* =====================================================================
   SONDE RUNDE 88 — DIE BILLARD-PHYSIK
   ---------------------------------------------------------------------
   XANDER: „Die Billard-Physik ist offenbar immer noch nicht gemacht,
   weil sie immer an dasselbe Loch fliegt. Ja, die soll auch, wenn ich
   das selber mache, so sein, dass ich da ne Physik habe beim Spielen,
   die an realistisches Billardspielen erinnert."
   Und frueher: „es soll wirklich an allen Ecken abprallen, bis es ein
   Loch gefunden hat — also die Physik soll stimmen wie beim
   Billardspiel, dass es realistisch in so'n Loch faellt."

   Gemessen wird an der GERECHNETEN BAHN (DMA_PRUEF.billardBahn), denn
   eine Behauptung ueber Physik ist wertlos, wenn man sie nicht
   nachrechnen kann:
   · Prallt die Kugel ueberhaupt an einer Bande ab?
   · Ist Einfallswinkel gleich Ausfallswinkel?
   · Bleibt sie auf dem Tisch?
   · Kommt bei verschiedenen Stoessen ein VERSCHIEDENES Loch heraus?
   · Und rollt im Browser wirklich das Bild diese Bahn entlang?
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
  console.log("RUNDE 88 — Die Billard-Physik\n");
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
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  /* =================================================================
     1. ZWOELF STOESSE
     ================================================================= */
  console.log("ZWOELF STOESSE — „nicht immer dasselbe Loch\"\n");
  const stoesse = await pg.evaluate(() => {
    const aus = [];
    for (let i = 0; i < 12; i++) {
      const los = i / 12 + 0.02;
      const b = window.DMA_PRUEF.billardBahn(1, 3, los);
      if (!b) return null;
      const abs = b.punkte.map((p) => ({ x: p.x + b.start.x, y: p.y + b.start.y }));
      aus.push({ los: Number(los.toFixed(3)), loch: b.loch, banden: b.banden,
                 bandenBei: b.bandenBei,
                 schritte: b.punkte.length,
                 minx: Math.min.apply(null, abs.map((p) => p.x)),
                 maxx: Math.max.apply(null, abs.map((p) => p.x)),
                 miny: Math.min.apply(null, abs.map((p) => p.y)),
                 maxy: Math.max.apply(null, abs.map((p) => p.y)),
                 punkte: abs });
    }
    const b0 = window.DMA_PRUEF.billardBahn(1, 3, 0.5);
    return { aus: aus, plaetze: b0.plaetze };
  });
  sage(!!stoesse, "die Bahn laesst sich nachrechnen (DMA_PRUEF.billardBahn)");
  if (!stoesse) { await br.close(); srv.close(); process.exit(1); }
  const loecher = [...new Set(stoesse.aus.map((s) => s.loch))].filter((x) => x !== null);
  sage(loecher.length >= 2,
    "verschiedene Stoesse finden VERSCHIEDENE Loecher",
    "gefundene Loecher: " + JSON.stringify(loecher) + " bei "
      + stoesse.aus.filter((s) => s.loch !== null).length + " von 12 versenkten Stoessen");
  const frei = stoesse.plaetze.filter((p) => p.frei).map((p) => p.nr);
  sage(loecher.every((l) => frei.indexOf(l) >= 0),
    "und es ist immer ein FREIER Platz — in einen besetzten faellt niemand",
    "frei: " + JSON.stringify(frei));
  sage(stoesse.aus.every((s) => s.banden >= 1),
    "jede Kugel prallt mindestens einmal an einer Bande ab",
    "Banden je Stoss: " + stoesse.aus.map((s) => s.banden).join(" "));
  sage(stoesse.aus.filter((s) => s.loch !== null).length >= 6,
    "und die Mehrzahl der Stoesse findet ein Loch",
    stoesse.aus.filter((s) => s.loch !== null).length + " von 12");

  /* =================================================================
     2. DER TISCH HAELT SIE
     ================================================================= */
  console.log("\nDIE BANDE — Einfallswinkel gleich Ausfallswinkel\n");
  /* Die Banden liegen eine halbe Bildbreite hinter den aeussersten
     Plaetzen. Weiter darf keine Bahn kommen. */
  const xs = stoesse.plaetze.map((p) => p.x), ys = stoesse.plaetze.map((p) => p.y);
  const spanneX = Math.max.apply(null, xs) - Math.min.apply(null, xs);
  const drin = stoesse.aus.every((s) =>
    s.minx >= Math.min.apply(null, xs) - spanneX && s.maxx <= Math.max.apply(null, xs) + spanneX
    && s.miny >= Math.min.apply(null, ys) - spanneX && s.maxy <= Math.max.apply(null, ys) + spanneX);
  sage(drin, "keine Kugel verlaesst den Tisch",
    "x " + Math.round(Math.min.apply(null, stoesse.aus.map((s) => s.minx))) + " bis "
      + Math.round(Math.max.apply(null, stoesse.aus.map((s) => s.maxx)))
      + ", y " + Math.round(Math.min.apply(null, stoesse.aus.map((s) => s.miny))) + " bis "
      + Math.round(Math.max.apply(null, stoesse.aus.map((s) => s.maxy))));

  /* An einer Bande kehrt sich EINE Geschwindigkeitskomponente um und
     die andere laeuft weiter. WELCHER Schritt eine Bande war, sagt
     die Rechnung selbst („bandenBei") — danach zu SUCHEN waere
     unzuverlaessig: ein Vorzeichenwechsel von dx passiert auch mitten
     auf dem Tisch, wenn der Effet die Bahn durch die Senkrechte
     dreht, und beim ersten Versuch hielt die Sonde genau solche
     Stellen fuer Banden.
     Verglichen werden die beiden SAUBEREN Schritte davor und danach:
     der Schritt, in dem gespiegelt wird, ist selbst ein Mischschritt
     (ein Stueck hin, der Rest zurueck) und taugt nicht zum Vergleich.
     Die Ecke ist ein eigener Fall — dort kehren sich beide Richtungen
     um, und das ist richtig so. */
  const ecken = [];
  stoesse.aus.forEach((s) => {
    const p = s.punkte;
    (s.bandenBei || []).forEach((b) => {
      const i = b.i;
      if (i < 2 || i > p.length - 3) return;
      ecken.push({
        achse: b.achse,
        einX: p[i - 1].x - p[i - 2].x, ausX: p[i + 2].x - p[i + 1].x,
        einY: p[i - 1].y - p[i - 2].y, ausY: p[i + 2].y - p[i + 1].y
      });
    });
  });
  sage(ecken.length >= 8, "es gibt genug Bandenstoesse zum Nachmessen",
    ecken.length + " Stellen, davon " + ecken.filter((e) => e.achse.length > 1).length + " Ecken");
  /* Drei Schritte Reibung sind knapp drei Prozent; mit dem Effet, der
     die Bahn dabei weiterdreht, lasse ich 15 Prozent zu. */
  const spiegelt = (ein, aus) => ein * aus < 0
    && Math.abs(Math.abs(aus) - Math.abs(ein)) / Math.max(0.5, Math.abs(ein)) < 0.15;
  const bleibt = (ein, aus) => ein * aus >= 0 || Math.abs(ein) < 0.6;
  const schlecht = ecken.filter((e) => {
    if (e.achse === "x") return !(spiegelt(e.einX, e.ausX) && bleibt(e.einY, e.ausY));
    if (e.achse === "y") return !(spiegelt(e.einY, e.ausY) && bleibt(e.einX, e.ausX));
    /* Ecke: beide kehren um. */
    return !(spiegelt(e.einX, e.ausX) && spiegelt(e.einY, e.ausY));
  });
  sage(schlecht.length === 0,
    "an jeder Bande kehrt sich genau die getroffene Richtung um, die andere laeuft weiter",
    schlecht.length ? schlecht.length + " von " + ecken.length + " stimmen nicht: "
      + schlecht.slice(0, 6).map((e) => e.achse + ": x " + e.einX.toFixed(2) + "->"
          + e.ausX.toFixed(2) + ", y " + e.einY.toFixed(2) + "->" + e.ausY.toFixed(2)).join("  |  ")
      : ecken.length + " Bandenstoesse geprueft, alle sauber gespiegelt");

  /* =================================================================
     3. UND IM BROWSER ROLLT DAS BILD AUCH WIRKLICH
     ================================================================= */
  console.log("\nUND ES ROLLT AUCH WIRKLICH\n");
  await pg.evaluate(() =>
    window.DMA_PRUEFUNG.wirkung("billard", "Cem", "Alex", { los: "0.02" }));
  /* Bei fuenf Leuten am Tisch greift der Pulk-Zweig: die angestossene
     Kugel rollt in den Haufen, und die GETROFFENE faellt ins Loch.
     Gemessen wird deshalb nicht ein bestimmter Platz, sondern alle —
     und genommen wird der weiteste Weg. Ein Bild, das 40 Mal in
     2,4 Sekunden abgefragt wird, zeigt auch die Banden. */
  const spuren = {};
  for (let i = 0; i < 40; i++) {
    await pg.waitForTimeout(60);
    const jetzt = await pg.evaluate(() =>
      Array.from(document.querySelectorAll("#lcPlaetze .lc-platz")).map((pl) => {
        const k = pl.querySelector(".lc-kreis");
        const r = k.getBoundingClientRect();
        return { nr: pl.dataset.lcPlatz || "?",
                 x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
      }));
    jetzt.forEach((p2) => {
      if (!spuren[p2.nr]) spuren[p2.nr] = [];
      spuren[p2.nr].push(p2);
    });
  }
  const weiten = Object.keys(spuren).map((nr) => {
    const p2 = spuren[nr];
    let w = 0;
    for (let i = 1; i < p2.length; i++) w += Math.hypot(p2[i].x - p2[i - 1].x, p2[i].y - p2[i - 1].y);
    return { nr: nr, w: Math.round(w) };
  }).sort((a2, b2) => b2.w - a2.w);
  sage(weiten[0].w > 250, "ein Bild rollt wirklich weit ueber das Feld",
    weiten.slice(0, 3).map((x) => "Platz " + x.nr + ": " + x.w + " px").join(", "));
  /* Und es rollt nicht nur hin und her auf einer Linie: die Bahn
     muss in beiden Richtungen etwas hergeben. */
  const beste = spuren[weiten[0].nr];
  const breit = Math.max.apply(null, beste.map((p2) => p2.x))
              - Math.min.apply(null, beste.map((p2) => p2.x));
  const hoch = Math.max.apply(null, beste.map((p2) => p2.y))
             - Math.min.apply(null, beste.map((p2) => p2.y));
  sage(breit > 40 && hoch > 20,
    "und zwar quer ueber den Tisch, nicht nur auf einer Geraden",
    breit + " px breit, " + hoch + " px hoch");
  const tasche = await pg.evaluate(() => {
    const t = document.querySelector(".lc-billard-tasche");
    const p = t ? t.closest(".lc-platz") : null;
    return p ? (p.dataset.lcPlatz || "?") : "";
  });
  /* Am Tisch sitzen hier fuenf Leute, also greift der Pulk-Zweig:
     die angestossene Kugel rollt in den Haufen, und die getroffene
     faellt ins Loch. Nachgemessen wird deshalb nicht die Nummer der
     ERSTEN Rechnung, sondern dass ueberhaupt ein Loch gezeigt wird
     und dass es ein FREIER Platz ist. */
  sage(tasche && frei.indexOf(Number(tasche)) >= 0,
    "und die Tasche liegt auf einem freien Platz",
    "gezeigt: " + (tasche || "keins") + ", frei: " + JSON.stringify(frei));

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Punkt(e) offen" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
