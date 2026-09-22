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
const lcjs = ohneK(fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8"));
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
/* RUNDE 80 — XANDER: „bei dem Blut … vielleicht kannst du dieses
   Blut was von oben kommt so ein bisschen oval zur Seite laufen
   lassen." Dazu sind zwei Lagen dazugekommen (die beiden Ovale an
   den Flanken), und deren Stelle wandert mit. Gemessen wird deshalb
   nicht mehr die Zeichenkette von damals, sondern was die Regel
   sagt: der Saum liegt mittig oben, das linke Rinnsal deutlich
   links, das rechte deutlich rechts. */
pruefe("und es laeuft nach links und rechts herunter",
  /background-position: 50% 0%, 21% 0%, 79% 0%(,|;)/.test(css));
/* Und ebenso: bewegt wird, wie weit die Rinnsale gekommen sind —
   ihre Hoehe waechst von 16 auf 52 Prozent (links) und von 11 auf
   40 Prozent (rechts). Die Ovale duerfen dabei mitwachsen. */
pruefe("bewegt wird nur, wie weit die Rinnsale gekommen sind",
  /0%   \{ background-size: 100% 100%, 7% 16%, 6% 11%/.test(css)
  && /100% \{ background-size: 100% 100%, 7% 52%, 6% 40%/.test(css));

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
/* RUNDE 80 — XANDER: „die Eisblumen sind jetzt von so einer
   kachelartigen Kontrastkante umgeben." Das Ende der Maske stand auf
   68 % und war damit KLEINER als das Bild; ausserhalb des
   Maskenkastens ist eine no-repeat-Maske durchsichtig, also wurde an
   einem Rechteck abgeschnitten. Der Kasten endet jetzt bei 100 %.
   Geprueft wird deshalb, was die Regel meint: das Wachsen faengt
   weit aussen an, und der Kasten wird nie kleiner als das Bild. */
pruefe("die Eisblumen wachsen von aussen herein",
  /@keyframes lcEisblumeR77/.test(css)
  && /-webkit-mask-size: 320% 320%; mask-size: 320% 320%;/.test(css)
  && /-webkit-mask-size: 100% 100%; mask-size: 100% 100%;/.test(css)
  && !/mask-size: (\d|[1-9]\d)% /.test(css.split("@keyframes lcEisblumeR77")[1].slice(0, 400)));

console.log("\nGLÜHEN UND MAGIE: MEHR UND FEINER\n");
/* RUNDE 80 — XANDER hat beide Zahlen noch einmal nach oben gesetzt:
   „das Funkeln … da fehlen noch ein paar Partikel in der Menge" und
   „bei der Magie … koennen noch ein bisschen filigraner sein".
   Gemessen wird deshalb nicht mehr eine feste Zahl, sondern was die
   Regel meint: deutlich mehr als die 36 bzw. 38 von damals. */
pruefe("das Funkeln hat viel mehr Teilchen als die 36 von Runde 76",
  /funkeln:\{ menge: (\d+),/.test(js) && Number(RegExp.$1) >= 64);
pruefe("die Magie hat viel mehr als die 38 von Runde 76",
  /magie:  \{ menge: (\d+),/.test(js) && Number(RegExp.$1) >= 66);
/* Die Groesse wird schief gewuerfelt — viele kleine, wenige grosse.
   Seit Runde 80 in der DRITTEN Potenz statt quadriert, der Median
   faellt damit von 0,69 auf 0,54. */
pruefe("und die Groesse wird schief gewuerfelt — viele kleine",
  /const fein = art === "magie" \|\| art === "funkeln";/.test(js)
  && /\? \(0\.32 \+ wurf \* wurf \* wurf \* 1\.25\)\.toFixed\(2\)/.test(js));

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
/* RUNDE 80 — XANDER: „Der Name von der King Kong Hand kann einfach
   nur King Kong heissen … Da steht naemlich Gottes Hand und Gorilla
   Hand in der Kachel abgeschnitten. Dann sag lieber Gott und King
   Kong." Beide stehen weiter unter EINER Kachel — nur kuerzer
   benannt, damit die Schrift nicht abgeschnitten wird. */
pruefe("Gott und King Kong stehen unter EINER Kachel",
  /\["\\ud83e\\udd1a", "Hand", "gotteshand",/.test(js)
  && /\["\\ud83e\\udd1a", "Gott", "gotteshand"\]/.test(js)
  && /\["\\ud83e\\udd8d", "King Kong", "pranke"\]\]\],/.test(js));
pruefe("und das Anreise-Menue kann Untermenues",
  /lcUnterMenue\(platz, String\(nr\), wort, unter\);/.test(js));
/* RUNDE 88 NACHGEFUEHRT — DIESE DREI REGELN BESCHRIEBEN EINE HAND,
   DIE ES NICHT MEHR GIBT.
   In Runde 77 bestand die Riesenhand aus vier Pfaden, die beim
   Zupacken mit scaleY(.58) gestaucht und um einen Winkel gedreht
   wurden (greifWinkel = [-6, -2, 3, 8]). XANDER hat das in Runde 87
   verworfen: „Hände mit realistischen Zeichnungen für alle
   Handstellungen, ein realistisches Greifen aus einem
   Ursprungszustand in einen Griff in einzelnen Stationen." Seitdem
   hat jeder Finger drei echte Gelenke (rhFinger/rhGlied,
   .lc-rf-mcp/.lc-rf-pip/.lc-rf-dip), der Daumen zwei
   (.lc-rd-cmc/.lc-rd-mcp), und der Griff laeuft ueber die
   Stationentabelle rhStationen mit der Welle rhWelle.
   Die Regeln pruefen deshalb jetzt DAS, was sie immer gemeint
   haben — dass die Finger sich beim Zupacken wirklich beugen und
   um ihren eigenen Knoechel drehen —, nur am heutigen Bau. Wie es
   sich dabei bewegt, misst werkzeug/pruefe-runde87-hand.js an der
   laufenden Animation; hier steht nur, dass der Bau da ist. */
pruefe("die Finger knicken beim Zupacken ein",
  /const rhStationen = /.test(js) && /const rhWelle = /.test(js)
  && /const rhBahn = \(fi, gelenk, si\) =>/.test(js));
pruefe("der Daumen kommt von der anderen Seite dagegen",
  /lc-rd-cmc/.test(js) && /lc-rd-mcp/.test(js)
  && /const dmBahn = \(feld\) => dmStationen\.map/.test(js));
/* Ohne transform-box dreht ein SVG-Pfad um den Nullpunkt der
   Zeichnung — dann klappt der Finger nicht zu, er fliegt weg.
   Bei verschachtelten Gelenken muss es view-box sein und nicht
   fill-box: fill-box waere die Box des Gliedes selbst, und dann
   saesse jeder Drehpunkt woanders. */
pruefe("und jeder Finger dreht um seinen eigenen Knoechel",
  /\.lc-rf-mcp, \.lc-rf-pip, \.lc-rf-dip/.test(css)
  && /transform-box: view-box;/.test(css));
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
  /* RUNDE 88: aus 3s sind 4.4s geworden — siehe pruefe-runde76.js.
     Der Ruf selbst ist derselbe, nur ohne die abgeschnittene
     Blende am Ende (werkzeug/cowboyruf-bauen.py). */
  && /animation: lcHutR76 4\.4s linear both;/.test(css));
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
/* RUNDE 80 — XANDER: „beim Feuer kannst du noch ein bisschen die
   Flammen nach unten bringen … und du kannst an den Verjuengung
   kleine Partikel fliegen lassen." Das Band ist deshalb noch einmal
   nach innen gerueckt, und jede Flamme hat jetzt ihren eigenen
   Funken an der Spitze. Geprueft wird die Regel, nicht die Zahl von
   damals: der Fuss sitzt innerhalb des Bildrandes (34,73 %), und es
   gibt sowohl die aufsteigenden Funken von Runde 77 als auch die
   Funken an der Verjuengung. */
pruefe("die Flammen sitzen tiefer und werfen Funken nach oben",
  /feuer:  \{ menge: 30, klasse: "lc-tfeuer", rand: true, band: \[([\d.]+), ([\d.]+)\]/.test(js)
  && Number(RegExp.$2) < 34.73
  && /@keyframes lcFunkeAufR77/.test(css)
  && /@keyframes lcFunkeAbR80/.test(css));

console.log("\nDER VOGEL UND DAS ANSPUCKEN — ZWEI NEUE EFFEKTE\n");
/* Ohne Eintrag in LC_EFFEKTE faellt lcWirkung gleich am Anfang
   heraus („const e = LC_EFFEKTE[art]; if (!e) return;"). Genau daran
   ist der erste Versuch gescheitert: die Funktion war da, der Befehl
   war da, und es passierte trotzdem nichts. */
pruefe("beide stehen in LC_EFFEKTE, sonst passiert nichts",
  /vogelkot:   \{ zeichen: \["\\ud83d\\udc26"\], wie: 5, klasse: "umarmen" \},/.test(js)
  && /spucken:    \{ zeichen: \["\\ud83e\\udd7a"\], wie: 5, klasse: "umarmen" \},/.test(js));
pruefe("und beide werden auch angeschlossen",
  /if \(art === "vogelkot" && lcVogelKot\(wenZ\)\) return;/.test(js)
  && /if \(art === "spucken" && lcSpucken\(wenZ\)\) return;/.test(js));
pruefe("jeder hat seine Kachel und seinen Befehl",
  /\["\\ud83d\\udc26", "Vogel",    "vogelkot"\],/.test(js)
  && /\["\\ud83e\\udd7a", "Spucken",  "spucken"\],/.test(js)
  && /vogelkot:   \{ wirkung: "vogelkot"/.test(lcjs)
  && /spucken:    \{ wirkung: "spucken"/.test(lcjs));
pruefe("die Toene sind da und stehen in der Liste",
  ton("vogelkot") && gelistet("vogelkot") && ton("rotze") && gelistet("rotze"));
/* Der Aufschlag liegt im Ton nicht am Anfang: bei „vogelkot" nach
   300 ms, bei „rotze" nach 620 ms. Sichtbar schlaegt es bei 1750 bzw.
   1250 ms auf — also muss der Ton 1450 bzw. 630 ms nach dem Start
   anfangen, sonst hoert man den Klecks, bevor er da ist. */
pruefe("und sie liegen so, dass Ton und Bild zusammenfallen",
  /vogelkot: 1450,/.test(js) && /spucken: 630,/.test(js));
pruefe("der Vogel fliegt ueber dem Bild, nicht darin",
  /\.lc-vogelkot-vogel \{[\s\S]{0,200}?top: -46%;/.test(css));
pruefe("und der Tropfen faellt erst, wenn er ueber dem Kopf ist",
  /0%, 46%  \{ opacity: 0; transform: translateY\(0\) scaleY\(1\); \}/.test(css));
/* RUNDE 80 — XANDER: „der Vogel funktioniert, er koennte aber am
   Gesicht herunter laufen." Die Nase lief bis 30 % der Bildhoehe —
   vom Ansatz bei 6 % also nur bis zur Stirn. Geprueft wird deshalb
   nicht mehr die Zahl von damals, sondern was die Regel meint: sie
   laeuft ueber das halbe Bild, und sie laeuft dabei ungleichmaessig
   (mehr als zwei Stufen). */
pruefe("was liegen bleibt, laeuft ein Stueck herunter", (() => {
  const m = /@keyframes lcVogelNaseR77 \{([\s\S]*?)\n\}/.exec(css);
  if (!m) return false;
  const hoehen = (m[1].match(/height: ([\d.]+)%/g) || [])
    .map((t) => Number(t.replace(/[^\d.]/g, "")));
  return hoehen.length >= 4 && Math.max(...hoehen) >= 50;
})());
pruefe("die Rotze zieht in drei Faeden verschiedener Laenge",
  /\[\[0, 62, 7\], \[-13, 40, 5\.4\], \[11, 27, 4\.2\]\]/.test(js));
/* Zaeher Schleim rutscht, bleibt haengen, rutscht weiter. Ein
   gleichmaessiges Wachsen saehe nach Wasser aus. */
pruefe("und sie laeuft in Stufen, nicht gleichmaessig",
  /26%  \{ height: calc\(var\(--lang, 40%\) \* \.22\); \}/.test(css)
  && /68%  \{ height: calc\(var\(--lang, 40%\) \* \.68\); \}/.test(css));
/* Die Fadendicke stand in em — dann haengt sie an der Schriftgroesse
   und nicht am Bild. */
pruefe("die Fadendicke zaehlt das Bild, nicht die Schrift",
  /width: var\(--breit, 6%\);/.test(css));

console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 77 sitzt.\n");
process.exit(fehler ? 1 : 0);
