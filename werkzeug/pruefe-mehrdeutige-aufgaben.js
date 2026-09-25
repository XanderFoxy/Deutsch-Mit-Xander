/* PRÜFT, OB LÜCKENAUFGABEN EINE MITRICHTIGE ANTWORT ALS „FALSCH“ FÜHREN.
   ---------------------------------------------------------------
   GEWÜNSCHT (Xander): „Scannen auch nach unsinnigen Fragen … wo man
   gehen oder fahren sagen kann, dann darf das nicht falsch sein."

   Maßstab ist Duden/Standarddeutsch. Die Sonde lädt data-uebungen.js
   mit einem window-Ersatz (ohne Browser) und prüft alle deutschen
   Kategorien (it-… bleiben außen vor) auf die bekannten Muster, bei
   denen der Ablenker in Wahrheit AUCH stimmt:
     1. wenn ↔ falls              (außer „immer/stets/jedes Mal“, konzessives „wenn … auch“)
     2. sowohl … als ↔ wie auch
     3. desto ↔ umso
     4. Konjunktiv I ↔ Indikativ/Konjunktiv II in der Redewiedergabe
     5. kennen ↔ wissen + Nomen (Antwort, Weg, Nummer, Uhrzeit …)
     6. Bewegungsverben (gehen/laufen/fahren/kommen) ohne entscheidenden
        Hinweis wie „zu Fuß“ oder ein Verkehrsmittel
     7. müssen ↔ sollen
   Dazu allgemein: jede Aufgabe hat mindestens 2 Ablenker, keine
   Dubletten, und kein Ablenker ist gleich der Lösung.

   Aufruf:  node werkzeug/pruefe-mehrdeutige-aufgaben.js [datei]
            ohne Angabe: data-uebungen.js im Projektordner.
   Ergebnis: Ausgang 0 = grün, 1 = rot (Funde werden aufgelistet). */
const fs = require("fs"), vm = require("vm"), path = require("path");
const datei = process.argv[2] || path.join(__dirname, "..", "data-uebungen.js");
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(datei, "utf8"), ctx);
const Z = ctx.window.DMA_DATEN.ZUSATZ_FRAGEN;

/* Bewusst belassen: der Satz selbst entscheidet (Kontext), obwohl das
   Wortpaar sonst mehrdeutig wäre. Grund steht jeweils dabei. */
const BELASSEN = {
  "Die Mitarbeiter ___ die Hintergründe des Konflikts nur oberflächlich.": "„nur oberflächlich“ passt zu kennen (Vertrautheit), nicht zu wissen",
  "Der Professor bat, die Studenten ___ ihre Handys ausschalten.": "nach „bat“ passt keine Pflicht „mussten“",
  "Bei Streitigkeiten zwischen den Vertragsparteien soll ausschließlich deutsches Recht zur Anwendung ___ .": "feste Fügung „zur Anwendung kommen“",
};

const klein = (s) => String(s).trim().toLowerCase();
const genau = (s) => String(s).trim();   // Groß/klein zählt (ihr ≠ Ihr)
const funde = {};
const melde = (muster, k, q, info) => (funde[muster] = funde[muster] || []).push(`${k}: ${q[0]}  → Lösung „${q[1]}“, mitrichtig „${info}“`);

const BERICHT = /\b(sagt|sagte|behauptet|behauptete|meint|meinte|erklärt|erklärte|berichtet|berichtete|betont|betonte|gab an|gibt an|teilt mit|teilte mit|heißt es|hieß es|erzählt|erzählte|versichert|versicherte|schreibt|schrieb|antwortet|antwortete|laut|zufolge|berichtet wird|Sprecher|Sprecherin)\b/i;
const KONJ1 = {
  sei: ["ist", "wäre"], seien: ["sind", "wären"], habe: ["hat", "hätte"], werde: ["wird", "würde"],
  "müsse": ["muss", "müsste"], wolle: ["will", "würde", "wollte"], "könne": ["kann", "könnte"],
  "dürfe": ["darf", "dürfte"], gebe: ["gibt", "würde geben", "gäbe"], bleibe: ["bleibt", "würde bleiben", "bliebe"],
  stehe: ["steht", "würde stehen", "stünde"], wisse: ["weiß", "wüsste"],
};
// Personen: 1s 2s 3s 1p 2p 3p, Präteritum mit „p“ davor, Partizip „pp“
const formen = (t) => { const o = {}; for (const [f, ps] of t) o[f] = (o[f] || []).concat(ps); return o; };
const WISSEN = formen([["weiß", ["1s", "3s"]], ["weißt", ["2s"]], ["wissen", ["1p", "3p"]], ["wisst", ["2p"]],
  ["wusste", ["p1s", "p3s"]], ["wusstest", ["p2s"]], ["wussten", ["p1p", "p3p"]], ["wusstet", ["p2p"]], ["gewusst", ["pp"]]]);
const KENNEN = formen([["kenne", ["1s"]], ["kennst", ["2s"]], ["kennt", ["3s", "2p"]], ["kennen", ["1p", "3p"]],
  ["kannte", ["p1s", "p3s"]], ["kanntest", ["p2s"]], ["kannten", ["p1p", "p3p"]], ["kanntet", ["p2p"]], ["gekannt", ["pp"]]]);
// Welche Personen kann das Subjekt am Satzanfang sein? („Sie“ = sie/Sie: 3s oder 3p)
function subjektPersonen(f) {
  const w = f.trim().split(/\s+/)[0];
  const alle = (ps) => ps.flatMap((p) => [p, "p" + p]).concat("pp");
  if (w === "Ich") return alle(["1s"]);
  if (w === "Du") return alle(["2s"]);
  if (w === "Wir") return alle(["1p"]);
  if (w === "Ihr") return alle(["2p"]);
  return alle(["3s", "3p"]);
}
const WK_NOMEN = /___\s+(die|den|das|der|deine|seine|ihre|meine|unsere|eure|Ihre|dein|sein|ihr|mein)\s+(Antwort|Weg|Lösung|Adresse|Namen|Name|Nummer|Telefonnummer|Wahrheit|Grund|Ergebnis|Uhrzeit|Termin|Preis|Datum|Geheimnis|Passwort|Ursache|Hintergründe|Details|Fakten|Einzelheiten|Bedeutung|Öffnungszeiten|Route|Code|Formel)\b/;
const BEW = {
  geh: ["gehe", "gehst", "geht", "gehen", "ging", "gingst", "gingen", "gingt", "gegangen"],
  fahr: ["fahre", "fährst", "fährt", "fahren", "fuhr", "fuhrst", "fuhren", "fuhrt", "gefahren"],
  lauf: ["laufe", "läufst", "läuft", "laufen", "lief", "liefst", "liefen", "lieft", "gelaufen"],
  komm: ["komme", "kommst", "kommt", "kommen", "kam", "kamst", "kamen", "kamt", "gekommen"],
};
const slot = {}; for (const L in BEW) BEW[L].forEach((f, i) => (slot[f] = slot[f] || []).push([L, i]));
const VERKEHRSMITTEL = /\b(Auto|Wagen|Bus|Zug|Bahn|U-Bahn|S-Bahn|Rad|Fahrrad|Taxi|Flugzeug|Schiff|Fähre|Straßenbahn|Motorrad|Roller|Möbelwagen|Krankenwagen)\b/;
const ZU_FUSS = /\bzu Fuß/;                                        // kein \b nach „ß“ (kein Wortzeichen)
const MS = { muss: "soll", musst: "sollst", "müssen": "sollen", "müsst": "sollt", musste: "sollte", mussten: "sollten", musstest: "solltest" };

let aufgaben = 0;
for (const k of Object.keys(Z)) {
  if (k.startsWith("it-")) continue;
  for (const q of Z[k]) {
    if (!Array.isArray(q) || typeof q[0] !== "string") continue;
    aufgaben++;
    const f = q[0], L = klein(q[1]), F = (q[2] || []).map(klein);
    /* allgemein (genau verglichen: „ihr“ und „Ihr“ sind verschiedene Antworten) */
    const Fg = (q[2] || []).map(genau);
    if (Fg.length < 2) melde("allgemein: weniger als 2 Ablenker", k, q, Fg.join("/"));
    if (new Set(Fg).size !== Fg.length) melde("allgemein: doppelter Ablenker", k, q, Fg.join("/"));
    if (Fg.includes(genau(q[1]))) melde("allgemein: Ablenker = Lösung", k, q, genau(q[1]));
    if (!f.includes("___") || BELASSEN[f]) continue;
    /* 1. wenn ↔ falls */
    if ((L === "wenn" && F.includes("falls")) || (L === "falls" && F.includes("wenn"))) {
      const immer = /\b(immer|stets|jedes Mal)\b/i.test(f);
      const konzessiv = L === "wenn" && /___[^,]*\bauch\b/.test(f);
      const wendung = /___ man es genau nimmt/.test(f);
      // irrealer Bedingungssatz: „falls“ setzt eine offene Möglichkeit voraus
      const irreal = L === "wenn" && /\b(wäre|wären|hätte|hätten|lägen|könnte)\b/.test(f.slice(f.indexOf("___")).split(",")[0]);
      if (!immer && !konzessiv && !wendung && !irreal) melde("1 wenn ↔ falls", k, q, L === "wenn" ? "falls" : "wenn");
    }
    /* 2. sowohl … als ↔ wie */
    if (/sowohl/i.test(f) && /^als( auch)?$/.test(L) && F.some((x) => /^wie( auch)?$/.test(x))) melde("2 sowohl … als/wie auch", k, q, "wie");
    /* 3. desto ↔ umso */
    if ((L === "desto" && F.includes("umso")) || (L === "umso" && F.includes("desto"))) melde("3 desto ↔ umso", k, q, L === "desto" ? "umso" : "desto");
    /* 4. Konjunktiv I in der Redewiedergabe */
    if (KONJ1[L] && BERICHT.test(f)) { const x = F.find((y) => KONJ1[L].includes(y)); if (x) melde("4 Konjunktiv I ↔ Indikativ/Konj. II", k, q, x); }
    /* 5. kennen/wissen + Nomen – dieselbe Person des anderen Verbs ist mitrichtig */
    if (WK_NOMEN.test(f)) {
      const personen = subjektPersonen(f);
      for (const [A, B] of [[WISSEN, KENNEN], [KENNEN, WISSEN]]) {
        const pers = (A[L] || []).filter((p) => personen.includes(p));
        const mit = F.filter((x) => (B[x] || []).some((p) => pers.includes(p)));
        mit.forEach((x) => melde("5 kennen ↔ wissen + Nomen", k, q, x));
      }
    }
    /* 6. Bewegungsverben ohne entscheidenden Hinweis */
    if (slot[L]) for (const x of F) {
      if (!slot[x]) continue;
      const paar = slot[L].flatMap(([L1, i1]) => slot[x].filter(([L2, i2]) => L1 !== L2 && i1 === i2).map(([L2]) => [L1, L2].sort().join("/")));
      for (const p of new Set(paar)) {
        let mehrdeutig;
        if (p === "geh/lauf") mehrdeutig = true;                                   // regional gleichbedeutend
        else if (p === "fahr/geh" || p === "fahr/lauf") mehrdeutig = !VERKEHRSMITTEL.test(f) && !ZU_FUSS.test(f);
        else mehrdeutig = !VERKEHRSMITTEL.test(f) && !ZU_FUSS.test(f);            // kommen ↔ gehen/fahren/laufen
        if (mehrdeutig) melde("6 Bewegungsverb ohne Hinweis (" + p + ")", k, q, x);
      }
    }
    /* 7. müssen ↔ sollen */
    for (const a in MS) if ((L === a && F.includes(MS[a])) || (L === MS[a] && F.includes(a))) melde("7 müssen ↔ sollen", k, q, L === a ? MS[a] : a);
  }
}

const muster = Object.keys(funde).sort();
const summe = muster.reduce((s, m) => s + funde[m].length, 0);
console.log(`Datei: ${path.relative(process.cwd(), datei) || datei}`);
console.log(`Geprüft: ${aufgaben} deutsche Aufgaben in ${Object.keys(Z).filter((k) => !k.startsWith("it-")).length} Kategorien`);
if (!summe) { console.log("\x1b[32mGRÜN\x1b[0m – keine mitrichtige Antwort als Ablenker, alle Grundregeln erfüllt."); process.exit(0); }
for (const m of muster) {
  console.log(`\n\x1b[31m✗ ${m}: ${funde[m].length}\x1b[0m`);
  funde[m].slice(0, 5).forEach((z) => console.log("   " + z));
  if (funde[m].length > 5) console.log(`   … und ${funde[m].length - 5} weitere`);
}
console.log(`\n\x1b[31mROT\x1b[0m – ${summe} Funde.`);
process.exit(1);
