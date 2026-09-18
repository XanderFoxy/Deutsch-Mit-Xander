/* PRÜFT DIE REIHENFOLGE DER SPRACHSTÜCKE.
   ---------------------------------------------------------------
   GEMELDET: „Emmys Nachrichten sind kaum zu verstehen. Das klingt
   so, als wenn sie rückwärts spricht."

   Nachgestellt wird genau der Fall, der das erzeugt: ein LANGES
   Stück braucht mehrere Pakete und ist deshalb erst spät komplett;
   ein kürzeres, das SPÄTER gesprochen wurde, ist schon fertig.
   Die Reihe muss trotzdem nach der SPRECHZEIT abspielen, nicht nach
   der Ankunft. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".png":"image/png" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 430, height: 880 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2400);

  const erg = await pg.evaluate(() => {
    if (!window.LiveChat || !LiveChat.pruefEinreihen) return "Prüfnaht fehlt";
    /* Emmy spricht drei Sätze: t=1000, t=2000, t=3000.
       Sie kommen aber in dieser Reihenfolge an: 3000, 1000, 2000 —
       weil das erste Stück in Paketen kam und länger brauchte. */
    /* Echte Zeiten, keine aus dem Jahr 1970 — die Reihe wirft
       alles weg, was aelter als anderthalb Minuten ist, und das ist
       auch richtig so. */
    const jetzt = Date.now();
    const ankunft = [
      { von: "emmy", zeit: jetzt - 1000, wort: "drittens" },
      { von: "emmy", zeit: jetzt - 3000, wort: "erstens"  },
      { von: "emmy", zeit: jetzt - 2000, wort: "zweitens" }
    ];
    return LiveChat.pruefEinreihen(ankunft);
  });

  console.log("");
  if (typeof erg === "string") console.log("  " + erg);
  else {
    console.log("  Angekommen in dieser Reihenfolge: drittens, erstens, zweitens");
    console.log("  Abgespielt wird              : " + erg.join(", "));
    const richtig = erg.join(",") === "erstens,zweitens,drittens";
    console.log("  " + (richtig ? "Richtig — nach der Sprechzeit, nicht nach der Ankunft."
                                : "FALSCH — es klänge weiter wie rückwärts geredet."));
  }
  /* Und: dieselbe Aufnahme darf nicht zweimal in die Reihe.
     GEMELDET: „Manchmal kommt meine Sprachaufnahme doppelt." */
  const doppelt = await pg.evaluate(() => {
    if (!window.LiveChat || !LiveChat.pruefEinreihen) return null;
    const gleich = Date.now();
    const eine = { von: "xander", zeit: gleich, wort: "hallo", sprach: "AAAABBBBCCCC", sprachSek: 2 };
    /* Zweimal dasselbe, mit anderer Kennung — so wie es passiert,
       wenn der Rekorder sein Stueck nachliefert. */
    return LiveChat.pruefEinreihen([
      Object.assign({}, eine, { id: "a" }),
      Object.assign({}, eine, { id: "b", zeit: gleich + 300 })
    ]);
  });
  if (doppelt) {
    console.log("");
    console.log("  Dieselbe Aufnahme zweimal eingereicht -> in der Reihe: " + doppelt.length
      + (doppelt.length === 1 ? "  (einmal, richtig)" : "  FALSCH — sie kaeme doppelt"));
  }
  /* Und: die Reihe darf sich nicht stapeln.
     GEMELDET (Screenshot): „Xander Fox spricht · noch 20 in der Reihe." */
  const reihe = await pg.evaluate(() => {
    if (!window.LiveChat || !LiveChat.pruefEinreihen) return null;
    const jetzt = Date.now();
    const zwanzig = [];
    for (let i = 0; i < 20; i++) {
      zwanzig.push({ von: "xander", zeit: jetzt + i, wort: "nr" + i,
                     sprach: "X".repeat(10 + i), sprachSek: 1 + i });
    }
    const raus = LiveChat.pruefEinreihen(zwanzig);
    /* Und etwas Altes (fuenf Minuten her) darf gar nicht erst hinein. */
    const alt = LiveChat.pruefEinreihen([
      { von: "xander", zeit: jetzt - 300000, wort: "uralt", sprach: "AAA", sprachSek: 9 }
    ]);
    return { vonZwanzig: raus.length, letzte: raus, altDrin: alt.length };
  });
  if (reihe) {
    console.log("");
    console.log("  Zwanzig Wortmeldungen auf einmal -> in der Reihe: " + reihe.vonZwanzig
      + (reihe.vonZwanzig === 1 ? "  (nur die aktuelle, richtig)" : "  FALSCH"));
    console.log("  Es bleiben die NEUESTEN            : " + reihe.letzte.join(", "));
    console.log("  Fuenf Minuten alte Wortmeldung    : "
      + (reihe.altDrin === 0 ? "kommt gar nicht erst in die Reihe" : "FALSCH — sie waere drin"));
  }
  /* Dieselbe Kennung darf NIE ein zweites Mal in die Reihe —
     auch nicht Minuten spaeter.
     GEMELDET: „Ich hoere ihre Sprachnachrichten ploetzlich doppelt." */
  const spaeter = await pg.evaluate(() => {
    if (!window.LiveChat || !LiveChat.pruefEinreihen) return null;
    const t0 = Date.now();
    const erste = LiveChat.pruefEinreihen([
      { id: "abc-1", von: "emmy", zeit: t0, wort: "eins", sprach: "QQQQ", sprachSek: 3 }
    ]);
    /* Jetzt dieselbe Aufnahme noch einmal — einmal als „…-selbst",
       einmal nachgereicht. Beide meinen dasselbe. */
    const zweite = LiveChat.pruefEinreihen([
      { id: "abc-1-selbst", von: "emmy", zeit: t0, wort: "eins", sprach: "QQQQ", sprachSek: 3 },
      { id: "abc-1", von: "emmy", zeit: t0, wort: "eins", sprach: "QQQQ", sprachSek: 3 }
    ]);
    return { erste: erste.length, zweite: zweite.length };
  });
  if (spaeter) {
    console.log("");
    console.log("  Erste Zustellung          -> in der Reihe: " + spaeter.erste);
    console.log("  Dieselbe Kennung nochmal  -> in der Reihe: " + spaeter.zweite
      + (spaeter.zweite === 0 ? "  (gar nicht — richtig)" : "  FALSCH — sie kaeme doppelt"));
  }
  await br.close(); srv.close();
})();
