/* PRÜFT DREI GEMELDETE SACHEN AUF EINMAL.
   ---------------------------------------------------------------
   1. „Die Zensuren, die ich vergebe, sollen auch im Chat sichtbar
      sein." — Sie waren durchsichtig, weil die Musik-Animation ihre
      fliegenden Noten ebenfalls .lc-note genannt hat. Gemessen wird
      die tatsächliche Deckkraft und Position.
   2. „Dann schreit sie etwas, und da steht plötzlich in Klammern,
      als wenn es kodiert hier ankommt." — Der Ruf hat die Marken
      mitgebrüllt. Gemessen wird, ob ein [fox:…] im Ruf noch als
      roher Text dasteht.
   3. Die spitzen Klammern aus der Hilfe. */
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

  const erg = await pg.evaluate(() => {
    const aus = [];
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());
    const halter = document.createElement("div");
    halter.style.cssText = "position:fixed;left:0;top:0;width:430px;z-index:99999;background:#221c1a";
    halter.innerHTML =
      '<div class="lc-chat-verlauf" style="padding:6px">'
      + '<div class="lc-zeile lc-zeile-note"><span class="lc-zeit">14:05</span>'
      + '<span class="lc-zeilentext lc-zensur" id="zen">⭐ Emmy bekommt eine 1 (sehr gut) — Grammatik</span>'
      + '</div></div>';
    document.body.appendChild(halter);
    const zen = document.getElementById("zen");
    const st = getComputedStyle(zen);
    const r = zen.getBoundingClientRect();
    aus.push("1. Zensur im Chat");
    aus.push("     Deckkraft: " + st.opacity + "   Position: " + st.position
      + "   Animation: " + (st.animationName === "none" ? "keine" : st.animationName));
    aus.push("     sichtbar (breiter und höher als 0): "
      + (r.width > 0 && r.height > 0 ? "ja — " + Math.round(r.width) + " x " + Math.round(r.height) + " px" : "NEIN"));

    /* Ein Ruf mit einer Fuchsmarke darin. */
    const ziel = document.createElement("span");
    if (window.__rufSetzen) {
      window.__rufSetzen(ziel, "HALLO [fox:fitnessfuchs] ALLE", { farbe: "" });
      aus.push("");
      aus.push("2. Ruf mit einer Marke darin");
      aus.push("     sichtbarer Text: " + JSON.stringify(ziel.textContent));
      aus.push("     Marke steht noch roh da: "
        + (/\[fox:/i.test(ziel.textContent) ? "JA — falsch" : "nein — richtig"));
    } else {
      aus.push("");
      aus.push("2. Testnaht __rufSetzen fehlt");
    }
    return aus;
  });
  erg.forEach((z) => console.log("  " + z));

  /* 3. Spitze Klammern in der Hilfe. */
  const roh = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const offen = (roh.match(/nutzt: "[^"]*</g) || []).length;
  console.log("");
  console.log("  3. Befehlszeilen mit spitzen Klammern in der Hilfe: " + offen
    + (offen === 0 ? "  (keine — niemand tippt sie mehr ab)" : "  NOCH OFFEN"));
  await br.close(); srv.close();
})();
