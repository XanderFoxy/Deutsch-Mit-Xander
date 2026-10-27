/* ---------- VORHER/NACHHER 886: fremde Namen nachgebaut (Supabase, github) ----------
   Je Name ein eigener h2-Server mit eigenem Port (host-resolver-rules): jeder Name bekommt wie draußen eine eigene
   Verbindung. Die erste Antwort je Verbindung wartet zusätzlich (AUFBAU + 1) Rundreisen (DNS + TCP + TLS), jede Antwort
   eine Rundreise; die Bytes teilen sich die Leitung mit der Seite. In der Vorbereitung (Leitung aus) sofort. */
const fremdZ = { supa: { n: 0, bytes: 0, je: {}, ws: 0, wsMsg: 0, opt: 0 }, gh: { n: 0, bytes: 0, n304: 0 } };
let fremdFrische = 300;   /* raw.githubusercontent.com: max-age; Gruppe sw/pause: 0 (> 10 min später = abgelaufen → 304) */
function fremdServer(fn, upgrade) {
  const verb = new Set();
  const warteAufbau = (sitz) => {
    let w = leitung.rtt();
    if (sitz && !sitz.__benutzt) { sitz.__benutzt = 1; if (leitung.an && sitz.__auf != null) w += Math.max(0, sitz.__auf + (AUFBAU + 1) * LEITUNG.rtt - performance.now()); }
    return w;
  };
  const srv = http2.createSecureServer({ key: TLS.key, cert: TLS.cert, allowHTTP1: true }, (q, a) => {
    const w = warteAufbau(q.stream ? q.stream.session : q.socket);
    const los = () => { if (!a.destroyed && !a.writableEnded) Promise.resolve(fn(q, a)).catch(() => { try { a.writeHead(500); a.end(); } catch (e) {} }); };
    if (w > 0) setTimeout(los, w); else los();
  });
  srv.keepAliveTimeout = 600000;
  srv.on("session", (s) => { s.__auf = performance.now(); verb.add(s); s.on("close", () => verb.delete(s)); });
  srv.on("secureConnection", (s) => { if (s.__auf == null) s.__auf = performance.now(); verb.add(s); s.on("close", () => verb.delete(s)); });
  if (upgrade) srv.on("upgrade", (req, sock, head) => upgrade(req, sock, head, warteAufbau(sock)));
  const lauscht = new Promise((r) => srv.listen(0, "127.0.0.1", r));
  return { srv, lauscht, get port() { return srv.address().port; },
    trennen() { for (const s of verb) { try { s.destroy(); } catch (e) {} } verb.clear(); }, zu() { this.trennen(); srv.close(); } };
}

/* ---- Supabase-Attrappe: Daten wie Sonde 885-sparsam (Fall SM: gewöhnliches Mitglied, volles Profil) ---- */
const SUPA_REF = "rolcktiryrvjzbwuvobb";
const ICH = "11111111-1111-4111-8111-111111111111", EMMY = "22222222-2222-4222-8222-222222222222", TOM = "33333333-3333-4333-8333-333333333333";
const b64u = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const tokenFuer = (ablauf) => b64u({ alg: "HS256", typ: "JWT" }) + "." + b64u({ sub: ICH, role: "authenticated", aud: "authenticated", exp: ablauf, email: "mia@attrappe.test" }) + ".x";
const NUTZER = { id: ICH, aud: "authenticated", role: "authenticated", email: "mia@attrappe.test", user_metadata: { name: "Mia" },
  app_metadata: { provider: "email" }, created_at: "2026-08-25T10:00:00Z" };
const T0 = Date.now();
function iso(ms) { return new Date(ms).toISOString(); }
const DB = (() => {
  const t0 = T0, tag = 86400000;
  const db = {
    profiles: [
      { id: ICH, name: "Mia", points: 900, badges: [], trophies: [], bio: "", avatar_url: "", avatar_emoji: "🦊", is_owner: false, is_admin: false,
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
  runde(EMMY, t0 - 1800000, 80);
  runde(ICH, t0 - 3600000, 20);
  for (let i = 1; i < 60; i++) runde(i % 3 ? EMMY : TOM, mitternacht - i * tag + 12 * 3600000, 30 + (i % 7));
  for (let i = 1; i < 30; i++) runde(ICH, mitternacht - i * tag + 11 * 3600000, 5);
  const nachricht = (von, an, wann, gelesen, text) => db.private_messages.push({ id: "m" + (++n), from_user: von, to_user: an, author_name: von === ICH ? "Mia" : "Emmy",
    body: text, is_system: false, read: gelesen, created_at: iso(wann), image_url: null, deleted_by_sender: false, deleted_by_recipient: false });
  nachricht(EMMY, ICH, t0 - 900000, false, "Hallo Mia!");
  nachricht(EMMY, ICH, t0 - 800000, false, "Bist du heute im Klassenzimmer?");
  nachricht(TOM, ICH, t0 - 5 * 86400000, true, "Danke");
  for (let i = 0; i < 30; i++) nachricht(ICH, i % 2 ? EMMY : TOM, t0 - (i + 1) * 3600000, i % 3 === 0, "Rundmail " + i + ": " + "Neuigkeiten ".repeat(40));
  db.notifications.push({ id: "b1", user_id: ICH, message: "Emmy hat deinen Beitrag kommentiert", read: false, created_at: iso(t0 - 700000) },
    { id: "b2", user_id: ICH, message: "Tom hat deinen Tipp gelikt", read: false, created_at: iso(t0 - 600000) },
    { id: "b3", user_id: ICH, message: "Alt", read: true, created_at: iso(t0 - 9 * 86400000) });
  for (let i = 0; i < 6; i++) db.activity.push({ id: i + 1, text: "Emmy hat eine Runde gespielt (" + i + ")", date: iso(t0 - i * 600000), created_at: iso(t0 - i * 600000) });
  return db;
})();
/* kleines PostgREST (wie Sonde 885-sparsam) */
function pgWert(v) { if (v === "null") return null; if (v === "true") return true; if (v === "false") return false; return v; }
function pgVergleich(zeile, spalte, op, roh) {
  const a = zeile[spalte];
  if (op === "is") { const w = pgWert(roh); return w === null ? a == null : a === w; }
  if (op === "in") { const l = roh.replace(/^\(|\)$/g, "").split(",").map((x) => x.replace(/^"|"$/g, "")); return l.includes(String(a)); }
  if (a == null) return false;
  let x = a, y = roh;
  const da = Date.parse(a), dy = Date.parse(roh);
  if (typeof a === "number") { y = Number(roh); } else if (typeof a === "boolean") { y = pgWert(roh); } else if (!isNaN(da) && !isNaN(dy) && /\d{4}-\d\d-\d\d/.test(String(a))) { x = da; y = dy; }
  switch (op) {
    case "eq": return x === y || String(x) === String(y);
    case "neq": return !(x === y || String(x) === String(y));
    case "gt": return x > y; case "gte": return x >= y; case "lt": return x < y; case "lte": return x <= y;
    default: return true;
  }
}
function pgBedingung(zeile, spalte, ausdruck) {
  let neg = false, e = ausdruck;
  if (e.startsWith("not.")) { neg = true; e = e.slice(4); }
  const i = e.indexOf(".");
  const r = pgVergleich(zeile, spalte, e.slice(0, i), e.slice(i + 1));
  return neg ? !r : r;
}
function pgOder(roh) { return roh.replace(/^\(|\)$/g, "").split(",").map((t) => { const i = t.indexOf("."); return [t.slice(0, i), t.slice(i + 1)]; }); }
function pgFiltern(zeilen, sp) {
  return zeilen.filter((z) => {
    for (const [k, v] of sp) {
      if (["select", "order", "limit", "offset", "on_conflict", "columns", "apikey"].includes(k)) continue;
      if (k === "or") { if (!pgOder(v).some(([s, a]) => pgBedingung(z, s, a))) return false; continue; }
      if (!pgBedingung(z, k, v)) return false;
    }
    return true;
  });
}
function pgOrdnen(zeilen, sp) {
  const o = sp.get("order");
  if (o) { const [spalte, richtung] = o.split(",")[0].split("."); const ab = richtung === "desc" ? -1 : 1; zeilen.sort((a, b) => (a[spalte] > b[spalte] ? ab : a[spalte] < b[spalte] ? -ab : 0)); }
  const l = Number(sp.get("limit")), ab = Number(sp.get("offset")) || 0;
  return l > 0 ? zeilen.slice(ab, ab + l) : zeilen.slice(ab);
}
function pgWaehlen(zeilen, sp) {
  const s = sp.get("select");
  if (!s || s === "*" || /\(/.test(s)) return zeilen;
  const spalten = s.split(",").map((x) => x.trim().split(":").pop());
  return zeilen.map((z) => { const o = {}; spalten.forEach((k) => { if (k in z) o[k] = z[k]; }); return o; });
}
function supaSchluessel(u, methode) {
  const p = u.pathname;
  if (p.startsWith("/rest/v1/rpc/")) return "rpc:" + p.slice(13);
  if (p.startsWith("/rest/v1/")) return p.slice(9) + (u.searchParams.get("select") === "*" ? "*" : u.searchParams.get("select") === "id" ? "#id" : "") + (methode !== "GET" ? ":" + methode : "");
  if (p.startsWith("/auth/v1/")) return "auth:" + p.slice(9);
  if (p.startsWith("/functions/v1/")) return "fn:" + p.slice(14);
  return "sonst:" + p;
}
function supaSenden(q, a, status, body, extra) {
  const h = Object.assign({ "content-type": "application/json", "access-control-allow-origin": "*", "access-control-expose-headers": "Content-Range, X-Total-Count" }, extra || {});
  let buf = Buffer.from(body == null ? "" : body);
  if (buf.length > 1024 && /gzip/.test(q.headers["accept-encoding"] || "")) { buf = zlib.gzipSync(buf, { level: 6 }); h["content-encoding"] = "gzip"; }
  if (status !== 204 && status !== 304) h["content-length"] = buf.length;
  fremdZ.supa.bytes += buf.length;
  a.writeHead(status, h);
  if (status === 204 || status === 304 || q.method === "HEAD" || !buf.length) return a.end();
  leitung.senden(a, buf);
}
const supaSrv = H2 ? fremdServer(async (q, a) => {
  if (q.method === "OPTIONS") {
    fremdZ.supa.opt++;
    a.writeHead(204, { "access-control-allow-origin": "*", "access-control-allow-headers": q.headers["access-control-request-headers"] || "*",
      "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,HEAD,OPTIONS", "access-control-max-age": "600" });
    return a.end();
  }
  const u = new URL(q.url, "https://" + SUPA_REF + ".supabase.co"), sp = u.searchParams, methode = q.method;
  const k = supaSchluessel(u, methode);
  fremdZ.supa.n++; fremdZ.supa.je[k] = (fremdZ.supa.je[k] || 0) + 1;
  let roh = "";
  if (methode !== "GET" && methode !== "HEAD") roh = await new Promise((r) => { const t = []; q.on("data", (c) => t.push(c)); q.on("end", () => r(Buffer.concat(t).toString())); q.on("error", () => r("")); });
  if (leitung.an && SUPA_MS > 0) await schlaf(SUPA_MS);
  const angemeldet = /^Bearer\s+(?!eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6)/.test(String(q.headers.authorization || ""));
  const p = u.pathname;
  if (p.startsWith("/auth/v1/token")) {
    const jetzt = Math.floor(Date.now() / 1000);
    return supaSenden(q, a, 200, JSON.stringify({ access_token: tokenFuer(jetzt + 3600), token_type: "bearer", expires_in: 3600, expires_at: jetzt + 3600, refresh_token: "rt-" + jetzt, user: NUTZER }));
  }
  if (p.startsWith("/auth/v1/user")) return angemeldet ? supaSenden(q, a, 200, JSON.stringify(NUTZER)) : supaSenden(q, a, 401, '{"code":401,"msg":"JWT missing"}');
  if (p.startsWith("/auth/v1/")) return supaSenden(q, a, 204, "");
  if (p.startsWith("/rest/v1/rpc/")) return supaSenden(q, a, 200, "null");
  if (p.startsWith("/rest/v1/")) {
    const zeilen = DB[p.slice(9)] || [];
    const prefer = String(q.headers.prefer || ""), objekt = /vnd\.pgrst\.object/.test(String(q.headers.accept || ""));
    if (methode === "GET" || methode === "HEAD") {
      const alle = pgFiltern(zeilen, sp), auswahl = pgWaehlen(pgOrdnen(alle.slice(), sp), sp), extra = {};
      if (/count=/.test(prefer)) extra["content-range"] = (auswahl.length ? "0-" + (auswahl.length - 1) : "*") + "/" + alle.length;
      if (objekt) {
        if (auswahl.length !== 1) return supaSenden(q, a, 406, JSON.stringify({ code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned", details: "", hint: null }), extra);
        return supaSenden(q, a, 200, JSON.stringify(auswahl[0]), extra);
      }
      return supaSenden(q, a, 200, JSON.stringify(auswahl), extra);
    }
    if (methode === "POST") {
      /* beantwortet, nicht behalten: jedes Öffnen jedes Standes sieht dieselben Daten */
      let neu = [];
      try { const j = JSON.parse(roh || "[]"); neu = (Array.isArray(j) ? j : [j]).map((r) => Object.assign({ id: "n" + Math.random().toString(36).slice(2), created_at: iso(Date.now()) }, r)); } catch (e) {}
      return /return=representation/.test(prefer) ? supaSenden(q, a, 201, JSON.stringify(objekt ? neu[0] : neu)) : supaSenden(q, a, 201, "");
    }
    if (methode === "PATCH") {
      let patch = {}; try { patch = JSON.parse(roh || "{}"); } catch (e) {}
      const treffer = pgFiltern(zeilen, sp).map((r) => Object.assign({}, r, patch));
      return /return=representation/.test(prefer) ? supaSenden(q, a, 200, JSON.stringify(objekt ? treffer[0] || null : treffer)) : supaSenden(q, a, 204, "");
    }
    return supaSenden(q, a, 204, "");
  }
  if (p.startsWith("/functions/v1/")) return supaSenden(q, a, 200, "{}");
  if (p.startsWith("/realtime/v1/")) return supaSenden(q, a, 202, "");
  return supaSenden(q, a, 404, '{"message":"not found"}');
}, (req, sock, head, warte) => {
  /* Echtzeit: Websocket (HTTP/1.1-Upgrade; der h2-Server bietet kein erweitertes CONNECT an, also wie bei Chrome üblich
     eine eigene Verbindung), Phoenix-Antworten wie in Sonde 885-sparsam: jede Nachricht mit ref bekommt phx_reply ok,
     phx_join die postgres_changes-Kennungen; Rundrufe (binär) werden nur gezählt. */
  fremdZ.supa.ws++;
  sock.on("error", () => {});
  const schluessel = crypto.createHash("sha1").update(String(req.headers["sec-websocket-key"]) + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");
  const rahmen = (op, nutz) => {
    const n = nutz.length, kopf = n < 126 ? Buffer.from([0x80 | op, n]) : n < 65536 ? Buffer.from([0x80 | op, 126, n >> 8, n & 255]) : (() => { const b = Buffer.alloc(10); b[0] = 0x80 | op; b[1] = 127; b.writeBigUInt64BE(BigInt(n), 2); return b; })();
    try { sock.write(Buffer.concat([kopf, nutz])); } catch (e) {}
  };
  const senden = (o) => { const t = Buffer.from(JSON.stringify(o)); const w = leitung.rtt(); if (w > 0) setTimeout(() => rahmen(1, t), w); else rahmen(1, t); };
  const text = (m) => {
    fremdZ.supa.wsMsg++;
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
    senden(arr ? [joinRef, ref, topic, "phx_reply", r] : { join_ref: joinRef, ref, topic, event: "phx_reply", payload: r });
    if (event === "phx_join" && topic !== "phoenix") senden(arr ? [joinRef, null, topic, "presence_state", {}] : { join_ref: joinRef, ref: null, topic, event: "presence_state", payload: {} });
  };
  let puffer = head && head.length ? Buffer.from(head) : Buffer.alloc(0);
  const lesen = () => {
    for (;;) {
      if (puffer.length < 2) return;
      const op = puffer[0] & 15, maske = puffer[1] & 128;
      let len = puffer[1] & 127, ab = 2;
      if (len === 126) { if (puffer.length < 4) return; len = puffer.readUInt16BE(2); ab = 4; }
      else if (len === 127) { if (puffer.length < 10) return; len = Number(puffer.readBigUInt64BE(2)); ab = 10; }
      const mk = maske ? 4 : 0;
      if (puffer.length < ab + mk + len) return;
      let nutz = Buffer.from(puffer.subarray(ab + mk, ab + mk + len));
      if (maske) { const m = puffer.subarray(ab, ab + 4); for (let i = 0; i < nutz.length; i++) nutz[i] ^= m[i & 3]; }
      puffer = puffer.subarray(ab + mk + len);
      if (op === 8) { rahmen(8, Buffer.alloc(0)); try { sock.end(); } catch (e) {} return; }
      if (op === 9) { rahmen(10, nutz); continue; }
      if (op === 1) text(nutz.toString("utf8"));
    }
  };
  const los = () => {
    if (sock.destroyed) return;
    sock.write("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " + schluessel + "\r\n\r\n");
    sock.on("data", (c) => { puffer = Buffer.concat([puffer, c]); lesen(); });
    lesen();
  };
  if (warte > 0) setTimeout(los, warte); else los();
}) : null;
/* github.com (blob?raw=true → 302, no-cache) und raw.githubusercontent.com (das Original, max-age=300 + ETag) */
const RAW_ETAG = FOTO ? '"' + crypto.createHash("sha1").update(FOTO).digest("hex") + '"' : "";
const ghSrv = FOTO && H2 ? fremdServer((q, a) => {
  fremdZ.gh.n++;
  a.writeHead(302, { location: "https://raw.githubusercontent.com/XanderFoxy/Deutsch/main/Bilder2/9ob2nzt2.jpeg", "cache-control": "no-cache", "timing-allow-origin": "*", "content-length": 0 });
  a.end();
}) : null;
const rawSrv = FOTO && H2 ? fremdServer((q, a) => {
  fremdZ.gh.n++;
  /* timing-allow-origin nur, damit Element Timing die Malzeit nennt (ohne ihn meldet Chrome für fremde Bilder 0) */
  const h = { "content-type": "image/jpeg", "cache-control": "max-age=" + fremdFrische, etag: RAW_ETAG, "access-control-allow-origin": "*", "timing-allow-origin": "*" };
  if (q.headers["if-none-match"] === RAW_ETAG) { fremdZ.gh.n304++; a.writeHead(304, h); return a.end(); }
  fremdZ.gh.bytes += FOTO.length; h["content-length"] = FOTO.length;
  a.writeHead(200, h);
  leitung.senden(a, FOTO);
}) : null;
const fremde = [supaSrv, ghSrv, rawSrv].filter(Boolean);
function fremdRegeln() {
  const r = [];
  if (supaSrv) r.push("MAP *.supabase.co 127.0.0.1:" + supaSrv.port);
  if (ghSrv) r.push("MAP github.com 127.0.0.1:" + ghSrv.port, "MAP raw.githubusercontent.com 127.0.0.1:" + rawSrv.port);
  return r.concat(["MAP * ~NOTFOUND", "EXCLUDE 127.0.0.1"]).join(", ");
}
/* angemeldet: die Sitzung liegt im Gerät, bevor ein Skript der Seite läuft (wie bei jemandem, der angemeldet blieb) */
function kontoSkript(sitzung) {
  try { const k = "sb-rolcktiryrvjzbwuvobb-auth-token"; if (sitzung && !localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify(sitzung)); } catch (e) {}
}
const SITZUNG = (() => { const ab = Math.floor(T0 / 1000) + 24 * 3600; return { access_token: tokenFuer(ab), refresh_token: "rt-1", expires_in: 24 * 3600, expires_at: ab, token_type: "bearer", user: NUTZER }; })();

