#!/usr/bin/env node
/* =====================================================================
   SONDE 884-SITZ — DER PLATZWECHSEL WIRD BEIM GEGENÜBER GEMESSEN
   ---------------------------------------------------------------------
   XANDER (Funk 268): „die Latenz bei den Sitzplätzen ist immer noch
   bemerkbar“. Seit 836 geht jede Sitzmeldung direkt (Datenkanal) und
   über den Server – wie lange sie beim ANDEREN braucht, stand nirgends.
   Zwei echte Chromium-Seiten aus den QUELLEN (index.html?quelle) bauen
   eine echte WebRTC-Leitung mit echtem Datenkanal auf (wie 856); den
   Supabase-Kanal spielt die Sonde und kann Sitzmeldungen zurückhalten.
   Berichte an den Betreiber fängt ein nachgebauter rpc ab (wie 861).
   Ein kleines #lcPlaetze (8 Plätze, data-lc-id aus lage().plaetze) steht
   für die Plätze im Klassenzimmer. Geprüft:
     1  Leitung steht, Kanal beidseitig bereit
     2  A nimmt einen freien Platz (Server zurückgehalten): B sieht ihn
        in unter 300 ms
     3  A hat die Quittung: rtt ["bbb", ms, "d", belegt, bild], 0 ≤ ms < 150,
        0 ≤ belegt ≤ bild (ab wann der Absender selbst wieder frei war)
     4  B hat die Probe ["d", dom, mo, bild, vor, 1], 0 ≤ dom ≤ mo ≤ bild
     5  Server-Kopie freigegeben: vor > 0 in derselben Probe, nichts neu
        gezeichnet, Chatzeile genau einmal, Nachsendungen ohne Quittung
        und ohne Probe
     7  Selbstheilung: A vergisst bbb, B wechselt (direkt) → A wieder
        bereit („jede Nachricht macht bereit“)
     6  Server-Weg: beide vergessen einander, A wechselt → raus.ohne.bereit
        +1, raus.direkt unverändert; B bekommt es nur über den Server
        (Probe "s") und quittiert über den Server (A: rtt "s"); ein zweiter
        Wechsel in 10 s → kein zweites Server-Echo
     8  Antwort auf das Hallo: beide vergessen, B schickt ein Hallo →
        A für bbb UND B für aaa bereit (das zweite nur durch die Antwort);
        „bitte“: hat B schon einmal geantwortet, bleibt ein schlichtes
        zweites Hallo unbeantwortet (kein Hin und Her), eines mit „bitte“
        wird beantwortet
     9  Bericht „sitz“: genau ein rpc, < 6000 Zeichen, Felder rtt/ein/raus/
        kan, raus.srv.kein ≥ 1; Tageszähler nur für Angenommenes: heutiger
        Server (Antwort ohne „sitz“) 1 je Tag, Gast (kein currentUser) →
        gar kein rpc, Anmeldung abgelehnt (42501/401) und ok:false ohne
        Grund → nicht gezählt und kein zweiter Versuch im selben Betreten,
        Netzfehler (error mit status 0) und abgelehntes Versprechen →
        zurückgenommen (der Tag ist nicht verbraucht), „genug für heute“ →
        heute nichts mehr, neuer Server (Antwort mit „sitz“) 4 je Tag,
        sagt eine angenommene Antwort „sitz“ nicht mehr → wieder 1 je Tag
        (s = 0); höchstens 2 je Betreten. Angemeldet ist die Seite nur
        während des ausdrücklichen Sendens (pruefSitzMess) – die eigenen
        Uhren (12 Werte / 90 s) schicken in der Sonde also nichts.
    10  Quelltext (wie vorher) und VERHALTEN: der Streifen wird bei
        „plaetze“ (eigenes Sprechen, empfangenes „redet“) nicht neu
        geschrieben, bei einer vollen Meldung schon; eigenes Sprechen
        meldet nur „plaetze“ und der Ring steht (und geht) am eigenen
        Platz im echten Klassenzimmer
    11  keine Fehler in der Konsole
   Ausgegeben (nicht geprüft): die Probe bei 4-fach gedrosselter CPU beim
   EMPFÄNGER (kleines #lcPlaetze, echtes Klassenzimmer).
    12  ABSENDER mit echtem Klassenzimmer beschäftigt (die Sonde hält A
        nach dem Senden 80 ms in derselben Aufgabe fest), Netz ~1 ms:
        belegt ≥ 80, ms ≥ 80, belegt ≤ bild, ms ≤ bild + 5 (5 von 5) –
        die Wartezeit auf den Absender steht in belegt/bild, die Lesart
        „Netz zwischen ms − bild und ms“ gilt. Bei echter Drosselung (CPU
        1×/6×) nur Ausgabe: wo die Quittung zwischen belegt und bild
        drankommt, entscheidet Chromium (884b: „ms − belegt ≤ 5 in 4 von
        5“ wackelte, am unveränderten Stand in 1 von 5 Läufen rot).
    13  TRENNSCHARF: B hält seine Quittung 300 ms zurück (dc.send für
        „sitz-q“ verzögert), A ungedrosselt: ms ≥ 300, aber bild < 150 und
        ms − bild ≥ 150, belegt ≤ bild (5 von 5) – belegt/bild messen den
        Absender, nicht die Quittung (eine Fälschung belegt = bild = ms
        beim Eintreffen wäre hier rot).
   GEGENPROBE: ALT=<Ordner> – Dateien, die dort liegen (livechat.js,
   app.js), liefert der Sonden-Server statt der Repo-Dateien aus; auch die
   Quelltext-Prüfungen lesen sie. Erwartet: rot.
   Aufruf: node werkzeug/pruefe-884-sitz.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const ALT = process.env.ALT || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const schlaf = (ms) => new Promise((r) => setTimeout(r, ms));
/* Datei aus ALT (falls dort vorhanden), sonst aus dem Repo */
const datei = (name) => {
  const a = ALT && path.join(ALT, name);
  return fs.readFileSync(a && fs.existsSync(a) ? a : path.join(WURZEL, name), "utf8");
};

(async () => {
  if (ALT) console.log("GEGENPROBE: Dateien aus " + ALT + " (" + fs.readdirSync(ALT).join(", ") + ")");
  const ausAlt = [];
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    let f = path.join(WURZEL, p);
    if (ALT) {
      const g = path.join(ALT, p);
      if (g.startsWith(ALT) && fs.existsSync(g) && !fs.statSync(g).isDirectory()) { f = g; if (ausAlt.indexOf(p) < 0) ausAlt.push(p); }
    }
    if ((!f.startsWith(WURZEL) && !(ALT && f.startsWith(ALT))) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--disable-features=WebRtcHideLocalIpsWithMdns"] });
  const url = "http://127.0.0.1:" + srv.address().port + "/index.html?quelle";

  async function seite(ich, anderer) {
    const ctx = await br.newContext({ viewport: { width: 393, height: 800 } });
    const pg = await ctx.newPage();
    pg.__fehler = [];
    pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.removeItem("dma_sitz_mess"); } catch (e) {} });
    await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    await pg.goto(url, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_SPIEL, null, { timeout: 60000 });
    const vorher = await pg.evaluate(([ich, anderer]) => {
      window.LiveChat.pruefSitz({ lage: "drin", ichId: ich, ichName: ich.toUpperCase(), seit: ich === "aaa" ? 1000 : 2000, buehne: true, zuruecksetzen: true,
        leute: { [anderer]: { id: anderer, name: anderer.toUpperCase(), seit: anderer === "aaa" ? 1000 : 2000, gesehen: 9e15, buehne: true, bild: "" } } });
      window.__raus = [];
      window.LiveChat.pruefAbfangen((p) => window.__raus.push(JSON.parse(JSON.stringify(p))));
      window.__arten = [];
      window.LiveChat.beiAenderung((l, art) => window.__arten.push(art || "voll"));
      window.DMA_SPIEL.empfangen = () => {};
      /* Berichte an den Betreiber abfangen (statt Supabase). __rpcAntwort: ein Objekt = data wie vom Server (Standard:
         was spiel_diagnose_senden heute antwortet – ohne „sitz“); { __fehler, status } = Fehler wie supabase-js ihn
         liefert (Netz: status 0; anon ohne EXECUTE: 42501/401); "werfen" = das Versprechen wird abgelehnt. */
      window.__berichte = [];
      window.__rpcAntwort = { ok: true, mess: 12, ton: 20 };
      const be = (typeof Backend !== "undefined" ? Backend : window.Backend);
      be.zugang = () => ({ rpc: (name, a) => {
        window.__berichte.push({ name, art: a && a.p_art, d: a && JSON.parse(JSON.stringify(a.p_daten)) });
        const w = JSON.parse(JSON.stringify(window.__rpcAntwort));
        if (w === "werfen") return Promise.reject(new Error("TypeError: Failed to fetch"));
        if (w && w.__fehler) return Promise.resolve({ data: null, error: w.__fehler, status: w.status });
        return Promise.resolve({ data: w, error: null, status: 200 }); } });
      /* Angemeldet NUR während des ausdrücklichen Sendens (window.__nutzer setzt mess() unten für diesen einen
         Aufruf): der Rest der Seite bleibt abgemeldet wie bisher, und die eigenen Uhren schicken nichts dazwischen. */
      window.__nutzer = null;
      be.currentUser = () => window.__nutzer;
      /* Ein kleines #lcPlaetze: 8 Plätze, data-lc-id wie im Klassenzimmer (livechatPlaetzeAuffrischen) */
      const schon = Boolean(document.getElementById("lcPlaetze"));
      const box = document.createElement("div");
      box.id = "lcPlaetze"; box.dataset.sonde = "1";
      for (let i = 1; i <= 8; i++) { const b = document.createElement("div"); b.className = "lc-platz"; b.dataset.lcPlatz = String(i); box.appendChild(b); }
      document.body.appendChild(box);
      const fuell = (l) => {
        if (!box.isConnected || !l || !l.plaetze) return;
        l.plaetze.forEach((p) => { const el = box.querySelector('[data-lc-platz="' + p.nummer + '"]'); if (el) el.dataset.lcId = p.leer ? "" : (p.id || ""); });
      };
      window.LiveChat.beiAenderung(fuell);
      fuell(window.LiveChat.lage());
      return { schon, sichtbar: document.visibilityState };
    }, [ich, anderer]);
    if (vorher.schon) console.log("   Hinweis: auf " + ich + " stand schon ein #lcPlaetze");
    if (vorher.sichtbar !== "visible") console.log("   Hinweis: " + ich + " ist " + vorher.sichtbar + " (rAF läuft dann nicht)");
    return pg;
  }

  /* Der „Server": trägt Pakete hinüber; Sitzmeldungen kann er zurückhalten. Zählt die Quittungen über den Server. */
  let sitzZurueck = false, laeuft = true;
  const zurueck = [], serverQ = { "aaa>bbb": 0, "bbb>aaa": 0 };
  async function tragen(von, nach, wegName) {
    while (laeuft) {
      let pakete = [];
      try { pakete = await von.evaluate(() => window.__raus.splice(0)); } catch (e) { break; }
      for (const p of pakete) {
        if (p.art === "sitz-q") serverQ[wegName]++;
        if (sitzZurueck && (p.art === "sitzplatz" || p.art === "spielsitz")) { zurueck.push({ nach, p }); continue; }
        try { await nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), p); } catch (e) {}
      }
      await schlaf(15);
    }
  }
  const A = await seite("aaa", "bbb"), B = await seite("bbb", "aaa");
  tragen(A, B, "aaa>bbb"); tragen(B, A, "bbb>aaa");

  /* Prüf-Haken, die es erst ab 884 gibt: fehlen sie (Gegenprobe), kommt null zurück */
  /* o.senden: angemeldet (o.gast: nicht) genau für diesen einen Aufruf */
  const mess = (pg, o) => pg.evaluate((o) => {
    if (!window.LiveChat.pruefSitzMess) return null;
    window.__nutzer = o && o.senden && !o.gast ? { id: "sonde" } : null;
    try { return window.LiveChat.pruefSitzMess(o); } finally { window.__nutzer = null; }
  }, o || null);
  const vergessen = (pg, id, hallo) => pg.evaluate(([id, hallo]) => {
    if (!window.LiveChat.pruefKanalVergessen) return false;
    window.LiveChat.pruefKanalVergessen(id, hallo); return true;
  }, [id, hallo === "bitte" ? "bitte" : Boolean(hallo)]);
  const bereit = async (pg, id) => (await pg.evaluate(() => window.LiveChat.pruefKanal())).bereit.indexOf(id) >= 0;
  const platzVon = (pg, id) => pg.evaluate((id) => { const p = window.LiveChat.pruefSitz().plaetze.find((x) => x.id === id); return p ? p.nummer : null; }, id);
  const freierPlatz = (pg) => pg.evaluate(() => { const p = window.LiveChat.pruefSitz().plaetze.filter((x) => x.leer); return p.length ? p[p.length - 1].nummer : null; });
  const zeilen = (pg, re) => pg.evaluate((q) => window.LiveChat.lage().nachrichten.filter((n) => new RegExp(q).test(n.text || "")).length, re);
  const warteAuf = async (f, ms) => { const bis = Date.now() + ms; let w = null; while (Date.now() < bis) { w = await f(); if (w) return w; await schlaf(20); } return w; };
  const sitzBerichte = (pg) => pg.evaluate(() => window.__berichte.filter((b) => b.art === "sitz"));

  console.log("\n1  LEITUNG\n");
  /* Leitung aufbauen wie in 659/856: B grüßt, A (kleinere Kennung) ruft an */
  await A.evaluate(() => window.LiveChat.pruefEmpfangen({ art: "hallo", von: "bbb", name: "BBB", seit: 2000, kf: 1 }));
  const steht = await warteAuf(async () => (await bereit(A, "bbb")) && (await bereit(B, "aaa")), 15000);
  sage(!!steht, "1: die Leitung steht und der Datenkanal ist auf beiden Seiten bereit");

  console.log("\n2–5  PLATZWECHSEL DIREKT, SERVER ZURÜCKGEHALTEN\n");
  const ziel = await freierPlatz(A);
  sitzZurueck = true;
  await B.evaluate(() => { window.__arten.length = 0; });
  const t0 = Date.now();
  const erg = await A.evaluate((n) => window.LiveChat.platzNehmen(n), ziel);
  let da = -1;
  for (let i = 0; i < 200; i++) { if ((await platzVon(B, "aaa")) === ziel) { da = Date.now() - t0; break; } await schlaf(5); }
  sage(erg && erg.ok && da >= 0 && da < 300, "2: A nimmt Platz " + ziel + ", B sieht ihn über den Datenkanal in unter 300 ms", da + " ms");
  const mA = await warteAuf(async () => { const m = await mess(A); return m && m.rtt.length && m.rtt[0][4] != null ? m : null; }, 1500)
    || await mess(A);
  const q1 = mA && mA.rtt[0];
  sage(!!(q1 && q1[0] === "bbb" && q1[2] === "d" && q1[1] >= 0 && q1[1] < 150), "3: A hat die Quittung über den Datenkanal: rtt [\"bbb\", ms, \"d\", …], 0 ≤ ms < 150", JSON.stringify(mA && mA.rtt));
  sage(!!(q1 && q1.length === 5 && typeof q1[3] === "number" && typeof q1[4] === "number" && q1[3] >= 0 && q1[3] <= q1[4]),
    "3: dazu, ab wann A selbst wieder frei war: belegt (setTimeout 0) und bild (nächstes Bild), 0 ≤ belegt ≤ bild", JSON.stringify(q1));
  const mB = await warteAuf(async () => { const m = await mess(B); return m && m.ein.length && m.ein[0][3] != null ? m : null; }, 1500);
  const p1 = mB && mB.ein[0];
  sage(!!(p1 && p1[0] === "d" && p1[1] >= 0 && p1[1] <= p1[2] && p1[2] <= p1[3] && p1[5] === 1),
    "4: B hat die Probe [\"d\", dom, mo, bild, vor, gez] mit 0 ≤ dom ≤ mo ≤ bild, gez = 1 (der Platz steht im DOM)", JSON.stringify(p1));
  /* jetzt die Server-Kopien (und die Nachsendungen) */
  await schlaf(1500);
  sitzZurueck = false;
  await B.evaluate(() => { window.__arten.length = 0; });
  for (const z of zurueck.splice(0)) await z.nach.evaluate((p) => window.LiveChat.pruefEmpfangen(p), z.p);
  await schlaf(300);
  const mB2 = await mess(B), mA2 = await mess(A);
  const p1b = mB2 && mB2.ein[0];
  sage(!!(p1b && p1b[4] > 0), "5: in derselben Probe steht jetzt vor > 0 (so viel früher kam der Datenkanal)", JSON.stringify(p1b));
  const artenB = await B.evaluate(() => window.__arten.slice());
  sage(artenB.length === 0, "5: die Server-Kopien und Nachsendungen zeichnen nichts", JSON.stringify(artenB));
  sage(await zeilen(B, "setzt sich auf Platz " + ziel) === 1, "5: die Chatzeile „setzt sich auf Platz …“ steht bei B genau einmal");
  sage(!!(mA2 && mA2.rtt.length === 1 && mB2 && mB2.ein.length === 1), "5: die Nachsendungen (nach:1) erzeugen weder Quittung noch Probe",
    mA2 && mB2 ? "rtt " + mA2.rtt.length + ", ein " + mB2.ein.length : "kein pruefSitzMess");

  console.log("\n7  SELBSTHEILUNG: JEDE NACHRICHT MACHT BEREIT\n");
  const v7 = await vergessen(A, "bbb");
  const wegA = !(await bereit(A, "bbb"));
  const zielB = await freierPlatz(B);
  await B.evaluate((n) => window.LiveChat.platzNehmen(n), zielB);
  const geheilt = await warteAuf(() => bereit(A, "bbb"), 1500);
  sage(v7 && wegA && !!geheilt, "7: A vergisst bbb, B wechselt (direkt) → bbb steht wieder in A.pruefKanal().bereit");
  await schlaf(1400);   // Nachsendungen von B vorbei

  console.log("\n6  SERVER-WEG UND BEREITSCHAFT\n");
  const v6 = (await vergessen(A, "bbb")) && (await vergessen(B, "aaa"));
  const r0 = await mess(A), q0 = serverQ["bbb>aaa"];
  const ein0 = (await mess(B) || { ein: [] }).ein.length;
  const ziel6 = await freierPlatz(A);
  await A.evaluate((n) => window.LiveChat.platzNehmen(n), ziel6);
  await warteAuf(async () => (await platzVon(B, "aaa")) === ziel6, 1500);
  const r1 = await mess(A);
  sage(!!(v6 && r0 && r1 && r1.raus.ohne.bereit === r0.raus.ohne.bereit + 1 && r1.raus.direkt === r0.raus.direkt),
    "6: A wechselt ohne bereiten Kanal: raus.ohne.bereit +1, raus.direkt unverändert", r1 && JSON.stringify(r1.raus));
  const mB6 = await warteAuf(async () => { const m = await mess(B); return m && m.ein.length > ein0 ? m : null; }, 1500);
  const p6 = mB6 && mB6.ein[mB6.ein.length - 1];
  sage(!!(p6 && p6[0] === "s"), "6: B bekommt die Meldung nur über den Server (Probe w = \"s\")", JSON.stringify(p6));
  const qS = await warteAuf(async () => { const m = await mess(A); return m && m.rtt.some((x) => x[2] === "s") ? m : null; }, 2000);
  sage(serverQ["bbb>aaa"] === q0 + 1 && !!qS, "6: B quittiert über den Server, A hat rtt mit w = \"s\"",
    "Server-Echos " + (serverQ["bbb>aaa"] - q0) + ", rtt " + JSON.stringify(qS && qS.rtt));
  await schlaf(400);
  const ziel6b = await freierPlatz(A);
  await A.evaluate((n) => window.LiveChat.platzNehmen(n), ziel6b);
  await warteAuf(async () => (await platzVon(B, "aaa")) === ziel6b, 1500);
  await schlaf(1500);   // samt Nachsendungen
  const mB6b = await mess(B);
  sage(serverQ["bbb>aaa"] === q0 + 1 && !!(mB6b && mB6b.ein.length === ein0 + 2), "6: ein zweiter Wechsel in 10 s → kein zweites Server-Echo (gedrosselt)",
    "Server-Echos " + (serverQ["bbb>aaa"] - q0) + ", Proben bei B +" + (mB6b ? mB6b.ein.length - ein0 : "?"));

  console.log("\n8  ANTWORT AUF DAS HALLO\n");
  const v8 = (await vergessen(A, "bbb")) && (await vergessen(B, "aaa", true));
  const beide = await warteAuf(async () => (await bereit(A, "bbb")) && (await bereit(B, "aaa")), 2000);
  const aB = await bereit(A, "bbb"), bA = await bereit(B, "aaa");
  sage(v8 && !!beide, "8: B schickt ein Hallo → A ist für bbb UND B für aaa bereit (das zweite nur durch die Antwort)", "A→bbb " + aB + ", B→aaa " + bA);
  /* „bitte“: A grüßt, B antwortet (B hat seine eine Antwort auf diesem Kanal damit vergeben). A vergisst noch einmal:
     ein schlichtes Hallo bleibt jetzt unbeantwortet (kein Hin und Her) – eines mit „bitte“ (wie das zweite Hallo nach
     1,5 s) wird beantwortet. */
  await vergessen(A, "bbb", true);
  const g1 = await warteAuf(() => bereit(A, "bbb"), 1500);
  await vergessen(A, "bbb", true);
  await schlaf(700);
  const ohneBitte = await bereit(A, "bbb");
  await vergessen(A, "bbb", "bitte");
  const mitBitte = await warteAuf(() => bereit(A, "bbb"), 1500);
  sage(!!g1 && !ohneBitte && !!mitBitte, "8: ein zweites schlichtes Hallo bleibt unbeantwortet, eines mit „bitte“ wird beantwortet",
    "erste Antwort " + !!g1 + ", ohne bitte bereit " + ohneBitte + ", mit bitte " + !!mitBitte);

  console.log("\n9  DER BERICHT „sitz“\n");
  const heute = await A.evaluate(() => { const d0 = new Date(); return d0.getFullYear() + "-" + ("0" + (d0.getMonth() + 1)).slice(-2) + "-" + ("0" + d0.getDate()).slice(-2); });
  const antwort = (a) => A.evaluate((a) => { window.__rpcAntwort = a; }, a);
  const zaehler = () => A.evaluate(() => localStorage.getItem("dma_sitz_mess"));
  const zahl = async () => (await sitzBerichte(A)).length;
  const wechselMitQuittung = async () => {
    const vor = (await mess(A) || { rtt: [] }).rtt.length;
    const z = await freierPlatz(A);
    await A.evaluate((n) => window.LiveChat.platzNehmen(n), z);
    return warteAuf(async () => { const m = await mess(A); return m && m.rtt.length > vor ? m : null; }, 1500);
  };
  const vorBer = await zahl();
  sage(vorBer === 0, "9: vor dem ersten Aufruf ging noch kein Bericht hinaus (keine 12 Werte, keine 90 s)", String(vorBer));
  const HEUTE_SRV = { ok: true, mess: 12, ton: 20 };   // was spiel_diagnose_senden heute antwortet (ohne „sitz“, nachgelesen 13.10.)
  /* Ein Fall: frische Werte (ein Wechsel mit Quittung), Zähler leeren (bzw. vorgeben), Antwort setzen, wie ein neues
     Betreten senden; danach Zähler und rpc-Zahl. Jeder Fall steht damit für sich – fällt in einer Gegenprobe einer um,
     reißt er die folgenden nicht mit (rot wird nur, was im Code anders ist). */
  const fall = async (zaehlerVorher, a, o) => {
    await wechselMitQuittung();
    await A.evaluate((z) => { if (z == null) localStorage.removeItem("dma_sitz_mess"); else localStorage.setItem("dma_sitz_mess", z); }, zaehlerVorher);
    await antwort(a);
    const vor = await zahl();
    const s = await mess(A, Object.assign({ senden: true, neu: true }, o || {}));
    await schlaf(60);                                  // die Antwort ist ein aufgelöstes Versprechen – einen Takt später ist sie verarbeitet
    return { s, z: await zaehler(), rpc: (await zahl()) - vor };
  };
  /* a) heutiger Server: 1 je Tag – mit heute|1 geht nichts hinaus, obwohl Werte da sind */
  await A.evaluate((h) => localStorage.setItem("dma_sitz_mess", h + "|1"), heute);
  const s0 = await mess(A, { senden: true });
  sage(!!s0 && s0.gesendetJetzt === false && (await zahl()) === vorBer && (s0.rtt.length + s0.ein.length) > 0,
    "9: solange der Server „sitz“ mit allen Arten zählt: mit heute|1 geht nichts hinaus (1 je Tag – die Leitungsberichte haben Vorrang)",
    s0 ? "rtt " + s0.rtt.length + ", ein " + s0.ein.length : "kein pruefSitzMess");
  /* b) der erste Bericht */
  await A.evaluate(() => localStorage.removeItem("dma_sitz_mess"));
  const s1 = await mess(A, { senden: true });
  const b1 = await sitzBerichte(A), d1 = b1[0] && b1[0].d;
  sage(!!s1 && s1.gesendetJetzt === true && b1.length === 1 && b1[0].name === "spiel_diagnose_senden", "9: pruefSitzMess({ senden: true }) → genau ein rpc spiel_diagnose_senden mit p_art „sitz“", String(b1.length));
  sage(!!d1 && JSON.stringify(d1).length < 6000 && Array.isArray(d1.rtt) && Array.isArray(d1.ein) && d1.raus && d1.kan && d1.kan.bbb,
    "9: unter 6000 Zeichen, mit rtt, ein, raus, kan", d1 ? JSON.stringify(d1).length + " Zeichen: " + JSON.stringify(d1).slice(0, 420) : "");
  sage(!!(d1 && d1.rtt.length && d1.rtt.every((x) => x.length === 5 && typeof x[3] === "number")), "9: jede Quittung im Bericht trägt belegt und bild", d1 && JSON.stringify(d1.rtt));
  sage(!!(d1 && d1.raus.srv && d1.raus.srv.kein >= 1), "9: raus.srv.kein ≥ 1 (die Sonde hat keinen echten Raumkanal)", d1 && JSON.stringify(d1.raus.srv));
  await schlaf(60);
  sage((await zaehler()) === heute + "|1|0", "9: angenommen (heutiger Server, Antwort ohne „sitz“) → Tageszähler heute|1|0", await zaehler());
  await wechselMitQuittung();
  const s2 = await mess(A, { senden: true });
  sage(!!(s2 && s2.gesendetJetzt === false && s2.rtt.length > 0 && (await zahl()) === 1), "9: heutiger Server: der zweite Bericht am selben Tag geht nicht hinaus", "Berichte " + (await zahl()));
  /* c) Gast (kein Backend.currentUser): gar kein rpc, nichts gezählt, obwohl Werte da sind */
  const fG = await fall(null, HEUTE_SRV, { gast: true });
  sage(!!(fG.s && fG.s.gesendetJetzt === false && fG.rpc === 0 && fG.z === null && fG.s.rtt.length > 0),
    "9: Gast (nicht angemeldet): kein rpc – anon darf spiel_diagnose_senden nicht ausführen (42501), es ginge ins Leere",
    "rpc " + fG.rpc + ", Zähler " + fG.z);
  /* d) angemeldet, aber der Server lehnt die Anmeldung ab (abgelaufen; anon ohne EXECUTE): nicht gezählt, und in diesem
        Betreten kein zweiter Versuch */
  const f42 = await fall(null, { __fehler: { code: "42501", message: "permission denied for function spiel_diagnose_senden" }, status: 401 });
  await wechselMitQuittung();
  const vor42 = await zahl();
  const s42b = await mess(A, { senden: true });
  sage(!!(f42.s && f42.s.gesendetJetzt === true && f42.rpc === 1 && f42.z === heute + "|0|0" && s42b && s42b.gesendetJetzt === false && (await zahl()) === vor42),
    "9: Anmeldung abgelehnt (42501, status 401): nicht gezählt, in diesem Betreten kein zweiter Versuch",
    "Zähler " + f42.z + ", zweiter Versuch " + (s42b && s42b.gesendetJetzt));
  /* e) ok:false ohne Grund (der Server sah kein auth.uid()) → genauso */
  const fOk = await fall(null, { ok: false });
  await wechselMitQuittung();
  const vorOk = await zahl();
  const sOkb = await mess(A, { senden: true });
  sage(!!(fOk.s && fOk.s.gesendetJetzt === true && fOk.rpc === 1 && fOk.z === heute + "|0|0" && sOkb && sOkb.gesendetJetzt === false && (await zahl()) === vorOk),
    "9: ok:false ohne Grund: nicht gezählt, in diesem Betreten kein zweiter Versuch", "Zähler " + fOk.z + ", zweiter Versuch " + (sOkb && sOkb.gesendetJetzt));
  /* f) Netzfehler (supabase-js: error mit status 0): zurückgenommen – der Tag ist nicht verbraucht, der nächste Bericht
        im selben Betreten geht hinaus */
  const fNetz = await fall(null, { __fehler: { code: "", message: "TypeError: Failed to fetch" }, status: 0 });
  await wechselMitQuittung();
  await antwort(HEUTE_SRV);
  const vorNetz = await zahl();
  const sNetzb = await mess(A, { senden: true });
  await schlaf(60);
  const zNetzb = await zaehler();
  sage(!!(fNetz.s && fNetz.s.gesendetJetzt === true && fNetz.rpc === 1 && fNetz.z === heute + "|0|0"
      && sNetzb && sNetzb.gesendetJetzt === true && (await zahl()) === vorNetz + 1 && zNetzb === heute + "|1|0"),
    "9: Netzfehler (status 0): zurückgenommen, der nächste Bericht im selben Betreten geht hinaus und zählt",
    "nach dem Fehler " + fNetz.z + ", danach " + zNetzb);
  /* g) das Versprechen wird abgelehnt: ebenso zurückgenommen */
  const fWirft = await fall(null, "werfen");
  sage(!!(fWirft.s && fWirft.s.gesendetJetzt === true && fWirft.rpc === 1 && fWirft.z === heute + "|0|0"),
    "9: rpc abgelehnt (Promise.reject): zurückgenommen", "Zähler " + fWirft.z);
  /* h) „genug für heute“ → heute nichts mehr */
  const f99 = await fall(null, { ok: false, grund: "genug für heute" });
  await wechselMitQuittung();
  const vor99 = await zahl();
  const s99b = await mess(A, { senden: true, neu: true });
  sage(!!(f99.s && f99.s.gesendetJetzt === true && f99.z === heute + "|99|0" && s99b && s99b.gesendetJetzt === false && (await zahl()) === vor99),
    "9: „genug für heute“ → Zähler heute|99, heute geht kein „sitz“ mehr hinaus", "Zähler " + f99.z);
  /* i) neuer Server (antwortet mit „sitz“): 4 je Tag, aber weiter höchstens 2 je Betreten */
  const f5 = await fall(null, { ok: true, mess: 12, ton: 20, sitz: 8 });
  await wechselMitQuittung();
  const s6 = await mess(A, { senden: true });
  await schlaf(60);
  const z6 = await zaehler();
  await wechselMitQuittung();
  const vor7 = await zahl();
  const s7 = await mess(A, { senden: true });
  sage(!!(f5.s && f5.s.gesendetJetzt === true && f5.z === heute + "|1|1" && s6 && s6.gesendetJetzt === true && z6 === heute + "|2|1"),
    "9: der Server zählt „sitz“ getrennt (Antwort mit „sitz“) → s = 1, ein zweiter Bericht am Tag geht hinaus", f5.z + " → " + z6);
  sage(!!(s7 && s7.gesendetJetzt === false && s7.rtt.length > 0 && (await zahl()) === vor7),
    "9: der dritte im selben Betreten nicht (höchstens 2 je Betreten, obwohl Werte da sind)", "Berichte " + (await zahl()));
  /* j) die Funktion wird wieder durch eine ohne „sitz“ ersetzt: die nächste angenommene Antwort ohne „sitz“ setzt s = 0
        zurück → sofort wieder 1 je Tag */
  const fZur = await fall(heute + "|2|1", HEUTE_SRV);
  await wechselMitQuittung();
  const vorZur = await zahl();
  const sZurb = await mess(A, { senden: true });
  sage(!!(fZur.s && fZur.s.gesendetJetzt === true && fZur.z === heute + "|3|0" && sZurb && sZurb.gesendetJetzt === false && (await zahl()) === vorZur),
    "9: Antwort ohne „sitz“ nach s = 1 → s = 0, heute geht keiner mehr hinaus (wieder 1 je Tag)",
    "Zähler " + fZur.z + ", danach gesendet " + (sZurb && sZurb.gesendetJetzt));
  await schlaf(1300);   // Nachsendungen vorbei

  console.log("\n10  QUELLTEXT\n");
  const lc = datei("livechat.js"), app = datei("app.js");
  sage(/senden\(\{ art: "redet", spricht: neu \}\);\s*(\/\*[\s\S]*?\*\/\s*)?melden\("plaetze"\);/.test(lc), "10: eigenes Sprechen an/aus meldet nur „plaetze“ (melden(\"plaetze\") direkt hinter senden redet)");
  const hi = app.indexOf("livechatAbmelden = LiveChat.beiAenderung((l, art) => {"), he = app.indexOf("/* Jeder Ansichtswechsel", hi);
  const hoerer = hi >= 0 && he > hi ? app.slice(hi, he) : "";
  sage(/if \(art !== "plaetze"\) klassenzimmerStreifen\(\);/.test(hoerer) && (hoerer.match(/klassenzimmerStreifen\(\)/g) || []).length === 1,
    "10: app.js zeichnet den Streifen im Zuhörer nur bei art !== \"plaetze\"");
  const ds = (/function direktSenden\(p\) \{[\s\S]*?\n  \}/.exec(lc) || [""])[0];
  sage(!!ds && !/dc\.send\(JSON\.stringify/.test(ds) && (ds.match(/JSON\.stringify/g) || []).length === 1, "10: direktSenden wandelt einmal in Text um (nicht je Gegenüber)");

  /* Verhalten: der Streifen (Raum, Personenzahl, Stumm, Halten) – bei „plaetze“ bleibt er unberührt, bei einer vollen
     Meldung wird er neu geschrieben. „plaetze“ allein (ohne Chatzeile) kommt hier vom eigenen Sprechen bei B und vom
     „redet“, das A dabei schickt. (Ein Sitzwechsel MIT Chatzeile ruft nach dem nächsten Bild ohnehin eine volle
     Meldung für die Zeile – unverändert seit 836.) */
  const streifen = (pg) => pg.evaluate(() => { const t = document.getElementById("kzStreifenText"); return t ? t.textContent : null; });
  const st0 = await streifen(B);
  await B.evaluate(() => { const t = document.getElementById("kzStreifenText"); if (t) t.textContent = "SONDE"; window.__arten.length = 0; });
  const sprB = await B.evaluate(() => Boolean(window.LiveChat.pruefSelbstSpricht));
  if (sprB) {
    await B.evaluate(() => window.LiveChat.pruefSelbstSpricht(true));
    await A.evaluate(() => window.LiveChat.pruefSelbstSpricht && window.LiveChat.pruefSelbstSpricht(true));
    await schlaf(300);
    await B.evaluate(() => window.LiveChat.pruefSelbstSpricht(false));
    await A.evaluate(() => window.LiveChat.pruefSelbstSpricht && window.LiveChat.pruefSelbstSpricht(false));
    await schlaf(300);
  }
  const st1 = await streifen(B), ar10 = await B.evaluate(() => window.__arten.slice());
  await B.evaluate(() => window.LiveChat.spielSitzeNeu());       // ruft melden() ohne Art (volle Meldung)
  await schlaf(100);
  const st2 = await streifen(B);
  sage(sprB && st0 !== null && st1 === "SONDE" && ar10.length === 4 && ar10.every((a) => a === "plaetze"),
    "10: Verhalten – eigenes Sprechen und ein empfangenes „redet“ (je an/aus: 4× „plaetze“) schreiben den Streifen bei B nicht neu",
    "vorher " + JSON.stringify(st0) + ", danach " + JSON.stringify(st1) + ", Arten " + JSON.stringify(ar10));
  sage(!!st2 && st2 !== "SONDE" && /da/.test(st2), "10: Verhalten – eine volle Meldung schreibt ihn weiter neu", JSON.stringify(st2));

  /* Verhalten: eigenes Sprechen an/aus – nur „plaetze“, und der Ring steht am eigenen Platz im echten Klassenzimmer */
  const echtZeichnen = (pg) => pg.evaluate(() => {
    const klein = document.querySelector('#lcPlaetze[data-sonde="1"]'); if (klein) klein.remove();
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    if (window.DMA_PRUEF && window.DMA_PRUEF.neuZeichnen) window.DMA_PRUEF.neuZeichnen();
    return document.querySelectorAll("#lcPlaetze .lc-platz").length;
  });
  const echtA = await echtZeichnen(A);
  await schlaf(500);
  const ring = () => A.evaluate(() => { const k = document.querySelector("#lcPlaetze .lc-platz-ich"); return k ? k.classList.contains("lc-platz-spricht") : null; });
  const kannSprechen = await A.evaluate(() => Boolean(window.LiveChat.pruefSelbstSpricht));
  let ri0 = null, ri1 = null, ri2 = null, ar11 = [], ar12 = [];
  if (kannSprechen && echtA) {
    ri0 = await ring();
    await A.evaluate(() => { window.__arten.length = 0; window.LiveChat.pruefSelbstSpricht(true); });
    ri1 = await warteAuf(ring, 1000);
    ar11 = await A.evaluate(() => window.__arten.slice());
    await A.evaluate(() => { window.__arten.length = 0; window.LiveChat.pruefSelbstSpricht(false); });
    ri2 = await warteAuf(async () => (await ring()) === false, 2000);
    ar12 = await A.evaluate(() => window.__arten.slice());
  }
  sage(kannSprechen && echtA > 0 && ri0 === false && ri1 === true && JSON.stringify(ar11) === '["plaetze"]',
    "10: Verhalten – eigenes Sprechen an: nur „plaetze“, der Ring steht am eigenen Platz (echtes Klassenzimmer, " + echtA + " Plätze)",
    "vorher " + ri0 + ", an " + ri1 + ", Arten " + JSON.stringify(ar11));
  sage(kannSprechen && ri2 === true && JSON.stringify(ar12) === '["plaetze"]', "10: Verhalten – eigenes Sprechen aus: nur „plaetze“, der Ring geht wieder",
    "aus " + ri2 + ", Arten " + JSON.stringify(ar12));

  const f = A.__fehler.concat(B.__fehler);
  sage(f.length === 0, "11: keine Fehler in der Konsole", f.slice(0, 3).join(" | "));

  /* ---------- nur ausgeben: 4-fach gedrosselte CPU (wie ein schwächeres Telefon) ---------- */
  console.log("\nNUR ZUR ANSICHT: Probe bei B mit 4-fach gedrosselter CPU (nicht geprüft)\n");
  const probeBeiB = async (titel) => {
    const vor = (await mess(B) || { ein: [] }).ein.length;
    const z = await freierPlatz(A);
    await A.evaluate((n) => window.LiveChat.platzNehmen(n), z);
    const m = await warteAuf(async () => { const x = await mess(B); return x && x.ein.length > vor && x.ein[x.ein.length - 1][3] != null ? x : null; }, 3000);
    const p = m && m.ein[m.ein.length - 1];
    const ma = await mess(A), q = ma && ma.rtt[ma.rtt.length - 1];
    console.log("   " + titel + ": [Weg, dom, mo, bild, vor, gez] = " + JSON.stringify(p) + "   Quittung bei A: " + JSON.stringify(q));
    await schlaf(1400);
  };
  const fB = B.__fehler.length;
  try {
    const cdp = await B.context().newCDPSession(B);
    await probeBeiB("kleines #lcPlaetze, CPU 1×");
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await probeBeiB("kleines #lcPlaetze, CPU 4×");
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    /* das echte Klassenzimmer zeichnen (wie Sonde 816) statt des kleinen #lcPlaetze */
    const echt = await B.evaluate(() => {
      const klein = document.querySelector('#lcPlaetze[data-sonde="1"]'); if (klein) klein.remove();
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea");
      while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
      if (window.DMA_PRUEF && window.DMA_PRUEF.neuZeichnen) window.DMA_PRUEF.neuZeichnen();
      return document.querySelectorAll("#lcPlaetze .lc-platz").length;
    });
    if (echt) {
      await schlaf(800);
      await probeBeiB("echtes Klassenzimmer (" + echt + " Plätze), CPU 1×");
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await probeBeiB("echtes Klassenzimmer, CPU 4×");
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    } else console.log("   (das echte Klassenzimmer ließ sich hier nicht zeichnen)");
    const f2 = B.__fehler.slice(fB);
    if (f2.length) console.log("   Seitenfehler dabei (nicht gezählt): " + f2.slice(0, 3).join(" | "));
  } catch (e) { console.log("   (nicht messbar: " + String(e.message || e).slice(0, 160) + ")"); }

  /* ---------- 12: der ABSENDER beschäftigt – die Quittung wartet auf seine eigene Arbeit ---------- */
  console.log("\n12  QUITTUNG BEI BESCHÄFTIGTEM ABSENDER (A mit echtem Klassenzimmer, " + echtA + " Plätze), [wer, ms, Weg, belegt, bild]\n");
  /* fest: A bleibt nach dem Senden so viele ms in DERSELBEN Aufgabe beschäftigt (wie ein langsames Telefon, das nach
     dem Wechsel noch die Plätze neu zeichnet) – die Quittung (Netz ~1 ms) liegt dann schon bereit und muss warten. */
  const quittungBeiA = async (fest) => {
    const vor = (await mess(A) || { rtt: [] }).rtt.length;
    const z = await freierPlatz(A);
    await A.evaluate(([n, fest]) => {
      window.LiveChat.platzNehmen(n);
      const t0 = performance.now(); while (performance.now() - t0 < fest) { /* beschäftigt */ }
    }, [z, fest || 0]);
    const m = await warteAuf(async () => { const x = await mess(A); return x && x.rtt.length > vor && x.rtt[x.rtt.length - 1][4] != null ? x : null; }, 3000);
    await schlaf(1400);
    return m ? m.rtt[m.rtt.length - 1] : null;
  };
  const zeile = (titel, w) => console.log("   " + titel + ": " + w.map((q) => JSON.stringify(q)).join(" ") + "   ms − belegt: "
    + w.map((q) => (q ? q[1] - q[3] : "?")).join(", ") + "   ms − bild: " + w.map((q) => (q && q[4] != null ? q[1] - q[4] : "?")).join(", "));
  /* Nur Ausgabe: wie sich die Quittung bei echter Drosselung verteilt. 884b: hier stand die Prüfung „ms − belegt ≤ 5 in
     4 von 5“ – sie wackelte (am unveränderten Stand 2a17b72 in 1 von 5 Läufen rot): ob Chromium nach einer langen
     Aufgabe erst das Bild oder erst die Datenkanal-Nachricht nimmt, liegt nicht bei uns (z. B. ["bbb",29,"d",6,29]). Auch
     „ms ≤ bild + 5“ ist bei natürlicher Drosselung nicht fest: braucht A nur ~30 ms, entscheidet die Laufzeit über B
     mit (einmal ["bbb",38,"d",30,32]). Darum prüft 12 mit festgehaltenem Absender. */
  try {
    const cdpA = await A.context().newCDPSession(A);
    for (const rate of [1, 6]) {
      await cdpA.send("Emulation.setCPUThrottlingRate", { rate });
      const w = [];
      for (let i = 0; i < 5; i++) w.push(await quittungBeiA());
      zeile("CPU " + rate + "× (nur Ausgabe)", w);
    }
    await cdpA.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  } catch (e) { console.log("   (Drosselung nicht messbar: " + String(e.message || e).slice(0, 160) + ")"); }
  /* Geprüft: A hält nach dem Senden FEST ms fest. Fest (nicht vom Zufall abhängig): belegt ≥ FEST (der setTimeout 0
     kommt erst nach der Aufgabe dran), ms ≥ FEST (die Quittung auch), belegt ≤ bild (rAF erst danach, sein setTimeout
     hinter dem von belegt). ms ≤ bild + 5: die Quittung liegt nach ~1 ms bereit und kommt vor dem setTimeout aus dem
     nächsten Bild dran – B müsste schon über FEST ms trödeln, damit es anders wäre. Lesart damit belegt: ms ≈ FEST,
     obwohl das Netz ~1 ms hat; die Untergrenze fürs Netz (ms − bild) ist ≤ 5. Ohne belegt/bild läse man FEST ms als Netz. */
  const FEST = 80;
  try {
    const w = [];
    for (let i = 0; i < 5; i++) w.push(await quittungBeiA(FEST));
    zeile("A " + FEST + " ms festgehalten", w);
    const gut = w.filter((q) => q && q[2] === "d" && typeof q[3] === "number" && typeof q[4] === "number"
      && q[3] >= FEST && q[1] >= FEST && q[3] <= q[4] && q[1] <= q[4] + 5).length;
    sage(gut === 5, "12: Absender " + FEST + " ms beschäftigt, Netz ~1 ms: belegt ≥ " + FEST + ", ms ≥ " + FEST + ", belegt ≤ bild und ms ≤ bild + 5 in 5 von 5 (die Wartezeit auf ihn selbst steht in belegt/bild, nicht im Netz)",
      gut + " von " + w.length);
  } catch (e) { sage(false, "12: Absender beschäftigt – nicht messbar", String(e.message || e).slice(0, 160)); }

  /* ---------- 13: trennscharf – B hält die Quittung 300 ms zurück, A ist frei ---------- */
  /* Die Prüfung von 884 fand: eine Fälschung, die beim Eintreffen der Quittung einfach belegt = bild = ms setzt (ohne
     setTimeout und ohne rAF), war in allen Prüfungen grün. Hier kommt die Quittung absichtlich spät (B verzögert sein
     dc.send für „sitz-q“ um 300 ms), A ist ungedrosselt: belegt/bild müssen klein bleiben (sie messen A), ms groß
     (es misst den Weg), und ms − bild – die Untergrenze fürs Netz in der Lesart – muss die Verzögerung zeigen. */
  const VERZUG = 300;
  console.log("\n13  QUITTUNG " + VERZUG + " ms ZURÜCKGEHALTEN (bei B), A frei: [wer, ms, Weg, belegt, bild]\n");
  try {
    await B.evaluate((ms) => {
      if (!window.__sendeOrig) {
        const orig = window.__sendeOrig = RTCDataChannel.prototype.send;
        RTCDataChannel.prototype.send = function (d) {
          if (window.__qVerzug && typeof d === "string" && d.indexOf('"art":"sitz-q"') >= 0) {
            const k = this; setTimeout(() => { try { orig.call(k, d); } catch (e) {} }, window.__qVerzug); return;
          }
          return orig.call(this, d);
        };
      }
      window.__qVerzug = ms;
    }, VERZUG);
    const w = [];
    for (let i = 0; i < 5; i++) w.push(await quittungBeiA());
    await B.evaluate(() => { window.__qVerzug = 0; });
    console.log("   CPU 1×: " + w.map((q) => JSON.stringify(q)).join(" ") + "   ms − bild: " + w.map((q) => (q && q[4] != null ? q[1] - q[4] : "?")).join(", "));
    const trenn = w.filter((q) => q && q[2] === "d" && q[1] >= VERZUG && typeof q[3] === "number" && typeof q[4] === "number"
      && q[3] <= q[4] && q[4] < 150 && q[1] - q[4] >= 150).length;
    sage(trenn === 5, "13: Quittung " + VERZUG + " ms zurückgehalten: ms ≥ " + VERZUG + ", aber bild < 150 und ms − bild ≥ 150, belegt ≤ bild in 5 von 5 (belegt/bild messen den Absender, nicht die Quittung)",
      trenn + " von " + w.length);
  } catch (e) { sage(false, "13: Quittung zurückgehalten – nicht messbar", String(e.message || e).slice(0, 160)); }

  if (ALT) console.log("\nAus ALT geliefert: " + (ausAlt.join(", ") || "nichts"));
  laeuft = false;
  console.log("\nFassung 884 (Sonde 884-sitz): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
