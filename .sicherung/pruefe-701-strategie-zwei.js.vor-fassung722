#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 701: RUNDENKAMPF GEGEN ECHTE MITSPIELER (Funk 139)
   ---------------------------------------------------------------------
   XANDER: „das Strategie Spiel gegen den Computer funktioniert das aber
   gegen andere Mitspieler noch nicht das muss funktionieren".
   Zwei Browserfenster (Alex und Bea), jedes mit eigener Server-Attrappe.
   Was ein Fenster in den Raum schickt, stellt die Sonde dem anderen zu –
   wie es der Datenkanal tut. Gespielt wird eine ganze Partie.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const IDS = { ich: "00000000-0000-4000-8000-000000000000", bea: "11111111-1111-4111-8111-111111111111" };

async function fenster(br, port, wer) {
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  const pg = await ctx.newPage();
  pg.__fehler = []; pg.on("pageerror", (e) => pg.__fehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL, { timeout: 25000 });
  await pg.evaluate(([wer, IDS]) => {
    const anderer = wer === "ich" ? "bea" : "ich", namen = { ich: "Alex", bea: "Bea" };
    const leute = { [anderer]: { id: anderer, name: namen[anderer], seit: 6000, gesehen: 9e15, buehne: true, bild: "" } };
    window.LiveChat.pruefSitz({ lage: "drin", ichId: wer, ichName: namen[wer], seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    window.LiveChat.spielIdVon = (id) => IDS[id] || "";
    const ich = { id: IDS[wer], name: namen[wer], lp: 100, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, punkte: 100, pflaster: 1, traenke: 0, waffen: ["kartoffel"],
      mana: 50, mana_max: 100, mitspielen: false, level: wer === "ich" ? 12 : 3, xp: 0, skills: {}, ladung: 0, helm: 0, brust: 0, vorraete: {}, tiere: {} };
    window.__raus = []; window.__rufe = []; window.__aufgabeNr = 0; window.__antwortVerzoegert = 0;
    window.LiveChat.pruefAbfangen((p) => { if (p && p.art === "spiel") window.__raus.push(p); });
    const klient = { rpc: (name, args) => {
      window.__rufe.push({ name, args: args || {}, t: Date.now() });
      let data = { ok: true };
      if (name === "spiel_ich") data = ich;
      else if (name === "spiel_stand") data = [ich];
      else if (name === "spiel_aufgabe") { window.__aufgabeNr++; window.__gestellt = Date.now(); data = { ok: true, id: 500 + window.__aufgabeNr, frage: "Ich ___ nach Hause.", optionen: ["gehe", "gehst"], niveau: "A1" }; }
      /* Wie der Server: unter 2 Sekunden nach der Frage „zu schnell". */
      else if (name === "spiel_antwort") data = Date.now() - window.__gestellt < 2000 ? { ok: false, grund: "zu schnell" } : Object.assign({}, ich, { ok: true, richtig: args.p_antwort === "gehe", loesung: "gehe" });
      else if (name === "spiel_extra_lohn") data = { ok: true, lohn: 5, richtig: 2 };
      return Promise.resolve({ data, error: null });
    } };
    window.DMA_SPIEL.pruef.setzen({ klient, bereit: true, versucht: true, uid: IDS[wer], ich, stand: { [IDS[wer]]: ich }, letzterAbruf: Date.now() });
    window.__hinweise = []; window.__spielMeldungen = window.__hinweise;
  }, [wer, IDS]);
  return pg;
}

(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  const A = await fenster(br, srv.address().port, "ich"), B = await fenster(br, srv.address().port, "bea");
  /* Der Raum: was A schickt, bekommt B (und umgekehrt) – wie der Datenkanal. */
  let laeuft = true, zugestellt = 0;
  const bote = async (von, zu, zuId) => {
    const pakete = await von.evaluate(() => window.__raus.splice(0));
    for (const p of pakete) { if (p.an && p.an !== zuId) continue; zugestellt++; await zu.evaluate((p) => window.DMA_SPIEL.empfangen(p), p); }
  };
  (async () => { while (laeuft) { try { await bote(A, B, "bea"); await bote(B, A, "ich"); } catch (e) {} await new Promise((r) => setTimeout(r, 80)); } })();
  const tick = (ms) => new Promise((r) => setTimeout(r, ms));
  const klick = (pg, sel) => pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel);
  const zustand = (pg) => pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.st(); return { id: S.id, zug: S.zug, dran: S.ichDran, ende: S.ende, ich: S.ich && S.ich.lp, er: S.er && S.er.lp, log: (S.log || []).slice(0, 2) }; });

  console.log("\nEINLADEN UND ANNEHMEN\n");
  await A.evaluate(() => window.DMA_SPIEL.pruef.extraOeffnen("strat"));
  await tick(200);
  const knopfDa = await klick(A, '[data-st="bea"]');
  sage(knopfDa, "Alex sieht „Gegen Bea (einladen)“");
  await tick(600);
  const box = await B.evaluate(() => { const b = document.querySelector(".sp-frage"); return b ? b.textContent : ""; });
  sage(/Alex lädt dich zum Rundenkampf ein/.test(box), "Bea bekommt die Einladung", box.slice(0, 80));
  await klick(B, '.sp-frage [data-ja="1"]');
  await tick(700);
  let a = await zustand(A), b = await zustand(B);
  sage(a.id && a.id === b.id && a.dran === true && b.dran === false, "beide in derselben Partie, Alex fängt an", JSON.stringify({ a, b }));

  console.log("\nZÜGE HIN UND HER – FAIR NACH LEVEL (Alex Lv 12, Bea Lv 3)\n");
  const zug = async (pg, aktion, warte, danach) => {
    await klick(pg, '.sp-st-aktionen [data-ak="' + aktion + '"]');
    await tick(warte == null ? 2300 : warte);
    await klick(pg, '.sp-extra-frage-knoepfe button:first-child');
    await tick(danach || 1400);
  };
  const fair = await A.evaluate(() => (document.querySelector(".sp-sa-fair") || {}).textContent || "");
  sage(/du −32 % Schaden, Bea \+32 %/.test(fair), "Arena sagt die Fairness an", fair);
  const sterneB = await B.evaluate(() => window.DMA_SPIEL.pruef.st().ich.sterne);
  sage(sterneB === 1, "Bea (9 Level tiefer) startet mit 1 Stern", String(sterneB));
  await zug(A, "angriff");
  a = await zustand(A); b = await zustand(B);
  sage(a.er === 52 && b.ich === 52 && b.dran === true, "Alex greift an (12 × 0,69 = 8): Bea hat auf BEIDEN Geräten 52 LP, Bea ist dran", JSON.stringify({ a: a.er, b: b.ich, dran: b.dran }));
  const bild = await A.evaluate(() => ({ arena: Boolean(document.querySelector(".sp-sa-buehne .sp-sa-ich .sp-sa-bild")) && Boolean(document.querySelector(".sp-sa-buehne .sp-sa-er .sp-sa-bild")), balken: (document.querySelector(".sp-sa-rechts i") || {}).style.width }));
  sage(bild.arena && bild.balken === "87%", "Arena: beide Kämpfer mit Bild, Beas Lebensbalken bei 87 %", JSON.stringify(bild));
  await zug(B, "schild");
  await zug(A, "angriff");
  a = await zustand(A); b = await zustand(B);
  sage(a.er === 52 && b.ich === 52, "Beas Schild (10) fängt Alex' 8 ganz ab – 52 auf beiden Geräten", JSON.stringify({ a: a.er, b: b.ich }));

  console.log("\nSCHNELL ANTWORTEN (UNTER 2 SEKUNDEN)\n");
  await zug(B, "angriff", 300, 3200);
  a = await zustand(A); b = await zustand(B);
  sage(b.er === 44 && a.ich === 44, "Bea antwortet nach 0,3 s richtig: der Zug zählt (Server sagte erst „zu schnell“) – 12 × 1,32 = 16", JSON.stringify({ a: a.ich, b: b.er, log: b.log }));

  console.log("\nEIN ZUG GEHT IM NETZ VERLOREN\n");
  await A.evaluate(() => { window.__verschlucken = 1; });
  const alterBote = bote;
  let verschluckt = 0;
  await A.evaluate(() => { const alt = window.LiveChat.pruefAbfangen; });
  /* Die nächste Nachricht von Alex an Bea wirft die Sonde weg. */
  const altRaus = async () => { const p = await A.evaluate(() => { const i = window.__raus.findIndex((x) => x.typ === "zug"); return i >= 0 ? window.__raus.splice(i, 1)[0] : null; }); if (p) verschluckt++; return p; };
  laeuft = false; await tick(200);
  await klick(A, '.sp-st-aktionen [data-ak="angriff"]'); await tick(2300); await klick(A, '.sp-extra-frage-knoepfe button:first-child'); await tick(900);
  await altRaus();
  laeuft = true; (async () => { while (laeuft) { try { await bote(A, B, "bea"); await bote(B, A, "ich"); } catch (e) {} await new Promise((r) => setTimeout(r, 80)); } })();
  await tick(3600);
  a = await zustand(A); b = await zustand(B);
  sage(verschluckt === 1 && b.ich === 46 && a.er === 46 && b.dran === true, "der verlorene Zug kommt nach 2,5 s von selbst nochmal – Bea 46 auf beiden Geräten (Schild hatte noch 2)", JSON.stringify({ verschluckt, a: a.er, b: b.ich, dran: b.dran }));

  console.log("\nKONTER\n");
  await zug(B, "konter");
  await zug(A, "angriff", null, 2000);
  a = await zustand(A); b = await zustand(B);
  sage(b.ich === 42 && a.er === 42 && a.ich === 40 && b.er === 40, "Konter: Bea steckt die Hälfte ein (4), Alex bekommt 4 zurück – auf beiden Geräten gleich", JSON.stringify({ bea: [b.ich, a.er], alex: [a.ich, b.er] }));
  if (process.env.BILD) await A.screenshot({ path: process.env.BILD + "-zuege.png" });

  console.log("\nECHTZEIT: BEIDE ZUGLEICH, BIS ZUM K.O.\n");
  await A.evaluate(() => { document.querySelector(".sp-extra-zu").click(); });
  await tick(600);
  const aufgegeben = await B.evaluate(() => window.DMA_SPIEL.pruef.st().log[0] || "");
  sage(/aufgegeben/.test(aufgegeben), "Alex schließt das Fenster: bei Bea steht „hat aufgegeben – gewonnen“", aufgegeben);
  await B.evaluate(() => { const z = document.querySelector(".sp-extra-zu"); if (z) z.click(); });
  await A.evaluate(() => window.DMA_SPIEL.pruef.extraOeffnen("strat"));
  await tick(200);
  await klick(A, '[data-modus="echtzeit"]');
  await klick(A, '[data-st="bea"]');
  await tick(700);
  const box2 = await B.evaluate(() => (document.querySelector(".sp-frage") || {}).textContent || "");
  sage(/Echtzeit/.test(box2), "Einladung sagt „Echtzeit“", box2.slice(0, 70));
  await klick(B, '.sp-frage [data-ja="1"]');
  await tick(700);
  /* Beide tippen gleichzeitig auf Angriff. */
  await Promise.all([klick(A, '.sp-st-aktionen [data-ak="angriff"]'), klick(B, '.sp-st-aktionen [data-ak="angriff"]')]);
  await tick(2300);
  await Promise.all([klick(A, '.sp-extra-frage-knoepfe button:first-child'), klick(B, '.sp-extra-frage-knoepfe button:first-child')]);
  await tick(1600);
  a = await zustand(A); b = await zustand(B);
  sage(a.ich === 44 && b.er === 44 && b.ich === 52 && a.er === 52, "gleichzeitig getroffen: Alex 44, Bea 52 – auf beiden Geräten gleich", JSON.stringify({ alex: [a.ich, b.er], bea: [b.ich, a.er] }));
  for (let i = 0; i < 3; i++) { await B.waitForFunction(() => { const k = document.querySelector('.sp-st-aktionen [data-ak="angriff"]'); return k && !k.disabled; }, null, { timeout: 8000 }); await zug(B, "angriff", 2300, 1500); }
  a = await zustand(A); b = await zustand(B);
  const ko = await Promise.all([A, B].map((pg) => pg.evaluate(() => (document.querySelector(".sp-sa-kobild") || {}).textContent || "")));
  sage(a.ende && b.ende && a.ich === 0 && ko[0] === "K.O." && ko[1] === "SIEG!", "Bea haut Alex in drei Schlägen um: bei Alex „K.O.“, bei Bea „SIEG!“", JSON.stringify({ alex: a.ich, ko }));
  if (process.env.BILD) { await A.screenshot({ path: process.env.BILD + "-ko-alex.png" }); await B.screenshot({ path: process.env.BILD + "-sieg-bea.png" }); }

  laeuft = false;
  sage(A.__fehler.length + B.__fehler.length === 0, "keine Seitenfehler", A.__fehler.concat(B.__fehler).join(" | "));
  console.log("\nFassung 701 (Rundenkampf zu zweit): " + (fehler ? fehler + " rot." : "alles grün.") + "  (" + zugestellt + " Pakete zugestellt)");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
