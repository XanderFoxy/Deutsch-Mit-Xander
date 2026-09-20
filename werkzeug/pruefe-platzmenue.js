#!/usr/bin/env node
/* =========================================================
   DAS MENUE AM PROFILBILD — UND WAS ES AUSLOEST
   ---------------------------------------------------------
   GEWUENSCHT: „Wenn man jemand anderen gedrückt hält, dann
   sollen nur diese Befehle sein … es könnte noch ein Kick
   sein, wo man gegen das Profilbild tritt und das dann wie
   so ein Fussball wegfliegt … Man kann auch die Herzen direkt
   an die Person schicken … oder dass man Wassereimer drüber
   kippt … oder eine Wolke über denjenigen, wo man es regnen
   lässt … Aber das sind dann nur ganz kleine Symbole, die
   halt passend in der Größe vom Profilbild sind."

   Gemessen wird:
   1. Jeder neue Befehl ist da und schickt die richtige Wirkung
      MIT NAMEN los (ohne Namen trifft sie niemanden).
   2. Jede Animation haengt danach wirklich AM PLATZ — und
      nicht irgendwo im Dokument.
   3. Sie ist nicht groesser als der Platz: „in der Groesse vom
      Profilbild".
   4. Der lange Druck oeffnet das Menue, und ein Tipp daneben
      macht es wieder zu.
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

/* Befehl -> erwartete Wirkung -> Klasse, die am Platz haengen muss */
const PAARE = [
  ["/tritt Emmi",    "tritt",       "lc-tritt"],
  ["/herz Emmi",     "zherz",       "lc-zherz"],
  ["/wasser Emmi",   "eimer",       "lc-eimer"],
  ["/wecker Emmi",   "wecker",      "lc-wecker"],
  ["/regen Emmi",    "regenwolke",  "lc-zwolke"],
  ["/gewitter Emmi", "donnerwolke", "lc-zdonner"],
  ["/geld Emmi",     "reichtum",    "lc-zgeld"],
  ["/bonbon Emmi",   "zucker",      "lc-zzucker"],
  ["/hammer Emmi",   "hammer",      "lc-zhammer"]
];
/* Der Wagenheber und das Lasso gehen einen anderen Weg: sie AENDERN
   die Sitzordnung und schicken die Animation nur nebenbei mit. Sie
   werden deshalb weiter unten einzeln geprueft. */

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
  const aufSeite = [];
  pg.on("pageerror", (e) => aufSeite.push(String(e).slice(0, 140)));
  await pg.goto("http://127.0.0.1:" + srv.address().port + "/index.html", { waitUntil: "domcontentloaded" });
  await pg.waitForFunction(() => window.LiveChat && window.LiveChat.pruefBefehl, { timeout: 20000 });
  await pg.evaluate(() => window.DMA_PRUEF.effektBuehne());

  console.log("\nDIE BEFEHLE — UND WAS SIE SCHICKEN\n");
  for (const [zeile, wirkung] of PAARE) {
    const paket = await pg.evaluate((z) => {
      let raus = null;
      window.LiveChat.pruefPost((p) => { if (!raus) raus = p; });
      window.LiveChat.pruefBefehl(z);
      return raus;
    }, zeile);
    pruefe("„" + zeile + "“ schickt die Wirkung „" + wirkung + "“",
      Boolean(paket) && String(paket.wirkung || "") === wirkung,
      paket ? (paket.wirkung || "ohne Wirkung") + " · " + String(paket.text || "") : "nichts abgefangen");
    pruefe("… und sagt, WEN es meint", Boolean(paket && paket.wen === "Emmi"),
      paket ? "wen=" + (paket.wen || "FEHLT") : "-");
  }

  console.log("\nDIE ANIMATION HAENGT AM PLATZ\n");
  for (const [, wirkung, klasse] of PAARE) {
    const d = await pg.evaluate(async (w) => {
      document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.wirkung(w, "Emmi");
      await new Promise((f) => setTimeout(f, 160));
      const schicht = document.querySelector(".lc-zp");
      if (!schicht) return { da: false };
      const platz = schicht.closest(".lc-platz");
      const kreis = platz ? platz.querySelector(".lc-kreis") : null;
      const sr = schicht.getBoundingClientRect();
      /* Gemessen wird am KREIS — das ist das Profilbild, und „in der
         Groesse vom Profilbild" war die Ansage.

         GEAENDERT, und zwar mit Absicht: die Schicht haengt seit
         Fassung 345 nicht mehr IM Kreis, sondern am Platz. Der Kreis
         traegt „overflow: hidden" (sonst waere das Bild nicht rund)
         und schnitt alles ab, was darueber hinausragt — gemessen
         blieben vom Hammer 64 %, vom Eimer 33 %, vom Wecker 52 % und
         von der Regenwolke 21 % uebrig. Gemeldet war genau das: „ich
         moechte, dass der Hammer und sowas sichtbar ist."

         Die Frage ist deshalb jetzt eine andere, aber nicht die
         leichtere: die Schicht muss DENSELBEN KASTEN haben wie das
         Profilbild — gleich breit, gleich hoch, an derselben Stelle.
         Der alte Fehler (334 px breiter als das Bild) faellt damit
         weiterhin auf. */
      /* GEMESSEN WIRD AM LAYOUT, NICHT AM GEMALTEN BILD.
         getBoundingClientRect() rechnet jede Animation mit: waehrend
         der Tritt laeuft, fliegt der Kreis gerade quer durchs Bild
         und ist halb so gross. Zwei Anlaeufe lang sah es deshalb so
         aus, als saesse die Schicht falsch — sie sass richtig, nur
         der Kreis war unterwegs. offsetWidth und offsetTop kennen
         keine transform und sagen, was wirklich gilt. */
      return {
        da: true,
        amPlatz: Boolean(platz),
        name: platz ? (platz.querySelector(".lc-platz-name") || {}).textContent : "",
        klassen: schicht.className,
        deckung: kreis ? Math.abs(schicht.offsetWidth - kreis.offsetWidth)
                       + Math.abs(schicht.offsetHeight - kreis.offsetHeight)
                       + Math.abs(schicht.offsetLeft - kreis.offsetLeft)
                       + Math.abs(schicht.offsetTop - kreis.offsetTop) : 999,
        kinder: schicht.children.length
      };
    }, wirkung);
    pruefe(wirkung + " zeichnet etwas", d.da && d.kinder > 0,
      d.da ? d.kinder + " Teile" : "nichts");
    pruefe(wirkung + " haengt am richtigen Platz", Boolean(d.amPlatz) && /Emmi/i.test(d.name || ""),
      (d.name || "-").trim());
    pruefe(wirkung + " deckt genau das Profilbild ab",
      d.deckung <= 4,
      d.deckung + " px Abweichung (Breite, Hoehe, Lage zusammen)");
    pruefe(wirkung + " traegt ihre eigene Klasse", String(d.klassen || "").indexOf(klasse) >= 0,
      d.klassen || "-");
  }

  /* =========================================================
     WIRD DAS, WAS GEZEICHNET WIRD, AUCH GESEHEN?
     ---------------------------------------------------------
     GEMELDET: „Ich moechte, dass der Hammer und sowas sichtbar
     ist." Er WAR gezeichnet — nur abgeschnitten. Deshalb genuegt
     es nicht, zu pruefen, dass ein Element da ist: es muss auch
     durch keinen Vorfahren beschnitten werden. Die Sonde geht
     dafuer den ganzen Weg nach oben und schneidet jeden Kasten
     mit, der „overflow" ungleich visible hat — genau das, was der
     Browser auch tut.
     ========================================================= */
  console.log("\nUND SIEHT MAN ES AUCH?\n");
  for (const [w, sel, wie] of [["hammer", ".lc-zhammer-bild", "der Hammer"],
                               ["eimer", ".lc-eimer-bild", "der Eimer"],
                               /* Der Wecker hat kein eigenes Bild mehr: seit
                                  Fassung 347 IST das Profilbild der Wecker, und
                                  die Schellen sitzen links und rechts oben wie
                                  Ohren. Gemessen wird deshalb an einer Schelle. */
                               ["wecker", ".lc-schelle-l", "die linke Schelle"],
                               ["regenwolke", ".lc-zwolke-bild", "die Wolke"],
                               ["tritt", ".lc-tritt-schuh", "der Schuh"]]) {
    const d = await pg.evaluate(async ({ w, s }) => {
      document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.wirkung(w, "Emmi");
      await new Promise((f) => setTimeout(f, 200));
      const el = document.querySelector(s);
      if (!el) return { fehlt: true };
      const a = el.getBoundingClientRect();
      let l = 0, t = 0, r = innerWidth, b = innerHeight, wer = "Fenster";
      let p = el.parentElement;
      while (p) {
        const g = getComputedStyle(p);
        if (g.overflow !== "visible") {
          const k = p.getBoundingClientRect();
          l = Math.max(l, k.left); t = Math.max(t, k.top);
          r = Math.min(r, k.right); b = Math.min(b, k.bottom);
          wer = String(p.className || p.tagName).split(/\s+/)[0];
        }
        p = p.parentElement;
      }
      const ix = Math.max(0, Math.min(a.right, r) - Math.max(a.left, l));
      const iy = Math.max(0, Math.min(a.bottom, b) - Math.max(a.top, t));
      const ganz = a.width * a.height;
      return { sichtbar: ganz ? Math.round(ix * iy / ganz * 100) : -1, klipper: wer };
    }, { w, s: sel });
    pruefe(wie + " wird nicht abgeschnitten", !d.fehlt && d.sichtbar >= 99,
      d.fehlt ? "gar nicht gezeichnet" : d.sichtbar + " % sichtbar (letzte Blende: " + d.klipper + ")");
  }

  /* Und die Gegenprobe: was INNEN bleiben soll, bleibt innen. */
  for (const [w, sel, wie] of [["eimer", ".lc-wasserstand", "der Wasserstand"],
                               ["reichtum", ".lc-geldstand", "der Geldhaufen"]]) {
    const d = await pg.evaluate(async ({ w, s }) => {
      document.querySelectorAll(".lc-zp").forEach((x) => x.remove());
      window.DMA_PRUEFUNG.wirkung(w, "Emmi");
      await new Promise((f) => setTimeout(f, 200));
      const el = document.querySelector(s);
      if (!el) return { fehlt: true };
      const blende = el.closest(".lc-zp-blende");
      return { blende: Boolean(blende),
               rund: blende ? getComputedStyle(blende).borderRadius : "",
               zu: blende ? getComputedStyle(blende).overflow : "" };
    }, { w, s: sel });
    pruefe(wie + " liegt in der runden Blende",
      !d.fehlt && d.blende && d.zu === "hidden" && /50%/.test(d.rund),
      d.fehlt ? "fehlt" : (d.blende ? d.zu + ", " + d.rund : "keine Blende"));
  }

  console.log("\nDER LANGE DRUCK\n");
  const menue = await pg.evaluate(async () => {
    const platz = document.querySelector('.lc-platz[data-lc-platz="2"]');
    if (!platz) return { fehlt: "kein Platz 2" };
    /* Den langen Druck nachstellen: das Menue direkt rufen, so wie es
       der Halte-Zeitgeber tut. */
    const auf = window.DMA_PRUEFUNG.platzMenue(platz);
    const k = document.getElementById("lcPlatzMenue");
    const r = k ? k.getBoundingClientRect() : null;
    return {
      auf: auf,
      da: Boolean(k),
      knoepfe: k ? k.querySelectorAll(".lc-platzmenue-knopf").length : 0,
      kopf: k ? (k.querySelector(".lc-platzmenue-kopf") || {}).textContent : "",
      imBild: r ? (r.left >= 0 && r.top >= 0 && r.right <= window.innerWidth + 1) : false,
      /* GEMELDET: „Beim Android muss man unten scrollen, um zum
         Hammer zu kommen. In dem Moment, wo man scrollt, waehlt sich
         das Menue wieder ab." Also wird genau das gemessen: muss man
         rollen? scrollHeight ist, wie hoch der Inhalt WAERE,
         clientHeight, wie viel Platz er hat. */
      hoch: k ? k.scrollHeight : 0,
      passt: k ? k.scrollHeight <= k.clientHeight + 1 : false,
      /* Und der Hammer ist der letzte Knopf — er muss sichtbar sein,
         ohne dass jemand rollt. */
      hammerUnten: (() => {
        if (!k || !r) return 999;
        const b = k.querySelectorAll(".lc-platzmenue-knopf");
        const h = b[b.length - 1];
        return h ? Math.round(h.getBoundingClientRect().bottom - r.bottom) : 999;
      })()
    };
  });
  pruefe("der lange Druck oeffnet das Menue", Boolean(menue.da), menue.fehlt || "");
  pruefe("es nennt die Person", /Emmi/i.test(menue.kopf || ""), (menue.kopf || "-").trim());
  pruefe("es hat alle Spielzeuge", menue.knoepfe >= 13, menue.knoepfe + " Knoepfe");
  pruefe("es steht ganz im Bild", Boolean(menue.imBild));
  pruefe("man muss nicht rollen", Boolean(menue.passt), menue.hoch + " px Inhalt");
  pruefe("der letzte Knopf (Hammer) ist ohne Rollen zu sehen", menue.hammerUnten <= 0,
    menue.hammerUnten + " px unter dem Rand");

  const zu = await pg.evaluate(async () => {
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await new Promise((f) => setTimeout(f, 60));
    return !document.getElementById("lcPlatzMenue");
  });
  pruefe("ein Tipp daneben macht es wieder zu", zu);

  /* Und auf dem eigenen Platz steht das Bild obenan. */
  const eigen = await pg.evaluate(() => {
    const platz = document.querySelector('.lc-platz[data-lc-platz="1"]');
    platz.classList.add("lc-platz-ich");
    window.DMA_PRUEFUNG.platzMenue(platz);
    const k = document.getElementById("lcPlatzMenue");
    const woerter = k ? [...k.querySelectorAll(".lc-platzmenue-wort")].map((x) => x.textContent) : [];
    if (k) k.remove();
    return woerter;
  });
  /* GEWACHSEN, auf Ansage: „Vielleicht kannst du es so machen, dass
     wir die Mikrofon-Effekte auch in dem Menue haben auf unserem
     Profilbild — dass das dann nur bei uns angezeigt wird." Auf dem
     eigenen Platz stehen deshalb ZWEI Eintraege vorneweg, die es bei
     fremden Plaetzen nicht gibt: das eigene Bild und das Sprechbild.
     Die Kachel heisst jetzt „Anderes Bild" — „Anderes Profilbild"
     brach in der schmalen Kachel um. */
  pruefe("auf dem eigenen Platz steht das eigene Bild obenan",
    /Bild/i.test(eigen[0] || ""), eigen[0] || "-");
  pruefe("und gleich danach die Wahl des Sprechbildes",
    /Sprechbild/i.test(eigen[1] || ""), eigen[1] || "-");

  console.log("\nUND DIE WAHL DES SPRECHBILDES\n");
  const sb = await pg.evaluate(async () => {
    const platz = document.querySelector(".lc-platz");
    platz.classList.add("lc-platz-ich");
    window.DMA_PRUEFUNG.platzMenue(platz);
    const k = document.getElementById("lcPlatzMenue");
    /* Die Kachel „Sprechbild" antippen — dieselbe Wand klappt noch
       einmal auf, diesmal mit den Bildern. */
    const auf = [...k.querySelectorAll(".lc-platzmenue-knopf")]
      .filter((b) => /Sprechbild/i.test(b.textContent))[0];
    if (!auf) return { keinKnopf: true };
    auf.click();
    await new Promise((f) => setTimeout(f, 120));
    const m = document.getElementById("lcPlatzMenue");
    if (!m) return { keinMenue: true };
    const knoepfe = [...m.querySelectorAll(".lc-platzmenue-knopf")];
    const markiert = knoepfe.filter((b) => b.classList.contains("ist-da")).length;
    /* Eines waehlen, das gerade NICHT gilt, und nachsehen, ob es
       wirklich gesetzt wird. */
    const anderes = knoepfe.filter((b) => !b.classList.contains("ist-da"))[0];
    const wortVorher = anderes ? anderes.textContent.trim() : "";
    if (anderes) anderes.click();
    await new Promise((f) => setTimeout(f, 120));
    return { kacheln: knoepfe.length, markiert: markiert,
             kopf: (m.querySelector(".lc-platzmenue-kopf") || {}).textContent || "",
             gewaehlt: window.LiveChat.sprechbild(),
             wort: wortVorher,
             zu: !document.getElementById("lcPlatzMenue") };
  });
  pruefe("das Sprechbild-Menue geht auf", !sb.keinKnopf && !sb.keinMenue,
    sb.keinKnopf ? "keine Kachel" : (sb.keinMenue ? "kein Menue" : sb.kopf));
  pruefe("es zeigt alle Sprechbilder", sb.kacheln === 14, sb.kacheln + " Kacheln");
  pruefe("und markiert genau das, was gerade gilt", sb.markiert === 1,
    sb.markiert + " markiert");
  pruefe("ein Tipp setzt es wirklich", Boolean(sb.gewaehlt) && sb.zu === true,
    "jetzt: " + sb.gewaehlt + (sb.zu ? " (Menue zu)" : " (Menue offen)"));

  if (aufSeite.length) {
    console.log("\n  Fehler auf der Seite:");
    aufSeite.slice(0, 5).forEach((f) => console.log("    " + f));
  }
  await br.close(); srv.close();
  console.log("\n" + (fehler ? fehler + " Abweichung(en)" : "Das Profilbild laesst mit sich spielen.") + "\n");
  process.exit(fehler ? 1 : 0);
})();
