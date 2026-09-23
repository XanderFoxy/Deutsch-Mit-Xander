#!/usr/bin/env node
/* =========================================================
   RUNDE 29 — WHITEBOARD, BILLARD ZU DRITT, SCHNEEKUGEL,
   GEMEINSAM FAHREN, BETONUNG IM LESETEXT, T-REX
   ---------------------------------------------------------
   GEWUENSCHT und GEMELDET, woertlich:
   · „Ich moechte ein Whiteboard implementieren … dass die
      Plaetze, die oben sind, nach unten wandern und das
      Whiteboard nach oben … Ich moechte das Layout nicht
      erweitern … man kann in das Whiteboard Bilder einladen
      … an jeder Stelle im Bild eine Markierung zeichnen …
      oder ein Pointer, dass die Markierung dort blinkt …
      dass ich den Leuten das reinzoomen kann."
   · „Beim Billard soll es so sein, dass zufaellig einer von
      allen teilnimmt: wenn mehr als zwei Leute teilnehmen,
      soll die eine Kugel, die man anstoesst, die anderen
      beeinflussen und einer von denen soll zufaellig in ein
      leerstehendes Loch fallen."
   · „Dann moechte ich noch einen Effekt haben, der
      Schneekugel heisst."
   · „wenn ich mit jemandem gemeinsam fahren will, dann
      kriege ich sein Profilbild an … und dann fahren wir
      einfach weg."
   · „bei den Texten wird die Betonung nicht angezeigt."
   · „Beim Aufessen koennen mehr Kruemel fallen."
   · „Schau nach, dass die Effekte auf beiden Seiten
      synchron sind."
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4",
  ".webm": "video/webm", ".mp4": "video/mp4" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");

  console.log("\nDAS LOS FAEHRT MIT — BEIDE SEITEN SEHEN DASSELBE\n");
  pruefe("„los“ steht in der Liste der Zusatzfelder",
    /var ZUSATZ_FELDER = \[[\s\S]{0,300}"los"/.test(lc));
  pruefe("der Absender wuerfelt EINMAL",
    /los: Math\.random\(\)\.toFixed\(4\)/.test(lc));
  /* RUNDE 88 — die Zahl heisst jetzt „wurfB" und steuert ausserdem
     die Abweichung des Stosses; der Sinn ist derselbe: die Zahl
     faehrt in der Nachricht mit, damit jeder dasselbe Spiel sieht. */
  pruefe("und das Billard nimmt es statt eines eigenen Wurfs",
    /function lcBillard\(wen, von, los\)/.test(js)
    && /const wurfB = \(zahlB >= 0 && zahlB < 1\) \? zahlB : Math\.random\(\);/.test(js));
  pruefe("wer wirft, steht in der Zeile — nicht vor dem Geraet",
    /let lcWurfVon = "";/.test(js)
    && /const quelle = \(lcWurfVon \? lcPlatzMitNamen\(lcWurfVon\) : null\)/.test(js));

  console.log("\nBILLARD ZU DRITT\n");
  pruefe("die anderen am Tisch werden gesucht",
    /const andere = gitter\.filter\(\(p\) => !p\.frei && p !== zu && p !== stoss\);/.test(js));
  /* RUNDE 88 — „das naechste freie Loch" gibt es nicht mehr: auch die
     angestossene Kugel rollt nach der Physik und faellt dort hinein,
     wo sie hinkommt. */
  pruefe("einer von ihnen faellt in ein Loch",
    /lcKugelPhysik\(opfer, opferBahn, \{ warten: hin\.ankunft \+ 80, rein: true \}\)/.test(js));
  pruefe("die uebrigen werden nur angestossen",
    /function lcAngestossen/.test(js) && /lcAngestossenR29/.test(css));
  pruefe("zu zweit rollt der Getroffene selbst",
    /Zu zweit: der Getroffene rollt selbst ueber den Tisch/.test(js));

  console.log("\nDIE SCHNEEKUGEL\n");
  pruefe("es gibt sie als Effekt", /function lcSchneekugel/.test(js));
  pruefe("erst wird geschuettelt", /lc-geschuettelt/.test(js) && /lcSchuettelnR29/.test(css));
  pruefe("dann rieselt es", /lc-sk-flocke/.test(js) && /lcSkFlockeR29/.test(css));
  pruefe("unten stehen Haeuschen und Tannen",
    /lc-sk-haus/.test(js) && /lc-sk-tanne/.test(js));
  pruefe("und sie hat einen Befehl", /w: "schneekugel"/.test(lc));

  console.log("\nGEMEINSAM FAHREN\n");
  pruefe("es gibt den Befehl", /w: "gemeinsam"/.test(lc) && /gemeinsam: \{ wirkung: "gemeinsam"/.test(lc));
  /* RUNDE 98 — die Unterschrift hat zwei Teile dazubekommen: „art"
     (Fahrrad oder Huepfball) und „kette" (der selbst gezeichnete Weg).
     XANDER: „einmal, dass ich mit jemandem gemeinsam ein Fahrrad bin
     … dann kann ich auch den Weg einzeichnen, wo ich lang fahr, und
     einmal, dass ich denjenigen als Sprungball benutze." */
  pruefe("beide Bilder fahren", /function lcGemeinsam\(wen, von, art, kette\)/.test(js)
    && /const bilderM = \[/.test(js));
  pruefe("und am Ende sitzt jeder auf einem eigenen Platz",
    /nehmen\(ab\.el, ziel\.nr\);[\s\S]{0,80}nehmen\(mit\.el, zielMit\.nr\);/.test(js));

  console.log("\nDIE BETONUNG IM LESETEXT\n");
  pruefe("die Zeilen der Lesetafel kommen durch den Filter",
    /if \(parent\.closest\("\.lc-lese-zeile"\)\) \{/.test(js));
  pruefe("und der Grund steht dabei",
    /bei den Texten wird die Betonung nicht angezeigt/.test(js));

  console.log("\nMEHR KRUEMEL\n");
  pruefe("aus fuenf sind sechzehn geworden", /for \(let k = 0; k < 16; k\+\+\)/.test(js));
  pruefe("und jeder faellt auf seiner eigenen Bahn", /--seit/.test(js) && /var\(--seit, 0%\)/.test(css));

  console.log("\nDER T-REX IST JETZT SO GROSS WIE DIE ANDEREN\n");
  const trex = JSON.parse(fs.readFileSync(path.join(WURZEL, "filme/trex.json"), "utf8"));
  const loewe = JSON.parse(fs.readFileSync(path.join(WURZEL, "filme/loewe.json"), "utf8"));
  pruefe("dieselbe Groesse wie der Loewe",
    trex.breite === loewe.breite && trex.hoehe === loewe.hoehe,
    trex.breite + "x" + trex.hoehe + " gegen " + loewe.breite + "x" + loewe.hoehe);
  const gross = fs.statSync(path.join(WURZEL, "filme/trex.webm")).size;
  pruefe("und er wiegt weniger als 2 MB", gross < 2 * 1024 * 1024,
    (gross / 1024 / 1024).toFixed(2) + " MB (vorher 8.25 MB)");

  /* ---------- UND JETZT IM BROWSER ---------- */
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

  console.log("\nDAS WHITEBOARD — GEMESSEN\n");
  const tafel = await pg.evaluate(async () => {
    DMA_PRUEF.effektBuehne();
    const karte = document.getElementById("livechatKarte");
    const vorher = karte.getBoundingClientRect().height;
    DMA_PRUEF.effekt("tafelauf");
    await new Promise((f) => setTimeout(f, 500));
    const nachher = karte.getBoundingClientRect().height;
    const t = document.getElementById("lcTafel");
    const c = document.getElementById("lcTafelStift");
    /* Ein Strich von aussen — wie er ueber die Leitung kaeme. */
    window.DMA_TAFEL({ t: "strich", zug: { p: [[0.1, 0.2], [0.8, 0.7]], f: "#e2312a", d: 0.01 } });
    await new Promise((f) => setTimeout(f, 120));
    const zaehle = () => {
      const g = c.getContext("2d");
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] > 30) n++;
      return n;
    };
    const punkteNachStrich = zaehle();
    window.DMA_TAFEL({ t: "zeiger", x: 0.5, y: 0.5 });
    const z = document.getElementById("lcTafelZeiger");
    const zeigerDa = z && !z.hidden && z.classList.contains("lc-tafel-blinkt");
    window.DMA_TAFEL({ t: "blick", z: 2, x: 0.3, y: 0.4 });
    const blatt = document.getElementById("lcTafelBlatt");
    /* Das Heranholen laeuft weich (0,28 s) — sofort danach steht in
       der Rechnung noch der alte Wert. Also abwarten. */
    await new Promise((f) => setTimeout(f, 420));
    const zoom = getComputedStyle(blatt).transform;
    window.DMA_TAFEL({ t: "leer" });
    await new Promise((f) => setTimeout(f, 80));
    const punkteNachLeer = zaehle();
    /* Und wieder zu. */
    DMA_PRUEF.effekt("tafelzu");
    await new Promise((f) => setTimeout(f, 200));
    const zuDanach = document.getElementById("lcTafel").hidden
      && !karte.classList.contains("lc-tafel-an");
    return { vorher, nachher, da: Boolean(t), punkteNachStrich, zeigerDa, zoom,
             punkteNachLeer, zuDanach,
             breite: c.width, hoehe: c.height };
  });
  pruefe("sie ist da, sobald jemand sie aufmacht", tafel.da);
  pruefe("der Kasten wird KEINEN Bildpunkt hoeher",
    Math.abs(tafel.nachher - tafel.vorher) < 2,
    tafel.vorher.toFixed(1) + " px vorher, " + tafel.nachher.toFixed(1) + " px nachher");
  pruefe("die Leinwand hat eine Groesse", tafel.breite > 10 && tafel.hoehe > 10,
    tafel.breite + "x" + tafel.hoehe);
  pruefe("ein Strich von der anderen Seite kommt an",
    tafel.punkteNachStrich > 200, tafel.punkteNachStrich + " gefaerbte Punkte");
  pruefe("der Zeiger blinkt", tafel.zeigerDa);
  pruefe("das Heranholen gilt fuer alle", /matrix\(2/.test(tafel.zoom) || /scale\(2/.test(tafel.zoom),
    tafel.zoom);
  pruefe("das Wegwischen wischt wirklich weg", tafel.punkteNachLeer === 0,
    tafel.punkteNachLeer + " Punkte uebrig");
  pruefe("und sie geht auch wieder zu", tafel.zuDanach);

  console.log("\nDAS BILLARD WUERFELT NICHT ZWEIMAL\n");
  const bill = await pg.evaluate(async () => {
    /* Zweimal dasselbe Los — zweimal muss derselbe fallen. Gemessen
       wird, welcher Platz die Tasche bekommt. */
    const lauf = async (los) => {
      DMA_PRUEF.effektBuehne();
      /* Ohne freien Platz gibt es kein Loch — und ohne Loch faellt
         niemand hinein. Auf der Buehne sitzen fuenf, also werden zwei
         Plaetze geraeumt: einer als Loch, einer als Ausweichloch. */
      ["4", "5"].forEach((nr) => {
        const pl = document.querySelector('.lc-platz[data-lc-platz="' + nr + '"]');
        if (!pl) return;
        pl.classList.add("lc-platz-frei");
        const nm = pl.querySelector(".lc-platz-name");
        if (nm) nm.textContent = "frei";
      });
      DMA_PRUEF.effekt("billard", "Bea", { los: los, name: "Alex" });
      await new Promise((f) => setTimeout(f, 1600));
      const t = document.querySelector(".lc-billard-tasche");
      const platz = t ? t.closest(".lc-platz") : null;
      return platz ? platz.dataset.lcPlatz : "";
    };
    const a = await lauf("0.1000");
    const b = await lauf("0.1000");
    const c = await lauf("0.9000");
    return { a, b, c };
  });
  pruefe("dasselbe Los trifft denselben", bill.a && bill.a === bill.b,
    "Platz " + bill.a + " und Platz " + bill.b);
  pruefe("ein anderes Los darf einen anderen treffen", Boolean(bill.c),
    "Platz " + bill.c);

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n" : "\nRunde 29 sitzt.\n");
  process.exit(fehler ? 1 : 0);
})();
