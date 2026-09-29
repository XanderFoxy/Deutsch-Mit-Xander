#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 834: MENSCHEN IN DEN BILDERWELTEN, BAUKASTEN, SATZBAU
   ---------------------------------------------------------------------
   XANDER (Funk 213/214, wörtlich): „dass wir wirklich diesmal
   realistische Personen haben … sämtliche Sitz-, Steh-, Hock-, Knie-
   und sonst was auf allen Vieren Positionen … dass sie sich … innerhalb
   der Bilder … auch bewegen … man soll sie dort auch hinsetzen können
   … mit ein paar einfachen Animationen“ und „den Satzbaukasten endlich
   repariert und gefixt so dass er sinnvoll funktioniert“.

   Geprüft:
   1 FIGUREN (figuren/mensch.js, im Browser): 12 Menschen (6 Alter × 2)
     in allen Haltungen und drei Blickrichtungen — kein Fehler, kein NaN,
     Füße/Knie/Gesäß auf dem Boden, Erwachsene 7,5 Kopfhöhen und richtig
     groß, Hände mit fünf Fingern, eine Figur < 45 KB, die Datei < 120 KB.
   2 BAUKASTEN (Telefon 360 × 740 mit Finger, Rechner 1280 × 800 mit Maus):
     keine alten Figurendateien werden geholt; Figur auf das Sofa ziehen →
     sie setzt sich (Haltung „sitzen“), und ihr Gesäß liegt auf der
     Sitzfläche (± 1 Einheit); dabei läuft eine Bewegung; Winken und
     Umdrehen bewegen die Figur; jede Haltung lässt sich wählen und wird
     gezeichnet; es gibt keinen „nichts an“-Schalter und die Figur ist
     immer bekleidet; Tippflächen ≥ 30 px, keine waagrechte Rollleiste.
   3 SATZBAUKASTEN (360 × 740, Finger): „Satz legen“ ist da; der richtige
     Satz (durch Antippen gelegt) wird als richtig erkannt, ein falsch
     gelegter als falsch — mit Hinweis; Großschreibung am Anfang und
     Satzzeichen am Ende stimmen; Ziehen legt ein Kärtchen an die Stelle;
     beim Bauen klebt der Satz oben; im Deutsch-Raum keine italienische
     Zeile; Zufallssätze kommen aus den Vorschlägen je Tätigkeit.
   4 LEHRBUCHTAFELN: Entstehung als neun Zell-Tafeln (keine Tafel
     „Geschlechtsverkehr“), Körper/Körperbau ohne Geschlechtsteile als
     Tippwörter, Organkarten mit Teilen, Tafel „Die Muskeln“, Artikel.
   Bildschirmfotos: BILD=/pfad/praefix
   Aufruf: node werkzeug/pruefe-834-menschen-satzbau.js
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = process.env.WURZEL || path.join(__dirname, "..");
const BILD = process.env.BILD || "";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp" };
let fehler = 0;
const sage = (gut, was, zusatz) => { if (!gut) fehler++; console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : "")); };
const tick = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(a);
  }).listen(0);
  const basis = "http://127.0.0.1:" + srv.address().port + "/index.html";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const seite = async (vp, telefon) => {
    const pg = await br.newPage({ viewport: vp, deviceScaleFactor: telefon ? 2 : 1, hasTouch: !!telefon, isMobile: !!telefon });
    pg.setDefaultTimeout(90000);
    pg.fehler = []; pg.anfragen = [];
    pg.on("pageerror", (e) => pg.fehler.push(String(e.message || e)));
    pg.on("request", (r) => pg.anfragen.push(r.url()));
    await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
    await pg.goto(basis, { waitUntil: "domcontentloaded" });
    await pg.waitForFunction(() => window.Baukasten && window.Satzbau, null, { timeout: 90000 });
    return pg;
  };

  /* ---------------------------------------------------------------- 1 */
  console.log("\n1 · FIGUREN IN ALLEN HALTUNGEN\n");
  const hatMensch = fs.existsSync(path.join(WURZEL, "figuren/mensch.js"));
  sage(hatMensch, "figuren/mensch.js ist da (ein Figuren-System für alle Menschen)");
  if (hatMensch) {
  const pg1 = await seite({ width: 800, height: 600 }, false);
  const datei = fs.statSync(path.join(WURZEL, "figuren/mensch.js")).size;
  /* FASSUNG 836: Realismus (Muskelprofile, Gesicht, Haar, Falten, 32
     Haltungen) — die Datei darf wachsen, bleibt aber eine Datei < 200 KB. */
  sage(datei < 200 * 1024, "figuren/mensch.js ist leicht (eine Datei für alle Menschen)", Math.round(datei / 1024) + " KB");
  await pg1.addScriptTag({ url: basis.replace("index.html", "figuren/mensch.js") });
  const fig = await pg1.evaluate(() => {
    const M = window.DMA_MENSCH;
    const alter = ["saeugling", "kleinkind", "kind", "jugendlich", "erwachsen", "alt"];
    const kl = { oberteil: { stueck: "pullover", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh" } };
    const probleme = [], boden = [], groesse = []; let anzahl = 0, maxKB = 0, finger = 1e9;
    alter.forEach((a) => ["m", "w"].forEach((g) => M.HALTUNGEN.forEach((h) => [0, 35, 90].forEach((b) => {
      let r;
      try { r = M.zeichne({ alter: a, geschlecht: g, pose: h, blick: b, kleidung: kl, id: "t", messen: true }); }
      catch (e) { probleme.push(a + g + "/" + h + "/" + b + ": " + e.message); return; }
      anzahl++;
      if (!r.svg || r.svg.length < 2000 || /NaN|undefined|Infinity/.test(r.svg)) probleme.push(a + g + "/" + h + "/" + b + ": leer oder NaN");
      maxKB = Math.max(maxKB, r.svg.length / 1024);
      /* Der tiefste Punkt liegt auf dem Boden (Ursprung): höchstens 2 cm
         darunter (Kontur), nicht darüber schwebend. Die Kamera schaut 10°
         von oben: ein Fuß, der einen halben Meter VOR der Hüfte steht
         (halbes Knien), erscheint dadurch um etwa 9 cm tiefer — von vorn
         und schräg darf es darum etwas mehr sein als im Profil. */
      /* FASSUNG 836: Liegende reichen der Länge nach auf den Betrachter zu
         (Blick von vorn) — durch die 10° Aufsicht erscheint der vordere
         Teil tiefer (beim Säugling mit dem großen Kopf vorn am meisten); dort gilt 17 %. */
      const liegt = ["liegen", "bauchlage", "seitenlage"].indexOf(h) >= 0;
      /* FASSUNG 836: Seit mensch.js misst (messen: true), wird der Boden
         direkt geprüft: der tiefste Körperteil liegt 0 … 3 cm über dem
         Boden. Die Bildkante war nur ein Ersatz dafür — bei gespreizten
         oder liegenden Beinen, die auf den Betrachter zu reichen, täuscht
         sie durch die 10° Aufsicht. */
      if (r.mess && r.mess.hoehe) {
        const hmin = Math.min.apply(null, Object.keys(r.mess.hoehe).map((k) => r.mess.hoehe[k]));
        if (hmin < -1 || hmin > 3) boden.push(a + g + "/" + h + "/" + b + " tiefster Teil " + hmin);
      } else if (r.box.y1 < -2.5 || r.box.y1 > (b === 90 ? 0.05 : (liegt ? 0.17 : 0.07)) * r.hoehe + 2) boden.push(a + g + "/" + h + "/" + b + " " + r.box.y1.toFixed(1));
      if (h === "stehen" && b === 35) {
        groesse.push([a + g, r.hoehe, -r.box.y0, r.mass.kopf]);
        finger = Math.min(finger, (r.svg.match(/stroke-linecap="round"/g) || []).length);
      }
      /* Sichtbar im Stehen: Figur aufrecht (Kopf über den Füßen). */
      if (h === "stehen" && r.kopf.y > -0.6 * r.hoehe) probleme.push(a + g + " steht nicht aufrecht");
      if (M.SITZEND[h] && !(r.sitz.y < -0.08 * r.hoehe)) probleme.push(a + g + "/" + h + " ohne Sitzpunkt");
    }))));
    return { probleme, boden, groesse, anzahl, maxKB, finger, haltungen: M.HALTUNGEN.length };
  });
  sage(fig.anzahl === 12 * fig.haltungen * 3 && !fig.probleme.length, "alle " + fig.anzahl + " Figuren (12 Menschen × " + fig.haltungen + " Haltungen × 3 Blickrichtungen) ohne Fehler", fig.probleme.slice(0, 3).join(" | "));
  sage(!fig.boden.length, "jede Haltung steht, sitzt, kniet oder liegt auf dem Boden (schwebt nicht, sinkt nicht ein)", fig.boden.slice(0, 4).join(" | "));
  const erw = fig.groesse.find((x) => x[0] === "erwachsenm");
  sage(erw && Math.abs(erw[1] / erw[3] - 7.5) < 0.05 && Math.abs(erw[2] - erw[1]) < 6, "der erwachsene Mann: 7,5 Kopfhöhen, gezeichnet so groß wie er ist", erw && (erw[1] / erw[3]).toFixed(2) + " Köpfe, " + erw[2].toFixed(0) + " von " + erw[1] + " cm");
  const baby = fig.groesse.find((x) => x[0] === "saeuglingm");
  sage(baby && baby[1] / baby[3] < 4.5, "der Säugling hat Babyproportionen (4 Kopfhöhen)", baby && (baby[1] / baby[3]).toFixed(2));
  sage(fig.finger >= 20, "Hände mit Fingern (je Hand fünf, als Glieder gezeichnet)", fig.finger + " Fingerstriche");
  /* FASSUNG 836: Grenze 60 KB je Figur (vorher 45 KB) */
  sage(fig.maxKB < 60, "jede Figur bleibt leicht (< 60 KB SVG)", fig.maxKB.toFixed(1) + " KB");
  await pg1.close();
  }

  /* ---------------------------------------------------------------- 2 */
  for (const [name, vp, telefon] of [["Telefon 360", { width: 360, height: 740 }, true], ["Rechner 1280", { width: 1280, height: 800 }, false]]) {
    console.log("\n2 · BAUKASTEN — " + name + "\n");
    /* Bricht ein Schritt ab (z. B. bei der Gegenprobe mit dem alten
       Stand), zählt das als rot, und die Sonde läuft weiter. */
    try {
    const pg = await seite(vp, telefon);
    await pg.evaluate(async () => {
      const d = document.createElement("div"); d.id = "__bk";
      d.style.cssText = "position:absolute;left:0;top:0;width:100%;z-index:99999;background:#fff;padding:8px;box-sizing:border-box";
      document.body.appendChild(d);
      Baukasten.zustand.szene = "wohnzimmer"; Baukasten.zustand.platz = null;
      await Baukasten.render(d);
    });
    await pg.waitForFunction(() => document.querySelector("#__bk [data-bk-figur] .mensch"), null, { timeout: 30000 });
    await tick(300);
    const alt = pg.anfragen.filter((u) => /figuren\/[a-z]+-[mw](-teil\d)?\.js|seitsitz\.js/.test(u));
    sage(!alt.length, "keine alten Figurendateien (bis 3,4 MB je Mensch) werden geholt", alt.slice(0, 2).join(" "));
    sage(pg.anfragen.some((u) => /figuren\/mensch\.js/.test(u)), "figuren/mensch.js wird geladen");

    /* Die Figur auf das Sofa ziehen */
    await pg.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, 0); });
    await tick(200);
    const lage = await pg.evaluate(() => {
      const svg = document.querySelector("#__bk .bk-svg"), r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
      const zuPx = (x, y) => ({ x: r.left + x / vb.width * r.width, y: r.top + y / vb.height * r.height });
      const f = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(document.querySelector("#__bk [data-bk-figur]").getAttribute("transform"));
      const sofa = window.DMA_PLAETZE.find((p) => p.id === "wohnzimmer-sofa");
      return { von: zuPx(+f[1], +f[2] - vb.height * 0.2), nach: zuPx(sofa.x, sofa.y), sofa };
    });
    if (telefon) {
      const cdp = await pg.context().newCDPSession(pg);
      const t = (type, p) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x: p.x, y: p.y }] });
      await t("touchStart", lage.von);
      for (let i = 1; i <= 12; i++) { await t("touchMove", { x: lage.von.x + (lage.nach.x - lage.von.x) * i / 12, y: lage.von.y + (lage.nach.y - lage.von.y) * i / 12 }); await tick(20); }
      await t("touchEnd", lage.nach);
    } else {
      await pg.mouse.move(lage.von.x, lage.von.y); await pg.mouse.down();
      for (let i = 1; i <= 12; i++) { await pg.mouse.move(lage.von.x + (lage.nach.x - lage.von.x) * i / 12, lage.von.y + (lage.nach.y - lage.von.y) * i / 12); await tick(20); }
      await pg.mouse.up();
    }
    await tick(120);
    const bewegtBeimEinrasten = await pg.evaluate(() => Baukasten.bewegt());
    await tick(900);
    const sitz = await pg.evaluate(() => {
      const z = Baukasten.zustand;
      const f = bkFigurSvg(z, 0);
      const m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(document.querySelector("#__bk [data-bk-figur]").getAttribute("transform"));
      return { platz: z.platz && z.platz.id, haltung: z.haltung, sitzY: z.platz && z.platz.sitzY, gesaess: +m[2] + f.sitz, satz: document.querySelector("#__bk .bk-satz-text").textContent };
    });
    sage(sitz.platz === "wohnzimmer-sofa" && sitz.haltung === "sitzen", "auf das Sofa gezogen: die Figur setzt sich", JSON.stringify({ platz: sitz.platz, haltung: sitz.haltung }));
    sage(Math.abs(sitz.gesaess - sitz.sitzY) < 1, "die Sitz-Haltung rastet ein: das Gesäß liegt auf der Sitzfläche", "Gesäß " + sitz.gesaess.toFixed(1) + " / Sitzfläche " + sitz.sitzY);
    sage(bewegtBeimEinrasten, "beim Einrasten bewegt sich die Figur (Hinsetzen als Bewegung)");
    sage(/sitzt auf dem Sofa/.test(sitz.satz), "der Satz sagt es: „… sitzt auf dem Sofa“", sitz.satz);
    if (BILD) { const el = await pg.$("#__bk .bk-buehne"); await el.screenshot({ path: BILD + "-baukasten-" + vp.width + "-sofa.png" }); }

    /* Winken und Umdrehen */
    const vorWinken = await pg.evaluate(() => document.querySelector("#__bk [data-bk-figur]").innerHTML.length);
    await pg.evaluate(() => document.querySelector('#__bk [data-bk-tu="winken"]').click());
    await tick(700);
    const winkt = await pg.evaluate((v) => ({ laeuft: Baukasten.bewegt(), anders: document.querySelector("#__bk [data-bk-figur]").innerHTML.length !== v }), vorWinken);
    sage(winkt.laeuft && winkt.anders, "„Winken“ bewegt den Arm (Animation läuft)");
    if (BILD) { const el = await pg.$("#__bk .bk-buehne"); await el.screenshot({ path: BILD + "-baukasten-" + vp.width + "-winken.png" }); }
    await tick(2400);

    /* Jede Haltung wählen */
    await pg.evaluate(() => document.querySelector('#__bk [data-bk-fach="wer"]').click());
    const halt = await pg.evaluate(async () => {
      const ids = [...document.querySelectorAll('#__bk [data-bk="haltung"]')].map((b) => b.dataset.wert).filter((w) => w !== "_platz");
      const schlecht = [];
      for (const h of ids) {
        const b = [...document.querySelectorAll('#__bk [data-bk="haltung"]')].find((x) => x.dataset.wert === h);
        b.click();
        await new Promise((r) => setTimeout(r, 700));
        const g = document.querySelector("#__bk [data-bk-figur]");
        if (!g || g.innerHTML.length < 3000 || /NaN/.test(g.innerHTML) || Baukasten.zustand.haltung !== h) schlecht.push(h);
      }
      return { ids, schlecht };
    });
    sage(halt.ids.length >= 16 && !halt.schlecht.length, "alle " + halt.ids.length + " Haltungen lassen sich wählen und werden gezeichnet (hocken, knien, auf allen vieren …)", halt.schlecht.join(", "));
    if (BILD) {
      await pg.evaluate(() => [...document.querySelectorAll('#__bk [data-bk="haltung"]')].find((x) => x.dataset.wert === "krabbeln").click());
      await tick(900);
      const el = await pg.$("#__bk .bk-buehne"); await el.screenshot({ path: BILD + "-baukasten-" + vp.width + "-krabbeln.png" });
    }

    /* Bekleidet, Tippflächen, Breite */
    await pg.evaluate(() => document.querySelector('#__bk [data-bk-fach="kleidung"]').click());
    await tick(200);
    const kl = await pg.evaluate(() => {
      const nackt = document.querySelector('#__bk [data-bk="anhaben"]');
      const leerOben = [...document.querySelectorAll('#__bk [data-bk="kl-oberteil"], #__bk [data-bk="kl-unterteil"]')].some((b) => b.dataset.wert === "nichts");
      /* auch wenn jemand im Zustand alles wegnimmt: gezeichnet wird bekleidet */
      const k = bkKleidungFuerFigur({ kleidung: {} });
      const kleinste = Math.min(...[...document.querySelectorAll("#__bk button")].filter((b) => b.offsetParent).map((b) => b.getBoundingClientRect().height));
      return { nackt: !!nackt, leerOben, bekleidet: !!(k.oberteil && k.unterteil), kleinste, breit: document.documentElement.scrollWidth, fenster: innerWidth };
    });
    sage(!kl.nackt && !kl.leerOben && kl.bekleidet, "kein „nichts an“; Oberteil und Unterteil lassen sich tauschen, nicht wegnehmen; die Figur ist immer bekleidet");
    sage(kl.kleinste >= 30, "Tippflächen im Baukasten ≥ 30 px", kl.kleinste.toFixed(0) + " px");
    sage(kl.breit <= kl.fenster, "keine waagrechte Rollleiste", kl.breit + " / " + kl.fenster);
    sage(!pg.fehler.length, "keine Seitenfehler", pg.fehler.slice(0, 2).join(" | "));
    await pg.close();
    } catch (e) { sage(false, "Baukasten (" + name + ") lässt sich bis zum Ende bedienen", String(e.message || e).split("\n")[0]); }
  }

  /* ---------------------------------------------------------------- 3 */
  console.log("\n3 · SATZBAUKASTEN — Telefon 360 × 740\n");
  try {
  const pg = await seite({ width: 360, height: 740 }, true);
  await pg.evaluate(() => document.querySelector(".tape-tab[data-target=view-learn]").click());
  await pg.evaluate(() => document.querySelector('#learnSubnav [data-sub="sub-satzbaukasten-de"]').click());
  await pg.waitForFunction(() => document.querySelector("#satzbaukastenDeArea .baustein-satz"), null, { timeout: 30000 });
  const bauen = await pg.evaluate(() => ({
    italienisch: !!document.querySelector("#satzbaukastenDeArea .baustein-satz-de"),
    legen: !!document.querySelector('#satzbaukastenDeArea [data-sbk-ansicht="ueben"]'),
  }));
  sage(!bauen.italienisch, "im Deutsch-Raum keine italienische Zeile unter dem Satz");
  sage(bauen.legen, "es gibt „Satz legen“ (Satzglieder ordnen und prüfen lassen)");
  /* Der Satz klebt oben, während man unten Bausteine wählt */
  const klebt = await pg.evaluate(async () => {
    const k = document.querySelector("#satzbaukastenDeArea .sbk-klebe");
    if (!k) return null;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: k.getBoundingClientRect().top + scrollY + 1500, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 300));
    /* sichtbar ist das Original (klebend) oder die schwebende Kopie */
    const kand = [k, document.querySelector("#satzbaukastenDeArea .sbk-schwebe")].filter((e) => e && !e.hidden);
    const sichtbar = kand.map((e) => ({ r: e.getBoundingClientRect(), t: e.textContent.replace(/\s+/g, " ").trim() }))
      .find((q) => q.r.top >= -1 && q.r.top < 80 && q.r.bottom > 20);
    return { sichtbar: sichtbar ? { top: sichtbar.r.top, bottom: sichtbar.r.bottom } : null, gleich: sichtbar ? sichtbar.t === k.textContent.replace(/\s+/g, " ").trim() : false, h: innerHeight, sy: scrollY };
  });
  sage(klebt && klebt.sichtbar && klebt.gleich && klebt.sichtbar.bottom < klebt.h * 0.4, "beim Bauen bleibt der Satz oben sichtbar, während man weiter unten wählt", JSON.stringify(klebt));
  /* Zufallssätze: sinnvoll (kein gewürfelter Unsinn) */
  const zufall = await pg.evaluate(async () => {
    const out = [];
    for (let i = 0; i < 40; i++) {
      document.getElementById("sbkZufallBtn").click();
      out.push(document.querySelector("#satzbaukastenDeArea .baustein-satz").textContent.replace(/\s+/g, " ").trim());
    }
    return out;
  });
  const kaputt = zufall.filter((s) => / [.,?!]$| ,|^[a-zäöü]/.test(s) || /weil es nötig ist|mit unserem Mann|morgen früh zu Hause/.test(s));
  sage(zufall.length === 40 && !kaputt.length, "40 Zufallssätze, alle groß begonnen, richtig gesetzt, ohne die alten Unsinnsmuster", kaputt.slice(0, 2).join(" | ") || zufall.slice(0, 3).join(" · "));

  await pg.evaluate(() => { window.scrollTo(0, 0); document.querySelector('#satzbaukastenDeArea [data-sbk-ansicht="ueben"]').click(); });
  await pg.waitForFunction(() => document.querySelector("#satzbaukastenDeArea .sbk-ueben [data-sbk-karte]"), null, { timeout: 20000 });
  if (BILD) await (await pg.$("#satzbaukastenDeArea .sbk-ueben")).screenshot({ path: BILD + "-satz-legen-1.png" });

  /* Die richtige Reihenfolge holen: „Lösung zeigen“, merken, zurücklegen. */
  const tippe = async (sel) => { const el = await pg.$(sel); await el.scrollIntoViewIfNeeded(); await el.tap(); await tick(120); };
  await tippe("#sbkUebLoesung");
  const loesung = await pg.evaluate(() => [...document.querySelectorAll('#satzbaukastenDeArea [data-sbk-wo="gelegt"]')].map((b) => b.dataset.sbkKarte));
  const loesungText = await pg.evaluate(() => document.querySelector("#satzbaukastenDeArea .sbk-vorschau").textContent);
  sage(loesung.length >= 3 && /^[A-ZÄÖÜ]/.test(loesungText) && /[.?…]$/.test(loesungText), "die Lösung beginnt groß und endet mit dem Satzzeichen", loesungText);
  await tippe("#sbkUebZurueck");
  /* Richtig legen — durch Antippen, eins nach dem anderen */
  for (const id of loesung) await tippe('#satzbaukastenDeArea [data-sbk-wo="pool"][data-sbk-karte="' + id + '"]');
  await tippe("#sbkUebPruefen");
  const richtig = await pg.evaluate(() => { const e = document.querySelector("#satzbaukastenDeArea .sbk-ergebnis"); return e ? { gut: e.classList.contains("sbk-ergebnis-gut"), text: e.textContent } : null; });
  sage(richtig && richtig.gut, "der richtig gelegte Satz wird als RICHTIG erkannt", richtig && richtig.text);
  if (BILD) await (await pg.$("#satzbaukastenDeArea .sbk-ueben")).screenshot({ path: BILD + "-satz-legen-richtig.png" });

  /* Neuer Satz, absichtlich falsch: umgekehrte Reihenfolge der Lösung.
     Erst ab vier Satzgliedern ist die Umkehrung sicher falsch — aus
     „Heute kochen wir“ wird umgekehrt „Wir kochen heute“, und das ist
     richtig. Darum so lange einen neuen Satz, bis er vier Glieder hat. */
  let l2 = [];
  for (let versuch = 0; versuch < 12 && l2.length < 4; versuch++) {
    await tippe("#sbkUebNeu");
    await tippe("#sbkUebLoesung");
    l2 = await pg.evaluate(() => [...document.querySelectorAll('#satzbaukastenDeArea [data-sbk-wo="gelegt"]')].map((b) => b.dataset.sbkKarte));
  }
  await tippe("#sbkUebZurueck");
  for (const id of l2.slice().reverse()) await tippe('#satzbaukastenDeArea [data-sbk-wo="pool"][data-sbk-karte="' + id + '"]');
  await tippe("#sbkUebPruefen");
  const falsch = await pg.evaluate(() => { const e = document.querySelector("#satzbaukastenDeArea .sbk-ergebnis"); return e ? { falsch: e.classList.contains("sbk-ergebnis-falsch"), text: e.textContent, rot: document.querySelectorAll("#satzbaukastenDeArea .sbk-karte-falsch").length } : null; });
  sage(falsch && falsch.falsch && falsch.rot > 0 && /Verb|Stelle|Satzende|Ende|weil/.test(falsch.text), "der falsch gelegte Satz wird als FALSCH erkannt, mit Hinweis und markierten Stellen", falsch && falsch.text);
  if (BILD) await (await pg.$("#satzbaukastenDeArea .sbk-ueben")).screenshot({ path: BILD + "-satz-legen-falsch.png" });

  /* Ziehen: ein Kärtchen aus dem Vorrat an die ERSTE Stelle ziehen */
  await tippe("#sbkUebZurueck");
  await tippe('#satzbaukastenDeArea [data-sbk-wo="pool"]');          // eins hinten anlegen
  const zug = await pg.evaluate(() => {
    const pool = document.querySelector('#satzbaukastenDeArea [data-sbk-wo="pool"]');
    const erstes = document.querySelector('#satzbaukastenDeArea [data-sbk-wo="gelegt"]');
    const a = pool.getBoundingClientRect(), z = erstes.getBoundingClientRect();
    return { id: pool.dataset.sbkKarte, von: { x: a.left + a.width / 2, y: a.top + a.height / 2 }, nach: { x: z.left + 4, y: z.top + z.height / 2 } };
  });
  const cdp = await pg.context().newCDPSession(pg);
  const t = (type, p) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x: p.x, y: p.y }] });
  await t("touchStart", zug.von);
  for (let i = 1; i <= 10; i++) { await t("touchMove", { x: zug.von.x + (zug.nach.x - zug.von.x) * i / 10, y: zug.von.y + (zug.nach.y - zug.von.y) * i / 10 }); await tick(25); }
  await t("touchEnd", zug.nach);
  await tick(300);
  const nachZug = await pg.evaluate(() => [...document.querySelectorAll('#satzbaukastenDeArea [data-sbk-wo="gelegt"]')].map((b) => b.dataset.sbkKarte));
  sage(nachZug[0] === zug.id && nachZug.length === 2, "Ziehen mit dem Finger legt das Kärtchen genau an die Stelle (hier: vorn)", JSON.stringify(nachZug) + " / " + zug.id);

  const mass = await pg.evaluate(() => ({
    kleinste: Math.min(...[...document.querySelectorAll("#satzbaukastenDeArea .sbk-ueben button")].filter((b) => b.offsetParent).map((b) => b.getBoundingClientRect().height)),
    breit: document.documentElement.scrollWidth, fenster: innerWidth,
  }));
  sage(mass.kleinste >= 30, "Tippflächen beim Satzlegen ≥ 30 px", mass.kleinste.toFixed(0) + " px");
  sage(mass.breit <= mass.fenster, "keine waagrechte Rollleiste (360 px)", mass.breit + " / " + mass.fenster);
  sage(!pg.fehler.length, "keine Seitenfehler", pg.fehler.slice(0, 2).join(" | "));
  } catch (e) { sage(false, "Satzbaukasten lässt sich bis zum Ende bedienen", String(e.message || e).split("\n")[0]); }

  /* ---------------------------------------------------------------- 4
     FASSUNG 834 — Lehrbuchtafeln. Leitplanke: sachlich wie ein Biologie-
     Schulbuch; die Entstehung des Lebens als Zell-Schema (keine Tafel
     „Geschlechtsverkehr“), die Körpertafeln mit bekleideten Menschen
     (Unterwäsche) und ohne Geschlechtsteile als Wörter zum Antippen. */
  console.log("\n4 · LEHRBUCHTAFELN (Körper, Organe, Muskeln, Entstehung)\n");
  global.window = global; window.DMA_SZENE = {};
  const tafel = (id) => { const f = path.join(WURZEL, "szenen", id + ".js"); if (!fs.existsSync(f)) return null; delete require.cache[f]; require(f); return window.DMA_SZENE[id] || null; };
  const alleIds = (s) => s ? s.teile.flatMap((t) => [t.id, ...(t.unter || []).map((u) => u.id)]) : [];
  const alleKunst = (s) => s ? s.kulisse + s.teile.map((t) => t.kunst + (t.unter || []).map((u) => u.kunst || "").join("")).join("") : "";
  const ent = tafel("entstehung");
  sage(ent && !alleIds(ent).includes("e_verkehr") && ent.teile.length === 9 && alleIds(ent).includes("e_einnistung"), "Entstehung des Lebens: neun Zell-Tafeln (Samenzelle bis Geburt), Einnistung statt Geschlechtsverkehr", ent && ent.teile.map((t) => t.id).join(","));
  sage(ent && ent.teile.every((t) => (t.unter || []).length >= 4), "jede Entstehungstafel hat beschriftete Einzelteile", ent && ent.teile.map((t) => (t.unter || []).length).join(","));
  const tabu = /^(scheide|penis|vulva|hoden|genital|brustwarze|warzenhof|after)$/;
  const kp = tafel("koerper"), kb = tafel("koerperbau");
  sage(kp && kb && !alleIds(kp).concat(alleIds(kb)).some((i) => tabu.test(i)), "Körper und Körperbau: keine Geschlechtsteile als Tippwörter (die Menschen tragen Unterwäsche)", [...alleIds(kp || {}), ...alleIds(kb || {})].filter((i) => tabu.test(i)).join(","));
  const inn = tafel("koerper_innen");
  const organe = ["gehirn", "herz", "lunge", "leber", "magen", "niere", "darm"];
  sage(inn && organe.every((o) => { const t = inn.teile.find((x) => x.id === o); return t && (t.unter || []).length >= 5; }), "die Organe sind Lehrbuchkarten mit beschrifteten Teilen", organe.map((o) => { const t = inn && inn.teile.find((x) => x.id === o); return o + ":" + (t ? (t.unter || []).length : "-"); }).join(" "));
  const mu = tafel("muskeln");
  const reg = fs.readFileSync(path.join(WURZEL, "data-szenen.js"), "utf8");
  sage(mu && mu.teile.length >= 12 && /"id":\s*"muskeln"/.test(reg), "neue Tafel „Die Muskeln“ ist da und eingetragen", mu && mu.teile.length + " Muskeln");
  const artikel = [ent, kp, inn, mu].filter(Boolean).flatMap((s) => s.teile.flatMap((t) => [t, ...(t.unter || [])])).filter((t) => t.de && !/^(der|die|das) /.test(t.de));
  sage(!artikel.length, "jedes Fachwort steht mit Artikel da", artikel.slice(0, 4).map((t) => t.de).join(" | "));
  const kaputteTafeln = [ent, kp, kb, inn, mu].filter((s) => s && /NaN|undefined|Infinity/.test(alleKunst(s)));
  sage(!kaputteTafeln.length, "keine kaputten Zahlen in den Zeichnungen", kaputteTafeln.map((s) => s.id).join(","));

  await br.close(); srv.close();
  console.log("\nFassung 834 (Menschen, Baukasten, Satzbau): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
