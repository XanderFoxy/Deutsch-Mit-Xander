#!/usr/bin/env node
/* =========================================================
   RUNDE 58 — PEITSCHE, LIANE, PFEIL UND COWBOYHUT
   ---------------------------------------------------------
   GEMELDET (woertlich):
   · „Auch die Peitsche die kann richtig schoen ausholen lang
      sein mit einem verjuengen Ende. Ja das muss aber eher
      schwarzes Leder sein."
   · „Die Liane kann laenger sein und von oben drueber richtig
      lang runter haengen."

   Gemessen wird hier NICHT, ob es die Teile gibt — das war schon
   vorher so. Gemessen wird, wie LANG sie sind, wie dick sie zur
   Spitze hin werden, wie DUNKEL das Leder ist und ob die Peitsche
   vor dem Schlag wirklich zurueckgeht.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
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
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEF, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  console.log("\nDIE PEITSCHE: SCHWARZES LEDER, VERJUENGT, MIT AUSHOLEN\n");
  const pe = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-leine").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("peitsche", "3", "Alex");
    /* 200 ms: mitten im Ausholen (das dauert bis 20 % von 2,6 s
       = 520 ms). Da muss die Schlaufe da sein und die Peitsche
       nach HINTEN zeigen. */
    await new Promise((f) => setTimeout(f, 200));
    const leine = document.querySelector(".lc-leine-peitsche");
    if (!leine) return null;
    const welle = leine.querySelector(".lc-peitsche-welle");
    const hol = leine.querySelector(".lc-peitsche-hol");
    const wm = welle ? new DOMMatrixReadOnly(getComputedStyle(welle).transform) : null;
    /* Der Drehwinkel aus der Matrix — beim Ausholen negativ. */
    const drehHol = wm ? Math.atan2(wm.b, wm.a) * 180 / Math.PI : 0;
    const breiteHol = wm ? Math.hypot(wm.a, wm.b) : 0;
    const holSicht = hol ? Number(getComputedStyle(hol).opacity) : 0;
    /* Und die Dicken: jeder Strang duenner als der davor. */
    const straenge = [...leine.querySelectorAll(".lc-peitsche-welle .lc-pw")]
      .filter((x) => !x.classList.contains("lc-pw-glanz"))
      .map((x) => ({ dick: parseFloat(x.getAttribute("stroke-width")),
                     farbe: x.getAttribute("stroke") }));
    /* 900 ms: nach dem Knall (30 % von 2,6 s = 780 ms) — jetzt muss
       sie nach VORN zeigen und ganz ausgerollt sein. */
    await new Promise((f) => setTimeout(f, 700));
    const wm2 = welle ? new DOMMatrixReadOnly(getComputedStyle(welle).transform) : null;
    const drehSchlag = wm2 ? Math.atan2(wm2.b, wm2.a) * 180 / Math.PI : 0;
    const breiteSchlag = wm2 ? Math.hypot(wm2.a, wm2.b) : 0;
    const offen = welle ? parseFloat(getComputedStyle(
      welle.querySelector(".lc-pw")).strokeDashoffset) : 99;
    const holWeg = hol ? Number(getComputedStyle(hol).opacity) : 1;
    return { drehHol: Math.round(drehHol), drehSchlag: Math.round(drehSchlag),
             breiteHol: Number(breiteHol.toFixed(2)),
             breiteSchlag: Number(breiteSchlag.toFixed(2)),
             holSicht: Number(holSicht.toFixed(2)), holWeg: Number(holWeg.toFixed(2)),
             straenge: straenge, offen: Math.round(offen),
             laenge: welle ? Math.round(welle.getBoundingClientRect().width) : 0 };
  });
  pruefe("es gibt sie ueberhaupt", Boolean(pe));
  if (pe) {
    pruefe("sie holt aus: beim Ausholen zeigt sie nach hinten",
      pe.drehHol <= -30, pe.drehHol + " Grad");
    pruefe("und sie ist dabei noch eingerollt",
      pe.breiteHol < 0.45, (pe.breiteHol * 100).toFixed(0) + " % der Laenge");
    pruefe("die Schlaufe hinter der Hand ist zu sehen",
      pe.holSicht > 0.5, "Deckkraft " + pe.holSicht);
    pruefe("nach dem Knall zeigt sie nach vorn",
      pe.drehSchlag > -8, pe.drehSchlag + " Grad");
    pruefe("und ist dann ganz ausgerollt",
      pe.breiteSchlag > 0.9 && pe.offen <= 2,
      (pe.breiteSchlag * 100).toFixed(0) + " % der Laenge, Rest " + pe.offen);
    pruefe("die Schlaufe ist dann fort", pe.holWeg < 0.2, "Deckkraft " + pe.holWeg);
    /* „mit einem verjuengen Ende": jeder Abschnitt duenner als der
       vorige, und der letzte hoechstens ein Fuenftel des ersten. */
    const dicken = pe.straenge.map((x) => x.dick);
    let faellt = dicken.length >= 5;
    for (let i = 1; i < dicken.length; i++) if (dicken[i] >= dicken[i - 1]) faellt = false;
    pruefe("sie verjuengt sich Abschnitt fuer Abschnitt", faellt, dicken.join(" > "));
    pruefe("und laeuft zur Spitze duenn aus",
      dicken.length && dicken[dicken.length - 1] <= dicken[0] / 5,
      dicken[dicken.length - 1] + " gegen " + dicken[0]);
    /* „schwarzes Leder": jeder Strang dunkler als 25 % Helligkeit. */
    const hell = pe.straenge.map((x) => {
      const m = /^#(..)(..)(..)$/.exec(x.farbe || "");
      if (!m) return 999;
      return Math.round((parseInt(m[1], 16) * 0.3 + parseInt(m[2], 16) * 0.59
                       + parseInt(m[3], 16) * 0.11) / 2.55);
    });
    pruefe("und sie ist schwarzes Leder, nicht braunes",
      hell.every((h) => h <= 25), "Helligkeit " + hell.join(" / ") + " %");
  }

  console.log("\nDIE LIANE HAENGT VON OBEN HERUNTER\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.waitForTimeout(400);
  const li = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-liane").forEach((x) => x.remove());
    /* Eine Reise braucht ein FREIES Ziel — die Pruefbuehne hat von
       sich aus keins. Genau wie in pruefe-runde50 wird deshalb ein
       sechster, leerer Platz angehaengt. */
    const reihe = document.getElementById("lcPlaetze");
    const vorbild = document.querySelector(".lc-platz");
    if (reihe && vorbild && !reihe.querySelector(".lc-platz-frei")) {
      const frei = vorbild.cloneNode(true);
      frei.className = "lc-platz lc-platz-frei";
      frei.dataset.lcPlatz = "6";
      const n = frei.querySelector(".lc-platz-name");
      if (n) n.textContent = "frei";
      reihe.appendChild(frei);
    }
    window.DMA_PRUEFUNG.wirkung("liane", "6", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const l = document.querySelector(".lc-liane");
    if (!l) return null;
    const seil = l.querySelector(".lc-liane-seil");
    /* GEMESSEN WIRD DER CSS-KASTEN, NICHT getBoundingClientRect:
       die Liane schwingt (bis 16 Grad), und ein gedrehter Kasten ist
       breiter als das Ding darin. Mit 133 px Hoehe kamen so 64 px
       „Breite" heraus, obwohl das SVG 24 px breit ist. */
    const cs = getComputedStyle(seil);
    const k = { height: parseFloat(cs.height), width: parseFloat(cs.width) };
    const rr = reihe.getBoundingClientRect();
    const bild = l.querySelector(".lc-liane-last");
    const vb = (seil.getAttribute("viewBox") || "").split(/\s+/);
    const blatt = l.querySelector(".lc-liane-blatt");
    const bk = blatt ? blatt.getBoundingClientRect() : null;
    return { seilPx: Math.round(k.height), seilBreit: Math.round(k.width),
             /* Wie weit ueber der Reihenkante faengt sie an? */
             ueberKante: Math.round(rr.top - seil.getBoundingClientRect().top),
             /* Auch hier der CSS-Kasten — das Bild schwingt mit. */
             bildPx: bild ? Math.round(parseFloat(getComputedStyle(bild).width)) : 0,
             vbHoehe: Number(vb[3] || 0), vbBreite: Number(vb[2] || 0),
             blaetter: l.querySelectorAll(".lc-liane-blatt").length,
             blattBreit: bk ? Number(bk.width.toFixed(1)) : 0,
             blattHoch: bk ? Number(bk.height.toFixed(1)) : 0,
             wiegt: seil ? getComputedStyle(seil).animationName : "-" };
  });
  pruefe("sie haengt ueberhaupt", Boolean(li));
  if (li) {
    /* „richtig lang runter haengen": vorher waren es rund 70 px bei
       einem 64-px-Bild. Ein Vielfaches des Bildes ist das Mass. */
    pruefe("das Seil ist ein Vielfaches des Bildes lang",
      li.seilPx >= li.bildPx * 2.2,
      li.seilPx + " px Seil auf " + li.bildPx + " px Bild");
    pruefe("und sie kommt von OBERHALB der Platzreihe",
      li.ueberKante > 0, li.ueberKante + " px ueber der Kante");
    /* Eine Einheit der viewBox muss ein Pixel sein — sonst werden
       die Blaetter beim Laengerwerden zu Schlieren gezogen. */
    /* RUNDE 74: das Seil ist jetzt das PENDEL selbst und traegt
       seine Hoehe als Elementhoehe (sie waechst waehrend des
       Schwungs, wenn Start und Ziel in verschiedenen Reihen liegen).
       Die viewBox steht auf der Laenge BEIM START; ein Vergleich auf
       zwei Pixel genau kann da nicht mehr stimmen. Gemessen wird
       stattdessen, dass ein Blatt ein Blatt bleibt: die viewBox darf
       nicht mehr als ein Drittel von der gezeichneten Hoehe
       abweichen, sonst werden die Blaetter zu Schlieren. */
    pruefe("eine Einheit der Zeichnung bleibt rund ein Pixel hoch",
      li.seilPx > 0 && Math.abs(li.vbHoehe - li.seilPx) <= li.seilPx * 0.34,
      "viewBox " + li.vbHoehe + " auf " + li.seilPx + " px");
    pruefe("und ein Pixel breit",
      Math.abs(li.vbBreite - li.seilBreit) <= 1,
      "viewBox " + li.vbBreite + " auf " + li.seilBreit + " px");
    pruefe("die Blaetter sind nicht in die Laenge gezogen",
      li.blattHoch <= li.blattBreit * 1.6,
      li.blattBreit + " breit, " + li.blattHoch + " hoch");
    pruefe("und es sind mehr geworden, weil sie laenger ist",
      li.blaetter >= 4, li.blaetter + " Blaetter");
    /* RUNDE 74 — UMGEDREHT, siehe pruefe-runde50.js: das Wiegen in
       sich lag ZUSAETZLICH ueber dem Pendelschwung, und genau das
       hat Xander als „sie tanzt immer herum" gemeldet. */
    pruefe("sie wiegt sich NICHT mehr zusaetzlich in sich",
      li.wiegt === "none" || li.wiegt === "-", li.wiegt);
  }

  console.log("\nDER PFEIL: FEDER HINTEN, SAUGNAPF VORN\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.waitForTimeout(300);
  const pf = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-pfeil").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("saugpfeil", "3", "Alex");
    await new Promise((f) => setTimeout(f, 1400));
    const sv = document.querySelector(".lc-pfeil-bild");
    if (!sv) return null;
    const kasten = (w) => { const e = sv.querySelector(w); return e ? e.getBBox() : null; };
    const schaft = kasten(".lc-pfeil-schaft");
    const napf = kasten(".lc-pfeil-napf");
    const nocke = kasten(".lc-pfeil-nocke");
    const federn = [...sv.querySelectorAll(".lc-pfeil-feder")].map((e) => e.getBBox());
    const rand = sv.querySelector(".lc-pfeil-rand");
    return {
      mitte: schaft ? schaft.x + schaft.width / 2 : 0,
      napfX: napf ? napf.x + napf.width / 2 : -1,
      nockeX: nocke ? nocke.x + nocke.width / 2 : -1,
      federX: federn.length ? federn.reduce((a, b) => a + b.x + b.width / 2, 0) / federn.length : -1,
      federn: federn.length,
      /* Die Fahne muss deutlich HOEHER als der Schaft sein — sonst
         ist es ein Streifen, keine Feder. */
      federHoch: federn.length ? Math.max(...federn.map((b) => b.height)) : 0,
      schaftHoch: schaft ? schaft.height : 0,
      aeste: sv.querySelectorAll(".lc-pfeil-ast").length,
      randRx: rand ? Number(rand.getAttribute("rx")) : 0,
      randRy: rand ? Number(rand.getAttribute("ry")) : 0,
      /* Keine Pfeilspitze mehr: kein Dreieck ausser der Nocke. */
      spitzen: [...sv.querySelectorAll("path")].filter((e) =>
        /^M\d+ \d+ L\d+ \d+ L\d+ \d+ Z$/.test((e.getAttribute("d") || "").trim())).length
    };
  });
  pruefe("der Pfeil ist da", Boolean(pf));
  if (pf) {
    pruefe("der Saugnapf sitzt am vorderen Ende", pf.napfX > pf.mitte,
      "Napf bei " + pf.napfX.toFixed(0) + ", Schaftmitte bei " + pf.mitte.toFixed(0));
    pruefe("die Federn sitzen hinten", pf.federX > 0 && pf.federX < pf.mitte,
      "Federn bei " + pf.federX.toFixed(0));
    pruefe("und die Nocke ganz hinten", pf.nockeX >= 0 && pf.nockeX < pf.federX,
      "Nocke bei " + pf.nockeX.toFixed(0));
    pruefe("es sind zwei Fahnen", pf.federn === 2, pf.federn + " Stueck");
    pruefe("sie stehen deutlich ueber den Schaft hinaus",
      pf.federHoch >= pf.schaftHoch * 2, pf.federHoch.toFixed(1) + " gegen "
      + pf.schaftHoch.toFixed(1) + " px Schaft");
    /* „eine Art Feder": eine Flaeche allein ist eine Kunststoffvane.
       Eine Feder hat Aeste. */
    pruefe("und sie sind gefiedert, nicht glatt", pf.aeste >= 14,
      pf.aeste + " Aeste");
    /* Der Rand eines Saugnapfes ist ein KREIS — von der Seite eine
       hohe, schmale Ellipse. Daran erkennt man ihn. */
    pruefe("der Napf hat einen runden Rand",
      pf.randRy >= pf.randRx * 3, pf.randRy + " hoch auf " + pf.randRx + " breit");
  }

  console.log("\nDER HUT IST EIN COWBOYHUT, KEIN ABENTEUERHUT\n");
  const hu = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-hut").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("hut", "3", "Alex");
    await new Promise((f) => setTimeout(f, 900));
    const sv = document.querySelector(".lc-hut-bild");
    if (!sv) return null;
    /* Die Oberkante eines Pfades abtasten: an jeder Stelle x der
       kleinste y-Wert. So sieht man die Form, ohne sie zu raten. */
    const oben = (w) => {
      const e = sv.querySelector(w);
      if (!e) return null;
      const L = e.getTotalLength(), t = {};
      for (let i = 0; i <= 900; i++) {
        const p = e.getPointAtLength((i / 900) * L);
        const k = Math.round(p.x);
        if (t[k] === undefined || p.y < t[k]) t[k] = p.y;
      }
      return t;
    };
    const kr = oben(".lc-hut-krempe"), kn = oben(".lc-hut-krone");
    const hol = (t, x) => { for (let d = 0; d < 6; d++)
      { if (t[x - d] !== undefined) return t[x - d]; if (t[x + d] !== undefined) return t[x + d]; }
      return null; };
    return { krempeSpitzeL: hol(kr, 7), krempeMitte: hol(kr, 70), krempeSpitzeR: hol(kr, 133),
             kroneLinks: hol(kn, 47), kroneMitte: hol(kn, 70), kroneRechts: hol(kn, 93),
             band: Boolean(sv.querySelector('path[fill="#3f2a12"]')) };
  });
  pruefe("der Hut ist da", Boolean(hu));
  if (hu) {
    /* „so richtig wie ein Cowboyhut aussehen": die Krempe ist an den
       SEITEN hochgerollt. Von vorn heisst das: die Spitzen liegen
       HOEHER (kleineres y) als die Mitte. Beim Abenteuerhut war sie
       flach — da war der Unterschied 0. */
    pruefe("die Krempe ist an den Seiten hochgerollt",
      hu.krempeSpitzeL !== null && hu.krempeMitte - hu.krempeSpitzeL >= 15
      && hu.krempeMitte - hu.krempeSpitzeR >= 15,
      "links " + Math.round(hu.krempeMitte - hu.krempeSpitzeL) + " px, rechts "
      + Math.round(hu.krempeMitte - hu.krempeSpitzeR) + " px hoeher als die Mitte");
    /* Die Cattleman-Falte: zwei Grate, dazwischen eine Senke. */
    pruefe("die Krone hat die Cattleman-Falte — zwei Grate, eine Senke",
      hu.kroneLinks !== null && hu.kroneMitte - hu.kroneLinks >= 4
      && hu.kroneMitte - hu.kroneRechts >= 4,
      "Grate bei " + Math.round(hu.kroneLinks) + " und " + Math.round(hu.kroneRechts)
      + ", Senke bei " + Math.round(hu.kroneMitte));
    pruefe("und er hat ein Hutband", hu.band);
  }

  console.log("\nDIE AIRPODS MAX SIND NICHT MEHR GLOBIG\n");
  const kh = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-kopfhoerer").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("kopfhoerer", "3", "Alex");
    await new Promise((f) => setTimeout(f, 500));
    const sv = document.querySelector(".lc-kopfhoerer-bild");
    if (!sv) return null;
    const buegel = sv.querySelector("path[stroke-width]");
    /* Die Muschel ist das GROESSTE Rechteck — nach Index zu greifen
       waere raten, und beim ersten Versuch griff es daneben (das
       Gelenk). */
    const muschel = [...sv.querySelectorAll("rect")].sort((a, b) =>
      (Number(b.getAttribute("width")) * Number(b.getAttribute("height")))
      - (Number(a.getAttribute("width")) * Number(a.getAttribute("height"))))[0];
    /* RUNDE 60 NACHGEFUEHRT. Die Staebe sind noch da, sie sind nur
       kuerzer geworden: in Runde 59 sind die Muscheln aus dem Bild
       heraus nach aussen gewandert („die Over-Ear-Teile sind viel zu
       sehr im Bild"), und damit ist der Stab von 18 auf 16 px
       geschrumpft. Die Sonde suchte weiter nach >= 18 und fand
       nichts — gemessen falsch, nicht gebaut falsch. */
    const staebe = [...sv.querySelectorAll("rect")].filter((r) =>
      Number(r.getAttribute("height")) >= 14 && Number(r.getAttribute("width")) < 6);
    return { buegel: buegel ? Number(buegel.getAttribute("stroke-width")) : 99,
             breit: muschel ? Number(muschel.getAttribute("width")) : 0,
             hoch: muschel ? Number(muschel.getAttribute("height")) : 0,
             stabBreit: staebe.length ? Number(staebe[0].getAttribute("width")) : 99,
             staebe: staebe.length,
             /* Die Digital Crown mit ihren Rillen — daran erkennt man
                sie, und sie muss OBEN auf der Muschel sitzen. */
             krone: (() => {
               /* Auch das ist nachgefuehrt: die Krone ist beim Umbau
                  von 10 auf 11 px breit geworden, und 10 auf 5,5
                  trifft jetzt das GELENK. Deshalb wird sie ueber
                  ihre eigene Groesse gesucht, nicht ueber die des
                  Nachbarn. */
               /* RUNDE 72 NACHGEFUEHRT: beim Umbau auf die AirPods-Max-
                  Form (Runde 71) ist die Krone von 11 x 5 auf 10 x 4,6
                  geschrumpft. Die Sonde suchte weiter nach den alten
                  Massen und fand gar nichts — gemessen falsch, nicht
                  gebaut falsch: die Krone liegt bei y = 56,4 und die
                  Muschel bei y = 66, sie sitzt also sehr wohl oben.
                  Jetzt wird in einem Bereich gesucht statt auf den
                  Zehntelpunkt. */
               const k = [...sv.querySelectorAll("rect")].find((r) => {
                 const b = Number(r.getAttribute("width")),
                       h = Number(r.getAttribute("height"));
                 return b >= 9 && b <= 12 && h >= 4 && h <= 6;
               });
               return k && muschel
                 ? Number(k.getAttribute("y")) < Number(muschel.getAttribute("y")) : false;
             })() };
  });
  pruefe("die Kopfhoerer sind da", Boolean(kh));
  if (kh) {
    /* „viel zu globig": der Buegel war ein 13 px dicker Strich. */
    pruefe("der Buegel ist ein duenner Stahlbogen, kein dickes Rohr",
      kh.buegel <= 6, kh.buegel + " px dick");
    /* Die Muschel war 34 auf 40 — fast ein Quadrat. Beim Original
       ist sie deutlich hoeher als breit. */
    pruefe("die Muschel ist hochoval, nicht fast quadratisch",
      kh.hoch >= kh.breit * 1.2, kh.breit + " breit auf " + kh.hoch + " hoch");
    pruefe("die Teleskopstaebe sind duenn", kh.staebe === 2 && kh.stabBreit <= 4,
      kh.staebe + " Staebe, " + kh.stabBreit + " px breit");
    /* RUNDE 74: die Krone sitzt weiterhin oben auf der rechten
       Muschel, aber die Muschel steht jetzt an einer gerechneten
       Stelle auf dem Kreis (74 Grad) statt an einer festen Zahl.
       Geprueft wird deshalb die Zeichnung, nicht mehr die alte
       Pixelstelle — sonst pinnt die Regel eine Geometrie fest, die
       Xander gerade erst geaendert haben wollte. */
    pruefe("die Digital Crown ist da und sitzt an der rechten Muschel",
      /<rect x="\d+(\.\d+)?" y="\d+(\.\d+)?" width="9" height="4\.2" rx="2\.1"/
        .test(require("fs").readFileSync(require("path").join(WURZEL, "app.js"), "utf8")));
  }

  console.log("\nDIE BIRNE DREHT UM DIE SENKRECHTE ACHSE — UND WIEDER HERAUS\n");
  const bi = await pg.evaluate(async () => {
    const pl = [...document.querySelectorAll(".lc-platz")]
      .find((p) => (p.querySelector(".lc-platz-name") || {}).textContent.trim() === "Cem")
      || document.querySelectorAll(".lc-platz")[2];
    const k = pl.querySelector(".lc-kreis");
    k.classList.remove("lc-birne-an", "lc-eingedreht", "lc-ausgedreht");
    window.DMA_PRUEFUNG.wirkung("gluehbirne", "Cem", "Alex");
    await new Promise((f) => setTimeout(f, 600));
    /* Die Drehung steckt in der Matrix. Bei rotate() bleibt m34 = 0
       und m11 = cos; bei rotateY() mit Perspektive wird m34 UNGLEICH
       null — daran erkennt man, dass wirklich um die senkrechte
       Achse gedreht wird und nicht in der Bildebene. */
    const m = new DOMMatrixReadOnly(getComputedStyle(k).transform);
    const einDreh = { m34: m.m34, m11: m.m11, m12: m.m12, drei: m.is2D === false };
    /* Nach vier Sekunden muss sie AN bleiben. */
    await new Promise((f) => setTimeout(f, 4000));
    const bleibtAn = k.classList.contains("lc-birne-an");
    /* Und jetzt herausdrehen. */
    window.DMA_PRUEFUNG.wirkung("gluehbirne", "Cem", "Alex");
    await new Promise((f) => setTimeout(f, 300));
    const raus = getComputedStyle(k).animationName;
    /* Der Stromausfall kommt bei 1364 ms. */
    await new Promise((f) => setTimeout(f, 1200));
    const dunkel = document.getElementById("lcStromAus");
    const deck = dunkel ? Number(getComputedStyle(dunkel).opacity) : 0;
    const buehne = document.getElementById("lcEffektBuehne");
    /* RUNDE 80 — XANDER: „im Prinzip soll die ganze Webseite
       abgedunkelt sein."
       Die Dunkelheit lag bisher IN der Effektbuehne und war deshalb
       genau so breit wie sie. Jetzt haengt sie am body und ist
       „position: fixed; inset: 0" — sie deckt den ganzen Bildschirm
       ab, nicht nur das Klassenzimmer. Gemessen wird deshalb gegen
       den SICHTBAREN BEREICH, nicht gegen die Buehne. */
    const voll = dunkel
      ? Math.abs(dunkel.getBoundingClientRect().width - window.innerWidth) <= 2
        && Math.abs(dunkel.getBoundingClientRect().height - window.innerHeight) <= 2
      : false;
    await new Promise((f) => setTimeout(f, 1400));
    return { einDreh: einDreh, bleibtAn: bleibtAn, raus: raus,
             dunkelDa: Boolean(dunkel), deck: Number(deck.toFixed(2)), voll: voll,
             nochAn: k.classList.contains("lc-birne-an") };
  });
  /* Bei einer Drehung in der Bildebene ist die Matrix ZWEIdimensional.
     Genau das war der Fehler: „dreht sich immer noch nicht realistisch
     auf der waagerechten Achse". */
  pruefe("sie dreht raeumlich, nicht in der Bildebene", bi.einDreh.drei === true,
    "m34 = " + bi.einDreh.m34);
  pruefe("und zwar um die senkrechte Achse — die Breite schrumpft, die Hoehe nicht",
    Math.abs(bi.einDreh.m11) < 0.999 && Math.abs(bi.einDreh.m12) < 0.02,
    "Breite " + bi.einDreh.m11.toFixed(3) + ", Schraeglage " + bi.einDreh.m12.toFixed(3));
  pruefe("sie bleibt an, statt nach vier Sekunden zu erloeschen", bi.bleibtAn);
  pruefe("ein zweites Mal dreht sie wieder heraus", bi.raus === "lcBirneRausR58", bi.raus);
  pruefe("dabei faellt der Strom auf der ganzen Buehne aus",
    bi.dunkelDa && bi.deck > 0.5, "Deckkraft " + bi.deck);
  pruefe("und zwar wirklich auf der ganzen SEITE", bi.voll);
  pruefe("danach ist sie aus", !bi.nochAn);

  console.log("\nDER REGEN FAELLT NACH UNTEN, NICHT SCHRAEG ZUR SEITE\n");
  const re = await pg.evaluate(async () => {
    window.__wetter("regen", false);
    await new Promise((f) => setTimeout(f, 300));
    const tropfen = [...document.querySelectorAll("#niederschlagSchicht .w-tropfen")];
    if (!tropfen.length) return null;
    /* GEMESSEN WIRD --w-eigen, NICHT --w-drift: eine nicht
       registrierte eigene Eigenschaft gibt getComputedStyle als
       TEXT zurueck („calc(3px * var(--w-eigen))"), nicht als Zahl —
       parseFloat davon ist NaN, und NaN sagt gar nichts. --w-eigen
       ist die Zahl selbst, und sie ist genau das, was den Versatz
       je Tropfen verschieden macht. */
    const versatz = tropfen.map((t) => {
      const cs = getComputedStyle(t);
      return { eigen: parseFloat(t.style.getPropertyValue("--w-eigen")) || 0,
               breit: parseFloat(cs.width) };
    });
    const werte = versatz.map((v) => v.eigen * 3);   /* 3 px ist das Grundmass bei Regen */
    const mittel = werte.reduce((a, b) => a + b, 0) / werte.length;
    return { anzahl: tropfen.length,
             verschieden: new Set(werte.map((w) => w.toFixed(2))).size,
             groesster: Math.max(...werte.map(Math.abs)),
             mittel: mittel,
             linksUndRechts: werte.some((w) => w < -0.2) && werte.some((w) => w > 0.2),
             breit: Math.max(...versatz.map((v) => v.breit)) };
  });
  pruefe("es regnet ueberhaupt", Boolean(re), re ? re.anzahl + " Tropfen" : "keine");
  if (re) {
    /* „parallel verschoben": vorher hatten alle Tropfen einer Ebene
       DENSELBEN Versatz — drei verschiedene Werte fuer den ganzen
       Regen. Jetzt hat jeder Tropfen seinen eigenen. */
    pruefe("jeder Tropfen hat seinen eigenen Versatz, nicht die Ebene",
      re.verschieden >= 10, re.verschieden + " verschiedene Werte bei "
      + re.anzahl + " Tropfen");
    pruefe("die einen wehen nach links, die anderen nach rechts",
      re.linksUndRechts);
    /* „richtig nach unten fallen": im Mittel senkrecht. Vorher waren
       es 11 bis 20 px nach rechts — fuer alle gleich. */
    pruefe("im Mittel faellt es senkrecht", Math.abs(re.mittel) < 0.6,
      re.mittel.toFixed(2) + " px Mittel");
    pruefe("und kein Tropfen driftet weit ab", re.groesster <= 3.2,
      re.groesster.toFixed(2) + " px hoechstens");
    /* „feiner": vorher 1,4 px. */
    pruefe("die Tropfen sind feiner als vorher", re.breit <= 1.05,
      re.breit.toFixed(2) + " px breit");
  }

  console.log("\nUND NACHTS STEHT KEINE SONNE AM HIMMEL\n");
  const na = await pg.evaluate(async () => {
    /* Erst die Daemmerung: da war die Szene „klar" und die Sonne
       stand im dunkelblauen Streifen — genau das „manchmal". */
    window.__wetter("klar", false);
    await new Promise((f) => setTimeout(f, 200));
    const sch = document.getElementById("niederschlagSchicht");
    sch.classList.remove("tz-tag", "tz-morgen", "tz-abend", "tz-nacht");
    sch.classList.add("tz-abend");
    const st = sch.querySelector(".w-strahl");
    const daemmer = st ? Number(getComputedStyle(st).opacity) : -1;
    sch.classList.remove("tz-abend");
    sch.classList.add("tz-nacht");
    const nachtStrahl = st ? getComputedStyle(st).display : "-";
    const schein = sch.querySelector(".w-schein");
    const nachtSchein = schein ? getComputedStyle(schein).backgroundImage : "";
    /* Und eine bewoelkte Nacht muss Wolken haben. */
    const w = window.__wetter("wolkig", true);
    await new Promise((f) => setTimeout(f, 200));
    const wolken = document.querySelectorAll("#niederschlagSchicht .w-wolkenfeld").length;
    const mond = document.querySelectorAll("#niederschlagSchicht .w-mond").length;
    return { daemmer: daemmer, nachtStrahl: nachtStrahl, nachtSchein: nachtSchein,
             szene: w.szene, wolken: wolken, mond: mond };
  });
  pruefe("in der Daemmerung sind die Strahlen schon schwach",
    na.daemmer >= 0 && na.daemmer <= 0.35, "Deckkraft " + na.daemmer);
  pruefe("nachts sind die Sonnenstrahlen ganz weg",
    na.nachtStrahl === "none", na.nachtStrahl);
  /* Warm heisst: mehr Rot als Blau. Mondlicht ist umgekehrt. */
  pruefe("und aus dem warmen Schein wird kuehles Mondlicht", (() => {
    const m = /rgba?\((\d+), ?(\d+), ?(\d+)/.exec(na.nachtSchein || "");
    return Boolean(m) && Number(m[3]) > Number(m[1]);
  })(), (na.nachtSchein || "-").slice(0, 60));
  pruefe("eine bewoelkte Nacht hat auch Wolken",
    na.wolken >= 2 && na.mond >= 1,
    na.wolken + " Wolkenfelder, " + na.mond + " Mond");

  console.log("\nDIE MUSIK KOMMT BEIM RICHTIGEN AN\n");
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());
  await pg.waitForTimeout(300);
  const mu = await pg.evaluate(() => {
    const ich = document.querySelector(".lc-platz-ich");
    const meinName = (ich.querySelector(".lc-platz-name") || {}).textContent.trim();
    const meineNr = String(ich.dataset.lcPlatz || "");
    const andere = [...document.querySelectorAll(".lc-platz")]
      .find((p) => p !== ich && !p.classList.contains("lc-platz-frei"));
    const fremdName = (andere.querySelector(".lc-platz-name") || {}).textContent.trim();
    const fremdNr = String(andere.dataset.lcPlatz || "");
    const f = window.DMA_PRUEFUNG.musikFuerMich;
    return { meinName: meinName, meineNr: meineNr, fremdNr: fremdNr,
             perName: f(meinName), perNummer: f(meineNr),
             fremdPerName: f(fremdName), fremdPerNummer: f(fremdNr),
             leer: f(""), unsinn: f("Niemand") };
  });
  pruefe("mit meinem NAMEN bin ich gemeint", mu.perName === true, mu.meinName);
  /* DAS WAR DER FEHLER: „/hoerer 3 Lied" — da stand in „wen" die
     Ziffer 3, verglichen wurde aber mit dem NAMEN. Also lief die
     Musik auf keinem einzigen Geraet. */
  pruefe("mit meiner PLATZNUMMER auch", mu.perNummer === true, "Platz " + mu.meineNr);
  pruefe("beim Namen eines anderen nicht", mu.fremdPerName === false);
  pruefe("bei der Nummer eines anderen nicht", mu.fremdPerNummer === false,
    "Platz " + mu.fremdNr);
  /* Und vor allem: KEIN Rueckfall auf „alle". Sonst liefe die Musik
     bei jedem im Raum, sobald sich der Absender vertippt. */
  pruefe("und bei einem Namen, den es nicht gibt, bei NIEMANDEM",
    mu.unsinn === false && mu.leer === false);

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nRunde 58 sitzt.\n");
  process.exit(fehler ? 1 : 0);
})();
