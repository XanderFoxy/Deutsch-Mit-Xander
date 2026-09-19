#!/usr/bin/env node
/* =========================================================
   PRUEFT DIE FILMKETTE: AUS GRUEN WIRD DURCHSICHTIG
   ---------------------------------------------------------
   GEWUENSCHT: „Wie machen die das bei TikTok, dass da ein Loewe
   durchs Bild rennt und einfach nur ueber dem Chat liegt?"

   Genau so: eine Abspieldatei mit Durchsichtigkeit liegt ueber
   der Seite. Keine Bild-KI liefert Durchsichtigkeit — man laesst
   vor Gruen erzeugen und schneidet die Farbe hier heraus.

   Diese Sonde baut sich ihr Testvideo selbst (ein roter Ball vor
   gruenem Grund), schickt es durch werkzeug/film-freistellen.sh
   und MISST danach im Browser die Bildpunkte: an den Ecken muss
   Alpha 0 stehen, am Ball 255. Behauptet wird nichts.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const { execFileSync } = require("child_process");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const WURZEL = path.join(__dirname, "..");
let FF = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
if (!fs.existsSync(FF)) FF = "ffmpeg";

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "film-"));
const quelle = path.join(tmp, "test-gruen.mp4");
const NAME = "__sondenball";

(async () => {
  console.log("\nEIN TESTVIDEO VOR GRUEN BAUEN\n");
  try {
    execFileSync(FF, ["-y", "-hide_banner", "-loglevel", "error",
      "-f", "lavfi", "-i", "color=c=0x00B140:s=320x568:d=2:r=25",
      "-f", "lavfi", "-i", "color=c=0xE04A2F:s=160x160:d=2:r=25",
      "-filter_complex",
      "[1:v]format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lte(hypot(X-80,Y-80),75),255,0)'[ball];"
      + "[0:v][ball]overlay=x='80+40*sin(2*PI*t/2)':y='200+80*cos(2*PI*t/2)'",
      "-c:v", "libx264", "-pix_fmt", "yuv420p", quelle], { stdio: "pipe" });
    pruefe("Testvideo gebaut", fs.existsSync(quelle), Math.round(fs.statSync(quelle).size / 1024) + " kB");
  } catch (e) { pruefe("Testvideo gebaut", false, String(e.message).slice(0, 80)); }

  console.log("\nDURCH DAS WERKZEUG SCHICKEN\n");
  try {
    execFileSync("bash", [path.join(WURZEL, "werkzeug", "film-freistellen.sh"), quelle, NAME, "gruen"],
      { stdio: "pipe" });
  } catch (e) { pruefe("film-freistellen.sh lief durch", false, String(e.message).slice(0, 120)); }
  const webm = path.join(WURZEL, "filme", NAME + ".webm");
  const maske = path.join(WURZEL, "filme", NAME + "-maske.mp4");
  const daten = path.join(WURZEL, "filme", NAME + ".json");
  pruefe("das durchsichtige WebM ist da", fs.existsSync(webm),
    fs.existsSync(webm) ? Math.round(fs.statSync(webm).size / 1024) + " kB" : "");
  pruefe("die Safari-Fassung (Bild + Maske) ist da", fs.existsSync(maske),
    fs.existsSync(maske) ? Math.round(fs.statSync(maske).size / 1024) + " kB" : "");
  pruefe("die Masse stehen in der Datei", (() => {
    if (!fs.existsSync(daten)) return false;
    const d = JSON.parse(fs.readFileSync(daten, "utf8"));
    return d.breite === 320 && d.hoehe === 568 && d.sekunden > 1;
  })(), fs.existsSync(daten) ? fs.readFileSync(daten, "utf8").replace(/\s+/g, " ").slice(0, 70) : "");

  /* UND DIE ZWEITE SORTE: „szene".
     Ein Szenenfilm wird gar nicht freigestellt — er behaelt sein
     volles Bild und bekommt deshalb KEINE Maskendatei. Genau das
     wird hier nachgesehen, damit die neue Sorte nicht still kaputt
     geht, wenn jemand spaeter an der Kette schraubt. */
  console.log("\nUND DIE ZWEITE SORTE: EINE SZENE\n");
  const SZ = NAME + "szene";
  try {
    execFileSync("bash", [path.join(WURZEL, "werkzeug", "film-freistellen.sh"), quelle, SZ, "szene"],
      { stdio: "pipe" });
  } catch (e) { pruefe("die Szenen-Kette lief durch", false, String(e.message).slice(0, 120)); }
  const szWebm = path.join(WURZEL, "filme", SZ + ".webm");
  const szMaske = path.join(WURZEL, "filme", SZ + "-maske.mp4");
  const szDaten = path.join(WURZEL, "filme", SZ + ".json");
  pruefe("der Szenenfilm ist da", fs.existsSync(szWebm),
    fs.existsSync(szWebm) ? Math.round(fs.statSync(szWebm).size / 1024) + " kB" : "");
  pruefe("er hat KEINE Maskendatei (braucht er nicht)", !fs.existsSync(szMaske));
  pruefe("in der Beschreibung steht art: szene", (() => {
    if (!fs.existsSync(szDaten)) return false;
    try { return JSON.parse(fs.readFileSync(szDaten, "utf8")).art === "szene"; } catch (e) { return false; }
  })());
  [szWebm, szDaten, path.join(WURZEL, "filme", SZ + ".jpg")].forEach((f) => {
    try { fs.unlinkSync(f); } catch (e) {}
  });

  console.log("\nUND JETZT DIE BILDPUNKTE, IM BROWSER GEMESSEN\n");
  const srv = http.createServer((q, a) => {
    if (q.url.startsWith("/__seite")) {
      a.writeHead(200, { "Content-Type": "text/html" });
      /* Die Seite MUSS vom selben Server kommen wie das Video, sonst
         sperrt der Browser das Auslesen („tainted canvas") und die
         Durchsichtigkeit liesse sich gar nicht messen. */
      return a.end('<body style="margin:0;background:#ff0000">'
        + '<video id="v" src="/filme/' + NAME + '.webm" width="320" height="568" autoplay muted playsinline></video>'
        + '<canvas id="c" width="320" height="568" style="display:none"></canvas></body>');
    }
    const f = path.join(WURZEL, decodeURIComponent(q.url.split("?")[0]));
    if (!fs.existsSync(f)) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": path.extname(f) === ".webm" ? "video/webm" : "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 320, height: 568 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/__seite", { waitUntil: "domcontentloaded" });
  let erg = null;
  try {
    await pg.waitForFunction(() => {
      const v = document.getElementById("v"); return v.readyState >= 2 && v.currentTime > 0.3;
    }, { timeout: 15000 });
    erg = await pg.evaluate(() => {
      const v = document.getElementById("v"), c = document.getElementById("c"), x = c.getContext("2d");
      x.clearRect(0, 0, 320, 568); x.drawImage(v, 0, 0, 320, 568);
      const lies = (px, py) => { const d = x.getImageData(px, py, 1, 1).data; return { r: d[0], g: d[1], b: d[2], a: d[3] }; };
      let ball = null;
      for (let yy = 60; yy < 540 && !ball; yy += 5) for (let xx = 10; xx < 310; xx += 5) {
        const d = lies(xx, yy); if (d.a > 200) { ball = d; break; }
      }
      return { e1: lies(5, 5), e2: lies(314, 562), ball: ball };
    });
  } catch (e) { /* bleibt null */ }
  await br.close(); srv.close();

  if (!erg) { pruefe("Bildpunkte gelesen", false, "das Video lief nicht an"); }
  else {
    pruefe("Ecke links oben ist durchsichtig", erg.e1.a < 30, "Alpha " + erg.e1.a);
    pruefe("Ecke rechts unten ist durchsichtig", erg.e2.a < 30, "Alpha " + erg.e2.a);
    pruefe("das Motiv steht voll da", Boolean(erg.ball) && erg.ball.a > 200,
      erg.ball ? "Alpha " + erg.ball.a + ", Farbe rgb(" + erg.ball.r + "," + erg.ball.g + "," + erg.ball.b + ")" : "nicht gefunden");
    pruefe("und es ist noch rot, nicht grünstichig", Boolean(erg.ball) && erg.ball.r > 150 && erg.ball.g < 130,
      erg.ball ? "r" + erg.ball.r + " g" + erg.ball.g : "");
  }

  [webm, maske, daten, path.join(WURZEL, "filme", NAME + ".jpg")].forEach((f) => {
    try { fs.unlinkSync(f); } catch (e) {}
  });
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}

  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Aus Grün wird Durchsichtigkeit — die Kette steht.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
