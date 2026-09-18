/* PRÜFT: ALTE BEDIENUNGSHINWEISE VERSCHWINDEN AUS DEM VERLAUF.
   ---------------------------------------------------------------
   GEWUENSCHT: „Alles, was ich im Chat gesammelt habe mit ,Du bist
   hier Haeuptling', das koennte auch wieder raus."

   Gemessen wird an einer Liste, die genau den Weg geht, den auch das
   Laden des Verlaufs nimmt — mit der Gegenprobe, dass kein Wort eines
   Menschen dabei verlorengeht, auch wenn es dieselben Woerter
   enthaelt. */
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
    const rein = [
      { id: "1", von: "", art: "system", text: "🦊 Du bist hier Häuptling — als Betreiber in jedem Raum. /t Thema · /i einladen" },
      { id: "2", von: "", art: "system", text: "Der Raum war leer — du bist hier Häuptling. /t Thema · /i Nickname einladen" },
      { id: "3", von: "emmy", name: "Emmy", art: "text", text: "Bist du hier Häuptling?" },
      { id: "4", von: "", art: "system", text: "✅ Emmy hat es richtig: „Der Hund läuft" },
      { id: "5", von: "emmy", name: "Emmy", art: "text", text: "Guten Morgen!" },
      { id: "6", von: "", art: "kommen", text: "Reza betritt den Raum." }
    ];
    return { raus: LiveChat.pruefMuellFiltern(rein).map((n) => n.id), vorher: rein.length };
  });

  const soll = ["3", "4", "5", "6"];
  const gut = JSON.stringify(erg.raus) === JSON.stringify(soll);
  console.log("");
  console.log("  Zeilen vorher: " + erg.vorher + "   danach: " + erg.raus.length);
  console.log("  " + (gut ? "ok   " : "FEHL ") + "geblieben sind: " + erg.raus.join(", ")
    + (gut ? "   (beide Häuptling-Hinweise raus, alles andere steht)" : "   erwartet: " + soll.join(", ")));
  console.log("\n  " + (gut ? "Der Verlauf ist sauber." : "1 Abweichung") + "\n");
  await br.close(); srv.close();
  process.exit(gut ? 0 : 1);
})();
