/* =====================================================================
   SONDE RUNDE 99 — DAS AUFGERAEUMTE MENUE
   ---------------------------------------------------------------------
   XANDER (23.09.2026):
   „Das Menue koennte man noch ein bisschen aufraeumen … Kategorien:
    Werfen, Eklig, Schmutzig, und Sauber machen oder Reparieren."
   „In jedem Untermenue sollte auch stehen ,fuer alle' mit so einem
    Haekchen … und dann kann man einzelne wieder abwaehlen, die das
    nicht abbekommen sollen."

   GEMESSEN WIRD:
     1. Die vier Kategorien stehen da — und die Kacheln, die
        hineingewandert sind, stehen NICHT mehr zusaetzlich oben.
        Sonst waere das Menue laenger geworden statt kuerzer.
     2. Unter einer Kategorie stehen genau ihre Kacheln.
     3. Eine Kategorie darf selbst ein Untermenue haben (Spruehdose
        unter „Schmutzig") — sonst gaebe es die Kategorien nicht.
     4. Das Haekchen „fuer alle" steht in jedem Untermenue, und was
        danach hinausgeht, wird WOERTLICH nachgelesen:
          ohne Haekchen        „... wirft den Bumerang nach Bea"
          mit Haekchen         „... wirft den Bumerang — ALLE auf einmal"
          einer abgewaehlt     „... nach Alex, Bea, Dana, Emmi" — ohne Cem
     Gelesen wird die ZEILE, die im Chat landet: also das, was jeder im
     Raum wirklich zu sehen bekommt, und nicht der Befehl, den ich
     selbst abgeschickt habe. Genau dort faellt auf, wenn ein Name
     unterwegs verlorengeht.
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

/* Wer wohin gewandert ist — dieselbe Liste wie in app.js. Steht sie
   hier noch einmal, faellt es auf, wenn jemand nur eine der beiden
   Stellen aendert. */
const GRUPPEN = {
  /* ZWEITER ANLAUF (Walkie-Talkie): „Pfeil und Zwille sind Schusseffekte,
     die koennen einzeln aussen bleiben, und Eimer und Sahne auch." */
  "Werfen": ["Bumerang", "Ei", "Katapult"],
  "Eklig": ["Spucken", "Vogel"],
  "Schmutzig": ["Paint", "Sprühdose"],
  /* Walkie-Talkie: „bei Putzen ist die Birne mit untergebracht, das
     macht keinen Sinn." */
  "Sauber machen": ["Putzen", "Wischer"],
  /* XANDER: „Das Frivole und das Sexy koenntest du auch mal sammeln,
     das kann ein Untermenue sein." */
  "Frivol": ["Ups!", "Klaps"]
};

(async () => {
  console.log("RUNDE 99 — das aufgeraeumte Menue\n");
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
  const pg = await br.newPage({ viewport: { width: 900, height: 1000 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne
    && window.DMA_PRUEFUNG && window.LiveChat, { timeout: 25000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.waitForTimeout(250);

  /* Das Menue eines FREMDEN Platzes — Platz 2 ist Bea. */
  const menueAuf = () => pg.evaluate(() => {
    document.getElementById("lcPlatzMenue")?.remove();
    const p = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="2"]');
    window.DMA_PRUEFUNG.platzMenue(p);
    return [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")]
      .map((e) => e.textContent.trim());
  });
  const klick = (wort) => pg.evaluate((w) => {
    const b = [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-knopf")]
      .find((x) => (x.querySelector(".lc-platzmenue-wort") || {}).textContent.trim() === w);
    if (!b) return false;
    b.click();
    return true;
  }, wort);
  const woerter = () => pg.evaluate(() =>
    [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")]
      .map((e) => e.textContent.trim()));

  console.log("1  DIE VIER KATEGORIEN\n");
  const oben = await menueAuf();
  Object.keys(GRUPPEN).forEach((g) => {
    sage(oben.indexOf(g) >= 0, "Die Kategorie „" + g + "“ steht im Menue");
  });
  let doppelt = [];
  Object.keys(GRUPPEN).forEach((g) => {
    GRUPPEN[g].forEach((m) => { if (oben.indexOf(m) >= 0) doppelt.push(m); });
  });
  sage(doppelt.length === 0,
    "Keine einsortierte Kachel steht zusaetzlich noch oben",
    doppelt.length ? "noch oben: " + doppelt.join(", ") : oben.length + " Kacheln oben");
  const gewandert = Object.keys(GRUPPEN).reduce((n, g) => n + GRUPPEN[g].length, 0);
  console.log("     " + gewandert + " Kacheln sind in die vier Kategorien gewandert,"
    + " die oberste Ebene hat jetzt " + oben.length + " Eintraege");

  console.log("\n2  WAS UNTER DEN KATEGORIEN STEHT\n");
  for (const g of Object.keys(GRUPPEN)) {
    await menueAuf();
    await klick(g);
    await pg.waitForTimeout(60);
    const drin = await woerter();
    const fehlt = GRUPPEN[g].filter((m) => drin.indexOf(m) < 0);
    sage(fehlt.length === 0, "„" + g + "“ enthält alle seine Kacheln",
      fehlt.length ? "fehlt: " + fehlt.join(", ") : drin.length + " Einträge");
  }

  console.log("\n3  EIN UNTERMENUE IM UNTERMENUE\n");
  await menueAuf();
  await klick("Schmutzig");
  await pg.waitForTimeout(60);
  const ok3 = await klick("Sprühdose");
  await pg.waitForTimeout(60);
  const motive = await woerter();
  sage(ok3 && motive.length >= 10,
    "Die Sprühdose klappt unter „Schmutzig“ noch einmal auf",
    motive.length + " Motive");

  console.log("\n4  „FUER ALLE“ UND DIE AUSNAHMEN\n");
  const letzteZeile = () => pg.evaluate(() => {
    const z = window.LiveChat.pruefZeilen(6) || [];
    return z[z.length - 1] || "";
  });
  const senden = async (wie) => {
    await menueAuf();
    await klick("Werfen");
    await pg.waitForTimeout(60);
    const stand = await pg.evaluate((w) => {
      const alle = document.querySelector("#lcPlatzMenue .lc-menue-alle-haken");
      if (!alle) return { hat: false };
      if (w.alle) {
        alle.click();
        alle.dispatchEvent(new Event("change", { bubbles: true }));
      }
      const namen = [...document.querySelectorAll("#lcPlatzMenue .lc-menue-ausnahme input")]
        .map((e) => e.dataset.lcWen);
      if (w.ohne) {
        const h = [...document.querySelectorAll("#lcPlatzMenue .lc-menue-ausnahme input")]
          .find((e) => e.dataset.lcWen === w.ohne);
        if (h) { h.checked = false; h.dispatchEvent(new Event("change", { bubbles: true })); }
      }
      return { hat: true, namen: namen,
               sichtbar: !document.querySelector("#lcPlatzMenue .lc-menue-ausnahmen").hidden };
    }, wie);
    await klick("Bumerang");
    await pg.waitForTimeout(140);
    return { stand: stand, zeile: await letzteZeile() };
  };

  const a1 = await senden({});
  sage(a1.stand.hat, "Das Häkchen „für alle“ steht im Untermenü");
  sage(a1.zeile.indexOf("nach Bea") > 0 && a1.zeile.indexOf("Cem") < 0
    && a1.zeile.indexOf("ALLE") < 0,
    "Ohne Häkchen trifft es genau die eine Person", "„" + a1.zeile + "“");

  const a2 = await senden({ alle: true });
  sage(a2.stand.sichtbar === true,
    "Mit Häkchen klappt die Namensliste auf",
    (a2.stand.namen || []).length + " Namen: " + (a2.stand.namen || []).join(", "));
  sage(a2.zeile.indexOf("ALLE auf einmal") > 0,
    "Mit Häkchen geht es an alle", "„" + a2.zeile + "“");

  const a3 = await senden({ alle: true, ohne: "Cem" });
  const ohneCem = a3.zeile.indexOf("Bumerang") > 0
    && a3.zeile.indexOf("Cem") < 0
    && a3.zeile.indexOf("Bea") > 0 && a3.zeile.indexOf("Dana") > 0
    && a3.zeile.indexOf("Emmi") > 0 && a3.zeile.indexOf("ALLE") < 0;
  sage(ohneCem, "Ein Abgewählter fällt wirklich heraus",
    "„" + a3.zeile + "“");

  /* ---------------------------------------------------------------
     5  DAS FRIVOLE: DREI ARTEN, UND MANN ODER FRAU
     ---------------------------------------------------------------
     XANDER: „der BH kann hinten aufgehen, oder ueber den Kopf, oder
     vorne auf — und je nachdem, ob das ein Mann oder eine Frau ist."
     Gemessen wird der NAME der laufenden Animation (drei verschiedene
     muessen es sein, sonst waere es dreimal dasselbe mit drei Namen
     im Menue) und, bei einem Mann, ob wirklich ein Unterhemd statt
     eines BHs erscheint.
     --------------------------------------------------------------- */
  console.log("\n5  DAS FRIVOLE — DREI ARTEN, MANN ODER FRAU\n");
  const bhStand = async (art, geschlecht) => {
    await pg.evaluate((g) => {
      document.querySelectorAll(".lc-entbl").forEach((e) => e.remove());
      const p = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="2"]');
      if (g) p.dataset.lcGeschlecht = g; else delete p.dataset.lcGeschlecht;
    }, geschlecht || "");
    await pg.evaluate((a) => window.DMA_PRUEFUNG.wirkung("entbloessung", "Bea", "Alex",
      a ? { wie: a } : null), art || "");
    await pg.waitForTimeout(200);
    return pg.evaluate(() => {
      const bh = document.querySelector(".lc-entbl-bh");
      if (!bh) return null;
      return {
        klasse: bh.className,
        animation: getComputedStyle(bh).animationName,
        hemd: bh.className.indexOf("lc-entbl-hemd") >= 0,
        /* Was darunter zum Vorschein kommt: zwei grosse Kreise (Frau)
           oder ein Brustkorb mit Haaren (Mann). */
        kreise: document.querySelectorAll(".lc-entbl-comic circle").length
      };
    });
  };
  const bhH = await bhStand("hinten", "");
  const bhO = await bhStand("oben", "");
  const bhV = await bhStand("vorn", "");
  const bhStd = await bhStand("", "");
  sage(bhH && bhO && bhV, "Alle drei Arten lassen sich ausl\u00f6sen");
  if (bhH && bhO && bhV && bhStd) {
    const namen = [bhH.animation, bhO.animation, bhV.animation];
    sage(new Set(namen).size === 3, "Es sind wirklich DREI verschiedene Bewegungen",
      namen.join(" / "));
    sage(bhStd.animation === bhH.animation,
      "Ohne Angabe bleibt es bei \u201ehinten\u201c \u2014 wie seit Runde 73",
      bhStd.animation);
  }
  const bhM = await bhStand("hinten", "mann");
  const bhF = await bhStand("hinten", "frau");
  if (bhM && bhF) {
    sage(bhM.hemd === true && bhF.hemd === false,
      "Beim Mann ist es ein Unterhemd, bei der Frau ein BH",
      "Mann " + bhM.klasse + " | Frau " + bhF.klasse);
    sage(bhM.kreise < bhF.kreise,
      "Und darunter kommt nicht dasselbe zum Vorschein",
      "Mann " + bhM.kreise + " Kreise, Frau " + bhF.kreise);
  }
  await pg.evaluate(() => {
    const p = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="2"]');
    delete p.dataset.lcGeschlecht;
  });

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
