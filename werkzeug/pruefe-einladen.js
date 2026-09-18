/* PRÜFT, WARUM „/i Emmy" NICHT ABGESCHICKT WERDEN KANN.
   ---------------------------------------------------------------
   GEMELDET: „Wenn ich invite Emmy mache, kann ich das nicht mehr
   abschicken. Das liegt wahrscheinlich daran, dass das irgendwie
   blockiert ist."

   Statt zu raten wird gemessen, und zwar an drei Stellen:
     1. Kommt der Befehl überhaupt an? (befehlAusfuehren)
     2. Ist der Senden-Knopf nach dem Tippen wirklich klickbar?
     3. Liegt etwas ÜBER dem Senden-Knopf, das den Griff abfängt?
        (document.elementFromPoint auf der Knopfmitte) */
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
  const fehler = [];
  pg.on("pageerror", (e) => fehler.push(String(e.message)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2600);

  const erg = await pg.evaluate(async () => {
    const aus = { zeilen: [], schritte: [] };
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());

    /* ---- 1. Der reine Befehlsweg, ohne Oberfläche ---- */
    aus.schritte.push("LiveChat da: " + (typeof LiveChat === "object"));
    aus.schritte.push("Backend als Name: " + (typeof Backend));
    aus.schritte.push("window.Backend: " + (typeof window.Backend));

    /* Die Chatleiste wie im echten Raum nachbauen — dieselben
       Kennungen, dieselbe CSS-Klasse am Fuß. */
    const halter = document.createElement("div");
    halter.className = "lc-chat-fuss";
    halter.style.cssText = "position:fixed;left:0;bottom:0;width:430px;z-index:99999;background:#221c1a;padding:6px";
    halter.innerHTML = '<form id="lcForm" style="display:flex;gap:6px;align-items:center">'
      + '<input type="text" class="lc-chat-feld" id="lcFeld" style="flex:1">'
      + '<button type="submit" class="lc-chat-senden" id="lcSenden" disabled>➤</button>'
      + '<div class="lc-tipps" id="lcTipps" hidden></div></form>';
    document.body.appendChild(halter);
    if (window.__tippsBinden) window.__tippsBinden(halter);

    const feld = halter.querySelector("#lcFeld");
    const knopf = halter.querySelector("#lcSenden");
    let abgeschickt = null;
    halter.querySelector("#lcForm").addEventListener("submit", (e) => {
      e.preventDefault();
      abgeschickt = feld.value.trim();
    });

    /* ---- 2. Tippen wie ein Mensch ---- */
    feld.focus();
    const text = "/i Emmy";
    for (const z of text) {
      feld.value += z;
      feld.dispatchEvent(new Event("input", { bubbles: true }));
      knopf.disabled = !feld.value.trim();          // wie in renderLiveChat
      await new Promise((r) => setTimeout(r, 30));
    }
    await new Promise((r) => setTimeout(r, 420));
    aus.schritte.push("Feldinhalt: " + JSON.stringify(feld.value));
    aus.schritte.push("Senden-Knopf gesperrt: " + knopf.disabled);

    /* ---- 3. Liegt etwas ÜBER dem Knopf? ---- */
    const r = knopf.getBoundingClientRect();
    const oben = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    aus.schritte.push("Knopf-Rechteck: " + JSON.stringify({
      x: Math.round(r.left), y: Math.round(r.top), b: Math.round(r.width), h: Math.round(r.height) }));
    aus.schritte.push("Auf der Knopfmitte liegt: " + (oben ? (oben.id || oben.className || oben.tagName) : "nichts"));
    aus.schritte.push("das IST der Knopf: " + (oben === knopf));

    const tipps = halter.querySelector("#lcTipps");
    const tr = tipps.getBoundingClientRect();
    aus.schritte.push("Tipp-Panel sichtbar: " + !tipps.hidden
      + "  Rechteck: " + JSON.stringify({ x: Math.round(tr.left), y: Math.round(tr.top),
        b: Math.round(tr.width), h: Math.round(tr.height) }));
    const ueberlappt = !tipps.hidden && !(tr.bottom <= r.top || tr.top >= r.bottom
      || tr.right <= r.left || tr.left >= r.right);
    aus.schritte.push("Panel überdeckt den Knopf: " + ueberlappt);

    /* ---- 4. Wirklich abschicken ---- */
    knopf.click();
    await new Promise((r2) => setTimeout(r2, 120));
    aus.schritte.push("abgeschickt wurde: " + JSON.stringify(abgeschickt));
    return aus;
  });

  erg.schritte.forEach((z) => console.log("  " + z));
  if (fehler.length) { console.log("\n  FEHLER auf der Seite:"); fehler.forEach((f) => console.log("   ! " + f)); }
  await br.close(); srv.close();
})();
