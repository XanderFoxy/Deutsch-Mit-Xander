#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 633: SCHNELLLEISTE, MITSPIELEN, SPARRING, HEILEN
   ---------------------------------------------------------------------
   XANDER (25.09.): „ich hätte gern ne Art Waffen-Menü zur Shortcuts,
   wo ich zwischen meinen Waffen … hin und her aussuchen kann … dass
   meine Leiste nicht bei dem anderen sichtbar ist" · „sollen die Leute
   sich entscheiden, ob sie zu dem Spiel beitreten" · „kannst du mir
   vielleicht nur ein Sparring Partner machen" · „keine Heilung
   verschwendet werden wenn man schon voll ist" · „die Aufgaben können
   automatisch weiterschalten" · „gibt's da eine Art Spielanleitung" ·
   „dass das nicht so hängt … eine Kapsel, die immer mitwandert".
   Geprüft wird unten; der Rest dieses Kopfes stammt aus der Sonde zu
   Funk 108–111 (dieselbe nachgestellte Bühne):
   ---------------------------------------------------------------------
   (Vorlage) SONDE — FUNK 108–111: TÖNE, GEGENWEHR, HEILEN, MONSTER, FALLEN
   ---------------------------------------------------------------------
   XANDER (Funk 108): „Die Sounds Für Die Waffen Und Die Dazugehörigen
   Treffergeräusche Sind Noch Nicht Da Bitte Gib Mir Auch Die
   Möglichkeit Das Ich Jemand Anderen Heilen Kann."
   (Funk 109): „Wenn Jemand Ein Geschütze Hat Und Ich Ihn Treffe Wie Ist
   Dann Das Schadensverhältnis …"
   (Funk 110): „Prüfe bitte ob das Fellmonster auch wirklich den
   Angreifer attackiert und ein richtiges Reißgeräusch hat und mach noch
   ein anderes Monster dazu … Hühnerwerfer oder ein Eierwerfer …"
   (Funk 111): „dass man irgendwo noch Falltüren und Minen legen kann."

   Die Zahlen rechnet der Server (spiel_treffer, spiel_heilen,
   spiel_falle_*; dort mit einem Probelauf geprüft, der sich selbst
   zurückrollt). Hier wird der BROWSER geprüft, mit einem nachgestellten
   Server:
     · jede Waffe hat beim Einschlag ihren eigenen Trefferton
     · Gegenwehr: das Geschütz feuert sichtbar Kugeln, das Monster
       springt WIRKLICH zum Angreifer (gemessen: Abstand zu seinem
       Bild), jedes Monster mit seinem eigenen Ton
     · ein echter Schuss schickt die Gegenwehr an den Raum mit
     · einen anderen heilen: der Server bekommt p_ziel, die grüne Zahl
       steigt beim Geheilten auf, der Raum erfährt es
     · Mine legen → Tipp auf einen Platz → spiel_falle_legen mit diesem
       Platz; die eigene Falle ist dort zu sehen
     · Platz wechseln → spiel_falle_pruefen; eine Falltür lässt das Bild
       fallen, mit Ton, roter Zahl und Paket an den Raum
     · Lebens- und Manaring liegen auf dem Rand des Bildes
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
                  pflaster: 3, traenke: 1, waffen: ["kartoffel", "zwille", "bogen", "laser", "huehnerwerfer"], mission: null, mana: 40, mana_max: 100, mitspielen: false };
    const bea = { id: beaId, name: "Bea", lp: 50, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, haustier: "fellmonster",
                  haustier_leben: 30, geschuetz: true, mana: 10, mana_max: 100, mitspielen: true };
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
      else if (name === "spiel_aufgabe") data = { ok: true, id: 1000 + window.__rufe.length, frage: "Ich ___ nach Hause.", optionen: ["gehe", "gehst"], niveau: "A1" };
      else if (name === "spiel_antwort") data = Object.assign({}, ich, { ok: true, richtig: true, loesung: "gehe", gewonnen: 3, bonus: 0, mana_plus: 6 });
      else if (name === "spiel_treffer") data = { ok: true, zone: "koerper", schaden: 8, abgewehrt: 0, kaputt: false,
        ziel: Object.assign({}, bea, { lp: 42 }), ich: Object.assign({}, ich, { lp: 94 }), gegenwehr: 6,
        gegen_geschuetz: 4, gegen_tier: 2, tier: "fellmonster", lohn: 1 };
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

  const leiste = () => pg.evaluate(() => {
    const s = document.querySelector(".sp-schnell");
    return s ? { da: !s.hidden, vorForm: s.nextElementSibling && s.nextElementSibling.id === "lcForm",
                 waffen: [...s.querySelectorAll('.sp-s-reihe [data-s="waffe"]')].map((b) => b.dataset.w + (b.classList.contains("sp-an") ? "*" : "")),
                 mit: (s.querySelector('[data-s="mitspielen"]') || {}).className || "",
                 schwebt: getComputedStyle(s).position === "absolute",
                 knoepfe: s.querySelectorAll(".sp-s-reihe button").length,
                 scrollt: (() => { const r = s.querySelector(".sp-s-reihe"); return r ? r.scrollWidth > r.clientWidth + 1 : false; })() } : { da: false };
  });
  const tippe = (sel) => pg.evaluate((sel) => { const b = document.querySelector(".sp-schnell " + sel); if (b) b.click(); return Boolean(b); }, sel);
  /* FASSUNG 641 — Sparring & Co. liegen jetzt im Menü (Reiter „Mehr"). */
  const menueTippe = async (reiter, sel) => {
    await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); if (!S.schnellMenue) document.querySelector('.sp-schnell [data-s="klappe"]').click(); });
    await pg.evaluate((r) => { const b = document.querySelector('.sp-schnell [data-s="reiter"][data-r="' + r + '"]'); if (b) b.click(); }, reiter);
    return tippe(sel);
  };

  console.log("\nDIE SCHNELLLEISTE — NUR FÜR MICH, ÜBER DEM CHAT\n");
  await pg.waitForTimeout(900);
  let l = await leiste();
  sage(l.da && l.vorForm, "sie sitzt direkt über der Chat-Eingabe");
  /* FASSUNG 641 — „das kann ja ruhig über den Chat liegen … nicht lang scrollen" */
  sage(l.schwebt && !l.scrollt, "sie schwebt über dem Chat (nimmt keine Zeile) und scrollt nicht");
  sage(l.waffen.length === 0, "ohne Mitspielen: nur „Spielen“ und das Menü", l.knoepfe + " Knöpfe");
  const rausBeimZeichnen = await pg.evaluate(() => window.__raus.length);
  sage(rausBeimZeichnen === 0, "nichts davon geht an den Raum", rausBeimZeichnen + " Pakete");

  console.log("\nMITSPIELEN IST FREIWILLIG\n");
  const ohne = await pg.evaluate(async () => {
    window.__rufe.length = 0;
    window.DMA_SPIEL.pruef.setzen({ waffe: "kartoffel" });
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]');
    window.DMA_SPIEL.tippAufPlatz(k, { id: "bea", name: "Bea", leer: false, ich: false, nummer: Number(k.dataset.lcPlatz) }, null);
    await new Promise((r) => setTimeout(r, 900));
    return window.__rufe.map((r) => r.name);
  });
  sage(!ohne.includes("spiel_treffer"), "ohne „Mitspielen“ schießt man auf niemanden", ohne.join(",") || "kein Aufruf");
  await tippe('[data-s="mitspielen"]');
  await pg.waitForTimeout(300);
  l = await leiste();
  const mitRuf = await pg.evaluate(() => (window.__rufe.find((r) => r.name === "spiel_mitspielen") || {}).args);
  sage(Boolean(mitRuf && mitRuf.p_an === true) && /sp-an/.test(l.mit), "„Mitspielen“ schaltet ein", JSON.stringify(mitRuf) + " · " + l.mit);
  sage((l.waffen || []).join(",") === "kartoffel*,huehnerwerfer", "zwei Waffen: Kartoffel (angelegt) und die stärkste eigene", (l.waffen || []).join(","));
  sage(l.knoepfe <= 8 && !l.scrollt, "höchstens acht Knöpfe (ab 686 mit Trank-Flasche), kein Scrollen", l.knoepfe + " Knöpfe");
  const cem = await pg.evaluate(async () => {
    window.__rufe.length = 0;
    const k = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="cem"]');
    window.DMA_SPIEL.tippAufPlatz(k, { id: "cem", name: "Cem", leer: false, ich: false, nummer: Number(k.dataset.lcPlatz) }, null);
    await new Promise((r) => setTimeout(r, 900));
    const ring = k.querySelector(".sp-lp");
    return { rufe: window.__rufe.map((r) => r.name), grau: Boolean(ring && ring.classList.contains("sp-pause")) };
  });
  sage(!cem.rufe.includes("spiel_treffer"), "wer nicht mitspielt (Cem), wird nicht beschossen", cem.rufe.join(",") || "kein Aufruf");
  sage(cem.grau, "sein Ring ist grau – jeder sieht, wer mitspielt");

  console.log("\nWAFFE WECHSELN MIT EINEM TIPP\n");
  await tippe('[data-w="huehnerwerfer"]');
  l = await leiste();
  sage((l.waffen || []).includes("huehnerwerfer*"), "Hühnerwerfer angelegt", (l.waffen || []).join(","));
  /* Fassung 649: nochmal tippen öffnet das Waffenrad; seine Mitte legt ab. */
  await tippe('.sp-s-reihe [data-w="huehnerwerfer"]');
  const radAuf = await pg.evaluate(() => Boolean(document.querySelector(".sp-rad")));
  await tippe(".sp-rad .sp-rad-mitte");
  l = await leiste();
  sage(radAuf && !(l.waffen || []).some((w) => /\*$/.test(w)), "nochmal getippt = Waffenrad, dessen Mitte legt ab", (l.waffen || []).join(","));

  console.log("\nHEILEN, OHNE ZU VERSCHWENDEN\n");
  const heil = await pg.evaluate(async () => {
    const aus = {};
    const ich = window.__ich, S = window.DMA_SPIEL.pruef.zustand();
    for (const [lp, name] of [[100, "voll"], [30, "viel"], [80, "wenig"]]) {
      S.ich.lp = lp; ich.lp = lp; window.DMA_SPIEL.pruef.zeichnen();
      window.__rufe.length = 0;
      const b = document.querySelector('.sp-schnell [data-s="heilen"]');
      window.DMA_SPIEL.pruef.schnellZeichnen();
      const knopf = document.querySelector('.sp-schnell [data-s="heilen"]');
      const aus_ = knopf && knopf.disabled;
      if (knopf && !knopf.disabled) knopf.click();
      await new Promise((r) => setTimeout(r, 150));
      const ruf = window.__rufe.find((r) => r.name === "spiel_heilen");
      aus[name] = { gesperrt: aus_, art: ruf ? ruf.args.p_art : "" };
    }
    return aus;
  });
  sage(heil.voll.gesperrt && !heil.voll.art, "bei vollen LP ist das Herz aus – nichts wird verbraucht");
  sage(heil.viel.art === "trank", "70 LP verloren → Heiltrank", heil.viel.art);
  sage(heil.wenig.art === "pflaster", "20 LP verloren → Pflaster", heil.wenig.art);

  console.log("\nSPARRINGSPARTNER\n");
  await menueTippe("mehr", '[data-s="sparring"]');
  await pg.waitForTimeout(800);
  const spar = await pg.evaluate(async () => {
    const S = window.DMA_SPIEL.pruef.zustand();
    const nr = S.sparring;
    const platz = document.querySelector('#lcPlaetze .lc-platz[data-lc-platz="' + nr + '"]');
    const figur = Boolean(platz && platz.querySelector(".sp-sparring svg"));
    const leer = Boolean(platz && !platz.dataset.lcId);
    const sitzeVorher = window.LiveChat.lage().plaetze.filter((p) => !p.leer).length;
    window.__rufe.length = 0; window.__raus.length = 0;
    window.DMA_SPIEL.pruef.setzen({ waffe: "kartoffel" });
    const k = platz.getBoundingClientRect ? platz : null;
    window.DMA_SPIEL.tippAufPlatz(platz, { leer: true, nummer: nr }, null);
    await new Promise((r) => setTimeout(r, 900));
    const zahl = [...platz.querySelectorAll(".sp-zahl")].map((z) => z.textContent).join(" | ");
    return { nr, figur, leer, zahl, rufe: window.__rufe.map((r) => r.name), raus: window.__raus.length,
             sitze: window.LiveChat.lage().plaetze.filter((p) => !p.leer).length, sitzeVorher };
  });
  sage(spar.nr > 0 && spar.figur && spar.leer, "eine Strohpuppe steht auf einem freien Platz", "Platz " + spar.nr);
  sage(spar.sitze === spar.sitzeVorher, "sie belegt keinen Sitz – niemand sonst merkt etwas", spar.sitzeVorher + " → " + spar.sitze + " besetzt");
  sage(/Streifschuss|Körper|−|Kopfschuss/.test(spar.zahl), "Tipp auf sie trifft (rote Zahl)", spar.zahl || "-");
  sage(!spar.rufe.includes("spiel_treffer") && spar.raus === 0, "kein Server, nichts an den Raum", spar.rufe.join(",") + " · " + spar.raus);
  /* FASSUNG 641 — „das soll eingeloggt bleiben": er schießt von selbst
     zurück, bis man ihn ausschaltet. */
  const duell = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); return Boolean(S.duell && S.duell.uebung && /^sparring:/.test(S.duell.gegnerChat) && S.duell.bis - Date.now() > 3600e3); });
  sage(duell, "er schießt gleich von selbst zurück – und hört nicht nach 3 Minuten auf");
  await menueTippe("mehr", '[data-s="gegenfeuer"]');
  const aus = await pg.evaluate(() => { const S = window.DMA_SPIEL.pruef.zustand(); return !(S.duell && S.duell.uebung); });
  sage(aus, "im Menü lässt es sich ausschalten");
  await menueTippe("mehr", '[data-s="sparring"]');

  console.log("\nAUFGABEN SCHALTEN VON SELBST WEITER\n");
  const auf = await pg.evaluate(async () => {
    window.__rufe.length = 0;
    window.DMA_SPIEL.menue("start");
    const reiter = document.querySelector('#spPanel button[data-tab="deutsch"]');
    if (reiter) reiter.click();   /* der Reiter holt die erste Aufgabe */
    await new Promise((r) => setTimeout(r, 300));
    const b = document.querySelector('#spPanel button[data-tu="antwort"][data-o="gehe"]');
    if (b) b.click();
    await new Promise((r) => setTimeout(r, 2200));
    const n = window.__rufe.filter((r) => r.name === "spiel_aufgabe").length;   /* erste + automatisch nächste */
    const regel = /A1 3 · A2 4/.test((document.getElementById("spPanel") || {}).textContent || "");
    window.DMA_SPIEL.menue("anleitung");
    await new Promise((r) => setTimeout(r, 100));
    const anl = ((document.querySelector("#spPanel .sp-anleitung") || {}).textContent || "").length;
    window.DMA_SPIEL.schliessen();
    return { n, regel, anl };
  });
  sage(auf.n >= 2, "nach der richtigen Antwort kommt die nächste Aufgabe von selbst", auf.n + "× spiel_aufgabe");
  sage(auf.regel, "die Punkteregel steht dabei (A1 3 … C2 8, Stundengrenze)");
  sage(auf.anl > 600, "es gibt eine Spielanleitung", auf.anl + " Zeichen");

  console.log("\nDIE AUSRÜSTUNG HÄNGT NICHT AM VERLASSENEN PLATZ\n");
  const kapsel = await pg.evaluate(() => {
    const p = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]');
    p.classList.add("lc-platz-unterwegs");
    const r = p.querySelector(".sp-lp"), t = p.querySelector(".sp-tier");
    const v = [r, t].filter(Boolean).map((x) => getComputedStyle(x).visibility);
    p.classList.remove("lc-platz-unterwegs");
    return v;
  });
  sage(kapsel.length >= 2 && kapsel.every((v) => v === "hidden"), "auf der Reise sind Ring und Tier am alten Platz weg", kapsel.join(","));

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFassung 633: Schnellleiste, Mitspielen, Sparring, Heilen – alles da.\n");
  process.exit(fehler ? 1 : 0);
})();
