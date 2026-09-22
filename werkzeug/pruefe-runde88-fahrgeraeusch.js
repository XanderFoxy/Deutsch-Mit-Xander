/* =====================================================================
   SONDE RUNDE 88 — DAS AUTOFAHRER-GERAEUSCH
   ---------------------------------------------------------------------
   XANDER (Runde 85): „beim Reisen hoert man kein Fahrgeraeusch, man
   hoert nur das quietschende Bremsen am Schluss."
   XANDER (Runde 88): „Ich weiss auch nicht, ob du das Autofahrer-
   Geraeusch schon gemacht hast."

   In Runde 85 war es nur halb gemacht: „lcTonReise" streckt die
   Plan-Dauer auf die wirkliche Fahrzeit, aber das entscheidet nur,
   WANN abgeblendet wird — ob die Datei von vorn anfaengt, haengt an
   „schleife", und das stand nicht da. Gemessen wird deshalb beides:
   · Der TONPLAN: laeuft „fahren" in der Schleife?
   · Die DATEI: laesst sie sich ueberhaupt schleifen, oder blendet
     sie am Ende aus und pumpt dann im Sekundentakt?
   · Und im Browser: laeuft der Ton waehrend der ganzen Fahrt, und
     kommt die Bremse VOR der Ankunft?
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FF = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

const RATE = 24000;
function tonLaden(datei) {
  const roh = path.join("/tmp/claude-0", "pr88f-" + path.basename(datei) + ".raw");
  execFileSync(FF, ["-v", "error", "-i", datei, "-f", "s16le",
    "-ar", String(RATE), "-ac", "1", roh, "-y"]);
  const b = fs.readFileSync(roh);
  const x = new Float64Array(b.length / 2);
  for (let i = 0; i < x.length; i++) x[i] = b.readInt16LE(i * 2) / 32768;
  return x;
}
const rms = (x, ab, bis) => {
  let s = 0, n = 0;
  for (let i = Math.max(0, ab); i < Math.min(x.length, bis); i++) { s += x[i] * x[i]; n++; }
  return n ? Math.sqrt(s / n) : 0;
};

(async () => {
  console.log("RUNDE 88 — Das Autofahrer-Geraeusch\n");

  /* =================================================================
     1. DER TONPLAN
     ================================================================= */
  console.log("DER TONPLAN\n");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(/fahren: *\{ ton: "fahrt", *dauer: 2600, schleife: true/.test(js),
    "„fahren\" laeuft in der Schleife — sonst hoert der Motor nach einer Datei auf");
  sage(/lcTonReise\("fahren", hin\);/.test(js),
    "und die Dauer wird auf die wirkliche Fahrzeit gestreckt");
  sage(/lcTonSpaeter\("quietschen", Math\.max\(0, hin - 700\), 0\.55\);/.test(js),
    "die Bremse kommt 700 ms VOR der Ankunft, nicht danach");

  /* =================================================================
     2. DIE DATEI
     ================================================================= */
  console.log("\nDIE DATEI — laesst sie sich schleifen?\n");
  const x = tonLaden(path.join(WURZEL, "ton", "fahrt.opus"));
  const dauer = x.length / RATE;
  sage(dauer > 0.9 && dauer < 1.6, "sie ist eine Schleife von rund einer Sekunde",
    dauer.toFixed(3) + " s");
  const w = Math.round(RATE * 0.02);
  const vorn = rms(x, 0, w), hinten = rms(x, x.length - w, x.length);
  const sprung = Math.abs(20 * Math.log10(Math.max(vorn, 1e-9) / Math.max(hinten, 1e-9)));
  sage(sprung < 3,
    "Anfang und Ende sind gleich laut — sie blendet nicht aus, sie pumpt also nicht",
    "Anfang " + vorn.toFixed(4) + ", Ende " + hinten.toFixed(4)
      + ", Unterschied " + sprung.toFixed(1) + " dB");
  /* Und zwischendurch auch: ein Motor, der auf halber Strecke leiser
     wird, ist keine Schleife, sondern eine Aufnahme. */
  const teile = [];
  for (let i = 0; i < 6; i++) {
    teile.push(rms(x, Math.round(x.length * i / 6), Math.round(x.length * (i + 1) / 6)));
  }
  const spanne = 20 * Math.log10(Math.max.apply(null, teile) / Math.max(1e-9, Math.min.apply(null, teile)));
  sage(spanne < 4, "und sie laeuft ueber die ganze Laenge gleichmaessig",
    teile.map((t) => t.toFixed(3)).join(" ") + "   Spanne " + spanne.toFixed(1) + " dB");
  /* Ein Motor ist eine Zuendfolge. Ein Vierzylinder-Viertakter
     zuendet zweimal je Umdrehung; 73 Hz sind rund 2200 Umdrehungen. */
  /* Gezaehlt werden die ZUENDUNGEN selbst, nicht eine
     Autokorrelation: die vier Zylinder zuenden verschieden stark
     (Muster 1,00 / 0,94 / 1,02 / 0,97), und eine Autokorrelation
     findet deshalb gern die halbe oder die viertel Rate — beim
     ersten Versuch meldete sie 36,4 statt 73,3 Hz. Der Abstand
     zwischen zwei Spitzen der Huellkurve ist eindeutig. */
  const fen = Math.round(RATE * 0.0016);
  const e = [];
  for (let i = 0; i + fen <= x.length; i += fen) e.push(rms(x, i, i + fen));
  const mitE = e.reduce((a, b) => a + b, 0) / e.length;
  const spitzen = [];
  for (let i = 2; i < e.length - 2; i++) {
    if (e[i] > mitE * 1.15 && e[i] >= e[i - 1] && e[i] > e[i + 1]
        /* Mindestens sieben Fenster (11 ms) Abstand: der Auspuff
           klingt nach jedem Schlag nach, und in diesem Nachklang
           liegen kleine Wellen, die sonst als eigene Zuendung
           gezaehlt wuerden — beim ersten Versuch kamen so 113 statt
           88 Pulse heraus. */
        && (!spitzen.length || i - spitzen[spitzen.length - 1] >= 7)) spitzen.push(i);
  }
  const abstaende = [];
  for (let i = 1; i < spitzen.length; i++) abstaende.push(spitzen[i] - spitzen[i - 1]);
  abstaende.sort((a, b) => a - b);
  const mittel = abstaende.length ? abstaende[Math.floor(abstaende.length / 2)] : 0;
  const hz = mittel ? 1 / (mittel * 0.0016) : 0;
  sage(hz > 45 && hz < 130,
    "und man hoert die Zuendungen — eine Pulsfolge im Bereich eines Motors",
    spitzen.length + " Zuendungen, Abstand " + (mittel * 1.6).toFixed(1) + " ms, also "
      + hz.toFixed(1) + " Hz — rund " + Math.round(hz * 30) + " Umdrehungen in der Minute");
  sage(fs.existsSync(path.join(WURZEL, "werkzeug", "backup", "ton-runde88", "fahrt.opus")),
    "die alte Datei liegt gesichert im Backup");

  /* =================================================================
     3. UND IM BROWSER
     ================================================================= */
  console.log("\nUND IM BROWSER\n");
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
  pg.on("pageerror", (ev) => { console.log("  FEHL Seitenfehler: " + ev.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (ev) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });
  /* Jeden Abspielbefehl mitschreiben — anders laesst sich nicht
     feststellen, WANN welcher Ton anfaengt. */
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push({ t: Math.round(performance.now()),
        /* „loop" gleich hier mitschreiben: die Toene sind mit
           „new Audio(...)" gebaut und stehen NICHT im Dokument —
           hinterher im DOM danach zu suchen findet nichts. */
        loop: this.loop,
        n: (this.currentSrc || this.src || "").split("/").pop().split("?")[0]
             .replace(/\.(opus|m4a)$/, "") });
      return ap.call(this);
    };
  });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  /* GEFAHREN WIRD VON EMMI AUS, nicht von Alex. Auf der Pruefbuehne
     sitzt Alex auf Platz 1, und seine beiden Nachbarn (2 und 5) sind
     besetzt — es gibt also gar keinen freien Weg, und lcFahrt sagt
     zu Recht ab („Kein Weg frei"). Emmi sitzt auf Platz 5, daneben
     liegen die freien Plaetze 6, 7 und 8: das ist eine Fahrt ueber
     drei Felder und damit laenger als eine Schleife. */
  await pg.evaluate(() => { window.__toene = []; window.__start = performance.now();
    window.DMA_PRUEFUNG.wirkung("fahren", "8", "Emmi", {}); });
  await pg.waitForTimeout(4200);
  const toene = await pg.evaluate(() =>
    (window.__toene || []).map((t) => ({ n: t.n, t: Math.round(t.t - window.__start),
                                         loop: t.loop })));
  const fahrt = toene.filter((t) => t.n === "fahrt");
  const quiets = toene.filter((t) => t.n === "quietschen");
  sage(fahrt.length >= 1, "beim Fahren laeuft das Fahrgeraeusch",
    toene.map((t) => t.n + "@" + t.t).join(", ") || "kein Ton");
  sage(quiets.length >= 1 && quiets[0].t > 400,
    "und die Bremse kommt erst kurz vor der Ankunft",
    quiets.length ? quiets[0].t + " ms" : "keine");
  /* Und das Wichtigste: das Tonstueck steht beim Abspielen auf
     Schleife — sonst hoert der Motor nach 1,2 s auf. */
  sage(fahrt.length >= 1 && fahrt[0].loop === true,
    "und das Tonstueck steht wirklich auf Schleife",
    fahrt.length ? "loop = " + fahrt[0].loop : "gar nicht gespielt");
  /* Die Bremse dagegen darf NICHT schleifen. */
  sage(quiets.length >= 1 && quiets[0].loop === false,
    "die Bremse dagegen laeuft genau einmal",
    quiets.length ? "loop = " + quiets[0].loop : "gar nicht gespielt");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Punkt(e) offen" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
