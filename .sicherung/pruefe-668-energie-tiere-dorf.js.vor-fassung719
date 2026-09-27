#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 668: ENERGIE-WAFFEN, ZIEGELMAUER, NEUE TIERE, DORF
   ---------------------------------------------------------------------
   XANDER: „Wir brauchen noch mehr Gebäude … mehr Fusionen noch mehr Tiere
   und mehr Super Waffen auch mehr Laser Arten … wie kann man zwischen
   diesen Salven und multiple Feuern unterscheiden? … Kugelblitz".
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
  const tippe = async (sel) => { const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };

  const seite = (chat) => pg.evaluate((c) => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + c + '"] .lc-kreis'); if (!k) return null; const r = k.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; }, chat);
  pg.on("dialog", (d) => d.accept());
  const P = "window.DMA_SPIEL.pruef";

  console.log("\nLADEN: ENERGIE-WAFFEN UND ZIEGELMAUER\n");
  await pg.evaluate(() => { window.__ich.level = 6; window.__ich.punkte = 500; window.DMA_SPIEL.menue("waffen"); });
  await tick(300);
  const la = await pg.evaluate(() => { const z = (d) => { const b = document.querySelector('#spPanel [data-d="' + d + '"]'); if (b) return (b.disabled ? "zu:" : "auf:") + b.textContent.trim();
      const zeile = [...document.querySelectorAll("#spPanel .sp-zeile")].find((r) => r.textContent.indexOf({ plasmastrahl: "Plasmastrahl", kugelblitz: "Kugelblitz" }[d] || "§") >= 0); return zeile ? "zu:" + zeile.querySelector("button").textContent : "fehlt"; };
    const art = [...document.querySelectorAll("#spPanel .sp-zeile")].find((r) => /Fächerlaser/.test(r.textContent));
    return { doppel: z("doppellaser"), faecher: z("streulaser"), plasma: z("plasmastrahl"), blitz: z("kugelblitz"), art: art ? art.textContent : "" }; });
  sage(/auf:.*70/.test(la.doppel) && /auf:.*120/.test(la.faecher) && /ab Level 8/.test(la.plasma) && /ab Level 11/.test(la.blitz), "Level 6: Doppel- und Fächerlaser kaufbar, Plasmastrahl ab 8, Kugelblitz ab 11", JSON.stringify(la).slice(0, 200));
  sage(/Mehrfachfeuer/.test(la.art), "im Laden steht, was es ist: Mehrfachfeuer (gleichzeitig) statt Salve (nacheinander)", la.art.slice(0, 90));
  await pg.evaluate(() => window.DMA_SPIEL.menue("schutz"));
  await tick(250);
  const ziegel = await pg.evaluate(() => { const b = document.querySelector('#spPanel [data-d="mauer_ziegel"]'); return b ? b.closest(".sp-zeile").textContent : ""; });
  sage(/Ziegeln/.test(ziegel) && /65 Schaden/.test(ziegel), "Ziegelmauer im Laden (hält 65)", ziegel.slice(0, 80));
  await pg.evaluate(() => { const p = document.getElementById("spPanel"); if (p) p.hidden = true; });

  console.log("\nENERGIE-WAFFEN IM FLUG\n");
  await pg.evaluate(() => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-kreis'); k.scrollIntoView({ block: "center", behavior: "instant" }); });
  const flug = {};
  for (const w of ["doppellaser", "streulaser", "plasmastrahl", "kugelblitz"]) {
    flug[w] = await pg.evaluate(async (w) => {
      window.DMA_TONLOG = [];
      const dauer = window.DMA_SPIEL.pruef.geschossZeigen("ich", "bea", w, 0, 0);
      await new Promise((r) => setTimeout(r, 90));
      const z = { strahlen: document.querySelectorAll(".sp-laser-" + w).length, plasma: document.querySelectorAll(".sp-plasma").length, kugel: document.querySelectorAll(".sp-g-kugelblitz").length };
      await new Promise((r) => setTimeout(r, dauer + 60));
      z.blitz = document.querySelectorAll(".sp-blitzschlag").length;
      z.toene = window.DMA_TONLOG.map((t) => t.name).join(",");
      z.dauer = dauer;
      return z;
    }, w);
    if (w === "kugelblitz") {
      await pg.evaluate(() => window.DMA_SPIEL.pruef.geschossZeigen("ich", "bea", "kugelblitz", 0, 0));
      await tick(550);
      const box = await pg.evaluate(() => { const r = document.querySelector('#lcPlaetze').getBoundingClientRect(); return { x: 0, y: Math.max(0, r.top), width: innerWidth, height: Math.min(360, r.height) }; });
      await pg.screenshot({ path: "/tmp/claude-0/p-668-kugelblitz.png", clip: box });
      await tick(700);
    }
    if (w === "streulaser") {
      await pg.evaluate(() => window.DMA_SPIEL.pruef.geschossZeigen("ich", "bea", "streulaser", 0, 0));
      await tick(60);
      const box = await pg.evaluate(() => { const r = document.querySelector('#lcPlaetze').getBoundingClientRect(); return { x: 0, y: Math.max(0, r.top), width: innerWidth, height: Math.min(360, r.height) }; });
      await pg.screenshot({ path: "/tmp/claude-0/p-668-faecher.png", clip: box });
      await tick(500);
    }
  }
  console.log("   " + JSON.stringify(flug));
  sage(flug.doppellaser.strahlen === 2 && /laserblau/.test(flug.doppellaser.toene), "Doppellaser: zwei Strahlen gleichzeitig, eigener Ton", JSON.stringify(flug.doppellaser));
  sage(flug.streulaser.strahlen === 5, "Fächerlaser: fünf Strahlen gleichzeitig im Fächer", JSON.stringify(flug.streulaser));
  sage(flug.plasmastrahl.plasma === 1 && /dunkelbrumm/.test(flug.plasmastrahl.toene), "Plasmastrahl: ein anhaltender Strahl, brummt", JSON.stringify(flug.plasmastrahl));
  sage(flug.kugelblitz.kugel === 1 && flug.kugelblitz.blitz >= 1 && /gewitter/.test(flug.kugelblitz.toene), "Kugelblitz: knisternde Kugel, Blitzschlag und Donner beim Einschlag", JSON.stringify(flug.kugelblitz));

  console.log("\nWAFFENRAD: EIGENER SEKTOR „ENERGIE“\n");
  await pg.evaluate(() => { window.__ich.waffen = window.__ich.waffen.concat(["doppellaser", "streulaser", "plasmastrahl", "kugelblitz"]); const Q = window.DMA_SPIEL.pruef, S = Q.zustand(); S.ich = window.__ich; S.waffe = Q.slots()[0]; S.rad = 0; Q.schnellZeichnen(true); });
  await tick(300);
  const rad = await pg.evaluate(() => [...document.querySelectorAll(".sp-rad-voll .sp-rad-sektoren text.sp-rad-klasse")].map((t) => t.textContent).join(","));
  sage(/Energie/.test(rad), "im Waffenrad gibt es den Sektor „Energie“", rad);
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.rad = null; window.DMA_SPIEL.pruef.schnellZeichnen(true); });

  console.log("\nTIERE, FUSIONEN, MAUER, DORF\n");
  const bilder = await pg.evaluate(() => {
    const aus = {};
    ["dackel", "storch", "wolpertinger", "lindwurm"].forEach((a) => {
      const d = document.createElement("div"); d.style.cssText = "position:fixed;left:0;top:0;width:100px;height:100px";
      d.innerHTML = window.DMA_SPIEL.pruef.tierSvg(a, true); document.body.appendChild(d);
      const svg = d.querySelector("svg"), vb = svg.viewBox.baseVal, bb = svg.querySelector(".sp-tier-koerper").getBBox();
      aus[a] = { teile: svg.querySelectorAll("path,circle,ellipse").length, drin: bb.x >= vb.x - 1.5 && bb.y >= vb.y - 1.5 && bb.x + bb.width <= vb.x + vb.width + 1.5 && bb.y + bb.height <= vb.y + vb.height + 1.5,
                 bb: [bb.x, bb.y, bb.width, bb.height].map((n) => Math.round(n)).join(" "), vb: [vb.x, vb.y, vb.width, vb.height].join(" ") };
      d.remove();
    });
    return aus;
  });
  sage(Object.values(bilder).every((b) => b.teile >= 10 && b.drin), "Dackel, Storch, Wolpertinger, Lindwurm: eigene Zeichnungen, ganz in der Kachel", JSON.stringify(bilder));
  await pg.evaluate(() => { const ich = window.__ich; ich.level = 9; ich.tiere = Object.assign({}, ich.tiere, { dackel: { kraft: 20, stufe: 2 }, fee: { kraft: 20, stufe: 2 }, stachelmonster: { kraft: 20, stufe: 2 } }); window.DMA_SPIEL.menue("tiere"); });
  await tick(300);
  const tr = await pg.evaluate(() => ({ rezepte: document.querySelectorAll("#spPanel .sp-fusion").length, wolp: (document.querySelector('#spPanel [data-tu="fusion"][data-k="wolpertinger"]') || {}).textContent || "",
    kaufen: [...document.querySelectorAll('#spPanel [data-tu="kaufen"]')].map((b) => b.dataset.d).join(",") }));
  sage(tr.rezepte === 5 && /Verschmelzen/.test(tr.wolp) && /storch/.test(tr.kaufen), "5 Fusionen (Wolpertinger bereit), Storch zu kaufen, Dackel ist schon deins", JSON.stringify(tr));
  await pg.evaluate(() => { const p = document.querySelector("#spPanel .sp-fusion"); if (p) p.scrollIntoView({ block: "start" }); });
  await tick(150);
  await pg.screenshot({ path: "/tmp/claude-0/p-668-tiere.png" });
  await pg.evaluate(() => { const p = document.getElementById("spPanel"); if (p) p.hidden = true; });

  const zg = await pg.evaluate(() => { const svg = window.DMA_SPIEL.pruef.mauerSvg("ziegel", false); const d = document.createElement("div"); d.innerHTML = svg; return { steine: d.querySelectorAll("path").length, fuge: /#e8d9c4/.test(svg) }; });
  sage(zg.steine >= 30 && zg.fuge, "Ziegelmauer: viele kleine Ziegel mit hellen Fugen", JSON.stringify(zg));

  await pg.evaluate(() => { const ich = window.__ich; ich.level = 9; ich.punkte = 900; ich.dorf = { baeckerei: { stufe: 1, lp: 20 } }; const Q = window.DMA_SPIEL.pruef, S = Q.zustand(); S.ich = ich; S.schnellMenue = true; S.schnellReiter = "dorf"; Q.schnellZeichnen(true);
    const m = document.querySelector(".sp-schnellmenue"); if (m) m.scrollIntoView({ block: "center" }); });
  await tick(300);
  const dorf = await pg.evaluate(() => ({ namen: [...document.querySelectorAll(".sp-schnellmenue .sp-dorf b")].map((b) => b.textContent.replace(/ ·.*/, "")).join(","),
    bauen: [...document.querySelectorAll('.sp-schnellmenue [data-s="bauen"]')].filter((b) => !b.disabled).map((b) => b.dataset.w).join(",") }));
  sage(/Brauerei/.test(dorf.namen) && /Bibliothek/.test(dorf.namen) && /Rathaus/.test(dorf.namen) && /rathaus/.test(dorf.bauen), "Dorf: Brauerei, Bibliothek, Rathaus dazu (Level 9: alle baubar)", JSON.stringify(dorf));
  await pg.screenshot({ path: "/tmp/claude-0/p-668-dorf.png" });
  await pg.evaluate(() => { window.__ernte = Object.assign({}, window.__ich, { ok: true, bratwurst: 2, erz: 0, xp: 30, mana: 15, punkte_plus: 15 }); window.__hinweise.length = 0;
    const Q = window.DMA_SPIEL.pruef, S = Q.zustand(); S.schnellMenue = true; S.schnellReiter = "dorf"; Q.schnellZeichnen(true);
    const k = document.querySelector('.sp-schnellmenue [data-s="ernte"]'); if (k) k.click(); });
  await tick(400);
  const ernte = await pg.evaluate(() => window.__hinweise.join(" | ") + " §rufe:" + window.__rufe.filter((r) => /dorf/.test(r.name)).length + " §knopf:" + !!document.querySelector('.sp-schnellmenue [data-s="ernte"]') + " §meld:" + ((window.DMA_SPIEL.pruef.zustand().menueMeldung || {}).text || ""));
  sage(/15 Mana/.test(ernte) && /15 Punkte/.test(ernte), "die Ernte nennt auch Mana und Punkte", ernte.slice(0, 120));

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 668: " + fehler + " rot." : "Fassung 668 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
