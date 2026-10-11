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
     3  A hat die Quittung: rtt ["bbb", ms, "d"], 0 ≤ ms < 150
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
        A für bbb UND B für aaa bereit (das zweite nur durch die Antwort)
     9  Bericht „sitz“: Tagesgrenze (heute|4 → nichts), genau ein rpc,
        < 6000 Zeichen, Felder rtt/ein/raus/kan, raus.srv.kein ≥ 1, höchstens
        2 je Betreten
    10  Quelltext: eigenes Sprechen meldet „plaetze“, app.js zeichnet den
        Streifen nur bei art !== "plaetze", direktSenden wandelt einmal um
    11  keine Fehler in der Konsole
   Ausgegeben (nicht geprüft): die Probe bei 4-fach gedrosselter CPU, mit
   dem kleinen #lcPlaetze und mit dem echten Klassenzimmer.
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
      /* Berichte an den Betreiber abfangen (statt Supabase) */
      window.__berichte = [];
      (typeof Backend !== "undefined" ? Backend : window.Backend).zugang = () => ({ rpc: (name, a) => {
        window.__berichte.push({ name, art: a && a.p_art, d: a && JSON.parse(JSON.stringify(a.p_daten)) });
        return Promise.resolve({ data: { ok: true } }); } });
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
  const mess = (pg, o) => pg.evaluate((o) => (window.LiveChat.pruefSitzMess ? window.LiveChat.pruefSitzMess(o) : null), o || null);
  const vergessen = (pg, id, hallo) => pg.evaluate(([id, hallo]) => {
    if (!window.LiveChat.pruefKanalVergessen) return false;
    window.LiveChat.pruefKanalVergessen(id, hallo); return true;
  }, [id, Boolean(hallo)]);
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
  const mA = await warteAuf(async () => { const m = await mess(A); return m && m.rtt.length ? m : null; }, 1500);
  const q1 = mA && mA.rtt[0];
  sage(!!(q1 && q1[0] === "bbb" && q1[2] === "d" && q1[1] >= 0 && q1[1] < 150), "3: A hat die Quittung über den Datenkanal: rtt [\"bbb\", ms, \"d\"], 0 ≤ ms < 150", JSON.stringify(mA && mA.rtt));
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

  console.log("\n9  DER BERICHT „sitz“\n");
  const heute = await A.evaluate(() => { const d0 = new Date(); return d0.getFullYear() + "-" + ("0" + (d0.getMonth() + 1)).slice(-2) + "-" + ("0" + d0.getDate()).slice(-2); });
  const vorBer = (await sitzBerichte(A)).length;
  sage(vorBer === 0, "9: vor dem ersten Aufruf ging noch kein Bericht hinaus (keine 12 Werte, keine 90 s)", String(vorBer));
  await A.evaluate((h) => localStorage.setItem("dma_sitz_mess", h + "|4"), heute);
  const s0 = await mess(A, { senden: true });
  sage(!!s0 && s0.gesendetJetzt === false && (await sitzBerichte(A)).length === vorBer && (s0.rtt.length + s0.ein.length) > 0,
    "9: mit „dma_sitz_mess“ = heute|4 geht nichts hinaus (obwohl Werte da sind)", s0 ? "rtt " + s0.rtt.length + ", ein " + s0.ein.length : "kein pruefSitzMess");
  await A.evaluate(() => localStorage.removeItem("dma_sitz_mess"));
  const s1 = await mess(A, { senden: true });
  const b1 = await sitzBerichte(A), d1 = b1[0] && b1[0].d;
  sage(!!s1 && s1.gesendetJetzt === true && b1.length === 1 && b1[0].name === "spiel_diagnose_senden", "9: pruefSitzMess({ senden: true }) → genau ein rpc spiel_diagnose_senden mit p_art „sitz“", String(b1.length));
  sage(!!d1 && JSON.stringify(d1).length < 6000 && Array.isArray(d1.rtt) && Array.isArray(d1.ein) && d1.raus && d1.kan && d1.kan.bbb,
    "9: unter 6000 Zeichen, mit rtt, ein, raus, kan", d1 ? JSON.stringify(d1).length + " Zeichen: " + JSON.stringify(d1).slice(0, 420) : "");
  sage(!!(d1 && d1.raus.srv && d1.raus.srv.kein >= 1), "9: raus.srv.kein ≥ 1 (die Sonde hat keinen echten Raumkanal)", d1 && JSON.stringify(d1.raus.srv));
  sage((await A.evaluate(() => localStorage.getItem("dma_sitz_mess"))) === heute + "|1", "9: der Tageszähler steht auf heute|1");
  /* zweiter Bericht: neue Werte (A wechselt, B quittiert direkt), dann senden */
  const wechselMitQuittung = async () => {
    const vor = (await mess(A) || { rtt: [] }).rtt.length;
    const z = await freierPlatz(A);
    await A.evaluate((n) => window.LiveChat.platzNehmen(n), z);
    return warteAuf(async () => { const m = await mess(A); return m && m.rtt.length > vor ? m : null; }, 1500);
  };
  await wechselMitQuittung();
  const s2 = await mess(A, { senden: true });
  await wechselMitQuittung();
  const s3 = await mess(A, { senden: true });
  const b3 = await sitzBerichte(A);
  sage(!!(s2 && s2.gesendetJetzt === true && s3 && s3.gesendetJetzt === false && s3.rtt.length > 0 && b3.length === 2),
    "9: der zweite Aufruf sendet, der dritte nicht (höchstens 2 je Betreten, obwohl Werte da sind)", "Berichte " + b3.length);
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

  if (ALT) console.log("\nAus ALT geliefert: " + (ausAlt.join(", ") || "nichts"));
  laeuft = false;
  console.log("\nFassung 884 (Sonde 884-sitz): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
