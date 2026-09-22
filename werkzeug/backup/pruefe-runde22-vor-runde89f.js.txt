#!/usr/bin/env node
/* =========================================================
   RUNDE 22 — DER GEZEICHNETE WEG, DAS EIGENE ECHO,
   DER LEERE PLATZ HINTER DEM STRUDEL UND DIE MUSIK
   ---------------------------------------------------------
   GEMELDET, woertlich (Auszuege):
   „Dann funktioniert das mit dem Angelhaken und mit dem Lasso
    nicht, egal was man waehlt. Es springt immer zwischen
    Angeln und Lasso hin und her … mit der Angel soll man ihn
    irgendwohin ziehen koennen und mit dem Lasso soll man ihn
    eigentlich zu sich heranziehen."
   · „Zeichnen beschreibt den Weg, den man machen moechte, in
     der naechsten Auswahl. Wenn man die Linie gezeichnet hat,
     soll man bestimmen, ob fahren oder laufen … Da muesstest
     du auch kein extra Menue machen."
   · „Man geht jetzt los, und die Nummer mit der Strichlinie,
     dieser Kreis ist gar nicht mehr sichtbar."
   · „Ich weiss ja nicht, wann die doppelte Stimme kommt …
     dass ich mich selber niemals hoeren kann. Vielleicht
     kannst du das in diesen Tonschalter mit einbauen."
   · „Bei der Strudel-Animation ist es auch noch, dass der
     Strudel weggeht und dahinter ist nicht wirklich der Platz
     mit der Strichlinie."
   · „Vielleicht kannst du bei dem Strohhalm noch eine zweite
     Animation hinzufuegen, als wenn man in den Strohhalm
     reinblaest und das Getraenk so blubbern laesst."
   · „Vielleicht kannst du das noch machen, dass ich, wenn
     nichts los ist im Chat, fuer alle ein Lied abspielen kann
     aus der Playlist … dass ich ein Lied aussuchen kann und
     den Leuten dann dieses Lied auf die Ohren setzen kann aus
     dem Musikordner."
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

(async () => {
  const js  = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  const lc  = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");

  console.log("\nANGEL UND LASSO SIND ZWEI VERSCHIEDENE SACHEN\n");
  pruefe("das Lasso ist ein eigener Befehl, kein Deckname fuer die Angel",
    /lasso:\s*\{ wirkung: "lasso"/.test(lc) === false && /art === "lasso"/.test(lc),
    "eigener Zweig in befehlAusfuehren");
  pruefe("und es zieht zu MIR",
    /befehlAusfuehren\("\/heb " \+ wenL\.name \+ " " \+ freiL\.nummer\)/.test(lc));
  pruefe("im Platzmenue stehen beide nebeneinander",
    /knopf\("\\ud83e\\ude9d", "Angeln"/.test(js) && /knopf\("\\ud83e\\udd20", "Lasso"/.test(js));

  console.log("\nDER WEG WIRD ERST GEZEICHNET, DANN GEWAEHLT\n");
  pruefe("es gibt nur noch EINE Zeichnen-Zeile",
    /gemalt \? "Neu zeichnen" : "Weg zeichnen"/.test(js) && !/"Route fahren"/.test(js));
  pruefe("die Zeichnung sendet noch nichts",
    /if \(!art\) \{\s*\n\s*lcGemalterWeg = nummern;/.test(js));
  pruefe("sie oeffnet dasselbe Menue an derselben Stelle",
    /lcAnreiseMenue\(zurueck\)/.test(js));
  pruefe("und Fahren oder Laufen nimmt dann die ganze Kette",
    /gemalt \? gemalt\.join\("-"\) : nr/.test(js));
  pruefe("der Hinweis beim Zeichnen sagt, was danach kommt",
    /danach Fahren oder Laufen antippen/.test(js));

  console.log("\nDER VERLASSENE PLATZ WIRD NEU GEZEICHNET\n");
  const fahrtLauf = js.slice(js.indexOf("function lcFahrtLauf"),
                             js.indexOf("function lcFahrtLauf") + 12000);
  /* Zwischen dem Platznehmen und dem Neuzeichnen steht der lange
     Kommentar, warum es noetig ist — deshalb ein weites Fenster. */
  pruefe("nach dem Umsetzen wird die Sitzreihe neu gezeichnet",
    /platzNehmen[\s\S]{0,1400}?renderLiveChat\(\)/.test(fahrtLauf));
  const lotto = js.slice(js.indexOf("function lcLotto"), js.indexOf("function lcLotto") + 12000);
  pruefe("beim Zufall genauso",
    /platzNehmen[\s\S]{0,1400}?renderLiveChat\(\)/.test(lotto));

  console.log("\nMAN HOERT SICH NIE SELBER\n");
  pruefe("es gibt eine Selbstsperre", /function tonSelbstSperren/.test(lc));
  pruefe("sie greift beim Anschliessen", /if \(tonSelbstSperren\(id\)\) return;/.test(lc));
  pruefe("auch beim Aufraeumen",
    /if \(id === zustand\.ichId\) \{ tonSelbstSperren\(id\); weg\+\+; return; \}/.test(lc));
  pruefe("und der Tonschalter meldet es",
    /erg\.selbst/.test(js) && /Dein eigenes Echo ist abgeklemmt/.test(js));

  console.log("\nHINTER DEM STRUDEL LIEGT DER LEERE PLATZ\n");
  pruefe("der Sog legt einen gestrichelten Kreis dahinter",
    /teile\.push\('<i class="lc-sog-leer"><\/i>'\)/.test(js));
  pruefe("und er ist gestrichelt wie ein freier Platz",
    /\.lc-sog-leer \{[\s\S]*?border: 3px dashed/.test(css));
  pruefe("er kommt erst, wenn das Bild fort ist",
    /@keyframes lcSogLeerR22 \{\s*\n\s*0%, 31%\s*\{ opacity: 0;/.test(css));

  console.log("\nDER ZWEITE STROHHALM\n");
  pruefe("das Blubbern ist gezeichnet", /function lcBlubbern/.test(js));
  /* GEAENDERT: „bei dem Strohhalm diese zwei Varianten" — Saugen und
     Blasen stehen seit Runde 34 unter EINER Kachel „Strohhalm", so
     wie die Reisen und die Fenster. Geprueft wird deshalb das
     Untermenue, nicht mehr die einzelne Kachel. */
  pruefe("es steht im Strohhalm-Untermenue",
    /\["\\ud83e\\uded7", "Blubbern", "blubbern"\]/.test(js)
    && /"Strohhalm", "strohhalm", false/.test(js));
  pruefe("es ist ein Befehl", /blubbern:\s*\{ wirkung: "blubbern"/.test(lc));
  pruefe("es steht in der Hilfe", /w: "blubbern"/.test(lc));
  pruefe("und im Verteiler", /art === "blubbern" && lcBlubbern/.test(js));
  pruefe("beim Pusten wird das Bild DICKER, nicht duenner",
    /@keyframes lcBlubbertR22[\s\S]*?scale\(1\.0[0-9]/.test(css));

  console.log("\nDIE MUSIK\n");
  const ordner = fs.readdirSync(path.join(WURZEL, "music")).filter((f) => /\.mp3$/i.test(f));
  const liste = lc.slice(lc.indexOf("var LIEDER = ["), lc.indexOf("function liedFinden"));
  const fehlend = ordner.filter((f) => liste.indexOf(f) < 0);
  pruefe("jede Datei im Musikordner steht auch in der Liste",
    fehlend.length === 0, ordner.length + " Dateien" + (fehlend.length ? ", fehlt: " + fehlend.join(", ") : ""));
  pruefe("/musik ist ein Befehl", /art === "musik"/.test(lc) && /w: "musik"/.test(lc));
  /* NACHGEBESSERT IN RUNDE 28: alle Zusatzfelder stehen in EINER
     Liste — so kann keines mehr an einer der drei Stellen fehlen. */
  pruefe("das Lied steht in der Liste der Zusatzfelder",
    /var ZUSATZ_FELDER = \[/.test(lc) && /"lied", "liedTitel"/.test(lc));
  pruefe("und die Liste gilt an allen drei Stellen",
    (lc.match(/zusatzUebernehmen\(/g) || []).length >= 4);
  pruefe("Musik zeichnet nichts und springt nicht",
    /if \(art === "musik"\) \{\s*\n\s*lcMusikSpielen/.test(js)
    && !/musik:\s*\{ ganzeSeite: true/.test(js));

  /* ---------- Und jetzt im Browser ---------- */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEFUNG.wirkung, { timeout: 20000 });

  console.log("\nGEMESSEN: DAS BLUBBERN AM PLATZ\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const blubb = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.wirkung("blubbern", "Bea", "Alex");
    await new Promise((f) => setTimeout(f, 900));
    const platz = [...document.querySelectorAll(".lc-platz")].find((p) => p.querySelector(".lc-blubber"));
    if (!platz) return null;
    const blasen = platz.querySelectorAll(".lc-blubber-blase").length;
    const kreis = platz.querySelector(".lc-kreis");
    const inBlende = Boolean(platz.querySelector(".lc-zp-blende .lc-blubber-blase"));
    return { blasen: blasen, inBlende: inBlende,
             bildBewegt: kreis ? kreis.getAnimations().length > 0 : false,
             halm: Boolean(platz.querySelector(".lc-blubber-rohr")) };
  });
  pruefe("die Schicht haengt am Platz", Boolean(blubb));
  pruefe("es blubbert im Getraenk, nicht daneben",
    Boolean(blubb && blubb.inBlende && blubb.blasen >= 8),
    blubb ? blubb.blasen + " Blasen, in der runden Blende: " + blubb.inBlende : "-");
  pruefe("der Halm steckt drin", Boolean(blubb && blubb.halm));
  pruefe("und das Bild wird angefasst", Boolean(blubb && blubb.bildBewegt));

  console.log("\nGEMESSEN: DER LEERE PLATZ HINTER DEM STRUDEL\n");
  const sog = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.wirkung("sog", "Cem", "Alex");
    await new Promise((f) => setTimeout(f, 1800));   /* 43 % von 4,2 s — das Bild ist fort */
    const platz = [...document.querySelectorAll(".lc-platz")].find((p) => p.querySelector(".lc-sog"));
    if (!platz) return null;
    const leer = platz.querySelector(".lc-sog-leer");
    const kreis = platz.querySelector(".lc-kreis");
    const schicht = platz.querySelector(".lc-sog");
    if (!leer || !kreis || !schicht) return null;
    /* NICHT mit dem KASTEN des Kreises vergleichen: der ist in diesem
       Moment auf scale(0) eingezogen, getBoundingClientRect gaebe
       also einen Punkt in der Mitte. Gemessen wird deshalb die
       LAYOUT-Stelle (offsetLeft/offsetTop) — die kennt keine
       Transformationen und sagt genau, wo das Bild hingehoert. */
    const l = getComputedStyle(leer);
    const lx = schicht.offsetLeft + leer.offsetLeft + leer.offsetWidth / 2;
    const ly = schicht.offsetTop + leer.offsetTop + leer.offsetHeight / 2;
    const kx = kreis.offsetLeft + kreis.offsetWidth / 2;
    const ky = kreis.offsetTop + kreis.offsetHeight / 2;
    return { deckung: Math.round(Math.hypot(lx - kx, ly - ky)),
             sichtbar: Number(l.opacity), stil: l.borderStyle,
             breite: Math.round(leer.offsetWidth), kreis: Math.round(kreis.offsetWidth) };
  });
  pruefe("der gestrichelte Kreis ist da, waehrend das Bild fort ist",
    Boolean(sog && sog.sichtbar > 0.5), sog ? "Deckkraft " + sog.sichtbar : "-");
  pruefe("er ist gestrichelt wie ein freier Platz",
    Boolean(sog && sog.stil === "dashed"), sog ? sog.stil : "-");
  pruefe("und er liegt genau auf dem Platz",
    Boolean(sog && sog.deckung <= 4),
    sog ? sog.deckung + " px aus der Mitte, " + sog.breite + " px breit (Bild: "
        + sog.kreis + " px)" : "-");

  console.log("\nGEMESSEN: DAS LIED AUF DEN OHREN\n");
  const ohr = await pg.evaluate(async () => {
    const lieder = window.LiveChat.lieder();
    const name = (window.LiveChat.lage() || {}).ichName || "";
    /* Erst einem ANDEREN aufsetzen — bei mir darf nichts laufen. */
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "Bea", "Alex",
      { lied: lieder[0].datei, liedTitel: lieder[0].titel });
    await new Promise((f) => setTimeout(f, 400));
    const fremd = window.DMA_PRUEFUNG.musikStand();
    return { lieder: lieder.length, ich: name, fremdQuelle: fremd.quelle };
  });
  pruefe("die Lieder sind abrufbar", ohr.lieder >= 6, ohr.lieder + " Stueck");
  pruefe("bei einem anderen laeuft bei MIR nichts", ohr.fremdQuelle === "",
    ohr.fremdQuelle || "still");

  const fuerAlle = await pg.evaluate(async () => {
    const lieder = window.LiveChat.lieder();
    window.DMA_PRUEFUNG.wirkung("musik", "", "Alex",
      { lied: lieder[1].datei, liedTitel: lieder[1].titel });
    await new Promise((f) => setTimeout(f, 700));
    const st = window.DMA_PRUEFUNG.musikStand();
    const band = document.getElementById("lcMusikBand");
    const erg = { titel: st.titel, quelle: st.quelle,
                  band: band ? band.textContent.trim() : "" };
    window.DMA_PRUEFUNG.wirkung("musikaus", "", "Alex");
    await new Promise((f) => setTimeout(f, 200));
    erg.danach = window.DMA_PRUEFUNG.musikStand().laeuft;
    erg.bandDanach = Boolean(document.getElementById("lcMusikBand"));
    return erg;
  });
  pruefe("ein Lied fuer alle wird geladen",
    /music\/.+\.mp3/.test(fuerAlle.quelle), fuerAlle.quelle.split("/").pop() || "-");
  pruefe("die Bande sagt, was laeuft", fuerAlle.band.length > 3, fuerAlle.band);
  pruefe("und /musik aus macht sie wieder still",
    fuerAlle.danach === false && fuerAlle.bandDanach === false);

  console.log("\nGEMESSEN: DER TONSCHALTER KLEMMT DAS EIGENE ECHO AB\n");
  const echo = await pg.evaluate(async () => {
    const strom = new MediaStream();
    window.LiveChat.pruefSitz({
      lage: "drin", ichId: "ichselbst", ichName: "Alex",
      leute: { ichselbst: { name: "Alex", strom: strom },
               fremd1: { name: "Bea", strom: new MediaStream() } }
    });
    return window.LiveChat.tonNeuAufbauen();
  });
  pruefe("das eigene Echo wird gefunden und abgeklemmt", echo.selbst === 1,
    JSON.stringify(echo));
  pruefe("und die anderen bleiben angeschlossen", echo.wieder === 1);

  pruefe("keine Fehler auf der Seite", aufSeite.length === 0,
    aufSeite.slice(0, 3).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nRunde 22 sitzt.");
  process.exit(fehler ? 1 : 0);
})();
