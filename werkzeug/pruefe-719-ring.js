#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 719: DER KLEINE DOPPELRING
   ---------------------------------------------------------------------
   XANDER (Funk 165): „der Ring muss deutlich kleiner sein … dass die
   zwei Ringe Zauber und und Waffen in einem Modul sind aber nicht so mit
   diesen äh dass man erste die Tür öffnen muss … mit einem langen
   gehaltenen Tipp anschaltet dass man es mit einem langen gehaltenen
   Tipp wieder ausschalten kann … man legt sich sowieso für jeden Bereich
   eine Waffe fest … auf den Bereich einer Waffe klicken und dann andere
   Waffen aus diesen Bereich auszuwählen die dann in einem waagerechten
   Lehrer über dieser Position zu finden sind" und „was für die Minen und
   Bomben überlegen wie die in diesem Kreis zu finden sind".
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

  const B = process.env.BILD;
  await pg.evaluate(() => { const ich = window.__ich; ich.level = 10; ich.punkte = 200; ich.mana = 60;
    ich.waffen = ich.waffen.concat(["armbrust", "bazooka", "kuckucksuhr", "doppellaser"]); window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(300);

  console.log("\nLANGER DRUCK ÖFFNET DEN RING – OHNE TÜREN\n");
  await pg.evaluate(() => { window.DMA_SPIEL.langAufEigen(null); });
  await tick(400);
  const r1 = await pg.evaluate(() => {
    const r = document.querySelector(".sp-schnell .sp-ring"); if (!r) return { da: false };
    const q = r.getBoundingClientRect(), M = { x: q.left + q.width / 2, y: q.top + q.height / 2 };
    const ab = (e) => { const b = e.getBoundingClientRect(); return Math.hypot(b.left + b.width / 2 - M.x, b.top + b.height / 2 - M.y); };
    const aussen = [...r.querySelectorAll(".sp-ring-feld")], innen = [...r.querySelectorAll(".sp-ring-zauber")];
    const tippbar = [...aussen, ...innen].every((b) => { const k = b.getBoundingClientRect(); const o = document.elementFromPoint(k.left + k.width / 2, k.top + k.height / 2); return o && (o === b || b.contains(o)); });
    const alle = [...aussen, ...innen]; let ueber = 0;
    for (let i = 0; i < alle.length; i++) for (let j = i + 1; j < alle.length; j++) { const a = alle[i].getBoundingClientRect(), b = alle[j].getBoundingClientRect();
      /* Die Knöpfe sind rund: es zählt der Abstand der Mittelpunkte, nicht das umgebende Viereck. */
      if (Math.hypot((a.left + a.width / 2) - (b.left + b.width / 2), (a.top + a.height / 2) - (b.top + b.height / 2)) < (a.width + b.width) / 2 - 1) { ueber++; (window.__ueber = window.__ueber || []).push((alle[i].dataset.b || alle[i].dataset.z) + "/" + (alle[j].dataset.b || alle[j].dataset.z)); } }
    return { da: true, breite: Math.round(q.width), imBild: q.left >= 0 && q.right <= innerWidth && q.top >= 0, tueren: Boolean(document.querySelector(".sp-langwahl,[data-s=langzauber],[data-s=langwaffen]")),
      bereiche: aussen.map((b) => b.dataset.b).join(","), aussenAb: Math.round(Math.min(...aussen.map(ab))), innenAb: Math.round(Math.max(...innen.map(ab))), zauber: innen.length,
      mana: Boolean(r.querySelector(".sp-ring-mana")), torte: Boolean(r.querySelector('[data-s="iss"],[data-s="trinken"],[data-s="manakauf"]')), tippbar, ueber, paare: (window.__ueber || []).join(" ") };
  });
  if (B) await pg.screenshot({ path: B + "-ring.png" });
  sage(r1.da && !r1.tueren, "langer Druck aufs eigene Bild: gleich der Ring, keine Tür „Zauber | Waffen“ davor", JSON.stringify(r1));
  sage(r1.breite <= 220 && r1.imBild, "der Ring ist klein (höchstens 220 px statt bis zu 360 px) und ganz im Bild", JSON.stringify({ breite: r1.breite, imBild: r1.imBild }));
  sage(r1.innenAb < r1.aussenAb && r1.zauber >= 9 && /standard/.test(r1.bereiche) && /lustig/.test(r1.bereiche) && /stark/.test(r1.bereiche), "zwei Ringe ineinander: außen die Waffen-Bereiche, innen die Zauber", JSON.stringify(r1));
  /* FASSUNG 831 — XANDER (Funk 255): „Mine und Falltür … innerhalb des Waffen Menüs als extrasymbole innerhalb des Kreises" */
  const fa = await pg.evaluate(() => { const r = document.querySelector(".sp-ring"), M = r.getBoundingClientRect(), mx = M.left + M.width / 2, my = M.top + M.height / 2;
    return [...r.querySelectorAll(".sp-ring-falle")].map((b) => { const q = b.getBoundingClientRect(); return { w: b.dataset.w, ab: Math.round(Math.hypot(q.left + q.width / 2 - mx, q.top + q.height / 2 - my)), g: Math.round(q.width) }; }); });
  sage(/fallen/.test(r1.bereiche) && fa.length === 2 && fa.every((x) => x.ab < r1.innenAb && x.g >= 20), "Mine und Falltür als eigene Symbole im inneren Kreis, die Bombe in ihrem Bereich", JSON.stringify({ b: r1.bereiche, fa, innen: r1.innenAb }));
  sage(r1.mana && r1.torte, "Mana-Bogen zwischen den Ringen, Torte/Manatrank bleiben griffbereit", JSON.stringify(r1));
  sage(r1.tippbar && r1.ueber === 0, "jedes Feld ist frei tippbar, nichts liegt übereinander", JSON.stringify({ tippbar: r1.tippbar, ueber: r1.ueber, paare: r1.paare }));

  console.log("\nBEREICH ANTIPPEN: ANLEGEN UND DIE QUERLEISTE\n");
  await pg.waitForTimeout(700);
  const feld = await pg.evaluate(() => { const b = document.querySelector('.sp-ring-feld[data-b="lustig"]'); return b ? b.dataset.w : ""; });
  await tippe('.sp-ring-feld[data-b="lustig"]'); await tick(350);
  const q1 = await pg.evaluate(() => {
    const S = window.DMA_SPIEL.pruef.zustand(), l = document.querySelector(".sp-ring-leiste"), f = document.querySelector('.sp-ring-feld[data-b="lustig"]');
    if (!l || !f) return { waffe: S.waffe, leiste: false };
    const lr = l.getBoundingClientRect(), fr = f.getBoundingClientRect();
    const k = [...l.querySelectorAll(".sp-ring-wahl")], xs = k.map((b) => b.getBoundingClientRect().left);
    return { waffe: S.waffe, leiste: true, waagerecht: lr.width > lr.height * 2, hoehe: Math.abs((lr.top + lr.height / 2) - (fr.top + fr.height / 2)) < 4,
      reihe: xs.every((x, i) => !i || x > xs[i - 1]), imBild: lr.left >= 0 && lr.right <= innerWidth, zahl: k.length, fehlt: l.querySelectorAll(".sp-ring-fehlt").length,
      name: (l.querySelector(".sp-ring-leiste-name") || {}).textContent, ringNoch: Boolean(document.querySelector(".sp-ring")) };
  });
  if (B) await pg.screenshot({ path: B + "-leiste.png" });
  sage(q1.waffe === feld && q1.ringNoch, "Tipp auf „Lustig“: dessen Waffe ist angelegt, der Ring bleibt offen", JSON.stringify(q1));
  sage(q1.leiste && q1.waagerecht && q1.hoehe && q1.reihe && q1.imBild, "eine waagerechte Leiste schneidet den Ring genau auf der Höhe des Feldes, von links nach rechts, ganz im Bild", JSON.stringify(q1));
  sage(q1.zahl >= 6 && q1.fehlt >= 1 && /^Lustig/.test(q1.name), "in der Leiste alle Waffen des Bereichs, die noch fehlenden blass mit Preis", JSON.stringify(q1));
  await pg.waitForTimeout(700);
  await tippe('.sp-ring-leiste .sp-ring-wahl[data-w="bierkrug"]'); await tick(350);
  const q2 = await pg.evaluate(() => ({ waffe: window.DMA_SPIEL.pruef.zustand().waffe, ring: Boolean(document.querySelector(".sp-ring")), gemerkt: localStorage.getItem("dma_spiel_ringwahl") || "" }));
  sage(q2.waffe === "bierkrug" && !q2.ring && /"lustig":"bierkrug"/.test(q2.gemerkt), "Bierkrug in der Leiste: angelegt, für „Lustig“ festgelegt (gemerkt), Ring zu", JSON.stringify(q2));
  await pg.evaluate(() => { window.DMA_SPIEL.langAufEigen(null); }); await tick(400);
  const q3 = await pg.evaluate(() => (document.querySelector('.sp-ring-feld[data-b="lustig"]') || {}).dataset || {});
  sage(q3.w === "bierkrug", "beim nächsten Öffnen steht im Bereich „Lustig“ der Bierkrug", JSON.stringify(q3));
  await pg.waitForTimeout(700);
  await tippe('.sp-ring-feld[data-b="lustig"]'); await tick(300);
  await tippe('.sp-ring-leiste .sp-ring-wahl.sp-ring-fehlt'); await tick(300);
  const q4 = await pg.evaluate(() => ({ h: window.__hinweise.slice(-1)[0] || "", ring: Boolean(document.querySelector(".sp-ring")), waffe: window.DMA_SPIEL.pruef.zustand().waffe }));
  sage(/Laden für \d+ Punkte/.test(q4.h) && q4.ring && q4.waffe === "bierkrug", "eine fehlende Waffe antippen: Hinweis auf den Laden mit Preis, nichts ändert sich", JSON.stringify(q4));

  console.log("\nMINEN & BOMBEN\n");
  await tippe(".sp-ring-leiste .sp-ring-leiste-name"); await tick(300);
  const zu1 = await pg.evaluate(() => ({ leiste: Boolean(document.querySelector(".sp-ring-leiste")), ring: Boolean(document.querySelector(".sp-ring")) }));
  sage(!zu1.leiste && zu1.ring, "„Lustig ✕“ über der Leiste klappt nur die Leiste zu, der Ring bleibt", JSON.stringify(zu1));
  await tippe('.sp-ring-feld[data-b="fallen"]'); await tick(350);
  const m1 = await pg.evaluate(() => ({ waffe: window.DMA_SPIEL.pruef.zustand().waffe, ring: Boolean(document.querySelector(".sp-ring")) }));
  sage(m1.waffe === "kuckucksuhr" && !m1.ring, "Bereich „Bomben“: ein Tipp legt die Kuckucksuhr-Bombe an, Ring zu (FASSUNG 831)", JSON.stringify(m1));
  await pg.evaluate(() => { window.DMA_SPIEL.langAufEigen(null); }); await tick(400);
  await pg.waitForTimeout(700);
  await tippe('.sp-ring .sp-ring-falle[data-w="mine"]'); await tick(350);
  const m2 = await pg.evaluate(() => ({ legen: window.DMA_SPIEL.pruef.zustand().legen, klasse: document.body.classList.contains("sp-legen"), ring: Boolean(document.querySelector(".sp-ring")), h: window.__hinweise.slice(-1)[0] || "" }));
  sage(m2.legen === "mine" && m2.klasse && !m2.ring && /Platz/.test(m2.h), "Mine im Kreis antippen: Legen beginnt (auf einen Platz tippen), Ring zu", JSON.stringify(m2));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.legen = ""; document.body.classList.remove("sp-legen"); });

  console.log("\nZAUBER INNEN, ABLEGEN, LANGER DRUCK SCHLIESST\n");
  await pg.evaluate(() => { window.DMA_SPIEL.langAufEigen(null); }); await tick(400);
  await pg.waitForTimeout(700);
  await tippe('.sp-ring .sp-ring-zauber[data-z="nebel"]'); await tick(350);
  const z1 = await pg.evaluate(() => ({ z: window.DMA_SPIEL.pruef.zustand().zauber, ring: Boolean(document.querySelector(".sp-ring")) }));
  sage(z1.z === "nebel" && !z1.ring, "innen „Nebel“ antippen: Zauber bereit, Ring zu", JSON.stringify(z1));
  await pg.evaluate(() => { window.DMA_SPIEL.langAufEigen(null); }); await tick(400);
  const l1 = Boolean(await pg.evaluate(() => document.querySelector(".sp-ring")));
  await pg.evaluate(() => { window.__lt = (window.DMA_TONLOG || []).length; });
  await pg.waitForTimeout(1000);
  await pg.evaluate(() => { window.DMA_SPIEL.langAufEigen(null); }); await tick(400);
  const l2 = await pg.evaluate(() => ({ ring: Boolean(document.querySelector(".sp-ring")), toene: (window.DMA_TONLOG || []).slice(window.__lt).map((t) => t.name || t[0] || t).join(",") }));
  sage(l1 && !l2.ring, "ein zweiter langer Druck schließt den Ring wieder", JSON.stringify({ l1, l2 }));
  await pg.evaluate(() => { window.DMA_SPIEL.langAufEigen(null); }); await tick(400);
  await pg.waitForTimeout(700);
  await tippe(".sp-ring .sp-ring-mitte"); await tick(300);
  const a1 = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); return { w: S.waffe, z: S.zauber, ring: Boolean(document.querySelector(".sp-ring")) }; });
  sage(!a1.w && !a1.z && !a1.ring, "die Hand in der Mitte legt Waffe und Zauber ab", JSON.stringify(a1));

  console.log("\nAUCH DER TIPP AUF DIE WAFFE IN DER LEISTE ÖFFNET DEN KLEINEN RING\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.waffe = window.DMA_SPIEL.pruef.slots()[0]; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(300);
  await tippe('.sp-s-slot[data-n="0"]'); await tick(400);
  const s1 = await pg.evaluate(() => { const r = document.querySelector(".sp-rad"); return { ring: Boolean(r && r.classList.contains("sp-ring")), breite: r ? Math.round(r.getBoundingClientRect().width) : 0 }; });
  sage(s1.ring && s1.breite <= 220, "Tipp auf die angelegte Waffe in der Leiste: derselbe kleine Ring", JSON.stringify(s1));

  console.log("\n3× AUFS EIGENE BILD = TIERKRAFT (Funk 163)\n");
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.rad = null; S.zrad = false; S.langWahl = false;
    S.ich = Object.assign({}, S.ich, { mana: 60, tiere: Object.assign({}, S.ich.tiere, { regenbogendrache: { kraft: 16, stufe: 3 } }), flugtier: "regenbogendrache" });
    S.faehig = { art: "regenbogendrache", bereitBis: 0 }; S.faehigZiel = false; S.waffe = P.slots()[0]; S.eigenZeit = 0; P.schnellZeichnen(true); });
  await tick(300);
  const d3 = await pg.evaluate(async () => {
    const T = window.DMA_SPIEL, P = T.pruef, S = P.zustand(), vorher = S.waffe, w = (ms) => new Promise((r) => setTimeout(r, ms)), ich = { ich: true, id: "ich", name: "Alex" };
    const e1 = T.tippAufPlatz(null, ich); await w(120);
    const e2 = T.tippAufPlatz(null, ich); const nach2 = S.waffe; await w(120);
    const e3 = T.tippAufPlatz(null, ich); await w(500);
    return { vorher, nach2, nach3: S.waffe, ziel: Boolean(S.faehigZiel), e: [e1, e2, e3].join(","), h: window.__hinweise.slice(-1)[0] || "" };
  });
  sage(d3.nach2 !== d3.vorher && d3.nach3 === d3.vorher && d3.ziel && /Regenbogenfeuer bereit/.test(d3.h), "2× wechselt sofort die Waffe, der 3. Tipp nimmt das zurück und ruft die Tierkraft (Regenbogenfeuer bereit)", JSON.stringify(d3));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.faehigZiel = false; });
  const d2 = await pg.evaluate(async () => {
    const T = window.DMA_SPIEL, P = T.pruef, S = P.zustand(), w = (ms) => new Promise((r) => setTimeout(r, ms)), ich = { ich: true, id: "ich", name: "Alex" };
    await w(500); const vorher = S.waffe;
    T.tippAufPlatz(null, ich); await w(120); T.tippAufPlatz(null, ich); await w(600);
    return { vorher, nach: S.waffe, ziel: Boolean(S.faehigZiel) };
  });
  sage(d2.nach !== d2.vorher && !d2.ziel, "nur 2×: die Waffe bleibt gewechselt, keine Tierkraft", JSON.stringify(d2));

  console.log("\n4× = GESUNDHEIT, 5× = MANATRANK (Walkie 287: „Beides: Ring und Mehrfachtipp“)\n");
  const mehr = (n) => pg.evaluate(async (n) => {
    const T = window.DMA_SPIEL, S = T.pruef.zustand(), w = (ms) => new Promise((r) => setTimeout(r, ms)), ich = { ich: true, id: "ich", name: "Alex" };
    await w(500); window.__rufe.length = 0; S.faehigZiel = false; const vorher = S.waffe;
    for (let i = 0; i < n; i++) { T.tippAufPlatz(null, ich); await w(110); }
    await w(600);
    return { rufe: window.__rufe.map((r) => r.name + (r.args.p_trank ? ":" + r.args.p_trank : "") + (r.args.p_art ? ":" + r.args.p_art : "")).join(","), ziel: Boolean(S.faehigZiel), waffeGleich: S.waffe === vorher, trankAuf: Boolean(S.trankAuf) };
  }, n);
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich = Object.assign({}, S.ich, { lp: 60, lp_max: 100, pflaster: 3, trank_mana: 2 }); window.__ich.lp = 60; window.__ich.trank_mana = 2;
    window.__extra = window.__extra || {}; window.__extra.spiel_trinken = () => Object.assign({}, window.__ich, { ok: true, mana: 90, trank_mana: 1 }); });
  const m4 = await mehr(4);
  sage(/spiel_heilen/.test(m4.rufe) && !m4.ziel && m4.waffeGleich, "4× aufs eigene Bild: Gesundheit (heilt), keine Tierkraft, die Waffe bleibt", JSON.stringify(m4));
  const m5 = await mehr(5);
  sage(/spiel_trinken:mana/.test(m5.rufe) && !/spiel_heilen/.test(m5.rufe) && !m5.ziel && m5.waffeGleich, "5× aufs eigene Bild: der Manatrank wird getrunken – nichts anderes", JSON.stringify(m5));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich = Object.assign({}, S.ich, { trank_mana: 0 }); window.__ich.trank_mana = 0; });
  const m5b = await mehr(5);
  sage(!/spiel_trinken/.test(m5b.rufe) && m5b.trankAuf, "5× ohne Manatrank: die Auswahl der Tränke geht auf (dort „Manatrank kaufen“)", JSON.stringify(m5b));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.trankAuf = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await pg.evaluate(() => { window.DMA_SPIEL.langAufEigen(null); }); await tick(400);
  const ob = await pg.evaluate(() => { const t = document.querySelector(".sp-ring .sp-ring-mana-knoepfe"); if (!t) return { da: false };
    const r = t.getBoundingClientRect(), q = document.querySelector(".sp-ring").getBoundingClientRect();
    const tippbar = [...t.querySelectorAll("button")].every((b) => { const k = b.getBoundingClientRect(); const o = document.elementFromPoint(k.left + k.width / 2, k.top + k.height / 2); return o && (o === b || b.contains(o)); });
    return { da: true, knoepfe: [...t.querySelectorAll("button")].map((b) => b.dataset.s).join(","), imBild: r.top >= 0 && r.left >= 0 && r.right <= innerWidth, mittig: Math.abs((r.left + r.right) / 2 - (q.left + q.right) / 2) < 6, tippbar }; });
  if (B) await pg.screenshot({ path: B + "-ring2.png" });
  sage(ob.da && /^heilen/.test(ob.knoepfe) && /trankauf/.test(ob.knoepfe) && ob.imBild && ob.mittig && ob.tippbar, "im Ring oben: Gesundheit (Herz) und die Tränke, mittig, ganz im Bild, tippbar", JSON.stringify(ob));
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.zustand().langWahl = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); });

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.join(" | "));
  console.log("\nFassung 719 auf dem Telefon: " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
