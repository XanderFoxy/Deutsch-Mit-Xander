#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 697: JEDES UPGRADE HAT EINE ECHTE WIRKUNG
   ---------------------------------------------------------------------
   XANDER: „jedes Upload/Upgrade/Gebäude/Waffe soll eine echte Wirkung
   haben". Der Server ist im Rollback geprüft (spiel_697_audit: Turm-Stufe
   ohne Turm abgelehnt, Mühle Stufe 3 = 6 statt 8 min, Zielfernrohr 22,
   Eierwerfer 8). Hier der BROWSER — rechnet und zeigt er dasselbe?
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
/* So rechnet der Server seit 697 (spiel_waffe_schaden) — Preis in Klammern. */
const SERVER = { kartoffel: 6, zwille: 6, bogen: 8, laser: 7, armbrust: 12, tomahawk: 15, bazooka: 28, zielfernrohr: 22, eierwerfer: 8, huehnerwerfer: 13,
  brezel: 8, bierkrug: 13, spaetzle: 17, bratwurst: 9, sauerkraut: 4, doener: 16, mg: 18, lasersalve: 15, weisswurst: 18, nudelholz: 22,
  kuckucksuhr: 30, doppellaser: 16, streulaser: 21, plasmastrahl: 26, kugelblitz: 32 };
(async () => {
  const srv = http.createServer((q, a) => { let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a); }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 400, height: 800 } });
  const kf = []; pg.on("pageerror", (e) => kf.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_SPIEL && window.DMA_SPIEL.pruef && window.DMA_SPIEL.pruef.werkZeilenHtml, { timeout: 25000 });

  console.log("\nWAFFEN: SCHADEN WIE AUF DEM SERVER, NACH PREIS GEORDNET\n");
  const w = await pg.evaluate((liste) => Object.keys(liste).map((k) => [k, window.DMA_SPIEL.pruef.waffenSchaden(k)]), SERVER);
  const falsch = w.filter(([k, v]) => v !== SERVER[k]);
  sage(!falsch.length, "alle 25 Waffen haben im Browser denselben Schaden wie auf dem Server", JSON.stringify(falsch));
  sage(SERVER.eierwerfer > SERVER.kartoffel && SERVER.brezel > SERVER.kartoffel, "gekaufte Wurfwaffen (20 P) schlagen die Gratis-Kartoffel", "Eier " + SERVER.eierwerfer + ", Brezel " + SERVER.brezel + ", Kartoffel " + SERVER.kartoffel);
  sage(SERVER.zielfernrohr < SERVER.bazooka && SERVER.bazooka < SERVER.kuckucksuhr && SERVER.kuckucksuhr < SERVER.kugelblitz, "Zielfernrohr (100) < Bazooka (150) < Kuckucksuhr (Lv 10) < Kugelblitz (Lv 11)");

  console.log("\nTURM: AUSBAUEN NUR MIT TURM, LEER GESCHOSSEN = NACHLADEN\n");
  const t = await pg.evaluate(() => { const Z = window.DMA_SPIEL.pruef.turmZeile, b = { punkte: 999 };
    return { keiner: Z(Object.assign({}, b, { geschuetz_ladungen: 0, geschuetz_stufe: 1 })),
      leer2: Z(Object.assign({}, b, { geschuetz_ladungen: 0, geschuetz_stufe: 2, geschuetz_max: 16 })),
      voll1: Z(Object.assign({}, b, { geschuetz_ladungen: 5, geschuetz_stufe: 1, geschuetz_max: 12 })) }; });
  sage(/Kaufen · 60/.test(t.keiner) && !/geschuetz_stufe/.test(t.keiner), "ohne Turm: nur „Kaufen · 60“, kein Ausbau-Knopf");
  sage(/Nachladen · 20/.test(t.leer2) && !/Kaufen · 60/.test(t.leer2) && /Stufe 3 · 90/.test(t.leer2), "Stufe 2, leer geschossen: Nachladen · 20 und Stufe 3 (kein Neukauf für 60)");
  sage(/Nachladen · 20/.test(t.voll1) && /Stufe 2 · 70/.test(t.voll1), "mit Turm: Nachladen und Stufe 2 · 70");

  console.log("\nGEBÄUDE: HÖHERE STUFE ARBEITET SCHNELLER\n");
  const g = await pg.evaluate(() => { const H = window.DMA_SPIEL.pruef.werkZeilenHtml;
    const ich = (st) => ({ dorf: { muehle: { stufe: st, lp: 20 * st }, baeckerei: { stufe: st, lp: 20 * st }, labor: { stufe: st, lp: 20 * st } }, werk: {}, vorraete: { getreide: 30, mehl: 30, silizium: 5, gold: 5 } });
    const txt = (h) => { const d = document.createElement("div"); d.innerHTML = h; return d.textContent; };
    return { s1: txt(H(ich(1))), s2: txt(H(ich(2))), s3: txt(H(ich(3))) }; });
  sage(/Mehl · 8 min/.test(g.s1) && /Mehl · 7 min/.test(g.s2) && /Mehl · 6 min/.test(g.s3), "Mühle: 8 → 7 → 6 min (Stufe 1–3)", (g.s3.match(/Getreide → Mehl · \d+ min/) || [""])[0]);
  sage(/Kuchen \(2\) · 7 min/.test(g.s3) && /Torte: [^·]+· 10 min/.test(g.s3), "Bäckerei Stufe 3: Brot/Kuchen 7 min, Torte 10 min");
  sage(/Chip · 11 min/.test(g.s3) || /→ 1 [^·]+· 11 min/.test(g.s3), "Labor Stufe 3: 11 statt 15 min", (g.s3.match(/→ 1 [^·]+· \d+ min/) || [""])[0]);

  console.log("\nÜBUNGSPUPPE: DIE TIERE WEHREN SICH WIE IM ECHTEN KAMPF\n");
  const p = await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef;
    const mit = (x, roh) => { P.setzen({ ich: Object.assign({ skills: {}, geschuetz_ladungen: 0 }, x) }); return P.eigeneGegenwehr(roh); };
    return { einhorn: mit({ haustier: "einhorn", haustier_leben: 10, haustier_stufe: 2 }, 20),
      schaeferhund: mit({ haustier: "schaeferhund", haustier_leben: 10, haustier_stufe: 1 }, 20),
      phoenix: mit({ flugtier: "phoenix", flugtier_leben: 10, flugtier_stufe: 2 }, 20),
      lindwurm: mit({ flugtier: "lindwurm", flugtier_leben: 10, flugtier_stufe: 1 }, 20),
      eins: mit({ haustier: "drache", haustier_leben: 10, haustier_stufe: 1 }, 1) }; });
  /* Server: einhorn greatest(3,least(14,round(20*.35)))=7 ×1,15 = 8, heilt +2 · schäferhund 7 · phönix round(9×1,15)=10, heilt +2 · lindwurm 12 */
  sage(p.einhorn.gegen_tier === 8 && p.einhorn.tier_heil === 2, "Einhorn Stufe 2: 8 zurück, heilt +2", JSON.stringify(p.einhorn));
  sage(p.schaeferhund.gegen_tier === 7, "Schäferhund: 7 zurück (vorher als Fellmonster 6)", JSON.stringify(p.schaeferhund));
  sage(p.phoenix.gegen_flug === 10 && p.phoenix.tier_heil === 2, "Phönix Stufe 2: 10 zurück, heilt +2", JSON.stringify(p.phoenix));
  sage(p.lindwurm.gegen_flug === 12, "Lindwurm: 12 zurück (vorher als Eule 5)", JSON.stringify(p.lindwurm));
  sage(p.eins.gegenwehr === 1, "1 Schaden angerichtet → höchstens 1 zurück (vorher 2)", JSON.stringify(p.eins));

  console.log("\nHEILKUNST SAGT, WAS SIE TUT\n");
  const hk = await pg.evaluate(() => (window.DMA_SPIEL.pruef.skills().find((x) => x[0] === "heilkunst") || [])[2]);
  sage(/Pflaster und Heiltrank/.test(hk), "Heilkunst: „+10 % je Stufe auf Pflaster und Heiltrank“ (Server: spiel_heilen)", hk);
  sage(kf.length === 0, "keine Seitenfehler", kf.join(" | "));
  console.log("\nFassung 697: " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
