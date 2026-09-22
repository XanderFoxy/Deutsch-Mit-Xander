/* =====================================================================
   SONDE RUNDE 86, ZWEITER TEIL
   ---------------------------------------------------------------------
   Gemessen wird, was Xander in der zweiten Haelfte seiner Liste
   genannt hat: der Luftballon, das Katapult mit Ladung, die Sahnedose
   von der richtigen Seite, die Voegel am Fenster, der Sternenhimmel,
   das Rollo ohne Quetschung, die Jalousie, die offen bleibt, die
   Comic-Augen im Dunkeln und die aufgeraeumte Kopfzeile.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 86, zweiter Teil");
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
  /* Der Mitschnitt der Toene — welche Datei faengt wann an? */
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push({ t: Math.round(performance.now()),
        n: (this.currentSrc || this.src || "").split("/").pop().split("?")[0]
             .replace(/\.(opus|m4a)$/, "") });
      return ap.call(this);
    };
  });
  const buehne = () => pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  /* Ein Bild auf einen Platz legen — ohne Bild laesst sich nicht
     messen, ob etwas als Ladung aufgenommen oder gequetscht wird. */
  const bildAuf = (i) => pg.evaluate((nr) => {
    const pl = document.querySelectorAll(".lc-platz")[nr];
    const k = pl.querySelector(".lc-kreis");
    let img = k.querySelector("img.lc-avatar");
    if (!img) { img = document.createElement("img"); img.className = "lc-avatar"; k.appendChild(img); }
    const c = document.createElement("canvas"); c.width = c.height = 120;
    const g = c.getContext("2d");
    for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) {
      g.fillStyle = (x + y) % 2 ? "#3b6ea5" : "#f0c419";
      g.fillRect(x * 20, y * 20, 20, 20);
    }
    img.src = c.toDataURL();
    img.style.display = "block";
  }, i);

  /* =================================================================
     1. DER LUFTBALLON
     ================================================================= */
  console.log("\nDer Luftballon");
  await buehne();
  await pg.evaluate(() => { window.__toene = []; window.__start = performance.now();
    window.DMA_PRUEFUNG.wirkung("luftballon", "Dana", "Alex", {}); });
  const gross = [];
  for (const ms of [300, 900, 1500]) {
    await pg.waitForTimeout(ms - (gross.length ? [300, 900, 1500][gross.length - 1] : 0));
    gross.push(await pg.evaluate(() => {
      const k = document.querySelectorAll(".lc-platz")[3].querySelector(".lc-kreis");
      const m = getComputedStyle(k).transform.match(/matrix\(([-\d.]+)/);
      return m ? +(+m[1]).toFixed(2) : -1;
    }));
  }
  sage(gross[0] < 1.1 && gross[1] > 1.4 && gross[2] > 1.85,
    "er wird mit jedem Pumpenhub groesser",
    gross.join("  →  "));
  const pumpe = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[3];
    const p = pl.querySelector(".lc-ballon-pumpe");
    const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
    if (!p) return null;
    const r = p.getBoundingClientRect();
    return Math.round(r.left + r.width / 2 - (k.left + k.width / 2));
  });
  /* Alex sitzt links von Dana — also steht die Pumpe links. */
  sage(pumpe !== null && pumpe < -20,
    "die Pumpe steht auf der Seite, auf der der Aufblasende sitzt",
    pumpe + " px neben der Bildmitte");
  await pg.waitForTimeout(3000);
  const zurueck = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[3];
    const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
    const s = pl.getBoundingClientRect();
    return { dx: Math.round(k.left + k.width / 2 - (s.left + s.width / 2)),
             reste: pl.querySelectorAll(".lc-ballon-pumpe, .lc-ballon-huelle").length };
  });
  sage(Math.abs(zurueck.dx) <= 2 && zurueck.reste === 0,
    "danach sitzt er wieder auf seinem Platz, ohne Rueckstaende",
    zurueck.dx + " px daneben, " + zurueck.reste + " Reste");
  const toene = await pg.evaluate(() =>
    (window.__toene || []).map((x) => x.n + "@" + Math.round(x.t - window.__start)));
  const huebe = toene.filter((x) => /^pumpe@/.test(x));
  const raus = toene.find((x) => /^luftraus@/.test(x));
  sage(huebe.length === 3 && !!raus,
    "drei Pumpenhuebe, dann geht die Luft heraus",
    huebe.join(", ") + (raus ? ", " + raus : ", luftraus fehlt"));

  /* =================================================================
     2. DAS KATAPULT NIMMT DAS PROFILBILD AUF
     ================================================================= */
  console.log("\nDas Katapult");
  await buehne();
  await bildAuf(3);
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("katapult", "Dana", "Alex", {}));
  await pg.waitForTimeout(560);
  const laden = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[3];
    const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
    const la = pl.querySelector(".lc-kata-last");
    const sv = pl.querySelector(".lc-katapult-bild");
    const arm = pl.querySelector(".lc-katapult-arm");
    if (!la || !arm) return null;
    const lr = la.getBoundingClientRect(), ar = arm.getBoundingClientRect();
    const sr = sv.getBoundingClientRect();
    return {
      /* Liegt die Ladung im Kasten des gespannten Armes? */
      imArm: lr.left + lr.width / 2 > ar.left - 6 && lr.left + lr.width / 2 < ar.right + 6
          && lr.top + lr.height / 2 > ar.top - 12 && lr.top + lr.height / 2 < ar.bottom + 12,
      bildLeer: +getComputedStyle(pl.querySelector(".lc-kreis")).opacity,
      geraet: Math.round(sr.left + sr.width / 2 - (k.left + k.width / 2)),
      gespiegelt: !!sv.querySelector('g[transform*="scale(-1,1)"]')
    };
  });
  sage(laden && laden.imArm && laden.bildLeer === 0,
    "das Profilbild liegt als Ladung in der Schale, der Platz ist so lange leer",
    laden ? ("in der Schale: " + laden.imArm + ", Platz leer: " + (laden.bildLeer === 0)) : "nichts gefunden");
  /* Alex sitzt links — das Geraet steht links und ist nicht gespiegelt. */
  sage(laden && laden.geraet < -20 && !laden.gespiegelt,
    "und es steht auf der Seite, auf der der Werfende sitzt",
    laden ? (laden.geraet + " px, gespiegelt: " + laden.gespiegelt) : "-");
  await pg.waitForTimeout(400);
  const flug = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[3];
    const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
    const la = pl.querySelector(".lc-kata-last");
    if (!la) return null;
    const r = la.getBoundingClientRect();
    return Math.round(r.left + r.width / 2 - (k.left + k.width / 2));
  });
  sage(flug !== null && flug < -30, "und fliegt davon", flug + " px");
  await pg.waitForTimeout(2200);
  sage(await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[3];
    return !pl.querySelector(".lc-kata-last")
      && +getComputedStyle(pl.querySelector(".lc-kreis")).opacity === 1;
  }), "am Ende ist das Bild wieder da und die Kopie weg");

  /* =================================================================
     3. DIE SAHNEDOSE KOMMT VON DER SITZSEITE
     ================================================================= */
  console.log("\nDie Sahnedose");
  const doseBei = async (ziel, i, wer) => {
    await buehne();
    await pg.evaluate(([z, w]) => window.DMA_PRUEFUNG.wirkung("sahne", z, w, {}), [ziel, wer]);
    await pg.waitForTimeout(700);
    const wo = await pg.evaluate((nr) => {
      const pl = document.querySelectorAll(".lc-platz")[nr];
      const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
      const d = pl.querySelector(".lc-sahne-dose");
      if (!d) return null;
      const r = d.getBoundingClientRect();
      return Math.round(r.left + r.width / 2 - (k.left + k.width / 2));
    }, i);
    await pg.waitForTimeout(3700);
    return wo;
  };
  const vonLinks = await doseBei("Dana", 3, "Alex");
  const vonRechts = await doseBei("Bea", 1, "Dana");
  sage(vonLinks !== null && vonRechts !== null && vonLinks < 0 && vonRechts > 0,
    "sie steht links, wenn er links sitzt — und rechts, wenn er rechts sitzt",
    "von links: " + vonLinks + " px, von rechts: " + vonRechts + " px");

  /* =================================================================
     4. DIE VOEGEL AM FENSTER
     ================================================================= */
  console.log("\nDas Fenster, der Himmel, das Rollo");
  await buehne();
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("luke", "Bea", "Alex", {}));
  await pg.waitForTimeout(900);
  const vogel1 = await pg.evaluate(() => {
    const sw = document.querySelectorAll(".lc-aussicht-vogel .lc-schwinge");
    return { voegel: document.querySelectorAll(".lc-aussicht-vogel").length,
             schwingen: sw.length,
             jetzt: sw.length ? getComputedStyle(sw[0]).transform : "-" };
  });
  await pg.waitForTimeout(260);
  const vogel2 = await pg.evaluate(() => {
    const sw = document.querySelectorAll(".lc-aussicht-vogel .lc-schwinge");
    return sw.length ? getComputedStyle(sw[0]).transform : "-";
  });
  sage(vogel1.voegel === 3 && vogel1.schwingen === 6 && vogel1.jetzt !== vogel2,
    "drei Voegel, und ihre Schwingen bewegen sich wirklich",
    vogel1.voegel + " Voegel, " + vogel1.schwingen + " Schwingen, Bewegung: "
      + (vogel1.jetzt !== vogel2));
  await pg.waitForTimeout(3000);

  /* =================================================================
     5. DER STERNENHIMMEL LIEGT NICHT MEHR IN REIHEN
     ================================================================= */
  await buehne();
  await bildAuf(2);
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("rollo", "Cem", "Alex", {}));
  await pg.waitForTimeout(1700);
  const himmel = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[2];
    const kasten = pl.querySelector(".lc-aussicht-sterne");
    if (!kasten) return null;
    const k = kasten.getBoundingClientRect();
    const orte = [...kasten.querySelectorAll("b")].map((x) => {
      const r = x.getBoundingClientRect();
      return { x: (r.left + r.width / 2 - k.left) / k.width * 100,
               y: (r.top + r.height / 2 - k.top) / k.height * 100,
               gr: +r.width.toFixed(1) };
    });
    const xs = orte.map((o) => o.x).sort((a, b) => a - b);
    const l = xs.slice(1).map((v, i) => v - xs[i]);
    const m = l.reduce((a, b) => a + b, 0) / (l.length || 1);
    const streu = Math.sqrt(l.reduce((a, b) => a + (b - m) * (b - m), 0) / (l.length || 1));
    return { anzahl: orte.length, groessen: new Set(orte.map((o) => o.gr)).size,
             streuung: +streu.toFixed(2), mittel: +m.toFixed(2),
             hell: kasten.querySelectorAll(".lc-stern-hell").length };
  });
  /* Ein Gitter haette fast keine Streuung: jeder Abstand gleich. */
  sage(himmel && himmel.anzahl > 18 && himmel.groessen >= 8
    && himmel.streuung > himmel.mittel * 0.5,
    "die Sterne liegen unregelmaessig und sind verschieden gross",
    himmel ? (himmel.anzahl + " Sterne, " + himmel.groessen + " Groessen, Abstand "
      + himmel.mittel + " % ± " + himmel.streuung) : "keine Sterne");

  /* =================================================================
     6. DAS ROLLO QUETSCHT DAS BILD NICHT MEHR
     ================================================================= */
  const rollo = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[2];
    const tuch = pl.querySelector(".lc-rollo-tuch");
    const bahn = pl.querySelector(".lc-rollo-bahn");
    if (!tuch || !bahn) return null;
    const t = getComputedStyle(tuch).transform;
    const m = t.match(/matrix\(([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)/);
    return { tuchBild: /url\(/.test(getComputedStyle(tuch).backgroundImage),
             hoch: Math.round(tuch.getBoundingClientRect().height),
             bahnHoch: Math.round(bahn.getBoundingClientRect().height),
             skalaY: m ? +(+m[4]).toFixed(3) : null,
             schnitt: getComputedStyle(bahn).clipPath };
  });
  sage(rollo && rollo.tuchBild && rollo.skalaY === 1,
    "das Profilbild faehrt auf dem Rollo mit und wird dabei nicht gestaucht",
    rollo ? ("Bild auf dem Tuch: " + rollo.tuchBild + ", scaleY: " + rollo.skalaY) : "kein Rollo");
  sage(rollo && /inset|polygon/.test(rollo.schnitt || ""),
    "hochgefahren wird durch Beschneiden, nicht durch Stauchen",
    rollo ? String(rollo.schnitt).slice(0, 42) : "-");
  await pg.waitForTimeout(2000);

  /* =================================================================
     7. DIE JALOUSIE BLEIBT OFFEN
     ================================================================= */
  await buehne();
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("lamellen", "Bea", "Alex", {}));
  await pg.waitForTimeout(3250);
  const jal = await pg.evaluate(() => {
    const l = [...document.querySelectorAll(".lc-platz")[1].querySelectorAll(".lc-lamelle")];
    return l.length ? Math.min(...l.map((x) => +getComputedStyle(x).opacity)) : -1;
  });
  sage(jal >= 0.99,
    "am Ende ist die Jalousie offen und blendet sich nicht vorher aus",
    "schwaechste Lamelle: " + jal);
  await pg.waitForTimeout(600);

  /* =================================================================
     8. COMIC-AUGEN BEIM LICHT AUS
     ================================================================= */
  console.log("\nDas Licht");
  await buehne();
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("licht", "Bea", "Alex", {}));
  await pg.waitForTimeout(2600);
  const augen = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[1];
    const svg = pl.querySelector(".lc-lichtaus-augen .lc-augen-svg");
    return { comic: !!svg,
             pupillen: pl.querySelectorAll(".lc-lichtaus-augen .lc-pupille").length,
             lider: pl.querySelectorAll(".lc-lichtaus-augen .lc-lid").length,
             dunkel: !!pl.querySelector(".lc-lichtaus-nacht") };
  });
  sage(augen.comic && augen.pupillen === 2 && augen.lider === 2 && augen.dunkel,
    "im Dunkeln gucken jetzt die Comic-Augen mit Pupille und Lid",
    JSON.stringify(augen));
  await pg.waitForTimeout(3800);

  /* =================================================================
     9. DIE KOPFZEILE IST AUFGERAEUMT
     -----------------------------------------------------------------
     Die Karte laesst sich ohne Anmeldung nicht bauen, deshalb wird
     die Auszeichnung AUS DEM QUELLTEXT geholt und mit dem echten
     Stilblatt gemessen — gemessen wird also die Kopfzeile der Seite
     und nicht eine nachgebaute. */
  console.log("\nDie Kopfzeile");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(!/Du bist als Erste:r da/.test(js),
    "der Satz \u201eDu bist als Erste:r da\u201c steht nicht mehr da");
  const stueck = js.match(/<div class="lc-kopf" id="lcKopf">[\s\S]*?<\/div>\s*<!--/);
  const kopfHtml = stueck ? stueck[0].replace(/<!--$/, "") : "";
  const hoehen = [];
  for (const breit of [320, 430]) {
    const p2 = await br.newPage({ viewport: { width: breit, height: 720 } });
    await p2.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
      { waitUntil: "domcontentloaded" });
    await p2.waitForTimeout(600);
    hoehen.push(await p2.evaluate((h) => {
      const k = document.createElement("div");
      k.className = "question-card livechat";
      k.innerHTML = h;
      document.body.appendChild(k);
      const kopf = k.querySelector(".lc-kopf");
      const unter = k.querySelector("#lcKopfUnter");
      unter.textContent = "3 von 8 Plätzen · Hauptraum";
      const r = kopf.getBoundingClientRect();
      const ur = unter.getBoundingClientRect();
      const tr = k.querySelector("#lcKopfTitel").getBoundingClientRect();
      return { hoch: Math.round(r.height),
               /* Nebeneinander heisst: beide auf derselben Hoehe. */
               nebeneinander: Math.abs(ur.top - tr.top) < ur.height };
    }, kopfHtml));
    await p2.close();
  }
  sage(hoehen.every((h) => h.hoch > 0 && h.hoch <= 56),
    "die Kopfzeile ist auf kleinen Geraeten flach genug fuer Ueberschrift UND Eingabezeile",
    hoehen.map((h, i) => [320, 430][i] + " px: " + h.hoch + " px").join(", "));
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  sage(/#sub-livechat\[data-active="true"\] \{ padding-bottom: \d+px; \}/.test(css),
    "und unter dem Klassenzimmer bleibt Rollweg, damit die Browserzeile weggehen kann");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
