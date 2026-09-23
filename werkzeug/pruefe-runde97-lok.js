#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 97 — DIE LOK STEHT AUF IHREM GLEIS
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Die Lokomotive hat immer noch keine
   Schienenfuehrung."

   Die Gleise waren da — gezeichnet aus denselben Modulen, auf denen
   die Lok faehrt. Was fehlte, war das VERHAELTNIS. Zwei Zahlen, beide
   am laufenden Bild nachgemessen:

     SPURWEITE   Das Gleis war 0,34 Platzbreiten breit, die Radkanten
                 der Lok standen 0,72 auseinander. Die Raeder liefen
                 also weit neben den Schienen. Ein Fahrzeug, dessen
                 Raeder neben dem Gleis stehen, wird von ihm nicht
                 gefuehrt — genau das sah man.
     LAENGE      Die Lok war 1,77 Platzbreiten lang, der Kurvenradius
                 eine halbe. Sie war damit laenger als der ganze
                 Kurvendurchmesser und konnte der Kurve gar nicht
                 folgen; sie legte sich quer darueber.

   Diese Sonde misst beides nach: den Abstand der Schienen gegen den
   Abstand der Radkanten, und die Laenge der Lok gegen den Radius.
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

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\nGLEIS UND LOK, IN PIXELN GEMESSEN\n");
  const mess = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("lok", "Emmi", "Alex", {});
    await new Promise((f) => setTimeout(f, 700));
    const gleis = document.querySelector(".lc-lok-gleis");
    const lok = document.querySelector(".lc-lok");
    if (!gleis || !lok) return { fehlt: true };
    const platz = document.querySelector(".lc-platz .lc-kreis");
    const d = platz ? platz.getBoundingClientRect().width : 0;

    /* Die Spurweite: die beiden Schienen eines GERADEN Stuecks liegen
       parallel; ihr Abstand ist die Spur. */
    const gerade = [...gleis.querySelectorAll(".lc-lok-schiene")]
      .map((p) => p.getAttribute("d"))
      .filter((s) => s.indexOf("A") < 0)
      .map((s) => s.match(/M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)/))
      .filter(Boolean)
      .map((m) => ({ x1: +m[1], y1: +m[2], x2: +m[3], y2: +m[4] }));
    let spurweite = 0;
    for (let i = 0; i < gerade.length; i++) {
      for (let k = i + 1; k < gerade.length; k++) {
        const a = gerade[i], b = gerade[k];
        const waag = Math.abs(a.y1 - a.y2) < 1 && Math.abs(b.y1 - b.y2) < 1;
        const senk = Math.abs(a.x1 - a.x2) < 1 && Math.abs(b.x1 - b.x2) < 1;
        if (waag && Math.abs(a.x1 - b.x1) < 1) spurweite = Math.abs(a.y1 - b.y1);
        else if (senk && Math.abs(a.y1 - b.y1) < 1 && !spurweite) spurweite = Math.abs(a.x1 - b.x1);
      }
    }

    /* Die Radkanten der Lok: in der Draufsicht die obere und die
       untere Reihe. Gemessen wird ihr Abstand auf dem Bildschirm. */
    const raeder = [...lok.querySelectorAll(".lc-lok-o-rad")];
    const kasten = lok.getBoundingClientRect();
    let obenY = Infinity, untenY = -Infinity;
    raeder.forEach((r) => {
      const b = r.getBoundingClientRect();
      obenY = Math.min(obenY, b.top + b.height / 2);
      untenY = Math.max(untenY, b.top + b.height / 2);
    });
    const radspur = raeder.length ? untenY - obenY : 0;

    /* Der Kurvenradius: aus dem Bogen-Pfad. */
    const bogen = [...gleis.querySelectorAll(".lc-lok-schiene")]
      .map((p) => p.getAttribute("d"))
      .filter((s) => s.indexOf("A") >= 0)
      .map((s) => Number(s.match(/A([\d.]+)/)[1]));
    const radius = bogen.length ? (Math.min.apply(null, bogen) + Math.max.apply(null, bogen)) / 2 : 0;

    return { d: d, spurweite: spurweite, radspur: radspur,
      lokLang: kasten.width, lokHoch: kasten.height, radius: radius,
      raeder: raeder.length };
  });

  if (mess.fehlt) { sage(false, "die Lok faehrt ueberhaupt"); }
  else {
    console.log("  Platzbreite " + mess.d.toFixed(0) + " px"
      + " | Spurweite " + mess.spurweite.toFixed(1)
      + " | Radkanten " + mess.radspur.toFixed(1)
      + " | Lok " + mess.lokLang.toFixed(0) + " x " + mess.lokHoch.toFixed(0)
      + " | Kurvenradius " + mess.radius.toFixed(1) + "\n");
    sage(mess.raeder >= 6, "die Lok hat ihre Radkanten", mess.raeder + " Stueck");
    const weg = Math.abs(mess.radspur - mess.spurweite);
    sage(weg <= mess.spurweite * 0.12,
      "die Raeder stehen AUF den Schienen, nicht daneben",
      weg.toFixed(1) + " px Unterschied");
    sage(mess.lokLang <= mess.radius * 2.4,
      "und die Lok ist kuerzer als ihre Kurve es verlangt",
      "Lok " + mess.lokLang.toFixed(0) + " px, Kurvendurchmesser "
        + (mess.radius * 2).toFixed(0) + " px");
  }

  /* =====================================================================
     UND JETZT DIE FUEHRUNG SELBST: BLEIBT SIE WAEHREND DER FAHRT AUF
     DEM GLEIS?
     ---------------------------------------------------------------------
     Die beiden Zahlen oben sagen, dass Lok und Gleis zusammenpassen.
     Sie sagen noch nicht, dass sie waehrend der Fahrt auch daraufbleibt
     — gerade in der Kurve. Deshalb wird die Mitte der Lok Bild fuer
     Bild gegen die naechstgelegene Schiene gemessen. Der Abstand muss
     ungefaehr die halbe Spurweite sein und darf sich nicht veraendern:
     genau das heisst „gefuehrt".
     ===================================================================== */
  console.log("\nDIE FAHRT — ABSTAND ZUR SCHIENE, BILD FUER BILD\n");
  const fahrt = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("lok", "Emmi", "Alex", {});
    await new Promise((f) => setTimeout(f, 600));
    const spur = [];
    for (let i = 0; i < 14; i++) {
      await new Promise((f) => setTimeout(f, 200));
      const lok = document.querySelector(".lc-lok");
      const gleis = document.querySelector(".lc-lok-gleis");
      if (!lok || !gleis) { spur.push(null); continue; }
      const lb = lok.getBoundingClientRect(), gb = gleis.getBoundingClientRect();
      const mx = lb.left + lb.width / 2, my = lb.top + lb.height / 2;
      let nah = Infinity;
      gleis.querySelectorAll(".lc-lok-schiene").forEach((pfad) => {
        const lang = pfad.getTotalLength();
        for (let k = 0; k <= 24; k++) {
          const pt = pfad.getPointAtLength(lang * k / 24);
          const d = Math.hypot(gb.left + pt.x - mx, gb.top + pt.y - my);
          if (d < nah) nah = d;
        }
      });
      spur.push(Math.round(nah));
    }
    return spur.filter((x) => x !== null);
  });
  console.log("  " + fahrt.join("  ") + " px\n");
  const grosster = Math.max.apply(null, fahrt);
  const kleinster = Math.min.apply(null, fahrt);
  sage(fahrt.length >= 8, "die Lok faehrt wirklich", fahrt.length + " Messpunkte");
  sage(grosster - kleinster <= 8,
    "und ihre Mitte bleibt die ganze Fahrt ueber gleich weit von der Schiene",
    kleinster + " bis " + grosster + " px");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
