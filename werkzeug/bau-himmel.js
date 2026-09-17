/* =====================================================================
   MEHR HIMMEL, WENIGER LEERE
   ---------------------------------------------------------------------
   GEWÜNSCHT: „Dann mit der Optimierung für die Bilderwelten, da wo noch
   so leere Bilder sind."

   Nachgemessen war es überall dasselbe: die Häuser, Menschen und Dinge
   sind gut, aber über ihnen steht eine halbe Bildhöhe blasser Himmel mit
   zwei Wattebäuschen und einer Sonne. Bei „Leipzig" waren es 41 Prozent
   der Fläche am Stück, bei „Magdeburg" 40, beim Spielplatz ebenso.

   Dieses Werkzeug füllt GENAU DIESE FLÄCHE — und nichts sonst:

     • Es misst den Horizont selbst. Dafür wird die Szene gezeichnet und
       Spalte für Spalte nachgesehen, ab welcher Zeile die Farbe nicht
       mehr die Himmelsfarbe von ganz oben ist. Der Median davon ist der
       Horizont. So braucht keine einzige Szene eine Zahl von Hand.

     • Darüber kommen Wolken in DREI Tiefen (weit hinten klein und
       blass, vorn grösser und weisser), ein Dunstband knapp über dem
       Horizont, ein paar Vogelstriche und — nur wo wirklich viel Platz
       ist — ein Schwarm.

     • Alles geht in die KULISSE, nicht zu den Dingen. Es bleibt also
       Hintergrund: nichts davon lässt sich antippen, nichts davon ist
       Vokabular, nichts verdeckt etwas.

     • Die vorhandene Zeichnung wird NICHT angefasst. Eingefügt wird
       direkt hinter dem Himmelsrechteck; alles, was danach kommt —
       Häuser, Menschen, Dinge —, wird weiterhin darüber gezeichnet.

   Zweimal laufen lassen schadet nichts: die eingefügte Gruppe trägt
   eine Marke und wird beim nächsten Mal ersetzt statt verdoppelt.

       node werkzeug/bau-himmel.js            (alle Szenen)
       node werkzeug/bau-himmel.js leipzig    (nur diese)
       node werkzeug/bau-himmel.js --probe    (nur messen, nichts ändern)
   ===================================================================== */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const fs = require("fs");
const path = require("path");

const WURZEL = path.dirname(__dirname);
const MARKE_AUF = "<!--himmel-->";
const MARKE_ZU = "<!--/himmel-->";

/* Ab wann lohnt sich das? Weniger als 60 Pixel Himmel sind kein
   Himmel, sondern ein Rand. */
const MINDEST_HIMMEL = 62;

/* AUSNAHMEN — von Hand, nach dem Hinsehen.

   Die Messung kann viel, aber nicht alles. Diese drei bestehen jede
   Pruefung und sehen mit Wolken trotzdem falsch aus:

     badezimmer  Die Kachelwand ist blau und glatt wie ein Himmel.
                 Wolken auf Fliesen.
     planeten    Der Nachthimmel ist dunkel, aber das Dunstband am
                 „Horizont" legte sich quer durchs Weltall.
     wetter      Eine Tafel mit Wettersymbolen. Dort stehen schon
                 Wolken — als Vokabeln. Noch mehr davon waeren nur
                 verwirrend.

   Lieber drei Namen im Klartext als eine Messung, die so lange
   verbogen wird, bis sie zufaellig passt. */
const NICHT = ["badezimmer", "planeten", "wetter"];

/* --- Ein kleiner, wiederholbarer Zufall ---------------------------
   Damit dieselbe Szene beim zweiten Lauf denselben Himmel bekommt und
   nicht bei jedem Aufruf ein anderer Diff entsteht. */
function wuerfel(saat) {
  let z = saat >>> 0;
  return function () {
    z = (z * 1664525 + 1013904223) >>> 0;
    return z / 4294967296;
  };
}
function saatAus(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* --- Eine Wolke im Stil des Hauses: drei bis fünf flache Ellipsen -- */
function wolke(x, y, gross, weiss, r) {
  const rx = 13 * gross, ry = rx * 0.44;
  const teile = [
    `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${weiss}"/>`
  ];
  const wieviel = 2 + Math.floor(r() * 3);
  for (let i = 0; i < wieviel; i++) {
    const seite = i % 2 === 0 ? -1 : 1;
    const dx = seite * rx * (0.34 + r() * 0.5);
    const dy = -ry * (0.2 + r() * 0.5);
    const k = 0.4 + r() * 0.3;
    teile.push(
      `<ellipse cx="${(x + dx).toFixed(1)}" cy="${(y + dy).toFixed(1)}"`
      + ` rx="${(rx * k).toFixed(1)}" ry="${(ry * k * 1.35).toFixed(1)}" fill="${weiss}"/>`
    );
  }
  return teile.join("");
}

/* --- Ein Vogel: zwei Bögen, wie man ihn von Weitem sieht ----------- */
function vogel(x, y, gross) {
  const b = 3.4 * gross;
  return `<path d="M${(x - b * 2).toFixed(1)} ${y.toFixed(1)}`
    + ` q${b.toFixed(1)} ${(-b * 0.85).toFixed(1)} ${(b * 2).toFixed(1)} 0`
    + ` q${b.toFixed(1)} ${(-b * 0.85).toFixed(1)} ${(b * 2).toFixed(1)} 0"`
    + ` fill="none" stroke="#6f7f8c" stroke-width="${(0.8 * gross).toFixed(2)}"`
    + ` stroke-linecap="round" opacity="0.5"/>`;
}

function himmelBauen(breite, horizont, saat, sonneBei) {
  const r = wuerfel(saat);
  const st = [MARKE_AUF];

  /* 1. Ein Dunstband knapp über dem Horizont — Luft hat Tiefe, und in
        der Ferne wird alles heller. Das ist der Trick, mit dem ein
        gemalter Himmel aufhört, eine Farbfläche zu sein. */
  const dunst = Math.max(14, horizont * 0.3);
  st.push(`<defs><linearGradient id="dn${saat % 9973}" x1="0" y1="0" x2="0" y2="1">`
    + `<stop offset="0" stop-color="#ffffff" stop-opacity="0"/>`
    + `<stop offset="1" stop-color="#ffffff" stop-opacity="0.5"/></linearGradient></defs>`);
  st.push(`<rect x="0" y="${(horizont - dunst).toFixed(1)}" width="${breite}"`
    + ` height="${dunst.toFixed(1)}" fill="url(#dn${saat % 9973})"/>`);

  /* 2. Wolken in drei Tiefen. Hinten klein und blass, vorn grösser und
        weisser — daraus entsteht der Eindruck von Weite. Sie meiden
        die Stelle, an der die Sonne steht. */
  const reihen = [
    { y: horizont * 0.24, gross: 0.55, weiss: "rgba(255,255,255,0.55)", wieviel: 4 },
    { y: horizont * 0.44, gross: 0.85, weiss: "rgba(255,255,255,0.78)", wieviel: 3 },
    { y: horizont * 0.66, gross: 1.15, weiss: "rgba(255,255,255,0.92)", wieviel: 2 }
  ];
  reihen.forEach((reihe, ri) => {
    for (let i = 0; i < reihe.wieviel; i++) {
      const teil = breite / reihe.wieviel;
      let x = teil * (i + 0.5) + (r() - 0.5) * teil * 0.55;
      /* Nicht in die Sonne hinein */
      if (sonneBei != null && Math.abs(x - sonneBei) < 34) x += x < sonneBei ? -40 : 40;
      if (x < 8 || x > breite - 8) continue;
      const y = reihe.y + (r() - 0.5) * horizont * 0.1;
      if (y < 6 || y > horizont - 8) continue;
      st.push(wolke(x, y, reihe.gross * (0.8 + r() * 0.45), reihe.weiss, r));
    }
  });

  /* 3. Ein paar Vögel — nie mittig, immer in lockerer Staffelung. */
  const wieVieleVoegel = horizont > 100 ? 5 : 3;
  const vx = breite * (0.16 + r() * 0.2);
  const vy = horizont * (0.2 + r() * 0.2);
  for (let i = 0; i < wieVieleVoegel; i++) {
    st.push(vogel(vx + i * (7 + r() * 9), vy + (r() - 0.5) * 13, 0.7 + r() * 0.6));
  }
  if (horizont > 110) {
    const wx = breite * (0.62 + r() * 0.2);
    const wy = horizont * (0.3 + r() * 0.2);
    for (let i = 0; i < 3; i++) {
      st.push(vogel(wx + i * (6 + r() * 7), wy + (r() - 0.5) * 10, 0.55 + r() * 0.4));
    }
  }

  st.push(MARKE_ZU);
  return st.join("");
}

(async () => {
  const nurProbe = process.argv.includes("--probe");
  const gewuenscht = process.argv.slice(2).filter((x) => !x.startsWith("--"));

  const idx = JSON.parse(
    fs.readFileSync(path.join(WURZEL, "data-szenen.js"), "utf8").match(/\[[\s\S]*\]/)[0]
  );
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await b.newPage({ viewport: { width: 700, height: 700 } });

  let geaendert = 0, geprueft = 0;
  const bericht = [];

  for (const s of idx) {
    if (gewuenscht.length && gewuenscht.indexOf(s.id) < 0) continue;
    const datei = path.join(WURZEL, "szenen", s.id + ".js");
    if (!fs.existsSync(datei)) continue;
    const roh = fs.readFileSync(datei, "utf8");
    const treffer = roh.match(/\{"id"[\s\S]*\}(?=;\s*$)/);
    if (!treffer) continue;
    const d = JSON.parse(treffer[0]);
    if (d.detail) continue;               // Schaubilder haben keinen Himmel
    geprueft++;

    /* Den vorhandenen Himmel erst herausnehmen, damit gemessen wird,
       wie die Szene OHNE ihn aussieht — sonst misst der zweite Lauf
       den eigenen Einschub mit. */
    const kulisseRein = d.kulisse.replace(
      new RegExp(MARKE_AUF + "[\\s\\S]*?" + MARKE_ZU, "g"), "");

    const mass = await p.evaluate(({ kulisse, breite, hoehe }) => {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + breite + ' '
        + hoehe + '" width="' + breite + '" height="' + hoehe + '"><g>' + kulisse + '</g></svg>';
      return new Promise((fertig) => {
        const i = new Image();
        i.onload = () => {
          const k = document.createElement("canvas");
          k.width = breite; k.height = hoehe;
          const c = k.getContext("2d", { willReadFrequently: true });
          c.drawImage(i, 0, 0);
          const px = c.getImageData(0, 0, breite, hoehe).data;
          const f = (x, y) => { const o = (y * breite + x) * 4; return [px[o], px[o+1], px[o+2]]; };
          const unterschied = (a, b) => Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[2]-b[2]);
          const oben = f(Math.floor(breite / 2), 2);
          const hell = (oben[0] + oben[1] + oben[2]) / 3;

          /* DEN HORIZONT FINDEN — und zwar an KANTEN, nicht an der
             Farbe. Der Himmel ist fast immer ein Farbverlauf: er
             veraendert sich von Zeile zu Zeile ein wenig, ueber
             hundert Zeilen betraechtlich. Wer ihn an „gleiche Farbe
             wie ganz oben" erkennen will, bleibt nach zehn Zeilen
             stehen — genau das ist beim ersten Versuch passiert.

             An einer Kante dagegen springt die Farbe innerhalb einer
             Zeile. Eine Wolke oder die Sonne ist so eine Kante, hoert
             aber nach wenigen Zeilen wieder auf; der Boden hoert nicht
             mehr auf. Deshalb zaehlt nur eine Kante, unter der es auch
             zwanzig Zeilen weiter noch anders aussieht. */
          const kanten = [];
          for (let x = 2; x < breite - 2; x += 2) {
            let gefunden = hoehe;
            for (let y = 3; y < hoehe - 2; y++) {
              if (unterschied(f(x, y), f(x, y - 2)) < 20) continue;
              /* Haelt es an? Unter einer Wolke ist zwanzig Zeilen
                 tiefer wieder Himmel, unter dem Boden nicht. */
              const tiefer = Math.min(hoehe - 1, y + 20);
              const himmelHier = f(x, Math.max(0, y - 4));
              if (unterschied(f(x, tiefer), himmelHier) < 30) continue;
              gefunden = y;
              break;
            }
            kanten.push(gefunden);
          }
          kanten.sort((a, b) => a - b);
          /* Der Median: die Haelfte aller Spalten hat bis hierher
             Himmel. Einzelne hohe Tuerme verschieben ihn nicht. */
          const median = kanten[Math.floor(kanten.length / 2)] || 0;

          /* Wo steht die Sonne? Die hellste warme Stelle im oberen
             Drittel — dort sollen keine Wolken hin. */
          let sonneX = null, bestes = 0;
          for (let x = 2; x < breite - 2; x += 3) {
            for (let y = 2; y < Math.min(hoehe, median || hoehe, 70); y += 3) {
              const c2 = f(x, y);
              const warm = c2[0] + c2[1] - c2[2] * 1.4;
              if (warm > bestes && c2[0] > 220) { bestes = warm; sonneX = x; }
            }
          }
          /* IST DAS UEBERHAUPT EIN HIMMEL?
             Das war die Luecke im ersten Versuch: gemessen wurde nur,
             ob oben eine grosse helle Flaeche ist. Eine gekachelte
             Badezimmerwand ist das auch, ein Karokasten im Katalog
             ebenso — und beide bekamen prompt Wolken.

             Zwei Fragen entscheiden es:

             1. Ist es blau? Ein Himmel hat mehr Blau als Rot. Eine
                Wand, ein Blatt Papier, eine Werkstattwand haben das
                nicht.

             2. Ist es GLATT? Ein Himmel ist eine Flaeche oder ein
                Verlauf von oben nach unten — waagerecht aendert sich
                nichts. Kacheln, Karos, Regale und Bretter aendern sich
                waagerecht staendig. Gemessen wird die mittlere
                Abweichung entlang einer Zeile auf halber Himmelshoehe:
                ueber drei, und es ist keine Fläche, sondern ein
                Muster. */
          const zeileMessen = (probeY) => {
            let summe = [0, 0, 0], n = 0;
            for (let x = 2; x < breite - 2; x += 2) {
              const c3 = f(x, probeY);
              summe[0] += c3[0]; summe[1] += c3[1]; summe[2] += c3[2]; n++;
            }
            const mittel = summe.map((v) => v / Math.max(1, n));
            let abw = 0;
            for (let x = 2; x < breite - 2; x += 2) abw += unterschied(f(x, probeY), mittel);
            return { unruhe: abw / Math.max(1, n), mittel: mittel };
          };
          /* MEHRERE Zeilen messen und die RUHIGSTE nehmen. Der erste
             Versuch hat eine einzige Zeile auf halber Himmelshoehe
             geprueft — und genau dort standen die vorhandenen Wolken
             und die Sonne. Hamburg, Muenchen, Italien und Japan fielen
             deshalb durch, obwohl sie den schoensten Himmel haben. Ein
             echter Himmel hat immer mindestens EINE Zeile, in der
             waagerecht nichts passiert; eine Kachelwand hat keine. */
          let abweichung = 1e9, mittel = [0, 0, 0];
          [0.08, 0.2, 0.33, 0.5, 0.68, 0.85].forEach((anteil) => {
            const y = Math.max(2, Math.min(hoehe - 3, Math.floor(median * anteil)));
            const m = zeileMessen(y);
            if (m.unruhe < abweichung) { abweichung = m.unruhe; mittel = m.mittel; }
          });
          const blau = mittel[2] - mittel[0];

          fertig({ horizont: median, hell: hell, sonneX: bestes > 60 ? sonneX : null,
                   glatt: abweichung, blau: blau });
        };
        i.onerror = () => fertig({ horizont: 0, hell: 0, sonneX: null });
        i.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
      });
    }, { kulisse: kulisseRein, breite: d.breite, hoehe: d.hoehe });

    /* Katalogseiten bekommen keinen Himmel. Man erkennt sie daran,
       dass die Dinge auf einem Raster stehen: wenige verschiedene
       x-Werte, die sich ueber mehrere Reihen wiederholen. Eine Szene
       stellt ihre Dinge dorthin, wo sie hingehoeren — ein Katalog
       stellt sie in Spalten. */
    const spalten = {};
    (d.teile || []).forEach((t) => { spalten[Math.round(t.x / 6)] = 1; });
    const istKatalog = (d.teile || []).length >= 10
      && Object.keys(spalten).length <= Math.ceil((d.teile || []).length / 2.4);

    const lohnt = NICHT.indexOf(d.id) < 0
      && !istKatalog
      && mass.horizont >= MINDEST_HIMMEL
      && mass.horizont < d.hoehe * 0.8
      && mass.hell > 150
      && mass.glatt < 4.5          // eine Flaeche, kein Kachelmuster
      && mass.blau > 6;            // blaeulich, also draussen
    bericht.push({ id: d.id, horizont: mass.horizont, hell: Math.round(mass.hell),
                   glatt: Math.round(mass.glatt * 10) / 10,
                   blau: Math.round(mass.blau), katalog: istKatalog, lohnt: lohnt });
    if (!lohnt || nurProbe) continue;

    /* WO EINFUEGEN? Hinter dem LETZTEN ganzflaechigen Rechteck, das
       oben links anfaengt — nicht hinter dem ersten.

       Warum das wichtig ist: manche Szenen legen zuerst eine
       Grundfarbe ueber das ganze Bild (beim Spielplatz ein Gruen) und
       malen den Himmel erst danach als zweites Rechteck darueber. Wer
       hinter dem ERSTEN einfuegt, malt seine Wolken unter den Himmel —
       sie sind dann da, aber niemand sieht sie. Genau das ist beim
       ersten Versuch passiert.

       Gesucht wird nur im vorderen Drittel der Kulisse: was weiter
       hinten steht, sind Haeuser und Boden, keine Grundflaechen. */
    let stelle = -1;
    {
      const suchraum = Math.max(400, Math.floor(kulisseRein.length * 0.35));
      const muster = new RegExp('<rect[^>]*?x="0"[^>]*?y="0"[^>]*?width="' + d.breite + '"[^>]*?/>', "g");
      let m;
      while ((m = muster.exec(kulisseRein)) !== null) {
        if (m.index > suchraum) break;
        stelle = m.index + m[0].length;
      }
    }
    if (stelle < 0) continue;
    const neu = kulisseRein.slice(0, stelle)
      + himmelBauen(d.breite, mass.horizont, saatAus(d.id), mass.sonneX)
      + kulisseRein.slice(stelle);

    d.kulisse = neu;
    const kopf = roh.slice(0, roh.indexOf('window.DMA_SZENE["'));
    const zeile = 'window.DMA_SZENE["' + d.id + '"] = ' + JSON.stringify(d) + ";\n";
    fs.writeFileSync(datei, kopf + zeile);
    geaendert++;
  }

  await b.close();
  console.log("Horizont gemessen bei " + geprueft + " Szenen, " + geaendert + " bekamen mehr Himmel.");
  const nein = bericht.filter((x) => !x.lohnt);
  if (nein.length) {
    console.log("\nOhne Himmel gelassen (zu wenig Platz, zu dunkel oder kein Himmel):");
    nein.forEach((x) => console.log("  " + x.id.padEnd(22)
      + "Horizont " + String(x.horizont).padStart(4)
      + "   Helligkeit " + String(x.hell).padStart(4)
      + "   Unruhe " + String(x.glatt).padStart(6)
      + "   Blau " + String(x.blau).padStart(5)
      + (x.katalog ? "   (Katalog)" : "")));
  }
})();
