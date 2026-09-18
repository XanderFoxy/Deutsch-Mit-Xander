/* MISST DIE ZEILE MIT DEM NOTENKNOPF.
   ---------------------------------------------------------------
   GEMELDET: „Die Nachrichten von Emmi stehen immer noch unter der
   Uhrzeit und nicht im Chat. Sie sind senkrecht nach unten, jedes
   Wort einzeln auf einer eigenen Zeile. Die Note steht auch mit
   ihren Einzelbuchstaben von oben nach unten: N dann O dann T E."

   Beides ist messbar:
     - steht der Text auf EINER Zeile? (Höhe / Zeilenhöhe)
     - ist der Knopf breiter als hoch? (senkrechte Buchstaben wären
       schmal und hoch)
     - sitzt der Knopf rechts, also rechts vom Text? */
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
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());
    const halter = document.createElement("div");
    halter.style.cssText = "position:fixed;left:0;top:0;width:430px;z-index:99999;background:#221c1a";
    halter.innerHTML =
      '<div class="lc-chat-verlauf" id="lcVerlauf" style="height:240px;overflow:auto;padding:6px">'
      + '<div class="lc-zeile lc-hat-note" id="z1"><span class="lc-zeit">14:02</span>'
      + '<span class="lc-nick">Emmy</span>'
      + '<span class="lc-zeilentext" id="t1">Guten Morgen zusammen, ich bin da</span>'
      + '<button type="button" class="lc-benoten" id="b1">Note</button>'
      + '</div></div>';
    document.body.appendChild(halter);

    const t = document.getElementById("t1");
    const b = document.getElementById("b1");
    const u = document.querySelector("#z1 .lc-zeit");
    const zh = parseFloat(getComputedStyle(t).lineHeight) || 18;
    const zeilen = Math.round(t.getBoundingClientRect().height / zh);
    const tr = t.getBoundingClientRect(), brr = b.getBoundingClientRect(), ur = u.getBoundingClientRect();
    return {
      textZeilen: zeilen,
      textBreite: Math.round(tr.width),
      knopf: { b: Math.round(brr.width), h: Math.round(brr.height),
               x: Math.round(brr.left), y: Math.round(brr.top) },
      uhr: { x: Math.round(ur.left), rechts: Math.round(ur.right) },
      knopfRechtsVomText: brr.left >= tr.right - 1,
      knopfRechtsVonDerUhr: brr.left > ur.right,
      textRechtsVonDerUhr: tr.left > ur.right
    };
  });

  console.log("");
  console.log("  Text „Guten Morgen zusammen, ich bin da\"");
  console.log("    steht auf " + erg.textZeilen + " Zeile(n), " + erg.textBreite + " px breit");
  console.log("    beginnt rechts von der Uhrzeit: " + (erg.textRechtsVonDerUhr ? "ja" : "NEIN"));
  console.log("  Knopf „Note\": " + erg.knopf.b + " x " + erg.knopf.h + " px"
    + "  (breiter als hoch: " + (erg.knopf.b > erg.knopf.h ? "ja — waagerecht" : "NEIN — senkrecht!") + ")");
  console.log("    sitzt rechts vom Text: " + (erg.knopfRechtsVomText ? "ja" : "NEIN"));
  console.log("    sitzt rechts von der Uhrzeit: " + (erg.knopfRechtsVonDerUhr ? "ja" : "NEIN"));
  await br.close(); srv.close();
})();
