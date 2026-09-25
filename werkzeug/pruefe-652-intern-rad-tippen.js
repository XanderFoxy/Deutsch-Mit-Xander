#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 652: NUR FÜR MITSPIELER, TÖNE, CONTROLLER-KNOPF,
   WAFFENRAD NACH KLASSEN, DOPPELTIPP, KANONE
   ---------------------------------------------------------------------
   XANDER (25.09.): „bist du dir sicher, dass die anderen normalen Chat
   Teilnehmer die spielenden nicht sehen … wirklich so intern" · „ein
   Menü, wo man die Sounds … regeln kann" · „ein kleines viereckiges
   Symbol mit dem Game Controller" · „warum sind außen die Waffen …
   welcher Regelung folgt das" · „wenn man sich selbst doppelt antippt
   … die Waffe wechselt … dreimal tippen irgendwas anderes" · „die
   Kanone feuert nicht … nicht animiert".
   Android-Telefon (360 px), echte Fingertipps.
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
        const R = { nebel: [25, 0, 0, 15], erdbeben: [35, 10, 25, 6], orkan: [50, 15, 0, 10] }[args.p_zauber];
        ich.mana -= R[0];
        data = { ok: true, zauber: args.p_zauber, schaden: R[1], abgewehrt: 0, mauer_riss: R[2], dauer: R[3], kaputt: false, lohn: 1,
                 ziel: Object.assign({}, bea, { lp: bea.lp - R[1] }), ich_voll: Object.assign({}, ich) };
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

  const zaehl = () => pg.evaluate(() => { const q = (s) => [...document.querySelectorAll("#lcPlaetze .lc-platz:not([data-lc-id=uebungspuppe]) " + s)].length;
    return { lp: q(".sp-lp"), mauer: q(".sp-mauer"), tier: q(".sp-tier") + q(".sp-flugtier") }; });

  console.log("\nWER NICHT MITSPIELT, SIEHT UND HÖRT NICHTS\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.mitspielen = false; window.__ich.mitspielen = false; window.DMA_SPIEL.pruef.zeichnen(); window.DMA_SPIEL.pruef.schnellZeichnen(true); window.DMA_TONLOG.length = 0; });
  await tick(200);
  const aus = await zaehl();   /* (die eigene Übungspuppe zählt nicht – sie ist nur auf dem eigenen Gerät) */
  await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "schuss", von: "bea", zielChat: "cem", waffe: "bogen", dx: 0, dy: 0 });
    window.DMA_SPIEL.empfangen({ ereignis: "zauber", sorte: "erdbeben", von: "bea", zielChat: "cem", dauer: 6, schaden: 10 }); });
  await tick(120);
  const ausBild = await pg.evaluate(() => ({ geschoss: document.querySelectorAll(".sp-geschoss").length, riss: document.querySelectorAll(".sp-beben-riss").length, bebt: document.querySelectorAll(".sp-bebt").length, toene: window.DMA_TONLOG.map((t) => t.name).join(",") }));
  sage(aus.lp === 0 && aus.mauer === 0 && aus.tier === 0, "nicht mitspielen: keine Ringe, keine Mauer, keine Tiere an den Plätzen", JSON.stringify(aus));
  sage(ausBild.geschoss === 0 && ausBild.riss === 0 && ausBild.bebt === 0 && !ausBild.toene, "fremde Schüsse und Zauber: kein Bild, kein Ton", JSON.stringify(ausBild));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.mitspielen = true; window.__ich.mitspielen = true; window.DMA_SPIEL.pruef.zeichnen(); window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(200);
  const an = await zaehl();
  sage(an.lp >= 2 && an.mauer >= 1 && an.tier >= 1, "mitspielen: das Spiel ist wieder da", JSON.stringify(an));

  console.log("\nDER CONTROLLER-KNOPF\n");
  const knopf = await pg.evaluate(() => { const b = document.querySelector(".sp-s-reihe > button"); const r = b.getBoundingClientRect(); return { klasse: b.className, w: Math.round(r.width), h: Math.round(r.height), radius: parseFloat(getComputedStyle(b).borderRadius) }; });
  sage(/sp-s-ei/.test(knopf.klasse) && Math.abs(knopf.w - knopf.h) <= 3 && knopf.radius <= 10, "ganz links ein kleiner viereckiger Knopf mit Controller", JSON.stringify(knopf));
  const zentriert = await pg.evaluate(() => { const b = document.querySelector(".sp-s-ei"), v = b.querySelector("svg"); const r = b.getBoundingClientRect(), q = v.getBoundingClientRect();
    return { dx: Math.round((q.left + q.width / 2) - (r.left + r.width / 2)), dy: Math.round((q.top + q.height / 2) - (r.top + r.height / 2)) }; });
  sage(Math.abs(zentriert.dx) <= 1 && Math.abs(zentriert.dy) <= 1, "der Controller sitzt mittig im Knopf", JSON.stringify(zentriert));

  console.log("\nTÖNE REGELN\n");
  await tippe(".sp-schnell .sp-s-burger");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellReiter = "mehr"; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(200);
  const stufen = await pg.evaluate(() => [...document.querySelectorAll('.sp-schnellmenue [data-s="laut"]')].map((b) => b.textContent).join(","));
  sage(stufen === "aus,leise,mittel,laut", "„Mehr“ hat Töne: aus, leise, mittel, laut", stufen);
  await tippe('.sp-schnellmenue [data-s="laut"][data-n="1"]');
  const leise = await pg.evaluate(() => ({ gemerkt: localStorage.getItem("dma_spiel_laut"), master: (window.DMA_SPIEL.pruef.klang().master || {}).gain ? +window.DMA_SPIEL.pruef.klang().master.gain.value.toFixed(3) : null }));
  sage(leise.gemerkt === "1" && (leise.master === null || Math.abs(leise.master - 0.279) < 0.01), "„leise“ wird gemerkt und dreht die Lautstärke herunter", JSON.stringify(leise));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = true; S.schnellReiter = "mehr"; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(150);
  await tippe('.sp-schnellmenue [data-s="laut"][data-n="0"]');
  await pg.evaluate(() => { window.DMA_TONLOG.length = 0; window.DMA_SPIEL.pruef.ton("bling", 0.5); });
  await tick(80);
  sage(await pg.evaluate(() => window.DMA_TONLOG.length === 0), "„aus“: kein Spielton mehr");
  await pg.evaluate(() => { localStorage.setItem("dma_spiel_laut", "2"); const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); });

  console.log("\nDAS WAFFENRAD NACH KLASSEN\n");
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.waffe = P.slots()[0]; S.rad = 0; P.schnellZeichnen(true); });
  await tick(300);
  const rad = await pg.evaluate(() => {
    const r = document.querySelector(".sp-rad-voll"), rr = r.getBoundingClientRect(), M = { x: rr.left + rr.width / 2, y: rr.top + rr.height / 2 };
    const namen = [...r.querySelectorAll(".sp-rad-sektoren text.sp-rad-klasse")].map((t) => t.textContent);
    const knoepfe = [...r.querySelectorAll(".sp-rad-waffe")].map((b) => { const q = b.getBoundingClientRect(); let w = Math.atan2(q.top + q.height / 2 - M.y, q.left + q.width / 2 - M.x) + Math.PI / 2; if (w < 0) w += 2 * Math.PI; return { w, k: getComputedStyle(b).getPropertyValue("--klasse").trim() }; }).sort((a, b) => a.w - b.w);
    /* Jede Klasse liegt am Stück: die Farbe wechselt nur so oft, wie es Klassen gibt. */
    let wechsel = 0; knoepfe.forEach((x, i) => { if (i && x.k !== knoepfe[i - 1].k) wechsel++; });
    const tippbar = [...r.querySelectorAll(".sp-rad-waffe")].every((b) => { const q = b.getBoundingClientRect(); const o = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return o && (o === b || b.contains(o)); });
    return { namen: namen.join(","), n: knoepfe.length, wechsel, klassen: namen.length, imBild: rr.left >= 0 && rr.right <= innerWidth && rr.top >= 0, tippbar, fest: getComputedStyle(r).position };
  });
  /* Die Probe-Person hat keine „starken" Waffen – dann fehlt der Sektor, die Reihenfolge bleibt. */
  sage(rad.namen === "Standard,Lustig,Arcade", "beschriftete Sektoren im Uhrzeigersinn in fester Reihenfolge (Standard, Lustig, Arcade, Stark – nur die eigenen)", rad.namen);
  sage(rad.wechsel === rad.klassen - 1, "jede Klasse liegt am Stück zusammen", rad.n + " Waffen, " + rad.wechsel + " Farbwechsel");
  sage(rad.imBild && rad.tippbar && rad.fest === "fixed", "das Rad schwebt frei, ganz im Bild, jede Waffe erreichbar", JSON.stringify(rad));
  await pg.touchscreen.tap(20, 20); await tick(250);

  console.log("\nDOPPELTIPP UND DREIFACHTIPP AUFS EIGENE BILD\n");
  /* Ein Tipp in den Rahmen richtet das Klassenzimmer aus (so gewollt,
     Runde 17/55) – erst danach steht das Bild still wie im echten Gebrauch. */
  await pg.evaluate(() => document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]').scrollIntoView({ block: "center" }));
  await tick(200);
  let ichPos = await seite("ich");
  await pg.touchscreen.tap(ichPos.x, ichPos.y); await tick(1200);
  ichPos = await seite("ich");
  /* Nach dem Ausrichten kann die obere Reihe halb über dem Rand stehen –
     getippt wird auf den sichtbaren Teil des Bildes. */
  ichPos = { x: ichPos.x, y: Math.max(ichPos.y, Math.min(ichPos.y + ichPos.w * 0.42, 14)) };
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.waffe = P.slots()[0]; S.rad = null; S.schnellMenue = false; P.schnellZeichnen(true); });
  const vorher = await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().waffe);
  await pg.touchscreen.tap(ichPos.x, ichPos.y); await tick(120); await pg.touchscreen.tap(ichPos.x, ichPos.y);
  /* Fassung 655: „der Doppelklick muss schnell die Waffe wechseln" – sofort beim zweiten Tipp, nicht erst nach 430 ms. */
  await tick(40);
  const nachher = await pg.evaluate(() => ({ waffe: window.DMA_SPIEL.pruef.zustand().waffe, slots: window.DMA_SPIEL.pruef.slots() }));
  sage(vorher === nachher.slots[0] && nachher.waffe === nachher.slots[1], "2× aufs eigene Bild: Waffe 1 → Waffe 2, sofort (40 ms)", vorher + " → " + nachher.waffe);
  await tick(600);
  await pg.touchscreen.tap(ichPos.x, ichPos.y); await tick(120); await pg.touchscreen.tap(ichPos.x, ichPos.y); await tick(700);
  sage(await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef; return P.zustand().waffe === P.slots()[0]; }), "noch einmal 2×: zurück zu Waffe 1");
  /* Fassung 655: lang drücken aufs eigene Bild = Zauberrad (statt Platzmenü). */
  await pg.mouse.move(ichPos.x, ichPos.y); await pg.mouse.down(); await tick(700); await pg.mouse.up(); await tick(300);
  /* Ab Fassung 686 kommt zuerst die Wahl „Zauber | Waffen“ (XANDER: „erst mal die zwei Optionen"). */
  const lang = await pg.evaluate(() => ({ zrad: Boolean(document.querySelector(".sp-zauberrad") || document.querySelector(".sp-langwahl [data-s=\"langzauber\"]")), platzmenue: Boolean(document.getElementById("lcPlatzMenue") && !document.getElementById("lcPlatzMenue").hidden && document.getElementById("lcPlatzMenue").offsetParent) }));
  sage(lang.zrad && !lang.platzmenue, "lang drücken aufs eigene Bild öffnet die Zauber/Waffen-Wahl, nicht das Platzmenü", JSON.stringify(lang));
  /* Zum Schließen mitten in den Chat tippen – (20, 20) läge am Rand des eigenen Platzes. */
  await pg.touchscreen.tap(180, 430); await tick(600);
  const einfach = await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef; return P.zustand().waffe; });
  await pg.touchscreen.tap(ichPos.x, ichPos.y); await tick(700);
  sage(await pg.evaluate((w) => window.DMA_SPIEL.pruef.zustand().waffe === w, einfach), "ein einzelner Tipp ändert nichts");

  console.log("\nDIE KANONE FEUERT SICHTBAR\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.stand[S.ich.id] = Object.assign({}, S.stand[S.ich.id], { geschuetz: true, geschuetz_stufe: 3 }); window.DMA_SPIEL.pruef.zeichnen(); });
  await tick(150);
  await pg.evaluate(() => window.DMA_SPIEL.pruef.kugelnFliegen("ich", "bea"));
  await tick(60);
  const kan = await pg.evaluate(() => ({ feuert: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-geschuetz.sp-feuert')), blitz: document.querySelectorAll(".sp-muendung").length, winkel: (document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-geschuetz') || { style: { getPropertyValue: () => "" } }).style.getPropertyValue("--zielwinkel") }));
  sage(kan.feuert && kan.blitz >= 1 && kan.winkel, "der Turm dreht sich zum Angreifer, ruckt zurück, an der Mündung blitzt es", JSON.stringify(kan));
  if (process.env.BILD) { await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.rad = 0; P.schnellZeichnen(true); }); await tick(300); await pg.screenshot({ path: process.env.BILD }); }

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 652 auf dem Telefon: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
