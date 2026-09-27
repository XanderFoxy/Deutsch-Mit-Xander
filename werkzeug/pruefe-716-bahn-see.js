#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 716: EISENBAHN IM DORF UND ANGELN AM SEE (Funk 158)
   ---------------------------------------------------------------------
   XANDER (Funk 158): „im Übrigen kann auch in meiner Stadt eine Eisenbahn
   fahren und die könnte z.B Export ermöglichen oder Import das da waren
   behandelt werden und dass wir die beliefern müssen und und rausschicken
   müssen und dann können wir ja die Eisenbahn nehmen die wir schon haben
   mit realistischen schönen Rauch" und „dass man irgendwo angeln kann im
   Dorf einfach auf den See klickt und die Angler dann Angeln".
   Geprüft auf einem Android-Telefon (360 px, echte Finger): gemalte
   Strecke, der Zug nach der Uhr (hält am Bahnhof, Räder stehen dann
   still, rollen sonst passend zur Strecke), Rauch und Töne im Takt,
   Bahnhof mit Export und Import, Angeln am See.
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

  console.log("\nBAHNHOF: EXPORT UND IMPORT\n");
  await pg.evaluate(() => {
    const ich = window.__ich, bis = new Date(Date.now() + 600000).toISOString();
    window.__zug = { slot: 1, bis: bis, export: { ware: "brot", menge: 3, erloes: 29, erledigt: false }, import: { ware: "erz", menge: 4, kosten: 26, erledigt: false } };
    window.__extra = Object.assign({}, window.__extra, {
      spiel_bahn_info: () => window.__zug,
      spiel_bahn: (a) => {
        window.__bahnArgs = a;
        if (a.p_art === "export") { ich.punkte += 29; ich.vorraete.brot -= 3; window.__zug.export.erledigt = true; return Object.assign(JSON.parse(JSON.stringify(ich)), { ok: true, art: "export", ware: "brot", menge: 3, erloes: 29, zug: window.__zug }); }
        ich.punkte -= 26; ich.vorraete.erz = (ich.vorraete.erz || 0) + 4; window.__zug.import.erledigt = true; return Object.assign(JSON.parse(JSON.stringify(ich)), { ok: true, art: "import", ware: "erz", menge: 4, kosten: 26, zug: window.__zug });
      },
      spiel_angeln: (a) => { window.__angelArgs = a; return Object.assign(JSON.parse(JSON.stringify(ich)), { ok: true, fang: "fisch", menge: 2, vorraete: Object.assign({}, ich.vorraete, { fisch: 3 }) }); }
    });
    window.DMA_TONLOG.length = 0; window.__hinweise.length = 0;
  });
  await tippe(".sp-dl-bahnhof"); await tick(700);
  r = await pg.evaluate(() => { const st = document.querySelector(".sp-bahnhof"); return st ? { knoepfe: [...st.querySelectorAll('[data-s="bahn"]')].map((k) => [k.dataset.a, k.disabled, k.textContent.replace(/\s+/g, " ").trim()]) } : null; });
  sage(r && r.knoepfe.length === 2 && !r.knoepfe[0][1] && !r.knoepfe[1][1], "Tipp auf den Bahnhof: Export- und Import-Auftrag stehen da", JSON.stringify(r));
  sage(r && /3 Brot/.test(r.knoepfe[0][2]) && /\+29 P/.test(r.knoepfe[0][2]) && /4 Erz/.test(r.knoepfe[1][2]), "mit Ware, Menge und Punkten", JSON.stringify(r && r.knoepfe.map((k) => k[2])));
  const p0 = await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().ich.punkte);
  t0 = await jetztMs();
  await tippe('.sp-bahnhof [data-a="export"]'); await tick(700);
  r = await pg.evaluate(() => ({ h: window.__hinweise.slice(-1)[0] || "", p: window.DMA_SPIEL.pruef.zustand().ich.punkte, a: window.__bahnArgs, knopf: (document.querySelector('.sp-bahnhof [data-a="export"]') || {}).disabled,
    zahl: !!document.querySelector("svg.sp-dl-bahn .sp-bz-ware svg") }));
  tl = await toene(t0);
  sage(r.a && r.a.p_art === "export" && /verladen/.test(r.h) && r.p === p0 + 29, "Export: verladen, +29 Punkte", JSON.stringify({ h: r.h, p0, p: r.p }));
  sage(r.knopf === true && r.zahl && tl.some((x) => x[0] === "kasse"), "danach ist dieser Zug beladen; Ware steigt am Bahnhof auf, die Kasse klingelt", JSON.stringify({ knopf: r.knopf, zahl: r.zahl, tl }));
  await tippe('.sp-bahnhof [data-a="import"]'); await tick(700);
  r = await pg.evaluate(() => ({ h: window.__hinweise.slice(-1)[0] || "", a: window.__bahnArgs }));
  sage(r.a.p_art === "import" && /ausgeladen/.test(r.h), "Import: Erz aus der Stadt ausgeladen", r.h);
  await tippe('.sp-bahnhof .sp-dl-st-zu'); await tick(300);
  sage(await pg.evaluate(() => !document.querySelector(".sp-bahnhof")), "✕ schließt den Bahnhof wieder", "");

  console.log("\nANGELN AM SEE\n");
  await pg.evaluate(() => { window.DMA_TONLOG.length = 0; window.__hinweise.length = 0; });
  const rute = () => pg.evaluate(() => [...document.querySelectorAll(".sp-see-angler .sp-see-rute")].map((e) => e.getAttribute("d")));
  const r0 = await rute();
  t0 = await jetztMs();
  await tippe(".sp-dl-see"); await tick(250);
  const r1 = await rute();
  sage(r1.length === 2 && r1[0] !== r0[0] && r1[1] !== r0[1], "Tipp auf den See: beide Angler holen aus", JSON.stringify([r0, r1]).slice(0, 200));
  /* Warten, bis eingeholt ist (ab 1,7 s; bei voller Maschine auch später), dann sofort nachsehen. */
  for (let i = 0; i < 30; i++) { await tick(100); if (i >= 16 && await pg.evaluate(() => /Am See gefangen/.test(window.__hinweise.slice(-1)[0] || ""))) break; }
  r = await pg.evaluate(() => ({ a: window.__angelArgs, h: window.__hinweise.slice(-1)[0] || "",
    fang: [...document.querySelectorAll(".sp-see-fang")].filter((f) => f.style.display !== "none" && f.innerHTML).length }));
  tl = await toene(t0);
  sage(r.a && r.a.p_platz === 99, "gefragt wird der Server (Angelplatz 99 = Dorfsee)", JSON.stringify(r.a));
  sage(/Am See gefangen/.test(r.h) && r.fang === 1, "einer holt einen Fisch aus dem See", JSON.stringify(r));
  sage(await pg.evaluate(() => !!document.querySelector("svg.sp-dl-bahn .sp-bz-ware")), "über dem See steigt der Fang auf (+2 Fisch)", "");
  const sw = tl.find((x) => x[0] === "swoosh"), pl = tl.find((x) => x[0] === "platsch"), ku = tl.find((x) => x[0] === "angelkurbel");
  sage(sw && pl && ku && pl[1] - sw[1] > 300 && pl[1] - sw[1] < 650 && ku[1] > 1500, "Töne: Auswerfen, Platsch nach 0,45 s, Kurbel beim Einholen", JSON.stringify(tl));
  await tick(1500);
  await tippe(".sp-dl-see"); await tick(300);
  r = await pg.evaluate(() => window.__hinweise.slice(-1)[0] || "");
  /* FASSUNG 727 — Funk 176: „schickst du die Fischer für eine Zeit an den See … ich könnte ja helfen das und dann
     beschleunigt dass die Geschwindigkeit … aber das muss alles in ein System laufen". Ein Tipp ist EIN eigener Wurf;
     von selbst wirft niemand mehr beim Server aus – das tut der Trupp (werk.trupp_see). */
  sage(/warten noch auf einen Biss/.test(r), "gleich nochmal: die Angel ist noch im Wasser (12 s je Teich)", r);
  const vorher = await pg.evaluate(() => window.__rufe.filter((x) => x.name === "spiel_angeln").length);
  await tick(12400);
  const nachher = await pg.evaluate(() => window.__rufe.filter((x) => x.name === "spiel_angeln").length);
  sage(nachher === vorher, "kein Dauerangeln von selbst beim Server (das macht der Trupp)", vorher + " → " + nachher);

  console.log("\nTRUPPS (Fassung 727)\n");
  await pg.evaluate(() => {
    const ich = window.__ich, P = window.DMA_SPIEL.pruef, S = P.zustand(), jetzt = Date.now();
    ich.werk = Object.assign({}, ich.werk, { trupp_see: { ware: "fisch", menge: 4, voll: 7, start: new Date(jetzt - 60000).toISOString(), fertig: new Date(jetzt + 180000).toISOString(), trupp: "see" } });
    S.ich = JSON.parse(JSON.stringify(ich));
    window.__extra = Object.assign({}, window.__extra, {
      spiel_werk_abholen: (a) => { window.__abholArgs = a; const i = JSON.parse(JSON.stringify(ich)); i.werk = {}; ich.werk = {}; return Object.assign(i, { ok: true, menge: 5, ware: "fisch" }); },
      spiel_trupp: (a) => { window.__truppArgs = a; const jetzt2 = Date.now(); ich.werk = Object.assign({}, ich.werk, { ["trupp_" + a.p_ort]: { ware: a.p_ort === "jagd" ? "fleisch" : "holz", menge: 9, voll: 9, start: new Date(jetzt2).toISOString(), fertig: new Date(jetzt2 + 300000).toISOString(), trupp: a.p_ort } });
        return Object.assign(JSON.parse(JSON.stringify(ich)), { ok: true, neu: true, gesammelt: 0, trupp: ich.werk["trupp_" + a.p_ort] }); },
      spiel_trupp_helfen: (a) => { window.__helfArgs = a; return Object.assign(JSON.parse(JSON.stringify(ich)), { ok: true, menge: 1, ware: "holz", sek: 270, rest: 8 }); }
    });
    P.schnellZeichnen(true);
  });
  await tick(300);
  r = await pg.evaluate(() => { const e = document.querySelector(".sp-dl-see em"); return e ? { t: e.textContent, balken: !!e.querySelector("i") && parseFloat(e.querySelector("i").style.width) > 0 } : null; });
  sage(r && /Fisch 3:/.test(r.t) && r.balken, "der See zeigt, was die Fischer holen, mit Uhr und Fortschrittsbalken", JSON.stringify(r));
  const angelVorher = await pg.evaluate(() => window.__rufe.filter((x) => x.name === "spiel_angeln").length);
  let bewegt = false;
  for (let i = 0; i < 40 && !bewegt; i++) { await tick(250); bewegt = await pg.evaluate(() => [...document.querySelectorAll(".sp-see-angler .sp-see-fang")].some((f) => f.style.display !== "none" && f.innerHTML) || window.DMA_TONLOG.length < 0); if (!bewegt) bewegt = await pg.evaluate(() => { const B = window.DMA_SPIEL.pruef.bahn && window.DMA_SPIEL.pruef.bahn.B; return !!(B && (B.angel[0] || B.angel[1])); }); }
  const angelNachher = await pg.evaluate(() => window.__rufe.filter((x) => x.name === "spiel_angeln").length);
  sage(bewegt && angelNachher === angelVorher, "solange die Fischer unterwegs sind, werfen die Angler sichtbar aus – ohne Serverruf", bewegt + " · " + angelVorher + " → " + angelNachher);
  await pg.evaluate(() => { const ich = window.__ich, S = window.DMA_SPIEL.pruef.zustand(); ich.werk.trupp_see.fertig = new Date(Date.now() - 1000).toISOString(); ich.werk.trupp_see.menge = 5; S.ich = JSON.parse(JSON.stringify(ich)); window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(300);
  r = await pg.evaluate(() => (document.querySelector(".sp-dl-see em") || {}).textContent || "");
  sage(/5 Fisch fertig/.test(r), "zurück: am See steht „5 Fisch fertig“", r);
  await tippe(".sp-dl-see"); await tick(500);
  r = await pg.evaluate(() => ({ a: window.__abholArgs, h: window.__hinweise.slice(-1)[0] || "" }));
  sage(r.a && r.a.p_gebaeude === "trupp_see" && /Fischer sind zurück: \+5 Fisch/.test(r.h), "ein Tipp auf den See bringt den Fang heim (dasselbe wie „Abholen“ im Menü)", JSON.stringify(r));
  await tippe(".sp-dl-wald"); await tick(500);
  r = await pg.evaluate(() => { const st = document.querySelector(".sp-dl-station"); return st ? [...st.querySelectorAll(".sp-trupp")].map((z) => z.dataset.trupp + ":" + z.textContent.replace(/\s+/g, " ").trim()) : null; });
  sage(r && r.length === 2 && /^wald:Holzfäller im Wald/.test(r[0]) && /^jagd:Jäger im Wald/.test(r[1]) && r.every((x) => /Losschicken/.test(x)), "Tipp auf den Waldrand: Holzfäller und Jäger zum Losschicken", JSON.stringify(r));
  await tippe('.sp-dl-station [data-s="trupp"][data-g="jagd"]'); await tick(600);
  r = await pg.evaluate(() => ({ a: window.__truppArgs, h: window.__hinweise.slice(-1)[0] || "", zeile: ((document.querySelector('.sp-dl-station [data-trupp="jagd"]') || {}).textContent || "").replace(/\s+/g, " ") }));
  sage(r.a && r.a.p_ort === "jagd" && /Jäger ziehen auf die Jagd/.test(r.h) && /jagen · noch 9 von 9 Fleisch/.test(r.zeile), "die Jäger ziehen los; die Zeile zeigt Menge und Rückkehr", JSON.stringify(r));
  if (process.env.BILD) { await pg.evaluate(() => document.querySelector(".sp-dl-rahmen").scrollIntoView({ block: "start" })); await tick(400); await pg.screenshot({ path: process.env.BILD + "-trupps.png" }); }

  console.log("\nMELDUNGEN MIT SPRUNG INS DORF (Fassung 728, Funk 155/173)\n");
  /* „oben eine Meldung … wenn irgendwas fertig ist dass man das Antippen kann und direkt in dieses Dorf Mini springt auch wenn man angegriffen wird" */
  await pg.evaluate(() => { try { localStorage.removeItem("dma_dorf_gemeldet"); } catch (e) {} const P = window.DMA_SPIEL.pruef, S = P.zustand(); P.sprung().gemeldet = null; P.sprung().liste = [];
    S.schnellMenue = false; S.blick = null; S.dorfWahl = ""; P.schnellZeichnen(true);
    const ich = window.__ich, jetzt = Date.now();
    ich.werk = { trupp_wald: { ware: "holz", menge: 9, voll: 9, start: new Date(jetzt - 400000).toISOString(), fertig: new Date(jetzt - 5000).toISOString(), trupp: "wald" } };
    ich.dorf = Object.assign({}, ich.dorf, { muehle: Object.assign({}, (ich.dorf || {}).muehle || { stufe: 1, lp: 20 }, { gepl: new Date(jetzt - 60000).toISOString(), von: "Bea" }) });
    S.ich = JSON.parse(JSON.stringify(ich)); P.dorfMeldungenPruefen(); });
  await tick(400);
  r = await pg.evaluate(() => { const e = document.querySelector(".sp-sprung"); if (!e) return null; const q = e.getBoundingClientRect(); return { t: e.textContent, angriff: e.classList.contains("sp-sprung-angriff"), oben: q.top < 60, breit: q.width <= window.innerWidth - 20 }; });
  sage(r && r.angriff && /Bea hat deine Mühle geplündert/.test(r.t) && /\+1 weitere/.test(r.t) && r.oben && r.breit, "oben erscheint zuerst der Angriff (Mühle geplündert), dazu „+1 weitere“", JSON.stringify(r));
  await tippe(".sp-sprung .sp-sprung-hin"); await tick(900);
  r = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); return { offen: !!document.querySelector(".sp-dl-rahmen"), wahl: S.dorfWahl, station: ((document.querySelector(".sp-dl-station b") || {}).textContent || ""), band: !!document.querySelector(".sp-sprung") }; });
  sage(r.offen && r.wahl === "muehle" && /Mühle/.test(r.station) && !r.band, "„Ansehen“ springt ins Dorf, die Mühle ist offen", JSON.stringify(r));
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.schnellMenue = false; S.blick = null; S.dorfWahl = ""; P.schnellZeichnen(true); P.dorfMeldungenPruefen(); });
  await tick(300);
  sage(await pg.evaluate(() => !document.querySelector(".sp-sprung")), "dieselbe Sache wird nicht noch einmal gemeldet", "");
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(), ich = window.__ich; ich.werk.trupp_see = { ware: "fisch", menge: 5, voll: 7, start: new Date(Date.now() - 400000).toISOString(), fertig: new Date(Date.now() - 1000).toISOString(), trupp: "see" };
    S.ich = JSON.parse(JSON.stringify(ich)); P.dorfMeldungenPruefen(); });
  await tick(300);
  r = await pg.evaluate(() => (document.querySelector(".sp-sprung") || {}).textContent || "");
  sage(/Fischer sind zurück: 5 Fisch/.test(r), "neu Fertiges meldet sich wieder (die Fischer sind zurück)", r);
  await tippe(".sp-sprung .sp-sprung-zu"); await tick(300);
  sage(await pg.evaluate(() => !document.querySelector(".sp-sprung")), "✕ schließt die Meldung", "");
  console.log("\nWEITERE MELDUNGEN (Fassung 737, Funk 155: Entdeckung, Unzufriedenheit, Touristen, Angebote, Verkauf)\n");
  const band = () => pg.evaluate(() => { const e = document.querySelector(".sp-sprung"); return e ? { t: e.textContent, warn: e.classList.contains("sp-sprung-warnung"), svg: !!e.querySelector(".sp-sprung-bild svg") } : null; });
  const weiter = async () => { await tippe(".sp-sprung .sp-sprung-zu"); await tick(250); };
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(), ich = window.__ich;
    try { localStorage.removeItem("dma_dorf_gemeldet"); localStorage.setItem("dma_dorf_angebot_max", "5"); localStorage.setItem("dma_dorf_verkauf_max", "100"); } catch (e) {}
    P.sprung().gemeldet = null; P.sprung().liste = []; S.schnellMenue = false; S.blick = null; P.schnellZeichnen(true);
    ich.werk = {}; ich.dorf = Object.assign({}, ich.dorf); Object.keys(ich.dorf).forEach((k) => { ich.dorf[k] = Object.assign({}, ich.dorf[k]); delete ich.dorf[k].gepl; });
    ich.vorraete = { erz: 1 }; ich.punkte = 3;
    ich.volk = { arbeiter: 24, ritter: 0, quote: 20, forschung: 25, berufe: { wissenschaftler: 1 }, erforscht: [], wunder: {} };
    window.__extra = Object.assign({}, window.__extra, { spiel_angebote_liste: () => ({ ok: true, angebote: [{ id: 4, ware: "holz", menge: 3, preis: 2, von: "Cem", eigen: false }, { id: 7, ware: "erz", menge: 5, preis: 2, von: "Bea", eigen: false }, { id: 8, ware: "brot", menge: 2, preis: 9, von: "Alex", eigen: true }],
      verkauft: [{ id: 99, ware: "holz", erloes: 5, von: "Cem" }, { id: 101, ware: "brot", erloes: 18, von: "Bea" }] }) });
    S.ich = JSON.parse(JSON.stringify(ich)); P.handel().meldeZeit = 0; P.dorfMeldungenPruefen(); });
  await tick(500);
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.dorfMeldungenPruefen(); });
  await tick(400);
  /* Alle anstehenden Meldungen: die gezeigte und die wartenden. */
  const alleMeldungen = () => pg.evaluate(() => { const e = document.querySelector(".sp-sprung"); return (e ? [e.querySelector("span").firstChild.textContent] : []).concat(window.DMA_SPIEL.pruef.sprung().liste.map((m) => m.text)); });
  r = await band();
  sage(r && r.warn && /Volk unzufrieden \(\d+ %\): es fehlt Essen, Lohn, Deutsch/.test(r.t), "Unzufriedenheit kommt zuerst (bernsteinfarben) und sagt, was fehlt", JSON.stringify(r));
  let alle = (await alleMeldungen()).join(" | ");
  sage(/Dreifelderwirtschaft kann jetzt erforscht werden/.test(alle), "Forschung bereit: „Dreifelderwirtschaft kann jetzt erforscht werden“", alle);
  sage(/Bea bietet 5 Erz je 2 P an/.test(alle) && !/Cem bietet/.test(alle) && !/Alex bietet/.test(alle), "neues Angebot von Bea (ältere und eigene nicht)", alle);
  sage(/Bea hat dir Brot abgekauft: \+18 Punkte/.test(alle) && !/Cem hat/.test(alle), "Verkauf: „Bea hat dir Brot abgekauft: +18 Punkte“ (älterer Verkauf nicht)", alle);
  if (process.env.BILD) await (await pg.$(".sp-sprung")).screenshot({ path: process.env.BILD + "-unzufrieden.png" });
  await weiter();
  /* Entdeckung: genug Wissenschaftler und gutes Deutsch → das Geheimnis taucht auf; Touristen bei Wahrzeichen und bereiter Ernte. */
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(), ich = window.__ich;
    ich.volk = Object.assign({}, ich.volk, { quote: 90, berufe: { wissenschaftler: 3 }, wunder: { holstentor: true } }); ich.dorf_ab = new Date(Date.now() - 5 * 3600000).toISOString();
    S.ich = JSON.parse(JSON.stringify(ich)); P.sprung().liste = []; P.dorfMeldungenPruefen(); });
  await tick(400);
  alle = (await alleMeldungen()).join(" | ");
  sage(/Entdeckung! Geheime Forschung gefunden: Der Duden/.test(alle), "Entdeckung: der geheime Duden taucht auf", alle);
  sage(/2 Touristen warten in deiner Stadt/.test(alle), "Touristen: „2 Touristen warten in deiner Stadt – ernte …“ (Holstentor)", alle);
  await weiter();
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef; P.sprung().liste = []; P.dorfMeldungenPruefen(); });
  await tick(300);
  sage(await pg.evaluate(() => !document.querySelector(".sp-sprung")), "nichts davon kommt doppelt", "");
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef; P.sprung().liste = []; P.sprungOeffnen({ teil: "volk", ziel: "" }); });
  await tick(900);
  r = await pg.evaluate(() => { const v = document.querySelector(".sp-volk"); if (!v) return null; const q = v.getBoundingClientRect(); return { leuchtet: v.classList.contains("sp-sprung-ziel"), sichtbar: q.top >= 0 && q.top < window.innerHeight }; });
  sage(r && r.leuchtet && r.sichtbar, "„Ansehen“ bei Unzufriedenheit springt zur Volks-Zeile, die kurz aufleuchtet", JSON.stringify(r));
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); P.sprung().liste = []; S.schnellMenue = false; S.blick = null; P.schnellZeichnen(true); P.sprungOeffnen({ teil: "forschung", ziel: "" }); });
  await tick(900);
  r = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); return { teil: S.dorfTeil, forschung: !!document.querySelector(".sp-forschung-kopf"), leuchtet: !!document.querySelector(".sp-dorf-auf.sp-sprung-ziel") }; });
  sage(r.teil === "forschung" && r.forschung && r.leuchtet, "„Ansehen“ bei einer Entdeckung klappt die Forschung auf", JSON.stringify(r));
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.dorfTeil = ""; S.blick = "dorfblick"; S.schnellMenue = true; P.schnellZeichnen(true); });
  await tick(500);
  console.log("\nSTÄDTE ALS KETTE (Fassung 730, Funk 176)\n");
  /* „dass man sich durch andere stellte so nach links und rechts so durchklicken kann … oder man geht auf ihr Profil und geht einfach in ihre Stadt und greift sie an" */
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(), beaId = "11111111-1111-4111-8111-111111111111";
    const bea = Object.assign({}, S.stand[beaId] || {}, { id: beaId, name: "Bea", mitspielen: true, level: 6, dorf_name: "Beastadt",
      dorf: { muehle: { stufe: 2, lp: 40 }, rathaus: { stufe: 1, lp: 20 }, baeckerei: { stufe: 1, lp: 20 } } });
    window.__beaDorf = bea; S.stand[beaId] = bea;
    window.__extra = Object.assign({}, window.__extra, { spiel_stand: () => [window.__ich, window.__beaDorf],
      spiel_pluendern: (a) => { window.__pluenderArgs = a; return Object.assign(JSON.parse(JSON.stringify(window.__ich)), { ok: true, beute: { mehl: 2 }, gebaeude: a.p_gebaeude }); } });
    S.dorfBesuch = ""; S.dorfWahl = ""; S.blick = "dorfblick"; S.schnellMenue = true; P.schnellZeichnen(true); });
  await tick(500);
  r = await pg.evaluate(() => ((document.querySelector(".sp-dl-kette") || {}).textContent || "").replace(/\s+/g, " "));
  sage(/Dein Dorf/.test(r) && /1\/2/.test(r), "über dem Dorfbild steht die Kette: ‹ Dein Dorf · 1/2 ›", r);
  await tippe('.sp-dl-kette [data-n="1"]'); await tick(900);
  r = await pg.evaluate(() => ({ kette: ((document.querySelector(".sp-dl-kette") || {}).textContent || "").replace(/\s+/g, " "), schild: (document.querySelector(".sp-dl-ortsschild") || {}).tagName + ":" + ((document.querySelector(".sp-dl-ortsschild") || {}).textContent || ""),
    see: !!document.querySelector(".sp-dl-see"), bahnhof: !!document.querySelector(".sp-dl-bahnhof"), gemalt: (document.querySelector("canvas.sp-dl-mal") || {}).dataset ? document.querySelector("canvas.sp-dl-mal").dataset.sig : "" }));
  sage(/Bea · Beastadt/.test(r.kette) && /2\/2/.test(r.kette) && r.schild === "SPAN:Beastadt" && !r.see && !r.bahnhof && /^mue2\./.test(r.gemalt), "› blättert zu Beas Dorf: ihr Name, ihr Schild (nicht umbenennbar), ihre Häuser gemalt, keine eigenen Orte", JSON.stringify(r));
  await tippe('.sp-dl-haus-gemalt[data-g="muehle"]'); await tick(600);
  r = await pg.evaluate(() => { const st = document.querySelector(".sp-dl-station"); const k = st && st.querySelector('[data-s="pluendern"]'); return st ? { t: st.textContent.replace(/\s+/g, " ").slice(0, 80), pl: k ? !k.disabled : null } : null; });
  sage(r && /Mühle/.test(r.t) && /Stufe 2/.test(r.t) && r.pl === true, "Tipp auf Beas Mühle: Stufe und „Plündern“", JSON.stringify(r));
  await tippe('.sp-dl-station [data-s="pluendern"]'); await tick(900);
  r = await pg.evaluate(() => window.__pluenderArgs);
  sage(r && r.p_ziel === "11111111-1111-4111-8111-111111111111" && r.p_gebaeude === "muehle", "Plündern trifft Beas Mühle", JSON.stringify(r));
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.dorfWahl = ""; P.schnellZeichnen(true); });
  await tippe('.sp-schnellmenue [data-s="dorfkette"][data-n="heim"]'); await tick(700);
  r = await pg.evaluate(() => ({ besuch: window.DMA_SPIEL.pruef.zustand().dorfBesuch, see: !!document.querySelector(".sp-dl-see") }));
  sage(r.besuch === "" && r.see, "„Zurück zu meinem Dorf“", JSON.stringify(r));
  /* aus dem Profil: langer Druck auf Beas Bild → „Stadt ansehen" */
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.schnellMenue = false; S.blick = null; P.schnellZeichnen(true); });
  await tick(300);
  r = await pg.evaluate(() => { const pl = document.querySelector('#livechatKarte .lc-platz[data-lc-id="bea"]'); if (!pl) return "kein Platz";
    pl.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }));
    const m = document.getElementById("lcPlatzMenue"); if (!m) return "kein Menü";
    const b = [...m.querySelectorAll(".lc-platzmenue-knopf")].find((x) => /Stadt ansehen/.test(x.textContent)); if (!b) return "kein Knopf: " + m.textContent.slice(0, 120);
    b.click(); return "ok"; });
  await tick(900);
  const aufProfil = await pg.evaluate(() => ({ besuch: window.DMA_SPIEL.pruef.zustand().dorfBesuch, kette: ((document.querySelector(".sp-dl-kette") || {}).textContent || "").replace(/\s+/g, " ") }));
  sage(r === "ok" && aufProfil.besuch === "11111111-1111-4111-8111-111111111111" && /Beastadt/.test(aufProfil.kette), "aus dem Profil: langer Druck → „Stadt ansehen“ öffnet Beas Dorf", r + " " + JSON.stringify(aufProfil));
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.dorfBesuch = ""; S.dorfWahl = ""; S.blick = "dorfblick"; S.schnellMenue = true; P.schnellZeichnen(true); });
  await tick(500);

  const vis = await pg.evaluate(() => { const f = document.querySelector(".sp-dl-rahmen").getBoundingClientRect(), w = document.querySelector(".sp-dw-schild"), b = document.querySelector(".sp-dl-bahnhof");
    if (!w || !b) return { fehlt: !w ? "wetter" : "bahnhof" }; const a = w.getBoundingClientRect(), c = b.getBoundingClientRect();
    return { rechts: a.right > f.right - 12, zeile: a.height < 20, ueberBahnhof: a.right > c.left && a.left < c.right && a.bottom > c.top && a.top < c.bottom }; });
  sage(vis.fehlt === "wetter" || (vis.rechts && vis.zeile && !vis.ueberBahnhof), "das Wetter steht oben rechts in einer Zeile, nicht über dem Bahnhof", JSON.stringify(vis));

  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.join(" | "));
  console.log("\nFassung 716 (Eisenbahn und See): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
