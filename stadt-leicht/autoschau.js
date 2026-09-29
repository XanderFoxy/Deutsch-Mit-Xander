/* =====================================================================
   LEICHTE STADT — AUTO-SCHAU (Dodge Viper und Batmobil schön ansehen)
   ---------------------------------------------------------------------
   FASSUNG 821 — XANDER (Funk 207, wörtlich): „wenn man bei Batmobil
   oder Viper klick dann muss ich die Möglichkeit geben sich das Auto
   schön anzugucken ich habe ja schon mal gesagt wenn man sich
   entscheidet man will weiter rein [zoomen] soll diese [Zoom]stufe auch
   möglich sein dann muss es halt temporär zwischengeladen werden das
   soll auf jeden Fall anzuschauen sein und ich habe gesagt ich brauche
   so ein Handle der die Z-Achse schön navigieren kann nicht so mit
   einmal klickt das ist total sinnlos weil dann kann man ja nicht mal
   mehr zurückklicken ich möchte dass man das durch den Finger-Swipe
   steuern kann".

   WAS MAN SIEHT: eine Vollbild-Ebene über der Stadt (eigene Leinwand),
   dunkler, weicher Hintergrund mit einer Drehscheibe und Bodenschatten,
   darauf das Auto aus den Drehblättern (32 Blickwinkel rundum):
     14°  auftritt_<auto>   (das Blatt des Auftritts im Klassenzimmer)
     30°  schau_<auto>_30   (werkzeug/stadt-backen.js, nur lenk 0/roll 0)
     55°  schau_<auto>_55
   Gezeichnet wird wie beim Auftritt (app.js, lcAuftrittAuto3d): erst der
   Schatten, dann die Karosserie, dann die Radflicken (Lenkung 0,
   Radstellung 0) nach Tiefe – hintere zuerst.

   STEUERUNG (Pointer Events, touch-action: none):
     waagrecht wischen  Auto drehen – stufenlos wirkend: zwischen zwei
                        Nachbarwinkeln wird weich überblendet, mit Schwung;
                        zum Schluss gleitet es auf den nächsten Winkel
                        (dort ist das Bild gestochen scharf).
     senkrecht wischen  kippen („Handle für die Z-Achse"): hoch = mehr von
                        oben. Dasselbe tut der Schieber am rechten Rand.
                        Zwischen den Neigungen wird überblendet, beim
                        Loslassen rastet die nächste Stufe weich ein.
     zwei Finger        kneifen = näher/weiter (um die Fingermitte),
                        schieben = verschieben; Mausrad = Zoom.
     Doppeltipp         nah heran / zurück.
   Zoom reicht bis zur vollen Auflösung der Blätter (ein Bildpunkt des
   Blatts = ein Bildpunkt des Geräts) und – auf großen Bildschirmen, wo
   das Auto schon fast so groß ist – bis zum Doppelten der Anfangsgröße.

   LADEN: die Blätter werden erst beim Öffnen angefragt („temporär
   zwischengeladen"): zuerst 14°, dann 30° und 55° im Hintergrund – bis
   eine Stufe da ist, pulsiert ihre Marke am Schieber. Beim Schließen
   werden die Bilder wieder freigegeben.

   SCHLIESSEN: Kreuz oben rechts, „Zurück" unten, Esc – und die
   Zurück-Taste des Browsers (history.pushState / popstate).

   EINHÄNGEN: oberflaeche.js – Knopf „Anschauen" in der Karte des Autos
   und Tipp auf ein fahrendes Auto (dann stehen unten in der Schau die
   Knöpfe der Karte). Prüfen: node werkzeug/pruefe-821-autoschau.js
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  if (!ST) return;
  const AS = (ST.autoschau = { offen: false, angefragt: [] });
  const PFAD = "stadt-leicht/bilder/";
  /* Die drei Neigungen und ihre Blätter */
  const STUFEN = [14, 30, 55];
  const BLAETTER = { viper: ["auftritt_viper", "schau_viper_30", "schau_viper_55"], batmobil: ["auftritt_batmobil", "schau_batmobil_30", "schau_batmobil_55"] };
  const TAU = Math.PI * 2, RAD = Math.PI / 180;
  const klemm = (v, a, b) => (v < a ? a : v > b ? b : v);
  const glatt = (u) => { u = klemm(u, 0, 1); return u * u * (3 - 2 * u); };

  /* ---------------- Aussehen (eigene Regeln, damit leicht.css unberührt bleibt) ---------------- */
  const CSS = `
.as-ebene { position: fixed; inset: 0; z-index: 50; background: #10141f; color: #f3ead8; font: 14px system-ui, sans-serif; touch-action: none; user-select: none; -webkit-user-select: none; overflow: hidden; }
.as-ebene canvas.as-leinwand { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; display: block; }
.as-kopf { position: absolute; left: 0; right: 0; top: 0; padding: max(10px, env(safe-area-inset-top)) 60px 0 16px; pointer-events: none; }
.as-name { font: 700 19px/1.2 Georgia, serif; letter-spacing: .01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.as-unter { margin-top: 2px; font: 600 12px/1.2 system-ui, sans-serif; color: #f3c35a; }
.as-unter.as-dein { color: #9fd67e; }
.as-zu { position: absolute; top: max(10px, env(safe-area-inset-top)); right: 10px; width: 42px; height: 42px; border-radius: 13px; border: 1px solid rgba(255,255,255,.2); background: rgba(22,28,48,.8); color: #f3ead8; display: grid; place-items: center; padding: 0; cursor: pointer; }
.as-zu svg { width: 22px; height: 22px; }
.as-kipp { position: absolute; right: 8px; width: 30px; touch-action: none; cursor: ns-resize; }
.as-kipp .as-bahn { position: absolute; left: 13px; top: 0; bottom: 0; width: 4px; border-radius: 2px; background: rgba(255,255,255,.18); }
.as-kipp .as-marke { position: absolute; left: 9px; width: 12px; height: 12px; margin-top: -6px; border-radius: 50%; background: #2a3150; border: 2px solid rgba(243,234,216,.55); box-sizing: border-box; }
.as-kipp .as-marke.as-laedt { border-color: #f3c35a; animation: as-puls 1s ease-in-out infinite; }
.as-kipp .as-marke.as-fehlt { opacity: .3; }
.as-kipp .as-griff { position: absolute; left: 3px; width: 24px; height: 24px; margin-top: -12px; border-radius: 50%; background: #f3c35a; border: 2px solid #fff8e8; box-sizing: border-box; box-shadow: 0 2px 8px rgba(0,0,0,.45); }
.as-kipp .as-wert { position: absolute; right: 34px; width: 34px; margin-top: -8px; text-align: right; font: 700 11px/16px system-ui, sans-serif; color: rgba(243,234,216,.75); pointer-events: none; }
.as-kipp.as-laedt::after { content: ""; position: absolute; left: 7px; top: -22px; width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(243,195,90,.35); border-top-color: #f3c35a; animation: as-dreh .8s linear infinite; }
@keyframes as-puls { 50% { transform: scale(1.35); } }
@keyframes as-dreh { to { transform: rotate(360deg); } }
.as-fuss { position: absolute; left: 0; right: 0; bottom: 0; padding: 0 10px max(12px, env(safe-area-inset-bottom)); display: flex; flex-direction: column; align-items: center; gap: 8px; pointer-events: none; }
.as-tipp { font: 600 12px/1.3 system-ui, sans-serif; color: rgba(243,234,216,.7); text-align: center; transition: opacity .6s; max-width: 100%; }
.as-tipp.aus { opacity: 0; }
.as-knoepfe { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; align-items: center; pointer-events: auto; max-width: 560px; }
.as-knoepfe .lk-karte-knoepfe { display: contents; }
.as-knoepfe .lk-karte-titel { display: none; }
.as-knoepfe .lk-karte-zeile { display: none; }
.as-knoepfe .lk-text-knopf { height: 40px; }
.as-zurueck { height: 40px; padding: 0 14px 0 8px; border-radius: 13px; border: 1px solid rgba(255,255,255,.25); background: rgba(22,28,48,.85); color: #f3ead8; display: inline-flex; align-items: center; gap: 4px; font: 700 14px system-ui, sans-serif; cursor: pointer; }
.as-zurueck svg { width: 20px; height: 20px; }
.as-fehler { position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%); text-align: center; color: #f3ead8; font: 600 14px system-ui, sans-serif; }
`;
  const KREUZ = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const ZURUECK = '<svg viewBox="0 0 24 24"><path d="M14.5 5 7.5 12l7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------------- Blätter laden (erst beim Öffnen) und freigeben ---------------- */
  function pfad(n) { const v = (ST.bilder && ST.bilder.version) || window.LEICHT_STEMPEL || ""; return PFAD + n + (v ? "?v=" + v : ""); }
  function bildLaden(n, lager) {
    return new Promise((ja, nein) => {
      const i = new Image();
      i.decoding = "async";
      lager.push(i);
      i.onload = () => { (i.decode ? i.decode().catch(() => {}) : Promise.resolve()).then(() => ja(i)); };
      i.onerror = () => nein(new Error(n + " fehlt"));
      AS.angefragt.push(n);
      i.src = pfad(n);
    });
  }
  function stufeLaden(z, k) {
    const St = z.stufen[k];
    if (z !== offen) return Promise.resolve();
    St.laedt = true;
    AS.angefragt.push(St.name + ".json");
    return fetch(pfad(St.name + ".json")).then((r) => { if (!r.ok) throw new Error(St.name + ".json fehlt"); return r.json(); })
      .then((M) => {
        if (z !== offen) throw new Error("geschlossen");
        St.M = M;
        return Promise.all([Promise.all(M.blaetter.map((n) => bildLaden(n, z.bilder))), bildLaden(M.schatten, z.bilder)]);
      })
      .then((b) => {
        if (z !== offen) return;
        St.blaetter = b[0]; St.schatten = b[1]; St.fertig = true; St.laedt = false;
        St.lenk0 = Math.max(0, St.M.lenk.indexOf(0));
        St.mMax = St.M.bilder.reduce((t, B) => Math.max(t, B.m || St.M.s), 0);
        massstab(z);
        kippAnzeigen(); zeichnenBald();
      })
      .catch((e) => { St.laedt = false; if (z !== offen) return; St.fehler = true; kippAnzeigen(); if (k === 0) fehlerZeigen(z, e); });
  }

  /* ---------------- Ein Modellpunkt im Drehblatt (wie lcAuto3dPunkt in app.js) ----------------
     Versatz zum Anker (Fußpunkt der Wagenmitte) in Metern auf dem Bild und die Nähe zum Betrachter */
  function punkt(neig, gier, p) {
    const e = neig * RAD, KY = Math.SQRT1_2 * Math.sin(e), KZ = Math.cos(e);
    const r = gier * RAD, c = Math.cos(r), sn = Math.sin(r);
    const a = p[0] * c - p[1] * sn, b = p[0] * sn + p[1] * c;
    return [(a - b) * Math.SQRT1_2, (a + b) * KY - p[2] * KZ, (a + b) * KZ * Math.SQRT1_2 + p[2] * Math.sin(e)];
  }
  /* Wie weit reicht das Auto (Quader aus Grundriss und Höhe) um den Drehpunkt – über alle Winkel und Neigungen?
     Daraus die Anfangsgröße, bei der es sich ganz herumdrehen und kippen lässt, ohne anzustoßen. */
  function masseRechnen(z) {
    const A = z.A, L = A.fuss[1] / 2 + 0.12, B = A.fuss[0] / 2 + 0.08, H = A.hoehe * 1.12;
    let mx = 0, my = 0;
    for (const n of STUFEN) for (let g = 0; g < 360; g += 5.625) {
      const hp = punkt(n, g, [0, 0, z.hp]);
      for (const sx of [-B, B]) for (const sy of [-L, L]) for (const sz of [0, H]) {
        const p = punkt(n, g, [sx, sy, sz]);
        mx = Math.max(mx, Math.abs(p[0] - hp[0])); my = Math.max(my, Math.abs(p[1] - hp[1]));
      }
    }
    z.mx = mx; z.my = my;
  }

  /* ---------------- Die Stadt darunter ruht ----------------
     Solange die Schau offen ist (sie deckt alles zu), malt die Stadt nicht – Autos, Leute und Bahn bewegen sich
     weiter, nur das Zeichnen von Boden und Dingen pausiert. Das spart am Telefon Rechenzeit und Akku. */
  let ruhend = null;
  function stadtRuhen(an) {
    if (an && !ruhend) {
      ruhend = [];
      for (const o of [ST.szene, ST.boden]) if (o && typeof o.zeichnen === "function") { ruhend.push([o, o.zeichnen]); o.zeichnen = function () {}; }
    } else if (!an && ruhend) {
      for (const [o, f] of ruhend) o.zeichnen = f;
      ruhend = null;
    }
  }

  /* ---------------- Zustand ---------------- */
  let offen = null;              // die offene Schau (oder null)
  let gepusht = false;           // steht unser Eintrag in der Browser-Geschichte?
  let css = null;

  AS.oeffnen = function (id, opt) {
    const AU = ST.autos, A = AU && AU.ARTEN[id];
    if (!A || !BLAETTER[id]) return false;
    /* schon offen (das andere Auto): der Eintrag in der Geschichte bleibt und gilt für die neue Schau */
    if (offen) { const g = gepusht; AS.schliessen({ ausGeschichte: true }); gepusht = g; }
    opt = opt || {};
    if (!css) { css = el("style"); css.textContent = CSS; document.head.appendChild(css); }
    const z = (offen = {
      id: id, A: A, opt: opt, bilder: [],
      stufen: STUFEN.map((n, k) => ({ neig: n, name: BLAETTER[id][k], fertig: false, laedt: false, fehler: false })),
      /* Blick: Gier (Grad, stufenlos), Neigung (Grad, stufenlos zwischen 14 und 55) */
      gier: 292.5, gv: 0, neig: 14, nZiel: 14,
      /* Zoom: S = CSS-Pixel je Meter, Verschiebung des Drehpunkts gegenüber der Mitte der Bühne */
      S: 0, ox: 0, oy: 0, zoomFlug: null, hp: A.hoehe * 0.42,
      zeiger: new Map(), modus: "", tipps: [], ruhe: true, zuletzt: 0
    });
    const eb = (z.ebene = el("div", "as-ebene"));
    eb.setAttribute("role", "dialog"); eb.setAttribute("aria-label", A.name + " ansehen");
    const cv = (z.cv = el("canvas", "as-leinwand"));
    z.g = cv.getContext("2d");
    z.lage = document.createElement("canvas"); z.misch = document.createElement("canvas");
    const kopf = el("div", "as-kopf"); z.name = el("div", "as-name"); z.unter = el("div", "as-unter");
    z.name.textContent = A.name; kopf.append(z.name, z.unter);
    const zu = el("button", "as-zu", KREUZ); zu.type = "button"; zu.title = "Schließen"; zu.setAttribute("aria-label", "Schließen");
    zu.addEventListener("click", (e) => { e.stopPropagation(); AS.schliessen(); });
    /* der Griff für die Z-Achse: senkrechter Schieber am rechten Rand */
    const kipp = (z.kipp = el("div", "as-kipp")); kipp.setAttribute("role", "slider"); kipp.setAttribute("aria-label", "Neigung");
    kipp.setAttribute("aria-valuemin", STUFEN[0]); kipp.setAttribute("aria-valuemax", STUFEN[STUFEN.length - 1]);
    kipp.appendChild(el("div", "as-bahn"));
    z.marken = STUFEN.map((n) => { const m = el("div", "as-marke"); m.dataset.neig = n; const w = el("div", "as-wert"); w.textContent = n + "°"; kipp.append(m, w); m._wert = w; return m; });
    z.griff = el("div", "as-griff"); kipp.appendChild(z.griff);
    const fuss = el("div", "as-fuss");
    z.tipp = el("div", "as-tipp"); z.tipp.textContent = "Wischen: drehen · hoch/runter: kippen · zwei Finger: näher";
    z.knoepfe = el("div", "as-knoepfe");
    fuss.append(z.tipp, z.knoepfe);
    z.fuss = fuss;
    eb.append(cv, kopf, kipp, fuss, zu);
    document.body.appendChild(eb);
    knoepfeBauen(z);
    untertitel(z);
    z.uhr = setInterval(() => untertitel(z), 1000);
    /* Eingaben */
    cv.addEventListener("pointerdown", runter);
    cv.addEventListener("pointermove", ziehen);
    cv.addEventListener("pointerup", hoch);
    cv.addEventListener("pointercancel", hoch);
    cv.addEventListener("wheel", rad, { passive: false });
    kipp.addEventListener("pointerdown", kippRunter);
    kipp.addEventListener("pointermove", kippZiehen);
    kipp.addEventListener("pointerup", kippHoch);
    kipp.addEventListener("pointercancel", kippHoch);
    eb.addEventListener("click", (e) => e.stopPropagation());
    window.addEventListener("resize", groesse);
    document.addEventListener("keydown", taste);
    /* Zurück-Taste des Browsers: ein eigener Eintrag in der Geschichte */
    try { if (!(history.state && history.state.autoschau)) history.pushState({ autoschau: id }, ""); gepusht = true; } catch (e) { gepusht = false; }
    AS.offen = true;
    stadtRuhen(true);
    masseRechnen(z);
    groesse();
    /* zuerst die 14°-Stufe, danach die anderen im Hintergrund – nacheinander, damit die erste schnell da ist */
    stufeLaden(z, 0).then(() => stufeLaden(z, 1)).then(() => stufeLaden(z, 2));
    kippAnzeigen();
    return true;
  };

  AS.schliessen = function (o) {
    o = o || {};
    const z = offen;
    if (!z) return;
    offen = null; AS.offen = false;
    if (z.raf) cancelAnimationFrame(z.raf);
    clearInterval(z.uhr);
    window.removeEventListener("resize", groesse);
    document.removeEventListener("keydown", taste);
    z.ebene.remove();
    stadtRuhen(false);
    /* Bilder freigeben */
    for (const i of z.bilder) { i.onload = i.onerror = null; try { i.removeAttribute("src"); i.src = ""; } catch (e) {} }
    z.bilder.length = 0;
    z.stufen.forEach((St) => { St.blaetter = null; St.schatten = null; St.M = null; });
    z.cv.width = z.cv.height = 0; z.lage.width = z.lage.height = 0; z.misch.width = z.misch.height = 0;
    if (!o.ausGeschichte && gepusht) { gepusht = false; try { if (history.state && history.state.autoschau) history.back(); } catch (e) {} }
    gepusht = false;
    if (ST.leicht) ST.leicht.unruhe = 2;
  };
  window.addEventListener("popstate", () => { if (offen) AS.schliessen({ ausGeschichte: true }); });
  function taste(e) { if (e.key === "Escape" && offen) { e.preventDefault(); AS.schliessen(); } }

  /* für die Probe: was gerade zu sehen ist */
  AS.zustand = function () {
    const z = offen;
    if (!z) return { offen: false, angefragt: AS.angefragt.slice() };
    const d = z.dpr || 1, B = aktBild(z);
    return {
      offen: true, id: z.id, gier: z.gier, gv: z.gv, neig: z.neig, S: z.S, Sfit: z.Sfit, Smax: z.Smax, Svoll: z.Svoll, dpr: d,
      /* Bildpunkte des Blatts je Gerätepixel (≥ 1 = volle Auflösung erreicht) */
      voll: B ? z.S * d / (B.m || 1) : 0, ox: z.ox, oy: z.oy, ruhe: z.ruhe, modus: z.modus, finger: z.zeiger.size, laeuft: !!z.raf,
      stufen: z.stufen.map((St) => ({ neig: St.neig, fertig: St.fertig, laedt: St.laedt, fehler: St.fehler })),
      angefragt: AS.angefragt.slice(), gemalt: z.gemalt || 0, buehne: z.bue,
      /* wo die Karosserie zuletzt gemalt wurde (CSS-Pixel: x, y, Breite, Höhe) */
      rahmen: z.rahmen ? z.rahmen.map((v) => Math.round(v)) : null
    };
  };

  /* für die Probe und die Bildschirmfotos: Blick fest einstellen (Gier, Neigung, Maßstab) und sofort malen */
  AS.stellen = function (o) {
    const z = offen;
    if (!z) return null;
    o = o || {};
    if (o.gier != null) { z.gier = ((o.gier % 360) + 360) % 360; z.gv = 0; z.gZiel = null; }
    if (o.neig != null) { z.neig = klemm(o.neig, STUFEN[0], STUFEN[STUFEN.length - 1]); z.nZiel = null; }
    if (o.S != null) { z.S = klemm(o.S, z.Sfit, z.Smax); verschiebungKlemmen(z); }
    if (o.mitte) { z.ox = 0; z.oy = 0; }
    kippAnzeigen(); zeichnen(z);
    return AS.zustand();
  };

  /* ---------------- Knöpfe unten: die der Karte (oberflaeche.js) und „Zurück" ---------------- */
  function knoepfeBauen(z) {
    z.knoepfe.innerHTML = "";
    const eigene = el("div", "as-karte");
    eigene.style.display = "contents";
    z.knoepfe.appendChild(eigene);
    if (z.opt.knoepfe) { try { z.opt.knoepfe(eigene); } catch (e) { console.error(e); } }
    const zb = el("button", "as-zurueck", ZURUECK + "<span>Zurück</span>"); zb.type = "button";
    zb.addEventListener("click", (e) => { e.stopPropagation(); AS.schliessen(); });
    z.knoepfe.appendChild(zb);
  }
  function untertitel(z) {
    const AU = ST.autos, hat = AU.hat(z.id), rest = AU.probeRest ? AU.probeRest(z.id) : 0;
    const t = hat ? "Dein Auto" : rest > 0 ? "Probefahrt – noch " + Math.ceil(rest) + " s" : "Preis " + z.A.preis + " Punkte";
    if (z.unter.textContent !== t) z.unter.textContent = t;
    z.unter.classList.toggle("as-dein", hat);
    /* die Knöpfe der Karte nehmen Platz weg: Bühne neu messen, wenn sich ihre Höhe ändert */
    const h = z.fuss.getBoundingClientRect().height;
    if (Math.abs(h - (z.fussH || 0)) > 1) groesse();
  }
  AS.auffrischen = function () { if (offen) { untertitel(offen); knoepfeBauen(offen); groesse(); } };

  /* ---------------- Größe, Bühne, Maßstab ---------------- */
  function groesse() {
    const z = offen;
    if (!z) return;
    const W = z.ebene.clientWidth || window.innerWidth, H = z.ebene.clientHeight || window.innerHeight;
    const d = Math.min(2, window.devicePixelRatio || 1);
    z.W = W; z.H = H; z.dpr = d;
    for (const c of [z.cv, z.lage, z.misch]) { c.width = Math.round(W * d); c.height = Math.round(H * d); }
    /* die Bühne: zwischen Kopf (Name) und Fuß (Knöpfe), rechts Platz für den Schieber */
    const fr = z.fuss.getBoundingClientRect(); z.fussH = fr.height;
    const oben = 58, unten = H - fr.height - 6;
    const rand = W < 520 ? 44 : 64;
    z.bue = { x: rand * 0.5, y: oben, w: Math.max(80, W - rand * 1.5 - 8), h: Math.max(80, unten - oben) };
    z.bue.x = (W - z.bue.w) / 2 - (W < 520 ? 10 : 0);
    /* Schieber: senkrecht mittig an der Bühne */
    const kh = Math.round(klemm(z.bue.h * 0.5, 110, 220));
    z.kipp.style.height = kh + "px";
    z.kipp.style.top = Math.round(z.bue.y + (z.bue.h - kh) / 2) + "px";
    z.kh = kh;
    massstab(z);
    kippAnzeigen();
    zeichnenBald();
  }
  function massstab(z) {
    if (!z.mx) return;
    const alt = z.Sfit;
    z.Sfit = Math.min(z.bue.w / 2 / z.mx, z.bue.h / 2 / z.my) * 0.96;
    /* volle Auflösung: ein Bildpunkt des feinsten Blatts je Gerätepixel */
    const mMax = z.stufen.reduce((t, St) => Math.max(t, St.mMax || 0), 0) || 180;
    z.Svoll = mMax / z.dpr;
    z.Smax = Math.max(z.Svoll, z.Sfit * 2);
    if (!z.S || !alt) z.S = z.Sfit;
    else z.S = klemm(z.S * z.Sfit / alt, z.Sfit, z.Smax);
    verschiebungKlemmen(z);
  }
  function verschiebungKlemmen(z) {
    const bx = Math.max(0, z.mx * z.S - z.bue.w * 0.3), by = Math.max(0, z.my * z.S - z.bue.h * 0.3);
    z.ox = klemm(z.ox, -bx, bx); z.oy = klemm(z.oy, -by, by);
    if (z.S <= z.Sfit * 1.001) { z.ox = 0; z.oy = 0; }
  }
  function drehpunkt(z) { return [z.bue.x + z.bue.w / 2 + z.ox, z.bue.y + z.bue.h / 2 + z.oy]; }
  function zoomUm(z, S, mx, my) {
    S = klemm(S, z.Sfit, z.Smax);
    const P = drehpunkt(z), k = S / z.S;
    z.ox += (P[0] - mx) * (k - 1); z.oy += (P[1] - my) * (k - 1);
    z.S = S;
    verschiebungKlemmen(z);
  }

  /* ---------------- Schieber (Z-Achse) ---------------- */
  /* die steilste geladene Stufe (fehlt eine dazwischen, wird über sie hinweg überblendet) */
  function hoechsteStufe(z) { let n = STUFEN[0]; for (const St of z.stufen) if (St.fertig) n = St.neig; return n; }
  function kippY(z, n) { const u = (n - STUFEN[0]) / (STUFEN[STUFEN.length - 1] - STUFEN[0]); return (1 - u) * (z.kh - 24) + 12; }
  function kippAnzeigen() {
    const z = offen;
    if (!z || !z.kh) return;
    z.marken.forEach((m, k) => {
      const St = z.stufen[k], y = kippY(z, St.neig);
      m.style.top = y + "px"; m._wert.style.top = y + "px";
      m.classList.toggle("as-laedt", !St.fertig && !St.fehler);
      m.classList.toggle("as-fehlt", St.fehler);
    });
    z.griff.style.top = kippY(z, z.neig) + "px";
    const laedt = z.stufen.some((St) => !St.fertig && !St.fehler);
    z.kipp.classList.toggle("as-laedt", laedt);
    z.kipp.setAttribute("aria-busy", laedt ? "true" : "false");
    z.kipp.setAttribute("aria-valuenow", Math.round(z.neig));
  }
  function kippAus(z, y) { const u = 1 - (y - 12) / (z.kh - 24); return STUFEN[0] + klemm(u, 0, 1) * (STUFEN[STUFEN.length - 1] - STUFEN[0]); }
  function kippRunter(e) {
    const z = offen; if (!z) return;
    e.preventDefault(); e.stopPropagation();
    z.kipp.setPointerCapture(e.pointerId); z.kippZeiger = e.pointerId;
    kippZiehen(e);
  }
  function kippZiehen(e) {
    const z = offen; if (!z || z.kippZeiger !== e.pointerId) return;
    const r = z.kipp.getBoundingClientRect();
    neigungSetzen(z, kippAus(z, e.clientY - r.top));
    z.nZiel = null; beruehrt(z); laufen();
  }
  function kippHoch(e) {
    const z = offen; if (!z || z.kippZeiger !== e.pointerId) return;
    z.kippZeiger = null; einrasten(z); laufen();
  }
  /* Neigung setzen – über die höchste geladene Stufe hinaus nur ein kleines Stück (federt zurück) */
  function neigungSetzen(z, n) {
    const hi = hoechsteStufe(z);
    if (n > hi) n = hi + Math.min(3, (n - hi) * 0.25);
    z.neig = klemm(n, STUFEN[0] - 2, STUFEN[STUFEN.length - 1]);
    if (z.neig < STUFEN[0]) z.neig = STUFEN[0] - Math.min(2, (STUFEN[0] - n) * 0.25);
  }
  function einrasten(z) {
    const hi = hoechsteStufe(z);
    let best = STUFEN[0];
    for (const St of z.stufen) if (St.fertig && St.neig <= hi && Math.abs(St.neig - z.neig) < Math.abs(best - z.neig)) best = St.neig;
    z.nZiel = best;
  }

  /* ---------------- Finger und Maus auf der Leinwand ---------------- */
  /* Zeit des Ereignisses selbst (nicht, wann es verarbeitet wird) – so stimmt der Schwung auch, wenn das Gerät gerade langsam malt */
  const zeit = (e) => (e && e.timeStamp > 0 ? e.timeStamp : performance.now());
  function beruehrt(z) { if (!z.tipp.classList.contains("aus")) setTimeout(() => z.tipp.classList.add("aus"), 1800); }
  function runter(e) {
    const z = offen; if (!z) return;
    e.preventDefault();
    z.cv.setPointerCapture(e.pointerId);
    const p = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t0: zeit(e), t: zeit(e) };
    z.zeiger.set(e.pointerId, p);
    z.gv = 0; z.gZiel = null; z.nZiel = null; z.zoomFlug = null;
    if (z.zeiger.size === 1) { z.modus = "?"; z.weg = 0; }
    else if (z.zeiger.size === 2) { z.modus = "zoom"; const [a, b] = [...z.zeiger.values()]; z.kneif = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }; einrasten(z); }
    z.ruhe = false;
    beruehrt(z); laufen();
  }
  function ziehen(e) {
    const z = offen; if (!z || !z.zeiger.has(e.pointerId)) return;
    const p = z.zeiger.get(e.pointerId), jetzt = zeit(e);
    const dx = e.clientX - p.x, dy = e.clientY - p.y, dt = Math.max(1, jetzt - p.t);
    p.x = e.clientX; p.y = e.clientY; p.t = jetzt;
    if (z.modus === "zoom" && z.zeiger.size >= 2) {
      const [a, b] = [...z.zeiger.values()], d = Math.hypot(a.x - b.x, a.y - b.y) || 1, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      zoomUm(z, z.S * d / z.kneif.d, mx, my);
      z.ox += mx - z.kneif.mx; z.oy += my - z.kneif.my; verschiebungKlemmen(z);
      z.kneif = { d: d, mx: mx, my: my };
      zeichnenBald();
      return;
    }
    if (z.zeiger.size !== 1) return;
    z.weg += Math.abs(dx) + Math.abs(dy);
    if (z.modus === "?") {
      const gx = e.clientX - p.x0, gy = e.clientY - p.y0;
      if (Math.hypot(gx, gy) < 8) return;
      z.modus = Math.abs(gx) >= Math.abs(gy) ? "dreh" : "kipp";
    }
    if (z.modus === "dreh") {
      /* nach rechts ziehen = die vordere Seite wandert mit dem Finger nach rechts; eine Bühnenbreite ≈ 200° */
      const k = 200 / Math.max(260, Math.min(z.bue.w, 900));
      const dg = -dx * k;
      z.gier = ((z.gier + dg) % 360 + 360) % 360;
      const v = dg / dt * 1000;
      z.gv = z.gv * 0.35 + v * 0.65;
      z.zuletzt = jetzt; z.schrittDt = dt;
    } else if (z.modus === "kipp") {
      /* hoch ziehen = mehr von oben (wie der Schieber) */
      neigungSetzen(z, z.neig - dy * 41 / Math.max(180, Math.min(z.bue.h, 420)));
      kippAnzeigen();
    }
    zeichnenBald();
  }
  function hoch(e) {
    const z = offen; if (!z || !z.zeiger.has(e.pointerId)) return;
    const p = z.zeiger.get(e.pointerId), jetzt = zeit(e);
    z.zeiger.delete(e.pointerId);
    if (z.modus === "zoom") {
      if (z.zeiger.size === 0) z.modus = "";
      else z.modus = "aus";   // ein Finger bleibt: nichts mehr tun, bis alle weg sind
      laufen();
      return;
    }
    if (z.zeiger.size) return;
    const war = z.modus; z.modus = "";
    /* hat der Finger vor dem Loslassen still gehalten? (auf langsamen Geräten kommen die Ereignisse seltener) */
    if (war === "dreh" && jetzt - z.zuletzt > Math.max(120, 2.5 * (z.schrittDt || 0))) z.gv = 0;
    if (war === "dreh") z.gv = klemm(z.gv, -900, 900);
    if (war === "kipp" || war === "?") einrasten(z);
    /* Tipp: zwei kurz nacheinander an fast derselben Stelle = Doppeltipp */
    if (war === "?" && jetzt - p.t0 < 350) {
      const t = z.tipps.filter((q) => jetzt - q.t < 350 && Math.hypot(q.x - p.x, q.y - p.y) < 30);
      if (t.length) { doppeltipp(z, p.x, p.y); z.tipps = []; } else z.tipps = [{ t: jetzt, x: p.x, y: p.y }];
    }
    laufen();
  }
  function doppeltipp(z, x, y) {
    const nah = z.S > z.Sfit * 1.25;
    const ziel = nah ? z.Sfit : Math.min(z.Smax, Math.max(z.Svoll, z.Sfit * 1.8));
    z.zoomFlug = { t0: performance.now(), d: 380, S0: z.S, S1: ziel, x: x, y: y, ox0: z.ox, oy0: z.oy, zurueck: nah };
    laufen();
  }
  function rad(e) {
    const z = offen; if (!z) return;
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    z.zoomFlug = null;
    zoomUm(z, z.S * Math.exp(-dy * 0.0015), e.clientX, e.clientY);
    beruehrt(z); zeichnenBald();
  }

  /* ---------------- Bewegung: Schwung, Einrasten, Zoomflug ---------------- */
  function laufen() {
    const z = offen;
    if (!z || z.raf) return;
    z.tAlt = performance.now();
    z.raf = requestAnimationFrame(schritt);
  }
  function zeichnenBald() { laufen(); }
  function schritt(jetzt) {
    const z = offen;
    if (!z) return;
    z.raf = 0;
    const dt = klemm((jetzt - (z.tAlt || jetzt)) / 1000, 0, 0.05);
    z.tAlt = jetzt;
    let weiter = false;
    const finger = z.zeiger.size > 0 || z.kippZeiger != null;
    const schrittW = 360 / 32;
    /* Drehen: Schwung, dann weich auf den nächsten Winkel (dort ist das Bild scharf) */
    if (!finger || z.modus !== "dreh") {
      if (Math.abs(z.gv) > 25) {
        z.gier = ((z.gier + z.gv * dt) % 360 + 360) % 360;
        z.gv *= Math.exp(-dt * 3.5);
        z.gZiel = null;
        weiter = true;
      } else if (!finger || z.modus === "zoom" || z.modus === "aus") {
        /* in Drehrichtung zum nächsten Winkel (einmal bestimmt, dann dorthin gleiten) */
        if (z.gZiel == null) {
          z.gZiel = Math.abs(z.gv) > 3 ? (z.gv > 0 ? Math.ceil(z.gier / schrittW - 0.02) : Math.floor(z.gier / schrittW + 0.02)) * schrittW : Math.round(z.gier / schrittW) * schrittW;
          z.gZiel = ((z.gZiel % 360) + 360) % 360;
        }
        z.gv = 0;
        const d = ((z.gZiel - z.gier + 540) % 360) - 180;
        if (Math.abs(d) > 0.02) { z.gier = ((z.gier + d * (1 - Math.exp(-dt * 12))) % 360 + 360) % 360; weiter = true; }
        else z.gier = z.gZiel;
      }
    }
    /* Kippen: einrasten */
    if (z.nZiel != null && !(finger && z.modus === "kipp")) {
      const d = z.nZiel - z.neig;
      if (Math.abs(d) > 0.05) { z.neig += d * (1 - Math.exp(-dt * 10)); weiter = true; }
      else { z.neig = z.nZiel; z.nZiel = null; }
      kippAnzeigen();
    } else if (!finger && z.nZiel == null && STUFEN.indexOf(z.neig) < 0) { einrasten(z); weiter = true; }
    /* Zoomflug (Doppeltipp) */
    if (z.zoomFlug) {
      const F = z.zoomFlug, u = glatt((jetzt - F.t0) / F.d);
      const S = F.S0 + (F.S1 - F.S0) * u;
      if (F.zurueck) { z.S = S; z.ox = F.ox0 * (1 - u); z.oy = F.oy0 * (1 - u); }
      else zoomUm(z, S, F.x, F.y);
      if (u >= 1) z.zoomFlug = null; else weiter = true;
    } else if (!finger && z.S < z.Sfit * 1.04 && (Math.abs(z.ox) + Math.abs(z.oy) > 0.5)) {
      z.ox *= 0.8; z.oy *= 0.8; weiter = true;
    }
    z.ruhe = !weiter && !finger;
    zeichnen(z);
    if (weiter || finger) z.raf = requestAnimationFrame(schritt);
  }

  /* ---------------- Zeichnen ---------------- */
  function aktBild(z) {
    const k = stufeIndex(z)[0], St = z.stufen[k];
    if (!St || !St.fertig) return null;
    const N = St.M.bilder.length;
    return St.M.bilder[Math.round(z.gier / (360 / N)) % N];
  }
  /* welche zwei Stufen, und wie weit zwischen ihnen (nur geladene) */
  function stufeIndex(z) {
    const bereit = [];
    z.stufen.forEach((St, k) => { if (St.fertig) bereit.push(k); });
    if (!bereit.length) return [0, 0, 0];
    const n = z.neig;
    let a = bereit[0], b = bereit[0];
    for (const k of bereit) { if (z.stufen[k].neig <= n) a = k; }
    b = a;
    for (const k of bereit) { if (z.stufen[k].neig > z.stufen[a].neig) { b = k; break; } }
    if (b === a || n <= z.stufen[a].neig) return [a, a, 0];
    return [a, b, klemm((n - z.stufen[a].neig) / (z.stufen[b].neig - z.stufen[a].neig), 0, 1)];
  }
  function hintergrund(z, g, nacht) {
    const W = z.W, H = z.H, P = drehpunkt(z);
    const gr = g.createRadialGradient(P[0], P[1] - z.bue.h * 0.1, 10, P[0], P[1], Math.max(W, H) * 0.8);
    const hell = 1 - 0.45 * nacht;
    const c = (r, gg, b) => "rgb(" + Math.round(r * hell) + "," + Math.round(gg * hell) + "," + Math.round(b * hell) + ")";
    gr.addColorStop(0, c(70, 78, 102)); gr.addColorStop(0.45, c(38, 44, 64)); gr.addColorStop(1, c(14, 17, 27));
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    /* Drehscheibe am Boden: ein Kreis, der mit der Neigung flacher wird – so sieht man das Kippen auch am Boden */
    const e = z.neig * RAD, R = Math.min((z.A.fuss[1] * 0.62 + 0.3) * (z.Sfit || z.S), z.bue.w / 2 - 4) * z.S / (z.Sfit || z.S), ry = R * Math.sin(e);
    const bx = P[0], by = P[1] + z.hp * Math.cos(e) * z.S;
    g.save();
    g.translate(bx, by); g.scale(1, Math.max(0.05, ry / R));
    const sch = g.createRadialGradient(0, 0, R * 0.2, 0, 0, R * 1.25);
    sch.addColorStop(0, "rgba(255,255,255,0.10)"); sch.addColorStop(0.78, "rgba(255,255,255,0.05)"); sch.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = sch; g.beginPath(); g.arc(0, 0, R * 1.25, 0, TAU); g.fill();
    g.strokeStyle = "rgba(243,234,216,0.16)"; g.lineWidth = 1.5 / Math.max(0.05, ry / R);
    g.beginPath(); g.arc(0, 0, R, 0, TAU); g.stroke();
    /* weicher Bodenschatten unter dem Wagen */
    const bs = g.createRadialGradient(0, 0, 0, 0, 0, R * 0.8);
    bs.addColorStop(0, "rgba(0,0,0,0.42)"); bs.addColorStop(0.6, "rgba(0,0,0,0.18)"); bs.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = bs; g.beginPath(); g.arc(0, 0, R * 0.8, 0, TAU); g.fill();
    g.restore();
  }
  /* Lage eines Blatt-Bildes auf dem Schirm: Anker (Fußpunkt) und Faktor Blatt → CSS-Pixel */
  function lage(z, St, Bd) {
    const P = drehpunkt(z), e = St.neig * RAD;
    return { ax: P[0], ay: P[1] + z.hp * Math.cos(e) * z.S, f: z.S / (Bd.m || St.M.s) };
  }
  function schattenMalen(z, g, St, j, w) {
    const Bd = St.M.bilder[j], L = lage(z, St, Bd), f = L.f;
    g.globalAlpha = 0.5 * w;
    g.drawImage(St.schatten, Bd.s[1], Bd.s[2], Bd.s[3], Bd.s[4], L.ax + Bd.so[0] * f, L.ay + Bd.so[1] * f, Bd.s[3] / St.M.sf * f, Bd.s[4] / St.M.sf * f);
    g.globalAlpha = 1;
  }
  function autoMalen(z, g, St, j) {
    const Bd = St.M.bilder[j], L = lage(z, St, Bd), f = L.f, bl = (b) => St.blaetter[b[0]];
    /* ohne Zeichenfläche (g = null) wird nur gemessen */
    if (g) g.drawImage(bl(Bd.b), Bd.b[1], Bd.b[2], Bd.b[3], Bd.b[4], L.ax - Bd.a[0] * f, L.ay - Bd.a[1] * f, Bd.b[3] * f, Bd.b[4] * f);
    /* Räder: Flicken mit Lenkeinschlag 0 und Radstellung 0, hintere zuerst */
    const fl = Bd.r.filter((r) => r.k === 0 && (r.l < 0 || r.l === St.lenk0)).sort((a, b) => a.n - b.n);
    let x0 = L.ax - Bd.a[0] * f, y0 = L.ay - Bd.a[1] * f, x1 = x0 + Bd.b[3] * f, y1 = y0 + Bd.b[4] * f;
    for (const r of fl) {
      const x = L.ax + r.o[0] * f, y = L.ay + r.o[1] * f;
      if (g) g.drawImage(bl(r.b), r.b[1], r.b[2], r.b[3], r.b[4], x, y, r.b[3] * f, r.b[4] * f);
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + r.b[3] * f); y1 = Math.max(y1, y + r.b[4] * f);
    }
    return [x0, y0, x1 - x0, y1 - y0];
  }
  /* Scheinwerfer und Rücklichter leuchten, wenn es in der Stadt dunkel ist */
  function lichterMalen(z, g, gier, nacht) {
    if (nacht < 0.2) return;
    const A = z.A, P = drehpunkt(z), e = z.neig * RAD, ax = P[0], ay = P[1] + z.hp * Math.cos(e) * z.S;
    const r = gier * RAD, vorn = (Math.cos(r) - Math.sin(r)) * Math.SQRT1_2;   // > 0: die Nase zeigt zum Betrachter
    const glut = (p, farbe, a, gr) => {
      if (a <= 0.02) return;
      const q = punkt(z.neig, gier, p), x = ax + q[0] * z.S, y = ay + q[1] * z.S, R = gr * z.S;
      const gd = g.createRadialGradient(x, y, 0, x, y, R);
      gd.addColorStop(0, "rgba(" + farbe + "," + a.toFixed(3) + ")"); gd.addColorStop(0.3, "rgba(" + farbe + "," + (a * 0.35).toFixed(3) + ")"); gd.addColorStop(1, "rgba(" + farbe + ",0)");
      g.fillStyle = gd; g.beginPath(); g.arc(x, y, R, 0, TAU); g.fill();
    };
    g.save(); g.globalCompositeOperation = "lighter";
    const av = klemm(vorn * 1.8, 0, 1) * nacht, ah = klemm(-vorn * 1.8, 0, 1) * nacht;
    for (const p of A.lampen || []) glut(p, "255,244,214", 0.9 * av, 0.55);
    for (const p of A.rueck || []) glut(p, "255,60,40", 0.9 * ah, 0.45);
    g.restore();
  }
  function zeichnen(z) {
    const g = z.g, d = z.dpr || 1;
    if (!z.W) return;
    let nacht = 0;
    try { nacht = ST.szene && ST.szene.zeitDaten ? ST.szene.zeitDaten().grad || 0 : 0; } catch (e) {}
    g.setTransform(d, 0, 0, d, 0, 0);
    g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    hintergrund(z, g, nacht);
    const si = stufeIndex(z);
    const St0 = z.stufen[si[0]];
    if (!St0 || !St0.fertig) return;
    if (!z.Sfit) massstab(z);
    /* vier Nachbarn: zwei Winkel × zwei Neigungen, mit Gewichten (bilinear) */
    const teile = [];
    for (const [k, wn] of [[si[0], 1 - si[2]], [si[1], si[2]]]) {
      if (wn < 0.004) continue;
      const St = z.stufen[k], N = St.M.bilder.length, sw = 360 / N;
      const u = z.gier / sw, j0 = Math.floor(u) % N, j1 = (j0 + 1) % N, t = u - Math.floor(u);
      if (1 - t > 0.004) teile.push({ St: St, j: j0, w: wn * (1 - t) });
      if (t > 0.004) teile.push({ St: St, j: j1, w: wn * t });
    }
    const summe = teile.reduce((s, T) => s + T.w, 0) || 1;
    teile.forEach((T) => { T.w /= summe; });
    for (const T of teile) schattenMalen(z, g, T.St, T.j, T.w);
    if (teile.length === 1) {
      z.rahmen = autoMalen(z, g, teile[0].St, teile[0].j);
    } else {
      /* Überblenden: jede Ansicht (Karosserie + Räder) für sich, dann mit ihrem Gewicht addiert –
         wo beide Ansichten deckend sind, bleibt es deckend (kein Durchscheinen des Hintergrunds) */
      /* nur im Rechteck, das die Ansichten zusammen bedecken (Gerätepixel) – spart am Telefon viel Füllarbeit */
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const T of teile) { const r = autoMalen(z, null, T.St, T.j); x0 = Math.min(x0, r[0]); y0 = Math.min(y0, r[1]); x1 = Math.max(x1, r[0] + r[2]); y1 = Math.max(y1, r[1] + r[3]); }
      z.rahmen = [x0, y0, x1 - x0, y1 - y0];
      const rx = Math.max(0, Math.floor(x0 * d) - 2), ry = Math.max(0, Math.floor(y0 * d) - 2);
      const rw = Math.min(z.misch.width, Math.ceil(x1 * d) + 2) - rx, rh = Math.min(z.misch.height, Math.ceil(y1 * d) + 2) - ry;
      if (rw > 0 && rh > 0) {
        const lg = z.lage.getContext("2d"), mg = z.misch.getContext("2d");
        mg.setTransform(1, 0, 0, 1, 0, 0); mg.clearRect(rx, ry, rw, rh);
        mg.globalCompositeOperation = "lighter";
        for (const T of teile) {
          lg.setTransform(1, 0, 0, 1, 0, 0); lg.clearRect(rx, ry, rw, rh);
          lg.setTransform(d, 0, 0, d, 0, 0);
          autoMalen(z, lg, T.St, T.j);
          mg.globalAlpha = T.w;
          mg.drawImage(z.lage, rx, ry, rw, rh, rx, ry, rw, rh);
        }
        mg.globalAlpha = 1; mg.globalCompositeOperation = "source-over";
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.drawImage(z.misch, rx, ry, rw, rh, rx, ry, rw, rh);
        g.setTransform(d, 0, 0, d, 0, 0);
      }
    }
    lichterMalen(z, g, z.gier, nacht);
    z.gemalt = (z.gemalt || 0) + 1;
  }
  function fehlerZeigen(z, e) {
    const f = el("div", "as-fehler");
    f.textContent = "Das Auto lässt sich gerade nicht laden.";
    z.ebene.appendChild(f);
    if (window.console) console.warn("Auto-Schau: " + (e && e.message));
  }
})();
