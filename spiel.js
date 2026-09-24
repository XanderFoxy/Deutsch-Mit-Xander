/* =====================================================================
   SPIELSYSTEM „DEUTSCH ZUM ÜBERLEBEN" — das Gesicht im Browser
   ---------------------------------------------------------------------
   XANDER (Funk 95): „Bau als nächstes zuerst das Spielsystem mit allem
   was ich dir dazu gesagt habe … inklusive deutsch-spielsystem dass die
   Leute diese Punkte sammeln können die Sie brauchen um zu überleben und
   um sich zu wehren."
   Die Regeln stehen in SPIELSYSTEM.md. Gerechnet wird NUR auf dem Server
   (Supabase-Funktionen spiel_*): Lebenspunkte, Punkte, Treffer, Laden.
   Diese Datei zeigt an, fragt den Server und schickt den anderen im Raum,
   was sie sehen sollen (Geschoss, Zahlen, neuer Stand).
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------
     WAFFEN, SCHUTZ, LADEN — dieselben Zahlen wie auf dem Server
     --------------------------------------------------------------- */
  /* XANDER (Funk 89): „verschiedene Schusstechniken richten
     unterschiedlichen Schaden an". Preise und Schaden: SPIELSYSTEM.md. */
  var WAFFEN = {
    zwille:       { name: "Zwille",          schaden: 6,  preis: 0,   flug: 520, ton: "zwille" },
    bogen:        { name: "Pfeil und Bogen", schaden: 8,  preis: 0,   flug: 620, ton: "pfeilschuss" },
    laser:        { name: "Laser",           schaden: 7,  preis: 0,   flug: 260, ton: "laserrot" },
    armbrust:     { name: "Armbrust",        schaden: 12, preis: 40,  flug: 460, ton: "schuss" },
    tomahawk:     { name: "Tomahawk",        schaden: 15, preis: 60,  flug: 720, ton: "swoosh" },
    zielfernrohr: { name: "Zielfernrohr",    schaden: 35, preis: 100, flug: 950, ton: "zielfernrohr" },
    bazooka:      { name: "Bazooka",         schaden: 28, preis: 150, flug: 820, ton: "granatenpfeifen" }
  };
  var WAFFEN_REIHE = ["zwille", "bogen", "laser", "armbrust", "tomahawk", "zielfernrohr", "bazooka"];
  var LADEN = [
    { ding: "pflaster",    name: "Pflaster",        preis: 15,  was: "repariert, wenn du kaputt bist (dann 40 LP), sonst +25 LP" },
    { ding: "trank",       name: "Heiltrank",       preis: 30,  was: "+60 Lebenspunkte" },
    { ding: "schild",      name: "Schutzschild",    preis: 50,  was: "Aura, reist mit, fängt 60 Schaden ab (10 min)" },
    { ding: "mauer_holz",  name: "Mauer aus Holz",  preis: 20,  was: "bleibt am Platz, hält 40 Schaden" },
    { ding: "mauer_stein", name: "Mauer aus Stein", preis: 45,  was: "bleibt am Platz, hält 90 Schaden" },
    { ding: "mauer_stahl", name: "Mauer aus Stahl", preis: 80,  was: "bleibt am Platz, hält 160 Schaden" },
    { ding: "wischer",     name: "Scheibenwischer", preis: 25,  was: "wischt 3× automatisch Dreck weg" },
    { ding: "geschuetz",   name: "Geschütz",        preis: 60,  was: "schießt 5× automatisch zurück" },
    { ding: "haustier",    name: "Fellmonster",     preis: 120, was: "beißt jeden, der dich angreift" }
  ];
  var NIVEAUS = ["A1", "A2", "B1", "B2", "C1", "C2"];
  var LASERFARBEN = ["#ff2d2d", "#2dff6a", "#2d8bff", "#ff2df1", "#ffd22d"];

  /* ---------------------------------------------------------------
     ZUSTAND
     --------------------------------------------------------------- */
  var S = {
    klient: null, uid: "", ich: null, bereit: false, versucht: false,
    stand: {},              /* spielId → öffentlicher Stand */
    waffe: "", laserfarbe: LASERFARBEN[0],
    duell: null,            /* { id, gegner (spielId), bis } */
    niveau: "A1", aufgabe: null, mission: null,
    stillstand: false, letzterAbruf: 0, einspielen: false
  };
  try { S.niveau = localStorage.getItem("dma_spiel_niveau") || "A1"; } catch (e) {}
  try { S.laserfarbe = localStorage.getItem("dma_spiel_laser") || LASERFARBEN[0]; } catch (e) {}

  function LC() { return window.LiveChat || null; }
  function B() { return window.DMA_SPIEL_BRUECKE || {}; }
  function ton(name, laut) { try { if (B().ton) B().ton(name, laut); } catch (e) {} }
  function hinweis(text) {
    try { if (B().toast) { B().toast(text); return; } } catch (e) {}
    try { console.log("[Spiel]", text); } catch (e) {}
  }
  function drin() { var l = LC(); try { return Boolean(l && l.lage && l.lage().lage === "drin"); } catch (e) { return false; } }

  /* ---------------------------------------------------------------
     ANMELDUNG: Konto (auth.uid) oder anonyme Gastsitzung
     --------------------------------------------------------------- */
  function klientHolen() {
    if (S.klient) return Promise.resolve(S.klient);
    var be = window.Backend;
    var angemeldet = false;
    try { angemeldet = Boolean(be && be.currentUser && be.currentUser() && be.currentUser().id); } catch (e) {}
    if (angemeldet && be.zugang && be.zugang()) {
      S.klient = be.zugang();
      return Promise.resolve(S.klient);
    }
    if (!window.supabase || !window.SUPABASE_CONFIG) return Promise.reject(new Error("keine Verbindung"));
    /* Eigener Speicherplatz für die Gastsitzung — sonst hielte sich die
       Konto-Anmeldung der Seite (backend.js) plötzlich für angemeldet. */
    var k = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey,
      { auth: { storageKey: "dma-spiel-gast", persistSession: true, autoRefreshToken: true } });
    return k.auth.getSession().then(function (a) {
      if (a && a.data && a.data.session) return k;
      return k.auth.signInAnonymously().then(function (r) {
        if (r && r.error) throw r.error;
        return k;
      });
    }).then(function (kk) { S.klient = kk; return kk; });
  }

  function rpc(name, args) {
    return klientHolen().then(function (k) { return k.rpc(name, args || {}); }).then(function (r) {
      if (r && r.error) throw r.error;
      return r ? r.data : null;
    });
  }

  function beitreten() {
    if (S.bereit || S.versucht) return;
    /* Nach einem Fehlschlag erst nach 30 s wieder versuchen. */
    if (S.naechsterVersuch && Date.now() < S.naechsterVersuch) return;
    S.versucht = true;
    var l = LC(); var name = "";
    try { name = l.lage().ichName || ""; } catch (e) {}
    rpc("spiel_ich", { p_name: name }).then(function (ich) {
      S.ich = ich; S.uid = ich && ich.id; S.bereit = true; S.fehler = "";
      if (S.uid) S.stand[S.uid] = ich;
      try { if (l.spielKennungSetzen) l.spielKennungSetzen(S.uid); } catch (e) {}
      senden({ ereignis: "stand", stand: oeffentlich(ich) });
      abrufen(true);
      einspielenWennBetreiber();
      zeichnen();
    }).catch(function (e) {
      S.versucht = false;
      S.naechsterVersuch = Date.now() + 30000;
      /* Ohne Konto geht es nur, wenn in Supabase die anonyme Anmeldung
         eingeschaltet ist (Stand 24.09.: aus — 0 anonyme Nutzer). */
      S.fehler = window.Backend && window.Backend.currentUser && window.Backend.currentUser()
        ? "Das Spiel ist gerade nicht erreichbar – gleich noch mal."
        : "Zum Mitspielen bitte mit deinem Konto anmelden – Punkte und Lebenspunkte gehören zu deinem Konto.";
      panelAuffrischen();
      try { console.warn("[Spiel] Beitritt ging nicht:", e && e.message ? e.message : e); } catch (x) {}
    });
  }
  function oeffentlich(s) {
    if (!s) return null;
    var o = {};
    ["id", "name", "lp", "lp_max", "kaputt", "schild", "mauer_art", "mauer_lp", "haustier",
     "geschuetz", "wischer", "anfaenger", "verdient"].forEach(function (k) { o[k] = s[k]; });
    return o;
  }

  /* ---------------------------------------------------------------
     WER SITZT WO — Chat-Kennung ↔ Spiel-Kennung
     --------------------------------------------------------------- */
  function plaetze() { try { return LC().lage().plaetze || []; } catch (e) { return []; } }
  function spielIdVon(chatId) {
    if (!chatId) return "";
    var l = LC();
    try {
      if (chatId === l.lage().ichId) return S.uid;
      return (l.spielIdVon && l.spielIdVon(chatId)) || "";
    } catch (e) { return ""; }
  }
  function platzElVon(chatId) {
    return document.querySelector('#lcPlaetze .lc-platz[data-lc-id="' + String(chatId).replace(/"/g, "") + '"]');
  }

  /* Alle 12 s den Stand aller Sitzenden holen (Selbstheilung läuft auf
     dem Server mit). */
  function abrufen(sofort) {
    if (!S.bereit) return;
    var jetzt = Date.now();
    if (!sofort && jetzt - S.letzterAbruf < 12000) return;
    S.letzterAbruf = jetzt;
    var ids = [];
    plaetze().forEach(function (p) {
      if (p.leer) return;
      var sid = spielIdVon(p.id);
      if (sid && ids.indexOf(sid) < 0) ids.push(sid);
    });
    if (S.uid && ids.indexOf(S.uid) < 0) ids.push(S.uid);
    rpc("spiel_stand", { p_ids: ids }).then(function (liste) {
      (liste || []).forEach(function (s) { S.stand[s.id] = s; });
      return rpc("spiel_ich", { p_name: null });
    }).then(function (ich) {
      if (ich) { S.ich = ich; S.stand[ich.id] = oeffentlich(ich); }
      zeichnen(); panelAuffrischen();
    }).catch(function () {});
  }

  /* ---------------------------------------------------------------
     SENDEN / EMPFANGEN über den Raumkanal
     --------------------------------------------------------------- */
  function senden(o) { try { var l = LC(); if (l && l.spielSenden) l.spielSenden(o); } catch (e) {} }

  function empfangen(n) {
    if (!n || !n.ereignis) return;
    if (n.stand && n.stand.id) S.stand[n.stand.id] = n.stand;
    if (n.ziel_stand && n.ziel_stand.id) S.stand[n.ziel_stand.id] = n.ziel_stand;
    if (n.ich_stand && n.ich_stand.id) S.stand[n.ich_stand.id] = n.ich_stand;
    if (n.ereignis === "schuss") {
      geschossZeigen(n.von, n.zielChat, n.waffe, n.dx, n.dy, n.farbe);
    } else if (n.ereignis === "treffer") {
      trefferZeigen(n.zielChat, n);
      if (n.gegenwehr > 0) zahlZeigen(n.von, -n.gegenwehr, "Gegenwehr");
      if (n.zielChat === meineChatId()) {
        /* Ich wurde getroffen — mein Stand kommt vom Server nach. */
        setTimeout(function () { abrufen(true); }, 300);
      }
    } else if (n.ereignis === "ausgewichen") {
      zahlZeigen(n.zielChat, null, "ausgewichen");
    } else if (n.ereignis === "heilung") {
      zahlZeigen(n.von, n.plus, "");
      ton("zauberpuff", 0.4);
    } else if (n.ereignis === "duell" && n.an === meineChatId()) {
      duellFrage(n);
    } else if (n.ereignis === "duellstart") {
      var ich = meineChatId();
      if (n.a === ich || n.b === ich) {
        var gegnerChat = n.a === ich ? n.b : n.a;
        S.duell = { id: n.id, gegner: spielIdVon(gegnerChat), gegnerChat: gegnerChat, bis: Date.now() + 180000 };
        hinweis("⚔️ Duell läuft! Tippe auf " + (n.a === ich ? n.bName : n.aName) + ", um zu treffen.");
        panelAuffrischen();
      }
    } else if (n.ereignis === "duellnein" && n.an === meineChatId()) {
      hinweis("🙅 " + (n.name || "Die Person") + " hat das Duell abgelehnt.");
    }
    zeichnen();
  }
  function meineChatId() { try { return LC().lage().ichId; } catch (e) { return ""; } }

  /* ---------------------------------------------------------------
     DER KAMPFMODUS: Antippen trifft — nur mit Waffe oder im Duell
     ---------------------------------------------------------------
     XANDER (Funk 90): „nur wenn wir in diesem Kampfmodus sind kann man
     wenn man auf die Profilbilder klickt denjenigen direkt treffen dann
     tauschen sich die Plätze nicht aus sondern man trifft direkt und je
     nachdem wo man hinzielt auf den Winkel vom Profilbild desto viel
     Punkte kriegt man auch … und wenn wir nicht in diesem Kampfmodus sind
     … tauscht einfach nur die Plätze aus." */
  function imDuellMit(chatId) {
    if (!S.duell) return false;
    if (Date.now() > S.duell.bis) { S.duell = null; return false; }
    return S.duell.gegnerChat === chatId;
  }
  function kampfmodus() { return S.bereit && (Boolean(S.waffe) || Boolean(S.duell && Date.now() < S.duell.bis)); }

  /* Aufgerufen vom Tipp auf einen Platz (app.js). true = erledigt. */
  function tippAufPlatz(knopf, p, ev) {
    if (!S.bereit) return false;
    var ich = S.ich || {};
    if (p && !p.leer && !p.ich && (S.waffe || imDuellMit(p.id))) {
      schiessen(knopf, p, ev);
      return true;
    }
    if (ich.kaputt && p && (p.leer || !p.ich)) {
      hinweis("💔 Du bist kaputt – du kannst nicht reisen oder wechseln. Nimm ein Pflaster (⚔️ Spiel).");
      return true;
    }
    return false;
  }
  function gesperrt() { return Boolean(S.bereit && S.ich && S.ich.kaputt); }
  function gesperrtGrund() { return "💔 Du bist kaputt – du kannst nicht reisen oder wechseln. Nimm ein Pflaster (⚔️ Spiel)."; }

  function schiessen(knopf, p, ev) {
    if (S.stillstand) { hinweis("🕊️ Waffenstillstand – die Tafel ist offen."); return; }
    if (S.ich && S.ich.kaputt) { hinweis(gesperrtGrund()); return; }
    var waffe = S.waffe || "bogen";
    var zielSid = spielIdVon(p.id);
    if (!zielSid) { hinweis("🙈 " + (p.name || "Diese Person") + " spielt (noch) nicht mit."); return; }
    var kreis = knopf.querySelector(".lc-kreis") || knopf;
    var r = kreis.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var x = ev && typeof ev.clientX === "number" && ev.clientX ? ev.clientX : cx;
    var y = ev && typeof ev.clientY === "number" && ev.clientY ? ev.clientY : cy;
    var dx = Math.max(-1.5, Math.min(1.5, (x - cx) / (r.width / 2)));
    var dy = Math.max(-1.5, Math.min(1.5, (y - cy) / (r.height / 2)));
    dx = Math.round(dx * 100) / 100; dy = Math.round(dy * 100) / 100;
    var ichChat = meineChatId();
    var farbe = waffe === "laser" ? S.laserfarbe : "";
    senden({ ereignis: "schuss", zielChat: p.id, waffe: waffe, dx: dx, dy: dy, farbe: farbe });
    var dauer = geschossZeigen(ichChat, p.id, waffe, dx, dy, farbe);
    /* Ausweichen (Funk 89: „sie kann ausweichen"): Getroffen wird erst
       beim Einschlag — und nur, wer dann noch auf diesem Platz sitzt. */
    var nummer = Number(knopf.dataset.lcPlatz);
    setTimeout(function () {
      var jetzt = plaetze().find(function (q) { return q.nummer === nummer; });
      if (!jetzt || jetzt.id !== p.id) {
        senden({ ereignis: "ausgewichen", zielChat: p.id });
        zahlZeigen(p.id, null, "ausgewichen");
        return;
      }
      var raum = ""; try { raum = LC().lage().raum || ""; } catch (e) {}
      rpc("spiel_treffer", { p_ziel: zielSid, p_waffe: waffe, p_dx: dx, p_dy: dy, p_raum: raum }).then(function (erg) {
        if (!erg || !erg.ok) { hinweis("🛡️ " + ((erg && erg.grund) || "kein Treffer")); return; }
        if (erg.ziel) S.stand[erg.ziel.id] = erg.ziel;
        if (erg.ich) { S.stand[erg.ich.id] = erg.ich; if (S.ich) { S.ich.lp = erg.ich.lp; S.ich.kaputt = erg.ich.kaputt; } }
        var n = { ereignis: "treffer", zielChat: p.id, schaden: erg.schaden, abgewehrt: erg.abgewehrt,
                  zone: erg.zone, kaputt: erg.kaputt, gegenwehr: erg.gegenwehr,
                  ziel_stand: erg.ziel, ich_stand: erg.ich };
        senden(n);
        n.von = ichChat;
        trefferZeigen(p.id, n);
        if (erg.gegenwehr > 0) zahlZeigen(ichChat, -erg.gegenwehr, "Gegenwehr");
        if (erg.lohn > 0) hinweis("🪙 +" + erg.lohn + " Punkte fürs Treffen" + (erg.kaputt ? " – " + (p.name || "") + " ist kaputt!" : ""));
        if (erg.kaputt && S.duell && S.duell.gegnerChat === p.id) { hinweis("🏆 Duell gewonnen!"); S.duell = null; }
        abrufen(true);
      }).catch(function (e) { hinweis("Treffer ging nicht: " + (e && e.message ? e.message : e)); });
    }, dauer);
  }

  /* ---------------------------------------------------------------
     DIE GESCHOSSE — gezeichnet, keine Emoji
     --------------------------------------------------------------- */
  function geschossSvg(waffe, farbe) {
    if (waffe === "zwille") return '<svg viewBox="-6 -6 12 12"><ellipse rx="4.6" ry="3.8" fill="#7d7a73" stroke="#3f3d38" stroke-width="1"/><ellipse cx="-1.4" cy="-1.3" rx="1.4" ry=".9" fill="#b9b5ab"/></svg>';
    if (waffe === "bogen") return '<svg viewBox="-22 -5 44 10"><path d="M-18 0 H14" stroke="#8a5a2b" stroke-width="1.8"/><path d="M14 -3.6 L21 0 L14 3.6 Z" fill="#6b7078"/><path d="M-18 0 L-22 -4 M-18 0 L-22 4 M-15 0 L-19 -4 M-15 0 L-19 4" stroke="#d23b3b" stroke-width="1.6"/></svg>';
    if (waffe === "armbrust") return '<svg viewBox="-14 -5 28 10"><path d="M-11 0 H8" stroke="#3b3f45" stroke-width="3"/><path d="M8 -4 L14 0 L8 4 Z" fill="#9aa0a8" stroke="#3b3f45" stroke-width=".8"/><path d="M-11 0 L-14 -3 M-11 0 L-14 3" stroke="#2f7d32" stroke-width="2"/></svg>';
    if (waffe === "tomahawk") return '<svg viewBox="-12 -12 24 24"><path d="M-9 8 L6 -7" stroke="#7a4a22" stroke-width="3" stroke-linecap="round"/><path d="M2 -10 C8 -12 12 -8 11 -3 L4 -4 Z" fill="#b8bdc4" stroke="#50555c" stroke-width="1"/><path d="M-8 7 l2 -2" stroke="#d23b3b" stroke-width="2"/></svg>';
    if (waffe === "bazooka") return '<svg viewBox="-18 -7 36 14"><path d="M-12 -4 H8 Q14 -4 16 0 Q14 4 8 4 H-12 Z" fill="#5d6b3a" stroke="#2f3620" stroke-width="1"/><path d="M-12 -4 L-16 -7 L-14 0 L-16 7 L-12 4 Z" fill="#434d29"/><path d="M-16 -2 Q-24 0 -16 2 Z" fill="#ffb02e"/><rect x="0" y="-4" width="3" height="8" fill="#c9c14a"/></svg>';
    if (waffe === "laser") return '<svg viewBox="-20 -5 40 10"><path d="M-18 0 H18" stroke="' + (farbe || "#ff2d2d") + '" stroke-width="3" stroke-linecap="round"/><path d="M-18 0 H18" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".8"/></svg>';
    if (waffe === "zielfernrohr") return '<svg viewBox="-5 -3 10 6"><ellipse rx="4" ry="1.6" fill="#caa53a" stroke="#6d5a1c" stroke-width=".6"/></svg>';
    return "";
  }
  function mittelpunkt(chatId) {
    var el = platzElVon(chatId);
    if (!el) return null;
    var k = el.querySelector(".lc-kreis") || el;
    var r = k.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 };
  }
  /* Zeigt das Geschoss; gibt die Flugzeit zurück. */
  function geschossZeigen(vonChat, zielChat, waffe, dx, dy, farbe) {
    var w = WAFFEN[waffe] || WAFFEN.bogen;
    var a = mittelpunkt(vonChat), z = mittelpunkt(zielChat);
    if (!z) return w.flug;
    if (!a) a = { x: z.x, y: Math.max(0, z.y - 260), r: 0 };
    var zx = z.x + (Number(dx) || 0) * z.r, zy = z.y + (Number(dy) || 0) * z.r;
    var winkel = Math.atan2(zy - a.y, zx - a.x) * 180 / Math.PI;
    ton(w.ton, 0.5);
    if (waffe === "laser") {
      /* Der Strahl: eine Linie vom Schützen zum Ziel, die aufblitzt. */
      var len = Math.hypot(zx - a.x, zy - a.y);
      var strahl = document.createElement("div");
      strahl.className = "sp-laser";
      strahl.style.left = a.x + "px"; strahl.style.top = a.y + "px";
      strahl.style.width = len + "px";
      strahl.style.transform = "rotate(" + winkel + "deg)";
      strahl.style.setProperty("--farbe", farbe || "#ff2d2d");
      document.body.appendChild(strahl);
      setTimeout(function () { strahl.remove(); }, 420);
      einschlag(zx, zy, waffe, w.flug);
      return w.flug;
    }
    if (waffe === "zielfernrohr") {
      /* Erst das Fadenkreuz, das sich auf den Punkt einpendelt, dann der Schuss. */
      var kreuz = document.createElement("div");
      kreuz.className = "sp-fadenkreuz";
      kreuz.style.left = zx + "px"; kreuz.style.top = zy + "px";
      kreuz.innerHTML = '<svg viewBox="-20 -20 40 40"><circle r="15" fill="none" stroke="#e22" stroke-width="1.6"/><path d="M-19 0 H-6 M6 0 H19 M0 -19 V-6 M0 6 V19" stroke="#e22" stroke-width="1.6"/><circle r="1.4" fill="#e22"/></svg>';
      document.body.appendChild(kreuz);
      setTimeout(function () { kreuz.remove(); }, w.flug + 150);
      setTimeout(function () { ton("schuss", 0.55); }, w.flug - 60);
      einschlag(zx, zy, waffe, w.flug);
      return w.flug;
    }
    var g = document.createElement("div");
    g.className = "sp-geschoss sp-g-" + waffe;
    g.innerHTML = geschossSvg(waffe);
    document.body.appendChild(g);
    var bogen = waffe === "zwille" || waffe === "tomahawk" ? -40 : waffe === "bogen" ? -24 : 0;
    var mx = (a.x + zx) / 2, my = (a.y + zy) / 2 + bogen;
    var drehung = waffe === "tomahawk" ? 900 : 0;
    try {
      g.animate([
        { transform: "translate(" + a.x + "px," + a.y + "px) translate(-50%,-50%) rotate(" + winkel + "deg)" },
        { transform: "translate(" + mx + "px," + my + "px) translate(-50%,-50%) rotate(" + (winkel + drehung / 2) + "deg)", offset: 0.5 },
        { transform: "translate(" + zx + "px," + zy + "px) translate(-50%,-50%) rotate(" + (winkel + drehung) + "deg)" }
      ], { duration: w.flug, easing: "linear", fill: "forwards" });
    } catch (e) {}
    setTimeout(function () { g.remove(); }, w.flug + 30);
    einschlag(zx, zy, waffe, w.flug);
    return w.flug;
  }
  function einschlag(x, y, waffe, nach) {
    setTimeout(function () {
      var e = document.createElement("div");
      e.className = "sp-einschlag" + (waffe === "bazooka" ? " sp-einschlag-gross" : "");
      e.style.left = x + "px"; e.style.top = y + "px";
      document.body.appendChild(e);
      if (waffe === "bazooka") ton("explosion2", 0.6);
      setTimeout(function () { e.remove(); }, 650);
    }, nach);
  }

  /* ---------------------------------------------------------------
     ZAHLEN AM BILD — rot bei Treffern, grün bei Heilung (Funk 84)
     Sie steigen ÜBER dem Kreis auf: die Gesichtsmitte bleibt frei.
     --------------------------------------------------------------- */
  var ZONEN = { kopf: "Kopfschuss", herz: "Herz", koerper: "", streif: "Streifschuss", daneben: "daneben" };
  function zahlZeigen(chatId, wert, text) {
    var el = platzElVon(chatId);
    if (!el) return;
    var kreis = el.querySelector(".lc-kreis");
    var z = document.createElement("span");
    z.className = "sp-zahl " + (wert == null ? "sp-zahl-grau" : wert < 0 ? "sp-zahl-rot" : "sp-zahl-gruen");
    z.textContent = (wert == null ? "" : (wert > 0 ? "+" : "−") + Math.abs(wert)) + (text ? (wert == null ? "" : " ") + text : "");
    z.style.top = Math.max(0, (kreis ? kreis.offsetTop : 0) - 4) + "px";
    el.appendChild(z);
    setTimeout(function () { z.remove(); }, 1500);
  }
  function trefferZeigen(zielChat, n) {
    if (n.zone === "daneben") { zahlZeigen(zielChat, null, "daneben"); return; }
    if (n.schaden > 0) {
      zahlZeigen(zielChat, -n.schaden, ZONEN[n.zone] || "");
      var el = platzElVon(zielChat);
      if (el) {
        el.classList.remove("sp-getroffen"); void el.offsetWidth; el.classList.add("sp-getroffen");
        setTimeout(function () { el.classList.remove("sp-getroffen"); }, 500);
        try { if (B().schmerz) B().schmerz(el); } catch (e) {}
      }
    } else if (n.abgewehrt > 0) {
      zahlZeigen(zielChat, null, "abgewehrt");
    }
    if (n.kaputt) ton("glasbruch", 0.55);
  }

  /* ---------------------------------------------------------------
     DIE PLÄTZE SCHMÜCKEN: Lebensbalken, Schild, Mauer, Tier, Kaputt
     --------------------------------------------------------------- */
  function zeichnen() {
    var reihe = document.getElementById("lcPlaetze");
    if (!reihe) return;
    reihe.querySelectorAll(".lc-platz").forEach(function (el) {
      var chatId = el.dataset.lcId || "";
      var sid = chatId ? spielIdVon(chatId) : "";
      var s = sid ? S.stand[sid] : null;
      var kreis = el.querySelector(".lc-kreis");
      if (!s || !kreis || !S.bereit) { platzLeeren(el); return; }
      /* Unter dem NAMEN: zwischen Kreis und Name ist kein Platz, der
         Balken laege sonst auf der Schrift (Bild 24.09.). */
      var nameEl = el.querySelector(".lc-platz-name");
      var unterkante = nameEl ? nameEl.offsetTop + nameEl.offsetHeight : kreis.offsetTop + kreis.offsetHeight;
      /* Der Balken */
      var bal = el.querySelector(".sp-lp");
      if (!bal) {
        bal = document.createElement("span");
        bal.className = "sp-lp";
        bal.innerHTML = '<i class="sp-lp-voll"></i><i class="sp-lp-schild"></i>';
        el.appendChild(bal);
      }
      var anteil = Math.max(0, Math.min(1, (s.lp || 0) / (s.lp_max || 100)));
      var schildAnteil = Math.max(0, Math.min(1 - anteil, (s.schild || 0) / (s.lp_max || 100)));
      bal.style.top = (unterkante + 1) + "px";
      bal.style.left = (kreis.offsetLeft + kreis.offsetWidth * 0.18) + "px";
      bal.style.width = (kreis.offsetWidth * 0.64) + "px";
      bal.title = (s.name || "") + ": " + s.lp + " / " + s.lp_max + " LP" + (s.schild ? " · Schild " + s.schild : "");
      var voll = bal.querySelector(".sp-lp-voll");
      voll.style.width = (anteil * 100).toFixed(1) + "%";
      voll.style.background = anteil > 0.6 ? "#3bbf4a" : anteil > 0.3 ? "#e8b923" : "#e2403a";
      var sch = bal.querySelector(".sp-lp-schild");
      sch.style.left = (anteil * 100).toFixed(1) + "%";
      sch.style.width = (schildAnteil * 100).toFixed(1) + "%";
      /* Schild-Aura (reist mit) */
      schmuck(el, "sp-aura", s.schild > 0, kreis, "");
      /* Mauer (bleibt am Platz) — unten vor dem Bild, die Mitte bleibt frei */
      schmuck(el, "sp-mauer", s.mauer_lp > 0, kreis, mauerSvg(s.mauer_art), "sp-mauer-" + (s.mauer_art || "holz"));
      /* Das Fellmonster sitzt rechts unten neben dem Bild */
      schmuck(el, "sp-tier", Boolean(s.haustier), kreis, tierSvg());
      /* Das Geschütz links unten */
      schmuck(el, "sp-geschuetz", Boolean(s.geschuetz), kreis, geschuetzSvg());
      /* Kaputt: Risse und Grau */
      el.classList.toggle("sp-kaputt", Boolean(s.kaputt));
      schmuck(el, "sp-risse", Boolean(s.kaputt), kreis, risseSvg());
      el.classList.toggle("sp-anfaenger", Boolean(s.anfaenger));
      /* Meine aktive Waffe als kleines Abzeichen am eigenen Platz */
      var ich = chatId === meineChatId();
      schmuck(el, "sp-waffenmarke", ich && Boolean(S.waffe), kreis, ich && S.waffe ? geschossSvg(S.waffe) : "");
    });
    document.body.classList.toggle("sp-kampf", kampfmodus());
  }
  function schmuck(el, klasse, an, kreis, html, zusatz) {
    var s = el.querySelector("." + klasse);
    if (!an) { if (s) s.remove(); return; }
    if (!s) { s = document.createElement("span"); s.className = klasse; el.appendChild(s); }
    if (zusatz) s.className = klasse + " " + zusatz;
    if (s.dataset.html !== html) { s.innerHTML = html; s.dataset.html = html; }
    s.style.left = kreis.offsetLeft + "px";
    s.style.top = kreis.offsetTop + "px";
    s.style.width = kreis.offsetWidth + "px";
    s.style.height = kreis.offsetHeight + "px";
  }
  function platzLeeren(el) {
    el.querySelectorAll(".sp-lp,.sp-aura,.sp-mauer,.sp-tier,.sp-geschuetz,.sp-risse,.sp-waffenmarke").forEach(function (x) { x.remove(); });
    el.classList.remove("sp-kaputt", "sp-anfaenger");
  }
  function mauerSvg(art) {
    /* Eine niedrige Mauer vor dem unteren Bildrand: Holzlatten, Steine
       oder Stahlplatten — die Gesichtsmitte bleibt frei. */
    if (art === "stahl") return '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="2" y="80" width="96" height="18" rx="2" fill="#8d97a3" stroke="#4b525c" stroke-width="1.5"/><path d="M34 80 V98 M66 80 V98" stroke="#4b525c" stroke-width="1.5"/><g fill="#5c646e"><circle cx="8" cy="85" r="1.4"/><circle cx="28" cy="85" r="1.4"/><circle cx="40" cy="85" r="1.4"/><circle cx="60" cy="85" r="1.4"/><circle cx="72" cy="85" r="1.4"/><circle cx="92" cy="85" r="1.4"/></g><path d="M4 82 H96" stroke="#c9d1da" stroke-width="1" opacity=".7"/></svg>';
    if (art === "stein") return '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><g fill="#a39a8c" stroke="#5e574d" stroke-width="1.2"><rect x="2" y="80" width="24" height="9" rx="1.5"/><rect x="26" y="80" width="24" height="9" rx="1.5"/><rect x="50" y="80" width="24" height="9" rx="1.5"/><rect x="74" y="80" width="24" height="9" rx="1.5"/><rect x="2" y="89" width="12" height="9" rx="1.5"/><rect x="14" y="89" width="24" height="9" rx="1.5"/><rect x="38" y="89" width="24" height="9" rx="1.5"/><rect x="62" y="89" width="24" height="9" rx="1.5"/><rect x="86" y="89" width="12" height="9" rx="1.5"/></g></svg>';
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><g fill="#b07a45" stroke="#6b4521" stroke-width="1.2"><rect x="4" y="78" width="11" height="20" rx="1"/><rect x="18" y="80" width="11" height="18" rx="1"/><rect x="32" y="78" width="11" height="20" rx="1"/><rect x="46" y="80" width="11" height="18" rx="1"/><rect x="60" y="78" width="11" height="20" rx="1"/><rect x="74" y="80" width="11" height="18" rx="1"/><rect x="88" y="78" width="9" height="20" rx="1"/></g><rect x="2" y="86" width="96" height="4" fill="#8a5a2e"/></svg>';
  }
  function tierSvg() {
    /* XANDER (Funk 90): „so eine kleine schwarze Fellkugel mit Augen und
       … ein paar Krallen dann an den Händen … sehr bissig". */
    var fell = "";
    for (var i = 0; i < 18; i++) {
      var w = i * 20 * Math.PI / 180, r1 = 11, r2 = 14 + (i % 3);
      fell += "M" + (84 + Math.cos(w) * r1).toFixed(1) + " " + (84 + Math.sin(w) * r1).toFixed(1)
        + " L" + (84 + Math.cos(w) * r2).toFixed(1) + " " + (84 + Math.sin(w) * r2).toFixed(1) + " ";
    }
    return '<svg viewBox="0 0 100 100"><g class="sp-tier-koerper"><path d="' + fell + '" stroke="#111" stroke-width="2.4" stroke-linecap="round"/>'
      + '<circle cx="84" cy="84" r="12" fill="#161616"/>'
      + '<ellipse cx="79.5" cy="82" rx="3.2" ry="3.6" fill="#fff"/><ellipse cx="88.5" cy="82" rx="3.2" ry="3.6" fill="#fff"/>'
      + '<circle cx="80.3" cy="82.8" r="1.5" fill="#c21"/><circle cx="89.3" cy="82.8" r="1.5" fill="#c21"/>'
      + '<path d="M78 89 L80 91 L82 89 L84 91 L86 89 L88 91 L90 89" fill="none" stroke="#fff" stroke-width="1"/>'
      + '<path d="M71 90 l-3 2 M71 88 l-3.5 0 M97 90 l3 2 M97 88 l3.5 0" stroke="#e9e1c8" stroke-width="1.2" stroke-linecap="round"/></g></svg>';
  }
  function geschuetzSvg() {
    return '<svg viewBox="0 0 100 100"><rect x="6" y="88" width="16" height="8" rx="2" fill="#4a5058"/><circle cx="14" cy="86" r="6" fill="#626a73" stroke="#30353b"/><path d="M14 86 L27 78" stroke="#30353b" stroke-width="4" stroke-linecap="round"/></svg>';
  }
  function risseSvg() {
    return '<svg viewBox="0 0 100 100"><g fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.6" stroke-linejoin="round"><path d="M50 8 L46 30 L56 44 L44 62 L52 92"/><path d="M46 30 L24 22 M56 44 L80 36 M44 62 L20 70 M52 78 L74 84"/></g><g fill="none" stroke="rgba(0,0,0,.45)" stroke-width=".8"><path d="M51 8 L47 30 L57 44 L45 62 L53 92"/></g></svg>';
  }

  /* ---------------------------------------------------------------
     WAFFENSTILLSTAND — solange die Tafel offen ist (Funk 89)
     --------------------------------------------------------------- */
  function tafelPruefen() {
    var karte = document.getElementById("livechatKarte");
    var offen = Boolean(karte && karte.classList.contains("lc-tafel-an"));
    if (offen === S.stillstand) return;
    S.stillstand = offen;
    if (offen) { S.waffe = ""; hinweis("🕊️ Waffenstillstand – die Tafel ist offen."); }
    var be = window.Backend, betreiber = false;
    try { betreiber = Boolean(be && ((be.isOwner && be.isOwner()) || (be.canModerate && be.canModerate()))); } catch (e) {}
    if (betreiber && S.bereit) {
      var raum = ""; try { raum = LC().lage().raum || ""; } catch (e) {}
      rpc("spiel_waffenstillstand", { p_raum: raum, p_an: offen }).catch(function () {});
    }
    zeichnen();
  }

  /* ---------------------------------------------------------------
     SCHEIBENWISCHER — fängt Dreck ab (Funk 84)
     Jedes Gerät sieht am öffentlichen Stand, ob noch Ladungen da sind;
     nur das eigene Gerät zieht beim Server eine Ladung ab.
     --------------------------------------------------------------- */
  function dreckAbwehren(platzEl) {
    if (!S.bereit || !platzEl) return false;
    var chatId = platzEl.dataset.lcId || "";
    var sid = spielIdVon(chatId);
    var s = sid ? S.stand[sid] : null;
    if (!s || !(s.wischer > 0)) return false;
    s.wischer -= 1;
    if (chatId === meineChatId()) {
      rpc("spiel_wischer", {}).then(function () { abrufen(true); }).catch(function () {});
    }
    try { if (B().wischer) B().wischer(platzEl); } catch (e) {}
    return true;
  }

  /* ---------------------------------------------------------------
     NACH DEM PLATZWECHSEL: die Mauer bleibt zurück (Funk 84)
     --------------------------------------------------------------- */
  function platzGewechselt() {
    if (!S.bereit || !S.ich || !(S.ich.mauer_lp > 0)) return;
    rpc("spiel_platzwechsel", {}).then(function (r) {
      if (r && r.mauer_weg) hinweis("🧱 Deine Mauer bleibt am alten Platz zurück.");
      abrufen(true);
    }).catch(function () {});
  }

  /* ---------------------------------------------------------------
     LEHRERNOTEN zählen auch im Spiel (18.09.: „bekommen die anderen
     diese Punkte gutgeschrieben")
     --------------------------------------------------------------- */
  function lehrerNote(chatId, note) {
    var sid = spielIdVon(chatId);
    if (!sid || !S.bereit) return;
    rpc("spiel_lehrer_punkte", { p_ziel: sid, p_note: Number(note) }).catch(function () {});
  }

  /* ---------------------------------------------------------------
     DUELL (Funk 90): „fordert dich zum Duell heraus annehmen oder nicht"
     --------------------------------------------------------------- */
  function duellFordern(chatId, name) {
    var sid = spielIdVon(chatId);
    if (!sid) { hinweis((name || "Die Person") + " spielt (noch) nicht mit."); return; }
    rpc("spiel_duell", { p_ziel: sid }).then(function (r) {
      if (!r || !r.ok) { hinweis((r && r.grund) || "geht gerade nicht"); return; }
      var ichName = ""; try { ichName = LC().lage().ichName || ""; } catch (e) {}
      senden({ ereignis: "duell", an: chatId, id: r.id, name: ichName });
      hinweis("⚔️ Herausforderung an " + (name || "") + " geschickt – warte auf die Antwort.");
    }).catch(function (e) { hinweis("Duell ging nicht: " + (e && e.message ? e.message : e)); });
  }
  function duellFrage(n) {
    var box = document.createElement("div");
    box.className = "sp-frage";
    box.innerHTML = '<div class="sp-frage-text">⚔️ <b></b> fordert dich zum Duell heraus. Annehmen?</div>'
      + '<div class="sp-frage-knoepfe"><button type="button" data-ja="1">Annehmen</button><button type="button" data-ja="0">Ablehnen</button></div>';
    box.querySelector("b").textContent = n.name || "Jemand";
    document.body.appendChild(box);
    var weg = setTimeout(function () { box.remove(); }, 60000);
    box.addEventListener("click", function (ev) {
      var k = ev.target.closest("button");
      if (!k) return;
      clearTimeout(weg); box.remove();
      var ja = k.dataset.ja === "1";
      rpc("spiel_duell_antwort", { p_id: n.id, p_ja: ja }).then(function (r) {
        if (!r || !r.ok) { hinweis((r && r.grund) || "abgelaufen"); return; }
        var ich = meineChatId(), ichName = ""; try { ichName = LC().lage().ichName || ""; } catch (e) {}
        if (ja) {
          var start = { ereignis: "duellstart", id: n.id, a: n.von, b: ich, aName: n.name || "", bName: ichName };
          senden(start); empfangen(start);
        } else {
          senden({ ereignis: "duellnein", an: n.von, name: ichName });
        }
      }).catch(function () {});
    });
  }

  /* ---------------------------------------------------------------
     DAS SPIELFENSTER
     --------------------------------------------------------------- */
  var panel = null, reiter = "start";
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  /* Die Aufgaben tragen teils <strong> — nur das darf bleiben. */
  function frageHtml(t) { return esc(t).replace(/&lt;(\/?)strong&gt;/g, "<$1strong>"); }

  function menue(tab) {
    beitreten();
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "spPanel";
      panel.className = "sp-panel";
      document.body.appendChild(panel);
      panel.addEventListener("click", panelKlick);
    }
    if (tab) reiter = tab;
    panel.hidden = false;
    panelAuffrischen();
  }
  function schliessen() { if (panel) panel.hidden = true; }

  function panelAuffrischen() {
    if (!panel || panel.hidden) return;
    var ich = S.ich;
    var kopf = '<div class="sp-kopf"><b>⚔️ Deutsch zum Überleben</b><button type="button" class="sp-zu" data-tu="zu" aria-label="Schließen">✕</button></div>';
    if (!ich) {
      panel.innerHTML = kopf + '<div class="sp-leer">' + esc(S.fehler || (S.versucht ? "Einen Moment – ich melde dich im Spiel an …" : "Das Spiel geht im Klassenzimmer.")) + "</div>";
      return;
    }
    var anteil = Math.max(0, Math.min(100, Math.round((ich.lp / ich.lp_max) * 100)));
    var status = '<div class="sp-status">'
      + '<div class="sp-status-lp"><span class="sp-status-balken"><i style="width:' + anteil + '%"></i></span> <b>' + ich.lp + " / " + ich.lp_max + "</b> LP"
      + (ich.kaputt ? ' <span class="sp-rot">· kaputt</span>' : "") + (ich.anfaenger ? ' <span class="sp-blau">· Anfängerschutz</span>' : "") + "</div>"
      + '<div class="sp-status-werte"><span>🪙 ' + ich.punkte + " Punkte</span><span>📚 " + ich.verdient + " verdient</span><span>🩹 " + ich.pflaster
      + "</span><span>🧪 " + ich.traenke + "</span><span>🛡️ " + Math.round((ich.ruestung || 0) * 100) + " % Rüstung</span></div>"
      + (S.stillstand ? '<div class="sp-hinweis">🕊️ Waffenstillstand – die Tafel ist offen.</div>' : "")
      + (S.waffe ? '<div class="sp-hinweis">🎯 ' + esc(WAFFEN[S.waffe].name) + ' ist angelegt – tippe auf ein Gesicht, um zu schießen. <button type="button" data-tu="ablegen">Ablegen</button></div>' : "")
      + (S.duell && Date.now() < S.duell.bis ? '<div class="sp-hinweis">⚔️ Duell läuft – tippe auf deinen Gegner.</div>' : "")
      + "</div>";
    var tabs = [["start", "Übersicht"], ["deutsch", "Deutsch"], ["waffen", "Waffen"], ["schutz", "Schutz & Laden"], ["duell", "Duell"], ["rang", "Rangliste"]];
    var leiste = '<div class="sp-tabs">' + tabs.map(function (t) {
      return '<button type="button" data-tab="' + t[0] + '" class="' + (reiter === t[0] ? "sp-an" : "") + '">' + t[1] + "</button>";
    }).join("") + "</div>";
    panel.innerHTML = kopf + status + leiste + '<div class="sp-inhalt">' + inhalt() + "</div>";
  }

  function inhalt() {
    var ich = S.ich;
    if (reiter === "start") {
      return '<p class="sp-text">Punkte gibt es <b>nur für Deutsch</b>. Damit kaufst du Pflaster, Schutz und Waffen. Wer mehr Deutsch lernt, wird stärker (mehr LP, mehr Rüstung).</p>'
        + '<div class="sp-knoepfe"><button type="button" data-tab="deutsch">📚 Aufgabe lösen</button>'
        + '<button type="button" data-tu="heilen" data-art="pflaster"' + (ich.pflaster > 0 ? "" : " disabled") + '>🩹 Pflaster (' + ich.pflaster + ')</button>'
        + '<button type="button" data-tu="heilen" data-art="trank"' + (ich.traenke > 0 ? "" : " disabled") + '>🧪 Heiltrank (' + ich.traenke + ')</button></div>'
        + '<p class="sp-klein">Kampf: Waffe anlegen, dann auf ein Gesicht tippen. Kopf ×2, Herz ×1,6, Körper ×1, Rand ×0,5. Wer vor dem Einschlag den Platz wechselt, weicht aus. Kaputt (0 LP) = kein Reisen bis zum Pflaster. Tafel offen = Waffenstillstand.</p>';
    }
    if (reiter === "deutsch") {
      var chips = NIVEAUS.map(function (n) {
        return '<button type="button" data-tu="niveau" data-n="' + n + '" class="' + (S.niveau === n ? "sp-an" : "") + '">' + n + "</button>";
      }).join("");
      var a = S.aufgabe, teil = "";
      if (a && a.frage) {
        teil = '<div class="sp-aufgabe"><div class="sp-frage-satz">' + frageHtml(a.frage) + "</div>"
          + '<div class="sp-optionen">' + (a.optionen || []).map(function (o) {
            var kl = a.ergebnis ? (o === a.ergebnis.loesung ? "sp-richtig" : o === a.gewaehlt ? "sp-falsch" : "") : "";
            return '<button type="button" data-tu="antwort" data-o="' + esc(o) + '" class="' + kl + '"' + (a.ergebnis ? " disabled" : "") + ">" + esc(o) + "</button>";
          }).join("") + "</div>"
          + (a.ergebnis ? '<div class="sp-erg ' + (a.ergebnis.richtig ? "sp-gruen" : "sp-rot") + '">' + (a.ergebnis.richtig ? "✅ Richtig! +" + (a.ergebnis.gewonnen + (a.ergebnis.bonus || 0)) + " Punkte" + (a.ergebnis.bonus ? " (Mission +" + a.ergebnis.bonus + ")" : "") : "❌ Leider falsch.") + '</div><div class="sp-klein">' + esc(a.ergebnis.erklaerung || "") + '</div><div class="sp-knoepfe"><button type="button" data-tu="aufgabe">Nächste Aufgabe</button></div>' : "")
          + (a.hinweis ? '<div class="sp-klein sp-rot">' + esc(a.hinweis) + "</div>" : "")
          + "</div>";
      } else {
        teil = '<div class="sp-knoepfe"><button type="button" data-tu="aufgabe">📚 Aufgabe holen</button></div>';
      }
      var m = S.ich.mission;
      var missionTeil = m && m.ziel && new Date(m.bis).getTime() > Date.now()
        ? '<div class="sp-hinweis">🗺️ Mission: Setz dich neben <b>' + esc(m.ziel) + '</b> und löse dort eine Aufgabe (+8).'
          + (nebenZiel(m.ziel) ? ' <button type="button" data-tu="missionsaufgabe">Jetzt lösen</button>' : " Du sitzt noch nicht daneben.") + "</div>"
        : '<div class="sp-knoepfe"><button type="button" data-tu="mission">🗺️ Mission holen</button></div>';
      return '<div class="sp-chips">' + chips + "</div>" + teil + missionTeil;
    }
    if (reiter === "waffen") {
      var liste = WAFFEN_REIHE.map(function (k) {
        var w = WAFFEN[k], hat = (ich.waffen || []).indexOf(k) >= 0;
        return '<div class="sp-zeile"><span class="sp-bild">' + geschossSvg(k, S.laserfarbe) + "</span><span><b>" + esc(w.name) + "</b><br><small>Schaden " + w.schaden + (k === "zielfernrohr" ? ", langsam" : "") + "</small></span>"
          + (hat ? (S.waffe === k ? '<button type="button" data-tu="ablegen">Ablegen</button>' : '<button type="button" data-tu="anlegen" data-w="' + k + '">Anlegen</button>')
                 : '<button type="button" data-tu="kaufen" data-d="' + k + '">🔒 ' + w.preis + " Punkte</button>")
          + "</div>";
      }).join("");
      var farben = '<div class="sp-chips">Laserfarbe: ' + LASERFARBEN.map(function (f) {
        return '<button type="button" data-tu="farbe" data-f="' + f + '" class="sp-farbe' + (S.laserfarbe === f ? " sp-an" : "") + '" style="background:' + f + '" aria-label="Farbe"></button>';
      }).join("") + "</div>";
      return liste + farben;
    }
    if (reiter === "schutz") {
      return LADEN.map(function (d) {
        return '<div class="sp-zeile"><span><b>' + esc(d.name) + "</b><br><small>" + esc(d.was) + "</small></span>"
          + '<button type="button" data-tu="kaufen" data-d="' + d.ding + '"' + (ich.punkte >= d.preis ? "" : " disabled") + ">" + d.preis + " Punkte</button></div>";
      }).join("");
    }
    if (reiter === "duell") {
      var leute = plaetze().filter(function (p) { return !p.leer && !p.ich; });
      if (!leute.length) return '<p class="sp-text">Gerade sitzt niemand sonst auf der Bühne.</p>';
      return leute.map(function (p) {
        var s = S.stand[spielIdVon(p.id)];
        return '<div class="sp-zeile"><span><b>' + esc(p.name) + "</b><br><small>" + (s ? s.lp + " / " + s.lp_max + " LP" : "spielt nicht mit") + "</small></span>"
          + (s ? '<button type="button" data-tu="duell" data-id="' + esc(p.id) + '" data-name="' + esc(p.name) + '">Herausfordern</button>' : "") + "</div>";
      }).join("") + '<p class="sp-klein">Im Duell trefft ihr euch gegenseitig per Tipp; Unbeteiligte bleiben außen vor. Es endet, wenn einer kaputt ist, oder nach 3 Minuten. Sieg: +5 Punkte.</p>';
    }
    if (reiter === "rang") {
      if (!S.rangliste) { rpc("spiel_rangliste", {}).then(function (r) { S.rangliste = r || []; panelAuffrischen(); setTimeout(function () { S.rangliste = null; }, 30000); }).catch(function () {}); return '<p class="sp-text">Lade …</p>'; }
      return '<ol class="sp-rang">' + S.rangliste.map(function (r) { return "<li><b>" + esc(r.name) + "</b> – " + r.verdient + " Deutschpunkte · " + r.lp_max + " LP max</li>"; }).join("") + "</ol>";
    }
    return "";
  }

  function nebenZiel(name) {
    var ich = platzElVon(meineChatId());
    var ziel = null;
    plaetze().forEach(function (p) { if (!p.leer && p.name === name) ziel = platzElVon(p.id); });
    if (!ich || !ziel) return false;
    var a = ich.getBoundingClientRect(), b = ziel.getBoundingClientRect();
    return Math.hypot(a.left - b.left, a.top - b.top) < a.width * 1.7;
  }

  function panelKlick(ev) {
    var k = ev.target.closest("button");
    if (!k || k.disabled) return;
    if (k.dataset.tab) { reiter = k.dataset.tab; if (reiter === "deutsch" && !S.aufgabe) aufgabeHolen(false); panelAuffrischen(); return; }
    var tu = k.dataset.tu;
    if (tu === "zu") return schliessen();
    if (tu === "niveau") { S.niveau = k.dataset.n; try { localStorage.setItem("dma_spiel_niveau", S.niveau); } catch (e) {} aufgabeHolen(false); return; }
    if (tu === "aufgabe") return aufgabeHolen(false);
    if (tu === "missionsaufgabe") return aufgabeHolen(true);
    if (tu === "antwort") return antworten(k.dataset.o);
    if (tu === "anlegen") { S.waffe = k.dataset.w; hinweis("🎯 " + WAFFEN[S.waffe].name + " angelegt – tippe auf ein Gesicht."); schliessen(); zeichnen(); return; }
    if (tu === "ablegen") { S.waffe = ""; zeichnen(); panelAuffrischen(); return; }
    if (tu === "farbe") { S.laserfarbe = k.dataset.f; try { localStorage.setItem("dma_spiel_laser", S.laserfarbe); } catch (e) {} panelAuffrischen(); return; }
    if (tu === "kaufen") return kaufen(k.dataset.d);
    if (tu === "heilen") return heilen(k.dataset.art);
    if (tu === "duell") { duellFordern(k.dataset.id, k.dataset.name); return; }
    if (tu === "mission") return missionHolen();
  }

  function aufgabeHolen(mission) {
    rpc("spiel_aufgabe", { p_niveau: S.niveau, p_mission: Boolean(mission) }).then(function (a) {
      if (!a || a.ok === false) { S.aufgabe = { frage: "", hinweis: (a && a.grund) || "Keine Aufgabe" }; }
      else S.aufgabe = a;
      reiter = "deutsch"; panelAuffrischen();
    }).catch(function (e) { hinweis("Aufgabe ging nicht: " + (e && e.message ? e.message : e)); });
  }
  function antworten(o) {
    var a = S.aufgabe;
    if (!a || a.ergebnis) return;
    rpc("spiel_antwort", { p_id: a.id, p_antwort: o }).then(function (r) {
      if (!r || r.ok === false) { a.hinweis = r && r.grund === "zu schnell" ? "Lies in Ruhe – dann noch mal tippen." : ((r && r.grund) || "ging nicht"); panelAuffrischen(); return; }
      a.gewaehlt = o; a.ergebnis = r; a.hinweis = "";
      S.ich = r; S.stand[r.id] = oeffentlich(r);
      ton(r.richtig ? "bling" : "gummi", 0.45);
      if (r.richtig) senden({ ereignis: "stand", stand: oeffentlich(r) });
      panelAuffrischen(); zeichnen();
    }).catch(function (e) { hinweis("Antwort ging nicht: " + (e && e.message ? e.message : e)); });
  }
  function kaufen(ding) {
    rpc("spiel_kaufen", { p_ding: ding }).then(function (r) {
      if (!r || !r.ok) { hinweis("🪙 " + ((r && r.grund) || "geht nicht")); return; }
      S.ich = r; S.stand[r.id] = oeffentlich(r);
      ton("kasse", 0.45);
      senden({ ereignis: "stand", stand: oeffentlich(r) });
      if (WAFFEN[ding]) S.waffe = ding;
      panelAuffrischen(); zeichnen();
    }).catch(function (e) { hinweis("Kauf ging nicht: " + (e && e.message ? e.message : e)); });
  }
  function heilen(art) {
    rpc("spiel_heilen", { p_art: art }).then(function (r) {
      if (!r || !r.ok) { hinweis((r && r.grund) || "geht nicht"); return; }
      S.ich = r; S.stand[r.id] = oeffentlich(r);
      ton("zauberpuff", 0.45);
      zahlZeigen(meineChatId(), r.geheilt, "");
      senden({ ereignis: "heilung", plus: r.geheilt, stand: oeffentlich(r) });
      /* Das Pflaster klebt sichtbar (die vorhandene Animation). */
      if (art === "pflaster") { try { if (B().pflaster) B().pflaster(meineChatId()); } catch (e) {} }
      panelAuffrischen(); zeichnen();
    }).catch(function () {});
  }
  function missionHolen() {
    var leute = plaetze().filter(function (p) { return !p.leer && !p.ich; });
    if (!leute.length) { hinweis("Für eine Mission braucht es jemanden auf der Bühne."); return; }
    var ziel = leute[Math.floor(Math.random() * leute.length)];
    rpc("spiel_mission", { p_ziel_name: ziel.name }).then(function (r) {
      if (!r || !r.ok) { hinweis("🗺️ " + ((r && r.grund) || "geht gerade nicht")); return; }
      if (S.ich) S.ich.mission = r.mission;
      hinweis("🗺️ Mission: Setz dich neben " + ziel.name + " und löse dort eine Aufgabe.");
      panelAuffrischen();
    }).catch(function () {});
  }

  /* ---------------------------------------------------------------
     DER BETREIBER SPIELT DIE GANZE AUFGABENSAMMLUNG EIN
     XANDER (24.09.): „Ja natürlich darfst du das machen" — die
     Deutsch-Aufgaben in die Datenbank schreiben. Einmal am Tag prüft
     der Betreiber-Browser, ob die Sammlung vollständig ist.
     --------------------------------------------------------------- */
  function einspielenWennBetreiber() {
    var be = window.Backend, darf = false;
    try { darf = Boolean(be && be.isOwner && be.isOwner()); } catch (e) {}
    if (!darf || S.einspielen) return;
    var heute = new Date().toISOString().slice(0, 10);
    try { if (localStorage.getItem("dma_spiel_eingespielt") === heute) return; } catch (e) {}
    S.einspielen = true;
    rpc("spiel_aufgaben_zahl", {}).then(function (z) {
      if (z && z.gesamt >= 25000) { try { localStorage.setItem("dma_spiel_eingespielt", heute); } catch (e) {} return null; }
      return sammlungLaden();
    }).then(function (zeilen) {
      if (!zeilen) return;
      var i = 0;
      var weiter = function () {
        if (i >= zeilen.length) { try { localStorage.setItem("dma_spiel_eingespielt", heute); } catch (e) {} return; }
        var paket = zeilen.slice(i, i + 400); i += 400;
        rpc("spiel_aufgaben_einspielen", { p_zeilen: paket }).then(function () { setTimeout(weiter, 400); })
          .catch(function () { setTimeout(weiter, 4000); });
      };
      weiter();
    }).catch(function () { S.einspielen = false; });
  }
  function sammlungLaden() {
    return new Promise(function (fertig, fehler) {
      var da = window.DMA_DATEN && window.DMA_DATEN.ZUSATZ_FRAGEN;
      var umwandeln = function () {
        var Z = window.DMA_DATEN.ZUSATZ_FRAGEN, aus = [];
        Object.keys(Z).forEach(function (k) {
          (Z[k] || []).forEach(function (q) {
            if (!Array.isArray(q) || q.length < 5 || typeof q[0] !== "string" || q[0].indexOf("___") < 0) return;
            if (typeof q[1] !== "string" || !Array.isArray(q[2]) || q[2].length < 2) return;
            var l = q[1].trim();
            var x = q[2].map(function (s) { return String(s).trim(); }).filter(function (s) { return s && s.toLowerCase() !== l.toLowerCase(); }).slice(0, 3);
            if (x.length < 2 || NIVEAUS.indexOf(q[4]) < 0) return;
            aus.push({ k: k, n: q[4], f: q[0], l: l, x: x, e: q[3] || "" });
          });
        });
        fertig(aus);
      };
      if (da) return umwandeln();
      var s = document.createElement("script");
      s.src = "data-uebungen.js?v=" + (window.DMA_VERSION || "1");
      s.onload = function () { if (window.DMA_DATEN && window.DMA_DATEN.ZUSATZ_FRAGEN) umwandeln(); else fehler(new Error("leer")); };
      s.onerror = fehler;
      document.head.appendChild(s);
    });
  }

  /* ---------------------------------------------------------------
     TAKT: beitreten, auffrischen, Plätze schmücken, Tafel beobachten
     --------------------------------------------------------------- */
  setInterval(function () {
    if (!drin()) return;
    if (!S.bereit) beitreten();
    abrufen(false);
    tafelPruefen();
    zeichnen();
  }, 700);

  window.DMA_SPIEL = {
    menue: menue, schliessen: schliessen,
    tippAufPlatz: tippAufPlatz, gesperrt: gesperrt, gesperrtGrund: gesperrtGrund,
    empfangen: empfangen, dreckAbwehren: dreckAbwehren, platzGewechselt: platzGewechselt,
    lehrerNote: lehrerNote, kampfmodus: kampfmodus,
    waffeAblegen: function () { if (S.waffe) { S.waffe = ""; zeichnen(); } },
    aufgabe: function () { menue("deutsch"); aufgabeHolen(false); },
    /* Zum Nachmessen */
    pruef: {
      zustand: function () { return S; },
      setzen: function (o) { Object.keys(o || {}).forEach(function (k) { S[k] = o[k]; }); zeichnen(); },
      zeichnen: zeichnen, geschossZeigen: geschossZeigen, zahlZeigen: zahlZeigen, trefferZeigen: trefferZeigen,
      zone: function (dx, dy) {
        var d = Math.hypot(dx, dy);
        if (d > 1) return "daneben";
        if (Math.hypot(dx, dy + 0.3) <= 0.3) return "kopf";
        if (Math.hypot(dx - 0.18, dy - 0.35) <= 0.2) return "herz";
        return d <= 0.7 ? "koerper" : "streif";
      }
    }
  };
})();
