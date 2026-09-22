/* =====================================================================
   SONDE RUNDE 88 — DER FROSCH
   ---------------------------------------------------------------------
   XANDER: „Der Frosch hat vorne keine Fuesse, so wie's aussieht."
   XANDER: „Der Frosch huepft auch nicht in die Richtung, in die er
   schaut. Wenn er anfaengt zu springen, schaut er nach links, und wenn
   er zurueckgeht, schaut er in die richtige Richtung."
   XANDER: „und das Quakgeraeusch ist auch unmoeglich. Das ist
   ueberhaupt nicht realistisch."

   Gemessen wird dreierlei:
   · DIE PFOTEN — aus der Zeichnung selbst: wie viele Zehen, wie weit
     reichen sie herunter, und ist die Hinterpfote eine Schwimmpfote.
   · DIE RICHTUNG — indem die Reise angehalten und an vielen
     Zeitpunkten gefragt wird: wohin bewegt er sich gerade, und wohin
     schaut er dabei. Beides muss zu JEDER Zeit zusammenpassen, auch
     auf einem gemalten Weg, der erst nach rechts und dann nach links
     fuehrt.
   · DAS QUAKEN — aus der Tondatei: Laenge, Form des Rufs, fallende
     Pulsrate und die Form eines einzelnen Pulses.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FF = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

/* ---------------------------------------------------------------- Ton */
const RATE = 24000;
function tonLaden(datei) {
  const roh = path.join("/tmp/claude-0", "pr88-" + path.basename(datei) + ".raw");
  execFileSync(FF, ["-v", "error", "-i", datei, "-f", "s16le",
    "-ar", String(RATE), "-ac", "1", roh, "-y"]);
  const b = fs.readFileSync(roh);
  const x = new Float64Array(b.length / 2);
  for (let i = 0; i < x.length; i++) x[i] = b.readInt16LE(i * 2) / 32768;
  return x;
}
function huelle(x, fensterMs) {
  const w = Math.round(RATE * fensterMs / 1000), aus = [];
  for (let i = 0; i + w <= x.length; i += w) {
    let s = 0;
    for (let k = i; k < i + w; k++) s += x[k] * x[k];
    aus.push(Math.sqrt(s / w));
  }
  return aus;
}
/* Die Pulsrate in einem Abschnitt: Autokorrelation der Huellkurve. */
function pulsrate(x, abS, bisS) {
  const e = huelle(x, 1);
  const k = e.slice(Math.round(abS * 1000), Math.round(bisS * 1000));
  const m = k.reduce((a, b) => a + b, 0) / k.length;
  const z = k.map((v) => v - m);
  const ak = [];
  for (let l = 0; l < 50; l++) {
    let s = 0;
    for (let i = 0; i + l < z.length; i++) s += z[i] * z[i + l];
    ak.push(s);
  }
  const null0 = ak[0] || 1;
  let best = 0;
  for (let l = 8; l < 42; l++) {
    if (ak[l] > ak[l - 1] && ak[l] >= ak[l + 1] && ak[l] > ak[best || 8]) best = l;
  }
  return best ? { hz: 1000 / best, periode: best, guete: ak[best] / null0 } : null;
}
/* Die Form EINES Pulses: alle Perioden uebereinandergelegt. */
function pulsform(x, periodeMs) {
  const per = Math.round(RATE * periodeMs / 1000);
  /* Huellkurve ueber 1,2 ms — der Traeger faellt weg, der Puls bleibt.
     MITTIG gerechnet: ein nachlaufender Mittelwert wuerde jeden Puls
     um eine halbe Fensterbreite nach hinten schieben und damit genau
     das verfaelschen, was hier gemessen wird. */
  const w = Math.round(RATE * 0.0012);
  const halb = Math.floor(w / 2);
  const e = new Float64Array(x.length);
  let s = 0;
  for (let i = 0; i < x.length; i++) {
    s += Math.abs(x[i]);
    if (i >= w) s -= Math.abs(x[i - w]);
    const mitte = i - halb;
    if (mitte >= 0) e[mitte] = s / Math.min(i + 1, w);
  }
  const ab = Math.round(RATE * 0.03), bis = Math.round(RATE * 0.24);
  const stapel = new Float64Array(per);
  let anz = 0;
  for (let i = ab; i + per <= bis; i += per) {
    let mx = 0;
    for (let k = 0; k < per; k++) mx = Math.max(mx, e[i + k]);
    if (!mx) continue;
    for (let k = 0; k < per; k++) stapel[k] += e[i + k] / mx;
    anz++;
  }
  let spitze = 0;
  for (let k = 0; k < per; k++) if (stapel[k] > stapel[spitze]) spitze = k;
  const bei = (k) => stapel[((k % per) + per) % per] / stapel[spitze];
  let nach = 0; while (nach < per && bei(spitze + nach) >= 0.5) nach++;
  let vor = 0; while (vor < per && bei(spitze - vor) >= 0.5) vor++;
  let tal = 1; for (let k = 0; k < per; k++) tal = Math.min(tal, bei(k));
  return { anstiegMs: vor * 1000 / RATE, abfallMs: nach * 1000 / RATE,
           verhaeltnis: nach / Math.max(1, vor), tal: tal, perioden: anz };
}

(async () => {
  console.log("RUNDE 88 — Der Frosch\n");
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
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  const springen = async (von, ziel) => {
    await pg.evaluate(([V, Z]) => {
      document.querySelectorAll(".lc-frosch").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.wirkung("frosch", Z, V, {});
    }, [von, ziel]);
    await pg.waitForTimeout(120);
    return pg.evaluate(() => !!document.querySelector(".lc-frosch"));
  };
  /* Alles anhalten und auf einen Zeitpunkt stellen, dann messen. Das
     muss in ZWEI Schritten geschehen: wer im selben evaluate setzt und
     liest, bekommt noch das alte Bild. */
  const beiZeit = async (t) => {
    await pg.evaluate((T) => {
      const f = document.querySelector(".lc-frosch");
      if (!f) return;
      f.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = T; } catch (e) {} });
      f.querySelectorAll("*").forEach((e) => e.getAnimations()
        .forEach((a) => { try { a.pause(); a.currentTime = T; } catch (x) {} }));
    }, t);
    await pg.waitForTimeout(80);
    return pg.evaluate(() => {
      const f = document.querySelector(".lc-frosch");
      if (!f) return null;
      const lies = (w) => {
        const el = f.querySelector(w);
        if (!el) return null;
        const z = getComputedStyle(el).transform;
        if (!z || z === "none") return 1;
        return Number(z.slice(z.indexOf("(") + 1, -1).split(",")[0]);
      };
      const r = f.getBoundingClientRect();
      return { dreh: lies(".lc-frosch-dreh"), last: lies(".lc-frosch-last"),
               x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  };
  const verlauf = async (zeiten) => {
    const aus = [];
    for (const t of zeiten) aus.push(Object.assign({ t: t }, await beiZeit(t)));
    return aus;
  };

  /* =================================================================
     1. DIE VORDERFUESSE
     ================================================================= */
  console.log("DIE PFOTEN — „Der Frosch hat vorne keine Fuesse\"\n");
  await springen("Alex", "8");
  const pfoten = await pg.evaluate(() => {
    const f = document.querySelector(".lc-frosch");
    const zaehlM = (el) => (el.getAttribute("d").match(/M/g) || []).length;
    const vorn = Array.from(f.querySelectorAll(".lc-frosch-vorn"));
    const fern = vorn.filter((p) => p.classList.contains("lc-frosch-vorn-fern"));
    const nah = vorn.filter((p) => !p.classList.contains("lc-frosch-vorn-fern"));
    const zehenNah = nah.map(zaehlM).sort((a, b) => b - a)[0] || 0;
    const zehenFern = fern.map(zaehlM).sort((a, b) => b - a)[0] || 0;
    /* Wie weit reicht die Vorderpfote herunter? getBBox rechnet in
       den Einheiten des viewBox (0 0 100 74). */
    const unten = Math.max.apply(null, nah.map((p) => {
      const b = p.getBBox(); return b.y + b.height;
    }));
    const koerper = f.querySelector("ellipse");
    const kb = koerper.getBBox();
    const pfote = f.querySelector(".lc-frosch-pfote");
    const pfoteTeile = pfote ? Array.from(pfote.querySelectorAll("path")) : [];
    return { vorn: vorn.length, fern: fern.length, nah: nah.length,
             zehenNah: zehenNah, zehenFern: zehenFern,
             untenPfote: unten, untenKoerper: kb.y + kb.height,
             hinterpfote: pfoteTeile.length,
             /* Die Pfote ist eine GRUPPE, damit Haut und Zehen zusammen
                gestaucht werden — gezaehlt wird darin. */
             hinterGruppe: pfote ? pfote.tagName.toLowerCase() : "",
             hinterZehen: pfoteTeile.map(zaehlM).sort((a, b) => b - a)[0] || 0 };
  });
  sage(pfoten.nah >= 4 && pfoten.fern >= 4,
    "vorne sind ZWEI Beine gezeichnet, nicht eins",
    "nah " + pfoten.nah + " Pfade, fern " + pfoten.fern + " Pfade");
  sage(pfoten.zehenNah === 4,
    "die nahe Vorderpfote hat vier Finger — ein Frosch hat vorne vier",
    pfoten.zehenNah + " Finger");
  sage(pfoten.zehenFern >= 3,
    "und die ferne dahinter ebenfalls",
    pfoten.zehenFern + " Finger");
  sage(pfoten.untenPfote > pfoten.untenKoerper + 8,
    "die Pfote steht deutlich unter dem Koerper, ist also ein Fuss und kein Strich",
    "Pfote bis " + pfoten.untenPfote.toFixed(1) + ", Koerper bis "
      + pfoten.untenKoerper.toFixed(1));
  sage(pfoten.hinterGruppe === "g" && pfoten.hinterpfote === 2 && pfoten.hinterZehen >= 3,
    "hinten sitzt eine Schwimmpfote mit Haut zwischen den Zehen, in EINER Gruppe",
    "<" + pfoten.hinterGruppe + "> mit " + pfoten.hinterpfote + " Teilen, "
      + pfoten.hinterZehen + " Zehen");

  /* =================================================================
     2. DIE RICHTUNG
     ================================================================= */
  console.log("\nDIE RICHTUNG — „huepft nicht in die Richtung, in die er schaut\"\n");
  /* Die Zeichnung schaut von Haus aus nach LINKS. scaleX(-1) heisst
     also: er schaut nach rechts. */
  const schautNach = (s) => (s < -0.5 ? 1 : (s > 0.5 ? -1 : 0));
  const pruefeBahn = (mess, wieHeisst) => {
    const schlecht = [];
    for (let i = 1; i < mess.length; i++) {
      const dx = mess[i].x - mess[i - 1].x;
      if (Math.abs(dx) < 3) continue;                 /* keine Richtung */
      const blick = schautNach(mess[i].dreh);
      if (!blick) continue;                            /* mitten im Drehen */
      if ((dx > 0 ? 1 : -1) !== blick) {
        schlecht.push(mess[i].t + "ms dx=" + dx.toFixed(0)
          + " Blick=" + (blick > 0 ? "rechts" : "links"));
      }
    }
    sage(schlecht.length === 0,
      wieHeisst,
      schlecht.length ? schlecht.join(", ") : mess.length + " Messpunkte, alle stimmig");
  };
  const zeitenKurz = [0, 150, 300, 450, 600, 750, 900, 1050, 1200, 1400, 1600, 1800];

  await springen("Alex", "8");
  const rechts = await verlauf(zeitenKurz);
  pruefeBahn(rechts, "springt er nach rechts, schaut er die ganze Reise nach rechts");

  await springen("Dana", "6");
  const links = await verlauf(zeitenKurz);
  pruefeBahn(links, "springt er nach links, schaut er die ganze Reise nach links");

  /* Der gemalte Weg 1-4-7: erst nach rechts, dann nach links. Genau
     der Fall, den die alte Rechnung nicht konnte — sie entschied
     einmal aus Start und Ziel. */
  await springen("Alex", "1-4-7");
  const umweg = await verlauf([0, 400, 800, 1200, 1600, 2000, 2400, 2800,
    3000, 3200, 3400, 3600, 3800]);
  pruefeBahn(umweg, "auf einem gemalten Umweg dreht er sich an der Ecke mit");
  const drehungen = umweg.filter((m, i) => i && schautNach(m.dreh)
    && schautNach(umweg[i - 1].dreh)
    && schautNach(m.dreh) !== schautNach(umweg[i - 1].dreh)).length;
  sage(drehungen >= 1,
    "er dreht sich unterwegs tatsaechlich um — einmal je Richtungswechsel",
    drehungen + " Drehung(en) gemessen");

  /* Senkrecht nach unten: Bea sitzt auf Platz 2, Platz 6 liegt genau
     darunter. Dort gibt es keine Seitwaertsrichtung — er darf sich
     also NICHT drehen. Frueher war „ende.x >= start.x" auch hier
     wahr, und er drehte sich grundlos nach rechts. */
  await springen("Bea", "6");
  const runter = await verlauf(zeitenKurz);
  const seitwaerts = Math.max.apply(null, runter.map((m) => Math.abs(m.x - runter[0].x)));
  const dreht = runter.some((m) => schautNach(m.dreh) !== schautNach(runter[0].dreh));
  sage(seitwaerts < 6, "der Sprung geht wirklich senkrecht nach unten",
    "groesste Seitwaerts-Abweichung " + seitwaerts.toFixed(1) + " px");
  sage(!dreht, "und dabei dreht er sich nicht grundlos",
    runter.map((m) => (m.dreh > 0 ? "L" : "R")).join(""));

  /* Das Profilbild sitzt im gedrehten Teil und wird noch einmal
     gespiegelt — das Gesicht muss immer richtig herum stehen. */
  const alle = rechts.concat(links, umweg, runter);
  /* Beide bekommen DIESELBE Spiegelung, das Produkt ist also das
     Quadrat und immer positiv — nie wird das Gesicht seitenverkehrt.
     Mitten in der Drehung ist das Quadrat kleiner als eins (beide
     werden schmal); erst wenn er wieder steht, muss es genau eins
     sein. Deshalb zwei getrennte Regeln. */
  const verkehrt = alle.filter((m) => m.dreh * m.last < 0);
  sage(verkehrt.length === 0,
    "das Profilbild wird NIE seitenverkehrt — die Spiegelung hebt sich auf",
    verkehrt.length ? verkehrt.map((m) => m.t + "ms").join(", ")
      : alle.length + " Messpunkte geprueft");
  const steht = alle.filter((m) => Math.abs(m.dreh) > 0.9);
  const schief = steht.filter((m) => Math.abs(m.dreh * m.last - 1) > 0.02);
  sage(schief.length === 0 && steht.length > 20,
    "und steht er, ist es genau unverzerrt",
    schief.length ? schief.map((m) => m.t + "ms " + (m.dreh * m.last).toFixed(2)).join(", ")
      : steht.length + " Messpunkte im Stand, Produkt immer 1");

  await br.close();
  srv.close();

  /* =================================================================
     3. DAS QUAKEN
     ================================================================= */
  console.log("\nDAS QUAKEN — „unmoeglich, ueberhaupt nicht realistisch\"\n");
  const x = tonLaden(path.join(WURZEL, "ton", "quaken.opus"));
  const dauer = x.length / RATE;
  sage(dauer <= 0.64, "die Datei enthaelt genau EINEN Ruf", dauer.toFixed(2) + " s");

  /* Die Form des Rufs in 40-ms-Fenstern: er muss ansetzen, stehen und
     abfallen. Die alte Datei stand 340 ms lang unbewegt bei -13 dB —
     das ist ein Synthesizer, kein Tier. */
  const form = huelle(x, 40).map((v) => 20 * Math.log10(Math.max(v, 1e-9)));
  const spitze = Math.max.apply(null, form);
  const wo = form.indexOf(spitze);
  sage(form[0] < spitze - 3,
    "der Ruf setzt an, statt sofort voll da zu sein",
    "erstes Fenster " + form[0].toFixed(0) + " dB, Spitze " + spitze.toFixed(0) + " dB");
  const nachSpitze = form.slice(wo + 1);
  sage(nachSpitze.length > 2 && Math.min.apply(null, nachSpitze) < spitze - 25,
    "und er faellt danach ab, statt abgeschnitten zu werden",
    "bis " + Math.min.apply(null, nachSpitze).toFixed(0) + " dB");

  const anfang = pulsrate(x, 0.01, 0.12);
  const ende = pulsrate(x, 0.22, 0.35);
  sage(anfang && ende && anfang.hz > 35 && anfang.hz < 70,
    "der Ruf ist eine Pulsfolge im Bereich eines Froschs (35 bis 70 Hz)",
    anfang ? anfang.hz.toFixed(1) + " Hz (Guete " + anfang.guete.toFixed(2) + ")" : "keine");
  sage(anfang && ende && anfang.hz > ende.hz + 4,
    "und die Rate faellt waehrend des Rufs — das ist das Knarren",
    anfang && ende ? anfang.hz.toFixed(1) + " Hz am Anfang, "
      + ende.hz.toFixed(1) + " Hz am Ende" : "nicht messbar");

  const pf = pulsform(x, anfang ? 1000 / ((anfang.hz + ende.hz) / 2) : 20);
  sage(pf.verhaeltnis > 1.5,
    "jeder Puls ist ein Anstoss MIT Nachklang, kein auf- und abschwellender Ton",
    "Anstieg " + pf.anstiegMs.toFixed(2) + " ms, Abfall " + pf.abfallMs.toFixed(2)
      + " ms, Verhaeltnis " + pf.verhaeltnis.toFixed(2));
  sage(pf.tal < 0.2,
    "und zwischen zwei Pulsen wird es wirklich leise",
    "Talsohle " + pf.tal.toFixed(3) + " des Maximums");

  console.log(fehler ? "\n" + fehler + " Punkt(e) offen" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
