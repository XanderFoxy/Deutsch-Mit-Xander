#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 90 — DER BUMERANG: GEMESSEN AM TON, NICHT AM QUELLTEXT
   ---------------------------------------------------------------------
   XANDER (20.09.2026, 23:51): „Bumerang — da fehlt dieses SWOOSH
   Geraeusch, was er macht, wenn er los fliegt und dann den Aufprall
   macht. Danach musst du auch ausrechnen, dass in dem Moment, wo der
   Bumerang aufprallt, das SWOOSH Geraeusch auch zu Ende ist."
   Und: „Den Bumerang Sound kannst du ueberarbeiten."
   Und (Runde 73): „Er muss erst mal auftreffen, man muss das hoelzerne
   Geraeusch, und dann muss der Schrei kommen — und das nicht sofort so
   getimet, dass der Schrei sofort zu hoeren ist. Das muss ja erst mal
   weh tun."

   WARUM DIESE SONDE ANDERS PRUEFT ALS DIE ALTEN:
   pruefe-runde70/72/73 suchen im Quelltext nach den Zahlen („860",
   „1560"). Das sagt, dass die Zahlen dastehen — nicht, ob der Ton zum
   richtigen Zeitpunkt VERKLUNGEN ist. Dafuer muss man die Datei
   aufmachen. Diese Sonde rechnet deshalb mit der WELLENFORM:
     · wann faengt das Sausen an (aus LC_TREFFER in app.js),
     · wie lange ist noch etwas zu hoeren (aus ton/swoosh.opus),
     · und wann klopft das Holz (aus lcTonSpaeter in app.js).
   Erst daraus ergibt sich, ob sein Satz stimmt.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const WURZEL = path.join(__dirname, "..");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const RATE = 48000;

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

/* Eine Tondatei als Zahlenreihe — und daraus die zwei Werte, auf die
   es ankommt: wann ist die Spitze, und ab wann ist praktisch nichts
   mehr zu hoeren (unter 2 Prozent der Spitze). */
function tonMessen(name) {
  const datei = path.join(WURZEL, "ton", name + ".opus");
  if (!fs.existsSync(datei)) return null;
  const roh = execFileSync(FFMPEG,
    ["-v", "error", "-i", datei, "-f", "f32le", "-ac", "1", "-ar", String(RATE), "-"],
    { maxBuffer: 1 << 28 });
  const x = new Float32Array(roh.buffer, roh.byteOffset, Math.floor(roh.length / 4));
  let spitze = 0, spitzeBei = 0;
  for (let i = 0; i < x.length; i++) {
    const b = Math.abs(x[i]);
    if (b > spitze) { spitze = b; spitzeBei = i; }
  }
  const grenze = spitze * 0.02;
  let letzter = 0;
  for (let i = x.length - 1; i >= 0; i--) {
    if (Math.abs(x[i]) > grenze) { letzter = i; break; }
  }
  return { laenge: x.length / RATE * 1000,
           spitze: spitzeBei / RATE * 1000,
           still: letzter / RATE * 1000,
           laut: spitze };
}

const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
const zahl = (re) => {
  const m = re.exec(js);
  return m ? Number(m[1]) : NaN;
};

console.log("\nDIE ZEITEN, WIE SIE IM PROGRAMM STEHEN\n");
const beginnSausen = zahl(/bumerang:\s*(\d+),\s*\/\* der Hinweg/);
const klopfen = zahl(/lcTonSpaeter\("holzklopf",\s*(\d+),/);
const schrei = zahl(/lcStimmeZu\(platz,\s*"schreimann",\s*"schreifrau",\s*(\d+),/);
const rueckweg = zahl(/lcTonSpaeter\("bumerang2",\s*(\d+),/);
const dauer = zahl(/\},\s*(\d+),\s*"bumerang"\);/);

sage(beginnSausen > 0, "das Sausen faengt auf dem HINWEG an, nicht beim Treffer",
  beginnSausen + " ms");
sage(klopfen > beginnSausen, "das hoelzerne Klopfen kommt danach", klopfen + " ms");
sage(schrei > klopfen, "und der Schrei erst nach dem Klopfen — „das muss ja erst mal weh tun“",
  (schrei - klopfen) + " ms spaeter");

console.log("\nUND JETZT DIE DATEIEN SELBST\n");
const sw = tonMessen("swoosh");
const bu = tonMessen("bumerang2");
const hz = tonMessen("holzklopf");
sage(Boolean(sw && bu && hz), "die drei Toene liegen da");
if (sw && bu && hz) {
  const sausenEnde = beginnSausen + sw.still;
  sage(sausenEnde <= klopfen + 60,
    "„dass in dem Moment, wo der Bumerang aufprallt, das SWOOSH Geraeusch auch zu Ende ist“",
    "verklungen bei " + Math.round(sausenEnde) + " ms, Aufprall bei " + klopfen + " ms");
  sage(sw.spitze < 400,
    "und die Spitze des Sausens liegt mitten im Flug, nicht am Ende",
    "Spitze der Datei bei " + Math.round(sw.spitze) + " ms");
  sage(rueckweg > klopfen && rueckweg + bu.still <= dauer,
    "der Rueckflug saust noch einmal — und ist vor dem Ende durch",
    "von " + rueckweg + " bis " + Math.round(rueckweg + bu.still) + " ms (Animation: " + dauer + " ms)");
  sage(hz.still <= 300, "das Klopfen ist kurz, wie Holz",
    Math.round(hz.still) + " ms");
}

console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
process.exit(fehler ? 1 : 0);
