/* PRÜFT: WER IN EINEN ANDEREN RAUM GEHT, HAT NICHT „VERLASSEN".
   ---------------------------------------------------------------
   GEWUENSCHT: „Wenn man einen Raum verlaesst auf die Art, dass man
   einen anderen Raum erzeugt, dann soll im Chat stehen: ,Emmi ist in
   den Raum Langeweile gegangen' — nicht nur ,sie hat den Raum
   verlassen'. Nur sie hat den Raum verlassen, wenn sie wirklich was
   anderes gemacht hat."

   Gemessen wird beides: das Abschiedspaket MIT Ziel (Raumwechsel) und
   OHNE (echtes Weggehen) — und dazu, dass ein Raumwechsel das Ziel
   ueberhaupt mitschickt. */
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
  await pg.waitForTimeout(2300);

  const erg = await pg.evaluate(() => {
    const letzte = () => {
      const l = LiveChat.lage().nachrichten;
      return l.length ? l[l.length - 1].text : "";
    };
    const daSein = (id, name) => LiveChat.pruefEmpfangen({ art: "puls", von: id, name: name });

    daSein("emmy1", "Emmy");
    LiveChat.pruefEmpfangen({ art: "tschuess", von: "emmy1",
                              wohin: "langeweile", wohinName: "Langeweile" });
    const gewechselt = letzte();

    daSein("emmy2", "Emmy");
    LiveChat.pruefEmpfangen({ art: "tschuess", von: "emmy2" });
    const weggegangen = letzte();

    LiveChat.pruefEmpfangen({ art: "hallo", von: "reza1", name: "Reza" });
    const gekommen = letzte();

    /* Und schickt ein Raumwechsel das Ziel ueberhaupt mit? Die Pakete
       abfangen, ohne dass ein Raum offen sein muss. */
    const pakete = [];
    LiveChat.pruefAbfangen((p) => pakete.push(p));
    LiveChat.verlassen("langeweile");
    LiveChat.pruefAbfangen(null);
    const abschied = pakete.filter((p) => p.art === "tschuess");

    return { gewechselt, weggegangen, gekommen,
             abschiedPakete: abschied.length,
             abschiedZiel: abschied.length ? (abschied[0].wohinName || "") : "" };
  });

  let fehler = 0;
  const pruefe = (was, ist, soll) => {
    const gut = ist === soll;
    if (!gut) fehler++;
    console.log("  " + (gut ? "ok   " : "FEHL ") + was.padEnd(30) + "„" + ist + "“"
      + (gut ? "" : "   erwartet: „" + soll + "“"));
  };
  console.log("");
  pruefe("wechselt den Raum", erg.gewechselt, "Emmy ist in den Raum „Langeweile“ gegangen.");
  pruefe("geht wirklich weg", erg.weggegangen, "Emmy hat den Raum verlassen.");
  pruefe("kommt herein", erg.gekommen, "Reza betritt den Raum.");
  console.log("");
  if (erg.abschiedPakete !== 1) {
    console.log("  FEHL Abschiedspakete beim Raumwechsel: " + erg.abschiedPakete + "   (erwartet: 1)");
    fehler++;
  } else {
    const gut = erg.abschiedZiel === "Langeweile";
    if (!gut) fehler++;
    console.log("  " + (gut ? "ok   " : "FEHL ") + "der Abschied nimmt das Ziel mit: „" + erg.abschiedZiel + "“");
  }
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Der Unterschied steht.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
