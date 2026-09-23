#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 99 — DAS SCHIFFE-BRETT: VIER, VIER, VIER, VIER
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „beim Schiffe versenken hab ich dir nicht gesagt,
   dass oben acht sein sollen und unten noch mal acht, sondern es sollten
   oben vier, darunter vier, dann noch mal vier und darunter auch noch
   mal vier, und die sollten im selben Design sein. Dieselbe
   Strichlinien-Optik in derselben Strichlinienfarbe entsprechend allem
   Design. Das soll kein anderes Design sein, die sollen nicht ploetzlich
   blau werden … es soll nur innerhalb der Platzgrenzen stattfinden."
   Und: „diejenigen, die Treffer machen, kriegen Punkte, und die kriegen
   sie in ihr Ranking auch mit gutgeschrieben … Auf jeden Fall muss es
   gewichtet sein. Entweder kriegen alle, die mitspielen, so ein paar
   Mindestpunkte, die jetzt nicht so dramatisch sind, aber die, die
   gewinnen, kriegen halt gute Punkte."

   GEMESSEN WIRD:
     1  Vier Reihen zu vier — nicht zwei zu acht.
     2  Der Kasten waechst dabei um keinen Pixel („nur innerhalb der
        Platzgrenzen").
     3. Dieselbe Zeichnung: gestrichelt, in der Hausfarbe
        rgba(122,115,100,.3), und NICHTS ist blau.
     4. Die Punkte sind gewichtet: mitspielen wenig, treffen mehr,
        gewinnen am meisten — und nie mehr, als die Gegenseite annimmt.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\nDAS BRETT\n");
  const brett = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 250));
    const reihe = document.getElementById("lcPlaetze");
    const vorher = Math.round(reihe.getBoundingClientRect().height);
    window.DMA_SCHIFFE({ phase: "suchen", ichBin: "ich1", dran: "", spieler: [] });
    await new Promise((f) => setTimeout(f, 450));
    const plaetze = [...document.querySelectorAll(".lc-platz")];
    /* Wie viele Felder liegen in jeder Zeile? Gruppiert nach ihrer
       Oberkante — das ist die Zeile, so wie das Auge sie sieht. */
    const zeilen = {};
    plaetze.forEach((p) => {
      const y = Math.round(p.getBoundingClientRect().top);
      zeilen[y] = (zeilen[y] || 0) + 1;
    });
    const k = plaetze[0].querySelector(".lc-kreis");
    const sch = getComputedStyle(plaetze[0].querySelector(".lc-schild"), "::before");
    /* Und sucht nach Blau: irgendein Feld mit einem blauen Ton? */
    const blau = plaetze.filter((p) => {
      const c = getComputedStyle(p.querySelector(".lc-kreis"));
      const lies = (t) => (String(t).match(/[\d.]+/g) || []).map(Number);
      const hg = lies(c.backgroundColor), ra = lies(c.borderTopColor);
      const istBlau = (v) => v.length >= 3 && v[2] > v[0] + 25 && v[2] > v[1] + 15
        && (v.length < 4 || v[3] > 0.08);
      return istBlau(hg) || istBlau(ra);
    }).length;
    return { vorher: vorher, nachher: Math.round(reihe.getBoundingClientRect().height),
             felder: plaetze.length, zeilen: Object.values(zeilen),
             blau: blau,
             ring: sch.borderTopStyle + " " + sch.borderTopWidth + " " + sch.borderTopColor };
  });
  sage(brett.felder === 16 && brett.zeilen.length === 4
    && brett.zeilen.every((n) => n === 4),
    "vier Reihen zu vier Feldern",
    brett.zeilen.join(" + ") + " = " + brett.felder);
  sage(Math.abs(brett.nachher - brett.vorher) <= 2,
    "und der Kasten bleibt genau so hoch wie vorher",
    brett.vorher + " px → " + brett.nachher + " px");
  sage(brett.ring.indexOf("dashed") === 0 && /122, 115, 100/.test(brett.ring),
    "dieselbe gestrichelte Zeichnung in der Hausfarbe",
    brett.ring);
  sage(brett.blau === 0, "und kein einziges Feld ist blau",
    brett.blau + " blaue Felder");

  console.log("\nDIE PUNKTE SIND GEWICHTET\n");
  const punkte = await pg.evaluate(() => ({
    mit: window.LiveChat.pruefSchiffePunkte(0, false),
    einTreffer: window.LiveChat.pruefSchiffePunkte(1, false),
    zweiTreffer: window.LiveChat.pruefSchiffePunkte(2, false),
    vieleTreffer: window.LiveChat.pruefSchiffePunkte(9, false),
    sieger: window.LiveChat.pruefSchiffePunkte(2, true),
  }));
  sage(punkte.mit >= 1 && punkte.mit <= 2,
    "wer mitspielt, bekommt ein paar Mindestpunkte", punkte.mit + " Punkte");
  sage(punkte.einTreffer > punkte.mit && punkte.zweiTreffer > punkte.einTreffer,
    "wer trifft, bekommt mehr",
    punkte.mit + " → " + punkte.einTreffer + " → " + punkte.zweiTreffer);
  sage(punkte.sieger > punkte.zweiTreffer,
    "und wer gewinnt, am meisten", punkte.sieger + " Punkte");
  sage(punkte.vieleTreffer <= 10 && punkte.sieger <= 10,
    "keiner sprengt den Deckel von zehn Punkten je Runde",
    "neun Treffer geben " + punkte.vieleTreffer + ", der Sieger " + punkte.sieger);

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
