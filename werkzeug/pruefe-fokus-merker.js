#!/usr/bin/env node
/* =========================================================
   PRUEFT: UEBERLEBT DIE FOKUS-REGEL DAS NEULADEN?
   ---------------------------------------------------------
   GEMELDET: „Ich hab es extra eingestellt, dass wir uns alle
   gleichzeitig hoeren koennen, und trotzdem geht es nicht …
   bei ihr stand im Screenshot auch Fokus."

   Die Regel gehoert dem RAUM und wird vom Haeuptling gesetzt.
   Die Luecke: laedt der Haeuptling neu, kam er mit der
   Voreinstellung „an" zurueck — und weil alle anderen die Regel
   von IHM uebernehmen, schaltete sein Neuladen sie allen wieder
   ein. Das Umschalten sah aus, als haette es nie gewirkt.

   Gemessen wird am echten Quelltext: die drei Funktionen werden
   aus livechat.js herausgeschnitten und mit einem nachgebauten
   localStorage ausgefuehrt. Waere der Code anders, faellt die
   Sonde um.
   ========================================================= */
const fs = require("fs");
const path = require("path");
const quelle = fs.readFileSync(path.join(__dirname, "..", "livechat.js"), "utf8");

function schnitt(von, bis) {
  const a = quelle.indexOf(von);
  const b = quelle.indexOf(bis, a);
  if (a < 0 || b < 0) { console.error("Nicht gefunden: " + von); process.exit(1); }
  return quelle.slice(a, b + bis.length);
}

const merker = schnitt('var FOKUS_SCHLUESSEL = "dma_livechat_fokus_";',
                       "} catch (e) { return undefined; }\n  }");
const fokusAn = schnitt("  function fokusAn() {", "  }");

/* Ein Gedaechtnis, wie es der Browser hat — und eines, das
   nichts behaelt (privates Fenster). Beides muss gehen. */
function bauen(speicher) {
  const localStorage = {
    _d: speicher,
    getItem(k) { return Object.prototype.hasOwnProperty.call(this._d, k) ? this._d[k] : null; },
    setItem(k, v) { this._d[k] = String(v); },
    removeItem(k) { delete this._d[k]; },
  };
  const zustand = { raum: "klassenzimmer", fokus: undefined };
  const f = new Function("localStorage", "zustand",
    merker + "\n" + fokusAn + "\n" +
    "function fokusSetzen(an) { zustand.fokus = Boolean(an);" +
    " fokusMerken(zustand.raum, zustand.fokus); return fokusAn(); }\n" +
    "function betreten() { zustand.fokus = gemerkterFokus(zustand.raum); return fokusAn(); }\n" +
    "return { fokusAn: fokusAn, fokusSetzen: fokusSetzen, betreten: betreten," +
    " gemerkterFokus: gemerkterFokus, zustand: zustand };");
  return f(localStorage, zustand);
}

let fehler = 0;
function pruefe(was, ist, soll) {
  const gut = ist === soll;
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + ": " + ist + (gut ? "" : "   erwartet: " + soll));
}

console.log("\nDIE REGEL DES RAUMS — UND DAS NEULADEN\n");

const speicher = {};
const erst = bauen(speicher);
pruefe("frisch im Raum: Fokus an (Voreinstellung)", erst.betreten(), true);
pruefe("Haeuptling schaltet ab", erst.fokusSetzen(false), false);

/* Jetzt laedt derselbe Mensch die Seite neu: neuer Zustand,
   gleiches Geraet, gleicher Speicher. */
const nachNeuladen = bauen(speicher);
pruefe("nach dem Neuladen bleibt er AUS", nachNeuladen.betreten(), false);

pruefe("wieder eingeschaltet", nachNeuladen.fokusSetzen(true), true);
pruefe("und das bleibt auch", bauen(speicher).betreten(), true);

console.log("\nEIN ANDERES GERAET DARF NICHTS AUFDRAENGEN\n");
const fremd = bauen({});
pruefe("ohne Merker gilt die Voreinstellung", fremd.betreten(), true);
pruefe("und es steht nichts im Gedaechtnis", String(fremd.gemerkterFokus("klassenzimmer")), "undefined");

console.log("\nEIN PRIVATES FENSTER DARF NICHT UMFALLEN\n");
const ohneSpeicher = (function () {
  const zustand = { raum: "klassenzimmer", fokus: undefined };
  const ls = { getItem() { throw new Error("gesperrt"); },
               setItem() { throw new Error("gesperrt"); },
               removeItem() { throw new Error("gesperrt"); } };
  const f = new Function("localStorage", "zustand",
    merker + "\n" + fokusAn + "\n" +
    "function betreten() { zustand.fokus = gemerkterFokus(zustand.raum); return fokusAn(); }\n" +
    "function setzen(a){ zustand.fokus=Boolean(a); fokusMerken(zustand.raum,zustand.fokus); return fokusAn(); }\n" +
    "return { betreten: betreten, setzen: setzen };");
  return f(ls, zustand);
})();
let stuerzt = false;
try { ohneSpeicher.betreten(); ohneSpeicher.setzen(false); } catch (e) { stuerzt = true; }
pruefe("gesperrter Speicher wirft die Seite nicht um", stuerzt, false);

console.log("\nDER MERKER GEHOERT ZUM RAUM, NICHT ZUR SEITE\n");
const zwei = bauen({});
zwei.zustand.raum = "klassenzimmer"; zwei.fokusSetzen(false);
zwei.zustand.raum = "cafe";
pruefe("anderer Raum, eigene Regel", zwei.betreten(), true);
zwei.zustand.raum = "klassenzimmer";
pruefe("und der erste Raum weiss es noch", zwei.betreten(), false);

console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Die Regel bleibt, wo sie hingehoert.") + "\n");
process.exit(fehler ? 1 : 0);
