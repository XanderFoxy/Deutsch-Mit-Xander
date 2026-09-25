#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 661: TROPHÄEN UND FUNDSTÜCKE AUF DEM FELD
   ---------------------------------------------------------------------
   XANDER: „wenn man … den Gegner nur mit Hühnern vernichtet oder
   irgendwie so Aufgaben, wo man noch Trophäen bekommt" · „auf dem Feld
   … das darf man aber nur für sich sehen … zwischendurch ne Artikel
   Aufgabe, wo man auf dem Feld zwischendurch noch Sachen einsammeln
   kann". Android-Telefon (360 px), echte Fingertipps.
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
      if (name === "spiel_ich") data = ich;
      else if (name === "spiel_stand") data = [ich, bea];
      else if (name === "spiel_meine_fallen") data = window.__fallen;
      else if (name === "spiel_falle_legen") { window.__fallen = [{ platz: args.p_platz, art: args.p_art }]; data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_falle_pruefen") data = window.__falleAntwort;
      else if (name === "spiel_heilen") data = Object.assign({}, ich, { ok: true, geheilt: 25, fremd: Boolean(args.p_ziel), geheilter: Object.assign({}, bea, { lp: 75 }) });
      else if (name === "spiel_trophaeen") data = window.__troph || { ok: true, liste: [], neu: [], lohn: 0 };
      else if (name === "spiel_fund_heben") data = window.__fundAntwort || { ok: true, fund: "erz" };
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


  console.log("\nTROPHÄEN IM MENÜ\n");
  await pg.evaluate(() => {
    const L = [["huehnerbaron", "Hühnerbaron", "Triff 25-mal mit dem Hühnerwerfer", 25, 60], ["kopfjaeger", "Scharfschütze", "20 Kopftreffer", 20, 50], ["musterschueler", "Musterschüler", "Löse 50 Deutsch-Aufgaben richtig", 50, 60]];
    window.__troph = { ok: true, lohn: 0, neu: [], liste: L.map((x, i) => ({ id: x[0], name: x[1], text: x[2], ziel: x[3], stand: i === 2 ? 50 : 7, lohn: x[4], hat: i === 2 })) };
  });
  await tippe(".sp-schnell .sp-s-burger");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellReiter = "mehr"; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(150);
  await pg.evaluate(() => document.querySelector('.sp-schnellmenue [data-s="trophaeen"]').scrollIntoView({ block: "center" }));
  await tick(150);
  await tippe('.sp-schnellmenue [data-s="trophaeen"]');
  await tick(300);
  const tl = await pg.evaluate(() => ({ n: document.querySelectorAll(".sp-schnellmenue .sp-troph").length, hat: document.querySelectorAll(".sp-schnellmenue .sp-troph-hat").length,
    kopf: (document.querySelector(".sp-schnellmenue .sp-sm-klein") || {}).textContent || "", balken: (document.querySelector(".sp-schnellmenue .sp-troph em u") || {}).style ? document.querySelector(".sp-schnellmenue .sp-troph em u").style.width : "",
    imBild: [...document.querySelectorAll(".sp-schnellmenue .sp-troph")].every((e) => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }) }));
  sage(tl.n === 3 && tl.hat === 1 && /1 von 3/.test(tl.kopf), "Mehr → Trophäen: Liste mit Stand, eine schon gewonnen", JSON.stringify(tl));
  sage(tl.balken === "28%" && tl.imBild, "Fortschrittsbalken (7 von 25 = 28 %), alles im Bild");
  await pg.locator(".sp-schnellmenue").screenshot({ path: "/tmp/claude-0/p-661-trophaeen.png" }).catch(() => {});

  console.log("\nEINE NEUE TROPHÄE WIRD GEFEIERT\n");
  await pg.evaluate(() => { window.__troph = Object.assign({}, window.__troph, { neu: [{ id: "huehnerbaron", name: "Hühnerbaron", lohn: 60 }], lohn: 60 }); window.__hinweise.length = 0; window.DMA_TONLOG.length = 0;
    /* Der Server meldet eine neue Trophäe genau einmal — danach steht sie nur noch in der Liste. */
    window.DMA_SPIEL.pruef.trophaeenHolen().then(() => { window.__troph = Object.assign({}, window.__troph, { neu: [], lohn: 0 }); }); });
  await tick(900);
  const fe = await pg.evaluate(() => ({ pokal: document.querySelectorAll(".sp-pokal-feier").length, name: (document.querySelector(".sp-pokal-feier b") || {}).textContent, meldung: window.__hinweise.join(" | "), ton: window.DMA_TONLOG.map((t) => t.name).join(",") }));
  sage(fe.pokal === 1 && fe.name === "Hühnerbaron" && /Trophäe: Hühnerbaron – \+60 Punkte/.test(fe.meldung), "goldener Pokal steigt über dem Bild auf, Meldung mit Punkten", JSON.stringify(fe));
  /* Der Pokal erscheint 0,6 s nach der Antwort und steht 2,6 s. */
  await tick(2600);
  const rest = await pg.evaluate(() => ({ n: document.querySelectorAll(".sp-pokal-feier").length, rufe: window.__rufe.filter((r) => r.name === "spiel_trophaeen").length, m: window.__hinweise.filter((h) => /Trophäe/.test(h)).length }));
  sage(rest.n === 0, "danach ist der Pokal wieder weg", JSON.stringify(rest));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); });

  console.log("\nEIN FUNDSTÜCK AUF DEM FELD\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.fundNaechst = 0; window.DMA_SPIEL.pruef.fundPflegen(); });
  await tick(200);
  const fu = await pg.evaluate(() => { const f = document.querySelector("#lcPlaetze .sp-fundsack"); if (!f) return null; const p = f.closest(".lc-platz");
    const k = p.querySelector(".lc-kreis").getBoundingClientRect(), r = f.getBoundingClientRect();
    return { frei: !p.dataset.lcId, platz: p.dataset.lcPlatz, sichtbar: r.width > 20, dx: Math.round((r.left + r.width / 2) - (k.left + k.width / 2)), dy: Math.round((r.top + r.height / 2) - (k.top + k.height / 2)) }; });
  sage(fu && fu.frei && fu.sichtbar, "ein glitzerndes Säckchen liegt auf einem freien Platz", JSON.stringify(fu));
  sage(fu && Math.abs(fu.dx) <= 3 && Math.abs(fu.dy) <= 3, "und zwar genau in dessen Mitte", fu ? fu.dx + " / " + fu.dy + " px" : "");
  await pg.evaluate(() => { const f = document.querySelector("#lcPlaetze .sp-fundsack"); f.closest(".lc-platz").scrollIntoView({ block: "center" }); });
  await tick(200);
  await pg.locator("#lcPlaetze").screenshot({ path: "/tmp/claude-0/p-661-fund.png" }).catch(() => {});
  await pg.evaluate(() => { window.__rufe.length = 0; });
  await tippe("#lcPlaetze .sp-fundsack");
  await tick(200);
  if (await pg.evaluate(() => !window.__rufe.some((r) => r.name === "spiel_fund_heben"))) { await tippe("#lcPlaetze .sp-fundsack"); await tick(200); }
  await tick(300);
  const auf = await pg.evaluate(() => ({ heben: window.__rufe.some((r) => r.name === "spiel_fund_heben"), aufgabe: (window.__rufe.filter((r) => r.name === "spiel_aufgabe").pop() || {}).args,
    weg: !document.querySelector("#lcPlaetze .sp-fundsack"), panel: !!(document.getElementById("spPanel") && !document.getElementById("spPanel").hidden),
    platzwechsel: window.__rufe.some((r) => r.name === "spiel_platzwechsel"), meldung: window.__hinweise.slice(-1)[0] || "" }));
  sage(auf.heben && auf.weg && !auf.platzwechsel, "Antippen hebt es auf (man setzt sich nicht auf den Platz)", JSON.stringify({ heben: auf.heben, weg: auf.weg, platzwechsel: auf.platzwechsel }));
  sage(auf.panel && auf.aufgabe && auf.aufgabe.p_kategorie === "artikel" && /Erz/.test(auf.meldung), "es kommt eine Artikel-Aufgabe, und man weiß, was drin ist", auf.meldung);
  await pg.evaluate(() => { window.__fundLohn = "erz"; window.__hinweise.length = 0; });
  await pg.evaluate(() => { const b = document.querySelector('#spPanel [data-tu="antwort"]'); if (b) b.click(); });
  await tick(900);
  const lo = await pg.evaluate(() => ({ m: window.__hinweise.join(" | "), kat: window.DMA_SPIEL.pruef.zustand().kategorie }));
  sage(/Fundstück eingelöst: 1 Erz/.test(lo.m), "richtig gelöst: der Fund gehört einem", lo.m);
  sage(lo.kat === null || lo.kat === undefined || lo.kat === "", "danach gilt wieder die eigene Aufgabenwahl (nicht mehr nur Artikel)", String(lo.kat));

  console.log("\nNUR FÜR MICH, NUR BEIM MITSPIELEN\n");
  await pg.evaluate(() => { const p = document.getElementById("spPanel"); if (p) p.hidden = true; const S = window.DMA_SPIEL.pruef.zustand(); S.fundNaechst = 0; window.DMA_SPIEL.pruef.fundPflegen(); });
  await tick(100);
  const da = await pg.evaluate(() => !!document.querySelector("#lcPlaetze .sp-fundsack"));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.mitspielen = false; window.__ich.mitspielen = false; window.DMA_SPIEL.pruef.fundPflegen(); });
  await tick(100);
  const weg = await pg.evaluate(() => !document.querySelector("#lcPlaetze .sp-fundsack"));
  sage(da && weg, "ohne Mitspielen verschwindet es sofort");
  const raus = await pg.evaluate(() => window.__raus.filter((p) => p && /fund/.test(JSON.stringify(p))).length);
  sage(raus === 0, "es geht nichts davon an die anderen im Raum", raus + " Pakete");

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 661: " + fehler + " rot." : "Fassung 661 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
