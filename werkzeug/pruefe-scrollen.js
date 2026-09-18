/* PRÜFT, OB MAN IM CHATVERLAUF OBEN BLEIBEN KANN.
   ---------------------------------------------------------------
   GEMELDET: „Man kann im Chatverlauf nicht mehr nach oben scrollen,
   um das alte Rätsel zu lesen."

   Der Griff, der den Chat unten hält, riss jedes Hochscrollen sofort
   wieder nach unten — weil ein bereits eingeplanter Sprung nach der
   Wischbewegung feuerte. Nachgestellt wird genau das: hochscrollen,
   dann kommen Auffrischungen im Sekundentakt, wie sie jede
   Empfangsbestätigung auslöst. */
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

  const erg = await pg.evaluate(async () => {
    if (!window.__amEndeHalten) return "Prüfnaht __amEndeHalten fehlt";
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());
    const chat = document.createElement("div");
    chat.className = "lc-chat";
    chat.style.cssText = "position:fixed;left:0;top:0;width:430px;z-index:99999;background:#221c1a";
    let zeilen = "";
    for (let i = 1; i <= 120; i++) {
      zeilen += '<div class="lc-zeile"><span class="lc-zeit">10:' + String(i % 60).padStart(2, "0")
             + '</span><span class="lc-nick">Alex</span>'
             + '<span class="lc-zeilentext">Zeile Nummer ' + i + '</span></div>';
    }
    chat.innerHTML = '<div class="lc-chat-verlauf" id="lcVerlauf" style="height:260px;overflow:auto">'
                   + zeilen + '</div>';
    document.body.appendChild(chat);
    const v = document.getElementById("lcVerlauf");
    const warte = (ms) => new Promise((r) => setTimeout(r, ms));

    /* Erst einmal wie beim Betreten: ganz nach unten. */
    window.__amEndeHalten(v);
    await warte(120);
    const unten = Math.round(v.scrollTop);

    /* Jetzt scrollt der Mensch selbst nach oben (Wischen = touchmove). */
    v.dispatchEvent(new Event("touchmove", { bubbles: true }));
    const griffNachWisch = window.__haeltUnten ? window.__haeltUnten() : "?";
    v.scrollTop = 900;                 /* wirklich weit nach oben, nicht 20 Pixel */
    const sofort = Math.round(v.scrollTop);
    /* Weiches Rollen braucht einen Moment — und genau dieser Moment
       war die Falle. */
    await warte(900);
    const nachObenGesetzt = Math.round(v.scrollTop);
    const griffDanach = window.__haeltUnten ? window.__haeltUnten() : "?";

    /* Und jetzt kommen die Auffrischungen — acht Stück, wie sie
       Bestätigungen und „ich höre zu" auslösen. */
    for (let i = 0; i < 8; i++) { window.__amEndeHalten(v); await warte(70); }
    const nachher = Math.round(v.scrollTop);

    /* Der Knopf zurück ans Ende muss jetzt da sein. */
    const knopfDa = Boolean(document.getElementById("lcNachUnten"));

    /* Und ein Tipp darauf bringt zurück. */
    const k = document.getElementById("lcNachUnten");
    if (k) k.click();
    await warte(140);
    const zurueck = Math.round(v.scrollTop);
    const ganzUnten = Math.round(v.scrollHeight - v.clientHeight);

    return { unten, sofort, griffNachWisch, griffDanach, nachObenGesetzt, nachher,
             knopfDa, zurueck, ganzUnten, gesamt: Math.round(v.scrollHeight) };
  });

  console.log("");
  if (typeof erg === "string") { console.log("  " + erg); }
  else {
    console.log("  120 Zeilen, Fenster 260 px hoch (Gesamthöhe " + erg.gesamt + " px)");
    console.log("  beim Betreten unten          : " + erg.unten);
    console.log("  sofort nach dem Setzen       : " + erg.sofort
      + "   Griff nach dem Wisch: " + erg.griffNachWisch);
    console.log("  selbst hochgescrollt auf     : " + erg.nachObenGesetzt
      + "   Griff danach: " + erg.griffDanach);
    console.log("  nach acht Auffrischungen     : " + erg.nachher
      + (Math.abs(erg.nachher - erg.nachObenGesetzt) < 8
          ? "   (steht — richtig)"
          : "   FALSCH — wieder nach unten gerissen"));
    console.log("  Knopf „↓ Neueste\" erschienen : " + (erg.knopfDa ? "ja" : "NEIN"));
    console.log("  nach einem Tipp darauf       : " + erg.zurueck + " von " + erg.ganzUnten
      + (Math.abs(erg.zurueck - erg.ganzUnten) < 3 ? "   (ganz unten — richtig)" : "   FALSCH"));
  }
  await br.close(); srv.close();
})();
