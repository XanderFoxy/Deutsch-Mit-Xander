/* =====================================================================
   LEICHTE STADT — BEDIENUNG
   ---------------------------------------------------------------------
   XANDER: „mit dem selben Komfort des Bauens und der Ansichten der
   Fertigstellung, wenn ein Haus baut" – „praktisch so den Leuten die
   Möglichkeit geben, das Ganze zu upgraden".

   oben links   zurück zur Webseite · Name der Stadt
   oben rechts  Tageszeit · Jahreszeit · Farbstimmung · Karte drehen
   unten rechts Mini-Karte 3 × 3 (antippen = hinfliegen)
   unten links  „Schmücken": eigenen Schmuck setzen (Baukasten)
   Antippen eines Hauses: Name, Stufe, Baufortschritt, Helfen, Drehen.
   Antippen eines leeren Bauplatzes: welches Haus hierher gehört, Bauen.
   Alles ab 360 px Breite ohne Überlappung, Tippflächen ≥ 40 px.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, SZ = ST.szene, LB = ST.bilder, D = ST.dorf;
  const O = (ST.oberflaeche = {});
  const L = () => ST.leicht;
  const wurzel = document.getElementById("lOber");

  const SYM = {
    sonne: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.6" fill="currentColor"/><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g></svg>',
    daemmerung: '<svg viewBox="0 0 24 24"><path d="M3 17h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 17a5.5 5.5 0 0 1 11 0z" fill="currentColor"/><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 6.5v2.2M4.8 10l1.6 1.4M19.2 10l-1.6 1.4"/></g></svg>',
    mond: '<svg viewBox="0 0 24 24"><path d="M15.5 3.2a8.8 8.8 0 1 0 5.3 13.4A7.2 7.2 0 0 1 15.5 3.2z" fill="currentColor"/></svg>',
    schnee: '<svg viewBox="0 0 24 24"><g stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="M9.6 4.2 12 6.3l2.4-2.1M9.6 19.8 12 17.7l2.4 2.1"/></g></svg>',
    bluete: '<svg viewBox="0 0 24 24"><g fill="currentColor"><circle cx="12" cy="6.3" r="3.3"/><circle cx="17.4" cy="10.2" r="3.3"/><circle cx="15.4" cy="16.5" r="3.3"/><circle cx="8.6" cy="16.5" r="3.3"/><circle cx="6.6" cy="10.2" r="3.3"/></g><circle cx="12" cy="11.8" r="2.6" fill="#f3c33c"/></svg>',
    blatt: '<svg viewBox="0 0 24 24"><path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z" fill="currentColor"/><path d="M5 19 14 10" stroke="#1b2440" stroke-width="1.3" opacity=".6"/></svg>',
    links: '<svg viewBox="0 0 24 24"><path d="M5.5 12a6.5 6.5 0 1 0 2-4.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4.2 3.8 7.6 7.6l-4.3.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    rechts: '<svg viewBox="0 0 24 24"><path d="M18.5 12a6.5 6.5 0 1 1-2-4.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19.8 3.8 16.4 7.6l4.3.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    haken: '<svg viewBox="0 0 24 24"><path d="M4.5 12.5 9.5 17.5 19.5 6.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    kreuz: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    versetzen: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18"/><path d="m9 5.8 3-2.8 3 2.8M9 18.2l3 2.8 3-2.8M5.8 9 3 12l2.8 3M18.2 9 21 12l-2.8 3"/></g></svg>',
    abriss: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/></g></svg>',
    karte: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/></g></svg>',
    farbe: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 1.6-2.1-.5-1.2.3-2.4 1.6-2.4H17a4 4 0 0 0 4-4C21 7 17 3 12 3z" fill="currentColor"/><g fill="#1b2440"><circle cx="7.6" cy="11.2" r="1.5"/><circle cx="10.3" cy="7.2" r="1.5"/><circle cx="15" cy="7.4" r="1.5"/></g></svg>',
    zurueck: '<svg viewBox="0 0 24 24"><path d="M14.5 5 7.5 12l7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    stern: '<svg viewBox="0 0 24 24"><path d="M12 3.2l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3.1-5.4 3.1 1.2-6-4.5-4.2 6.1-.7z" fill="currentColor"/></svg>',
    lupe: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></g></svg>',
    voll: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></g></svg>',
    hammer: '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6.5 17.5 10M4 20l9-9"/><path d="M12.5 5l4-2 4.5 4.5-2 4-2-.5-3-3z" fill="currentColor"/></g></svg>'
  };
  const ZEITEN = ["tag", "abend", "nacht"], ZEIT_SYM = { tag: "sonne", abend: "daemmerung", nacht: "mond" };
  const JAHRE = ["winter", "fruehling", "sommer", "herbst"], JAHR_SYM = { winter: "schnee", fruehling: "bluete", sommer: "sonne", herbst: "blatt" };
  const JAHR_NAME = { winter: "Winter", fruehling: "Frühling", sommer: "Sommer", herbst: "Herbst" };
  /* Die Karte in 3 × 3 Bereiche à 48 m */
  /* FASSUNG 807 — die Viertel der Originalkarte (Welt x nach rechts, y nach vorn) */
  /* FASSUNG 808 — Viertel der Originalkarte (die Karte ist nach Welt-Achsen geteilt, im Bild also schräg) */
  const BEREICHE = ST.dorf && ST.dorf.VORLAGE === "altdorf" ? [["Bahn", "Gefängnis", "Krankenhaus"], ["Mühle", "Rathaus", "Schmiede"], ["Kuhstall", "Hühnerstall", "Seeufer"]]
    : [["Tannenwald", "Kirchplatz", "Obstwiese"], ["Domplatz", "Anger", "Mühlbach"], ["Gärten", "Bahnhof", "Seeufer"]];
  const BG = 48;

  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function knopf(sym, titel, fn, cls) {
    const b = el("button", "lk-knopf" + (cls ? " " + cls : ""), SYM[sym] || sym);
    b.type = "button"; b.title = titel; b.setAttribute("aria-label", titel);
    b.addEventListener("click", (e) => { e.stopPropagation(); fn(e); });
    return b;
  }
  let ansageUhr = 0;
  function ansage(t) {
    let a = wurzel.querySelector(".lk-ansage");
    if (!a) { a = el("div", "lk-ansage"); wurzel.appendChild(a); }
    a.textContent = t; a.classList.add("an");
    clearTimeout(ansageUhr); ansageUhr = setTimeout(() => a.classList.remove("an"), 1800);
  }
  O.ansage = ansage;

  /* ---------------- Farbstimmung (wie Winterhausen) ---------------- */
  const STIMMUNG = {
    tag: { satt: 0.30, kon: 0.10, sep: 0.18, warm: "rgba(255,196,120,.16)", vig: 0.30 },
    abend: { satt: 0.30, kon: 0.12, sep: 0.25, warm: "rgba(255,150,90,.22)", vig: 0.45 },
    nacht: { satt: 0.15, kon: 0.12, sep: 0.12, warm: "rgba(255,170,80,.10)", vig: 0.50 }
  };
  let stimmung = null, farbK = 1;
  function stimmungSetzen() {
    /* FASSUNG 795 — nach der Uhr fließend zwischen Tag, Dämmerung und Nacht */
    let m = STIMMUNG[SZ.zeit] || STIMMUNG.tag;
    const Zd = SZ.zeitDaten();
    if (SZ.zeitAuto && Zd.grad != null) {
      const n = Zd.grad, A = n <= 0.75 ? STIMMUNG.tag : STIMMUNG.abend, B = n <= 0.75 ? STIMMUNG.abend : STIMMUNG.nacht, t = n <= 0.75 ? n / 0.75 : (n - 0.75) / 0.25;
      const mi = (x, y) => x + (y - x) * t, farbe = (x, y) => { const p = x.match(/[\d.]+/g).map(Number), q = y.match(/[\d.]+/g).map(Number); return "rgba(" + p.map((v, i) => i < 3 ? Math.round(mi(v, q[i])) : mi(v, q[i]).toFixed(3)).join(",") + ")"; };
      m = { satt: mi(A.satt, B.satt), kon: mi(A.kon, B.kon), sep: mi(A.sep, B.sep), vig: mi(A.vig, B.vig), warm: farbe(A.warm, B.warm) };
    }
    const k = farbK;
    const f = k > 0 ? "sepia(" + (m.sep * k).toFixed(3) + ") saturate(" + (1 + m.satt * k).toFixed(3) + ") contrast(" + (1 + m.kon * k).toFixed(3) + ")" : "none";
    ["lBoden", "lDinge"].forEach((id) => { document.getElementById(id).style.filter = f; });
    stimmung.style.opacity = Math.min(1, k).toFixed(2);
    stimmung.style.background = "linear-gradient(160deg," + m.warm + " 0%, rgba(0,0,0,0) 45%)";
    stimmung.firstChild.style.background = "radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(8,10,30," + (m.vig * Math.min(1.4, k)).toFixed(3) + ") 100%)";
  }

  let kopf, zeitK, jahrK, farbFeld, minirahmen, mini, miniC, karte, deckel, leiste, schmuckKnopf, bauKnopf, bauLeiste = null;
  O.start = function (q) {
    stimmung = el("div", "lk-stimmung", "<i></i>");
    document.getElementById("lStadt").insertBefore(stimmung, wurzel);
    try { const v = localStorage.getItem("leicht_farbe"); if (v != null) farbK = +v / 100; } catch (e) {}
    if (q.get("farbe") != null) farbK = +q.get("farbe") / 100;

    kopf = el("div", "lk-kopf");
    const links = el("div", "lk-kopf-links");
    /* FASSUNG 798: in der Seite eingebettet (Rahmen über dem Livestream) schließt „zurück“ den Rahmen. */
    const eingebettet = q.get("eingebettet") === "1" && window.parent !== window;
    links.appendChild(knopf("zurueck", eingebettet ? "Zurück" : "Zurück zur Webseite", () => { if (eingebettet) { try { window.parent.postMessage({ typ: "leicht-zu" }, location.origin); return; } catch (e) {} } if (history.length > 1 && document.referrer.indexOf(location.host) >= 0) history.back(); else location.href = "index.html"; }));
    /* FASSUNG 806 — XANDER: „wenn wir der Vollbildansicht sind, darf es nicht kaputtmachen oder man muss halt die Wahl
       bekommen in neuen Tab öffnen … dass man da kurz dort in Ruhe gucken kann oder das auf einem zweiten Gerät öffnet". */
    if (eingebettet) links.appendChild(knopf('<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5H5V6h5"/></g></svg>', "In neuem Tab öffnen", () => {
      try { window.parent.postMessage({ typ: "leicht-zu" }, location.origin); } catch (e) {}
      window.open("stadt-leicht.html", "_blank", "noopener");
    }, "lk-neuer-tab"));
    const name = el("div", "lk-name");
    links.appendChild(name);
    kopf.appendChild(links);
    const rechts = el("div", "lk-kopf-rechts");
    zeitK = knopf(ZEIT_SYM[SZ.zeit], "Tageszeit", () => { SZ.zeitAuto = false; SZ.zeit = ZEITEN[(ZEITEN.indexOf(SZ.zeit) + 1) % 3]; zeitK.innerHTML = SYM[ZEIT_SYM[SZ.zeit]]; ansage(ST.ZEITEN[SZ.zeit].name); stimmungSetzen(); L().unruhe = 2; });
    jahrK = knopf(JAHR_SYM[SZ.jahr], "Jahreszeit", () => { SZ.jahr = JAHRE[(JAHRE.indexOf(SZ.jahr) + 1) % 4]; jahrK.innerHTML = SYM[JAHR_SYM[SZ.jahr]]; ansage(JAHR_NAME[SZ.jahr]); D.jahrFiltern(); L().unruhe = 2; });
    const farbKn = knopf("farbe", "Farbstimmung", () => { farbFeld.hidden = !farbFeld.hidden; });
    /* FASSUNG 808 — XANDER: „Tag und Nacht braucht man nicht wählen … soll realistisch nach Uhrzeit sein, vielleicht
       angepasst an die Zeitzone des Nutzers". Tageszeit und Jahreszeit laufen nach der Uhr und dem Datum des Geräts (also in
       dessen Zeitzone); die beiden Schalter sieht nur noch der Betreiber (Vorschau). */
    zeitK.hidden = jahrK.hidden = !(ST.spiel && ST.spiel.betreiber);
    rechts.append(zeitK, jahrK, farbKn, knopf("links", "Karte nach links drehen", () => drehen(1)), knopf("rechts", "Karte nach rechts drehen", () => drehen(-1)));
    kopf.appendChild(rechts);
    wurzel.appendChild(kopf);
    nameSetzen();

    farbFeld = el("div", "lk-farbfeld", '<label>Farbstimmung <b></b></label><input type="range" min="0" max="200" step="5">');
    farbFeld.hidden = true;
    const regler = farbFeld.querySelector("input"), zahl = farbFeld.querySelector("b");
    regler.value = Math.round(farbK * 100); zahl.textContent = regler.value + " %";
    regler.addEventListener("input", () => { farbK = +regler.value / 100; zahl.textContent = regler.value + " %"; stimmungSetzen(); try { localStorage.setItem("leicht_farbe", regler.value); } catch (e) {} });
    /* FASSUNG 796 — Sparmodus zum Einschalten (schwache Verbindung) */
    const spar = el("label", "lk-spar", '<input type="checkbox"> Daten sparen (schwache Verbindung)');
    const sparK = spar.querySelector("input"); sparK.checked = !!LB.spar;
    sparK.addEventListener("change", () => { try { localStorage.setItem("leicht_spar", sparK.checked ? "1" : "0"); } catch (e) {} LB.spar = sparK.checked; ansage(sparK.checked ? "Sparmodus an" : "Sparmodus aus"); L().unruhe = 2; });
    farbFeld.appendChild(spar);
    wurzel.appendChild(farbFeld);
    stimmungSetzen();
    setInterval(() => { if (SZ.zeitAuto) { stimmungSetzen(); if (zeitK) zeitK.innerHTML = SYM[ZEIT_SYM[SZ.zeit]]; } }, 30000);

    /* Mini-Karte */
    minirahmen = el("div", "lk-mini-rahmen");
    mini = el("div", "lk-mini"); miniC = el("canvas"); mini.appendChild(miniC);
    const gitter = el("div", "lk-mini-gitter");
    BEREICHE.forEach((zeile, j) => zeile.forEach((n, i) => {
      const f = el("button", "lk-mini-feld", "<span>" + n + "</span>"); f.type = "button";
      f.addEventListener("click", (e) => { e.stopPropagation(); L().fliegeZu((i - 1) * BG, (j - 1) * BG, O.miniNah ? O.miniNah() : Math.max(K.s, 11 * K.dpr), 900); ansage(n); });
      gitter.appendChild(f);
    }));
    mini.appendChild(gitter);
    minirahmen.append(knopf("karte", "Karte ein- und ausklappen", () => { mini.classList.toggle("zu"); }, "lk-mini-schalter"), mini);
    wurzel.appendChild(minirahmen);

    /* unten links: Schmücken */
    schmuckKnopf = el("button", "lk-schmuck", SYM.stern + "<span>Schmücken</span>");
    schmuckKnopf.type = "button";
    schmuckKnopf.addEventListener("click", (e) => { e.stopPropagation(); if (bauLeiste) { bauLeisteZeigen(false); return; } leisteZeigen(!leiste || leiste.hidden); });
    wurzel.appendChild(schmuckKnopf);
    /* FASSUNG 795 — XANDER: „Ich sehe nirgendswo ne Möglichkeit Haus zu
       bauen." Bisher ging das nur über einen leeren Bauplatz. Jetzt ein
       eigener Knopf mit allen Gebäuden: gebaut (Stufe), im Bau, baubar. */
    bauKnopf = el("button", "lk-schmuck lk-bauen", SYM.hammer + "<span>Bauen</span>");
    bauKnopf.type = "button";
    bauKnopf.addEventListener("click", (e) => { e.stopPropagation(); bauLeisteZeigen(!bauLeiste || bauLeiste.hidden); });
    wurzel.appendChild(bauKnopf);

    karte = el("div", "lk-karte"); karte.hidden = true; wurzel.appendChild(karte);
    karte.addEventListener("click", (e) => e.stopPropagation());

    /* Laden-Vorhang, bis die ersten Bilder da sind */
    deckel = el("div", "lk-vorhang", "<div><b></b><span>wird aufgebaut …</span><i><em></em></i></div>");
    deckel.querySelector("b").textContent = stadtName();
    wurzel.appendChild(deckel);
    /* FASSUNG 806 — XANDER: „damit wir keinen Ladebalken haben". Im kleinen Rahmen kein Vorhang: die Zwergbilder sind
       so klein, dass die Häuser fast sofort stehen. */
    /* FASSUNG 807 — XANDER: „dann könntest du in der Zeit wo man wartet … doch eher ein kleinen Ladebalken machen". Im kleinen
       Rahmen ein schmaler Balken unten über dem Bild (das Bild selbst bleibt sichtbar), bis die sichtbaren Häuser da sind. */
    if (q.get("still") === "1") deckel.remove();
    else if (q.get("mini") === "1") deckel.classList.add("lk-vorhang-klein");

    /* FASSUNG 799 — XANDER: „so klein möchte ich es haben … in diesem kleinen Frame, wo das alte auch ist … wenn man in
       dieser kleinen Miniaturansicht reinzoomt, dann bleibt es ja trotzdem dieser Ausschnitt … die Zoomstärke, die wir in
       der alten Version schon haben". Im kleinen Dorfrahmen des Spiels (mini=1) zeigt die Stadt nur das Bild: ganz im
       Überblick, eine Lupe (doppelt so nah, wie beim alten Dorf), die kleine Karte zum Durchtippen der Viertel und ein
       Knopf fürs Vollbild. Im Vollbild ist alles wieder da. Das Spiel schaltet um (postMessage „leicht-modus"). */
    if (eingebettet) {
      /* FASSUNG 807 — XANDER: „die Stadt soll auch wie früher in der Klein Ansicht im selben Maßstab sein … jedes Gebäude
         sichtbar … so großzügig mit so viel Platz dazwischen … die Kirche … der Fernsehturm abgeschnitten". Die ganze Stadt
         (alle Häuser, Wahrzeichen, Bahnhof – samt Höhe) passt ins kleine Bild, unter der Kopfzeile, mit etwas Rand. */
      let ganz = null;
      const ganzeStadt = () => {
        if (ganz && ganz.W === K.W && ganz.H === K.H && ganz.dreh === K.dreh && ganz.n === SZ.objekte.length) return ganz;
        const alt = { x: K.x, y: K.y, s: K.s }, kopfH = 30 * K.dpr;
        K.x = 0; K.y = 0; K.s = 1;
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        for (const o of SZ.objekte) {
          if (!(o.art === "haus" || o.art === "wunder" || (o.art === "kulisse" && o.name && o.bild !== "d_bootshaus"))) continue;
          const r = Math.hypot(o.fuss[0], o.fuss[1]) / 2, P = ST.proj(o.x, o.y, 0), T = ST.proj(o.x, o.y, (o.hoehe || 8) * (o.stufe || 1));
          x0 = Math.min(x0, P[0] - r * 0.72); x1 = Math.max(x1, P[0] + r * 0.72); y0 = Math.min(y0, T[1] - 2); y1 = Math.max(y1, P[1] + r * 0.38);
        }
        /* FASSUNG 808 — wie im alten Bild: oben die Alpen über der Horizontlinie, unten gerade noch die Zunge des Sees
           (der Bootsverleih liegt weiter unten – „wenn man weiter runtergeht, dass der See sich eröffnet") */
        const DD = ST.dorf;
        if (DD && DD.HORIZONT != null && K.dreh === 0 && x1 > x0) {
          y0 = Math.min(y0, ST.proj(DD.HORIZONT / 2, DD.HORIZONT / 2, 0)[1] - 17);
          if (DD.SEE_VERSATZ) { const z = ST.proj(66 + DD.SEE_VERSATZ[0], 56 + DD.SEE_VERSATZ[1], 0); y1 = Math.max(y1, z[1] + 3); }
        }
        let erg = { s: Math.max(1, K.W / 150), x: 0, y: 4 };
        if (x1 > x0) {
          const sF = Math.min(K.W / (x1 - x0), (K.H - kopfH) / (y1 - y0)) * 0.93, m = ST.aufBoden((x0 + x1) / 2, (y0 + y1) / 2);
          K.s = sF; K.x = m[0]; K.y = m[1];
          const w2 = ST.aufBoden(K.W / 2, K.H / 2 - kopfH / 2);
          erg = { s: sF, x: w2[0], y: w2[1] };
        }
        K.x = alt.x; K.y = alt.y; K.s = alt.s;
        ganz = Object.assign(erg, { W: K.W, H: K.H, dreh: K.dreh, n: SZ.objekte.length });
        return ganz;
      };
      const ueberblick = () => ganzeStadt().s;
      /* Wie beim alten Dorf: die kleine Karte mit den Vierteln erscheint erst, wenn man mit der Lupe näher dran ist. */
      const nahSetzen = (nah) => {
        lupeK.classList.toggle("an", nah); document.body.classList.toggle("lk-nah", nah);
        const i = lupeK.querySelector("i"); if (i && i.textContent !== (nah ? "−" : "+")) i.textContent = nah ? "−" : "+";
        lupeK.title = nah ? "Kompass: ganze Stadt" : "Kompass: näher ran"; lupeK.setAttribute("aria-label", lupeK.title);
      };
      /* FASSUNG 806 — XANDER: „die Lupe muss keine Lupe sein die kann wieder vorher Kompass sein … so ein kleiner Kreis …
         das Symbol oben links ruft das jedenfalls auf. Danach muss wieder die Uhrzeit stehen. In der Mitte … mein Spitzname".
         Oben links der Kompass des alten Dorfs (ganze Stadt ↔ näher ran, dann die kleine Karte und Verschieben mit dem
         Finger), daneben die Uhrzeit in Deutschland, in der Mitte das Ortsschild, rechts das Wetter (kommt vom Spiel). */
      SYM.kompass = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#f7f1e1" stroke="#6b4a22" stroke-width="2"/><circle cx="20" cy="20" r="14.5" fill="none" stroke="#c9b58a" stroke-width="1"/>'
        + '<g class="lk-nadel"><path d="M20 5.5l3.4 14.5h-6.8z" fill="#c8312b"/><path d="M20 34.5l-3.4-14.5h6.8z" fill="#3b3f4a"/></g><circle cx="20" cy="20" r="2" fill="#6b4a22"/>'
        + '<text x="20" y="4.6" font-size="5" font-weight="700" text-anchor="middle" fill="#6b4a22" font-family="system-ui,sans-serif">N</text></svg><i>+</i>';
      const kompass = () => {
        const nah = K.s > ueberblick() * 1.4, g = ganzeStadt();
        L().fliegeZu(nah ? g.x : K.x, nah ? g.y : K.y, nah ? g.s : g.s * 2.8, 600);
        nahSetzen(!nah);
      };
      const lupeK = knopf("kompass", "Kompass: näher ran", kompass, "lk-nur-mini lk-lupe");
      /* Doppeltipp auf die Wiese (wie im alten Dorf): mit dem Kompass zurück zur ganzen Stadt */
      O.doppelTipp = () => { if (document.body.classList.contains("lk-mini-modus") && document.body.classList.contains("lk-nah")) kompass(); };
      /* FASSUNG 807 — „ein bisschen die Karte auch rotieren": mit dem Kompass ein Knopf zum Drehen */
      const drehK = knopf("rechts", "Karte drehen", () => { drehen(1); if (!document.body.classList.contains("lk-nah")) { const g = ganzeStadt(); K.x = g.x; K.y = g.y; K.s = g.s; } }, "lk-nur-mini lk-drehknopf");
      setInterval(() => { if (document.body.classList.contains("lk-mini-modus")) nahSetzen(K.s > ueberblick() * 1.4); }, 700);
      const vollK = knopf("voll", "Vollbild", () => { try { window.parent.postMessage({ typ: "leicht-voll" }, location.origin); } catch (e) {} }, "lk-nur-mini lk-vollknopf");
      /* FASSUNG 809 — XANDER: „Mir fehlen noch die items zum schmücken die finde ich hier in der kleinen Map noch gar nicht".
         Unter dem kleinen Bild (im Spiel) stehen „Schmücken" und „Bauen": das Spiel meldet vorher, welche Leiste nach dem
         Umschalten ins Vollbild aufgehen soll (im Bild selbst kein Knopf, der Häuser verdeckt). */
      let nachVoll = "";
      window.addEventListener("message", (ev) => { if (ev.origin === location.origin && ev.source === window.parent && ev.data && ev.data.typ === "leicht-nachvoll") nachVoll = String(ev.data.was || ""); });
      O.nachVollOeffnen = () => { const w = nachVoll; nachVoll = ""; if (w === "schmuck") leisteZeigen(true); else if (w === "bauen") bauLeisteZeigen(true); };
      wurzel.append(lupeK, vollK, drehK);
      const kopfZ = el("div", "lk-kopfzeile", '<span class="lk-uhr" title="Uhrzeit in Deutschland"></span><span class="lk-ortsschild"><b></b></span><span class="lk-wetter" hidden></span>');
      wurzel.appendChild(kopfZ);
      const uhrStellen = () => {
        let t = ""; try { t = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" }).format(new Date()); } catch (e) { const d = new Date(); t = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
        const u = kopfZ.querySelector(".lk-uhr"); if (u.textContent !== t) u.textContent = t;
        const n = kopfZ.querySelector(".lk-ortsschild b"), name = O.kopfName || stadtName(); if (n.textContent !== name) n.textContent = name;
      };
      uhrStellen(); setInterval(uhrStellen, 10000);
      window.addEventListener("message", (ev) => {
        if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-kopf") return;
        O.kopfName = String(ev.data.name || "").slice(0, 40); uhrStellen();
        /* FASSUNG 807 — „Symbole aus" und „Namen aus" wie im alten Dorf: ohne Symbole nur „fertig", ohne Namen keine Schilder */
        document.body.classList.toggle("lk-ohne-symbole", ev.data.symbole === false);
        document.body.classList.toggle("lk-ohne-namen", ev.data.namen === false);
        const w = kopfZ.querySelector(".lk-wetter"); w.innerHTML = String(ev.data.wetter || ""); w.hidden = !ev.data.wetter;
      });
      /* Ein Viertel auf der kleinen Karte: im kleinen Rahmen mit der Lupen-Stärke, nicht mit der großen Nähe. */
      O.miniNah = () => { if (!document.body.classList.contains("lk-mini-modus")) return Math.max(K.s, 11 * K.dpr); nahSetzen(true); return ueberblick() * 2.8; };
      /* Schlank wie das alte Dorf: im kleinen Rahmen nur die kleinen Bilder (bilder.js) und höchstens die Lupen-Nähe. */
      const maxVoll = K.max;
      const modus = (klein) => {
        document.body.classList.toggle("lk-mini-modus", klein);
        document.documentElement.classList.toggle("lk-mini-html", klein);
        LB.nurKlein = klein;
        if (!klein && LB.vollLaden) LB.vollLaden().then(() => { L().unruhe = 2; });
        /* FASSUNG 806 — XANDER: „wenn man in der Vollbildansicht ist dann bricht das Ganze immer ab … dass die kleinen Häuser nur
           so groß gezoomt werden können, wie sie innerhalb des Rahmens vorher waren". Eingebettet bleibt auch das Vollbild
           schlank (Sparmodus: nie die großen Bilder, 12 Leute) – die Nähe reicht bis zum 1,6-Fachen der kleinen Bilder. */
        if (klein) K.min = Math.min(K.min, ueberblick() * 0.95);
        K.max = klein ? Math.max(K.min, ueberblick() * 4) : LB.spar ? Math.min(maxVoll, 18 * 1.6) : maxVoll;
        if (K.s > K.max) K.s = K.max;
        if (klein) { if (bauLeiste) bauLeisteZeigen(false); if (leiste && !leiste.hidden) leisteZeigen(false); karte.hidden = true; farbFeld.hidden = true; }
      };
      /* FASSUNG 809 — Walkie 304: „es stehen immer noch Schriften für die Namen der Häuser über den Häusern obwohl ich gar
         keine … eingeschaltet habe". Namen und Symbole sind aus, bis das Spiel sie einschaltet (wie im alten Dorf). */
      document.body.classList.add("lk-ohne-namen", "lk-ohne-symbole");
      const erstesMal = q.get("mini") === "1";
      modus(erstesMal);
      if (erstesMal) { const g = ganzeStadt(); K.x = g.x; K.y = g.y; K.s = g.s; L().unruhe = 2; }
      window.addEventListener("resize", () => { if (document.body.classList.contains("lk-mini-modus") && !document.body.classList.contains("lk-nah")) setTimeout(() => { const g = ganzeStadt(); K.x = g.x; K.y = g.y; K.s = g.s; L().unruhe = 2; }, 50); });
      window.addEventListener("message", (ev) => {
        if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-modus") return;
        modus(!ev.data.voll); L().unruhe = 2;
        if (ev.data.voll && O.nachVollOeffnen) setTimeout(O.nachVollOeffnen, 60);
      });
      /* FASSUNG 807 — XANDER: „aus unserer ganz normalen kleinen Dorf … heraus kann man über den Bereich des Bildes scrollen
         und man kommt … unter das Bild, um weiter zu scrollen in die Einzeleinstellungen vom Dorf … jetzt … bewegt sich jetzt
         die komplette Webseite nach oben oder nach unten. Das soll so nicht sein." Im normalen (festen) Bild wird das Wischen
         ans Spiel geschickt, das damit das Dorf-Menü rund um das Bild scrollt – mit Schwung wie ein echtes Scrollen. */
      const scrollModus = () => document.body.classList.contains("lk-mini-modus") && !document.body.classList.contains("lk-nah");
      const hoch = (d) => { try { window.parent.postMessage(Object.assign({ typ: "leicht-scroll" }, d), location.origin); } catch (x) {} };
      /* FASSUNG 809 — Walkie 304: „Das Scrollen ist sehr schwerfällig und hängt immer nach und schiebt sich zurück". Der
         Rahmen wandert beim Scrollen mit dem Menü mit – der Finger wurde relativ zum Rahmen gemessen (clientY), also hob
         sich die Bewegung auf und kam verspätet nach. Jetzt in Koordinaten der Spielseite (Finger + Lage des Rahmens). */
      const seitenY = (t) => { let o = 0; try { const f = window.frameElement; if (f) o = f.getBoundingClientRect().top; } catch (x) {} return t.clientY + o; };
      let wY = null, wT = 0, wV = 0;
      document.addEventListener("touchstart", (e) => { if (!scrollModus() || e.touches.length !== 1) { wY = null; return; } wY = seitenY(e.touches[0]); wT = performance.now(); wV = 0; hoch({ halt: 1 }); }, { passive: true });
      document.addEventListener("touchmove", (e) => {
        if (wY == null || !scrollModus() || e.touches.length !== 1) return;
        const y = seitenY(e.touches[0]), dy = wY - y, t = performance.now();
        wV = 0.7 * wV + 0.3 * dy / Math.max(1, t - wT); wY = y; wT = t;
        if (dy) hoch({ dy: dy });
      }, { passive: true });
      document.addEventListener("touchend", () => { if (wY == null) return; wY = null; if (performance.now() - wT < 90 && Math.abs(wV) > 0.08) hoch({ v: wV }); }, { passive: true });
      document.addEventListener("wheel", (e) => { if (scrollModus()) hoch({ dy: e.deltaY }); }, { passive: true });
      /* FASSUNG 806 — XANDER: „dass man in dieser neuen Map auch die Sachen anklicken kann … dass die Sachen verlinkt
         sind, dass ich schon in der Map jetzt schon einsammeln kann". Das Spiel schickt dieselben Zeichen wie im alten
         Dorfbild („4 Brot", „Bau 1:20", „kaputt", „Brot 2:10"); sie stehen über dem Haus. Ein Tipp darauf geht ans
         Spiel (wie ein Tipp aufs Haus): Fertiges wird sofort eingesammelt, eine Baustelle bekommt Hilfe. */
      /* ganz unten in der Bedienung: Lupe und Vollbild liegen immer darüber */
      const svgB = (inn) => '<svg class="lk-z-bild" viewBox="0 0 16 16" aria-hidden="true">' + inn + "</svg>";
      const WARE_BILD = {
        ei: svgB('<ellipse cx="6" cy="9" rx="3.6" ry="4.6" fill="#fbf3e2" stroke="#9c7a4c" stroke-width=".8"/><ellipse cx="10.6" cy="9.8" rx="3.2" ry="4.1" fill="#f1dcc0" stroke="#9c7a4c" stroke-width=".8"/><ellipse cx="5" cy="7.4" rx="1" ry="1.5" fill="#fff" opacity=".8"/>'),
        milch: svgB('<path d="M5.5 2h5v2l1.5 2.5V14H4V6.5L5.5 4z" fill="#fff" stroke="#5d6f87" stroke-width=".9"/><rect x="4" y="8" width="8" height="3" fill="#8fb7e3"/>'),
        getreide: svgB('<g stroke="#b8862b" stroke-width=".9" fill="#e7bf5a"><path d="M8 15V3" fill="none"/><ellipse cx="6.6" cy="5" rx="1.2" ry="2" transform="rotate(-25 6.6 5)"/><ellipse cx="9.4" cy="5" rx="1.2" ry="2" transform="rotate(25 9.4 5)"/><ellipse cx="6.6" cy="8.2" rx="1.2" ry="2" transform="rotate(-25 6.6 8.2)"/><ellipse cx="9.4" cy="8.2" rx="1.2" ry="2" transform="rotate(25 9.4 8.2)"/><ellipse cx="8" cy="2.6" rx="1.1" ry="1.8"/></g>'),
        mehl: svgB('<path d="M4 5c0-2 8-2 8 0l1 8c0 1.5-10 1.5-10 0z" fill="#f4efe4" stroke="#8a7a5c" stroke-width=".9"/><path d="M6 4l2-2 2 2" fill="none" stroke="#8a7a5c" stroke-width=".9"/><text x="8" y="11" font-size="4" text-anchor="middle" fill="#8a7a5c" font-family="system-ui" font-weight="700">M</text>'),
        brot: svgB('<path d="M2 10c0-4 3-6 6-6s6 2 6 6c0 2-12 2-12 0z" fill="#c78a3e" stroke="#7a4d1c" stroke-width=".9"/><path d="M5.5 6.5l1.2 2M8 5.8v2.4M10.5 6.5l-1.2 2" stroke="#f1d29a" stroke-width=".9"/>'),
        kuchen: svgB('<path d="M2 12V8l12-3v7z" fill="#f2d7a8" stroke="#8a5a2b" stroke-width=".9"/><path d="M2 8l12-3v2L2 10z" fill="#e79ab0"/><circle cx="10" cy="4" r="1.1" fill="#d23"/>'),
        torte: svgB('<rect x="2.5" y="7" width="11" height="6" rx="1" fill="#f6dcb0" stroke="#8a5a2b" stroke-width=".9"/><path d="M2.5 9h11" stroke="#e79ab0" stroke-width="1.6"/><path d="M8 3v3.5" stroke="#6b4a22"/><path d="M8 1.5c1 1 .6 1.8 0 2-.6-.2-1-1 0-2z" fill="#f5a623"/>'),
        fisch: svgB('<path d="M2 8c3-4 8-4 10 0-2 4-7 4-10 0z" fill="#9cc3dc" stroke="#3f6a86" stroke-width=".9"/><path d="M12 8l3-3v6z" fill="#9cc3dc" stroke="#3f6a86" stroke-width=".9"/><circle cx="5" cy="7.4" r=".8" fill="#223"/>'),
        holz: svgB('<rect x="1.5" y="9" width="13" height="4" rx="2" fill="#a0673a" stroke="#5e3a1c" stroke-width=".9"/><rect x="3" y="4.5" width="11" height="4" rx="2" fill="#b77a45" stroke="#5e3a1c" stroke-width=".9"/><circle cx="13" cy="6.5" r="1.4" fill="#e3c08a"/>'),
        erz: svgB('<path d="M3 12l2-6 4-2 4 3 1 5z" fill="#7d7f86" stroke="#3a3c42" stroke-width=".9"/><circle cx="7" cy="8" r="1" fill="#d9b44a"/><circle cx="10" cy="9.5" r=".8" fill="#d9b44a"/>'),
        bau: svgB('<path d="M3 14V6h10v8" fill="none" stroke="#7a4d1c" stroke-width="1.2"/><path d="M3 9h10M3 12h10M6 6v8M10 6v8" stroke="#b07a3c" stroke-width=".8"/><path d="M2 5l6-3 6 3" fill="none" stroke="#7a4d1c" stroke-width="1.2"/>'),
        korb: svgB('<path d="M2 7h12l-1.5 7h-9z" fill="#c9954f" stroke="#6b4a22" stroke-width=".9"/><path d="M4 7c0-4 8-4 8 0" fill="none" stroke="#6b4a22" stroke-width="1.1"/>')
      };
      WARE_BILD.eier = WARE_BILD.ei; WARE_BILD.gold = WARE_BILD.quarz = WARE_BILD.silizium = WARE_BILD.erz;
      /* FASSUNG 809 — Stationen ohne Haus: See (Zunge im Überblick) und Wald (dichteste Baumgruppe vorn), Jäger daneben */
      let waldMitte = null;
      const wald = () => {
        if (waldMitte && waldMitte.n === SZ.objekte.length) return waldMitte;
        const b = SZ.objekte.filter((o) => o.art === "natur" && !o.hinten && /^n_(tanne|laubbaum)/.test(o.bild || ""));
        let best = null, bn = -1;
        for (const o of b) { let n = 0; for (const q of b) if (Math.hypot(o.x - q.x, o.y - q.y) < 12) n++; if (n > bn) { bn = n; best = o; } }
        waldMitte = { n: SZ.objekte.length, x: best ? best.x : 0, y: best ? best.y : 0, h: 12 };
        return waldMitte;
      };
      const ORTE = {
        see: () => { const v = D.SEE_VERSATZ || [0, 0]; return { x: 66 + v[0], y: 56 + v[1] - 3, h: 2 }; },
        wald: wald,
        jagd: () => { const w = wald(); return { x: w.x + 7, y: w.y - 5, h: 10 }; }
      };
      const zeichenEbene = el("div", "lk-zeichen-ebene");
      wurzel.insertBefore(zeichenEbene, wurzel.firstChild);
      let zeichen = {};
      window.addEventListener("message", (ev) => {
        if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-stand" || !ev.data.ich) return;
        L().ich = Object.assign({}, L().ich || {}, ev.data.ich);
        L().aufbauen();
      });
      window.addEventListener("message", (ev) => {
        if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-zeichen") return;
        zeichen = ev.data.z || {};
        const da = {};
        for (const b of Array.from(zeichenEbene.children)) { if (zeichen[b.dataset.g]) da[b.dataset.g] = b; else b.remove(); }
        for (const g in zeichen) {
          let b = da[g];
          if (!b) {
            b = el("button"); b.type = "button"; b.dataset.g = g;
            b.addEventListener("click", (e) => { e.stopPropagation(); try { window.parent.postMessage({ typ: "leicht-haus", g: g === "jagd" ? "wald" : g }, location.origin); } catch (x) {} });
            zeichenEbene.appendChild(b);
          }
          const kl = "lk-zeichen lk-z-" + zeichen[g][0] + (ORTE[g] ? " lk-z-ort" : "");
          if (b.className !== kl) b.className = kl;
          /* FASSUNG 807 — XANDER: „kannst du da ein Ei selber reinmachen … oder Getreide, dass du dann Getreidehalme
             darstellst … wenn die Schilder, dass sie dann passend sind wie sie früher waren". Das Schild wie im alten Dorf
             (gelb = fertig), vorn ein kleines Bild der Ware. */
          const inhalt = (WARE_BILD[zeichen[g][2]] || (zeichen[g][0] === "fertig" ? WARE_BILD.korb : "")) + "<span></span>";
          if (b.dataset.i !== inhalt) { b.dataset.i = inhalt; b.innerHTML = inhalt; }
          /* FASSUNG 809 — XANDER: „vielleicht einfach nur ne Kanne mit mal eins dran ohne großes Hintergrund". Fertig mit
             Bild der Ware: nur das Bild und „×4"; der ganze Text bleibt als Titel/Vorlesetext. */
          const voll = zeichen[g][1], n = /^(\d+)\s/.exec(voll || "");
          const text = zeichen[g][0] === "fertig" && n ? "×" + n[1] : voll;
          const sp = b.querySelector("span"); if (sp.textContent !== text) sp.textContent = text;
          if (b.title !== voll) { b.title = voll; b.setAttribute("aria-label", voll); }
        }
        O.zeichenLegen();
      });
      /* FASSUNG 806 — XANDER: „schau auch, dass du die Labels nach Möglichkeit wieder einbaust. Die Leute das auch aus dieser
         Ansicht sehen können, damit sie genau wissen, was was ist". Unter jedem Haus sein Name (wie „Namen" im alten Dorf). */
      const namenEbene = el("div", "lk-zeichen-ebene lk-namen-ebene");
      wurzel.insertBefore(namenEbene, zeichenEbene);
      const namenLegen = (haeuser) => {
        const da = {};
        for (const n of Array.from(namenEbene.children)) { if (haeuser[n.dataset.g]) da[n.dataset.g] = n; else n.remove(); }
        for (const g in haeuser) {
          const o = haeuser[g]; let n = da[g];
          if (!n) { n = el("span", "lk-name-schild"); n.dataset.g = g; namenEbene.appendChild(n); }
          const t = o.name + (o.stufenZahl > 1 ? " " + o.stufenZahl : ""); if (n.textContent !== t) n.textContent = t;
          const P = ST.proj(o.x, o.y, 0), x = P[0] / K.dpr, y = P[1] / K.dpr;
          const drin = x > -40 && y > -20 && x < K.W / K.dpr + 40 && y < K.H / K.dpr + 20;
          n.style.display = drin ? "" : "none";
          if (drin) n.style.transform = "translate(" + x.toFixed(1) + "px," + (y + 2).toFixed(1) + "px) translate(-50%,0)";
        }
      };
      O.zeichenLegen = () => {
        const haeuser = {};
        for (const o of SZ.objekte) if (o.art === "haus" && o.spiel) haeuser[o.spiel] = o;
        if (document.body.classList.contains("lk-mini-modus")) namenLegen(haeuser); else if (namenEbene.firstChild) namenEbene.textContent = "";
        if (!zeichenEbene.firstChild) return;
        for (const b of zeichenEbene.children) {
          const o = haeuser[b.dataset.g] || (ORTE[b.dataset.g] && Object.assign({ stufe: 1 }, ORTE[b.dataset.g](), { hoehe: ORTE[b.dataset.g]().h / 0.8 }));
          if (!o) { b.style.display = "none"; continue; }
          const P = ST.proj(o.x, o.y, (o.hoehe || 10) * (o.stufe || 1) * 0.8), x = P[0] / K.dpr, y = P[1] / K.dpr;
          const drin = x > -40 && y > -20 && x < K.W / K.dpr + 40 && y < K.H / K.dpr + 20;
          b.style.display = drin ? "" : "none";
          /* nicht unter die Kopfzeile (Kompass, Uhr, Ortsschild) rutschen */
          if (drin) b.style.transform = "translate(" + x.toFixed(1) + "px," + Math.max(y, 62).toFixed(1) + "px) translate(-50%,-100%)";
        }
      };
    }
    miniMalen();
  };
  function stadtName() { const ich = L().ich || {}; return ich.dorf_name || "Meine Stadt"; }
  function nameSetzen() {
    const SP = ST.spiel, n = kopf.querySelector(".lk-name");
    n.innerHTML = "<b></b><span></span>";
    n.querySelector("b").textContent = stadtName();
    n.querySelector("span").textContent = SP.beispiel ? (SP.fehler === "nicht angemeldet" ? "Beispielstadt · bitte anmelden" : "Beispielstadt · Vorschau") : "Neue Stadt · Vorschau";
  }
  O.betreiberDa = function () { nameSetzen(); if (zeitK && jahrK) zeitK.hidden = jahrK.hidden = !(ST.spiel && ST.spiel.betreiber); };
  O.neuAufgebaut = function () { if (kopf) nameSetzen(); miniMalen(); };

  function drehen(r) {
    const mitte = [K.x, K.y];
    K.dreh = (K.dreh + r + 4) & 3; K.x = mitte[0]; K.y = mitte[1];
    SZ.geaendert(); L().unruhe = 2; miniMalen();
    ansage(["Blick nach Norden", "Blick nach Osten", "Blick nach Süden", "Blick nach Westen"][K.dreh]);
  }

  /* Mini-Karte: Wege, Wasser, Häuser, Bildausschnitt */
  function miniMalen() {
    if (!miniC) return;
    const g = 144, px = Math.round(120 * (window.devicePixelRatio || 1));
    miniC.width = miniC.height = px;
    const c = miniC.getContext("2d"), f = px / g;
    c.fillStyle = SZ.jahr === "winter" ? "#e9eef5" : "#9dbb72"; c.fillRect(0, 0, px, px);
    const B = ST.boden, N = B.N, r = B.RAND * B.AUFL, d = B.daten;
    const img = c.createImageData(px, px);
    for (let j = 0; j < px; j++) for (let i = 0; i < px; i++) {
      const ki = Math.floor(r + i / px * g * B.AUFL), kj = Math.floor(r + j / px * g * B.AUFL), o = (kj * N + ki) * 4, p = (j * px + i) * 4;
      let col = SZ.jahr === "winter" ? [233, 238, 245] : [157, 187, 114];
      if (d[o + 1] > 90) col = [120, 162, 200]; else if (d[o] > 90) col = [176, 168, 156]; else if (d[o + 3] > 90) col = SZ.jahr === "winter" ? [220, 228, 238] : [134, 176, 96];
      img.data[p] = col[0]; img.data[p + 1] = col[1]; img.data[p + 2] = col[2]; img.data[p + 3] = 255;
    }
    c.putImageData(img, 0, 0);
    for (const o of SZ.objekte) {
      if (o.versteckt || o.art === "natur" || o.deko) continue;
      c.fillStyle = o.art === "haus" ? (o.bau ? "#e0a030" : "#a4432f") : "#6b5b52";
      /* FASSUNG 808 — die Grundfläche gedreht (auch schräg) */
      c.beginPath(); SZ.ecken(o).forEach((p, i) => { const x = (p[0] + g / 2) * f, y = (p[1] + g / 2) * f; if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.closePath(); c.fill();
    }
  }

  /* ---------------- Schmuck-Leiste (Baukasten) ---------------- */
  const SCHMUCK = [
    ["Laterne", "d_laterne", [0.8, 0.8], 4.4], ["Bank", "d_bank", [1.9, 0.75], 0.9], ["Zaun", "d_zaun", [4, 0.3], 1.2], ["Brunnen", "d_brunnen", [4.6, 4.6], 5.4],
    ["Tanne", "n_tanne0", [3.5, 3.5], 13], ["Tanne", "n_tanne1", [3.5, 3.5], 13], ["Laubbaum", "n_laubbaum0", [4.5, 4.5], 13], ["Laubbaum", "n_laubbaum2", [4.5, 4.5], 13],
    ["Apfelbaum", "n_obstbaum0", [3, 3], 6], ["Apfelbaum", "n_obstbaum1", [3, 3], 6],
    ["Christbaum", "d_weihnachtsbaum", [7.4, 7.4], 21.8, 1], ["Marktbude", "d_marktbude", [4, 3.2], 4.2, 1], ["Schneemann", "d_schneemann", [1.3, 1.3], 1.9, 1],
    ["Pyramide", "d_pyramide", [9.2, 9.2], 13, 1], ["Krippe", "d_krippe", [7.2, 5.4], 5.2, 1],
    /* FASSUNG 808 — neue Modelle aus stadt/modelle/ (gebacken, stadt-leicht/backplan.json); an Stelle 5 die Gruppe.
       Geladen wird ein Bild erst, wenn die Leiste offen ist oder das Ding in der Stadt steht. */
    ["Rathaus Döbeln", "w_rathaus_doebeln", [44.2, 21], 32.5, 0, "Wahrzeichen"],
    ["Dodge Viper", "v_viper", [1.92, 4.45], 1.12, 0, "Fahrzeuge"], ["Batmobil", "v_batmobil", [2.1, 5.9], 1.12, 0, "Fahrzeuge"],
    ["Pferdebahn", "v_pferdebahn", [2.3, 9.6], 3, 0, "Fahrzeuge"], ["Kornwagen", "v_pferdewagen_korn", [2, 6.5], 2.6, 0, "Fahrzeuge"],
    ["Mehlwagen", "v_pferdewagen_mehl", [2, 6.5], 2.6, 0, "Fahrzeuge"], ["Leerer Wagen", "v_pferdewagen_leer", [2, 6.5], 2.6, 0, "Fahrzeuge"],
    ["Gleis", "d_gleis", [3, 4], 0.1, 0, "Gleise"], ["Gleisbogen", "d_gleis_kurve", [7.5, 7.5], 0.1, 0, "Gleise"]
  ];
  function leisteZeigen(an) {
    if (!leiste) {
      leiste = el("div", "lk-leiste");
      let gruppe = "";
      for (const s of SCHMUCK) {
        /* FASSUNG 808 — Überschrift, wenn eine neue Gruppe beginnt (Wahrzeichen, Fahrzeuge, Gleise) */
        if (s[5] && s[5] !== gruppe) { gruppe = s[5]; leiste.appendChild(el("div", "lk-gruppe", "<span>" + gruppe + "</span>")); }
        const b = el("button", "lk-karte-klein"); b.type = "button";
        const bild = s[1] + "_" + (s[4] ? "winter" : SZ.jahr === "winter" ? "winter" : "herbst") + "_tag_f_0_k";
        b.innerHTML = '<img alt="" src="stadt-leicht/bilder/' + bild + '.webp' + (LB.version ? "?v=" + LB.version : "") + '"><span>' + s[0] + "</span>";
        b.addEventListener("click", (e) => { e.stopPropagation(); setzenBeginnen(s); });
        leiste.appendChild(b);
      }
      wurzel.appendChild(leiste);
    }
    leiste.hidden = !an;
    wurzel.classList.toggle("leiste-offen", an);
  }

  /* ---------------- Bauen: alle Gebäude des Spiels ---------------- */
  function platzVon(k) { const plan = (L().ich && L().ich.dorf_plan && L().ich.dorf_plan.platz) || {}; return plan[k] || k; }
  function bauLeisteZeigen(an) {
    if (leiste) leisteZeigen(false);
    if (bauLeiste) { bauLeiste.remove(); bauLeiste = null; }
    wurzel.classList.toggle("leiste-offen", an);
    if (!an) return;
    bauLeiste = el("div", "lk-leiste lk-bauleiste");
    const dorf = (L().ich && L().ich.dorf) || {};
    for (const k in D.GEBAEUDE) {
      const G = D.GEBAEUDE[k], haus = SZ.objekte.find((o) => o.art === "haus" && o.spiel === k);
      const st = (dorf[k] && dorf[k].stufe) || 0;
      const text = haus && haus.bau ? "im Bau" : st ? "Stufe " + st : G[2] ? "ab Level " + G[2] : G[1] + " P.";
      const b = el("button", "lk-karte-klein" + (st || (haus && haus.bau) ? "" : " lk-frei")); b.type = "button";
      const bild = D.BILD[k][0] + "_" + (SZ.jahr === "winter" ? "winter" : "herbst") + "_tag_f_0_k";
      b.innerHTML = '<img alt="" src="stadt-leicht/bilder/' + bild + '.webp' + (LB.version ? "?v=" + LB.version : "") + '"><span>' + G[0] + "</span><small>" + text + "</small>";
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        bauLeisteZeigen(false);
        const pk = platzVon(k), pl = D.PLAETZE[pk];
        if (pl) L().fliegeZu(pl.x, pl.y, Math.max(K.s, 16 * K.dpr), 800);
        if (haus) waehlen(haus); else karteZeigen("bauplatz", null, pk);
      });
      bauLeiste.appendChild(b);
    }
    wurzel.appendChild(bauLeiste);
  }

  /* ---------------- Setzen: Geist in der Bildmitte ---------------- */
  let geist = null, geistZiehen = false;
  function setzenBeginnen(s) {
    leisteZeigen(false);
    auswahlWeg();
    const p = ST.aufBoden(K.W / 2, K.H * 0.46);
    geist = SZ.neu({ art: "eigen", bild: s[1], x: p[0], y: p[1], dreh: 0, fuss: s[2], hoehe: s[3], nurWinter: s[4] ? 1 : undefined, geist: true });
    karteZeigen("setzen", geist);
  }
  O.haltAufbau = () => !!geist;
  /* FASSUNG 809 — ein gebautes Haus versetzen: es wird selbst zum Geist (gestrichelt), Abbrechen stellt es zurück */
  function hausVersetzen(o) {
    if (geist) geistFertig(false);
    auswahlWeg();
    o._zurueck = { x: o.x, y: o.y, dreh: o.dreh };
    o.geist = true; geist = o;
    karteZeigen("setzen", geist); SZ.geaendert(); L().unruhe = 2;
  }
  function geistFertig(ok) {
    if (!geist) return;
    if (ok) { geist.geist = false; L().dekoSpeichern(); ansage("Gesetzt"); }
    else if (geist._zurueck) { Object.assign(geist, geist._zurueck); geist.geist = false; delete geist._zurueck; }
    else SZ.weg(geist);
    if (geist) delete geist._zurueck;
    geist = null; karte.hidden = true; SZ.geaendert(); miniMalen(); L().unruhe = 2;
    if (L().aufbauenSpaeter) L().aufbauen();
  }

  /* ---------------- Antippen ---------------- */
  O.zeigerRunter = function (p) {
    geistZiehen = false;
    if (geist) {
      /* auf dem Geist angesetzt? dann zieht der Finger den Geist */
      const t = SZ.treffer(p.x, p.y, (o) => o === geist);
      const G = ST.proj(geist.x, geist.y, 0);
      if (t || Math.hypot(p.x - G[0], p.y - G[1]) < 50 * K.dpr) geistZiehen = true;
    }
  };
  O.zeigerZiehen = function (neu, alt) {
    if (!geist || !geistZiehen) return false;
    const a = ST.aufBoden(neu.x, neu.y), b = ST.aufBoden(alt.x, alt.y);
    geist.x += a[0] - b[0]; geist.y += a[1] - b[1]; SZ.geaendert();
    return true;
  };
  O.zeigerHoch = function () { geistZiehen = false; };
  O.tippen = function (px, py) {
    farbFeld.hidden = true;
    if (geist) { const a = ST.aufBoden(px, py); geist.x = a[0]; geist.y = a[1]; SZ.geaendert(); L().unruhe = 2; return; }
    if (leiste && !leiste.hidden) { leisteZeigen(false); return; }
    if (bauLeiste) { bauLeisteZeigen(false); return; }
    const o = SZ.treffer(px, py, (o) => o.art !== "natur" || o.rand !== 1);
    if (o && (o.art === "haus" || o.art === "wunder" || o.art === "eigen" || o.name)) { waehlen(o); return; }
    /* FASSUNG 809 — XANDER: „Waldstück … wenn man auf die Bäume klickt … einen Effekt". Ein Baum raschelt: Blätter
       (im Winter Schnee) rieseln, zwei Vögel fliegen auf; im Spiel öffnet sich die Wald-Station darunter. */
    const baum = SZ.treffer(px, py, (x) => x.art === "natur" && /^n_(tanne|laubbaum|obstbaum|baum|birke|kiefer)/.test(x.bild || ""));
    if (baum) {
      baumRascheln(baum);
      if (window.parent !== window && document.body.classList.contains("lk-mini-modus")) { try { window.parent.postMessage({ typ: "leicht-haus", g: "wald" }, location.origin); } catch (e) {} }
      auswahlWeg(); return;
    }
    /* leerer Bauplatz? */
    const a = ST.aufBoden(px, py);
    /* FASSUNG 807 — im Spiel eingebettet: ein Tipp auf den See angelt (wie im alten Dorf); Doppeltipp auf die Wiese
       führt mit dem Kompass zurück zur ganzen Stadt */
    if (window.parent !== window && document.body.classList.contains("lk-mini-modus")) {
      if (ST.boden.wert(a[0], a[1], 1) > 0.4) { try { window.parent.postMessage({ typ: "leicht-haus", g: "see" }, location.origin); } catch (e) {} return; }
      const jetzt = performance.now();
      if (O._tipp && jetzt - O._tipp.t < 380 && Math.hypot(O._tipp.x - px, O._tipp.y - py) < 40 * K.dpr) { O._tipp = null; if (O.doppelTipp) O.doppelTipp(); return; }
      O._tipp = { t: jetzt, x: px, y: py };
    }
    for (const k in D.PLAETZE) {
      const pl = D.PLAETZE[k];
      if (Math.hypot(pl.x - a[0], pl.y - a[1]) > 6.5) continue;
      if (SZ.objekte.some((x) => x.art === "haus" && Math.hypot(x.x - pl.x, x.y - pl.y) < 1)) continue;
      auswahlWeg(); karteZeigen("bauplatz", null, k); return;
    }
    auswahlWeg();
  };
  const rascheln = [];
  function baumRascheln(o) {
    const t0 = performance.now(), jahr = SZ.jahr, h = (o.hoehe || 10) * (o.stufe || 1);
    const farben = jahr === "winter" ? ["#ffffff", "#e8f1fb"] : jahr === "herbst" ? ["#d9822b", "#c2561d", "#e8b23a"] : ["#5f9a3a", "#7cb34a", "#4c8330"];
    const teile = [];
    for (let i = 0; i < 14; i++) teile.push({ z: h * (0.45 + Math.random() * 0.45), dx: (Math.random() - 0.5) * 3.2, dy: (Math.random() - 0.5) * 3.2, v: 0.35 + Math.random() * 0.4, w: Math.random() * 6, f: farben[i % farben.length] });
    rascheln.push({ o: o, t0: t0, teile: teile, voegel: jahr === "winter" ? 1 : 2 });
    if (rascheln.length > 6) rascheln.shift();
    L().unruhe = 2;
  }
  SZ.zuhoerer.push(function (g) {
    const jetzt = performance.now();
    for (let i = rascheln.length - 1; i >= 0; i--) {
      const r = rascheln[i], d = (jetzt - r.t0) / 1000;
      if (d > 3.2) { rascheln.splice(i, 1); continue; }
      const kk = K.s * (r.o.stufe || 1);
      g.save();
      for (const p of r.teile) {
        const z = Math.max(0, p.z - d * p.v * 6), P = ST.proj(r.o.x + p.dx + Math.sin(d * 3 + p.w) * 0.6, r.o.y + p.dy, z);
        g.globalAlpha = Math.max(0, Math.min(1, 1.6 - d * 0.5)) * (z > 0 ? 1 : Math.max(0, 1 - (d - 2) * 2));
        g.fillStyle = p.f;
        g.beginPath(); g.ellipse(P[0], P[1], Math.max(1.2 * K.dpr, 0.18 * kk), Math.max(0.8 * K.dpr, 0.1 * kk), d * 4 + p.w, 0, Math.PI * 2); g.fill();
      }
      g.globalAlpha = Math.max(0, 1 - d / 3.2); g.strokeStyle = "#2b2a2e"; g.lineWidth = Math.max(1.2, 0.12 * kk);
      for (let v = 0; v < r.voegel; v++) {
        const P = ST.proj(r.o.x + (v ? 1 : -1) * d * 3, r.o.y - d * 2, (r.o.hoehe || 10) * (r.o.stufe || 1) * 0.9 + d * d * 5);
        const sp = Math.max(3 * K.dpr, 0.5 * kk), fl = Math.sin(d * 18 + v * 2) * sp * 0.5;
        g.beginPath(); g.moveTo(P[0] - sp, P[1] - fl); g.quadraticCurveTo(P[0] - sp * 0.4, P[1] - sp * 0.3, P[0], P[1]); g.quadraticCurveTo(P[0] + sp * 0.4, P[1] - sp * 0.3, P[0] + sp, P[1] - fl); g.stroke();
      }
      g.restore();
    }
  });
  /* FASSUNG 808 — XANDER: „du hast gesagt acht Winkel und hast sie nicht umgesetzt die möchte ich bitte". Was schräge
     Bilder hat (Spielgebäude, Bank, Zaun, Fahrzeuge …), dreht in Achtelschritten (45°), alles andere wie bisher in
     Vierteln. r = +1 links herum, −1 rechts herum. */
  function objDrehen(o, r, merken) {
    if (!o) return;
    const schritt = SZ.achtWinkel(o.bild) ? 0.5 : 1;
    o.dreh = SZ.drehNorm((o.dreh || 0) + r * schritt);
    SZ.geaendert(); miniMalen(); L().unruhe = 2;
    if (merken) L().dekoSpeichern();
    ansage("Gedreht: " + Math.round(o.dreh * 90) + "°");
  }
  O.objDrehen = objDrehen;
  function waehlen(o) { SZ.auswahl = o; karteZeigen("haus", o); L().unruhe = 2; }
  function auswahlWeg() { SZ.auswahl = null; if (!geist) karte.hidden = true; L().unruhe = 2; }

  function zeitText(ms) { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  /* Welches Gebäude gehört auf diesen Platz? (Umsetzen im Spiel beachten) */
  function wasGehoertHin(platz) {
    const plan = (L().ich && L().ich.dorf_plan && L().ich.dorf_plan.platz) || {};
    for (const k in plan) if (plan[k] === platz) return k;
    return plan[platz] ? null : platz;
  }
  function karteZeigen(art, o, platz) {
    /* FASSUNG 801 — XANDER: „in der ganz kleinen Miniaturansicht muss man dann auch nur auf Einsammeln klicken können und
       dann muss das funktionieren". Im kleinen Dorfrahmen des Spiels öffnet ein Tipp auf ein Gebäude (oder einen Bauplatz)
       die gewohnte Karte des Spiels UNTER dem Rahmen – dort sind Einsammeln, Ausbauen, Arbeiter. Wischen bleibt Ansehen. */
    if (document.body.classList.contains("lk-mini-modus") && window.parent !== window && (art === "haus" || art === "bauplatz")) {
      const g = art === "haus" ? o && o.spiel : platz;
      if (g) { try { window.parent.postMessage({ typ: "leicht-haus", g: g }, location.origin); } catch (e) {} }
      return;
    }
    karte.hidden = false; karte.innerHTML = "";
    const titel = el("div", "lk-karte-titel"), zeile = el("div", "lk-karte-zeile"), knoepfe = el("div", "lk-karte-knoepfe");
    karte.append(titel, zeile, knoepfe);
    const zu = knopf("kreuz", "Schließen", () => { if (geist) geistFertig(false); auswahlWeg(); karte.hidden = true; }, "lk-klein");
    if (art === "setzen") {
      titel.textContent = o && o.art === "haus" ? o.name + " versetzen" : "Schmuck setzen";
      zeile.textContent = "Mit dem Finger verschieben oder auf die Wiese tippen.";
      knoepfe.append(knopf("links", "Drehen", () => objDrehen(geist, 1)), knopf("rechts", "Andersherum drehen", () => objDrehen(geist, -1)),
        knopf("haken", "Setzen", () => geistFertig(true), "lk-gut"), knopf("kreuz", "Abbrechen", () => geistFertig(false)));
      return;
    }
    if (art === "bauplatz") {
      const k = wasGehoertHin(platz), G = k && D.GEBAEUDE[k];
      titel.textContent = G ? "Bauplatz: " + G[0] : "Bauplatz";
      if (!G) { zeile.textContent = "Dieser Platz ist im Spiel einem anderen Haus zugeteilt."; knoepfe.append(zu); return; }
      const preis = G[1], lv = G[2];
      zeile.textContent = "Preis " + preis + " Punkte" + (lv ? " · ab Level " + lv : "") + " · Bauzeit 2 min";
      const bau = el("button", "lk-text-knopf", SYM.hammer + "<span>Bauen</span>"); bau.type = "button";
      bau.addEventListener("click", (e) => { e.stopPropagation(); aktion(() => ST.spiel.bauen(k), G[0] + " wird gebaut"); });
      if (ST.spiel.beispiel) { bau.disabled = true; bau.title = "In der Beispielstadt wird nicht gebaut – bitte anmelden"; }
      knoepfe.append(bau, zu);
      return;
    }
    /* Haus, Wahrzeichen, Kulisse oder eigener Schmuck */
    titel.textContent = o.name || (SCHMUCK.find((s) => s[1] === o.bild) || [""])[0] || "Schmuck";
    if (o.art === "haus") {
      const aktualisieren = () => {
        if (karte.hidden || SZ.auswahl !== o) return false;
        if (o.bau && o.bau.bis) {
          const rest = o.bau.bis - Date.now();
          zeile.innerHTML = '<div class="lk-balken"><i style="width:' + Math.round(Math.max(0, Math.min(1, 1 - rest / o.bau.dauer)) * 100) + '%"></i></div><span>' + (o.bau.stufe > 1 ? "Ausbau auf Stufe " + o.bau.stufe : "Im Bau") + " · noch " + zeitText(rest) + "</span>";
        } else zeile.textContent = "Stufe " + (o.stufenZahl || 1) + " von 3";
        return true;
      };
      aktualisieren();
      karte._uhr = aktualisieren;
      if (o.bau) {
        const h = el("button", "lk-text-knopf", SYM.hammer + "<span>Helfen</span>"); h.type = "button";
        h.addEventListener("click", (e) => { e.stopPropagation(); aktion(() => ST.spiel.helfen(o.spiel), "Geholfen – 15 s schneller"); });
        if (ST.spiel.beispiel) h.disabled = true;
        knoepfe.append(h);
      } else if ((o.stufenZahl || 1) < 3) {
        /* FASSUNG 795 — Ausbau direkt am Haus (dieselbe Serverfunktion wie im Spiel) */
        const a = el("button", "lk-text-knopf", SYM.hammer + "<span>Ausbauen</span>"); a.type = "button";
        a.addEventListener("click", (e) => { e.stopPropagation(); aktion(() => ST.spiel.bauen(o.spiel), o.name + " wird ausgebaut"); });
        if (ST.spiel.beispiel) { a.disabled = true; a.title = "In der Beispielstadt wird nicht gebaut – bitte anmelden"; }
        knoepfe.append(a);
      }
      knoepfe.append(knopf("links", "Drehen", () => objDrehen(o, 1, true)), knopf("rechts", "Andersherum drehen", () => objDrehen(o, -1, true)),
        knopf("versetzen", "Versetzen", () => hausVersetzen(o)));
      if (o.platzX != null && (Math.abs(o.x - o.platzX) > 0.01 || Math.abs(o.y - o.platzY) > 0.01 || o.dreh !== o.platzDreh))
        knoepfe.append(knopf("zurueck", "Zurück auf den Bauplatz", () => { o.x = o.platzX; o.y = o.platzY; o.dreh = o.platzDreh; SZ.geaendert(); miniMalen(); L().dekoSpeichern(); ansage("Wieder auf dem Bauplatz"); karteZeigen("haus", o); }));
      knoepfe.append(zu);
      return;
    }
    if (o.art === "eigen") {
      zeile.textContent = "Dein Schmuck";
      knoepfe.append(knopf("links", "Drehen", () => objDrehen(o, 1, true)), knopf("rechts", "Andersherum drehen", () => objDrehen(o, -1, true)),
        knopf("versetzen", "Versetzen", () => { SZ.weg(o); geist = SZ.neu(Object.assign({}, o, { geist: true })); karteZeigen("setzen", geist); }),
        knopf("abriss", "Entfernen", () => { SZ.weg(o); L().dekoSpeichern(); karte.hidden = true; miniMalen(); L().unruhe = 2; }), zu);
      return;
    }
    zeile.textContent = o.art === "wunder" ? "Wahrzeichen" : "Gehört zum Dorf";
    knoepfe.append(zu);
  }
  function aktion(fn, text) {
    fn().then((r) => {
      ansage(text);
      return ST.spiel.neuLaden().then((ich) => { if (ich) L().ich = ich; L().aufbauen(); });
    }).catch((e) => { ansage((e && (e.message || e.hint)) || "Geht gerade nicht"); });
  }

  /* je Bild: Laden-Vorhang, Baufortschritt der Uhr nach */
  let naechsteBauPruefung = 0;
  O.vorBild = function (jetzt) {
    if (jetzt > naechsteBauPruefung) {
      naechsteBauPruefung = jetzt + 1000;
      let fertig = false;
      for (const o of SZ.objekte) if (o.bau && o.bau.bis) {
        o.bau.p = Math.max(o.stufenZahl ? 0.72 : 0, Math.min(1, 1 - (o.bau.bis - Date.now()) / o.bau.dauer));
        if (o.bau.p >= 1) fertig = true;
      }
      if (karte && !karte.hidden && karte._uhr) karte._uhr();
      /* fertig gebaut: Stand neu holen (der Server schließt den Bau ab) */
      if (fertig && !O._holt) { O._holt = true; ST.spiel.neuLaden().then((ich) => { if (ich) L().ich = ich; L().aufbauen(); O._holt = false; }, () => { O._holt = false; }); }
    }
  };
  O.bild = function () {
    if (O.zeichenLegen) O.zeichenLegen();
    if (deckel && deckel.isConnected) {
      const offen = LB.offen();
      const bar = deckel.querySelector("em");
      if (bar) bar.style.width = Math.max(8, 100 - offen * 3) + "%";
      /* FASSUNG 796 — nicht auf ALLE Bilder warten: nach spätestens 2,5 s
         (oder wenn alles da ist) geht der Vorhang auf; der Rest lädt sichtbar nach. */
      if (!O._vorhangSeit) O._vorhangSeit = performance.now();
      if (SZ.sichtbare.length && (offen === 0 || performance.now() - O._vorhangSeit > 2500)) { deckel.classList.add("weg"); setTimeout(() => deckel.remove(), 500); }
    }
  };
})();
