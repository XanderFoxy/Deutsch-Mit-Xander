#!/usr/bin/env node
/* =========================================================
   RUNDE 15 — WAS ER EINZELN NACHGEFORDERT HAT
   ---------------------------------------------------------
   GEMELDET, woertlich:
   „Also der Pfeil soll stecken bleiben dieser Gummiball an
    dem anderen Profilbild. Man soll so ein Drill haben beim
    Aufprall, so dass er so wackelt und dieses typische
    Geräusch … das Paintball hast du auch noch vergessen …
    der Stromeffekt vom Sprechbild soll realistische Blitze
    machen und nicht so Kreuze … Die Schlagsahne soll richtig
    von einer Sprühdose herauskommen und das richtig
    realistisch aufbauen … dann diese Kirsche oben draufsetzen
    … beim Schneeball soll der Schneeball an die Profilbild
    Seite ran klatschen und an der Seite runterlaufen. Der
    Strudel soll das Profilbild verzerren und nicht einfach
    nur ein Grafikstrudel da drüber sein. Er soll das jeweilige
    Bild was gerade da ist in seinen Pixeln so verschieben,
    dass es so reingestrudelt wird und die Störung ist kein
    Effekt um das Profilbild zu beeinflussen durch einen Klick
    sondern es ist ein Sprechbild-Effekt und der Haken und das
    Lasso sind zwei unterschiedliche Sachen … Aber es soll
    nicht so sein, dass der Haken mich selbst irgendwo hin
    schiebt, ohne einen grafischen Effekt. Ich bleibe an
    meinem Platz … und das mit dem losfahren und mit den
    Spielzügen hast du auch vergessen … Man kann ein Ei auf
    dem Kopf von jemand anderem zuschlagen. Ja das muss immer
    oben drüber dann passieren und der Regen die Tropfen
    fließen auch nicht an dem kreisrunden Rand des
    Profilbilds herunter."

   Jede dieser Ansagen ist hier eine Messung, keine Meinung.
   ========================================================= */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const pruefe = (was, gut, zusatz) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + was + (zusatz ? "   " + zusatz : ""));
};

(async () => {
  /* ---------- ERST DIE DATEIEN: was ohne Browser messbar ist ---------- */
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  const js  = fs.readFileSync(path.join(WURZEL, "app.js"), "utf8");
  const lc  = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");

  console.log("\nDIE TOENE LIEGEN WIRKLICH DA\n");
  ["gummi", "spray", "eiknack", "fahren"].forEach((t) => {
    const o = fs.existsSync(path.join(WURZEL, "ton", t + ".opus"));
    const m = fs.existsSync(path.join(WURZEL, "ton", t + ".m4a"));
    pruefe(t + ": beide Fassungen da (Opus und m4a fuers iPhone)", o && m,
      (o ? "" : "opus fehlt ") + (m ? "" : "m4a fehlt") || "beide");
  });
  const liste = fs.readFileSync(path.join(WURZEL, "data-geraeusche.js"), "utf8");
  pruefe("und sie stehen in data-geraeusche.js",
    ["gummi", "spray", "eiknack", "fahren"].every((t) => liste.indexOf("|" + t + "|") >= 0),
    "sonst sucht die Seite gar nicht erst");

  console.log("\nDER PFEIL BLEIBT STECKEN UND WACKELT AUS\n");
  const pfeilBlock = css.slice(css.indexOf("@keyframes lcPfeilFlug"),
                               css.indexOf("@keyframes lcPfeilNapf"));
  const ausschlaege = (pfeilBlock.match(/var\(--wdreh, 0deg\) [+-] [\d.]+deg/g) || []);
  pruefe("er schwingt gedaempft aus, nicht nur dreimal", ausschlaege.length >= 8,
    ausschlaege.length + " Ausschlaege");
  /* Und werden sie wirklich kleiner? Ein Ausschwingen, das gleich
     bleibt, ist ein Zittern, kein Ausschwingen. */
  const werte = ausschlaege.map((x) => parseFloat(x.split(" ").pop()));
  let faellt = true;
  for (let i = 1; i < werte.length; i++) if (werte[i] > werte[i - 1] + 0.01) faellt = false;
  pruefe("und jeder Ausschlag ist kleiner als der vorige", faellt, werte.join("° > ") + "°");
  pruefe("der Saugnapf drueckt sich platt", /\.lc-pfeil-napf\s*\{[^}]*transform-box:\s*fill-box/.test(css),
    "lc-pfeil-napf mit fill-box");
  pruefe("und der Ton ist Gummi, kein Wasser", /saugpfeil:\s*\{ ton: "gummi"/.test(js));

  console.log("\nDIE SAHNE KOMMT AUS DER DOSE — KIRSCHE ZULETZT\n");
  pruefe("es gibt eine Spruehdose", /lc-sahne-dose/.test(js) && /\.lc-sahne-dose/.test(css));
  pruefe("und einen Strahl aus der Tuelle", /lc-sahne-strahl/.test(js) && /\.lc-sahne-strahl/.test(css));
  /* Die Ringe duerfen nicht alle gleichzeitig da sein — sonst ist es
     wieder eine fertige Haube statt eines Aufbaus. */
  const verzug = (css.match(/\.lc-sahne-[123][^}]*animation-delay:\s*([\d.]+)s/g) || [])
    .map((x) => parseFloat(x.match(/animation-delay:\s*([\d.]+)s/)[1]));
  pruefe("die drei Ringe wachsen nacheinander", verzug.length === 3 && verzug[0] < verzug[1] && verzug[1] < verzug[2],
    verzug.join(" s, ") + " s");
  const kirsche = css.slice(css.indexOf("@keyframes lcKirscheFaellt"));
  const kirscheAb = parseFloat((kirsche.match(/0%,\s*(\d+)%\s*\{ opacity: 0/) || [])[1] || "0");
  pruefe("die Kirsche kommt ZULETZT, nach der Haube", kirscheAb >= 55,
    "sie ist bis " + kirscheAb + " % der Laufzeit unsichtbar");

  console.log("\nDIE STOERUNG IST BEIDES\n");
  /* GEAENDERT, und zwar auf seine zweite Ansage hin. Erst: „die
     Störung ist kein Effekt um das Profilbild zu beeinflussen durch
     einen Klick sondern es ist ein Sprechbild-Effekt." Dann, nach dem
     Umbau: „du kannst diese Störung aber trotzdem in den klickbaren
     Effekten drin lassen … denn ich finde es trotzdem wichtig, den
     Empfang von jemand anderem zu stören."
     Also beides — und beides wird hier geprueft. */
  pruefe("es gibt sie wieder als Wurf", lc.indexOf('nutzt: "/stoerung') >= 0);
  pruefe("sie steht wieder in AM_PLATZ",
    lc.slice(lc.indexOf("var AM_PLATZ"), lc.indexOf("var AUCH_AM_PLATZ")).indexOf("stoerung:") >= 0);
  pruefe("und zugleich bei den Sprechbildern",
    /stoerung:\s*"St(ö|oe)rung/.test(lc.slice(lc.indexOf("var SPRECHBILDER"), lc.indexOf("var SPRECHBILD_SCHLUESSEL"))));
  pruefe("und das Stilblatt kennt sie beim Sprechen",
    /\[data-sprechbild="stoerung"\]/.test(css));

  console.log("\nDER STROM MACHT BLITZE, KEINE KREUZE\n");
  const stromT = css.slice(css.indexOf(".lc-tstrom .lc-teilchen"), css.indexOf("@keyframes lcZuckt"));
  const ecken = (stromT.match(/clip-path:\s*polygon\(([^)]*)\)/) || [])[1] || "";
  pruefe("ein Blitz hat eine Zickzack-Kontur", ecken.split(",").length >= 6,
    ecken.split(",").length + " Eckpunkte");
  const spokes = css.slice(css.indexOf('[data-sprechbild="strom"] .lc-kreis::after'),
                           css.indexOf("@keyframes lcStromZucken"));
  pruefe("und der alte Keilkranz (das Kreuz) ist weg", spokes.indexOf("conic-gradient") < 0,
    "kein conic-gradient mehr am Stromrand");

  /* ---------- UND JETZT IM BROWSER ---------- */
  const srv = http.createServer((q, a) => {
    let p = decodeURIComponent(q.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(WURZEL, p);
    if (!f.startsWith(WURZEL) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { a.writeHead(404); return a.end(); }
    a.writeHead(200, { "Content-Type": TYP[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(a);
  }).listen(0);
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 820 } });
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefSitz, { timeout: 20000 });
  /* Die Pruefbuehne baut die Sitzreihe im Dokument auf — ohne sie
     gibt es keine .lc-platz-Knoepfe, und jede Messung am Platz
     liefe ins Leere. */
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  /* Eine Sitzordnung, in der ich vorn sitze und Emmi hinten — so wie
     in seiner Beschreibung („egal wo er unten sitzt"). */
  const sitz = await pg.evaluate(() => {
    const leute = {};
    ["Bea", "Cem", "Dana"].forEach((n, i) => {
      leute["p" + i] = { id: "p" + i, name: n, seit: 2000 + i * 100 };
    });
    leute.e1 = { id: "e1", name: "Emmi", seit: 9000 };
    const s = window.LiveChat.pruefSitz({
      lage: "drin", ichId: "ich", ichName: "Alex", seit: 1000,
      zuruecksetzen: true, leute: leute
    });
    return (s.plaetze || []).filter((p) => !p.leer).map((p) => p.nummer + ":" + p.name);
  });
  pruefe("die Sitzordnung steht", sitz.length === 5, sitz.join("  "));

  console.log("\nANGEL UND LASSO: ZWEI VERSCHIEDENE LEINEN VON MEINEM PLATZ\n");
  for (const [w, art, teil] of [["heber", "angel", ".lc-leine-haken"],
                                ["lasso", "lasso", ".lc-leine-schlinge"]]) {
    const d = await pg.evaluate(async (w) => {
      /* ZWEI PLAETZE FREI MACHEN — und das ist keine Bequemlichkeit,
         sondern die neue Regel aus Fassung 358: „Ich kann da nur auf
         den leeren Plätzen lang fahren … Wenn alles voll ist, kann ich
         nicht losfahren." Auf der Pruefbuehne sitzt auf jedem Platz
         jemand; ohne eine Luecke faehrt zu Recht niemand los, und die
         Sonde hat genau das gemeldet („0 px, 0 Lauf"). Die Fahrlinie
         selbst wird in pruefe-runde16 an einem ganzen Brett geprueft. */
      [2, 3].forEach((n) => {
        const pl = document.querySelector('.lc-platz[data-lc-platz="' + n + '"]');
        if (pl) {
          pl.classList.add("lc-platz-frei");
          const nm = pl.querySelector(".lc-platz-name");
          if (nm) nm.textContent = "frei";
        }
      });
      document.querySelectorAll(".lc-zp, .lc-leine").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.wirkung(w, "Emmi");
      await new Promise((f) => setTimeout(f, 200));
      const leine = document.querySelector(".lc-leine");
      if (!leine) return { fehlt: true };
      const karte = document.getElementById("livechatKarte");
      const ich = karte.querySelector(".lc-platz-ich");
      const ziel = [...karte.querySelectorAll(".lc-platz")].find((pl) => {
        const nm = pl.querySelector(".lc-platz-name");
        return nm && nm.textContent.trim() === "Emmi";
      });
      const a = ich.getBoundingClientRect(), b = ziel.getBoundingClientRect();
      const l = leine.getBoundingClientRect();
      const mitte = { x: a.left + a.width / 2, y: a.top + a.height * 0.42 };
      /* Faengt die Leine an MEINEM Platz an? Der Anker ist der linke
         obere Punkt der (gedrehten) Schicht — gemessen wird deshalb
         der Abstand des Elternankers zu meiner Bildmitte. */
      const anker = { x: parseFloat(leine.style.left), y: parseFloat(leine.style.top) };
      const reihe = (document.getElementById("lcPlaetze") || karte).getBoundingClientRect();
      const abstand = Math.hypot(anker.x + reihe.left - mitte.x, anker.y + reihe.top - mitte.y);
      const laenge = parseFloat(leine.style.getPropertyValue("--laenge"));
      const weg = Math.hypot(b.left - a.left, b.top - a.top);
      return {
        klasse: leine.className,
        abstand: Math.round(abstand),
        laenge: Math.round(laenge),
        weg: Math.round(weg),
        z: getComputedStyle(leine).zIndex,
        ichBewegt: getComputedStyle(ich.querySelector(".lc-kreis")).animationName,
        zielBewegt: getComputedStyle(ziel.querySelector(".lc-kreis")).animationName,
        teile: [...leine.children].map((c) => c.getAttribute("class")).join(" ")
      };
    }, w);
    if (d.fehlt) { pruefe(art + ": die Leine wird gezeichnet", false, "keine .lc-leine gefunden"); continue; }
    pruefe(art + ": die Leine wird gezeichnet", true, d.klasse);
    pruefe(art + ": sie beginnt an MEINEM Platz", d.abstand <= 6, d.abstand + " px von meiner Bildmitte");
    pruefe(art + ": sie hoert am fremden Bildrand auf, nicht in der Mitte",
      d.laenge > 0 && d.laenge < d.weg, d.laenge + " px von " + d.weg + " px Weg");
    /* GEAENDERT, auf seine Meldung hin: „Das Lasso und der Haken sind
       nicht zu sehen." Sie lagen mit z-index 0 hinter den Plaetzen,
       und wer senkrecht nach unten wirft, dessen Leine verschwindet
       damit vollstaendig unter den zwei Profilbildern. Sie liegt
       jetzt vorn. Geprueft wird deshalb das Gegenteil von frueher:
       sie muss ueber den Plaetzen liegen (die haben z-index 1). */
    pruefe(art + ": sie liegt VOR den Plaetzen und ist zu sehen",
      Number(d.z) > 1, "z-index " + d.z);
    pruefe(art + ": sie hat ihr eigenes Werkzeug (" + teil + ")",
      d.teile.indexOf(teil.slice(1)) >= 0, d.teile || "nichts");
    /* „Ich bleibe an meinem Platz. Ich kann nur die anderen von ihrer
       Position beeinflussen." */
    pruefe(art + ": MEIN Bild ruehrt sich nicht", d.ichBewegt === "none", d.ichBewegt);
    pruefe(art + ": der ANDERE wird bewegt", d.zielBewegt !== "none", d.zielBewegt);
  }

  console.log("\nDER SCHNEEBALL KLATSCHT AN DIE SEITE\n");
  const schnee = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("schneeball", "Emmi");
    await new Promise((f) => setTimeout(f, 180));
    const s = document.querySelector(".lc-schnee");
    if (!s) return { fehlt: true };
    const px = parseFloat(s.style.getPropertyValue("--px"));
    const py = parseFloat(s.style.getPropertyValue("--py"));
    const klecks = s.querySelector(".lc-schnee-klecks");
    const rinne = s.querySelector(".lc-schnee-rinne");
    return {
      px: px, py: py, weg: Math.round(Math.hypot(px, py)),
      klecksInBlende: Boolean(klecks && klecks.closest(".lc-zp-blende")),
      rinneDa: Boolean(rinne),
      tropfen: s.querySelectorAll(".lc-schnee-tropfen").length
    };
  });
  pruefe("der Auftreffpunkt liegt nicht in der Mitte", !schnee.fehlt && schnee.weg >= 20,
    schnee.fehlt ? "kein Schneeball" : schnee.weg + " % vom Mittelpunkt entfernt");
  pruefe("der Klecks bleibt im Bild (runde Blende)", Boolean(schnee.klecksInBlende));
  pruefe("und es laeuft etwas herunter", Boolean(schnee.rinneDa));
  pruefe("und tropft davor ab", schnee.tropfen >= 3, (schnee.tropfen || 0) + " Tropfen");

  console.log("\nDER STRUDEL VERZERRT WIRKLICH DIE PIXEL\n");
  const sog = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("sog", "Emmi");
    await new Promise((f) => setTimeout(f, 200));
    const s = document.querySelector(".lc-sog");
    if (!s) return { fehlt: true };
    const platz = s.closest(".lc-platz");
    const kreis = platz.querySelector(".lc-kreis");
    const filter = kreis.style.filter || "";
    /* ACHTUNG, DIESE SONDE HAT SICH HIER SELBST BELOGEN: der Browser
       gibt den Filter als url("#lcSogFilter1") zurueck, MIT
       Anfuehrungszeichen. Der erste Ausdruck suchte url(# und fand
       nie etwas — gemeldet wurde dann „der Filter steht nicht im
       Dokument", obwohl er dastand. */
    const id = (filter.match(/url\(["']?#([^"')]+)/) || [])[1] || "";
    const def = id ? document.getElementById(id) : null;
    return {
      filter: filter,
      gefunden: Boolean(def),
      verschiebt: Boolean(def && def.querySelector("feDisplacementMap")),
      rauschen: Boolean(def && def.querySelector("feTurbulence")),
      getaktet: Boolean(def && def.querySelectorAll("animate").length >= 2)
    };
  });
  pruefe("das Bild traegt einen echten Bildfilter",
    !sog.fehlt && /url\(["']?#/.test(sog.filter || ""),
    sog.fehlt ? "kein Strudel" : sog.filter);
  pruefe("und dieser Filter steht auch wirklich im Dokument", Boolean(sog.gefunden));
  pruefe("er verschiebt Bildpunkte (feDisplacementMap)", Boolean(sog.verschiebt),
    "kein Bild darueber, sondern das Bild selbst");
  pruefe("mit einem Rauschfeld (feTurbulence)", Boolean(sog.rauschen));
  pruefe("und die Staerke ist ueber die Zeit getaktet", Boolean(sog.getaktet));

  console.log("\nDAS PAINTBALL TRIFFT EIN PROFILBILD\n");
  const paint = await pg.evaluate(async () => {
    let paket = null;
    window.LiveChat.pruefPost((p) => { if (!paket) paket = p; });
    window.LiveChat.pruefBefehl("/paintball Emmi");
    document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("paintfleck", "Emmi");
    await new Promise((f) => setTimeout(f, 180));
    const s = document.querySelector(".lc-paintfleck");
    const k = s && s.querySelector(".lc-paintfleck-klecks");
    return {
      wirkung: paket && paket.wirkung, wen: paket && paket.wen,
      da: Boolean(s),
      farbe: s ? s.style.getPropertyValue("--farbe") : "",
      inBlende: Boolean(k && k.closest(".lc-zp-blende")),
      laeufer: s ? s.querySelectorAll(".lc-paintfleck-laeufer").length : 0
    };
  });
  pruefe("„/paintball Emmi“ meint genau Emmi",
    paint.wirkung === "paintfleck" && paint.wen === "Emmi",
    (paint.wirkung || "-") + " / " + (paint.wen || "-"));
  pruefe("der Klecks liegt auf dem Bild", paint.da && paint.inBlende, paint.farbe || "-");
  pruefe("und laeuft herunter", paint.laeufer >= 5, paint.laeufer + " Schlieren");

  console.log("\nDAS EI KOMMT IMMER VON OBEN\n");
  const ei = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("ei", "Emmi");
    await new Promise((f) => setTimeout(f, 180));
    const s = document.querySelector(".lc-zei");
    if (!s) return { fehlt: true };
    const ganz = s.querySelector(".lc-zei-ganz");
    const r = ganz.getBoundingClientRect();
    const kreis = s.closest(".lc-platz").querySelector(".lc-kreis").getBoundingClientRect();
    return {
      ueber: Math.round(kreis.top - r.top),
      schalen: s.querySelectorAll(".lc-zei-schale").length,
      klarInBlende: Boolean(s.querySelector(".lc-zei-klar") &&
                            s.querySelector(".lc-zei-klar").closest(".lc-zp-blende")),
      keinWurf: !s.style.getPropertyValue("--wx")
    };
  });
  pruefe("das Ei haengt ueber dem Kopf", !ei.fehlt && ei.ueber > 0,
    ei.fehlt ? "kein Ei" : ei.ueber + " px oberhalb des Bildrands");
  pruefe("es bricht in zwei Schalenhaelften", ei.schalen === 2, (ei.schalen || 0) + " Haelften");
  pruefe("das Eiklar bleibt im Bild", Boolean(ei.klarInBlende));
  pruefe("und es kommt NICHT aus der Sitzrichtung", Boolean(ei.keinWurf),
    "„das muss immer oben drüber dann passieren“");

  console.log("\nLOSFAHREN UND SPIELZUEGE\n");
  /* Die Zahl dahinter ist die Zeit, ueber die mitgeschaut wird:
     das Fahren dauert 3,2 s, das Huepfen hoechstens rund 2 s. */
  for (const [befehl, wirkung, wann] of [["/fahren Emmi", "fahren", 3400],
                                         ["/huepfen Emmi", "spielzug", 2200]]) {
    const d = await pg.evaluate(async ({ b, w, wann }) => {
      let paket = null;
      window.LiveChat.pruefPost((p) => { if (!paket) paket = p; });
      window.LiveChat.pruefBefehl(b);
      const karte = document.getElementById("livechatKarte");
      const ich = karte.querySelector(".lc-platz-ich");
      const ziel = [...karte.querySelectorAll(".lc-platz")].find((pl) => {
        const nm = pl.querySelector(".lc-platz-name");
        return nm && nm.textContent.trim() === "Emmi";
      });
      /* GEMESSEN WIRD DER VERSATZ ZUM EIGENEN SITZ, nicht die Lage im
         Fenster: waehrend der Fahrt schreibt der Befehl eine Zeile in
         den Chat, und der rollt. Im Fenster gemessen sah es deshalb so
         aus, als wandere auch der andere — er sass still, die Seite ist
         gerollt. Der Abstand Kreis-zu-Sitz kennt kein Rollen. */
      const versatz = (pl) => {
        const k = pl.querySelector(".lc-kreis").getBoundingClientRect();
        const p = pl.getBoundingClientRect();
        return { x: k.left - p.left, y: k.top - p.top };
      };
      /* AUFRAEUMEN, BEVOR GEMESSEN WIRD — und das war noetig: der
         Strudel von weiter oben laeuft 4,2 s und schrumpft Emmis Bild
         dabei auf null. Wer mitten darin nachmisst, sieht ihr Bild
         wandern und haelt das Fahren fuer kaputt. Es war der Strudel.
         Also: alle Schichten weg, alle Wirkungsklassen von allen
         Kreisen, und laufende Animationen abbrechen. */
      document.querySelectorAll(".lc-zp, .lc-leine").forEach((x) => x.remove());
      document.querySelectorAll(".lc-kreis").forEach((k) => {
        k.className = "lc-kreis";
        k.style.filter = "";
        k.getAnimations().forEach((a) => a.cancel());
      });
      await new Promise((f) => setTimeout(f, 60));
      const zielVor = versatz(ziel);
      const meinVor = versatz(ich);
      window.DMA_PRUEFUNG.wirkung(w, "Emmi", "Alex");
      /* NICHT EINMAL NACHSEHEN, SONDERN MITSCHAUEN.
         Zwei Anlaeufe lang habe ich zu einem festen Zeitpunkt gemessen
         und zweimal danebengelegen: beim Fahren war nach 0,7 s wegen
         „ease-in-out" erst 6 px geschafft, beim Huepfen war nach 1,5 s
         schon alles vorbei. Beides sah nach Stillstand aus und war
         keiner. Jetzt wird alle 60 ms nachgesehen und der WEITESTE
         Punkt behalten — der ist unabhaengig davon, wie lange die
         Bewegung dauert und wie sie beschleunigt.
         Nebenbei wird mitgezaehlt, ob am fremden Bild je eine
         Animation lief; „er bleibt sitzen" heisst: nie. */
      let weiteste = 0, zielWeit = 0, laeuft = 0, zielLaeuft = 0;
      for (let i = 0; i < Math.ceil(wann / 60); i++) {
        await new Promise((f) => setTimeout(f, 60));
        const m = versatz(ich), z = versatz(ziel);
        weiteste = Math.max(weiteste, Math.hypot(m.x - meinVor.x, m.y - meinVor.y));
        zielWeit = Math.max(zielWeit, Math.hypot(z.x - zielVor.x, z.y - zielVor.y));
        laeuft = Math.max(laeuft, ich.querySelector(".lc-kreis").getAnimations().length);
        zielLaeuft = Math.max(zielLaeuft, ziel.querySelector(".lc-kreis").getAnimations().length);
      }
      const meinJetzt = { x: meinVor.x + weiteste, y: meinVor.y };
      const zielNach = { x: zielVor.x + zielWeit, y: zielVor.y };
      return {
        wirkung: paket && paket.wirkung, wen: paket && paket.wen,
        laeuft: laeuft,
        versetzt: Math.round(Math.hypot(meinJetzt.x - meinVor.x, meinJetzt.y - meinVor.y)),
        zielVerschoben: Math.round(Math.hypot(zielNach.x - zielVor.x, zielNach.y - zielVor.y)),
        zielLaeuft: zielLaeuft
      };
    }, { b: befehl, w: wirkung, wann: wann });
    pruefe("„" + befehl + "“ schickt „" + wirkung + "“",
      d.wirkung === wirkung && d.wen === "Emmi", (d.wirkung || "-") + " / " + (d.wen || "-"));
    pruefe(wirkung + ": MEIN Bild ist unterwegs", d.laeuft > 0 && d.versetzt > 10,
      d.versetzt + " px vom eigenen Platz weg, " + d.laeuft + " Lauf");
    pruefe(wirkung + ": der andere bleibt sitzen", d.zielVerschoben <= 2 && d.zielLaeuft === 0,
      d.zielVerschoben + " px, " + d.zielLaeuft + " Animation an seinem Bild");
  }

  /* =========================================================
     DER REST DER WUNSCHLISTE
     ---------------------------------------------------------
     „Schau doch mal bitte in meinem Verlauf, von welchen
      Effekten ich dir gesprochen habe und berücksichtige alle
      diese Effekte und lasse keinen aus."
     Zwoelf Stueck. Fuer jeden dasselbe, ohne Nachsicht: gibt
     es den Befehl, meint er genau die genannte Person, haengt
     die Zeichnung an DEREN Platz, deckt sie das Profilbild ab,
     und ist ueberhaupt etwas gezeichnet?
     ========================================================= */
  console.log("\nDER REST DER WUNSCHLISTE\n");
  const REST = [
    ["/katapult Emmi",   "katapult",   "lc-katapult"],
    ["/strohhalm Emmi",  "strohhalm",  "lc-strohhalm"],
    ["/peitsche Emmi",   "peitsche",   "lc-peitsche"],
    ["/bowling Emmi",    "bowling",    "lc-bowling"],
    ["/billard Emmi",    "billard",    "lc-billard"],
    ["/kopfhoerer Emmi", "kopfhoerer", "lc-kopfhoerer"],
    ["/luke Emmi",       "luke",       "lc-luke"],
    ["/platte Emmi",     "platte",     "lc-platte"],
    ["/ohrfeige Emmi",   "ohrfeige",   "lc-ohrfeige"],
    ["/basketball Emmi", "basketball", "lc-basket"],
    ["/tennis Emmi",     "tennis",     "lc-tennis"],
    /* NACHGEZOGEN IN RUNDE 19, weil die Sache sich geaendert hat:
       GEMELDET: „Dieser Keks-Effekt — das soll ein einzelner sein. Ich
       glaube, du hast Kekse und Aufessen jeweils einmal, aber das,
       was Aufessen macht, soll eigentlich der Keks-Effekt sein."
       /keks zeichnet deshalb jetzt dieselbe Schicht wie /aufessen. */
    ["/keks Emmi",       "krumel",     "lc-aufessen"]
  ];
  for (const [befehl, wirkung, klasse] of REST) {
    const d = await pg.evaluate(async ({ b, w, k }) => {
      let paket = null;
      window.LiveChat.pruefPost((p) => { if (!paket) paket = p; });
      window.LiveChat.pruefBefehl(b);
      document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.wirkung(w, "Emmi");
      await new Promise((f) => setTimeout(f, 180));
      const s = document.querySelector("." + k);
      if (!s) return { wirkung: paket && paket.wirkung, wen: paket && paket.wen, fehlt: true };
      const platz = s.closest(".lc-platz");
      const kreis = platz ? platz.querySelector(".lc-kreis") : null;
      return {
        wirkung: paket && paket.wirkung, wen: paket && paket.wen,
        name: platz ? platz.querySelector(".lc-platz-name").textContent.trim() : "",
        kinder: s.children.length,
        /* Gemessen am LAYOUT, nicht am gemalten Bild: waehrend der
           Animation ist der Kreis unterwegs und halb so gross. */
        deckung: kreis ? Math.abs(s.offsetWidth - kreis.offsetWidth)
                       + Math.abs(s.offsetHeight - kreis.offsetHeight)
                       + Math.abs(s.offsetLeft - kreis.offsetLeft)
                       + Math.abs(s.offsetTop - kreis.offsetTop) : 999
      };
    }, { b: befehl, w: wirkung, k: klasse });
    pruefe("„" + befehl + "“ schickt „" + wirkung + "“ an Emmi",
      d.wirkung === wirkung && d.wen === "Emmi",
      (d.wirkung || "-") + " / " + (d.wen || "-"));
    pruefe(wirkung + ": zeichnet etwas an ihrem Platz",
      !d.fehlt && d.kinder > 0 && /Emmi/i.test(d.name || ""),
      d.fehlt ? "nichts gezeichnet" : d.kinder + " Teile bei " + d.name);
    pruefe(wirkung + ": deckt genau das Profilbild ab", !d.fehlt && d.deckung <= 4,
      d.fehlt ? "-" : d.deckung + " px Abweichung");
  }

  console.log("\nUND DER ZUFALL WUERFELT WIRKLICH\n");
  const zufall = await pg.evaluate(async () => {
    let paket = null;
    window.LiveChat.pruefPost((p) => { if (!paket) paket = p; });
    window.LiveChat.pruefBefehl("/zufall Emmi");
    /* Zwoelf Wuerfe: kaeme immer dasselbe heraus, waere es kein
       Zufall, sondern ein fester Effekt mit einem huebschen Namen. */
    const gesehen = {};
    for (let i = 0; i < 12; i++) {
      document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.wirkung("zufall", "Emmi");
      await new Promise((f) => setTimeout(f, 60));
      document.querySelectorAll(".lc-zp").forEach((x) => {
        String(x.className).split(/\s+/).forEach((c) => { if (c !== "lc-zp") gesehen[c] = 1; });
      });
    }
    return { wirkung: paket && paket.wirkung, wen: paket && paket.wen,
             arten: Object.keys(gesehen) };
  });
  pruefe("„/zufall Emmi“ meint Emmi", zufall.wirkung === "zufall" && zufall.wen === "Emmi",
    (zufall.wirkung || "-") + " / " + (zufall.wen || "-"));
  pruefe("und zwoelf Wuerfe ergeben nicht zwoelfmal dasselbe",
    (zufall.arten || []).length >= 4, (zufall.arten || []).join(", ") || "nichts");

  console.log("\nDIE REGENTROPFEN LAUFEN AN DER BILDKANTE HERUNTER\n");
  const regen = await pg.evaluate(async () => {
    /* AUFRAEUMEN, SONST MISST MAN EINE LAUFENDE ANIMATION MIT.
       Genau das ist passiert: der Zufallstest davor wirft ein Dutzend
       Wirkungen auf Emmi, und einige davon vergroessern ihren Kreis
       (der Katapultwurf, das Dribbeln, der Sog). Gemessen wurde dann
       ein Bild von 100 statt 84 px, und die Tropfen sassen angeblich
       66 bis 74 px von der Mitte statt 40. Sie sassen richtig — der
       Massstab war falsch. */
    document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
    document.querySelectorAll(".lc-kreis").forEach((k) => {
      k.className = "lc-kreis";
      k.style.filter = "";
      k.getAnimations().forEach((a) => a.cancel());
    });
    await new Promise((f) => setTimeout(f, 60));
    window.DMA_PRUEFUNG.wirkung("regenwolke", "Emmi");
    await new Promise((f) => setTimeout(f, 250));
    const s = document.querySelector(".lc-zwolke");
    if (!s) return { fehlt: true };
    const kanten = [...s.querySelectorAll(".lc-zwolke-kante")];
    const r = parseFloat(s.style.getPropertyValue("--r"));
    /* Und gemessen wird ab der Mitte der SCHICHT, nicht des Kreises:
       die Schicht deckt denselben Kasten ab (das prueft
       pruefe-platzmenue), traegt aber selbst keine Animation. */
    const kreis = s.getBoundingClientRect();
    const mitte = { x: kreis.left + kreis.width / 2, y: kreis.top + kreis.height / 2 };
    /* Wie weit sitzt jeder Tropfen von der Bildmitte weg? Auf der
       Kante heisst: ungefaehr so weit wie der Radius. */
    const abstaende = kanten.map((k) => {
      const b = k.getBoundingClientRect();
      return Math.hypot(b.left + b.width / 2 - mitte.x, b.top + b.height / 2 - mitte.y);
    });
    return { anzahl: kanten.length, r: r, halb: kreis.width / 2,
             abstaende: abstaende.map((x) => Math.round(x)) };
  });
  pruefe("es gibt Tropfen an der Kante", !regen.fehlt && regen.anzahl >= 6,
    (regen.anzahl || 0) + " Stueck");
  pruefe("der Radius kommt in Pixeln, nicht in Prozent",
    !regen.fehlt && regen.r > 4, regen.r + " px (halbes Bild: " + Math.round(regen.halb || 0) + " px)");
  const daneben = (regen.abstaende || []).filter((x) => Math.abs(x - regen.r) > regen.r * 0.35);
  pruefe("und sie sitzen wirklich auf der runden Kante", daneben.length === 0,
    (regen.abstaende || []).join(", ") + " px gegen " + Math.round(regen.r || 0) + " px");

  pruefe("keine Fehler auf der Seite", aufSeite.length === 0, aufSeite.join(" | ") || "keine");

  await br.close();
  srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Runde 15 sitzt.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
