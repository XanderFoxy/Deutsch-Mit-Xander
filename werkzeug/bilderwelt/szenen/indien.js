#!/usr/bin/env node
/* =====================================================================
   INDIEN – DER TAJ MAHAL (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   RECHERCHE (Archnet „Taj Mahal Complex“, Bluffton Univ. „Taj Mahal
   complex“, Univ. Notre Dame „Great Gate – raking view“, PBS „The Story
   of India – Taj Mahal“, Strukturdaten bei structurae, Wikipedia-Spiegel
   „Taj Mahal“):
   - STANDORT: Agra, kurz nach Sonnenaufgang. Wir stehen auf der Terrasse
     des HAUPTTORS (Darwaza-i Rauza, roter Sandstein mit weißem Marmor,
     rund 30 m hoch, oben 2 × 11 Kuppelpavillons; um seine Bögen läuft die
     Inschrift „O Seele, die du in Frieden bist, kehre zurück zu deinem
     Herrn …“). Das Tor liegt in unserem Rücken — von hier, aus seinem
     Bogen, sieht jeder Besucher den Taj zum ersten Mal: der berühmteste
     Blick, genau nach NORDEN über den Garten.
   - DER GARTEN (Charbagh, rund 300 × 300 m): vier Viertel, getrennt von
     Wasserkanälen und erhöhten Wegen aus rotem Sandstein. Auf unserer
     Achse der lange Kanal mit einer Reihe Springbrunnen, gesäumt von
     Zypressen (Sinnbild der Ewigkeit) und Rasen; in der Mitte das
     erhöhte Marmorbecken (al-Hawd al-Kawthar, „Lotusbecken“) mit den
     Lotus-Düsen. Im stillen Wasser spiegelt sich der Taj.
   - DAS MAUSOLEUM (1632–1653, Shah Jahan für Mumtaz Mahal): weißer
     Makrana-Marmor auf einem 6 m hohen, 95,5 m breiten Sockel (davor die
     rote Sandsteinterrasse). Der Bau ist 55 m breit, quadratisch mit
     abgeschrägten Ecken; jede Seite hat ein 33 m hohes Portal (Pishtaq)
     mit spitzem Bogen, rechts und links je zwei übereinanderliegende
     Bogennischen. Die Zwiebelkuppel (23 m) sitzt auf einem 12 m hohen
     Tambour, oben Lotusblätter und die 9,6 m hohe Bekrönung mit
     Halbmond; insgesamt 73 m. Um die Kuppel vier kleine Kuppelpavillons
     (Chattris). Um die Portale laufen Schriftbänder aus schwarzem Marmor
     (Koranverse; die Buchstaben werden nach oben größer, damit sie von
     unten gleich groß wirken), in den Zwickeln Pietra-dura-Blumen aus
     Halbedelsteinen.
   - VIER MINARETTE an den Ecken des Sockels, je gut 40 m, durch zwei
     Balkone in drei gleiche Teile geteilt, oben ein Pavillon; schwarze
     Fugenlinien auf weißem Marmor. (Von vorn sieht man die hinteren zwei
     zwischen Bau und vorderen Minaretten.)
   - LINKS (Westen) die MOSCHEE, rechts (Osten) ihr Spiegelbild, das
     Gästehaus (Jawab, „Antwort“) — beide roter Sandstein mit weißen
     Marmorkuppeln und achteckigen Ecktürmen. Von Süden sieht man ihre
     Schmalseite, die drei Kuppeln stehen hintereinander. (Leicht zur
     Mitte gerückt, damit beide ganz ins Bild passen.)
   - TYPISCHES: Im Gelände sind Essen und Fahrzeuge verboten — Indien
     sieht man an den Besuchern und Tieren: eine Frau im Sari (4–8 m
     Stoff, über die Schulter gelegt), ein Fotograf (in Agra eigener
     Beruf), der Pfau (Nationalvogel; er lebt in den Gärten), ein
     Palmenhörnchen mit drei Streifen, Halsbandsittiche.
   Maßstab: Augenhöhe 3,1 m über dem Garten (Torterrasse 1,5 m hoch),
   Horizont y = 133, Brennweite 570: Punkt in d Metern, h Metern Höhe und
   s Metern seitlich: y = 133 + (3,1 − h)·570/d, x = 200 + s·570/d.
   Der Taj steht 300–395 m weit (1,9–1,45 Einheiten je Meter).
   Licht: Morgensonne von rechts (Osten), lange Schatten nach links.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "indien", titel: "Indien – der Taj Mahal", emoji: "🕌", thema: "Länder", kuerzel: "ind", fassung: 854, breite: 400, hoehe: 260 });
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
{ const teil = S.teil; S.teil = (t) => { if (t.anker) { const [ax, ay] = t.anker; t.kunst = `<g transform="translate(${B.r(t.x - ax)} ${B.r(t.y - ay)})">${t.kunst}</g>`; t.x = ax; t.y = ay; delete t.anker; } return teil(t); }; }
const rnd = zufall(1653);
const r = B.r;
const HOR = 133, E = 3.1, F = 570, CX = 200;
const yAt = (d, h = 0) => HOR + (E - h) * F / d;
const uAt = (d) => F / d;
const xAt = (s, d) => CX + s * F / d;
const P0 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r(x) + " " + r(y)).join(" ") + " Z";
/* Vielecke am Bildrand abschneiden (0 ≤ x ≤ 400, y ≤ 260), damit kein Teil aus dem Bild ragt */
const kappe = (poly, innen, kreuz) => { const out = []; poly.forEach((a, i) => { const b = poly[(i + 1) % poly.length]; if (innen(a)) { out.push(a); if (!innen(b)) out.push(kreuz(a, b)); } else if (innen(b)) out.push(kreuz(a, b)); }); return out; };
const P = (pts) => {
  let q = kappe(pts, (a) => a[0] >= 0, (a, b) => [0, a[1] + (b[1] - a[1]) * (0 - a[0]) / (b[0] - a[0])]);
  q = kappe(q, (a) => a[0] <= 400, (a, b) => [400, a[1] + (b[1] - a[1]) * (400 - a[0]) / (b[0] - a[0])]);
  q = kappe(q, (a) => a[1] <= 260, (a, b) => [a[0] + (b[0] - a[0]) * (260 - a[1]) / (b[1] - a[1]), 260]);
  return q.length ? P0(q) : "";
};
/* Spiegelachse: Wasser 0,3 m unter den Wegen; für den Taj (u ≈ 1,78): y' = 2·133 + (2·3,1 + 0,6)·1,78 − y */
const SPIEGEL = r(2 * HOR + (2 * E + 0.6) * 1.78);

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("weich2")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>`);
S.def(`<filter id="${S.id("spiegelweich")}" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".35 .6"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>`);
const MARMOR = S.lg("marmor", [[0, "#f3ece6"], [0.55, "#fbf6ef"], [1, "#fff4e2"]], 0, 0, 1, 0);      /* Licht von rechts */
const MARMOR_S = S.lg("marmors", [[0, "#cfc8cc"], [1, "#e2dcdc"]], 0, 0, 1, 0);                       /* Schattenseite */
const NISCHE = S.lg("nische", [[0, "#b7aeb4"], [0.6, "#cfc6c8"], [1, "#e6ddd8"]]);
const SANDSTEIN = S.lg("sandstein", [[0, "#b8563a"], [1, "#94402a"]]);
const ZYPRESSE = S.lg("zypresse", [[0, "#1f3a26"], [0.55, "#2e5233"], [1, "#4a7444"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#f4e2a0"], [0.5, "#c9a24a"], [1, "#8a6a22"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Morgenhimmel, Dunst über dem Fluss
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 12}" fill="${S.lg("himmel", [[0, "#7fa6cf"], [0.45, "#b5cbe0"], [0.8, "#ecdccc"], [1, "#f6d9bf"]])}"/>`);
S.hinten(`<ellipse cx="420" cy="${HOR - 6}" rx="190" ry="70" fill="${S.rg("morgenrot", [[0, "#ffd6a6", 0.75], [1, "#ffd6a6", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[90, 26, 1.2], [300, 18, 0.9], [360, 58, 0.7]]) {
    w += `<g filter="url(#${S.id("weich2")})" opacity=".55">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 22, 3], [-14, 1.6, 12, 2.4], [15, 1, 14, 2.6]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff4ea"/>`;
    w += `</g>`;
  }
  S.hinten(w);
}

/* =====================================================================
   DER TAJ — als wiederverwendbare Gruppen (Bild und Spiegelbild)
   ===================================================================== */
const T = { dS: 300, dB: 320, dK: 347.75, h0: 7.0 };
const uB = uAt(T.dB), uK = uAt(T.dK);
const yB = (h) => yAt(T.dB, h), xB = (s) => xAt(s, T.dB);
const yK = (h) => yAt(T.dK, h), xK = (s) => xAt(s, T.dK);

/* ---------- Sockel (weißer Marmor) auf der roten Sandsteinterrasse ---------- */
let sockel = "";
{
  const d = T.dS, u = uAt(d), xl = xAt(-47.75, d), xr = xAt(47.75, d), yo = yAt(d, T.h0), yu = yAt(d, 1.2);
  /* rote Terrasse (über die ganze Breite des Flussufers) */
  sockel += `<rect x="0" y="${r(yAt(292, 1.2))}" width="400" height="${r(yAt(292, 0) - yAt(292, 1.2))}" fill="${SANDSTEIN}"/>`;
  for (let x = 2; x < 400; x += 6.4) sockel += `<rect x="${r(x)}" y="${r(yAt(292, 1.0))}" width="3.6" height="${r(yAt(292, 0.25) - yAt(292, 1.0))}" fill="#7a3220" opacity=".5"/>`;
  sockel += `<rect x="0" y="${r(yAt(292, 1.2) - 0.4)}" width="400" height=".6" fill="#f2e6dc"/>`;
  /* der Sockel mit Blendarkaden */
  sockel += `<rect x="${r(xl)}" y="${r(yo)}" width="${r(xr - xl)}" height="${r(yu - yo)}" fill="${MARMOR}"/>`;
  const n = 22, w = (xr - xl) / n;
  for (let i = 0; i < n; i++) {
    const a = xl + i * w + w * 0.18, b = xl + (i + 1) * w - w * 0.18, top = yo + 2.4;
    sockel += `<path d="M${r(a)} ${r(yu - 0.8)} L${r(a)} ${r(top + 2.2)} Q${r((a + b) / 2)} ${r(top)} ${r(b)} ${r(top + 2.2)} L${r(b)} ${r(yu - 0.8)} Z" fill="${NISCHE}"/>`;
  }
  sockel += `<rect x="${r(xl)}" y="${r(yo)}" width="${r(xr - xl)}" height=".9" fill="#fffaf2"/><rect x="${r(xl)}" y="${r(yo + 1.5)}" width="${r(xr - xl)}" height=".25" fill="#8d8486"/>`;
  /* Treppenhaus in der Mitte (die Treppe führt verdeckt nach oben) */
  sockel += `<rect x="${r(CX - 4.6)}" y="${r(yo + 1.8)}" width="9.2" height="${r(yu - yo - 2.6)}" fill="#e9e1dc"/><path d="M${r(CX - 2.6)} ${r(yu - 0.8)} L${r(CX - 2.6)} ${r(yo + 5)} Q${CX} ${r(yo + 3)} ${r(CX + 2.6)} ${r(yo + 5)} L${r(CX + 2.6)} ${r(yu - 0.8)} Z" fill="#8a7f86"/>`;
}
S.def(`<g id="${S.id("sockelbild")}">${sockel}</g>`);

/* ---------- das Mausoleum: Fassade, Portal, Nischen, Pavillons, Kuppel ---------- */
let bau = "", kuppel = "", pavH = "", pavV = "";
const portal = { s: 10.5, bogen: 6.6, hTop: 40, hBogen: 30.5, hKampfer: 19 };
{
  const h0 = T.h0, hP = 37;                        /* Brüstung 30 m über dem Sockel */
  const f = (s) => xB(s);
  /* abgeschrägte Ecken: Fläche von ±19,5 m (d 320) bis ±27,5 m (d 328) */
  for (const sd of [-1, 1]) {
    const xa = f(sd * 19.5), xb = xAt(sd * 27.5, 328), ya = yB(hP), yb = yAt(328, hP), ya0 = yB(h0), yb0 = yAt(328, h0);
    bau += `<path d="M${r(xa)} ${r(ya0)} L${r(xa)} ${r(ya)} L${r(xb)} ${r(yb)} L${r(xb)} ${r(yb0)} Z" fill="${sd > 0 ? "#fff1dc" : "#cbc3c8"}"/>`;
    /* zwei Nischen übereinander (verkürzt) */
    for (const [hu, ho] of [[h0 + 1.2, h0 + 13.2], [h0 + 15, h0 + 26.6]]) {
      const m = (t, h) => [xa + (xb - xa) * t, yB(h) + (yAt(328, h) - yB(h)) * t];
      const [p1x, p1y] = m(0.18, hu), [p2x, p2y] = m(0.82, hu), [p3x, p3y] = m(0.82, ho - 3), [p4x, p4y] = m(0.18, ho - 3), [pkx, pky] = m(0.5, ho);
      bau += `<path d="M${r(p1x)} ${r(p1y)} L${r(p4x)} ${r(p4y)} Q${r(pkx)} ${r(pky - 0.6)} ${r(p3x)} ${r(p3y)} L${r(p2x)} ${r(p2y)} Z" fill="${sd > 0 ? "#d9cdc6" : "#a99fa6"}"/>`;
    }
  }
  /* Hauptseite zwischen den Schrägen */
  bau += `<rect x="${r(f(-19.5))}" y="${r(yB(hP))}" width="${r(f(19.5) - f(-19.5))}" height="${r(yB(h0) - yB(hP))}" fill="${MARMOR}"/>`;
  /* Seitenfelder: je zwei Bogennischen übereinander, jede in einem Rahmen */
  for (const sd of [-1, 1]) {
    const a = f(sd * 11.4), b = f(sd * 18.6), xa = Math.min(a, b), xbb = Math.max(a, b);
    for (const [hu, ho] of [[h0 + 1.2, h0 + 13.6], [h0 + 15.2, h0 + 27]]) {
      const yo = yB(ho), yu = yB(hu), m = (xa + xbb) / 2, w = (xbb - xa) / 2 - 1.6;
      bau += `<rect x="${r(xa + 0.5)}" y="${r(yo)}" width="${r(xbb - xa - 1)}" height="${r(yu - yo)}" fill="none" stroke="#b5aaa8" stroke-width=".35"/>`;
      bau += `<path d="M${r(m - w)} ${r(yu)} L${r(m - w)} ${r(yo + w * 1.1 + 1)} Q${r(m - w)} ${r(yo + 1.2)} ${r(m)} ${r(yo + 1)} Q${r(m + w)} ${r(yo + 1.2)} ${r(m + w)} ${r(yo + w * 1.1 + 1)} L${r(m + w)} ${r(yu)} Z" fill="${NISCHE}"/>`;
      bau += `<path d="M${r(m - w * 0.45)} ${r(yu)} L${r(m - w * 0.45)} ${r(yu - (yu - yo) * 0.42)} Q${r(m)} ${r(yu - (yu - yo) * 0.55)} ${r(m + w * 0.45)} ${r(yu - (yu - yo) * 0.42)} L${r(m + w * 0.45)} ${r(yu)} Z" fill="#8e8389" opacity=".75"/>`;
      /* Zwickel mit Blumen */
      for (const zx of [m - w + 0.6, m + w - 0.6]) bau += `<circle cx="${r(zx)}" cy="${r(yo + 1.2)}" r=".35" fill="#b04a4a"/><circle cx="${r(zx)}" cy="${r(yo + 1.9)}" r=".22" fill="#3f7a4a"/>`;
    }
  }
  /* Brüstung mit Fries und kleinen Zinnen */
  bau += `<rect x="${r(f(-19.5))}" y="${r(yB(hP) - 0.2)}" width="${r(f(19.5) - f(-19.5))}" height="1.4" fill="#efe5dc"/>`;
  for (let s = -19; s <= 19; s += 1.25) bau += `<rect x="${r(f(s) - 0.3)}" y="${r(yB(hP) - 1.1)}" width=".6" height=".9" fill="#f6eee4"/>`;
  bau += `<line x1="${r(f(-19.5))}" y1="${r(yB(hP) + 0.6)}" x2="${r(f(19.5))}" y2="${r(yB(hP) + 0.6)}" stroke="#4a4244" stroke-width=".22" stroke-dasharray=".5 .35"/>`;
  /* Sockelfries (Blumenrelief) unten */
  bau += `<rect x="${r(f(-19.5))}" y="${r(yB(h0 + 1.4))}" width="${r(f(19.5) - f(-19.5))}" height="${r(yB(h0) - yB(h0 + 1.4))}" fill="#e7ded8"/>`;
  for (let s = -19; s <= 19; s += 1.6) bau += `<path d="M${r(f(s))} ${r(yB(h0 + 0.3))} q.3 -1 .6 0" stroke="#b9aeac" stroke-width=".2" fill="none"/>`;
  /* ---- das große Portal (Pishtaq) mit Schriftband und Pietra dura ---- */
  const xl = f(-portal.s), xr = f(portal.s), yT = yB(h0 + 33), yU = yB(h0), bw = portal.bogen * uB;
  bau += `<rect x="${r(xl)}" y="${r(yT)}" width="${r(xr - xl)}" height="${r(yU - yT)}" fill="${MARMOR}"/>`;
  bau += `<rect x="${r(xl)}" y="${r(yT)}" width="${r(xr - xl)}" height="${r(yU - yT)}" fill="none" stroke="#c8bdb6" stroke-width=".4"/>`;
  /* Schriftband: schwarzer Marmor in weißem Rahmen, oben breiter */
  const sb = 1.2, ri = 1.4;
  bau += `<path d="M${r(xl + ri)} ${r(yU)} L${r(xl + ri)} ${r(yT + ri)} L${r(xr - ri)} ${r(yT + ri)} L${r(xr - ri)} ${r(yU)}" stroke="#2e2a2c" stroke-width="${sb}" fill="none"/>`;
  /* Schrift: senkrechte Alif-Striche, Bögen, Punkte — wie Thuluth, oben etwas größer */
  const zr = zufall(89);
  let schrift = "";
  const zeichen = (x, y, g, quer) => {
    const t = zr(), w = quer ? [g, 0] : [0, g];
    if (t < 0.3) return quer ? `<path d="M${r(x)} ${r(y + 0.42 * g)} l0 ${r(-0.8 * g)}" stroke="#efe6dc" stroke-width=".16"/>` : `<path d="M${r(x - 0.4 * g)} ${r(y)} l${r(0.8 * g)} 0" stroke="#efe6dc" stroke-width=".16"/>`;
    if (t < 0.6) return `<path d="M${r(x - 0.35 * g)} ${r(y - 0.1 * g)} q${r(0.35 * g)} ${r(0.5 * g)} ${r(0.7 * g)} 0" stroke="#efe6dc" stroke-width=".15" fill="none"/>`;
    if (t < 0.8) return `<path d="M${r(x - 0.3 * g)} ${r(y + 0.25 * g)} q${r(0.2 * g)} ${r(-0.6 * g)} ${r(0.6 * g)} ${r(-0.3 * g)}" stroke="#efe6dc" stroke-width=".14" fill="none"/>`;
    void w; return `<circle cx="${r(x)}" cy="${r(y - 0.25 * g)}" r="${r(0.09 * g)}" fill="#efe6dc"/>`;
  };
  for (let y = yT + ri + 1.6; y < yU - 0.8; y += 0.62) for (const x of [xl + ri, xr - ri]) schrift += zeichen(x, y, 0.75 + (yU - y) / (yU - yT) * 0.35, false);
  for (let x = xl + ri + 1; x < xr - ri - 0.5; x += 0.62) schrift += zeichen(x, yT + ri, 1.05, true);
  bau += schrift;
  /* der Spitzbogen: Nische mit Halbkuppel, unten Tür, oben Fenstergitter */
  const yK0 = yB(h0 + portal.hKampfer), yApex = yB(h0 + portal.hBogen), bx0 = CX - bw, bx1 = CX + bw;
  const bogen = `M${r(bx0)} ${r(yU)} L${r(bx0)} ${r(yK0)} C${r(bx0)} ${r(yK0 - (yK0 - yApex) * 0.62)} ${r(CX - bw * 0.38)} ${r(yApex + (yK0 - yApex) * 0.2)} ${CX} ${r(yApex)} C${r(CX + bw * 0.38)} ${r(yApex + (yK0 - yApex) * 0.2)} ${r(bx1)} ${r(yK0 - (yK0 - yApex) * 0.62)} ${r(bx1)} ${r(yK0)} L${r(bx1)} ${r(yU)} Z`;
  bau += `<path d="${bogen}" fill="${S.lg("portalnische", [[0, "#a59aa2"], [0.5, "#c7bcbe"], [1, "#e0d6d0"]])}"/>`;
  /* Halbkuppel der Nische mit Rippen, darunter die achteckige Rückwand: Seitenfacetten im Schatten */
  for (const t of [0.35, 0.7]) bau += `<path d="M${r(CX - bw * t)} ${r(yK0)} Q${r(CX - bw * t * 0.6)} ${r(yApex + (yK0 - yApex) * 0.25)} ${CX} ${r(yApex + 1.2)} Q${r(CX + bw * t * 0.6)} ${r(yApex + (yK0 - yApex) * 0.25)} ${r(CX + bw * t)} ${r(yK0)}" stroke="#968b91" stroke-width=".25" fill="none"/>`;
  bau += `<path d="M${r(bx0)} ${r(yU)} L${r(bx0)} ${r(yK0)} L${r(CX - bw * 0.55)} ${r(yK0 + 2)} L${r(CX - bw * 0.55)} ${r(yU)} Z" fill="#9a8f96"/><path d="M${r(bx1)} ${r(yU)} L${r(bx1)} ${r(yK0)} L${r(CX + bw * 0.55)} ${r(yK0 + 2)} L${r(CX + bw * 0.55)} ${r(yU)} Z" fill="#b6abb0"/>`;
  bau += `<path d="M${r(CX - bw * 0.55)} ${r(yK0 + 2)} L${r(CX + bw * 0.55)} ${r(yK0 + 2)}" stroke="#8e8389" stroke-width=".3"/>`;
  /* oben ein Fenster mit Marmorgitter (Jali), unten die Tür */
  const yF0 = yB(h0 + 17), yF1 = yB(h0 + 11.5), fw = bw * 0.36;
  bau += `<path d="M${r(CX - fw)} ${r(yF1)} L${r(CX - fw)} ${r(yF0 + fw * 0.8)} Q${CX} ${r(yF0 - fw * 0.4)} ${r(CX + fw)} ${r(yF0 + fw * 0.8)} L${r(CX + fw)} ${r(yF1)} Z" fill="#7a7076"/>`;
  for (let i = 1; i < 4; i++) bau += `<line x1="${r(CX - fw + i * fw / 2)}" y1="${r(yF0 + 1)}" x2="${r(CX - fw + i * fw / 2)}" y2="${r(yF1)}" stroke="#d6ccc6" stroke-width=".16"/>`;
  for (let y = yF0 + 2; y < yF1; y += 1.2) bau += `<line x1="${r(CX - fw)}" y1="${r(y)}" x2="${r(CX + fw)}" y2="${r(y)}" stroke="#d6ccc6" stroke-width=".14"/>`;
  bau += `<path d="M${r(CX - bw * 0.42)} ${r(yU)} L${r(CX - bw * 0.42)} ${r(yB(h0 + 6.5))} Q${CX} ${r(yB(h0 + 9.6))} ${r(CX + bw * 0.42)} ${r(yB(h0 + 6.5))} L${r(CX + bw * 0.42)} ${r(yU)} Z" fill="#4e4549"/>`;
  bau += `<path d="${bogen}" fill="${S.lg("portalschatten", [[0, "#000", 0.14], [0.5, "#000", 0.02], [1, "#fff", 0.06]], 0, 0, 1, 0)}"/>`;
  bau += `<path d="${bogen}" fill="none" stroke="#f6efe6" stroke-width=".6"/>`;
  /* Pietra dura in den Zwickeln über dem Bogen: Ranken mit roten und grünen Blüten */
  for (const sd of [-1, 1]) {
    const zx = CX + sd * bw * 0.72, zy = yApex + 2.6;
    bau += `<path d="M${r(zx - sd * 3)} ${r(zy + 2)} q${r(sd * 1.6)} -2.6 ${r(sd * 3.6)} -2.2 q${r(sd * 1.4)} .4 ${r(sd * 2.4)} -1.6" stroke="#5d7a4a" stroke-width=".25" fill="none"/>`;
    for (const [dx, dy, c] of [[-2, 1.4, "#b33a3a"], [0, -0.4, "#c9a227"], [2, -1.2, "#b33a3a"], [-0.8, 0.6, "#3a6ea0"], [1.2, 0.2, "#4a7a3a"]]) bau += `<circle cx="${r(zx + sd * dx)}" cy="${r(zy + dy)}" r=".42" fill="${c}"/>`;
  }
  /* Schlanke Fialen (Guldastas) neben dem Portal und an den Ecken */
  for (const s of [-portal.s, portal.s, -19.5, 19.5]) {
    const x = f(s), yt = yB(s === portal.s || s === -portal.s ? h0 + 37 : hP + 3.4), yb = yB(Math.abs(s) === portal.s ? h0 + 33 : hP);
    bau += `<rect x="${r(x - 0.5)}" y="${r(yt + 1.2)}" width="1" height="${r(yb - yt - 1.2)}" fill="#f4ece4"/><path d="M${r(x - 0.75)} ${r(yt + 1.4)} Q${r(x)} ${r(yt - 0.6)} ${r(x + 0.75)} ${r(yt + 1.4)} Z" fill="#efe6de"/><line x1="${r(x)}" y1="${r(yt - 0.6)}" x2="${r(x)}" y2="${r(yt - 1.8)}" stroke="${GOLD}" stroke-width=".25"/>`;
  }
  /* Licht: rechte Hälfte wärmer, linke kühler */
  bau += `<rect x="${r(f(-19.5))}" y="${r(yB(hP))}" width="${r(xl - f(-19.5))}" height="${r(yB(h0) - yB(hP))}" fill="#7a7090" opacity=".07"/>`;

  /* ---- Tambour, Zwiebelkuppel mit Lotus und Bekrönung ---- */
  const prof = [[9.7, 39], [10.3, 41.6], [11.6, 43.8], [12.4, 47.3], [12.25, 51.4], [11.3, 55.4], [9.5, 59.1], [7, 62.2], [4.3, 64.4], [2.1, 65.7], [0, 66.5]];
  /* glatter Umriss: Catmull-Rom durch die Profilpunkte, links hinauf, rechts hinab */
  const umr = [...prof.map(([s, h]) => [xK(-s), yK(h)]), ...prof.slice(0, -1).reverse().map(([s, h]) => [xK(s), yK(h)])];
  let kp = `M${r(umr[0][0])} ${r(umr[0][1])}`;
  for (let i = 0; i < umr.length - 1; i++) {
    const p0 = umr[Math.max(0, i - 1)], p1 = umr[i], p2 = umr[i + 1], p3 = umr[Math.min(umr.length - 1, i + 2)];
    kp += ` C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${r(p2[0])} ${r(p2[1])}`;
  }
  kp += " Z";
  kuppel += `<rect x="${r(xK(-10.2))}" y="${r(yK(39.4))}" width="${r(xK(10.2) - xK(-10.2))}" height="${r(yK(36.6) - yK(39.4))}" fill="${MARMOR}"/>`;
  kuppel += `<rect x="${r(xK(-10.2))}" y="${r(yK(38.2))}" width="${r(xK(10.2) - xK(-10.2))}" height=".5" fill="#b9aeac"/>`;
  kuppel += `<path d="${kp}" fill="${S.lg("kuppel", [[0, "#c9c2c8"], [0.35, "#ece6e4"], [0.7, "#fff8ee"], [1, "#ffe9cc"]], 0, 0, 1, 0)}"/>`;
  kuppel += `<path d="${kp}" fill="${S.rg("kuppelglanz", [[0, "#fff", 0.55], [1, "#fff", 0]], 0.68, 0.38, 0.4)}"/>`;
  kuppel += `<path d="M${r(xK(-11.9))} ${r(yK(45))} Q${r(xK(0))} ${r(yK(43.6))} ${r(xK(11.9))} ${r(yK(45))}" stroke="#d6cdca" stroke-width=".3" fill="none"/>`;
  /* Lotusblätter rund um die Spitze */
  for (let i = -3; i <= 3; i++) { const x = xK(i * 1.15), y = yK(65.4 - Math.abs(i) * 0.55); kuppel += `<path d="M${r(x - 0.9)} ${r(y + 1.6)} Q${r(x)} ${r(y - 1.4)} ${r(x + 0.9)} ${r(y + 1.6)} Z" fill="#f3ebe4" stroke="#c9bfba" stroke-width=".15"/>`; }
  /* Bekrönung: Kugeln, Kalasch, Stab mit Halbmond (Bronze, früher Gold) */
  const fx = xK(0);
  kuppel += `<rect x="${r(fx - 0.35)}" y="${r(yK(73.4))}" width=".7" height="${r(yK(66) - yK(73.4))}" fill="${GOLD}"/>`;
  for (const [h, rr] of [[67.2, 1.1], [68.6, 0.85], [70, 1.15], [71.3, 0.65]]) kuppel += `<ellipse cx="${r(fx)}" cy="${r(yK(h))}" rx="${rr}" ry="${r(rr * 0.85)}" fill="${GOLD}"/>`;
  kuppel += `<path d="M${r(fx - 1.2)} ${r(yK(72.6))} a1.25 1.25 0 1 0 2.4 0" stroke="${GOLD}" stroke-width=".4" fill="none"/>`;

  /* ---- vier Kuppelpavillons (Chattris) ---- */
  const chattri = (s, d, k = 1) => {
    const u = uAt(d), x = xAt(s, d), y = (h) => yAt(d, h), w = 3.4 * u * k;
    let g = `<rect x="${r(x - w - 0.4)}" y="${r(y(38.6))}" width="${r(2 * w + 0.8)}" height="${r(y(36.8) - y(38.6))}" fill="#efe7e0"/>`;
    for (let i = 0; i < 4; i++) {
      const a = x - w + i * (2 * w) / 3;
      g += `<rect x="${r(a - 0.35)}" y="${r(y(44.4))}" width=".7" height="${r(y(38.6) - y(44.4))}" fill="#f6efe8"/>`;
      if (i < 3) g += `<path d="M${r(a + 0.4)} ${r(y(38.6))} L${r(a + 0.4)} ${r(y(42.6))} Q${r(a + w / 3)} ${r(y(44))} ${r(a + 2 * w / 3 - 0.4)} ${r(y(42.6))} L${r(a + 2 * w / 3 - 0.4)} ${r(y(38.6))} Z" fill="#9c9096"/>`;
    }
    g += `<rect x="${r(x - w - 0.8)}" y="${r(y(45.2))}" width="${r(2 * w + 1.6)}" height="${r(y(44.2) - y(45.2))}" fill="#f4ece4"/>`;
    g += `<path d="M${r(x - w * 0.8)} ${r(y(45.2))} Q${r(x - w * 1.02)} ${r(y(48.6))} ${r(x)} ${r(y(50.6))} Q${r(x + w * 1.02)} ${r(y(48.6))} ${r(x + w * 0.8)} ${r(y(45.2))} Z" fill="${S.lg("kuppel", [])}"/>`;
    g += `<line x1="${r(x)}" y1="${r(y(50.4))}" x2="${r(x)}" y2="${r(y(52.6))}" stroke="${GOLD}" stroke-width=".4"/><circle cx="${r(x)}" cy="${r(y(51.4))}" r=".45" fill="${GOLD}"/>`;
    return g;
  };
  pavH = chattri(-15.5, 364, 0.95) + chattri(15.5, 364, 0.95);
  pavV = chattri(-15.5, 331) + chattri(15.5, 331);
}
S.def(`<g id="${S.id("baubild")}">${pavH}${kuppel}${bau}${pavV}</g>`);

/* ---------- die vier Minarette ---------- */
let minarette = "";
{
  const minarett = (s, d, schnitt) => {
    const u = uAt(d), x = xAt(s, d), y = (h) => yAt(d, h);
    const rB = 3.1 * u, rT = 2.3 * u, h0 = T.h0;
    const rad = (h) => rB + (rT - rB) * (h - h0) / 33;
    let g = "";
    const yBasis = schnitt ? Math.min(y(h0), yAt(T.dS, h0)) : y(h0);
    /* drei Schaftteile, nach oben schmaler, schwarze Fugenlinien */
    for (const [ha, hb] of [[h0, 18], [18.9, 29], [29.9, 40]]) {
      const ya = ha === h0 ? yBasis : y(ha), yb = y(hb);
      g += `<path d="M${r(x - rad(ha))} ${r(ya)} L${r(x - rad(hb))} ${r(yb)} L${r(x + rad(hb))} ${r(yb)} L${r(x + rad(ha))} ${r(ya)} Z" fill="${S.lg("minarett", [[0, "#c6bfc6"], [0.45, "#ece6e2"], [0.8, "#fff6ea"], [1, "#f0e2d0"]], 0, 0, 1, 0)}"/>`;
      for (const t of [-0.55, -0.1, 0.35, 0.8]) g += `<line x1="${r(x + t * rad(ha))}" y1="${r(ya)}" x2="${r(x + t * rad(hb))}" y2="${r(yb)}" stroke="#4a4446" stroke-width="${r(0.07 * u)}" opacity=".55"/>`;
      for (let h = ha + 2.2; h < hb; h += 2.2) g += `<line x1="${r(x - rad(h))}" y1="${r(y(h))}" x2="${r(x + rad(h))}" y2="${r(y(h))}" stroke="#4a4446" stroke-width="${r(0.06 * u)}" opacity=".45"/>`;
    }
    /* Balkone mit Konsolen und Brüstung */
    for (const h of [18, 29, 40]) {
      const rr = rad(h) + 1.0 * u;
      g += `<path d="M${r(x - rad(h))} ${r(y(h - 1.4))} L${r(x - rr)} ${r(y(h))} L${r(x + rr)} ${r(y(h))} L${r(x + rad(h))} ${r(y(h - 1.4))} Z" fill="#ddd4d0"/>`;
      g += `<rect x="${r(x - rr)}" y="${r(y(h + 1.1))}" width="${r(2 * rr)}" height="${r(y(h) - y(h + 1.1))}" fill="#f4ede6"/>`;
      for (let i = 1; i < 6; i++) g += `<line x1="${r(x - rr + i * rr / 3)}" y1="${r(y(h + 1.1))}" x2="${r(x - rr + i * rr / 3)}" y2="${r(y(h))}" stroke="#b5aaa8" stroke-width=".18"/>`;
    }
    /* Pavillon oben: acht Säulen, Kuppel, Spitze */
    const pr = rT * 1.05;
    g += `<rect x="${r(x - pr)}" y="${r(y(44.2))}" width="${r(2 * pr)}" height="${r(y(41.1) - y(44.2))}" fill="#a2979c"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${r(x - pr + i * (2 * pr - 0.6) / 3)}" y="${r(y(44.2))}" width=".6" height="${r(y(41.1) - y(44.2))}" fill="#f6efe8"/>`;
    g += `<rect x="${r(x - pr - 0.5)}" y="${r(y(44.8))}" width="${r(2 * pr + 1)}" height="${r(y(44.2) - y(44.8))}" fill="#f4ece4"/>`;
    g += `<path d="M${r(x - pr * 0.9)} ${r(y(44.8))} Q${r(x - pr * 1.1)} ${r(y(46.8))} ${r(x)} ${r(y(48))} Q${r(x + pr * 1.1)} ${r(y(46.8))} ${r(x + pr * 0.9)} ${r(y(44.8))} Z" fill="${S.lg("kuppel", [])}"/>`;
    g += `<line x1="${r(x)}" y1="${r(y(47.8))}" x2="${r(x)}" y2="${r(y(49.6))}" stroke="${GOLD}" stroke-width=".35"/>`;
    return g;
  };
  minarette += minarett(-44.5, 391, true) + minarett(44.5, 391, true) + minarett(-44.5, 302.5) + minarett(44.5, 302.5);
}
S.def(`<g id="${S.id("minarettbild")}">${minarette}</g>`);

/* =====================================================================
   1 — DIE MOSCHEE (links, Westen) und 2 — DAS GÄSTEHAUS (rechts, Osten)
   ===================================================================== */
const rotbau = (sx) => {
  /* von Süden sieht man die Schmalseite: roter Block, zwei achteckige Ecktürme, Kuppeln hintereinander */
  const d = 335, u = uAt(d), x = xAt(sx * 96, d), y = (h) => yAt(d, h);
  let g = "";
  /* Kuppeln hintereinander (Nord–Süd): hinten die große Mittelkuppel, vorn die kleine Südkuppel — je auf weißem Tambour */
  for (const [dh, rr, hh, dd] of [[21, 7.2, 32, 22], [19.5, 4.8, 27.5, 4]]) {
    const ud = uAt(d + dd), yy = yAt(d + dd, dh), w = rr * ud, top = yAt(d + dd, hh), yt = yAt(d + dd, dh - 2.6);
    g += `<rect x="${r(x - w * 0.86)}" y="${r(yy)}" width="${r(w * 1.72)}" height="${r(yt - yy)}" fill="#efe6dd"/><rect x="${r(x - w * 0.86)}" y="${r(yy)}" width="${r(w * 1.72)}" height=".4" fill="#c9bdb4"/>`;
    g += `<path d="M${r(x - w * 0.86)} ${r(yy)} C${r(x - w * 1.12)} ${r(yy - (yy - top) * 0.45)} ${r(x - w * 0.5)} ${r(yy - (yy - top) * 0.85)} ${r(x)} ${r(top)} C${r(x + w * 0.5)} ${r(yy - (yy - top) * 0.85)} ${r(x + w * 1.12)} ${r(yy - (yy - top) * 0.45)} ${r(x + w * 0.86)} ${r(yy)} Z" fill="${S.lg("kuppel", [])}"/>`;
    g += `<line x1="${r(x)}" y1="${r(top)}" x2="${r(x)}" y2="${r(top - 2.4)}" stroke="${GOLD}" stroke-width=".4"/><circle cx="${r(x)}" cy="${r(top - 1.2)}" r=".4" fill="${GOLD}"/>`;
  }
  g += `<rect x="${r(x - 12 * u)}" y="${r(y(18))}" width="${r(24 * u)}" height="${r(y(1.2) - y(18))}" fill="${SANDSTEIN}"/>`;
  g += `<rect x="${r(x - 12 * u)}" y="${r(y(18))}" width="${r(24 * u)}" height=".8" fill="#f2e6dc"/>`;
  g += `<path d="M${r(x - 5 * u)} ${r(y(1.2))} L${r(x - 5 * u)} ${r(y(10))} Q${r(x)} ${r(y(14))} ${r(x + 5 * u)} ${r(y(10))} L${r(x + 5 * u)} ${r(y(1.2))} Z" fill="#6e2a1a" stroke="#f2e6dc" stroke-width=".5"/>`;
  for (const t of [-1, 1]) {
    const tx = x + t * 12 * u;
    g += `<rect x="${r(tx - 2.4 * u)}" y="${r(y(22))}" width="${r(4.8 * u)}" height="${r(y(1.2) - y(22))}" fill="#b04e32"/><rect x="${r(tx - 2.4 * u)}" y="${r(y(22))}" width="${r(4.8 * u)}" height="${r(y(1.2) - y(22))}" fill="${S.lg("turmlicht", [[0, "#000", 0.15], [0.5, "#000", 0], [1, "#fff", 0.12]], 0, 0, 1, 0)}"/>`;
    for (const h of [8, 15]) g += `<line x1="${r(tx - 2.4 * u)}" y1="${r(y(h))}" x2="${r(tx + 2.4 * u)}" y2="${r(y(h))}" stroke="#f2e6dc" stroke-width=".4"/>`;
    g += `<rect x="${r(tx - 2.2 * u)}" y="${r(y(25))}" width="${r(4.4 * u)}" height="${r(y(22) - y(25))}" fill="#e9e0d8"/>`;
    g += `<path d="M${r(tx - 2.6 * u)} ${r(y(25))} Q${r(tx - 2.8 * u)} ${r(y(27.6))} ${r(tx)} ${r(y(29))} Q${r(tx + 2.8 * u)} ${r(y(27.6))} ${r(tx + 2.6 * u)} ${r(y(25))} Z" fill="${S.lg("kuppel", [])}"/>`;
  }
  return g;
};
S.teil({ anker: [37, 112], id: "moschee", de: "die Moschee", syl: "Mo-SCHEE", it: "la moschea", itSyl: "mo-SCHE-a", en: "mosque", x: 0, y: 0, kunst: rotbau(-1),
  tipp: "Links vom Taj steht eine Moschee aus rotem Sandstein. Sie zeigt nach Mekka." });
S.teil({ anker: [363, 112], id: "gaestehaus", de: "das Gästehaus", syl: "GÄS-te-haus", it: "la foresteria", itSyl: "fo-re-ste-RI-a", en: "guest house", x: 0, y: 0, kunst: rotbau(1),
  tipp: "Das Gästehaus heißt „Jawab“, die Antwort: Es ist das Spiegelbild der Moschee." });

/* =====================================================================
   3 — DER BAUM (Laubbäume in den Gartenvierteln, Morgendunst)
   ===================================================================== */
{
  let k = "";
  const krone = (x, y, w, h, c) => {
    let g = `<ellipse cx="${r(x + w * 0.15)}" cy="${r(y - h * 0.42)}" rx="${r(w * 0.95)}" ry="${r(h * 0.5)}" fill="#1f3524" opacity=".3"/>`;
    for (let i = 0; i < 9; i++) { const a = rnd() * Math.PI * 2, q = 0.45 + rnd() * 0.4; g += `<circle cx="${r(x + Math.cos(a) * w * q * 0.7)}" cy="${r(y - h * 0.48 + Math.sin(a) * h * q * 0.38)}" r="${r(w * (0.28 + rnd() * 0.18))}" fill="${c[i % c.length]}"/>`; }
    g += `<ellipse cx="${r(x + w * 0.35)}" cy="${r(y - h * 0.62)}" rx="${r(w * 0.4)}" ry="${r(h * 0.2)}" fill="#b9c98a" opacity=".22"/>`;
    return g + `<rect x="${r(x - w * 0.06)}" y="${r(y - h * 0.15)}" width="${r(w * 0.12)}" height="${r(h * 0.15)}" fill="#3a2e22"/>`;
  };
  const gruen = ["#2f4f36", "#3c6040", "#4a6e44", "#284430", "#557a4a"];
  for (const sd of [-1, 1]) {
    for (const [s, d, hh] of [[38, 250, 12], [30, 205, 11], [44, 190, 13], [26, 160, 10], [36, 140, 12], [24, 120, 9], [32, 105, 11], [22, 90, 8.5], [40, 95, 12]]) {
      const x = xAt(sd * s, d), y = yAt(d), u = uAt(d);
      if (x < -10 || x > 410) continue;
      k += krone(Math.max(6, Math.min(394, x)), y, Math.min(hh * u * 0.4, 16), Math.min(hh * u, 34), gruen);
    }
  }
  k += `<rect x="0" y="${HOR - 16}" width="400" height="26" fill="${S.lg("gartendunst", [[0, "#f4e4d4", 0], [0.6, "#f4e4d4", 0.45], [1, "#f4e4d4", 0.2]])}"/>`;
  S.teil({ anker: [60, 118], id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 0, y: 0, kunst: k,
    tipp: "Im Garten wachsen Obst- und Schattenbäume. Der Garten soll das Paradies zeigen." });
}

/* =====================================================================
   4 — DER SOCKEL, 5 — DER TAJ MAHAL (Lupe), 6 — DAS MINARETT
   ===================================================================== */
S.teil({ anker: [200, 131], id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il basamento", itSyl: "ba-sa-MEN-to", en: "plinth", x: 0, y: 0, kunst: `<use href="#${S.id("sockelbild")}"/>`,
  tipp: "Der Taj steht auf einem 6 Meter hohen Sockel aus weißem Marmor." });
const tajUnter = [];
{
  const h0 = T.h0;
  tajUnter.push({ id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: CX, y: r(yK(42)), kunst: flaeche(-11.5 * uK, -(yK(42) - yK(64.5)), 23 * uK, yK(42) - yK(64.5)),
    tipp: "Die Zwiebelkuppel ist 23 Meter hoch – höher als ein siebenstöckiges Haus." });
  tajUnter.push({ id: "spitze", de: "die Spitze", syl: "SPIT-ze", it: "il pinnacolo", itSyl: "pin-NA-co-lo", en: "finial", x: CX, y: r(yK(66)), kunst: flaeche(-2.4, -(yK(66) - yK(73.8)), 4.8, yK(66) - yK(73.8)),
    tipp: "Ganz oben steht ein Halbmond. Früher war die Spitze aus Gold." });
  tajUnter.push({ id: "pavillon", de: "der Pavillon", syl: "PA-vil-lon", it: "il padiglione", itSyl: "pa-di-GLIO-ne", en: "pavilion", x: r(xAt(15.5, 331)), y: r(yAt(331, 37)), kunst: flaeche(-7, -(yAt(331, 37) - yAt(331, 52.6)), 14, yAt(331, 37) - yAt(331, 52.6)),
    tipp: "Vier kleine Kuppelpavillons stehen um die große Kuppel. Auf Hindi heißen sie „Chattri“ (Schirm)." });
  tajUnter.push({ id: "portal", de: "das Portal", syl: "por-TAL", it: "il portale", itSyl: "por-TA-le", en: "portal", x: CX, y: r(yB(h0 + portal.hKampfer)), kunst: flaeche(-portal.bogen * uB, -(yB(h0 + portal.hKampfer) - yB(h0 + portal.hBogen)), 2 * portal.bogen * uB, yB(h0 + portal.hKampfer) - yB(h0 + portal.hBogen) + 3),
    tipp: "Das große Portal heißt „Pishtaq“. Der spitze Bogen ist 33 Meter hoch eingefasst." });
  tajUnter.push({ id: "inschrift", de: "die Inschrift", syl: "IN-schrift", it: "l'iscrizione", itSyl: "i-scri-ZIO-ne", en: "inscription", x: r(xB(-portal.s) + 1.4), y: r(yB(h0 + 26)), kunst: flaeche(-1.6, -(yB(h0 + 26) - yB(h0 + 33)) + 1, 3.2 + 2 * portal.s * uB - 2.8, 3) + flaeche(-1.6, -(yB(h0 + 26) - yB(h0 + 33)) + 1, 3.2, yB(h0 + 26) - yB(h0 + 33) + 2),
    tipp: "Die Buchstaben sind aus schwarzem Marmor. Oben sind sie größer – von unten wirken alle gleich groß." });
  tajUnter.push({ id: "einlegearbeit", de: "die Einlegearbeit", syl: "EIN-le-ge-ar-beit", it: "l'intarsio", itSyl: "in-TAR-sio", en: "inlay", x: r(CX + portal.bogen * uB * 0.72), y: r(yB(h0 + portal.hBogen) + 4.4), kunst: flaeche(-3.6, -4.2, 7.2, 5.4),
    tipp: "Pietra dura: Blumen aus Halbedelsteinen wie Jaspis und Lapislazuli, eingelegt in den Marmor." });
  S.teil({ anker: [200, 96], id: "taj_mahal", de: "der Taj Mahal", syl: "taj ma-HAL", it: "il Taj Mahal", itSyl: "taj ma-HAL", en: "Taj Mahal", x: 0, y: 0, kunst: `<use href="#${S.id("baubild")}"/>`,
    zoom: { x: 140, y: 14, w: 120, h: 80 }, unter: tajUnter,
    tipp: "Der Großmogul Shah Jahan ließ den Taj Mahal (auf Deutsch auch „Tadsch Mahal“) für seine Frau Mumtaz Mahal bauen – über 20 Jahre lang." });
}
S.teil({ anker: [xAt(-44.5, 302.5), yAt(302.5, 30)], id: "minarett", de: "das Minarett", syl: "mi-na-RETT", it: "il minareto", itSyl: "mi-na-RE-to", en: "minaret", x: 0, y: 0, kunst: `<use href="#${S.id("minarettbild")}"/>`,
  tipp: "Die vier Minarette neigen sich ein wenig nach außen. Bei einem Erdbeben würden sie nicht auf den Taj fallen." });

/* =====================================================================
   7 — DER RASEN, 8 — DER WEG, 9 — DAS WASSERBECKEN, 10 — DIE SPIEGELUNG,
   11 — DER SPRINGBRUNNEN (Marmorbecken in der Mitte), 12 — DIE ZYPRESSE
   ===================================================================== */
const KANAL = 2.0, WEG = [2.35, 6.4], ZY = 7.3;
const D_NAH = 14, D_FERN = 291, D_BECKEN = [139, 163], D_UNTEN = E * F / (260 - HOR);
const band = (s0, s1, d0, d1) => P([[xAt(s0, d1), yAt(d1)], [xAt(s1, d1), yAt(d1)], [xAt(s1, d0), yAt(d0)], [xAt(s0, d0), yAt(d0)]]);
{
  /* Rasen: links und rechts der Wege, mit Mähstreifen und langen Morgenschatten */
  let k = "";
  for (const sd of [-1, 1]) {
    const pts = [[xAt(sd * 7.2, D_FERN), yAt(D_FERN)], [sd < 0 ? 0 : 400, yAt(D_FERN)], [sd < 0 ? 0 : 400, 260], [xAt(sd * 7.2, D_UNTEN), 260]];
    k += `<path d="${P(pts)}" fill="${S.lg("rasen", [[0, "#8aa06a"], [0.35, "#6a8d4c"], [1, "#4f7a3a"]])}"/>`;
    for (const d of [270, 230, 195, 165, 140, 118, 100, 85, 72, 61, 52, 44, 37, 31, 26, 22, 19, 16]) k += `<path d="M${r(Math.max(0, Math.min(400, xAt(sd * 7.2, d))))} ${r(yAt(d))} L${sd < 0 ? 0 : 400} ${r(yAt(d))}" stroke="${d % 2 ? "#7aa05a" : "#5a8040"}" stroke-width="${r(Math.min(2.4, 26 / d))}" opacity=".35"/>`;
  }
  k += `<path d="${band(WEG[1], 7.25, D_UNTEN, D_FERN)}" fill="#5e8644"/><path d="${band(-7.25, -WEG[1], D_UNTEN, D_FERN)}" fill="#5e8644"/>`;
  /* Querkanal an der Mitte (von hier nur ein Streifen) */
  k += `<rect x="0" y="${r(yAt(151))}" width="400" height="${r(yAt(149) - yAt(151))}" fill="#9fb6c6"/>`;
  S.teil({ anker: [36, 200], id: "rasen", de: "der Rasen", syl: "RA-sen", it: "il prato", itSyl: "PRA-to", en: "lawn", x: 0, y: 0, kunst: k });
}
{
  /* Wege aus rotem Sandstein mit hellen Fugen in Fluchtperspektive */
  let k = "";
  for (const sd of [-1, 1]) {
    const [a, b] = sd < 0 ? [-WEG[1], -WEG[0]] : [WEG[0], WEG[1]];
    k += `<path d="${band(a, b, D_UNTEN, D_FERN)}" fill="${S.lg("weg", [[0, "#c9866a"], [0.5, "#b36a4c"], [1, "#a0583c"]])}"/>`;
    for (const s of [a + 1, a + 2, a + 3]) { let x2 = xAt(s, D_UNTEN), y2 = 260; const x1 = xAt(s, D_FERN), y1 = yAt(D_FERN); for (const g of [0, 400]) if ((x2 - g) * (x1 - g) < 0) { y2 = y1 + (y2 - y1) * (g - x1) / (x2 - x1); x2 = g; } k += `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="#d9ae96" stroke-width=".22" opacity=".55"/>`; }
    for (let d = D_UNTEN; d < 290; d *= 1.09) k += `<line x1="${r(Math.max(0, xAt(a, d)))}" y1="${r(yAt(d))}" x2="${r(Math.min(400, xAt(b, d)))}" y2="${r(yAt(d))}" stroke="#d9ae96" stroke-width="${r(Math.min(0.45, 6 / d))}" opacity=".5"/>`;
    /* weiße Marmorkante zum Kanal */
    const kante = sd < 0 ? -KANAL - 0.35 : KANAL;
    k += `<path d="${band(kante, kante + 0.35, D_UNTEN, D_FERN)}" fill="#f0e8e0"/>`;
  }
  S.teil({ anker: [126, 230], id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: 0, y: 0, kunst: k,
    tipp: "Die Wege liegen höher als die Beete – so sah man über die Blumen wie über einen Teppich." });
}
/* Wasserfläche als Schnittmaske für das Spiegelbild */
const WASSER = [band(-KANAL, KANAL, D_NAH, D_BECKEN[0]), band(-KANAL, KANAL, D_BECKEN[1], D_FERN)].join(" ");
S.def(`<clipPath id="${S.id("wasser")}"><path d="${WASSER}"/></clipPath>`);
/* das Spiegelbild füllt die Mitte; am Rand bleibt ein Streifen offenes Wasser (dort antippbar: das Wasserbecken) */
const SPIEGELFLAECHE = [band(-KANAL * 0.84, KANAL * 0.84, D_NAH, D_BECKEN[0]), band(-KANAL * 0.84, KANAL * 0.84, D_BECKEN[1], D_FERN)].join(" ");
S.def(`<clipPath id="${S.id("spiegelclip")}"><path d="${SPIEGELFLAECHE}"/></clipPath>`);
{
  let k = `<path d="${WASSER}" fill="${S.lg("wasserhimmel", [[0, "#f2dcc8"], [0.25, "#c9d2dc"], [1, "#7f9fc2"]])}"/>`;
  /* Düsen der Springbrunnen in der Kanalmitte (heute aus) */
  for (let d = 18; d < 138; d *= 1.18) k += `<ellipse cx="${CX}" cy="${r(yAt(d, -0.3))}" rx="${r(Math.max(0.3, 0.12 * uAt(d)))}" ry="${r(Math.max(0.15, 0.04 * uAt(d)))}" fill="#6a5a3a" opacity=".7"/>`;
  S.teil({ anker: [200, 236], id: "wasserbecken", de: "das Wasserbecken", syl: "WAS-ser-be-cken", it: "la vasca", itSyl: "VA-sca", en: "pool", x: 0, y: 0, kunst: k,
    tipp: "Das lange Wasserbecken teilt den Garten. Morgens ist das Wasser ganz still." });
}
{
  /* das Spiegelbild: Sockel, Bau und Minarette gespiegelt, nur im Wasser */
  let k = `<g clip-path="url(#${S.id("spiegelclip")})"><g transform="translate(0 ${SPIEGEL}) scale(1 -1)" opacity=".78"><use href="#${S.id("sockelbild")}"/><use href="#${S.id("minarettbild")}"/><use href="#${S.id("baubild")}"/></g>`;
  k += `<rect x="0" y="135" width="400" height="125" fill="${S.lg("spiegeltiefe", [[0, "#9fb0c4", 0.15], [1, "#3a5a7a", 0.3]])}"/>`;
  /* feine Wellenlinien */
  for (let d = 16; d < 130; d *= 1.12) { const y = yAt(d, -0.3), w = KANAL * uAt(d); k += `<line x1="${r(CX - w * 0.9)}" y1="${r(y)}" x2="${r(CX - w * 0.2)}" y2="${r(y)}" stroke="#fff" stroke-width="${r(Math.min(0.4, 6 / d))}" opacity=".25"/><line x1="${r(CX + w * 0.1)}" y1="${r(y + 0.6)}" x2="${r(CX + w * 0.7)}" y2="${r(y + 0.6)}" stroke="#fff" stroke-width="${r(Math.min(0.35, 5 / d))}" opacity=".18"/>`; }
  k += `</g>`;
  S.teil({ anker: [200, 200], id: "spiegelung", de: "die Spiegelung", syl: "SPIE-ge-lung", it: "il riflesso", itSyl: "ri-FLES-so", en: "reflection", x: 0, y: 0, kunst: k,
    tipp: "Im stillen Wasser sieht man den Taj Mahal noch einmal – auf dem Kopf." });
}
{
  /* das erhöhte Marmorbecken in der Mitte mit fünf Lotus-Fontänen */
  const [d0, d1] = D_BECKEN, sB = 12;
  let k = `<path d="${P([[xAt(-sB, d0), yAt(d0, 1.2)], [xAt(sB, d0), yAt(d0, 1.2)], [xAt(sB, d0), yAt(d0)], [xAt(-sB, d0), yAt(d0)]])}" fill="${MARMOR}"/>`;
  k += `<path d="${P([[xAt(-sB, d1), yAt(d1, 1.2)], [xAt(sB, d1), yAt(d1, 1.2)], [xAt(sB, d0), yAt(d0, 1.2)], [xAt(-sB, d0), yAt(d0, 1.2)]])}" fill="#e9e1da"/>`;
  k += `<path d="${P([[xAt(-7, d0 + 5), yAt(d0 + 5, 1.1)], [xAt(7, d0 + 5), yAt(d0 + 5, 1.1)], [xAt(7, d1 - 5), yAt(d1 - 5, 1.1)], [xAt(-7, d1 - 5), yAt(d1 - 5, 1.1)]])}" fill="#9fb4c4"/>`;
  for (const s of [-10, -6, -2, 2, 6, 10]) k += `<rect x="${r(xAt(s, d0) - 0.3)}" y="${r(yAt(d0, 1.2))}" width=".6" height="${r(yAt(d0) - yAt(d0, 1.2))}" fill="#d9cfc8"/>`;
  /* Marmorbank (die „Diana-Bank“) vorn */
  k += `<rect x="${r(xAt(-2.5, d0 - 1))}" y="${r(yAt(d0 - 1, 1.75))}" width="${r(5 * uAt(d0))}" height="${r(yAt(d0 - 1, 1.2) - yAt(d0 - 1, 1.75))}" fill="#fbf6ef"/>`;
  for (const [s, dd, hh] of [[0, 151, 4.2], [-4.5, 148, 2.6], [4.5, 148, 2.6], [-4.5, 155, 2.4], [4.5, 155, 2.4]]) {
    const x = xAt(s, dd), y0 = yAt(dd, 1.1), y1 = yAt(dd, 1.1 + hh);
    k += `<path d="M${r(x)} ${r(y0)} Q${r(x - 0.4)} ${r((y0 + y1) / 2)} ${r(x)} ${r(y1)} Q${r(x + 0.4)} ${r((y0 + y1) / 2)} ${r(x)} ${r(y0)}" stroke="#f8fbff" stroke-width=".55" fill="none" opacity=".9"/>`;
    k += `<path d="M${r(x - 1.4)} ${r(y1 + 1)} Q${r(x)} ${r(y1 - 0.6)} ${r(x + 1.4)} ${r(y1 + 1)}" stroke="#f8fbff" stroke-width=".3" fill="none" opacity=".75"/>`;
  }
  S.teil({ anker: [200, 141], id: "springbrunnen", de: "der Springbrunnen", syl: "SPRING-brun-nen", it: "la fontana", itSyl: "fon-TA-na", en: "fountain", x: 0, y: 0, kunst: k + flaeche(xAt(-sB, d0), yAt(d0, 4.6), 2 * sB * uAt(d0), yAt(d0) - yAt(d0, 4.6)),
    tipp: "In der Mitte des Gartens liegt ein Marmorbecken. Seine Düsen haben die Form von Lotusblüten." });
}
{
  /* Zypressen in zwei Reihen entlang der Wege; weiche Morgenschatten nach links (Westen) */
  let k = "", sch = "";
  const zyp = (x, y, w, h) => {
    /* schlanke Säule mit leicht unruhigem Rand und Spitze */
    let l = `M${r(x - w * 0.55)} ${r(y)}`, rr = "";
    for (let i = 1; i <= 8; i++) { const t = i / 8, bx = Math.sin(Math.PI * Math.pow(1 - t, 0.85) * 0.5) * w * (0.9 + 0.12 * Math.sin(i * 2.3)); l += ` L${r(x - bx)} ${r(y - h * t)}`; }
    for (let i = 8; i >= 0; i--) { const t = i / 8, bx = Math.sin(Math.PI * Math.pow(1 - t, 0.85) * 0.5) * w * (0.92 + 0.1 * Math.cos(i * 1.7)); rr += ` L${r(x + bx)} ${r(y - h * t)}`; }
    let g = `<path d="${l}${rr} Z" fill="${ZYPRESSE}"/>`;
    if (h > 25) for (let i = 0; i < 6; i++) { const t = 0.12 + i * 0.13, bx = x + w * (0.3 - rnd() * 0.6); g += `<path d="M${r(bx)} ${r(y - h * t)} q${r(w * 0.12)} ${r(-h * 0.06)} ${r(w * 0.02)} ${r(-h * 0.12)}" stroke="#14281a" stroke-width="${r(w * 0.12)}" fill="none" opacity=".4" stroke-linecap="round"/>`; }
    return g + `<path d="M${r(x + w * 0.35)} ${r(y - h * 0.1)} Q${r(x + w * 0.7)} ${r(y - h * 0.45)} ${r(x + w * 0.12)} ${r(y - h * 0.9)}" stroke="#9cc070" stroke-width="${r(Math.max(0.2, w * 0.22))}" fill="none" opacity=".3"/>`;
  };
  const tiefen = [];
  for (let d = 38; d < 286; d *= 1.16) if (d < D_BECKEN[0] - 5 || d > D_BECKEN[1] + 5) tiefen.push(d);
  for (const d of tiefen.reverse()) {
    const u = uAt(d), y = yAt(d), w = 0.62 * u, h = (d < 90 ? 6.4 : 5.6) * u;
    for (const sd of [-1, 1]) {
      const x = xAt(sd * ZY, d);
      sch += `<path d="${P([[x, y], [x - 6.5 * u, y + 0.25 * u], [x - 6.2 * u, y + 0.6 * u], [x + 0.5 * u, y + 0.35 * u]])}" fill="#1d3320"/>`;
      k += zyp(x, y, w, h);
    }
  }
  k = `<g opacity=".11" filter="url(#${S.id("weich2")})">${sch}</g>` + k;
  S.teil({ anker: [xAt(-ZY, 38), yAt(38, 3)], id: "zypresse", de: "die Zypresse", syl: "zy-PRES-se", it: "il cipresso", itSyl: "ci-PRES-so", en: "cypress", x: 0, y: 0, kunst: k,
    tipp: "Zypressen bleiben immer grün. In persischen Gärten stehen sie für das ewige Leben." });
}

/* =====================================================================
   13 — DER PFAU, 14 — DER SARI (Besucherin), 15 — DER FOTOGRAF,
   16 — DAS PALMENHÖRNCHEN, 17 — DER PAPAGEI, 18 — DIE TERRASSE (vorne)
   ===================================================================== */
{
  /* Pfau auf dem rechten Weg, Schleppe nach hinten */
  const d = 36, u = uAt(d), x = xAt(4.9, d), y = yAt(d);
  let k = `<ellipse cx="${r(-0.9 * u)}" cy=".2" rx="${r(1.1 * u)}" ry="${r(0.1 * u)}" fill="#2a1a10" opacity=".22"/>`;
  k += `<path d="M${r(0.1 * u)} ${r(-0.45 * u)} Q${r(-0.9 * u)} ${r(-0.5 * u)} ${r(-1.9 * u)} ${r(-0.12 * u)} Q${r(-1.2 * u)} ${r(-0.05 * u)} ${r(-0.1 * u)} ${r(-0.3 * u)} Z" fill="${S.lg("schleppe", [[0, "#2f6a4a"], [1, "#6a8a3a"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 7; i++) { const t = 0.25 + i * 0.1; k += `<circle cx="${r(-t * 1.9 * u)}" cy="${r(-0.38 * u + t * 0.24 * u)}" r="${r(0.07 * u)}" fill="#1f3a8a"/><circle cx="${r(-t * 1.9 * u)}" cy="${r(-0.38 * u + t * 0.24 * u)}" r="${r(0.035 * u)}" fill="#e2c03a"/>`; }
  k += `<ellipse cx="${r(0.15 * u)}" cy="${r(-0.48 * u)}" rx="${r(0.26 * u)}" ry="${r(0.19 * u)}" fill="#1f4a9a"/>`;
  k += `<path d="M${r(0.3 * u)} ${r(-0.6 * u)} Q${r(0.38 * u)} ${r(-0.85 * u)} ${r(0.42 * u)} ${r(-1.0 * u)}" stroke="#1f5ab0" stroke-width="${r(0.12 * u)}" stroke-linecap="round" fill="none"/>`;
  k += `<circle cx="${r(0.44 * u)}" cy="${r(-1.03 * u)}" r="${r(0.07 * u)}" fill="#1f5ab0"/><path d="M${r(0.5 * u)} ${r(-1.04 * u)} l${r(0.08 * u)} ${r(0.02 * u)}" stroke="#c9b48a" stroke-width=".3"/>`;
  for (let i = -1; i <= 1; i++) k += `<line x1="${r(0.43 * u)}" y1="${r(-1.08 * u)}" x2="${r((0.43 + i * 0.05) * u)}" y2="${r(-1.22 * u)}" stroke="#1f5ab0" stroke-width=".2"/><circle cx="${r((0.43 + i * 0.05) * u)}" cy="${r(-1.23 * u)}" r=".3" fill="#2f7ac0"/>`;
  k += `<path d="M${r(0.1 * u)} ${r(-0.3 * u)} L${r(0.06 * u)} 0 M${r(0.22 * u)} ${r(-0.3 * u)} L${r(0.26 * u)} 0" stroke="#8a7a6a" stroke-width=".35"/>`;
  S.teil({ id: "pfau", de: "der Pfau", syl: "PFAU", it: "il pavone", itSyl: "pa-VO-ne", en: "peacock", x, y, steht: true, kunst: k + flaeche(-2 * u, -1.3 * u, 2.6 * u, 1.35 * u),
    tipp: "Der Pfau ist der Nationalvogel Indiens. Das Männchen hat die lange, bunte Schleppe." });
}
{
  /* Besucherin im Sari, auf dem linken Weg zum Taj unterwegs (von hinten) */
  const d = 23, u = uAt(d), x = xAt(-4.3, d), y = yAt(d);
  const m = B.mensch({ id: "ind_sari", geschlecht: "w", pose: "gehen", blick: 196, frisur: "zopf", haarfarbe: "schwarz", haut: "mittel",
    kleidung: { oberteil: { stueck: "bluse", farbe: "gelb" }, unterteil: { stueck: "rock", farbe: "orange" }, schuhe: { stueck: "sandale", farbe: "braun" } } }, 1.6 * u);
  const p = (n) => { const q = m.z.punkte[n]; return [q[0] * m.k, q[1] * m.k]; };
  const [sLx, sLy] = p("schulterL"), [sRx, sRy] = p("schulterR"), [hLx, hLy] = p("huefteL"), [hRx, hRy] = p("huefteR"), [kLx] = p("knoechelL"), [kRx] = p("knoechelR");
  /* bodenlanger Rock mit Falten, dann das über die linke Schulter gelegte Ende (Pallu) mit Goldkante */
  const rx0 = Math.min(hLx, hRx) - 1.2, rx1 = Math.max(hLx, hRx) + 1.2, ry0 = Math.min(hLy, hRy) - 1, fl = Math.min(kLx, kRx) - 2.6, fr = Math.max(kLx, kRx) + 2.6;
  let sari = `<path d="M${r(rx0)} ${r(ry0)} L${r(rx1)} ${r(ry0)} L${r(fr)} -1 Q${r((fl + fr) / 2)} .4 ${r(fl)} -1 Z" fill="${S.lg("sari", [[0, "#e0571e"], [0.6, "#c8401a"], [1, "#9a2a10"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 5; i++) sari += `<line x1="${r(rx0 + (rx1 - rx0) * i / 5)}" y1="${r(ry0 + 2)}" x2="${r(fl + (fr - fl) * i / 5)}" y2="-1.2" stroke="#9a2a10" stroke-width=".35" opacity=".7"/>`;
  sari += `<path d="M${r(fl)} -1 Q${r((fl + fr) / 2)} .4 ${r(fr)} -1" stroke="#e8c04a" stroke-width=".9" fill="none"/>`;
  sari += `<path d="M${r(sLx - 0.6)} ${r(sLy - 0.8)} Q${r(sLx + 1.6)} ${r(sLy - 1.4)} ${r(sRx + 1)} ${r(sRy + 3)} Q${r(sRx + 1.4)} ${r((sRy + hRy) / 2 + 4)} ${r(rx1 + 0.6)} ${r(hRy + 7)} L${r(rx0 + 2)} ${r(hRy + 8)} Q${r(sLx - 1)} ${r(sLy + 10)} ${r(sLx - 1.4)} ${r(sLy + 1)} Z" fill="${S.lg("pallu", [[0, "#d23a22"], [1, "#a8261a"]])}"/>`;
  sari += `<path d="M${r(rx0 + 2)} ${r(hRy + 8)} L${r(rx1 + 0.6)} ${r(hRy + 7)}" stroke="#e8c04a" stroke-width="1" fill="none"/><path d="M${r(rx0 + 2.4)} ${r(hRy + 6.4)} L${r(rx1 + 0.2)} ${r(hRy + 5.4)}" stroke="#e8c04a" stroke-width=".35" fill="none"/>`;
  for (let i = 0; i < 6; i++) sari += `<circle cx="${r(sLx + 0.6 + i * (sRx - sLx) / 6)}" cy="${r(sLy + 3 + i * 1.4)}" r=".3" fill="#f2d36a"/>`;
  S.teil({ id: "sari", de: "der Sari", syl: "SA-ri", it: "il sari", itSyl: "SA-ri", en: "sari", x, y, kunst: m.svg + sari,
    tipp: "Der Sari ist ein 4 bis 8 Meter langes Tuch. Er wird um den Körper gewickelt, das Ende liegt über der Schulter." });
}
{
  /* Fotograf auf dem rechten Weg, mit Kamera */
  const d = 19.5, u = uAt(d), x = xAt(4.5, d), y = yAt(d);
  const m = B.mensch({ id: "ind_foto", geschlecht: "m", pose: "halten", blick: -68, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.7 * u);
  const hand = [m.z.handL, m.z.handR].sort((a, b) => a.x - b.x)[0];
  const hx = hand.x * m.k, hy = hand.y * m.k;
  let kam = `<g transform="translate(${r(hx - 1)} ${r(hy - 2.6)})"><rect x="-3.4" y="-2.2" width="6.8" height="4.4" rx=".8" fill="#1e1e20"/><circle cx="-2.6" cy="0" r="2" fill="#2b2b2e" stroke="#555" stroke-width=".3"/><circle cx="-2.6" cy="0" r="1" fill="#3a5a7a"/><rect x="1.4" y="-3" width="2" height=".9" fill="#1e1e20"/></g>`;
  kam += `<path d="M${r(hx + 2)} ${r(hy - 3)} Q${r(hx + 5)} ${r(hy - 10)} ${r(hx + 8)} ${r(hy - 15)}" stroke="#2a2a2a" stroke-width=".35" fill="none"/>`;
  S.teil({ id: "fotograf", de: "der Fotograf", syl: "fo-to-GRAF", it: "il fotografo", itSyl: "fo-TO-gra-fo", en: "photographer", x, y, kunst: m.svg + kam,
    tipp: "Am Taj arbeiten viele Fotografen. Sie machen von den Besuchern ein Bild mit dem Taj im Hintergrund." });
}
{
  /* Terrasse des Haupttors: roter Sandstein mit weißer Marmor-Einlage, vorne die Kante */
  const yK = yAt(8, 1.5);     /* 247 */
  let k = `<rect x="0" y="${r(yK)}" width="400" height="${r(260 - yK)}" fill="${S.lg("torterrasse", [[0, "#b25a3a"], [1, "#8a3e26"]])}"/>`;
  k += `<rect x="0" y="${r(yK)}" width="400" height="1.6" fill="#f3ebe2"/><rect x="0" y="${r(yK + 1.6)}" width="400" height=".6" fill="#5a2a18" opacity=".6"/>`;
  /* Sternmuster aus weißem Marmor (verkürzt gesehen) */
  for (let i = -12; i <= 12; i++) {
    const x = CX + i * 15, y = yK + 7;
    k += `<path d="M${r(x - 6)} ${r(y)} L${r(x)} ${r(y - 2)} L${r(x + 6)} ${r(y)} L${r(x)} ${r(y + 2)} Z" fill="none" stroke="#ead8c8" stroke-width=".45" opacity=".8"/><path d="M${r(x - 2.6)} ${r(y)} L${r(x)} ${r(y - 0.9)} L${r(x + 2.6)} ${r(y)} L${r(x)} ${r(y + 0.9)} Z" fill="#ead8c8" opacity=".7"/>`;
  }
  k += `<rect x="0" y="${r(yK + 11)}" width="400" height=".8" fill="#f3ebe2" opacity=".8"/>`;
  k += `<rect x="0" y="${r(yK)}" width="400" height="${r(260 - yK)}" fill="${S.lg("terrassenlicht", [[0, "#000", 0.25], [0.5, "#000", 0], [1, "#ffd9a0", 0.15]], 0, 0, 1, 0)}"/>`;
  S.teil({ anker: [300, 254], id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: 0, y: 0, kunst: k,
    tipp: "Hinter uns steht das große Tor aus rotem Sandstein. Aus seinem Bogen sieht man den Taj zum ersten Mal." });
}
{
  /* Palmenhörnchen: drei helle Streifen auf dem Rücken, buschiger Schwanz */
  const u = uAt(7.8);
  let k = `<ellipse cx="0" cy=".2" rx="9" ry="1" fill="#2a1408" opacity=".3"/>`;
  k += `<path d="M-6 -2 Q-12 -6 -11 -12 Q-10 -15 -7 -14 Q-9 -10 -6 -6 Z" fill="#7a6a5a"/><path d="M-7.6 -13.4 Q-10 -10 -7 -6" stroke="#b9a890" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-6 0 Q-7 -5 -2 -6.4 Q3 -7 5 -4 Q6 -1 4 0 Z" fill="${S.lg("hoernchen", [[0, "#9a8670"], [1, "#6a5848"]])}"/>`;
  k += `<path d="M-5 -3.8 Q0 -6.6 4 -4.4 M-5.2 -2.6 Q0 -5.4 4.4 -3.2 M-5 -1.4 Q0 -4.2 4.6 -2" stroke="#efe4cf" stroke-width=".45" fill="none"/>`;
  k += `<ellipse cx="5.6" cy="-4.4" rx="2.2" ry="1.7" fill="#8a7660"/><circle cx="6.4" cy="-4.8" r=".45" fill="#1a1008"/><path d="M5 -6 l.4 -1.2 l.6 1" fill="#8a7660"/><circle cx="7.7" cy="-4.2" r=".35" fill="#3a2a20"/>`;
  k += `<path d="M3 0 l.6 -1.8 M4.6 0 l.2 -1.6" stroke="#5a4838" stroke-width=".6"/>`;
  void u;
  S.teil({ oben: true, id: "palmenhoernchen", de: "das Palmenhörnchen", syl: "PAL-men-hörn-chen", it: "lo scoiattolo delle palme", itSyl: "sco-IAT-to-lo DEL-le PAL-me", en: "palm squirrel", x: 62, y: 251, steht: true, kunst: k,
    tipp: "Das Palmenhörnchen hat drei Streifen. Eine Legende sagt: Der Gott Rama hat es gestreichelt." });
}
{
  /* zwei Halsbandsittiche im Flug */
  let k = "";
  for (const [x, y, s] of [[0, 0, 1], [16, 7, 0.8]]) {
    k += `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0 Q-1 -2 4 -1 Q7 -.6 8 .4 Q5 1.6 -1 1.4 Q-6 1.4 -12 3 Z" fill="#4cae3a"/><path d="M-2 -.4 Q1 -6 6 -7 Q3 -3 2 0 Z" fill="#3a9a2e"/><path d="M-2 .8 Q0 5 4 6.4 Q2 3 2 .8 Z" fill="#2f8a26"/>`;
    k += `<circle cx="6.6" cy="-.4" r="1.4" fill="#5cbe46"/><path d="M7.6 0 q1.4 .2 1.2 1.4 q-.8 -.2 -1.4 -.6 Z" fill="#c8321e"/><path d="M5.6 .6 q.8 .8 2 .4" stroke="#1a1a1a" stroke-width=".3" fill="none"/><circle cx="7" cy="-.8" r=".25" fill="#111"/></g>`;
  }
  S.teil({ oben: true, id: "papagei", de: "der Papagei", syl: "pa-pa-GEI", it: "il pappagallo", itSyl: "pap-pa-GAL-lo", en: "parrot", x: 64, y: 44, kunst: `<g transform="scale(.7)">${k}</g>` + flaeche(-10, -6.4, 27, 14),
    tipp: "Grüne Halsbandsittiche fliegen laut kreischend in Scharen über den Garten." });
}

/* VORNE: Morgenlicht und ein Hauch Dunst über dem Wasser (fängt keinen Tipp ab) */
S.davor(`<rect x="0" y="0" width="400" height="260" fill="${S.lg("morgenlicht", [[0, "#000", 0.04], [0.55, "#fff", 0], [1, "#ffd9a8", 0.12]], 0, 0, 1, 0)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/indien.js"));
console.log(aus);
