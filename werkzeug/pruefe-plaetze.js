/* PRÜFT JEDEN PLATZ IM BILDERRÄTSEL GEGEN SEINEN EIGENEN SZENENTEIL.
   ---------------------------------------------------------------
   GEMELDET: „Da steht, das Mädchen mit der gelben Bluse steht am
   Waschbecken — sie steht aber vor der Waschmaschine." Und: „Eine
   Frau steht komplett im Koffer statt auf dem Gleis."

   Jeder Platz nennt in „teil" das Ding, an dem die Figur stehen soll.
   Damit lässt sich RECHNEN statt hinsehen. Geprüft wird dreierlei:

     1. Ist die Figur überhaupt bei ihrem eigenen Teil?
     2. Stehen die Füsse auf dem Boden — oder schwebt sie?
     3. Steckt sie in einem gemalten MENSCHEN?

   Warum nur Menschen bei 3: die Szenen sind flache Seitenansichten
   ohne Tiefe. „Vor der Küchenzeile stehen" und „in der Küchenzeile
   stecken" ergeben denselben gemessenen Kasten — über Möbel kann
   diese Prüfung also nichts beweisen und darf deshalb auch nichts
   behaupten. Über Menschen schon: zwei Körper an einer Stelle sind
   immer falsch, egal wie tief der Raum ist. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = "/home/user/Deutsch-Mit-Xander";
const TYP = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json" };

/* Die gemalten Leute, namentlich — aus dem deutschen Wort der
   Szenenteile abgeleitet und hier festgeschrieben, damit die Prüfung
   nicht raten muss. */
const LEUTE = {
  badezimmer: ["frau", "kind"], schlafzimmer: ["frau", "mann"], kueche: ["koch"],
  wohnzimmer: ["vater", "tochter", "mutter", "kind"], kinderzimmer: ["junge", "maedchen"],
  klassenzimmer: ["schuelerin", "lehrerin"], restaurant: ["gast", "kind", "kellner"],
  supermarkt: ["verkaeuferin", "kundin"], strasse: ["fussgaenger"],
  bahnhof: ["schaffner"], arztpraxis: ["aerztin", "patient"], flur: ["mann"],
};
const MENSCHEN = new Set();
Object.keys(LEUTE).forEach((s) => LEUTE[s].forEach((i) => MENSCHEN.add(s + "/" + i)));

const IM_BROWSER = async (pid) => {
  const erg = await window.DMA_PRUEF.brBild(pid);
  if (!erg) return null;
  const platz = erg.platz;
  const sz = (window.DMA_SZENE || {})[platz.szene];
  if (!sz) return null;
  const ns = "http://www.w3.org/2000/svg";
  const kasten = (inhalt, dx, dy) => {
    const s2 = document.createElementNS(ns, "svg");
    s2.setAttribute("viewBox", "0 0 " + sz.breite + " " + sz.hoehe);
    s2.style.cssText = "position:absolute;left:-9999px;width:" + sz.breite + "px";
    s2.innerHTML = (window.DMA_FIGUR_DEFS || "") + '<g id="mm">' + inhalt + "</g>";
    document.body.appendChild(s2);
    let b = null;
    try { const r = s2.querySelector("#mm").getBBox();
      if (r.width > 0 || r.height > 0)
        b = { l: r.x + dx, r: r.x + r.width + dx, o: r.y + dy, u: r.y + r.height + dy };
    } catch (e) {}
    s2.remove();
    return b;
  };
  /* Die Figur: ihr <g> steht als letztes im fertigen Bild. */
  const h = document.createElement("div");
  h.style.cssText = "position:absolute;left:-9999px";
  h.innerHTML = erg.html;
  document.body.appendChild(h);
  const svg = h.querySelector("svg");
  const gs = [...svg.children].filter((e) => e.tagName === "g");
  const figG = gs[gs.length - 1];
  let fb = null;
  try {
    const b = figG.getBBox();
    const m = figG.transform.baseVal.consolidate();
    const dx = m ? m.matrix.e : 0, dy = m ? m.matrix.f : 0;
    if (b.width > 0) fb = { l: b.x + dx, r: b.x + b.width + dx, o: b.y + dy, u: b.y + b.height + dy };
  } catch (e) {}
  h.remove();
  const t = (sz.teile || []).find((q) => q.id === platz.teil);
  const tb = t ? kasten('<g transform="translate(' + t.x + ',' + t.y + ')">' + t.kunst + "</g>", 0, 0) : null;
  const andere = [];
  for (const q of (sz.teile || [])) {
    if (q.id === platz.teil) continue;
    if ((platz.verdeckt || []).indexOf(q.id) >= 0) continue;
    const b = kasten('<g transform="translate(' + q.x + ',' + q.y + ')">' + q.kunst + "</g>", 0, 0);
    if (b) andere.push(Object.assign({ id: q.id }, b));
  }
  return { id: pid, szene: platz.szene, teil: platz.teil, haltung: platz.haltung,
           wo: platz.wo, x: platz.x, y: platz.y, sitzY: platz.sitzY, fb, tb, andere };
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
  const port = srv.address().port;
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 700, height: 500 } });
  await pg.goto("http://127.0.0.1:" + port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(3000);

  const ids = await pg.evaluate(async () => {
    await window.DMA_PRUEF.brBild();
    /* Nur die Plätze, die im Bilderrätsel WIRKLICH vorkommen. Das
       Badezimmer kennt auch die Dusche und die Badewanne, aber dort
       ist man ausgezogen (an:false) und das Spiel lässt sie weg;
       „unter dem Baum" und „auf dem Zebrastreifen" fallen durch die
       Präpositions- und Haltungsprüfung. Die hier mitzuzählen hiesse,
       sich Fehler einzubilden, die es nicht gibt. */
    const drin = new Set((window.DMA_PRUEF.brSpielPlaetze || (() => []))());
    return (window.DMA_PLAETZE || []).filter((p) => p.teil && drin.has(p.id)).map((p) => p.id);
  });

  const zeilen = [];
  for (const id of ids) {
    let z = await pg.evaluate(IM_BROWSER, id);
    if (!z || !z.fb || !z.tb) {
      /* Beim ersten Anlauf fehlen manchmal noch die Figurendateien.
         Einmal nachfassen — ungeprüft durchrutschen lassen wäre
         schlimmer als ein zweiter Versuch. */
      await pg.waitForTimeout(800);
      z = await pg.evaluate(IM_BROWSER, id);
    }
    zeilen.push(z || { id, fb: null, tb: null });
  }
  await br.close(); srv.close();
  fs.writeFileSync("/tmp/plaetze-mass.json", JSON.stringify(zeilen, null, 1));

  let schlimm = 0, ungeprueft = 0;
  const lueck = (a, b) => Math.max(0, Math.max(a.l - b.r, b.l - a.r));
  for (const z of zeilen) {
    if (!z.fb || !z.tb) { console.log("?? " + z.id + " — nicht messbar"); ungeprueft++; continue; }
    const klagen = [];
    /* Nicht „berührt sie das Teil irgendwo mit dem Ellbogen“, sondern:
       steht ihre MITTE davor. Der Randabstand allein war zu gutmütig —
       am Nachttisch stand die Figur ganz auf dem Kleiderschrank und
       streifte ihn nur mit der Schulter; die Prüfung liess das durch,
       das Auge nicht. */
    const mitte = (z.fb.l + z.fb.r) / 2;
    const ab = Math.max(0, Math.max(z.tb.l - mitte, mitte - z.tb.r));
    /* Wer SITZT, sitzt neben dem Tisch auf einem Stuhl und nicht
       mitten auf der Tischplatte — da ist ein Stuhlabstand normal.

       ABER: „auf der Bank" ist etwas anderes als „am Tisch". Das
       Wörtchen sagt es selbst, und das Sagen hat der Platz, nicht
       ich — deshalb wird es aus „wo" gelesen und nicht geraten.
       An einem Tisch sitzt man DANEBEN, auf einer Bank DARAUF.
       Die grosszuegigen 30 Einheiten Stuhlabstand gelten deshalb
       nur fuers Danebensitzen.

       GEFUNDEN DAMIT: im Garten sass die Frau 12 Einheiten neben
       dem rechten Ende der Bank im Gras. Die alte Regel liess das
       durch — die Kaesten beruehrten sich zu einem Fuenftel, und
       30 war ja erlaubt. Das Auge sah trotzdem sofort, dass da
       niemand auf der Bank sitzt. */
    const draufSitzen = z.haltung === "sitzen" && /^auf /.test(z.wo || "");
    const erlaubt = draufSitzen ? 0 : (z.haltung === "sitzen" ? 30 : 12);
    if (ab > erlaubt) klagen.push("ihre Mitte steht " + Math.round(ab)
      + " neben „" + z.teil + "“"
      + (draufSitzen ? " — man sitzt DARAUF, nicht daneben" : ""));
    /* Und die Sitzhoehe muss am Moebel liegen. Sie steht als „sitzY"
       im Platz und wird nirgends nachgerechnet: eine Zahl, die ueber
       oder unter dem gezeichneten Stueck liegt, laesst die Figur in
       der Luft schweben oder im Boden versinken. */
    if (draufSitzen && typeof z.sitzY === "number"
        && (z.sitzY < z.tb.o - 2 || z.sitzY > z.tb.u + 2)) {
      klagen.push("die Sitzhöhe " + z.sitzY + " liegt nicht an „" + z.teil
        + "“ (" + Math.round(z.tb.o) + " bis " + Math.round(z.tb.u) + ")");
    }
    /* UNTER DEM HINTERN MUSS ETWAS SEIN.
       Am Tisch sitzt man auf einem Stuhl — nur muss der auch gemalt
       sein. Im Kinderzimmer sass die Frau am Schreibtisch in der
       Luft, im Restaurant die Frau am Tisch daneben ebenso: beide
       Szenen haben an dieser Stelle gar kein Sitzmöbel. Die alte
       Prüfung konnte das nicht sehen, weil sie nur das EINE Teil
       ansah, das der Platz nennt — und ein Tisch ist nun mal da.
       Gefragt wird deshalb: liegt der Sitzpunkt (x | sitzY) in
       irgendeinem gezeichneten Stück dieser Szene? Der Boden zählt
       nicht mit; er ist Kulisse und kein Teil. */
    if (z.haltung === "sitzen" && typeof z.sitzY === "number") {
      /* Am Tisch sitzt man NICHT auf dem Tisch. Steht im Platz
         „am“ oder „an“, darf das genannte Teil selbst also nicht
         als Sitzgelegenheit durchgehen — sonst zaehlte die
         Tischplatte als Stuhl, und genau das hat den Fall im
         Kinderzimmer verdeckt. Bei „auf“ und „im“ zaehlt es mit:
         auf der Bank sitzt man auf der Bank. */
      const daneben = /^(an|am) /.test(z.wo || "");
      const kandidaten = daneben ? z.andere : [z.tb].concat(z.andere);
      /* Und es muss bis zum Boden reichen. Sonst galt im
         Kinderzimmer das BUCH auf dem Schreibtisch als Sitzgelegen-
         heit: es liegt genau dort, wo der Hintern hin soll. Ein
         Stuhl, eine Bank, ein Sofa, ein Bett haben Beine bis
         hinunter; ein Buch und eine Tischplatte enden in der Luft.
         Gemessen an den Fuessen der Figur, nicht an einer geratenen
         Bodenlinie. */
      const traegt = kandidaten.some((b) =>
        b && z.x >= b.l - 3 && z.x <= b.r + 3
          && z.sitzY >= b.o - 3 && z.sitzY <= b.u + 3
          && b.u >= z.fb.u - 20);
      if (!traegt) klagen.push("sitzt auf nichts — bei (" + z.x + " | "
        + z.sitzY + ") ist in dieser Szene kein Sitzmöbel gezeichnet");
    }
    if (z.haltung === "stehen" || z.haltung === "gehen") {
      /* Der Mast einer Ampel ist bis in den Vordergrund gezeichnet,
         die Person steht aber weiter hinten auf dem Gehweg — ein
         kleiner Unterschied beweist also nichts. Erst ein grosser:
         der Automat am Bahnhof lag 77 daneben, das Regal im
         Supermarkt 52. Solche Figuren schweben wirklich. */
      const d = z.fb.u - z.tb.u;
      if (d < -32) klagen.push("schwebt " + Math.round(-d) + " über dem Boden von „" + z.teil + "“");
    }
    for (const a of z.andere) {
      if (!MENSCHEN.has(z.szene + "/" + a.id)) continue;
      const ux = Math.min(z.fb.r, a.r) - Math.max(z.fb.l, a.l);
      const uy = Math.min(z.fb.u, a.u) - Math.max(z.fb.o, a.o);
      if (ux <= 0 || uy <= 0) continue;
      const anteil = (ux * uy) / ((z.fb.r - z.fb.l) * (z.fb.u - z.fb.o));
      if (anteil > 0.4) klagen.push("liegt zu " + Math.round(anteil * 100) + " % auf „" + a.id + "“ — zwei Menschen auf einem Fleck");
    }
    if (klagen.length) {
      schlimm++;
      console.log("❌ " + z.id.padEnd(26) + z.wo);
      klagen.forEach((k) => console.log("      " + k));
    }
  }
  console.log("\n" + zeilen.length + " Plätze geprüft, " + schlimm + " stimmen nicht"
    + (ungeprueft ? ", " + ungeprueft + " nicht messbar" : "") + ".");
  process.exit(schlimm || ungeprueft ? 1 : 0);
})();
