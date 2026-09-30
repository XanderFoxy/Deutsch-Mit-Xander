#!/usr/bin/env node
/* =====================================================================
   SONDE — FASSUNG 838: MENSCHEN MIT ALLEN DETAILS, SITZEN HINTER DER
   MÖBELKANTE, WINKEN IM BILDERRÄTSEL, TAFEL „DIE GESCHLECHTSORGANE“
   ---------------------------------------------------------------------
   XANDER (Funk 222, wörtlich): „die Menschen jetzt jegliche Details
   verloren man sieht keine Augen man sieht keine Wimpern man sieht keine
   Augenbrauen man sieht keine Haarstruktur … die Iris die Pupille alles
   soll man deutlich sehen die Nasenlöcher … tippe den Mann im grünen
   T-Shirt an … dann soll er winken … in der Badewanne wenn sie sitzt …
   fixierungspunkt … auf den Wannen Boden … dass man hinter der Sessel
   Linie sitzt und nicht an den Sessel dran geklebt … Quatsch mit dem
   After … der geht nicht gerade nach oben“.

   Geprüft:
   1 GESICHT UND HAAR (figuren/mensch.js im Browser, sechs Altersstufen,
     Blick von vorn und schräg): Iris mit Verlauf und Musterung, Pupille,
     je Auge ≥ 8 Wimpern als einzelne Striche, Brauen aus ≥ 10 Haaren,
     Nasenlöcher, ≥ 30 Haarsträhnen, Stoppeln beim Bart, Falten und
     Altersflecken bei alten Menschen.
   2 GRÖSSE: jede Figur (6 Alter × 2 Geschlechter × alle Haltungen × 3
     Blicke) < 90 KB SVG.
   3 BEKLEIDET: ohne Kleidungsangabe sind Bauch, Leiste und Gesäß in allen
     Altersstufen und Haltungen bedeckt (Bildpunkte sind keine Haut); in
     der Badewanne Badekleidung.
   4 BAUKASTEN (Telefon 360 × 740): Sessel — die Armlehnen werden NACH der
     Figur gezeichnet (Vorderkante), die Figur sitzt im Sessel (nicht
     daneben); Badewanne — das Gesäß liegt auf dem Wannenboden (± 2 cm),
     Wasser und Wannenwand liegen VOR der Figur; die Sitzvarianten
     (seitlich, zurückgelehnt, Bein übergeschlagen, Schneidersitz auf dem
     Sofa, Toilette) werden gezeichnet und im Satz genannt.
   5 SZENEN: im Wohnzimmer liegt das Sitzkissen unter den Sitzenden, die
     Armlehne vor der Mutter; alle Szenenfiguren zeigen Wimpern und Iris.
   6 BILDERRÄTSEL: richtig gelesen → die Person im Bild winkt.
   7 TAFEL: der Mastdarm ist gekrümmt (folgt dem Kreuzbein), der
     Analkanal knickt nach hinten unten ab (anorektaler Winkel), der
     Sigmadarm ist beschriftet.
   Bildschirmfotos: BILD=/pfad/praefix   Anderer Stand: WURZEL=/pfad
   Aufruf: node werkzeug/pruefe-838-menschen-detail.js
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
  const basis = "http://127.0.0.1:" + srv.address().port + "/";
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  /* ---------------------------------------------------------------- 1 */
  console.log("\n1 · GESICHT UND HAAR\n");
  const pg = await br.newPage({ viewport: { width: 900, height: 700 } });
  pg.setDefaultTimeout(180000);
  await pg.setContent("<html><body style='margin:0;background:#fff'></body></html>");
  await pg.addScriptTag({ url: basis + "figuren/mensch.js" });
  const f1 = await pg.evaluate(() => {
    const M = window.DMA_MENSCH;
    const leute = [["saeugling", "w", "kurz"], ["kleinkind", "m", "kurz"], ["kind", "w", "zopf"], ["jugendlich", "m", "kurz"], ["erwachsen", "m", "kurz", "bart_kurz"], ["erwachsen", "w", "lang"], ["alt", "m", "glatze"], ["alt", "w", "dutt"]];
    const zaehl = (svg, teil) => { const m = [...svg.matchAll(new RegExp('data-teil="' + teil + '" d="([^"]*)"', "g"))]; return m.map((x) => (x[1].match(/M/g) || []).length); };
    const out = [];
    leute.forEach(([a, g, fr, bart]) => [0, 30].forEach((b) => {
      const r = M.zeichne({ alter: a, geschlecht: g, frisur: fr, bart, blick: b, id: "d" + a + b, kleidung: { oberteil: { stueck: "tshirt", farbe: "gruen" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } });
      const s = r.svg;
      const irisG = /data-teil="iris"><ellipse[^>]*fill="url\(#([^)]+)\)/.exec(s);
      const irisVerlauf = irisG && new RegExp('<radialGradient id="' + irisG[1] + '"').test(s);
      const irisMuster = (s.match(/data-teil="iris">.*?<\/g>/g) || []).every((x) => (x.match(/M/g) || []).length >= 12);
      out.push({ wer: a + "-" + g + " b" + b, irisVerlauf, irisMuster, iris: (s.match(/data-teil="iris"/g) || []).length,
        pupille: (s.match(/data-teil="pupille"/g) || []).length, wimpern: zaehl(s, "wimpern"), brauen: zaehl(s, "braue"),
        nasenloch: zaehl(s, "nasenloch"), straehnen: [zaehl(s, "straehnen").reduce((x, y) => x + y, 0)], stoppeln: /data-teil="stoppeln"/.test(s) && /<pattern /.test(s),
        falten: a === "alt" ? (s.match(/opacity="\.2[68]"\/>/g) || []).length : -1, bart: !!bart, b });
    }));
    return out;
  });
  const vorn = f1.filter((x) => x.b === 0);
  sage(f1.every((x) => x.iris >= 2 && x.irisVerlauf && x.irisMuster), "Iris mit Verlauf und Musterung (Strahlen) an beiden Augen, alle Alter, vorn und schräg", f1.filter((x) => !(x.iris >= 2 && x.irisVerlauf && x.irisMuster)).map((x) => x.wer).join(","));
  sage(f1.every((x) => x.pupille >= 2), "Pupille in beiden Augen", f1.filter((x) => x.pupille < 2).map((x) => x.wer + ":" + x.pupille).join(","));
  sage(f1.every((x) => x.wimpern.length >= 2 && x.wimpern.every((n) => n >= 8)), "je Auge ≥ 8 Wimpern als einzelne Striche", f1.map((x) => x.wer + ":" + x.wimpern.join("/")).slice(0, 4).join(" "));
  sage(f1.every((x) => x.brauen.length >= 2 && x.brauen.every((n) => n >= 10)), "Augenbrauen aus einzelnen Haaren (≥ 10 je Braue)", f1.map((x) => x.wer + ":" + x.brauen.join("/")).slice(0, 4).join(" "));
  sage(vorn.every((x) => x.nasenloch.length === 1 && x.nasenloch[0] >= 2), "Nasenlöcher (beide, von vorn)", vorn.map((x) => x.wer + ":" + x.nasenloch.join("/")).join(" "));
  sage(vorn.every((x) => x.straehnen.length && x.straehnen[0] >= (x.wer.startsWith("alt-m") ? 8 : (x.wer.startsWith("saeugling") ? 15 : 30))), "Haar aus Strähnen (≥ 30, Säuglingsflaum ≥ 15, Haarkranz ≥ 8)", vorn.map((x) => x.wer + ":" + x.straehnen.join("/")).join(" "));
  sage(f1.filter((x) => x.bart).every((x) => x.stoppeln), "Bartstoppeln als Muster");
  sage(f1.filter((x) => x.falten >= 0).every((x) => x.falten >= 2), "alte Menschen: Altersflecken und Falten", f1.filter((x) => x.falten >= 0).map((x) => x.wer + ":" + x.falten).join(" "));

  /* ---------------------------------------------------------------- 2 */
  console.log("\n2 · GRÖSSE\n");
  const f2 = await pg.evaluate(() => {
    const M = window.DMA_MENSCH;
    let max = 0, wo = "", n = 0;
    ["saeugling", "kleinkind", "kind", "jugendlich", "erwachsen", "alt"].forEach((a) => ["m", "w"].forEach((g) => M.HALTUNGEN.forEach((h) => [0, 35, 90].forEach((b) => {
      const r = M.zeichne({ alter: a, geschlecht: g, pose: h, blick: b, frisur: g === "w" ? "lang" : "kurz", bart: a === "erwachsen" && g === "m" ? "bart_kurz" : "", id: "g", kleidung: { oberteil: { stueck: "hemd", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } });
      n++; if (r.svg.length > max) { max = r.svg.length; wo = a + g + "/" + h + "/" + b; }
    }))));
    return { max: max / 1024, wo, n };
  });
  sage(f2.max < 90, "jede Figur < 90 KB (" + f2.n + " Figuren)", "größte " + f2.max.toFixed(1) + " KB bei " + f2.wo);

  /* ---------------------------------------------------------------- 3 */
  console.log("\n3 · IMMER BEKLEIDET\n");
  const f3 = await pg.evaluate(async () => {
    const M = window.DMA_MENSCH;
    const haut = M.HAUT.hell;
    const hx = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const H = hx(haut);
    const c = document.createElement("canvas"); c.width = 300; c.height = 300;
    const ctx = c.getContext("2d");
    const nackt = [];
    let geprueft = 0;
    for (const a of ["saeugling", "kind", "jugendlich", "erwachsen", "alt"]) for (const g of ["m", "w"]) for (const h of ["stehen", "sitzen", "schneidersitz", "liegen", "baden", "krabbeln", "sitzen_zurueck"]) {
      const r = M.zeichne({ alter: a, geschlecht: g, pose: h, blick: 20, haut: "hell", id: "k", kleidung: {}, ohneSchatten: true });
      const b = r.box, w = b.x1 - b.x0 + 4, hh = b.y1 - b.y0 + 4, sk = Math.min(280 / w, 280 / hh);
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="' + (b.x0 - 2) + " " + (b.y0 - 2) + " " + (300 / sk) + " " + (300 / sk) + '">' + r.svg + "</svg>";
      const img = new Image();
      await new Promise((res) => { img.onload = res; img.onerror = res; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); });
      ctx.clearRect(0, 0, 300, 300); ctx.drawImage(img, 0, 0);
      ["bauch", "leiste"].forEach((n) => {
        const p = r.punkte[n]; if (!p) return;
        const x = Math.round((p[0] - b.x0 + 2) * sk), y = Math.round((p[1] - b.y0 + 2) * sk);
        const d = ctx.getImageData(x, y, 1, 1).data;
        if (d[3] < 200) return;
        geprueft++;
        const ab = Math.hypot(d[0] - H[0], d[1] - H[1], d[2] - H[2]);
        if (ab < 38) nackt.push(a + g + "/" + h + "/" + n + " (" + ab.toFixed(0) + ")");
      });
    }
    return { nackt, geprueft };
  });
  sage(!f3.nackt.length && f3.geprueft > 60, "ohne Kleidungsangabe: Bauch und Leiste bedeckt (" + f3.geprueft + " Stellen)", f3.nackt.slice(0, 4).join(" | "));
  await pg.close();

  /* ---------------------------------------------------------------- 4 */
  console.log("\n4 · BAUKASTEN: SITZEN HINTER DER VORDERKANTE, BADEWANNE\n");
  let pb;
  try {
    pb = await br.newPage({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
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
    const setze = (pid, h) => pb.evaluate(async ([pid, h]) => {
      const d = document.getElementById("__bk"), Z = Baukasten.zustand;
      const p = window.DMA_PLAETZE.find((x) => x.id === pid);
      Z.szene = p.szene; Z.platz = null; await Baukasten.render(d);
      Z.platz = p; Z.haltung = h; await Baukasten.render(d);
      await new Promise((r) => setTimeout(r, 250));
      const svg = d.querySelector(".bk-svg");
      const kinder = [...svg.children];
      const iFig = kinder.findIndex((e) => e.matches("[data-bk-figur]"));
      const iVorn = kinder.findIndex((e) => e.matches(".bk-vorderkante"));
      const fig = bkFigurSvg(Z, 0);
      const a = bkFigurAnker(fig, Z.platz, Z.haltung);
      const sz = window.DMA_SZENE[p.szene];
      const sessel = sz.teile.find((t) => t.id === p.teil);
      return { iFig, iVorn, vorneHat: iVorn >= 0 ? kinder[iVorn].innerHTML.length : 0, wasser: !!svg.querySelector('.bk-vorderkante [data-bk-vorne="wasser"]'), wand: !!svg.querySelector('.bk-vorderkante [data-bk-vorne="wannenwand"]'),
        gesaess: a.y + fig.sitz, bodenY: p.bodenY, cm: 1 / bkMassstab(p.szene), sitzX: a.x + fig.sitzX, platzX: p.x, moebelX: sessel && sessel.x,
        satz: d.querySelector(".bk-satz-text") ? d.querySelector(".bk-satz-text").textContent : "", kleider: Object.keys(Z.kleidung).map((k) => Z.kleidung[k] && Z.kleidung[k].stueck), figur: !!svg.querySelector("[data-bk-figur] .mensch"),
        mutter: sz.teile.some((t) => t.id === "mutter") && !(p.verdeckt || []).includes("mutter") };
    }, [pid, h]);
    const se = await setze("wohnzimmer-sessel", "sitzen");
    sage(se.iVorn > se.iFig && se.vorneHat > 300, "Sessel: Armlehnen werden NACH der Figur gezeichnet (Möbel-Vorderkante vor dem Körper)", "Figur #" + se.iFig + ", Vorderkante #" + se.iVorn);
    sage(Math.abs(se.sitzX - se.moebelX) < 4 && !se.mutter, "Sessel: die Figur sitzt IM Sessel (Mitte ± 4), die gemalte Mutter tritt zur Seite", "Gesäß x " + se.sitzX.toFixed(1) + ", Sessel x " + se.moebelX);
    if (BILD) await (await pb.$("#__bk .bk-buehne")).screenshot({ path: BILD + "-sessel.png" });
    const ba = await setze("badezimmer-badewanne", "liegen");
    const abCm = Math.abs(ba.gesaess - ba.bodenY) * ba.cm;
    sage(abCm <= 2, "Badewanne: Gesäß auf dem Wannenboden (± 2 cm)", abCm.toFixed(1) + " cm");
    sage(ba.iVorn > ba.iFig && ba.wasser && ba.wand, "Badewanne: Wasser (durchsichtig) und Wannenwand liegen VOR der Figur", "Figur #" + ba.iFig + ", davor #" + ba.iVorn);
    if (BILD) await (await pb.$("#__bk .bk-buehne")).screenshot({ path: BILD + "-badewanne.png" });
    /* Badekleidung: wie ein Nutzer — den Platz antippen */
    await pb.evaluate(() => document.querySelector('#__bk [data-bk-platz="badezimmer-badewanne"]').dispatchEvent(new MouseEvent("click", { bubbles: true })));
    await tick(700);
    await pb.waitForFunction(() => !Baukasten.bewegt(), null, { timeout: 20000 }).catch(() => {});
    const bk = await pb.evaluate(() => Object.keys(Baukasten.zustand.kleidung).map((k) => Baukasten.zustand.kleidung[k] && Baukasten.zustand.kleidung[k].stueck));
    sage(bk.some((k) => /badeanzug|badehose|badeshirt/.test(k)), "in der Badewanne Badekleidung", bk.join(","));
    const varianten = [["wohnzimmer-sessel", "sitzen_seit", "seitlich"], ["wohnzimmer-sessel", "sitzen_zurueck", "zurückgelehnt"], ["wohnzimmer-sessel", "sitzen_ueberkreuz", "übereinandergeschlagenen"],
      ["wohnzimmer-sofa", "schneidersitz", "Schneidersitz"], ["badezimmer-toilette", "sitzen", "Toilette"]];
    const schlecht = [];
    for (const [pid, h, wort] of varianten) {
      const v = await setze(pid, h);
      if (!v.figur || v.satz.indexOf(wort) < 0) schlecht.push(h + "@" + pid + ": " + v.satz);
      if (BILD && h !== "sitzen") await (await pb.$("#__bk .bk-buehne")).screenshot({ path: BILD + "-" + h + ".png" });
    }
    sage(!schlecht.length, "Sitzvarianten: seitlich, zurückgelehnt, Bein übergeschlagen, Schneidersitz auf dem Sofa, Toilette", schlecht.join(" | "));
    const knopf = await pb.evaluate(() => ({ nichts: [...document.querySelectorAll("#__bk [data-wert]")].some((b) => /^(nichts|nackt)$/.test(b.dataset.wert)) }));
    sage(!knopf.nichts, "keine Wahl „nichts an“ im Baukasten");
    sage(!pf.length, "keine Seitenfehler im Baukasten", pf.slice(0, 2).join(" | "));
  } catch (e) { sage(false, "Baukasten-Teil lief durch", String(e.message || e).split("\n")[0]); }

  /* ---------------------------------------------------------------- 5 */
  console.log("\n5 · SZENEN\n");
  global.window = global; window.DMA_SZENE = {};
  const szene = (id) => { const f = path.join(WURZEL, "szenen", id + ".js"); if (!fs.existsSync(f)) return null; delete require.cache[f]; require(f); return window.DMA_SZENE[id] || null; };
  const wz = szene("wohnzimmer");
  const idx = (id) => wz.teile.findIndex((t) => t.id === id);
  sage(idx("sitzkissen") < idx("vater") && idx("sitzkissen") < idx("tochter"), "Wohnzimmer: das Sitzkissen liegt UNTER Vater und Tochter (vor ihnen gezeichnet)", "Kissen #" + idx("sitzkissen") + ", Vater #" + idx("vater"));
  const lehne = wz.teile[idx("armlehne")];
  sage(idx("armlehne") > idx("mutter") && lehne && (lehne.kunst.match(/<rect /g) || []).length >= 2 && !/width="34\.0/.test(lehne.kunst), "Wohnzimmer: die Armlehnen (zwei Seitenpolster) liegen VOR der Mutter, kein Balken quer über dem Schoß", "Lehne #" + idx("armlehne") + ", Mutter #" + idx("mutter"));
  const SZ = ["badezimmer", "schlafzimmer", "kueche", "wohnzimmer", "kinderzimmer", "klassenzimmer", "restaurant", "supermarkt", "strasse", "bahnhof", "arztpraxis", "flur", "cafe", "bibliothek", "bewerbungsgespraech"];
  const ohne = SZ.filter((id) => { const s = szene(id); const t = JSON.stringify(s || ""); return !/data-teil=\\"wimpern\\"/.test(t) || !/data-teil=\\"iris\\"/.test(t); });
  sage(!ohne.length, "alle 15 Szenen zeigen die neuen, detaillierten Menschen (Wimpern, Iris)", ohne.join(","));

  /* ---------------------------------------------------------------- 6 */
  console.log("\n6 · BILDERRÄTSEL: RICHTIG → DIE PERSON WINKT\n");
  try {
    const pr = await br.newPage({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
    pr.setDefaultTimeout(120000);
    await pr.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); localStorage.setItem("dma_tutor", "aus"); } catch (e) {} });
    await pr.goto(basis + "index.html", { waitUntil: "domcontentloaded" });
    await pr.waitForFunction(() => window.DMA_PRUEF && document.querySelector('#learnSubnav [data-sub="sub-bilderraetsel"]'), null, { timeout: 120000 });
    await pr.evaluate(() => document.querySelector('#learnSubnav [data-sub="sub-bilderraetsel"]').click());
    let erg = null;
    for (let versuch = 0; versuch < 20 && !erg; versuch++) {
      await pr.waitForFunction(() => document.querySelector("#bilderraetselArea [data-br-satz]") && document.querySelector("#bilderraetselArea .br-svg"), null, { timeout: 60000 });
      await pr.evaluate(() => document.querySelector("#bilderraetselArea [data-br-satz]").click());
      await tick(120);
      const r = await pr.evaluate(async () => {
        const ok = !!document.querySelector("#bilderraetselArea .bw-ok");
        const g = document.querySelector("#bilderraetselArea .br-figur") || [...document.querySelectorAll("#bilderraetselArea .br-svg > g")].pop();
        if (!ok) return { ok };
        const a = g ? g.innerHTML : "";
        const winkt = g && g.getAttribute("data-winkt") === "1";
        await new Promise((res) => setTimeout(res, 300));
        const b = g ? g.innerHTML : "";
        return { ok, winkt, bewegt: a !== b && a.length > 0 };
      });
      if (r.ok) erg = r;
      else {
        await tick(100);
        await pr.evaluate(() => document.getElementById("brUeberspringen") && document.getElementById("brUeberspringen").click());
        await tick(300);
      }
    }
    sage(erg && erg.winkt && erg.bewegt, "richtiger Satz → die Figur im Bild winkt (Arm bewegt sich)", JSON.stringify(erg));
    await pr.close();
  } catch (e) { sage(false, "Bilderrätsel-Teil lief durch", String(e.message || e).split("\n")[0]); }

  /* ---------------------------------------------------------------- 7 */
  console.log("\n7 · TAFEL „DIE GESCHLECHTSORGANE“\n");
  const go = szene("geschlechtsorgane");
  const alle = go ? go.teile.map((t) => t.kunst).join("") : "";
  const md = /data-teil="mastdarm"><path d="([^"]+)"/.exec(alle), ak = /data-teil="analkanal"><path d="([^"]+)"/.exec(alle);
  const punkte = (d) => { const z = (d.match(/-?\d+\.?\d*/g) || []).map(Number); const p = [[z[0], z[1]]]; for (let i = 2; i + 5 < z.length + 1; i += 6) p.push([z[i + 4], z[i + 5]]); return p.filter((q) => q.every(Number.isFinite)); };
  let krumm = 0, winkel = 180;
  if (md && ak) {
    const p = punkte(md[1]), q = punkte(ak[1]);
    const a = p[0], b = p[p.length - 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    p.forEach((m) => { krumm = Math.max(krumm, Math.abs((b[0] - a[0]) * (a[1] - m[1]) - (a[0] - m[0]) * (b[1] - a[1])) / l / l); });
    const v1 = [p[p.length - 1][0] - p[p.length - 2][0], p[p.length - 1][1] - p[p.length - 2][1]], v2 = [q[q.length - 1][0] - q[0][0], q[q.length - 1][1] - q[0][1]];
    const zw = Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / Math.hypot(...v1) / Math.hypot(...v2)) * 180 / Math.PI;
    winkel = 180 - zw;   // Innenwinkel zwischen Ampulle und Analkanal
    sage(v2[0] > 0 && v2[1] > 0, "der Analkanal zieht nach hinten unten (vorn = links)", "Richtung " + v2.map((x) => x.toFixed(1)).join(","));
  }
  sage(krumm > 0.12, "der Mastdarm ist gekrümmt wie das Kreuzbein (nicht gerade)", "Durchbiegung " + (krumm * 100).toFixed(0) + " % der Sehne");
  sage(winkel > 80 && winkel < 135, "anorektaler Winkel zwischen Ampulle und Analkanal 80–135°", winkel.toFixed(0) + "°");
  const worte = go ? go.teile.flatMap((t) => t.unter || []).map((u) => u.de) : [];
  sage(worte.filter((w) => w === "der Sigmadarm").length === 2, "der Sigmadarm ist bei Mann und Frau beschriftet");
  sage(go && !/class="mensch"/.test(alle), "nur Schema, keine Figuren auf der Tafel");
  if (BILD) {
    const pt = await br.newPage({ viewport: { width: 900, height: 600 } });
    await pt.setContent("<html><body style='margin:0'><svg viewBox='0 0 " + go.breite + " " + go.hoehe + "' width='880'>" + go.kulisse + go.teile.map((t) => '<g transform="translate(' + t.x + "," + t.y + ')">' + t.kunst + "</g>").join("") + "</svg></body></html>");
    await pt.screenshot({ path: BILD + "-tafel.png" });
    await pt.close();
  }

  await br.close(); srv.close();
  console.log("\nFassung 838 (Menschen mit Details, Sitzen, Winken, Tafel): " + (fehler ? fehler + " rot." : "alles grün."));
  process.exit(fehler ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
