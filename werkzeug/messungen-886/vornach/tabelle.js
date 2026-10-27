#!/usr/bin/env node
/* Kompakte Tabellen aus auswertung.json (node auswerten.js vorher). Zellen: Median (p25–p75) ms; Δ = gepaarter Median
   je Lauf mit 95-%-Bereich (Bootstrap); * = deutlich (Bereich ohne 0 und Vorzeichentest p < 0,05); Rausch = ± halbe
   Breite des A/A-Bereichs (886 gegen 886, gleiche Sitzung); Faktor = Median der Verhältnisse je Lauf (vorher/886). */
const fs = require("fs"), path = require("path");
const E = JSON.parse(fs.readFileSync(path.join(__dirname, "auswertung.json"), "utf8"));
const n = (x) => (x == null ? "–" : Math.round(x).toLocaleString("de-DE"));
const d = (x) => (x == null ? "–" : (x > 0 ? "+" : x < 0 ? "−" : "±") + Math.abs(Math.round(x)).toLocaleString("de-DE"));
const f = (x) => (x == null || !isFinite(x) ? "–" : x.toFixed(2).replace(".", ","));
const zelle = (s) => (!s || !s.n ? (s && s.nichtDa ? "> 10 s (" + s.nichtDa + "/" + s.nichtDa + ")" : "–") : n(s.median) + " (" + n(s.p25) + "–" + n(s.p75) + ")" + (s.nichtDa ? " [" + s.nichtDa + "× > 10 s]" : ""));
const delta = (p) => (p ? d(p.median) + " [" + d(p.ki[0]) + "…" + d(p.ki[1]) + "]" + (p.deutlich ? "*" : "") : "–");
const NAME = { "4g": "4G", "3g": "3G", gast: "Gast", mitglied: "Konto" };
const BED = (tipp) => ["4g-gast-" + tipp, "4g-mitglied-" + tipp, "3g-gast-" + tipp, "3g-mitglied-" + tipp];
function tabelle(titel, mass, tipp, faktor = true) {
  const z = ["", "### " + titel + (tipp === "0" ? " — Tipp sofort nach „bereit“" : " — Tipp 5 s nach „bereit“"), "",
    "| Netz, Konto | Fall | 884 | 885 live | 886 | 886−885 [95 %] | 886−884 [95 %] | Rausch ± | Faktor 885/886 [95 %] |", "|---|---|---|---|---|---|---|---|---|"];
  let da = false;
  for (const b of BED(tipp)) {
    if (!E[b]) continue;
    const [netz, konto] = b.split("-");
    for (const art of ["kalt", "warm", "wieder", "sw"]) {
      const e = E[b][art] && E[b][art][mass];
      if (!e) continue;
      da = true;
      const S = e.staende;
      z.push("| " + NAME[netz] + " " + NAME[konto] + " | " + art + " | " + zelle(S["884"]) + " | " + zelle(S["885"]) + " | " + zelle(S["886"]) + " | " + delta(e.d885) + " | " + delta(e.d884) +
        " | " + n(e.rausch) + " | " + (faktor && e.f885 ? f(e.f885.median) + " [" + f(e.f885.ki[0]) + "…" + f(e.f885.ki[1]) + "]" : "–") + " |");
    }
  }
  return da ? z.join("\n") : "";
}
const teile = [
  tabelle("Summe Warten = bereit + Wissen-Tipp + Klassenzimmer-Tipp (ms)", "summe", "0"),
  tabelle("Wissen: Tipp → Ansicht steht (ms)", "wissen", "0"),
  tabelle("Klassenzimmer: Tipp → Knopf „Betreten“ sichtbar (ms)", "kzKnopf", "0"),
  tabelle("bereit (bedienbar, ms ab Öffnen)", "bereit", "0"),
  tabelle("erstes Bild (ms ab Öffnen)", "fcp", "0"),
  tabelle("„Über mich“-Foto geladen (ms ab Öffnen)", "fotoSteht", "0"),
  tabelle("Summe Warten (ms)", "summe", "5000"),
  tabelle("Wissen: Tipp → Ansicht steht (ms)", "wissen", "5000"),
  tabelle("Klassenzimmer: Tipp → Knopf (ms)", "kzKnopf", "5000"),
  tabelle("„Über mich“-Foto gemalt (ms ab Öffnen)", "fotoGemalt", "5000"),
  tabelle("Sperrzeit Hauptfaden 0–10 s (Σ über 50 ms)", "lang.sperr", "0"),
  tabelle("Supabase-Anfragen 0–10 s (Attrappe)", "supa.n", "0", false),
].filter(Boolean);
const text = teile.join("\n");
fs.writeFileSync(path.join(__dirname, "tabelle.txt"), text + "\n");
console.log(text);
