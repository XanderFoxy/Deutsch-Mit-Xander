#!/usr/bin/env node
/* =====================================================================
   SONDE 884-beta — BETA-MELDUNGEN NUR BEI ECHTEM ANSEHEN (Fassung 884, Funk 310)
   ---------------------------------------------------------------------
   XANDER (Funk 310): „überprüfe bitte ob … ein Beta-Tester online kommt ob
   er wirklich Sachen testet oder ob das nur irgendwelche Quatsch ist".
   Befund (private_messages): bei jedem Seitenaufruf einer Beta-Person kamen
   in derselben Minute dieselben 9 Nachrichten „🧪 X testet gerade „Dichter &
   Denker“ / „Schnee von gestern“ / „Menschen, Dinge, Geschichten““ (3 Bereiche
   × 3 Admins). Ursache: renderKompass zeichnet die drei Bereiche beim Start
   verdeckt vor → renderComingSoonGate → notifyAdminsIfBetaTesting meldete
   schon beim Zeichnen. Dazu Meldungen für Spiele, die längst für alle offen
   sind („default true“, nie gesetzt: Betonungs-Trainer, Wortbaustelle).
   Ab 884: gemeldet wird erst, wenn der Bereich ≥ 50 % (bzw. den halben
   Bildschirm) 2 s am Stück zu sehen ist und die Person auf der Seite schon
   etwas angetippt hat; weiterhin einmal je Bereich und Sitzung.
   Geprüft auf einem Telefon (390 × 844, echte Fingertipps), Beta-Profil als
   Attrappe im Demo-Modus (Backend.signUp ohne Supabase, isBetaTester = true,
   keine Freigabe-Schalter gesetzt). Backend.notifyAdminsBetaTesting ist durch
   einen Zähler ersetzt – es geht nie eine Nachricht hinaus, und alle Anfragen
   nach draußen sind gesperrt.
     A  Start, nichts angetippt, 4 s: 0 Meldungen (bis 884: 3)
     A2 dann ein echter Tipp auf der Startseite, 3 s: weiterhin 0
     B  echter Tipp auf „Wissen“ (Kompass oben, Dichter & Denker weiter unten), 3 s: 0
     B1 „Dichter & Denker“ in den Blick, 3 s: genau 1 – „Dichter & Denker“
     B2 „Schnee von gestern“ nur 0,8 s im Blick, dann wieder hoch, 3 s: kein „Schnee“
     B3 Reiter weg und wieder her (Kompass neu gezeichnet), Dichter 3 s im Blick: weiterhin 1
     B4 „Schnee von gestern“ 3 s im Blick: jetzt 2, die zweite ist „Schnee von gestern“
     C  frische Seite ohne navigator.userActivation (wie Safari vor 16.4 – in
        Chromium lässt sich „nie angetippt“ nicht anders herstellen, weil
        Playwright jedes evaluate als Nutzergeste ausführt und damit
        hasBeenActive setzt), „Wissen“ per Programm (kein echter Tipp),
        Dichter 3 s im Blick: 0; dann echter Tipp auf die Überschrift, 2,6 s: 1
     D  frische Seite, echter Tipp auf „Lernen“, Artikel-Garten öffnen, 3 s:
        genau 1 – „Artikel-Garten“ (Spiel-Gate beim echten Öffnen, wie bisher)
     D2 Satzbrücke öffnen und nach 0,5 s zurück zur Liste, 3 s: kein „Satzbrücke“
     E  Betonungs-Trainer (default true, nie gesetzt = für alle frei) 3 s offen:
        keine Meldung „Betonungs-Trainer“
     F  keine Seitenfehler aus der Beta-Wache
   Schalter:
     QUELLE=1   index.html?quelle (ohne: min/ – vorher
                node werkzeug/fassung-setzen.js --nur-stempel)
     ALT=/pfad  app.js aus diesem Ordner, erzwingt ?quelle. Gegenprobe:
                mkdir -p $S/gegen884b/beta-vor && git show HEAD:app.js > $S/gegen884b/beta-vor/app.js
                (dann 11 rot: A, A2, B, B1, B2, B4, C ×2, D, D2, E – schon beim Start
                3 Meldungen; grün bleiben B3 „einmal je Sitzung“ und F)
     WURZEL=/pfad  ganzer Baum woanders (wie Sonde 884-ton310)
   EHRLICH: Gemessen wird in Chromium; Safari vor 16.4 kennt
   navigator.userActivation nicht – dort zählt der eigene Merker für einen
   echten Tipp (pointerdown/keydown/touchend, isTrusted). Ob eine Person
   den Bereich wirklich liest, kann keine Seite wissen; „2 s halb im Bild nach
   einem Tipp“ ist die Annäherung. Hintergrund-Tab (visibilityState) ist hier
   nicht nachgestellt.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL ? path.resolve(process.env.WURZEL) : path.join(__dirname, "..");
const ALT = process.env.ALT ? path.resolve(process.env.ALT) : "";
const QUELLE = Boolean(ALT || process.env.QUELLE);
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".webp": "image/webp", ".webmanifest": "application/manifest+json" };

let fehler = 0;
const roteTeile = {};
let teil = "";
const sage = (gut, was, zusatz) => {
  if (!gut) { fehler++; roteTeile[teil] = (roteTeile[teil] || 0) + 1; }
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const abschnitt = (t, titel) => { teil = t; console.log("\n" + t + "  " + titel + "\n"); };
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

/* Am Ende von backend.js (Quelle und min/): die Attrappe einhängen, bevor app.js läuft. */
const ANHANG = "\n;(function(){try{if(window.__betaAttrappe)window.__betaAttrappe(Backend);}catch(e){console.error('Attrappe:',e);}})();\n";

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = ALT && p === "/app.js" ? path.join(ALT, "app.js") : path.join(WURZEL, p);
    if (!(f.startsWith(WURZEL) || (ALT && f.startsWith(ALT))) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
    if (/(^|\/)backend\.js$/.test(p)) { a.end(fs.readFileSync(f, "utf8") + ANHANG); return; }
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const adresse = "http://127.0.0.1:" + srv.address().port + "/index.html" + (QUELLE ? "?quelle" : "");

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const seitenFehler = [];

  async function neueSeite(opt) {
    opt = opt || {};
    const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
      serviceWorkers: "block",
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
    await pg.addInitScript(() => {
      try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {}
      window.__beta = [];
      window.__betaAttrappe = (B) => {
        /* Demo-Modus: signUp setzt Konto und Profil, bevor es zum ersten Mal wartet. */
        B.signUp("maram@attrappe.test", "attrappe", "Maram");
        const p = B.currentProfile();
        if (p) {
          p.isBetaTester = true;
          p.extraProfileData = Object.assign({}, p.extraProfileData, { seenFoxIntro: true });   // kein Fuchs-Fenster über den Reitern
        }
        B.notifyAdminsBetaTesting = async (name, bereich, ziel) => {
          window.__beta.push({ name: name, bereich: bereich, ziel: ziel || "", t: Math.round(performance.now()) });
        };
      };
    });
    if (opt.ohneUserActivation) {
      await pg.addInitScript(() => { try { Object.defineProperty(Navigator.prototype, "userActivation", { get: () => undefined, configurable: true }); } catch (e) {} });
    }
    await pg.goto(adresse, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => document.getElementById("dichterArea") && document.getElementById("schneeArea")
      && typeof window.DMA_LESETEXTE_LADEN === "function", null, { timeout: 40000 });
    const stand = await pg.evaluate(() => ({ beta: Boolean(Backend.currentProfile() && Backend.currentProfile().isBetaTester),
      mod: Boolean(Backend.canModerate && Backend.canModerate()), konto: Boolean(Backend.isConfigured && Backend.zugang && Backend.zugang()) }));
    if (!stand.beta || stand.mod || stand.konto) throw new Error("Attrappe nicht wie gedacht: " + JSON.stringify(stand));
    return { ctx, pg };
  }
  const meldungen = (pg) => pg.evaluate(() => window.__beta.map((m) => m.bereich));
  const imBlick = (pg) => pg.evaluate(() => {
    const vh = innerHeight;
    const r = (id) => { const e = document.getElementById(id); if (!e) return "fehlt"; const b = e.getBoundingClientRect();
      if (!b.height) return "0×0"; const h = Math.min(b.bottom, vh) - Math.max(b.top, 0); return Math.max(0, Math.round(h)) + "/" + Math.round(Math.min(b.height, vh)); };
    return "D " + r("dichterArea") + " · S " + r("schneeArea") + " · M " + r("beitraegeArea");
  });
  const rolle = (pg, sel, block) => pg.evaluate(([s, b]) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: b || "start", behavior: "instant" }); }, [sel, block]);

  try {
    /* ---------------- A, B: Start und echtes Ansehen ---------------- */
    let { ctx, pg } = await neueSeite();
    abschnitt("A", "Start: Kompass ist verdeckt vorgezeichnet, nichts angetippt");
    await warte(4000);
    let m = await meldungen(pg);
    sage(m.length === 0, "nach dem Start 4 s: 0 Meldungen", JSON.stringify(m));
    abschnitt("A2", "ein echter Tipp auf der Startseite (Kompass bleibt verdeckt)");
    const ziel = await pg.evaluate(() => { const e = document.elementFromPoint(195, 760); return e ? e.tagName + (e.id ? "#" + e.id : "") : "nichts"; });
    await pg.touchscreen.tap(195, 760);
    await warte(3000);
    m = await meldungen(pg);
    const aktivA2 = await pg.evaluate(() => Boolean(navigator.userActivation && navigator.userActivation.hasBeenActive));
    sage(m.length === 0 && aktivA2, "nach Tipp auf der Startseite (" + ziel + ", hasBeenActive=" + aktivA2 + ") 3 s: 0 Meldungen", JSON.stringify(m));

    abschnitt("B", "echter Tipp auf „Wissen“");
    await pg.tap('.tape-tab[data-target="view-knowledge"]');
    await warte(3000);
    m = await meldungen(pg);
    const blickB = await imBlick(pg);
    sage(m.length === 0, "Kompass oben, Dichter & Denker noch nicht im Blick: 0 Meldungen", JSON.stringify(m) + "  " + blickB);

    abschnitt("B1", "„Dichter & Denker“ in den Blick, 3 s");
    await rolle(pg, "#kompass-dichter");
    await warte(600);
    await rolle(pg, "#kompass-dichter");   // nach dem Nachladen der Lesetexte steht der Bereich anders
    await warte(2600);
    m = await meldungen(pg);
    sage(m.length === 1 && m[0] === "Dichter & Denker", "genau 1 Meldung: „Dichter & Denker“", JSON.stringify(m) + "  " + (await imBlick(pg)));

    abschnitt("B2", "„Schnee von gestern“ nur 0,8 s im Blick");
    await rolle(pg, "#schneeArea");
    await warte(800);
    const blickB2 = await imBlick(pg);
    await rolle(pg, "#kompass-geschichte");
    await warte(3000);
    m = await meldungen(pg);
    sage(!m.includes("Schnee von gestern"), "kurzer Blick (< 2 s): keine Meldung „Schnee von gestern“", JSON.stringify(m) + "  im Vorbeirollen " + blickB2);

    abschnitt("B3", "Reiter weg und wieder her, Dichter erneut 3 s im Blick");
    await pg.tap('.tape-tab[data-target="view-learn"]');
    await warte(800);
    await pg.tap('.tape-tab[data-target="view-knowledge"]');
    await warte(600);
    await pg.evaluate(() => { const k = document.querySelector('#knowledgeSubnav [data-sub="sub-kompass"]'); if (k) k.click(); });
    await warte(400);
    await rolle(pg, "#kompass-dichter");
    await warte(3000);
    m = await meldungen(pg);
    sage(m.filter((x) => x === "Dichter & Denker").length === 1, "„Dichter & Denker“ weiterhin genau einmal (einmal je Sitzung)", JSON.stringify(m));

    abschnitt("B4", "„Schnee von gestern“ 3 s im Blick");
    await rolle(pg, "#kompass-schnee");
    await warte(600);
    await rolle(pg, "#kompass-schnee");
    await warte(2800);
    m = await meldungen(pg);
    sage(m.length === 2 && m[1] === "Schnee von gestern", "jetzt 2 Meldungen, die zweite „Schnee von gestern“", JSON.stringify(m) + "  " + (await imBlick(pg)));
    await ctx.close();

    /* ---------------- C: ohne echten Tipp ---------------- */
    ({ ctx, pg } = await neueSeite({ ohneUserActivation: true }));
    abschnitt("C", "frische Seite ohne navigator.userActivation, „Wissen“ per Programm (kein echter Tipp)");
    await pg.evaluate(() => { document.querySelector('.tape-tab[data-target="view-knowledge"]').click(); });
    await warte(3000);   // wie in B: Kalender lädt nach 1,2 s und zeichnet den Kompass neu
    await rolle(pg, "#kompass-dichter");
    await warte(600);
    await rolle(pg, "#kompass-dichter");
    await warte(2800);
    const ua = await pg.evaluate(() => String(navigator.userActivation));
    m = await meldungen(pg);
    const blickC = await imBlick(pg);
    sage(ua === "undefined" && m.length === 0 && /^D (\d+)\/\1 /.test(blickC), "Dichter 3 s ganz im Blick, aber nie angetippt: 0 Meldungen", "userActivation=" + ua + " " + JSON.stringify(m) + "  " + blickC);
    const kopf = await pg.evaluate(() => { const b = document.getElementById("kompass-dichter").getBoundingClientRect(); return { x: Math.round(b.left + Math.min(40, b.width / 2)), y: Math.round(b.top + b.height / 2), sichtbar: b.top >= 0 && b.bottom <= innerHeight }; });
    if (kopf.sichtbar) await pg.touchscreen.tap(kopf.x, kopf.y); else await pg.touchscreen.tap(195, 600);
    await warte(2600);
    m = await meldungen(pg);
    sage(m.length === 1 && m[0] === "Dichter & Denker", "nach echtem Tipp (Bereich weiter im Blick): genau 1 – „Dichter & Denker“", JSON.stringify(m));
    await ctx.close();

    /* ---------------- D, E: Spiele ---------------- */
    ({ ctx, pg } = await neueSeite());
    abschnitt("D", "Spiel: echter Tipp auf „Lernen“, Artikel-Garten öffnen");
    await pg.tap('.tape-tab[data-target="view-learn"]');
    await warte(800);
    await pg.evaluate(() => { document.querySelector('#learnSubnav [data-sub="sub-artikelgarten"]').click(); });
    await warte(400);
    await pg.evaluate(() => { const e = document.getElementById("artikelgartenArea"); if (e) e.scrollIntoView({ block: "start", behavior: "instant" }); });
    await warte(3000);
    m = await meldungen(pg);
    const ag = await pg.evaluate(() => { const e = document.getElementById("artikelgartenArea"); const b = e.getBoundingClientRect(); return Math.round(b.top) + ".." + Math.round(b.bottom) + " h" + innerHeight; });
    sage(m.length === 1 && m[0] === "Artikel-Garten", "genau 1 Meldung: „Artikel-Garten“", JSON.stringify(m) + "  Bereich " + ag);

    abschnitt("D2", "Satzbrücke öffnen und nach 0,5 s zurück zur Spieleliste");
    await pg.evaluate(() => { document.querySelector('#learnSubnav [data-sub="sub-satzbruecke"]').click(); });
    await warte(500);
    await pg.evaluate(() => { const z = document.querySelector('#sub-satzbruecke [data-zur-spieleliste]') || document.querySelector('#learnSubnav [data-sub="sub-games"]'); if (z) z.click(); });
    await warte(3000);
    m = await meldungen(pg);
    sage(!m.includes("Satzbrücke"), "kurz geöffnet (< 2 s): keine Meldung „Satzbrücke“", JSON.stringify(m));

    abschnitt("E", "Betonungs-Trainer (default true, nie gesetzt = für alle frei) 3 s offen");
    await pg.evaluate(() => { document.querySelector('#learnSubnav [data-sub="sub-stresstrainer"]').click(); });
    await warte(400);
    await pg.evaluate(() => { const e = document.getElementById("stressTrainerArea"); if (e) e.scrollIntoView({ block: "start", behavior: "instant" }); });
    await warte(3000);
    const roh = await pg.evaluate(() => String(Backend.getRawFeatureFlagValue("betonungstrainer_aktiv")));
    m = await meldungen(pg);
    sage(!m.includes("Betonungs-Trainer"), "keine Meldung „Betonungs-Trainer“ (Schalter: " + roh + ")", JSON.stringify(m));
    await ctx.close();

    abschnitt("F", "Seitenfehler");
    const beta = seitenFehler.filter((t) => /beta|IntersectionObserver/i.test(t));
    sage(beta.length === 0, "keine Seitenfehler aus der Beta-Wache", beta.slice(0, 3).join(" | "));
    if (seitenFehler.length) console.log("  (andere Seitenfehler, nur zur Kenntnis: " + seitenFehler.length + " – " + [...new Set(seitenFehler)].slice(0, 3).join(" | ").slice(0, 300) + ")");
  } catch (e) {
    fehler++;
    console.log("  FEHL Abbruch: " + (e && e.stack ? e.stack.split("\n").slice(0, 3).join(" / ") : e));
  }
  await br.close();
  srv.close();
  console.log("\n" + (fehler ? "ROT: " + fehler + " (" + Object.entries(roteTeile).map(([t, n]) => t + ":" + n).join(", ") + ")" : "GRÜN") + "  [" + (ALT ? "ALT=" + ALT : QUELLE ? "?quelle" : "min/") + "]");
  process.exit(fehler ? 1 : 0);
})();
