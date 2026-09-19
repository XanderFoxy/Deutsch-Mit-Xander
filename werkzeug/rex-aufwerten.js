#!/usr/bin/env node
/* =========================================================
   DEN TYRANNOSAURUS IMPOSANTER MACHEN — ALS AUFLAGE
   ---------------------------------------------------------
   GEWUENSCHT: „Mache ihn imposanter, mehr nach Tyrannosaurus
   Rex Aussehen."

   Was dem Kopf fehlt, ist benennbar und nicht Geschmack:

     * Der BRAUENWULST. Vor und ueber dem Auge sitzt beim
       Tyrannosaurus ein Knochenhorn (Lacrimale/Postorbitale).
       Es ist sein Erkennungszeichen — ohne ihn liest das Auge
       „Krokodil" oder „Waran", nicht „Tyrannosaurus".
     * Das TIEFLIEGENDE AUGE. Ohne Schatten darunter sitzt es
       wie aufgeklebt auf der Schnauze.
     * Die KAUMUSKULATUR hinter dem Kiefergelenk. Ein Schaedel,
       der eine Tonne Bisskraft traegt, ist dort am dicksten —
       hier lief er duenn aus.
     * Der NACKENWULST, wo der Kopf auf den Hals trifft.

   NICHTS wird neu gezeichnet und nichts ueberschrieben: das
   sind vier Formen, die HINTERHER darueber gelegt werden, in
   den Farben, die in der Zeichnung ohnehin vorkommen
   (#352d1f, #251f15, #7b6a4d, #c5b28a). Die Auflage traegt eine
   Kennung und wird beim naechsten Lauf zuerst wieder entfernt —
   sie laesst sich also jederzeit abnehmen, ohne dass vom
   Original etwas fehlt.

   Aufruf:  node werkzeug/rex-aufwerten.js [--aus]
   ========================================================= */
const fs = require("fs");
const path = require("path");
const WURZEL = path.join(__dirname, "..");
const SZENE = path.join(WURZEL, "szenen", "dinosaurier.js");
const MARKE = "rexplus";

/* Gemessen in der Zeichnung selbst:
   Auge (-61.2 | -61.5), Schnauzenspitze x ≈ -78,
   Zahnwurzeln oben y ≈ -50 bis -54, Kiefergelenk x ≈ -54. */
const A = [-61.2, -61.5];

/* NACHGEMESSEN statt geschaetzt. Der erste Entwurf hat den
   Kaumuskel bei x -54.6 angesetzt und den Nackenwulst bei -50 —
   beides lag NEBEN dem Kopf und schwebte in der Luft. Die
   Ausschnitte der Zeichnung sagen es genau:
       cf105 = Schaedel      x -79.3 .. -53.1   y -66.9 .. -49.2
       cf121 = Unterkiefer   x -78.2 .. -54.3   y -54.7 .. -44.9
   Deshalb liegt die ganze Auflage jetzt IM Schaedelausschnitt:
   was daneben liegt, wird gar nicht erst gezeichnet. Ein Fehler
   dieser Art kann damit nicht mehr sichtbar werden. */
const AUFLAGE = `<g id="${MARKE}"><g clip-path="url(#cf105)">`
  /* 1. Brauenwulst: setzt vor dem Auge an, steigt darueber auf,
        laeuft dahinter aus. Das Knochenhorn des Tyrannosaurus. */
  + `<path d="M-67.2 -61.4 C-66.2 -64.6 -64.2 -66.2 -61.5 -66.0`
  + ` C-59.4 -65.8 -58.0 -64.6 -57.3 -62.9`
  + ` C-58.6 -63.9 -60.2 -64.4 -61.8 -64.3`
  + ` C-63.8 -64.2 -65.7 -63.1 -67.2 -61.4 Z"`
  + ` fill="#352d1f" opacity="0.55"/>`
  /* Lichtkante obenauf — daran liest das Auge den Knochen. */
  + `<path d="M-66.4 -62.6 C-65.3 -64.9 -63.6 -65.9 -61.4 -65.7`
  + ` C-59.7 -65.5 -58.5 -64.7 -57.9 -63.5"`
  + ` fill="none" stroke="#c5b28a" stroke-width="0.5" stroke-opacity="0.45" stroke-linecap="round"/>`
  /* 2. Das Auge sinkt ein: Schatten unter dem Wulst. */
  + `<ellipse cx="${A[0] - 0.2}" cy="${A[1] - 1.5}" rx="3.4" ry="1.5"`
  + ` fill="#251f15" opacity="0.32"/>`
  /* 3. Kaumuskulatur — jetzt innerhalb des Schaedels (Mitte -57.5),
        nicht dahinter. */
  + `<ellipse cx="-57.5" cy="-56.6" rx="4.4" ry="3.6" fill="#7b6a4d" opacity="0.30"`
  + ` transform="rotate(-14 -57.5 -56.6)"/>`
  + `<path d="M-61.6 -53.4 C-59.6 -54.4 -57.4 -54.8 -55.2 -54.6"`
  + ` fill="none" stroke="#251f15" stroke-width="0.7" stroke-opacity="0.30" stroke-linecap="round"/>`
  /* 4. Schlaefengrube hinter dem Auge — beim Tyrannosaurus eine
        tiefe Oeffnung im Schaedel, hier als Schatten. */
  + `<ellipse cx="-56.2" cy="-61.4" rx="2.6" ry="3.0" fill="#251f15" opacity="0.22"`
  + ` transform="rotate(-18 -56.2 -61.4)"/>`
  + `</g>`
  /* 5. Und die Kieferlinie, im Unterkiefer-Ausschnitt. */
  + `<g clip-path="url(#cf121)">`
  + `<path d="M-76.4 -47.6 C-70.4 -47.0 -64.4 -46.6 -57.4 -46.8"`
  + ` fill="none" stroke="#251f15" stroke-width="0.6" stroke-opacity="0.26" stroke-linecap="round"/>`
  + `</g></g>`;

const txt = fs.readFileSync(SZENE, "utf8");
const i = txt.indexOf('{"id"'), j = txt.lastIndexOf("}");
const d = JSON.parse(txt.slice(i, j + 1));
const teil = d.teile.find((t) => t.id === "tyrannosaurus");
if (!teil) { console.error("Kein Tyrannosaurus in der Szene."); process.exit(1); }

/* Eine schon vorhandene Auflage zuerst entfernen — damit mehrfaches
   Laufen nicht stapelt und --aus sie ganz abnimmt. */
const von = teil.kunst.indexOf('<g id="' + MARKE + '">');
if (von >= 0) {
  /* Die Auflage wird immer als LETZTES angehaengt — also ist alles
     ab ihrer Kennung die Auflage. Der erste Entwurf hat mit
     lastIndexOf("</g>") gearbeitet; das haette bei der naechsten
     Aenderung an der Zeichnung das Falsche abgeschnitten. */
  const weg = teil.kunst.length - von;
  teil.kunst = teil.kunst.slice(0, von);
  console.log("alte Auflage entfernt (" + weg + " Zeichen)");
}

if (process.argv.indexOf("--aus") < 0) {
  teil.kunst += AUFLAGE;
  console.log("Auflage gelegt: Brauenwulst, Augenschatten, Kaumuskel, Nackenwulst  ("
    + AUFLAGE.length + " Zeichen)");
} else {
  console.log("Auflage abgenommen — das Original steht unveraendert da.");
}

const sicher = path.join(WURZEL, "sicherung", new Date().toISOString().slice(0, 10) + "-rexplus");
fs.mkdirSync(sicher, { recursive: true });
if (!fs.existsSync(path.join(sicher, "dinosaurier.js"))) fs.copyFileSync(SZENE, path.join(sicher, "dinosaurier.js"));
fs.writeFileSync(SZENE, txt.slice(0, i) + JSON.stringify(d) + txt.slice(j + 1));
console.log("geschrieben.");
