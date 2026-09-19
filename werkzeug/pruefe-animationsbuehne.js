#!/usr/bin/env node
/* =========================================================
   BLEIBEN DIE ANIMATIONEN IM CHAT?
   ---------------------------------------------------------
   GEMELDET: „Die Grenze fuer die Animation ist immer der
   Chat-Boden, so wie es bisher war. Aber wenn ich nach oben
   scrolle, sollen die Animationen nicht die Links verdecken
   oder irgendwas anderes. Die Animationen sollen im Bereich
   des Chats bleiben."

   Diese Sonde loest JEDE ganzseitige Animation aus und misst
   danach zwei Dinge:
   1. Sie zeichnet ueberhaupt etwas (sonst haette der Umzug
      auf die Buehne etwas kaputtgemacht).
   2. Sie haengt in der Buehne — und die Buehne liegt nicht
      breiter und nicht hoeher als die Klassenzimmer-Karte.

   Danach wird die Seite GESCROLLT und noch einmal gemessen:
   die Buehne muss mitwandern und darf nie ueber die Karte
   hinausragen.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".webm": "video/webm" };

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
  const pg = await br.newPage({ viewport: { width: 420, height: 760 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  /* Die Prüfbühne ist kurz; damit es etwas zu scrollen gibt, wird
     darunter Platz gemacht — sonst kann man die Klage gar nicht
     nachstellen. */
  await pg.evaluate(() => {
    const p = document.createElement("div");
    p.style.height = "1400px";
    document.body.appendChild(p);
  });

  console.log("\nUND WENN MAN SCROLLT?\n");
  const gescrollt = await pg.evaluate(async () => {
    window.DMA_PRUEF.effekt("schnee");
    await new Promise((f) => setTimeout(f, 120));
    window.scrollTo(0, 600);
    await new Promise((f) => requestAnimationFrame(() => requestAnimationFrame(f)));
    await new Promise((f) => setTimeout(f, 120));
    const b = document.getElementById("lcEffektBuehne");
    const karte = document.getElementById("livechatKarte");
    const kr = karte.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    return {
      oben: Math.round(br.top), karteOben: Math.round(kr.top),
      unten: Math.round(br.bottom), karteUnten: Math.round(kr.bottom),
      hoehe: Math.round(br.height), schirm: window.innerHeight
    };
  });
  pruefe("die Buehne wandert mit der Karte mit",
    gescrollt.oben >= Math.min(0, gescrollt.karteOben) - 1
    && gescrollt.oben <= Math.max(0, gescrollt.karteOben) + 1,
    "Buehne oben " + gescrollt.oben + ", Karte oben " + gescrollt.karteOben);
  pruefe("sie endet spaetestens am Kartenboden",
    gescrollt.unten <= gescrollt.karteUnten + 1,
    "Buehne unten " + gescrollt.unten + ", Karte unten " + gescrollt.karteUnten);
  pruefe("und nie hoeher als der Bildschirm", gescrollt.hoehe <= gescrollt.schirm + 1,
    gescrollt.hoehe + " px von " + gescrollt.schirm);

  /* Zurueck nach oben: der Rolltest davor laesst die Seite gescrollt
     stehen, und dann misst die naechste Runde die halbe Karte. */
  await pg.evaluate(() => window.scrollTo(0, 0));
  await pg.waitForTimeout(250);
  const namen = await pg.evaluate(() => window.DMA_PRUEF.effektNamen());
  console.log("\nJEDE ANIMATION AUF DER BUEHNE\n");
  let gezeichnet = 0, geprueft = 0, daneben = [];
  for (const name of namen) {
    const los = await pg.evaluate((n) => {
      document.querySelectorAll("#lcEffektBuehne > *").forEach((e) => e.remove());
      try { window.DMA_PRUEF.effekt(n); return true; } catch (e) { return String(e.message || e); }
    }, name);
    if (los !== true) { daneben.push(name + " (Ausnahme: " + los + ")"); continue; }
    await pg.waitForTimeout(90);
    const d = await pg.evaluate(() => {
      const b = document.getElementById("lcEffektBuehne");
      const karte = document.getElementById("livechatKarte");
      if (!karte) return { keineKarte: true };
      /* GEMESSEN WIRD GEGEN DEN LAYOUT-KASTEN DER KARTE.
         -----------------------------------------------------------
         Hier stand getBoundingClientRect() — der GEMALTE Kasten. Der
         rechnet jede laufende Animation mit: waehrend eine Karte
         gerade kleiner wird oder wackelt, ist er ein paar Pixel
         schmaler als die Karte wirklich ist, und die Buehne sah
         dadurch zu gross aus (gemessen 11 bis 22 px, wachsend, je
         weiter der Durchlauf kam).

         Seit Fassung 347 setzt sich die Buehne ABSICHTLICH nach dem
         Layout-Kasten und nicht nach dem gemalten: gewuenscht war
         „dass sich das Bild nicht mehr verschiebt durch die Dinos
         oder generell nie wieder durch irgendeine Einstellung". Eine
         Buehne, die jedem Wackeln folgt, verschiebt genau das.
         Verglichen wird deshalb mit demselben Mass, nach dem sie
         gesetzt wird. Was sie dabei nicht darf — groesser sein als
         die Karte —, prueft diese Sonde unveraendert weiter. */
      const kk = window.DMA_PRUEF.kartenKasten();
      const kr = kk ? kk.layout : karte.getBoundingClientRect();
      const br = b ? b.getBoundingClientRect() : null;
      return {
        kinder: b ? b.children.length : 0,
        buehneDa: Boolean(b),
        zuBreit: br ? Math.round(br.width - kr.width) : 0,
        zuHoch: br ? Math.round(br.height - kr.height) : 0,
        ueberOben: br ? Math.round(kr.top - br.top) : 0
      };
    });
    if (d.kinder > 0) {
      gezeichnet++;
      geprueft++;
      /* Vier Pixel Spiel: die Karte selbst aendert waehrend einer
         Animation ihre Masse um ein, zwei Pixel (ein Rollbalken
         kommt, eine Zeile waechst). Gemessen wird also nicht auf den
         Pixel genau, sondern ob eine Animation WIRKLICH hinausragt —
         vor dem Umbau waren es mehrere hundert. */
      if (d.zuBreit > 4 || d.zuHoch > 4 || d.ueberOben > 4) {
        daneben.push(name + " (breiter " + d.zuBreit + ", hoeher " + d.zuHoch
          + ", oben " + d.ueberOben + ")");
      }
    }
  }
  pruefe("Animationen haengen in der Buehne", gezeichnet > 25,
    gezeichnet + " von " + namen.length + " zeichnen etwas auf die Buehne");
  pruefe("keine ragt ueber die Klassenzimmer-Karte hinaus", daneben.length === 0,
    daneben.slice(0, 4).join(" · ") || "alle innerhalb");

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Die Animationen bleiben im Chat.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
