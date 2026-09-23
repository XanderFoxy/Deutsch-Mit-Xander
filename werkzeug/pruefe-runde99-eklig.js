/* =====================================================================
   SONDE RUNDE 99 — SABBERN UND DAS STREICHELN AN DER WANGE
   ---------------------------------------------------------------------
   XANDER (23.09.2026):
     „Man kann auch jemanden ansabbern."
     „Beim Streicheln koennte man auch mit dem Handruecken an der Wange
      streicheln."

   GEMESSEN WIRD:
     1. Der Sabbertropfen macht der Reihe nach das, was ein Tropfen tut:
        sammeln, laenger werden, abreissen, fallen, auftreffen. Gemessen
        an seiner Hoehe ueber dem Bild, Bild fuer Bild angehalten.
     2. Die Lache bleibt INNERHALB der Platzgrenzen — „es soll nur
        innerhalb der Platz Grenzen stattfinden".
     3. Der nasse Ton liegt auf dem Abriss, nicht irgendwo.
     4. Die Streichelhand faehrt an der WANGE hinunter statt quer ueber
        das Gesicht: gemessen an ihrer Bahn — wenig Weg zur Seite, viel
        Weg nach unten, und sie bleibt auf EINER Seite.
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
  console.log("RUNDE 99 — Sabbern und das Streicheln an der Wange\n");
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
  const pg = await br.newPage({ viewport: { width: 900, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne
    && window.DMA_PRUEFUNG, { timeout: 25000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.waitForTimeout(250);

  /* Eine Wirkung ausloesen und ihre Bahn in Schritten abtasten. Die
     Zeit wird in MILLISEKUNDEN gesetzt, nicht als Anteil: die Teile
     einer Animation haben verschiedene Laengen, und ein Anteil waere
     bei jedem etwas anderes. */
  const abtasten = async (art, wieLang, lesen) => {
    await pg.evaluate((a) => {
      document.querySelectorAll(".lc-sabber, .lc-streichel").forEach((e) => e.remove());
      window.DMA_TONLOG = [];
      window.DMA_PRUEFUNG.wirkung(a, "Bea", "Alex");
    }, art);
    await pg.waitForTimeout(150);
    const bahn = [];
    for (let ms = 0; ms <= wieLang; ms += wieLang / 60) {
      const p = await pg.evaluate((arg) => {
        document.getAnimations().forEach((an) => {
          try {
            const d = an.effect && an.effect.getTiming().duration;
            if (d) { an.currentTime = Math.min(d, arg.ms); an.pause(); }
          } catch (e) {}
        });
        return (new Function("return (" + arg.fn + ")()"))();
      }, { ms: Math.round(ms), fn: lesen });
      if (p) bahn.push(Object.assign({ ms: Math.round(ms) }, p));
    }
    return bahn;
  };

  console.log("1  DER TROPFEN MACHT, WAS EIN TROPFEN TUT\n");
  const sab = await abtasten("sabbern", 3000, `function () {
    const t = document.querySelector(".lc-sabber-tropfen");
    const la = document.querySelector(".lc-sabber-lache");
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="2"] .lc-kreis');
    if (!t || !k) return null;
    const rt = t.getBoundingClientRect(), rk = k.getBoundingClientRect();
    const rl = la ? la.getBoundingClientRect() : null;
    return {
      /* Wo steht der Tropfen, gemessen in Prozent der Bildhoehe, von
         der Bildoberkante aus nach unten. */
      tropfenY: Math.round(((rt.top + rt.height / 2) - rk.top) / rk.height * 1000) / 10,
      tropfenSicht: Number(getComputedStyle(t).opacity),
      lacheBreit: rl ? Math.round(rl.width * 10) / 10 : 0,
      lacheSicht: la ? Number(getComputedStyle(la).opacity) : 0,
      lacheDrin: rl && rl.width
        ? (rl.left >= rk.left - 1 && rl.right <= rk.right + 1
           && rl.top >= rk.top - 1 && rl.bottom <= rk.bottom + 1)
        : true,
      bildBreit: Math.round(rk.width)
    };
  }`);
  if (sab.length < 40) {
    sage(false, "Der Sabber liess sich nicht abtasten", sab.length + " Punkte");
  } else {
    const bei = (ms) => sab.reduce((a, b) =>
      Math.abs(b.ms - ms) < Math.abs(a.ms - ms) ? b : a);
    const sammeln = bei(600), lang = bei(1250), fallen = bei(1600), unten = bei(2000);
    sage(sammeln.tropfenSicht > 0.5 && sammeln.tropfenY < 10,
      "Bei 0,6 s haengt der Tropfen noch oben",
      sammeln.tropfenY + " % der Bildhoehe");
    sage(lang.tropfenY > sammeln.tropfenY,
      "Bei 1,25 s hat er sich in die Laenge gezogen",
      sammeln.tropfenY + " % -> " + lang.tropfenY + " %");
    sage(fallen.tropfenY > lang.tropfenY + 5,
      "Bei 1,6 s faellt er wirklich", lang.tropfenY + " % -> " + fallen.tropfenY + " %");
    sage(unten.lacheBreit > 10 && unten.lacheSicht > 0.5,
      "Bei 2,0 s liegt die Lache auf dem Bild",
      unten.lacheBreit + " px breit (Bild " + unten.bildBreit + " px)");
    sage(sab.every((p) => p.lacheDrin),
      "Und sie bleibt die ganze Zeit INNERHALB der Platzgrenzen");
  }

  console.log("\n2  DER NASSE TON LIEGT AUF DEM ABRISS\n");
  await pg.evaluate(() => {
    document.querySelectorAll(".lc-sabber").forEach((e) => e.remove());
    window.DMA_TONLOG = [];
    window.DMA_PRUEFUNG.wirkung("sabbern", "Bea", "Alex");
  });
  await pg.waitForTimeout(2400);
  const toene = await pg.evaluate(() => (window.DMA_TONLOG || []).map((t) => t.name));
  sage(toene.indexOf("schlurf") >= 0, "Der nasse Ton kommt", toene.join(", ") || "gar nichts");
  sage(toene.some((n) => n === "ekelmann" || n === "ekelfrau"),
    "Und der Getroffene sagt, was er davon haelt",
    toene.join(", ") || "gar nichts");

  console.log("\n3  DIE HAND STREICHELT AN DER WANGE, NICHT UEBERS GESICHT\n");
  const str = await abtasten("streicheln", 3400, `function () {
    const h = document.querySelector(".lc-streichel-hand");
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="2"] .lc-kreis');
    if (!h || !k) return null;
    const rh = h.getBoundingClientRect(), rk = k.getBoundingClientRect();
    return {
      x: Math.round(((rh.left + rh.width / 2) - (rk.left + rk.width / 2)) / rk.width * 1000) / 10,
      y: Math.round(((rh.top + rh.height / 2) - rk.top) / rk.height * 1000) / 10,
      sicht: Number(getComputedStyle(h).opacity),
      finger: h.querySelectorAll("rect").length
    };
  }`);
  if (str.length < 40) {
    sage(false, "Die Streichelhand liess sich nicht abtasten", str.length + " Punkte");
  } else {
    const sichtbar = str.filter((p) => p.sicht > 0.6);
    const xs = sichtbar.map((p) => p.x), ys = sichtbar.map((p) => p.y);
    const spanne = (a) => Math.max.apply(null, a) - Math.min.apply(null, a);
    sage(str[0].finger === 4, "Es ist der Handruecken: vier eingerollte Finger",
      str[0].finger + " Fingerkuppen");
    sage(Math.min.apply(null, xs) > 0,
      "Sie bleibt auf EINER Seite des Bildes — an der Wange",
      "von " + Math.min.apply(null, xs).toFixed(1) + " bis "
      + Math.max.apply(null, xs).toFixed(1) + " % der Bildbreite");
    sage(spanne(ys) > spanne(xs),
      "Und sie geht mehr hinunter als zur Seite",
      "hinunter " + spanne(ys).toFixed(1) + " %, zur Seite " + spanne(xs).toFixed(1) + " %");
  }

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
