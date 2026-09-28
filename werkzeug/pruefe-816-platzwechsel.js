#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 816: LEEREN PLATZ ANTIPPEN = DORTHIN WECHSELN
   ---------------------------------------------------------------------
   XANDER (Funk 204): „Ich kann meinen Platz nicht mehr wechseln oben auf
   dem positionsplätzen da steht tippe auf ein Gesicht der Platz ist leer
   aber ich kann nicht dorthin einfach da ist niemand anders aus mir im
   Raum ich kann den Platz nicht wechseln im Spielmodus".

   Auf einem Android-Telefon (360 px), allein im Raum, mit echten
   Fingertipps auf die Sitzplätze oben:
     – im Spielmodus ohne Ziel, mit bereiter Klassenkraft, bereiter
       Tier-Fähigkeit, bereitem Zauber und Waffe in der Hand: ein Tipp auf
       einen LEEREN Platz setzt mich dorthin;
     – ohne Spielmodus ebenso;
     – Gegenprobe: ein Tipp auf ein GESICHT (Bea) mit bereitem Zauber /
       bereiter Klassenkraft / Tier-Fähigkeit trifft weiterhin sie und
       wechselt keinen Platz.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const BILDER = process.env.SONDE_BILDER || "";
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
  const ctx = await br.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" });
  const pg = await ctx.newPage();
  const konsolenFehler = [];
  pg.on("pageerror", (e) => konsolenFehler.push(String(e.message || e)));
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html?quelle", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz && window.DMA_PRUEF && window.DMA_SPIEL, { timeout: 25000 });

  /* Allein im Raum: nur ich. Supabase ist gestubbt. */
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: {} });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    const ichId = "00000000-0000-4000-8000-000000000000", beaId = "11111111-1111-4111-8111-111111111111";
    window.LiveChat.spielIdVon = (id) => (id === "bea" ? beaId : id === "ich" ? ichId : "");
    const ich = { id: ichId, name: "Alex", lp: 100, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, punkte: 200,
                  pflaster: 3, traenke: 1, waffen: ["kartoffel", "zwille"], mission: null, mana: 80, mana_max: 100, mitspielen: true,
                  level: 6, xp: 260, kampfklasse: "magier", haustier: "drache", tiere: { drache: { kraft: 25, stufe: 1 } } };
    const bea = { id: beaId, name: "Bea", lp: 80, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, mitspielen: true, level: 4 };
    window.__rufe = [];
    window.LiveChat.pruefAbfangen(() => {});
    const klient = { rpc: (name, args) => {
      window.__rufe.push({ name: name, args: args || {} });
      let data = { ok: true };
      if (name === "spiel_ich") data = ich;
      else if (name === "spiel_stand") data = [ich, bea];
      else if (name === "spiel_meine_fallen") data = [];
      else if (name === "spiel_platzwechsel") data = { darf: true, mauer_weg: false, mauer_aufbau: false };
      else if (name === "spiel_faehigkeit_setzen") data = { ok: true, faehigkeit: "drache", bereit_s: 0 };
      else if (name === "spiel_trophaeen") data = { ok: true, liste: [], neu: [], lohn: 0 };
      return Promise.resolve({ data: data, error: null });
    } };
    window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ichId, ich: ich,
      stand: { [ichId]: ich, [beaId]: bea }, letzterAbruf: Date.now() });
    window.__hinweise = [];
    window.DMA_SPIEL_BRUECKE = window.DMA_SPIEL_BRUECKE || {};
    const altToast = window.DMA_SPIEL_BRUECKE.toast;
    window.DMA_SPIEL_BRUECKE.toast = (t) => { window.__hinweise.push(t); try { if (altToast) altToast(t); } catch (e) {} };
    /* Ab Fassung 645 meldet sich das Spiel in einer eigenen Zeile. */
    window.__spielMeldungen = window.__hinweise;
  });
  await pg.waitForTimeout(800);

  const tick = (ms) => pg.waitForTimeout(ms);
  const platzVon = (id) => pg.evaluate((id) => { const p = window.LiveChat.lage().plaetze.find((x) => x.id === id); return p ? p.nummer : 0; }, id);
  const freiePlaetze = () => pg.evaluate(() => window.LiveChat.lage().plaetze.filter((p) => p.leer).map((p) => p.nummer));
  /* Ein echter Fingertipp auf die Mitte des Platzes – was darüber liegt,
     bekommt ihn (genau wie auf dem Telefon). */
  const tippePlatz = async (nr) => {
    const sel = '#lcPlaetze [data-lc-platz="' + nr + '"]';
    await pg.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: "center" }); }, sel);
    await tick(120);
    const m = await pg.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
    if (!m) return false;
    await pg.touchscreen.tap(m.x, m.y);
    /* Die Schaufel wartet 300 ms auf einen Doppeltipp – großzügig warten. */
    await tick(700);
    return true;
  };
  const zustand = (f) => pg.evaluate(f);
  const setze = (werte) => pg.evaluate((w) => {
    const S = window.DMA_SPIEL.pruef.zustand();
    S.kampfZiel = false; S.faehigZiel = false; S.zauber = ""; S.waffe = ""; S.legen = ""; S.graben = false; S.turmSetzen = false;
    S.wwahl = false; S.rad = null; S.zrad = false; S.langWahl = false; S.schnellMenue = false;
    if (w.mitspielen != null) { S.ich.mitspielen = w.mitspielen; S.stand[S.ich.id] = Object.assign({}, S.stand[S.ich.id], { mitspielen: w.mitspielen }); }
    if (w.faehig) S.faehig = { art: "drache", bereitBis: 0 };
    Object.keys(w).forEach((k) => { if (k !== "mitspielen" && k !== "faehig") S[k] = w[k]; });
    window.__hinweise.length = 0;
    window.__rufe.length = 0;
  }, werte);
  const bild = async (name) => { if (BILDER) { try { fs.mkdirSync(BILDER, { recursive: true }); await pg.screenshot({ path: path.join(BILDER, name + ".png") }); } catch (e) {} } };

  /* Ein Durchgang: Zustand setzen, einen freien Platz (nicht der
     Sparringsplatz) antippen, prüfen, dass ich dort sitze. */
  const wechsel = async (titel, werte, nachher) => {
    await setze(werte);
    await tick(400);
    const vorher = await platzVon("ich");
    const sparr = await zustand(() => window.DMA_SPIEL.pruef.zustand().sparring || 0);
    const frei = (await freiePlaetze()).filter((n) => n !== vorher && n !== sparr);
    const ziel = frei[Math.min(2, frei.length - 1)];
    await tippePlatz(ziel);
    const jetzt = await platzVon("ich");
    const hinw = await zustand(() => window.__hinweise.slice(-2).join(" | "));
    sage(ziel && jetzt === ziel, titel + ": Tipp auf leeren Platz " + ziel + " → ich sitze dort", JSON.stringify({ vorher, ziel, jetzt, hinw }));
    if (nachher) await nachher();
    return { vorher, ziel, jetzt };
  };

  console.log("\nIM SPIELMODUS, ALLEIN IM RAUM\n");
  sage(await zustand(() => window.DMA_SPIEL.imSpiel()), "Spielmodus ist an (Mitspielen)");
  sage(await zustand(() => window.LiveChat.lage().plaetze.filter((p) => !p.leer).length) === 1, "nur ich sitze im Raum");
  await wechsel("Spielmodus ohne Ziel", { mitspielen: true });
  await bild("01-spiel-ohne-ziel");
  await wechsel("bereite Klassenkraft (Arkanblitz)", { mitspielen: true, kampfZiel: true }, async () => {
    const h = await zustand(() => window.__hinweise.join(" | "));
    sage(!/der Platz ist leer/.test(h), "kein „Tippe auf ein Gesicht – der Platz ist leer“", h);
    sage(await zustand(() => window.DMA_SPIEL.pruef.zustand().kampfZiel === true), "die Klassenkraft bleibt bereit");
  });
  await bild("02-klassenkraft");
  await wechsel("bereite Tier-Fähigkeit (Glutatem)", { mitspielen: true, faehig: true, faehigZiel: true }, async () => {
    const h = await zustand(() => window.__hinweise.join(" | "));
    sage(!/der Platz ist leer/.test(h), "kein „Tippe auf ein Gesicht – der Platz ist leer“", h);
    sage(await zustand(() => window.DMA_SPIEL.pruef.zustand().faehigZiel === true), "die Tier-Fähigkeit bleibt bereit");
  });
  await wechsel("bereiter Zauber (Nebel)", { mitspielen: true, zauber: "nebel" }, async () => {
    const h = await zustand(() => window.__hinweise.join(" | "));
    sage(!/der Platz ist leer/.test(h), "kein „Tippe auf ein Gesicht – der Platz ist leer“", h);
    sage(await zustand(() => window.DMA_SPIEL.pruef.zustand().zauber === "nebel"), "der Zauber bleibt bereit");
  });
  await bild("03-zauber");
  await wechsel("Waffe in der Hand (Kartoffel)", { mitspielen: true, waffe: "kartoffel", kampfLeiste: true });
  await bild("04-waffe");

  console.log("\nOHNE SPIELMODUS\n");
  await wechsel("Mitspielen aus", { mitspielen: false });
  await bild("05-ohne-spiel");
  await wechsel("Mitspielen aus, Zauber noch gewählt", { mitspielen: false, zauber: "nebel" });

  console.log("\nGEGENPROBE: TIPP AUF EIN GESICHT\n");
  await pg.evaluate(() => {
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      leute: { bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" } } });
    window.DMA_PRUEF.neuZeichnen();
  });
  await tick(600);
  const aufBea = async (titel, werte, rpcName, pruefe) => {
    await setze(werte);
    await tick(300);
    const vorher = await platzVon("ich"), bea = await platzVon("bea");
    if (!bea) { sage(false, titel + ": Bea sitzt nicht"); return; }
    await tippePlatz(bea);
    await tick(400);
    const jetzt = await platzVon("ich");
    const rufe = await zustand(() => window.__rufe.map((r) => r.name));
    sage(jetzt === vorher && (!rpcName || rufe.includes(rpcName)) && (!pruefe || await zustand(pruefe)),
      titel + ": trifft Bea, kein Platzwechsel", JSON.stringify({ vorher, jetzt, bea, rufe }));
  };
  await aufBea("Klassenkraft auf Bea", { mitspielen: true, kampfZiel: true }, "spiel_klassen_schlag", () => window.DMA_SPIEL.pruef.zustand().kampfZiel === false);
  await aufBea("Tier-Fähigkeit auf Bea", { mitspielen: true, faehig: true, faehigZiel: true }, "spiel_tier_faehigkeit", () => window.DMA_SPIEL.pruef.zustand().faehigZiel === false);
  await aufBea("Zauber auf Bea", { mitspielen: true, zauber: "nebel" }, "", () => window.DMA_SPIEL.pruef.zustand().zauber === "");
  await bild("06-gesicht");

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  console.log("\n" + (fehler ? "Fassung 816: " + fehler + " rot." : "Fassung 816 auf dem Telefon: alles grün.") + "\n");
  await br.close(); srv.close();
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
