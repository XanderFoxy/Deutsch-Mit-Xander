/* =====================================================================
   BILDERWELT — BAUKASTEN FÜR SZENEN (FASSUNG 851)
   ---------------------------------------------------------------------
   XANDER (Funk 263): „jeder Ort soll identisch mit seinem Originalvorlage
   sein … recherchiere bis ins kleinste Detail … dass man auch wenn jemand
   auf dem Stuhl sitzt den Stuhl noch anwählen kann … sie sollen richtig
   klickbar sein … mit der Lupen Funktion … zu erforschen sein".

   Die Szenen der neuen Bilderwelt (bilderwelt-neu/szenen/*.js) werden ab
   jetzt HIER gebaut, die Quelle liegt im Repo (die alte Quelle lag nur im
   Arbeitsordner einer früheren Sitzung und ist verloren).

   Grundsätze:
   - Jedes Ding ist ein eigenes Teil mit EIGENER Zeichnung. Die
     Trefferfläche ist die Zeichnung selbst (kein großes unsichtbares
     Rechteck über dem Hintergrund).
   - Die Reihenfolge der Teile ist die Tiefe: hinten zuerst.
   - Kleine Dinge, die in einem größeren stecken (Kuchen in der Vitrine,
     Brote im Regal), sind „unter“-Teile mit Lupe: im ganzen Bild malt sie
     das große Ding mit, beim Näherkommen werden sie einzeln anwählbar.
   - „vorne“: Glas, Spiegelungen, Licht — liegt über allem, fängt aber
     keinen Tipp ab.
   Aufruf: node werkzeug/bilderwelt/szenen/<name>.js  → schreibt
   bilderwelt-neu/szenen/<name>.js
   ===================================================================== */
"use strict";
const fs = require("fs"), path = require("path");

const r = (n) => Math.round(n * 10) / 10;

function neueSzene(kopf) {
  const S = { kopf, defs: [], idz: 0, teile: [], kulisse: [], vorne: [] };
  const P = kopf.kuerzel || kopf.id.slice(0, 3);
  /* eindeutige Namen für Verläufe innerhalb der Szene */
  S.id = (name) => P + "_" + name;
  S.lg = (name, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1, extra = "") => {
    /* FASSUNG 877 — Stehen x1/y1/x2/y2 schon in extra (Bildkoordinaten), werden
       die Vorgaben weggelassen: doppelte Attribute nimmt der Browser beim ERSTEN,
       der Verlauf wirkte dann nie (Frankfurt: Main, Glanz, Pflaster). */
    const eigen = (k) => new RegExp("\\s" + k + "=").test(extra);
    const ko = [["x1", x1], ["y1", y1], ["x2", x2], ["y2", y2]].filter(([k]) => !eigen(k)).map(([k, v]) => ` ${k}="${v}"`).join("");
    S.defs.push(`<linearGradient id="${S.id(name)}"${ko}${extra}>` +
      stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ""}/>`).join("") + "</linearGradient>");
    return `url(#${S.id(name)})`;
  };
  S.rg = (name, stops, cx = 0.5, cy = 0.5, rr = 0.5, extra = "") => {
    S.defs.push(`<radialGradient id="${S.id(name)}" cx="${cx}" cy="${cy}" r="${rr}"${extra}>` +
      stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ""}/>`).join("") + "</radialGradient>");
    return `url(#${S.id(name)})`;
  };
  S.def = (svg) => { S.defs.push(svg); };
  S.hinten = (svg) => { S.kulisse.push(svg); };
  S.davor = (svg) => { S.vorne.push(svg); };
  /* t: { id, de, syl, it, itSyl, en, x, y, kunst, steht, zoom, unter, tipp } */
  S.teil = (t) => {
    if (!t.id || !t.de || !t.syl || !t.it || !t.itSyl || !t.en) throw new Error("Teil unvollständig: " + JSON.stringify(t).slice(0, 120));
    S.teile.push(t);
    return t;
  };
  S.schreiben = (datei) => {
    const teile = S.teile.map((t) => {
      const o = { id: t.id, de: t.de, syl: t.syl, it: t.it, itSyl: t.itSyl, en: t.en, x: r(t.x), y: r(t.y), kunst: t.kunst };
      if (t.steht) o.steht = true;
      if (t.oben) o.oben = true;
      if (t.tipp) o.tipp = t.tipp;
      if (t.lupe) o.lupe = t.lupe;     // FASSUNG 852: Verweis auf eine Detail-Szene (Lupe öffnet sie)
      if (t.zoom) o.zoom = t.zoom;
      if (t.unter) o.unter = t.unter.map((u) => {
        const q = { id: u.id, de: u.de, syl: u.syl, it: u.it, itSyl: u.itSyl, en: u.en, x: r(u.x), y: r(u.y), kunst: u.kunst };
        if (u.tipp) q.tipp = u.tipp;
        if (u.lupe) q.lupe = u.lupe;
        /* Lupen-Dinge liegen in einem größeren gezeichneten Ding: ohne
           obere Fangfläche schluckte das große Ding jeden Tipp. */
        q.oben = true;
        return q;
      });
      return o;
    });
    const sz = {
      id: kopf.id, titel: kopf.titel, emoji: kopf.emoji, thema: kopf.thema, breite: kopf.breite || 320, hoehe: kopf.hoehe || 200,
      kulisse: `<defs>${S.defs.join("")}</defs>` + S.kulisse.join(""),
      teile,
    };
    if (S.vorne.length) sz.vorne = S.vorne.join("");
    const kopfText = `/* ${kopf.titel} — gebaut von werkzeug/bilderwelt/szenen/${kopf.id}.js (FASSUNG ${kopf.fassung}).
   Nicht von Hand ändern: die Quelle ist die Bau-Datei. */
`;
    const js = kopfText + `window.DMA_SZENE = window.DMA_SZENE || {};\nwindow.DMA_SZENE[${JSON.stringify(kopf.id)}] = ${JSON.stringify(sz)};\n`;
    fs.writeFileSync(datei, js);
    return { datei, bytes: js.length, teile: teile.length, unter: teile.reduce((s, t) => s + (t.unter ? t.unter.length : 0), 0) };
  };
  return S;
}

/* Unsichtbare Trefferfläche (für unter-Teile, deren Bild das große Ding mitmalt) */
function flaeche(x, y, w, h, rx = 1.5) {
  return `<rect class="bw-flaeche" x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx="${rx}" fill="rgba(255,255,255,0.001)"/>`;
}
function flaecheEllipse(cx, cy, rx, ry) {
  return `<ellipse class="bw-flaeche" cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="rgba(255,255,255,0.001)"/>`;
}
/* weicher Schatten unter einem Ding */
function schatten(cx, cy, rx, ry, a = 0.28) {
  return `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="#1b120a" opacity="${a}" filter="url(#bw_weich)"/>`;
}
/* Pseudo-Zufall, damit jeder Bau dasselbe Bild ergibt */
function zufall(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
}

/* Mensch aus bilderwelt-neu/figuren/mensch.js — dieselbe Figur wie in der App */
let MENSCH = null;
function mensch(spec, hoehe) {
  if (!MENSCH) {
    globalThis.window = globalThis;
    require(path.join(__dirname, "../../bilderwelt-neu/figuren/mensch.js"));
    MENSCH = globalThis.DMA_MENSCH;
  }
  const z = MENSCH.zeichne(spec);
  /* Fußpunkt = Ursprung; Höhe in Szeneneinheiten */
  const k = hoehe / (z.hoehe || 170);
  return { svg: `<g transform="scale(${k.toFixed(4)})">${z.svg}</g>`, k, z };
}

module.exports = { neueSzene, flaeche, flaecheEllipse, schatten, zufall, mensch, r };
