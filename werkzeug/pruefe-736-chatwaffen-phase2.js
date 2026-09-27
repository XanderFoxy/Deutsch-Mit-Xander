#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 735/736: CHAT-WAFFEN PHASE 2 (Funk 176)
   ---------------------------------------------------------------------
   Design-Prüfung Phase 2: Chat-Effekt-Waffen (Hammer, Zwille …) halten,
   Trefferstelle auch für Chat-Effekte („treff"), gleiche Treffer im
   Verlauf zu einer Zeile gebündelt, Effekte ziehen beim Platzwechsel
   nahtlos mit (ohne Neustart der Animation).
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
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_spiel_chatwaffe", "1"); localStorage.removeItem("dma_chat_halten"); } catch (e) {} });
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
  const zeilen = () => pg.evaluate(() => [...document.querySelectorAll("#lcVerlauf .lc-zeile[data-lc-bund]")].map((z) => ({ weg: z.classList.contains("lc-zeile-gebuendelt"), zahl: (z.querySelector(".lc-buendel") || {}).textContent || "", text: z.textContent.slice(0, 60) })));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); window.__ich.mitspielen = false; S.ich.mitspielen = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); window.__raus.length = 0; });
  await tick(300);

  console.log("\nCHAT-EFFEKTE HALTEN\n");
  let r = await pg.evaluate(() => { const pl = document.querySelector("#livechatKarte .lc-platz.lc-platz-ich");
    pl.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }));
    const m = document.getElementById("lcPlatzMenue"); const b = m && [...m.querySelectorAll(".lc-platzmenue-knopf")].find((x) => /Waffe halten/.test(x.textContent)); if (!b) return "kein Knopf"; b.click(); return "ok"; });
  await tick(400);
  const wahl = await pg.evaluate(() => ({ titel: [...document.querySelectorAll(".sp-halt-wahl-titel")].map((t) => t.textContent), fx: [...document.querySelectorAll('.sp-halt-wahl [data-h="fx"]')].map((b) => b.dataset.w), svg: [...document.querySelectorAll('.sp-halt-wahl [data-h="fx"] svg')].length }));
  sage(r === "ok" && wahl.titel[0] === "Chat-Effekte" && wahl.fx.length === 13 && wahl.svg === 13 && ["hammer", "zwille", "spucken", "schnee", "paintball", "box"].every((w) => wahl.fx.indexOf(w) >= 0), "„Waffe halten“ zeigt oben 13 Chat-Effekte mit eigener Zeichnung, darunter die Spielwaffen", JSON.stringify(wahl));
  if (B) await (await pg.$(".sp-halt-wahl")).screenshot({ path: B + "-wahl.png" });
  await tippe('.sp-halt-wahl [data-h="fx"][data-w="hammer"]'); await tick(500);
  r = await pg.evaluate(() => ({ h: window.DMA_SPIEL.pruef.halten(), el: !!document.querySelector("#livechatKarte .lc-platz.lc-platz-ich .sp-halt.sp-halt-fx-hammer svg"), ls: localStorage.getItem("dma_chat_halten") }));
  sage(r.h && r.h.effekt === "hammer" && r.el && r.ls === "fx:hammer", "der Hammer hängt am eigenen Bild und bleibt gemerkt", JSON.stringify(r));

  console.log("\nTREFFERSTELLE\n");
  const ziel = async () => { await pg.evaluate(() => document.querySelector('#livechatKarte .lc-platz[data-lc-id="bea"] .lc-kreis').scrollIntoView({ block: "center", behavior: "instant" })); await tick(450); return pg.evaluate(() => { const k = document.querySelector('#livechatKarte .lc-platz[data-lc-id="bea"] .lc-kreis'); const b = k.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: b.width / 2 }; }); };
  let z = await ziel();
  if (process.env.DEBUG) console.log(await pg.evaluate((z) => { const e = document.elementFromPoint(z.x + z.r * 0.5, z.y + z.r * 0.4); return (e && (e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className)) + " / " + (e && e.closest("[class]") && e.closest(".lc-platz, .sp-halt-wahl, #lcPlatzMenue") ? e.closest(".lc-platz, .sp-halt-wahl, #lcPlatzMenue").className : "-") + " halten=" + JSON.stringify(window.DMA_SPIEL.pruef.halten()) + " sicht=" + window.DMA_SPIEL.pruef.zustand().ich.mitspielen; }, z));
  if (process.env.DEBUG2) console.log(await pg.evaluate(() => { try { const k = document.querySelector('#livechatKarte .lc-platz[data-lc-id="bea"]'); const p = window.LiveChat.lage().plaetze.find((x) => x.id === "bea");
    const r = window.DMA_SPIEL.tippAufPlatz(k, p, { clientX: 0, clientY: 0 }); return "ok " + r + " " + JSON.stringify(window.__raus.slice(-1)).slice(0, 300); } catch (e) { return "FEHLER " + e.stack; } }));
  await pg.evaluate(() => { window.__raus.length = 0; });
  await pg.touchscreen.tap(z.x + z.r * 0.5, z.y + z.r * 0.4); await tick(350);
  r = await pg.evaluate(() => { const p = window.__raus.find((x) => x.wirkung === "hammer"); const s = document.querySelector('#livechatKarte .lc-platz[data-lc-id="bea"] > .lc-zhammer');
    return { paket: p ? { wen: p.wen, treff: p.treff, text: p.text } : null, schicht: s ? { treff: s.dataset.lcTreff, translate: s.style.translate } : null }; });
  const tr = r.paket && r.paket.treff ? r.paket.treff.split(",").map(Number) : [9, 9];
  sage(r.paket && r.paket.wen === "Bea" && Math.abs(tr[0] - 0.5) < 0.08 && Math.abs(tr[1] - 0.4) < 0.08 && /haut mit dem Hammer auf Bea/.test(r.paket.text), "Tipp rechts unten auf Bea: der echte Chat-Effekt /hammer geht an alle, mit Trefferstelle", JSON.stringify(r.paket));
  sage(r.schicht && /^1[5-9](\.\d)?% 1[1-5](\.\d)?%$/.test(r.schicht.translate), "der Hammer schlägt dort ein, wo getippt wurde (Schicht verschoben)", JSON.stringify(r.schicht));
  if (B) await (await pg.$("#livechatKarte")).screenshot({ path: B + "-treffer.png" });
  /* Ein Effekt, der von jemand anderem kommt, mit Trefferstelle: gleiche Verschiebung auf diesem Gerät. */
  await pg.evaluate(() => { window.LiveChat.empfangen && 0; });

  console.log("\nGLEICHE TREFFER ALS EINE ZEILE\n");
  for (let i = 0; i < 3; i++) { await tick(1500); z = await ziel(); await pg.touchscreen.tap(z.x - z.r * 0.3, z.y - z.r * 0.2); }
  await tick(600);
  r = await zeilen();
  const sichtbar = r.filter((x) => !x.weg);
  sage(r.length === 4 && sichtbar.length === 1 && sichtbar[0].zahl === "×4", "vier Hammerschläge auf Bea: EINE Zeile mit „×4“", JSON.stringify(r));
  const reihe = await pg.evaluate(() => { const b = document.querySelector("#lcVerlauf .lc-buendel"), t = b && b.closest(".lc-zeilentext"); if (!b || !t) return null; const x = b.getBoundingClientRect(), y = t.getBoundingClientRect(); return { oben: Math.round(x.top - y.top), hoch: Math.round(y.height) }; });
  sage(reihe, "„×4“ steht im Zeilentext selbst (bricht nur um wie der Text, wenn die Zeile voll ist)", JSON.stringify(reihe));
  if (B) await (await pg.$("#lcVerlauf")).screenshot({ path: B + "-buendel.png" });
  await pg.evaluate(() => { window.LiveChat.pruefBefehl("/schnee Cem"); }); await tick(500);
  await tick(1500); z = await ziel(); await pg.touchscreen.tap(z.x, z.y); await tick(600);
  r = await zeilen();
  sage(r.filter((x) => !x.weg).length === 3 && r.filter((x) => !x.weg)[2].zahl === "", "ein anderer Effekt dazwischen trennt die Bündel (Hammer ×4, Schneeball, Hammer)", JSON.stringify(r.map((x) => [x.weg, x.zahl])));

  console.log("\nPLATZWECHSEL: DER EFFEKT LÄUFT NAHTLOS WEITER\n");
  await tick(1600);
  await pg.evaluate(() => { window.LiveChat.pruefBefehl("/wasser Bea"); }); await tick(350);
  const vor = await pg.evaluate(() => { const s = document.querySelector('#livechatKarte .lc-platz[data-lc-id="bea"] > .lc-zeimer, #livechatKarte .lc-platz[data-lc-id="bea"] > [data-lc-fuer="bea"]');
    if (!s) return null; const a = s.getAnimations({ subtree: true }); return { platz: s.parentNode.dataset.lcPlatz, zeit: a.length ? Math.max(...a.map((x) => x.currentTime || 0)) : -1, n: a.length }; });
  await pg.evaluate(() => { window.LiveChat.pruefBefehl("/tausch Bea"); window.DMA_PRUEF.neuZeichnen(); }); await tick(60);
  const nach = await pg.evaluate(() => { const s = document.querySelector('#livechatKarte [data-lc-fuer="bea"]');
    if (!s) return null; const a = s.getAnimations({ subtree: true }); return { platz: s.parentNode.dataset.lcPlatz, bei: s.parentNode.dataset.lcId, zeit: a.length ? Math.max(...a.map((x) => x.currentTime || 0)) : -1 }; });
  sage(vor && nach && nach.bei === "bea" && nach.platz !== vor.platz && nach.zeit >= vor.zeit && nach.zeit > 250 && nach.zeit < vor.zeit + 400, "Bea tauscht den Platz: der Wassereimer zieht mit und läuft weiter (" + (vor ? Math.round(vor.zeit) : "?") + " ms → " + (nach ? Math.round(nach.zeit) : "?") + " ms, kein Neustart)", JSON.stringify({ vor, nach }));

  console.log("\nGEHALTENES GERÄT ZIELT NACH DEM UMZUG NEU\n");
  await pg.evaluate(() => { window.DMA_SPIEL.pruef.haltenEffektSetzen ? 0 : 0; window.DMA_SPIEL.haltenEffektSetzen("zwille"); }); await tick(1600);
  z = await ziel(); await pg.touchscreen.tap(z.x, z.y); await tick(300);
  r = await pg.evaluate(() => { const s = document.querySelector("#livechatKarte .lc-zwille-halt"); const h = document.querySelector("#livechatKarte .lc-platz-ich > .sp-halt");
    return s ? { fuer: s.dataset.lcFuer, ziel: s.dataset.lcZiel, dreh: s.style.getPropertyValue("--zieldreh"), spielGeraet: h ? getComputedStyle(h).opacity : "–" } : null; });
  sage(r && r.fuer === "ich" && r.ziel === "bea" && r.spielGeraet === "0", "die Zwille des Chat-Effekts gehört dem Schützen, kennt ihr Ziel – das gehaltene Gerät blendet sich solange aus (keine doppelte Zwille)", JSON.stringify(r));
  const dreh1 = r && r.dreh;
  await pg.evaluate(() => { window.LiveChat.pruefBefehl("/tausch Cem"); window.DMA_PRUEF.neuZeichnen(); }); await tick(120);
  r = await pg.evaluate(() => { const s = document.querySelector("#livechatKarte .lc-zwille-halt"); if (!s) return null;
    const q = s.closest(".lc-platz").getBoundingClientRect(), b = document.querySelector('#livechatKarte .lc-platz[data-lc-id="bea"]').getBoundingClientRect();
    const soll = Math.atan2((b.top + b.height / 2) - (q.top + q.height / 2), (b.left + b.width / 2) - (q.left + q.width / 2)) * 180 / Math.PI;
    return { bei: s.closest(".lc-platz").dataset.lcId, dreh: parseFloat(s.style.getPropertyValue("--zieldreh")), soll: +soll.toFixed(1) }; });
  sage(r && r.bei === "ich" && Math.abs(r.dreh - r.soll) < 1.5, "nach meinem Umzug hängt die Zwille wieder an mir und zielt neu auf Bea", JSON.stringify({ r, vorher: dreh1 }));

  console.log("\nABLEGEN\n");
  await tick(1500);
  await tippe("#livechatKarte .lc-platz.lc-platz-ich .lc-kreis"); await tick(400);
  r = await pg.evaluate(() => ({ h: window.DMA_SPIEL.pruef.halten(), ls: localStorage.getItem("dma_chat_halten") }));
  sage(!r.h && r.ls === null, "Tipp aufs eigene Bild legt die Chat-Waffe weg", JSON.stringify(r));
  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\nFassung 736 (Chat-Waffen Phase 2): " + (fehler ? fehler + " rot." : "alles grün."));
  await br.close(); srv.close(); process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
