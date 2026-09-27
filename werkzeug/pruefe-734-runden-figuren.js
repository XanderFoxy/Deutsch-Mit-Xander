#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 734: RUNDENKAMPF IN DREI RUNDEN, GANZE KÄMPFERFIGUREN
   ---------------------------------------------------------------------
   Walkie 288 (XANDER): „man macht die erste Runde und dann hat man eine
   zweite Runde und deine Entscheidungsrunde basierend auf den Ergebnis
   der ersten beiden Runden".
   Walkie 289: ganze Kämpferfigur mit Armen und Beinen, das Profilbild als
   Kopf; Figur nach der Kämpferklasse; angelegte Rüstung und Waffe sichtbar.
   Teil 1: gegen den Computer (ein Fenster). Teil 2: zwei Fenster.
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
  const st = (pg) => pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.st(); return { runde: S.runde, siege: S.siege, pause: S.pause, ende: S.ende, dran: S.ichDran, ich: S.ich.lp, er: S.er.lp, sterne: S.ich.sterne, log: S.log.slice(0, 2),
    rtext: (document.querySelector(".sp-sa-runde") || {}).textContent, punkte: [...document.querySelectorAll(".sp-sa-links .sp-sa-siege i.sp-an")].length + ":" + [...document.querySelectorAll(".sp-sa-rechts .sp-sa-siege i.sp-an")].length,
    ko: (document.querySelector(".sp-sa-kobild") || {}).textContent || "", ansage: (document.querySelector(".sp-sa-ansage") || {}).textContent || "" }; });
  const zug = async (pg, aktion) => { await klick(pg, '.sp-st-aktionen [data-ak="' + aktion + '"]'); await tick(2300); await klick(pg, '.sp-extra-frage-knoepfe button:first-child'); await tick(1200); };
  const bild = async (pg, name) => { if (process.env.BILD) await (await pg.$(".sp-sa")).screenshot({ path: process.env.BILD + "-" + name + ".png" }); };

  console.log("\nGEGEN DEN COMPUTER: FIGUREN\n");
  const A = await fenster(br, srv.address().port, "ich");
  await A.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.kampfklasse = "titan"; S.ich.brust = 2; S.ich.helm = 0; S.waffe = "laser"; window.DMA_SPIEL.pruef.extraOeffnen("strat"); });
  await tick(200);
  await klick(A, '[data-st="computer"]'); await tick(400);
  let r = await st(A);
  sage(r.runde === 1 && r.rtext === "Runde 1" && r.punkte === "0:0" && /Runde 1/.test(r.ansage) && /Kampf!/.test(r.ansage), "Start: „Runde 1 – Kampf!“ groß über der Bühne, Rundenpunkte 0:0", JSON.stringify(r));
  const fig = await A.evaluate(() => {
    const kr = (sel) => { const e = document.querySelector(sel); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height, b: b.bottom, r: b.right }; };
    const ich = document.querySelector(".sp-sa-ich"), er = document.querySelector(".sp-sa-er");
    const f = ich.querySelector(".sp-fig");
    return { ichKl: ich.className, erKl: er.className, arme: f.querySelectorAll(".sp-fig-arm-v, .sp-fig-arm-h").length, beine: f.querySelectorAll(".sp-fig-bein-v, .sp-fig-bein-h").length,
      waffe: f.querySelectorAll(".sp-fig-arm-v svg").length, panzer: /#8e97a3/.test(f.innerHTML), erHut: !!er.querySelector(".sp-sa-kopfzier"), erSpiegel: getComputedStyle(er.querySelector(".sp-fig")).transform,
      kopf: kr(".sp-sa-ich .sp-sa-bild"), leib: kr(".sp-sa-ich .sp-sa-koerper"), hut: (() => { const z = document.querySelector(".sp-sa-er .sp-sa-kopfzier"), k = kr(".sp-sa-er .sp-sa-kopfzier"), bb = z.getBBox();
        /* gemalte Unterkante des Hutes (nicht der ganze Zeichenrahmen) */ return Object.assign(k, { b: k.y + (bb.y + bb.height + 14) * k.h / 50, y: k.y + (bb.y + 14) * k.h / 50 }); })(), erKopf: kr(".sp-sa-er .sp-sa-bild"), buehne: kr(".sp-sa-buehne"), ichK: kr(".sp-sa-ich"), erK: kr(".sp-sa-er") };
  });
  sage(/sp-sa-kl-titan/.test(fig.ichKl) && fig.arme === 2 && fig.beine === 2, "eigene Figur: Titan, zwei Arme, zwei Beine", JSON.stringify({ kl: fig.ichKl, arme: fig.arme, beine: fig.beine }));
  sage(fig.waffe === 1 && fig.panzer, "die gehaltene Waffe (Laser) liegt in der vorderen Hand, der Eisen-Brustpanzer (Stufe 2) sitzt auf dem Rumpf", JSON.stringify({ waffe: fig.waffe, panzer: fig.panzer }));
  sage(/sp-sa-kl-gelehrter/.test(fig.erKl) && fig.erHut && /matrix\(-1/.test(fig.erSpiegel), "Professor Grammatikus: Deutsch-Gelehrter mit Doktorhut, schaut nach links (gespiegelt)", JSON.stringify({ kl: fig.erKl, spiegel: fig.erSpiegel }));
  sage(Math.abs((fig.kopf.x + fig.kopf.w / 2) - (fig.leib.x + fig.leib.w / 2)) < 3 && fig.leib.y < fig.kopf.b && fig.leib.y > fig.kopf.y + fig.kopf.h * .7, "das Profilbild sitzt als Kopf mittig auf dem Hals", JSON.stringify({ kopf: fig.kopf, leib: fig.leib }));
  sage(fig.hut.b <= fig.erKopf.y + fig.erKopf.h * .5, "der Hut sitzt über der Stirn – die Gesichtsmitte bleibt frei", JSON.stringify({ hutUnten: fig.hut.b, kopfMitte: fig.erKopf.y + fig.erKopf.h / 2 }));
  sage(fig.hut.y >= fig.buehne.y - 1 && fig.ichK.b <= fig.buehne.b && fig.erK.b <= fig.buehne.b && fig.ichK.r < fig.erK.x, "alles auf der Bühne, die Figuren überlappen sich nicht", JSON.stringify({ buehne: fig.buehne, ich: fig.ichK, er: fig.erK, hut: fig.hut }));
  await bild(A, "figuren");

  console.log("\nGEGEN DEN COMPUTER: DREI RUNDEN\n");
  await A.evaluate(() => { window.DMA_SPIEL.pruef.st().er.lp = 1; window.DMA_SPIEL.pruef.st().er.schild = 0; window.DMA_SPIEL.pruef.st().er.konter = false; });
  await tick(1200);
  await zug(A, "angriff");
  r = await st(A);
  sage(!r.ende && r.pause && r.siege.ich === 1 && r.punkte === "1:0" && r.ko === "K.O." && /Runde 1 gewonnen/.test(r.log[0]), "K.O. entscheidet nur die Runde: „Runde 1 gewonnen“, 1:0, noch kein Sieg", JSON.stringify(r));
  const knoepfeZu = await A.evaluate(() => [...document.querySelectorAll(".sp-st-aktionen [data-ak]")].every((b) => b.disabled));
  sage(knoepfeZu, "in der Pause sind die Aktionen gesperrt");
  await bild(A, "runde1-ko");
  await tick(2000);
  r = await st(A);
  sage(!r.pause && r.runde === 2 && r.ich === 60 && r.er === 60 && r.rtext === "Runde 2" && /Runde 2/.test(r.ansage) && r.ko === "", "Runde 2: Leben wieder voll (60/60), „Runde 2 – Kampf!“", JSON.stringify(r));
  sage(r.dran === false, "wer die Runde verloren hat (der Computer), fängt an", JSON.stringify({ dran: r.dran }));
  await bild(A, "runde2");
  await A.waitForFunction(() => window.DMA_SPIEL.pruef.st().ichDran, null, { timeout: 8000 });
  /* Runde 2 an den Computer: 1:1 */
  await A.evaluate(() => { const S = window.DMA_SPIEL.pruef.st(); S.ich.lp = 0; window.DMA_SPIEL.pruef.stratEnde(); });
  r = await st(A);
  sage(r.pause && r.siege.er === 1 && r.punkte === "1:1" && /Professor Grammatikus gewinnt/.test(r.log[0]), "Runde 2 an den Computer – 1:1", JSON.stringify(r));
  await tick(2700);
  r = await st(A);
  sage(r.runde === 3 && r.rtext === "Entscheidung" && /Entscheidungsrunde/.test(r.ansage) && r.dran === true, "1:1 → „Entscheidungsrunde“, ich (Verlierer von Runde 2) fange an", JSON.stringify(r));
  await bild(A, "entscheidung");
  const lohnVorher = await A.evaluate(() => window.__rufe.filter((x) => x.name === "spiel_extra_lohn").length);
  await A.evaluate(() => { const S = window.DMA_SPIEL.pruef.st(); S.er.lp = 1; S.er.schild = 0; S.er.konter = false; });
  await zug(A, "angriff");
  r = await st(A);
  const lohn = await A.evaluate(() => window.__rufe.filter((x) => x.name === "spiel_extra_lohn").map((x) => x.args));
  sage(r.ende && r.ko === "SIEG!" && /2:1 Runden/.test(r.log[0]) && lohn.length === lohnVorher + 1 && lohn[lohn.length - 1].p_ergebnis === 10, "Entscheidungsrunde gewonnen: „SIEG!“, 2:1 Runden, genau ein Lohn (Sieg)", JSON.stringify({ log: r.log[0], ko: r.ko, lohn }));
  await bild(A, "sieg");
  await A.evaluate(() => { const z = document.querySelector(".sp-extra-zu"); if (z) z.click(); });

  console.log("\nZU ZWEIT: FIGUR DES ANDEREN, RUNDEN AUF BEIDEN GERÄTEN\n");
  const B = await fenster(br, srv.address().port, "bea");
  await B.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.kampfklasse = "magier"; S.ich.helm = 3; S.ich.brust = 1; S.waffe = ""; });
  let laeuft = true;
  const bote = async (von, zu, zuId) => { const pakete = await von.evaluate(() => window.__raus.splice(0)); for (const p of pakete) { if (p.an && p.an !== zuId) continue; await zu.evaluate((p) => window.DMA_SPIEL.empfangen(p), p); } };
  (async () => { while (laeuft) { try { await bote(A, B, "bea"); await bote(B, A, "ich"); } catch (e) {} await tick(80); } })();
  await A.evaluate(() => { window.__raus.length = 0; window.DMA_SPIEL.pruef.extraOeffnen("strat"); });
  await tick(200);
  await klick(A, '[data-modus="echtzeit"]');
  await klick(A, '[data-st="bea"]'); await tick(600);
  await klick(B, '.sp-frage [data-ja="1"]'); await tick(800);
  const zwei = await Promise.all([A, B].map((pg) => pg.evaluate(() => ({ ich: document.querySelector(".sp-sa-ich").className, er: document.querySelector(".sp-sa-er").className,
    erHelm: /#c8312b/.test((document.querySelector(".sp-sa-er .sp-sa-kopfzier") || {}).innerHTML || ""), ichWaffe: document.querySelectorAll(".sp-sa-ich .sp-fig-arm-v svg").length }))));
  sage(/kl-magier/.test(zwei[0].er) && zwei[0].erHelm && /kl-titan/.test(zwei[1].er) && zwei[1].ichWaffe === 0 && /kl-magier/.test(zwei[1].ich), "Alex sieht Bea als Magierin mit Helm Stufe 3 (Helm geht vor den Hut), Bea sieht Alex als Titan", JSON.stringify(zwei));
  await bild(A, "zwei-alex"); await bild(B, "zwei-bea");
  /* Bea gewinnt Runde 1 (Alex hat nur noch 1 LP) */
  await A.evaluate(() => { window.DMA_SPIEL.pruef.st().ich.lp = 1; });
  await B.evaluate(() => { window.DMA_SPIEL.pruef.st().er.lp = 1; });
  await zug(B, "angriff"); await tick(600);
  const nachKo = await Promise.all([st(A), st(B)]);
  sage(nachKo.every((x) => x.pause && x.runde === 1) && nachKo[0].siege.er === 1 && nachKo[1].siege.ich === 1 && nachKo[0].punkte === "0:1" && nachKo[1].punkte === "1:0", "K.O. in Runde 1: auf BEIDEN Geräten Pause, Bea führt 1:0", JSON.stringify(nachKo.map((x) => [x.siege, x.punkte, x.pause])));
  /* Ein alter Zug, der in der Pause noch ankommt, trifft nicht mehr. */
  await tick(2800);
  const neu = await Promise.all([st(A), st(B)]);
  sage(neu.every((x) => !x.pause && x.runde === 2 && x.ich === 60 && x.er === 60), "Runde 2 auf beiden Geräten gleichzeitig: alle wieder 60 LP", JSON.stringify(neu.map((x) => [x.runde, x.ich, x.er])));
  await zug(A, "angriff"); await tick(900);
  const z2 = await Promise.all([st(A), st(B)]);
  sage(z2[0].er === z2[1].ich && z2[1].ich < 60 && z2[0].runde === 2, "der erste Treffer in Runde 2 zählt – auf beiden Geräten gleich", JSON.stringify(z2.map((x) => [x.ich, x.er])));
  laeuft = false;
  sage(A.__fehler.length + B.__fehler.length === 0, "keine Seitenfehler", A.__fehler.concat(B.__fehler).join(" | "));
  console.log("\nFassung 734 (Rundenkampf-Runden, Kämpferfiguren): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close(); process.exit(fehler ? 1 : 0);
})();
