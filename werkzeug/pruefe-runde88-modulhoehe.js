/* =====================================================================
   SONDE RUNDE 88 — DAS SCHWEBENDE MODUL IST NICHT MEHR BESCHNITTEN
   ---------------------------------------------------------------------
   XANDER: „das Panel, wenn ich die Musik aufrufe und aussuchen möchte,
   das ist übrigens immer noch beschnitten. Wir hatten das schon mal als
   schwebendes Modul so, dass ich es auf dem kleinen Android ganz
   gesehen habe, aber jetzt ist es wieder beschnitten, und ich muss dann
   durchscrollen und sehe nicht das ganze Modul."

   NACHGEMESSEN, und es lag nicht am Panel, sondern an der Liste darin:

     Bildschirm   Panel hoch   erlaubt (72vh)   Liste sichtbar / noetig
     320 x 568    304 px       409 px           261 / 356 px
     360 x 640    337 px       461 px           294 / 356 px
     360 x 740    383 px       533 px           340 / 356 px

   Das Panel hatte auf jedem Geraet ueber hundert Pixel Luft und hat sie
   nicht benutzt, weil „.lc-lese-liste" bei festen 46vh abgeschnitten
   hat. Auf dem kleinen Android fehlte damit ein Viertel der Liste.

   Diese Sonde haelt drei Dinge fest, und zwar auf dem KLEINSTEN Geraet,
   das noch zaehlt (320 x 568 — ein iPhone SE der ersten Reihe):
     1. das Modul passt ganz auf den Schirm,
     2. NICHTS in ihm muss gerollt werden, solange der Inhalt hineinpasst,
     3. und es bleibt innerhalb seiner erlaubten Hoehe.
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
  console.log("RUNDE 88 — das schwebende Modul ganz sehen\n");
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

  for (const [b, h] of [[320, 568], [360, 640], [360, 740]]) {
    const pg = await br.newPage({ viewport: { width: b, height: h } });
    pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
    await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
      { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
      { timeout: 20000 });

    const module = [
      ["Musik für alle", "musik"],
      ["Aufgaben-Tafel", "aufgabe"]
    ];
    for (const [name, welches] of module) {
      const m = await pg.evaluate(async (welches) => {
        /* Die Liederliste wird nachgeladen; ohne sie baut der Waehler
           gar nichts. */
        for (let i = 0; i < 40; i++) {
          let n = 0;
          try { n = ((LiveChat.lieder && LiveChat.lieder()) || []).length; } catch (e) { n = 0; }
          if (n) break;
          await new Promise((f) => setTimeout(f, 100));
        }
        window.DMA_PRUEF.effektBuehne();
        document.getElementById("lcPlatzMenue")?.remove();
        try {
          if (welches === "musik") window.DMA_PRUEF.musikWaehler();
          else window.DMA_AUFGABENWAHL();
        } catch (e) { return { krach: String(e && e.message) }; }
        await new Promise((f) => setTimeout(f, 260));
        const el = document.querySelector(".lc-platzmenue");
        if (!el) return { fehlt: true };
        const r = el.getBoundingClientRect();
        const st = getComputedStyle(el);
        /* Was muss gerollt werden? Alles, was mehr Inhalt hat, als es
           zeigt — das Modul selbst eingeschlossen. */
        const rollt = [el, ...el.querySelectorAll("*")].filter((x) => {
          const s = getComputedStyle(x);
          return /auto|scroll/.test(s.overflowY) && x.scrollHeight > x.clientHeight + 2;
        }).map((x) => (x.className || x.tagName) + " " + x.clientHeight + " von " + x.scrollHeight);
        /* Wie hoch WAERE das Modul, wenn nichts abgeschnitten wuerde?
           Nur daran laesst sich entscheiden, ob es haette hineinpassen
           koennen. */
        let inhalt = parseFloat(st.paddingTop || 0) + parseFloat(st.paddingBottom || 0);
        [...el.children].forEach((k) => { inhalt += k.scrollHeight; });
        return {
          kasten: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)],
          hoch: Math.round(r.height),
          inhalt: Math.round(inhalt),
          rahmenRollt: el.scrollHeight > el.clientHeight + 2,
          erlaubt: Math.round(parseFloat(st.maxHeight) || 0),
          schirm: [innerWidth, innerHeight],
          drin: r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1
                && r.bottom <= innerHeight + 1,
          rollt: rollt
        };
      }, welches);
      const wo = b + " x " + h + "  " + name + ": ";
      if (m.fehlt || m.krach) { sage(false, wo + "das Modul geht auf", m.krach || "es kam keines"); continue; }
      sage(m.drin, wo + "passt ganz auf den Schirm", m.kasten.join(" "));
      /* DIE REGEL, EHRLICH FORMULIERT. Ein Modul mit neun Eintraegen
         braucht 1174 px — das passt auf kein Telefon, und keine
         Rechnung aendert daran etwas. Was er verlangt, ist deshalb
         nicht „nie rollen", sondern:
           · solange der Inhalt in die erlaubte Hoehe passt, rollt gar
             nichts (das ist der Musikwaehler, und genau der war
             beschnitten),
           · passt er nicht, rollt GENAU EINES — die Liste —, und
             niemals der Rahmen, damit die Ueberschrift stehen bleibt. */
      if (m.inhalt <= m.erlaubt + 1) {
        sage(m.rollt.length === 0,
          wo + "der Inhalt passt — also rollt nichts", m.rollt.join("; "));
      } else {
        sage(m.rollt.length === 1,
          wo + "zu viel Inhalt — also rollt GENAU EINES",
          m.rollt.join("; ") || "keines");
        sage(m.rahmenRollt === false,
          wo + "und zwar die Liste, nicht der Rahmen — die Überschrift bleibt stehen");
      }
      sage(!m.erlaubt || m.hoch <= m.erlaubt + 1, wo + "bleibt in seiner erlaubten Höhe",
        m.hoch + " von " + m.erlaubt + " px");
    }
    await pg.close();
  }

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
