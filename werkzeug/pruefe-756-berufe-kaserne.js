#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 756: BERUFE MIT AUSBILDUNG UND DIE KASERNE (Walkie 293)
   ---------------------------------------------------------------------
   XANDER wählte: „Ja – Ausbildung, ausgebildete bringen mehr als freie
   Bewohner" und „Ja, und Soldaten brauchen eine Kaserne zum Trainieren".
   Die Rechnung liegt auf dem Server (dort in einer zurückgerollten
   Transaktion geprüft); hier wird geprüft, was man sieht und antippt:
   die Kaserne im Dorfbild, ihre Station mit Ritter-Ausbildung, die neuen
   Berufe und die größere Trupp-Menge.
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
    const altTon = window.DMA_SPIEL_BRUECKE.ton;
    window.DMA_SPIEL_BRUECKE.ton = (n, l) => { window.DMA_TONLOG.push({ name: n, wann: Math.round(performance.now()), weg: "ersatz" }); try { if (altTon) altTon(n, l); } catch (e) {} };
    /* Ab Fassung 645 meldet sich das Spiel in einer eigenen Zeile. */
    window.__spielMeldungen = window.__hinweise;
  });
  await pg.waitForTimeout(800);

  const tick = (ms) => pg.waitForTimeout(ms);
  const mitte = (sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
  const tippe = async (sel) => { await pg.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: "nearest" }); }, sel); const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };

  const seite = (chat) => pg.evaluate((c) => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + c + '"] .lc-kreis'); if (!k) return null; const r = k.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; }, chat);


  const meld = () => pg.evaluate(() => window.__hinweise.filter((h) => !/Tagesgeschenk|Übungen auf der Seite/.test(h)).slice(-1)[0] || "");


  const zuletzt = () => pg.evaluate(() => window.__hinweise.slice(-1)[0] || "");

  await pg.evaluate(() => {
    const ich = window.__ich, jetzt = Date.now();
    ich.level = 12; ich.punkte = 900;
    ich.dorf = { muehle: { stufe: 2, lp: 40 }, baeckerei: { stufe: 2, lp: 40 }, schule: { stufe: 1, lp: 20 }, rathaus: { stufe: 3, lp: 60 }, schmiede: { stufe: 1, lp: 0 },
                 kuhstall: { stufe: 1, lp: 20 }, brauerei: { stufe: 2, lp: 40 } };
    ich.werk = {}; ich.volk = { arbeiter: 20, ritter: 0, quote: 80, berufe: { bauer: 2, mueller: 1 } };
    ich.dorf_ab = new Date(jetzt - 3600000).toISOString();
    window.__extra = Object.assign({}, window.__extra || {}, { spiel_markt_preise: () => ({ ok: true, preise: {} }), spiel_angebote_liste: () => ({ ok: true, angebote: [] }) });
    ich.vorraete = Object.assign({}, ich.vorraete, { brot: 5, fisch: 1 });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = JSON.parse(JSON.stringify(ich)); S.schnellMenue = false; S.graben = false; S.dorfTeil = ""; S.dorfWahl = "";
    try { localStorage.removeItem("dma_spiel_makro"); } catch (e) {}
    window.__hinweise.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });
  /* Die Uhr der Seite verstellen: der Zug fährt nach Date.now(). */
  await pg.evaluate(() => { const echt = Date.now.bind(Date); window.__echt = echt; window.__versatz = 0; Date.now = () => echt() + window.__versatz;
    const S = window.DMA_SPIEL.pruef.zustand(); S.wetterTest = { code: 1, tag: true, temp: 18, ort: "Test" }; });
  const setzeT = (z) => pg.evaluate((z) => { const echt = window.__echt(); window.__versatz = (z - (echt / 1000) % 60) * 1000; }, z);
  const P = await pg.evaluate(() => window.DMA_SPIEL.pruef.bahn.plan());
  const bahn = (sel) => pg.evaluate(() => {
    const svg = document.querySelector("svg.sp-dl-bahn"); if (!svg) return null;
    const zug = svg.querySelector(".sp-bz-zug"), lok = zug.querySelector(".sp-bz-f"), tr = lok.getAttribute("transform") || "";
    const m = tr.match(/translate\(([-\d.]+) ([-\d.]+)\)/);
    const rad = zug.querySelectorAll(".sp-bz-rad")[2], lr = zug.querySelector(".lc-lok-rad-2");
    const rauch = [...svg.querySelectorAll(".sp-bz-rauch circle")].filter((c) => Number(c.getAttribute("r")) > 0 && Number(c.getAttribute("opacity")) > .02).length;
    return { da: zug.style.display !== "none", x: m ? Number(m[1]) : null, y: m ? Number(m[2]) : null, rad: rad ? rad.getAttribute("transform") : "", lokRad: lr ? lr.style.transform : "", rauch: rauch, teile: zug.querySelectorAll(".sp-bz-f").length };
  });
  const toene = (ab) => pg.evaluate((ab) => window.DMA_TONLOG.filter((t) => t.wann >= ab).map((t) => [t.name, t.wann - ab]), ab);
  const jetztMs = () => pg.evaluate(() => Math.round(performance.now()));

  console.log("\nOHNE KASERNE\n");
  let R = await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.ich.level = 12; S.ich.punkte = 900; S.ich.volk = { arbeiter: 20, ritter: 0, quote: 80, berufe: {} };
    S.ich.dorf = Object.assign({}, S.ich.dorf || {}, { bergwerk: { stufe: 1, lp: 20 } }); delete S.ich.dorf.kaserne;
    const d = document.createElement("div"); d.innerHTML = P.volkHtml(S.ich); const b = d.querySelector('[data-s="ritter"][data-n="1"]');
    return { da: !!b, zu: b && b.disabled, text: b ? b.textContent : "", titel: b ? b.title : "" }; });
  sage(R.da && R.zu && /braucht Kaserne/.test(R.text), "ohne Kaserne: „Ritter · braucht Kaserne“, nicht antippbar", JSON.stringify(R));

  console.log("\nDIE KASERNE IM DORF\n");
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); const d = {}; Object.keys(P.DORF_LAGE).forEach((k) => { d[k] = { stufe: 3, lp: 60 }; });
    S.ich.dorf = d; S.ich.volk = { arbeiter: 20, ritter: 1, quote: 80, berufe: {} }; S.dorfTeil = ""; S.dorfWahl = ""; S.blick = "dorfblick"; S.schnellMenue = true; P.schnellZeichnen(true); });
  await tick(1800);
  R = await pg.evaluate(() => {
    const k = document.querySelector(".sp-dl-haus[data-g=\"kaserne\"]"); if (!k) return null;
    const b = k.getBoundingClientRect(), alle = [...document.querySelectorAll(".sp-dl-ort")].filter((x) => x !== k && !x.classList.contains("sp-dl-feld"));
    const ueber = alle.filter((x) => { const q = x.getBoundingClientRect(); const ix = Math.min(b.right, q.right) - Math.max(b.left, q.left), iy = Math.min(b.bottom, q.bottom) - Math.max(b.top, q.top); return ix > 4 && iy > 4; }).map((x) => x.dataset.g);
    const c = document.querySelector("canvas.sp-dl-mal"), cb = c.getBoundingClientRect(), sx = c.width / cb.width;
    const px = c.getContext("2d").getImageData(Math.round((b.left - cb.left) * sx), Math.round((b.top - cb.top) * sx), Math.max(1, Math.round(b.width * sx)), Math.max(1, Math.round(b.height * sx))).data;
    let rot = 0, schwarz = 0, gold = 0, grau = 0;
    for (let i = 0; i < px.length; i += 4) { const r = px[i], g = px[i + 1], bl = px[i + 2];
      if (r > 180 && g < 70 && bl < 70) rot++; if (r < 45 && g < 45 && bl < 45) schwarz++; if (r > 200 && g > 160 && bl < 90) gold++; if (Math.abs(r - g) < 14 && Math.abs(g - bl) < 18 && r > 90 && r < 200) grau++; }
    const e = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    return { ueber, rot, schwarz, gold, grau, n: px.length / 4, oben: !!(e && e.closest(".sp-dl-haus[data-g=kaserne]")) };
  });
  sage(R && R.oben, "die Kaserne ist im Bild antippbar (nichts liegt darüber)", JSON.stringify(R && { oben: R.oben }));
  sage(R && R.ueber.length === 0, "ihre Tippfläche überdeckt kein anderes Gebäude", JSON.stringify(R && R.ueber));
  sage(R && R.grau > R.n * .15 && R.rot > 0 && R.schwarz > 0 && R.gold > 0, "gemalt: Feldstein und Schiefer, dazu Schwarz-Rot-Gold an der Fahne", JSON.stringify(R && { grau: R.grau, rot: R.rot, schwarz: R.schwarz, gold: R.gold, n: R.n }));
  if (process.env.BILD) await (await pg.$(".sp-dl-rahmen")).screenshot({ path: process.env.BILD });
  await pg.evaluate(() => { const k = document.querySelector(".sp-dl-haus[data-g=\"kaserne\"]"); k.scrollIntoView({ block: "center" }); });
  await tick(300);
  let m = await mitte(".sp-dl-haus[data-g=\"kaserne\"]");
  await pg.touchscreen.tap(m.x, m.y); await tick(700);
  R = await pg.evaluate(() => { const st = document.querySelector(".sp-dl-station"); if (!st) return null; const b = st.querySelector('[data-s="ritter"][data-n="1"]');
    return { titel: (st.querySelector("b") || {}).textContent, gibt: st.textContent, knopf: b ? b.textContent : "", zu: b ? b.disabled : null }; });
  sage(R && R.titel === "Kaserne" && /Ritter aus/.test(R.gibt) && /1 von 6 Rittern/.test(R.gibt), "Tipp auf die Kaserne: Station „Kaserne“, 1 von 6 Rittern (Stufe 3)", JSON.stringify(R && { titel: R.titel }));
  sage(R && /Ritter ausbilden/.test(R.knopf) && R.zu === false, "dort gleich der Knopf „Ritter ausbilden · 40 P“", JSON.stringify(R && { knopf: R.knopf, zu: R.zu }));
  await pg.evaluate(() => { window.__rufe.length = 0; window.__extra = Object.assign({}, window.__extra || {}, { spiel_ritter: (a, ich) => Object.assign({}, ich, { ok: true, ritter: 2, max: 6, preis: 40 }) }); window.__hinweise.length = 0; });
  await pg.evaluate(() => { const b = document.querySelector('.sp-dl-station [data-s="ritter"][data-n="1"]'); b.scrollIntoView({ block: "center" }); });
  await tick(200);
  m = await mitte('.sp-dl-station [data-s="ritter"][data-n="1"]');
  await pg.touchscreen.tap(m.x, m.y); await tick(500);
  R = await pg.evaluate(() => ({ ruf: window.__rufe.filter((r) => r.name === "spiel_ritter").map((r) => r.args.p_menge), meld: window.__hinweise.find((h) => /Kaserne/.test(h)) || "", ton: window.DMA_TONLOG.some((t) => t.name === "marschtrommel") }));
  sage(R.ruf.join() === "1" && /2 von 6 Ritter/.test(R.meld) && R.ton, "Tipp: Server-Ruf spiel_ritter(+1), Trommel, „… in der Kaserne ausgebildet (2 von 6 Ritter)“", JSON.stringify(R));

  console.log("\nNEUE BERUFE\n");
  R = await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.ich.volk = { arbeiter: 20, ritter: 1, quote: 80, berufe: {} };
    const dd = {}; Object.keys(P.DORF_LAGE).forEach((k) => { dd[k] = { stufe: 3, lp: 60 }; }); S.ich.dorf = dd; S.ich.punkte = 900;
    const d = document.createElement("div"); d.innerHTML = P.berufeHtml(S.ich);
    return [...d.querySelectorAll('[data-s="ausbilden"][data-n="1"]')].map((b) => b.dataset.b + (b.disabled ? "-zu" : "")); });
  sage(["fischer", "holzfaeller", "jaeger", "bergmann"].every((b) => R.indexOf(b) >= 0), "Fischer, Holzfäller, Jäger und Bergleute kann man ausbilden", R.join(","));
  R = await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); const d = document.createElement("div");
    const ohne = (() => { d.innerHTML = P.truppZeileHtml(S.ich, "wald"); return d.textContent; })();
    S.ich.volk = { arbeiter: 20, ritter: 1, quote: 80, berufe: { holzfaeller: 2, bergmann: 1 } };
    const mit = (() => { d.innerHTML = P.truppZeileHtml(S.ich, "wald"); return d.textContent; })();
    const berg = (() => { d.innerHTML = P.truppZeileHtml(S.ich, "berg"); return d.textContent; })();
    return { ohne, mit, berg }; });
  const zahl = (t) => Number((t.match(/bringen (\d+)/) || [])[1]);
  sage(zahl(R.mit) === zahl(R.ohne) + 4 && /2 ausgebildete Holzfäller \(\+4\)/.test(R.mit), "2 ausgebildete Holzfäller: +4 Holz je Fahrt (wie der Server)", R.ohne + " → " + R.mit);
  sage(/1 ausgebildete Bergmann \(\+1\)/.test(R.berg), "1 Bergmann: +1 Erz je Fahrt", R.berg);
  await pg.evaluate(() => { window.__rufe.length = 0; window.__extra.spiel_ausbilden = (a, ich) => Object.assign({}, ich, { ok: true, beruf: a.p_beruf, anzahl: 1, preis: 15 }); });
  R = await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.ich.volk = { arbeiter: 20, ritter: 1, quote: 80, berufe: {} }; S.blick = "dorfblick"; S.dorfWahl = ""; S.schnellMenue = true; P.schnellZeichnen(true);
    const b = document.querySelector('.sp-schnellmenue [data-s="ausbilden"][data-b="jaeger"][data-n="1"]'); if (!b) return "kein Knopf im Menü"; if (b.disabled) return "Knopf gesperrt"; b.click(); return "ok"; });
  await tick(400);
  const aus = await pg.evaluate(() => ({ ruf: window.__rufe.filter((r) => r.name === "spiel_ausbilden").map((r) => r.args.p_beruf + ":" + r.args.p_menge), meld: window.__hinweise.slice(-1)[0] || "" }));
  sage(R === "ok" && aus.ruf.join() === "jaeger:1" && /Jäger/.test(aus.meld), "in der Dorf-Ansicht: „Ausbilden“ beim Jäger ruft spiel_ausbilden(jaeger, 1)", JSON.stringify({ R, aus }));

  sage(!konsolenFehler.length, "keine Seitenfehler", konsolenFehler.slice(0, 2).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 756 (Berufe und Kaserne): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
