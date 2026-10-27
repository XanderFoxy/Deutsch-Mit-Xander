#!/usr/bin/env node
/* =====================================================================
   SONDE 886 — VORHUT HINTER DEM START-TOR (Punkt „tor“, Prüfbericht 3 zum Einmischen; ohne Browser)
   ---------------------------------------------------------------------
   XANDER (Funk 255): „die schnelle Performance und die Verbindung zu den
   anderen haben oberste Priorität“ – und die Sparsamkeit der Notfall-
   Fassung 885 (Supabase-Kontingent) darf durch nichts aufgeweicht werden.
   Befund: das Start-Tor (Seite aus dem Speicher, S1) gab alles Gestaute in
   derselben Millisekunde frei; die Bremse hält Lesen erst nach der ersten
   402 (bei 429/5xx nach dem zweiten Fehlschlag ≥ 2 s später) an – in einer
   Sperre gingen so alle gestauten Lesen an ihr vorbei.
   Diese Sonde lädt backend.js in eine nachgebaute Umgebung (vm, fetch
   nachgebaut, 30 ms Antwortzeit), staut sieben Anfragen hinter einem Tor
   (fünf Lesen, ein Schreiben, eine Anmeldung) und öffnet es. Geprüft wird,
   was ans Netz geht:
     G  gesund: alles geht, als erste Lese das eigene Profil (die Vorhut)
     S  402: nur die Vorhut, das Schreiben und die Anmeldung gehen hinaus –
        der Rest bekommt die Antwort der Bremse (429), ohne Netz
     F  503: die zweite Vorhut erst ≥ 2 s nach der ersten (dann zählt ihr
        Fehlschlag für die Bremse), danach die Bremse für den Rest
     B  503 nur einmal, dann wieder da: der Rest kommt durch
     N  Netzfehler: der Rest geht sofort (die Bremse lässt dort einzelne
        Abfragen ohnehin hinaus – nichts weiter aufhalten)
     H  die Vorhut hängt: der Rest geht nach der Frist (3 s), kein Stillstand
   Die Seiten-Fälle (echte Seite aus dem Speicher, Helfer an) prüft
   werkzeug/pruefe-885-sparsam.js, Fälle SWS402/SWS0.
   Aufruf: node werkzeug/pruefe-886-vorhut.js   (WURZEL=/pfad: anderer Baum)
   Gegenprobe e038be97 (vor der Vorhut): G, S, F, H rot; B, N grün.
   ===================================================================== */
const fs = require("fs"), path = require("path"), vm = require("vm");
const WURZEL = process.env.WURZEL ? path.resolve(process.env.WURZEL) : path.join(__dirname, "..");
const QUELLE = fs.readFileSync(path.join(WURZEL, "backend.js"), "utf8");
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
let fehler = 0;
const rote = [];

async function fall(kurz, name, modus, erwartung) {
  const log = [];
  let auf; const tor = new Promise((r) => { auf = r; }); tor.offen = false;
  const t0 = Date.now();
  const fetchNach = (u, o) => {
    log.push({ t: Date.now() - t0, u: String(u).replace("https://x.supabase.co", ""), m: (o && o.method) || "GET" });
    const st = typeof modus === "function" ? modus(String(u), log.length) : modus;
    if (st === "haengt") return new Promise(() => {});
    if (st === "netz") return warte(30).then(() => { throw new TypeError("Failed to fetch"); });
    return warte(30).then(() => new Response("{}", { status: st }));
  };
  const leer = { getItem() { return null; }, setItem() {}, removeItem() {} };
  const win = { SUPABASE_CONFIG: { url: "https://x.supabase.co", anonKey: "k" }, dmaStartTor: tor, addEventListener() {}, dispatchEvent() {} };
  const ctx = { Core: { uid: () => Math.random().toString(36).slice(2) }, window: win, document: { addEventListener() {}, hidden: false },
    fetch: fetchNach, Response, setTimeout, clearTimeout, console, Promise, Date, Event: class { constructor(t) { this.type = t; } },
    localStorage: leer, sessionStorage: leer, navigator: {}, location: { search: "" } };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(QUELLE + "\n;globalThis.__B = Backend;", ctx);
  const U = (p, m) => ctx.__B.bremsFetch("https://x.supabase.co" + p, { method: m || "GET" });
  const ps = [U("/rest/v1/site_content?select=value&key=eq.custom_favicon_url"), U("/rest/v1/activity?select=*&order=date.desc&limit=6"),
    U("/rest/v1/site_content?select=value&key=eq.about"), U("/rest/v1/profiles?select=*&id=eq.111"), U("/rest/v1/results", "POST"),
    U("/rest/v1/user_links?select=*"), U("/auth/v1/user")];
  await warte(20);
  const vorTor = log.length;
  tor.offen = true; auf();
  const erg = await Promise.all(ps.map((p) => Promise.race([p.then((a) => a.status, () => "Fehler"), warte(6000).then(() => "haengt")])));
  await warte(50);
  const lesen = log.filter((x) => x.m === "GET" && x.u.indexOf("/rest/") === 0);
  const ok = vorTor === 0 && erwartung(log, erg, lesen);
  if (!ok) { fehler++; rote.push(kurz); }
  console.log((ok ? "  ok   " : "  FEHL ") + kurz + " " + name + " – ans Netz " + log.length + ", Antworten " + erg.join(",") +
    "\n         " + log.map((x) => x.t + " ms " + x.m + " " + x.u.slice(0, 44)).join(" | "));
}

(async () => {
  console.log("SONDE 886 — Vorhut hinter dem Start-Tor   WURZEL " + WURZEL + "\n");
  await fall("G", "gesund: alles geht, die erste Lese ist das eigene Profil", 200,
    (l, e, le) => l.length === 7 && le[0].u.indexOf("profiles?select=*") >= 0 && e.every((s) => s === 200));
  await fall("S", "402: nur Vorhut, Schreiben und Anmeldung ans Netz, der Rest von der Bremse", 402,
    (l, e, le) => l.length === 3 && le.length === 1 && le[0].u.indexOf("profiles?select=*") >= 0 && e.filter((s) => s === 429).length === 4);
  await fall("F", "503: zweite Vorhut ≥ 2 s nach der ersten, dann die Bremse für den Rest", 503,
    (l, e, le) => le.length === 2 && le[1].t - le[0].t >= 2000 && e.filter((s) => s === 429).length === 3);
  await fall("B", "503 nur einmal (die Vorhut), dann wieder da: der Rest kommt durch", (u, n) => (u.indexOf("profiles?select=*") >= 0 ? 503 : 200),
    (l, e, le) => l.length === 7 && e.filter((s) => s === 200).length === 6);
  await fall("N", "Netzfehler: der Rest geht sofort", (u) => (u.indexOf("/rest/") >= 0 ? "netz" : 200),
    (l, e) => l.length === 7 && l.every((x) => x.t < 500));
  await fall("H", "die Vorhut hängt: der Rest nach der Frist (3 s)", (u) => (u.indexOf("profiles?select=*") >= 0 ? "haengt" : 200),
    (l, e) => l.length === 7 && l.filter((x) => x.t >= 2900 && x.t < 4000).length === 4 && e.filter((s) => s === "haengt").length === 1);
  console.log("\n" + (fehler ? fehler + " FEHL: " + rote.join(" · ") : "alles grün"));
  process.exit(fehler ? 1 : 0);
})();
