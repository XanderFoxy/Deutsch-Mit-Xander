#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DER APPLAUS
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Wir brauchen noch eine Applaus Animation mit
   klatschen den Haenden, wenn jemand etwas schoenes macht."

   GEMESSEN WIRD, was man sehen und hoeren muss:
     1  Zwei Haende, GEZEICHNET (Hautton aus lcHaut), keine Emoji.
     2  Sie treffen sich wirklich — der Abstand zwischen ihnen geht auf
        null und wieder auseinander, und das sechsmal.
     3  Sechs Klatscher sind auch sechsmal zu hoeren.
     4  Danach ist nichts uebrig: keine Hand bleibt am Bild kleben.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

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

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push((this.currentSrc || this.src || "").split("/").pop()
        .split("?")[0].replace(/\.(opus|m4a|mp3)$/, ""));
      return ap.call(this);
    };
  });

  console.log("\nWAS BEIM APPLAUS PASSIERT\n");
  const mess = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.__toene = [];
    const haut = (window.LC_HAUT && window.LC_HAUT()) || {};
    window.DMA_PRUEFUNG.wirkung("applaus", "Bea", "Alex", {});
    await new Promise((f) => setTimeout(f, 90));
    const schicht = document.querySelector(".lc-applaus");
    const li = document.querySelector(".lc-applaus-links .lc-applaus-schwung");
    const re = document.querySelector(".lc-applaus-rechts .lc-applaus-schwung");
    const da = { schicht: Boolean(schicht), haende: document.querySelectorAll(".lc-applaus-hand").length,
      svg: document.querySelectorAll(".lc-applaus-hand svg").length,
      emoji: /👏/.test(schicht ? schicht.textContent : ""),
      hautImBild: schicht ? (schicht.innerHTML.indexOf(haut.haut || "#x") >= 0) : false,
      haut: haut.haut || "-", knall: document.querySelectorAll(".lc-applaus-knall i").length };
    /* Der Abstand zwischen den beiden Haenden, Bild fuer Bild. */
    const abstaende = [];
    const bis = performance.now() + 2100;
    while (performance.now() < bis) {
      if (li && re && li.isConnected) {
        const a = li.getBoundingClientRect(), b = re.getBoundingClientRect();
        abstaende.push(Math.round(b.left - a.right));
      }
      await new Promise((f) => requestAnimationFrame(f));
    }
    await new Promise((f) => setTimeout(f, 900));
    return { da: da, abstaende: abstaende, toene: (window.__toene || []).slice(),
      uebrig: document.querySelectorAll(".lc-applaus").length };
  });

  const d = mess.da;
  sage(d.schicht, "der Applaus liegt wirklich am Platz");
  sage(d.haende === 2, "es sind ZWEI Haende", d.haende + " Haende");
  sage(d.svg === 2, "und beide sind gezeichnet, nicht getippt", d.svg + " Zeichnungen");
  sage(!d.emoji, "kein Emoji-Haendchen mehr");
  sage(d.hautImBild, "sie haben den Hautton des Hauses", d.haut);
  sage(d.knall === 6, "und beim Treffer spritzt Luft heraus", d.knall + " Striche");

  const ab = mess.abstaende;
  const min = Math.min.apply(null, ab), max = Math.max.apply(null, ab);
  sage(ab.length > 40, "die Bewegung laeuft wirklich", ab.length + " Bilder gemessen");
  sage(min <= 2, "die Haende treffen sich", "engster Abstand " + min + " px");
  sage(max - min > 20, "und gehen auch wieder auseinander",
    "weitester Abstand " + max + " px");
  /* Wie oft der Abstand seinen Tiefpunkt erreicht = wie oft geklatscht
     wird. Gezaehlt werden die Durchgaenge unter der halben Strecke. */
  const schwelle = min + (max - min) * 0.25;
  let schlaege = 0, drin = false;
  ab.forEach((x) => {
    if (!drin && x <= schwelle) { schlaege++; drin = true; }
    else if (drin && x > schwelle) drin = false;
  });
  sage(schlaege >= 5, "und das mehrfach hintereinander", schlaege + " Klatscher gesehen");

  const klatscher = mess.toene.filter((t) => t === "klatsch").length;
  sage(klatscher >= 5, "jeder Klatscher ist auch zu hoeren",
    klatscher + "× klatsch (" + mess.toene.join(", ") + ")");
  sage(mess.toene.indexOf("jubel") >= 0, "und ein kurzer Jubel liegt darueber",
    mess.toene.join(", "));
  sage(mess.uebrig === 0, "danach klebt keine Hand mehr am Bild",
    mess.uebrig + " Reste");

  /* Ein Bild fuer das Auge. */
  await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("applaus", "Bea", "Alex", {});
  });
  await pg.waitForTimeout(150);
  const el = await pg.$("#lcPlaetze");
  if (el) await el.screenshot({ path: "/tmp/claude-0/applaus.png" });

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
