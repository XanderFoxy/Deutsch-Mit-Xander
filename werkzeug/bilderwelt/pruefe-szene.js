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
/* FASSUNG 878 — wie app.js bwBildHtml: Teile mit „lupe" tragen ihre Marke (Fangkreis r 15 bei 16/−16);
   in der Lupe nur die Unter-Teile, verkleinert um 1/k, damit sie fingerbreit bleibt. */
const marke = (t, k) => `<g class="bw-lupenmarke" data-bw-lupe-sofort="${t.lupe}"${k > 1 ? ` transform="scale(${(1 / k).toFixed(3)})"` : ""}><circle class="bw-lupen-tipp" cx="16" cy="-16" r="15" fill="transparent"/></g>`;
const g = (t, mitMarke, k) => `<g data-bw-teil="${t.id}"${t.oben ? ' data-bw-oben="1"' : ""} transform="translate(${t.x},${t.y})"><g class="bw-kunst">${t.kunst || ""}</g>${t.lupe && mitMarke ? marke(t, k) : ""}</g>`;
/* Wie in der App (app.js, Trefferebenen; korrekturen.css: .bw-flaeche fängt nichts):
   unter den Zeichnungen je Ding ein Rechteck (mindestens fingerbreit, groß
   zuunterst), über allem ein Rechteck für die Dinge mit „oben“. */
const APP_EBENEN = (k) => `(() => {
  const svg = document.getElementById("s"), ns = "http://www.w3.org/2000/svg";
  const MINDEST = Math.max(14, Math.round(svg.viewBox.baseVal.width * 0.055)) / ${k};   /* FASSUNG 852: wie app.js in der Lupe */
  const kasten = (g) => { const k = (g.querySelector(":scope > .bw-kunst") || g).getBBox(); const m = (g.getAttribute("transform") || "").match(/translate\\(([-\\d.]+),\\s*([-\\d.]+)\\)/);
    return { id: g.dataset.bwTeil, x: (m ? +m[1] : 0) + k.x, y: (m ? +m[2] : 0) + k.y, w: k.width, h: k.height, gross: k.width * k.height }; };
  const rechteck = (o) => { const f = document.createElementNS(ns, "rect"); const b = Math.max(o.w, MINDEST), h = Math.max(o.h, MINDEST);
    f.setAttribute("x", o.x + o.w / 2 - b / 2); f.setAttribute("y", o.y + o.h / 2 - h / 2); f.setAttribute("width", b); f.setAttribute("height", h);
    f.setAttribute("fill", "transparent"); f.setAttribute("data-bw-treff", o.id); return f; };
  const ebene = document.createElementNS(ns, "g");
  const bildFl = svg.viewBox.baseVal.width * svg.viewBox.baseVal.height;   /* FASSUNG 878 — wie app.js (877): Teile über 8 % des Bildes bekommen kein Ersatzrechteck */
  [...svg.querySelectorAll("[data-bw-teil]")].map(kasten).filter((o) => o.w > 0 && o.gross <= bildFl * 0.08).sort((a, b) => b.gross - a.gross).forEach((o) => ebene.appendChild(rechteck(o)));
  const heim = svg.querySelector("[data-bw-teil]").parentNode; heim.insertBefore(ebene, heim.querySelector("[data-bw-teil]"));
  const dach = document.createElementNS(ns, "g");
  [...svg.querySelectorAll("[data-bw-teil][data-bw-oben]")].map(kasten).filter((o) => o.w > 0).sort((a, b) => b.gross - a.gross).forEach((o) => dach.appendChild(rechteck(o)));
  /* FASSUNG 852: wie app.js — über den Rändern die echten Umrisse, groß unten, klein oben */
  [...svg.querySelectorAll("[data-bw-teil][data-bw-oben]")].map(kasten).filter((o) => o.w > 0).sort((a, b) => b.gross - a.gross).forEach((o) => { const f = document.createElementNS(ns, "rect"); f.setAttribute("x", o.x); f.setAttribute("y", o.y); f.setAttribute("width", o.w); f.setAttribute("height", o.h); f.setAttribute("fill", "transparent"); f.setAttribute("data-bw-treff", o.id); dach.appendChild(f); });
  heim.appendChild(dach);
  /* FASSUNG 878 — wie app.js (877): Markenkreise ganz oben, sie gewinnen immer */
  const heimInv = heim.getCTM().inverse(), mdach = document.createElementNS(ns, "g");
  mdach.setAttribute("class", "bw-marken-dach");
  svg.querySelectorAll(".bw-lupenmarke .bw-lupen-tipp").forEach((c) => {
    const mm = heimInv.multiply(c.getCTM()), kr = document.createElementNS(ns, "circle");
    kr.setAttribute("cx", 16); kr.setAttribute("cy", -16); kr.setAttribute("r", 15); kr.setAttribute("fill", "transparent");
    kr.setAttribute("transform", "matrix(" + [mm.a, mm.b, mm.c, mm.d, mm.e, mm.f].join(" ") + ")");
    kr.setAttribute("data-bw-marke", c.closest("[data-bw-teil]").dataset.bwTeil);
    mdach.appendChild(kr);
  });
  heim.appendChild(mdach);
})();`;
const seite = (teile, zoom, unterIds) => {
  /* FASSUNG 852 — in der Lupe vergrößert die App die ganze Szene (app.js bwBildHtml: k = min(b/w, h/h) · 0,76) */
  let k = 1, tr = "";
  if (zoom) { k = Math.min(sz.breite / zoom.w, sz.hoehe / zoom.h) * 0.76; const mx = sz.breite / 2 - (zoom.x + zoom.w / 2) * k, my = sz.hoehe / 2 - (zoom.y + zoom.h / 2) * k; tr = ` transform="translate(${mx.toFixed(2)},${my.toFixed(2)}) scale(${k.toFixed(3)})"`; }
  return `<!doctype html><html><head><style>.bw-flaeche{pointer-events:none}</style></head><body style="margin:0"><svg id="s" viewBox="0 0 ${sz.breite} ${sz.hoehe}" width="${sz.breite * 4}" height="${sz.hoehe * 4}"><g${tr}>
<g pointer-events="none">${sz.kulisse}</g>${teile.map((t) => g(t, zoom ? (unterIds || []).includes(t.id) : true, k)).join("")}${sz.vorne ? `<g pointer-events="none">${sz.vorne}</g>` : ""}</g></svg><script>${APP_EBENEN(k)}</script></body></html>`;
};
(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: sz.breite * 4, height: sz.hoehe * 4 } });
  const messen = async (teile, liste, zoom) => {
    await pg.setContent(seite(teile, zoom, zoom ? liste : null));
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
  /* FASSUNG 878 — Markenkreise (Karten-Kritik R3): Die Mitte muss die eigene Marke treffen, und der Kreis
     darf kein fremdes kleines Teil zudecken (sonst öffnet ein Tipp auf Saudi-Arabien Ägypten). Große Flächen
     (über 8 %: Meere, Kontinente, Himmel) und das eigene Bild werden nur als Hinweis gemeldet. */
  const markenPruefen = () => pg.evaluate(() => {
    const svg = document.getElementById("s"), bildFl = svg.viewBox.baseVal.width * svg.viewBox.baseVal.height;
    const gross = {}; svg.querySelectorAll("[data-bw-teil]").forEach((g) => { const k = (g.querySelector(":scope > .bw-kunst") || g).getBBox(); gross[g.dataset.bwTeil] = k.width * k.height > bildFl * 0.08; });
    const dach = svg.querySelector(".bw-marken-dach"); if (!dach) return [];
    const kreise = [...dach.children];
    const mitte = kreise.map((c) => { const b = c.getBoundingClientRect(), e = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return e === c; });
    dach.style.pointerEvents = "none"; [...dach.children].forEach((c) => (c.style.pointerEvents = "none"));
    svg.querySelectorAll(".bw-lupenmarke").forEach((m) => (m.style.pointerEvents = "none"));   /* gemessen wird, was UNTER der Marke liegt */
    const aus = kreise.map((c, i) => {
      const id = c.dataset.bwMarke, b = c.getBoundingClientRect(), r = b.width / 2, cx = b.left + r, cy = b.top + r, unter = {};
      let n = 0;
      for (let x = cx - r; x <= cx + r; x += 3) for (let y = cy - r; y <= cy + r; y += 3) {
        if ((x - cx) ** 2 + (y - cy) ** 2 > r * r) continue;
        n++;
        const e = document.elementFromPoint(x, y), t = e && e.closest && e.closest("[data-bw-teil]");
        /* nur die ZEICHNUNG zählt als zugedeckt; ein Fangrechteck daneben darf die Marke überlagern */
        const hit = t && !(e.getAttribute && e.getAttribute("data-bw-treff")) ? t.dataset.bwTeil : "";
        if (hit) unter[hit] = (unter[hit] || 0) + 1;
      }
      const anteil = Object.entries(unter).map(([h, z]) => [h, Math.round(100 * z / n)]).filter(([, a]) => a >= 3).sort((a, b) => b[1] - a[1]);
      return { id, mitte: mitte[i], fremd: anteil.filter(([h]) => h !== id && !gross[h]), gross: anteil.filter(([h]) => h !== id && gross[h]), eigen: (anteil.find(([h]) => h === id) || [, 0])[1] };
    });
    return aus;
  });
  const markenBericht = [];
  const oben = await messen(sz.teile, sz.teile.map((t) => t.id));
  markenBericht.push(...(await markenPruefen()));
  const unter = [];
  for (const t of sz.teile.filter((t) => t.unter)) {
    unter.push(...(await messen([...sz.teile, ...t.unter], t.unter.map((u) => u.id), t.zoom)).map((u) => Object.assign(u, { in: t.id })));
    markenBericht.push(...(await markenPruefen()).map((m) => Object.assign(m, { in: t.id })));
  }
  let schlecht = 0;
  for (const m of markenBericht) {
    m.fremd = m.fremd.filter(([h]) => h !== m.in);   /* in der Lupe ist das vergrößerte Teil selbst der Hintergrund */
    const fehl = !m.mitte || m.fremd.some(([, a]) => a >= 12);
    if (fehl) schlecht++;
    const wo = (m.in ? m.in + " › " : "") + m.id;
    console.log((fehl ? "  MARKE " : "  marke ") + wo.padEnd(24) + (m.mitte ? "" : " Mitte trifft die Marke nicht;") +
      (m.fremd.length ? " deckt Bild von " + m.fremd.map(([h, a]) => h + " " + a + " %").join(", ") + ";" : "") +
      (m.gross.length ? " über " + m.gross.map(([h, a]) => h + " " + a + " %").join(", ") + ";" : "") +
      (m.eigen >= 12 ? " eigenes Bild " + m.eigen + " % (Tipp dort führt direkt hinein)" : ""));
  }
  for (const m of [...oben, ...unter]) {
    const ok = m.treffer >= 12;
    if (!ok) schlecht++;
    console.log((ok ? "  ok   " : "  FEHL ") + (m.in ? "  " + m.in + " › " : "") + m.id.padEnd(20) + " " + String(m.treffer).padStart(5) + " Treffer  Fläche " + m.box.join(","));
  }
  /* FASSUNG 852 — nichts ragt aus dem Bild, und die Datei bleibt klein (Ladezeit hat Vorrang) */
  for (const m of oben) {
    const [x, y, w, h] = m.box, aussen = Math.max(0, -x) + Math.max(0, x + w - sz.breite) + Math.max(0, -y) + Math.max(0, y + h - sz.hoehe);
    if (aussen > 6) { schlecht++; console.log("  RAND " + m.id + " ragt " + aussen + " Einheiten aus dem Bild (" + m.box.join(",") + ")"); }
  }
  /* gemessen wird, was über die Leitung geht (GitHub Pages packt mit gzip) */
  const kb = Math.round(fs.statSync(datei).size / 1024), gz = Math.round(require("zlib").gzipSync(fs.readFileSync(datei)).length / 1024);
  if (gz > 80) { schlecht++; console.log("  GROSS Datei " + kb + " KB, gepackt " + gz + " KB (Ziel gepackt unter 70 KB)"); } else console.log("  Datei " + kb + " KB, gepackt " + gz + " KB");
  console.log(schlecht ? schlecht + " Teile schlecht erreichbar" : "alle Teile gut erreichbar");
  await br.close();
  process.exit(schlecht ? 1 : 0);
})();
