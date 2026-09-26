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
var KASTEN = "dma-dateien-1";
var SEITE = "dma-seite-1";

self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (namen) {
    return Promise.all(namen.filter(function (n) {
      return /^dma-/.test(n) && n !== KASTEN && n !== SEITE;
    }).map(function (n) { return caches.delete(n); }));
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
    if (/\/(index\.html)?$/.test(u.pathname)) e.respondWith(seite(r));
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

/* Die Seite selbst: immer aus dem Netz. Antwortet es nicht (Funkloch)
   oder dauert es über sechs Sekunden, kommt die zuletzt geladene
   Seite — die fragt dann selbst über fassung.json, ob sie aktuell ist. */
function seite(r) {
  var netz = fetch(r).then(function (a) {
    if (a && a.status === 200 && a.type === "basic") {
      var kopie = a.clone();
      caches.open(SEITE).then(function (k) { return k.put("seite", kopie); }).catch(function () {});
    }
    return a;
  });
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
