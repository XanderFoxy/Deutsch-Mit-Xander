#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 671: ZAUBER UND SUPERKRAFT, DIE MAN SPÜRT
   ---------------------------------------------------------------------
   Funk 132, XANDER: „verbessere dabei auch den Effekt der Schüsse wenn
   man mit der Superkraft schießt … den Sound zu jeder Superkraft … die
   Animation von den Zauberkräften … zehnmal so geil … immersiv … wenn
   zwei Leute miteinander spielen … dass die Bilder nicht irgendwie eine
   Sekunde zurückhängen".
   Geprüft auf einem Android-Telefon (393 px, Fingertipps):
     · Zauberkreis und Kugel erscheinen SOFORT beim Tippen, die anderen
       bekommen „zauberstart" vor der Antwort des Servers
     · die Kugel fliegt, solange der Server rechnet; der Ton des Zaubers
       beginnt erst beim Einschlag
     · Einschlag: Lichtblitz, Druckwellen, Sterne, Bild leuchtet; wer
       getroffen ist, sieht den Bildschirmrand leuchten
     · jeder Zauber hat seine Zugabe (Felsbrocken, Herzen, lila Blitz,
       „Plopp!", Stempel, mehr Brezeln und Mücken)
     · beim anderen Gerät: Kugel fliegt, der Zauber wartet auf sie
     · abgelehnt: die Kugel verpufft, auch bei den anderen
     · Superkraft-Schuss: Knall und lila Mündung, Einschlag mit Krater
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
      if (name === "spiel_zaubern" && window.__zauberNein) data = { ok: false, grund: "zu wenig Mana" };
      /* Fassung 671: der Server braucht messbar Zeit – so sieht man, ob die Kugel so lange fliegt. */
      return new Promise((ok) => setTimeout(() => ok({ data: data, error: null }), name === "spiel_zaubern" ? (window.__verz || 0) : 0));
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
  /* Fassung 671: erst fliegt die Zauberkugel (höchstens 750 ms), dann wirkt der Zauber. */
  const FLUG = 800;
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

  const zaehler = () => pg.evaluate(() => {
    window.__z = {}; window.__zt = {};
    if (window.__mo) window.__mo.disconnect();
    const t0 = performance.now();
    window.__mo = new MutationObserver((l) => l.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType !== 1) return;
      String(n.className).split(" ").forEach((k) => { if (!k) return; window.__z[k] = (window.__z[k] || 0) + 1; if (!(k in window.__zt)) window.__zt[k] = Math.round(performance.now() - t0); }); })));
    window.__mo.observe(document.body, { childList: true });
    window.__t0 = t0;
  });
  const stand = () => pg.evaluate(() => ({ z: window.__z, zt: window.__zt, toene: window.DMA_TONLOG.map((t) => t.name + "@" + Math.round(t.wann - window.__t0)).join(","),
    texte: [...document.querySelectorAll(".sp-text-puff,.sp-stempel-gross")].map((e) => e.textContent).join("|") }));

  console.log("\nSOFORT BESCHWÖREN, DIE KUGEL FLIEGT SO LANGE WIE DER SERVER RECHNET\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.level = 12; S.ich.mana = 100; window.__ich.level = 12; window.__ich.mana = 100; window.__verz = 500; });
  await bereit("erdbeben"); await zaehler(); await aufBea(); await tick(120);
  const frueh = await pg.evaluate(() => ({ kreis: Boolean(document.querySelector(".sp-zauberkreis")), kugel: Boolean(document.querySelector(".sp-zauberkugel")),
    start: (window.__raus.find((p) => p && p.ereignis === "zauberstart") || {}), zauber: Boolean(window.__raus.find((p) => p && p.ereignis === "zauber")),
    riss: Boolean(document.querySelector(".sp-beben-riss")) }));
  sage(frueh.kreis && frueh.kugel && !frueh.riss, "120 ms nach dem Tipp: Zauberkreis unter mir, die Kugel fliegt, das Beben wartet noch", JSON.stringify(frueh));
  sage(frueh.start.sorte === "erdbeben" && frueh.start.zielChat === "bea" && frueh.start.flug >= 380 && !frueh.zauber, "die anderen bekommen „zauberstart“ sofort – vor der Antwort des Servers", JSON.stringify(frueh.start));
  await tick(1400);
  const beben = await stand();
  console.log("   " + JSON.stringify(beben.zt));
  sage(beben.z["sp-zauberblitz"] >= 1 && beben.z["sp-ring-welle"] >= 2 && beben.z["sp-stern-burst"] >= 6, "Einschlag: Lichtblitz, Druckwellen, Sterne", JSON.stringify(beben.z));
  sage(beben.zt["sp-zauberblitz"] >= 480 && beben.zt["sp-beben-riss"] >= beben.zt["sp-zauberblitz"], "der Einschlag kommt, wenn der Server fertig ist (500 ms) – nicht vorher", "Blitz bei " + beben.zt["sp-zauberblitz"] + " ms");
  const tonZeit = (n) => { const m = new RegExp("(^|,)" + n + "@(\\d+)").exec(beben.toene); return m ? Number(m[2]) : -1; };
  sage(tonZeit("feenzauber") >= 0 && Math.abs(tonZeit("feenzauber") - beben.zt["sp-zauberkreis"]) < 40 && Math.abs(tonZeit("erdbeben") - beben.zt["sp-zauberblitz"]) < 40,
    "Ton: das Beschwören klingt mit dem Zauberkreis, das Grollen erst mit dem Einschlag", beben.toene + " · Kreis " + beben.zt["sp-zauberkreis"] + " / Blitz " + beben.zt["sp-zauberblitz"]);
  sage((beben.z["sp-fels"] || 0) >= 5, "Erdbeben: Felsbrocken prasseln herunter", "Felsen: " + beben.z["sp-fels"]);
  await tick(3500);
  const aufgeraeumt = await pg.evaluate(() => ({ kugel: document.querySelectorAll(".sp-zauberkugel").length, kreis: document.querySelectorAll(".sp-zauberkreis").length, fels: document.querySelectorAll(".sp-fels").length }));
  sage(aufgeraeumt.kugel === 0 && aufgeraeumt.kreis === 0 && aufgeraeumt.fels === 0, "danach bleibt nichts liegen", JSON.stringify(aufgeraeumt));

  console.log("\nJEDER ZAUBER HAT SEINE ZUGABE\n");
  await pg.evaluate(() => { window.__verz = 0; });
  const probe = async (z, ms, tipp) => {
    await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.mana = 100; window.__ich.mana = 100; });
    await bereit(z); await zaehler();
    if (tipp) await tipp(); else await aufBea();
    await tick(ms); return stand();
  };
  const brezel = await probe("brezelflut", 1900);
  sage((brezel.z["sp-brezelregen"] || 0) >= 12 && brezel.z["sp-text-puff"] >= 1, "Brezelflut: 14 Brezeln und „Mahlzeit!“", JSON.stringify(brezel.z));
  await tick(1500);
  const muecken = await probe("muecken", 1200);
  sage((muecken.z["sp-muecke"] || 0) >= 18, "Mückenschwarm: 20 Mücken", "Mücken: " + muecken.z["sp-muecke"]);
  await tick(3000);
  const ichPos = await seite("ich");
  const kaffee = await probe("kaffeeklatsch", 1300, async () => { await pg.evaluate(() => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis'); k.scrollIntoView({ block: "center", behavior: "instant" }); }); await tick(80); const p = await seite("ich"); await pg.touchscreen.tap(p.x, p.y); });
  sage((kaffee.z["sp-herz-steigt"] || 0) >= 6 && kaffee.z["sp-kaffee"] >= 1 && kaffee.z["sp-zauber-schirm"] >= 1, "Kaffeeklatsch auf mich: Herzen steigen auf, der Rand leuchtet warm", JSON.stringify({ herz: kaffee.z["sp-herz-steigt"], schirm: kaffee.z["sp-zauber-schirm"] }));
  await tick(1500);

  console.log("\nAUF DEM ANDEREN GERÄT: BEA ZAUBERT AUF MICH\n");
  await zaehler(); await pg.evaluate(() => { window.DMA_TONLOG.length = 0; });
  await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "zauberstart", sorte: "hexenschuss", von: "bea", zielChat: "ich", flug: 600 }); });
  await tick(150);
  await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "zauber", sorte: "hexenschuss", von: "bea", zielChat: "ich", dauer: 20, schaden: 4 }); });
  await tick(100);
  const zwischen = await pg.evaluate(() => ({ ich: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"].sp-zauber-getroffen')), kugel: Boolean(document.querySelector(".sp-zauberkugel")), besen: Boolean(document.querySelector(".sp-besen")), blitz: Boolean(document.querySelector(".sp-zauberblitz")) }));
  sage(zwischen.kugel && !zwischen.besen && !zwischen.blitz && !zwischen.ich, "die Antwort ist schon da, aber der Zauber wartet, bis Beas Kugel bei mir ist", JSON.stringify(zwischen));
  await tick(450);
  const leuchtet = await pg.evaluate(() => Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"].sp-zauber-getroffen')));
  sage(leuchtet, "mein Bild leuchtet in der Zauberfarbe auf");
  await tick(1050);
  const hexe = await stand();
  sage(hexe.z["sp-zauber-schirm"] >= 1 && hexe.zt["sp-zauber-schirm"] >= 550, "bei mir: der Bildschirmrand leuchtet lila, genau beim Einschlag", "bei " + hexe.zt["sp-zauber-schirm"] + " ms");
  sage(hexe.z["sp-blitz-hexe"] >= 1 && hexe.z["sp-text-puff"] >= 1, "Hexenschuss: ein lila Blitz fährt in den Rücken, „Aua, mein Rücken!“", JSON.stringify({ blitz: hexe.z["sp-blitz-hexe"], puff: hexe.z["sp-text-puff"] }));
  await tick(1200);

  await zaehler();
  await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "zauber", sorte: "gartenzwerg", von: "ich", zielChat: "bea", dauer: 12 }); });
  await tick(300);
  const zwerg = await stand();
  sage(zwerg.z["sp-puff"] >= 1 && zwerg.z["sp-stern-burst"] >= 10 && zwerg.z["sp-text-puff"] >= 1, "Gartenzwerg: Puff, Zauberstaub, „Plopp!“ (auch ohne Kugel – ältere Geräte)", JSON.stringify(zwerg.z));
  await tick(1500);
  await zaehler();
  await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "zauber", sorte: "behoerdengang", von: "bea", zielChat: "ich", dauer: 60 }); });
  await tick(250);
  const amt = await stand();
  sage(/ANTRAG!/.test(amt.texte) && (amt.z["sp-formular-wirbel"] || 0) >= 3, "Behördengang: der Stempel „ANTRAG!“ knallt, Formulare wirbeln", JSON.stringify({ t: amt.texte, w: amt.z["sp-formular-wirbel"] }));
  await tick(2600);

  console.log("\nABGELEHNT: DIE KUGEL VERPUFFT\n");
  await pg.evaluate(() => { window.__zauberNein = true; window.__verz = 200; });
  await bereit("nebel"); await aufBea(); await tick(900);
  const nein = await pg.evaluate(() => ({ kugel: document.querySelectorAll(".sp-zauberkugel").length, ab: Boolean(window.__raus.find((p) => p && p.ereignis === "zauberab" && p.zielChat === "bea")),
    zauber: Boolean(window.__raus.find((p) => p && p.ereignis === "zauber")), meldung: window.__hinweise.slice(-1)[0] }));
  sage(nein.kugel === 0 && nein.ab && !nein.zauber, "der Server sagt nein: die Kugel verpufft, die anderen bekommen „zauberab“", JSON.stringify(nein));
  await pg.evaluate(() => { window.__zauberNein = false; window.__verz = 0; });
  await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "zauberstart", sorte: "orkan", von: "bea", zielChat: "cem", flug: 600 }); });
  await tick(200);
  await pg.evaluate(() => { window.DMA_SPIEL.empfangen({ ereignis: "zauberab", von: "bea", zielChat: "cem" }); });
  await tick(600);
  const fremdAb = await pg.evaluate(() => document.querySelectorAll(".sp-zauberkugel").length);
  sage(fremdAb === 0, "auch Beas abgelehnte Kugel verschwindet bei mir", "Kugeln: " + fremdAb);

  console.log("\nSUPERKRAFT-SCHUSS\n");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.daemon_bis = new Date(Date.now() + 60000).toISOString(); });
  await zaehler(); await pg.evaluate(() => { window.DMA_TONLOG.length = 0; });
  const flugzeit = await pg.evaluate(() => window.DMA_SPIEL.pruef.geschossZeigen("ich", "bea", "bogen", 0, 0));
  await tick(flugzeit + 500);
  const dm = await stand();
  sage(dm.z["sp-daemon-muendung"] >= 1 && /peitschenknall@\d/.test(dm.toene) && dm.z["sp-g-daemon"] >= 1, "Abschuss mit Superkraft: Knall, lila Mündung, lila Kugel", dm.toene);
  const kraterZeit = dm.zt["sp-daemon-krater"];
  sage(kraterZeit >= flugzeit - 20 && /minenknall@\d/.test(dm.toene), "Einschlag mit Superkraft: Krater-Blitz und dumpfer Schlag, genau beim Aufprall", "Flug " + flugzeit + " ms, Krater bei " + kraterZeit + " ms · " + dm.toene);
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.daemon_bis = null; });
  await zaehler(); await pg.evaluate(() => { window.DMA_TONLOG.length = 0; });
  await pg.evaluate(() => window.DMA_SPIEL.pruef.geschossZeigen("ich", "bea", "bogen", 0, 0));
  await tick(1200);
  const normal = await stand();
  sage(!normal.z["sp-daemon-muendung"] && !normal.z["sp-daemon-krater"] && !/peitschenknall|minenknall/.test(normal.toene), "ohne Superkraft bleibt der Schuss wie er war", JSON.stringify(normal.z));

  if (process.env.BILD) {
    await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.ich.mana = 100; window.__ich.mana = 100; window.__verz = 700; });
    await bereit("hexenschuss"); await aufBea(); await tick(330);
    await pg.screenshot({ path: process.env.BILD.replace(/\.png$/, "-flug.png") });
    await tick(700);
    await pg.screenshot({ path: process.env.BILD.replace(/\.png$/, "-einschlag.png") });
  }
  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 671: " + fehler + " rot." : "Fassung 671 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
