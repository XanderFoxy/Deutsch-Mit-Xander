#!/usr/bin/env node
/* PRÜFT FASSUNG 887 (L7, Prüfung Runde 1): index.html LÄDT supabase-js MIT FESTER FASSUNG.
   ---------------------------------------------------------------
   Der Livestream-Strang hatte supabase-js von „@2“ auf eine feste Fassung gesetzt (56a47513: @2.118.0). Beim Einmischen
   (e84652ac) ging das still verloren – index.html lud wieder „@2“, also das, was jsDelivr gerade für die höchste 2.x hält.
   Eine neue supabase-js-Fassung käme so ungeprüft zu allen. Fest steht jetzt @2.119.0: genau das, was die Live-Seite 886
   über „@2“ seit dem 04.11. lädt (npm latest seit 04.11.2026 13:11 UTC) – 2.118.0 wäre eine Rückstufung gewesen.

   Geprüft (ohne Browser, liest nur Dateien; npm nur für Teil N):
     F  index.html lädt supabase-js genau einmal, über jsDelivr, als @2.x.y (keine lose Fassung „@2“, kein „@latest“).
     A  … nicht älter als 2.119.0 (keine Rückstufung gegenüber dem, was 886-Nutzer schon laden).
     S  Die Sonden, die supabase-js über die Adresse abfangen (885-sparsam, 822, 874), treffen die feste Adresse; die
        übrigen Abfänger (cdn.jsdelivr.net/…supabase) ebenso.
     W  werkzeug/fassung-setzen.js prüft die feste Fassung (bricht beim Setzen der Fassungsnummer sonst ab).
     N  Die Fassung gibt es auf npm und sie enthält dist/umd/supabase.js (npm view; ohne Netz: übersprungen, kein Fehler).
   Gegenprobe: WURZEL=<Baum auf e84652ac> → F (lose „@2“) und W rot.
   Aufruf: node werkzeug/pruefe-887-supabase.js            (WURZEL=… für einen anderen Baum, NPM=0 ohne Teil N) */
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const WURZEL = process.env.WURZEL ? path.resolve(process.env.WURZEL) : path.join(__dirname, "..");
const MINDEST = [2, 119, 0];
let fehler = 0;
const ok = (bed, was, zusatz) => { if (!bed) fehler++; console.log("  " + (bed ? "ok   " : "FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const lies = (p) => { try { return fs.readFileSync(path.join(WURZEL, p), "utf8"); } catch (e) { return ""; } };

const html = lies("index.html");
console.log("\n  F  index.html lädt supabase-js mit fester Fassung   (" + WURZEL + ")");
const tags = html.match(/<script[^>]+src="[^"]*supabase-js[^"]*"[^>]*><\/script>/g) || [];
ok(tags.length === 1, "genau ein <script> für supabase-js", tags.length + " gefunden");
const src = ((tags[0] || "").match(/src="([^"]+)"/) || [])[1] || "";
const m = src.match(/^https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@(2)\.(\d+)\.(\d+)\/dist\/umd\/supabase\.js$/);
ok(Boolean(m), "Adresse mit fester Fassung @2.x.y (jsDelivr, dist/umd/supabase.js)", src || "(keine)");
ok(/\sdefer[\s>]/.test(tags[0] || ""), "weiter mit defer (I18)");
const fassung = m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;

console.log("\n  A  keine Rückstufung");
const nichtAelter = fassung && (fassung[1] > MINDEST[1] || (fassung[1] === MINDEST[1] && fassung[2] >= MINDEST[2]));
ok(Boolean(nichtAelter), "Fassung ≥ " + MINDEST.join(".") + " (was 886 über „@2“ seit 04.11. lädt)", fassung ? fassung.join(".") : "–");

console.log("\n  S  die Sonden fangen die feste Adresse ab");
const url = src || "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";
for (const [datei, muster] of [
  ["werkzeug/pruefe-885-sparsam.js", /\/supabase-js@2\(\\\.\\d\+\)\*\\\/dist\\\/umd\\\/supabase\\\.js\//],
  ["werkzeug/pruefe-822-versetzen-menue.js", /\/supabase-js@2\(\\\.\\d\+\)\*\\\/dist\\\/umd\\\/supabase\\\.js\//],
  ["werkzeug/pruefe-874-acker-versetzen.js", /\/supabase-js@2\(\\\.\\d\+\)\*\\\/dist\\\/umd\\\/supabase\\\.js\//]]) {
  const t = lies(datei);
  const roh = (t.match(muster) || [])[0];
  let trifft = false;
  if (roh) { try { trifft = new RegExp(roh.slice(1, -1)).test(url); } catch (e) {} }
  ok(trifft, datei.replace("werkzeug/", "") + ": Abfänger trifft " + url.replace(/^https:\/\/cdn\.jsdelivr\.net\/npm\//, ""), roh || "(Muster nicht gefunden)");
}
ok(/cdn\.jsdelivr\.net\/.*supabase/.test(url) && /cdn\.jsdelivr\.net\/npm\/@supabase/.test(url), "die allgemeinen Abfänger (cdn.jsdelivr.net/…supabase, …/npm/@supabase) treffen sie auch");
ok(!/supabase-js@2\//.test(lies("sw.js")), "sw.js nennt keine lose Adresse");

console.log("\n  W  fassung-setzen.js prüft die feste Fassung");
const fz = lies("werkzeug/fassung-setzen.js");
ok(/function supabaseFassungPruefen\(/.test(fz) && /supabase-js@2\\\.\\d\+\\\.\\d\+\\\//.test(fz), "Prüfung vorhanden (bricht beim Setzen der Fassungsnummer ohne feste Fassung ab)");

if (process.env.NPM !== "0" && fassung) {
  console.log("\n  N  die Fassung gibt es auf npm");
  let v = "", dateien = "";
  try {
    v = execFileSync("npm", ["view", "@supabase/supabase-js@" + fassung.join("."), "version"], { encoding: "utf8", timeout: 60000, stdio: ["ignore", "pipe", "ignore"] }).trim();
    dateien = execFileSync("npm", ["view", "@supabase/supabase-js@" + fassung.join("."), "dist.tarball"], { encoding: "utf8", timeout: 60000, stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch (e) { v = ""; }
  if (!v) console.log("  --   npm nicht erreichbar – Teil N übersprungen");
  else {
    ok(v === fassung.join("."), "npm kennt " + fassung.join("."), dateien);
    /* dist/umd/supabase.js: aus dem Paket (npm pack in einen Zwischenordner) */
    try {
      const d = fs.mkdtempSync(path.join(require("os").tmpdir(), "dma-supa-"));
      execFileSync("npm", ["pack", "@supabase/supabase-js@" + fassung.join("."), "--pack-destination", d], { stdio: "ignore", timeout: 90000 });
      const tgz = fs.readdirSync(d).find((f) => f.endsWith(".tgz"));
      const liste = execFileSync("tar", ["-tzf", path.join(d, tgz)], { encoding: "utf8" });
      ok(/^package\/dist\/umd\/supabase\.js$/m.test(liste), "Paket enthält dist/umd/supabase.js");
      fs.rmSync(d, { recursive: true, force: true });
    } catch (e) { console.log("  --   npm pack nicht möglich – Inhalt nicht geprüft"); }
  }
}

console.log("\n  " + (fehler ? fehler + " Abweichung(en)" : "supabase-js ist fest auf " + fassung.join(".") + " – keine ungeprüfte neue Fassung für alle.") + "\n");
process.exit(fehler ? 1 : 0);
