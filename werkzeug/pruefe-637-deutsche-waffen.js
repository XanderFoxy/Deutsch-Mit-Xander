#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 637: DEUTSCHE WURFSACHEN UND ESSEN
   ---------------------------------------------------------------------
   XANDER (Funk 113): „Bierkrug Und Bretzeln Die Man Nach Dem Anderen
   Schießen Kann Und Typisch Deutsche Sachen Bratwurst Und Sauerkraut
   Einmal Zum Essen Und Einmal Zum Werfen Mit Entsprechenden Geräuschen".
   (25.09.): „Spätzle-Kanone … Sauerkraut und dann soll das richtig
   eklig … runterrutschen und dann ist seine Sicht ein bisschen
   beeinträchtigt".
   Die Zahlen rechnet der Server (spiel_treffer, spiel_kaufen,
   spiel_essen; Probelauf mit Rollback: ohne Vorrat kein Wurf, Essen bei
   voll abgelehnt, +15 bei 70 LP). Hier der BROWSER:
     · jede neue Sache ist gezeichnet und hat ihren eigenen Trefferton
     · Bratwurst und Sauerkraut stehen mit Anzahl in der Leiste
     · ein Bratwurstwurf geht mit p_waffe an den Server, das Paket trägt
       die Waffe mit
     · Spätzle-Kanone: fünf Spätzle
     · Sauerkraut rutscht am Bild nach unten; beim Getroffenen liegen
       Fäden über der Bühne, zweimal tippen wischt sie weg, der
       Scheibenwischer wischt von selbst
     · das Herz isst zuerst, wenn nur wenig fehlt
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
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
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
                  pflaster: 3, traenke: 1, waffen: ["kartoffel", "zwille", "bogen", "laser", "huehnerwerfer", "brezel", "bierkrug", "spaetzle"], mission: null, mana: 40, mana_max: 100, mitspielen: true,
                  level: 3, xp: 260, xp_stufe: 300 - 200, xp_naechste: 300, skill_frei: 1, skills: { zaehigkeit: 1 }, training: null,
                  ladung: 40, helm: 0, brust: 0, helm_stufe: 1, helm_halt: 10, brust_stufe: 0, brust_halt: 0,
                  vorraete: { bratwurst: 2, sauerkraut: 1 }, tag_serie: 2, geschenk_offen: true, daemon_bis: null };
    const bea = { id: beaId, name: "Bea", lp: 50, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, haustier: "fellmonster",
                  haustier_leben: 30, geschuetz: true, mana: 10, mana_max: 100, mitspielen: true,
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
      else if (name === "spiel_essen") data = Object.assign({}, ich, { ok: true, geheilt: 10, gegessen: args.p_ding });
      else if (name === "spiel_wischer") data = { ok: true };
      else if (name === "spiel_tagesgeschenk") { ich.geschenk_offen = false; data = Object.assign({}, ich, { ok: true, punkte_plus: 16, bratwurst_plus: 1, serie: 3, pflaster_plus: 1 }); }
      else if (name === "spiel_seite_abholen") data = Object.assign({}, ich, { ok: true, muenzen: 4, bratwurst_plus: 0 });
      else if (name === "spiel_superkraft") { ich.ladung = 0; ich.daemon = true; ich.daemon_bis = new Date(Date.now() + 45000).toISOString(); data = Object.assign({ ok: true }, ich); }
      else if (name === "spiel_trainieren") { ich.training = { skill: args.p_skill, stufe: 1, bis: new Date(Date.now() + 300000).toISOString() }; ich.skill_frei = 0; data = Object.assign({ ok: true }, ich); }
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
  });
  await pg.waitForTimeout(800);

  console.log("\nGEZEICHNET UND MIT EIGENEM TREFFERTON\n");
  const bilder = await pg.evaluate(() => ["brezel", "bierkrug", "spaetzle", "bratwurst", "sauerkraut"].map((w) => {
    const s = window.DMA_SPIEL.pruef.geschossSvg(w); return w + ":" + (s.length > 100 ? "ja" : "nein");
  }));
  sage(bilder.every((b) => /ja$/.test(b)), "Brezel, Bierkrug, Spätzle, Bratwurst, Sauerkraut sind gezeichnet", bilder.join(" "));
  const toene = await pg.evaluate(async () => {
    const aus = {};
    for (const w of ["brezel", "bierkrug", "spaetzle", "bratwurst", "sauerkraut"]) {
      window.DMA_TONLOG = [];
      const d = window.DMA_SPIEL.pruef.geschossZeigen("ich", "bea", w, 0, 0, "");
      await new Promise((r) => setTimeout(r, d + 200));
      aus[w] = (window.DMA_TONLOG || []).map((t) => t.name || t).join(",");
    }
    return aus;
  });
  const soll = { brezel: "brezelknack", bierkrug: "krugklirr", spaetzle: "platsch", bratwurst: "wurstklatsch", sauerkraut: "krautmatsch" };
  Object.keys(soll).forEach((w) => sage(toene[w].includes(soll[w]), w + " → Treffer „" + soll[w] + "“", toene[w]));
  sage(toene.spaetzle.includes("spaetzlesalve"), "die Spätzle-Kanone klingt nach Salve", toene.spaetzle);

  console.log("\nSPÄTZLE-SALVE\n");
  const salve = await pg.evaluate(async () => {
    let max = 0; const t0 = performance.now();
    window.DMA_SPIEL.pruef.geschossZeigen("ich", "bea", "spaetzle", 0, 0, "");
    while (performance.now() - t0 < 900) { max = Math.max(max, document.querySelectorAll(".sp-g-spaetzle").length); await new Promise((r) => setTimeout(r, 30)); }
    return max;
  });
  sage(salve === 5, "fünf Spätzle fliegen", salve + " gleichzeitig gesehen");

  console.log("\nVORRÄTE IN DER LEISTE, BRATWURST WERFEN\n");
  /* FASSUNG 641 — alle Waffen samt Vorräten stehen im Menü (Reiter Waffen). */
  const leiste = await pg.evaluate(() => {
    const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = true; S.schnellReiter = "waffen";
    window.DMA_SPIEL.pruef.schnellZeichnen();
    const l = [...document.querySelectorAll('.sp-schnellmenue [data-s="waehle"]')].map((b) => b.dataset.w + (b.querySelector("small") ? "(" + b.querySelector("small").textContent + ")" : ""));
    S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen();
    return l;
  });
  sage(leiste.includes("bratwurst(2)") && leiste.includes("sauerkraut(1)"), "Bratwurst 2 und Sauerkraut 1 stehen im Waffen-Menü", leiste.join(","));
  sage(["brezel", "bierkrug", "spaetzle"].every((w) => leiste.includes(w)), "gekaufte Brezel, Bierkrug, Spätzle-Kanone auch");
  const wurf = await pg.evaluate(async () => {
    window.__rufe.length = 0; window.__raus.length = 0;
    const S = window.DMA_SPIEL.pruef.zustand(); S.waffe = "bratwurst";
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]');
    window.DMA_SPIEL.tippAufPlatz(k, { id: "bea", name: "Bea", leer: false, ich: false, nummer: Number(k.dataset.lcPlatz) }, null);
    await new Promise((r) => setTimeout(r, 1300));
    const ruf = window.__rufe.find((r) => r.name === "spiel_treffer");
    const paket = window.__raus.find((p) => p.ereignis === "treffer");
    return { waffe: ruf ? ruf.args.p_waffe : "", paket: paket ? paket.waffe : "", rest: S.ich.vorraete.bratwurst };
  });
  sage(wurf.waffe === "bratwurst", "der Server bekommt p_waffe = bratwurst", wurf.waffe);
  sage(wurf.paket === "bratwurst", "das Treffer-Paket trägt die Waffe", wurf.paket);
  sage(wurf.rest === 1, "danach noch 1 Bratwurst", String(wurf.rest));

  console.log("\nSAUERKRAUT RUTSCHT — UND NIMMT MIR DIE SICHT\n");
  const kraut = await pg.evaluate(async () => {
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich.wischer = 0;
    window.DMA_SPIEL.empfangen({ ereignis: "treffer", von: "bea", zielChat: "bea", schaden: 4, zone: "herz", waffe: "sauerkraut" });
    const beaSicht = Boolean(document.querySelector(".sp-kraut-sicht"));
    window.DMA_SPIEL.empfangen({ ereignis: "treffer", von: "bea", zielChat: "ich", schaden: 4, zone: "herz", waffe: "sauerkraut" });
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-kraut-rutsch');
    const y = () => new DOMMatrix(getComputedStyle(k).transform).m42 / k.getBoundingClientRect().height;
    await new Promise((r) => setTimeout(r, 400)); const frueh = y();
    await new Promise((r) => setTimeout(r, 3900)); const spaet = y();
    const sicht = document.querySelector(".sp-kraut-sicht");
    const da = Boolean(sicht);
    if (sicht) sicht.click();
    await new Promise((r) => setTimeout(r, 100));
    const nachEins = Boolean(document.querySelector(".sp-kraut-sicht:not(.sp-kraut-weg)"));
    if (sicht) sicht.click();
    await new Promise((r) => setTimeout(r, 600));
    return { beaAmBild: Boolean(document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-kraut')), beaSicht, frueh, spaet, da, nachEins,
             weg: !document.querySelector(".sp-kraut-sicht") };
  });
  /* Zum Anschauen: BILD=datei.png node werkzeug/pruefe-637-deutsche-waffen.js */
  if (process.env.BILD) {
    await pg.evaluate(() => { window.DMA_SPIEL.pruef.krautZeigen("ich"); window.DMA_SPIEL.pruef.krautZeigen("bea"); });
    await pg.waitForTimeout(1500);
    const r = await pg.evaluate(() => { const b = document.getElementById("lcPlaetze").getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: Math.min(b.height, 200) }; });
    await pg.screenshot({ path: process.env.BILD, clip: r });
    await pg.evaluate(() => document.querySelectorAll(".sp-kraut-sicht").forEach((x) => x.remove()));
  }
  sage(kraut.beaAmBild && !kraut.beaSicht, "Bea getroffen: Kraut an IHREM Bild, meine Sicht bleibt frei");
  sage(kraut.spaet - kraut.frueh > 0.4, "das Kraut rutscht am Bild nach unten", "von " + kraut.frueh.toFixed(2) + " auf " + kraut.spaet.toFixed(2) + " Bildhöhen");
  sage(kraut.da, "ich getroffen: Krautfäden über meiner Bühne");
  sage(kraut.nachEins && kraut.weg, "einmal tippen: halb weg, zweimal: ganz weg");
  const wischer = await pg.evaluate(async () => {
    const S = window.DMA_SPIEL.pruef.zustand(); S.ich.wischer = 2; window.__rufe.length = 0;
    window.DMA_SPIEL.pruef.krautZeigen("ich");
    await new Promise((r) => setTimeout(r, 2100));
    return { weg: !document.querySelector(".sp-kraut-sicht"), ruf: window.__rufe.some((r) => r.name === "spiel_wischer") };
  });
  sage(wischer.weg && wischer.ruf, "mit Scheibenwischer wischt es sich von selbst weg", JSON.stringify(wischer));

  console.log("\nDAS HERZ ISST ZUERST\n");
  const iss = await pg.evaluate(async () => {
    const S = window.DMA_SPIEL.pruef.zustand();
    S.ich.lp = S.ich.lp_max - 12; S.ich.kaputt = false; S.ich.vorraete = { bratwurst: 1, sauerkraut: 1 };
    window.__rufe.length = 0; window.DMA_TONLOG = [];
    window.DMA_SPIEL.pruef.schnellZeichnen();
    document.querySelector('.sp-schnell [data-s="heilen"]').click();
    await new Promise((r) => setTimeout(r, 300));
    const r1 = window.__rufe.find((r) => r.name === "spiel_essen" || r.name === "spiel_heilen");
    S.ich.lp = S.ich.lp_max - 40; window.__rufe.length = 0;
    window.DMA_SPIEL.pruef.schnellZeichnen();
    document.querySelector('.sp-schnell [data-s="heilen"]').click();
    await new Promise((r) => setTimeout(r, 300));
    const r2 = window.__rufe.find((r) => r.name === "spiel_essen" || r.name === "spiel_heilen");
    return { r1: r1 ? r1.name + ":" + (r1.args.p_ding || r1.args.p_art) : "", r2: r2 ? r2.name + ":" + (r2.args.p_ding || r2.args.p_art) : "",
             ton: (window.DMA_TONLOG || []).map((t) => t.name || t).join(",") };
  });
  sage(iss.r1 === "spiel_essen:bratwurst", "12 LP fehlen → Bratwurst essen", iss.r1);
  sage(/mampf/.test(iss.ton), "man hört es schmatzen", iss.ton);
  sage(iss.r2 === "spiel_heilen:pflaster" || iss.r2 === "spiel_heilen:trank", "40 LP fehlen → Pflaster/Trank statt Wurst", iss.r2);

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 637 im Browser: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
