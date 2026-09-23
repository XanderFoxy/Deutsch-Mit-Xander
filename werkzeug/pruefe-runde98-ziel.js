#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — WO MAN HINWILL, DA FAEHRT MAN HIN
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Die einzelnen Module der Lokomotive
   funktionieren immer noch nicht und es soll ungeachtet ob da jemand
   sitzt. Ich weiss nicht warum du jetzt den Platz von dem anderen
   beruecksichtigst. Das soll niemals beruecksichtigt werden. Da wo man
   hinfahren moechte kann man hinfahren egal ob da jemand sitzt, dann
   ueberfaehrt man ihn eben. Ich habe niemals etwas anderes gesagt."

   ER HAT RECHT, UND ES WAR MEIN FEHLER. Drei Bremsen standen im Weg,
   alle drei von mir:
     1. Reise zu einem NAMEN ging auf den naechsten FREIEN Platz neben
        ihm — war keiner frei, kam eine Absage.
     2. Reise zu einer besetzten NUMMER wurde in Runde 96 stillschweigend
        umgeleitet.
     3. Fahren auf einen besetzten Platz sagte „Platz 2 ist besetzt".

   GEMESSEN WIRD deshalb genau das Gegenteil:
     · keine Absage, kein Umleiten;
     · das Bild kommt auf dem GEWUENSCHTEN Platz an;
     · und wer dort sass, wird sichtbar ueberfahren.
   Was BLEIBT, ist sein aelterer Satz ueber den WEG: „Wenn alles voll
   ist, kann ich nicht losfahren" — der Weg des Autos geht weiter nur
   ueber freie Plaetze, nur das Ziel darf besetzt sein.
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

  /* Auf der Pruefbuehne sitzen Alex (1), Bea (2), Cem (3), Dana (4)
     und Emmi (5); 6 bis 8 sind frei. Gereist wird von Alex auf den
     besetzten Platz 2 — einmal ueber den Namen, einmal ueber die
     Nummer. */
  console.log("\nREISEN AUF EINEN BESETZTEN PLATZ\n");
  const arten = ["lok", "flug", "beamen", "heli", "pferd", "gotteshand", "fahrstuhl"];
  const raus = [];
  for (const art of arten) {
    const e = await pg.evaluate(async (art) => {
      window.DMA_PRUEF.effektBuehne();
      const vorText = document.body.innerText;
      window.DMA_PRUEFUNG.wirkung(art, "Bea", "Alex", {});
      await new Promise((f) => setTimeout(f, 900));
      const neu = document.body.innerText.slice(vorText.length);
      const absage = (neu.match(/Kein Platz frei[^\n]*|ist besetzt[^\n]*|Kein Weg frei[^\n]*/) || [""])[0];
      /* Bewegt sich ueberhaupt etwas? Gezaehlt werden alle Schichten,
         die eine Reise aufbaut. */
      const teile = document.querySelectorAll(
        ".lc-reise, .lc-lok, .lc-flieger, .lc-beam, .lc-heli, .lc-pferd,"
        + " .lc-riesenhand, .lc-fahrstuhl, .lc-zp").length;
      await new Promise((f) => setTimeout(f, 3400));
      return { art: art, absage: absage, teile: teile };
    }, art);
    raus.push(e);
    sage(!e.absage, "/" + e.art + " faehrt los, ohne sich um den Sitznachbarn zu kuemmern",
      e.absage || (e.teile + " Schichten"));
  }

  console.log("\nUND WER DORT SASS, WIRD UEBERFAHREN\n");
  const platt = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    window.DMA_PRUEFUNG.wirkung("flug", "Bea", "Alex", {});
    let gesehen = false, wann = -1;
    for (let i = 0; i < 40; i++) {
      await new Promise((f) => setTimeout(f, 100));
      const b = [...document.querySelectorAll(".lc-platz")].filter((p) =>
        ((p.querySelector(".lc-platz-name") || {}).textContent || "").toLowerCase().indexOf("bea") >= 0)[0];
      const k = b && b.querySelector(".lc-kreis");
      if (k && k.classList.contains("lc-ueberfahren")) { gesehen = true; wann = i * 100; break; }
    }
    return { gesehen: gesehen, wann: wann };
  });
  sage(platt.gesehen === true, "der Ueberfahrene wird plattgedrueckt",
    platt.gesehen ? "bei " + platt.wann + " ms" : "nichts gesehen");

  console.log("\nWAS BLEIBEN MUSS: DER WEG DES AUTOS GEHT NUR UEBER FREIE PLAETZE\n");
  const wege = await pg.evaluate(() => {
    window.DMA_PRUEF.effektBuehne();
    return { zumNachbarn: window.DMA_PRUEF.wegPruefen(1, 2, false),
             durchDieReihe: window.DMA_PRUEF.wegPruefen(1, 6, false),
             ueberAlle: window.DMA_PRUEF.wegPruefen(1, 6, true) };
  });
  sage(Array.isArray(wege.zumNachbarn) && wege.zumNachbarn.length === 2,
    "das besetzte ZIEL selbst ist erlaubt", JSON.stringify(wege.zumNachbarn));
  sage(wege.durchDieReihe === null,
    "aber DURCH besetzte Plaetze faehrt das Auto nicht („wenn alles voll ist, "
    + "kann ich nicht losfahren“)", String(wege.durchDieReihe));
  sage(Array.isArray(wege.ueberAlle) && wege.ueberAlle.length > 1,
    "die Lok dagegen faehrt ueber alle hinweg", JSON.stringify(wege.ueberAlle));

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
