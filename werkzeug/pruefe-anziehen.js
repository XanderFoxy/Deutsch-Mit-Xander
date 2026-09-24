#!/usr/bin/env node
/* =====================================================================
   SONDE — DAS ANZIEHEN
   ---------------------------------------------------------------------
   XANDER, woertlich: „Und lass meinetwegen jemanden mitarbeiten dass das
   System mit dem Anziehen auch funktioniert dass ich jemanden anziehen
   kann und ausziehen kann und dass das auch alles optisch passt dass das
   alles hin passt."

   „Ausziehen" heisst hier nur: ein vorher aufgesetztes Stueck (Krone,
   Brille, Muetze …) wieder abnehmen. Geprueft werden die sechs Stuecke
   aus dem Platzmenue (Krone, Brille, Sonnenbrille, Schnurrbart,
   Wollmuetze, Maske).

   GEMESSEN WIRD:
     1. Jedes Stueck laesst sich anziehen und wieder ausziehen — und kommt
        nach einem Auffrischen der Sitzreihe nicht von selbst wieder.
     2. Es sitzt genau auf dem Bild (gleicher Kasten), ist nicht zu gross,
        sitzt auf der richtigen Hoehe, und die MITTE des Gesichts bleibt
        frei — ausser bei Brille, Sonnenbrille und Maske, die gehoeren
        dorthin. Die Maske hat echte Augenloecher.
     3. Nichts davon verschiebt einen Platz (auch nicht beim Ausziehen).
     4. Kopf, Augen und Mund gehen zusammen (Krone + Brille + Schnurrbart);
        ein Stueck im selben Fach ersetzt das alte; „/ausziehen Bea krone"
        nimmt nur die Krone ab, „aus" alles.
     5. Ein Name, der auf keinem Platz steht, zieht NICHT allen etwas an —
        und die Kleidung haengt an der Person, nicht am Platz.
     6. Der Befehl traegt das Stueck bis in die Zeile (so kommt es bei den
        anderen an), und eine alte Zeile aus dem Verlauf wird beim
        Nachlesen still nachgeholt (wer spaeter kommt, sieht dasselbe).
     7. Faehrt oder reist jemand mit Krone, geht die Krone mit dem Bild mit
        und schwebt nicht ueber dem leeren Platz.
     8. Keine Fehler in der Konsole.

   Aufruf:  node werkzeug/pruefe-anziehen.js [Bilderordner]
   Die Bilder (eines je Stueck, auf einem Probegesicht) landen im
   Bilderordner, sonst unter /tmp/pruefe-anziehen.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = process.env.PRUEF_WURZEL || path.join(__dirname, "..");
const BILDER = process.argv[2] || path.join(os.tmpdir(), "pruefe-anziehen");
fs.mkdirSync(BILDER, { recursive: true });
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

/* Ein Probegesicht wie ein gewoehnliches Profilbild: Augen bei 45 %,
   Nasenspitze bei 55 %, Mund bei 63 %, das Gesicht 28–72 % breit. Das
   rote Fadenkreuz markiert die Bildmitte. */
const GESICHT = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
  + '<rect width="100" height="100" fill="#9fc3e0"/>'
  + '<path d="M10 100 q0 -24 40 -26 q40 2 40 26 Z" fill="#3b6ea5"/>'
  + '<rect x="43" y="62" width="14" height="14" fill="#e9b99a"/>'
  + '<ellipse cx="50" cy="46" rx="22" ry="27" fill="#f1c7a8"/>'
  + '<path d="M27 42 q-2 -26 23 -27 q25 1 23 27 q-4 -14 -23 -16 q-19 2 -23 16 Z" fill="#5a3a22"/>'
  + '<ellipse cx="41" cy="45" rx="3" ry="2.2" fill="#2a2a2a"/>'
  + '<ellipse cx="59" cy="45" rx="3" ry="2.2" fill="#2a2a2a"/>'
  + '<path d="M36 40 h9 M55 40 h9" stroke="#5a3a22" stroke-width="1.6"/>'
  + '<path d="M50 47 l-2.5 8 h5" stroke="#c9967a" stroke-width="1.4" fill="none"/>'
  + '<path d="M43 62 q7 5 14 0" stroke="#b5584f" stroke-width="2" fill="none"/>'
  + '<path d="M0 50 H100 M50 0 V100" stroke="rgba(255,0,0,.25)" stroke-width=".4"/>'
  + "</svg>");

/* Was ein Stueck darf. y/x in Prozent des Bildes (0 = oben/links). */
const STUECKE = {
  krone:        { fach: "kopf",  mitte: false, maxBreite: 70, unterkanteMax: 36 },
  muetze:       { fach: "kopf",  mitte: false, maxBreite: 75, unterkanteMax: 38 },
  brille:       { fach: "augen", mitte: true,  maxBreite: 58, hoehe: [40, 50] },
  sonnenbrille: { fach: "augen", mitte: true,  maxBreite: 58, hoehe: [40, 50] },
  maske:        { fach: "augen", mitte: true,  maxBreite: 62, hoehe: [40, 50] },
  schnurrbart:  { fach: "mund",  mitte: false, maxBreite: 36, hoehe: [54, 64] }
};

(async () => {
  console.log("ANZIEHEN — anziehen, ausziehen, und alles passt\n");
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
  const HIER = "http://127.0.0.1:" + srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 }, deviceScaleFactor: 3 });

  /* Konsole: Seitenfehler und console.error zaehlen. Nicht gezaehlt wird,
     dass Schriften/Dienste von AUSSERHALB in der Pruefumgebung nicht
     erreichbar sind (kein Netz) — das hat mit dem Anziehen nichts zu tun. */
  const konsole = [];
  pg.on("pageerror", (e) => konsole.push("Seitenfehler: " + e.message));
  pg.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    const ort = (m.location() && m.location().url) || "";
    if (/Failed to load resource/.test(t) && ort.indexOf(HIER) !== 0) return;
    konsole.push("console.error: " + t.slice(0, 160));
  });
  pg.on("response", (r) => {
    if (r.url().indexOf(HIER) === 0 && r.status() >= 400) konsole.push(r.status() + " " + r.url().slice(HIER.length));
  });

  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto(HIER + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.DMA_PRUEF
    && window.DMA_PRUEF.effektBuehne && window.DMA_PRUEFUNG && window.DMA_PRUEFUNG.anziehen,
    { timeout: 20000 });
  /* Die Konsole erst ab hier: vorher laedt die Seite ihre eigenen Sachen. */
  const vorLaden = konsole.length;

  /* Die Pruefbuehne mit dem Probegesicht auf jedem besetzten Platz — und
     niemand hat etwas an (die Kleiderliste lebt laenger als die Buehne). */
  const buehne = () => pg.evaluate((g) => {
    ["Alex", "Bea", "Cem", "Dana", "Emmi", "Zoe"].forEach((n) => window.DMA_PRUEFUNG.anziehen(n, "aus"));
    window.DMA_PRUEF.effektBuehne();
    document.querySelectorAll(".lc-platz-belegt .lc-kreis").forEach((k) => {
      const i = document.createElement("img");
      i.className = "lc-avatar"; i.alt = ""; i.src = g; i.style.display = "block";
      k.appendChild(i);
    });
    document.getElementById("lcPruefBuehne").scrollIntoView();
    return true;
  }, GESICHT);

  /* Wo stehen die Plaetze und Bilder? (auf 0,1 px) */
  const sitzordnung = () => pg.evaluate(() =>
    [...document.querySelectorAll(".lc-platz, .lc-platz .lc-kreis")].map((e) => {
      const b = e.getBoundingClientRect();
      return [b.left, b.top, b.width, b.height].map((x) => Math.round(x * 10) / 10).join(",");
    }).join(" | "));

  /* Alles, was man an EINEM Stueck messen kann — in Prozent des Bildes. */
  const vermessen = (was) => pg.evaluate((was) => {
    const pl = document.querySelectorAll(".lc-platz")[1];
    const k = pl.querySelector('.lc-kleid[data-lc-kleid="' + was + '"]');
    if (!k) return null;
    const kr = pl.querySelector(".lc-kreis").getBoundingClientRect();
    const sb = k.getBoundingClientRect();
    const svg = k.querySelector("svg");
    const formen = [...svg.querySelectorAll("path, circle, ellipse, rect")];
    /* Der Umriss des Gezeichneten, in Prozent des Bildes. */
    let l = 1e9, o = 1e9, r = -1e9, u = -1e9;
    formen.forEach((f) => {
      const b = f.getBoundingClientRect();
      l = Math.min(l, b.left); o = Math.min(o, b.top); r = Math.max(r, b.right); u = Math.max(u, b.bottom);
    });
    const pz = (x, a, d) => Math.round((x - a) / d * 1000) / 10;
    /* Deckt es einen Punkt des Bildes? Gefragt wird die Zeichnung selbst
       (isPointInFill / isPointInStroke), nicht ihr Kasten. */
    const deckt = (px, py) => {
      const sx = kr.left + kr.width * px / 100, sy = kr.top + kr.height * py / 100;
      return formen.some((f) => {
        const m = f.getScreenCTM();
        if (!m) return false;
        const p = new DOMPoint(sx, sy).matrixTransform(m.inverse());
        const fuell = f.getAttribute("fill");
        const inFill = fuell !== "none" && f.isPointInFill(p);
        const inStrich = f.getAttribute("stroke") && f.isPointInStroke(p);
        return inFill || inStrich;
      });
    };
    const mitte = [[50, 50], [46, 50], [54, 50], [50, 47], [50, 53]].some(([x, y]) => deckt(x, y));
    return {
      fach: k.dataset.lcFach || "",
      kasten: [sb.left - kr.left, sb.top - kr.top, sb.width - kr.width, sb.height - kr.height].map((x) => Math.round(x)),
      links: pz(l, kr.left, kr.width), rechts: pz(r, kr.left, kr.width),
      oben: pz(o, kr.top, kr.height), unten: pz(u, kr.top, kr.height),
      mitte,
      /* Die beiden Augen des Probegesichts (41/45 und 59/45). */
      augeLinks: deckt(41, 45), augeRechts: deckt(59, 45),
      sichtbar: getComputedStyle(k).visibility !== "hidden" && Number(getComputedStyle(k).opacity) > 0.5
    };
  }, was);

  const bildVon = async (name) => {
    const b = await pg.evaluate(() => {
      const r = document.querySelectorAll(".lc-platz")[1].getBoundingClientRect();
      return { x: r.left - 24, y: Math.max(0, r.top - 30), width: r.width + 48, height: r.height + 54 };
    });
    const datei = path.join(BILDER, name + ".png");
    await pg.screenshot({ path: datei, clip: b });
    return datei;
  };

  /* =================================================================
     1.–3. JEDES STUECK EINZELN: AN, SITZT, AUS
     ================================================================= */
  console.log("1) Jedes Stueck: anziehen, wie es sitzt, ausziehen\n");
  await buehne();
  await bildVon("00-ohne");
  for (const was of Object.keys(STUECKE)) {
    const soll = STUECKE[was];
    await buehne();
    const vorher = await sitzordnung();
    const an = await pg.evaluate((was) => window.DMA_PRUEFUNG.anziehen("Bea", was), was);
    await pg.waitForTimeout(120);
    const m = await vermessen(was);
    const datei = await bildVon("01-" + was);
    if (!m) { sage(false, was + ": liegt nach dem Anziehen gar nicht auf dem Platz"); continue; }
    sage(an === true && m.sichtbar, was + ": angezogen und zu sehen", path.basename(datei));
    sage(m.fach === soll.fach, was + ": im Fach „" + soll.fach + "“", "Fach: " + m.fach);
    sage(m.kasten.every((x) => Math.abs(x) <= 1), was + ": die Schicht deckt genau das Bild",
      "links/oben/Breite/Hoehe gegen das Bild: " + m.kasten.join(" / ") + " px");
    const breite = Math.round((m.rechts - m.links) * 10) / 10;
    sage(breite <= soll.maxBreite, was + ": nicht zu breit",
      breite + " % (erlaubt " + soll.maxBreite + " %), " + m.links + "–" + m.rechts);
    if (soll.fach !== "kopf") {
      sage(m.links >= 15 && m.rechts <= 85, was + ": bleibt im Bild, nichts steht seitlich heraus",
        m.links + "–" + m.rechts + " %");
    } else {
      sage(m.unten <= soll.unterkanteMax, was + ": sitzt AUF dem Kopf, nicht in den Augen",
        "Unterkante bei " + m.unten + " %");
    }
    if (soll.hoehe) {
      const mitteY = Math.round((m.oben + m.unten) / 2 * 10) / 10;
      sage(mitteY >= soll.hoehe[0] && mitteY <= soll.hoehe[1], was + ": auf der richtigen Hoehe",
        "Mitte bei " + mitteY + " % (soll " + soll.hoehe.join("–") + " %)");
    }
    if (!soll.mitte) {
      sage(!m.mitte, was + ": die Mitte des Gesichts bleibt frei");
    }
    if (was === "maske") {
      sage(!m.augeLinks && !m.augeRechts, "maske: man sieht die Augen durch die Loecher");
    }
    sage(await sitzordnung() === vorher, was + ": kein Platz hat sich verschoben");
    /* Und wieder aus — einmal nur dieses Stueck, einmal alles. */
    const ab = await pg.evaluate(async (was) => {
      window.DMA_PRUEFUNG.anziehen("Bea", "aus:" + was);
      const nurDiesesWeg = !document.querySelector('.lc-platz .lc-kleid[data-lc-kleid="' + was + '"]');
      window.DMA_PRUEFUNG.anziehen("Bea", was);
      window.DMA_PRUEFUNG.anziehen("Bea", "aus");
      const allesWeg = !document.querySelector(".lc-platz .lc-kleid");
      window.DMA_PRUEFUNG.kleiderAuffrischen();
      await new Promise((f) => setTimeout(f, 60));
      return { nurDiesesWeg, allesWeg, bleibtWeg: !document.querySelector(".lc-platz .lc-kleid") };
    }, was);
    sage(ab.nurDiesesWeg && ab.allesWeg, was + ": laesst sich wieder ausziehen",
      "aus:" + was + " → " + ab.nurDiesesWeg + ", aus → " + ab.allesWeg);
    sage(ab.bleibtWeg, was + ": und kommt beim Auffrischen nicht von selbst wieder");
    sage(await sitzordnung() === vorher, was + ": auch beim Ausziehen verschiebt sich nichts");
    console.log("");
  }

  /* =================================================================
     4. KOPF, AUGEN UND MUND ZUSAMMEN
     ================================================================= */
  console.log("2) Mehrere Sachen zugleich\n");
  await buehne();
  const vorherK = await sitzordnung();
  const kombi = await pg.evaluate(async () => {
    const getragen = () => [...document.querySelectorAll(".lc-platz")[1].querySelectorAll(".lc-kleid")]
      .map((k) => k.dataset.lcKleid).sort().join(",");
    const A = window.DMA_PRUEFUNG.anziehen;
    const aus = {};
    A("Bea", "krone"); A("Bea", "brille"); A("Bea", "schnurrbart");
    aus.drei = getragen();
    window.DMA_PRUEFUNG.kleiderAuffrischen();
    aus.nachAuffrischen = getragen();
    A("Bea", "muetze");
    aus.muetzeStattKrone = getragen();
    A("Bea", "sonnenbrille");
    aus.sonneStattBrille = getragen();
    A("Bea", "aus:brille");         /* traegt gerade keine Brille */
    aus.falschesAb = getragen();
    A("Bea", "aus:sonnenbrille");
    aus.nurSonneAb = getragen();
    A("Bea", "aus");
    aus.allesAb = getragen();
    return aus;
  });
  sage(kombi.drei === "brille,krone,schnurrbart", "Krone + Brille + Schnurrbart sitzen zusammen",
    kombi.drei || "nichts");
  sage(kombi.nachAuffrischen === kombi.drei, "und bleiben nach dem Auffrischen alle drei",
    kombi.nachAuffrischen);
  sage(kombi.muetzeStattKrone === "brille,muetze,schnurrbart", "die Muetze ersetzt die Krone (ein Kopf)",
    kombi.muetzeStattKrone);
  sage(kombi.sonneStattBrille === "muetze,schnurrbart,sonnenbrille", "die Sonnenbrille ersetzt die Brille",
    kombi.sonneStattBrille);
  sage(kombi.falschesAb === kombi.sonneStattBrille, "„aus:brille“ nimmt nichts ab, was sie gar nicht traegt",
    kombi.falschesAb);
  sage(kombi.nurSonneAb === "muetze,schnurrbart", "„aus:sonnenbrille“ nimmt NUR die Sonnenbrille ab",
    kombi.nurSonneAb);
  sage(kombi.allesAb === "", "„aus“ nimmt alles ab", kombi.allesAb || "nichts mehr");
  sage(await sitzordnung() === vorherK, "bei alledem hat sich kein Platz verschoben");
  await pg.evaluate(() => { ["krone", "brille", "schnurrbart"].forEach((w) => window.DMA_PRUEFUNG.anziehen("Bea", w)); });
  console.log("         Bild: " + await bildVon("02-zusammen"));
  await pg.evaluate(() => {
    window.DMA_PRUEFUNG.anziehen("Alex", "muetze");
    window.DMA_PRUEFUNG.anziehen("Cem", "sonnenbrille");
    window.DMA_PRUEFUNG.anziehen("Dana", "maske");
  });
  {
    const r = await pg.evaluate(() => {
      const b = document.getElementById("lcPlaetze").getBoundingClientRect();
      return { x: b.left, y: Math.max(0, b.top - 24), width: b.width, height: b.height + 30 };
    });
    await pg.screenshot({ path: path.join(BILDER, "03-reihe.png"), clip: r });
    console.log("         Bild: " + path.join(BILDER, "03-reihe.png"));
  }

  /* =================================================================
     5. NUR WER GEMEINT IST — UND ES HAENGT AN DER PERSON
     ================================================================= */
  console.log("\n3) Nur wer gemeint ist\n");
  await buehne();
  const fremd = await pg.evaluate(async () => {
    window.DMA_PRUEFUNG.anziehen("Zoe", "krone");
    const vorher = document.querySelectorAll(".lc-kleid").length;
    /* Jetzt setzt sich Zoe auf Emmis Platz. */
    const pl = document.querySelectorAll(".lc-platz")[4];
    pl.querySelector(".lc-platz-name").textContent = "Zoe";
    window.DMA_PRUEFUNG.kleiderAuffrischen();
    await new Promise((f) => setTimeout(f, 40));
    const zoe = Boolean(pl.querySelector('.lc-kleid[data-lc-kleid="krone"]'));
    const sonst = document.querySelectorAll(".lc-kleid").length - (zoe ? 1 : 0);
    window.DMA_PRUEFUNG.anziehen("Zoe", "aus");
    return { vorher, zoe, sonst };
  });
  sage(fremd.vorher === 0, "„/anziehen Zoe krone“ ohne Zoe auf der Buehne setzt NIEMANDEM etwas auf",
    fremd.vorher + " Stueck(e) auf der Buehne");
  sage(fremd.zoe && fremd.sonst === 0, "setzt sich Zoe hin, hat sie ihre Krone auf — nur sie",
    "Zoe: " + fremd.zoe + ", sonst: " + fremd.sonst);

  /* =================================================================
     6. DER WEG UEBER DEN BEFEHL, ZU DEN ANDEREN, UND FUER SPAETERE
     ================================================================= */
  console.log("\n4) Befehl, Zeile und Nachlesen\n");
  const befehl = await pg.evaluate(async () => {
    const aus = {};
    try {
      LiveChat.pruefSitz({ lage: "drin", ichId: "ich-1", ichName: "Alex",
                           buehne: true, zuruecksetzen: true });
      LiveChat.pruefPersonSetzen("bea-1", "Bea");
    } catch (e) { aus.fehler = String(e); }
    const letzte = () => (LiveChat.lage().nachrichten || []).slice(-1)[0] || {};
    const zeile = async (t) => {
      LiveChat.schreiben(t);
      await new Promise((f) => setTimeout(f, 60));
      const n = letzte();
      return { text: String(n.text || ""), wen: String(n.wen || ""),
               wirkung: String(n.wirkung || ""), stueck: String(n.stueck || "") };
    };
    aus.an = await zeile("/anziehen Bea krone");
    aus.nurAb = await zeile("/ausziehen Bea krone");
    aus.allesAb = await zeile("/ausziehen Bea");
    aus.ichAn = await zeile("/anziehen brille");
    return aus;
  });
  sage(befehl.an.wirkung === "anziehen" && befehl.an.wen === "Bea" && befehl.an.stueck === "krone",
    "„/anziehen Bea krone“ schickt Wirkung, Name und Stueck an alle",
    befehl.an.stueck + " — " + befehl.an.text.slice(0, 50));
  sage(befehl.nurAb.stueck === "aus:krone" && /die Krone wieder aus/.test(befehl.nurAb.text),
    "„/ausziehen Bea krone“ nimmt nur die Krone ab", befehl.nurAb.stueck + " — " + befehl.nurAb.text.slice(0, 50));
  sage(befehl.allesAb.stueck === "aus" && /alles wieder aus/.test(befehl.allesAb.text),
    "„/ausziehen Bea“ nimmt alles ab", befehl.allesAb.stueck + " — " + befehl.allesAb.text.slice(0, 50));
  sage(befehl.ichAn.wen === "Alex" && befehl.ichAn.stueck === "brille",
    "ohne Namen zieht man sich selbst an", befehl.ichAn.wen + " / " + befehl.ichAn.stueck);

  /* So kommt es bei den ANDEREN an: als Wirkung aus einer fremden Zeile. */
  await buehne();
  const empfang = await pg.evaluate(async () => {
    const W = window.DMA_PRUEFUNG.wirkung;
    const bea = () => [...document.querySelectorAll(".lc-platz")[1].querySelectorAll(".lc-kleid")]
      .map((k) => k.dataset.lcKleid).sort().join(",");
    W("anziehen", "Bea", "Cem", { stueck: "krone" });
    W("anziehen", "Bea", "Cem", { stueck: "maske" });
    await new Promise((f) => setTimeout(f, 80));
    const an = bea();
    W("anziehen", "Bea", "Cem", { stueck: "aus:krone" });
    await new Promise((f) => setTimeout(f, 80));
    const halb = bea();
    W("anziehen", "Bea", "Cem", { stueck: "aus" });
    await new Promise((f) => setTimeout(f, 80));
    return { an, halb, ab: bea() };
  });
  sage(empfang.an === "krone,maske", "von einem anderen geschickt: Krone und Maske kommen an", empfang.an);
  sage(empfang.halb === "maske" && empfang.ab === "",
    "und „aus:krone“ / „aus“ nehmen genauso wieder ab", empfang.halb + " / " + (empfang.ab || "nichts"));

  /* Wer spaeter kommt: die Zeilen stehen im Verlauf und sind „alt". */
  await buehne();
  const spaeter = await pg.evaluate(async () => {
    if (!window.DMA_PRUEFUNG.chatStandAb) return { ohneNaht: true };
    const vor = Date.now() - 3600000;
    const z = (id, stueck, min) => ({ id: "anz-" + id, von: "cem", name: "Cem", art: "aktion",
      text: "Cem zieht Bea etwas an", wirkung: "anziehen", wen: "Bea", stueck, zeit: vor + min * 60000 });
    window.DMA_PRUEFUNG.chatStandAb([z(1, "krone", 1), z(2, "brille", 2), z(3, "schnurrbart", 3),
      z(4, "aus:schnurrbart", 4)], Date.now());
    await new Promise((f) => setTimeout(f, 200));
    return { bea: [...document.querySelectorAll(".lc-platz")[1].querySelectorAll(".lc-kleid")]
      .map((k) => k.dataset.lcKleid).sort().join(","),
      andere: document.querySelectorAll(".lc-kleid").length };
  });
  if (spaeter.ohneNaht) {
    sage(false, "DMA_PRUEFUNG.chatStandAb fehlt — das Nachlesen laesst sich nicht messen");
  } else {
    sage(spaeter.bea === "brille,krone" && spaeter.andere === 2,
      "wer spaeter kommt, sieht Bea so, wie die anderen sie sehen",
      "Bea traegt: " + (spaeter.bea || "nichts") + " (Stuecke insgesamt: " + spaeter.andere + ")");
  }

  /* =================================================================
     7. REISEN: DIE KRONE GEHT MIT
     ================================================================= */
  console.log("\n5) Die Krone geht mit, wenn jemand reist\n");
  for (const art of ["fahren", "lok", "beamen", "frosch"]) {
    await buehne();
    await pg.evaluate(() => {
      document.querySelectorAll(".lc-reise, .lc-flieger, .lc-greif").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.anziehen("Alex", "krone");
      window.DMA_PRUEFUNG.anziehen("Bea", "muetze");
    });
    await pg.evaluate((art) => window.DMA_PRUEFUNG.wirkung(art, "Bea", "Alex", {}), art);
    let schlimmste = { weg: 0, schwebt: 0 }, bild = false;
    for (let t = 0; t < 36; t++) {
      await pg.waitForTimeout(100);
      const m = await pg.evaluate(() => [...document.querySelectorAll(".lc-platz")].slice(0, 2).map((p) => {
        const k = p.querySelector(".lc-kreis"), s = p.querySelector(":scope > .lc-kleid");
        if (!k || !s) return { weg: 0, schwebt: 0 };
        const a = k.getBoundingClientRect(), b = s.getBoundingClientRect();
        /* Wie sichtbar ist das Bild wirklich? (alle Vorfahren bis zum Platz) */
        let deck = 1;
        for (let e = k; e && e !== p.parentElement; e = e.parentElement) deck *= Number(getComputedStyle(e).opacity);
        let deckS = 1;
        for (let e = s; e && e !== p.parentElement; e = e.parentElement) deckS *= Number(getComputedStyle(e).opacity);
        const weg = Math.hypot((a.left + a.width / 2) - (b.left + b.width / 2), (a.top + a.height / 2) - (b.top + b.height / 2));
        return { weg: deck > 0.05 ? weg : 0,
                 schwebt: deck < 0.05 && deckS > 0.2 && getComputedStyle(s).visibility !== "hidden" ? 1 : 0,
                 unterwegs: p.classList.contains("lc-platz-unterwegs") };
      }));
      m.forEach((x) => {
        schlimmste.weg = Math.max(schlimmste.weg, Math.round(x.weg));
        schlimmste.schwebt = Math.max(schlimmste.schwebt, x.schwebt);
      });
      if (!bild && t === 5) {
        const r = await pg.evaluate(() => {
          const b = document.getElementById("lcPlaetze").getBoundingClientRect();
          return { x: b.left, y: Math.max(0, b.top - 30), width: b.width, height: b.height + 40 };
        });
        await pg.screenshot({ path: path.join(BILDER, "04-reise-" + art + ".png"), clip: r });
        bild = true;
      }
    }
    sage(schlimmste.weg <= 3, "/" + art + ": die Kleidung bleibt auf dem Bild, waehrend es sich bewegt",
      "groesster Abstand " + schlimmste.weg + " px");
    sage(!schlimmste.schwebt, "/" + art + ": und schwebt nie ueber einem Platz ohne Bild");
    /* Danach ist alles wieder ganz normal. */
    await pg.waitForTimeout(6000);
    const nach = await pg.evaluate(() => [...document.querySelectorAll(".lc-kleid")].map((k) => {
      const p = k.parentElement, kr = p.querySelector(".lc-kreis");
      const a = kr.getBoundingClientRect(), b = k.getBoundingClientRect();
      return { schief: Math.round(Math.abs(a.left - b.left) + Math.abs(a.top - b.top)),
               rest: k.style.transform || k.style.opacity || "" };
    }));
    const krumm = nach.filter((x) => x.schief > 2 || (x.rest && x.rest !== "none" && x.rest !== "1"));
    sage(nach.length >= 1 && !krumm.length, "/" + art + ": nach der Reise sitzt alles wieder gerade",
      nach.length + " Stueck(e), schief: " + krumm.length);
  }

  /* =================================================================
     8. DIE KONSOLE
     ================================================================= */
  console.log("\n6) Konsole\n");
  const neu = konsole.slice(vorLaden);
  sage(!neu.length, "keine Fehler in der Konsole", neu.slice(0, 3).join(" | "));
  if (konsole.length > vorLaden) neu.slice(3, 10).forEach((z) => console.log("         " + z));

  console.log("\nBilder: " + BILDER);
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
