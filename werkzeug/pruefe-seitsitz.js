#!/usr/bin/env node
/* =========================================================
   PRUEFT DIE ELFTE HALTUNG: SEITLICHES SITZEN
   ---------------------------------------------------------
   GEWUENSCHT: „Das seitliche Sitzen … ich moechte die Originale
   haben und dann auf der Basis weiterarbeiten."

   Genau so ist sie gemacht: nichts neu gezeichnet, sondern
   „liegen" aufgerichtet und „krabbeln" ins Sitzen gedreht,
   beide an der Hueftmitte. Diese Sonde misst nach, ob dabei
   wirklich ein Sitzender herauskommt — und ob die zehn alten
   Haltungen unangetastet bleiben.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const fs = require("fs");
const path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYPEN = ["saeugling-m", "saeugling-w", "kleinkind-m", "kleinkind-w",
  "kind-m", "kind-w", "jugendlich-m", "jugendlich-w",
  "erwachsen-m", "erwachsen-w", "alt-m", "alt-w"];

let fehler = 0;
function pruefe(was, gut, zusatz) {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
}

(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 400, height: 400 } });
  await pg.setContent("<body></body>");

  console.log("\nDIE HALTUNG GIBT ES — UND ZWAR VOLLSTAENDIG\n");
  const zeilen = [];
  for (const typ of TYPEN) {
    await pg.evaluate(() => { window.DMA_FIGUR = {}; delete window.DMA_SEITSITZ_BAUEN; });
    for (const s of ["", "-teil2", "-teil3"]) {
      await pg.addScriptTag({ content: fs.readFileSync(path.join(WURZEL, "figuren", typ + s + ".js"), "utf8") });
    }
    /* Vorher merken, damit sich beweisen laesst, dass die alten
       Haltungen nicht angefasst werden. */
    const vorher = await pg.evaluate((typ) => {
      const H = window.DMA_FIGUR[typ].haltungen, o = {};
      Object.keys(H).forEach((k) => { o[k] = H[k].koerper.length; });
      return o;
    }, typ);

    await pg.addScriptTag({ content: fs.readFileSync(path.join(WURZEL, "figuren", "seitsitz.js"), "utf8") });
    await pg.evaluate((typ) => window.DMA_SEITSITZ_BAUEN(typ), typ);

    const erg = await pg.evaluate((typ) => {
      const H = window.DMA_FIGUR[typ].haltungen, h = H.sitzen_seit;
      if (!h) return null;
      const alt = {};
      Object.keys(H).forEach((k) => { if (k !== "sitzen_seit") alt[k] = H[k].koerper.length; });
      /* Nachmessen, was wirklich gezeichnet wird. */
      const ns = "http://www.w3.org/2000/svg";
      const kasten = (inh) => {
        const s = document.createElementNS(ns, "svg");
        s.setAttribute("viewBox", "-300 -300 600 600");
        s.style.cssText = "position:absolute;left:-9999px;width:600px";
        s.innerHTML = (window.DMA_FIGUR_DEFS || "") + "<g id='mm'>" + inh + "</g>";
        document.body.appendChild(s);
        let b = null;
        try { const r = s.querySelector("#mm").getBBox();
          if (r.width > 0) b = { l: r.x, r: r.x + r.width, o: r.y, u: r.y + r.height }; } catch (e) {}
        s.remove(); return b;
      };
      return {
        stuecke: Object.keys(h.kleidung || {}).length,
        frisuren: Object.keys(h.frisuren || {}).length,
        gesichter: Object.keys(h.gesichter || {}).length,
        punkte: h.punkte, breite: h.breite, hoehe: h.hoehe, fuss: h.fuss,
        koerper: kasten(h.koerper),
        hose: kasten(h.kleidung.hose || ""),
        schuh: kasten(h.kleidung.turnschuh || ""),
        haar: kasten(h.frisuren.kurz || ""),
        alt: alt,
        sitzenBreite: H.sitzen.breite,
      };
    }, typ);

    if (!erg) { pruefe(typ + ": Haltung gebaut", false); continue; }
    zeilen.push([typ, erg]);
    const altGleich = Object.keys(vorher).every((k) => vorher[k] === erg.alt[k]);
    pruefe(typ.padEnd(14) + " 47 Stücke, 10 Frisuren, 4 Gesichter",
      erg.stuecke === 47 && erg.frisuren === 10 && erg.gesichter === 4,
      erg.stuecke + "/" + erg.frisuren + "/" + erg.gesichter);
    if (!altGleich) pruefe(typ + ": die zehn alten Haltungen sind unangetastet", false);
  }

  console.log("\nIST DAS WIRKLICH EIN SITZENDER?\n");
  zeilen.forEach(function (z) {
    const t = z[0], e = z[1], k = e.koerper;
    const kopfOben = e.punkte.kopf[1] < 0;
    const fussUnten = k.u > 0;
    const aufrecht = (k.u - k.o) > (k.r - k.l);
    /* Ein Sitzbein zeigt nach VORN — das entscheidet der Fuss, nicht
       der ganze Umriss. Erster Entwurf hat den ganzen Koerper
       gemessen und die vier Kleinsten durchfallen lassen: bei einem
       Saeugling ist der Hinterkopf so gross, dass er nach hinten
       mehr Platz braucht als das kurze Bein nach vorn. Das war kein
       Fehler der Haltung, sondern eine Messung an der falschen
       Stelle. Jetzt zaehlt der Schuh: sein Mittelpunkt muss vor der
       Huefte liegen und deutlich unter ihr. */
    const sch = e.schuh;
    const schuhVorn = sch && (sch.l + sch.r) / 2 > 0 && (sch.o + sch.u) / 2 > 0;
    pruefe(t.padEnd(14) + " Kopf oben, Fuss unten, aufrecht, Schuh vorn",
      kopfOben && fussUnten && aufrecht && schuhVorn,
      "Kopf " + e.punkte.kopf[1] + " · Boden " + Math.round(k.u)
      + " · " + Math.round(k.r - k.l) + "×" + Math.round(k.u - k.o)
      + " · Schuh " + (sch ? Math.round((sch.l + sch.r) / 2) + "|" + Math.round((sch.o + sch.u) / 2) : "?"));
  });

  console.log("\nDIE KLEIDUNG MACHT DIE HALTUNG MIT\n");
  zeilen.forEach(function (z) {
    const t = z[0], e = z[1];
    if (!e.hose || !e.koerper) { pruefe(t + ": Hose gemessen", false); return; }
    /* Die Hose muss ueber Huefte UND Oberschenkel liegen, also
       ebenfalls nach vorn reichen — sonst waere sie aus einer
       anderen Haltung stehengeblieben. */
    const reichtVor = e.hose.r > e.koerper.r * 0.45;
    const aufHuefte = e.hose.o < 0 && e.hose.u > 0;
    pruefe(t.padEnd(14) + " Hose sitzt auf Hüfte und Oberschenkel",
      reichtVor && aufHuefte,
      "Hose x bis " + Math.round(e.hose.r) + " (Körper bis " + Math.round(e.koerper.r) + ")");
  });

  console.log("\nUND DAS HAAR SITZT AM KOPF, NICHT IRGENDWO\n");
  zeilen.forEach(function (z) {
    const t = z[0], e = z[1];
    if (!e.haar) { pruefe(t + ": Frisur gemessen", false); return; }
    const kx = e.punkte.kopf[0], ky = e.punkte.kopf[1];
    const mx = (e.haar.l + e.haar.r) / 2, my = (e.haar.o + e.haar.u) / 2;
    const nah = Math.abs(mx - kx) < e.hoehe * 0.12 && Math.abs(my - ky) < e.hoehe * 0.12;
    pruefe(t.padEnd(14) + " Frisur liegt am Kopfpunkt", nah,
      "Kopf (" + kx + "|" + ky + ") · Haar (" + Math.round(mx) + "|" + Math.round(my) + ")");
  });

  console.log("\nUND SIE KOSTET FAST NICHTS\n");
  const gr = fs.statSync(path.join(WURZEL, "figuren", "seitsitz.js")).size;
  pruefe("figuren/seitsitz.js bleibt unter 20 kB", gr < 20480, (gr / 1024).toFixed(1) + " kB");

  await br.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Die elfte Haltung sitzt — ganz aus dem Original.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
