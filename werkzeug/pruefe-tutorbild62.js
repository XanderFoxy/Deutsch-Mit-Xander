#!/usr/bin/env node
/* =========================================================
   RUNDE 62 — DAS STANDBILD KLEBT NICHT MEHR HINTER DEM FILM
   ---------------------------------------------------------
   GEMELDET: „der Originalavatar klebt immer noch hinter mir.
   Das sieht aus, als wenn zwei uebereinander gesetzt sind …
   ich sehe immer noch Freistellungsluecken in den Schuhen."

   Die zweite Meldung war eine Folge der ersten. Das Standbild
   wurde beim Film nur ANGEHALTEN (animation: none), nicht
   versteckt. Ueberall, wo der Film durchsichtig ist — zwischen
   den Beinen, am Rand, an jeder Kante —, stand das Standbild
   dahinter und zeigte eine ANDERE Haltung. Das sieht aus wie
   eine Luecke, ist aber keine.

   Geprueft wird die Regel selbst, an einer nackten Buehne:
     · laeuft der Film, ist das Standbild unsichtbar,
     · laeuft er nicht, ist es wieder da (der Rueckfall!),
     · und beides gilt auch ohne „:has()", ueber die Klasse
       tutor-film-laeuft, die der Tutor selbst setzt.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
(async () => {
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage();
  await pg.setContent(
    "<!doctype html><meta charset='utf-8'><style>" + css + "</style>"
    + "<div class='tutor-buehne' id='a'>"
    + "  <img class='tutor-figur' alt=''>"
    + "  <video class='tutor-video tutor-video-da' muted></video>"
    + "  <canvas class='tutor-maske'></canvas>"
    + "</div>"
    + "<div class='tutor-buehne' id='b'>"
    + "  <img class='tutor-figur' alt=''>"
    + "  <video class='tutor-video' muted></video>"
    + "  <canvas class='tutor-maske'></canvas>"
    + "</div>"
    + "<div class='tutor-buehne tutor-film-laeuft' id='c'>"
    + "  <img class='tutor-figur' alt=''>"
    + "  <video class='tutor-video' muted></video>"
    + "</div>"
    + "<div class='tutor-buehne' id='d'>"
    + "  <img class='tutor-figur' alt=''>"
    + "  <canvas class='tutor-maske tutor-video-da'></canvas>"
    + "</div>");
  const sicht = (id) => pg.evaluate((i) =>
    getComputedStyle(document.querySelector("#" + i + " .tutor-figur")).visibility, id);

  console.log("\nLAEUFT DER FILM, IST DAS STANDBILD WEG\n");
  pruefe("mit laufendem Film ist das Standbild unsichtbar",
    (await sicht("a")) === "hidden", await sicht("a"));
  pruefe("und ohne Film steht es wieder da — der Rueckfall bleibt",
    (await sicht("b")) === "visible", await sicht("b"));
  pruefe("auch ueber die eigene Klasse, falls :has() fehlt",
    (await sicht("c")) === "hidden", await sicht("c"));
  pruefe("und beim Maskenweg (iPhone) genauso",
    (await sicht("d")) === "hidden", await sicht("d"));

  console.log("\nUND DER TUTOR SETZT DIE KLASSE AUCH WIRKLICH\n");
  const app = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  pruefe("es gibt den Schalter im Code", /function tutorFilmLaeuft\(ja\)/.test(app));
  pruefe("er wird beim Start des Films gesetzt",
    /tutorFilmLaeuft\(true\)/.test(app),
    (app.match(/tutorFilmLaeuft\(true\)/g) || []).length + "-mal");
  pruefe("und beim Ausfall wieder geloescht",
    /tutorFilmLaeuft\(false\)/.test(app));

  await br.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nKein zweiter Alex mehr hinter dem Film.\n");
  process.exit(fehler ? 1 : 0);
})();
