#!/usr/bin/env node
/* =========================================================
   RUNDE 24 — LESEN NACH KATEGORIEN, DER FOKUS, DIE BETONUNG
   UND DER KONTEXTER
   ---------------------------------------------------------
   GEMELDET, woertlich:
   „Kannst du das so machen, dass, wenn jemand diese Texte
    liest und auf seine Zeile klickt, dass der Text dann immer
    im Fokus bleibt … die Zeile, wenn sie angewaehlt ist, die
    soll immer den Text an Platz halten … und wenn man wieder
    die Zeile anklickt, dass es die Aufgabe unter den
    bestehenden Chat schiebt."
   · „Dann moechte ich auch, dass ‚Es war einmal in
     Deutschland' auch in den Texten zu finden ist. Du kannst
     das auch nach Kategorien in dem Panel machen bei dem
     Lesen … vielleicht auch mit der Option, die Betonung beim
     Lesen anzuschalten … Es war einmal in Deutschland, eigene
     Beitraege, Dichter und Denker, Schnee von gestern,
     Menschen Dinge Situation."
   · „Und diesen Kontext-Text brauche ich noch, dass die Leute
     eine Reihenfolge in einer Geschichte logisch
     zusammensetzen koennen. Den Kontextsortierer … KONTEXTER.
     Also koennte man das Ding nennen."
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
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");

  console.log("\nDIE FUENF KATEGORIEN\n");
  pruefe("es gibt eine Kategorienliste", /const LC_LESE_KATEGORIEN = \[/.test(js));
  ["Schnee von gestern", "Dichter und Denker", "Menschen, Dinge, Situationen",
   "Es war einmal in Deutschland", "Eigener Text"].forEach((w) => {
    pruefe("„" + w + "“ steht darin", js.indexOf('"' + w + '"') > 0);
  });
  pruefe("der Kalender wird nur MONATSWEISE geholt",
    /typeof ExerciseData !== "undefined" && ExerciseData\.ladeKalenderMonat/.test(js),
    "ein Zwoelftel statt des ganzen Jahres");
  pruefe("die Beitraege erst auf Zuruf", /beitraegeLaden\(\)\.then/.test(js));

  console.log("\nDER FOKUS\n");
  pruefe("eine Tafel laesst sich festhalten", /function lcLeseFestSetzen/.test(js));
  pruefe("sie wird nach jedem Neuzeichnen nachgezogen",
    /livechatGrossAuffrischen\(l\);[\s\S]{0,400}lcLeseTafelNachziehen\(\)/.test(js));
  pruefe("der zweite Tipp auf dieselbe Zeile schiebt sie unter den Chat",
    /const schonHier = b\.classList\.contains\("lc-lese-hier"\)/.test(js)
    && /if \(schonHier\) \{\s*\n\s*lcLeseTafelNachziehen\(\)/.test(js));
  pruefe("und festgehalten klebt sie unten",
    /\.lc-lesetafel\.lc-lese-fest \{[\s\S]*?position: sticky;[\s\S]*?bottom: 0;/.test(css));

  console.log("\nDIE BETONUNG ZUM ANSCHALTEN\n");
  pruefe("die Lesetafel hat einen Betonungsschalter",
    /betKnopf\.className = "lc-lese-schalter"/.test(js));
  pruefe("er benutzt den Schalter, den es schon gibt",
    /setzeLeseBetonung\(!leseBetonungAn\(\)\)/.test(js));
  pruefe("und er holt den Wortschatz nur dann nach",
    /VocabData\.ladeWoerter\(\);/.test(js.slice(js.indexOf("const betZeichnen"),
      js.indexOf("const betZeichnen") + 1600)));

  console.log("\nDER KONTEXTER\n");
  pruefe("es gibt den Befehl", /art === "kontexter" \|\| art === "kontext"/.test(lc));
  pruefe("er steht in der Hilfe", /w: "kontexter"/.test(lc));
  pruefe("er benutzt dieselbe Maschine wie /sortieren",
    /function sortierAufgabeStellen\(roh, alsKontexter\)/.test(lc));
  pruefe("und traegt seinen eigenen Namen",
    /KONTEXTER \\u2014 bring die Geschichte in die richtige Reihenfolge/.test(lc));
  pruefe("aus jedem Lesetext mit einem Tipp",
    /"\/kontexter " \+ zeilen\.slice\(0, 8\)\.join\(" \| "\)/.test(js));

  /* ---------- Und jetzt im Browser ---------- */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 160)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_LESEWAHL, { timeout: 20000 });
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      zuruecksetzen: true, leute: { b: { id: "b", name: "Bea", seit: 500 } } });
    const t = document.querySelector('[data-sub="sub-livechat"]');
    if (t) t.click();
  });
  await pg.waitForSelector("#lcVerlauf", { state: "attached", timeout: 20000 });

  const wartenAufTexte = async () => pg.evaluate(async () => {
    await new Promise((f) => {
      let mal = 0;
      const sehen = () => {
        const k = document.getElementById("lcPlatzMenue");
        if ((k && k.querySelectorAll(".lc-lese-text").length) || ++mal > 60) return f();
        setTimeout(sehen, 50);
      };
      sehen();
    });
    const k = document.getElementById("lcPlatzMenue");
    return {
      kategorien: k ? [...k.querySelectorAll(".lc-lese-kat-wort")].map((x) => x.textContent) : [],
      texte: k ? [...k.querySelectorAll(".lc-lese-text")].map((b) => b.textContent.trim()) : [],
      kontexter: k ? k.querySelectorAll(".lc-lese-kontexter").length : 0
    };
  });

  console.log("\nGEMESSEN: DIE KATEGORIEN IM WAEHLER\n");
  await pg.evaluate(() => window.DMA_LESEWAHL());
  const a1 = await wartenAufTexte();
  pruefe("fuenf Kategorien stehen zur Wahl", a1.kategorien.length === 5,
    a1.kategorien.join(" · "));
  pruefe("und zu jedem Text gibt es einen KONTEXTER-Knopf",
    a1.kontexter === a1.texte.length && a1.texte.length > 0,
    a1.texte.length + " Texte, " + a1.kontexter + " Knoepfe");

  console.log("\nGEMESSEN: EINE ANDERE KATEGORIE\n");
  const dichter = await pg.evaluate(async () => {
    const k = document.getElementById("lcPlatzMenue");
    const b = [...k.querySelectorAll(".lc-lese-kat")]
      .find((x) => /Dichter/.test(x.textContent));
    if (b) b.click();
    return true;
  });
  const a2 = await wartenAufTexte();
  pruefe("„Dichter und Denker“ bringt andere Texte",
    dichter && a2.texte.length > 0 && a2.texte[0] !== a1.texte[0],
    a2.texte.slice(0, 2).join(" · "));

  console.log("\nGEMESSEN: ES WAR EINMAL IN DEUTSCHLAND\n");
  const a3 = await pg.evaluate(async () => {
    const k = document.getElementById("lcPlatzMenue");
    const b = [...k.querySelectorAll(".lc-lese-kat")].find((x) => /Es war einmal/.test(x.textContent));
    if (b) b.click();
    /* NICHT auf „mehr als fuenf Texte" warten: die vorige Kategorie
       hatte schon sieben, die Bedingung waere sofort wahr und man
       misst die alte Liste. Gewartet wird, bis die Tage dastehen —
       eine Zeile, die mit „01." beginnt. */
    await new Promise((f) => {
      let mal = 0;
      const sehen = () => {
        const kk = document.getElementById("lcPlatzMenue");
        const erster = kk && kk.querySelector(".lc-lese-text");
        if ((erster && /^\d\d\.\d\d\./.test(erster.textContent.trim())) || ++mal > 120) return f();
        setTimeout(sehen, 100);
      };
      sehen();
    });
    const kk = document.getElementById("lcPlatzMenue");
    return [...kk.querySelectorAll(".lc-lese-text")].map((x) => x.textContent.trim());
  });
  pruefe("der laufende Monat steht mit seinen Tagen da", a3.length >= 20,
    a3.length + " Tage, erster: " + (a3[0] || "-"));

  console.log("\nGEMESSEN: DER TEXT BLEIBT IM FOKUS\n");
  const fokus = await pg.evaluate(async () => {
    /* Zurueck zu „Schnee von gestern" und einen Text schicken. */
    const k = document.getElementById("lcPlatzMenue");
    const s = [...k.querySelectorAll(".lc-lese-kat")].find((x) => /Schnee/.test(x.textContent));
    if (s) s.click();
    await new Promise((f) => setTimeout(f, 400));
    const erste = document.getElementById("lcPlatzMenue").querySelector(".lc-lese-text:not(:disabled)");
    if (erste) erste.click();
    await new Promise((f) => setTimeout(f, 500));
    const tafel = document.querySelector(".lc-lesetafel");
    if (!tafel) return null;
    const zeilen = [...tafel.querySelectorAll(".lc-lese-zeile")];
    zeilen[0].click();                       // erster Tipp: festhalten
    await new Promise((f) => setTimeout(f, 200));
    const fest = tafel.classList.contains("lc-lese-fest");
    const kleben = getComputedStyle(tafel).position;
    /* Jetzt schreibt jemand etwas — die Tafel muss danach UNTEN
       stehen, nicht mittendrin. */
    window.LiveChat.schreiben("noch eine Zeile");
    await new Promise((f) => setTimeout(f, 400));
    const verlauf = document.getElementById("lcVerlauf");
    const band = document.getElementById("lcFokusband");
    const zeile = tafel.closest(".lc-zeile");
    /* RUNDE 98 — der festgehaltene Text liegt nicht mehr IM Verlauf,
       sondern im Fokusband DARUNTER (siehe unten). */
    const imBand = Boolean(band) && zeile.parentElement === band;
    const rv = verlauf.getBoundingClientRect();
    const rt = tafel.getBoundingClientRect();
    return { fest: fest, kleben: kleben, imBand: imBand,
             unterDemChat: Math.round(rt.top) >= Math.round(rv.bottom) - 2,
             schalter: tafel.querySelectorAll(".lc-lese-schalter").length };
  });
  pruefe("ein Tipp auf die Zeile haelt den Text fest",
    Boolean(fokus && fokus.fest), fokus ? "Klasse gesetzt" : "keine Tafel");
  /* =====================================================================
     RUNDE 98 — DIE REGEL IST GEAENDERT, UND ZWAR AUF SEINEN WUNSCH
     ---------------------------------------------------------------------
     Bis Runde 97 klebte die festgehaltene Tafel mit „position: sticky"
     IM Chatverlauf und wurde ans Ende geschoben, sobald jemand
     schrieb. Dann kam:
       XANDER (23.09.2026): „Wenn ich auf Fokus gehe, dann gehe ich
       davon aus, dass das unten am untersten im Chatraum ist, dass
       alle das immer lesen und dass das niemand stoeren kann …
       solange das festgepinnt ist, ist es in Platz und das kann
       niemand verhindern."
     „Sticky" reichte dafuer nicht: es half nur, solange man ganz
     unten stand. Die Tafel liegt jetzt im FOKUSBAND unter dem
     rollenden Kasten und kann gar nicht mehr verschoben werden.
     Gemessen wird deshalb das: sie liegt im Band, und sie liegt unter
     dem Verlauf. Die ganze Messung dazu steht in
     werkzeug/pruefe-runde98-fokus.js.
     ===================================================================== */
  pruefe("und er liegt dann im Fokusband unter dem Chat",
    Boolean(fokus && fokus.imBand), fokus ? (fokus.imBand ? "im Band" : "im Verlauf") : "-");
  pruefe("schreibt jemand, bleibt er unter dem Chat stehen",
    Boolean(fokus && fokus.unterDemChat));
  pruefe("die Tafel hat Betonung und Fokus als Schalter",
    Boolean(fokus && fokus.schalter === 2), fokus ? fokus.schalter + " Schalter" : "-");

  console.log("\nGEMESSEN: DER KONTEXTER AUS EINEM TEXT\n");
  const kx = await pg.evaluate(async () => {
    window.DMA_LESEWAHL();
    await new Promise((f) => setTimeout(f, 700));
    const k = document.getElementById("lcPlatzMenue");
    const knopf = k ? k.querySelector(".lc-lese-kontexter:not(:disabled)") : null;
    if (!knopf) return null;
    knopf.click();
    await new Promise((f) => setTimeout(f, 500));
    const tafel = [...document.querySelectorAll(".lc-aufgabe")]
      .find((t) => /KONTEXTER/.test(t.textContent));
    return tafel ? { da: true, teile: tafel.querySelectorAll(".lc-sortier-satz, button").length,
                     text: tafel.textContent.slice(0, 60) } : { da: false };
  });
  pruefe("der KONTEXTER kommt in den Chat", Boolean(kx && kx.da),
    kx && kx.text ? kx.text.replace(/\s+/g, " ") : "-");

  pruefe("keine Fehler auf der Seite", aufSeite.length === 0,
    aufSeite.slice(0, 3).join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nRunde 24 sitzt.");
  process.exit(fehler ? 1 : 0);
})();
