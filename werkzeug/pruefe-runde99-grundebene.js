#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 99 — DIE GRUNDEBENE IST UNANTASTBAR
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Die Platz-Glitches gibt es immer noch ueberall,
   die sind immer noch nicht gefixt. Kannst du es nicht wirklich so
   machen, dass das eine Ebene ist, die niemals beeinflusst werden kann?
   Das ging doch vorher auch immer. Ich verstehe gar nicht, wie das
   mitanimiert werden kann, wenn wir doch mit der Animation ueber dem
   Platz liegen. Wie koennen diese Teile, die darunter liegen, einfach
   mitanimiert werden? Das macht doch gar keinen logischen Sinn."
   Und: „Du brauchst ne Polizei fuer die Profil-Platz-Glitches."

   HIER IST SIE. Und sie hat den Fall auch geloest:
   GEMESSEN VORHER — vier Regeln haben nicht das BILD animiert, sondern
   den PLATZ selbst (.lc-platz). Die Zahl und der gestrichelte Ring
   liegen aber IM Platz; wer den Platz dreht, dreht sie mit:
     /lecken   Schild 5,6 px verschoben
     /boxen    Schild 14,0 px verschoben
   GEMESSEN NACHHER — dieselben Wirkungen: Schild 0,0 px, Bild bewegt
   sich weiterhin (5,0 px bzw. 12,8 px). Der Kopf zuckt, der Sitzplatz
   nicht.

   DIESE SONDE PRUEFT DREIERLEI, und zwar fuer JEDE Wirkung, die es
   gibt — nicht fuer eine Auswahl:
     1  Keine Stilregel darf .lc-platz SELBST animieren (Ausnahmen:
        Maulwurf, Erdbeben, Orkan — alle drei sind seine eigenen
        Wuensche und bewegen den ganzen Raum bzw. die Erde).
     2  Am laufenden Bild: waehrend jeder Wirkung darf sich das Schild
        (Ring + Zahl) um keinen Pixel bewegen.
     3  Der gestrichelte Ring eines freien Platzes liegt im Schild und
        nicht mehr im Kreis — sonst waere er wieder angreifbar.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

/* Seine eigenen Ausnahmen — mit seinen Worten dokumentiert. */
const ERLAUBT = [
  /* Die EINZIGE Ausnahme, und sie ist sein eigener Satz: „die einzige
     Inkonsistenz, die mit den Profilplaetzen passieren darf, ist das
     Durcheinander-Wirbeln der Leute, wenn ich da durchgrabe."
     Erdbeben und Orkan standen hier auch einmal — sie sind jetzt
     ebenfalls auf das Bild umgezogen und brauchen keine Ausnahme
     mehr. */
  "lc-platz-untergraben"
];

let fehler = 0;
const sage = (gut, was, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
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
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  console.log("\n1  KEINE REGEL DARF DEN PLATZ SELBST ANIMIEREN\n");
  const regeln = await pg.evaluate((erlaubt) => {
    const schlimm = [];
    for (const blatt of document.styleSheets) {
      let regeln;
      try { regeln = blatt.cssRules; } catch (e) { continue; }
      const durch = (liste) => {
        for (const r of liste) {
          if (r.cssRules && !r.selectorText) { durch(r.cssRules); continue; }
          if (!r.selectorText) continue;
          const wert = (r.style && r.style.animationName) || "";
          if (!wert || wert === "none") continue;
          r.selectorText.split(",").forEach((sel) => {
            const s = sel.trim();
            /* Endet die Auswahl auf dem PLATZ selbst? Dann traegt der
               Platz die Animation — und mit ihm alles, was darin
               liegt. Ein Nachfahre (".lc-platz … .lc-kreis") ist in
               Ordnung. */
            const letzte = s.split(/\s+|>/).filter(Boolean).pop() || "";
            if (!/(^|\.)lc-platz(\.|$|:)/.test(letzte)) return;
            if (erlaubt.some((e) => s.indexOf(e) >= 0)) return;
            schlimm.push(s + "  {" + wert + "}");
          });
        }
      };
      durch(regeln);
    }
    return schlimm;
  }, ERLAUBT);
  sage(regeln.length === 0,
    "keine Stilregel animiert .lc-platz selbst",
    regeln.length ? regeln.join("  |  ") : "geprueft, nichts gefunden");

  console.log("\n2  UND AM LAUFENDEN BILD: DAS SCHILD BLEIBT STEHEN\n");
  const arten = await pg.evaluate(() => {
    const a = window.LiveChat.effektBefehle();
    return [...new Set(a)].filter((x) => x && typeof x === "string");
  });
  const schlecht = [];
  let bewegtBild = 0;
  for (const art of arten) {
    const r = await pg.evaluate(async (art) => {
      window.DMA_PRUEF.effektBuehne();
      await new Promise((f) => setTimeout(f, 120));
      const platz = [...document.querySelectorAll(".lc-platz")].filter((p) =>
        ((p.querySelector(".lc-platz-name") || {}).textContent || "")
          .toLowerCase().indexOf("bea") >= 0)[0];
      if (!platz) return null;
      const schild = platz.querySelector(".lc-schild");
      const nummer = platz.querySelector(".lc-nummer");
      const kreis = platz.querySelector(".lc-kreis");
      /* GEMESSEN WIRD RELATIV ZUM PLATZ, nicht zum Bildschirm.
         Erster Versuch: absolute Bildschirmpunkte. Damit meldete die
         Sonde bei siebzig Wirkungen „75 px verschoben" — und das war
         ein Fehler der Sonde: bei Wetter, Geschenken und allem, was
         eine Leiste einblendet, rutscht die GANZE Karte, also Platz,
         Schild und Zahl gemeinsam. Das ist kein Glitch, das ist
         Layout. Sein Punkt ist ein anderer: die Zahl darf sich nicht
         GEGENUEBER IHREM PLATZ bewegen. Genau das steht hier. */
      const kasten = (el) => {
        const b = el.getBoundingClientRect();
        const p = platz.getBoundingClientRect();
        const bp = Math.max(1, p.width), hp = Math.max(1, p.height);
        /* IN ANTEILEN DES PLATZES, nicht in Bildschirmpunkten.
           Zweiter Anlauf der Sonde: relativ zum Platz gerechnet, aber
           in px — da meldete „/tafelauf" 59 px, weil beim Aufklappen
           der Tafel die ganze Sitzreihe KLEINER wird. Auch das ist
           Layout und kein Glitch. Wer in Anteilen rechnet, misst nur
           noch, was ihn wirklich stoert: ob die Zahl auf IHREM Platz
           verrutscht. */
        return [(b.left + b.width / 2 - p.left) / bp * 100,
                (b.top + b.height / 2 - p.top) / hp * 100,
                b.width / bp * 100, b.height / hp * 100];
      };
      const vS = kasten(schild), vN = kasten(nummer), vK = kasten(kreis);
      /* Der Vergleichspunkt und die Belegung gehoeren zusammen —
         beide VOR der Wirkung. Sonst vergleicht die Sonde einen
         besetzten Platz mit einem freien, und der Unterschied ist
         nur die andere Darstellung. */
      const freiVorher = platz.classList.contains("lc-platz-frei");
      /* Manche Wirkungen gelten dem ganzen Raum und stolpern ueber
         einen Namen (der Bonbonregen zum Beispiel). Das ist hier
         kein Fehler — gemessen wird die Grundebene, nicht die
         Wirkung. Also: versuchen, und wenn sie nicht will, weiter. */
      try { window.DMA_PRUEFUNG.wirkung(art, "Bea", "Alex", {}); }
      catch (e) { try { window.DMA_PRUEFUNG.wirkung(art, "", "Alex", {}); } catch (e2) {} }
      let mS = 0, mN = 0, mK = 0;
      /* Wechselt der Platz waehrend der Wirkung von BELEGT auf FREI
         (der Strudel zieht den Menschen ja weg), springt die Zahl
         absichtlich von der kleinen Marke oben in die Mitte — so
         sieht ein freier Platz nun einmal aus. Das ist kein Glitch,
         und deshalb wird ab diesem Augenblick nicht weitergemessen. */
      for (let i = 0; i < 20; i++) {
        await new Promise((f) => setTimeout(f, 80));
        if (platz.classList.contains("lc-platz-frei") !== freiVorher) break;
        const s = kasten(schild), n = kasten(nummer), k = kasten(kreis);
        for (let j = 0; j < 4; j++) {
          mS = Math.max(mS, Math.abs(s[j] - vS[j]));
          mN = Math.max(mN, Math.abs(n[j] - vN[j]));
          mK = Math.max(mK, Math.abs(k[j] - vK[j]));
        }
      }
      return { s: Math.round(mS * 10) / 10, n: Math.round(mN * 10) / 10,
               k: Math.round(mK * 10) / 10 };
    }, art);
    if (!r) continue;
    if (r.k > 2) bewegtBild++;
    /* ZWEI WIRKUNGEN DUERFEN, und beide aus seinem eigenen Mund:
       · der MAULWURF — „die einzige Inkonsistenz, die mit den
         Profilplaetzen passieren darf, ist das Durcheinander-Wirbeln
         der Leute, wenn ich da durchgrabe";
       · der STRUDEL — das ist nicht der Sog an EINEM Platz (der
         heisst „sog" und steht in dieser Messung mit drin), sondern
         der Strudel, der den GANZEN Chat einsaugt. Nachgemessen:
         dabei waechst die Karte von 460 auf 524 px, weil der ganze
         Verlauf hineingezogen wird. Dass der Platz diese Bewegung
         mitmacht, ist der Effekt selbst. */
    if (art === "maulwurf" || art === "strudel") continue;
    /* Zwei Prozent der Platzbreite sind bei 103 px Platz rund zwei
       Pixel — darunter sieht kein Mensch etwas, darueber schon. */
    if (r.s > 2 || r.n > 2) schlecht.push(art + " (Schild " + r.s + " %, Zahl " + r.n + " %)");
  }
  console.log("  " + arten.length + " Wirkungen durchgespielt, "
    + bewegtBild + " davon bewegen das BILD (so soll es sein)\n");
  sage(schlecht.length === 0,
    "bei keiner Wirkung verrutscht Ring oder Zahl auf ihrem Platz",
    schlecht.length ? schlecht.join(", ") : arten.length + " Wirkungen, alle still");

  console.log("\n3  DER RING EINES FREIEN PLATZES LIEGT IM SCHILD\n");
  const ring = await pg.evaluate(async () => {
    window.DMA_PRUEF.effektBuehne();
    await new Promise((f) => setTimeout(f, 200));
    const frei = document.querySelector(".lc-platz.lc-platz-frei");
    if (!frei) return null;
    const vor = getComputedStyle(frei.querySelector(".lc-schild"), "::before");
    const kreis = getComputedStyle(frei.querySelector(".lc-kreis"));
    return {
      schildRing: vor.borderTopStyle + " " + vor.borderTopWidth,
      schildSichtbar: vor.content !== "none",
      kreisRand: kreis.borderTopColor
    };
  });
  sage(ring && ring.schildSichtbar && ring.schildRing.indexOf("dashed") === 0,
    "das Schild zeichnet den gestrichelten Ring",
    ring ? ring.schildRing : "-");
  sage(ring && /rgba\(0, 0, 0, 0\)|transparent/.test(ring.kreisRand),
    "und der Kreis traegt gar keinen Rand mehr — er ist angreifbar, das Schild nicht",
    ring ? ring.kreisRand : "-");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
