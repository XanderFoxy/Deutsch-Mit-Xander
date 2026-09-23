#!/usr/bin/env node
/* =========================================================
   RUNDE 30 — ECHTE GERAEUSCHE, SCHIFFE VERSENKEN,
   BLUBBERNDES PROFILBILD, FESTE REIHENFOLGE
   ---------------------------------------------------------
   GEWUENSCHT, woertlich:
   · „dass du jetzt einen richtigen Sound dazu machst … viele
      Sounds stimmen einfach noch nicht … der Drill von dem
      Pfeil … wenn man den Hut aufsetzt, dann koennte so ein
      YIHAAH wie bei den Cowboys kommen … bei der Peitsche
      selber kann einfach nur ein Peitschenknall sein … bei
      dem Angelhaken soll man dieses Einholen der Angelschnur
      hoeren … das Fenster aufmachen soll auch nach Fenster
      oeffnen klingen … Behalte gerne die alten Sounds im
      Hintergrund als Fallback."
   · „Bei dem Fahren ein realistisches Fahrgeraeusch und dann
      ein Quietschgeraeusch, wenn er da wirklich landet."
   · „bei dem Blubbern haette ich gern, dass das Profilbild in
      vielen kleinen Blasen dargestellt ist."
   · „dann moechte ich noch ein Schiffe versenken spielen …
      jeder sucht sich einen Platz, versteckt sich … das
      duerfen die anderen natuerlich nicht sehen … dann ist
      jeder nach der Reihe dran."
   · „es soll ja der Reihe nach zaehlen, wer als naechstes dran
      ist … oder die Leute sind, wie sie nacheinander in den
      Raum gekommen sind, in der Reihenfolge gezaehlt."
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  const liste = fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8");
  const da = (liste.match(/DMA_GERAEUSCHE = "([^"]*)"/) || ["", ""])[1].split("|");

  console.log("\nDIE NEUEN GERAEUSCHE LIEGEN WIRKLICH DA\n");
  const neu = ["pfeilschuss", "cowboy", "peitschenknall", "angelkurbel", "fensterauf",
               "rollohoch", "jalousieauf", "spruehsahne", "fahrt", "bremse", "kussmund",
               "schneeklatsch", "schlurfen", "blubbern", "katapult", "zwille",
               "flugzeug", "aufziehen", "maulwurf", "portal"];
  neu.forEach((n) => {
    const opus = fs.existsSync(path.join(WURZEL, "ton", n + ".opus"));
    const m4a = fs.existsSync(path.join(WURZEL, "ton", n + ".m4a"));
    pruefe(n + ": beide Fassungen da und in der Liste",
      opus && m4a && da.indexOf(n) >= 0,
      (opus ? "opus " : "OHNE opus ") + (m4a ? "m4a " : "OHNE m4a ")
      + (da.indexOf(n) >= 0 ? "eingetragen" : "NICHT eingetragen"));
  });

  console.log("\nSIE HAENGEN AUCH AN DEN RICHTIGEN EFFEKTEN\n");
  const haengt = (effekt, ton) => pruefe(effekt + " klingt nach „" + ton + "“",
    new RegExp(effekt + ":\\s*\\{ ton: \"" + ton + "\"").test(js));
  /* NACHGEZOGEN: vier Geraeusche sind seit Runde 30 ersetzt worden,
     weil er sie einzeln bemaengelt hat — „der Cowboy Hut", „bei dem
     Katerpult muss ein realistisches Katapult Geraeusch kommen".
     Geprueft wird deshalb der HEUTIGE Name, nicht der von damals. */
  haengt("saugpfeil", "pfeilschuss");
  /* RUNDE 64 ZURUECKGEDREHT, auf Ansage: „und das urspruengliche
     Geraeusch vom Cowboy zurueckholst." In Runde 59 war der Ruf gegen
     ein reines Hutgeraeusch getauscht worden — gemeint war offenbar
     das Gegenteil. Also wieder cowboy.opus, der Ruf von Runde 30.
     cowboyhut.opus bleibt liegen, falls er es sich anders ueberlegt. */
  haengt("hut", "cowboy");
  haengt("peitsche", "peitschehieb");
  haengt("heber", "angelkurbel");
  haengt("luke", "fensterauf");
  haengt("rollo", "rollohoch");
  haengt("lamellen", "jalousieauf");
  haengt("sahne", "spruehsahne");
  /* RUNDE 70 ZURUECKGEZOGEN: „kuss" haengt an KEINER Datei mehr.
     XANDER: „Vielleicht kannst du beim Sound auch zwischen Mann und
     Frau … unterscheiden also … maennlicher Kuss oder weiblicher
     Kuss." Ein fester Plan-Ton kann das nicht, deshalb legt lcKuss
     ihn selbst auf und der Plan haelt sich still. Haette diese Regel
     hier unveraendert weitergegolten, wuerde sie genau den Zustand
     festhalten, den er bemaengelt hat. */
  pruefe("kuss klingt nach Mann oder Frau, nicht nach einer Datei fuer alle",
    /kuss:\s*\{ still: true/.test(js)
    /* RUNDE 88 NACHGEFUEHRT: 441 statt 520 ms. Der Kuss-Ton ist in
       Runde 87 neu gebaut worden (werkzeug/kuss-bauen.py); sein
       Schmatzer liegt jetzt bei 79 bzw. 82 ms in der Datei. Damit
       er auf den Aufprall bei 520 ms faellt, muss die Datei 441 ms
       nach dem Start anfangen. Worum es in dieser Regel geht —
       Mann und Frau klingen verschieden — ist unveraendert. */
    && /lcStimmeZu\(meiner, "kussmann", "kussfrau", 441, 0\.62\)/.test(js));
  haengt("schneeball", "schneeklatsch");
  haengt("strohhalm", "schlurfen");
  haengt("blubbern", "blubbern");
  haengt("katapult", "katapult3");
  /* RUNDE 70 NACHGEZOGEN: „gummizug" war ab 1,05 s still — als Bett
     fuer 2,6 s taugte sie nicht, und ein Gummiband war kaum zu
     hoeren. XANDER: „man hoert gar kein realistisches Gummiband."
     Jetzt traegt „gummiband" Dehnen UND Schnalzen. */
  haengt("zwille", "gummiband");
  haengt("fahren", "fahrt");
  /* NACHGEZOGEN IN RUNDE 59: zwischen diesen beiden Zeilen steht
     jetzt der Fall „der Plan faengt spaeter an" (plan.spaet) — noetig,
     damit die Registerkasse nicht im Geldregen untergeht. Die Regel
     selbst ist dieselbe geblieben: der PLAN entscheidet, die
     gleichnamige alte Datei ist nur der Rueckfall. */
  pruefe("und der Plan schlaegt die gleichnamige alte Datei",
    /const plan = LC_TON_PLAN\[was\];/.test(js)
    && /if \(plan && plan\.ton && lcGeraeusch\(plan\.ton, was\)\) return;/.test(js)
    && /if \(lcGeraeusch\(was, was\)\) return;/.test(js)
    && js.indexOf("if (plan && plan.ton && lcGeraeusch(plan.ton, was)) return;")
       < js.indexOf("if (lcGeraeusch(was, was)) return;"));
  pruefe("die alte peitsche.opus liegt als Rueckfall noch da",
    fs.existsSync(path.join(WURZEL, "ton", "peitsche.opus")));
  /* NACHGEZOGEN IN RUNDE 59. Hier stand „das Quietschen kommt erst
     bei der Ankunft" — und genau das wollte XANDER nicht mehr: „Das
     Flugzeug braucht kein Bremsgeraeusch … das kannst du ueberhaupt
     bei allen Sachen rausnehmen, wo es gar nicht reingehoert."
     Geprueft wird jetzt, dass der Ankunftston noch zum richtigen
     Zeitpunkt kaeme — aber nur noch dort steht, wo er hingehoert. */
  pruefe("ein Ankunftston kaeme immer noch zur Ankunft",
    /const ankunft = LC_ANKUNFT_TON\[art\];\s*\n\s*if \(ankunft\) lcTonSpaeter\(ankunft, Math\.max\(0, hin - 260\), 0\.5\);/.test(js));
  pruefe("aber das Flugzeug bremst nicht mehr", !/flug: "bremse"/.test(js));

  console.log("\nDAS BLUBBERNDE PROFILBILD\n");
  pruefe("die Blasen tragen sein Bild",
    /lc-blubber-ich/.test(js) && /background-image:url\(/.test(js));
  pruefe("ohne Bild steht der Anfangsbuchstabe drin", /lc-blubber-ohne/.test(js) && /lc-blubber-ohne/.test(css));
  pruefe("und sie steigen ueber das Bild hinaus", /lcBlubberIchR30/.test(css));

  console.log("\nDIE REIHENFOLGE HAENGT NICHT MEHR AM SITZPLATZ\n");
  pruefe("sie kommt aus der Ankunft im Raum",
    /function spielReihe\(\)/.test(lc) && /\(a\.seit - b\.seit\)/.test(lc));
  pruefe("und das Aufdecken benutzt sie",
    /function rundeNamen\(\)[\s\S]{0,200}spielReihe\(\)/.test(lc));

  console.log("\nSCHIFFE VERSENKEN\n");
  pruefe("es gibt den Befehl", /w: "versenken"/.test(lc)
    && /art === "versenken" \|\| art === "schiffe"/.test(lc));
  /* RUNDE 97 NACHGEFUEHRT. Die Regel bleibt — ein Versteck geht nie
     an alle —, der Weg dorthin ist ein anderer.
     RUNDE 88 loste der Schiedsrichter die Felder aus und schickte
     jedem seines. XANDER (23.09.2026) will es andersherum: „Man muss
     sich erst einen Platz suchen, dann beginnt die Runde mit einem
     Countdown, und dann muss man sich gegenseitig suchen, der Reihe
     nach."
     Seit Runde 92 waehlt also jeder selbst. Seine Wahl geht als
     persoenliche Post an den Schiedsrichter (schiffePost), und der
     bestaetigt sie ebenso persoenlich. An ALLE geht nur eine ZAHL:
     wie viele schon fertig sind. Genau das wird hier gemessen. */
  pruefe("ein Versteck geht nie an alle, immer nur an ein Geraet",
    /schiffePost\(vonId, \{ t: "platz", nr: nr \}\);/.test(lc)
    && /function schiffePost\(id, d\) \{[\s\S]{0,220}postSenden\(id, \{ art: "spielpost", spiel: d \}\);/.test(lc)
    && /schiffeAnAlle\(\{ t: "wartet", fertig: fertig, von: schiffeSpiel\.reihe\.length \}\);/.test(lc)
    && !/schiffeAnAlle\(\{ t: "platz"/.test(lc)
    && !/schiffeAnAlle\(\{ t: "versteck"/.test(lc));
  pruefe("der Schiedsrichter entscheidet den Treffer",
    /function schiffeSchuss/.test(lc) && /schiffeSpiel\.raus\[getroffenId\] = true/.test(lc));
  pruefe("wer nicht dran ist, kann nicht schiessen",
    /if \(!dranM \|\| dranM\.id !== vonId\) return;/.test(lc));
  /* RUNDE 97 NACHGEFUEHRT — DIESELBE FRAGE, ANDERE ANTWORT.
     Runde 88 loste die Felder aus, damit niemand erfaehrt, welches
     Feld belegt ist. Das nimmt aber genau die Wahl weg, die XANDER
     jetzt ausdruecklich will („Man muss sich erst einen Platz
     suchen"). Wer selbst waehlt, muss erfahren, wenn sein Feld schon
     vergeben ist — sonst laegen zwei im selben Loch.
     Also: der Schiedsrichter prueft und antwortet mit „belegt",
     aber NUR dem einen Fragenden (schiffePost, nicht schiffeAnAlle),
     und ohne Namen. Mehr als „dieses eine Feld ist weg" erfaehrt er
     nicht — dieselbe Auskunft, die er im echten Raum auch haette,
     wenn er sich auf einen besetzten Stuhl setzen will.
     Geprueft wird deshalb dreierlei: dass geprueft wird, dass die
     Antwort persoenlich geht, und dass sie keinen Namen traegt. */
  pruefe("zwei koennen nicht im selben Loch stecken",
    /if \(id !== vonId && schiffeSpiel\.verstecke\[id\] === nr\) frei = false;/.test(lc)
    && /schiffePost\(vonId, \{ t: "belegt", nr: nr \}\);/.test(lc)
    && !/schiffeAnAlle\(\{ t: "belegt"/.test(lc)
    && !/t: "belegt", nr: nr, name/.test(lc));
  pruefe("und am Ende steht ein Sieger", /t: "ende", sieger/.test(lc));

  console.log("\nDREI ANDERE ARTEN, ZU EINEM PLATZ ZU KOMMEN\n");
  pruefe("Flug, Maulwurf und Tor sind Befehle",
    /w: "flug"/.test(lc) && /w: "maulwurf"/.test(lc) && /w: "portal"/.test(lc));
  /* RUNDE 78 NACHGEFUEHRT: lcReise hat einen vierten Wert bekommen.
     XANDER: „dass man in dem Reisemenue jemand anderen als Ziel
     nehmen kann, bei dem Frisbee … und er taucht an meinem Platz
     wieder auf." Das ist ein Tausch, und ob getauscht wird, muss mit
     der Nachricht reisen — sonst saehen die anderen nur eine halbe
     Reise. Die Regel selbst bleibt, was sie war: der Aufruf bewegt
     den ABSENDER (vonR), nicht den Genannten. */
  /* RUNDE 88 NACHGEFUEHRT: lcReise hat einen FUENFTEN Wert bekommen
     — das Aufziehen. XANDER: „wenn man das Ganze aufzieht, dann soll
     es Pferd im Galopp." Die Regel selbst ist unveraendert: der
     Aufruf bewegt den ABSENDER (vonR), nicht den Genannten. */
  pruefe("sie bewegen den Absender",
    /if \(lcReise\(wenR, vonR, art, Boolean\(nachricht && nachricht\.tausch\), tempoR\)\) return;/.test(js));
  pruefe("im Flugzeugfenster sitzt sein Bild",
    /lc-flieger-fenster/.test(js) && /lc-flieger-fenster/.test(css));
  /* RUNDE 63 NACHGEFUEHRT: „das soll man von oben, von der
     Draufsicht." Die Kuppel von der Seite (.lc-maulwurf-erde) gibt es
     nicht mehr; von oben ist es ein Kranz aus loser Erde mit dem
     Ausgang in der Mitte. Geprueft wird jetzt der Kranz. */
  pruefe("der Maulwurfshuegel ist von oben gezeichnet",
    /lc-maulwurf-kranz/.test(css) && /lc-maulwurf-loch/.test(css)
    /* Auf die REGEL pruefen, nicht auf das Wort: im Kommentar
       darueber steht der alte Name absichtlich noch, damit man
       nachlesen kann, was sich geaendert hat. */
    && !/\.lc-maulwurf-erde\s*\{/.test(css));
  pruefe("und das Tor wirbelt", /lcTorR30/.test(css));
  pruefe("mit einer Nummer steht auch die Nummer im Chat",
    /gr\\u00e4bt sich zu Platz /.test(lc) || /gräbt sich zu Platz /.test(lc));

  console.log("\nDREI ALTE MELDUNGEN\n");
  pruefe("der Korb ist groesser geworden", /width: 104%/.test(css));
  pruefe("die Bluetenblaetter bluehen wirklich auf", /lcBlueteAufR30/.test(css));
  pruefe("die Asche besteht aus feinen Puenktchen",
    /lc-asche-punkt/.test(js) && /lcAschePunktR30/.test(css));
  pruefe("und der Wind blaest sie weg", /--weht/.test(js) && /var\(--weht/.test(css));
  pruefe("die Melodie laeuft nur noch einmal",
    /noten: *\{ ton: "noten", dauer: 4200 \}/.test(js));
  pruefe("und /noten mit einem Lied spielt den Refrain",
    /wirkung: "notenlied"/.test(lc) && /DMA_REFRAIN/.test(lc)
    && fs.existsSync(path.join(WURZEL, "data-refrain.js")));

  console.log("\nDER BETONUNGSMODUS GEHT DA, WO MAN GERADE IST\n");
  pruefe("ein „aus“ weiter oben blockiert nicht mehr",
    /const ausKasten = parent\.closest\("\.betonung-aus"\);/.test(js)
    && /root\.contains\(ausKasten\)/.test(js));
  pruefe("und die Uebersetzung wird nicht mehr mitmarkiert",
    /uebersetzung-hilfe, \.uebersetzung-satz/.test(js));

  console.log("\nDER TUTOR\n");
  pruefe("der Comic ist die Voreinstellung",
    /localStorage\.getItem\(TUTOR_ART\) === "foto" \? "foto" : "comic"/.test(js));
  pruefe("es gibt eine Filmschicht ueber dem Standbild",
    /id="tutorVideo"/.test(js) && /\.tutor-video/.test(css));
  /* RUNDE 62 NACHGEFUEHRT: in dem then() steht jetzt noch eine zweite
     Zeile — tutorFilmLaeuft(true), damit das Standbild verschwindet
     („der Originalavatar klebt immer noch hinter mir"). Geprueft wird
     weiterhin das Entscheidende: die Klasse kommt erst nach einem
     GEGLUECKTEN play(), und ein Fehlschlag faellt auf aus(). */
  pruefe("der Film kommt nur, wenn er wirklich laeuft",
    /lauf\.then\(\(\) => \{[\s\S]{0,160}?v\.classList\.add\("tutor-video-da"\);[\s\S]{0,160}?\}\)\.catch\(aus\)/.test(js));
  pruefe("und faellt er aus, bleibt das Standbild stehen",
    /v\.onerror = aus;/.test(js));
  pruefe("der erste Film liegt da und ist durchsichtig",
    fs.existsSync(path.join(WURZEL, "tutor", "video", "lern-09.webm")),
    fs.existsSync(path.join(WURZEL, "tutor", "video", "lern-09.webm"))
      ? (fs.statSync(path.join(WURZEL, "tutor", "video", "lern-09.webm")).size / 1024).toFixed(0) + " kB"
      : "fehlt");
  pruefe("und er steht in der Liste",
    /lern-09/.test(fs.readFileSync(path.join(WURZEL, "data-tutorvideo.js"), "utf8")));
  pruefe("welche Filme es gibt, wird nachgesehen statt geraten",
    fs.existsSync(path.join(WURZEL, "werkzeug", "tutorvideo-liste.js"))
    && fs.existsSync(path.join(WURZEL, "data-tutorvideo.js"))
    && /DMA_TUTORVIDEO/.test(js));

  console.log("\nDAS AUFZIEHAUTO\n");
  pruefe("jeder Tipp zieht eine Umdrehung weiter auf",
    /lcAufzieh = Math\.min\(5, lcAufzieh \+ 1\)/.test(js));
  pruefe("das Menue bleibt dabei offen", /\}, true\);/.test(js)
    && /if \(!offenLassen\) lcPlatzMenueZu\(\);/.test(js));
  pruefe("die Umdrehungen fahren mit der Zeile mit",
    /tempo: String\(tempoF\)/.test(lc) && /"tempo"/.test(lc));
  pruefe("und machen die Fahrt wirklich schneller",
    /const schnell = 1 \+ \(zug - 1\) \* 0\.5;/.test(js));

  /* ---------- IM BROWSER ---------- */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(1200);

  /* =================================================================
     RUNDE 88 — DAS BRETT GIBT ES NICHT MEHR
     -----------------------------------------------------------------
     Hier stand bis Runde 87 eine Messung an einem blauen Spielbrett
     mit eigenen Feldern (#lcSchiffe, .lc-schiffe-feld, #lcSchiffeKopf).
     XANDER hat dieses Brett verworfen: „es soll so mit den Plaetzen
     sein, nicht irgendwie ein anderes Design bekommen. Es soll
     einfach so mit den Plaetzen sein … wir muessen nur die Plaetze
     neu auffuellen mit 16 Plaetzen."
     Seither SIND die Sitzplaetze das Brett. Diese Messung hat
     deshalb kein Ziel mehr — sie suchte Elemente, die es nicht mehr
     geben darf — und sie ist vollstaendig nach
     werkzeug/pruefe-runde88-schiffe.js umgezogen, wo am heutigen
     Aufbau gemessen wird: sechzehn Felder, nichts verrutscht oben
     oder unten, ausgeloste Verstecke, der Untergang mit der Nase
     nach oben, und das Ausschalten.
     Was HIER bleibt, ist die Frage, um die es in Runde 30 ging:
     gibt es das Spiel ueberhaupt, und zaehlt es der Reihe nach? */
  pruefe("es gibt Schiffe versenken, und es laeuft auf den Plaetzen",
    /window\.DMA_SCHIFFE = function \(stand\)/.test(js)
    && /lcSechzehnSetzen\(true\);/.test(js)
    && !/id="lcSchiffeFelder"/.test(js));
  /* „es soll ja der Reihe nach zaehlen, wer als naechstes dran ist …
     oder die Leute sind, wie sie nacheinander in den Raum gekommen
     sind, in der Reihenfolge gezaehlt." */
  pruefe("und es zaehlt nach der Ankunft im Raum, nicht nach der Platznummer",
    /var reihe = spielReihe\(\);/.test(lc)
    && /return \(a\.seit - b\.seit\)/.test(lc));
  pruefe("die Messung am Brett steht in der Sonde zu Runde 88",
    fs.existsSync(path.join(WURZEL, "werkzeug", "pruefe-runde88-schiffe.js")));

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 30 sitzt.\n");
  process.exit(fehler ? 1 : 0);
})();
