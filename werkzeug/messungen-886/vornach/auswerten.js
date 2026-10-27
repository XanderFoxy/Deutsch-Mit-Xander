#!/usr/bin/env node
/* Auswertung Vorher/Nachher 886 über die JSONL-Dateien von mess.js.
   Je Bedingung (Netz, Konto, Tipp) und Fall: Median (p25–p75) je Stand, gepaart je Lauf 886−885, 886−884 und A/A
   (886b−886) mit 95-%-Bereich des gepaarten Medians (Bootstrap 2000, Startwert 885 wie ladezeit-messen.js) und
   Vorzeichentest; Rauschgrenze = halbe Breite des A/A-Bereichs; Faktor = Median der Verhältnisse je Lauf (vorher/886)
   mit Bootstrap-Bereich. Aufruf: node auswerten.js [dateien…] [--md] */
const fs = require("fs"), path = require("path");
const V = __dirname;
const args = process.argv.slice(2), MD = args.includes("--md"), KURZ = args.includes("--kurz");
let dateien = args.filter((a) => !a.startsWith("--"));
if (!dateien.length) dateien = fs.readdirSync(V).filter((f) => /^(4g|3g)-(gast|mitglied)-\d+\.jsonl$/.test(f)).map((f) => path.join(V, f));

function zufall(start) { let s = start >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const med = (v) => { const s = v.slice().sort((a, b) => a - b), i = (s.length - 1) / 2; return (s[Math.floor(i)] + s[Math.ceil(i)]) / 2; };
const q = (v, p) => { const s = v.slice().sort((a, b) => a - b), i = (s.length - 1) * p, u = Math.floor(i), o = Math.ceil(i); return s[u] + (s[o] - s[u]) * (i - u); };
function boot(d, f) {
  const z = zufall(885), m = [];
  for (let k = 0; k < 2000; k++) { const w = []; for (let i = 0; i < d.length; i++) w.push(d[Math.floor(z() * d.length)]); m.push(f(w)); }
  m.sort((a, b) => a - b);
  return [m[Math.floor(0.025 * (m.length - 1))], m[Math.ceil(0.975 * (m.length - 1))]];
}
function binomP(k, n) { if (!n) return 1; const m = Math.min(k, n - k); let s = 0, c = 1; for (let i = 0; i <= m; i++) { s += c; c = c * (n - i) / (i + 1); } return Math.min(1, 2 * s / Math.pow(2, n)); }
function paar(d) {
  if (!d.length) return null;
  const ki = boot(d, med), plus = d.filter((x) => x > 0).length, minus = d.filter((x) => x < 0).length;
  return { n: d.length, median: med(d), min: Math.min(...d), max: Math.max(...d), ki, plus, minus, p: binomP(plus, plus + minus), deutlich: (ki[0] > 0 || ki[1] < 0) && binomP(plus, plus + minus) < 0.05 };
}
const holen = (r, p) => p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), r);
const MASSE = [
  ["fcp", "erstes Bild"], ["bereit", "bereit (bedienbar)"], ["wissen", "Wissen: Tipp → Bild"], ["kzBild", "Klassenzimmer: Tipp → Bild"],
  ["kzKnopf", "Klassenzimmer: Tipp → Knopf"], ["summe", "Summe Warten (bereit + Wissen + Klassenzimmer)"],
  ["fotoSteht", "Über mich: Foto geladen"], ["fotoGemalt", "Über mich: Foto gemalt"], ["fotoNachBild", "Foto gemalt − erstes Bild"],
  ["lang.sperr", "Sperrzeit Hauptfaden 0–10 s (Σ über 50 ms)"], ["sync.ms", "synchron geholt (ms gesperrt)"],
  ["netz.kbBisBereit", "KB über die Leitung bis bereit"], ["supa.n", "Supabase-Anfragen 0–10 s"], ["supa.kb", "Supabase-KB 0–10 s"], ["gh.kb", "github-KB"],
];
const wert = (r, p) => {
  if (p === "summe") return r.bereit != null && r.wissen != null && r.kzKnopf != null ? r.bereit + r.wissen + r.kzKnopf : null;
  const w = holen(r, p);
  return typeof w === "number" && isFinite(w) ? w : null;
};

const alle = {};
for (const f of dateien) {
  const name = path.basename(f).replace(/\.jsonl$/, "");
  const zeilen = fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((z) => { try { return JSON.parse(z); } catch (e) { return null; } }).filter(Boolean);
  const ein = zeilen.find((z) => z.typ === "einstellung");
  const runs = [];
  const lasten = [];
  for (const z of zeilen) if (z.typ === "durchgang") { lasten.push(z.last ? z.last[0] : null); for (const r of z.erg) if (!r.abbruch) runs.push(r); }
  alle[name] = { ein, runs, lasten, abbr: zeilen.filter((z) => z.typ === "durchgang").reduce((s, z) => s + z.erg.filter((r) => r.abbruch).length, 0),
    fehler: runs.reduce((s, r) => s + (r.fehler ? r.fehler.length : 0), 0), n404: runs.reduce((s, r) => s + (r.server ? r.server.n404 : 0), 0),
    konto: runs.filter((r) => r.konto).length, fertig: zeilen.some((z) => z.typ === "fertig") };
}

const STAENDE = ["886", "885", "884", "886b"];
const fmt = (x) => (x == null ? "–" : Math.round(x).toLocaleString("de-DE"));
const fmtD = (x) => (x == null ? "–" : (x > 0 ? "+" : x < 0 ? "−" : "±") + Math.abs(Math.round(x)).toLocaleString("de-DE"));
const fmtF = (x) => (x == null || !isFinite(x) ? "–" : x.toFixed(2).replace(".", ","));
const out = [];
const ergebnis = {};
for (const name of Object.keys(alle).sort()) {
  const A = alle[name];
  const arten = [...new Set(A.runs.map((r) => r.art))];
  const laeufe = [...new Set(A.runs.map((r) => r.lauf))].length;
  out.push("\n=== " + name + " (" + (A.fertig ? "fertig" : "LÄUFT") + ", " + laeufe + " Läufe; Abbrüche " + A.abbr + ", Seitenfehler " + A.fehler + ", 404 " + A.n404 +
    (A.ein && A.ein.einst.konto === "mitglied" ? ", angemeldet in " + A.konto + " von " + A.runs.length + " Öffnungen" : "") +
    ", Last Median " + (A.lasten.filter((x) => x != null).length ? med(A.lasten.filter((x) => x != null)).toFixed(2) : "–") + ")");
  ergebnis[name] = {};
  for (const art of ["kalt", "warm", "wieder", "sw"].filter((a) => arten.includes(a))) {
    out.push("  -- " + art);
    ergebnis[name][art] = {};
    for (const [p, txt] of MASSE) {
      const je = {}, beiLauf = {};
      for (const s of STAENDE) {
        const rs = A.runs.filter((r) => r.stand === s && r.art === art);
        je[s] = rs.map((r) => wert(r, p)).filter((x) => x != null);
        beiLauf[s] = new Map(rs.map((r) => [r.lauf, wert(r, p)]));
      }
      if (!STAENDE.some((s) => je[s].length)) continue;
      const diff = (b, a) => { const d = []; for (const [l, y] of beiLauf[b]) { const x = beiLauf[a].get(l); if (x != null && y != null) d.push(y - x); } return d; };
      const verh = (vor, nach) => { const d = []; for (const [l, y] of beiLauf[nach]) { const x = beiLauf[vor].get(l); if (x != null && y != null && y > 0) d.push(x / y); } return d; };
      const d885 = paar(diff("886", "885")), d884 = paar(diff("886", "884")), aa = paar(diff("886b", "886"));
      const v885 = verh("885", "886"), v884 = verh("884", "886");
      const fak = (v) => (v.length ? { median: med(v), ki: boot(v, med), n: v.length } : null);
      const st = (s) => (je[s].length ? { median: med(je[s]), p25: q(je[s], 0.25), p75: q(je[s], 0.75), min: Math.min(...je[s]), max: Math.max(...je[s]), n: je[s].length, nichtDa: beiLauf[s].size - je[s].length } : { n: 0, nichtDa: beiLauf[s].size });
      const e = { txt, staende: Object.fromEntries(STAENDE.map((s) => [s, st(s)])), d885, d884, aa, rausch: aa ? (aa.ki[1] - aa.ki[0]) / 2 : null, f885: fak(v885), f884: fak(v884) };
      ergebnis[name][art][p] = e;
      const S = e.staende;
      const sp = (x) => (x && x.n ? fmt(x.median) + " (" + fmt(x.p25) + "–" + fmt(x.p75) + ")" + (x.nichtDa ? " [" + x.nichtDa + "×–]" : "") : "– [" + (x ? x.nichtDa : 0) + "×–]");
      const pd = (d) => (d ? fmtD(d.median) + " [" + fmtD(d.ki[0]) + "…" + fmtD(d.ki[1]) + "] " + d.minus + "↓/" + d.plus + "↑" + (d.deutlich ? " *" : "") : "–");
      out.push("    " + txt.padEnd(46) + " 886 " + sp(S["886"]).padEnd(22) + " 885 " + sp(S["885"]).padEnd(22) + " 884 " + sp(S["884"]).padEnd(22) +
        " | 886−885 " + pd(d885).padEnd(30) + " 886−884 " + pd(d884).padEnd(30) + " A/A " + pd(aa).padEnd(26) + " Rausch ±" + fmt(e.rausch) +
        " | Faktor 885/886 " + (e.f885 ? fmtF(e.f885.median) + " [" + fmtF(e.f885.ki[0]) + "…" + fmtF(e.f885.ki[1]) + "]" : "–") +
        ", 884/886 " + (e.f884 ? fmtF(e.f884.median) + " [" + fmtF(e.f884.ki[0]) + "…" + fmtF(e.f884.ki[1]) + "]" : "–"));
    }
  }
}
console.log(out.join("\n"));
fs.writeFileSync(path.join(V, "auswertung.json"), JSON.stringify(ergebnis, null, 1));
