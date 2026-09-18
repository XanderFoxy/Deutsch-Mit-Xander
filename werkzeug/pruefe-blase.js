/* MISST, OB DIE SYMBOLE IN DER SPRECHBLASE BLEIBEN.
   ---------------------------------------------------------------
   GEMELDET: „Bei Android sind die Symbole immer noch nicht in der
   Blase. Das muss gesperrt sein innerhalb der Blase, die dürfen
   nicht darüber hinaus ragen. Und das Herunterladen-Symbol soll
   erkennbar sein und das Zurückrufen-Symbol auch."

   GEMELDET, danach: „In den Android-Sprechblasen kann man zwar die
   Zeit, den Download und das Zurückrufen sehen, allerdings nicht mehr
   die kleine Wellenform. Die kann ruhig kleiner dargestellt werden
   oder kürzer, damit die anderen Symbole passen."

   Gemessen wird an einer schmalen Android-Breite (360 px), und zwar
   zweimal: in einer gewöhnlichen Zeile und in einer richtig engen
   (ein langer Name frisst den Platz). Liegen beide Symbole vollständig
   innerhalb der Blase, wie gross sind ihre Tippflächen — und bleibt
   von der Tonspur überhaupt etwas übrig? */
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
  const pg = await br.newPage({ viewport: { width: 360, height: 760 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2400);

  const erg = await pg.evaluate(() => {
    document.querySelectorAll(".lightbox").forEach((e) => e.remove());
    const halter = document.createElement("div");
    halter.style.cssText = "position:fixed;left:0;top:0;width:360px;z-index:99999;background:#221c1a;padding:6px";
    let striche = "";
    for (let i = 0; i < 18; i++) striche += '<s style="height:' + (30 + i * 3) + '%"></s>';
    halter.innerHTML =
      '<div class="lc-chat-verlauf lc-stimmen-offen"><div class="lc-zeile lc-zeile-live lc-stimme"><span class="lc-zeit">14:07</span>'
      + '<span class="lc-nick">Xander</span><span class="lc-zeilentext">'
      + '<span class="lc-sprachblase" id="blase" role="button">'
      + '<i>' + striche + '</i><em>12″</em>'
      + '<a class="lc-sprach-holen" id="holen" download>⤓</a>'
      + '<button type="button" class="lc-sprach-weg" id="weg">↩</button>'
      + '</span></span></div></div>'
      + '<div class="lc-chat-kopf"><button type="button" class="lc-chat-kopf-titel">'
      + '<span class="lc-kopf-wort">\ud83d\udcac Chat</span>'
      + '<span class="lc-kopf-stimmen">\ud83c\udf99\ufe0f anzeigen</span></button>'
      + '<span class="lc-chat-kopf-rechts">'
      + '<button class="lc-chat-raeumen">\ud83d\udeaa R\u00e4ume</button>'
      + '<button class="lc-chat-raeumen">\u24d8 Befehle</button></span></div>';
    document.body.appendChild(halter);
    /* Und dieselbe Blase noch einmal in einer richtig engen Zelle. */
    const eng = document.createElement("div");
    eng.style.cssText = "position:fixed;left:0;top:200px;width:150px;z-index:99999;background:#221c1a;padding:4px";
    eng.innerHTML = halter.innerHTML.replace(/id="blase"/, 'id="blase2"')
      .replace(/id="holen"/, 'id="holen2"').replace(/id="weg"/, 'id="weg2"');
    document.body.appendChild(eng);
    const b = document.getElementById("blase").getBoundingClientRect();
    const h = document.getElementById("holen").getBoundingClientRect();
    const w = document.getElementById("weg").getBoundingClientRect();
    const drin = (r) => r.left >= b.left - 0.5 && r.right <= b.right + 0.5
                     && r.top >= b.top - 0.5 && r.bottom <= b.bottom + 0.5;
    const welle = document.querySelector("#blase i").getBoundingClientRect();
    const welle2 = document.querySelector("#blase2 i").getBoundingClientRect();
    const b2 = document.getElementById("blase2").getBoundingClientRect();
    const h2 = document.getElementById("holen2").getBoundingClientRect();
    const drin2 = (r) => r.left >= b2.left - 0.5 && r.right <= b2.right + 0.5;
    return {
      welle: Math.round(welle.width),
      welleEng: Math.round(welle2.width),
      engBlase: Math.round(b2.width),
      engHolenDrin: drin2(h2),
      engHolen: Math.round(h2.width),
      blase: { b: Math.round(b.width), h: Math.round(b.height), rechts: Math.round(b.right) },
      holen: { b: Math.round(h.width), h: Math.round(h.height), drin: drin(h) },
      weg:   { b: Math.round(w.width), h: Math.round(w.height), drin: drin(w) },
      fenster: window.innerWidth
    };
  });

  console.log("");
  console.log("  Fensterbreite (wie ein Android-Telefon): " + erg.fenster + " px");
  console.log("  Blase: " + erg.blase.b + " x " + erg.blase.h + " px, rechter Rand bei " + erg.blase.rechts);
  console.log("  ⤓ Herunterladen: " + erg.holen.b + " x " + erg.holen.h
    + " px   innerhalb der Blase: " + (erg.holen.drin ? "ja" : "NEIN"));
  console.log("  ~ Tonspur       : " + erg.welle + " px breit"
    + (erg.welle > 8 ? "   (sichtbar)" : "   VERSCHWUNDEN"));
  console.log("");
  console.log("  ENGE ZEILE (150 px Zelle)");
  console.log("  Blase: " + erg.engBlase + " px   ⤓ " + erg.engHolen + " px, innerhalb: "
    + (erg.engHolenDrin ? "ja" : "NEIN"));
  console.log("  ~ Tonspur       : " + erg.welleEng + " px breit"
    + (erg.welleEng > 8 ? "   (sichtbar)" : "   VERSCHWUNDEN"));
  console.log("");
  console.log("  ↩ Zurückrufen  : " + erg.weg.b + " x " + erg.weg.h
    + " px   innerhalb der Blase: " + (erg.weg.drin ? "ja" : "NEIN"));

  /* Und die Kopfzeile darf nicht mehr abbrechen. */
  const kopf = await pg.evaluate(() => {
    const t = document.querySelector(".lc-chat-kopf-titel");
    if (!t) return null;
    const w = t.querySelector(".lc-kopf-wort");
    return { text: t.textContent.replace(/\s+/g, " ").trim(),
             abgeschnitten: w ? w.scrollWidth > w.clientWidth + 1 : false };
  });
  if (kopf) {
    console.log("");
    console.log("  Kopfzeile: " + JSON.stringify(kopf.text));
    console.log("  abgeschnitten: " + (kopf.abgeschnitten ? "JA" : "nein"));
  }
  /* Und jetzt das Urteil, damit die Messung auch etwas behauptet. */
  let fehler = 0;
  const ok = (b, was) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was); };
  console.log("");
  ok(erg.holen.drin && erg.weg.drin, "beide Symbole liegen in der Blase");
  ok(erg.holen.b >= 24 && erg.weg.b >= 24, "beide sind gross genug für einen Finger (25 px)");
  ok(erg.welle > 8, "die Tonspur ist sichtbar (" + erg.welle + " px)");
  ok(erg.welleEng > 8, "auch in einer engen Zeile (" + erg.welleEng + " px)");
  ok(erg.engHolenDrin, "und auch dort bleibt das Herunterladen-Symbol in der Blase");
  console.log("");
  console.log("  " + (fehler ? fehler + " Abweichung(en)" : "Die Blase sitzt — mit Tonspur.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})();
