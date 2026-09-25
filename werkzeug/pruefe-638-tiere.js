#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 638: TIERE — FÜTTERN, AUFWERTEN, FLIEGEN, FESTBEISSEN
   ---------------------------------------------------------------------
   XANDER (25.09.): „noch mehr Monster und diese kleinen Drachen … viel
   süßer … wie ein kleiner Baby Drachen … eins vom Boden eins für die
   Luft … Tiere upgraden … krank oder schwach aber man kann sie wieder
   aufpäppeln … füttern … mit dem deutschen Essen … richtig beißen …
   fest beißen und … zerren … Chihuahua Knurren".
   Die Zahlen rechnet der Server (spiel_treffer, spiel_kaufen,
   spiel_fuettern; Probelauf mit Rollback: Tier bleibt bei 0 Kraft,
   Boden- und Flugtier wehren beide ab, Fellmonster Stufe 2 kuschelt +3,
   Füttern +12, satt wird abgelehnt). Hier der BROWSER:
     · Bea hat einen Chihuahua (Boden) und einen Babydrachen (Luft):
       der Drache schwebt rechts oben NEBEN dem Bild, der Chihuahua sitzt
       rechts unten
     · ein schwaches Tier (0 Kraft) ist blass
     · der Chihuahua beißt sich fest und zerrt: knurrt, zerrt mit Ton,
       ruckt hin und her, das Bild des Angreifers ruckt mit
     · der Babydrache stößt von oben herab bis ans Gesicht
     · Reiter „Tiere": füttern, aufwerten, ein Flugtier holen
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
                  vorraete: { bratwurst: 2, sauerkraut: 1 }, haustier: "fellmonster", haustier_leben: 5, haustier_max: 40, haustier_stufe: 2,
                  flugtier: null, flugtier_leben: 0, flugtier_max: 25, flugtier_stufe: 1, tag_serie: 2, geschenk_offen: true, daemon_bis: null };
    const bea = { id: beaId, name: "Bea", lp: 50, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, haustier: "chihuahua",
                  haustier_leben: 20, haustier_max: 30, haustier_stufe: 1, flugtier: "drache", flugtier_leben: 25, flugtier_max: 25, flugtier_stufe: 1, geschuetz: true, mana: 10, mana_max: 100, mitspielen: true,
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
      else if (name === "spiel_fuettern") data = Object.assign({}, ich, { ok: true, plus: 12, welches: args.p_welches });
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

  console.log("\nBODEN UND LUFT AM BILD\n");
  const lage = await pg.evaluate(() => {
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]');
    const kr = k.querySelector(".lc-kreis").getBoundingClientRect();
    const cx = kr.left + kr.width / 2, cy = kr.top + kr.height / 2, r = kr.width / 2;
    const mitte = (sel) => { const e = k.querySelector(sel + " .sp-tier-koerper"); if (!e) return null; const b = e.getBoundingClientRect(); return { x: (b.left + b.width / 2 - cx) / r, y: (b.top + b.height / 2 - cy) / r }; };
    return { boden: mitte(".sp-tier"), luft: mitte(".sp-flugtier"), bodenArt: (k.querySelector(".sp-tier") || {}).className || "", luftArt: (k.querySelector(".sp-flugtier") || {}).className || "" };
  });
  sage(/chihuahua/.test(lage.bodenArt) && lage.boden && lage.boden.x > 0.4 && lage.boden.y > 0.4, "Chihuahua sitzt rechts unten", JSON.stringify(lage.boden));
  sage(/drache/.test(lage.luftArt) && lage.luft && lage.luft.x > 0.5 && lage.luft.y < -0.6, "Babydrache schwebt rechts oben am Rand", JSON.stringify(lage.luft));
  const schwach = await pg.evaluate(() => {
    const S = window.DMA_SPIEL.pruef.zustand(), bea = Object.values(S.stand).find((s) => s && s.name === "Bea");
    bea.haustier_leben = 0; window.DMA_SPIEL.pruef.zeichnen();
    const cls = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-tier').className;
    bea.haustier_leben = 20; window.DMA_SPIEL.pruef.zeichnen();
    return cls;
  });
  sage(/sp-tier-schwach/.test(schwach), "bei 0 Kraft ist das Tier schwach (blass), bleibt aber da", schwach);

  /* Zum Anschauen: BILD=datei.png (Bühne) und BILD2=datei.png (Reiter Tiere) */
  if (process.env.BILD) {
    const r = await pg.evaluate(() => { const b = document.getElementById("lcPlaetze").getBoundingClientRect(); return { x: b.left, y: Math.max(0, b.top - 20), width: b.width, height: 160 }; });
    await pg.screenshot({ path: process.env.BILD, clip: r });
  }
  if (process.env.BILD2) {
    await pg.evaluate(async () => { window.DMA_SPIEL.menue("tiere"); await new Promise((r) => setTimeout(r, 200)); });
    const p = await pg.$("#spPanel"); await p.screenshot({ path: process.env.BILD2 });
    await pg.evaluate(() => window.DMA_SPIEL.schliessen());
  }

  console.log("\nDER CHIHUAHUA BEISST SICH FEST UND ZERRT\n");
  const biss = await pg.evaluate(async () => {
    window.DMA_TONLOG = [];
    const ichK = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis').getBoundingClientRect();
    const zx = ichK.left + ichK.width / 2, zy = ichK.top + ichK.height / 2, r = ichK.width / 2;
    window.DMA_SPIEL.pruef.tierAngriff("bea", "ich", "chihuahua");
    const xs = []; let naechst = 9; const t0 = performance.now(); let ruck = false;
    /* Fassung 646: der Chihuahua beißt jetzt 2,8 s lang. */
    while (performance.now() - t0 < 2950) {
      const t = document.querySelector(".sp-tier-sprung.sp-tier-chihuahua .sp-tier-koerper");
      if (t) { const b = t.getBoundingClientRect(); const x = b.left + b.width / 2, y = b.top + b.height / 2; xs.push(x); naechst = Math.min(naechst, Math.hypot(x - zx, y - zy) / r); }
      const kk = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis');
      if (kk && kk.getAnimations().length) ruck = true;
      await new Promise((res) => setTimeout(res, 25));
    }
    let wechsel = 0, rich = 0;
    for (let i = 1; i < xs.length; i++) { const d = Math.sign(xs[i] - xs[i - 1]); if (d && rich && d !== rich) wechsel++; if (d) rich = d; }
    return { ton: (window.DMA_TONLOG || []).map((t) => t.name || t).join(","), naechst, wechsel, ruck, weg: !document.querySelector(".sp-tier-sprung") };
  });
  sage(/chihuahuaknurr/.test(biss.ton) && /bisszerren/.test(biss.ton), "er knurrt und man hört das Zerren", biss.ton);
  sage(biss.naechst < 1.0, "er springt bis an mein Bild", "nächster Abstand " + biss.naechst.toFixed(2) + " Radien");
  sage(biss.wechsel >= 8, "er zerrt hin und her (Richtungswechsel)", biss.wechsel + " Wechsel");
  sage(biss.ruck, "mein Bild ruckt beim Zerren mit");
  sage(biss.weg, "danach lässt er los und ist wieder weg");

  console.log("\nDER BABYDRACHE STÖSST VON OBEN HERAB\n");
  const flug = await pg.evaluate(async () => {
    window.DMA_TONLOG = [];
    const ichK = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis').getBoundingClientRect();
    const zx = ichK.left + ichK.width / 2, zy = ichK.top + ichK.height / 2, r = ichK.width / 2;
    window.DMA_SPIEL.pruef.tierAngriff("bea", "ich", "drache");
    let naechst = 9, hoechst = 1e9; const t0 = performance.now();
    /* Fassung 646: der Drache umkreist das Bild 3,4 s lang (1,3 Radien
       Abstand) – er kommt nah heran und fliegt dabei auch darüber. */
    while (performance.now() - t0 < 3500) {
      const t = document.querySelector(".sp-tier-sprung.sp-tier-drache .sp-tier-koerper");
      if (t) { const b = t.getBoundingClientRect(); const x = b.left + b.width / 2, y = b.top + b.height / 2; naechst = Math.min(naechst, Math.hypot(x - zx, y - zy) / r); hoechst = Math.min(hoechst, y); }
      await new Promise((res) => setTimeout(res, 20));
    }
    return { ton: (window.DMA_TONLOG || []).map((t) => t.name || t).join(","), naechst, ueber: (zy - hoechst) / r };
  });
  sage(/drachenpuste/.test(flug.ton), "er faucht", flug.ton);
  sage(flug.naechst < 1.4, "er kommt dicht ans Bild (umkreist es)", flug.naechst.toFixed(2) + " Radien");
  sage(flug.ueber > 0.9, "er fliegt auch über das Bild hinweg", flug.ueber.toFixed(2) + " Radien über der Mitte");

  console.log("\nGEGENWEHR MIT BEIDEN TIEREN, KUSCHELN\n");
  const gw = await pg.evaluate(async () => {
    window.DMA_TONLOG = [];
    window.DMA_SPIEL.pruef.gegenwehrZeigen("bea", "ich", { gegenwehr: 6, gegen_tier: 2, tier: "chihuahua", gegen_flug: 4, flugtier: "drache", tier_heil: 3 });
    await new Promise((r) => setTimeout(r, 1400));
    const zahlen = [...document.querySelectorAll(".sp-zahl")].map((z) => z.textContent);
    return { ton: (window.DMA_TONLOG || []).map((t) => t.name || t).join(","), zahlen };
  });
  sage(/chihuahuaknurr/.test(gw.ton) && /drachenpuste/.test(gw.ton), "beide Tiere greifen an", gw.ton);
  sage(gw.zahlen.some((z) => /gekuschelt/.test(z)), "das Kuscheln zeigt grüne Punkte", gw.zahlen.join(" | "));

  console.log("\nREITER „TIERE“\n");
  const tab = await pg.evaluate(async () => {
    window.DMA_SPIEL.menue("tiere");
    await new Promise((r) => setTimeout(r, 200));
    const p = document.getElementById("spPanel");
    const out = { text: p.textContent };
    window.__rufe.length = 0;
    p.querySelector('[data-tu="fuettern"][data-w="boden"][data-f="bratwurst"]').click();
    await new Promise((r) => setTimeout(r, 250));
    const f = window.__rufe.find((r) => r.name === "spiel_fuettern"); out.fuettern = f ? f.args.p_welches + "/" + f.args.p_futter : "";
    window.__rufe.length = 0;
    const st = document.querySelector('#spPanel [data-d="tier_stufe"]'); out.stufeText = st ? st.textContent : ""; if (st) st.click();
    await new Promise((r) => setTimeout(r, 250));
    const k = window.__rufe.find((r) => r.name === "spiel_kaufen"); out.stufe = k ? k.args.p_ding : "";
    window.__rufe.length = 0;
    const eule = document.querySelector('#spPanel [data-d="eule"]'); if (eule) eule.click();
    await new Promise((r) => setTimeout(r, 250));
    const k2 = window.__rufe.find((r) => r.name === "spiel_kaufen"); out.eule = k2 ? k2.args.p_ding : "";
    return out;
  });
  sage(/Am Boden/.test(tab.text) && /In der Luft/.test(tab.text) && /Fellmonster/.test(tab.text) && /5\/40 Kraft/.test(tab.text), "zwei Plätze, mein Fellmonster mit 5/40 Kraft");
  sage(tab.fuettern === "boden/bratwurst", "Füttern → spiel_fuettern(boden, bratwurst)", tab.fuettern);
  sage(/Stufe 3 · 120/.test(tab.stufeText) && tab.stufe === "tier_stufe", "Aufwerten: Stufe 3 für 120 Punkte", tab.stufeText + " → " + tab.stufe);
  sage(tab.eule === "eule", "Eule holen → spiel_kaufen(eule)", tab.eule);

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 638 im Browser: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
