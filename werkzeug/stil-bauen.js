#!/usr/bin/env node
/* =====================================================================
   FASSUNG 876 — STILBLÄTTER: ERST DAS, WAS MAN BEIM START SIEHT
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller".

   GEMESSEN (werkzeug/teile-messen.js): beim Start und im Klassenzimmer
   greifen von korrekturen.css (153 KB gepackt), app-styles.css (38 KB)
   und spiel.css (46 KB) nur wenige Regeln. Ein Stilblatt hält aber das
   erste Bild an, bis es GANZ da ist – auf einem Telefon im Mobilfunk die
   größte Bremse vor dem ersten Bild.

   JETZT (nur in min/, die Quellen bleiben, wie sie sind):
     - min/<name>-start.css enthält die Regeln, die beim Start greifen
       können – in derselben Reihenfolge wie im ganzen Blatt. Nur dieses
       kleine Blatt hält das erste Bild an.
     - Gleich danach (index.html, wenn die Startskripte gelaufen sind)
       kommt das GANZE Blatt min/<name>.css, und zwar direkt hinter sein
       Startblatt. Dann gilt genau dasselbe wie vorher: jede Regel des
       Startblatts steht im ganzen Blatt noch einmal an ihrem alten Platz,
       und dazwischen liegt nichts.
     - Welche Regeln „später" sind, steht in werkzeug/stil-teile.json
       (Prüfsummen, erzeugt von teile-messen.js aus mehreren Start-Lagen:
       abgemeldet, angemeldet, Telefon, breiter Schirm, alle Reiter). Eine
       Regel, die dort nicht steht – etwa eine neue –, kommt ins
       Startblatt. Im Zweifel also immer früh.
     - @keyframes kommen ins Startblatt, wenn eine Startregel oder die
       Seite sie beim Namen nennt; @font-face und Anweisungen immer.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const LISTE = path.join(__dirname, "stil-teile.json");

/* Ein kleiner CSS-Zerleger: Kommentare, Zeichenketten, Klammern. Gibt Knoten mit Lage im Text zurück. */
function zerlegen(text) {
  let p = 0;
  const n = text.length;
  function kommentarOderString() {
    const c = text[p];
    if (c === "/" && text[p + 1] === "*") { const e = text.indexOf("*/", p + 2); p = e < 0 ? n : e + 2; return true; }
    if (c === '"' || c === "'") {
      p++;
      while (p < n && text[p] !== c) { if (text[p] === "\\") p++; p++; }
      p++;
      return true;
    }
    return false;
  }
  function blockEnde() {   /* p steht hinter „{" – bis zur passenden „}" */
    let tiefe = 1;
    while (p < n) {
      if (kommentarOderString()) continue;
      const c = text[p];
      if (c === "{") tiefe++;
      else if (c === "}") { tiefe--; if (tiefe === 0) { p++; return p; } }
      p++;
    }
    return p;
  }
  function liste(bis) {
    const knoten = [];
    while (p < bis) {
      while (p < bis && /\s/.test(text[p])) p++;
      if (p >= bis) break;
      if (text[p] === "/" && text[p + 1] === "*") { kommentarOderString(); continue; }
      if (text[p] === "}") { p++; continue; }
      const anfang = p;
      while (p < bis) {
        if (kommentarOderString()) continue;
        if (text[p] === "{" || text[p] === ";") break;
        p++;
      }
      const vorspann = text.slice(anfang, p);
      if (p >= bis) { knoten.push({ art: "rest", start: anfang, end: p }); break; }
      if (text[p] === ";") { p++; knoten.push({ art: "satz", start: anfang, end: p }); continue; }
      p++;   /* „{" */
      const innen = p;
      const kopf = rein(vorspann);
      if (/^@(media|supports|container|layer|document|-moz-document|scope)\b/i.test(kopf)) {
        const ende = (() => { const merk = p; blockEnde(); const e = p; p = merk; return e; })();
        const kinder = liste(ende - 1);
        p = ende;
        knoten.push({ art: "gruppe", kopf, start: anfang, innen, end: ende, kinder });
      } else if (kopf[0] === "@") {
        blockEnde();
        knoten.push({ art: "at", kopf, name: (kopf.match(/^@([\w-]+)/) || [])[1] || "", start: anfang, innen, end: p });
      } else {
        blockEnde();
        knoten.push({ art: "regel", sel: kopf, start: anfang, innen, end: p });
      }
    }
    return knoten;
  }
  return liste(n);
}
/* Kommentare weg, Leerraum auf ein Zeichen – damit derselbe Wähler immer dieselbe Prüfsumme hat. */
function rein(s) {
  return String(s).replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\s+/g, " ").trim();
}
function schluessel(datei, kontext, sel) {
  return crypto.createHash("sha1").update(datei + "\n" + kontext.join("\n") + "\n" + rein(sel)).digest("hex").slice(0, 10);
}
/* Alle Stilregeln mit Schlüssel und Kontext (für das Messwerkzeug). */
function regeln(datei, text) {
  const aus = [];
  (function gehe(knoten, kontext) {
    knoten.forEach((k) => {
      if (k.art === "regel") aus.push({ key: schluessel(datei, kontext, k.sel), sel: rein(k.sel), kontext: kontext.slice(), start: k.start, end: k.end, innen: k.innen });
      else if (k.art === "gruppe") gehe(k.kinder, kontext.concat(k.kopf));
    });
  })(zerlegen(text), []);
  return aus;
}

function listeLesen() {
  try { return JSON.parse(fs.readFileSync(LISTE, "utf8")); } catch (e) { return null; }
}

/* Das Startblatt (noch nicht verkleinert). Gibt null zurück, wenn es für die Datei keine Liste gibt. */
function startBlatt(datei, text, liste, immerNamen) {
  const spaet = liste && liste.spaet && liste.spaet[datei];
  if (!spaet || !spaet.length) return null;
  const weg = new Set(spaet);
  const knoten = zerlegen(text);
  /* 1. Welche Regeln bleiben, und welche Namen nennen sie (für @keyframes)? */
  const genannt = new Set(immerNamen || []);
  const wortRe = /[A-Za-z_-][\w-]*/g;
  (function sammeln(kn, kontext) {
    kn.forEach((k) => {
      if (k.art === "regel" && !weg.has(schluessel(datei, kontext, k.sel))) {
        const block = text.slice(k.innen, k.end - 1);
        if (/animation/i.test(block)) (block.match(wortRe) || []).forEach((w) => genannt.add(w));
      } else if (k.art === "gruppe") sammeln(k.kinder, kontext.concat(k.kopf));
    });
  })(knoten, []);
  /* 2. Ausgeben, in der Reihenfolge des ganzen Blatts */
  function ausgeben(kn, kontext) {
    let s = "";
    kn.forEach((k) => {
      if (k.art === "regel") {
        if (!weg.has(schluessel(datei, kontext, k.sel))) s += text.slice(k.start, k.end) + "\n";
      } else if (k.art === "gruppe") {
        const innen = ausgeben(k.kinder, kontext.concat(k.kopf));
        if (innen.trim()) s += text.slice(k.start, k.innen) + "\n" + innen + "}\n";
      } else if (k.art === "at") {
        if (/^(-\w+-)?keyframes$/i.test(k.name)) {
          const name = rein(k.kopf.replace(/^@[\w-]+/, "")).replace(/^["']|["']$/g, "");
          if (genannt.has(name)) s += text.slice(k.start, k.end) + "\n";
        } else s += text.slice(k.start, k.end) + "\n";
      } else if (k.art === "satz") s += text.slice(k.start, k.end) + "\n";
    });
    return s;
  }
  return ausgeben(knoten, []);
}

/* Für fassung-setzen.js: das verkleinerte Startblatt (oder null, wenn es für die Datei keines gibt). */
function startBlattMin(datei, roh, eb) {
  const liste = listeLesen();
  const s = startBlatt(datei, roh, liste, (liste && liste.immer) || []);
  if (s == null) return null;
  return eb.transformSync(s, { loader: "css", minify: true, legalComments: "none", charset: "utf8" }).code;
}
/* Prüfsumme über alles, was das Startblatt bestimmt (für min/.quelle.json). */
function bauSumme(roh) {
  const h = crypto.createHash("sha1").update(roh);
  try { h.update(fs.readFileSync(LISTE)); } catch (e) {}
  h.update(fs.readFileSync(__filename));
  return h.digest("hex");
}
const startName = (d) => d.replace(/\.css$/, "-start.css");
const istStart = (n) => /-start\.css$/.test(n);

module.exports = { zerlegen, regeln, schluessel, startBlatt, startBlattMin, bauSumme, startName, istStart, listeLesen, LISTE, rein };

if (require.main === module && process.argv[2] === "--bauen") {
  /* Startblätter in min/ bauen (sonst macht das fassung-setzen.js): node werkzeug/stil-bauen.js --bauen */
  const WURZEL = path.dirname(__dirname), MIN = path.join(WURZEL, "min");
  const eb = require("./teile-bauen.js").esbuildHolen();
  const liste = listeLesen() || { spaet: {} };
  const merkPfad = path.join(MIN, ".quelle.json");
  let merk = {};
  try { merk = JSON.parse(fs.readFileSync(merkPfad, "utf8")); } catch (e) {}
  Object.keys(liste.spaet || {}).forEach((d) => {
    const roh = fs.readFileSync(path.join(WURZEL, d), "utf8");
    const voll = eb.transformSync(roh, { loader: "css", minify: true, legalComments: "none", charset: "utf8" }).code;
    const ersetzen = require("./teile-bauen.js").ersetzen;
    ersetzen(path.join(MIN, d), voll);
    const s = startBlattMin(d, roh, eb);
    if (s != null) ersetzen(path.join(MIN, startName(d)), s);
    merk[d] = bauSumme(roh);
    console.log("min/" + startName(d) + " " + (s == null ? "–" : Math.round(s.length / 1024) + " KB"));
  });
  fs.writeFileSync(merkPfad, JSON.stringify(merk, null, 1) + "\n");
} else if (require.main === module) {
  /* Zum Nachsehen: node werkzeug/stil-bauen.js korrekturen.css → Größen des Startblatts */
  const zlib = require("zlib");
  const WURZEL = path.dirname(__dirname);
  const liste = listeLesen();
  (process.argv.slice(2).length ? process.argv.slice(2) : Object.keys((liste && liste.spaet) || {})).forEach((d) => {
    const text = fs.readFileSync(path.join(WURZEL, d), "utf8");
    const r = regeln(d, text);
    const s = startBlatt(d, text, liste, (liste && liste.immer) || []);
    console.log(d + ": " + r.length + " Regeln, später " + (((liste && liste.spaet) || {})[d] || []).length
      + (s != null ? ", Startblatt " + Math.round(s.length / 1024) + " KB Quelle (gepackt " + Math.round(zlib.gzipSync(s).length / 1024) + " KB)" : ", keine Liste"));
  });
}
