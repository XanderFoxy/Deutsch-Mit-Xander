#!/usr/bin/env node
/* =========================================================
   RUNDE 18 — PLATZWAHL, DIE STEHENDE NUMMER UND DER
   AUFGERAEUMTE EFFEKTKASTEN
   ---------------------------------------------------------
   GEMELDET, woertlich (Auszuege):
   „Standard soll so sein, dass man immer auf die Plaetze
    klickt und dann auf einen Platz seiner Wahl einfach kommt
    durch das Klicken auf den Platz, so wie es vorher auch
    war. Das Fahren soll nur stattfinden, wenn man das Fahren
    auch anwaehlt, und dann sollen keine Auto-Emojis
    runterfallen … Wenn man irgendwo hinfaehrt, dann ist ganz
    wichtig, dass der Platz, den man verlaesst, von der Nummer
    nicht beeintraechtigt wird, weil die Nummer dreht sich
    irgendwie mit … Die Eins unter meinem Profilbild soll da
    immer stabil stehen bleiben, die darf gar nicht mitdrehen
    … Ich faende das auch sinnvoller, das Ziel anzuklicken, wo
    man hin will, und auf diesem Ziel auszuwaehlen, wie man da
    hinkommen will: entweder fahren oder springen … und das
    Laufen von Nummer zu Nummer bis ans Ziel."

   Und aus derselben Liste, zu den Effekten:
   „am Ende soll dieses typische Pfeil sein mit der Feder …
    auf der Seite, wo die Spitze ist, soll der Saugnapf sein"
   · „sie soll richtig in meiner Hand sein, von meinem Profil
    ausgehend … dass die ganze Distanz abgedeckt wird"
   · „man soll die Leute zu sich heranziehen"
   · „weil ich von links nach rechts stosse … muss die Kugel
    nach rechts weiter fallen, ins naechste Loch"
   · „der originale Kreis ist beschnitten und nicht mehr rund.
    Das darf nicht passieren"
   · „es soll das ganze Sprenkel mit gruen, rot, blau, gelb"
   · „dann duerfen die Koepfe von den Schlaegeln nicht nach
    aussen zeigen, sondern muessen zur Trommel hin"
   · „der Strahl des Wassers soll im Profilbild bleiben"
   · „dass die Sounds alle auf einem Niveau sind"
   · „da steht dann /W … man sieht den Code im Chat und nicht
    das typische Design fuer das Fluestern"
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

/* Ein Sitzbrett wie das echte — MIT dem Schild, in dem die Nummer
   steht. Ohne das Schild liesse sich gar nicht messen, ob sie
   mitfaehrt. */
const BRETT = (frei) => `
  document.getElementById("lcPruefBuehne")?.remove();
  const b = document.createElement("div");
  b.id = "lcPruefBuehne";
  b.style.padding = "170px 0";
  const namen = ["Alex","Bea","Cem","Dana","Emmi","Fred","Gero","Hana"];
  b.innerHTML = '<div class="question-card livechat" id="livechatKarte">'
    + '<div class="lc-plaetze" id="lcPlaetze">'
    + namen.map(function (n, i) {
        const nr = i + 1;
        const leer = ${JSON.stringify(frei)}.indexOf(nr) >= 0;
        return '<button class="lc-platz' + (nr === 1 ? ' lc-platz-ich' : '')
          + (leer ? ' lc-platz-frei' : '') + '" data-lc-platz="' + nr + '"'
          + ' data-lc-id="p' + nr + '">'
          + '<span class="lc-kreis"></span>'
          + '<span class="lc-schild"><span class="lc-nummer">' + nr + '</span></span>'
          + '<span class="lc-platz-name">' + (leer ? 'frei' : n) + '</span></button>';
      }).join("")
    + '</div></div>';
  document.body.appendChild(b);
  try { b.scrollIntoView({ block: "center", behavior: "instant" }); } catch (e) {}
`;

(async () => {
  const js  = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  const lc  = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const html= fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");
  const fsp = fs.readFileSync(path.join(WURZEL, "filmspieler.js"), "utf8");

  console.log("\nDIE NUMMER LIEGT NICHT MEHR IM KREIS\n");
  pruefe("das Geruest baut ein eigenes Schild",
    /<span class="lc-schild"[^>]*><span class="lc-nummer">/.test(js),
    "Nummer als Geschwister des Kreises");
  pruefe("und im Kreis steht keine Nummer mehr",
    !/<span class="lc-kreis">\s*\n\s*<span class="lc-nummer">/.test(js));
  pruefe("das Schild deckt sich mit dem Kreis",
    /\.lc-schild \{[\s\S]*?aspect-ratio: 1 \/ 1;/.test(css));
  pruefe("und nimmt keine Klicks weg",
    /\.lc-schild \{[\s\S]*?pointer-events: none;/.test(css));

  console.log("\nEIN TIPP SETZT WIEDER SOFORT UM\n");
  pruefe("der Klick auf einen freien Platz schickt kein /fahren mehr",
    !/const zeile = "\/fahren " \+ nr;/.test(js),
    "„so wie es vorher auch war“");
  pruefe("er nimmt den Platz direkt",
    /LiveChat\.platzNehmen \? LiveChat\.platzNehmen\(nr\) : null;\s*\n\s*renderLiveChat\(\);/.test(js));
  /* NACHGEBESSERT IN RUNDE 19, weil die Sache sich geaendert hat:
     GEMELDET: „In diesem Menue muss das Springen nicht drinstehen.
     Das ist dann Quatsch." Der kurze Tipp IST das Springen. Dafuer
     kann man den Weg jetzt malen. */
  /* NOCHMAL NACHGEBESSERT IN RUNDE 22, weil die Sache sich wieder
     geaendert hat. GEMELDET: „Da muesstest du auch kein extra Menue
     machen. Dann machst du die Zeichnung mit dem Hinweis, dass ich dann
     das Laufen- oder Fahr-Symbol anklicken muss." Es gibt deshalb nur
     noch EINE Zeichnen-Zeile, und die Wahl faellt danach an derselben
     Stelle. */
  pruefe("es gibt ein Anreise-Menue ohne Springen und mit einer Zeichnen-Zeile",
    /function lcAnreiseMenue/.test(js)
    && !/knopf\("[^"]*", "Springen"/.test(js)
    && /"Fahren"/.test(js) && /"Laufen"/.test(js)
    && /gemalt \? "Neu zeichnen" : "Weg zeichnen"/.test(js)
    && !/"Route fahren"/.test(js));
  pruefe("die Zeichnung sendet noch nichts, sondern merkt sich den Weg",
    /if \(!art\) \{\s*\n\s*lcGemalterWeg = nummern;/.test(js)
    && /lcAnreiseMenue\(zurueck\)/.test(js));
  pruefe("und Fahren\/Laufen nehmen dann die ganze Kette",
    /gemalt \? gemalt\.join\("-"\) : nr/.test(js));
  pruefe("und /laufen ist ein echter Befehl",
    /laufen:\s*\{ wirkung: "spielzug"/.test(lc));
  pruefe("eine Nummer hinter dem Befehl wird als Platz gelesen",
    /f\\u00e4hrt zu Platz|fährt zu Platz/.test(lc));

  console.log("\nKEIN EMOJI-REGEN MEHR BEI PLATZ-EFFEKTEN\n");
  const sperre = js.slice(js.indexOf("const LC_NUR_AM_PLATZ"), js.indexOf("const LC_NUR_AM_PLATZ") + 1400);
  ["fahren", "spielzug", "pacjagd", "sanduhr", "zufall", "lotto", "aufessen"].forEach((w) => {
    pruefe("„" + w + "“ steht auf der Sperrliste", new RegExp("\\b" + w + ": 1").test(sperre));
  });
  pruefe("und die Sperre greift vor dem Teilchenregen",
    js.indexOf("if (LC_NUR_AM_PLATZ[art]) {") > 0
    && js.indexOf("if (LC_NUR_AM_PLATZ[art]) {") < js.indexOf("if (e.ganzeSeite) {"));

  console.log("\nDIE EFFEKTE, DIE ER EINZELN GENANNT HAT\n");
  pruefe("der Pfeil hat hinten Federn, keine zweite Spitze",
    !/M68 4 L86 13 L68 22 Z/.test(js) && /M2 14 L16 6 L20 10 L10 14 L20 18 L16 22 Z/.test(js));
  pruefe("und der Saugnapf fuehrt",
    /class="lc-pfeil-napf" d="M76 4/.test(js), "rechts, also vorn");
  pruefe("er saugt sich am Rand fest, nicht in der Mitte",
    /--ex", \(r\.x \* 38\)/.test(js));
  pruefe("die Peitsche geht ueber die ganze Entfernung",
    /lcLeineWerfen\(platz, "peitsche"\)/.test(js)
    && /\.lc-peitsche-seil \{[\s\S]*?width: var\(--laenge/.test(css));
  pruefe("Lasso und Angel ziehen zu MIR",
    /function lcZuMirZiehen/.test(js) && /@keyframes lcZuMirR18/.test(css));
  pruefe("und setzen den anderen auch wirklich um",
    /function lcNebenMichSetzen/.test(js) && /"\/heb " \+ name \+ " " \+ frei\.nr/.test(js));
  pruefe("Billard sucht das Loch in Stossrichtung",
    /k\.mit > 0\.35/.test(js), "Kosinus zur Stossrichtung");
  pruefe("Pac-Man beschneidet den Kreis nicht mehr",
    /\.lc-kreis\.lc-pacman \{[\s\S]*?clip-path: none !important;/.test(css));
  /* NACHGEBESSERT: die Sonde suchte nach class="lc-pac-figur" im
     Text — die Figur bekommt ihre Klasse aber ueber className, nicht
     als Attribut. Gesucht war also eine Schreibweise, die es nie
     gab; der Browsertest weiter unten misst ohnehin das Richtige. */
  pruefe("und ich werde zur Original-Figur",
    /figur\.className = "lc-pac-figur"/.test(js) && /lc-pac-figur-maul/.test(js));
  pruefe("Paintball mischt mehrere Farben",
    /const farben = mischen\(3\)/.test(js));
  pruefe("die Trommelschlaegel zeigen zur Trommel",
    /transform-origin: 50% 4%/.test(css), "Drehpunkt oben = die Hand");
  pruefe("die Weckerschellen sind verbunden",
    /lc-schelle-buegel/.test(js) && /@keyframes lcBuegelAnR18/.test(css));
  pruefe("der Basketball ist die Person",
    /function lcKorbwurf/.test(js) && !/<span class="lc-basketball">/.test(js));
  pruefe("der Strohhalm trinkt wirklich leer",
    /inset\(100% 0 0 0\)/.test(css), "bis nichts mehr im Glas ist");
  pruefe("das Katapult taucht auf, statt hereinzufliegen",
    /@keyframes lcKatapultDaR18 \{\s*\n\s*0%\s*\{ opacity: 0; transform: translate\(0, 0\)/.test(css));
  pruefe("der Keks hinterlaesst echte Bissspuren",
    /lcBissUmriss\(stellen\.slice\(0, i \+ 1\)\)/.test(js.slice(js.indexOf("function lcKrumel")))
    && !/lc-krumel-keks/.test(js));

  console.log("\nDIE SIEBEN NEUEN\n");
  [["licht", "lcLichtAus"], ["muenze", "lcMuenze"], ["wischer", "lcWischer"],
   ["zwille", "lcZwille"], ["pusterohr", "lcPusterohr"], ["gluehbirne", "lcGluehbirne"],
   ["entbloessung", "lcEntbloessung"]].forEach(([befehl, fn]) => {
    const da = new RegExp("function " + fn + "\\b").test(js);
    const kachel = new RegExp('"' + befehl + '"\\]').test(js);
    const kommando = new RegExp("\\b" + befehl + ":\\s*\\{ wirkung: \"" + befehl + "\"").test(lc);
    const verteiler = new RegExp('art === "' + befehl + '" && ' + fn).test(js);
    pruefe("„" + befehl + "“ ist vollstaendig verdrahtet",
      da && kachel && kommando && verteiler,
      "Zeichnung " + da + ", Kachel " + kachel + ", Befehl " + kommando + ", Verteiler " + verteiler);
  });
  pruefe("die Entbloessung geht nur nebeneinander",
    /if \(abstand !== 1\)/.test(js), "gerechnet aus dem Sitzgitter");

  console.log("\nDER TON\n");
  pruefe("es gibt einen gemessenen Ausgleich je Datei",
    /const LC_TON_AUSGLEICH = \{/.test(js));
  const tab = js.slice(js.indexOf("const LC_TON_AUSGLEICH"), js.indexOf("const LC_TON_GRUNDMASS"));
  const werte = [...tab.matchAll(/^\s+\w+: ([\d.]+),/gm)].map((m) => Number(m[1]));
  pruefe("und er deckt viele Dateien ab", werte.length >= 60, werte.length + " Dateien");
  pruefe("die lautesten werden leiser, die leisesten lauter",
    Math.min(...werte) < 0.5 && Math.max(...werte) > 1.5,
    "von " + Math.min(...werte) + " bis " + Math.max(...werte));
  pruefe("der Ausgleich wird beim Abspielen auch benutzt",
    /LC_TON_AUSGLEICH\[name\] \|\| 1/.test(js));
  pruefe("und das Ducking bei Sprache ist noch da",
    /redet \? roh \* 0\.34 : roh/.test(js));

  console.log("\nDAS GEFLUESTERTE BILD\n");
  pruefe("die Fluesterzeile wird aus dem Feld GELESEN, nicht mitgeschickt",
    /\/\^\\s\*\\\/\(\?:w\|m\|msg\|query\|fluester\|whisper\)/.test(js));
  pruefe("und die Beschriftung kommt ohne den Befehl",
    /const beschriftung = \(\) => \{/.test(js));

  console.log("\nDAS LADEN\n");
  pruefe("der kleinere Film wird bevorzugt",
    /var kannMaske = Boolean\(d\.maske\) && !d\.maskeUnsauber && webglDa\(\);/.test(fsp));
  pruefe("und die eine unsaubere Maske ist ausgenommen",
    JSON.parse(fs.readFileSync(path.join(WURZEL, "filme/raumschiff.json"), "utf8")).maskeUnsauber === true,
    "raumschiff.json");
  pruefe("die Fassung ist hochgezaehlt",
    /window\.DMA_VERSION = "368"/.test(html));

  /* ---------- Und jetzt im Browser ---------- */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEFUNG.wirkung, { timeout: 20000 });

  console.log("\nGEMESSEN: DIE NUMMER BLEIBT STEHEN, WENN ICH WEGFAHRE\n");
  await pg.evaluate(BRETT([5, 6, 7, 8]));
  /* NACHGEBESSERT IN RUNDE 19 — und zwar, weil die ALTE Messung seit
     dieser Runde etwas Falsches misst, nicht weil sie stoerte:
     GEMELDET war „diese kleine Eins auf dem Profilbild brauchst du
     nicht im Profilbild stehen haben". Auf einem besetzten Platz ist
     die Nummer jetzt also ausgeblendet (display: none), und ein
     ausgeblendeter Kasten hat die Masse null. Der Vergleich
     „vorher gegen nachher" haette damit immer einen Sprung von der
     Nullecke zur echten Stelle gemeldet — 502 px gemessen, und
     trotzdem hatte sich nichts bewegt.
     Gemessen wird deshalb jetzt WAEHREND der Fahrt zweimal: die
     Nummer muss sichtbar sein und zwischen den beiden Zeitpunkten
     auf der Stelle stehen, waehrend das Bild weiterrollt. */
  const fahrt = await pg.evaluate(async () => {
    const meiner = document.querySelector(".lc-platz-ich");
    const nummer = meiner.querySelector(".lc-nummer");
    const kreis = meiner.querySelector(".lc-kreis");
    window.DMA_PRUEFUNG.wirkung("fahren", "8", "Alex");
    await new Promise((f) => setTimeout(f, 700));
    const n1 = nummer.getBoundingClientRect();
    const k1 = kreis.getBoundingClientRect();
    const ring = getComputedStyle(meiner.querySelector(".lc-schild"), "::before").borderStyle;
    await new Promise((f) => setTimeout(f, 700));
    const n2 = nummer.getBoundingClientRect();
    const k2 = kreis.getBoundingClientRect();
    return {
      nummerWeg: Math.round(Math.hypot(n2.left - n1.left, n2.top - n1.top)),
      nummerDa: Math.round(n1.width),
      kreisWeg: Math.round(Math.hypot(k2.left - k1.left, k2.top - k1.top)),
      nummerImKreis: kreis.contains(nummer),
      ring: ring
    };
  });
  pruefe("die Nummer liegt nicht mehr im Kreis", fahrt.nummerImKreis === false);
  pruefe("das Bild rollt weiter", fahrt.kreisWeg > 20, fahrt.kreisWeg + " px in 0,7 s");
  pruefe("die Nummer ist waehrend der Fahrt zu sehen", fahrt.nummerDa > 0,
    fahrt.nummerDa + " px breit");
  pruefe("und sie bleibt dabei stehen", fahrt.nummerWeg <= 1,
    fahrt.nummerWeg + " px (das Bild: " + fahrt.kreisWeg + " px)");
  pruefe("der verlassene Platz hat den gestrichelten Ring",
    /dashed/.test(fahrt.ring || ""), fahrt.ring || "-");

  console.log("\nGEMESSEN: DIE FAHRT KOMMT AN UND FLIEGT NICHT ZURUECK\n");
  const ende = await pg.evaluate(() => {
    const kreis = document.querySelector(".lc-platz-ich .lc-kreis");
    const a = kreis.getAnimations()[0];
    if (!a) return null;
    const bilder = a.effect.getKeyframes();
    const letzte = bilder[bilder.length - 1];
    return { letzte: String(letzte.transform || ""), anzahl: bilder.length };
  });
  pruefe("das letzte Bewegungsbild steht am ZIEL, nicht am Start",
    ende && !/translate\(0px, 0px\)/.test(ende.letzte),
    ende ? ende.letzte.slice(0, 64) : "keine Animation");

  console.log("\nGEMESSEN: DER WASSERSTRAHL BLEIBT IM BILD\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const wasser = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.wirkung("eimer", "Bea", "Alex");
    await new Promise((f) => setTimeout(f, 1200));
    const platz = [...document.querySelectorAll(".lc-platz")].find((p) => p.querySelector(".lc-eimer"));
    if (!platz) return null;
    const k = platz.querySelector(".lc-kreis").getBoundingClientRect();
    const st = platz.querySelector(".lc-eimer-strahl").getBoundingClientRect();
    return { unten: Math.round(st.bottom - k.bottom), links: Math.round(k.left - st.left),
             rechts: Math.round(st.right - k.right) };
  });
  pruefe("er endet ueber dem unteren Bildrand", wasser && wasser.unten < 0,
    wasser ? wasser.unten + " px (negativ = drinnen)" : "kein Eimer");
  pruefe("und steht auch seitlich nicht heraus",
    wasser && wasser.links <= 0 && wasser.rechts <= 0,
    wasser ? "links " + wasser.links + ", rechts " + wasser.rechts : "-");

  console.log("\nGEMESSEN: DER PEGEL STEIGT ERST, WENN WASSER KOMMT\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const pegel = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.wirkung("eimer", "Bea", "Alex");
    await new Promise((f) => setTimeout(f, 700));
    const platz = [...document.querySelectorAll(".lc-platz")].find((p) => p.querySelector(".lc-eimer"));
    const h = platz ? platz.querySelector(".lc-wasserstand").getBoundingClientRect().height : -1;
    return Math.round(h);
  });
  pruefe("nach 0,7 s ist der Pegel noch bei null", pegel === 0,
    pegel + " px (der Strahl setzt bei 0,68 s ein)");

  console.log("\nGEMESSEN: DER KREIS BLEIBT RUND, WENN ICH PAC-MAN BIN\n");
  await pg.evaluate(BRETT([7]));
  const pac = await pg.evaluate(async () => {
    const meiner = document.querySelector(".lc-platz-ich .lc-kreis");
    window.DMA_PRUEFUNG.wirkung("pacjagd", "Hana", "Alex");
    await new Promise((f) => setTimeout(f, 400));
    const st = getComputedStyle(meiner);
    return { clip: st.clipPath || st.webkitClipPath, rund: st.borderRadius,
             figur: Boolean(meiner.querySelector(".lc-pac-figur")) };
  });
  pruefe("kein clip-path auf dem Bild", /none/.test(pac.clip || "none"), pac.clip || "-");
  pruefe("der Kreis ist rund geblieben", /50%/.test(pac.rund || ""), pac.rund || "-");
  pruefe("und die Original-Figur liegt darueber", pac.figur === true);

  console.log("\nGEMESSEN: BILLARD STOESST IN EINE RICHTUNG\n");
  /* Ich sitze auf 1 (links), das Ziel auf 2, frei sind 3 und 4 —
     also rechts davon. Ein Loch LINKS von 2 gibt es nicht; die Kugel
     muss nach rechts. */
  await pg.evaluate(BRETT([3, 4]));
  const bil = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.wirkung("billard", "Bea", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const tasche = document.querySelector(".lc-billard-tasche");
    if (!tasche) return { nr: 0 };
    const platz = tasche.closest(".lc-platz");
    return { nr: Number(platz.dataset.lcPlatz) };
  });
  pruefe("das Loch liegt in Stossrichtung", bil.nr === 3 || bil.nr === 4,
    "Platz " + bil.nr + " (ich auf 1, Ziel auf 2 — also rechts)");

  console.log("\nGEMESSEN: DIE PEITSCHE REICHT BIS HINUEBER\n");
  await pg.evaluate(BRETT([8]));
  const peit = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.wirkung("peitsche", "Dana", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const leine = document.querySelector(".lc-leine-peitsche");
    if (!leine) return null;
    const seil = leine.querySelector(".lc-peitsche-seil");
    const ich = document.querySelector(".lc-platz-ich").getBoundingClientRect();
    const ziel = [...document.querySelectorAll(".lc-platz")]
      .find((p) => (p.querySelector(".lc-platz-name") || {}).textContent.trim() === "Dana")
      .getBoundingClientRect();
    return { laenge: Math.round(parseFloat(getComputedStyle(seil).width)),
             abstand: Math.round(Math.hypot(ziel.left - ich.left, ziel.top - ich.top)) };
  });
  pruefe("das Seil ist so lang wie der Weg", peit && peit.laenge > peit.abstand * 0.5,
    peit ? peit.laenge + " px Seil auf " + peit.abstand + " px Abstand" : "keine Peitsche");

  console.log("\nGEMESSEN: DIE NEUEN WIRKEN AUCH WIRKLICH\n");
  for (const [art, klasse] of [["licht", "lc-lichtaus"], ["muenze", "lc-muenze"],
       ["wischer", "lc-wischer"], ["zwille", "lc-zwille"], ["pusterohr", "lc-puste"],
       ["gluehbirne", "lc-birne"]]) {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    const r = await pg.evaluate(async ([a, k]) => {
      window.DMA_PRUEFUNG.wirkung(a, "Bea", "Alex");
      await new Promise((f) => setTimeout(f, 260));
      const schicht = document.querySelector("." + k);
      if (!schicht) return { da: false };
      const platz = schicht.closest(".lc-platz");
      const kreis = platz.querySelector(".lc-kreis");
      return { da: true, teile: schicht.children.length,
               amBild: kreis.getAnimations().length > 0 };
    }, [art, klasse]);
    pruefe("„" + art + "“ zeichnet und fasst das Bild an",
      r.da && r.teile > 0 && r.amBild,
      r.da ? r.teile + " Teile, Bild bewegt: " + r.amBild : "nichts gezeichnet");
  }

  console.log("\nGEMESSEN: DIE ENTBLOESSUNG NUR NEBENAN\n");
  await pg.evaluate(BRETT([8]));
  const nah = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.wirkung("entbloessung", "Bea", "Alex");   // Platz 2 — daneben
    await new Promise((f) => setTimeout(f, 260));
    const eins = Boolean(document.querySelector(".lc-entbl"));
    document.querySelectorAll(".lc-entbl").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("entbloessung", "Gero", "Alex");  // Platz 7 — weit weg
    await new Promise((f) => setTimeout(f, 260));
    return { daneben: eins, weit: Boolean(document.querySelector(".lc-entbl")) };
  });
  pruefe("nebenan geht es", nah.daneben === true);
  pruefe("und ueber den halben Raum nicht", nah.weit === false);

  pruefe("keine Fehler auf der Seite", aufSeite.length === 0,
    aufSeite.length ? aufSeite.join(" | ") : "keine");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 18 sitzt.\n");
  process.exit(fehler ? 1 : 0);
})();
