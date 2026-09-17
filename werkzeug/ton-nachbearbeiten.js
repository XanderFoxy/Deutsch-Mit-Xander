#!/usr/bin/env node
/* NACHBEARBEITUNG DER AUFNAHMEN.
   ---------------------------------------------------------------
   Was von ElevenLabs kommt, ist 128 kb/s bei 44,1 kHz — Studioformat
   fuer ein einzelnes kurzes Wort. Bei 2277 Woertern waeren das rund
   68 MB, die jemand am Handy im Mobilfunknetz laedt. Das geht nicht.

   Drei Schritte, in dieser Reihenfolge:

     1. STILLE WEG, vorn und hinten. Jede Aufnahme faengt mit einer
        Atempause an; beim Aussprache-Trainer druecken Leute auf
        „hoeren" und wollen das Wort SOFORT.
     2. LAUTHEIT ANGLEICHEN (EBU R128, -16 LUFS). Einzeln erzeugte
        Aufnahmen schwanken; wer zehn Woerter hintereinander uebt,
        soll nicht dauernd am Regler drehen.
     3. ENTRAUSCHEN. Auch eine erzeugte Stimme bringt einen leisen
        Grundschleier mit, und bei EINEM kurzen Wort faellt er auf:
        man hoert das Rauschen anschwellen und wieder weggehen, weil
        die Lautheitsanpassung es mit hochzieht. Zwei Schritte:
          * ein Hochpass bei 70 Hz — darunter ist bei einer Stimme
            nichts ausser Netzbrummen und Trittschall;
          * afftdn, ein Entrauscher, der sich das Rauschprofil aus
            dem Anfang der Aufnahme selbst holt. Vorsichtig
            eingestellt (nm=-28 dB, nr=10 dB): kraeftiger entrauscht
            klingt eine Stimme blechern, und das waere schlimmer als
            ein bisschen Grundrauschen.
        Entrauscht wird VOR dem Angleichen — sonst hebt das
        Angleichen das Rauschen erst an und der Entrauscher muss
        gegen seine eigene Vorarbeit anrechnen.
     4. KLEINER MACHEN: 24 kHz, mono, 32 kb/s. Fuer ein gesprochenes
        Wort hoert man keinen Unterschied, die Datei ist aber ein
        Zehntel so gross.

   Aufruf:  node werkzeug/ton-nachbearbeiten.js <roh.mp3> <fertig.mp3>
            node werkzeug/ton-nachbearbeiten.js --ordner <roh/> <fertig/>
*/
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";

function bearbeiten(rein, raus) {
  execFileSync(FFMPEG, [
    "-hide_banner", "-loglevel", "error", "-y", "-i", rein,
    "-af", [
      /* Stille vorn: alles unter -45 dB wegschneiden, bis 0,03 s Ton kommt */
      "silenceremove=start_periods=1:start_duration=0.03:start_threshold=-45dB",
      /* Dasselbe hinten — dafuer das Stueck umdrehen, schneiden, zurueckdrehen */
      "areverse",
      "silenceremove=start_periods=1:start_duration=0.05:start_threshold=-45dB",
      "areverse",
      /* Ein Hauch Luft am Ende, sonst klingt es abgehackt */
      "apad=pad_dur=0.06",
      /* Entrauschen — VOR dem Angleichen, siehe oben */
      "highpass=f=70",
      "afftdn=nf=-28:nr=10:tn=1",
      /* Lautheit angleichen */
      "loudnorm=I=-16:TP=-1.5:LRA=11",
    ].join(","),
    "-ar", "24000", "-ac", "1", "-b:a", "32k", raus,
  ], { stdio: ["ignore", "ignore", "pipe"] });
}

const args = process.argv.slice(2);
if (args[0] === "--ordner") {
  const [, von, nach] = args;
  fs.mkdirSync(nach, { recursive: true });
  const dateien = fs.readdirSync(von).filter((f) => f.endsWith(".mp3"));
  let vorher = 0, nachher = 0, n = 0;
  for (const f of dateien) {
    const a = path.join(von, f), b = path.join(nach, f);
    try {
      bearbeiten(a, b);
      vorher += fs.statSync(a).size; nachher += fs.statSync(b).size; n++;
    } catch (e) { console.error("nicht bearbeitet:", f, String(e.message).slice(0, 120)); }
  }
  console.log(n + " Dateien: " + (vorher / 1048576).toFixed(1) + " MB → "
    + (nachher / 1048576).toFixed(1) + " MB");
} else if (args.length === 2) {
  bearbeiten(args[0], args[1]);
  const a = fs.statSync(args[0]).size, b = fs.statSync(args[1]).size;
  console.log(a + " → " + b + " Byte (" + Math.round((1 - b / a) * 100) + " % kleiner)");
} else {
  console.error("Aufruf: ton-nachbearbeiten.js <rein.mp3> <raus.mp3>");
  console.error("   oder: ton-nachbearbeiten.js --ordner <von/> <nach/>");
  process.exit(2);
}
