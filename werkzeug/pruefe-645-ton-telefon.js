#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 645: TON, MENÜ AUF DEM TELEFON, MELDUNGEN, AUSWERTUNG
   ---------------------------------------------------------------------
   XANDER (25.09.): „der Sound geht immer noch nicht" · „das Layout auf
   Android von dem Shortcut Menü ist unmöglich … wenn ich auf Ton testen
   gehe passiert hier gar nix … ich kann ja nicht mal auf Laden und
   Schutz drücken" · „der Bierkrug … so riesig" · „danach ist immer die
   Auswertung die das Ganze nach unten drückt".
   Gefunden: die App-Blasen (Toasts) lagen fest unten, Ebene 999, über
   dem Menü und fingen jeden Tipp ab; das Menü war oben abgeschnitten;
   die Leiste zeichnete sich jede Sekunde neu, auch unter dem Finger.
   Diese Sonde tippt mit ECHTEN Fingertipps (Android-Telefon):
     · Meldungen stehen in einer durchlässigen Zeile, nicht als Toast
     · jeder Menüknopf ist dort, wo man tippt, auch wirklich der Knopf
     · das Menü ragt nicht über den oberen Rand hinaus
     · „Ton testen" reagiert, Web Audio läuft, Diagnose geht raus
     · Spieltöne laufen über Web Audio
     · kein Neuzeichnen, solange der Finger auf der Leiste liegt
     · kein Waffen-Abzeichen am Bild
     · die Auswertung einer Aufgabe verschiebt nichts
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
    window.LiveChat.spielIdVon = (id) => (id === "bea" ? beaId : id === "cem" ? cemId : "");
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
  const trifft = (sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return "fehlt"; const r = e.getBoundingClientRect();
    const oben = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return oben && (oben === e || e.contains(oben)) ? "ja" : (oben ? oben.className || oben.tagName : "nichts"); }, sel);
  const tippe = async (sel) => { const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };

  console.log("\nMELDUNGEN OHNE TOAST\n");
  await pg.evaluate(() => { window.__toasts = 0; const alt = window.DMA_SPIEL_BRUECKE.toast; window.DMA_SPIEL_BRUECKE.toast = (t) => { window.__toasts++; alt(t); }; });
  const meld = await pg.evaluate(() => {
    window.DMA_SPIEL.pruef.hinweis("🎯 Eine lange Meldung, die früher als große Blase unten über dem Menü lag und jeden Tipp abfing.");
    const m = document.querySelector(".sp-meldung"), l = document.querySelector(".sp-schnell .sp-s-reihe");
    const a = m.getBoundingClientRect(), b = l.getBoundingClientRect();
    return { toasts: window.__toasts, durch: getComputedStyle(m).pointerEvents, ueber: a.bottom <= b.top + 1, hoch: Math.round(a.height) };
  });
  sage(meld.toasts === 0, "das Spiel meldet sich nicht mehr als Toast", "Toasts: " + meld.toasts);
  sage(meld.durch === "none" && meld.ueber, "die Meldungszeile lässt Tipps durch und sitzt über der Leiste", JSON.stringify(meld));

  console.log("\nMENÜ MIT DEM FINGER\n");
  await tippe(".sp-schnell .sp-s-menue");
  const offen = await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().schnellMenue);
  sage(offen, "Fingertipp auf ☰ öffnet das Menü");
  await tippe('.sp-schnellmenue [data-s="reiter"][data-r="mehr"]');
  /* Eine sichtbare App-Blase gleichzeitig — so wie auf Xanders Telefon. */
  await pg.evaluate(() => { window.DMA_SPIEL_BRUECKE.toast("Blase unten"); });
  await tick(500);
  const knoepfe = {};
  for (const s of ["graben", "mission", "tontest", 'gross"][data-r="schutz', 'gross"][data-r="start']) knoepfe[s.split('"')[0]] = await trifft('.sp-schnellmenue [data-s="' + s + '"]');
  sage(Object.values(knoepfe).every((v) => v === "ja"), "jeder Knopf in „Mehr“ ist unter dem Finger wirklich der Knopf", JSON.stringify(knoepfe));
  const rand = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue").getBoundingClientRect(), p = document.querySelector(".sp-schnell").parentNode.getBoundingClientRect(); return { oben: Math.round(m.top), rahmen: Math.round(p.top), hoch: Math.round(m.height), zeilen: document.querySelectorAll(".sp-schnellmenue .sp-sm-liste button").length }; });
  sage(rand.oben >= rand.rahmen && rand.oben >= 0, "das Menü ragt nicht über den oberen Rand (nichts abgeschnitten)", JSON.stringify(rand));

  console.log("\nTON\n");
  await pg.evaluate(() => { window.__rufe = []; window.__hinweise.length = 0; window.DMA_TONLOG = []; });
  await tippe('.sp-schnellmenue [data-s="tontest"]');
  await tick(1500);
  const test = await pg.evaluate(() => { const K = window.DMA_SPIEL.pruef.klang(); const r = window.__rufe.find((x) => x.name === "spiel_diagnose_senden");
    return { ctx: K.ctx && K.ctx.state, meldung: (window.__hinweise.slice(-1)[0] || ""), diag: r ? r.args.p_daten : null }; });
  sage(/Ton läuft/.test(test.meldung), "„Ton testen“ reagiert auf den Finger und sagt, was los ist", test.meldung);
  sage(test.ctx === "running" && test.diag && test.diag.dekodiert && test.diag.webaudio, "Web Audio läuft, die Datei ist dekodiert, die Diagnose geht an den Betreiber", JSON.stringify({ ctx: test.ctx, diag: test.diag && { dekodiert: test.diag.dekodiert, webaudio: test.diag.webaudio, endung: test.diag.endung } }));
  await tick(2500);
  const spielTon = await pg.evaluate(async () => {
    window.DMA_TONLOG = [];
    window.DMA_SPIEL.pruef.ton("bling", 0.5); window.DMA_SPIEL.pruef.ton("knack", 0.5);
    await new Promise((r) => setTimeout(r, 50));
    return window.DMA_TONLOG.map((t) => t.name + ":" + (t.weg || "audio")).join(",");
  });
  sage(/bling:webaudio/.test(spielTon) && /knack:webaudio/.test(spielTon), "Spieltöne laufen über Web Audio (vorgeladen)", spielTon);

  console.log("\nNICHT NEU ZEICHNEN UNTER DEM FINGER\n");
  const druck = await pg.evaluate(async () => {
    const P = window.DMA_SPIEL.pruef, S = P.zustand(), el = document.querySelector(".sp-schnell");
    const vorher = el.querySelector('[data-s="tontest"]');
    el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerType: "touch" }));
    S.ich.punkte += 7; P.schnellZeichnen();
    const gleich = el.querySelector('[data-s="tontest"]') === vorher;
    el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "touch" }));
    await new Promise((r) => setTimeout(r, 900));
    return { gleich, danach: /\d+ P/.test(el.textContent) && el.textContent.indexOf(String(S.ich.punkte) + " P") >= 0 };
  });
  sage(druck.gleich && druck.danach, "während der Finger liegt, bleibt der Knopf; danach kommt der neue Stand", JSON.stringify(druck));

  console.log("\nBILD UND AUSWERTUNG\n");
  const marke = await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef; P.zustand().waffe = "bierkrug"; P.zeichnen(); return document.querySelectorAll(".sp-waffenmarke").length; });
  sage(marke === 0, "kein Waffen-Abzeichen am eigenen Bild (die Waffe steht in der Leiste)", marke + " Abzeichen");
  const aus = await pg.evaluate(async () => {
    window.DMA_SPIEL.aufgabe();
    await new Promise((r) => setTimeout(r, 400));
    const platz = () => { const e = document.querySelector("#spPanel .sp-erg-platz"); return e ? Math.round(e.getBoundingClientRect().height) : -1; };
    const unten = () => { const e = document.querySelector("#spPanel .sp-knoepfe, #spPanel .sp-hinweis"); return e ? Math.round(e.getBoundingClientRect().top) : -1; };
    const h1 = platz(), u1 = unten();
    const b = document.querySelector("#spPanel .sp-optionen button"); if (b) b.click();
    await new Promise((r) => setTimeout(r, 300));
    const h2 = platz(), u2 = unten(), txt = (document.querySelector("#spPanel .sp-erg-platz") || {}).textContent || "";
    window.DMA_SPIEL.schliessen();
    return { h1, h2, u1, u2, txt };
  });
  sage(aus.h1 > 0 && aus.h1 === aus.h2 && aus.u1 === aus.u2, "die Auswertung hat einen festen Platz – darunter verschiebt sich nichts", JSON.stringify(aus));
  if (process.env.BILD) { await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = true; S.schnellReiter = "mehr"; window.DMA_SPIEL.pruef.schnellZeichnen(); window.DMA_SPIEL.pruef.hinweis("🔊 Ton läuft (Web Audio)."); }); await tick(300); await pg.screenshot({ path: process.env.BILD }); }

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 645 auf dem Telefon: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
