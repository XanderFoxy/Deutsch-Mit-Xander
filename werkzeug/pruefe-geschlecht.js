#!/usr/bin/env node
/* =========================================================
   PRUEFT: ERKENNT DIE WARTEMELDUNG, DASS EMMI EINE FRAU IST?
   ---------------------------------------------------------
   GEWUENSCHT: „Wenn die Blase mich erinnert, dass ich noch warten
   soll, weil jemand spricht, dann soll sie korrekt erkennen, wenn
   Emmi spricht, dass es eine Frau ist. Sie hat ja in ihrem Profil
   dieses Geschlechtszeichen — das soll auch erkannt werden."

   Gemessen wird am echten Quelltext: die Sprachregelung wird aus
   livechat.js herausgeschnitten und mit erfundenen Leuten im Raum
   ausgefuehrt. Nichts wird nachgebaut — waere der Code anders,
   stuenden hier andere Saetze.
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

const teil1 = schnitt("var geschlechter = {};", 'function wennFertig(g) { return "wenn " + fuerwort(g) + " fertig ist"; }');
const teil2 = schnitt("  function darfSprechen() {", "\n  }");

const bauen = new Function("zustand", "fokusAn", "liveHalter",
  teil1 + "\n" +
  "var liveLaeuftGerade = null;\n" +
  "function liveLaeuft(w) { liveLaeuftGerade = w || null; }\n" +
  /* darfSprechen() fragt inzwischen auch, ob die Leitung HAENGT
     (liveHaengtFest) — das kam mit dem Wachhund fuer den gruenen
     Balken dazu. Diese Sonde schneidet nur ein Stueck aus der Datei
     heraus; die Funktion liegt ausserhalb davon. Hier steht sie
     deshalb als Attrappe: „haengt nie". Sonst bricht die Sonde ab,
     obwohl am Geschlecht nichts kaputt ist. */
  "function liveHaengtFest() { return false; }\n" +
  teil2 + "\n" +
  "return { geschlechtMerken: geschlechtMerken, geschlechtVon: geschlechtVon," +
  " fuerwort: fuerwort, bisFertig: bisFertig, wennFertig: wennFertig," +
  " liveLaeuft: liveLaeuft, darfSprechen: darfSprechen };");

let fehler = 0;
function pruefe(was, ist, soll) {
  const gut = ist === soll;
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + ": „" + ist + "“" + (gut ? "" : "   erwartet: „" + soll + "“"));
}

console.log("\nWER SPRICHT — UND WIE HEISST DAS DANN?\n");

const faelle = [
  ["Emmi", "weiblich",  "sie"],
  ["Alex", "maennlich", "er"],
  ["Kim",  "divers",    "die Person"],
  ["Reza", "",          "die Person"],
  ["Nina", "♀",    "sie"],          // das blanke Symbol aus dem Profil
  ["Tom",  "♂",    "er"]
];

faelle.forEach(function (f) {
  const zustand = { ichId: "ich", leute: {} };
  const L = bauen(zustand, function () { return true; });
  zustand.leute["fremd"] = { id: "fremd", name: f[0] };
  L.geschlechtMerken("fremd", f[1]);
  L.liveLaeuft({ von: "fremd", name: f[0] });
  const d = L.darfSprechen();
  pruefe(f[0] + " (" + (f[1] || "ohne Angabe") + ")", "Dein Mikrofon wartet, " + L.bisFertig(d.geschlecht) + ".",
         "Dein Mikrofon wartet, bis " + f[2] + " fertig ist.");
  pruefe(f[0] + " — zweiter Hinweis", "Sag es gleich noch einmal, " + L.wennFertig(d.geschlecht) + ".",
         "Sag es gleich noch einmal, wenn " + f[2] + " fertig ist.");
});

console.log("\nDAS ZEICHEN MUSS AUCH ANKOMMEN\n");
[["puls", 1], ["hallo", 3], ["auch-da", 2], ["sprachteil", 1]].forEach(function (p) {
  const wie = (quelle.match(new RegExp('art: "' + p[0] + '"', "g")) || []).length;
  console.log("  " + p[0] + ": " + wie + " Stellen im Quelltext");
});
const mit = (quelle.match(/geschlecht: zustand\.geschlecht \|\| ""/g) || []).length;
console.log("  Pakete, die das Zeichen mitnehmen: " + mit);
if (mit < 8) { console.log("  FEHL — zu wenige Pakete tragen das Zeichen"); fehler++; }

const altText = quelle.indexOf("Sag es gleich noch einmal, wenn er fertig ist");
console.log("\n  Alter Satz mit festem „er\": " + (altText < 0 ? "nicht mehr vorhanden — gut" : "STEHT NOCH DA"));
if (altText >= 0) fehler++;

console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Alles wie gewuenscht.") + "\n");
process.exit(fehler ? 1 : 0);
