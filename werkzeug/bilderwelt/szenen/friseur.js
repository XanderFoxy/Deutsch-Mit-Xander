#!/usr/bin/env node
/* =====================================================================
   DER FRISEUR (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Salonplanung/Ladenbau für Friseure, BGW „Hygiene im
   Friseursalon“, Händler für Salonmöbel) — so ist ein deutscher Salon
   heute aufgebaut:
   - BEDIENPLATZ: großer Wandspiegel (oft bis fast zum Boden), davor der
     hydraulische Friseurstuhl auf runder Chromplatte; mit dem PEDAL wird
     er hochgepumpt, drehbar, mit Armlehnen. Der Kunde trägt einen
     UMHANG, die Ersatzumhänge hängen am Haken neben dem Spiegel.
   - Neben dem Platz der ROLLWAGEN (Arbeitswagen) mit Schere, Kamm,
     Rundbürste, Sprühflasche, Haarklammern, Haarschneidemaschine; der
     Föhn hängt seitlich im Halter.
   - WASCHPLATZ mit Rückwärtswäsche: Waschsessel, dahinter das
     (meist schwarze) Keramikbecken mit Nackenmulde, Brause und
     Mischbatterie. Darüber das Fach mit Handtüchern (dunkel, wegen der
     Farbe) und den Pumpflaschen Shampoo/Spülung, Haarspray, Haarfarbe.
   - TROCKENHAUBE auf Rollenstativ neben einem Sessel (für Farbe und
     Wickler), meist am Fenster.
   - WARTEBEREICH am Eingang: Sofa, Zeitschriften, die PREISLISTE an der
     Wand (Waschen · Schneiden · Föhnen).
   - Warmes Licht (Pendelleuchten), Holz-Lamellenwand, Dielenboden; auf
     dem Boden unter dem Stuhl liegen die geschnittenen Haare.
   Maßstab: Rückwand ≈ 45 Einheiten je Meter, vorne (Stuhl, Friseurin)
   ≈ 58–60 je Meter. Friseurin 1,66 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "friseur", titel: "Der Friseur", emoji: "💇", thema: "Alltag", kuerzel: "b04a", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;
/* Spiegelbild klein und gedämpft: Zentimeter-genau reicht, die Datei bleibt klein */
const grob = (svg) => svg.replace(/ d="([^"]*)"/g, (m, d) => ' d="' + d.replace(/(-?\d+)\.\d+/g, (z) => String(Math.round(parseFloat(z)))) + '"');

/* ---------- Grundfarben und Stoffe ---------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("glow")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
const WAND = S.lg("wand", [[0, "#efe9e0"], [0.6, "#e7dfd3"], [1, "#dcd2c4"]]);
const DECKE = S.lg("decke", [[0, "#f2efea"], [1, "#e4dfd7"]]);
const EICHE = S.lg("eiche", [[0, "#d2ab78"], [0.5, "#c19563"], [1, "#a97e4f"]], 0, 0, 1, 0);
const EICHE_H = S.lg("eicheh", [[0, "#d8b483"], [1, "#b48a58"]]);
const LEDER = S.lg("leder", [[0, "#45454b"], [0.35, "#26262b"], [1, "#121215"]], 0, 0, 1, 0);
const LEDER_V = S.lg("lederv", [[0, "#3c3c42"], [1, "#151518"]]);
const CHROM = S.lg("chrom", [[0, "#f4f6f8"], [0.4, "#c3c9ce"], [0.55, "#9ea6ad"], [1, "#e4e8eb"]], 0, 0, 1, 0);
const SAMT = S.lg("samt", [[0, "#4f7d67"], [0.6, "#3b6551"], [1, "#2b4c3d"]]);
const PLASTIK = S.lg("plastik", [[0, "#3b3d42"], [0.5, "#2a2c30"], [1, "#1b1c1f"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Decke, Wände (Putz, Holz-Lamellen hinter dem Spiegel), Dielen
   ===================================================================== */
const WU = 124;                // Fuß der Rückwand
const VPX = 160, VPY = 38;     // Fluchtpunkt der Dielen
S.hinten(`<rect x="0" y="0" width="320" height="13" fill="${DECKE}"/><rect x="0" y="12" width="320" height="1.6" fill="#d3ccc1"/>`);
for (const x of [60, 160, 240]) S.hinten(`<ellipse cx="${x}" cy="6" rx="3.4" ry="1" fill="#fffbef"/><ellipse cx="${x}" cy="6" rx="8" ry="2.4" fill="#fff6dc" opacity=".3"/>`);
S.hinten(`<rect x="0" y="13.6" width="320" height="${WU - 13.6}" fill="${WAND}"/>`);
S.hinten(`<rect x="0" y="13.6" width="320" height="${WU - 13.6}" fill="${S.rg("wandlicht", [[0, "#fff8e8", 0.5], [1, "#fff8e8", 0]], 0.3, 0.1, 0.8)}"/>`);
{
  let p = "";
  for (let i = 0; i < 90; i++) {
    const x = rnd() * 320, y = 14 + rnd() * (WU - 14);
    if (x > 122 && x < 248) continue;
    p += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.3 + rnd() * 0.5)}" fill="${rnd() < 0.5 ? "#d4c9b8" : "#f8f3ea"}" opacity=".5"/>`;
  }
  S.hinten(p);
}
/* Holz-Lamellenwand hinter dem Bedienplatz (Akustikpaneel, Eiche auf Schwarz) */
S.def(`<pattern id="${S.id("lamellen")}" patternUnits="userSpaceOnUse" width="3.4" height="200"><rect width="3.4" height="200" fill="#23201d"/><rect x=".5" width="2.3" height="200" fill="${EICHE}"/><rect x=".5" width=".5" height="200" fill="#e6c594" opacity=".5"/></pattern>`);
S.hinten(`<rect x="124" y="13.6" width="122" height="${WU - 13.6}" fill="url(#${S.id("lamellen")})"/>`);
S.hinten(`<rect x="124" y="13.6" width="122" height="${WU - 13.6}" fill="${S.lg("lamschatten", [[0, "#000", 0.25], [0.3, "#000", 0], [1, "#000", 0.3]])}"/>`);
/* Sockelleiste */
S.hinten(`<rect x="0" y="${WU - 4}" width="124" height="4" fill="#f7f4ee"/><rect x="246" y="${WU - 4}" width="74" height="4" fill="#f7f4ee"/><rect x="0" y="${WU - 4}" width="320" height=".5" fill="#c9c0b2"/>`);
/* Dielenboden (Eiche) in Fluchtperspektive */
{
  const xAt = (x0, y) => VPX + (x0 - VPX) * (y - VPY) / (WU - VPY);
  const tone = ["#c49a69", "#b98e5e", "#cfa676", "#b48958", "#c7a06f"];
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="#bf9564"/>`;
  const B0 = 7;
  for (let i = -26; i < 26; i++) {
    const a = 160 + i * B0, b = a + B0;
    f += `<path d="M${r(a)} ${WU} L${r(b)} ${WU} L${r(xAt(b, 200))} 200 L${r(xAt(a, 200))} 200 Z" fill="${tone[(i + 52) % 5]}"/>`;
  }
  for (let i = -26; i <= 26; i++) { const a = 160 + i * B0; f += `<line x1="${r(a)}" y1="${WU}" x2="${r(xAt(a, 200))}" y2="200" stroke="#7e5a35" stroke-width=".3" opacity=".7"/>`; }
  const reihen = [129, 135, 142, 150, 159, 170, 183, 197];
  reihen.forEach((y, j) => {
    for (let i = -26; i < 26; i++) {
      if (((i * 7 + j * 3) % 5 + 5) % 5) continue;
      const a = 160 + i * B0;
      f += `<line x1="${r(xAt(a, y))}" y1="${y}" x2="${r(xAt(a + B0, y))}" y2="${y}" stroke="#7e5a35" stroke-width=".3" opacity=".7"/>`;
    }
  });
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bodenlicht", [[0, "#000", 0.22], [0.35, "#000", 0.02], [1, "#fff", 0.08]])}"/>`;
  f += `<rect x="0" y="${WU}" width="320" height="1" fill="#6e5236"/>`;
  S.hinten(f);
}
/* Lichtschein des Spiegels auf der Lamellenwand (LED hinter dem Spiegel) */
S.hinten(`<rect x="160" y="24" width="64" height="94" rx="6" fill="#fff1cf" opacity=".55" filter="url(#${S.id("glow")})"/>`);

/* =====================================================================
   DIE LAMPEN (drei Opalglas-Kugeln an Pendeln)
   ===================================================================== */
{
  let k = "";
  for (const x of [-116, -56, 80]) {
    k += `<line x1="${x}" y1="-19" x2="${x}" y2="-6" stroke="#2c2620" stroke-width=".45"/><rect x="${x - 1.2}" y="-7" width="2.4" height="2" rx=".4" fill="#b08a4e"/>`;
    k += `<circle cx="${x}" cy="0" r="9" fill="#fff6dc" opacity=".22" filter="url(#${S.id("glow")})"/>`;
    k += `<circle cx="${x}" cy="0" r="5" fill="${S.rg("opal", [[0, "#ffffff"], [0.6, "#fff6e0"], [1, "#e9dcc0"]], 0.4, 0.35, 0.7)}"/>`;
    k += `<ellipse cx="${x - 1.6}" cy="-1.8" rx="1.4" ry=".9" fill="#fff" opacity=".8"/>`;
  }
  S.teil({ id: "lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: 156, y: 20, kunst: k });
}

/* =====================================================================
   DIE UHR und DIE PREISLISTE (Wartebereich, linke Wand)
   ===================================================================== */
{
  let k = `<circle r="6.6" fill="#2b2622"/><circle r="5.8" fill="${S.rg("zb", [[0, "#ffffff"], [1, "#eee8de"]])}"/>`;
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, d1 = 5, d2 = i % 3 ? 4.4 : 3.8;
    k += `<line x1="${r(Math.sin(a) * d1)}" y1="${r(-Math.cos(a) * d1)}" x2="${r(Math.sin(a) * d2)}" y2="${r(-Math.cos(a) * d2)}" stroke="#2b2622" stroke-width="${i % 3 ? 0.3 : 0.55}"/>`;
  }
  /* zehn nach drei am Nachmittag */
  k += `<line x1="0" y1="0" x2="${r(Math.sin(3.17 * Math.PI / 6) * 2.9)}" y2="${r(-Math.cos(3.17 * Math.PI / 6) * 2.9)}" stroke="#1d1712" stroke-width=".7" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(2 * Math.PI / 6) * 4.3)}" y2="${r(-Math.cos(2 * Math.PI / 6) * 4.3)}" stroke="#1d1712" stroke-width=".45" stroke-linecap="round"/><circle r=".5" fill="#b3261e"/>`;
  k += `<path d="M-4 -4.2 A5.8 5.8 0 0 1 3 -5" stroke="#fff" stroke-width=".6" opacity=".6" fill="none"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 54, y: 30, kunst: k });
}
{
  let k = `<rect x="-19" y="-25" width="38" height="50" rx="1" fill="#2a2522"/>`;
  k += `<rect x="-17.6" y="-23.6" width="35.2" height="47.2" fill="${S.lg("pl", [[0, "#fbf9f5"], [1, "#efeae2"]])}"/>`;
  k += `<text x="0" y="-16.6" font-size="4.6" text-anchor="middle" fill="#2a2522" font-family="Georgia,'Times New Roman',serif" font-style="italic">Preise</text>`;
  k += `<line x1="-8" y1="-14.4" x2="8" y2="-14.4" stroke="#b08a4e" stroke-width=".35"/>`;
  const zeilen = [["Damen", ""], ["Schneiden &amp; Föhnen", "52 €"], ["Föhnen / Legen", "28 €"], ["Herren", ""], ["Waschen · Schneiden", "29 €"], ["Maschinenschnitt", "18 €"], ["Kinder bis 12 Jahre", "16 €"], ["Farbe", ""], ["Färben", "ab 45 €"], ["Strähnchen", "ab 59 €"]];
  let y = -10;
  for (const [t, p] of zeilen) {
    if (!p) { k += `<text x="-15.6" y="${r(y)}" font-size="2.5" fill="#8a6a3a" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".2">${t.toUpperCase()}</text>`; y += 3.3; continue; }
    k += `<text x="-15.6" y="${r(y)}" font-size="2.15" fill="#2a2522" font-family="Arial,sans-serif">${t}</text><text x="15.6" y="${r(y)}" font-size="2.15" text-anchor="end" fill="#2a2522" font-family="Arial,sans-serif" font-weight="bold">${p}</text>`;
    y += 3.6;
  }
  S.teil({ id: "preisliste", de: "die Preisliste", syl: "PREIS-lis-te", it: "il listino prezzi", itSyl: "li-STI-no PREZ-zi", en: "price list", x: 27, y: 67, kunst: k,
    tipp: "Auf der Preisliste steht, was Waschen, Schneiden und Föhnen kosten." });
}

/* =====================================================================
   DAS REGAL über dem Waschplatz — Lupe: Handtücher, Shampoo, Spülung,
   Haarspray, Haarfarbe
   ===================================================================== */
{
  const X0 = 66, X1 = 118, Y0 = 36, Y1 = 76, W = X1 - X0, H = Y1 - Y0, cx = (X0 + X1) / 2;
  const cw = (W - 3) / 3, ch = (H - 3) / 2;
  let k = schatten(0, 1.5, W / 2, 2, 0.25);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx=".8" fill="${EICHE_H}"/>`;
  const fach = (c, rr) => [-W / 2 + 1.5 + c * cw, -H + 1.5 + rr * ch];
  for (let c = 0; c < 3; c++) for (let q = 0; q < 2; q++) {
    const [fx, fy] = fach(c, q);
    k += `<rect x="${r(fx + 0.6)}" y="${r(fy + 0.6)}" width="${r(cw - 1.2)}" height="${r(ch - 1.2)}" fill="${S.lg("fachin", [[0, "#5b4027"], [1, "#7a5734"]])}"/>`;
    k += `<rect x="${r(fx + 0.6)}" y="${r(fy + 0.6)}" width="${r(cw - 1.2)}" height="2" fill="#2d1f12" opacity=".35"/>`;
  }
  const unter = [];
  /* Handtücher (gerollt, anthrazit und grau) — zwei Fächer oben links */
  {
    let g = "";
    for (let c = 0; c < 2; c++) {
      const [fx, fy] = fach(c, 0), bx = fx + cw / 2, by = fy + ch - 0.6;
      const rolle = (x, y, f) => `<circle cx="${r(x)}" cy="${r(y)}" r="2.9" fill="${f}"/><path d="M${r(x)} ${r(y)} m0 -1.2 a1.2 1.2 0 1 1 -1.1 .8 a2.1 2.1 0 1 0 2.2 -1.8" stroke="#000" stroke-width=".3" opacity=".35" fill="none"/>`;
      const f1 = c ? "#5d6066" : "#2f3135", f2 = c ? "#6d7076" : "#3c3e43";
      g += rolle(bx - 5.6, by - 2.9, f1) + rolle(bx, by - 2.9, f2) + rolle(bx + 5.6, by - 2.9, f1);
      g += rolle(bx - 2.8, by - 8.2, f2) + rolle(bx + 2.8, by - 8.2, f1) + rolle(bx, by - 13.4, f2);
    }
    k += g;
    const [fx, fy] = fach(0, 0);
    unter.push({ id: "handtuch_fr", de: "das Handtuch", syl: "HAND-tuch", it: "l'asciugamano", itSyl: "a-sciu-ga-MA-no", en: "towel",
      x: cx + fx + cw, y: Y1 + fy + ch, kunst: flaeche(-cw + 0.6, -ch + 0.6, cw * 2 - 1.2, ch - 1.2),
      tipp: "Im Salon sind die Handtücher oft dunkel – so sieht man keine Farbflecken." });
  }
  /* Shampoo: große Pumpflaschen */
  const pumpe = (x, y, h, f, etikett) => `<rect x="${r(x - 2)}" y="${r(y - h)}" width="4" height="${h}" rx="1" fill="${f}"/><rect x="${r(x - 2)}" y="${r(y - h * 0.62)}" width="4" height="${r(h * 0.32)}" fill="${etikett}"/><rect x="${r(x - 0.5)}" y="${r(y - h - 2.4)}" width="1" height="2.4" fill="#e9e9e9"/><path d="M${r(x - 0.5)} ${r(y - h - 2.4)} h2.6 v.8 h-2.6 Z" fill="#e9e9e9"/><rect x="${r(x - 1.6)}" y="${r(y - h + 0.4)}" width=".7" height="${r(h - 1)}" fill="#fff" opacity=".25"/>`;
  {
    const [fx, fy] = fach(2, 0), by = fy + ch - 0.6, bx = fx + cw / 2;
    k += pumpe(bx - 4.6, by, 12, "#f3f1ec", "#2b6f6a") + pumpe(bx, by, 12, "#f3f1ec", "#2b6f6a") + pumpe(bx + 4.6, by, 12, "#f3f1ec", "#b58a3c");
    unter.push({ id: "shampoo", de: "das Shampoo", syl: "SHAM-poo", it: "lo shampoo", itSyl: "SHAM-po", en: "shampoo", x: cx + bx, y: Y1 + by, kunst: flaeche(-cw / 2 + 0.6, -ch + 1.2, cw - 1.2, ch - 1.2) });
  }
  {
    const [fx, fy] = fach(0, 1), by = fy + ch - 0.6, bx = fx + cw / 2;
    /* Spülung: Tuben, die auf dem Deckel stehen */
    for (const [dx, f] of [[-4.4, "#e8d7c6"], [0, "#d9c2ad"], [4.4, "#e8d7c6"]]) {
      k += `<path d="M${r(bx + dx - 1.9)} ${r(by - 13)} L${r(bx + dx + 1.9)} ${r(by - 13)} L${r(bx + dx + 1.6)} ${r(by - 2)} L${r(bx + dx - 1.6)} ${r(by - 2)} Z" fill="${f}"/><rect x="${r(bx + dx - 1.4)}" y="${r(by - 2)}" width="2.8" height="2" rx=".4" fill="#6b4f3a"/><rect x="${r(bx + dx - 1.8)}" y="${r(by - 9)}" width="3.6" height="1.2" fill="#8a5a3a"/>`;
    }
    unter.push({ id: "spuelung", de: "die Spülung", syl: "SPÜ-lung", it: "il balsamo", itSyl: "BAL-sa-mo", en: "conditioner", x: cx + bx, y: Y1 + by, kunst: flaeche(-cw / 2 + 0.6, -ch + 1.2, cw - 1.2, ch - 1.2) });
  }
  {
    const [fx, fy] = fach(1, 1), by = fy + ch - 0.6, bx = fx + cw / 2;
    for (const dx of [-4.2, 0, 4.2]) {
      k += `<rect x="${r(bx + dx - 1.8)}" y="${r(by - 12)}" width="3.6" height="12" rx=".8" fill="${S.lg("dose", [[0, "#b9bfc5"], [0.4, "#f2f4f5"], [1, "#8d949a"]], 0, 0, 1, 0)}"/><rect x="${r(bx + dx - 1.8)}" y="${r(by - 9)}" width="3.6" height="5" fill="#7b2d4f"/><rect x="${r(bx + dx - 1.2)}" y="${r(by - 14)}" width="2.4" height="2" rx=".5" fill="#2a2a2e"/>`;
    }
    unter.push({ id: "haarspray", de: "das Haarspray", syl: "HAAR-spray", it: "la lacca", itSyl: "LAC-ca", en: "hairspray", x: cx + bx, y: Y1 + by, kunst: flaeche(-cw / 2 + 0.6, -ch + 1.2, cw - 1.2, ch - 1.2) });
  }
  {
    const [fx, fy] = fach(2, 1), by = fy + ch - 0.6, bx = fx + cw / 2;
    /* Haarfarbe: Schachteln mit Farbstreifen, davor eine Farbschale mit Pinsel */
    [["#3b2416", -4.8], ["#7a3f1e", -1.6], ["#c8913f", 1.6], ["#a3242e", 4.8]].forEach(([f, dx]) => {
      k += `<rect x="${r(bx + dx - 1.5)}" y="${r(by - 10)}" width="3" height="10" fill="#f6f3ee" stroke="#cfc8bd" stroke-width=".15"/><rect x="${r(bx + dx - 1.5)}" y="${r(by - 7.5)}" width="3" height="3" fill="${f}"/>`;
    });
    k += `<path d="M${r(bx - 3.6)} ${r(by - 2.4)} h7.2 l-1 2.4 h-5.2 Z" fill="#2b2b30"/><ellipse cx="${r(bx)}" cy="${r(by - 2.4)}" rx="3.6" ry=".6" fill="#6a2f1b"/><line x1="${r(bx + 1)}" y1="${r(by - 2.6)}" x2="${r(bx + 4.6)}" y2="${r(by - 7)}" stroke="#222" stroke-width=".7"/>`;
    unter.push({ id: "haarfarbe", de: "die Haarfarbe", syl: "HAAR-far-be", it: "la tinta per capelli", itSyl: "TIN-ta per ca-PEL-li", en: "hair dye", x: cx + bx, y: Y1 + by, kunst: flaeche(-cw / 2 + 0.6, -ch + 1.2, cw - 1.2, ch - 1.2),
      tipp: "Die Farbe wird in der Schale angerührt und mit dem Pinsel aufgetragen." });
  }
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="1" fill="#e9c995" opacity=".7"/>`;
  S.teil({ id: "regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: cx, y: Y1, kunst: k,
    zoom: { x: X0 - 4, y: Y0 - 2, w: W + 8, h: H + 4 }, unter });
}

/* =====================================================================
   DER UMHANG — Ersatzumhang am Haken neben dem Spiegel
   ===================================================================== */
{
  let k = `<rect x="-1.4" y="-52" width="2.8" height="3" rx=".6" fill="${CHROM}"/><path d="M0 -49 v2.4" stroke="#9aa3aa" stroke-width=".8"/>`;
  k += `<path d="M-2.5 -46.8 Q0 -48 2.5 -46.8 L6.5 -38 Q8.5 -20 7.8 0 Q4 1.6 0 .6 Q-4 1.6 -7.8 0 Q-8.5 -20 -6.5 -38 Z" fill="${S.lg("umhang", [[0, "#3a3b40"], [0.45, "#1f2024"], [1, "#2c2d32"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-4, -1.2, 2, 4.6]) k += `<path d="M${x * 0.6} -44 Q${x} -20 ${x * 1.25} -.5" stroke="#000" stroke-width=".45" opacity=".35" fill="none"/>`;
  k += `<path d="M-4.6 -40 Q-5.4 -22 -5 -2" stroke="#fff" stroke-width=".5" opacity=".14" fill="none"/>`;
  k += `<path d="M-2.6 -47 Q0 -45.6 2.6 -47 L2.8 -45.4 Q0 -44 -2.8 -45.4 Z" fill="#d7d7d2"/>`;
  S.teil({ id: "umhang", de: "der Umhang", syl: "UM-hang", it: "la mantellina", itSyl: "man-tel-LI-na", en: "cape", x: 151, y: 86, kunst: k,
    tipp: "Der Umhang schützt die Kleidung vor den kleinen Haaren." });
}

/* =====================================================================
   DER SPIEGEL — großer Wandspiegel mit LED-Licht; darin spiegelt sich
   der Kunde (von vorn, kleiner und näher an der Bildmitte)
   ===================================================================== */
const SP = { x0: 162, x1: 222, y0: 24, y1: 116 };
const KUNDE = { x: 192, y: 163, h: 104 };
{
  const W = SP.x1 - SP.x0, H = SP.y1 - SP.y0, cx = (SP.x0 + SP.x1) / 2;
  const form = (e) => `M${-W / 2 + e} ${-e} L${-W / 2 + e} ${-H + 7 + e} Q${-W / 2 + e} ${-H + e} ${-W / 2 + 7 + e} ${-H + e} L${W / 2 - 7 - e} ${-H + e} Q${W / 2 - e} ${-H + e} ${W / 2 - e} ${-H + 7 + e} L${W / 2 - e} ${-e} Z`;
  S.def(`<clipPath id="${S.id("spclip")}"><path d="${form(1.4)}"/></clipPath>`);
  let k = `<path d="${form(0)}" fill="#141414"/>`;
  k += `<path d="${form(1.4)}" fill="${S.lg("spglas", [[0, "#cfd6d6"], [0.45, "#b9c1bf"], [1, "#9ea6a4"]])}"/>`;
  let innen = "";
  /* gespiegelt: die gegenüberliegende Wand mit Fenster und Lampe */
  innen += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H * 0.62}" fill="#d9d2c6" opacity=".55"/>`;
  innen += `<rect x="${-W / 2}" y="${r(-H * 0.38)}" width="${W}" height="${r(H * 0.38)}" fill="#a98a63" opacity=".45"/>`;
  innen += `<rect x="${-W / 2 + 6}" y="${-H + 12}" width="14" height="30" fill="#eef3f5" opacity=".55"/><line x1="${-W / 2 + 13}" y1="${-H + 12}" x2="${-W / 2 + 13}" y2="${-H + 42}" stroke="#8a8a8a" stroke-width=".6" opacity=".5"/>`;
  innen += `<circle cx="${W / 2 - 12}" cy="${-H + 9}" r="3" fill="#fff8e6" opacity=".8"/>`;
  /* Spiegelbild des Kunden: Rückenlehne (Vorderseite), Figur von vorn, Umhang */
  const k2 = 0.67;
  const rx = VPX + (KUNDE.x - VPX) * k2 - cx, kopfY = 60 + (KUNDE.y - 72 - 60) * k2;
  const fr = B.mensch({ id: "b04a_kspiegel", geschlecht: "m", pose: "sitzen", blick: 4, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel", bart: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh" } } }, KUNDE.h * k2);
  const oy = kopfY - fr.z.kopf.y * fr.k - SP.y1;
  innen += `<g transform="translate(${r(rx)} ${r(oy)})">`;
  innen += `<rect x="-11" y="-44" width="22" height="26" rx="3" fill="#1d1d21"/>`;
  innen += `<g transform="scale(-1,1)">${grob(fr.svg)}</g>`;
  const s2 = fr.k;
  innen += `<path d="M${r(-3 * s2)} ${r(-109 * s2)} Q0 ${r(-106 * s2)} ${r(3 * s2)} ${r(-109 * s2)} L${r(16 * s2)} ${r(-100 * s2)} Q${r(26 * s2)} ${r(-92 * s2)} ${r(28 * s2)} ${r(-30 * s2)} L${r(-28 * s2)} ${r(-30 * s2)} Q${r(-26 * s2)} ${r(-92 * s2)} ${r(-16 * s2)} ${r(-100 * s2)} Z" fill="#26272b"/>`;
  innen += `<path d="M${r(-3.4 * s2)} ${r(-110 * s2)} Q0 ${r(-106.5 * s2)} ${r(3.4 * s2)} ${r(-110 * s2)}" stroke="#d7d7d2" stroke-width="${r(1.6 * s2)}" fill="none"/>`;
  innen += `</g>`;
  k += `<g clip-path="url(#${S.id("spclip")})">${innen}`;
  /* Glanz: kühle Tönung und schräge Lichtstreifen */
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="#cfe2e6" opacity=".16"/>`;
  k += `<path d="M${-W / 2 + 8} 0 L${-W / 2 + 34} ${-H} L${-W / 2 + 44} ${-H} L${-W / 2 + 18} 0 Z" fill="#fff" opacity=".13"/><path d="M${W / 2 - 14} 0 L${W / 2 + 4} ${-H * 0.7} L${W / 2 + 4} ${-H * 0.55} L${W / 2 - 9} 0 Z" fill="#fff" opacity=".08"/></g>`;
  k += `<path d="${form(1.4)}" fill="none" stroke="#fff" stroke-width=".35" opacity=".5"/>`;
  S.teil({ id: "spiegel", de: "der Spiegel", syl: "SPIE-gel", it: "lo specchio", itSyl: "SPEC-chio", en: "mirror", x: cx, y: SP.y1, kunst: k,
    tipp: "Im Spiegel sieht der Kunde, wie der Schnitt wird." });
}

/* =====================================================================
   DAS SCHAUFENSTER (rechts) — Blick auf die Straße, Schrift spiegelverkehrt
   ===================================================================== */
{
  const X0 = 252, X1 = 316, Y0 = 22, Y1 = 110, W = X1 - X0, H = Y1 - Y0;
  let k = `<rect x="${-W / 2 - 2}" y="${-H - 2}" width="${W + 4}" height="${H + 4}" fill="#26282b"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("himmel", [[0, "#cfe0ec"], [1, "#eef2f2"]])}"/>`;
  /* gegenüberliegendes Haus mit Fenstern */
  k += `<rect x="${-W / 2}" y="${-H + 8}" width="${W}" height="${H - 22}" fill="${S.lg("haus", [[0, "#eadcc4"], [1, "#d9c7a8"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 8}" width="${W}" height="2" fill="#c6b08e"/>`;
  for (let c = 0; c < 4; c++) for (let q = 0; q < 3; q++) {
    const x = -W / 2 + 5 + c * 15.5, y = -H + 14 + q * 18;
    k += `<rect x="${r(x)}" y="${y}" width="8" height="11" fill="#7d8c96"/><rect x="${r(x)}" y="${y}" width="8" height="11" fill="none" stroke="#f4efe6" stroke-width=".9"/><line x1="${r(x + 4)}" y1="${y}" x2="${r(x + 4)}" y2="${y + 11}" stroke="#f4efe6" stroke-width=".5"/><rect x="${r(x - 0.8)}" y="${y + 11}" width="9.6" height="1" fill="#cbb896"/>`;
  }
  /* Gehweg, Bordstein, ein Fahrrad am Bügel */
  k += `<rect x="${-W / 2}" y="-14" width="${W}" height="14" fill="${S.lg("gehweg", [[0, "#a9a59e"], [1, "#8f8b84"]])}"/><rect x="${-W / 2}" y="-14" width="${W}" height="1" fill="#c8c4bc"/>`;
  k += `<g stroke="#2f3a44" stroke-width=".6" fill="none"><circle cx="-14" cy="-5" r="3.4"/><circle cx="-4" cy="-5" r="3.4"/><path d="M-14 -5 L-10.4 -10 L-6 -10 L-4 -5 M-10.4 -10 L-9 -5 L-6 -10 M-11 -11 h2 M-6 -10 l.6 -1.6 h1.4"/></g>`;
  /* Sprossen */
  k += `<rect x="-1" y="${-H}" width="2" height="${H}" fill="#26282b"/>`;
  /* Schrift auf dem Glas — von innen spiegelverkehrt */
  k += `<g transform="scale(-1,1)" fill="#ffffff" opacity=".88" font-family="Georgia,'Times New Roman',serif" text-anchor="middle"><text x="0" y="${-H + 22}" font-size="6.6" font-style="italic">Haarmonie</text><text x="0" y="${-H + 27}" font-size="2.4" letter-spacing=".5" font-family="Arial,sans-serif">DAMEN · HERREN · KINDER</text></g>`;
  /* Spiegelung */
  k += `<path d="M${-W / 2 + 4} 0 L${-W / 2 + 26} ${-H} L${-W / 2 + 36} ${-H} L${-W / 2 + 14} 0 Z" fill="#fff" opacity=".16"/><path d="M${W / 2 - 18} 0 L${W / 2 - 2} ${-H * 0.7} L${W / 2 - 2} ${-H * 0.5} L${W / 2 - 12} 0 Z" fill="#fff" opacity=".1"/>`;
  /* Fensterbank */
  k += `<rect x="${-W / 2 - 4}" y="2" width="${W + 8}" height="3" rx=".6" fill="${S.lg("bank", [[0, "#f6f3ee"], [1, "#d8d2c8"]])}"/>`;
  S.teil({ id: "schaufenster", de: "das Schaufenster", syl: "SCHAU-fens-ter", it: "la vetrina", itSyl: "ve-TRI-na", en: "shop window", x: (X0 + X1) / 2, y: Y1, kunst: k });
}
{
  /* DIE PFLANZE auf der Fensterbank */
  let k = schatten(0, 0, 5, .8, .25);
  k += `<path d="M-4.2 -8 L4.2 -8 L3.4 0 L-3.4 0 Z" fill="${S.lg("topf", [[0, "#efe9df"], [1, "#cfc5b6"]], 0, 0, 1, 0)}"/><rect x="-4.5" y="-8.6" width="9" height="1.2" rx=".4" fill="#e7e0d4"/>`;
  const blatt = (x, y, a, s, f) => `<path d="M0 0 Q${r(-3 * s)} ${r(-4 * s)} 0 ${r(-9 * s)} Q${r(3 * s)} ${r(-4 * s)} 0 0 Z" fill="${f}" transform="translate(${x} ${y}) rotate(${a})"/><path d="M0 0 L0 ${r(-8 * s)}" stroke="#2b5a2e" stroke-width=".25" transform="translate(${x} ${y}) rotate(${a})"/>`;
  for (const [a, s, f] of [[-55, 1.1, "#3f7d43"], [-28, 1.3, "#4e9150"], [-5, 1.5, "#3a7540"], [20, 1.35, "#4e9150"], [48, 1.1, "#3f7d43"], [-40, 0.9, "#5aa05b"], [35, 0.95, "#5aa05b"]]) k += blatt(0, -8.4, a, s, f);
  S.teil({ oben: true, id: "pflanze", de: "die Pflanze", syl: "PFLAN-ze", it: "la pianta", itSyl: "PIAN-ta", en: "plant", x: 258, y: 112.4, steht: true, kunst: k });
}

/* =====================================================================
   DAS WASCHBECKEN — Rückwärtswäsche: Becken hinten, Waschsessel davor
   ===================================================================== */
{
  let k = schatten(0, 0, 24, 2.2, 0.32);
  /* Säule und schwarzes Keramikbecken (hinten, an der Wand) */
  k += `<rect x="-9" y="-58" width="18" height="30" fill="#1f1f22"/>`;
  k += `<path d="M-15 -60 Q-15 -50 -6 -48 L6 -48 Q15 -50 15 -60 Z" fill="${S.lg("becken", [[0, "#3d3d42"], [0.5, "#1c1c20"], [1, "#0e0e10"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-60" rx="15" ry="3" fill="#2a2a2f"/><ellipse cx="0" cy="-60.3" rx="12.6" ry="2.1" fill="#0b0b0d"/>`;
  k += `<path d="M-4.5 -58.4 Q0 -55 4.5 -58.4" stroke="#55555c" stroke-width="1.4" fill="none"/>`;
  k += `<path d="M-12 -61 Q-6 -63 2 -62.6" stroke="#fff" stroke-width=".5" opacity=".35" fill="none"/>`;
  /* Mischbatterie und Brause am hinteren Rand */
  k += `<rect x="-1" y="-66" width="2" height="5" fill="${CHROM}"/><path d="M0 -66 Q0 -70 4 -70 L6 -70" stroke="#c3c9ce" stroke-width="1.3" fill="none" stroke-linecap="round"/><rect x="-3.4" y="-64.4" width="6.8" height="1.3" rx=".6" fill="${CHROM}"/>`;
  k += `<rect x="7" y="-67" width="2" height="5.4" rx=".8" fill="#2a2a2e"/><rect x="6.6" y="-68.4" width="2.8" height="2" rx=".9" fill="${CHROM}"/><path d="M8 -61.6 Q11 -56 9 -50" stroke="#3a3a3e" stroke-width=".6" fill="none"/>`;
  /* Waschsessel (zur Kundschaft gedreht): Lehne, Sitz, Armlehnen, Sockel */
  k += `<path d="M-15 -26 L-12 -50 Q-11.6 -52 -9.6 -52 L9.6 -52 Q11.6 -52 12 -50 L15 -26 Z" fill="${LEDER_V}"/>`;
  for (const x of [-5, 0, 5]) k += `<path d="M${x * 0.8} -51 L${x} -27" stroke="#000" stroke-width=".4" opacity=".5"/>`;
  k += `<path d="M-9 -50.5 Q0 -52 9 -50.5" stroke="#fff" stroke-width=".5" opacity=".18" fill="none"/>`;
  k += `<rect x="-18" y="-28" width="36" height="7" rx="3" fill="${S.lg("sitzkissen", [[0, "#4a4a50"], [1, "#1b1b1f"]])}"/>`;
  for (const s of [-1, 1]) k += `<rect x="${s > 0 ? 15 : -22}" y="-35" width="7" height="16" rx="2.6" fill="${LEDER}"/><rect x="${s > 0 ? 15.6 : -21.4}" y="-34.6" width="5.8" height="1.4" rx=".7" fill="#fff" opacity=".14"/>`;
  k += `<rect x="-19" y="-21" width="38" height="17" rx="1.2" fill="${S.lg("sockel", [[0, "#2e2e33"], [1, "#151518"]])}"/><rect x="-19" y="-21" width="38" height="1" fill="#55555b"/>`;
  k += `<rect x="-17" y="-4" width="34" height="4" rx=".6" fill="${CHROM}"/>`;
  S.teil({ id: "waschbecken", de: "das Waschbecken", syl: "WASCH-be-cken", it: "il lavatesta", itSyl: "la-va-TE-sta", en: "backwash basin", x: 92, y: 150, steht: true, kunst: k,
    tipp: "Bei der Rückwärtswäsche liegt der Kopf nach hinten im Becken – so läuft kein Wasser ins Gesicht." });
}

/* =====================================================================
   DAS SOFA im Wartebereich und DIE ZEITSCHRIFT darauf
   ===================================================================== */
{
  let k = schatten(0, 0, 30, 2.2, 0.3);
  for (const x of [-24, 24]) k += `<path d="M${x - 1} 0 L${x - 0.4} -7 L${x + 1.4} -7 L${x + 1} 0 Z" fill="#7a5530"/>`;
  k += `<rect x="-29" y="-24" width="58" height="17.4" rx="2.6" fill="${SAMT}"/>`;
  k += `<rect x="-24" y="-44" width="48" height="24" rx="4" fill="${S.lg("samtr", [[0, "#477460"], [1, "#2e5142"]])}"/>`;
  for (const s of [-1, 1]) k += `<rect x="${r(s * 12 - 11.4)}" y="-42" width="22.8" height="20" rx="4" fill="${S.lg("ruecken", [[0, "#5a8b73"], [0.5, "#44725d"], [1, "#355d4a"]])}"/>`;
  for (const s of [-1, 1]) k += `<rect x="${r(s * 12 - 11.6)}" y="-24.6" width="23.2" height="7.2" rx="2.6" fill="${S.lg("kissen", [[0, "#5c8d75"], [1, "#3a6450"]])}"/>`;
  for (const x of [-29, 22]) k += `<rect x="${x}" y="-33" width="7" height="26" rx="3.4" fill="${S.lg("arm", [[0, "#3e6a55"], [0.4, "#5a8b73"], [1, "#2e5142"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-20 -41 Q-12 -42.4 -4 -41" stroke="#fff" stroke-width=".6" opacity=".2" fill="none"/>`;
  S.teil({ id: "sofa", de: "das Sofa", syl: "SO-fa", it: "il divano", itSyl: "di-VA-no", en: "sofa", x: 30, y: 150, steht: true, kunst: k });
}
{
  /* Zeitschriften auf dem rechten Sitzkissen, die obere schräg */
  let k = "";
  k += `<path d="M-7 0 L6 0 L6.6 -1.4 L-6.4 -1.4 Z" fill="#e9e4da"/><path d="M-6.6 -1.4 L6.4 -1.4 L7 -2.6 L-6 -2.6 Z" fill="#c94b3a"/>`;
  k += `<g transform="rotate(-8 0 -3)"><path d="M-6 -2.6 L6.4 -2.6 L6.4 -4 L-6 -4 Z" fill="#f4f1ea"/><path d="M-6 -4 L6.4 -4 L6.4 -4.9 L-6 -4.9 Z" fill="#3c6e9e"/></g>`;
  S.teil({ oben: true, id: "zeitschrift", de: "die Zeitschrift", syl: "ZEIT-schrift", it: "la rivista", itSyl: "ri-VI-sta", en: "magazine", x: 42, y: 125.6, steht: true, kunst: k + flaeche(-7.5, -7, 15, 7.6),
    tipp: "Beim Warten blättert man in einer Zeitschrift." });
}

/* =====================================================================
   DIE TROCKENHAUBE (Rollenstativ), DER SESSEL, DIE KUNDIN darunter
   ===================================================================== */
const HAUBE = { x: 287, sessel: 164 };
const kundinFig = B.mensch({ id: "b04a_kundin", geschlecht: "w", pose: "lesen", blick: 6, frisur: "locken", haarfarbe: "braun", haut: "oliv", laecheln: true,
  kleidung: { oberteil: { stueck: "bluse", farbe: "#8b3f5e" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 94);
const kundinOrigin = { x: HAUBE.x, y: HAUBE.sessel - 25 - kundinFig.z.sitz.y * kundinFig.k };
const kopf = { x: kundinOrigin.x + kundinFig.z.kopf.x * kundinFig.k, y: kundinOrigin.y + kundinFig.z.kopf.y * kundinFig.k };
{
  /* Stativ rechts neben dem Sessel; Arm und Haube über dem Kopf */
  const sx = 310, sy = 152;
  let k = schatten(0, 0, 9, 1.2, 0.3);
  for (const a of [-1, -0.45, 0.35, 1]) k += `<path d="M0 -2 L${r(a * 8)} ${r(Math.abs(a) < 0.5 ? 0.6 : -0.4)}" stroke="#2a2b2f" stroke-width="1.4" stroke-linecap="round"/><circle cx="${r(a * 8)}" cy="${r(Math.abs(a) < 0.5 ? 1 : 0)}" r="1" fill="#141416"/>`;
  k += `<rect x="-.8" y="${r(kopf.y - 8 - sy)}" width="1.6" height="${r(sy - kopf.y + 6)}" fill="${CHROM}"/>`;
  const hx = kopf.x - sx, hy = kopf.y - sy;
  k += `<path d="M0 ${r(hy - 6)} L${r(hx + 13)} ${r(hy - 6)}" stroke="#c3c9ce" stroke-width="1.6" stroke-linecap="round"/>`;
  /* Gehäuse der Haube (Rückseite und Rand) */
  k += `<path d="M${r(hx - 14)} ${r(hy + 6)} Q${r(hx - 15)} ${r(hy - 14)} ${r(hx)} ${r(hy - 15)} Q${r(hx + 15)} ${r(hy - 14)} ${r(hx + 14)} ${r(hy + 6)} Z" fill="${S.lg("haube", [[0, "#f2f0ec"], [0.5, "#d8d4cd"], [1, "#a9a49c"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="${r(hx)}" cy="${r(hy + 5)}" rx="12.4" ry="3" fill="#3a3632"/>`;
  k += `<rect x="${r(hx + 9)}" y="${r(hy - 9)}" width="4.2" height="6" rx=".8" fill="#2a2b2f"/><circle cx="${r(hx + 11.1)}" cy="${r(hy - 6)}" r="1.2" fill="#e88a3a"/>`;
  k += `<path d="M${r(hx - 11)} ${r(hy - 8)} Q${r(hx - 7)} ${r(hy - 13.4)} ${r(hx)} ${r(hy - 13.6)}" stroke="#fff" stroke-width=".7" opacity=".6" fill="none"/>`;
  S.teil({ id: "trockenhaube", de: "die Trockenhaube", syl: "TRO-cken-hau-be", it: "il casco asciugacapelli", itSyl: "CA-sco a-sciu-ga-ca-PEL-li", en: "hood dryer", x: sx, y: sy, steht: true, kunst: k,
    tipp: "Unter der Trockenhaube trocknen Locken und Farbe in Ruhe." });
}
{
  /* DER SESSEL — Cocktailsessel in Cognac-Leder */
  const COG = S.lg("cognac", [[0, "#b9763f"], [0.5, "#9a5c2c"], [1, "#6f3f1c"]], 0, 0, 1, 0);
  let k = schatten(0, 0, 22, 2, 0.3);
  for (const x of [-18, 18]) k += `<path d="M${x - 1} 0 L${x - 0.6} -6 L${x + 1} -6 L${x + 1} 0 Z" fill="#3a2a1c"/>`;
  k += `<rect x="-17" y="-48" width="34" height="26" rx="5" fill="${COG}"/>`;
  k += `<rect x="-21" y="-26" width="42" height="20" rx="3" fill="${COG}"/>`;
  k += `<rect x="-17" y="-27" width="34" height="6" rx="2.4" fill="${S.lg("cogsitz", [[0, "#c4834a"], [1, "#8a5126"]])}"/>`;
  for (const x of [-22, 15]) k += `<rect x="${x}" y="-36" width="7" height="30" rx="3" fill="${COG}"/><rect x="${x + 0.6}" y="-35.4" width="5.8" height="1.4" rx=".7" fill="#fff" opacity=".2"/>`;
  k += `<path d="M-13 -46 Q0 -47.6 13 -46" stroke="#fff" stroke-width=".6" opacity=".22" fill="none"/>`;
  S.teil({ id: "sessel", de: "der Sessel", syl: "SES-sel", it: "la poltrona", itSyl: "pol-TRO-na", en: "armchair", x: HAUBE.x, y: HAUBE.sessel, steht: true, kunst: k });
}
{
  /* DIE KUNDIN — liest unter der Haube, Wickler im Haar */
  let k = kundinFig.svg;
  const z = kundinFig.z, s = kundinFig.k;
  const hL = z.handL, hR = z.handR;
  const mx = (hL.x + hR.x) / 2 * s, my = (hL.y + hR.y) / 2 * s;
  k += `<g transform="translate(${r(mx)} ${r(my - 2)})"><path d="M-9 -6 L0 -4.6 L9 -6 L9 4 L0 5.4 L-9 4 Z" fill="#c43c46"/><path d="M-8.4 -5.4 L-.4 -4.2 L-.4 4.8 L-8.4 3.6 Z" fill="#f6f2ea"/><path d="M.4 -4.2 L8.4 -5.4 L8.4 3.6 L.4 4.8 Z" fill="#fbf8f2"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="-7.4" y1="${r(-2.6 + i * 1.6)}" x2="-1.6" y2="${r(-1.8 + i * 1.6)}" stroke="#9a9a9a" stroke-width=".3"/><line x1="1.6" y1="${r(-1.8 + i * 1.6)}" x2="7.4" y2="${r(-2.6 + i * 1.6)}" stroke="#9a9a9a" stroke-width=".3"/>`;
  k += `<rect x="1.8" y="-3.8" width="5" height="3.4" fill="#d79a6a"/></g>`;
  /* Wickler */
  const kx = z.kopf.x * s, ky = z.kopf.y * s;
  for (const [dx, dy, f] of [[-4.6, -4.2, "#e86a8a"], [-1.6, -6, "#5aa0d8"], [1.6, -6, "#e86a8a"], [4.6, -4.2, "#5aa0d8"], [-5.6, -1, "#f0c84a"], [5.6, -1, "#f0c84a"]]) k += `<rect x="${r(kx + dx - 1.4)}" y="${r(ky + dy - 1)}" width="2.8" height="2" rx=".9" fill="${f}" opacity=".95"/>`;
  S.teil({ id: "kundin", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: kundinOrigin.x, y: kundinOrigin.y, kunst: k,
    tipp: "Die Kundin wartet unter der Trockenhaube, bis die Locken trocken sind." });
  /* durchsichtige Rauchglas-Haube vor dem Kopf (fängt keinen Tipp) */
  S.davor(`<path d="M${r(kopf.x - 13.6)} ${r(kopf.y + 2)} Q${r(kopf.x - 14.6)} ${r(kopf.y - 13)} ${r(kopf.x)} ${r(kopf.y - 14)} Q${r(kopf.x + 14.6)} ${r(kopf.y - 13)} ${r(kopf.x + 13.6)} ${r(kopf.y + 2)} Q${r(kopf.x)} ${r(kopf.y - 3)} ${r(kopf.x - 13.6)} ${r(kopf.y + 2)} Z" fill="#8e8a84" opacity=".38"/>` +
    `<path d="M${r(kopf.x - 13.6)} ${r(kopf.y + 2)} Q${r(kopf.x)} ${r(kopf.y - 3)} ${r(kopf.x + 13.6)} ${r(kopf.y + 2)}" stroke="#d8d4cd" stroke-width="1.1" fill="none"/>` +
    `<path d="M${r(kopf.x - 9)} ${r(kopf.y - 8)} Q${r(kopf.x - 5)} ${r(kopf.y - 12)} ${r(kopf.x + 1)} ${r(kopf.y - 12.4)}" stroke="#fff" stroke-width=".8" opacity=".5" fill="none"/>`);
}

/* =====================================================================
   DER ROLLWAGEN — Lupe: Schere, Kamm, Sprühflasche, Bürste,
   Haarklammern, Föhn (rechts im Halter), Haarschneidemaschine (links)
   ===================================================================== */
{
  const X = 136, Y = 166, top = -50;
  let k = schatten(0, 0, 18, 1.8, 0.3);
  /* Rollen */
  for (const x of [-13, 13]) k += `<rect x="${x - 0.7}" y="-5" width="1.4" height="2" fill="#555"/><circle cx="${x}" cy="-1.8" r="1.8" fill="#18181a"/><circle cx="${x}" cy="-1.8" r=".6" fill="#777"/>`;
  /* Korpus mit zwei Schubladen und offenem Fach */
  k += `<rect x="-16" y="${top + 4}" width="32" height="${-top - 8}" rx="1.4" fill="${PLASTIK}"/>`;
  k += `<rect x="-14.6" y="${top + 9}" width="29.2" height="13" rx=".8" fill="#121214"/>`;
  k += `<rect x="-14.6" y="${top + 9}" width="29.2" height="2" fill="#000" opacity=".4"/>`;
  for (const y of [top + 24, top + 34.5]) k += `<rect x="-14.6" y="${y}" width="29.2" height="9" rx=".8" fill="${S.lg("lade", [[0, "#34363b"], [1, "#222327"]])}"/><rect x="-5" y="${y + 3.6}" width="10" height="1.4" rx=".7" fill="${CHROM}"/>`;
  /* Tablett oben mit Rand, von leicht oben gesehen */
  k += `<path d="M-17 ${top + 4} L17 ${top + 4} L16 ${top + 1} L-16 ${top + 1} Z" fill="#3e4045"/><rect x="-17" y="${top + 3.6}" width="34" height="1.4" rx=".5" fill="#4b4d53"/>`;
  k += `<path d="M-15 ${top + 1.2} L15 ${top + 1.2}" stroke="#6a6c72" stroke-width=".4"/>`;
  const unter = [];
  const tb = top + 2;   // Standfläche oben
  /* Schere (steht im Halter, Griffe oben) */
  {
    const x = -10;
    let g = `<rect x="${x - 2.4}" y="${tb - 4}" width="4.8" height="4" rx=".6" fill="#2b2c30"/>`;
    g += `<path d="M${x - 0.5} ${tb - 3.6} L${x - 1.2} ${tb - 11} M${x + 0.5} ${tb - 3.6} L${x + 1.2} ${tb - 11}" stroke="#d6dbe0" stroke-width=".8" stroke-linecap="round"/>`;
    g += `<circle cx="${x - 1.9}" cy="${tb - 12.8}" r="1.7" fill="none" stroke="#c3c9ce" stroke-width=".7"/><circle cx="${x + 1.9}" cy="${tb - 12.8}" r="1.7" fill="none" stroke="#c3c9ce" stroke-width=".7"/><circle cx="${x}" cy="${tb - 10.6}" r=".4" fill="#777"/>`;
    k += g;
    unter.push({ id: "schere", de: "die Schere", syl: "SCHE-re", it: "le forbici", itSyl: "FOR-bi-ci", en: "scissors", x: X + x, y: Y + tb, kunst: flaeche(-5, -16, 10, 16),
      tipp: "Eine gute Friseurschere ist sehr scharf und teuer." });
  }
  /* Kamm (steht im Schlitz) */
  {
    const x = 0;
    let g = `<rect x="${x - 1}" y="${tb - 13}" width="2" height="13" rx=".4" fill="#1b1b1e"/>`;
    for (let i = 0; i < 11; i++) g += `<rect x="${x + 1}" y="${r(tb - 12.5 + i * 1.05)}" width="1.4" height=".45" fill="#1b1b1e"/>`;
    g += `<rect x="${x - 0.8}" y="${tb - 12.6}" width=".4" height="12" fill="#fff" opacity=".25"/>`;
    k += g;
    unter.push({ id: "kamm", de: "der Kamm", syl: "KAMM", it: "il pettine", itSyl: "PET-ti-ne", en: "comb", x: X + x, y: Y + tb, kunst: flaeche(-4.5, -15, 9, 15) });
  }
  /* Sprühflasche */
  {
    const x = 10;
    let g = `<path d="M${x - 2.4} ${tb} L${x - 2.4} ${tb - 8} Q${x - 2.4} ${tb - 9.6} ${x - 1} ${tb - 9.6} L${x + 1} ${tb - 9.6} Q${x + 2.4} ${tb - 9.6} ${x + 2.4} ${tb - 8} L${x + 2.4} ${tb} Z" fill="#9fc9d8" opacity=".85"/>`;
    g += `<rect x="${x - 2.4}" y="${tb - 4}" width="4.8" height="4" fill="#5fa3bf" opacity=".6"/><rect x="${x - 1}" y="${tb - 11.4}" width="2" height="1.8" fill="#2b2c30"/><path d="M${x - 1.4} ${tb - 11.4} L${x - 1.4} ${tb - 13.4} L${x + 3} ${tb - 13.4} L${x + 3} ${tb - 12.4} L${x + 1} ${tb - 12.4} L${x + 1} ${tb - 11.4} Z" fill="#2b2c30"/><path d="M${x + 1.2} ${tb - 11} l1.4 2.6" stroke="#2b2c30" stroke-width=".6"/>`;
    g += `<rect x="${x - 1.8}" y="${tb - 8.6}" width=".6" height="7.6" fill="#fff" opacity=".5"/>`;
    k += g;
    unter.push({ id: "spruehflasche", de: "die Sprühflasche", syl: "SPRÜH-fla-sche", it: "lo spruzzino", itSyl: "spruz-ZI-no", en: "spray bottle", x: X + x, y: Y + tb, kunst: flaeche(-5, -15, 10, 15),
      tipp: "Vor dem Schneiden wird das Haar mit Wasser feucht gemacht." });
  }
  /* im offenen Fach: Rundbürste und Haarklammern */
  const fb = top + 22;
  {
    const x = -7;
    let g = `<rect x="${x - 8}" y="${fb - 2.6}" width="9" height="2.6" rx="1.2" fill="#6b4a2e"/>`;
    g += `<rect x="${x + 0.6}" y="${fb - 3.2}" width="7.4" height="3.2" rx="1.4" fill="#c7cdd2"/>`;
    for (let i = 0; i < 7; i++) g += `<line x1="${r(x + 1 + i * 1.05)}" y1="${fb - 4.6}" x2="${r(x + 1 + i * 1.05)}" y2="${fb - 3}" stroke="#1d1d20" stroke-width=".35"/><line x1="${r(x + 1 + i * 1.05)}" y1="${fb}" x2="${r(x + 1 + i * 1.05)}" y2="${fb + 0.3}" stroke="#1d1d20" stroke-width=".35"/>`;
    k += g;
    unter.push({ id: "buerste", de: "die Bürste", syl: "BÜRS-te", it: "la spazzola", itSyl: "SPAZ-zo-la", en: "brush", x: X + x, y: Y + fb, kunst: flaeche(-7.6, -11, 15.2, 11.6),
      tipp: "Mit der Rundbürste föhnt man die Haare glatt oder rund." });
  }
  {
    const x = 7.4;
    let g = "";
    [["#e2566c", -4.6, -1], ["#2e2e33", -1.6, -2.4], ["#5a9fd6", 1.6, -1.2], ["#f2c94c", 4.4, -2.6], ["#2e2e33", -3, -4.6], ["#e2566c", 2.6, -5.2]].forEach(([f, dx, dy]) => {
      g += `<path d="M${r(x + dx - 1.8)} ${r(fb + dy)} L${r(x + dx + 1.8)} ${r(fb + dy - 1)} L${r(x + dx + 1.9)} ${r(fb + dy - 0.2)} L${r(x + dx - 1.6)} ${r(fb + dy + 0.8)} Z" fill="${f}"/>`;
    });
    k += g;
    unter.push({ id: "haarklammer", de: "die Haarklammer", syl: "HAAR-klam-mer", it: "la pinza per capelli", itSyl: "PIN-za per ca-PEL-li", en: "hair clip", x: X + x, y: Y + fb, kunst: flaeche(-7, -11, 14, 11.6) });
  }
  /* Föhn rechts im Halter (Düse nach unten) */
  {
    const x = 20.5, y = top + 10;
    let g = `<rect x="15.6" y="${y - 1}" width="3.6" height="2" fill="${CHROM}"/><ellipse cx="${x}" cy="${y}" rx="3" ry="1" fill="none" stroke="#c3c9ce" stroke-width=".8"/>`;
    g += `<rect x="${x - 1.6}" y="${y - 2}" width="3.2" height="6" rx=".6" fill="#2a2b2f"/>`;
    g += `<rect x="${x - 3.2}" y="${y - 13}" width="6.4" height="12" rx="3" fill="${S.lg("foehn", [[0, "#6b6e75"], [0.4, "#3a3c41"], [1, "#1a1b1e"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${x + 2.6} ${y - 6} L${x + 6.4} ${y - 2} L${x + 5.2} ${y - 0.6} L${x + 1.8} ${y - 3.6} Z" fill="#2a2b2f"/><rect x="${x + 3.6}" y="${y - 4.4}" width="1" height="1.6" fill="#e4572e" transform="rotate(45 ${x + 4.1} ${y - 3.6})"/>`;
    g += `<path d="M${x + 5.8} ${y - 1.2} Q${x + 4} ${y + 8} ${x - 1} ${y + 14} Q${x - 4} ${y + 18} ${x - 4.4} ${y + 22}" stroke="#1f1f22" stroke-width=".6" fill="none"/>`;
    g += `<rect x="${x - 2.4}" y="${y - 12}" width=".8" height="9" rx=".4" fill="#fff" opacity=".22"/>`;
    k += g;
    unter.push({ id: "foehn", de: "der Föhn", syl: "FÖHN", it: "l'asciugacapelli", itSyl: "a-sciu-ga-ca-PEL-li", en: "hairdryer", x: X + x, y: Y + y + 4, kunst: flaeche(-4.6, -18, 11.4, 20) });
  }
  /* Haarschneidemaschine links am Haken */
  {
    const x = -19.2, y = top + 9;
    let g = `<rect x="-17.2" y="${y - 1}" width="1.4" height="2" fill="${CHROM}"/><path d="M-16.5 ${y} Q-19 ${y} -19 ${y + 2}" stroke="#c3c9ce" stroke-width=".6" fill="none"/>`;
    g += `<rect x="${x - 2}" y="${y + 2}" width="4" height="12" rx="1.8" fill="${S.lg("clip", [[0, "#c9a24c"], [0.5, "#9c7a2e"], [1, "#6d531c"]], 0, 0, 1, 0)}"/>`;
    g += `<rect x="${x - 1.8}" y="${y + 13}" width="3.6" height="1.8" fill="#c3c9ce"/>`;
    for (let i = 0; i < 6; i++) g += `<line x1="${r(x - 1.6 + i * 0.64)}" y1="${y + 14.8}" x2="${r(x - 1.6 + i * 0.64)}" y2="${y + 15.6}" stroke="#8d949a" stroke-width=".3"/>`;
    g += `<rect x="${x - 0.5}" y="${y + 5}" width="1" height="1.6" rx=".4" fill="#1d1d20"/>`;
    k += g;
    unter.push({ id: "haarschneidemaschine", de: "die Haarschneidemaschine", syl: "HAAR-schnei-de-ma-schi-ne", it: "il tagliacapelli", itSyl: "ta-glia-ca-PEL-li", en: "hair clipper", x: X + x, y: Y + y + 16, kunst: flaeche(-4, -17, 7, 17.6),
      tipp: "Mit der Maschine schneidet man kurze Haare ganz gleichmäßig." });
  }
  S.teil({ id: "rollwagen", de: "der Rollwagen", syl: "ROLL-wa-gen", it: "il carrello", itSyl: "car-REL-lo", en: "salon trolley", x: X, y: Y, steht: true, kunst: k,
    zoom: { x: X - 28, y: Y + top - 16, w: 57, h: 38 }, unter,
    tipp: "Auf dem Rollwagen liegt das Werkzeug griffbereit." });
}

/* =====================================================================
   DER KUNDE (von hinten, mit Umhang) und DER FRISEURSTUHL davor
   ===================================================================== */
{
  const m = B.mensch({ id: "b04a_kunde", geschlecht: "m", pose: "sitzen", blick: 180, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh" } } }, KUNDE.h);
  const s = m.k;
  S.def(`<clipPath id="${S.id("kclip")}"><rect x="-40" y="-140" width="80" height="${r(140 - 30 * s / 0.584)}"/></clipPath>`);
  let k = `<g clip-path="url(#${S.id("kclip")})">${grob(m.svg)}</g>`;
  /* Umhang über den Schultern, Nackenband */
  const p = (x, y) => `${r(x * s)} ${r(y * s)}`;
  k += `<path d="M${p(-4, -110)} Q${p(0, -107.5)} ${p(4, -110)} L${p(15, -104)} Q${p(25, -100)} ${p(26, -90)} L${p(27, -58)} L${p(-27, -58)} L${p(-26, -90)} Q${p(-25, -100)} ${p(-15, -104)} Z" fill="${S.lg("kumhang", [[0, "#3a3b40"], [0.5, "#202125"], [1, "#2c2d32"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${p(-4.4, -111.5)} Q${p(0, -108.6)} ${p(4.4, -111.5)}" stroke="#d7d7d2" stroke-width="${r(2.2 * s)}" fill="none"/>`;
  k += `<path d="M${p(-14, -100)} Q${p(-18, -80)} ${p(-17, -60)} M${p(12, -100)} Q${p(15, -80)} ${p(14, -60)}" stroke="#000" stroke-width=".4" opacity=".35" fill="none"/>`;
  k += `<path d="M${p(-20, -101)} Q${p(-12, -105)} ${p(-5, -106)}" stroke="#fff" stroke-width=".5" opacity=".2" fill="none"/>`;
  S.teil({ id: "kunde_fr", de: "der Kunde", syl: "KUN-de", it: "il cliente", itSyl: "cli-EN-te", en: "customer", x: KUNDE.x, y: KUNDE.y, kunst: k,
    tipp: "Der Kunde sagt: „Bitte hinten kurz und oben etwas länger.“" });
}
{
  /* Hydraulischer Friseurstuhl von hinten: Rückenlehne, Armlehnen,
     Sitz, Chromsäule auf runder Platte, Pumppedal */
  const X = KUNDE.x, Y = 171;
  let k = schatten(0, 0, 22, 2.2, 0.35);
  k += `<ellipse cx="0" cy="-1.8" rx="18" ry="3.2" fill="${S.lg("platte", [[0, "#f1f3f5"], [0.5, "#aab1b7"], [1, "#e1e5e8"]], 0, 0, 1, 0)}"/><ellipse cx="0" cy="-2.6" rx="16" ry="2.2" fill="#cfd4d8"/>`;
  k += `<path d="M-4.2 -3 L-3.4 -22 L3.4 -22 L4.2 -3 Z" fill="${CHROM}"/><rect x="-5" y="-9" width="10" height="2.4" rx="1" fill="#2a2b2f"/>`;
  k += `<path d="M-5 -24 L5 -24 L4.2 -21 L-4.2 -21 Z" fill="#2a2b2f"/>`;
  /* Sitzkante */
  k += `<rect x="-20" y="-35" width="40" height="11" rx="3" fill="${S.lg("fsitz", [[0, "#3a3a40"], [1, "#151518"]])}"/>`;
  /* Rückenlehne mit Steppnähten */
  k += `<path d="M-15.6 -31 L-16 -56 Q-16 -61 -11 -61 L11 -61 Q16 -61 16 -56 L15.6 -31 Z" fill="${LEDER}"/>`;
  for (const x of [-8, 0, 8]) k += `<path d="M${x} -59 L${x * 1.02} -33" stroke="#000" stroke-width=".45" opacity=".55"/><path d="M${x + 0.5} -59 L${x * 1.02 + 0.5} -33" stroke="#fff" stroke-width=".25" opacity=".12"/>`;
  k += `<path d="M-14 -58.6 Q0 -60.6 14 -58.6" stroke="#fff" stroke-width=".7" opacity=".22" fill="none"/>`;
  k += `<rect x="-16" y="-36" width="32" height="2.4" rx="1" fill="${CHROM}"/>`;
  const unter = [];
  /* Armlehne links (die rechte ist gleich gebaut) */
  const arm = (sx) => `<rect x="${sx > 0 ? 16.4 : -23.4}" y="-43" width="7" height="4.2" rx="2" fill="${LEDER}"/><path d="M${sx * 20} -38.8 L${sx * 20} -33" stroke="#c3c9ce" stroke-width="1.6"/><rect x="${sx > 0 ? 16.8 : -23}" y="-42.6" width="6" height="1" rx=".5" fill="#fff" opacity=".18"/>`;
  k += arm(-1) + arm(1);
  unter.push({ id: "armlehne", de: "die Armlehne", syl: "ARM-leh-ne", it: "il bracciolo", itSyl: "brac-CIO-lo", en: "armrest", x: X - 20, y: Y - 33, kunst: flaeche(-6, -13, 12, 14) });
  /* Pedal rechts an der Säule */
  k += `<path d="M4 -11 L13 -8.6 L13.4 -7 L4 -8.2 Z" fill="${CHROM}"/><rect x="11" y="-9.4" width="5.6" height="2.6" rx=".8" fill="#1d1d20"/>`;
  unter.push({ id: "pedal", de: "das Pedal", syl: "pe-DAL", it: "il pedale", itSyl: "pe-DA-le", en: "pedal", x: X + 12, y: Y - 5, kunst: flaeche(-8, -9, 16, 10),
    tipp: "Mit dem Pedal pumpt die Friseurin den Stuhl nach oben." });
  S.teil({ id: "friseurstuhl", de: "der Friseurstuhl", syl: "Fri-SEUR-stuhl", it: "la poltrona", itSyl: "pol-TRO-na", en: "barber's chair", x: X, y: Y, steht: true, kunst: k,
    zoom: { x: X - 36, y: Y - 66, w: 72, h: 48 }, unter,
    tipp: "Der Stuhl lässt sich drehen und mit dem Pedal hoch- und runterpumpen." });
}
{
  /* DIE HAARE — geschnittene Strähnen auf dem Boden */
  let k = "";
  for (let i = 0; i < 46; i++) {
    const x = -17 + rnd() * 34, y = -rnd() * 4.4 + Math.abs(x) * 0.06, l = 0.8 + rnd() * 1.6, a = rnd() * 6.28;
    k += `<path d="M${r(x)} ${r(y)} q${r(Math.cos(a) * l * 0.5 + 0.3)} ${r(Math.sin(a) * l * 0.25 - 0.3)} ${r(Math.cos(a) * l)} ${r(Math.sin(a) * l * 0.3)}" stroke="${rnd() < 0.5 ? "#3a2822" : "#5a4032"}" stroke-width=".22" opacity=".85" fill="none"/>`;
  }
  S.teil({ oben: true, id: "haare", de: "die Haare", syl: "HAA-re", it: "i capelli", itSyl: "ca-PEL-li", en: "hair", x: KUNDE.x - 6, y: 178, kunst: k + flaeche(-17, -5, 34, 6),
    tipp: "Nach jedem Schnitt werden die Haare zusammengefegt." });
}

/* =====================================================================
   DIE FRISEURIN — rechts neben dem Stuhl, Schere und Kamm in der Hand
   ===================================================================== */
{
  const m = B.mensch({ id: "b04a_friseurin", geschlecht: "w", pose: "servieren", blick: -62, frisur: "dutt", haarfarbe: "rot", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "schwarz" }, schuerze: { stueck: "schuerze", farbe: "#2a2a2e" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "turnschuh" } } }, 100);
  const hs = [m.z.handL, m.z.handR].sort((a, b) => a.y - b.y);
  const ho = hs[0], hu = hs[1];
  const hx = ho.x * m.k, hy = ho.y * m.k, ux = hu.x * m.k, uy = hu.y * m.k;
  let k = m.svg;
  /* Schere in der erhobenen Hand */
  k += `<g transform="translate(${r(hx - 0.6)} ${r(hy - 1)}) rotate(-35)"><path d="M0 0 L-7 -.6 M0 0 L-7 .8" stroke="#dfe3e7" stroke-width=".7" stroke-linecap="round"/><circle cx="1.6" cy="-1.1" r="1.2" fill="none" stroke="#9aa3aa" stroke-width=".5"/><circle cx="1.6" cy="1.1" r="1.2" fill="none" stroke="#9aa3aa" stroke-width=".5"/></g>`;
  /* Kamm in der anderen Hand */
  k += `<g transform="translate(${r(ux)} ${r(uy - 0.4)}) rotate(-70)"><rect x="-1" y="-.6" width="8" height="1.2" rx=".3" fill="#1b1b1e"/></g>`;
  S.teil({ id: "friseurin", de: "die Friseurin", syl: "Fri-SEU-rin", it: "la parrucchiera", itSyl: "par-ruc-CHIE-ra", en: "hairdresser", x: 234, y: 182, kunst: k,
    tipp: "Die Friseurin fragt: „Wie hätten Sie es gern?“" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/friseur.js"));
console.log(aus);
