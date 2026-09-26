#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 699: KÄMPFERKLASSEN
   ---------------------------------------------------------------------
   XANDER (Funk 139): „… kämpferklassen Abenteuer Zauberer also Magier
   oder Dieb oder oder Titan … dass man das in verschiedenen Klassen auf
   leveln kann ja und dann zwischen diesen Klassen hin und her schalten
   kann … die Skills von diesen unterschiedlichen Charakteren … dass man
   wirklich das sieht". Walkie 278: alle sechs.
   Der Server ist im Rollback geprüft (spiel_699_kampfklassen). Hier der
   BROWSER: Beta-Schalter, Menü, Wahl, Knopf, Kraft aufs Ziel, eigener
   Ton je Klasse, und die Gesichtsmitte bleibt frei.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const { PNG } = require("/tmp/claude-0/node_modules/pngjs");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const bildpunkteAnders = (a, b) => { const A = PNG.sync.read(a), B = PNG.sync.read(b); let n = 0, anders = 0;
  for (let k = 0; k < A.data.length; k += 4) { n++; if (Math.abs(A.data[k] - B.data[k]) + Math.abs(A.data[k + 1] - B.data[k + 1]) + Math.abs(A.data[k + 2] - B.data[k + 2]) > 40) anders++; }
  return Math.round(100 * anders / n); };

(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  /* Ein Android-Telefon mit Fingertipps. */
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  const pg = await ctx.newPage();
  const kf = []; pg.on("pageerror", (e) => kf.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL && window.DMA_SPIEL.pruef.KAMPF, { timeout: 25000 });

  await pg.evaluate(() => {
    const leute = { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } };
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    const ichId = "00000000-0000-4000-8000-000000000000", beaId = "11111111-1111-4111-8111-111111111111";
    window.LiveChat.spielIdVon = (id) => (id === "bea" ? beaId : id === "ich" ? ichId : "");
    const ich = { id: ichId, name: "Alex", lp: 60, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, punkte: 200, pflaster: 1, traenke: 0,
      waffen: ["kartoffel"], mana: 80, mana_max: 100, mitspielen: true, level: 6, xp: 2000, skills: {}, ladung: 10, helm: 0, brust: 0,
      geschuetz_ladungen: 4, geschuetz_max: 16, geschuetz_stufe: 2, vorraete: {}, tiere: {}, klassen_xp: { titan: 70 }, kampfklasse: null, kampf_stufe: 0, klassen_bereit_s: 0 };
    const bea = { id: beaId, name: "Bea", lp: 80, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, mitspielen: true, level: 5, mana: 20, mana_max: 100 };
    window.__rufe = []; window.__raus = [];
    window.LiveChat.pruefAbfangen((p) => { window.__raus.push(p); });
    const klient = { rpc: (name, args) => {
      window.__rufe.push({ name: name, args: args || {} });
      let data = { ok: true };
      if (name === "spiel_ich") data = ich;
      else if (name === "spiel_stand") data = [ich, bea];
      else if (name === "spiel_kampfklasse_waehlen") { ich.kampfklasse = args.p_klasse; ich.kampf_stufe = Math.min(10, 1 + Math.floor(Math.sqrt((ich.klassen_xp[args.p_klasse] || 0) / 15))); data = Object.assign({ ok: true, kampfklasse: args.p_klasse }, ich); }
      else if (name === "spiel_klassen_schlag") {
        ich.mana -= 20;
        const k = ich.kampfklasse;
        data = { ok: true, klasse: k, stufe: ich.kampf_stufe, schaden: k === "magier" ? 12 : 0, heil: k === "heiler" ? 23 : 0, klau: 0, turm: k === "ingenieur" ? 12 : 0, mauer: 0,
          kaputt: false, lohn: k === "magier" ? 1 : 0, bereit_s: 120, ziel: args.p_ziel ? Object.assign({}, bea, { lp: 68 }) : null, ich_voll: Object.assign({}, ich, { klassen_bereit_s: 120 }) };
      }
      return Promise.resolve({ data: data, error: null });
    } };
    window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ichId, ich: ich, stand: { [ichId]: ich, [beaId]: bea }, letzterAbruf: Date.now() });
    window.__ich = ich;
    const f = document.getElementById("lcForm"); if (f) f.style.display = "";
    window.__hinweise = []; window.__spielMeldungen = window.__hinweise;
    /* Jeder Ton wird mitgeschrieben – der Web-Audio-Weg und der Ersatzweg. */
    window.DMA_TONLOG = [];
    window.DMA_SPIEL_BRUECKE = window.DMA_SPIEL_BRUECKE || {};
    const altTon = window.DMA_SPIEL_BRUECKE.ton;
    window.DMA_SPIEL_BRUECKE.ton = (n, l) => { window.DMA_TONLOG.push({ name: n, wann: Math.round(performance.now()), weg: "ersatz" }); try { if (altTon) altTon(n, l); } catch (e) {} };
    /* Der Beta-Schalter: zuerst AUS (wie für normale Nutzer). */
    window.__beta = false;
    const altFlag = Backend.isFeatureOn;
    Backend.isFeatureOn = (k) => (k === "kampfklassen_neu" ? window.__beta : altFlag(k));
  });
  await pg.waitForTimeout(600);
  const tick = (ms) => pg.waitForTimeout(ms);
  const tippe = async (sel) => {
    await pg.evaluate((s) => { document.documentElement.style.scrollBehavior = "auto"; const e = document.querySelector(s); if (e) e.scrollIntoView({ block: "center", behavior: "instant" }); }, sel);
    await tick(120);
    const m = await pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
    if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(300); return true; };
  const menue = (reiter) => pg.evaluate((r) => { const S = window.DMA_SPIEL.pruef.zustand(); S.zrad = false; S.schnellMenue = true; S.schnellReiter = r; window.DMA_SPIEL.pruef.schnellZeichnen(true); }, reiter);

  console.log("\nBETA: NUR BETREIBER UND BETA-TESTER SEHEN DIE KLASSEN\n");
  await menue("mehr"); await tick(200);
  let r = await pg.evaluate(() => ({ menue: Boolean(document.querySelector('[data-s="kampfklasse"]')), knopf: Boolean(document.querySelector(".sp-s-kampf")) }));
  sage(!r.menue && !r.knopf, "Schalter aus: kein Menüpunkt „Kämpferklasse“, kein Knopf", JSON.stringify(r));
  await pg.evaluate(() => { window.__beta = true; });
  await menue("mehr"); await tick(200);
  r = await pg.evaluate(() => ({ menue: (document.querySelector('[data-s="kampfklasse"]') || {}).textContent || "" }));
  sage(/Kämpferklasse/.test(r.menue) && /wählen/.test(r.menue), "Schalter an (Beta): Menüpunkt „Kämpferklasse · wählen“", r.menue);
  r = await pg.evaluate(() => { const K = window.DMA_SPIEL.pruef.KAMPF; return Object.keys(K); });
  sage(r.join() === "magier,dieb,titan,heiler,ingenieur,gelehrter", "alle sechs Klassen", r.join(", "));

  console.log("\nMENÜ: KRAFT, STÄRKE UND STUFE JE KLASSE\n");
  await tippe('[data-s="kampfklasse"]');
  r = await pg.evaluate(() => { const z = [...document.querySelectorAll(".sp-kampf-zeile")];
    return { n: z.length, titan: (z.find((e) => /Titan/.test(e.textContent)) || {}).textContent || "", knoepfe: document.querySelectorAll('[data-s="kampfwahl"]').length,
      breit: z.every((e) => e.scrollWidth <= e.clientWidth + 1) }; });
  sage(r.n === 6 && r.knoepfe === 6, "sechs Zeilen, jede mit „Wählen“", r.n + " Zeilen, " + r.knoepfe + " Knöpfe");
  sage(/Stufe 3/.test(r.titan) && /Bollwerk/.test(r.titan) && /Stärke:/.test(r.titan), "Titan mit 70 Erfahrung steht auf Stufe 3 (wie spiel_kampf_stufe)", r.titan.slice(0, 120));
  sage(r.breit, "Android 360 px: kein Text läuft aus der Zeile");
  const stufen = await pg.evaluate(() => [0, 14, 15, 59, 60, 135, 1215, 9999].map((x) => window.DMA_SPIEL.pruef.kampfStufe(x)));
  sage(stufen.join() === "1,1,2,2,3,4,10,10", "Stufen 15 → 2, 60 → 3, 135 → 4, 1215 → 10 (höchstens 10)", stufen.join(","));

  console.log("\nWÄHLEN: DER KNOPF ERSCHEINT IN DER LEISTE, MIT KLASSENTON\n");
  await pg.evaluate(() => { window.DMA_TONLOG.length = 0; });
  await tippe('[data-s="kampfwahl"][data-k="magier"]');
  await tick(400);
  r = await pg.evaluate(() => ({ ruf: window.__rufe.filter((x) => x.name === "spiel_kampfklasse_waehlen").map((x) => x.args.p_klasse), ton: window.DMA_TONLOG.map((t) => t.name),
    knopf: Boolean(document.querySelector(".sp-s-kampf")), meldung: window.__hinweise.slice(-1)[0] || "" }));
  sage(r.ruf.join() === "magier", "Wahl geht an spiel_kampfklasse_waehlen(magier)", r.ruf.join());
  sage(r.ton.includes("klasse-magier"), "eigener Klang „klasse-magier“", r.ton.join(", "));
  sage(r.knopf && /Magier/.test(r.meldung), "Knopf mit Magier-Wappen in der Leiste", r.meldung);

  console.log("\nKRAFT: KNOPF, DANN AUFS GESICHT — BILD UND TON SOFORT, ZAHL VOM SERVER\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); window.DMA_TONLOG.length = 0; window.__raus.length = 0; });
  await tippe(".sp-s-kampf");
  r = await pg.evaluate(() => ({ ziel: window.DMA_SPIEL.pruef.zustand().kampfZiel, m: window.__hinweise.slice(-1)[0] || "" }));
  sage(r.ziel === true && /Arkanblitz bereit/.test(r.m), "Tipp auf den Knopf: „Arkanblitz bereit – tippe auf ein Gesicht“", r.m);
  await pg.evaluate(() => { window.__gesehen = new Set(); new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.classList) [...n.classList].forEach((c) => { if (/^sp-kampf-/.test(c)) window.__gesehen.add(c); }); }))).observe(document.body, { childList: true }); });
  await tippe('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis');
  await tick(900);
  r = await pg.evaluate(() => ({ ruf: window.__rufe.filter((x) => x.name === "spiel_klassen_schlag").map((x) => x.args.p_ziel), raus: window.__raus.filter((p) => p.ereignis === "kampfklasse").map((p) => (p.start ? "start" : "zahl") + ":" + p.sorte + ":" + p.zielChat),
    ton: window.DMA_TONLOG.map((t) => t.name), bilder: [...window.__gesehen], m: window.__hinweise.slice(-1)[0] || "" }));
  sage(r.ruf.join() === "11111111-1111-4111-8111-111111111111", "spiel_klassen_schlag mit Beas Spiel-Kennung", r.ruf.join());
  sage(r.raus.join() === "start:magier:bea,zahl:magier:bea", "an alle: erst „start“ (Bild sofort), dann die Zahlen", r.raus.join(" | "));
  sage(r.ton[0] === "klasse-magier", "Ton „klasse-magier“ beim Wirken", r.ton.join(", "));
  sage(["sp-kampf-wappen", "sp-kampf-kugel", "sp-kampf-blitz"].every((c) => r.bilder.includes(c)), "Bild: Wappenring, Kugel fliegt, Blitz schlägt ein", r.bilder.join(", "));
  sage(/Arkanblitz – 12 Schaden/.test(r.m), "Meldung mit Schaden vom Server", r.m);
  r = await pg.evaluate(() => { const b = document.querySelector(".sp-s-kampf"); return { ruht: b && b.classList.contains("sp-ruht"), text: b ? b.textContent : "" }; });
  sage(r.ruht && /1[12]\ds/.test(r.text), "danach lädt der Knopf (2 Minuten)", r.text);

  console.log("\nJEDE KLASSE: EIGENES BILD, EIGENER TON, GESICHTSMITTE FREI\n");
  const ERWARTET = { magier: ["sp-kampf-kugel", "sp-kampf-blitz"], dieb: ["sp-kampf-rauch", "sp-kampf-hand"], titan: ["sp-kampf-schild"],
    heiler: ["sp-kampf-segen", "sp-kampf-kreuz"], ingenieur: ["sp-kampf-zahnrad"], gelehrter: ["sp-kampf-buch", "sp-kampf-buchstabe"] };
  for (const k of Object.keys(ERWARTET)) {
    const ziel = ["magier", "dieb", "gelehrter", "heiler"].includes(k) ? "bea" : "ich";
    await pg.evaluate(() => { window.__gesehen = new Set(); window.DMA_TONLOG.length = 0; });
    await pg.evaluate((z) => { document.documentElement.style.scrollBehavior = "auto"; document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + z + '"]').scrollIntoView({ block: "center" }); }, ziel);
    await pg.evaluate(([k, z]) => { window.__start = performance.now(); window.DMA_SPIEL.pruef.kampfZeigen({ ereignis: "kampfklasse", sorte: k, von: "ich", zielChat: z, start: true }); }, [k, ziel]);
    const werte = [];
    for (const t of [250, 650, 1000]) {
      await pg.waitForFunction((t) => performance.now() - window.__start >= t, t);
      const q = await pg.evaluate((z) => { document.getAnimations().forEach((a) => a.pause());
        const e = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + z + '"] .lc-kreis'); const b = e.getBoundingClientRect();
        /* Die Gesichtsmitte: die inneren 40 % des Profilbilds. */
        return { x: b.left + b.width * 0.3, y: b.top + b.height * 0.3, w: b.width * 0.4, h: b.height * 0.4 }; }, ziel);
      const mit = await pg.screenshot({ clip: { x: q.x, y: q.y, width: q.w, height: q.h } });
      await pg.evaluate(() => document.querySelectorAll('[class^="sp-kampf-"], [class*=" sp-kampf-"], .sp-ring-welle, .sp-stern-burst').forEach((e) => { if (!e.closest("#lcPlaetze") && !e.closest("button")) e.style.visibility = "hidden"; }));
      const ohne = await pg.screenshot({ clip: { x: q.x, y: q.y, width: q.w, height: q.h } });
      await pg.evaluate(() => { document.querySelectorAll('[class^="sp-kampf-"], [class*=" sp-kampf-"], .sp-ring-welle, .sp-stern-burst').forEach((e) => { e.style.visibility = ""; }); document.getAnimations().forEach((a) => a.play()); });
      werte.push(bildpunkteAnders(mit, ohne));
    }
    await tick(1500);
    r = await pg.evaluate(() => ({ bilder: [...window.__gesehen], ton: window.DMA_TONLOG.map((t) => t.name) }));
    sage(ERWARTET[k].every((c) => r.bilder.includes(c)) && r.ton[0] === "klasse-" + k, k + ": " + ERWARTET[k].join(" + ") + ", Ton klasse-" + k, r.bilder.join(" ") + " · " + r.ton.join(","));
    sage(Math.max(...werte) <= 12, k + ": Gesichtsmitte frei (höchstens 12 % der Bildpunkte verdeckt)", JSON.stringify(werte));
  }
  const wegDa = await pg.evaluate(() => document.querySelectorAll('body > [class^="sp-kampf-"]').length);
  sage(wegDa === 0, "nach dem Effekt bleibt nichts liegen", wegDa + " Reste");

  console.log("\nHEILER: SEGEN AUCH AUF DAS EIGENE GESICHT\n");
  await pg.evaluate(() => { const ich = window.__ich; ich.kampfklasse = "heiler"; const S = window.DMA_SPIEL.pruef.zustand(); S.ich = Object.assign({}, ich); S.kampfBis = 0; S.kampfZiel = false; window.__rufe.length = 0; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tippe(".sp-s-kampf");
  await tippe('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis');
  await tick(500);
  r = await pg.evaluate(() => ({ ruf: window.__rufe.filter((x) => x.name === "spiel_klassen_schlag").map((x) => String(x.args.p_ziel)), m: window.__hinweise.slice(-1)[0] || "" }));
  sage(r.ruf.join() === "null" && /Segen – \+23 LP/.test(r.m), "Tipp aufs eigene Bild: Segen für sich selbst (+23 LP)", r.ruf.join() + " · " + r.m);

  console.log("\nFASSUNG 695 NACHGEZOGEN: MÜNZEN UND STORCH FLIEGEN WIRKLICH\n");
  r = await pg.evaluate(() => { const e = document.createElement("div"); e.className = "sp-faehig-muenze"; document.body.appendChild(e); const s = getComputedStyle(e); const o = { pos: s.position, w: s.width }; e.remove(); return o; });
  sage(r.pos === "fixed" && r.w === "16px", "„sp-faehig-muenze“ hat jetzt eine Regel (fest, 16 px) – vorher lag sie am Seitenende", JSON.stringify(r));

  sage(kf.length === 0, "keine Seitenfehler", kf.join(" | "));
  console.log("\nFassung 699: " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
