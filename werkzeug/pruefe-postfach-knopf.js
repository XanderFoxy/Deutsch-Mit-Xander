/* PRÜFT, OB AUS DER EINLADUNG EIN KNOPF WIRD — UND OB ER HINFÜHRT.
   ---------------------------------------------------------------
   GEMELDET: „Im Briefkasten steht nur die Adresszeile, wenn man zum
   Unterricht soll, aber es ist kein Sprunglink, der direkt in diesen
   Raum befördert. Wir hatten früher das immer so, dass man das
   anklicken konnte über eine Schaltfläche."

   Zwei Dinge werden gemessen, keins davon behauptet:
     1. Trägt der Text der Einladung die Marke [RAUM:…]? Nur daraus
        baut das Postfach den Knopf.
     2. Führt der Knopf dorthin, wo das Klassenzimmer WIRKLICH ist?
        (Er suchte es unter „Lernen" — es hängt unter „Wissen".) */
const fs = require("fs");
const W = "/home/user/Deutsch-Mit-Xander";
const lc = fs.readFileSync(W + "/livechat.js", "utf8");
const app = fs.readFileSync(W + "/app.js", "utf8");
const html = fs.readFileSync(W + "/index.html", "utf8");

let fehler = 0;
const pruef = (was, ok, dazu) => {
  console.log((ok ? "  ✅ " : "  ❌ ") + was + (dazu ? "   " + dazu : ""));
  if (!ok) fehler++;
};

console.log("Die Einladung:");
pruef("Einzel-Einladung trägt [RAUM:…]", /\[RAUM:" \+ zustand\.raum \+ "\]/.test(lc));
pruef("Ruf zum Unterricht trägt [RAUM:…]", (lc.match(/\[RAUM:" \+ zustand\.raum \+ "\]/g) || []).length >= 2);

console.log("\nDas Postfach:");
pruef("baut aus [RAUM:…] einen Knopf", /data-raum-rein="\$\{raumMatch\[1\]\}/.test(app));

console.log("\nWohin der Knopf führt:");
/* In welcher Unterleiste steht das Klassenzimmer wirklich? */
const inLernen = /id="learnSubnav"[\s\S]*?sub-livechat/.test(html)
  && html.indexOf('sub-livechat') < html.indexOf('id="knowledgeSubnav"');
const knopfSuchtLernen = /#learnSubnav \[data-sub="sub-livechat"\]/.test(app);
pruef("Klassenzimmer hängt unter „Wissen“", !inLernen, inLernen ? "(steht unter Lernen)" : "");
pruef("Knopf sucht es NICHT mehr unter „Lernen“", !knopfSuchtLernen);
pruef("Knopf sucht knowledgeSubnav", /#knowledgeSubnav \[data-sub="sub-livechat"\]/.test(app));
pruef("Knopf hat einen Rückfall für alle Bereiche",
  /\.subnav-pill\[data-sub="sub-livechat"\]/.test(app));

console.log(fehler === 0
  ? "\n✅ Aus der Einladung wird ein Knopf, und der Knopf findet den Raum."
  : "\n❌ " + fehler + " Punkt(e) stimmen noch nicht.");
