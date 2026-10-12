#!/usr/bin/env node
/* =====================================================================
   SONDE 884-zoom — DOPPELTIPP-ZOOM IM ALTEN DORF: WENIGER SPEICHER,
   ZOOM STARTET SOFORT (Fassung 884, Funk 159/255)
   ---------------------------------------------------------------------
   XANDER (Funk 159): „… mit Doppeltipp größer machen … und das hängt noch
   ein bisschen ich bin jetzt zweimal abgestürzt". Funk 255: die schnelle
   Seite hat oberste Priorität.
   Der Weg: Doppeltipp → dorfDoppelPruefen → dorfZoom. Bis Fassung 884
   baute dorfZoom zuerst die ganze Leiste neu (schnellZeichnen) und legte
   dabei bei jedem Hineinzoomen eine neue 480×300-Leinwand für die kleine
   Karte an; schnelle Doppeltipps stapelten Zoom-Animationen auf der doppelt
   großen .sp-dorfland; am hellen Tag mischte eine unsichtbare Abend-Ebene
   (soft-light + multiply) das ganze Bild. Ab 884: eine Leinwand für die
   kleine Karte, höchstens eine Zoom-Animation, Abend-Ebene nur, wenn sie
   etwas tut, und die Bewegung beginnt vor dem Abgleichen des Menüs.
   Geprüft auf einem Android-Telefon (360 × 740, DPR 2,75, echte
   Fingertipps), Dorf wie Sonde 709 plus Bergwerk, heller Tag
   (S.sonneTest = 30), gemessen über CDP (Performance.getMetrics,
   LayerTree, HeapProfiler.collectGarbage) und einen Haken an
   HTMLCanvasElement.prototype.getContext (jede Leinwand als WeakRef).
     A  20 Doppeltipps in die freie Wiese: alle 20 schalten um
     B  Leinwände: bei 10× Hineinzoomen höchstens 1 neue „sp-dl-karte-bild"
        (bis 883: +10); nach GC wachsen die lebenden Leinwände nicht
     C  3× dorfZoom im Abstand von 90 ms: höchstens 1 laufende Animation
        auf .sp-dorfland (bis 883: 3)
     D  heller Tag: keine Mischebene im Dorf (bis 883: 2); Ebenenfläche
        „nah" mindestens 0,5 Bildschirme kleiner als mit eingeblendeter
        Abend-Ebene; bei Sonnenhöhe 1,5° ist die Abend-Ebene da (glut > .8)
     E  bei 4× gedrosselter CPU: Loslassen → Zoombeginn (animate) im Median
        ≤ 35 ms (bis 883: rund 68 ms)
     F  Schutz (schon vorher grün): Ebenen mitten in der Animation ≤ Ruhe
        „nah" + 6, Fläche ≤ Ruhe „nah" × 1,05 (Ruhe = Spitze über 1,5 s);
        nach GC Knoten ≤ +60, JS-Heap ≤ +2 MB
     G  Bild unverändert: Fotos von .sp-dl-fenster (ganz und nah, Tag,
        Bewegtes angehalten/ausgeblendet) gleichen dem Bild mit
        eingeblendeter Abend-Ebene – kein Bildpunkt weicht um mehr als
        3/255 ab (mit VERGLEICH= auch gegen einen früheren Lauf)
     H  900 ms nach dem Zoom stimmen kleine Karte, Kompass-Zeichen (+/−),
        Tipp-Text und offene Station; Doppeltipp trifft „genau dort"
        (innerhalb 0,15, wie Sonde 709)
   Schalter:
     QUELLE=1   index.html?quelle (ohne: min/ – vorher
                node werkzeug/fassung-setzen.js --nur-stempel)
     ALT=/pfad  spiel.js und spiel.css aus diesem Ordner, erzwingt ?quelle.
                Gegenprobe (dann B, C, D, E rot; F, G, H grün):
                mkdir /tmp/alt884 && git show HEAD:spiel.js > /tmp/alt884/spiel.js
                  && git show HEAD:spiel.css > /tmp/alt884/spiel.css
     DROSSEL=4  CPU-Drosselung für den ganzen Lauf (E misst immer mit ≥ 4×)
     BILD=/pfad/vorsilbe       speichert die Fotos aus G (-ganz.png, -nah.png)
     VERGLEICH=/pfad/vorsilbe  vergleicht G zusätzlich mit diesen Fotos
   EHRLICH: Den Absturz auf dem iPhone kann diese Sonde nicht nachstellen –
   kein WebKit, kein iOS-Jetsam; Chromium legt Ebenen anders an, und der
   Speicher gerasterter Kacheln ist kopflos nicht messbar. Ebenen-Zahl und
   -Fläche (CSS-px) sind nur Stellvertreter. Gemessen wird, was 884
   herausnimmt: Leinwand-Umwälzung, gestapelte Animationen, eine volle
   Mischebene, Hauptthread-Arbeit vor dem Zoombeginn.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const ALT = process.env.ALT ? path.resolve(process.env.ALT) : "";
const QUELLE = Boolean(ALT || process.env.QUELLE);
const DROSSEL = Math.max(1, Number(process.env.DROSSEL || 1));
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".webp": "image/webp" };

let fehler = 0;
const roteTeile = {};
let teil = "";
const sage = (gut, was, zusatz) => {
  if (!gut) { fehler++; roteTeile[teil] = (roteTeile[teil] || 0) + 1; }
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const abschnitt = (t, titel) => { teil = t; console.log("\n" + t + "  " + titel + "\n"); };

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    /* Gegenprobe: nur spiel.js und spiel.css kommen aus dem ALT-Ordner, alles andere aus dem Baum. */
    const f = ALT && (p === "/spiel.js" || p === "/spiel.css") ? path.join(ALT, p) : path.join(WURZEL, p);
    if (!(f.startsWith(WURZEL) || (ALT && f.startsWith(ALT))) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  /* Ein Android-Telefon: Fingertipps statt Programm-Klicks (wie Sonde 709). */
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  const pg = await ctx.newPage();
  const konsolenFehler = [];
  pg.on("pageerror", (e) => konsolenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  /* Jede Leinwand, die je gezeichnet wird, merken (WeakRef: die Sonde hält sie nicht am Leben). */
  await pg.addInitScript(() => {
    window.__lw = [];
    const alt = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (a, b) {
      if (!this.__reg) { this.__reg = true; window.__lw.push({ ref: new WeakRef(this), cls: String(this.className || "(neu)") }); }
      return alt.call(this, a, b);
    };
  });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html" + (QUELLE ? "?quelle" : ""), { waitUntil: "domcontentloaded" });
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
    const altTon = window.DMA_SPIEL_BRUECKE.ton;
    window.DMA_SPIEL_BRUECKE.ton = (n, l) => { window.DMA_TONLOG.push({ name: n, wann: Math.round(performance.now()), weg: "ersatz" }); try { if (altTon) altTon(n, l); } catch (e) {} };
    /* Ab Fassung 645 meldet sich das Spiel in einer eigenen Zeile. */
    window.__spielMeldungen = window.__hinweise;
  });
  await pg.waitForTimeout(800);

  const tick = (ms) => pg.waitForTimeout(ms);
  const mitte = (sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
  const tippe = async (sel) => { await pg.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: "nearest" }); }, sel); const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };

  /* Das Dorf wie in Sonde 709, dazu das Bergwerk; klarer, heller Tag (Sonne 30° hoch: keine Abendröte). */
  await pg.evaluate(() => {
    const ich = window.__ich, jetzt = Date.now();
    ich.level = 12; ich.punkte = 900;
    ich.dorf = { muehle: { stufe: 2, lp: 40 }, baeckerei: { stufe: 2, lp: 40 }, schule: { stufe: 1, lp: 20 }, rathaus: { stufe: 3, lp: 60 }, schmiede: { stufe: 1, lp: 0 },
                 kuhstall: { stufe: 1, lp: 20 }, brauerei: { stufe: 2, lp: 40 }, bergwerk: { stufe: 2, lp: 40 } };
    ich.werk = {}; ich.volk = { arbeiter: 20, ritter: 0, quote: 80, berufe: { bauer: 2, mueller: 1 } };
    ich.dorf_ab = new Date(jetzt - 3600000).toISOString();
    window.__extra = Object.assign({}, window.__extra || {}, { spiel_markt_preise: () => ({ ok: true, preise: {} }), spiel_angebote_liste: () => ({ ok: true, angebote: [] }) });
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich = JSON.parse(JSON.stringify(ich)); S.schnellMenue = false; S.graben = false; S.dorfTeil = ""; S.dorfWahl = "";
    try { localStorage.removeItem("dma_spiel_makro"); localStorage.removeItem("dma_dorf_nah"); localStorage.setItem("dma_dorf_zeichen", "1"); } catch (e) {}
    S.dorfNah = null; S.dorfZeichen = null; S.dorfKarte = false;
    S.wetterTest = { code: 1, tag: true }; S.sonneTest = 30;
    window.__hinweise.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen(true);
  });
  await tick(900); await tippe('.sp-schnell [data-s="makro"]'); await tick(1500);
  const offen = await pg.evaluate(() => Boolean(document.querySelector(".sp-dl-rahmen .sp-dl-fenster canvas.sp-dl-mal")) && !document.querySelector(".sp-dl-neustadt"));
  console.log("Fassung unter Test: " + (ALT ? "ALT (" + ALT + ")" : QUELLE ? "Quellen (?quelle)" : "min/") + (DROSSEL > 1 ? ", Drossel " + DROSSEL + "×" : ""));
  if (!offen) { console.log("  FEHL das alte (gemalte) Dorf ist nicht offen – Abbruch"); await br.close(); srv.close(); process.exit(1); }

  const cdp = await ctx.newCDPSession(pg);
  await cdp.send("Performance.enable");
  await cdp.send("HeapProfiler.enable");
  if (DROSSEL > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: DROSSEL });
  const VP = 360 * 740;
  let ebenen = [], spitze = { n: 0, flaeche: 0 };
  const zeichnend = (l) => l.filter((x) => x.drawsContent);
  const flaecheVon = (l) => zeichnend(l).reduce((s, x) => s + x.width * x.height, 0);
  await cdp.send("LayerTree.enable");
  cdp.on("LayerTree.layerTreeDidChange", (e) => {
    if (!e.layers) return;
    ebenen = e.layers;
    const n = zeichnend(e.layers).length, fl = flaecheVon(e.layers);
    if (n > spitze.n) spitze.n = n;
    if (fl > spitze.flaeche) spitze.flaeche = fl;
  });
  const ruheEbenen = () => ({ n: zeichnend(ebenen).length, flaeche: flaecheVon(ebenen) });
  const bs = (fl) => (fl / VP).toFixed(2);
  const metr = async () => { const m = (await cdp.send("Performance.getMetrics")).metrics; const o = {}; m.forEach((x) => { o[x.name] = x.value; }); return o; };
  const gc = async () => { await cdp.send("HeapProfiler.collectGarbage"); await tick(300); await cdp.send("HeapProfiler.collectGarbage"); await tick(200); };
  const leinwaende = () => pg.evaluate(() => {
    const a = window.__lw.map((x) => ({ c: x.ref.deref(), cls: x.cls })).filter((x) => x.c);
    return { angelegt: window.__lw.length, karte: window.__lw.filter((x) => /sp-dl-karte-bild/.test(x.cls)).length, lebend: a.length, imDom: a.filter((x) => x.c.isConnected).length,
      losMitSpeicher: a.filter((x) => !x.c.isConnected && x.c.width * x.c.height > 0).map((x) => x.cls.split(" ")[0] + ":" + x.c.width + "x" + x.c.height) };
  });
  const nah = () => pg.evaluate(() => window.DMA_SPIEL.pruef.dorfNah());
  const zoom = async (n) => { await pg.evaluate((n) => { const P = window.DMA_SPIEL.pruef; if (P.dorfNah() !== n) P.dorfZoom(n, .5, .5); }, n); await tick(900); };
  /* Ein freier Punkt in der Wiese: 22 px Abstand zu jedem Haus und Knopf (Chrome rastet Fingertipps auf nahe Knöpfe ein). */
  const frei = (abX) => pg.evaluate((abX) => {
    const f = document.querySelector(".sp-dl-fenster").getBoundingClientRect();
    const hs = [...document.querySelectorAll(".sp-dl-haus-gemalt, .sp-dl-kompass, .sp-dw-schild, .sp-dl-ort, .sp-dl-minikarte, .sp-dl-uhr, .sp-dl-ortsschild, .sp-dl-feld, .sp-dl-bahnknopf, button")].map((e) => e.getBoundingClientRect()).filter((b) => b.width);
    for (let y = f.top + f.height * .3; y < f.bottom - 20; y += 5) for (let x = f.left + f.width * abX; x < f.right - 44; x += 5) {
      if (!hs.some((b) => x >= b.left - 22 && x <= b.right + 22 && y >= b.top - 22 && y <= b.bottom + 22)) { const e = document.elementFromPoint(x, y); if (e && e.matches("canvas.sp-dl-mal")) return { x, y, fx: (x - f.left) / f.width, fy: (y - f.top) / f.height }; }
    }
    return null;
  }, abX == null ? .3 : abX);
  const doppeltipp = async (p) => { await pg.touchscreen.tap(p.x, p.y); await tick(110); await pg.touchscreen.tap(p.x, p.y); };
  await pg.evaluate(() => document.querySelector(".sp-dl-rahmen").scrollIntoView({ block: "center", behavior: "instant" })); await tick(800);

  /* Einmal hinein und wieder heraus (wie man das Dorf benutzt), dabei die Ruhe-Ebenen messen: die Spitze über 1,5 s
     Ruhe (Leute, Vögel und Zug kommen und gehen – ein einzelner Blick wäre zu streng gegen die Spitze in F). */
  const ruheSpitze = async () => { spitze = { n: 0, flaeche: 0 }; await tick(1500); const r = ruheEbenen(); return { n: Math.max(spitze.n, r.n), flaeche: Math.max(spitze.flaeche, r.flaeche) }; };
  await zoom(true);
  const ruheNah = await ruheSpitze();
  await zoom(false);
  const ruheGanz = await ruheSpitze();
  console.log("Ruhe: ganz " + ruheGanz.n + " Ebenen / " + bs(ruheGanz.flaeche) + " Bildschirme · nah " + ruheNah.n + " Ebenen / " + bs(ruheNah.flaeche) + " Bildschirme");

  abschnitt("A", "20 DOPPELTIPPS IN DIE FREIE WIESE");
  await gc();
  const m0 = await metr(), lw0 = await leinwaende();
  const N = 20, waehrend = [];
  let umgeschaltet = 0, ohnePunkt = 0;
  for (let i = 0; i < N; i++) {
    const p = await frei(); if (!p) { ohnePunkt++; continue; }
    const vor = await nah();
    await doppeltipp(p);
    spitze = { n: 0, flaeche: 0 };
    await tick(160);   /* mitten in der Animation (320 ms) */
    waehrend.push({ hinein: !vor, n: spitze.n, flaeche: spitze.flaeche });
    await tick(700);
    if ((await nah()) !== vor) umgeschaltet++;
  }
  sage(umgeschaltet === N && ohnePunkt === 0, "alle " + N + " Doppeltipps schalten um (ganz ↔ nah)", umgeschaltet + " von " + N + (ohnePunkt ? ", " + ohnePunkt + "× kein freier Punkt" : ""));
  if (await nah()) await zoom(false);
  await tick(600);
  const lwVorGC = await leinwaende();
  await gc();
  const m1 = await metr(), lw1 = await leinwaende();

  abschnitt("B", "LEINWÄNDE: KEINE NEUE KARTE BEI JEDEM HINEINZOOMEN");
  console.log("  Leinwände vorher " + JSON.stringify(lw0) + "\n  nach 20 Doppeltipps (vor GC) " + JSON.stringify(lwVorGC) + "\n  nach GC " + JSON.stringify(lw1));
  sage(lw1.karte - lw0.karte <= 1, "10× hineingezoomt: höchstens 1 neue Leinwand für die kleine Karte (bis 883: eine je Hineinzoomen)", "+" + (lw1.karte - lw0.karte) + " (insgesamt angelegt +" + (lw1.angelegt - lw0.angelegt) + ")");
  sage(lw1.lebend <= lw0.lebend, "nach GC leben nicht mehr Leinwände als vorher", lw0.lebend + " → " + lw1.lebend);

  abschnitt("C", "KEINE GESTAPELTEN ZOOM-ANIMATIONEN");
  const stapel = await pg.evaluate(async () => {
    const P = window.DMA_SPIEL.pruef;
    for (let k = 0; k < 3; k++) { P.dorfZoom(!P.dorfNah(), .4, .5); await new Promise((r) => setTimeout(r, 90)); }
    const l = document.querySelector(".sp-dl-fenster .sp-dorfland");
    return { laufend: l.getAnimations().filter((a) => a.playState === "running").length };
  });
  await tick(900);
  const nachStapel = await pg.evaluate(() => { const r = document.querySelector(".sp-dl-rahmen"), l = r.querySelector(".sp-dorfland"), f = r.querySelector(".sp-dl-fenster");
    return { nah: window.DMA_SPIEL.pruef.dorfNah(), klasseNah: r.classList.contains("sp-dl-nah"), laufend: l.getAnimations().filter((a) => a.playState === "running").length, breit: l.clientWidth >= f.clientWidth * 1.9 }; });
  sage(stapel.laufend <= 1, "3× zoomen in 270 ms: höchstens eine laufende Zoom-Animation auf dem Dorfbild (bis 883: drei übereinander)", "laufend " + stapel.laufend);
  sage(nachStapel.nah && nachStapel.klasseNah && nachStapel.breit && nachStapel.laufend === 0, "danach ruhig und richtig: nah (dreimal umgeschaltet), doppelt so breit, keine Animation mehr", JSON.stringify(nachStapel));
  await zoom(false); await tick(400);

  abschnitt("D", "ABEND-EBENE NUR, WENN SIE ETWAS TUT");
  /* Sichtbar UND gemischt: das Element wird gezeichnet (checkVisibility) und hat eine andere Mischart als „normal". */
  const mischen = () => pg.evaluate(() => {
    let n = 0;
    document.querySelectorAll(".sp-dl-rahmen, .sp-dl-rahmen *").forEach((e) => {
      const sicht = e.checkVisibility ? e.checkVisibility() : e.getClientRects().length > 0;
      if (!sicht) return;
      if (getComputedStyle(e).mixBlendMode !== "normal") n++;
      if (getComputedStyle(e, "::after").content !== "none" && getComputedStyle(e, "::after").mixBlendMode !== "normal") n++;
    });
    const d = document.querySelector(".sp-dl-daemmer");
    return { mischebenen: n, daemmer: d ? { stil: d.getAttribute("style"), klasse: d.className, sichtbar: d.checkVisibility() } : null };
  });
  const tagGanz = await mischen();
  sage(tagGanz.mischebenen === 0, "heller Tag (Sonne 30°), ganzes Dorf: keine Mischebene über dem Bild (bis 883: soft-light + multiply über dem ganzen Dorf)", JSON.stringify(tagGanz));
  await zoom(true); await tick(900);
  const tagNah = await mischen();
  const flaecheAus = ruheEbenen();
  await pg.evaluate(() => { document.querySelectorAll(".sp-dl-daemmer").forEach((e) => { e.style.display = "block"; }); });
  await tick(1200);
  const flaecheEin = ruheEbenen();
  await pg.evaluate(() => { document.querySelectorAll(".sp-dl-daemmer").forEach((e) => { e.style.display = ""; }); });
  await tick(600);
  sage(tagNah.mischebenen === 0, "heller Tag, nah dran: keine Mischebene", JSON.stringify(tagNah));
  sage(flaecheEin.flaeche - flaecheAus.flaeche >= .5 * VP, "nah dran: die Ebenenfläche ist mindestens 0,5 Bildschirme kleiner als mit eingeblendeter Abend-Ebene",
    bs(flaecheEin.flaeche) + " → " + bs(flaecheAus.flaeche) + " Bildschirme (" + flaecheEin.n + " → " + flaecheAus.n + " Ebenen)");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.sonneTest = 1.5; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(600);
  const abend = await pg.evaluate(() => { const d = document.querySelector(".sp-dl-daemmer"); const cs = d && getComputedStyle(d);
    return d ? { glut: parseFloat(cs.getPropertyValue("--glut")), dunkel: parseFloat(cs.getPropertyValue("--dunkel")), sichtbar: d.checkVisibility(), misch: cs.mixBlendMode, klasse: d.className } : null; });
  sage(abend && abend.sichtbar && abend.glut > .8 && abend.misch === "soft-light", "Abendrot (Sonne 1,5°): die Abend-Ebene ist da und färbt (wie Fassung 804)", JSON.stringify(abend));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.sonneTest = 30; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(600);
  const wiederTag = await mischen();
  sage(wiederTag.mischebenen === 0, "wieder Tag: die Abend-Ebene ist wieder aus", JSON.stringify(wiederTag.daemmer));
  await zoom(false); await tick(400);

  abschnitt("E", "DER ZOOM BEGINNT SOFORT (CPU 4× GEDROSSELT)");
  await pg.evaluate(() => {
    window.__lat = []; window.__latBild = []; let los = 0;
    window.addEventListener("pointerup", () => { los = performance.now(); }, true);
    const alt = Element.prototype.animate;
    Element.prototype.animate = function (k, o) {
      if (this.classList && this.classList.contains("sp-dorfland") && los) {
        const t = performance.now(), l0 = los; window.__lat.push(t - l0); los = 0;
        /* zur Auskunft: der Anfang des Bildes, in dem die Bewegung startet */
        requestAnimationFrame(() => window.__latBild.push(performance.now() - l0));
      }
      return alt.call(this, k, o);
    };
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: Math.max(4, DROSSEL) });
  for (let i = 0; i < 8; i++) { const p = await frei(); if (!p) continue; await doppeltipp(p); await tick(1100); }
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: DROSSEL });
  const lat = await pg.evaluate(() => ({ a: window.__lat.slice().sort((x, y) => x - y), b: window.__latBild.slice().sort((x, y) => x - y) }));
  const median = (a) => (a.length ? a[Math.floor(a.length / 2)] : Infinity);
  sage(lat.a.length >= 6 && median(lat.a) <= 35, "Loslassen → Zoombeginn im Median ≤ 35 ms (bis 883: rund 68 ms, weil erst die ganze Leiste neu gebaut wurde)",
    "Median " + median(lat.a).toFixed(1) + " ms, alle " + JSON.stringify(lat.a.map((x) => Math.round(x))) + " · bis zum Bild (Auskunft): Median " + median(lat.b).toFixed(1) + " ms");
  if (await nah()) await zoom(false);
  await tick(600);

  abschnitt("F", "SCHUTZ: KEINE EBENEN-EXPLOSION, KEIN WACHSENDER SPEICHER");
  const maxN = Math.max(...waehrend.map((w) => w.n)), maxFl = Math.max(...waehrend.map((w) => w.flaeche));
  sage(waehrend.length >= 18 && maxN <= ruheNah.n + 6, "mitten in der Animation höchstens 6 Ebenen mehr als in Ruhe „nah“", maxN + " ≤ " + ruheNah.n + " + 6");
  sage(maxFl <= ruheNah.flaeche * 1.05, "mitten in der Animation höchstens 5 % mehr Ebenenfläche als in Ruhe „nah“", bs(maxFl) + " ≤ " + bs(ruheNah.flaeche * 1.05) + " Bildschirme");
  sage(m1.Nodes - m0.Nodes <= 60, "nach 20 Doppeltipps und GC: höchstens 60 Knoten mehr", m0.Nodes + " → " + m1.Nodes);
  sage(m1.JSHeapUsedSize - m0.JSHeapUsedSize <= 2e6, "nach 20 Doppeltipps und GC: JS-Speicher höchstens 2 MB mehr", (m0.JSHeapUsedSize / 1e6).toFixed(1) + " → " + (m1.JSHeapUsedSize / 1e6).toFixed(1) + " MB");

  abschnitt("H", "NACH DEM ZOOM STIMMT ALLES (KARTE, KOMPASS, TIPP-TEXT, STATION)");
  const stand = () => pg.evaluate(() => {
    const r = document.querySelector(".sp-dl-rahmen"), f = r.querySelector(".sp-dl-fenster"), l = f.querySelector(".sp-dorfland");
    const mk = r.querySelector(".sp-dl-minikarte"), kb = mk && mk.querySelector("canvas.sp-dl-karte-bild"), k = r.querySelector(".sp-dl-kompass");
    let bunt = 0;
    try { if (kb && kb.width) { const d = kb.getContext("2d").getImageData(0, 0, kb.width, kb.height).data; for (let i = 0; i < d.length; i += 4 * 211) if (d[i + 3] > 0) bunt++; } } catch (e) {}
    const tipp = document.querySelector(".sp-dl-tipp-gemalt");
    return { nah: window.DMA_SPIEL.pruef.dorfNah(), klasse: r.classList.contains("sp-dl-nah") ? "nah" : r.classList.contains("sp-dl-ganz") ? "ganz" : "?",
      breit: Math.round(l.clientWidth / f.clientWidth * 100) / 100, karte: Boolean(mk), karteBild: bunt, zeichen: (k.querySelector(".sp-dl-lupe-zeichen") || {}).textContent, n: k.dataset.n, an: k.classList.contains("sp-an"),
      tipp: tipp ? tipp.textContent : null, station: Boolean(document.querySelector(".sp-dl-station")), fw: f.clientWidth, fh: f.clientHeight, lw: l.clientWidth, sl: f.scrollLeft, st: f.scrollTop };
  });
  const stimmt = (s) => s.nah === (s.klasse === "nah") && (s.nah ? s.breit >= 1.9 && s.karte && s.karteBild > 50 && s.zeichen === "−" && s.n === "0" && s.an
    : Math.abs(s.breit - 1) < .02 && !s.karte && s.zeichen === "+" && s.n === "1" && !s.an)
    && (s.tipp == null || (s.nah ? /^Wische/.test(s.tipp) : /Lupe holt dich/.test(s.tipp)));
  let p = await frei(.5);
  if (p) { await doppeltipp(p); await tick(900); }
  let s = await stand();
  const zmitte = { fx: (s.sl + s.fw / 2) / s.lw, fy: (s.st + s.fh / 2) / (s.lw * .625) };
  sage(p && s.nah && stimmt(s), "Doppeltipp hinein: kleine Karte gemalt, Kompass „−“, Tipp-Text „Wische …“", JSON.stringify(s));
  sage(p && Math.abs(zmitte.fx - p.fx) < .15, "genau dort, wo getippt wurde (wie Sonde 709)", JSON.stringify({ p, zmitte }));
  p = await frei();
  if (p) { await doppeltipp(p); await tick(900); }
  s = await stand();
  sage(p && !s.nah && stimmt(s), "Doppeltipp heraus: keine kleine Karte, Kompass „+“, Tipp-Text „… die Lupe holt dich näher ran“", JSON.stringify(s));
  await tippe(".sp-dl-kompass"); await tick(900);
  s = await stand();
  sage(s.nah && stimmt(s), "Kompass (Lupe) hinein: dasselbe wie beim Doppeltipp", JSON.stringify(s));
  await tippe(".sp-dl-kompass"); await tick(900);
  s = await stand();
  sage(!s.nah && stimmt(s), "Kompass (Lupe) heraus", JSON.stringify(s));
  /* Ein offenes Haus schließt der Doppeltipp (dorfDoppelPruefen leert S.dorfWahl) – auch wenn das Menü erst nach der Bewegung angeglichen wird. */
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = "baeckerei"; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(300);
  const stationAuf = await pg.evaluate(() => Boolean(document.querySelector(".sp-dl-station")));
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.dorfWahl = ""; window.DMA_SPIEL.pruef.dorfZoom(true, .5, .5); });
  await tick(900);
  s = await stand();
  sage(stationAuf && !s.station && s.nah && stimmt(s), "offene Station (Bäckerei) + Zoom: die Station ist danach zu, alles andere stimmt", JSON.stringify({ stationAuf, station: s.station, nah: s.nah }));
  await zoom(false); await tick(400);

  abschnitt("G", "DAS BILD BLEIBT GLEICH");
  const { PNG } = require("/tmp/claude-0/node_modules/pngjs");
  /* Alles Bewegte anhalten bzw. ausblenden: Animationen auf Anfang, Zug-Takt aus, Leute, Fuhrwerk, Vögel, Rauch, die Zug-Ebene (Zug, Dampf, Angler – per Skript bewegt), Uhr. */
  const ruhig = () => pg.evaluate(() => {
    document.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = 0; } catch (e) {} });
    const B = window.DMA_SPIEL.pruef.bahn && window.DMA_SPIEL.pruef.bahn.B; if (B && B.raf) { cancelAnimationFrame(B.raf); B.raf = 0; }
    if (!document.getElementById("sonde884ruhig")) { const st = document.createElement("style"); st.id = "sonde884ruhig";
      st.textContent = ".sp-dl-mensch, .sp-dl-fuhrwerk, .sp-dw-voegel, .sp-dl-qualm, .sp-dl-bahn, .sp-dl-uhr { visibility: hidden !important; }"; document.head.appendChild(st); }
  });
  const foto = async () => { await ruhig(); await tick(300); return PNG.sync.read(await (await pg.$(".sp-dl-fenster")).screenshot()); };
  const vergleich = (a, b) => { if (a.width !== b.width || a.height !== b.height) return { max: 999, anders: -1, groesse: a.width + "x" + a.height + " / " + b.width + "x" + b.height };
    /* wo: Rechteck der Abweichungen über 3/255, in CSS-px innerhalb des Fensters */
    let n = 0, max = 0, bx = [1e9, 1e9, -1, -1];
    for (let i = 0; i < a.data.length; i += 4) { const d = Math.max(Math.abs(a.data[i] - b.data[i]), Math.abs(a.data[i + 1] - b.data[i + 1]), Math.abs(a.data[i + 2] - b.data[i + 2])); if (d > 0) n++; if (d > max) max = d;
      if (d > 3) { const x = (i / 4) % a.width, y = Math.floor(i / 4 / a.width); bx = [Math.min(bx[0], x), Math.min(bx[1], y), Math.max(bx[2], x), Math.max(bx[3], y)]; } }
    return Object.assign({ max, anders: n, von: a.width * a.height }, bx[2] >= 0 ? { wo: bx.map((v) => Math.round(v / 2.75)).join(",") } : {}); };
  for (const n of [false, true]) {
    const name = n ? "nah" : "ganz";
    await zoom(n); await tick(400);
    const a = await foto(), a2 = await foto();
    await pg.evaluate(() => { document.querySelectorAll(".sp-dl-daemmer").forEach((e) => { e.style.display = "block"; }); });
    const b = await foto();
    await pg.evaluate(() => { document.querySelectorAll(".sp-dl-daemmer").forEach((e) => { e.style.display = ""; }); });
    const ruhe = vergleich(a, a2), mitEbene = vergleich(a, b);
    sage(ruhe.max === 0, name + ": zweimal fotografiert ist zweimal dasselbe (die Messung selbst ist ruhig)", JSON.stringify(ruhe));
    sage(mitEbene.max <= 3, name + ": gleich dem Bild mit eingeblendeter Abend-Ebene – kein Bildpunkt um mehr als 3/255 anders", JSON.stringify(mitEbene));
    if (process.env.BILD) fs.writeFileSync(process.env.BILD + "-" + name + ".png", PNG.sync.write(a));
    if (process.env.VERGLEICH) {
      const datei = process.env.VERGLEICH + "-" + name + ".png";
      if (fs.existsSync(datei)) { const v = vergleich(a, PNG.sync.read(fs.readFileSync(datei))); sage(v.max <= 3, name + ": gleich dem Foto des Vergleichslaufs (" + datei + ") – höchstens 3/255", JSON.stringify(v)); }
      else sage(false, name + ": Vergleichsfoto fehlt", datei);
    }
    await pg.evaluate(() => { document.getAnimations().forEach((x) => { try { x.play(); } catch (e) {} }); const st = document.getElementById("sonde884ruhig"); if (st) st.remove(); });
  }
  await zoom(false);

  teil = "";
  sage(konsolenFehler.length === 0, "keine Seitenfehler", konsolenFehler.join(" | "));
  console.log("\nSonde 884-zoom (" + (ALT ? "ALT" : QUELLE ? "Quellen" : "min") + "): " + (fehler ? fehler + " rot (" + Object.keys(roteTeile).map((k) => (k || "Rest") + ": " + roteTeile[k]).join(", ") + ")." : "alles grün."));
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
