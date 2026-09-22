/* =====================================================================
   SONDE RUNDE 88 — DER ZAUBERER MIT BEIDEN HAENDEN
   ---------------------------------------------------------------------
   XANDER: „Dann der Zauberer sollte ueber dem Profilbild sein. Er
   sollte einen Zylinder mit seinen Haenden an den Platz desjenigen
   STELLEN, der losreisen will. In diesen Zylinder soll er mit der
   ANDEREN Hand das Profilbild packen und in den Zylinder rein tun.
   Dann soll er den Zylinder dem Publikum praesentieren mit der
   Oeffnung des Zylinders, dass das Publikum sieht: der Zylinder ist
   leer. Danach soll er den Zylinder MIT BEIDEN HAENDEN auf dem Platz
   stellen, wo der Reisende hin moechte. Und auf diesem Platz zieht er
   die Person, das Profilbild, mit Hasenohren aus dem Zylinder."

   Gemessen wird an der angehaltenen Animation, Bild fuer Bild:
   · Hat der Zauberer ueberhaupt ZWEI bewegliche Arme?
   · Drehen sie um die Schulter — oder um irgendeinen Punkt?
   · STEHT der Hut auf dem Startplatz (statt darueber zu schweben)?
   · Greifen beim Abstellen wirklich BEIDE Haende zu?
   · Und verschwindet die Person im Hut und kommt am Ziel heraus?
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
  console.log("RUNDE 88 — Der Zauberer mit beiden Haenden\n");
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
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("zylinder", "8", "Alex", {}));
  await pg.waitForTimeout(120);

  /* Alle Teile des Tricks anhalten und auf einen ANTEIL der Dauer
     stellen. Setzen und Messen muessen getrennte Aufrufe sein: im
     selben evaluate kommt noch das alte Bild zurueck. */
  const dauer = await pg.evaluate(() => {
    const z = document.querySelector(".lc-zauberer");
    const a = z && z.getAnimations()[0];
    return a && a.effect ? a.effect.getTiming().duration : 0;
  });
  sage(dauer > 2000, "der Trick hat seine Zeit", Math.round(dauer) + " ms");

  const bei = async (anteil) => {
    await pg.evaluate((A) => {
      const teile = [".lc-zauberer", ".lc-zauberhut", ".lc-zauber-last", ".lc-zauber-ohren",
                     ".lc-zauberer-arm-rechts", ".lc-zauberer-arm-links"];
      teile.forEach((w) => document.querySelectorAll(w).forEach((el) =>
        el.getAnimations().forEach((an) => {
          try { an.pause(); an.currentTime = A * (an.effect.getTiming().duration || 0); }
          catch (e) {}
        })));
    }, anteil);
    await pg.waitForTimeout(90);
    return pg.evaluate(() => {
      const mitte = (w) => {
        const el = document.querySelector(w);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2,
                 sicht: Number(getComputedStyle(el).opacity) };
      };
      const dreh = (w) => {
        const el = document.querySelector(w);
        if (!el) return null;
        const m = getComputedStyle(el).transform;
        if (!m || m === "none") return 0;
        const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
        return Number((Math.atan2(z[1], z[0]) * 180 / Math.PI).toFixed(1));
      };
      const platz = (nr) => {
        const p = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + nr + '"] .lc-kreis');
        if (!p) return null;
        const r = p.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, b: r.width };
      };
      return { hut: mitte(".lc-zauberhut"), last: mitte(".lc-zauber-last"),
               armR: dreh(".lc-zauberer-arm-rechts"), armL: dreh(".lc-zauberer-arm-links"),
               p1: platz(1), p8: platz(8) };
    });
  };

  /* =================================================================
     1. ZWEI ARME, UND BEIDE DREHEN UM IHRE SCHULTER
     ================================================================= */
  console.log("\nZWEI ARME — „mit beiden Haenden\"\n");
  const arme = await pg.evaluate(() => {
    const l = document.querySelector(".lc-zauberer-arm-links");
    const r = document.querySelector(".lc-zauberer-arm-rechts");
    if (!l || !r) return { da: false };
    const bl = l.getBBox(), brr = r.getBBox();
    const st = (el) => getComputedStyle(el);
    return { da: true,
             /* Wo liegt die gezeichnete Schulter im Umriss? */
             linksX: (20 - bl.x) / bl.width * 100, linksY: (56 - bl.y) / bl.height * 100,
             rechtsX: (80 - brr.x) / brr.width * 100, rechtsY: (56 - brr.y) / brr.height * 100,
             urL: st(l).transformOrigin, urR: st(r).transformOrigin,
             kastenL: st(l).transformBox, kastenR: st(r).transformBox,
             breitL: bl.width, hochL: bl.height, breitR: brr.width, hochR: brr.height };
  });
  sage(arme.da, "der Zauberer hat zwei eigene Arme, nicht einen");
  if (arme.da) {
    /* transform-origin kommt in Pixeln des Umrisses zurueck. */
    const px = (s) => s.split(" ").map(parseFloat);
    const uR = px(arme.urR), uL = px(arme.urL);
    const trefferR = Math.abs(uR[0] / arme.breitR * 100 - arme.rechtsX) < 2
                  && Math.abs(uR[1] / arme.hochR * 100 - arme.rechtsY) < 2;
    const trefferL = Math.abs(uL[0] / arme.breitL * 100 - arme.linksX) < 2
                  && Math.abs(uL[1] / arme.hochL * 100 - arme.linksY) < 2;
    sage(trefferR && trefferL,
      "beide drehen um ihre SCHULTER, nicht um einen Punkt daneben",
      "rechts: Gelenk bei " + arme.rechtsX.toFixed(0) + "%/" + arme.rechtsY.toFixed(0)
        + "%, Drehpunkt " + arme.urR + "; links: " + arme.linksX.toFixed(0) + "%/"
        + arme.linksY.toFixed(0) + "%, Drehpunkt " + arme.urL);
    sage(arme.kastenL === "fill-box" && arme.kastenR === "fill-box",
      "und beide rechnen im Umriss (fill-box), nicht im Sichtfenster",
      arme.kastenR + " / " + arme.kastenL);
  }

  /* =================================================================
     2. DIE CHOREOGRAFIE
     ================================================================= */
  console.log("\nDIE REIHENFOLGE, SATZ FUER SATZ\n");
  const anteile = [0.05, 0.14, 0.26, 0.34, 0.40, 0.46, 0.56, 0.62, 0.72, 0.80, 0.88, 0.97];
  const mess = [];
  for (const a of anteile) mess.push(Object.assign({ a: a }, await bei(a)));
  const bJe = mess[0].p1 ? mess[0].p1.b : 64;
  const weit = (m, p) => (m.hut && m[p]) ? Math.hypot(m.hut.x - m[p].x, m.hut.y - m[p].y) : 1e9;

  /* „einen Zylinder … an den Platz desjenigen STELLEN, der losreisen
     will": zwischen 0,26 und 0,40 muss der Hut AUF Platz 1 stehen. */
  const aufStart = mess.filter((m) => m.a >= 0.26 && m.a <= 0.46)
    .map((m) => weit(m, "p1"));
  sage(Math.min.apply(null, aufStart) < bJe * 0.55,
    "der Hut STEHT auf dem Platz des Reisenden, statt darueber zu schweben",
    "kleinster Abstand zur Bildmitte " + Math.min.apply(null, aufStart).toFixed(0)
      + " px bei einem Bild von " + bJe.toFixed(0) + " px");
  const aufZiel = mess.filter((m) => m.a >= 0.72 && m.a <= 0.88).map((m) => weit(m, "p8"));
  sage(Math.min.apply(null, aufZiel) < bJe * 0.55,
    "und am Ende steht er auf dem Platz, wo die Reise hingeht",
    "kleinster Abstand " + Math.min.apply(null, aufZiel).toFixed(0) + " px");

  /* „mit BEIDEN Haenden auf dem Platz stellen": in beiden
     Abstell-Abschnitten muessen BEIDE Arme ausgeschwenkt sein. */
  const beidhaendig = (von, bis) => mess.filter((m) => m.a >= von && m.a <= bis)
    .some((m) => Math.abs(m.armR) > 8 && Math.abs(m.armL) > 8);
  sage(beidhaendig(0.24, 0.30),
    "beim Abstellen am Startplatz greifen BEIDE Haende zu",
    mess.filter((m) => m.a >= 0.24 && m.a <= 0.30)
      .map((m) => "R " + m.armR + " / L " + m.armL).join("   "));
  sage(beidhaendig(0.70, 0.80),
    "und am Zielplatz ebenso",
    mess.filter((m) => m.a >= 0.70 && m.a <= 0.80)
      .map((m) => "R " + m.armR + " / L " + m.armL).join("   "));
  /* „mit der ANDEREN Hand das Profilbild packen": waehrend die rechte
     den Hut haelt, muss die linke woanders hin. */
  const andersHand = mess.filter((m) => m.a >= 0.32 && m.a <= 0.36)
    .some((m) => Math.abs(m.armL - m.armR) > 20);
  sage(andersHand,
    "beim Hineintun greift die ANDERE Hand — beide Arme stehen verschieden",
    mess.filter((m) => m.a >= 0.32 && m.a <= 0.36)
      .map((m) => "R " + m.armR + " / L " + m.armL).join("   "));
  /* Beide Arme bewegen sich ueberhaupt. */
  const spanne = (w) => {
    const v = mess.map((m) => m[w]);
    return Math.max.apply(null, v) - Math.min.apply(null, v);
  };
  sage(spanne("armR") > 40 && spanne("armL") > 40,
    "und keiner der beiden Arme haengt die ganze Zeit still",
    "rechts " + spanne("armR").toFixed(0) + " Grad, links " + spanne("armL").toFixed(0) + " Grad");

  /* Die Person: sichtbar am Start, weg im Hut, wieder da am Ziel. */
  const sicht = mess.map((m) => (m.last ? m.last.sicht : -1));
  const weg = mess.filter((m) => m.a > 0.5 && m.a < 0.72).every((m) => m.last.sicht < 0.1);
  sage(mess[2].last.sicht > 0.8 && weg && mess[mess.length - 1].last.sicht > 0.8,
    "die Person ist erst da, verschwindet im Hut und kommt am Ziel wieder heraus",
    sicht.map((s) => s.toFixed(1)).join(" "));

  /* =================================================================
     3. DIE AERMEL SIND VOM UMHANG ZU UNTERSCHEIDEN
     ================================================================= */
  console.log("\nUND MAN SIEHT DIE ARME AUCH\n");
  const farben = await pg.evaluate(() => {
    const arm = document.querySelector(".lc-zauberer-arm-rechts path:nth-child(2)");
    const umhang = document.querySelector(".lc-zauberer-bild path");
    return { arm: arm ? arm.getAttribute("stroke") : "", umhang: umhang ? umhang.getAttribute("fill") : "" };
  });
  sage(farben.arm && farben.umhang && farben.arm.toLowerCase() !== farben.umhang.toLowerCase(),
    "der Aermel hat eine andere Farbe als der Umhang — sonst sieht man ihn nicht",
    "Aermel " + farben.arm + ", Umhang " + farben.umhang);
  const manschette = await pg.evaluate(() =>
    document.querySelectorAll('.lc-zauberer-arm path[stroke="#f2efe6"]').length);
  sage(manschette === 2, "und jede Hand hat ihre Manschette", manschette + " Manschetten");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Punkt(e) offen" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
