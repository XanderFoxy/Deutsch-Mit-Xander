/* =====================================================================
   SONDE RUNDE 87 — DIE STRICHLINIEN, ALLE AUF EINMAL
   ---------------------------------------------------------------------
   XANDER: „auch die Inkonsistenzen der Strichlinien, die immer noch da
   sind" und „keine Design-Inkonsistenzen mehr übrig, wenn man den Platz
   verlässt … dass das Profilbild verkleinert wird beim Verlassen des
   Platzes."

   WARUM DIESE SONDE NEU IST, obwohl es pruefe-platzdesign.js schon
   gibt: die alte prüft ZWÖLF ausgesuchte Effekte. Solange eine Sonde
   nur zwölf prüft, findet sie den dreizehnten nie — und genau dort
   sitzt der Rest. Diese hier geht über ALLE Wirkungen, die einem Platz
   gelten, und über ALLE Reisen.

   Drei Regeln, und sie gelten ausnahmslos:
     1. Das Schild (die gestrichelte Linie mit der Platznummer) darf
        sich nicht bewegen, nicht wachsen, nicht schrumpfen und nicht
        verblassen. Es ist das DESIGN des Platzes, nicht Teil der
        Animation.
     2. Der Name unter dem Platz genauso.
     3. Beim Verlassen darf das Profilbild nicht KLEINER werden. Wer
        wegfliegt, fliegt in voller Größe weg; verschwinden darf es,
        schrumpfen nicht.
   Wer künftig einen Effekt baut, der eines davon anfasst, fällt hier
   auf.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".opus": "audio/ogg", ".m4a": "audio/mp4", ".mp3": "audio/mpeg" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 87 — die Strichlinien bei JEDEM Effekt");
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
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEFUNG && window.DMA_PRUEF
    && window.DMA_PRUEF.platzWirkungen, { timeout: 20000 });

  const wirkungen = await pg.evaluate(() => window.DMA_PRUEF.platzWirkungen());
  const reisen = await pg.evaluate(() => window.DMA_PRUEF.reiseArten());
  console.log("  " + wirkungen.length + " Platz-Wirkungen und " + reisen.length + " Reisen\n");

  /* Ein Durchgang: Buehne bauen, messen, Effekt ausloesen, dreimal
     nachmessen (Anfang, Mitte, Ende der Bewegung). */
  const durchgang = (art, istReise) => pg.evaluate(async ([a, reise]) => {
    document.querySelectorAll(".lc-zp, .lc-sprechfeld, .lc-reise, .lc-greif, .lc-riesenhand")
      .forEach((x) => x.remove());
    window.DMA_PRUEF.effektBuehne();
    const plaetze = [...document.querySelectorAll(".lc-platz")];
    /* =============================================================
       RUNDE 88 \u2014 DIE SONDE HAT DEN FALSCHEN PLATZ GEMESSEN
       -------------------------------------------------------------
       XANDER, und zwar jedes Mal ueber DENSELBEN Platz: \u201ewenn der
       Frosch wieder weg huepft, glitcht die Strichlinie VOM
       VERLASSENEN PLATZ auch wieder und die Nummer \u2026 beim Maulwurf
       klatscht DER LETZTE PLATZ wieder, DEN ER VERLAESST \u2026 das Boot
       hinterlaesst ein Glitch IM VERLASSENEN ORT."

       HIER WAR DER FEHLER, und er lag in der Sonde, nicht in der
       Seite: gemessen wurde immer plaetze[1] \u2014 Bea. Bei einer
       Reise ist Bea aber das ZIEL: window.DMA_PRUEFUNG.wirkung(art,
       \u201eBea", \u201eAlex") heisst \u201eAlex reist zu Bea", und lcReise
       nimmt \u201evon" als Startplatz (lcPlatzMitNamen(von)). Die Sonde
       hat also 150 Effekte lang den ANKUNFTSPLATZ geprueft und den
       verlassenen nie angesehen. Deshalb stand sie auf gruen,
       waehrend er den Glitch sah.
       Jetzt werden BEIDE gemessen \u2014 der verlassene Platz (Alex,
       plaetze[0]) zuerst, denn ueber den hat er geschrieben. */
    const plAb = plaetze[0];                     /* Alex, Platz 1 \u2014 wird VERLASSEN */
    const plZu = plaetze[1];                     /* Bea, Platz 2 \u2014 das Ziel */
    const lies = (pl) => {
      const sch = pl.querySelector(".lc-schild");
      const nam = pl.querySelector(".lc-platz-name");
      const nr = pl.querySelector(".lc-nummer");
      const kr = pl.querySelector(".lc-kreis");
      const r = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        const st = getComputedStyle(el);
        return { x: Math.round(b.left), y: Math.round(b.top),
                 b: Math.round(b.width), h: Math.round(b.height),
                 deck: Math.round(Number(st.opacity) * 100) / 100,
                 sicht: st.visibility, zeigt: st.display };
      };
      /* Die Groesse des Kreises AUS SEINER MATRIX — die Randbox
         waere durch Drehungen verfaelscht. */
      let kreisGr = 1;
      if (kr) {
        const m = getComputedStyle(kr).transform;
        const z = m && m.match(/matrix\(([^)]+)\)/);
        if (z) {
          const p2 = z[1].split(",").map(Number);
          kreisGr = Math.round(Math.hypot(p2[0], p2[1]) * 100) / 100;
        }
      }
      /* =============================================================
         RUNDE 88 \u2014 DIE RUECKSTAENDE, UND SIE SIND DER EIGENTLICHE PUNKT
         -------------------------------------------------------------
         XANDER: „Merk dir fuer zukuenftige Animationen, dass NIEMALS
         nach Verlassen des Platzes irgendwelche Art von Rueckstaenden
         von meinem Profilbild da sind \u2026 Ausserdem sind die
         Rueckstaende noch in der Strichlinie zu sehen und der Zahl \u2014
         so was soll generell bei Animationen vermieden werden."
         Die Sonde hat bis hierher nur GEOMETRIE gemessen: wo steht
         das Schild, wie gross ist es, wie durchsichtig. Ein
         Rueckstand ist aber etwas anderes \u2014 ein Element, das
         liegenbleibt, eine Klasse, die haengenbleibt, ein Stil, der
         nicht zurueckgenommen wird. Genau das steht hier jetzt
         daneben, und zwar so, dass es sich mit dem Zustand VOR dem
         Effekt vergleichen laesst. */
      /* Gezaehlt wird nach TAG und GRUNDKLASSE, nicht nach der ganzen
         Klassenliste: ein Kreis, an den ein Effekt eine Klasse haengt,
         ist derselbe Kreis und kein neues Kind. Sonst meldet die Sonde
         zweimal dasselbe („verschwunden: span.lc-kreis" plus
         „liegengeblieben: span.lc-kreis lc-birne-an"), und was
         wirklich passiert ist — eine Klasse mehr — steht drei Zeilen
         weiter unten noch einmal. */
      const kinder = [...pl.children].map((el) => {
        const k = el.classList && el.classList.length ? el.classList[0] : "";
        return el.tagName.toLowerCase() + (k ? "." + k : "");
      }).sort().join("|");
      return { schild: r(sch), name: r(nam), nummer: r(nr), kreisGr: kreisGr,
               unterwegs: pl.classList.contains("lc-platz-unterwegs"),
               kinder: kinder,
               klassen: [...pl.classList].sort().join(" "),
               kreisKlassen: kr ? [...kr.classList].sort().join(" ") : "",
               kreisStil: kr ? String(kr.getAttribute("style") || "") : "",
               kreisFormel: kr ? getComputedStyle(kr).transform : "",
               kreisDeck: kr ? Math.round(Number(getComputedStyle(kr).opacity) * 100) / 100 : 1 };
    };
    const vorherAb = lies(plAb);
    const vorher = lies(plZu);
    try {
      if (reise) window.DMA_PRUEFUNG.wirkung(a, "Bea", "Alex", {});
      else window.DMA_PRUEFUNG.wirkung(a, "Bea", "Alex", {});
    } catch (e) { return { krach: String(e && e.message) }; }
    /* =============================================================
       RUNDE 88 — BIS ZUM ENDE MESSEN, NICHT NUR BIS ZUR MITTE
       -------------------------------------------------------------
       XANDER: „wenn der Frosch wieder weg huepft, glitcht die
       Strichlinie vom verlassenen Platz auch wieder und die Nummer …
       beim Maulwurf klatscht der letzte Platz wieder, den er
       verlaesst … der Kran glitcht den Platz auch noch … das Boot
       hinterlaesst einen Glitch im verlassenen Ort … die Reise mit
       der Roehre laesst auch einen Glitch."
       Gemessen wurde bisher bei 260, 900 und 1700 ms — also in der
       MITTE der Bewegung. Genau das, was er sieht, passiert aber am
       ENDE: wenn aufgeraeumt wird, wenn der Platz neu gezeichnet
       wird, wenn der Reisende ankommt. Eine Sonde, die bei 1,7 s
       aufhoert, kann das gar nicht finden.
       Jetzt laeuft sie bis 7 Sekunden mit — laenger als die laengste
       Reise (6,2 s beim Licht). */
    const proben = [];
    const probenAb = [];
    let stand = 0;
    /* RUNDE 88 — 8000 STATT 7000, UND ZWAR GERECHNET: der laengste
       Effekt am Platz ist die Schneekugel mit 7200 ms (lcAmPlatz
       raeumt genau dann auf). Bei 7000 ms gemessen, lag sie noch da
       und galt als Rueckstand — ein Fehlalarm der Sonde, kein Fehler
       der Seite. Die letzte Probe liegt deshalb 800 ms NACH dem
       Aufraeumen des laengsten Effekts. */
    for (const w of [260, 900, 1700, 2600, 3600, 5000, 7000, 8000]) {
      await new Promise((f) => setTimeout(f, w - stand));
      stand = w;
      proben.push(Object.assign({ t: w }, lies(plZu)));
      probenAb.push(Object.assign({ t: w }, lies(plAb)));
    }
    return { vorher: vorher, proben: proben,
             vorherAb: vorherAb, probenAb: probenAb };
  }, [art, istReise]);

  const gleich = (a, b, feld) => a && b && a[feld] !== undefined && b[feld] !== undefined;
  /* Eine Messreihe an EINEM Platz pruefen. „wo" sagt nur, welcher es
     war — damit in der Meldung steht, ob der verlassene oder der
     angesteuerte Platz geglitcht hat. */
  const pruefeReihe = (art, v, proben, wo) => {
    const schlimm = [];
    const grabend = /maulwurf/.test(art);
    proben.forEach((p) => {
      ["schild", "name", "nummer"].forEach((teil) => {
        const a = v[teil], b = p[teil];
        if (!a || !b) return;
        /* Der Maulwurf darf — siehe unten. Nur die letzte Probe zaehlt
           bei ihm: da muss alles wieder stehen, wo es stand. */
        if (grabend && p.t < 8000) return;
        const sag = (t) => schlimm.push(wo + " " + p.t + "ms " + t);
        if (Math.abs(a.x - b.x) > 1 || Math.abs(a.y - b.y) > 1) {
          sag(teil + " verschoben um " + (b.x - a.x) + "/" + (b.y - a.y) + " px");
        }
        if (Math.abs(a.b - b.b) > 1 || Math.abs(a.h - b.h) > 1) {
          sag(teil + " Groesse " + a.b + "x" + a.h + " -> " + b.b + "x" + b.h);
        }
        if (b.deck < a.deck - 0.02) {
          sag(teil + " blasser (" + a.deck + " -> " + b.deck + ")");
        }
        /* AUSNAHME, und sie ist seine eigene: „mein Platz, der
           verlassen wird, traegt noch meinen Namen — der soll
           natuerlich auch nicht mehr da stehen" (Runde 85). Waehrend
           einer Reise DARF der Name also verschwinden. Schild und
           Nummer duerfen es nie. */
        const reistGerade = p.unterwegs && teil === "name";
        /* ZWEITE AUSNAHME, RUNDE 88: „Die Striche und Positionsnummer
           soll immer von jeglicher Animation ausbleiben, es sei denn,
           ich sag es ausdruecklich wie zum Beispiel beim
           Maulwurfhuegel."
           Fuer Pac-Man hat er es ausdruecklich gesagt: „die
           Futterpunkte muessen exakt im Zentrum der Zahlen liegen, und
           in dem Moment braucht man auch keine Zahlen zu sehen, damit
           das wie das klassische Spiel aussieht."
           Die Zahl wird dabei nur UNSICHTBAR, nicht ausgebaut und
           nicht bewegt. */
        const pacZahl = /pacjagd/.test(art) && teil === "nummer";
        if (!reistGerade && !pacZahl && (b.sicht !== a.sicht || b.zeigt !== a.zeigt)) {
          sag(teil + " " + a.sicht + "/" + a.zeigt + " -> " + b.sicht + "/" + b.zeigt);
        }
      });
    });
    /* UND JETZT DIE RUECKSTAENDE \u2014 gemessen bei 7000 ms, also lange
       nachdem die laengste Reise (6,2 s) zu Ende ist. Was dann noch
       anders ist als vorher, ist liegengeblieben. */
    const letzte = proben[proben.length - 1];
    /* DIE EINE AUSNAHME BEIM AUFRAEUMEN, und sie ist seine eigene:
       „sollen die Kopfhoerer auch so lange auf der Person bleiben, bis
       sie sie von SELBER abnimmt." Der Kopfhoerer ist deshalb mit
       600 Sekunden angemeldet und liegt absichtlich noch da. Alles
       andere muss weg sein. */
    /* WAS ABSICHTLICH LIEGEN BLEIBT — und zwar, weil er es so wollte:
         kopfhoerer  „sollen die Kopfhoerer auch so lange auf der
                      Person bleiben, bis sie sie von SELBER abnimmt"
         gluehbirne  „es kann nicht sein, wenn man Birne anmacht, dass
                      beim zweiten Betaetigen die Birne ausgeht" — sie
                      brennt weiter, bis jemand sie herausdreht
                      (/birneraus)
         anziehen    „was man jemandem aufsetzt, hat er an, bis es
                      jemand abnimmt"
         spray       RUNDE 92, und er hat es zweimal gesagt: „das mit
                      dem Gesicht einspruehen — und dass es bleibt, die
                      ganze Zeit, ungeachtet davon, ob man es durch
                      Klicken aufs eigene Profilbild resettet. Es geht
                      nur durch den Scheibenwischer wieder weg."
                      Der Lack ist deshalb kein Rueckstand, sondern das
                      ERGEBNIS. Der Wischer (/wischer) nimmt ihn ab —
                      und dass er das tut, misst
                      werkzeug/pruefe-runde92-lack.js.
       Alles andere muss nach dem Effekt weg sein. */
    /* RUNDE 98 — dazu der Hammer: ab dem sechsten Schlag zerfaellt das
       Bild, und der Scherbenhaufen BLEIBT liegen. XANDER: „Ansonsten
       bleibt der Scherbenhaufen immer unten, nachdem man jemanden mit
       dem Hammer kaputt gemacht hat." Heil macht es nur „/pflaster" —
       und dass es das tut, misst werkzeug/pruefe-runde98-hammer.js. */
    const bleibt = /kopfhoerer|gluehbirne|birne|anziehen|ausziehen|spray|lack|hammer|pflaster/.test(art);
    if (letzte && !bleibt) {
      const nenn = (t) => schlimm.push(wo + " danach " + t);
      if (letzte.kinder !== v.kinder) {
        const vorher = (v.kinder || "").split("|").filter(Boolean);
        const jetzt = (letzte.kinder || "").split("|").filter(Boolean);
        const rest = jetzt.slice();
        vorher.forEach((k) => { const i = rest.indexOf(k); if (i >= 0) rest.splice(i, 1); });
        const fehlt = vorher.slice();
        jetzt.forEach((k) => { const i = fehlt.indexOf(k); if (i >= 0) fehlt.splice(i, 1); });
        if (rest.length) nenn("liegengeblieben: " + rest.join(", "));
        if (fehlt.length) nenn("verschwunden: " + fehlt.join(", "));
      }
      if (letzte.klassen !== v.klassen) {
        nenn("Klasse am Platz: \u201e" + v.klassen + "\u201c -> \u201e" + letzte.klassen + "\u201c");
      }
      if (letzte.kreisKlassen !== v.kreisKlassen) {
        nenn("Klasse am Bild: \u201e" + v.kreisKlassen + "\u201c -> \u201e" + letzte.kreisKlassen + "\u201c");
      }
      if (letzte.kreisStil !== v.kreisStil) {
        nenn("Stil am Bild: \u201e" + v.kreisStil + "\u201c -> \u201e" + letzte.kreisStil + "\u201c");
      }
      if (letzte.kreisFormel !== v.kreisFormel) {
        nenn("das Bild steht schief/verschoben: " + letzte.kreisFormel);
      }
      if (Math.abs(letzte.kreisGr - v.kreisGr) > 0.02) {
        nenn("das Bild ist " + letzte.kreisGr + " statt " + v.kreisGr + " gross");
      }
      if (letzte.kreisDeck < v.kreisDeck - 0.02) {
        nenn("das Bild ist blasser (" + v.kreisDeck + " -> " + letzte.kreisDeck + ")");
      }
    }
    return schlimm;
  };

  /* DRITTE AUSNAHME, RUNDE 88, und sie ist die, die er beim Namen
     genannt hat: „… es sei denn, ich sag es ausdruecklich WIE ZUM
     BEISPIEL BEIM MAULWURFHUEGEL." Und ausdruecklich gesagt hat er
     es: „die Strichlinie auch ein bisschen mit aufgraben … das kann
     auch das Layout von den Plaetzen ein bisschen zerstoeren",
     „dort sollen die Plaetze richtig aufgebrochen werden", „wenn es
     leere Plaetze sind, dann sollen die Strichlinie und Zahlen
     durcheinandergebracht werden, also dass da wirklich das mit sich
     umkippt realistisch."
     Beim Maulwurf ist das Verruecken also das GEWOLLTE. Dass es
     wirklich passiert, prueft werkzeug/pruefe-runde88-maulwurf.js;
     hier bleibt nur die Bedingung, die auch dort gilt: hinterher
     steht wieder alles, wo es stand (deshalb oben p.t < 7000). */
  const pruefeEinen = (art, m, istReise) => {
    if (!m || m.krach) { sage(false, art + ": Absturz", m && m.krach); return; }
    const schlimm = pruefeReihe(art, m.vorher, m.proben, "Ziel");
    /* UND DER VERLASSENE PLATZ — der, ueber den er jedes Mal
       geschrieben hat. Bei einer Wirkung, die genau einem Platz gilt,
       gibt es keinen verlassenen; dort wird er trotzdem gemessen, denn
       ein Effekt an Bea hat an Alex' Schild gar nichts zu suchen. */
    pruefeReihe(art, m.vorherAb, m.probenAb || [], "verlassen")
      .forEach((x) => schlimm.push(x));
    /* XANDER: „dass das Profilbild verkleinert wird beim START des
       Verlassens des Platzes."
       DIE REGEL GILT NUR DAFUER, und das ist wichtig: bei manchen
       Wirkungen IST das Bild der Ball — beim Tennis fliegt es weg und
       wird dabei kleiner, und das ist richtige Perspektive, kein
       Fehler. Geprueft wird deshalb nur der ANFANG (die erste Probe)
       und nur bei Reisen — und ab Runde 88 am RICHTIGEN Platz: am
       verlassenen. Vorher stand hier m.proben[0], also das Ziel; dort
       steht das Bild ohnehin still, und die Regel hat nie etwas
       gemessen. */
    const ersteAb = (m.probenAb || [])[0];
    if (istReise && ersteAb && ersteAb.kreisGr < 0.97) {
      schlimm.push("beim Verlassen ist das Profilbild auf "
        + ersteAb.kreisGr + " geschrumpft");
    }
    sage(schlimm.length === 0, art, schlimm.slice(0, 4).join("; "));
  };

  console.log("A) Die Wirkungen, die genau einem Platz gelten\n");
  for (const art of wirkungen) pruefeEinen("/" + art, await durchgang(art, false), false);

  console.log("\nB) Die Reisen — dabei verlaesst das Bild seinen Platz\n");
  for (const art of reisen) pruefeEinen("/" + art, await durchgang(art, true), true);

  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " FEHLER" : "alles gruen"));
  process.exit(fehler ? 1 : 0);
})();
