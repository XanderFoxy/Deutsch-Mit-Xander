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
   Die Seite selbst (index.html) kommt immer zuerst aus dem Netz; nur
   wenn das Netz nicht antwortet, aus dem Speicher.

   NOTAUS: index.html?ohne-sw meldet diesen Helfer ab.
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
    /* Nur die Hauptseite — andere Seiten (Prüfseiten usw.) laufen vorbei. */
    if (/\/(index\.html)?$/.test(u.pathname)) e.respondWith(seite(r, e));
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
        if (a && a.status === 200 && a.type === "basic") {
          var kopie = a.clone();
          k.put(r, kopie).then(function () {
            return k.keys();
          }).then(function (alle) {
            alle.forEach(function (q) {
              try {
                var w = new URL(q.url);
                if (w.pathname === u.pathname && w.search !== u.search) k.delete(q);
              } catch (x) {}
            });
          }).catch(function () {});
        }
        return a;
      });
    });
  }).catch(function () { return fetch(r); });
}

/* FASSUNG 885: die Antwort der Vorab-Anfrage (undefined, wenn der
   Browser kein Vorab-Laden kann oder es noch nicht eingeschaltet ist). */
function vorab(e) {
  var p;
  try { p = e.preloadResponse; } catch (x) {}
  return Promise.resolve(p);
}

/* Die Seite selbst: immer aus dem Netz. Antwortet es nicht (Funkloch)
   oder dauert es über sechs Sekunden, kommt die zuletzt geladene
   Seite — die fragt dann selbst über fassung.json, ob sie aktuell ist.
   FASSUNG 885: „aus dem Netz" = die Vorab-Anfrage, sonst wie bisher
   fetch. waitUntil hält den Helfer wach, bis die Antwort da und
   gespeichert ist – sonst bräche der Browser eine späte Vorab-Anfrage
   ab (Ausweichseite nach 6 s) und der Speicher bliebe alt. */
function seite(r, e) {
  var merken = null;
  var netz = vorab(e).then(function (a) { return a || fetch(r); }).then(function (a) {
    if (a && a.status === 200 && a.type === "basic") {
      var kopie = a.clone();
      merken = caches.open(SEITE).then(function (k) { return k.put("seite", kopie); }).catch(function () {});
    }
    return a;
  });
  try { e.waitUntil(netz.then(function () { return merken; }, function () {})); } catch (x) {}
  var gespeichert = caches.open(SEITE).then(function (k) { return k.match("seite"); }).catch(function () { return null; });
  return new Promise(function (fertig, fehl) {
    var erledigt = false;
    function nimm(a) { if (!erledigt && a) { erledigt = true; fertig(a); } }
    netz.then(nimm, function () {
      gespeichert.then(function (g) { if (g) nimm(g); else if (!erledigt) { erledigt = true; fehl(new Error("offline")); } });
    });
    setTimeout(function () { gespeichert.then(function (g) { if (g) nimm(g); }); }, 6000);
  });
}
