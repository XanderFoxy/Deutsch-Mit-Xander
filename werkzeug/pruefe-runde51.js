#!/usr/bin/env node
/* =========================================================
   RUNDE 51 — DAS PORTAL UND DER ZUG AM SEIL
   ---------------------------------------------------------
   GEMELDET:
   · „der Gate-Effekt ist noch nicht realistisch."
   · „bei dem Lasso sieht es nicht so aus, als wenn man den
      anderen ran zieht."

   Beim Lasso wird die ZEIT gemessen, nicht das Bild: der Zug
   darf nicht beginnen, bevor die Schlinge sitzt. Genau daran
   lag es.
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

  console.log("\nDAS LASSO: ERST WERFEN, DANN ZIEHEN\n");
  const zug = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-lasso, .lc-leine").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("lasso", "3", "Alex");
    await new Promise((f) => setTimeout(f, 200));
    const ziel = document.querySelectorAll(".lc-platz")[2];
    const kreis = ziel ? ziel.querySelector(".lc-kreis") : null;
    const cs = kreis ? getComputedStyle(kreis) : null;
    /* GEMESSEN, NICHT ABGELESEN: wo steht das Bild WIRKLICH?
       Bei 320 ms fliegt die Schlinge noch (sie landet bei 640 ms und
       sitzt bei 910 ms) — da darf sich nichts geruehrt haben. Bei
       1250 ms muss der Ruck dagegen deutlich zu sehen sein.
       Die Schluesselbilder auszulesen waere der Umweg; die Stelle des
       Bildes ist die Sache selbst. */
    const wo = () => {
      const m = new DOMMatrixReadOnly(getComputedStyle(kreis).transform);
      return Math.hypot(m.m41, m.m42);
    };
    await new Promise((f) => setTimeout(f, 120));   /* jetzt 320 ms */
    const frueh = wo();
    await new Promise((f) => setTimeout(f, 930));   /* jetzt 1250 ms */
    const spaet = wo();
    let dauer = 0;
    try {
      (kreis ? kreis.getAnimations() : []).forEach((an) => {
        dauer = Math.max(dauer, Number(an.effect.getTiming().duration) || 0);
      });
    } catch (e) {}
    return { anim: cs ? cs.animationName : "-",
             frueh: Math.round(frueh * 10) / 10, spaet: Math.round(spaet * 10) / 10,
             dauer: Math.round(dauer),
             schlinge: Boolean(ziel && ziel.querySelector(".lc-lasso-schlinge")) };
  });
  /* RUNDE 71 NACHGEZOGEN: der Zug heisst seit Runde 65 „lcZuMirR65"
     — dort ist das Lasso neu gebaut worden („Das Lasso schlingt sich
     immer noch nicht um das Opfer an seinem Platz"). Gemeint ist
     dasselbe: der Gezogene hat eigene Schluesselbilder und haengt
     nicht am allgemeinen Umarmungsbild. Deshalb steht hier jetzt der
     heutige Name, nicht der von damals. */
  pruefe("der Zug hat eigene Schluesselbilder", zug.anim === "lcZuMirR65", zug.anim);
  pruefe("die Schlinge liegt am Bild", zug.schlinge);
  /* Die fliegende Schlinge landet bei 640 ms, sie sitzt bei 910 ms.
     Vorher riss der Zug schon bei 0 ms an. */
  pruefe("bei 320 ms ruehrt er sich noch nicht — die Schlinge fliegt ja",
    zug.frueh < 1.5, zug.frueh + " px versetzt");
  pruefe("bei 1250 ms ist er deutlich herangezogen",
    zug.spaet > 4, zug.spaet + " px versetzt");
  pruefe("er dauert dafuer laenger als die 1,8 s von frueher",
    zug.dauer >= 2300, zug.dauer + " ms");

  console.log("\nDAS PORTAL: SCHICHTEN STATT EINER SCHEIBE\n");
  const tor = await pg.evaluate(async () => {
    const reihe = document.getElementById("lcPlaetze");
    const vorbild = document.querySelector(".lc-platz");
    if (reihe && vorbild && !reihe.querySelector(".lc-platz-frei")) {
      const frei = vorbild.cloneNode(true);
      frei.className = "lc-platz lc-platz-frei";
      frei.dataset.lcPlatz = "6";
      const n = frei.querySelector(".lc-platz-name");
      if (n) n.textContent = "frei";
      reihe.appendChild(frei);
    }
    document.querySelectorAll(".lc-tor-wirbel").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("portal", "6", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const t = document.querySelector(".lc-tor-wirbel");
    if (!t) return { da: false };
    const teil = (k) => t.querySelector("." + k);
    /* RUNDE 71 NACHGEZOGEN. Diese Pruefung stammt aus Runde 51, als
       das Tor noch ein SOG war: Wirbel, Kern, Ereignishorizont,
       Energiebogen, angesaugter Staub. In Runde 67 hat XANDER
       ausdruecklich etwas anderes bestellt („Tor als stehende
       Wasserwand"), und in Runde 71 noch einmal etwas anderes
       („schwarz mit Spiegeleffekten so ganz langsam"). Die alten
       Teile sind deshalb abgeschaltet, und seit Runde 67 stand diese
       Pruefung auf Rot — sie hielt einen Zustand fest, den er selbst
       abbestellt hat.
       Geprueft wird jetzt, was das Tor HEUTE ausmacht, und zwar
       genauso streng: Fassung, Flaeche, Wellen, drei durchsichtige
       Schichten, und dass keine zwei davon gleich schnell laufen. */
    const schichten = [...t.querySelectorAll(".lc-tor-schicht")]
      .map((e) => getComputedStyle(e).animationDuration);
    return { da: true,
             ring: Boolean(teil("lc-tor-ring")),
             wasser: Boolean(teil("lc-tor-wasser")),
             saum: Boolean(teil("lc-tor-saum")),
             spiegel: Boolean(teil("lc-tor-spiegel")),
             wellen: t.querySelectorAll(".lc-tor-welle").length,
             tropfen: t.querySelectorAll(".lc-tor-tropfen").length,
             schichten: schichten,
             verschieden: new Set(schichten).size };
  });
  pruefe("das Portal reisst auf", tor.da);
  pruefe("es hat eine Fassung", Boolean(tor.ring));
  pruefe("eine Flaeche", Boolean(tor.wasser));
  pruefe("einen Saum", Boolean(tor.saum));
  pruefe("einen Spiegel", Boolean(tor.spiegel));
  pruefe("Wellen, die darueber laufen", (tor.wellen || 0) === 5, tor.wellen + " Ringe");
  pruefe("und Tropfen", (tor.tropfen || 0) >= 8, tor.tropfen + " Tropfen");
  /* Tiefe entsteht dadurch, dass die Schichten VERSCHIEDEN schnell
     laufen. Laufen sie gleich schnell, ist es wieder eine Scheibe. */
  pruefe("drei durchsichtige Schichten", (tor.schichten || []).length === 3);
  pruefe("keine zwei Schichten laufen gleich schnell",
    tor.verschieden === (tor.schichten || []).length,
    (tor.schichten || []).join(" / "));

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nDas Portal wirbelt, und das Lasso wirft erst.\n");
  process.exit(fehler ? 1 : 0);
})();
