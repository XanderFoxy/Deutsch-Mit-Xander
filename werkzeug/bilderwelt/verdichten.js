#!/usr/bin/env node
/* FASSUNG 878 — VERDICHTEN: eine gebaute Szene kleiner machen, ohne dass sich ein Bildpunkt ändert.
   node werkzeug/bilderwelt/verdichten.js bilderwelt-neu/szenen/<id>.js [--pruefen]
   Puls-Regel (CLAUDE.md, Vorrang 2 „Ladezeiten"): die Körperbau-Tafel war gepackt 148 KB.
   - Pfade (d="…") werden in relative Schritte umgeschrieben (c/l/m … statt C/L/M), genau auf die
     Nachkommastellen des Originals gerechnet – keine Rundung, nur eine andere Schreibweise.
   - Verläufe werden NICHT zusammengelegt: versucht und verworfen – dieselbe id steht in manchen Szenen in
     mehreren Teilen, der Browser nimmt die erste; fällt eine weg, greift eine andere (Zoo II: 5 326
     abweichende Bildpunkte). Nur die Pfade umzuschreiben ergab dort 0.
   --pruefen: zeichnet vorher/nachher (Chromium, dreifach groß, jede Lupe einzeln) und vergleicht Bildpunkt
   für Bildpunkt; geschrieben wird nur, wenn höchstens 20 Bildpunkte deutlich abweichen (Kantenglättung). */
"use strict";
const fs = require("fs"), zlib = require("zlib");
const datei = process.argv[2], pruefen = process.argv.includes("--pruefen");
const text = fs.readFileSync(datei, "utf8");

/* ---------- Pfade ---------- */
const ZAHL = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g;
function relativ(d) {
  if (/[eE]/.test(d.replace(/[^0-9eE.+-]/g, ""))) return d;   // Exponenten: lieber unverändert
  const teile = d.match(/[MmLlHhVvCcSsQqTtAaZz]|[+-]?(?:\d+\.?\d*|\.\d+)/g);
  if (!teile) return d;
  let p = 0; for (const t of teile) if (/\d/.test(t) && t.includes(".")) p = Math.max(p, t.split(".")[1].length);
  if (p > 4) return d;
  const F = Math.pow(10, p), I = (s) => Math.round(parseFloat(s) * F);
  const zeig = (n) => { let s = (n / F).toFixed(p); if (p) s = s.replace(/0+$/, "").replace(/\.$/, ""); if (s === "-0") s = "0"; return s.replace(/^(-?)0\./, "$1."); };
  const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  let i = 0, cmd = null, x = 0, y = 0, sx = 0, sy = 0; const aus = [];
  let letzter = "", vorige = "";
  const trenn = (t) => (!vorige ? "" : (t[0] === "-" || (t[0] === "." && vorige.includes(".")) ? "" : " "));
  const schreib = (c, zahlen) => {
    let s = "";
    if (c !== letzter || c === "m") { s = c; vorige = ""; }
    for (const z of zahlen) { const t = zeig(z); s += trenn(t) + t; vorige = t; }
    aus.push(s); letzter = c === "m" ? "l" : c;
  };
  while (i < teile.length) {
    if (/[A-Za-z]/.test(teile[i])) { cmd = teile[i++]; if (cmd === "Z" || cmd === "z") { aus.push("z"); letzter = "z"; vorige = ""; x = sx; y = sy; continue; } }
    else if (!cmd) return d;
    const C = cmd.toUpperCase(), rel = cmd !== C, n = ARGS[C];
    if (i + n > teile.length) return d;
    const a = teile.slice(i, i + n); i += n;
    if (a.some((t) => /[A-Za-z]/.test(t))) return d;
    const v = a.map(I);
    let neu = [], nx = x, ny = y;
    if (C === "H") { const ax = rel ? x + v[0] : v[0]; neu = [ax - x]; nx = ax; schreib("h", neu); }
    else if (C === "V") { const ay = rel ? y + v[0] : v[0]; neu = [ay - y]; ny = ay; schreib("v", neu); }
    else if (C === "A") { const ex = rel ? x + v[5] : v[5], ey = rel ? y + v[6] : v[6]; schreib("a", [v[0], v[1], v[2], v[3] ? F : 0, v[4] ? F : 0, ex - x, ey - y]); nx = ex; ny = ey; }
    else {
      for (let k = 0; k < n; k += 2) { const ax = rel ? x + v[k] : v[k], ay = rel ? y + v[k + 1] : v[k + 1]; neu.push(ax - x, ay - y); if (k === n - 2) { nx = ax; ny = ay; } }
      schreib(C.toLowerCase(), neu);
    }
    x = nx; y = ny;
    if (C === "M") { sx = x; sy = y; cmd = rel ? "l" : "L"; }
  }
  const r = aus.join("");
  return r.length < d.length ? r : d;
}
/* Bogen-Flags müssen 0/1 bleiben: oben als F (=1·F) gesetzt und von zeig() zu „1" formatiert. */

function stueck(svg) {
  if (!svg) return svg;
  svg = svg.replace(/\sd="([^"]*)"/g, (g, d) => ' d="' + relativ(d) + '"');
  return svg;
}

const w = {}; new Function("window", text)(w);
const id = Object.keys(w.DMA_SZENE)[0], sz = w.DMA_SZENE[id];
const neu = JSON.parse(JSON.stringify(sz));
neu.kulisse = stueck(neu.kulisse); if (neu.vorne) neu.vorne = stueck(neu.vorne);
for (const t of neu.teile) { t.kunst = stueck(t.kunst); for (const u of t.unter || []) u.kunst = stueck(u.kunst); }
const kopf = text.slice(0, text.indexOf('window.DMA_SZENE["' + id + '"]'));
const ausgabe = kopf + 'window.DMA_SZENE["' + id + '"] = ' + JSON.stringify(neu) + ";\n";
const gz = (s) => zlib.gzipSync(Buffer.from(s), { level: 9 }).length;
console.log(id + ": " + Math.round(text.length / 1024) + " → " + Math.round(ausgabe.length / 1024) + " KB, gepackt " + Math.round(gz(text) / 1024) + " → " + Math.round(gz(ausgabe) / 1024) + " KB");

(async () => {
  if (pruefen) {
    const { chromium } = require("/tmp/claude-0/node_modules/playwright");
    const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
    const pg = await br.newPage({ viewport: { width: sz.breite * 3, height: sz.hoehe * 3 } });
    const bild = async (s, teile) => { await pg.setContent(`<body style="margin:0"><svg viewBox="0 0 ${s.breite} ${s.hoehe}" width="${s.breite * 3}" height="${s.hoehe * 3}">${s.kulisse}${teile.map((t) => `<g transform="translate(${t.x},${t.y})">${t.kunst}</g>`).join("")}${s.vorne || ""}</svg></body>`); return pg.screenshot(); };
    const vergleiche = async (a, b) => pg.evaluate(async ([a, b]) => {
      const lade = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u; });
      const [x, y] = await Promise.all([lade(a), lade(b)]);
      const c = document.createElement("canvas"); c.getContext("2d", { willReadFrequently: true }); c.width = x.width; c.height = x.height; const g = c.getContext("2d");
      g.drawImage(x, 0, 0); const A = g.getImageData(0, 0, c.width, c.height).data; g.clearRect(0, 0, c.width, c.height); g.drawImage(y, 0, 0); const B = g.getImageData(0, 0, c.width, c.height).data;
      let n = 0; for (let i = 0; i < A.length; i += 4) if (Math.abs(A[i] - B[i]) > 24 || Math.abs(A[i + 1] - B[i + 1]) > 24 || Math.abs(A[i + 2] - B[i + 2]) > 24) n++; return n;
    }, [a, b].map((p) => "data:image/png;base64," + p.toString("base64")));
    let abw = await vergleiche(await bild(sz, sz.teile), await bild(neu, neu.teile));
    /* jede Lupe einzeln: die Unter-Teile über dem Bild */
    for (let k = 0; k < sz.teile.length; k++) if (sz.teile[k].unter) abw += await vergleiche(await bild(sz, sz.teile[k].unter), await bild(neu, neu.teile[k].unter));
    await br.close();
    console.log("abweichende Bildpunkte: " + abw);
    /* relative Schritte summiert der Browser in Gleitkomma: an einzelnen Kanten kippt die Kantenglättung um
       einen Hauch (Körperbau: 7 Bildpunkte in einer Zeile, bei dreifacher Größe). Mehr als 20 deutlich
       abweichende Bildpunkte heißt: etwas ist falsch – dann wird nichts geschrieben. */
    if (abw > 20) { console.log("NICHT geschrieben."); process.exit(1); }
  }
  fs.writeFileSync(datei, ausgabe);
  console.log("geschrieben: " + datei);
})();
