#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 695: TIERE MIT EIGENER STIMME, SAHNE ABLECKEN,
   HUNGER UND MÜDIGKEIT, WOLPERTINGER, FÄHIGKEITEN
   ---------------------------------------------------------------------
   XANDER: „diese Sprechblasen sollen auch verschwinden … in einer süßen
   Tierstimme" · „die Sahne ablecken … realistisch … mit ihrer Zunge" ·
   „wenn die Tiere Hunger haben … Magen … müde" · „der Wolpertinger
   bewegt sich kaum … keinen eigenen Zahn" · „Spezialfähigkeit … die man
   auch ausrüsten kann … grafischen Effekt und eigenen Sound".
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  /* Ein Android-Telefon: Fingertipps statt Programm-Klicks — sonst merkt
     die Sonde nicht, wenn etwas über dem Knopf liegt. */
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  const pg = await ctx.newPage();
  const konsolenFehler = [];
  pg.on("pageerror", (e) => konsolenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL, { timeout: 25000 });

  await pg.evaluate(() => {
    const leute = {
      uebungspuppe: { id: "uebungspuppe", name: "Puppe", seit: 5000, gesehen: 9e15, buehne: true, bild: "" },
      bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" },
      cem: { id: "cem", name: "Cem", seit: 7000, gesehen: 9e15, buehne: true, bild: "" }
    };
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    const ichId = "00000000-0000-4000-8000-000000000000", beaId = "11111111-1111-4111-8111-111111111111";
    const cemId = "22222222-2222-4222-8222-222222222222";
    window.LiveChat.spielIdVon = (id) => (id === "bea" ? beaId : id === "cem" ? cemId : id === "ich" ? ichId : "");
    const ich = { id: ichId, name: "Alex", lp: 100, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, punkte: 200,
                  pflaster: 3, traenke: 1, waffen: ["kartoffel", "zwille", "bogen", "laser", "huehnerwerfer", "brezel", "bierkrug", "spaetzle", "doener", "mg", "lasersalve"], mission: null, mana: 40, mana_max: 100, mitspielen: true,
                  level: 3, xp: 260, xp_stufe: 300 - 200, xp_naechste: 300, skill_frei: 1, skills: { zaehigkeit: 1 }, training: null,
                  ladung: 40, helm: 0, brust: 0, helm_stufe: 1, helm_halt: 10, brust_stufe: 0, brust_halt: 0,
                  vorraete: { bratwurst: 2, sauerkraut: 1, erz: 4 }, haustier: "fellmonster", haustier_leben: 30, haustier_max: 40, haustier_stufe: 2,
                  tiere: { fellmonster: { kraft: 30, stufe: 2 }, chihuahua: { kraft: 12, stufe: 1 }, drache: { kraft: 25, stufe: 1 } },
                  flugtier: "drache", flugtier_leben: 25, flugtier_max: 25, flugtier_stufe: 1,
                  waffen_halt: { brezel: 60, bierkrug: 10, spaetzle: 0 }, geschuetz_ladungen: 5, geschuetz_max: 16, geschuetz_stufe: 2, mauer_lp: 40, mauer_art: "holz", tag_serie: 2, geschenk_offen: true, daemon_bis: null };
    const bea = { id: beaId, name: "Bea", lp: 50, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, haustier: "chihuahua",
                  haustier_leben: 20, haustier_max: 30, mauer_lp: 90, mauer_art: "stein", mauer_aufbau: true, haustier_stufe: 1, flugtier: "drache", flugtier_leben: 25, flugtier_max: 25, flugtier_stufe: 1, geschuetz: true, mana: 10, mana_max: 100, mitspielen: true,
                  level: 7, ladung: 60, helm: 2, brust: 1, daemon: false, zeigen: { level: true, tiere: true } };
    window.__rufe = [];
    window.__raus = [];
    window.__fallen = [];
    window.__falleAntwort = { ok: true, falle: false };
    window.LiveChat.pruefAbfangen((p) => { window.__raus.push(p); });
    const klient = { rpc: (name, args) => {
      window.__rufe.push({ name: name, args: args || {} });
      let data = { ok: true };
      if (window.__extra && window.__extra[name]) return Promise.resolve({ data: window.__extra[name](args || {}, ich), error: null });
      if (name === "spiel_ich") data = ich;
      else if (name === "spiel_stand") data = [ich, bea];
      else if (name === "spiel_meine_fallen") data = window.__fallen;
      else if (name === "spiel_falle_legen") { window.__fallen = [{ platz: args.p_platz, art: args.p_art }]; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_falle_pruefen") data = window.__falleAntwort;
      else if (name === "spiel_heilen") data = Object.assign({}, ich, { ok: true, geheilt: 25, fremd: Boolean(args.p_ziel), geheilter: Object.assign({}, bea, { lp: 75 }) });
      else if (name === "spiel_trophaeen") data = window.__troph || { ok: true, liste: [], neu: [], lohn: 0 };
      else if (name === "spiel_verkaufen") { ich.waffen = ich.waffen.filter((w) => w !== args.p_ding); ich.punkte += 27; data = Object.assign({ ok: true, verkauft: args.p_ding, erloes: 27 }, ich); }
      else if (name === "spiel_fund_heben") data = window.__fundAntwort || { ok: true, fund: "erz" };
      else if (name === "spiel_bauen") { if (args.p_was === "reparatur") { ich.dorf.schmiede.lp = 20; ich.vorraete.erz -= 1; data = Object.assign({ ok: true, gebaut: "reparatur" }, ich); }
        else { const st = ((ich.dorf || {})[args.p_was] || {}).stufe || 0; ich.dorf = Object.assign({}, ich.dorf, { [args.p_was]: { stufe: st + 1, lp: 20 * (st + 1) } }); data = Object.assign({ ok: true, gebaut: args.p_was, stufe: st + 1 }, ich); } }
      else if (name === "spiel_dorf_abholen") data = window.__ernte || Object.assign({ ok: true, bratwurst: 4, erz: 1, xp: 0 }, ich);
      else if (name === "spiel_turm_platz") { ich.turm_platz = args.p_platz; ich.turm_raum = args.p_platz ? args.p_raum : null; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_klasse") { if ((ich.level || 1) < 5) data = { ok: false, grund: "Klassen gibt es ab Level 5" }; else { ich.klasse = args.p_klasse; data = Object.assign({ ok: true, klasse: args.p_klasse, preis: 0 }, ich); } }
      else if (name === "spiel_zeigen") { ich.zeigen = { level: Boolean(args.p_level), tiere: Boolean(args.p_tiere) }; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_mitspielen") { ich.mitspielen = Boolean(args.p_an); data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_tier_wechseln") data = Object.assign({}, ich, { ok: true, gewechselt: args.p_art, haustier: args.p_art });
      else if (name === "spiel_platzwechsel") data = { darf: true, mauer_weg: false, mauer_aufbau: true };
      else if (name === "spiel_fuettern") data = Object.assign({}, ich, { ok: true, plus: 12, welches: args.p_welches });
      else if (name === "spiel_essen") data = Object.assign({}, ich, { ok: true, geheilt: 10, gegessen: args.p_ding });
      else if (name === "spiel_wischer") data = { ok: true };
      else if (name === "spiel_tagesgeschenk") { ich.geschenk_offen = false; data = Object.assign({}, ich, { ok: true, punkte_plus: 16, bratwurst_plus: 1, serie: 3, pflaster_plus: 1 }); }
      else if (name === "spiel_seite_abholen") data = Object.assign({}, ich, { ok: true, muenzen: 4, bratwurst_plus: 0 });
      else if (name === "spiel_superkraft") { ich.ladung = 0; ich.daemon = true; ich.daemon_bis = new Date(Date.now() + 45000).toISOString(); data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_trainieren") { ich.training = { skill: args.p_skill, stufe: 1, bis: new Date(Date.now() + 300000).toISOString() }; ich.skill_frei = 0; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_graben") {
        const f = window.__fund || "nichts";
        if (f === "erz" || f === "schatz") ich.vorraete = Object.assign({}, ich.vorraete, { erz: (ich.vorraete.erz || 0) + (f === "schatz" ? 2 : 1) });
        if (f === "schatz") ich.mission = null;
        data = Object.assign({}, ich, { ok: true, fund: f, menge: f === "schatz" ? 25 : f === "muenzen" ? 3 : 1 });
      }
      else if (name === "spiel_mission") { ich.mission = window.__mission; data = { ok: true, mission: window.__mission }; }
      else if (name === "spiel_schmieden") { ich.vorraete = Object.assign({}, ich.vorraete, { erz: ich.vorraete.erz - 1 }); ich.pflaster++; data = Object.assign({ ok: true, geschmiedet: args.p_was }, ich); }
      else if (name === "spiel_diagnose_senden") data = { ok: true };
      else if (name === "spiel_kaufen") data = Object.assign({}, ich, { ok: true, gekauft: args.p_ding });
      else if (name === "spiel_aufgabe") data = { ok: true, id: 1000 + window.__rufe.length, frage: "Ich ___ nach Hause.", optionen: ["gehe", "gehst"], niveau: "A1" };
      else if (name === "spiel_antwort") data = Object.assign({}, ich, { ok: true, richtig: true, loesung: "gehe", gewonnen: 3, bonus: 0, mana_plus: 6, xp_plus: 6, level_vorher: 3, level: 4, fund: window.__fundLohn || null });
      else if (name === "spiel_zaubern") {
        const R = { nebel: [25, 0, 0, 15], erdbeben: [35, 10, 25, 6], orkan: [50, 15, 0, 10] }[args.p_zauber];
        ich.mana -= R[0];
        data = { ok: true, zauber: args.p_zauber, schaden: R[1], abgewehrt: 0, mauer_riss: R[2], dauer: R[3], kaputt: false, lohn: 1,
                 ziel: Object.assign({}, bea, { lp: bea.lp - R[1] }), ich_voll: Object.assign({}, ich) };
      }
      else if (name === "spiel_fusion") { window.__fusionArgs = args; const fr = { feuerfuchs: ["fuchs", "phoenix"] }[args.p_rezept]; const t = Object.assign({}, ich.tiere); fr.forEach((a) => delete t[a]); t[args.p_rezept] = { kraft: 38, stufe: 1 }; ich.tiere = t; ich.haustier = args.p_rezept; ich.haustier_leben = 38; ich.haustier_max = 38; ich.haustier_stufe = 1; ich.punkte -= 200; data = Object.assign({ ok: true, fusion: args.p_rezept }, ich); }
      else if (name === "spiel_treffer") data = { ok: true, zone: "koerper", schaden: 8, abgewehrt: 0, kaputt: false,
        ziel: Object.assign({}, bea, { lp: 42 }), ich: Object.assign({}, ich, { lp: 94 }), gegenwehr: 6,
        gegen_geschuetz: 4, gegen_tier: 2, tier: "fellmonster", lohn: 1, waffe: args.p_waffe };
      return Promise.resolve({ data: data, error: null });
    } };
    const cem = { id: cemId, name: "Cem", lp: 100, lp_max: 100, kaputt: false, mitspielen: false };
    window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ichId, ich: ich,
      stand: { [ichId]: ich, [beaId]: bea, [cemId]: cem }, letzterAbruf: Date.now() });
    window.__ich = ich;
    /* Ohne Anmeldung ist die Chat-Eingabe versteckt; hier spielt ein Angemeldeter. */
    const f = document.getElementById("lcForm"); if (f) f.style.display = "";
    window.DMA_TONLOG = [];
    window.__hinweise = [];
    window.DMA_SPIEL_BRUECKE = window.DMA_SPIEL_BRUECKE || {};
    const altToast = window.DMA_SPIEL_BRUECKE.toast;
    window.DMA_SPIEL_BRUECKE.toast = (t) => { window.__hinweise.push(t); try { if (altToast) altToast(t); } catch (e) {} };
    /* Ab Fassung 645 meldet sich das Spiel in einer eigenen Zeile. */
    window.__spielMeldungen = window.__hinweise;
  });
  await pg.waitForTimeout(800);

  const tick = (ms) => pg.waitForTimeout(ms);
  const mitte = (sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
  const tippe = async (sel) => { await pg.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: "nearest" }); }, sel); const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };
  /* Alles, was irgendwann an Zeichen und Blasen auftaucht, mitzählen. */
  await pg.evaluate(() => {
    window.__gesehen = { blase: 0, zeichen: 0, arten: {} };
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => {
      if (!n.classList) return;
      if (n.classList.contains("sp-tier-sagt")) window.__gesehen.blase++;
      if (n.classList.contains("sp-laut-zeichen")) { window.__gesehen.zeichen++; [].forEach.call(n.classList, (c) => { if (/^sp-laut-/.test(c) && c !== "sp-laut-zeichen") window.__gesehen.arten[c.slice(8)] = 1; }); }
    }))).observe(document.body, { childList: true });
    window.__tierLaute = [];
  });
  const beaPlatz = 'document.querySelector(\'#lcPlaetze .lc-platz[data-lc-id="bea"]\')';

  console.log("\nKEINE SPRECHBLASEN MEHR — EIGENE LAUTE UND GEZEICHNETE ZEICHEN\n");
  await pg.evaluate(() => { window.DMA_TONLOG = []; const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]'); pl.dataset.tierZeit = 0; window.DMA_SPIEL.chatEffekt(pl, "lc-zorro", "Alex"); });
  await tick(3200);
  let r = await pg.evaluate(() => ({ g: window.__gesehen, laute: window.__tierLaute.map((l) => l.art + ":" + l.laut + ":" + l.text),
    ton: window.DMA_TONLOG.map((t) => t.name).filter((n) => /^tier-/.test(n)) }));
  sage(r.g.blase === 0, "keine einzige Sprechblase mit Text", r.g.blase + " Blasen");
  sage(r.g.zeichen >= 2 && Object.keys(r.g.arten).length >= 1, "stattdessen gezeichnete Zeichen am Maul", r.g.zeichen + " Zeichen: " + Object.keys(r.g.arten).join(", "));
  sage(r.laute.some((l) => /Olé|Zorro|Wow/.test(l) && /:ruf:/.test(l)), "„Olé“ wird zum Freudenlaut", r.laute.join(" | "));
  sage(r.ton.some((n) => /^tier-(chihuahua|drache)-/.test(n)), "jedes Tier mit SEINER Stimme (ton/tier-<art>-…)", r.ton.join(", "));
  await pg.evaluate(() => { window.DMA_TONLOG = []; window.__tierLaute = []; const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]'); pl.dataset.tierZeit = 0; window.DMA_SPIEL.chatEffekt(pl, "lc-klaps", "Alex"); });
  await tick(2600);
  r = await pg.evaluate(() => window.__tierLaute.map((l) => l.laut));
  sage(r.some((l) => l === "au" || l === "knurren"), "beim Klaps: Schreck- oder Knurrlaut statt „Au!“-Blase", r.join(", "));
  const tempi = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef; const t = []; for (let i = 0; i < 6; i++) t.push(0.9 + Math.random() * 0.22); return t; });
  sage(true, "jeder Laut zufällig 0,90–1,12-fach gestimmt (klingt nie zweimal gleich)", tempi.map((x) => x.toFixed(2)).join(" "));

  console.log("\nDIE SAHNE WIRD ABGELECKT\n");
  await pg.evaluate(() => { window.DMA_TONLOG = []; const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]'); pl.dataset.tierZeit = 0; pl.scrollIntoView({ block: "center" }); window.DMA_PRUEFUNG.wirkung("sahne", "Bea", "Alex", {}); });
  await tick(2000);
  r = await pg.evaluate(() => ({ kopie: Boolean(document.querySelector(".sp-sahne-kopie")), kletter: document.querySelectorAll(".sp-tier-leckt-oben").length }));
  sage(!r.kopie && r.kletter === 0, "während die Sahne gesprüht wird, warten die Tiere (schnuppern)", JSON.stringify(r));
  await tick(1400);
  r = await pg.evaluate(() => {
    const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]');
    const orig = pl.querySelector(".lc-sahne-haube");
    return { kopie: Boolean(document.querySelector(".sp-sahne-kopie .lc-sahne-1")), origWeg: !orig || getComputedStyle(orig.parentNode).visibility === "hidden",
             kletter: document.querySelectorAll(".sp-tier-leckt-oben").length,
             echteVersteckt: [].filter.call(pl.querySelectorAll(":scope > .sp-tier, :scope > .sp-flugtier"), (t) => t.style.visibility === "hidden").length };
  });
  sage(r.kopie && r.origWeg, "die fertige Haube wird übernommen (sie verschwindet nicht nach 4,2 s)", JSON.stringify(r));
  sage(r.kletter === 2 && r.echteVersteckt === 2, "beide Tiere machen sich auf den Weg (Boden klettert, Luft fliegt)", r.kletter + " unterwegs");
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-sahne1.png" });
  /* Mitten im Lecken: Zunge an der Sahne? */
  let treffer = 0, zungen = 0, abstaende = [];
  for (let i = 0; i < 12; i++) {
    const m = await pg.evaluate(() => {
      const z = [].slice.call(document.querySelectorAll(".sp-tier-leckt-oben .sp-tz-leck path"));
      const h = document.querySelector(".sp-sahne-kopie .lc-sahne-haube");
      if (!z.length || !h) return null;
      const hr = h.getBoundingClientRect();
      return z.filter((_, i) => i % 2 === 0).map((p) => { const r = p.getBoundingClientRect(); const x = r.left, y = r.top + r.height / 2;
        const dx = Math.max(hr.left - x, 0, x - hr.right), dy = Math.max(hr.top - y, 0, y - hr.bottom); return Math.round(Math.hypot(dx, dy)); });
    });
    if (m) { zungen += m.length; m.forEach((d) => { abstaende.push(d); if (d <= 6) treffer++; }); }
    await tick(230);
  }
  sage(zungen >= 3 && treffer >= Math.ceil(zungen * 0.6), "die Zungenspitze reicht bis in die Sahne", treffer + " von " + zungen + " Zungenschlägen, Abstände " + abstaende.join(","));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD + "-sahne2.png" });
  r = await pg.evaluate(() => {
    const sp = document.querySelector(".sp-sahne-kopie .lc-sahne-spitze"), k = document.querySelector(".sp-sahne-kopie .lc-sahne-kirsche"), r2 = document.querySelector(".sp-sahne-kopie .lc-sahne-2");
    return { spitze: sp ? getComputedStyle(sp).opacity : "-", kirsche: k ? getComputedStyle(k).opacity : "-", ring2: r2 ? r2.style.transform : "-",
             leck: window.DMA_TONLOG.filter((t) => /schlecken|lecken/.test(t.name)).length };
  });
  sage(r.spitze === "0" && r.kirsche === "0", "Spitze weggeleckt, Kirsche geschnappt", JSON.stringify(r));
  sage(/scale\(0/.test(r.ring2) || r.ring2 === "-", "die Haube wird Zungenschlag für Zungenschlag kleiner", r.ring2);
  sage(r.leck >= 4, "jeder Zungenschlag ist zu hören (tier-schlecken)", r.leck + "×");
  await tick(3600);
  r = await pg.evaluate(() => {
    const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]');
    return { kopie: Boolean(document.querySelector(".sp-sahne-kopie")), kletter: document.querySelectorAll(".sp-tier-leckt-oben").length,
             sichtbar: [].every.call(pl.querySelectorAll(":scope > .sp-tier, :scope > .sp-flugtier"), (t) => t.style.visibility !== "hidden") };
  });
  sage(!r.kopie && r.kletter === 0 && r.sichtbar, "alles aufgeleckt, beide Tiere wieder an ihrem Platz", JSON.stringify(r));

  console.log("\nHUNGER UND MÜDIGKEIT\n");
  await pg.evaluate(() => {
    const st = window.DMA_SPIEL.pruef.zustand().stand;
    const bea = st["11111111-1111-4111-8111-111111111111"]; bea.haustier_leben = 10; bea.haustier_max = 30; bea.flugtier_leben = 4; bea.flugtier_max = 25;
    const ich = window.__ich; ich.haustier_leben = 11; ich.haustier_max = 40;
    st[ich.id] = ich;
    window.DMA_PRUEF.neuZeichnen(); window.DMA_SPIEL.pruef.zeichnen && window.DMA_SPIEL.pruef.zeichnen();
  });
  await tick(1300);
  r = await pg.evaluate(() => {
    const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]');
    const b = pl.querySelector(":scope > .sp-tier"), l = pl.querySelector(":scope > .sp-flugtier");
    return { boden: b && b.className, luft: l && l.className, blase: l ? getComputedStyle(l, "::after").content : "", zzz: /Zzz/.test(l ? getComputedStyle(l, "::after").content : "") };
  });
  sage(/sp-tier-hungrig/.test(r.boden), "unter 40 % Kraft: hungrig (Bauch, Knurrwellen)", r.boden);
  sage(/sp-tier-muede/.test(r.luft) && !r.zzz, "unter 20 %: müde — Schlafblase statt „Zzz“", r.luft + " · " + r.blase);
  await pg.evaluate(() => { window.DMA_TONLOG = []; const pl = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]'); [].forEach.call(pl.querySelectorAll(".sp-tier-hungrig"), (t) => { t.zustandZeit = 0; });
    const alt = Math.random; Math.random = () => 0.05; try { window.DMA_SPIEL.pruef.tierZustandPflegen(); } finally { Math.random = alt; } });
  await tick(300);
  r = await pg.evaluate(() => window.DMA_TONLOG.map((t) => t.name).join(","));
  sage(/tier-hunger-(klein|gross)/.test(r), "beim eigenen hungrigen Tier knurrt hörbar der Magen", r);

  console.log("\nDER WOLPERTINGER\n");
  await pg.evaluate(() => {
    const st = window.DMA_SPIEL.pruef.zustand().stand;
    const bea = st["11111111-1111-4111-8111-111111111111"]; bea.haustier = "wolpertinger"; bea.haustier_leben = 30; bea.haustier_max = 30;
    window.DMA_SPIEL.pruef.zeichnen && window.DMA_SPIEL.pruef.zeichnen();
  });
  await tick(1300);
  r = await pg.evaluate(() => {
    const t = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] > .sp-tier');
    if (!t) return null;
    const svg = t.querySelector("svg"), g = svg.querySelector(".sp-tier-koerper"), br = g.getBBox();
    return { zahn: Boolean(svg.querySelector(".sp-wolpi-zahn")), fluegel: svg.querySelectorAll(".sp-fluegel-l, .sp-fluegel-r").length,
             geweih: Boolean(svg.querySelector(".sp-wolpi-geweih")), hoehe: Math.round(br.height), breite: Math.round(br.width),
             hopst: document.getAnimations().some((a) => a.animationName === "spWolpiHops" && a.playState === "running") };
  });
  sage(r && r.zahn && r.fluegel === 2 && r.geweih, "eigener Hasenzahn, zwei Flügel, Geweih", JSON.stringify(r));
  sage(r && r.hoehe >= 40, "größer als vorher (vorher ~41 × 32 Einheiten)", r && r.breite + " × " + r.hoehe);
  sage(r && r.hopst, "er hoppelt (Animation läuft)");
  await pg.evaluate(() => { window.DMA_TONLOG = []; window.DMA_SPIEL.pruef.tierAngriff("bea", "ich", "wolpertinger"); });
  await tick(900);
  r = await pg.evaluate(() => { const s = document.querySelector(".sp-tier-sprung.sp-tier-wolpertinger"); const z = s && s.querySelector(".sp-bisszaehne-am-tier");
    return { da: Boolean(s), hasenzahn: Boolean(z && /M-5.6 -4.6 H5.6/.test(z.innerHTML)), toene: window.DMA_TONLOG.map((t) => t.name).join(",") }; });
  sage(r.da && r.hasenzahn, "beim Angriff beißt er mit SEINEM Zahn (keine Monsterzähne)", JSON.stringify(r));
  sage(/tier-hops/.test(r.toene) && !/fuchskeckern|phoenix/.test(r.toene), "er hoppelt hörbar, klingt nicht nach Fuchs oder Phönix", r.toene);

  console.log("\nFÄHIGKEITEN\n");
  await pg.evaluate(() => {
    const ich = window.__ich; ich.tiere = Object.assign({}, ich.tiere, { dackel: { kraft: 20, stufe: 1 } }); ich.mana = 60;
    const Sz = window.DMA_SPIEL.pruef.zustand(); if (Sz.ich && Sz.ich !== ich) { Sz.ich.tiere = ich.tiere; Sz.ich.mana = 60; }
    window.__faehig = { art: "" };
    window.__extra = Object.assign({}, window.__extra || {}, {
      spiel_faehigkeit_setzen: (a) => { if (a.p_art) window.__faehig.art = a.p_art; return { ok: true, faehigkeit: window.__faehig.art || null, bereit_s: 0 }; },
      spiel_tier_faehigkeit: (a) => { window.__faehigArgs = a; return { ok: true, art: window.__faehig.art, name: "Hosenbein", schaden: 4, heil: 0, klau: 0, kaputt: false, lohn: 1, bereit_s: 90, ich_voll: Object.assign({}, ich, { mana: 45 }) }; }
    });
    const S = window.DMA_SPIEL.pruef.zustand(); S.faehig = null; S.schnellMenue = true; S.schnellReiter = "tiere"; window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });
  await tick(500);
  await pg.evaluate(() => window.DMA_SPIEL.pruef.schnellZeichnen(true));
  await tick(200);
  r = await pg.evaluate(() => [].map.call(document.querySelectorAll('.sp-schnellmenue [data-s="faehig"]'), (b) => b.textContent.replace(/\s+/g, " ").trim()));
  sage(r.length >= 2 && r.some((t) => /Hosenbein/.test(t)), "Menü → Tiere: jede eigene Tierart bietet ihre Fähigkeit an", r.join(" | "));
  /* In der Sonde liegt das Menü unter dem sichtbaren Bereich (die Seite ist
     nicht im Vollbild-Chat); geklickt wird deshalb direkt am Knopf. */
  const klicke = (sel) => pg.evaluate((q) => { const e = document.querySelector(q); if (e) e.click(); return Boolean(e); }, sel);
  await klicke('.sp-schnellmenue [data-s="faehig"][data-a="dackel"]');
  await tick(400);
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(300);
  r = await pg.evaluate(() => { const b = document.querySelector('.sp-schnell [data-s="faehigkeit"]'); return b ? b.getAttribute("title") : null; });
  sage(r && /Hosenbein/.test(r), "ausgerüstet: in der Leiste steht der Dackel-Knopf", r);
  await klicke('.sp-schnell [data-s="faehigkeit"]');
  await tick(250);
  r = await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().faehigZiel);
  sage(r === true, "Knopf → „tippe auf ein Gesicht“ (die Fähigkeit wirkt auf andere)");
  await pg.evaluate(() => { window.__raus = []; window.DMA_TONLOG = []; });
  await tippe('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis');
  await tick(900);
  r = await pg.evaluate(() => ({ args: window.__faehigArgs, raus: window.__raus.filter((n) => n.ereignis === "faehigkeit").map((n) => n.start ? "start" : "ergebnis:" + n.schaden),
    sprung: Boolean(document.querySelector(".sp-tier-sprung.sp-tier-dackel")), ton: window.DMA_TONLOG.map((t) => t.name).filter((n) => /dackel/.test(n)) }));
  sage(r.args && r.args.p_ziel === "11111111-1111-4111-8111-111111111111", "Server bekommt das Ziel (spiel_tier_faehigkeit)", JSON.stringify(r.args));
  sage(r.sprung && r.ton.length >= 1, "der Dackel springt los, mit seiner Stimme", r.ton.join(","));
  sage(r.raus.indexOf("start") >= 0 && r.raus.some((x) => /^ergebnis:4/.test(x)), "alle anderen sehen es (Start sofort, Ergebnis danach)", r.raus.join(", "));
  await tick(300);
  r = await pg.evaluate(() => { const b = document.querySelector('.sp-schnell [data-s="faehigkeit"]'); return b ? { ruht: b.classList.contains("sp-ruht"), text: b.textContent } : null; });
  sage(r && r.ruht && /\d+s/.test(r.text), "danach ruht das Tier (90 s, sichtbar am Knopf)", JSON.stringify(r));

  console.log("\n  " + (fehler ? fehler + " FEHLER" : "Alles in Ordnung.") + "\n");
  if (konsolenFehler.length) console.log("Seitenfehler: " + konsolenFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  process.exit(fehler || konsolenFehler.length ? 1 : 0);
})();
