#!/usr/bin/env node
/* =========================================================
   PRUEFT: ZEIGT EIN GESCHENK JETZT DEN FILM?
   ---------------------------------------------------------
   GEWUENSCHT: „Man sieht die nur noch nicht — baue das bitte
   mit ein in die Tiere und Fahrzeuge."
   GEMELDET:   „Ich habe auch /trex versucht, aber das geht nicht."

   Genau daran lag es: /trex ist der GESCHENK-Befehl und zeigte
   die gezeichnete Figur, nicht den Film. Diese Sonde fuehrt die
   Geschenk-Befehle an der echten Seite aus und misst, ob danach
   eine Filmschicht mit laufendem Video daliegt — und ob „/film"
   ohne Namen die vorhandenen Filme aufzaehlt, statt raten zu
   lassen. Behauptet wird nichts.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webm": "video/webm", ".mp4": "video/mp4",
  ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

/* Welcher Geschenk-Befehl soll welchen Film zeigen? Genau die, zu
   denen eine Datei in filme/ liegt. Fuer alles andere (Elefant,
   Hai, Baer) bleibt es bei der Zeichnung — das ist kein Fehler. */
/* Welches grosse Geschenk soll welchen Film zeigen? Genau die, zu
   denen eine Datei in filme/ liegt. Fuer alles andere (Elefant, Hai,
   Baer) bleibt es bei der Zeichnung — das ist kein Fehler.

   ANGEFASST WIRD DIE WIRKUNG, NICHT DER BEFEHL.
   Erster Entwurf tippte „/trex" ein und wartete auf den Film. Der kam
   nicht — aber nicht, weil etwas kaputt ist: der Geschenk-Befehl
   VERSCHICKT nur eine Zeile, und gezeigt wird das Geschenk erst, wenn
   diese Zeile ankommt. Ohne Netz kommt sie nie an. Also wird hier
   dieselbe Tuer benutzt, durch die auch die ankommende Zeile geht:
   DMA_PRUEF.effekt("ggtrex"). Das ist der Weg, den es im Betrieb
   wirklich nimmt. */
const PAARE = [
  ["trex",       "/trex",       "trex"],
  ["loewe",      "/loewe",      "loewe"],
  ["adler",      "/adler",      "adler"],
  /* Seit Fassung 349 gibt es nur noch EINE Lok: die bunte,
     traditionelle. Im Ordner heisst ihre Datei weiterhin „lok2" —
     der Befehl /lok zeigt auf sie. Die schwarze ist heraus, das
     spart 1,84 MB. */
  ["lok",        "/lok",        "lok2"],
  ["zug",        "/zug",        "lok2"],
  ["raumschiff", "/raumschiff", "raumschiff"],
  ["uboot",      "/uboot",      "uboot"],
  /* Diese beiden sind KEINE Geschenke, sondern seit jeher
     gezeichnete Animationen. Sie zeigen den Film jetzt trotzdem,
     weil eine Datei in filme/ genauso heisst wie der Effekt — und
     fallen auf die Zeichnung zurueck, wenn er fehlt. */
  ["schlitten",    "/schlitten",  "schlitten"],
  ["katze",        "/katze",      "katze"]
];

(async () => {
  console.log("\nLIEGEN DIE FILME UEBERHAUPT DA?\n");
  const liste = path.join(WURZEL, "filme", "liste.json");
  const hatListe = fs.existsSync(liste);
  pruefe("filme/liste.json ist da", hatListe);
  const namen = hatListe ? (JSON.parse(fs.readFileSync(liste, "utf8")).filme || []).map((f) => f.name) : [];
  PAARE.forEach(([, , f]) => {
    const w = path.join(WURZEL, "filme", f + ".webm");
    const m = path.join(WURZEL, "filme", f + "-maske.mp4");
    pruefe("Film „" + f + "“ vollstaendig (webm + Maske + Liste)",
      fs.existsSync(w) && fs.existsSync(m) && namen.indexOf(f) >= 0);
  });

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
  const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  const da = await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl,
    { timeout: 20000 }).then(() => true).catch(() => false);
  pruefe("LiveChat ist geladen", da);
  if (!da) { await br.close(); srv.close(); process.exit(1); }

  await pg.evaluate(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne());

  console.log("\nZEIGT DAS GROSSE GESCHENK DEN FILM?\n");
  for (const [wirkung, befehl, film] of PAARE) {
    await pg.evaluate(() => document.querySelectorAll(".dma-film, #lcGrossGeschenk").forEach((e) => e.remove()));
    const erkannt = await pg.evaluate((b) => {
      try { return Boolean(window.LiveChat.pruefBefehl(b)); } catch (e) { return "AUSNAHME: " + e.message; }
    }, befehl);
    pruefe(befehl + " wird als Befehl erkannt", erkannt === true, String(erkannt));

    const los = await pg.evaluate((w) => {
      try { return window.DMA_PRUEF.effekt(w); } catch (e) { return { fehler: String(e.message || e) }; }
    }, wirkung);
    if (los && los.fehler) pruefe(wirkung + " laesst sich ausloesen", false, los.fehler);

    const kam = await pg.waitForFunction(() => {
      const s = document.querySelector(".dma-film");
      if (!s) return false;
      const v = s.querySelector("video"), c = s.querySelector("canvas");
      return Boolean((v && v.currentTime > 0.2) || c);
    }, { timeout: 25000 }).then(() => true).catch(() => false);
    const zeug = await pg.evaluate(() => {
      const s = document.querySelector(".dma-film");
      const v = s && s.querySelector("video");
      return { schicht: !!s, kasten: !!document.getElementById("lcGrossGeschenk"),
        grund: (window.DMA_FILM_GRUND && window.DMA_FILM_GRUND()) || "",
        zeit: v ? +v.currentTime.toFixed(2) : -1,
        groesse: v ? v.videoWidth + "x" + v.videoHeight : "-" };
    });
    pruefe(befehl + " zeigt den Film „" + film + "“", kam,
      "Zeit " + zeug.zeit + " s, " + zeug.groesse
        + (zeug.kasten ? ", Kiste statt Film!" : "") + (zeug.grund ? ", " + zeug.grund : ""));
    await pg.evaluate(() => document.querySelectorAll(".dma-film, #lcGrossGeschenk").forEach((e) => e.remove()));
  }

  /* =========================================================
     KLINGT ES NOCH NACH EINEM GESCHENK?
     ---------------------------------------------------------
     GEWUENSCHT: „Das soll nicht mir eine geschenkorientiert sein,
     diese neuen Sachen … da soll nur der Befehl /trex sein und dann
     soll ein passender Spruch kommen: Xander Fox laesst seinen
     T-Rex los. Bei den anderen soll sich das auch nicht nach
     Geschenken anhoeren."

     Geprueft wird deshalb die ZEILE, die der Befehl schreibt —
     nicht meine Absicht. „schenkt", „schickt allen" und „Geschenk"
     duerfen darin nicht mehr vorkommen.
     ========================================================= */
  console.log("\nKLINGT ES NOCH NACH GESCHENK?\n");
  for (const [, befehl] of PAARE) {
    const zeile = await pg.evaluate((bf) => {
      let raus = null;
      window.LiveChat.pruefPost((pk) => { if (!raus) raus = pk; });
      window.LiveChat.pruefBefehl(bf);
      window.LiveChat.pruefPost(null);
      return raus ? String(raus.text || "") : "";
    }, befehl);
    pruefe(befehl + " schreibt einen Satz", Boolean(zeile), zeile);
    pruefe(befehl + " verschenkt nichts",
      Boolean(zeile) && !/schenkt|schickt allen|Geschenk/i.test(zeile), zeile);
  }
  await pg.evaluate(() => document.querySelectorAll(".dma-film, #lcGrossGeschenk").forEach((e) => e.remove()));

  console.log("\nSTEHEN SIE BEI DEN TIEREN UND FAHRZEUGEN?\n");
  const einsortiert = await pg.evaluate(() => {
    const liste = window.LiveChat.befehlsliste() || [];
    const wo = {};
    liste.forEach((b) => { wo[b.w] = b.gr; });
    return wo;
  });
  [["trex", "tiere"], ["loewe", "tiere"], ["adler", "tiere"], ["katze", "tiere"],
   ["lok", "fahrzeuge"], ["uboot", "fahrzeuge"],
   ["raumschiff", "fahrzeuge"], ["schlitten", "fahrzeuge"]].forEach(([w, gr]) => {
    pruefe("/" + w + " steht unter „" + gr + "\u201c", einsortiert[w] === gr,
      einsortiert[w] || "gar nicht in der Liste");
  });
  pruefe("„/ufo\u201c fuehrt zum Raumschiff",
    await pg.evaluate(() => {
      const l = window.LiveChat.befehlsliste() || [];
      return l.some((b) => b.w === "raumschiff" && b.kurz === "ufo");
    }));

  console.log("\nUND „/film\" OHNE NAMEN?\n");
  await pg.evaluate(() => { try { window.LiveChat.pruefBefehl("/film"); } catch (e) {} });
  await pg.waitForTimeout(2000);
  /* Die Zeile haengt im Chat, nicht im Dokument der Sonde — deshalb
     wird sie dort gelesen, wo sie wirklich entsteht. */
  const text = await pg.evaluate(() => (window.LiveChat.pruefZeilen(5) || []).join("\n"));
  const nennt = PAARE.every(([, , f]) => text.indexOf("/film " + f) >= 0);
  pruefe("„/film“ ohne Namen zaehlt alle Filme auf", nennt,
    nennt ? "" : "gefunden: " + PAARE.map(([, , f]) => f + (text.indexOf("/film " + f) >= 0 ? "+" : "-")).join(" "));

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Geschenke zeigen ihre Filme.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
