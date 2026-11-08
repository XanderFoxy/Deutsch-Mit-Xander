#!/usr/bin/env node
/* =====================================================================
   MODUL-UMBAU (Schritt 1, MODULE-PLAN.md Abschnitt 3, M1/M2) — QUELLE LESEN
   ---------------------------------------------------------------------
   XANDER (Funk 310/312): „die maximal professionellste Lösung".
   Mit dem Umbau auf Module zieht Code aus den großen Dateien in src/.
   Die Sonden, die Quelltext lesen (Hunderte), sollen davon nichts merken:
   dieses Werkzeug liefert die „logische Datei" – was früher in EINER
   Datei stand, heute aber auf die alte Datei und ihre Stücke in src/
   verteilt ist.

     logisch("app.js")        → app.js + src/app/**  (sobald es Stücke gibt)
     logisch("rueckfrage.js") → rueckfrage.js + src/rueckfrage.js

   Eine Sonde stellt erst um, wenn etwas aus IHRER Datei umzieht:
     const { logisch } = require("./quelle-lesen.js");
     const quelle = logisch("app.js");     // statt fs.readFileSync(… "app.js")

   Dazu der Gleichlauf für ganze Dateien, die als Modul UND (eine Fassung
   lang) als klassischer Rückfall liegen (rueckfrage.js): modulKoerper()
   macht aus der klassischen Hülle „window.X = (function () { … return {…};
   })();" den Modulkörper (Inhalt der Hülle, zwei Leerzeichen weniger
   eingerückt, „return {" → „window.X = {"). Die Sonde pruefe-887-bau.js
   vergleicht damit src/<datei> und die klassische Datei – laufen sie
   auseinander, ist sie rot.

   AUFRUF (zum Nachsehen):
     node werkzeug/quelle-lesen.js app.js              → Zeilen/Zeichen der logischen Datei
     node werkzeug/quelle-lesen.js --modul rueckfrage.js  → Modulkörper auf stdout (klassisch → src)
     node werkzeug/quelle-lesen.js --klassisch rueckfrage.js → klassische Hülle aus src/ auf stdout (src → Rückfall)
   WURZEL=<ordner> liest einen anderen Stand.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));

function alleDateien(ordner) {
  if (!fs.existsSync(ordner)) return [];
  return fs.readdirSync(ordner, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? alleDateien(path.join(ordner, e.name)) : [path.join(ordner, e.name)])
    .filter((f) => /\.(js|mjs)$/.test(f)).sort();
}

/* Die Stücke, die zu einer alten Datei gehören: src/<grund>.js und src/<grund>/** */
function stuecke(name, wurzel) {
  const w = wurzel || WURZEL;
  const grund = String(name).replace(/\.js$/, "");
  const liste = [];
  const einzeln = path.join(w, "src", grund + ".js");
  if (fs.existsSync(einzeln)) liste.push(einzeln);
  return liste.concat(alleDateien(path.join(w, "src", grund)));
}

/* Die logische Datei: alte Datei (falls es sie noch gibt) und danach ihre Stücke, je mit Kopfzeile. */
function logisch(name, wurzel) {
  const w = wurzel || WURZEL;
  const teile = [];
  const alt = path.join(w, name);
  if (fs.existsSync(alt)) teile.push(fs.readFileSync(alt, "utf8"));
  stuecke(name, w).forEach((f) => {
    teile.push("/* ===== " + path.relative(w, f) + " ===== */\n" + fs.readFileSync(f, "utf8"));
  });
  if (!teile.length) throw new Error("quelle-lesen: weder " + name + " noch Stücke in src/");
  return teile.join("\n");
}

/* Klassische Hülle → Modulkörper (siehe oben). Liefert null, wenn die Datei nicht die erwartete Form hat. */
function modulKoerper(text) {
  const zeilen = String(text).replace(/\r\n/g, "\n").split("\n");
  const kopf = zeilen.findIndex((z) => /^window\.([A-Za-z_$][\w$]*) = \(function \(\) \{\s*$/.test(z));
  if (kopf < 0) return null;
  const name = /^window\.([A-Za-z_$][\w$]*)/.exec(zeilen[kopf])[1];
  let ende = zeilen.length - 1;
  while (ende > kopf && zeilen[ende].trim() === "") ende--;
  if (zeilen[ende] !== "})();") return null;
  const rumpf = zeilen.slice(kopf + 1, ende);
  /* das letzte „  return {" auf oberster Ebene der Hülle */
  let ret = -1;
  for (let i = rumpf.length - 1; i >= 0; i--) if (rumpf[i] === "  return {") { ret = i; break; }
  if (ret < 0) return null;
  const aus = rumpf.map((z, i) => {
    const d = z.startsWith("  ") ? z.slice(2) : z;
    return i === ret ? "window." + name + " = {" : d;
  });
  return zeilen.slice(0, kopf).join("\n") + "\n" + aus.join("\n") + "\n";
}

/* Umgekehrt: Modulkörper → klassische Hülle (für den Rückfall, wenn src/<name> bearbeitet wurde). Kopf = der erste
   Kommentarblock oben; die letzte Zeile „window.X = {" auf oberster Ebene wird wieder „  return {". */
function klassischAusModul(text) {
  const zeilen = String(text).replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n");
  let kopfEnde = -1;
  if (/^\/\*/.test(zeilen[0] || "")) for (let i = 0; i < zeilen.length; i++) if (/\*\/\s*$/.test(zeilen[i])) { kopfEnde = i; break; }
  let ex = -1, name = "";
  for (let i = zeilen.length - 1; i > kopfEnde; i--) { const m = /^window\.([A-Za-z_$][\w$]*) = \{\s*$/.exec(zeilen[i]); if (m) { ex = i; name = m[1]; break; } }
  if (ex < 0) return null;
  const rumpf = zeilen.slice(kopfEnde + 1).map((z, i) => (i + kopfEnde + 1 === ex ? "  return {" : z === "" ? "" : "  " + z));
  return zeilen.slice(0, kopfEnde + 1).concat(["window." + name + " = (function () {"], rumpf, ["})();"]).join("\n") + "\n";
}

/* Gleichlauf: ist src/<name> der Modulkörper der klassischen Datei? (Leerzeichen am Zeilenende zählen nicht) */
function gleichlauf(name, wurzel) {
  const w = wurzel || WURZEL;
  const norm = (t) => String(t).replace(/\r\n/g, "\n").split("\n").map((z) => z.replace(/\s+$/, "")).join("\n").trim();
  const alt = path.join(w, name), neu = path.join(w, "src", name);
  if (!fs.existsSync(alt) || !fs.existsSync(neu)) return { gleich: false, grund: "Datei fehlt" };
  const soll = modulKoerper(fs.readFileSync(alt, "utf8"));
  if (soll == null) return { gleich: false, grund: name + " hat nicht die Form window.X = (function () { … })();" };
  const a = norm(soll).split("\n"), b = norm(fs.readFileSync(neu, "utf8")).split("\n");
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) return { gleich: false, grund: "Zeile " + (i + 1) + ": klassisch «" + String(a[i]).slice(0, 80) + "» / src «" + String(b[i]).slice(0, 80) + "»" };
  }
  return { gleich: true };
}

module.exports = { logisch, stuecke, modulKoerper, klassischAusModul, gleichlauf, WURZEL };

if (require.main === module) {
  const a = process.argv.slice(2);
  if (a[0] === "--modul" && a[1]) {
    const k = modulKoerper(fs.readFileSync(path.join(WURZEL, a[1]), "utf8"));
    if (k == null) { console.error("keine klassische Hülle: " + a[1]); process.exit(1); }
    process.stdout.write(k);
  } else if (a[0] === "--klassisch" && a[1]) {
    const k = klassischAusModul(fs.readFileSync(path.join(WURZEL, "src", a[1]), "utf8"));
    if (k == null) { console.error("kein Modulkörper mit window.X = { am Ende: src/" + a[1]); process.exit(1); }
    process.stdout.write(k);
  } else if (a[0]) {
    const t = logisch(a[0]);
    console.log(a[0] + ": " + t.split("\n").length + " Zeilen, " + t.length + " Zeichen, Stücke: "
      + (stuecke(a[0]).map((f) => path.relative(WURZEL, f)).join(", ") || "keine"));
  } else {
    console.error("Aufruf: node werkzeug/quelle-lesen.js <datei> | --modul <datei>");
    process.exit(1);
  }
}
