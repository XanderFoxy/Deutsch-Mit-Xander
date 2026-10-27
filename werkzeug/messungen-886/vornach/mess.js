#!/usr/bin/env node
/* =====================================================================
   MESSUNG — WIE LANGE BIS INS KLASSENZIMMER? (Funk 263/271, geschärft in Fassung 886)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „es soll doch unter Wissen und Klassenzimmer dann
   ins Klassenzimmer gehen wie immer auch nur zehnmal schneller … alles
   insgesamt nur zehn Mal schneller".
   XANDER (Funk 310/312): „das Maximum rausholen", „die maximal
   professionellste Lösung".

   FASSUNG 886 — Schritt A des Ladezeit-Entwurfs: ohne belastbare Zahlen
   ist jeder weitere Schritt geraten. Was das alte Werkzeug falsch maß
   (gemessen, siehe SPIELSYSTEM.md „Fassung 886 — Messwerkzeug und
   Grundlinie"):
     - „Wissen" und „Klassenzimmer" wurden mit el.click() ausgelöst – kein
       echter Tipp (isTrusted = false), die Messung in der Seite
       (DMA_MESS.tipp) zählte ihn nicht; dazu prüfte es nur alle 100 ms
       und über mehrere Rundreisen zum Browser, ob die Ansicht da ist.
     - Der Prüfserver packte jede Datei erst beim ersten Abruf (gzip -9) –
       das zahlte jeder kalte Lauf mit.
     - Die Leitung war über die Entwicklerwerkzeuge gedrosselt; was der
       Service Worker selbst aus dem Netz holt (die Seite), lief daran
       vorbei (gemessen bei 1 Mbit/s: die Seite, 98 KB, über den Helfer in
       20 ms, ohne Helfer 1,8 s).
     - Je Fall ein einziger Lauf; Einzelwerte streuten um ±100–150 ms.

   Was jetzt gilt:
     - ECHTE TIPPS (Berührung über das Prüfprotokoll; der Browser macht
       daraus einen echten Klick). Gemessen wird IN DER SEITE: vom Tipp
       (event.timeStamp) bis zum ersten Bild, in dem die Ansicht steht
       (rAF, dann setTimeout 0 – dieselbe Regel wie DMA_MESS in
       index.html). „bereit" = erstes Bild, in dem LiveChat,
       DMA_TAFEL_STAND und der Reiter „Wissen" da sind.
     - LEITUNG IM SERVER statt in den Entwicklerwerkzeugen: je Anfrage eine
       Rundreise (RTT) bis zum ersten Byte, je neue Verbindung zusätzlich
       2 RTT (TCP + TLS wie bei GitHub Pages), danach die gemeinsame
       Bandbreite gerecht auf alle laufenden Antworten verteilt. Gilt
       gleich für die Seite und den Service Worker. Der Rechner der Seite
       wird weiter über das Prüfprotokoll gebremst (CPU, Standard 4×).
     - HTTP/2 mit TLS wie bei GitHub Pages (eigenes Zertifikat, nur für
       diesen Browser freigegeben). --h1 = altes HTTP/1.1 ohne TLS.
     - Jede Datei wird vor der Messung einmal geholt (Aufwärmen: Packen,
       Dateizwischenspeicher des Rechners) – nicht mitgezählt.
     - supabase-js (SUPABASE_UMD bzw. --supabase) kommt über eine
       umgeleitete Anfrage aus demselben Server, gedrosselt und mit 7 Tagen
       Zwischenspeicher wie bei jsDelivr. Fremde Adressen (Supabase,
       Schriften …) gehen NIE ins Internet: der Browser löst keinen
       fremden Namen auf (keine Geister im echten Klassenzimmer).
     - MEHRERE LÄUFE (Standard 5), Median und Streuung, JSON-Ausgabe.
     - PROFIL AUF DER PLATTE je Fall-Gruppe (wie ein echtes Telefon):
       nur so benutzt Chrome den übersetzten Code (V8-Code-Cache) wieder.
     - FÄLLE (--arten): kalt (leerer Speicher), warm (zweites Öffnen
       innerhalb von 10 min), wieder (drittes Öffnen: V8-Code-Cache),
       pause (Stammgast nach > 10 min OHNE Service Worker: drittes Öffnen,
       jede Datei wird beim Server nachgefragt), sw (Stammgast nach > 10 min MIT
       Service Worker: viertes Öffnen, Helfer gestoppt, Verbindungen zu,
       Dateien und übersetzter Code aus seinem Speicher).
       --sw = kalt,warm,pause,sw.
       FASSUNG 886 (S1): neu (Stammgast MIT Service Worker, und seit dem
       letzten Öffnen ist eine neue Fassung draußen: wie sw, danach stellt
       der Server index.html und fassung.json auf Fassung + 1 – die
       gestempelten Dateien bleiben gleich, gemessen wird also genau, was
       das Update an der SEITE kostet). Kommt die Seite zuerst aus dem
       Speicher, lädt der Fassungs-Wächter einmal neu; gemessen wird bis
       „bereit" der NEUEN Fassung, ab dem Öffnen (bereitAb, fcpAb; ab =
       Vorlauf bis zur Seite, die bleibt; seiten = 2 heißt neu geladen).
     - FENSTER: jede Seite bleibt 10 s offen (--fenster). Die Zeit wird in
       Abschnitte geteilt: start (0 → bereit), wissen (Tipp → Bild),
       kz (Tipp → Bild und Knopf „Betreten"), danach (bis 10 s) und
       werkzeug (die Pausen, in denen das Werkzeug tippt).
     - LANGLÄUFER des Hauptfadens in den ersten 10 s (PerformanceObserver
       longtask, mit Tipps), die längsten Bilder (LoAF) mit Skript,
       Funktion und erzwungenem Layout.
     - SPUR (Tracing, Standard an; --ohne-spur): Hauptfaden-Zeit je
       Abschnitt nach Skript, Stil lesen, Stil berechnen, Layout (davon
       erzwungen = aus einem Skript heraus), Zeichnen, HTML, GC,
       synchrones Laden (sync XHR) und Rest – je Ereignis nur die
       Eigenzeit, nach Überlappung auf die Abschnitte verteilt.
     - PROFIL (--profil, eigene Läufe, stört die Zeiten): V8-Stichproben
       je Abschnitt nach Datei und Funktion (eingeschlossene Zeit).
     - Die alten Spalten bleiben zum Vergleich (kzAlt = Wissen-Tipp bis
       Knopf „Betreten" sichtbar, kzAbStart = ab dem Öffnen). Sie
       enthalten die Pausen des Werkzeugs; der Unterschied zur Messung in
       der Seite ist MESSFEHLER, kein Gewinn.
     - SYNCHRON GEHOLTE STÜCKE (FASSUNG 886, Nachtrag): jeder synchrone
       Abruf (XMLHttpRequest mit async = false – so holt ein Platzhalter
       sein app-Stück, wenn es noch fehlt) wird in der Seite mit Datei,
       Beginn, Dauer und Aufrufer festgehalten und dem Abschnitt
       zugeordnet (start, wissen, kz …). Dazu die eigene Liste der Seite
       (DMA_TEIL_SOFORT: welches Stück für welche Funktion). Gemessen am
       14.10.: der erste Tipp auf „Wissen" holte kalt raum3 und rest7
       synchron, 237 ms gesperrter Hauptfaden – das alte Werkzeug sah das
       nicht (17.10., Grundlinie 884: 248 ms, in 7 von 7 Läufen).
     - ANFRAGEN INS LEERE (404) zählt der Server je Lauf und nennt die
       Pfade: ein unvollständiger Vergleichsstand (git archive ohne die
       großen Ordner) misst sonst still eine andere Seite.
     - TIPP SPÄTER (--tipp-nach ms): der erste Tipp kommt erst so viele ms
       nach „bereit" (Seitenuhr) – zeigt, was der Tipp kostet, wenn die
       Seite schon zur Ruhe gekommen ist (Standard 0 = sofort).
     - VORHER/NACHHER EHRLICH (--gegen, --aa): zwei Stände abwechselnd in
       einer Sitzung (A B, B A, …), je Durchgang der gepaarte Unterschied
       B − A; dazu je Maß ein 95-%-Bereich des gepaarten Medians (Bootstrap,
       2000 Ziehungen, fester Startwert) und der Vorzeichentest (wie oft
       B langsamer, wie oft schneller). --aa misst denselben Stand zweimal
       (zwei Server, zwei Herkünfte, getrennte Speicher): was dabei
       herauskommt, ist reines Rauschen – die Rauschgrenze für einen
       Vergleich mit gleich vielen Paaren. Ein Unterschied zählt erst, wenn
       sein 95-%-Bereich die Null nicht enthält.
       VORSICHT (gemessen im A/A-Test der Grundlinie, 17.10.): bei 120
       Maßen (30 Maße × 4 Fälle) trifft „DEUTLICH" auch reines Rauschen –
       im A/A-Test 4 von 120, zweimal dasselbe (warm synchron −2 ms,
       wieder Klassenzimmer −34/−39 ms); mit 7 Paaren heißt DEUTLICH
       „alle 7 auf derselben Seite", das trifft ein Rauschmaß mit 1,6 %.
       Deshalb VOR dem Messen festlegen, welches Maß ein Schritt
       verbessern soll; nur dieses entscheidet.

   Aufruf: node werkzeug/ladezeit-messen.js [netz] [wurzel] [Schalter]
     netz = 4g (9 Mbit/s, 60 ms, Standard) | 3g (1,6 Mbit/s, 150 ms) | aus
     wurzel = anderes Verzeichnis (zum Vergleich mit einem alten Stand)
     --laeufe n        Läufe je Fall (LAEUFE, Standard 5)
     --arten a,b       aus kalt, warm, wieder, pause, sw, neu (Standard kalt,warm)
     --sw              = --arten kalt,warm,pause,sw
                       (dazu neu: --arten sw,neu, siehe FÄLLE)
     --sw-wach ms      der Service Worker rechnet bei jedem Aufwachen ms lang
                       (schwaches Telefon; der Prüfrechner weckt ihn in ~3 ms –
                       die Rechnerbremse gilt nur für die Seite). Die Zeile
                       steht vorn in sw.js, für beide Stände gleich.
     --gegen <wurzel>  zweiter Stand, abwechselnd gemessen (A B, B A, …),
                       mit gepaartem Unterschied je Durchgang
     --aa              A/A-Test: derselbe Stand als A und B (Rauschgrenze)
     --tipp-nach ms    erster Tipp erst ms nach „bereit" (Standard 0)
     --json <datei>    alles als JSON (oder LADEZEIT_JSON=<datei>)
     --cpu n           Rechnerbremse (CPU, Standard 4)
     --supabase <umd>  lokale supabase-js-Kopie (SUPABASE_UMD); ohne Angabe
                       holt das Werkzeug 2.117.3 einmal aus npm; „-" = ohne
     --h1              HTTP/1.1 ohne TLS (wie das alte Werkzeug)
     --aufbau n        Rundreisen je neue Verbindung (Standard 2; 0 = aus)
     --fenster ms      wie lange jede Seite offen bleibt (Standard 10000)
     --ohne-spur       keine Spur (reine Zeiten; Spur kostet etwas)
     --profil          V8-Stichproben je Abschnitt (zusätzlich)
     --spur-ordner d   Spuren als .json.gz speichern (DevTools: Laden)
     --fluechtig       flüchtige Prüf-Kontexte wie das alte Werkzeug (ohne
                       V8-Code-Cache über den HTTP-Speicher)
     --leise           nur die Zusammenfassung
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), http2 = require("http2"), fs = require("fs"), path = require("path"),
  zlib = require("zlib"), crypto = require("crypto"), os = require("os"), { execFileSync } = require("child_process");
const { performance } = require("perf_hooks");

/* ---------- Aufruf ---------- */
/* VORHER/NACHHER 886 (Kopie im Zwischenordner, NICHT im Repo) – Zusätze gegenüber werkzeug/ladezeit-messen.js:
     --staende n=w,n=w,…  mehrere Stände in einer Sitzung, Reihenfolge je Lauf nach einem Williams-Plan (jede Stelle,
                          jede Nachbarschaft gleich oft); ein Stand zweimal = A/A (Rauschgrenze) in derselben Sitzung
     --konto mitglied     angemeldet (Attrappe: Sitzung im Gerät, gewöhnliches Mitglied, volles Profil); sonst Gast
     Supabase IMMER nachgebaut: eigener h2-Server für *.supabase.co (host-resolver-rules), kleines PostgREST,
                          Anmeldung, Echtzeit (Websocket, Phoenix-Antworten); Schreiben wird beantwortet, nicht behalten
                          (jedes Öffnen sieht dieselben Daten); Leitung wie die Seite + --supa-ms Bedenkzeit (Standard 40)
     --foto <jpeg>        github.com (302, no-cache) und raw.githubusercontent.com (Original, max-age=300/ETag; in der
                          Gruppe sw/pause abgelaufen → 304) nachgebaut; „Über mich“-Foto gemalt (Element Timing)
     --jsonl <datei>      jeder Durchgang sofort angehängt; ein neuer Aufruf mit derselben Datei setzt fort */
const MIT_WERT = new Set(["laeufe", "arten", "gegen", "json", "cpu", "supabase", "aufbau", "fenster", "spur-ordner", "tipp-nach", "sw-wach",
  "staende", "konto", "supa-ms", "foto", "jsonl"]);
const S = {}, FREI = [];
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith("--")) { FREI.push(a); continue; }
  const gl = a.indexOf("="), k = a.slice(2, gl > 0 ? gl : undefined);
  if (gl > 0) S[k] = a.slice(gl + 1);
  else if (MIT_WERT.has(k)) S[k] = process.argv[++i];
  else S[k] = true;
}
const NETZ = FREI[0] || "4g";
const LEITUNGEN = { "3g": { down: 1.6e6 / 8, rtt: 150 }, "4g": { down: 9e6 / 8, rtt: 60 }, aus: { down: Infinity, rtt: 0 } };
const LEITUNG = LEITUNGEN[NETZ];
if (!LEITUNG) { console.error("Netz unbekannt: " + NETZ + " (3g | 4g | aus)"); process.exit(2); }
const WURZEL = path.resolve(FREI[1] || path.join(__dirname, ".."));
/* --aa: derselbe Stand noch einmal als B (eigener Server, eigene Herkunft, also eigener Speicher) */
const AA = !!S.aa;
if (AA && S.gegen) { console.error("--aa und --gegen schließen sich aus"); process.exit(2); }
const GEGEN = AA ? WURZEL : S.gegen ? path.resolve(S.gegen) : null;
const LAEUFE = Math.max(1, Number(S.laeufe || process.env.LAEUFE || 5));
const CPU = Number(S.cpu || process.env.CPU || 4);
const FENSTER = Number(S.fenster || 10000);
const TIPP_NACH = Math.max(0, Number(S["tipp-nach"] || 0));
if (!isFinite(TIPP_NACH)) { console.error("--tipp-nach braucht ms"); process.exit(2); }
const H2 = !S.h1;
const AUFBAU = S.aufbau != null ? Number(S.aufbau) : 2;
const SPUR = !S["ohne-spur"];
const PROFIL = !!S.profil;
const ARTEN = (S.arten || (S.sw ? "kalt,warm,pause,sw" : "kalt,warm")).split(",").map((x) => x.trim()).filter(Boolean);
for (const a of ARTEN) if (!["kalt", "warm", "wieder", "pause", "sw", "neu"].includes(a)) { console.error("Art unbekannt: " + a); process.exit(2); }
/* FASSUNG 886 (S1) — langsames Aufwachen des Service Workers nachstellen (ms, gleich für beide Stände) */
const SW_WACH = Math.max(0, Number(S["sw-wach"] || 0));
if (!isFinite(SW_WACH)) { console.error("--sw-wach braucht ms"); process.exit(2); }
const JSON_DATEI = S.json || process.env.LADEZEIT_JSON || "";
/* VORHER/NACHHER 886 — Zusätze (siehe oben) */
const STAENDE_ARG = S.staende ? String(S.staende).split(",").map((x) => { const i = x.indexOf("="); return { name: x.slice(0, i), wurzel: path.resolve(x.slice(i + 1)) }; }) : null;
if (STAENDE_ARG) for (const s of STAENDE_ARG) if (!s.name || !fs.existsSync(path.join(s.wurzel, "index.html"))) { console.error("--staende: " + s.name + " = " + s.wurzel + " ohne index.html"); process.exit(2); }
const KONTO = S.konto ? String(S.konto) : "gast";
if (!["gast", "mitglied"].includes(KONTO)) { console.error("--konto gast|mitglied"); process.exit(2); }
const SUPA_MS = S["supa-ms"] != null ? Number(S["supa-ms"]) : 40;
const FOTO = S.foto ? fs.readFileSync(path.resolve(S.foto)) : null;
const JSONL = S.jsonl ? path.resolve(S.jsonl) : "";
/* supabase-js: dieselbe Fassung, die jsDelivr heute für @2 ausliefert, aus npm geholt und im Zwischenordner gemerkt */
const SUPA_FASSUNG = "2.117.3";
function supabaseHolen() {
  if (S.supabase === "-") return "";
  if (S.supabase || process.env.SUPABASE_UMD) return S.supabase || process.env.SUPABASE_UMD;
  const ziel = path.join(os.tmpdir(), "dma-mess-supabase-js-" + SUPA_FASSUNG + ".umd.js");
  if (fs.existsSync(ziel)) return ziel;
  try {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), "dma-mess-npm-"));
    execFileSync("npm", ["pack", "@supabase/supabase-js@" + SUPA_FASSUNG, "--pack-destination", d], { stdio: "ignore", timeout: 90000 });
    const tgz = fs.readdirSync(d).find((f) => f.endsWith(".tgz"));
    execFileSync("tar", ["-xzf", path.join(d, tgz), "-C", d, "package/dist/umd/supabase.js"], { stdio: "ignore" });
    fs.copyFileSync(path.join(d, "package/dist/umd/supabase.js"), ziel);
    fs.rmSync(d, { recursive: true, force: true });
    return ziel;
  } catch (e) { console.log("WARNUNG: supabase-js nicht zu holen (npm) – die Seite läuft ohne (wie das alte Werkzeug)"); return ""; }
}
const SUPA_PFAD = supabaseHolen();
const SUPA = SUPA_PFAD && fs.existsSync(SUPA_PFAD) ? fs.readFileSync(SUPA_PFAD) : null;
const SUPA_GZ = SUPA ? zlib.gzipSync(SUPA, { level: 9 }) : null;
const SPUR_ORDNER = S["spur-ordner"] || "";
const LEISE = !!S.leise;
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".woff2": "font/woff2", ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".mp4": "video/mp4", ".webm": "video/webm", ".ogg": "audio/ogg", ".wav": "audio/wav" };

/* ---------- Leitung: Rundreisen und gemeinsame Bandbreite ----------
   Wie die Drosselung der Entwicklerwerkzeuge (Verzögerung je Anfrage, Bandbreite gerecht geteilt), aber im Server –
   damit gilt sie auch für alles, was der Service Worker selbst holt. Abschaltbar für die Vorbereitungs-Öffnungen. */
const leitung = (() => {
  const aktiv = []; let uhr = null, letzte = 0, an = false;
  function takt() {
    const jetzt = performance.now();
    let budget = Math.min(0.05, (jetzt - letzte) / 1000) * LEITUNG.down; letzte = jetzt;
    while (budget >= 1 && aktiv.length) {
      const anteil = Math.max(1, Math.floor(budget / aktiv.length));
      for (const s of aktiv.slice()) {
        if (s.res.destroyed || s.res.writableEnded) { aktiv.splice(aktiv.indexOf(s), 1); continue; }
        const n = Math.min(anteil, s.buf.length - s.pos);
        if (n > 0) { s.res.write(s.buf.subarray(s.pos, s.pos + n)); s.pos += n; budget -= n; }
        if (s.pos >= s.buf.length) { s.res.end(); aktiv.splice(aktiv.indexOf(s), 1); }
      }
    }
    if (!aktiv.length) { clearInterval(uhr); uhr = null; }
  }
  return {
    set an(w) { an = w; }, get an() { return an; },
    rtt() { return an ? LEITUNG.rtt : 0; },
    senden(res, buf) {
      if (!an || !isFinite(LEITUNG.down) || !buf.length) return res.end(buf);
      aktiv.push({ res, buf, pos: 0 });
      if (!uhr) { letzte = performance.now(); uhr = setInterval(takt, 4); }
    },
  };
})();

/* ---------- TLS für HTTP/2 (eigenes Zertifikat, nur für 127.0.0.1) ---------- */
let TLS = null;
if (H2) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "dma-mess-tls-"));
  execFileSync("openssl", ["req", "-x509", "-newkey", "ec", "-pkeyopt", "ec_paramgen_curve:prime256v1", "-nodes", "-keyout", d + "/k.pem",
    "-out", d + "/c.pem", "-days", "3", "-subj", "/CN=127.0.0.1", "-addext", "subjectAltName=IP:127.0.0.1,DNS:github.com,DNS:raw.githubusercontent.com,DNS:*.supabase.co"], { stdio: "ignore" });
  const cert = fs.readFileSync(d + "/c.pem"), key = fs.readFileSync(d + "/k.pem");
  TLS = { cert, key, spki: crypto.createHash("sha256").update(crypto.createPublicKey(cert).export({ type: "spki", format: "der" })).digest("base64") };
  fs.rmSync(d, { recursive: true, force: true });
}

/* ---------- Server wie GitHub Pages (gzip, ETag, max-age=600; index.html und fassung.json no-cache) ----------
   frische = Sekunden, die der Browser eine Datei ungefragt benutzen darf: 600 wie GitHub Pages; 0 spielt
   „mehr als 10 Minuten später" nach (jede Datei muss nachgefragt werden → 304). */
function server(wurzel, frische) {
  const datei = new Map(), verb = new Set();
  /* FASSUNG 886 (S1) — Fall neu: solange s.neu gesetzt ist, liefert der Server index.html und fassung.json als
     Fassung s.neu (eigener ETag, sonst käme 304 mit der alten Seite); alles andere bleibt gleich */
  const neuStand = new Map();
  function alsNeu(p, d, f) {
    const k = p + " " + f;
    if (neuStand.has(k)) return neuStand.get(k);
    let t = d.inhalt.toString("utf8");
    if (p === "/fassung.json") t = JSON.stringify({ fassung: f, stand: new Date().toISOString() }, null, 2) + "\n";
    else { const vor = t; t = t.replace(/window\.DMA_VERSION = "[^"]*";/, 'window.DMA_VERSION = "' + f + '";'); if (t === vor) throw new Error("DMA_VERSION nicht in index.html"); }
    const inhalt = Buffer.from(t), n = { inhalt, ext: d.ext, gz: zlib.gzipSync(inhalt, { level: 9 }), etag: '"' + crypto.createHash("md5").update(inhalt).digest("hex") + '-neu"' };
    neuStand.set(k, n);
    return n;
  }
  let swWach = null;
  const z = { anfragen: 0, bytes: 0, packMs: 0, n304: 0, n404: 0, fehlt: [] };
  function lesen(p) {
    let d = datei.get(p);
    if (d) return d;
    const f = path.join(wurzel, p);
    if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return null;
    const inhalt = fs.readFileSync(f), ext = path.extname(f).toLowerCase();
    d = { inhalt, ext, etag: '"' + crypto.createHash("md5").update(inhalt).digest("hex") + '"' };
    if (/\.(js|css|json|html|svg|txt|md)$/.test(ext)) { const t0 = performance.now(); d.gz = zlib.gzipSync(inhalt, { level: 9 }); z.packMs += performance.now() - t0; }
    datei.set(p, d);
    return d;
  }
  function antwort(q, a) {
    z.anfragen++;
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    let d, h;
    if (p === "/__fremd/supabase.js" && SUPA) {
      d = { inhalt: SUPA, gz: SUPA_GZ, etag: '"supa"' };
      h = { "Content-Type": "text/javascript", "Cache-Control": "public, max-age=604800", "Timing-Allow-Origin": "*", "Access-Control-Allow-Origin": "*" };
    } else {
      d = lesen(p);
      /* fehlende Datei zählen: eine Messung mit 404 misst eine andere Seite (z. B. ein unvollständiger Vergleichsstand) */
      if (!d) { z.n404++; if (z.fehlt.length < 50 && z.fehlt.indexOf(p) < 0) z.fehlt.push(p); a.writeHead(404); return a.end(); }
      if (o.neu && (p === "/index.html" || p === "/fassung.json")) d = alsNeu(p, d, o.neu);
      if (p === "/sw.js" && SW_WACH) {
        if (!swWach) { const inhalt = Buffer.concat([Buffer.from("(function(){var t=Date.now();while(Date.now()-t<" + SW_WACH + "){}})();\n"), d.inhalt]);
          swWach = { inhalt, ext: d.ext, gz: zlib.gzipSync(inhalt, { level: 9 }), etag: '"' + crypto.createHash("md5").update(inhalt).digest("hex") + '"' }; }
        d = swWach;
      }
      h = { "Content-Type": TYP[d.ext] || "application/octet-stream", "Cache-Control": "max-age=" + frische, "ETag": d.etag };
      if (p === "/index.html" || p === "/fassung.json") h["Cache-Control"] = "no-cache";
    }
    /* Verbindungsaufbau: die erste Antwort auf einer neuen Verbindung wartet, bis der Aufbau (TCP + TLS) fertig wäre */
    const sitz = q.stream ? q.stream.session : q.socket;
    let warte = leitung.rtt();
    if (sitz && sitz.__auf != null && !sitz.__benutzt) { sitz.__benutzt = 1; if (leitung.an) warte += Math.max(0, sitz.__auf + AUFBAU * LEITUNG.rtt - performance.now()); }
    const raus = () => {
      if (a.destroyed || a.writableEnded) return;
      if (q.headers["if-none-match"] === d.etag) { z.n304++; a.writeHead(304, h); return a.end(); }
      const body = d.gz && /gzip/.test(q.headers["accept-encoding"] || "") ? d.gz : d.inhalt;
      if (body === d.gz) h["Content-Encoding"] = "gzip";
      h["Content-Length"] = body.length;
      z.bytes += body.length;
      a.writeHead(200, h);
      if (q.method === "HEAD") return a.end();
      leitung.senden(a, body);
    };
    if (warte > 0) setTimeout(raus, warte); else raus();
  }
  const srv = H2 ? http2.createSecureServer({ key: TLS.key, cert: TLS.cert, allowHTTP1: true }, antwort) : http.createServer(antwort);
  srv.keepAliveTimeout = 600000;
  if (H2) srv.on("session", (s) => { s.__auf = performance.now(); verb.add(s); s.on("close", () => verb.delete(s)); });
  else srv.on("connection", (s) => { s.__auf = performance.now(); verb.add(s); s.on("close", () => verb.delete(s)); });
  const lauscht = new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const o = {
    z, frische, lesen, lauscht, neu: "",
    get basis() { return (H2 ? "https" : "http") + "://127.0.0.1:" + srv.address().port; },
    /* alle Verbindungen schließen: nach einer Pause sind sie beim echten Telefon längst zu */
    trennen() { for (const s of verb) { try { s.destroy(); } catch (e) {} } verb.clear(); },
    zu() { this.trennen(); srv.close(); },
  };
  return o;
}

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
let DB_N = 100000;
const DBS = new Map();   /* Herkunft der Seite → Datenbank des Standes */
const dbKlon = () => JSON.parse(JSON.stringify(DB));
const DB_FREMD = dbKlon();
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
  if (process.env.SUPA_LOG && (methode !== "GET" || process.env.SUPA_LOG === "2")) console.log("    [supa] " + methode + " " + decodeURIComponent(q.url).slice(0, 160) + " " + roh.slice(0, 200));
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
    /* je Stand eine eigene Datenbank (an der Herkunft der Seite erkannt), die Schreiben behält: nach dem Aufwärmen ist
       das Konto ein Stammgast (Neuigkeiten, Freischaltungen, Tagesbonus schon da) – bei jedem Stand gleich */
    const db = DBS.get(String(q.headers.origin || "")) || DB_FREMD, tabelle = p.slice(9);
    const zeilen = db[tabelle] || (db[tabelle] = []);
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
      let neu = [];
      try { const j = JSON.parse(roh || "[]"); neu = (Array.isArray(j) ? j : [j]).map((r) => Object.assign({ id: "n" + (++DB_N), created_at: iso(Date.now()) }, r)); } catch (e) {}
      /* upsert: on_conflict=a,b bzw. Prefer resolution=merge-duplicates → vorhandene Zeile ergänzen */
      const konflikt = sp.get("on_conflict") ? sp.get("on_conflict").split(",") : /merge-duplicates/.test(prefer) ? ["id"] : null;
      const raus = neu.map((r) => {
        const alt = konflikt && zeilen.find((z) => konflikt.every((k) => r[k] !== undefined && String(z[k]) === String(r[k])));
        if (alt) { Object.assign(alt, r, { id: alt.id }); return alt; }
        zeilen.push(r); return r;
      });
      const zurueck = pgWaehlen(raus, sp);
      return /return=representation/.test(prefer) ? supaSenden(q, a, 201, JSON.stringify(objekt ? zurueck[0] || null : zurueck)) : supaSenden(q, a, 201, "");
    }
    if (methode === "PATCH") {
      let patch = {}; try { patch = JSON.parse(roh || "{}"); } catch (e) {}
      const treffer = pgFiltern(zeilen, sp);
      treffer.forEach((r) => Object.assign(r, patch));
      return /return=representation/.test(prefer) ? supaSenden(q, a, 200, JSON.stringify(objekt ? pgWaehlen(treffer, sp)[0] || null : pgWaehlen(treffer, sp))) : supaSenden(q, a, 204, "");
    }
    if (methode === "DELETE") {
      const weg = new Set(pgFiltern(zeilen, sp));
      db[tabelle] = zeilen.filter((z) => !weg.has(z));
      return /return=representation/.test(prefer) ? supaSenden(q, a, 200, JSON.stringify([...weg])) : supaSenden(q, a, 204, "");
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

/* ---------- Mitschreiber in der Seite (vor jedem Skript der Seite) ---------- */
function mitschreiber() {
  if (window.__dmaMess || window.top !== window) return;
  var P = performance, M = window.__dmaMess = { t: {}, tipp: [], lt: [], loaf: [], lcp: null, fehler: 0, sync: [], ab: 0, seiten: 1 };
  /* FASSUNG 886 (S1): der Merker des Fassungs-Wächters nur setzen, wenn er fehlt – sonst hebelte jedes Neuladen den
     Schutz vor einem zweiten Neuladen aus (Fall neu). Dazu: die wievielte Seite in diesem Tab, und wie lange nach dem
     ersten Öffnen sie begann (ab, ms). */
  try {
    localStorage.setItem("dma_tour_seen", "1");
    if (sessionStorage.getItem("dma-neu-geladen") == null) sessionStorage.setItem("dma-neu-geladen", "x");
    var ur = sessionStorage.getItem("__dmaMessUr");
    if (ur == null) sessionStorage.setItem("__dmaMessUr", String(P.timeOrigin));
    else M.ab = Math.max(0, P.timeOrigin - Number(ur));
    M.seiten = Number(sessionStorage.getItem("__dmaMessSeiten") || 0) + 1;
    sessionStorage.setItem("__dmaMessSeiten", String(M.seiten));
    M.vorher = JSON.parse(sessionStorage.getItem("__dmaMessVorher") || "null");
    /* die Seite davor (vor einem Neuladen): wann fassung.json ankam, wann sie ging, wie weit sie war */
    addEventListener("pagehide", function () {
      try {
        var fj = P.getEntriesByType("resource").filter(function (x) { return /fassung\.json/.test(x.name); })[0];
        sessionStorage.setItem("__dmaMessVorher", JSON.stringify({ geht: Math.round(P.now()), fjAb: fj ? Math.round(fj.startTime) : null, fjDa: fj ? Math.round(fj.responseEnd) : null,
          bild: Math.round((P.getEntriesByName("first-contentful-paint")[0] || {}).startTime || 0) || null, bereit: M.t.bereit != null ? Math.round(M.t.bereit) : null,
          ttfb: Math.round((P.getEntriesByType("navigation")[0] || {}).responseStart || 0) }));
      } catch (e) {}
    });
  } catch (e) {}
  try { P.setResourceTimingBufferSize(5000); } catch (e) {}
  /* FASSUNG 886 — synchrone Abrufe festhalten (Datei, Beginn, Dauer, Status, Aufrufer). So holt ein Platzhalter von
     app.js sein Stück, wenn es noch fehlt (dmaTeilSofort) – der Hauptfaden steht, bis es über die Leitung da ist.
     Nur mitgeschrieben; der Abruf selbst läuft unverändert. */
  try {
    var XP = XMLHttpRequest.prototype, xOpen = XP.open, xSend = XP.send;
    XP.open = function (m, u, as) { this.__dmaSync = arguments.length > 2 && !as ? String(u) : null; return xOpen.apply(this, arguments); };
    XP.send = function () {
      if (!this.__dmaSync) return xSend.apply(this, arguments);
      var a = P.now(), wer = String(new Error().stack || "").split("\n").slice(2, 7).map(function (z) {
        var m = z.match(/^\s*at (?:async )?(?:new )?([^\s(]+)(?: \(|$)/); return m && !/[/:]/.test(m[1]) ? m[1].replace(/^(HTMLDocument|Document|Window|HTMLButtonElement|HTMLElement)\./, "") : "";
      }).filter(Boolean).slice(0, 4).join(" < ");
      try { return xSend.apply(this, arguments); }
      finally { if (M.sync.length < 300) M.sync.push([kurz(this.__dmaSync), a, P.now() - a, this.status, wer]); }
    };
  } catch (e) {}
  try { P.mark("dma-mess-null"); M.null = P.getEntriesByName("dma-mess-null")[0].startTime; } catch (e) {}
  function merk(k) { if (M.t[k] == null) { M.t[k] = P.now(); try { P.mark("dma-mess-" + k); } catch (e) {} } }
  addEventListener("error", function () { M.fehler++; }, true);
  function bereit() { return window.LiveChat && window.DMA_TAFEL_STAND && document.readyState !== "loading" && document.querySelector('.tape-tab[data-target="view-knowledge"]'); }
  /* VORHER/NACHHER 886 — „Über mich“-Foto: gemalt (Element Timing, renderTime = auf dem Schirm, mit Dekodieren) und
     geladen (erstes Bild, in dem das Bild fertig ist). Das Merkmal elementtiming wird gesetzt, sobald der Parser das Bild
     anlegt (wie Sonde 886-foto) – am Laden ändert es nichts. */
  M.foto = { gemalt: null, steht: null, src: "" };
  try {
    new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { if (e.identifier === "foto" && M.foto.gemalt == null) M.foto.gemalt = e.renderTime || e.loadTime; }); }).observe({ type: "element", buffered: true });
    var mo = new MutationObserver(function () { var i = document.querySelector("#view-about .avatar-wrap img"); if (i) { i.setAttribute("elementtiming", "foto"); mo.disconnect(); } });
    mo.observe(document, { childList: true, subtree: true });
    var fi = 0;
    (function fotoSchau() { requestAnimationFrame(function () {
      var i = document.querySelector("#view-about .avatar-wrap img");
      if (i && i.complete && i.naturalWidth > 0) { M.foto.steht = P.now(); M.foto.src = String(i.currentSrc || "").replace(/^.*\//, "").slice(0, 40); return; }
      if (++fi < 1500) fotoSchau();
    }); })();
  } catch (e) {}
  (function schau() { requestAnimationFrame(function () { if (bereit()) merk("bereit"); else schau(); }); })();
  var WISSEN = '.tape-tab[data-target="view-knowledge"]', KZ = '#knowledgeSubnav [data-sub="sub-livechat"], .subnav-pill[data-sub="sub-livechat"]';
  var BED = {
    wissen: { bild: function () { return document.querySelector('#view-knowledge[data-active="true"]'); } },
    kz: {
      bild: function () { return document.querySelector('#sub-livechat[data-active="true"] #livechatArea > *'); },
      knopf: function () { var b = document.querySelector("#lcBetreten, #lcZumKlassenzimmer"); return b && b.getBoundingClientRect().height > 0; },
    },
  };
  addEventListener("click", function (e) {
    if (!e.isTrusted || !e.target || !e.target.closest) return;
    var w = e.target.closest(WISSEN) ? "wissen" : e.target.closest(KZ) ? "kz" : null;
    if (!w) return;
    var x = { w: w, ab: e.timeStamp }, offen = Object.keys(BED[w]), i = 0;
    M.tipp.push(x);
    try { P.mark("dma-mess-tipp-" + w); } catch (f) {}
    (function schau() { requestAnimationFrame(function () {
      offen = offen.filter(function (k) {
        if (!BED[w][k]()) return true;
        setTimeout(function () { x[k] = P.now() - x.ab; if (Object.keys(BED[w]).every(function (j) { return x[j] != null; })) x.fertig = 1; }, 0);
        return false;
      });
      if (offen.length && ++i < 1200) schau();
    }); })();
  }, true);
  function beob(typ, f) {
    try { if ((PerformanceObserver.supportedEntryTypes || []).indexOf(typ) >= 0) new PerformanceObserver(function (l) { l.getEntries().forEach(f); }).observe({ type: typ, buffered: true }); } catch (e) {}
  }
  function kurz(u) { return String(u || "").replace(/^.*\//, "").replace(/\?.*$/, "").slice(0, 60); }
  beob("longtask", function (x) { if (M.lt.length < 3000) M.lt.push([x.startTime, x.duration]); });
  beob("long-animation-frame", function (x) {
    if (M.loaf.length >= 600 || x.duration < 50) return;
    M.loaf.push({ ab: x.startTime, ms: x.duration, sperr: x.blockingDuration || 0,
      stil: x.styleAndLayoutStart ? x.startTime + x.duration - x.styleAndLayoutStart : 0,
      skripte: (x.scripts || []).slice().sort(function (a, b) { return b.duration - a.duration; }).slice(0, 3).map(function (s) {
        return [s.invokerType || "", String(s.invoker || "").slice(0, 70), kurz(s.sourceURL), s.sourceFunctionName || "", Math.round(s.duration), Math.round(s.forcedStyleAndLayoutDuration || 0), s.sourceCharPosition];
      }) });
  });
  beob("largest-contentful-paint", function (x) {
    var e = x.element;
    M.lcp = [x.startTime, e ? e.tagName.toLowerCase() + (e.id ? "#" + e.id : e.className && typeof e.className == "string" ? "." + e.className.split(" ")[0] : "") : "", kurz(x.url), x.size];
  });
}

/* in der Seite: alles einsammeln */
function einsammeln() {
  var M = window.__dmaMess, P = performance, n = P.getEntriesByType("navigation")[0] || {};
  function nz(x) { return x == null ? null : Math.round(x * 10) / 10; }
  var paint = {}; P.getEntriesByType("paint").forEach(function (e) { paint[e.name] = e.startTime; });
  return {
    t: M.t, null: M.null, tipp: M.tipp, lt: M.lt, loaf: M.loaf, lcp: M.lcp, fehler: M.fehler, jetzt: P.now(),
    ab: M.ab, seiten: M.seiten, fassung: String(window.DMA_VERSION || ""), vorher: M.vorher || null,
    sync: M.sync, sofort: (window.DMA_TEIL_SOFORT || []).slice(0, 40).map(function (s) { return String(s).replace(/\(?https?:\/\/[^\s)]*\/([^/\s)?]+)(\?[^\s:)]*)?(:\d+:\d+)\)?/g, "($1)").slice(0, 120); }),
    fp: paint["first-paint"], fcp: paint["first-contentful-paint"],
    nav: { ttfb: nz(n.responseStart), html: nz(n.responseEnd), dcl: nz(n.domContentLoadedEventEnd), load: nz(n.loadEventEnd), worker: nz(n.workerStart),
      kb: n.transferSize, enc: n.encodedBodySize, proto: n.nextHopProtocol, typ: n.deliveryType || "" },
    res: P.getEntriesByType("resource").map(function (e) {
      return [e.name, Math.round(e.startTime), Math.round(e.responseEnd), e.transferSize, e.encodedBodySize, e.workerStart > 0 ? 1 : 0, e.initiatorType, e.deliveryType || ""];
    }),
    dma: window.DMA_MESS ? { tipp: window.DMA_MESS.tipp } : null,
    sw: !!(navigator.serviceWorker && navigator.serviceWorker.controller),
    pruef: window.__dmaPruef || null,   /* nur Prüfseiten der Sonde 885-messen setzen das */
    foto: M.foto || null,
    konto: (function () { try { return typeof Backend !== "undefined" && !!(Backend.currentUser && Backend.currentUser()); } catch (e) { return null; } })(),
  };
}

/* ---------- Spur: Hauptfaden je Abschnitt ---------- */
const KAT = {
  FunctionCall: "skript", EvaluateScript: "skript", "v8.compile": "skript", "v8.compileModule": "skript", "v8.evaluateModule": "skript",
  "v8.produceCache": "skript", "v8.produceModuleCache": "skript", TimerFire: "skript", EventDispatch: "skript", FireIdleCallback: "skript",
  FireAnimationFrame: "skript", RunMicrotasks: "skript", BlinkScheduler_PerformMicrotaskCheckpoint: "skript", XHRReadyStateChange: "skript",
  XHRLoad: "skript", ParseScriptOnBackground: "skript", "V8.ScriptCompiler": "skript",
  MinorGC: "gc", MajorGC: "gc",
  "URLLoader::loadSynchronously": "sync",
  ParseAuthorStyleSheet: "stilLesen",
  UpdateLayoutTree: "stil", RecalculateStyles: "stil",
  Layout: "layout", UpdateLayerTree: "layout", PrePaint: "layout", HitTest: "layout", "IntersectionObserverController::computeIntersections": "layout",
  Paint: "zeichnen", PaintImage: "zeichnen", Layerize: "zeichnen", Commit: "zeichnen", CompositeLayers: "zeichnen", "Decode Image": "zeichnen",
  "Decode LazyPixelRef": "zeichnen", RasterTask: "zeichnen",
  ParseHTML: "html",
};
const KATEGORIEN = ["skript", "gc", "sync", "stilLesen", "stil", "layout", "zeichnen", "html", "rest"];
function kategorie(n) { return KAT[n] || (/^V8\.GC|^BlinkGC|^CppGC/.test(n) ? "gc" : null); }

function abschnitte(r) {
  /* zusammenhängend über 0 … FENSTER (Seitenuhr, ms) */
  const w = [];
  const sch = (name, a, e) => { if (e > a) w.push({ name, a, e }); };
  const t = r.roh, b = t.t.bereit;
  const wi = r.tippW, kz = r.tippK;
  if (b == null) { sch("start", 0, FENSTER); return w; }
  sch("start", 0, b);
  if (!wi) { sch("danach", b, FENSTER); return w; }
  sch("werkzeug", b, wi.ab);
  const wEnde = wi.ab + (wi.bild || 0);
  sch("wissen", wi.ab, wEnde);
  if (!kz) { sch("danach", wEnde, FENSTER); return w; }
  sch("werkzeug", wEnde, kz.ab);
  const kEnde = kz.ab + Math.max(kz.bild || 0, kz.knopf || 0);
  sch("kz", kz.ab, kEnde);
  sch("danach", kEnde, Math.max(kEnde, FENSTER));
  return w;
}

function spurAuswerten(buf, roh, wins) {
  let j; try { j = JSON.parse(buf.toString()); } catch (e) { return { fehler: "Spur nicht lesbar" }; }
  const ev = j.traceEvents || j;
  /* der letzte Nullpunkt gehört zum gemessenen Dokument (ein früheres about:blank trägt keinen in die Spur) */
  const nullM = ev.filter((e) => e.name === "dma-mess-null" && /blink\.user_timing/.test(e.cat || "")).pop();
  if (!nullM || roh.null == null) return { fehler: "Nullpunkt fehlt" };
  const pid = nullM.pid, tid = nullM.tid, null0 = nullM.ts - roh.null * 1000;
  /* Hauptfaden: X-Ereignisse und B/E-Paare zu Spannen */
  const sp = [], offen = [];
  for (const e of ev) {
    if (e.pid !== pid || e.tid !== tid) continue;
    if (e.ph === "X" && e.dur > 0) sp.push({ n: e.name, a: e.ts, e: e.ts + e.dur, args: e.args });
    else if (e.ph === "B") offen.push(e);
    else if (e.ph === "E") { for (let i = offen.length - 1; i >= 0; i--) if (offen[i].name === e.name || !e.name) { const b = offen.splice(i, 1)[0]; if (e.ts > b.ts) sp.push({ n: b.name, a: b.ts, e: e.ts, args: b.args }); break; } }
  }
  sp.sort((x, y) => x.a - y.a || (y.e - y.a) - (x.e - x.a));
  const stapel = [];
  for (const x of sp) {
    while (stapel.length && stapel[stapel.length - 1].e <= x.a) stapel.pop();
    const v = stapel[stapel.length - 1];
    if (v && x.e > v.e) x.e = v.e;               /* schlecht verschachtelt: auf den Vater kürzen */
    x.v = v || null; x.kinder = 0;
    if (v) v.kinder += x.e - x.a;
    x.kat = kategorie(x.n) || (v ? v.kat : "rest");
    x.inSkript = !!(v && (v.kat === "skript" || v.inSkript));
    x.top = v ? v.top : x;
    stapel.push(x);
  }
  const fenster = {}, sum = {}, zu = (o, k, w) => { o[k] = (o[k] || 0) + w; };
  for (const w of wins) fenster[w.name] = fenster[w.name] || {};
  const lang = new Map();
  for (const x of sp) {
    const d = x.e - x.a, selbst = Math.max(0, d - x.kinder);
    if (!selbst) continue;
    const forced = (x.kat === "layout" || x.kat === "stil") && x.inSkript;
    for (const w of wins) {
      const wa = null0 + w.a * 1000, we = null0 + w.e * 1000;
      const ueber = Math.min(x.e, we) - Math.max(x.a, wa);
      if (ueber <= 0) continue;
      const anteil = selbst * ueber / d / 1000;
      zu(fenster[w.name], x.kat, anteil);
      if (forced) zu(fenster[w.name], "erzwungen", anteil);
      zu(sum, x.kat, anteil);
    }
    /* Langläufer: Aufschlüsselung je oberste Aufgabe */
    const t = x.top;
    if (t.e - t.a >= 50000) {
      let L = lang.get(t);
      if (!L) lang.set(t, (L = { ab: Math.round((t.a - null0) / 1000), ms: Math.round((t.e - t.a) / 1000), kat: {}, gross: null }));
      zu(L.kat, x.kat, selbst / 1000);
      if (forced) zu(L.kat, "erzwungen", selbst / 1000);
      if ((x.n === "FunctionCall" || x.n === "EvaluateScript" || x.n === "v8.compile" || x.n === "TimerFire" || x.n === "FireIdleCallback") && (!L.gross || d > L.gross.d)) {
        const da = (x.args && x.args.data) || {};
        L.gross = { d, was: x.n + " " + (da.functionName || "") + " " + String(da.url || "").replace(/^.*\//, "").replace(/\?.*$/, "") };
      }
    }
  }
  const rund = (o) => { const r = {}; for (const k in o) r[k] = Math.round(o[k]); return r; };
  for (const k in fenster) fenster[k] = rund(fenster[k]);
  const langListe = [...lang.values()].filter((L) => L.ab >= 0 && L.ab < FENSTER).sort((a, b) => b.ms - a.ms).slice(0, 6)
    .map((L) => ({ ab: L.ab, ms: L.ms, kat: rund(L.kat), gross: L.gross ? L.gross.was.trim() + " " + Math.round(L.gross.d / 1000) : "" }));
  /* V8-Code-Cache: welche Skripte übersetzten Code aus dem Speicher nahmen (KB) und wo er auf dem Hauptfaden angelegt wurde (ms) */
  const codeCache = { benutzt: {}, angelegt: {} }, kurz = (u) => String(u || "").replace(/^.*\//, "").replace(/\?.*$/, "");
  for (const x of sp) {
    const d = (x.args && x.args.data) || {};
    if (x.n === "v8.compile" && d.consumedCacheSize) codeCache.benutzt[kurz(d.url)] = Math.round(d.consumedCacheSize / 1024);
    if (x.n === "v8.produceCache" && d.url) codeCache.angelegt[kurz(d.url)] = Math.round((x.e - x.a) / 1000);
  }
  return { null0, pid, tid, fenster, gesamt: rund(sum), lang: langListe, codeCache, ereignisse: sp.length };
}

/* ---------- V8-Stichproben je Abschnitt ---------- */
function profilAuswerten(profile, null0, wins) {
  const knoten = new Map(profile.nodes.map((n) => [n.id, n])), vater = new Map();
  profile.nodes.forEach((n) => (n.children || []).forEach((c) => vater.set(c, n.id)));
  const kurz = (u) => String(u || "").replace(/^https?:\/\/127\.0\.0\.1:\d+\//, "").replace(/^.*\/npm\//, "npm/").replace(/\?.*$/, "");
  const name = (cf) => (cf.functionName || "(anonym)") + " " + (kurz(cf.url) || "-") + ":" + (cf.lineNumber + 1) + ":" + (cf.columnNumber + 1);
  const erg = {};
  let t = profile.startTime;
  const dts = profile.timeDeltas || [];
  (profile.samples || []).forEach((id, i) => {
    t += dts[i] || 0;
    const dt = (dts[i + 1] || 0) / 1000, ms = (t - null0) / 1000;
    const w = wins.find((x) => ms >= x.a && ms < x.e); if (!w) return;
    const cf = knoten.get(id).callFrame;
    if (cf.functionName === "(idle)") return;
    const E = erg[w.name] = erg[w.name] || { dateien: {}, selbst: {}, gesamt: {} };
    const datei = kurz(cf.url) || "(" + cf.functionName + ")";
    E.dateien[datei] = (E.dateien[datei] || 0) + dt;
    if (cf.url) E.selbst[name(cf)] = (E.selbst[name(cf)] || 0) + dt;
    const ges = new Set();
    for (let k = id; k != null; k = vater.get(k)) { const c = knoten.get(k).callFrame; if (c.url) ges.add(name(c)); }
    ges.forEach((s) => { E.gesamt[s] = (E.gesamt[s] || 0) + dt; });
  });
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => [k, Math.round(v)]);
  const r = {};
  for (const k in erg) r[k] = { dateien: top(erg[k].dateien, 10), selbst: top(erg[k].selbst, 20), gesamt: top(erg[k].gesamt, 20) };
  return r;
}

/* ---------- ein Öffnen ---------- */
async function spurHolen(cdp) {
  const fertig = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
  await cdp.send("Tracing.end");
  const { stream } = await fertig, teile = [];
  for (;;) {
    const { data, eof, base64Encoded } = await cdp.send("IO.read", { handle: stream, size: 1 << 22 });
    teile.push(Buffer.from(data, base64Encoded ? "base64" : "utf8"));
    if (eof) break;
  }
  await cdp.send("IO.close", { handle: stream }).catch(() => {});
  return Buffer.concat(teile);
}

async function tippen(pg, sel, w) {
  for (let v = 1; v <= 4; v++) {
    await pg.waitForFunction((s) => { const e = document.querySelector(s); return e && e.getBoundingClientRect().height > 0; }, sel, { polling: "raf", timeout: 60000 });
    const r = await pg.evaluate((s) => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, n: window.__dmaMess.tipp.length, h: innerHeight, b: innerWidth }; }, sel);
    if (r.y > 0 && r.y < r.h && r.x > 0 && r.x < r.b) await pg.touchscreen.tap(r.x, r.y);
    else await pg.locator(sel).first().tap();
    const ok = await pg.waitForFunction(([w, n]) => window.__dmaMess.tipp.slice(n).some((x) => x.w === w && x.fertig), [w, r.n], { polling: "raf", timeout: 15000 }).then(() => true, () => false);
    if (ok) return v;
  }
  throw new Error("Tipp „" + w + "\" ohne Wirkung");
}

async function oeffnen(ctx, srv, art, o) {
  const pg = await ctx.newPage();
  const cdp = await ctx.newCDPSession(pg);
  const fehler = [];
  pg.on("pageerror", (e) => fehler.push(String(e.message).slice(0, 140)));
  if (SUPA) {
    await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "https://cdn.jsdelivr.net/*supabase*" }] });
    cdp.on("Fetch.requestPaused", (e) => cdp.send("Fetch.continueRequest", { requestId: e.requestId, url: srv.basis + "/__fremd/supabase.js" }).catch(() => {}));
  }
  if (o.swStopp) { await cdp.send("ServiceWorker.enable").catch(() => {}); await cdp.send("ServiceWorker.stopAllWorkers").catch(() => {}); }
  if (o.trennen) { srv.trennen(); fremde.forEach((f) => f.trennen()); }
  leitung.an = !!o.messen;
  if (o.messen && CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  const spur = o.messen && SPUR;
  if (spur) await cdp.send("Tracing.start", { transferMode: "ReturnAsStream", traceConfig: { recordMode: "recordAsMuchAsPossible",
    includedCategories: ["toplevel", "devtools.timeline", "disabled-by-default-devtools.timeline", "v8.execute", "blink.user_timing", "loading"] } });
  if (o.messen && PROFIL) { await cdp.send("Profiler.enable"); await cdp.send("Profiler.setSamplingInterval", { interval: 1000 }); await cdp.send("Profiler.start"); }
  const z0 = { ...srv.z, fehlt: srv.z.fehlt.slice() };
  const f0 = JSON.parse(JSON.stringify(fremdZ));
  let roh, versuche = [0, 0], spurBuf = null, profile = null, abbruch = null;
  try {
    await pg.goto(srv.basis + "/index.html" + (o.query || ""), { waitUntil: "commit", timeout: 180000 });
    /* FASSUNG 886 (S1): im Fall neu zählt erst „bereit" der NEUEN Fassung (eine alte Seite aus dem Speicher lädt neu) */
    await pg.waitForFunction((f) => window.__dmaMess && window.__dmaMess.t.bereit != null && (!f || String(window.DMA_VERSION) === f), o.fassung || "", { polling: "raf", timeout: 180000 });
    /* --tipp-nach: der erste Tipp erst TIPP_NACH ms nach „bereit" (Seitenuhr); in der Zeit fragt das Werkzeug nichts */
    if (o.messen && TIPP_NACH > 0) {
      const rest = await pg.evaluate((ms) => window.__dmaMess.t.bereit + ms - performance.now(), TIPP_NACH);
      if (rest > 0) await schlaf(rest);
    }
    versuche[0] = await tippen(pg, '.tape-tab[data-target="view-knowledge"]', "wissen");
    versuche[1] = await tippen(pg, '.subnav-pill[data-sub="sub-livechat"]', "kz");
    const bis = o.messen ? FENSTER : (o.nachlauf || 4000);
    const jetzt = await pg.evaluate(() => performance.now());
    if (jetzt < bis) await schlaf(bis - jetzt + 30);
    if (o.swWarten) await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 30000 }).then(() => schlaf(o.swWarten));
    roh = await pg.evaluate(einsammeln);
  } catch (e) {
    abbruch = String(e.message).split("\n")[0].slice(0, 200);
    roh = await pg.evaluate(einsammeln).catch(() => null);
  }
  if (o.messen && PROFIL) profile = (await cdp.send("Profiler.stop").catch(() => ({}))).profile || null;
  if (spur) spurBuf = await spurHolen(cdp).catch(() => null);
  leitung.an = false;
  await pg.close();
  if (!o.messen) return { art, abbruch };
  const r = { art, abbruch, fehler, versuche, roh, server: { anfragen: srv.z.anfragen - z0.anfragen, kb: Math.round((srv.z.bytes - z0.bytes) / 1024), n304: srv.z.n304 - z0.n304, packMs: Math.round(srv.z.packMs - z0.packMs),
    n404: srv.z.n404 - z0.n404, fehlt: srv.z.fehlt.filter((x) => z0.fehlt.indexOf(x) < 0) } };
  /* VORHER/NACHHER 886 — was in diesem Öffnen zu Supabase (Attrappe) und github ging (0–Fensterende) */
  const je = {}; for (const k in fremdZ.supa.je) { const d = fremdZ.supa.je[k] - (f0.supa.je[k] || 0); if (d) je[k] = d; }
  r.supa = { n: fremdZ.supa.n - f0.supa.n, kb: Math.round((fremdZ.supa.bytes - f0.supa.bytes) / 102.4) / 10, ws: fremdZ.supa.ws - f0.supa.ws, wsMsg: fremdZ.supa.wsMsg - f0.supa.wsMsg, opt: fremdZ.supa.opt - f0.supa.opt, je };
  r.gh = { n: fremdZ.gh.n - f0.gh.n, kb: Math.round((fremdZ.gh.bytes - f0.gh.bytes) / 1024), n304: fremdZ.gh.n304 - f0.gh.n304 };
  if (roh) auswerten(r);
  if (roh && spurBuf) {
    const wins = abschnitte(r);
    r.spur = spurAuswerten(spurBuf, roh, wins);
    if (profile && r.spur.null0) r.profil = profilAuswerten(profile, r.spur.null0, wins);
    if (SPUR_ORDNER) { fs.mkdirSync(SPUR_ORDNER, { recursive: true }); fs.writeFileSync(path.join(SPUR_ORDNER, o.stand + "-" + art + "-" + o.lauf + ".json.gz"), zlib.gzipSync(spurBuf)); }
  }
  if (r.roh) { delete r.roh.res; delete r.roh.loaf; delete r.roh.lt; delete r.roh.sync; delete r.roh.sofort; }
  return r;
}

/* abgeleitete Zahlen eines Laufs */
function auswerten(r) {
  const t = r.roh, rd = (x) => (x == null ? null : Math.round(x));
  const letzter = (w) => t.tipp.filter((x) => x.w === w).pop() || null;
  r.tippW = letzter("wissen"); r.tippK = letzter("kz");
  const W = r.tippW, K = r.tippK;
  r.fp = rd(t.fp); r.fcp = rd(t.fcp); r.lcp = t.lcp ? rd(t.lcp[0]) : null; r.lcpWas = t.lcp ? t.lcp.slice(1, 3).filter(Boolean).join(" ") : "";
  r.ttfb = rd(t.nav.ttfb); r.dcl = rd(t.nav.dcl); r.load = rd(t.nav.load); r.bereit = rd(t.t.bereit);
  /* FASSUNG 886 (S1): über ein Neuladen hinweg ab dem ersten Öffnen gerechnet (ohne Neuladen ab = 0) */
  r.ab = rd(t.ab || 0); r.seiten = t.seiten || 1; r.fassung = t.fassung || ""; r.vorher = t.seiten > 1 ? t.vorher : null;
  r.bereitAb = r.bereit == null ? null : r.ab + r.bereit; r.fcpAb = r.fcp == null ? null : r.ab + r.fcp;
  r.wissen = W ? rd(W.bild) : null;
  r.kzBild = K ? rd(K.bild) : null; r.kzKnopf = K ? rd(K.knopf) : null;
  r.kzAlt = W && K ? rd(K.ab + K.knopf - W.ab) : null;
  r.kzAbStart = K ? rd(K.ab + K.knopf) : null;
  r.pause = W && K && t.t.bereit != null ? rd((W.ab - t.t.bereit) + (K.ab - W.ab - W.bild)) : null;
  /* VORHER/NACHHER 886 — „Über mich“-Foto (null = nicht gemalt, solange „Über mich“ zu sehen war) */
  r.konto = t.konto;
  r.fotoGemalt = t.foto ? rd(t.foto.gemalt) : null; r.fotoSteht = t.foto ? rd(t.foto.steht) : null; r.fotoSrc = t.foto ? t.foto.src : "";
  r.fotoNachBild = r.fotoGemalt != null && r.fcp != null ? r.fotoGemalt - r.fcp : null;
  r.dma = t.dma && t.dma.tipp ? { wissen: (t.dma.tipp.wissen || []).map((x) => x[1]).pop(), kz: (t.dma.tipp.kz || []).map((x) => x[1]).pop() } : null;
  const lt = t.lt.filter(([a]) => a < FENSTER);
  r.lang = { n: lt.length, summe: rd(lt.reduce((s, x) => s + x[1], 0)), max: rd(lt.reduce((m, x) => Math.max(m, x[1]), 0)), sperr: rd(lt.reduce((s, x) => s + Math.max(0, x[1] - 50), 0)),
    liste: lt.slice().sort((a, b) => b[1] - a[1]).slice(0, 5).map(([a, d]) => [rd(a), rd(d)]) };
  r.loaf = t.loaf.filter((x) => x.ab < FENSTER).sort((a, b) => b.ms - a.ms).slice(0, 5).map((x) => ({ ab: rd(x.ab), ms: rd(x.ms), sperr: rd(x.sperr), stilLayout: rd(x.stil), skripte: x.skripte }));
  /* Netz: aus Resource Timing (transferSize = über die Leitung; 0 = aus dem Speicher; kleiner als der Inhalt = nur nachgefragt, 304) */
  const res = t.res.filter((x) => x[1] < FENSTER), b = t.t.bereit == null ? FENSTER : t.t.bereit;
  const n = { kbBisBereit: 0, kbGesamt: 0, anfragen: res.length + 1, ausNetz: 0, nachgefragt: 0, ausSpeicher: 0, ausSw: 0, fremdFehl: 0 };
  const proDatei = {};
  const zaehl = (url, ende, tr, enc, sw) => {
    const eigen = url.startsWith("http://127.0.0.1") || url.startsWith("https://127.0.0.1") || /cdn\.jsdelivr\.net/.test(url);
    if (!eigen) { n.fremdFehl++; return; }
    if (tr > 0 && ende <= b) n.kbBisBereit += tr;
    n.kbGesamt += tr;
    if (tr === 0) { if (sw) n.ausSw++; else n.ausSpeicher++; } else if (enc > 0 && tr < enc) n.nachgefragt++; else n.ausNetz++;
    if (tr > 0) { const k = url.replace(/^https?:\/\/[^/]+\//, "").replace(/\?.*$/, "").replace(/^.*\/npm\//, "npm/"); proDatei[k] = (proDatei[k] || 0) + tr; }
  };
  /* Seite über den Service Worker: transferSize nennt dort die Größe seiner Antwort, nicht die Leitung (die zählt der Server) */
  zaehl("https://127.0.0.1/index.html", t.nav.html || 0, t.nav.worker > 0 ? 0 : t.nav.kb || 0, t.nav.enc || 0, t.nav.worker > 0);
  res.forEach((x) => zaehl(x[0], x[2], x[3], x[4], x[5]));
  n.kbBisBereit = Math.round(n.kbBisBereit / 1024); n.kbGesamt = Math.round(n.kbGesamt / 1024);
  n.kbServer = r.server.kb; n.anfragenServer = r.server.anfragen;
  r.netz = n;
  r.dateien = Object.entries(proDatei).sort((a, b2) => b2[1] - a[1]).slice(0, 12).map(([k, v]) => [k, Math.round(v / 1024)]);
  r.sw = t.sw; r.proto = t.nav.proto;
  /* FASSUNG 886 — synchron geholte Stücke: Anzahl und gesperrte ms gesamt und je Abschnitt, dazu jedes mit Namen
     (Datei, ab ms, ms, Status, Abschnitt, Aufrufer) und die eigene Liste der Seite (DMA_TEIL_SOFORT) */
  const wins = abschnitte(r);
  const wo = (ab) => { const w = wins.find((x) => ab >= x.a && ab < x.e); return w ? w.name : "danach"; };
  const sy = (t.sync || []).map(([datei, ab, ms, status, wer]) => [datei, rd(ab), rd(ms), status, wo(ab), wer || ""]);
  r.sync = { n: sy.length, ms: rd(sy.reduce((s, x) => s + x[2], 0)) };
  for (const w of ABSCHN) r.sync[w] = sy.filter((x) => x[4] === w).reduce((s, x) => s + x[2], 0);
  r.sync.liste = sy;
  r.sync.sofort = t.sofort || [];
}

/* ---------- ein Durchgang: alle Fälle für einen Stand ---------- */
/* Ein Profil je Fall-Gruppe, auf der Platte wie bei einem echten Telefon: nur dann legt Chrome den übersetzten Code
   (V8-Code-Cache) über den HTTP-Speicher an und benutzt ihn ab dem dritten Öffnen – in den flüchtigen Prüf-Kontexten
   (browser.newContext, so maß das alte Werkzeug) nie (gemessen: app.js ausführen 55–75 ms flüchtig, 18–22 ms ab dem
   dritten Öffnen dauerhaft, Rechner ungebremst). --fluechtig = wie früher.
   Kein Proxy, kein fremder Name wird aufgelöst (nur 127.0.0.1): nichts verlässt den Rechner. */
const FLUECHTIG = !!S.fluechtig;
async function profil() {
  const args = ["--no-proxy-server", "--host-resolver-rules=" + fremdRegeln()];
  if (TLS) args.push("--ignore-certificate-errors-spki-list=" + TLS.spki);
  const geraet = { viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
  let ctx, br = null, dir = null;
  if (FLUECHTIG) { br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args }); ctx = await br.newContext(geraet); }
  else { dir = fs.mkdtempSync(path.join(os.tmpdir(), "dma-mess-profil-")); ctx = await chromium.launchPersistentContext(dir, Object.assign({ executablePath: "/opt/pw-browsers/chromium", args }, geraet)); }
  if (KONTO === "mitglied") await ctx.addInitScript(kontoSkript, SITZUNG);
  await ctx.addInitScript(mitschreiber);
  ctx.zu = async () => { await ctx.close().catch(() => {}); if (br) await br.close().catch(() => {}); if (dir) fs.rmSync(dir, { recursive: true, force: true }); };
  return ctx;
}

async function durchgang(st, lauf) {
  const erg = [];
  const vor = (r, was) => { if (r.abbruch) console.log("  " + st.name + " Vorbereitung " + was + " (Lauf " + (lauf + 1) + "): " + r.abbruch); };
  const mess = async (ctx, srv, art, o) => {
    const r = await oeffnen(ctx, srv, art, Object.assign({ messen: true, stand: st.name, lauf }, o));
    r.stand = st.name; r.lauf = lauf; erg.push(r);
    if (!LEISE) zeile(r);
  };
  const gruppe = async (f) => { const ctx = await profil(); try { await f(ctx); } finally { await ctx.zu(); } };
  {
    const kette = ["kalt", "warm", "wieder"], bisK = Math.max(...ARTEN.map((a) => kette.indexOf(a)));
    if (bisK >= 0) await gruppe(async (ctx) => {
      fremdFrische = 300;
      for (let i = 0; i <= bisK; i++) {
        if (ARTEN.includes(kette[i])) await mess(ctx, st.srvA, kette[i], { trennen: i === 0 });
        else vor(await oeffnen(ctx, st.srvA, "vor", { nachlauf: 6000, trennen: i === 0 }), kette[i]);
      }
    });
    /* pause: der Stammgast war schon zweimal da (Code-Cache angelegt), jetzt sind > 10 min vergangen */
    if (ARTEN.includes("pause")) await gruppe(async (ctx) => {
      fremdFrische = 0;
      vor(await oeffnen(ctx, st.srvB, "vor", { nachlauf: 6000, trennen: true }), "pause 1");
      vor(await oeffnen(ctx, st.srvB, "vor", { nachlauf: 6000 }), "pause 2");
      await mess(ctx, st.srvB, "pause", { trennen: true });
    });
    if (ARTEN.includes("sw") || ARTEN.includes("neu")) await gruppe(async (ctx) => {
      fremdFrische = 0;
      /* 1. Öffnen meldet den Helfer an (2,5 s nach load), 2. Öffnen läuft schon durch ihn und füllt seinen Speicher,
         3. Öffnen ist das erste aus seinem Speicher: dabei legt Chrome den übersetzten Code (V8-Code-Cache) an – auf dem
         Hauptfaden, gemessen ~85 ms (v8.produceCache). Ein Stammgast hat das hinter sich; gemessen wird das 4. Öffnen. */
      vor(await oeffnen(ctx, st.srvB, "vor", { query: "?mit-sw", nachlauf: 3000, swWarten: 2000, trennen: true }), "sw 1");
      vor(await oeffnen(ctx, st.srvB, "vor", { query: "?mit-sw", nachlauf: 8000 }), "sw 2");
      vor(await oeffnen(ctx, st.srvB, "vor", { query: "?mit-sw", nachlauf: 6000 }), "sw 3");
      if (ARTEN.includes("sw")) await mess(ctx, st.srvB, "sw", { query: "?mit-sw", swStopp: true, trennen: true });
      /* FASSUNG 886 (S1) — neu: dieselbe Lage, inzwischen ist Fassung + 1 draußen (nur index.html und fassung.json) */
      if (ARTEN.includes("neu")) {
        st.srvB.neu = String(Number(st.fassung) + 1);
        try { await mess(ctx, st.srvB, "neu", { query: "?mit-sw", swStopp: true, trennen: true, fassung: st.srvB.neu }); }
        finally { st.srvB.neu = ""; }
      }
    });
  }
  return erg;
}

async function aufwaermen(st) {
  for (const srv of [st.srvA, st.srvB]) {
    const ctx = await profil();
    const r = await oeffnen(ctx, srv, "vor", { nachlauf: 7000, query: srv === st.srvB && ARTEN.includes("sw") ? "?mit-sw" : "" });
    await ctx.zu();
    if (r.abbruch) throw new Error("Aufwärmen (" + st.name + "): " + r.abbruch);
  }
}

/* ---------- Statistik und Ausgabe ---------- */
function stat(werte) {
  const v = werte.filter((x) => typeof x === "number" && isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const q = (p) => { const i = (v.length - 1) * p, u = Math.floor(i), o = Math.ceil(i); return v[u] + (v[o] - v[u]) * (i - u); };
  return { median: Math.round(q(0.5)), p25: Math.round(q(0.25)), p75: Math.round(q(0.75)), min: v[0], max: v[v.length - 1], n: v.length };
}
const holen = (r, pfad) => pfad.split(".").reduce((o, k) => (o == null ? undefined : o[k]), r);
const MASSE = [
  ["fcp", "erstes Bild"], ["lcp", "größtes Bild (LCP)"], ["ttfb", "Seite: erstes Byte"], ["dcl", "DOMContentLoaded"], ["bereit", "bereit"], ["load", "load"],
  ["seiten", "Seiten je Öffnen (2 = neu geladen)"], ["ab", "Vorlauf bis zur Seite, die bleibt"], ["fcpAb", "erstes Bild (bleibende Seite) ab Öffnen"],
  ["bereitAb", "bereit (bleibende Seite) ab Öffnen"],
  ["wissen", "Wissen: Tipp → Bild"], ["kzBild", "Klassenzimmer: Tipp → Bild"], ["kzKnopf", "Klassenzimmer: Tipp → Knopf"],
  ["fotoGemalt", "Über mich: Foto gemalt"], ["fotoSteht", "Über mich: Foto geladen"], ["fotoNachBild", "Foto gemalt − erstes Bild"],
  ["supa.n", "Supabase-Anfragen 0–10 s"], ["supa.kb", "Supabase-KB 0–10 s"], ["supa.ws", "Echtzeit-Verbindungen"], ["gh.kb", "github-KB"],
  ["kzAlt", "alte Spalte: Wissen-Tipp → Knopf"], ["kzAbStart", "alte Spalte: Öffnen → Knopf"], ["pause", "  davon Werkzeug-Pausen"],
  ["lang.n", "Langläufer 0–10 s: Anzahl"], ["lang.summe", "Langläufer: Summe"], ["lang.max", "Langläufer: längster"], ["lang.sperr", "Sperrzeit (Σ über 50 ms)"],
  ["netz.kbBisBereit", "KB über die Leitung bis bereit"], ["netz.kbGesamt", "KB über die Leitung 0–10 s"], ["netz.ausNetz", "Dateien aus dem Netz"],
  ["netz.nachgefragt", "Dateien nachgefragt (304)"], ["netz.ausSpeicher", "Dateien aus dem Speicher"], ["netz.ausSw", "Dateien vom Service Worker"],
  ["netz.kbServer", "KB, die der Server schickte"], ["netz.anfragenServer", "Anfragen beim Server"], ["server.n404", "Anfragen ins Leere (404)"],
  ["sync.n", "synchron geholt: Anzahl"], ["sync.ms", "synchron geholt: ms gesperrt"], ["sync.start", "  davon beim Start"],
  ["sync.wissen", "  davon im Wissen-Tipp"], ["sync.kz", "  davon im Klassenzimmer-Tipp"],
];
const ABSCHN = ["start", "wissen", "kz", "danach", "werkzeug"];
function spurMasse() {
  const m = [];
  for (const w of ABSCHN) for (const k of KATEGORIEN.concat(["erzwungen"])) m.push(["spur.fenster." + w + "." + k, w + ": " + k]);
  for (const k of KATEGORIEN) m.push(["spur.gesamt." + k, "0–10 s: " + k]);
  return m;
}
function zusammenfassen(alle) {
  const z = {};
  for (const r of alle) {
    if (r.abbruch) continue;
    const s = (z[r.stand] = z[r.stand] || {}), a = (s[r.art] = s[r.art] || {});
    for (const [p] of MASSE.concat(spurMasse())) { const w = holen(r, p); (a[p] = a[p] || []).push(w == null && p.startsWith("spur.") && r.spur && !r.spur.fehler ? 0 : w); }
  }
  for (const s in z) for (const a in z[s]) for (const p in z[s][a]) { z[s][a][p] = stat(z[s][a][p]); if (!z[s][a][p]) delete z[s][a][p]; }
  return z;
}
/* FASSUNG 886 — gepaarter Unterschied B − A je Durchgang, dazu
     ki95: 95-%-Bereich des gepaarten Medians (Bootstrap: 2000-mal n Paare mit Zurücklegen ziehen, fester Startwert –
           dieselben Zahlen geben denselben Bereich);
     vz:   Vorzeichentest (wie oft B größer, wie oft kleiner, p zweiseitig; Gleichstände zählen nicht);
     deutlich: ki95 enthält die Null nicht UND p < 0,05 – erst dann ist B wirklich anders als A.
   Im A/A-Test (--aa) ist die halbe Breite von ki95 die Rauschgrenze für einen Vergleich mit gleich vielen Paaren. */
function zufall(start) { let s = start >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function medianVon(v) { const s = v.slice().sort((a, b) => a - b), i = (s.length - 1) / 2; return (s[Math.floor(i)] + s[Math.ceil(i)]) / 2; }
function binomP(k, n) { /* zweiseitig: P(X ≤ min(k, n−k)) · 2 bei p = ½ */
  if (!n) return 1;
  const m = Math.min(k, n - k); let s = 0, c = 1;
  for (let i = 0; i <= m; i++) { s += c; c = c * (n - i) / (i + 1); }
  return Math.min(1, 2 * s / Math.pow(2, n));
}
function paarStat(d) {
  const s = stat(d);
  if (!s) return null;
  const z = zufall(885), m = [];
  for (let k = 0; k < 2000; k++) { const w = []; for (let i = 0; i < d.length; i++) w.push(d[Math.floor(z() * d.length)]); m.push(medianVon(w)); }
  m.sort((a, b) => a - b);
  s.ki95 = [Math.round(m[Math.floor(0.025 * (m.length - 1))]), Math.round(m[Math.ceil(0.975 * (m.length - 1))])];
  const plus = d.filter((x) => x > 0).length, minus = d.filter((x) => x < 0).length;
  s.vz = { plus, minus, p: Math.round(binomP(plus, plus + minus) * 1000) / 1000 };
  s.deutlich = (s.ki95[0] > 0 || s.ki95[1] < 0) && s.vz.p < 0.05;
  return s;
}
function gepaart(alle, art, p) {
  const d = [];
  for (let i = 0; i < LAEUFE; i++) {
    const a = alle.find((r) => r.stand === "A" && r.art === art && r.lauf === i && !r.abbruch), b = alle.find((r) => r.stand === "B" && r.art === art && r.lauf === i && !r.abbruch);
    const x = a && holen(a, p), y = b && holen(b, p);
    if (typeof x === "number" && typeof y === "number") d.push(y - x);
  }
  return paarStat(d);
}
/* synchron geholte Stücke mit Namen: je Stand und Fall, wie oft jede Datei in wie vielen Läufen kam, wo und für wen */
function syncNamen(alle) {
  const z = {};
  for (const r of alle) {
    if (r.abbruch || !r.sync) continue;
    const a = ((z[r.stand] = z[r.stand] || {})[r.art] = z[r.stand][r.art] || {});
    for (const [datei, , ms, , wo, wer] of r.sync.liste) {
      const x = (a[datei] = a[datei] || { n: 0, ms: [], wo: {}, wer: {} });
      x.n++; x.ms.push(ms); x.wo[wo] = (x.wo[wo] || 0) + 1;
      if (wer) x.wer[wer] = (x.wer[wer] || 0) + 1;
    }
  }
  for (const s in z) for (const a in z[s]) for (const f in z[s][a]) { const x = z[s][a][f]; x.ms = stat(x.ms); }
  return z;
}
const fmt = (s) => (s ? String(s.median).padStart(6) + " (" + s.min + "–" + s.max + ")" : "     –");
const fmtPaar = (d) => (d ? (d.median > 0 ? "+" : "") + d.median + " (" + d.min + "…" + d.max + "; 95 %: " + d.ki95[0] + "…" + d.ki95[1] + ", " + d.vz.plus + "↑/" + d.vz.minus + "↓)" + (d.deutlich ? " DEUTLICH" : "") : "");
function zeile(r) {
  if (r.abbruch) { console.log("  " + r.stand + " " + r.art.padEnd(6) + " Lauf " + (r.lauf + 1) + ": ABBRUCH " + r.abbruch); return; }
  const sp = r.spur && r.spur.gesamt ? "  Spur 0–10 s: Skript " + (r.spur.gesamt.skript || 0) + ", Stil " + ((r.spur.gesamt.stil || 0) + (r.spur.gesamt.stilLesen || 0)) + ", Layout " + (r.spur.gesamt.layout || 0) : "";
  console.log("  " + r.stand + " " + r.art.padEnd(6) + " Lauf " + (r.lauf + 1) + ": Bild " + r.fcp + "  bereit " + r.bereit + "  Wissen " + r.wissen + "  KZ " + r.kzBild + "/" + r.kzKnopf +
    "  (alt +" + r.kzAlt + ", ab Start " + r.kzAbStart + ")  Langl. " + r.lang.n + "/" + r.lang.summe + "/" + r.lang.max + "  " + r.netz.kbBisBereit + " KB" +
    (r.seiten > 1 ? "  neu geladen: " + r.seiten + " Seiten, Vorlauf " + r.ab + ", bereit ab Öffnen " + r.bereitAb +
      (r.vorher ? " (alte Seite: erstes Byte " + r.vorher.ttfb + ", fassung.json " + r.vorher.fjAb + "→" + r.vorher.fjDa + ", Bild " + r.vorher.bild + ", ging " + r.vorher.geht + ")" : "") : "") +
    (r.versuche[0] > 1 || r.versuche[1] > 1 ? "  Tipps " + r.versuche.join("/") : "") + (r.fehler.length ? "  Seitenfehler " + r.fehler.length : "") +
    (r.server.n404 ? "  404: " + r.server.n404 + (r.server.fehlt.length ? " (" + r.server.fehlt.slice(0, 4).join(", ") + ")" : "") : "") +
    (r.sync && r.sync.n ? "  synchron " + r.sync.liste.map((x) => x[0].replace(/^app-teil-|\.js$/g, "") + "@" + x[4] + " " + x[2]).join(", ") : "") + sp +
    (r.konto ? "  angemeldet" : "") + "  Foto " + r.fotoGemalt + "/" + r.fotoSteht + " " + r.fotoSrc + "  Supa " + (r.supa ? r.supa.n + "/" + r.supa.kb + "KB/ws" + r.supa.ws : "–") + (r.gh && r.gh.n ? "  gh " + r.gh.n + "/" + r.gh.kb + "KB" : ""));
}

(async () => {
  const lesbar = (w) => { try { return (fs.readFileSync(path.join(w, "index.html"), "utf8").match(/DMA_VERSION = "(\d+)"/) || [])[1] || "?"; } catch (e) { return "?"; } };
  /* Stand: git-Commit des Ordners; bei einem ausgepackten Stand (git archive … | tar -x) steht er in <wurzel>/.commit */
  const commit = (w) => {
    try { return fs.readFileSync(path.join(w, ".commit"), "utf8").trim().slice(0, 40) || null; } catch (e) {}
    try { return execFileSync("git", ["-C", w, "rev-parse", "--short", "HEAD"], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch (e) { return null; }
  };
  const staende = STAENDE_ARG ? STAENDE_ARG.map((x) => ({ name: x.name, wurzel: x.wurzel })) : [{ name: "A", wurzel: WURZEL }].concat(GEGEN ? [{ name: "B", wurzel: GEGEN }] : []);
  const MEHR = !!STAENDE_ARG;
  for (const f of fremde) await f.lauscht;
  for (const st of staende) { st.srvA = server(st.wurzel, 600); st.srvB = server(st.wurzel, 0); st.fassung = lesbar(st.wurzel); st.commit = commit(st.wurzel); await st.srvA.lauscht; await st.srvB.lauscht; }
  for (const st of staende) { st.db = dbKlon(); DBS.set(st.srvA.basis, st.db); DBS.set(st.srvB.basis, st.db); }
  console.log("\nLadezeit: Netz " + NETZ + (isFinite(LEITUNG.down) ? " (" + (LEITUNG.down * 8 / 1e6) + " Mbit/s, " + LEITUNG.rtt + " ms, Aufbau " + AUFBAU + " RTT)" : "") +
    ", Rechner " + CPU + "×, " + (H2 ? "HTTP/2 + TLS" : "HTTP/1.1") + ", " + LAEUFE + " Läufe, Fälle " + ARTEN.join(",") + ", Fenster " + FENSTER + " ms" +
    (TIPP_NACH ? ", Tipp " + TIPP_NACH + " ms nach bereit" : ", Tipp sofort nach bereit") + (AA ? ", A/A-Test (Rauschgrenze)" : "") +
    (SW_WACH ? ", Service Worker wacht " + SW_WACH + " ms" : "") +
    (SPUR ? ", Spur" : "") + (PROFIL ? ", Profil" : "") + (FLUECHTIG ? ", flüchtige Kontexte" : ", Profil auf der Platte") + ", supabase-js " + (SUPA ? path.basename(SUPA_PFAD) + " (" + Math.round(SUPA_GZ.length / 1024) + " KB gz)" : "fehlt (fällt aus)"));
  for (const st of staende) console.log("  Stand " + st.name + ": " + st.wurzel + "  (Fassung " + st.fassung + (st.commit ? ", " + st.commit : "") + ")");
  console.log("  Konto: " + KONTO + ", Supabase nachgebaut (Bedenkzeit " + SUPA_MS + " ms), Foto: " + (FOTO ? "github nachgebaut (" + FOTO.length + " B)" : "github nicht erreichbar") + (JSONL ? ", laufend: " + JSONL : ""));
  /* VORHER/NACHHER 886 — fortsetzen: was schon in der JSONL-Datei steht, wird nicht noch einmal gemessen */
  const EINST = { netz: NETZ, cpu: CPU, konto: KONTO, tippNach: TIPP_NACH, arten: ARTEN.join(","), staende: staende.map((x) => x.name + "=" + x.wurzel).join(","), supaMs: SUPA_MS, foto: !!FOTO, spur: SPUR, fenster: FENSTER };
  const fertig = new Map();
  if (JSONL && fs.existsSync(JSONL)) {
    for (const z of fs.readFileSync(JSONL, "utf8").split("\n").filter(Boolean)) {
      let j; try { j = JSON.parse(z); } catch (e) { continue; }
      if (j.typ === "einstellung" && JSON.stringify(j.einst) !== JSON.stringify(EINST)) { console.error("JSONL " + JSONL + " gehört zu anderen Einstellungen: " + JSON.stringify(j.einst)); process.exit(2); }
      if (j.typ === "durchgang") fertig.set(j.stand + "|" + j.lauf, j.erg);
    }
    console.log("  fortgesetzt: " + fertig.size + " Durchgänge schon gemessen");
  } else if (JSONL) fs.writeFileSync(JSONL, JSON.stringify({ typ: "einstellung", einst: EINST, datum: new Date().toISOString(), staende: staende.map((x) => ({ name: x.name, wurzel: x.wurzel, fassung: x.fassung, commit: x.commit })) }) + "\n");
  for (const st of staende) await aufwaermen(st);
  const lastVor = os.loadavg();
  const alle = [];
  /* Reihenfolge: Williams-Plan (jeder Stand gleich oft an jeder Stelle, jede Nachbarschaft gleich oft); bei 2 Ständen
     wie bisher A B, B A, … */
  const nS = staende.length, basis = [0];
  for (let k = 1, lo = 1, hi = nS - 1; k < nS; k++) basis.push(k % 2 ? lo++ : hi--);
  const zeileW = (i) => basis.map((x) => (x + i) % nS);
  const ordnung = (i) => nS < 3 ? (i % 2 ? [1, 0] : [0, 1]).slice(0, nS) : nS % 2 === 0 ? zeileW(i % nS) : (i % 2 ? zeileW(Math.floor(i / 2) % nS).reverse() : zeileW(Math.floor(i / 2) % nS));
  for (let i = 0; i < LAEUFE; i++) {
    const reihe = ordnung(i).map((k) => staende[k]);
    for (const st of reihe) {
      const schon = fertig.get(st.name + "|" + i);
      if (schon) { alle.push(...schon); continue; }
      const erg = await durchgang(st, i);
      alle.push(...erg);
      if (JSONL) fs.appendFileSync(JSONL, JSON.stringify({ typ: "durchgang", stand: st.name, lauf: i, zeit: new Date().toISOString(), last: os.loadavg(), erg }) + "\n");
    }
    console.log("  Lauf " + (i + 1) + " von " + LAEUFE + " fertig (" + reihe.map((x) => x.name).join(" ") + ") " + new Date().toISOString().slice(11, 19));
  }
  const lastNach = os.loadavg();
  for (const st of staende) { st.srvA.zu(); st.srvB.zu(); }
  for (const f of fremde) f.zu();
  const z = zusammenfassen(alle), sn = syncNamen(alle);

  console.log("\nMedian (min–max) in ms bzw. KB/Anzahl, je " + LAEUFE + " Läufe:");
  for (const art of ARTEN) {
    console.log("\n" + art + (staende.length > 1 ? "".padEnd(36) + "A".padStart(18) + "B".padStart(20) + "   B−A gepaart (min…max; 95 % des Medians, B größer/kleiner)" : ""));
    for (const [p, txt] of MASSE) {
      if (MEHR) {
        const w = staende.map((x) => z[x.name] && z[x.name][art] && z[x.name][art][p]);
        if (w.some(Boolean)) console.log("  " + txt.padEnd(40) + w.map((x, k) => staende[k].name + " " + fmt(x).trim()).join("   "));
        continue;
      }
      const a = z.A && z.A[art] && z.A[art][p], b = z.B && z.B[art] && z.B[art][p];
      if (!a && !b) continue;
      let s = "  " + txt.padEnd(40) + fmt(a).padEnd(20);
      if (staende.length > 1) s += fmt(b).padEnd(20) + fmtPaar(gepaart(alle, art, p));
      console.log(s);
    }
    /* synchron geholte Stücke mit Namen (alle Läufe dieses Falls) */
    for (const st of staende) {
      const N = sn[st.name] && sn[st.name][art];
      if (N && Object.keys(N).length) console.log("  synchron geholt, Stand " + st.name + ": " + Object.entries(N).sort((x, y) => y[1].n - x[1].n).map(([f, x]) =>
        f + " " + x.n + "× (" + Object.entries(x.wo).map(([w, k]) => w + " " + k).join(", ") + "; Median " + x.ms.median + " ms" + (Object.keys(x.wer).length ? "; " + Object.keys(x.wer)[0] : "") + ")").join(" · "));
    }
    if (SPUR) for (const st of staende) {
      const S2 = z[st.name] && z[st.name][art]; if (!S2) continue;
      console.log("  Hauptfaden (Spur, Median ms) Stand " + st.name + ":");
      for (const w of ABSCHN) {
        const teile = KATEGORIEN.concat(["erzwungen"]).map((k) => [k, S2["spur.fenster." + w + "." + k]]).filter(([, s]) => s && s.median > 0)
          .map(([k, s]) => (k === "erzwungen" ? "(davon erzwungenes Stil/Layout " : k + " ") + s.median + (k === "erzwungen" ? ")" : ""));
        if (teile.length) console.log("    " + w.padEnd(9) + teile.join(", "));
      }
    }
  }
  /* die längsten Aufgaben (ein Lauf als Beispiel: der mit dem mittleren „bereit") */
  if (!LEISE) for (const st of staende) for (const art of ARTEN) {
    const rs = alle.filter((r) => r.stand === st.name && r.art === art && !r.abbruch).sort((a, b) => a.bereit - b.bereit);
    const r = rs[Math.floor((rs.length - 1) / 2)]; if (!r) continue;
    console.log("\nBeispiel " + st.name + " " + art + " (Lauf " + (r.lauf + 1) + ", bereit " + r.bereit + " ms): LCP " + (r.lcpWas || "–") + "; Dateien KB: " + r.dateien.map(([k, v]) => k + " " + v).join(", "));
    if (r.spur && r.spur.codeCache) console.log("  V8-Code-Cache benutzt (KB): " + (Object.entries(r.spur.codeCache.benutzt).map(([k, v]) => k + " " + v).join(", ") || "–") +
      "; angelegt (ms Hauptfaden): " + (Object.entries(r.spur.codeCache.angelegt).map(([k, v]) => k + " " + v).join(", ") || "–"));
    if (r.sync && r.sync.n) console.log("  synchron geholt: " + r.sync.liste.map((x) => x[0] + " ab " + x[1] + " ms, " + x[2] + " ms (" + x[4] + (x[5] ? "; " + x[5] : "") + ")").join(" · ") +
      (r.sync.sofort.length ? "  · Seite (DMA_TEIL_SOFORT): " + r.sync.sofort.join(" · ") : ""));
    if (r.spur && r.spur.lang) r.spur.lang.forEach((L) => console.log("  Aufgabe ab " + L.ab + " ms, " + L.ms + " ms: " + Object.entries(L.kat).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + " " + v).join(", ") + (L.gross ? "  ← " + L.gross : "")));
    r.loaf.slice(0, 3).forEach((x) => console.log("  Bild ab " + x.ab + " ms, " + x.ms + " ms (Stil+Layout " + x.stilLayout + "): " + x.skripte.map((s) => s[2] + " " + (s[3] || s[1]) + " " + s[4] + (s[5] ? " (erzw. " + s[5] + ")" : "")).join(" | ")));
    if (r.profil) for (const w of ABSCHN) if (r.profil[w]) console.log("  Profil " + w + ": " + r.profil[w].gesamt.slice(0, 8).map(([k, v]) => k + " " + v).join("; "));
  }
  if (staende.length > 1 && !MEHR) {
    const zahl = ARTEN.reduce((s, a) => s + MASSE.filter(([p]) => { const d = gepaart(alle, a, p); return d && d.deutlich; }).length, 0);
    console.log("\n" + (AA ? "A/A-Test – Rauschgrenze (± halbe Breite des 95-%-Bereichs, " + LAEUFE + " Paare): " + ARTEN.map((a) => a + " " + ["bereit", "wissen", "kzKnopf", "fcp"].map((p) => { const d = gepaart(alle, a, p); return p + " ±" + (d ? Math.round((d.ki95[1] - d.ki95[0]) / 2) : "–"); }).join(" ")).join(" · ") + "\n" : "") +
      "„DEUTLICH\" bei " + zahl + " von " + ARTEN.length * MASSE.length + " Maßen – auch Rauschen trifft das manchmal (A/A 17.10.: 4 von 120); es zählt das Maß, das vorher festgelegt war.");
  }
  const bruch = alle.filter((r) => r.abbruch);
  if (bruch.length) console.log("\nABBRÜCHE: " + bruch.length + " – " + bruch.map((r) => r.stand + "/" + r.art + "/" + (r.lauf + 1) + ": " + r.abbruch).join(" · "));
  for (const st of staende) {
    const leer = [...new Set(st.srvA.z.fehlt.concat(st.srvB.z.fehlt))];
    if (leer.length) console.log("\nStand " + st.name + ": Anfragen ins Leere (404, auch beim Aufwärmen): " + leer.join(", "));
    st.fehlt = leer;
  }
  console.log("\nRechnerlast vorher " + lastVor.map((x) => x.toFixed(2)).join(" ") + ", nachher " + lastNach.map((x) => x.toFixed(2)).join(" ") + " (" + os.cpus().length + " Kerne)");
  if (JSON_DATEI) {
    fs.writeFileSync(JSON_DATEI, JSON.stringify({
      werkzeug: "werkzeug/ladezeit-messen.js (Fassung 886)", datum: new Date().toISOString(),
      einstellung: { netz: NETZ, leitung: { mbit: LEITUNG.down * 8 / 1e6, rtt: LEITUNG.rtt, aufbauRtt: AUFBAU }, cpu: CPU, http: H2 ? "h2+tls" : "http/1.1", laeufe: LAEUFE, arten: ARTEN, fenster: FENSTER, spur: SPUR, profil: PROFIL, kontext: FLUECHTIG ? "flüchtig" : "Profil auf der Platte",
        tippNach: TIPP_NACH, aa: AA, swWach: SW_WACH, verschraenkt: staende.length > 1 ? "Lauf 1: A dann B, Lauf 2: B dann A, …" : null,
        supabase: SUPA ? { datei: path.basename(SUPA_PFAD), kbGz: Math.round(SUPA_GZ.length / 1024) } : null },
      umgebung: { chromium: "/opt/pw-browsers/chromium", node: process.version, kerne: os.cpus().length, rechner: (os.cpus()[0] || {}).model || "?", lastVor, lastNach },
      staende: staende.map((s) => ({ name: s.name, wurzel: s.wurzel, fassung: s.fassung, commit: s.commit, fehlt: s.fehlt })),
      zusammenfassung: z, gepaart: staende.length > 1 && !MEHR ? Object.fromEntries(ARTEN.map((a) => [a, Object.fromEntries(MASSE.map(([p]) => [p, gepaart(alle, a, p)]))])) : null,
      /* A/A: halbe Breite des 95-%-Bereichs = Rauschgrenze je Maß (gilt für Vergleiche mit gleich vielen Paaren) */
      rauschgrenze: AA ? Object.fromEntries(ARTEN.map((a) => [a, Object.fromEntries(MASSE.map(([p]) => { const d = gepaart(alle, a, p); return [p, d ? Math.round((d.ki95[1] - d.ki95[0]) / 2) : null]; }))])) : null,
      synchron: sn,
      laeufe: alle,
    }, null, 1));
    console.log("JSON: " + JSON_DATEI);
  }
  process.exit(bruch.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
