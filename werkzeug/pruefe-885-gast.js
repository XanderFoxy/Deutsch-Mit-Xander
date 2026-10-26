#!/usr/bin/env node
/* SONDE 885-gast (Notfall-Fassung 885, Nachbesserung 3) — die Gastanmeldung im Spiel (spiel.js klientHolen).
   Befund des Prüfers: ein abgemeldeter Gast im Klassenzimmer rief nach jedem Fehlversuch (alle 30 s) signInAnonymously
   mit einem NEUEN Supabase-Klienten – ≈ 120 Anmelde-Anfragen je Stunde und Gast, auch in der Sperre.
   Nachgestellt: klientHolen wird aus dem Quelltext von spiel.js ausgeschnitten und mit echtem supabase-js 2.117.3 (UMD)
   in einer vm-Kiste ausgeführt (Uhr, Speicher, fetch nachgebaut, kein Netz). Die Gastanmeldung (POST /auth/v1/signup)
   antwortet 402, 422 (Gastsitzungen aus) bzw. 503; eine Stunde lang wird alle 30 s versucht (wie beitreten mit
   naechsterVersuch). Gezählt: Anfragen an /auth/v1/signup und angelegte Klienten. Dazu der Fall „klappt“ (200).
   Aufruf: node werkzeug/pruefe-885-gast.js [Wurzel]   (Gegenprobe: Baum aus 2e3cc7bb → 120 / 120)
   EHRLICH: nur dieser eine Baustein, nicht das ganze Klassenzimmer (WebRTC, Echtzeit). */
const fs = require("fs"), vm = require("vm");
const path = require("path");
/* FASSUNG 886 (Einmischen, Nachbesserung 1) — auch WURZEL=… wie bei den anderen Sonden (vorher nur das erste Argument) */
const WURZEL = process.argv[2] ? path.resolve(process.argv[2]) : process.env.WURZEL ? path.resolve(process.env.WURZEL) : path.join(__dirname, "..");
const SUPA = [process.env.SUPABASE_UMD,
  "/tmp/claude-0/-home-user-Deutsch-Mit-Xander/3dee9a82-acfe-58e0-bbb5-49b0760fb918/scratchpad/supa/package/dist/umd/supabase.js"]
  .filter(Boolean).find((p) => fs.existsSync(p));
if (!SUPA) { console.error("supabase-js fehlt: SUPABASE_UMD=…/dist/umd/supabase.js setzen (npm pack @supabase/supabase-js@2.117.3)."); process.exit(2); }
const quelle = fs.readFileSync(WURZEL + "/spiel.js", "utf8");
const a = quelle.indexOf("  function klientHolen() {"), b = quelle.indexOf("  /* FUNK 104");
const stueck = quelle.slice(a, b);
async function lauf(status, mitBremse) {
  let jetzt = Date.parse("2026-10-25T10:00:00Z");
  const zaehler = { signup: 0, klienten: 0 };
  const speicher = {};
  const kiste = { console, setTimeout, clearTimeout, setInterval, clearInterval, Promise, URL, URLSearchParams, TextEncoder, TextDecoder, AbortController, Headers, Request, Response, atob, btoa, crypto: globalThis.crypto };
  kiste.Date = class extends Date { constructor(...x) { super(...(x.length ? x : [jetzt])); } static now() { return jetzt; } };
  kiste.localStorage = { getItem: (k) => (k in speicher ? speicher[k] : null), setItem: (k, v) => { speicher[k] = String(v); }, removeItem: (k) => { delete speicher[k]; }, key: (i) => Object.keys(speicher)[i] || null, get length() { return Object.keys(speicher).length; } };
  kiste.fetch = async (u, o) => {
    if (String(u).indexOf("/auth/v1/signup") >= 0 && status === 200) { zaehler.signup++;
      const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
      const exp = Math.floor(jetzt / 1000) + 3600;
      return new Response(JSON.stringify({ access_token: b64({ alg: "HS256" }) + "." + b64({ sub: "g1", exp, role: "authenticated", is_anonymous: true }) + ".x", token_type: "bearer", expires_in: 3600, expires_at: exp, refresh_token: "r", user: { id: "g1", is_anonymous: true, aud: "authenticated", role: "authenticated", app_metadata: {}, user_metadata: {}, created_at: "2026-10-25T10:00:00Z" } }), { status: 200, headers: { "Content-Type": "application/json" } }); }
    if (String(u).indexOf("/auth/v1/signup") >= 0) { zaehler.signup++; return new Response(JSON.stringify({ code: status === 422 ? "anonymous_provider_disabled" : "x", msg: "nein" }), { status, headers: { "Content-Type": "application/json" } }); }
    return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
  };
  kiste.WebSocket = class { constructor() { this.readyState = 0; } send() {} close() {} }; kiste.navigator = { userAgent: "Mozilla/5.0" }; kiste.window = kiste; kiste.self = kiste; kiste.globalThis = kiste;
  vm.createContext(kiste);
  vm.runInContext(fs.readFileSync(SUPA, "utf8"), kiste);
  const echt = kiste.supabase.createClient;
  kiste.supabase.createClient = function () { zaehler.klienten++; return echt.apply(this, arguments); };
  kiste.SUPABASE_CONFIG = { url: "https://attrappe.supabase.co", anonKey: "x.y.z" };
  kiste.S = { klient: null, gast: false, gastKlient: null, gastPause: 0, gastStufe: 0 };
  kiste.__BE = mitBremse ? { currentUser: () => null, zugang: () => null, bremsFetch: (u, o) => kiste.fetch(u, o) } : null;
  vm.runInContext("function BE() { return __BE; }\n" + stueck + "\nthis.klientHolen = klientHolen;", kiste);
  let naechster = 0;
  for (let i = 0; i < 120; i++) {   // 1 h in 30-s-Schritten
    if (jetzt >= naechster) {
      try { await kiste.klientHolen(); } catch (e) { if (i < 0) console.log("  Fehler: " + (e && e.stack || e).toString().slice(0, 300)); naechster = jetzt + 30000; }
    }
    jetzt += 30000;
    await new Promise((r) => setTimeout(r, 2));
  }
  return zaehler;
}
(async () => {
  let rot = 0;
  for (const st of [402, 422, 503]) {
    const z = await lauf(st, true);
    const gut = z.signup <= 10 && z.klienten <= 1;
    if (!gut) rot++;
    console.log((gut ? "  ok   " : "  FEHL ") + "Gastanmeldung antwortet " + st + ", 1 h: höchstens 10 Versuche und 1 Klient   " + z.signup + " Versuche, " + z.klienten + " Klienten");
  }
  const z = await lauf(200, true);
  const gut = z.signup === 1 && z.klienten === 1;
  if (!gut) rot++;
  console.log((gut ? "  ok   " : "  FEHL ") + "Gastanmeldung klappt: eine Anmeldung, der Klient bleibt   " + z.signup + " / " + z.klienten);
  console.log(rot ? rot + " FEHL" : "alles grün");
  process.exit(rot ? 1 : 0);
})();
