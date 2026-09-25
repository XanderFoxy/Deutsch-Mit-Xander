#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 654: DEUTSCHE ZAUBER, ZAUBERER-RÄNGE, FAIRNESS
   ---------------------------------------------------------------------
   XANDER: „ein Mückenschwarm losschicken … jemanden verwandelt in
   irgendwas anderes … Stopft den Gegner mit Brezeln voll" · „wie können
   wir … die einzelnen Stufen des Zauberers … entwickeln" · „ob es da so
   einen Fairnessfaktor gibt".
   Android-Telefon (393 px), echte Fingertipps.
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
  const ctx = await br.newContext({ viewport: { width: 393, height: 780 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75,
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
                  level: 7, ladung: 60, helm: 2, brust: 1, daemon: false };
    window.__rufe = [];
    window.__raus = [];
    window.__fallen = [];
    window.__falleAntwort = { ok: true, falle: false };
    window.LiveChat.pruefAbfangen((p) => { window.__raus.push(p); });
    const klient = { rpc: (name, args) => {
      window.__rufe.push({ name: name, args: args || {} });
      let data = { ok: true };
      if (name === "spiel_ich") data = ich;
      else if (name === "spiel_stand") data = [ich, bea];
      else if (name === "spiel_meine_fallen") data = window.__fallen;
      else if (name === "spiel_falle_legen") { window.__fallen = [{ platz: args.p_platz, art: args.p_art }]; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_falle_pruefen") data = window.__falleAntwort;
      else if (name === "spiel_heilen") data = Object.assign({}, ich, { ok: true, geheilt: 25, fremd: Boolean(args.p_ziel), geheilter: Object.assign({}, bea, { lp: 75 }) });
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
      else if (name === "spiel_antwort") data = Object.assign({}, ich, { ok: true, richtig: true, loesung: "gehe", gewonnen: 3, bonus: 0, mana_plus: 6, xp_plus: 6, level_vorher: 3, level: 4 });
      else if (name === "spiel_zaubern") {
        const R = { nebel: [25, 0, 0, 15], erdbeben: [35, 10, 25, 6], orkan: [50, 15, 0, 10], brezelflut: [20, 6, 0, 10], muecken: [30, 10, 0, 8],
                    kaffeeklatsch: [30, 0, 0, 0], hexenschuss: [40, 4, 0, 20], gartenzwerg: [60, 0, 0, 12], behoerdengang: [70, 0, 0, 60] }[args.p_zauber];
        ich.mana = Math.max(0, ich.mana - R[0]);
        const fair = window.__fair || 1;
        data = { ok: true, zauber: args.p_zauber, schaden: Math.round(R[1] * fair), abgewehrt: 0, mauer_riss: R[2], dauer: R[3], kaputt: false, lohn: fair < 1 ? 0 : 1,
                 heil: args.p_zauber === "kaffeeklatsch" ? 20 : 0, heil_ich: args.p_zauber === "kaffeeklatsch" && args.p_ziel !== ich.id ? 20 : 0, fair, rang_neu: Boolean(window.__rangNeu),
                 ziel: Object.assign({}, bea, { lp: bea.lp - R[1] }), ich_voll: Object.assign({}, ich, window.__rangNeu ? { zauber_zahl: 10 } : {}) };
      }
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
  const tippe = async (sel) => { const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };

  const seite = (chat) => pg.evaluate((c) => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + c + '"] .lc-kreis'); if (!k) return null; const r = k.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; }, chat);
  const hinweisSeit = () => pg.evaluate(() => window.__hinweise.length);
  const hinweiseAb = (n) => pg.evaluate((n) => window.__hinweise.slice(n).join(" | "), n);

  /* Erst Bea sicher ins Bild holen (ohne Gleiten), dann tippen – sonst trifft
     der Finger eine Stelle, an der das Bild gerade noch nicht ist. */
  const aufBea = async () => {
    await pg.evaluate(() => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis'); if (k) k.scrollIntoView({ block: "center", behavior: "instant" }); });
    await tick(80);
    const b = await seite("bea"); await pg.touchscreen.tap(b.x, b.y);
  };
  const bereit = (z) => pg.evaluate((z) => { const S = window.DMA_SPIEL.pruef.zustand(); S.zauber = z; window.DMA_TONLOG.length = 0; window.__rufe.length = 0; window.__raus.length = 0; window.DMA_SPIEL.pruef.schnellZeichnen(true); }, z);

  console.log("\nDAS ZAUBERRAD MIT NEUN ZAUBERN UND DEM RANG\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.level = 12; S.ich.mana = 100; S.ich.zauber_zahl = 12; window.__ich.level = 12; window.__ich.mana = 100; window.__ich.zauber_zahl = 12; S.zrad = true; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(300);
  const rad = await pg.evaluate(() => {
    const r = document.querySelector(".sp-zauberrad"); if (!r) return { da: false };
    const rr = r.getBoundingClientRect(), k = [...r.querySelectorAll(".sp-rad-zauber")];
    const tippbar = k.every((b) => { const q = b.getBoundingClientRect(); const o = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return o && (o === b || b.contains(o)); });
    return { da: true, n: k.length, fest: getComputedStyle(r).position, imBild: rr.left >= 0 && rr.right <= innerWidth && rr.top >= 0, tippbar, rang: (r.querySelector("text") || {}).textContent, reihe: k.map((b) => b.dataset.z).join(",") };
  });
  sage(rad.da && rad.n === 9 && rad.fest === "fixed" && rad.imBild && rad.tippbar, "volles Zauberrad: neun Zauber, frei schwebend, ganz im Bild, alle erreichbar", JSON.stringify(rad));
  sage(rad.reihe === "brezelflut,nebel,kaffeeklatsch,muecken,erdbeben,hexenschuss,orkan,gartenzwerg,behoerdengang", "im Uhrzeigersinn nach Level geordnet", rad.reihe);
  sage(rad.rang === "Zaubergeselle", "in der Mitte steht der Zauberer-Rang (12 Zauber = Zaubergeselle)", rad.rang);
  await pg.touchscreen.tap(20, 20); await tick(200);

  console.log("\nBREZELFLUT\n");
  await bereit("brezelflut"); await aufBea(); await tick(500);
  const brezel = await pg.evaluate(() => ({ ruf: (window.__rufe.find((r) => r.name === "spiel_zaubern") || {}).args, regen: document.querySelectorAll(".sp-brezelregen").length,
    bauch: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-brezelbauch')), toene: window.DMA_TONLOG.map((t) => t.name).join(","), raus: (window.__raus.find((x) => x && x.ereignis === "zauber") || {}).sorte }));
  sage(brezel.ruf && brezel.ruf.p_zauber === "brezelflut" && brezel.raus === "brezelflut", "Tipp auf Bea: spiel_zaubern(brezelflut), alle bekommen es", JSON.stringify(brezel.ruf));
  sage(brezel.regen >= 6 && brezel.bauch && /brezelknack/.test(brezel.toene), "Brezeln regnen auf Bea, danach hat sie einen Brezelbauch; man hört es", JSON.stringify({ regen: brezel.regen, bauch: brezel.bauch, toene: brezel.toene }));

  console.log("\nMÜCKENSCHWARM\n");
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef; P.zustand().ich.mana = 100; });
  await bereit("muecken"); await aufBea(); await tick(400);
  const muecken = await pg.evaluate(() => ({ n: document.querySelectorAll(".sp-muecke").length, toene: window.DMA_TONLOG.map((t) => t.name).join(",") }));
  await tick(2000);
  const mueckenSpaeter = await pg.evaluate(() => ({ summen: window.DMA_TONLOG.filter((t) => t.name === "muecken").length, zahl: [...document.querySelectorAll('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-zahl')].map((z) => z.textContent).join("|") }));
  sage(muecken.n >= 10 && mueckenSpaeter.summen >= 2, "ein Schwarm kreist um Bea und summt, solange er da ist", JSON.stringify({ muecken: muecken.n, summen: mueckenSpaeter.summen }));

  console.log("\nKAFFEEKLATSCH – AUCH AUF SICH SELBST\n");
  await pg.evaluate(() => document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]').scrollIntoView({ block: "center" }));
  await tick(200);
  let ichPos = await seite("ich");
  await pg.touchscreen.tap(ichPos.x, ichPos.y); await tick(1200);
  ichPos = await seite("ich"); ichPos = { x: ichPos.x, y: Math.max(ichPos.y, Math.min(ichPos.y + ichPos.w * 0.42, 14)) };
  await bereit("kaffeeklatsch"); await pg.touchscreen.tap(ichPos.x, ichPos.y); await tick(900);
  const kaffee = await pg.evaluate(() => ({ ruf: (window.__rufe.find((r) => r.name === "spiel_zaubern") || {}).args, tasse: document.querySelectorAll(".sp-kaffee").length,
    zahl: [...document.querySelectorAll('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-zahl')].map((z) => z.textContent).join("|") }));
  sage(kaffee.ruf && kaffee.ruf.p_zauber === "kaffeeklatsch" && kaffee.ruf.p_ziel === "00000000-0000-4000-8000-000000000000", "Kaffeeklatsch darf auf das eigene Bild", JSON.stringify(kaffee.ruf));
  sage(kaffee.tasse >= 1 && /\+20 Kaffee/.test(kaffee.zahl), "eine Kaffeetasse erscheint, grüne +20", JSON.stringify(kaffee));

  console.log("\nHEXENSCHUSS, GARTENZWERG, BEHÖRDENGANG – WER VERZAUBERT WIRD\n");
  let h0 = await hinweisSeit();
  await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "zauber", sorte: "hexenschuss", von: "bea", zielChat: "ich", dauer: 20, schaden: 4 }); });
  await tick(300);
  const hexe = await pg.evaluate(() => ({ gesperrt: window.DMA_SPIEL.gesperrt(), grund: window.DMA_SPIEL.gesperrtGrund(), schief: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"].sp-w-hexe')) }));
  sage(hexe.gesperrt && /Hexenschuss/.test(hexe.grund) && hexe.schief, "Hexenschuss: kein Platzwechsel, das Bild sitzt schief", JSON.stringify(hexe));
  await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "zauber", sorte: "gartenzwerg", von: "ich", zielChat: "bea", dauer: 12 }); });
  await tick(700);
  const zwerg = await pg.evaluate(() => {
    const el = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]'), z = el && el.querySelector(".sp-zwerg"); if (!z) return { da: false };
    const k = el.querySelector(".lc-kreis").getBoundingClientRect();
    const st = document.createElement("style"); st.textContent = ".sp-zwerg, .sp-zwerg * { pointer-events: auto !important; }"; document.head.appendChild(st);
    const mitte = document.elementFromPoint(k.left + k.width / 2, k.top + k.height / 2); st.remove();
    /* Getroffen zählt nur, was gemalt ist (Mütze, Bart) – nicht die leere Hülle. */
    return { da: true, mitteFrei: !(mitte && z.contains(mitte) && /^(path|circle|ellipse)$/i.test(mitte.tagName)), getroffen: mitte ? mitte.tagName : "" };
  });
  sage(zwerg.da && zwerg.mitteFrei, "Bea wird Gartenzwerg: Mütze und Bart, die Gesichtsmitte bleibt frei", JSON.stringify(zwerg));
  h0 = await hinweisSeit();
  await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "zauber", sorte: "behoerdengang", von: "bea", zielChat: "ich", dauer: 60 }); });
  await tick(300);
  const form = await pg.evaluate(() => Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-formular')));
  sage(form && /Formular/.test(await hinweiseAb(h0)), "Behördengang: ein Formular klebt am Bild, man erfährt, dass eine Deutschaufgabe hilft", await hinweiseAb(h0));
  /* Eine richtige Antwort erledigt das Formular. */
  await pg.evaluate(() => window.DMA_SPIEL.aufgabe());
  await tick(600);
  await pg.evaluate(async () => {
    const p = document.getElementById("spPanel"); let t0 = performance.now();
    while (performance.now() - t0 < 3000 && !p.querySelector('[data-tu="antwort"]')) await new Promise((r) => setTimeout(r, 50));
    const b = p.querySelector('[data-tu="antwort"]'); window.__geklickt = Boolean(b); if (b) b.click();
  });
  await tick(900);
  const erledigt = await pg.evaluate(() => { window.DMA_SPIEL.pruef.zeichnen(); return !document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-formular'); });
  sage(erledigt, "eine richtig gelöste Aufgabe nimmt das Formular weg", await pg.evaluate(() => "geklickt: " + window.__geklickt + " · " + window.__rufe.map((r) => r.name).join(",")));

  console.log("\nFAIRNESS UND AUFSTIEG\n");
  h0 = await hinweisSeit();
  /* Das Deutsch-Fenster vom Formular ist noch offen – erst zumachen, sonst
     tippt der Finger auf das Fenster statt auf Bea. */
  await pg.evaluate(() => { const p = document.getElementById("spPanel"); if (p) p.hidden = true; window.__fair = 0.5; const S = window.DMA_SPIEL.pruef.zustand(); S.ich.mana = 100; });
  await bereit("nebel"); await aufBea(); await tick(600);
  sage(/Fair bleiben.*halber Schaden, keine Punkte/.test(await hinweiseAb(h0)), "gegen viel Kleinere: Hinweis auf halben Schaden ohne Punkte", await hinweiseAb(h0));
  h0 = await hinweisSeit();
  await pg.evaluate(() => { window.__fair = 1; window.__rangNeu = true; const S = window.DMA_SPIEL.pruef.zustand(); S.ich.mana = 100; });
  await bereit("nebel"); await aufBea(); await tick(900);
  sage(/Aufgestiegen: Zaubergeselle/.test(await hinweiseAb(h0)), "neuer Zauberer-Rang wird gefeiert", await hinweiseAb(h0));
  if (process.env.BILD) { await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.zrad = true; window.DMA_SPIEL.pruef.schnellZeichnen(true); }); await tick(300); await pg.screenshot({ path: process.env.BILD }); }

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 654 auf dem Telefon: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
