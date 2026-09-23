#!/usr/bin/env node
/* =====================================================================
   SONDE RUNDE 98 — MARIO: KEIN SCHREI, ECHTER ZUFALL, GEHEIMES FELD
   ---------------------------------------------------------------------
   XANDER (23.09.2026): „Bei den Mario, wenn man auf jemand drauf
   springt oder jemanden beeinflusst und ihn dadurch von der Buehne
   holt, kommt immer noch ein Schrei. Im normalen Mario Spiel kommt
   auch kein Schrei, da sollst du Sounds machen wie zum Beispiel man
   springt auf dem Panzer von so einer Schildkroete oder man kickt den
   Gegner weg, das sollen dann die typischen Sounds wie bei Mario sein.
   Die Sachen sollen bisschen zufaellig ablaufen, dass er manchmal
   jemanden kickt und manchmal jemanden durch drauf springen erledigt
   und manchmal kann er auch ein Geheimnis Feld freischalten, wenn er
   irgendwie unterwegs ist und ueber ihm ist vielleicht irgendwas, dass
   er dann dran springt und das geheime Feld freischaltet und
   vielleicht ein Power-up kriegt und so, ja, vielleicht koennte er
   dann 'ne Feuerblume haben und dann noch mal die Leute anbrennen."

   DREI MESSUNGEN:
     1  Beim Erledigen eines Gegners klingt KEIN Schrei mehr — nur
        „mariostampf" bzw. „mariokick".
     2  Ueber viele Laeufe kommen BEIDE Arten vor, und sie wechseln
        sich nicht stur ab (das war der alte Stand: gegner.length % 2).
     3  Ueber einem LEEREN Platz kann ein geheimer Fragezeichenstein
        stecken. Kommt er, springt die Feuerblume heraus, Marios Bild
        glueht — und jeder weitere Gegner wird angebrannt statt
        gestampft oder gekickt.
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WURZEL = path.join(__dirname, "..");
const TYP = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".opus": "audio/ogg", ".m4a": "audio/mp4" };

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

  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"] });
  const pg = await br.newPage({ viewport: { width: 460, height: 900 } });
  await pg.addInitScript(() => { try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {} });
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html",
    { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.DMA_PRUEF && window.DMA_PRUEF.effektBuehne,
    { timeout: 20000 });

  /* Alles, was klingt, wird mitgeschrieben. */
  await pg.evaluate(() => {
    const ap = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.__toene = window.__toene || [];
      window.__toene.push((this.currentSrc || this.src || "").split("/").pop()
        .split("?")[0].replace(/\.(opus|m4a|mp3)$/, ""));
      return ap.call(this);
    };
    /* Ein Lauf, und danach steht da, was WIRKLICH zu sehen war.
       Gemessen wird waehrend der Animation, nicht danach — hinterher
       ist alles wieder aufgeraeumt. */
    window.__marioLauf = async function (weg, von, los, umbau) {
      window.DMA_PRUEF.effektBuehne();
      if (umbau) umbau();
      window.__toene = [];
      const gesehen = { kick: [], platt: [], brand: [] };
      let block = 0, geheim = 0, blume = 0, ball = 0, feurig = 0;
      const schau = setInterval(() => {
        document.querySelectorAll(".lc-platz").forEach((p) => {
          const k = p.querySelector(".lc-kreis"); if (!k) return;
          const nr = p.getAttribute("data-lc-platz");
          if (k.classList.contains("lc-mario-gekickt") && gesehen.kick.indexOf(nr) < 0)
            gesehen.kick.push(nr);
          if (k.classList.contains("lc-mario-geplaettet") && gesehen.platt.indexOf(nr) < 0)
            gesehen.platt.push(nr);
          if (k.classList.contains("lc-mario-verbrannt") && gesehen.brand.indexOf(nr) < 0)
            gesehen.brand.push(nr);
          if (k.classList.contains("lc-mario-block")) block++;
          if (k.classList.contains("lc-mario-feurig")) feurig++;
        });
        geheim += document.querySelectorAll(".lc-mario-geheimblock").length;
        blume += document.querySelectorAll(".lc-mario-gabe-feuerblume").length;
        ball += document.querySelectorAll(".lc-mario-feuerball").length;
      }, 55);
      window.DMA_PRUEFUNG.wirkung("mariolauf", weg, von, { los: los });
      await new Promise((f) => setTimeout(f, 5200));
      clearInterval(schau);
      return { toene: (window.__toene || []).slice(), gesehen: gesehen,
               block: block, geheim: geheim, blume: blume, ball: ball, feurig: feurig };
    };
    /* Die Buehne fuer das geheime Feld: ueber den Feldern 6 und 7
       sitzt NIEMAND (Plaetze 2 und 3 frei) — genau dort kann etwas
       versteckt sein. Auf 6, 7 und 8 sitzen die Gegner. */
    window.__geheimBuehne = function () {
      const setz = (nr, name) => {
        const p = document.querySelector('[data-lc-platz="' + nr + '"]');
        if (!p) return;
        const n = p.querySelector(".lc-platz-name");
        if (name) {
          p.classList.remove("lc-platz-frei");
          p.classList.add("lc-platz-belegt");
          if (n) n.textContent = name;
        } else {
          p.classList.remove("lc-platz-belegt");
          p.classList.add("lc-platz-frei");
          if (n) n.textContent = "";
        }
      };
      setz(2, ""); setz(3, "");
      setz(6, "Fritz"); setz(7, "Gina"); setz(8, "Hans");
    };
  });

  console.log("\n1  KEIN SCHREI MEHR BEIM ERLEDIGEN\n");
  const lauf = await pg.evaluate(() => window.__marioLauf("2-3-4", "Emmi", 0.42));
  const erledigt = lauf.gesehen.kick.length + lauf.gesehen.platt.length;
  sage(erledigt > 0, "die Gegner werden wirklich erledigt",
    erledigt + " Gegner (gekickt " + (lauf.gesehen.kick.join(",") || "-")
    + ", geplaettet " + (lauf.gesehen.platt.join(",") || "-") + ")");
  sage(lauf.toene.indexOf("schreimann") < 0 && lauf.toene.indexOf("schreifrau") < 0
    && lauf.toene.indexOf("schrei") < 0,
    "und dabei schreit niemand mehr", lauf.toene.join(", ") || "nichts");
  sage(lauf.toene.indexOf("mariostampf") >= 0 || lauf.toene.indexOf("mariokick") >= 0,
    "stattdessen klingt das Spielgeraeusch", lauf.toene.join(", ") || "nichts");

  console.log("\n2  ZUFALL STATT STURER ABWECHSLUNG\n");
  const muster = [];
  for (let i = 0; i < 12; i++) {
    const r = await pg.evaluate((los) => window.__marioLauf("2-3-4", "Emmi", los),
      0.07 + i * 0.0813);
    /* Das Muster in der Reihenfolge der Felder 2, 3, 4. */
    let m = "";
    ["2", "3", "4"].forEach((nr) => {
      m += r.gesehen.kick.indexOf(nr) >= 0 ? "K"
        : r.gesehen.platt.indexOf(nr) >= 0 ? "S"
        : r.gesehen.brand.indexOf(nr) >= 0 ? "F" : "-";
    });
    muster.push(m);
  }
  const alle = muster.join(" ");
  const hatK = /K/.test(alle), hatS = /S/.test(alle);
  sage(hatK && hatS, "beides kommt vor: Draufspringen UND Wegkicken", alle);
  /* Der alte Stand war immer „SKS" — abwechselnd, immer gleich
     anfangend. Wenn heute mindestens zwei verschiedene Muster
     herauskommen, ist es kein Abwechseln mehr. */
  const arten = Array.from(new Set(muster.filter((m) => !/-/.test(m))));
  sage(arten.length >= 2, "und es kommt nicht jedes Mal dasselbe heraus",
    arten.length + " verschiedene Muster: " + arten.join(" / "));
  sage(arten.indexOf("SKS") < 0 || arten.length > 1,
    "das alte stur abwechselnde „SKS“ ist nicht mehr die Regel",
    arten.join(" / "));
  /* Dreimal dasselbe hintereinander gibt es nicht. */
  sage(!/KKK|SSS/.test(muster.join(" ")), "und nie dreimal dasselbe hintereinander",
    alle);

  console.log("\n3  DAS GEHEIME FELD UND DIE FEUERBLUME\n");
  let fund = null, versuche = 0;
  for (let i = 0; i < 22 && !fund; i++) {
    versuche++;
    const r = await pg.evaluate((los) =>
      window.__marioLauf("5-6-7-8", "Emmi", los, window.__geheimBuehne),
      0.03 + i * 0.0431);
    if (r.geheim > 0) fund = { los: (0.03 + i * 0.0431).toFixed(4), r: r };
  }
  sage(Boolean(fund), "ueber einem leeren Platz steckt manchmal ein geheimer Stein",
    fund ? "gefunden beim " + versuche + ". Lauf (los=" + fund.los + ")"
         : versuche + " Laeufe, nie einer");
  if (fund) {
    const r = fund.r;
    sage(r.blume > 0, "und heraus kommt die Feuerblume", r.blume + " Bilder lang zu sehen");
    sage(r.feurig > 0, "danach glueht Marios eigenes Bild",
      r.feurig + " Bilder lang „lc-mario-feurig“");
    sage(r.gesehen.brand.length > 0, "und die naechsten Gegner werden ANGEBRANNT",
      "Plaetze " + (r.gesehen.brand.join(", ") || "-"));
    sage(r.ball > 0, "der Feuerball fliegt dabei wirklich hinueber",
      r.ball + " Bilder lang zu sehen");
    sage(r.toene.indexOf("mariogeheim") >= 0, "der Fund klingt nach Geheimnis",
      r.toene.join(", "));
    sage(r.toene.indexOf("mariofeuer") >= 0, "und das Anbrennen nach Feuerball",
      r.toene.join(", "));
    sage(r.toene.indexOf("schreimann") < 0 && r.toene.indexOf("schreifrau") < 0,
      "auch hier schreit niemand");
  }

  /* Und die Gegenprobe: ohne geheimes Feld gibt es auch keine
     Feuerblume — sonst waere es ja keins. */
  const ohne = await pg.evaluate(() => window.__marioLauf("2-3-4", "Emmi", 0.42));
  sage(ohne.geheim === 0 && ohne.blume === 0,
    "wo ueberall jemand sitzt, gibt es kein geheimes Feld",
    "Steine " + ohne.geheim + ", Blumen " + ohne.blume);

  await br.close();
  srv.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)" : "\nalles gruen");
  process.exit(fehler ? 1 : 0);
})();
