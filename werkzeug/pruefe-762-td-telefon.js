/* =====================================================================
   SONDE — FASSUNG 762: TOWER DEFENSE PASST AUFS TELEFON
   ---------------------------------------------------------------------
   Seit Fassung 747 stand die Fragen-Vorwahl (168 px) über dem Feld;
   „Deutsch-Frage" und „Welle starten" lagen unter dem Rand. Jetzt ist
   die Vorwahl eine einklappbare Zeile und das Feld richtet sich nach
   der Höhe. Geprüft auf 360×640 und 360×740.
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
  const ctx = await br.newContext({ viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75,
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

  console.log("\nMENÜ → MEHR → EXTRA-SPIELE\n");
  await pg.evaluate(() => { const Q = window.DMA_SPIEL.pruef, S = Q.zustand(); S.schnellMenue = true; S.schnellReiter = "mehr"; Q.schnellZeichnen(true);
    const b = document.querySelector('.sp-schnellmenue [data-s="extra"][data-e="td"]'); if (b) b.scrollIntoView({ block: "center", behavior: "instant" }); });
  await tick(200);
  const knoepfe = await pg.evaluate(() => [...document.querySelectorAll('.sp-schnellmenue [data-s="extra"]')].map((b) => b.textContent).join(" | "));
  sage(/Tower Defense/.test(knoepfe) && /Strategie/.test(knoepfe), "unter „Mehr“ stehen die Extra-Spiele", knoepfe);
  await tippe('.sp-schnellmenue [data-s="extra"][data-e="td"]');
  await tick(400);

  const lage = () => pg.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), right: Math.round(b.right), h: Math.round(b.height) }; };
    const oben = (s) => { const e = document.querySelector(s); if (!e) return false; const b = e.getBoundingClientRect(); const o = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return o === e || e.contains(o); };
    const x = document.querySelector(".sp-extra");
    return { h: innerHeight, w: innerWidth, feld: r(".sp-td-feld"), frage: r('.sp-td-knoepfe [data-td="frage"]'), welle: r('.sp-td-knoepfe [data-td="welle"]'), sum: r(".sp-vorwahl-kurz summary"),
             frageOben: oben('.sp-td-knoepfe [data-td="frage"]'), welleOben: oben('.sp-td-knoepfe [data-td="welle"]'),
             quer: x.scrollWidth > x.clientWidth, kopf: (document.querySelector(".sp-vorwahl-kopf") || {}).textContent, zu: !(document.querySelector(".sp-vorwahl-kurz") || {}).open };
  });

  for (const hoehe of [640, 740]) {
    console.log("\nTOWER DEFENSE AUF 360×" + hoehe + "\n");
    await pg.setViewportSize({ width: 360, height: hoehe });
    await pg.evaluate(() => window.DMA_SPIEL.pruef.extraOeffnen("td"));
    await tick(300);
    const L = await lage();
    sage(L.zu && /Niveau/.test(L.kopf), "die Vorwahl ist eine zugeklappte Zeile: " + L.kopf, "");
    sage(L.sum && L.sum.h >= 30, "die Zeile ist groß genug zum Tippen (≥ 30 px)", JSON.stringify(L.sum));
    sage(L.feld && L.feld.bottom <= L.h && L.feld.top >= 0, "das ganze Feld ist ohne Scrollen zu sehen", JSON.stringify(L.feld));
    sage(L.frage.bottom <= L.h && L.welle.bottom <= L.h && L.frageOben && L.welleOben, "„Deutsch-Frage“ und „Welle starten“ sind ohne Scrollen tippbar", JSON.stringify([L.frage, L.welle]));
    sage(L.frage.h >= 30 && L.welle.h >= 30, "Knöpfe ≥ 30 px hoch", L.frage.h + "/" + L.welle.h);
    sage(!L.quer && L.feld.left >= 0 && L.feld.right <= 360, "nichts ragt seitlich heraus", JSON.stringify(L.feld));
    await pg.screenshot({ path: "/tmp/claude-0/p-762-td-" + hoehe + ".png" });
    await pg.evaluate(() => window.DMA_SPIEL.pruef.extraSchliessen());
  }

  console.log("\nVORWAHL AUFKLAPPEN UND WÄHLEN\n");
  await pg.evaluate(() => window.DMA_SPIEL.pruef.extraOeffnen("td"));
  await tick(300);
  await tippe(".sp-vorwahl-kurz summary");
  const auf = await pg.evaluate(() => ({ offen: document.querySelector(".sp-vorwahl-kurz").open, chips: document.querySelectorAll(".sp-vorwahl-kurz [data-vw-niveau]").length }));
  sage(auf.offen && auf.chips >= 3, "Tippen auf die Zeile klappt die Niveaus und Fragenarten auf", JSON.stringify(auf));
  await pg.screenshot({ path: "/tmp/claude-0/p-762-td-offen.png" });
  const ziel = await pg.evaluate(() => { const b = [...document.querySelectorAll(".sp-vorwahl-kurz [data-vw-niveau]")].find((x) => !x.classList.contains("sp-an")); return b.dataset.vwNiveau; });
  await tippe('.sp-vorwahl-kurz [data-vw-niveau="' + ziel + '"]');
  await tippe('.sp-vorwahl-kurz [data-vw-art="gemischt"]');
  const gew = await pg.evaluate(() => ({ kopf: document.querySelector(".sp-vorwahl-kopf").textContent, niveau: window.DMA_SPIEL.pruef.zustand().niveau }));
  sage(gew.niveau === ziel && gew.kopf.indexOf(ziel) >= 0 && /Gemischt/.test(gew.kopf), "Auswahl wirkt und steht sofort in der Zeile", JSON.stringify(gew));
  await tippe(".sp-vorwahl-kurz summary");
  sage(await pg.evaluate(() => !document.querySelector(".sp-vorwahl-kurz").open), "nochmal Tippen klappt sie wieder zu", "");
  await tippe('.sp-td-knoepfe [data-td="frage"]');
  await tick(400);
  const fr = await pg.evaluate(() => { const r = window.__rufe.filter((x) => x.name === "spiel_aufgabe").pop(); return r ? r.args.p_niveau : null; });
  sage(fr === ziel, "die Deutsch-Frage kommt im gewählten Niveau", String(fr));
  await pg.evaluate(() => { document.querySelectorAll(".sp-extra-frage").forEach((f) => f.remove()); window.DMA_SPIEL.pruef.extraSchliessen(); });

  console.log("\nRUNDENKAMPF BEHÄLT DIE OFFENE VORWAHL\n");
  await pg.evaluate(() => window.DMA_SPIEL.pruef.extraOeffnen("strat"));
  await tick(300);
  const st = await pg.evaluate(() => ({ kurz: !!document.querySelector(".sp-extra .sp-vorwahl-kurz"), voll: !!document.querySelector(".sp-extra div.sp-vorwahl [data-vw-niveau]") }));
  sage(!st.kurz && st.voll, "im Rundenkampf-Menü steht die Vorwahl weiter offen da", JSON.stringify(st));
  await pg.evaluate(() => window.DMA_SPIEL.pruef.extraSchliessen());

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 762: " + fehler + " rot." : "Fassung 762 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
