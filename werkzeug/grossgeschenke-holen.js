#!/usr/bin/env node
/* HOLT DIE GROSSEN GESCHENKE AUS DEN BILDERWELTEN.
   ---------------------------------------------------------------
   GEWUENSCHT: „wie TikTok das macht mit den grossen Geschenken."

   Bei TikTok schickt man jemandem einen Loewen, und der Loewe fuellt
   den ganzen Bildschirm. Genau das gibt es hier jetzt auch — nur
   wird dafuer NICHTS neu gezeichnet. Die Tiere stehen laengst in den
   Bilderwelten, von Hand nachgemessen und Fassung fuer Fassung
   abgenommen. Sie noch einmal zu zeichnen hiesse, gute Arbeit
   wegzuwerfen.

   Dieses Werkzeug schneidet sie heraus und legt sie in EINE Datei:
   data-grossgeschenke.js. Die wird von der Seite erst geholt, wenn
   wirklich jemand ein grosses Geschenk schickt — sie ist zu schwer,
   um beim Start mitzufahren.

   Der Rahmen (viewBox) wird nicht geschaetzt, sondern GEMESSEN: jedes
   Tier wird in einem echten Browser gezeichnet und mit getBBox()
   ausgemessen. Ein geschaetzter Rahmen schneidet entweder Ohren ab
   oder laesst das Tier winzig in der Mitte schweben.

   Aufruf:  node werkzeug/grossgeschenke-holen.js
*/
const fs = require("fs");
const path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");

const WURZEL = path.dirname(__dirname);
const ZIEL = path.join(WURZEL, "data-grossgeschenke.js");

/* Welche Tiere. Ausgesucht nach dem, was man jemandem schenken
   wuerde: das Groesste, das Gefaehrlichste, das Stolzeste. */
const WAHL = [
  { schluessel: "loewe",  szene: "tiere_welt",   teil: "loewe",         emoji: "🦁", satz: "einen Löwen" },
  { schluessel: "trex",   szene: "dinosaurier",  teil: "tyrannosaurus", emoji: "🦖", satz: "einen Tyrannosaurus" },
  { schluessel: "elefant",szene: "tiere_welt",   teil: "elefant",       emoji: "🐘", satz: "einen Elefanten" },
  { schluessel: "adler",  szene: "tiere_welt",   teil: "adler",         emoji: "🦅", satz: "einen Adler" },
  { schluessel: "haifisch", szene: "tiere_welt", teil: "hai",           emoji: "🦈", satz: "einen Hai" },
  { schluessel: "baer",   szene: "tiere_welt",   teil: "baer",          emoji: "🐻", satz: "einen Bären" },
];

global.window = {};
const gebraucht = [...new Set(WAHL.map((w) => w.szene))];
for (const s of gebraucht) {
  eval(fs.readFileSync(path.join(WURZEL, "szenen", s + ".js"), "utf8"));
}
const SZENEN = global.window.DMA_SZENE || {};

const roh = WAHL.map((w) => {
  const sz = SZENEN[w.szene];
  if (!sz) throw new Error("Szene fehlt: " + w.szene);
  const t = (sz.teile || []).find((x) => x.id === w.teil);
  if (!t) throw new Error("Teil fehlt: " + w.szene + "/" + w.teil);
  return { ...w, de: t.de, kunst: t.kunst };
});

(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage();
  await pg.setContent("<!doctype html><body style='margin:0'></body>");
  const rahmen = await pg.evaluate(async (liste) => {
    /* NICHT getBBox. Das misst die GEOMETRIE — und dazu gehoeren auch
       Dinge, die man gar nicht sieht: ein Schattenverlauf, der bis
       ins Nichts ausblendet, oder eine Hilfsform hinter einer Maske.
       Beim Adler blies genau das den Rahmen auf das Vierfache auf, und
       der Vogel sass winzig in der Mitte; beim Tyrannosaurus war der
       Rahmen dafuer zu flach und schnitt den Kopf ab.

       Gemessen wird deshalb die FARBE: das Tier wird auf eine
       durchsichtige Leinwand gezeichnet und Zeile fuer Zeile
       abgesucht, wo ueberhaupt etwas Sichtbares steht. Was man nicht
       sieht, zaehlt nicht mit. */
    const FELD = 900;            // Aufloesung der Messung
    const SPANNE = 400;          // gemessener Weltausschnitt: -200 … 200
    const raus = {};
    for (const e of liste) {
      const quelle = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 400 400" '
        + 'width="' + FELD + '" height="' + FELD + '">' + e.kunst + "</svg>";
      const bild = new Image();
      bild.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(quelle);
      await new Promise((fertig, schief) => { bild.onload = fertig; bild.onerror = schief; });
      const c = document.createElement("canvas");
      c.width = FELD; c.height = FELD;
      const k = c.getContext("2d");
      k.drawImage(bild, 0, 0, FELD, FELD);
      const d = k.getImageData(0, 0, FELD, FELD).data;
      let x0 = FELD, y0 = FELD, x1 = -1, y1 = -1;
      for (let y = 0; y < FELD; y++) {
        for (let x = 0; x < FELD; x++) {
          /* 12 von 255: ein Hauch Schatten zaehlt noch, das letzte
             Ausblenden eines Verlaufs nicht mehr. */
          if (d[(y * FELD + x) * 4 + 3] > 12) {
            if (x < x0) x0 = x; if (x > x1) x1 = x;
            if (y < y0) y0 = y; if (y > y1) y1 = y;
          }
        }
      }
      if (x1 < 0) { raus[e.schluessel] = null; continue; }
      const jePunkt = SPANNE / FELD;
      const bx = -200 + x0 * jePunkt, by = -200 + y0 * jePunkt;
      const bb = (x1 - x0 + 1) * jePunkt, bh = (y1 - y0 + 1) * jePunkt;
      const luft = Math.max(bb, bh) * 0.04;
      raus[e.schluessel] = { x: +(bx - luft).toFixed(2), y: +(by - luft).toFixed(2),
                             b: +(bb + luft * 2).toFixed(2), h: +(bh + luft * 2).toFixed(2) };
    }
    return raus;
  }, roh.map((e) => ({ schluessel: e.schluessel, kunst: e.kunst })));
  await br.close();

  const tafel = {};
  roh.forEach((e) => {
    const r = rahmen[e.schluessel];
    if (!r || !(r.b > 0) || !(r.h > 0)) throw new Error("Kein Rahmen messbar: " + e.schluessel);
    tafel[e.schluessel] = { de: e.de, emoji: e.emoji, satz: e.satz,
      rahmen: r.x + " " + r.y + " " + r.b + " " + r.h, kunst: e.kunst };
    console.log(e.schluessel.padEnd(10) + e.de.padEnd(20)
      + (e.kunst.length / 1024).toFixed(0).padStart(4) + " KB   Rahmen " + tafel[e.schluessel].rahmen);
  });

  const kopf = `/* =========================================================
   DIE GROSSEN GESCHENKE
   ---------------------------------------------------------
   GESCHRIEBEN von werkzeug/grossgeschenke-holen.js — nicht von
   Hand aendern.

   GEWUENSCHT: „wie TikTok das macht mit den grossen Geschenken."

   Die Tiere sind NICHT neu gezeichnet. Es sind dieselben, die in
   den Bilderwelten stehen: nachgemessen, Fassung fuer Fassung
   abgenommen und ausdruecklich so gewollt. Hier stehen sie nur
   ein zweites Mal, damit die Animation nicht die ganze
   Bilderwelt (ueber ein Megabyte) nachladen muss.

   Diese Datei faehrt beim Start NICHT mit. Sie wird erst geholt,
   wenn wirklich jemand ein grosses Geschenk schickt.

   „rahmen" ist der gemessene viewBox — in einem echten Browser
   mit getBBox() ermittelt, nicht geschaetzt.
   ========================================================= */
window.DMA_GESCHENK_GROSS = `;
  fs.writeFileSync(ZIEL, kopf + JSON.stringify(tafel) + ";\n", "utf8");
  const kb = (fs.statSync(ZIEL).size / 1024).toFixed(0);
  console.log("\ndata-grossgeschenke.js geschrieben: " + Object.keys(tafel).length
    + " Geschenke, " + kb + " KB");
})();
