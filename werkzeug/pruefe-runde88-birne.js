/* =====================================================================
   SONDE RUNDE 88 — DIE BIRNE IN DIE FASSUNG DREHEN
   ---------------------------------------------------------------------
   XANDER: „wenn man die Birne in die Fassung dreht und somit das Licht
   [anmacht], hat man nicht denselben Drehsound, den er hat, wenn man
   die Birne raus dreht. Wenn man die Birne rein dreht, klingt [es] …
   nicht realistisch."

   Gemessen wird der Unterschied, den er gehoert hat — und dass er weg
   ist. Ein Gewinde klingt nicht wie ein Motor: es RUCKT. Also muss die
   Huellkurve zwischen lauten Schabgeraeuschen und Stille springen, und
   die Energie muss oben liegen, nicht im Brummbereich.
   ===================================================================== */
const fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const WURZEL = path.join(__dirname, "..");
const FF = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const RATE = 24000;

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};
function laden(name) {
  const roh = path.join("/tmp/claude-0", "pr88b-" + name + ".raw");
  execFileSync(FF, ["-v", "error", "-i", path.join(WURZEL, "ton", name + ".opus"),
    "-f", "s16le", "-ar", String(RATE), "-ac", "1", roh, "-y"]);
  const b = fs.readFileSync(roh);
  const x = new Float64Array(b.length / 2);
  for (let i = 0; i < x.length; i++) x[i] = b.readInt16LE(i * 2) / 32768;
  return x;
}
function messen(x) {
  const w = Math.round(RATE * 0.05), db = [];
  for (let i = 0; i + w <= x.length; i += w) {
    let s = 0;
    for (let k = i; k < i + w; k++) s += x[k] * x[k];
    db.push(20 * Math.log10(Math.max(Math.sqrt(s / w), 1e-9)));
  }
  /* Der Schwerpunkt des Spektrums — grob ueber eine Fourier-Summe auf
     32 Baendern, das reicht fuer „oben oder unten". */
  const N = 1 << 14;
  const re = new Float64Array(64), im = new Float64Array(64);
  const bis = Math.min(x.length, N);
  for (let b = 1; b <= 63; b++) {
    const f = b * 180;                       /* 180 Hz je Band */
    for (let i = 0; i < bis; i += 2) {
      const a = 2 * Math.PI * f * i / RATE;
      re[b] += x[i] * Math.cos(a);
      im[b] -= x[i] * Math.sin(a);
    }
  }
  let oben = 0, ganz = 0;
  for (let b = 1; b <= 63; b++) {
    const p = re[b] * re[b] + im[b] * im[b];
    oben += p * b * 180; ganz += p;
  }
  return { dauer: x.length / RATE, db: db,
           spanne: Math.max.apply(null, db) - Math.min.apply(null, db),
           schwer: ganz ? oben / ganz : 0 };
}

console.log("RUNDE 88 — Die Birne in die Fassung drehen\n");

const rein = messen(laden("birnedrehen"));
const raus = messen(laden("birneschrauben"));

console.log("HINEINDREHEN  " + rein.dauer.toFixed(2) + " s, Schwerpunkt "
  + Math.round(rein.schwer) + " Hz, Spanne " + rein.spanne.toFixed(0) + " dB");
console.log("HERAUSDREHEN  " + raus.dauer.toFixed(2) + " s, Schwerpunkt "
  + Math.round(raus.schwer) + " Hz, Spanne " + raus.spanne.toFixed(0) + " dB\n");

sage(rein.schwer > 2500,
  "das Hineindrehen klingt nach Metall, nicht nach Motor",
  "Schwerpunkt " + Math.round(rein.schwer) + " Hz (die alte Datei lag bei 674)");
sage(rein.spanne > 25,
  "und es RUCKT: laute Schabgeraeusche mit Stille dazwischen",
  rein.spanne.toFixed(0) + " dB Spanne (die alte hatte 18)");
sage(Math.abs(rein.schwer - raus.schwer) < 2600,
  "es klingt jetzt wie das Herausdrehen — dasselbe Gewinde",
  "hinein " + Math.round(rein.schwer) + " Hz, heraus " + Math.round(raus.schwer) + " Hz");

/* Und es wird ENGER, nicht weiter: die Rucker muessen gegen Ende
   dichter und lauter kommen. Gezaehlt wird in der ersten und in der
   letzten Haelfte. */
const mitte = Math.floor(rein.db.length / 2);
const zaehle = (von, bis) => {
  const teil = rein.db.slice(von, bis);
  const boden = Math.min.apply(null, teil);
  let n = 0;
  for (let i = 1; i < teil.length - 1; i++) {
    if (teil[i] > boden + 12 && teil[i] >= teil[i - 1] && teil[i] > teil[i + 1]) n++;
  }
  return n;
};
const vorn = zaehle(0, mitte), hinten = zaehle(mitte, rein.db.length);
sage(hinten >= vorn,
  "und die Rucker kommen dichter, je weiter sie hineingeht — es wird eng",
  vorn + " in der ersten Haelfte, " + hinten + " in der zweiten");
const lautVorn = Math.max.apply(null, rein.db.slice(0, mitte));
const lautHinten = Math.max.apply(null, rein.db.slice(mitte));
sage(lautHinten >= lautVorn - 1,
  "und sie werden nicht leiser — der Widerstand nimmt ja zu",
  lautVorn.toFixed(0) + " dB vorn, " + lautHinten.toFixed(0) + " dB hinten");

/* Der Kontakt klickt in app.js, nicht in der Datei: er muss genau
   dann kommen, wenn hier Schluss ist. */
const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
sage(/lcTonSpaeter\("birneplopp", 2320, 0\.5\);/.test(js),
  "das Einrasten kommt bei 2320 ms — dort endet das Drehen (2,30 s)");
sage(/gluehbirne: *\{ ton: "birnedrehen"/.test(js),
  "und das Hineindrehen benutzt wirklich diese Datei");
sage(fs.existsSync(path.join(WURZEL, "werkzeug", "backup", "ton-runde88", "birnedrehen.opus")),
  "die alte Datei liegt gesichert im Backup");

console.log(fehler ? "\n" + fehler + " Punkt(e) offen" : "\nalles gruen");
process.exit(fehler ? 1 : 0);
