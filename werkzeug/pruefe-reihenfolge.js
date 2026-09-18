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
    const ankunft = [
      { von: "emmy", zeit: 3000, wort: "drittens" },
      { von: "emmy", zeit: 1000, wort: "erstens"  },
      { von: "emmy", zeit: 2000, wort: "zweitens" }
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
  await br.close(); srv.close();
})();
