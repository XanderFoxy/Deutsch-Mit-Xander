/* =====================================================================
   FASSUNG 694 — DER ZWISCHENSPEICHER DER SEITE (Service Worker)
   ---------------------------------------------------------------------
   XANDER: „Du solltest mir auch mal sagen wie die das bei HelloTalk
   machen … Liegt das daran, dass wir eine Webseite machen … wenn die
   Ladl nicht so groß wäre oder man das alles so ein bisschen
   professioneller aufteilen könnte"

   Eine App wie HelloTalk hat ihr Programm schon auf dem Telefon; sie
   lädt nur noch Nachrichten. Eine Webseite fragt bei jedem Öffnen nach
   jeder Datei. GitHub Pages erlaubt dem Browser, eine Datei nur zehn
   Minuten ungefragt zu benutzen — danach fragt er bei jeder der fast
   sechzig Dateien einzeln nach, ob sie noch stimmt. Gemessen: 4,6 s
   bei jedem Öffnen nach mehr als zehn Minuten Pause.

   Dieser kleine Helfer macht die Webseite darin einer App gleich: jede
   Datei mit Stempel (…?v=abc123) ändert sich NIE — ein neuer Inhalt
   bekommt einen neuen Stempel. Also darf sie ohne Nachfrage aus dem
   eigenen Speicher kommen. Neu geholt wird nur, was wirklich neu ist.

   Was er NICHT anfasst: Anfragen an andere Server (Supabase, GIPHY,
   Schriften), fassung.json (die Frage „gibt es Neues?" muss immer ins
   Netz), Filme und Töne mit Teilanfragen (Range), alles ohne Stempel.
   Die Seite selbst (index.html): seit Fassung 885 zuerst aus dem
   Speicher, im Hintergrund frisch geholt (siehe unten, „S1").

   NOTAUS: index.html?ohne-sw meldet diesen Helfer ab (die Seite kommt
   dafür immer aus dem Netz, auch seit 885).
   ===================================================================== */
/* FASSUNG 885 — XANDER (Funk 271): „alles insgesamt nur zehn Mal
   schneller" · (Funk 263): „sofort im Livestream wie bei HelloTalk".
   VORAB-LADEN DER SEITE (navigation preload). Nach einer Pause schläft
   dieser Helfer. Bisher musste der Browser ihn beim Öffnen erst wecken,
   und erst der wache Helfer fragte das Netz nach der Seite – beides
   nacheinander. Feldmessung 14.10. (Android 11, Service Worker an): das
   erste Byte der Seite kam nach 616 ms, obwohl nur 1 KB übers Netz ging.
   Jetzt fragt der Browser das Netz schon, WÄHREND er den Helfer weckt;
   der Helfer nimmt genau diese Antwort (preloadResponse) und fragt nicht
   ein zweites Mal. Was gleich bleibt: die Seite kommt zuerst aus dem
   Netz, im Funkloch oder nach 6 s die gespeicherte; fassung.json und
   alles ohne Stempel gehen unverändert ins Netz. Browser ohne
   Vorab-Laden (Safari vor 15.4) arbeiten wie bisher.
   Gemessen 17.10. (werkzeug/ladezeit-messen.js, 4G, Fall sw): auf dem
   Prüfrechner wacht der Helfer in ~3 ms auf – dort kein Unterschied;
   mit nachgestellt langsamem Aufwachen (250 ms, wie ein schwaches
   Telefon) kommt das erste Byte 65 ms früher (eine Rundreise), in 10
   von 10 Paaren. Mehr als die Zeit einer Anfrage (Rundreise plus
   Server) kann es nicht bringen – und nur, wenn der Helfer langsam wacht. */
var KASTEN = "dma-dateien-1";
/* SEITE: index.html schreibt „draussen“ selbst in diesen Speicher (knopf im Fassungs-Wächter, Name dort fest) – bekommt er
   einen neuen Namen, dort mitändern (Sonde pruefe-885-rueckkehr.js prüft, dass beide gleich sind). */
var SEITE = "dma-seite-1";

self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (namen) {
    return Promise.all(namen.filter(function (n) {
      return /^dma-/.test(n) && n !== KASTEN && n !== SEITE;
    }).map(function (n) { return caches.delete(n); }));
  }).then(function () {
    /* FASSUNG 885: Vorab-Laden einschalten (gilt für die Anmeldung, bis sie endet). */
    var np = self.registration.navigationPreload;
    if (np && np.enable) return np.enable().catch(function () {});
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET") return;
  var u;
  try { u = new URL(r.url); } catch (x) { return; }
  if (u.origin !== self.location.origin) return;
  if (r.headers.has("range")) return;
  if (r.mode === "navigate") {
    /* Nur die Hauptseite — andere Seiten (Prüfseiten usw.) laufen vorbei.
       FASSUNG 885 (S1, Nachbesserung 1): „Hauptseite" heißt genau die Wurzel des Bereichs (…/ und …/index.html).
       Vorher galt jedes …/ und …/index.html – auch die alten Sicherungen unter sicherung/<x>/ mit eigener
       DMA_VERSION (175, 196 …). „Nie rückwärts" hielt so eine Seite für eine Rücknahme und legte sie als Seite ab;
       seit S1 kam sie beim nächsten Öffnen der App ZUERST (nachgestellt: Fassung 175 im ganzen nächsten Besuch). */
    /* FASSUNG 885 (S1, Nachbesserung 2) — NOTAUS ?ohne-sw: nie durch seite(), sondern wie andere Seiten zuerst aus
       dem Netz (wie bis 884). Vorher (S1) kam auch für ?ohne-sw die gespeicherte Seite; lag draußen schon eine
       neuere Fassung, lud ihr Wächter sofort auf ?f=… neu, ?ohne-sw fiel weg, und das Abmelden am Ende der Seite
       kam nicht mehr zustande (nachgestellt: Helfer danach noch angemeldet in 6 von 6 Läufen bei sofortiger
       Antwort von fassung.json; jetzt 0 von 18) – gerade wenn ein Fehler im Helfer mit einer neuen Fassung behoben
       wird, braucht man den Schalter. Erprobt und verworfen: der Helfer meldet sich selbst ab – das Abmelden
       hängt dann in der Warteschlange des Browsers (hinter seiner eigenen Update-Prüfung) und kam ohne die Seite
       nur in 1 von 4 Läufen zustande. */
    if (hauptseite(u) && !notaus(u)) e.respondWith(seite(r, e));
    /* FASSUNG 885: „vorbei" heißt jetzt: die Antwort der schon laufenden
       Vorab-Anfrage unverändert durchreichen. Ohne respondWith fragte der
       Browser die Seite ein zweites Mal (gemessen: 2 Anfragen je Öffnen).
       Browser ohne Vorab-Laden: wie bisher kein respondWith. */
    else if (e.preloadResponse) e.respondWith(vorab(e).then(function (a) { return a || fetch(r); }));
    return;
  }
  if (!u.searchParams.get("v")) return;
  e.respondWith(gestempelt(r, u));
});

/* Gestempelte Datei: erst der eigene Speicher, sonst das Netz — und
   dann die ältere Fassung derselben Datei wegräumen, damit der
   Speicher nicht mit jedem Update wächst. */
function gestempelt(r, u) {
  return caches.open(KASTEN).then(function (k) {
    return k.match(r).then(function (da) {
      if (da) return da;
      return fetch(r).then(function (a) {
        if (a && a.status === 200 && a.type === "basic") ablegen(k, r, u, a);
        return a;
      });
    });
  }).catch(function () { return fetch(r); });
}

/* FASSUNG 885 — XANDER (Funk 255): „die schnelle Performance und die Verbindung zu den anderen haben oberste
   Priorität“. STEMPEL ↔ INHALT (Prüfer, S1-Nachtrag; S1 Offen 5). Der Server hat von jeder Datei nur den NEUESTEN
   Inhalt, egal welcher Stempel (?v=) gefragt wird. Holt eine ALTE Seite nach einem Update eine Datei, die noch nicht
   im Speicher liegt, kommt also der neue Inhalt – und lag bisher danach unter dem ALTEN Stempel im Speicher. Seit S1
   läuft eine alte Seite öfter (kurz vor dem Neuladen, mit der Blase im Raum die ganze Sitzung). Kommt dieser Stempel
   später wieder (Rücknahme auf dem Server, oder eine Datei bekommt ihren alten Inhalt zurück), lieferte der Speicher
   ungefragt den falschen Inhalt. Jetzt: ein Stempel, der der Inhalt einer einzelnen Datei ist (werkzeug/
   fassung-setzen.js: die ersten 10 Zeichen von SHA-1 – zu erkennen an der Liste DMA_STEMPEL der gespeicherten Seite),
   wird vor dem Ablegen nachgerechnet; passt er nicht, geht die Antwort an die Seite, aber nicht in den Speicher.
   Ordner-Stempel (ton/, szenen/ …) und ?v=<Fassung> werden wie bisher abgelegt (dort ist nichts nachzurechnen).
   Kostet nichts auf dem Weg zur Seite: die Seite bekommt die Antwort sofort, gerechnet wird an einer Kopie im Helfer
   (WebCrypto), und nur, wenn eine Datei nicht im Speicher lag (nach einem Update). */
function ablegen(k, r, u, a) {
  var kopie = a.clone(), v = u.searchParams.get("v") || "";
  var probe = /^[0-9a-f]{10}$/.test(v) && self.crypto && self.crypto.subtle ? a.clone() : null;
  (probe ? passt(u, v, probe) : Promise.resolve(true)).then(function (ja) {
    if (!ja) { try { kopie.body.cancel(); } catch (x) {} return; }
    return k.put(r, kopie).then(function () {
      return k.keys();
    }).then(function (alle) {
      alle.forEach(function (q) {
        try {
          var w = new URL(q.url);
          if (w.pathname === u.pathname && w.search !== u.search) k.delete(q);
        } catch (x) {}
      });
    });
  }).catch(function () {});
}
function passt(u, v, probe) {
  return stempelKarte().then(function (m) {
    var p = u.pathname.slice(wurzel().length);
    if (!m || typeof m[p] !== "string" || /\/$/.test(p)) { try { probe.body.cancel(); } catch (x) {} return true; }
    return probe.arrayBuffer().then(function (b) { return self.crypto.subtle.digest("SHA-1", b); }).then(function (h) {
      var x = new Uint8Array(h), t = "";
      for (var i = 0; i < 5; i++) t += (x[i] < 16 ? "0" : "") + x[i].toString(16);
      return t === v;
    });
  }).catch(function () { return true; });
}
/* Die Liste DMA_STEMPEL der gespeicherten Seite (nur: welche Pfade einen Datei-Stempel haben) */
var karte = null;
function stempelKarte() {
  if (!karte) karte = ausSpeicher().then(function (g) { return g ? g.clone().text() : ""; }).then(karteAus, function () { return {}; });
  return karte;
}
function karteAus(t) {
  var m = /window\.DMA_STEMPEL = (\{[^\n]*?\});<\/script>/.exec(t || "");
  try { return m ? JSON.parse(m[1]) : {}; } catch (x) { return {}; }
}
function wurzel() { try { return new URL("./", self.registration.scope).pathname; } catch (x) { return "/"; } }

/* FASSUNG 885 (Nachbesserung 2): NOTAUS – dieselbe Regel wie in index.html (/[?&]ohne-sw\b/) */
function notaus(u) { return /[?&]ohne-sw\b/.test(u.search || ""); }

/* FASSUNG 885 (Nachbesserung 1): die Hauptseite = die Wurzel des Bereichs, in dem dieser Helfer gilt */
function hauptseite(u) {
  var w = "/";
  try { w = new URL("./", self.registration.scope).pathname; } catch (x) {}
  try { if (typeof u === "string") u = new URL(u); } catch (x) { return false; }
  return u.pathname === w || u.pathname === w + "index.html";
}

/* FASSUNG 885: die Antwort der Vorab-Anfrage (undefined, wenn der
   Browser kein Vorab-Laden kann oder es noch nicht eingeschaltet ist). */
function vorab(e) {
  var p;
  try { p = e.preloadResponse; } catch (x) {}
  return Promise.resolve(p);
}

/* Die Seite selbst. Bis 884 immer zuerst aus dem Netz; antwortete es
   nicht (Funkloch) oder dauerte es über sechs Sekunden, kam die zuletzt
   geladene Seite – die fragt dann selbst über fassung.json, ob sie
   aktuell ist. FASSUNG 885 (Schritt C): „aus dem Netz" = die
   Vorab-Anfrage, sonst fetch; waitUntil hält den Helfer wach, bis die
   Antwort da und gespeichert ist.

   FASSUNG 885 — S1, SEITE ZUERST AUS DEM SPEICHER (freigegeben, Funk 311).
   XANDER (Funk 263): „sofort im Livestream wie bei HelloTalk" ·
   (Funk 271): „alles insgesamt nur zehn Mal schneller" · (Funk 310/312):
   „die maximal professionellste Lösung".
   Eine App zeigt beim Öffnen sofort, was sie hat, und fragt im
   Hintergrund nach Neuem. Hier wartete jedes Öffnen mit Helfer auf die
   Seite aus dem Netz: Verbindungsaufbau und Rundreise (gemessen 4G:
   erstes Byte 188 ms; draußen auf Android 616 ms), bei hängender Leitung
   bis 6 s (im echten Funkloch – Verbindung bricht sofort ab – kam die
   gespeicherte Seite schon bis 884 sofort).
   Jetzt („stale-while-revalidate", wie es große Web-Apps machen):
     - Liegt eine Seite im Speicher (jünger als 12 h), kommt SIE sofort.
       Die Vorab-Anfrage läuft im Hintergrund weiter und frischt den
       Speicher auf – je Öffnen weiter genau EINE Anfrage.
     - Ausnahme: hat das Netz schon geantwortet, während der Helfer
       aufwachte (schwaches Telefon), kommt die frische Seite – außer sie
       ist nach dem Datum des Servers älter als die gespeicherte.
       Gemessen (250 ms Aufwachen nachgestellt): ohne diese Ausnahme kein
       Gewinn beim Öffnen, aber nach jedem Update ein Neuladen.
     - Ist inzwischen eine neue Fassung draußen, merkt das der
       Fassungs-Wächter in index.html über fassung.json und lädt GENAU
       EINMAL neu (index.html?f=…) – nie im Klassenzimmer, im Raum oder
       mitten in einer Eingabe (dann die Blase „Neue Fassung").
     - index.html?f=X, X anders als die gespeicherte Seite: läuft gerade
       eine Auffrischung, wartet der Helfer auf sie (höchstens 3 s) –
       meist liegt die neue Seite dann schon im Speicher und kommt ohne
       weitere Rundreise. Sonst: X neuer → wie bisher zuerst das Netz
       (im Funkloch der Speicher, nach 6 s ab dem Öffnen der Speicher);
       X ÄLTER (eine alte Adresse, die der Browser wieder öffnet) → die
       gespeicherte Seite.
       Nachbesserung 1: auch bei einem älteren X auf die Auffrischung
       warten. Sonst kam eine Rücknahme auf dem Server (887 → 885) bei
       realem Netz erst beim zweiten Öffnen an: der Wächter lud auf
       ?f=885 neu, und dieses „ältere ?f=" bekam wieder die gespeicherte
       887 – die zurückgezogene Fassung lief zweimal, dann die Blase.
     - Älter als 12 h: zuerst das Netz wie bisher. Nach so langer Pause
       ist meist eine neue Fassung draußen; die alte Seite starten und
       dann neu laden wäre langsamer als gleich die neue.
     - Nie rückwärts: kommt aus dem Netz eine ÄLTERE Seite als die
       gespeicherte (der Browser darf index.html bei GitHub Pages 10 min
       selbst aufheben), fragt der Helfer beim Server nach (no-cache) und
       nimmt dessen Antwort. So verdrängt ein alter Stand aus dem
       Browser-Speicher nie einen neueren, eine echte Rücknahme auf dem
       Server kommt trotzdem an.
     - Gespeichert wird nur eine Seite mit DMA_VERSION, mit zwei eigenen
       Köpfen: x-dma-fassung (Fassung) und x-dma-zeit (wann geholt).
   Kein Neulade-Kreis: der Wächter lädt je Fassung und Tab höchstens
   einmal selbst (sessionStorage), und für ?f=X liefert der Helfer nie
   eine ältere Seite als X, wenn das Netz X hat. */
var KOPF = "x-dma-fassung", ZEIT = "x-dma-zeit", ALTER_MS = 12 * 3600 * 1000;
var auffrischung = null;   /* laufende Auffrischung (Versprechen → gespeicherte Fassung oder "") */
var gestartet = null;      /* die zuletzt gestartete (bleibt, auch wenn sie fertig ist) */

function seite(r, e) {
  var t0 = Date.now(), vorher = gestartet;
  /* waitUntil gleich zu Beginn: der Helfer bleibt wach, bis die Seite im Hintergrund gelesen und gespeichert ist */
  var los, halten = new Promise(function (ok) { los = ok; });
  try { e.waitUntil(halten); } catch (x) {}
  var netz = vorab(e).then(function (a) { return a || fetch(r); });
  netz.catch(function () {});
  var f = "";
  try { f = new URL(r.url).searchParams.get("f") || ""; } catch (x) {}
  /* FASSUNG 886 (Rückkehr): genau die Seite, die der Helfer eben selbst neu lädt (rueckEntscheiden, ?f=<neu>), steht schon
     im Gedächtnis (frisch) – sofort ausliefern, ohne den Speicher zu lesen und ohne auf das Ablegen zu warten (jede
     Millisekunde hier entscheidet, ob die alte Seite schon in ihren Skripten steckt, s. rueckStand) */
  var schnell = f && frisch && frisch.v === f && Date.now() - frisch.zeit < 10000 ? frisch : null;
  var draussen = schnell ? null : draussenLesen();
  var antwort = schnell ? Promise.resolve().then(function () {
    los(auffrischen(netz, f, r.url));
    return new Response(schnell.t, { status: 200, statusText: "OK", headers: schnell.h });
  }) : ausSpeicher().then(function (g) {
    /* Nachbesserung 1: bis 884 legte der Helfer JEDE Navigation auf …/ als Seite ab, auch sicherung/<x>/. So eine Seite
       aus der Zeit vor S1 (ohne eigenen Kopf; die gespeicherte Antwort kennt ihre Adresse) nie ausliefern. */
    if (g && !g.headers.get(KOPF) && g.url && !hauptseite(g.url)) g = null;
    return fassungVon(g).then(function (c) {
      if (!g || alterVon(g) > ALTER_MS) return netzZuerst(netz, r, g, c, los, t0);
      /* ?f= anders als die gespeicherte (neuer ODER älter, Nachbesserung 1) und eine Auffrischung läuft: auf sie warten */
      if (f && f !== c && auffrischung) return frist(auffrischung, 3000).then(ausSpeicher).then(function (g2) {
        return fassungVon(g2).then(function (c2) {
          if (g2 && !neuer(f, c2)) { los(auffrischen(netz, c2, r.url)); return g2; }
          return netzZuerst(netz, r, g2 || g, c2, los, t0);
        });
      });
      if (f && neuer(f, c)) return netzZuerst(netz, r, g, c, los, t0);
      /* FASSUNG 885 (Rückkehr): eine Seite hat schon gesehen, dass draußen eine neuere Fassung liegt → wie bis 884 */
      return draussen.then(function (d) {
        if (d && neuer(d, c)) return netzZuerst(netz, r, g, c, los, t0);
        return schonDa(netz).then(function (a) {
          return a ? frischWennDa(a, g, c, r, los) : (los(auffrischen(netz, c, r.url)), g);
        });
      });
    });
  });
  antwort.catch(function () { los(); });
  /* FASSUNG 885 (Rückkehr, Nachbesserung 1): welche Auffrischung zu dieser Seite gehört (für rueckEntscheiden) */
  antwort.then(function () {
    var id = e.resultingClientId;
    if (id && gestartet !== vorher) { proSeite[id] = gestartet; setTimeout(function () { delete proSeite[id]; }, 30000); }
  }, function () {});
  return antwort;
}

/* zuerst das Netz (wie bis 884): im Funkloch sofort, nach 6 s die gespeicherte Seite.
   Nachbesserung 1: die 6 s zählen ab dem Öffnen (t0), nicht ab hier – sonst kamen nach 3 s Warten auf eine hängende
   Auffrischung noch einmal 6 s dazu (bis 9 s). */
function netzZuerst(netz, r, g, c, los, t0) {
  var ablage = netz.then(function (a) {
    return a && a.status === 200 && a.type === "basic" ? speichern(a.clone(), c, r.url) : "";
  }, function () { return ""; });
  los(ablage);
  return new Promise(function (fertig, fehl) {
    var erledigt = false;
    function nimm(a) { if (!erledigt && a) { erledigt = true; fertig(a); } }
    netz.then(nimm, function () {
      if (g) nimm(g); else if (!erledigt) { erledigt = true; fehl(new Error("offline")); }
    });
    if (g) setTimeout(function () { nimm(g); }, Math.max(0, 6000 - (Date.now() - (t0 || Date.now()))));
  });
}

/* Hat die Vorab-Anfrage schon geantwortet, während der Helfer aufwachte und den Speicher las? (sonst null, ohne zu warten) */
function schonDa(netz) {
  var m = {};
  return Promise.race([netz, Promise.resolve(m)]).then(function (a) { return a === m ? null : a; }, function () { return null; });
}
/* Die frische Seite ist schon da (schwaches Telefon: der Helfer wacht langsamer auf, als das Netz antwortet – gemessen
   mit 250 ms Aufwachen: sonst kein Gewinn, aber nach einem Update ein Neuladen). Dann sie nehmen – außer sie ist älter
   als die gespeicherte. „Älter" nach dem Datum des Servers (Kopf date: beide Uhren sind die des Servers; eine Kopie aus
   dem Browser-Speicher trägt das Datum, an dem sie geholt wurde). Ohne Datum: die gespeicherte. Nichts wird vorher
   gelesen – den Inhalt erst zu lesen kostete gemessen +46 ms bis zum ersten Bild. */
function frischWennDa(a, g, c, r, los) {
  var x = Date.parse(a.headers.get("date") || ""), y = Date.parse(g.headers.get("date") || "");
  if (a.status === 200 && a.type === "basic" && x && y && x >= y) { los(auffrischen(Promise.resolve(a.clone()), c, r.url)); return a; }
  los(auffrischen(Promise.resolve(a), c, r.url));
  return g;
}

/* FASSUNG 886 (Rückkehr): .frueh meldet die Fassung des Servers, sobald sie gelesen ist – vor dem Ablegen (rueckEntscheiden) */
function auffrischen(netz, c, url) {
  var melden, frueh = new Promise(function (ok) { melden = ok; });
  var p = merken(netz.then(function (a) { return speichern(a, c, url, melden); }));
  p.then(melden);
  p.frueh = frueh;
  return p;
}
function merken(p) {
  p = p.catch(function () { return ""; });
  auffrischung = gestartet = p;
  p.then(function () { if (auffrischung === p) auffrischung = null; });
  return p;
}

/* Seite in den Speicher – nur mit Fassung, nie rückwärts (siehe oben). Antwort: die gespeicherte Fassung oder "". */
function speichern(a, c, url, melden) {
  if (!a || a.status !== 200 || a.type !== "basic") return Promise.resolve("");
  /* Nachbesserung 1: nur die Hauptseite (nie eine Seite aus einem Unterordner) */
  if (!hauptseite(a.url || url)) return Promise.resolve("");
  return a.text().then(function (t) { return speichernText(t, a, c, url, melden); }).catch(function () { return ""; });
}
var frisch = null;   /* FASSUNG 886: die zuletzt gelesene Seite des Servers { v, t, h, zeit } (seite, rueckEntscheiden) */
function speichernText(t, a, c, url, melden) {
  return Promise.resolve().then(function () {
    var v = textFassung(t);
    if (!v) return "";
    if (c && url && neuer(c, v)) {
      return fetch(url, { cache: "no-cache" }).then(function (b) { return speichern(b, "", "", melden); }, function () { return ""; });
    }
    var h = new Headers(a.headers);
    h.delete("content-length"); h.delete("content-encoding");
    h.set(KOPF, v); h.set(ZEIT, String(Date.now()));
    /* FASSUNG 885 (Rückkehr): die gespeicherte Kopie trägt eine Marke (<html data-dma-speicher>) – so weiß die Seite, dass
       sie aus dem Speicher kam (nur dann wartet die Rückkehr in den Raum auf den Fassungs-Wächter, s. u.) */
    var gespeichert = t.replace(/<html\b/i, '<html data-dma-speicher="1"');
    var z = Date.now();
    frisch = { v: v, t: gespeichert, h: h, zeit: z };
    setTimeout(function () { if (frisch && frisch.zeit === z) frisch = null; }, 10000);
    if (melden) melden(v);
    return caches.open(SEITE).then(function (k) {
      return k.put("seite", new Response(gespeichert, { status: 200, statusText: a.statusText || "OK", headers: h })).then(function () {
        /* jetzt kennt der Speicher die Fassung des Servers: „draußen neuer“ ist erledigt */
        return k.delete("draussen");
      });
    }).then(function () { karte = Promise.resolve(karteAus(t)); return v; });
  }).catch(function () { return ""; });
}

/* FASSUNG 885 (Rückkehr): „draußen liegt Fassung X“ – geschrieben vom Fassungs-Wächter einer Seite, die die Blase zeigt
   (index.html, knopf). Eine Seite im Raum, die die neue Fassung schon kennt, soll beim Neuladen nicht erst die alte
   starten und dann neu laden (gemessen: CPU 4×, fassung.json nach 0,25 s: +0,3 s gegen 884), sondern wie bis 884 gleich
   die Seite aus dem Netz bekommen. */
function draussenLesen() {
  return caches.open(SEITE).then(function (k) { return k.match("draussen"); })
    .then(function (a) { return a ? a.text() : ""; }).catch(function () { return ""; });
}
function ausSpeicher() {
  return caches.open(SEITE).then(function (k) { return k.match("seite"); }).catch(function () { return null; });
}
function textFassung(t) { var m = /DMA_VERSION = "([^"]+)"/.exec(t || ""); return m ? m[1] : ""; }
/* Fassung der gespeicherten Seite: aus dem Kopf; eine Seite aus der Zeit vor S1 hat keinen – dann einmal aus dem Text */
function fassungVon(a) {
  if (!a) return Promise.resolve("");
  var k = a.headers.get(KOPF);
  return k ? Promise.resolve(k) : a.clone().text().then(textFassung, function () { return ""; });
}
/* Alter in ms (ohne eigenen Kopf: das Datum des Servers; ganz ohne: unbekannt = zu alt) */
function alterVon(a) {
  var t = Number(a.headers.get(ZEIT)) || Date.parse(a.headers.get("date") || "") || 0;
  return t ? Date.now() - t : Infinity;
}
/* Ist Fassung a neuer als b? Zahlen als Zahlen; nicht vergleichbar: „anders" zählt als neuer (dann lieber das Netz). */
function neuer(a, b) {
  a = String(a || ""); b = String(b || "");
  if (/^\d+$/.test(a) && /^\d+$/.test(b)) return Number(a) > Number(b);
  return a !== b;
}
/* FASSUNG 885 — XANDER (Funk 263): „sofort im Livestream wie bei HelloTalk“ · (Funk 255): „die schnelle Performance und
   die Verbindung zu den anderen haben oberste Priorität“. RÜCKKEHR: DER HELFER LÄDT DIE NEUE FASSUNG SELBST (Nachbesserung 1
   zu „Rückkehr“; Prüfer: „nie langsamer als 884“). Kommt die Seite beim Neuladen im Raum aus diesem Speicher und liegt
   draußen schon eine neue Fassung, wartet die Rückkehr (app.js), bis die neue Seite da ist. Bisher lud erst der
   Fassungs-Wächter der ALTEN Seite neu: die Antwort von fassung.json war auf einem langsamen Telefon nach ~0,3 s da,
   wurde aber erst nach ~0,55 s verarbeitet, so lange startete der Hauptfaden die alte Seite (Prüfer, CPU 4×, Antwort
   nach 0,25 s: +315 ms bis „betreten“ gegen 884; nach 0,05 s: +200 ms).
   Der Helfer weiß es früher und ohne den Hauptfaden der Seite: seine Auffrischung (die Vorab-Anfrage dieser Navigation,
   dieselbe Anfrage wie bis 884) bringt die Fassung des Servers. Meldet die Seite „Rückkehr wartet“ (index.html, mit ihrer
   Fassung), dann
     - ist die Auffrischung NEUER: der Helfer lädt die Seite selbst neu (WindowClient.navigate, dieselbe Adresse wie der
       Wächter, ?f=<neu>) – genau einmal, höchstens 5 s lang; „halt“ (die Rückkehr geht doch auf dieser Seite hinein,
       oder der Wächter lädt selbst neu) hebt es auf. Die neue Seite fragt nicht noch einmal (Merker dma-wechsel „*“).
     - hat die Anfrage DIESER Navigation dieselbe Fassung gebracht: „gleich“ an die Seite. Die Seite glaubt das nur beim
       Neuladen (dann hat der Browser beim Server nachgefragt) und geht dann hinein, ohne auf fassung.json zu warten.
     - sonst „nichts“. Antwortet fassung.json mit einem Fehler, wartet die Rückkehr auf diese Antwort des Helfers (sonst
       ging sie auf der alten Seite hinein, obwohl der Helfer die neue schon hat).
   Gemessen und verworfen: die alte Seite vor ihren Skripten anhalten, bis der Helfer entschieden hat (kostete auf
   schnellem Gerät +26…+29 ms und bei langsamer Leitung den Gewinn, brachte im fraglichen Fall nur Rauschen).
   Ohne navigate (ältere Browser) oder ohne Auffrischung macht es wie bisher der Wächter.
   Messung: SPIELSYSTEM.md „Fassung 885 — Rückkehr: Nachbesserung 1“; Sonde pruefe-885-rueckkehr.js. */
var rueck = {};      /* Seite (Client-Kennung) → { ent: Entscheidung (Versprechen), aus: „halt“ kam } */
var proSeite = {};   /* Seite (resultingClientId) → die Auffrischung, die IHRE Navigation gestartet hat */
function rueckEntscheiden(id, alt) {
  var r = rueck[id] || (rueck[id] = {}), eigene = proSeite[id], server = "";
  alt = String(alt || "");
  if (r.ent) return r.ent;
  delete proSeite[id];
  /* FASSUNG 886: entschieden wird, sobald die Antwort des Servers gelesen ist (.frueh), nicht erst nach dem Ablegen */
  var p = (eigene ? eigene.frueh || eigene : auffrischung || Promise.resolve("")).then(function (v) { server = eigene ? String(v || "") : ""; });
  var seiteHolen = self.clients.get(id);   /* 886: gleich mit holen, nicht erst nach der Antwort */
  r.ent = frist(p, 5000).then(function () { return server || ausSpeicher().then(fassungVon); }).then(function (v) {
    return seiteHolen.then(function (c) {
      if (!c) return "";
      var nichts = function () { c.postMessage({ dmaHelfer: "nichts" }); return ""; };
      if (server && server === alt) { c.postMessage({ dmaHelfer: "gleich" }); return "gleich"; }
      if (r.aus || !v || !neuer(v, alt) || typeof c.navigate !== "function") return nichts();
      return c.navigate(mitFassung(c.url, v)).then(function () { return "neu"; }, nichts);
    });
  }).catch(function () { return ""; });
  r.ent.then(function () { setTimeout(function () { delete rueck[id]; }, 30000); });
  return r.ent;
}
self.addEventListener("message", function (e) {
  var d = e.data || {}, c = e.source;
  if (!d.rueckkehr || !c || !c.id) return;
  if (d.rueckkehr === "halt") { (rueck[c.id] || (rueck[c.id] = {})).aus = true; return; }
  e.waitUntil(rueckEntscheiden(c.id, d.rueckkehr));
});
/* dieselbe Adresse wie neuLaden in index.html: alles bleibt, nur f= wird gesetzt */
function mitFassung(adresse, v) {
  var u = new URL(adresse);
  var q = u.search.replace(/^\?/, "").split("&").filter(function (p) { return p && !/^f(=|$)/.test(p); });
  q.push("f=" + encodeURIComponent(v));
  return u.origin + u.pathname + "?" + q.join("&") + u.hash;
}
function frist(p, ms) {
  return new Promise(function (ok) {
    var u = setTimeout(ok, ms);
    p.then(function () { clearTimeout(u); ok(); }, function () { clearTimeout(u); ok(); });
  });
}
