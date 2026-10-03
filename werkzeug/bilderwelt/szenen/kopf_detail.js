#!/usr/bin/env node
/* =====================================================================
   DER KOPF GANZ NAH (FASSUNG 852) — Bilderwelt neu, Detail-Szene
   (geöffnet über die Lupe aus „koerper“)
   ---------------------------------------------------------------------
   RECHERCHE (Zeichenlehre der Gesichtsproportionen, z. B. LMU „ZSK
   Anatomie“, Kunst-Realschule Bayern „Gesichter zeichnen“):
   - Die Augen liegen auf halber Kopfhöhe (Scheitel bis Kinn).
   - Der Kopf ist fünf Augen breit; zwischen den Augen ist eine
     Augenbreite Abstand.
   - Das Gesicht teilt sich in drei gleiche Teile: Haaransatz →
     Augenbraue → Nasenunterseite → Kinn.
   - Die Nasenbasis ist so breit wie ein Auge; der Mund reicht etwa von
     Pupille zu Pupille; die Mundlinie liegt im oberen Drittel zwischen
     Nase und Kinn.
   - Die Ohren reichen von Höhe Augenlid bis zwischen Nase und Mund.
   Darstellung wie eine Lehrbuch-Illustration: Kopf von vorn, ruhig,
   freundlich, Mund zum Lächeln geöffnet (Zähne, Zahnfleisch und
   Zunge sichtbar), Haare mit Mittelscheitel hinter die Ohren gelegt,
   Hemdkragen sichtbar. Licht von links oben.
   Maßstab: Scheitel (y 2) bis Kinn (y 159) ≈ 157 Einheiten ≈ 23 cm,
   also ≈ 6,8 Einheiten je Zentimeter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kopf_detail", titel: "Der Kopf ganz nah", emoji: "🔍", thema: "Körper", kuerzel: "b27a", fassung: 852 });
const rnd = zufall(2701);
const r = B.r;

/* ---------- Hilfen ---------------------------------------------------- */
const MX = 320;                                        /* Spiegelachse x = 160 */
const SPIEGEL = (svg) => svg + `<g transform="matrix(-1 0 0 1 ${MX} 0)">${svg}</g>`;
/* Teil zeichnet in Bildkoordinaten; die Verschiebung hebt x/y wieder auf */
/* Gesicht schmaler als der Bauplan (Jochbeinbreite ≈ 0,57 × Kopfhöhe): x um 160 auf 95 % */
const SCHMAL = "matrix(.95 0 0 1 8 0)";
const A = (cx, cy, svg) => `<g transform="translate(${-cx} ${-cy})"><g transform="${SCHMAL}">${svg}</g></g>`;
/* symmetrischer Umriss: rechte Hälfte von der Mitte oben bis zur Mitte unten */
function sym(start, segs) {
  const P = [start, ...segs.map((s) => [s[4], s[5]])];
  let d = `M${start[0]} ${start[1]}`;
  segs.forEach((s) => { d += ` C${s[0]} ${s[1]} ${s[2]} ${s[3]} ${s[4]} ${s[5]}`; });
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i], p = P[i];
    d += ` C${r(MX - s[2])} ${s[3]} ${r(MX - s[0])} ${s[1]} ${r(MX - p[0])} ${p[1]}`;
  }
  return d + " Z";
}
const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
};

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("weich3")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>`);
S.def(`<filter id="${S.id("weich1")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".8"/></filter>`);
const HAUT = S.rg("haut", [[0, "#f6d6bc"], [0.55, "#ecc19f"], [0.85, "#e0ab88"], [1, "#d39b78"]], 0.42, 0.4, 0.62);
const HALS = S.lg("hals", [[0, "#b9805f"], [0.22, "#d9a582"], [0.6, "#e8b997"], [1, "#e4b391"]]);
const HAAR = S.rg("haar", [[0, "#875634"], [0.5, "#653c22"], [1, "#3e2315"]], 0.4, 0.22, 0.8);
const HEMD = S.lg("hemd", [[0, "#c9d8ea"], [1, "#9fb4cf"]]);
const OHR = S.lg("ohr", [[0, "#e9b796"], [1, "#d89d7c"]], 0, 0, 1, 0);
const LICHT_HAUT = (name, a) => S.rg(name, [[0, "#fff1e3", a], [1, "#fff1e3", 0]], 0.4, 0.38, 0.6);

/* =====================================================================
   KULISSE — Fotohintergrund, Schultern mit Hemd, Kopf (Hautgrund)
   ===================================================================== */
S.hinten(`<rect width="320" height="200" fill="${S.lg("grund", [[0, "#e4e7e9"], [1, "#c6ced4"]])}"/>`);
S.hinten(`<rect width="320" height="200" fill="${S.rg("grundlicht", [[0, "#fbf7f0", 0.85], [0.6, "#fbf7f0", 0.15], [1, "#fbf7f0", 0]], 0.42, 0.32, 0.6)}"/>`);
/* Schultern: Hemd (hellblau, Baumwolle) mit Falten */
{
  const sch = "M14 201 C16 192 22 185 36 181 C66 174 100 170 118 167.5 C128 166 132.5 163 134 158 L186 158 C187.5 163 192 166 202 167.5 C220 170 254 174 284 181 C298 185 304 192 306 201";
  let h = `<path d="${sch} Z" fill="${HEMD}"/>`;
  h += `<path d="${sch}" stroke="#fff" stroke-width="1" opacity=".3" fill="none"/>`;
  h += `<path d="M30 201 C32 192 38 186 52 182" stroke="#7d93b0" stroke-width="3" opacity=".18" fill="none" filter="url(#${S.id("weich1")})"/><path d="M290 201 C288 192 282 186 268 182" stroke="#7d93b0" stroke-width="3" opacity=".22" fill="none" filter="url(#${S.id("weich1")})"/>`;
  for (const [a, b, c] of [[78, 188, 0.16], [104, 185, 0.13], [228, 184, 0.14], [256, 188, 0.12]]) h += `<path d="M${a} ${b + 10} q6 -8 ${a < 160 ? 18 : -18} -14" stroke="#7d93b0" stroke-width="1.6" opacity="${c}" fill="none" filter="url(#${S.id("weich1")})"/>`;
  /* Schulternaht */
  h += `<path d="M66 177 q4 10 3 24 M254 177 q-4 10 -3 24" stroke="#8ea4c0" stroke-width=".5" stroke-dasharray="1 .7" fill="none"/>`;
  S.hinten(h);
}
/* Hautgrund des Kopfes (Schädel bis Kinn) mit weicher Modellierung */
const KOPF = sym([160, 9.5], [
  [186, 9.5, 208, 26, 210.5, 54],
  [211.5, 62, 210.5, 70, 210.4, 76],
  [210.4, 86, 210, 96, 208, 104],
  [206.5, 114, 203, 125, 196, 133.5],
  [189, 142.5, 178, 154, 168, 157.2],
  [164, 158.6, 162, 159, 160, 159],
]);
S.def(`<clipPath id="${S.id("kopfclip")}"><path d="${KOPF}"/></clipPath>`);
{
  let k = `<g transform="${SCHMAL}"><path d="${KOPF}" fill="${HAUT}"/>`;
  k += `<g clip-path="url(#${S.id("kopfclip")})">`;
  /* Augenhöhlen, Nasenseiten, Wangenmulde, Kinnfalte — weich */
  k += SPIEGEL(`<ellipse cx="180" cy="78" rx="15" ry="9" fill="#b97d5e" opacity=".22" filter="url(#${S.id("weich3")})"/>`);
  k += `<path d="M165 82 C166 92 167 100 169 108" stroke="#a96b4f" stroke-width="3" opacity=".28" fill="none" filter="url(#${S.id("weich3")})"/>`;
  k += `<path d="M155 82 C154 92 153 100 151 108" stroke="#a96b4f" stroke-width="2.4" opacity=".14" fill="none" filter="url(#${S.id("weich3")})"/>`;
  k += SPIEGEL(`<path d="M206 96 C203 112 198 124 190 134" stroke="#a96b4f" stroke-width="5" opacity=".2" fill="none" filter="url(#${S.id("weich3")})"/>`);
  k += SPIEGEL(`<path d="M171 113 C176 118 179 123 181.5 128" stroke="#a96b4f" stroke-width="1.6" opacity=".22" fill="none" filter="url(#${S.id("weich1")})"/>`);
  k += `<ellipse cx="160" cy="117.6" rx="11" ry="2.2" fill="#9c5f45" opacity=".28" filter="url(#${S.id("weich1")})"/>`;
  k += `<ellipse cx="160" cy="144.5" rx="10" ry="1.8" fill="#9c5f45" opacity=".3" filter="url(#${S.id("weich1")})"/>`;
  /* Schatten der Haare auf der Stirn */
  k += `<path d="M128 40 C140 30 180 30 192 40" stroke="#8a5a40" stroke-width="5" opacity=".18" fill="none" filter="url(#${S.id("weich3")})"/>`;
  k += `</g></g>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER HALS (vor dem Hemd, unter dem Kinn)
   ===================================================================== */
{
  const d = `M134.6 146 L133 166 L160 201 L187 166 L185.4 146 C180 152 172 156.5 168 157.2 C164 158.6 162 159 160 159 C158 159 156 158.6 152 157.2 C148 156.5 140 152 134.6 146 Z`;
  let k = `<path d="${d}" fill="${HALS}"/>`;
  /* Kopfwendermuskeln und Halsgrube, ganz zart */
  k += `<path d="M140 156 C146 168 152 178 156.5 186 M180 156 C174 168 168 178 163.5 186" stroke="#b8805f" stroke-width="1.6" opacity=".22" fill="none" filter="url(#${S.id("weich1")})"/>`;
  k += `<ellipse cx="160" cy="189" rx="3.4" ry="2" fill="#b07a5a" opacity=".3" filter="url(#${S.id("weich1")})"/>`;
  k += `<path d="M134.6 146 C140 152 148 156.5 152 157.2 C156 158.6 158 159 160 159 C162 159 164 158.6 168 157.2 C172 156.5 180 152 185.4 146" stroke="#8c573e" stroke-width="3" opacity=".35" fill="none" filter="url(#${S.id("weich1")})"/>`;
  k += `<path d="M138 160 L137 168" stroke="#fff" stroke-width="2" opacity=".14" filter="url(#${S.id("weich1")})"/>`;
  S.teil({ id: "hals", de: "der Hals", syl: "HALS", it: "il collo", itSyl: "COL-lo", en: "neck", x: 160, y: 172, kunst: A(160, 172, k) });
}

/* =====================================================================
   2 — HAUTPARTIEN: Stirn, Schläfe, Wange, Kinn, Grübchen
   (zarte Licht-/Rotverläufe auf dem Hautgrund — die Zeichnung selbst
   ist die Trefferfläche)
   ===================================================================== */
{
  const d = `M123.5 60 C121.5 46 136 30 160 27.5 C184 30 198.5 46 196.5 60 C190 64 180 64.6 172 65.6 C166 66.4 164 70 163.6 76 L156.4 76 C156 70 154 66.4 148 65.6 C140 64.6 130 64 123.5 60 Z`;
  let k = `<path d="${d}" fill="${S.rg("stirnlicht", [[0, "#fff1e3", 0.4], [0.7, "#fff1e3", 0.08], [1, "#fff1e3", 0]], 0.45, 0.5, 0.55)}"/>`;
  S.teil({ id: "stirn", de: "die Stirn", syl: "STIRN", it: "la fronte", itSyl: "FRON-te", en: "forehead", x: 160, y: 48, kunst: A(160, 48, k) });
}
{
  const d = `M196.5 56 C200 50 205 48 208.5 53 C210.6 60 210.6 70 210.4 80 C205 80.5 199.5 78.5 196 74 C197.6 68 198 62 196.5 56 Z`;
  const k = SPIEGEL(`<path d="${d}" fill="${S.rg("schlaefe", [[0, "#c98d6c", 0.3], [1, "#c98d6c", 0]], 0.6, 0.5, 0.6)}"/>`);
  S.teil({ id: "schlaefe", de: "die Schläfe", syl: "SCHLÄ-fe", it: "la tempia", itSyl: "TEM-pia", en: "temple", x: 203, y: 66, kunst: A(203, 66, k) });
}
{
  const d = `M168.5 86.5 C178 87.5 196 86 209.6 84 C210 96 208.6 104 206.6 113 C204.6 122 200 129 194 135.5 C189 133 185.5 130.5 182.5 128.5 C178 123 174 119.5 172.8 116 C172.6 110 170.6 98 168.5 86.5 Z`;
  const k = SPIEGEL(`<path d="${d}" fill="${S.rg("wange", [[0, "#e8957f", 0.26], [0.55, "#e8957f", 0.1], [1, "#e8957f", 0]], 0.5, 0.4, 0.55)}"/>`);
  S.teil({ id: "wange", de: "die Wange", syl: "WAN-ge", it: "la guancia", itSyl: "GUAN-cia", en: "cheek", x: 130, y: 108, kunst: A(130, 108, k) });
}
{
  const d = `M146 142.6 C152 145 168 145 174 142.6 C180 144 184 147 181 151 C176 155.4 170 158.4 160 158.8 C150 158.4 144 155.4 139 151 C136 147 140 144 146 141.6 Z`;
  let k = `<path d="${d}" fill="${S.rg("kinn", [[0, "#fbe2cc", 0.6], [0.6, "#f4d0b4", 0.2], [1, "#f4d0b4", 0]], 0.45, 0.55, 0.55)}"/>`;
  S.teil({ id: "kinn", de: "das Kinn", syl: "KINN", it: "il mento", itSyl: "MEN-to", en: "chin", x: 160, y: 151, kunst: A(160, 151, k) });
}
{
  const k = SPIEGEL(`<ellipse cx="187.6" cy="132" rx="3.4" ry="4.8" fill="${S.rg("gruebchen", [[0, "#a8684c", 0.3], [1, "#a8684c", 0]])}"/>`
    + `<path d="M186.4 128.4 C188 130 188.3 132.4 187.4 134.6" stroke="#9a5d43" stroke-width=".7" opacity=".3" filter="url(#${S.id("weich1")})" fill="none" stroke-linecap="round"/>`);
  S.teil({ id: "gruebchen", de: "das Grübchen", syl: "GRÜB-chen", it: "la fossetta", itSyl: "fos-SET-ta", en: "dimple", x: 188, y: 132, kunst: A(188, 132, k),
    tipp: "Grübchen sind kleine Mulden in der Wange. Man sieht sie beim Lächeln." });
}

/* =====================================================================
   3 — DAS HAAR (Mittelscheitel, hinter die Ohren gelegt) und DER SCHEITEL
   ===================================================================== */
{
  const d = sym([160, 0.6], [
    [184, 0.6, 206, 9, 217, 27],
    [224, 40, 225.4, 56, 223.6, 72],
    [222.4, 86, 223.8, 98, 221.4, 110],
    [219, 121, 212, 130, 203, 135.5],
    [197, 138.8, 193, 140.6, 189, 141.5],
    [190.5, 139, 193, 136.5, 196, 133.5],
    [203, 125, 206.5, 114, 208, 104],
    [210, 96, 210.4, 86, 210.4, 76],
    [209.5, 63, 206.5, 49, 200, 39.5],
    [192, 30, 177, 26.5, 160, 26.5],
  ]);
  S.def(`<clipPath id="${S.id("haarclip")}"><path d="${d}"/></clipPath>`);
  let k = `<path d="${d}" fill="${HAAR}"/>`;
  k += `<g clip-path="url(#${S.id("haarclip")})">`;
  /* Strähnen vom Scheitel nach außen und hinten */
  let st = "";
  for (let i = 0; i < 64; i++) {
    const t = i / 63, sx = 160.6, sy = 2 + t * 24;
    const ex = 204 + t * 8 + rnd() * 12, ey = 28 + t * 104 + rnd() * 10;
    const c1x = sx + 22 + rnd() * 10, c1y = sy - 2;
    const f = rnd() < 0.5 ? "#8a5a34" : "#2e190e";
    st += `<path d="M${r(sx)} ${r(sy)} C${r(c1x)} ${r(c1y)} ${r(ex + 4)} ${r(ey - 30)} ${r(ex)} ${r(ey)}" stroke="${f}" stroke-width="${r(0.3 + rnd() * 0.5)}" opacity="${r(0.35 + rnd() * 0.4)}" fill="none"/>`;
  }
  k += SPIEGEL(st);
  /* Glanzband */
  k += SPIEGEL(`<path d="M163 9 C178 8 196 14 207 26" stroke="#c48a58" stroke-width="3.2" opacity=".45" fill="none" filter="url(#${S.id("weich1")})"/><path d="M164 10 C178 9.5 194 14.6 204 24" stroke="#e2b07c" stroke-width=".7" opacity=".55" fill="none"/>`);
  /* Schatten am Haaransatz und hinter dem Ohr */
  k += SPIEGEL(`<path d="M162 27 C178 27 194 31 203 42 C208 50 210 62 210.4 76" stroke="#24130a" stroke-width="2.2" opacity=".35" fill="none" filter="url(#${S.id("weich1")})"/><ellipse cx="216" cy="118" rx="8" ry="12" fill="#1c0f08" opacity=".4" filter="url(#${S.id("weich3")})"/>`);
  k += `</g>`;
  /* weicher Haaransatz: feine Härchen, leicht verschwommen */
  let ans = `<path d="M160 26.5 C177 26.5 192 30 200 39.5 C206.5 49 209.5 63 210.4 76" stroke="#5a3520" stroke-width="1.4" opacity=".45" fill="none" filter="url(#${S.id("weich1")})"/>`;
  for (let i = 0; i < 26; i++) {
    const t = i / 25, [x, y] = bez([160, 26.5], [177, 26.5], [192, 30], [200, 39.5], t * 0.999);
    ans += `<path d="M${r(x)} ${r(y - 1.2)} q${r(0.6 + rnd())} ${r(1.2 + rnd() * 1.4)} ${r(1.4 + rnd() * 1.4)} ${r(2 + rnd() * 1.6)}" stroke="#4a2b18" stroke-width=".22" opacity=".5" fill="none"/>`;
  }
  ans += `<path d="M160 0.6 C184 0.6 206 9 217 27 C224 40 225.4 56 223.6 72" stroke="#6a4026" stroke-width="1.6" opacity=".5" fill="none" filter="url(#${S.id("weich1")})"/>`;
  k += SPIEGEL(ans);
  S.teil({ id: "haar", de: "das Haar", syl: "HAAR", it: "i capelli", itSyl: "ca-PEL-li", en: "hair", x: 196, y: 20, kunst: A(196, 20, k),
    tipp: "Ein Mensch hat etwa 100 000 Haare auf dem Kopf." });
}
{
  let k = `<path d="M158.2 3 L161.8 3 L161.4 27.2 L158.6 27.2 Z" fill="#2a170c" opacity=".3"/>`;
  k += `<path d="M159.75 3.4 L160.25 3.4 L160.5 27 L159.5 27 Z" fill="#d9a080"/>`;
  k += ``;
  S.teil({ id: "scheitel", de: "der Scheitel", syl: "SCHEI-tel", it: "la scriminatura", itSyl: "scri-mi-na-TU-ra", en: "parting", x: 160, y: 15, kunst: A(160, 15, k) });
}

/* =====================================================================
   4 — DIE OHREN: Ohrmuschel und Ohrläppchen (beide Seiten)
   ===================================================================== */
{
  const d = `M209.8 72 C212 66.8 220.5 66.4 223 75 C225 83 224 93.5 220.6 101.5 C219 105 217.2 107.6 215.4 109.6 L208.2 109.6 C209.4 102 210 90 210 80 Z`;
  let e = `<path d="${d}" fill="${OHR}"/>`;
  e += `<path d="M211.5 71.6 C215 69 220.4 70.8 221.2 78 C221.8 86 220 95 217 102" stroke="#b57557" stroke-width=".8" opacity=".7" fill="none"/>`;
  e += `<path d="M212.6 76 C217 78 218 86 216.2 95.6 C215.4 99.6 214 102.6 212 105" stroke="#f6cfb2" stroke-width="1.2" opacity=".8" fill="none"/>`;
  e += `<ellipse cx="213.8" cy="90" rx="2.6" ry="5.6" fill="${S.rg("concha", [[0, "#7d4630"], [1, "#b57658"]])}"/>`;
  e += `<path d="M209.8 87 C212 87.6 212.4 92 210.6 93.6" stroke="#c98c6c" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  e += `<path d="M213 70.6 C216.6 69.4 220.2 71.6 220.8 75" stroke="#fde3cf" stroke-width=".6" opacity=".8" fill="none"/>`;
  S.teil({ id: "ohrmuschel", de: "die Ohrmuschel", syl: "OHR-mu-schel", it: "il padiglione auricolare", itSyl: "pa-di-GLIO-ne au-ri-co-LA-re", en: "outer ear", x: 216, y: 88, kunst: A(216, 88, SPIEGEL(e)),
    tipp: "Die Ohrmuschel fängt den Schall auf und leitet ihn ins Ohr." });
}
{
  const d = `M208 108.8 L215.8 108.8 C214.8 113 213.4 117.4 210.8 119 C208.8 120 207 118.6 206.4 116.6 C207 114 207.5 111.6 208 108.8 Z`;
  let e = `<path d="${d}" fill="${S.rg("laeppchen", [[0, "#efa98e"], [1, "#d58f72"]], 0.4, 0.4, 0.7)}"/>`;
  e += `<path d="M213.6 110.4 C213.2 113.6 212 116.4 210.4 117.6" stroke="#fde0cc" stroke-width=".6" opacity=".7" fill="none"/>`;
  S.teil({ id: "ohrlaeppchen", de: "das Ohrläppchen", syl: "OHR-läpp-chen", it: "il lobo dell'orecchio", itSyl: "LO-bo dell o-REC-chio", en: "earlobe", x: 211, y: 114, kunst: A(211, 114, SPIEGEL(e)) });
}

/* =====================================================================
   5 — DIE AUGEN: Augenlid, Augapfel, Iris, Pupille, Wimpern, Augenbraue
   ===================================================================== */
const OBEN = [[169.5, 80.8], [172.5, 76.6], [183, 74.6], [190.5, 79.2]];   /* Lidrand oben */
const AUGE = `M169.5 80.8 C172.5 76.6 183 74.6 190.5 79.2 C186 83.8 175 84.6 169.5 80.8 Z`;
S.def(`<clipPath id="${S.id("augeclip")}"><path d="${AUGE}"/><path d="${AUGE}" transform="matrix(-1 0 0 1 ${MX} 0)"/></clipPath>`);
{
  let e = `<path d="M166.5 77 C167 72.5 172 70.6 178 69.8 C186 68.8 193 70 197 72.5 C196 75.5 194 77.6 190.5 79.2 C183 74.6 172.5 76.6 169.5 80.8 Z" fill="${S.lg("lid", [[0, "#e7b799"], [0.7, "#dba486"], [1, "#c98d70"]])}"/>`;
  e += `<path d="M167.8 79.4 C171 73 185 71.2 192.4 77.4" stroke="#a5684d" stroke-width=".7" opacity=".7" fill="none"/>`;
  e += `<path d="M172 72.2 C178 70.6 186 70.6 192 72.6" stroke="#fff3e8" stroke-width="1.2" opacity=".35" fill="none" filter="url(#${S.id("weich1")})"/>`;
  /* Unterlid */
  e += `<path d="M190.5 79.2 C186 83.8 175 84.6 169.5 80.8 L169 82 C175 87 187 86.4 192.2 80 Z" fill="${S.lg("unterlid", [[0, "#d9a184"], [1, "#e6b496"]])}"/>`;
  e += `<path d="M171 84.6 C177 87 185 86.6 190 83" stroke="#b7795c" stroke-width=".5" opacity=".4" fill="none"/>`;
  S.teil({ id: "augenlid", de: "das Augenlid", syl: "AU-gen-lid", it: "la palpebra", itSyl: "PAL-pe-bra", en: "eyelid", x: 181, y: 76, kunst: A(181, 76, SPIEGEL(e)) });
}
{
  let e = `<path d="${AUGE}" fill="${S.rg("lederhaut", [[0, "#ffffff"], [0.7, "#f3efea"], [1, "#d9cbc2"]], 0.5, 0.6, 0.6)}"/>`;
  e += `<ellipse cx="171.2" cy="80.8" rx="1.5" ry="1.1" fill="#e19a92"/>`;
  e += `<path d="M171 79.8 C176 76.6 184 76 189.6 79.4" stroke="#9c7f74" stroke-width="1.2" opacity=".35" fill="none"/>`;
  S.teil({ id: "auge_d", de: "der Augapfel", syl: "AUG-ap-fel", it: "il bulbo oculare", itSyl: "BUL-bo o-cu-LA-re", en: "eyeball", x: 180, y: 80, kunst: A(180, 80, SPIEGEL(e)) });
}
{
  let e = `<g clip-path="url(#${S.id("augeclip")})">`;
  const iris = (cx) => {
    let g = `<circle cx="${cx}" cy="79.6" r="4.7" fill="${S.rg("iris", [[0, "#6f8f4a"], [0.45, "#5d7d3c"], [0.8, "#4a5f30"], [1, "#2b3520"]])}"/>`;
    for (let i = 0; i < 20; i++) {
      const a = i / 20 * Math.PI * 2;
      g += `<line x1="${r(cx + Math.cos(a) * 2.3)}" y1="${r(79.6 + Math.sin(a) * 2.3)}" x2="${r(cx + Math.cos(a) * 4.4)}" y2="${r(79.6 + Math.sin(a) * 4.4)}" stroke="${i % 2 ? "#a3b36a" : "#3a4a26"}" stroke-width=".25" opacity=".7"/>`;
    }
    g += `<circle cx="${cx}" cy="79.6" r="2.8" fill="none" stroke="#b59a4c" stroke-width=".5" opacity=".6"/>`;
    g += `<circle cx="${cx}" cy="79.6" r="4.6" fill="none" stroke="#1e2616" stroke-width=".35"/>`;
    return g;
  };
  e += iris(180) + iris(140);
  /* Schatten des Oberlids auf dem Auge */
  e += `<path d="M168 79 C172.5 74.6 183 72.6 192 78 L192 80.2 C183 75.6 172.5 77.6 168 81.8 Z" fill="#4a2a20" opacity=".25"/>`;
  e += `<path d="M152 79 C147.5 74.6 137 72.6 128 78 L128 80.2 C137 75.6 147.5 77.6 152 81.8 Z" fill="#4a2a20" opacity=".25"/>`;
  e += `</g>`;
  S.teil({ id: "iris", de: "die Iris", syl: "I-ris", it: "l'iride", itSyl: "I-ri-de", en: "iris", x: 140, y: 80, kunst: A(140, 80, e),
    tipp: "Die Iris gibt dem Auge seine Farbe: braun, grün, blau oder grau." });
}
{
  let e = "";
  for (const cx of [180, 140]) {
    e += `<circle cx="${cx}" cy="79.6" r="2.15" fill="${S.rg("pupille", [[0, "#0a0a0a"], [1, "#151515"]])}"/>`;
    e += `<circle cx="${cx - 1.6}" cy="78.1" r=".95" fill="#fff" opacity=".95"/><circle cx="${cx + 1.4}" cy="80.9" r=".35" fill="#fff" opacity=".6"/>`;
  }
  S.teil({ id: "pupille", de: "die Pupille", syl: "Pu-PIL-le", it: "la pupilla", itSyl: "pu-PIL-la", en: "pupil", x: 180, y: 80, kunst: A(180, 80, e),
    tipp: "Bei hellem Licht wird die Pupille klein, im Dunkeln wird sie groß." });
}
{
  let e = `<path d="M169.5 80.8 C172.5 76.6 183 74.6 190.5 79.2" stroke="#24150e" stroke-width="1.25" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 15; i++) {
    const t = 0.12 + i * 0.06, [x, y] = bez(...OBEN, t);
    const aussen = 0.35 + t * 1.1, len = 1.6 + t * 1.8;
    e += `<path d="M${r(x)} ${r(y)} q${r(aussen * 0.6)} ${r(-len * 0.7)} ${r(aussen * 1.6)} ${r(-len)}" stroke="#24150e" stroke-width=".42" fill="none" stroke-linecap="round"/>`;
  }
  /* untere Wimpern, zart */
  e += `<path d="M172 82.6 C177 84.6 184 84.2 189.4 80.4" stroke="#5a3a2c" stroke-width=".5" opacity=".7" fill="none"/>`;
  for (let i = 0; i < 6; i++) { const x = 176 + i * 2.4, y = 83.6 - i * 0.4 - (i > 3 ? (i - 3) * 0.7 : 0); e += `<path d="M${r(x)} ${r(y)} l${r(0.3 + i * 0.15)} 1.1" stroke="#5a3a2c" stroke-width=".3" opacity=".7"/>`; }
  S.teil({ id: "wimper", de: "die Wimpern", syl: "WIM-pern", it: "le ciglia", itSyl: "CI-glia", en: "eyelashes", x: 140, y: 76, kunst: A(140, 76, SPIEGEL(e)),
    tipp: "Die Wimpern halten Staub und kleine Teilchen von den Augen fern." });
}
{
  let e = `<path d="M167 71.2 C171 67.6 178 65.2 186 64.8 C191 64.8 195 66.6 198.4 69.8 C194 68.4 190 67.8 186 68 C179 68.4 173 70.2 168.4 72.8 Z" fill="${S.lg("braue", [[0, "#4a2c1a"], [1, "#6b4428"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 22; i++) {
    const t = i / 21, x = 168 + t * 29, y = 71.6 - Math.sin(t * Math.PI * 0.8) * 5.4 + t * 1.6;
    e += `<path d="M${r(x)} ${r(y + 0.8)} l${r(1.6 + t)} ${r(-1.2 + t * 0.9)}" stroke="${i % 3 ? "#2e1a0e" : "#7a5032"}" stroke-width=".35" fill="none"/>`;
  }
  S.teil({ id: "augenbraue", de: "die Augenbraue", syl: "AU-gen-brau-e", it: "il sopracciglio", itSyl: "so-pra-CCI-glio", en: "eyebrow", x: 182, y: 68, kunst: A(182, 68, SPIEGEL(e)),
    tipp: "Die Augenbrauen leiten Schweiß von den Augen weg." });
}

/* =====================================================================
   6 — DIE NASE: Nasenrücken, Nasenflügel, Nasenspitze, Nasenloch
   ===================================================================== */
{
  let k = `<path d="M160 71 C156.8 76 156 88 154.6 106 L165.4 106 C164 88 163.2 76 160 71 Z" fill="${S.lg("ruecken", [[0, "#f1c9aa", 0], [0.32, "#fbe4d0", 0.5], [0.5, "#f3d1b6", 0.3], [0.78, "#c88d6d", 0.4], [1, "#c88d6d", 0]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M159.2 80 C159 90 158.8 98 158.4 104" stroke="#fff6ee" stroke-width="1.1" opacity=".55" fill="none" stroke-linecap="round" filter="url(#${S.id("weich1")})"/>`;
  S.teil({ id: "nasenruecken", de: "der Nasenrücken", syl: "NA-sen-rü-cken", it: "il dorso del naso", itSyl: "DOR-so del NA-so", en: "bridge of the nose", x: 160, y: 92, kunst: A(160, 92, k) });
}
{
  const fl = `M164.6 110 C168 106.6 172.6 108 172.6 112 C172.6 115 169.6 116.4 166.6 115.6 C165.6 113.6 164.9 112 164.6 110 Z`;
  let e = `<path d="${fl}" fill="${S.rg("fluegel", [[0, "#efc3a2"], [0.7, "#e2ac8c"], [1, "#c98c6c"]], 0.4, 0.35, 0.7)}"/>`;
  e += `<path d="M166.2 107.8 C171.4 106.4 174 111 171.8 114.6" stroke="#9e604a" stroke-width=".6" opacity=".55" fill="none"/>`;
  S.teil({ id: "nasenfluegel", de: "der Nasenflügel", syl: "NA-sen-flü-gel", it: "l'ala del naso", itSyl: "A-la del NA-so", en: "side of the nose", x: 169, y: 112, kunst: A(169, 112, SPIEGEL(e)) });
}
{
  let k = `<ellipse cx="160" cy="109" rx="6" ry="4.8" fill="${S.rg("spitze", [[0, "#fde8d8"], [0.45, "#f1c8a8"], [1, "#e4b090"]], 0.42, 0.36, 0.62)}"/>`;
  k += `<ellipse cx="158.4" cy="107.4" rx="1.6" ry="1.1" fill="#fff" opacity=".45" filter="url(#${S.id("weich1")})"/>`;
  k += `<path d="M156 113.2 Q160 114.6 164 113.2" stroke="#b37457" stroke-width=".5" opacity=".5" fill="none"/>`;
  S.teil({ id: "nasenspitze", de: "die Nasenspitze", syl: "NA-sen-spit-ze", it: "la punta del naso", itSyl: "PUN-ta del NA-so", en: "tip of the nose", x: 160, y: 109, kunst: A(160, 109, k) });
}
{
  const e = `<path d="M162.2 115.6 C162.6 114 165 113.4 167 114 C167.8 114.6 167.4 115.8 166 116.2 C164.6 116.6 162.8 116.6 162.2 115.6 Z" fill="${S.rg("loch", [[0, "#4a2418"], [0.7, "#7a4433"], [1, "#a8664c"]], 0.45, 0.4, 0.6)}"/>`;
  S.teil({ id: "nasenloch", de: "das Nasenloch", syl: "NA-sen-loch", it: "la narice", itSyl: "na-RI-ce", en: "nostril", x: 160, y: 115, kunst: A(160, 115, SPIEGEL(e)) });
}

/* =====================================================================
   7 — DER MUND: Mund, Zunge, Zahnfleisch, Zahn, Oberlippe, Unterlippe
   ===================================================================== */
const MUND = `M140.6 128.7 C147 127.4 154 127 160 127.6 C166 127 173 127.4 179.4 128.7 C173 135.2 166 136.6 160 136.6 C154 136.6 147 135.2 140.6 128.7 Z`;
S.def(`<clipPath id="${S.id("mundclip")}"><path d="${MUND}"/></clipPath>`);
{
  const k = `<path d="${MUND}" fill="${S.rg("mundhoehle", [[0, "#5a1f22"], [1, "#2a0c0e"]], 0.5, 0.3, 0.7)}"/>`;
  S.teil({ id: "mund", de: "der Mund", syl: "MUND", it: "la bocca", itSyl: "BOC-ca", en: "mouth", x: 160, y: 131, kunst: A(160, 131, k) });
}
{
  let k = `<g clip-path="url(#${S.id("mundclip")})"><ellipse cx="160" cy="138" rx="15" ry="4.2" fill="${S.rg("zunge", [[0, "#e9898a"], [0.7, "#d06a6e"], [1, "#a8484f"]], 0.5, 0.3, 0.7)}"/>`;
  k += `<path d="M160 134.6 L160 136.6" stroke="#a84c52" stroke-width=".4" opacity=".6"/><ellipse cx="155" cy="135" rx="3" ry=".6" fill="#fff" opacity=".25"/></g>`;
  S.teil({ id: "zunge", de: "die Zunge", syl: "ZUN-ge", it: "la lingua", itSyl: "LIN-gua", en: "tongue", x: 160, y: 134, kunst: A(160, 134, k) });
}
{
  const k = `<g clip-path="url(#${S.id("mundclip")})"><path d="M140 127.6 C147 126.4 154 126 160 126.6 C166 126 173 126.4 180 127.6 L180 130.4 C173 129.8 166 129.6 160 130.2 C154 129.6 147 129.8 140 130.4 Z" fill="${S.lg("gaumen", [[0, "#c9636a"], [1, "#e58c8f"]])}"/></g>`;
  S.teil({ id: "zahnfleisch", de: "das Zahnfleisch", syl: "ZAHN-fleisch", it: "la gengiva", itSyl: "gen-GI-va", en: "gums", x: 160, y: 128, kunst: A(160, 128, k) });
}
{
  let k = `<g clip-path="url(#${S.id("mundclip")})">`;
  const zaehne = [[157.45, 5, 133.4], [152.9, 4, 133], [149.1, 3.6, 132.9], [145.6, 3.2, 132.4]];
  const ZF = S.lg("zahn", [[0, "#f2ece0"], [0.6, "#fdfbf6"], [1, "#e6ddcc"]]);
  for (const s of [1, -1]) {
    zaehne.forEach(([x0, w, unten], i) => {
      const cx = s > 0 ? x0 : MX - x0, x = cx - w / 2, oben = 128.7 + i * 0.15;
      const spitze = i === 2 ? ` L${r(cx + 0.3)} ${r(unten + 0.4)}` : "";
      k += `<path d="M${r(x + 0.15)} ${r(oben + 1.1)} Q${r(x + 0.15)} ${r(oben)} ${r(cx)} ${r(oben)} Q${r(x + w - 0.15)} ${r(oben)} ${r(x + w - 0.15)} ${r(oben + 1.1)} L${r(x + w - 0.3)} ${r(unten - 0.4)} Q${r(cx + w / 2 - 0.4)} ${r(unten)} ${r(cx)} ${r(unten)}${spitze} Q${r(x + 0.5)} ${r(unten)} ${r(x + 0.3)} ${r(unten - 0.4)} Z" fill="${ZF}" stroke="#c9bca6" stroke-width=".18"/>`;
      if (i > 1) k += `<path d="M${r(x)} ${r(oben)} h${w} V${unten} h${-w} Z" fill="#3a1a14" opacity="${r(0.12 * (i - 1))}"/>`;
    });
  }
  k += `<path d="M150 129.6 Q152 129.2 154 129.6 M166 129.6 Q168 129.2 170 129.6" stroke="#fff" stroke-width=".5" opacity=".6" fill="none"/>`;
  k += `</g>`;
  S.teil({ id: "zahn", de: "der Zahn", syl: "ZAHN", it: "il dente", itSyl: "DEN-te", en: "tooth", x: 160, y: 130.5, kunst: A(160, 130.5, k),
    tipp: "Ein Erwachsener hat 32 Zähne, ein Kind 20 Milchzähne." });
}
{
  let k = `<path d="M156.6 116.8 L155.2 123.4 L164.8 123.4 L163.4 116.8 Z" fill="${S.lg("philtrum", [[0, "#c88d6d", 0], [0.2, "#c88d6d", 0.25], [0.5, "#f6d8c0", 0.4], [0.8, "#c88d6d", 0.25], [1, "#c88d6d", 0]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M140 128.6 C145 125 151 122.6 155.6 123.2 C157.6 123.5 158.8 124.4 160 124.6 C161.2 124.4 162.4 123.5 164.4 123.2 C169 122.6 175 125 180 128.6 C173 127.4 166 127 160 127.6 C154 127 147 127.4 140 128.6 Z" fill="${S.lg("oberlippe", [[0, "#c5716b"], [1, "#a8504f"]])}"/>`;
  k += `<path d="M144 126.2 C150 123.6 155 123.6 157.6 124.4 M162.4 124.4 C165 123.6 170 123.6 176 126.2" stroke="#e8a59a" stroke-width=".4" opacity=".7" fill="none"/>`;
  S.teil({ id: "oberlippe", de: "die Oberlippe", syl: "O-ber-lip-pe", it: "il labbro superiore", itSyl: "LAB-bro su-pe-RIO-re", en: "upper lip", x: 160, y: 125, kunst: A(160, 125, k) });
}
{
  let k = `<path d="M140.6 128.9 C147 135.4 154 136.8 160 136.8 C166 136.8 173 135.4 179.4 128.9 C176 136.4 169 141.4 160 141.6 C151 141.4 144 136.4 140.6 128.9 Z" fill="${S.lg("unterlippe", [[0, "#c46a66"], [0.4, "#d5847b"], [1, "#b8605d"]])}"/>`;
  k += `<ellipse cx="157" cy="138.8" rx="5.4" ry="1.1" fill="#fff" opacity=".28" filter="url(#${S.id("weich1")})"/>`;
  for (const x of [151, 155, 165, 169]) k += `<path d="M${x} ${137.2} l${(x - 160) * 0.04} 2.6" stroke="#a6524f" stroke-width=".22" opacity=".5"/>`;
  S.teil({ id: "unterlippe", de: "die Unterlippe", syl: "UN-ter-lip-pe", it: "il labbro inferiore", itSyl: "LAB-bro in-fe-RIO-re", en: "lower lip", x: 160, y: 138, kunst: A(160, 138, k) });
}

/* =====================================================================
   8 — DER KRAGEN (offenes Hemd, Kragenspitzen liegen auf)
   ===================================================================== */
{
  let e = `<path d="M185.4 149 C191.6 151 197 155.6 200.2 162.4 L197.4 168 C193 163.6 189.4 161.4 185.6 160.6 Z" fill="${S.lg("steg", [[0, "#8ea4c0"], [1, "#b4c6dc"]])}"/>`;
  e += `<path d="M200.2 162.4 C198 172.6 190.6 185 180.6 195.4 C177.8 189.2 175.6 182.4 174.8 176.6 C179.6 172.4 183.6 167.4 185.6 160.6 C190 161.6 196.6 160.6 200.2 162.4 Z" fill="${S.lg("kragen", [[0, "#dfe9f4"], [0.7, "#c5d5e8"], [1, "#a9bdd6"]], 0, 0, 1, 1)}"/>`;
  e += `<path d="M198.4 164.6 C196.4 173.6 189.6 184.6 181.2 193.2" stroke="#8aa0bd" stroke-width=".3" stroke-dasharray=".9 .6" fill="none"/>`;
  e += `<path d="M180.6 195.4 C186 196.4 192 193 197 188" stroke="#7088a8" stroke-width="1.6" opacity=".25" fill="none" filter="url(#${S.id("weich1")})"/>`;
  S.teil({ id: "kragen", de: "der Kragen", syl: "KRA-gen", it: "il colletto", itSyl: "col-LET-to", en: "collar", x: 188, y: 176, kunst: A(188, 176, SPIEGEL(e)) });
}

/* Licht von links oben über allem (fängt keinen Tipp ab) */
S.davor(`<rect width="320" height="200" fill="${S.lg("licht", [[0, "#fff8ee", 0.1], [0.5, "#fff8ee", 0], [1, "#1a1008", 0.08]], 0, 0, 1, 0.3)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kopf_detail.js"));
console.log(aus);
