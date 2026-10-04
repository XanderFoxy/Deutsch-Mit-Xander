/* =====================================================================
   TIER-BIBLIOTHEK — FORM: GLIED, SILHOUETTE, LICHT, MUSTER, OBERFLÄCHE (FASSUNG 880 — W2, W3, W4, W6)
   ---------------------------------------------------------------------
   XANDER (Funk 299, wörtlich): „die nächste Priorität sollte der Abschluss der Tiere sein mache bitte nur deine
   Aufgaben und nicht irgendwas anderes was du hinein interpretierst … kümmere Dich jetzt mal bitte intensiv um das
   alles“. Früher (ANLEITUNG.md, 03.10.): „perfekter Löwe … perfekter Wolf … fast fotorealistisch … Muskeln,
   Sehnen, Pupillen, Krallen … Licht und Schatten realistisch plastisch massiv“.

   FASSUNG 880 — Warum: Kritiken R1–R5 (Licht im Mittel 3,8): „Rumpfmitte flach, Airbrush-Flecken“, „aufgeklebte
   Kissen“ (T.volumen schattierte jeden Teil an seinem eigenen Rand → Nähte), „Umriss wie Aufkleber“.
   Jetzt: EIN Körperumriss (T.silhouette) aus Skelett + Weichteilprofil, Glieder als Strang entlang der Gelenkkette
   (T.glied), Licht QUER zu den Achsen mit Glanzkante, Terminator bei 60–65 %, Kernschatten und Reflexlicht
   (T.licht) – als gestaffelte Bänder entlang der Körperachsen, OHNE Weichzeichner-Filter (Leistung).
   Licht von links oben. Alle Koordinaten in cm, Blick nach rechts, Boden y = 0.
   ===================================================================== */
"use strict";
const RAD = Math.PI / 180;

/* ---------- Geometrie-Helfer (auch für fell880/fuss880/kopf880) ---------- */
const G10 = (v) => Math.round(v * 10);                       // Zehntel-cm als ganze Zahl
const zs = (n) => { const s = String(n / 10); return s.replace(/^(-?)0\./, "$1."); };
/* glatte Kurve (Catmull-Rom) durch pts, RELATIV in 0,1 cm ohne Fehlerfortpflanzung; [x, y, 1] = harte Ecke */
function glatt(pts, zu = true, sp = 1) {
  const n = pts.length;
  if (n < 2) return "";
  const P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let cx = G10(pts[0][0]), cy = G10(pts[0][1]), d = `M${zs(cx)} ${zs(cy)}`;
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6 * sp, p1[1] + (p2[1] - p0[1]) / 6 * sp];
    const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6 * sp, p2[1] - (p3[1] - p1[1]) / 6 * sp];
    const ex = G10(p2[0]), ey = G10(p2[1]);
    d += `c${zs(G10(c1[0]) - cx)} ${zs(G10(c1[1]) - cy)} ${zs(G10(c2[0]) - cx)} ${zs(G10(c2[1]) - cy)} ${zs(ex - cx)} ${zs(ey - cy)}`;
    cx = ex; cy = ey;
  }
  return (d + (zu ? "z" : "")).replace(/ -/g, "-");
}
/* gerade Vieleck-Linie (für kleine Bänder): relativ, 0,1 cm */
function eckig(pts, zu = true) {
  let cx = G10(pts[0][0]), cy = G10(pts[0][1]), d = `M${zs(cx)} ${zs(cy)}`;
  for (let i = 1; i < pts.length; i++) { const x = G10(pts[i][0]), y = G10(pts[i][1]); d += `l${zs(x - cx)} ${zs(y - cy)}`; cx = x; cy = y; }
  return (d + (zu ? "z" : "")).replace(/ -/g, "-");
}
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const abst = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const norm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
function inPoly(x, y, p) {
  let ja = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ja = !ja;
  }
  return ja;
}
const box = (pts) => { let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity; for (const p of pts) { if (p[0] < a) a = p[0]; if (p[1] < b) b = p[1]; if (p[0] > c) c = p[0]; if (p[1] > d) d = p[1]; } return [a, b, c, d]; };
const flaeche = (p) => { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; } return a / 2; };
/* Polylinie nach Bogenlänge abtasten: n Punkte (inkl. Enden) */
function abtasten(pl, n) {
  const L = [0];
  for (let i = 1; i < pl.length; i++) L.push(L[i - 1] + abst(pl[i - 1], pl[i]));
  const tot = L[L.length - 1] || 1, out = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const s = tot * k / (n - 1);
    while (j < pl.length - 2 && L[j + 1] < s) j++;
    const t = (s - L[j]) / ((L[j + 1] - L[j]) || 1);
    out.push(lerp(pl[j], pl[j + 1], Math.max(0, Math.min(1, t))));
  }
  return out;
}
/* Catmull-Rom als Polylinie (zum Abtasten glatter Kurven), m Zwischenpunkte je Abschnitt */
function crPunkte(pts, m = 6, zu = false) {
  const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]), out = [];
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    for (let k = 0; k < m; k++) {
      const t = k / m, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  if (!zu) out.push(pts[n - 1].slice(0, 2));
  return out;
}
/* Farben */
const hex = (c) => { c = c.length === 4 ? "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3] : c; return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); };
const mischFarbe = (a, b, t) => { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, "0")).join(""); };
const op2 = (v) => String(Math.round(Math.max(0, Math.min(1, v)) * 100) / 100).replace(/^0\./, ".");

/* LICHT: Richtung ZUM Licht in Bildkoordinaten (links oben), y nach unten positiv */
const LICHT = norm(-0.55, -0.83);

/* =====================================================================
   W2 — T.glied(kette, breiten, o)
   Strang entlang der Gelenkkette: breiten[i] = [a, b] (halbe Breite links / rechts der Laufrichtung; bei einem
   nach unten laufenden Bein a = hinten, b = vorn). Zwischen den Gelenken weich (Catmull-Rom), kein eigener Umriss.
   o: { fuss: [[x, y(, 1)], …] Fußumriss von vorn-oben über die Sohle nach hinten-oben (fuss880),
        extraA / extraB: [[nachIndex, [x, y]], …] (Fersenhöcker, Karpalballen, Ellbogenhöcker …),
        fern: true → Füllung 20–25 % dunkler/kühler + Schlagschatten des Rumpfes oben (o.schatten = [y0, y1]),
        farbe (Füllung), ohneOben: true → keine Kappe oben (Glied wächst aus dem Körper) }
   Liefert { umriss, a, b, mitte, radius, d, svg? } — svg nur, wenn o.farbe gesetzt ist.
   ===================================================================== */
function gliedGeo(kette, breiten, o = {}) {
  const n = kette.length, a = [], b = [], rad = [];
  for (let i = 0; i < n; i++) {
    const p = kette[Math.max(0, i - 1)], q = kette[Math.min(n - 1, i + 1)];
    const [dx, dy] = norm(q[0] - p[0], q[1] - p[1]);
    const nx = -dy, ny = dx, [wa, wb] = breiten[i];
    a.push([kette[i][0] + nx * wa, kette[i][1] + ny * wa]);
    b.push([kette[i][0] - nx * wb, kette[i][1] - ny * wb]);
    rad.push((wa + wb) / 2);
  }
  const A = a.slice(), B = b.slice();
  /* ersetzeA: Punkt der Rückseite an Index k ersetzen (Fersenhöcker statt Gelenkkante – sonst Doppelzacke) */
  for (const [k, p] of (o.ersetzeA || [])) A[k] = p;
  for (const [k, p] of (o.extraA || []).slice().sort((u, v) => v[0] - u[0])) A.splice(k + 1, 0, p);
  for (const [k, p] of (o.extraB || []).slice().sort((u, v) => v[0] - u[0])) B.splice(k + 1, 0, p);
  /* Umriss: b oben → unten, Fuß (vorn → hinten), a unten → oben */
  const umriss = B.concat(o.fuss || [], A.slice().reverse());
  return { umriss, a: A, b: B, aRoh: a, bRoh: b, mitte: kette, radius: rad };
}

/* Beinkette aus dem Skelett: nahe/ferne Beine mit Zwischenpunkten (Muskelbauch oben, Mittelhand-Mitte) und Breiten (cm) */
function beinKette(sk, wo, o = {}) {
  const bein = sk.beine[wo], vorn = wo[0] === "v", W = sk.W, p = bein.p, g = bein.breiten || {};
  const mal = (w) => [w[0] * W, w[1] * W];
  let kette, breiten, extraA = [], ersetzeA = [];
  /* Rahmen des Glieds an Index i: n = zur Rückseite (A), d = abwärts entlang der Kette. Karpalballen und Fersenhöcker
     werden IM RAHMEN des Glieds gesetzt (sonst stehen sie bei schräg gestellten fernen Beinen als Zacke heraus). */
  const rahmen = (i) => { const pp = kette[Math.max(0, i - 1)], q = kette[Math.min(kette.length - 1, i + 1)], [dx, dy] = norm(q[0] - pp[0], q[1] - pp[1]); return { n: [-dy, dx], d: [dx, dy] }; };
  if (vorn) {
    const U = lerp(p.ellbogen, p.handwurzel, 0.3), M = lerp(p.handwurzel, p.fessel, 0.5);
    kette = [p.ellbogen, U, p.handwurzel, M, p.fessel];
    breiten = [g.ellbogen, g.unterarmBauch, g.handwurzel, g.mittelhand, g.fessel].map(mal);
    if (o.oben) { kette.unshift(p.schulter); breiten.unshift([0.09 * W, 0.08 * W]); }
    /* Karpalballen: kleiner Höcker hinten knapp unter der Vorderfußwurzel */
    const i = kette.indexOf(p.handwurzel), { n, d } = rahmen(i), wa = breiten[i][0], h = p.handwurzel;
    extraA.push([i, [h[0] + n[0] * wa * 1.12 + d[0] * wa * 0.9, h[1] + n[1] * wa * 1.12 + d[1] * wa * 0.9]]);
  } else {
    const Wd = lerp(p.knie, p.sprung, 0.3), M = lerp(p.sprung, p.fessel, 0.5);
    kette = [p.knie, Wd, p.sprung, M, p.fessel];
    breiten = [g.knie, g.wade, g.ferse, g.mittelfuss, g.fessel].map(mal);
    if (o.oben) { kette.unshift(p.huefte); breiten.unshift([0.12 * W, 0.1 * W]); }
    /* Fersenhöcker ersetzt die hintere Gelenkkante am Sprunggelenk (Achillessehne läuft gerade darauf zu) */
    const i = kette.indexOf(p.sprung), { n, d } = rahmen(i), wa = breiten[i][0], s = p.sprung;
    ersetzeA.push([i, [s[0] + n[0] * wa * 1.3 - d[0] * wa * 0.3, s[1] + n[1] * wa * 1.3 - d[1] * wa * 0.3]]);
  }
  return { kette, breiten, extraA, ersetzeA, bein };
}

/* =====================================================================
   W3 — T.silhouette(sk, profil)
   EIN geschlossener Umriss im Uhrzeigersinn: Schwanzansatz → Kruppe → Rücken → Widerrist → Nacken → (Kopf) →
   Kehle → Vorbrust → nahes Vorderbein (vorn ab, Fuß, hinten auf) → Achsel → Brust → Bauch → Flanke → Kniefalte →
   nahes Hinterbein (vorn ab, Fuß, hinten auf: Fersenhöcker, Achillessehne, Wade) → Hose → Sitzbein → Schwanzansatz.
   profil (cm oder × W, siehe unten): { fell: { ruecken, nacken, brust, bauch, hose } (Fellzugabe in W),
     vorbrust, hose, kehle, nackenKamm (W), fussVorn / fussHinten ({ pts, … } aus T.pfote/T.huf …), kopf (T.kopf) }
   Liefert { pts, d, id, clip (url), achsen: [...], kanten: { name: [pts] }, zonen: { name: polygon }, sk }
   ===================================================================== */
function silhouette(T, sk, profil = {}) {
  const W = sk.W, lm = sk.lm, f = Object.assign({ ruecken: 0.012, nacken: 0.02, brust: 0.015, bauch: 0.01, hose: 0.02 }, profil.fell || {});
  const w = (v) => v * W;
  /* --- Oberlinie: Rücken (aus dem Skelett) + Fellzugabe --- */
  const ru = sk.ruecken.map((p, i) => [p[0], p[1] - w(f.ruecken) * (i ? 1 : 0.4)]);
  /* Hals aus seinen zwei Linien (nicht aus Mittellinie + Dicke, sonst rutscht die Kehle vor die Schulter):
     Nacken = Widerrist → Genick (Hinterhaupt), Kehle = Kehlpunkt unter dem Kiefer → Vorbrust vor dem Buggelenk.
     profil.nackenKamm (W) hebt den Nacken in der Mitte (Mähne/Halskrause), profil.kehle (W) wölbt die Kehle nach außen. */
  const kopf = profil.kopf, hk = sk.hals.kette;
  const bs0 = sk.beine.vn.extra.bugspitze, vb0 = w(profil.vorbrust != null ? profil.vorbrust : 0.035);
  const vbTop = [bs0[0] + vb0 * 0.7, bs0[1] - w(0.05)];
  const wrF = [ru[ru.length - 1][0], ru[ru.length - 1][1]];
  const poll = kopf ? kopf.nackenPunkt : [hk[2][0], hk[2][1] - sk.hals.dickeE * 0.5];
  const kehlP = kopf ? kopf.kehlPunkt : [hk[2][0] + w(0.02), hk[2][1] + sk.hals.dickeE * 0.5];
  const aussen = (a, b, t, d, seite) => { const p = lerp(a, b, t), [ux, uy] = norm(b[0] - a[0], b[1] - a[1]); return [p[0] + uy * d * seite, p[1] - ux * d * seite]; };
  const nk = w(f.nacken), km = w(profil.nackenKamm || 0);
  const nacken = [wrF, aussen(wrF, poll, 0.33, nk + km * 0.8, 1), aussen(wrF, poll, 0.66, nk * 0.8 + km, 1), aussen(wrF, poll, 0.9, nk * 0.4, 1), poll];
  const kw = w(profil.kehle != null ? profil.kehle : 0.02);
  const kehle = [kehlP, aussen(kehlP, vbTop, 0.3, kw * 0.9 + w(0.01), 1), aussen(kehlP, vbTop, 0.62, kw, 1), vbTop];
  const hg = { a: kehle.slice().reverse(), b: nacken };
  /* --- nahe Beine --- */
  const vK = beinKette(sk, "vn"), hK = beinKette(sk, "hn");
  const fv = profil.fussVorn || null, fh = profil.fussHinten || null;
  const vG = gliedGeo(vK.kette, vK.breiten, { extraA: vK.extraA, ersetzeA: vK.ersetzeA, fuss: fv ? fv.pts : [] });
  const hG = gliedGeo(hK.kette, hK.breiten, { extraA: hK.extraA, ersetzeA: hK.ersetzeA, fuss: fh ? fh.pts : [] });
  const vn = sk.beine.vn, hn = sk.beine.hn;
  /* --- Weichteile vorn: Vorbrust vor der Bugspitze, Übergang zum Unterarm --- */
  const bs = vn.extra.bugspitze, vb = w(profil.vorbrust != null ? profil.vorbrust : 0.035);
  const vorbrust = [vbTop, [bs[0] + vb, bs[1] + w(0.03)], [bs[0] + vb * 0.6, bs[1] + w(0.1)],
    [lerp(bs, vG.b[0], 0.75)[0] + w(0.006), lerp(bs, vG.b[0], 0.75)[1] - w(0.01)]];
  /* --- Unterlinie: Achsel → Brust → Bauch → Flanke → Kniefalte --- */
  const eh = vn.extra.ellbogenhoecker, bt = lm.brustTief, fl = lm.flanke, kn = hn.p.knie, ks = hn.extra.kniescheibe;
  const bauchMitte = lerp(bt, fl, 0.5);
  const unten = [[eh[0] - w(0.01), eh[1] - w(0.025)], [bt[0], bt[1] + w(f.brust)], [lerp(bt, bauchMitte, 0.5)[0], lerp(bt, bauchMitte, 0.5)[1] + w(f.bauch) - w(0.005)],
    [bauchMitte[0], bauchMitte[1] + w(f.bauch)], [fl[0] + w(0.04), fl[1] + w(f.bauch) * 0.6], [fl[0], fl[1] + w(0.005)],
    /* Kniefalte: Hautfalte von der Flanke zur Kniescheibe */
    [ks[0] + w(0.035), ks[1] - w(0.07)]];
  /* --- hinten: Hose (Sitzbeinmuskeln) von der Wade zum Sitzbeinhöcker, dann gerundetes Gesäß bis unter den Schwanzansatz --- */
  const sb = lm.sitzbein, ho = w(profil.hose != null ? profil.hose : 0.05), sa = lm.schwanzansatz;
  const wadeA = hG.aRoh[1];                                   // Wade hinten
  const hose = [[wadeA[0] - w(0.012), wadeA[1] - w(0.05)], [lerp(wadeA, sb, 0.45)[0] - ho * 0.75 - w(f.hose), lerp(wadeA, sb, 0.45)[1]],
    [sb[0] - ho - w(f.hose), sb[1] + w(0.05)], [sb[0] - ho * 0.85 - w(f.hose) * 0.8, sb[1] - w(0.02)],
    [sb[0] - ho * 0.5 - w(f.hose) * 0.5, sb[1] - w(0.085)]];
  /* Gesäß rund in die schräge Kruppe: ein weiter Bogen (Radius ≈ 0,12 W) vom Gesäß über den Schwanzansatz zur Kruppe –
     vorher saß die Biegung auf 3 cm (Sonde: „Kastenecke an der Kruppe“). Der Schwanz wächst aus diesem Bogen. */
  const kr0 = ru[2], h4 = hose[4];
  const kruppBogen = [[h4[0] + w(0.006), sa[1] + w(0.062)], [sa[0] - w(0.028), sa[1] + w(0.012)],
    [Math.max(sa[0], kr0[0]) + w(0.02), kr0[1] + w(0.016)], [kr0[0] + w(0.07), kr0[1] + w(0.001)]];
  for (const p of kruppBogen) hose.push(p);
  /* --- zusammensetzen (Uhrzeigersinn) --- */
  const pts = [];
  const add = (arr) => { for (const p of arr) pts.push(p); };
  add(ru.slice(3));                                            // Rücken → Widerrist (Gesäß, Schwanzansatz und Kruppe stehen am Ende von hose)
  add(nacken.slice(1));                                        // Nacken bis Hinterkopf
  if (kopf) add(kopf.umrissSil);                               // Kopf: Hinterhaupt → Stirn → Nase → Kinn → Kehle
  add(kopf ? kehle.slice(1, -1) : kehle.slice(0, -1));          // Kehle → (Vorbrust folgt)
  add(vorbrust);
  /* nahes Vorderbein: b ab Unterarm (Index 1), Fuß, a hinauf ohne obersten Punkt; Ellbogenhöcker */
  add(vG.b.slice(1)); add(fv ? fv.pts : []); add(vG.a.slice(1).reverse());
  add([[eh[0] + w(0.005), eh[1] + w(0.01)]]);
  add(unten);
  /* nahes Hinterbein: b ab Kniescheibe */
  add([[ks[0] + w(0.01), ks[1] - w(0.01)]]);
  add(hG.b.slice(1)); add(fh ? fh.pts : []);
  add(hG.a.slice(1).reverse());                                // hinten: Fessel, Mittelfuß, Fersenhöcker, Achillessehne, Wade
  add(hose);
  /* Flächen- und Kantenbuch für Fell/Licht */
  const d = glatt(pts);
  const id = T.id("sil" + (T._sil = (T._sil || 0) + 1));
  T.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
  /* --- Achsen für Licht und Fell --- */
  /* Rumpf+Hals als EIN gebogener Strang, der am Gesäß spitz beginnt (keine Schnittkante): Oberseite = Gesäß hinauf,
     Rücken, Nacken; Unterseite = Hose hinab, Kniefalte, Bauch, Brust, Vorbrust, Kehle */
  const kopfOben = kopf ? kopf.profilOben.slice(1) : [], kopfUnten = kopf ? kopf.profilUnten.slice(0, -1).reverse() : [];
  const oben = hose.slice(2).concat(ru.slice(3), nacken.slice(1), kopfOben);
  const unterlinie = [hose[2], hose[1], hose[0], [kn[0] - w(0.02), kn[1] - w(0.08)], [ks[0] + w(0.035), ks[1] - w(0.07)], [fl[0], fl[1] + w(0.005)],
    [bauchMitte[0], bauchMitte[1] + w(f.bauch)], [bt[0], bt[1] + w(f.brust)], [eh[0] - w(0.01), eh[1] - w(0.025)],
    vorbrust[3], vorbrust[2], vorbrust[1], vorbrust[0]].concat(kehle.slice(0, -1).reverse(), kopfUnten);
  const N = (T.fein === false ? 10 : 15) + (kopf ? (T.fein === false ? 3 : 6) : 0);
  /* Anker: Kruppe ↔ Kniefalte, Widerrist ↔ Brust hinter dem Ellbogen, Hinterhaupt ↔ Kehle */
  const iKr = hose.length - 3, iWr = iKr + 1 + ru.length - 4, iPoll = iWr + nacken.length - 1, iKehle = 9 + 4 + kehle.length - 1 - 1;
  const anker = [[0, 0], [iKr, 4], [iWr, 8]];
  if (kopf) anker.push([iPoll, iKehle]);
  anker.push([oben.length - 1, unterlinie.length - 1]);
  const rumpf = strangAusLinien(oben, unterlinie, anker, N);
  rumpf.name = "rumpf"; rumpf.art = "rumpf";
  /* Unterseite des Rumpfstrangs reicht in die Läufe hinein und wird dort weich ausgeblendet (keine harte Kante quer über
     Oberarm und Keule; der Schatten unter dem Rumpf läuft als Okklusion auf die Läufe aus) */
  rumpf.rausB = 0.3;
  rumpf.unterkante = Math.max(bt[1] + w(f.brust), bauchMitte[1] + w(f.bauch));
  const achsen = [rumpf];
  const bA = (g, name) => { const s = { name, art: "glied", A: g.aRoh, B: g.bRoh }; achsen.push(s); return s; };
  bA(vG, "vn"); bA(hG, "hn");
  /* Kopfachse nur für Fell/Muster – das Licht des Kopfes kommt aus dem durchgehenden Rumpfstrang */
  if (kopf && kopf.achse) achsen.push(Object.assign({ name: "kopf", art: "kopf", ohneLicht: true }, kopf.achse));
  const kanten = { ruecken: kruppBogen.slice(2).concat(ru.slice(3)), nacken, kehle: kehle, vorbrust, unten, hose, vnVorn: vG.b, vnHinten: vG.a, hnVorn: hG.b, hnHinten: hG.a };
  return { pts, d, id, clip: `url(#${id}c)`, achsen, kanten, sk, beine: { vn: vG, hn: hG }, hals: hg, kopf, W, punkte: { rumpfEcke: kruppBogen[1], vorbrustOben: vbTop, kehle: kehlP } };
}

/* Strang aus zwei Linien mit Ankerpaaren [[iOben, iUnten], …] (Indizes in den Linien), N Querschnitte */
function strangAusLinien(oben, unten, anker, N) {
  const O = crPunkte(oben, 6), U = crPunkte(unten, 6);
  const mapI = (i, n0, n1) => Math.round(i * (n1 - 1) / Math.max(1, n0 - 1));
  const ank = anker.map(([a, b]) => [Math.min(O.length - 1, a * 6), Math.min(U.length - 1, b * 6)]);
  const A = [], B = [];
  for (let k = 0; k < ank.length - 1; k++) {
    const [o0, u0] = ank[k], [o1, u1] = ank[k + 1];
    const teilO = abtasten(O.slice(o0, o1 + 1), 64), teilU = abtasten(U.slice(u0, u1 + 1), 64);
    const m = Math.max(3, Math.round(N * (o1 - o0) / Math.max(1, O.length - 1)));
    for (let j = 0; j < m; j++) {
      if (k > 0 && j === 0) continue;
      const t = j / (m - 1), idx = Math.round(t * 63);
      A.push(teilO[idx]); B.push(teilU[idx]);
    }
  }
  void mapI;
  return { A, B };
}

/* =====================================================================
   W4 — T.licht(sil, o)
   Schattierung QUER zu jeder Achse (Rumpf entlang der Wirbelsäule, Glieder entlang der Kette): Glanzkante, Licht,
   Halbton, Terminator bei 60–65 %, Kernschatten, Reflexlicht – als gestaffelte Bänder (Höhenlinien des Lichtprofils,
   jede Stufe mit passender Deckkraft, damit die Summe genau dem Profil folgt). Ohne Filter.
   Dazu automatisch: Achsel, Leiste, unter Kinn/Ohrgrund (Okklusion), Schlagschatten des Rumpfes auf die fernen Beine
   (siehe T.glied o.fern), Muskellichter (Schulterblatt, Trizeps, Oberschenkel, Hüfthöcker) als weiche Formen.
   o: { staerke (1), dunkel ("#1a120a"), hell ("#fff4e0"), stufen (Dunkel-/Lichtstufen), terminator (0,62), muskeln (true),
        okklusion (true), nur: [Achsennamen] }
   Liefert { svg (in den Umriss geklippt), hell(x, y) → −1…+1, achsen, profil }
   ===================================================================== */
/* Querprofil (t = 0 Lichtseite … 1 Schattenseite): Glanzkante, Licht, Halbton, Terminator bei 60–65 %, Kernschatten,
   nur schwaches Reflexlicht (an inneren Grenzen wie Rumpf/Lauf darf kein heller Saum entstehen) */
const PROFIL = (term = 0.62) => [[0, 0.2], [0.03, 0.13], [0.2, 0.07], [term - 0.2, 0.0], [term - 0.05, -0.08], [term, -0.17],
  [term + 0.07, -0.28], [Math.min(0.9, term + 0.22), -0.34], [0.95, -0.31], [1, -0.27]];
const profilWert = (pr, t) => {
  if (t <= pr[0][0]) return pr[0][1];
  for (let i = 0; i < pr.length - 1; i++) if (t <= pr[i + 1][0]) { const u = (t - pr[i][0]) / ((pr[i + 1][0] - pr[i][0]) || 1); return pr[i][1] + (pr[i + 1][1] - pr[i][1]) * u; }
  return pr[pr.length - 1][1];
};
/* Bereich [t0, t1], in dem f(t) ≥ c (f unimodal), fein abgetastet */
function stufenBereich(f, c) {
  let t0 = null, t1 = null;
  for (let i = 0; i <= 200; i++) { const t = i / 200; if (f(t) >= c - 1e-9) { if (t0 === null) t0 = t; t1 = t; } }
  return t0 === null ? null : [t0, t1];
}
/* Band zwischen den Querlinien t0 und t1 einer Achse (A/B), nur zwischen s0 und s1 (Anteile der Länge) */
function bandPunkte(ax, t0, t1, s0 = 0, s1 = 1, flip = null) {
  const n = ax.A.length, i0 = Math.max(0, Math.floor(s0 * (n - 1))), i1 = Math.min(n - 1, Math.ceil(s1 * (n - 1)));
  const l1 = [], l2 = [];
  for (let i = i0; i <= i1; i++) {
    const fl = flip ? flip[i] : false, u0 = fl ? 1 - t0 : t0, u1 = fl ? 1 - t1 : t1;
    l1.push(lerp(ax.A[i], ax.B[i], u0)); l2.push(lerp(ax.A[i], ax.B[i], u1));
  }
  return { l1, l2 };
}
const bandPfad = (bp, fein) => {
  /* Kurve hin (t0), Kurve zurück (t1): zwei offene glatte Linien mit geraden Enden */
  const hin = fein ? crPunkte(bp.l1, 2) : bp.l1, her = fein ? crPunkte(bp.l2, 2).reverse() : bp.l2.slice().reverse();
  return eckig(hin.concat(her));
};
/* Lichtseite je Querschnitt: u = A→B; ist u·LICHT > 0, liegt B zum Licht (dann t von B aus zählen) */
function lichtSeiten(ax) {
  const n = ax.A.length, flip = [], kon = [];
  for (let i = 0; i < n; i++) {
    const [ux, uy] = norm(ax.B[i][0] - ax.A[i][0], ax.B[i][1] - ax.A[i][1]), c = ux * LICHT[0] + uy * LICHT[1];
    flip.push(c > 0); kon.push(0.55 + 0.45 * Math.abs(c));
  }
  /* glätten, damit die Lichtseite nicht flackert */
  const flipG = flip.map((_, i) => { let s = 0; for (let k = -2; k <= 2; k++) s += flip[Math.max(0, Math.min(n - 1, i + k))] ? 1 : -1; return s > 0; });
  return { flip: ax.flip || flipG, kon };
}
/* Verlauf mit Stopps aus einem Profil [[t, wert]] (wert > 0 → Licht, < 0 → Schatten): EIN Verlauf je Profil, Farbwechsel
   genau beim Nulldurchgang (dort Deckkraft 0), damit Licht und Schatten nicht grau ineinander laufen. */
function profilStopps(pr, st, hellF, dunkelF) {
  const pts = [];
  for (let i = 0; i < pr.length; i++) {
    pts.push(pr[i]);
    if (i < pr.length - 1 && pr[i][1] * pr[i + 1][1] < 0) { const t = pr[i][0] + (pr[i + 1][0] - pr[i][0]) * (pr[i][1] / (pr[i][1] - pr[i + 1][1])); pts.push([t, 0, pr[i][1] > 0 ? "h" : "d"]); }
  }
  let st0 = "";
  for (const [t, v, z] of pts) {
    const o = Math.round(Math.max(0, Math.min(1, t)) * 1000) / 1000;
    if (v === 0 && z) {
      st0 += `<stop offset="${o}" stop-color="${z === "h" ? hellF : dunkelF}" stop-opacity="0"/><stop offset="${o}" stop-color="${z === "h" ? dunkelF : hellF}" stop-opacity="0"/>`;
    } else st0 += `<stop offset="${o}" stop-color="${v >= 0 ? hellF : dunkelF}" stop-opacity="${op2(Math.abs(v) * st)}"/>`;
  }
  return st0;
}
/* Querverlauf: je Abschnitt (zwischen zwei Querschnitten) ein Viereck mit eigenem Verlaufsvektor (A → B bzw. Licht →
   Schatten), alle mit DERSELBEN Stoppliste (href). Glatt quer zur Achse, folgt jeder Biegung, kein Filter.
   o: { schritt (Querschnitte je Abschnitt), s0, s1, weichS (Ausblenden an den Enden, Anteil), flip (Array), rausA, rausB
        (Überstand über die Kanten, Anteil der Breite), op } */
function querVerlauf(T, ax, basisId, o = {}) {
  /* Je Abschnitt zwei Dreiecke mit linearem Verlauf, der an den drei Ecken genau den Querwert t trifft (A = 0, B = 1,
     Lichtseite = 0): stetig über alle Kanten wie ein Verlaufsgitter. shape-rendering crispEdges an der Gruppe → keine
     Haarfugen zwischen den Dreiecken (die Außenkante glättet der Umriss-Clip). */
  const n = ax.A.length, k = Math.max(1, o.schritt || 1);
  const s0 = o.s0 != null ? o.s0 : 0, s1 = o.s1 != null ? o.s1 : 1, ws = o.weichS || 0;
  const i0 = Math.max(0, Math.floor(s0 * (n - 1))), i1 = Math.min(n - 1, Math.ceil(s1 * (n - 1)));
  const rA = o.rausA != null ? o.rausA : 0.12, rB = o.rausB != null ? o.rausB : 0.12;
  const R = (v) => Math.round(v * 10) / 10;
  const idx = [];
  for (let i = i0; i < i1; i += k) idx.push(i);
  idx.push(i1);
  /* Ecken je Querschnitt (mit Überstand) und ihr t */
  const ts = o.tSkala || 1;
  const ecke = (i) => {
    const fl = o.flip ? o.flip[i] : false, tA = fl ? 1 : 0, tB = 1 - tA, A = ax.A[i], B = ax.B[i];
    return { A: [A[0] + (A[0] - B[0]) * rA, A[1] + (A[1] - B[1]) * rA, (tA + (tA - tB) * rA) * ts], B: [B[0] + (B[0] - A[0]) * rB, B[1] + (B[1] - A[1]) * rB, (tB + (tB - tA) * rB) * ts] };
  };
  let s = "", nr = 0;
  const praefix = basisId + (T._qv = (T._qv || 0) + 1).toString(36) + "_";
  const dreieck = (P, Q, S, op) => {
    /* t(x, y) = a x + b y + c durch drei Punkte */
    const det = P[0] * (Q[1] - S[1]) - P[1] * (Q[0] - S[0]) + (Q[0] * S[1] - S[0] * Q[1]);
    if (Math.abs(det) < 1e-6) return;
    const a = (P[2] * (Q[1] - S[1]) - P[1] * (Q[2] - S[2]) + (Q[2] * S[1] - S[2] * Q[1])) / det;
    const b = (P[0] * (Q[2] - S[2]) - P[2] * (Q[0] - S[0]) + (Q[0] * S[2] - S[0] * Q[2])) / det;
    const c = (P[0] * (Q[1] * S[2] - S[1] * Q[2]) - P[1] * (Q[0] * S[2] - S[0] * Q[2]) + P[2] * (Q[0] * S[1] - S[0] * Q[1])) / det;
    const g2 = a * a + b * b;
    if (g2 < 1e-9) return;
    /* fast entartete Splitter (Querwert springt auf < 0,3 cm) weglassen – sie sind winzig und würden nur flackern */
    if (Math.abs(det) < 0.08 || 1 / Math.sqrt(g2) < 0.3) return;
    /* Fußpunkt t = 0 nahe am Dreieck wählen (Schwerpunkt auf die t = 0-Linie projiziert): kleine Zahlen, und auf
       0,01 cm gerundet – 0,1 cm ergab bis 4 % Fehler je Dreieck (sichtbare „Sägezähne“) */
    const cx = (P[0] + Q[0] + S[0]) / 3, cy = (P[1] + Q[1] + S[1]) / 3, tc = a * cx + b * cy + c;
    const p1 = [cx - tc * a / g2, cy - tc * b / g2], p2 = [p1[0] + a / g2, p1[1] + b / g2];
    const id = praefix + (nr++).toString(36);
    const R2 = (v) => Math.round(v * 100) / 100;
    T.def(`<linearGradient id="${id}" href="#${basisId}" x1="${R2(p1[0])}" y1="${R2(p1[1])}" x2="${R2(p2[0])}" y2="${R2(p2[1])}"/>`);
    s += `<path d="${eckig([P, Q, S])}" fill="url(#${id})"${op < 0.995 ? ` fill-opacity="${op2(op)}"` : ""}/>`;
  };
  for (let m = 0; m < idx.length - 1; m++) {
    const i = idx[m], j = idx[m + 1];
    let op = o.op != null ? o.op : 1;
    if (ws > 0) {
      const sm = ((i + j) / 2) / (n - 1), e0 = Math.min(1, Math.max(0, (sm - s0) / (ws * (s1 - s0)))), e1 = Math.min(1, Math.max(0, (s1 - sm) / (ws * (s1 - s0))));
      const sm3 = (x) => x * x * (3 - 2 * x);
      op *= sm3(e0) * sm3(e1);
    }
    if (op < 0.02) continue;
    const E = ecke(i), F2 = ecke(j);
    /* Diagonale abwechselnd legen: die Knicke der Höhenlinien heben sich auf statt Sägezähne zu bilden */
    if (m % 2 === 0) { dreieck(E.A, E.B, F2.A, op); dreieck(E.B, F2.B, F2.A, op); }
    else { dreieck(E.A, E.B, F2.B, op); dreieck(E.A, F2.B, F2.A, op); }
  }
  return s ? `<g shape-rendering="crispEdges">${s}</g>` : "";
}
function lichtAchse(T, ax, o) {
  const n = ax.A.length, fein = T.fein !== false;
  const { flip, kon } = lichtSeiten(ax);
  const kMittel = kon.reduce((a, b) => a + b, 0) / n;
  const st = (o.staerke != null ? o.staerke : 1) * (ax.staerke != null ? ax.staerke : 1) * kMittel;
  const pr = ax.profil || PROFIL(ax.terminator || o.terminator || 0.62);
  /* Reicht der Strang über seine Schattenkante hinaus (rausB > 0,15, z. B. Rumpf in die Läufe), läuft das Profil dort
     bis auf 0 aus (Verlauf auf t ∈ [0, 1 + rausB] gestreckt) – sonst endet der Kernschatten mit harter Kante quer über
     Oberarm und Keule (Sonde 16: „Querkante am Ellbogen“). */
  const rB = ax.rausB != null ? ax.rausB : 0.12, skala = fein && rB > 0.15 ? 1 / (1 + rB) : 1;
  const prV = skala < 1 ? pr.map(([t, v]) => [t * skala, v]).concat([[1, 0]]) : pr;
  /* Stoppliste je (Profil, Stärke, Farben) nur EINMAL anlegen – Läufe, Rute, Rumpf teilen sie, wenn gleich */
  const stopps = profilStopps(prV, Math.round(st * 10) / 10, o.hell || "#fff4e0", o.dunkel || "#1a120a");
  T._lbCache = T._lbCache || new Map();
  let basis = T._lbCache.get(stopps);
  if (!basis) {
    basis = T.id("L" + (T._lb = (T._lb || 0) + 1) + "_");
    T.def(`<linearGradient id="${basis}" gradientUnits="userSpaceOnUse">${stopps}</linearGradient>`);
    T._lbCache.set(stopps, basis);
  }
  const schritt = fein ? (ax.schritt || 1) : Math.max(2, Math.round(n / 5));
  const svg = querVerlauf(T, ax, basis, { flip, schritt, rausA: ax.rausA, rausB: fein ? ax.rausB : Math.min(0.12, ax.rausB != null ? ax.rausB : 0.12), s0: ax.s0, s1: ax.s1, tSkala: skala });
  return { svg, flip, pr, st };
}
/* weiche Ellipse (Radialverlauf, kein Filter): Muskellicht, Okklusion */
function weichEllipse(T, x, y, rx, ry, dreh, farbe, op) {
  const g = T.rg("w880" + farbe.slice(1), [[0, farbe, 1], [0.45, farbe, 0.62], [0.8, farbe, 0.18], [1, farbe, 0]]);
  return `<ellipse cx="${(Math.round(x * 10) / 10)}" cy="${(Math.round(y * 10) / 10)}" rx="${Math.round(rx * 10) / 10}" ry="${Math.round(ry * 10) / 10}"` +
    (dreh ? ` transform="rotate(${Math.round(dreh)} ${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10})"` : "") + ` fill="${g}" opacity="${op2(op)}"/>`;
}
const winkelVon = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / RAD;
function licht(T, sil, o = {}) {
  const dunkelF = o.dunkel || "#1a120a", hellF = o.hell || "#fff4e0", fein = T.fein !== false;
  const achsen = (o.nur ? sil.achsen.filter((a) => o.nur.includes(a.name)) : sil.achsen).concat(o.extra || []);
  let dS = "", hS = "";
  const daten = [];
  for (const ax of achsen) {
    if (ax.ohneLicht) continue;
    const r = lichtAchse(T, ax, Object.assign({}, o, { hell: hellF, dunkel: dunkelF }));
    let dd = r.svg;
    /* Glieder: oben weich einblenden (der Lauf wächst aus dem Rumpf) – Maske nur im Großbild */
    if (ax.art === "glied" && fein && ax.blende !== false && dd) {
      /* Einblendung beginnt erst UNTER der tiefsten Ecke der Oberkante (die Querkante am Knie/Ellbogen liegt schräg –
         sonst bleibt ihr unteres Ende sichtbar als harte Linie) */
      const A0 = ax.A[0], B0 = ax.B[0], bot = ax.A[ax.A.length - 1], mid = T.id("lm" + ax.name), b = box(ax.A.concat(ax.B));
      const L = abst(A0, bot), u = norm(bot[0] - A0[0], bot[1] - A0[1]), rb = ax.rausB != null ? ax.rausB : 0.12, ra = ax.rausA != null ? ax.rausA : 0.12;
      const eck = [[A0[0] + (A0[0] - B0[0]) * ra, A0[1] + (A0[1] - B0[1]) * ra], [B0[0] + (B0[0] - A0[0]) * rb, B0[1] + (B0[1] - A0[1]) * rb]];
      const tief = Math.max(...eck.map((p) => (p[0] - A0[0]) * u[0] + (p[1] - A0[1]) * u[1]));
      const top = [A0[0] + u[0] * tief, A0[1] + u[1] * tief], e = [top[0] + u[0] * L * 0.2, top[1] + u[1] * L * 0.2];
      const re = `x="${Math.floor(b[0] - 5)}" y="${Math.floor(b[1] - 5)}" width="${Math.ceil(b[2] - b[0] + 10)}" height="${Math.ceil(b[3] - b[1] + 10)}"`;
      T.def(`<mask id="${mid}" maskUnits="userSpaceOnUse" ${re}><rect ${re} fill="${T.lg("lmg" + ax.name, [[0, "#fff", 0], [1, "#fff", 1]], Math.round(top[0] * 10) / 10, Math.round(top[1] * 10) / 10, Math.round(e[0] * 10) / 10, Math.round(e[1] * 10) / 10, ' gradientUnits="userSpaceOnUse"')}"/></mask>`);
      dd = `<g mask="url(#${mid})">${dd}</g>`;
    }
    dS += dd;
    daten.push(Object.assign({ ax }, r));
  }
  let s = dS;
  /* Okklusion und Muskellichter aus den Landmarken */
  const sk = sil.sk, W = sil.W, lm = sk ? sk.lm : null;
  if (sk && o.okklusion !== false) {
    const vn = sk.beine.vn, hn = sk.beine.hn, eh = vn.extra.ellbogenhoecker, ks = hn.extra.kniescheibe;
    s += weichEllipse(T, eh[0] - W * 0.03, eh[1] - W * 0.015, W * 0.09, W * 0.04, -8, dunkelF, 0.42);          // Achsel
    s += weichEllipse(T, ks[0] + W * 0.025, ks[1] - W * 0.06, W * 0.07, W * 0.035, -60, dunkelF, 0.36);        // Leiste/Kniefalte
    if (sil.kopf && sil.kopf.kehlPunkt) { const kp = sil.kopf.kehlPunkt; s += weichEllipse(T, kp[0], kp[1], W * 0.08, W * 0.04, -25, dunkelF, 0.38); }
    /* Okklusion unter der Brust auf dem Unterarm, unter dem Bauch auf der Wade */
    const ub = vn.p.ellbogen; s += weichEllipse(T, ub[0] + W * 0.01, ub[1] + W * 0.01, W * 0.06, W * 0.05, 0, dunkelF, 0.3);
  }
  if (sk && o.muskeln !== false && fein) {
    const vn = sk.beine.vn.p, hn = sk.beine.hn.p;
    const sbM = lerp(vn.schulterblatt, vn.schulter, 0.42), wsb = winkelVon(vn.schulterblatt, vn.schulter);
    s += weichEllipse(T, sbM[0] - W * 0.01, sbM[1], W * 0.13, W * 0.055, wsb, hellF, 0.17);                    // Schulterblatt
    const hinterSb = lerp(vn.schulterblatt, vn.schulter, 0.5);
    s += weichEllipse(T, hinterSb[0] - W * 0.07, hinterSb[1] + W * 0.02, W * 0.11, W * 0.022, wsb, dunkelF, 0.16); // Schulterblatt-Hinterkante
    const tz = lerp(vn.schulter, vn.ellbogen, 0.55);
    s += weichEllipse(T, tz[0] - W * 0.06, tz[1] - W * 0.015, W * 0.075, W * 0.05, -20, hellF, 0.12);           // Trizeps
    s += weichEllipse(T, tz[0] - W * 0.05, tz[1] + W * 0.05, W * 0.07, W * 0.025, -15, dunkelF, 0.14);          // Trizeps-Unterkante
    const os = lerp(hn.huefte, hn.knie, 0.45), wos = winkelVon(hn.huefte, hn.knie);
    s += weichEllipse(T, os[0] + W * 0.01, os[1] - W * 0.02, W * 0.15, W * 0.075, wos, hellF, 0.14);            // Oberschenkel
    s += weichEllipse(T, os[0] - W * 0.075, os[1] + W * 0.03, W * 0.13, W * 0.025, wos + 8, dunkelF, 0.14);     // Rinne Oberschenkel/Sitzbeinmuskeln
    const hh = lm.hueftHoecker; s += weichEllipse(T, hh[0], hh[1] - W * 0.01, W * 0.05, W * 0.035, -20, hellF, 0.16); // Hüfthöcker
    /* Rippenbogen: weicher Schatten hinter der letzten Rippe (Hungergrube) */
    const fl = lm.flanke; s += weichEllipse(T, fl[0] + W * 0.1, fl[1] - W * 0.12, W * 0.05, W * 0.1, 10, dunkelF, 0.1);
  }
  const svg = sil.clip ? `<g clip-path="${sil.clip}">${s}</g>` : s;
  /* hell(x, y): Lichtwert an einem Punkt (für Fellfarben): Querschnitt suchen, t bestimmen, Profil lesen */
  const hellAn = (x, y) => {
    for (const r of daten) {
      const ax = r.ax, n = ax.A.length;
      for (let i = 0; i < n - 1; i++) {
        const q = [ax.A[i], ax.A[i + 1], ax.B[i + 1], ax.B[i]];
        if (!inPoly(x, y, q)) continue;
        const A = lerp(ax.A[i], ax.A[i + 1], 0.5), B = lerp(ax.B[i], ax.B[i + 1], 0.5);
        const ux = B[0] - A[0], uy = B[1] - A[1], L2 = ux * ux + uy * uy || 1;
        let t = ((x - A[0]) * ux + (y - A[1]) * uy) / L2;
        if (r.flip[i]) t = 1 - t;
        return profilWert(r.pr, Math.max(0, Math.min(1, t))) / 0.34;
      }
    }
    return 0;
  };
  return { svg, hell: hellAn, daten };
}

/* =====================================================================
   MUSTER entlang einer Achse (Sattel, Bauchseite, Maske …): T.muster(achse, o)
   o: { t0, t1 (quer, 0 = Lichtseite/Achse A), s0, s1 (längs), farbe, op, weich (Anteil Randbreite, 0,25),
        stufen (3) }  → weiche Kanten durch geschachtelte Bänder (außen schwach, innen voll), kein Filter.
   ===================================================================== */
function muster(T, ax, o = {}) {
  /* Sparvarianten (ein Pfad + ein geteilter Verlauf, keine Dreiecke, keine Maske):
     art "fleck": weicher Fleck – Zonenvieleck mit Radialverlauf (rundum weich), z. B. helle Kehle, Bauchfleck;
     art "laengs": Zone mit Verlauf längs der Achse (oben weich eingeblendet), z. B. Lauffarbe, die aus dem Rumpf wächst. */
  if (o.art === "fleck" || o.art === "laengs") {
    const t0 = o.t0 != null ? o.t0 : 0, t1 = o.t1 != null ? o.t1 : 1, s0 = o.s0 != null ? o.s0 : 0, s1 = o.s1 != null ? o.s1 : 1;
    const b = bandPunkte(ax, t0, t1, s0, s1), poly = b.l1.concat(b.l2.slice().reverse()), farbe = o.farbe || "#000", op = o.op != null ? o.op : 1;
    let g;
    if (o.art === "fleck") {
      /* weicher Fleck als gedrehte Ellipse über der Zone (Sehne von s0 nach s1, Höhe = Zonenbreite): rundum weich – ein
         Vieleck mit Radialverlauf hatte an gebogenen Zonen harte Kanten (Sonde 17: „Bauchband mit Oberkante“) */
      g = T.rg("mf" + farbe.slice(1) + Math.round(op * 100), [[0, farbe, op], [0.5, farbe, op * 0.8], [1, farbe, 0]]);
      const mitte = b.l1.map((p, i) => lerp(p, b.l2[i], 0.5)), m0 = mitte[0], m1 = mitte[mitte.length - 1];
      const c = mitte.reduce((a, p) => [a[0] + p[0] / mitte.length, a[1] + p[1] / mitte.length], [0, 0]);
      const breite = b.l1.reduce((a, p, i) => a + abst(p, b.l2[i]), 0) / b.l1.length;
      const R = (v) => Math.round(v * 10) / 10, dreh = Math.round(Math.atan2(m1[1] - m0[1], m1[0] - m0[0]) / RAD);
      return `<ellipse cx="${R(c[0])}" cy="${R(c[1])}" rx="${R(abst(m0, m1) * 0.58)}" ry="${R(breite * 0.62)}"${dreh ? ` transform="rotate(${dreh} ${R(c[0])} ${R(c[1])})"` : ""} fill="${g}"/>`;
    } else {
      const n = ax.A.length, i0 = Math.round(s0 * (n - 1)), i1 = Math.round(s1 * (n - 1));
      const P0 = lerp(ax.A[i0], ax.B[i0], 0.5), P1 = lerp(ax.A[i1], ax.B[i1], 0.5), R = (v) => Math.round(v * 10) / 10;
      const ws = o.weichS != null ? o.weichS : 0.25;
      g = T.lg("ml" + (T._ml = (T._ml || 0) + 1), [[0, farbe, 0], [ws, farbe, op], [1, farbe, op]], R(P0[0]), R(P0[1]), R(P1[0]), R(P1[1]), ' gradientUnits="userSpaceOnUse"');
    }
    return `<path d="${T.fein === false ? eckig(poly) : glatt(poly)}" fill="${g}"/>`;
  }
  /* Querprofil der Zone: weich ein (t0 − w … t0 + w), voll, weich aus (t1 − w … t1 + w); offenA/offenB = bis zur Kante */
  const t0 = o.t0 != null ? o.t0 : 0, t1 = o.t1 != null ? o.t1 : 1, w = (t1 - t0) * (o.weich != null ? o.weich : 0.25) * 0.5;
  const op = o.op != null ? o.op : 1, farbe = o.farbe || "#000";
  const st = [];
  const add = (t, a) => st.push(`<stop offset="${Math.round(Math.max(0, Math.min(1, t)) * 1000) / 1000}" stop-color="${farbe}" stop-opacity="${op2(a)}"/>`);
  if (o.offenA || t0 <= 0) add(0, op); else { add(Math.max(0, t0 - w), 0); add(t0 + w * 0.6, op * 0.75); add(t0 + w, op); }
  if (o.offenB || t1 >= 1) add(1, op); else { add(t1 - w, op); add(t1 - w * 0.6, op * 0.75); add(Math.min(1, t1 + w), 0); }
  const n = ax.A.length;
  if (T.fein === false) {
    /* Szene: eine flache, halbtransparente Fläche (kein Verlauf, keine Maske) – klein sieht man nur den Farbfleck */
    const tt0 = o.offenA || t0 <= 0 ? -0.15 : t0 + w * 0.3, tt1 = o.offenB || t1 >= 1 ? 1.15 : t1 - w * 0.3;
    const S0s = (o.s0 != null ? o.s0 : 0), S1s = (o.s1 != null ? o.s1 : 1);
    const b = bandPunkte(ax, tt0, tt1, S0s, S1s);
    return `<path d="${eckig(b.l1.concat(b.l2.slice().reverse()))}" fill="${farbe}" fill-opacity="${op2(op * 0.85)}"/>`;
  }
  const basis = T.id("M" + (T._mb = (T._mb || 0) + 1) + "_");
  T.def(`<linearGradient id="${basis}" gradientUnits="userSpaceOnUse">${st.join("")}</linearGradient>`);
  const schritt = o.schritt || (n >= 10 ? 2 : 1);
  const ws = o.weichS != null ? o.weichS : 0.25, S0 = o.s0 != null ? o.s0 : 0, S1 = o.s1 != null ? o.s1 : 1;
  const fein = T.fein !== false;
  /* Großbild: weiche Enden längs der Achse über eine Maske mit Verlauf (Mittellinie bei s0 → s1), ohne Stufen;
     Szene: Deckkraft je Abschnitt (billig) */
  const flaeche = querVerlauf(T, ax, basis, { s0: S0, s1: S1, weichS: fein ? 0 : ws, schritt, rausA: o.offenA || t0 <= 0 ? 0.15 : 0, rausB: o.offenB || t1 >= 1 ? 0.15 : 0, flip: null });
  if (!fein || ws <= 0 || !flaeche) return flaeche;
  const mitte = (sv) => { const i = Math.max(0, Math.min(n - 1, Math.round(sv * (n - 1)))); return lerp(ax.A[i], ax.B[i], 0.5); };
  const P0 = mitte(S0), P1 = mitte(S1), b = box(ax.A.concat(ax.B)), mid = T.id("mm" + basis.slice(-4));
  const R = (v) => Math.round(v * 10) / 10, re = `x="${Math.floor(b[0] - 8)}" y="${Math.floor(b[1] - 8)}" width="${Math.ceil(b[2] - b[0] + 16)}" height="${Math.ceil(b[3] - b[1] + 16)}"`;
  const offen0 = S0 <= 0.001, offen1 = S1 >= 0.999;
  const gst = (offen0 ? `<stop offset="0" stop-color="#fff"/>` : `<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="${Math.round(ws * 1000) / 1000}" stop-color="#fff"/>`) +
    (offen1 ? `<stop offset="1" stop-color="#fff"/>` : `<stop offset="${Math.round((1 - ws) * 1000) / 1000}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>`);
  T.def(`<linearGradient id="${mid}g" gradientUnits="userSpaceOnUse" x1="${R(P0[0])}" y1="${R(P0[1])}" x2="${R(P1[0])}" y2="${R(P1[1])}">${gst}</linearGradient><mask id="${mid}" maskUnits="userSpaceOnUse" ${re}><rect ${re} fill="url(#${mid}g)"/></mask>`);
  return `<g mask="url(#${mid})">${flaeche}</g>`;
}

/* =====================================================================
   W6 — T.oberflaeche(zonen)
   Relief/Rauschen NUR in maskierten Zonen, im Kernschatten gedämpft; Schuppen/Platten als Rangfolge (groß am Rücken,
   mittel an der Flanke, klein am Bauch) statt Rauschen; KEINE gedrehten Rechtecke (Rauschen liegt achsparallel in der
   Zonenbox, nur in der Feinansicht). zonen: [{ pts (Vieleck), art: "poren"|"koernung"|"schuppen"|"platten"|"runzeln",
     achse (für Schuppen/Runzeln: Strang mit A/B), groesse (cm), farbe, licht ("#fff"), schatten ("#000"), op,
     dämpfung (0–1, Stärke im Schatten), hell (Funktion aus T.licht) }]
   ===================================================================== */
function oberflaeche(T, zonen) {
  const fein = T.fein !== false;
  let s = "";
  for (const z of zonen) {
    const op = z.op != null ? z.op : 0.3;
    if (z.art === "poren" || z.art === "koernung") {
      if (!fein || !T.rauschen) continue;
      const b = box(z.pts), id = T.id("ob" + (T._ob = (T._ob || 0) + 1));
      T.def(`<clipPath id="${id}"><path d="${glatt(z.pts)}"/></clipPath>`);
      const fx = 1 / Math.max(0.05, z.groesse || 0.3);
      const f = T.rauschen("ob" + String(Math.round(fx * 100)) + (z.farbe || "#000").slice(1), { fx, fy: fx, okt: 2, farbe: z.farbe || "#000", staerke: 3, schwelle: 0.58 });
      s += `<g clip-path="url(#${id})" opacity="${op2(op)}"><rect x="${Math.floor(b[0])}" y="${Math.floor(b[1])}" width="${Math.ceil(b[2] - b[0]) + 1}" height="${Math.ceil(b[3] - b[1]) + 1}" filter="${f}"/></g>`;
      continue;
    }
    if ((z.art === "schuppen" || z.art === "platten") && z.achse) {
      /* Reihen entlang der Achse; Größe nach Rang: t (quer) 0 → z.groesse, 1 → z.groesse × (z.klein || 0,35) */
      const ax = z.achse, n = ax.A.length, g0 = z.groesse || 2, klein = z.klein || 0.35;
      let dF = "", dL = "", dS = "";
      const rows = [];
      let t = 0.02;
      while (t < 0.98) { const g = g0 * (1 - (1 - klein) * t); rows.push([t, g]); const breite = abst(ax.A[Math.floor(n / 2)], ax.B[Math.floor(n / 2)]) || 1; t += (g * 0.8) / breite; }
      rows.forEach(([tt, g], ri) => {
        if (!fein && g < g0 * 0.7) return;
        const L = [];
        for (let i = 0; i < n; i++) L.push(lerp(ax.A[i], ax.B[i], tt));
        const pl = abtasten(L, Math.max(2, Math.round(abstSumme(L) / (g * 0.95))));
        pl.forEach((p, j) => {
          if (j === pl.length - 1) return;
          const q = pl[j + 1], [ux, uy] = norm(q[0] - p[0], q[1] - p[1]), off = (ri % 2) * 0.5;
          const c = lerp(p, q, off), hw = g * 0.5, hh = g * (z.art === "platten" ? 0.42 : 0.36);
          if (z.pts && !inPoly(c[0], c[1], z.pts)) return;
          const nx = -uy, ny = ux;
          const P = (a, b) => [c[0] + ux * a + nx * b, c[1] + uy * a + ny * b];
          const sch = [P(-hw, 0), P(-hw * 0.6, -hh), P(hw * 0.5, -hh * 0.9), P(hw, 0), P(hw * 0.5, hh * 0.9), P(-hw * 0.6, hh)];
          dF += eckig(sch);
          const o1 = P(-hw * 0.6, -hh), o2 = P(hw * 0.5, -hh * 0.9), u1 = P(hw * 0.5, hh * 0.9), u2 = P(-hw * 0.6, hh);
          dL += eckig([o1, o2], false); dS += eckig([u1, u2], false);
        });
      });
      s += `<path d="${dF}" fill="${z.farbe || "#000"}" fill-opacity="${op2(op * 0.25)}"/>` +
        (fein ? `<path d="${dL}" fill="none" stroke="${z.licht || "#fff"}" stroke-opacity="${op2(op * 0.7)}" stroke-width="${Math.round((z.strich || g0 * 0.08) * 100) / 100}" stroke-linecap="round"/>` : "") +
        `<path d="${dS}" fill="none" stroke="${z.schatten || "#000"}" stroke-opacity="${op2(op)}" stroke-width="${Math.round((z.strich || g0 * 0.1) * 100) / 100}" stroke-linecap="round"/>`;
      continue;
    }
    if (z.art === "runzeln" && z.achse) {
      const ax = z.achse, n = ax.A.length, schritt = Math.max(1, Math.round((z.abstand || 1) ));
      let dL = "", dS = "";
      for (let i = 1; i < n - 1; i += schritt) {
        const a = ax.A[i], b = ax.B[i], m = lerp(a, b, 0.5), k = (T.rnd() - 0.5) * abst(a, b) * 0.15;
        const [ux, uy] = norm(b[0] - a[0], b[1] - a[1]), c = [m[0] - uy * k, m[1] + ux * k];
        const p0 = lerp(a, b, 0.05 + T.rnd() * 0.1), p1 = lerp(a, b, 0.85 + T.rnd() * 0.1);
        dS += `M${zs(G10(p0[0]))} ${zs(G10(p0[1]))}Q${zs(G10(c[0]))} ${zs(G10(c[1]))} ${zs(G10(p1[0]))} ${zs(G10(p1[1]))}`;
        if (fein) dL += `M${zs(G10(p0[0] - 0.3))} ${zs(G10(p0[1] - 0.3))}Q${zs(G10(c[0] - 0.3))} ${zs(G10(c[1] - 0.3))} ${zs(G10(p1[0] - 0.3))} ${zs(G10(p1[1] - 0.3))}`;
      }
      s += `<path d="${dS.replace(/ -/g, "-")}" fill="none" stroke="${z.schatten || "#000"}" stroke-opacity="${op2(op)}" stroke-width="${z.strich || 0.3}" stroke-linecap="round"/>` +
        (dL ? `<path d="${dL.replace(/ -/g, "-")}" fill="none" stroke="${z.licht || "#fff"}" stroke-opacity="${op2(op * 0.6)}" stroke-width="${(z.strich || 0.3) * 0.7}" stroke-linecap="round"/>` : "");
    }
  }
  return s;
}
const abstSumme = (pl) => { let s = 0; for (let i = 1; i < pl.length; i++) s += abst(pl[i - 1], pl[i]); return s; };

/* ---------- Einhängen ---------- */
function installiere(T) {
  T.form880 = { glatt, eckig, lerp, abst, norm, inPoly, box, flaeche, abtasten, crPunkte, mischFarbe, op2, LICHT, weichEllipse: (...a) => weichEllipse(T, ...a), bandPunkte, bandPfad, PROFIL, profilWert, querVerlauf: (ax, id, o) => querVerlauf(T, ax, id, o), lichtSeiten };
  T.glied = (kette, breiten, o = {}) => {
    const g = gliedGeo(kette, breiten, o);
    g.d = glatt(g.umriss);
    if (o.farbe) {
      /* Pfad EINMAL in defs (Füllung und Clip greifen per <use> darauf zu) */
      const pid = T.id("gp" + (T._gp = (T._gp || 0) + 1));
      T.def(`<path id="${pid}" d="${g.d}"/>`);
      g.id = pid;
      let s = `<use href="#${pid}" fill="${o.farbe}"/>`;
      if (o.fern) {
        /* fern: 20–25 % dunkler und kühler, oben Schlagschatten des Rumpfes (Verlauf nach unten auslaufend) */
        const top = kette[0], y0 = o.schatten ? o.schatten[0] : top[1], y1 = o.schatten ? o.schatten[1] : top[1] + abst(kette[0], kette[kette.length - 1]) * 0.45;
        const cid = T.id("gf" + (T._gf = (T._gf || 0) + 1));
        T.def(`<clipPath id="${cid}"><use href="#${pid}"/></clipPath>`);
        const b = box(g.umriss);
        s += `<g clip-path="url(#${cid})"><rect x="${Math.floor(b[0] - 1)}" y="${Math.floor(b[1] - 1)}" width="${Math.ceil(b[2] - b[0] + 2)}" height="${Math.ceil(b[3] - b[1] + 2)}" fill="${o.fernFarbe || "#1c2430"}" fill-opacity="${o.fernStaerke || 0.24}"/>` +
          `<rect x="${Math.floor(b[0] - 1)}" y="${Math.floor(y0 - 1)}" width="${Math.ceil(b[2] - b[0] + 2)}" height="${Math.ceil(y1 - y0 + 2)}" fill="${T.lg("gfs" + Math.round(y0) + "_" + Math.round(y1), [[0, "#0e0a06", 0.55], [1, "#0e0a06", 0]], 0, Math.round(y0 * 10) / 10, 0, Math.round(y1 * 10) / 10, ' gradientUnits="userSpaceOnUse"')}"/>` +
          (o.innen || "") + `</g>`;
        g.clip = `url(#${cid})`;
      } else if (o.innen) {
        const cid = T.id("gn" + (T._gf = (T._gf || 0) + 1));
        T.def(`<clipPath id="${cid}"><use href="#${pid}"/></clipPath>`);
        s += `<g clip-path="url(#${cid})">${o.innen}</g>`;
        g.clip = `url(#${cid})`;
      }
      g.svg = s;
    }
    g.achse = { name: o.name || "glied", art: "glied", A: g.aRoh, B: g.bRoh };
    return g;
  };
  T.beinKette = (sk, wo, o) => beinKette(sk, wo, o);
  T.silhouette = (sk, profil) => { T.stil = 880; return silhouette(T, sk, profil); };
  T.licht = (sil, o) => licht(T, sil, o);
  T.muster = (ax, o) => muster(T, ax, o);
  /* Zone als Vieleck aus einer Achse (Quer t0…t1, längs s0…s1) – für Fellzonen, Muster, Oberflächen */
  T.zone = (ax, t0, t1, s0 = 0, s1 = 1) => { const b = bandPunkte(ax, t0, t1, s0, s1); return b.l1.concat(b.l2.slice().reverse()); };
  T.oberflaeche = (zonen) => oberflaeche(T, zonen);
  return T;
}

module.exports = { installiere, glatt, eckig, lerp, abst, norm, inPoly, box, flaeche, abtasten, crPunkte, mischFarbe, op2, LICHT, PROFIL, profilWert, gliedGeo, strangAusLinien, bandPunkte, bandPfad };
