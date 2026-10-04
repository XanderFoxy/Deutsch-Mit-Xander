#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 879: LEBENSANZEIGE AUS · POSTFACH-EMPFÄNGER KOMPAKT
   ---------------------------------------------------------------------
   Walkie 285 / Funk 160 — XANDER: „dass mein Lebens auch komplett aus
   haben kann". Menü → Mehr → Im Chat: „Lebensanzeige aus" blendet den
   Lebensbogen (und die LP-Zahl oben im Menü) nur für einen selbst aus,
   sofort und ohne Neuladen; nach dem Neuladen bleibt es so.
   Walkie 296 — „Nur ein Suchfeld; darunter die 5 zuletzt Angeschriebenen
   als Knöpfe, ‚Alle' als eigener Knopf". Gewählte als Chips (✕ entfernt),
   Treffer erst beim Tippen (höchstens sechs), Mehrfachauswahl bleibt.
   Läuft mit ?quelle (die Quellen, nicht min/).
   Aufruf: node werkzeug/pruefe-879-lebensanzeige-postfach.js [bildpraefix]
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const W = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };
let fehler = 0;
const sage = (gut, was, z) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (z ? "   " + z : "")); };
const BILD = process.argv[2];

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(W, p);
    if (!f.startsWith(W) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  await new Promise((r) => srv.on("listening", r));
  const basis = "http://127.0.0.1:" + srv.address().port + "/index.html?quelle";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
  const pg = await ctx.newPage();
  const seitenFehler = [];
  pg.on("pageerror", (e) => { seitenFehler.push(String(e.message || e).split("\n")[0]); if (process.env.STAPEL) console.log(e.stack); });
  await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  const tick = (ms) => pg.waitForTimeout(ms);
  /* Klick direkt am Element: die Hinweisfenster der Probe-Anmeldung legen sich sonst immer wieder darüber. */
  const klick = async (sel) => { await pg.evaluate((s) => document.querySelector(s).click(), sel); await tick(80); };

  /* Das Spiel wie in pruefe-738: ich (Alex) und Bea spielen mit. */
  const spielAufbauen = async () => {
    await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL, null, { timeout: 60000 });
    await pg.evaluate(() => {
      const leute = { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } };
      window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
      document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
      let e = document.getElementById("livechatArea");
      while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
      window.DMA_PRUEF.neuZeichnen();
      const ichId = "00000000-0000-4000-8000-000000000000", beaId = "11111111-1111-4111-8111-111111111111";
      window.LiveChat.spielIdVon = (id) => (id === "bea" ? beaId : id === "ich" ? ichId : "");
      const ich = { id: ichId, name: "Alex", lp: 70, lp_max: 100, kaputt: false, schild: 10, punkte: 200, pflaster: 1, traenke: 0, waffen: ["kartoffel"],
        mana: 40, mana_max: 100, mitspielen: true, level: 3, xp: 260, ladung: 40, helm: 0, brust: 0, vorraete: {}, tiere: {}, zeigen: {} };
      const bea = { id: beaId, name: "Bea", lp: 50, lp_max: 100, kaputt: false, schild: 0, mana: 10, mana_max: 100, mitspielen: true, level: 7, ladung: 60 };
      const klient = { rpc: (name) => Promise.resolve({ data: name === "spiel_ich" ? ich : name === "spiel_stand" ? [ich, bea] : { ok: true }, error: null }) };
      window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ichId, ich: ich, stand: { [ichId]: ich, [beaId]: bea }, letzterAbruf: Date.now() });
      /* Ohne Anmeldung ist die Chat-Eingabe versteckt; hier spielt ein Angemeldeter. */
      const f = document.getElementById("lcForm"); if (f) f.style.display = "";
      window.DMA_PRUEF.neuZeichnen();
    });
    await tick(1200);
    await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.schnellMenue = true; S.schnellReiter = "mehr"; window.DMA_SPIEL.pruef.schnellZeichnen(true); });
    await tick(400);
  };
  /* Die Meldung oben im Menü („❤️ …") überdeckt kurz die LP-Zeile – für die Messung weg damit. */
  const lpStand = () => pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); S.menueMeldung = null; window.DMA_SPIEL.pruef.schnellZeichnen(true); }).then(() => pg.evaluate(() => {
    const sicht = (e) => Boolean(e) && getComputedStyle(e).display !== "none";
    const boegen = [...document.querySelectorAll("#livechatKarte .sp-lp .sp-lp-bogen")];
    const mana = document.querySelector("#livechatKarte .sp-lp .sp-mana-voll");
    const k = document.querySelector('[data-s="lpaus"]');
    return { klasse: document.documentElement.classList.contains("sp-lp-aus"), boegen: boegen.length, sichtbar: boegen.filter(sicht).length,
      mana: sicht(mana), lpText: sicht(document.querySelector(".sp-sm-kopf .sp-lp-text")), knopf: k ? k.textContent : null,
      an: k ? k.classList.contains("sp-an") && k.getAttribute("aria-pressed") === "true" : null, ls: localStorage.getItem("dma_spiel_lp_aus") };
  }));

  console.log("\nLEBENSANZEIGE AUS (Walkie 285 / Funk 160)\n");
  await pg.goto(basis, { waitUntil: "domcontentloaded" });
  await spielAufbauen();
  let r = await lpStand();
  sage(r.knopf === "Lebensanzeige aus" && r.an === false, "Menü → Mehr → Im Chat: Schalter „Lebensanzeige aus“ (aus)", JSON.stringify({ knopf: r.knopf, an: r.an }));
  sage(r.boegen >= 2 && r.sichtbar === r.boegen && r.lpText, "vorher: Lebensbögen (ich und Bea) und LP-Zahl sichtbar", JSON.stringify(r));
  if (BILD) await (await pg.$("#livechatKarte")).screenshot({ path: BILD + "-lp-an.png" });
  await pg.evaluate(() => document.querySelector('[data-s="lpaus"]').click());
  await tick(300);
  r = await lpStand();
  sage(r.klasse && r.sichtbar === 0 && !r.lpText, "eingeschaltet: Lebensbögen und LP-Zahl sofort weg (ohne Neuladen)", JSON.stringify(r));
  sage(r.mana, "Mana-Bogen bleibt sichtbar – nur die Lebensanzeige verschwindet", String(r.mana));
  sage(r.ls === "1" && r.an === true, "gemerkt (dma_spiel_lp_aus = 1), Knopf leuchtet", JSON.stringify({ ls: r.ls, an: r.an }));
  const lpRechnet = await pg.evaluate(() => window.DMA_SPIEL.pruef.zustand().ich.lp);
  sage(lpRechnet === 70, "die Spiellogik bleibt: LP stehen unverändert im Zustand", String(lpRechnet));
  if (BILD) await (await pg.$("#livechatKarte")).screenshot({ path: BILD + "-lp-aus.png" });
  const ueber = await pg.evaluate(() => { const bs = [...document.querySelectorAll(".sp-sm-zeigen button")]; let n = 0;
    bs.forEach((x, i) => { const a = x.getBoundingClientRect(); if (x.scrollWidth > x.clientWidth + 1) n++; bs.slice(i + 1).forEach((y) => { const b = y.getBoundingClientRect(); if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) n++; }); });
    return { knoepfe: bs.length, probleme: n }; });
  sage(ueber.probleme === 0, "die Schalter-Reihen im Menü „Mehr“ überlappen nicht und schneiden nichts ab", JSON.stringify(ueber));

  await pg.reload({ waitUntil: "domcontentloaded" });
  await spielAufbauen();
  r = await lpStand();
  sage(r.klasse && r.boegen >= 2 && r.sichtbar === 0 && r.an === true, "nach dem Neuladen bleibt die Lebensanzeige aus", JSON.stringify(r));
  await pg.evaluate(() => document.querySelector('[data-s="lpaus"]').click());
  await tick(300);
  r = await lpStand();
  sage(!r.klasse && r.sichtbar === r.boegen && r.boegen >= 2 && r.lpText && r.ls === "0", "wieder an: alles sofort zurück", JSON.stringify(r));

  console.log("\nPOSTFACH: EMPFÄNGER KOMPAKT (Walkie 296)\n");
  const postfach = async (admin) => {
    await pg.evaluate((admin) => {
      const jetzt = Date.now();
      localStorage.removeItem("dma_postfach_zuletzt");
      Backend.currentUser = () => ({ id: "u-x", display_name: "Xander" });
      Backend.canModerate = () => admin;
      const altProfil = Backend.currentProfile; Backend.currentProfile = () => Object.assign({ name: "Xander" }, altProfil() || {}, { extraProfileData: {} });
      Backend.updateExtraProfileField = async () => {};
      window.__gesendet = []; window.__rund = 0;
      Backend.sendPrivateMessage = async (id, body) => { window.__gesendet.push({ id, body }); };
      Backend.sendBroadcastMessage = async () => { window.__rund++; };
      /* sieben Angeschriebene (Ida zuletzt) und eine Rundmail mit vielen Zeilen dazwischen */
      const leute = ["Ida", "Hans", "Gerd", "Frieda", "Emil", "Dora", "Carl"];
      const outbox = leute.map((n, i) => ({ id: "o" + i, body: "Hallo " + n, from_user: "u-x", to_user: "p-" + n.toLowerCase(), to_user_name: n, read: true, created_at: new Date(jetzt - (i + 1) * 36e5 * 3).toISOString() }));
      for (let i = 0; i < 6; i++) outbox.push({ id: "r" + i, body: "📢 Rundmail", from_user: "u-x", to_user: "z-" + i, to_user_name: "Zora " + i, read: true, created_at: new Date(jetzt - 36e5).toISOString() });
      Backend.getMyMessages = async () => ({ inbox: [{ id: "m1", body: "Hallo", author_name: "Anton", from_user: "p-anton", read: true, created_at: new Date(jetzt - 5 * 36e5).toISOString() }], outbox });
      Backend.getFriends = async () => ["Anton", "Berta", "Fred", "Freya", "Frank", "Fritz", "Franzi", "Friedel", "Dora"].map((n) => ({ id: "p-" + n.toLowerCase(), name: n }));
    }, admin);
    await pg.evaluate(() => { const b = document.querySelector('[data-view="view-profile"], [data-target="view-profile"], a[href="#view-profile"]'); if (b) b.click(); });
    await tick(500);
    await pg.evaluate(() => { const b = document.querySelector('[data-sub="sub-inbox"]'); if (b) b.click(); });
    await pg.waitForFunction(() => document.getElementById("inboxSchreiben"), null, { timeout: 20000 });
    /* Wie in pruefe-748: Hinweisfenster der Probe-Anmeldung (Lightbox, „Profil konnte nicht geladen werden") weg. */
    await pg.evaluate(() => { document.querySelectorAll(".lightbox, #profilWarnband").forEach((d) => d.remove());
      document.getElementById("inboxSchreiben").open = true; document.getElementById("inboxSchreiben").scrollIntoView({ block: "start" }); });
    await tick(200);
  };
  const stand = () => pg.evaluate(() => {
    const t = document.getElementById("inboxAnTreffer");
    return { suche: Boolean(document.getElementById("inboxRecipientSearch")), alteListe: document.querySelectorAll("#inboxRecipientList, .checkbox-list-row, [data-recipient-id]").length,
      chips: [...document.querySelectorAll("#inboxAnChips .inbox-an-chip")].map((c) => c.firstChild.textContent),
      zuletzt: [...document.querySelectorAll("#inboxAnZuletzt [data-an-id]")].map((b) => b.textContent),
      alle: Boolean(document.querySelector("#inboxAnZuletzt [data-an-alle]")),
      treffer: t && !t.hidden ? [...t.querySelectorAll("[data-an-id]")].map((b) => b.textContent) : null,
      notiz: getComputedStyle(document.getElementById("inboxBroadcastNote")).display !== "none",
      sucheSichtbar: getComputedStyle(document.getElementById("inboxRecipientListWrap")).display !== "none",
      breite: document.documentElement.scrollWidth };
  });
  await postfach(true);
  let p = await stand();
  sage(p.suche && p.alteListe === 0, "ein Suchfeld, keine lange Häkchen-Liste mehr", JSON.stringify({ suche: p.suche, alteListe: p.alteListe }));
  sage(JSON.stringify(p.zuletzt) === JSON.stringify(["Ida", "Hans", "Gerd", "Frieda", "Emil"]), "die 5 zuletzt Angeschriebenen als Knöpfe (Rundmail zählt nicht)", JSON.stringify(p.zuletzt));
  sage(p.alle, "„📢 Alle“ als eigener Knopf (Team)", "");
  sage(p.treffer === null && p.chips.length === 0, "Treffer erst beim Tippen, noch keine Chips", JSON.stringify({ t: p.treffer, c: p.chips }));
  await pg.fill("#inboxRecipientSearch", "fr");
  await tick(150);
  p = await stand();
  sage(p.treffer && p.treffer.length === 6, "Tippen „fr“: kompakte Trefferliste, höchstens sechs", JSON.stringify(p.treffer));
  await klick('#inboxAnTreffer [data-an-id="p-fred"]');
  await klick('#inboxAnZuletzt [data-an-id="p-ida"]');
  await klick('#inboxAnZuletzt [data-an-id="p-emil"]');
  p = await stand();
  sage(JSON.stringify(p.chips) === JSON.stringify(["Fred", "Ida", "Emil"]), "Mehrfachauswahl: Treffer und Zuletzt-Knöpfe werden zu Chips", JSON.stringify(p.chips));
  await klick('#inboxAnChips [data-an-weg="p-ida"]');
  p = await stand();
  sage(JSON.stringify(p.chips) === JSON.stringify(["Fred", "Emil"]), "✕ am Chip nimmt die Person wieder heraus", JSON.stringify(p.chips));
  await pg.fill("#inboxRecipientSearch", "anto");
  await pg.press("#inboxRecipientSearch", "Enter");
  p = await stand();
  sage(p.chips.includes("Anton"), "Enter im Suchfeld nimmt den ersten Treffer", JSON.stringify(p.chips));
  if (BILD) { await pg.evaluate(() => document.querySelectorAll(".lightbox, #profilWarnband").forEach((d) => d.remove())); await pg.fill("#inboxRecipientSearch", "fr"); await (await pg.$("#inboxSchreiben")).screenshot({ path: BILD + "-postfach.png" }); await pg.fill("#inboxRecipientSearch", ""); }
  await klick("#inboxAnZuletzt [data-an-alle]");
  p = await stand();
  sage(p.notiz && !p.sucheSichtbar && p.zuletzt.length === 0 && p.alle, "„Alle“ an: Rundmail-Hinweis, Personen-Auswahl verschwindet", JSON.stringify({ n: p.notiz, s: p.sucheSichtbar, z: p.zuletzt.length }));
  await klick("#inboxAnZuletzt [data-an-alle]");
  p = await stand();
  sage(!p.notiz && p.sucheSichtbar && p.zuletzt.length === 5 && p.chips.length === 3, "„Alle“ wieder aus: Auswahl ist unverändert da", JSON.stringify({ n: p.notiz, z: p.zuletzt.length, c: p.chips }));
  sage(p.breite <= 360, "nichts ragt seitlich heraus (360 px)", String(p.breite));
  await pg.fill("#inboxMessageInput", "Hallo zusammen");
  await klick("#inboxSendBtn");
  await tick(600);
  const s = await pg.evaluate(() => ({ an: window.__gesendet.map((g) => g.id).sort(), zuletzt: JSON.parse(localStorage.getItem("dma_postfach_zuletzt") || "[]").map((x) => x.name) }));
  sage(JSON.stringify(s.an) === JSON.stringify(["p-anton", "p-emil", "p-fred"]), "Senden geht an alle gewählten Personen", JSON.stringify(s.an));
  sage(s.zuletzt.slice(0, 3).sort().join() === "Anton,Emil,Fred", "die Gesendeten stehen danach vorn in der Zuletzt-Liste des Geräts", JSON.stringify(s.zuletzt));
  await pg.waitForFunction(() => document.getElementById("inboxAnZuletzt"), null, { timeout: 10000 });
  p = await stand();
  sage(p.zuletzt.length === 5 && ["Anton", "Emil", "Fred"].every((n) => p.zuletzt.includes(n)), "neu gezeichnet: die drei Angeschriebenen unter den letzten fünf", JSON.stringify(p.zuletzt));
  /* Alle (Rundmail) wie vorher mit Rückfrage */
  pg.once("dialog", (d) => d.accept());
  await pg.evaluate(() => { document.getElementById("inboxSchreiben").open = true; });
  await klick("#inboxAnZuletzt [data-an-alle]");
  await pg.fill("#inboxMessageInput", "An alle");
  await klick("#inboxSendBtn");
  await tick(600);
  sage(await pg.evaluate(() => window.__rund) === 1, "„Alle“ verschickt die Rundmail wie bisher (mit Rückfrage)", "");
  /* Ohne Team-Rechte gibt es „Alle“ nicht. */
  await postfach(false);
  p = await stand();
  sage(!p.alle && p.zuletzt.length === 5, "ohne Team-Rechte: kein „Alle“, die Zuletzt-Knöpfe bleiben", JSON.stringify({ alle: p.alle, z: p.zuletzt.length }));

  sage(seitenFehler.length === 0, "keine Seitenfehler", seitenFehler.slice(0, 3).join(" | "));
  await pg.evaluate(() => { try { localStorage.removeItem("dma_spiel_lp_aus"); localStorage.removeItem("dma_postfach_zuletzt"); } catch (e) {} });
  await br.close(); srv.close();
  console.log("\nFassung 879 (Lebensanzeige aus, Postfach-Empfänger kompakt): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
