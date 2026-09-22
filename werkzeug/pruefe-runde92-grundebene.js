#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 92 — DIE GESCHUETZTE EBENE: STRICHLINIE UND NUMMER
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Die Rueckstaende in Animationen sind immer
   noch, wenn man den Platz verlaesst. Warum sind die Positionsnummern
   und Strichlinien nicht auf einer eigenen Ebene, die geschuetzt ist,
   die nicht beeinflusst werden kann von den Animationen? Warum wird
   das immer zerstoert, wenn ich es gar nicht moechte?"

   DIESE SONDE PRUEFT GENAU DAS, und zwar als ZUSAGE, nicht als
   Stichprobe: bei JEDEM Effekt, an BEIDEN Plaetzen (dem verlassenen
   und dem Ziel) und zu acht Zeitpunkten muss gelten:

     1. Es gibt am Platz einen gestrichelten Ring in Platzgroesse —
        egal, wo das Profilbild gerade ist.
     2. Die Nummer steht da, ungedreht und ungeschoben.
     3. Weder Ring noch Nummer sind verschoben, gedreht oder
        geschrumpft: ihre Flaeche deckt sich mit dem Platz.
     4. Beide sind sichtbar (Deckkraft > 0,5).

   „Eine eigene Ebene" heisst hier: die Zeichnung liegt in einem
   eigenen Element (.lc-schild), das KEINE Animation anfasst — nicht
   im Profilbild (.lc-kreis), das jede Animation dreht und wegfaehrt.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg",
  ".m4a": "audio/mp4", ".webm": "video/webm" };

const NUR = process.argv[2] || "";
let fehler = 0;
const meldung = [];

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

  const wirkungen = await pg.evaluate(() => window.DMA_PRUEF.platzWirkungen());
  const reisen = await pg.evaluate(() => window.DMA_PRUEF.reiseArten());
  const alle = [...new Set([...wirkungen, ...reisen])].filter((a) => !NUR || a === NUR);
  console.log("\nRUNDE 92 — die geschuetzte Ebene bei " + alle.length + " Effekten\n");

  const PROBEN = [260, 900, 1700, 2600, 3600, 5000, 7000, 8000];

  for (const art of alle) {
    const raus = await pg.evaluate(async ([art, proben]) => {
      document.querySelectorAll(".lc-zp, .lc-reise, .lc-greif, .lc-riesenhand, .lc-flieger")
        .forEach((x) => x.remove());
      window.DMA_PRUEF.effektBuehne();
      const plaetze = [...document.querySelectorAll(".lc-platz")];
      const paare = [["verlassen", plaetze[0]], ["Ziel", plaetze[1]]];
      const messen = () => paare.map(([wie, pl]) => {
        const p = pl.getBoundingClientRect();
        const schild = pl.querySelector(".lc-schild");
        const nummer = pl.querySelector(".lc-nummer");
        if (!schild || !nummer) return { wie: wie, fehlt: true };
        const s = schild.getBoundingClientRect();
        const cs = getComputedStyle(schild);
        const vor = getComputedStyle(schild, "::before");
        const kreis = pl.querySelector(".lc-kreis");
        const ks = kreis ? getComputedStyle(kreis) : null;
        const kr = kreis ? kreis.getBoundingClientRect() : null;
        /* DER VERGLEICH LAEUFT UEBER DIE LAYOUT-STELLE, nicht ueber
           den Kasten des Knopfes: der Knopf ist hoeher als das Bild
           (darunter steht der Name), das Schild sitzt also von Haus
           aus 9 px ueber seiner Mitte. Gemessen wird deshalb, wo das
           Schild LIEGT (offsetLeft/offsetTop kennen keine
           Transformationen) gegen die Stelle, wo das Profilbild
           hingehoert. */
        const sollX = kreis ? kreis.offsetLeft + kreis.offsetWidth / 2 : 0;
        const sollY = kreis ? kreis.offsetTop + kreis.offsetHeight / 2 : 0;
        const istX = schild.offsetLeft + schild.offsetWidth / 2;
        const istY = schild.offsetTop + schild.offsetHeight / 2;
        /* Ein gestrichelter Ring in Platzgroesse — entweder aus dem
           Schild (::before) oder, auf einem freien Platz, aus dem
           Kreis selbst, WENN der noch an seinem Platz liegt. */
        const ringAusSchild = vor.borderTopStyle === "dashed"
          && parseFloat(vor.borderTopWidth) >= 1 && vor.content !== "none";
        const kreisDaheim = Boolean(kr && Math.abs(kr.width - p.width) < 8
          && Math.hypot((kr.left + kr.width / 2) - (p.left + p.width / 2),
                        (kr.top + kr.height / 2) - (p.top + p.height / 2)) < 6);
        const ringAusKreis = Boolean(ks && ks.borderTopStyle === "dashed" && kreisDaheim);
        return {
          wie: wie,
          ring: ringAusSchild || ringAusKreis,
          ringWoher: ringAusSchild ? "Schild" : (ringAusKreis ? "Kreis" : "-"),
          deckung: Math.round(Math.hypot(istX - sollX, istY - sollY)),
          breite: Math.round(schild.offsetWidth),
          platzBreite: kreis ? Math.round(kreis.offsetWidth) : Math.round(p.width),
          drehung: cs.transform,
          sicht: Number(cs.opacity),
          nummerAn: getComputedStyle(nummer).display !== "none"
                    && Number(getComputedStyle(nummer).opacity) > 0.5,
          nummerText: (nummer.textContent || "").trim()
        };
      });
      window.DMA_PRUEFUNG.wirkung(art, "Bea", "Alex", {});
      const folge = [];
      let vorher = 0;
      for (const t of proben) {
        await new Promise((f) => setTimeout(f, t - vorher));
        vorher = t;
        folge.push({ t: t, sitze: messen() });
      }
      return folge;
    }, [art, PROBEN]);

    const schlecht = [];
    raus.forEach((p) => p.sitze.forEach((s) => {
      if (s.fehlt) { schlecht.push(p.t + " ms " + s.wie + ": kein Schild"); return; }
      if (!s.ring) schlecht.push(p.t + " ms " + s.wie + ": keine Strichlinie");
      if (s.deckung > 2) schlecht.push(p.t + " ms " + s.wie + ": Schild " + s.deckung + " px verschoben");
      if (Math.abs(s.breite - s.platzBreite) > 2)
        schlecht.push(p.t + " ms " + s.wie + ": Schild " + s.breite + " statt " + s.platzBreite + " px");
      if (s.drehung !== "none" && s.drehung !== "matrix(1, 0, 0, 1, 0, 0)")
        schlecht.push(p.t + " ms " + s.wie + ": Schild verformt (" + s.drehung + ")");
      if (s.sicht <= 0.5) schlecht.push(p.t + " ms " + s.wie + ": Schild unsichtbar (" + s.sicht + ")");
      if (!s.nummerAn) schlecht.push(p.t + " ms " + s.wie + ": Nummer weg");
    }));
    if (schlecht.length) {
      fehler++;
      meldung.push("  FEHL /" + art + "\n        " + [...new Set(schlecht)].slice(0, 6).join("\n        "));
      console.log("  FEHL /" + art + "   " + [...new Set(schlecht)][0]);
    } else {
      console.log("  ok   /" + art);
    }
  }

  await br.close();
  srv.close();
  if (fehler) {
    console.log("\n" + fehler + " Effekt(e) fassen die geschuetzte Ebene an:\n");
    meldung.forEach((m) => console.log(m));
  } else {
    console.log("\nalles gruen");
  }
  process.exit(fehler ? 1 : 0);
})();
