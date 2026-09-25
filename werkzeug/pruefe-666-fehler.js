#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 666: XANDERS FEHLERLISTE VOM 25.09. NACHMITTAGS
   ---------------------------------------------------------------------
   XANDER: „Es werden irgendwelche Effekte, die offenbar zum Spiel
   gehören, links oben beim Android angezeigt … Die Schaufel funktioniert
   nicht … Obwohl ich meine Waffen angelegt habe, steht im Hauptmenü, dass
   ich sie anlegen soll … ganz viele eigenartige Symbole. Die sehen aus
   wie Pokale … alle aufeinander geklatscht … Wenn jetzt jemand ein
   längeren Namen hat, dann gibt es Zeilen und Brüche".
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

  console.log("\nLINKS OBEN: CHAT AUSGEBLENDET\n");
  /* Ein anderer Bereich ist offen – das Klassenzimmer ist unsichtbar
     (Größe 0). Bea schießt trotzdem, ihr Tier greift an. */
  await pg.evaluate(() => {
    window.__obenLinks = [];
    const mo = new MutationObserver((l) => l.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1 || n.parentNode !== document.body) return;
      setTimeout(() => { if (!n.isConnected) return; const r = n.getBoundingClientRect(); const cs = getComputedStyle(n);
        if (cs.display !== "none" && cs.visibility !== "hidden" && r.left < 90 && r.top < 90 && r.right > 0 && r.bottom > 0 && r.width > 0) window.__obenLinks.push(n.className || n.tagName); }, 120);
    })));
    mo.observe(document.body, { childList: true });
    window.__mo = mo;
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "false"; e = e.parentElement; }
    const P = window.DMA_SPIEL.pruef;
    P.geschossZeigen("bea", "ich", "kartoffel", 0, 0);
    P.trefferZeigen("ich", { zone: "koerper", schaden: 6 });
    P.tierAngriff("bea", "ich", "drache");
    P.tierAngriff("bea", "ich", "fellmonster");
  });
  await tick(1500);
  const ol = await pg.evaluate(() => ({ breite: (document.querySelector("#lcPlaetze .lc-kreis") || { getBoundingClientRect: () => ({ width: -1 }) }).getBoundingClientRect().width, oben: window.__obenLinks }));
  sage(ol.breite === 0 && ol.oben.length === 0, "unsichtbares Klassenzimmer: nichts landet links oben", JSON.stringify(ol));
  await pg.evaluate(() => { window.__mo.disconnect(); let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; } });
  await tick(3500);

  console.log("\nSCHAUFEL\n");
  await pg.evaluate(() => { window.__rufe.length = 0; const leiste = document.querySelector(".sp-schnell"); window.__leisteVorher = leiste ? leiste.getBoundingClientRect().top : null;
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="5"] .lc-kreis'); if (k) k.scrollIntoView({ block: "center", behavior: "instant" }); });
  await tick(300);
  /* Lang drücken auf einen freien Platz (Platz 5) nimmt die Schaufel. */
  const frei = await seite5();
  async function seite5() { return pg.evaluate(() => { const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="5"] .lc-kreis'); const r = k.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); }
  /* Langer Druck wie am Telefon: pointerdown, 700 ms halten, pointerup
     (so horcht app.js: lcPlatzMenueBinden). */
  const langDruck = async (p) => {
    await pg.evaluate((p) => { const el = document.elementFromPoint(p.x, p.y);
      el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: p.x, clientY: p.y, pointerType: "touch", isPrimary: true })); window.__langEl = el; }, p);
    await tick(700);
    await pg.evaluate((p) => { window.__langEl.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: p.x, clientY: p.y, pointerType: "touch", isPrimary: true })); }, p);
    await tick(300);
  };
  await langDruck(frei);
  const nachLang = await pg.evaluate(() => ({ graben: document.body.classList.contains("sp-graben"), pe: getComputedStyle(document.body).pointerEvents, pos: getComputedStyle(document.body).position,
    menue: !!document.querySelector(".lc-platzmenue, .lc-anreise") }));
  sage(nachLang.graben && !nachLang.menue, "lang drücken auf freien Platz: Schaufel in der Hand (kein Reise-Menü)", JSON.stringify(nachLang));
  const frei2 = await seite5();
  sage(nachLang.pe !== "none" && nachLang.pos !== "absolute" && Math.abs(frei2.y - frei.y) < 2, "mit Schaufel bleibt die Seite tippbar und nichts verrutscht", JSON.stringify(nachLang) + " Δy=" + Math.round(frei2.y - frei.y));
  await pg.touchscreen.tap(frei2.x, frei2.y);
  await tick(1300);
  const grab = await pg.evaluate(() => window.__rufe.filter((r) => r.name === "spiel_graben").map((r) => r.args.p_platz));
  sage(grab.length === 1 && grab[0] === 5, "Tipp auf das Feld gräbt dort (spiel_graben Platz 5)", JSON.stringify(grab));
  await langDruck(frei);
  sage(await pg.evaluate(() => !document.body.classList.contains("sp-graben")), "noch einmal lang drücken: Schaufel weggelegt");
  const wg = await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.ich.graben = 5; S.stand[S.ich.id] = Object.assign({}, S.stand[S.ich.id], { graben: 5 }); P.zeichnen();
    const g = document.querySelector("#lcPlaetze .lc-platz-ich .sp-wassergraben"); return g ? { pos: getComputedStyle(g).position, pe: getComputedStyle(g).pointerEvents, svg: !!g.querySelector("svg") } : null; });
  sage(wg && wg.pos === "absolute" && wg.pe === "none" && wg.svg, "der Wassergraben liegt weiter unter dem eigenen Bild (eigene Klasse)", JSON.stringify(wg));

  console.log("\nLANGE NAMEN UND ANLEGEN\n");
  const namen = await pg.evaluate(() => {
    const n = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .lc-platz-name');
    const kurz = n.getBoundingClientRect().height;
    const alt = n.textContent; n.textContent = "Maximilian-Alexander von Hohenzollern";
    const lang = n.getBoundingClientRect().height, breit = n.scrollWidth > n.clientWidth;
    n.textContent = alt;
    return { kurz: Math.round(kurz), lang: Math.round(lang), gekuerzt: breit, ende: getComputedStyle(n).textOverflow };
  });
  sage(namen.lang === namen.kurz && namen.ende === "ellipsis", "langer Name bleibt eine Zeile und endet mit „…“", JSON.stringify(namen));
  const anl = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.waffe = "kartoffel"; window.DMA_SPIEL.menue("start");
    const t = [...document.querySelectorAll("#spPanel .sp-klein")].map((p) => p.textContent).find((x) => /^Kampf/.test(x)) || ""; document.getElementById("spPanel").hidden = true; return t; });
  sage(/ist angelegt/.test(anl) && !/Waffe anlegen/.test(anl), "Waffe angelegt: das Menü sagt nicht mehr „Waffe anlegen“", anl.slice(0, 70));
  sage(await pg.evaluate(() => typeof (window.Werkstatt || {}).frischHolen === "function"), "Werkstatt holt ihren Stand frisch nach");

  console.log("\nMENÜ: MEHR UND TROPHÄEN\n");
  await pg.evaluate(() => {
    const namen = ["Erste Schritte", "Fleißig", "Deutsch-Profi", "Treffsicher", "Scharfschütze", "Tierfreund", "Züchter", "Baumeister", "Schatzsucher", "Glückspilz",
                   "Zauberlehrling", "Erzmagier", "Heiler", "Überlebender", "Stammgast", "Legende"];
    window.__troph = { ok: true, liste: namen.map((n, i) => ({ id: "t" + i, name: n, text: "Beschreibung der Trophäe " + n + " mit etwas mehr Text", lohn: 10 + i * 5, stand: i * 3, ziel: 30, hat: i % 3 === 0 })), neu: [], lohn: 0 };
    window.__ich.level = 11;
  });
  await pg.evaluate(() => window.DMA_SPIEL.pruef.trophaeenHolen());
  await tick(300);
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.schnellMenue = true; S.schnellReiter = "mehr"; P.schnellZeichnen(true);
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea"); while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    const m = document.querySelector(".sp-schnellmenue"); if (m) m.scrollIntoView({ block: "center" }); });
  await tick(400);
  await pg.screenshot({ path: "/tmp/claude-0/p-666-mehr.png" });
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.schnellReiter = "trophaeen"; P.schnellZeichnen(true); const m = document.querySelector(".sp-schnellmenue"); if (m) m.scrollIntoView({ block: "center" }); });
  await tick(400);
  await pg.screenshot({ path: "/tmp/claude-0/p-666-troph.png" });
  const ueber = await pg.evaluate(() => {
    const zeilen = [...document.querySelectorAll(".sp-troph")].map((z) => z.getBoundingClientRect()).filter((r) => r.height > 0);
    let ueberlapp = 0; for (let i = 1; i < zeilen.length; i++) if (zeilen[i].top < zeilen[i - 1].bottom - 1) ueberlapp++;
    return { zeilen: zeilen.length, ueberlapp, hoehen: zeilen.slice(0, 3).map((r) => Math.round(r.height)) };
  });
  sage(ueber.zeilen >= 10 && ueber.ueberlapp === 0, "Trophäen stehen untereinander, nichts übereinander", JSON.stringify(ueber));
  /* Sechs neue Trophäen auf einmal (so kam es bei Xander um 13:40): ein Pokal, keine sechs. */
  await pg.evaluate(() => { window.__troph.neu = window.__troph.liste.slice(0, 6); window.__troph.lohn = 0; window.__hinweise.length = 0;
    const P = window.DMA_SPIEL.pruef; P.trophaeenHolen(); P.trophaeenHolen(); });
  let meistePokale = 0;
  for (let i = 0; i < 20; i++) { await tick(300); meistePokale = Math.max(meistePokale, await pg.evaluate(() => document.querySelectorAll(".sp-pokal-feier").length)); }
  const trMeld = await pg.evaluate(() => window.__hinweise.filter((h) => /Troph/.test(h)));
  sage(meistePokale === 1 && trMeld.length === 1 && /6 Trophäen/.test(trMeld[0]), "6 neue Trophäen: ein Pokal, eine Meldung (auch bei doppelter Abfrage)", meistePokale + " | " + trMeld.join(" / ").slice(0, 120));
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.schnellMenue = false; S.schnellReiter = ""; P.schnellZeichnen(true); });

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 666: " + fehler + " rot." : "Fassung 666 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
