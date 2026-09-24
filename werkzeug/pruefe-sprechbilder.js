#!/usr/bin/env node
/* =========================================================
   DIE SPRECHBILDER — SECHZEHN STUECK, JEDES ANDERS
   ---------------------------------------------------------
   GEWUENSCHT: „Ich brauche noch mehr fantastische
   Profilbildrahmen, wenn man spricht … Der Regenbogen muss
   viel bunter, dafuer klarer und farbiger werden … viele
   kleine Sternchen funkeln in verschiedenen Staerken, die
   das Profilbild umgeben … und dann vielleicht noch eins,
   wo Noten rauskommen."

   Gemessen wird:
   1. Alle elf stehen zur Auswahl.
   2. Der Regenbogen ist WIRKLICH mehrfarbig — geprueft am
      gerechneten Hintergrund: ein Farbkreis mit mehreren
      Farben, nicht eine Farbe, die wandert.
   3. Die sechs neuen bauen echte Teilchen, und die Teilchen
      haben VERSCHIEDENE Groessen und Helligkeiten („in
      verschiedenen Staerken").
   4. Nichts davon ragt aus dem Platz heraus.
   5. Hoert das Sprechen auf, ist das Feld wieder weg.
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

/* FUNK 75: die alten Sprechbilder sind wieder da (Teilchen), die
   neuen Fassungen heissen „… 2". Der alte Strom ist „strom2". */
const TEILCHEN = ["magie", "noten", "herzen", "feuer", "strom2", "blasen"];

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
  const pg = await br.newPage({ viewport: { width: 420, height: 760 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.sprechbilder, { timeout: 20000 });

  console.log("\nWAS STEHT ZUR AUSWAHL?\n");
  const liste = await pg.evaluate(() => Object.keys(window.LiveChat.sprechbilder()));
  /* GEWACHSEN, auf Ansage: „Vielleicht kannst du noch was mit Eis
     machen, dass das Bild gefriert, wenn ich spreche" und „als
     Sprech-Effekt waeren noch Blumenblaetter, als wenn der
     Profilrahmen eine Blume waere und die blueht, wenn man spricht."
     Aus elf sind damit dreizehn geworden — und mit Fassung 357
     vierzehn: „die Störung ist kein Effekt um das Profilbild zu
     beeinflussen durch einen Klick sondern es ist ein Sprechbild-
     Effekt." Geprueft wird weiter, dass „aus" dabei ist und keines
     verloren geht. */
  /* Und mit Fassung 358 sechzehn: „so Blut, was über das Profil
     läuft, oder Spinnweben. Du musst gucken, ob das als
     Sprecheffekt passt" — nachgesehen, es passt: beides ist ein
     Zustand, kein Wurf. */
  /* SCHON-PASS 7: Strom in drei Arten (Plasmalampe, Kugel, Mantel) —
     zwei mehr. */
  /* SCHON-PASS 11–15: Kranz, Kugel, Hasen-, Baerenohren, Maul, Schemen */
  pruefe("es sind 35 Sprechbilder plus „aus“ (16 alte, 11 zweite Fassungen, 8 neue)", liste.length === 36,
    liste.length + ": " + liste.join(", "));
  ["eis", "bluete", "stoerung", "blut", "spinnweb"].forEach((n) => pruefe("„" + n + "“ ist neu dabei", liste.indexOf(n) >= 0));
  TEILCHEN.forEach((t) => pruefe("„" + t + "“ steht dabei", liste.indexOf(t) >= 0));

  /* Eine Buehne mit einem sprechenden Platz bauen. */
  await pg.evaluate(() => {
    document.getElementById("lcPruefBuehne")?.remove();
    const b = document.createElement("div");
    b.id = "lcPruefBuehne";
    b.innerHTML = '<div class="question-card livechat" id="livechatKarte">'
      + '<div class="lc-plaetze" id="lcPlaetze">'
      + '<button class="lc-platz lc-platz-belegt lc-platz-spricht" data-lc-platz="1">'
      + '<span class="lc-kreis"></span><span class="lc-platz-name">Emmi</span></button>'
      + "</div></div>";
    document.body.appendChild(b);
  });

  console.log("\nIST DER REGENBOGEN WIRKLICH BUNT?\n");
  /* SCHON-PASS 9: der Regenbogen ist eine Lage im Sprechfeld —
     „2–3 weiche Farbbänder … Farben laufen ineinander … sehr langsam
     driftend". */
  const bogen = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    knopf.dataset.sprechbild = "regenbogen";
    const kreis = knopf.querySelector(".lc-kreis");
    const vor = getComputedStyle(kreis, "::before");
    const nach = getComputedStyle(kreis, "::after");
    const zaehle = (t) => (String(t).match(/rgb/g) || []).length;
    return {
      vorBild: vor.backgroundImage.slice(0, 40),
      farbenVor: zaehle(vor.backgroundImage),
      farbenNach: zaehle(nach.backgroundImage),
      schein: nach.filter
    };
  });
  pruefe("der Ring ist ein Farbkreis, kein einzelner Farbton",
    /conic-gradient/.test(bogen.vorBild), bogen.vorBild);
  pruefe("er zeigt viele Farben GLEICHZEITIG", bogen.farbenVor >= 8,
    bogen.farbenVor + " Farben im Ring");
  pruefe("und strahlt weich nach aussen", /blur/.test(bogen.schein || ""),
    bogen.schein || "kein Schein");

  console.log("\nREGENBOGEN 2 (SCHON-PASS 9)\n");
  const bogen2 = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    knopf.dataset.sprechbild = "regenbogen2";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "regenbogen2");
    const lage = knopf.querySelector(".lc-sregenbogen2 .lc-rb-lage");
    if (!lage) return null;
    const cs = getComputedStyle(lage);
    const baender = ((cs.maskImage || cs.webkitMaskImage || "").match(/rgb\(0, 0, 0\)|rgba\(0, 0, 0, 1\)/g) || []).length;
    return { bild: cs.backgroundImage.slice(0, 40), farben: (cs.backgroundImage.match(/rgb/g) || []).length,
      schein: cs.filter, dauer: parseFloat(cs.animationDuration), lagen: knopf.querySelectorAll(".lc-rb-lage").length };
  });
  pruefe("Regenbogen 2: der Ring ist ein Farbkreis", bogen2 && /conic-gradient/.test(bogen2.bild), bogen2 ? bogen2.bild : "fehlt");
  pruefe("Regenbogen 2: viele Farben, die ineinanderlaufen", bogen2 && bogen2.farben >= 8, bogen2 ? bogen2.farben + " Farben" : "");
  pruefe("Regenbogen 2: weich (unscharf), nicht hart", bogen2 && /blur/.test(bogen2.schein), bogen2 ? bogen2.schein : "");
  pruefe("Regenbogen 2: sehr langsam driftend (mind. 60 s je Umlauf)", bogen2 && bogen2.dauer >= 60, bogen2 ? bogen2.dauer + " s" : "");

  console.log("\nDIE TEILCHEN\n");
  for (const art of TEILCHEN) {
    const d = await pg.evaluate((a) => {
      const knopf = document.querySelector(".lc-platz");
      knopf.dataset.sprechbild = a;
      window.DMA_PRUEFUNG.sprechFeld(knopf, a);
      const feld = knopf.querySelector(".lc-sprechfeld");
      if (!feld) return { da: false };
      const teile = [...feld.querySelectorAll(".lc-teilchen")];
      const gross = new Set(teile.map((t) => t.style.getPropertyValue("--gross")));
      const hell = new Set(teile.map((t) => t.style.getPropertyValue("--hell")));
      const takt = new Set(teile.map((t) => t.style.animationDuration));
      const kreis = knopf.querySelector(".lc-kreis").getBoundingClientRect();
      const fr = feld.getBoundingClientRect();
      const laeuft = teile.filter((t) => getComputedStyle(t).animationName !== "none").length;
      return { da: true, menge: teile.length, gross: gross.size, hell: hell.size,
        takt: takt.size, laeuft: laeuft,
        ueber: Math.round(fr.width - kreis.width) };
    }, art);
    pruefe(art + " baut Teilchen", d.da && d.menge >= 8, d.da ? d.menge + " Stueck" : "keins");
    pruefe(art + " — jedes mit eigener Staerke und eigenem Takt",
      d.gross >= 5 && d.hell >= 5 && d.takt >= 5,
      "Groessen " + d.gross + ", Helligkeiten " + d.hell + ", Takte " + d.takt);
    pruefe(art + " — alle Teilchen bewegen sich", d.laeuft === d.menge,
      d.laeuft + " von " + d.menge);
    pruefe(art + " bleibt beim Profilbild", d.ueber <= 40,
      d.ueber + " px groesser als das Bild");
  }

  console.log("\nSCHON-PASS 2 — DAS FEUER NACH XANDERS LISTE\n");
  const fe = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    knopf.dataset.sprechbild = "feuer2";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "feuer2");
    const feld = knopf.querySelector(".lc-sprechfeld");
    const svg = feld && feld.querySelector("svg.lc-feuer-bild");
    if (!svg) return { da: false };
    const zungen = [...svg.querySelectorAll("g[transform]")];
    /* „Basis klebt": in allen Formen einer Zunge sind die ersten
       Punkte (der Fuss) gleich — nur die Spitze bewegt sich. */
    let fussFest = 0, spitzeLebt = 0;
    zungen.forEach((g) => {
      const an = g.querySelector("path > animate");
      const formen = an.getAttribute("values").split(";").map((v) => v.trim().split(/[ MCZ]+/).filter(Boolean));
      const fuss = formen.map((z) => z.slice(0, 4).join(",") + "|" + z.slice(10).join(","));
      if (new Set(fuss).size === 1) fussFest++;
      if (new Set(formen.map((z) => z[6] + "," + z[7])).size > 1) spitzeLebt++;
    });
    const glow = svg.querySelector("circle[stroke-dasharray]");
    const funken = svg.querySelectorAll("circle:not([stroke-dasharray])").length;
    const kreis = knopf.querySelector(".lc-kreis").getBoundingClientRect();
    const fr = feld.getBoundingClientRect();
    return { da: true, zungen: zungen.length, fussFest, spitzeLebt, luecken: glow ? glow.getAttribute("stroke-dasharray").split(" ").length : 0,
      funken, teilchen: feld.querySelectorAll(".lc-teilchen").length, ueber: Math.round(fr.width - kreis.width),
      innen: zungen.filter((g) => g.querySelectorAll("path").length === 2).length };
  });
  pruefe("das Feuer ist EIN Bild, keine 30 Aufkleber", fe.da && fe.teilchen === 0, fe.da ? fe.teilchen + " Teilchen" : "kein Bild");
  /* Die Liste sagte 8–12; XANDER danach im Walkie: „Mehr Zungen. Die
     Flammen sollen lückenfüllend sein." Jetzt zwei Lagen. */
  pruefe("mehr Zungen, lueckenfuellend (zwei Lagen, mind. 24)", fe.zungen >= 24, fe.zungen);
  pruefe("jede Zunge hat eine hellere Innenzacke", fe.innen === fe.zungen, fe.innen + " von " + fe.zungen);
  pruefe("die Basis klebt — nur die Spitze bewegt sich", fe.fussFest === fe.zungen && fe.spitzeLebt === fe.zungen,
    "Fuss fest " + fe.fussFest + ", Spitze lebt " + fe.spitzeLebt);
  pruefe("der Glow hat Luecken, kein zweiter Vollkreis", fe.luecken >= 8, fe.luecken + " Striche/Luecken");
  pruefe("Funken: 10 bis 13", fe.funken >= 10 && fe.funken <= 13, fe.funken);
  pruefe("Feuer bleibt beim Profilbild", fe.ueber <= 40, fe.ueber + " px groesser als das Bild");

  console.log("\nSCHON-PASS 3 — DIE WELLE OHNE LUECKE\n");
  const we = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    knopf.dataset.sprechbild = "welle2";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "welle2");
    const svg = knopf.querySelector(".lc-sprechfeld svg.lc-welle-bild");
    if (!svg) return { da: false };
    const k = [...svg.querySelectorAll("circle")];
    const saum = k[0];
    const r = parseFloat(saum.getAttribute("r")), b = parseFloat(saum.getAttribute("stroke-width"));
    const ringe = k.slice(1).map((c) => c.querySelector('animate[attributeName="r"]').getAttribute("values").split(";").map(parseFloat));
    const deck = saum.querySelector("animate").getAttribute("values").split(";").map(parseFloat);
    return { da: true, innen: r - b / 2, breite: b / 69.4 * 100, deckMin: Math.min(...deck), deckMax: Math.max(...deck),
      ringe: ringe.length, lauf: ringe.map((v) => (v[1] - v[0]) / 69.4 * 100), abSaum: ringe.every((v) => Math.abs(v[0] - r) < 0.01) };
  });
  pruefe("Welle ist ein Bild mit festem Saum", we.da, we.da ? "ja" : "fehlt");
  pruefe("der Saum beginnt am Ring — kein Spalt zum Bild", we.innen <= 34.7, "Innenkante " + (we.innen || 0).toFixed(2) + " (Ring 34,7)");
  pruefe("Saum 4–7 % breit", we.breite >= 4 && we.breite <= 7, (we.breite || 0).toFixed(1) + " %");
  pruefe("Saum 20–35 % Deckkraft und nie aus", we.deckMin >= 0.2 && we.deckMax <= 0.35, we.deckMin + " bis " + we.deckMax);
  pruefe("2–3 Ringe loesen sich vom Saum", we.ringe >= 2 && we.ringe <= 3 && we.abSaum, we.ringe + " Ringe");
  /* Liste: 8–14 %; XANDER danach (Walkie #148): „Ringe weiter nach
     außen" — jetzt 15 %. */
  pruefe("sie laufen weit nach aussen (14–18 %)", we.lauf && we.lauf.every((x) => x >= 14 && x <= 18), (we.lauf || []).map((x) => x.toFixed(1)).join(", "));

  console.log("\nSCHON-PASS 4 — BLUT\n");
  const bl = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    knopf.dataset.sprechbild = "blut2";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "blut2");
    const svg = knopf.querySelector(".lc-sprechfeld svg.lc-blut-bild");
    if (!svg) return { da: false };
    const maske = svg.querySelector("clipPath circle");
    const innen = svg.querySelector("g[clip-path]");
    const rinnsale = innen ? innen.querySelectorAll('path[stroke-dasharray][stroke="#7F1D1D"]').length : 0;
    /* die Mitte bleibt frei: kein Rinnsal naeher als 12 an der Mittellinie */
    const xs = [...innen.querySelectorAll('path[stroke-dasharray][stroke="#7F1D1D"]')].map((p) => parseFloat(p.getAttribute("d").slice(1)));
    const farben = svg.innerHTML;
    const tropfen = [...svg.querySelectorAll(":scope > ellipse")];
    const fall = tropfen.map((t) => { const v = t.querySelector('animate[attributeName="cy"]').getAttribute("values").split(";").map(parseFloat); return v[3] - v[0]; });
    const takt = tropfen.map((t) => parseFloat(t.querySelector("animate").getAttribute("dur")));
    return { da: true, maske: !!maske, rinnsale, mitteFrei: xs.every((x) => Math.abs(x - 50) >= 12),
      kern: /#450A0A/i.test(farben) && /#7F1D1D/i.test(farben), tropfen: tropfen.length, fall, abstand: takt[0] / tropfen.length };
  });
  pruefe("Blut ist ein Bild hinter einer Kreismaske", bl.da && bl.maske, bl.da ? "ja" : "fehlt");
  pruefe("es laeuft links und rechts der Stirn, die Mitte bleibt frei", bl.rinnsale >= 2 && bl.mitteFrei, bl.rinnsale + " Rinnsale");
  pruefe("dunkler Kern #7F1D1D / #450A0A", bl.kern, "");
  pruefe("alle 1–2 s ein Tropfen", bl.abstand >= 1 && bl.abstand <= 2, (bl.abstand || 0) + " s");
  /* Platzhoehe im Feld: Bild 69,4 + Name ~ 83 → 20–40 % = 16,6 bis 33,2 */
  pruefe("er faellt 20–40 % der Platzhoehe", bl.fall && bl.fall.every((x) => x >= 16.6 && x <= 33.2), (bl.fall || []).map((x) => x.toFixed(1)).join(", "));

  console.log("\nSCHON-PASS 5 — EIS\n");
  const ei = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    knopf.dataset.sprechbild = "eis2";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "eis2");
    const svg = knopf.querySelector(".lc-sprechfeld svg.lc-eis-bild");
    if (!svg) return { da: false };
    const zapfen = [...svg.querySelectorAll('path[fill^="url(#lcEz"]')];
    const tiefste = Math.max(...zapfen.map((z) => { const zahlen = z.getAttribute("d").match(/-?\d+\.?\d*/g).map(Number); return Math.max(...zahlen.filter((v, i) => i % 2 === 1)); }));
    /* RUNDE 101 — die Eisblumen sind jetzt Farne (Walkie #156
       „ueberarbeiten"): sie liegen unter einer Maske, die den Frost vom
       Rand nach innen wachsen laesst, und jeder Farn blendet als Gruppe
       ein. Gemessen wird deshalb in der Maskengruppe. */
    const adern = [...svg.querySelectorAll("g[mask] path")];
    const deck = adern.map((p) => parseFloat(p.getAttribute("stroke-opacity")));
    const dick = adern.map((p) => parseFloat(p.getAttribute("stroke-width")));
    const starts = new Set([...svg.querySelectorAll("g[mask] > g > animate")].map((a) => a.getAttribute("begin")));
    return { da: true, zapfen: zapfen.length, tiefste, adern: adern.length, deckMax: Math.max(...deck), deckMin: Math.min(...deck),
      dickMax: Math.max(...dick), starts: starts.size, sticker: knopf.querySelectorAll(".lc-teilchen").length };
  });
  pruefe("Eis ist ein Bild, kein Sticker", ei.da && ei.sticker === 0, ei.da ? "ja" : "fehlt");
  pruefe("Zapfen wachsen aus der Ringlinie", ei.zapfen >= 6, ei.zapfen + " Zapfen");
  pruefe("kein Zapfen haengt ueber den Namen (y < 88)", ei.tiefste < 88, "tiefste Spitze " + (ei.tiefste || 0).toFixed(1));
  pruefe("Eisblumen haardünn", ei.dickMax <= 0.45, "dickste Ader " + ei.dickMax);
  pruefe("Hauptadern 20–45 % Deckkraft, Aestchen blasser", ei.deckMax <= 0.45 && ei.deckMin > 0.05, ei.deckMin + " bis " + ei.deckMax);
  pruefe("sie kommen nacheinander, nicht alle auf einmal", ei.starts >= 8, ei.starts + " verschiedene Startzeiten");

  console.log("\nSCHON-PASS 6 — BLUETE\n");
  await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    knopf.dataset.sprechbild = "bluete2";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "bluete2");
  });
  const groesse = () => pg.evaluate(() => [...document.querySelectorAll(".lc-sbluete2 .lc-bl-blatt")].map((g) => {
    const l = g.transform.animVal; let a = 1; for (let i = 0; i < l.numberOfItems; i++) { const t = l.getItem(i); if (t.type === 3) a *= t.matrix.a; }
    return Math.round(a * 100) / 100; }));
  await pg.waitForTimeout(450);
  const frueh = await groesse();
  await pg.waitForTimeout(1700);
  const offen = await groesse();
  const formen = await pg.evaluate(() => new Set([...document.querySelectorAll(".lc-sbluete2 .lc-bl-blatt > path:first-of-type")].map((p) => p.getAttribute("d"))).size);
  await pg.evaluate(() => window.DMA_PRUEFUNG.blueteZu(document.querySelector(".lc-sbluete2")));
  await pg.waitForTimeout(700);
  const halbZu = await groesse();
  await pg.waitForTimeout(1300);
  const zu = await groesse();
  pruefe("8–12 Blaetter", offen.length >= 8 && offen.length <= 12, offen.length);
  pruefe("jedes Blatt hat seine eigene Form", formen === offen.length, formen + " Formen");
  /* RUNDE 101 — XANDER (Walkie #157): „Gemeinsameres Aufgehen."
     Vorher verlangte diese Pruefung das Gegenteil (Zeitraffer, Blatt
     fuer Blatt). Jetzt: nach 450 ms sind ALLE Blaetter offen (> 0,8). */
  pruefe("sie gehen GEMEINSAM auf (Walkie #157)", Math.min(...frueh) > 0.8, frueh.join(" "));
  pruefe("am Ende sind alle offen", offen.every((x) => x >= 0.95), offen.join(" "));
  pruefe("beim Verstummen Blatt fuer Blatt zu", Math.min(...halbZu) < 0.5 && Math.max(...halbZu) > 0.8, halbZu.join(" "));
  pruefe("dann ist der Kelch zu", zu.every((x) => x <= 0.35), zu.join(" "));

  console.log("\nSCHON-PASS 7 — STROM A / B / C\n");
  const sm = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    const erg = {};
    ["strom", "stromkugel", "strommantel"].forEach((a) => {
      knopf.dataset.sprechbild = a;
      window.DMA_PRUEFUNG.sprechFeld(knopf, a);
      const svg = knopf.querySelector(".lc-sprechfeld .lc-strom-bild");
      if (!svg) { erg[a] = null; return; }
      const zucken = [...svg.querySelectorAll('animate[attributeName="d"][calcMode="discrete"]')];
      const leben = zucken.map((z) => parseFloat(z.getAttribute("dur")) / z.getAttribute("values").split(";").length);
      /* alle Punkte aller Formen: Abstand zur Mitte */
      const r = [];
      zucken.forEach((z) => z.getAttribute("values").split(";").forEach((d) => {
        const zahlen = (d.match(/-?\d+\.?\d*/g) || []).map(Number);
        for (let i = 0; i + 1 < zahlen.length; i += 2) r.push(Math.hypot(zahlen[i] - 50, zahlen[i + 1] - 50));
      }));
      erg[a] = { linien: zucken.length, lebenMin: Math.min(...leben), lebenMax: Math.max(...leben), rMin: Math.min(...r),
        kugel: !!svg.querySelector("animateMotion"), weg: (svg.querySelector("animateMotion") || { getAttribute: () => "" }).getAttribute("path") };
    });
    return erg;
  });
  /* jede Linie steht zweimal da: scharf und darunter weich (Leuchten) */
  pruefe("Plasmalampe: 5–6 Filamente aus der Mitte", sm.strom && sm.strom.linien >= 10 && sm.strom.linien <= 12 && sm.strom.rMin < 1.5,
    sm.strom ? sm.strom.linien / 2 + " Filamente" : "fehlt");
  pruefe("jede Form lebt 0,1–0,3 s", sm.strom && sm.strom.lebenMin >= 0.099 && sm.strom.lebenMax <= 0.301,
    sm.strom ? sm.strom.lebenMin.toFixed(2) + "–" + sm.strom.lebenMax.toFixed(2) + " s" : "");
  pruefe("Kugelblitz: eine Kugel wandert auf dem Ring", sm.stromkugel && sm.stromkugel.kugel && / A34\.7 34\.7 /.test(sm.stromkugel.weg), sm.stromkugel ? sm.stromkugel.weg : "fehlt");
  /* Mantel: kein Punkt naeher an der Mitte als der Ring — „innen leer von Blitzen" */
  pruefe("Strommantel: Entladungen NUR aussen", sm.strommantel && sm.strommantel.rMin >= 34.7, sm.strommantel ? "naechster Punkt " + sm.strommantel.rMin.toFixed(1) : "fehlt");

  console.log("\nSCHON-PASS 8 — MAGIE UND FUNKELN\n");
  const mf = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    const erg = {};
    ["magie", "funkeln"].forEach((a) => {
      knopf.dataset.sprechbild = a + "2";
      window.DMA_PRUEFUNG.sprechFeld(knopf, a + "2");
      const feld = knopf.querySelector(".lc-sprechfeld");
      const svg = feld && feld.querySelector("svg");
      const punkte = svg ? [...svg.querySelectorAll(":scope > circle")] : [];
      erg[a] = { da: !!svg, zeichen: feld ? feld.textContent.trim().length : -1, punkte: punkte.length,
        rMin: Math.min(...punkte.map((c) => Math.hypot(parseFloat(c.getAttribute("cx")) - 50, parseFloat(c.getAttribute("cy")) - 50))) };
      if (a === "magie") {
        const takte = [];
        punkte.forEach((c) => { const m = c.querySelector("animateMotion"); const kt = m.getAttribute("keyTimes").split(";").map(Number);
          const d = parseFloat(m.getAttribute("dur")); for (let i = 1; i < kt.length; i++) takte.push((kt[i] - kt[i - 1]) * d); });
        erg[a].stueckMin = Math.min(...takte); erg[a].stueckMax = Math.max(...takte);
        erg[a].faeden = svg.querySelectorAll(":scope > path").length;
      } else {
        const bl = punkte.map((c) => { const an = c.querySelector('animate[attributeName="opacity"]'); const kt = an.getAttribute("keyTimes").split(";").map(Number);
          return (kt[3] - kt[1]) * parseFloat(an.getAttribute("dur")); });
        erg[a].blitzMin = Math.min(...bl); erg[a].blitzMax = Math.max(...bl);
        erg[a].orte = punkte.every((c) => c.querySelector('animate[attributeName="cx"]').getAttribute("values").split(";").length >= 5);
      }
    });
    return erg;
  });
  /* RUNDE 101 — Walkie #159 „Magie zu blass": 96 groessere Punkte. */
  pruefe("Magie: 88–110 Lichtpunkte, keine Sternzeichen", mf.magie.punkte >= 88 && mf.magie.punkte <= 110 && mf.magie.zeichen === 0, mf.magie.punkte + " Punkte");
  pruefe("Magie: Mitte leer (alle ausserhalb des Rings)", mf.magie.rMin >= 34.7, "naechster " + mf.magie.rMin.toFixed(1));
  pruefe("Magie: Richtungswechsel alle 0,4–0,9 s", mf.magie.stueckMin >= 0.39 && mf.magie.stueckMax <= 0.91,
    mf.magie.stueckMin.toFixed(2) + "–" + mf.magie.stueckMax.toFixed(2) + " s");
  pruefe("Magie: 1–3 Lichtfaeden am Saum", mf.magie.faeden >= 1 && mf.magie.faeden <= 3, mf.magie.faeden);
  pruefe("Funkeln: viele winzige Punkte am Saum", mf.funkeln.punkte >= 60 && mf.funkeln.rMin >= 34.7, mf.funkeln.punkte + " Punkte");
  /* RUNDE 101 — Walkie #159 „Funkeln zu wenig": laenger hell (bis 0,5 s). */
  pruefe("Funkeln: Aufblitzen 0,15–0,5 s", mf.funkeln.blitzMin >= 0.149 && mf.funkeln.blitzMax <= 0.501,
    mf.funkeln.blitzMin.toFixed(2) + "–" + mf.funkeln.blitzMax.toFixed(2) + " s");
  pruefe("Funkeln: kein stehendes Raster (jeder Punkt wechselt den Ort)", mf.funkeln.orte, "");

  console.log("\nSCHON-PASS 10 — HERZEN UND NOTEN\n");
  const hn = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    knopf.dataset.sprechbild = "herzen2";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "herzen2");
    const hz = [...knopf.querySelectorAll(".lc-herzen-bild path")];
    const striche = hz.map((p) => parseFloat(p.getAttribute("stroke-width")) * knopf.querySelector(".lc-sprechfeld").getBoundingClientRect().width / 100);
    const zeichenH = knopf.querySelector(".lc-sprechfeld").textContent.trim().length;
    knopf.dataset.sprechbild = "noten2";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "noten2");
    const nt = [...knopf.querySelectorAll(".lc-noten-bild > g")];
    const r = nt.map((g) => { const m = g.getAttribute("transform").match(/translate\(([\d.]+) ([\d.]+)\)/); return Math.hypot(m[1] - 50, m[2] - 50); });
    return { herzen: hz.length, strichMin: Math.min(...striche), strichMax: Math.max(...striche), zeichenH,
      noten: nt.length, rMin: Math.min(...r), zeichenN: knopf.querySelector(".lc-sprechfeld").textContent.trim().length };
  });
  /* RUNDE 101 — Walkie #160 „Herzen mehr": 40. */
  pruefe("Herzen: 36–44, als Herz-Pfad (kein Zeichen)", hn.herzen >= 36 && hn.herzen <= 44 && hn.zeichenH === 0, hn.herzen);
  pruefe("Herzen: Strich 1–1,5 px", hn.strichMin >= 0.95 && hn.strichMax <= 1.55, hn.strichMin.toFixed(2) + "–" + hn.strichMax.toFixed(2) + " px");
  pruefe("Noten: auf dem Ring, nicht aus der Mitte, keine Zeichen", hn.noten >= 12 && hn.rMin >= 34.7 && hn.zeichenN === 0, hn.noten + " Noten, naechste " + hn.rMin.toFixed(1));

  console.log("\nSCHON-PASS 11–15 — KRANZ, KUGEL, OHREN, MAUL, SCHEMEN\n");
  const nu = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    const bau = (a) => { knopf.dataset.sprechbild = a; window.DMA_PRUEFUNG.sprechFeld(knopf, a); return knopf.querySelector(".lc-sprechfeld svg"); };
    const e = {};
    let s = bau("kranz");
    e.kerzen = s ? s.querySelectorAll("rect[fill='#B45309']").length : 0;
    e.flackern = s ? [...s.querySelectorAll("ellipse > animateTransform")].map((a) => Math.max(...a.getAttribute("values").split(";").map((v) => Math.abs(parseFloat(v) - 1)))) : [];
    e.nadeln = s ? s.querySelectorAll("g path").length : 0;
    s = bau("kugel");
    e.schnee = s ? s.querySelectorAll("g[mask] circle").length : 0;
    e.pakete = s ? s.querySelectorAll("g[clip-path] rect").length : 0;
    s = bau("ohren");
    e.ohren = s ? [...s.querySelectorAll(":scope > g")].map((g) => ({ haare: g.querySelectorAll("g[stroke] path").length,
      takt: g.querySelector("animateTransform").getAttribute("dur"), neig: Math.abs(parseFloat(g.querySelector("animateTransform").getAttribute("values"))) })) : [];
    s = bau("baerohren");
    e.baer = s ? [...s.querySelectorAll(":scope > g")].map((g) => ({ haare: g.querySelectorAll("g[stroke] path").length,
      neig: Math.abs(parseFloat(g.querySelector("animateTransform").getAttribute("values"))) })) : [];
    s = bau("maul");
    const hub = s ? [...s.querySelectorAll(":scope > g > animateTransform")].map((a) => Math.abs(parseFloat(a.getAttribute("values").split(";")[1].split(" ")[1]))) : [];
    e.spalt = hub.reduce((x, y) => x + y, 0) / 69.4 * 100;
    e.maulTakt = s ? parseFloat(s.querySelector("animateTransform").getAttribute("dur")) : 0;
    e.zaehne = s ? s.querySelectorAll("path[fill='#F8FAFC']").length : 0;
    s = bau("schemen");
    const dunkel = s ? s.querySelector("rect animate").getAttribute("values").split(";").map(Number) : [0];
    e.dunkel = Math.max(...dunkel);
    e.schatten = s ? parseFloat(s.querySelector("animateMotion").getAttribute("dur")) : 0;
    return e;
  });
  /* RUNDE 101 — Walkie #161 „Kranz: mehr Nadeln": 520 (mit Luecken). */
  pruefe("Kranz: 4–6 Kerzen, Nadeln mit Luecken", nu.kerzen >= 4 && nu.kerzen <= 6 && nu.nadeln > 400 && nu.nadeln < 520, nu.kerzen + " Kerzen, " + nu.nadeln + " Nadeln");
  pruefe("Kranz: Flammen flackern 8–12 %", nu.flackern.length && nu.flackern.every((x) => x >= 0.08 && x <= 0.12), nu.flackern.map((x) => x.toFixed(2)).join(" "));
  /* RUNDE 101 — Walkie #161 „Kugel: mehr Schnee": 60. */
  pruefe("Kugel: 50–70 Schneepunkte, 2–3 Paeckchen", nu.schnee >= 50 && nu.schnee <= 70 && nu.pakete >= 2 && nu.pakete <= 3, nu.schnee + " Schnee, " + nu.pakete + " Paeckchen");
  pruefe("Hasenohren: 20–40 Haare je Ohr, 4–8 Grad, nicht im Takt",
    nu.ohren.length === 2 && nu.ohren.every((o) => o.haare >= 20 && o.haare <= 40 && o.neig >= 4 && o.neig <= 8) && nu.ohren[0].takt !== nu.ohren[1].takt,
    JSON.stringify(nu.ohren));
  pruefe("Baerenohren: weniger Haar, schwaecherer Wackel", nu.baer.length === 2 && nu.baer.every((o) => o.haare < 20 && o.neig < 4), JSON.stringify(nu.baer));
  pruefe("Maul: Spalt 8–18 %, Takt 1–1,4 s, zwei Zaehne", nu.spalt >= 8 && nu.spalt <= 18 && nu.maulTakt >= 1 && nu.maulTakt <= 1.4 && nu.zaehne === 2,
    nu.spalt.toFixed(1) + " %, " + nu.maulTakt + " s");
  pruefe("Schemen: abdunkeln auf 40–60 %, Schatten 1,5–2,5 s", nu.dunkel >= 0.4 && nu.dunkel <= 0.6 && nu.schatten >= 1.5 && nu.schatten <= 2.5,
    nu.dunkel + " / " + nu.schatten + " s");

  console.log("\nUND WENN DAS SPRECHEN AUFHOERT?\n");
  const weg = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    window.DMA_PRUEFUNG.sprechFeldWeg(knopf);
    return !knopf.querySelector(".lc-sprechfeld");
  });
  pruefe("das Feld ist wieder weg", weg);

  console.log("\nBLEIBT DIE WAHL AM PROFIL?\n");
  const gemerkt = await pg.evaluate(() => {
    window.LiveChat.sprechbildSetzen ? window.LiveChat.sprechbildSetzen("magie") : null;
    try { window.LiveChat.pruefBefehl("/sprechbild magie"); } catch (e) {}
    return { wahl: window.LiveChat.sprechbild(),
             imProfil: window.DMA_EINST ? window.DMA_EINST.holen("sprechbild", "") : "kein Fach" };
  });
  pruefe("die Wahl steht", gemerkt.wahl === "magie", gemerkt.wahl);
  pruefe("und liegt in der Profil-Ablage", gemerkt.imProfil === "magie", String(gemerkt.imProfil));

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Sechzehn Sprechbilder, jedes mit eigenem Leben.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
