#!/usr/bin/env node
/* =====================================================================
   SONDE — FUNK 108–111: TÖNE, GEGENWEHR, HEILEN, MONSTER, FALLEN
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
      bea: { id: "bea", name: "Bea", seit: 6000, gesehen: 9e15, buehne: true, bild: "" }
    };
    window.LiveChat.pruefSitz({ lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000, zuruecksetzen: true, leute: leute });
    document.querySelectorAll(".view,.subview").forEach((v) => { v.dataset.active = "false"; });
    let e = document.getElementById("livechatArea");
    while (e && e !== document.body) { if (e.dataset && "active" in e.dataset) e.dataset.active = "true"; e = e.parentElement; }
    window.DMA_PRUEF.neuZeichnen();
    const ichId = "00000000-0000-4000-8000-000000000000", beaId = "11111111-1111-4111-8111-111111111111";
    window.LiveChat.spielIdVon = (id) => (id === "bea" ? beaId : "");
    const ich = { id: ichId, name: "Alex", lp: 100, lp_max: 100, kaputt: false, schild: 0, mauer_lp: 0, punkte: 200,
                  pflaster: 3, traenke: 1, waffen: ["zwille", "bogen", "laser"], mission: null, mana: 40, mana_max: 100, mitspielen: true };
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
      else if (name === "spiel_heilen") data = Object.assign({}, ich, { ok: true, geheilt: 25, fremd: true, geheilter: Object.assign({}, bea, { lp: 75 }) });
      else if (name === "spiel_treffer") data = { ok: true, zone: "koerper", schaden: 8, abgewehrt: 0, kaputt: false,
        ziel: Object.assign({}, bea, { lp: 42 }), ich: Object.assign({}, ich, { lp: 94 }), gegenwehr: 6,
        gegen_geschuetz: 4, gegen_tier: 2, tier: "fellmonster", lohn: 1 };
      return Promise.resolve({ data: data, error: null });
    } };
    window.DMA_SPIEL.pruef.setzen({ klient: klient, bereit: true, versucht: true, uid: ichId, ich: ich,
      stand: { [ichId]: ich, [beaId]: bea }, letzterAbruf: Date.now() });
    window.DMA_TONLOG = [];
  });
  await pg.waitForTimeout(800);

  console.log("\nTREFFERTÖNE — JEDE WAFFE KLINGT BEIM EINSCHLAG\n");
  const erwartet = { zwille: "bonk", bogen: "pfeiltreffer", laser: "lasertreffer", armbrust: "pfeiltreffer",
    tomahawk: "axttreffer", zielfernrohr: "knack", bazooka: "explosion2", eierwerfer: "eiknack", huehnerwerfer: "huhntreffer" };
  for (const [w, t] of Object.entries(erwartet)) {
    const log = await pg.evaluate(async (w) => {
      window.DMA_TONLOG.length = 0;
      const flug = window.DMA_SPIEL.pruef.geschossZeigen("uebungspuppe", "ich", w, 0, 0, "#f00", false);
      await new Promise((r) => setTimeout(r, flug + 150));
      return window.DMA_TONLOG.map((x) => x.name);
    }, w);
    sage(log.includes(t), w + " → Trefferton „" + t + "“", log.join(", "));
  }

  console.log("\nGEGENWEHR — DAS MONSTER SPRINGT WIRKLICH ZUM ANGREIFER\n");
  for (const [tier, tonName, zeichen] of [["fellmonster", "monsterbiss", "sp-kratzer"], ["stachelmonster", "stachelstich", "sp-kratzer"], ["drache", "drachenfeuer", "sp-feuer"]]) {
    const m = await pg.evaluate(async ({ tier, zeichen }) => {
      window.DMA_TONLOG.length = 0;
      const ichK = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .lc-kreis').getBoundingClientRect();
      const ziel = { x: ichK.left + ichK.width / 2, y: ichK.top + ichK.height / 2 };
      window.DMA_SPIEL.pruef.gegenwehrZeigen("bea", "ich", { gegenwehr: 9, gegen_geschuetz: 5, gegen_tier: 4, tier: tier });
      await new Promise((r) => setTimeout(r, 120));
      const kugel = Boolean(document.querySelector(".sp-kugel"));
      /* Am Scheitel des Angriffs (40–66 % von 1100 ms, 260 ms nach den Kugeln) */
      await new Promise((r) => setTimeout(r, 260 + 520 - 120));
      const t = document.querySelector(".sp-tier-sprung.sp-tier-" + tier);
      let abstand = -1;
      if (t) {
        /* Das Tier sitzt in seiner Zeichnung bei 84 | 84 von 100 — der
           Drache fliegt seit Fassung 638 und sitzt bei 90 | 12. */
        const r = t.getBoundingClientRect();
        const ax = tier === "drache" ? 0.9 : 0.84, ay = tier === "drache" ? 0.12 : 0.84;
        const tx = r.left + r.width * ax, ty = r.top + r.height * ay;
        abstand = Math.hypot(tx - ziel.x, ty - ziel.y) / (ichK.width / 2);
      }
      const spur = Boolean(document.querySelector("." + zeichen));
      await new Promise((r) => setTimeout(r, 700));
      const zahl = [...document.querySelectorAll('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-zahl')].map((z) => z.textContent).join(" | ");
      return { kugel, da: Boolean(t), abstand, spur, zahl, log: window.DMA_TONLOG.map((x) => x.name) };
    }, { tier, zeichen });
    sage(m.kugel && m.log.includes("geschuetzfeuer"), tier + ": das Geschütz feuert sichtbar und hörbar", m.log.join(", "));
    sage(m.da && m.abstand >= 0 && m.abstand < 1.0, tier + " springt bis ans Bild des Angreifers",
      m.da ? "Abstand " + m.abstand.toFixed(2) + " Radien" : "kein Tier zu sehen");
    sage(m.spur, tier + (tier === "drache" ? " faucht Feuer" : " hinterlässt Kratzer"));
    sage(m.log.includes(tonName), tier + " klingt nach „" + tonName + "“");
    sage(/−9 Gegenwehr/.test(m.zahl), "beim Angreifer steht die rote Zahl", m.zahl || "-");
    await pg.waitForTimeout(400);
  }

  console.log("\nEIN ECHTER SCHUSS SCHICKT DIE GEGENWEHR AN DEN RAUM\n");
  const schuss = await pg.evaluate(async () => {
    window.__rufe.length = 0; window.__raus.length = 0; window.DMA_TONLOG.length = 0;
    window.DMA_SPIEL.pruef.setzen({ waffe: "bogen" });
    const knopf = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="bea"]');
    const p = { id: "bea", name: "Bea", leer: false, ich: false, nummer: Number(knopf.dataset.lcPlatz) };
    window.DMA_SPIEL.tippAufPlatz(knopf, p, null);
    await new Promise((r) => setTimeout(r, 1900));
    const treffer = window.__raus.find((x) => x.ereignis === "treffer");
    return { rufe: window.__rufe.map((r) => r.name), treffer: treffer || null, log: window.DMA_TONLOG.map((x) => x.name) };
  });
  sage(schuss.rufe.includes("spiel_treffer"), "der Server rechnet den Treffer", schuss.rufe.join(","));
  sage(Boolean(schuss.treffer && schuss.treffer.gegen_geschuetz === 4 && schuss.treffer.gegen_tier === 2 && schuss.treffer.tier === "fellmonster"),
    "das Paket trägt Geschütz, Tier und Art mit", schuss.treffer ? JSON.stringify({ g: schuss.treffer.gegen_geschuetz, t: schuss.treffer.gegen_tier, a: schuss.treffer.tier }) : "kein Paket");
  sage(schuss.log.includes("pfeiltreffer") && schuss.log.includes("monsterbiss") && schuss.log.includes("geschuetzfeuer"),
    "Abschuss, Treffer und Gegenwehr klingen", schuss.log.join(", "));
  await pg.evaluate(() => window.DMA_SPIEL.pruef.setzen({ waffe: "" }));

  console.log("\nEINEN ANDEREN HEILEN\n");
  const heil = await pg.evaluate(async () => {
    window.__rufe.length = 0; window.__raus.length = 0;
    window.DMA_SPIEL.menue("duell");
    await new Promise((r) => setTimeout(r, 100));
    const k = document.querySelector('#spPanel button[data-tu="heilen"][data-ziel="bea"][data-art="trank"]');
    if (k) k.click();
    await new Promise((r) => setTimeout(r, 300));
    const ruf = window.__rufe.find((r) => r.name === "spiel_heilen");
    const paket = window.__raus.find((x) => x.ereignis === "heilung");
    const zahl = [...document.querySelectorAll('#lcPlaetze .lc-platz[data-lc-id="bea"] .sp-zahl')].map((z) => z.textContent).join(" | ");
    window.DMA_SPIEL.schliessen();
    return { knopf: Boolean(k), args: ruf ? ruf.args : null, paket: paket || null, zahl };
  });
  sage(heil.knopf, "im Reiter „Duell & Heilen“ steht bei Bea ein Heilknopf");
  sage(Boolean(heil.args && heil.args.p_ziel === "11111111-1111-4111-8111-111111111111" && heil.args.p_art === "trank"),
    "der Server bekommt Beas Spielkennung als p_ziel", JSON.stringify(heil.args));
  sage(/\+25/.test(heil.zahl), "die grüne Zahl steigt bei Bea auf", heil.zahl || "-");
  sage(Boolean(heil.paket && heil.paket.zielChat === "bea" && heil.paket.plus === 25 && heil.paket.sorte === "trank"), "der Raum erfährt, wer womit geheilt wurde",
    heil.paket ? "zielChat " + heil.paket.zielChat + ", +" + heil.paket.plus : "kein Paket");

  console.log("\nMINE LEGEN\n");
  const mine = await pg.evaluate(async () => {
    window.__rufe.length = 0;
    window.DMA_SPIEL.menue("schutz");
    await new Promise((r) => setTimeout(r, 100));
    const k = document.querySelector('#spPanel button[data-tu="legen"][data-d="mine"]');
    if (k) k.click();
    const leer = [...document.querySelectorAll("#lcPlaetze .lc-platz")].find((p) => !p.dataset.lcId);
    const nr = Number(leer && leer.dataset.lcPlatz);
    const legenModus = document.body.classList.contains("sp-legen");
    window.DMA_SPIEL.tippAufPlatz(leer, { leer: true, nummer: nr }, null);
    await new Promise((r) => setTimeout(r, 400));
    const ruf = window.__rufe.find((r) => r.name === "spiel_falle_legen");
    const marke = Boolean(leer.querySelector(".sp-falle-marke svg"));
    return { knopf: Boolean(k), legenModus, nr, args: ruf ? ruf.args : null, marke, danach: document.body.classList.contains("sp-legen") };
  });
  sage(mine.knopf && mine.legenModus, "„Mine legen“ im Laden schaltet auf „tippe auf einen Platz“");
  sage(Boolean(mine.args && mine.args.p_art === "mine" && mine.args.p_platz === mine.nr), "der Tipp legt sie auf genau diesen Platz",
    JSON.stringify(mine.args));
  sage(mine.marke, "die eigene Mine ist dort zu sehen");
  sage(!mine.danach, "danach ist der Legemodus wieder aus");

  console.log("\nIN EINE FALLTÜR FALLEN\n");
  const fall = await pg.evaluate(async () => {
    window.__rufe.length = 0; window.__raus.length = 0; window.DMA_TONLOG.length = 0;
    window.__falleAntwort = { ok: true, falle: true, art: "falltuer", schaden: 12, abgewehrt: 0, kaputt: false,
      ich: { id: "00000000-0000-4000-8000-000000000000", name: "Alex", lp: 88, lp_max: 100 } };
    window.DMA_SPIEL.platzGewechselt();
    await new Promise((r) => setTimeout(r, 650));
    const ich = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"]');
    const faellt = ich.classList.contains("sp-fallen") && Boolean(ich.querySelector(".sp-loch"));
    await new Promise((r) => setTimeout(r, 300));
    const zahl = [...ich.querySelectorAll(".sp-zahl")].map((z) => z.textContent).join(" | ");
    const ruf = window.__rufe.find((r) => r.name === "spiel_falle_pruefen");
    return { args: ruf ? ruf.args : null, faellt, zahl, log: window.DMA_TONLOG.map((x) => x.name),
             paket: window.__raus.find((x) => x.ereignis === "falle") || null };
  });
  sage(Boolean(fall.args && fall.args.p_platz > 0), "nach dem Platzwechsel fragt das Gerät nach einer Falle", JSON.stringify(fall.args));
  sage(fall.faellt, "das Bild fällt in das Loch");
  sage(fall.log.includes("falltuer"), "mit dem Falltür-Ton", fall.log.join(", "));
  sage(/−12 Falltür/.test(fall.zahl), "rote Zahl am eigenen Bild", fall.zahl || "-");
  sage(Boolean(fall.paket && fall.paket.sorte === "falltuer"), "der Raum sieht es auch – und dass es eine Falltür war",
    fall.paket ? "sorte " + fall.paket.sorte : "kein Paket");

  console.log("\nLEBENS- UND MANARING AUF DEM RAND\n");
  const ring = await pg.evaluate(() => {
    const b = document.querySelector('#lcPlaetze .lc-platz[data-lc-id="ich"] .sp-lp');
    return { da: Boolean(b), lp: Boolean(b && b.querySelector(".sp-lp-voll")), mana: Boolean(b && b.querySelector(".sp-mana-voll")),
             radius: b ? Number(b.dataset.radius) : 0, alterBalken: Boolean(document.querySelector(".sp-mana")) };
  });
  sage(ring.da && ring.lp && ring.mana, "am eigenen Bild: Lebensbogen und Manabogen");
  sage(ring.radius >= 0.9, "sie liegen auf dem Rand (Radius " + ring.radius.toFixed(2) + " des Bildes)");
  sage(!ring.alterBalken, "kein Balken mehr unter dem Namen");

  sage(konsolenFehler.length === 0, "keine Fehler in der Konsole", konsolenFehler.slice(0, 3).join(" | "));
  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n" : "\nFunk 108–111: alles da, alles hörbar.\n");
  process.exit(fehler ? 1 : 0);
})();
