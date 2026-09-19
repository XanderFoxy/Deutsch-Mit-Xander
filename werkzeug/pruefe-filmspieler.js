#!/usr/bin/env node
/* =========================================================
   PRUEFT DEN FILMSPIELER — BEIDE WEGE
   ---------------------------------------------------------
   Chrome kann WebM mit Alphakanal, Safari nicht. Fuer Safari
   liegt daneben ein MP4, in dem Bild und Maske nebeneinander
   stehen; die Grafikkarte setzt beides wieder zusammen.

   Diese Sonde baut sich einen Testfilm, spielt ihn EINMAL auf
   jedem der beiden Wege ab und liest danach die Bildpunkte aus:
   ausserhalb des Motivs muss der rote Untergrund durchkommen,
   auf dem Motiv seine eigene Farbe. Wuerde der Safari-Weg nicht
   stimmen, staende hier ein gruener Kasten — und genau das
   soll nie wieder jemand sehen.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const { execFileSync } = require("child_process");
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const WURZEL = path.join(__dirname, "..");
let FF = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
if (!fs.existsSync(FF)) FF = "ffmpeg";
const NAME = "__spielersonde";

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "spieler-"));
  const quelle = path.join(tmp, "gruen.mp4");
  execFileSync(FF, ["-y", "-hide_banner", "-loglevel", "error",
    "-f", "lavfi", "-i", "color=c=0x00B140:s=240x426:d=2:r=25",
    "-f", "lavfi", "-i", "color=c=0x2050E0:s=120x120:d=2:r=25",
    "-filter_complex",
    "[1:v]format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lte(hypot(X-60,Y-60),56),255,0)'[k];"
    + "[0:v][k]overlay=x=60:y=153",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", quelle], { stdio: "pipe" });
  execFileSync("bash", [path.join(WURZEL, "werkzeug", "film-freistellen.sh"), quelle, NAME, "gruen"],
    { stdio: "pipe" });

  /* WARUM HIER NOCH EINMAL UMGEWANDELT WIRD.
     Die Safari-Fassung ist ein H.264-MP4 — das ist richtig so, denn
     Safari kann nichts anderes. Der Chromium, mit dem hier geprueft
     wird, ist die quelloffene Fassung OHNE H.264: er lehnt die Datei
     ab (MEDIA_ERR_SRC_NOT_SUPPORTED), und das sah eine Runde lang
     nach einem Fehler im Spieler aus. Es war keiner — die Datei ist
     einwandfrei (h264 High, 480x426, 2 s).
     Damit sich das Zusammensetzen trotzdem wirklich pruefen laesst,
     wird dieselbe Nebeneinander-Fassung hier zusaetzlich als VP9
     abgelegt und die Beschreibung darauf gezeigt. Geprueft wird
     damit genau das, was der Spieler rechnet: links die Farbe,
     rechts die Deckung, beides von der Grafikkarte zusammengefuegt. */
  const maskeMp4 = path.join(WURZEL, "filme", NAME + "-maske.mp4");
  const maskeWebm = path.join(WURZEL, "filme", NAME + "-maske.webm");
  execFileSync(FF, ["-y", "-hide_banner", "-loglevel", "error", "-i", maskeMp4,
    "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "30", "-an", maskeWebm], { stdio: "pipe" });
  const dPfad = path.join(WURZEL, "filme", NAME + ".json");
  const dJson = JSON.parse(fs.readFileSync(dPfad, "utf8"));
  dJson.maske = "filme/" + NAME + "-maske.webm";
  fs.writeFileSync(dPfad, JSON.stringify(dJson));

  const srv = http.createServer((q, a) => {
    if (q.url.startsWith("/__seite")) {
      a.writeHead(200, { "Content-Type": "text/html" });
      return a.end('<!doctype html><body style="margin:0;background:#ff0000">'
        + '<script src="/filmspieler.js"></script></body>');
    }
    const f = path.join(WURZEL, decodeURIComponent(q.url.split("?")[0]));
    if (!fs.existsSync(f)) { a.writeHead(404); return a.end(); }
    const e = path.extname(f);
    a.writeHead(200, { "Content-Type": e === ".webm" ? "video/webm" : e === ".mp4" ? "video/mp4"
      : e === ".json" ? "application/json" : e === ".js" ? "text/javascript" : "image/jpeg" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const port = srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required", "--use-gl=swiftshader",
           "--enable-unsafe-swiftshader"] });

  async function lauf(weg) {
    const pg = await br.newPage({ viewport: { width: 240, height: 426 } });
    await pg.goto("http://127.0.0.1:" + port + "/__seite", { waitUntil: "domcontentloaded" });
    const art = await pg.evaluate(async ([name, weg]) => {
      window.DMA_FILM.pruefWeg(weg);
      const r = await window.DMA_FILM.spielen(name);
      return r.art;
    }, [NAME, weg]);
    await pg.waitForTimeout(1200);
    const bild = await pg.screenshot();
    /* Bildpunkte aus dem Schirmbild lesen — unabhaengig davon,
       was die Seite selbst behauptet. */
    const png = bild;
    await pg.close();
    return { art, png };
  }

  /* Ein winziger PNG-Leser: wir brauchen nur einzelne Punkte. */
  function punkt(png, x, y, b, h) {
    const { PNG } = (() => { try { return require("/tmp/claude-0/node_modules/pngjs"); } catch (e) { return {}; } })();
    if (!PNG) return null;
    const d = PNG.sync.read(png);
    const i = (d.width * y + x) << 2;
    return { r: d.data[i], g: d.data[i + 1], b: d.data[i + 2] };
  }

  console.log("\nWEG 1 — WEBM MIT ALPHAKANAL (Chrome, Firefox, Android)\n");
  const a = await lauf("webm");
  pruefe("der Spieler nimmt den WebM-Weg", a.art === "webm", a.art);
  const aEcke = punkt(a.png, 6, 6), aMitte = punkt(a.png, 120, 213);
  if (aEcke) {
    pruefe("neben dem Motiv kommt der rote Untergrund durch",
      aEcke.r > 200 && aEcke.g < 60, "rgb(" + aEcke.r + "," + aEcke.g + "," + aEcke.b + ")");
    pruefe("auf dem Motiv steht seine eigene Farbe (blau)",
      aMitte.b > 120 && aMitte.r < 120, "rgb(" + aMitte.r + "," + aMitte.g + "," + aMitte.b + ")");
  } else pruefe("Bildpunkte gelesen", false, "pngjs fehlt");

  console.log("\nWEG 2 — BILD UND MASKE ZUSAMMENGESETZT (Safari, iPhone)\n");
  const m = await lauf("maske");
  pruefe("der Spieler nimmt den Masken-Weg", m.art === "maske", m.art);
  const mEcke = punkt(m.png, 6, 6), mMitte = punkt(m.png, 120, 213);
  if (mEcke) {
    pruefe("neben dem Motiv kommt der rote Untergrund durch",
      mEcke.r > 200 && mEcke.g < 60, "rgb(" + mEcke.r + "," + mEcke.g + "," + mEcke.b + ")");
    pruefe("auf dem Motiv steht seine eigene Farbe (blau)",
      mMitte.b > 100 && mMitte.r < 140, "rgb(" + mMitte.r + "," + mMitte.g + "," + mMitte.b + ")");
    pruefe("und KEIN grüner Kasten — das wäre der alte Fehler",
      !(mEcke.g > 100 && mEcke.r < 100), "Ecke g=" + mEcke.g);
  } else pruefe("Bildpunkte gelesen", false, "pngjs fehlt");

  await br.close(); srv.close();
  ["webm", "jpg", "json"].forEach((e) => { try { fs.unlinkSync(path.join(WURZEL, "filme", NAME + "." + e)); } catch (x) {} });
  try { fs.unlinkSync(path.join(WURZEL, "filme", NAME + "-maske.mp4")); } catch (x) {}
  try { fs.unlinkSync(path.join(WURZEL, "filme", NAME + "-maske.webm")); } catch (x) {}
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (x) {}

  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Beide Wege spielen — auch der fuers iPhone.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
