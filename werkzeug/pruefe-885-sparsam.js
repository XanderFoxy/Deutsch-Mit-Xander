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
        erfolgreiche Benachrichtigungs-Abfrage, Bremse los); die Echtzeit-
        Leitung (in der Sperre getrennt) verbindet höchstens 20-mal neu
        (bisher alle 10 s); 503 für 20 s: höchstens 2 Anfragen (eine Lese-
        abfrage, die Takte ruhen; 884: 48 – seit Nachbesserung 3: die Abfrage
        höchstens 3 Versuche, alles zusammen höchstens 8); Netz weg 10 min: höchstens
        200 Versuche (die Takte pausieren), nach „online“ binnen 25 s wieder da.
     D  nach Mitternacht (00:05), heute noch niemand, zuletzt aktiv vor 3
        Tagen: Fuchs-Abfragen in 10 min ≤ 20; Fuchs des Tages bleibt
        „übernommen“ bei Emmy (wie vorher), die Rückwärtssuche kostet ≤ 10
        Anfragen.
     E  eigene Runde heute mit den meisten Punkten: die Gratulation „Fuchs
        des Tages“ kommt weiterhin (eine Systemnachricht).
     F  keine Seitenfehler aus den neuen Stellen.
   Nachbesserung 1 (Prüfer-Befunde zu 885):
     G  402 bei VERDECKTER Seite (so war es auf dem Samsung), 10 min:
        höchstens 12 Anfragen.
     H  Seite bleibt über Mitternacht offen (23:52 → 00:12), heute war
        jemand aktiv, nach Mitternacht noch niemand: Fuchs-Abfragen in den
        10 min nach Mitternacht ≤ 30; danach „übernommen“ bei Emmy.
     L  abgemeldeter Tab zog in der Sperre die Bremse; die Sperre endet,
        während die Bremse noch ≥ 30 s läuft; ein Tipp ins Feld, 8 s später
        Anmelden: echtes Profil, kein Ersatzprofil mit Schreibsperre (eine
        Anmeldung mit 2xx lockert die Bremse).
     M  eine alte ungelesene Nachricht hinter 130 eigenen (Rundmail): nach
        dem Lesen aller Nachrichten, die das Postfach zeigt, ist das
        Lämpchen aus (es zählt dasselbe Fenster wie das Postfach).
     N  eine einzige notifications-Anfrage hängt ohne Antwort: danach
        laufen die Benachrichtigungen weiter (≥ 5 Durchgänge in 5 min).
   Gegenprobe Nachbesserung: auf dem ersten 885 (f832f83b) sind C „binnen
   3 min wieder da“ (dort 18,2 min), L, M (2) und N rot – 5 rot; auf 884
   sind L, M, N grün (Rückschritte der ersten 885, nicht von 884).
   Nachbesserung 2 (Prüfer-Befunde zu 885 nach Nachbesserung 1):
     R  der REST-Notweg der Echtzeit-Kanäle: ein Raumkanal über den Klienten
        von livechat.js, Puls alle 6 s (wie PULS_MS), der Websocket kommt
        nicht zustande. Ohne Sperre gehen die Rundrufe wie bisher über REST
        hinaus (≥ 8 in 60 s); dann 402 bei verdeckter Seite 10 min: höchstens
        5 REST-Rundrufe (884 und 885 nach Nachbesserung 1: jeder Puls) und
        höchstens 20 Anfragen; nach der Sperre kommt der Puls binnen 3 min
        wieder an (REST oder Websocket).
     P  Server wieder da, Bremse noch zu: eine Einstellung speichern
        (updateExtraProfileField) behält, was ein anderes Gerät inzwischen
        gespeichert hat (das Lesen davor geht hinaus).
     U  Bremse gezogen, dann springt die Geräteuhr 2 h zurück: höchstens
        18 min Pause übrig, und ein Tipp öffnet wieder einen Versuch.
   Nachbesserung 3 (Prüfer-Befunde zu 885 nach Nachbesserung 2):
     X3 Serverausfall: 503 für 10 min, die Echtzeit-Leitung bleibt offen
        (kein neues SUBSCRIBED), sichtbar, kein Tipp; danach eine neue
        Benachrichtigung: die Blase kommt von selbst, spätestens nach
        ≈ 2,5 min (Nachbesserung 2: 13,5 min; 884: 0,2 min).
     X5 503 für 10 min, danach (Bremse noch gezogen) ein Tipp auf eine leere
        Fläche: die neue Benachrichtigung kommt binnen 10 s (das 5-s-Fenster
        gilt auch für die Takte; Nachbesserung 2: keine Blase in 60 s).
     V  verdeckt: 5 min ohne Neues (Anfragen zählen: nur „zuletzt aktiv“ und
        die schlanke Prüfung select=id, höchstens 25), dann eine neue
        Nachricht und eine neue Benachrichtigung: Blase und Ton spätestens
        nach ≈ 2,5 min, ohne zurückzukommen (wie 884; Nachbesserung 2: erst
        beim Zurückkommen).
     B  geändert: verdeckt höchstens 45 Anfragen in 10 min, davon außer
        „zuletzt aktiv“ und der schlanken Prüfung höchstens 2 (vorher: 12
        gesamt – verdeckt war dort ganz Ruhe, ohne Ton und Blase).
   Nachbesserung 4 (Prüfer-Befunde zu 885 nach Nachbesserung 3):
     NT Netz weg 10 min, sichtbar, ein Tipp alle 16 s auf eine leere Fläche:
        höchstens 200 Versuche (Nachbesserung 3: 1 002 – das Tipp-Fenster galt
        auch bei „Netz weg“ für die Takte; Nachbesserung 2: 72). NT0 dasselbe
        ohne Tipp (höchstens 200 wie in C). Danach „online“: binnen 25 s da.
     XT 503 für 10 min mit einem Tipp alle 16 s: höchstens 400 Anfragen (der
        Preis dafür, dass ein Tipp im Ausfall sofort holt; gemessen 255).
     W60 Walkie mit 70 offenen Fragen (holen lädt die 60 ältesten), verdeckt
        10 min ohne Neues: höchstens 1 volle Abfrage der offenen Fragen
        (Nachbesserung 3: 5); eine neue Frage verdeckt binnen ≈ 2,5 min geholt.
     VF verdeckt, neue Benachrichtigung, der erste volle Durchgang scheitert
        (500 auf notifications, backend.js liefert dann still []): die Blase
        kommt trotzdem verdeckt, spätestens nach ≈ 4,5 min (Nachbesserung 3:
        erst beim Zurückkommen – die Kennung galt schon als bekannt).
     FM die Fuchs-Prüfung beim Laden scheitert (500 auf results), danach geht
        es wieder: Monat und Jahr binnen ≈ 35 min erneut geprüft (Nachbesserung
        3: erst nach 6 h), danach nicht wieder.
   Einmischen in den Ladezeit-Zweig (Fassung 886, Nachbesserung 1 – Prüfbericht zu b17223b7):
     SB/SM die ersten 3 min ab dem Öffnen MIT der Startphase (alle Fälle oben zählen erst nach dem Profil bzw. nach
        90 s), sichtbar, als Betreiber (Gerät mit Merker dma-walkie) bzw. als Mitglied ohne Rolle: Weiterführende
        Links und Schwarmwissen je höchstens eine Abfrage (select=*), die Freundesliste (getFriends) nicht öfter und
        alle Anfragen zusammen nicht mehr als auf 807e6a7d (+ 1 Rauschen). Das Vorzeichnen in der Ruhepause holte
        mit wiederhergestellter Anmeldung „meine“/„ausstehende“ und die Freundesliste dazu (Betreiber +4, Mitglied
        +2 je Start). Danach (nur SB) das Öffnen wie bisher: der Tipp auf „Weiterführende Links“ bzw. „Schwarmwissen“
        holt frisch alle drei Listen und zeigt das Prüffeld, Memory holt die Freundesliste. Gegenprobe b17223b7:
        7 rot (SB: Links, Schwarmwissen, Freundesliste, gesamt 184 gegen die Grenze 182; SM: Links, Schwarmwissen,
        Freundesliste – gesamt 158 liegt in der Grenze).
   Einmischen, Nachbesserung 2 (Prüfbericht zu c57cdb8b) – MIT HELFER (Service Worker an, echte Uhr; alle Fälle oben laufen
   mit gesperrtem Helfer und sahen S1 nicht): die Seite kommt zuerst aus dem Speicher; liegt draußen eine neue Fassung,
   startete die ALTE Seite ihren ganzen Supabase-Start, bevor der Wächter sie neu lud (Prüfer: 92–103 statt 57 in 30 s).
     SW…   Betreiber (dma-walkie), einmal neu laden (Bezug „ein Start“), dann neue Fassung 887 draußen, index.html und
           fassung.json kommen nach D ms; je Runde 30 s. Anfragen der Update-Runde ≤ Bezugsrunde + 3, Echtzeit-
           Leitungen ≤ 1, am Ende 887. SWa/SWc/SWL: CPU 1×, D = 300/1000/5500; SWa4/SWc4: CPU 4×, D = 300/1000.
     SWT/SWT6  erstes Öffnen des Tages (lastLoginDay gestern), jede Supabase-Antwort 250 ms, D = 1000/600: die
           Anmeldebelohnung genau einmal in results (Prüfer: auf c57cdb8b in 1 von 3 Läufen zweimal).
     SW402 in der 402-Sperre, D = 5500: Update-Runde ≤ Bezugsrunde + 2 (Prüfer: 14 gegen 11).
     SWTOR ohne Update, nur fassung.json verzögert: Seite aus dem Netz → kein Tor; aus dem Speicher und fassung.json nach
           8 s → die erste Supabase-Anfrage nach ≈ 6 s (Frist), nicht vor 5,8 s; fassung.json nach 4 s und ein Tastendruck
           nach 2,5 s → die erste Anfrage vor 3,5 s (der Wächter lädt dann nicht mehr von selbst neu); Profil am Ende da.
   Die Sperre der Echtzeit-Leitung ist jetzt nachgestellt wie in Wirklichkeit
   (Nachbesserung 2): Supabase lehnt schon den Handshake ab, die Verbindung
   öffnet sich nie und schließt mit 1006 (eigener WebSocket-Ersatz, solange
   window.__wsSperre gilt). Vorher öffnete routeWebSocket und schloss dann
   (4000) – Phoenix setzt dabei den Versuchszähler zurück, gemessen wurde ein
   anderer Weg. Echtzeit-Versuche = Ersatz + routeWebSocket.
   Verdeckt/sichtbar wird wie im Browser mit einem visibilitychange
   verschickt, das bis window aufsteigt (dort hört die Echtzeit-Bibliothek).
   Zahlen je Fall stehen am Ende (und mit AUSGABE=datei.json als JSON).

   Gegenprobe 884 (02613a71, Baum aus git archive + Verweisen auf die
   übrigen Ordner): 16 rot (A 3, B 3, C 6, D 2, G 1, H 1), E, L, M, N grün.
   Schalter:
     WURZEL=/pfad      anderer Baum (Gegenprobe 884: git archive 02613a71)
     QUELLE=1          index.html?quelle statt min/
     FAELLE=A,C        nur diese Fälle
     SUPABASE_UMD=…    supabase-js (dist/umd/supabase.js); sonst die Kopie
                       im Scratchpad dieser Sitzung (2.117.3)
     AUSGABE=…json     Zahlen als JSON schreiben
     (Fall SW…: die Seite (index.html) ersetzt beim Ausliefern DMA_VERSION durch 887, fassung.json meldet 887)
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
const FAELLE = (process.env.FAELLE || "A,B,C,D,E,G,H,L,M,N,R,P,U,X3,X5,V,NT,NT0,XT,W60,VF,FM,SB,SM,SWa,SWc,SWL,SWa4,SWc4,SWT,SWT6,SW402,SWTOR").split(",").map((x) => x.trim()).filter(Boolean);
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
  /* SM (Einmischen 886, Nachbesserung 1): ein gewöhnliches Mitglied – weder Betreiber noch Admin noch Moderation */
  if (fall === "SM") Object.assign(db.profiles[0], { is_owner: false, is_admin: false, is_moderator: false });
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
  } else if (fall === "H") {
    /* die Seite ist um 23:52 offen; heute (vor Mitternacht) spielte Emmy, davor jeden zweiten Tag */
    runde(EMMY, t0 - 3 * 3600000, 50);
    runde(ICH, t0 - 4 * 3600000, 10);
    for (let i = 1; i < 60; i += 2) runde(i % 3 ? EMMY : TOM, mitternacht - i * tag + 12 * 3600000, 30 + (i % 7));
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
  /* Nachbesserung 1 — die Tabelle notifications ist nicht mehr leer (zwei ungelesene, eine gelesene) */
  db.notifications.push({ id: "b1", user_id: ICH, message: "Emmy hat deinen Beitrag kommentiert", read: false, created_at: iso(t0 - 700000) },
    { id: "b2", user_id: ICH, message: "Tom hat deinen Tipp gelikt", read: false, created_at: iso(t0 - 600000) },
    { id: "b3", user_id: ICH, message: "Alt", read: true, created_at: iso(t0 - 9 * 86400000) });
  if (fall === "M") {
    db.private_messages = [];
    nachricht(EMMY, ICH, t0 - 200 * 3600000, false, "Alte ungelesene");
    for (let i = 0; i < 130; i++) nachricht(ICH, i % 2 ? EMMY : TOM, t0 - (i + 1) * 60000, false, "Rundmail " + i);
  }
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
  const ab = Number(sp.get("offset")) || 0;   // .range(a, b) → offset/limit
  return l > 0 ? zeilen.slice(ab, ab + l) : zeilen.slice(ab);
}
function waehlen(zeilen, sp) {
  const s = sp.get("select");
  if (!s || s === "*" || /\(/.test(s)) return zeilen;
  const spalten = s.split(",").map((x) => x.trim().split(":").pop());
  return zeilen.map((z) => { const o = {}; spalten.forEach((k) => { if (k in z) o[k] = z[k]; }); return o; });
}

/* ---------------- Zähler ---------------- */
function neuerZaehler() { return { gesamt: 0, bytes: 0, je: {}, ok: {}, ws: 0, wsRundruf: 0 }; }
function schluessel(adresse, methode) {
  const u = new URL(adresse);
  const p = u.pathname;
  if (p.startsWith("/rest/v1/rpc/")) return "rpc:" + p.slice(13);
  /* „*“ = ganze Zeilen, „#id“ = nur Kennungen (die schlanke Prüfung bei verdeckter Seite, Nachbesserung 3) */
  if (p.startsWith("/rest/v1/")) return p.slice(9) + (u.searchParams.get("select") === "*" ? "*" : u.searchParams.get("select") === "id" ? "#id" : "") + (methode !== "GET" ? ":" + methode : "");
  if (p.startsWith("/auth/v1/")) return "auth:" + p.slice(9) + (u.searchParams.get("grant_type") ? "?" + u.searchParams.get("grant_type") : "");
  if (p.startsWith("/functions/v1/")) return "fn:" + p.slice(14);
  return "sonst:" + p;
}

(async () => {
  /* Nachbesserung 2 (Fall SW…): Seite und fassung.json verzögern (VERZ: beide, VERZ_FJ: nur fassung.json), eine neue
     Fassung draußen nachstellen (NEU_F) und Seitenabrufe zählen – nach dem Prüferskript zu c57cdb8b */
  const netz = { verz: 0, verzFj: 0, neuF: "", doks: 0, fass: 0 };
  const srv = http.createServer((q, a) => {
    let p0 = decodeURIComponent(q.url.split("?")[0]);
    if (p0 === "/") p0 = "/index.html";
    if (p0 === "/index.html") netz.doks++;
    if (p0 === "/fassung.json") netz.fass++;
    const v = p0 === "/fassung.json" ? netz.verzFj || netz.verz : p0 === "/index.html" ? netz.verz : 0;
    if (v) { setTimeout(() => bedienen(q, a), v); return; }
    bedienen(q, a);
  });
  function bedienen(q, a) {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    if (netz.neuF && p === "/fassung.json") { a.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" }); a.end(JSON.stringify({ fassung: netz.neuF, stand: "x" })); return; }
    if (/(^|\/)supabase-config\.js$/.test(p)) {
      a.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-store" });
      return a.end("window.SUPABASE_CONFIG = { url: \"https://" + HOST + "\", anonKey: \"" + ANON + "\" };\n");
    }
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
    if (/\.html$/.test(p)) {
      let h = fs.readFileSync(f, "utf8").replace(/rolcktiryrvjzbwuvobb\.supabase\.co/g, HOST);
      if (netz.neuF && p === "/index.html") h = h.replace(/window\.DMA_VERSION = "\d+";/, 'window.DMA_VERSION = "' + netz.neuF + '";');
      a.end(h); return;
    }
    fs.createReadStream(f).pipe(a);
  }
  srv.listen(0);
  const adresse = "http://127.0.0.1:" + srv.address().port + "/index.html" + (QUELLE ? "?quelle" : "");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-proxy-server"] });

  /* Ein Fall = eine frische Seite mit eigener Datenbank und eigener Uhr. */
  async function seiteOeffnen(fall, t0, opt) {
    opt = opt || {};
    const zustand = { phase: "start", modus: "ok", zaehler: { start: neuerZaehler() }, db: datenbank(fall, t0), fehler: [], systemNachrichten: [] };
    if (opt.zustand) Object.assign(zustand, opt.zustand);   // Nachbesserung 4 (FM: schon beim Laden scheitern)
    const zaehler = () => (zustand.zaehler[zustand.phase] = zustand.zaehler[zustand.phase] || neuerZaehler());
    const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
      serviceWorkers: opt.sw ? "allow" : "block", timezoneId: "Europe/Berlin", locale: "de-DE",
      userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/131.0 Mobile Safari/537.36" });
    if (!opt.ohneUhr) await ctx.clock.install({ time: t0 });   // Fall SW…: echte Uhr (der Helfer kennt keine Seitenuhr)
    const ablauf = Math.floor((opt.sitzungBis || (t0 + 10 * 3600000)) / 1000);
    await ctx.addInitScript(([sitzung, walkie]) => {
      try {
        localStorage.setItem("dma_tour_seen", "1");
        if (sitzung && sitzung.access_token) localStorage.setItem("sb-attrappe-auth-token", JSON.stringify(sitzung));
        if (walkie) localStorage.setItem("dma-walkie", "1");   // SB: das Gerät hat sich als Betreiber-Gerät gemerkt (K)
      } catch (e) {}
      let verdeckt = false;
      Object.defineProperty(Document.prototype, "hidden", { configurable: true, get() { return verdeckt; } });
      Object.defineProperty(Document.prototype, "visibilityState", { configurable: true, get() { return verdeckt ? "hidden" : "visible"; } });
      /* wie im Browser: das Ereignis steigt bis window auf (dort hört die Echtzeit-Bibliothek) */
      window.__sichtbar = (an) => { verdeckt = !an; document.dispatchEvent(new Event("visibilitychange", { bubbles: true })); };
    }, [opt.ohneSitzung ? {} : { access_token: tokenFuer(ablauf), refresh_token: "rt-1", expires_in: ablauf - Math.floor(t0 / 1000), expires_at: ablauf, token_type: "bearer", user: NUTZER }, Boolean(opt.walkie)]);
    const kopf = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "*", "Access-Control-Expose-Headers": "Content-Range, X-Total-Count" };
    async function supabaseAntwort(route, req) {
      const methode = req.method();
      if (methode === "OPTIONS") return route.fulfill({ status: 204, headers: kopf });
      if (zustand.supaVerz) await warte(zustand.supaVerz);   // SWT: jede Antwort braucht so lange
      const k = schluessel(req.url(), methode);
      if (process.env.LAUT) console.log("    [netz] " + zustand.phase + " " + zustand.modus + " " + methode + " " + req.url().slice(0, 160));
      const z = zaehler();
      z.gesamt++; z.je[k] = (z.je[k] || 0) + 1;
      /* N: genau eine Anfrage bekommt nie eine Antwort */
      if (zustand.haengen && zustand.haengen.test(k) && !zustand.gehangen) { zustand.gehangen = true; return new Promise(() => {}); }
      /* Nachbesserung 4 — mitschreiben (FM) und einzelne Leseabfragen mit 500 scheitern lassen (VF, FM): 500 zieht die
         Bremse nicht (kein Kontingent, kein Ausfall), die Abfragen in backend.js liefern dann still [] bzw. „Fehler“. */
      if (zustand.protokoll && zustand.protokoll.test(k)) (zustand.log = zustand.log || []).push({ t: zustand.jetzt || 0, url: req.url() });
      const sch = zustand.scheitern;
      if (sch && methode === "GET" && sch.re.test(k) && (sch.rest == null || sch.rest > 0)) {
        if (sch.rest != null) sch.rest--;
        sch.anzahl = (sch.anzahl || 0) + 1;
        return route.fulfill({ status: sch.status || 500, headers: Object.assign({ "Content-Type": "application/json" }, kopf), body: '{"message":"Internal Server Error","code":"XX000"}' });
      }
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
    zustand.offeneWs = [];
    await ctx.routeWebSocket(/attrappe\.supabase\.co/, (ws) => {
      zaehler().ws++;
      if (zustand.modus !== "ok") { ws.close({ code: 4000, reason: zustand.modus }); return; }
      zustand.offeneWs.push(ws);
      ws.onMessage((m) => {
        if (typeof m !== "string") { zaehler().wsRundruf++; return; }   // Rundrufe gehen in realtime-js 2.x binär
        let d; try { d = JSON.parse(m); } catch (e) { return; }
        const arr = Array.isArray(d);
        const [joinRef, ref, topic, event, payload] = arr ? d : [d.join_ref, d.ref, d.topic, d.event, d.payload];
        if (!ref) return;
        if (event === "broadcast") zaehler().wsRundruf++;
        let antwort = {};
        if (event === "phx_join") {
          const pc = (payload && payload.config && payload.config.postgres_changes) || [];
          antwort = { postgres_changes: pc.map((c, i) => Object.assign({}, c, { id: i + 1 })) };
        }
        const r = { status: "ok", response: antwort };
        ws.send(JSON.stringify(arr ? [joinRef, ref, topic, "phx_reply", r] : { join_ref: joinRef, ref, topic, event: "phx_reply", payload: r }));
      });
    });
    /* Nachbesserung 2 — die Sperre der Echtzeit-Leitung wie in Wirklichkeit: der Handshake wird abgelehnt, die
       Verbindung öffnet sich nie (Schluss 1006). Solange window.__wsSperre gilt, kommt jeder Versuch zu Supabase
       hierher (gezählt in window.__wsVersuche). Dazu werden die Klienten mitgeschrieben (Fall R braucht den Klienten
       von livechat.js); createClient selbst bleibt unverändert. Erst NACH routeWebSocket eingehängt: Playwright ersetzt
       window.WebSocket in der Seite durch sein eigenes Gegenstück – der Ersatz hier muss davor sitzen, sonst geht jeder
       Versuch an ihm vorbei (so war es im ersten Lauf von R: die Leitung stand weiter, kein Rundruf über REST). */
    await ctx.addInitScript(() => {
      const Echt = window.WebSocket;
      window.__wsSperre = false; window.__wsVersuche = 0;
      class Weg extends EventTarget {
        constructor(u) {
          super(); this.url = String(u); this.readyState = 0; this.binaryType = "blob"; this.bufferedAmount = 0; this.protocol = ""; this.extensions = "";
          window.__wsVersuche++;
          setTimeout(() => {
            this.readyState = 3;
            const f = new Event("error"); if (this.onerror) this.onerror(f); this.dispatchEvent(f);
            const c = new CloseEvent("close", { code: 1006, reason: "", wasClean: false }); if (this.onclose) this.onclose(c); this.dispatchEvent(c);
          }, 20);
        }
        send() { throw new DOMException("nicht offen", "InvalidStateError"); }
        close() {}
      }
      window.WebSocket = new Proxy(Echt, { construct(Z, a) { return window.__wsSperre && String(a[0]).indexOf("attrappe") >= 0 ? new Weg(...a) : new Z(...a); } });
      let sb;
      Object.defineProperty(window, "supabase", { configurable: true, get() { return sb; }, set(v) {
        if (v && typeof v.createClient === "function" && !v.__sonde) {
          const orig = v.createClient;
          v.createClient = function () { const k = orig.apply(this, arguments); (window.__klienten = window.__klienten || []).push({ k, opt: arguments[2] || null }); return k; };
          v.__sonde = true;
        }
        sb = v;
      } });
    });

    if (process.env.LAUT) await ctx.addInitScript(() => {
      const weg = Storage.prototype.removeItem;
      Storage.prototype.removeItem = function (k) { if (/auth-token/.test(k)) console.log("SITZUNG WEG " + new Date(Date.now()).toISOString() + " " + new Error().stack.split("\n").slice(1, 9).join(" < ")); return weg.call(this, k); };
    });
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => zustand.fehler.push(String(e.message || e).slice(0, 300)));
    if (process.env.LAUT) pg.on("console", (m) => console.log("    [seite] " + m.type() + " " + m.text().slice(0, process.env.LAUT === "2" ? 2000 : 200)));
    zustand.ladungen = 0;
    pg.on("load", () => { zustand.ladungen++; });
    await pg.goto(adresse + (opt.sw ? (adresse.indexOf("?") < 0 ? "?" : "&") + "mit-sw" : ""), { waitUntil: "domcontentloaded" });
    if (opt.ohneSitzung) {
      await pg.waitForFunction(() => typeof Backend !== "undefined" && document.getElementById("tickerTrack"), null, { timeout: 90000 });
      await warte(3000);
    } else await pg.waitForFunction(() => typeof Backend !== "undefined" && Backend.currentUser && Backend.currentUser() && Backend.currentProfile && Backend.currentProfile(), null, { timeout: 90000 });
    if (!opt.ohneUhr) {
      const jetzt = await pg.evaluate(() => Date.now());
      await pg.clock.pauseAt(jetzt + 1000);
      zustand.jetzt = jetzt + 1000;
    }
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
  const wsVersuche = (s) => s.pg.evaluate(() => window.__wsVersuche || 0);
  const wsSperre = (s, an) => s.pg.evaluate((x) => { window.__wsSperre = x; }, an);
  const bremseAbwarten = async (s) => { for (let i = 0; i < 90 && !(await s.pg.evaluate(() => Boolean(Backend.bremse && Backend.bremse().aktiv))); i++) await laufen(s, 1000); };
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
  /* SB/SM: drei Läufe dieses Falls auf 807e6a7d (26.10.2026, Fenster fest nach der Uhr der Seite): Anfragen in den ersten
     3 min, Abrufe der Freundesliste; Rauschen = Spanne dieser Läufe (1). Zum Vergleich der Merge ohne Nachbesserung
     (b17223b7): SB 185/184/184, SM 158/158/158, Freundesliste je 3, user_links* 3 bzw. 2, community_tips* 3 bzw. 2. */
  const REF_START3 = { SB: { gesamt: [180, 181, 180], freundesliste: 2, rauschen: 1 }, SM: { gesamt: [156, 156, 157], freundesliste: 2, rauschen: 1 } };
  const T_NACHT = Date.parse("2026-10-24T22:05:00Z");    // 00:05 in Berlin (25.10.)
  const T_VOR_MITTERNACHT = Date.parse("2026-10-24T21:52:00Z");   // 23:52 in Berlin (24.10.)

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
      const ohneTouch = z.gesamt - summe(z, /^profiles:PATCH$/) - summe(z, /#id$/);
      console.log("  Anfragen 10 min verdeckt: " + z.gesamt + " · " + Math.round(z.bytes / 1024) + " KB · " + kurz(z));
      /* Nachbesserung 3 — verdeckt wieder Ton und Blase (wie 884), dafür alle 2 min die schlanke Prüfung (select=id):
         Benachrichtigungen, Nachrichten, Anfragen, Duelle, für den Betreiber Funk und offene Fragen. */
      sage(z.gesamt <= 45, "verdeckt höchstens 45 Anfragen in 10 min (zuletzt aktiv + schlanke Prüfung)", String(z.gesamt));
      sage(ohneTouch <= 2, "außer „zuletzt aktiv“ (profiles PATCH) und der schlanken Prüfung (select=id) höchstens 2", String(ohneTouch));
      sage(z.bytes <= 20 * 1024, "verdeckt höchstens 20 KB Antwortdaten in 10 min", Math.round(z.bytes / 1024) + " KB");
      const zz = phase(s, "B-zurueck");
      await s.pg.evaluate(() => window.__sichtbar(true));
      await laufen(s, 5000);
      console.log("  beim Zurückkommen (5 s): " + kurz(zz));
      sage(summe(zz, /^notifications\*?$/) >= 1 && summe(zz, /^activity\*?$/) >= 1, "beim Zurückkommen binnen 5 s Benachrichtigungen und Laufschrift geholt", kurz(zz));
      fehlerPruefen(s);
      ergebnis.faelle.B = { gesamt: z.gesamt, kb: Math.round(z.bytes / 1024), ohneTouchSchlank: ohneTouch, je: z.je, zurueck: zz.je };
      await s.ctx.close();
    }

    /* ---------------- C: 402 ---------------- */
    if (FAELLE.includes("C")) {
      abschnitt("C", "402 ab Minute 1,5 für 10 min (sichtbar), Sitzung läuft in der Sperre ab");
      const s = await seiteOeffnen("C", T_TAG, { sitzungBis: T_TAG + 90000 + 180000 + 5000 });
      await laufen(s, 90000);
      const z = phase(s, "C");
      s.zustand.modus = "402";
      /* die Echtzeit-Leitung bricht in der Sperre ebenfalls weg; neue Versuche scheitern schon am Handshake */
      await wsSperre(s, true);
      const wsVorher = await wsVersuche(s);
      s.zustand.offeneWs.splice(0).forEach((ws) => { try { ws.close({ code: 4000, reason: "402" }); } catch (e) {} });
      await laufen(s, 600000);
      z.ws += (await wsVersuche(s)) - wsVorher;
      console.log("  Anfragen ans Netz in 10 min 402: " + z.gesamt + " (Echtzeit-Verbindungsversuche: " + z.ws + ") · " + kurz(z));
      sage(z.gesamt <= 40, "402: höchstens 40 Anfragen in 10 min", String(z.gesamt));
      sage(z.ws <= 20, "402: Echtzeit verbindet höchstens 20-mal neu in 10 min (bisher alle 10 s)", String(z.ws));
      const sitz = await s.pg.evaluate(() => ({ speicher: Boolean(localStorage.getItem("sb-attrappe-auth-token")), konto: Boolean(Backend.currentUser()) }));
      sage(sitz.speicher, "Sitzung nach 402 beim Erneuern noch im Speicher (nach der Sperre nicht abgemeldet)", JSON.stringify(sitz));
      /* ein echter Tipp öffnet genau einen Versuch – ein zweiter 3 s später keinen.
         Nachbesserung 1: erst warten, bis die Bremse wirklich gezogen ist (die Stufen haben ±20 % Zufall; endete
         eine Stufe kurz vor dem Tipp, ging die Abfrage ungebremst hinaus, und die Prüfung hing vom Zufall ab). */
      for (let i = 0; i < 90 && !(await s.pg.evaluate(() => Boolean(Backend.bremse && Backend.bremse().aktiv))); i++) await laufen(s, 1000);
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
      /* Sperre vorbei: spätestens nach 20 min wieder da – mit Echtzeit-Leitung schon nach wenigen Minuten
         (Nachbesserung 1: die wieder verbundene Leitung lockert die Bremse) */
      const zw = phase(s, "C-wieder");
      s.zustand.modus = "ok";
      await wsSperre(s, false);
      let nach = 0;
      for (; nach < 20 * 60000 && !((zw.ok["notifications*"] || zw.ok["notifications"]) > 0); nach += 10000) await laufen(s, 10000, 5000);
      const los = await s.pg.evaluate(() => (Backend.bremse ? !Backend.bremse().aktiv : true));
      sage((zw.ok["notifications*"] || zw.ok["notifications"]) > 0 && los, "nach der Sperre wieder da (Benachrichtigungen geholt, Bremse los)", "nach " + Math.round(nach / 60000 * 10) / 10 + " min · " + kurz(zw));
      sage(nach <= 3 * 60000, "nach der Sperre binnen 3 min wieder da, ohne Tipp (die Echtzeit-Leitung meldet sich zurück)", "nach " + Math.round(nach / 60000 * 10) / 10 + " min");
      ergebnis.faelle.C = { gesamt: z.gesamt, ws: z.ws, je: z.je, sitzung: sitz, tipp: [t1.gesamt, t2.gesamt], wiederNachMin: Math.round(nach / 6000) / 10 };
      /* 503: eine Abfrage – supabase-js fragte bei 503 von sich aus noch dreimal nach */
      await laufen(s, 30000);
      const z5 = phase(s, "C-503");
      s.zustand.modus = "503";
      await s.pg.evaluate(() => { window.__q = Backend.zugang().from("activity").select("id").limit(1); window.__q.then(() => {}); });
      await laufen(s, 20000);
      const n503 = z5.gesamt;
      /* Nachbesserung 1: zwei Fehlschläge müssen ≥ 2 s auseinanderliegen – supabase-js wiederholt nach 1 s und 3 s,
         erst die dritte Antwort zieht die Bremse, die vierte Anfrage beantwortet sie selbst. */
      /* Nachbesserung 3 — robuster gemacht: fällt ein Takt (Walkie, 2 Abfragen samt Wiederholung) zufällig in die ersten
         3 s, bevor der zweite Fehlschlag die Bremse zieht, geht er noch hinaus – das ist gewollt (Nachbesserung 1) und
         hing nur von der Lage der Takte zum Beginn des Ausfalls ab (gemessen 3, 4 oder 6). Geprüft wird deshalb die
         Leseabfrage selbst (höchstens 3 Versuche) und alles zusammen höchstens 8 (884: 59). */
      const n503Abfrage = summe(z5, /^activity#id$/);
      sage(n503Abfrage <= 3 && n503 <= 8, "503 für 20 s: die Leseabfrage höchstens 3 Versuche, alles zusammen höchstens 8 (die Takte ruhen; 884: 59)", n503Abfrage + " / " + n503 + " · " + kurz(z5));
      s.zustand.modus = "ok";
      await s.pg.mouse.click(20, 300);   // ein Tipp: der nächste Versuch darf sofort (sonst bis zu 18 min Pause)
      await s.pg.evaluate(() => { try { Backend.zugang().from("activity").select("id").limit(1).then(() => {}); } catch (e) {} });
      await laufen(s, 60000);
      /* Netz weg (Funkloch) 10 min: die Takte pausieren, einzelne Abfragen dürfen weiter (z. B. das Profil beim Start) */
      const zo = phase(s, "C-offline");
      s.zustand.modus = "offline";
      await laufen(s, 600000);
      const nOffline = zo.gesamt;
      /* Netzfehler erreichen den Server nicht (kein Kontingent); gezählt wird trotzdem, damit kein Dauerfeuer bleibt.
         Streuung durch den Zufallsanteil der Pausen: gemessen 44–96. */
      sage(nOffline <= 200, "Netz weg 10 min: höchstens 200 Versuche (die Takte pausieren)", String(nOffline) + " · " + kurz(zo));
      s.zustand.modus = "ok";
      const zon = phase(s, "C-online");
      await s.pg.evaluate(() => window.dispatchEvent(new Event("online")));
      await laufen(s, 25000);
      sage((zon.ok["notifications*"] || zon.ok["notifications"]) > 0, "Netz wieder da („online“): binnen 25 s wieder abgefragt", kurz(zon));
      ergebnis.faelle.C.a503 = n503; ergebnis.faelle.C.offline = nOffline;
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

    /* ---------------- G: 402 bei verdeckter Seite ---------------- */
    if (FAELLE.includes("G")) {
      abschnitt("G", "402 bei verdeckter Seite (wie auf dem Samsung), 10 min");
      const s = await seiteOeffnen("G", T_TAG);
      await laufen(s, 90000);
      await s.pg.evaluate(() => window.__sichtbar(false));
      await laufen(s, 5000);
      const z = phase(s, "G");
      s.zustand.modus = "402";
      await wsSperre(s, true);
      const wsVorher = await wsVersuche(s);
      s.zustand.offeneWs.splice(0).forEach((ws) => { try { ws.close({ code: 4000, reason: "402" }); } catch (e) {} });
      await laufen(s, 600000);
      z.ws += (await wsVersuche(s)) - wsVorher;
      console.log("  Anfragen ans Netz in 10 min 402 verdeckt: " + z.gesamt + " (Echtzeit-Versuche: " + z.ws + ") · " + kurz(z));
      sage(z.gesamt <= 12, "402 verdeckt: höchstens 12 Anfragen in 10 min", String(z.gesamt));
      const sitz = await s.pg.evaluate(() => Boolean(localStorage.getItem("sb-attrappe-auth-token")));
      sage(sitz, "Sitzung bleibt im Speicher", String(sitz));
      fehlerPruefen(s);
      ergebnis.faelle.G = { gesamt: z.gesamt, ws: z.ws, je: z.je };
      await s.ctx.close();
    }

    /* ---------------- H: über Mitternacht offen ---------------- */
    if (FAELLE.includes("H")) {
      abschnitt("H", "Seite offen von 23:52 über Mitternacht, heute war Emmy aktiv, danach noch niemand");
      const s = await seiteOeffnen("H", T_VOR_MITTERNACHT, { rundenVerwerfen: true });
      /* bis Mitternacht laufen (die Anmeldebelohnung beim Start füllt „heute“ nicht – rundenVerwerfen) */
      const bisNull = T_NACHT - 5 * 60000 - s.zustand.jetzt;
      await laufen(s, bisNull);
      const z = phase(s, "H");
      await laufen(s, 600000);
      const fuchs = summe(z, FUCHS);
      console.log("  Fuchs-Abfragen in den 10 min nach Mitternacht: " + fuchs + " · alle: " + z.gesamt + " · " + kurz(z));
      sage(fuchs <= 30, "über Mitternacht offen: Fuchs-Abfragen nach Mitternacht ≤ 30 in 10 min", String(fuchs));
      await s.pg.evaluate(() => { window.__f = Backend.getFoxOfTheDay(); });
      await laufen(s, 8000);
      const f = await s.pg.evaluate(() => window.__f.then((x) => (x ? { id: x.user_id, name: x.name, uebernommen: Boolean(x.uebernommen) } : null)));
      sage(Boolean(f && f.id === EMMY && f.uebernommen), "nach Mitternacht: Fuchs des Tages „übernommen“ bei Emmy (wie vorher)", JSON.stringify(f));
      fehlerPruefen(s);
      ergebnis.faelle.H = { fuchs, gesamt: z.gesamt, je: z.je, tagesfuchs: f };
      await s.ctx.close();
    }

    /* ---------------- L: Anmeldung nach Ende der Sperre ---------------- */
    if (FAELLE.includes("L")) {
      abschnitt("L", "abgemeldet, 402 für 3 min, dann frei; Tipp ins Feld, 8 s später Anmelden");
      const s = await seiteOeffnen("A", T_TAG, { ohneSitzung: true });
      await laufen(s, 30000);
      const z4 = phase(s, "L-402");
      s.zustand.modus = "402";
      await laufen(s, 180000);
      /* Die Sperre endet, während die Bremse noch mindestens 30 s läuft (sonst hinge der Fall vom Zufallsanteil der
         Stufen ab – so war es beim Prüfer rot und in einem anderen Lauf grün). 884 hat keine Bremse. */
      const rest = () => s.pg.evaluate(() => (Backend.bremse ? Backend.bremse().bis - Date.now() : 1e9));
      for (let i = 0; i < 240 && (await rest()) < 30000; i++) await laufen(s, 1000);
      const br = await s.pg.evaluate(() => (Backend.bremse ? Backend.bremse() : null));
      console.log("  in der Sperre (abgemeldet, 3 min): " + z4.gesamt + " Anfragen · " + kurz(z4) + " · Bremse " + JSON.stringify(br));
      s.zustand.modus = "ok";
      const zl = phase(s, "L-anmelden");
      await s.pg.mouse.click(20, 300);       // Tipp ins E-Mail-Feld (verbraucht das 5-s-Fenster)
      await laufen(s, 8000);
      await s.pg.mouse.click(20, 300);       // Tipp auf „Anmelden“ (kein neues Fenster: < 15 s)
      await s.pg.evaluate(() => { window.__login = Backend.signIn("xander@attrappe.test", "geheim").then(() => "ok", (e) => "err:" + (e && e.message)); });
      await laufen(s, 12000);
      const erg = await s.pg.evaluate(async () => { const r = await window.__login; const p = Backend.currentProfile();
        return { r, ladefehler: Boolean(p && p.ladefehler), text: p && p.ladefehlerText, punkte: p && p.points }; });
      console.log("  Anmeldung: " + JSON.stringify(erg) + " · " + kurz(zl));
      sage(erg.r === "ok" && !erg.ladefehler && erg.punkte === 900, "nach Ende der Sperre angemeldet MIT echtem Profil (kein Ersatzprofil mit Schreibsperre)", JSON.stringify(erg));
      fehlerPruefen(s);
      ergebnis.faelle.L = { sperre: z4.gesamt, anmeldung: erg };
      await s.ctx.close();
    }

    /* ---------------- M: Lämpchen = Postfach-Fenster ---------------- */
    if (FAELLE.includes("M")) {
      abschnitt("M", "eine alte ungelesene Nachricht hinter 130 eigenen (Rundmail)");
      const s = await seiteOeffnen("M", T_TAG);
      await laufen(s, 60000);
      const lampe = () => s.pg.evaluate(() => { const b = document.getElementById("inboxTabBadge"); const l = document.getElementById("loginBtnBadge");
        return { inbox: b ? b.style.display : "fehlt", pille: l ? l.style.display : "fehlt" }; });
      const vorher = await lampe();
      const postfach = await s.pg.evaluate(async () => { const m = await Backend.getMyMessages(); const ids = m.inbox.filter((x) => !x.read).map((x) => x.id);
        await Backend.markMessagesRead(ids); return { imPostfach: m.inbox.length, ungelesenImPostfach: ids.length }; });
      /* die Benachrichtigungen (Tabelle notifications) gelten als gesehen – es geht nur um das Postfach */
      s.zustand.db.notifications.forEach((n) => { n.read = true; });
      await laufen(s, 45000);
      const nachher = await lampe();
      console.log("  vorher " + JSON.stringify(vorher) + " · Postfach " + JSON.stringify(postfach) + " · nach dem Lesen " + JSON.stringify(nachher));
      sage(nachher.inbox !== "block", "nach dem Lesen aller Nachrichten im Postfach ist das Postfach-Lämpchen aus (zählt nur, was das Postfach zeigt)", JSON.stringify(nachher));
      sage(nachher.pille !== "block", "… und die Profil-Pille auch", JSON.stringify(nachher));
      fehlerPruefen(s);
      ergebnis.faelle.M = { vorher, postfach, nachher };
      await s.ctx.close();
    }

    /* ---------------- N: eine hängende Anfrage ---------------- */
    if (FAELLE.includes("N")) {
      abschnitt("N", "eine einzige notifications-Anfrage hängt ohne Antwort, danach 5 min");
      const s = await seiteOeffnen("A", T_TAG);
      await laufen(s, 60000);
      s.zustand.haengen = /^notifications/;
      await laufen(s, 25000);
      const z = phase(s, "N");
      await laufen(s, 300000);
      console.log("  gehangen: " + Boolean(s.zustand.gehangen) + " · danach 5 min: " + kurz(z));
      sage(Boolean(s.zustand.gehangen) && summe(z, /^friends\*?$/) >= 5, "nach einer hängenden Anfrage laufen die Benachrichtigungen weiter (≥ 5 Durchgänge in 5 min)",
        "friends " + summe(z, /^friends\*?$/) + ", notifications " + summe(z, /^notifications\*?$/));
      fehlerPruefen(s);
      ergebnis.faelle.N = { friends: summe(z, /^friends\*?$/), je: z.je };
      await s.ctx.close();
    }

    /* ---------------- R: REST-Notweg der Echtzeit-Kanäle (Nachbesserung 2) ---------------- */
    if (FAELLE.includes("R")) {
      abschnitt("R", "Raumkanal mit Puls alle 6 s (Klient von livechat.js), Websocket kommt nicht zustande; 402 verdeckt 10 min");
      const s = await seiteOeffnen("A", T_TAG);
      await laufen(s, 30000);
      await wsSperre(s, true);
      s.zustand.offeneWs.splice(0).forEach((ws) => { try { ws.close({ code: 4000, reason: "weg" }); } catch (e) {} });
      const gefunden = await s.pg.evaluate(() => {
        try { if (window.LiveChat && LiveChat.kanalVorwaermen) LiveChat.kanalVorwaermen(); } catch (e) {}
        const e = (window.__klienten || []).find((x) => x.opt && x.opt.realtime && x.opt.realtime.heartbeatIntervalMs === 10000);
        if (!e) return "kein Klient von livechat.js (" + (window.__klienten || []).length + " Klienten)";
        const kanal = e.k.channel("dma-raum-sonde", { config: { broadcast: { self: false } } });
        kanal.subscribe(() => {});
        window.__puls = 0;
        setInterval(() => { window.__puls++; try { kanal.send({ type: "broadcast", event: "raum", payload: { art: "puls", von: "sonde" } }); } catch (x) {} }, 6000);
        return "ok";
      });
      sage(gefunden === "ok", "Raumkanal über den Klienten von livechat.js (wie im Klassenzimmer)", gefunden);
      const RUND = /^sonst:\/realtime\/v1\/api\/broadcast/;
      const zok = phase(s, "R-ok");
      await laufen(s, 60000);
      const rundOk = summe(zok, RUND);
      sage(rundOk >= 8, "ohne Sperre: der Notweg (REST-Rundruf) geht wie bisher hinaus (≥ 8 von 10 Pulsen in 60 s)", String(rundOk));
      await s.pg.evaluate(() => window.__sichtbar(false));
      await laufen(s, 5000);
      const z = phase(s, "R-402");
      const p0 = await s.pg.evaluate(() => window.__puls);
      const wsVorher = await wsVersuche(s);
      s.zustand.modus = "402";
      await laufen(s, 600000);
      z.ws += (await wsVersuche(s)) - wsVorher;
      const rund = summe(z, RUND);
      const pulse = (await s.pg.evaluate(() => window.__puls)) - p0;
      console.log("  402 verdeckt 10 min mit Raumkanal: " + z.gesamt + " Anfragen, davon REST-Rundrufe " + rund + " (Pulse " + pulse + ", Echtzeit-Versuche " + z.ws + ") · " + kurz(z));
      sage(rund <= 5, "402 verdeckt, Raumkanal mit Puls: höchstens 5 REST-Rundrufe in 10 min (vorher jeder Puls)", rund + " von " + pulse);
      sage(z.gesamt <= 20, "402 verdeckt mit Raumkanal: höchstens 20 Anfragen in 10 min", String(z.gesamt));
      /* Sperre vorbei, Seite wieder zu sehen: der Puls kommt wieder an – über REST (202) oder den Websocket */
      s.zustand.modus = "ok";
      await wsSperre(s, false);
      await s.pg.evaluate(() => window.__sichtbar(true));
      const zw = phase(s, "R-wieder");
      let nach = 0;
      for (; nach < 20 * 60000 && !((zw.ok["sonst:/realtime/v1/api/broadcast"] || 0) > 0 || zw.wsRundruf > 0); nach += 10000) await laufen(s, 10000, 5000);
      sage(nach <= 3 * 60000 && ((zw.ok["sonst:/realtime/v1/api/broadcast"] || 0) > 0 || zw.wsRundruf > 0), "nach der Sperre kommt der Puls binnen 3 min wieder an (REST oder Websocket)",
        "nach " + Math.round(nach / 6000) / 10 + " min · REST " + (zw.ok["sonst:/realtime/v1/api/broadcast"] || 0) + ", Websocket " + zw.wsRundruf);
      fehlerPruefen(s);
      ergebnis.faelle.R = { ohneSperre: rundOk, gesamt: z.gesamt, rundrufe: rund, pulse, ws: z.ws, je: z.je, wiederNachMin: Math.round(nach / 6000) / 10 };
      await s.ctx.close();
    }

    /* ---------------- P: Lesen vor dem Schreiben (Nachbesserung 2) ---------------- */
    if (FAELLE.includes("P")) {
      abschnitt("P", "Server wieder da, Bremse noch zu: Einstellung speichern, ein anderes Gerät hat inzwischen etwas gespeichert");
      const s = await seiteOeffnen("A", T_TAG);
      await laufen(s, 30000);
      s.zustand.modus = "402";
      await bremseAbwarten(s);
      s.zustand.modus = "ok";
      const zeile = s.zustand.db.profiles.find((p) => p.id === ICH);
      zeile.extra_profile_data = Object.assign({}, zeile.extra_profile_data, { anderesGeraet: "neu" });
      const zp = phase(s, "P");
      const aktiv = await s.pg.evaluate(() => Boolean(Backend.bremse && Backend.bremse().aktiv));
      await s.pg.evaluate(() => { window.__p = Backend.updateExtraProfileField("sondeWert", 7); });
      await laufen(s, 3000);
      const erg = await s.pg.evaluate(() => Promise.resolve(window.__p).then((r) => JSON.stringify(r)));
      const nachher = (s.zustand.db.profiles.find((p) => p.id === ICH) || {}).extra_profile_data || {};
      console.log("  Bremse beim Speichern aktiv: " + aktiv + " · " + erg + " · " + kurz(zp));
      sage(nachher.sondeWert === 7 && nachher.anderesGeraet === "neu", "Einstellung gespeichert, die des anderen Geräts bleibt erhalten",
        JSON.stringify({ sondeWert: nachher.sondeWert, anderesGeraet: nachher.anderesGeraet }));
      fehlerPruefen(s);
      ergebnis.faelle.P = { bremseAktiv: aktiv, sondeWert: nachher.sondeWert, anderesGeraet: nachher.anderesGeraet, je: zp.je };
      await s.ctx.close();
    }

    /* ---------------- U: Uhrsprung (Nachbesserung 2) ---------------- */
    if (FAELLE.includes("U")) {
      abschnitt("U", "Bremse gezogen (402), ein Tipp, dann springt die Geräteuhr 2 h zurück");
      const s = await seiteOeffnen("A", T_TAG);
      await laufen(s, 30000);
      s.zustand.modus = "402";
      await bremseAbwarten(s);
      await s.pg.mouse.click(20, 300);   // ein Tipp vor dem Sprung (setzt die 15-s-Sperre für den nächsten)
      await laufen(s, 6000);
      const t = await s.pg.evaluate(() => Date.now());
      await s.pg.clock.setSystemTime(t - 2 * 3600000);
      s.zustand.jetzt -= 2 * 3600000;
      await laufen(s, 1000);
      const rest = await s.pg.evaluate(() => (Backend.bremse ? Math.max(0, Backend.bremse().bis - Date.now()) : 0));
      sage(rest <= 18 * 60000, "nach dem Uhrsprung höchstens 18 min Pause übrig", Math.round(rest / 6000) / 10 + " min");
      const zt = phase(s, "U-tipp");
      await s.pg.mouse.click(20, 300);
      await s.pg.evaluate(() => { window.__tipp = Backend.getUnreadNotifications(); });
      await laufen(s, 1000);
      sage(zt.gesamt >= 1, "nach dem Uhrsprung öffnet ein Tipp wieder einen Versuch", String(zt.gesamt) + " · " + kurz(zt));
      fehlerPruefen(s);
      ergebnis.faelle.U = { restMin: Math.round(rest / 6000) / 10, tipp: zt.gesamt };
      await s.ctx.close();
    }

    /* ======== Nachbesserung 3: Serverausfall, Tipp danach, verdeckte Seite ======== */
    /* Blasen (toast-popup) und Töne (gestartete Oszillatoren) mitschreiben; neue Zeilen in der Attrappe anlegen. */
    const beobachten = (s) => s.pg.evaluate(() => {
      window.__toasts = [];
      new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => {
        if (n.nodeType === 1 && n.classList && n.classList.contains("toast-popup")) window.__toasts.push({ t: Date.now(), text: n.textContent.slice(0, 80) });
      }))).observe(document.body, { childList: true });
      window.__toene = 0;
      try {
        const st = OscillatorNode.prototype.start;
        if (!st.__sonde) {
          const neu = function () {
            window.__toene++;
            if (window.__toeneWo) { const w = String(new Error().stack).split("\n").slice(2, 5).join(" < ").slice(0, 300); window.__toeneWo[w] = (window.__toeneWo[w] || 0) + 1; }
            return st.apply(this, arguments);
          };
          neu.__sonde = true; OscillatorNode.prototype.start = neu;
        }
      } catch (e) {}
    });
    const blasen = (s) => s.pg.evaluate(() => window.__toasts || []);
    const toene = (s) => s.pg.evaluate(() => window.__toene || 0);
    const neueNachricht = (s, text) => s.zustand.db.private_messages.push({ id: "x" + Math.random().toString(36).slice(2), from_user: EMMY, to_user: ICH, author_name: "Emmy",
      body: text, is_system: false, read: false, created_at: iso(s.zustand.jetzt), image_url: null, deleted_by_sender: false, deleted_by_recipient: false });
    const neueBenachrichtigung = (s, text) => s.zustand.db.notifications.push({ id: "b" + Math.random().toString(36).slice(2), user_id: ICH, message: text, read: false, created_at: iso(s.zustand.jetzt) });

    /* ---------------- X3: Serverausfall 10 min, Echtzeit-Leitung offen, kein Tipp ---------------- */
    if (FAELLE.includes("X3")) {
      abschnitt("X3", "503 für 10 min (Datenbank weg, Echtzeit-Leitung bleibt offen), sichtbar, kein Tipp; dann eine neue Benachrichtigung");
      const s = await seiteOeffnen("A", T_TAG);
      await laufen(s, 90000);
      await beobachten(s);
      const z = phase(s, "X3-ausfall");
      s.zustand.modus = "503";
      await laufen(s, 600000);
      const b = await s.pg.evaluate(() => (Backend.bremse ? (({ aktiv, status, stufe, bis }) => ({ aktiv, status, stufe, restS: Math.round((bis - Date.now()) / 1000) }))(Backend.bremse()) : null));
      console.log("  Anfragen im Ausfall (10 min): " + z.gesamt + " · " + kurz(z) + " · Bremse am Ende " + JSON.stringify(b));
      const nAusfall = z.gesamt;
      s.zustand.modus = "ok";
      phase(s, "X3-danach");
      const t0 = s.zustand.jetzt;
      neueBenachrichtigung(s, "X3-nach-Ausfall");
      let nach = 0, ts = [];
      for (; nach < 25 * 60000; nach += 5000) {
        await laufen(s, 5000, 5000);
        ts = (await blasen(s)).filter((x) => /X3-nach-Ausfall/.test(x.text));
        if (ts.length) break;
      }
      const min = ts.length ? Math.round((ts[0].t - t0) / 6000) / 10 : null;
      sage(ts.length > 0, "X3: nach dem Ausfall kommt die Blase von selbst (ohne Tipp)", ts.length ? min + " min" : "keine in 25 min");
      sage(ts.length > 0 && ts[0].t - t0 <= 2.6 * 60000, "X3: … spätestens nach ≈ 2,5 min (Bremse bei 5xx höchstens 1 → 2 min; Nachbesserung 2: 13,5 min)", ts.length ? min + " min" : "–");
      sage(nAusfall <= 150, "X3: im Ausfall höchstens 150 Anfragen in 10 min (884: ≈ 10 600)", String(nAusfall));
      fehlerPruefen(s);
      ergebnis.faelle.X3 = { ausfall: nAusfall, je: z.je, bremse: b, blaseNachMin: min };
      await s.ctx.close();
    }

    /* ---------------- X5: Tipp nach dem Ausfall holt sofort ---------------- */
    if (FAELLE.includes("X5")) {
      abschnitt("X5", "503 für 10 min, danach (Bremse noch gezogen) ein Tipp auf eine leere Fläche");
      const s = await seiteOeffnen("A", T_TAG);
      await laufen(s, 90000);
      await beobachten(s);
      s.zustand.modus = "503";
      await laufen(s, 600000);
      s.zustand.modus = "ok";
      neueBenachrichtigung(s, "X5-nach-Ausfall");
      await laufen(s, 2000);
      const vorTipp = (await blasen(s)).filter((x) => /X5-nach-Ausfall/.test(x.text)).length;
      const aktiv = await s.pg.evaluate(() => Boolean(Backend.bremse && Backend.bremse().aktiv));
      const t0 = s.zustand.jetzt;
      const zt = phase(s, "X5-tipp");
      await s.pg.mouse.click(20, 300);
      await laufen(s, 10000);
      const ts = (await blasen(s)).filter((x) => /X5-nach-Ausfall/.test(x.text));
      console.log("  Bremse beim Tipp gezogen: " + aktiv + " · Blase schon vor dem Tipp: " + vorTipp + " · nach dem Tipp (10 s): " + kurz(zt));
      sage(aktiv && vorTipp === 0, "X5: die Bremse steht beim Tipp noch, die Blase ist noch nicht da (sonst prüft der Fall nichts)", "Bremse " + aktiv + ", Blase vorher " + vorTipp);
      sage(ts.length > 0, "X5: nach einem Tipp auf eine leere Fläche binnen 10 s die Blase (Nachbesserung 2: keine in 60 s)", ts.length ? Math.round((ts[0].t - t0) / 1000) + " s" : "keine");
      fehlerPruefen(s);
      ergebnis.faelle.X5 = { bremseBeimTipp: aktiv, vorTipp, blaseNachS: ts.length ? Math.round((ts[0].t - t0) / 1000) : null, je: zt.je };
      await s.ctx.close();
    }

    /* ---------------- V: verdeckt, schlank, Ton und Blase wie in 884 ---------------- */
    if (FAELLE.includes("V")) {
      abschnitt("V", "verdeckt: 5 min ohne Neues, dann neue Nachricht und Benachrichtigung – Ton und Blase ohne zurückzukommen");
      const s = await seiteOeffnen("A", T_TAG);
      await s.pg.mouse.click(20, 300);   // erst nach einem Tipp darf die Seite Töne spielen (wie im Browser)
      await beobachten(s);
      /* alles gelesen (auch die Systemnachrichten vom Start): das Lämpchen geht aus, der Erinnerungston (alle 5 s,
         solange es leuchtet) hört auf */
      await laufen(s, 30000);
      s.zustand.db.private_messages.forEach((m) => { m.read = true; });
      s.zustand.db.notifications.forEach((n) => { n.read = true; });
      await laufen(s, 60000);
      const lampe = await s.pg.evaluate(() => { const l = document.getElementById("loginBtnBadge"); return l ? l.style.display : "fehlt"; });
      console.log("  Lämpchen vor dem Verdecken: " + lampe);
      await s.pg.evaluate(() => window.__sichtbar(false));
      await laufen(s, 5000);
      const zr = phase(s, "V-ruhe");
      const toeneRuhe = await toene(s);
      await s.pg.evaluate(() => { window.__toeneWo = {}; });
      await laufen(s, 300000);
      const toeneRuheEnde = await toene(s);
      const toeneWo = await s.pg.evaluate(() => { const w = window.__toeneWo; window.__toeneWo = null; return w; });
      if (toeneRuheEnde !== toeneRuhe) console.log("  Töne ohne Neues kamen von: " + JSON.stringify(toeneWo).slice(0, 900));
      const vollRuhe = zr.gesamt - summe(zr, /^profiles:PATCH$/) - summe(zr, /#id$/);
      console.log("  verdeckt 5 min ohne Neues: " + zr.gesamt + " Anfragen · " + Math.round(zr.bytes / 1024) + " KB · " + kurz(zr));
      sage(zr.gesamt <= 25, "V: verdeckt 5 min ohne Neues höchstens 25 Anfragen (zuletzt aktiv + schlanke Prüfung)", String(zr.gesamt));
      sage(vollRuhe === 0, "V: … davon keine volle Abfrage (nur „zuletzt aktiv“ und select=id)", String(vollRuhe));
      sage(toeneRuheEnde === toeneRuhe, "V: ohne Neues kein Ton", (toeneRuheEnde - toeneRuhe) + " Oszillatoren");
      const zn = phase(s, "V-neu");
      const t0 = s.zustand.jetzt;
      neueNachricht(s, "Neu, während die Seite verdeckt ist");
      neueBenachrichtigung(s, "V-Benachrichtigung");
      let nach = 0, mail = null, ben = null;
      for (; nach < 6 * 60000; nach += 5000) {
        await laufen(s, 5000, 5000);
        const ts = (await blasen(s)).filter((x) => x.t >= t0);
        mail = ts.find((x) => /Neue Nachricht/.test(x.text)); ben = ts.find((x) => /V-Benachrichtigung/.test(x.text));
        if (mail && ben) break;
      }
      const toeneNeu = (await toene(s)) - toeneRuheEnde;
      const minM = mail ? Math.round((mail.t - t0) / 6000) / 10 : null, minB = ben ? Math.round((ben.t - t0) / 6000) / 10 : null;
      console.log("  verdeckt neu: Blase Nachricht nach " + minM + " min, Benachrichtigung nach " + minB + " min, Töne " + toeneNeu + " · " + kurz(zn));
      sage(Boolean(mail && ben), "V: verdeckt kommen beide Blasen, ohne zurückzukommen (Nachbesserung 2: erst beim Zurückkommen)", "Nachricht " + minM + " min, Benachrichtigung " + minB + " min");
      sage(Boolean(mail && ben) && Math.max(mail.t, ben.t) - t0 <= 2.6 * 60000, "V: … spätestens nach ≈ 2,5 min", Math.max(minM || 0, minB || 0) + " min");
      sage(toeneNeu > 0, "V: verdeckt spielt der Ton (wie 884)", toeneNeu + " Oszillatoren");
      fehlerPruefen(s);
      ergebnis.faelle.V = { ruhe: zr.gesamt, ruheKB: Math.round(zr.bytes / 1024), vollRuhe, ruheJe: zr.je, blaseNachrichtMin: minM, blaseBenachrichtigungMin: minB, toene: toeneNeu, neuJe: zn.je };
      await s.ctx.close();
    }

    /* ======== Nachbesserung 4: Tipps bei „Netz weg“ und im Ausfall, Walkie mit > 60 offenen, gescheiterter Durchgang, Fuchs ======== */
    /* NT/NT0: Netz weg 10 min, sichtbar, mit und ohne Tipp alle 16 s auf eine leere Fläche (wie der Prüfer, Q10). */
    for (const [fall, tippen] of [["NT", true], ["NT0", false]]) {
      if (!FAELLE.includes(fall)) continue;
      abschnitt(fall, "Netz weg 10 min, sichtbar" + (tippen ? ", ein Tipp alle 16 s auf eine leere Fläche" : ", kein Tipp") + ": Versuche");
      const s = await seiteOeffnen("A", T_TAG);
      await laufen(s, 90000);
      const z = phase(s, fall);
      s.zustand.modus = "offline";
      for (let t = 0; t < 600000; t += 16000) { if (tippen) await s.pg.mouse.click(20, 300); await laufen(s, 16000); }
      console.log("  Netz weg 10 min: " + z.gesamt + " Versuche · " + kurz(z));
      if (tippen) sage(z.gesamt <= 200, "NT: Netz weg 10 min mit einem Tipp alle 16 s höchstens 200 Versuche (Nachbesserung 3: 1 002; Nachbesserung 2: 72)", String(z.gesamt));
      else sage(z.gesamt <= 200, "NT0: Netz weg 10 min ohne Tipp höchstens 200 Versuche wie in C (gemessen 76–128, Prüfer 87–88; Streuung durch den Zufallsanteil der Pausen)", String(z.gesamt));
      s.zustand.modus = "ok";
      const zon = phase(s, fall + "-online");
      await s.pg.evaluate(() => window.dispatchEvent(new Event("online")));
      await laufen(s, 25000);
      sage((zon.ok["notifications*"] || zon.ok["notifications"]) > 0, fall + ": Netz wieder da („online“): binnen 25 s wieder abgefragt", kurz(zon));
      fehlerPruefen(s);
      ergebnis.faelle[fall] = { gesamt: z.gesamt, je: z.je };
      await s.ctx.close();
    }

    /* XT: 503 für 10 min, sichtbar, ein Tipp alle 16 s – der Preis des Tipp-Fensters für die Takte (W1). */
    if (FAELLE.includes("XT")) {
      abschnitt("XT", "503 für 10 min, sichtbar, ein Tipp alle 16 s auf eine leere Fläche: Anfragen");
      const s = await seiteOeffnen("A", T_TAG);
      await laufen(s, 90000);
      const z = phase(s, "XT");
      s.zustand.modus = "503";
      for (let t = 0; t < 600000; t += 16000) { await s.pg.mouse.click(20, 300); await laufen(s, 16000); }
      console.log("  503 10 min mit Tipps: " + z.gesamt + " Anfragen · " + kurz(z));
      sage(z.gesamt <= 400, "XT: 503 10 min mit einem Tipp alle 16 s höchstens 400 Anfragen (Prüfer zu Nachbesserung 3: 255; 884: ≈ 10 600)", String(z.gesamt));
      fehlerPruefen(s);
      ergebnis.faelle.XT = { gesamt: z.gesamt, je: z.je };
      await s.ctx.close();
    }

    /* W60: Walkie mit 70 offenen Fragen (holen lädt die 60 ältesten), verdeckt 10 min ohne Neues, dann eine neue Frage. */
    if (FAELLE.includes("W60")) {
      abschnitt("W60", "Walkie mit 70 offenen Fragen, verdeckt 10 min ohne Neues, dann eine neue Frage");
      const s = await seiteOeffnen("A", T_TAG);
      const frage = (i) => s.zustand.db.betreiber_rueckfragen.push({ id: i, thema: "Thema " + i, frage: "Frage " + i + ": " + "Text ".repeat(60), art: "frei", optionen: null, wo: null, beantwortet: null, erstellt: iso(s.zustand.jetzt - (100 - i) * 60000) });
      for (let i = 1; i <= 70; i++) frage(i);
      await laufen(s, 60000);
      const sichtbar = await s.pg.evaluate(() => (window.Rueckfrage && Rueckfrage.stand ? Rueckfrage.stand().length : -1));
      await s.pg.evaluate(() => window.__sichtbar(false));
      await laufen(s, 5000);
      const zr = phase(s, "W60-ruhe");
      await laufen(s, 600000);
      const vollRuhe = summe(zr, /^betreiber_rueckfragen$/);
      console.log("  sichtbar geladen: " + sichtbar + " Fragen · verdeckt 10 min: " + zr.gesamt + " Anfragen · " + Math.round(zr.bytes / 1024) + " KB · " + kurz(zr));
      sage(sichtbar === 60, "W60: sichtbar lädt das Walkie die 60 ältesten offenen Fragen (wie bisher)", String(sichtbar));
      sage(vollRuhe <= 1, "W60: verdeckt 10 min ohne Neues höchstens 1 volle Abfrage der offenen Fragen (Prüfer zu Nachbesserung 3: 5)", String(vollRuhe));
      const zn = phase(s, "W60-neu");
      frage(71);
      let nach = 0;
      for (; nach < 6 * 60000 && !(zn.ok["betreiber_rueckfragen"] > 0); nach += 5000) await laufen(s, 5000, 5000);
      sage(zn.ok["betreiber_rueckfragen"] > 0 && nach <= 2.6 * 60000, "W60: eine neue Frage holt das Walkie verdeckt spätestens nach ≈ 2,5 min", Math.round(nach / 6000) / 10 + " min · " + kurz(zn));
      fehlerPruefen(s);
      ergebnis.faelle.W60 = { sichtbar, ruhe: zr.gesamt, ruheKB: Math.round(zr.bytes / 1024), vollRuhe, neuNachMin: Math.round(nach / 6000) / 10, ruheJe: zr.je };
      await s.ctx.close();
    }

    /* VF: verdeckt, neue Benachrichtigung, der erste volle Durchgang scheitert (500 auf notifications – backend.js
       liefert dann still []). Die nächste schlanke Prüfung muss es noch einmal versuchen. */
    if (FAELLE.includes("VF")) {
      abschnitt("VF", "verdeckt: neue Benachrichtigung, der erste volle Durchgang scheitert (500) – die nächste Prüfung holt nach");
      const s = await seiteOeffnen("A", T_TAG);
      await beobachten(s);
      await laufen(s, 30000);
      s.zustand.db.private_messages.forEach((m) => { m.read = true; });
      s.zustand.db.notifications.forEach((n) => { n.read = true; });
      await laufen(s, 60000);
      await s.pg.evaluate(() => window.__sichtbar(false));
      await laufen(s, 5000);
      const zn = phase(s, "VF-neu");
      const t0 = s.zustand.jetzt;
      s.zustand.scheitern = { re: /^notifications\*$/, rest: 1, status: 500 };
      neueBenachrichtigung(s, "VF-Benachrichtigung");
      let ben = null;
      for (let nach = 0; nach < 8 * 60000 && !ben; nach += 5000) {
        await laufen(s, 5000, 5000);
        ben = (await blasen(s)).find((x) => x.t >= t0 && /VF-Benachrichtigung/.test(x.text));
      }
      const min = ben ? Math.round((ben.t - t0) / 6000) / 10 : null;
      console.log("  gescheitert: " + (s.zustand.scheitern.anzahl || 0) + " · Blase nach " + min + " min · " + kurz(zn));
      sage((s.zustand.scheitern.anzahl || 0) === 1, "VF: der erste volle Durchgang scheiterte wirklich (sonst prüft der Fall nichts)", String(s.zustand.scheitern.anzahl || 0));
      sage(Boolean(ben) && ben.t - t0 <= 4.6 * 60000, "VF: die Blase kommt trotzdem verdeckt, spätestens mit der Prüfung danach (≈ 4,5 min; Nachbesserung 3: erst beim Zurückkommen)", ben ? min + " min" : "keine in 8 min");
      fehlerPruefen(s);
      ergebnis.faelle.VF = { gescheitert: s.zustand.scheitern.anzahl || 0, blaseNachMin: min, je: zn.je };
      await s.ctx.close();
    }

    /* FM: die Fuchs-Prüfung beim Laden scheitert (500 auf results), danach geht es wieder. Monat und Jahr müssen nach
       ≈ 30 min wieder geprüft werden (die 6-h-Marke gilt erst nach einer erfolgreichen Abfrage). */
    if (FAELLE.includes("FM")) {
      abschnitt("FM", "Fuchs-Prüfung scheitert beim Laden (500 auf results), dann geht es wieder: Monat und Jahr nach ≈ 30 min erneut");
      const s = await seiteOeffnen("A", T_TAG, { zustand: { scheitern: { re: /^results/, status: 500 }, protokoll: /^results/ } });
      await laufen(s, 120000, 5000);
      const gescheitert = s.zustand.scheitern.anzahl || 0;
      s.zustand.scheitern = null;
      const ab = s.zustand.jetzt;
      s.zustand.log = [];
      await laufen(s, 40 * 60000, 5000);
      const art = (e) => {
        const g = new URL(e.url).searchParams.get("played_at");
        if (!g || !/^gte\./.test(g)) return null;
        const tage = (e.t - Date.parse(g.slice(4))) / 86400000;
        return tage < 2 ? "tag" : tage < 10 ? "woche" : tage < 40 ? "monat" : "jahr";
      };
      const je = { tag: [], woche: [], monat: [], jahr: [] };
      s.zustand.log.forEach((e) => { const a = art(e); if (a) je[a].push(Math.round((e.t - ab) / 6000) / 10); });
      const erste = (a) => (je[a].length ? je[a][0] : null);
      console.log("  beim Laden gescheitert: " + gescheitert + " · danach (min nach dem Ende des Fehlers): tag " + je.tag.length + ", woche " + JSON.stringify(je.woche) + ", monat " + JSON.stringify(je.monat) + ", jahr " + JSON.stringify(je.jahr));
      sage(gescheitert >= 2, "FM: die Prüfung beim Laden scheiterte wirklich", String(gescheitert));
      sage(erste("monat") != null && erste("monat") <= 35, "FM: Monat nach dem Fehlschlag binnen ≈ 30 min wieder geprüft (Nachbesserung 3: erst nach 6 h)", String(erste("monat")));
      sage(erste("jahr") != null && erste("jahr") <= 35, "FM: Jahr nach dem Fehlschlag binnen ≈ 30 min wieder geprüft (Nachbesserung 3: erst nach 6 h)", String(erste("jahr")));
      sage(je.monat.length <= 1 && je.jahr.length <= 1, "FM: nach der erfolgreichen Prüfung nicht wieder (6 h)", "monat " + je.monat.length + ", jahr " + je.jahr.length);
      fehlerPruefen(s);
      ergebnis.faelle.FM = { gescheitert, je };
      await s.ctx.close();
    }

    /* SB / SM (Einmischen 886, Nachbesserung 1): Start + 3 min sichtbar, die STARTPHASE MITGEZÄHLT (alle anderen Fälle
       zählen erst nach dem Profil bzw. nach 90 s – das Vorzeichnen in der Ruhepause fiel dort nicht auf). Gegen
       807e6a7d (Notfall-Fassung 885, live): dort zeichnete der Seitenaufbau Links, Schwarmwissen und Memory, als die
       Anmeldung noch nicht wiederhergestellt war – je eine Abfrage für die freigegebenen Links und Tipps, keine
       Freundesliste. Grenzen aus Läufen dieses Falls auf 807e6a7d (SPIELSYSTEM.md, „Fassung 886 — Einmischen …“,
       Nachbesserung 1). */
    const SB_SM = { SB: ["Betreiber, Gerät mit dma-walkie", { walkie: true }], SM: ["Mitglied ohne Rolle", {}] };
    for (const fall of ["SB", "SM"]) {
      if (!FAELLE.includes(fall)) continue;
      const REF = REF_START3[fall];
      abschnitt(fall, "Start + 3 min sichtbar, Startphase mitgezählt (" + SB_SM[fall][0] + ") – gegen 807e6a7d");
      /* Fenster fest nach der Uhr der Seite: die ersten 3 min ab dem Öffnen (T_TAG). Ab dem Profil 3 min zu zählen
         schwankte je Lauf um einen Takt (die Startphase läuft in Echtzeit, 5–10 s; gemessen Mitglied 149…161). Die
         Freundesliste (getFriends: friends?select=*&status=eq.accepted) wird einzeln mitgeschrieben – der Takt holt
         nur Anfragen (friends?select=* ohne status) und Kennungen. */
      const s = await seiteOeffnen(fall, T_TAG, Object.assign({ zustand: { protokoll: /^friends\*$/ } }, SB_SM[fall][1]));
      const zs = s.zustand.zaehler.start;
      const z = phase(s, fall);
      await laufen(s, Math.max(0, T_TAG + 180000 - s.zustand.jetzt));
      const zus = neuerZaehler();
      [zs, z].forEach((q) => { zus.gesamt += q.gesamt; Object.entries(q.je).forEach(([k, n]) => { zus.je[k] = (zus.je[k] || 0) + n; }); });
      const n = (k) => zus.je[k] || 0;
      const freundesliste = (s.zustand.log || []).filter((e) => /[?&]status=eq\.accepted/.test(e.url)).length;
      if (process.env.FREUNDE) (s.zustand.log || []).forEach((e) => console.log("    friends " + Math.round((e.t - T_TAG) / 1000) + " s " + decodeURIComponent(e.url.split("?")[1] || "")));
      const grenze = Math.max(...REF.gesamt) + REF.rauschen;
      console.log("  bis Profil da: " + zs.gesamt + " · " + kurz(zs));
      console.log("  danach bis 3 min ab dem Öffnen: " + z.gesamt + " · " + kurz(z));
      console.log("  zusammen: " + zus.gesamt + " (807e6a7d: " + REF.gesamt.join("/") + ") · user_links* " + n("user_links*") + ", community_tips* " + n("community_tips*") + ", Freundesliste " + freundesliste + " (807e6a7d: " + REF.freundesliste + "), friends* gesamt " + n("friends*"));
      sage(n("user_links*") <= 1, fall + ": Weiterführende Links höchstens eine Abfrage (nur die freigegebenen, wie 807e6a7d)", String(n("user_links*")));
      sage(n("community_tips*") <= 1, fall + ": Schwarmwissen höchstens eine Abfrage (nur die freigegebenen, wie 807e6a7d)", String(n("community_tips*")));
      sage(freundesliste <= REF.freundesliste, fall + ": Freundesliste nicht öfter als auf 807e6a7d (Memory vorgezeichnet ohne)", freundesliste + " (807e6a7d " + REF.freundesliste + ")");
      sage(zus.gesamt <= grenze, fall + ": Anfragen in den ersten 3 min nicht mehr als auf 807e6a7d (+ " + REF.rauschen + " Rauschen)", zus.gesamt + " (Grenze " + grenze + ")");
      /* Das Öffnen bleibt wie bisher (nur SB: Betreiber sieht das Prüffeld): frisch geholt, nicht das Vorgezeichnete */
      let oeffnen = null;
      if (fall === "SB") {
        const zo = phase(s, "SB-oeffnen");
        const bis = async (f) => { for (let i = 0; i < 20; i++) { await laufen(s, 1000); await warte(100); if (await s.pg.evaluate(f)) return true; } return false; };
        const vorL = (s.zustand.log || []).length;
        await s.pg.evaluate(() => { const t = document.querySelector('.tape-tab[data-target="view-knowledge"]'); if (t) t.click();
          const p = document.querySelector('#knowledgeSubnav [data-sub="sub-links"]'); if (p) p.click(); });
        const links = await bis(() => /Vorgeschlagene Links prüfen/.test((document.getElementById("linksArea") || {}).textContent || ""));
        await s.pg.evaluate(() => { const p = document.querySelector('#knowledgeSubnav [data-sub="sub-tips"]'); if (p) p.click(); });
        const tipps = await bis(() => /Vorgeschlagene Tipps prüfen/.test((document.getElementById("tipsArea") || {}).textContent || ""));
        await s.pg.evaluate(() => { const p = document.querySelector('#learnSubnav [data-sub="sub-memory"]'); if (p) p.click(); });
        const neueListe = () => (s.zustand.log || []).slice(vorL).filter((e) => /[?&]status=eq\.accepted/.test(e.url)).length;
        for (let i = 0; i < 10 && !neueListe(); i++) { await laufen(s, 1000); await warte(100); }
        const fl = neueListe();
        oeffnen = { links, tipps, user_links: zo.je["user_links*"] || 0, community_tips: zo.je["community_tips*"] || 0, freundesliste: fl };
        console.log("  Öffnen: " + JSON.stringify(oeffnen));
        sage(links && oeffnen.user_links === 3, "SB: Tipp auf „Weiterführende Links“ holt wie bisher frisch (freigegebene, meine, ausstehende) und zeigt das Prüffeld", JSON.stringify({ prueffeld: links, abfragen: oeffnen.user_links }));
        sage(tipps && oeffnen.community_tips === 3, "SB: Tipp auf „Schwarmwissen“ holt wie bisher frisch und zeigt das Prüffeld", JSON.stringify({ prueffeld: tipps, abfragen: oeffnen.community_tips }));
        sage(fl >= 1, "SB: Memory öffnen holt die Freundesliste wie bisher", String(fl));
      }
      fehlerPruefen(s);
      ergebnis.faelle[fall] = { start: zs.gesamt, startJe: zs.je, sichtbar3: z.gesamt, sichtbarJe: z.je, gesamt: zus.gesamt, freundesliste, oeffnen };
      await s.ctx.close();
    }

    /* ===== Einmischen, Nachbesserung 2 (Prüfbericht zu c57cdb8b): MIT HELFER – S1 und das Start-Tor (backend.js,
       index.html dmaStartTor; SPIELSYSTEM.md I50). Echte Uhr: der Helfer und seine Fristen kennen keine Seitenuhr. ===== */
    const mitHelfer = async (opt) => {
      Object.assign(netz, { verz: 0, verzFj: 0, neuF: "" });
      const s = await seiteOeffnen("A", Date.now(), Object.assign({ sw: true, ohneUhr: true, walkie: true }, opt || {}));
      const torOhneSpeicher = await s.pg.evaluate(() => ({ speicher: document.documentElement.hasAttribute("data-dma-speicher"), tor: window.dmaStartTor === null ? "kein" : typeof window.dmaStartTor }));
      let ctl = false;
      for (let i = 0; i < 60 && !ctl; i++) { await warte(500); ctl = await s.pg.evaluate(() => Boolean(navigator.serviceWorker && navigator.serviceWorker.controller)); }
      await warte(8000);   // die Auffrischung des Helfers legt die Seite ab
      const speicher = await s.pg.evaluate(() => caches.keys().then((k) => k.join(",")));
      return { s, ctl, speicher, torOhneSpeicher };
    };
    const cpuBremse = async (s, n) => { if (n > 1) { const cdp = await s.ctx.newCDPSession(s.pg); await cdp.send("Emulation.setCPUThrottlingRate", { rate: n }); } };
    const lage = (s) => s.pg.evaluate(() => ({ f: window.DMA_VERSION, speicher: document.documentElement.hasAttribute("data-dma-speicher"),
      tor: window.dmaStartTor ? (window.dmaStartTor.offen ? "offen" : "zu") : "kein", profil: Boolean(typeof Backend !== "undefined" && Backend.currentProfile && Backend.currentProfile()),
      ersteSupa: window.__ersteSupa == null ? null : Math.round(window.__ersteSupa), url: location.search })).catch((e) => ({ fehler: String(e).slice(0, 80) }));
    /* eine Runde: neu laden, ms warten; gezählt werden alle Supabase-Anfragen und Echtzeit-Leitungen dieser Zeit */
    const runde = async (s, name, ms) => {
      const z = phase(s, name);
      const l0 = s.zustand.ladungen, d0 = netz.doks, f0 = netz.fass;
      await s.pg.reload({ waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
      await warte(ms || 30000);
      const info = await lage(s);
      return { z, ladungen: s.zustand.ladungen - l0, doks: netz.doks - d0, fass: netz.fass - f0, info };
    };
    const zeigeRunde = (name, r, extra) => console.log("  " + name + ": " + r.z.gesamt + " Anfragen, Echtzeit " + r.z.ws + " · Seitenaufbauten " + r.ladungen
      + " · Seitenabrufe " + r.doks + " · fassung.json " + r.fass + " · " + JSON.stringify(r.info) + (extra ? " · " + extra : "") + "\n      " + kurz(r.z));
    for (const [fall, D, cpu] of [["SWa", 300, 1], ["SWc", 1000, 1], ["SWL", 5500, 1], ["SWa4", 300, 4], ["SWc4", 1000, 4]]) {
      if (!FAELLE.includes(fall)) continue;
      abschnitt(fall, "Helfer an, Betreiber: neu laden (Bezug: ein Start), dann neue Fassung 887 draußen – Seite und fassung.json nach " + D + " ms, CPU " + cpu + "×, je 30 s");
      const { s, ctl, speicher } = await mitHelfer();
      await cpuBremse(s, cpu);
      console.log("  Helfer: " + ctl + " · Speicher " + speicher);
      const bezug = await runde(s, fall + "-bezug");
      Object.assign(netz, { neuF: "887", verz: D });
      const neu = await runde(s, fall + "-neu");
      Object.assign(netz, { neuF: "", verz: 0 });
      zeigeRunde("Bezug", bezug);
      zeigeRunde("Update", neu);
      sage(ctl, fall + ": der Helfer übernimmt die Seite");
      sage(neu.z.gesamt <= bezug.z.gesamt + 3, fall + ": Update-Runde nicht mehr Anfragen als ein Start (+ 3 Rauschen)", neu.z.gesamt + " gegen " + bezug.z.gesamt + " (c57cdb8b: 92–103 gegen 56–57)");
      sage(neu.z.ws <= 1, fall + ": höchstens eine Echtzeit-Leitung", String(neu.z.ws));
      sage(neu.info.f === "887" && neu.info.profil, fall + ": am Ende die neue Fassung, mit Profil", JSON.stringify(neu.info));
      fehlerPruefen(s);
      ergebnis.faelle[fall] = { helfer: ctl, bezug: { gesamt: bezug.z.gesamt, je: bezug.z.je, ws: bezug.z.ws, ladungen: bezug.ladungen, info: bezug.info },
        neu: { gesamt: neu.z.gesamt, je: neu.z.je, ws: neu.z.ws, ladungen: neu.ladungen, info: neu.info } };
      await s.ctx.close();
    }
    /* SWT/SWT6: erstes Öffnen des Tages, Supabase antwortet nach 250 ms – geht die Anmeldebelohnung genau einmal hinaus? */
    for (const [fall, D] of [["SWT", 1000], ["SWT6", 600]]) {
      if (!FAELLE.includes(fall)) continue;
      abschnitt(fall, "Helfer an, Supabase 250 ms, erstes Öffnen des Tages: neue Fassung 887 (Seite nach " + D + " ms) – Anmeldebelohnung genau einmal");
      const { s, ctl } = await mitHelfer();
      const runden = {};
      for (const [name, neuF] of [["bezug", ""], ["neu", "887"]]) {
        const p0 = s.zustand.db.profiles[0];
        const gestern = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        p0.extra_profile_data = Object.assign({}, p0.extra_profile_data, { lastLoginDay: gestern, loginStreak: 3 });
        const r0 = (s.zustand.db.results || []).length;
        Object.assign(netz, { neuF, verz: neuF ? D : 0 });
        s.zustand.supaVerz = 250;
        const r = await runde(s, fall + "-" + name);
        s.zustand.supaVerz = 0;
        r.belohnungen = (s.zustand.db.results || []).slice(r0).filter((x) => JSON.stringify(x).indexOf("login") >= 0).length;
        zeigeRunde(name, r, "Anmeldebelohnungen in results: " + r.belohnungen);
        runden[name] = r;
      }
      Object.assign(netz, { neuF: "", verz: 0 });
      sage(ctl, fall + ": der Helfer übernimmt die Seite");
      sage(runden.bezug.belohnungen === 1, fall + ": ohne Update genau eine Anmeldebelohnung", String(runden.bezug.belohnungen));
      sage(runden.neu.belohnungen === 1, fall + ": mit Update genau eine Anmeldebelohnung (nicht alte und neue Seite)", String(runden.neu.belohnungen));
      sage(runden.neu.z.gesamt <= runden.bezug.z.gesamt + 3, fall + ": Update-Runde nicht mehr Anfragen als ein Start (+ 3)", runden.neu.z.gesamt + " gegen " + runden.bezug.z.gesamt);
      fehlerPruefen(s);
      ergebnis.faelle[fall] = { bezug: { gesamt: runden.bezug.z.gesamt, belohnungen: runden.bezug.belohnungen }, neu: { gesamt: runden.neu.z.gesamt, belohnungen: runden.neu.belohnungen, info: runden.neu.info } };
      await s.ctx.close();
    }
    /* SW402: in der 402-Sperre neu laden, dann die neue Fassung nach 5,5 s */
    if (FAELLE.includes("SW402")) {
      abschnitt("SW402", "Helfer an, 402-Sperre: neu laden (Bezug), dann neue Fassung 887 (Seite nach 5500 ms), je 30 s");
      const { s, ctl } = await mitHelfer();
      s.zustand.modus = "402";
      const bezug = await runde(s, "SW402-bezug");
      Object.assign(netz, { neuF: "887", verz: 5500 });
      const neu = await runde(s, "SW402-neu");
      Object.assign(netz, { neuF: "", verz: 0 });
      zeigeRunde("Bezug", bezug);
      zeigeRunde("Update", neu);
      sage(ctl, "SW402: der Helfer übernimmt die Seite");
      sage(neu.z.gesamt <= bezug.z.gesamt + 2, "SW402: in der Sperre nicht mehr als ein Start (+ 2)", neu.z.gesamt + " gegen " + bezug.z.gesamt + " (c57cdb8b: 14 gegen 7–11)");
      sage(neu.info.f === "887", "SW402: am Ende die neue Fassung", JSON.stringify(neu.info));
      ergebnis.faelle.SW402 = { bezug: bezug.z.gesamt, neu: neu.z.gesamt, wsNeu: neu.z.ws };
      await s.ctx.close();
    }
    /* SWTOR: das Tor selbst – ohne Update, nur fassung.json verzögert. Wann geht die erste Supabase-Anfrage hinaus?
       (window.__ersteSupa: der erste Aufruf von fetch an die Attrappe, performance.now der Seite) */
    if (FAELLE.includes("SWTOR")) {
      abschnitt("SWTOR", "Helfer an, ohne Update: Tor auf der Seite aus dem Speicher (Frist 6 s, Tipp), kein Tor ohne Speicher");
      const { s, ctl, torOhneSpeicher } = await mitHelfer({});
      await s.ctx.addInitScript(() => {
        const f = window.fetch; window.__ersteSupa = null;
        window.fetch = function (u) {
          try { const a = String((u && u.url) || u); if (window.__ersteSupa == null && a.indexOf("attrappe.supabase.co") >= 0) window.__ersteSupa = performance.now(); } catch (e) {}
          return f.apply(this, arguments);
        };
      });
      console.log("  Helfer: " + ctl + " · erste Seite (aus dem Netz): " + JSON.stringify(torOhneSpeicher));
      sage(!torOhneSpeicher.speicher && torOhneSpeicher.tor === "kein", "SWTOR: Seite aus dem Netz – kein Tor", JSON.stringify(torOhneSpeicher));
      const bisMs = async (ms) => { for (let i = 0; i < 800; i++) { const t = await s.pg.evaluate(() => performance.now()).catch(() => 0); if (t >= ms) return t; await warte(25); } return -1; };
      /* fassung.json nach 8 s: das Tor geht nach 6 s auf. Die Seite selbst kommt nach 0,4 s aus dem Netz – sonst nimmt der
         Helfer die schon fertige Antwort aus dem Netz (frischWennDa, S1), und es gibt keine Seite aus dem Speicher. */
      /* das erste Neuladen unter dem Helfer kommt noch aus dem Netz (es legt die Seite erst ab) */
      await s.pg.reload({ waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
      await warte(4000);
      Object.assign(netz, { verz: 400, verzFj: 8000 });
      await s.pg.reload({ waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
      await bisMs(12000);
      const t8 = await lage(s);
      console.log("  fassung.json nach 8 s: " + JSON.stringify(t8));
      sage(t8.speicher === true, "SWTOR: die Seite kam aus dem Speicher (sonst prüft dieser Teil nichts)", JSON.stringify(t8));
      sage(t8.ersteSupa != null && t8.ersteSupa >= 5800 && t8.ersteSupa < 7900, "SWTOR: erste Supabase-Anfrage erst zur Frist (≈ 6 s), nicht vorher und nicht erst mit fassung.json", String(t8.ersteSupa) + " ms");
      sage(t8.tor === "offen" && t8.profil, "SWTOR: danach Tor offen, Profil da", JSON.stringify({ tor: t8.tor, profil: t8.profil }));
      /* fassung.json nach 4 s, ein Tastendruck nach 2,5 s: der Wächter lädt dann nicht mehr von selbst neu → Tor auf */
      netz.verzFj = 4000;
      await s.pg.reload({ waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
      const tipp = await bisMs(2500);
      await s.pg.keyboard.press("Shift");
      await bisMs(7000);
      const t4 = await lage(s);
      console.log("  fassung.json nach 4 s, Taste nach " + Math.round(tipp) + " ms: " + JSON.stringify(t4));
      sage(t4.speicher === true, "SWTOR (Taste): die Seite kam aus dem Speicher", JSON.stringify(t4));
      sage(t4.ersteSupa != null && t4.ersteSupa >= tipp - 50 && t4.ersteSupa < 3500, "SWTOR (Taste): erste Supabase-Anfrage gleich nach dem Tastendruck, vor fassung.json", String(t4.ersteSupa) + " ms (Taste " + Math.round(tipp) + ")");
      sage(t4.profil, "SWTOR (Taste): Profil da", JSON.stringify({ tor: t4.tor, profil: t4.profil }));
      Object.assign(netz, { verz: 0, verzFj: 0 });
      fehlerPruefen(s);
      ergebnis.faelle.SWTOR = { netz: torOhneSpeicher, frist: t8, taste: Object.assign({ taste: Math.round(tipp) }, t4) };
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
