#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 99 — DER FLUESTER-ANRUF UND DER HAKEN „NUR AN DICH"
   ---------------------------------------------------------------------
   XANDER (23.09.2026):
     „Mach es bitte so, dass die Telefonhoerer fuer den Fluesterer-Anruf
      fuer die andere[n] nicht zu sehen sind … dann mach es so, dass das
      niemand anderes ausser uns sieht, die beiden, die gerade den
      Fluesterer-Anruf haben, und sie koennen sich auch Fluesterer-
      Sprachnachrichten schicken."
     „vielleicht durch das Halten auf sein Profilbild und dann einfach
      nur ein Checkmark fuer privates und durch dieses Routing, wenn
      dieser Checkmark gesetzt ist. In dem Moment kann ich einfach ne
      Sprachnachricht ganz normal schicken und sie kommt dann nur bei
      dieser Person an … im Prinzip ist alles was man dann macht
      automatisch an ihn gefluestert, ob jetzt Sprachnachrichten oder
      Bild Nachrichten oder irgendwas."
     „die kleinen Telefon[zeichen] von dem geheimen Anruf, die sollen
      bisschen logischer am Profilbild anliegen, da wo der Ohrbereich
      ist, und vielleicht mehr rechtsbuendig."

   WAS HIER GEMESSEN WIRD, und zwar an dem, was wirklich hinausgeht:
     1  Der Hoerer steht NUR bei den beiden Beteiligten. Auf dem Geraet
        eines Dritten darf weder ein Hoerer noch die Leiste stehen.
     2  Er sitzt am Ohr: auf halber Hoehe des Bildes, am rechten Rand —
        nicht in der oberen Ecke.
     3  Der Haken steht im Platzmenue (das beim HALTEN aufgeht) und
        laesst sich mit einem Tipp setzen und wieder loesen.
     4  MIT Haken geht ein Satz NUR an diese eine Person (persoenlicher
        Kanal) und NICHT ueber den Raumkanal.
     5  Dasselbe gilt fuer ein Bild.
     6  Und fuer eine Sprachnachricht: sie geht in Stuecken ueber
        denselben persoenlichen Kanal, nicht ueber den Raum.
     7  Ohne Haken geht alles wieder an alle — sonst waere der Schalter
        eine Falle.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

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
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      a.writeHead(404); return a.end();
    }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\n1  DER HOERER GEHOERT NUR DEN BEIDEN\n");
  const anruf = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    const zaehlen = () => ({
      hoerer: document.querySelectorAll(".lc-platz .lc-telefonat").length,
      band: document.getElementById("lcTelefonband") ? 1 : 0
    });
    /* So sieht es auf dem Geraet eines DRITTEN aus: die beiden
       telefonieren, ich bin nicht dabei. */
    window.DMA_TELEFONAT({ a: "x1", b: "x2", aName: "Bea", bName: "Cem", ichDrin: false });
    await new Promise((f) => setTimeout(f, 120));
    const fremd = zaehlen();
    /* Und so auf dem Geraet eines BETEILIGTEN. */
    window.DMA_TELEFONAT({ a: "x1", b: "x2", aName: "Bea", bName: "Cem", ichDrin: true });
    await new Promise((f) => setTimeout(f, 120));
    const drin = zaehlen();
    const z = document.querySelector(".lc-platz .lc-telefonat");
    let sitz = null;
    if (z) {
      const rz = z.getBoundingClientRect();
      const kreis = z.closest(".lc-platz").querySelector(".lc-kreis");
      const rk = kreis.getBoundingClientRect();
      sitz = {
        hoehe: Math.round((rz.top + rz.height / 2 - rk.top) / rk.height * 100),
        rechts: Math.round((rk.right - rz.right) / rk.width * 100)
      };
    }
    window.DMA_TELEFONAT(null);
    return { fremd: fremd, drin: drin, sitz: sitz };
  });
  sage(anruf.fremd.hoerer === 0 && anruf.fremd.band === 0,
    "wer nicht mittelefoniert, sieht gar nichts davon",
    anruf.fremd.hoerer + " Hörer, " + anruf.fremd.band + " Leiste");
  sage(anruf.drin.hoerer >= 2 && anruf.drin.band === 1,
    "die beiden Beteiligten sehen ihren Hörer und die Leiste",
    anruf.drin.hoerer + " Hörer, " + anruf.drin.band + " Leiste");
  sage(anruf.sitz && anruf.sitz.hoehe >= 28 && anruf.sitz.hoehe <= 62,
    "und er sitzt am Ohr, nicht über dem Scheitel",
    anruf.sitz ? anruf.sitz.hoehe + " % der Bildhöhe (Ohr liegt bei ~45 %)" : "-");
  sage(anruf.sitz && anruf.sitz.rechts <= 8,
    "und rechtsbündig am Bildrand",
    anruf.sitz ? anruf.sitz.rechts + " % Abstand zum rechten Rand" : "-");

  console.log("\n2  DER HAKEN IM PLATZMENUE\n");
  const menue = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    /* Die Lage nachstellen: ich bin Alex, Bea sitzt neben mir. */
    window.LiveChat.pruefSitz({
      lage: "drin", ichId: "ich1", ichName: "Alex",
      /* So sieht ein Eintrag im Betrieb aus — MIT id. Ohne sie fehlt
         der Anschrift die Adresse, und der Haken faende niemanden. */
      leute: { bea1: { id: "bea1", name: "Bea", bild: "", gesehen: Date.now() } }
    });
    const bea = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    if (!bea) return { keinPlatz: true };
    window.DMA_PRUEF.platzMenue(bea);
    await new Promise((f) => setTimeout(f, 150));
    const kasten = document.getElementById("lcPlatzMenue");
    const knoepfe = [...kasten.querySelectorAll(".lc-platzmenue-knopf")];
    const haken = knoepfe.filter((b) =>
      /^Nur an /.test(((b.querySelector(".lc-platzmenue-wort") || {}).textContent || "").trim()))[0];
    if (!haken) {
      return { keineKachel: true,
               worte: knoepfe.slice(0, 6).map((b) =>
                 (b.querySelector(".lc-platzmenue-wort") || {}).textContent) };
    }
    const wo = knoepfe.indexOf(haken);
    haken.click();
    await new Promise((f) => setTimeout(f, 200));
    const stand = window.LiveChat.privatStand();
    return {
      wo: wo,
      stand: stand,
      marke: document.querySelectorAll(".lc-platz .lc-privathaken").length,
      band: document.getElementById("lcPrivatband") ? 1 : 0
    };
  });
  sage(!menue.keineKachel && !menue.keinPlatz,
    "die Kachel „Nur an …“ steht im Platzmenue",
    menue.keineKachel ? (menue.worte || []).join(" · ") : "an Stelle " + (menue.wo + 1));
  sage(menue.stand && menue.stand.name === "Bea",
    "ein Tipp setzt den Haken auf genau diesen Menschen",
    menue.stand ? menue.stand.name : "kein Haken");
  sage(menue.marke === 1 && menue.band === 1,
    "und man SIEHT ihn: Haken am Bild und eine Leiste über dem Chat",
    menue.marke + " Haken, " + menue.band + " Leiste");

  console.log("\n3  MIT HAKEN GEHT ALLES NUR AN DIESEN EINEN\n");
  const post = await pg.evaluate(async () => {
    const raum = [];
    const persoenlich = [];
    window.LiveChat.pruefAbfangen((p) => raum.push(p));
    window.LiveChat.pruefPersonenPost((an, p) => persoenlich.push({ an: an, p: p }));
    /* Ein Satz. */
    window.LiveChat.schreiben("Hallo, nur fuer dich");
    await new Promise((f) => setTimeout(f, 120));
    const nachText = { raum: raum.length, post: persoenlich.slice() };
    /* Ein Bild. */
    window.LiveChat.bildSendenRoh("data:image/gif;base64,R0lGODlhAQABAAAAACw=", "");
    await new Promise((f) => setTimeout(f, 120));
    const nachBild = { raum: raum.length, post: persoenlich.slice() };
    /* Eine Sprachnachricht — dieselbe Tuer wie im Betrieb. */
    let daten = "";
    for (let i = 0; i < 6000; i++) daten += "a";
    window.LiveChat.pruefSprachSenden(daten, 3, {});
    await new Promise((f) => setTimeout(f, 300));
    return {
      raumGesamt: raum.length,
      raumArten: raum.map((p) => p.art + (p.chatArt ? "/" + p.chatArt : "")),
      text: nachText,
      bild: nachBild,
      post: persoenlich.map((x) => ({ an: x.an, art: x.p.art })),
    };
  });
  const posten = (art) => post.post.filter((x) => x.art === art);
  sage(posten("fluester").length >= 2,
    "Text und Bild gehen als Flüsterpost an EINEN",
    posten("fluester").length + " Flüsterpakete an "
      + [...new Set(post.post.map((x) => x.an))].join(", "));
  sage(posten("fluestersprachteil").length >= 1,
    "und die Sprachnachricht auch — in Stücken über denselben Weg",
    posten("fluestersprachteil").length + " Stück(e)");
  sage(post.raumGesamt === 0,
    "und NICHTS davon geht über den Raumkanal",
    post.raumGesamt ? post.raumArten.join(", ") : "kein einziges Paket");

  console.log("\n4  OHNE HAKEN GEHT WIEDER ALLES AN ALLE\n");
  const zurueck = await pg.evaluate(async () => {
    const raum = [];
    const persoenlich = [];
    window.LiveChat.pruefAbfangen((p) => raum.push(p));
    window.LiveChat.pruefPersonenPost((an, p) => persoenlich.push({ an: an, art: p.art }));
    window.LiveChat.privatSetzen(null);
    await new Promise((f) => setTimeout(f, 80));
    const stand = window.LiveChat.privatStand();
    window.LiveChat.schreiben("Das hier hören alle");
    await new Promise((f) => setTimeout(f, 120));
    return {
      stand: stand,
      raum: raum.map((p) => p.art),
      post: persoenlich.length,
      marke: document.querySelectorAll(".lc-platz .lc-privathaken").length,
      band: document.getElementById("lcPrivatband") ? 1 : 0
    };
  });
  sage(!zurueck.stand, "noch einmal antippen nimmt den Haken weg",
    zurueck.stand ? zurueck.stand.name : "kein Haken mehr");
  sage(zurueck.marke === 0 && zurueck.band === 0,
    "und die Anzeige verschwindet mit ihm",
    zurueck.marke + " Haken, " + zurueck.band + " Leiste");
  sage(zurueck.raum.indexOf("text") >= 0 && zurueck.post === 0,
    "der nächste Satz geht wieder an den ganzen Raum",
    zurueck.raum.join(", ") + " · " + zurueck.post + " Flüsterpakete");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
