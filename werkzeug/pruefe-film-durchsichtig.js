#!/usr/bin/env node
/* =========================================================
   IST JEDER FILM WIRKLICH DURCHSICHTIG?
   ---------------------------------------------------------
   Ein freigestellter Film, der seine Alphaspur verliert,
   sieht im Werkzeug voellig gesund aus — die Datei ist da,
   sie spielt, sie hat die richtige Laenge. Erst im
   Klassenzimmer merkt man es: dann haengt ein gruener oder
   schwarzer Kasten ueber dem Chat.

   Genau das waere beim Neubau des T-Rex beinahe passiert
   (ein falsch gesetztes Argument, und das Werkzeug haette
   ohne Alpha gerechnet). Deshalb wird es ab jetzt gemessen,
   und zwar an der Stelle, an der es zaehlt: im Browser, auf
   einer Leinwand, mit den echten Punkten.

   Geprueft wird je Film:
   1. Die vier Ecken sind durchsichtig.
   2. Es gibt ueberhaupt etwas Durchsichtiges UND etwas
      Deckendes — ein ganz leeres oder ein ganz volles Bild
      waere beides falsch.
   3. Die Groesse steht in der Liste und stimmt mit der
      Datei ueberein.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webm": "video/webm", ".mp4": "video/mp4",
  ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".mp3": "audio/mpeg" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  const liste = JSON.parse(fs.readFileSync(path.join(WURZEL, "filme", "liste.json"), "utf8"));
  const filme = (liste.filme || []).filter((f) => f.name.slice(0, 2) !== "__");
  /* Welche Sorte ist jeder Film? Steht in seiner eigenen Datei. */
  const arten = {};
  filme.forEach((f) => {
    try {
      arten[f.name] = JSON.parse(fs.readFileSync(
        path.join(WURZEL, "filme", f.name + ".json"), "utf8")).art || "gruen";
    } catch (e) { arten[f.name] = "gruen"; }
  });
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 420, height: 800 } });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(800);

  console.log("\nDIE GROESSEN IN DER LISTE\n");
  filme.forEach((f) => {
    const datei = path.join(WURZEL, "filme", f.name + ".webm");
    const echt = fs.existsSync(datei) ? fs.statSync(datei).size : 0;
    pruefe(f.name + ": die Groesse in der Liste stimmt",
      echt > 0 && Math.abs((f.bytes || 0) - echt) < 2048,
      (f.bytes || 0) + " eingetragen, " + echt + " gemessen");
  });

  console.log("\nDIE DURCHSICHTIGKEIT — AN ECHTEN PUNKTEN\n");
  for (const f of filme) {
    const d = await pg.evaluate(async (name) => {
      const v = document.createElement("video");
      v.src = "filme/" + name + ".webm";
      v.muted = true; v.playsInline = true;
      document.body.appendChild(v);
      await new Promise((fr) => { v.onloadeddata = fr; v.onerror = fr; setTimeout(fr, 12000); });
      if (!v.videoWidth) { v.remove(); return { fehlt: true }; }
      /* Mitten im Film messen, nicht am Anfang: manche fangen mit
         einem leeren Bild an. ABSPIELEN, nicht springen — gemessen:
         nach „currentTime = …" stand in der Leinwand viermal
         hintereinander dasselbe Bild, der Sprung war also gar nicht
         angekommen. Zwei Sekunden laufen lassen ist ehrlicher als
         ein Sprung, der nicht stattfindet. */
      try { await v.play(); } catch (e) {}
      await new Promise((fr) => setTimeout(fr, 2600));
      v.pause();
      const c = document.createElement("canvas");
      c.width = v.videoWidth; c.height = v.videoHeight;
      const g = c.getContext("2d");
      g.clearRect(0, 0, c.width, c.height);
      g.drawImage(v, 0, 0);
      const p = g.getImageData(0, 0, c.width, c.height).data;
      let durch = 0, deckend = 0;
      for (let i = 3; i < p.length; i += 4) {
        if (p[i] < 20) durch++;
        else if (p[i] > 235) deckend++;
      }
      const ges = p.length / 4;
      const ecke = (x, y) => p[((y * c.width) + x) * 4 + 3];
      const ecken = [ecke(2, 2), ecke(c.width - 3, 2), ecke(2, c.height - 3), ecke(c.width - 3, c.height - 3)];
      v.remove();
      return { breite: c.width, hoehe: c.height,
        durch: +(durch / ges * 100).toFixed(1),
        deckend: +(deckend / ges * 100).toFixed(1),
        ecken: ecken };
    }, f.name);
    if (d.fehlt) { pruefe(f.name + ": laesst sich abspielen", false, "kein Bild"); continue; }
    /* Ein GRUEN-Film ist mit einem Farbschluessel freigestellt: der
       Hintergrund ist restlos weg, die Ecken sind null. Ein DUNKEL-
       Film nimmt die Helligkeit als Maske — dort bleibt an den
       Raendern von Natur aus ein weicher Rest stehen, und ein
       harter Schnitt saehe schlechter aus als der Rest. Deshalb zwei
       verschiedene Erwartungen, jede mit Grund. */
    const art = arten[f.name] || "gruen";
    const grenze = art === "gruen" ? 24 : 60;
    pruefe(f.name + " (" + art + "): die vier Ecken sind durchsichtig",
      d.ecken.every((a) => a < grenze),
      d.ecken.join(", ") + " (erlaubt bis " + grenze + ")");
    /* Wie viel deckend ist, haengt vom Motiv ab: ein U-Boot in der
       Tiefsee fuellt weniger Bild als ein Loewe. Geprueft wird
       deshalb nur, dass ueberhaupt etwas da ist. */
    pruefe(f.name + ": es ist etwas zu sehen und etwas frei",
      d.durch > 10 && d.deckend > 1.5,
      d.durch + " % frei, " + d.deckend + " % deckend, " + d.breite + "x" + d.hoehe);
  }

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Alle Filme sind wirklich freigestellt.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
