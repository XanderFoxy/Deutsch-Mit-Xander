#!/usr/bin/env node
/* =====================================================================
   SONDE 885 — RÜCKKEHR IN DEN RAUM NACH DEM NEULADEN KOMMT AUF DER NEUEN
   FASSUNG AN (S1-Nachtrag; Prüfer, dritte Prüfung von S1)
   ---------------------------------------------------------------------
   XANDER (Funk 263): „sofort im Livestream wie bei HelloTalk" · (Funk
   255): „die schnelle Performance und die Verbindung zu den anderen haben
   oberste Priorität" · (Funk 310/312): „das Maximum rausholen".

   Der Fall: Man ist im Raum und lädt denselben Tab neu (Ziehen zum
   Aktualisieren, ein vom Browser verworfener Tab; Merker
   dma_livechat_zurueck, 30 min). Draußen liegt inzwischen eine neue
   Fassung. Seit S1 kommt die Seite zuerst aus dem Speicher des Helfers;
   die Rückkehr ging dann auf der ALTEN Seite in den Raum, bevor der
   Fassungs-Wächter antwortete, und der zeigte bei „verbindet" nur die
   Blase – die alte Fassung blieb die ganze Sitzung (Prüfer: CPU 1×,
   fassung.json nach 0,25 s: 0 von 3 auf der neuen; vor S1 immer neu).

   LiveChat.betreten wird durch eine FALLE ersetzt (setzt nur „verbindet",
   wie der echte Aufbau; ohne Supabase fiele er sonst sofort auf
   „fehler"). Sie schreibt je Aufruf Seite, Seitenuhr und Uhrzeit mit.
   Server wie GitHub Pages: Bereich /Deutsch-Mit-Xander/, index.html mit
   max-age=600; index.html und fassung.json je D ms.

   TEILE
     R  Rückkehr bei Update (Server Fassung + 1), CPU 1× und 4×, D = 250
        und 800 ms, Neuladen (reload): am Ende die NEUE Fassung, höchstens
        ein Neuladen, betreten genau EINMAL und nur auf der neuen Seite (nie
        auf der alten), keine Blase. Dazu Öffnen derselben Adresse (goto,
        CPU 1×, D = 250; der Helfer reicht die alte index.html aus dem
        HTTP-Speicher des Browsers durch, „schon da“) – seit 886
        (rueckkehrfrist) wie 884 sofort hinein: betreten genau einmal, nie
        ein Neuladen danach, am Ende die alte Fassung mit Blase (oder die
        neue, falls doch gewartet wurde). Dazu eine grobe Zeitgrenze: betreten nach
        höchstens D + 0,9 s (CPU 1×) bzw. D + 1,8 s (CPU 4×) – fängt jedes
        Warten auf eine Frist ab (die feine Messung ist Teil M).
     K  Update schon bekannt: die Seite im Raum hat die Blase schon gezeigt
        (der Wächter prüft beim Sichtbarwerden), dann Neuladen: der Helfer
        weiß es („draussen“) und holt die Seite wie bis 884 aus dem Netz – am
        Ende die neue Fassung OHNE zweites Laden, betreten einmal, die Seite
        ohne Speicher-Marke; hängt fassung.json, wartet die Rückkehr auf
        dieser frischen Seite nicht (< 3 s).
     G  Rückkehr ohne Update (CPU 1× und 4×, D = 250/800): betreten genau
        einmal, kein Neuladen, keine Blase; Zeitgrenze wie R; am Ende alle
        ganzen Stilblätter da (Fassung 886).
     R/Z  dazu (Fassung 886): die vom Helfer ersetzte Seite hat keine ganzen
        Stilblätter eingehängt (sie warten auf seine Entscheidung), die
        neue Seite am Ende alle.
     F  (Nachbesserung 1) fassung.json antwortet mit 500 oder hängt, Update:
        betreten einmal auf der NEUEN Fassung, < 3 s (der Helfer weiß es aus
        der Vorab-Anfrage – wie 884, das die Seite aus dem Netz nahm; vorher
        ging es hier auf der alten Seite hinein). fassung.json hängt, ohne
        Update: hinein ohne zu warten (der Helfer sagt beim Neuladen
        „gleich“), < 3 s. index.html UND fassung.json hängen: hinein nach der
        Frist (6 s ab dem Öffnen, 5,5 … 7,5 s), kein Neuladen.
     T  (Nachbesserung 1, Prüfer) Tipp während des Wartens: Update, Antwort
        nach > 2 s, ein Tipp nach 1,2 s (Klassenzimmer nicht offen) – am Ende
        die neue Fassung, betreten einmal, keine Blase. Zwei Wege: der Helfer
        weiß es (index.html und fassung.json je 2,5 s) und der Wächter
        entscheidet (fassung.json 2,5 s, index.html 4,5 s; dort zählte
        bleiben() den Tipp). CPU 1× und 4×.
     Z  (Fassung 886) Die Antwort des Servers kommt, während die alte Seite aus
        dem Speicher ihre Skripte ausführt (der Server hält index.html, bis
        auf der alten Seite livechat.js läuft; CPU 4× und 1×): am Ende die
        neue Fassung, ein Neuladen, betreten einmal auf der neuen Seite, die
        alte Seite hat keine ganzen Stilblätter eingehängt, die neue alle
        (ob app.js auf der alten noch anlief, wird nur mitgeschrieben).
        Dazu in R und Z: kein Eintrag
        „dma-mess-abbruch“ der vom Helfer ersetzten Seite (messung.js zählte
        ihn als abgebrochenes Laden).
     Y  (Fassung 886, Prüfbericht zu dddf4c7b) Späte Antwort des Servers:
        index.html erst nach 4,9 s, fassung.json hängt. Bis dddf4c7b rief der
        Helfer navigate bis 5 s nach der MELDUNG – auf einem langsamen Telefon
        konnte die 6-s-Frist der Rückkehr (ab dem ÖFFNEN) vor dem Wechsel
        greifen: zweimal betreten. Jetzt navigate nur bis 4,5 s nach dem
        Öffnen, danach sagt der Helfer der Seite „neu“ und ihr Wächter
        entscheidet. Y1: am Ende die neue Fassung, betreten einmal, und die
        neue Seite kam NICHT vom Helfer (Merker dma-wechsel beim Start nicht
        „*“). Y3: dasselbe mit 0,9 s verspäteter Meldung und index.html nach
        5,4 s (bis dddf4c7b zählte die Frist ab der Meldung: navigate bis
        ~5,9 s). Y4: index.html nach 5,5 s – der Helfer wartet jetzt bis zur
        Frist der Seite (6 s ab dem Öffnen) statt 5 s ab der Meldung: am Ende
        die neue Fassung wie bei 884 (bis dddf4c7b: die alte). Y2: dazu ist der Hauptfaden der alten Seite von 4,8 bis 6,3 s
        belegt (wie ein langsames Telefon beim Wechsel): betreten nie zweimal;
        bleibt es bei der alten Fassung, steht die Blase.
        Nachbesserung 2 (Prüfbericht zu 1abc32b2: Y1/Y3 prüften nur einen
        Mechanismus): Y1/Y3/Y4 prüfen das ERGEBNIS – neue Fassung, betreten
        genau einmal und auf der letzten Seite, auf KEINER Seite je eine Blase
        (auch nicht kurz vor dem Wechsel), kein „draussen“ im Seitenspeicher,
        betreten nach höchstens D + 0,9 s (CPU 1×) bzw. D + 1,8 s (CPU 4×)
        (seit rueckkehrfrist als Median der Läufe je Fall, jeder Lauf
        höchstens 1 s darüber – vorher je Lauf, ein Ausreißer 7014 > 6700 ms);
        „lädt nicht mehr der Helfer“ bleibt als eigens benannte Prüfung des
        Mechanismus (in Chromium ohne sichtbare Folge, Absicherung für
        Browser mit anderer Reihenfolge). Neu: Y5 Tipp nach 1,2 s auf dem
        späten Weg (index.html 4,9 s, fassung.json hängt); Y6 fassung.json
        kommt ebenfalls spät statt zu hängen (beide 4,7 / 5,2 / 5,8 s) und
        Y6b/Y6c mit kleinem Versatz (fassung.json kurz vor bzw. kurz nach
        der Antwort an den Helfer – beide Antworten erreichen die gehende
        Seite); Y7 der Helfer ruft navigate noch vor 4,5 s (index.html
        4,3 s), der Hauptfaden der alten Seite ist aber von 4,25 bis 6,3 s
        belegt – über die 6-s-Frist hinaus (nur Chromium: übernimmt er den
        Wechsel vor dem fälligen Zeitgeber, betritt die Rückkehr nie
        zweimal).
     W  (Nachbesserung 1) Merker dma-wechsel: „<Fassung> <Zeit>“ und „* <Zeit>
        <alte Fassung>“ (vom Helfer geladen) gelten nur jünger als 20 s und
        nur für eine ANDERE Fassung als „*“ nennt; Neuladen, index.html UND
        fassung.json hängen (seit rueckkehrfrist: niemand sonst antwortet –
        beim Öffnen zählt jetzt auch das „gleich“ des Helfers): frisch < 3 s,
        sonst erst nach der Frist (6 s).
     N  (Nachbesserung 1) Antwort „neu“, aber das Neuladen scheitert (die
        Sonde bricht es mit window.stop ab, der Helfer bekommt keine Meldung):
        nach 15 s doch hinein, genau einmal, auf dieser Seite.
     O  Ohne Helfer, Neuladen (der Browser fragt beim Server nach, wie bis
        884), fassung.json hängt: betreten wartet NICHT (< 3 s) – die Seite
        ist frisch. Ohne Helfer, gewöhnliches Öffnen bei Update: index.html
        kommt aus dem Speicher des Browsers (max-age=600, alt) → seit 886
        (rueckkehrfrist) sofort hinein wie 884, genau einmal, danach die
        Blase (884: betreten auf der alten, dann Neuladen mitten im
        Verbinden und noch einmal betreten; bis 5aaec640: erst gewartet).
     B  (Fassung 886, rueckkehrfrist; Prüfbericht zu 5aaec640) Fall B –
        Öffnen/Zurück OHNE Neuladen: gewartet wird nur auf einer Seite aus
        dem Speicher des Helfers (Marke). B1 Öffnen ohne Update, index.html
        und fassung.json je 2 s, CPU 1× und 4×; B1z dasselbe mit Zurück
        (history.back ohne bfcache): betreten höchstens 150 ms nach 884
        (mit BEZUG884=<baum> verschränkt gegen 884, Median; sonst gegen eine
        feste Grenze aus der Messung: 884 hier 0,26 s bei CPU 1×, 1,07 s
        bei CPU 4×, je + 150 ms). B2 Öffnen mit Update (alte index.html aus
        dem HTTP-Speicher): ebenso schnell, betreten genau einmal, danach
        kein Neuladen. B3 der Browser hat index.html nicht mehr frisch
        (no-cache) – die Seite kommt mit Marke: B3a ohne Update, B3b mit
        Update (am Ende die neue Fassung, einmal), je D = 2 s: betreten nach
        höchstens D + 0,9 s; B3c index.html 0,25 s, fassung.json 2 s: das
        „gleich“ des Helfers zählt auch beim Öffnen (betreten < 1 s; bis
        5aaec640 erst nach fassung.json). B4 Öffnen mit Update, fassung.json
        antwortet, bevor die Rückkehr hineingeht (CPU 1× D = 50, CPU 4×
        D = 250): der Wächter lädt neu, die alte Seite geht NICHT mehr
        hinein – betreten genau einmal, auf der letzten Seite.
     S  Die gespeicherte Seite trägt die Marke data-dma-speicher (daran
        erkennt die Rückkehr, dass sie aus dem Speicher kam), die frisch
        geholte nicht. Stempel ↔ Inhalt (sw.js): liefert der Server unter einem
        Datei-Stempel einen anderen Inhalt (eine alte Seite holt nach einem
        Update eine Datei, die nicht im Speicher liegt), geht er an die
        Seite, aber NICHT in den Speicher des Helfers; der richtige Inhalt
        wird abgelegt und danach aus dem Speicher geliefert; Ordner-Stempel
        (szenen/) und ?v=<Fassung> werden wie bisher abgelegt. Dazu
        (Nachbesserung 1, Prüfer): index.html schreibt „draussen“ in genau
        den Seitenspeicher, den sw.js als SEITE führt (Name steht in
        index.html fest).
     H  (nur mit GEGEN und NUR=…H…) Helfer füllt seinen Speicher: zweites
        Öffnen, jede gestempelte Datei ein Fehltreffer (wie nach einem
        Update), CPU 4× (die Bremse gilt nur für die Seite, nicht für den
        Helfer): load A/B gepaart; B hat in keinem Lauf weniger Einträge im
        Speicher als A im besten Lauf (A streut um eins, das Ablegen läuft
        nach load weiter – nach einem roten Lauf von „gleich viele“ so
        gefasst, siehe SPIELSYSTEM.md).
     M  Messung (nur mit GEGEN=<alter Stand>): Neuladen → betreten ab dem
        Neuladen (Uhrzeit), verschränkt A B / B A, A = GEGEN, B = WURZEL,
        mit und ohne Update (Standard: Update CPU 1× D = 250, CPU 4× D = 250
        und 800; ohne Update CPU 1× D = 250, CPU 4× D = 800; MFAELLE=…);
        dazu die Fassung am Ende. Median, B − A gepaart.

   Schalter:
     WURZEL=<ordner>   Stand, der geprüft wird (Standard: dieser Baum)
     BEZUG884=<ordner> Stand 884 (6b724580) für Teil B: verschränkt, Median
     BNUR=B1,B4…       in Teil B nur diese Fälle
     GEGEN=<ordner>    alter Stand für Teil M
     N=n               Läufe je Fall in R/G (Standard 2)
     PAARE=n           Paare je Messfall in M (Standard 6)
     NUR=RKGFTZYWNOBSHM nur diese Teile (Standard RKGFTZYWNOBS, mit GEGEN dazu M)
     JSON=<datei>      Ergebnisse (Läufe, Messung) als JSON, laufend
   Aufruf:  node werkzeug/pruefe-885-rueckkehr.js
   Gegenprobe: WURZEL=<ordner mit altem Stand> node …  (c30a68f7: R rot;
   6b724580, vor S1: R grün; 864324e7, vor Nachbesserung 1: T rot;
   dddf4c7b: Y-Mechanismus und Y4 rot; 1abc32b2: Y6b/Y6c Blase auf der
   gehenden Seite rot; 5aaec640: B1/B1z/B2 und B3c rot – die Rückkehr wartet
   dort auf fassung.json)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const GEGEN = process.env.GEGEN ? path.resolve(process.env.GEGEN) : null;
const N = Math.max(1, Number(process.env.N || 2));
const PAARE = Math.max(1, Number(process.env.PAARE || 6));
const NUR = process.env.NUR || "RKGFTZYWNOBS" + (GEGEN ? "M" : "");
const BEZUG884 = process.env.BEZUG884 ? path.resolve(process.env.BEZUG884) : null;
const bNur = (was) => !process.env.BNUR || process.env.BNUR.split(",").includes(was);   /* Teil B: BNUR=B1,B4 … nur diese Fälle */
const JSON_AUS = process.env.JSON || "";
const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".mp3": "audio/mpeg", ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json" };
const PRE = "/Deutsch-Mit-Xander";
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const info = (t) => console.log("       " + t);
const abschnitt = (k, t) => console.log("\n" + k + "  " + t);
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const grund = (w) => (fs.readFileSync(path.join(w, "index.html"), "utf8").match(/window\.DMA_VERSION = "(\d+)"/) || [])[1];
const med = (a) => { const s = a.filter((x) => typeof x === "number" && isFinite(x)).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
const ERG = { wurzel: WURZEL, gegen: GEGEN, laeufe: [], messung: [] };
const schreiben = () => { if (JSON_AUS) try { fs.writeFileSync(JSON_AUS, JSON.stringify(ERG, null, 1)); } catch (e) {} };

/* ---------- Server (je Stand einer, eigene Herkunft = eigener Helfer) ---------- */
function serverBauen(wurzel) {
  const S = { seite: "", stau: 0, fjStau: 0, fjArt: "", anders: {}, zaehler: {}, zwang: null, ohneSpeicher: false };
  const srv = http.createServer((q, a) => {
    const i = q.url.indexOf("?");
    let p = decodeURIComponent(i < 0 ? q.url : q.url.slice(0, i));
    if (!p.startsWith(PRE + "/")) { a.writeHead(404); return a.end(); }
    p = p.slice(PRE.length); if (p === "/") p = "/index.html";
    S.zaehler[p] = (S.zaehler[p] || 0) + 1;
    /* Teil Z (Fassung 886): die alte Seite meldet „meine Skripte laufen“ (livechat.js) – erst dann geht die gehaltene
       index.html hinaus (so kommt die Antwort an den Helfer genau dann, wenn die alte Seite ihre Skripte ausführt) */
    if (p === "/__interaktiv") {   /* Name von früher: das Signal kommt jetzt, wenn livechat.js läuft */ if (S.zwang && S.zwang.los) S.zwang.los(); a.writeHead(204); return a.end(); }
    if (p === "/fassung.json") {
      const kopf = { "Content-Type": "application/json", "Cache-Control": "max-age=600" };
      if (S.fjArt === "haengt") return;   /* nie eine Antwort */
      const los = () => {
        if (a.destroyed) return;
        if (S.fjArt === "500") { a.writeHead(500, kopf); return a.end("{}"); }
        a.writeHead(200, kopf); a.end(JSON.stringify({ fassung: S.seite || grund(wurzel) }));
      };
      return S.fjStau ? setTimeout(los, S.fjStau) : los();
    }
    const f = path.join(wurzel, p);
    if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    let body = fs.readFileSync(f);
    const kopf = { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream" };
    if (p === "/index.html") {
      let t = String(body);
      if (S.seite) t = t.replace(/window\.DMA_VERSION = "[^"]*";/, 'window.DMA_VERSION = "' + S.seite + '";');
      body = Buffer.from(t); kopf["Cache-Control"] = S.ohneSpeicher ? "no-cache" : "max-age=600";   /* Teil B3: der Browser hat sie nicht mehr frisch */
      if (S.zwang && !S.zwang.belegt) {
        /* genau die erste index.html nach dem Scharfschalten: bis zum Signal (höchstens 2 s), dann gleich */
        const z = S.zwang; z.belegt = true;
        const raus = () => { if (z.raus) return; z.raus = Date.now(); if (!a.destroyed) { a.writeHead(200, kopf); a.end(body); } };
        z.los = raus; setTimeout(raus, 2000);
        return;
      }
      if (S.stau) return setTimeout(() => { if (!a.destroyed) { a.writeHead(200, kopf); a.end(body); } }, S.stau);
    }
    if (S.anders[p]) body = Buffer.concat([body, Buffer.from("\n/* anders: neuer Inhalt unter altem Stempel */\n")]);
    if (p === "/sw.js") kopf["Cache-Control"] = "no-cache";
    a.writeHead(200, kopf); a.end(body);
  }).listen(0, "127.0.0.1");
  return new Promise((r) => srv.on("listening", () => r({ S, srv, hier: "http://127.0.0.1:" + srv.address().port + PRE, wurzel })));
}

/* Falle für LiveChat.betreten + Rückkehr-Merker (nur, wenn __rueck gesetzt ist) */
function falle(rueck) {
  if (window.top !== window) return;
  try {
    localStorage.setItem("dma_tour_seen", "1");
    const n = Number(sessionStorage.getItem("__s") || 0) + 1; sessionStorage.setItem("__s", String(n));
    const l = JSON.parse(sessionStorage.getItem("__a") || "[]"); l.push(location.search); sessionStorage.setItem("__a", JSON.stringify(l));
    if (rueck && sessionStorage.getItem("__rueck") === "1")
      sessionStorage.setItem("dma_livechat_zurueck", JSON.stringify({ raum: "pruefraum885", name: "Pruef", mitBild: false, zeit: Date.now() }));
    /* Teil W: Merker dma-wechsel vorgeben (einmal, beim nächsten Start) */
    const wv = sessionStorage.getItem("__wechselVor");
    if (wv) { sessionStorage.removeItem("__wechselVor"); const [art, alter, f] = wv.split("|"); sessionStorage.setItem("dma-wechsel", art === "*" ? "* " + (Date.now() - Number(alter)) + " " + f : f + " " + (Date.now() - Number(alter))); }
    /* Teil N: die Seite meldet dem Helfer nichts, und das Neuladen des Wächters wird abgebrochen (window.stop) – „bleibt die Seite wider Erwarten“ */
    if (sessionStorage.getItem("__ohneNeuladen") === "1") {
      try { ServiceWorker.prototype.postMessage = function () { throw new Error("Sonde: keine Meldung"); }; } catch (e) {}
      const si = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, w) {
        if (k === "dma-wechsel" && !/^\*/.test(String(w))) {
          const l = JSON.parse(sessionStorage.getItem("__stopp") || "[]"); l.push(Math.round(performance.now())); si.call(this, "__stopp", JSON.stringify(l));
          queueMicrotask(() => { try { window.stop(); } catch (e) {} });
        }
        return si.apply(this, arguments);
      };
    }
    /* Teil Z (Fassung 886): die erste Seite nach dem Neuladen meldet dem Server, dass ihre Skripte laufen (livechat.js setzt
       window.LiveChat – das kommt in der Reihe vor app.js) */
    const zwang = n === 1 && sessionStorage.getItem("__zwang") === "1";
    const melden = () => { try { fetch(location.pathname.replace(/[^/]*$/, "") + "__interaktiv?t=" + Date.now()).catch(() => {}); } catch (e) {} };
    /* Fassung 886: auf welcher Seite app.js gelaufen ist (window.DMA_TEILE setzt app.js gleich am Anfang) */
    let dt;
    Object.defineProperty(window, "DMA_TEILE", { configurable: true, get: () => dt, set: (v) => { dt = v;
      const l = JSON.parse(sessionStorage.getItem("__app") || "[]"); l.push({ seite: n, t: Math.round(performance.now()) }); sessionStorage.setItem("__app", JSON.stringify(l)); } });
    /* Fassung 886: wie viele ganze Stilblätter die Seite eingehängt hatte, als sie ging */
    addEventListener("pagehide", () => { const l = JSON.parse(sessionStorage.getItem("__voll") || "[]"); l.push({ seite: n, voll: document.querySelectorAll("link[data-dma-voll-da]").length }); sessionStorage.setItem("__voll", JSON.stringify(l)); });
    /* Fassung 886 (rueckkehrfrist, Nachbesserung 1): je Seite – Marke, Antworten des Helfers, wann das Start-Tor aufging, wann
       der Wächter neu lud (dmaFassungGeht), DOMContentLoaded, und wie das Tor stand, als die Seite ging */
    { const mk = { seite: n, marke: null, helfer: [], torAuf: [], geht: null, dcl: null, torWeg: null, weg: null };
      const sp = () => { try { const l = JSON.parse(sessionStorage.getItem("__mk") || "[]").filter((x) => x.seite !== n); l.push(mk); sessionStorage.setItem("__mk", JSON.stringify(l)); } catch (e) {} };
      const jetzt = () => Math.round(performance.now());
      document.addEventListener("DOMContentLoaded", () => { mk.dcl = jetzt(); mk.marke = document.documentElement.hasAttribute("data-dma-speicher"); sp(); });
      try { navigator.serviceWorker.addEventListener("message", (e) => { const w = e.data && e.data.dmaHelfer; if (w) { mk.helfer.push(w + "@" + jetzt()); sp(); } }); } catch (e) {}
      let st, ge;
      Object.defineProperty(window, "dmaStartTor", { configurable: true, get: () => st, set: (v) => { st = v; if (v && v.then) v.then(() => { mk.torAuf.push(jetzt()); sp(); }); } });
      Object.defineProperty(window, "dmaFassungGeht", { configurable: true, get: () => ge, set: (v) => { ge = v; mk.geht = jetzt(); sp(); } });
      addEventListener("pagehide", () => { mk.weg = jetzt(); mk.marke = document.documentElement.hasAttribute("data-dma-speicher"); mk.torWeg = st ? (st.offen ? "offen" : "zu") : "kein"; sp(); }); }
    /* Teil Y (Fassung 886): die Meldung „Rückkehr wartet“ kommt um __meldungSpaet ms verspätet beim Helfer an (wie ein langsamer
       Start der Seite oder ein langsam wachender Helfer) */
    const mSp = Number(sessionStorage.getItem("__meldungSpaet") || 0);
    if (mSp) try { const pm = ServiceWorker.prototype.postMessage; ServiceWorker.prototype.postMessage = function (d) {
      const w = this, a = arguments; if (d && d.rueckkehr && d.rueckkehr !== "halt") { setTimeout(() => pm.apply(w, a), mSp); return; } return pm.apply(this, a); }; } catch (e) {}
    /* Teil Y (Fassung 886): welcher Merker dma-wechsel beim Start lag („*“ = der Helfer hat diese Seite geladen) */
    { const l = JSON.parse(sessionStorage.getItem("__wm") || "[]"); l.push({ seite: n, w: sessionStorage.getItem("dma-wechsel") }); sessionStorage.setItem("__wm", JSON.stringify(l)); }
    /* Nachbesserung 2 (Prüfer): jede Blase auf jeder Seite mitschreiben – auch auf einer Seite, die gleich geht */
    try { const mo = new MutationObserver(() => { const bb = document.getElementById("dmaNeueFassung"); if (bb && !bb.__gesehen) { bb.__gesehen = 1;
      const l = JSON.parse(sessionStorage.getItem("__bl") || "[]"); l.push({ seite: n, t: Math.round(performance.now()), f: String(window.DMA_VERSION) }); sessionStorage.setItem("__bl", JSON.stringify(l)); } });
      mo.observe(document, { childList: true, subtree: true }); } catch (e) {}
    /* Teil T: Uhrzeit der ersten Berührung */
    addEventListener("pointerdown", () => { if (!sessionStorage.getItem("__tipp")) sessionStorage.setItem("__tipp", String(Math.round(performance.now()))); }, { capture: true });
    let lc;
    Object.defineProperty(window, "LiveChat", { configurable: true, get: () => lc, set: (v) => {
      lc = v;
      if (zwang) melden();
      try {
        v.betreten = function () {
          const b = JSON.parse(sessionStorage.getItem("__b") || "[]");
          b.push({ seite: n, t: Math.round(performance.now()), uhr: Date.now(), f: String(window.DMA_VERSION), abbruch: localStorage.getItem("dma-mess-abbruch") });
          sessionStorage.setItem("__b", JSON.stringify(b));
          try { v.pruefLageSetzen("verbindet"); } catch (e) {}
          return new Promise(() => {});
        };
      } catch (e) {}
    } });
  } catch (e) {}
}

/* Ein Lauf: anmelden (Helfer), Seite V speichern, „im Raum", dann draußen V1 (oder V), Netz D, Neuladen */
async function lauf(br, sv, o) {
  const { S, hier } = sv;
  const G = Number(grund(sv.wurzel));
  const V = String(G + 10 * (++lauf.k)), V1 = o.update ? String(Number(V) + 1) : V;
  S.seite = V; S.stau = 0; S.fjStau = 0; S.fjArt = ""; S.ohneSpeicher = Boolean(o.netz);
  const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(falle, true);
  const pg = await ctx.newPage();
  const cdp = await ctx.newCDPSession(pg);
  const q = o.helfer === false ? "" : "?mit-sw";
  await pg.goto(hier + "/index.html" + q, { waitUntil: "load" });
  if (o.helfer !== false) await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
  await pg.goto(hier + "/index.html" + q, { waitUntil: "load" });
  await schlaf(1500);
  const gesteuert = await pg.evaluate(() => Boolean(navigator.serviceWorker && navigator.serviceWorker.controller));
  await pg.evaluate((o) => { sessionStorage.setItem("__rueck", "1"); sessionStorage.setItem("__s", "0"); sessionStorage.setItem("__a", "[]"); sessionStorage.setItem("__b", "[]");
    sessionStorage.removeItem("__tipp"); sessionStorage.removeItem("__stopp"); sessionStorage.setItem("__app", "[]"); sessionStorage.setItem("__voll", "[]"); sessionStorage.setItem("__wm", "[]"); sessionStorage.setItem("__bl", "[]"); sessionStorage.setItem("__mk", "[]");
    if (o.zwang) sessionStorage.setItem("__zwang", "1"); else sessionStorage.removeItem("__zwang");
    if (o.wechselVor) sessionStorage.setItem("__wechselVor", o.wechselVor);
    if (o.meldungSpaet) sessionStorage.setItem("__meldungSpaet", String(o.meldungSpaet)); else sessionStorage.removeItem("__meldungSpaet");
    if (o.ohneNeuladen) sessionStorage.setItem("__ohneNeuladen", "1"); }, { wechselVor: (o.wechselVor || "").replace("{V}", V), ohneNeuladen: Boolean(o.ohneNeuladen), zwang: Boolean(o.zwang), meldungSpaet: o.meldungSpaet || 0 });
  let blaseVorher = null;
  const e0 = {};
  if (o.bekannt) {
    /* die Seite im Raum hat die neue Fassung schon gesehen: der Wächter prüft beim Sichtbarwerden → Blase */
    S.seite = V1;
    await pg.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
    blaseVorher = await pg.waitForFunction(() => document.getElementById("dmaNeueFassung"), null, { timeout: 5000 }).then(() => true, () => false);
    await schlaf(400);
  }
  S.seite = V1; S.stau = o.D; S.fjStau = o.fjD != null ? o.fjD : o.D; S.fjArt = o.fjArt || ""; S.zwang = o.zwang ? {} : null;
  /* Teil B4m (rueckkehrfrist, Nachbesserung 1): die Seite soll sicher aus dem Speicher des Helfers kommen (Marke), während die
     Vorab-Antwort die ALTE index.html aus dem HTTP-Speicher bringt (→ der Helfer sagt „gleich“). Dazu bekommt die abgelegte
     Seite ein Server-Datum in der Zukunft: dann ist die Kopie des Browsers „älter“, und der Helfer liefert seine (frischWennDa) */
  if (o.marke) e0.marke = await pg.evaluate(async () => {
    try { const k = await caches.open("dma-seite-1"), u = new URL("seite", navigator.serviceWorker.controller.scriptURL).href, a = await k.match(u);
      if (!a) return false;
      const h = new Headers(a.headers); h.set("date", new Date(Date.now() + 3600000).toUTCString());
      await k.put(u, new Response(await a.text(), { status: 200, statusText: "OK", headers: h })); return true; } catch (x) { return "fehler " + x.message; }
  });
  if (o.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: o.cpu });
  /* Teil B (rueckkehrfrist): Zurück – erst weg (about:blank), die Uhr läuft ab history.back (Browser ohne bfcache) */
  if (o.art === "zurueck") await pg.goto("about:blank").catch(() => {});
  const t0 = Date.now();
  if (o.art === "goto") await pg.goto(hier + "/index.html" + q, { waitUntil: "commit" }).catch(() => {});
  else if (o.art === "zurueck") await pg.goBack({ waitUntil: "commit" }).catch(() => {});
  else await pg.reload({ waitUntil: "commit" }).catch(() => {});
  /* Teil T: ein Tipp, bevor die Antwort da ist (Prüfer: nach 1,2 s; das Klassenzimmer ist dabei nicht offen) */
  if (o.tipp != null) { await schlaf(Math.max(0, o.tipp - (Date.now() - t0))); await pg.touchscreen.tap(200, 500).catch(() => {}); }
  /* Teil Y: Hauptfaden der Seite belegt [ab, Dauer] ms nach dem Neuladen (wie ein langsames Telefon, das gerade rechnet) */
  if (o.belegt) {
    await schlaf(Math.max(0, o.belegt[0] - (Date.now() - t0)));
    await cdp.send("Runtime.evaluate", { expression: "(() => { const e = performance.now() + " + o.belegt[1] + "; while (performance.now() < e) {} return 1; })()" }).catch(() => {});
  }
  const bis = Date.now() + (o.warten || 9000);
  let l = null;
  while (Date.now() < bis) {
    await schlaf(250);
    l = await pg.evaluate(() => ({ b: JSON.parse(sessionStorage.getItem("__b") || "[]"), s: Number(sessionStorage.getItem("__s") || 0) })).catch(() => null);
    if (l && l.b.length && Date.now() - l.b[l.b.length - 1].uhr > (o.ruhe || 2500)) break;
  }
  const e = await pg.evaluate(async () => ({ f: String(window.DMA_VERSION), seiten: Number(sessionStorage.getItem("__s") || 0),
    bl: JSON.parse(sessionStorage.getItem("__bl") || "[]"),
    draussen: await (async () => { try { const k = await caches.open("dma-seite-1"); const c = navigator.serviceWorker && navigator.serviceWorker.controller;
      const a = (c && await k.match(new URL("draussen", c.scriptURL).href)) || await k.match("draussen"); return a ? await a.text() : ""; } catch (x) { return "?"; } })(),
    marke: document.documentElement.hasAttribute("data-dma-speicher"),
    adressen: JSON.parse(sessionStorage.getItem("__a") || "[]"), betreten: JSON.parse(sessionStorage.getItem("__b") || "[]"),
    tipp: sessionStorage.getItem("__tipp"), wm: JSON.parse(sessionStorage.getItem("__wm") || "[]"), mk: JSON.parse(sessionStorage.getItem("__mk") || "[]"), stopp: JSON.parse(sessionStorage.getItem("__stopp") || "[]"), app: JSON.parse(sessionStorage.getItem("__app") || "[]"),
    vollWeg: JSON.parse(sessionStorage.getItem("__voll") || "[]"), voll: document.querySelectorAll("link[data-dma-voll-da]").length, vollAlle: document.querySelectorAll("link[data-dma-voll]").length,
    lage: window.LiveChat && window.LiveChat.lage ? window.LiveChat.lage().lage : "?",
    blase: (document.getElementById("dmaNeueFassung") || {}).textContent || "" })).catch((x) => ({ fehler: x.message.split("\n")[0] }));
  await ctx.close();
  S.ohneSpeicher = false;
  e.zwangRaus = S.zwang && S.zwang.raus ? S.zwang.raus - t0 : null; S.zwang = null;
  e.V = V; e.V1 = V1; e.gesteuert = gesteuert; e.t0 = t0; e.blaseVorher = blaseVorher; e.markeErzwungen = e0.marke;
  e.abNeuladen = e.betreten && e.betreten.length ? e.betreten[0].uhr - t0 : null;
  ERG.laeufe.push(Object.assign({ teil: o.teil, wurzel: sv.wurzel }, o, e)); schreiben();
  return e;
}
lauf.k = 0;
/* Teil B ohne BEZUG884: 884 (6b724580) gemessen, Öffnen ohne Update, D = 2 s, Median (CPU 1×: 260 ms aus 6 Paaren; CPU 4×: 1108
   aus 6 und 1035 aus 12 Paaren → 1070; SPIELSYSTEM.md „Frist (rueckkehrfrist)“) */
const FEST884 = { 1: 260, 4: 1070 };
/* grobe Zeitgrenze für betreten ab dem Neuladen (Nachbesserung 1) */
const grenze = (fa) => fa.D + (fa.cpu > 1 ? 1800 : 900);
const zeile = (e) => "Fassung " + e.V + "→" + e.V1 + " am Ende " + e.f + ", Seiten " + e.seiten + ", betreten " + JSON.stringify((e.betreten || []).map((b) => b.seite + ":" + b.t + "ms/" + b.f))
  + ", ab Neuladen " + e.abNeuladen + " ms, Blase " + JSON.stringify(e.blase) + (e.gesteuert ? "" : ", OHNE Helfer") + (e.marke ? ", aus dem Speicher" : ", frisch")
  + (e.blaseVorher != null ? ", Blase vorher " + e.blaseVorher : "") + (e.bl && e.bl.length ? ", Blasen " + JSON.stringify(e.bl) : "") + (e.draussen ? ", draussen " + e.draussen : "");

(async () => {
  console.log("SONDE 885 — Rückkehr nach dem Neuladen   WURZEL " + WURZEL + " (Fassung " + grund(WURZEL) + ")" + (GEGEN ? "   GEGEN " + GEGEN : ""));
  /* rueckkehrfrist: ohne bfcache (nur für Zurück in Teil B von Belang – eine Seite mit offener Echtzeit-Leitung kommt meist nicht hinein) */
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--no-proxy-server", "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1", "--disable-features=BackForwardCache"] });
  const sv = await serverBauen(WURZEL);

  if (NUR.includes("R")) {
    abschnitt("R", "Rückkehr bei Update: am Ende die neue Fassung, betreten nur auf der neuen Seite");
    const faelle = [{ cpu: 1, D: 250 }, { cpu: 1, D: 800 }, { cpu: 4, D: 250 }, { cpu: 4, D: 800 }, { cpu: 1, D: 250, art: "goto" }];
    for (const fa of faelle) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, Object.assign({ teil: "R", update: true, art: "reload" }, fa));
      const b = e.betreten || [];
      if (fa.art === "goto") {
        /* 886 (rueckkehrfrist): Öffnen – die alte index.html aus dem HTTP-Speicher geht wie 884 sofort hinein, danach die Blase
           (884 lud mitten im Verbinden neu und ging ein zweites Mal hinein; bis 5aaec640 wartete die Seite auf fassung.json) */
        const gut = b.length === 1 && b[0].seite === e.seiten && e.seiten <= 2 && e.gesteuert
          && ((e.f === e.V1 && b[0].f === e.V1 && !e.blase) || (e.f === e.V && b[0].f === e.V && /Neue Fassung/.test(e.blase)));
        sage(gut, "R CPU " + fa.cpu + "× D=" + fa.D + " goto Lauf " + (n + 1) + ": betreten genau einmal, kein Neuladen danach (alte Fassung mit Blase oder die neue)", zeile(e));
      } else {
      /* höchstens ein Neuladen (aus dem Speicher: die alte Seite, dann die neue; frisch aus dem Netz: gleich die neue) */
      const gut = e.f === e.V1 && e.seiten <= 2 && b.length === 1 && b[0].seite === e.seiten && b[0].f === e.V1 && !e.blase && e.gesteuert;
      sage(gut, "R CPU " + fa.cpu + "× D=" + fa.D + " " + (fa.art || "reload") + " Lauf " + (n + 1) + ": neue Fassung, höchstens ein Neuladen, betreten einmal und nur auf der neuen Seite", zeile(e));
      }
      /* Nachbesserung 1: grobe Zeitgrenze (884 brauchte hier höchstens ~D + 0,3 s bei CPU 1×, ~D + 0,9 s bei CPU 4×) –
         fängt jedes Warten auf eine Frist (6 s, 15 s) ab; die feine Messung ist Teil M */
      sage(e.abNeuladen != null && e.abNeuladen <= grenze(fa), "R CPU " + fa.cpu + "× D=" + fa.D + " " + (fa.art || "reload") + " Lauf " + (n + 1) + ": betreten nach höchstens " + grenze(fa) + " ms", e.abNeuladen + " ms");
      /* Fassung 886: hat der Helfer die alte Seite vor DOMContentLoaded ersetzt, schrieb ihr pagehide „dma-mess-abbruch“
         (messung.js zählte das als abgebrochenes Laden) – die neue Seite räumt diesen Eintrag weg */
      const ab = b.length ? b[0].abbruch : null;
      sage(!ab || JSON.parse(ab).f !== e.V, "R CPU " + fa.cpu + "× D=" + fa.D + " " + (fa.art || "reload") + " Lauf " + (n + 1) + ": kein falscher Abbruch-Eintrag der ersetzten Seite (messung.js)", "dma-mess-abbruch " + (ab || "–"));
      /* Fassung 886: solange der Helfer entscheidet, hängt die alte Seite die ganzen Stilblätter (und spiel.js) nicht ein – ihr
         Lesen hielt den Wechsel auf die neue Seite bis ~0,25 s auf (CPU 4×); die neue Seite hat sie am Ende alle */
      const alt = (e.vollWeg || []).find((x) => x.seite === 1);
      if (e.seiten === 2 && (fa.art || "reload") === "reload" && alt) sage(alt.voll === 0, "R CPU " + fa.cpu + "× D=" + fa.D + " Lauf " + (n + 1) + ": die ersetzte Seite hängte keine ganzen Stilblätter ein", "eingehängt " + alt.voll);
      sage(e.voll > 0 && e.voll === e.vollAlle, "R CPU " + fa.cpu + "× D=" + fa.D + " " + (fa.art || "reload") + " Lauf " + (n + 1) + ": am Ende alle ganzen Stilblätter da", e.voll + " von " + e.vollAlle);
    }
  }

  if (NUR.includes("K")) {
    abschnitt("K", "Update schon bekannt (Blase vor dem Neuladen): die Seite kommt wie bis 884 aus dem Netz, kein zweites Laden");
    for (const fa of [{ cpu: 1, D: 250 }, { cpu: 4, D: 250 }]) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, Object.assign({ teil: "K", update: true, bekannt: true, art: "reload" }, fa));
      const b = e.betreten || [];
      sage(e.blaseVorher === true && e.f === e.V1 && e.seiten === 1 && b.length === 1 && b[0].f === e.V1 && !e.blase && !e.marke,
        "K CPU " + fa.cpu + "× D=" + fa.D + " Lauf " + (n + 1) + ": neue Fassung frisch aus dem Netz, ein Laden, betreten einmal", zeile(e));
    }
    /* frisch aus dem Netz wartet die Rückkehr nicht auf fassung.json (die hängt hier ganz) */
    const e = await lauf(br, sv, { teil: "K", update: true, bekannt: true, art: "reload", cpu: 1, D: 250, fjArt: "haengt", warten: 8000, ruhe: 1500 });
    const b = e.betreten || [];
    sage(e.f === e.V1 && e.seiten === 1 && b.length === 1 && b[0].t < 3000 && !e.marke, "K frisch aus dem Netz, fassung.json hängt: betreten wartet nicht (< 3 s)", zeile(e));
  }

  if (NUR.includes("G")) {
    abschnitt("G", "Rückkehr ohne Update: betreten einmal, kein Neuladen");
    for (const fa of [{ cpu: 1, D: 250 }, { cpu: 4, D: 800 }]) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, Object.assign({ teil: "G", update: false, art: "reload" }, fa));
      const b = e.betreten || [];
      sage(e.f === e.V && e.seiten === 1 && b.length === 1 && !e.blase && e.gesteuert, "G CPU " + fa.cpu + "× D=" + fa.D + " Lauf " + (n + 1) + ": betreten einmal, kein Neuladen, keine Blase", zeile(e));
      sage(e.voll > 0 && e.voll === e.vollAlle, "G CPU " + fa.cpu + "× D=" + fa.D + " Lauf " + (n + 1) + ": die ganzen Stilblätter sind da (nach der Antwort des Helfers)", e.voll + " von " + e.vollAlle);
      sage(e.abNeuladen != null && e.abNeuladen <= grenze(fa), "G CPU " + fa.cpu + "× D=" + fa.D + " Lauf " + (n + 1) + ": betreten nach höchstens " + grenze(fa) + " ms", e.abNeuladen + " ms");
    }
  }

  if (NUR.includes("F")) {
    abschnitt("F", "fassung.json mit Fehler oder hängend (Nachbesserung 1: der Helfer weiß beim Neuladen, welche Fassung der Server hat)");
    {
      /* bis zur Nachbesserung: hinein auf der ALTEN Seite, kein Neuladen (der Wächter wusste nichts). Jetzt wie 884: die neue */
      const e = await lauf(br, sv, { teil: "F", update: true, art: "reload", cpu: 1, D: 250, fjD: 0, fjArt: "500" });
      const b = e.betreten || [];
      sage(e.f === e.V1 && e.seiten <= 2 && b.length === 1 && b[0].f === e.V1 && b[0].seite === e.seiten && e.abNeuladen < 3000 && e.gesteuert,
        "F fassung.json 500, Update: betreten einmal auf der NEUEN Fassung (< 3 s) – wie 884", zeile(e));
    }
    {
      const e = await lauf(br, sv, { teil: "F", update: true, art: "reload", cpu: 1, D: 250, fjArt: "haengt", warten: 8000, ruhe: 1500 });
      const b = e.betreten || [];
      sage(e.f === e.V1 && e.seiten <= 2 && b.length === 1 && b[0].f === e.V1 && e.abNeuladen < 3000 && e.gesteuert,
        "F fassung.json hängt, Update: betreten einmal auf der NEUEN Fassung (< 3 s)", zeile(e));
    }
    {
      /* ohne Update: der Helfer hat beim Neuladen dieselbe Fassung vom Server – nicht auf fassung.json warten (884: sofort) */
      const e = await lauf(br, sv, { teil: "F", update: false, art: "reload", cpu: 1, D: 250, fjArt: "haengt", warten: 8000, ruhe: 1500 });
      const b = e.betreten || [];
      sage(e.seiten === 1 && b.length === 1 && e.abNeuladen < 3000 && e.gesteuert, "F fassung.json hängt, ohne Update: hinein ohne auf fassung.json zu warten (< 3 s), kein Neuladen", zeile(e));
    }
    {
      /* index.html UND fassung.json hängen: niemand weiß etwas – hinein nach der Frist (6 s ab dem Öffnen), kein Neuladen */
      const e = await lauf(br, sv, { teil: "F", update: true, art: "reload", cpu: 1, D: 30000, fjArt: "haengt", warten: 11000, ruhe: 1500 });
      const b = e.betreten || [];
      sage(e.seiten === 1 && b.length === 1 && b[0].t >= 5500 && b[0].t <= 7500 && e.gesteuert, "F index.html und fassung.json hängen: hinein nach der Frist (6 s ab dem Öffnen), kein Neuladen", zeile(e));
    }
  }

  if (NUR.includes("T")) {
    /* Prüfer (Nachbesserung 1): ein Tipp, bevor die erste Antwort da ist – bleiben() hielt die Seite dann wegen „eingabe && > 2 s“
       an, nur die Blase, und die Rückkehr ging auf der ALTEN Fassung hinein (für die ganze Sitzung). */
    abschnitt("T", "Tipp während des Wartens (Update, Antwort nach > 2 s): trotzdem die neue Fassung");
    const faelle = [
      { cpu: 1, D: 2500, tipp: 1200, wer: "Helfer weiß es (index.html und fassung.json je 2,5 s)" },
      { cpu: 4, D: 2500, tipp: 1200, wer: "Helfer weiß es (index.html und fassung.json je 2,5 s)" },
      /* index.html später als fassung.json: hier entscheidet der Wächter (bleiben) */
      { cpu: 1, D: 4500, fjD: 2500, tipp: 1200, wer: "Wächter entscheidet (fassung.json 2,5 s, index.html 4,5 s)" },
      { cpu: 4, D: 4500, fjD: 2500, tipp: 1200, wer: "Wächter entscheidet (fassung.json 2,5 s, index.html 4,5 s)" }
    ];
    for (const fa of faelle) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, Object.assign({ teil: "T", update: true, art: "reload", warten: 14000 }, fa));
      const b = e.betreten || [];
      sage(e.tipp != null && e.f === e.V1 && b.length === 1 && b[0].f === e.V1 && !e.blase && e.gesteuert,
        "T CPU " + fa.cpu + "× " + fa.wer + ", Tipp nach " + fa.tipp + " ms, Lauf " + (n + 1) + ": am Ende die neue Fassung, betreten einmal, keine Blase", zeile(e) + ", Tipp bei " + e.tipp + " ms");
    }
  }

  if (NUR.includes("Z")) {
    /* FASSUNG 886 (Auftrag: „nie langsamer als 884“): die Antwort des Servers kommt genau dann, wenn die alte Seite (aus
       dem Speicher) ihre Skripte ausführt (livechat.js läuft). Bis 886 kam der Wechsel erst, nachdem der Helfer die neue Seite
       abgelegt und wieder gelesen hatte – bis dahin war die alte Seite in app.js, und der Wechsel wartete, bis ihr Hauptfaden
       frei war (gemessen bis ~0,45 s bei CPU 4×). Jetzt entscheidet der Helfer, sobald er die Antwort gelesen hat, und
       liefert die neue Seite aus dem Gedächtnis; die alte Seite hängt die ganzen Stilblätter erst nach der Entscheidung ein. */
    abschnitt("Z", "Antwort des Servers, während die alte Seite ihre Skripte ausführt: Wechsel auf die neue, einmal hinein, nichts Halbes");
    for (const cpu of [4, 1]) for (let n = 0; n < N; n++) {
      /* fassung.json erst nach 3 s: sonst lädt der Wächter selbst neu, bevor die alte Seite fertig gelesen hat */
      const e = await lauf(br, sv, { teil: "Z", update: true, art: "reload", cpu, D: 0, fjD: 3000, zwang: true });
      const b = e.betreten || [], app = e.app || [];
      const alt = app.filter((x) => x.seite === 1 && e.seiten > 1);
      sage(e.f === e.V1 && e.seiten <= 2 && b.length === 1 && b[0].f === e.V1 && b[0].seite === e.seiten && !e.blase,
        "Z CPU " + cpu + "× Lauf " + (n + 1) + ": neue Fassung, höchstens ein Neuladen, betreten einmal auf der neuen Seite", zeile(e) + ", Antwort nach " + e.zwangRaus + " ms");
      /* Ob app.js auf der alten Seite noch anläuft, hängt am Zufall der Reihenfolge (ob der Browser zwischen den Skripten eine
         Lücke lässt; CPU 4× 1 von 8, CPU 1× 2 von 4 Läufen) – nur mitgeschrieben. Geprüft wird, was sicher gelten muss: die alte
         Seite hat keine ganzen Stilblätter eingehängt (I48), die neue am Ende alle. */
      info("Z CPU " + cpu + "× Lauf " + (n + 1) + ": app.js auf Seite " + JSON.stringify(app.map((x) => x.seite + ":" + x.t + "ms")) + " (nicht geprüft)");
      /* ohne alte Seite (884: die Seite kommt aus dem Netz, der Server hält sie bis 2 s) gilt nur „am Ende alle“ */
      const vollAlt = e.seiten === 2 ? (e.vollWeg || []).find((x) => x.seite === 1) : { voll: 0 };
      sage(vollAlt && vollAlt.voll === 0 && e.voll > 0 && e.voll === e.vollAlle, "Z CPU " + cpu + "× Lauf " + (n + 1) + ": eine ersetzte Seite hängte keine ganzen Stilblätter ein, die letzte hat am Ende alle",
        "ersetzt " + (e.seiten === 2 ? (vollAlt ? vollAlt.voll : "–") : "keine") + ", am Ende " + e.voll + " von " + e.vollAlle);
      const ab = b.length ? b[0].abbruch : null;
      sage(!ab || JSON.parse(ab).f !== e.V, "Z CPU " + cpu + "× Lauf " + (n + 1) + ": kein falscher Abbruch-Eintrag", "dma-mess-abbruch " + (ab || "–"));
    }
  }

  if (NUR.includes("Y")) {
    /* FASSUNG 886 (Prüfbericht zu dddf4c7b): die Antwort des Servers kommt spät (index.html nach 4,9 s, fassung.json hängt).
       Der Helfer darf dann nicht mehr selbst neu laden (navigate nur bis 4,5 s nach dem Öffnen) – die Seite bekommt „neu“
       und entscheidet auf ihrem eigenen Hauptfaden (noch nicht drin: neu laden; schon drin: Blase). */
    abschnitt("Y", "Späte Antwort des Servers (4,9 s): der Helfer lädt nicht mehr selbst, die Seite entscheidet – nie zweimal hinein");
    const yFaelle = [{ cpu: 1, was: "Y1", D: 4900 }, { cpu: 4, was: "Y1", D: 4900 },
      { cpu: 1, was: "Y3", D: 5400, meldungSpaet: 900 }, { cpu: 4, was: "Y3", D: 5400, meldungSpaet: 900 },
      { cpu: 1, was: "Y4", D: 5500 }, { cpu: 4, was: "Y4", D: 5500 },
      /* Nachbesserung 2 (Prüfbericht zu 1abc32b2): Tipp während des Wartens auf dem späten Weg „neu“ */
      { cpu: 1, was: "Y5", D: 4900, tipp: 1200 }, { cpu: 4, was: "Y5", D: 4900, tipp: 1200 },
      /* Nachbesserung 2: fassung.json kommt ebenfalls spät, statt zu hängen (Prüfer: 4,7 / 5,2 / 5,8 s) */
      { cpu: 1, was: "Y6", D: 4700, fjD: 4700 }, { cpu: 4, was: "Y6", D: 5200, fjD: 5200 }, { cpu: 4, was: "Y6", D: 5800, fjD: 5800 },
      /* … und mit kleinem Versatz: die Antwort von fassung.json kurz VOR der des Helfers (der Wächter lädt selbst, der Helfer
         hört „halt“) bzw. kurz DANACH (die Seite lädt schon auf „neu“ des Helfers, dann kommt fassung.json) – beide Antworten
         erreichen die Seite, die gerade geht; sie darf dabei keine Blase zeigen und kein „draussen“ schreiben */
      { cpu: 1, was: "Y6b", D: 4760, fjD: 4700 }, { cpu: 4, was: "Y6b", D: 4800, fjD: 4700 },
      { cpu: 1, was: "Y6c", D: 4700, fjD: 4685 }, { cpu: 4, was: "Y6c", D: 4700, fjD: 4660 },
      { cpu: 1, was: "Y2", D: 4900, belegt: [4800, 1500] }, { cpu: 4, was: "Y2", D: 4900, belegt: [4800, 1500] },
      /* Nachbesserung 2 (Prüfer, Befund 2): navigate noch vor 4,5 s, der Hauptfaden der alten Seite aber über die 6-s-Frist
         hinaus belegt – hier hängt es an der Reihenfolge im Browser (Wechsel oder fälliger Zeitgeber zuerst) */
      { cpu: 1, was: "Y7", D: 4300, belegt: [4250, 2050] }, { cpu: 4, was: "Y7", D: 4300, belegt: [4250, 2050] }]
      .filter((fa) => !process.env.YNUR || process.env.YNUR.split(",").includes(fa.was));
    for (const fa of yFaelle) { const yZeiten = []; let yKopf = ""; for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, { teil: "Y", update: true, art: "reload", cpu: fa.cpu, D: fa.D, fjD: fa.fjD, fjArt: fa.fjD != null ? "" : "haengt", tipp: fa.tipp,
        belegt: fa.belegt, meldungSpaet: fa.meldungSpaet, warten: 16000, ruhe: 3000, was: fa.was });
      const b = e.betreten || [], wm = (e.wm || []).filter((x) => x.seite > 1);
      const vomHelfer = wm.some((x) => /^\*/.test(String(x.w || "")));
      const wie = { Y1: " index.html nach 4,9 s,", Y3: " Meldung 0,9 s verspätet, index.html nach 5,4 s,", Y4: " index.html nach 5,5 s,", Y5: " index.html nach 4,9 s, Tipp nach 1,2 s,",
        Y6: " index.html und fassung.json nach " + (fa.D / 1000).toFixed(1).replace(".", ",") + " s,", Y6b: " fassung.json 4,7 s, index.html " + (fa.D / 1000).toFixed(2).replace(".", ",") + " s,",
        Y6c: " index.html 4,7 s, fassung.json " + (fa.fjD / 1000).toFixed(3).replace(".", ",") + " s,", Y2: " Hauptfaden 4,8–6,3 s belegt,", Y7: " index.html 4,3 s, Hauptfaden 4,25–6,3 s belegt," }[fa.was];
      const kopf = fa.was + " CPU " + fa.cpu + "×" + wie + " Lauf " + (n + 1) + ": ";
      if (fa.was === "Y2") {
        sage(b.length === 1 && (b[0].f === e.V1 || (e.f === e.V && /Neue Fassung/.test(e.blase))) && e.gesteuert,
          kopf + "nie zweimal hinein (neue Fassung, oder die alte mit Blase)", zeile(e) + ", Merker " + JSON.stringify(e.wm || []));
        continue;
      }
      if (fa.was === "Y7") {
        /* nur Chromium: übernimmt er den Wechsel vor dem fälligen 6-s-Zeitgeber, geht es einmal hinein, auf der neuen Fassung */
        sage(b.length === 1 && (b[0].f === e.V1 || (e.f === e.V && /Neue Fassung/.test(e.blase))) && e.gesteuert,
          kopf + "betreten nie zweimal (neue Fassung, oder die alte mit Blase)", zeile(e) + ", betreten auf Seite " + JSON.stringify(b.map((x) => x.seite + "/" + x.f)));
        info(kopf + (b.length === 1 && b[0].f === e.V1 ? "Wechsel vor dem Zeitgeber (neue Fassung)" : "anders: " + JSON.stringify(b)));
        continue;
      }
      /* Nachbesserung 2: das ERGEBNIS – neue Fassung, einmal hinein auf der letzten Seite, nie eine Blase, kein „draussen“, so schnell wie 884 */
      sage(e.f === e.V1 && b.length === 1 && b[0].f === e.V1 && b[0].seite === e.seiten && !e.blase && e.gesteuert && (fa.tipp == null || e.tipp != null),
        kopf + "am Ende die neue Fassung, betreten einmal (auf der letzten Seite)", zeile(e) + (fa.tipp != null ? ", Tipp bei " + e.tipp + " ms" : ""));
      sage(!(e.bl || []).length && !e.draussen, kopf + "auf keiner Seite je eine Blase, kein „draussen“ im Seitenspeicher",
        "Blasen " + JSON.stringify(e.bl || []) + ", draussen " + JSON.stringify(e.draussen || ""));
      /* rueckkehrfrist (Prüfbericht zu 5aaec640): die Zeitgrenze als Median der Läufe dieses Falls (unten), je Lauf nur grob */
      yZeiten.push(e.abNeuladen); yKopf = fa.was + " CPU " + fa.cpu + "×" + wie;
      sage(e.abNeuladen != null && e.abNeuladen <= grenze(fa) + 1000, kopf + "betreten nach höchstens " + (grenze(fa) + 1000) + " ms (grob, je Lauf)", e.abNeuladen + " ms");
      /* der Mechanismus (Prüfbericht zu dddf4c7b, Befund 4): nach 4,5 s ab dem Öffnen ruft der Helfer kein navigate mehr – in Chromium
         ohne sichtbare Folge (er übernimmt den Wechsel vor dem fälligen Zeitgeber), eine Absicherung für andere Browser.
         (884 nimmt die Seite gleich aus dem Netz: eine Seite, kein Merker – auch das ist richtig) */
      sage(!vomHelfer, kopf + "Mechanismus: nach 4,5 s ab dem Öffnen lädt nicht mehr der Helfer, sondern die Seite selbst neu", "Seiten " + e.seiten + ", Merker beim Start " + JSON.stringify(e.wm || []));
    }
    if (yZeiten.length) sage(med(yZeiten) != null && med(yZeiten) <= grenze(fa), yKopf + " Median über " + yZeiten.length + " Läufe: betreten nach höchstens " + grenze(fa) + " ms (D + " + (fa.cpu > 1 ? "1,8" : "0,9") + " s)", JSON.stringify(yZeiten) + " → " + med(yZeiten) + " ms");
    }
  }

  if (NUR.includes("W")) {
    /* Merker dma-wechsel: nur jünger als 20 s gilt die Seite als frisch (Neuladen, index.html und fassung.json hängen – der Helfer
       weiß nichts, ohne Merker wartet die Rückkehr also bis zur Frist von 6 s) */
    abschnitt("W", "Merker dma-wechsel (Seite eben vom Wächter oder Helfer geladen): jünger als 20 s frisch, älter nicht");
    const faelle = [
      { vor: "f|5000|{V}", frisch: true, was: "Fassung, 5 s alt" },
      { vor: "f|25000|{V}", frisch: false, was: "Fassung, 25 s alt" },
      { vor: "*|5000|1", frisch: true, was: "„*“ (Helfer) mit älterer Fassung, 5 s alt" },
      { vor: "*|5000|{V}", frisch: false, was: "„*“ mit DIESER Fassung (nicht neu geladen), 5 s alt" },
      { vor: "*|25000|1", frisch: false, was: "„*“ mit älterer Fassung, 25 s alt" }
    ];
    for (const fa of faelle) {
      /* rueckkehrfrist: Neuladen mit hängender index.html (vorher Öffnen mit D = 250 – dort zählt jetzt das „gleich“ des Helfers, und
         ohne Marke wartet die Seite gar nicht mehr) */
      const e = await lauf(br, sv, { teil: "W", update: false, art: "reload", cpu: 1, D: 30000, fjArt: "haengt", wechselVor: fa.vor, warten: 11000, ruhe: 1500 });
      const b = e.betreten || [];
      const t = b.length ? b[0].t : null;
      sage(e.seiten === 1 && b.length === 1 && (fa.frisch ? t < 3000 : t >= 5500 && t <= 7500),
        "W Merker " + fa.was + ": " + (fa.frisch ? "frisch, hinein ohne zu warten (< 3 s)" : "nicht frisch, hinein erst nach der Frist (6 s)"), zeile(e));
    }
  }

  if (NUR.includes("N")) {
    /* „neu“, aber die Seite bleibt (das Neuladen des Wächters wird abgebrochen, der Helfer bekommt keine Meldung): nach 15 s
       doch hinein, genau einmal, auf dieser Seite */
    abschnitt("N", "Antwort „neu“, aber das Neuladen scheitert: nach 15 s doch hinein");
    const e = await lauf(br, sv, { teil: "N", update: true, art: "reload", cpu: 1, D: 250, ohneNeuladen: true, warten: 22000, ruhe: 2500 });
    const b = e.betreten || [];
    const st = (e.stopp || [])[0];
    sage(st != null && e.seiten === 1 && e.f === e.V && b.length === 1 && b[0].t - st >= 14500 && b[0].t - st <= 17000,
      "N Neuladen abgebrochen: betreten einmal auf dieser Seite, 15 s nach der Antwort (die Blase darf stehen: draußen liegt eine neuere)", zeile(e) + ", abgebrochen bei " + st + " ms, betreten " + (b.length ? b[0].t - (st || 0) : "–") + " ms danach");
  }

  if (NUR.includes("O")) {
    abschnitt("O", "ohne Helfer: kein Warten (die Seite kommt frisch aus dem Netz)");
    const e = await lauf(br, sv, { teil: "O", update: false, helfer: false, art: "reload", cpu: 1, D: 250, fjArt: "haengt", warten: 8000, ruhe: 1500 });
    const b = e.betreten || [];
    sage(!e.gesteuert && e.seiten === 1 && b.length === 1 && b[0].t < 3000, "O ohne Helfer, Neuladen, fassung.json hängt: betreten wartet nicht (< 3 s)", zeile(e));
    /* gewöhnliches Öffnen ohne Helfer: index.html kommt aus dem Speicher des Browsers (max-age=600) – kann alt sein */
    for (let n = 0; n < N; n++) {
      const e2 = await lauf(br, sv, { teil: "O", update: true, helfer: false, art: "goto", cpu: 1, D: 250 });
      const b2 = e2.betreten || [];
      /* 886 (rueckkehrfrist): wie 884 sofort hinein (die Seite kommt nicht aus dem Speicher des Helfers), danach die Blase –
         kein Neuladen mitten im Verbinden (884: zweimal betreten) */
      sage(!e2.gesteuert && e2.seiten === 1 && b2.length === 1 && e2.f === e2.V && b2[0].f === e2.V && /Neue Fassung/.test(e2.blase) && b2[0].t < 1500,
        "O ohne Helfer, Öffnen (alte index.html aus dem Browser-Speicher), Update: sofort hinein wie 884 (< 1,5 s), genau einmal, danach die Blase", zeile(e2));
    }
  }

  if (NUR.includes("B")) {
    /* FASSUNG 886 (rueckkehrfrist, Prüfbericht zu 5aaec640): beim Öffnen/Zurück ohne Neuladen wartete die Rückkehr auch auf einer
       Seite ohne Marke auf fassung.json (Prüfer: D = 0,25 / 0,8 / 2 s → +64 / +605 / +1811 ms gegen 884). Jetzt wartet nur eine Seite
       aus dem Speicher des Helfers; eine aus dem Netz oder dem HTTP-Speicher geht wie 884 sofort hinein. */
    abschnitt("B", "Fall B – Öffnen/Zurück ohne Neuladen: gewartet wird nur auf einer Seite aus dem Speicher des Helfers");
    const sb = BEZUG884 ? await serverBauen(BEZUG884) : null;
    /* ohne BEZUG884: 884 gemessen (rueckkehrfrist, 6 Paare, Median) + 150 ms */
    const fest = { 1: FEST884[1] + 150, 4: FEST884[4] + 150 };
    const faelle = [
      { was: "B1", cpu: 1, D: 2000, art: "goto", update: false }, { was: "B1", cpu: 4, D: 2000, art: "goto", update: false },
      { was: "B1z", cpu: 1, D: 2000, art: "zurueck", update: false }, { was: "B2", cpu: 1, D: 2000, art: "goto", update: true }
    ].filter((fa) => bNur(fa.was));
    for (const fa of faelle) {
      const kopf = fa.was + " CPU " + fa.cpu + "× " + (fa.art === "goto" ? "Öffnen" : "Zurück") + ", index.html und fassung.json " + fa.D / 1000 + " s, " + (fa.update ? "Update" : "ohne Update") + ": ";
      const zeiten = [], diffs = [];
      for (let n = 0; n < N; n++) {
        const reihe = sb ? (n % 2 ? [["B", sv], ["A", sb]] : [["A", sb], ["B", sv]]) : [["B", sv]];
        const r = {};
        for (const [wer, s] of reihe) r[wer] = await lauf(br, s, Object.assign({ teil: "B", wer }, fa));
        const e = r.B, b = e.betreten || [];
        if (!fa.update) sage(e.seiten === 1 && b.length === 1 && b[0].f === e.V && !e.blase && e.gesteuert, kopf + "Lauf " + (n + 1) + ": betreten genau einmal, kein Neuladen, keine Blase", zeile(e));
        else sage(b.length === 1 && b[0].seite === e.seiten && e.seiten <= 2 && e.gesteuert && ((e.f === e.V1 && b[0].f === e.V1 && !e.blase) || (e.f === e.V && b[0].f === e.V && /Neue Fassung/.test(e.blase))),
          kopf + "Lauf " + (n + 1) + ": betreten genau einmal, danach kein Neuladen (alte Fassung mit Blase oder die neue)", zeile(e));
        zeiten.push(e.abNeuladen);
        if (r.A) { if (r.A.abNeuladen != null && e.abNeuladen != null) diffs.push(e.abNeuladen - r.A.abNeuladen); info(kopf + "Lauf " + (n + 1) + ": 884 " + r.A.abNeuladen + " ms (betreten " + (r.A.betreten || []).length + "×), dieser Stand " + e.abNeuladen + " ms"); }
      }
      if (sb) sage(diffs.length === N && med(diffs) <= 150, kopf + "betreten höchstens 150 ms nach 884 (Median, verschränkt, " + N + " Paare)", "gepaart " + JSON.stringify(diffs) + " → " + med(diffs) + " ms");
      else sage(med(zeiten) != null && med(zeiten) <= fest[fa.cpu], kopf + "betreten höchstens 150 ms nach 884 (Median ≤ " + fest[fa.cpu] + " ms; 884 hier gemessen " + FEST884[fa.cpu] + " ms)", JSON.stringify(zeiten) + " → " + med(zeiten) + " ms");
    }
    /* B3: der Browser hat index.html nicht mehr frisch (no-cache, wie nach mehr als 10 min) – die Vorab-Anfrage geht zum Server,
       die Seite kommt mit Marke aus dem Speicher des Helfers und wartet (höchstens so lange wie 884 auf die Seite) */
    const b3 = [{ was: "B3a", update: false, D: 2000, wie: "ohne Update, D = 2 s" }, { was: "B3b", update: true, D: 2000, wie: "Update, D = 2 s" },
      { was: "B3c", update: false, D: 250, fjD: 2000, wie: "ohne Update, index.html 0,25 s, fassung.json 2 s" }].filter((fa) => bNur(fa.was));
    for (const fa of b3) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, { teil: "B", art: "goto", cpu: 1, netz: true, update: fa.update, D: fa.D, fjD: fa.fjD, warten: 9000 });
      const b = e.betreten || [], kopf = fa.was + " CPU 1× Öffnen, Browser ohne frische Kopie (Seite mit Marke), " + fa.wie + ", Lauf " + (n + 1) + ": ";
      if (fa.was === "B3a") sage(e.marke && e.seiten === 1 && b.length === 1 && b[0].f === e.V && !e.blase && e.abNeuladen <= fa.D + 900, kopf + "betreten einmal, nach höchstens " + (fa.D + 900) + " ms", zeile(e));
      if (fa.was === "B3b") sage(e.f === e.V1 && b.length === 1 && b[0].f === e.V1 && b[0].seite === e.seiten && !e.blase && e.abNeuladen <= fa.D + 900, kopf + "am Ende die neue Fassung, betreten einmal, nach höchstens " + (fa.D + 900) + " ms", zeile(e));
      if (fa.was === "B3c") sage(e.marke && e.seiten === 1 && b.length === 1 && e.abNeuladen < 1000, kopf + "das „gleich“ des Helfers zählt auch beim Öffnen: betreten < 1 s (nicht erst nach fassung.json)", zeile(e));
    }
    /* B4 (gefunden mit der Variante „kurze Frist“): Öffnen mit Update, die alte index.html kommt aus dem HTTP-Speicher und
       fassung.json antwortet, BEVOR die Rückkehr hineingeht (CPU 1× mit schneller Antwort, CPU 4×). Der Wächter lädt dann neu
       (noch nicht im Raum) – die alte Seite darf nicht trotzdem noch hineingehen (sonst zweimal betreten, wie 884) */
    for (const fa of [{ cpu: 1, D: 50 }, { cpu: 4, D: 250 }].filter(() => bNur("B4"))) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, { teil: "B", art: "goto", cpu: fa.cpu, D: fa.D, update: true, warten: 9000 });
      const b = e.betreten || [];
      sage(b.length === 1 && b[0].seite === e.seiten && e.seiten <= 2 && e.gesteuert && ((e.f === e.V1 && b[0].f === e.V1 && !e.blase) || (e.f === e.V && b[0].f === e.V && /Neue Fassung/.test(e.blase))),
        "B4 CPU " + fa.cpu + "× Öffnen, Update, fassung.json nach " + fa.D + " ms (vor dem Hineingehen), Lauf " + (n + 1) + ": betreten genau einmal, auf der letzten Seite – nie auf einer Seite, die gerade neu lädt", zeile(e));
    }
    /* B4m (Nachbesserung 1 zu „rueckkehrfrist“, Prüfbericht zu 69a00801): dasselbe auf einer Seite MIT Marke. Seit I52 löst dort
       schon das „gleich“ des Helfers die erste Antwort – seine Vorab-Antwort ist aber die alte index.html aus dem HTTP-Speicher.
       Meldet fassung.json danach „neu“, bevor die Rückkehr hineingeht, lädt der Wächter neu; die alte Seite darf trotzdem nicht
       mehr hinein (69a00801: hinein, dann die neue noch einmal), und ihr Start-Tor (Supabase) muss zu sein, wenn sie geht
       (69a00801: vom „gleich“ geöffnet). Fälle: Zurück und Öffnen, CPU 4×, fassung.json nach 0,25 s; die neue Seite kommt
       nach 2 s (dann ist die alte Seite sicher noch da, wenn ihre Raum-Stücke ankommen – B4m-fest) oder nach 0,25 s (wie beim
       Prüfer; dann ist auch „erst hinein, danach die Blase“ richtig). */
    for (const fa of [{ art: "zurueck", D: 2000, fjD: 250, fest: true }, { art: "goto", D: 2000, fjD: 250, fest: true },
      { art: "zurueck", D: 250, fjD: 250 }].filter(() => bNur("B4m"))) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, { teil: "B", art: fa.art, cpu: 4, D: fa.D, fjD: fa.fjD, update: true, marke: true, warten: 9000 });
      const b = e.betreten || [], mk = e.mk || [], alt = mk.find((x) => x.seite === 1) || {};
      const kopf = "B4m CPU 4× " + (fa.art === "goto" ? "Öffnen" : "Zurück") + ", Seite mit Marke, „gleich“ des Helfers auf die alte index.html, Update, fassung.json nach " + fa.fjD
        + " ms, neue Seite nach " + fa.D + " ms, Lauf " + (n + 1) + ": ";
      const ueber = e.markeErzwungen === true && alt.marke === true && (alt.helfer || []).some((h) => /^gleich@/.test(h));
      sage(ueber, kopf + "der Weg wird wirklich geprüft (erste Seite mit Marke, der Helfer sagt „gleich“)", JSON.stringify({ erzwungen: e.markeErzwungen, alt }));
      const einmal = b.length === 1 && b[0].seite === e.seiten && e.seiten <= 2 && e.gesteuert
        && ((e.f === e.V1 && b[0].f === e.V1 && !e.blase) || (!fa.fest && e.seiten === 1 && e.f === e.V && b[0].f === e.V && /Neue Fassung/.test(e.blase)));
      sage(einmal, kopf + (fa.fest ? "die alte Seite lädt neu und geht NICHT hinein – betreten genau einmal, auf der neuen Fassung"
        : "betreten genau einmal, auf der letzten Seite (neu, oder die alte mit Blase, wenn sie vor fassung.json hineinging)"), zeile(e) + ", Seite 1: " + JSON.stringify(alt));
      if (e.seiten > 1) sage(alt.geht != null && alt.torWeg === "zu" && !(alt.torAuf || []).length,
        kopf + "die gehende Seite: Wächter hat neu geladen (dmaFassungGeht), ihr Start-Tor (Supabase) ging nie auf (das „gleich“ gilt beim Öffnen nur „vorab“)",
        "geht " + alt.geht + " ms, Tor beim Gehen " + alt.torWeg + ", Tor auf " + JSON.stringify(alt.torAuf) + ", DOMContentLoaded " + alt.dcl + ", weg " + alt.weg);
    }
    /* B5 (Nachbesserung 1): dieselbe Seite mit Marke OHNE Update – das „vorab“ lässt sie weiter sofort hinein (wie B3c), Start-Tor
       und die ganzen Blätter gehen auf, wenn sie drin ist (dmaRaumDrin) – nicht schon beim „gleich“ des Helfers, nicht erst nach
       fassung.json (2 s). CPU 1× und 4×, Zurück. */
    for (const cpu of [1, 4].filter(() => bNur("B5"))) for (let n = 0; n < N; n++) {
      const e = await lauf(br, sv, { teil: "B", art: "zurueck", cpu, D: 2000, fjD: 2000, update: false, marke: true, warten: 9000 });
      const b = e.betreten || [], mk = (e.mk || []).find((x) => x.seite === 1) || {}, auf = (mk.torAuf || [])[0], gl = (mk.helfer || []).map((h) => Number(h.split("@")[1]))[0];
      const kopf = "B5 CPU " + cpu + "× Zurück, Seite mit Marke, „gleich“ des Helfers (vorab), ohne Update, fassung.json 2 s, Lauf " + (n + 1) + ": ";
      sage(e.markeErzwungen === true && mk.marke === true && gl != null, kopf + "der Weg wird wirklich geprüft (Marke, „gleich“ des Helfers)", JSON.stringify(mk));
      sage(e.seiten === 1 && b.length === 1 && b[0].f === e.V && !e.blase && e.abNeuladen < (cpu > 1 ? 1700 : 1000),
        kopf + "betreten einmal, sofort (nicht erst nach fassung.json): < " + (cpu > 1 ? 1700 : 1000) + " ms", zeile(e));
      sage(auf != null && b.length && auf >= b[0].t - 5 && auf <= b[0].t + 300 && e.voll > 0,
        kopf + "Start-Tor auf, wenn sie drin ist (nicht beim „gleich“, nicht erst nach fassung.json); danach die ganzen Blätter",
        "„gleich“ " + gl + " ms, betreten " + (b[0] || {}).t + " ms, Tor auf " + auf + " ms, ganze Blätter " + e.voll + "/" + e.vollAlle);
    }
    if (sb) sb.srv.close();
  }

  if (NUR.includes("S")) {
    abschnitt("S", "Stempel ↔ Inhalt im Speicher des Helfers");
    const { S, hier } = sv;
    S.seite = ""; S.stau = 0; S.fjStau = 0; S.fjArt = ""; S.anders = {};
    const ctx = await br.newContext();
    const pg = await ctx.newPage();
    await pg.goto(hier + "/index.html?mit-sw", { waitUntil: "load" });
    await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
    await pg.goto(hier + "/index.html?mit-sw", { waitUntil: "load" });
    await schlaf(1500);
    const st = await pg.evaluate(() => window.DMA_STEMPEL || {});
    {
      /* Prüfer (Nachbesserung 1): index.html schreibt „draussen“ in den Seitenspeicher des Helfers; der Name steht dort fest */
      const html = fs.readFileSync(path.join(WURZEL, "index.html"), "utf8"), sw = fs.readFileSync(path.join(WURZEL, "sw.js"), "utf8");
      const a = (/caches\.open\("([^"]+)"\)\.then\(function \(k\) \{ return k\.put\(new URL\("draussen"/.exec(html) || [])[1], b = (/var SEITE = "([^"]+)";/.exec(sw) || [])[1];
      sage(a && a === b, "S index.html schreibt „draussen“ in genau den Seitenspeicher des Helfers (SEITE in sw.js)", "index.html " + a + ", sw.js " + b);
    }
    {
      const m = await pg.evaluate(async () => { const k = await caches.open("dma-seite-1"); const r = await k.match("seite"); const t = r ? await r.text() : "";
        return { gespeichert: /<html[^>]*data-dma-speicher/.test(t), diese: document.documentElement.hasAttribute("data-dma-speicher") }; });
      sage(m.gespeichert && !m.diese, "S die gespeicherte Seite trägt die Marke data-dma-speicher, die frisch geholte nicht", JSON.stringify(m));
    }
    const szene = fs.readdirSync(path.join(WURZEL, "szenen")).filter((n) => /\.js$/.test(n)).sort()[0];
    const holen = (u) => pg.evaluate(async (u) => {
      const t = await fetch(u).then((a) => a.text(), () => "");
      await new Promise((r) => setTimeout(r, 700));
      const k = await caches.open("dma-dateien-1");
      const da = await k.match(u);
      return { anders: /anders: neuer Inhalt/.test(t), laenge: t.length, abgelegt: Boolean(da), gespeichertAnders: da ? /anders: neuer Inhalt/.test(await da.text()) : null };
    }, u);
    const dl = "min/data-logik.js?v=" + st["min/data-logik.js"];
    S.anders = { "/min/data-logik.js": true };
    const a1 = await holen(dl);
    sage(a1.anders && !a1.abgelegt, "S anderer Inhalt unter dem Datei-Stempel: an die Seite, NICHT in den Speicher", JSON.stringify(a1));
    S.anders = {};
    const z0 = S.zaehler["/min/data-logik.js"] || 0;
    const a2 = await holen(dl);
    sage(!a2.anders && a2.abgelegt && a2.gespeichertAnders === false, "S richtiger Inhalt: abgelegt", JSON.stringify(a2));
    const a3 = await holen(dl);
    sage(!a3.anders && (S.zaehler["/min/data-logik.js"] || 0) === z0 + 1, "S danach aus dem Speicher (der Server sieht die Datei nicht noch einmal)", "Server-Abrufe nach dem Wechsel: " + ((S.zaehler["/min/data-logik.js"] || 0) - z0));
    const sz = await holen("szenen/" + szene + "?v=" + st["szenen/"]);
    sage(sz.abgelegt, "S Ordner-Stempel (szenen/" + szene + "): wie bisher abgelegt", JSON.stringify(sz));
    const fv = await holen("manifest.webmanifest?v=" + grund(WURZEL));
    sage(fv.abgelegt, "S ?v=<Fassung> (manifest.webmanifest): wie bisher abgelegt", JSON.stringify(fv));
    await ctx.close();
  }

  if (NUR.includes("M") && GEGEN) {
    abschnitt("M", "Messung: Neuladen → betreten, verschränkt (A = GEGEN, B = WURZEL), " + PAARE + " Paare je Fall");
    const sa = await serverBauen(GEGEN);
    /* MFAELLE=u1-250,u4-800,g1-250-goto … (u = Update, k = Update schon bekannt (Blase), g = gleich; CPU; D; -goto = Öffnen
       derselben Adresse statt Neuladen) */
    const faelle = (process.env.MFAELLE || "u1-250,u4-250,u4-800,g1-250,g4-800").split(",").map((x) => {
      const m = /^([ugk])(\d+)-(\d+)(-goto)?$/.exec(x.trim());
      return m ? { update: m[1] !== "g", bekannt: m[1] === "k", cpu: Number(m[2]), D: Number(m[3]), art: m[4] ? "goto" : "reload" } : null;
    }).filter(Boolean);
    for (const fa of faelle) {
      const A = [], B = [], diff = [];
      for (let n = 0; n < PAARE; n++) {
        const reihe = n % 2 ? [["B", sv], ["A", sa]] : [["A", sa], ["B", sv]];
        const r = {};
        for (const [wer, s] of reihe) r[wer] = await lauf(br, s, Object.assign({ teil: "M" }, fa, { wer }));
        A.push(r.A); B.push(r.B);
        if (r.A.abNeuladen != null && r.B.abNeuladen != null) diff.push(r.B.abNeuladen - r.A.abNeuladen);
        ERG.messung.push({ fall: fa, paar: n, A: r.A.abNeuladen, B: r.B.abNeuladen, Af: r.A.f === r.A.V1, Bf: r.B.f === r.B.V1 }); schreiben();
      }
      const neuA = A.filter((e) => e.f === e.V1).length, neuB = B.filter((e) => e.f === e.V1).length;
      const schneller = diff.filter((d) => d < 0).length, langsamer = diff.filter((d) => d > 0).length;
      info((fa.bekannt ? "bekannt  " : fa.update ? "Update   " : "ohne Upd ") + " CPU " + fa.cpu + "× D=" + fa.D + " " + fa.art + ": betreten ab Neuladen A " + med(A.map((e) => e.abNeuladen)) + " ms, B " + med(B.map((e) => e.abNeuladen))
        + " ms, B − A gepaart " + med(diff) + " ms (B schneller " + schneller + ", langsamer " + langsamer + " von " + diff.length + "; Einzel " + JSON.stringify(diff) + "); neue Fassung am Ende A " + neuA + "/" + A.length + ", B " + neuB + "/" + B.length);
    }
    sa.srv.close();
  }

  if (NUR.includes("H") && GEGEN) {
    abschnitt("H", "Helfer füllt seinen Speicher (2. Öffnen, jede gestempelte Datei ein Fehltreffer – wie nach einem Update): Stempel-Prüfung kostet? (A = GEGEN, B = WURZEL)");
    const sa = await serverBauen(GEGEN);
    const A = [], B = [], diff = [];
    for (let n = 0; n < PAARE; n++) {
      const r = {};
      for (const [wer, s] of n % 2 ? [["B", sv], ["A", sa]] : [["A", sa], ["B", sv]]) {
        s.S.seite = ""; s.S.stau = 0; s.S.fjStau = 0; s.S.fjArt = ""; s.S.anders = {};
        const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true });
        const pg = await ctx.newPage(); const cdp = await ctx.newCDPSession(pg);
        await pg.goto(s.hier + "/index.html?mit-sw", { waitUntil: "load" });
        await pg.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 20000 }).catch(() => {});
        await schlaf(500);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await pg.goto(s.hier + "/index.html?mit-sw", { waitUntil: "load" });
        await schlaf(4000);
        r[wer] = await pg.evaluate(async () => {
          const nv = performance.getEntriesByType("navigation")[0];
          const k = await caches.open("dma-dateien-1"); const e = (await k.keys()).length;
          return { dcl: Math.round(nv.domContentLoadedEventStart), load: Math.round(nv.loadEventStart), eintraege: e };
        });
        await ctx.close();
      }
      A.push(r.A); B.push(r.B); diff.push(r.B.load - r.A.load);
      ERG.messung.push({ fall: "H", paar: n, A: r.A, B: r.B }); schreiben();
    }
    info("load A " + med(A.map((x) => x.load)) + " ms, B " + med(B.map((x) => x.load)) + " ms, B − A gepaart " + med(diff) + " ms (Einzel " + JSON.stringify(diff) + "); DOMContentLoaded A "
      + med(A.map((x) => x.dcl)) + ", B " + med(B.map((x) => x.dcl)) + "; Einträge im Dateispeicher A " + JSON.stringify(A.map((x) => x.eintraege)) + ", B " + JSON.stringify(B.map((x) => x.eintraege)));
    /* je Lauf nie weniger als vorher (A streut um eins: das Ablegen läuft nach load weiter) */
    sage(B.every((x) => x.eintraege >= Math.max(...A.map((y) => y.eintraege))), "H nie weniger Dateien im Speicher des Helfers als vorher (jede echte Datei passt zu ihrem Stempel)");
    sa.srv.close();
  }

  await br.close(); sv.srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles grün"));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
