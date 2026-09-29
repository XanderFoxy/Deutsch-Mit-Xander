/* =====================================================================
   LEICHTE STADT — DIE FLÜGEL DER WINDMÜHLE
   ---------------------------------------------------------------------
   XANDER: „Vergiss die Windmühle nicht. Ich will den selben Look haben."
   Im alten gemalten Dorf drehten sich die vier Flügel der Mühle langsam
   über dem Turm (.sp-dl-fluegel, 9 s je Umdrehung). Hier genauso: das
   Gebäude (g_windmuehle, stadt/modelle/windmuehle.js) ist ohne Flügel
   gebacken; das Flügelkreuz liegt in einem eigenen DREHBLATT
   (g_windfluegel_<jahr>_<zeit>_f_<winkel>_<g|k|z>): 12 Stellungen einer
   Vierteldrehung nebeneinander – die vier Flügel sind gleich, also sieht
   das Kreuz nach 90° wieder genauso aus. Der Anker jedes Blatts ist der
   Fußpunkt der Mühle, wie beim Gebäude: das Kreuz sitzt genau am Wellkopf.

   Gemalt wird direkt nach dem Gebäude (szene.js ruft WM.nach für jedes
   gezeichnete Ding): dieselben Lagen wie das Gebäude (Tag, Nacht, in der
   Dämmerung beide), dieselbe Größe (_g, _k oder im kleinen Rahmen _z),
   sonst die nächste, die schon geladen ist. Zwischen zwei Stellungen wird
   weich überblendet. Tempo: am Tag 7 Umdrehungen je Minute, nachts 3 –
   von vorn gesehen gegen den Uhrzeigersinn, wie Holländermühlen laufen.
   Von hinten verdeckt der Turm, was hinter ihm liegt (im Blatt ausgespart).
   Nur, wenn die Mühle fertig steht (auf der Baustelle keine Flügel).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, LB = ST.bilder;
  /* nabe: Wellkopf in Modellmetern (stadt/modelle/windmuehle.js: 3,55 m vor der Achse nach (+x, +y), 13,25 m hoch) */
  const WM = (ST.windmuehle = { bild: "g_windmuehle", blatt: "g_windfluegel", tag: 7, nacht: 3, nabe: [2.51, 2.51, 13.25] });
  let winkel = 0, letzt = null;          // Drehung in Vierteldrehungen (fortlaufend)

  /* Tempo aus dem Nachtgrad: 7 U/min am Tag, 3 U/min in der Nacht, dazwischen gleitend */
  WM.tempo = function (Z) { const n = Math.max(0, Math.min(1, Z && Z.grad != null ? Z.grad : (Z && Z.nacht) || 0)); return WM.tag + (WM.nacht - WM.tag) * n; };
  /* einmal je Bild weiterdrehen (t in Sekunden) */
  function drehen(t, Z) {
    if (letzt == null || t < letzt || t - letzt > 2) letzt = t;
    winkel += (t - letzt) * WM.tempo(Z) / 60 * 4;
    letzt = t;
    return winkel;
  }
  WM.stellung = function () { return winkel; };

  /* Welches Drehblatt zu einer Lage des Gebäudes? Gleiche Größe, sonst eine geladene andere */
  function blattFuer(name) {
    const m0 = /^g_windmuehle_(.+)_([gkz])$/.exec(name);
    if (!m0) return null;
    const basis = WM.blatt + "_" + m0[1];
    const folge = m0[2] === "g" ? ["g", "k", "z"] : m0[2] === "k" ? ["k", "z", "g"] : ["z", "k"];
    for (let i = 0; i < folge.length; i++) {
      const n = basis + "_" + folge[i], m = LB.vz[n];
      if (!m) continue;
      /* die passende Größe laden (dringend); solange sie lädt, eine schon geladene nehmen */
      const img = i === 0 ? LB.bild(n, true) : LB.fertig(n) ? LB.bild(n) : null;
      if (img) return { img: img, m: m, name: n };
    }
    return null;
  }

  WM.nach = function (g, e, t, Z) {
    const o = e.o;
    if (!o || o.bild !== WM.bild || (o.bau && o.bau.p < 1)) return;
    const w = drehen(t, Z);
    for (const lg of e.lagen) {
      const b = blattFuer(lg[0]);
      if (!b) continue;
      const m = b.m, n = m.n || 1, zw = m.w / n, k = K.s * o.stufe / m.s;
      const pos = ((w * n) % n + n) % n, i = Math.floor(pos), f = pos - i;
      const x = e.X - m.ax * k, y = e.Y - m.ay * k, a = lg[1] * (o.geist ? 0.72 : 1);
      /* weich überblenden: die alte Stellung verblasst, die neue kommt (in der Mitte beide ganz) */
      const zelle = (j, al) => { if (al <= 0.01) return; g.globalAlpha = Math.min(1, al); g.drawImage(b.img, j * zw, 0, zw, m.h, x, y, zw * k, m.h * k); };
      zelle(i, a * Math.min(1, 2 * (1 - f)));
      zelle((i + 1) % n, a * Math.min(1, 2 * f));
      /* für die Sonde: was zuletzt gemalt wurde */
      WM.gemalt = { name: b.name, zelle: i, stellung: w, t: t };
    }
    g.globalAlpha = 1;
  };
})();
