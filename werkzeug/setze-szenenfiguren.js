/* Die Menschen in den Bilderwelten sitzen, wo sie sitzen sollen.
   ------------------------------------------------------------------
   GEMELDET: „die Figuren schweben — im Sessel sitzt sie davor, in der
   Badewanne liegt niemand drin."

   URSACHE: die Menschen in den Szenendateien sind fertig gezeichnete
   SVG-Blöcke, und zwar ALLE in der Haltung „stehen". Das Möbelstück
   wurde nur davor gelegt: von vorn sah es aus, als stünde jemand
   hinter dem Sofa mit einer Stange über dem Schoß.

   Die Haltungen „sitzen" und „liegen" gibt es längst — sie stehen in
   figuren/<typ>-teil2.js und werden im Baukasten auch benutzt. In den
   ausgelieferten Szenen fehlten sie nur, weil die Szenen älter sind.

   Dieses Werkzeug baut die Figur genauso zusammen wie bkFigurSvg() im
   Baukasten (gleiche Reihenfolge der Ebenen, gleiche Haut- und
   Stofftöne, gleicher Maßstab aus DMA_PLATZ_MASS) und hängt sie an den
   richtigen Punkt: beim Sitzen ans GESÄSS, beim Stehen und Liegen an
   die Füße. Genau das macht der Baukasten auch — nur eben zur Laufzeit.

   Aufruf:  node werkzeug/setze-szenenfiguren.js
            node werkzeug/setze-szenenfiguren.js --probe   (nur rechnen)
------------------------------------------------------------------- */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WURZEL = path.dirname(__dirname);
const probe = process.argv.includes("--probe");

/* --- Die Figurendateien in einen eigenen Raum laden ---------------- */
const raum = vm.createContext({});
vm.runInContext("var window = this; window.window = window;", raum);
function ladeJs(datei) {
  vm.runInContext(fs.readFileSync(path.join(WURZEL, datei), "utf8"), raum,
                  { filename: datei });
}
ladeJs("data-plaetze.js");

/* --- Was bkFigurSvg() braucht, noch einmal in klein ---------------- */
function stoffStil(w) {
  const stil = [];
  const grund = (raum.window.DMA_FIGUR_STUECK || {})[w.stueck] || {};
  Object.keys(grund).forEach((k) => stil.push(k + ":" + grund[k]));
  if (w.farbe) {
    const f = (raum.window.DMA_FIGUR_STOFF || {})[w.farbe];
    if (f) {
      const zu = { f: "--stoff-1", d: "--stoff-1-d", dd: "--stoff-1-dd",
                   h: "--stoff-1-h", naht: "--stoff-1-naht" };
      Object.keys(zu).forEach((k) => { if (f[k]) stil.push(zu[k] + ":" + f[k]); });
    } else {
      const g = FARBWERT[w.farbe] || "#7a8fa6";
      stil.push("--stoff-1:" + g);
      stil.push("--stoff-1-d:" + mischen(g, "#000000", 0.22));
      stil.push("--stoff-1-dd:" + mischen(g, "#000000", 0.40));
      stil.push("--stoff-1-h:" + mischen(g, "#ffffff", 0.22));
      stil.push("--stoff-1-naht:" + mischen(g, "#000000", 0.32));
    }
  }
  return stil.join(";");
}
const FARBWERT = { rot: "#c0503f", blau: "#2d6da3", gruen: "#4e8a45",
  gelb: "#d9b23a", schwarz: "#33343a", weiss: "#f1f2f0", grau: "#8d8f93",
  braun: "#8a6142", gruen_d: "#2f5c34", rosa: "#d98ca8" };
function mischen(hex, ziel, anteil) {
  const a = hex.replace("#", ""), b = ziel.replace("#", "");
  const n = (s, i) => parseInt(s.substr(i, 2), 16);
  return "#" + [0, 2, 4].map((i) =>
    ("0" + Math.round(n(a, i) + (n(b, i) - n(a, i)) * anteil).toString(16)).slice(-2)).join("");
}

function figurSvg(zustand) {
  const typ = zustand.alter + "-" + zustand.geschlecht;
  const bau = (raum.window.DMA_FIGUR || {})[typ];
  if (!bau) throw new Error("Figurentyp fehlt: " + typ);
  const h = bau.haltungen[zustand.haltung];
  if (!h) throw new Error("Haltung fehlt: " + zustand.haltung + " bei " + typ
                          + " (da: " + Object.keys(bau.haltungen).join(", ") + ")");
  const haut = (raum.window.DMA_FIGUR_HAUT || {})[zustand.haut] || {};
  const haar = (raum.window.DMA_FIGUR_HAAR || {})[zustand.haarfarbe] || {};
  const aussen = Object.keys(haut).map((k) => k + ":" + haut[k])
    .concat(Object.keys(haar).map((k) => k + ":" + haar[k])).join(";");
  const ebenen = [];
  (raum.window.DMA_FIGUR_REIHENFOLGE || []).forEach((platz) => {
    if (platz === "koerper") { ebenen.push(h.koerper || ""); return; }
    if (platz === "gesicht") {
      const gs = h.gesichter || {};
      ebenen.push(gs[zustand.gesicht] || gs[Object.keys(gs)[0]] || "");
      return;
    }
    if (platz === "frisur") {
      ebenen.push((h.frisuren || {})[zustand.frisur] || "");
      if (zustand.bart) ebenen.push((h.frisuren || {})[zustand.bart] || "");
      return;
    }
    const w = (zustand.kleidung || {})[platz];
    if (!w || !w.stueck || w.stueck === "nichts") return;
    const teil = (h.kleidung || {})[w.stueck];
    if (!teil) return;
    ebenen.push('<g style="' + stoffStil(w) + '">' + teil + "</g>");
  });
  const tafel = raum.window.DMA_PLATZ_MASS || {};
  const cm = tafel[zustand.szene] || tafel._standard || 1.7;
  const k = 1 / cm;
  const pk = h.punkte || {};
  return {
    svg: '<g style="' + aussen + '" transform="scale(' + k.toFixed(4) + ')">'
         + ebenen.join("") + "</g>",
    fuss: (h.fuss || 0) * k,
    sitz: pk.sitz ? pk.sitz[1] * k : null,
    sitzX: pk.sitz ? pk.sitz[0] * k : 0,
    hoehe: (h.hoehe || 100) * k,
  };
}

/* WORAN die Figur haengt.
   Die Figuren sind in Zentimetern gezeichnet und stimmen in sich: eine
   sitzende Frau hat 46 cm zwischen Gesaess und Boden, ein sitzender Mann
   51 cm, ein Kind 32 cm. Man kann eine Figur also entweder an die FUESSE
   haengen (dann liegt das Gesaess automatisch richtig) oder ans GESAESS
   (dann haengen die Fuesse, wenn der Sitz zu hoch ist).

   Erwachsene auf einem Sofa: an die Fuesse — sie stehen mit den Fuessen
   auf dem Boden. Ein Kind auf einem Erwachsenensofa: ans Gesaess — seine
   Beine sind zu kurz, die Fuesse baumeln. Genau so sieht es im Zimmer
   auch aus.

   Die Zahlen kommen NICHT aus data-plaetze.js: das dortige sitzY ist
   fuer den Baukasten gesetzt und liegt fuer die Szenenmoebel zu hoch —
   daran haben die Figuren in der Luft gehangen. Hier steht die aus den
   Moebeln gemessene Hoehe. */
function anker(fig, auftrag) {
  if (typeof auftrag.fussY === "number")
    return { x: auftrag.x, y: auftrag.fussY - fig.fuss };
  if (typeof auftrag.sitzY === "number" && fig.sitz !== null)
    return { x: auftrag.x - fig.sitzX, y: auftrag.sitzY - fig.sitz };
  throw new Error("weder fussY noch sitzY bei " + auftrag.teil);
}

/* --- WER sitzt WO -------------------------------------------------- */
/* Kleidung und Haare sind so gewählt, dass die Menschen aussehen wie
   bisher — es ändert sich die HALTUNG, nicht die Person. */
const AUFTRAEGE = [
  /* Sofa: Sitzflaeche 152 (aus dem Moebelstueck gemessen, nicht aus
     data-plaetze.js — das dortige sitzY=137 gilt fuer den Baukasten und
     liegt 15 Einheiten zu hoch; daran haben die Figuren in der Luft
     gehangen). Der Vater sitzt links, die Tochter daneben vor dem
     Fernseher, die Mutter im Sessel (Sitzflaeche 146). */
  { szene: "wohnzimmer", teil: "vater", x: 74, sitzY: 152,
    z: { alter: "erwachsen", geschlecht: "m", haut: "hell", frisur: "kurz",
         haarfarbe: "dunkelbraun", gesicht: "g1", haltung: "sitzen",
         kleidung: { oberteil: { stueck: "pullover", farbe: "gruen_d" },
                     unterteil: { stueck: "jeans", farbe: "blau" },
                     schuhe: { stueck: "halbschuh", farbe: "braun" } } } },
  /* Das Kind haengt am GESAESS: auf einem Erwachsenensofa reichen seine
     Beine nicht bis zum Boden, die Fuesse baumeln. */
  { szene: "wohnzimmer", teil: "tochter", x: 122, sitzY: 152,
    z: { alter: "kind", geschlecht: "w", haut: "hell", frisur: "zopf",
         haarfarbe: "dunkelbraun", gesicht: "g1", haltung: "sitzen",
         kleidung: { oberteil: { stueck: "tshirt", farbe: "rot" },
                     unterteil: { stueck: "hose", farbe: "blau" },
                     schuhe: { stueck: "halbschuh", farbe: "weiss" } } } },
  /* Sessel: x 206 bis 269, Unterkante 175. */
  { szene: "wohnzimmer", teil: "mutter", x: 238, sitzY: 146,
    z: { alter: "erwachsen", geschlecht: "w", haut: "hell", frisur: "dutt",
         haarfarbe: "braun", gesicht: "g1", haltung: "sitzen",
         kleidung: { oberteil: { stueck: "bluse", farbe: "gruen" },
                     unterteil: { stueck: "hose", farbe: "grau" },
                     schuhe: { stueck: "halbschuh", farbe: "braun" } } } },
  /* Die Badewanne fehlt hier bewusst: dort muesste erst ein Wannenrand
     VOR die Figur gelegt werden, sonst laege sie obenauf statt darin.
     Im Wohnzimmer gibt es dieses Vorderstueck laengst (sitzkissen,
     armlehne) — deshalb geht es hier schon. */
];

/* --- Einsetzen ----------------------------------------------------- */
const plaetze = {};
(raum.window.DMA_PLAETZE || []).forEach((p) => { plaetze[p.id] = p; });

const gebraucht = new Set();
AUFTRAEGE.forEach((a) => gebraucht.add(a.z.alter + "-" + a.z.geschlecht));
gebraucht.forEach((typ) => {
  ["", "-teil2", "-teil3"].forEach((teil) => {
    const datei = "figuren/" + typ + teil + ".js";
    if (fs.existsSync(path.join(WURZEL, datei))) ladeJs(datei);
  });
});

const proSzene = {};
AUFTRAEGE.forEach((a) => { (proSzene[a.szene] = proSzene[a.szene] || []).push(a); });

Object.keys(proSzene).forEach((szene) => {
  const pfad = path.join(WURZEL, "szenen", szene + ".js");
  const txt = fs.readFileSync(pfad, "utf8");
  const i = txt.indexOf('{"id"'), j = txt.lastIndexOf("};");
  const d = JSON.parse(txt.slice(i, j + 1));
  let geaendert = false;
  proSzene[szene].forEach((a) => {
    a.z.szene = szene;
    let fig;
    try { fig = figurSvg(a.z); }
    catch (e) { console.log("!!", a.teil, e.message); return; }
    a.teilName = a.teil;
    const p = anker(fig, a);
    const teil = d.teile.find((t) => t.id === a.teil);
    if (!teil) { console.log("!! Teil fehlt:", a.teil, "in", szene); return; }
    console.log(szene + " / " + a.teil.padEnd(9) + a.z.haltung.padEnd(9)
      + "(" + teil.x + "," + teil.y + ") -> (" + p.x.toFixed(1) + "," + p.y.toFixed(1) + ")  "
      + (teil.kunst || "").length + " -> " + fig.svg.length + " Zeichen");
    if (!probe) {
      teil.kunst = fig.svg;
      teil.x = Math.round(p.x * 10) / 10;
      teil.y = Math.round(p.y * 10) / 10;
      geaendert = true;
    }
  });
  if (geaendert) {
    const sicher = path.join(WURZEL, "sicherung",
      new Date().toISOString().slice(0, 10) + "-figuren");
    fs.mkdirSync(sicher, { recursive: true });
    if (!fs.existsSync(path.join(sicher, szene + ".js")))
      fs.copyFileSync(pfad, path.join(sicher, szene + ".js"));
    fs.writeFileSync(pfad, txt.slice(0, i) + JSON.stringify(d) + txt.slice(j + 1));
  }
});
