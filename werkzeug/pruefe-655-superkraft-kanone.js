#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 655: SUPERKRAFT SPÜRBAR, KANONENROHR ZIELT, ZAUBERN
   AN DER PUPPE, RAD ZEIGT „ANGELEGT"
   ---------------------------------------------------------------------
   XANDER: „wo meine Superkraft aufgeladen ist, hat sich nicht das Gefühl,
   dass irgendwas passiert" · „diese kleine Kanonenrohr richtet sich nicht
   aus … Es ist so, als wenn es mich selber anschießen will" · „mit der
   Gummipuppe probiere ich das. Ich sehe kein Erdbeben" · „was bedeutet
   das grüne Symbol … das muss man besser verstehen können".
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


  console.log("\nSUPERKRAFT\n");
  await pg.evaluate(() => { window.DMA_TONLOG.length = 0; window.DMA_SPIEL.pruef.daemonAusbruch("ich", true); });
  await tick(150);
  const sk = await pg.evaluate(() => ({ welle: document.querySelectorAll(".sp-daemon-welle").length, schirm: Boolean(document.querySelector(".sp-daemon-schirm")),
    toene: window.DMA_TONLOG.map((t) => t.name).join(","), hinweis: window.__hinweise.slice(-1)[0] || "" }));
  sage(sk.welle >= 1 && sk.schirm && /gong/.test(sk.toene) && /×1,5/.test(sk.hinweis), "Superkraft: lila Welle vom Bild, der Rand glüht lila, Gong, man erfährt, was sie tut", JSON.stringify(sk));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.stand[S.ich.id] = Object.assign({}, S.stand[S.ich.id], { daemon: true }); window.DMA_SPIEL.pruef.zeichnen(); });
  await tick(150);
  const flamme = await pg.evaluate(() => document.querySelectorAll('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-daemonflammen .sp-flamme').length);
  sage(flamme >= 10, "solange sie wirkt, lodern Flammen um das eigene Bild", flamme + " Flammen");
  await pg.evaluate(() => window.DMA_SPIEL.pruef.trefferZeigen("bea", { zone: "kopf", schaden: 18, daemon: true }));
  await tick(80);
  const dz = await pg.evaluate(() => { const z = [...document.querySelectorAll('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-zahl-daemon')][0]; return z ? z.textContent : ""; });
  sage(/−18.*×1,5/.test(dz), "dämonische Treffer: große lila Zahl mit ×1,5", dz);

  console.log("\nDIE KANONE: NUR DAS ROHR ZIELT\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.stand[S.ich.id] = Object.assign({}, S.stand[S.ich.id], { geschuetz: true, geschuetz_stufe: 3, daemon: false }); window.DMA_SPIEL.pruef.zeichnen(); });
  await tick(200);
  const vorSchuss = await pg.evaluate(() => { const t = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-geschuetz'); return { punkte: t.querySelectorAll('rect[fill="#f2c230"]').length, rohr: Boolean(t.querySelector(".sp-rohr")) }; });
  sage(vorSchuss.rohr && vorSchuss.punkte === 0, "Turm mit eigenem Rohr, keine rätselhaften gelben Punkte mehr (Stufe = Farbe)", JSON.stringify(vorSchuss));
  await pg.evaluate(() => window.DMA_SPIEL.pruef.kugelnFliegen("ich", "bea"));
  await tick(30);
  const kan = await pg.evaluate(() => {
    const t = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-geschuetz'), spitze = t.querySelector(".sp-rohr-spitze").getBoundingClientRect();
    const svgDreh = getComputedStyle(t.querySelector("svg")).transform, blitz = document.querySelector(".sp-muendung").getBoundingClientRect();
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis').getBoundingClientRect();
    const zielW = Math.atan2(k.top + k.height / 2 - spitze.top, k.left + k.width / 2 - spitze.left) * 180 / Math.PI;
    const rohrW = parseFloat(t.style.getPropertyValue("--zielwinkel"));
    return { svgDreh, rohrW: Math.round(rohrW), zielW: Math.round(zielW), abstand: Math.round(Math.hypot(blitz.left + blitz.width / 2 - spitze.left, blitz.top + blitz.height / 2 - spitze.top)) };
  });
  sage(kan.svgDreh === "none" && Math.abs(kan.rohrW - kan.zielW) <= 8, "nur das Rohr dreht sich – genau zum Angreifer, der Turm selbst bleibt stehen", JSON.stringify(kan));
  sage(kan.abstand <= 4, "das Mündungsfeuer blitzt an der Rohrspitze", kan.abstand + " px");

  console.log("\nZAUBERN AN DER PUPPE\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.level = 8; S.ich.mana = 60; S.zauber = "erdbeben"; window.__rufe.length = 0; window.DMA_TONLOG.length = 0; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await pg.evaluate(() => document.querySelector('#lcPlaetze .lc-platz[data-lc-id="uebungspuppe"]').scrollIntoView({ block: "center" }));
  await tick(250);
  let pu = await seite("uebungspuppe");
  pu = { x: pu.x, y: Math.max(pu.y, Math.min(pu.y + pu.w * 0.42, 14)) };
  await pg.touchscreen.tap(pu.x, pu.y); await tick(300);
  const ueb = await pg.evaluate(() => ({ bebt: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="uebungspuppe"].sp-bebt')), ruf: window.__rufe.some((r) => r.name === "spiel_zaubern"),
    mana: window.DMA_SPIEL.pruef.zustand().ich.mana, toene: window.DMA_TONLOG.map((t) => t.name).join(","), hinweis: window.__hinweise.slice(-1)[0] || "" }));
  sage(ueb.bebt && /erdbeben/.test(ueb.toene), "Erdbeben auf die Puppe: man sieht und hört es", JSON.stringify(ueb));
  sage(!ueb.ruf && ueb.mana === 60 && /Übung/.test(ueb.hinweis), "Übung: kein Server, kein Mana", ueb.hinweis);

  console.log("\nDAS RAD SAGT, WAS ANGELEGT IST\n");
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.waffe = P.slots()[0]; S.rad = 0; P.schnellZeichnen(true); });
  await tick(300);
  const rad = await pg.evaluate(() => { const r = document.querySelector(".sp-rad-voll"); const a = r.querySelector(".sp-angelegt");
    return { an: (r.querySelector(".sp-rad-an") || {}).textContent, name: (r.querySelector(".sp-rad-an-name") || {}).textContent, haken: Boolean(a && a.querySelector(".sp-haken")), wer: a ? a.dataset.w : "" }; });
  sage(rad.an === "angelegt" && rad.name && rad.haken, "in der Mitte „angelegt: …“, die angelegte Waffe hat Goldring und Haken", JSON.stringify(rad));
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD });

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 655 auf dem Telefon: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
