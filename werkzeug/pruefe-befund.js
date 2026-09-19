/* PRÜFT DEN BEFUND (/diagnose): LEITUNG, REIHE UND UHREN.
   ---------------------------------------------------------------
   Nach dem heutigen Fund — Emmy hörte nichts, weil zwei Uhren
   auseinandergingen — gehört diese Auskunft dorthin, wo man sie
   sucht: in den Befund. Er sagt jetzt auch, ob die Leitung frei ist,
   wie viele Wortmeldungen warten, ob Zeilen auf das Netz warten und
   wie weit die Uhren der anderen auseinandergehen.

   Gemessen wird an einem Raum mit zwei Leuten, von denen einer eine
   Uhr hat, die zwei Minuten nachgeht. */
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
  const pg = await br.newPage({ viewport: { width: 390, height: 800 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2300);

  const erg = await pg.evaluate(() => {
    LiveChat.pruefRaum("probe-befund");
    /* Emmy meldet sich — mit einer Uhr, die zwei Minuten nachgeht. */
    const spaet = Date.now() - 120000;
    for (let i = 0; i < 4; i++) {
      LiveChat.pruefEmpfangen({ art: "puls", von: "emmy", name: "Emmy", zeit: spaet });
    }
    /* Und Reza, dessen Uhr stimmt. */
    LiveChat.pruefEmpfangen({ art: "puls", von: "reza", name: "Reza", zeit: Date.now() });
    const uhren = LiveChat.uhrenStand();

    /* Eine laufende Wortmeldung und eine Zeile ohne Netz. */
    LiveChat.liveLaeuft({ von: "emmy", name: "Emmy", sek: 12 });
    LiveChat.schreiben("Diese Zeile wartet auf das Netz");

    /* Und jetzt der Befund selbst. */
    const vorher = LiveChat.lage().nachrichten.length;
    LiveChat.pruefBefehl("/diagnose");
    const liste = LiveChat.lage().nachrichten;
    const befund = liste[liste.length - 1];
    return { uhren: uhren, text: (befund && befund.text) || "", vorher: vorher };
  });

  let fehler = 0;
  const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
  const zeile = (anfang) => (erg.text.split("\n").find((z) => z.trim().indexOf(anfang) === 0) || "").trim();

  console.log("\n  WAS DER BEFUND SAGT");
  ok(zeile("Leitung").indexOf("Emmy spricht") > 0, "die Leitung", "„" + zeile("Leitung") + "“");
  ok(zeile("wartet auf Netz").length > 0, "was auf das Netz wartet", "„" + zeile("wartet auf Netz") + "“");
  const uhrZeile = erg.text.split("\n").find((z) => z.indexOf("Uhr von Emmy") >= 0) || "";
  ok(uhrZeile.indexOf("NACH") > 0, "und die Uhr, die nachgeht", "„" + uhrZeile.trim() + "“");
  ok(!/Uhr von Reza/.test(erg.text), "eine richtig gehende Uhr wird nicht erwähnt");

  console.log("\n  UND DIE MESSUNG DAHINTER");
  const e = erg.uhren.find((u) => u.name === "Emmy");
  const r = erg.uhren.find((u) => u.name === "Reza");
  ok(e && Math.abs(e.versatz + 120000) < 8000, "Emmys Uhr: gemessener Unterschied",
     e ? Math.round(e.versatz / 1000) + " s" : "keiner");
  ok(r && Math.abs(r.versatz) < 5000, "Rezas Uhr: kein nennenswerter Unterschied",
     r ? Math.round(r.versatz / 1000) + " s" : "keiner");
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Der Befund sagt, was los ist.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
