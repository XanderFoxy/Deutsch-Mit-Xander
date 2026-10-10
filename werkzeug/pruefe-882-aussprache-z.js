#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 882: AUSSPRACHE „z" (Funk 302)
   ---------------------------------------------------------------------
   XANDER (wörtlich): „die Aussprache ist immer noch nicht gut bei vielen
   Sachen wenn z gesprochen wird oder dann reagiert Azure ganz komisch
   und klingt gar nicht nach dem deutschen Wort".
   Ursache war das Umrechnen der Aufnahme auf 16 kHz ohne Tiefpass
   (aussprache-pruefung.js): alles über 8 kHz – das Zischen von s, z, sch,
   f – faltete zurück ins Sprachband. Geprüft an der echten Datei
   (AusspracheP.alsWav, wie Trainer, Spiel und Wörterbuch sie benutzen):
     • bei 48 kHz und 44,1 kHz kommt ein 11-kHz-Anteil NICHT als 5 kHz an
       (früher 0,5 bzw. 0,41 – jetzt unter 0,01)
     • Sprache bis 5,5 kHz bleibt erhalten (1 kHz und 5,5 kHz ≥ 95 %)
     • die WAV-Datei ist 16 kHz, 16 Bit, mono; 12 s Aufnahme < 1,5 s Rechenzeit
   AUFRUF  node werkzeug/pruefe-882-aussprache-z.js   (WURZEL=<Ordner>: anderer Stand)
   ===================================================================== */
const fs = require("fs"), path = require("path"), vm = require("vm");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
let fehler = 0;
const sage = (gut, text, dazu) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : "")); };

const fenster = { navigator: {}, localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, addEventListener() {}, setTimeout, clearTimeout, console };
fenster.window = fenster;
vm.runInNewContext(fs.readFileSync(path.join(WURZEL, "aussprache-pruefung.js"), "utf8"), Object.assign(fenster, { Blob, Float32Array, Int16Array, Uint8Array, ArrayBuffer, DataView, Math, Promise, JSON, Object, Array, String, Number }));
const AP = fenster.AusspracheP;
const anteil = (x, f, sr) => { let re = 0, im = 0; for (let i = 0; i < x.length; i++) { re += x[i] * Math.cos(2 * Math.PI * f * i / sr); im += x[i] * Math.sin(2 * Math.PI * f * i / sr); } return 2 * Math.hypot(re, im) / x.length; };
const puffer = (sr, d) => ({ numberOfChannels: 1, sampleRate: sr, length: d.length, duration: d.length / sr, getChannelData: () => d });

(async () => {
  console.log("\nUMRECHNEN AUF 16 kHz (aussprache-pruefung.js alsWav)\n");
  sage(!!(AP && AP.alsWav), "AusspracheP.alsWav ist da");
  for (const sr of [48000, 44100]) {
    const n = sr * 2, x = new Float32Array(n);
    for (let i = 0; i < n; i++) x[i] = 0.5 * Math.sin(2 * Math.PI * 1000 * i / sr) + 0.3 * Math.sin(2 * Math.PI * 5500 * i / sr) + 0.5 * Math.sin(2 * Math.PI * 11000 * i / sr);
    const t0 = Date.now(), blob = AP.alsWav(puffer(sr, x)), ms = Date.now() - t0;
    const b = Buffer.from(await blob.arrayBuffer()), rate = b.readUInt32LE(24), bits = b.readUInt16LE(34), kanaele = b.readUInt16LE(22);
    const pcm = new Int16Array(b.buffer, b.byteOffset + 44, (b.length - 44) / 2), y = Float32Array.from(pcm, (v) => v / 32768);
    const a1 = anteil(y, 1000, 16000), a55 = anteil(y, 5500, 16000), falt = anteil(y, 5000, 16000);
    sage(rate === 16000 && bits === 16 && kanaele === 1, sr + " Hz → WAV 16 kHz, 16 Bit, mono", JSON.stringify({ rate, bits, kanaele, ms }));
    sage(falt < 0.01, sr + " Hz: das 11-kHz-Zischen faltet NICHT auf 5 kHz zurück (früher " + (sr === 48000 ? "0,50" : "0,41") + ")", "5 kHz: " + falt.toFixed(4));
    sage(a1 > 0.475 && a55 > 0.285, sr + " Hz: Sprachband bleibt (1 kHz und 5,5 kHz ≥ 95 %)", JSON.stringify({ "1k": +a1.toFixed(3), "5.5k": +a55.toFixed(3) }));
  }
  const lang = new Float32Array(48000 * 12); for (let i = 0; i < lang.length; i++) lang[i] = Math.sin(i * 0.37) * 0.3 + (((i * 7919) % 1000) / 1000 - 0.5) * 0.2;
  const t0 = Date.now(); AP.alsWav(puffer(48000, lang)); const ms = Date.now() - t0;
  sage(ms < 1500, "12 s Aufnahme bei 48 kHz in unter 1,5 s umgerechnet", ms + " ms");
  console.log(fehler ? "\n" + fehler + " FEHLER" : "\nALLES GRÜN");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
