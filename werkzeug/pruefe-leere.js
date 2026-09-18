/* PRÜFT DEN KLICK INS LEERE DES CHATS.
   ---------------------------------------------------------------
   GEMELDET, zum wiederholten Mal: „Das mit den Sprachnachrichten
   abrufen per Klick in den leeren Bereich des Chats geht immer noch
   nicht", und früher: „bei einer Zeile von den ASCII-Codes, wenn ich
   da links daneben klicke, wo die Uhrzeit auch ist."

   Gemessen wird an vier Stellen, und zwar an echten Bildschirm-
   koordinaten, nicht an erfundenen Ereignissen:
     1. Grund des Verlaufs  -> muss umschalten
     2. Uhrzeit einer Zeile -> muss umschalten
     3. Platz rechts neben dem Inhalt -> muss umschalten
     4. der Text selbst     -> darf NICHT umschalten (Animation!) */
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
  await pg.waitForTimeout(2600);

  await pg.evaluate(() => {
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());
    const halter = document.createElement("div");
    halter.id = "probe";
    halter.style.cssText = "position:fixed;left:0;top:0;width:430px;z-index:99999;background:#221c1a";
    halter.innerHTML =
      '<div class="lc-chat-verlauf" id="lcVerlauf" style="height:300px;overflow:auto;padding:6px">'
      + '<div class="lc-zeile" id="z1"><span class="lc-zeit">14:02</span>'
      + '<span class="lc-nick">Emmy</span><span class="lc-zeilentext" id="t1">Hallo</span></div>'
      + '<div class="lc-stimme">Sprachnachricht</div>'
      + '</div>'
      + '<form id="lcForm"><input id="lcFeld"><div class="lc-tipps" id="lcTipps" hidden></div></form>';
    document.body.appendChild(halter);
    /* Die Animationswiederholung wie im echten Chat an die Zeile haengen. */
    window.__animiert = 0;
    const z = document.getElementById("z1");
    z.addEventListener("click", () => { window.__animiert++; });
    if (window.__tippsBinden) window.__tippsBinden(halter);
  });

  async function tippen(name, waehlen) {
    const vorher = await pg.evaluate(() => ({
      offen: document.getElementById("lcVerlauf").classList.contains("lc-stimmen-offen"),
      anim: window.__animiert
    }));
    const punkt = await pg.evaluate(waehlen);
    if (!punkt) { console.log("  " + name + ": Stelle nicht gefunden"); return; }
    await pg.mouse.click(punkt.x, punkt.y);
    await pg.waitForTimeout(160);
    const nachher = await pg.evaluate(() => ({
      offen: document.getElementById("lcVerlauf").classList.contains("lc-stimmen-offen"),
      anim: window.__animiert
    }));
    console.log("  " + name.padEnd(34)
      + " umgeschaltet: " + (vorher.offen !== nachher.offen ? "ja " : "NEIN")
      + "   Animation ausgelöst: " + (nachher.anim > vorher.anim ? "JA" : "nein"));
  }

  console.log("");
  await tippen("Grund des Verlaufs", () => {
    const v = document.getElementById("lcVerlauf").getBoundingClientRect();
    return { x: v.left + v.width / 2, y: v.bottom - 30 };
  });
  await tippen("Uhrzeit der Zeile", () => {
    const u = document.querySelector("#z1 .lc-zeit").getBoundingClientRect();
    return { x: u.left + u.width / 2, y: u.top + u.height / 2 };
  });
  await tippen("Platz rechts neben dem Inhalt", () => {
    const z = document.getElementById("z1").getBoundingClientRect();
    const t = document.getElementById("t1").getBoundingClientRect();
    return { x: (t.right + z.right) / 2, y: z.top + z.height / 2 };
  });
  await tippen("der Text selbst (Animation!)", () => {
    const t = document.getElementById("t1").getBoundingClientRect();
    return { x: t.left + t.width / 2, y: t.top + t.height / 2 };
  });
  await br.close(); srv.close();
})();
