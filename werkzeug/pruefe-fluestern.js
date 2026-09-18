/* PRÜFT: EIN TIPP AUF EINE FLÜSTERZEILE BEREITET DIE ANTWORT VOR.
   ---------------------------------------------------------------
   GEWUENSCHT: „Wenn man eine zugefluesterte Zeile antippt, dann soll
   in dem ,Schreib etwas'-Feld direkt die Formatierung schon so
   dastehen, dass man diesem Menschen fluestern antworten kann."

   Gemessen wird, was nach dem Tipp wirklich im Schreibfeld steht —
   bei einer fremden Fluesterzeile, bei der eigenen (dort ist der
   Empfaenger gemeint) und, als Gegenprobe, bei einer gewoehnlichen
   Zeile, die das Feld nicht anfassen darf. */
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
    document.querySelectorAll(".lc-chat").forEach((e) => e.remove());
    const chat = document.createElement("div");
    chat.className = "lc-chat";
    chat.innerHTML = '<div class="lc-verlauf-huelle"><div class="lc-chat-verlauf" id="lcVerlauf"></div></div>'
      + '<form><input type="text" class="lc-chat-feld" id="lcFeld"></form>';
    document.body.appendChild(chat);
    const t = Date.now() - 600000;
    window.DMA_PRUEFUNG.chatStand([
      { id: "f1", von: "e", name: "Emmy Fuchs", text: "psst, verstehst du das?", art: "fluester", zeit: t },
      { id: "f2", von: "ich", eigen: true, name: "Xander", wen: "Reza", text: "an Reza: bis gleich", art: "fluester", zeit: t },
      { id: "n1", von: "e", name: "Emmy Fuchs", text: "Guten Morgen!", art: "text", zeit: t }
    ]);
    const feld = document.getElementById("lcFeld");
    const tipp = (id) => {
      feld.value = "";
      const z = document.querySelector('[data-lc-id="' + id + '"]');
      const ziel = z.querySelector(".lc-zeilentext") || z;
      ziel.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      return feld.value;
    };
    return {
      fremd: tipp("f1"),
      eigen: tipp("f2"),
      normal: tipp("n1"),
      bereit: [...document.querySelectorAll(".lc-fluester-zurueck")].length,
      /* GEMELDET: „Bitte ohne die Punkte." Die Zeile muss also aussehen
         wie jede andere — kein Unterstrich, keine Punkte. */
      verziert: [...document.querySelectorAll(".lc-fluester-zurueck")]
        .filter((e) => {
          const d = getComputedStyle(e).textDecorationLine || "";
          return d && d !== "none";
        }).length
    };
  });

  const soll = { fremd: "/w Emmy ", eigen: "/w Reza ", normal: "" };
  let fehler = 0;
  console.log("");
  [["fremde Flüsterzeile", "fremd"], ["eigene Flüsterzeile", "eigen"], ["gewöhnliche Zeile", "normal"]]
    .forEach(([was, k]) => {
      const gut = erg[k] === soll[k];
      if (!gut) fehler++;
      console.log("  " + (gut ? "ok   " : "FEHL ") + was.padEnd(24)
        + "Schreibfeld: „" + erg[k] + "“" + (gut ? "" : "   erwartet: „" + soll[k] + "“"));
    });
  console.log("\n  Flüsterzeilen, die auf den Tipp vorbereitet sind: " + erg.bereit
    + (erg.bereit === 2 ? "   (beide — richtig)" : "   FEHL"));
  if (erg.bereit !== 2) fehler++;
  console.log("  davon mit zusätzlicher Verzierung (Punkte, Unterstrich): " + erg.verziert
    + (erg.verziert === 0 ? "   (keine — die Zeile sieht aus wie jede andere)" : "   FEHL"));
  if (erg.verziert !== 0) fehler++;
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Das Zurückflüstern sitzt.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
