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

/* SCHON-PASS (Xanders Liste vom 23.09.): das Feuer ist seitdem EIN
   Bild statt Teilchen — es hat unten einen eigenen Abschnitt. */
const TEILCHEN = ["magie", "noten", "herzen", "strom", "blasen"];

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
  pruefe("es sind sechzehn Sprechbilder plus „aus“", liste.length === 17,
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
    knopf.dataset.sprechbild = "feuer";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "feuer");
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
    knopf.dataset.sprechbild = "welle";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "welle");
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
  pruefe("sie laufen 8–14 % nach aussen", we.lauf && we.lauf.every((x) => x >= 8 && x <= 14), (we.lauf || []).map((x) => x.toFixed(1)).join(", "));

  console.log("\nSCHON-PASS 4 — BLUT\n");
  const bl = await pg.evaluate(() => {
    const knopf = document.querySelector(".lc-platz");
    knopf.dataset.sprechbild = "blut";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "blut");
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
    knopf.dataset.sprechbild = "eis";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "eis");
    const svg = knopf.querySelector(".lc-sprechfeld svg.lc-eis-bild");
    if (!svg) return { da: false };
    const zapfen = [...svg.querySelectorAll('path[fill^="url(#lcEz"]')];
    const tiefste = Math.max(...zapfen.map((z) => { const zahlen = z.getAttribute("d").match(/-?\d+\.?\d*/g).map(Number); return Math.max(...zahlen.filter((v, i) => i % 2 === 1)); }));
    const adern = [...svg.querySelectorAll("g[clip-path] path")];
    const deck = adern.map((p) => parseFloat(p.getAttribute("stroke-opacity")));
    const dick = adern.map((p) => parseFloat(p.getAttribute("stroke-width")));
    const starts = new Set(adern.map((p) => p.querySelector("animate").getAttribute("begin")));
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
    knopf.dataset.sprechbild = "bluete";
    window.DMA_PRUEFUNG.sprechFeld(knopf, "bluete");
  });
  const groesse = () => pg.evaluate(() => [...document.querySelectorAll(".lc-sbluete .lc-bl-blatt")].map((g) => {
    const l = g.transform.animVal; let a = 1; for (let i = 0; i < l.numberOfItems; i++) { const t = l.getItem(i); if (t.type === 3) a *= t.matrix.a; }
    return Math.round(a * 100) / 100; }));
  await pg.waitForTimeout(450);
  const frueh = await groesse();
  await pg.waitForTimeout(1700);
  const offen = await groesse();
  const formen = await pg.evaluate(() => new Set([...document.querySelectorAll(".lc-sbluete .lc-bl-blatt > path:first-of-type")].map((p) => p.getAttribute("d"))).size);
  await pg.evaluate(() => window.DMA_PRUEFUNG.blueteZu(document.querySelector(".lc-sbluete")));
  await pg.waitForTimeout(700);
  const halbZu = await groesse();
  await pg.waitForTimeout(1300);
  const zu = await groesse();
  pruefe("8–12 Blaetter", offen.length >= 8 && offen.length <= 12, offen.length);
  pruefe("jedes Blatt hat seine eigene Form", formen === offen.length, formen + " Formen");
  pruefe("sie gehen NACHEINANDER auf (Zeitraffer)", Math.min(...frueh) < 0.5 && Math.max(...frueh) > 0.8, frueh.join(" "));
  pruefe("am Ende sind alle offen", offen.every((x) => x >= 0.95), offen.join(" "));
  pruefe("beim Verstummen Blatt fuer Blatt zu", Math.min(...halbZu) < 0.5 && Math.max(...halbZu) > 0.8, halbZu.join(" "));
  pruefe("dann ist der Kelch zu", zu.every((x) => x <= 0.35), zu.join(" "));

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
