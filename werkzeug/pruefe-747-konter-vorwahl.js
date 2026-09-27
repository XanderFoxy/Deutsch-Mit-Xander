#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 747: KONTER NACH LEBEN, NIVEAU UND FRAGEN-ART VORHER
   ---------------------------------------------------------------------
   Funk 178 (XANDER): „deswegen müsste der Konto prozentual mit sinkender
   Lebensenergie auch schwächer werden" und „dass jeder sein Niveau vorher
   wählen kann auch in der Echtheit Runde".
   BILD=/pfad/praefix legt Bilder ab.
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
  const tick = (ms) => new Promise((r) => setTimeout(r, ms));
  const klick = (pg, sel) => pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel);
  const A = await fenster(br, srv.address().port, "ich");

  console.log("\nVORWAHL IM RUNDENKAMPF\n");
  await A.evaluate(() => { try { localStorage.setItem("dma_spiel_niveau", "A1"); localStorage.setItem("dma_spiel_fragenart", "schwach"); } catch (e) {} const S = window.DMA_SPIEL.pruef.zustand(); S.niveau = "A1"; S.fragenArt = "schwach"; window.DMA_SPIEL.pruef.extraOeffnen("strat"); });
  await tick(250);
  let v = await A.evaluate(() => ({ niv: document.querySelectorAll(".sp-extra-strat [data-vw-niveau]").length, art: document.querySelectorAll(".sp-extra-strat [data-vw-art]").length,
    an: (document.querySelector(".sp-extra-strat [data-vw-niveau].sp-an") || {}).textContent }));
  sage(v.niv === 6 && v.art === 3 && v.an === "A1", "Vor dem Kampf: 6 Niveaus und 3 Fragen-Arten zur Wahl, A1 ist an", JSON.stringify(v));
  await klick(A, '.sp-extra-strat [data-vw-niveau="B1"]'); await klick(A, '.sp-extra-strat [data-vw-art="stark"]'); await klick(A, '.sp-extra-strat [data-modus="echtzeit"]');
  v = await A.evaluate(() => ({ n: window.DMA_SPIEL.pruef.zustand().niveau, ls: localStorage.getItem("dma_spiel_niveau"), art: localStorage.getItem("dma_spiel_fragenart"),
    an: [...document.querySelectorAll(".sp-extra-strat .sp-vorwahl .sp-an")].map((b) => b.textContent), modus: (document.querySelector('.sp-extra-strat [data-modus].sp-an') || {}).textContent, offen: Boolean(document.querySelector(".sp-extra-strat .sp-sm-liste")) }));
  sage(v.n === "B1" && v.ls === "B1" && v.art === "stark" && v.an.length === 2 && /Echtzeit/.test(v.modus) && v.offen, "B1 und „Stärken“ gewählt, gemerkt, Echtzeit bleibt gewählt, das Fenster bleibt offen", JSON.stringify(v));
  const breit = await A.evaluate(() => { const e = document.querySelector(".sp-extra-strat"); const b = e.getBoundingClientRect(); return { rechts: Math.round(b.right), sw: e.scrollWidth, cw: e.clientWidth, doc: document.documentElement.scrollWidth }; });
  sage(breit.rechts <= 360 && breit.sw <= breit.cw + 1 && breit.doc <= 360, "360 px: nichts ragt heraus", JSON.stringify(breit));
  if (process.env.BILD) await (await A.$(".sp-extra-strat")).screenshot({ path: process.env.BILD + "-wahl.png" });

  console.log("\nDIE FRAGE KOMMT AUF DEM GEWÄHLTEN NIVEAU\n");
  await klick(A, '.sp-extra-strat [data-modus="zug"]');
  await klick(A, '[data-st="computer"]'); await tick(400);
  await A.evaluate(() => { const S = window.DMA_SPIEL.pruef.st(); S.ichDran = true; S.er.konter = true; S.er.lp = 24; S.er.schild = 0; S.er.ruestung = 0; S.er.lv = S.ich.lv; window.__rufe.length = 0; });
  await klick(A, '.sp-st-aktionen [data-ak="angriff"]'); await tick(2300);
  const frage = await A.evaluate(() => (window.__rufe.find((r) => r.name === "spiel_aufgabe") || {}).args);
  sage(frage && frage.p_niveau === "B1", "Die Deutsch-Frage im Kampf wird auf B1 geholt", JSON.stringify(frage));

  console.log("\nKONTER NACH LEBEN (Funk 178)\n");
  await klick(A, '.sp-extra-frage-knoepfe button:first-child'); await tick(750);
  let k = await A.evaluate(() => { const S = window.DMA_SPIEL.pruef.st(); return { er: S.er.lp, ich: S.ich.lp, log: S.log.slice(0, 2) }; });
  /* 12 Schaden gegen einen Konter bei 24/60 Leben: 0,5 × 24/60 = 20 % → 2 prallen zurück, 10 treffen. */
  sage(k.er === 14, "Konter bei 24/60 Leben: nur 20 % prallen zurück – der Computer steckt 10 von 12 ein (früher 6)", JSON.stringify(k));
  await tick(500);
  k = await A.evaluate(() => { const S = window.DMA_SPIEL.pruef.st(); return { ich: S.ich.lp }; });
  sage(k.ich === 58, "… und mich treffen nur 2 zurück (früher 6)", JSON.stringify(k));
  const anzeige = await A.evaluate(() => { const S = window.DMA_SPIEL.pruef.st(); S.ich.konter = true; S.ich.lp = 30; window.DMA_SPIEL.pruef.stratEnde(); return (document.querySelector(".sp-sa-links small") || {}).textContent; });
  sage(/Konter 25 %/.test(anzeige || ""), "Anzeige: „Konter 25 %“ bei halbem Leben", anzeige);
  await A.evaluate(() => window.DMA_SPIEL.pruef.extraSchliessen && window.DMA_SPIEL.pruef.extraSchliessen());

  console.log("\nFENSTER ZU, WÄHREND DER RÜCKPRALL NOCH FLIEGT\n");
  await A.evaluate(() => window.DMA_SPIEL.pruef.extraOeffnen("strat")); await tick(200);
  await klick(A, '[data-st="computer"]'); await tick(400);
  await A.evaluate(() => { const S = window.DMA_SPIEL.pruef.st(); S.ichDran = true; S.er.konter = true; S.er.lp = 60; S.er.schild = 0; });
  await klick(A, '.sp-st-aktionen [data-ak="angriff"]'); await tick(2300);
  await klick(A, '.sp-extra-frage-knoepfe button:first-child');
  const vorher = A.__fehler.length;
  await A.waitForFunction(() => { const S = window.DMA_SPIEL.pruef.st(); return S.er && S.er.lp < 60; }, { timeout: 3000 }).catch(() => {});
  await A.evaluate(() => window.DMA_SPIEL.pruef.extraSchliessen()); await tick(900);
  sage(A.__fehler.length === vorher, "Schließen in den 0,4 s nach dem Konter: kein Skriptfehler mehr", A.__fehler.slice(vorher).join(" | "));

  console.log("\nVORWAHL IN DER FEHLERTEUFEL-ABWEHR\n");
  await A.evaluate(() => window.DMA_SPIEL.pruef.extraOeffnen("td")); await tick(250);
  await klick(A, '.sp-extra-td [data-vw-niveau="C1"]');
  v = await A.evaluate(() => ({ n: window.DMA_SPIEL.pruef.zustand().niveau, an: (document.querySelector(".sp-extra-td [data-vw-niveau].sp-an") || {}).textContent, feld: Boolean(document.querySelector(".sp-extra-td canvas")) }));
  sage(v.n === "C1" && v.an === "C1" && v.feld, "Auch vor der Fehlerteufel-Abwehr: Niveau wählbar (C1), das Spielfeld ist da", JSON.stringify(v));
  if (process.env.BILD) await (await A.$(".sp-extra-td")).screenshot({ path: process.env.BILD + "-td.png" });
  await A.evaluate(() => window.DMA_SPIEL.pruef.extraSchliessen && window.DMA_SPIEL.pruef.extraSchliessen());

  sage(A.__fehler.length === 0, "keine Skriptfehler", A.__fehler.join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 747 (Konter nach Leben, Niveau vorher): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
