#!/usr/bin/env node
/* =========================================================
   RUNDE 63 — MAULWURF VON OBEN, HAUTTON, RUTSCHENDER SCHNEE,
   SANDUHR AUF JEDEM EINZELNEN BILD
   ---------------------------------------------------------
   Vier Meldungen, vier Messungen:

   · „der gegrabene Maulwurfshuegel sieht auch nicht realistisch
     aus … das soll man von oben, von der Draufsicht."
   · „die Brueste bei dem Obst sind immer noch nicht hautfarben,
     sie sind immer noch gelb."
   · „die Spur kann besser animiert nach unten rutschen."
   · „Die Sanduhr soll auch im einzelnen Profilbild den Effekt
     haben, dass das Profilbild von oben nach unten durchlaeuft."
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
/* Farbton und Saettigung ausrechnen — „gelb" ist keine Meinung,
   sondern eine Zahl. */
function hsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255,
        g = parseInt(hex.slice(3, 5), 16) / 255,
        b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: ((h * 60) + 360) % 360, s: s * 100, l: l * 100 };
}
(async () => {
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");

  console.log("\nDER MAULWURFSHUEGEL VON OBEN\n");
  pruefe("es gibt einen Zeichner fuer die Draufsicht",
    /function lcMaulwurfVonOben\(\)/.test(js));
  pruefe("der Rand ist gewobbelt gerechnet, nicht rund gezeichnet",
    /Math\.sin\(i \* 2\.3 \+ saat\)/.test(js));
  pruefe("und er laeuft als weiche Kurve, nicht als Zackenkette",
    /d \+= " Q" \+ z\(p1\)/.test(js));
  pruefe("vier Raender von aussen nach innen",
    /lc-maulwurf-saum/.test(js) && /lc-maulwurf-kranz/.test(js)
    && /lc-maulwurf-trichter/.test(js) && /lc-maulwurf-loch/.test(js));
  pruefe("der Maulwurf selbst schaut heraus",
    /lc-maulwurf-ruessel/.test(js) && /lc-maulwurf-nasenloch/.test(js));
  pruefe("die Kuppel von der Seite ist weg",
    !/\.lc-maulwurf-erde\s*\{/.test(css));
  /* Von oben ist ein Huegel BREITER als hoch. Von der Seite war er
     0,9 zu 0,42 — das ist eine Kuppel. */
  const masse = (css.match(/\.lc-maulwurf \{[\s\S]{0,220}?\}/) || [""])[0];
  const br = (masse.match(/width:\s*calc\(var\(--gross[^)]*\) \* ([\d.]+)\)/) || [])[1];
  const ho = (masse.match(/height:\s*calc\(var\(--gross[^)]*\) \* ([\d.]+)\)/) || [])[1];
  pruefe("und der Huegel liegt flach wie eine Draufsicht",
    Number(br) > 0 && Number(ho) / Number(br) > 0.55,
    br + " breit auf " + ho + " hoch");

  console.log("\nDER HAUTTON\n");
  /* Genau IN dem Verlauf nachsehen, nicht irgendwo in der Datei —
     es gibt mehrere Verlaeufe mit einem Halt bei 55 %. */
  const verlauf = (js.match(/lcHautR63[\s\S]{0,620}?radialGradient>/) || [""])[0];
  /* Im Kommentar darf die alte Farbe stehenbleiben — gemeint ist,
     dass sie nicht mehr GEZEICHNET wird. */
  pruefe("das Gelb #f6c89a wird nirgends mehr gezeichnet",
    !/fill="#f6c89a"/i.test(js) && !/stop-color="#f6c89a"/i.test(js));
  /* RUNDE 97 NACHGEFUEHRT — XANDER: „Du hast die Hand noch nicht
     vereinheitlicht."
     Hier stand die Farbe frueher als fester Wert im Verlauf (#e9bda6).
     Genau das war das Problem: eine zweite Hautfamilie neben #eec0a8.
     Jetzt holt sich der Verlauf seine Farbe aus der einen Quelle
     (lcHaut(), gespeist aus --lc-haut in korrekturen.css). Geprueft
     wird deshalb ZWEIERLEI: dass der Verlauf wirklich von dort kommt,
     und dass der Wert dort auch ein Hautton IST — gerechnet, nicht
     geglaubt. Die Begruendung von Runde 63 gilt unveraendert: echte
     helle Haut liegt bei 20 bis 26 Grad Farbton und 35 bis 60 %
     Saettigung; #f6c89a hatte 30 Grad bei 84 % und sah nach Marzipan
     aus. */
  pruefe("der Verlauf holt die Farbe aus der einen Quelle",
    /<stop offset="55%" stop-color="' \+ lcHaut\(\)\.haut \+ '"/.test(verlauf),
    verlauf ? "im Verlauf lcHautR63 gefunden" : "Verlauf nicht gefunden");
  const hautWert = (css.match(/--lc-haut:\s*(#[0-9a-f]{6})/i) || [])[1];
  const f = hautWert ? hsl(hautWert) : null;
  pruefe("und dieser eine Wert ist ein Hautton, kein Marzipan",
    Boolean(f) && f.h >= 15 && f.h <= 28 && f.s >= 35 && f.s <= 72
      && f.l >= 60 && f.l <= 90,
    hautWert ? hautWert + " = " + f.h.toFixed(0) + " Grad, "
      + f.s.toFixed(0) + " % Saettigung, " + f.l.toFixed(0) + " % Helligkeit"
      : "--lc-haut nicht gefunden");

  console.log("\nDER SCHNEE RUTSCHT WIRKLICH HERUNTER\n");
  const klecks = (css.match(/@keyframes lcSchneeKlecks \{[\s\S]*?\n\}/) || [""])[0];
  const weiten = [...klecks.matchAll(/translateY\((-?[\d.]+)%\)/g)].map((m) => Number(m[1]));
  pruefe("der Klecks rutscht ueber ein Drittel des Bildes",
    weiten.length > 0 && Math.max.apply(null, weiten) >= 34,
    "weiteste Strecke " + (weiten.length ? Math.max.apply(null, weiten) : 0) + " %");
  const rinne = (css.match(/@keyframes lcSchneeRinne \{[\s\S]*?\n\}/) || [""])[0];
  const hoehen = [...rinne.matchAll(/height:\s*([\d.]+)%/g)].map((m) => Number(m[1]));
  pruefe("und die Schmiere waechst mit",
    hoehen.length > 0 && Math.max.apply(null, hoehen) >= 60,
    "laengste Spur " + (hoehen.length ? Math.max.apply(null, hoehen) : 0) + " %");

  console.log("\nDIE SANDUHR AUF EINEM EINZELNEN BILD\n");
  pruefe("das Zerrinnen ist ein eigener Handgriff geworden",
    /function lcSandZerrinnen\(platzEl\)/.test(js));
  pruefe("und es laeuft auch ohne Gegenueber",
    /return zerrinnenFuer\(lcZielPlaetze\(wen\)\);/.test(js));
  pruefe("der Tausch bleibt fuer den Fall uebereinander",
    /ab\.spalte !== zu\.spalte \|\| Math\.abs\(ab\.reihe - zu\.reihe\) !== 1/.test(js));

  /* Und jetzt im Browser: laeuft es wirklich? */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br2 = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br2.newPage({ viewport: { width: 900, height: 760 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const lauf = await pg.evaluate(async () => {
    const platz = document.querySelectorAll(".lc-platz")[1];
    const name = (platz.querySelector(".lc-platz-name") || {}).textContent || "";
    window.DMA_PRUEFUNG.wirkung("sanduhr", String(name).trim(), "");
    await new Promise((f) => setTimeout(f, 300));
    return {
      zerrinnt: document.querySelectorAll(".lc-kreis.lc-zerrinnt").length,
      sand: document.querySelectorAll(".lc-sandwerk").length,
      koerner: document.querySelectorAll(".lc-sandkorn").length
    };
  });
  pruefe("ein einzelnes Bild zerrinnt wirklich", lauf.zerrinnt >= 1,
    lauf.zerrinnt + " Bild(er)");
  pruefe("mit Sandwerk und Koernern", lauf.sand >= 1 && lauf.koerner >= 20,
    lauf.sand + " Schicht(en), " + lauf.koerner + " Koerner");

  await br2.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nRunde 63 sitzt.\n");
  process.exit(fehler ? 1 : 0);
})();
