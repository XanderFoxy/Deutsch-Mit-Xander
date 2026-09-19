/* PRÜFT: DER TUTOR ERKLÄRT EINEN BEREICH IN MEHREREN STÜCKEN.
   ---------------------------------------------------------------
   Ein Unterbereich hatte bisher genau EINEN Text. Für das
   Klassenzimmer reicht das nicht mehr — es kann inzwischen so viel,
   dass der Text auf siebzig Sekunden Lesezeit angewachsen wäre, und
   das liest in einer einzigen Sprechblase niemand zu Ende.

   Gemessen wird: sind es wirklich mehrere Stücke, ist jedes kurz
   genug, und läuft es auch dann weiter, wenn zu einem Stück (noch)
   keine Tonaufnahme gehört — der Tutor darf nicht hängenbleiben. */
const fs = require("fs");
global.window = {};
require("/home/user/Deutsch-Mit-Xander/data-tutor.js");
const B = window.DMA_TUTOR_BEREICHE;
const V = window.DMA_TUTOR;
const toene = new Set(fs.readdirSync("/home/user/Deutsch-Mit-Xander/tutor")
  .map((f) => f.replace(/\.(m4a|mp3|wav)$/, "")));

let fehler = 0;
const ok = (b, was, zusatz) => { if (!b) fehler++; console.log("  " + (b ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };

console.log("\n  DAS KLASSENZIMMER");
const kz = B["sub-livechat"];
ok(Array.isArray(kz.stuecke) && kz.stuecke.length >= 3, "es sind mehrere Stücke",
   (kz.stuecke || []).length + " Stücke");
kz.stuecke.forEach((s, i) => {
  const sek = Math.max(3, Math.round(String(s.text || "").length / 15));
  ok(sek <= 30, "Stück " + (i + 1) + " ist in einer Sprechblase lesbar", sek + " s");
});
ok(kz.text && kz.text.length < 250, "und für ältere Fassungen steht ein kurzer Text bereit");

console.log("\n  WAS DAVON SCHON AUFGENOMMEN IST");
const ohne = [];
Object.keys(B).forEach((k) => {
  const st = B[k];
  const liste = Array.isArray(st.stuecke) ? st.stuecke : [st];
  liste.forEach((s) => { if (!s.ton || !toene.has(s.ton)) ohne.push(k); });
});
Object.keys(V).forEach((k) => {
  (V[k].stuecke || []).forEach((s) => { if (!s.ton || !toene.has(s.ton)) ohne.push(k); });
});
const wieviel = ohne.length;
console.log("  " + wieviel + " Stücke warten noch auf deine Stimme:");
[...new Set(ohne)].forEach((k) => {
  console.log("    " + k + "  (" + ohne.filter((x) => x === k).length + ")");
});
console.log("  Sie laufen so lange nach Lesezeit weiter — kein stummer Tutor.");

console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "Der Tutor erklärt das Klassenzimmer in Portionen.") + "\n");
process.exit(fehler ? 1 : 0);
