#!/usr/bin/env node
/* =====================================================================
   SONDE 885-sparsam — NOTFALL ANFRAGE-STURM UND SUPABASE-SPERRE (Fassung 885)
   ---------------------------------------------------------------------
   Befund (Supabase-Logs, 22./23.10.2026): ein einziges Gerät (Xanders
   Samsung, Betreiber-Konto, Seite dauerhaft offen, auch im Hintergrund)
   schickte 18 505 Anfragen in 9 h, dann sperrte Supabase das Gratis-
   Projekt (HTTP 402 auf alles) – und das Gerät schickte weiter: 62 917
   abgelehnte Anfragen in 15 h. Ursachen: alle Takte (Benachrichtigungen
   20 s, Laufschrift 20 s, Walkie 20 s, Online-Liste 60 s, Spiel 12 s)
   liefen auch verdeckt; die Fuchs-Prüfung rechnete alle 20 s bis zu vier
   Zeiträume neu; ein Fehler zählte als „leer“ und schickte die Rückwärts-
   suche über bis zu 30 Zeiträume los; niemand bremste bei 402.

   Supabase ist hier vollständig nachgebaut (Route auf attrappe.supabase.co,
   echtes supabase-js aus einer lokalen Kopie, Echtzeit über routeWebSocket).
   Das echte Supabase wird NIE angesprochen: supabase-config.js wird beim
   Ausliefern ersetzt, alles Fremde bricht ab. Die Zeit läuft über
   page.clock (10 min in Sekunden-Schritten), die Seite gilt als Betreiber
   (is_owner), Klassenzimmer zu, Walkie zu, Europe/Berlin.
   Daten: Emmy ist in jedem Zeitraum Fuchs (so prüft 884 alle vier Zeiträume
   in jedem Takt – wie bei jedem Mitglied, das nicht selbst Fuchs ist),
   2 ungelesene Nachrichten, 30 Zeilen im Postausgang (Rundmail), die eigene
   Profilzeile trägt 20 KB extra_profile_data (wie ein echtes Profil mit
   Bildern).

     A  sichtbar 10 min: Anfragen gesamt ≤ 320, Fuchs-Abfragen (results +
        community_*) ≤ 20, kein profiles?select=* und kein private_messages
        ?select=* im Takt, Lämpchen zeigt die 2 ungelesenen (wie vorher).
     B  verdeckt 10 min (nach 90 s sichtbar): höchstens 12 Anfragen, davon
        alles außer „zuletzt aktiv“ (profiles PATCH) ≤ 2; beim Zurückkommen
        binnen 5 s Benachrichtigungen und Laufschrift nachgeholt.
     C  402 ab Minute 1,5 für 10 min (sichtbar): ≤ 40 Anfragen ans Netz;
        Sitzung (läuft in der Sperre ab) noch im Speicher; ein echter Tipp
        öffnet genau einen Versuch, ein zweiter Tipp nach 3 s keinen; nach
        Ende der Sperre ist die Seite spätestens nach 20 min wieder da (eine
        erfolgreiche Benachrichtigungs-Abfrage, Bremse los); 503: höchstens
        2 Anfragen für eine Abfrage (vorher 4); Netz weg: höchstens 2.
     D  nach Mitternacht (00:05), heute noch niemand, zuletzt aktiv vor 3
        Tagen: Fuchs-Abfragen in 10 min ≤ 20; Fuchs des Tages bleibt
        „übernommen“ bei Emmy (wie vorher), die Rückwärtssuche kostet ≤ 10
        Anfragen.
     E  eigene Runde heute mit den meisten Punkten: die Gratulation „Fuchs
        des Tages“ kommt weiterhin (eine Systemnachricht).
     F  keine Seitenfehler aus den neuen Stellen.
   Zahlen je Fall stehen am Ende (und mit AUSGABE=datei.json als JSON).

   Schalter:
     WURZEL=/pfad      anderer Baum (Gegenprobe 884: git archive 02613a71)
     QUELLE=1          index.html?quelle statt min/
     FAELLE=A,C        nur diese Fälle
     SUPABASE_UMD=…    supabase-js (dist/umd/supabase.js); sonst die Kopie
                       im Scratchpad dieser Sitzung (2.117.3)
     AUSGABE=…json     Zahlen als JSON schreiben
   Chromium bei langen Pfaden: TMPDIR=/tmp/claude-0/t885 setzen.
   EHRLICH: Verdeckt heißt hier document.hidden/visibilityState (nachgestellt),
   nicht das Drosseln der Zeitgeber durch den Browser – echtes 884 im
   Hintergrund schaffte nach 5 min nur noch einen Takt je Minute (Log: rund
   ein Drittel dessen, was hier für 884 verdeckt gezählt wird). Antwortgrößen
   sind die der Attrappe, nicht die echten.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");

const WURZEL = process.env.WURZEL ? path.resolve(process.env.WURZEL) : path.join(__dirname, "..");
const QUELLE = Boolean(process.env.QUELLE);
const FAELLE = (process.env.FAELLE || "A,B,C,D,E").split(",").map((x) => x.trim()).filter(Boolean);
const SUPA = [process.env.SUPABASE_UMD,
  "/tmp/claude-0/node_modules/@supabase/supabase-js/dist/umd/supabase.js",
  "/tmp/claude-0/-home-user-Deutsch-Mit-Xander/3dee9a82-acfe-58e0-bbb5-49b0760fb918/scratchpad/supa/package/dist/umd/supabase.js"]
  .filter(Boolean).find((p) => fs.existsSync(p));
if (!SUPA) { console.error("supabase-js fehlt: SUPABASE_UMD=…/dist/umd/supabase.js setzen (npm pack @supabase/supabase-js@2.117.3)."); process.exit(2); }
const SUPA_TEXT = fs.readFileSync(SUPA);

const HOST = "attrappe.supabase.co";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".jpg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".webp": "image/webp", ".webmanifest": "application/manifest+json", ".woff2": "font/woff2" };
const ICH = "11111111-1111-4111-8111-111111111111";
const EMMY = "22222222-2222-4222-8222-222222222222";
const TOM = "33333333-3333-4333-8333-333333333333";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const ANON = b64({ alg: "HS256", typ: "JWT" }) + "." + b64({ role: "anon", iss: "supabase" }) + ".x";
const tokenFuer = (ablauf) => b64({ alg: "HS256", typ: "JWT" }) + "." + b64({ sub: ICH, role: "authenticated", aud: "authenticated", exp: ablauf, email: "xander@attrappe.test" }) + ".x";
const NUTZER = { id: ICH, aud: "authenticated", role: "authenticated", email: "xander@attrappe.test", user_metadata: { name: "XanderFox" },
  app_metadata: { provider: "email" }, created_at: "2026-08-25T10:00:00Z" };

let fehler = 0;
const rote = [];
let teil = "";
const sage = (gut, was, zusatz) => {
  if (!gut) { fehler++; rote.push(teil + " " + was); }
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const abschnitt = (t, titel) => { teil = t; console.log("\n" + t + "  " + titel + "\n"); };
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const ergebnis = { wurzel: WURZEL, fassung: "", faelle: {} };
try { ergebnis.fassung = JSON.parse(fs.readFileSync(path.join(WURZEL, "fassung.json"), "utf8")).fassung; } catch (e) {}

/* ---------------- die nachgebaute Datenbank ---------------- */
function iso(ms) { return new Date(ms).toISOString(); }
function datenbank(fall, t0) {
  const tag = 86400000;
  const db = {
    profiles: [
      { id: ICH, name: "XanderFox", points: 900, badges: [], trophies: [], bio: "", avatar_url: "", avatar_emoji: "🦊", is_owner: true, is_admin: true,
        is_moderator: false, last_active: iso(t0), birthday: "", origin: "", created_at: "2026-08-25T10:00:00Z",
        extra_profile_data: { seenFoxIntro: true, bilder: "x".repeat(20000) }, gallery: [], theme: "bastelheft" },
      { id: EMMY, name: "Emmy", points: 700, badges: [], trophies: [], bio: "Hallo", avatar_url: "", avatar_emoji: "", is_owner: false, is_admin: false,
        is_moderator: false, last_active: iso(t0 - 3600000), birthday: "", origin: "", created_at: "2026-08-26T10:00:00Z",
        extra_profile_data: { bilder: "y".repeat(8000) }, gallery: [] },
      { id: TOM, name: "Tom", points: 300, badges: [], trophies: [], bio: "", avatar_url: "", avatar_emoji: "", is_owner: false, is_admin: false,
        is_moderator: false, last_active: iso(t0 - 7200000), birthday: "", origin: "", created_at: "2026-08-27T10:00:00Z",
        extra_profile_data: { bilder: "z".repeat(8000) }, gallery: [] },
    ],
    results: [], private_messages: [], friends: [], challenges: [], notifications: [], activity: [],
    site_content: [], community_texts: [], community_tips: [], user_links: [], betreiber_rueckfragen: [], betreiber_funk: [],
  };
  let n = 0;
  const runde = (wer, wann, punkte) => db.results.push({ id: ++n, user_id: wer, points: punkte, bonus: 0, percent: 90, categories: ["vokabeln"], character: "", played_at: iso(wann) });
  const mitternacht = (() => { const d = new Date(t0); const s = new Date(d.toLocaleString("en-US", { timeZone: "Europe/Berlin" })); return t0 - (s.getHours() * 3600000 + s.getMinutes() * 60000 + s.getSeconds() * 1000); })();
  if (fall === "D") {
    /* heute niemand, gestern und vorgestern niemand – zuletzt vor 3 Tagen */
    runde(EMMY, mitternacht - 2 * tag - 10 * 3600000, 40);
    runde(ICH, mitternacht - 2 * tag - 9 * 3600000, 15);
    for (let i = 5; i < 60; i += 3) runde(i % 2 ? EMMY : TOM, mitternacht - i * tag, 20 + i);
  } else if (fall === "E") {
    runde(ICH, t0 - 600000, 60);
    runde(EMMY, t0 - 3600000, 10);
  } else {
    runde(EMMY, t0 - 1800000, 80);
    runde(ICH, t0 - 3600000, 20);
    for (let i = 1; i < 60; i++) runde(i % 3 ? EMMY : TOM, mitternacht - i * tag + 12 * 3600000, 30 + (i % 7));
    for (let i = 1; i < 30; i++) runde(ICH, mitternacht - i * tag + 11 * 3600000, 5);
  }
  const nachricht = (von, an, wann, gelesen, text) => db.private_messages.push({ id: "m" + (++n), from_user: von, to_user: an, author_name: von === ICH ? "XanderFox" : "Emmy",
    body: text, is_system: false, read: gelesen, created_at: iso(wann), image_url: null, deleted_by_sender: false, deleted_by_recipient: false });
  nachricht(EMMY, ICH, t0 - 900000, false, "Hallo Xander!");
  nachricht(EMMY, ICH, t0 - 800000, false, "Bist du heute im Klassenzimmer?");
  nachricht(TOM, ICH, t0 - 5 * 86400000, true, "Danke");
  for (let i = 0; i < 30; i++) nachricht(ICH, i % 2 ? EMMY : TOM, t0 - (i + 1) * 3600000, i % 3 === 0, "Rundmail " + i + ": " + "Neuigkeiten ".repeat(40));
  for (let i = 0; i < 6; i++) db.activity.push({ id: i + 1, text: "Emmy hat eine Runde gespielt (" + i + ")", date: iso(t0 - i * 600000), created_at: iso(t0 - i * 600000) });
  return db;
}

/* ---------------- ein kleines PostgREST ---------------- */
function wert(v) { if (v === "null") return null; if (v === "true") return true; if (v === "false") return false; return v; }
function vergleich(zeile, spalte, op, roh) {
  const a = zeile[spalte];
  if (op === "is") { const w = wert(roh); return w === null ? a == null : a === w; }
  if (op === "in") { const l = roh.replace(/^\(|\)$/g, "").split(",").map((x) => x.replace(/^"|"$/g, "")); return l.includes(String(a)); }
  if (a == null) return false;
  let x = a, y = roh;
  const da = Date.parse(a), dy = Date.parse(roh);
  if (typeof a === "number") { y = Number(roh); } else if (typeof a === "boolean") { y = wert(roh); } else if (!isNaN(da) && !isNaN(dy) && /\d{4}-\d\d-\d\d/.test(String(a))) { x = da; y = dy; }
  switch (op) {
    case "eq": return x === y || String(x) === String(y);
    case "neq": return !(x === y || String(x) === String(y));
    case "gt": return x > y; case "gte": return x >= y; case "lt": return x < y; case "lte": return x <= y;
    default: return true;
  }
}
function bedingung(zeile, spalte, ausdruck) {
  let neg = false, e = ausdruck;
  if (e.startsWith("not.")) { neg = true; e = e.slice(4); }
  const i = e.indexOf(".");
  const r = vergleich(zeile, spalte, e.slice(0, i), e.slice(i + 1));
  return neg ? !r : r;
}
function oderListe(roh) {
  const innen = roh.replace(/^\(|\)$/g, "");
  return innen.split(",").map((t) => { const i = t.indexOf("."); return [t.slice(0, i), t.slice(i + 1)]; });
}
function filtern(zeilen, sp) {
  return zeilen.filter((z) => {
    for (const [k, v] of sp) {
      if (["select", "order", "limit", "offset", "on_conflict", "columns"].includes(k)) continue;
      if (k === "or") { if (!oderListe(v).some(([s, a]) => bedingung(z, s, a))) return false; continue; }
      if (!bedingung(z, k, v)) return false;
    }
    return true;
  });
}
function ordnen(zeilen, sp) {
  const o = sp.get("order");
  if (o) {
    const [spalte, richtung] = o.split(",")[0].split(".");
    const ab = richtung === "desc" ? -1 : 1;
    zeilen.sort((a, b) => (a[spalte] > b[spalte] ? ab : a[spalte] < b[spalte] ? -ab : 0));
  }
  const l = Number(sp.get("limit"));
  return l > 0 ? zeilen.slice(0, l) : zeilen;
}
function waehlen(zeilen, sp) {
  const s = sp.get("select");
  if (!s || s === "*" || /\(/.test(s)) return zeilen;
  const spalten = s.split(",").map((x) => x.trim().split(":").pop());
  return zeilen.map((z) => { const o = {}; spalten.forEach((k) => { if (k in z) o[k] = z[k]; }); return o; });
}

/* ---------------- Zähler ---------------- */
function neuerZaehler() { return { gesamt: 0, bytes: 0, je: {}, ok: {}, ws: 0 }; }
function schluessel(adresse, methode) {
  const u = new URL(adresse);
  const p = u.pathname;
  if (p.startsWith("/rest/v1/rpc/")) return "rpc:" + p.slice(13);
  if (p.startsWith("/rest/v1/")) return p.slice(9) + (u.searchParams.get("select") === "*" ? "*" : "") + (methode !== "GET" ? ":" + methode : "");
  if (p.startsWith("/auth/v1/")) return "auth:" + p.slice(9) + (u.searchParams.get("grant_type") ? "?" + u.searchParams.get("grant_type") : "");
  if (p.startsWith("/functions/v1/")) return "fn:" + p.slice(14);
  return "sonst:" + p;
}

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    if (/(^|\/)supabase-config\.js$/.test(p)) {
      a.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-store" });
      return a.end("window.SUPABASE_CONFIG = { url: \"https://" + HOST + "\", anonKey: \"" + ANON + "\" };\n");
    }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
    if (/\.html$/.test(p)) { a.end(fs.readFileSync(f, "utf8").replace(/rolcktiryrvjzbwuvobb\.supabase\.co/g, HOST)); return; }
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const adresse = "http://127.0.0.1:" + srv.address().port + "/index.html" + (QUELLE ? "?quelle" : "");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });

  /* Ein Fall = eine frische Seite mit eigener Datenbank und eigener Uhr. */
  async function seiteOeffnen(fall, t0, opt) {
    opt = opt || {};
    const zustand = { phase: "start", modus: "ok", zaehler: { start: neuerZaehler() }, db: datenbank(fall, t0), fehler: [], systemNachrichten: [] };
    const zaehler = () => (zustand.zaehler[zustand.phase] = zustand.zaehler[zustand.phase] || neuerZaehler());
    const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
      serviceWorkers: "block", timezoneId: "Europe/Berlin", locale: "de-DE",
      userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/131.0 Mobile Safari/537.36" });
    await ctx.clock.install({ time: t0 });
    const ablauf = Math.floor((opt.sitzungBis || (t0 + 10 * 3600000)) / 1000);
    await ctx.addInitScript(([sitzung]) => {
      try {
        localStorage.setItem("dma_tour_seen", "1");
        localStorage.setItem("sb-attrappe-auth-token", JSON.stringify(sitzung));
      } catch (e) {}
      let verdeckt = false;
      Object.defineProperty(Document.prototype, "hidden", { configurable: true, get() { return verdeckt; } });
      Object.defineProperty(Document.prototype, "visibilityState", { configurable: true, get() { return verdeckt ? "hidden" : "visible"; } });
      window.__sichtbar = (an) => { verdeckt = !an; document.dispatchEvent(new Event("visibilitychange")); };
    }, [{ access_token: tokenFuer(ablauf), refresh_token: "rt-1", expires_in: ablauf - Math.floor(t0 / 1000), expires_at: ablauf, token_type: "bearer", user: NUTZER }]);

    const kopf = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "*", "Access-Control-Expose-Headers": "Content-Range, X-Total-Count" };
    async function supabaseAntwort(route, req) {
      const methode = req.method();
      if (methode === "OPTIONS") return route.fulfill({ status: 204, headers: kopf });
      const k = schluessel(req.url(), methode);
      if (process.env.LAUT) console.log("    [netz] " + zustand.phase + " " + zustand.modus + " " + methode + " " + req.url().slice(0, 160));
      const z = zaehler();
      z.gesamt++; z.je[k] = (z.je[k] || 0) + 1;
      if (zustand.modus === "offline") return route.abort("internetdisconnected");
      if (zustand.modus === "402" || zustand.modus === "503") {
        const body = zustand.modus === "402"
          ? '{"message":"Service for this project is restricted due to the following violations: exceed_egress_quota."}'
          : '{"message":"Service Unavailable"}';
        z.bytes += body.length;
        return route.fulfill({ status: Number(zustand.modus), headers: Object.assign({ "Content-Type": "application/json" }, kopf), body });
      }
      const u = new URL(req.url());
      const sp = u.searchParams;
      const kopfAnfrage = req.headers();
      let status = 200, body = "", extra = {};
      if (u.pathname.startsWith("/auth/v1/token")) {
        const neu = Math.floor(Date.now() / 1000);   // echte Zeit genügt: die Seite rechnet mit expires_in
        const virt = zustand.jetzt ? Math.floor(zustand.jetzt / 1000) : neu;
        body = JSON.stringify({ access_token: tokenFuer(virt + 3600), token_type: "bearer", expires_in: 3600, expires_at: virt + 3600, refresh_token: "rt-" + (++zustand.rt || 2), user: NUTZER });
      } else if (u.pathname.startsWith("/auth/v1/user")) {
        body = JSON.stringify(NUTZER);
      } else if (u.pathname.startsWith("/auth/v1/")) {
        status = 204;
      } else if (u.pathname.startsWith("/rest/v1/rpc/")) {
        body = "null";
      } else if (u.pathname.startsWith("/rest/v1/")) {
        const tabelle = u.pathname.slice(9);
        const zeilen = zustand.db[tabelle] || [];
        const prefer = String(kopfAnfrage["prefer"] || "");
        const objekt = /vnd\.pgrst\.object/.test(String(kopfAnfrage["accept"] || ""));
        if (methode === "GET" || methode === "HEAD") {
          const alle = filtern(zeilen, sp);
          const auswahl = waehlen(ordnen(alle.slice(), sp), sp);
          if (/count=/.test(prefer)) extra["Content-Range"] = (auswahl.length ? "0-" + (auswahl.length - 1) : "*") + "/" + alle.length;
          if (objekt) {
            if (auswahl.length !== 1) { status = 406; body = JSON.stringify({ code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned", details: "", hint: null }); }
            else body = JSON.stringify(auswahl[0]);
          } else body = JSON.stringify(auswahl);
          if (methode === "HEAD") body = "";
        } else if (methode === "POST") {
          let neu = [];
          try { const roh = JSON.parse(req.postData() || "[]"); neu = (Array.isArray(roh) ? roh : [roh]).map((r) => Object.assign({ id: "n" + Math.random().toString(36).slice(2), created_at: iso(zustand.jetzt || Date.now()) }, r)); } catch (e) {}
          /* D: die Seite war schon vor Mitternacht offen – die Anmeldebelohnung beim Start soll „heute“ nicht füllen. */
          if (zustand.db[tabelle] && !(opt.rundenVerwerfen && tabelle === "results")) neu.forEach((r) => zustand.db[tabelle].push(r));
          if (tabelle === "private_messages") neu.forEach((r) => zustand.systemNachrichten.push(String(r.body || "")));
          status = 201;
          if (/return=representation/.test(prefer)) body = JSON.stringify(objekt ? neu[0] : neu);
        } else if (methode === "PATCH") {
          let patch = {};
          try { patch = JSON.parse(req.postData() || "{}"); } catch (e) {}
          const treffer = filtern(zeilen, sp);
          treffer.forEach((r) => Object.assign(r, patch));
          if (/return=representation/.test(prefer)) body = JSON.stringify(objekt ? treffer[0] || null : treffer); else status = 204;
        } else { status = 204; }
      } else if (u.pathname.startsWith("/functions/v1/")) {
        body = "{}";
      } else if (u.pathname.startsWith("/realtime/v1/")) {
        status = 202; body = "";
      } else { status = 404; }
      if (status < 300) z.ok[k] = (z.ok[k] || 0) + 1;
      z.bytes += body.length;
      return route.fulfill({ status, headers: Object.assign({ "Content-Type": "application/json" }, kopf, extra), body: status === 204 ? undefined : body });
    }
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => {
      const req = route.request();
      const url = req.url();
      if (/supabase-js@2\/dist\/umd\/supabase\.js/.test(url)) return route.fulfill({ status: 200, contentType: "text/javascript", body: SUPA_TEXT });
      if (url.indexOf("https://" + HOST + "/") === 0) return supabaseAntwort(route, req).catch(() => route.abort().catch(() => {}));
      return route.abort();
    });
    await ctx.routeWebSocket(/attrappe\.supabase\.co/, (ws) => {
      zaehler().ws++;
      if (zustand.modus !== "ok") { ws.close({ code: 4000, reason: zustand.modus }); return; }
      ws.onMessage((m) => {
        if (typeof m !== "string") return;
        let d; try { d = JSON.parse(m); } catch (e) { return; }
        const arr = Array.isArray(d);
        const [joinRef, ref, topic, event, payload] = arr ? d : [d.join_ref, d.ref, d.topic, d.event, d.payload];
        if (!ref) return;
        let antwort = {};
        if (event === "phx_join") {
          const pc = (payload && payload.config && payload.config.postgres_changes) || [];
          antwort = { postgres_changes: pc.map((c, i) => Object.assign({}, c, { id: i + 1 })) };
        }
        const r = { status: "ok", response: antwort };
        ws.send(JSON.stringify(arr ? [joinRef, ref, topic, "phx_reply", r] : { join_ref: joinRef, ref, topic, event: "phx_reply", payload: r }));
      });
    });
    if (process.env.LAUT) await ctx.addInitScript(() => {
      const weg = Storage.prototype.removeItem;
      Storage.prototype.removeItem = function (k) { if (/auth-token/.test(k)) console.log("SITZUNG WEG " + new Date(Date.now()).toISOString() + " " + new Error().stack.split("\n").slice(1, 9).join(" < ")); return weg.call(this, k); };
    });
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => zustand.fehler.push(String(e.message || e).slice(0, 300)));
    if (process.env.LAUT) pg.on("console", (m) => console.log("    [seite] " + m.type() + " " + m.text().slice(0, process.env.LAUT === "2" ? 2000 : 200)));
    await pg.goto(adresse, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => typeof Backend !== "undefined" && Backend.currentUser && Backend.currentUser() && Backend.currentProfile && Backend.currentProfile(), null, { timeout: 90000 });
    const jetzt = await pg.evaluate(() => Date.now());
    await pg.clock.pauseAt(jetzt + 1000);
    zustand.jetzt = jetzt + 1000;
    return { ctx, pg, zustand };
  }
  async function laufen(s, ms, schritt) {
    schritt = schritt || 1000;
    for (let t = 0; t < ms; t += schritt) {
      await s.pg.clock.runFor(schritt);
      s.zustand.jetzt += schritt;
      await warte(schritt >= 5000 ? 25 : 12);
    }
    await warte(60);
  }
  const phase = (s, name) => { s.zustand.phase = name; s.zustand.zaehler[name] = s.zustand.zaehler[name] || neuerZaehler(); return s.zustand.zaehler[name]; };
  const summe = (z, re) => Object.keys(z.je).filter((k) => re.test(k)).reduce((n, k) => n + z.je[k], 0);
  const kurz = (z) => Object.entries(z.je).sort((a, b) => b[1] - a[1]).map(([k, n]) => k + " " + n).join(", ");
  const FUCHS = /^(results|community_texts|community_tips|user_links)$/;
  const NEUE_NAMEN = /bremse|seiteGebremst|tickerVerpasst|notifyLauf|notifyFolge|fuchsPruef|fuchsGeprueft|fuchsNachEigenerRunde|getFoxForMeldung|getUngeleseneNachrichten|aktivitaet|letzterFuchs|zeitraumBeginn|abfrageGescheitert|onlineVerpasst|namesSpalten|gebremst/;
  function fehlerPruefen(s) {
    const neu = s.zustand.fehler.filter((f) => NEUE_NAMEN.test(f));
    sage(neu.length === 0, "keine Seitenfehler aus den neuen Stellen", neu.length ? neu.join(" | ") : (s.zustand.fehler.length ? "(sonst: " + s.zustand.fehler.length + " – " + s.zustand.fehler.slice(0, 2).join(" | ") + ")" : ""));
  }
  const T_TAG = Date.parse("2026-10-24T10:00:00Z");      // 12:00 in Berlin
  const T_NACHT = Date.parse("2026-10-24T22:05:00Z");    // 00:05 in Berlin (25.10.)

  try {
    /* ---------------- A: sichtbar ---------------- */
    if (FAELLE.includes("A")) {
      abschnitt("A", "sichtbar, 10 min (Betreiber, Emmy ist Fuchs, 2 ungelesene)");
      const s = await seiteOeffnen("A", T_TAG);
      await laufen(s, 90000);
      const badge = await s.pg.evaluate(() => { const b = document.getElementById("inboxTabBadge"); const l = document.getElementById("loginBtnBadge");
        return { inbox: b ? b.style.display : "fehlt", pille: l ? l.style.display + ":" + l.textContent.trim() : "fehlt" }; });
      const z = phase(s, "A");
      await laufen(s, 600000);
      const fuchs = summe(z, FUCHS);
      const stern = summe(z, /^(profiles\*|private_messages\*)$/);
      console.log("  Anfragen 10 min: " + z.gesamt + " · " + Math.round(z.bytes / 1024) + " KB · " + kurz(z));
      sage(z.gesamt <= 320, "Anfragen gesamt ≤ 320", String(z.gesamt));
      sage(fuchs <= 20, "Fuchs-Abfragen (results + community_*) ≤ 20", String(fuchs));
      sage(stern === 0, "kein profiles?select=* / private_messages?select=* im Takt", "profiles* " + summe(z, /^profiles\*$/) + ", private_messages* " + summe(z, /^private_messages\*$/));
      sage(badge.inbox === "block", "Lämpchen am Postfach zeigt die ungelesenen (wie vorher)", JSON.stringify(badge));
      fehlerPruefen(s);
      ergebnis.faelle.A = { gesamt: z.gesamt, kb: Math.round(z.bytes / 1024), fuchs, je: z.je };
      await s.ctx.close();
    }

    /* ---------------- B: verdeckt ---------------- */
    if (FAELLE.includes("B")) {
      abschnitt("B", "verdeckt, 10 min (nach 90 s sichtbar), dann zurück");
      const s = await seiteOeffnen("B", T_TAG);
      await laufen(s, 90000);
      await s.pg.evaluate(() => window.__sichtbar(false));
      const z = phase(s, "B");
      await laufen(s, 600000);
      const ohneTouch = z.gesamt - summe(z, /^profiles:PATCH$/);
      console.log("  Anfragen 10 min verdeckt: " + z.gesamt + " · " + Math.round(z.bytes / 1024) + " KB · " + kurz(z));
      sage(z.gesamt <= 12, "verdeckt höchstens 12 Anfragen in 10 min", String(z.gesamt));
      sage(ohneTouch <= 2, "außer „zuletzt aktiv“ (profiles PATCH) höchstens 2", String(ohneTouch));
      const zz = phase(s, "B-zurueck");
      await s.pg.evaluate(() => window.__sichtbar(true));
      await laufen(s, 5000);
      console.log("  beim Zurückkommen (5 s): " + kurz(zz));
      sage(summe(zz, /^notifications\*?$/) >= 1 && summe(zz, /^activity\*?$/) >= 1, "beim Zurückkommen binnen 5 s Benachrichtigungen und Laufschrift geholt", kurz(zz));
      fehlerPruefen(s);
      ergebnis.faelle.B = { gesamt: z.gesamt, kb: Math.round(z.bytes / 1024), je: z.je, zurueck: zz.je };
      await s.ctx.close();
    }

    /* ---------------- C: 402 ---------------- */
    if (FAELLE.includes("C")) {
      abschnitt("C", "402 ab Minute 1,5 für 10 min (sichtbar), Sitzung läuft in der Sperre ab");
      const s = await seiteOeffnen("C", T_TAG, { sitzungBis: T_TAG + 90000 + 180000 + 5000 });
      await laufen(s, 90000);
      const z = phase(s, "C");
      s.zustand.modus = "402";
      await laufen(s, 600000);
      console.log("  Anfragen ans Netz in 10 min 402: " + z.gesamt + " (Echtzeit-Verbindungsversuche: " + z.ws + ") · " + kurz(z));
      sage(z.gesamt <= 40, "402: höchstens 40 Anfragen in 10 min", String(z.gesamt));
      const sitz = await s.pg.evaluate(() => ({ speicher: Boolean(localStorage.getItem("sb-attrappe-auth-token")), konto: Boolean(Backend.currentUser()) }));
      sage(sitz.speicher, "Sitzung nach 402 beim Erneuern noch im Speicher (nach der Sperre nicht abgemeldet)", JSON.stringify(sitz));
      /* ein echter Tipp öffnet genau einen Versuch – ein zweiter 3 s später keinen */
      const t1 = phase(s, "C-tipp1");
      await s.pg.mouse.click(20, 300);
      await s.pg.evaluate(() => { window.__tipp = Backend.getUnreadNotifications(); });
      await laufen(s, 1000);
      await s.pg.evaluate(() => window.__tipp);
      await laufen(s, 2000);
      const t2 = phase(s, "C-tipp2");
      await s.pg.mouse.click(20, 300);
      await s.pg.evaluate(() => { window.__tipp = Backend.getUnreadNotifications(); });
      await laufen(s, 1000);
      await s.pg.evaluate(() => window.__tipp);
      sage(t1.gesamt === 1 && t2.gesamt === 0, "Tipp in der Sperre: genau ein Versuch, zweiter Tipp nach 3 s keiner", t1.gesamt + " / " + t2.gesamt);
      /* Sperre vorbei: spätestens nach 20 min wieder da */
      const zw = phase(s, "C-wieder");
      s.zustand.modus = "ok";
      let nach = 0;
      for (; nach < 20 * 60000 && !((zw.ok["notifications*"] || zw.ok["notifications"]) > 0); nach += 30000) await laufen(s, 30000, 5000);
      const los = await s.pg.evaluate(() => (Backend.bremse ? !Backend.bremse().aktiv : true));
      sage((zw.ok["notifications*"] || zw.ok["notifications"]) > 0 && los, "nach der Sperre wieder da (Benachrichtigungen geholt, Bremse los)", "nach " + Math.round(nach / 60000 * 10) / 10 + " min · " + kurz(zw));
      ergebnis.faelle.C = { gesamt: z.gesamt, ws: z.ws, je: z.je, sitzung: sitz, tipp: [t1.gesamt, t2.gesamt], wiederNachMin: Math.round(nach / 6000) / 10 };
      /* 503: eine Abfrage – supabase-js fragte bei 503 von sich aus noch dreimal nach */
      await laufen(s, 30000);
      const z5 = phase(s, "C-503");
      s.zustand.modus = "503";
      await s.pg.evaluate(() => { window.__q = Backend.zugang().from("activity").select("id").limit(1); window.__q.then(() => {}); });
      await laufen(s, 20000);
      sage(z5.gesamt <= 2, "503: höchstens 2 Anfragen für eine Abfrage", String(z5.gesamt));
      s.zustand.modus = "ok";
      await s.pg.evaluate(() => { try { Backend.zugang().from("activity").select("id").limit(1).then(() => {}); } catch (e) {} });
      await laufen(s, 16 * 60000, 5000);
      const zo = phase(s, "C-offline");
      s.zustand.modus = "offline";
      await s.pg.evaluate(() => { Backend.zugang().from("activity").select("id").limit(1).then(() => {}); });
      await laufen(s, 20000);
      sage(zo.gesamt <= 2, "Netz weg: höchstens 2 Anfragen für eine Abfrage", String(zo.gesamt));
      ergebnis.faelle.C.a503 = z5.gesamt; ergebnis.faelle.C.offline = zo.gesamt;
      fehlerPruefen(s);
      await s.ctx.close();
    }

    /* ---------------- D: nach Mitternacht ---------------- */
    if (FAELLE.includes("D")) {
      abschnitt("D", "00:05, heute noch niemand, zuletzt aktiv vor 3 Tagen, 10 min sichtbar");
      const s = await seiteOeffnen("D", T_NACHT, { rundenVerwerfen: true });
      await laufen(s, 90000);
      const z = phase(s, "D");
      await laufen(s, 600000);
      const fuchs = summe(z, FUCHS);
      console.log("  Fuchs-Abfragen in 10 min: " + fuchs + " · alle: " + z.gesamt + " · " + kurz(z));
      sage(fuchs <= 20, "Fuchs-Abfragen nach Mitternacht ≤ 20 in 10 min", String(fuchs));
      const zf = phase(s, "D-tagesfuchs");
      await s.pg.evaluate(() => { window.__f = Backend.getFoxOfTheDay(); });
      await laufen(s, 8000);
      const f = await s.pg.evaluate(() => window.__f.then((x) => (x ? { id: x.user_id, name: x.name, uebernommen: Boolean(x.uebernommen), total: x.total } : null)));
      sage(Boolean(f && f.id === EMMY && f.uebernommen), "Fuchs des Tages bleibt „übernommen“ bei Emmy (wie vorher)", JSON.stringify(f));
      sage(zf.gesamt <= 10, "die Rückwärtssuche kostet ≤ 10 Anfragen", zf.gesamt + " · " + kurz(zf));
      fehlerPruefen(s);
      ergebnis.faelle.D = { fuchs, gesamt: z.gesamt, je: z.je, tagesfuchs: f, suche: zf.gesamt };
      await s.ctx.close();
    }

    /* ---------------- E: Gratulation ---------------- */
    if (FAELLE.includes("E")) {
      abschnitt("E", "eigene Runde heute mit den meisten Punkten");
      const s = await seiteOeffnen("E", T_TAG);
      await laufen(s, 120000);
      const gratuliert = s.zustand.systemNachrichten.filter((t) => /Fuchs des Tages/.test(t));
      sage(gratuliert.length === 1, "Gratulation „Fuchs des Tages“ kommt (eine Systemnachricht)", String(gratuliert.length));
      fehlerPruefen(s);
      ergebnis.faelle.E = { gratuliert: gratuliert.length };
      await s.ctx.close();
    }
  } catch (e) {
    fehler++;
    rote.push("Abbruch: " + (e && e.stack ? e.stack : e));
    console.error(e);
  }
  await br.close();
  srv.close();
  ergebnis.fehler = fehler; ergebnis.rot = rote;
  if (process.env.AUSGABE) fs.writeFileSync(process.env.AUSGABE, JSON.stringify(ergebnis, null, 1));
  console.log("\n" + (fehler ? fehler + " FEHL: " + rote.join(" · ") : "alles grün") + "   (Fassung " + ergebnis.fassung + ", " + (QUELLE ? "Quelle" : "min/") + ")");
  process.exit(fehler ? 1 : 0);
})();
