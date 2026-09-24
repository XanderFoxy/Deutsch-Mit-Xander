/* RUNDE 100 — gemessen werden nur die Schienen, auf denen die Lok FAEHRT.
   Der Rueckweg, der die Strecke zum Rundkurs schliesst (XANDER: „die Strecke
   immer automatisch und logisch geschlossen"), traegt „lc-lok-rund". */
/* =====================================================================
   SONDE RUNDE 85 — Xanders Liste vom 22. September, erster Teil
   ---------------------------------------------------------------------
     · keine Rueckstaende am verlassenen Platz (Name, Bild)
     · die Lok faehrt zum Ziel statt im Kreis, auf Gleisen
     · Pac-Man: Maul in Fahrtrichtung, Rueckweg, volles Feld, kein Ring
     · die Toene fuer Fahren, Laufen und das Los
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};
function tonDauer(name) {
  const roh = "/tmp/claude-0/pr85-" + name + ".raw";
  execFileSync(FFMPEG, ["-v", "error", "-i", path.join(WURZEL, "ton", name + ".opus"),
    "-f", "s16le", "-ar", "24000", "-ac", "1", roh, "-y"]);
  return fs.readFileSync(roh).length / 2 / 24000;
}

(async () => {
  console.log("RUNDE 85 — Rueckstaende, Lok, Pac-Man, Toene");
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

  /* =================================================================
     1. KEINE RUECKSTAENDE AM VERLASSENEN PLATZ
     ================================================================= */
  console.log("\nDer verlassene Platz");
  const reisen = ["feder", "kran", "flug", "lok", "boot", "heli", "pferd", "turm"];
  const reste = [];
  for (const art of reisen) {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate((a) => window.DMA_PRUEFUNG.wirkung(a, "8", "Alex"), art);
    await new Promise((f) => setTimeout(f, 1000));
    reste.push(Object.assign({ art: art }, await pg.evaluate(() => {
      const pl = document.querySelector('.lc-platz[data-lc-platz="1"]');
      const k = pl.querySelector(".lc-kreis");
      const n = pl.querySelector(".lc-platz-name");
      return { bild: +(+getComputedStyle(k).opacity).toFixed(2),
               name: n ? getComputedStyle(n).visibility : "-" };
    })));
    await new Promise((f) => setTimeout(f, 8000));
  }
  const bildDa = reste.filter((r) => r.bild > 0.02);
  sage(bildDa.length === 0,
    "das Profilbild ist nach einer Sekunde weg — kein Schrumpfen im Hintergrund",
    bildDa.length ? bildDa.map((r) => r.art + " " + r.bild).join(", ")
      : reisen.length + " Reisen geprueft");
  const nameDa = reste.filter((r) => r.name !== "hidden");
  sage(nameDa.length === 0, "und der Name steht nicht mehr am verlassenen Platz",
    nameDa.length ? nameDa.map((r) => r.art).join(", ") : "bei allen verborgen");

  /* =================================================================
     2. DIE LOK
     ================================================================= */
  console.log("\nDie Lok");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("lok", "8", "Alex"));
  await new Promise((f) => setTimeout(f, 220));
  const lok = await pg.evaluate(() => {
    const el = document.querySelector(".lc-lok");
    if (!el) return null;
    const an = el.getAnimations()[0];
    if (!an) return null;
    an.pause();
    const bahn = [];
    for (let ms = 0; ms <= 5600; ms += 60) {
      an.currentTime = ms;
      const r = el.getBoundingClientRect();
      bahn.push([r.left + r.width / 2, r.top + r.height / 2]);
    }
    const pl = [...document.querySelectorAll("#lcPlaetze .lc-platz")].map((p) => {
      const r = p.getBoundingClientRect();
      return { nr: +p.dataset.lcPlatz, x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    return { bahn: bahn, pl: pl,
             kreisR: document.querySelector(".lc-kreis").getBoundingClientRect().width / 2,
             schienen: document.querySelectorAll(".lc-lok-schiene:not(.lc-lok-rund)").length,
             schwellen: document.querySelectorAll(".lc-lok-schwelle:not(.lc-lok-rund)").length,
             boegen: [...document.querySelectorAll(".lc-lok-schiene:not(.lc-lok-rund)")]
               .filter((q) => /A/.test(q.getAttribute("d") || "")).length,
             buehne: !!document.querySelector(".lc-lok-buehne") };
  });
  if (!lok) { sage(false, "die Lok liess sich nicht messen"); }
  else {
    const lang = lok.bahn.slice(1).reduce((a, p, i) =>
      a + Math.hypot(p[0] - lok.bahn[i][0], p[1] - lok.bahn[i][1]), 0);
    const p1 = lok.pl.find((p) => p.nr === 1), p8 = lok.pl.find((p) => p.nr === 8);
    const luft = Math.hypot(p8.x - p1.x, p8.y - p1.y);
    /* Im Kreis hiess: mehr als doppelt so weit wie die Strecke. */
    sage(lang < luft * 1.6,
      "sie faehrt zum Ziel statt zwei Runden zu drehen",
      "Weg " + lang.toFixed(0) + " px, Luftlinie " + luft.toFixed(0) + " px");
    /* Und sie faehrt ueber die Felder, nicht daneben. */
    const ueber = [1, 2, 3, 4].map((nr) => {
      const g = lok.pl.find((p) => p.nr === nr);
      return Math.min(...lok.bahn.map((q) => Math.hypot(q[0] - g.x, q[1] - g.y)));
    });
    /* RUNDE 88 — FRUEHER STAND HIER „< 8 px", ALSO PRAKTISCH GENAU
       DURCH DIE MITTE. Das ging nur, solange die Lok an der Ecke einen
       rechten Winkel fuhr. Ein Kurvenmodul SCHNEIDET die Ecke — das
       ist keine Ungenauigkeit, das ist der Sinn einer Kurve. Gefordert
       ist deshalb jetzt, was Xander wirklich will: dass sie ueber das
       Bild faehrt. Gemessen am Bild selbst, nicht an einer erfundenen
       Zahl — der Abstand muss kleiner sein als die Haelfte des
       Bildradius, die Lok laeuft also deutlich innerhalb des
       Profilbildes. */
    const grenze = lok.kreisR * 0.5;
    sage(Math.max(...ueber) < grenze, "und dabei wirklich ueber die Sitzfelder",
      "groesster Abstand " + Math.max(...ueber).toFixed(1) + " px bei Bildradius "
        + lok.kreisR.toFixed(1) + " px (erlaubt bis " + grenze.toFixed(1) + ")");
    /* RUNDE 88 — DIESE REGEL VERLANGTE DIE SCHIEBEBUEHNE. Die gibt es
       nicht mehr, und das ist kein Rueckschritt: sie war der Ersatz
       fuer die Kurve, die Xander seitdem ausdruecklich verlangt hat —
       „dass die Gleise an den Eckpunkten, die ich einzeichne,
       realistische Kurvenmodule haben wie bei einer Modelleisenbahn."
       Die Regel prueft deshalb jetzt das Kurvenmodul statt der Buehne;
       gemessen wird es in pruefe-runde88-lok.js im Einzelnen. */
    sage(lok.schienen >= 2 && lok.schwellen >= 8 && lok.boegen >= 2 && !lok.buehne,
      "auf Gleisen mit Schwellen, und an der Ecke liegt ein Kurvenmodul",
      lok.schienen + " Schienen, " + lok.schwellen + " Schwellen, "
        + lok.boegen + " Bogenschienen");
  }
  await new Promise((f) => setTimeout(f, 6000));

  /* =================================================================
     3. PAC-MAN
     ================================================================= */
  console.log("\nPac-Man");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("pacjagd", "Emmi", "Alex"));
  await new Promise((f) => setTimeout(f, 220));
  const pac = await pg.evaluate(() => {
    const pl = document.querySelector('.lc-platz[data-lc-platz="1"]');
    const k = pl.querySelector(".lc-kreis");
    const an = k.getAnimations().find((a) => a.effect && a.effect.getKeyframes().length > 2);
    const svg = k.querySelector(".lc-pac-figur svg");
    const ar = svg ? svg.getAnimations()[0] : null;
    if (!an) return null;
    an.pause(); if (ar) ar.pause();
    const bahn = [], winkel = [];
    for (let ms = 0; ms <= 6000; ms += 50) {
      an.currentTime = ms; if (ar) ar.currentTime = ms;
      const r = k.getBoundingClientRect();
      bahn.push([r.left + r.width / 2, r.top + r.height / 2]);
      if (ar) {
        const m = new DOMMatrix(getComputedStyle(svg).transform);
        winkel.push(Math.round(Math.atan2(m.b, m.a) * 180 / Math.PI));
      }
    }
    const cs = getComputedStyle(k);
    return { bahn: bahn, winkel: winkel, schein: cs.boxShadow,
             krumen: document.querySelectorAll(".lc-pac-krume").length,
             bleiben: document.querySelectorAll(".lc-pac-krume-bleibt").length,
             name: getComputedStyle(pl.querySelector(".lc-platz-name")).visibility };
  });
  if (!pac) { sage(false, "Pac-Man liess sich nicht messen"); }
  else {
    let schraeg = 0;
    for (let i = 1; i < pac.bahn.length; i++) {
      const dx = Math.abs(pac.bahn[i][0] - pac.bahn[i - 1][0]);
      const dy = Math.abs(pac.bahn[i][1] - pac.bahn[i - 1][1]);
      if (dx > 3 && dy > 3) schraeg++;
    }
    sage(schraeg === 0,
      "er geht denselben Weg zurueck, nicht schraeg ueber das Feld",
      schraeg + " schraege Schritte");
    /* Im Original dreht sich Pac-Man nie weich: es gibt nur die vier
       Richtungen, keine Zwischenwinkel. */
    const krumm = pac.winkel.filter((w) => w % 90 !== 0).length;
    sage(krumm === 0, "sein Maul springt in die Fahrtrichtung, es dreht sich nicht weich",
      "Winkel: " + [...new Set(pac.winkel)].join(", "));
    /* =============================================================
       ZURUECKGENOMMEN IN RUNDE 87 — und zwar auf seinen Wunsch.
       In Runde 85 hiess es: „ich moechte auch, dass das ganze Feld
       mit Futterpunkten gefuellt ist, auch wenn er nicht alle
       auffrisst." Daraufhin lagen zusaetzlich Punkte ZWISCHEN den
       Plaetzen, und diese Regel verlangte mehr als zwoelf davon.
       In Runde 87 sagt er genauer: „beim Pac-Man sollen auch die
       Futterelemente nicht an Stellen sein, die keine
       Profil-Sitzplaetze sind." Das ist das Spaetere und das
       Genauere — also gilt es. Gefuellt ist das Feld weiterhin, aber
       eben dort, wo Plaetze sind: einer je Platz, acht insgesamt.
       Wo genau sie liegen, misst pruefe-runde87-pacman.js. */
    sage(pac.krumen === 8 && pac.bleiben >= 6,
      "auf jedem Platz liegt ein Punkt — und keiner dazwischen (Runde 87)",
      pac.krumen + " Punkte, davon " + pac.bleiben + " liegenbleibend");
    sage(pac.schein === "none" && pac.name === "hidden",
      "kein Leuchtring und kein Name — er IST Pac-Man",
      "Schein " + pac.schein + ", Name " + pac.name);
  }
  await new Promise((f) => setTimeout(f, 6000));

  /* =================================================================
     4. DIE TOENE
     ================================================================= */
  console.log("\nToene");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(fs.existsSync(path.join(WURZEL, "ton", "schritt.opus"))
    && Math.abs(tonDauer("schritt") - 0.26) < 0.05,
    "es gibt ein echtes Schrittgeraeusch",
    "schritt " + tonDauer("schritt").toFixed(2) + " s");
  sage(/spielzug:       \{ ton: "schritt"/.test(js),
    "und das Laufen benutzt es — nicht mehr den Comic-Boing");
  sage(/lcTonReise\("fahren", hin\);/.test(js),
    "das Fahrgeraeusch dauert so lange wie die Fahrt");
  sage(/lcGeraeusch\("slot", "lotto", 0\.55\);/.test(js)
    && /lcTonSpaeter\("bling", wann,/.test(js),
    "und das Los klingt nach Slotmaschine mit Klingeln");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
