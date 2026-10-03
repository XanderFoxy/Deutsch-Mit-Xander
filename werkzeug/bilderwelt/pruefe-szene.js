#!/usr/bin/env node
/* Prüft eine Bilderwelt-Szene (FASSUNG 851): Ist jedes Ding antippbar?
   node werkzeug/bilderwelt/pruefe-szene.js <szenen-datei.js>
   Für jedes Teil wird ein feines Raster über seine Fläche gelegt und gezählt,
   wie viele Punkte beim Antippen wirklich DIESES Teil treffen (und nicht ein
   anderes, das davor liegt). Unter-Teile werden im Lupenmodus geprüft.
   Ein Teil gilt als gut erreichbar, wenn mindestens 12 Rasterpunkte (≈ eine
   Fingerkuppe auf dem Telefon) es treffen. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const fs = require("fs");
const datei = process.argv[2];
const w = {}; new Function("window", fs.readFileSync(datei, "utf8"))(w);
const sz = Object.values(w.DMA_SZENE)[0];
const g = (t, unter) => `<g data-bw-teil="${t.id}"${t.oben ? ' data-bw-oben="1"' : ""} transform="translate(${t.x},${t.y})"><g class="bw-kunst">${t.kunst || ""}</g></g>`;
/* Wie in der App (app.js, Trefferebenen; korrekturen.css: .bw-flaeche fängt nichts):
   unter den Zeichnungen je Ding ein Rechteck (mindestens fingerbreit, groß
   zuunterst), über allem ein Rechteck für die Dinge mit „oben“. */
const APP_EBENEN = `(() => {
  const svg = document.getElementById("s"), ns = "http://www.w3.org/2000/svg";
  const MINDEST = Math.max(14, Math.round(${0} + svg.viewBox.baseVal.width * 0.055));
  const kasten = (g) => { const k = g.getBBox(); const m = (g.getAttribute("transform") || "").match(/translate\\(([-\\d.]+),\\s*([-\\d.]+)\\)/);
    return { id: g.dataset.bwTeil, x: (m ? +m[1] : 0) + k.x, y: (m ? +m[2] : 0) + k.y, w: k.width, h: k.height, gross: k.width * k.height }; };
  const rechteck = (o) => { const f = document.createElementNS(ns, "rect"); const b = Math.max(o.w, MINDEST), h = Math.max(o.h, MINDEST);
    f.setAttribute("x", o.x + o.w / 2 - b / 2); f.setAttribute("y", o.y + o.h / 2 - h / 2); f.setAttribute("width", b); f.setAttribute("height", h);
    f.setAttribute("fill", "transparent"); f.setAttribute("data-bw-treff", o.id); return f; };
  const ebene = document.createElementNS(ns, "g");
  [...svg.querySelectorAll("[data-bw-teil]")].map(kasten).filter((o) => o.w > 0).sort((a, b) => b.gross - a.gross).forEach((o) => ebene.appendChild(rechteck(o)));
  svg.insertBefore(ebene, svg.querySelector("[data-bw-teil]"));
  const dach = document.createElementNS(ns, "g");
  [...svg.querySelectorAll("[data-bw-teil][data-bw-oben]")].map(kasten).filter((o) => o.w > 0).sort((a, b) => b.gross - a.gross).forEach((o) => dach.appendChild(rechteck(o)));
  svg.appendChild(dach);
})();`;
const seite = (teile) => `<!doctype html><html><head><style>.bw-flaeche{pointer-events:none}</style></head><body style="margin:0"><svg id="s" viewBox="0 0 ${sz.breite} ${sz.hoehe}" width="${sz.breite * 4}" height="${sz.hoehe * 4}">
<g pointer-events="none">${sz.kulisse}</g>${teile.map((t) => g(t)).join("")}${sz.vorne ? `<g pointer-events="none">${sz.vorne}</g>` : ""}</svg><script>${APP_EBENEN}</script></body></html>`;
(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: sz.breite * 4, height: sz.hoehe * 4 } });
  const messen = async (teile, liste) => {
    await pg.setContent(seite(teile));
    return pg.evaluate((ids) => ids.map((id) => {
      const el = document.querySelector(`[data-bw-teil="${id}"]`);
      const b = el.getBoundingClientRect();
      let treffer = 0, gesamt = 0;
      for (let x = Math.max(0, b.left); x < Math.min(innerWidth, b.right); x += 4) for (let y = Math.max(0, b.top); y < Math.min(innerHeight, b.bottom); y += 4) {
        gesamt++;
        const e = document.elementFromPoint(x, y);
        const t = e && e.closest && e.closest("[data-bw-teil]");
        const getroffen = e && e.getAttribute && e.getAttribute("data-bw-treff") || (t && t.getAttribute("data-bw-teil"));
        if (getroffen === id) treffer++;
      }
      return { id, treffer, gesamt, box: [Math.round(b.left / 4), Math.round(b.top / 4), Math.round(b.width / 4), Math.round(b.height / 4)] };
    }), liste);
  };
  const oben = await messen(sz.teile, sz.teile.map((t) => t.id));
  const unter = [];
  for (const t of sz.teile.filter((t) => t.unter)) unter.push(...(await messen([...sz.teile, ...t.unter], t.unter.map((u) => u.id))).map((u) => Object.assign(u, { in: t.id })));
  let schlecht = 0;
  for (const m of [...oben, ...unter]) {
    const ok = m.treffer >= 12;
    if (!ok) schlecht++;
    console.log((ok ? "  ok   " : "  FEHL ") + (m.in ? "  " + m.in + " › " : "") + m.id.padEnd(20) + " " + String(m.treffer).padStart(5) + " Treffer  Fläche " + m.box.join(","));
  }
  console.log(schlecht ? schlecht + " Teile schlecht erreichbar" : "alle Teile gut erreichbar");
  await br.close();
  process.exit(schlecht ? 1 : 0);
})();
