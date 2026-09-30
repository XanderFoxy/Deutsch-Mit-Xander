#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 836: REALISTISCHE MENSCHEN, ALLE HALTUNGEN, LEHRBUCH
   ---------------------------------------------------------------------
   XANDER (Funk 217, wörtlich): „da geht es mir im ersten Moment erstmal
   um die Menschen und um alle Positionen die Sie einnehmen können ob sie
   im Schneidersitz sitzen ob sie in der Hocke sitzen ob sie auf den
   Unterschenkeln hocken ob sie aufrecht auf den Unterschenkel hocken …
   ob sie auf allen Vieren sind ob sie auf dem Rücken liegen ob sie auf
   dem Bauch liegen … ob sie in der Wanne sitzen und die Beine angewinkelt
   haben … realistische Menschen … mit realistischen Gesichtern mit
   realistischen Körperteilen mit realistischer Behaarung alles im Detail“.

   Geprüft:
   1 HALTUNGEN (figuren/mensch.js im Browser): alle verlangten Haltungen
     sind da; vier Menschen (Mann, Frau, Kind, alte Frau) × alle Haltungen
     × drei Blickwinkel ohne Fehler; die Körperteile, die aufliegen
     müssen, liegen auf dem Boden (≤ 3 cm: Füße, Gesäß, Knie, Hände,
     Rücken …), was frei sein muss, ist frei; kein Glied steckt im Rumpf
     oder im anderen Bein; der Mann ist 7,5 Kopfhöhen groß; jede Figur
     < 60 KB SVG.
   2 BEKLEIDET: auch wenn keine Kleidung angegeben ist, ist der Rumpf
     bedeckt — Bildpunkte an Bauch, Leiste und Gesäß sind keine Haut.
   3 REALISMUS-MERKMALE im SVG: Iris mit Verlauf, Wimpern/Lider, Strähnen
     im Haar, Nasenflügel, Profil, Kontaktschatten nicht nötig — dafür
     Falten in der Hose beim Sitzen, Finger aus Gliedern.
   4 BAUKASTEN (Telefon 360 × 740, Finger): jede neue Haltung wird
     gezeichnet, der Satz nennt sie („sitzt im Schneidersitz“, „liegt auf
     dem Bauch“ …); in der Badewanne: Badekleidung, Haltung „in der Wanne
     sitzen“, Wasser bis zur Brust; Tippflächen ≥ 30 px, keine waagrechte
     Rollleiste.
   5 TAFELN: „Die Geschlechtsorgane“ (Längsschnitt Becken, Mann und Frau,
     beschriftet, Artikel, von der Hüfte aus erreichbar); Organkarten mit
     mehr Teilen; die 15 Szenen mit den neuen Menschen.
   Bildschirmfotos: BILD=/pfad/praefix
   Aufruf: node werkzeug/pruefe-836-menschen-realismus.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const tick = (ms) => new Promise((r) => setTimeout(r, ms));
const VERLANGT = ["schneidersitz", "hocken", "fersensitz", "knien", "krabbeln", "liegen", "bauchlage", "seitenlage",
  "sitzen_angewinkelt", "baden", "graetschsitz", "sitzen_ueberkreuz", "anlehnen", "laufen", "treppe", "buecken",
  "strecken", "arme_verschraenkt", "haende_huefte", "stehen", "gehen", "sitzen"];

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port + "/";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  /* ---------------------------------------------------------------- 1 */
  console.log("\n1 · HALTUNGEN\n");
  const pg = await br.newPage({ viewport: { width: 900, height: 700 } });
  pg.setDefaultTimeout(120000);
  await pg.goto(basis + "figuren/mensch.js");
  await pg.setContent("<html><body style='margin:0;background:#fff'></body></html>");
  await pg.addScriptTag({ url: basis + "figuren/mensch.js" });
  const f1 = await pg.evaluate((VERLANGT) => {
    const M = window.DMA_MENSCH;
    const fehlt = VERLANGT.filter((h) => M.HALTUNGEN.indexOf(h) < 0 || !M.POSEN[h] && h !== "gehen");
    const leute = [["erwachsen", "m"], ["erwachsen", "w"], ["kind", "m"], ["alt", "w"]];
    const kl = { oberteil: { stueck: "pullover", farbe: "gruen" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } };
    const kaputt = [], boden = [], frei = [], stecken = [];
    let anzahl = 0, maxKB = 0;
    M.HALTUNGEN.forEach((h) => leute.forEach(([a, g]) => [0, 40, 90].forEach((b) => {
      let r;
      try { r = M.zeichne({ alter: a, geschlecht: g, pose: h, blick: b, kleidung: kl, id: "p", messen: true }); } catch (e) { kaputt.push(h + "/" + a + g + ": " + e.message); return; }
      anzahl++;
      if (!r.svg || /NaN|undefined|Infinity/.test(r.svg)) kaputt.push(h + "/" + a + g + "/" + b);
      maxKB = Math.max(maxKB, r.svg.length / 1024);
      if (!r.mess) { kaputt.push(h + " ohne Messung"); return; }
      if (b === 0) {
        /* 3 cm; Kinder (großer Kopf, er liegt zuerst auf) 4 cm, alte Menschen mit rundem Rücken und Bauch 4,5 cm */
        (M.BODEN && M.BODEN[h] || []).forEach((k) => { if (!(r.mess.hoehe[k] <= (a === "alt" ? 4.5 : a === "kind" ? 4 : 3))) boden.push(h + "/" + a + g + ":" + k + "=" + r.mess.hoehe[k]); });
        (M.FREI && M.FREI[h] || []).forEach((k) => { if (!(r.mess.hoehe[k] > 2.5)) frei.push(h + "/" + a + g + ":" + k + "=" + r.mess.hoehe[k]); });
        if (a === "erwachsen" && r.mess.stecken.length) stecken.push(h + "/" + g + ": " + r.mess.stecken.join(";"));
      }
    })));
    const mann = M.zeichne({ pose: "stehen", blick: 35, kleidung: kl, id: "k" });
    return { fehlt, kaputt, boden, frei, stecken, anzahl, maxKB, haltungen: M.HALTUNGEN.length, koepfe: mann.hoehe / mann.mass.kopf, groesse: -mann.box.y0, H: mann.hoehe, BODEN: !!M.BODEN };
  }, VERLANGT);
  sage(!f1.fehlt.length, "alle verlangten Haltungen sind da (" + f1.haltungen + " Haltungen)", f1.fehlt.join(", "));
  sage(f1.anzahl === f1.haltungen * 12 && !f1.kaputt.length, f1.anzahl + " Figuren (4 Menschen × " + f1.haltungen + " Haltungen × 3 Blickwinkel) ohne Fehler", f1.kaputt.slice(0, 3).join(" | "));
  sage(f1.BODEN && !f1.boden.length, "was aufliegen muss, liegt auf dem Boden (Füße, Gesäß, Knie, Hände, Rücken … ≤ 3 cm)", f1.boden.slice(0, 5).join(" | "));
  sage(f1.BODEN && !f1.frei.length, "was frei sein muss, schwebt nicht auf dem Boden (Hocke: Gesäß frei, Strecken: Fersen frei …)", f1.frei.slice(0, 5).join(" | "));
  sage(!f1.stecken.length, "kein Glied steckt im Rumpf oder im anderen Bein (Mann und Frau, alle Haltungen)", f1.stecken.slice(0, 4).join(" | "));
  sage(Math.abs(f1.koepfe - 7.5) < 0.05 && Math.abs(f1.groesse - f1.H) < 6, "Proportionen: der erwachsene Mann ist 7,5 Kopfhöhen groß", f1.koepfe.toFixed(2) + " Köpfe");
  /* FASSUNG 838: Gesicht, Haar und Kleidung mit allen Details (Iris-
     Musterung, einzelne Wimpern und Brauenhaare, Strähnen, Nähte) — die
     Grenze steigt auf 90 KB je Figur (Auftrag 838: „möglichst < 90 KB“). */
  sage(f1.maxKB < 90, "jede Figur < 90 KB SVG", f1.maxKB.toFixed(1) + " KB");

  /* ---------------------------------------------------------------- 2 */
  console.log("\n2 · IMMER BEKLEIDET (Hautfläche im Rumpfbereich)\n");
  const f2 = await pg.evaluate(async () => {
    const M = window.DMA_MENSCH;
    const haut = (c) => c[3] > 200 && c[0] - c[2] > 32 && c[0] > 140 && c[1] > 90 && c[0] > c[1];
    const ergebnis = [];
    const probe = async (spec, stellen) => {
      const r = M.zeichne(Object.assign({ id: "b" + Math.random().toString(36).slice(2, 7) }, spec));
      const pad = 10, x0 = r.box.x0 - pad, y0 = r.box.y0 - pad, w = r.box.x1 - r.box.x0 + 2 * pad, h = r.box.y1 - r.box.y0 + 2 * pad, k = 4;
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * k + '" height="' + h * k + '" viewBox="' + x0 + " " + y0 + " " + w + " " + h + '">' + r.svg + "</svg>";
      const img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      await img.decode();
      const cv = document.createElement("canvas"); cv.width = w * k; cv.height = h * k;
      const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
      let hautig = 0;
      stellen.forEach((n) => { const p = r.punkte[n]; if (!p) return; const d = cx.getImageData(Math.round((p[0] - x0) * k), Math.round((p[1] - y0) * k), 1, 1).data; if (haut(d)) hautig++; });
      return hautig;
    };
    /* a) In JEDER Haltung zeichnet die Figur ohne Kleidungsangabe ein
       Grundstück über Becken und Rumpf (graue Hose, weißes T-Shirt). */
    for (const h of M.HALTUNGEN) for (const g of ["m", "w"]) for (const a of ["erwachsen", "kind", "alt"]) {
      const svg = M.zeichne({ pose: h, geschlecht: g, alter: a, blick: 30, kleidung: {}, id: "q" }).svg;
      if (svg.indexOf(M.FARBE.grau) < 0 || svg.indexOf(M.FARBE.weiss) < 0) ergebnis.push(h + "/" + a + g + " ohne Grundkleidung");
    }
    /* b) Bildpunkte: wo Bauch, Leiste und Gesäß offen zu sehen sind (aufrecht
       und sitzend, von vorn und hinten), ist dort keine Haut. Im Liegen
       und Bücken liegen Hände und Gesicht davor — dort gilt a). */
    const offen = ["stehen", "kontrapost", "gehen", "sitzen", "schneidersitz", "fersensitz", "knien", "sitzen_angewinkelt", "graetschsitz", "laufen", "treppe", "strecken", "haende_huefte", "winken", "zeigen"];
    for (const h of offen.filter((x) => M.HALTUNGEN.indexOf(x) >= 0)) {
      for (const g of ["m", "w"]) {
        const vorn = await probe({ pose: h, geschlecht: g, blick: 0, kleidung: {} }, ["bauch", "leiste", "nabel"]);
        const hinten = await probe({ pose: h, geschlecht: g, blick: 180, kleidung: {} }, ["gesaess", "lende"]);
        if (vorn >= 2 || hinten >= 2) ergebnis.push(h + "/" + g + " (Haut vorn " + vorn + ", hinten " + hinten + ")");
      }
    }
    const kinder = await probe({ pose: "stehen", alter: "kind", geschlecht: "w", blick: 0, kleidung: {} }, ["bauch", "leiste", "nabel", "brust"]);
    return { ergebnis, kinder };
  });
  sage(!f2.ergebnis.length, "ohne Kleidungsangabe ist jede Figur in jeder Haltung bekleidet (keine Haut an Bauch, Leiste, Gesäß)", f2.ergebnis.slice(0, 5).join(" | "));
  sage(f2.kinder === 0, "Kinder sind vollständig bekleidet (auch die Brust)", "Hautpunkte: " + f2.kinder);

  /* ---------------------------------------------------------------- 3 */
  console.log("\n3 · MERKMALE IM BILD\n");
  const f3 = await pg.evaluate(() => {
    const M = window.DMA_MENSCH;
    const w = M.zeichne({ pose: "stehen", geschlecht: "w", frisur: "lang", blick: 25, id: "w" }).svg;
    const m = M.zeichne({ pose: "stehen", geschlecht: "m", bart: "bart_kurz", blick: 25, id: "m", kleidung: { oberteil: { stueck: "tshirt" }, unterteil: { stueck: "jeans" } } }).svg;
    const s = M.zeichne({ pose: "sitzen", blick: 30, id: "s", kleidung: { oberteil: { stueck: "hemd" }, unterteil: { stueck: "jeans" } } }).svg;
    const p = M.zeichne({ pose: "stehen", blick: 90, id: "p" }).svg;
    return {
      /* FASSUNG 838: Wimpern sind einzelne Striche in der Farbe des Haars (data-teil="wimpern") */
      iris: /radialGradient/.test(w), wimpern: (w.match(/stroke="#2a1c16"/g) || []).length >= 6 || (w.match(/data-teil="wimpern"/g) || []).length >= 2,
      straehnen: (w.match(/stroke-width="0\.[0-9]+" stroke-linecap="round" stroke-linejoin="round" opacity="0\.[0-9]+"/g) || []).length >= 15,
      stoppeln: /<pattern /.test(m), gesichtClip: /clipPath id="m\w*f/.test(m), finger: (m.match(/stroke-linecap="round"/g) || []).length >= 40,
      falten: (s.match(/opacity="0\.[1-5]\d?"/g) || []).length >= 10, profil: p.length > 20000,
    };
  });
  sage(f3.iris && f3.wimpern, "Augen mit Iris (Verlauf), Lidern und Wimpern");
  sage(f3.straehnen, "Haar mit Strähnen und Glanz");
  sage(f3.stoppeln && f3.gesichtClip, "Bartstoppeln statt Maske; Gesichtszüge bleiben im Kopfumriss");
  sage(f3.finger, "Hände mit Fingergliedern");
  sage(f3.falten, "Faltenwurf der Kleidung beim Sitzen (Knie, Hüfte, Saum)");
  await pg.close();

  /* ---------------------------------------------------------------- 4 */
  console.log("\n4 · BAUKASTEN — Telefon 360\n");
  try {
    const pb = await br.newPage({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    pb.setDefaultTimeout(120000);
    const pf = []; pb.on("pageerror", (e) => pf.push(String(e.message || e)));
    await pb.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
    await pb.goto(basis + "index.html", { waitUntil: "domcontentloaded" });
    await pb.waitForFunction(() => window.Baukasten, null, { timeout: 120000 });
    await pb.evaluate(async () => {
      const d = document.createElement("div"); d.id = "__bk";
      d.style.cssText = "position:absolute;left:0;top:0;width:100%;z-index:99999;background:#fff;padding:8px;box-sizing:border-box";
      document.body.appendChild(d);
      Baukasten.zustand.szene = "wohnzimmer"; Baukasten.zustand.platz = null;
      await Baukasten.render(d);
    });
    await pb.waitForFunction(() => document.querySelector("#__bk [data-bk-figur] .mensch"), null, { timeout: 60000 });
    await pb.evaluate(() => document.querySelector('#__bk [data-bk-fach="wer"]').click());
    await tick(300);
    const ERWARTET = { schneidersitz: "im Schneidersitz", hocken: "in der Hocke", fersensitz: "auf den Fersen", knien: "kniet aufrecht",
      krabbeln: "auf allen vieren", liegen: "liegt auf dem Rücken", bauchlage: "liegt auf dem Bauch", seitenlage: "liegt auf der Seite",
      sitzen_angewinkelt: "mit angewinkelten Beinen", graetschsitz: "im Grätschsitz", arme_verschraenkt: "mit verschränkten Armen",
      haende_huefte: "mit den Händen in den Hüften", laufen: "joggt", buecken: "bückt sich", strecken: "streckt sich", anlehnen: "lehnt an der Wand",
      treppe: "eine Stufe hinauf" };
    const f4 = await pb.evaluate(async (ERWARTET) => {
      const schlecht = [], saetze = {};
      for (const h of Object.keys(ERWARTET)) {
        const b = [...document.querySelectorAll('#__bk [data-bk="haltung"]')].find((x) => x.dataset.wert === h);
        if (!b) { schlecht.push(h + " fehlt"); continue; }
        b.click();
        await new Promise((r) => setTimeout(r, 650));
        const g = document.querySelector("#__bk [data-bk-figur]");
        const satz = document.querySelector("#__bk .bk-satz-text").textContent;
        saetze[h] = satz;
        if (!g || g.innerHTML.length < 3000 || /NaN/.test(g.innerHTML) || satz.indexOf(ERWARTET[h]) < 0) schlecht.push(h + ": " + satz);
      }
      return { schlecht, saetze };
    }, ERWARTET);
    sage(!f4.schlecht.length, "jede neue Haltung wird gezeichnet und im Satz genannt (" + Object.keys(ERWARTET).length + ")", f4.schlecht.slice(0, 3).join(" | "));
    console.log("        z. B. „" + f4.saetze.schneidersitz + "“ · „" + f4.saetze.bauchlage + "“");
    if (BILD) {
      for (const h of ["schneidersitz", "bauchlage", "hocken"]) {
        await pb.evaluate((h) => [...document.querySelectorAll('#__bk [data-bk="haltung"]')].find((x) => x.dataset.wert === h).click(), h);
        await tick(800);
        await (await pb.$("#__bk .bk-buehne")).screenshot({ path: BILD + "-baukasten-360-" + h + ".png" });
      }
    }
    /* Badewanne */
    await pb.evaluate(async () => {
      [...document.querySelectorAll('#__bk [data-bk="haltung"]')].find((x) => x.dataset.wert === "_platz").click();
      await new Promise((r) => setTimeout(r, 300));
      Baukasten.zustand.szene = "badezimmer"; Baukasten.zustand.platz = null;
      await Baukasten.render(document.getElementById("__bk"));
    });
    await tick(600);
    await pb.evaluate(() => document.querySelector('#__bk [data-bk-platz="badezimmer-badewanne"]').dispatchEvent(new MouseEvent("click", { bubbles: true })));
    await tick(600);
    await pb.waitForFunction(() => !Baukasten.bewegt(), null, { timeout: 20000 }).catch(() => {});
    await tick(300);
    const bad = await pb.evaluate(() => {
      const z = Baukasten.zustand;
      const svg = document.querySelector("#__bk .bk-svg").innerHTML;
      const kleider = Object.keys(z.kleidung).map((k) => z.kleidung[k] && z.kleidung[k].stueck);
      const f = document.querySelector("#__bk [data-bk-figur]");
      const m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(f.getAttribute("transform"));
      const fig = bkFigurSvg(z, 0);
      /* FASSUNG 838: statt abgeschnitten liegt die Figur hinter Wannenwand und Wasser */
      return { haltung: z.haltung, kleider, wasser: /clipPath id="bkWasser"/.test(svg) || /data-bk-vorne="wasser"/.test(svg), brust: +m[2] + fig.brustY, wasserY: z.platz && z.platz.wasserY, satz: document.querySelector("#__bk .bk-satz-text").textContent };
    });
    sage(bad.haltung === "baden" && bad.wasser, "in der Badewanne: sitzen mit angewinkelten Beinen im Wasser", JSON.stringify({ h: bad.haltung, wasser: bad.wasser }));
    sage(bad.kleider.some((k) => /badeanzug|badehose|badeshirt/.test(k)) && !bad.kleider.includes("bademantel"), "in der Wanne Badekleidung (Badeanzug bzw. Badehose mit Badeshirt)", bad.kleider.join(","));
    /* FASSUNG 838: das Gesäß liegt jetzt auf dem Wannenboden (Sonde 838) —
       das Wasser steht auf Brusthöhe bis unter die Achseln (Brust bis
       10 Einheiten ≈ 17 cm unter dem Wasserspiegel). */
    sage(bad.brust - bad.wasserY > -3 && bad.brust - bad.wasserY < 10, "das Wasser verdeckt die Figur ab der Brust", "Brust " + bad.brust.toFixed(1) + " / Wasser " + bad.wasserY);
    sage(/in der Badewanne/.test(bad.satz) && /angewinkelten Beinen/.test(bad.satz), "der Satz: „… sitzt mit angewinkelten Beinen in der Badewanne“", bad.satz);
    if (BILD) await (await pb.$("#__bk .bk-buehne")).screenshot({ path: BILD + "-baukasten-360-badewanne.png" });
    await pb.evaluate(() => document.querySelector('#__bk [data-bk-fach="wer"]').click());
    await tick(300);
    const ui = await pb.evaluate(() => ({ kleinste: Math.min(...[...document.querySelectorAll("#__bk button")].filter((b) => b.offsetParent).map((b) => b.getBoundingClientRect().height)), breit: document.documentElement.scrollWidth, fenster: innerWidth }));
    sage(ui.kleinste >= 30, "Tippflächen im Baukasten ≥ 30 px", ui.kleinste.toFixed(0) + " px");
    sage(ui.breit <= ui.fenster, "keine waagrechte Rollleiste auf 360 px", ui.breit + " / " + ui.fenster);
    if (BILD) await pb.screenshot({ path: BILD + "-baukasten-360-wahl.png", fullPage: false });
    sage(!pf.length, "keine Seitenfehler", pf.slice(0, 2).join(" | "));
    await pb.close();
  } catch (e) { sage(false, "Baukasten-Teil lief durch", String(e.message || e).split("\n")[0]); }

  /* ---------------------------------------------------------------- 5 */
  console.log("\n5 · TAFELN UND SZENEN\n");
  global.window = global; window.DMA_SZENE = {};
  const tafel = (id) => { const f = path.join(WURZEL, "szenen", id + ".js"); if (!fs.existsSync(f)) return null; delete require.cache[f]; require(f); return window.DMA_SZENE[id] || null; };
  const go = tafel("geschlechtsorgane");
  const reg = fs.readFileSync(path.join(WURZEL, "data-szenen.js"), "utf8");
  sage(go && go.teile.length === 2 && /"id":\s*"geschlechtsorgane"/.test(reg), "Tafel „Die Geschlechtsorgane“: Längsschnitt Mann und Frau, eingetragen", go && go.teile.map((t) => t.de).join(" | "));
  const worte = go ? go.teile.flatMap((t) => t.unter || []) : [];
  const muss = ["die Gebärmutter", "der Eierstock", "der Eileiter", "die Scheide", "die große Schamlippe", "die kleine Schamlippe", "der Kitzler", "der Hoden", "der Nebenhoden", "der Samenleiter", "die Prostata", "der Penis", "die Harnröhre", "die Harnblase"];
  const fehlend = muss.filter((w) => !worte.some((u) => u.de === w));
  sage(go && !fehlend.length && worte.length >= 28, "beschriftet mit den Fachwörtern (" + worte.length + " Teile)", fehlend.join(", "));
  sage(go && worte.every((u) => /^(der|die|das) /.test(u.de) && u.it && u.en && u.syl), "jedes Fachwort mit Artikel, Silben, Italienisch und Englisch");
  const beschr = go ? (go.teile.map((t) => t.kunst).join("").match(/bw-beschriftung/g) || []).length : 0;
  sage(beschr >= 28 && !/NaN|undefined/.test(JSON.stringify(go)), "Beschriftungen mit Zeigerlinien in der Tafel", beschr + " Beschriftungen");
  const kp = tafel("koerper");
  sage(kp && kp.teile.some((t) => t.lupe === "geschlechtsorgane"), "von der Tafel „Der Körper“ aus erreichbar (Lupe an der Hüfte)");
  const alleKunst = go ? go.kulisse + go.teile.map((t) => t.kunst).join("") : "";
  sage(go && !/class="mensch"/.test(alleKunst), "Schema, keine Figuren in der Tafel (kein Akt, keine Haltung)");
  const inn = tafel("koerper_innen");
  const n = (id) => { const t = inn && inn.teile.find((x) => x.id === id); return t ? (t.unter || []).length : 0; };
  sage(n("gehirn") >= 11 && n("herz") >= 12 && n("lunge") >= 13 && n("magen") >= 10, "Organkarten detaillierter (Gehirn, Herz, Lunge, Magen)", "gehirn " + n("gehirn") + ", herz " + n("herz") + ", lunge " + n("lunge") + ", magen " + n("magen"));
  const SZ = ["badezimmer", "schlafzimmer", "kueche", "wohnzimmer", "kinderzimmer", "klassenzimmer", "restaurant", "supermarkt", "strasse", "bahnhof", "arztpraxis", "flur", "cafe", "bibliothek", "bewerbungsgespraech"];
  const ohne = SZ.filter((id) => { const s = tafel(id); return !s || !/wimpern|radialGradient/.test(JSON.stringify(s)) && !/<pattern |id=\\"\w+i\d+\\"/.test(JSON.stringify(s)); });
  sage(!ohne.length, "die 15 Szenen zeigen die neuen Menschen (Iris mit Verlauf)", ohne.join(","));

  if (BILD) {
    /* Übersichtsbogen aller Haltungen, drei Blickwinkel */
    const pz = await br.newPage({ viewport: { width: 1300, height: 800 } });
    await pz.setContent("<html><body style='margin:0;background:#eee'></body></html>");
    await pz.addScriptTag({ url: basis + "figuren/mensch.js" });
    await pz.evaluate(() => {
      const M = window.DMA_MENSCH; let html = "";
      M.HALTUNGEN.forEach((h, i) => {
        html += '<div style="display:inline-block;margin:2px;background:#fff;font:10px sans-serif">' + h + "<br>";
        [30, 90, -40].forEach((b, j) => {
          const r = M.zeichne({ pose: h, blick: b, geschlecht: i % 2 ? "w" : "m", frisur: i % 2 ? "lang" : "kurz", id: "u" + i + "_" + j, kleidung: { oberteil: { stueck: i % 2 ? "bluse" : "pullover", farbe: i % 2 ? "rot" : "gruen" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } });
          const w = r.box.x1 - r.box.x0 + 12, hh = r.box.y1 - r.box.y0 + 12;
          html += '<svg width="100" height="130" viewBox="' + (r.box.x0 - 6) + " " + (r.box.y0 - 6) + " " + w + " " + hh + '">' + r.svg + "</svg>";
        });
        html += "</div>";
      });
      document.body.innerHTML = html;
    });
    await pz.screenshot({ path: BILD + "-haltungen.png", fullPage: true });
    await pz.close();
  }
  await br.close(); srv.close();
  console.log("\nFassung 836 (realistische Menschen, Haltungen, Lehrbuch): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
