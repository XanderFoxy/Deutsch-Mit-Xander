#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 708: DAS DORF MIT DEM ECHTEN WETTER (Funk 150)
   ---------------------------------------------------------------------
   XANDER (Funk 150): „dass es das realistische Wetter widerspiegelt was
   wir täglich von der wetterzentrale übermittelt bekommen auch wenn es
   mal schneit dass es dann halt irgendwie schneit oder Gewitter ist dass
   man da wirklich Gewitter Sounds hat und das dann wirklich realistisch
   Blitzen sieht", „Tag und Nacht", „realistische Vögel", „das Treiben
   auch hört in dem Moment wenn man das Dorf aufruft nicht vorher", „wie
   die Sachen im Wetter die Ernte beeinflussen".
   Geprüft auf einem Android-Telefon (360 px, echte Finger): Regen, Schnee,
   Nebel, Gewitter mit Blitz und Donner zusammen, Nacht mit Lichtern,
   Sternen und Mond, Vögel mit Zwitschern, Geräusche nur bei offenem
   Dorf, Wetterschild mit Wirkung, Meldung an den Server, Ernte-Meldung,
   Leistung (4× gedrosselt).
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
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = JSON.parse(JSON.stringify(ich)); S.schnellMenue = false; S.graben = false; S.dorfTeil = ""; S.dorfWahl = "";
    try { localStorage.removeItem("dma_spiel_makro"); } catch (e) {}
    window.__hinweise.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });

  const W = (code, tag) => pg.evaluate(([code, tag]) => { const S = window.DMA_SPIEL.pruef.zustand(); S.wetterTest = { code, tag, temp: 12, ort: "Döbeln" }; window.DMA_SPIEL.pruef.schnellZeichnen(true); }, [code, tag]);
  const toene = (ab) => pg.evaluate((ab) => window.DMA_TONLOG.filter((t) => t.wann >= ab).map((t) => t.name), ab);
  const jetzt = () => pg.evaluate(() => Math.round(performance.now()));
  const bild = async (name) => { if (!process.env.BILD) return; await pg.evaluate(() => { const f = document.querySelector(".sp-dl-rahmen"); f.scrollIntoView({ block: "start" }); }); await tick(300); await (await pg.$(".sp-dl-rahmen")).screenshot({ path: process.env.BILD + "-" + name + ".png" }); };

  console.log("\nVORHER: KEIN DORF OFFEN, KEIN DORFGERÄUSCH\n");
  await W(95, true);
  let t0 = await jetzt();
  await tick(3000);
  let r = await toene(t0);
  sage(!r.some((n) => /gewitter|zwitschern|hammerschlag|enten|hundbellen|pferd|eule/.test(n)), "Gewitter draußen, aber das Dorf ist zu: nichts zu hören", JSON.stringify(r));

  console.log("\nREGEN\n");
  await W(63, true);
  await tippe('.sp-schnell [data-s="makro"]'); await tick(1200);
  r = await pg.evaluate(() => { const w = document.querySelector(".sp-dl-rahmen .sp-dw"); if (!w) return null; const tr = w.querySelectorAll(".sp-dw-regen i");
    return { klasse: w.className, tropfen: tr.length, laeuft: [...tr].slice(0, 5).every((e) => e.getAnimations().some((a) => a.playState === "running")), schild: (document.querySelector(".sp-dw-schild") || {}).textContent || "" }; });
  sage(r && /sp-dw-regen/.test(r.klasse) && r.tropfen >= 40 && r.laeuft, "Regen (WMO 63): über dem Dorf fallen Regenstriche", JSON.stringify(r && { tropfen: r.tropfen, laeuft: r.laeuft }));
  sage(r && /Regen/.test(r.schild) && /12°/.test(r.schild) && /Döbeln/.test(r.schild) && /Felder \+1 Getreide/.test(r.schild), "das Schild sagt, was draußen ist und was es bewirkt", r && r.schild);
  r = await pg.evaluate(async () => { const w = document.querySelector(".sp-dl-rahmen .sp-dw"); w.__merk = 1; for (let i = 0; i < 4; i++) { window.DMA_SPIEL.pruef.schnellZeichnen(true); await new Promise((o) => setTimeout(o, 60)); }
    const w2 = document.querySelector(".sp-dl-rahmen .sp-dw"); return { gleich: w2 === w && w2.__merk === 1 }; });
  sage(r.gleich, "4× neu zeichnen: die Regenebene bleibt dieselbe (kein Neustart der Tropfen)", JSON.stringify(r));
  r = await pg.evaluate(() => { const s = document.querySelector(".sp-dw-schild").getBoundingClientRect(); const e = document.elementFromPoint(s.left + s.width / 2, s.top + s.height / 2); return { trifft: e ? e.className : "" }; });
  sage(!/sp-dw/.test(r.trifft), "Schild und Regen fangen keinen Finger ab (man kann darunter wischen und tippen)", JSON.stringify(r));
  await bild("regen");

  console.log("\nGEWITTER: BLITZ UND DONNER ZUSAMMEN\n");
  await W(95, true);
  t0 = await jetzt();
  await pg.evaluate(() => window.DMA_SPIEL.pruef.dorfBlitz());
  await tick(60);
  r = await pg.evaluate(() => { const b = document.querySelector(".sp-dw-blitz path"); return { blitz: Boolean(b), teile: b ? (b.getAttribute("d").match(/M/g) || []).length : 0, licht: Boolean(document.querySelector(".sp-dw-blitzlicht")),
    grau: getComputedStyle(document.querySelector(".sp-dw-gewitter .sp-dw-grau")).backgroundImage.slice(0, 40), donnerNach: window.DMA_SPIEL.pruef.DW.letzterBlitz.donnerNach }; });
  await bild("gewitter");
  sage(r.blitz && r.teile >= 3 && r.licht, "ein Blitz mit Ästen, der Himmel leuchtet auf", JSON.stringify(r));
  await tick(900);
  const g = await pg.evaluate((ab) => window.DMA_TONLOG.filter((t) => t.wann >= ab && t.name === "gewitter").map((t) => t.wann - ab), t0);
  sage(g.length >= 1 && g[0] <= 800, "der Donner kommt mit dem Blitz (nah sofort, weiter weg bis 0,7 s später)", JSON.stringify(g) + " ms");
  sage(await pg.evaluate(() => !document.querySelector(".sp-dw-blitz")), "der Blitz ist nach einer Sekunde wieder weg");
  r = await pg.evaluate(async () => { const DW = window.DMA_SPIEL.pruef.DW; DW.blitz = Date.now() + 500; const vor = DW.letzterBlitz; await new Promise((o) => setTimeout(o, 1400)); return { neu: DW.letzterBlitz !== vor, uhr: Boolean(DW.uhr) }; });
  sage(r.neu && r.uhr, "bei offenem Dorf blitzt es von selbst (Abstand 5–15 s)", JSON.stringify(r));

  console.log("\nSCHNEE, NEBEL\n");
  await W(75, true); await tick(400);
  r = await pg.evaluate(() => ({ flocken: document.querySelectorAll(".sp-dw-schnee i").length, schaukeln: [...document.querySelectorAll(".sp-dw-schnee b")].slice(0, 4).every((e) => e.getAnimations().length > 0), schild: document.querySelector(".sp-dw-schild").textContent }));
  sage(r.flocken >= 40 && r.schaukeln, "Schnee (WMO 75): Flocken fallen und schaukeln", JSON.stringify({ flocken: r.flocken, schaukeln: r.schaukeln }));
  sage(/Schnee/.test(r.schild) && /Frost: −1 Getreide/.test(r.schild), "Schild: Schnee, Frost nimmt 1 Getreide", r.schild);
  await bild("schnee");
  await W(45, true); await tick(300);
  r = await pg.evaluate(() => document.querySelectorAll(".sp-dw-nebel i").length);
  sage(r === 3, "Nebel (WMO 45): drei Schwaden ziehen durchs Bild", r + " Schwaden");

  console.log("\nNACHT\n");
  await W(0, false); await tick(400);
  r = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(), d = S.ich.dorf; const heil = Object.keys(d).filter((k) => d[k].stufe > 0 && d[k].lp > 0).length;
    return { nacht: Boolean(document.querySelector(".sp-dorfland .sp-dn")), lichter: document.querySelectorAll(".sp-dn-licht").length, heil, sterne: document.querySelectorAll(".sp-dn-stern").length, mond: Boolean(document.querySelector(".sp-dn-mond")), schild: document.querySelector(".sp-dw-schild").textContent }; });
  sage(r.nacht && r.lichter === r.heil && r.sterne >= 20 && r.mond, "klare Nacht: dunkel, in jedem heilen Haus brennt Licht (die kaputte Schmiede bleibt dunkel), Sterne und Mond", JSON.stringify(r));
  sage(/Klare Nacht/.test(r.schild), "Schild: „Klare Nacht“", r.schild);
  await bild("nacht");
  await W(3, false); await tick(300);
  r = await pg.evaluate(() => ({ sterne: document.querySelectorAll(".sp-dn-stern").length, mond: Boolean(document.querySelector(".sp-dn-mond")), lichter: document.querySelectorAll(".sp-dn-licht").length }));
  sage(r.sterne === 0 && !r.mond && r.lichter > 0, "bewölkte Nacht: keine Sterne, kein Mond, die Lichter brennen", JSON.stringify(r));
  r = await pg.evaluate(() => { const l = document.querySelector('.sp-dl-haus-gemalt[data-g="baeckerei"]').getBoundingClientRect(), f = document.querySelector(".sp-dl-fenster");
    const e = document.elementFromPoint(l.left + l.width / 2, l.top + l.height * .6); return { trifft: e ? (e.closest(".sp-dl-haus-gemalt") || {}).dataset : null }; });
  sage(r.trifft && r.trifft.g === "baeckerei", "auch nachts lässt sich jedes Haus antippen (die Nacht fängt nichts ab)", JSON.stringify(r));

  console.log("\nVÖGEL\n");
  await W(1, true); await tick(300);
  t0 = await jetzt();
  await pg.evaluate(() => window.DMA_SPIEL.pruef.dorfVoegel());
  await tick(200);
  r = await pg.evaluate(() => { const s = document.querySelector(".sp-dw-schwarm"); if (!s) return null; const v = s.querySelectorAll(".sp-dw-vogel");
    return { voegel: v.length, zieht: s.getAnimations().some((a) => a.playState === "running"), schlagen: [...v].every((e) => e.querySelector("svg").getAnimations().some((a) => a.playState === "running")),
      takte: new Set([...v].map((e) => e.querySelector("b").style.animationDuration)).size }; });
  sage(r && r.voegel >= 3 && r.voegel <= 7 && r.zieht && r.schlagen, "ein Schwarm (3–7 Vögel) zieht übers Dorf und schlägt mit den Flügeln", JSON.stringify(r));
  sage(r && r.takte >= 2, "jeder Vogel schlägt in seinem eigenen Takt", r && r.takte + " verschiedene Takte");
  await tick(1500);
  r = await toene(t0);
  sage(r.includes("zwitschern"), "das Zwitschern kommt, wenn der Schwarm ins Bild fliegt", JSON.stringify(r));
  r = await pg.evaluate(async () => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.ich = Object.assign({}, S.ich, { dorf: Object.assign({}, S.ich.dorf, { schmiede: { stufe: 1, lp: 20 } }) });
    const l = []; for (let i = 0; i < 30; i++) { P.dorfTreiben(P.dorfWetter()); l.push(P.DW.letzterLaut); } return [...new Set(l)]; });
  sage(r.includes("hammerschlag") && r.includes("enten"), "das Treiben: Hammer aus der Schmiede, Enten am Teich …", JSON.stringify(r));

  console.log("\nZU: SOFORT STILL\n");
  await W(95, true); await tick(300);
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  t0 = await jetzt();
  await tick(4000);
  r = { toene: await toene(t0), uhr: await pg.evaluate(() => window.DMA_SPIEL.pruef.DW.uhr) };
  sage(!r.uhr && !r.toene.some((n) => /gewitter|zwitschern|hammerschlag|enten|hundbellen|pferd|eule/.test(n)), "Dorf zu: kein Blitz, kein Donner, kein Treiben mehr", JSON.stringify(r));

  console.log("\nDAS WETTER WIRKT AUF DIE ERNTE\n");
  r = await pg.evaluate(async () => {
    window.__rufe.length = 0;
    window.DMA_WETTER = window.DMA_WETTER || {}; window.DMA_WETTER.jetzt = { code: 63, tag: true, temp: 12, ort: "Döbeln", zeit: Date.now() };
    window.dispatchEvent(new CustomEvent("dma-wetter")); await new Promise((o) => setTimeout(o, 200));
    window.dispatchEvent(new CustomEvent("dma-wetter")); await new Promise((o) => setTimeout(o, 200));
    return window.__rufe.filter((x) => x.name === "spiel_wetter_melden").map((x) => x.args); });
  sage(r.length === 1 && r[0].p_code === 63 && r[0].p_tag === true, "die Messung geht einmal an den Server (nicht bei jeder Wiederholung)", JSON.stringify(r));
  r = await pg.evaluate(async () => {
    const S = window.DMA_SPIEL.pruef.zustand(), ich = window.__ich;
    window.__extra = Object.assign({}, window.__extra, { spiel_ernten: () => Object.assign({}, JSON.parse(JSON.stringify(ich)), { ok: true, menge: 3, besaet: false, wetter: "regen", wetter_plus: 1 }) });
    S.ich = Object.assign({}, S.ich, { acker: {} }); window.__hinweise.length = 0;
    const k = [...document.querySelectorAll("#lcPlaetze .lc-platz")].find((q) => !q.dataset.lcId && q.querySelector(".lc-kreis"));
    window.DMA_SPIEL.pruef.ernten(k, Number(k.dataset.lcPlatz));
    await new Promise((o) => setTimeout(o, 1200));
    return window.__hinweise.filter((h) => /Getreide/.test(h)).slice(-1)[0] || ""; });
  sage(/\+3 Getreide/.test(r) && /Der Regen hilft: \+1/.test(r), "Ernte bei Regen: die Meldung sagt, dass der Regen +1 gebracht hat", r);

  console.log("\nLEISTUNG (Gewitter, 4× gedrosselt)\n");
  await tippe('.sp-schnell [data-s="makro"]'); await tick(600);
  await W(99, true); await tick(500);
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const l = await pg.evaluate(async () => {
    window.DMA_SPIEL.pruef.dorfBlitz(); window.DMA_SPIEL.pruef.dorfVoegel();
    const bilder = []; let letzt = performance.now(); const ende = letzt + 3000;
    await new Promise((ok) => { const f = (t) => { bilder.push(t - letzt); letzt = t; if (t < ende) requestAnimationFrame(f); else ok(); }; requestAnimationFrame(f); });
    return { bilder: bilder.length, lang: bilder.filter((x) => x > 50).length }; });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  sage(l.bilder >= 120 && l.lang <= 5, "Gewitter mit 64 Regenstrichen, Blitz und Vögeln: flüssig (≥ 40 Bilder/s, höchstens 5 lange Bilder in 3 s)", JSON.stringify(l));

  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.join(" | "));
  console.log("\nFassung 708 (Dorf mit echtem Wetter): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
