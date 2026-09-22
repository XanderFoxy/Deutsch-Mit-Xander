/* =====================================================================
   SONDE RUNDE 88 — BONGO AUF DEM BILD
   ---------------------------------------------------------------------
   XANDER: „bei der Bongo, bei der Trommel soll man auf dem BILD Bongo
   spielen, nicht auf Bongos — sondern das Bild soll die Bongo-Flaeche
   sein … und wenn ich zum Beispiel bei ‚alle‘ — kannst du die Bongo
   auch mit reinmachen … dann wird auf allen jeweils mit EINER Hand
   immer getrommelt, so also linke und rechte Hand."
   Und, weil es beim ersten Mal nicht geschehen war: „Du sagst, du
   bist mit der Liste fertig, hast die Bongos aber immer noch als
   Bongos im Bild. Du sollst mit den Haenden auf die BILDFLAECHE
   schlagen, nicht auf Bongos."

   Gemessen wird:
   · Es gibt KEINE gezeichneten Trommeln mehr.
   · Die Haende liegen INNERHALB des Profilbildes.
   · Sie schlagen abwechselnd — nicht gleichzeitig.
   · Das Bild federt bei jedem Schlag ein.
   · Und bei „alle" hat jeder Platz genau EINE Hand, im Wechsel.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 88 — Bongo auf dem Bild\n");
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
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  /* =================================================================
     1. KEINE TROMMELN MEHR, UND DIE HAENDE LIEGEN AUF DEM BILD
     ================================================================= */
  console.log("„auf die BILDFLAECHE schlagen, nicht auf Bongos\"\n");
  const js = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  sage(!/class="lc-bongo-fass/.test(js) && !/lc-bongo-fell/.test(js),
    "im Programm wird keine Trommel mehr gezeichnet");
  sage(!/^\.lc-bongo-fass\s*\{/m.test(css) && !/^\.lc-bongo-klein/m.test(css),
    "und im Stilblatt steht auch keine mehr");

  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("bongo", "Cem", "Alex", {}));
  await pg.waitForTimeout(160);
  const einer = await pg.evaluate(() => {
    const s = document.querySelector(".lc-bongo");
    if (!s) return { da: false };
    const platz = s.closest(".lc-platz");
    const kr = platz.querySelector(".lc-kreis").getBoundingClientRect();
    const haende = Array.from(s.querySelectorAll(".lc-bongo-hand")).map((h) => {
      const r = h.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2,
               b: r.width, h: r.height,
               name: h.className.replace("lc-bongo-hand ", "") };
    });
    return { da: true, faesser: s.querySelectorAll(".lc-bongo-fass").length,
             haende: haende, wellen: s.querySelectorAll(".lc-bongo-welle").length,
             kreis: { x: kr.left + kr.width / 2, y: kr.top + kr.height / 2,
                      r: kr.width / 2 },
             fellDreht: (function () {
               const k = platz.querySelector(".lc-kreis");
               return k.classList.contains("lc-bongowippt");
             })() };
  });
  sage(einer.da && einer.faesser === 0, "auf der Buehne steht keine Trommel",
    einer.faesser + " Faesser");
  sage(einer.haende.length === 2, "ein einzelnes Ziel bekommt BEIDE Haende",
    einer.haende.length + " Haende");
  /* Die Haende muessen INNERHALB des Bildkreises liegen — sie schlagen
     ja auf das Bild und nicht daneben. */
  const drin = einer.haende.every((h) =>
    Math.hypot(h.x - einer.kreis.x, h.y - einer.kreis.y) < einer.kreis.r);
  sage(drin, "und beide liegen auf dem Bild, nicht daneben",
    einer.haende.map((h) => Math.round(Math.hypot(h.x - einer.kreis.x, h.y - einer.kreis.y))
      + " px von der Mitte (Radius " + Math.round(einer.kreis.r) + ")").join(", "));
  sage(einer.fellDreht, "und das Bild selbst federt ein — es IST das Fell");
  sage(einer.wellen === 1, "eine Welle laeuft bei jedem Schlag ueber die Flaeche",
    einer.wellen + " Welle(n)");

  /* =================================================================
     2. SIE SCHLAGEN ABWECHSELND
     ================================================================= */
  console.log("\nABWECHSELND, NICHT GLEICHZEITIG\n");
  const hoehen = [];
  for (let i = 0; i < 10; i++) {
    await pg.waitForTimeout(80);
    hoehen.push(await pg.evaluate(() => {
      const l = document.querySelector(".lc-bongo-hand-l");
      const r = document.querySelector(".lc-bongo-hand-r");
      if (!l || !r) return null;
      return { l: Math.round(l.getBoundingClientRect().top),
               r: Math.round(r.getBoundingClientRect().top) };
    }));
  }
  const paare = hoehen.filter(Boolean);
  const unterschiedlich = paare.filter((p) => Math.abs(p.l - p.r) > 4).length;
  sage(unterschiedlich >= Math.ceil(paare.length * 0.5),
    "die beiden Haende stehen meist verschieden hoch — sie klatschen nicht",
    unterschiedlich + " von " + paare.length + " Messpunkten: "
      + paare.map((p) => p.l + "/" + p.r).join(" "));
  await pg.waitForTimeout(2600);

  /* =================================================================
     3. BEI „ALLE" JE EINE HAND
     ================================================================= */
  console.log("\n„dann wird auf allen jeweils mit EINER Hand getrommelt\"\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("bongo", "*", "Alex", {}));
  await pg.waitForTimeout(600);
  const alle = await pg.evaluate(() => {
    const schichten = Array.from(document.querySelectorAll(".lc-bongo"));
    return schichten.map((s) => {
      const h = Array.from(s.querySelectorAll(".lc-bongo-hand"));
      const platz = s.closest(".lc-platz");
      const kr = platz.querySelector(".lc-kreis").getBoundingClientRect();
      const r = h[0] ? h[0].getBoundingClientRect() : null;
      return { nr: platz.dataset.lcPlatz || "?",
               anzahl: h.length,
               seite: h[0] ? (h[0].classList.contains("lc-bongo-hand-l") ? "l" : "r") : "-",
               allein: h[0] ? h[0].classList.contains("lc-bongo-hand-allein") : false,
               mittig: r ? Math.abs((r.left + r.width / 2) - (kr.left + kr.width / 2)) : 999 };
    });
  });
  sage(alle.length >= 4, "alle besetzten Plaetze machen mit", alle.length + " Plaetze");
  sage(alle.every((p) => p.anzahl === 1 && p.allein),
    "und jeder bekommt GENAU EINE Hand",
    alle.map((p) => p.nr + ":" + p.anzahl).join(" "));
  const folge = alle.map((p) => p.seite).join("");
  sage(/^(lr)+l?$|^(rl)+r?$/.test(folge),
    "die Haende wechseln sich reihum ab — links, rechts, links …", folge);
  sage(alle.every((p) => p.mittig < 6),
    "und jede einzelne Hand steht mittig auf ihrem Bild",
    alle.map((p) => Math.round(p.mittig) + " px").join(", "));

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Punkt(e) offen" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
