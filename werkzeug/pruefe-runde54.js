#!/usr/bin/env node
/* =========================================================
   RUNDE 54 — KNÜLLEN, BENOTUNG BEIM LESEN, ANDROID-BREITE
   ---------------------------------------------------------
   GEMELDET:
   · „Knuellen besser."
   · „Denk auch dran, dass wir da Benotung machen koennen"
      — je Zeile und als Gesamtnote.
   · „bei den Texten laufen die Ueberschriften am Android
      senkrecht."

   Die Breite wird bei 360 px gemessen, dem schmalsten
   verbreiteten Androidgeraet — und „senkrecht" heisst: der
   Text steht auf mehreren Zeilen. Das misst man an der
   Zeilenhoehe, nicht am Seitenverhaeltnis; ein schmaler,
   hoher Knopf ist noch keine senkrechte Schrift.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

const starten = async (breite) => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: breite, height: 820 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_LESEWAHL, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  return { srv: srv, br: br, pg: pg };
};

(async () => {
  let { srv, br, pg } = await starten(460);

  console.log("\nDAS ZERKNÜLLEN: PAPIER HAT KNICKE\n");
  const kn = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-knuell").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("knuell", "3", "Alex");
    await new Promise((f) => setTimeout(f, 1350));
    const pl = document.querySelectorAll(".lc-platz")[2];
    const kreis = pl.querySelector(".lc-kreis");
    const knicke = pl.querySelector(".lc-knuell-knicke");
    if (!kreis || !knicke) return { da: false };
    /* Wie klein ist die Papierkugel auf dem Hoehepunkt? */
    const m = new DOMMatrixReadOnly(getComputedStyle(kreis).transform);
    const mk = new DOMMatrixReadOnly(getComputedStyle(knicke).transform);
    return { da: true,
             flaechen: knicke.querySelectorAll("path").length,
             ballX: Math.abs(m.a), ballY: Math.abs(m.d),
             knickX: Math.abs(mk.a),
             sichtbar: Number(getComputedStyle(knicke).opacity) };
  });
  pruefe("es gibt eine Knickschicht", kn.da);
  pruefe("mit Flächen und Knicklinien", (kn.flaechen || 0) >= 12, kn.flaechen + " Pfade");
  pruefe("sie ist auf dem Höhepunkt zu sehen",
    (kn.sichtbar || 0) > 0.5, "Deckkraft " + (kn.sichtbar || 0).toFixed(2));
  /* Vorher schrumpfte das Bild nur auf 0,68 und blieb rund. */
  pruefe("das Papier wird zur Kugel, nicht nur kleiner",
    kn.ballX < 0.62 && Math.abs(kn.ballX - kn.ballY) > 0.02,
    "Massstab " + (kn.ballX || 0).toFixed(2) + " × " + (kn.ballY || 0).toFixed(2));
  /* Beim ersten Versuch lagen die Knicke auf 0,88, waehrend das Bild
     schon auf 0,52 zusammengeknuellt war — sie ragten weit hinaus. */
  pruefe("und die Knicke liegen AUF der Kugel, nicht daneben",
    Math.abs(kn.knickX - kn.ballX) < 0.06,
    "Knicke " + (kn.knickX || 0).toFixed(2) + " gegen Bild " + (kn.ballX || 0).toFixed(2));

  console.log("\nDIE BENOTUNG BEIM LESEN\n");
  const note = await pg.evaluate(async () => {
    /* Eine Lesetafel bauen, so wie sie aus einer Nachricht entsteht —
       und als Fuehrender, sonst gibt es keinen Notenblock. */
    const z = document.createElement("p");
    z.className = "lc-zeile";
    document.getElementById("lcVerlauf").appendChild(z);
    window.__alteLage = window.LiveChat && window.LiveChat.lage;
    if (window.LiveChat) {
      window.LiveChat.lage = () => ({ haeuptling: true, ichName: "Alex", ichId: "ich",
        plaetze: [{ nummer: 1, id: "ich", name: "Alex", ich: true, leer: false },
                  { nummer: 2, id: "b2", name: "Bea", ich: false, leer: false }] });
    }
    window.DMA_PRUEFUNG.lesetafel({ id: "t1", text: "Lies vor.", niveau: "A2",
      leseZeilen: ["Erster Satz.", "Zweiter Satz.", "Dritter Satz."] }, z);
    await new Promise((f) => setTimeout(f, 120));
    const tafel = z.querySelector(".lc-lesetafel") || z.querySelector(".lc-aufgabe");
    const block = z.querySelector(".lc-lese-noten");
    if (!block) return { da: false };
    const raus = { da: true, ohneZeile: block.querySelectorAll(".lc-lese-note").length };
    /* Eine Zeile aufrufen — dann muessen die sechs Noten da sein. */
    window.DMA_LESEZEILE("t1", 1);
    await new Promise((f) => setTimeout(f, 60));
    raus.mitZeile = block.querySelectorAll(".lc-lese-note").length;
    /* Eine 2 geben. */
    block.querySelectorAll(".lc-lese-note")[1].click();
    await new Promise((f) => setTimeout(f, 40));
    raus.nachEins = block.querySelector('[data-rolle="gesamt"]').textContent;
    raus.marken = block.querySelectorAll(".lc-lese-notenmarke").length;
    /* Zweite Zeile, eine 4 — der Schnitt ist dann 3. */
    window.DMA_LESEZEILE("t1", 2);
    await new Promise((f) => setTimeout(f, 60));
    block.querySelectorAll(".lc-lese-note")[3].click();
    await new Promise((f) => setTimeout(f, 40));
    raus.nachZwei = block.querySelector('[data-rolle="gesamt"]').textContent;
    raus.markenZwei = block.querySelectorAll(".lc-lese-notenmarke").length;
    raus.senden = Boolean(block.querySelector(".lc-lese-notensenden"));
    raus.wahl = Boolean(block.querySelector(".lc-lese-notenwahl"));
    /* Dieselbe Note noch einmal nimmt sie wieder weg. */
    block.querySelectorAll(".lc-lese-note")[3].click();
    await new Promise((f) => setTimeout(f, 40));
    raus.nachRuecknahme = block.querySelectorAll(".lc-lese-notenmarke").length;
    if (window.__alteLage) window.LiveChat.lage = window.__alteLage;
    return raus;
  });
  pruefe("der Notenblock steht beim Führenden", note.da);
  pruefe("ohne aufgerufene Zeile gibt es keine Noten", note.ohneZeile === 0,
    note.ohneZeile + " Knöpfe");
  pruefe("mit aufgerufener Zeile sind es sechs", note.mitZeile === 6,
    note.mitZeile + " Knöpfe");
  pruefe("eine 2 ergibt Gesamt 2", /Gesamt: 2\b/.test(note.nachEins || ""), note.nachEins);
  pruefe("und steht als Marke in der Liste", note.marken === 1, note.marken + " Marken");
  /* 2 und 4 im Schnitt sind 3 — nicht die letzte und nicht die
     schlechteste. */
  pruefe("2 und 4 ergeben im Schnitt die 3", /Gesamt: 3\b/.test(note.nachZwei || ""),
    note.nachZwei);
  pruefe("zwei benotete Zeilen stehen in der Liste", note.markenZwei === 2,
    note.markenZwei + " Marken");
  pruefe("dieselbe Note noch einmal nimmt sie zurück",
    note.nachRuecknahme === 1, note.nachRuecknahme + " Marken");
  pruefe("die Gesamtnote lässt sich an jemanden schicken",
    note.senden && note.wahl);

  await br.close(); srv.close();

  console.log("\nAM SCHMALEN GERÄT: NICHTS STEHT SENKRECHT (360 px)\n");
  ({ srv, br, pg } = await starten(360));
  await pg.evaluate(() => window.DMA_LESEWAHL());
  await pg.waitForTimeout(400);
  const schmal = await pg.evaluate(() => {
    const alle = [...document.querySelectorAll(".lc-lese-kat, .lc-lese-stufe")];
    const zeilen = (el) => {
      const b = el.getBoundingClientRect(), cs = getComputedStyle(el);
      const zh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      const innen = b.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
        - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth);
      return innen / zh;
    };
    return { anzahl: alle.length,
      senkrecht: alle.filter((el) => zeilen(el) > 1.6).length,
      schmalste: Math.round(Math.min.apply(null,
        alle.map((el) => el.getBoundingClientRect().width))),
      niedrigste: Math.round(Math.min.apply(null,
        alle.map((el) => el.getBoundingClientRect().height))) };
  });
  pruefe("es gibt Kategorien und Niveaus", schmal.anzahl >= 8, schmal.anzahl + " Knöpfe");
  pruefe("keiner davon steht senkrecht", schmal.senkrecht === 0,
    schmal.senkrecht + " senkrecht");
  /* Ein 18 px breiter Knopf ist auf einem Telefon nicht zu treffen. */
  pruefe("und keiner ist zu schmal zum Antippen", schmal.schmalste >= 34,
    "schmalster " + schmal.schmalste + " px");
  pruefe("und hoch genug", schmal.niedrigste >= 28, "niedrigster " + schmal.niedrigste + " px");

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nKnuellen, Benotung und die schmale Ansicht stimmen.\n");
  process.exit(fehler ? 1 : 0);
})();
