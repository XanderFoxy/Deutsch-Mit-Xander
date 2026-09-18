/* PRÜFT DEN NOTENKNOPF AN DER NACHRICHT.
   ---------------------------------------------------------------
   GEMELDET: „Es gibt keine Notenanzeige, nachdem sie mir den Satz
   geschickt hat."
   Und früher, genauso deutlich: „Bei normalen Nachrichten soll dieses
   Zensieren nicht dabeistehen."

   Beides muss gleichzeitig stimmen. Gemessen wird deshalb an vier
   Zeilen, jeweils mit ausgeschaltetem und mit eingeschaltetem
   Notenschalter — in der echten App, nicht an einem Nachbau. */
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

  const lauf = async (an) => pg.evaluate((schalterAn) => {
    LiveChat.binLehrer = () => true;          // wir prüfen die Lehrersicht
    document.querySelectorAll(".lc-chat").forEach((e) => e.remove());
    const chat = document.createElement("div");
    chat.className = "lc-chat";
    chat.innerHTML = '<div class="lc-verlauf-huelle"><div class="lc-chat-verlauf" id="lcVerlauf"></div></div>';
    document.body.appendChild(chat);
    window.DMA_PRUEFUNG.notenSchalter(schalterAn);
    const t = Date.now();
    window.DMA_PRUEFUNG.chatStand([
      { id: "a", von: "emmy", name: "Emmy", text: "Der Hund läuft über die Wiese", art: "text", zeit: t },
      { id: "b", von: "emmy", name: "Emmy", text: "Der Hund läuft", art: "text", zeit: t, versuch: true, richtig: false },
      { id: "c", von: "ich", eigen: true, name: "Xander", text: "Sehr gut!", art: "text", zeit: t },
      { id: "d", von: "emmy", name: "Emmy", text: "", art: "text", zeit: t, sprach: "data:audio/webm;base64,AA" }
    ]);
    return window.DMA_PRUEFUNG.notenKnoepfe();
  }, an);

  let fehler = 0;
  const erwartet = {
    aus: { "Der Hund läuft über die Wiese": false, "Der Hund läuft": true, "Sehr gut!": false },
    an:  { "Der Hund läuft über die Wiese": true,  "Der Hund läuft": true, "Sehr gut!": false }
  };
  for (const [wie, schalter] of [["SCHALTER AUS", false], ["SCHALTER AN", true]]) {
    const zeilen = await lauf(schalter);
    console.log("\n  " + wie);
    zeilen.forEach((z) => {
      const name = z.text || "(Sprachnachricht)";
      const soll = erwartet[schalter ? "an" : "aus"][z.text];
      const gut = soll === undefined ? !z.note : z.note === soll;
      if (!gut) fehler++;
      console.log("    " + (gut ? "ok   " : "FEHL ") + (z.note ? "Notenknopf   " : "kein Knopf   ") + name);
    });
  }
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Alles wie gewuenscht.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
