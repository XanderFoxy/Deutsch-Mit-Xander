/* =====================================================================
   TIER-BIBLIOTHEK → BILDERWELT — DIE BRÜCKE (FASSUNG 880)
   ---------------------------------------------------------------------
   XANDER (Funk 299, wörtlich): „die nächste Priorität sollte der Abschluss
   der Tiere sein … kümmere Dich jetzt mal bitte intensiv um das alles“.
   Früher (03.10.): „perfekter Löwe … perfekter Wolf … wie in Jurassic Park“.

   FASSUNG 880 — Eine Szene der neuen Bilderwelt holt ihre Tiere ab jetzt
   direkt aus der Bibliothek (werkzeug/bilderwelt/tiere/<gruppe>.js), statt
   eigene Tierzeichnungen zu tippen. Bei JEDEM Bau wird die Art frisch
   geladen und gezeichnet – wird eine Art in der Bibliothek besser, ist sie
   beim nächsten Bau der Szene auch in der App besser.

   tierTeil(S, id, x, y, epm, o) → das angelegte Teil (wie S.teil)
     S    Szene aus neueSzene (bau.js)
     id   Art-id der Bibliothek („zebra“, „loewe“ …)
     x, y Fußpunkt in Szeneneinheiten: Mitte unten (Boden unter dem Tier)
     epm  Szeneneinheiten je Meter an dieser Stelle (aus der Perspektive
          der Szene, z. B. (y − Horizont) / Augenhöhe)
     o = {
       dir:     1 = Blick nach rechts (so ist die Art gezeichnet), −1 = nach links
       herde:   weitere Tiere derselben Art im SELBEN Teil (ein Wort, ein Tipp):
                [{ x, y, epm, dir, groesse }] in Szenenkoordinaten; epm/dir
                fehlen → wie das erste Tier; groesse = Faktor für ein kleineres
                oder größeres Einzeltier (Kuh/Bulle), Standard 1.
                Die Zeichnung steht dann EINMAL in den defs, jedes Tier ist ein
                <use> darauf (eine Herde kostet kaum mehr Bytes als ein Tier).
                Gezeichnet wird nach der Tiefe: kleines y (hinten) zuerst.
       tipp:    kurzer, wahrer Satz zum Tier – Pflicht, solange die Art in der
                Bibliothek keinen eigenen tipp hat (dann gilt der der Art)
       oben:    wie bei S.teil (kleines Ding auf einem größeren)
       schatten: false = kein Bodenschatten (z. B. Tier im Wasser)
       hinter / davor: zusätzliche Zeichnung (Szeneneinheiten, vom Fußpunkt aus)
                unter bzw. über dem Tier, gehört zum Teil (Wasser vor den Beinen,
                Grasbüschel vor den Hufen)
       teilId:  andere Teil-id (dieselbe Art zweimal als eigenes Wort)
       seed:    Zufallsstart der Zeichnung (Standard wie setze)
     }
   Ids bleiben eindeutig: jede Art bekommt ihr praefix (art.id, beim
   zweiten Teil derselben Art art.id + „2“ …), dazu das kuerzel der Szene.
   Gezeichnet wird im Szene-Modus setze(…, { fein: false }): gleiche
   Formen, sparsame Haare – Ladezeit und Zeichenzeit haben Vorrang.
   ===================================================================== */
"use strict";
const path = require("path");

const r2 = (n) => Math.round(n * 100) / 100;
const r4 = (n) => Math.round(n * 10000) / 10000;

/* Die Bibliothek wird bei jedem Bau (= jedem Aufruf von node …/szenen/<id>.js) frisch gelesen;
   innerhalb EINES Baus nur einmal. kern.js wird erst hier geladen: arbeitet gerade jemand an
   kern.js und ein Bau schlägt fehl, einfach erneut bauen. */
let KERN = null, ARTEN = null;
function kern() { if (!KERN) KERN = require(path.join(__dirname, "kern.js")); return KERN; }
function art(id) {
  if (!ARTEN) ARTEN = kern().alleArten();
  const a = ARTEN.find((x) => x.id === id);
  if (!a) throw new Error("tierTeil: Art „" + id + "“ fehlt in der Tier-Bibliothek");
  return a;
}

const zaehler = new WeakMap();   // je Szene: wie oft eine Art schon gesetzt wurde (für eindeutige praefixe)

function tierTeil(S, id, x, y, epm, o = {}) {
  const a = art(id);
  const tipp = a.tipp || o.tipp;
  if (!tipp) throw new Error("tierTeil: „" + id + "“ braucht einen tipp (die Art hat keinen)");
  if (!(epm > 0)) throw new Error("tierTeil: epm fehlt für „" + id + "“");
  const z = zaehler.get(S) || {}; zaehler.set(S, z);
  z[id] = (z[id] || 0) + 1;
  const praefix = o.praefix || (z[id] === 1 ? a.id : a.id + z[id]);
  const dir0 = o.dir === -1 ? -1 : 1;
  const herde = (o.herde || []).map((h) => ({ x: h.x, y: h.y, epm: (h.epm || epm) * (h.groesse || 1), dir: h.dir === -1 ? -1 : h.dir === 1 ? 1 : dir0 }));
  const { setze } = kern();
  let kunst, box;
  if (!herde.length) {
    /* ein Tier: direkt in Szeneneinheiten (setze legt Bodenschatten und Kontaktschatten an) */
    const t = setze(S, a, 0, 0, epm, { fein: false, dir: dir0, praefix, seed: o.seed, schatten: o.schatten });
    kunst = t.roh;
    box = t.box;
  } else {
    /* Herde: EINE Zeichnung in Zentimetern (epm 100 → Maßstab 1) mit Schatten in die defs,
       jedes Tier ein <use> mit eigenem Ort, Maßstab und Blickrichtung. */
    const t = setze(S, a, 0, 0, 100, { fein: false, dir: 1, praefix, seed: o.seed, schatten: o.schatten });
    const bid = S.id(praefix + "_bild");
    S.def(`<g id="${bid}">${t.roh}</g>`);
    const alle = [{ x, y, epm, dir: dir0 }, ...herde].sort((p, q) => p.y - q.y);
    kunst = alle.map((m) => {
      const k = m.epm / 100;
      return `<use href="#${bid}" transform="translate(${r2(m.x - x)} ${r2(m.y - y)}) scale(${r4(m.dir * k)} ${r4(k)})"/>`;
    }).join("");
    box = alle.reduce((b, m) => {
      const k = m.epm / 100, [x0, y0, x1, y1] = t.box;
      const bx0 = m.dir === 1 ? x0 : -x1, bx1 = m.dir === 1 ? x1 : -x0;
      return [Math.min(b[0], m.x - x + bx0 * k), Math.min(b[1], m.y - y + y0 * k), Math.max(b[2], m.x - x + bx1 * k), Math.max(b[3], m.y - y + y1 * k)];
    }, [Infinity, Infinity, -Infinity, -Infinity]);
  }
  kunst = (o.hinter || "") + kunst + (o.davor || "");
  const teil = { id: o.teilId || a.id, de: a.de, syl: a.syl, it: a.it, itSyl: a.itSyl, en: a.en, x, y, kunst, tipp };
  if (o.oben) teil.oben = true;
  const t = S.teil(teil);
  /* Maße für den Szenenbau (werden nicht in die Szene geschrieben): Umriss relativ zum Fußpunkt, Art */
  Object.defineProperty(t, "box", { value: box, enumerable: false });
  Object.defineProperty(t, "art", { value: { id: a.id, laenge: a.laenge, hoehe: a.hoehe }, enumerable: false });
  return t;
}

/* Maße einer Art (Meter), ohne sie zu zeichnen – zum Planen einer Szene */
function masse(id) { const a = art(id); return { laenge: a.laenge, hoehe: a.hoehe }; }

module.exports = { tierTeil, masse };
