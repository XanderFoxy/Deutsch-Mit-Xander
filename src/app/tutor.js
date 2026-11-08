/* =====================================================================
   MODUL-UMBAU M4 (MODULE-PLAN.md Abschnitt 3) — TUTOR (aus app.js)
   ---------------------------------------------------------------------
   Der Tutor: Alex kommt von rechts herein und erklärt den Bereich (Ton,
   Film oder Maske, Leuchten der Unterreiter, Reiter am rechten Rand).
   Gezogen mit werkzeug/app-modul-ziehen.js: der Code unten ist der aus
   app.js, Zeichen für Zeichen (zwei Leerzeichen weniger eingerückt,
   nicht in Strings).
   Eingänge (export) stellt src/bruecke.js unter dem alten Namen auf
   window; app.js ruft sie über dünne Weiterleitungen (dmaModul, aus der
   eigenen Tabelle DMA_BRUECKE.fn).
   ===================================================================== */
/* Helfer aus app.js – über window.DMA_APP, erst beim Aufruf gelesen (dieses Modul läuft VOR app.js) */
function brDatei(...a) { return window.DMA_APP.brDatei(...a); }
function lcGeraeuschArt(...a) { return window.DMA_APP.lcGeraeuschArt(...a); }
function showToast(...a) { return window.DMA_APP.showToast(...a); }

/* =============================================================
   DER TUTOR — Alex kommt von rechts herein und erklaert
   -------------------------------------------------------------
   GEWUENSCHT (woertlich): „Ich moechte an der Seite von jedem
   Bereich beim Aufrufen dieses Bereiches eingeblendet werden, mit
   der Moeglichkeit, das abzuschalten. Also ich komme dann animiert
   von der rechten Seite ins Bild hinein und sage dann zum Beispiel:
   So, willkommen im Lernbereich … das kannst du einmal in der
   realistischen Fotovariante machen … und dann einmal als
   Comicvariante von mir, und ich moechte das selber einstellen
   koennen, um zu ueberpruefen, wie das wirkt."

   Beide Figuren liegen als freigestelltes PNG unter tutor/ —
   entstanden aus seinem eigenen Profilfoto, sitzend, ohne Gitarre,
   ohne Hintergrund. Gesprochen wird mit SEINER Stimme (ElevenLabs);
   fehlt eine Tondatei, steht der Text trotzdem in der Sprechblase.
   Ein stummer Tutor ist besser als gar keiner.

   Er kommt EINMAL PRO BESUCH und Bereich. Wer ihn wegklickt, hat
   Ruhe; wer ihn wiederhaben will, tippt auf den kleinen Reiter am
   rechten Rand. Wer ihn nie wieder sehen will, schaltet ihn in den
   Einstellungen ab — dann wird auch nichts mehr nachgeladen.
   ============================================================= */
const TUTOR_SCHALTER = "dma_tutor";       // "aus" = abgeschaltet
const TUTOR_ART = "dma_tutor_art";        // "foto" | "comic"

/* =================================================================
   EINMAL AM TAG, NICHT EINMAL JE SEITENAUFRUF
   -----------------------------------------------------------------
   GEWUENSCHT: „Der Tutor soll nur beim ersten Anzeigen des Bereichs
   sprechen und da sein. Ansonsten soll er immer in der
   Wartestellung sein, falls man ihn braucht — aber das System soll
   wissen, dass man ihn heute schon verwendet hat, auch wenn man
   die Seite aktualisiert."

   Bisher stand das in zwei Sets im Arbeitsspeicher. Die sind nach
   jedem Neuladen leer — und genau deshalb kam Alex bei jedem
   Aktualisieren wieder, obwohl man ihn laengst gehoert hatte.

   Jetzt liegt es im Geraet, mit dem TAGESDATUM davor. Ein neuer
   Tag faengt von vorne an (dann ist die Erklaerung auch wieder
   etwas wert); derselbe Tag nicht, egal wie oft man neu laedt.
   Ein Tastendruck auf den Reiter holt ihn trotzdem jederzeit —
   das ist ein bewusster Ruf und zaehlt nicht als „von selbst". */
const TUTOR_GEZEIGT = "dma_tutor_gezeigt";
function tutorHeute() {
  /* Ortszeit, nicht UTC: „heute" ist der Tag, den der Mensch vor
     sich hat, nicht der in Greenwich. */
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0")
       + "-" + String(d.getDate()).padStart(2, "0");
}
function tutorGezeigtLesen() {
  try {
    const roh = JSON.parse(localStorage.getItem(TUTOR_GEZEIGT) || "{}");
    if (!roh || roh.tag !== tutorHeute()) return new Set();
    return new Set(Array.isArray(roh.was) ? roh.was : []);
  } catch (e) { return new Set(); }
}
function tutorGezeigtSchreiben(menge) {
  try {
    localStorage.setItem(TUTOR_GEZEIGT,
      JSON.stringify({ tag: tutorHeute(), was: Array.from(menge) }));
  } catch (e) {}
}
/* Ein Set, das sich selbst merkt. Der uebrige Code bleibt damit
   genau so stehen, wie er war — tutorGezeigt.has()/.add() lesen
   und schreiben ab jetzt nur zusaetzlich das Geraet. */
function tutorMerker() {
  const menge = tutorGezeigtLesen();
  return {
    has: function (x) { return menge.has(x); },
    add: function (x) { menge.add(x); tutorGezeigtSchreiben(menge); return this; },
    clear: function () { menge.clear(); tutorGezeigtSchreiben(menge); }
  };
}
/* EINE Ablage, nicht zwei. Zwei Merker mit demselben Schluessel
   haetten sich gegenseitig ueberschrieben: wer zuletzt schreibt,
   schreibt seine eigene Liste ueber die des anderen. Die Schluessel
   koennen sich nicht in die Quere kommen — Hauptbereiche heissen
   „view-…", Unterbereiche „sub-…". */
const tutorGezeigt = tutorMerker();       // Bereiche, einmal am Tag
let tutorTon = null;                      // laufende Tonspur
let tutorZeitgeber = 0;

function tutorAn() {
  try { return localStorage.getItem(TUTOR_SCHALTER) !== "aus"; } catch (e) { return true; }
}
function tutorAnSetzen(an) {
  try { localStorage.setItem(TUTOR_SCHALTER, an ? "an" : "aus"); } catch (e) {}
  if (!an) tutorSchliessen(true);
  tutorReiterPflegen();
}
/* GEWUENSCHT: „ich moechte den Comic-Tutor — der soll bei allen
   voreingestellt sein." Also ist „comic" die Voreinstellung; wer
   ausdruecklich „foto" gewaehlt hat, behaelt sein Foto. */
function tutorArt() {
  try { return localStorage.getItem(TUTOR_ART) === "foto" ? "foto" : "comic"; } catch (e) { return "comic"; }
}
/* FASSUNG 847 — XANDER (Funk 271): „alles insgesamt nur zehn Mal schneller". Die Tutorfigur war das größte Bild
   beim Start (alex-comic.png 176 KB, alex-foto.png 186 KB). Jetzt als verlustfreies WebP (93 / 100 KB): auf jedem
   Hintergrund Pixel für Pixel dasselbe Bild – nachgeprüft auf hell, dunkel und grün. Kann ein sehr altes Gerät kein
   WebP, kommt einmal das PNG. */
function tutorFigurSetzen(bild) {
  if (!bild) return;
  const v = window.DMA_V ? DMA_V("tutor/") : "?v=" + (window.DMA_VERSION || "1");
  const basis = "tutor/alex-" + tutorArt();
  const neu = basis + ".webp" + v;
  if (bild.getAttribute("src") === neu || bild.getAttribute("src") === basis + ".png" + v) return;
  bild.onerror = () => { bild.onerror = null; bild.setAttribute("src", basis + ".png" + v); };
  bild.setAttribute("src", neu);
}
function tutorArtSetzen(art) {
  try { localStorage.setItem(TUTOR_ART, art === "comic" ? "comic" : "foto"); } catch (e) {}
}

/* Die Texte liegen in data-tutor.js und werden erst geholt, wenn der
   Tutor wirklich auftreten soll — abgeschaltet kostet er kein Byte. */
function tutorTexteHolen() {
  if (window.DMA_TUTOR) return Promise.resolve(true);
  return brDatei("data-tutor.js").then(() => Boolean(window.DMA_TUTOR));
}

/* Endung wie bei den Geraeuschen: Safari auf dem iPhone spielt Opus
   nicht zuverlaessig, also dort m4a. */
function tutorTonArt() { return lcGeraeuschArt(); }

function tutorBuehne() {
  let b = document.getElementById("tutorBuehne");
  if (b) return b;
  b = document.createElement("div");
  b.id = "tutorBuehne";
  b.className = "tutor-buehne";
  b.setAttribute("aria-live", "polite");
  b.innerHTML = `
      <div class="tutor-blase" id="tutorBlase">
        <button type="button" class="tutor-zu" id="tutorZu" aria-label="Tutor schliessen">×</button>
        <p class="tutor-text" id="tutorText"></p>
        <div class="tutor-extra" id="tutorExtra"></div>
        <div class="tutor-knoepfe">
          <button type="button" class="tutor-mini" id="tutorNochmal">🔊 Noch einmal</button>
          <button type="button" class="tutor-mini" id="tutorWeiter">Weiter ›</button>
          <button type="button" class="tutor-mini" id="tutorNie">Nicht mehr zeigen</button>
        </div>
      </div>
      <img class="tutor-figur" id="tutorFigur" alt="Alex" />
      <!-- DIE BEWEGTE FASSUNG.
           GEWUENSCHT: „ich moechte ihn animiert haben, dass er schoen
           erklaert und dass es realistisch aussieht mit
           Lippensynchronizitaet … Aber behalte trotzdem die
           Standbild-Version als Fallback, falls die Animation nicht
           greift."
           Genau so gebaut: das Standbild steht IMMER da. Gibt es zu
           einem Stueck einen Film (tutor/video/<ton>.mp4, verzeichnet
           in data-tutorvideo.js), legt er sich darueber — und faellt
           er aus (fehlt, laedt nicht, Browser spielt ihn nicht), wird
           er wieder ausgeblendet und das Standbild ist noch da. Der
           Ton kommt weiter aus der Tonspur; der Film selbst ist
           stumm, damit nichts doppelt klingt. -->
      <video class="tutor-video" id="tutorVideo" muted playsinline preload="none"></video>
      <!-- DER MASKENWEG — FUER DAS IPHONE.
           GEMELDET: „auf dem Android sieht man ihn freigestellt, auf
           dem iPhone sieht man ihn mit einem schwarzen Hintergrund.
           Kannst du das nicht machen wie bei dem Greenscreen, dass wir
           das ausrechnen koennen, dass es ueberall gleich aussieht?"
           GEFUNDEN: Safari spielt webm ab, aber OHNE Alphaspur — also
           bleibt der schwarze Grund stehen. Genau dafuer gibt es im
           Haus schon einen Weg: Bild und Maske nebeneinander in einer
           mp4, wieder zusammengerechnet auf der Grafikkarte (so
           laufen die Geschenkfilme, siehe filmspieler.js). Diese
           Leinwand ist dieser Weg fuer den Tutor. -->
      <canvas class="tutor-maske" id="tutorMaske"></canvas>`;
  document.body.appendChild(b);
  document.body.classList.add("tutor-offen");
  b.querySelector("#tutorZu").addEventListener("click", () => tutorSchliessen());
  b.querySelector("#tutorNochmal").addEventListener("click", () => {
    /* Dasselbe Stueck noch einmal — mit demselben Weiter-Weg, sonst
       bliebe die Reihe danach stehen. */
    if (tutorZeitgeber) clearTimeout(tutorZeitgeber);
    tutorStueckSpielen();
  });
  b.querySelector("#tutorWeiter").addEventListener("click", () => {
    if (!tutorLauf) { tutorSchliessen(); return; }
    if (tutorZeitgeber) clearTimeout(tutorZeitgeber);
    tutorLauf.nr++;
    if (tutorLauf.nr >= tutorLauf.stuecke.length) { tutorSchliessen(); return; }
    tutorStueckSpielen();
  });
  b.querySelector("#tutorNie").addEventListener("click", () => {
    tutorAnSetzen(false);
    showToast("🎓 Der Tutor ist aus. In den Einstellungen holst du ihn zurück.");
  });
  return b;
}

function tutorTonSpielen(name, erzwingen, beiEnde, beiFehlstart) {
  tutorTonStoppen();
  if (!name) return false;
  try {
    const a = new Audio("tutor/" + name + tutorTonArt() + (window.DMA_V ? DMA_V("tutor/") : "?v=" + (window.DMA_VERSION || "1")));
    a.preload = "auto";
    a.volume = 0.95;
    tutorTon = a;
    if (typeof beiEnde === "function") {
      a.onended = () => { if (tutorTon === a) beiEnde(); };
      /* Fehlt die Datei, kommt „error" statt „ended".
         GEMESSEN (werkzeug/pruefe-tutor.js): in „Ueber mich" gibt es
         noch gar keine Aufnahmen — und weil hier frueher direkt
         weitergeschaltet wurde, rauschten SECHS Saetze in
         ZWANZIG MILLISEKUNDEN durch. Das ist das gemeldete
         „Springen". Ein Satz ohne Ton darf nicht schneller
         vorbeisein als einer mit Ton: fehlt die Aufnahme, bleibt
         er stehen, bis man ihn gelesen hat. */
      a.onerror = () => {
        if (tutorTon !== a) return;
        if (typeof beiFehlstart === "function") beiFehlstart();
        else beiEnde();
      };
    }
    const v = a.play();
    /* Ohne vorherige Berührung darf ein frisches Audio-Element nicht
       spielen — das ist eine Regel des Browsers, kein Fehler. Der
       Text steht dann trotzdem da, und „Noch einmal" (ein echter
       Tastendruck) bringt den Ton. */
    if (v && v.catch) v.catch(() => {
      if (erzwingen) showToast("🔇 Der Ton kommt erst nach einer Berührung.");
      /* Darf der Ton nicht spielen, gibt es auch kein „zu Ende".
         Ohne diesen Ruf stuende Alex zwanzig Sekunden stumm da und
         wartete auf ein Ereignis, das nie kommt. Dann eben nach
         Lesezeit weiter — stumm, aber lesbar. */
      if (tutorTon === a && typeof beiFehlstart === "function") beiFehlstart();
    });
    return true;
  } catch (e) { return false; }
}
function tutorTonStoppen() {
  if (!tutorTon) return;
  try { tutorTon.pause(); tutorTon.currentTime = 0; } catch (e) {}
  tutorTon = null;
}

function tutorSchliessen(sofort) {
  const b = document.getElementById("tutorBuehne");
  tutorTonStoppen();
  if (tutorZeitgeber) { clearTimeout(tutorZeitgeber); tutorZeitgeber = 0; }
  tutorLauf = null;
  tutorAnfrage++;            // eine noch ladende Runde gilt damit als ueberholt
  tutorHoltGerade = false;
  tutorLeuchtenAus();
  document.body.classList.remove("tutor-offen");
  if (!b) return;
  if (sofort) { b.remove(); return; }
  b.classList.remove("tutor-da");
  setTimeout(() => { if (b && !b.classList.contains("tutor-da")) b.remove(); }, 600);
}

/* Der schmale Reiter am rechten Rand: nur da, wenn der Tutor an ist
   und gerade NICHT im Bild steht. Ein Tippen holt ihn zurück. */
/* =================================================================
   SOLANGE MAN SCHREIBT, IST ALEX WEG
   -----------------------------------------------------------------
   GEMELDET: „Wenn man in der Eingabezeile vom Klassenzimmer
   schreibt, rutscht das Klassenzimmer an die Stelle, wo der kleine
   Karteireiter vom Tutor ist — und man kann nicht auf Senden
   druecken, weil man dann den Tutor aufmacht."

   Der Reiter haengt fest am rechten Rand, der Senden-Knopf des
   Chats liegt dort ebenfalls, sobald das Klassenzimmer an seinen
   Platz gesprungen ist. Zwei Knoepfe an derselben Stelle — da
   gewinnt immer der obere, und das war der falsche.

   Die Entscheidung ist seine eigene: „Du blendest ihn einfach aus,
   wenn man was schreiben will … nachdem die Nachricht gesendet
   ist, ist er wieder an seinem Platz, falls man ihn braucht."

   Die Zeile wird bei jedem Neuzeichnen des Chats neu gebaut —
   deshalb haengen die Ohren am DOKUMENT und nicht am Feld, sonst
   waeren sie nach dem ersten Neuzeichnen taub. Steht Alex gerade
   im Bild, geht er beim Schreiben ganz hinaus; holen kann man ihn
   mit dem Reiter, sobald die Nachricht raus ist. */
let tutorSchreibTakt = 0;
function tutorSchreibzeile(el) {
  return el && (el.id === "lcFeld" || el.id === "lcSendeGifSuche"
                || el.id === "lcSendeGifAdresse" || el.id === "lcLink");
}
/* MODUL M4: die beiden Ohren stehen in einer Funktion, damit sie mit dem Tutor nach src/app/tutor.js ziehen; der
   Aufruf bleibt an dieser Stelle in app.js (gleiche Reihenfolge der Ohren am Dokument wie vorher). */
function tutorSchreibOhren() {
  document.addEventListener("focusin", (e) => {
    if (!tutorSchreibzeile(e.target)) return;
    clearTimeout(tutorSchreibTakt);
    document.body.classList.add("lc-schreibt");
    /* Steht er gerade mitten im Bild, nimmt er auch die Sicht — dann
       geht er ganz. Der Reiter holt ihn zurueck. */
    if (document.getElementById("tutorBuehne")) tutorSchliessen();
  });
  document.addEventListener("focusout", (e) => {
    if (!tutorSchreibzeile(e.target)) return;
    /* Ein Augenblick Luft: der Klick auf „Senden" nimmt dem Feld den
       Finger, BEVOR er ankommt. Ohne diese Pause waere der Reiter
       schon wieder da, wenn der Finger landet — und der Fehler
       genau derselbe. */
    clearTimeout(tutorSchreibTakt);
    tutorSchreibTakt = setTimeout(() => document.body.classList.remove("lc-schreibt"), 500);
  });
}

function tutorReiterPflegen() {
  const soll = tutorAn();
  let r = document.getElementById("tutorReiter");
  if (!soll) { if (r) r.remove(); return; }
  if (!r) {
    r = document.createElement("button");
    r.type = "button";
    r.id = "tutorReiter";
    r.className = "tutor-reiter";
    r.title = "Alex erklärt dir diesen Bereich";
    r.setAttribute("aria-label", "Alex erklärt dir diesen Bereich");
    r.textContent = "🎓";
    r.addEventListener("click", () => {
      /* GEMELDET: „wenn man direkt auf Dialoge klickt, geht die
         Animation nicht an. Die soll auch verlinkt sein, dass man
         sich diesen Bereich vorlesen lassen kann."
         GEFUNDEN: der Reiter rief IMMER den Hauptbereich — wer im
         Unterbereich „Dialoge" stand, bekam die Ansage zum ganzen
         Lernbereich oder gar nichts. Jetzt gilt: steht ein
         Unterbereich offen und gibt es dafuer eine Ansage, wird
         DIESE gerufen; sonst der Hauptbereich wie bisher. */
      const pille = document.querySelector('.subnav-pill[aria-selected="true"]');
      const sub = pille && pille.dataset ? pille.dataset.sub : "";
      const texte = window.DMA_TUTOR || null;
      if (sub && (!texte || texte[sub])) {
        tutorBereichRufen(sub, true, true);
        if (texte && texte[sub]) return;
      }
      const jetzt = document.querySelector(".view[data-active=\"true\"]");
      tutorRufen(jetzt ? jetzt.id : "view-about", true);
    });
    document.body.appendChild(r);
  }
}

/* =============================================================
   WÄHREND ER SPRICHT, LEUCHTET DER BEREICH, VON DEM ER SPRICHT
   -------------------------------------------------------------
   GEWUENSCHT: „Dass die Sektionen, von denen er spricht, kurz
   hervorgehoben werden in dem Moment, wenn er die anspricht —
   dass sie so markiert dastehen, dass jeder weiss: okay, wenn ich
   da drauf klicke, finde ich das."

   Die Zeit ist nicht geschaetzt. Jeder Satz ist eine eigene
   Aufnahme (siehe data-tutor.js), also gilt: solange DIESE
   Aufnahme laeuft, leuchtet GENAU dieser Unterreiter. Faengt der
   naechste Satz an, springt das Leuchten mit. Das kann gar nicht
   auseinanderlaufen.
   ============================================================= */
let tutorLauf = null;        // { bereich, stuecke, nr }
/* Die Texte werden beim ersten Mal nachgeladen. In dieser Zeit darf
   kein zweiter Auftritt danebenlaufen — sonst stehen am Ende zwei
   Runden in der Leitung und die zweite ueberschreibt die erste
   mitten im Satz. Jede Anfrage bekommt eine Nummer; nur die
   neueste darf zum Zug kommen. */
let tutorAnfrage = 0;
let tutorHoltGerade = false;

function tutorLeuchtenAus() {
  document.querySelectorAll(".tutor-leuchtet").forEach((e) => e.classList.remove("tutor-leuchtet"));
}
function tutorLeuchten(ziel) {
  tutorLeuchtenAus();
  if (!ziel) return null;
  const pille = document.querySelector(`.subnav-pill[data-sub="${ziel}"]`);
  if (!pille) return null;
  pille.classList.add("tutor-leuchtet");
  /* Nur ins Bild holen, wenn die Leiste ueberhaupt seitlich rollt —
     sonst springt die ganze Seite, und das ist schlimmer als ein
     Knopf, den man nicht sieht. */
  try {
    const leiste = pille.parentElement;
    if (leiste && leiste.scrollWidth > leiste.clientWidth + 8) {
      leiste.scrollTo({ left: pille.offsetLeft - leiste.clientWidth / 2 + pille.offsetWidth / 2,
                        behavior: "smooth" });
    }
  } catch (e) {}
  return pille;
}

/* Ein Stueck spielen: Text in die Blase, Bereich zum Leuchten
   bringen, Ton starten — und wenn der Ton zu Ende ist, das
   naechste. Fehlt die Tondatei, wird nach Lesezeit weitergegangen;
   ein stummer Tutor ist besser als ein haengender. */
/* Zu welchen Stuecken es einen Film gibt — geschrieben von
   werkzeug/tutorvideo-liste.js aus dem Ordner tutor/video/. Steht
   ein Name hier, liegt dort wirklich eine Datei. */
let tutorFilmListe = null;
function tutorFilmDa(ton) {
  if (!ton) return false;
  if (tutorFilmListe === null) {
    tutorFilmListe = new Set(String(window.DMA_TUTORVIDEO || "").split("|").filter(Boolean));
  }
  return tutorFilmListe.has(ton);
}
/* KANN DIESES GERAET WEBM MIT ALPHA?
   filmspieler.js weiss es schon — er entscheidet dieselbe Frage
   fuer die Geschenkfilme. Fehlt er, wird vorsichtig „nein"
   angenommen: dann laeuft der Maskenweg, und der geht ueberall. */
function tutorAlphaGeht() {
  try {
    if (window.DMA_FILM && window.DMA_FILM.kannAlphaWebm) return Boolean(window.DMA_FILM.kannAlphaWebm());
  } catch (e) {}
  return false;
}
let tutorMaskeLauf = null;
/* Bild und Maske nebeneinander wieder zusammensetzen — dieselbe
   Rechnung wie in filmspieler.js, nur klein und fuer diese eine
   Figur. Links steht die Farbe, rechts die Deckung. */
function tutorMaskeStarten(ton) {
  const c = document.getElementById("tutorMaske");
  if (!c) return false;
  tutorMaskeStoppen();
  const gl = c.getContext("webgl", { premultipliedAlpha: true, alpha: true })
    || c.getContext("experimental-webgl", { premultipliedAlpha: true, alpha: true });
  if (!gl) return false;
  const v = document.createElement("video");
  v.muted = true; v.playsInline = true; v.setAttribute("playsinline", "");
  v.crossOrigin = "anonymous";
  v.src = "tutor/video/" + ton + "-maske.mp4" + (window.DMA_V ? DMA_V("tutor/") : "?v=" + (window.DMA_VERSION || "1"));
  const ecke = "attribute vec2 p;varying vec2 t;void main(){t=vec2((p.x+1.0)/2.0,(1.0-p.y)/2.0);"
    + "gl_Position=vec4(p,0.0,1.0);}";
  const flaeche = "precision mediump float;varying vec2 t;uniform sampler2D b;"
    + "void main(){vec3 c=texture2D(b,vec2(t.x*0.5,t.y)).rgb;"
    + "float a=texture2D(b,vec2(t.x*0.5+0.5,t.y)).r;"
    + "gl_FragColor=vec4(c*a,a);}";
  const bauen = (art, q) => { const sh = gl.createShader(art); gl.shaderSource(sh, q); gl.compileShader(sh); return sh; };
  const pr = gl.createProgram();
  gl.attachShader(pr, bauen(gl.VERTEX_SHADER, ecke));
  gl.attachShader(pr, bauen(gl.FRAGMENT_SHADER, flaeche));
  gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const pl = gl.getAttribLocation(pr, "p");
  gl.enableVertexAttribArray(pl);
  gl.vertexAttribPointer(pl, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  let laeuft = true;
  const bild = () => {
    if (!laeuft) return;
    if (v.readyState >= 2) {
      if (c.width !== v.videoWidth / 2 && v.videoWidth) {
        c.width = Math.round(v.videoWidth / 2); c.height = v.videoHeight;
        gl.viewport(0, 0, c.width, c.height);
      }
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        c.classList.add("tutor-video-da");
        tutorFilmLaeuft(true);
      } catch (e) {}
    }
    requestAnimationFrame(bild);
  };
  v.onerror = () => tutorMaskeStoppen();
  v.onended = () => tutorMaskeStoppen();
  const lauf = v.play();
  if (lauf && lauf.catch) lauf.catch(() => tutorMaskeStoppen());
  requestAnimationFrame(bild);
  tutorMaskeLauf = { video: v, halt: () => { laeuft = false; } };
  return true;
}
function tutorMaskeStoppen() {
  const c = document.getElementById("tutorMaske");
  if (c) c.classList.remove("tutor-video-da");
  /* Auch hier: das Standbild muss wieder sichtbar werden, sonst
     stuende der Tutor gar nicht mehr da. */
  const b = document.querySelector(".tutor-buehne");
  if (b && !b.querySelector(".tutor-video.tutor-video-da")) {
    b.classList.remove("tutor-film-laeuft");
  }
  if (!tutorMaskeLauf) return;
  try { tutorMaskeLauf.halt(); tutorMaskeLauf.video.pause(); tutorMaskeLauf.video.src = ""; } catch (e) {}
  tutorMaskeLauf = null;
}

/* GEMELDET: „der Originalavatar klebt immer noch hinter mir. Das
   sieht aus, als wenn zwei uebereinander gesetzt sind."
   Das Standbild wurde beim Film nur angehalten, nicht versteckt —
   ueberall, wo der Film durchsichtig ist, stand es dahinter und
   zeigte eine andere Haltung.
   Die CSS-Regel dafuer haengt an „:has()". Das kann nicht jeder
   Browser, und wo es fehlt, faellt die Regel still aus. Deshalb
   setzt der Tutor die Klasse zusaetzlich selbst — ein Rueckfall,
   der nichts kostet. */
function tutorFilmLaeuft(ja) {
  const b = document.querySelector(".tutor-buehne");
  if (b) b.classList.toggle("tutor-film-laeuft", Boolean(ja));
}

/* Den Film zum Stueck zeigen — oder eben nicht. Beides ist in
   Ordnung: das Standbild liegt darunter und bleibt sichtbar. */
function tutorFilmSetzen(ton) {
  const v = document.getElementById("tutorVideo");
  if (!v) return;
  const aus = () => {
    v.classList.remove("tutor-video-da");
    tutorFilmLaeuft(false);
    try { v.pause(); } catch (e) {}
  };
  if (!tutorFilmDa(ton)) { aus(); tutorMaskeStoppen(); v.removeAttribute("src"); return; }
  /* GEMELDET: „der Avatar soll von der Groessen-Dimension genauso
     gross wie der alte sein, meiner ist jetzt fast doppelt so gross.
     Ich weiss nicht, wie das passieren konnte."
     NACHGEMESSEN, bei gleicher Anzeigehoehe von 300 px:
       Standbild Comic  Figur 294,2 px   Kopf 69,8 px breit
       Film             Figur 294,2 px   Kopf 69,8 px breit  (jetzt
                        gleichgezogen, siehe werkzeug/tutorfilm-saeubern.py)
       Standbild FOTO   Figur 294,8 px   Kopf 46,2 px breit
     Der Film ist aus dem COMIC gezeichnet. Ueber dem Foto ist sein
     Kopf deshalb das 1,55-fache — und genau das ist das „fast
     doppelt so gross". Mit keiner Streckung ist das zu retten: wer
     den Kopf passend macht, macht den Koerper falsch.
     Also: der Film laeuft nur ueber dem Comic. Wer das Foto
     eingestellt hat, behaelt sein Foto — Text und Stimme laufen
     unveraendert weiter. */
  if (tutorArt() !== "comic") { aus(); tutorMaskeStoppen(); v.removeAttribute("src"); return; }
  /* Kein Alpha-webm (iPhone)? Dann der Maskenweg — er sieht ueberall
     gleich aus. Klappt auch der nicht, bleibt das Standbild. */
  if (!tutorAlphaGeht()) {
    aus();
    if (tutorMaskeStarten(ton)) return;
  }
  tutorMaskeStoppen();
  /* WEBM MIT ALPHA, nicht mp4.
     Der erzeugte Film hat einen schwarzen Hintergrund; der ist
     herausgerechnet (colorkey), und durchsichtig kann nur webm.
     Safari spielt webm mit Alpha nicht — dort schlaegt play() fehl
     oder das Bild bleibt leer, und genau dafuer ist der Rueckfall
     da: das Standbild steht ohnehin darunter. */
  const quelle = "tutor/video/" + ton + ".webm" + (window.DMA_V ? DMA_V("tutor/") : "?v=" + (window.DMA_VERSION || "1"));
  if (v.getAttribute("src") !== quelle) v.setAttribute("src", quelle);
  v.onerror = aus;
  v.onended = aus;
  v.currentTime = 0;
  const lauf = v.play();
  if (lauf && lauf.then) {
    lauf.then(() => {
      v.classList.add("tutor-video-da");
      tutorFilmLaeuft(true);
    }).catch(aus);
  } else {
    v.classList.add("tutor-video-da");
    tutorFilmLaeuft(true);
  }
}

/* „Vielleicht auch fuer die Leute die neu sind bei der
   Registration, dass wenn sie auf der Profil Sektion sind, dass er
   sagt willkommen in deinem Profil" — manche Stuecke gelten nur
   fuer Gaeste, andere nur fuer angemeldete Leute. wenn: "gast"
   oder wenn: "konto"; ohne Feld gilt das Stueck fuer alle. */
function tutorStueckeFiltern(liste) {
  if (!Array.isArray(liste)) return null;
  /* DAS BACKEND HEISST BACKEND — NICHT window.Backend.
     backend.js beginnt mit „const Backend = …": ein const auf
     oberster Ebene erzeugt einen globalen NAMEN, aber KEINE
     Eigenschaft am Fenster. „window.Backend && …" ist deshalb
     immer falsch, und der Gruss fuer Gaeste lief auch bei
     Angemeldeten. Gemessen in werkzeug/pruefe-tutorstimme34.js. */
  let drin = false;
  try {
    drin = typeof Backend !== "undefined" && Backend && Backend.currentUser
           ? Boolean(Backend.currentUser()) : false;
  } catch (e) { drin = false; }
  return liste.filter((st) => {
    const w = st && st.wenn;
    if (!w) return true;
    if (w === "gast") return !drin;
    if (w === "konto") return drin;
    return true;
  });
}

function tutorStueckSpielen() {
  const l = tutorLauf;
  if (!l) return;
  const b = document.getElementById("tutorBuehne");
  if (!b) return;
  const st = l.stuecke[l.nr];
  if (!st) { tutorSchliessen(); return; }
  tutorFilmSetzen(st.ton || "");
  b.dataset.ton = st.ton || "";
  b.dataset.ziel = st.ziel || "";
  b.querySelector("#tutorText").textContent = st.text || "";
  tutorLeuchten(st.ziel);
  tutorHilfeZeichnen(st);
  const weiter = () => {
    if (!tutorLauf || tutorLauf !== l) return;
    l.nr++;
    if (l.nr >= l.stuecke.length) { tutorSchliessen(); return; }
    tutorStueckSpielen();
  };
  /* Lesezeit als Notnagel: 15 Zeichen je Sekunde, mindestens drei
     Sekunden. Der Ton uebersteuert das, sobald er zu Ende ist. */
  const lese = Math.max(3000, Math.round((st.text || "").length / 15 * 1000));
  const notnagel = (ms) => {
    if (tutorZeitgeber) clearTimeout(tutorZeitgeber);
    tutorZeitgeber = setTimeout(weiter, ms);
  };
  if (tutorZeitgeber) clearTimeout(tutorZeitgeber);
  if (!tutorTonSpielen(st.ton || "", false, weiter, () => { if (tutorLauf === l) notnagel(lese); })) {
    notnagel(lese);
  } else {
    /* Auch mit Ton eine Reissleine: kommt kein „zu Ende" (Datei
       fehlt, Browser blockt), haengt der Tutor sonst ewig. */
    notnagel(lese + 20000);
  }
}

/* Die kleine Hilfe und der Sprungknopf zum gerade genannten
   Bereich. „Vielleicht gibt's dann auch so eine kleine Hilfe zu
   dieser Sektion innerhalb der Sprechblase, die man sich anzeigen
   lassen kann, und dann kann man aus der einzelnen Sektion noch
   mal zu dem Punkt springen." */
function tutorHilfeZeichnen(st) {
  const kasten = document.getElementById("tutorExtra");
  if (!kasten) return;
  kasten.innerHTML = "";
  if (!st.ziel) return;
  const pille = document.querySelector(`.subnav-pill[data-sub="${st.ziel}"]`);
  const name = pille ? pille.textContent.replace(/ⓘ.*$/, "").trim() : st.ziel;
  const hin = document.createElement("button");
  hin.type = "button";
  hin.className = "tutor-mini tutor-hin";
  hin.textContent = "→ " + name;
  hin.addEventListener("click", () => {
    if (pille) pille.click();
    tutorSchliessen();
  });
  kasten.appendChild(hin);
  if (st.hilfe) {
    const auf = document.createElement("button");
    auf.type = "button";
    auf.className = "tutor-mini";
    auf.textContent = "Was ist das?";
    const text = document.createElement("p");
    text.className = "tutor-hilfe";
    text.textContent = st.hilfe;
    text.hidden = true;
    auf.addEventListener("click", () => {
      text.hidden = !text.hidden;
      auf.textContent = text.hidden ? "Was ist das?" : "Verstanden";
    });
    kasten.appendChild(auf);
    kasten.appendChild(text);
  }
}

/* =============================================================
   DER EINZELNE BEREICH — beim Anklicken eines Unterreiters
   -------------------------------------------------------------
   GEWUENSCHT: „…dass dieser Bereich noch mal kurz erklaert wird
   im Einzelnen, dass speziell zur Bilderwelt noch mal eine
   Erklaerung kommt, was man da genau machen kann."

   Einmal je Besuch und Bereich. Wer den Tutor abgeschaltet hat,
   bekommt auch das nicht. Und wenn Alex gerade den ganzen
   Bereich durchspricht, faellt er sich nicht selbst ins Wort:
   dann passiert hier nichts.
   ============================================================= */
/* Dieselbe Regel und dieselbe Ablage fuer die Unterbereiche. */
const tutorBereichGezeigt = tutorGezeigt;

function tutorBereichRufen(sub, nochmal, echterKlick) {
  if (!sub || !tutorAn()) return;
  if (!nochmal && tutorBereichGezeigt.has(sub)) return;
  /* GEMELDET: „In der Uebersicht-Sektion springt der Tutor. Ich
     weiss nicht, ob er in einer anderen Sektion auch noch spricht."

     Zwei Stimmen waren es nie (gemessen: nie mehr als eine Spur
     gleichzeitig) — aber er FIEL SICH SELBST INS WORT. Kam gerade
     eine Runde herein und klickte die Seite im selben Moment den
     ersten Unterreiter programmatisch an, wurde die Runde nach
     wenigen Millisekunden abgeraeumt und durch die
     Bereichserklaerung ersetzt. Deshalb: was der Mensch nicht
     selbst angetippt hat, unterbricht nichts — weder eine
     laufende Runde noch eine, die gerade geholt wird. Der Bereich
     bleibt dabei ungezeigt und kommt beim naechsten echten Tippen
     ganz normal. */
  /* Und zwar IMMER, nicht nur wenn gerade etwas laeuft: beim
     Betreten eines Hauptreiters klickt die Seite den ersten
     Unterreiter selbst an (activePill.click()). Davon weiss der
     Mensch nichts — es ist kein Aufmachen eines Bereichs, sondern
     Innenleben. GEMESSEN: nach dem Neuladen kam sonst die
     Bereichserklaerung, obwohl Alex an diesem Tag laengst dran
     war. Erklaert wird ab jetzt nur, was jemand SELBST antippt. */
  if (!echterKlick && !nochmal) return;
  /* Laeuft gerade die grosse Runde durch den ganzen Bereich?
     Dann hat der Mensch eben BEWUSST auf einen Unterreiter
     getippt — das ist eine Ansage. Die Runde wird abgebrochen
     und stattdessen genau das erklaert, was er sehen wollte.
     (Beim Messen kam sonst beim Profil die Bereichsrunde
     dazwischen und die Einstellungen wurden nie erklaert.) */
  if (tutorLauf) {
    if (tutorLauf.bereich === sub) return;      // laeuft schon
    tutorSchliessen(true);
  }
  const meine = ++tutorAnfrage;
  tutorHoltGerade = true;
  tutorTexteHolen().then((da) => {
    if (meine === tutorAnfrage) tutorHoltGerade = false;
    if (!da || meine !== tutorAnfrage) return;
    const st = (window.DMA_TUTOR_BEREICHE || {})[sub];
    if (!st) return;
    /* Ist der Unterreiter ueberhaupt noch offen? */
    const pille = document.querySelector(`.subnav-pill[data-sub="${sub}"]`);
    if (!nochmal && (!pille || pille.getAttribute("aria-selected") !== "true")) return;
    tutorBereichGezeigt.add(sub);
    const b = tutorBuehne();
    const bild = b.querySelector("#tutorFigur");
    tutorFigurSetzen(bild);
    b.classList.toggle("tutor-comic", tutorArt() === "comic");
    requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add("tutor-da")));
    /* Ein einzelnes Stueck ist nichts anderes als eine Runde mit
       genau einem Eintrag — dieselbe Maschinerie, kein zweiter Weg,
       der auseinanderlaufen koennte. */
    /* Ein Unterbereich darf inzwischen MEHRERE Stuecke haben — ein
       Raum wie das Klassenzimmer laesst sich nicht in einem Atemzug
       erklaeren, und ein Text von siebzig Sekunden in einer einzigen
       Sprechblase liest niemand zu Ende. Steht dort nur ein Text,
       bleibt es bei dem einen Stueck wie bisher. */
    const teile = (Array.isArray(st.stuecke) && st.stuecke.length)
      ? st.stuecke.map((x) => ({ ton: x.ton || "", text: x.text || "",
                                 ziel: x.ziel || "", hilfe: x.hilfe || "" }))
      : [{ ton: st.ton, text: st.text, ziel: "", hilfe: st.hilfe || "" }];
    tutorLauf = { bereich: sub, stuecke: teile, nr: 0 };
    tutorStueckSpielen();
  });
}

/* „nochmal" = ein bewusster Tastendruck; dann darf er auch dann
   kommen, wenn er in diesem Besuch schon da war. */
function tutorRufen(bereich, nochmal) {
  if (!tutorAn()) return;
  if (!nochmal && tutorGezeigt.has(bereich)) return;
  const meine = ++tutorAnfrage;
  tutorHoltGerade = true;
  tutorTexteHolen().then((da) => {
    if (meine === tutorAnfrage) tutorHoltGerade = false;
    if (!da || meine !== tutorAnfrage) return;
    const eintrag = (window.DMA_TUTOR || {})[bereich];
    const stuecke = tutorStueckeFiltern(eintrag && eintrag.stuecke);
    if (!stuecke || !stuecke.length) return;
    /* Der Bereich kann inzwischen gewechselt haben — dann nicht mehr
       hereinplatzen. */
    const jetzt = document.querySelector(".view[data-active=\"true\"]");
    if (!nochmal && jetzt && jetzt.id !== bereich) return;
    tutorGezeigt.add(bereich);
    const b = tutorBuehne();
    const bild = b.querySelector("#tutorFigur");
    tutorFigurSetzen(bild);
    b.classList.toggle("tutor-comic", tutorArt() === "comic");
    /* Erst im nächsten Bild anschalten, sonst gibt es keine
       Bewegung — das Element wäre im selben Moment entstanden und
       schon am Ziel. */
    requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add("tutor-da")));
    tutorLauf = { bereich: bereich, stuecke: stuecke, nr: 0 };
    tutorStueckSpielen();
  });
}

export { tutorAn, tutorAnSetzen, tutorArt, tutorArtSetzen, tutorBereichRufen, tutorReiterPflegen, tutorRufen, tutorSchliessen, tutorSchreibOhren };
