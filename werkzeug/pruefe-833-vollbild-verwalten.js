#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 833: IM VOLLBILD ALLES WIE IM KLEINEN RAHMEN,
   WAHRZEICHEN UND BOOTSVERLEIH VERWALTEN
   ---------------------------------------------------------------------
   XANDER (Funk 214): „Des Weiteren kann man in der großen Ansicht von
   der Stadt immer noch nichts einsammeln oder Aufgaben lösen oder
   jemanden losschicken das kann man nur in der kleinen Ansicht" –
   „Den Bootsverleih kann man offenbar nicht verwalten und du meintest
   dass man in Berliner Fernsehturm auch Eintritt verlangen könnte wie
   sieht es mit den anderen Sehenswürdigkeiten aus bis jetzt kann man da
   nicht in ein extra Menü" – „Infos zu den Wahrzeichen auf Deutsch".
   TEIL A (das ganze Spiel, nachgebauter Server wie Sonde 828, Android
   360 × 740, echte Finger über CDP), die neue Stadt im Vollbild:
     • die Einsammel-Zeichen sind zu sehen (≥ 30 px) und ein Tipp holt ab;
     • ein Tipp aufs Haus geht ans Spiel (leicht-haus) und dessen Station
       ist ÜBER der Stadt zu sehen (ganz im Bild), daneben das kleine
       Menü am Haus mit „Karte“ – beide überlappen nicht;
     • in der Station: Mahlen (spiel_beliefern), im Wald: Holzfäller
       losschicken (spiel_trupp wald), die Meldung steht im Vollbild;
     • alle Knöpfe der Station ≥ 30 px; ✕ schließt;
     • am Fernsehturm: „Verwalten“ öffnet sein Menü.
   TEIL B (die Stadt allein, ?demo=1, 360 × 740): Fernsehturm und
   Bootsverleih haben „Verwalten“: Info-Text (Baujahr, Höhe), Eintritt
   ändern wirkt (weniger Besucher je Tag, gemerkt), nach zwei Stunden
   Öffnungszeit liegt Geld in der Kasse, Einsammeln bringt es in die
   Stadtkasse; das Menü liegt ganz im Bild, deckt die Kopfzeile nicht zu,
   kein Knopf unter 30 px, nichts ragt seitlich hinaus.
   Aufruf: node werkzeug/leicht-packen.js && node werkzeug/fassung-setzen.js --nur-stempel
           node werkzeug/pruefe-833-vollbild-verwalten.js   (BILD=/pfad/f833 für Bilder, NUR=A|B,
           WURZEL=<anderer Stand> für die Gegenprobe)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".webp": "image/webp", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
const BILD = process.env.BILD || "", NUR = process.env.NUR || "";
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const deckt = (a, b) => !!a && !!b && Math.min(a.r, b.r) - Math.max(a.l, b.l) > 0.5 && Math.min(a.u, b.u) - Math.max(a.o, b.o) > 0.5;

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const URL0 = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
  const telefon = { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" };
  const tick = (ms) => new Promise((ok) => setTimeout(ok, ms));
  const konsolenFehler = [];
  /* eine Stelle eines Dinges der Stadt, an der ein Finger wirklich das Ding trifft (kein Knopf, kein Zeichen darüber) */
  const dingPunkt = (fr, wer, freiUnten) => fr.evaluate(([wer, freiUnten]) => {
    const K = STADT.kamera, SZ = STADT.szene;
    const o = SZ.objekte.find((x) => (wer.spiel && x.spiel === wer.spiel && (!wer.art || x.art === wer.art)) || (wer.bild && x.bild === wer.bild));
    if (!o) return { fehlt: true };
    const P = STADT.proj(o.x, o.y, 0);
    for (let dy = -10 * K.dpr; dy < 90 * K.dpr; dy += 2 * K.dpr) for (const dx of [0, -6, 6, -12, 12, -20, 20]) {
      const px = P[0] + dx * K.dpr, py = P[1] - dy, x = px / K.dpr, y = py / K.dpr;
      if (x < 8 || y < 70 || x > K.W / K.dpr - 8 || y > K.H / K.dpr - 8 - (freiUnten || 0)) continue;
      if (SZ.treffer(px, py) !== o) continue;
      const e = document.elementFromPoint(x, y);
      if (e && e.id === "lDinge") return { x: x, y: y };
    }
    return { P: [P[0] / K.dpr, P[1] / K.dpr] };
  }, [wer, freiUnten || 0]);

  /* ======================= TEIL A: das Spiel, die Stadt im Vollbild ======================= */
  if (NUR !== "B") {
    console.log("\nTEIL A — IM SPIEL, DIE NEUE STADT IM VOLLBILD (nachgebauter Server)\n");
    const ctx = await br.newContext(telefon);
    await ctx.route(/cdn\.jsdelivr\.net\/npm\/@supabase|supabase\.co/, (r) => r.abort());
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => konsolenFehler.push("A: " + String(e.message || e)));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_stadt_neu", "1"); } catch (e) {} window.LEICHT_FREI = true; });
    await pg.goto(URL0 + "/index.html", { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL, { timeout: 60000 });
    await pg.evaluate(() => {
      const leute = { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } };
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea");
      while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
      window.DMA_PRUEF.neuZeichnen();
      const ichId = "00000000-0000-4000-8000-000000000000", beaId = "11111111-1111-4111-8111-111111111111";
      window.LiveChat.spielIdVon = (id) => (id === "bea" ? beaId : id === "ich" ? ichId : "");
      const jetzt = Date.now(), iso = (ms) => new Date(jetzt + ms).toISOString();
      const ich = { id: ichId, name: "Alex", lp: 100, lp_max: 100, kaputt: false, punkte: 900, mitspielen: true, level: 12, xp: 2600, mana: 40, mana_max: 100,
        waffen: ["kartoffel"], vorraete: { getreide: 6, mehl: 3 }, tiere: {}, volk: { arbeiter: 20, quote: 80, berufe: {}, wunder: { fernsehturm: { stufe: 1 } }, freizeit: { bootsverleih: 1 } },
        dorf: { muehle: { stufe: 2, lp: 40 }, baeckerei: { stufe: 2, lp: 40 }, rathaus: { stufe: 3, lp: 60 }, schule: { stufe: 1, lp: 20 } },
        werk: { muehle: { ware: "mehl", menge: 4, start: iso(-700000), fertig: iso(-5000) } },
        acker: { "91": {}, "92": { ab: iso(-60000) } }, dorf_ab: iso(-3600000) };
      const bea = { id: beaId, name: "Bea", lp: 50, lp_max: 100, mitspielen: true, level: 7 };
      window.__rufe = [];
      window.LiveChat.pruefAbfangen(() => {});
      const klient = { rpc: (name, args) => {
        window.__rufe.push({ name: name, args: args || {}, t: Date.now() });
        let data = { ok: true };
        if (name === "spiel_ich") data = ich;
        else if (name === "spiel_stand") data = [ich, bea];
        else if (name === "spiel_werk_abholen") { const w = ich.werk[args.p_gebaeude] || {}; const neu = Object.assign({}, ich.werk); delete neu[args.p_gebaeude]; ich.werk = neu; data = Object.assign({ ok: true, menge: w.menge || 0, ware: w.ware || "" }, ich); }
        else if (name === "spiel_beliefern") { ich.werk = Object.assign({}, ich.werk, { [args.p_gebaeude]: { ware: args.p_ware, menge: args.p_menge, start: iso(0), fertig: iso(600000) } }); data = Object.assign({ ok: true, gebaeude: args.p_gebaeude, ware: args.p_ware, menge: args.p_menge, minuten: 10 }, ich); }
        else if (name === "spiel_trupp") { ich.werk = Object.assign({}, ich.werk, { ["trupp_" + args.p_ort]: { ware: "holz", menge: 8, voll: 8, start: iso(0), fertig: iso(300000) } }); data = Object.assign({ ok: true, trupp: { menge: 8 } }, ich); }
        else if (name === "spiel_markt_preise") data = { ok: true, preise: {} };
        else if (name === "spiel_angebote_liste") data = { ok: true, angebote: [] };
        else if (name === "spiel_trophaeen") data = { ok: true, liste: [], neu: [], lohn: 0 };
        return Promise.resolve({ data: data, error: null });
      } };
      window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ichId, ich: JSON.parse(JSON.stringify(ich)), stand: { [ichId]: ich, [beaId]: bea }, letzterAbruf: Date.now() });
      const f = document.getElementById("lcForm"); if (f) f.style.display = "";
      window.__meldungen = [];
      window.__spielMeldungen = window.__meldungen;
      const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = false; S.graben = false; S.dorfWahl = "";
      window.DMA_SPIEL.pruef.schnellZeichnen(true);
    });
    await tick(800);
    const mitte = (sel) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: "nearest" }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
    const tippe = async (sel) => { const m = await mitte(sel); if (!m) return false; await pg.touchscreen.tap(m.x, m.y); await tick(250); return true; };
    const rufe = (name) => pg.evaluate((n) => window.__rufe.filter((r) => r.name === n), name);
    const stadtFrame = () => pg.frames().find((x) => /stadt-leicht\.html/.test(x.url()));
    const cdp = await ctx.newCDPSession(pg);
    const tipp = async (x, y) => { await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }); await tick(40); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); };
    const knipsen = async (n) => { if (BILD) await pg.screenshot({ path: BILD + "-" + n + ".png" }); };
    try {
      await tippe('.sp-schnell [data-s="makro"]'); await tick(900);
      await pg.evaluate(() => { const m = document.querySelector(".sp-schnell .sp-sm-blick"); if (m) m.scrollTop = 1e6; }); await tick(300);
      if (!(await pg.evaluate(() => !!document.querySelector(".sp-lstadt")))) { await tippe('[data-s="stadtversion"][data-v="neu"]'); await tick(900); }
      let fr = null;
      for (let i = 0; i < 160 && !fr; i++) { const f = stadtFrame(); if (f && await f.evaluate(() => !!document.querySelector(".lk-lupe") && !!(window.STADT.oberflaeche.ueberblick && STADT.szene.sichtbare.length > 20)).catch(() => false)) fr = f; else await tick(250); }
      sage(!!fr, "die neue Stadt ist im Spiel geladen");
      await pg.evaluate(() => { const p = document.querySelector(".sp-dl-neustadt-platz"); if (p) p.scrollIntoView({ block: "center" }); }); await tick(1200);
      await tippe('[data-s="stadtvoll"]'); await tick(3500);
      const voll = await pg.evaluate(() => { const e = document.querySelector(".sp-lstadt"); const r = e.getBoundingClientRect(); return { kl: e.className, w: r.width, h: r.height }; });
      const mini = await fr.evaluate(() => document.body.classList.contains("lk-mini-modus"));
      sage(/sp-ls-voll/.test(voll.kl) && voll.w >= 359 && voll.h >= 739 && !mini, "Vollbild: die Stadt füllt den Bildschirm (nicht der kleine Rahmen)", JSON.stringify(voll));
      await pg.evaluate(() => { window.__weg = []; window.addEventListener("message", (e) => { if (e.data && e.data.typ && /^leicht-(haus|baum|frei|wahl)/.test(e.data.typ)) window.__weg.push(e.data); }, true); });
      await knipsen("a1-vollbild");

      console.log("\nEINSAMMELN IM VOLLBILD\n");
      const z = await fr.evaluate(() => { const b = document.querySelector('.lk-zeichen[data-g="muehle"]'); if (!b || getComputedStyle(b).display === "none") return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, l: r.left, t: r.top }; });
      sage(!!z && z.w >= 30 && z.h >= 30 && z.l >= 0 && z.t >= 0 && z.l + z.w <= 360 && z.t + z.h <= 740, "das Zeichen „Mehl fertig“ steht über der Mühle, ganz im Bild, Tippfläche ≥ 30 px", JSON.stringify(z));
      if (z) await tipp(z.x, z.y);
      for (let i = 0; i < 20 && !(await rufe("spiel_werk_abholen")).length; i++) await tick(200);
      const ab = await rufe("spiel_werk_abholen");
      sage(ab.length === 1 && ab[0].args.p_gebaeude === "muehle", "ein Tipp aufs Zeichen holt das Mehl ab (spiel_werk_abholen muehle)", JSON.stringify(ab.map((x) => x.args)));
      await tick(1400);
      const mld = await pg.evaluate(() => { const m = document.querySelector(".sp-lstadt .sp-ls-meldung"); if (!m) return null; const r = m.getBoundingClientRect(); return { t: m.textContent, sicht: getComputedStyle(m).opacity, o: r.top, u: r.bottom }; });
      sage(!!mld && mld.t.length > 3 && mld.o >= 0 && mld.u <= 740, "die Meldung des Spiels steht im Vollbild (nicht im Menü dahinter)", JSON.stringify(mld));

      console.log("\nTIPP AUFS HAUS: DIE STATION DES SPIELS ÜBER DER STADT\n");
      /* (das erste Haus, das ein Finger frei trifft – vor dem Rathaus kann der Fernsehturm stehen) */
      let hp = null, hg = "";
      /* (im Vollbild laden erst die größeren Bilder – getroffen wird ein Haus, sobald sein Bild da ist) */
      for (let v = 0; v < 40 && !hg; v++) {
        for (const g of ["rathaus", "schule", "baeckerei"]) { hp = await dingPunkt(fr, { spiel: g, art: "haus" }); if (hp && hp.x) { hg = g; break; } }
        if (!hg) await tick(500);
      }
      const hName = { rathaus: "Rathaus", schule: "Schule", baeckerei: "Bäckerei" }[hg];
      await pg.evaluate(() => { window.__weg.length = 0; });
      if (hp && hp.x) await tipp(hp.x, hp.y);
      await tick(2200);
      const weg = await pg.evaluate(() => window.__weg.map((d) => d.typ + ":" + (d.g || "")));
      const st = await pg.evaluate(() => { const s = document.querySelector(".sp-lstadt .sp-dl-station"); if (!s) return null; const r = s.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + 20);
        return { l: r.left, o: r.top, r: r.right, u: r.bottom, oben: !!(e && s.contains(e)), titel: (s.querySelector(".sp-dl-st-kopf b") || {}).textContent }; });
      sage(!!hg && weg.indexOf("leicht-haus:" + hg) >= 0, "der Tipp aufs Haus (" + hName + ") geht ans Spiel (leicht-haus)", JSON.stringify({ hp, weg }));
      sage(!!st && st.oben && st.l >= 0 && st.o >= 0 && st.r <= 360 && st.u <= 740 && st.titel === hName, "die Station des Hauses ist im Vollbild zu sehen: ganz im Bild und obenauf", JSON.stringify(st));
      const menue = await fr.evaluate(() => { const k = document.querySelector(".lk-karte"); if (!k || k.hidden || getComputedStyle(k).visibility === "hidden") return null; const r = k.getBoundingClientRect(); return { l: r.left, o: r.top, r: r.right, u: r.bottom, knoepfe: [...k.querySelectorAll("button")].map((b) => b.title) }; });
      sage(!!menue && menue.knoepfe.indexOf("Karte öffnen") >= 0 && !deckt(menue, st), "am Haus das kleine Menü mit „Karte“ (Drehen, Versetzen …) – es liegt nicht unter der Station", JSON.stringify({ menue, st }));
      await knipsen("a2-station");
      const kl = await pg.evaluate(() => [...document.querySelectorAll(".sp-lstadt .sp-dl-station button")].filter((b) => b.offsetParent).map((b) => { const r = b.getBoundingClientRect(); return { t: (b.textContent || b.getAttribute("aria-label") || "").trim().slice(0, 20), w: Math.round(r.width), h: Math.round(r.height) }; }));
      sage(kl.length > 0 && kl.every((b) => b.w >= 30 && b.h >= 30), "alle Knöpfe der Station ≥ 30 px", JSON.stringify(kl));
      const freiAuf = await fr.evaluate(() => STADT.oberflaeche.freiRaum || null);
      await tippe(".sp-lstadt .sp-dl-station .sp-dl-st-zu"); await tick(900);
      const zu = await pg.evaluate(() => ({ station: !!document.querySelector(".sp-lstadt .sp-dl-station"), wahl: window.DMA_SPIEL.pruef.zustand().dorfWahl }));
      const frei = await fr.evaluate(() => STADT.oberflaeche.freiRaum || null);
      sage(!zu.station && !zu.wahl && !!freiAuf && freiAuf.unten > 60 && !!frei && frei.unten === 0, "✕ schließt die Station; die Stadt weiß, was verdeckt war und dass wieder alles frei ist", JSON.stringify({ zu, freiAuf, frei }));

      console.log("\nAUFGABEN IM VOLLBILD: MAHLEN, HOLZFÄLLER LOSSCHICKEN\n");
      const post = (d) => fr.evaluate((d) => window.parent.postMessage(d, location.origin), d);
      await post({ typ: "leicht-haus", g: "muehle", karte: 1 }); await tick(1200);
      const vorB = (await rufe("spiel_beliefern")).length;
      const mahlen = await tippe('.sp-lstadt .sp-dl-station button[data-s="liefern"][data-g="muehle"]');
      for (let i = 0; i < 15 && (await rufe("spiel_beliefern")).length === vorB; i++) await tick(200);
      const bel = (await rufe("spiel_beliefern")).slice(vorB);
      sage(mahlen && bel.length === 1 && bel[0].args.p_gebaeude === "muehle" && bel[0].args.p_ware === "mehl", "in der Station der Mühle: „Mahlen“ startet die Produktion (spiel_beliefern)", JSON.stringify(bel.map((x) => x.args)));
      await post({ typ: "leicht-haus", g: "wald", karte: 1 }); await tick(1200);
      const waldDa = await pg.evaluate(() => { const s = document.querySelector(".sp-lstadt .sp-dl-station"); return s ? (s.querySelector(".sp-dl-st-kopf b") || {}).textContent : null; });
      const vorT = (await rufe("spiel_trupp")).length;
      const los = await tippe('.sp-lstadt .sp-dl-station button[data-s="trupp"][data-g="wald"]');
      for (let i = 0; i < 15 && (await rufe("spiel_trupp")).length === vorT; i++) await tick(200);
      const tr = (await rufe("spiel_trupp")).slice(vorT);
      sage(waldDa === "Wald" && los && tr.length === 1 && tr[0].args.p_ort === "wald", "Wald-Station im Vollbild: die Holzfäller losschicken (spiel_trupp wald)", JSON.stringify({ waldDa, tr: tr.map((x) => x.args) }));
      await knipsen("a3-wald");
      await tippe(".sp-lstadt .sp-dl-station .sp-dl-st-zu"); await tick(700);

      console.log("\nFERNSEHTURM IM VOLLBILD: VERWALTEN\n");
      await fr.evaluate(() => { STADT.leicht.aufbauen(); }); await tick(1500);
      let fp = await dingPunkt(fr, { spiel: "fernsehturm", art: "wunder" });
      if (!fp || !fp.x) { await fr.evaluate(() => { const o = STADT.szene.objekte.find((x) => x.spiel === "fernsehturm"); if (o) STADT.leicht.fliegeZu(o.x, o.y, STADT.kamera.s, 10); }); await tick(1500); fp = await dingPunkt(fr, { spiel: "fernsehturm", art: "wunder" }); }
      if (fp && fp.x) await tipp(fp.x, fp.y);
      await tick(1200);
      const vk = await fr.evaluate(() => { const b = document.querySelector(".lk-karte:not([hidden]) .lk-verwalten-knopf"); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; });
      if (vk) await tipp(vk.x, vk.y);
      await tick(800);
      const vw = await fr.evaluate(() => { const p = document.querySelector(".lk-verwalten"); return p ? { titel: (p.querySelector(".lk-vw-titel") || {}).textContent, info: (p.querySelector(".lk-vw-info") || {}).textContent } : null; });
      sage(!!vk && vk.w >= 30 && vk.h >= 30 && !!vw && /Fernsehturm/.test(vw.titel) && /368 Meter/.test(vw.info), "am Fernsehturm im Vollbild: „Verwalten“ öffnet sein Menü mit Info", JSON.stringify({ fp, vk, vw }));
      await knipsen("a4-verwalten");
    } catch (e) { sage(false, "Teil A abgebrochen", String(e && e.message || e).split("\n")[0]); }
    await ctx.close();
  }

  /* ======================= TEIL B: Verwalten in der Stadt ======================= */
  if (NUR !== "A") {
    console.log("\nTEIL B — WAHRZEICHEN UND BOOTSVERLEIH VERWALTEN (?demo=1, 360 × 740)\n");
    const ctx = await br.newContext(telefon);
    await ctx.route(/cdn\.jsdelivr|supabase\.co/, (r) => r.abort());
    const pg = await ctx.newPage();
    pg.on("pageerror", (e) => konsolenFehler.push("B: " + String(e.message || e)));
    await pg.goto(URL0 + "/stadt-leicht.html?demo=1&zeit=tag&jahr=herbst&gaeste=0", { waitUntil: "load" });
    await pg.waitForFunction(() => window.STADT && STADT.oberflaeche && STADT.szene && STADT.szene.sichtbare && STADT.szene.sichtbare.length > 20, null, { timeout: 90000 }).catch(() => {});
    await tick(2500);
    const cdp = await ctx.newCDPSession(pg);
    const tipp = async (x, y) => { await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] }); await tick(40); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); };
    const knipsen = async (n) => { if (BILD) await pg.screenshot({ path: BILD + "-" + n + ".png" }); };
    const fr = pg.mainFrame();
    const oeffnen = async (wer, name) => {
      await pg.evaluate(() => { if (STADT.verwalten) STADT.verwalten.zu(); const k = document.querySelector(".lk-karte"); if (k) k.hidden = true; });
      await pg.evaluate((wer) => { const o = STADT.szene.objekte.find((x) => (wer.spiel && x.spiel === wer.spiel) || (wer.bild && x.bild === wer.bild)); if (o) STADT.leicht.fliegeZu(o.x, o.y, Math.max(STADT.kamera.s, 9 * STADT.kamera.dpr), 10); }, wer);
      await tick(1800);
      const p = await dingPunkt(fr, wer);
      if (p && p.x) await tipp(p.x, p.y);
      await tick(900);
      const vk = await pg.evaluate(() => { const b = document.querySelector(".lk-karte:not([hidden]) .lk-verwalten-knopf"); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; });
      sage(!!vk && vk.w >= 30 && vk.h >= 30, name + ": ein Tipp darauf zeigt „Verwalten“ (Tippfläche ≥ 30 px)", JSON.stringify({ p, vk }));
      if (vk) await tipp(vk.x, vk.y);
      await tick(700);
      return pg.evaluate(() => !!document.querySelector(".lk-verwalten"));
    };
    const panel = () => pg.evaluate(() => {
      const p = document.querySelector(".lk-verwalten"); if (!p) return null;
      const r = p.getBoundingClientRect(), txt = (s) => (p.querySelector(s) || {}).textContent || "";
      return { l: r.left, o: r.top, r: r.right, u: r.bottom, sw: p.scrollWidth, cw: p.clientWidth, titel: txt(".lk-vw-titel"), info: txt(".lk-vw-info"), heute: txt(".lk-vw-heute b"), erw: txt(".lk-vw-erwartet b"), kasse: txt(".lk-vw-kasse b"), stadt: txt(".lk-vw-stadtkasse b"),
        an: [...p.querySelectorAll(".lk-vw-stufe")].findIndex((b) => b.classList.contains("an")),
        knoepfe: [...p.querySelectorAll("button")].map((b) => { const q = b.getBoundingClientRect(); return { t: (b.textContent || b.title).trim().slice(0, 24), w: Math.round(q.width), h: Math.round(q.height) }; }) };
    });
    const zahl = (t) => +String(t || "").replace(/[^\d]/g, "") || 0;
    const stufeTippen = async (nr) => { const q = await pg.evaluate((nr) => { const b = document.querySelectorAll(".lk-verwalten .lk-vw-stufe")[nr]; if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, nr); if (q) await tipp(q.x, q.y); await tick(400); return !!q; };
    const knopfTippen = async (sel) => { const q = await pg.evaluate((sel) => { const b = document.querySelector(".lk-verwalten " + sel); if (!b) return null; b.scrollIntoView({ block: "nearest" }); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, aus: b.disabled }; }, sel); if (q) await tipp(q.x, q.y); await tick(500); return q; };
    /* die Uhr der Verwaltung: heute 13:00 deutscher Zeit (mitten in der Öffnungszeit) */
    const uhrStellen = (vorStunden, key) => pg.evaluate(([h, key]) => {
      const V = STADT.verwalten, d = new Date(), tag = V.tagVon(Date.now());
      let t = Date.UTC(+tag.slice(0, 4), +tag.slice(5, 7) - 1, +tag.slice(8, 10), 13, 0, 0);
      /* 13:00 in Berlin: Versatz abziehen */
      const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hour: "2-digit", hourCycle: "h23" });
      t -= (+f.format(new Date(t)) - 13) * 3600000;
      V.jetzt = () => t;
      const s = V.stand(key); s.t = t - h * 3600000; s.tag = V.tagVon(s.t); s.besucher = 0; s.offen = 0;
      return { t: t, d: d.toISOString() };
    }, [vorStunden, key]);
    try {
      const hatV = await pg.evaluate(() => !!STADT.verwalten);
      sage(hatV, "die Stadt hat die Verwaltung der Wahrzeichen (verwalten.js)");
      if (!hatV) throw new Error("verwalten.js fehlt");
      await pg.evaluate(() => { try { localStorage.removeItem("leicht_verwalten_v1"); } catch (e) {} STADT.verwalten.setzen(null); });

      console.log("\nFERNSEHTURM\n");
      const auf = await oeffnen({ spiel: "fernsehturm" }, "Fernsehturm");
      let P = await panel();
      sage(auf && !!P && /Fernsehturm/.test(P.titel) && /1965/.test(P.info) && /368 Meter/.test(P.info) && /Alexanderplatz/.test(P.info), "das Menü des Fernsehturms mit Info auf Deutsch (Alexanderplatz, 1965–1969, 368 Meter)", JSON.stringify(P && { titel: P.titel, info: P.info }));
      await uhrStellen(0, "fernsehturm");
      await pg.evaluate(() => STADT.verwalten.malen()); P = await panel();
      const erw2 = zahl(P.erw);
      await stufeTippen(3); P = await panel();
      const erw10 = zahl(P.erw), gemerkt = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("leicht_verwalten_v1")).orte.fernsehturm.preis; } catch (e) { return null; } });
      sage(P.an === 3 && erw10 < erw2 && erw10 > 0 && gemerkt === 3, "Eintritt 10 Taler statt 2: gewählt, gemerkt, und es kommen weniger Besucher am Tag", JSON.stringify({ erw2, erw10, an: P.an, gemerkt }));
      await stufeTippen(0); P = await panel();
      sage(zahl(P.erw) > erw2, "Eintritt frei: noch mehr Besucher (aber keine Einnahmen)", P.erw);
      await stufeTippen(2);
      await uhrStellen(2, "fernsehturm");
      await pg.evaluate(() => STADT.verwalten.malen()); P = await panel();
      const heute = zahl(P.heute), kasse = zahl(P.kasse), stadt0 = zahl(P.stadt);
      sage(heute > 5 && kasse >= heute * 5 - 5 && kasse <= heute * 5 + 5, "nach zwei Stunden Öffnungszeit: Besucher heute, Eintritt 5 Taler je Besucher in der Kasse", JSON.stringify({ heute, kasse }));
      await knipsen("b1-fernsehturm");
      const ek = await knopfTippen(".lk-vw-einsammeln"); P = await panel();
      sage(!!ek && !ek.aus && zahl(P.stadt) === stadt0 + kasse && zahl(P.kasse) === 0, "„Einnahmen einsammeln“: das Geld kommt in die Stadtkasse, die Kasse ist leer", JSON.stringify({ vorher: { kasse, stadt0 }, nachher: { kasse: P.kasse, stadt: P.stadt } }));
      const kopf = await pg.evaluate(() => [...document.querySelectorAll(".lk-kopf button, .lk-kopf .lk-name")].filter((e) => e.offsetParent).map((e) => { const r = e.getBoundingClientRect(); return { l: r.left, o: r.top, r: r.right, u: r.bottom }; }));
      sage(P.l >= 0 && P.o >= 0 && P.r <= 360 && P.u <= 740 && P.sw <= P.cw + 1 && !kopf.some((k) => deckt(k, P)), "das Menü liegt ganz im Bild (360 × 740), nichts ragt seitlich hinaus, die Kopfzeile bleibt frei", JSON.stringify({ l: P.l, o: P.o, r: P.r, u: P.u, sw: P.sw, cw: P.cw }));
      sage(P.knoepfe.length >= 7 && P.knoepfe.every((b) => b.w >= 30 && b.h >= 30), "alle Knöpfe im Menü ≥ 30 px", JSON.stringify(P.knoepfe));
      const z2 = await knopfTippen(".lk-vw-zu"); P = await panel();
      sage(!!z2 && !P, "✕ schließt das Menü");

      console.log("\nBOOTSVERLEIH\n");
      const aufB = await oeffnen({ bild: "d_bootshaus" }, "Bootsverleih");
      P = await panel();
      sage(aufB && !!P && /Bootsverleih/.test(P.titel) && /Tretboote/.test(P.info) && P.knoepfe.length >= 5, "das Menü des Bootsverleihs: Boote, Preis je Fahrt, Info", JSON.stringify(P && { titel: P.titel, info: P.info }));
      await uhrStellen(0, "bootsverleih");
      await pg.evaluate(() => STADT.verwalten.malen()); P = await panel();
      const b2 = zahl(P.erw);
      await stufeTippen(3); P = await panel();
      sage(P.an === 3 && zahl(P.erw) < b2, "Preis je Fahrt 6 Taler: weniger Fahrten am Tag", JSON.stringify({ vorher: b2, nachher: P.erw }));
      await uhrStellen(3, "bootsverleih");
      await pg.evaluate(() => STADT.verwalten.malen()); P = await panel();
      const bk = zahl(P.kasse), bs = zahl(P.stadt);
      await knopfTippen(".lk-vw-einsammeln"); const P2 = await panel();
      sage(bk > 0 && zahl(P2.stadt) === bs + bk, "Einnahmen des Bootsverleihs einsammeln", JSON.stringify({ kasse: bk, stadt: [bs, P2.stadt] }));
      sage(P2.l >= 0 && P2.r <= 360 && P2.u <= 740 && P2.knoepfe.every((b) => b.w >= 30 && b.h >= 30), "auch dieses Menü ganz im Bild, Knöpfe ≥ 30 px", JSON.stringify(P2.knoepfe));
      await knipsen("b2-bootsverleih");

      console.log("\nALLE WAHRZEICHEN HABEN EINE INFO\n");
      const infos = await pg.evaluate(() => Object.keys(STADT.verwalten.ORTE).map((k) => { const W = STADT.verwalten.ORTE[k], n = (W.info.match(/[.!?](\s|$)/g) || []).length; return { k: k, saetze: n, jahr: /\d{2,4}/.test(W.info) }; }));
      sage(infos.length >= 8 && infos.every((i) => i.saetze >= 2 && i.saetze <= 4 && (i.jahr || i.k === "bootsverleih")), "jede Sehenswürdigkeit (und der Bootsverleih) hat 2–3 Sätze Info (Wahrzeichen mit Jahreszahlen)", JSON.stringify(infos));
    } catch (e) { sage(false, "Teil B abgebrochen", String(e && e.message || e).split("\n")[0]); }
    await ctx.close();
  }

  sage(konsolenFehler.length === 0, "keine Skriptfehler", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? fehler + " FEHLER" : "ALLES GRÜN") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
