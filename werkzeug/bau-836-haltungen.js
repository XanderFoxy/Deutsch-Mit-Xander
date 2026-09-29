#!/usr/bin/env node
/* =====================================================================
   FASSUNG 836 — DIE HALTUNGEN AUS ZIELPUNKTEN RECHNEN
   ---------------------------------------------------------------------
   XANDER (Funk 217): „ob sie im Schneidersitz sitzen ob sie in der Hocke
   sitzen ob sie auf den Unterschenkeln hocken … ob sie auf allen Vieren
   sind ob sie auf dem Rücken liegen ob sie auf dem Bauch liegen …“.
   Jede Haltung wird aus Zielpunkten gebaut (Knie, Knöchel, Ellbogen,
   Hand; Zwei-Glieder-Rechnung) und danach per Koordinatenabstieg so
   verschoben, dass die Körperteile, die aufliegen, auf dem Boden liegen
   (Messung: zeichne({ messen: true })). Das Ergebnis (Winkel) steht
   in figuren/mensch.js unter „FASSUNG 836“ in POSEN.
   Aufruf:  node werkzeug/bau-836-haltungen.js [name,…]   (druckt die Winkel)
   ===================================================================== */
// Haltungen aus Zielpunkten (Knie, Knöchel, Ellbogen, Hand) per Zwei-Glieder-IK,
// danach Feinabgleich der Bodenkontakte. node ik2.js <mensch.js> [namen]
require(require("path").join(__dirname, "../figuren/mensch.js"));
const MM = globalThis.DMA_MENSCH;
const nur = process.argv[2] ? process.argv[2].split(",") : null;
const RAD = Math.PI / 180, DEG = 180 / Math.PI;
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.sqrt(dot(a, a)), unit = (a) => mul(a, 1 / (len(a) || 1));
const T = (R) => [R[0], R[3], R[6], R[1], R[4], R[7], R[2], R[5], R[8]];
const mv = (A, v) => [A[0] * v[0] + A[1] * v[1] + A[2] * v[2], A[3] * v[0] + A[4] * v[1] + A[5] * v[2], A[6] * v[0] + A[7] * v[1] + A[8] * v[2]];
const rx = (d) => { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return [1, 0, 0, 0, c, -s, 0, s, c]; };
const rz = (d) => { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return [c, -s, 0, s, c, 0, 0, 0, 1]; };
const klemm = (x, a, b) => Math.max(a, Math.min(b, x));
const clone = (o) => JSON.parse(JSON.stringify(o));
const MASS = MM.massFuer("erwachsen", "m");

function zweiGlied(A, pol, Z, L1, L2, direkt) {
  if (direkt) { const t = unit(sub(pol, A)), B = add(A, mul(t, L1)), s = unit(sub(Z, B)); return { t, s, B, C: add(B, mul(s, L2)) }; }
  const dv = sub(Z, A); const u = unit(dv);
  const d = klemm(len(dv), Math.abs(L1 - L2) + 0.5, L1 + L2 - 0.3);
  let w = sub(pol, A); w = unit(sub(w, mul(u, dot(w, u))));
  const ca = klemm((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1), sa = Math.sqrt(1 - ca * ca);
  const B = add(A, mul(add(mul(u, ca), mul(w, sa)), L1)), C = add(A, mul(u, d));
  return { t: unit(sub(B, A)), s: unit(sub(C, B)), B, C };
}
/* Richtungen (im Elternrahmen) → Gelenkwinkel. bein: Knie beugt nach hinten, Arm: Ellbogen nach vorn. */
function winkel(t, s, links, arm, drehAlt) {
  const v = Math.atan2(t[2], Math.hypot(t[0], t[1])) * DEG;
  const se = Math.atan2(links ? t[0] : -t[0], t[1]) * DEG;
  const kc = klemm(dot(t, s), -1, 1), k = Math.acos(kc) * DEG, sk = Math.sin(k * RAD);
  let dreh = drehAlt || 0;
  if (sk > 0.08) {
    const n = arm ? mul(sub(s, mul(t, kc)), 1 / sk) : mul(sub(mul(t, kc), s), 1 / sk);
    const m = mv(T(rx(v)), mv(T(rz(links ? -se : se)), n));
    dreh = Math.atan2(links ? m[0] : -m[0], m[2]) * DEG;
  }
  return { o: { vor: v, seit: se, dreh }, k };
}
function S(P) { return MM.skelett(MASS, MM.pose(P)); }
function bein(P, sd, knie, fuss, direkt) {
  const Sk = S(P), H = Sk["huefte" + sd];
  const r = zweiGlied(H.p, knie, fuss, MASS.oberschenkel, MASS.unterschenkel, direkt);
  const R = T(Sk.becken.R);
  const w = winkel(mv(R, r.t), mv(R, r.s), sd === "L", false, (P["huefte" + sd] || {}).dreh);
  P["huefte" + sd] = w.o; P["knie" + sd] = w.k;
  return P;
}
function arm(P, sd, ell, hand, direkt) {
  const Sk = S(P), A = Sk["schulter" + sd];
  const r = zweiGlied(A.p, ell, hand, MASS.oberarm, MASS.unterarm, direkt);
  const R = T(Sk.brust.R);
  const w = winkel(mv(R, r.t), mv(R, r.s), sd === "L", true, (P["schulter" + sd] || {}).dreh);
  P["schulter" + sd] = w.o; P["ellbogen" + sd] = w.k;
  return P;
}
/* Fuß flach: seine Längsachse waagrecht (oben = Sohle unten), rueck: Fußrücken auf dem Boden */
function fussFlach(P, sd, rueck) {
  const K = S(P)["knie" + sd].R;
  const a = K[4], b = K[5];          // Zeile y: [.., R11, R12]
  let f = Math.atan2(-b, a) * DEG;    // sin f * a + cos f * b = 0
  const cands = [f, f + 180, f - 180].filter((x) => x > -70 && x < 110);
  f = rueck ? Math.max(...cands) : cands.reduce((p, q) => Math.abs(q) < Math.abs(p) ? q : p);
  P["fuss" + sd] = f;
  return P;
}
function messe(P, spec) { return MM.zeichne(Object.assign({ pose: P, blick: 0, messen: true, nurMessen: true }, spec || {})).mess; }
const q2 = (x) => x * x;
const hol = (P, k) => { const [a, b] = k.split("."); return b ? ((P[a] || {})[b] || 0) : (P[a] || 0); };
const setz = (P, k, v) => { const [a, b] = k.split("."); if (b) { P[a] = Object.assign({}, P[a] || {}); P[a][b] = v; } else P[a] = v; };
function optimiere(P0, params, kosten, opt) {
  opt = opt || {};
  let P = clone(P0);
  const reg = opt.reg == null ? 0.004 : opt.reg;
  const bau = opt.bau || ((P) => P);
  const f = (P) => { const Q = bau(clone(P)); const m = messe(Q); let c = kosten(m, Q); params.forEach((k) => { c += reg * q2(hol(P, k) - hol(P0, k)); }); c += 60 * m.stecken.length; return c; };
  let best = f(P), step = opt.schritt || 6;
  while (step > 0.1) {
    let besser = false;
    for (const k of params) for (const d of [step, -step]) {
      const Q = clone(P); setz(Q, k, hol(P, k) + d);
      const c = f(Q);
      if (c < best - 1e-6) { best = c; P = Q; besser = true; }
    }
    if (!besser) step /= 2;
  }
  return { P: bau(clone(P)), kosten: best };
}
const runde = (P) => { const o = {}; Object.keys(P).forEach((k) => { const v = P[k]; if (typeof v === "number") o[k] = /^finger/.test(k) ? Math.round(v * 100) / 100 : Math.round(v); else if (v && typeof v === "object") { o[k] = {}; Object.keys(v).forEach((j) => { o[k][j] = Math.round(v[j]); }); } else o[k] = v; }); return o; };
const H = (m, n) => m.hoehe[n];
const G = (m, n) => m.gelenk[n];
module.exports = { bein, arm, fussFlach, optimiere, messe, runde, H, G, S, MASS };

/* ================================================================ */
const AUFGABEN = {};
/* Schneidersitz: Knie weit außen und tief, die Unterschenkel kreuzen sich
   vor dem Körper, jeder Fuß liegt unter dem anderen Knie/Unterschenkel. */
AUFGABEN.schneidersitz = () => {
  const P0 = { kipp: -4, lende: 8, brust: 6, nacken: 10, kopf: -6, unterarmL: -70, handL: -6, fingerL: 0.35, unterarmR: -70, handR: -6, fingerR: 0.35 };
  const bau = (P) => {
    const y0 = P.boden;              // Boden unter der Hüfte (cm, y nach unten)
    bein(P, "L", [34, y0 - 10, 31], [-6, y0 - 8, 23]);
    bein(P, "R", [-34, y0 - 9, 24], [6, y0 - 4.5, 9]);
    fussFlach(P, "L"); fussFlach(P, "R");
    P.fussL += 25; P.fussR += 25;    // Fuß auf der Außenkante
    const Sk = S(P);
    arm(P, "L", add(Sk.schulterL.p, [7, 30, 6]), add(Sk.knieL.p, [-5, -8, -3]));
    arm(P, "R", add(Sk.schulterR.p, [-7, 30, 6]), add(Sk.knieR.p, [5, -8, -3]));
    return P;
  };
  return optimiere(Object.assign(P0, { boden: 10 }), ["boden", "kipp"], (m) => 10 * q2(H(m, "gesaess")) + q2(H(m, "fussL") - 1) + q2(H(m, "fussR") - 1) + 0.3 * q2(H(m, "knieL") - 8) + 0.3 * q2(H(m, "knieR") - 9) + 2 * q2(G(m, "brust")[2] - G(m, "becken")[2] - 2), { bau, reg: 0.01 });
};
/* Hocke mit den Fersen am Boden */
AUFGABEN.hocken = () => {
  const P0 = { kipp: 34, lende: 8, brust: 10, nacken: -24, kopf: -12, unterarmL: -20, handL: -6, fingerL: 0.45, unterarmR: -20, handR: -6, fingerR: 0.45, boden: 60, vorn: 8 };
  const bau = (P) => {
    const y0 = P.boden;
    bein(P, "L", [20, y0 - 30, 42], [12, y0 - 9, P.vorn]);
    bein(P, "R", [-20, y0 - 30, 42], [-12, y0 - 9, P.vorn]);
    fussFlach(P, "L"); fussFlach(P, "R");
    const Sk = S(P);
    arm(P, "L", add(Sk.knieL.p, [2, -6, -2]), add(Sk.knieL.p, [-6, 14, 12]));
    arm(P, "R", add(Sk.knieR.p, [-2, -6, -2]), add(Sk.knieR.p, [6, 14, 12]));
    return P;
  };
  return optimiere(P0, ["boden", "vorn", "kipp"], (m) => {
    const fz = (G(m, "fussL")[2] + 6);
    const schwer = (G(m, "becken")[2] * 1.2 + G(m, "brust")[2] + G(m, "kopf")[2] * 0.4) / 2.6;
    return 6 * (q2(H(m, "ferseL")) + q2(H(m, "zehL")) + q2(H(m, "ferseR")) + q2(H(m, "zehR"))) + 0.6 * q2(H(m, "gesaess") - 22) + 1.5 * q2(schwer - fz);
  }, { bau, reg: 0.01 });
};
/* Fersensitz: Knie und Fußrücken am Boden, das Gesäß ruht auf den Fersen */
AUFGABEN.fersensitz = () => {
  const P0 = { kipp: 0, lende: -2, brust: 4, nacken: 6, kopf: -4, unterarmL: -75, handL: -6, fingerL: 0.3, unterarmR: -75, handR: -6, fingerR: 0.3, boden: 22, fz: 10, fy: 0 };
  const bau = (P) => {
    const y0 = P.boden;
    bein(P, "L", [9, y0 - 5, 40], [11, y0 - 10 + P.fy, -2]);
    bein(P, "R", [-9, y0 - 5, 40], [-11, y0 - 10 + P.fy, -2]);
    fussFlach(P, "L", true); fussFlach(P, "R", true);
    const Sk = S(P);
    arm(P, "L", add(Sk.schulterL.p, [3, 28, -4]), add(Sk.knieL.p, [-3, -9, -14]));
    arm(P, "R", add(Sk.schulterR.p, [-3, 28, -4]), add(Sk.knieR.p, [3, -9, -14]));
    return P;
  };
  return optimiere(P0, ["boden", "kipp", "fz", "fy"], (m) => 6 * (q2(H(m, "knieL")) + q2(H(m, "knieR"))) + 3 * (q2(H(m, "zehL")) + q2(H(m, "zehR"))) + 3 * q2(H(m, "gesaess") - H(m, "ferseL") - 0.5) + q2(G(m, "brust")[2] - G(m, "becken")[2]), { bau: (P) => { const Q = bau(P); Q.fussL += Q.fz; Q.fussR += Q.fz; return Q; }, reg: 0.01 });
};
/* Kniestand: aufrecht auf den Knien, Oberschenkel senkrecht */
AUFGABEN.knien = () => {
  const P0 = { kipp: 0, lende: 2, brust: -2, nacken: 6, kopf: -4, schulterL: { vor: 4, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38, schulterR: { vor: -2, seit: 9 }, ellbogenR: 12, unterarmR: 6, handR: 4, fingerR: 0.36, boden: 46, fz: 10, fy: 0 };
  const bau = (P) => {
    const y0 = P.boden;
    bein(P, "L", [10, y0 - 5, 4], [11, y0 - 6 + P.fy, -36]);
    bein(P, "R", [-10, y0 - 5, 4], [-11, y0 - 6 + P.fy, -36]);
    fussFlach(P, "L", true); fussFlach(P, "R", true);
    return P;
  };
  return optimiere(P0, ["boden", "fz", "fy"], (m) => 6 * (q2(H(m, "knieL")) + q2(H(m, "knieR"))) + 3 * (q2(H(m, "zehL")) + q2(H(m, "zehR"))) + q2(H(m, "fussL")), { bau: (P) => { const Q = bau(P); Q.fussL += Q.fz; Q.fussR += Q.fz; return Q; }, reg: 0.001 });
};
/* Vierfüßlerstand: Hände unter den Schultern, Knie unter der Hüfte, Rücken waagrecht */
AUFGABEN.krabbeln = () => {
  const P0 = { kipp: 84, lende: -6, brust: -6, nacken: -40, kopf: -22, unterarmL: -85, handL: 82, fingerL: 0.08, unterarmR: -85, handR: 82, fingerR: 0.08, boden: 46, fz: 10, fy: 0 };
  const bau = (P) => {
    const y0 = P.boden;
    bein(P, "L", [11, y0 - 5, 3], [11, y0 - 6 + P.fy, -38]);
    bein(P, "R", [-11, y0 - 5, 3], [-11, y0 - 6 + P.fy, -38]);
    fussFlach(P, "L", true); fussFlach(P, "R", true);
    const Sk = S(P);
    arm(P, "L", add(Sk.schulterL.p, [1, 30, -3]), [Sk.schulterL.p[0] - 2, y0 - 5, Sk.schulterL.p[2] + 2]);
    arm(P, "R", add(Sk.schulterR.p, [-1, 30, -3]), [Sk.schulterR.p[0] + 2, y0 - 5, Sk.schulterR.p[2] + 2]);
    return P;
  };
  return optimiere(P0, ["boden", "kipp", "handL", "fz", "fy"], (m) => 5 * (q2(H(m, "knieL")) + q2(H(m, "knieR")) + q2(H(m, "handL")) + q2(H(m, "handR"))) + 2 * (q2(H(m, "zehL")) + q2(H(m, "zehR"))) + q2(H(m, "fussL")) + 0.5 * q2(G(m, "brust")[1] - G(m, "becken")[1] - 3), { bau: (P) => { const Q = bau(P); Q.handR = Q.handL; Q.fussL += Q.fz; Q.fussR += Q.fz; return Q; }, reg: 0.01 });
};
/* ik2-mehr */
/* weitere Haltungen — wird in ik2.js vor „const aus“ eingefügt */
const STEH = { lende: 1, brust: -2, nacken: 6, kopf: -4, huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 };
/* Arme verschränkt: Unterarme waagrecht vor der unteren Brust, der linke
   liegt vorn und oben, die linke Hand am rechten Oberarm, die rechte Hand
   unter dem linken Ellbogen. Nicht durch den Brustkorb. */
function verschraenkt(P, vor) {
  const Sk = S(P), L = Sk.schulterL.p, R = Sk.schulterR.p;
  const v = vor || 0;
  const eL = add(L, [-3, 26, 17 + v]), eR = add(R, [3, 28, 14 + v]);
  arm(P, "L", eL, add(eL, mul(unit([-1, -0.42, 0.12]), 26)), true);
  arm(P, "R", eR, add(eR, mul(unit([1, -0.3, 0.05]), 26)), true);
  P.unterarmL = 0; P.unterarmR = 0; P.handL = -45; P.handR = -50; P.fingerL = 0.55; P.fingerR = 0.6;
  return P;
}
AUFGABEN.arme_verschraenkt = () => ({ P: verschraenkt(Object.assign(clone(STEH), { kopf: -2 })), kosten: 0 });
/* Hände in den Hüften: Handgelenk über dem Beckenkamm, etwas hinten, der
   Ellbogen weit nach außen und leicht nach hinten. */
AUFGABEN.haende_huefte = () => {
  const P = Object.assign(clone(STEH), { roll: 2, brustRoll: -2, kopf: -6 });
  arm(P, "L", [37, -34, -9], [17.5, -12, -3]);
  arm(P, "R", [-37, -34, -9], [-17.5, -12, -3]);
  Object.assign(P, { unterarmL: -60, unterarmR: -60, handL: -25, handR: -25, fingerL: 0.2, fingerR: 0.2 });
  return { P, kosten: 0 };
};
/* Strecken: Arme gerade über den Kopf, auf den Zehenspitzen, Blick nach oben */
AUFGABEN.strecken = () => ({ P: { lende: -3, brust: -8, nacken: -8, kopf: -16,
  schulterL: { vor: 168, seit: 16 }, ellbogenL: 6, unterarmL: 70, handL: 12, fingerL: 0.06,
  schulterR: { vor: 170, seit: 14 }, ellbogenR: 5, unterarmR: 70, handR: 12, fingerR: 0.06,
  huefteL: { vor: 0, seit: 3, dreh: -4 }, knieL: 0, fussL: 32, huefteR: { vor: 0, seit: 3, dreh: -4 }, knieR: 0, fussR: 32 }, kosten: 0 });
/* Anlehnen (an eine Wand): der ganze Körper leicht zurückgeneigt, die
   Füße ein Stück vor der Wand, das rechte Bein über das linke gekreuzt,
   die Arme verschränkt. */
AUFGABEN.anlehnen = () => {
  const P = Object.assign(clone(STEH), { kipp: -8, lende: 2, brust: -1, nacken: 12, kopf: -2, huefteL: { vor: 0, seit: 2, dreh: -6 }, knieL: 2 });
  fussFlach(P, "L");
  const Sk = S(P), fL = Sk.fussL.p;
  bein(P, "R", add(Sk.knieL.p, [-4, 0, 6]), add(fL, [3, -3, 9]));
  fussFlach(P, "R"); P.fussR += 26;
  verschraenkt(P, 6); P.ellbogenR += 6;
  return optimiere(P, ["nacken"], (m) => q2(G(m, "kopf")[2] - G(m, "brust")[2] - 3), { reg: 0.001 });
};
/* Laufen/Joggen: das vordere Bein greift aus, das hintere ist hoch
   angewinkelt, die Arme im rechten Winkel gegengleich, Oberkörper vor. */
AUFGABEN.laufen = () => ({ P: { kipp: 9, lende: 2, brust: 0, brustDreh: -8, nacken: -4, kopf: -4,
  schulterL: { vor: -38, seit: 10 }, ellbogenL: 95, unterarmL: 20, handL: 0, fingerL: 0.6,
  schulterR: { vor: 42, seit: 6 }, ellbogenR: 92, unterarmR: 20, handR: 0, fingerR: 0.6,
  huefteL: { vor: 32, seit: 2, dreh: -4 }, knieL: 22, fussL: -8, huefteR: { vor: -24, seit: 3, dreh: -6 }, knieR: 98, fussR: 34 }, kosten: 0 });
/* Treppensteigen: das linke Bein steht eine Stufe (17 cm) höher, das
   rechte drückt sich hinten ab. */
AUFGABEN.treppe = () => {
  const P = { kipp: 7, lende: 2, brust: 2, nacken: 2, kopf: -8, brustDreh: 5,
    schulterL: { vor: -14, seit: 8 }, ellbogenL: 22, unterarmL: 10, handL: 4, fingerL: 0.4,
    schulterR: { vor: 22, seit: 8 }, ellbogenR: 30, unterarmR: 10, handR: 4, fingerR: 0.4, boden: 88 };
  const bau = (P) => {
    const y0 = P.boden;
    bein(P, "R", [-9, y0 - 48, -2], [-10, y0 - 9, -16]);
    bein(P, "L", [10, y0 - 60, 36], [10, y0 - 17 - 8, 30]);
    fussFlach(P, "L"); fussFlach(P, "R"); P.fussR += 22;
    return P;
  };
  return optimiere(P, ["boden"], (m) => 3 * q2(H(m, "ferseL") - 17) + 3 * q2(H(m, "zehL") - 17) + 3 * q2(H(m, "zehR")), { bau, reg: 0.001 });
};
/* Bücken: aus der Hüfte vorgebeugt, Knie leicht gebeugt, die Hände
   reichen zum Boden vor den Füßen. */
AUFGABEN.buecken = () => {
  const P = { kipp: 78, lende: 16, brust: 12, nacken: -14, kopf: -14, boden: 80, fingerL: 0.3, fingerR: 0.3, unterarmL: -30, unterarmR: -30, handL: 0, handR: 0 };
  const bau = (P) => {
    const y0 = P.boden;
    bein(P, "L", [10, y0 - 45, 14], [10, y0 - 8, -2]);
    bein(P, "R", [-10, y0 - 45, 14], [-10, y0 - 8, -2]);
    fussFlach(P, "L"); fussFlach(P, "R");
    const Sk = S(P);
    arm(P, "L", add(Sk.schulterL.p, [4, 30, 2]), [13, y0 - 22, 24]);
    arm(P, "R", add(Sk.schulterR.p, [-4, 30, 2]), [-13, y0 - 22, 24]);
    return P;
  };
  return optimiere(P, ["boden"], (m) => {
    return 5 * (q2(H(m, "ferseL")) + q2(H(m, "zehL")));
  }, { bau, reg: 0.01 });
};
/* Sitzen mit angewinkelten Beinen (am Boden): Knie hoch, Füße flach, die
   Arme um die Knie gelegt, die Hände vor den Schienbeinen verschränkt. */
function angewinkelt(P, lehne) {
  const bau = (P) => {
    const y0 = P.boden;
    bein(P, "L", [12, y0 - 45, 26], [11, y0 - 8, 44]);
    bein(P, "R", [-12, y0 - 45, 26], [-11, y0 - 8, 44]);
    fussFlach(P, "L"); fussFlach(P, "R");
    const Sk = S(P);
    if (lehne) {
      /* Hände liegen auf den Knien */
      arm(P, "L", add(Sk.schulterL.p, [10, 22, 6]), add(Sk.knieL.p, [-1, -7, -4]));
      arm(P, "R", add(Sk.schulterR.p, [-10, 22, 6]), add(Sk.knieR.p, [1, -7, -4]));
    } else {
      arm(P, "L", add(Sk.knieL.p, [10, 6, -10]), add(Sk.knieL.p, [-10, 10, 10]));
      arm(P, "R", add(Sk.knieR.p, [-10, 6, -10]), add(Sk.knieR.p, [10, 17, 9]));
    }
    return P;
  };
  return optimiere(P, ["boden", "kipp"], (m) => 8 * q2(H(m, "gesaess")) + 4 * (q2(H(m, "ferseL")) + q2(H(m, "zehL"))) + (lehne ? 0 : 0.5 * q2(G(m, "brust")[2] - G(m, "becken")[2] - 1)), { bau, reg: 0.01 });
}
AUFGABEN.sitzen_angewinkelt = () => angewinkelt({ kipp: -12, lende: 10, brust: 10, nacken: 14, kopf: -8, boden: 11, unterarmL: -60, unterarmR: -60, handL: -10, handR: -10, fingerL: 0.55, fingerR: 0.55 }, false);
AUFGABEN.baden = () => angewinkelt({ kipp: -26, lende: 6, brust: 6, nacken: 22, kopf: -4, boden: 11, unterarmL: -70, unterarmR: -70, handL: -8, handR: -8, fingerL: 0.35, fingerR: 0.35 }, true);
/* Grätschsitz wie beim Turnen: aufrecht, Beine gestreckt weit gespreizt,
   Kniescheiben nach oben, Hände vorn am Boden. */
AUFGABEN.graetschsitz = () => {
  const P = { kipp: 0, lende: 6, brust: 4, nacken: 8, kopf: -8, boden: 11, unterarmL: -80, unterarmR: -80, handL: 70, handR: 70, fingerL: 0.12, fingerR: 0.12 };
  const bau = (P) => {
    const y0 = P.boden;
    bein(P, "L", [34, y0 - 12, 28], [60, y0 - 8, 58]);
    bein(P, "R", [-34, y0 - 12, 28], [-60, y0 - 8, 58]);
    P.huefteL.dreh = P.huefteL.dreh; fussFlach(P, "L"); fussFlach(P, "R"); P.fussL -= 70; P.fussR -= 70;
    const Sk = S(P);
    arm(P, "L", add(Sk.schulterL.p, [6, 22, 12]), [12, y0 - 5, 34]);
    arm(P, "R", add(Sk.schulterR.p, [-6, 22, 12]), [-12, y0 - 5, 34]);
    return P;
  };
  return optimiere(P, ["boden", "kipp"], (m) => 8 * q2(H(m, "gesaess")) + 3 * (q2(H(m, "ferseL")) + q2(H(m, "ferseR"))) + 2 * (q2(H(m, "handL")) + q2(H(m, "handR"))) + q2(G(m, "brust")[2] - G(m, "becken")[2] - 3), { bau, reg: 0.01 });
};
/* Auf dem Stuhl, das rechte Bein über das linke geschlagen */
AUFGABEN.sitzen_ueberkreuz = () => {
  const P = { kipp: 0, lende: -4, brust: 4, nacken: 8, kopf: -6,
    huefteL: { vor: 86, seit: 5, dreh: -4 }, knieL: 86, fussL: 0,
    unterarmL: -70, unterarmR: -70, handL: -10, handR: -10, fingerL: 0.35, fingerR: 0.35 };
  const Sk = S(P), kL = Sk.knieL.p;
  bein(P, "R", add(kL, [-5, -15, 1]), add(kL, [8, 19, 35]), true);
  fussFlach(P, "L"); P.fussR = 28;
  const S2 = S(P), kR = S2.knieR.p;
  arm(P, "L", add(S2.schulterL.p, [6, 26, 10]), add(kR, [3, -8, -6]));
  arm(P, "R", add(S2.schulterR.p, [-6, 26, 10]), add(kR, [-5, -9, -9]));
  return { P, kosten: 0 };
};
/* Rückenlage: gerade ausgestreckt, Arme neben dem Körper, Füße fallen locker nach außen */
AUFGABEN.liegen = () => optimiere({ kipp: -90, lende: 0, brust: 0, nacken: -2, kopf: 2,
  schulterL: { vor: -8, seit: 10 }, ellbogenL: 8, unterarmL: -75, handL: 0, fingerL: 0.35,
  schulterR: { vor: -8, seit: 11 }, ellbogenR: 10, unterarmR: -75, handR: 0, fingerR: 0.35,
  huefteL: { vor: 0, seit: 6, dreh: -16 }, knieL: 3, fussL: 22, huefteR: { vor: 0, seit: 6, dreh: -16 }, knieR: 4, fussR: 22 },
["nacken", "schulterL.vor", "schulterR.vor"], (m) => 3 * q2(H(m, "kopf") - 0.5) + q2(H(m, "handL")) + q2(H(m, "handR")), { reg: 0.001 });
/* Bauchlage: Kopf zur Seite gedreht auf der Wange, Arme angewinkelt neben dem Kopf, Fußrücken am Boden */
AUFGABEN.bauchlage = () => {
  const P = { kipp: 90, lende: 0, brust: -2, nacken: -8, kopf: 0, kopfDreh: 78, boden: 11, fz: 0,
    unterarmL: -85, unterarmR: -85, handL: 10, handR: 10, fingerL: 0.25, fingerR: 0.25,
    huefteL: { vor: 0, seit: 5, dreh: 8 }, knieL: 4, huefteR: { vor: 0, seit: 5, dreh: 8 }, knieR: 6 };
  const bau = (P) => {
    const y0 = P.boden, Sk = S(P);
    arm(P, "L", [Sk.schulterL.p[0] + 22, y0 - 4, Sk.schulterL.p[2] - 4], [Sk.schulterL.p[0] + 8, y0 - 3, Sk.schulterL.p[2] + 22]);
    arm(P, "R", [Sk.schulterR.p[0] - 22, y0 - 4, Sk.schulterR.p[2] - 4], [Sk.schulterR.p[0] - 8, y0 - 3, Sk.schulterR.p[2] + 22]);
    fussFlach(P, "L", true); fussFlach(P, "R", true);
    return P;
  };
  return optimiere(P, ["boden", "nacken", "fz"], (m) => 5 * q2(H(m, "rumpf")) + 2 * q2(H(m, "oberschenkelL")) + 3 * q2(H(m, "zehL")) + 3 * q2(H(m, "kopf")) + q2(H(m, "unterarmL")) + q2(H(m, "unterarmR")), { bau: (P) => { const Q = bau(P); Q.fussL += Q.fz; Q.fussR = Q.fussL; return Q; }, reg: 0.002 });
};
/* Seitenlage (auf der linken Seite): unteres Bein fast gestreckt, oberes
   angewinkelt vor dem unteren auf dem Boden, der untere Arm unter dem
   Kopf, der obere vor der Brust auf dem Boden. */
AUFGABEN.seitenlage = () => {
  const P = { kipp: -90, dreh: 90, lende: 4, brust: 4, nacken: 4, kopf: 4, kopfRoll: 0, boden: 17,
    unterarmL: -20, unterarmR: -70, handL: 0, handR: 20, fingerL: 0.4, fingerR: 0.3 };
  const bau = (P) => {
    const y0 = P.boden, Sk = S(P);
    bein(P, "L", [16, y0 - 5, 38], [8, y0 - 4, 76]);
    bein(P, "R", [34, y0 - 6, 26], [22, y0 - 5, 62]);
    fussFlach(P, "L"); fussFlach(P, "R"); P.fussL += 20; P.fussR += 20;
    arm(P, "L", [Sk.schulterL.p[0] + 20, y0 - 4, Sk.schulterL.p[2] - 14], [Sk.schulterL.p[0] + 12, y0 - 6, Sk.schulterL.p[2] - 30]);
    arm(P, "R", [Sk.schulterR.p[0] + 24, Sk.schulterR.p[1] + 12, Sk.schulterR.p[2] + 8], [Sk.schulterR.p[0] + 34, y0 - 2, Sk.schulterR.p[2] - 6]);
    return P;
  };
  return optimiere(P, ["boden", "kopfRoll", "dreh"], (m) => 5 * q2(H(m, "rumpf")) + 2 * q2(H(m, "knieR")) + 2 * q2(H(m, "unterschenkelL")) + 1 * q2(H(m, "kopf") - 6) + q2(H(m, "handR")), { bau, reg: 0.002 });
};

const aus = {};
Object.keys(AUFGABEN).filter((n) => !nur || nur.includes(n)).forEach((n) => {
  const r = AUFGABEN[n]();
  const P = runde(r.P); delete P.boden; delete P.vorn;
  aus[n] = P;
  const m = messe(P);
  const h = m.hoehe;
  console.log("== " + n + "  kosten " + r.kosten.toFixed(1) + "  " + m.stecken.join("; "));
  console.log("   " + ["gesaess", "fussL", "fussR", "ferseL", "zehL", "knieL", "knieR", "unterschenkelL", "handL", "handR", "rumpf", "kopf"].map((k) => k + ":" + h[k]).join(" "));
  console.log("   " + JSON.stringify(P));
});
/* nur ausgeben — die Winkel werden von Hand in figuren/mensch.js übernommen */
