#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 824: RECHTER FLÜGEL DES DÖBELNER RATHAUSES — EIN DACH,
   DIE KOPFSEITE UND DER BALKON
   ---------------------------------------------------------------------
   XANDER: „kannst du dir mal bitte die Fassade von dem rechten Schiff vom
   Rathaus angucken weil das sieht aus wie doppelt gemoppelt … das ist die
   Kopfseite von dem Seitenflügel ist aber der Seitenflügel selber ist doch
   nur ein ganz normales Dach. Da ist doch nicht noch mal ein Extra Dach
   weil bei dir gehen zwei Vorsätze nach hinten als wenn zwei Häuser nach
   hinten gehen … Also dieses Doppeldach praktisch das gehört doch da gar
   nicht hin … schau dir mal das originale Foto an und dann siehst du auch,
   dass da auch so ne Art Balkon mit dabei ist. Den könntest du dann
   vielleicht mit anbringen".
   FASSUNG 829 — angepasst an Xanders Nachtrag: „Da gibt es wirklich nicht
   dieses Dach auf der Seite … das was du als Dach da gemacht hast. Das ist
   eigentlich die Ansicht auf die wir gucken auf dem Foto … Also dieser
   dreieckige Teil den wir im Gesicht haben." Der Stufengiebel schaut jetzt
   nach vorn (zum Brunnen), das Dach dahinter läuft mit EINEM First nach
   hinten; das Haus zur Seite hat ein Zeltdach (kein First, kein Giebel).
   Geprüft (das Modell wird in Node gebaut, ohne Malen):
   - über Flügel A gibt es genau EINEN First (einen Dachkörper): alle großen
     Dachflächen mit Oberkante haben sie auf derselben Linie, und die läuft
     von der Giebelfront nach hinten (entlang y), keiner quer
   - der First beginnt an der Giebelfront und läuft mindestens 5 m nach hinten
   - an Flügel A steht genau EIN Stufengiebel, und zwar vorn (schaut nach +y,
     zum Brunnen), mittig unter dem First – keiner an der Seite
   - der Balkon hängt im 1. OG vorn an A, und nur dort (an Flügel C keiner)
   - Grundriss/Fußfläche unverändert (Umriss 41 × 33,1, Flügel A wie in
     FASSUNG 819)
   - alle Rathausbilder (8 Winkel, Winter/Herbst, Tag/Nacht, g/k/z und die
     Schatten) sind da, stehen im Verzeichnis und sind gegenüber dem Stand
     VOR (Vorgabe f3fabf3 = Fassung 824) neu gebacken; der Bildstempel in
     stadt-leicht.html passt zum Verzeichnis
   AUFRUF: node werkzeug/pruefe-824-rathaus-dach.js
           (MODELL=pfad: anderes Modell prüfen, VOR=commit: Vergleichsstand)
   ===================================================================== */
const fs = require("fs"), path = require("path"), vm = require("vm"), crypto = require("crypto"), cp = require("child_process");
const W = path.join(__dirname, "..");
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log("  " + (gut ? "ok  " : "FEHL") + " " + was + (zusatz ? "   " + zusatz : "")); };
/* FASSUNG 844 — XANDER (Walkie 313): „es sollte ein Dach vom Turm aus nach rechts gehen über den Seitenflügel … keine extra Dächer quer nach vorne". Das Dach von 829 (Giebel nach vorn) ist abgelehnt; die Prüfungen dafür sind überholt, das richtige Dach prüft Sonde 844. */
const ueberholt844 = (gut, was) => console.log("  ok   (überholt durch 844) " + was);
const r2 = (z) => Math.round(z * 100) / 100;

/* ---------- Modell bauen (ohne Malen) ---------- */
function modellBauen(datei) {
  const MOD = {};
  const stumm = () => stumm;
  const PI = new Proxy({}, { get: () => (...a) => (a.length === 1 && typeof a[0] === "string" ? [200, 200, 200] : [200, 200, 200]) });
  const ST = { pinsel: PI, KX: 1, KY: 0.5, KZ: 1, modell: (id, def) => { MOD[id] = def; }, hash2: () => 0.5, kamera: { dreh: 0 } };
  const ctx = { window: { STADT: ST }, Math, Object, Array, console, Map, Set, JSON, Infinity, document: { createElement: () => ({ getContext: () => new Proxy({}, { get: () => stumm }) }) } };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(datei, "utf8"), ctx);
  const def = MOD.rathaus_doebeln;
  const teile = [], flaechen = [], figuren = [];
  let akt = null;
  const M = {
    teil(name) { akt = { name: name }; teile.push(akt); return akt; },
    flaeche(f) { f.teil = akt && akt.name; flaechen.push(f); return f; },
    figur(f) { f.teil = akt && akt.name; figuren.push(f); return f; },
    licht() {}, bodenlicht() {}
  };
  def.bauen(M, { bau: 1, objekt: { gier: 0 } });
  /* Flächen in Weltpunkte zurückrechnen */
  for (const f of flaechen) {
    f.P = f.umriss.map(([a, b]) => [f.o[0] + f.u[0] * a + f.v[0] * b, f.o[1] + f.u[1] * a + f.v[1] * b, f.o[2] + f.u[2] * a + f.v[2] * b]);
    const n = [f.u[1] * f.v[2] - f.u[2] * f.v[1], f.u[2] * f.v[0] - f.u[0] * f.v[2], f.u[0] * f.v[1] - f.u[1] * f.v[0]];
    const l = Math.hypot(...n) || 1; f.n = n.map((z) => z / l);
    let A = 0; for (let i = 0; i < f.umriss.length; i++) { const p = f.umriss[i], q = f.umriss[(i + 1) % f.umriss.length]; A += p[0] * q[1] - q[0] * p[1]; }
    f.flaeche = Math.abs(A) / 2;
    f.m = f.P.reduce((s, p) => [s[0] + p[0] / f.P.length, s[1] + p[1] / f.P.length, s[2] + p[2] / f.P.length], [0, 0, 0]);
  }
  return { def, teile, flaechen, figuren };
}
const innen = (p, poly, rand) => {
  const xs = poly.map((q) => q[0]), ys = poly.map((q) => q[1]);
  return p[0] >= Math.min(...xs) - rand && p[0] <= Math.max(...xs) + rand && p[1] >= Math.min(...ys) - rand && p[1] <= Math.max(...ys) + rand;
};

console.log("\nDÖBELNER RATHAUS — RECHTER FLÜGEL: EIN DACH NACH HINTEN, GIEBEL VORN, BALKON (Fassung 824/829)\n");
const datei = process.env.MODELL || path.join(W, "stadt", "modelle", "rathaus_doebeln.js");
const { def, teile, flaechen } = modellBauen(datei);
const G = def.grundriss, A = G.teile.A, C = G.teile.C;
const aX0 = Math.min(...A.flat().map((p) => p[0])), aX1 = Math.max(...A.flat().map((p) => p[0]));
const aY1 = Math.max(...A.flat().map((p) => p[1]));
const ueberA = (p, rand) => A.some((poly) => innen(p, poly, rand));

/* ---------- 1. EIN First über Flügel A ---------- */
const dachA = flaechen.filter((f) => Math.abs(f.n[2]) > 0.3 && Math.abs(f.n[2]) < 0.95 && f.flaeche > 6 && ueberA(f.m, 0.6));
/* Oberkante (First) jeder großen Dachfläche: die Punkte ganz oben; eine echte Kante ist länger als 2 m */
const firste = [];
for (const f of dachA) {
  const zMax = Math.max(...f.P.map((p) => p[2]));
  const oben = f.P.filter((p) => zMax - p[2] < 0.05);
  let a = null, b = null, l = 0;
  for (const p of oben) for (const q of oben) { const d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d > l) { l = d; a = p; b = q; } }
  if (l > 2) firste.push({ name: f.name, teil: f.teil, a, b, l, z: zMax, richtung: Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]) ? "x" : "y" });
}
const linien = [];
for (const k of firste) {
  const y = k.richtung === "x" ? (k.a[1] + k.b[1]) / 2 : null, x = k.richtung === "y" ? (k.a[0] + k.b[0]) / 2 : null;
  let L = linien.find((q) => q.richtung === k.richtung && Math.abs(q.z - k.z) < 0.1 && (k.richtung === "x" ? Math.abs(q.y - y) < 0.1 : Math.abs(q.x - x) < 0.1));
  if (!L) { L = { richtung: k.richtung, z: k.z, y, x, von: Infinity, bis: -Infinity, flaechen: [] }; linien.push(L); }
  const s0 = k.richtung === "x" ? Math.min(k.a[0], k.b[0]) : Math.min(k.a[1], k.b[1]), s1 = k.richtung === "x" ? Math.max(k.a[0], k.b[0]) : Math.max(k.a[1], k.b[1]);
  L.von = Math.min(L.von, s0); L.bis = Math.max(L.bis, s1); L.flaechen.push(k.name);
}
const beschr = linien.map((L) => (L.richtung === "x" ? "entlang x bei y=" + r2(L.y) : "nach hinten bei x=" + r2(L.x)) + " z=" + r2(L.z) + " [" + L.flaechen.join(",") + "]").join(" | ");
sage(linien.length === 1, "über Flügel A liegt genau EIN Satteldach (ein First, kein zweiter Dachkörper)", linien.length + " First(e): " + beschr);
/* FASSUNG 829 — der First läuft von der Giebelfront nach hinten (y), keiner quer (x) */
ueberholt844(linien.length >= 1 && linien.every((L) => L.richtung === "y"), "der First läuft von der Giebelfront nach hinten – kein Dach quer entlang des Flügels",
  linien.filter((L) => L.richtung === "x").length + " First(e) quer");
const haupt = linien.find((L) => L.richtung === "y");
ueberholt844(!!haupt && haupt.bis >= aY1 - 0.5 && haupt.bis - haupt.von >= 5, "der First beginnt an der Giebelfront und läuft mindestens 5 m nach hinten", haupt ? "y " + r2(haupt.von) + " … " + r2(haupt.bis) + " (Front " + r2(aY1) + ")" : "—");
ueberholt844(dachA.filter((f) => firste.some((k) => k.name === f.name)).length >= 2 && dachA.filter((f) => firste.some((k) => k.name === f.name)).every((f) => Math.abs(f.n[1]) < 0.05),
  "die großen Dachflächen schauen zur Seite (Satteldach nach hinten), nicht nach vorn", dachA.map((f) => f.name + ":" + r2(f.n[0]) + "/" + r2(f.n[1])).join(" "));

/* ---------- 2. EIN Stufengiebel an A, an der Kopfseite ---------- */
/* je Giebelscheibe zählt eine Fläche (die Scheibe hat eine bemalte Vorder- und eine Rückseite im selben Körper) */
const giebelA = [...new Map(flaechen.filter((f) => Math.abs(f.n[2]) < 0.05 && f.umriss.length > 25 && ueberA(f.m, 0.8) && f.m[2] > 11).map((f) => [f.teil, f])).values()];
/* FASSUNG 829 — die bemalte Außenseite der Giebelscheibe (Name „…v"), nicht die Rückseite */
const kopf = giebelA[0] && (flaechen.find((f) => f.teil === giebelA[0].teil && f.name === giebelA[0].teil + "v") || giebelA[0]);
sage(giebelA.length === 1, "an Flügel A steht genau EIN Stufengiebel (kein zweiter hinten, keiner an der Seite)", giebelA.map((f) => f.teil + " bei x=" + r2(f.m[0]) + " y=" + r2(f.m[1])).join(", ") || "keiner");
ueberholt844(!!kopf && !!haupt && kopf.n[1] > 0.99 && kopf.m[1] > aY1 - 0.8 && Math.abs(kopf.m[0] - haupt.x) < 0.3, "der Stufengiebel steht vorn: schaut zum Brunnen (+y), mittig unter dem First (FASSUNG 829)",
  kopf ? "Mitte x=" + r2(kopf.m[0]) + " y=" + r2(kopf.m[1]) + " n=" + kopf.n.map(r2).join("/") + ", First x=" + (haupt ? r2(haupt.x) : "—") : "—");

/* ---------- 3. Balkon an der langen Seite von A zum Markt ---------- */
const balkonF = flaechen.filter((f) => /balkon/i.test(f.teil || ""));
const balkonA = balkonF.filter((f) => f.m[0] > aX0 && f.m[0] < aX1 && f.m[1] > aY1 - 0.7 && f.m[1] < aY1 + 1.6);
const balkonC = balkonF.filter((f) => C.some((poly) => innen(f.m, poly, 1.5)));
const zB = balkonA.length ? Math.min(...balkonA.map((f) => Math.min(...f.P.map((p) => p[2])))) : -1;
const brAussen = balkonA.filter((f) => Math.abs(f.n[1]) > 0.99 && f.m[1] > aY1 + 0.5);
sage(balkonA.length >= 4 && brAussen.length >= 1, "ein Balkon (Platte und Brüstung) hängt vorn an Flügel A (zum Markt)", balkonA.length + " Flächen, Brüstung vorn " + brAussen.length);
sage(zB > 3.3 && zB < 4.6, "der Balkon sitzt im 1. OG über den Bögen des Erdgeschosses", "Unterkante z=" + r2(zB));
sage(balkonC.length === 0 && balkonF.length === balkonA.length, "kein zweiter Balkon (an Flügel C hängt keiner mehr)", balkonC.length + " Flächen an C, " + (balkonF.length - balkonA.length) + " anderswo");

/* ---------- 4. Grundriss unverändert ---------- */
const A819 = [[[1.28, 10.04], [13.28, 10.04], [13.28, -2.36], [1.28, -2.36]], [[13.28, 9.04], [20.48, 9.04], [20.48, 0.04], [13.28, 0.04]]];
let abw = 0; A819.forEach((P, i) => P.forEach((p, j) => { const q = A[i] && A[i][j]; abw = Math.max(abw, q ? Math.hypot(p[0] - q[0], p[1] - q[1]) : Infinity); }));
sage(abw < 0.01 && G.grund[0] === 41 && G.grund[1] === 33.1, "Grundriss und Fußfläche unverändert (A wie in Fassung 819, Umriss 41 × 33,1)", "Abweichung " + r2(abw) + " m, grund " + JSON.stringify(G.grund));

/* ---------- 5. Bilder neu gebacken, Stempel ---------- */
const VOR = process.env.VOR || "f3fabf3";   // FASSUNG 829: Vergleich mit dem Stand von Fassung 824
const ORD = path.join(W, "stadt-leicht", "bilder");
const vz = JSON.parse(fs.readFileSync(path.join(ORD, "verzeichnis.json"), "utf8"));
const namen = [];
for (const g of [0, 45, 90, 135, 180, 225, 270, 315]) {
  for (const j of ["winter", "herbst"]) for (const t of ["tag", "nacht"]) for (const s of ["g", "k", "z"]) namen.push(["w_rathaus_doebeln", j, t, "f", g, s].join("_"));
  for (const s of ["g", "k", "z"]) namen.push(["w_rathaus_doebeln", "f", g, s, "s"].join("_"));
}
const fehlt = namen.filter((n) => !fs.existsSync(path.join(ORD, n + ".webp")));
const ohneVz = namen.filter((n) => !/_s$/.test(n) && !vz[n]);
sage(namen.length === 120 && !fehlt.length && !ohneVz.length, "alle 120 Rathausbilder (8 Winkel, Winter/Herbst, Tag/Nacht, g/k/z, Schatten) sind da und im Verzeichnis", fehlt.concat(ohneVz).slice(0, 4).join(", "));
let alt = {};
try {
  const aus = cp.execFileSync("git", ["-C", W, "ls-tree", "-r", VOR, "--", "stadt-leicht/bilder/"], { encoding: "utf8", maxBuffer: 64 << 20 });
  for (const z of aus.split("\n")) { const m = z.match(/blob ([0-9a-f]+)\t.*\/(w_rathaus_doebeln[^/]*)\.webp$/); if (m) alt[m[2]] = m[1]; }
} catch (e) { alt = null; }
const blob = (f) => { const b = fs.readFileSync(f); return crypto.createHash("sha1").update("blob " + b.length + "\0").update(b).digest("hex"); };
const gleich = alt ? namen.filter((n) => alt[n] && fs.existsSync(path.join(ORD, n + ".webp")) && blob(path.join(ORD, n + ".webp")) === alt[n]) : namen;
sage(!!alt && Object.keys(alt).length >= 100 && gleich.length === 0, "alle Rathausbilder sind gegenüber " + VOR + " neu gebacken", alt ? gleich.length + " unverändert" + (gleich.length ? ": " + gleich.slice(0, 3).join(", ") : "") : "git ls-tree ging nicht");
const html = fs.readFileSync(path.join(W, "stadt-leicht.html"), "utf8");
const stempel = (html.match(/LEICHT_STEMPEL = "([0-9a-f]*)"/) || [])[1];
const soll = crypto.createHash("sha1").update(fs.readFileSync(path.join(ORD, "verzeichnis.json"))).digest("hex").slice(0, 10);
let stempelVor = null;
try { stempelVor = (cp.execFileSync("git", ["-C", W, "show", VOR + ":stadt-leicht.html"], { encoding: "utf8", maxBuffer: 64 << 20 }).match(/LEICHT_STEMPEL = "([0-9a-f]*)"/) || [])[1]; } catch (e) {}
sage(stempel === soll && stempel !== stempelVor, "der Bildstempel in stadt-leicht.html passt zum neuen Verzeichnis (Telefone laden die neuen Bilder)", stempel + " (vorher " + stempelVor + ")");

console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GRÜN") + "\n");
process.exit(fehler ? 1 : 0);
