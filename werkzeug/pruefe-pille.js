/* PRÜFT, DASS DIE PILLE NIE ÜBER DEM CHAT-KOPF LIEGT.
   ---------------------------------------------------------------
   GEMELDET, mehrfach: „Warum legst du die Bubble schon wieder über
   den Chat-Kopf? Das sollst du doch nicht machen."
   Gemessen wird ihre Oberkante gegen die Unterkante der Kopfzeile —
   und zusätzlich, ob der Chat dadurch seine Höhe ändert. */
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
  const erg = await pg.evaluate(() => {
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());
    const chat = document.createElement("div");
    chat.className = "lc-chat";
    chat.style.cssText = "position:relative;width:380px;background:#221c1a";
    chat.innerHTML =
      '<div class="lc-chat-kopf" id="kopf">'
      + '<button class="lc-chat-kopf-titel"><span class="lc-kopf-wort">\u0001 Chat</span></button>'
      + '<span class="lc-chat-kopf-rechts"><button class="lc-chat-raeumen">Befehle</button></span></div>'
      + '<details class="lc-befehle"><summary>Befehle</summary><p>viel Text</p></details>'
      + '<div class="lc-live-leiste" id="lcLiveLeiste" hidden></div>'
      + '<div class="lc-chat-verlauf" id="lcVerlauf"><div class="lc-zeile">'
      + '<span class="lc-zeit">10:01</span><span class="lc-zeilentext">Zeile</span></div></div>';
    document.body.appendChild(chat);
    const v = document.getElementById("lcVerlauf");
    const ohne = Math.round(v.getBoundingClientRect().height);
    const vorher = Math.round(v.getBoundingClientRect().top);
    window.__balken({ ich: false, jetzt: { von: "e", name: "Emmy" }, lauscher: null });
    const l = document.getElementById("lcLiveLeiste");
    const k = document.getElementById("kopf").getBoundingClientRect();
    const lb = l.getBoundingClientRect();
    const vb = v.getBoundingClientRect();
    return {
      kopfUnten: Math.round(k.bottom),
      pilleOben: Math.round(lb.top),
      verlaufOben: Math.round(vb.top),
      verlaufHoeheOhne: ohne,
      verlaufHoeheMit: Math.round(vb.height),
      verlaufObenVorher: vorher
    };
  });
  console.log("");
  console.log("  Kopfzeile endet bei y=" + erg.kopfUnten);
  console.log("  Pille beginnt bei  y=" + erg.pilleOben
    + (erg.pilleOben >= erg.kopfUnten ? "   (unterhalb des Kopfes — richtig)" : "   ÜBER DEM KOPF"));
  console.log("  Verlauf beginnt bei y=" + erg.verlaufOben
    + "   (vorher " + erg.verlaufObenVorher + ")"
    + (erg.verlaufOben === erg.verlaufObenVorher ? "   nichts verschoben" : "   VERSCHOBEN"));
  console.log("  Höhe des Chats: " + erg.verlaufHoeheOhne + " → " + erg.verlaufHoeheMit
    + (erg.verlaufHoeheOhne === erg.verlaufHoeheMit ? "   (unverändert)" : "   GEÄNDERT"));
  await br.close(); srv.close();
})();
