#!/usr/bin/env node
/* =========================================================
   RUNDE 37 — RÖHRE, EIGENES LOCH, ZORRO, SPRECHBILDER AUSSEN
   ---------------------------------------------------------
   XANDER hat vier Dinge gemeldet, die sich alle messen lassen:

   1. „An der Stelle kannst du auch noch wie bei Super Mario
      früher diese Rohre machen, wo man sich so reinsetzt und
      dann irgendwo anders wieder rauskommt, mit diesem
      typischen Geräusch."
   2. „Der Maulwurf verschwindet nicht in seinem eigenen Loch.
      Man soll sich durch sein eigenes Profilbild graben."
   3. „Vielleicht kannst du auch noch so ne Animation für so
      ne Zorro Schlitzen machen."
   4. „die Blütenblätter … sollen außen am Profil sein" und
      „das Feuer … es brennt nicht außen am Ring, sondern
      innen irgendwie … wie ein Feuerring im Zirkus."

   Punkt 4 ist der wichtigste, weil er eine URSACHE hat:
   .lc-kreis traegt „overflow: hidden" (nachgemessen). Alles,
   was an .lc-kreis::after haengt, wird am Bildrand
   abgeschnitten — es KANN gar nicht nach aussen wachsen.
   Deshalb liegen die Sprechbilder jetzt an .lc-platz, und
   hier wird nachgerechnet, dass sie wirklich ueber den
   Bildrand hinausreichen.
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

/* Feuer, Funkeln und Magie liegen seit Runde 47 als echte TEILCHEN
   vor (lcSprechFeld), nicht mehr als Farbschicht — sie werden weiter
   unten mit einer eigenen Messung geprueft. */
/* „strom" steht hier seit Runde 49 NICHT mehr: er waechst
   ausdruecklich NICHT mehr ueber den Bildrand hinaus. XANDER: „bei
   dem Strom sind diese Zacken nach aussen zu viel ... innen drin
   sollen ganz filigrane, feine Blitzlinien laufen." Gemessen wird er
   deshalb weiter unten, nach seiner eigenen Vorgabe. */
/* SCHON-PASS (Xanders Liste vom 23.09.): Feuer und Welle sind seitdem
   EIN Bild im Feld (lcFeuerSvg, lcWelleSvg) — weder Teilchen noch
   Rand-Schicht. Gemessen werden sie in pruefe-sprechbilder.js nach
   den Zahlen seiner Liste. */
const SPRECHBILDER = ["regenbogen"]; /* die Bluete ist seit SCHON-PASS 6 ebenfalls ein Bild */
const TEILCHENBILDER = ["funkeln", "magie"];

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
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  /* ---------- 1. Die Befehle gehen hinaus ---------- */
  console.log("\nDIE BEFEHLE UND WAS SIE SCHICKEN\n");
  for (const [zeile, wirkung] of [["/rohr 6", "rohr"], ["/zorro Bea", "zorro"]]) {
    const paket = await pg.evaluate((z) => {
      let raus = null;
      window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
      window.LiveChat.pruefBefehl(z);
      return raus;
    }, zeile);
    pruefe("„" + zeile + "“ schickt „" + wirkung + "“",
      Boolean(paket) && String(paket.wirkung || "") === wirkung,
      paket ? (paket.wirkung || "ohne Wirkung") : "nichts abgefangen");
  }
  const platz6 = await pg.evaluate(() => {
    let raus = null;
    window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
    window.LiveChat.pruefBefehl("/rohr 6");
    return raus ? String(raus.text || "") : "";
  });
  pruefe("… und die Röhre schreibt „Platz 6“, nicht einen Namen",
    /Platz 6/.test(platz6), platz6 || "-");

  /* ---------- 2. Ein freies Ziel, sonst reist niemand ---------- */
  const frei = await pg.evaluate(() => {
    const reihe = document.getElementById("lcPlaetze");
    const vorbild = document.querySelector(".lc-platz");
    if (!reihe || !vorbild) return 0;
    if (reihe.querySelector(".lc-platz-frei")) return 6;
    const f = vorbild.cloneNode(true);
    f.className = "lc-platz lc-platz-frei";
    f.dataset.lcPlatz = "6";
    const n = f.querySelector(".lc-platz-name");
    if (n) n.textContent = "frei";
    reihe.appendChild(f);
    return 6;
  });
  pruefe("die Reihe hat ein freies Ziel", frei === 6, "Platz " + frei);

  /* ---------- 3. Die Röhre steht wirklich da ---------- */
  console.log("\nDIE GRÜNE RÖHRE\n");
  const rohr = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-roehre").forEach((x) => x.remove());
    const ersterName = ((document.querySelector(".lc-platz .lc-platz-name") || {}).textContent || "").trim();
    window.DMA_PRUEFUNG.wirkung("rohr", "6", ersterName);
    await new Promise((f) => setTimeout(f, 300));
    const alle = [...document.querySelectorAll(".lc-roehre")];
    if (!alle.length) return { anzahl: 0 };
    const k = alle[0].getBoundingClientRect();
    let laeuft = 0;
    try { laeuft = alle[0].getAnimations({ subtree: true }).length; } catch (e) {}
    return { anzahl: alle.length, breit: Math.round(k.width), hoch: Math.round(k.height),
             rand: Boolean(alle[0].querySelector(".lc-roehre-rand")),
             rein: Boolean(document.querySelector(".lc-roehre-rein")),
             raus: Boolean(document.querySelector(".lc-roehre-raus")),
             laeuft: laeuft };
  });
  pruefe("zwei Röhren — eine zum Rein-, eine zum Rauskommen", rohr.anzahl === 2, rohr.anzahl + " Stück");
  pruefe("die Röhre hat ihren breiteren Rand (wie bei Mario)", Boolean(rohr.rand));
  pruefe("Einstieg und Ausstieg sind unterscheidbar", Boolean(rohr.rein && rohr.raus));
  pruefe("die Röhre fährt wirklich hoch", (rohr.laeuft || 0) > 0, (rohr.laeuft || 0) + " Animationen");

  /* ---------- 4. Der Maulwurf gräbt im eigenen Bild ---------- */
  console.log("\nDAS EIGENE LOCH\n");
  const mw = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-grabloch, .lc-maulwurf").forEach((x) => x.remove());
    const platz = document.querySelector(".lc-platz");
    const ersterName = ((platz.querySelector(".lc-platz-name") || {}).textContent || "").trim();
    const kreis = platz.querySelector(".lc-kreis");
    const bild = kreis ? kreis.getBoundingClientRect() : null;
    window.DMA_PRUEFUNG.wirkung("maulwurf", "6", ersterName);
    await new Promise((f) => setTimeout(f, 300));
    const loch = document.querySelector(".lc-grabloch");
    if (!loch || !bild) return { da: false };
    const l = loch.getBoundingClientRect();
    /* Faellt das Loch mit dem eigenen Bild zusammen? */
    const ueberX = Math.min(l.right, bild.right) - Math.max(l.left, bild.left);
    const ueberY = Math.min(l.bottom, bild.bottom) - Math.max(l.top, bild.top);
    let sinkt = false;
    try {
      sinkt = kreis.getAnimations().some((a) => {
        const k = (a.effect && a.effect.getKeyframes) ? a.effect.getKeyframes() : [];
        return k.some((f) => String(f.transform || "").indexOf("translateY") >= 0);
      });
    } catch (e) {}
    return { da: true, ueberX: Math.round(ueberX), ueberY: Math.round(ueberY),
             breit: Math.round(l.width), sinkt: sinkt };
  });
  pruefe("das Grabloch wird gezeichnet", mw.da === true);
  pruefe("es liegt über dem EIGENEN Bild, nicht daneben",
    mw.da && mw.ueberX > 0 && mw.ueberY > 0, mw.da ? mw.ueberX + "×" + mw.ueberY + " px Überlappung" : "-");
  pruefe("das Bild versinkt senkrecht, statt in der Luft zu schrumpfen",
    Boolean(mw.sinkt));

  /* ---------- 5. Zorro ---------- */
  console.log("\nDREI HIEBE, EIN Z\n");
  const z = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-zorro").forEach((x) => x.remove());
    window.DMA_PRUEFUNG.wirkung("zorro", "Bea");
    /* Erst wenn alle drei Hiebe ausgefahren sind, laesst sich ihr
       Winkel ablesen: solange scaleX bei 0 steht, ist die Matrix
       entartet und jeder Winkel misst sich als 0°. Der dritte Hieb
       setzt bei 680 ms an, also wird bei 1000 ms gemessen. */
    await new Promise((f) => setTimeout(f, 1000));
    const el = document.querySelector(".lc-zorro");
    if (!el) return { da: false };
    const s = [...el.querySelectorAll(".lc-zorro-schnitt")];
    const winkel = s.map((x) => {
      const t = getComputedStyle(x).transform;
      if (!t || t === "none") return 0;
      const m = t.match(/matrix\(([^)]+)\)/);
      if (!m) return 0;
      const z = m[1].split(",").map(Number);
      return Math.round(Math.atan2(z[1], z[0]) * 180 / Math.PI);
    });
    const verz = s.map((x) => getComputedStyle(x).animationDelay);
    return { da: true, schnitte: s.length, winkel: winkel, verz: verz,
             degen: Boolean(el.querySelector(".lc-zorro-degen")),
             zuckt: Boolean(document.querySelector(".lc-geschlitzt")) };
  });
  pruefe("Zorro zeichnet sich", z.da === true);
  pruefe("drei Schnitte, nicht mehr und nicht weniger", z.da && z.schnitte === 3, (z.schnitte || 0) + "");
  /* Ein Z: oben quer, Schraege nach LINKS UNTEN, unten quer. Die
     Schraege muss also einen deutlich NEGATIVEN Winkel haben —
     positiv waere ein S. */
  pruefe("die Schräge läuft von rechts oben nach links unten",
    z.da && z.winkel[1] < -15, z.da ? z.winkel.join("° / ") + "°" : "-");
  pruefe("die Hiebe kommen nacheinander, nicht gleichzeitig",
    z.da && new Set(z.verz).size === 3, z.da ? z.verz.join(" ") : "-");
  pruefe("die Klinge fegt mit durchs Bild", Boolean(z.degen));
  pruefe("das getroffene Bild zuckt", Boolean(z.zuckt));

  /* ---------- 6. Die Sprechbilder liegen AUSSEN ---------- */
  console.log("\nDIE SPRECHBILDER — AUSSERHALB DES BILDES\n");
  const platzOverflow = await pg.evaluate(() => {
    const k = document.querySelector(".lc-kreis");
    const p = document.querySelector(".lc-platz");
    return { kreis: k ? getComputedStyle(k).overflow : "?",
             platz: p ? getComputedStyle(p).overflow : "?" };
  });
  pruefe("der Bildkreis schneidet ab (das war die Ursache)",
    platzOverflow.kreis === "hidden", ".lc-kreis overflow: " + platzOverflow.kreis);
  pruefe("der Platz schneidet NICHT ab — dort darf es hinauswachsen",
    platzOverflow.platz !== "hidden", ".lc-platz overflow: " + platzOverflow.platz);

  for (const art of SPRECHBILDER) {
    const d = await pg.evaluate(async (a) => {
      document.querySelectorAll(".lc-platz").forEach((p) => {
        p.classList.remove("lc-platz-spricht"); p.removeAttribute("data-sprechbild");
      });
      const pl = document.querySelectorAll(".lc-platz")[1];
      pl.classList.add("lc-platz-spricht");
      pl.setAttribute("data-sprechbild", a);
      await new Promise((f) => setTimeout(f, 420));
      const cs = getComputedStyle(pl, "::after");
      const kreis = pl.querySelector(".lc-kreis");
      const bildBreit = kreis ? kreis.getBoundingClientRect().width : 0;
      /* Wie weit reicht die Schicht ueber das Bild hinaus? Aus der
         laufenden Animation den groessten Massstab ablesen. */
      let gross = 1;
      try {
        pl.getAnimations({ subtree: true }).forEach((an) => {
          const k = (an.effect && an.effect.getKeyframes) ? an.effect.getKeyframes() : [];
          k.forEach((f) => {
            const m = String(f.transform || "").match(/scale\(([\d.]+)/);
            if (m) gross = Math.max(gross, Number(m[1]));
          });
        });
      } catch (e) {}
      return { anzeige: cs.display, breit: parseFloat(cs.width) || 0,
               animation: cs.animationName, bild: Math.round(bildBreit), gross: gross };
    }, art);
    pruefe(art + ": die Schicht ist sichtbar", d.anzeige === "block", d.anzeige);
    pruefe(art + ": sie hat eine eigene Animation",
      Boolean(d.animation) && d.animation !== "none", d.animation);
    pruefe(art + ": sie wächst über den Bildrand hinaus",
      d.gross > 1.15, "Faktor " + d.gross.toFixed(2) + " bei " + d.bild + " px Bild");
  }

  /* ---------- 6b. Der Strom: innen haarfein, aussen nichts ------
     XANDER, woertlich: „bei dem Strom sind diese Zacken nach aussen
     zu viel. Ich meine innen drin sollen ganz filigrane, feine
     Blitzlinien laufen ... Das soll eher so Ladungen sein, die auf
     dem Rahmen tanzen ... ein ganz feiner Pixel, aehnlich wie ein
     Spinnennetz von der Feinheit."
     Drei Bedingungen, drei Messungen: keine Schicht mehr AUSSEN,
     ein Netz INNEN, und die Ladungen sitzen auf dem Reifen. */
  console.log("\nDER STROM — HAARFEIN, INNEN, AUF DEM REIFEN\n");
  const st = await pg.evaluate(async () => {
    document.querySelectorAll(".lc-platz").forEach((p) => {
      p.classList.remove("lc-platz-spricht"); p.removeAttribute("data-sprechbild");
      p.querySelectorAll(".lc-sprechfeld").forEach((x) => x.remove());
    });
    const pl = document.querySelectorAll(".lc-platz")[1];
    pl.classList.add("lc-platz-spricht");
    pl.setAttribute("data-sprechbild", "strom");
    window.DMA_PRUEFUNG.sprechFeld(pl, "strom");
    await new Promise((f) => setTimeout(f, 320));
    const kreis = pl.querySelector(".lc-kreis");
    const kb = kreis.getBoundingClientRect();
    const aussen = getComputedStyle(pl, "::after");
    const netz = getComputedStyle(kreis, "::before");
    const teile = [...pl.querySelectorAll(".lc-teilchen")];
    const mx = kb.left + kb.width / 2, my = kb.top + kb.height / 2;
    const abst = teile.map((t) => {
      const b = t.getBoundingClientRect();
      return Math.hypot(b.left + b.width / 2 - mx, b.top + b.height / 2 - my);
    });
    /* offsetWidth, NICHT getBoundingClientRect().width: die Ladung ist
       um --wo gedreht, und der Kasten einer gedrehten Form ist immer
       breiter als die Form selbst. Gemessen werden soll die STRICH-
       breite, nicht die Diagonale ihres Kastens. */
    const breiten = teile.map((t) => t.offsetWidth);
    return {
      aussen: aussen.display,
      netzBild: netz.backgroundImage.slice(0, 40),
      netzAnim: netz.animationName,
      r: kb.width / 2,
      anzahl: teile.length,
      naechster: abst.length ? Math.min.apply(null, abst) : 0,
      weitester: abst.length ? Math.max.apply(null, abst) : 0,
      breiteste: breiten.length ? Math.max.apply(null, breiten) : 0
    };
  });
  pruefe("aussen strahlt nichts mehr ab", st.aussen === "none",
    ".lc-platz-spricht::after display: " + st.aussen);
  pruefe("innen liegt ein Netz aus Linien",
    st.netzBild.indexOf("svg") > -1 || st.netzBild.indexOf("url") > -1, st.netzBild);
  pruefe("und es zuckt", Boolean(st.netzAnim) && st.netzAnim !== "none", st.netzAnim);
  pruefe("die Ladungen tanzen auf dem Reifen",
    st.anzahl >= 8 && st.naechster > st.r * 0.85 && st.weitester < st.r * 1.2,
    st.anzahl + " Stueck, " + Math.round(st.naechster) + "–"
      + Math.round(st.weitester) + " px bei Bildradius " + Math.round(st.r) + " px");
  /* „die nie so ne Dicke haben wie du sie hast" — eine Ladung darf
     hoechstens ein Zwanzigstel des Bildradius breit sein. Vorher war
     ein Blitzkeil 0,5 rem = 8 px breit, also ein Fuenftel. */
  pruefe("und sie sind haarfein",
    st.breiteste > 0 && st.breiteste < st.r * 0.09,
    st.breiteste.toFixed(1) + " px breit bei Bildradius " + Math.round(st.r) + " px");

  /* ---------- 7. Die Teilchen liegen AUSSERHALB des Bildes ----- */
  console.log("\nFEUER, FUNKELN UND MAGIE — TEILCHEN AM RAND\n");
  /* XANDER: „es soll niemals irgendwas im Kreis sein ausser den
     Blasen und bei dem Eis", „in der Mitte soll kein Feuer sein",
     „bei Magie da sind die in der Mitte".
     Die Teilchen wurden mit „translateX(--weit)" auf ihre Kreisbahn
     gesetzt — Prozente zaehlen dort aber die Breite des TEILCHENS,
     und ein Funke ist fuenf Pixel breit. Alle sassen uebereinander in
     der Bildmitte. Gemessen wird deshalb der echte Abstand jedes
     Teilchens von der Bildmitte. */
  for (const art of TEILCHENBILDER) {
    const d = await pg.evaluate(async (a) => {
      document.querySelectorAll(".lc-platz").forEach((p) => {
        p.classList.remove("lc-platz-spricht"); p.removeAttribute("data-sprechbild");
        const f = p.querySelector(".lc-sprechfeld"); if (f) f.remove();
      });
      const pl = document.querySelectorAll(".lc-platz")[1];
      pl.classList.add("lc-platz-spricht");
      pl.setAttribute("data-sprechbild", a);
      window.DMA_PRUEFUNG.sprechFeld(pl, a);
      await new Promise((f) => setTimeout(f, 300));
      const kreis = pl.querySelector(".lc-kreis").getBoundingClientRect();
      const mx = kreis.left + kreis.width / 2, my = kreis.top + kreis.height / 2;
      const teile = [...pl.querySelectorAll(".lc-teilchen")];
      /* BEIM FEUER ZAEHLT DER FUSSPUNKT, NICHT DIE MITTE DES KASTENS.
         XANDER: „Die soll richtig wie echtes Feuer an diesem
         Feuerring sein." Eine Flamme steht MIT DEM FUSS auf dem
         Reifen und leckt nach oben ueber das Bild — genau das ist
         Feuer. Wer die Mitte ihres Kastens misst, misst die Mitte
         der Flamme und haelt jede ordentliche Flamme fuer zu weit
         innen; dann bleiben nur Streichhoelzer uebrig.
         Der Fusspunkt steht in --links/--oben, in Prozent des
         Feldes — daraus laesst er sich genau ausrechnen. */
      const feld = pl.querySelector(".lc-sprechfeld");
      const fk = feld ? feld.getBoundingClientRect() : null;
      const fussPunkt = (t) => {
        if (!fk) return null;
        const l = parseFloat(getComputedStyle(t).getPropertyValue("--links"));
        const o = parseFloat(getComputedStyle(t).getPropertyValue("--oben"));
        if (!isFinite(l) || !isFinite(o)) return null;
        return { x: fk.left + fk.width * l / 100, y: fk.top + fk.height * o / 100 };
      };
      const abstand = teile.map((t) => {
        const f = a === "feuer" ? fussPunkt(t) : null;
        if (f) return Math.hypot(f.x - mx, f.y - my);
        const b = t.getBoundingClientRect();
        return Math.hypot(b.left + b.width / 2 - mx, b.top + b.height / 2 - my);
      });
      return { anzahl: teile.length, r: kreis.width / 2,
               naechster: abstand.length ? Math.min.apply(null, abstand) : 0,
               weitester: abstand.length ? Math.max.apply(null, abstand) : 0 };
    }, art);
    pruefe(art + ": es gibt Teilchen", d.anzahl >= 10, d.anzahl + " Stück");
    /* „drin" heisst: die Mitte des Teilchens liegt deutlich innerhalb
       des Bildes. Beim Feuer darf die Flamme ueber den Rand lecken,
       ihr Fusspunkt liegt aber draussen. */
    pruefe(art + (art === "feuer" ? ": kein Fusspunkt sitzt mitten im Bild"
                                    : ": keines sitzt mitten im Bild"),
      d.naechster > d.r * (art === "feuer" ? 0.9 : 0.72),
      "nächstes " + Math.round(d.naechster) + " px, Bildradius " + Math.round(d.r) + " px");
    pruefe(art + ": sie liegen auf einem Ring, nicht gehäuft",
      (d.weitester - d.naechster) < d.r * 0.9,
      "Spanne " + Math.round(d.weitester - d.naechster) + " px");
  }

  await br.close(); srv.close();
  console.log(fehler ? "\nROT: " + fehler + " Abweichung(en)\n"
                     : "\nRöhre, eigenes Loch, Zorro und die Sprechbilder sitzen.\n");
  process.exit(fehler ? 1 : 0);
})();
