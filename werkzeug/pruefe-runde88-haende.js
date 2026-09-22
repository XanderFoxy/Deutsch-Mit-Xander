/* =====================================================================
   SONDE RUNDE 88 — DIE EMOJI-HAENDE
   ---------------------------------------------------------------------
   XANDER, woertlich:
   · „auch die Schlag- oder die Emoji-Haende, die so einen extrem
      gespreizten Daumen haben bei den Emoji-Haenden. Mach das so,
      dass der Daumen realistisch ist."
   · „Die Hand wird niemals gehalten beim Winken, die ist ganz
      natuerlich einfach nur offen und dann winkt man. Da kriegt man
      keinen Krampf in den Fingern, wenn man winkt, weil man seinen
      Daumen extrem nach aussen drehen muss. Das ist keine Haltung,
      die man hat — man hat seine Hand nur offen und winkt."
   · „Auch beim Klatschen hat man auch nicht diese extrem
      rausgedehnten Daumen, die sollen schraeg nach oben gehen, ganz
      natuerlich liegen."
   · „und beim Klatschen soll sich die Handflaeche in der Mitte
      treffen."
   · „das kannst du verbessern ohne den Pinocchio-Look, mit
      realistischer Hautfarbe."

   NACHGESCHLAGEN, WAS DIE ANATOMIE SAGT: die Spanne zwischen Daumen
   und Zeigefinger betraegt in Ruhe 30 bis 45 Grad. Voll abgespreizt
   sind es 60 bis 70 — und das ist eine Anstrengung, die niemand
   nebenbei haelt. Im Quelltext stand -68 Grad (winken) und -74
   (klatschen), also der aeusserste Wert, dauerhaft. Genau das hat er
   gesehen.

   Gemessen wird beides: die Zahl im Bauplan UND das fertige Bild.
   Ein abgespreizter Daumen macht die Hand breit — die gemessene
   Breite geteilt durch die Hoehe war 0,98 (winken), also QUADRATISCH.
   Eine Hand ist laenger als breit.
   ===================================================================== */
const fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const WURZEL = path.join(__dirname, "..");

let fehler = 0;
const sage = (gut, text, dazu) => {
  if (!gut) fehler++;
  console.log((gut ? "  ok   " : "  FEHL ") + text + (dazu ? "   " + dazu : ""));
};

(async () => {
  console.log("RUNDE 88 — die Emoji-Haende\n");
  const bau = fs.readFileSync(path.join(WURZEL, "werkzeug", "haende-zeichnen.js"), "utf8");

  console.log("DER BAUPLAN\n");
  const winkelVon = (block) => {
    const i = bau.indexOf("const " + block + " = {");
    const m = /daumen: \{ x: [\d.]+, y: [\d.]+, w: (-?[\d.]+)/.exec(bau.slice(i, i + 2200));
    return m ? Number(m[1]) : NaN;
  };
  const wW = winkelVon("WINKEN"), wK = winkelVon("KLATSCHEN");
  /* In Ruhe 30 bis 45 Grad — mit etwas Luft nach beiden Seiten. */
  sage(wW <= -30 && wW >= -50,
    "der Daumen der winkenden Hand steht wie in Ruhe ab (30 bis 45 Grad)",
    wW + " Grad");
  /* Angelegt und schraeg nach oben — „ganz natuerlich liegen". */
  sage(wK <= -12 && wK >= -32,
    "und beim Klatschen liegt er schraeg nach oben an der Handkante",
    wK + " Grad");
  sage(!/w: -6[0-9]/.test(bau) && !/w: -7[0-9]/.test(bau),
    "nirgends steht mehr ein voll abgespreizter Daumen");

  /* Die Dateien muessen das sein, was der Bauplan erzeugt — sonst
     steht im Werkzeug eines und im Ordner etwas anderes. */
  const vorher = ["winken", "klatschen"].map((n) =>
    fs.readFileSync(path.join(WURZEL, "sticker", n + ".svg"), "utf8"));
  execFileSync("node", [path.join(WURZEL, "werkzeug", "haende-zeichnen.js")]);
  const nachher = ["winken", "klatschen"].map((n) =>
    fs.readFileSync(path.join(WURZEL, "sticker", n + ".svg"), "utf8"));
  sage(vorher[0] === nachher[0] && vorher[1] === nachher[1],
    "die Aufkleber im Ordner sind genau das, was das Werkzeug zeichnet");

  console.log("\nDAS FERTIGE BILD\n");
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 420, height: 420 } });

  const handMass = async (datei) => {
    await pg.setContent('<body style="margin:0">'
      + fs.readFileSync(path.join(WURZEL, "sticker", datei), "utf8") + "</body>");
    await pg.waitForTimeout(60);
    return pg.evaluate(() => {
      const p = document.querySelector('path[fill^="url(#haut"]');
      const b = p.getBBox();
      return { w: Number(b.width.toFixed(1)), h: Number(b.height.toFixed(1)) };
    });
  };
  const mW = await handMass("winken.svg");
  const mK = await handMass("klatschen.svg");
  /* Frueher 0,98 und 0,90 — beides fast quadratisch, weil der Daumen
     so weit heraussteht. Eine Hand ist laenger als breit. */
  sage(mW.w / mW.h <= 0.90,
    "die winkende Hand ist laenger als breit, nicht quadratisch",
    mW.w + " x " + mH(mW) + " = " + (mW.w / mW.h).toFixed(2) + " (vorher 0,98)");
  sage(mK.w / mK.h <= 0.80,
    "und die klatschende ist noch schmaler — der Daumen liegt an",
    mK.w + " x " + mH(mK) + " = " + (mK.w / mK.h).toFixed(2) + " (vorher 0,90)");

  await pg.setContent('<body style="margin:0;background:#fff">'
    + fs.readFileSync(path.join(WURZEL, "sticker", "klatschen.svg"), "utf8") + "</body>");
  await pg.waitForTimeout(100);
  /* Zeit setzen und messen sind ZWEI Aufrufe, mit einem Bild
     dazwischen — im selben Aufruf misst man noch die alte Stellung. */
  const setzen = (t) => pg.evaluate((T) => {
    document.querySelectorAll("svg *").forEach((el) =>
      el.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = T; } catch (e) {} }));
  }, t);
  const lesen = () => pg.evaluate(() => {
    const s = document.querySelector("svg");
    const r = s.getBoundingClientRect();
    const k = s.viewBox.baseVal.width / r.width;
    const holen = (sel) => {
      const b = document.querySelector(sel).getBoundingClientRect();
      return [Number(((b.left - r.left) * k).toFixed(1)),
              Number(((b.right - r.left) * k).toFixed(1))];
    };
    return { l: holen("g.l"), r: holen("g.r"), mitte: s.viewBox.baseVal.width / 2 };
  });

  /* =================================================================
     „BEIM KLATSCHEN SOLL SICH DIE HANDFLAECHE IN DER MITTE TREFFEN."
     -----------------------------------------------------------------
     GEMESSEN WIRD AN BILDPUNKTEN, NICHT AN RECHTECKEN — und das ist
     hier keine Spitzfindigkeit, sondern der Grund, warum der Fehler
     so lange stand. Die umschliessenden Rechtecke der beiden Haende
     ueberlappten sich naemlich AUCH DANN, wenn die Haende einander
     gar nicht beruehrten: jede Hand ist schraeg gestellt, ihr
     Rechteck enthaelt also viel leere Ecke. Wer das Rechteck misst,
     misst Luft.
     Hier wird deshalb die MITTELSPALTE des Bildes ausgelesen, und
     zwar genau auf der Hoehe, in der sich die beiden Haende
     beruehren: 50 bis 69 Prozent der Bildhoehe (nachgemessen am
     Bild). Darueber stehen die Fingerspitzen auseinander, darunter
     laufen die Handgelenke auseinander — an beiden Stellen ist auch
     im Anschlag Luft, und das ist richtig so. Im Anschlag muss in
     diesem Band Haut stehen, in der Ruhe Hintergrund.
     ================================================================= */
  const spalte = async (zeit, datei) => {
    await setzen(zeit);
    await pg.waitForTimeout(120);
    await pg.screenshot({ path: datei });
    const groesse = await pg.evaluate(() => {
      const r = document.querySelector("svg").getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top),
               h: Math.round(r.height) };
    });
    const von = groesse.y + Math.round(groesse.h * 0.50);
    const hoch = Math.round(groesse.h * 0.19);
    const roh = execFileSync("/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg",
      ["-v", "error", "-i", datei,
       "-vf", "crop=1:" + hoch + ":" + groesse.x + ":" + von,
       "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 22 });
    let haut = 0;
    for (let k = 0; k + 2 < roh.length; k += 3) {
      const r = roh[k], g = roh[k + 1], b = roh[k + 2];
      if (r > 150 && r > b + 25 && g > b) haut++;
    }
    return { haut: haut, von: hoch };
  };
  const imAnschlag = await spalte(260, "/tmp/claude-0/klatsch-treffer.png");
  const inRuhe = await spalte(0, "/tmp/claude-0/klatsch-ruhe.png");
  sage(imAnschlag.haut >= imAnschlag.von * 0.92,
    "im Anschlag steht in der Bildmitte Haut — die Handflaechen treffen sich",
    imAnschlag.haut + " von " + imAnschlag.von + " Bildpunkten");
  sage(inRuhe.haut < inRuhe.von * 0.2,
    "in der Ruhe ist die Mitte frei — sie stehen auseinander",
    inRuhe.haut + " von " + inRuhe.von + " Bildpunkten");
  /* Und sie bewegen sich WIRKLICH aufeinander zu. Frueher wanderten
     beide um dieselben 16 Punkte nach rechts, weil in der
     gespiegelten Gruppe das Vorzeichen verkehrt war — der Abstand
     zwischen ihnen aenderte sich dabei kein bisschen. */
  await setzen(0); await pg.waitForTimeout(120);
  const ruheK = await lesen();
  await setzen(260); await pg.waitForTimeout(120);
  const trefferK = await lesen();
  const abstandRuhe = ruheK.r[0] - ruheK.l[1];
  const abstandTreffer = trefferK.r[0] - trefferK.l[1];
  sage(abstandTreffer < abstandRuhe - 20,
    "sie fahren wirklich aufeinander zu, nicht gemeinsam zur Seite",
    "Abstand in Ruhe " + abstandRuhe.toFixed(1)
    + ", im Anschlag " + abstandTreffer.toFixed(1));

  /* Eine Hand muss sichtbar VOR der anderen liegen, sonst sind es im
     Anschlag zwei gleich helle Flaechen uebereinander — sein altes
     „die sind so immer noch verschachtelt". */
  const schatten = await pg.evaluate(() => {
    const r = document.querySelector("g.r");
    return getComputedStyle(r).filter;
  });
  sage(/drop-shadow/.test(schatten),
    "die vordere Hand wirft einen Schatten auf die hintere", schatten);

  /* „ohne den Pinocchio-Look, mit realistischer Hautfarbe." */
  const haut = /stop-color="(#[0-9a-f]{6})"/gi;
  const toene = [...fs.readFileSync(path.join(WURZEL, "sticker", "winken.svg"), "utf8")
    .matchAll(haut)].map((m) => m[1].toLowerCase());
  /* Gemessen wird die BUNTHEIT (Chroma: der Abstand zwischen dem
     staerksten und dem schwaechsten Kanal), nicht die HSL-Saettigung.
     Bei sehr hellen Farben ist die HSL-Saettigung immer hoch, auch
     wenn die Farbe blass ist — sie taugt hier nicht.
     Nachgerechnet an den ALTEN Toenen: #f6c79a = 36 %, #f0b077 =
     47 %, #d89a63 = 46 %. Ein Ton mit 47 Prozent Buntheit im
     Gelbrot-Bereich ist Orange, keine Haut. Haut liegt im Licht bei
     20 bis 28 und im Schatten bei 30 bis 38 Prozent — der Schatten
     ist bunter, weil dort mehr Blut durchscheint. */
  const buntheit = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16), g = ((n >> 8) & 255), b = (n & 255);
    return (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
  };
  const werte = toene.map(buntheit);
  sage(werte.length >= 3 && werte.every((s) => s <= 0.38) && werte[0] <= 0.28,
    "die Hautfarbe ist nicht mehr Orange",
    toene.join(" ") + " — Buntheit " + werte.map((x) => (x * 100).toFixed(0) + "%").join(" ")
    + " (vorher 36% 47% 46%)");

  await br.close();
  console.log(fehler ? "\n" + fehler + " Abweichung(en)\n"
                     : "\nOffene Hand, angelegter Daumen — und die Handflaechen treffen sich.\n");
  process.exit(fehler ? 1 : 0);
})();

function mH(m) { return m.h; }
