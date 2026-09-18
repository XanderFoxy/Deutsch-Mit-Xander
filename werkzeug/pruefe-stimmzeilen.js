/* PRÜFT DIE DREI ZUSTÄNDE EINER WORTMELDUNG IM CHAT.
   ---------------------------------------------------------------
   GEMELDET: „Bei Personen steht der leere Name, wenn sie eine
   Sprachnachricht schicken", und: „Die Sprachnachrichten sind nicht
   mehr aufzurufen."

   Beides hatte dieselbe Ursache: eine Wortmeldung, deren Aufnahme im
   Lager (IndexedDB) liegt und noch nicht zurueckgeholt ist, war
   diesem Teil des Programms unbekannt. Sie fiel durch zur normalen
   Textzeile — und eine Wortmeldung hat keinen Text. Uebrig blieben
   Uhrzeit und Name.

   Gemessen werden alle drei Zustaende:
     1. Ton da            -> Knopf zum Nachhoeren
     2. Ton im Lager      -> „wird geladen", und er wird geholt
     3. Ton wirklich weg  -> „nicht mehr da"
   Und in allen drei Faellen: die Zeile traegt die Marke lc-stimme,
   steht also hinter dem Tipp ins Leere und nicht offen im Chat. */
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
    chat.innerHTML = '<div class="lc-verlauf-huelle"><div class="lc-chat-verlauf" id="lcVerlauf"></div></div>';
    document.body.appendChild(chat);
    const t = Date.now() - 600000;
    window.DMA_PRUEFUNG.chatStand([
      { id: "1", von: "e", name: "Emmy", text: "", art: "live", zeit: t, sprach: "data:audio/webm;base64,AAAA", sprachSek: 3 },
      { id: "2", von: "e", name: "Emmy", text: "", art: "live", zeit: t, sprach: "", sprachImLager: true, sprachSek: 3 },
      { id: "3", von: "e", name: "Emmy", text: "", art: "live", zeit: t, sprach: "", sprachWeg: true, sprachSek: 3 },
      { id: "4", von: "e", name: "Emmy", text: "", art: "sprach", zeit: t, sprach: "", sprachImLager: true, sprachSek: 5 }
    ]);
    return [...document.querySelectorAll("#lcVerlauf .lc-zeile")].map((z) => ({
      id: z.dataset.lcId,
      klassen: z.className,
      stimme: z.classList.contains("lc-stimme"),
      knopf: Boolean(z.querySelector(".lc-sprachblase")),
      weg: Boolean(z.querySelector(".lc-blase-bildweg")),
      laedt: Boolean(z.querySelector(".lc-sprach-laedt")),
      text: (z.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60)
    }));
  });
  const soll = [
    { id: "1", stimme: true, knopf: true,  weg: false, laedt: false, was: "Ton ist da" },
    { id: "2", stimme: true, knopf: false, weg: false, laedt: true,  was: "Ton liegt im Lager" },
    { id: "3", stimme: true, knopf: false, weg: true,  laedt: false, was: "Ton ist wirklich weg" },
    { id: "4", stimme: true, knopf: false, weg: false, laedt: true,  was: "alte Sprachzeile aus dem Lager" }
  ];
  let fehler = 0;
  console.log("");
  erg.forEach((z, i) => {
    const w = soll[i];
    const gut = z.stimme === w.stimme && z.knopf === w.knopf && z.weg === w.weg && z.laedt === w.laedt;
    if (!gut) fehler++;
    console.log("  " + (gut ? "ok   " : "FEHL ") + w.was.padEnd(32) + z.text);
  });
  const leere = erg.filter((z) => !z.knopf && !z.weg && !z.laedt).length;
  console.log("\n  Zeilen, die nur aus Uhrzeit und Namen bestehen: " + leere + (leere ? "   FEHL" : "   (keine — richtig)"));
  if (leere) fehler++;
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Alle drei Zustaende richtig.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
