#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 97 — EINE HAUT FUER ALLE HAENDE, UND KEINE MODULE MEHR
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Du hast die Hand noch nicht vereinheitlicht."
   XANDER (22.09.2026): „Wie greift eine Hand realistisch, ohne dass sie
   nach einer Roboter Hand aussieht, ohne dass sie nach einer Hand
   bestehend aus einzelnen Modulen aussieht. Eine durchgaengige Hand
   mit Fingern."

   ZWEI DINGE WERDEN GEMESSEN, und beide am laufenden Bild:

   1. DIE HAUT. Es gab zwei Familien im Haus: #e9bda6 (Ohrfeige,
      Basketball, Streicheln) und #eec0a8 (Riesenhand, Klaps, Popo),
      dazu die Hut-Hand mit ihrer eigenen, oranger Haut (#e0a87a).
      Jetzt kommt jede Flaeche aus EINER Quelle — den Werten --lc-haut,
      --lc-haut-hell, --lc-haut-kante, --lc-haut-schatten und
      --lc-haut-tief. Geprueft wird nicht der Quelltext, sondern was
      der Browser am Ende wirklich zeichnet: jede Hautflaeche muss
      einen dieser Werte tragen.

   2. DIE FINGER. Jedes Fingerglied war eine geschlossene Kapsel mit
      einer Umrisslinie RINGSHERUM; an jedem Gelenk lagen damit zwei
      Linien uebereinander — das ist der Ring, an dem man ein Modul
      erkennt. Jetzt hat jedes Glied eine Fuellung OHNE Kante und eine
      Kante OHNE Deckel. Geprueft wird: kein Glied traegt beides.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
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
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\nDIE HAUT — WAS DER BROWSER WIRKLICH ZEICHNET\n");
  const mess = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    /* Alle Haende gleichzeitig auf die Buehne — nur so sieht man,
       ob sie nebeneinander zusammenpassen. Die Riesenhand traegt
       jemanden weg, die anderen wirken auf einen Platz. */
    window.DMA_PRUEFUNG.wirkung("gotteshand", "Cem", "Alex", {});
    window.DMA_PRUEFUNG.wirkung("klaps", "Bea", "Alex", {});
    window.DMA_PRUEFUNG.wirkung("hut", "Dana", "Alex", {});
    window.DMA_PRUEFUNG.wirkung("ohrfeige", "Emmi", "Alex", {});
    window.DMA_PRUEFUNG.wirkung("streicheln", "Bea", "Alex", {});
    window.DMA_PRUEFUNG.wirkung("basketball", "Cem", "Alex", {});
    await new Promise((f) => setTimeout(f, 1400));

    const wurzel = getComputedStyle(document.documentElement);
    const inRgb = (wert) => {
      const d = document.createElement("span");
      d.style.color = wert.trim();
      document.body.appendChild(d);
      const r = getComputedStyle(d).color;
      d.remove();
      return r;
    };
    const quelle = {};
    ["--lc-haut", "--lc-haut-hell", "--lc-haut-kante",
     "--lc-haut-schatten", "--lc-haut-tief"].forEach((n) => {
      quelle[n] = inRgb(wurzel.getPropertyValue(n) || "#000");
    });
    const erlaubt = Object.keys(quelle).map((n) => quelle[n]);

    const haende = [".lc-riesenhand", ".lc-klaps-hand", ".lc-hut-hand",
      ".lc-ohrfeige-hand", ".lc-streichel-hand", ".lc-basket-hand"];
    const gefunden = {}, fremd = [];
    haende.forEach((wahl) => {
      const el = document.querySelectorAll(wahl);
      gefunden[wahl] = el.length;
      el.forEach((svg) => {
        svg.querySelectorAll("path, circle, ellipse, rect, stop").forEach((f) => {
          ["fill", "stroke", "stop-color"].forEach((eig) => {
            const roh = f.getAttribute(eig);
            if (!roh || roh === "none" || roh.indexOf("url(") === 0) return;
            if (roh.indexOf("rgba(") === 0 || roh.indexOf("#8d5fa8") === 0
              || roh.indexOf("#6d4685") === 0) return;  /* Manschette, Hemd */
            const r = inRgb(roh);
            if (erlaubt.indexOf(r) < 0) fremd.push(wahl + " " + eig + "=" + roh);
          });
        });
      });
    });

    /* Die Fingerglieder: traegt ein Pfad Fuellung UND Kante?
       RUNDE 99 NACHGEZOGEN: die Hand wird jetzt ZWEIMAL gezeichnet —
       unten die etwas groessere dunkle Silhouette, darueber die
       Fuellung. Die Silhouette DARF und MUSS beides tragen, sie ist ja
       der Umriss der ganzen Hand. Worum es dieser Regel geht, ist der
       Ring um das Gelenk — und der entstuende nur, wenn ein SICHTBARES
       Glied seine eigene Kante traegt. Gemessen wird deshalb der
       Fuelldurchgang; dass die Silhouette unter ihm liegt und sich
       mitbewegt, prueft werkzeug/pruefe-runde99-haende.js nach. */
    let glieder = 0, beides = 0, ueberlappt = 0, gelenke = 0;
    let silhouette = 0;
    document.querySelectorAll(".lc-rh-fuell .lc-rhand-finger path").forEach((f) => {
      const hatF = f.getAttribute("fill") && f.getAttribute("fill") !== "none";
      const hatK = f.getAttribute("stroke") && f.getAttribute("stroke") !== "none";
      if (hatF || hatK) glieder++;
      if (hatF && hatK) beides++;
    });
    document.querySelectorAll(".lc-rh-kante .lc-rhand-finger path").forEach((f) => {
      const hatF = f.getAttribute("fill") && f.getAttribute("fill") !== "none";
      const hatK = f.getAttribute("stroke") && f.getAttribute("stroke") !== "none";
      if (hatF && hatK) silhouette++;
    });
    /* Und greift jedes Glied nach oben unter das vorige? Der oberste
       Punkt des Fuellpfades muss ueber dem Drehpunkt seines Gelenks
       liegen. */
    document.querySelectorAll(".lc-rh-fuell .lc-rf-pip, .lc-rh-fuell .lc-rf-dip").forEach((g) => {
      const ur = (g.getAttribute("style") || "").match(/transform-origin:\s*[\d.]+px\s+([\d.]+)px/);
      const p = g.querySelector("path");
      if (!ur || !p) return;
      const d = p.getAttribute("d") || "";
      const erst = d.match(/^M([\d.-]+) ([\d.-]+)/);
      if (!erst) return;
      gelenke++;
      if (Number(erst[2]) < Number(ur[1])) ueberlappt++;
    });

    return { quelle: quelle, fremd: fremd, gefunden: gefunden,
      glieder: glieder, beides: beides, gelenke: gelenke, ueberlappt: ueberlappt,
      silhouette: silhouette };
  });

  Object.keys(mess.quelle).forEach((n) => console.log("  " + n + " = " + mess.quelle[n]));
  console.log("");
  Object.keys(mess.gefunden).forEach((n) =>
    sage(mess.gefunden[n] > 0, "die Zeichnung " + n + " ist auf der Buehne",
      mess.gefunden[n] + " Stueck"));
  sage(mess.fremd.length === 0,
    "und jede Hautflaeche kommt aus derselben Quelle",
    mess.fremd.length ? mess.fremd.slice(0, 6).join(" | ") : "keine fremde Farbe");

  console.log("\nDIE FINGER — DURCHGEHEND ODER AUS MODULEN?\n");
  sage(mess.glieder > 0, "die Fingerglieder sind gezeichnet", mess.glieder + " Pfade");
  sage(mess.silhouette > 0,
    "unter der Hand liegt eine durchgehende dunkle Silhouette",
    mess.silhouette + " Teile im Kantendurchgang");
  sage(mess.beides === 0,
    "kein SICHTBARES Glied traegt Fuellung UND Kante — kein Ring ums Gelenk",
    mess.beides + " mit beidem");
  sage(mess.gelenke > 0 && mess.ueberlappt === mess.gelenke,
    "und jedes Glied greift nach oben unter das vorige",
    mess.ueberlappt + " von " + mess.gelenke);

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
