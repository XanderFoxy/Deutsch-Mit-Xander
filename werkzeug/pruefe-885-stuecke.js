#!/usr/bin/env node
/* =====================================================================
   SONDE 885 — STÜCKE: DER ERSTE TIPP OHNE SYNCHRONES NACHLADEN, DIE
   RAUM-STÜCKE EINZELN (Fassung 886, Ladezeit-Entwurf Schritt E)
   ---------------------------------------------------------------------
   XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller" · (Funk
   263): „sofort im Livestream wie bei HelloTalk" · (Funk 255): „die
   schnelle Performance und die Verbindung zu den anderen haben oberste
   Priorität".
   Befund (Grundlinie 884, geschärftes Messwerkzeug): der erste Tipp auf
   „Wissen" holte kalt raum3 (lcWaEntsperren hängt an pointerdown am
   ganzen Dokument) und rest7 (tutorSchreibzeile an focusin) per
   synchronem XHR – 4G kalt 248 ms, 3G 1,25 s gesperrter Hauptfaden, in
   7 von 7 Läufen. Mit Konto holte schon der Start rest1 (trophyCounts,
   Melde-Töne) und rest6 (tinyAvatar). Beim Betreten und bei der Rückkehr
   wurden alle acht Raum-Stücke in EINER Aufgabe eingesetzt, und die
   Rückkehr ging nach 2,5 s hinein, auch wenn die Raum-Stücke noch
   unterwegs waren (dann holte jeder Platzhalter sein Stück synchron).

   Die Sonde hält die Stücke im Browser auf Wunsch zurück (page.route,
   nur die gewöhnlichen Abrufe – das belegt keine der sechs Verbindungen;
   ein synchroner Abruf eines Platzhalters wird in der Seite markiert und
   sofort durchgelassen) – so ist jede Prüfung unabhängig vom Zufall der
   Zeit: was ein Platzhalter braucht, MUSS er synchron holen und wird
   gezählt. Rechner 4× gebremst (Telefon).
   Geprüft (nur min/ – vorher node werkzeug/fassung-setzen.js --nur-stempel):
     1  Bau: app-teile.json hat „kern"; jede Funktion daraus steht in
        min/app.js als echte Funktion (kein Platzhalter); teile-bauen.js
        liest „kern", teile-messen.js übernimmt es beim Neu-Messen.
     2  Gast, kalt, noch kein Stück da: echter Tipp auf „Wissen", Tab
        (Fokus wandert), Größenänderung (Tastatur/Adressleiste), Rückkehr
        aus dem Hintergrund, echter Tipp auf „Lernen" und „Profil": kein
        synchroner Abruf, DMA_TEIL_SOFORT leer, keine Seitenfehler.
     3  Start mit Konto (Attrappe im Demo-Modus): Start, „Wissen",
        „Profil": kein synchroner Abruf – a) leeres Profil, b) (seit
        Nachbesserung 2) volles Profil wie draußen: Orden und Pokale,
        Sammelfigur als Profilbild („figures/…"), Hobbys, Bio, 1200 Punkte
        (Meilenstein-Feier, wird weggetippt), Freunde, Freundschafts-
        anfrage, ungelesene Post, Meldung; geprüft wird auch, dass das
        Profil wirklich so gezeichnet wurde. Postfach öffnen steht nur
        als „info" da (Offen 6).
     4  Rückkehr in den Raum nach dem Neuladen, Raum-Stücke langsam
        (je 3 s unterwegs): LiveChat.betreten erst, wenn alle Raum-Stücke
        eingesetzt sind, spätestens 1,5 s nach dem letzten; kein
        synchroner Abruf, keine Seitenfehler.
     5  Rückkehr bei schneller Leitung: die acht Raum-Stücke kommen
        jedes in seiner EIGENEN Aufgabe dran (dazwischen Leitung und
        Tipps); keine Aufgabe, in der ein Raum-Stück eingesetzt wird,
        dauert 120 ms oder länger (Rechner 4×).
     6  Ladeweg nach load: die Rest-Stücke werden erst angefordert, wenn
        die Raum-Stücke da sind (auf langsamer Leitung teilen sie sich
        sonst die Leitung); hängt ein Raum-Stück, kommen die Rest-Stücke
        nach höchstens 6 s trotzdem. Danach sind alle 15 eingesetzt,
        ohne synchronen Abruf.
   NACHBESSERUNG 1 (Prüfbericht zu 9135613f):
     7  Rückkehr, die Frist hängt am Fortschritt (dmaTeilRaumRegung):
        a) die Raum-Stücke tröpfeln (der Sondenserver schickt jedes in
           8 Happen über 6 s – länger als die alte Frist von 2,5 s und als
           die 4-s-Stillstandsregel, aber nie 4 s ohne Byte): betreten erst
           mit allen Raum-Stücken, nichts synchron;
        b) EIN Raum-Stück hängt (raum3 kommt nie, die anderen sofort):
           hinein nach höchstens 4 s Stillstand (+ Spielraum), nicht erst
           nach 12 s wie in 9135613f.
     8  Erster Besuch und Tipp auf Text, Stücke zurückgehalten:
        a) ohne dma_tour_seen: die Tour erscheint (600 ms nach dem Start),
           „Überspringen" – nichts synchron (vorher rest1 über startTour);
        b) Tipps auf Text außerhalb der Betonungs-Kästen (Wissen, Lernen):
           nichts synchron (vorher rest1 über betonungKastenFinden – jeder
           Tipp, der keinen Knopf trifft).
   NACHBESSERUNG 2 (Prüfbericht zu cadb2e63): Abschnitt 3 bewies „Start
   mit Konto lädt nichts synchron" nur für ein LEERES Profil. Mit Orden,
   Sammelfigur und Hobbys holte der Start weiter rest1 (trophyKind), rest6
   (isFigureAvatarUrl) und rest2 (hobbyBeschriftung) synchron – jetzt Kern,
   dazu avatarPhotoHtml (Precise Coverage mit vollem Profil). Neu: 3b,
   1 nennt die vier. NUR=3 (oder NUR=2,3 …) prüft nur diese Abschnitte im
   Browser.
   Gegenprobe (Stand vor diesem Schritt, 21b774d3):
     S=/tmp/claude-0/-home-user-Deutsch-Mit-Xander/<sitzung>/scratchpad
     mkdir -p $S/gegen885/stuecke-vorher && git archive 21b774d3 index.html min werkzeug app.js livechat.js backend.js … | tar -x -C $S/gegen885/stuecke-vorher
     WURZEL=$S/gegen885/stuecke-vorher node werkzeug/pruefe-885-stuecke.js
   Gegenprobe Nachbesserung 1 (9135613f): WURZEL=$S/gegen885/stuecke-9135 (cp -al
   des Stands 21b774d3 + git archive 9135613f der 26 geänderten Dateien).
   Ergebnis 18.10.: 25 grün. Gegenprobe 21b774d3: 12 rot (1 ×3 keine Liste
   „kern", 21 Platzhalter · 2 ×2 raum3/rest7/rest6/rest2/raum1 synchron –
   lcWaEntsperren, tutorSchreibzeile, sammelSchalterHtml, firstStepsLangFor,
   kzBackend · 3 ×3 rest1/rest6 schon beim Start, dazu raum3/rest7 · 4 ×2
   betreten bei 1 von 8 Raum-Stücken, raum1 synchron (livechatGeschlecht) ·
   5 alle acht in EINER Aufgabe (83 ms) · 6 Rest gleichzeitig mit Raum).
   Grün bleibt dort, was gleich bleiben soll (Mitschreiben, keine
   Seitenfehler, Aufgabe < 120 ms, alle eingesetzt, 6b).
   Ergebnis Nachbesserung 1 (18.10.): 38 grün. Gegenprobe 9135613f: 7 rot
   (1 ×2 startTour/betonungKastenFinden/-Taugt Platzhalter · 7a betreten
   mit 6 von 8 – die feste 12-s-Frist kam vor der zweiten Welle · 7b
   11930 ms · 8 ×3 rest1 über startTour bzw. betonungKastenFinden).
   Gegenprobe 21b774d3: 18 rot (die 12 oben + 7a ×3 + 8 ×3; 7b grün).
   Ergebnis Nachbesserung 2 (19.10.): 43 grün (3b neu: 5 Prüfungen;
   info: Postfach öffnen holt rest6 synchron, Offen 6). Gegenprobe
   cadb2e63 (WURZEL=$S/gegen885/stuecke-cadb, cp -al von stuecke-9135 +
   git archive cadb2e63 der 22 geänderten Dateien): 5 rot (1 ×2 – vier
   Platzhalter; 3b ×3 – rest6, rest2, rest1 synchron über
   isFigureAvatarUrl, hobbyBeschriftung, trophyKind; das volle Profil war
   dort genauso gezeichnet). Gegenprobe 21b774d3: 21 rot (die 18 oben,
   dazu 3b ×3: rest6, rest1, rest2).
   EHRLICH: geprüft in Chromium. Die Größenänderung und „Hintergrund"
   sind nachgestellt (setViewportSize, visibilitychange); echte
   Bildschirmtastaturen schicken dieselben Ereignisse.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.resolve(process.env.WURZEL || path.join(__dirname, ".."));
const REPO = path.join(__dirname, "..");
const CPU = Number(process.env.CPU || 4);
const TYP = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".mp3": "audio/mpeg",
  ".woff2": "font/woff2", ".gif": "image/gif", ".webmanifest": "application/manifest+json" };
let fehler = 0;
const rot = [];
let abschnitt = "";
const sage = (gut, was, zusatz) => {
  if (!gut) { fehler++; rot.push(abschnitt); }
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const titel = (k, t) => { abschnitt = k; console.log("\n" + k + ") " + t + "\n"); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
const lies = (p) => { try { return fs.readFileSync(p, "utf8"); } catch (e) { return ""; } };
/* NUR=3 oder NUR=2,3: nur diese Abschnitte im Browser (1, der Bau, läuft immer) */
const NUR = (process.env.NUR || "").split(",").map((x) => x.trim()).filter(Boolean);
const lauf = (k) => !NUR.length || NUR.indexOf(k) >= 0;

/* Am Ende von backend.js: die Konto-Attrappe einhängen, bevor app.js läuft (wie Sonde 884-beta). */
const ANHANG = "\n;(function(){try{if(window.__sondeKonto)window.__sondeKonto(Backend);}catch(e){console.error('Attrappe:',e);}})();\n";
/* In min/app.js: jedes Einsetzen eines Stücks mitschreiben (Name, Beginn, Dauer, Aufgabe). Der Rest der Datei bleibt. */
const EVAL_ALT = "function dmaTeilAuswerten(dmaTeilQuelltext){eval(dmaTeilQuelltext)}";
const EVAL_NEU = "function dmaTeilAuswerten(dmaTeilQuelltext){var __sondeEnde=window.__sondeEval?window.__sondeEval(dmaTeilQuelltext):null;eval(dmaTeilQuelltext);if(__sondeEnde)__sondeEnde()}";

/* In jeder Seite: synchrone Abrufe zählen (und dem Server als solche zeigen), Einsetzen je Aufgabe, Langläufer */
function seitenSonde() {
  window.__sync = [];
  window.__ev = [];
  window.__lang = [];
  window.__fehlerSeite = [];
  const open = XMLHttpRequest.prototype.open, send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u, a) {
    const rest = Array.prototype.slice.call(arguments, 2);
    if (a === false) { this.__sondeSync = String(u); u = String(u) + (String(u).indexOf("?") < 0 ? "?" : "&") + "sonde-sync=1"; }
    return open.apply(this, [m, u].concat(rest));
  };
  XMLHttpRequest.prototype.send = function () {
    if (!this.__sondeSync) return send.apply(this, arguments);
    const a = performance.now();
    try { return send.apply(this, arguments); }
    finally { window.__sync.push({ u: this.__sondeSync.replace(/\?.*$/, ""), a: Math.round(a), d: Math.round(performance.now() - a) }); }
  };
  /* Aufgabe: die erste Einsetzung einer Aufgabe schickt eine Nachricht; bis sie ankommt, gehört jede weitere
     Einsetzung zu derselben Aufgabe (Nachrichten kommen der Reihe nach – auch vor dmaTeilPause). */
  let marke = 0, aktiv = 0;
  window.__sondeEval = (q) => {
    const t = (String(q).match(/sourceURL=min\/app-teil-(\w+)/) || [])[1] || "?";
    if (!aktiv) {
      aktiv = ++marke;
      const k = new MessageChannel();
      k.port1.onmessage = () => { aktiv = 0; k.port1.close(); };
      k.port2.postMessage(0);
    }
    const e = { t, a: performance.now(), aufgabe: aktiv };
    return () => { e.d = performance.now() - e.a; window.__ev.push(e); };
  };
  try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lang.push([Math.round(e.startTime), Math.round(e.duration)])))
    .observe({ type: "longtask", buffered: true }); } catch (e) {}
  try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus");
    if (!sessionStorage.getItem("dma-neu-geladen")) sessionStorage.setItem("dma-neu-geladen", "x"); } catch (e) {}
}

(async () => {
  /* ---------- 1) Bau (nur Dateien) ---------- */
  titel("1", "DER BAU: „kern\" BLEIBT IN min/app.js");
  const listeRepo = JSON.parse(lies(path.join(REPO, "werkzeug/app-teile.json")) || "{}");
  const listeW = JSON.parse(lies(path.join(WURZEL, "werkzeug/app-teile.json")) || "{}");
  const minApp = lies(path.join(WURZEL, "min/app.js"));
  const SOLL = ["lcWaEntsperren", "lcWaKontextHolen", "tutorSchreibzeile", "trophyCounts", "tinyAvatar", "startTour", "betonungKastenFinden", "betonungKastenTaugt",
    "trophyKind", "isFigureAvatarUrl", "avatarPhotoHtml", "hobbyBeschriftung"];
  const kernW = Array.isArray(listeW.kern) ? listeW.kern : [];
  sage(SOLL.every((n) => kernW.includes(n)), "app-teile.json „kern\" nennt die Funktionen des ersten Tipps, des Starts mit Konto (auch mit Orden, Sammelfigur, Hobbys) und des ersten Besuchs (Tour, Tipp auf Text)",
    kernW.length ? kernW.length + " Funktionen" : "keine Liste „kern\"");
  const kernAlle = Array.from(new Set(SOLL.concat(Array.isArray(listeRepo.kern) ? listeRepo.kern : [])));
  const platz = kernAlle.filter((n) => new RegExp("function " + n + "\\([^)]*\\)\\{return dmaTeilRufA?\\(").test(minApp));
  const fehlt = kernAlle.filter((n) => !new RegExp("function " + n + "\\(").test(minApp));
  sage(minApp && !platz.length && !fehlt.length, "jede davon ist in min/app.js eine echte Funktion (kein Platzhalter)",
    platz.length ? "Platzhalter: " + platz.join(", ") : fehlt.length ? "fehlt: " + fehlt.join(", ") : kernAlle.length + " geprüft");
  const bauen = lies(path.join(WURZEL, "werkzeug/teile-bauen.js")), messen = lies(path.join(WURZEL, "werkzeug/teile-messen.js"));
  sage(/liste\.kern/.test(bauen) && /alt\.kern/.test(messen), "teile-bauen.js liest „kern\", teile-messen.js übernimmt es beim Neu-Messen");
  sage(minApp.indexOf(EVAL_ALT) >= 0, "die Sonde kann das Einsetzen mitschreiben (dmaTeilAuswerten wie erwartet)");

  /* ---------- Server ---------- */
  const anfragen = [];
  /* Nachbesserung 1: { re, ms, happen } – passende Raum-Stücke (nicht die synchronen) in Happen über ms schicken */
  let troepfeln = null;
  const teilName = (p) => (p.match(/^\/min\/app-teil-(\w+)\.js$/) || [])[1] || "";
  const srv = http.createServer((q, a) => {
    const i = q.url.indexOf("?");
    let p = decodeURIComponent(i < 0 ? q.url : q.url.slice(0, i)); if (p === "/") p = "/index.html";
    const sync = /[?&]sonde-sync=1/.test(q.url);
    const e = { p, teil: teilName(p), sync, t0: Date.now(), t1: 0 };
    anfragen.push(e);
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); e.t1 = Date.now(); return a.end(); }
    let body = fs.readFileSync(f);
    if (/(^|\/)backend\.js$/.test(p)) body = Buffer.concat([body, Buffer.from(ANHANG)]);
    if (p === "/min/app.js") body = Buffer.from(String(body).replace(EVAL_ALT, EVAL_NEU));
    a.writeHead(200, { "Content-Type": TYP[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    if (troepfeln && e.teil && !sync && troepfeln.re.test(e.teil)) {
      const n = troepfeln.happen, gr = Math.ceil(body.length / n), takt = troepfeln.ms / n;
      let k = 0;
      const weiter = () => {
        a.write(body.slice(k * gr, (k + 1) * gr));
        if (++k < n) setTimeout(weiter, takt); else { a.end(); e.t1 = Date.now(); }
      };
      return setTimeout(weiter, takt);
    }
    a.end(body); e.t1 = Date.now();
  }).listen(0);
  await new Promise((r) => srv.on("listening", r));
  const HIER = "http://127.0.0.1:" + srv.address().port;

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
  /* teile: { halten: /…/ } hält diese Stücke zurück, bis freigeben(pg); { langsam: { re, ms } } lässt sie ms später los */
  async function fenster(extra, arg, teile) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, serviceWorkers: "block" });
    await ctx.addInitScript(seitenSonde);
    if (extra) await ctx.addInitScript(extra, arg);
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e).split("\n")[0]));
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    pg.__gehalten = [];
    await pg.route(/\/min\/app-teil-\w+\.js/, (r) => {
      const u = r.request().url(), t = (u.match(/app-teil-(\w+)\.js/) || [])[1] || "";
      if (/[?&]sonde-sync=1/.test(u) || !teile) return r.continue().catch(() => {});
      if (teile.halten && teile.halten.test(t)) { pg.__gehalten.push(r); return; }
      if (teile.langsam && teile.langsam.re.test(t)) { setTimeout(() => r.continue().catch(() => {}), teile.langsam.ms); return; }
      r.continue().catch(() => {});
    });
    const cdp = await ctx.newCDPSession(pg);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
    return { ctx, pg };
  }
  const freigeben = (pg) => { pg.__gehalten.splice(0).forEach((r) => r.continue().catch(() => {})); };
  const bereit = (pg) => pg.waitForFunction(() => window.LiveChat && window.DMA_TAFEL_STAND && window.DMA_TEILE
    && document.querySelector('.tape-tab[data-target="view-knowledge"]'), null, { timeout: 60000, polling: 50 });
  const tippe = async (pg, sel) => {
    const b = await pg.evaluate((s) => {
      const e = [...document.querySelectorAll(s)].find((x) => x.getBoundingClientRect().height > 0);
      if (!e) return null;
      e.scrollIntoView({ block: "center", behavior: "instant" });
      const r = e.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, sel);
    if (b) await pg.touchscreen.tap(b.x, b.y);
    return Boolean(b);
  };
  const stand = (pg) => pg.evaluate(() => ({ sync: window.__sync.slice(), sofort: (window.DMA_TEIL_SOFORT || []).slice(),
    da: Object.keys(window.DMA_TEILE.stand().da), fehler: (window.DMA_TEIL_FEHLER || []).slice(), ev: window.__ev.slice(), lang: window.__lang.slice() }));
  const syncText = (s) => s.sync.map((x) => x.u.replace(/^.*\//, "") + " " + x.d + " ms").concat(s.sofort.map((x) => "sofort " + x.split(" at ")[0] + " (" + ((x.match(/at (?:\S+\.)?(\w+)/) || [])[1] || "?") + ")")).join(" | ");

  try {
    /* ---------- 2) Gast: der erste Tipp ---------- */
    titel("2", "GAST, KALT, NOCH KEIN STÜCK DA: ERSTER TIPP, FOKUS, GRÖSSE, HINTERGRUND");
    if (lauf("2")) {
      const { ctx, pg } = await fenster(null, null, { halten: /./ });
      await pg.goto(HIER + "/index.html", { waitUntil: "commit" });
      await bereit(pg);
      const vor = await stand(pg);
      const schritte = [];
      schritte.push(["Wissen", await tippe(pg, '.tape-tab[data-target="view-knowledge"]')]);
      await schlaf(700);
      await pg.keyboard.press("Tab"); await schlaf(150); await pg.keyboard.press("Tab"); await schlaf(300);
      schritte.push(["Tab", true]);
      await pg.setViewportSize({ width: 393, height: 520 }); await schlaf(300);
      await pg.setViewportSize({ width: 393, height: 800 }); await schlaf(300);
      schritte.push(["Größe", true]);
      await pg.evaluate(() => {
        Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await schlaf(300);
      await pg.evaluate(() => {
        Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
        document.dispatchEvent(new Event("visibilitychange")); window.dispatchEvent(new Event("focus")); window.dispatchEvent(new Event("pageshow"));
      });
      await schlaf(500);
      schritte.push(["Hintergrund", true]);
      schritte.push(["Lernen", await tippe(pg, '.tape-tab[data-target="view-learn"]')]);
      await schlaf(700);
      schritte.push(["Profil", await tippe(pg, '.tape-tab[data-target="view-profile"]')]);
      await schlaf(700);
      const nach = await stand(pg);
      sage(vor.da.length === 0 && nach.da.length === 0 && pg.__gehalten.length > 0, "vorher und nachher ist kein Stück eingesetzt (die Sonde hält sie zurück)",
        "eingesetzt " + nach.da.length + ", zurückgehalten " + pg.__gehalten.length);
      sage(schritte.every((s) => s[1]), "alle Handgriffe ausgeführt", schritte.map((s) => s[0]).join(", "));
      sage(!nach.sync.length && !nach.sofort.length, "kein synchroner Abruf, kein Sofort-Nachladen", syncText(nach) || "0");
      sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 3).join(" | "));
      freigeben(pg);
      await ctx.close();
    }

    /* ---------- 3) Start mit Konto ---------- */
    titel("3", "START MIT KONTO (ATTRAPPE): START, WISSEN, PROFIL – LEERES UND VOLLES PROFIL");
    /* Nachbesserung 2 (Prüfbericht zu cadb2e63): mit dem LEEREN Profil der Attrappe liefen trophyKind (je Trophäe),
       isFigureAvatarUrl/avatarPhotoHtml (Sammelfigur „figures/…") und hobbyBeschriftung nie – die Prüfung bewies
       „Start mit Konto lädt nichts synchron" nur für ein leeres Konto. b) ist ein Konto, wie es draußen aussieht:
       Orden und Pokale, Sammelfigur als Profilbild, Hobbys, Bio, 1200 Punkte (die Meilenstein-Feier geht auf und wird
       weggetippt), drei Freunde (einer mit Sammelfigur), eine Freundschaftsanfrage, eine ungelesene Nachricht und
       eine Meldung (Toasts, Melde-Ton). */
    const kontoAttrappe = (voll) => {
      const jetzt = Date.now(), iso = (ms) => new Date(jetzt - ms).toISOString();
      if (voll) window.__sondeVoll = {
        profil: { trophies: ["Wortschatz – Bronze", "Grammatik – Gold", "Fleißig – Meister", "Grammatik-Profi – Superheld", "Artikel – Silber", "Wortschatz – Silber"],
          avatarUrl: "figures/fuchs.png", avatar_url: "figures/fuchs.png", points: 1200, badges: ["Erste Runde", "Fleißig"], collectedFigures: ["kleiner-lernfuchs"],
          languages: ["Englisch", "Italienisch"], origin: "Italien", hobbies: ["Lesen", "Fußball", "Kochen"], bio: "Ich lerne Deutsch seit zwei Jahren und mag Bücher.",
          birthday: "2001-05-04", favMovie: "Lola rennt", favSong: "99 Luftballons", favFood: "Brezel",
          history: [{ character: "Artikel-Detektiv", points: 12, bonus: 2, percent: 80, categories: ["artikel"], played_at: iso(86400000) },
            { character: "Grammatik-Profi", points: 20, bonus: 0, percent: 100, categories: ["grammatik"], played_at: iso(3600000) }] },
        freunde: [
          { id: "f1", name: "Mia", points: 340, badges: [], trophies: ["Grammatik – Gold"], bio: "Hallo!", avatar_url: "figures/hase.png", avatar_emoji: "", online: true, last_active: iso(60000), birthday: "" },
          { id: "f2", name: "Kwame Mensah", points: 152, badges: [], trophies: [], bio: "", avatar_url: "", avatar_emoji: "🦊", online: false, last_active: iso(3 * 86400000), birthday: "" },
          { id: "f3", name: "Yui", points: 90, badges: [], trophies: [], bio: "", avatar_url: "", avatar_emoji: "", online: false, last_active: iso(3600000), birthday: "" }],
        anfragen: [{ id: "r1", id_other: "f4", name: "Lena" }],
        post: [
          { id: "m1", from_user: "f1", to_user: "sonde885@attrappe.test", author_name: "Mia", body: "Hallo! Wie geht's? Üben wir morgen zusammen?", is_system: false, image_url: null, read: false, created_at: iso(120000) },
          { id: "m2", from_user: null, to_user: "sonde885@attrappe.test", author_name: "System", body: "🏁 Runde beendet: 12 Punkte", is_system: true, image_url: null, read: true, created_at: iso(86400000) }],
        meld: [{ id: "n1", user_id: "sonde885@attrappe.test", message: "Mia hat deinen Beitrag geliked ❤️", read: false, created_at: iso(300000) }]
      };
      window.__sondeKonto = (B) => {
        B.signUp("sonde885@attrappe.test", "attrappe", "Sonde");
        const p = B.currentProfile();
        if (p) p.extraProfileData = Object.assign({}, p.extraProfileData, { seenFoxIntro: true });
        B.notifyAdminsBetaTesting = async () => {};
        const v = window.__sondeVoll;
        if (!v || !p) return;
        Object.assign(p, v.profil);
        B.getFriends = async () => v.freunde.map((f) => Object.assign({}, f));
        B.getIncomingRequests = async () => v.anfragen.slice();
        B.getMyMessages = async () => ({ inbox: v.post.map((m) => Object.assign({}, m)), outbox: [] });
        B.getUnreadMessageCount = async () => v.post.filter((m) => !m.read).length;
        B.getUnreadNotifications = async () => v.meld.map((m) => Object.assign({}, m));
      };
    };
    for (const voll of [false, true]) {
      if (!lauf("3")) break;
      console.log("  " + (voll ? "b) volles Profil" : "a) leeres Profil (wie bisher)"));
      const { ctx, pg } = await fenster(kontoAttrappe, voll, { halten: /./ });
      await pg.goto(HIER + "/index.html", { waitUntil: "load" });
      await bereit(pg);
      await schlaf(2500);
      /* Backend ist ein Name der Seite, nicht window.Backend (livechat.js „DAS BACKEND HEISST BACKEND") */
      const konto = await pg.evaluate(() => Boolean(typeof Backend !== "undefined" && Backend.currentUser && Backend.currentUser()));
      const s1 = await stand(pg);
      let feier = 0;
      if (voll) for (let i = 0; i < 3; i++) { if (!(await tippe(pg, ".lightbox .lightbox-close"))) break; feier++; await schlaf(600); }
      const w = await tippe(pg, '.tape-tab[data-target="view-knowledge"]'); await schlaf(1000);
      const ws = await pg.evaluate(() => document.querySelector('.tape-tab[data-target="view-knowledge"]').getAttribute("aria-selected") === "true");
      const pr = await tippe(pg, '.tape-tab[data-target="view-profile"]'); await schlaf(1000);
      const beleg = await pg.evaluate(() => {
        const v = document.getElementById("view-profile"), t = v ? v.innerText : "";
        const b = document.getElementById("inboxTabBadge");
        return { profil: Boolean(v && getComputedStyle(v).display !== "none"), hobby: /Fußball/.test(t), orden: /Orden|Pokal/.test(t),
          figur: document.querySelectorAll(".tiny-avatar-figure-wrap, .avatar-figure-sticker-wrap").length, post: Boolean(b && b.style.display === "block") };
      });
      const s2 = await stand(pg);
      sage(konto && w && ws && pr && beleg.profil && s2.da.length === 0, "angemeldet, Wissen und Profil getippt (Ansicht gewechselt), kein Stück eingesetzt",
        "Konto " + konto + ", Profil " + beleg.profil + ", eingesetzt " + s2.da.length);
      if (voll) sage(feier >= 1 && beleg.hobby && beleg.orden && beleg.figur >= 1 && beleg.post,
        "das volle Profil wurde wirklich gezeichnet (Meilenstein-Feier weggetippt, Hobby, Orden/Pokale, Sammelfigur, ungelesene Post)", JSON.stringify(beleg) + ", Feier " + feier);
      sage(!s1.sync.length && !s1.sofort.length, "Start: kein synchroner Abruf", syncText(s1) || "0");
      sage(!s2.sync.length && !s2.sofort.length, (voll ? "Feier schließen, " : "") + "Wissen und Profil: kein synchroner Abruf", syncText(s2) || "0");
      sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 3).join(" | "));
      if (voll) {
        /* Nur zur Kenntnis (Offen 6 im Logbuch, keine Prüfung): Postfach öffnen braucht renderInbox – zu groß für den Kern */
        await tippe(pg, '#profileSubnav [data-sub="sub-inbox"]'); await schlaf(1000);
        const s3 = await stand(pg);
        const neu = s3.sync.slice(s2.sync.length);
        console.log("  info Postfach öffnen, Stücke zurückgehalten: " + (neu.length ? neu.map((x) => x.u.replace(/^.*\//, "") + " " + x.d + " ms").join(", ") + " synchron (Offen 6)" : "nichts synchron"));
      }
      freigeben(pg);
      await ctx.close();
    }

    /* Rückkehr nach dem Neuladen: dma_livechat_zurueck und eine Falle, die beim Betreten den Stand festhält */
    const rueckkehr = () => {
      try { sessionStorage.setItem("dma_livechat_zurueck", JSON.stringify({ raum: "sonde885stuecke", name: "Sonde", mitBild: false, zeit: Date.now() })); } catch (e) {}
      window.__betreten = [];
      let lc;
      Object.defineProperty(window, "LiveChat", { configurable: true, get: () => lc, set: (v) => {
        lc = v;
        try {
          const echt = v.betreten;
          v.betreten = function () {
            try { const s = window.DMA_TEILE ? window.DMA_TEILE.stand() : null;
              window.__betreten.push({ t: Math.round(performance.now()), da: s ? Object.keys(s.da).filter((x) => /^raum/.test(x)).length : -1, sync: window.__sync.length }); } catch (e) {}
            return echt.apply(this, arguments);
          };
        } catch (e) {}
      } });
    };
    const raumZahl = (pg) => pg.evaluate(() => window.DMA_TEILE.stand().teile.filter((t) => /^raum/.test(t)).length);

    /* ---------- 4) Rückkehr, Raum-Stücke langsam ---------- */
    titel("4", "RÜCKKEHR IN DEN RAUM, RAUM-STÜCKE LANGSAM (JE 3 s)");
    if (lauf("4")) {
      const ab = anfragen.length;
      const { ctx, pg } = await fenster(rueckkehr, null, { langsam: { re: /^raum/, ms: 3000 } });
      const t0 = Date.now();
      await pg.goto(HIER + "/index.html", { waitUntil: "commit" });
      await bereit(pg);
      await pg.waitForFunction(() => window.__betreten.length > 0, null, { timeout: 30000, polling: 100 }).catch(() => {});
      await schlaf(1500);
      const r = await pg.evaluate(() => ({ betreten: window.__betreten.slice(), sync: window.__sync.slice(), sofort: (window.DMA_TEIL_SOFORT || []).slice(),
        nav: Math.round(performance.timeOrigin) }));
      const n = await raumZahl(pg);
      const raumEnde = Math.max.apply(null, anfragen.slice(ab).filter((x) => /^raum/.test(x.teil) && !x.sync).map((x) => x.t1 || Infinity));
      const b = r.betreten[0];
      const bWand = b ? r.nav + b.t : 0;
      sage(Boolean(b), "LiveChat.betreten wurde gerufen", b ? (bWand - t0) + " ms nach dem Öffnen" : "nie");
      sage(b && b.da === n && n > 0, "erst, als alle Raum-Stücke eingesetzt waren", b ? b.da + " von " + n : "–");
      sage(b && isFinite(raumEnde) && bWand - raumEnde <= 1500, "und nicht später als 1,5 s nach dem letzten Raum-Stück",
        b && isFinite(raumEnde) ? (bWand - raumEnde) + " ms danach" : "–");
      sage(!r.sync.length && !r.sofort.length, "kein synchroner Abruf", syncText({ sync: r.sync, sofort: r.sofort }) || "0");
      sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 3).join(" | "));
      await ctx.close();
    }

    /* ---------- 5) Rückkehr, schnelle Leitung: jedes Raum-Stück in seiner eigenen Aufgabe ---------- */
    titel("5", "RÜCKKEHR BEI SCHNELLER LEITUNG: JEDES RAUM-STÜCK IN SEINER EIGENEN AUFGABE");
    if (lauf("5")) {
      const { ctx, pg } = await fenster(rueckkehr);
      await pg.goto(HIER + "/index.html", { waitUntil: "commit" });
      await bereit(pg);
      await pg.waitForFunction(() => window.__betreten.length > 0, null, { timeout: 30000, polling: 100 }).catch(() => {});
      await schlaf(2000);
      const s = await stand(pg);
      const raum = s.ev.filter((e) => /^raum/.test(e.t));
      const jeAufgabe = {};
      raum.forEach((e) => { jeAufgabe[e.aufgabe] = (jeAufgabe[e.aufgabe] || 0) + 1; });
      const meiste = Math.max.apply(null, Object.values(jeAufgabe).concat([0]));
      /* die längste Aufgabe, in der ein Raum-Stück eingesetzt wurde (Langläufer ≥ 50 ms; sonst kürzer) */
      const lang = s.lang.filter(([a, d]) => raum.some((e) => e.a >= a - 1 && e.a <= a + d + 1));
      const laengste = Math.max.apply(null, lang.map((x) => x[1]).concat([0]));
      const summe = Math.round(raum.reduce((x, e) => x + e.d, 0));
      sage(raum.length === (await raumZahl(pg)) && raum.length >= 4, "alle Raum-Stücke eingesetzt (mitgeschrieben)", raum.length + " · zusammen " + summe + " ms");
      sage(meiste === 1, "jedes in seiner eigenen Aufgabe", "höchstens " + meiste + " in einer Aufgabe · " + raum.map((e) => e.t + ":" + Math.round(e.d)).join(" "));
      sage(laengste < 120, "keine Aufgabe mit einem Raum-Stück dauert 120 ms oder länger (Rechner " + CPU + "×)", laengste ? "längste " + laengste + " ms" : "keine ≥ 50 ms");
      sage(!s.sync.length && !s.sofort.length && !pg.__fehler.length, "kein synchroner Abruf, keine Seitenfehler", (syncText(s) + " " + pg.__fehler.slice(0, 2).join(" | ")).trim() || "0");
      await ctx.close();
    }

    /* ---------- 6) Ladeweg nach load ---------- */
    titel("6", "LADEWEG NACH LOAD: ERST DIE RAUM-STÜCKE, DANN DER REST");
    if (lauf("6")) {
      const ab = anfragen.length;
      const { ctx, pg } = await fenster(null, null, { langsam: { re: /^raum/, ms: 1500 } });
      await pg.goto(HIER + "/index.html", { waitUntil: "load" });
      await bereit(pg);
      await pg.waitForFunction(() => { const s = window.DMA_TEILE.stand(); return s.teile.every((t) => s.da[t]); }, null, { timeout: 40000, polling: 200 }).catch(() => {});
      const l = anfragen.slice(ab).filter((x) => x.teil && !x.sync);
      const raumAus = Math.max.apply(null, l.filter((x) => /^raum/.test(x.teil)).map((x) => x.t1 || Infinity));
      const restAn = Math.min.apply(null, l.filter((x) => /^rest/.test(x.teil)).map((x) => x.t0));
      sage(isFinite(raumAus) && isFinite(restAn) && restAn >= raumAus, "das erste Rest-Stück wird erst angefordert, wenn alle Raum-Stücke da sind",
        isFinite(raumAus) && isFinite(restAn) ? "Rest " + (restAn - raumAus >= 0 ? "+" : "") + (restAn - raumAus) + " ms nach dem letzten Raum-Stück" : "–");
      const s = await stand(pg);
      const alle = await pg.evaluate(() => { const s = window.DMA_TEILE.stand(); return s.teile.filter((t) => !s.da[t]); });
      sage(!alle.length, "danach sind alle Stücke eingesetzt (in der Ruhepause)", alle.length ? "fehlen: " + alle.join(", ") : s.da.length + " Stücke");
      sage(!s.sync.length && !s.sofort.length && !s.fehler.length && !pg.__fehler.length, "ohne synchronen Abruf, ohne Fehler", (syncText(s) + " " + s.fehler.join(" | ") + " " + pg.__fehler.slice(0, 2).join(" | ")).trim() || "0");
      await ctx.close();
    }
    if (lauf("6")) {
      /* ein Raum-Stück hängt: der Rest kommt nach höchstens 6 s trotzdem */
      const ab = anfragen.length;
      const { ctx, pg } = await fenster(null, null, { halten: /^raum3$/ });
      await pg.goto(HIER + "/index.html", { waitUntil: "load" });
      const tLoad = Date.now();
      await bereit(pg);
      const da = await pg.waitForFunction(() => window.DMA_TEILE.stand().geholt.some((t) => /^rest/.test(t)), null, { timeout: 15000, polling: 100 }).then(() => true, () => false);
      /* FASSUNG 886 (Einmischen): „geholt“ gilt in der Seite schon beim Aufruf von fetch – beim Server kommt die Anfrage
         einen Augenblick später. Fiel die Abfrage genau dazwischen, stand hier „nie“, obwohl die Rest-Stücke nach 6,1 s
         unterwegs waren (2 von 9 Läufen). Bis 2 s auf den Eintrag des Servers warten. */
      for (let k = 0; da && k < 20 && !anfragen.slice(ab).some((x) => /^rest/.test(x.teil) && !x.sync); k++) await schlaf(100);
      const restAn = Math.min.apply(null, anfragen.slice(ab).filter((x) => /^rest/.test(x.teil) && !x.sync).map((x) => x.t0));
      sage(da && isFinite(restAn) && restAn - tLoad <= 9000, "raum3 hängt: die Rest-Stücke kommen trotzdem (höchstens 6 s gewartet, + Ruhepause)",
        isFinite(restAn) ? (restAn - tLoad) + " ms nach load" : "nie");
      freigeben(pg);
      await ctx.close();
    }

    /* ---------- 7) Rückkehr: die Frist hängt am Fortschritt (Nachbesserung 1) ---------- */
    titel("7", "RÜCKKEHR: WARTEN, SOLANGE DIE RAUM-STÜCKE VORANKOMMEN – NICHT, WENN EINES HÄNGT");
    if (lauf("7")) {
      /* a) tröpfeln: jedes Raum-Stück in 8 Happen über 6 s */
      const ab = anfragen.length;
      troepfeln = { re: /^raum/, ms: 6000, happen: 8 };
      const { ctx, pg } = await fenster(rueckkehr);
      await pg.goto(HIER + "/index.html", { waitUntil: "commit" });
      await bereit(pg);
      await pg.waitForFunction(() => window.__betreten.length > 0, null, { timeout: 30000, polling: 100 }).catch(() => {});
      await schlaf(1500);
      troepfeln = null;
      const r = await pg.evaluate(() => ({ betreten: window.__betreten.slice(), sync: window.__sync.slice(), sofort: (window.DMA_TEIL_SOFORT || []).slice(),
        nav: Math.round(performance.timeOrigin) }));
      const n = await raumZahl(pg);
      const l = anfragen.slice(ab).filter((x) => /^raum/.test(x.teil) && !x.sync);
      const raumAn = Math.min.apply(null, l.map((x) => x.t0)), raumEnde = Math.max.apply(null, l.map((x) => x.t1 || Infinity));
      const b = r.betreten[0];
      const bWand = b ? r.nav + b.t : 0;
      sage(isFinite(raumAn) && isFinite(raumEnde) && raumEnde - raumAn >= 5500, "die Raum-Stücke waren über 5,5 s unterwegs (länger als 2,5 s und als 4 s Stillstand)",
        isFinite(raumEnde) ? (raumEnde - raumAn) + " ms" : "–");
      sage(b && b.da === n && n > 0, "betreten erst mit allen Raum-Stücken", b ? b.da + " von " + n + ", " + (bWand - raumEnde) + " ms nach dem letzten" : "nie");
      sage(!r.sync.length && !r.sofort.length && !pg.__fehler.length, "kein synchroner Abruf, keine Seitenfehler",
        (syncText({ sync: r.sync, sofort: r.sofort }) + " " + pg.__fehler.slice(0, 2).join(" | ")).trim() || "0");
      await ctx.close();
    }
    if (lauf("7")) {
      /* b) raum3 hängt (der gewöhnliche Abruf kommt nie an; ein synchroner ginge durch), die anderen kommen sofort */
      const ab = anfragen.length;
      const { ctx, pg } = await fenster(rueckkehr, null, { halten: /^raum3$/ });
      await pg.goto(HIER + "/index.html", { waitUntil: "commit" });
      await bereit(pg);
      await pg.waitForFunction(() => window.__betreten.length > 0, null, { timeout: 30000, polling: 100 }).catch(() => {});
      await schlaf(800);
      const r = await pg.evaluate(() => ({ betreten: window.__betreten.slice(), nav: Math.round(performance.timeOrigin) }));
      const l = anfragen.slice(ab).filter((x) => /^raum/.test(x.teil) && x.teil !== "raum3" && !x.sync);
      const andereEnde = Math.max.apply(null, l.map((x) => x.t1 || Infinity));
      const b = r.betreten[0];
      const bWand = b ? r.nav + b.t : 0;
      sage(Boolean(b) && l.length >= 6 && isFinite(andereEnde), "raum3 hängt, die anderen Raum-Stücke sind da – LiveChat.betreten wird gerufen",
        b ? b.da + " Raum-Stücke eingesetzt" : "nie");
      sage(b && bWand - andereEnde <= 5500, "hinein spätestens 5,5 s nach dem letzten angekommenen Raum-Stück (4 s Stillstand + Prüftakt)",
        b && isFinite(andereEnde) ? (bWand - andereEnde) + " ms danach" : "–");
      sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 3).join(" | "));
      freigeben(pg);
      await ctx.close();
    }

    /* ---------- 8) Erster Besuch und Tipp auf Text (Nachbesserung 1) ---------- */
    titel("8", "ERSTER BESUCH (TOUR) UND TIPP AUF TEXT: NICHTS SYNCHRON");
    if (lauf("8")) {
      const { ctx, pg } = await fenster(() => { try { localStorage.removeItem("dma_tour_seen"); } catch (e) {} }, null, { halten: /./ });
      await pg.goto(HIER + "/index.html", { waitUntil: "commit" });
      await bereit(pg);
      const tour = await pg.waitForFunction(() => { const k = document.querySelector(".lightbox .profile-modal-card"); return k && /Willkommen/.test(k.textContent) && document.getElementById("tourSkip"); },
        null, { timeout: 8000, polling: 100 }).then(() => true, () => false);
      const s1 = await stand(pg);
      const weg = tour ? await tippe(pg, "#tourSkip") : false;
      await schlaf(500);
      const zu = await pg.evaluate(() => !document.querySelector(".lightbox .profile-modal-card") && localStorage.getItem("dma_tour_seen") === "1");
      const s2 = await stand(pg);
      sage(tour, "ohne dma_tour_seen erscheint die Tour");
      sage(weg && zu, "„Überspringen\" schließt sie und merkt es sich");
      sage(!s1.sync.length && !s1.sofort.length && !s2.sync.length && !s2.sofort.length, "Start mit Tour und „Überspringen\": kein synchroner Abruf", syncText(s2) || "0");
      sage(!pg.__fehler.length && s2.da.length === 0, "keine Seitenfehler, kein Stück eingesetzt", pg.__fehler.slice(0, 2).join(" | ") || "eingesetzt " + s2.da.length);
      freigeben(pg);
      await ctx.close();
    }
    if (lauf("8")) {
      const { ctx, pg } = await fenster(null, null, { halten: /./ });
      await pg.goto(HIER + "/index.html", { waitUntil: "commit" });
      await bereit(pg);
      await schlaf(800);
      const KASTEN = await pg.evaluate(() => [".question-card", ".sammel-text", ".kal-karte", ".lesetext", ".about-card", ".profile-modal-card", ".tile-detail",
        ".kompass-karte", ".bw-wortkarte", ".dlg-satz", ".breakdown-list", ".witz-karte", ".material-card", ".link-card", ".tip-card", ".guestbook-entry",
        ".inbox-message", ".community-text", ".fst-karte", ".weg-karte"].join(", "));
      const textTipp = async (ansicht) => {
        await pg.evaluate((t) => document.querySelector('.tape-tab[data-target="' + t + '"]').click(), ansicht);
        await schlaf(900);
        const b = await pg.evaluate(([v, K]) => {
          const e = [...document.querySelectorAll("#" + v + " p, #" + v + " h2, #" + v + " h3, #" + v + " li, #" + v + " span")].find((x) => {
            const r = x.getBoundingClientRect();
            return r.height > 8 && r.width > 40 && (x.textContent || "").trim().length > 10 && !x.querySelector("button, a, input")
              && !x.closest("button, a, input, select, textarea, label, summary, [role='button'], [contenteditable], svg, .sammel-wort, .speak-btn") && !x.closest(K);
          });
          if (!e) return null;
          e.scrollIntoView({ block: "center", behavior: "instant" });
          const r = e.getBoundingClientRect();
          return { x: r.x + Math.min(20, r.width / 2), y: r.y + r.height / 2, t: e.tagName.toLowerCase() + (e.className ? "." + String(e.className).split(" ")[0] : "") };
        }, [ansicht, KASTEN]);
        if (b) await pg.touchscreen.tap(b.x, b.y);
        await schlaf(600);
        return b ? ansicht.replace("view-", "") + " (" + b.t + ")" : "";
      };
      const getippt = [await textTipp("view-knowledge"), await textTipp("view-learn")].filter(Boolean);
      const s = await stand(pg);
      sage(getippt.length === 2, "zwei Tipps auf Text außerhalb der Betonungs-Kästen", getippt.join(", ") || "kein Ziel gefunden");
      sage(!s.sync.length && !s.sofort.length, "kein synchroner Abruf (betonungKastenFinden ist Kern)", syncText(s) || "0");
      sage(!pg.__fehler.length, "keine Seitenfehler", pg.__fehler.slice(0, 3).join(" | "));
      freigeben(pg);
      await ctx.close();
    }
  } catch (e) {
    console.error(e);
    fehler++;
  }
  await br.close();
  srv.close();
  console.log("\n" + (fehler ? "ROT: " + fehler + " Prüfung(en) – Abschnitte " + Array.from(new Set(rot)).join(", ") : "Fassung 886 (Sonde 885-stuecke): alles grün.") + "  [" + WURZEL + "]");
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
