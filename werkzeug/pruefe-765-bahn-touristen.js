#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 765: TOURISMUS MIT DEM ZUG (Funk 184)
   ---------------------------------------------------------------------
   XANDER: „praktisch können wir mit dem Zug auch Tourismus in die Stadt
   bringen oder aus der Stadt um eine andere Stadt zu sehen … weil dadurch
   kann man doch Geld verdienen überleg dir da mal bitte was".
   Am Bahnhof: Touristen steigen aus (Kurtaxe + Essen), Ausflug ins
   Nachbardorf (Forschung – das Nachbardorf verdient), Gäste-Zeile und
   eine Meldung, wenn jemand zu Besuch kam. Server am Server geprüft.
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

  console.log("\nGEMALT: STRECKE, BRÜCKE, BAHNHOF\n");
  let r = await pg.evaluate(() => {
    const Q = window.DMA_SPIEL.pruef, B = Q.bahn, lw = document.createElement("canvas");
    const t0 = performance.now(); Q.dorfMalen(lw, window.__ich.dorf, Q.DORF_LAGE, 960, false, false); const dauer = performance.now() - t0;
    const g = lw.getContext("2d"), k = 960 / 320, px = (x, y) => [...g.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data];
    let gleis = 0, n = 0, tief = 0;
    for (let x = 10; x <= 310; x += 5) { const p = B.an(B.beiX(x)), c = px(p.x + p.nx * 1.15, p.y + p.ny * 1.15); n++; tief = Math.max(tief, p.y); if (!(c[1] > c[0] + 12 && c[1] > c[2] + 12)) gleis++; }
    const h = B.an(B.beiX(98)), haus = px(h.x - 4, h.y - 8.4 - 3.5);
    let schnee = "ok"; try { Q.dorfMalen(document.createElement("canvas"), window.__ich.dorf, Q.DORF_LAGE, 480, true, true); } catch (e) { schnee = String(e); }
    return { gleis, n, tief: Math.round(tief), haus, dauer: Math.round(dauer), schnee };
  });
  sage(r.tief < 76, "die Strecke läuft hinten durch die Stadt (Funk 165), nicht vorn am Bildrand", "tiefster Punkt y = " + r.tief + " von 200");
  sage(r.gleis >= r.n * .6, "die Schienen liegen quer durchs Bild (nur Bäume und Mühle stehen davor)", r.gleis + "/" + r.n);
  sage(r.haus[0] > r.haus[1] + 20, "das Bahnhofsgebäude steht da (Backstein)", JSON.stringify(r.haus));
  sage(r.schnee === "ok", "auch bei Nacht und Schnee malt es ohne Fehler", r.schnee);
  console.log("        Malzeit mit Strecke: " + r.dauer + " ms");

  console.log("\nDER ZUG NACH DER UHR\n");
  await setzeT(P.tAn + 3);
  await tippe('.sp-schnell [data-s="makro"]'); await tick(1500);
  r = await pg.evaluate(() => { const svg = document.querySelector("svg.sp-dl-bahn"); const k = svg && svg.querySelector(".lc-lok-kessel");
    return { svg: !!svg, teile: svg ? svg.querySelectorAll(".sp-bz-f").length : 0, lack: k ? getComputedStyle(k).fill : "", lok: !!(svg && svg.querySelector("svg.sp-bz-lok")) }; });
  sage(r.svg && r.teile === 5 && r.lok, "über dem Bild: die Lok vom Platz, Tender und drei Güterwagen", JSON.stringify(r));
  sage(/url\(.*lokLackD/.test(r.lack), "der Kessel ist schwarz lackiert (Verlauf gefunden, nicht nur ein Umriss)", r.lack);
  r = await pg.evaluate(async () => {
    const svg = document.querySelector("svg.sp-dl-bahn"), u = (svg.style.webkitMaskImage || svg.style.maskImage || "").replace(/^url\("?|"?\)$/g, "");
    if (!/^data:image\/png/.test(u)) return { maske: false };
    const img = new Image(); img.src = u; await img.decode();
    const c = document.createElement("canvas"); c.width = 640; c.height = 400; const g = c.getContext("2d"); g.drawImage(img, 0, 0);
    const B = window.DMA_SPIEL.pruef.bahn, a = (x, y) => g.getImageData(Math.round(x * 2), Math.round(y * 2), 1, 1).data[3];
    const m = B.an(B.beiX(50));
    const mensch = document.querySelector(".sp-dl-mensch"), lok = svg.querySelector("svg.sp-bz-lok");
    return { maske: true, muehle: a(50, m.y - 4), himmel: a(160, 12), mensch: mensch ? Math.round(mensch.getBoundingClientRect().height * 10) / 10 : null, lokH: lok ? Math.round(lok.getBoundingClientRect().height * 10) / 10 : null };
  });
  sage(r.maske && r.muehle === 0 && r.himmel === 255, "der Zug fährt hinter der Mühle vorbei (sie verdeckt ihn), am Himmel ist nichts verdeckt", JSON.stringify(r));
  let a = await bahn(), b;
  const groesse = await pg.evaluate(() => { const svg = document.querySelector("svg.sp-dl-bahn"), lok = svg.querySelector("svg.sp-bz-lok"), m = [...document.querySelectorAll(".sp-dl-mensch svg")].map((e) => e.getBoundingClientRect().height);
    return { lok: Math.round(lok.getBoundingClientRect().height * 10) / 10, menschen: m.map((h) => Math.round(h * 10) / 10) }; });
  sage(groesse.menschen.length > 0 && Math.max(...groesse.menschen) * .75 < groesse.lok, "die Leute sind kleiner als die Lokomotive (Funk 165)", JSON.stringify(groesse));
  const halt = await pg.evaluate(() => { const B = window.DMA_SPIEL.pruef.bahn, p = B.plan(), m = B.an(p.sHalt + 9); return { x: m.x + m.nx, y: m.y + m.ny }; });
  sage(a && a.da && Math.abs(a.x - halt.x) < .6, "der Zug hält am Bahnhof", JSON.stringify({ x: a && a.x, soll: halt.x }));
  await tick(500); b = await bahn();
  sage(a.rad === b.rad && a.lokRad === b.lokRad, "im Stehen stehen auch die Räder still", JSON.stringify([a.rad, b.rad, a.lokRad, b.lokRad]));
  sage(b.rauch >= 3, "im Stehen steigt ein dünner Rauchfaden aus dem Schlot", b.rauch + " Rauchballen");
  await setzeT(3); await tick(250); a = await bahn(); await tick(500); b = await bahn();
  const weg = a.x - b.x;
  sage(a.da && weg > 7 && weg < 13, "in voller Fahrt rollt er nach links (etwa 20 Einheiten je Sekunde)", "in 0,5 s: " + weg.toFixed(2));
  const winkel = (t) => Number((t.match(/rotate\(([-\d.]+)\)/) || [0, 0])[1]);
  let dw = ((winkel(a.rad) - winkel(b.rad)) % 360 + 360) % 360, soll = (weg / .9 * 57.3) % 360;
  sage(Math.abs(dw - soll) < 12 || Math.abs(dw - soll) > 348, "die Wagenräder drehen sich genau so weit, wie der Zug rollt (ohne Rutschen)", "gedreht " + dw.toFixed(0) + "°, Strecke verlangt " + soll.toFixed(0) + "°");
  sage(b.rauch >= 4, "in Fahrt zieht eine Rauchfahne hinter der Lok her", b.rauch + " Rauchballen");
  await setzeT(P.tEnde + 3); await tick(400); a = await bahn();
  sage(!a.da, "zwischen zwei Zügen ist die Strecke leer", JSON.stringify(a));

  console.log("\nLEISTUNG (Zug in Fahrt mit Rauch, 4× gedrosselt)\n");
  await setzeT(P.tAb + 1); await tick(1500);
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const l = await pg.evaluate(async () => {
    const bilder = []; let letzt = performance.now(); const ende = letzt + 3000;
    await new Promise((ok) => { const f = (t) => { bilder.push(t - letzt); letzt = t; if (t < ende) requestAnimationFrame(f); else ok(); }; requestAnimationFrame(f); });
    return { bilder: bilder.length, lang: bilder.filter((x) => x > 50).length }; });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  sage(l.bilder >= 120 && l.lang <= 5, "der fahrende Zug mit Rauch läuft flüssig (≥ 40 Bilder/s, höchstens 5 lange Bilder in 3 s)", JSON.stringify(l));

  console.log("\nTÖNE IM TAKT DES BILDES\n");
  await setzeT(P.tAn - .9); await tick(150); let t0 = await jetztMs(); await tick(1200);
  let tl = await toene(t0);
  let gl = tl.find((x) => x[0] === "lokglocke");
  sage(gl && Math.abs(gl[1] - 650) < 250, "die Glocke läutet kurz vor dem Stillstand am Bahnhof", JSON.stringify(tl));
  await setzeT(P.tAb - .8); await tick(150); t0 = await jetztMs(); await tick(1000); a = await bahn(); await tick(700); b = await bahn();
  tl = await toene(t0);
  const pf = tl.find((x) => x[0] === "lokpfeife"), st = tl.find((x) => x[0] === "lokstampf");
  sage(pf && st && st[1] - pf[1] > 200 && st[1] - pf[1] < 520, "erst pfeift die Lok, dann setzt das Stampfen ein", JSON.stringify(tl));
  sage(b.x < a.x - .3, "mit dem Stampfen fährt der Zug an", JSON.stringify([a.x, b.x]));
  sage(b.rauch >= 9, "beim Anfahren kommen Stoß für Stoß dicke Rauchwolken", b.rauch + " Rauchballen");

  console.log("\nBAHNHOF: TOURISTEN UND AUSFLUG\n");
  await pg.evaluate(() => {
    const P = window.DMA_SPIEL.pruef, S = P.zustand(), ich = window.__ich, beaId = "11111111-1111-4111-8111-111111111111", bis = new Date(Date.now() + 600000).toISOString();
    const bea = Object.assign({}, S.stand[beaId] || {}, { id: beaId, name: "Bea", mitspielen: true, level: 6, dorf_name: "Beastadt", dorf: { rathaus: { stufe: 1, lp: 20 } } });
    window.__beaDorf = bea; S.stand[beaId] = bea;
    ich.vorraete = Object.assign({}, ich.vorraete, { brot: 3, bratwurst: 1, kuchen: 0, fisch: 0 }); ich.punkte = 500;
    S.ich = JSON.parse(JSON.stringify(ich));
    try { localStorage.setItem("dma_bahn_gast_max", "7000"); } catch (e) {}
    window.__zug = { slot: 2, bis: bis, export: { ware: "brot", menge: 9, erloes: 60, erledigt: false }, import: { ware: "erz", menge: 4, kosten: 26, erledigt: false },
      touristen: { anzahl: 7, kurtaxe: 14, erledigt: false }, reise: { leute: 3, kosten: 12, forschung: 6, erledigt: false },
      gaeste: [{ id: 7721, von: "Bea", leute: 3, zeit: new Date(Date.now() - 300000).toISOString() }] };
    window.__extra = Object.assign({}, window.__extra, {
      spiel_stand: () => [window.__ich, window.__beaDorf],
      spiel_bahn_info: () => window.__zug,
      spiel_bahn: (a) => { window.__bahnArgs = a; ich.punkte += 34; ich.vorraete.brot = 0; ich.vorraete.bratwurst = 0; window.__zug.touristen.erledigt = true;
        return Object.assign(JSON.parse(JSON.stringify(ich)), { ok: true, art: "touristen", anzahl: 7, kurtaxe: 14, gekauft: 4, erloes: 34, zug: window.__zug }); },
      spiel_bahn_reise: (a) => { window.__reiseArgs = a; ich.punkte -= 12; window.__zug.reise.erledigt = true;
        return Object.assign(JSON.parse(JSON.stringify(ich)), { ok: true, art: "reise", ziel_name: "Bea", dorf_name: "Beastadt", leute: 3, kosten: 12, forschung: 6, zug: window.__zug }); } });
    window.__hinweise.length = 0; window.DMA_TONLOG.length = 0;
    S.dorfBesuch = ""; S.dorfWahl = ""; S.bahn = null; S.bahnZeit = 0; S.bahnVersuch = 0; S.schnellMenue = true; P.schnellZeichnen(true);
  });
  await tick(400);
  await pg.evaluate(() => document.querySelector(".sp-dl-bahnhof").scrollIntoView({ block: "center" })); await tick(300);
  await tippe(".sp-dl-bahnhof"); await tick(900);
  let R = await pg.evaluate(() => { const st = document.querySelector(".sp-bahnhof"); if (!st) return null; const t = st.querySelector('[data-a="touristen"]');
    return { kopf: st.querySelector(".sp-dl-st-kopf small").textContent, touristen: t && t.textContent.replace(/\s+/g, " ").trim(), aus: t && t.disabled,
      ziele: [...st.querySelectorAll('[data-s="bahnreise"]')].map((b) => b.textContent + "|" + b.dataset.z), reise: (st.querySelector(".sp-bahn-reise") || {}).textContent || "",
      gaeste: (st.querySelector(".sp-bahn-gaeste") || {}).textContent || "", hin: window.__hinweise.join(" | ") }; });
  sage(R && /Export, Import und Touristen/.test(R.kopf), "Bahnhof-Kopf: „Export, Import und Touristen“", R && R.kopf);
  sage(R && /Touristen: 7 steigen aus/.test(R.touristen) && /\+34 P \(14 Kurtaxe \+ 4 × Essen\)/.test(R.touristen) && !R.aus, "„Touristen: 7 steigen aus · +34 P (14 Kurtaxe + 4 × Essen)“ – 4 Stück Essen im Lager", JSON.stringify(R && R.touristen));
  sage(R && R.ziele.length === 1 && /Beastadt/.test(R.ziele[0]) && /11111111-1111-4111-8111-111111111111/.test(R.ziele[0]) && /−12 P, \+6 Forschung/.test(R.reise) && /9 P Eintritt/.test(R.reise),
    "Ausflug: 3 Bewohner, −12 P, +6 Forschung, Ziel „Beastadt (Bea)“, das Dorf dort verdient 9 P", JSON.stringify(R && { ziele: R.ziele, reise: R.reise }));
  sage(R && /Zu Besuch waren: Bea \(3,/.test(R.gaeste) && /Bea kam mit dem Zug zu Besuch: \+9 P Eintritt/.test(R.hin), "Gäste-Zeile „Zu Besuch waren: Bea (3, …)“ und einmal die Meldung „Bea kam mit dem Zug zu Besuch: +9 P Eintritt“", JSON.stringify(R && { g: R.gaeste, h: R.hin }));
  const gr = await pg.evaluate(() => [...document.querySelectorAll('.sp-bahnhof [data-a="touristen"], .sp-bahnhof [data-s="bahnreise"]')].map((b) => { const q = b.getBoundingClientRect(); return [Math.round(q.height), Math.round(q.right)]; }));
  sage(gr.every((x) => x[0] >= 30 && x[1] <= 360), "Knöpfe ≥ 30 px hoch, nichts ragt über 360 px hinaus", JSON.stringify(gr));
  if (process.env.BILD) { await pg.evaluate(() => document.querySelector(".sp-bahnhof").scrollIntoView({ block: "start" })); await tick(200); await (await pg.$(".sp-bahnhof")).screenshot({ path: process.env.BILD + "-bahnhof.png" }); }

  const p0 = await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().ich.punkte);
  const t9 = await jetztMs();
  await tippe('.sp-bahnhof [data-a="touristen"]'); await tick(700);
  R = await pg.evaluate(() => ({ a: window.__bahnArgs, h: window.__hinweise.slice(-1)[0] || "", p: window.DMA_SPIEL.pruef.zustand().ich.punkte, aus: document.querySelector('.sp-bahnhof [data-a="touristen"]').disabled,
    text: document.querySelector('.sp-bahnhof [data-a="touristen"]').textContent, bild: !!document.querySelector("svg.sp-dl-bahn .sp-bz-ware svg") }));
  const tl9 = await toene(t9);
  sage(R.a && R.a.p_art === "touristen" && R.p === p0 + 34 && /7 Touristen steigen aus: 14 P Kurtaxe, sie kaufen 4 × Essen – \+34 Punkte/.test(R.h), "Tipp: spiel_bahn(touristen), +34 Punkte, Meldung", JSON.stringify(R));
  sage(R.aus && /unterwegs/.test(R.text) && R.bild && tl9.some((x) => x[0] === "kasse"), "danach „sind unterwegs ✓“, Reisende steigen am Bahnhof auf, die Kasse klingelt", JSON.stringify({ aus: R.aus, bild: R.bild, tl9 }));
  await tippe('.sp-bahnhof [data-s="bahnreise"]'); await tick(700);
  R = await pg.evaluate(() => ({ a: window.__reiseArgs, h: window.__hinweise.slice(-1)[0] || "", aus: document.querySelector('.sp-bahnhof [data-s="bahnreise"]').disabled, reise: document.querySelector(".sp-bahn-reise").textContent }));
  sage(R.a && R.a.p_ziel === "11111111-1111-4111-8111-111111111111" && /3 Bewohner fahren nach Beastadt \(−12 P\) und bringen 6 Forschung mit/.test(R.h), "Ausflug: spiel_bahn_reise(Bea), „3 Bewohner fahren nach Beastadt …“", JSON.stringify(R));
  sage(R.aus && /schon unterwegs/.test(R.reise), "danach ist der Ausflug mit diesem Zug unterwegs (Knopf aus)", R.reise);
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.bahnZeit = 0; S.bahnVersuch = 0; window.__hinweise.length = 0; });
  await pg.evaluate(() => window.DMA_SPIEL.pruef.schnellZeichnen(true)); await tick(300);
  R = await pg.evaluate(() => window.__hinweise.filter((h) => /zu Besuch/.test(h)).length);
  sage(R === 0, "dieselben Gäste werden nicht noch einmal gemeldet", String(R));

  sage(!konsolenFehler.length, "keine Seitenfehler", konsolenFehler.slice(0, 2).join(" | "));
  await br.close(); srv.close();
  console.log("\nFassung 765 (Tourismus mit dem Zug): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
