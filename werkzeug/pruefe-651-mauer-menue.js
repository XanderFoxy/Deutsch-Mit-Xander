#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 651: MAUER, MENÜ AUF ANDROID, CONTROLLER-EI, REITER
   ---------------------------------------------------------------------
   XANDER (25.09.): „die Mauer verdeckt … unseren Lebensstand … und unser
   kleines Fellmonster" · „die Anzeige des Aufklappmenüs wird im Android
   immer noch abgeschnitten rechts … so ein kleines Ei mit dem Gaming
   Controller … das Burger Menü eher oben drüber" · „ich habe immer noch
   nicht das Tacho Menü" · „Schutz und Laden … springt der Link wieder
   hinter den Frame".
   Schmales Android-Telefon (360 px), echte Fingertipps.
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
  /* Im längeren „Mehr" (Töne, 3×-Tipp, Zauberer-Rang) wird erst hingescrollt, dann getippt. */
  const tippe = async (sel) => { await pg.evaluate((sel) => { const e = document.querySelector(sel); if (e && e.closest(".sp-schnellmenue")) e.scrollIntoView({ block: "nearest" }); }, sel); const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };


  console.log("\nDIE MAUER VERDECKT NICHTS MEHR\n");
  const mauer = await pg.evaluate(() => {
    const el = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]');
    /* Ab Fassung 687 liegt die Seite ein paar Pixel anders (neue Knopfleiste) –
       der Messpunkt muss im Bild sein, sonst liefert elementFromPoint nichts. */
    const vorher = window.scrollY, altVerhalten = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto"; el.scrollIntoView({ block: "center" });
    const k = el.querySelector(".lc-kreis").getBoundingClientRect();
    const m = el.querySelector(".sp-mauer"), lp = el.querySelector(".sp-lp"), t = el.querySelector(".sp-tier");
    const z = (e) => Number(getComputedStyle(e).zIndex);
    /* Punkt auf dem Lebensbogen links unten (Winkel 135°) */
    const a = 135 * Math.PI / 180, R = 45.5 / 100 * k.width;
    const px = k.left + k.width / 2 + Math.cos(a) * R, py = k.top + k.height / 2 + Math.sin(a) * R;
    /* Ringe und Mauer lassen Tipps durch (pointer-events: none) – für die
       Messung kurz „anfassbar" machen, dann zählt nur die Stapelung. */
    const st = document.createElement("style");
    st.textContent = ".sp-lp, .sp-lp *, .sp-mauer, .sp-mauer * { pointer-events: auto !important; }";
    document.head.appendChild(st);
    const oben = document.elementFromPoint(px, py);
    st.remove();
    /* FASSUNG 667 — die Mauer ist jetzt ein Bogen außen unter dem Ring
       (Radius ≥ 50,5 von 50): gemessen wird die Oberkante der Zeichnung. */
    const sv = m.querySelector("svg"), bb = sv.getBBox(), sr = sv.getBoundingClientRect();
    const mr = { top: sr.top + bb.y * sr.height / 100 };
    window.scrollTo(0, vorher); document.documentElement.style.scrollBehavior = altVerhalten;
    return { zMauer: z(m), zRing: z(lp), zTier: z(t), ringOben: Boolean(oben && lp.contains(oben)), getroffen: oben ? oben.tagName + "." + (oben.getAttribute("class") || "") : "",
             mauerOben: Math.round((mr.top - k.top) / k.height * 100) };
  });
  sage(mauer.zMauer < mauer.zRing && mauer.zRing < mauer.zTier, "Reihenfolge: Mauer hinten, Ringe davor, Tiere ganz vorn", JSON.stringify(mauer));
  sage(mauer.ringOben, "auf dem Lebensbogen liegt der Ring oben, nicht die Mauer", mauer.getroffen);
  sage(mauer.mauerOben >= 70, "die Mauer liegt als Bogen außen unten am Ring (Oberkante unter 70 % des Bildes)", mauer.mauerOben + " %");

  console.log("\nMENÜ AUF 360 PX\n");
  for (const r of ["waffen", "mehr"]) {
    await pg.evaluate((r) => { const S = window.DMA_SPIEL.pruef.zustand(); S.leisteZu = false; S.schnellMenue = true; S.schnellReiter = r; window.DMA_SPIEL.pruef.schnellZeichnen(true); }, r);
    await tick(250);
    const m = await pg.evaluate(() => {
      const sm = document.querySelector(".sp-schnellmenue").getBoundingClientRect(), rahmen = document.querySelector(".sp-schnell").parentNode.getBoundingClientRect();
      const knoepfe = [...document.querySelectorAll(".sp-schnellmenue button")];
      const abgeschnitten = knoepfe.filter((b) => b.getBoundingClientRect().right > rahmen.right + 0.5).length;
      return { rechts: Math.round(sm.right), rahmen: Math.round(rahmen.right), abgeschnitten };
    });
    sage(m.rechts <= m.rahmen && m.abgeschnitten === 0, "Reiter „" + r + "“: das Menü endet im Rahmen, kein Knopf abgeschnitten", JSON.stringify(m));
  }
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
  await tick(150);
  /* Fassung 655 — XANDER: „Der Gaming Controller bedeutet doch schon spielen … leuchtet er schon grün …
     über dem Controller im Burger Menü". Controller = Mitspielen, das Menü (☰) sitzt darüber. */
  const reihe = await pg.evaluate(() => { const b = [...document.querySelectorAll(".sp-s-reihe > button")]; const bu = document.querySelector(".sp-s-burger");
    return { erster: b[0].className + "|" + b[0].dataset.s, gruenerPunkt: document.querySelectorAll(".sp-s-punkt").length, n: b.filter((x) => x.dataset.s !== "reparieren").length,
             burgerUeber: bu ? bu.getBoundingClientRect().bottom <= b[0].getBoundingClientRect().top + 1 && Math.abs(bu.getBoundingClientRect().left - b[0].getBoundingClientRect().left) < 8 : false }; });
  sage(/sp-s-ei/.test(reihe.erster) && /\|mitspielen$/.test(reihe.erster) && /sp-an/.test(reihe.erster) && !reihe.gruenerPunkt && reihe.n <= 8, "ganz links der Controller = Mitspielen (grün), kein extra grüner Punkt; höchstens 8 Knöpfe (ab 686 mit Trank-Flasche)", JSON.stringify(reihe));
  sage(reihe.burgerUeber, "das Menü (☰) sitzt direkt über dem Controller");
  await tippe(".sp-schnell .sp-s-burger");
  const ueber = await pg.evaluate(() => { const m = document.querySelector(".sp-schnellmenue"), e = document.querySelector(".sp-s-burger"); return m ? m.getBoundingClientRect().bottom <= e.getBoundingClientRect().top + 1 : false; });
  sage(ueber, "☰ öffnet das Menü darüber");
  await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; window.DMA_SPIEL.pruef.schnellZeichnen(true); window.__rufe.length = 0; });
  await tick(150);
  await tippe(".sp-schnell .sp-s-ei");
  const aus = await pg.evaluate(() => ({ ruf: (window.__rufe.find((r) => r.name === "spiel_mitspielen") || {}).args, gruen: Boolean(document.querySelector(".sp-s-ei.sp-an")) }));
  sage(aus.ruf && aus.ruf.p_an === false && !aus.gruen, "Tipp auf den grünen Controller: Pause (nicht mehr grün)", JSON.stringify(aus));
  await tippe(".sp-schnell .sp-s-ei");
  sage(await pg.evaluate(() => Boolean(document.querySelector(".sp-s-ei.sp-an")) && document.querySelectorAll(".sp-s-reihe > button").length > 5), "noch ein Tipp: wieder grün, die Leiste ist da");

  console.log("\nDAS TACHO-ZEICHEN\n");
  await pg.evaluate(() => { const P = window.DMA_SPIEL.pruef, S = P.zustand(); S.waffe = P.slots()[0]; P.schnellZeichnen(true); });
  await tick(150);
  sage(await pg.evaluate(() => Boolean(document.querySelector('.sp-s-slot[data-n="0"] .sp-s-tacho')) && !document.querySelector('.sp-s-slot[data-n="1"] .sp-s-tacho')), "die angelegte Waffe trägt einen kleinen Tacho – nochmal tippen öffnet das Rad");
  await tippe('.sp-schnell .sp-s-slot[data-n="0"]');
  sage(await pg.evaluate(() => Boolean(document.querySelector(".sp-rad"))), "Tipp auf die Waffe mit dem Tacho öffnet das Waffenrad");
  await pg.touchscreen.tap(30, 60); await tick(250);

  console.log("\nGROSSES MENÜ: DER GEWÄHLTE REITER BLEIBT IM BILD\n");
  await pg.evaluate(() => window.DMA_SPIEL.menue("start"));
  await tick(300);
  for (const tab of ["schutz", "rang", "duell"]) {
    await pg.evaluate((t) => { const b = document.querySelector('#spPanel .sp-tabs [data-tab="' + t + '"]'); b.scrollIntoView({ inline: "center", block: "nearest" }); b.click(); }, tab);
    await tick(250);
    const r = await pg.evaluate((t) => {
      const leiste = document.querySelector("#spPanel .sp-tabs"), b = leiste.querySelector('[data-tab="' + t + '"]');
      const lr = leiste.getBoundingClientRect(), br = b.getBoundingClientRect();
      return { an: b.classList.contains("sp-an"), drin: br.left >= lr.left - 0.5 && br.right <= lr.right + 0.5, l: Math.round(br.left), r: Math.round(br.right), ll: Math.round(lr.left), lrr: Math.round(lr.right) };
    }, tab);
    sage(r.an && r.drin, "Reiter „" + tab + "“ gewählt und ganz sichtbar", JSON.stringify(r));
  }
  if (process.env.BILD) await pg.screenshot({ path: process.env.BILD });

  await br.close(); srv.close();
  if (konsolenFehler.length) { fehler++; console.log("  FEHL Seitenfehler: " + konsolenFehler.join(" | ")); }
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 651 auf dem Telefon: alles grün.\n");
  process.exit(fehler ? 1 : 0);
})();
