#!/usr/bin/env node
/* =====================================================================
   FASSUNG 834 — DIE MENSCHEN IN DEN BILDERWELTEN, NEU GEBACKEN
   ---------------------------------------------------------------------
   XANDER (Funk 213, wörtlich): „dass wir wirklich diesmal realistische
   Personen haben … dass der Kellner nicht mehr so steif da steht“.

   Die gemalten Menschen in den Kulissen des Baukastens (Badezimmer bis
   Flur) und in Café, Bibliothek und Bewerbungsgespräch waren fertige
   SVG-Blöcke aus den alten Einzelbildern, 80–225 KB je Person, alle
   streng von vorn, die Sitzenden mit Ballon-Oberschenkeln, der Kellner
   stocksteif mit dem Tablett vor dem Bauch.

   Dieses Werkzeug zeichnet sie mit figuren/mensch.js neu — dasselbe
   Skelett wie im Baukasten, jede Person mit Haltung, Blickrichtung,
   Kleidung und Aussehen — und schreibt sie in die Szenendatei. Die
   Teile behalten ihre id (Vokabel, Lupe, „verdeckt“ im Baukasten), nur
   die Zeichnung und der Ankerpunkt ändern sich.

   Anker: stehend der Boden unter der Hüfte (fussY), sitzend das Gesäß
   auf der Sitzfläche (sitzY) — genau wie bkFigurAnker() im Baukasten.

   Aufruf:  node werkzeug/setze-menschen-834.js           (schreiben)
            node werkzeug/setze-menschen-834.js --probe   (nur rechnen)
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WURZEL = path.dirname(__dirname);
/* FASSUNG 840 — XANDER (Funk 225): „für die Bilderwelt möchte ich meine alte Version wieder zurück haben … und nur eine Option als Link zur neuen Version“. Die neue Bilderwelt (834/836/838) liegt jetzt in bilderwelt-neu/. */
const probe = process.argv.includes("--probe");
const raum = vm.createContext({});
vm.runInContext("var window = this;", raum);
vm.runInContext(fs.readFileSync(path.join(WURZEL, "bilderwelt-neu/figuren/mensch.js"), "utf8"), raum, { filename: "mensch.js" });
const M = raum.window.DMA_MENSCH;
const CM = 1.7;   // Zentimeter je Bildeinheit (DMA_PLATZ_MASS._standard)

const kl = (o) => o;
/* Wer wo ist. x: Hüftmitte; fussY: Boden; sitzY: Sitzfläche;
   mass: Tiefenfaktor (weiter hinten im Raum kleiner). */
const AUFTRAEGE = [
  { szene: "badezimmer", teil: "frau", x: 177, fussY: 180, pose: "kontrapost", blick: 18,
    p: { alter: "erwachsen", geschlecht: "w", haut: "hell", frisur: "dutt", haarfarbe: "braun", gesicht: "g2",
      kleidung: kl({ oberteil: { stueck: "bluse", farbe: "rosa" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "halbschuh", farbe: "braun" } }) } },
  { szene: "badezimmer", teil: "kind", x: 114, fussY: 176, pose: "stehen", blick: 30,
    p: { alter: "kind", geschlecht: "m", haut: "mittel", frisur: "kurz", haarfarbe: "schwarz", gesicht: "g1",
      kleidung: kl({ oberteil: { stueck: "tshirt", farbe: "gruen" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } }) } },
  { szene: "schlafzimmer", teil: "frau", x: 207, fussY: 160, pose: "sitzen", blick: 16,
    p: { alter: "erwachsen", geschlecht: "w", haut: "mittel", frisur: "lang", haarfarbe: "schwarz", gesicht: "g3",
      kleidung: kl({ oberteil: { stueck: "tshirt", farbe: "gruen" }, unterteil: { stueck: "hose", farbe: "grau" } }) } },
  { szene: "schlafzimmer", teil: "mann", x: 293, fussY: 188, pose: "kontrapost", blick: 28, spiegel: true,
    p: { alter: "erwachsen", geschlecht: "m", haut: "hell", frisur: "kurz", haarfarbe: "braun", bart: "bart_kurz", gesicht: "g2",
      kleidung: kl({ oberteil: { stueck: "hemd", farbe: "weiss" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } }) } },
  { szene: "kueche", teil: "koch", x: 101, fussY: 173, pose: "halten", blick: 22, mass: 0.82,
    p: { alter: "erwachsen", geschlecht: "m", haut: "hell", frisur: "kurz", haarfarbe: "dunkelbraun", gesicht: "g1",
      kleidung: kl({ oberteil: { stueck: "kellnerhemd", farbe: "weiss" }, kleid: { stueck: "schuerze", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "schwarz" }, kopf: { stueck: "kochmuetze" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } }) } },
  { szene: "wohnzimmer", teil: "vater", x: 74, sitzY: 150, pose: "sitzen", blick: 14,
    p: { alter: "erwachsen", geschlecht: "m", haut: "hell", frisur: "kurz", haarfarbe: "dunkelbraun", gesicht: "g1",
      kleidung: kl({ oberteil: { stueck: "pullover", farbe: "gruen_d" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } }) } },
  { szene: "wohnzimmer", teil: "tochter", x: 122, sitzY: 150, pose: "sitzen", blick: 16,
    p: { alter: "kind", geschlecht: "w", haut: "hell", frisur: "zopf", haarfarbe: "dunkelbraun", gesicht: "g2",
      kleidung: kl({ oberteil: { stueck: "tshirt", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "blau" }, schuhe: { stueck: "turnschuh" } }) } },
  { szene: "wohnzimmer", teil: "mutter", x: 236, sitzY: 137, pose: "lesen", blick: 20, spiegel: true,
    p: { alter: "erwachsen", geschlecht: "w", haut: "hell", frisur: "dutt", haarfarbe: "braun", gesicht: "g2",
      kleidung: kl({ oberteil: { stueck: "bluse", farbe: "gruen" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, zubehoer: { stueck: "buch", farbe: "blau" } }) } },
  { szene: "wohnzimmer", teil: "kind", x: 176, fussY: 197, pose: "schneidersitz", blick: 40,
    p: { alter: "kind", geschlecht: "m", haut: "mittel", frisur: "kurz", haarfarbe: "schwarz", gesicht: "g1",
      kleidung: kl({ oberteil: { stueck: "tshirt", farbe: "gelb" }, unterteil: { stueck: "shorts", farbe: "blau" }, schuhe: { stueck: "turnschuh" } }) } },
  { szene: "kinderzimmer", teil: "junge", x: 112, fussY: 196, pose: "sitzen_boden", blick: 28,
    p: { alter: "kleinkind", geschlecht: "m", haut: "hell", frisur: "kurz", haarfarbe: "hellblond", gesicht: "g1",
      kleidung: kl({ oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "hose", farbe: "blau" } }) } },
  { szene: "kinderzimmer", teil: "maedchen", x: 158, sitzY: 134, pose: "lesen", blick: 30,
    p: { alter: "kind", geschlecht: "w", haut: "hell", frisur: "lang", haarfarbe: "blond", gesicht: "g2",
      kleidung: kl({ oberteil: { stueck: "tshirt", farbe: "rosa" }, unterteil: { stueck: "rock", farbe: "blau" }, schuhe: { stueck: "halbschuh", farbe: "weiss" }, zubehoer: { stueck: "buch", farbe: "rot" } }) } },
  { szene: "klassenzimmer", teil: "schuelerin", x: 77, sitzY: 144, pose: "lesen", blick: 30,
    p: { alter: "kind", geschlecht: "w", haut: "mittel", frisur: "zopf", haarfarbe: "dunkelbraun", gesicht: "g3",
      kleidung: kl({ oberteil: { stueck: "tshirt", farbe: "gelb" }, unterteil: { stueck: "hose", farbe: "blau" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "buch", farbe: "blau" } }) } },
  { szene: "klassenzimmer", teil: "lehrerin", x: 170, fussY: 170, pose: "zeigen", blick: 50, spiegel: true,
    p: { alter: "erwachsen", geschlecht: "w", haut: "hell", frisur: "dutt", haarfarbe: "braun", gesicht: "g2",
      kleidung: kl({ oberteil: { stueck: "bluse", farbe: "weiss" }, unterteil: { stueck: "rock", farbe: "blau" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } }) } },
  { szene: "restaurant", teil: "gast", x: 28, sitzY: 150, pose: "sitzen", blick: 55,
    p: { alter: "erwachsen", geschlecht: "w", haut: "hell", frisur: "lang", haarfarbe: "dunkelbraun", gesicht: "g1",
      kleidung: kl({ oberteil: { stueck: "bluse", farbe: "weiss" }, unterteil: { stueck: "rock", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } }) } },
  { szene: "restaurant", teil: "kind", x: 168, fussY: 188, pose: "winken", blick: 24,
    p: { alter: "kind", geschlecht: "m", haut: "oliv", frisur: "locken", haarfarbe: "dunkelbraun", gesicht: "g4",
      kleidung: kl({ oberteil: { stueck: "tshirt", farbe: "gelb" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } }) } },
  /* Der Kellner: Tablett auf der Hand, Gewicht auf einem Bein, Kopf zum Gast. */
  { szene: "restaurant", teil: "kellner", x: 253, fussY: 182, pose: "servieren", blick: 30, spiegel: true,
    p: { alter: "erwachsen", geschlecht: "m", haut: "hell", frisur: "kurz", haarfarbe: "dunkelbraun", gesicht: "g2",
      kleidung: kl({ oberteil: { stueck: "kellnerhemd" }, jacke: { stueck: "weste", farbe: "schwarz" }, unterteil: { stueck: "anzughose" }, kleid: { stueck: "schuerze" }, zubehoer: { stueck: "tablett" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } }) } },
  { szene: "supermarkt", teil: "verkaeuferin", x: 272, fussY: 160, pose: "kontrapost", blick: 30, spiegel: true, mass: 0.66,
    p: { alter: "erwachsen", geschlecht: "w", haut: "hell", frisur: "zopf", haarfarbe: "blond", gesicht: "g2",
      kleidung: kl({ oberteil: { stueck: "pullover", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } }) } },
  { szene: "supermarkt", teil: "kundin", x: 190, fussY: 199, pose: "halten", blick: 22,
    p: { alter: "erwachsen", geschlecht: "w", haut: "hell", frisur: "locken", haarfarbe: "rot", gesicht: "g3",
      kleidung: kl({ oberteil: { stueck: "pullover", farbe: "rosa" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "braun" } }) } },
  { szene: "strasse", teil: "fussgaenger", x: 66, fussY: 170, pose: "gehen", blick: 76, mass: 0.74,
    p: { alter: "erwachsen", geschlecht: "m", haut: "hell", frisur: "kurz", haarfarbe: "braun", gesicht: "g1",
      kleidung: kl({ oberteil: { stueck: "pullover", farbe: "grau" }, jacke: { stueck: "jacke", farbe: "rot" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } }) } },
  { szene: "bahnhof", teil: "schaffner", x: 212, fussY: 199, pose: "arme_verschraenkt", blick: 26, mass: 0.88,
    p: { alter: "erwachsen", geschlecht: "m", haut: "mittel", frisur: "kurz", haarfarbe: "schwarz", bart: "bart_kurz", gesicht: "g3",
      kleidung: kl({ oberteil: { stueck: "hemd", farbe: "hellblau" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, unterteil: { stueck: "anzughose", farbe: "grau" }, kopf: { stueck: "kappe", farbe: "blau" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } }) } },
  { szene: "arztpraxis", teil: "aerztin", x: 126, fussY: 191, pose: "halten", blick: 30,
    p: { alter: "erwachsen", geschlecht: "w", haut: "hell", frisur: "zopf", haarfarbe: "braun", gesicht: "g2",
      kleidung: kl({ oberteil: { stueck: "bluse", farbe: "hellblau" }, jacke: { stueck: "arztkittel", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "brille" } }) } },
  { szene: "arztpraxis", teil: "patient", x: 156, sitzY: 128, pose: "sitzen", blick: 24, spiegel: true,
    p: { alter: "erwachsen", geschlecht: "m", haut: "dunkel", frisur: "kurz", haarfarbe: "schwarz", gesicht: "g4",
      kleidung: kl({ oberteil: { stueck: "tshirt", farbe: "weiss" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } }) } },
  { szene: "flur", teil: "mann", x: 205, fussY: 203, pose: "gehen", blick: 74, spiegel: true,
    p: { alter: "erwachsen", geschlecht: "m", haut: "mittel", frisur: "kurz", haarfarbe: "schwarz", gesicht: "g3",
      kleidung: kl({ oberteil: { stueck: "tshirt", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } }) } },
  { szene: "cafe", teil: "ca_barista", x: 42, fussY: 160, pose: "halten", blick: 30, mass: 0.9,
    p: { alter: "erwachsen", geschlecht: "m", haut: "mittel", frisur: "kurz", haarfarbe: "schwarz", bart: "bart_voll", gesicht: "g3",
      kleidung: kl({ oberteil: { stueck: "hemd", farbe: "hellblau" }, kleid: { stueck: "schuerze", farbe: "braun" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } }) } },
  { szene: "cafe", teil: "ca_kellnerin", x: 166, fussY: 195, pose: "servieren", blick: 26,
    p: { alter: "erwachsen", geschlecht: "w", haut: "sehrdunkel", frisur: "dutt", haarfarbe: "schwarz", gesicht: "g3",
      kleidung: kl({ oberteil: { stueck: "bluse", farbe: "schwarz" }, kleid: { stueck: "schuerze", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "schwarz" }, zubehoer: { stueck: "tablett" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } }) } },
  { szene: "cafe", teil: "ca_gast", x: 272, sitzY: 158, pose: "sitzen", blick: 45, spiegel: true,
    p: { alter: "erwachsen", geschlecht: "m", haut: "mittel", frisur: "kurz", haarfarbe: "schwarz", gesicht: "g3",
      kleidung: kl({ oberteil: { stueck: "hemd", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } }) } },
  { szene: "bibliothek", teil: "bi_bibliothekarin", x: 48, fussY: 160, pose: "halten", blick: 24, mass: 0.9,
    p: { alter: "alt", geschlecht: "w", haut: "hell", frisur: "dutt", haarfarbe: "grau", gesicht: "g2",
      kleidung: kl({ oberteil: { stueck: "bluse", farbe: "rosa" }, jacke: { stueck: "weste", farbe: "grau" }, unterteil: { stueck: "rock", farbe: "braun" }, schuhe: { stueck: "halbschuh" }, zubehoer: { stueck: "brille" } }) } },
  { szene: "bibliothek", teil: "bi_leser", x: 198, sitzY: 166, pose: "lesen", blick: 40, spiegel: true,
    p: { alter: "erwachsen", geschlecht: "m", haut: "hell", frisur: "kurz", haarfarbe: "braun", gesicht: "g1",
      kleidung: kl({ oberteil: { stueck: "pullover", farbe: "grau" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "buch", farbe: "gruen" } }) } },
  { szene: "bewerbungsgespraech", teil: "bw_bewerber", x: 269, sitzY: 176, pose: "sitzen", blick: 40, spiegel: true,
    p: { alter: "jugendlich", geschlecht: "m", haut: "hell", frisur: "kurz", haarfarbe: "dunkelbraun", gesicht: "g1",
      kleidung: kl({ oberteil: { stueck: "kellnerhemd", farbe: "weiss" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } }) } },
  { szene: "bewerbungsgespraech", teil: "bw_personalerin", x: 59, sitzY: 176, pose: "sitzen", blick: 40,
    p: { alter: "erwachsen", geschlecht: "w", haut: "oliv", frisur: "dutt", haarfarbe: "schwarz", gesicht: "g3",
      kleidung: kl({ oberteil: { stueck: "bluse", farbe: "blau" }, unterteil: { stueck: "anzughose", farbe: "grau" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } }) } },
];

/* FASSUNG 838 — EBENEN: MÖBEL-RÜCKSEITE, FIGUR, MÖBEL-VORDERKANTE
   XANDER (Funk 222): „sie sollen wenn sie auf der Couch sitzen nicht
   irgendwelche komischen Details von der Couch vor sich haben … auch
   wenn man in einem Sessel sitzt dass man hinter der Sessel Linie sitzt
   und nicht an den Sessel dran geklebt“.
   Im Wohnzimmer lagen „Sitzkissen“ und „Armlehne“ als waagrechte Balken
   quer über den Oberschenkeln der Sitzenden. Jetzt:
   - das Sitzkissen liegt UNTER den Sitzenden (vor ihnen in der Liste),
   - die Armlehne ist, was sie ist: die beiden Seitenpolster des Sessels,
     gezeichnet NACH der Mutter — sie sitzt zwischen den Lehnen. */
function ebenen838(szene, d) {
  if (szene !== "wohnzimmer") return;
  const T = d.teile;
  const idx = (id) => T.findIndex((t) => t.id === id);
  const kissen = idx("sitzkissen");
  const erste = Math.min(idx("vater"), idx("tochter"));
  if (kissen > erste && erste >= 0) { const [k] = T.splice(kissen, 1); T.splice(erste, 0, k); }
  const lehne = T[idx("armlehne")], sessel = T[idx("sessel")];
  if (lehne && sessel) {
    const arm = (x) => '<rect x="' + x + '" y="-34.15" width="12.68" height="26.34" rx="2.93" fill="#c47f6b" stroke="#815447" stroke-width="1.5"/>'
      + '<rect x="' + (x + 1.2) + '" y="-33.2" width="3.2" height="23.5" rx="1.6" fill="#d8ab9d" opacity=".45"/>'
      + '<line x1="' + (x + 1.46) + '" y1="-32.2" x2="' + (x + 11.2) + '" y2="-32.2" stroke="#d8ab9d" stroke-width="1.1" stroke-linecap="round"/>'
      + '<rect x="' + (x + 0.6) + '" y="-12.5" width="11.5" height="3.6" rx="1.2" fill="#9a6152" opacity=".45"/>';
    lehne.kunst = arm(-24.39) + arm(11.71);
    lehne.x = sessel.x; lehne.y = sessel.y;
    lehne.tipp = "Der Sessel hat zwei davon — links und rechts. Wer darin sitzt, sitzt zwischen den Armlehnen.";
    const i = idx("armlehne"), m = idx("mutter");
    if (i < m) { const [l] = T.splice(i, 1); T.splice(idx("mutter") + 1, 0, l); }
  }
}

function lade(szene) {
  const pfad = path.join(WURZEL, "bilderwelt-neu/szenen", szene + ".js");
  const txt = fs.readFileSync(pfad, "utf8");
  const i = txt.indexOf('{"id"'), j = txt.lastIndexOf("};");
  return { pfad, txt, i, j, d: JSON.parse(txt.slice(i, j + 1)) };
}

const proSzene = {};
AUFTRAEGE.forEach((a) => { (proSzene[a.szene] = proSzene[a.szene] || []).push(a); });
let vorher = 0, nachher = 0;
Object.keys(proSzene).forEach((szene) => {
  const S = lade(szene);
  proSzene[szene].forEach((a) => {
    const t = S.d.teile.find((x) => x.id === a.teil);
    if (!t) { console.log("!! Teil fehlt:", szene, a.teil); return; }
    const k = (1 / CM) * (a.mass || 1);
    const r = M.zeichne(Object.assign({}, a.p, { id: szene.slice(0, 3) + "_" + a.teil, pose: a.pose, blick: a.blick, spiegel: !!a.spiegel }));
    const svg = '<g transform="scale(' + k.toFixed(4) + ')">' + r.svg + "</g>";
    let x = a.x, y;
    if (typeof a.sitzY === "number") { x = a.x - r.sitz.x * k; y = a.sitzY - r.sitz.y * k; }
    else y = a.fussY;
    vorher += (t.kunst || "").length; nachher += svg.length;
    console.log((szene + "/" + a.teil).padEnd(34) + a.pose.padEnd(12) + ((t.kunst || "").length / 1024).toFixed(0).padStart(4) + " KB -> " + (svg.length / 1024).toFixed(1) + " KB");
    t.kunst = svg;
    t.x = Math.round(x * 10) / 10;
    t.y = Math.round(y * 10) / 10;
  });
  ebenen838(szene, S.d);
  if (!probe) fs.writeFileSync(S.pfad, S.txt.slice(0, S.i) + JSON.stringify(S.d) + S.txt.slice(S.j + 1));
});
console.log("\nzusammen " + (vorher / 1048576).toFixed(2) + " MB -> " + (nachher / 1048576).toFixed(2) + " MB" + (probe ? "  (nur gerechnet)" : ""));
