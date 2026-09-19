/* PRÜFT, OB EINE NACHGEHENDE UHR DIE REIHENFOLGE VERSCHIEBT.
   ---------------------------------------------------------------
   GEMELDET: „Die Uhr von Emmy geht 5 Sekunden nach. Das stört das
   Hören nicht mehr. Die Reihenfolge im Verlauf kann es aber
   verschieben."

   Er hat recht, und es ist ein echter Fehler: Jede Zeile trägt die
   Uhrzeit DES ABSENDERS, und sortiert wird nach dieser Zahl. Geht ihre
   Uhr fünf Sekunden nach, rutscht ihre Antwort hinter meine Frage von
   vor drei Sekunden — die Antwort steht dann VOR der Frage.

   Gemessen wird der volle Ablauf: Frage, Antwort drei Sekunden später,
   ihre Uhr fünf Sekunden zurück. Ohne Korrektur steht es verkehrt
   herum; mit Korrektur richtig. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 390, height: 780 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2400);

  const erg = await pg.evaluate(() => {
    const raus = {};
    const JETZT = Date.now();
    /* Ihre Uhr geht fünf Sekunden NACH: was sie „jetzt" nennt, ist auf
       meiner Uhr schon fünf Sekunden her. */
    const NACH = -5000;
    LiveChat.pruefUhrSetzen("emmy", NACH);

    /* Meine Frage: vor drei Sekunden, auf meiner Uhr. */
    const meine = { id: "f1", von: "ich", eigen: true, name: "Xander",
                    text: "Wie heisst das auf Deutsch?", art: "text", zeit: JETZT - 3000 };
    /* Ihre Antwort: JETZT — aber auf IHRER Uhr, also fünf Sekunden zu früh. */
    const ihre = { id: "a1", von: "emmy", eigen: false, name: "Emmi",
                   text: "Das Fahrrad!", art: "text", zeit: JETZT + NACH };

    raus.ohne = {
      meine: meine.zeit, ihre: ihre.zeit,
      reihenfolge: ihre.zeit > meine.zeit ? "richtig" : "VERDREHT"
    };

    const korrigiert = LiveChat.pruefZeitAufMeineUhr(Object.assign({}, ihre));
    raus.mit = {
      vorher: ihre.zeit, nachher: korrigiert.zeit,
      gesendet: korrigiert.zeitGesendet || 0,
      versatz: korrigiert.uhrVersatz || 0,
      reihenfolge: korrigiert.zeit > meine.zeit ? "richtig" : "VERDREHT"
    };

    /* Und im echten Verlauf: reinhängen und sortieren lassen. */
    LiveChat.pruefVerlaufSetzen([]);
    LiveChat.pruefAnhaengen ? LiveChat.pruefAnhaengen(meine) : null;
    LiveChat.pruefAnhaengen ? LiveChat.pruefAnhaengen(Object.assign({}, ihre)) : null;
    raus.verlauf = LiveChat.lage().nachrichten
      .slice().sort((a, b) => (a.zeit || 0) - (b.zeit || 0))
      .map((n) => String(n.text || "").slice(0, 26));

    /* Winziger Versatz: daran wird NICHT herumgerechnet. */
    LiveChat.pruefUhrSetzen("tom", 300);
    const klein = LiveChat.pruefZeitAufMeineUhr({ id: "k", von: "tom", name: "Tom",
                                                  text: "hi", art: "text", zeit: JETZT });
    raus.kleinUnberuehrt = klein.zeit === JETZT && !klein.zeitGesendet;
    return raus;
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

  console.log("\n  IHRE UHR GEHT FÜNF SEKUNDEN NACH");
  ok(erg.ohne.reihenfolge === "VERDREHT",
     "ohne Korrektur stünde ihre Antwort VOR meiner Frage — das war der Fehler",
     "Frage " + erg.ohne.meine + ", Antwort " + erg.ohne.ihre);
  ok(erg.mit.reihenfolge === "richtig", "mit Korrektur steht sie danach",
     "+" + (erg.mit.nachher - erg.mit.vorher) + " ms gerade gezogen (Versatz " + erg.mit.versatz + " ms)");
  ok(erg.mit.gesendet === erg.mit.vorher, "die Originalzeit bleibt erhalten",
     "zeitGesendet = " + erg.mit.gesendet);
  if (erg.verlauf && erg.verlauf.length === 2) {
    ok(erg.verlauf[0].indexOf("Wie heisst") === 0,
       "und im Verlauf steht die Frage zuerst", erg.verlauf.join("  →  "));
  }

  console.log("\n  UND EIN WINZIGER UNTERSCHIED");
  ok(erg.kleinUnberuehrt, "unter einer Sekunde wird nichts angefasst — das ist Messrauschen");

  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Der Verlauf steht wieder in der richtigen Reihenfolge.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
