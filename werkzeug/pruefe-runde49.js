#!/usr/bin/env node
/* =========================================================
   RUNDE 49 — TROMMEL, OHRFEIGE, KRAN, SCHLAEGER
   ---------------------------------------------------------
   GEMELDET, woertlich und zum Teil zum zweiten Mal:

   · „Die Trommel hat immer noch keine filigranen Trommelstoecke
      und sie sind auch nicht bis zum Ende der Animation zu sehen
      bei dem Marschgeraeusch. Es soll nur ein Schlaegel sein bei
      dem Paukenschlag und filigrane normale Drumsticks bei der
      zweiten Einstellung."
   · „Die Ohrfeige hat immer noch kein Klatschgeraeusch."
   · „dann moechte ich abhaengig vom Geschlecht ... ein
      Schmerzgeraeusch von der Frau."
   · „Der Kran hat noch am Ende ein Motorengeraeusch, das soll
      nicht da sein."
   · „mach den Tennisschlaeger bitte rot mit schwarzem Griff."
   · „der Slot-Machine-Sound bei dem Zufall ist immer noch nicht da."

   Gemessen wird nicht, ob eine Datei existiert, sondern was am
   Bildschirm und im Tonplan wirklich steht.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".opus": "audio/ogg" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
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
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEF, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  console.log("\nDER PAUKENSCHLAG — EIN SCHLAEGEL\n");
  const pauke = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-trommel").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("trommel", "2", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const s = document.querySelector(".lc-trommel");
    if (!s) return { da: false };
    const st = [...s.querySelectorAll(".lc-trommel-stock")];
    const cs = st[0] ? getComputedStyle(st[0]) : null;
    /* Der Filzkopf ist die letzte Ellipse im SVG. */
    const kopf = st[0] ? st[0].querySelector("ellipse") : null;
    return { da: true, anzahl: st.length,
             mitte: st.some((x) => x.classList.contains("lc-trommel-mitte")),
             stick: st.some((x) => x.classList.contains("lc-trommel-stick")),
             anim: cs ? cs.animationName : "",
             kopfBreit: kopf ? Number(kopf.getAttribute("rx")) : 0 };
  });
  pruefe("der Paukenschlag zeichnet sich", pauke.da);
  pruefe("es ist GENAU EIN Schlaegel", pauke.anzahl === 1, pauke.anzahl + " Stueck");
  pruefe("und er steht in der Mitte", Boolean(pauke.mitte));
  pruefe("er traegt einen Filzkopf, keinen Stick",
    !pauke.stick && pauke.kopfBreit >= 7, "rx=" + pauke.kopfBreit);
  pruefe("er schlaegt auch wirklich",
    Boolean(pauke.anim) && pauke.anim !== "none", pauke.anim);

  console.log("\nDER MARSCH — ZWEI FEINE STICKS, BIS ZUM SCHLUSS\n");
  const marsch = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-trommel").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("marsch", "2", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const s = document.querySelector(".lc-trommel-marsch");
    if (!s) return { da: false };
    const st = [...s.querySelectorAll(".lc-trommel-stock")];
    const cs = st[0] ? getComputedStyle(st[0]) : null;
    const kopf = st[0] ? st[0].querySelector("ellipse") : null;
    /* RUNDE 73 — DIESE ZWEI ZEILEN WAREN DIE FALLE.
       `getComputedStyle` gibt ein LEBENDES Objekt zurueck. Es wurde
       hier geholt, aber erst nach dem Warten ausgelesen — und bis
       dahin war die Schicht aus dem Dokument entfernt. Ein geloestes
       Element liefert ueberall leere Zeichenketten zurueck, und genau
       das stand in der Meldung: „Wiederholung: ". Die Animation war
       nie kaputt, die Pruefung hat zu spaet hingesehen. Jetzt wird
       SOFORT in einfache Zeichenketten kopiert. */
    const animJetzt = cs ? cs.animationName : "";
    const wdhJetzt = cs ? cs.animationIterationCount : "";
    const fruehSichtbar = st.map((x) => Number(getComputedStyle(x).opacity));
    /* Bei 1,0 s laeuft der Marschton noch — da MUESSEN die Stoecke
       schlagen. Genau hier lag der alte Fehler: „animation-duration:
       .26s" mit „both" liess sie nach 260 ms im letzten
       Schluesselbild stehen, und das war „opacity: 0". */
    await new Promise((f) => setTimeout(f, 700));
    const mitten = [...document.querySelectorAll(".lc-trommel-marsch .lc-trommel-stock")]
      .map((x) => Number(getComputedStyle(x).opacity));
    /* RUNDE 73 — XANDER: „Bei der Trommel solltest du die Animation
       verkuerzen, weil der Sound von der Trommel schon vorher
       aufhoert." Seitdem raeumt app.js die Schicht nach 1600 ms ab.
       Die alte Regel „nach 2,2 s IMMER NOCH da" verlangte also
       genau das Gegenteil von dem, was er wollte — sie wird
       umgedreht: nach 2,2 s darf NICHTS mehr stehen. */
    await new Promise((f) => setTimeout(f, 1200));
    const spaet = [...document.querySelectorAll(".lc-trommel-marsch .lc-trommel-stock")]
      .map((x) => Number(getComputedStyle(x).opacity));
    return { da: true, anzahl: st.length, stick: st.every((x) => x.classList.contains("lc-trommel-stick")),
             anim: animJetzt, wdh: wdhJetzt,
             kopfBreit: kopf ? Number(kopf.getAttribute("rx")) : 0,
             frueh: fruehSichtbar, mitten: mitten, spaet: spaet };
  });
  pruefe("der Marsch zeichnet sich", marsch.da);
  pruefe("es sind ZWEI Stoecke", marsch.anzahl === 2, marsch.anzahl + " Stueck");
  pruefe("und beide sind filigrane Sticks", Boolean(marsch.stick));
  pruefe("die Spitze ist duenn, kein Filzkopf",
    marsch.kopfBreit > 0 && marsch.kopfBreit <= 4, "rx=" + marsch.kopfBreit);
  pruefe("der Wirbel laeuft durch, er haelt nicht an",
    marsch.wdh === "infinite", "Wiederholung: " + marsch.wdh);
  pruefe("sie sind am Anfang zu sehen",
    (marsch.frueh || []).every((o) => o > 0.5), (marsch.frueh || []).join(" / "));
  pruefe("und nach 1,0 s — solange der Ton laeuft — immer noch",
    (marsch.mitten || []).length === 2 && marsch.mitten.every((o) => o > 0.5),
    (marsch.mitten || []).length + " Stoecke, Deckkraft " + (marsch.mitten || []).join(" / "));
  /* Gezaehlt wird nicht die Zahl (die Buehne kann mehrere Schichten
     tragen), sondern ob ueberhaupt noch welche da und sichtbar sind. */
  pruefe("und nach 2,2 s ist sie weg, wie der Ton",
    (marsch.spaet || []).length === 0 || marsch.spaet.every((o) => o < 0.05),
    (marsch.spaet || []).length + " Stoecke, Deckkraft " + (marsch.spaet || []).join(" / "));

  console.log("\nDIE OHRFEIGE — KLATSCH UND SCHMERZ NACH GESCHLECHT\n");
  const ohr = await pg.evaluate(() => {
    const plan = window.DMA_PRUEFUNG.tonPlan ? window.DMA_PRUEFUNG.tonPlan() : null;
    const treffer = window.DMA_PRUEFUNG.treffer ? window.DMA_PRUEFUNG.treffer() : null;
    return { plan: plan ? (plan.ohrfeige || {}).ton : "?",
             treffer: treffer ? treffer.ohrfeige : 0 };
  });
  pruefe("die Ohrfeige klatscht (Ton klatsch)", ohr.plan === "klatsch", "Plan: " + ohr.plan);
  /* 28 % von 2,6 s = 728 ms — dort sitzt die Hand am Gesicht. */
  pruefe("und zwar genau beim Treffer", ohr.treffer >= 680 && ohr.treffer <= 780,
    ohr.treffer + " ms");

  const schmerz = await pg.evaluate(async () => {
    const raus = {};
    for (const [g, erwartet] of [["weiblich", "aufrau"], ["maennlich", "aumann"], ["", "aumann"]]) {
      const pl = document.querySelectorAll(".lc-platz")[1];
      pl.dataset.lcGeschlecht = g;
      raus[g || "(leer)"] = window.DMA_PRUEFUNG.schmerzTon
        ? window.DMA_PRUEFUNG.schmerzTon(pl) : "?";
    }
    return raus;
  });
  pruefe("eine Frau schreit mit der Frauenstimme",
    schmerz.weiblich === "aufrau", "weiblich → " + schmerz.weiblich);
  pruefe("ein Mann mit der Maennerstimme",
    schmerz.maennlich === "aumann", "maennlich → " + schmerz.maennlich);
  pruefe("und ohne Angabe bleibt es bei einer festen Wahl",
    schmerz["(leer)"] === "aumann", "ohne Angabe → " + schmerz["(leer)"]);

  console.log("\nDER ZUFALL, DER KRAN UND DER SCHLAEGER\n");
  const rest = await pg.evaluate(() => {
    const plan = window.DMA_PRUEFUNG.tonPlan ? window.DMA_PRUEFUNG.tonPlan() : {};
    const ank = window.DMA_PRUEFUNG.ankunftsTon ? window.DMA_PRUEFUNG.ankunftsTon() : {};
    return { zufall: (plan.zufall || {}).ton, geld: (plan.geld || {}).ton, kran: ank.kran };
  });
  /* RUNDE 72 NACHGEFUEHRT: der Plan zeigt nicht mehr auf „slot",
     sondern auf „slot2". XANDER: „Der Zufall braucht ein
     Slotmaschinen- oder Flipper-Klingeln, und man muss die
     Entscheidung der Walzen hoeren." Gemessen hatte „slot" weder
     Walzen noch Einrasten noch Klingeln; „slot2" hat alle drei
     (Hebel 0–0,33 s, Walzen 0,34–1,62 s, Einrasten 1,66 / 1,96 /
     2,26 s, Klingeln ab 2,44 s). Deshalb gelten hier beide Namen. */
  pruefe("der Zufall rattert wie eine Slotmaschine",
    rest.zufall === "slot" || rest.zufall === "slot2", "Plan: " + rest.zufall);
  pruefe("der Kran brummt am Ende NICHT mehr",
    rest.kran && rest.kran !== "kitt", "Ankunft: " + rest.kran);

  const schlaeger = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-tennis").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("tennis", "2", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const svg = document.querySelector(".lc-tennisschlaeger");
    if (!svg) return { da: false };
    /* NICHT die erste Ellipse: die steht im <clipPath> und traegt gar
       keine Farbe. Gesucht ist der Rahmen — die erste Ellipse MIT
       Strichfarbe. */
    const rahmen = [...svg.querySelectorAll("ellipse")]
      .filter((e) => (e.getAttribute("stroke") || "").charAt(0) === "#")[0];
    const griffe = [...svg.querySelectorAll("rect")];
    return { da: true,
             rahmen: rahmen ? rahmen.getAttribute("stroke") : "",
             griff: griffe.length ? griffe[griffe.length - 2].getAttribute("fill") : "",
             knauf: griffe.length ? griffe[griffe.length - 1].getAttribute("fill") : "" };
  });
  const dunkel = (f) => {
    const m = String(f || "").match(/^#([0-9a-f]{6})$/i);
    if (!m) return false;
    const n = parseInt(m[1], 16);
    return ((n >> 16) & 255) < 46 && ((n >> 8) & 255) < 46 && (n & 255) < 46;
  };
  const rot = (f) => {
    const m = String(f || "").match(/^#([0-9a-f]{6})$/i);
    if (!m) return false;
    const n = parseInt(m[1], 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return r > 150 && g < 90 && b < 90;
  };
  pruefe("der Tennisschlaeger zeichnet sich", schlaeger.da);
  pruefe("der Rahmen ist rot", rot(schlaeger.rahmen), schlaeger.rahmen);
  pruefe("der Griff ist schwarz", dunkel(schlaeger.griff), schlaeger.griff);
  pruefe("und der Knauf auch", dunkel(schlaeger.knauf), schlaeger.knauf);

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nTrommel, Ohrfeige, Kran und Schlaeger stimmen.\n");
  process.exit(fehler ? 1 : 0);
})();
