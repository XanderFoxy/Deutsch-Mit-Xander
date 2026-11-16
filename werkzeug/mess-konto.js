/* =====================================================================
   MESSUNG MIT KONTO — eine kleine Supabase-Attrappe für werkzeug/ladezeit-messen.js (--konto)
   ---------------------------------------------------------------------
   FASSUNG 889. Die Messung 888 lief „Gast und Konto“ mit einem eigenen
   Werkzeug außerhalb des Baums (scratchpad/m888/mess888.js, nach dem
   Neustart des Rechners weg). Hier dasselbe im Baum, für jeden Stand gleich:
     - supabase-config.js (und min/) zeigt auf https://attrappe.supabase.co,
       index.html verbindet sich vorab dorthin statt zum echten Projekt;
     - jede Anfrage an die Attrappe beantwortet das Werkzeug selbst (CDP
       Fetch, vor der Namensauflösung – nichts verlässt den Rechner), nach
       DB_MS ms („Datenbank 150 ms“ wie in M4/888): angemeldet ist ein
       Mitglied (900 Punkte, kein Betreiber), alle anderen Tabellen sind leer,
       Schreiben gelingt;
     - die Sitzung liegt vor dem ersten Öffnen im Speicher der Seite
       (localStorage sb-attrappe-auth-token), gültig 10 h;
     - die Echtzeit-Leitung (WebSocket) kommt nicht zustande (der Name löst
       nicht auf) – wie beim Gast; gemessen werden Start und Übung, nicht
       das Klassenzimmer.
   Das echte Supabase wird NIE angesprochen.
   ===================================================================== */
const HOST = "attrappe.supabase.co";
const ICH = "11111111-1111-4111-8111-111111111111";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const ANON = b64({ alg: "HS256", typ: "JWT" }) + "." + b64({ role: "anon", iss: "supabase" }) + ".x";
const NUTZER = { id: ICH, aud: "authenticated", role: "authenticated", email: "mira@attrappe.test", user_metadata: { name: "Mira" },
  app_metadata: { provider: "email" }, created_at: "2026-08-25T10:00:00Z" };
const token = (bis) => b64({ alg: "HS256", typ: "JWT" }) + "." + b64({ sub: ICH, role: "authenticated", aud: "authenticated", exp: bis, email: NUTZER.email }) + ".x";
function sitzung() {
  const bis = Math.floor(Date.now() / 1000) + 36000;
  return { access_token: token(bis), refresh_token: "rt-1", expires_in: 36000, expires_at: bis, token_type: "bearer", user: NUTZER };
}
/* ein gewöhnliches Mitglied (wie die Konto-Messung 888, „mitglied“): Betreiber-Teile (Walkie, Rückfragen) lägen sonst über
   Karten und Knöpfen – mit Betreiber brachen auf 3G 7 von 24 Öffnungen am Knopf „Runde starten“ ab */
const PROFIL = { id: ICH, name: "Mira", points: 900, badges: [], trophies: [], bio: "", avatar_url: "", avatar_emoji: "🦊", is_owner: false,
  is_admin: false, is_moderator: false, last_active: new Date().toISOString(), birthday: "", origin: "", created_at: "2026-08-25T10:00:00Z",
  extra_profile_data: { seenFoxIntro: true }, gallery: [], theme: "bastelheft" };

/* Dateien des Servers: Adresse der Attrappe statt des echten Projekts (für beide Stände gleich) */
function datei(p, inhalt) {
  if (/(^|\/)supabase-config\.js$/.test(p) || /\.html$/.test(p)) {
    const t = inhalt.toString("utf8"), n = t.replace(/https:\/\/[a-z0-9]+\.supabase\.co/g, "https://" + HOST);
    return n === t ? inhalt : Buffer.from(n);
  }
  return inhalt;
}
const KOPF = [["Access-Control-Allow-Origin", "*"], ["Access-Control-Allow-Headers", "*"], ["Access-Control-Allow-Methods", "*"],
  ["Access-Control-Expose-Headers", "Content-Range, X-Total-Count"], ["Content-Type", "application/json"]];
function antwort(url, methode, kopf) {
  const u = new URL(url), p = u.pathname;
  const objekt = /vnd\.pgrst\.object/.test(String(kopf.Accept || kopf.accept || ""));
  if (methode === "OPTIONS") return [204, ""];
  if (p.startsWith("/auth/v1/token")) return [200, JSON.stringify(sitzung())];
  if (p.startsWith("/auth/v1/user")) return [200, JSON.stringify(NUTZER)];
  if (p.startsWith("/auth/v1/")) return [204, ""];
  if (p.startsWith("/rest/v1/rpc/")) return [200, "null"];
  if (p.startsWith("/functions/v1/")) return [200, "{}"];
  if (p.startsWith("/rest/v1/")) {
    if (methode === "POST") return [201, "[]"];
    if (methode !== "GET" && methode !== "HEAD") return [204, ""];
    const tabelle = p.slice(9);
    let zeilen = [];
    if (tabelle === "profiles") {
      const id = u.searchParams.get("id");
      zeilen = !id || id === "eq." + ICH || (/^in\./.test(id) && id.indexOf(ICH) >= 0) ? [PROFIL] : [];
    }
    if (objekt) return zeilen.length === 1 ? [200, JSON.stringify(zeilen[0])] : [406, JSON.stringify({ code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned" })];
    return [200, JSON.stringify(zeilen)];
  }
  return [404, ""];
}
/* CDP: Muster für Fetch.enable und die Antwort (true = erledigt) */
const MUSTER = { urlPattern: "https://" + HOST + "/*" };
function beantworten(cdp, e, dbMs) {
  if (String(e.request.url).indexOf("https://" + HOST + "/") !== 0) return false;
  const [status, body] = antwort(e.request.url, e.request.method, e.request.headers || {});
  setTimeout(() => {
    cdp.send("Fetch.fulfillRequest", { requestId: e.requestId, responseCode: status, responseHeaders: KOPF.map(([name, value]) => ({ name, value })),
      body: Buffer.from(body).toString("base64") }).catch(() => {});
  }, e.request.method === "OPTIONS" ? 0 : dbMs);
  return true;
}
/* vor jedem Skript der Seite: die Sitzung (nur wenn keine da ist – der Speicher bleibt über die Öffnungen) */
function initSkript(s) {
  try { if (!localStorage.getItem("sb-attrappe-auth-token")) localStorage.setItem("sb-attrappe-auth-token", s); } catch (e) {}
}
module.exports = { HOST, datei, beantworten, MUSTER, initSkript, sitzung, ANON };
