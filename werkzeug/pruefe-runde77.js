#!/usr/bin/env node
/* =========================================================
   RUNDE 77 — XANDERS LISTE VOM 21. SEPTEMBER, DRITTER TEIL
   ---------------------------------------------------------
   Woertlich gemeldet, und hier steht zu jedem Punkt, woran
   sich nachsehen laesst, dass er behoben ist:

   · „das mit dem Blut funktioniert auch noch nicht so
      richtig, weil oben immer noch abgedeckt wird und es
      soll nach links und rechts ein bisschen fliessen und
      oben kein Volumen machen. Es soll nicht das Bild zu
      machen."
   · „dann der Effekt bei der Blume wurde noch nicht
      beruecksichtigt. Schau im Verlauf, was ich dir dazu
      gesagt habe." — und dort steht: „wie so eine
      Leuchtvignette drum, die nicht sein musste … das sieht
      so aus, als wenn man die Blaetter auf einen Kranz
      geklebt hat … die Blaetter sind auch nicht buendig …
      es soll an Ort und Stelle bluehen und sich nicht
      unbedingt drehen."
   · „mit dem Regenbogen. Das wurde auch noch nicht
      beruecksichtigt." — und dort steht: „er soll auch
      EXTRUDIEREN und er ist mir zu sehr innen" sowie „nicht
      von links nach rechts die Regenbogenfarben, sondern in
      Kreisen angeordnet von innen nach aussen."
   · „bei der Spinnwebe macht die Spinne auch keine Sache,
      die ich beschrieben habe, dass sie runtergeht und dann
      uebers Netz krabbelt … die Spinnwebe bricht vorher ab."
   · „bei dem Eis sollten die Eisblumen bisschen
      natuerlicher wachsen … ob die Eiszapfen ein bisschen
      mehr buendig sind, ohne wie Dreiecke drauf geklebt zu
      sein."
   · „das Gluehen … da koennen aber noch mehr Elemente sein
      … weniger grosse, mehr filigran feine Details."
   · „bei dem Magie-Effekt … koennt ihr auch etwas feiner
      sein."
   · „Wenn sich die Birne dreht, dann sieht es immer aus, als
      wenn sich die Glasbirne unter der Fassung dreht und die
      Fassung nicht mit dreht."
   · „das mit der Hand und der Gorilla Hand. Das kann unter
      einem Menue sein … das greift noch nicht richtig, die
      Hand zu, eine richtige Greif-Dynamik … und das
      Herauszupfgeraeusch realistischer sein und das
      Aufsatzgeraeusch auch realistischer."
   · „Bei dem Maulwurf … die Erdaufschuettung geht nicht
      schoen mittig durch alle Profilbilder durch."
   · „der runterschluerfe Effekt klingt so ein bisschen, als
      wuerde man was einsaugen, anstelle von dass es noch ne
      Schleimspur klingt."
   · „der Cowboy Sound kann noch ein bisschen besser."
   · „Generell die Effekte, die gemacht werden, sollen, egal
      ob derjenige spricht, trotzdem weitergehen."
   · „Bei einigen Animationen sind noch Rueckstaende, wo die
      Zahl dann noch haengt."
   ========================================================= */
const fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const ohneK = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");
const js = ohneK(fs.readFileSync(path.join(WURZEL, "app.js"), "utf8"));
const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
const cssOhne = ohneK(css);
/* Die SVG-Zeichnungen stehen als data:-URI im CSS, und dort ist
   alles prozentkodiert („M50%2C17" statt „M50,17"). Wer nach einem
   Pfad sucht, findet ihn dort nie. Deshalb werden alle data:-URIs
   einmal entschluesselt und hintenangehaengt. */
const cssKlar = css + "\n" + (css.match(/data:image\/svg\+xml,[^"')]+/g) || [])
  .map((u) => { try { return decodeURIComponent(u); } catch (e) { return ""; } })
  .join("\n");
const ton = (n) => fs.existsSync(path.join(WURZEL, "ton", n + ".opus"))
                && fs.existsSync(path.join(WURZEL, "ton", n + ".m4a"));
const gelistet = (n) => fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8")
  .split("|").some((x) => x.replace(/[^a-z0-9]/g, "") === n);

console.log("\nDAS BLUT DECKT DAS GESICHT NICHT MEHR ZU\n");
/* Der alte Deckel war ein voller Balken von left:-4% bis right:-4%
   mit 16 bis 34 Prozent Hoehe. Er ist ersatzlos weg. */
pruefe("oben liegt kein Balken mehr, sondern ein Saum",
  !/animation: lcBlutSpricht /.test(cssOhne)
  && /@keyframes lcBlutSaumR77/.test(css));
pruefe("der Saum folgt dem Bildrand, er deckt nicht",
  /radial-gradient\(ellipse 170% 100% at 50% -60%/.test(css));
pruefe("und es laeuft nach links und rechts herunter",
  /background-position: 50% 0%, 21% 0%, 79% 0%;/.test(css));
pruefe("bewegt wird nur, wie weit die Rinnsale gekommen sind",
  /0%   \{ background-size: 100% 100%, 7% 16%, 6% 11%; \}/.test(css)
  && /100% \{ background-size: 100% 100%, 7% 52%, 6% 40%; \}/.test(css));

console.log("\nDIE BLÜTE\n");
pruefe("die Leuchtvignette um die Blaetter ist weg",
  !/drop-shadow\(0 0 7px rgba\(255, 210, 235, \.55\)\)/.test(css));
/* Acht Blaetter im Abstand von 45 Grad liessen auf Radius 35 eine
   Luecke von 12,5 Einheiten. Jetzt zwei Kraenze zu je dreizehn. */
pruefe("es sind zwei Kraenze zu je dreizehn Blaettern",
  (cssKlar.match(/M50,17 C35\.5,13\.5 35\.5,6 50,1\.5 C64\.5,6 64\.5,13\.5 50,17 Z/g) || []).length === 13
  && (cssKlar.match(/M50,16 C36\.5,13 36\.5,8\.5 50,7 C63\.5,8\.5 63\.5,13 50,16 Z/g) || []).length === 13);
pruefe("die Blende gibt das Foto frei — der Ansatz sitzt am Rahmen",
  /circle closest-side, transparent 0 64%, #000 68% 100%/.test(css));
pruefe("und sie blueht an Ort und Stelle, sie dreht sich nicht",
  /@keyframes lcSfBlueteR77/.test(css)
  && !/lcSfBlueteR77 \{[\s\S]{0,400}?rotate\(/.test(cssOhne));

console.log("\nDER REGENBOGEN LIEGT IN KREISEN\n");
pruefe("kein Kegelverlauf mehr — der legt die Farben rundherum ab",
  /@keyframes lcSfRegenbogenR77/.test(css)
  && /\.lc-platz-spricht\[data-sprechbild="regenbogen"\]::after \{\s*\n\s*background: radial-gradient\(circle closest-side,/.test(css));
pruefe("innen violett, aussen rot — die Ordnung eines Regenbogens",
  /#b96bff 66\.5%, #6a8dff 70%, #4fd7c3 74%, #7ddf64 78%/.test(css)
  && /#ffe66d 82%, #ffb347 86%, #ff8a3d 89%, #ff5a5a 92%/.test(css));
pruefe("und er faengt am Bildrand an, nicht im Bild",
  /transparent 0 64%, #000 68% 94%, transparent 100%/.test(css));

console.log("\nDAS SPINNENNETZ HÄLT, UND DIE SPINNE KRABBELT\n");
/* Die alte Regel steht noch im Blatt — sie wird jetzt ueberschrieben,
   nicht geloescht (so bleibt nachlesbar, was vorher dort stand).
   Gemessen wird deshalb, dass die NEUE Regel das Netz zeichnet. */
pruefe("das Netz ist ein Radnetz, kein Kegelverlauf in der Ecke",
  /lcNetzZittertR77/.test(css)
  && /\[data-sprechbild="spinnweb"\] \.lc-kreis::before \{\s*\n\s*background: url\("data:image\/svg\+xml,/.test(css));
/* Radius 66 bei einem Bildrand von 50: die Speiche nach oben endet
   also bei y = 34 - 66 = -32, weit ausserhalb. */
pruefe("seine Speichen laufen weit ueber den Bildrand hinaus",
  /M50,34 L50,-32/.test(cssKlar));
/* 26 Sekunden Abseilen hat niemand gesehen, der zwei Saetze sagt. */
pruefe("die Spinne haengt nach 2,8 s unten, nicht nach 26 s",
  /animation: lcSpinneSeiltR77 2\.8s cubic-bezier\(\.3, \.6, \.5, 1\) both,/.test(css)
  && /lcSpinneKrabbeltR77 5\.2s 2\.8s ease-in-out infinite,/.test(css));
pruefe("und sie sinkt weiter, je laenger gesprochen wird",
  /lcSpinneTieferR77 30s 2\.8s linear forwards;/.test(css)
  && /@keyframes lcSpinneTieferR77 \{\s*\n\s*from \{ top: 0; \}/.test(css));

console.log("\nDAS EIS\n");
/* Die Zapfen sassen als gerade Dreiecke als Sehne am runden Rahmen. */
pruefe("die Zapfen haengen an einem durchgehenden Saum",
  /A 35\.7 35\.7 0 0 1 /.test(cssKlar));
pruefe("ihr Fuss ist ein Stueck des Kreisbogens, nicht eine Sehne",
  (cssKlar.match(/A 33\.3 33\.3 0 0 0 /g) || []).length >= 19);
pruefe("die Eisblumen wachsen von aussen herein",
  /@keyframes lcEisblumeR77/.test(css)
  && /-webkit-mask-size: 320% 320%; mask-size: 320% 320%;/.test(css)
  && /-webkit-mask-size: 68% 68%; mask-size: 68% 68%;/.test(css));

console.log("\nGLÜHEN UND MAGIE: MEHR UND FEINER\n");
pruefe("das Funkeln hat 64 Teilchen statt 36",
  /funkeln:\{ menge: 64,/.test(js));
pruefe("die Magie hat 66 statt 38",
  /magie:  \{ menge: 66,/.test(js));
pruefe("und die Groesse wird schief gewuerfelt — viele kleine",
  /const fein = art === "magie" \|\| art === "funkeln";/.test(js)
  && /\? \(0\.4 \+ wurf \* wurf \* 1\.15\)\.toFixed\(2\)/.test(js));

console.log("\nDIE GLÜHBIRNE DREHT SICH MIT IHREM SCHAFT\n");
pruefe("auf dem Schaft laeuft ein Lichtband",
  /class="lc-birne-schaftlicht"/.test(js)
  && /url\(#bglanz\)/.test(js));
/* 34 Einheiten Schaftbreite je Umdrehung, 1044 Grad sind 2,9
   Umdrehungen: 34 * 1044/360 = 98,6. */
pruefe("und es laeuft im Takt der drei Umdrehungen des Glases",
  /@keyframes lcBirneSchaftR77/.test(css)
  && /22%  \{ transform: translateX\(34px\); \}/.test(css)
  && /58%, 100% \{ transform: translateX\(98\.6px\); \}/.test(css));

console.log("\nDIE HAND: EIN MENÜ, EIN GRIFF, ZWEI TÖNE\n");
pruefe("Gotteshand und Gorillapranke stehen unter EINER Kachel",
  /\["\\ud83e\\udd1a", "Hand", "gotteshand",/.test(js)
  && /\["\\ud83e\\udd8d", "Gorillapranke", "pranke"\]\]\],/.test(js));
pruefe("und das Anreise-Menue kann Untermenues",
  /lcUnterMenue\(platz, String\(nr\), wort, unter\);/.test(js));
pruefe("die Finger knicken beim Zupacken ein",
  /const greifWinkel = \[-6, -2, 3, 8\];/.test(js)
  && /transform: "scaleY\(\.58\) rotate\(" \+ w \+ "deg\)", offset: greifZu/.test(js));
pruefe("der Daumen kommt von der anderen Seite dagegen",
  /transform: "rotate\(-24deg\)", offset: greifZu/.test(js));
/* Ohne transform-box dreht ein SVG-Pfad um den Nullpunkt der
   Zeichnung — dann klappt der Finger nicht zu, er fliegt weg. */
pruefe("und jeder Finger dreht um seinen eigenen Knoechel",
  /\.lc-rhand-finger, \.lc-rhand-daumen \{\s*\n\s*transform-box: fill-box;\s*\n\s*transform-origin: 50% 0%;/.test(css));
pruefe("das Herauszupfen hat einen eigenen Ton",
  ton("zupfraus") && gelistet("zupfraus")
  && /lcTonSpaeter\("zupfraus", Math\.round\(hin \* 0\.29\), 0\.8\)/.test(js));
pruefe("und das Aufsetzen auch — \u201ebonk\u201c war ein Comic-Schlag",
  ton("aufsetzen") && gelistet("aufsetzen")
  && /gotteshand: "aufsetzen", pranke: "aufsetzen", frisbee: "bonk"/.test(js));

console.log("\nDER MAULWURF SCHÜTTET DURCH DIE BILDER AUF\n");
/* Gemessen (Platz 2 nach Platz 4, Bildmitten 175|277 und 396|277):
   vorher lagen alle fuenf Haufen auf derselben Seite der Linie
   (Mittel -10,6 px), nachher streuen sie darum (Mittel -1,6 px). */
pruefe("der Wall laeuft auf der Linie der BILDmitten",
  /const versatzM0 = lcBildVersatz\(ab\.el\);/.test(js)
  && /const versatzM1 = lcBildVersatz\(zu\.el\);/.test(js)
  && /\+ \(versatzM0 \+ \(versatzM1 - versatzM0\) \* t\)/.test(js));
pruefe("und die dicken Stellen suchen ebenfalls die Bildmitten",
  /Math\.hypot\(g\.x - x, \(g\.y \+ lcBildVersatz\(g\.el\)\) - y\)/.test(js));

console.log("\nDIE TÖNE\n");
pruefe("die Farbe laeuft, sie saugt nicht mehr ein",
  ton("farbelaeuft") && gelistet("farbelaeuft")
  && fs.existsSync(path.join(WURZEL, "werkzeug", "backup", "ton-runde77b", "farbelaeuft.opus")));
pruefe("der Cowboy-Ruf ist neu, und die Animation passt dazu",
  ton("cowboy") && /hut:            \{ ton: "cowboy",    dauer: 3000/.test(js)
  && /animation: lcHutR76 3s linear both;/.test(css));
pruefe("die alten Toene liegen im Backup",
  fs.existsSync(path.join(WURZEL, "werkzeug", "backup", "ton-runde77b", "cowboy.opus")));

console.log("\nWAS SCHON VORHER IN DIESER RUNDE LIEF\n");
/* „Generell die Effekte sollen, egal ob derjenige spricht,
   trotzdem weitergehen." Die Regel .lc-platz-spricht .lc-kreis hatte
   zwei Klassen (0,2,0) und schlug damit jede Effektklasse (0,1,0). */
/* Der gruene Puls lag auf `.lc-platz-spricht .lc-kreis` — zwei
   Klassen (0,2,0) — und schlug damit jede Effektklasse (0,1,0).
   „animation" kann nur einmal gesetzt sein, also hoerte die Muenze
   auf zu drehen. Jetzt liegt der Hof auf ::after. */
pruefe("ein Effekt laeuft weiter, auch wenn jemand spricht",
  !/\.lc-platz-spricht \.lc-kreis \{[^}]*animation: lcSprichtKreis/.test(cssOhne)
  && /@keyframes lcSprichtHof/.test(css)
  && /animation: lcSprichtRing 1\.1s ease-out infinite,\s*\n\s*lcSprichtHof/.test(css));
pruefe("und das Sprechbild wird solange geparkt",
  /data-sprechpause/.test(js));
/* „Bei einigen Animationen sind noch Rueckstaende, wo die Zahl dann
   noch haengt." */
pruefe("eine haengende Platznummer raeumt sich nach 12 s selbst weg",
  /LC_UNTERWEGS_WACHE/.test(js));
pruefe("die Flammen sitzen tiefer und werfen Funken nach oben",
  /band: \[33\.2, 34\.8\]/.test(js)
  && /@keyframes lcFunkeAufR77/.test(css));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 77 sitzt.\n");
process.exit(fehler ? 1 : 0);
