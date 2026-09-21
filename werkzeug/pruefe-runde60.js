#!/usr/bin/env node
/* =========================================================
   RUNDE 60 — DER TUTOR REDET KUERZER UND SIEHT AUS WIE ER SELBST
   ---------------------------------------------------------
   Gemeldet war dreierlei, und alles drei wird hier gemessen
   statt behauptet:

   · „Pass auf, dass der Tutor nicht so viel erzaehlt … du musst
     nicht doppelt gemoppelt sagen. Ausserdem bin ich Musiker und
     deutscher Muttersprache."
   · „der Kalender ist eher in der Mitte, nicht links — als erstes
     ist der Kalender, dann kommt das Profil, dann die
     Kaffeetasse, und darunter links das Wetter, rechts die
     Uhrzeit."
   · „der Avatar soll genauso gross sein wie der alte, meiner ist
     fast doppelt so gross … unten rechts liegt irgend so ein
     Symbol, was da nicht hingehoert."

   Die Bildmessung an den Filmen selbst macht
   werkzeug/pruefe-tutorfilm60.py — hier steht, was in den
   Dateien steht und was die Seite daraus macht.
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

global.window = {};
require(path.join(WURZEL, "data-tutor.js"));
require(path.join(WURZEL, "data-tutorvideo.js"));
const T = global.window.DMA_TUTOR;
const FILME = new Set(String(global.window.DMA_TUTORVIDEO || "").split("|").filter(Boolean));
const app = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8");
const ueber = T["view-about"].stuecke;

console.log("\nWAS ALEX UEBER SICH SAGT\n");

/* 1. Kein ‚Deutsch-Helfer‘, kein ‚Lehrer nenne ich mich nicht‘. */
const eins = ueber[0].text;
pruefe("kein ‚Deutsch-Helfer‘ mehr", !/Deutsch-Helfer/.test(eins));
pruefe("kein ‚Lehrer nenne ich mich nicht‘ mehr", !/Lehrer nenne ich mich/.test(eins));
pruefe("dafuer ‚Musiker und deutscher Muttersprachler‘",
  /Musiker und deutscher Muttersprachler/.test(eins));
pruefe("und es bleibt bei einem kurzen Satz dazu", eins.length <= 140,
  eins.length + " Zeichen");

/* 2. Die Reihenfolge im Kopf — erst nachgesehen, dann behauptet.
      In index.html stehen die drei Knoepfe in dieser Folge. */
const kopf = html.slice(html.indexOf("header-actions"), html.indexOf("header-actions") + 1400);
const iKal = kopf.indexOf("calendarPageBtn"), iPro = kopf.indexOf("loginBtn"), iKaf = kopf.search(/buymeacoffee|kaffee|coffee/i);
pruefe("in index.html steht der Kalender wirklich zuerst", iKal > -1 && iKal < iPro, "Kalender " + iKal + ", Profil " + iPro);
pruefe("danach kommt die Tasse", iKaf > iPro, "Tasse " + iKaf);

const drei = ueber[2].text;
pruefe("der Tutor sagt nicht mehr ‚Der Kalender links‘", !/Kalender links/.test(drei));
pruefe("er zaehlt Kalender, Profilbild, Kaffeetasse in dieser Folge auf",
  drei.indexOf("Kalender") > -1
  && drei.indexOf("Kalender") < drei.indexOf("Profilbild")
  && drei.indexOf("Profilbild") < drei.indexOf("Kaffeetasse"));

/* 3. Wetter links, Uhrzeit rechts — in der Seite und im Text. */
const leiste = html.slice(html.indexOf("weather-bar"), html.indexOf("weather-bar") + 700);
pruefe("in der Leiste steht das Wetter vor der Uhr",
  leiste.indexOf("weatherText") > -1 ? leiste.indexOf("weatherText") < leiste.indexOf("analogClock")
                                     : leiste.indexOf("analog-clock") > 0);
const vier = ueber.find((s) => s.ton === "ueber-04").text;
pruefe("und der Tutor sagt es in derselben Folge",
  vier.indexOf("Wetter") < vier.indexOf("Uhrzeit"));

/* 4. Nichts sagt mehr etwas anderes als die Aufnahme. */
console.log("\nKEIN MUND, DER ETWAS ANDERES SAGT\n");
const toene = ueber.map((s) => s.ton);
pruefe("das erste Stueck hat keinen alten Ton mehr", toene[0] === "");
pruefe("das Kalender-Stueck hat keinen alten Ton mehr", toene[2] === "");
pruefe("und auch keinen alten Film", !FILME.has("ueber-01b") && !FILME.has("ueber-03"));
pruefe("die alten Aufnahmen sind aufgehoben, nicht geloescht",
  fs.existsSync(path.join(WURZEL, "tutor/alt/ueber-01b.opus"))
  && fs.existsSync(path.join(WURZEL, "tutor/alt/ueber-03.opus"))
  && fs.existsSync(path.join(WURZEL, "tutor/video/alt/ueber-01b.webm")));

/* 5. Zu jedem Ton liegt die Datei da — in beiden Endungen. */
let fehlend = [];
for (const [ansicht, v] of Object.entries(T)) {
  for (const st of v.stuecke) {
    if (!st.ton) continue;
    for (const e of [".opus", ".m4a"]) {
      if (!fs.existsSync(path.join(WURZEL, "tutor", st.ton + e))) fehlend.push(ansicht + "/" + st.ton + e);
    }
  }
}
pruefe("jeder genannte Ton liegt als .opus und .m4a da", fehlend.length === 0, fehlend.join(" "));
pruefe("jeder gelistete Film liegt wirklich da",
  [...FILME].every((n) => fs.existsSync(path.join(WURZEL, "tutor/video", n + ".webm"))));

/* 6. Das Wetterstueck ist geteilt — und zwar an der gemessenen Stelle. */
console.log("\nDAS LANGE STUECK IST GETEILT, NICHT GEKUERZT\n");
pruefe("es gibt ein eigenes Newsticker-Stueck", toene.includes("ueber-04b"));
const dauer = (p) => {
  const { execSync } = require("child_process");
  const ff = process.env.FF || "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
  const t = execSync(ff + " -hide_banner -i " + p + " 2>&1 || true").toString();
  const m = t.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return m ? (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]) : 0;
};
const d4 = dauer(path.join(WURZEL, "tutor/ueber-04.opus"));
const d4b = dauer(path.join(WURZEL, "tutor/ueber-04b.opus"));
pruefe("der erste Teil ist kuerzer als 16 s", d4 > 13 && d4 < 16, d4.toFixed(2) + " s");
pruefe("der zweite Teil hat den Rest", d4b > 10 && d4b < 13, d4b.toFixed(2) + " s");
pruefe("zusammen so lang wie vorher (26,6 s)", Math.abs(d4 + d4b - 26.6) < 0.7,
  (d4 + d4b).toFixed(2) + " s");

/* 7. Der Film laeuft nur ueber dem Comic — gemessen am Kopf. */
console.log("\nDER FILM PASST ZUM STANDBILD\n");
pruefe("tutorFilmSetzen laesst den Film nur zum Comic zu",
  /if \(tutorArt\(\) !== "comic"\) \{ aus\(\); tutorMaskeStoppen\(\); v\.removeAttribute\("src"\); return; \}/.test(app));
pruefe("das Standbild bleibt dabei stehen", /img class="tutor-figur" id="tutorFigur"/.test(app));

/* 8. Die Saeuberung ist als Werkzeug da und nicht von Hand gemacht. */
pruefe("es gibt das Werkzeug zum Freistellen",
  fs.existsSync(path.join(WURZEL, "werkzeug/tutorfilm-saeubern.py")));

console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nRunde 60 sitzt.\n");
process.exit(fehler ? 1 : 0);
