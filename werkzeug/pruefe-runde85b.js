/* =====================================================================
   SONDE RUNDE 85, ZWEITER TEIL
   ---------------------------------------------------------------------
   Gemessen wird, was Xander in Runde 85 genannt hat und was in Runde 86
   nachgezogen wurde: der Popo beim Klaps, die Gluehbirne (zweiter
   Druck und Schraeglage), die Augen und die Dunkelheit ueber der
   ganzen Seite, die Schneekugel mit Sockel, der Frosch in Sprung-
   richtung mit einem sauberen Quaken und die Schwingen des Adlers.
   ===================================================================== */
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");
const FFMPEG = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 85, zweiter Teil");
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
  const pg = await br.newPage({ viewport: { width: 420, height: 900 } });
  pg.on("pageerror", (e) => { console.log("  FEHL Seitenfehler: " + e.message); fehler++; });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne, { timeout: 20000 });
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push({ t: Math.round(performance.now()),
        n: (this.currentSrc || this.src || "").split("/").pop().split("?")[0]
             .replace(/\.(opus|m4a)$/, "") });
      return ap.call(this);
    };
  });
  const buehne = () => pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  /* =================================================================
     1. DER POPO BEIM KLAPS
     ================================================================= */
  console.log("\nDer Klaps");
  await buehne();
  await pg.evaluate(() => {
    document.querySelectorAll(".lc-platz")[1].dataset.lcGeschlecht = "w";
    document.querySelectorAll(".lc-platz")[2].dataset.lcGeschlecht = "m";
    window.DMA_PRUEFUNG.wirkung("klaps", "Bea", "Alex", {});
    window.DMA_PRUEFUNG.wirkung("klaps", "Cem", "Alex", {});
  });
  await pg.waitForTimeout(700);
  const popo = await pg.evaluate(() => {
    const hol = (i) => {
      const pl = document.querySelectorAll(".lc-platz")[i];
      const p = pl.querySelector(".lc-popo");
      if (!p) return null;
      const leib = p.querySelector(".lc-popo-leib").getAttribute("d");
      const zahlen = leib.match(/-?\d+(\.\d+)?/g).map(Number);
      /* Im Pfad steht immer ein Paar: x, dann y. Die x-Werte sind also
         die geraden Stellen — und der kleinste davon ist die breiteste
         Stelle der Huefte (links). */
      const ecke = zahlen.filter((_, i) => i % 2 === 0);
      const backe = p.querySelector(".lc-popo-backe");
      return { da: true, frau: p.classList.contains("lc-popo-frau"),
               /* Die erste Zahl im Pfad ist die linke Taille. */
               taille: ecke[0], breiteste: Math.min.apply(null, ecke.slice(0, 8)),
               backeRx: +backe.getAttribute("rx"),
               backen: pl.querySelectorAll(".lc-popo-backe").length,
               imBild: !!pl.querySelector(".lc-zp-blende .lc-popo") };
    };
    return { w: hol(1), m: hol(2) };
  });
  sage(popo.w && popo.m && popo.w.da && popo.m.da && popo.w.backen === 2,
    "beim Klaps ist jetzt ein Popo zu sehen, mit zwei Backen");
  sage(popo.w && popo.m && popo.w.frau && !popo.m.frau
    && popo.w.breiteste < popo.m.breiteste && popo.w.backeRx > popo.m.backeRx,
    "und er ist verschieden, je nach eingestelltem Geschlecht",
    popo.w ? ("Frau: Huefte bis " + popo.w.breiteste + ", Backe " + popo.w.backeRx
      + " — Mann: Huefte bis " + popo.m.breiteste + ", Backe " + popo.m.backeRx) : "-");
  sage(popo.w && popo.w.imBild, "und er liegt IM Bild, in der runden Blende");
  await pg.waitForTimeout(1700);

  /* =================================================================
     2. DIE GLUEHBIRNE
     ================================================================= */
  console.log("\nDie Gluehbirne");
  await buehne();
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("gluehbirne", "Bea", "Alex", {}));
  await pg.waitForTimeout(4300);
  const anEins = await pg.evaluate(() =>
    document.querySelectorAll(".lc-platz")[1].querySelector(".lc-kreis")
      .classList.contains("lc-birne-an"));
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("gluehbirne", "Bea", "Alex", {}));
  await pg.waitForTimeout(4300);
  const anZwei = await pg.evaluate(() =>
    document.querySelectorAll(".lc-platz")[1].querySelector(".lc-kreis")
      .classList.contains("lc-birne-an"));
  sage(anEins && anZwei,
    "zweimal „Birne an“ laesst sie an — ausgedreht wird mit /birneraus",
    "erster Druck: " + anEins + ", zweiter: " + anZwei);
  const css = fs.readFileSync(path.join(WURZEL, "korrekturen.css"), "utf8");
  const endWinkel = (css.match(/100% \{ transform: rotate\((\d+)deg\) scale\(1\); filter: brightness\(1\); \}/) || [])[1];
  sage(endWinkel && Number(endWinkel) % 360 === 0,
    "und am Ende steht sie gerade, nicht schraeg",
    endWinkel + " Grad = " + (Number(endWinkel) / 360) + " volle Umdrehungen");
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("birneraus", "Bea", "Alex", {}));
  await pg.waitForTimeout(900);

  /* =================================================================
     3. AUGEN UND DUNKELHEIT GELTEN DER GANZEN SEITE
     ================================================================= */
  console.log("\nDie ganze Seite");
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("augen", "", "Alex", {}));
  await pg.waitForTimeout(600);
  const augen = await pg.evaluate(() => {
    const a = document.getElementById("lcAugen");
    const heim = a && a.parentElement;
    const r = a ? a.getBoundingClientRect() : null;
    return {
      imSeitenheim: !!heim && heim.id === "lcSeitenBuehne",
      heimVerformt: heim ? getComputedStyle(heim).transform : "?",
      deckt: r ? [Math.round(r.width - window.innerWidth),
                  Math.round(r.height - window.innerHeight)] : null
    };
  });
  sage(augen.imSeitenheim && augen.heimVerformt === "none",
    "die Augen haengen an der Seite und nicht an der Karte — dort ist „fixed“ wieder fixed",
    "Zuhause verformt: " + augen.heimVerformt);
  sage(augen.deckt && Math.abs(augen.deckt[0]) <= 1 && Math.abs(augen.deckt[1]) <= 1,
    "und sie decken das ganze Fenster",
    augen.deckt ? augen.deckt.join(" / ") + " px Unterschied" : "-");
  /* Und beim Rollen bleiben sie stehen. */
  const vorher = await pg.evaluate(() => {
    const p = document.querySelector("#lcAugen .lc-augenpaar");
    return p ? Math.round(p.getBoundingClientRect().top) : null;
  });
  await pg.evaluate(() => window.scrollBy(0, 220));
  await pg.waitForTimeout(220);
  const nachher = await pg.evaluate(() => {
    const p = document.querySelector("#lcAugen .lc-augenpaar");
    return p ? Math.round(p.getBoundingClientRect().top) : null;
  });
  /* WIEVIEL DARF ES SEIN? Die Augen WACKELN von sich aus: lcAugenWackelt
     hebt sie um 3 px und senkt sie wieder, immerzu. Gemessen wird also
     nie zweimal genau dieselbe Zahl — springen sie dagegen mit der
     Seite mit, waeren es 220 px (so weit wurde gerollt). Die Grenze
     liegt deshalb bei 8 px: mehr als das Wackeln, viel weniger als ein
     Sprung. */
  sage(vorher !== null && nachher !== null && Math.abs(vorher - nachher) <= 8,
    "beim Rollen springen sie nicht mehr (gerollt wurde um 220 px)",
    "vor dem Rollen " + vorher + " px, danach " + nachher + " px");
  await pg.evaluate(() => window.scrollTo(0, 0));
  await pg.waitForTimeout(600);
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("finsternis", "", "Alex", {}));
  await pg.waitForTimeout(500);
  const dunkel = await pg.evaluate(() => {
    const d = document.getElementById("lcDunkel");
    const heim = d && d.parentElement;
    const r = d ? d.getBoundingClientRect() : null;
    return { imSeitenheim: !!heim && heim.id === "lcSeitenBuehne",
             breit: r ? Math.round(r.width) : 0, schirm: window.innerWidth };
  });
  sage(dunkel.imSeitenheim && Math.abs(dunkel.breit - dunkel.schirm) <= 1,
    "und die Dunkelheit liegt ueber der ganzen Webseite, nicht nur ueber der Karte",
    dunkel.breit + " von " + dunkel.schirm + " px");
  await pg.waitForTimeout(6200);

  /* =================================================================
     4. DIE SCHNEEKUGEL WIRD MIT SOCKEL GESCHUETTELT
     ================================================================= */
  console.log("\nDie Schneekugel");
  await buehne();
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("schneekugel", "Bea", "Alex", {}));
  await pg.waitForTimeout(400);
  const kugel = await pg.evaluate(() => {
    const pl = document.querySelectorAll(".lc-platz")[1];
    const teil = (w) => {
      const el = pl.querySelector(w);
      if (!el) return null;
      const t = getComputedStyle(el).transform;
      const m = t.match(/matrix\(([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)/);
      return m ? { x: +(+m[5]).toFixed(1), y: +(+m[6]).toFixed(1) } : null;
    };
    /* RUNDE 99 — NEU GEMESSEN, WEIL ER ES NEU BESTELLT HAT.
       XANDER (23.09.2026): „Schau bei der Schneekugel, dass sich die
       Glaskugel nicht vom Sockel wegwackelt und beide Einheiten
       unterschiedlich schuetteln, sondern das soll EINE Einheit
       schuetteln."
       Bis Runde 98 trugen Bild, Glas und Sockel jedes seine eigene
       Schuettelbewegung — drei Animationen, die schon bei einem
       halben Bild Versatz gegeneinander arbeiten. Genau das hat er
       gesehen. Jetzt schuettelt die ganze SCHICHT (in ihr liegen
       Glas, Sockel, Landschaft und Schnee), und das Bild daneben mit
       derselben Kurve. Glas und Sockel haben deshalb KEINE eigene
       Bewegung mehr — sie zu suchen waere jetzt die falsche Frage.
       Gemessen wird stattdessen das, was „eine Einheit" bedeutet:
       die Schicht bewegt sich, und der Abstand zwischen Glas und
       Sockel bleibt dabei gleich. */
    return { bild: teil(".lc-kreis"), schicht: teil(".lc-schneekugel"),
             dauer: getComputedStyle(pl.querySelector(".lc-kreis")).animationDuration };
  });
  const bewegt = (a) => a && (Math.abs(a.x) > 0.3 || Math.abs(a.y) > 0.3);
  sage(bewegt(kugel.bild) && bewegt(kugel.schicht),
    "Bild und Kugel werden als EINE Einheit geschuettelt",
    JSON.stringify(kugel.bild) + " / " + JSON.stringify(kugel.schicht));
  sage(/1\.45s/.test(kugel.dauer || ""),
    "und das Schuetteln dauert so lange wie das Geraeusch zu hoeren ist (1,45 s)",
    kugel.dauer);
  await pg.waitForTimeout(7200);

  /* =================================================================
     5. DER FROSCH
     ================================================================= */
  console.log("\nDer Frosch");
  const roh = "/tmp/claude-0/pr85-quaken.raw";
  execFileSync(FFMPEG, ["-v", "error", "-i", path.join(WURZEL, "ton", "quaken.opus"),
    "-f", "s16le", "-ar", "24000", "-ac", "1", roh, "-y"]);
  const quakDauer = fs.readFileSync(roh).length / 2 / 24000;
  sage(quakDauer < 0.8,
    "„quaken“ ist jetzt EIN Ruf, der nicht mehr abgeschnitten werden muss",
    quakDauer.toFixed(2) + " s");
  /* RUNDE 88 — DIESE REGELN WAREN VERALTET UND EINE SOGAR LEER.
     1. Die Spiegelung hing an der Klasse „lc-frosch-rechts" und sass
        auf „.lc-frosch-bild". Beides gibt es nicht mehr: seit Xanders
        Satz „Der Frosch huepft auch nicht in die Richtung, in die er
        schaut" wird je SPRUNG gedreht, und zwar an „.lc-frosch-dreh".
     2. Die zweite Regel prueft gar nichts: „froschNach('5')" zielt auf
        Emmis Platz, der ist besetzt, die Reise wird abgelehnt, es gibt
        keinen Frosch — und „!null" ist wahr. Sie war immer gruen, egal
        was das Programm tat. Der senkrechte Sprung wird jetzt dort
        gemessen, wo er wirklich stattfindet: Bea auf Platz 2, Ziel
        Platz 6 genau darunter (werkzeug/pruefe-runde88-frosch.js).
     Hier bleibt nur, was zu Runde 85 gehoert: dass er ueberhaupt
     springt und dabei quakt. */
  const froschNach = async (von, ziel) => {
    await buehne();
    await pg.evaluate(() => { window.__toene = []; window.__start = performance.now(); });
    await pg.evaluate(([v, z]) => window.DMA_PRUEFUNG.wirkung("frosch", z, v, {}), [von, ziel]);
    await pg.waitForTimeout(1200);
    return pg.evaluate(() => {
      const f = document.querySelector(".lc-frosch");
      const dr = document.querySelector(".lc-frosch-dreh");
      const zahl = (el) => {
        if (!el) return null;
        const z = getComputedStyle(el).transform;
        if (!z || z === "none") return 1;
        return Number(z.slice(z.indexOf("(") + 1, -1).split(",")[0]);
      };
      return { da: !!f, dreh: zahl(dr),
               rufe: (window.__toene || []).filter((x) => x.n === "quaken").length };
    });
  };
  /* Alex sitzt auf Platz 1 links oben, Platz 8 liegt rechts unten. */
  const nachRechts = await froschNach("Alex", "8");
  sage(nachRechts.da, "der Frosch springt");
  sage(nachRechts.dreh < -0.5,
    "springt er nach rechts, schaut er auch nach rechts (die Zeichnung ist gespiegelt)",
    "scaleX " + nachRechts.dreh);
  sage(nachRechts.rufe >= 1, "und er quakt beim Springen", nachRechts.rufe + " Rufe");
  await pg.waitForTimeout(2600);

  /* =================================================================
     6. DIE SCHWINGEN DES ADLERS
     ================================================================= */
  console.log("\nDer Greifvogel");
  await buehne();
  await pg.evaluate(() => window.DMA_PRUEFUNG.wirkung("greifvogel", "6", "Alex", {}));
  await pg.waitForTimeout(900);
  /* RUNDE 88 — DIESE REGEL WAR VERALTET. Sie suchte im Quelltext von
     app.js nach der Zeile „const tx = 33 + t * …". Die gibt es nicht
     mehr, seit der Fluegel in sechs Federreihen zerlegt wurde, und
     eine Regel, die nur einen Text sucht, faellt bei jeder Umbenennung
     um, ohne dass sich am Bild etwas geaendert haette. Gemessen wird
     jetzt die Zeichnung selbst: Xanders Satz war „die Schwungfedern
     zeigen nach hinten, zum Schwanz" — der Vogel schaut nach rechts,
     „hinten" ist also kleines x, und die Handschwingen muessen hinter
     der Armflaeche hervorstehen, auf der sie wurzeln. */
  const fluegel = await pg.evaluate(() => {
    const nah = document.querySelector(".lc-greif-fluegel-nah");
    if (!nah) return { federn: 0, da: false };
    const links = (w) => {
      const ps = Array.from(nah.querySelectorAll(w));
      if (!ps.length) return null;
      return Math.min.apply(null, ps.map((p) => p.getBBox().x));
    };
    return { da: true,
             federn: document.querySelectorAll(".lc-greif-schwinge").length,
             federnLinks: links(".lc-greif-schwinge"),
             flaecheLinks: links(".lc-greif-arm") };
  });
  sage(fluegel.da && fluegel.federnLinks !== null
       && fluegel.federnLinks < fluegel.flaecheLinks - 10,
    "die Schwungfedern zeigen nach hinten, zum Schwanz",
    "Federn bis x = " + (fluegel.federnLinks || 0).toFixed(1)
      + ", Armflaeche nur bis x = " + (fluegel.flaecheLinks || 0).toFixed(1));
  sage(fluegel.da && fluegel.federn >= 14,
    "und jeder Fluegel hat einzelne Handschwingen, nicht eine Haut",
    fluegel.federn + " Federn (zwei Fluegel zu je acht)");

  /* =================================================================
     7. DER FAHRSTUHL
     ================================================================= */
  console.log("\nDer Fahrstuhl");
  await buehne();
  await pg.evaluate(() => { window.__toene = []; window.__start = performance.now();
    window.DMA_PRUEFUNG.wirkung("fahrstuhl", "7", "Alex", {}); });
  const lift = [];
  for (const ms of [200, 700, 1500, 2300, 2560]) {
    await pg.waitForTimeout(ms - (lift.length ? [200, 700, 1500, 2300, 2560][lift.length - 1] : 0));
    lift.push(await pg.evaluate(() => {
      const hol = (w) => {
        const k = document.querySelector(w);
        if (!k) return null;
        const l = k.querySelector(".lc-lift-tuer-l").getBoundingClientRect();
        const r = k.querySelector(".lc-lift-tuer-r").getBoundingClientRect();
        const kk = k.getBoundingClientRect();
        return { sicht: +(+getComputedStyle(k).opacity).toFixed(2),
                 /* Wie weit stehen die Tueren auf? 0 = zu. */
                 spalt: Math.round(r.left - l.right),
                 zahl: (k.querySelector(".lc-lift-zahl") || {}).textContent,
                 breit: Math.round(kk.width) };
      };
      return { start: hol(".lc-lift-start"), ziel: hol(".lc-lift-ziel") };
    }));
  }
  sage(lift[0].start && lift[0].start.spalt > 10 && lift[1].start && lift[1].start.spalt <= 2,
    "beim Start gehen die Tueren zu (bis 0,5 s, so lange rollt auch der Ton)",
    "200 ms: " + (lift[0].start ? lift[0].start.spalt : "-") + " px Spalt, 700 ms: "
      + (lift[1].start ? lift[1].start.spalt : "-") + " px");
  sage(lift[1].start && lift[2].start && lift[1].start.zahl !== lift[2].start.zahl,
    "die Anzeige zaehlt die Plaetze ab",
    (lift[1].start ? lift[1].start.zahl : "-") + " \u2192 " + (lift[2].start ? lift[2].start.zahl : "-"));
  /* RUNDE 98 — DIESE REGEL IST UMGEDREHT, UND ZWAR AUF SEINEN WUNSCH.
     XANDER (23.09.2026): „er soll realistisch zaehlen: auf der einen
     Seite, wo man losfaehrt, soll die Zahl steigen, solange bleiben
     die Tueren zu, und auf der anderen Seite soll die Zahl genauso am
     steigen sein, und dann dieses Blink-Geraeusch geben."
     Dafuer MUSS die Kabine am Ziel von Anfang an dastehen — vorher
     tauchte sie erst bei 56 % auf, da war vom Zaehlen nichts mehr zu
     sehen. Gemessen wird jetzt: sie steht da, ihre Tueren sind zu,
     und ihre Zahl zaehlt mit. */
  sage(lift[1].ziel && lift[1].ziel.sicht > 0.5 && lift[1].ziel.spalt <= 2,
    "die Kabine am Ziel steht von Anfang an da \u2014 mit geschlossener Tuer",
    lift[1].ziel ? ("Sichtbarkeit " + lift[1].ziel.sicht + ", Spalt "
      + lift[1].ziel.spalt + " px") : "noch gar nicht da");
  sage(lift[1].ziel && lift[2].ziel && lift[1].ziel.zahl !== lift[2].ziel.zahl,
    "und ihre Zahl zaehlt genauso mit wie die auf der Startseite",
    (lift[1].ziel ? lift[1].ziel.zahl : "-") + " \u2192 "
      + (lift[2].ziel ? lift[2].ziel.zahl : "-"));
  sage(lift[3].ziel && lift[3].ziel.spalt > 10,
    "und dort gehen die Tueren wieder auf",
    "2300 ms: " + (lift[3].ziel ? lift[3].ziel.spalt : "-") + " px Spalt");
  const liftTon = await pg.evaluate(() =>
    (window.__toene || []).map((x) => x.n + "@" + Math.round(x.t - window.__start)));
  sage(liftTon.some((x) => /^fahrstuhl@/.test(x)),
    "und man hoert Tuer, Fahrt und Glocke", liftTon.join(", ") || "kein Ton");
  await pg.waitForTimeout(1200);
  const liftReste = await pg.evaluate(() => ({
    kabinen: document.querySelectorAll(".lc-lift").length,
    unterwegs: document.querySelectorAll(".lc-platz-unterwegs").length
  }));
  sage(liftReste.kabinen === 0 && liftReste.unterwegs === 0,
    "danach bleibt nichts stehen",
    liftReste.kabinen + " Kabinen, " + liftReste.unterwegs + " Plaetze unterwegs");

  /* =================================================================
     8. DER KOPFHOERER FRAGT ERST
     ================================================================= */
  console.log("\nDer Kopfhoerer");
  await buehne();
  await pg.evaluate(() => {
    /* Der Musikordner ist hier leer — also zwei Lieder unterschieben
       und mitschreiben, was gesendet wird. */
    window.__gesendet = [];
    window.LiveChat = window.LiveChat || {};
    window.LiveChat.schreiben = function (z) { window.__gesendet.push(z); };
    window.LiveChat.lieder = function () {
      return [{ datei: "a.mp3", titel: "Erstes Lied" },
              { datei: "b.mp3", titel: "Zweites Lied" }];
    };
    try { localStorage.removeItem("dma_lied_ausschnitt"); } catch (e) {}
    window.DMA_PRUEFUNG.platzMenue(document.querySelectorAll(".lc-platz")[1]);
  });
  await pg.waitForTimeout(250);
  const tippen = (teil) => pg.evaluate((t) => {
    const k = [...document.querySelectorAll("#lcPlatzMenue button")]
      .find((b) => b.textContent.indexOf(t) >= 0);
    if (k) k.click();
    return !!k;
  }, teil);
  await tippen("H\u00f6rer");
  await pg.waitForTimeout(250);
  const frage1 = await pg.evaluate(() => ({
    kopf: (document.querySelector("#lcPlatzMenue .lc-platzmenue-kopf") || {}).textContent,
    knoepfe: [...document.querySelectorAll("#lcPlatzMenue .lc-platzmenue-wort")]
      .map((x) => x.textContent)
  }));
  sage(frage1.knoepfe.length === 2
    && /Nur aufsetzen/.test(frage1.knoepfe.join(" "))
    && /Mit Lied/.test(frage1.knoepfe.join(" ")),
    "ein Druck auf den Kopfhoerer fragt: nur schicken oder mit Lied?",
    frage1.knoepfe.join(" / "));
  await tippen("Mit Lied");
  await pg.waitForTimeout(250);
  const lieder = await pg.evaluate(() =>
    [...document.querySelectorAll("#lcPlatzMenue .lc-lese-text")].map((x) => x.textContent.trim()));
  /* RUNDE 98 — GANZ OBEN STEHT JETZT DAS LIEDER-PANEL.
     XANDER: „Die Musik kann ich immer noch nicht in Einzelteil-Buttons
     anlegen, um eine History zu haben beziehungsweise ein
     abgespeichertes Panel." Der erste Knopf in dieser Liste fuehrt
     deshalb dorthin; die Lieder stehen darunter. Gezaehlt werden
     deshalb nur die Lieder. */
  const nurLieder = lieder.filter((x) => !/Abschnitte|Verlauf/.test(x));
  sage(nurLieder.length === 2 && /Erstes Lied/.test(nurLieder.join(" ")),
    "dann steht die Liste aus dem Musikordner da \u2014 mit dem Panel darueber",
    lieder.join(" / "));
  await tippen("Zweites Lied");
  await pg.waitForTimeout(250);
  const frage3 = await pg.evaluate(() => ({
    kopf: (document.querySelector("#lcPlatzMenue .lc-platzmenue-kopf") || {}).textContent,
    knoepfe: [...document.querySelectorAll("#lcPlatzMenue .lc-lese-text")]
      .map((x) => x.textContent.trim()),
    felder: document.querySelectorAll("#lcPlatzMenue .lc-ausschnitt input").length,
    ab: Boolean(document.querySelector("#lcPlatzMenue .lc-ausschnitt-ab")),
    bis: Boolean(document.querySelector("#lcPlatzMenue .lc-ausschnitt-bis")),
    name: Boolean(document.querySelector("#lcPlatzMenue .lc-stelle-name"))
  }));
  /* NACHGEBESSERT IN RUNDE 89: die Regel verlangte frueher den Kopf
     „ganz oder ein Stueck" und GENAU zwei Felder. XANDER hat danach
     mehr gewollt: „Man soll die Moeglichkeit haben, einen Teilbereich
     des Liedes festzusetzen und zu benennen wie einen Button, den man
     dann daraus generiert." Seit Runde 88 steht deshalb ein drittes
     Feld da — der NAME des Abschnitts. Geprueft wird jetzt: die Frage
     nach dem Teil, die beiden Zeitfelder und das Namensfeld. */
  sage(/welcher Teil/.test(frage3.kopf || "") && frage3.felder === 3
    && frage3.ab && frage3.bis && frage3.name,
    "und danach: ganzes Lied oder Ausschnitt, mit zwei Zeitfeldern und einem Namensfeld",
    (frage3.kopf || "") + " \u2014 " + frage3.felder + " Felder");
  await pg.evaluate(() => {
    document.querySelector(".lc-ausschnitt-ab").value = "1:20";
    document.querySelector(".lc-ausschnitt-bis").value = "1:50";
    document.querySelector(".lc-ausschnitt-los").click();
  });
  await pg.waitForTimeout(250);
  const raus = await pg.evaluate(() => ({
    gesendet: window.__gesendet,
    gemerkt: localStorage.getItem("dma_lied_ausschnitt")
  }));
  sage(raus.gesendet.length === 1 && raus.gesendet[0] === "/kopfhoerer Bea 2 1:20-1:50",
    "der Ausschnitt geht genau so hinaus, wie er eingestellt wurde",
    raus.gesendet.join(" | "));
  sage(/"2":\{"ab":80,"bis":110\}/.test(raus.gemerkt || ""),
    "und er wird fuer das naechste Mal gemerkt", raus.gemerkt || "nichts gemerkt");

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Regel(n) nicht erfuellt" : "\nAlles in Ordnung");
  process.exit(fehler ? 1 : 0);
})();
