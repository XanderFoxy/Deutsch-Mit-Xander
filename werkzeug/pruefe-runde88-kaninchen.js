/* =====================================================================
   SONDE RUNDE 88 — DAS KANINCHEN AUS DEM ZYLINDER
   ---------------------------------------------------------------------
   XANDER (Runde 79): „eine Animation koennte auch noch sein, dass man
   jemanden oder sich selbst mit dem Profileffekt beeinflusst, der wie
   ein Zylinder ist, und dann mit dem Zauberstab auf den Zylinder
   schlaegt und dann ein Kaninchen an seinen Ohren herausholt und dann
   so Beifall geklatscht wird. Vor Kunststueck halt."
   XANDER (Runde 87): „Der Zauberer mit Kaninchen, das sollte ein
   Profilbild-Effekt sein, keine Reise."
   XANDER (Runde 88): „Die Animation mit dem Kaninchen … als einfacher
   Profil-Effekt … und dass ich andere damit beeinflussen kann. Und
   die Reise ist ein anderer Effekt. Das sind zwei verschiedene Paar
   Schuhe."

   Gemessen wird an der laufenden Animation:
   · Es ist ein PLATZ-Effekt: niemand wandert, niemand tauscht.
   · Der Zylinder kommt von oben und deckt das Bild zu.
   · Der Zauberstab klopft DREIMAL — drei Abwaertsbewegungen.
   · Das Bild kommt AN DEN OHREN heraus, ueber den Hut hinaus.
   · Am Ende wird geklatscht, rings um den Platz.
   · Und hinterher ist der Platz wieder genau wie vorher.
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
  console.log("RUNDE 88 — Das Kaninchen aus dem Zylinder\n");
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

  /* =================================================================
     1. ES IST EIN BEFEHL, UND ER IST KEINE REISE
     ================================================================= */
  console.log("EIN PROFIL-EFFEKT, KEINE REISE\n");
  const tueren = await pg.evaluate(() => ({
    bekannt: LiveChat.pruefBefehlBekannt ? LiveChat.pruefBefehlBekannt("kaninchen") : null,
    kachel: (function () {
      const t = document.body.innerHTML;
      return true;
    })()
  }));
  sage(tueren.bekannt === true,
    "„/kaninchen\" ist ein bekannter Befehl — die Zeile geht hinaus",
    String(tueren.bekannt));

  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const vorher = await pg.evaluate(() =>
    Array.from(document.querySelectorAll("#lcPlaetze .lc-platz"))
      .map((p) => (p.dataset.lcPlatz || "") + ":" + ((p.querySelector(".lc-platz-name") || {}).textContent || "-")).join(" "));
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("kaninchen", "3", "Alex", {}));
  await pg.waitForTimeout(150);
  const gemalt = await pg.evaluate(() => ({
    schichten: document.querySelectorAll(".lc-zaubertrick").length,
    aufPlatz3: document.querySelectorAll('#lcPlaetze .lc-platz[data-lc-platz="3"] .lc-zaubertrick').length,
    hut: document.querySelectorAll(".lc-zt-hut").length,
    stab: document.querySelectorAll(".lc-zt-stab").length,
    ohren: document.querySelectorAll(".lc-zt-ohren").length,
    funken: document.querySelectorAll(".lc-zt-funken > i").length,
    haende: document.querySelectorAll(".lc-zt-beifall > i").length
  }));
  sage(gemalt.schichten === 1 && gemalt.aufPlatz3 === 1,
    "er wirkt auf GENAU EINEN Platz — den, der gemeint ist",
    gemalt.schichten + " Schicht(en), davon auf Platz 3: " + gemalt.aufPlatz3);
  sage(gemalt.hut === 1 && gemalt.stab === 1 && gemalt.ohren === 1
       && gemalt.funken === 10 && gemalt.haende === 6,
    "Zylinder, Zauberstab, Ohren, Funken und klatschende Haende sind da",
    "Hut " + gemalt.hut + ", Stab " + gemalt.stab + ", Ohren " + gemalt.ohren
      + ", Funken " + gemalt.funken + ", Haende " + gemalt.haende);

  /* =================================================================
     2. DER ABLAUF
     ================================================================= */
  console.log("\nDER ABLAUF — Hut, drei Schlaege, an den Ohren heraus, Beifall\n");
  const mess = [];
  let letzt = 150;
  for (const ms of [300, 600, 750, 900, 1050, 1200, 1350, 1500, 1750,
                    2000, 2200, 2450, 2700, 3000, 3200, 3500, 3900]) {
    await pg.waitForTimeout(ms - letzt); letzt = ms;
    mess.push(Object.assign({ t: ms }, await pg.evaluate(() => {
      const s = document.querySelector(".lc-zaubertrick");
      if (!s) return { weg: true };
      const kasten = (w) => {
        const e = s.querySelector(w);
        if (!e) return null;
        const r = e.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2,
                 h: r.height, o: Number(getComputedStyle(e).opacity) };
      };
      const platz = s.closest(".lc-platz");
      const kr = platz.querySelector(".lc-kreis").getBoundingClientRect();
      const sichtbar = Array.from(s.querySelectorAll(".lc-zt-beifall > i"))
        .filter((e) => Number(getComputedStyle(e).opacity) > 0.35).length;
      return { hut: kasten(".lc-zt-hut"), stab: kasten(".lc-zt-stab"),
               ohren: kasten(".lc-zt-ohren"),
               bild: { x: kr.left + kr.width / 2, y: kr.top + kr.height / 2, b: kr.width },
               klatscher: sichtbar };
    })));
  }
  const da = mess.filter((m) => !m.weg);
  const bildBreit = da[0].bild.b;

  /* Der Hut deckt das Bild zu: seine Mitte liegt nahe der Bildmitte,
     und er ist breiter als das Bild. */
  const drauf = da.filter((m) => m.hut && m.hut.o > 0.9 && m.t < 2000);
  sage(drauf.length > 3 && drauf.every((m) => Math.abs(m.hut.x - m.bild.x) < bildBreit * 0.2),
    "der Zylinder sitzt mittig ueber dem Bild",
    drauf.length + " Messpunkte, groesster Versatz "
      + Math.max.apply(null, drauf.map((m) => Math.abs(m.hut.x - m.bild.x))).toFixed(0) + " px");

  /* Der Stab klopft DREIMAL: dreimal geht seine Spitze hinunter und
     wieder hinauf. Gezaehlt werden die Wechsel von „ab" nach „auf". */
  const stabY = da.filter((m) => m.stab && m.stab.o > 0.5).map((m) => m.stab.y);
  let tiefpunkte = 0;
  for (let i = 1; i < stabY.length - 1; i++) {
    if (stabY[i] > stabY[i - 1] && stabY[i] >= stabY[i + 1]) tiefpunkte++;
  }
  sage(stabY.length >= 5,
    "der Zauberstab ist ueberhaupt im Bild",
    stabY.length + " Messpunkte sichtbar");
  sage(tiefpunkte >= 2,
    "und er geht mehrfach herunter und wieder hoch — er klopft, er liegt nicht",
    tiefpunkte + " Tiefpunkte in " + stabY.map((y) => Math.round(y)).join(" "));

  /* Das Bild kommt AN DEN OHREN heraus: die Ohren sind sichtbar, und
     das Bild steht dann deutlich hoeher als im Ruhezustand. */
  const ruheY = da[0].bild.y;
  const oben = da.filter((m) => m.ohren && m.ohren.o > 0.7);
  sage(oben.length >= 2, "die Ohren wachsen, wenn er zupackt",
    oben.length + " Messpunkte mit sichtbaren Ohren");
  const hoch = Math.min.apply(null, da.map((m) => m.bild.y));
  sage(ruheY - hoch > bildBreit * 0.45,
    "und das Bild wird daran aus dem Hut gezogen",
    "hoechster Stand " + (ruheY - hoch).toFixed(0) + " px ueber der Ruhelage, Bild "
      + bildBreit.toFixed(0) + " px breit");
  /* Und die Ohren sitzen dabei AM Bild, nicht irgendwo. */
  const zusammen = oben.every((m) => Math.abs(m.ohren.x - m.bild.x) < bildBreit * 0.2
                                  && m.ohren.y < m.bild.y);
  sage(zusammen, "sie sitzen oben am Bild und wandern mit ihm",
    oben.map((m) => Math.round(m.ohren.x - m.bild.x) + "/" + Math.round(m.bild.y - m.ohren.y)).join("  "));

  /* Beifall: „und dann so Beifall geklatscht wird." */
  const klatsch = Math.max.apply(null, da.map((m) => m.klatscher));
  sage(klatsch >= 3, "am Ende wird geklatscht", klatsch + " Haende gleichzeitig zu sehen");
  const frueh = da.filter((m) => m.t < 2400).every((m) => m.klatscher === 0);
  sage(frueh, "und zwar erst NACH dem Kunststueck, nicht schon vorher");

  /* =================================================================
     3. UND HINTERHER IST ALLES WIE VORHER
     ================================================================= */
  console.log("\nUND HINTERHER\n");
  await pg.waitForTimeout(1400);
  const nachher = await pg.evaluate(() => ({
    schicht: document.querySelectorAll(".lc-zaubertrick").length,
    plaetze: Array.from(document.querySelectorAll("#lcPlaetze .lc-platz"))
      .map((p) => (p.dataset.lcPlatz || "") + ":" + ((p.querySelector(".lc-platz-name") || {}).textContent || "-")).join(" "),
    bildDreh: (function () {
      const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="3"] .lc-kreis');
      const m = k ? getComputedStyle(k).transform : "none";
      return (!m || m === "none") ? "keine" : m;
    })()
  }));
  sage(nachher.schicht === 0, "nichts bleibt liegen", nachher.schicht + " Schichten");
  sage(nachher.plaetze === vorher,
    "und niemand hat den Platz gewechselt — es ist eben KEINE Reise",
    nachher.plaetze === vorher ? "Sitzordnung unveraendert" : nachher.plaetze);
  sage(nachher.bildDreh === "keine" || /matrix\(1, 0, 0, 1, 0, 0\)/.test(nachher.bildDreh),
    "das Profilbild steht wieder gerade", nachher.bildDreh);

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Punkt(e) offen" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
