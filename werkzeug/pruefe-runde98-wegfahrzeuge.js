#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DER GEMALTE WEG UND DIE RICHTUNG DES DELFINS
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „im Uebrigen schwimmt der Delfin nicht in die
   richtige Richtung, der soll auch — saemtliche Fahrzeuge sollen den
   Weg eingezeichnet bekommen."

   ZWEI MESSUNGEN:
     1  DIE RICHTUNG. Die Delfinzeichnung hat die Schnauze bei x = 0
        bis 14 und die Schwanzflosse bei x = 126 bis 140 — sie schaut
        also nach LINKS. Gespiegelt wurde aber, wenn es nach links
        ging. Gemessen wird deshalb, wo Nase und Schwanz WIRKLICH
        liegen: die Nase muss in Fahrtrichtung vorn sein.
     2  DER WEG. Ein Umweg wird gemalt („/boot 1-4-5-8"), und dann
        wird Bild fuer Bild verfolgt, ob das Fahrzeug wirklich an der
        Zwischenstation vorbeikommt. Ohne gemalten Weg faehrt es
        schnurgerade — dann liegt es weit daneben.
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

/* Fahrzeug, Kennzeichen im Bild, und wie genau es die Station treffen
   muss. Der Kran traegt seine Last hoch ueber der Reihe — dort zaehlt
   nur die Seite, nicht die Hoehe. */
const FAHRZEUGE = [
  ["boot",       ".lc-boot",       "naehe"],
  ["dampfer",    ".lc-dampfer",    "naehe"],
  ["delfin",     ".lc-delfin",     "naehe"],
  ["heli",       ".lc-heli",       "naehe"],
  ["pferd",      ".lc-pferd",      "naehe"],
  ["greifvogel", ".lc-greif",      "naehe"],
  ["flug",       ".lc-flieger",    "naehe"],
  ["feder",      ".lc-feder",      "naehe"],
  /* Der Maulwurf faehrt nicht, er GRAEBT: sein Weg ist der Wall aus
     Erdhaufen, und der liegt still. Gemessen wird deshalb, ob ein
     Haufen an der Station liegt. */
  ["maulwurf",   ".lc-erdhaufen",  "naehe"],
  /* Der Kran traegt seine Last hoch ueber der Reihe \u2014 dort ist sie
     nie NAH an einem Platz. Gemessen wird deshalb die zurueckgelegte
     Strecke: ein Umweg ist laenger als eine Gerade, und zwar deutlich. */
  ["kran",       ".lc-kran",       "strecke"],
  /* Diese drei fliegen ueber der Reihe, statt an ihr entlang: die
     Untertasse schwebt darueber, die Katze schlaegt das Bild im Bogen
     weiter, und eine geworfene Scheibe steigt und faellt. Ihre Mitte
     ist deshalb NIE nah an einer Platzmitte \u2014 gemessen wird bei
     ihnen die zurueckgelegte Strecke: ein Umweg ist deutlich laenger
     als eine Gerade. */
  ["untertasse", ".lc-ufo",        "strecke"],
  ["mieze",      ".lc-katze",      "strecke"],
  ["frisbee",    ".lc-frisbee",    "strecke"],
  ["frosch",     ".lc-frosch",     "naehe"],
  /* NICHT dabei, und das mit Absicht: Beamen, Tor, Roehre, Fahrstuhl
     und Zylinder sind Spruenge von hier nach dort — dazwischen gibt
     es keine Strecke. Die Liane haengt an EINEM festen Punkt und
     schwingt darum; ein Pendel, das Stationen abfaehrt, kaeme nie
     zurueck. Der Drei-Meter-Turm ist ein Sprung. Und die Lok hat
     ihre eigenen Gleise — siehe pruefe-runde98-lok.js. */
];

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

  console.log("\n1  DER DELFIN SCHWIMMT VORWAERTS\n");
  for (const [von, ziel, wohin, sollVorn] of
       [["Alex", "8", "nach rechts", "rechts"], ["Dana", "5", "nach links", "links"]]) {
    const r = await pg.evaluate(async ([von, ziel]) => {
      window.DMA_PRUEF.effektBuehne();
      window.DMA_PRUEFUNG.wirkung("delfin", ziel, von, {});
      await new Promise((f) => setTimeout(f, 900));
      const del = document.querySelector(".lc-delfin");
      if (!del) return null;
      const a = del.querySelector(".lc-delfin-schnauze").getBoundingClientRect();
      const b = del.querySelector(".lc-delfin-schwanz").getBoundingClientRect();
      return { nase: Math.round(a.left + a.width / 2),
               schwanz: Math.round(b.left + b.width / 2) };
    }, [von, ziel]);
    if (!r) { sage(false, "Delfin " + wohin + " — gar nicht da"); continue; }
    const vorn = r.nase > r.schwanz ? "rechts" : "links";
    sage(vorn === sollVorn, "Delfin " + wohin + ": die Nase ist vorn",
      "Nase " + r.nase + " px, Schwanz " + r.schwanz + " px — Nase " + vorn);
  }

  console.log("\n2  JEDES FAHRZEUG FAEHRT DEN GEMALTEN UMWEG AB\n");
  for (const [art, wahl, wie] of FAHRZEUGE) {
    const r = await pg.evaluate(async ([art, wahl]) => {
      const messen = async (ziel) => {
        window.DMA_PRUEF.effektBuehne();
        const platz = (nr) => {
          const p = document.querySelector('[data-lc-platz="' + nr + '"]');
          const k = p.getBoundingClientRect();
          return { x: k.left + k.width / 2, y: k.top + k.height / 2 };
        };
        /* Der Umweg: von Platz 1 ueber 4 und 5 nach 8. Station 4 liegt
           oben rechts, 5 unten links \u2014 wer geradeaus faehrt, kommt an
           beiden nie vorbei. */
        const st = platz(4);
        window.DMA_PRUEFUNG.wirkung(art, ziel, "Alex", {});
        let naechste = 1e9, strecke = 0, vorX = null;
        const bis = performance.now() + 4200;
        while (performance.now() < bis) {
          const alle = document.querySelectorAll(wahl);
          let mitteX = null;
          alle.forEach((el) => {
            const k = el.getBoundingClientRect();
            if (!k.width) return;
            const mx = k.left + k.width / 2, my = k.top + k.height / 2;
            const dd = Math.hypot(mx - st.x, my - st.y);
            if (dd < naechste) naechste = dd;
            if (mitteX === null) mitteX = mx;
          });
          if (mitteX !== null) {
            if (vorX !== null) strecke += Math.abs(mitteX - vorX);
            vorX = mitteX;
          }
          await new Promise((f) => requestAnimationFrame(f));
        }
        await new Promise((f) => setTimeout(f, 600));
        return { naeh: Math.round(naechste), strecke: Math.round(strecke) };
      };
      const mit = await messen("1-4-5-8");
      const ohne = await messen("8");
      return { mit: mit, ohne: ohne };
    }, [art, wahl]);
    if (wie === "strecke") {
      sage(r.mit.strecke > r.ohne.strecke * 1.35 && r.ohne.strecke > 40,
        "/" + art + " 1-4-5-8 faehrt den Umweg wirklich ab",
        "mit Weg " + r.mit.strecke + " px Strecke, ohne Weg "
        + r.ohne.strecke + " px");
    } else {
      /* Die Kachelbreite liegt bei rund 103 px; „vorbeigekommen"
         heisst hier: naeher als eine halbe Kachel. */
      sage(r.mit.naeh <= 55 && r.mit.naeh < r.ohne.naeh - 20,
        "/" + art + " 1-4-5-8 kommt an Platz 4 vorbei",
        "mit Weg " + r.mit.naeh + " px, ohne Weg " + r.ohne.naeh + " px");
    }
  }

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
