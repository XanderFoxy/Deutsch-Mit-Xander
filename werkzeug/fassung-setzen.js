#!/usr/bin/env node
/* =========================================================
   DIE FASSUNGSNUMMER STEHT AN EINER STELLE — NICHT AN ZWEI
   ---------------------------------------------------------
   XANDER: „Ich weiss nicht, ob du die Adressen richtig
   aufgesetzt hast. Alles, was du mir in dem Update
   beschreibst, ist nirgendswo sichtbar."

   GEFUNDEN, und es ist keine Kleinigkeit: die Seite haengt
   JEDE Datei an „?v=" + DMA_VERSION — Skripte, Stilblaetter,
   Toene. Das wirkt aber nur, wenn die index.html selbst neu
   geholt wird. Genau das tut ein Browser nicht: GitHub Pages
   schickt seine eigenen Cache-Header mit, und die drei
   <meta http-equiv="Cache-Control">-Zeilen oben in der Datei
   beachtet kein Browser fuer das Dokument selbst (sie gelten
   nur fuer Dinge, die ueber echte HTTP-Kopfzeilen laufen).
   Wer die Seite einmal geladen hat, bekommt also weiter die
   ALTE index.html — mit der alten Fassungsnummer, und damit
   das alte Javascript, das alte Aussehen und die alten Toene.
   Im privaten Fenster ging es, weil das nie einen Cache hat.

   Deshalb gibt es jetzt „fassung.json": eine winzige Datei,
   die die Seite beim Start mit „cache: no-store" holt — das
   umgeht jeden Zwischenspeicher. Steht dort eine andere Zahl
   als die geladene, laedt sich die Seite EINMAL unter einer
   neuen Adresse neu und ist damit auf dem Stand.

   Damit die beiden Zahlen nie auseinanderlaufen, setzt dieses
   Werkzeug sie gemeinsam.

   AUFRUF:  node werkzeug/fassung-setzen.js 421
            node werkzeug/fassung-setzen.js --nur-stempel

   FUNK 101 — XANDER: „warum es im Chat manchmal so extrem lange
   lädt … liegt das an diesen Updates … bitte mach das der Chat
   immer flüssig bleibt und dass er von den Updates nicht
   beeinträchtigt ist."

   GEMESSEN (werkzeug/pruefe-ladezeit.js, 10 Mbit/s, Rechner
   vierfach gebremst): nach einem Update holte jedes Gerät ALLE
   Skripte neu, 3,1 MB, 4,4 s — auch die, an denen sich nichts
   geändert hatte, weil jede Adresse an der Fassungsnummer hing.
   Ohne Update waren es 1 KB und 0,8 s. Bei mehreren Updates am
   Tag zahlte man die 3,1 MB also jedes Mal.

   Jetzt bekommt jede Datei ihren EIGENEN Stempel aus ihrem Inhalt
   (window.DMA_STEMPEL in index.html). Eine Datei, die sich nicht
   geändert hat, behält ihre Adresse und kommt aus dem
   Zwischenspeicher. Neu geladen wird nur, was wirklich neu ist.

   Damit ein Stempel nie hinter dem Inhalt herhinkt, legt dieses
   Werkzeug einen git-Haken an (.git/hooks/pre-commit): vor JEDEM
   Commit werden die Stempel neu gerechnet (--nur-stempel).
   ========================================================= */
const fs = require("fs");
const path = require("path");
const WURZEL = path.dirname(__dirname);

const indexPfad = path.join(WURZEL, "index.html");

/* Jede Skript- und Stildatei im Hauptordner bekommt einen Stempel aus
   ihrem Inhalt; die Ordner mit Tönen, Tutor und Szenen je einen für den
   ganzen Ordner (ändert sich ein Ton, gilt der neue Stempel für alle
   Töne — das ist selten und hält die Liste klein). */
const STEMPEL_ORDNER = ["ton", "tutor", "szenen", "aussprache"];
function stempelSetzen() {
  const crypto = require("crypto");
  let html = fs.readFileSync(indexPfad, "utf8");
  const stempel = {};
  fs.readdirSync(WURZEL).filter((n) => /^[a-z0-9-]+\.(js|css)$/i.test(n)).sort().forEach((n) => {
    stempel[n] = crypto.createHash("sha1").update(fs.readFileSync(path.join(WURZEL, n))).digest("hex").slice(0, 10);
  });
  const alleDateien = (ordner) => fs.readdirSync(ordner, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? alleDateien(path.join(ordner, e.name)) : [path.join(ordner, e.name)]).sort();
  STEMPEL_ORDNER.forEach((o) => {
    const wo = path.join(WURZEL, o);
    if (!fs.existsSync(wo)) return;
    const h = crypto.createHash("sha1");
    alleDateien(wo).forEach((f) => { h.update(path.relative(WURZEL, f)); h.update(fs.readFileSync(f)); });
    stempel[o + "/"] = h.digest("hex").slice(0, 10);
  });
  const zeile = "<script>window.DMA_STEMPEL = " + JSON.stringify(stempel) + ";</script>";
  const muster = /<script>window\.DMA_STEMPEL = \{[^\n]*\};<\/script>/;
  if (muster.test(html)) html = html.replace(muster, zeile);
  else html = html.replace(/(<script>window\.DMA_VERSION = "\d+";<\/script>)/, "$1\n" + zeile);
  fs.writeFileSync(indexPfad, html);
  return Object.keys(stempel).length;
}

function hakenAnlegen() {
  try {
    const haken = path.join(WURZEL, ".git", "hooks", "pre-commit");
    const inhalt = "#!/bin/sh\n# FUNK 101: Stempel vor jedem Commit neu rechnen (werkzeug/fassung-setzen.js)\n"
      + "grep -q nur-stempel werkzeug/fassung-setzen.js 2>/dev/null || exit 0\n"
      + "node werkzeug/fassung-setzen.js --nur-stempel >/dev/null && git add index.html\n"
      + "exit 0\n";
    if (!fs.existsSync(haken) || fs.readFileSync(haken, "utf8") !== inhalt) {
      fs.writeFileSync(haken, inhalt);
      fs.chmodSync(haken, 0o755);
    }
  } catch (e) {}
}

/* Fassung 628 — beim Zusammenführen zweier Zweige ging ein Kommentar-
   Anfang verloren; das übrig gebliebene Kommentar-Ende verschluckte die
   nächste CSS-Regel, still.
   Jetzt prüft jede Fassung alle Stildateien auf offene oder streunende
   Kommentare und unausgeglichene Klammern. */
function cssPruefen() {
  const fehler = [];
  fs.readdirSync(WURZEL).filter((n) => /\.css$/.test(n)).forEach((n) => {
    const s = fs.readFileSync(path.join(WURZEL, n), "utf8");
    let p = 0, kom = false, tiefe = 0;
    while (p < s.length) {
      if (!kom && s.startsWith("/*", p)) { kom = true; p += 2; continue; }
      if (kom && s.startsWith("*/", p)) { kom = false; p += 2; continue; }
      if (!kom) {
        if (s.startsWith("*/", p)) fehler.push(n + ": streunendes */ in Zeile " + (s.slice(0, p).split("\n").length));
        if (s[p] === "{") tiefe++;
        else if (s[p] === "}") tiefe--;
        if (tiefe < 0) { fehler.push(n + ": } ohne { in Zeile " + (s.slice(0, p).split("\n").length)); tiefe = 0; }
      }
      p++;
    }
    if (kom) fehler.push(n + ": Kommentar am Ende nicht geschlossen");
    if (tiefe) fehler.push(n + ": " + tiefe + " offene {");
  });
  return fehler;
}
const cssFehler = cssPruefen();
if (cssFehler.length) {
  console.error("CSS-FEHLER:\n  " + cssFehler.join("\n  "));
  if (process.argv[2] !== "--nur-stempel") process.exit(1);
}

if (process.argv[2] === "--nur-stempel") {
  const n = stempelSetzen();
  hakenAnlegen();
  console.log("Stempel für " + n + " Dateien gesetzt");
  process.exit(0);
}

const zahl = String(process.argv[2] || "").trim();
if (!/^\d+$/.test(zahl)) {
  console.error("Bitte eine Zahl angeben, z. B.:  node werkzeug/fassung-setzen.js 421");
  process.exit(1);
}

let html = fs.readFileSync(indexPfad, "utf8");
const muster = /<script>window\.DMA_VERSION = "(\d+)";<\/script>/;
const treffer = html.match(muster);
if (!treffer) {
  console.error("In index.html steht keine Zeile  window.DMA_VERSION = \"…\";  — abgebrochen.");
  process.exit(1);
}
const vorher = treffer[1];
html = html.replace(muster, '<script>window.DMA_VERSION = "' + zahl + '";</script>');
fs.writeFileSync(indexPfad, html);

fs.writeFileSync(path.join(WURZEL, "fassung.json"),
  JSON.stringify({ fassung: zahl, stand: new Date().toISOString() }, null, 2) + "\n");

const n = stempelSetzen();
hakenAnlegen();
console.log("Fassung " + vorher + " → " + zahl + " (index.html und fassung.json), Stempel für " + n + " Dateien");
