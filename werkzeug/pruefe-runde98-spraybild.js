#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — DAS EIGENE BILD WIRD WIRKLICH AUFGESPRUEHT
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „und das mit dem Bild muss unbedingt
   funktionieren und es muss in seinen Pixeln genauso aufgespruecht
   werden selbst ein gif sogar und die Sachen sollen bleibend sein."

   DREI DINGE WAREN KAPUTT, alle hier nachgemessen:

   1. DIE PIXEL. Das Bild wurde aus Tropfen NACHGEMALT: die Farbe kam
      stichprobenartig aus dem Motiv, und unter jedem Tropfen lag ein
      dunkler Saum. Ein Testbild aus vier klaren Vierteln (rot, gruen,
      blau, gelb) kam so heraus:
        [134,10,8]  [14,111,5]  [14,10,132]  [140,119,5]
      — ueberall rund die Haelfte zu dunkel, 32 % Treffer.
      Jetzt wird nicht mehr nachgemalt: die Tropfen sind ein
      AUSSCHNITT, durch den das Bild SELBST gezeichnet wird.

   2. DAS GIF. Festgehalten wurde ein einzelnes PNG — jede Bewegung
      war weg. Jetzt traegt die bleibende Schicht die Ursprungsadresse,
      und ein GIF laeuft weiter.

   3. DIE FREMDE HERKUNFT. Ein Bild von einem anderen Server (GIPHY!)
      kam ueberhaupt nicht an: „crossOrigin = anonymous" liess den
      Browser das Laden verweigern, und die fremde Leinwand haette
      sich ohnehin nicht auslesen lassen. Gemessen wird deshalb mit
      einem ZWEITEN Server ohne CORS-Kopf — genau der Fall, den GIPHY
      erzeugt.

   Der zweite Server ist der Kern dieser Sonde: ohne ihn waere jede
   Messung gruen, obwohl der haeufigste Fall im Alltag rot ist.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TMP = "/tmp/claude-0/spraybild-foto.png";
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};
const geben = (wurzel) => http.createServer((q, a) => {
  let p = decodeURIComponent(q.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const f = path.join(wurzel, p);
  if (!f.startsWith(wurzel) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    a.writeHead(404); return a.end();
  }
  a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(a);
});

(async () => {
  const s1 = geben(WURZEL).listen(0);
  /* DERSELBE Ordner, aber ein ANDERER Port — fuer den Browser ist das
     eine fremde Herkunft, und CORS-Koepfe schickt dieser Server
     keine. Genau die Lage bei einem GIPHY-Bild. */
  const s2 = geben(path.join(WURZEL, "werkzeug")).listen(0);
  const eigen = "http://127.0.0.1:" + s1.address().port;
  const fremd = "http://127.0.0.1:" + s2.address().port;

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto(eigen + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  const spruehen = (url, wer) => pg.evaluate(async ([u, w]) => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 220));
    window.DMA_PRUEFUNG.wirkung("spray", w, "Alex", { stueck: u });
    await new Promise((f) => setTimeout(f, 4200));
    const platz = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf(w.toLowerCase()) >= 0)[0];
    const lack = platz && platz.querySelector(".lc-sprayfarbe-bild");
    const leinwand = platz && platz.querySelector(".lc-spray-lack");
    return {
      bleibt: Boolean(lack),
      quelle: lack ? String(lack.src || "") : "",
      eigen: Boolean(lack && lack.classList.contains("lc-sprayfarbe-eigen")),
      leinwandWeg: !leinwand || getComputedStyle(leinwand).visibility === "hidden"
    };
  }, [url, wer]);

  console.log("\nDAS EIGENE PNG\n");
  const png = await spruehen(eigen + "/werkzeug/pruefbild-viertel.png", "Bea");
  sage(png.bleibt, "es bleibt liegen");
  sage(png.quelle.indexOf("pruefbild-viertel.png") >= 0,
    "und zwar als das Bild selbst, nicht als nachgemaltes PNG",
    png.quelle.slice(0, 60));
  sage(png.eigen, "es liegt als eigenes Bild da");
  sage(png.leinwandWeg, "und die Spruehleinwand darueber ist weg");

  console.log("\nWIE GENAU SIND DIE PIXEL?\n");
  /* Das Testbild hat vier klare Viertel. Gemessen wird, wie viele
     Bildpunkte ihre Sollfarbe treffen — der Wert, der vorher 32 % war. */
  const genau = await pg.evaluate(async () => {
    const platz = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("bea") >= 0)[0];
    const bild = platz && platz.querySelector(".lc-sprayfarbe-bild");
    if (!bild) return null;
    await new Promise((f) => { if (bild.complete) f(); else bild.onload = f; });
    const c = document.createElement("canvas");
    c.width = 64; c.height = 64;
    const g = c.getContext("2d");
    g.drawImage(bild, 0, 0, 64, 64);
    const d = g.getImageData(0, 0, 64, 64).data;
    const soll = (x, y) => (x < 32 && y < 32) ? [255, 0, 0]
      : (x >= 32 && y < 32) ? [0, 200, 0]
      : (x < 32 && y >= 32) ? [0, 0, 255] : [255, 220, 0];
    let getroffen = 0, gemessen = 0;
    for (let y = 8; y < 56; y++) for (let x = 8; x < 56; x++) {
      const o = (y * 64 + x) * 4;
      if (d[o + 3] < 40) continue;
      gemessen++;
      const s = soll(x, y);
      if (Math.abs(d[o] - s[0]) + Math.abs(d[o + 1] - s[1])
        + Math.abs(d[o + 2] - s[2]) < 120) getroffen++;
    }
    const mittel = (x0, y0) => {
      let r = 0, gg = 0, b = 0, n = 0;
      for (let y = y0 + 4; y < y0 + 24; y++) for (let x = x0 + 4; x < x0 + 24; x++) {
        const o = (y * 64 + x) * 4;
        if (d[o + 3] < 40) continue;
        r += d[o]; gg += d[o + 1]; b += d[o + 2]; n++;
      }
      return n ? [Math.round(r / n), Math.round(gg / n), Math.round(b / n)] : null;
    };
    return { treffer: gemessen ? Math.round(getroffen / gemessen * 100) : 0,
      gemessen: gemessen,
      viertel: [mittel(8, 8), mittel(34, 8), mittel(8, 34), mittel(34, 34)] };
  });
  console.log("  die vier Viertel: "
    + ((genau && genau.viertel) || []).map((v) => "[" + (v || []).join(",") + "]").join(" ")
    + "\n  (soll: [255,0,0] [0,200,0] [0,0,255] [255,220,0])\n");
  sage(genau && genau.treffer >= 85,
    "das Bild liegt in seinen eigenen Pixeln da",
    genau ? genau.treffer + " % der " + genau.gemessen
      + " Bildpunkte treffen ihre Farbe (vorher 32 %)" : "-");

  /* RUNDE 100 — XANDER (Walkie-Talkie): „die animierten GIFs und
     generell die Fotos koennen so wie wenn sie normal auch reingeladen
     werden mit deckenden Dimensionen sein, man sieht sie sonst nur
     angeschnitten."
     Gemessen wird an einem BREITEN Bild (2 : 1): es muss den ganzen
     Kreis fuellen — kein Rand, keine leeren Streifen oben und unten. */
  console.log("\nEIN BREITES BILD DECKT DEN KREIS\n");
  const breit = "data:image/svg+xml," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='100'>"
    + "<rect width='200' height='100' fill='#e02020'/></svg>");
  await spruehen(breit, "Emmi");
  const deckt = await pg.evaluate(() => {
    const platz = [...document.querySelectorAll(".lc-platz")].filter((p) =>
      ((p.querySelector(".lc-platz-name") || {}).textContent || "")
        .toLowerCase().indexOf("emmi") >= 0)[0];
    const lack = platz && platz.querySelector(".lc-sprayfarbe-bild");
    const kreis = platz && platz.querySelector(".lc-kreis");
    if (!lack || !kreis) return null;
    const cs = getComputedStyle(lack);
    /* Verglichen wird mit dem INNEREN des Kreises: sein Rahmen (3 px)
       gehoert nicht zum Bild — das Profilbild liegt genauso innen. */
    const a = lack.getBoundingClientRect(), r = kreis.getBoundingClientRect();
    const k = { left: r.left + kreis.clientLeft, top: r.top + kreis.clientTop,
      width: kreis.clientWidth, height: kreis.clientHeight };
    return { fit: cs.objectFit, rand: cs.paddingTop,
      abweichung: Math.max(Math.abs(a.left - k.left), Math.abs(a.top - k.top),
        Math.abs(a.width - k.width), Math.abs(a.height - k.height)) };
  });
  sage(deckt && deckt.fit === "cover" && deckt.rand === "0px",
    "das eigene Bild fuellt den Kreis wie ein Profilbild (cover, kein Rand)",
    deckt ? deckt.fit + ", Rand " + deckt.rand : "keine Schicht");
  sage(deckt && deckt.abweichung <= 2,
    "... und die Schicht ist so gross wie der Kreis",
    deckt ? "Abweichung " + deckt.abweichung.toFixed(1) + " px" : "-");

  console.log("\nDAS ANIMIERTE GIF\n");
  const gif = await spruehen(eigen + "/werkzeug/pruefbild-blink.gif", "Cem");
  sage(gif.bleibt && /\.gif/i.test(gif.quelle),
    "es bleibt ein GIF und wird nicht zu einem starren PNG",
    gif.quelle.slice(-30) || "-");
  /* UND ES BEWEGT SICH AUCH WIRKLICH.
     ACHTUNG, DAS FALSCHE MESSGERAET: der erste Versuch hat das Bild
     mit „drawImage" in eine Leinwand gezeichnet und die Farbe dort
     abgelesen — und bekam IMMER Rot. Das lag nicht am Produkt: der
     Standard schreibt vor, dass „drawImage" bei einem bewegten Bild
     das ERSTE Einzelbild nimmt. Gemessen wird deshalb das, was der
     Mensch sieht: ein Bildschirmfoto der Stelle, mehrfach
     hintereinander, ausgewertet mit ffmpeg. Das Testbild wechselt
     zwischen Rot und Blau; kommen beide vor, laeuft das GIF. */
  const bewegt = await (async () => {
    /* GENAU Cems Schicht, nicht irgendeine: nach dem Neuaufbau der
       Buehne liegt auch Beas PNG wieder da, und das waere ein
       stillschweigend falsches Messobjekt. */
    const platzNr = await pg.evaluate(() => {
      const p = [...document.querySelectorAll(".lc-platz")].filter((x) =>
        ((x.querySelector(".lc-platz-name") || {}).textContent || "")
          .toLowerCase().indexOf("cem") >= 0)[0];
      return p ? p.dataset.lcPlatz : "";
    });
    if (!platzNr) return null;
    const stelle = await pg.$('.lc-platz[data-lc-platz="' + platzNr + '"] .lc-sprayfarbe-bild');
    if (!stelle) return null;
    const farben = [];
    for (let i = 0; i < 12; i++) {
      const foto = await stelle.screenshot();
      fs.writeFileSync(TMP, foto);
      let roh;
      try {
        roh = execFileSync(FFMPEG, ["-v", "quiet", "-i", TMP, "-f", "rawvideo",
          "-pix_fmt", "rgb24", "-"], { maxBuffer: 1e8 });
      } catch (e) { return { grund: "ffmpeg fehlt" }; }
      let r = 0, b = 0, n = 0;
      for (let k = 0; k < roh.length; k += 3) { r += roh[k]; b += roh[k + 2]; n++; }
      farben.push(r > b * 1.4 ? "rot" : b > r * 1.4 ? "blau" : "grau");
      await pg.waitForTimeout(150);
    }
    return { farben: farben, verschiedene: [...new Set(farben)].length };
  })();
  sage(bewegt && bewegt.farben
    && bewegt.farben.indexOf("rot") >= 0 && bewegt.farben.indexOf("blau") >= 0,
    "und es laeuft weiter \u2014 das Bild wechselt seine Farbe",
    bewegt ? (bewegt.grund || (bewegt.farben || []).join(" ")) : "-");

  console.log("\nUND SCHON WAEHREND DES SPRUEHENS\n");
  /* XANDER: „es muss in seinen Pixeln genauso aufgespruecht werden
     selbst ein gif sogar."
     GEMESSEN, vorher: die bleibende Schicht bewegte sich — die
     SPRUEHSCHICHT aber nicht. Sie war eine Leinwand, in die das Bild
     mit „drawImage" gezeichnet wurde, und der Standard schreibt vor,
     dass „drawImage" bei einem bewegten Bild immer das ERSTE
     Einzelbild nimmt. Ein GIF stand also die ganzen 1,7 Sekunden des
     Spruehens still. Gemessen wird deshalb dasselbe wie oben, nur
     frueher: Bildschirmfotos der Spruehschicht, WAEHREND sie
     entsteht. */
  const beim = await (async () => {
    const platzNr = await pg.evaluate(async (u) => {
      window.DMA_PRUEF.effektBuehne();
      await new Promise((f) => setTimeout(f, 260));
      const p = [...document.querySelectorAll(".lc-platz")].filter((x) =>
        ((x.querySelector(".lc-platz-name") || {}).textContent || "")
          .toLowerCase().indexOf("dana") >= 0)[0];
      window.DMA_PRUEFUNG.wirkung("spray", "Dana", "Alex", { stueck: u });
      return p ? p.dataset.lcPlatz : "";
    }, eigen + "/werkzeug/pruefbild-blink.gif");
    if (!platzNr) return null;
    const wahl = '.lc-platz[data-lc-platz="' + platzNr + '"] .lc-spray-lack-bild';
    let stelle = null;
    for (let i = 0; i < 24 && !stelle; i++) {
      stelle = await pg.$(wahl);
      if (!stelle) await pg.waitForTimeout(80);
    }
    if (!stelle) return { grund: "keine Spruehschicht gefunden" };
    const farben = [], tropfen = [];
    for (let i = 0; i < 10; i++) {
      tropfen.push(await pg.evaluate((w) => {
        const b = document.querySelector(w);
        if (!b) return -1;
        /* NICHT ueber die id aus „style.clipPath" suchen: der Browser
           gibt den Wert als url("#name") MIT Anfuehrungszeichen zurueck,
           und dann findet getElementById nichts — das waere ein Fehler
           der Sonde, kein Fehler des Produkts. Die Schablone haengt in
           derselben Huelle, also wird sie dort direkt geholt. */
        const c = b.parentNode && b.parentNode.querySelector("clipPath");
        return c ? c.children.length : 0;
      }, wahl));
      let foto;
      try { foto = await stelle.screenshot(); } catch (e) { break; }
      fs.writeFileSync(TMP, foto);
      let roh;
      try {
        roh = execFileSync(FFMPEG, ["-v", "quiet", "-i", TMP, "-f", "rawvideo",
          "-pix_fmt", "rgba", "-"], { maxBuffer: 1e8 });
      } catch (e) { return { grund: "ffmpeg fehlt" }; }
      let r = 0, b = 0, n = 0;
      for (let k = 0; k < roh.length; k += 4) {
        if (roh[k + 3] < 40) continue;
        r += roh[k]; b += roh[k + 2]; n++;
      }
      farben.push(!n ? "leer" : r > b * 1.4 ? "rot" : b > r * 1.4 ? "blau" : "grau");
      await pg.waitForTimeout(130);
    }
    return { farben: farben, tropfen: tropfen };
  })();
  sage(beim && beim.tropfen && beim.tropfen.some((x) => x > 0)
    && beim.tropfen[beim.tropfen.length - 1] > beim.tropfen[0],
    "die Tropfen werden waehrend des Spruehens mehr, nicht alle auf einmal",
    beim ? (beim.grund || (beim.tropfen || []).join(" \u2192 ")) : "-");
  sage(beim && beim.farben
    && beim.farben.indexOf("rot") >= 0 && beim.farben.indexOf("blau") >= 0,
    "und das GIF laeuft schon dabei \u2014 es wechselt seine Farbe",
    beim ? (beim.grund || (beim.farben || []).join(" ")) : "-");

  console.log("\nEIN BILD VON FREMDER HERKUNFT (wie bei GIPHY)\n");
  const weit = await spruehen(fremd + "/pruefbild-viertel.png", "Dana");
  sage(weit.bleibt, "auch ein fremdes Bild wird wirklich aufgespruecht",
    weit.quelle.slice(0, 50) || "nichts");
  sage(weit.quelle.indexOf(fremd) === 0,
    "und es bleibt als das fremde Bild liegen");

  console.log("\nUND ES UEBERLEBT EIN NEUZEICHNEN\n");
  const nachher = await pg.evaluate(async () => {
    if (window.DMA_PRUEF.auffrischen) window.DMA_PRUEF.auffrischen();
    await new Promise((f) => setTimeout(f, 400));
    const zaehlen = (wer) => {
      const p = [...document.querySelectorAll(".lc-platz")].filter((x) =>
        ((x.querySelector(".lc-platz-name") || {}).textContent || "")
          .toLowerCase().indexOf(wer) >= 0)[0];
      const b = p && p.querySelector(".lc-sprayfarbe-bild");
      return b ? (b.classList.contains("lc-sprayfarbe-eigen") ? "eigen" : "gemalt") : "weg";
    };
    return { bea: zaehlen("bea"), cem: zaehlen("cem"), dana: zaehlen("dana") };
  });
  sage(nachher.bea === "eigen" && nachher.cem === "eigen" && nachher.dana === "eigen",
    "alle drei liegen nach dem Neuzeichnen noch da, und als eigenes Bild",
    JSON.stringify(nachher));

  await br.close(); s1.close(); s2.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
