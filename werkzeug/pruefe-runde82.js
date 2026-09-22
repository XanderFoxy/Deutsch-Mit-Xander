/* =====================================================================
   SONDE RUNDE 82 — der Rest von Xanders Liste aus Runde 76
   ---------------------------------------------------------------------
   Drei Punkte, die seit Runde 76 offen standen:
     · „Salve auf mehrere"
     · „Hammer mit Zufall und Glasbruch"
     · „Katapult groesser"
   Gemessen wird nicht, ob es im Quelltext steht, sondern was im
   Browser dabei herauskommt: welche Plaetze getroffen werden, wie
   viele Risse gezeichnet sind und wie breit das Katapult wirklich ist.
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
  console.log("RUNDE 82 — was aus Runde 76 offen war");
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

  /* =================================================================
     1. DIE SALVE AUF MEHRERE
     -----------------------------------------------------------------
     Die Pruefbuehne hat acht Plaetze: 1 Alex (ich), 2 Bea, 3 Cem,
     4 Dana, 5 Emmi, 6-8 frei.
     ================================================================= */
  console.log("\nDie Salve");
  const pfeilAuf = async (wen) => {
    await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
    await pg.evaluate((w) => window.DMA_PRUEFUNG.wirkung("saugpfeil", w, "Alex"), wen);
    await new Promise((f) => setTimeout(f, 540));
    const aus = await pg.evaluate(() => [...document.querySelectorAll(".lc-platz")]
      .filter((p) => p.querySelector(".lc-pfeil")).map((p) => p.dataset.lcPlatz));
    await new Promise((f) => setTimeout(f, 2600));
    return aus;
  };
  const einer = await pfeilAuf("Bea");
  sage(einer.join(",") === "2", "ein Name trifft genau einen Platz", "getroffen: " + einer.join(","));
  const zwei = await pfeilAuf("Bea, Dana");
  sage(zwei.join(",") === "2,4", "zwei Namen mit Komma treffen beide",
    "getroffen: " + zwei.join(","));
  const nummern = await pfeilAuf("2,4");
  sage(nummern.join(",") === "2,4", "und Platznummern gehen genauso",
    "getroffen: " + nummern.join(","));
  const alle = await pfeilAuf("*");
  sage(alle.length === 5, "\u201ealle\u201c trifft weiterhin jeden besetzten Platz",
    alle.length + " Plaetze");
  /* Der gefaehrliche Fall: ein leerer Teil in der Kette. Ohne die
     Sperre faende er ueber den Rueckfall ALLE — aus der Salve wuerde
     ein Flaechenbombardement. */
  const luecke = await pfeilAuf("Bea, , Dana");
  sage(luecke.join(",") === "2,4", "eine Luecke in der Kette trifft nicht plötzlich alle",
    "getroffen: " + luecke.join(","));

  /* =================================================================
     2. DER HAMMER — FUENF STUFEN STATT ZUFALL
     -----------------------------------------------------------------
     ACHTUNG, HIER STAND FRUEHER ETWAS ANDERES. Bis Runde 85 entschied
     ein LOS, ob die Scheibe zerspringt („Hammer mit Zufall und
     Glasbruch"), und genau das hat Xander in Runde 86 zurueckgenommen:
     „Bei dem Hammer moechte ich den Zufallsmodus raus haben. Wenn man
     einmal schlaegt, passiert noch nix. Beim zweiten Mal hoert man
     schon so ein erstes Knack, beim dritten Mal platzt dann die
     Scheibe und beim vierten Mal splittert alles raus. Wenn man noch
     ein fuenftes Mal drauf schlaegt, demoliert man das Profilbild
     immer mehr."
     Gemessen wird deshalb jetzt die TREPPE, nicht mehr das Los.
     ================================================================= */
  console.log("\nDer Hammer in fuenf Stufen");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  const stufen = [];
  for (let i = 0; i < 6; i++) {
    await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("hammer", "Bea", "Alex", {}));
    await new Promise((f) => setTimeout(f, 800));
    stufen.push(await pg.evaluate(() => {
      const pl = document.querySelectorAll(".lc-platz")[1];
      const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
      const sch = pl.querySelector(".lc-hschaden");
      const r = sch ? sch.getBoundingClientRect() : null;
      return {
        sterne: pl.querySelectorAll(".lc-zhammer-stern").length,
        fein: pl.querySelectorAll(".lc-hriss-fein").length,
        risse: pl.querySelectorAll(".lc-hriss").length,
        loch: pl.querySelectorAll(".lc-hloch").length,
        stueck: pl.querySelectorAll(".lc-hstueck").length,
        scherbe: pl.querySelectorAll(".lc-hscherbe").length,
        demoliert: pl.classList.contains("lc-platz-demoliert"),
        form: [...pl.querySelectorAll(".lc-hriss")].map((x) => x.getAttribute("d")).join("|"),
        deckt: r ? [r.width - k.width, r.height - k.height,
                    r.left - k.left, r.top - k.top].map((x) => Math.round(x)) : null
      };
    }));
    /* Die Effektschicht ist nach 3 s weg — der Schaden darf es nicht
       sein, sonst gaebe es keine Steigerung. */
    await new Promise((f) => setTimeout(f, 2600));
    stufen[i].bleibt = await pg.evaluate(() =>
      document.querySelectorAll(".lc-platz")[1].querySelectorAll(".lc-hriss").length);
  }
  sage(stufen[0].sterne === 8 && stufen[0].risse === 0,
    "beim ersten Schlag passiert noch nichts — nur Sterne",
    stufen[0].sterne + " Sterne, " + stufen[0].risse + " Risse");
  sage(stufen[1].fein === 2 && stufen[1].risse === 2 && stufen[1].sterne === 0,
    "beim zweiten Mal das erste Knack: zwei feine Risse",
    stufen[1].risse + " Risse");
  sage(stufen[2].risse > 8 && stufen[2].loch === 0,
    "beim dritten Mal platzt die Scheibe",
    stufen[2].risse + " Risse, " + stufen[2].loch + " Loecher");
  sage(stufen[3].loch >= 6 && stufen[3].scherbe >= 6,
    "beim vierten Mal splittert es heraus",
    stufen[3].loch + " Loecher, " + stufen[3].scherbe + " fliegende Scherben");
  sage(stufen[4].stueck >= 2 && stufen[4].demoliert
    && stufen[5].stueck > stufen[4].stueck,
    "ab dem fuenften Mal wird das Bild selbst demoliert, und zwar immer mehr",
    "Stufe 5: " + stufen[4].stueck + " Stuecke, Stufe 6: " + stufen[5].stueck);
  sage(stufen.slice(1).every((s2) => s2.bleibt === s2.risse),
    "der Schaden bleibt zwischen den Schlaegen liegen",
    stufen.map((s2) => s2.bleibt).join(" / ") + " Risse nach je 3,4 s");
  sage(stufen[2].deckt && stufen[2].deckt.every((x) => Math.abs(x) <= 1),
    "die Risse bleiben IM Profilbild",
    stufen[2].deckt ? "Schadensschicht gegen Bild " + stufen[2].deckt.join(" / ") + " px"
                    : "keine Schicht");
  /* Kein Zufall mehr heisst: derselbe Name ergibt ueberall dasselbe
     Muster — ohne dass irgendein Los mitgeschickt werden muss. */
  const js82 = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  sage(/function lcHammerSaat/.test(js82) && !/const glas = wurf/.test(js82),
    "das Muster kommt aus dem Namen, nicht mehr aus einem Los");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => {
    window.DMA_PRUEFUNG.wirkung("hammer", "Cem", "Alex", {});
    window.DMA_PRUEFUNG.wirkung("hammer", "Cem", "Alex", {});
    window.DMA_PRUEFUNG.wirkung("hammer", "Cem", "Alex", {});
  });
  await new Promise((f) => setTimeout(f, 900));
  const cem1 = await pg.evaluate(() =>
    [...document.querySelectorAll(".lc-platz")[2].querySelectorAll(".lc-hriss")]
      .map((x) => x.getAttribute("d")).join("|"));
  sage(cem1.length > 0 && cem1 !== stufen[2].form,
    "und zwei verschiedene Namen bekommen verschiedene Risse");

  /* =================================================================
     3. KATAPULT GROESSER
     ================================================================= */
  console.log("\nKatapult");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("katapult", "Bea", "Alex"));
  await new Promise((f) => setTimeout(f, 700));
  const kata = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[1];
    const b = pl.querySelector(".lc-katapult-bild");
    if (!b) return null;
    const r = b.getBoundingClientRect();
    const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
    return { anteil: r.width / k.width, breit: Math.round(r.width), bild: Math.round(k.width) };
  });
  sage(kata && kata.anteil > 1.35,
    "das Katapult ist groesser als vorher (war 1,20 Bildbreiten)",
    kata ? kata.breit + " px = " + kata.anteil.toFixed(2) + " Bildbreiten (Bild "
      + kata.bild + " px)" : "nicht gefunden");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  /* ACHTUNG, AUCH HIER STAND FRUEHER ETWAS ANDERES: „und es bleibt
     dabei mittig ueber dem Platz". Genau das hat Xander in Runde 86
     zurueckgenommen: „der Katapult nimmt das Profilbild immer noch
     nicht als Ladung auf … das kommt dann von links, von rechts, wo
     man links sitzt." Mittig kann es nicht stehen, wenn seine SCHALE
     auf dem Bild liegen soll — sie sitzt beim gespannten Arm 75 % der
     Geraetebreite rechts. Gemessen wird deshalb jetzt, dass das
     Geraet ueberhaupt zur Seite ruecken kann (--kataseite) und dabei
     seine Groesse behaelt. */
  sage(/\.lc-katapult-bild \{[\s\S]{0,240}?width: 164%;/.test(css)
    && /margin-left: calc\(-82% \+ var\(--kataseite, 0%\)\);/.test(css),
    "und es rueckt zur Seite des Werfenden, damit seine Schale auf dem Bild liegt");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
