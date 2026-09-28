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
  const BEREICHE = [["Tannenwald", "Kirchplatz", "Obstwiese"], ["Domplatz", "Anger", "Mühlbach"], ["Gärten", "Bahnhof", "Seeufer"]];
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
    if (q.get("still") === "1" || q.get("mini") === "1") deckel.remove();

    /* FASSUNG 799 — XANDER: „so klein möchte ich es haben … in diesem kleinen Frame, wo das alte auch ist … wenn man in
       dieser kleinen Miniaturansicht reinzoomt, dann bleibt es ja trotzdem dieser Ausschnitt … die Zoomstärke, die wir in
       der alten Version schon haben". Im kleinen Dorfrahmen des Spiels (mini=1) zeigt die Stadt nur das Bild: ganz im
       Überblick, eine Lupe (doppelt so nah, wie beim alten Dorf), die kleine Karte zum Durchtippen der Viertel und ein
       Knopf fürs Vollbild. Im Vollbild ist alles wieder da. Das Spiel schaltet um (postMessage „leicht-modus"). */
    if (eingebettet) {
      const ueberblick = () => Math.max(K.min, Math.min(K.max, K.W / 150));
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
      const lupeK = knopf("kompass", "Kompass: näher ran", () => {
        const nah = K.s > ueberblick() * 1.4;
        L().fliegeZu(nah ? 0 : K.x, nah ? 4 : K.y, nah ? ueberblick() : ueberblick() * 2.2, 600);
        nahSetzen(!nah);
      }, "lk-nur-mini lk-lupe");
      setInterval(() => { if (document.body.classList.contains("lk-mini-modus")) nahSetzen(K.s > ueberblick() * 1.4); }, 700);
      const vollK = knopf("voll", "Vollbild", () => { try { window.parent.postMessage({ typ: "leicht-voll" }, location.origin); } catch (e) {} }, "lk-nur-mini lk-vollknopf");
      wurzel.append(lupeK, vollK);
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
        const w = kopfZ.querySelector(".lk-wetter"); w.innerHTML = String(ev.data.wetter || ""); w.hidden = !ev.data.wetter;
      });
      /* Ein Viertel auf der kleinen Karte: im kleinen Rahmen mit der Lupen-Stärke, nicht mit der großen Nähe. */
      O.miniNah = () => { if (!document.body.classList.contains("lk-mini-modus")) return Math.max(K.s, 11 * K.dpr); nahSetzen(true); return ueberblick() * 2.2; };
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
        K.max = klein ? Math.max(K.min, ueberblick() * 2.3) : LB.spar ? Math.min(maxVoll, 18 * 1.6) : maxVoll;
        if (K.s > K.max) K.s = K.max;
        if (klein) { if (bauLeiste) bauLeisteZeigen(false); if (leiste && !leiste.hidden) leisteZeigen(false); karte.hidden = true; farbFeld.hidden = true; }
      };
      const erstesMal = q.get("mini") === "1";
      modus(erstesMal);
      if (erstesMal) { K.x = 0; K.y = 4; K.s = ueberblick(); L().unruhe = 2; }
      window.addEventListener("message", (ev) => {
        if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-modus") return;
        modus(!ev.data.voll); L().unruhe = 2;
      });
      /* FASSUNG 806 — XANDER: „dass man in dieser neuen Map auch die Sachen anklicken kann … dass die Sachen verlinkt
         sind, dass ich schon in der Map jetzt schon einsammeln kann". Das Spiel schickt dieselben Zeichen wie im alten
         Dorfbild („4 Brot", „Bau 1:20", „kaputt", „Brot 2:10"); sie stehen über dem Haus. Ein Tipp darauf geht ans
         Spiel (wie ein Tipp aufs Haus): Fertiges wird sofort eingesammelt, eine Baustelle bekommt Hilfe. */
      /* ganz unten in der Bedienung: Lupe und Vollbild liegen immer darüber */
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
            b.addEventListener("click", (e) => { e.stopPropagation(); try { window.parent.postMessage({ typ: "leicht-haus", g: g }, location.origin); } catch (x) {} });
            zeichenEbene.appendChild(b);
          }
          const kl = "lk-zeichen lk-z-" + zeichen[g][0];
          if (b.className !== kl) b.className = kl;
          if (b.textContent !== zeichen[g][1]) b.textContent = zeichen[g][1];
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
          const o = haeuser[b.dataset.g];
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
  O.betreiberDa = function () { nameSetzen(); };
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
      const w = (o.fuss ? o.fuss[0] : 2) * f, h = (o.fuss ? o.fuss[1] : 2) * f, quer = (o.dreh & 1) === 1;
      c.fillStyle = o.art === "haus" ? (o.bau ? "#e0a030" : "#a4432f") : "#6b5b52";
      const ww = quer ? h : w, hh = quer ? w : h;
      c.fillRect((o.x + g / 2) * f - ww / 2, (o.y + g / 2) * f - hh / 2, ww, hh);
    }
  }

  /* ---------------- Schmuck-Leiste (Baukasten) ---------------- */
  const SCHMUCK = [
    ["Laterne", "d_laterne", [0.8, 0.8], 4.4], ["Bank", "d_bank", [1.9, 0.75], 0.9], ["Zaun", "d_zaun", [4, 0.3], 1.2], ["Brunnen", "d_brunnen", [4.6, 4.6], 5.4],
    ["Tanne", "n_tanne0", [3.5, 3.5], 13], ["Tanne", "n_tanne1", [3.5, 3.5], 13], ["Laubbaum", "n_laubbaum0", [4.5, 4.5], 13], ["Laubbaum", "n_laubbaum2", [4.5, 4.5], 13],
    ["Apfelbaum", "n_obstbaum0", [3, 3], 6], ["Apfelbaum", "n_obstbaum1", [3, 3], 6],
    ["Christbaum", "d_weihnachtsbaum", [7.4, 7.4], 21.8, 1], ["Marktbude", "d_marktbude", [4, 3.2], 4.2, 1], ["Schneemann", "d_schneemann", [1.3, 1.3], 1.9, 1],
    ["Pyramide", "d_pyramide", [9.2, 9.2], 13, 1], ["Krippe", "d_krippe", [7.2, 5.4], 5.2, 1]
  ];
  function leisteZeigen(an) {
    if (!leiste) {
      leiste = el("div", "lk-leiste");
      for (const s of SCHMUCK) {
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
  function geistFertig(ok) {
    if (!geist) return;
    if (ok) { geist.geist = false; L().dekoSpeichern(); ansage("Gesetzt"); }
    else SZ.weg(geist);
    geist = null; karte.hidden = true; SZ.geaendert(); miniMalen(); L().unruhe = 2;
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
    /* leerer Bauplatz? */
    const a = ST.aufBoden(px, py);
    for (const k in D.PLAETZE) {
      const pl = D.PLAETZE[k];
      if (Math.hypot(pl.x - a[0], pl.y - a[1]) > 6.5) continue;
      if (SZ.objekte.some((x) => x.art === "haus" && Math.hypot(x.x - pl.x, x.y - pl.y) < 1)) continue;
      auswahlWeg(); karteZeigen("bauplatz", null, k); return;
    }
    auswahlWeg();
  };
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
      titel.textContent = "Schmuck setzen";
      zeile.textContent = "Mit dem Finger verschieben oder auf die Wiese tippen.";
      knoepfe.append(knopf("links", "Drehen", () => { geist.dreh = (geist.dreh + 1) & 3; SZ.geaendert(); L().unruhe = 2; }), knopf("rechts", "Drehen", () => { geist.dreh = (geist.dreh + 3) & 3; SZ.geaendert(); L().unruhe = 2; }),
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
      knoepfe.append(knopf("links", "Drehen", () => { o.dreh = (o.dreh + 1) & 3; SZ.geaendert(); L().dekoSpeichern(); L().unruhe = 2; }), knopf("rechts", "Drehen", () => { o.dreh = (o.dreh + 3) & 3; SZ.geaendert(); L().dekoSpeichern(); L().unruhe = 2; }), zu);
      return;
    }
    if (o.art === "eigen") {
      zeile.textContent = "Dein Schmuck";
      knoepfe.append(knopf("links", "Drehen", () => { o.dreh = (o.dreh + 1) & 3; SZ.geaendert(); L().dekoSpeichern(); L().unruhe = 2; }),
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
