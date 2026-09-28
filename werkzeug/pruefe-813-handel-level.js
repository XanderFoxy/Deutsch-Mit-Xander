#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 813: EINKAUFEN BEIM HÄNDLER, „WAS KOMMT ALS NÄCHSTES"
   ---------------------------------------------------------------------
   XANDER: „bei dem Handel stimmt auch was noch nicht weil ich kann immer
   nur noch verkaufen. Ich kann nirgendswo irgendwelche Produkte einkaufen"
   und „dass man das vorher auch irgendwo lesen kann was einen erwartet,
   wenn man sich weiter entwickelt ab welcher Stufe man wo ist und dass das
   Dorf auch eine gewisse Stufe hat … dass man auch Hinweise bekommt, was
   in Zukunft möglich ist und dann steht irgendwie, dass irgendwas gesperrt
   ist, erst ab Level 27 möglich, wie in anderen Spielen."

   Geprüft auf einem Android-Telefon (360 px, echte Fingertipps):
   · Markt & Handel hat oben einen Umschalter „Einkaufen | Verkaufen";
     Einkaufen → Ware → Menge ruft spiel_haendler_kaufen, der Vorrat steigt
     sofort sichtbar, die Punkte sinken, es gibt eine Meldung. Volles Lager
     (999) sperrt die Mengenknöpfe.
   · Bau & Ausbau: bei Level 27 geht es über Stufe 3 hinaus (Stufe 4 mit
     Baustoffen), gesperrte Häuser zeigen Schloss und „ab Level N".
   · „Was kommt als Nächstes": Dorfstufe mit Erklärung, Ausbaugrenzen je
     Level, gesperrte Häuser/Wahrzeichen/Forschungen mit „ab Level N", die
     nächsten Freischaltungen hervorgehoben.
   · Nichts überlappt, nichts ragt heraus, Tippflächen ≥ 30 px, keine
     Seitenfehler.
   Rot gegen den alten Stand: ALT=/pfad/zur/alten/spiel.js node … liefert
   diese Datei statt spiel.js aus. BILD=/pfad/praefix legt Fotos ab.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };
const ALT = process.env.ALT || "";

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    let f = path.join(WURZEL, p);
    if (ALT && p === "/spiel.js") f = ALT;
    else if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  const pg = await ctx.newPage();
  const seitenFehler = [];
  pg.on("pageerror", (e) => seitenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.removeItem("dma_spiel_makro"); } catch (e) {} });
  /* ?quelle: die Quelldateien, nicht die verkleinerten Kopien in min/ (die baut erst der Commit-Haken). */
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html?quelle", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL, { timeout: 25000 });

  await pg.evaluate(() => {
    const leute = { uebungspuppe: { id: "uebungspuppe", name: "Puppe", seit: 5000, gesehen: 9e15, buehne: true, bild: "" },
                    bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } };
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    const ichId = "00000000-0000-4000-8000-000000000000", beaId = "11111111-1111-4111-8111-111111111111";
    window.LiveChat.spielIdVon = (id) => (id === "bea" ? beaId : id === "ich" ? ichId : "");
    /* Wie Xander: Level 27, alle 16 Häuser auf Stufe 3 („ausgereizt"), genug Punkte. */
    const dorf = {};
    ["baeckerei", "schule", "schmiede", "brauerei", "bibliothek", "rathaus", "muehle", "huehnerstall", "kuhstall", "krankenhaus", "bergwerk", "labor",
     "kaserne", "gasthaus", "gefaengnis", "flickstube"].forEach((k) => { dorf[k] = { stufe: 3, lp: 60 }; });
    const ich = { id: ichId, name: "Alex", lp: 100, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, punkte: 1500, pflaster: 3, traenke: 1,
      waffen: ["kartoffel"], mission: null, mana: 60, mana_max: 100, mitspielen: true, level: 27, xp: 37484, xp_stufe: 100, xp_naechste: 300,
      skill_frei: 0, skills: {}, training: null, ladung: 0, helm: 0, brust: 0, tag_serie: 2, geschenk_offen: false, daemon_bis: null,
      dorf: dorf, dorf_ab: new Date(Date.now() - 3600000).toISOString(), werk: {},
      volk: { arbeiter: 96, ritter: 0, quote: 80, zufrieden: 80, berufe: { wissenschaftler: 8 }, forschung: 120, erforscht: ["dreifelder"] },
      vorraete: { holz: 3, erz: 12, brot: 12, fisch: 4, bratwurst: 5, getreide: 20 } };
    const bea = { id: beaId, name: "Bea", lp: 80, lp_max: 100, kaputt: false, mitspielen: true, level: 7 };
    window.__rufe = [];
    const GRUND = { getreide: 1, mehl: 3, brot: 6, kuchen: 14, duenger: 4, torte: 30, ei: 2, milch: 2, fisch: 4, fleisch: 6, holz: 2, quarz: 2, gold: 25, oel: 12, silizium: 15, chip: 60, erz: 5 };
    const preise = {}, kauf = {};
    Object.keys(GRUND).forEach((w, i) => { const laune = 0.9 + (i % 5) * 0.05; preise[w] = { ware: w, grund: GRUND[w], preis: Math.round(GRUND[w] * laune * 100) / 100, laune: laune, nachfrage: 1, beliebt: 1 };
      kauf[w] = Math.max(1, Math.ceil(GRUND[w] * laune * 1.6)); });
    window.__kauf = kauf;
    const kopie = () => JSON.parse(JSON.stringify(ich));
    const klient = { rpc: (name, args) => {
      window.__rufe.push({ name: name, args: args || {} });
      args = args || {};
      let data = { ok: true };
      if (name === "spiel_ich") data = kopie();
      else if (name === "spiel_stand") data = [kopie(), bea];
      else if (name === "spiel_markt_preise") data = { ok: true, preise: preise, kauf: window.__alterServer ? undefined : kauf, kauf_rest: 60, kauf_tag: 60, lager_max: 999, duenger_kauf: 8 };
      else if (name === "spiel_angebote_liste") data = { ok: true, angebote: [] };
      else if (name === "spiel_haendler_kaufen") {
        const n = Math.min(args.p_menge || 1, 999 - (ich.vorraete[args.p_ware] || 0)), k = kauf[args.p_ware] * n;
        if (n < 1) data = { ok: false, grund: "dein Lager ist voll" };
        else { ich.punkte -= k; ich.vorraete[args.p_ware] = (ich.vorraete[args.p_ware] || 0) + n;
          data = Object.assign({ ok: true, ware: args.p_ware, menge: n, kosten: k, preis: kauf[args.p_ware], rest_heute: 60 - n }, kopie()); }
      }
      else if (name === "spiel_markt") { const n = args.p_menge; ich.vorraete[args.p_ware] -= n; ich.punkte += n * 5; data = Object.assign({ ok: true, ware: args.p_ware, menge: n, erloes: n * 5, rang: 0 }, kopie()); }
      else if (name === "spiel_bauen") { const st = (ich.dorf[args.p_was] || {}).stufe || 0;
        ich.volk.baustellen = [{ was: args.p_was, stufe: st + 1, start: new Date().toISOString(), bis: new Date(Date.now() + 900000).toISOString(), dauer: 900, geholfen: 0 }];
        data = Object.assign({ ok: true, baustelle: args.p_was, stufe: st + 1, preis: 400, stoffe: { holz: 10, erz: 5 }, dauer: 900 }, kopie()); }
      else if (name === "spiel_trophaeen") data = { ok: true, liste: [], neu: [], lohn: 0 };
      return Promise.resolve({ data: data, error: null });
    } };
    window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ichId, ich: kopie(),
      stand: { [ichId]: kopie(), [beaId]: bea }, letzterAbruf: Date.now() });
    window.__ich = ich;
    const f = document.getElementById("lcForm"); if (f) f.style.display = "";
    window.__hinweise = []; window.__spielMeldungen = window.__hinweise;
    window.DMA_SPIEL_BRUECKE = window.DMA_SPIEL_BRUECKE || {};
    const altToast = window.DMA_SPIEL_BRUECKE.toast;
    window.DMA_SPIEL_BRUECKE.toast = (t) => { window.__hinweise.push(t); try { if (altToast) altToast(t); } catch (e) {} };
    const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; S.graben = false; S.dorfTeil = "";
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });
  await pg.waitForTimeout(800);

  const tick = (ms) => pg.waitForTimeout(ms);
  const mitte = (sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
  const tippe = async (sel) => {
    const da = await pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; e.scrollIntoView({ block: "center" }); return true; }, sel);
    if (!da) return false;
    await tick(650);
    const m = await mitte(sel); if (!m) return false;
    /* Liegt dort wirklich der Knopf (nicht etwas darüber)? */
    const oben = await pg.evaluate((a) => { const e = document.elementFromPoint(a.x, a.y), z = document.querySelector(a.s); return !!(e && z && (e === z || z.contains(e))); }, { x: m.x, y: m.y, s: sel });
    if (!oben) return "verdeckt";
    await pg.touchscreen.tap(m.x, m.y); await tick(350); return true;
  };
  const foto = async (name) => { if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-" + name + ".png" }); };
  /* Überlappung und Tippflächen im offenen Menü: jeder sichtbare Knopf ≥ 30 px hoch, ganz im Menü, keine zwei Knöpfe
     übereinander, keine abgeschnittene Beschriftung. Nur in dem Teil unter dem Umschalter „sel". */
  const lage = (sel) => pg.evaluate((sel) => {
    const box = document.querySelector(".sp-schnellmenue"), wurzel = sel ? document.querySelectorAll(sel) : [box];
    const m = box.getBoundingClientRect(), knoepfe = [];
    wurzel.forEach((w) => w.querySelectorAll("button").forEach((b) => { const r = b.getBoundingClientRect(); if (r.width && r.height && getComputedStyle(b).visibility !== "hidden") knoepfe.push([b, r]); }));
    const klein = [], raus = [], ueber = [], abgeschnitten = [];
    knoepfe.forEach(([b, r]) => {
      if (r.height < 30 || r.width < 30) klein.push(b.textContent.trim().slice(0, 30) + " " + Math.round(r.width) + "×" + Math.round(r.height));
      if (r.left < m.left - 1 || r.right > m.right + 1 || r.right > 360) raus.push(b.textContent.trim().slice(0, 30));
      if (b.scrollWidth > b.clientWidth + 2) abgeschnitten.push(b.textContent.trim().slice(0, 30));
    });
    for (let i = 0; i < knoepfe.length; i++) for (let j = i + 1; j < knoepfe.length; j++) {
      const a = knoepfe[i][1], c = knoepfe[j][1];
      if (knoepfe[i][0].contains(knoepfe[j][0]) || knoepfe[j][0].contains(knoepfe[i][0])) continue;
      const x = Math.min(a.right, c.right) - Math.max(a.left, c.left), y = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
      if (x > 1 && y > 1) ueber.push(knoepfe[i][0].textContent.trim().slice(0, 20) + " / " + knoepfe[j][0].textContent.trim().slice(0, 20));
    }
    return { n: knoepfe.length, klein: klein, raus: raus, ueber: ueber, abgeschnitten: abgeschnitten, seiteBreit: document.documentElement.scrollWidth };
  }, sel);
  const lageOk = (r) => !r.klein.length && !r.raus.length && !r.ueber.length && !r.abgeschnitten.length && r.seiteBreit <= 360;
  const zeichne = () => pg.evaluate(() => window.DMA_SPIEL.pruef.schnellZeichnen(true));

  console.log("\nDORF-MENÜ ÖFFNEN\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(900);
  let r = await pg.evaluate(() => !!document.querySelector('.sp-schnellmenue .sp-dorf-auf [data-t="markt"]'));
  sage(r, "Dorf-Menü offen, „Markt & Handel“ da");

  console.log("\nEINKAUFEN BEIM HÄNDLER\n");
  await tippe('.sp-schnellmenue .sp-dorf-auf [data-t="markt"]'); await tick(600);
  r = await pg.evaluate(() => { const b = document.querySelector('.sp-schnellmenue [data-s="handelart"][data-a="kaufen"]'); if (!b) return null;
    const auf = document.querySelector(".sp-schnellmenue .sp-dorf-auf").getBoundingClientRect(), q = b.getBoundingClientRect();
    return { text: b.textContent.trim(), abstand: Math.round(q.top - auf.bottom), h: Math.round(q.height) }; });
  sage(r && /Einkaufen/.test(r.text) && r.abstand < 60 && r.h >= 30, "gleich unter „Markt & Handel“ steht der Umschalter „Einkaufen“ (nicht erst ganz unten)", JSON.stringify(r));
  await tippe('.sp-schnellmenue [data-s="handelart"][data-a="kaufen"]'); await tick(400);
  await foto("einkaufen");
  r = await pg.evaluate(() => [...document.querySelectorAll('.sp-schnellmenue [data-s="kaufwahl"]')].map((b) => b.dataset.w));
  sage(r.length >= 15 && ["holz", "erz", "gold", "brot", "fleisch", "chip"].every((w) => r.indexOf(w) >= 0), "alle Waren, die der Markt ankauft, gibt es beim Händler zu kaufen (" + r.length + ")", r.join(","));
  r = await pg.evaluate(() => (document.querySelector('.sp-schnellmenue [data-s="kaufwahl"][data-w="holz"]') || {}).textContent || "");
  sage(/Holz/.test(r) && /du hast 3/.test(r) && /\d+ P/.test(r), "Zeile nennt Kaufpreis und Vorrat: „" + r.trim() + "“");
  const ek = await pg.evaluate(() => window.__kauf.holz);
  await tippe('.sp-schnellmenue [data-s="kaufwahl"][data-w="holz"]'); await tick(300);
  r = await pg.evaluate(() => [...document.querySelectorAll('.sp-schnellmenue [data-s="haendler"][data-w="holz"]')].map((b) => [b.dataset.n, b.textContent.trim(), b.disabled]));
  sage(r.length >= 4 && r.some((x) => x[0] === "5" && !x[2]), "Mengen zum Aufklappen (" + r.map((x) => x[1]).join(" · ") + ")", "");
  const vorher = await pg.evaluate(() => ({ punkte: window.DMA_SPIEL.pruef.zustand().ich.punkte, holz: window.DMA_SPIEL.pruef.zustand().ich.vorraete.holz }));
  await pg.evaluate(() => { window.__rufe.length = 0; window.__hinweise.length = 0; });
  const t5 = await tippe('.sp-schnellmenue [data-s="haendler"][data-w="holz"][data-n="5"]'); await tick(500);
  r = await pg.evaluate(() => ({ ruf: window.__rufe.filter((x) => x.name === "spiel_haendler_kaufen").map((x) => x.args), ich: window.DMA_SPIEL.pruef.zustand().ich,
    zeile: ((document.querySelector('.sp-schnellmenue [data-s="kaufwahl"][data-w="holz"]') || {}).textContent || "").trim(), hin: window.__hinweise.slice(-1)[0] || "" }));
  sage(t5 === true && r.ruf.length === 1 && r.ruf[0].p_ware === "holz" && r.ruf[0].p_menge === 5, "Tipp auf 5×: spiel_haendler_kaufen(holz, 5)", JSON.stringify(r.ruf) + " " + t5);
  sage(r.ich.vorraete.holz === vorher.holz + 5 && r.ich.punkte === vorher.punkte - 5 * ek, "Vorrat steigt (" + vorher.holz + " → " + r.ich.vorraete.holz + " Holz), Punkte sinken (" + vorher.punkte + " → " + r.ich.punkte + ")");
  sage(/du hast 8/.test(r.zeile), "gleich sichtbar in der Zeile: „" + r.zeile + "“");
  sage(/5 Holz gekauft/.test(r.hin), "Meldung: „" + r.hin + "“");
  await foto("gekauft");
  r = await lage(".sp-schnellmenue .sp-haendler");
  sage(r.n > 10 && lageOk(r), "Einkaufen bei 360 px: " + r.n + " Knöpfe, alle ≥ 30 px, nichts überlappt oder ragt heraus", JSON.stringify(r));
  /* Volles Lager: die Mengen sind gesperrt, die Zeile sagt es. */
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.vorraete.holz = 999; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(200);
  r = await pg.evaluate(() => ({ zeile: ((document.querySelector('.sp-schnellmenue [data-s="kaufwahl"][data-w="holz"]') || {}).textContent || "").trim(),
    frei: [...document.querySelectorAll('.sp-schnellmenue [data-s="haendler"][data-w="holz"]')].filter((b) => !b.disabled).length }));
  sage(/Lager voll/.test(r.zeile) && r.frei === 0, "Lager voll (999): „" + r.zeile + "“, keine Menge mehr kaufbar", JSON.stringify(r));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.vorraete.holz = 8; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  /* Verkaufen geht weiter wie bisher (Fassung 764). */
  await tippe('.sp-schnellmenue [data-s="handelart"][data-a="verkaufen"]'); await tick(300);
  r = await pg.evaluate(() => ((document.querySelector('.sp-schnellmenue [data-s="marktwahl"][data-w="brot"]') || {}).textContent || "").trim());
  sage(/Brot verkaufen\s*12 da/.test(r), "„Verkaufen“ zeigt wieder den Markt: „" + r + "“");

  console.log("\nBAU & AUSBAU ÜBER STUFE 3 HINAUS\n");
  await tippe('.sp-schnellmenue .sp-dorf-auf [data-t="bau"]'); await tick(500);
  r = await pg.evaluate(() => { const zeile = (k) => { const b = document.querySelector('.sp-schnellmenue .sp-troph-liste [data-s="bauen"][data-w="' + k + '"]'); return b ? [b.textContent.trim(), b.disabled] : null; };
    return { baeckerei: zeile("baeckerei"), sternwarte: zeile("sternwarte"), holzhuette: zeile("holzhuette") }; });
  sage(r.baeckerei && /Stufe 4/.test(r.baeckerei[0]) && /10 Holz, 5 Erz/.test(r.baeckerei[0]) && r.baeckerei[1], "Bäckerei auf Stufe 3 bei Level 27: Knopf „" + (r.baeckerei || [""])[0] + "“ – gesperrt, solange Holz fehlt (8 von 10)", JSON.stringify(r.baeckerei));
  sage(r.sternwarte && r.sternwarte[1] && /ab Level 30/.test(r.sternwarte[0]), "Sternwarte gesperrt: „" + (r.sternwarte || [""])[0] + "“", JSON.stringify(r.sternwarte));
  sage(r.holzhuette && !r.holzhuette[1] && /Bauen/.test(r.holzhuette[0]), "neue Holzfällerhütte (ab Level 12) baubar: „" + (r.holzhuette || [""])[0] + "“", JSON.stringify(r.holzhuette));
  await pg.evaluate(() => { const b = document.querySelector('.sp-schnellmenue .sp-troph-liste [data-w="sternwarte"]'); if (b) b.scrollIntoView({ block: "center" }); }); await tick(300);
  await foto("ausbau");
  r = await lage(".sp-schnellmenue .sp-dorf-auf + .sp-troph-liste");
  sage(r.n > 15 && lageOk(r), "Bau-Liste bei 360 px: " + r.n + " Knöpfe, nichts überlappt oder ragt heraus", JSON.stringify(r));
  /* Mit 8 Holz fehlen Baustoffe (10 nötig) – der Knopf ist gesperrt; mit 20 Holz geht es. */
  await pg.evaluate(() => { window.__rufe.length = 0; window.__ich.vorraete.holz = 20; const S = window.DMA_SPIEL.pruef.zustand(); S.ich.vorraete.holz = 20; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(200);
  await tippe('.sp-schnellmenue .sp-troph-liste [data-s="bauen"][data-w="baeckerei"]'); await tick(400);
  r = await pg.evaluate(() => ({ ruf: window.__rufe.filter((x) => x.name === "spiel_bauen").map((x) => x.args), hin: window.__hinweise.slice(-1)[0] || "" }));
  sage(r.ruf.length === 1 && r.ruf[0].p_was === "baeckerei" && /Stufe 4/.test(r.hin) && /10 Holz/.test(r.hin), "Tipp: spiel_bauen(baeckerei) – „" + r.hin.slice(0, 110) + "“");

  console.log("\nWAS KOMMT ALS NÄCHSTES\n");
  r = await pg.evaluate(() => { const b = document.querySelector('.sp-schnellmenue .sp-dorf-auf [data-t="ausblick"]'); return b ? b.textContent.trim() : null; });
  sage(!!r, "im Dorf-Menü gibt es „" + r + "“");
  r = await lage(".sp-schnellmenue .sp-dorf-auf");
  sage(r.n === 5 && lageOk(r), "die fünf Dorf-Knöpfe passen (nichts abgeschnitten, keiner über dem anderen)", JSON.stringify(r));
  await tippe('.sp-schnellmenue .sp-dorf-auf [data-t="ausblick"]'); await tick(500);
  r = await pg.evaluate(() => { const a = document.querySelector(".sp-schnellmenue .sp-ausblick"); if (!a) return null;
    return { text: a.textContent.replace(/\s+/g, " "), zu: [...a.querySelectorAll(".sp-lvzu")].map((z) => z.textContent.replace(/\s+/g, " ").trim()),
      naechst: [...a.querySelectorAll(".sp-naechst")].map((z) => z.textContent.replace(/\s+/g, " ").trim()), schloss: a.querySelectorAll(".sp-lvzu .sp-schloss").length }; });
  sage(r && /Dorfstufe/.test(r.text) && /Level/.test(r.text) && /Ausbau/.test(r.text), "Dorfstufe mit Erklärung (Level und Ausbau)", r ? r.text.slice(0, 160) : "");
  sage(r && /Stufe 6 ab Level 35/.test(r.text) && /Stufe 4 ab Level 15/.test(r.text), "Ausbaugrenzen je Level: „Stufe 4 ab Level 15 … Stufe 6 ab Level 35“", r ? (r.text.match(/Höchste Ausbaustufe.{0,120}/) || [""])[0] : "");
  sage(r && r.zu.length >= 3 && r.schloss >= r.zu.length && r.zu.every((z) => /ab Level \d+/.test(z)), "gesperrte Einträge mit Schloss und „ab Level N“ (" + (r ? r.zu.length : 0) + ")", r ? r.zu.slice(0, 5).join(" | ") : "");
  sage(r && r.zu.some((z) => /Sternwarte/.test(z)) && r.zu.some((z) => /Fernrohr|Rechenmaschine|Geheime/.test(z)), "darunter Häuser und Forschungen (Sternwarte, Fernrohr …)", "");
  sage(r && r.naechst.length >= 1 && /Level 30|Level 32/.test(r.naechst.join(" ")), "die nächsten Freischaltungen hervorgehoben: " + (r ? r.naechst.join(" | ").slice(0, 160) : ""), "");
  await foto("ausblick");
  await pg.evaluate(() => { const a = document.querySelector(".sp-schnellmenue .sp-ausblick .sp-lvzu"); if (a) a.scrollIntoView({ block: "center" }); }); await tick(300);
  await foto("ausblick-liste");
  r = await lage(".sp-schnellmenue .sp-ausblick");
  sage(lageOk(r), "Übersicht bei 360 px: nichts überlappt oder ragt heraus (" + r.n + " Knöpfe)", JSON.stringify(r));
  /* Zeilen dürfen sich nicht überdecken (auch ohne Knöpfe). */
  r = await pg.evaluate(() => { const z = [...document.querySelectorAll(".sp-schnellmenue .sp-ausblick .sp-beruf")].map((e) => e.getBoundingClientRect());
    let n = 0; for (let i = 1; i < z.length; i++) if (z[i].top < z[i - 1].bottom - 1 && z[i].left < z[i - 1].right - 1) n++; return { zeilen: z.length, ueber: n, breit: z.filter((q) => q.right > 360).length, schmal: z.filter((q) => q.width < 250).length,
      chips: [...document.querySelectorAll(".sp-schnellmenue .sp-ausblick-grenzen > span")].map((c) => Math.round(c.getBoundingClientRect().height)) }; });
  sage(r.zeilen >= 5 && r.ueber === 0 && r.breit === 0 && r.schmal === 0 && r.chips.length === 4 && r.chips.every((h) => h <= 30), "Übersichtszeilen liegen sauber untereinander (" + r.zeilen + ")", JSON.stringify(r));

  console.log("\nFORSCHUNG MIT LEVELSPERRE\n");
  await tippe('.sp-schnellmenue .sp-dorf-auf [data-t="forschung"]'); await tick(400);
  r = await pg.evaluate(() => [...document.querySelectorAll(".sp-schnellmenue .sp-forschung.sp-lvzu")].map((z) => z.textContent.replace(/\s+/g, " ").trim()));
  sage(r.length >= 2 && r.every((z) => /ab Level \d+/.test(z)) && r.some((z) => /Fernrohr/.test(z) && /ab Level 32/.test(z)), "Forschungstafel: „Fernrohr … ab Level 32“ gesperrt (" + r.length + ")", r.join(" | ").slice(0, 200));
  r = await lage(".sp-schnellmenue .sp-forschung");
  sage(r.n >= 5 && lageOk(r), "Forschung bei 360 px: nichts überlappt", JSON.stringify(r));

  sage(!seitenFehler.length, "keine Seitenfehler", seitenFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 813 (Handel und Level): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
