/* =====================================================================
   SONDE RUNDE 88 — DER MAULWURF BRICHT DIE PLAETZE AUF
   ---------------------------------------------------------------------
   XANDER: „Die Striche und Positionsnummer soll immer von jeglicher
   Animation ausbleiben, es sei denn ich sag es ausdruecklich wie zum
   Beispiel beim Maulwurfhuegel. Dort hast du das wieder rausgenommen?
   Offenbar dort sollen die Plaetze richtig aufgebrochen werden."
   XANDER: „die Maulwurfhuegel, die im uebrigen immer noch nicht
   aufgeschuettet werden an dem Profilnummern — da sollen diese
   Profilnummern durcheinandergebracht werden … Wenn es leere Plaetze
   sind, dann sollen die Strichlinie und Zahlen durcheinandergebracht
   werden, also dass da wirklich das mit sich umkippt realistisch, und
   wenn dort Leute sitzen, dass die entsprechend auch
   durcheinandergebracht werden … dann koennten sie vielleicht auf den
   Kopf stehen oder so, aber trotzdem mit Erde bisschen gehaeuft
   werden."

   Gemessen wird an der laufenden Animation:
   · Welche Plaetze werden ueberhaupt aufgebrochen — und vor allem:
     WIRD der eigene Platz ueberhaupt untergraben? (Der alte
     Rechenfehler mit den zwei Nullpunkten liess ihn aus.)
   · Wie weit kippt die Zahl auf einem freien Platz, und steht sie am
     Ende wieder genau gerade?
   · Steht ein besetzter Platz zwischendurch wirklich auf dem Kopf —
     also 180 Grad?
   · Liegt Erde AUF dem Platz, und zwar mehr als eine Krume?
   · Und ist hinterher alles wieder wie vorher?
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
/* Der Drehwinkel aus einer Matrix, in Grad von -180 bis 180. */
const winkelAus = (m) => {
  if (!m || m === "none") return 0;
  const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
  return Number((Math.atan2(z[1], z[0]) * 180 / Math.PI).toFixed(1));
};

(async () => {
  console.log("RUNDE 88 — Der Maulwurf bricht die Plaetze auf\n");
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

  const graben = async (von, ziel) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate(([v, z]) => window.DMA_PRUEFUNG.wirkung("maulwurf", z, v, {}), [von, ziel]);
    await pg.waitForTimeout(80);
  };
  /* Ein Blick auf alle Plaetze zu einem Zeitpunkt. */
  const blick = () => pg.evaluate(() => {
    return Array.from(document.querySelectorAll("#lcPlaetze .lc-platz")).map((p) => {
      const nr = p.querySelector(".lc-nummer");
      const kr = p.querySelector(".lc-kreis");
      const dreh = (el) => {
        if (!el) return null;
        const m = getComputedStyle(el).transform;
        if (!m || m === "none") return 0;
        const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
        return Number((Math.atan2(z[1], z[0]) * 180 / Math.PI).toFixed(1));
      };
      return { nr: p.dataset.lcPlatz || "?",
               frei: p.classList.contains("lc-platz-frei"),
               untergraben: p.classList.contains("lc-platz-untergraben"),
               umgekippt: p.classList.contains("lc-platz-umgekippt"),
               kopfueber: p.classList.contains("lc-platz-kopfueber"),
               erde: p.querySelectorAll(".lc-erdwurf").length,
               erdeSichtbar: Array.from(p.querySelectorAll(".lc-erdwurf"))
                 .filter((e) => Number(getComputedStyle(e).opacity) > 0.5).length,
               zahlDreh: dreh(nr),
               kreisDreh: dreh(kr),
               ebene: getComputedStyle(p).zIndex };
    });
  });
  const verlauf = async (zeiten) => {
    const aus = [];
    let letzt = 0;
    for (const t of zeiten) {
      await pg.waitForTimeout(t - letzt); letzt = t;
      aus.push({ t: t, plaetze: await blick() });
    }
    return aus;
  };
  const platz = (m, nr) => m.plaetze.find((p) => p.nr === String(nr));

  /* =================================================================
     1. DER EIGENE PLATZ WIRD UEBERHAUPT UNTERGRABEN
     ================================================================= */
  console.log("DER RECHENFEHLER MIT DEN ZWEI NULLPUNKTEN\n");
  await graben("Alex", "7");
  const frueh = await verlauf([300, 900]);
  sage(platz(frueh[0], 1).untergraben || platz(frueh[1], 1).untergraben,
    "der Platz, von dem aus gegraben wird, wird auch untergraben",
    "Platz 1: " + [0, 1].map((i) => (platz(frueh[i], 1).untergraben ? "ja" : "nein")).join(" / "));
  await pg.waitForTimeout(4000);

  /* =================================================================
     2. FREIE PLAETZE: STRICHLINIE UND ZAHL KIPPEN UM
     ================================================================= */
  console.log("\nFREIE PLAETZE — „dass da wirklich das mit sich umkippt\"\n");
  /* Emmi sitzt auf Platz 5, Platz 8 liegt in derselben Reihe rechts
     aussen — dazwischen liegen die freien Plaetze 6 und 7. */
  await graben("Emmi", "8");
  const frei = await verlauf([700, 1000, 1300, 1600, 1900, 2300, 2700, 3200, 4600]);
  const kipper = frei.some((m) => platz(m, 6).umgekippt) && frei.some((m) => platz(m, 7).umgekippt);
  sage(kipper, "beide freien Plaetze auf dem Weg werden aufgebrochen",
    "6: " + frei.filter((m) => platz(m, 6).umgekippt).length + " Messpunkte, 7: "
      + frei.filter((m) => platz(m, 7).umgekippt).length);
  const zahl6 = frei.map((m) => platz(m, 6).zahlDreh);
  const maxKipp = Math.max.apply(null, zahl6.map(Math.abs));
  sage(maxKipp > 25, "und die Zahl kippt dabei wirklich um, nicht nur ein Zittern",
    "groesster Winkel " + maxKipp.toFixed(1) + " Grad   (" + zahl6.join(" ") + ")");
  const ring6 = frei.map((m) => platz(m, 6).kreisDreh);
  sage(Math.max.apply(null, ring6.map(Math.abs)) > 4,
    "die gestrichelte Linie kippt mit",
    "groesster Winkel " + Math.max.apply(null, ring6.map(Math.abs)).toFixed(1) + " Grad");
  const erde6 = Math.max.apply(null, frei.map((m) => platz(m, 6).erdeSichtbar));
  sage(erde6 >= 4, "und es liegt Erde AUF dem Platz — an der Nummer, nicht nur daneben",
    erde6 + " Klumpen gleichzeitig sichtbar");
  sage(frei.some((m) => Number(platz(m, 6).ebene) > 1),
    "solange er aufgebrochen wird, liegt der Platz vor den Erdhaufen der Spur",
    "z-index " + frei.map((m) => platz(m, 6).ebene).join(" "));
  const zuletzt = frei[frei.length - 1];
  sage(!platz(zuletzt, 6).umgekippt && !platz(zuletzt, 6).untergraben
       && platz(zuletzt, 6).erde === 0 && Math.abs(platz(zuletzt, 6).zahlDreh) < 0.5,
    "hinterher ist der Platz wieder genau wie vorher — aufbrechen ja, kaputtmachen nein",
    "nach " + zuletzt.t + " ms: Erde " + platz(zuletzt, 6).erde + ", Zahl "
      + platz(zuletzt, 6).zahlDreh + " Grad");
  await pg.waitForTimeout(2500);

  /* =================================================================
     3. BESETZTE PLAETZE: DIE LEUTE STEHEN AUF DEM KOPF
     ================================================================= */
  console.log("\nBESETZTE PLAETZE — „dann koennten sie auf den Kopf stehen\"\n");
  /* Der gemalte Weg 1-2-3-7 fuehrt genau unter Bea (2) und Cem (3)
     hindurch. */
  await graben("Alex", "1-2-3-7");
  const leute = await verlauf([700, 1100, 1500, 1900, 2300, 2700, 3100, 3600, 5200]);
  sage(leute.some((m) => platz(m, 2).kopfueber) && leute.some((m) => platz(m, 3).kopfueber),
    "wer auf dem Weg sitzt, wird durcheinandergebracht",
    "Bea: " + leute.filter((m) => platz(m, 2).kopfueber).length + " Messpunkte, Cem: "
      + leute.filter((m) => platz(m, 3).kopfueber).length);
  const dreh2 = leute.map((m) => platz(m, 2).kreisDreh);
  const kopf = dreh2.some((w) => Math.abs(Math.abs(w) - 180) < 25);
  sage(kopf, "und steht dabei wirklich einmal auf dem Kopf (180 Grad)",
    dreh2.join(" "));
  const erde2 = Math.max.apply(null, leute.map((m) => platz(m, 2).erdeSichtbar));
  sage(erde2 >= 3, "auch auf ihm liegt Erde",
    erde2 + " Klumpen gleichzeitig sichtbar");
  /* Ein besetzter Platz darf NICHT wie ein freier aussehen: sein
     Rahmen bleibt durchgezogen. */
  const randStil = await pg.evaluate(() => {
    const p = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="2"] .lc-kreis');
    return p ? getComputedStyle(p).borderStyle : "";
  });
  sage(!/dashed/.test(randStil),
    "sein Rahmen bleibt durchgezogen — er soll nicht aussehen wie ein leerer Platz",
    "border-style: " + randStil);
  const letzteL = leute[leute.length - 1];
  sage(!platz(letzteL, 2).kopfueber && platz(letzteL, 2).erde === 0
       && Math.abs(platz(letzteL, 2).kreisDreh) < 0.5,
    "und danach sitzt er wieder richtig herum",
    "nach " + letzteL.t + " ms: " + platz(letzteL, 2).kreisDreh + " Grad, Erde "
      + platz(letzteL, 2).erde);

  /* =================================================================
     4. UND DIE PLAETZE DANEBEN BLEIBEN IN RUHE
     ================================================================= */
  console.log("\nUND WAS NICHT AUF DEM WEG LIEGT, BLEIBT IN RUHE\n");
  const fern = leute.map((m) => platz(m, 4));
  sage(fern.every((p) => !p.umgekippt && !p.kopfueber && p.erde === 0),
    "Dana sitzt neben dem Weg und bleibt unberuehrt",
    "aufgebrochen an " + fern.filter((p) => p.umgekippt || p.kopfueber).length
      + " von " + fern.length + " Messpunkten");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Punkt(e) offen" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
