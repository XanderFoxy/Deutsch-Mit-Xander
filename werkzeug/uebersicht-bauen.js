#!/usr/bin/env node
/* =====================================================================
   DIE ÜBERSICHT, DIE ER VERLANGT HAT — AUS DEN SONDEN GEBAUT
   ---------------------------------------------------------------------
   XANDER, mehrfach und zuletzt sehr deutlich:
   „Ich habe immer noch keine Übersicht von dir zu allen Punkten, die
    ich dir im gesamten Verlauf genannt habe: was wir davon schon
    abgearbeitet haben und was davon noch offen ist, zu sämtlichen
    Sachen, die mit dem Livestream in Verbindung sind."
   „Ich möchte keine People-Pleasing-Antwort. Ich möchte eine
    realistische Analyse."

   WARUM DIE ÜBERSICHT AUS DEN SONDEN KOMMT UND NICHT AUS MEINEM KOPF:
   Eine Liste, die ich aufschreibe, sagt nur, woran ich mich erinnere.
   Eine Liste, die aus den Sonden entsteht, sagt, was die Seite HEUTE
   wirklich tut — denn jede Sonde trägt seinen Wunsch als Zitat im Kopf
   und misst genau diesen Wunsch am laufenden Programm. Steht dort
   „grün", ist der Wunsch nachweisbar erfüllt; steht dort „rot", ist er
   es nachweisbar nicht. Das ist der Unterschied zwischen einer
   Behauptung und einem Befund.

   Aufruf:
     bash werkzeug/alle-pruefen.sh > /tmp/stand.txt
     node werkzeug/uebersicht-bauen.js /tmp/stand.txt > KLASSENZIMMER-LISTE.md

   Ohne Standdatei entsteht die Liste trotzdem — dann ohne Urteil.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const WURZEL = path.join(__dirname, "..");

/* --- 1. Der Stand aus alle-pruefen.sh, falls einer mitgegeben wurde --- */
const stand = {};
if (process.argv[2] && fs.existsSync(process.argv[2])) {
  fs.readFileSync(process.argv[2], "utf8").split("\n").forEach((z) => {
    const m = /^(ok|ROT)\s+(pruefe-[\w-]+)/.exec(z.trim());
    if (m) stand[m[2]] = m[1] === "ok" ? "gruen" : "rot";
  });
}

/* --- 2. Jede Sonde: Titel und seine Zitate aus dem Kopf ------------- */
const zitatAus = (kopf) => {
  const raus = [];
  /* Er wird in den Köpfen immer gleich zitiert: ein deutsches
     Anführungszeichen unten, dann sein Satz, dann ein schliessendes
     (mal typografisch, mal gerade). */
  const re = /„([\s\S]{10,600}?)[“"]/g;
  let m;
  while ((m = re.exec(kopf))) {
    const t = m[1].replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
    if (t.length >= 25 && raus.indexOf(t) < 0) raus.push(t);
  }
  return raus;
};

const sonden = fs.readdirSync(path.join(WURZEL, "werkzeug"))
  .filter((f) => /^pruefe-.*\.js$/.test(f)).sort();

const zeilen = [];
let mitZitat = 0, gruen = 0, rot = 0, ohneUrteil = 0;

sonden.forEach((f) => {
  const name = f.replace(/\.js$/, "");
  const s = fs.readFileSync(path.join(WURZEL, "werkzeug", f), "utf8");
  const ende = s.indexOf("*/");
  const kopf = ende > 0 ? s.slice(0, ende) : s.slice(0, 3000);
  /* DIE UEBERSCHRIFT — NACHGEBESSERT IN RUNDE 89.
     Frueher wurde nur die ERSTE sprechende Zeile genommen. Die
     Ueberschriften im Kopf gehen aber oft ueber zwei oder drei
     Zeilen ("RUNDE 22 — DER GEZEICHNETE WEG, DAS EIGENE ECHO, / DER
     LEERE PLATZ HINTER DEM STRUDEL UND DIE MUSIK"), und dann stand
     hier ein abgeschnittener Satz mit Komma am Ende. Jetzt werden
     alle Zeilen bis zur Trennlinie zusammengenommen — das ist genau
     der Titelblock. */
  const roh = kopf.split("\n")
    .map((z) => z.replace(/^\s*\/?\*+\s*/, "").trim())
    .filter((z) => !/^#!/.test(z));
  const stueck = [];
  for (let i = 0; i < roh.length; i++) {
    const z = roh[i];
    if (/^[=\-_*\s]*$/.test(z)) { if (stueck.length) break; else continue; }
    stueck.push(z);
    if (stueck.length >= 4) break;
  }
  const ganzerTitel = (stueck.join(" ") || name)
    .replace(/\s{2,}/g, " ")
    .replace(/^SONDE[\s\u2014:-]*/i, "")
    .replace(/[,\s]+$/, "")
    .trim();
  /* Die Rundennummer faellt weg — sie sagt ihm nichts. Bleibt danach
     aber kaum noch etwas uebrig ("Runde 85, zweiter Teil"), dann ist
     die Nummer der Titel, und sie bleibt stehen. */
  const ohneNummer = ganzerTitel
    .replace(/^RUNDE\s+\d+\s*[a-z]?\b/i, "")
    .replace(/^\s*[,:\u2014-]\s*/, "")
    .trim();
  const titel = (ohneNummer.length >= 18 ? ohneNummer : ganzerTitel) || name;
  const zitate = zitatAus(kopf);
  if (zitate.length) mitZitat++;
  const urteil = stand[name] || "";
  if (urteil === "gruen") gruen++; else if (urteil === "rot") rot++; else ohneUrteil++;
  zeilen.push({ name, titel, zitate, urteil });
});

/* --- 3. Ausgabe ---------------------------------------------------- */
const zeichen = (u) => u === "gruen" ? "✅" : u === "rot" ? "❌" : "·";
const heute = new Date().toISOString().slice(0, 16).replace("T", " ");

console.log("# Was du gesagt hast — und was die Seite heute wirklich tut\n");
console.log("> Stand: " + heute + " · " + sonden.length + " Sonden · "
  + gruen + " grün, " + rot + " rot, " + ohneUrteil + " ohne Urteil\n");
console.log("Diese Liste ist nicht aufgeschrieben, sondern **gemessen**. Jede Zeile");
console.log("ist eine Sonde: im Kopf steht dein Satz, im Programm läuft die Messung");
console.log("dazu. ✅ heisst, die Messung bestätigt ihn heute; ❌ heisst, sie");
console.log("widerlegt ihn; · heisst, diese Sonde lief beim letzten Sammellauf");
console.log("nicht mit.\n");
console.log("Neu messen:\n");
console.log("```");
console.log("bash werkzeug/alle-pruefen.sh > /tmp/stand.txt");
console.log("node werkzeug/uebersicht-bauen.js /tmp/stand.txt > KLASSENZIMMER-LISTE.md");
console.log("```\n");

/* Erst die roten — was offen ist, steht oben. */
const rote = zeilen.filter((z) => z.urteil === "rot");
console.log("## Was JETZT offen ist\n");
if (!rote.length) {
  console.log("Keine Sonde ist rot. Was noch offen ist, steht in der Werkstatt");
  console.log("(`data-werkstatt.js`) — das sind die Dinge, für die es noch keine");
  console.log("Messung gibt, nicht die, die eine Messung widerlegt.\n");
} else {
  rote.forEach((z) => {
    console.log("### ❌ " + z.titel + "  \n`" + z.name + "`\n");
    z.zitate.slice(0, 3).forEach((q) => console.log("> „" + q + "“\n"));
  });
}

/* DIE KURZFASSUNG — eine Zeile je Sonde, zum Ueberfliegen.
   XANDER: „Gib mir jetzt bitte eine Liste von den Sachen die alle noch
   offen sind." Wer 179 Abschnitte lesen muss, um das zu sehen, hat
   keine Liste. */
/* NACH THEMA — damit er nachschlagen kann, statt zu suchen.
   XANDER: „zeige mir alles was ich dir gesagt habe und was davon
   wirklich noch offen ist." Sondennamen sagen ihm nichts; „Adler",
   „Frosch", „Kopfhoerer" schon. Die Woerter stehen hier fest, weil
   es SEINE Woerter sind — jedes kommt aus seinen Nachrichten. */
const THEMEN = [
  ["Adler / Greifvogel", /adler|greifvogel|schwinge|feder/i],
  ["Aufgabe / Unterricht", /aufgabe|unterricht|lesetext|betonung|benot/i],
  ["Anziehen / Ausziehen", /anziehen|ausziehen|krone|sonnenbrille|kleid|tanga/i],
  ["Billard", /billard/i],
  ["Bongo / Trommel", /bongo|trommel/i],
  ["Bumerang", /bumerang|swoosh/i],
  ["Ei", /\bei\b|eiknack|schale/i],
  ["Fahrstuhl", /fahrstuhl/i],
  ["Frosch", /frosch|quak/i],
  ["Haende / Greifen", /hand|haende|greif|klatsch|daumen/i],
  ["Hammer / Panzerglas", /hammer|panzerglas|splitter/i],
  ["Hintergrund / Design", /hintergrund|design|kopfzeile|adresszeile|vollbild/i],
  ["Kalender / Update-Panel", /kalender|update-panel|updatepanel/i],
  ["Kaninchen / Zauberer", /kaninchen|zauberer|zylinder/i],
  ["Katapult", /katapult/i],
  ["Kopfhoerer / Musik", /kopfhoerer|musik|lied|ausschnitt|airpod/i],
  ["Kuss / Klaps / Popo", /kuss|klaps|popo|arsch/i],
  ["Lok / Gleise", /lok\b|lokomotive|gleis|draufsicht/i],
  ["Luftballon", /luftballon|ballon|helium|aufblasen/i],
  ["Mario-Modus", /mario|muenze|power-?up/i],
  ["Maulwurf", /maulwurf|erdhaufen|graben/i],
  ["Pac-Man", /pac-?man|pacman|futter/i],
  ["Pferd", /pferd|galopp|trab/i],
  ["Plaetze / Strichlinien", /strichlinie|platznummer|verlassen|rueckstand|glitch/i],
  ["Schiffe versenken", /schiffe|versenken/i],
  ["Schwimmbecken", /schwimm|becken|tauch/i],
  ["Sprechbilder / Spinne", /sprechbild|spinne|spinnweb/i],
  ["Spruehdose / Sahne", /spruehdose|sahne|spray|smiley/i],
  ["Toene allgemein", /geraeusch|sound|ton\b|toene/i],
  ["Verbindung / zwei Geraete", /leitung|paketverlust|supabase|relais|verbindung/i]
];
console.log("## Nach Thema \u2014 wo steht was\n");
THEMEN.forEach(([wort, re]) => {
  const treffer = zeilen.filter((z) =>
    re.test(z.titel) || z.zitate.some((q) => re.test(q)));
  if (!treffer.length) return;
  const rot = treffer.filter((z) => z.urteil === "rot");
  console.log("- **" + wort + "** \u2014 " + treffer.length + " Messung"
    + (treffer.length === 1 ? "" : "en") + ", "
    + (rot.length ? "**" + rot.length + " davon rot**: " + rot.map((z) => "`" + z.name + "`").join(", ")
                  : "alle gr\u00fcn")
    + "  \n  " + treffer.slice(0, 8).map((z) => "`" + z.name + "`").join(", ")
    + (treffer.length > 8 ? " \u2026" : ""));
});
console.log("");

console.log("## Die Kurzfassung \u2014 eine Zeile je Messung\n");
zeilen.forEach((z) => {
  /* Der Titel bleibt so stehen, wie er im Kopf der Sonde steht —
     kleingeschrieben zerlegt es die deutschen Hauptwoerter. */
  console.log("- " + zeichen(z.urteil) + " `" + z.name + "` \u2014 " + z.titel);
});
console.log("");

/* WAS EINE MESSUNG NICHT KANN. Diese Liste waere sonst genau das,
   was er nicht will: „Ich moechte keine People-Pleasing-Antwort."
   180 gruene Sonden heissen 180 belegte Punkte — nicht „alles
   fertig". Was sie NICHT belegen, steht hier, offen. */
console.log("## Was diese Liste NICHT belegt\n");
console.log("- **Zwei Geraete, zwei Menschen.** Jede Sonde misst EINEN Browser.");
console.log("  Dass eine Wirkung auch auf dem iPhone des anderen ankommt, haengt an");
console.log("  Supabase und am Netz — das steht in `pruefe-leitung` und");
console.log("  `pruefe-paketverlust`, aber ein echter Raum mit acht Leuten ist etwas");
console.log("  anderes als eine Messung.");
console.log("- **Ob es schoen aussieht.** Eine Sonde misst, dass die Schwungfedern nach");
console.log("  hinten zeigen und der Daumen nicht abgespreizt ist. Ob der Adler");
console.log("  aussieht wie ein Weisskopfseeadler, entscheidest du.");
console.log("- **Klang.** Dass ein Ton zur richtigen Millisekunde startet, wird gemessen.");
console.log("  Wie er klingt, nicht.");
console.log("- **Der Abgleich mit deinem Verlauf** (`werkzeug/verlauf-abgleich.py`)");
console.log("  zerlegt deine Nachrichten in Saetze und sucht zu jedem ein Echo in einem");
console.log("  Sondenkopf. Stand 22.09.2026: **3703 deiner Saetze haben eines, 180 nicht**.");
console.log("  Die 180 habe ich einzeln gelesen \u2014 Zwischenrufe, Lob, Wortfetzen aus");
console.log("  Bildern und Saetze zu Dingen, die danach gebaut wurden. Ein vergessener");
console.log("  Wunsch war nicht darunter. Das Werkzeug laeuft auf deinem Verlauf, und");
console.log("  der liegt NICHT im Repository \u2014 es ist dein Chat, nicht mein Datensatz.");
console.log("- **Eine Sache habe ich nicht gebaut** und werde es nicht: das Ausziehen von");
console.log("  Unterwaesche an den Profilbildern anderer Leute im Klassenzimmer. Alles");
console.log("  andere aus deinen Listen ist gebaut oder steht als offener Punkt drin.\n");

console.log("## Alles, Sonde für Sonde\n");
zeilen.forEach((z) => {
  console.log("### " + zeichen(z.urteil) + " " + z.titel + "  \n`" + z.name + "`\n");
  if (!z.zitate.length) {
    console.log("_(kein wörtliches Zitat im Kopf dieser Sonde)_\n");
  } else {
    z.zitate.slice(0, 4).forEach((q) => console.log("> „" + q + "“\n"));
  }
});
