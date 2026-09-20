/* IST JEDE ANIMATION AUCH AUFRUFBAR?
   ---------------------------------------------------------------
   GEMELDET, dreimal: „Die Keks-Animation fehlt. Die Cash-Animation
   fehlt. Das mit dem zerbrochenen Glas geht nicht. Die Animationen,
   die du neu gemacht hast, sind noch nicht aufrufbar."

   Er hatte jedes Mal recht, und ich habe jedes Mal das Falsche
   geprueft: ich habe die ZEICHNUNG ausgeloest und fotografiert —
   und die lief. Nur kam man per Befehl gar nicht hin, weil der Name
   in der Tabelle WETTER fehlte. Die Tuer war zu, und ich habe immer
   nur nachgesehen, ob das Zimmer dahinter moebliert ist.

   Diese Pruefung haelt beide Listen gegeneinander. Sie kann nichts
   ueber die Schoenheit einer Animation sagen — dafuer gibt es
   effektbild.js — aber sie kann sagen, ob man sie erreicht. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
              ".json":"application/json", ".svg":"image/svg+xml", ".mp3":"audio/mpeg" };
(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const port = srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 760 } });
  await pg.goto("http://127.0.0.1:" + port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);

  const d = await pg.evaluate(() => ({
    gezeichnet: window.DMA_PRUEF.effektNamen(),
    aufrufbar: window.LiveChat.effektBefehle(),
    /* NEU NACH RUNDE 18: nicht nur „gibt es die Wirkung", sondern
       auch „geht das Befehlswort ueberhaupt hinaus". Das eine stand
       in AM_PLATZ, das andere in BEFEHLE — und weil nur das erste
       geprueft wurde, sind sieben Effekte still liegengeblieben:
       „Da kommt bei den genannten Effekten immer die Eingabe in das
       Chat-Zeilen-Fenster und wartet auf irgendeinen Befehl." */
    woerter: window.LiveChat.pruefEffektWoerter
      ? window.LiveChat.pruefEffektWoerter().map(function (w) {
          return { w: w, bekannt: window.LiveChat.pruefBefehlBekannt(w) };
        })
      : [],
    befehle: window.LiveChat.befehlsliste().map((b) => b.w),
  }));
  const ruf = new Set(d.aufrufbar), bef = new Set(d.befehle);
  /* Nur die Ganzseitigen und die Gezielten muessen erreichbar sein;
     „fluester" ist kein Effekt zum Ausloesen. */
  const egal = new Set(["fluester", "umarmen", "lachen",
    /* DIE ALTEN NAMEN DER FILME.
       Die sieben Filme hiessen bis Fassung 337 „ggtrex", „gglok" und
       so weiter. Sie heissen jetzt wie ihr Befehl (/trex, /lok …);
       die alten Namen stehen in LC_EFFEKTE nur noch da, damit eine
       Zeile von einem Geraet mit der alten Fassung nicht ins Leere
       laeuft. Einen BEFEHL dazu darf es bewusst nicht mehr geben —
       darum gehoeren sie hier hin und nicht in die Fehlerliste. */
    "ggloewe", "ggtrex", "ggadler", "gglok", "gglok2",
    "ggraumschiff", "gguboot"]);
  const ohneTuer = d.gezeichnet.filter((e) => !ruf.has(e) && !egal.has(e));
  const ohneBefehl = d.gezeichnet.filter((e) => !bef.has(e) && !egal.has(e)
    && !["lecken", "boxen", "handdurch"].includes(e));

  console.log(d.gezeichnet.length + " Effekte gezeichnet, "
    + d.aufrufbar.length + " ueber Befehle erreichbar.\n");
  if (ohneTuer.length) {
    console.log("❌ GEZEICHNET, ABER NICHT AUFRUFBAR (" + ohneTuer.length + "):");
    ohneTuer.forEach((e) => console.log("     " + e));
  } else console.log("  ✓ jede gezeichnete Animation ist auch aufrufbar");
  if (ohneBefehl.length) {
    console.log("\n⚠  kein eigener Befehl (ueber Kurzwort o. ae. erreichbar): " + ohneBefehl.join(", "));
  }
  /* UND DAS HARTE KRITERIUM: geht das Wort ueberhaupt hinaus?
     Ein Effekt, dessen Befehlswort befehlBekannt() nicht kennt,
     wird als Vertipper abgewiesen — die Zeile geht NICHT hinaus,
     und der Effekt ist damit tot, egal wie gut er gezeichnet ist.
     Genau so sind in Fassung 360 sieben Effekte liegengeblieben. */
  const stumm = (d.woerter || []).filter((x) => !x.bekannt).map((x) => x.w);
  if (stumm.length) {
    console.log("\n❌ BEFEHLSWORT WIRD ABGEWIESEN, DIE ZEILE GEHT NICHT HINAUS ("
      + stumm.length + "):");
    stumm.forEach((w) => console.log("     /" + w + "   fehlt in BEFEHLE"));
  } else {
    console.log("  ✓ jedes Effektwort geht auch wirklich hinaus   "
      + (d.woerter || []).length + " Woerter");
  }
  await br.close(); srv.close();
  process.exit(ohneTuer.length || stumm.length ? 1 : 0);
})();
