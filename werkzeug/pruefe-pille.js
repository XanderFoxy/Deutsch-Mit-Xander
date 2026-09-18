/* PRÜFT, DASS DIE PILLE NIE ÜBER DEM CHAT-KOPF LIEGT.
   ---------------------------------------------------------------
   GEMELDET, mehrfach: „Diese Sprechblase liegt immer noch über dem
   Chat-Kopf. Sie soll darunter liegen, ohne den Chat zu verschieben."

   Gemessen wird ihre Oberkante gegen die Unterkante der Kopfzeile —
   und zusätzlich, ob der Chat dadurch seine Höhe oder seine Lage
   ändert. Zwei Fälle, weil genau der zweite mich zweimal reingelegt
   hat: einmal der sichtbare Chat, einmal ein Chat, der beim Zeichnen
   der Pille noch gar nicht auf dem Schirm war (frisch geöffnet,
   anderer Reiter). Im zweiten Fall lässt sich nichts messen — und
   genau deshalb darf die Lage nicht von einer Messung abhängen. */
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
  const pg = await br.newPage({ viewport: { width: 380, height: 760 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2300);

  const messen = async (versteckt) => pg.evaluate((verst) => {
    document.querySelectorAll(".lightbox, .lc-chat").forEach((e) => e.remove());
    const chat = document.createElement("div");
    chat.className = "lc-chat";
    chat.style.cssText = "position:relative;width:380px;background:#221c1a"
      + (verst ? ";display:none" : "");
    chat.innerHTML =
      '<div class="lc-chat-kopf" id="kopf">'
      + '<button class="lc-chat-kopf-titel"><span class="lc-kopf-wort">\u0001 Chat</span></button>'
      + '<span class="lc-chat-kopf-rechts"><button class="lc-chat-raeumen">Befehle</button></span></div>'
      + '<details class="lc-befehle"><summary>Befehle</summary><p>viel Text</p></details>'
      + '<div class="lc-verlauf-huelle">'
      + '<div class="lc-live-leiste" id="lcLiveLeiste" hidden></div>'
      + '<div class="lc-chat-verlauf" id="lcVerlauf"><div class="lc-zeile">'
      + '<span class="lc-zeit">10:01</span><span class="lc-zeilentext">Zeile</span></div></div>'
      + '</div>';
    document.body.appendChild(chat);
    const v = document.getElementById("lcVerlauf");
    const ohne = verst ? null : Math.round(v.getBoundingClientRect().height);
    const vorher = verst ? null : Math.round(v.getBoundingClientRect().top);
    /* Die Pille zeichnen — im zweiten Fall, WÄHREND der Chat unsichtbar
       ist. Danach erst wird er sichtbar; so sieht es der Benutzer,
       wenn er das Klassenzimmer aufklappt. */
    window.__balken({ ich: false, jetzt: { von: "e", name: "Emmy" }, lauscher: null });
    if (verst) chat.style.display = "";
    const l = document.getElementById("lcLiveLeiste");
    const k = document.getElementById("kopf").getBoundingClientRect();
    return {
      kopfUnten: Math.round(k.bottom),
      pilleOben: Math.round(l.getBoundingClientRect().top),
      verlaufOben: Math.round(v.getBoundingClientRect().top),
      verlaufHoeheOhne: ohne,
      verlaufHoeheMit: Math.round(v.getBoundingClientRect().height),
      verlaufObenVorher: vorher
    };
  }, versteckt);

  let fehler = 0;
  for (const [was, verst] of [["SICHTBARER CHAT", false], ["CHAT WAR BEIM ZEICHNEN NOCH ZU", true]]) {
    const e = await messen(verst);
    console.log("\n  " + was);
    console.log("    Kopfzeile endet bei y=" + e.kopfUnten);
    const gut = e.pilleOben >= e.kopfUnten;
    if (!gut) fehler++;
    console.log("    Pille beginnt bei  y=" + e.pilleOben + (gut ? "   (unterhalb des Kopfes — richtig)" : "   ÜBER DEM KOPF"));
    console.log("    Verlauf beginnt bei y=" + e.verlaufOben
      + (e.verlaufObenVorher == null ? "" : "   (vorher " + e.verlaufObenVorher + ")"
        + (e.verlaufOben === e.verlaufObenVorher ? "   nichts verschoben" : "   VERSCHOBEN")));
    if (e.verlaufObenVorher != null && e.verlaufOben !== e.verlaufObenVorher) fehler++;
    console.log("    Höhe des Chats: " + (e.verlaufHoeheOhne == null ? "—" : e.verlaufHoeheOhne + " → ") + e.verlaufHoeheMit
      + (e.verlaufHoeheOhne != null && e.verlaufHoeheOhne !== e.verlaufHoeheMit ? "   GEÄNDERT" : "   (unverändert)"));
    if (e.verlaufHoeheOhne != null && e.verlaufHoeheOhne !== e.verlaufHoeheMit) fehler++;
  }
  console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Beide Fälle richtig.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
