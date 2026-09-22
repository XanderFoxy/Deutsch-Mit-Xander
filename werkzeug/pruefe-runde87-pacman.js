/* =====================================================================
   SONDE RUNDE 87 — PAC-MAN BLEIBT, WO ER ANKOMMT
   ---------------------------------------------------------------------
   XANDER: „Wenn ich mit Pac-Man einen Weg einzeichne und er da landet,
   wo er landet, dann soll er nicht zurückgehen. Er soll da bleiben und
   er soll immer in die Richtung schauen … am Ende, wo er ankommt und
   bleibt, soll er wieder zu meinem Profilbild werden." Und: „beim
   Pac-Man sollen auch die Futterelemente nicht an Stellen sein, die
   keine Profil-Sitzplätze sind."

   Vier Messungen:
     1. Liegt jeder Futterpunkt AUF einem Sitzplatz — und keiner
        dazwischen?
     2. Kommt er am Ziel an und bleibt dort, statt zurückzulaufen?
     3. Schaut sein Maul dabei weiter in die Richtung, in der er
        gelaufen ist?
     4. Wird er am Ziel wieder zum Profilbild?
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
  console.log("RUNDE 87 — Pac-Man");
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
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("pacjagd", "Emmi", "Alex", {}));

  /* --- 1. Das Futter ------------------------------------------------- */
  await pg.waitForTimeout(150);
  const futter = await pg.evaluate(() => {
    /* RUNDE 88 — GEMESSEN WIRD AN DER ZAHL, NICHT AM BILD.
       Zwei Gruende, und beide sind handfest:
       · Xander sagt es jetzt so: „Die Futterpunkte muessen exakt im
         Zentrum der Zahlen liegen."
       · Und das Bild taugt hier gar nicht als Massstab: EIN Bild ist
         waehrend der Jagd der Pac-Man selbst und laeuft ueber das
         Feld. Gemessen man dagegen, ist der Punkt seines eigenen
         Platzes ploetzlich „zu weit weg" — nicht, weil er falsch
         liegt, sondern weil der Massstab weggelaufen ist. Die Zahl
         steht still; sie ist der richtige Massstab. */
    const plaetze = [...document.querySelectorAll(".lc-platz")].map((p) => {
      const k = p.querySelector(".lc-kreis").getBoundingClientRect();
      const n = p.querySelector(".lc-nummer");
      const z = n ? n.getBoundingClientRect() : k;
      return { x: z.left + z.width / 2, y: z.top + z.height / 2, r: k.width / 2 };
    });
    const krumen = [...document.querySelectorAll(".lc-pac-krume")].map((k) => {
      const b = k.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    });
    /* Zu jedem Punkt: wie weit ist der naechste Platzmittelpunkt? */
    const weiten = krumen.map((k) => {
      let m = 1e9;
      plaetze.forEach((p) => { m = Math.min(m, Math.hypot(p.x - k.x, p.y - k.y)); });
      return Math.round(m);
    });
    return { plaetze: plaetze.length, krumen: krumen.length, weiten: weiten,
             radius: Math.round(plaetze.length ? plaetze[0].r : 0) };
  });
  console.log("\n  Das Futter");
  sage(futter.krumen === futter.plaetze,
    "So viele Futterpunkte wie Plätze — einer je Platz",
    futter.krumen + " Punkte auf " + futter.plaetze + " Plätzen");
  /* WAS „AUF EINEM PLATZ" HEISST, in Pixeln: der Bildkreis hat hier
     einen Radius von rund 51 px, und zwei Plaetze liegen etwa 110 px
     auseinander. Ein Punkt IN der Mitte zwischen zwei Plaetzen waere
     also rund 55 px von beiden entfernt. Erlaubt ist deshalb der
     halbe Radius — damit faellt jeder Zwischenpunkt auf.
     RUNDE 88: seit die Punkte auf der Zahl liegen und hier auch an
     der Zahl gemessen wird, ist der Abstand ohnehin fast null. */
  const grenze = Math.max(10, Math.round(futter.radius / 2));
  const daneben = futter.weiten.filter((w) => w > grenze);
  sage(daneben.length === 0,
    "Und keiner liegt zwischen den Plätzen",
    (daneben.length ? daneben.length + " Punkte weiter als " + grenze + " px weg ("
      + daneben.join(", ") + " px)"
      : "alle innerhalb von " + grenze + " px um eine Platzmitte: "
        + futter.weiten.join(", ") + " px"));

  /* --- 2./3./4. Der Lauf --------------------------------------------- */
  const kurve = [];
  const los = Date.now();
  for (let i = 0; i < 14; i++) {
    const m = await pg.evaluate(() => {
      const ich = document.querySelector(".lc-platz-ich");
      const kreis = ich ? ich.querySelector(".lc-kreis") : null;
      const fig = document.querySelector(".lc-pac-figur");
      const zahl = (el) => {
        if (!el) return null;
        const t = getComputedStyle(el).transform;
        const z = t && t.match(/matrix\(([^)]+)\)/);
        if (!z) return { x: 0, y: 0, grad: 0 };
        const p = z[1].split(",").map(Number);
        return { x: Math.round(p[4]), y: Math.round(p[5]),
                 grad: Math.round(Math.atan2(p[1], p[0]) * 180 / Math.PI) };
      };
      const svg = fig ? fig.querySelector("svg") : null;
      return {
        lage: zahl(kreis),
        figDa: Boolean(fig),
        figDeck: fig ? Number(getComputedStyle(fig).opacity) : 0,
        istPac: kreis ? kreis.classList.contains("lc-pacman") : false,
        maul: svg ? zahl(svg).grad : null
      };
    });
    kurve.push(Object.assign({ t: Date.now() - los }, m));
    await pg.waitForTimeout(170);
  }

  console.log("\n  Der Lauf");
  /* Der weiteste Punkt vom Start — dort kommt er an. */
  let iZiel = 0;
  kurve.forEach((k, i) => {
    if (Math.hypot(k.lage.x, k.lage.y) > Math.hypot(kurve[iZiel].lage.x, kurve[iZiel].lage.y)) iZiel = i;
  });
  const ziel = kurve[iZiel];
  sage(Math.hypot(ziel.lage.x, ziel.lage.y) > 40,
    "Er läuft wirklich los", "bis " + ziel.lage.x + "/" + ziel.lage.y + " px");
  /* Und danach: bleibt er dort, solange die Figur noch da ist? */
  const danach = kurve.slice(iZiel).filter((k) => k.figDa);
  const geblieben = danach.every((k) =>
    Math.abs(k.lage.x - ziel.lage.x) <= 2 && Math.abs(k.lage.y - ziel.lage.y) <= 2);
  sage(geblieben, "Und er bleibt dort — kein Rückweg",
    danach.map((k) => k.t + "ms " + k.lage.x + "/" + k.lage.y).join("  "));
  const maulAmZiel = ziel.maul;
  const maulGleich = danach.every((k) => k.maul === null || k.maul === maulAmZiel);
  sage(maulGleich, "Das Maul schaut weiter in die Laufrichtung",
    maulAmZiel + "°");
  /* Und am Ende ist das Profilbild wieder da. */
  const zurueck = kurve.find((k, i) => i > iZiel && !k.istPac);
  sage(Boolean(zurueck), "Am Ziel wird er wieder zum Profilbild",
    zurueck ? "ab " + zurueck.t + " ms" : "bleibt Pac-Man");
  const weg = kurve.find((k, i) => i > iZiel && !k.figDa);
  sage(Boolean(weg), "Und die Pac-Man-Figur ist danach weg",
    weg ? "ab " + weg.t + " ms" : "bleibt stehen");

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
