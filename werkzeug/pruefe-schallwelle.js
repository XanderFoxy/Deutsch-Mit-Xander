/* MISST, OB DIE SCHALLWELLE EINE KANTE HAT.
   ---------------------------------------------------------------
   GEMELDET: „Diese hässliche Animation hat so eine Schachtel-Optik,
   weil sie oben und unten eine Kontrastkante zeigt."

   Eine Kante ist messbar: Wenn die Helligkeit von einer Bildzeile
   zur nächsten SPRINGT, ist da eine Kante. Bei einem weichen Verlauf
   ändert sie sich in winzigen Schritten. Gemessen wird deshalb der
   grösste Sprung zwischen zwei benachbarten Bildzeilen, über den
   ganzen Ablauf hinweg — einmal mit der alten Regel, einmal mit der
   neuen. */
const { chromium } = require("/tmp/claude-0/node_modules/playwright");
const { PNG } = (() => { try { return { PNG: require("/tmp/claude-0/node_modules/pngjs").PNG }; } catch (e) { return {}; } })();

const ALT = `
.probe::after{content:"";position:absolute;left:0;right:0;bottom:0;height:100%;
 pointer-events:none;z-index:4;
 background:radial-gradient(120% 60% at 50% 100%,
   rgba(255,206,85,0.22) 0%, rgba(255,206,85,0.10) 34%, rgba(255,206,85,0) 62%);
 animation:w 1800ms ease-out both;}
@keyframes w{0%{opacity:0;transform:translateY(18%) scaleY(0.25)}14%{opacity:1}
 100%{opacity:0;transform:translateY(-58%) scaleY(1.5)}}`;

const NEU = `
.probe::after{content:"";position:absolute;left:-10%;right:-10%;top:-60%;height:220%;
 pointer-events:none;z-index:4;
 background:linear-gradient(to top,
   rgba(255,206,85,0) 0%, rgba(255,206,85,0) 33%, rgba(255,206,85,0.03) 39%,
   rgba(255,206,85,0.09) 45%, rgba(255,206,85,0.14) 50%, rgba(255,206,85,0.09) 55%,
   rgba(255,206,85,0.03) 61%, rgba(255,206,85,0) 67%, rgba(255,206,85,0) 100%);
 animation:w 1800ms cubic-bezier(.24,.62,.28,1) both;}
@keyframes w{0%{opacity:0;transform:translateY(46%)}12%{opacity:1}74%{opacity:1}
 100%{opacity:0;transform:translateY(-46%)}}`;

(async () => {
  const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const pg = await br.newPage({ viewport: { width: 360, height: 520 } });

  async function messen(regel, name) {
    await pg.setContent(`<html><head><style>
      html,body{margin:0;background:#1a1512}
      .probe{position:relative;overflow:hidden;width:360px;height:520px;background:#221c1a;
             animation-play-state:paused}
      .probe::after{animation-play-state:paused}
      ${regel}
    </style></head><body><div class="probe" id="p"></div></body></html>`);
    let groessterSprung = 0, beiZeit = 0, beiY = 0;
    for (let ms = 60; ms <= 1740; ms += 60) {
      await pg.evaluate((t) => {
        const el = document.getElementById("p");
        const an = el.getAnimations({ subtree: true });
        an.forEach((a) => { a.pause(); a.currentTime = t; });
      }, ms);
      const bild = await pg.screenshot({ clip: { x: 170, y: 0, width: 2, height: 520 } });
      if (!PNG) { console.log("pngjs fehlt"); return; }
      const png = PNG.sync.read(bild);
      let vorher = null;
      for (let y = 0; y < png.height; y++) {
        const i = (y * png.width) * 4;
        const h = png.data[i] * 0.299 + png.data[i + 1] * 0.587 + png.data[i + 2] * 0.114;
        if (vorher !== null) {
          const sprung = Math.abs(h - vorher);
          if (sprung > groessterSprung) { groessterSprung = sprung; beiZeit = ms; beiY = y; }
        }
        vorher = h;
      }
    }
    console.log("  " + name + ": groesster Helligkeitssprung von Zeile zu Zeile = "
      + groessterSprung.toFixed(2) + " (von 255)  bei " + beiZeit + " ms, Höhe y=" + beiY);
    return groessterSprung;
  }

  console.log("\n  Eine Kante ist ein SPRUNG. Ein weicher Verlauf ist ein Rinnsal.\n");
  const a = await messen(ALT, "ALT (Kasten, 100% hoch)");
  const n = await messen(NEU, "NEU (Band in grossem Kasten)");
  if (a != null && n != null) {
    console.log("\n  Ergebnis: " + (n < a ? "der Sprung ist um "
      + (100 - (n / a) * 100).toFixed(0) + " % kleiner geworden."
      : "KEINE Verbesserung — nachbessern."));
  }
  await br.close();
})();
