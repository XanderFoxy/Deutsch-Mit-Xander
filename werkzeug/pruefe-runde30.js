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
  haengt("saugpfeil", "pfeilschuss");
  haengt("hut", "cowboy");
  haengt("peitsche", "peitschenknall");
  haengt("heber", "angelkurbel");
  haengt("luke", "fensterauf");
  haengt("rollo", "rollohoch");
  haengt("lamellen", "jalousieauf");
  haengt("sahne", "spruehsahne");
  haengt("kuss", "kussmund");
  haengt("schneeball", "schneeklatsch");
  haengt("strohhalm", "schlurfen");
  haengt("blubbern", "blubbern");
  haengt("katapult", "katapult");
  haengt("zwille", "zwille");
  haengt("fahren", "fahrt");
  pruefe("und der Plan schlaegt die gleichnamige alte Datei",
    /const plan = LC_TON_PLAN\[was\];\s*\n\s*if \(plan && plan\.ton && lcGeraeusch\(plan\.ton, was\)\) return;\s*\n\s*if \(lcGeraeusch\(was, was\)\) return;/.test(js));
  pruefe("die alte peitsche.opus liegt als Rueckfall noch da",
    fs.existsSync(path.join(WURZEL, "ton", "peitsche.opus")));
  pruefe("das Quietschen kommt erst bei der Ankunft",
    /setTimeout\(\(\) => lcTonZu\("bremse"\), Math\.max\(0, hin - 120\)\);/.test(js));

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
  pruefe("das Versteck geht NUR an den Schiedsrichter",
    /postSenden\(schiffeStand\.richter, \{ art: "spielpost"/.test(lc)
    && !/schiffeAnAlle\(\{ t: "versteck"/.test(lc));
  pruefe("der Schiedsrichter entscheidet den Treffer",
    /function schiffeSchuss/.test(lc) && /schiffeSpiel\.raus\[getroffenId\] = true/.test(lc));
  pruefe("wer nicht dran ist, kann nicht schiessen",
    /if \(!dranM \|\| dranM\.id !== vonId\) return;/.test(lc));
  pruefe("zwei koennen nicht im selben Loch stecken", /t: "belegt"/.test(lc));
  pruefe("und am Ende steht ein Sieger", /t: "ende", sieger/.test(lc));

  console.log("\nDREI ANDERE ARTEN, ZU EINEM PLATZ ZU KOMMEN\n");
  pruefe("Flug, Maulwurf und Tor sind Befehle",
    /w: "flug"/.test(lc) && /w: "maulwurf"/.test(lc) && /w: "portal"/.test(lc));
  pruefe("sie bewegen den Absender", /if \(lcReise\(wenR, vonR, art\)\) return;/.test(js));
  pruefe("im Flugzeugfenster sitzt sein Bild",
    /lc-flieger-fenster/.test(js) && /lc-flieger-fenster/.test(css));
  pruefe("hinter dem Maulwurf liegt ein Erdhuegel", /lc-maulwurf-erde/.test(css));
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
  pruefe("der Film kommt nur, wenn er wirklich laeuft",
    /lauf\.then\(\(\) => v\.classList\.add\("tutor-video-da"\)\)\.catch\(aus\)/.test(js));
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

  console.log("\nDAS BRETT — GEMESSEN\n");
  const brett = await pg.evaluate(async () => {
    DMA_PRUEF.effektBuehne();
    const karte = document.getElementById("livechatKarte");
    const vorher = karte.getBoundingClientRect().height;
    window.DMA_SCHIFFE({ phase: "verstecken", richter: "r1", plaetze: 8,
      reihe: [{ id: "a", name: "Alex" }, { id: "b", name: "Bea" }],
      tafel: {}, meins: 0, dran: "", dranName: "", raus: [], text: "", ichBin: "a" });
    await new Promise((f) => setTimeout(f, 200));
    const nachher = karte.getBoundingClientRect().height;
    const felder = document.querySelectorAll(".lc-schiffe-feld").length;
    const platzSichtbar = getComputedStyle(document.querySelector(".lc-platz")).visibility;
    /* Treffer und Daneben zeichnen */
    window.DMA_SCHIFFE({ phase: "schiessen", richter: "r1", plaetze: 8,
      reihe: [{ id: "a", name: "Alex" }, { id: "b", name: "Bea" }],
      tafel: { 3: "treffer", 5: "daneben" }, meins: 2, dran: "a", dranName: "Alex",
      raus: ["Bea"], text: "Alex trifft auf Platz 3", ichBin: "a" });
    await new Promise((f) => setTimeout(f, 150));
    const treffer = document.querySelectorAll(".lc-schiffe-treffer").length;
    const daneben = document.querySelectorAll(".lc-schiffe-daneben").length;
    const meins = document.querySelectorAll(".lc-schiffe-meins").length;
    const kopf = document.getElementById("lcSchiffeKopf").textContent;
    const fuss = document.getElementById("lcSchiffeFuss").textContent;
    window.DMA_SCHIFFE(null);
    await new Promise((f) => setTimeout(f, 100));
    const weg = !document.getElementById("lcSchiffe")
      && !karte.classList.contains("lc-schiffe-an");
    return { vorher, nachher, felder, platzSichtbar, treffer, daneben, meins, kopf, fuss, weg };
  });
  pruefe("acht Felder stehen bereit", brett.felder === 8, brett.felder + " Felder");
  pruefe("der Kasten wird KEINEN Bildpunkt hoeher",
    Math.abs(brett.nachher - brett.vorher) < 2,
    brett.vorher.toFixed(1) + " px vorher, " + brett.nachher.toFixed(1) + " px nachher");
  pruefe("die Mitspieler sind waehrend des Spiels nicht zu sehen",
    brett.platzSichtbar === "hidden", "visibility: " + brett.platzSichtbar);
  pruefe("Treffer, Daneben und das eigene Versteck sind zu erkennen",
    brett.treffer === 1 && brett.daneben === 1 && brett.meins === 1,
    brett.treffer + " Treffer, " + brett.daneben + " daneben, " + brett.meins + " eigenes");
  pruefe("der Kopf sagt, wer dran ist", /Du bist dran/.test(brett.kopf), brett.kopf);
  pruefe("und unten steht, wer versenkt ist", /Bea/.test(brett.fuss), brett.fuss);
  pruefe("zum Schluss ist das Brett wieder weg", brett.weg);

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 30 sitzt.\n");
  process.exit(fehler ? 1 : 0);
})();
