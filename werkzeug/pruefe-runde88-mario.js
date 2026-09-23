/* =====================================================================
   SONDE RUNDE 88 — DER MARIO-MODUS
   ---------------------------------------------------------------------
   XANDER: „Ich moechte auch noch ne Animation haben, wenn ich mich
   unter der oberen Reihe bewege, dass ich wie bei Super Mario an die
   Plaetze dran schlagen kann, wo Leute sitzen, und dann Power-up
   rauskommt oder Muenzen — ja, dass ich kurz mit dem Kopf da dran
   huepfe und dann kriege ich ne Muenze und noch mal ne Muenze, und die
   sollen auch in die Wertung mit eingehen bei den Tagesaufgaben …
   das kann ein Punkt sein oder fuenf Punkte … und das kann auch immer
   zufaellig sein, was man einsammelt, wirklich zufaellig und nicht
   fuenfmal dasselbe nacheinander, also nicht wie bei dem Hammer, wie du
   das zuerst gemacht hast. Da koennte auch ne Vergroesserung von meinem
   Profilbild sein, also wie bei Mario, wenn er waechst. Und da darf auch
   nichts klatschen am Abfahrtsort, bis man ankommt. Und man kann auch
   den Weg einzeichnen, auch ueber die Benutzer zeichnen, und wenn man
   das macht, dann sind die Benutzer halt Gegner: wenn er ueber sie geht
   und kickt sie dann weg oder springt auf sie drauf — entweder
   abwechselnd … und ich hab dann vielleicht auch entsprechend entweder
   mein eigenes Outfit an oder so ne Mario-Kappe."

   ZWEI SACHEN SIND HIER HEIKEL, und beide werden gemessen, nicht
   behauptet:

   1. „WIRKLICH ZUFAELLIG UND NICHT FUENFMAL DASSELBE NACHEINANDER."
      Das ist keine Geschmacksfrage, das ist nachzaehlbar. Die Sonde
      laesst dreissig Bloecke aufschlagen und schaut sich die Folge an:
      keine zwei gleichen Gaben duerfen aufeinanderfolgen, und ueber
      alle Runden muessen alle drei Gaben vorkommen. Beim Hammer war
      genau das schiefgegangen.

   2. „DA DARF AUCH NICHTS KLATSCHEN AM ABFAHRTSORT."
      Also wird gemessen, dass am verlassenen Platz waehrend des
      ganzen Laufs nichts angehaengt wird — und dass Nummer und
      Strichlinie sich nirgends bewegen, auch nicht an dem Platz, dem
      gerade gegen den Kopf gesprungen wird. Das ist Xanders stehende
      Regel, und sie ist hier besonders leicht zu verletzen.
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
const hoch = (m) => {
  if (!m || m === "none") return 0;
  const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
  return Number((z.length > 5 ? z[5] : 0).toFixed(2));
};
const breite = (m) => {
  if (!m || m === "none") return 1;
  const z = m.slice(m.indexOf("(") + 1, -1).split(",").map(Number);
  return Number(z[0].toFixed(3));
};

(async () => {
  console.log("RUNDE 88 — der Mario-Modus\n");
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
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push((this.currentSrc || this.src || "").split("/").pop()
        .split("?")[0].replace(/\.(opus|m4a)$/, ""));
      return ap.call(this);
    };
  });

  /* Gestartet wird bei EMMI auf Platz 5. Ueber ihr sitzen Alex, Bea,
     Cem und Dana; 6, 7 und 8 sind frei. Sie laeuft also nach rechts
     und stoesst genau an die drei Bloecke 2, 3 und 4. */
  const laufen = (los, kette) => pg.evaluate(([l, k]) => {
    document.querySelectorAll(".lc-mario-gabe").forEach((x) => x.remove());
    window.DMA_PRUEF.effektBuehne();
    window.__gaben = [];
    window.__toene = [];
    if (window.__beo) window.__beo.disconnect();
    window.__beo = new MutationObserver((ms) => ms.forEach((m) =>
      m.addedNodes.forEach((n) => {
        if (n.classList && n.classList.contains("lc-mario-gabe")) {
          window.__gaben.push([...n.classList]
            .find((c) => c.indexOf("lc-mario-gabe-") === 0)
            .replace("lc-mario-gabe-", ""));
        }
      })));
    window.__beo.observe(document.body, { childList: true, subtree: true });
    window.DMA_PRUEFUNG.wirkung("mariolauf", k || "", "Emmi", { los: l });
  }, [los, kette || ""]);

  console.log("DIE KAPPE UND DER LAUF\n");
  await laufen("0.4242");
  await pg.waitForTimeout(350);
  const anfang = await pg.evaluate(() => {
    const k = document.querySelector(".lc-mario-kappe");
    const m = document.querySelector(".lc-mario");
    const ab = document.querySelector('.lc-platz[data-lc-platz="5"]');
    return {
      kappe: Boolean(k),
      m: Boolean(k && k.querySelector(".lc-mario-m")),
      beiEmmi: Boolean(m && m.closest(".lc-platz")
        && m.closest(".lc-platz").dataset.lcPlatz === "5"),
      /* Was am Abfahrtsort haengt — ausser dem, was immer da ist. */
      amAbfahrtsort: [...ab.children].map((c) => c.className).join(" | "),
      unterwegs: ab.className,
      nummerDa: Boolean(ab.querySelector(".lc-nummer")),
      nummerText: (ab.querySelector(".lc-nummer") || {}).textContent,
    };
  });
  sage(anfang.kappe && anfang.m, "Mario traegt die Kappe mit dem M");
  sage(anfang.beiEmmi, "und sie sitzt auf dem Bild dessen, der laeuft");
  sage(/lc-platz-unterwegs/.test(anfang.unterwegs),
    "der Abfahrtsplatz steht auf \u201eunterwegs\u201c \u2014 dort passiert nichts",
    anfang.unterwegs);
  sage(anfang.nummerDa && anfang.nummerText === "5",
    "Nummer und Strichlinie bleiben am Abfahrtsort stehen",
    "Nummer \u201e" + anfang.nummerText + "\u201c");

  console.log("\nDER STOSS GEGEN DEN BLOCK\n");
  /* Der erste Block (Platz 2) wird bei 0,5 Feldern getroffen, also
     nach 260 ms. Gemessen wird der Ruck NACH OBEN — und dass die
     Nummer daneben sich dabei nicht ruehrt. */
  const stoss = [];
  for (const t of [200, 260, 300, 360, 460, 620]) {
    await pg.evaluate((T) => {
      document.querySelectorAll(".lc-kreis").forEach((el) =>
        el.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = T; } catch (e) {} }));
    }, t);
    await pg.waitForTimeout(50);
    stoss.push(await pg.evaluate(() => {
      const pl = document.querySelector('.lc-platz[data-lc-platz="2"]');
      const n = pl.querySelector(".lc-nummer");
      const s = pl.querySelector(".lc-schild");
      return { kreis: getComputedStyle(pl.querySelector(".lc-kreis")).transform,
               nummer: n ? getComputedStyle(n).transform : "none",
               schild: s ? getComputedStyle(s).transform : "none" };
    }));
  }
  const rucke = stoss.map((s) => hoch(s.kreis));
  sage(Math.min.apply(null, rucke) < -8,
    "der getroffene Block macht einen Satz nach oben",
    rucke.map((r) => r.toFixed(1)).join(", ") + " px");
  sage(Math.abs(rucke[rucke.length - 1]) < 3,
    "und faellt danach wieder an seinen Platz", rucke[rucke.length - 1] + " px");
  const nummerFest = stoss.every((s) => s.nummer === stoss[0].nummer);
  const schildFest = stoss.every((s) => s.schild === stoss[0].schild);
  sage(nummerFest && schildFest,
    "Nummer und Strichlinie bewegen sich dabei KEINEN Pixel — Xanders stehende Regel",
    "Nummer " + (nummerFest ? "fest" : "bewegt") + ", Schild "
      + (schildFest ? "fest" : "bewegt"));

  console.log("\nWIRKLICH ZUFAELLIG — UND NIE ZWEIMAL DASSELBE\n");
  const folgen = [];
  for (let i = 0; i < 10; i++) {
    await laufen((0.1 + i * 0.0917).toFixed(4));
    await pg.waitForTimeout(2300);
    folgen.push(await pg.evaluate(() => window.__gaben || []));
  }
  const alle = [].concat.apply([], folgen);
  sage(alle.length === 30,
    "zehn Laeufe, drei Bloecke — dreissig Gaben", alle.length + " gezaehlt");
  let doppelt = 0;
  folgen.forEach((f) => f.forEach((x, i) => { if (i && x === f[i - 1]) doppelt++; }));
  sage(doppelt === 0,
    "nie zweimal dasselbe hintereinander — das war die Kritik am Hammer",
    doppelt + " Wiederholungen in " + folgen.map((f) => f.join("/")).slice(0, 3).join("  ·  ") + " …");
  const arten = ["muenze", "gold", "pilz"];
  const zaehl = {};
  arten.forEach((a) => { zaehl[a] = alle.filter((x) => x === a).length; });
  sage(arten.every((a) => zaehl[a] >= 5),
    "und alle drei Gaben kommen wirklich vor, keine faellt aus",
    arten.map((a) => a + " " + zaehl[a]).join(", "));
  const verschieden = new Set(folgen.map((f) => f.join("-"))).size;
  sage(verschieden >= 6,
    "verschiedene Lose geben verschiedene Folgen — es ist kein fester Plan",
    verschieden + " verschiedene Folgen bei 10 Laeufen");

  console.log("\nDER PILZ LAESST MARIO WACHSEN\n");
  /* Ein Lauf, in dem ein Pilz vorkommt: vorher und nachher wird die
     Groesse des Bildes gemessen. */
  let gewachsen = null;
  for (let i = 0; i < 12 && !gewachsen; i++) {
    const los = (0.31 + i * 0.061).toFixed(4);
    await laufen(los);
    await pg.waitForTimeout(2300);
    const g = await pg.evaluate(() => window.__gaben || []);
    const nr = g.indexOf("pilz");
    if (nr < 0) continue;
    /* Der Pilz kommt aus dem Block ueber Feld nr+1 — also bei
       (nr + 0.5) * 520 ms; gewachsen ist er ab (nr + 1) * 520. */
    await laufen(los);
    await pg.waitForTimeout(250);
    const vorher = (nr + 0.5) * 520 - 60;
    const nachher = (nr + 1) * 520 + 80;
    const lies = async (t) => {
      await pg.evaluate((T) => {
        document.querySelectorAll(".lc-kreis").forEach((el) =>
          el.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = T; } catch (e) {} }));
      }, t);
      await pg.waitForTimeout(50);
      return pg.evaluate(() => {
        const m = document.querySelector(".lc-mario");
        return m ? getComputedStyle(m).transform : "none";
      });
    };
    gewachsen = { nr: nr, vor: breite(await lies(vorher)), nach: breite(await lies(nachher)) };
  }
  if (!gewachsen) sage(false, "in zwoelf Laeufen kam kein Pilz — das kann nicht sein");
  else {
    sage(gewachsen.nach > gewachsen.vor * 1.2,
      "nach dem Pilz ist das Profilbild groesser \u2014 \u201ewie bei Mario, wenn er waechst\u201c",
      gewachsen.vor + " → " + gewachsen.nach + " (Block " + (gewachsen.nr + 1) + ")");
  }

  console.log("\nGEZEICHNETER WEG: DIE BESETZTEN SIND GEGNER\n");
  /* EIN LAUF UEBER DIE DREI BESETZTEN, MITGESCHRIEBEN WAEHREND ER LAEUFT.
     Jede Behandlung dauert 1,5 s und wird danach wieder abgeraeumt — wer
     erst am Ende hinsieht, findet beim ersten Gegner nichts mehr und
     haelt es faelschlich fuer einen Fehler. */
  const gegnerLauf = async (los) => {
    await laufen(los, "5-1-2-3");
    const gesehen = { 1: "", 2: "", 3: "" };
    for (let i = 0; i < 26; i++) {
      await pg.waitForTimeout(110);
      const jetzt = await pg.evaluate(() => {
        const raus = {};
        ["1", "2", "3"].forEach((n) => {
          const k = document.querySelector('.lc-platz[data-lc-platz="' + n + '"] .lc-kreis');
          raus[n] = k ? k.className : "";
        });
        return raus;
      });
      ["1", "2", "3"].forEach((n) => {
        if (!gesehen[n] && /lc-mario-(geplaettet|gekickt)/.test(jetzt[n])) gesehen[n] = jetzt[n];
      });
    }
    return {
      plaetze: ["1", "2", "3"].map((n) => ({ nr: n, k: gesehen[n] })),
      toene: await pg.evaluate(() => window.__toene || []),
    };
  };

  /* RUNDE 98 — XANDER: „Die Sachen sollen bisschen zufaellig ablaufen,
     dass er manchmal jemanden kickt und manchmal jemanden durch drauf
     springen erledigt."
     Bis Runde 98 stand hier die alte Regel aus Runde 88: die Folge
     musste GENAU „sks" sein, also stur abwechselnd. Genau das hat er
     jetzt abbestellt — abwechselnd ist nicht zufaellig. Eine einzelne
     Folge beweist aber gar nichts, deshalb laufen ZEHN Laeufe mit
     verschiedenen „los"-Werten (das ist der Wuerfelstart, der mit der
     Nachricht mitreist). Gemessen wird dreierlei:
       a) in jedem Lauf wird jeder Besetzte erledigt,
       b) ueber alle Laeufe kommen BEIDE Arten vor und es ist nicht
          jedes Mal dieselbe Folge (sonst waere es wieder fest),
       c) innerhalb eines Laufs nie dreimal dasselbe hintereinander —
          das ist seine alte Hammer-Regel, die er nie zurueckgenommen
          hat. */
  const gegnerFolgen = [];
  let gegner = null;
  for (let i = 0; i < 10; i++) {
    gegner = await gegnerLauf((0.07 + i * 0.0931).toFixed(4));
    gegnerFolgen.push(gegner.plaetze.map((p) => /geplaettet/.test(p.k) ? "s"
      : /gekickt/.test(p.k) ? "k" : "-").join(""));
  }
  sage(gegnerFolgen.every((f) => !/-/.test(f)),
    "auf dem gezeichneten Weg wird jeder Besetzte erledigt",
    gegnerFolgen.join(" ") + " (s = Sprung, k = Kick, - = nichts)");
  const alleG = gegnerFolgen.join("");
  sage(/s/.test(alleG) && /k/.test(alleG) && new Set(gegnerFolgen).size > 1,
    "und zwar GEWUERFELT: mal draufspringen, mal wegkicken",
    "Sprung " + (alleG.match(/s/g) || []).length + "\u00d7, Kick "
    + (alleG.match(/k/g) || []).length + "\u00d7, "
    + new Set(gegnerFolgen).size + " verschiedene Folgen in 10 L\u00e4ufen");
  sage(gegnerFolgen.every((f) => !/sss|kkk/.test(f)),
    "aber nie dreimal dasselbe hintereinander",
    gegnerFolgen.filter((f) => /sss|kkk/.test(f)).join(" ") || "keine Dreierkette");
  /* RUNDE 98 — XANDER: „Meinetwegen kannst du den Schrei mit dazu
     bringen aber diese Sounds sollen mit vorhanden sein."
     Also muessen BEIDE da sein: das Mario-Geraeusch UND der Schrei. */
  sage(gegner.toene.some((t) => /^mario(stampf|kick|feuer)$/.test(t)),
    "dabei laeuft das Mario-Ger\u00e4usch (Stampfen/Kicken)",
    gegner.toene.filter((t) => /^mario/.test(t)).join(", ") || "kein Mario-Ger\u00e4usch");
  sage(gegner.toene.some((t) => t === "schreimann" || t === "schreifrau"),
    "und der Schrei ist \u201emeinetwegen\u201c mit dabei",
    gegner.toene.filter((t) => /schrei/.test(t)).join(", ") || "kein Schrei");

  console.log("\nAM ABFAHRTSORT PASSIERT NICHTS\n");
  await laufen("0.9");
  const wache = [];
  for (let i = 0; i < 8; i++) {
    await pg.waitForTimeout(240);
    wache.push(await pg.evaluate(() => {
      const ab = document.querySelector('.lc-platz[data-lc-platz="5"]');
      return [...ab.children].map((c) => c.className)
        .filter((c) => !/lc-kreis|lc-schild|lc-platz-name/.test(c)).join("|");
    }));
  }
  const fremd = wache.filter(Boolean);
  sage(fremd.length === 0,
    "waehrend des ganzen Laufs haengt am verlassenen Platz nichts Neues",
    fremd.length ? fremd.join(" / ") : "acht Stichproben, alle leer");

  console.log("\nDIE TOENE UND DIE BEFEHLSTUER\n");
  await laufen("0.33");
  await pg.waitForTimeout(2300);
  const toene = await pg.evaluate(() => window.__toene || []);
  sage(toene.filter((t) => t === "mariomuenze" || t === "mariopilz").length === 3,
    "jeder getroffene Block hat seinen eigenen Ton",
    toene.join(", "));
  const lc = fs.readFileSync(path.join(WURZEL, "livechat.js"), "utf8");
  sage(/w: "mario",/.test(lc), "\u201e/mario\u201c steht in der Befehlsliste");
  sage(/w\.push\("mariolauf"\)/.test(lc),
    "und die Wirkung ist als Tuer angemeldet — sonst waere sie toter Code");
  ["mariomuenze", "mariopilz"].forEach((n) => {
    sage(fs.existsSync(path.join(WURZEL, "ton", n + ".opus"))
      && fs.existsSync(path.join(WURZEL, "ton", n + ".m4a")),
      "der Ton \u201e" + n + "\u201c liegt als Datei da");
  });

  await br.close(); srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
    : "\nDreissig Bloecke, nie zweimal dasselbe — und am Abfahrtsort bleibt es still.\n");
  process.exit(fehler ? 1 : 0);
})();
