/* =========================================================
   APP.JS — verbindet alle Module mit der Oberfläche
   ========================================================= */
(function () {
  "use strict";

  // Absicherung: falls dieses Skript aus irgendeinem Grund (z. B. Mehrfach-Einbindung,
  // doppeltes Laden) zweimal ausgeführt wird, sofort abbrechen. Das verhindert doppelte
  // Timer/Intervalle, die sonst z. B. Duell-Benachrichtigungen doppelt anzeigen würden.
  if (window.__dmaAppInitialized) return;
  window.__dmaAppInitialized = true;

  // Früh deklariert (aber erst später zugewiesen), damit Funktionen wie updateNotifyBadge,
  // die schon vor der eigentlichen Zuweisung aufgerufen werden können, nicht abstürzen.
  let loginBtn;

  // Bewegt das gemeinsame Video-Vorschaufenster physisch dorthin, wo es gerade sichtbar sein soll
  // (Musik-Reiter bevorzugt, sonst schwebende Leiste) — an zentraler Stelle, damit sowohl der
  // Haupt-Tab-Wechsel als auch renderMusicFloatingBar() dieselbe Logik nutzen.
  function relocateMusicVideoSquare() {
    const videoSquare = document.getElementById("musicVideoSquare");
    if (!videoSquare) return;
    const floatSlot = document.getElementById("musicVideoSquareSlotFloat");
    if (floatSlot) { floatSlot.appendChild(videoSquare); videoSquare.style.display = ""; }
  }
  /* ============ Haupt-Tab-Navigation ============ */
  const tabs = document.querySelectorAll(".tape-tab");
  const views = document.querySelectorAll(".view");

  // "Über mich" ist admin-editierbar — lädt beim Start eventuelle gespeicherte Anpassungen und
  // zeigt Admins (nur ihnen) einen dezenten Bearbeiten-Knopf direkt an Ort und Stelle.
  async function loadAndRenderAboutSection() {
    const saved = await Backend.getSiteContent("about");
    const img = document.querySelector("#view-about .avatar-wrap img");
    // Das URSPRÜNGLICHE, fest im HTML stehende Bild EINMALIG sichern, bevor es je überschrieben
    // wird — sonst gibt es später keine Möglichkeit mehr, "auf Original zurücksetzen" zu wählen,
    // weil das ursprüngliche src schon lange durch das gespeicherte ersetzt wurde.
    if (img && !img.dataset.originalSrc) img.dataset.originalSrc = img.src;
    if (saved) {
      const h2 = document.querySelector("#view-about h2");
      const role = document.querySelector("#view-about .role");
      const shortText = document.querySelector("#view-about .about-text-short");
      const supportNote = document.querySelector("#view-about .about-support-note");
      if (saved.heading && h2) h2.textContent = saved.heading;
      if (saved.role && role) role.textContent = saved.role;
      if (saved.shortText && shortText) shortText.textContent = saved.shortText;
      if (saved.supportNote && supportNote) supportNote.textContent = saved.supportNote;
      // photoUrl === "" (bewusst leer gespeichert, z. B. über "Auf Original zurücksetzen") stellt
      // das gesicherte Original-Bild wieder her, statt es einfach unverändert zu lassen.
      if (img) {
        if (saved.photoUrl) img.src = saved.photoUrl;
        else if (saved.photoUrl === "") img.src = img.dataset.originalSrc;
      }
    }
    renderAboutEditButton();
  }
  function renderAboutEditButton() {
    const existing = document.getElementById("aboutEditBtn");
    if (existing) existing.remove();
    if (!Backend.canModerate || !Backend.canModerate()) return;
    const card = document.querySelector("#view-about .about-card");
    if (!card) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "aboutEditBtn";
    btn.className = "emoji-toggle-link";
    btn.style.cssText = "display:block; margin-top:12px; font-size:0.78rem;";
    btn.textContent = "✏️ Nur für dich sichtbar: Über-mich-Text bearbeiten";
    btn.addEventListener("click", openAboutEditForm);
    card.appendChild(btn);
  }
  function openAboutEditForm() {
    const h2 = document.querySelector("#view-about h2");
    const role = document.querySelector("#view-about .role");
    const shortText = document.querySelector("#view-about .about-text-short");
    const supportNote = document.querySelector("#view-about .about-support-note");
    const img = document.querySelector("#view-about .avatar-wrap img");
    const profile = Backend.currentProfile();
    const gallery = (profile && profile.gallery) || [];
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `
      <div class="profile-modal-card" style="text-align:left; max-height:85vh; overflow-y:auto;">
        <button type="button" class="lightbox-close" id="aboutEditClose">✕</button>
        <h3 style="margin-bottom:12px;">✏️ Über mich bearbeiten</h3>
        <p class="empty-note" style="margin-bottom:12px;">Nur der Inhalt ändert sich — Schriftart und Design bleiben genau wie bisher.</p>
        <div class="form-field"><label>Überschrift</label><input type="text" id="aboutEditHeading" value="${h2 ? h2.textContent : ""}" /></div>
        <div class="form-field"><label>Rolle/Untertitel</label><input type="text" id="aboutEditRole" value="${role ? role.textContent : ""}" /></div>
        <div class="form-field"><label>Kurztext</label><textarea id="aboutEditShort" class="guestbook-form-textarea">${shortText ? shortText.textContent : ""}</textarea></div>
        <div class="form-field"><label>Kurzer Unterstützungs-Hinweis</label><textarea id="aboutEditSupport" class="guestbook-form-textarea">${supportNote ? supportNote.textContent : ""}</textarea></div>
        <p class="eyebrow" style="margin-top:14px;">📷 Foto — drei Möglichkeiten</p>
        <div class="form-field"><label>1) Bild-Adresse (Link)</label><input type="text" id="aboutEditPhoto" value="${img ? img.src : ""}" placeholder="https://…" /></div>
        <div class="form-field"><label>2) Datei hochladen</label><input type="file" id="aboutEditPhotoUpload" accept="image/*" /></div>
        <button type="button" class="emoji-toggle-link" id="aboutPhotoResetBtn" style="font-size:0.76rem; margin-top:2px;">↩️ Vorheriges Foto wiederherstellen</button>
        ${gallery.length ? `
        <div class="form-field">
          <label>3) Aus deiner Galerie wählen</label>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:6px;">
            ${gallery.map((url) => `<img src="${url}" data-gallery-pick="${url}" style="width:56px; height:56px; object-fit:cover; border-radius:8px; cursor:pointer; border:2px solid transparent;" />`).join("")}
          </div>
        </div>` : ""}
        <p class="empty-note" id="aboutPhotoPreviewNote" style="margin-top:6px;"></p>
        <button type="button" class="btn btn-coffee" id="aboutEditSave" style="margin-top:10px;">Speichern</button>
        <p class="form-error" id="aboutEditError" style="display:none;"></p>
      </div>`;
    document.body.appendChild(box);
    document.getElementById("aboutEditClose").addEventListener("click", () => box.remove());
    box.addEventListener("click", (e) => { if (e.target === box) box.remove(); });
    box.querySelectorAll("[data-gallery-pick]").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        document.getElementById("aboutEditPhoto").value = thumb.dataset.galleryPick;
        box.querySelectorAll("[data-gallery-pick]").forEach((t) => { t.style.borderColor = "transparent"; });
        thumb.style.borderColor = "var(--amber-400, #f2b84b)";
        document.getElementById("aboutPhotoPreviewNote").textContent = "✅ Galeriebild ausgewählt.";
      });
    });
    document.getElementById("aboutPhotoResetBtn").addEventListener("click", async () => {
      // WICHTIG: "zurücksetzen" bedeutet für die meisten Nutzer:innen "zurück zu MEINEM eigenen,
      // vorher selbst gesetzten Foto" — NICHT zwingend zurück zum allerersten, im HTML fest
      // kodierten Standardbild der Seite. Beide Fälle jetzt getrennt anbieten, damit ein eigenes,
      // wertvolles Foto nie mehr versehentlich durch das Standardbild ersetzt und überschrieben
      // werden kann, ohne dass es einen Weg zurück gibt.
      const history = (await Backend.getSiteContent("about_photo_history")) || [];
      const currentVal = document.getElementById("aboutEditPhoto").value;
      const previous = history.find((url) => url && url !== currentVal);
      if (previous) {
        document.getElementById("aboutEditPhoto").value = previous;
        document.getElementById("aboutPhotoPreviewNote").textContent = "↩️ Dein vorheriges, selbst gesetztes Foto ausgewählt — erst nach „Speichern“ wirklich übernommen.";
      } else {
        document.getElementById("aboutEditPhoto").value = "";
        document.getElementById("aboutPhotoPreviewNote").textContent = "↩️ Kein vorheriges eigenes Foto gefunden — wird beim Speichern auf das Standard-Bild der Seite zurückgesetzt.";
      }
    });
    document.getElementById("aboutEditPhotoUpload").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const note = document.getElementById("aboutPhotoPreviewNote");
      note.textContent = "Lädt hoch…";
      try {
        const url = await Backend.uploadSiteImage("about_photo_" + Date.now(), file);
        document.getElementById("aboutEditPhoto").value = url;
        note.textContent = "✅ Hochgeladen und übernommen.";
      } catch (err) {
        note.textContent = "⚠️ " + err.message;
      }
    });
    document.getElementById("aboutEditSave").addEventListener("click", async () => {
      const errBox = document.getElementById("aboutEditError");
      try {
        // VOR dem Überschreiben: den BISHERIGEN Foto-Link sichern, damit er über den
        // "Zurücksetzen"-Knopf jederzeit wieder auffindbar ist — ein eigenes, selbst gesetztes
        // Foto darf beim nächsten Wechsel nie mehr spurlos verloren gehen.
        const oldContent = await Backend.getSiteContent("about");
        const oldPhotoUrl = oldContent && oldContent.photoUrl;
        const newPhotoUrl = document.getElementById("aboutEditPhoto").value;
        if (oldPhotoUrl && oldPhotoUrl !== newPhotoUrl) {
          const history = (await Backend.getSiteContent("about_photo_history")) || [];
          const updatedHistory = [oldPhotoUrl, ...history.filter((u) => u !== oldPhotoUrl)].slice(0, 5);
          await Backend.setSiteContent("about_photo_history", updatedHistory);
        }
        await Backend.setSiteContent("about", {
          heading: document.getElementById("aboutEditHeading").value,
          role: document.getElementById("aboutEditRole").value,
          shortText: document.getElementById("aboutEditShort").value,
          supportNote: document.getElementById("aboutEditSupport").value,
          photoUrl: newPhotoUrl,
        });
        box.remove();
        loadAndRenderAboutSection();
      } catch (err) {
        errBox.textContent = "⚠️ " + err.message;
        errBox.style.display = "block";
      }
    });
  }
  function activateTab(targetId) {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.target === targetId)));
    views.forEach((v) => (v.dataset.active = String(v.id === targetId)));
    history.replaceState(null, "", `#${targetId}`);
  }
  // Verhindert, dass der programmatisch simulierte Unterreiter-Klick beim erstmaligen Öffnen
  // eines Hauptreiters (siehe activePill.click() unten) denselben automatischen Scroll auslöst
  // wie ein echter, bewusster Klick auf einen Unterreiter-Knopf (siehe wireSubnav).
  let suppressNextSubnavScroll = false;
  // Der jeweils standardmäßig aktive Unterreiter eines Bereichs (z. B. "Kompass" bei "Wissen")
  // wird beim allerersten Seitenaufbau gerendert, BEVOR jemand eingeloggt ist — Admin-Symbole wie
  // das Banner-Bearbeiten-Icon fehlten dadurch, bis man den Unterreiter irgendwann mal EXPLIZIT
  // selbst anklickte. Beim allerersten Wechsel zu einem Hauptreiter pro Sitzung wird der aktive
  // Unterreiter jetzt einmal automatisch "nachgeklickt", damit er mit den echten, aktuellen
  // Berechtigungen neu rendert.
  const tabsFreshlyRendered = new Set();
  tabs.forEach((t) => t.addEventListener("click", () => {
    activateTab(t.dataset.target);
    if (!tabsFreshlyRendered.has(t.dataset.target)) {
      tabsFreshlyRendered.add(t.dataset.target);
      const view = document.getElementById(t.dataset.target);
      const activePill = view?.querySelector(".subnav-pill[aria-selected=\"true\"]");
      if (activePill) { suppressNextSubnavScroll = true; activePill.click(); }
    }
    if (t.dataset.target === "view-profile") maybeShowFoxIntro();
    if (t.dataset.target === "view-about") renderAboutEditButton();
    // Missionen zeigen den Freischalt-Fortschritt der Sammelfiguren — der ändert sich potenziell
    // bei JEDER gespielten Runde, nicht nur einmalig beim Login. Ist "Missionen" gerade der aktive
    // Unterreiter, wird bei jedem Rückkehr zu "Lernen" neu gerendert, damit frisch verdiente Füchse
    // sofort als freigeschaltet erscheinen, statt erst nach einem erneuten, expliziten Klick.
    if (t.dataset.target === "view-learn") {
      const missionsPill = document.querySelector('#learnSubnav [data-sub="sub-missions"]');
      if (missionsPill && missionsPill.getAttribute("aria-selected") === "true" && typeof renderMissions === "function") {
        renderMissions();
      }
    }
    // Beim Verlassen des "Wissen"-Hauptbereichs das Video-Vorschaufenster (falls gerade ein Song
    // läuft) sofort in die schwebende Leiste holen — nicht erst beim nächsten Play/Pause-Klick.
    if (t.dataset.target !== "view-knowledge" && typeof relocateMusicVideoSquare === "function") {
      relocateMusicVideoSquare();
    }
    // Gleiches gilt für die Sichtbarkeit der schwebenden Leiste selbst — sie muss beim Verlassen
    // des Musik-Unterreiters wieder erscheinen, beim Wechsel dorthin wieder verschwinden. Ein
    // Tab-Wechsel hebt außerdem eine eventuelle "nur aus dem Profil gehört"-Unterdrückung auf und
    // lässt die Leiste dabei sanft erscheinen, statt abrupt aufzupoppen.
    if (typeof revealMusicFloatingBarOnNavigation === "function") revealMusicFloatingBarOnNavigation();
    if (typeof renderMusicFloatingBar === "function") renderMusicFloatingBar();
  }));
  const initial = window.location.hash?.replace("#", "");
  if (initial && document.getElementById(initial)) activateTab(initial);

  const impressumLink = document.getElementById("impressumLink");
  if (impressumLink) {
    impressumLink.addEventListener("click", (e) => {
      e.preventDefault();
      activateTab("view-impressum");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============ Generische Sub-Navigation ============ */
  function wireSubnav(navId) {
    const nav = document.getElementById(navId);
    if (!nav) return;
    nav.querySelectorAll(".subnav-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        nav.querySelectorAll(".subnav-pill").forEach((p) => p.setAttribute("aria-selected", String(p === pill)));
        const parent = nav.parentElement;
        parent.querySelectorAll(".subview").forEach((v) => (v.dataset.active = String(v.id === pill.dataset.sub)));
        // Bei JEDEM Unterreiter-Wechsel (nicht nur beim Song-Wechsel selbst) neu prüfen, ob die
        // schwebende Player-Leiste sichtbar sein soll — sie muss verschwinden, sobald man in den
        // Musik-Unterreiter wechselt (der schon seine eigene Leiste hat), und wieder erscheinen,
        // sobald man ihn verlässt. Hebt außerdem eine eventuelle "nur aus dem Profil gehört"-
        // Unterdrückung auf, genau wie beim Haupt-Tab-Wechsel — sonst blieb die Leiste bei einer
        // Navigation zwischen einzelnen Spielen/Unterreitern (statt über die Haupt-Tabs) für
        // immer unsichtbar, obwohl man den Ausgangspunkt (Profil) längst verlassen hatte.
        if (typeof revealMusicFloatingBarOnNavigation === "function") revealMusicFloatingBarOnNavigation();
        if (typeof renderMusicFloatingBar === "function") renderMusicFloatingBar();
        // Sobald man an einem Ziel-Unterreiter tatsächlich ANKOMMT — egal auf welchem Weg dorthin
        // (Profil-Pille, Toast-Blase, oder einfach direkt den Reiter selbst angetippt) — gilt die
        // zugehörige Benachrichtigung als erledigt: Farbe/Sound/Lämpchen UND der kleine Punkt am
        // Reiter selbst verschwinden gemeinsam, statt dass man beides einzeln wegklicken muss.
        if (typeof stopNotifyReminder === "function") stopNotifyReminder();
        if (pill.dataset.sub === "sub-inbox") {
          const inboxBadge = document.getElementById("inboxTabBadge");
          if (inboxBadge) inboxBadge.style.display = "none";
        }
        if (pill.dataset.sub === "sub-friends") {
          const friendsBadge = document.getElementById("friendsTabBadge");
          if (friendsBadge) friendsBadge.style.display = "none";
        }
        // WICHTIG: bei so vielen Spielen im Menü ist der ausgewählte Bereich nach einem ECHTEN,
        // bewussten Klick auf einen Unterreiter-Knopf oft weit unterhalb des Menüs selbst und
        // damit außerhalb des sichtbaren Bildschirms — dafür springt die Ansicht automatisch zum
        // Anfang des aktiven Bereichs. ABER: derselbe Klick-Handler wird auch programmatisch
        // ausgelöst, um Admin-Symbole beim allerersten Öffnen eines Hauptreiters nachzuziehen
        // (siehe activePill.click() weiter oben) — DORT darf kein Sprung passieren, sonst landet
        // man scheinbar zufällig irgendwo auf der Seite, nur weil man den Hauptreiter (nicht
        // irgendeinen Unterreiter-Knopf) angetippt hat. suppressNextSubnavScroll unterscheidet
        // beide Fälle.
        if (!suppressNextSubnavScroll) {
          const activeView = parent.querySelector(`.subview[id="${pill.dataset.sub}"]`);
          if (activeView) {
            requestAnimationFrame(() => activeView.scrollIntoView({ behavior: "smooth", block: "start" }));
          }
        }
        suppressNextSubnavScroll = false;
      });
    });
  }
  wireSubnav("learnSubnav");

  /* ============ Geführte Tour für neue Besucher ============ */
  const TOUR_STEPS = [
    { emoji: "👋", title: "Willkommen bei Deutsch mit Alex!", text: "Kurze Tour gefällig? Vier Schritte, dann kennst du dich aus. Du kannst jederzeit überspringen." },
    { emoji: "🧭", title: "Die vier Reiter oben", text: "Über mich, Lernen, Wissen und Profil & Rang — hier wechselst du zwischen den Bereichen der Seite." },
    { emoji: "🎯", title: "Lernen", text: "Hier übst du Deutsch in vielen Kategorien — wähl eine oder mehrere aus, stell die Schwierigkeit ein und leg los. Punkte gibt's für jede richtige Antwort." },
    { emoji: "🏆", title: "Profil & Rang", text: "Dein Fortschritt, Freunde, Ranking und dein persönliches Design — manche Designs und Übungskategorien schaltest du dir durchs Üben frei." },
    { emoji: "✍️", title: "Wissen", text: "Lesetexte anderer Lernender, eigene Beiträge einreichen, liken und kommentieren — schau gern mal vorbei." },
  ];
  function startTour() {
    let step = 0;
    const box = document.createElement("div");
    box.className = "lightbox";
    document.body.appendChild(box);
    function render() {
      const s = TOUR_STEPS[step];
      box.innerHTML = `
        <div class="profile-modal-card" style="text-align:center;">
          <div style="font-size:2.4rem; margin-bottom:8px;">${s.emoji}</div>
          <h2 style="margin-bottom:8px;">${s.title}</h2>
          <p class="empty-note" style="margin-bottom:18px;">${s.text}</p>
          <div class="quiz-actions" style="justify-content:center;">
            ${step < TOUR_STEPS.length - 1 ? `<button type="button" class="btn btn-ghost" id="tourSkip">Überspringen</button><button type="button" class="btn btn-coffee" id="tourNext">Weiter</button>` : `<button type="button" class="btn btn-coffee" id="tourDone">Los geht's! 🚀</button>`}
          </div>
        </div>`;
      const next = document.getElementById("tourNext");
      if (next) next.addEventListener("click", () => { step++; render(); });
      const skip = document.getElementById("tourSkip");
      if (skip) skip.addEventListener("click", finish);
      const done = document.getElementById("tourDone");
      if (done) done.addEventListener("click", finish);
    }
    function finish() {
      box.remove();
      try { localStorage.setItem("dma_tour_seen", "1"); } catch (e) {}
    }
    render();
  }
  // Fuchs-Vorstellungs-Popup — erscheint EINMAL, wenn man ins Profil kommt und die Sammelfiguren
  // noch nicht kennt. Im Konto gespeichert (nicht localStorage), damit es auf keinem Gerät ein
  // zweites Mal auftaucht. Zeigt 3 echte Beispiel-Füchse plus eine kurze Update-Zusammenfassung.
  let foxIntroCheckInProgress = false;
  async function maybeShowFoxIntro() {
    if (foxIntroCheckInProgress) return; // verhindert mehrere gleichzeitige Popups bei schnellem Mehrfachklick
    if (document.querySelector(".lightbox")) return; // ein anderes Popup ist schon offen
    const profile = Backend.currentProfile();
    if (!profile) return;
    if (profile.extraProfileData && profile.extraProfileData.seenFoxIntro) return;
    foxIntroCheckInProgress = true;
    try {
      await Backend.updateExtraProfileField("seenFoxIntro", true);
    } finally {
      foxIntroCheckInProgress = false;
    }
    const sample = COLLECTIBLE_FIGURES.slice(0, 3);
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `
      <div class="profile-modal-card" style="text-align:center;">
        <button type="button" class="lightbox-close" id="foxIntroClose">✕</button>
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom:12px;">
          ${sample.map((f) => `<img src="${f.img}" alt="${f.name}" style="width:64px; height:64px; object-fit:contain;" />`).join("")}
        </div>
        <h2 style="margin-bottom:8px;">🦊 Die Sammelfüchse sind da!</h2>
        <p class="empty-note" style="margin-bottom:14px;">Beim Deutschlernen sammelst du nach und nach niedliche Fuchs-Figuren — je mehr Punkte und Erfolge du erspielst, desto mehr schaltest du frei. Du findest sie in deinem Profil und kannst dir sogar eine als Profilbild einstellen.</p>
        <p class="empty-note" style="font-size:0.78rem; opacity:0.8; margin-bottom:16px;">Außerdem neu im Hintergrund: ein Musik-Player mit eigenen Playlists, eine neue "So funktioniert's"-Erklärung bei Wissen, und ein paar kleinere Verbesserungen.</p>
        ${!profile.isBetaTester ? `<button type="button" class="btn btn-ghost" id="applyBetaTesterBtn" style="margin-bottom:10px; display:block; width:100%;">🧪 Beta-Tester werden? Neue Spiele als Erste:r ausprobieren</button>` : ""}
        <button type="button" class="btn btn-coffee" id="foxIntroDone">Verstanden! 🦊</button>
      </div>`;
    document.body.appendChild(box);
    const close = () => box.remove();
    document.getElementById("foxIntroClose").addEventListener("click", close);
    document.getElementById("foxIntroDone").addEventListener("click", close);
    document.getElementById("applyBetaTesterBtn")?.addEventListener("click", async () => {
      await Backend.applyForBetaTester();
      showToast("🧪 Anfrage verschickt — der Betreiber schaut sich das an!");
      close();
    });
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
  }
  let tourSeen = true;
  try { tourSeen = Boolean(localStorage.getItem("dma_tour_seen")); } catch (e) {}
  if (!tourSeen) setTimeout(startTour, 600);
  const tourReplayLink = document.getElementById("tourReplayLink");
  if (tourReplayLink) tourReplayLink.addEventListener("click", (e) => { e.preventDefault(); startTour(); });

  wireSubnav("knowledgeSubnav");
  // Eigenes Favicon anwenden, falls ein:e Admin/Betreiber:in eines hochgeladen hat — für ALLE
  // Nutzer:innen, nicht nur in den Einstellungen selbst.
  function applyCustomFavicon(url) {
    const link = document.getElementById("mainFavicon");
    if (!link) return;
    if (url) {
      link.href = url;
    } else {
      link.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%A6%8A%3C/text%3E%3C/svg%3E";
    }
  }
  Backend.getSiteContent("custom_favicon_url").then((url) => { if (url) applyCustomFavicon(url); }).catch(() => {});
  wireSubnav("profileSubnav");
  document.querySelector('#learnSubnav [data-sub="sub-exercises"]')?.addEventListener("click", () => {
    renderSetup();
  });

  /* ============================================================
     DESIGN / THEMES — 4 austauschbare Vorlagen
     ============================================================ */
  // Sammelfiguren-Vitrine — kleine Sticker-Figuren, die man sich durch Übung verdient. Jede
  // Figur ist thematisch an eine Übungskategorie gekoppelt (passendes Charakter-Kostüm), damit
  // man wirklich für "diese Art von Wissen" belohnt wird, nicht zufällig.
  // Welcher Sammelfigur-Charakter zu welcher Übungskategorie passt — wird als kleine "Willkommen,
  // [Figur]!"-Vorstellung angezeigt, bevor eine Runde in dieser Kategorie beginnt, damit klar ist,
  // "als was" man gerade übt.
  // WICHTIG: Das sind die "Charakter"-Titel, die auch nach jeder Runde den Titel bestimmen
  // (siehe Trophäen-Erklärung: "spielst du viel wenn/ob/als-wie, giltst du als Logiker" usw.) —
  // bewusst NICHT die Fuchs-Sammelfiguren-Namen (die gehören zu den Missionen, ein komplett
  // eigenes System). Vorher stand hier fälschlich überall ein Fuchs-Name.
  const CATEGORY_PERSONA = {
    artikel: "Grammatik-Profi", plural: "Grammatik-Profi", synonyme: "Sprachkünstler",
    "wenn-ob": "Logiker", "als-wie": "Logiker", "kennen-wissen": "Logiker",
    "das-dass": "Grammatik-Profi", redewendungen: "Sprachkünstler", "haeufige-fehler": "Grammatik-Profi",
    "ss-eszett": "Grammatik-Profi", nebensatz: "Grammatik-Profi", relativsatz: "Grammatik-Profi",
    zeitformen: "Grammatik-Profi", wortschatz: "Sprachkünstler", konnektoren: "Grammatik-Profi",
    jedesto: "Grammatik-Profi", quiz: "Wissenschaftler", lueckentext: "Sprachkünstler",
    wortbaustelle: "Sprachkünstler", buchstabensalat: "Sprachkünstler", kreuzwortraetsel: "Sprachkünstler",
    betonungstrainer: "Sprachkünstler",
  };
  function personaForCategory(catId) {
    return CATEGORY_PERSONA[catId] || "Abenteurer";
  }
  // Farbcode je Charakter-Typ für die kleine LED-Anzeige an jeder Übungskategorie — zeigt auf
  // einen Blick, welchem Fuchs-Charakter (und damit welcher Missions-Punktzahl) diese Übung
  // zugutekommt. Hilft beim Verstehen von Missionen wie "50 Punkte bei Zeitfuchs-Aufgaben".
  const PERSONA_LED_COLOR = {
    "Logiker": "#5b8def", "Wissenschaftler": "#3ec6c6", "Sprachkünstler": "#a875d8",
    "Grammatik-Profi": "#e85f6f", "Abenteurer": "#f2b84b", "Tausendsassa": "#e8d34b",
  };
  function personaLedHtml(catId) {
    const persona = personaForCategory(catId);
    const color = PERSONA_LED_COLOR[persona] || "#9a9a9a";
    return `<button type="button" class="persona-led" data-persona-info="${persona}" style="background:${color};" title="${persona}"></button>`;
  }
  document.body.addEventListener("click", (e) => {
    const led = e.target.closest("[data-persona-info]");
    if (!led) return;
    const persona = led.dataset.personaInfo;
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `
      <div class="profile-modal-card" style="text-align:left;">
        <button type="button" class="lightbox-close" id="ledInfoClose">✕</button>
        <p style="text-align:center; margin:6px 0 12px;">💡 Die LED zeigt, welchem Charakter-Typ diese Übung zugutekommt — bestimmt deinen Titel nach einer Runde (z. B. „Grammatik-Profi – Superheld").</p>
        <p style="text-align:center; font-weight:700; margin-bottom:10px;"><span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${PERSONA_LED_COLOR[persona] || "#9a9a9a"}; vertical-align:middle; margin-right:6px;"></span>Diese Übung: ${persona}</p>
        <p class="eyebrow">Alle Farben auf einen Blick:</p>
        <div class="breakdown-list">
          ${Object.entries(PERSONA_LED_COLOR).map(([name, color]) => `<div class="breakdown-row"><span><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${color}; vertical-align:middle; margin-right:6px;"></span>${name}</span></div>`).join("")}
        </div>
        <p class="empty-note" style="margin-top:10px;">Die Fuchs-Sammelfiguren sind ein eigenes System für Missionen — nutzen teils Punkte aus bestimmten Kategorien, aber unabhängig von diesem Charakter-Titel hier.</p>
      </div>`;
    document.body.appendChild(box);
    document.getElementById("ledInfoClose").addEventListener("click", () => box.remove());
    box.addEventListener("click", (ev) => { if (ev.target === box) box.remove(); });
  });
  const COLLECTIBLE_FIGURES = [
    { id: "kleiner-lernfuchs", name: "Kleiner Lernfuchs", img: "figures/kleiner-lernfuchs.png", desc: "Für den Anfang — willkommen!", unlock: { type: "points", value: 20 } },
    { id: "fitnessfuchs", name: "Fitnessfuchs", img: "figures/fitnessfuchs.png", desc: "Bleibt auch beim Lernen fit und in Bewegung — liebt die actionreichen Spiele UND ist schon öfter dabei gewesen", unlock: { type: "combo", parts: [{ type: "category_points", categories: ["wackelturm", "wortkanone"], value: 15 }, { type: "games_played", value: 5 }] } },
    { id: "pausenfuchs", name: "Pausenfuchs", img: "figures/pausenfuchs.png", desc: "Gönnt sich eine Verschnaufpause — kommt regelmäßig wieder UND hat sich schon ins Gästebuch eingetragen", unlock: { type: "combo", parts: [{ type: "login_streak", value: 3 }, { type: "guestbook_entry", value: 1 }] } },
    { id: "professor-schlaufuchs", name: "Professor Schlaufuchs", img: "figures/professor-schlaufuchs.png", desc: "Grammatik-Experte, der auch schon sein Profil vorgestellt hat", unlock: { type: "combo", parts: [{ type: "character_points", character: "Professor Schlaufuchs", value: 50 }, { type: "profile_field", field: "bio" }] } },
    { id: "lesefuchs", name: "Lesefuchs", img: "figures/lesefuchs.png", desc: "Liest für sein Leben gern — kennt sich mit Synonymen bestens aus UND hat „Es war einmal in Deutschland“ gelesen", unlock: { type: "combo", parts: [{ type: "character_points", character: "Lesefuchs", value: 60 }, { type: "visited_section", section: "es-war-einmal" }] } },
    { id: "zeitfuchs", name: "Zeitfuchs", img: "figures/zeitfuchs.png", desc: "Meister der Zeitformen, der auch schon mehrere Übungsarten kennengelernt hat", unlock: { type: "combo", parts: [{ type: "character_points", character: "Zeitfuchs", value: 70 }, { type: "categories_tried", value: 5 }] } },
    { id: "musikerfuchs", name: "Musikerfuchs", img: "figures/musikerfuchs.png", desc: "Immer mit der Gitarre unterwegs — hat schon einen eigenen Song zur Playlist beigesteuert UND fleißig geübt", unlock: { type: "combo", parts: [{ type: "songs_added", value: 1 }, { type: "points", value: 100 }] } },
    { id: "maerchenfuchs", name: "Märchenfuchs", img: "figures/maerchenfuchs.png", desc: "Kenner von Redewendungen & Geschichten — natürlich hat er „Es war einmal in Deutschland“ gelesen", unlock: { type: "combo", parts: [{ type: "character_points", character: "Märchenfuchs", value: 90 }, { type: "visited_section", section: "es-war-einmal" }] } },
    { id: "brueckenfuchs", name: "Brückenfuchs", img: "figures/brueckenfuchs.png", desc: "Verbindet Sätze mit zweiteiligen Konnektoren UND hat schon viele Runden gespielt", unlock: { type: "combo", parts: [{ type: "character_points", character: "Brückenfuchs", value: 110 }, { type: "games_played", value: 10 }] } },
    { id: "kommissar-fehlerfrei", name: "Kommissar Fehlerfrei", img: "figures/kommissar-fehlerfrei.png", desc: "Rechtschreib-Detektiv mit eigenem Steckbrief", unlock: { type: "combo", parts: [{ type: "character_points", character: "Kommissar Fehlerfrei", value: 130 }, { type: "profile_field", field: "bio" }] } },
    { id: "sprachenfuchs", name: "Sprachenfuchs", img: "figures/sprachenfuchs.png", desc: "Zuhause in vielen Sprachen der Welt — und schon fleißig am Punkte sammeln", unlock: { type: "combo", parts: [{ type: "profile_field", field: "languages" }, { type: "points", value: 150 }] } },
    { id: "raetselfuchs", name: "Rätselfuchs", img: "figures/raetselfuchs.png", desc: "Kreuzworträtsel-Fan, der auch sonst gerne verschiedene Rätsel-Spiele ausprobiert", unlock: { type: "combo", parts: [{ type: "character_points", character: "Rätselfuchs", value: 160 }, { type: "categories_tried", value: 6 }] } },
    { id: "baeckerfuchs", name: "Bäckerfuchs", img: "figures/baeckerfuchs.png", desc: "Frisch aus dem Wortschatz-Ofen — kennt sich mit Vokabeln bestens aus", unlock: { type: "combo", parts: [{ type: "points", value: 260 }, { type: "category_points", categories: ["wortschatz"], value: 20 }] } },
    { id: "naturfotograf", name: "Naturfotograf", img: "figures/naturfotograf.png", desc: "Hält Wortschatz-Momente fest — und auch ein eigenes Foto im Profil", unlock: { type: "combo", parts: [{ type: "character_points", character: "Naturfotograf", value: 220 }, { type: "profile_field", field: "gallery" }] } },
    { id: "studierfuchs", name: "Studierfuchs", img: "figures/studierfuchs.png", desc: "Fleißig am Lernen — hat schon viele Runden gespielt UND ordentlich Punkte gesammelt", unlock: { type: "combo", parts: [{ type: "games_played", value: 15 }, { type: "points", value: 300 }] } },
    { id: "malerfuchs", name: "Malerfuchs", img: "figures/malerfuchs.png", desc: "Kreativer Kopf — hat sein Profil mit einem eigenen Zitat oder Gedicht persönlich gestaltet UND schon in der Wortbaustelle geübt", unlock: { type: "combo", parts: [{ type: "profile_field", field: "poem" }, { type: "category_points", categories: ["wortbaustelle"], value: 10 }] } },
    { id: "abenteuerfuchs", name: "Abenteuer-Fuchs", img: "figures/abenteuerfuchs.png", desc: "Immer auf Entdeckungstour — hat „Es war einmal in Deutschland“ gelesen UND schon viele verschiedene Übungsarten ausprobiert", unlock: { type: "combo", parts: [{ type: "visited_section", section: "es-war-einmal" }, { type: "categories_tried", value: 8 }] } },
    { id: "schlummerfuchs", name: "Schlummerfuchs", img: "figures/schlummerfuchs.png", desc: "Wohlverdiente Ruhe nach dem Üben — entspannt am liebsten beim Memory, kommt dafür auch regelmäßig wieder", unlock: { type: "combo", parts: [{ type: "category_points", categories: ["memory"], value: 40 }, { type: "login_streak", value: 2 }] } },
    { id: "starfuchs", name: "Starfuchs", img: "figures/starfuchs.png", desc: "Steht im Rampenlicht — auf dem Weg nach ganz oben, mit einer stattlichen Trophäensammlung", unlock: { type: "combo", parts: [{ type: "points", value: 700 }, { type: "trophy_count", value: 4 }] } },
    { id: "feierfuchs", name: "Feierfuchs", img: "figures/feierfuchs.png", desc: "Feiert jeden Fortschritt — hat schon eine ganze Reihe Trophäen UND ordentlich Punkte gesammelt", unlock: { type: "combo", parts: [{ type: "trophy_count", value: 8 }, { type: "points", value: 500 }] } },
    { id: "absolventenfuchs", name: "Absolventenfuchs", img: "figures/absolventenfuchs.png", desc: "Großer Meilenstein erreicht — nachdem wirklich viele verschiedene Übungsarten ausprobiert wurden", unlock: { type: "combo", parts: [{ type: "points", value: 850 }, { type: "categories_tried", value: 10 }] } },
    { id: "championfuchs", name: "Champion-Fuchs", img: "figures/championfuchs.png", desc: "Die Krönung der Sammlung — mit beeindruckender Trophäensammlung", unlock: { type: "combo", parts: [{ type: "points", value: 1000 }, { type: "trophy_count", value: 10 }] } },
    { id: "steckbrieffuchs", name: "Steckbrief-Fuchs", img: "figures/professor-schlaufuchs.png", desc: "Hat sich richtig vorgestellt — mindestens 5 der wichtigsten Profil-Angaben ausgefüllt (Über mich, Geburtstag, Herkunft, Sprache, Lieblingssache …)", unlock: { type: "profile_fields_count", value: 5 } },
    { id: "gemeinschaftsfuchs", name: "Gemeinschaftsfuchs", img: "figures/pausenfuchs.png", desc: "Mittendrin statt nur dabei — hat mindestens 3 Freundschaften geschlossen UND einen Gästebuch-Eintrag hinterlassen", unlock: { type: "combo", parts: [{ type: "friends_count", value: 3 }, { type: "guestbook_entry", value: 1 }] } },
    { id: "superfuchs", name: "Superfuchs", img: "figures/superfuchs.png", desc: "Über allen Erwartungen — die absolute Spitze in jeder Hinsicht", unlock: { type: "combo", parts: [{ type: "points", value: 1200 }, { type: "trophy_count", value: 12 }, { type: "categories_tried", value: 12 }] } },
  ];
  // Das Sticker-Album ist von Anfang an auf mehrere KAPITEL ausgelegt — aktuell gibt es nur die
  // Füchse, aber künftige Sammelserien (z. B. saisonale Figuren zu Weihnachten) lassen sich hier
  // einfach als weiterer Eintrag ergänzen, ohne die Album-Seite selbst umbauen zu müssen.
  const COLLECTIBLE_CHAPTERS = [
    { id: "fuechse", title: "Die Füchse", emoji: "🦊", figures: COLLECTIBLE_FIGURES, active: true },
  ];
  // Orden (kleine, häufige Verdienste) vs. Pokale (große, seltene Meisterleistungen) — Trennung
  // anhand bekannter Top-Rang-Namen in der Trophäen-Bezeichnung selbst, ohne die bestehenden
  // Vergabestellen einzeln umbauen zu müssen.
  // WICHTIG: die beiden höchsten STUFEN heißen im echten Titel nur "Profi"/"Superheld" (OHNE
  // "Deutsch-"-Präfix, das nur in der Erklärtext-Prosa stand) — z. B. "Grammatik-Profi –
  // Superheld". Die Suche nach "Deutsch-Profi"/"Deutsch-Superheld" traf deshalb praktisch nie zu,
  // weshalb fast alles fälschlich als Orden statt Pokal zählte. Jetzt wird gezielt der STUFEN-Teil
  // nach dem " – "-Trennzeichen geprüft (nicht einfach "Profi" irgendwo im Titel — das träfe sonst
  // auch den CHARAKTER-Teil wie "Grammatik-Profi" selbst, unabhängig von der echten Stufe).
  const TOP_TIER_STAGE_NAMES = ["Profi", "Superheld"];
  const TOP_TIER_KEYWORDS = ["Superhirn", "Champion", "Sprachtalent"];
  function trophyKind(label) {
    const stage = label.includes(" – ") ? label.split(" – ").slice(-1)[0] : "";
    if (TOP_TIER_STAGE_NAMES.some((s) => stage === s)) return "pokal";
    return TOP_TIER_KEYWORDS.some((k) => label.includes(k)) ? "pokal" : "orden";
  }
  function trophyCounts(profile) {
    const list = profile?.trophies || [];
    const pokale = list.filter((t) => trophyKind(t) === "pokal").length;
    const orden = list.length - pokale;
    return { orden, pokale };
  }
  function isFigureUnlocked(fig, profile) {
    if (!profile) return false;
    if ((profile.collectedFigures || []).includes(fig.id)) return true;
    if (isUnlocked(fig.unlock, profile)) return true;
    // Bonus: Ab 5 Orden gibt es unabhängig vom Punktestand zusätzlich eine Sammelfigur geschenkt
    // (den "Kleinen Lernfuchs" — als Belohnung fürs regelmäßige Dranbleiben, nicht nur fürs
    // Punktesammeln).
    if (fig.id === "kleiner-lernfuchs" && trophyCounts(profile).orden >= 5) return true;
    return false;
  }
  // Eine einzelne Fuchs-Sammelfigur-Kachel — zentral an EINER Stelle gebaut und an allen
  // Anzeige-Orten (Vitrine, Sticker-Album-Vorschau, Missionen, Detail-Ansicht) verwendet, statt
  // mehrfach dieselbe Logik zu duplizieren. Vorher hatten mehrere dieser Stellen KEINE
  // Fortschritts-Füllanzeige, nur die zentrale Vitrine — dort blieb eine gesperrte Figur auch bei
  // z. B. 90% Fortschritt komplett grau/ungefüllt.
  function figureTileHtml(fig, profile, size) {
    const unlocked = isFigureUnlocked(fig, profile);
    const progress = unlocked ? 1 : unlockProgressFraction(fig.unlock, profile);
    // Mindestens eine kleine, sichtbare Abdeckung bleibt, solange die Figur NICHT freigeschaltet
    // ist — auch bei (fast) 100% berechnetem Fortschritt, damit eine gesperrte Figur nie komplett
    // unverdeckt/freigeschaltet aussieht, nur mit dem Schloss-Symbol darüber (widersprüchlich).
    const missingPercent = unlocked ? 0 : Math.max(4, Math.round((1 - progress) * 100));
    const sizeStyle = size ? `width:${size}px; height:${size}px; object-fit:contain;` : "";
    return `<div class="figure-slot ${unlocked ? "" : "figure-locked"}" ${unlocked ? `data-figure-detail="${fig.id}"` : ""} title="${unlocked ? fig.name + " — " + fig.desc : "Gesperrt — " + unlockShortText(fig.unlock) + (progress > 0 ? ` (${Math.round(progress * 100)}% geschafft)` : "")}">
      <img src="${fig.img}" alt="${fig.name}" loading="lazy" style="${sizeStyle}" />
      ${!unlocked ? `<div class="figure-fill-mask" style="height:${missingPercent}%;"></div>` : ""}
      ${unlocked ? "" : '<span class="figure-lock-icon">🔒</span>'}
    </div>`;
  }

  const THEMES = [
    { id: "bastelheft", name: "Bastelheft", emoji: "✂️", desc: "Hell, Papier & Washi-Tape, verspielte Candyfarben.", mode: "hell" },
    { id: "flickenteppich", name: "Flickenteppich", emoji: "🧵", desc: "Kräftige Patchwork-Farben, dicke verspielte Outlines.", mode: "hell" },
    { id: "wollknaeuel", name: "Wollknäuel", emoji: "🧶", desc: "Kuschelig-gestrickt, warme Herbstfarben.", mode: "hell" },
    { id: "papierfalz", name: "Papierfalz", emoji: "🕊️", desc: "Ruhig, gefaltetes Papier, gedeckte Erdtöne.", mode: "hell" },
    { id: "kirmes", name: "Kirmes", emoji: "🎡", desc: "Bunt & fröhlich wie ein deutscher Jahrmarkt.", mode: "hell" },
    { id: "wiesenblume", name: "Wiesenblume", emoji: "🌼", desc: "Sanft, pastellig, frühlingshaft-verspielt.", mode: "hell" },
    { id: "ozeanbrise", name: "Ozeanbrise", emoji: "🐚", desc: "Hell, frisch, maritim-verspielt.", mode: "hell" },
    { id: "nachtflicken", name: "Nachtflicken", emoji: "🦇", desc: "Dunkel & verspielt, Neon-Filzpatches auf tiefem Lila.", mode: "dunkel" },
    { id: "sternennacht", name: "Sternennacht", emoji: "✨", desc: "Dunkelblau mit goldenem Funkeln, verträumt.", mode: "dunkel" },
    { id: "mitternachtskarneval", name: "Mitternachtskarneval", emoji: "🎭", desc: "Dunkel, bunt & partytauglich.", mode: "dunkel" },
    { id: "tiefsee", name: "Tiefsee-Atelier", emoji: "🐙", desc: "Dunkles Smaragdgrün, edel-verspielt.", mode: "dunkel", unlock: { type: "points", value: 100 } },
    { id: "vulkanglut", name: "Vulkanglut", emoji: "🌋", desc: "Dunkel & feurig-orange, kraftvoll-verspielt.", mode: "dunkel", unlock: { type: "points", value: 250 } },
    { id: "mondgarten", name: "Mondgarten", emoji: "🌙", desc: "Dunkles Violett, ruhig-verträumt.", mode: "dunkel", unlock: { type: "points", value: 500 } },
    { id: "disconacht", name: "Disco Nacht", emoji: "🪩", desc: "Dunkel mit Laserstrahlen & Discokugel — 80er/90er-Flair.", mode: "dunkel", unlock: { type: "points", value: 350 } },
    { id: "discokugel", name: "Discokugel", emoji: "🪩", desc: "Helle, verspielte Disco-Optik mit hohem Kontrast.", mode: "hell", unlock: { type: "points", value: 350 } },
    { id: "retroarkade", name: "Retro-Arkade", emoji: "👾", desc: "Dunkel, Neon-Pixel-verspielt.", mode: "dunkel", unlock: { type: "trophy", match: "Gehirnjogger" } },
    { id: "lavendelfeld", name: "Lavendelfeld", emoji: "🪻", desc: "Hell, zartlila, ruhig-verspielt.", mode: "hell", unlock: { type: "points", value: 750 } },
    { id: "zitrusgarten", name: "Zitrusgarten", emoji: "🍋", desc: "Hell, sonnig-frisch, verspielt.", mode: "hell", unlock: { type: "trophy", match: "Steckbrief" } },
    { id: "obsidian", name: "Obsidian-Schmiede", emoji: "⚒️", desc: "Dunkel, metallisch-warm, edel.", mode: "dunkel", unlock: { type: "points", value: 1000 } },
    { id: "tiefseeneon", name: "Tiefsee-Neon", emoji: "🐡", desc: "Dunkel, elektrisch-verspielt.", mode: "dunkel", unlock: { type: "trophy", match: "Vorstellungsrunde" } },
    { id: "winterzauber", name: "Winterzauber", emoji: "❄️", desc: "Dunkel, mit fallendem Schnee — animiert!", mode: "dunkel", unlock: { type: "points", value: 1500 } },
    { id: "wellenspiel", name: "Wellenspiel", emoji: "🌊", desc: "Hell, mit sanft bewegten Wellen — animiert!", mode: "hell", unlock: { type: "trophy", match: "Superheld" } },
    { id: "honigwabe", name: "Honigwabe", emoji: "🍯", desc: "Hell, warmes Gelb-Braun, gemütlich.", mode: "hell", unlock: { type: "points", value: 300 } },
    { id: "galaxie", name: "Galaxie", emoji: "🌌", desc: "Dunkel, tiefviolett mit Sternenstaub.", mode: "dunkel", unlock: { type: "points", value: 2000 } },
    { id: "leuchtkaefer", name: "Leuchtkäfer", emoji: "✨", desc: "Dunkel, mit sanft schwebenden Lichtpunkten — animiert!", mode: "dunkel", unlock: { type: "trophy", match: "Gehirnjogger" } },
    { id: "kirschbluete", name: "Kirschblüte", emoji: "🌸", desc: "Hell, zartrosa mit fallenden Blütenblättern — animiert!", mode: "hell", unlock: { type: "points", value: 400 } },
    { id: "morgentau", name: "Morgentau", emoji: "🍃", desc: "Hell, frisches Mintgrün.", mode: "hell" },
    { id: "sandduene", name: "Sanddüne", emoji: "🏜️", desc: "Hell, warme Wüstentöne.", mode: "hell", unlock: { type: "points", value: 600 } },
    { id: "seifenblase", name: "Seifenblase", emoji: "🫧", desc: "Hell, verspielt mit schwebenden Blasen — animiert!", mode: "hell", unlock: { type: "points", value: 900 } },
    { id: "schattenreich", name: "Schattenreich", emoji: "🌫️", desc: "Dunkel, tiefes Anthrazit mit wanderndem Nebel — animiert!", mode: "dunkel", unlock: { type: "points", value: 1200 } },
    { id: "bernsteinglut", name: "Bernsteinglut", emoji: "🔥", desc: "Dunkel, warmes Kupfer-Braun.", mode: "dunkel" },
    { id: "polarlicht", name: "Polarlicht", emoji: "🌌", desc: "Dunkel, mit wandernden Aurora-Streifen — animiert!", mode: "dunkel", unlock: { type: "points", value: 1600 } },
    { id: "eulennacht", name: "Eulennacht", emoji: "🦉", desc: "Dunkel, tiefblau, ruhig.", mode: "dunkel", unlock: { type: "trophy", match: "Wissenschaftler" } },
    { id: "regenbogenstrasse", name: "Regenbogenstraße", emoji: "🌈", desc: "Hell, mit wanderndem Farbschimmer — animiert!", mode: "hell", unlock: { type: "points", value: 250 } },
    { id: "moosgarten", name: "Moosgarten", emoji: "🌿", desc: "Hell, ruhiges Waldgrün.", mode: "hell" },
    { id: "konfettiregen", name: "Konfettiregen", emoji: "🎉", desc: "Hell, verspielt mit fallendem Konfetti — animiert!", mode: "hell", unlock: { type: "trophy", match: "Abenteurer" } },
    { id: "zitronenlimonade", name: "Zitronenlimonade", emoji: "🍋", desc: "Hell, frisches Gelb.", mode: "hell", unlock: { type: "points", value: 350 } },
    { id: "sternenstaubneon", name: "Sternenstaub-Neon", emoji: "💫", desc: "Dunkel, mit pulsierenden Neonpunkten — animiert!", mode: "dunkel", unlock: { type: "points", value: 800 } },
    { id: "tintenfischtiefe", name: "Tintenfisch-Tiefe", emoji: "🐙", desc: "Dunkel, marineblau-violett.", mode: "dunkel" },
    { id: "lagerfeuer", name: "Lagerfeuer", emoji: "🔥", desc: "Dunkel, mit flackerndem Glutschein — animiert!", mode: "dunkel", unlock: { type: "points", value: 1400 } },
    { id: "mitternachtsgarten", name: "Mitternachtsgarten", emoji: "🌙", desc: "Dunkel, tiefgrün mit Mondlicht.", mode: "dunkel", unlock: { type: "points", value: 1800 } },
    { id: "papierlaterne", name: "Papierlaterne", emoji: "🏮", desc: "Hell, warmes Reispapier mit sanftem Glühen — animiert!", mode: "hell", unlock: { type: "points", value: 450 } },
    { id: "pfirsichgarten", name: "Pfirsichgarten", emoji: "🍑", desc: "Hell, sanftes Apricot.", mode: "hell" },
    { id: "schmetterlingswiese", name: "Schmetterlingswiese", emoji: "🦋", desc: "Hell, mit flatternden Farbtupfern — animiert!", mode: "hell", unlock: { type: "trophy", match: "Logiker" } },
    { id: "lavendeldunst", name: "Lavendeldunst", emoji: "💜", desc: "Hell, zartlila-grau.", mode: "hell", unlock: { type: "points", value: 700 } },
    { id: "vulkanasche", name: "Vulkanasche", emoji: "🌋", desc: "Dunkel, mit treibenden Glutfunken — animiert!", mode: "dunkel", unlock: { type: "points", value: 1000 } },
    { id: "mondstein", name: "Mondstein", emoji: "🌘", desc: "Dunkel, silbrig-blau, ruhig.", mode: "dunkel" },
    { id: "samtnacht", name: "Samtnacht", emoji: "🥀", desc: "Dunkel, tiefweinrot mit weichem Schimmer — animiert!", mode: "dunkel", unlock: { type: "points", value: 2200 } },
    { id: "bergsee", name: "Bergsee", emoji: "🏔️", desc: "Dunkel, tiefes Türkis-Blau.", mode: "dunkel", unlock: { type: "trophy", match: "Superheld" } },
    { id: "kamillenfeld", name: "Kamillenfeld", emoji: "🌼", desc: "Hell, sanftes Creme-Gelb, beruhigend.", mode: "hell", unlock: { type: "points", value: 550 } },
    { id: "honigtropfen", name: "Honigtropfen", emoji: "🍯", desc: "Hell, warmes Bernstein-Gold, tropfend — animiert!", mode: "hell", unlock: { type: "points", value: 350 } },
    { id: "minzblatt", name: "Minzblatt", emoji: "🌱", desc: "Hell, klares Frischgrün.", mode: "hell" },
    { id: "sonnenuntergang", name: "Sonnenuntergang", emoji: "🌇", desc: "Hell, wandelnder Abendhimmel — animiert!", mode: "hell", unlock: { type: "points", value: 500 } },
    { id: "marzipan", name: "Marzipan", emoji: "🧁", desc: "Hell, cremiges Rosé-Beige.", mode: "hell", unlock: { type: "trophy", match: "Sprachkünstler" } },
    { id: "sternenschiff", name: "Sternenschiff", emoji: "🚀", desc: "Dunkel, mit vorbeiziehenden Sternschnuppen — animiert!", mode: "dunkel", unlock: { type: "points", value: 1100 } },
    { id: "russischrot", name: "Russischrot", emoji: "🍷", desc: "Dunkel, edles Bordeaux.", mode: "dunkel" },
    { id: "nordlichtfjord", name: "Nordlichtfjord", emoji: "🏞️", desc: "Dunkel, mit driftendem Nebel über Wasser — animiert!", mode: "dunkel", unlock: { type: "points", value: 1300 } },
    { id: "kupferkessel", name: "Kupferkessel", emoji: "🫖", desc: "Dunkel, warmes Metallic-Kupfer.", mode: "dunkel", unlock: { type: "points", value: 2000 } },
    { id: "aquarium", name: "Aquarium", emoji: "🐠", desc: "Dunkel, mit echten schwimmenden Fischen und Luftblasen — animiert!", mode: "dunkel", unlock: { type: "points", value: 650 } },
    { id: "korallenriff", name: "Korallenriff", emoji: "🪸", desc: "Dunkel, wärmere Fische über Korallen — animiert!", mode: "dunkel", unlock: { type: "trophy", match: "Abenteurer" } },
    { id: "seerosenteich", name: "Seerosenteich", emoji: "🪷", desc: "Hell, ruhiges Wasser mit Seerosen — animiert!", mode: "hell", unlock: { type: "points", value: 750 } },
    { id: "mandelbluete", name: "Mandelblüte", emoji: "🌰", desc: "Hell, zartweiß-rosa.", mode: "hell" },
    { id: "spukwald", name: "Spukwald", emoji: "🌲", desc: "Dunkel, knorrige Bäume im Wind mit Gewitter und Regen — animiert!", mode: "dunkel", unlock: { type: "trophy", match: "Gehirnjogger" } },
    { id: "weihnachtszauber", name: "Weihnachtszauber", emoji: "🎄", desc: "Dunkel, mit fallendem Schnee und Lichterkette — animiert!", mode: "dunkel", unlock: { type: "points", value: 300 } },
    { id: "osterwiese", name: "Osterwiese", emoji: "🐣", desc: "Hell, mit bemalten Ostereiern im Gras — animiert!", mode: "hell", unlock: { type: "points", value: 300 } },
    { id: "halloweennacht", name: "Halloweennacht", emoji: "🎃", desc: "Dunkel, mit leuchtenden Kürbissen und Fledermäusen — animiert!", mode: "dunkel", unlock: { type: "points", value: 600 } },
    { id: "adventsstube", name: "Adventsstube", emoji: "🕯️", desc: "Hell, warmes Kerzenlicht und Zimtton.", mode: "hell", unlock: { type: "points", value: 200 } },
  ];
  // Bewusste, begründete Ausnahme von "alles im Profil": im AUSGELOGGTEN Zustand gibt es gar kein
  // Profil, an das sich ein Design binden ließe — hier ist geräte-lokale Speicherung die einzig
  // sinnvolle Möglichkeit, damit die Seite "draußen" nicht bei jedem Besuch aufs Standarddesign
  // zurückfällt. Sobald jemand eingeloggt ist, übernimmt wie gehabt ausschließlich das Profil.
  let sessionTheme = "bastelheft";
  try { sessionTheme = localStorage.getItem("dma_logged_out_theme") || "bastelheft"; } catch (e) {}

  function applyTheme(id) {
    document.documentElement.setAttribute("data-theme", id);
    // Geräte-lokaler Rückfallwert wird IMMER mitgeführt, egal ob gerade eingeloggt oder nicht —
    // damit ein Design, das man EINGELOGGT gewählt hat, auch nach einem (ungewollten) Logout auf
    // demselben Gerät weiter angezeigt wird, statt aufs Standarddesign zurückzufallen.
    try { localStorage.setItem("dma_logged_out_theme", id); } catch (e) {}
    const profile = Backend.currentProfile();
    if (profile) {
      profile.theme = id;
      Backend.saveThemePreference(id);
    } else {
      sessionTheme = id;
    }
  }

  function isUnlocked(unlock, profile) {
    if (!unlock) return true;
    if (!profile) return false;
    if (unlock.type === "points") return profile.points >= unlock.value;
    if (unlock.type === "trophy") return (profile.trophies || []).some((tr) => tr.includes(unlock.match));
    // Punkte, die spezifisch aus Übungen EINES bestimmten thematischen Fuchs-Charakters stammen —
    // nicht der Gesamtpunktestand. Macht Missionen individueller: "Zeitfuchs" verlangt wirklich
    // Übung mit Zeitformen, nicht nur irgendein Punktesammeln.
    if (unlock.type === "character_points") {
      const sum = (profile.history || []).filter((h) => h.character === unlock.character)
        .reduce((s, h) => s + Math.round((h.points || 0) + (h.bonus || 0)), 0);
      return sum >= unlock.value;
    }
    // Ein bestimmtes Profil-Feld muss ausgefüllt sein (z. B. "languages" für den Sprachenfuchs) —
    // belohnt das Vervollständigen des eigenen Profils passend zum jeweiligen Fuchs-Thema.
    if (unlock.type === "profile_field") {
      const val = profile[unlock.field];
      return Array.isArray(val) ? val.length > 0 : Boolean(val && String(val).trim());
    }
    // Mindestens X VERSCHIEDENE Kategorien ausprobiert (nicht nur eine Kategorie oft gespielt) —
    // belohnt echtes Entdecken/Ausprobieren, passend zum "Abenteuer"-Thema.
    if (unlock.type === "categories_tried") {
      const distinct = new Set();
      (profile.history || []).forEach((h) => (h.categories || []).forEach((c) => distinct.add(c)));
      return distinct.size >= unlock.value;
    }
    // Login-Serie über mehrere Tage am Stück (nutzt denselben Streak-Wert wie die Meilenstein-
    // Erkennung) — belohnt regelmäßiges Vorbeischauen statt nur viel Punktesammeln auf einmal.
    if (unlock.type === "login_streak") {
      const streak = (profile.extraProfileData && profile.extraProfileData.calendarStreak) || 0;
      return streak >= unlock.value;
    }
    // Anzahl gesammelter Trophäen insgesamt (Orden + Pokale) — direkt im Profil verfügbar.
    if (unlock.type === "trophy_count") return (profile.trophies || []).length >= unlock.value;
    // Anzahl gespielter Runden insgesamt (jede gespeicherte Ergebnis-Zeile zählt) — belohnt
    // Fleiß/Ausdauer statt nur einer hohen Punktzahl auf einmal.
    if (unlock.type === "games_played") return (profile.history || []).length >= unlock.value;
    // Mindestens einen eigenen Song zur Playlist hinzugefügt — im extraProfileData mitgezählt
    // (siehe addPlaylistSong), da eine Live-Datenbankabfrage hier zu aufwendig wäre.
    if (unlock.type === "songs_added") return ((profile.extraProfileData && profile.extraProfileData.songsAddedCount) || 0) >= unlock.value;
    // Mindestens einen eigenen Gästebuch-Eintrag hinterlassen — echte Interaktivität, nicht nur
    // Punkte sammeln (siehe addGuestbookEntry, das guestbookEntriesCount hochzählt).
    if (unlock.type === "guestbook_entry") return ((profile.extraProfileData && profile.extraProfileData.guestbookEntriesCount) || 0) >= unlock.value;
    // Wie "character_points", aber über die KATEGORIE-ID statt den Charakter-Namen geprüft — für
    // Spiele mit eigenem Charakter-Namen (z. B. Wackelturm = "Turmbaumeister:in"). Erlaubt auch
    // mehrere Kategorien gleichzeitig (z. B. mehrere "aktive" Spiele zusammen für Fitnessfuchs).
    if (unlock.type === "category_points") {
      const cats = Array.isArray(unlock.categories) ? unlock.categories : [unlock.categories];
      const sum = (profile.history || []).filter((h) => (h.categories || []).some((c) => cats.includes(c)))
        .reduce((s, h) => s + Math.round((h.points || 0) + (h.bonus || 0)), 0);
      return sum >= unlock.value;
    }
    // Besuch einer bestimmten Sektion (z. B. "Es war einmal in Deutschland") — wird automatisch
    // erkannt, sobald die Person dort einmal war, kein extra Knopf zum "Ich hab's gelesen" nötig.
    if (unlock.type === "visited_section") {
      const visited = (profile.extraProfileData && profile.extraProfileData.visitedSections) || [];
      return visited.includes(unlock.section);
    }
    // Mindestens X der wichtigsten Profil-Felder gleichzeitig ausgefüllt (Bio, Geburtstag,
    // Herkunft, mindestens eine Sprache, Lieblingsfilm/-serie/-song, ein eigenes Foto) — belohnt
    // ein wirklich VOLLSTÄNDIGES Profil, nicht nur ein einzelnes Feld wie bei profile_field.
    if (unlock.type === "profile_fields_count") {
      const extra = profile.extraProfileData || {};
      const filled = [
        profile.bio, profile.birthday, profile.origin,
        Array.isArray(profile.languages) && profile.languages.length > 0,
        profile.favMovie, profile.favSeries, profile.favSong,
        Array.isArray(extra.gallery) && extra.gallery.length > 0,
      ].filter(Boolean).length;
      return filled >= unlock.value;
    }
    // Community-Aktivität: eine bestimmte Anzahl an Freundschaften — belohnt echtes Vernetzen mit
    // anderen, nicht nur alleiniges Punktesammeln.
    if (unlock.type === "friends_count") {
      return ((profile.extraProfileData && profile.extraProfileData.friendsCountCache) || 0) >= unlock.value;
    }
    // Kombinations-Mission: MEHRERE unabhängige Teilbedingungen müssen ALLE gleichzeitig erfüllt
    // sein — z. B. "spiele eine schwere Abenteuer-Runde UND ein Memory-Spiel UND fülle dein Profil
    // aus". Motiviert, verschiedene Ecken der Seite zu erkunden, statt nur stur Punkte zu farmen.
    if (unlock.type === "combo") {
      return (unlock.parts || []).every((part) => isUnlocked(part, profile));
    }
    return true;
  }
  // Wie WEIT eine (noch gesperrte) Freischalt-Bedingung schon erfüllt ist, als Bruchteil von 0
  // bis 1 — für die "Sticker füllt sich langsam" -Anzeige. Bei numerischen Bedingungen (Punkte,
  // Anzahl gespielter Runden usw.) echter Fortschritt; bei reinen Ja/Nein-Bedingungen (z. B. ein
  // bestimmtes Profilfeld ausgefüllt) nur 0 oder 1, da es dort keine Zwischenstufe gibt. Bei
  // Kombinationen der DURCHSCHNITT aller Teile, damit auch teilweise erledigte Kombis sichtbar
  // vorankommen.
  function unlockProgressFraction(unlock, profile) {
    if (!unlock || !profile) return isUnlocked(unlock, profile) ? 1 : 0;
    const ratio = (current, needed) => needed > 0 ? Math.max(0, Math.min(1, current / needed)) : 1;
    if (unlock.type === "points") return ratio(profile.points, unlock.value);
    if (unlock.type === "character_points") {
      const sum = (profile.history || []).filter((h) => h.character === unlock.character)
        .reduce((s, h) => s + Math.round((h.points || 0) + (h.bonus || 0)), 0);
      return ratio(sum, unlock.value);
    }
    if (unlock.type === "categories_tried") {
      const distinct = new Set();
      (profile.history || []).forEach((h) => (h.categories || []).forEach((c) => distinct.add(c)));
      return ratio(distinct.size, unlock.value);
    }
    if (unlock.type === "login_streak") {
      const streak = (profile.extraProfileData && profile.extraProfileData.calendarStreak) || 0;
      return ratio(streak, unlock.value);
    }
    if (unlock.type === "trophy_count") return ratio((profile.trophies || []).length, unlock.value);
    if (unlock.type === "games_played") return ratio((profile.history || []).length, unlock.value);
    if (unlock.type === "songs_added") return ratio((profile.extraProfileData && profile.extraProfileData.songsAddedCount) || 0, unlock.value);
    if (unlock.type === "guestbook_entry") return ratio((profile.extraProfileData && profile.extraProfileData.guestbookEntriesCount) || 0, unlock.value);
    if (unlock.type === "category_points") {
      const cats = Array.isArray(unlock.categories) ? unlock.categories : [unlock.categories];
      const sum = (profile.history || []).filter((h) => (h.categories || []).some((c) => cats.includes(c)))
        .reduce((s, h) => s + Math.round((h.points || 0) + (h.bonus || 0)), 0);
      return ratio(sum, unlock.value);
    }
    if (unlock.type === "combo") {
      const parts = unlock.parts || [];
      if (!parts.length) return isUnlocked(unlock, profile) ? 1 : 0;
      return parts.reduce((sum, part) => sum + unlockProgressFraction(part, profile), 0) / parts.length;
    }
    // Reine Ja/Nein-Bedingungen (profile_field, trophy, visited_section) — kein Zwischenstand.
    return isUnlocked(unlock, profile) ? 1 : 0;
  }
  // Kurzer, klarer Erklärungstext für die jeweilige Freischaltbedingung — direkt auf der Kachel
  // sichtbar, nicht erst nach dem Antippen. Zweiter, ausführlicherer Text fürs Detail-Popup.
  function unlockShortText(unlock) {
    if (!unlock) return "";
    if (unlock.type === "points") return `ab ${unlock.value} Punkten`;
    if (unlock.type === "trophy") return "besonderer Pokal nötig";
    if (unlock.type === "character_points") return `${unlock.value} Pkt. bei „${unlock.character}"-Aufgaben`;
    if (unlock.type === "profile_field") return "Profil-Feld ausfüllen";
    if (unlock.type === "categories_tried") return `${unlock.value} verschiedene Kategorien ausprobieren`;
    if (unlock.type === "login_streak") return `${unlock.value} Tage am Stück einloggen`;
    if (unlock.type === "trophy_count") return `${unlock.value} Trophäen sammeln`;
    if (unlock.type === "games_played") return `${unlock.value} Runden spielen`;
    if (unlock.type === "songs_added") return "einen Song zur Playlist hinzufügen";
    if (unlock.type === "guestbook_entry") return "einen Gästebuch-Eintrag hinterlassen";
    if (unlock.type === "category_points") return `${unlock.value} Pkt. in bestimmten Spielen`;
    if (unlock.type === "visited_section") return `„Es war einmal in Deutschland" lesen`;
    if (unlock.type === "combo") return `Kombination: ${(unlock.parts || []).map((p) => unlockShortText(p)).join(" + ")}`;
    return "";
  }
  // Zentrale Liste aller bekannten Freigabe-Schalter — bei jedem neuen, noch zu prüfenden Feature
  // kommt hier ein weiterer Eintrag dazu. So hat die Admin-Oberfläche IMMER eine vollständige
  // Übersicht, auch wenn ein Schalter noch nie umgelegt wurde.
  // Vorlagen-Texte für die Punkte-Vergabe im Postfach — spart dem Betreiber das wiederholte
  // Eintippen bei häufigen Anlässen, bleibt danach trotzdem frei editierbar.
  const POINTS_REASON_TEMPLATES = [
    { label: "🪲 Bug gemeldet & geholfen", text: "Danke für deine Mithilfe, Bugs zu finden und zu fixen — das bringt die ganze Seite weiter!" },
    { label: "⏳ Entschädigung für Wartezeit", text: "Als kleine Entschädigung für die Wartezeit durch ein technisches Problem auf der Seite." },
    { label: "🎂 Geburtstag", text: "Alles Gute zum Geburtstag! 🎉" },
    { label: "📣 Jemanden geworben", text: "Danke, dass du die Seite weiterempfohlen hast!" },
    { label: "💬 Aktiv in der Community", text: "Für deine tolle, aktive Mitwirkung in der Community!" },
    { label: "📈 Im Ranking aufgestiegen", text: "Glückwunsch zum Aufstieg im Ranking — weiter so!" },
  ];
  const KNOWN_FEATURE_FLAGS = [
    { key: "demo_test_schalter", label: "🧪 Test-Schalter (Beispiel)", desc: "Dient nur zum Ausprobieren des Freigabe-Systems selbst — hat keine echte Funktion." },
    { key: "wortkanone_redesign", label: "🎯 Wort-Kanone (Neugestaltung)", desc: "Sequentielles Fallen, echte SVG-Kanone mit Zielrichtung, Explosions-Effekte, Rot/Grün-Landefeedback. Bis zur Freigabe sehen andere eine 'Wird gerade verbessert'-Meldung statt des Spiels." },
    { key: "wortblasen_neu", label: "🫧 Wortblasen (neues Spiel)", desc: "Mehrere Wort-Sprechblasen erscheinen gleichzeitig und zerplatzen — die richtige muss rechtzeitig getroffen werden. Bis zur Freigabe sehen andere eine 'Kommt bald'-Meldung statt des Spiels." },
    { key: "vokabelmeister_neu", label: "🔤 Vokabelmeister (neues Spiel)", desc: "Buchstabe wählen, dann 60 Sekunden Zeit für möglichst viele passende Wörter. Bis zur Freigabe sehen andere eine 'Kommt bald'-Meldung statt des Spiels." },
    { key: "korrektour_neu", label: "🚂 Korrektour (neues Spiel)", desc: "Satz-Zug fährt im Bogen durchs Bild — per Ampel-Signal entscheiden, ob der Satz richtig ist. Bis zur Freigabe sehen andere eine 'Kommt bald'-Meldung statt des Spiels." },
    { key: "musikplayer_update", label: "🎵 Musikplayer-Update", desc: "Wellenform-Anzeige, Schnellliste (☰), MP3-Symbol im Video-Bereich. Bis zur Freigabe sehen andere Nutzer:innen den Player ohne diese neuen Elemente (die eigentlichen Stabilitäts-Fixes — Song hängt sich nicht mehr auf, Layout-Wechsel startet Song nicht neu — gelten unabhängig davon bereits für alle, da das reine Fehlerbehebungen waren)." },
  ];
  // Kleiner Freigabe-Schalter DIREKT AM ORT des jeweiligen Features (statt nur zentral in den
  // Einstellungen) — nur für Betreiber/Admins sichtbar. So kann man ein Feature genau dort
  // freigeben, wo man es gerade testet, ohne erst umständlich in die Einstellungen zu wechseln.
  // Die zentrale Liste in den Einstellungen bleibt zusätzlich bestehen, für den Gesamtüberblick.
  // Zentrale Empfehlungs-Link-Funktion — von mehreren Stellen aus aufrufbar (Einstellungen UND
  // Freunde-Bereich), damit der Link unmissverständlich leicht auffindbar ist, nicht nur in den
  // technischen Einstellungen versteckt.
  async function shareReferralLink() {
    const user = Backend.currentUser();
    const profile = Backend.currentProfile();
    const shareText = "Ich lerne gerade Deutsch mit dieser tollen Seite — schau doch auch mal vorbei! Über meinen Link bekommen wir beide 25 Bonuspunkte 🦊";
    // Personalisierter Empfehlungs-Link: die ID bleibt die technisch verlässliche Grundlage (löst
    // beim Registrieren automatisch den 25-Punkte-Bonus aus, siehe applyReferralBonus) — zusätzlich
    // steht der Name lesbar mit in der Adresse, statt nur kryptischer Zeichen. Der Name ist rein
    // kosmetisch: sollte später jemand mit demselben Namen registriert sein, bleibt der Link über
    // die ID trotzdem eindeutig einer bestimmten Person zugeordnet.
    const shareUrl = window.location.origin + window.location.pathname + (user ? `?ref=${user.id}&refname=${encodeURIComponent(profile?.name || "")}` : "");
    Backend.recordSiteShare();
    if (navigator.share) {
      try { await navigator.share({ title: "Deutsch mit Alex", text: shareText, url: shareUrl }); }
      catch (e) { /* Person hat den Teilen-Dialog einfach abgebrochen -- kein Fehler */ }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        showToast("🔗 Link in die Zwischenablage kopiert — jetzt irgendwo einfügen und verschicken!");
      } catch (e) {
        alert(`${shareText}\n${shareUrl}`);
      }
    }
  }
  function inlineFeatureFlagToggleHtml(flagKey, defaultTrue) {
    if (!Backend.canModerate || !Backend.canModerate()) return "";
    // WICHTIG — bei "default true"-Flags (siehe Backend.isFeatureOnDefaultTrue, für längst
    // etablierte Spiele wie Satzpuzzle/Wackelturm) bedeutet ein noch nie gesetzter Rohwert, dass
    // das Spiel TROTZDEM schon für alle sichtbar ist — anders als bei ganz neuen "Kommt
    // bald"-Features, wo derselbe Rohzustand "nur für dich" bedeutet. Ohne diese Unterscheidung
    // hätte die Checkbox hier fälschlich "aus" angezeigt, obwohl das Spiel längst live ist.
    const raw = Backend.getRawFeatureFlagValue(flagKey);
    const on = defaultTrue ? (raw === false ? false : true) : Boolean(raw);
    return `<label class="empty-note" style="display:flex; align-items:center; gap:6px; margin:8px 0; padding:8px; border:1px dashed var(--teal-400,#5ba8a0); border-radius:8px; cursor:pointer;">
      <input type="checkbox" class="inline-feature-flag-toggle" data-flag-key="${flagKey}" ${on ? "checked" : ""} />
      <span>🚦 <strong>Update-Freigabe:</strong> ${on ? "Für alle Nutzer:innen live" : "Nur für dich als Test sichtbar"} — hier umschalten, um dieses Update in die Welt zu bringen (oder wieder zurückzuziehen)</span>
    </label>
    <div class="beta-invite-box" data-beta-invite-flag="${flagKey}" style="margin:4px 0 8px; padding:8px; border:1px dashed rgba(242,184,75,0.5); border-radius:8px;">
      <button type="button" class="emoji-toggle-link beta-invite-toggle" style="font-size:0.78rem;">🧪 Beta-Tester:in für dieses Update einladen</button>
      <div class="beta-invite-search-body" style="display:none; margin-top:8px;">
        <input type="text" class="beta-invite-search-input" placeholder="Name suchen…" style="width:100%; padding:8px; border-radius:6px; border:1px solid rgba(0,0,0,0.15);" />
        <div class="beta-invite-results" style="margin-top:6px;"></div>
      </div>
    </div>`;
  }
  // Gemeinsame Anzeige-Funktion für Beta-Tester-Vorschläge/Suchergebnisse — verwendet sowohl beim
  // ersten Öffnen (Vorschlagsliste) als auch beim Tippen im Suchfeld (gefilterte Ergebnisse).
  function renderBetaInviteResults(list, results, input) {
    results.innerHTML = list.length ? list.map((u) => `
      <button type="button" class="breakdown-row beta-invite-pick" data-beta-invite-userid="${u.id}" data-beta-invite-username="${u.name}" style="width:100%; text-align:left; cursor:pointer; background:none; border:none; font:inherit; color:inherit;">
        <span>${u.is_beta_tester ? "🧪 " : ""}${u.name}</span>
        <span class="empty-note">${u.is_beta_tester ? "schon Beta-Tester:in" : "einladen →"}</span>
      </button>`).join("") : `<p class="empty-note">Niemanden gefunden.</p>`;
    results.querySelectorAll("[data-beta-invite-userid]").forEach((row) => {
      row.addEventListener("click", async () => {
        try {
          await Backend.setBetaTesterStatus(row.dataset.betaInviteUserid, true);
          await Backend.sendSystemMessage(row.dataset.betaInviteUserid, "🧪 Du wurdest als Beta-Tester:in eingeladen! Du siehst jetzt neue Funktionen, bevor sie für alle freigegeben werden — probier sie gern aus und gib Rückmeldung.");
          showToast(`🧪 ${row.dataset.betaInviteUsername} als Beta-Tester:in eingeladen!`);
          row.querySelector(".empty-note").textContent = "✅ eingeladen";
          row.disabled = true;
        } catch (e) { alert(e.message || "Konnte nicht eingeladen werden."); }
      });
    });
  }
  function wireInlineFeatureFlagToggles(root, onToggled) {
    root.querySelectorAll(".inline-feature-flag-toggle").forEach((toggle) => {
      toggle.addEventListener("change", async () => {
        await Backend.setFeatureFlag(toggle.dataset.flagKey, toggle.checked);
        showToast(toggle.checked ? "🚦 Update ist jetzt für alle live!" : "🚦 Update zurückgezogen — wieder nur für dich sichtbar, alle anderen sehen die alte Version.");
        if (onToggled) onToggled();
      });
    });
    root.querySelectorAll(".beta-invite-toggle").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const box = btn.closest(".beta-invite-box");
        const body = box.querySelector(".beta-invite-search-body");
        const opening = body.style.display === "none";
        body.style.display = opening ? "block" : "none";
        // Beim ERSTEN Öffnen sofort ein paar sinnvolle Vorschläge zeigen (die aktivsten
        // Mitglieder), statt eines komplett leeren Feldes, das man erst mit einer Suche befüllen
        // muss — die Suche filtert diese Vorschlagsliste dann bei Bedarf weiter ein.
        if (opening && !box.dataset.betaSuggestLoaded) {
          box.dataset.betaSuggestLoaded = "1";
          const results = box.querySelector(".beta-invite-results");
          results.innerHTML = `<p class="empty-note">Lade Vorschläge…</p>`;
          const all = await Backend.getAllUsers();
          const suggested = [...all].sort((a, b) => new Date(b.last_active || 0) - new Date(a.last_active || 0)).slice(0, 8);
          renderBetaInviteResults(suggested, results, box.querySelector(".beta-invite-search-input"));
        }
      });
    });
    root.querySelectorAll(".beta-invite-search-input").forEach((input) => {
      let searchTimer = null;
      input.addEventListener("input", () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(async () => {
          const term = input.value.trim();
          const box = input.closest(".beta-invite-box");
          const results = box.querySelector(".beta-invite-results");
          if (!term) {
            // Leeres Suchfeld -> zurück zu den ursprünglichen Vorschlägen statt eines leeren Feldes.
            const all = await Backend.getAllUsers();
            const suggested = [...all].sort((a, b) => new Date(b.last_active || 0) - new Date(a.last_active || 0)).slice(0, 8);
            renderBetaInviteResults(suggested, results, input);
            return;
          }
          const found = await Backend.searchUsers(term);
          renderBetaInviteResults(found.slice(0, 8), results, input);
        }, 300);
      });
    });
  }
  // Für komplett NEUE Spiele (kein "alter Zustand", zu dem man zurückfallen könnte): bis zur
  // Freigabe sehen normale Nutzer:innen nur eine "Kommt bald"-Meldung, während Betreiber:innen
  // das Spiel bereits normal spielen UND per Knopf freigeben können. Gibt true zurück, wenn der
  // Aufrufer normal weiterrendern soll (Feature an, ODER man ist selbst Betreiber:in).
  const betaTestingNotifiedThisSession = new Set(); // verhindert, dass dieselbe Benachrichtigung
  // bei jedem erneuten Rendern der Seite (z. B. bei jedem Klick) wiederholt verschickt wird.
  // Sobald ein Beta-Tester (nicht Admin/Moderator selbst) ein Feature sieht, das für alle anderen
  // noch gesperrt ist, bekommen alle Admins/Betreiber:innen einmalig eine Nachricht mit einem
  // anklickbaren Link, der direkt zu genau diesem Bereich springt — damit man mittesten kann,
  // während die Beta-Person es gerade ausprobiert, statt es erst viel später zufällig zu bemerken.
  async function notifyAdminsIfBetaTesting(flagKey, featureName, subTarget) {
    const profile = Backend.currentProfile();
    if (!profile || !profile.isBetaTester || (Backend.canModerate && Backend.canModerate())) return;
    if (Backend.getRawFeatureFlag(flagKey)) return; // schon für alle freigegeben, keine Beta-Situation mehr
    if (betaTestingNotifiedThisSession.has(flagKey)) return;
    betaTestingNotifiedThisSession.add(flagKey);
    try {
      await Backend.notifyAdminsBetaTesting(profile.name, featureName, subTarget);
    } catch (e) { console.warn("Beta-Test-Benachrichtigung an Admins fehlgeschlagen:", e); }
  }
  function renderComingSoonGate(area, flagKey, gameName, gameIcon, defaultTrue) {
    const isOn = defaultTrue ? Backend.isFeatureOnDefaultTrue(flagKey) : Backend.isFeatureOn(flagKey);
    const canSeeAnyway = Backend.canModerate && Backend.canModerate();
    // WICHTIG — zentraler Ansatz statt 8+ einzelner Umbauten: der Freischalt-Schalter wird hier,
    // an EINER Stelle für alle Spiele, als eigenes Geschwister-Element direkt VOR dem Spielbereich
    // eingefügt (nicht innerhalb von area selbst, da dessen innerHTML ja beim Spielen laufend neu
    // gesetzt wird — ein dort eingefügter Schalter würde bei jedem Re-Render wieder verschwinden).
    // Läuft nur für Moderator:innen/Admins (inlineFeatureFlagToggleHtml liefert sonst "").
    let toggleHost = document.getElementById(area.id + "-toggle-host");
    const toggleHtml = inlineFeatureFlagToggleHtml(flagKey, defaultTrue);
    if (toggleHtml) {
      if (!toggleHost) {
        toggleHost = document.createElement("div");
        toggleHost.id = area.id + "-toggle-host";
        area.parentNode.insertBefore(toggleHost, area);
      }
      toggleHost.innerHTML = toggleHtml;
      wireInlineFeatureFlagToggles(toggleHost, () => renderComingSoonGate(area, flagKey, gameName, gameIcon, defaultTrue) || true);
    } else if (toggleHost) {
      toggleHost.remove();
    }
    if (isOn || canSeeAnyway) {
      if (isOn) notifyAdminsIfBetaTesting(flagKey, gameName);
      return true;
    }
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p style="font-size:2.5rem;">${gameIcon}</p>
        <h2 style="margin:8px 0;">${gameName}</h2>
        <p class="empty-note">Dieses Spiel wird gerade fertig vorbereitet — kommt bald!</p>
      </div>`;
    return false;
  }
  function isThemeUnlocked(t, profile) { return isUnlocked(t.unlock, profile) || (profile?.giftedThemes || []).includes(t.id); }
  // Zentrale, wiederverwendbare Großschreibungs-Korrektur für ANGEZEIGTE Antwortoptionen: steht
  // die Lücke im Fragetext ganz am Satzanfang, muss das eingesetzte Wort dort großgeschrieben
  // werden (normale deutsche Rechtschreibung) — unabhängig davon, wie es in der Datenbank
  // gespeichert ist. Rein für die ANZEIGE, die interne Prüfung bleibt unverändert über den Index.
  // An JEDER Stelle einsetzbar, die ein Wort als Antwortoption zu einem Lückentext-prompt zeigt
  // (Standard-Quiz, Wort-Kanone, Wortblasen, Wackelturm, …), statt einer lokal duplizierten Kopie.
  function capitalizeIfSentenceStart(text, prompt) {
    if (!text || !prompt) return text;
    const startsWithBlank = prompt.trim().startsWith("___");
    return startsWithBlank ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  }

  // WICHTIG: im Konto gespeichert (nicht localStorage!), damit die Selbsteinschätzung auf allen
  // Geräten gleich ankommt, nicht nur auf dem Gerät, wo sie eingetragen wurde.
  function getLearningProfile() {
    const profile = Backend.currentProfile();
    return (profile && profile.extraProfileData && profile.extraProfileData.learningProfile) || {};
  }
  async function setLearningRating(catId, rating) {
    const updated = { ...getLearningProfile(), [catId]: rating };
    await Backend.updateExtraProfileField("learningProfile", updated);
  }
  // Die aus der Selbsteinschätzung am schwächsten bewertete Kategorie — hat Vorrang vor der
  // automatisch aus dem Spielverhalten erkannten Schwäche, weil die Person das aktiv selbst
  // angegeben hat.
  function selfAssessedWeakCategory() {
    const profile = getLearningProfile();
    const weakOnes = Object.entries(profile).filter(([, r]) => r === "schwach");
    if (!weakOnes.length) return null;
    const dayIdx = dayOfYearIndex(new Date());
    const [id] = weakOnes[dayIdx % weakOnes.length]; // wechselt fair zwischen mehreren Schwächen
    const cat = ExerciseData.getCategory(id);
    return cat ? { id, label: cat.title, kind: "self-assessed" } : null;
  }
  let adminUserSearch = "";
  // Vollständige Nutzerliste für Admins/Moderatoren — zeigt WIRKLICH alle registrierten Konten,
  // nicht nur die zuletzt aktiven, mit Suche und (nur für echte Admins) Moderator-Verwaltung.
  const BUG_CATEGORY_ICONS = {
    "Rechtschreibfehler": "📝", "Spiel reagiert nicht / hängt": "⚙️",
    "Text abgeschnitten / falscher Zeilenumbruch": "🖼️", "Falsche Antwort markiert": "❌", "Sonstiges": "❓",
  };
  async function loadAdminBugReports() {
    const area = document.getElementById("adminBugReportsArea");
    if (!area) return;
    const reports = await Backend.getBugReports();
    const open = reports.filter((r) => !r.resolved);
    const resolved = reports.filter((r) => r.resolved);
    if (!reports.length) { area.innerHTML = '<p class="empty-note">Noch keine Meldungen — gute Nachrichten!</p>'; return; }
    // Häufigkeits-Auswertung nach Kategorie — zeigt, welche Bereiche am öftesten gemeldet werden,
    // damit sich die Test-Priorität eingrenzen lässt: viel gemeldet = zuerst gründlich testen,
    // wenig/nie gemeldet = gilt schon als recht zuverlässig.
    const categoryCounts = {};
    reports.forEach((r) => { categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1; });
    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    area.innerHTML = `
      ${sortedCategories.length ? `<div class="question-card" style="margin-bottom:14px; border:2px solid var(--amber-400);">
        <h3 style="margin-top:0;">🎯 Test-Priorität nach Meldungshäufigkeit</h3>
        <p class="empty-note" style="margin-bottom:8px;">Am öftesten gemeldete Bereiche zuerst — hilft einzugrenzen, was gründlich getestet werden sollte.</p>
        <div class="breakdown-list">
          ${sortedCategories.map(([cat, count]) => `<div class="breakdown-row"><span>${BUG_CATEGORY_ICONS[cat] || "🪲"} ${cat}</span><span class="empty-note">${count}× gemeldet</span></div>`).join("")}
        </div>
      </div>` : ""}
      <p class="empty-note" style="margin-bottom:10px;">${open.length} offen · ${resolved.length} erledigt</p>
      <div class="breakdown-list">
        ${open.map((r) => `
          <div class="breakdown-row" style="flex-direction:column; align-items:flex-start; gap:4px; background:rgba(232,95,111,0.08); border-radius:8px; padding:8px;">
            <span style="display:flex; justify-content:space-between; width:100%; align-items:center;">
              <strong>${BUG_CATEGORY_ICONS[r.category] || "🪲"} ${r.category}</strong>
              <button type="button" class="emoji-toggle-link" data-resolve-bug="${r.id}" style="font-size:0.72rem;">✓ Erledigt</button>
            </span>
            <span class="empty-note" style="font-size:0.78rem;">${r.context}</span>
            ${r.description ? `<span class="empty-note" style="font-size:0.76rem;">📝 ${r.description}</span>` : ""}
            <span class="empty-note" style="font-size:0.7rem; opacity:0.7;">von ${r.reporter_name} · ${new Date(r.created_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
          </div>`).join("") || '<p class="empty-note">Keine offenen Meldungen. 🎉</p>'}
      </div>
      ${resolved.length ? `<button type="button" class="emoji-toggle-link" id="toggleResolvedBugs" style="margin-top:10px;">${resolved.length} erledigte Meldungen anzeigen</button>
      <div class="breakdown-list" id="resolvedBugsList" style="display:none; opacity:0.6; margin-top:8px;">
        ${resolved.map((r) => `<div class="breakdown-row"><span>${BUG_CATEGORY_ICONS[r.category] || "🪲"} ${r.category} — ${r.context}</span></div>`).join("")}
      </div>` : ""}
    `;
    area.querySelectorAll("[data-resolve-bug]").forEach((btn) => {
      btn.addEventListener("click", async () => { await Backend.resolveBugReport(btn.dataset.resolveBug); loadAdminBugReports(); });
    });
    document.getElementById("toggleResolvedBugs")?.addEventListener("click", (e) => {
      const list = document.getElementById("resolvedBugsList");
      list.style.display = list.style.display === "none" ? "block" : "none";
    });
  }
  async function loadCustomSympathyList() {
    const wrap = document.getElementById("customSympathyList");
    if (!wrap) return;
    const all = await Backend.getAllSympathyLevels();
    const custom = all.filter((l) => l.key.startsWith("custom_"));
    wrap.innerHTML = custom.length ? custom.map((l) => `
      <div class="breakdown-row">
        <span><svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align:middle; margin-right:6px;"><path d="M12 21 C12 21 3 14.5 3 8.5 C3 5.5 5.5 3 8.5 3 C10 3 11.3 3.7 12 4.8 C12.7 3.7 14 3 15.5 3 C18.5 3 21 5.5 21 8.5 C21 14.5 12 21 12 21 Z" fill="${l.color}"/></svg>${l.label}</span>
        <button type="button" class="emoji-toggle-link" data-remove-sympathy-level="${l.key}" style="font-size:0.75rem;">entfernen</button>
      </div>`).join("") : '<p class="empty-note">Noch keine eigenen Stufen angelegt.</p>';
    wrap.querySelectorAll("[data-remove-sympathy-level]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await Backend.removeCustomSympathyLevel(btn.dataset.removeSympathyLevel);
        loadCustomSympathyList();
      });
    });
  }
  async function loadAdminUserList() {
    const box = document.getElementById("adminUserListArea");
    if (!box) return;
    const allUsers = await Backend.getAllUsers();
    const loadError = Backend.getLastUserListError();
    const isRealAdmin = Backend.currentProfile()?.isAdmin || Backend.currentProfile()?.isOwner;
    const filtered = adminUserSearch ? allUsers.filter((u) => u.name.toLowerCase().includes(adminUserSearch.toLowerCase())) : allUsers;
    box.innerHTML = `
      ${loadError ? `<div class="demo-banner" style="margin-bottom:10px;">⚠️ Nutzerliste konnte nicht geladen werden — das ist NICHT "0 registrierte Personen", sondern ein Ladefehler: ${loadError}. Meist fehlt eine kürzlich hinzugekommene Spalte in der Tabelle „profiles" — führe sicherheitshalber das komplette Nachrüst-SQL aus dem README im Supabase SQL-Editor aus.</div>` : ""}
      <p style="font-weight:800; font-size:1.3rem; margin:4px 0 10px;">${allUsers.length} ${allUsers.length === 1 ? "Person" : "Personen"} registriert</p>
      <input type="text" class="vocab-search" id="adminUserSearchInput" placeholder="Nach Namen suchen…" value="${adminUserSearch}" style="margin-bottom:10px;" />
      <div style="max-height:340px; overflow-y:auto;">
        ${filtered.length ? filtered.map((u) => `
          <div class="breakdown-row" style="flex-direction:column; align-items:stretch; gap:6px;">
            <span style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span class="online-dot" style="opacity:${u.online ? 1 : 0.25}; flex-shrink:0;"></span>
              <span style="min-width:0; overflow-wrap:break-word;">${u.name}${adminBadge(u.is_admin, u.is_owner, u.is_moderator, u.is_beta_tester, u.is_contributor, u.is_supporter)}</span>
              <span class="empty-note" style="margin-left:auto;">${u.points} P.</span>
            </span>
            <span style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              ${isRealAdmin && !u.is_owner ? `<button type="button" class="btn btn-ghost" style="padding:3px 9px; font-size:0.72rem;" data-toggle-mod="${u.id}" data-currently-mod="${u.is_moderator}">${u.is_moderator ? "Mod entfernen" : "Zu Mod machen"}</button>` : ""}
              ${isRealAdmin && !u.is_owner ? `<button type="button" class="btn btn-ghost" style="padding:3px 9px; font-size:0.72rem;" data-toggle-contributor="${u.id}" data-currently-contributor="${u.is_contributor}">${u.is_contributor ? "🛠️ Mitgestalter entfernen" : "🛠️ Zu Mitgestalter:in machen"}</button>` : ""}
              ${isRealAdmin && !u.is_owner ? `<button type="button" class="btn btn-ghost" style="padding:3px 9px; font-size:0.72rem;" data-toggle-supporter="${u.id}" data-currently-supporter="${u.is_supporter}">${u.is_supporter ? "💛 Unterstützer entfernen" : "💛 Zu Unterstützer:in machen"}</button>` : ""}
              ${isRealAdmin && !u.is_owner ? `<button type="button" class="btn btn-ghost" style="padding:3px 9px; font-size:0.72rem;" data-donation-for="${u.id}" data-donation-name="${u.name}">💶 Spende eintragen</button>` : ""}
              ${isRealAdmin && !u.is_owner ? (
                ["fortgeschritten", "profi", "muttersprache"].includes(u.proficiency_level)
                  ? `<button type="button" class="btn btn-ghost" style="padding:3px 9px; font-size:0.72rem;" data-toggle-beta="${u.id}" data-currently-beta="${u.is_beta_tester}">${u.is_beta_tester ? "🧪 Beta entfernen" : "🧪 Zu Beta-Tester:in machen"}</button>`
                  : `<span class="empty-note" style="font-size:0.68rem;" title="Braucht mindestens Sprachniveau „Fortgeschritten"">🧪 Niveau zu niedrig</span>`
              ) : ""}
              ${isRealAdmin ? `<button type="button" class="btn btn-ghost" style="padding:3px 9px; font-size:0.72rem;" data-gift-to="${u.id}" data-gift-name="${u.name}">🎁 Verschenken</button>` : ""}
            </span>
          </div>`).join("") : '<p class="empty-note">Keine Treffer.</p>'}
      </div>
    `;
    document.getElementById("adminUserSearchInput").addEventListener("input", (e) => {
      adminUserSearch = e.target.value;
      loadAdminUserList();
    });
    box.querySelectorAll("[data-toggle-mod]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const makeMod = btn.dataset.currentlyMod !== "true";
        try {
          await Backend.setModeratorStatus(btn.dataset.toggleMod, makeMod);
          loadAdminUserList();
        } catch (e) { alert(e.message || "Aktion fehlgeschlagen."); }
      });
    });
    box.querySelectorAll("[data-toggle-beta]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const makeBeta = btn.dataset.currentlyBeta !== "true";
        try {
          await Backend.setBetaTesterStatus(btn.dataset.toggleBeta, makeBeta);
          // WICHTIG: die Person selbst bekommt eine Nachricht — sonst merkt sie unter Umständen
          // gar nicht, dass sie jetzt Zugriff auf gerade getestete, noch nicht freigegebene
          // Funktionen hat.
          if (makeBeta) await Backend.sendSystemMessage(btn.dataset.toggleBeta, "🧪 Du wurdest als Beta-Tester:in eingeladen! Du siehst jetzt neue Funktionen, bevor sie für alle freigegeben werden — probier sie gern aus und gib Rückmeldung.");
          loadAdminUserList();
        } catch (e) { alert(e.message || "Aktion fehlgeschlagen."); }
      });
    });
    box.querySelectorAll("[data-toggle-contributor]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const makeIt = btn.dataset.currentlyContributor !== "true";
        try {
          await Backend.setContributorStatus(btn.dataset.toggleContributor, makeIt);
          loadAdminUserList();
        } catch (e) { alert(e.message || "Aktion fehlgeschlagen."); }
      });
    });
    box.querySelectorAll("[data-toggle-supporter]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const makeIt = btn.dataset.currentlySupporter !== "true";
        try {
          await Backend.setSupporterStatus(btn.dataset.toggleSupporter, makeIt);
          loadAdminUserList();
        } catch (e) { alert(e.message || "Aktion fehlgeschlagen."); }
      });
    });
    box.querySelectorAll("[data-donation-for]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const amountStr = prompt(`Wie viel € hat ${btn.dataset.donationName} gespendet? (1 € = 10 Bonuspunkte)`);
        const amount = Number(amountStr);
        if (!amountStr || !Number.isFinite(amount) || amount <= 0) return;
        try {
          await Backend.grantDonationPoints(btn.dataset.donationFor, amount);
          showToast(`💛 ${Math.round(amount * 10)} Bonuspunkte für ${btn.dataset.donationName} eingetragen!`);
          loadAdminUserList();
        } catch (e) { alert(e.message || "Aktion fehlgeschlagen."); }
      });
    });
    box.querySelectorAll("[data-gift-to]").forEach((btn) => {
      btn.addEventListener("click", () => openGiftModal(btn.dataset.giftTo, btn.dataset.giftName));
    });
  }
  // Popup für Admins: einer bestimmten Person eine Übungskategorie oder ein Design direkt
  // schenken/freischalten, ohne dass sie sich das erst erspielen muss.
  function openGiftModal(targetUserId, targetName) {
    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("div", { class: "profile-modal-card" },
        Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
        Core.el("h3", {}, `🎁 An ${targetName} verschenken`),
        Core.el("div", { class: "form-field" },
          Core.el("label", {}, "Was verschenken?"),
          Core.el("select", { id: "giftTypeSelect", class: "challenge-select" },
            Core.el("option", { value: "category" }, "Übungskategorie"),
            Core.el("option", { value: "theme" }, "Design")
          )
        ),
        Core.el("div", { class: "form-field", id: "giftCategoryField" },
          Core.el("label", {}, "Kategorie"),
          Core.el("select", { id: "giftCategorySelect", class: "challenge-select" },
            ...ExerciseData.CATEGORIES.map((c) => Core.el("option", { value: c.id }, `${c.icon} ${c.title}`))
          )
        ),
        Core.el("div", { class: "form-field", id: "giftThemeField", style: "display:none;" },
          Core.el("label", {}, "Design"),
          Core.el("select", { id: "giftThemeSelect", class: "challenge-select" },
            ...THEMES.map((t) => Core.el("option", { value: t.id }, `${t.emoji} ${t.name}`))
          ),
          Core.el("button", { type: "button", class: "emoji-toggle-link", id: "giftThemePreviewBtn", style: "margin-top:6px;" }, "👁️ Vorschau ansehen")
        ),
        Core.el("p", { class: "form-error", id: "giftError" }),
        Core.el("button", { type: "button", class: "btn btn-coffee", id: "giftSendBtn", style: "margin-top:8px;" }, "Schenken")
      )
    );
    document.body.appendChild(box);
    document.getElementById("giftTypeSelect").addEventListener("change", (e) => {
      document.getElementById("giftCategoryField").style.display = e.target.value === "category" ? "" : "none";
      document.getElementById("giftThemeField").style.display = e.target.value === "theme" ? "" : "none";
    });
    document.getElementById("giftThemePreviewBtn").addEventListener("click", () => {
      openThemePreviewModal(document.getElementById("giftThemeSelect").value);
    });
    document.getElementById("giftSendBtn").addEventListener("click", async () => {
      const errBox = document.getElementById("giftError");
      errBox.textContent = "";
      const type = document.getElementById("giftTypeSelect").value;
      try {
        if (type === "category") {
          const catId = document.getElementById("giftCategorySelect").value;
          const cat = ExerciseData.getCategory(catId);
          await Backend.adminGiftCategoryUnlock(targetUserId, catId, cat?.title);
        } else {
          const themeId = document.getElementById("giftThemeSelect").value;
          const theme = THEMES.find((t) => t.id === themeId);
          await Backend.adminGiftThemeUnlock(targetUserId, themeId, theme?.name);
        }
        box.remove();
        showToast(`🎁 Geschenk an ${targetName} verschickt!`);
      } catch (e) {
        errBox.textContent = e.message || "Verschenken fehlgeschlagen.";
      }
    });
  }
  function renderSettings() {
    const area = document.getElementById("settingsArea");
    if (!area) return;
    const profile = Backend.currentProfile();
    if (!profile) { area.innerHTML = '<p class="empty-note">Bitte zuerst anmelden.</p>'; return; }
    area.innerHTML = `
      <p class="empty-note">Hier stellst du ein, wie dich die Seite beim Lernen unterstützt und wie Benachrichtigungen aussehen und klingen.</p>
      <div class="question-card" style="margin-top:14px; border:2px solid var(--teal-400);">
        <h3>⚖️ Sprachniveau — für faire Fortschritts-Geschwindigkeit</h3>
        <p class="empty-note" style="margin-bottom:10px;">Beeinflusst NICHT deinen frei wählbaren Schwierigkeitsgrad — nur wie schnell Punkte, Missionen und Level voranschreiten. So haben Anfänger:innen die gleichen Fortschritts-Chancen wie Muttersprachler:innen, für die die Aufgaben leichter sind.</p>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${[["anfaenger", "🌱 Anfänger:in"], ["fortgeschritten", "📈 Fortgeschritten"], ["profi", "🎯 Profi"], ["muttersprache", "🌟 Muttersprachler:in"]].map(([val, label]) => `
            <button type="button" class="trophy-chip proficiency-level-btn ${getProficiencyLevel() === val ? "selected" : ""}" data-level="${val}">${label}</button>
          `).join("")}
        </div>
      </div>
      ${!profile.isBetaTester ? `<div class="question-card" style="margin-top:14px;">
        <h3>🧪 Beta-Tester:in werden</h3>
        <p class="empty-note" style="margin-bottom:10px;">Als Beta-Tester:in siehst du neue Funktionen und Spiele, bevor sie für alle freigegeben werden — probier sie als Erste:r aus und gib Rückmeldung.</p>
        <button type="button" class="btn btn-ghost" id="settingsApplyBetaBtn">🧪 Jetzt bewerben</button>
      </div>` : `<div class="question-card" style="margin-top:14px;">
        <h3>🧪 Du bist Beta-Tester:in!</h3>
        <p class="empty-note">Du siehst neue Funktionen bereits, bevor sie für alle freigegeben werden.</p>
      </div>`}
      <div class="question-card" style="margin-top:14px;">
        <h3>🧭 Dein Lernprofil</h3>
        <p class="empty-note" style="margin-bottom:10px;">Schätz dich selbst ein — bei „schwach" markierten Bereichen zieht die Tagesaufgabe im Kalender bevorzugt Fragen aus genau diesem Bereich.</p>
        ${ExerciseData.CATEGORIES.map((cat) => {
          const current = getLearningProfile()[cat.id] || "";
          return `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
            <span style="flex:1; min-width:140px;">${cat.title}</span>
            <div style="display:flex; gap:4px;">
              ${[["stark", "💪 Stark"], ["mittel", "🙂 Mittel"], ["schwach", "😕 Schwach"]].map(([val, label]) => `
                <button type="button" class="trophy-chip learning-rate-btn ${current === val ? "selected" : ""}" data-cat="${cat.id}" data-rating="${val}" style="font-size:0.72rem; padding:4px 8px;">${label}</button>
              `).join("")}
            </div>
          </div>`;
        }).join("")}
      </div>
      <div class="question-card" style="margin-top:14px;">
        <h3>🔤 Betonungsmodus</h3>
        <p class="empty-note" style="margin-bottom:10px;">Zeigt bei allen geprüften Wörtern (Vokabeltrainer, Hobbys, Länder, Sprachen, Artikel-Wortschatz, kleine Wörter) die betonte Silbe unterstrichen an — wie im Duden.</p>
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
          <input type="checkbox" id="settingsStressCheck" ${isStressModeOn() ? "checked" : ""} />
          <span>Betonung überall anzeigen, wo geprüfte Daten vorliegen</span>
        </label>
        <p style="font-weight:700; margin:14px 0 6px;">Bereiche ausnehmen (dort keine Betonung zeigen)</p>
        ${STRESS_EXCLUDABLE_SECTIONS.map((sec) => `
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:4px;">
            <input type="checkbox" class="stress-exclude-check" data-section-id="${sec.id}" ${getStressExcludedSections().includes(sec.id) ? "checked" : ""} />
            <span>${sec.label}</span>
          </label>`).join("")}
      </div>
      <div class="question-card" style="margin-top:14px;">
        <h3>🎨 Benachrichtigungs-Einstellungen</h3>
        <p class="empty-note" style="margin-bottom:10px;">Töne und Farben ab einer bestimmten Punktzahl freigeschaltet — eine kleine Belohnung fürs Üben. Die gewählte Option ist jeweils hervorgehoben.</p>
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:8px;">
          <input type="checkbox" id="settingsMuteSoundCheck" ${isNotifyMuted() ? "checked" : ""} />
          <span>🔇 Nur den Ton stummschalten</span>
        </label>
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:12px;">
          <input type="checkbox" id="settingsMuteBlinkCheck" ${isNotifyBlinkMuted() ? "checked" : ""} />
          <span>🔕 Nur das Blinken/Leuchten stummschalten</span>
        </label>
        <p style="font-weight:700; margin-bottom:6px;">Ton</p>
        <div class="trophy-case" style="margin-bottom:14px;">
          ${Object.entries(NOTIFY_SOUND_PRESETS).map(([key, p]) => {
            const unlocked = profile.points >= p.unlockPoints;
            const active = getNotifySoundKey() === key;
            return `<button type="button" class="trophy-chip notify-preset-btn ${active ? "selected" : ""} ${!unlocked ? "trophy-chip-locked" : ""}" data-sound-key="${key}" ${!unlocked ? "disabled" : ""}>${active ? "✓ " : ""}${p.label}${!unlocked ? ` 🔒 ${p.unlockPoints}P` : ""}</button>`;
          }).join("")}
        </div>
        <p style="font-weight:700; margin-bottom:6px;">Farbe (Lämpchen &amp; Ring)</p>
        <div class="trophy-case" style="margin-bottom:14px;">
          ${Object.entries(NOTIFY_COLOR_PRESETS).map(([key, p]) => {
            const unlocked = profile.points >= p.unlockPoints;
            const active = getNotifyColorKey() === key;
            return `<button type="button" class="trophy-chip notify-preset-btn ${active ? "selected" : ""} ${!unlocked ? "trophy-chip-locked" : ""}" data-color-key="${key}" ${!unlocked ? "disabled" : ""}>${active ? "✓ " : ""}${p.label}${!unlocked ? ` 🔒 ${p.unlockPoints}P` : ""}</button>`;
          }).join("")}
        </div>
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
          <input type="checkbox" id="tickerBlinkCheck" ${isTickerBlinkOn() ? "checked" : ""} ${profile.points >= 400 ? "" : "disabled"} />
          <span>Laufband beim Aktualisieren blinken lassen ${profile.points >= 400 ? "" : "🔒 400P"}</span>
        </label>
        ${isTickerBlinkOn() ? `
          <div class="trophy-case" style="margin-top:8px;">
            ${[["1.4", "🐢 Langsam"], ["0.7", "⚡ Normal"], ["0.35", "🔥 Schnell"]].map(([val, label]) => `<button type="button" class="trophy-chip ticker-speed-btn ${getTickerBlinkSpeed() === val ? "selected" : ""}" data-speed="${val}">${label}</button>`).join("")}
          </div>` : ""}
        <hr style="border:none; border-top:1px solid rgba(0,0,0,0.08); margin:16px 0;" />
        <p style="font-weight:700; margin-bottom:4px;">🎯 Pro Art einstellen (optional)</p>
        <p class="empty-note" style="margin-bottom:10px;">Standardmäßig gilt überall der Ton/die Farbe von oben. Hier kannst du für einzelne Arten gezielt etwas anderes wählen — "Wie Standard" heißt: folgt weiterhin automatisch der Einstellung oben.</p>
        ${Object.entries(NOTIFY_KINDS).map(([kind, meta]) => {
          const typeSettings = getNotifyTypeSettings()[kind] || {};
          return `
          <div style="margin-bottom:14px;">
            <p style="font-weight:700; font-size:0.85rem; margin-bottom:6px;">${meta.label}</p>
            <label class="empty-note" style="display:block; margin-bottom:4px;">Ton</label>
            <select class="challenge-select notify-kind-sound" data-kind="${kind}" style="margin-bottom:6px;">
              <option value="">Wie Standard</option>
              ${Object.entries(NOTIFY_SOUND_PRESETS).map(([key, p]) => `<option value="${key}" ${typeSettings.sound === key ? "selected" : ""} ${profile.points < p.unlockPoints ? "disabled" : ""}>${p.label}${profile.points < p.unlockPoints ? ` 🔒 ${p.unlockPoints}P` : ""}</option>`).join("")}
            </select>
            <label class="empty-note" style="display:block; margin-bottom:4px;">Farbe</label>
            <select class="challenge-select notify-kind-color" data-kind="${kind}">
              <option value="">Wie Standard</option>
              ${Object.entries(NOTIFY_COLOR_PRESETS).map(([key, p]) => `<option value="${key}" ${typeSettings.color === key ? "selected" : ""} ${profile.points < p.unlockPoints ? "disabled" : ""}>${p.label}${profile.points < p.unlockPoints ? ` 🔒 ${p.unlockPoints}P` : ""}</option>`).join("")}
            </select>
          </div>`;
        }).join("")}
      </div>
      <div class="question-card" style="margin-top:14px; border:2px solid var(--amber-400);">
        <h3>🦊 Freund:innen empfehlen</h3>
        <p class="empty-note" style="margin-bottom:10px;">Kennst du andere Leute, die von Deutschübungen profitieren könnten? Teil deinen persönlichen Link mit ihnen — meldet sich jemand darüber neu an, bekommt ihr <strong>beide automatisch 25 Bonuspunkte</strong>. Zusätzlich hast du damit die Chance, "Fuchs des Tages" zu werden!</p>
        <button type="button" class="btn btn-coffee" id="shareSiteBtn">🔗 Meinen Empfehlungs-Link teilen</button>
      </div>
      ${(profile.isOwner || Backend.canModerate()) ? `<div class="question-card" style="margin-top:14px; border:2px solid var(--teal-400);">
        <h3>🚦 Freigabe-Schalter für neue Features</h3>
        <p class="empty-note" style="margin-bottom:10px;">Neue, noch nicht ganz fertig geprüfte Funktionen sind hier zunächst nur für dich sichtbar — du kannst alles in echt durchklicken und ausprobieren. Erst wenn du den Schalter umlegst, sehen es auch alle anderen. Zurückschalten geht jederzeit — dann verschwindet es sofort wieder für alle, so als wäre nichts gewesen.</p>
        ${KNOWN_FEATURE_FLAGS.map((f) => `
          <label style="display:flex; align-items:flex-start; gap:8px; cursor:pointer; margin-top:10px;">
            <input type="checkbox" class="feature-flag-toggle" data-flag-key="${f.key}" ${Backend.getRawFeatureFlag(f.key) ? "checked" : ""} />
            <span>
              <strong>${f.label}</strong><br>
              <span class="empty-note" style="font-size:0.76rem;">${f.desc}</span>
            </span>
          </label>`).join("")}
      </div>` : ""}
      ${(profile.isOwner || Backend.canModerate()) ? `<div class="question-card" style="margin-top:14px;">
        <h3>✨ Premium-Status (nur für dich sichtbar)</h3>
        <p class="empty-note" style="margin-bottom:10px;">Da du aktuell keine echten Premium-Inhalte hinterlegt hast, macht ein aktiver Premium-Status wenig Sinn. Hier kannst du ihn selbst jederzeit ein- und ausschalten, sobald du willst.</p>
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
          <input type="checkbox" id="premiumSelfToggle" ${Backend.isPremium() ? "checked" : ""} />
          <span>Premium-Status bei mir aktiv anzeigen</span>
        </label>
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-top:10px;">
          <input type="checkbox" id="premiumBadgeHideToggle" ${(profile.extraProfileData && profile.extraProfileData.hidePremiumBadge) ? "checked" : ""} />
          <span>Nur das „✨ Premium"-Abzeichen im Profil ausblenden (Premium-Status selbst bleibt unverändert)</span>
        </label>
      </div>` : ""}
      ${Backend.canModerate() ? `<div class="question-card" style="margin-top:14px;">
        <h3>💛 Eigene Sympathie-Stufen</h3>
        <p class="empty-note" style="margin-bottom:10px;">Zusätzlich zu den vier eingebauten Stufen kannst du eigene anlegen — bleibt bewusst freundschaftlich statt romantisch/intim ausgerichtet.</p>
        <div id="customSympathyList"><p class="empty-note">Lade…</p></div>
        <div class="form-field" style="margin-top:10px;"><label>Bezeichnung</label><input type="text" id="newSympathyLabel" placeholder="z. B. Ich lerne gerne zusammen mit dir" maxlength="80" /></div>
        <div class="form-field"><label>Herzfarbe</label><input type="color" id="newSympathyColor" value="#c9a875" style="width:60px; height:36px; padding:2px;" /></div>
        <div class="form-field"><label>Beschreibung (optional)</label><input type="text" id="newSympathyDesc" placeholder="Kurze Erklärung, wann diese Stufe passt" maxlength="150" /></div>
        <button type="button" class="btn btn-ghost" id="addSympathyLevelBtn">+ Stufe hinzufügen</button>
        <p class="form-error" id="sympathyLevelError" style="display:none;"></p>
      </div>` : ""}
      ${Backend.canModerate() ? `<div class="question-card" style="margin-top:14px;">
        <h3>🪲 Gemeldete Fehler</h3>
        <div id="adminBugReportsArea"><p class="empty-note">Lade Meldungen…</p></div>
      </div>` : ""}
      ${Backend.canModerate() ? `<div class="question-card" style="margin-top:14px;">
        <h3>👥 Alle registrierten Nutzer</h3>
        <div id="adminUserListArea"><p class="empty-note">Lade Nutzerliste…</p></div>
      </div>` : ""}
      ${profile.isOwner || Backend.isAdmin() ? `<div class="question-card" style="margin-top:14px;">
        <h3>🦊 Browser-Symbol (Favicon)</h3>
        <p class="empty-note" style="margin-bottom:10px;">Das kleine Symbol oben in der Browser-Adresszeile/im Tab. Eigenes Bild hochladen, um das Standard-Fuchs-Symbol zu ersetzen.</p>
        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <img id="currentFaviconPreview" src="" alt="" style="width:40px; height:40px; border-radius:8px; object-fit:cover; background:var(--plum-700);" />
          <label class="btn btn-ghost" style="cursor:pointer;">📷 Neues Symbol hochladen<input type="file" accept="image/*" id="faviconUploadInput" style="display:none;" /></label>
          <button type="button" class="btn btn-ghost" id="faviconResetBtn" title="Zurück zum Standard-Fuchs">↩️ Zurücksetzen</button>
        </div>
        <p class="empty-note" id="faviconUploadNote" style="margin-top:8px;"></p>
      </div>` : ""}
    `;
    if (profile.isOwner || Backend.isAdmin()) {
      Backend.getSiteContent("custom_favicon_url").then((url) => {
        const img = document.getElementById("currentFaviconPreview");
        if (img) img.src = url || document.getElementById("mainFavicon")?.href || "";
      });
      document.getElementById("faviconUploadInput")?.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const note = document.getElementById("faviconUploadNote");
        note.textContent = "Lädt hoch…";
        try {
          const url = await Backend.uploadSiteImage("custom_favicon", file);
          await Backend.setSiteContent("custom_favicon_url", url);
          applyCustomFavicon(url);
          document.getElementById("currentFaviconPreview").src = url;
          note.textContent = "✅ Neues Symbol übernommen!";
        } catch (err) { note.textContent = "⚠️ " + err.message; }
      });
      document.getElementById("faviconResetBtn")?.addEventListener("click", async () => {
        await Backend.setSiteContent("custom_favicon_url", "");
        applyCustomFavicon("");
        document.getElementById("currentFaviconPreview").src = document.getElementById("mainFavicon")?.href || "";
        document.getElementById("faviconUploadNote").textContent = "↩️ Auf Standard-Fuchs zurückgesetzt.";
      });
    }
    if (Backend.canModerate()) loadCustomSympathyList();
    document.getElementById("addSympathyLevelBtn")?.addEventListener("click", async () => {
      const errBox = document.getElementById("sympathyLevelError");
      const label = document.getElementById("newSympathyLabel").value.trim();
      if (!label) { errBox.textContent = "⚠️ Bitte eine Bezeichnung eingeben."; errBox.style.display = "block"; return; }
      try {
        await Backend.addCustomSympathyLevel(label, document.getElementById("newSympathyColor").value, document.getElementById("newSympathyDesc").value);
        document.getElementById("newSympathyLabel").value = "";
        document.getElementById("newSympathyDesc").value = "";
        errBox.style.display = "none";
        showToast("💛 Neue Stufe angelegt!");
        loadCustomSympathyList();
      } catch (err) {
        errBox.textContent = "⚠️ " + err.message;
        errBox.style.display = "block";
      }
    });
    const premiumToggle = document.getElementById("premiumSelfToggle");
    if (premiumToggle) premiumToggle.addEventListener("change", async () => { await Backend.togglePremium(premiumToggle.checked); renderSettings(); });
    area.querySelectorAll(".feature-flag-toggle").forEach((toggle) => {
      toggle.addEventListener("change", async () => {
        await Backend.setFeatureFlag(toggle.dataset.flagKey, toggle.checked);
        showToast(toggle.checked ? "🚦 Feature für alle freigegeben!" : "🚦 Feature wieder zurückgenommen — nur noch für dich sichtbar.");
      });
    });
    const premiumBadgeHideToggle = document.getElementById("premiumBadgeHideToggle");
    if (premiumBadgeHideToggle) premiumBadgeHideToggle.addEventListener("change", async () => { await Backend.updateExtraProfileField("hidePremiumBadge", premiumBadgeHideToggle.checked); });
    const shareSiteBtn = document.getElementById("shareSiteBtn");
    if (shareSiteBtn) shareSiteBtn.addEventListener("click", shareReferralLink);
    if (Backend.canModerate()) { loadAdminUserList(); loadAdminBugReports(); }
    area.querySelectorAll(".proficiency-level-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await Backend.updateExtraProfileField("proficiencyLevel", btn.dataset.level);
        showToast("⚖️ Sprachniveau gespeichert — im Profil verankert.");
        renderSettings();
      });
    });
    document.getElementById("settingsApplyBetaBtn")?.addEventListener("click", async () => {
      await Backend.applyForBetaTester();
      showToast("🧪 Anfrage verschickt — der Betreiber schaut sich das an!");
    });
    area.querySelectorAll(".learning-rate-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await setLearningRating(btn.dataset.cat, btn.dataset.rating);
        renderSettings();
      });
    });
    document.getElementById("settingsStressCheck").addEventListener("change", (e) => {
      setStressMode(e.target.checked);
      if (document.getElementById("vocabArea")?.innerHTML) renderVocab();
      if (document.getElementById("accountArea")?.innerHTML) renderAccount();
      renderKompass();
    });
    area.querySelectorAll(".stress-exclude-check").forEach((cb) => {
      cb.addEventListener("change", () => {
        const excluded = new Set(getStressExcludedSections());
        if (cb.checked) excluded.add(cb.dataset.sectionId);
        else excluded.delete(cb.dataset.sectionId);
        setStressExcludedSections([...excluded]);
        if (isStressModeOn()) applyStressEverywhere(true); // sofort neu anwenden
      });
    });
    const muteSoundCheck = document.getElementById("settingsMuteSoundCheck");
    if (muteSoundCheck) {
      muteSoundCheck.addEventListener("change", () => {
        setNotifyMuted(muteSoundCheck.checked);
      });
    }
    const muteBlinkCheck = document.getElementById("settingsMuteBlinkCheck");
    if (muteBlinkCheck) {
      muteBlinkCheck.addEventListener("change", () => {
        setNotifyBlinkMuted(muteBlinkCheck.checked);
        if (muteBlinkCheck.checked && loginBtn) loginBtn.classList.toggle("notify-ring", false);
      });
    }
    area.querySelectorAll("[data-sound-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setNotifySoundKey(btn.dataset.soundKey);
        playNotifySound(btn.dataset.soundKey);
        renderSettings();
      });
    });
    area.querySelectorAll("[data-color-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setNotifyColorKey(btn.dataset.colorKey);
        renderSettings();
      });
    });
    const tickerBlinkCheck = document.getElementById("tickerBlinkCheck");
    if (tickerBlinkCheck) tickerBlinkCheck.addEventListener("change", async () => { await setTickerBlink(tickerBlinkCheck.checked); renderSettings(); });
    area.querySelectorAll(".ticker-speed-btn").forEach((btn) => {
      btn.addEventListener("click", async () => { await setTickerBlinkSpeed(btn.dataset.speed); renderSettings(); });
    });
    area.querySelectorAll(".notify-kind-sound").forEach((sel) => {
      sel.addEventListener("change", () => {
        setNotifyTypeSetting(sel.dataset.kind, "sound", sel.value);
        if (sel.value) playNotifySound(sel.value); // direkt vorhören, was gerade gewählt wurde
      });
    });
    area.querySelectorAll(".notify-kind-color").forEach((sel) => {
      sel.addEventListener("change", () => setNotifyTypeSetting(sel.dataset.kind, "color", sel.value));
    });
    // WICHTIG — behebt einen echten Doppel-Anzeige-Bug: hier stand früher eine ZWEITE, komplett
    // eigenständige "🪲 Gemeldete Fehler"-Box (mit eigenem getBugReports()-Aufruf), zusätzlich zur
    // bereits bestehenden, funktional ausgereifteren Version weiter oben in dieser Datei
    // (loadAdminBugReports() → #adminBugReportsArea, mit Häufigkeits-Auswertung nach Kategorie
    // und ausklappbaren erledigten Meldungen). Beide liefen parallel und zeigten dieselben
    // Meldungen doppelt an. Das einzige Feld, das nur diese zweite Version zeigte (die freie
    // Beschreibung), wurde in die verbleibende Version übernommen — siehe dort.
  }

  // Echte Vorschau eines noch gesperrten Designs — zeigt Beispiel-Elemente (Karte, Button, Text)
  // in den tatsächlichen Farben des Designs, ohne es wirklich zu aktivieren. So weiß man vorher,
  // "wofür man spielt", und kann beim Verschenken gezielt das richtige Design aussuchen.
  // Echte Vollbild-Vorschau: wendet das Design kurz WIRKLICH auf die ganze Seite an (inklusive
  // aller Animationen wie schwimmender Fische oder funkelnder Sterne), OHNE es zu speichern —
  // nach 12 Sekunden (oder auf Wunsch früher) springt automatisch das eigene, echte Design zurück.
  let themeFullPreviewTimer = null;
  // Echte, seltene Erfolgsmomente teilen — NICHT nach jeder Übung, sondern nur bei wirklich
  // besonderen Meilensteinen (erste Trophäe, große Punktzahlen, lange Serien). In diesem Moment
  // erscheint eine warme, persönliche Nachricht, die den Erfolg gemeinsam feiert — und dabei
  // ganz natürlich (nicht als Dauerwerbung) die Möglichkeit zeigt, Danke zu sagen, falls jemand
  // das möchte. Jeder Meilenstein erscheint nur EIN einziges Mal pro Person.
  const POINT_MILESTONES = [50, 200, 500, 1000, 2000, 5000];
  // WICHTIG: im Konto gespeichert, nicht localStorage — sonst feiert das Popup denselben
  // Meilenstein immer wieder neu (z. B. nach dem Leeren des Browser-Caches oder auf einem
  // anderen Gerät), obwohl dabei NIE echte Punkte vergeben werden — nur eine Feier eines
  // bereits erreichten Standes. Genau das erklärte das verwirrende "500 Punkte, die nirgends
  // ankommen"-Gefühl: das Popup feuerte erneut, aber es hatte ja noch nie welche vergeben.
  function getShownMilestones() {
    const profile = Backend.currentProfile();
    return new Set((profile && profile.extraProfileData && profile.extraProfileData.shownMilestones) || []);
  }
  async function markMilestoneShown(key) {
    const shown = getShownMilestones();
    shown.add(key);
    await Backend.updateExtraProfileField("shownMilestones", [...shown]);
  }
  // Dasselbe Prinzip für die einmaligen Spiel-Einstiegsbildschirme (Wackelturm, Wort-Kanone,
  // Wortblasen, Korrektour): der Anzeige-Status war bisher NUR eine flüchtige Javascript-
  // Variable, die bei jedem Seiten-Neuladen (z. B. wenn die Handy-App/der Browser den Tab neu
  // lädt, nachdem man ihn eine Weile verlassen hatte) wieder auf "nicht gesehen" zurückfiel — man
  // landete dann jedes Mal erneut beim Einstiegsbildschirm, obwohl man gerade erst eine Runde
  // gespielt und die Bewertung weggeklickt hatte. Jetzt zusätzlich im Profil gespeichert.
  function hasSeenGameIntro(key) {
    const profile = Backend.currentProfile();
    return ((profile && profile.extraProfileData && profile.extraProfileData.seenGameIntros) || []).includes(key);
  }
  async function markGameIntroSeen(key) {
    const profile = Backend.currentProfile();
    const seen = new Set((profile && profile.extraProfileData && profile.extraProfileData.seenGameIntros) || []);
    if (seen.has(key)) return;
    seen.add(key);
    await Backend.updateExtraProfileField("seenGameIntros", [...seen]);
  }
  function showSpecialMomentModal(title, message) {
    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("div", { class: "profile-modal-card", style: "text-align:center;" },
        Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
        Core.el("p", { style: "font-size:2.2rem; margin:4px 0;" }, "🎉"),
        Core.el("h3", {}, title),
        Core.el("p", { class: "empty-note", style: "margin:10px 0 16px;" }, message),
        Core.el("a", { class: "btn btn-coffee", href: "https://www.paypal.com/paypalme/XanderFox", target: "_blank", rel: "noopener", style: "text-decoration:none;" }, "☕ Danke sagen (freiwillig)"),
        Core.el("button", { type: "button", class: "btn btn-ghost", style: "margin-top:8px;", onclick: () => box.remove() }, "Weiter geht's")
      )
    );
    document.body.appendChild(box);
  }
  // Tages-Ranking-Belohnung: wer heute die Bestleistung erreicht (Platz 1 im Tagesranking), wird
  // einmal am Tag mit ein paar Bonuspunkten belohnt und bekommt eine Nachricht ins Postfach —
  // motiviert, ohne dass es sich wie ein Dauerwettbewerb anfühlt (nur EIN Mal pro Tag möglich).
  async function checkDailyRankingReward() {
    const profile = Backend.currentProfile();
    const user = Backend.currentUser();
    if (!profile || !user) return;
    const todayKey = todayDateKey();
    const lastRewardDate = (profile.extraProfileData && profile.extraProfileData.lastDailyRankRewardDate) || null;
    if (lastRewardDate === todayKey) return;
    const todayRanking = await Backend.getRankingToday();
    if (!todayRanking.length || todayRanking[0].user_id !== user.id) return;
    // Nur belohnen, wenn wirklich mehr als eine Person heute überhaupt mitgemacht hat — sonst
    // ist "Platz 1" nicht wirklich eine Leistung, sondern nur die einzige Person, die heute spielt.
    if (todayRanking.length < 2) return;
    await Backend.updateExtraProfileField("lastDailyRankRewardDate", todayKey);
    saveResultAndCheck({ categories: [], points: 0, bonus: 5, percent: 100, character: "Tagesbester", badges: [], playedAt: new Date().toISOString() });
    Backend.sendSystemMessage(user.id, `🏆 Du bist heute Tagesbeste:r im Ranking! +5 Bonuspunkte als kleines Dankeschön für deinen Einsatz heute — weiter so!`);
    showToast("🏆 Heute Tagesbeste:r! +5 Bonuspunkte");
  }
  async function checkForSpecialMoment(profile) {
    if (!profile) return;
    const shown = getShownMilestones();
    // Punkte-Meilensteine
    for (const m of POINT_MILESTONES) {
      const key = `points-${m}`;
      if (profile.points >= m && !shown.has(key)) {
        await markMilestoneShown(key);
        showSpecialMomentModal(
          `Insgesamt schon ${m} Punkte gesammelt!`,
          `Schön, dass du dabeibleibst und so fleißig übst — das ist ein echter Meilenstein! Ich freu mich, dass dir die Seite hilft.`
        );
        return; // nur einen Moment gleichzeitig zeigen, nicht mehrere übereinander
      }
    }
    // Erste Trophäe überhaupt (Pokal, also die "großen" Erfolge — siehe trophyKind())
    const hasPokal = (profile.trophies || []).some((t) => trophyKind(t) === "pokal");
    if (hasPokal && !shown.has("first-pokal")) {
      await markMilestoneShown("first-pokal");
      showSpecialMomentModal(
        "Dein erster großer Pokal!",
        "Das ist eine richtige Meisterleistung — herzlichen Glückwunsch! Solche Momente sind genau der Grund, warum ich diese Seite mit Freude weiterpflege."
      );
      return;
    }
    // Lange Serien (Login-Streak)
    let streak = 0;
    const streakProfile = Backend.currentProfile();
    streak = Number((streakProfile && streakProfile.extraProfileData && streakProfile.extraProfileData.calendarStreak) || 0);
    for (const days of [7, 30, 100]) {
      const key = `streak-${days}`;
      if (streak >= days && !shown.has(key)) {
        await markMilestoneShown(key);
        showSpecialMomentModal(
          `${days} Tage am Stück!`,
          "Diese Beständigkeit ist beeindruckend — genau so lernt man eine Sprache wirklich. Danke, dass du so treu dabei bist!"
        );
        return;
      }
    }
  }
  // Zentraler Wrapper um Backend.saveResult — ruft danach automatisch die Erfolgsmoment-Prüfung
  // auf, damit ich das nicht an jeder der (vielen) Vergabestellen einzeln vergessen kann.
  // Sprachniveau-Fairness: beeinflusst NICHT den frei wählbaren Schwierigkeitsgrad, sondern nur
  // wie schnell Punkte/Missionen/Level voranschreiten — damit ein:e Anfänger:in genauso gute
  // Fortschritts-Chancen hat wie ein:e Muttersprachler:in, für die die Inhalte trivial leicht sind.
  const PROFICIENCY_MULTIPLIERS = { anfaenger: 1.3, fortgeschritten: 1.0, profi: 0.8, muttersprache: 0.6 };
  const PROFICIENCY_BADGE = { anfaenger: "🌱 Anfänger:in", fortgeschritten: "📈 Fortgeschritten", profi: "🎯 Profi", muttersprache: "🌟 Muttersprachler:in" };
  function getProficiencyLevel() {
    const profile = Backend.currentProfile();
    return (profile && profile.extraProfileData && profile.extraProfileData.proficiencyLevel) || "fortgeschritten";
  }
  async function saveResultAndCheck(result) {
    const factor = PROFICIENCY_MULTIPLIERS[getProficiencyLevel()] || 1.0;
    const adjusted = { ...result, points: Math.round((result.points || 0) * factor), bonus: Math.round((result.bonus || 0) * factor) };
    const profileBefore = Backend.currentProfile();
    const unlockedBefore = profileBefore ? new Set(COLLECTIBLE_FIGURES.filter((f) => isFigureUnlocked(f, profileBefore)).map((f) => f.id)) : new Set();
    // WICHTIG: auf den vollständigen Abschluss von saveResult() warten, BEVOR das Profil danach
    // gelesen wird — saveResult() aktualisiert die Punkte erst NACH einer asynchronen
    // Datenbankabfrage (um Wettlaufbedingungen bei mehreren gleichzeitig offenen Geräten zu
    // vermeiden). Ohne await konnte profileAfter hier gelesen werden, bevor die Punkte wirklich
    // aktualisiert waren — was die Freischalt-Prüfung mit noch veralteten Daten laufen ließ und
    // zu den gemeldeten, fälschlich wiederholten "neu freigeschaltet"-Meldungen führen konnte.
    await Backend.saveResult(adjusted);
    const profileAfter = Backend.currentProfile();
    if (profileAfter) {
      const newlyUnlocked = COLLECTIBLE_FIGURES.filter((f) => !unlockedBefore.has(f.id) && isFigureUnlocked(f, profileAfter));
      // Dauerhaft merken, DASS diese Figuren jetzt freigeschaltet sind — sonst könnte dieselbe
      // Figur bei einem späteren Aufruf erneut als "neu" gemeldet werden, falls die Live-Prüfung
      // der Bedingung aus irgendeinem Grund (z. B. Timing bei noch nicht vollständig geladenen
      // Verlaufsdaten) kurzzeitig wieder "nicht erfüllt" ergibt.
      newlyUnlocked.forEach((f) => Backend.addCollectedFigure(f.id));
      // Sequenziell nacheinander zeigen — das NÄCHSTE Popup erscheint erst, nachdem das vorherige
      // wirklich geschlossen wurde, nicht nach einem festen Timer. Bei mehreren gleichzeitig
      // freigeschalteten Füchsen konnten sich die Popups bisher sonst überlappend stapeln (wenn
      // man zum Lesen länger als 600ms brauchte), wodurch "Weiter"/"Super!" scheinbar nichts tat
      // — man sah nur weiterhin ein (aber ein ANDERES, schon darunterliegendes) Popup.
      showFoxUnlockCelebrationQueue(newlyUnlocked, 400);
      // Zusätzlich auch als Postfach-Nachricht — bei mehreren gleichzeitig freigeschalteten
      // Füchsen (z. B. drei auf einmal in einer Runde) als EINE zusammengefasste Nachricht, nicht
      // drei einzelne.
      if (newlyUnlocked.length === 1) {
        Backend.sendSystemMessage(Backend.currentUser().id, `🦊 Neuer Fuchs freigeschaltet: „${newlyUnlocked[0].name}"! ${newlyUnlocked[0].desc}`);
      } else if (newlyUnlocked.length > 1) {
        Backend.sendSystemMessage(Backend.currentUser().id, `🦊 Gleich ${newlyUnlocked.length} neue Füchse auf einmal freigeschaltet: ${newlyUnlocked.map((f) => `„${f.name}"`).join(", ")}!`);
      }
    }
    await checkForSpecialMoment(Backend.currentProfile());
    await checkDailyRankingReward();
    // ECHTES Warten statt eines geratenen Timeouts — sonst kommt Sound & Leuchten der Profil-Pille
    // bei einem Meilenstein bis zu 20 Sekunden verzögert (Hintergrund-Timer), statt sofort.
    checkNotifications();
  }
  // Kleines Glückwunsch-Popup mit dem Bild und dem genauen Namen des neu freigeschalteten Fuchses
  // — statt dass die Freischaltung einfach lautlos im Hintergrund passiert.
  // Zeigt mehrere Fuchs-Freischalt-Popups NACHEINANDER — das nächste startet erst, wenn das
  // aktuelle wirklich geschlossen wurde (Knopf ODER Klick daneben), nicht nach einem festen Timer.
  function showFoxUnlockCelebrationQueue(figures, initialDelay) {
    if (!figures.length) return;
    let i = 0;
    const showNext = () => {
      if (i >= figures.length) return;
      const fig = figures[i];
      i += 1;
      showFoxUnlockCelebration(fig, showNext);
    };
    setTimeout(showNext, initialDelay || 0);
  }
  function showFoxUnlockCelebration(fig, onClosed) {
    Core.sound.fanfare();
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `
      <div class="profile-modal-card" style="text-align:center;">
        <p style="font-size:1.6rem; margin-bottom:4px;">🎉 Glückwunsch!</p>
        <img src="${fig.img}" alt="${fig.name}" style="width:140px; height:140px; object-fit:contain; margin:10px auto; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.2));" />
        <h3 style="margin:6px 0;">Du hast den ${fig.name} freigeschaltet!</h3>
        <p class="empty-note">${fig.desc}</p>
        <button type="button" class="btn btn-coffee" style="margin-top:14px;" id="foxCelebrationCloseBtn">Super!</button>
      </div>`;
    document.body.appendChild(box);
    const close = () => { box.remove(); if (onClosed) onClosed(); };
    document.getElementById("foxCelebrationCloseBtn").addEventListener("click", close);
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
  }
  function startFullPageThemePreview(themeId) {
    if (themeFullPreviewTimer) return; // schon eine Vorschau aktiv -> nicht überlappen lassen
    const profile = Backend.currentProfile();
    const realTheme = (profile && profile.theme) || sessionTheme;
    document.documentElement.setAttribute("data-theme", themeId);
    let secondsLeft = 12;
    const banner = Core.el("div", { class: "toast-popup toast-visible", id: "themePreviewBanner",
      style: "bottom:auto; top:16px; z-index:9999; display:flex; align-items:center; gap:10px;" },
      Core.el("span", { id: "themePreviewCountdown" }, `👁️ Vorschau läuft noch ${secondsLeft}s …`),
      Core.el("button", { type: "button", class: "btn btn-ghost", style: "padding:4px 10px; font-size:0.78rem;", onclick: () => endFullPageThemePreview(realTheme) }, "Jetzt beenden")
    );
    document.body.appendChild(banner);
    themeFullPreviewTimer = setInterval(() => {
      secondsLeft -= 1;
      const el = document.getElementById("themePreviewCountdown");
      if (el) el.textContent = `👁️ Vorschau läuft noch ${secondsLeft}s …`;
      if (secondsLeft <= 0) endFullPageThemePreview(realTheme);
    }, 1000);
  }
  function endFullPageThemePreview(realTheme) {
    if (themeFullPreviewTimer) { clearInterval(themeFullPreviewTimer); themeFullPreviewTimer = null; }
    document.documentElement.setAttribute("data-theme", realTheme || "bastelheft");
    document.getElementById("themePreviewBanner")?.remove();
  }
  function openThemePreviewModal(themeId) {
    const theme = THEMES.find((t) => t.id === themeId);
    if (!theme) return;
    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("div", { class: "profile-modal-card", "data-theme": themeId },
        Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
        Core.el("p", { class: "eyebrow", style: "text-align:center;" }, `${theme.emoji} ${theme.name}`),
        Core.el("p", { class: "empty-note", style: "text-align:center; margin-bottom:14px;" }, theme.desc),
        // Kleine Muster-Oberfläche mit mehreren typischen Bausteinen gleichzeitig sichtbar — zeigt
        // auf einen Blick, wie Schriftart, Panels, Schaltflächen, Schatten und Farben zusammen
        // wirken, statt nur einen einzelnen Knopf zu zeigen.
        Core.el("div", { class: "question-card", style: "margin:10px 0;" },
          Core.el("h3", { style: "margin:0 0 8px;" }, "Beispiel-Überschrift"),
          Core.el("p", { style: "margin:0 0 10px;" }, "So sieht normaler Fließtext mit diesem Design aus — inklusive der gewählten Schriftart."),
          Core.el("div", { style: "display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;" },
            Core.el("button", { type: "button", class: "btn btn-coffee" }, "Beispiel-Knopf"),
            Core.el("button", { type: "button", class: "btn btn-ghost" }, "Zurückhaltender Knopf")
          ),
          Core.el("div", { class: "trophy-case", style: "margin-bottom:10px;" },
            Core.el("div", { class: "trophy-chip" }, "🏆 Beispiel-Pokal"),
            Core.el("div", { class: "trophy-chip" }, "🎖️ Beispiel-Orden")
          ),
          Core.el("div", { class: "breakdown-row" },
            Core.el("span", {}, "Beispiel-Zeile mit Schatten/Panel-Look"),
            Core.el("span", { class: "empty-note" }, "so wirkt's")
          )
        ),
        Core.el("button", { type: "button", class: "btn btn-coffee", style: "margin-top:14px; width:100%;", onclick: () => { box.remove(); startFullPageThemePreview(themeId); } }, "🔍 12 Sek. auf der ganzen Seite testen (mit Animationen)")
      )
    );
    document.body.appendChild(box);
  }
  function renderDesign() {
    const area = document.getElementById("designArea");
    if (!area) return;
    const profile = Backend.currentProfile();
    const active = (profile && profile.theme) || sessionTheme;
    const themeCard = (t) => {
      const unlocked = isThemeUnlocked(t, profile);
      const conditionText = !t.unlock ? "" : t.unlock.type === "points" ? `Ab ${t.unlock.value} Punkten` : `Pokal „${t.unlock.match}" nötig`;
      return `
      <div class="category-card ${t.id === active ? "selected" : ""} ${!unlocked ? "theme-locked" : ""}" data-theme-pick="${unlocked ? t.id : ""}" ${!unlocked ? `data-locked-info="🔒 ${conditionText}"` : ""}>
        <div class="cat-checkbox">${t.id === active ? "✓" : unlocked ? "" : "🔒"}</div>
        <div class="cat-body">
          <div class="cat-title-row"><span class="cat-icon">${t.emoji}</span><span>${t.name}</span></div>
          <div class="cat-info-text open">${unlocked ? t.desc : conditionText}</div>
        </div>
        ${!unlocked ? `<button type="button" class="btn btn-ghost theme-preview-btn" data-preview-theme="${t.id}" style="margin-top:6px; font-size:0.75rem; padding:4px 10px;">👁️ Vorschau ansehen</button>` : ""}
      </div>`;
    };
    area.innerHTML = `
      <p class="empty-note">Wähle dein Lieblings-Design — wirkt sofort auf der ganzen Seite. Gesperrte Designs sind Geschenke fürs Weiterlernen — einfach fleißig üben!</p>
      <p class="eyebrow" style="margin-top:16px;">🔤 Schriftart für Überschriften</p>
      <div class="trophy-case" style="margin-bottom:8px;">
        ${Object.entries(HEADING_FONT_PRESETS).map(([key, p]) => {
          const unlocked = (profile?.points || 0) >= p.unlockPoints;
          const active2 = getHeadingFontKey() === key;
          return `<button type="button" class="trophy-chip notify-preset-btn ${active2 ? "selected" : ""} ${!unlocked ? "trophy-chip-locked" : ""}" data-font-key="${key}" style="font-family:${p.css};" ${!unlocked ? "disabled" : ""}>${p.label}${!unlocked ? ` 🔒 ${p.unlockPoints}P` : ""}</button>`;
        }).join("")}
      </div>
      <p class="eyebrow" style="margin-top:16px;">☀️ Helle Designs</p>
      <div class="category-grid">
        ${THEMES.filter((t) => t.mode === "hell").map(themeCard).join("")}
      </div>
      <p class="eyebrow" style="margin-top:20px;">🌙 Dunkle Designs</p>
      <div class="category-grid">
        ${THEMES.filter((t) => t.mode === "dunkel").map(themeCard).join("")}
      </div>
    `;
    area.querySelectorAll("[data-preview-theme]").forEach((btn) => {
      btn.addEventListener("click", () => openThemePreviewModal(btn.dataset.previewTheme));
    });
    area.querySelectorAll("[data-font-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setHeadingFontKey(btn.dataset.fontKey);
        renderDesign();
      });
    });
    area.querySelectorAll("[data-theme-pick]").forEach((card) => {
      if (!card.dataset.themePick) {
        card.addEventListener("click", () => alert(card.dataset.lockedInfo || "Dieses Design ist noch gesperrt."));
        return;
      }
      card.addEventListener("click", () => {
        applyTheme(card.dataset.themePick);
        renderDesign();
      });
    });
  }

  /* ============ Uhr (analog) & Wetter ============ */
  const clockOut = document.getElementById("clockOut");
  const hourHand = document.getElementById("clockHour");
  const minuteHand = document.getElementById("clockMinute");
  function updateClock() {
    const now = new Date();
    const berlin = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
    const h = berlin.getHours() % 12;
    const m = berlin.getMinutes();
    if (hourHand) hourHand.style.transform = `rotate(${h * 30 + m * 0.5}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${m * 6}deg)`;
    if (clockOut) clockOut.textContent = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" }).format(now);
    updateDaytimeSky(berlin.getHours() * 60 + berlin.getMinutes());
  }

  // Tageszeiten-Himmel: verläuft fließend über den ganzen Tag statt harter Umschaltpunkte
  const SKY_STOPS = [
    { t: 0,    top: [12,16,36],  bottom: [27,32,68],   text: [207,224,255], dark: 1 },
    { t: 330,  top: [12,16,36],  bottom: [27,32,68],   text: [207,224,255], dark: 1 },   // 05:30 noch Nacht
    { t: 420,  top: [247,185,140], bottom: [234,246,255], text: [122,61,22], dark: 0.35 }, // 07:00 Dämmerung
    { t: 540,  top: [143,197,240], bottom: [234,246,255], text: [12,74,114], dark: 0 },   // 09:00 Tag
    { t: 1020, top: [143,197,240], bottom: [234,246,255], text: [12,74,114], dark: 0 },   // 17:00 noch Tag
    { t: 1140, top: [107,74,138],  bottom: [232,135,95], text: [255,243,230], dark: 0.55 }, // 19:00 Abenddämmerung
    { t: 1290, top: [27,32,68],   bottom: [58,47,90],   text: [207,224,255], dark: 0.9 }, // 21:30 wird Nacht
    { t: 1439, top: [12,16,36],  bottom: [27,32,68],   text: [207,224,255], dark: 1 },
  ];
  function lerp(a, b, f) { return a + (b - a) * f; }
  function lerpColor(a, b, f) {
    return [Math.round(lerp(a[0], b[0], f)), Math.round(lerp(a[1], b[1], f)), Math.round(lerp(a[2], b[2], f))];
  }
  function updateDaytimeSky(minutes) {
    const bar = document.getElementById("deckDisplay");
    if (!bar) return;
    let a = SKY_STOPS[0], b = SKY_STOPS[SKY_STOPS.length - 1];
    for (let i = 0; i < SKY_STOPS.length - 1; i++) {
      if (minutes >= SKY_STOPS[i].t && minutes <= SKY_STOPS[i + 1].t) {
        a = SKY_STOPS[i]; b = SKY_STOPS[i + 1];
        break;
      }
    }
    const span = b.t - a.t || 1;
    const f = Core.clamp((minutes - a.t) / span, 0, 1);
    const top = lerpColor(a.top, b.top, f);
    const bottom = lerpColor(a.bottom, b.bottom, f);
    const text = lerpColor(a.text, b.text, f);
    const dark = lerp(a.dark, b.dark, f);
    bar.style.background = `linear-gradient(180deg, rgb(${top.join(",")}), rgb(${bottom.join(",")}))`;
    bar.style.color = `rgb(${text.join(",")})`;
    const stars = document.getElementById("starsLayer");
    if (stars) stars.style.opacity = Math.max(0, (dark - 0.6) / 0.4);

    // Uhr & Temperaturzahl: stufenlos von Schwarz (hell) zu Weiß (dunkel), passend zur echten Helligkeit
    const shade = Math.round(lerp(20, 245, dark)); // dunkler Text bei Tag, heller Text bei Nacht
    const rimShade = Math.round(lerp(30, 255, dark));
    document.documentElement.style.setProperty("--sky-ink", `rgb(${shade},${shade},${shade})`);
    document.documentElement.style.setProperty("--sky-ink-soft", `rgba(${rimShade},${rimShade},${rimShade},0.55)`);
  }

  updateClock();
  setInterval(updateClock, 15000);

  /* ============ Feiertage & Geburtstag ============ */
  const GERMAN_HOLIDAYS = {
    "01-01": "🎉 Neujahr",
    "05-01": "🛠️ Tag der Arbeit",
    "10-03": "🇩🇪 Tag der Deutschen Einheit",
    "10-31": "📜 Reformationstag",
    "12-06": "🎅 Nikolaus",
    "12-24": "🎄 Heiligabend",
    "12-25": "🎄 1. Weihnachtstag",
    "12-26": "🎄 2. Weihnachtstag",
    "12-31": "🎆 Silvester",
  };

  /* ============================================================
     ABREISSKALENDER — Mini-Symbol im Header + große Modal-Ansicht
     mit Umdreh-Animation und Tagestipp (Betonung, Grammatik, Scherz)
     ============================================================ */
  const MONTH_NAMES_SHORT = ["JAN", "FEB", "MÄR", "APR", "MAI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEZ"];
  const MONTH_NAMES_LONG = ["JANUAR", "FEBRUAR", "MÄRZ", "APRIL", "MAI", "JUNI", "JULI", "AUGUST", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DEZEMBER"];
  const WEEKDAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

  // Sternzeichen — klassische geschwungene Symbole (Glyphen-Zeichen, nicht ausgemalt/detailliert,
  // wie im Original üblich), automatisch aus dem Geburtsdatum berechnet.
  const ZODIAC_SIGNS = [
    { name: "Steinbock", from: [12, 22], to: [1, 19], svg: `<path d="M4 14 Q4 8 8 8 Q11 8 11 11 Q11 14 8 14 M8 14 L8 20 Q8 23 11 23 Q13 23 13 21 L13 4 Q13 2 15 2 Q17 2 17 5 Q17 7 15 7" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    { name: "Wassermann", from: [1, 20], to: [2, 18], svg: `<path d="M2 8 Q5 5 8 8 Q11 11 14 8 Q17 5 20 8 M2 16 Q5 13 8 16 Q11 19 14 16 Q17 13 20 16" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    { name: "Fische", from: [2, 19], to: [3, 20], svg: `<path d="M5 3 Q2 8 5 13 Q8 18 5 21 M19 3 Q22 8 19 13 Q16 18 19 21 M5 12 L19 12" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    { name: "Widder", from: [3, 21], to: [4, 19], svg: `<path d="M6 4 Q2 4 2 8 Q2 11 6 11 Q6 6 12 12 Q18 6 18 11 Q22 11 22 8 Q22 4 18 4 M12 12 L12 22" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    { name: "Stier", from: [4, 20], to: [5, 20], svg: `<circle cx="12" cy="15" r="7" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M5 6 Q7 2 12 4 Q17 2 19 6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    { name: "Zwillinge", from: [5, 21], to: [6, 20], svg: `<path d="M6 3 L6 21 M18 3 L18 21 M4 3 L20 3 M4 21 L20 21" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    { name: "Krebs", from: [6, 21], to: [7, 22], svg: `<path d="M17 6 Q22 6 22 11 Q22 15 17 14 M7 18 Q2 18 2 13 Q2 9 7 10" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="17" cy="14" r="1.6" fill="currentColor"/><circle cx="7" cy="10" r="1.6" fill="currentColor"/>` },
    { name: "Löwe", from: [7, 23], to: [8, 22], svg: `<path d="M4 8 Q4 4 8 4 Q12 4 11 9 Q10 13 14 13 Q19 13 19 18 Q19 22 15 21" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="15" cy="21" r="1.6" fill="currentColor"/>` },
    { name: "Jungfrau", from: [8, 23], to: [9, 22], svg: `<path d="M3 4 L3 16 Q3 20 7 20 Q10 20 10 16 L10 8 Q10 4 14 4 Q18 4 18 8 L18 18 M14 22 Q18 22 18 18" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>` },
    { name: "Waage", from: [9, 23], to: [10, 22], svg: `<path d="M3 18 L21 18 M12 3 Q7 3 7 8 Q7 12 12 12 Q17 12 17 8 Q17 3 12 3 M5 14 Q5 18 9 18 M19 14 Q19 18 15 18" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    { name: "Skorpion", from: [10, 23], to: [11, 21], svg: `<path d="M3 4 L3 18 Q3 21 6 21 M11 4 L11 18 Q11 21 14 21 L19 21 L16 18 M19 21 L16 24" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    { name: "Schütze", from: [11, 22], to: [12, 21], svg: `<path d="M4 20 L20 4 M20 4 L12 4 M20 4 L20 12 M10 14 L4 20" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
  ];
  function zodiacFor(birthday) {
    if (!birthday || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return null;
    const [, m, d] = birthday.split("-").map(Number);
    return ZODIAC_SIGNS.find((z) => {
      const [fm, fd] = z.from, [tm, td] = z.to;
      if (fm === tm) return m === fm && d >= fd && d <= td;
      return (m === fm && d >= fd) || (m === tm && d <= td); // Zeichen über den Jahreswechsel (Steinbock)
    }) || null;
  }
  function zodiacBadgeHtml(birthday) {
    const z = zodiacFor(birthday);
    if (!z) return "";
    return `<span class="zodiac-badge" title="${z.name}"><svg viewBox="0 0 24 24" width="16" height="16">${z.svg}</svg> ${z.name}</span>`;
  }
  // Aktuelles Alter aus dem Geburtsdatum berechnen — berücksichtigt korrekt, ob der Geburtstag
  // dieses Jahr schon war oder noch bevorsteht (nicht einfach nur Jahreszahlen subtrahieren).
  function calculateAge(birthday) {
    if (!birthday || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) return null;
    const birth = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const hasHadBirthdayThisYear = (today.getMonth() > birth.getMonth()) || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;
    return age >= 0 && age < 130 ? age : null;
  }
  // Geschlechtssymbol — klassische astronomische Zeichen, optional vom Profil-Inhaber gewählt.
  const GENDER_SYMBOLS = {
    // Bewusst feste, klassische Farben statt currentColor (geerbte Textfarbe) — blau für
    // männlich, rosa für weiblich, wie ausdrücklich gewünscht.
    maennlich: { label: "männlich", color: "#4A90D9", svg: `<circle cx="10" cy="14" r="6" stroke="#4A90D9" stroke-width="1.6" fill="none"/><path d="M14.2 9.8 L20 4 M14 4 L20 4 L20 10" stroke="#4A90D9" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    weiblich: { label: "weiblich", color: "#E85A9C", svg: `<circle cx="12" cy="9" r="6" stroke="#E85A9C" stroke-width="1.6" fill="none"/><path d="M12 15 L12 22 M8.5 19 L15.5 19" stroke="#E85A9C" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    divers: { label: "divers", color: "#B084CC", svg: `<circle cx="12" cy="10" r="6" stroke="#B084CC" stroke-width="1.6" fill="none"/><path d="M12 16 L12 22 M9 19 L15 19 M16.2 5.8 L21 1 M16 1 L21 1 L21 6" stroke="#B084CC" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
  };
  function genderBadgeHtml(key) {
    const g = GENDER_SYMBOLS[key];
    if (!g) return "";
    return `<span class="zodiac-badge" title="${g.label}"><svg viewBox="0 0 24 24" width="16" height="16">${g.svg}</svg> ${g.label}</span>`;
  }
  // Kompakte Variante — nur das reine Symbol, ohne Hintergrund-Pille und Text-Label. Passend für
  // die Überschriftenzeile direkt neben Name und Alter (wie bei Profilen sonst üblich:
  // "Name, Alter ♂"), statt als eigene, große Badge weiter unten zu stehen.
  function genderSymbolCompact(key) {
    const g = GENDER_SYMBOLS[key];
    if (!g) return "";
    return `<svg viewBox="0 0 24 24" width="20" height="20" style="vertical-align:middle;" title="${g.label}">${g.svg}</svg>`;
  }

  function updateCalendarWidget() {
    const now = new Date();
    const miniMonth = document.getElementById("calMiniMonth");
    const miniDay = document.getElementById("calMiniDay");
    if (miniMonth) miniMonth.textContent = MONTH_NAMES_SHORT[now.getMonth()];
    if (miniDay) miniDay.textContent = now.getDate();
  }
  // Echte Tagesaufgabe fürs Kalenderblatt — nutzt dieselbe geprüfte Wortliste, gibt Bonuspunkte
  // bei richtiger Antwort (getrennt vom reinen Info-Tipp).
  // Nutzungsverhalten-Auswertung: welche Kategorie spielt die Person am häufigsten? Grundlage
  // sind nur ihre eigenen, tatsächlich gespielten Kategorien (profile.history) — keine Vermutung
  // über die Person, nur eine schlichte Häufigkeitszählung der von ihr selbst gewählten Übungen.
  function analyzeFocusCategory() {
    const profile = Backend.currentProfile();
    if (!profile || !profile.history || profile.history.length < 3) return null;
    const stats = {}; // { count, totalPercent }
    profile.history.forEach((h) => {
      (h.categories || []).forEach((catId) => {
        if (!stats[catId]) stats[catId] = { count: 0, totalPercent: 0 };
        stats[catId].count += 1;
        stats[catId].totalPercent += (h.percent || 0);
      });
    });
    const total = Object.values(stats).reduce((s, v) => s + v.count, 0);
    if (!total) return null;
    // Zwei mögliche Schwerpunkte: entweder eine Kategorie, in der die Ergebnisse noch schwächer
    // sind (echte Unterstützung, wo sie gebraucht wird) — das hat Vorrang, weil es am meisten
    // hilft — oder, falls die Ergebnisse überall ähnlich gut sind, einfach die meistgespielte
    // Kategorie (reines Interesse).
    const weakCandidates = Object.entries(stats)
      .filter(([, s]) => s.count >= 2)
      .map(([id, s]) => ({ id, avgPercent: Math.round(s.totalPercent / s.count), count: s.count }))
      .filter((c) => c.avgPercent < 60)
      .sort((a, b) => a.avgPercent - b.avgPercent);
    const labelFor = (id) => {
      const cat = ExerciseData.getCategory(id);
      return cat ? cat.title : { wortbaustelle: "Wortbaustelle", buchstabensalat: "Buchstabensalat", kreuzwortraetsel: "Kreuzworträtsel" }[id] || id;
    };
    if (weakCandidates.length) {
      const w = weakCandidates[0];
      return { id: w.id, label: labelFor(w.id), percent: w.avgPercent, kind: "weak" };
    }
    const [topId, topStat] = Object.entries(stats).sort((a, b) => b[1].count - a[1].count)[0];
    const playPercent = Math.round((topStat.count / total) * 100);
    if (playPercent < 25) return null; // kein klarer Schwerpunkt erkennbar
    return { id: topId, label: labelFor(topId), percent: playPercent, kind: "frequent" };
  }
  function todayDateKey() {
    // WICHTIG: NICHT toISOString() verwenden — das gibt die UTC-Zeit zurück, nicht die lokale
    // deutsche Zeit. Da Deutschland der UTC-Zeit voraus ist, hätte das für 1-2 Stunden nach
    // Mitternacht (lokal) noch das GESTRIGE Datum gezeigt — dadurch konnte die Tagesaufgabe nach
    // erneutem Einloggen fälschlich wieder als "nicht gelöst" erscheinen.
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function dayOfYearIndex(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / 86400000); // 1 = 1. Januar, bis zu 366
  }
  // Großer, kombinierter Fragen-Pool aus ALLEN Übungskategorien (über 2800 Fragen insgesamt) —
  // so kann jedem Kalendertag im Jahr eine FESTE, unterschiedliche Aufgabe zugeordnet werden,
  // die sich innerhalb eines Jahres nie wiederholt (statt einer zufälligen Auswahl, die schon
  // nach wenigen Wochen wieder dieselbe Frage hätte zeigen können).
  let dailyTaskPoolCache = null;
  function buildDailyTaskPool() {
    if (dailyTaskPoolCache) return dailyTaskPoolCache;
    const pool = [];
    const seenPrompts = new Set();
    ExerciseData.CATEGORIES.forEach((cat) => {
      try {
        const bank = cat.getBank();
        bank.forEach((q) => {
          if (q.options && q.correct && q.correct.length === 1 && q.options.length >= 2 && !seenPrompts.has(q.prompt)) {
            seenPrompts.add(q.prompt);
            // "Artikel"-Fragen sind sehr knapp ("___ Regen") und brauchen ohne die sonstige
            // Übungsoberfläche drumherum eine kurze Erklärung, damit klar ist, was gefragt wird.
            const promptText = cat.id === "artikel"
              ? `Welcher Artikel gehört zu „${q.prompt.replace("___ ", "")}"?`
              : q.prompt.replace("___", "…");
            pool.push({ word: promptText, options: q.options, correctIdx: q.correct[0] });
          }
        });
      } catch (e) { /* Kategorien, die nicht kompatibel sind, überspringen */ }
    });
    dailyTaskPoolCache = pool;
    return pool;
  }
  function pickDailyTask() {
    // Pro Tag genau eine Aufgabe — wird beim ersten Öffnen erzeugt und im Profil gespeichert,
    // damit sie bei erneutem Öffnen (auch auf einem anderen Gerät) exakt dieselbe bleibt.
    const profile = Backend.currentProfile();
    const extra = (profile && profile.extraProfileData) || {};
    if (extra.dailyTaskCacheDate === todayDateKey() && extra.dailyTaskCache) return extra.dailyTaskCache;
    const task = pickDailyTaskFresh();
    Backend.updateExtraProfileField("dailyTaskCacheDate", todayDateKey());
    Backend.updateExtraProfileField("dailyTaskCache", task);
    return task;
  }
  function pickDailyTaskFresh() {
    // Selbsteinschätzung hat Vorrang vor der automatisch aus dem Spielverhalten erkannten
    // Schwäche — die Person hat das aktiv selbst angegeben, das ist die klarste Absicht.
    const focus = selfAssessedWeakCategory() || analyzeFocusCategory();
    const dayIdx = dayOfYearIndex(new Date());
    // Echte Personalisierung: gibt es einen erkannten Übungs-Schwerpunkt UND liefert dessen
    // Kategorie eine normale Fragen-Bank, wird die Tagesaufgabe direkt daraus gezogen — man übt
    // dann wirklich genau das, was man ohnehin am meisten spielt. Auswahl INNERHALB der
    // Kategorie ist ebenfalls fest an den Kalendertag gekoppelt, nicht zufällig.
    if (focus) {
      const cat = ExerciseData.getCategory(focus.id);
      if (cat && typeof cat.getBank === "function") {
        try {
          const bank = cat.getBank().filter((q) => q.options && q.correct && q.correct.length === 1);
          if (bank.length) {
            const q = bank[dayIdx % bank.length];
            const promptText = focus.id === "artikel"
              ? `Welcher Artikel gehört zu „${q.prompt.replace("___ ", "")}"?`
              : q.prompt.replace("___", "…");
            return { word: promptText, options: q.options, correctIdx: q.correct[0], focus, isPersonalized: true };
          }
        } catch (e) { /* falls eine Kategorie nicht kompatibel ist, einfach auf Standard zurückfallen */ }
      }
    }
    const pool = buildDailyTaskPool();
    const picked = pool[dayIdx % pool.length];
    return { ...picked, focus };
  }
  // Großer, kombinierter Tipp-Pool — kombiniert alle bereits geprüften Erklärungsquellen der
  // Seite (feste Info-Tipps, Betonungsregeln aus dem Wortschatz, Redewendungen, Partikeln,
  // Jugendsprache), damit jeder Kalendertag einen ANDEREN Tipp bekommt statt sich schon nach
  // wenigen Wochen zu wiederholen. Auswahl ist wie bei der Tagesaufgabe fest an den Kalendertag
  // gekoppelt, nicht zufällig.
  let dailyTipPoolCache = null;
  function buildDailyTipPool() {
    if (dailyTipPoolCache) return dailyTipPoolCache;
    const pool = [...ExerciseData.DAILY_TIPS];
    Object.entries(ExerciseData.WORD_SYL || {}).forEach(([word, syl]) => {
      if (syl.includes("-")) pool.push({ text: `Bei „${word}" wird betont: ${stressHtml(syl)}.` });
    });
    (VocabData.WORDS || []).forEach((w) => {
      if (w.syl && w.syl.includes("-")) pool.push({ text: `Bei „${w.word}" wird betont: ${stressHtml(w.syl)}.` });
    });
    (ExerciseData.REDEWENDUNGEN || []).forEach(([phrase, meaning]) => {
      pool.push({ text: `Redewendung „${phrase}" bedeutet: ${meaning}` });
    });
    (VocabData.PARTIKELN || []).forEach((p) => {
      pool.push({ text: `Das kleine Wort „${p.word}": ${p.explain}` });
    });
    (VocabData.JUGENDSPRACHE || []).forEach((j) => {
      pool.push({ text: `Jugendsprache „${j.word}": ${j.explain}` });
    });
    dailyTipPoolCache = pool;
    return pool;
  }
  function pickDailyTip() {
    const pool = buildDailyTipPool();
    const dayIdx = dayOfYearIndex(new Date());
    return pool[dayIdx % pool.length];
  }
  // Für den "Anderen Tipp"-Button — zum Durchblättern, unabhängig vom festen Tagestipp oben.
  function pickRandomTip() {
    const pool = buildDailyTipPool();
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function openCalendarModal() {
    const now = new Date();
    document.getElementById("calModalMonth").textContent = MONTH_NAMES_LONG[now.getMonth()];
    document.getElementById("calModalDay").textContent = now.getDate();
    document.getElementById("calModalWeekday").textContent = WEEKDAY_NAMES[now.getDay()];
    cwCalendarTask = pickDailyTask();
    renderCalendarBack();
    document.getElementById("calendarModalPage").classList.remove("torn");
    document.getElementById("calendarModalOverlay").style.display = "flex";
  }
  let cwCalendarTask = null;
  function isDailyTaskSolvedToday() {
    const profile = Backend.currentProfile();
    if (!profile) return false;
    const extra = profile.extraProfileData || {};
    return extra.dailyTaskAttemptedDate === todayDateKey();
  }
  function getDailyTaskAttemptResult() {
    const profile = Backend.currentProfile();
    if (!profile) return null;
    const extra = profile.extraProfileData || {};
    return extra.dailyTaskAttemptedDate === todayDateKey() ? extra.dailyTaskAttemptedResult : null;
  }
  async function markDailyTaskAttempted(wasCorrect) {
    await Backend.updateExtraProfileField("dailyTaskAttemptedDate", todayDateKey());
    await Backend.updateExtraProfileField("dailyTaskAttemptedResult", wasCorrect ? "correct" : "wrong");
  }
  // Deutsche gesetzliche Feiertage, die bundesweit gelten (bewusst NUR die wirklich in allen 16
  // Bundesländern geltenden — Landes-spezifische wie Fronleichnam, Reformationstag o.ä. würden je
  // nach Bundesland unterschiedlich sein und sind hier nicht verlässlich ohne den Wohnort bekannt).
  // Bewegliche Feiertage (Ostern-abhängig) werden über die Gauß'sche Osterformel korrekt berechnet,
  // nicht fest für ein einzelnes Jahr eingetragen — funktioniert also für jedes Jahr richtig.
  function easterSunday(year) {
    const a = year % 19, b = Math.floor(year / 100), c = year % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }
  function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }
  function mmdd(date) {
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  function germanHolidayForToday(date) {
    const year = date.getFullYear();
    const easter = easterSunday(year);
    const fixed = {
      "01-01": "🎉 Neujahr",
      "05-01": "🛠️ Tag der Arbeit",
      "10-03": "🇩🇪 Tag der Deutschen Einheit",
      "12-25": "🎄 1. Weihnachtsfeiertag",
      "12-26": "🎄 2. Weihnachtsfeiertag",
    };
    const md = mmdd(date);
    if (fixed[md]) return fixed[md];
    const movable = [
      [addDays(easter, -2), "✝️ Karfreitag"],
      [easter, "🐣 Ostersonntag"],
      [addDays(easter, 1), "🐣 Ostermontag"],
      [addDays(easter, 39), "☁️ Christi Himmelfahrt"],
      [addDays(easter, 49), "🕊️ Pfingstsonntag"],
      [addDays(easter, 50), "🕊️ Pfingstmontag"],
    ];
    const hit = movable.find(([d]) => mmdd(d) === md);
    return hit ? hit[1] : null;
  }
  // Geburtstage von Freunden — nur Freunde (nicht alle Nutzer), aus Datenschutzgründen, und nur
  // wenn die Person ihr Geburtsdatum im Profil hinterlegt hat.
  async function friendBirthdaysToday(date) {
    if (!Backend.currentUser()) return [];
    try {
      const friends = await Backend.getFriends();
      const md = mmdd(date);
      return friends.filter((f) => f.birthday && f.birthday.slice(5) === md).map((f) => f.name);
    } catch (e) { return []; }
  }
  function renderCalendarBack() {
    const back = document.querySelector(".cal-back-scroll");
    if (!back) return;
    // Sicherheitsbegrenzung: manche Aufgaben-/Tipp-Texte können ungewöhnlich lang sein — damit
    // die Kalenderkarte immer vollständig hineinpasst, wird hier gekürzt statt zu scrollen.
    const truncate = (s, max) => (s && s.length > max ? s.slice(0, max - 1) + "…" : s);
    const now = new Date();
    const holiday = germanHolidayForToday(now);
    const specialDayHtml = holiday ? `<p class="empty-note" id="calSpecialDay" style="margin:-4px 0 10px; font-weight:700;">${holiday}</p>` : `<p class="empty-note" id="calSpecialDay" style="margin:-4px 0 10px; display:none;"></p>`;
    // Geburtstag der eingeloggten Person, falls heute — funktioniert automatisch für jede Person,
    // die ihr Geburtsdatum im Profil hinterlegt hat, unabhängig vom Herkunftsland.
    const birthdayKey = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const birthdayName = todaysBirthdayGreeting(birthdayKey);
    const birthdayHtml = birthdayName ? `<p style="margin:-4px 0 10px; font-weight:700;">🎂 Heute ist Geburtstag — alles Gute, ${birthdayName}!</p>` : "";
    // Logische Erweiterung: falls für den heutigen Tag ein Eintrag bei "Es war einmal in
    // Deutschland" existiert, gibt es hier einen kurzen, unauffälligen Link dahin — es ist ja
    // genau an diesem Kalendertag passiert. Bewusst kurz gehalten (nur der Titel, gekürzt),
    // damit die feste Kartengröße nicht gesprengt wird.
    const md = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const historyEntry = ExerciseData.germanHistoryForToday(md);
    const historyTopic = historyEntry ? (ExerciseData.HISTORY_TITLES || {})[md] : "";
    const historyLinkHtml = historyEntry ? `
      <div style="margin-top:10px; text-align:center;">
        ${historyTopic ? `<p class="empty-note" style="margin-bottom:6px; font-size:0.76rem;">Heute im Fokus: ${historyTopic}</p>` : ""}
        <button type="button" class="btn btn-ghost" id="calHistoryLinkBtn" style="font-size:0.72rem; padding:6px 10px; white-space:normal; display:block; width:100%; min-width:0; box-sizing:border-box; text-align:center; line-height:1.3;">📜 Es war einmal in Deutschland … heute vor ${new Date().getFullYear() - historyEntry.year} Jahren</button>
      </div>` : "";
    if (isDailyTaskSolvedToday()) {
      const wasCorrect = getDailyTaskAttemptResult() === "correct";
      back.innerHTML = `
        ${specialDayHtml}
        ${birthdayHtml}
        <p class="cal-tip-title">${wasCorrect ? "✅ Tagesaufgabe gelöst!" : "📅 Tagesaufgabe schon versucht"}</p>
        <p class="cal-tip-text">${wasCorrect ? "Du hast deine Aufgabe für heute schon erledigt — komm morgen wieder für eine neue!" : "Du hast es heute schon versucht — kein Problem, morgen kommt eine neue Chance!"}</p>
        ${historyLinkHtml}
        <hr style="width:100%; border:none; border-top:1px solid rgba(0,0,0,0.1); margin:14px 0;" />
        <p class="cal-tip-title" style="font-size:0.85rem;">💡 Wusstest du außerdem …</p>
        <p class="cal-tip-text" id="calTipText" style="font-size:0.85rem;">${truncate(pickDailyTip().text, 220)}</p>
        <button type="button" class="btn btn-ghost" id="calAnotherBtn" style="margin-top:10px;">🔄 Anderen Tipp</button>
      `;
      document.getElementById("calAnotherBtn").addEventListener("click", () => {
        document.getElementById("calTipText").innerHTML = pickRandomTip().text;
      });
      return;
    }
    // Sicherheitsbegrenzung: manche Aufgaben-Texte können ungewöhnlich lang sein — damit die
    // Kalenderkarte in jedem Fall vollständig hineinpasst, wird hier gekürzt statt zu scrollen.
    const questionText = truncate(cwCalendarTask.word, 160);
    back.innerHTML = `
      ${specialDayHtml}
      ${birthdayHtml}
      <p class="cal-tip-title">🎯 Tagesaufgabe</p>
      ${cwCalendarTask.focus ? `<p class="empty-note" style="margin:-4px 0 8px;">${cwCalendarTask.focus.kind === "self-assessed" ? `🧭 Du hast „${cwCalendarTask.focus.label}" selbst als Schwäche markiert — hier eine Frage, um genau daran zu arbeiten!` : cwCalendarTask.focus.kind === "weak" ? `💪 Bei „${cwCalendarTask.focus.label}" liegt dein Schnitt bei ${cwCalendarTask.focus.percent}% — hier eine Frage, um genau das zu festigen!` : `🔎 Du übst gerade viel „${cwCalendarTask.focus.label}" (${cwCalendarTask.focus.percent}% deiner letzten Runden)${cwCalendarTask.isPersonalized ? " — hier eine passende Frage dazu!" : ""}`}</p>` : ""}
      <p class="cal-tip-text">${questionText}</p>
      <div style="display:flex; flex-direction:column; gap:8px; width:100%; margin-top:6px;" id="calTaskOptions">
        ${cwCalendarTask.options.map((opt, i) => `<button type="button" class="btn btn-ghost" data-task-answer="${i}" style="text-align:left;">${capitalizeIfSentenceStart(opt, cwCalendarTask.word)}</button>`).join("")}
      </div>
      <p class="empty-note" id="calTaskFeedback" style="margin-top:8px;"></p>
      ${historyLinkHtml}
      <hr style="width:100%; border:none; border-top:1px solid rgba(0,0,0,0.1); margin:14px 0;" />
      <p class="cal-tip-title" style="font-size:0.85rem;">💡 Wusstest du außerdem …</p>
      <p class="cal-tip-text" id="calTipText" style="font-size:0.85rem;">${truncate(pickDailyTip().text, 220)}</p>
      <button type="button" class="btn btn-ghost" id="calAnotherBtn" style="margin-top:10px;">🔄 Anderen Tipp</button>
    `;
    back.querySelectorAll("[data-task-answer]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idx = Number(btn.dataset.taskAnswer);
        const fb = document.getElementById("calTaskFeedback");
        back.querySelectorAll("[data-task-answer]").forEach((b) => { b.disabled = true; });
        const correct = idx === cwCalendarTask.correctIdx;
        if (correct) {
          btn.style.background = "#4FA88E"; btn.style.color = "#fff";
          Core.sound.fanfare();
          fb.textContent = "🎉 Richtig! Bonuspunkt fürs Lösen der Tagesaufgabe.";
          claimDailyTaskPoints();
          await markDailyTaskAttempted(true);
        } else {
          btn.style.background = "#E85F6F"; btn.style.color = "#fff";
          Core.sound.wrong();
          fb.textContent = "Nicht ganz — aber macht nichts, morgen kommt eine neue Aufgabe!";
          await markDailyTaskAttempted(false);
        }
        if (Backend.currentUser()) {
          const questionShort = cwCalendarTask.word;
          const correctOption = cwCalendarTask.options[cwCalendarTask.correctIdx];
          Backend.sendSystemMessage(Backend.currentUser().id, `📅 Du hast gerade deine Tagesaufgabe gemacht — ${correct ? "richtig gelöst! 🎉" : "leider nicht ganz getroffen."}\n\n${questionShort}\n→ Richtige Antwort: ${correctOption}`);
        }
        setTimeout(() => {
          renderCalendarBack();
          document.getElementById("calendarModalPage")?.classList.remove("torn");
        }, 1400);
      });
    });
    document.getElementById("calAnotherBtn").addEventListener("click", () => {
      document.getElementById("calTipText").innerHTML = pickRandomTip().text;
    });
    // Geburtstage von Freunden asynchron nachladen — ergänzt den Feiertag oben, falls heute
    // jemand aus der Freundesliste Geburtstag hat (nur Freunde, aus Datenschutzgründen).
    friendBirthdaysToday(now).then((names) => {
      if (!names.length) return;
      const el = document.getElementById("calSpecialDay");
      if (!el) return;
      const birthdayLine = `🎂 ${names.join(", ")} hat${names.length === 1 ? "" : "en"} heute Geburtstag!`;
      el.style.display = "";
      el.textContent = el.textContent ? `${el.textContent} · ${birthdayLine}` : birthdayLine;
    });
    const historyLinkBtn = document.getElementById("calHistoryLinkBtn");
    if (historyLinkBtn) {
      historyLinkBtn.addEventListener("click", () => {
        document.querySelector('[data-target="view-knowledge"]')?.click();
        document.getElementById("calCloseBtn")?.click();
        document.getElementById("calendarModalPage")?.classList.remove("torn");
        // Deutlich längere Verzögerung als vorher (war 150ms) — der Hauptreiter-Wechsel löst
        // beim allerersten Besuch selbst einen automatischen Klick auf seinen STANDARD-
        // Unterreiter aus (siehe tabsFreshlyRendered), der diesen gezielten Klick auf "Kompass"
        // sonst überschrieb, sodass man im falschen Unterreiter landete.
        setTimeout(() => {
          document.querySelector('[data-sub="sub-kompass"]')?.click();
        }, 400);
      });
    }
    // Klick auf die Rückseite (aber nicht auf Buttons/Links darauf, die interaktiv bleiben
    // müssen) schließt jetzt das GESAMTE Kalenderblatt — nicht nur ein Zurückklappen zur
    // Vorderseite. Wie ausdrücklich gewünscht: irgendwo innerhalb der Karte tippen, wo kein Text-
    // Link ist, soll genauso zuverlässig schließen wie ein Klick außerhalb der Karte.
    if (back) {
      back.addEventListener("click", (e) => {
        if (e.target.closest("button, a")) return; // interaktive Elemente nicht mit-schließen
        document.getElementById("calendarModalOverlay").style.display = "none";
        document.getElementById("calendarModalPage")?.classList.remove("torn");
      });
    }
  }
  function claimDailyTaskPoints() {
    if (!Backend.currentUser()) return;
    if (isDailyTaskSolvedToday()) return;
    saveResultAndCheck({
      categories: ["tageskalender"], points: 0, bonus: 2, percent: 100,
      character: "Tagesaufgabe gelöst", badges: [], playedAt: new Date().toISOString(),
    });
  }
  // Login-Streak: einmal pro Tag eine kleine, zufällige Punkte-Überraschung fürs Vorbeischauen —
  // muss keine Aufgabe sein, allein das Einloggen wird schon leicht belohnt, wie bei einem
  // Adventskalender. Ab 7 Tagen am Stück gibt's zusätzlich eine Trophäe. Im Profil verankert,
  // damit die Serie auf jedem Gerät gleich weiterläuft statt bei Browser-Wechsel abzureißen.
  function claimLoginStreak() {
    if (!Backend.currentUser()) return;
    const profile = Backend.currentProfile();
    const extra = (profile && profile.extraProfileData) || {};
    const todayKey = new Date().toISOString().slice(0, 10);
    const lastLogin = extra.lastLoginDay || null;
    let streak = Number(extra.loginStreak || 0);
    if (lastLogin === todayKey) return; // heute schon verbucht
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    streak = lastLogin === yesterday ? streak + 1 : 1; // Kette gerissen -> von vorn
    Backend.updateExtraProfileField("lastLoginDay", todayKey);
    Backend.updateExtraProfileField("loginStreak", streak);
    const bonus = 1 + Math.floor(Math.random() * 3); // jeden Tag 1-3 Punkte, überraschend
    saveResultAndCheck({
      categories: ["login"], points: bonus, bonus: 0, percent: 100,
      character: "Tägliches Vorbeischauen", badges: [], playedAt: new Date().toISOString(),
    });
    if (streak >= 7) {
      const gotTrophy = Backend.addTrophy("Heimkehrer:in – Familie · 7 Tage am Stück dabei");
      if (gotTrophy) Backend.addActivity(`${Backend.currentProfile()?.name || "Jemand"} ist seit 7 Tagen am Stück dabei! 🏡`);
    }
  }
  const calendarBtn = document.getElementById("calendarPageBtn");
  if (calendarBtn) calendarBtn.addEventListener("click", openCalendarModal);
  const calCloseBtn = document.getElementById("calCloseBtn");
  if (calCloseBtn) calCloseBtn.addEventListener("click", () => { document.getElementById("calendarModalOverlay").style.display = "none"; });
  const calOverlay = document.getElementById("calendarModalOverlay");
  if (calOverlay) calOverlay.addEventListener("click", (e) => {
    // Statt eines exakten "e.target === calOverlay"-Abgleichs (der bei der 3D-gedrehten Karte
    // zerbrechlich sein kann, da verschachtelte, transformierte Elemente den tatsächlichen
    // Klick-Treffer verschieben können) wird jetzt geprüft, ob der Klick TATSÄCHLICH außerhalb
    // der Karte selbst liegt — das schließt zuverlässig, egal welches konkrete Element getroffen
    // wurde, statt nur bei einem exakten Treffer auf den Hintergrund selbst.
    const page = document.getElementById("calendarModalPage");
    if (page && !page.contains(e.target)) calOverlay.style.display = "none";
  });
  const calFrontFace = document.getElementById("calFrontFace");
  if (calFrontFace) calFrontFace.addEventListener("click", () => {
    document.getElementById("calendarModalPage").classList.add("torn");
    Core.sound.correct();
    claimDailyCalendarPoints();
  });
  // Kalender-Serie: reißt man an mehreren Tagen HINTEREINANDER ab, steigen die Punkte — genau wie
  // beim Login-Streak. Reißt man einen Tag aus, fängt die Serie wieder bei vorne an. Im Profil
  // verankert statt im Browser-Speicher.
  function claimDailyCalendarPoints() {
    if (!Backend.currentUser()) return;
    const profile = Backend.currentProfile();
    const extra = (profile && profile.extraProfileData) || {};
    const todayKey = new Date().toISOString().slice(0, 10);
    const lastClaim = extra.calendarClaimedDay || null;
    if (lastClaim === todayKey) return; // heute schon abgerissen — keine doppelten Punkte
    let streak = Number(extra.calendarStreak || 0);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    streak = lastClaim === yesterday ? streak + 1 : 1;
    Backend.updateExtraProfileField("calendarClaimedDay", todayKey);
    Backend.updateExtraProfileField("calendarStreak", streak);
    // Punkte wachsen mit der Serie: 1-2 Tage = 1P, 3-6 Tage = 2P, 7-13 Tage = 3P, ab 14 Tage = 5P.
    const points = streak >= 14 ? 5 : streak >= 7 ? 3 : streak >= 3 ? 2 : 1;
    saveResultAndCheck({
      categories: ["tageskalender"], points, bonus: 0, percent: 100,
      character: "Kalenderblatt abgerissen", badges: [], playedAt: new Date().toISOString(),
    });
    setTimeout(() => {
      const hint = document.querySelector(".cal-back .cal-tip-title");
      const streakNote = streak > 1 ? ` (${streak}. Tag in Folge!)` : "";
      if (hint) hint.insertAdjacentHTML("afterend", `<p class="empty-note" style="margin:-6px 0 10px;">🎉 +${points} Punkt${points > 1 ? "e" : ""} fürs heutige Kalenderblatt!${streakNote}</p>`);
    }, 50);
  }
  updateCalendarWidget();
  setInterval(updateCalendarWidget, 60000);

  const STRESS_EXCLUDABLE_SECTIONS = [
    { id: "view-about", label: "Über mich" },
    { id: "view-learn", label: "Lernen" },
    { id: "view-knowledge", label: "Wissen" },
    { id: "view-profile", label: "Profil & Rang" },
  ];
  // Betonungsmodus initial anwenden + Umschalter verdrahten
  setStressMode(isStressModeOn());
  const stressToggleBtn = document.getElementById("stressToggleBtn");
  if (stressToggleBtn) {
    stressToggleBtn.classList.toggle("active", isStressModeOn());
    stressToggleBtn.addEventListener("click", () => {
      setStressMode(!isStressModeOn());
      stressToggleBtn.classList.toggle("active", isStressModeOn());
      // Aktuell sichtbare Vokabel-/Steckbrief-Ansichten neu zeichnen, falls offen
      if (document.getElementById("vocabArea")?.innerHTML) renderVocab();
      if (document.getElementById("accountArea")?.innerHTML) renderAccount();
      renderKompass();
    });
  }

  // Zentrale, wiederverwendbare Prüfung: hat die eingeloggte Person heute Geburtstag? Wird sowohl
  // im Kopfbereich als auch in "Es war einmal in Deutschland" genutzt — funktioniert automatisch
  // für JEDE Person, die ihr Geburtsdatum im Profil hinterlegt hat, nicht nur für einen festen Namen.
  function todaysBirthdayGreeting(key) {
    const profile = Backend.currentProfile();
    if (profile && profile.birthday && /^\d{4}-\d{2}-\d{2}$/.test(profile.birthday)) {
      if (profile.birthday.slice(5) === key) return profile.name.split(" ")[0];
    }
    return null;
  }
  function updateSpecialDayBar() {
    const el = document.getElementById("specialDayOut");
    if (!el) return;
    const now = new Date();
    const berlin = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
    const key = `${String(berlin.getMonth() + 1).padStart(2, "0")}-${String(berlin.getDate()).padStart(2, "0")}`;
    let text = GERMAN_HOLIDAYS[key] || "";
    const birthdayName = todaysBirthdayGreeting(key);
    if (birthdayName) text = `🎂 Alles Gute, ${birthdayName}!`;
    el.textContent = text;
    el.style.display = text ? "inline" : "none";
  }
  updateSpecialDayBar();

  /* ============ Lauftext-Ticker ============ */
  let tickerVisible = true;
  let tickerUpdateInFlight = false;
  async function updateTicker() {
    const track = document.getElementById("tickerTrack");
    if (!track) return;
    // Absicherung: läuft gerade schon eine Aktualisierung (z. B. weil auf einer stark besuchten
    // Seite mehrere Auslöser fast gleichzeitig feuern), wird ein zweiter, sich überlappender
    // Durchlauf übersprungen — zwei gleichzeitige Durchläufe könnten sich sonst gegenseitig die
    // Animation zurücksetzen, was sich als plötzliches "Rasen" äußern könnte.
    if (tickerUpdateInFlight) return;
    tickerUpdateInFlight = true;
    try {
      const items = await Backend.getActivity();
      const text = items.length ? items.map((a) => `• ${a.text}`).join("   ") : track.textContent;
      // WICHTIG: Ist der Text UNVERÄNDERT gegenüber dem letzten Durchlauf, die laufende Animation
      // gar nicht erst anfassen — sonst würde sie bei jedem der vielen Auslöser (alle 20 Sekunden
      // per Intervall, plus mehrere weitere Ereignisse im Code) komplett neu gestartet, selbst
      // wenn es gar nichts Neues gibt. Der Text lief dadurch nie vollständig durch, sondern begann
      // ständig von vorn — genau das erzeugte den "rasenden", gehetzten Eindruck, nicht die
      // eigentliche Scroll-Geschwindigkeit selbst (die korrekt bei ~55px/s lag).
      if (text === track.dataset.lastTickerText) return;
      track.dataset.lastTickerText = text;
      // Animation zuerst abschalten, damit scrollWidth die NEUE Textlänge korrekt misst
      // (nicht noch die alte, gerade laufende Animation beeinflusst die Messung).
      track.style.animation = "none";
      if (items.length) track.textContent = text;
      void track.offsetHeight; // Reflow erzwingen, damit die neue Breite feststeht
      // Feste Geschwindigkeit statt fester Dauer: läuft der Text nach mehreren Aktionen länger,
      // wurde die Animation vorher trotzdem in derselben festen Zeit durchgezogen — dadurch wirkte
      // sie bei viel Text unnatürlich schnell. Jetzt wird die Dauer an die tatsächliche Textbreite
      // angepasst, damit das Lauftempo (Pixel pro Sekunde) immer gleich bleibt — auch beim allerersten
      // Anzeigen des Platzhaltertexts, bevor echte Aktivität vorliegt.
      const textWidth = track.scrollWidth;
      const pixelsPerSecond = 55; // gleichbleibendes, gut lesbares Lauftempo
      const duration = Math.max(12, textWidth / pixelsPerSecond);
      // WICHTIG — behebt den "erst langsam, dann nach ein paar Sekunden plötzlich extrem schnell"-
      // Bug: das komplette animation-Shorthand (Name UND korrekte Dauer zusammen) wird jetzt in
      // EINEM einzigen Schritt gesetzt, statt erst "animation:''" (was die Animation mit der
      // FESTEN CSS-Standarddauer von 38s bzw. 22s sofort startete) und die korrekte, berechnete
      // Dauer erst im nächsten Schritt nachzutragen. Dieser kurze Zwischenzustand mit falscher
      // Dauer ließ den Browser bei manchen Geräten/Timings die "verstrichene Animationszeit"
      // beibehalten und auf die neue, oft viel kürzere Dauer umrechnen — das zeigte sich als
      // plötzlicher Geschwindigkeitssprung, statt eines sauberen Neustarts bei 0.
      const blinkOn = typeof isTickerBlinkOn === "function" && isTickerBlinkOn();
      if (blinkOn) {
        const blinkSpeed = typeof getTickerBlinkSpeed === "function" ? getTickerBlinkSpeed() : "0.7";
        track.style.animation = `tickerColorBlink ${blinkSpeed}s linear infinite, tickerScroll ${duration}s linear infinite`;
      } else {
        track.style.animation = `tickerScroll ${duration}s linear infinite`;
      }
    } finally {
      tickerUpdateInFlight = false;
    }
  }
  const tickerToggle = document.getElementById("tickerToggle");
  if (tickerToggle) {
    tickerToggle.addEventListener("click", () => {
      tickerVisible = !tickerVisible;
      document.getElementById("tickerBar").classList.toggle("ticker-hidden", !tickerVisible);
      tickerToggle.textContent = tickerVisible ? "👁️" : "🙈";
    });
  }
  updateTicker();
  setInterval(updateTicker, 20000);
  // Begrüßungsnachricht, wenn jemand über einen Empfehlungs-Link landet — zeigt, wer die Person
  // eingeladen hat. Der Name kommt zur schnellen Anzeige direkt aus dem Link (refname), wird aber
  // sicherheitshalber mit dem tatsächlich aktuellen Profilnamen abgeglichen, sobald der geladen
  // ist (falls die Person ihren Namen zwischenzeitlich geändert hat).
  // WICHTIG — behebt einen Bug, durch den der Empfehlungs-Bonus nie ausgelöst wurde: dieser
  // gemerkte Wert bleibt für den Rest der Sitzung erhalten, auch NACHDEM der ref-Parameter unten
  // aus der sichtbaren URL entfernt wird. Der Signup-Handler liest bisher erst beim tatsächlichen
  // Absenden des Formulars aus window.location.search — das ist oft viele Sekunden (oder Minuten)
  // nach dem Laden der Seite, also lange NACHDEM die URL hier schon bereinigt wurde. Ohne dieses
  // Zwischenspeichern kam beim Signup also praktisch immer ein leerer ref-Wert an.
  window.__pendingReferralId = null;
  (function showReferralWelcomeIfPresent() {
    const params = new URLSearchParams(window.location.search);
    const refId = params.get("ref");
    const refNameFromLink = params.get("refname");
    if (!refId) return;
    window.__pendingReferralId = refId;
    const showBanner = (name) => {
      if (!name) return;
      showToast(`👋 Du wurdest von ${name} empfohlen — willkommen!`);
    };
    if (refNameFromLink) showBanner(decodeURIComponent(refNameFromLink));
    Backend.getPublicProfile(refId).then((p) => {
      if (p && p.name && p.name !== refNameFromLink) showBanner(p.name);
    }).catch(() => {});
    // WICHTIG: den Empfehlungs-Parameter aus der URL entfernen, sobald die Begrüßung einmal
    // gezeigt wurde — sonst bleibt "?ref=..." dauerhaft in der Adresse stehen, und JEDES weitere
    // Neuladen der Seite (auch Tage später, auch nach dem Einloggen) würde die Begrüßung erneut
    // auslösen, statt nur einmalig beim ersten Besuch über den Link zu erscheinen.
    params.delete("ref");
    params.delete("refname");
    const newSearch = params.toString();
    const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
    history.replaceState(null, "", newUrl);
  })();

  /* ============ Kurze Pop-up-Benachrichtigung bei neuen Anfragen ============ */
  // Globaler Klick-Handler für die kleinen ℹ️-Symbole bei Reitern mit weniger selbsterklärenden
  // Namen — zeigt eine kurze Erklärung, statt dass der Klick (wie sonst bei einem Button) auch
  // gleich den Reiter wechselt.
  document.addEventListener("click", (e) => {
    const icon = e.target.closest(".subnav-info-icon");
    if (!icon) return;
    e.preventDefault();
    e.stopPropagation();
    showToast(`ℹ️ ${icon.dataset.info}`);
  }, true);
  function showToast(text, onClick) {
    // Antippt man den Toast selbst, soll er SOFORT verschwinden — unabhängig davon, ob zusätzlich
    // eine eigene Aktion (onClick) ausgeführt wird. Bisher tat ein Klick bei reinen Info-Bubbles
    // (kein onClick übergeben) gar nichts, man musste die vollen ~5,5 Sekunden abwarten.
    const dismiss = () => {
      toast.classList.remove("toast-visible");
      setTimeout(() => toast.remove(), 400);
    };
    const wrappedClick = () => {
      if (onClick) { stopNotifyReminder(); onClick(); }
      dismiss();
    };
    const toast = Core.el("div", { class: "toast-popup", onclick: wrappedClick }, text);
    if (onClick) toast.classList.add("toast-clickable");
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("toast-visible"), 20);
    setTimeout(dismiss, 5500);
  }
  // Sichtbare Warnung, falls das Speichern der Punkte im Hintergrund fehlschlägt (auch nach
  // Wiederholung) — sonst könnte jemand beim nächsten Neuladen unbemerkt Punkte verlieren, weil
  // der Server noch den alten, niedrigeren Stand hat. An backend.js über window verfügbar gemacht,
  // da die Speicherlogik dort in einem eigenen Gültigkeitsbereich liegt.
  window.__dmaPointsSaveFailed = () => {
    showToast("⚠️ Deine Punkte konnten gerade nicht gespeichert werden — bitte Internetverbindung prüfen und die Seite nicht schließen, bis es wieder klappt.");
  };
  // Kurzer, dezenter Benachrichtigungston -- direkt erzeugt, keine Audiodatei noetig.
  // Spielt einmal sofort; falls die Benachrichtigung dann noch nicht bestaetigt wurde, einmal nach 5s erneut. Danach Ruhe.
  // Web Audio darf laut Browser-Regel nur nach einer echten Nutzer-Interaktion starten,
  // nicht ungefragt aus einem Timer heraus (sonst bleibt der Ton stumm). Deshalb wird der
  // Audio-Kontext einmalig beim allerersten Antippen der Seite "entsperrt" und danach wiederverwendet.
  let sharedAudioCtx = null;
  function unlockAudioOnce() {
    if (sharedAudioCtx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    sharedAudioCtx = new AudioCtx();
    if (sharedAudioCtx.state === "suspended") sharedAudioCtx.resume();
  }
  document.addEventListener("click", unlockAudioOnce, { once: true });
  document.addEventListener("touchstart", unlockAudioOnce, { once: true });

  // Stummschaltung für Benachrichtigungs-Ton + roten Ring — im Profil gespeichert, damit sie auf
  // jedem Gerät gleich bleibt, statt bei jedem Browser-Wechsel verloren zu gehen.
  function isNotifyMuted() {
    const profile = Backend.currentProfile();
    return Boolean(profile && profile.extraProfileData && profile.extraProfileData.notifyMuted);
  }
  async function setNotifyMuted(muted) {
    await Backend.updateExtraProfileField("notifyMuted", muted);
  }
  // Getrennt vom Ton: das Blinken/Leuchten der Profil-Pille kann unabhängig ausgeschaltet werden
  // (z. B. Ton an, aber kein optisches Blinken — oder umgekehrt).
  function isNotifyBlinkMuted() {
    const profile = Backend.currentProfile();
    return Boolean(profile && profile.extraProfileData && profile.extraProfileData.notifyBlinkMuted);
  }
  async function setNotifyBlinkMuted(muted) {
    await Backend.updateExtraProfileField("notifyBlinkMuted", muted);
  }

  // Betonungsmodus — sitweiter Umschalter. Zeigt bei allen Wörtern, für die eine geprüfte
  // Silbentrennung vorliegt (Vokabeltrainer, Hobbys, Länder, Sprachen, Artikel-Wortschatz),
  // die betonte Silbe unterstrichen an — wie im Duden. Ungeprüfte Wörter bleiben unverändert.
  function isStressModeOn() {
    const profile = Backend.currentProfile();
    return Boolean(profile && profile.extraProfileData && profile.extraProfileData.stressModeOn);
  }
  function setStressMode(on) {
    Backend.updateExtraProfileField("stressModeOn", on);
    document.documentElement.classList.toggle("stress-mode-active", on);
    applyStressEverywhere(on);
    if (on) startStressObserver();
  }
  // Wandelt "FOTO-gra-FIE" in HTML mit unterstrichener betonter Silbe um.
  function stressHtml(sylString) {
    if (!sylString) return "";
    return sylString.split("-").map((part) => {
      const isStressed = part === part.toUpperCase() && /[A-ZÄÖÜ]/.test(part);
      const display = isStressed ? part.charAt(0) + part.slice(1).toLowerCase() : part;
      return isStressed ? `<span class="stress">${display}</span>` : display;
    }).join("");
  }
  // Zeigt ein Wort mit Betonung an, falls der Modus aktiv ist UND eine geprüfte Silbentrennung
  // vorliegt (sylLookup ist z. B. ExerciseData.WORD_SYL oder VocabData.LANGUAGE_SYL) — sonst
  // ganz normal den Klartext, nie geraten.
  function displayWord(word, sylLookup) {
    if (isStressModeOn() && sylLookup && sylLookup[word]) return stressHtml(sylLookup[word]);
    return word;
  }

  /* ============================================================
     BETONUNGSMODUS — REGELBASIERTE SILBENTRENNUNG FÜR DIE GANZE SEITE
     ============================================================
     Für die handgeprüften Wortlisten (Vokabeltrainer, Hobbys, Länder, Sprachen,
     Artikel-Wortschatz) wird die Betonung oben über `stressHtml`/`displayWord` exakt gezeigt.
     Für ALLE ANDEREN Wörter auf der Seite (Überschriften, Aufgabentitel, Fließtext) gibt es
     keine handgeprüfte Datenbank — stattdessen wendet diese Funktion feste, dokumentierte
     Betonungsregeln der deutschen Sprache an (nicht geraten, sondern regelbasiert):
     1. Unbetonte Vorsilben (be-, ge-, er-, ver-, zer-, ent-, emp-, miss-) werden übersprungen,
        die Betonung liegt auf der Silbe danach.
     2. Bestimmte typische Fremdwort-Endungen (-tion, -tät, -ie, -ur, -ismus, -ieren, -age,
        -ant, -ent, -esse) werden meist auf der letzten oder vorletzten Silbe betont.
     3. Ansonsten gilt die Standard-Regel für deutsche Wörter: die erste (Stamm-)Silbe.
     Das ist ein Regelwerk, kein Wörterbuch — bei seltenen Ausnahmen kann es abweichen, folgt
     aber denselben Mustern, die auch im Duden für die überwiegende Mehrheit gelten. */
  const UNSTRESSED_PREFIXES = ["be", "ge", "er", "ver", "zer", "ent", "emp", "miss"];
  const STRESSED_END_SUFFIXES = ["tion", "tät", "ur", "ismus", "ieren", "age", "ant", "ent", "esse", "ell", "iv"];
  function ruleSyllabify(word) {
    // Bekannte unbetonte Vorsilben werden zuerst fest abgetrennt (das ist zuverlässiger als reine
    // Lautsilbentrennung, weil be-/ge-/ver-/... im Deutschen immer eine eigene Silbe bilden).
    const lower = word.toLowerCase();
    for (const prefix of UNSTRESSED_PREFIXES) {
      if (lower.startsWith(prefix) && word.length > prefix.length + 2) {
        const rest = word.slice(prefix.length);
        return [word.slice(0, prefix.length), ...rawSyllabify(rest)];
      }
    }
    return rawSyllabify(word);
  }
  function rawSyllabify(w) {
    // Grobe, aber praxistaugliche deutsche Silbentrennung: Vokalgruppen (inkl. Diphthonge)
    // als Silbenkern, ein Konsonant dazwischen geht zur folgenden Silbe, mehrere Konsonanten
    // werden bis auf den letzten der vorherigen Silbe zugeschlagen.
    const nucleusPositions = [];
    let i = 0;
    while (i < w.length) {
      const two = w.slice(i, i + 2).toLowerCase();
      if (["au", "ei", "ey", "eu", "äu", "ie"].includes(two)) { nucleusPositions.push([i, i + 2]); i += 2; continue; }
      if (/[aeiouyäöü]/i.test(w[i])) { nucleusPositions.push([i, i + 1]); i += 1; continue; }
      i += 1;
    }
    if (nucleusPositions.length <= 1) return [w];
    const syllables = [];
    let start = 0;
    for (let n = 0; n < nucleusPositions.length - 1; n++) {
      const nucleusEnd = nucleusPositions[n][1];
      const nextNucleusStart = nucleusPositions[n + 1][0];
      const consonants = nextNucleusStart - nucleusEnd;
      let splitAt;
      if (consonants <= 1) splitAt = nucleusEnd;
      else splitAt = nucleusEnd + (consonants - 1); // letzter Konsonant geht zur naechsten Silbe
      syllables.push(w.slice(start, splitAt));
      start = splitAt;
    }
    syllables.push(w.slice(start));
    return syllables.filter((s) => s.length > 0);
  }
  function ruleStressIndex(word, syllables) {
    const lower = word.toLowerCase();
    if (syllables.length <= 1) return 0;
    for (const prefix of UNSTRESSED_PREFIXES) {
      if (lower.startsWith(prefix) && syllables[0].toLowerCase() === prefix) {
        return 1; // Silbe nach der unbetonten Vorsilbe (durch ruleSyllabify fest abgetrennt)
      }
    }
    for (const suf of STRESSED_END_SUFFIXES) {
      if (lower.endsWith(suf)) return syllables.length - 1; // letzte Silbe
    }
    return 0; // Standard: erste (Stamm-)Silbe
  }
  function ruleMarkWord(word) {
    // Nur echte Wörter ab 3 Buchstaben behandeln (kurze Wörter/Artikel haben ohnehin nur
    // eine Silbe und keine sinnvolle "Betonungswahl").
    if (!/^[A-Za-zÄÖÜäöüß]+$/.test(word) || word.length < 3) return null;
    const syllables = ruleSyllabify(word);
    if (syllables.length <= 1) return null;
    const idx = ruleStressIndex(word, syllables);
    return syllables.map((s, i) => (i === idx ? `<span class="stress">${s}</span>` : s)).join("");
  }
  // Wendet die Betonung auf alle Text-Knoten innerhalb von `root` an (umkehrbar: das
  // Original bleibt in data-orig gespeichert, damit man beim Ausschalten exakt zurückwechseln
  // kann, ohne die ganze Seite neu laden zu müssen).
  const STRESS_SKIP_TAGS = new Set(["SCRIPT", "STYLE", "INPUT", "TEXTAREA", "SELECT", "OPTION", "SVG", "PATH"]);
  function applyStressToTree(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || STRESS_SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest(".stress-marked")) return NodeFilter.FILTER_REJECT; // schon behandelt
        // Bereits handgeprüft markierte Bereiche (Vokabeltrainer-Silben, Sternzeichen/Geschlecht-Badges)
        // dürfen vom groben, regelbasierten Algorithmus nicht noch einmal angefasst werden.
        if (parent.closest(".vocab-syl, .zodiac-badge, .stress-mark")) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach((textNode) => {
      const text = textNode.nodeValue;
      const html = text.replace(/[A-Za-zÄÖÜäöüß]{3,}/g, (word) => {
        const marked = ruleMarkWord(word);
        return marked || word;
      });
      if (html === text) return; // kein einziges markierbares Wort enthalten
      const span = document.createElement("span");
      span.className = "stress-marked";
      span.dataset.orig = text;
      span.innerHTML = html;
      textNode.parentNode.replaceChild(span, textNode);
    });
  }
  function removeStressFromTree(root) {
    if (!root) return;
    root.querySelectorAll(".stress-marked").forEach((span) => {
      const text = document.createTextNode(span.dataset.orig);
      span.parentNode.replaceChild(text, span);
    });
  }
  function getStressExcludedSections() {
    const profile = Backend.currentProfile();
    return (profile && profile.extraProfileData && profile.extraProfileData.stressExcludedSections) || [];
  }
  function setStressExcludedSections(ids) {
    Backend.updateExtraProfileField("stressExcludedSections", ids);
  }
  function applyStressEverywhere(on) {
    const excluded = new Set(getStressExcludedSections());
    STRESS_EXCLUDABLE_SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return;
      if (on && !excluded.has(sec.id)) applyStressToTree(el);
      else removeStressFromTree(el);
    });
  }
  // Beobachtet neu hinzugefügte Inhalte (z. B. nach Tab-Wechsel oder Neu-Rendern) und markiert
  // sie automatisch mit, solange der Betonungsmodus an ist — so bleibt wirklich jedes Wort
  // überall erfasst, auch nach späteren Änderungen am Bildschirm.
  let stressObserver = null;
  function startStressObserver() {
    if (stressObserver) return;
    const main = document.querySelector("main") || document.body;
    stressObserver = new MutationObserver((mutations) => {
      if (!isStressModeOn()) return;
      const excluded = new Set(getStressExcludedSections());
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          const section = node.closest ? node.closest(".view") : null;
          if (section && excluded.has(section.id)) return; // ausgeschlossener Bereich -> nichts markieren
          applyStressToTree(node);
        });
      });
    });
    stressObserver.observe(main, { childList: true, subtree: true });
  }

  function playNotifySound(soundKeyOverride) {
    if (isNotifyMuted()) return;
    try {
      if (!sharedAudioCtx) return; // Seite wurde noch nicht angetippt -> Browser erlaubt noch keinen Ton
      const ctx = sharedAudioCtx;
      if (ctx.state === "suspended") ctx.resume();
      const key = soundKeyOverride || getNotifySoundKey();
      const preset = NOTIFY_SOUND_PRESETS[key] || NOTIFY_SOUND_PRESETS.ding;
      preset.freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = preset.wave;
        osc.frequency.value = freq;
        const start = ctx.currentTime + i * preset.gap;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.14, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + preset.decay);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + preset.decay + 0.05);
      });
    } catch (e) { /* Ton ist rein dekorativ -- bei Problemen einfach still bleiben */ }
  }

  // Vier wählbare Benachrichtigungstöne — die ersten beiden immer frei, die anderen beiden
  // schaltet man mit gesammelten Punkten frei (Belohnung fürs Üben).
  const NOTIFY_SOUND_PRESETS = {
    ding: { label: "🔔 Ding (Standard)", freqs: [880, 1108], wave: "sine", gap: 0.09, decay: 0.35, unlockPoints: 0 },
    pop: { label: "🫧 Pop", freqs: [520], wave: "sine", gap: 0, decay: 0.18, unlockPoints: 0 },
    marimba: { label: "🎼 Marimba", freqs: [660, 880, 990], wave: "triangle", gap: 0.08, decay: 0.3, unlockPoints: 150 },
    chime: { label: "✨ Glöckchen", freqs: [1200, 1500, 1800], wave: "sine", gap: 0.07, decay: 0.5, unlockPoints: 400 },
    blip: { label: "🔵 Blip", freqs: [1400], wave: "square", gap: 0, decay: 0.08, unlockPoints: 100 },
    bell: { label: "🛎️ Glocke", freqs: [660, 990], wave: "sine", gap: 0.15, decay: 0.7, unlockPoints: 250 },
    xylo: { label: "🎹 Xylophon", freqs: [523, 659, 784, 1047], wave: "triangle", gap: 0.06, decay: 0.25, unlockPoints: 500 },
    drop: { label: "💧 Tropfen", freqs: [1600, 800], wave: "sine", gap: 0.05, decay: 0.2, unlockPoints: 300 },
    zap: { label: "⚡ Zap", freqs: [200, 1800], wave: "sawtooth", gap: 0.02, decay: 0.15, unlockPoints: 600 },
    harp: { label: "🎵 Harfe", freqs: [523, 587, 659, 784, 880], wave: "sine", gap: 0.07, decay: 0.4, unlockPoints: 800 },
  };
  // WICHTIG: alle drei Benachrichtigungs-Einstellungen (Ton, Farbe, Einstellungen pro Art) im
  // Konto gespeichert, nicht localStorage — sonst würden sie sich beim Gerätewechsel oder nach
  // dem Leeren des Caches immer wieder zurücksetzen, statt fest mit dem Profil verbunden zu sein.
  function getNotifySoundKey() {
    const profile = Backend.currentProfile();
    return (profile && profile.extraProfileData && profile.extraProfileData.notifySound) || "ding";
  }
  async function setNotifySoundKey(key) {
    await Backend.updateExtraProfileField("notifySound", key);
  }
  // Vier wählbare Ring-/Ticker-Farben — dieselbe Freischalt-Logik wie bei den Tönen.
  const NOTIFY_COLOR_PRESETS = {
    coral: { label: "🟠 Koralle (Standard)", hex: "#ff4d4d", unlockPoints: 0 },
    teal: { label: "🟢 Türkis", hex: "#2fbf9f", unlockPoints: 0 },
    violet: { label: "🟣 Violett", hex: "#a05fe8", unlockPoints: 150 },
    gold: { label: "🟡 Gold", hex: "#e8b93d", unlockPoints: 400 },
    white: { label: "⚪ Weiß", hex: "#ffffff", unlockPoints: 100 },
    blue: { label: "🔵 Blau", hex: "#3d8be8", unlockPoints: 200 },
    pink: { label: "🩷 Pink", hex: "#f24fa0", unlockPoints: 300 },
    lime: { label: "🟢 Limette", hex: "#8de83d", unlockPoints: 350 },
    red: { label: "🔴 Rot", hex: "#e83d3d", unlockPoints: 250 },
    silver: { label: "⚪ Silber", hex: "#c4c9d1", unlockPoints: 500 },
  };
  function getNotifyColorKey() {
    const profile = Backend.currentProfile();
    return (profile && profile.extraProfileData && profile.extraProfileData.notifyColor) || "coral";
  }
  async function setNotifyColorKey(key) {
    await Backend.updateExtraProfileField("notifyColor", key);
    applyNotifyColor();
  }
  function applyNotifyColor() {
    const preset = NOTIFY_COLOR_PRESETS[getNotifyColorKey()] || NOTIFY_COLOR_PRESETS.coral;
    document.documentElement.style.setProperty("--notify-color", preset.hex);
  }
  // Pro-Art-Einstellungen: Ton/Farbe können für jede Benachrichtigungsart einzeln überschrieben
  // werden. Ist für eine Art nichts eingestellt, gilt automatisch der globale Standard oben —
  // so hat man die Freiheit, EINEN Ton/EINE Farbe für alles zu nehmen, ODER gezielt einzelne
  // Arten individuell einzustellen.
  const NOTIFY_KINDS = {
    mail: { label: "✉️ Neue Nachricht" },
    friendrequest: { label: "👥 Freundschaftsanfrage" },
    challenge: { label: "🎮 Herausforderung" },
    other: { label: "🔔 Sonstiges (Freischaltung, Like, Kommentar)" },
  };
  function getNotifyTypeSettings() {
    const profile = Backend.currentProfile();
    return (profile && profile.extraProfileData && profile.extraProfileData.notifyTypeSettings) || {};
  }
  async function setNotifyTypeSetting(kind, field, value) {
    const all = getNotifyTypeSettings();
    const updated = { ...all, [kind]: { ...(all[kind] || {}) } };
    if (value === "") delete updated[kind][field]; else updated[kind][field] = value;
    await Backend.updateExtraProfileField("notifyTypeSettings", updated);
  }
  function resolveNotifySound(kind) {
    const override = getNotifyTypeSettings()[kind]?.sound;
    return override || getNotifySoundKey();
  }
  function resolveNotifyColorHex(kind) {
    const override = getNotifyTypeSettings()[kind]?.color;
    const key = override || getNotifyColorKey();
    return (NOTIFY_COLOR_PRESETS[key] || NOTIFY_COLOR_PRESETS.coral).hex;
  }

  // Schriftarten-Shop für Überschriften (Logo, Profil-Name, Kategorien …) — überschreibt einfach
  // dieselbe CSS-Variable, die schon überall für Überschriften genutzt wird.
  const HEADING_FONT_PRESETS = {
    standard: { label: "Baloo (Standard)", css: '"Baloo 2", "Segoe UI", sans-serif', unlockPoints: 0 },
    pacifico: { label: "🖋️ Verspielt", css: '"Pacifico", cursive', unlockPoints: 0 },
    bebas: { label: "🏛️ Plakativ", css: '"Bebas Neue", sans-serif', unlockPoints: 150 },
    caveat: { label: "✍️ Handschrift", css: '"Caveat", cursive', unlockPoints: 150 },
    playfair: { label: "👑 Elegant", css: '"Playfair Display", serif', unlockPoints: 400 },
  };
  function getHeadingFontKey() {
    const profile = Backend.currentProfile();
    return (profile && profile.extraProfileData && profile.extraProfileData.headingFontKey) || "standard";
  }
  function setHeadingFontKey(key) {
    Backend.updateExtraProfileField("headingFontKey", key);
    applyHeadingFont();
  }
  function applyHeadingFont() {
    const preset = HEADING_FONT_PRESETS[getHeadingFontKey()] || HEADING_FONT_PRESETS.standard;
    document.documentElement.style.setProperty("--font-display", preset.css);
  }

  // WICHTIG: im Konto gespeichert, nicht localStorage — sonst genau dasselbe Problem wie beim
  // Lernprofil: eine auf dem iPhone gesetzte Einstellung würde auf Android nie ankommen.
  function isTickerBlinkOn() {
    const profile = Backend.currentProfile();
    return Boolean(profile && profile.extraProfileData && profile.extraProfileData.tickerBlink);
  }
  function getTickerBlinkSpeed() {
    const profile = Backend.currentProfile();
    return (profile && profile.extraProfileData && profile.extraProfileData.tickerBlinkSpeed) || "0.7";
  }
  function applyTickerBlinkVisual() {
    const wrap = document.querySelector(".ticker-track-wrap");
    const track = document.querySelector(".ticker-track");
    const blinkOn = isTickerBlinkOn();
    if (wrap) wrap.classList.toggle("ticker-blink", blinkOn);
    document.documentElement.style.setProperty("--ticker-blink-speed", getTickerBlinkSpeed() + "s");
    // Eigene, stabile Farbe für den Ticker — bewusst über die Grundfarbe (nicht die dynamische,
    // pro Nachrichtenart wechselnde --notify-color), damit ankommende Postfach-Nachrichten in
    // einer anderen Farbe den Ticker nicht ungewollt mitfärben.
    document.documentElement.style.setProperty("--ticker-blink-color", (NOTIFY_COLOR_PRESETS[getNotifyColorKey()] || NOTIFY_COLOR_PRESETS.coral).hex);
    // Beim Umschalten selbst (nicht nur beim nächsten Text-Update) muss die Animationsdauer sofort
    // neu gesetzt werden — sonst bleibt der alte, zur falschen Anzahl Animationen passende Wert
    // aktiv, bis zufällig mal wieder neuer Text ankommt.
    if (track) {
      const textWidth = track.scrollWidth;
      const pixelsPerSecond = 55;
      const scrollDuration = Math.max(12, textWidth / pixelsPerSecond);
      track.style.animationDuration = blinkOn ? `${getTickerBlinkSpeed()}s, ${scrollDuration}s` : `${scrollDuration}s`;
    }
  }
  async function setTickerBlink(on) {
    await Backend.updateExtraProfileField("tickerBlink", on);
    applyTickerBlinkVisual();
  }
  async function setTickerBlinkSpeed(speed) {
    await Backend.updateExtraProfileField("tickerBlinkSpeed", speed);
    applyTickerBlinkVisual();
  }
  applyNotifyColor();
  applyTickerBlinkVisual();
  applyHeadingFont();

  function goToFriendsInbox() {
    activateTab("view-profile");
    document.querySelector('#profileSubnav [data-sub="sub-friends"]').click();
  }
  function updateNotifyBadge(count, friendsCount) {
    const badge = document.getElementById("loginBtnBadge");
    if (badge) badge.style.display = count > 0 ? "block" : "none";
    // Der "Freunde"-Reiter darf NUR auf Freundschaftsanfragen und Herausforderungen reagieren —
    // vorher nutzte er dieselbe Gesamtzahl wie die Haupt-Pille, wodurch er fälschlich auch bei
    // einer reinen Nachrichten-Benachrichtigung blinkte, obwohl unter "Freunde" gar nichts war.
    const tabBadge = document.getElementById("friendsTabBadge");
    if (tabBadge) tabBadge.style.display = friendsCount > 0 ? "block" : "none";
    if (loginBtn) loginBtn.classList.toggle("notify-ring", count > 0 && !isNotifyBlinkMuted());
  }
  let lastFriendReqCount = 0;
  let lastChallengeReqCount = 0;
  let lastUnreadMsgCount = 0;
  let notifyTarget = null; // wohin ein Klick auf die blinkende Profil-Pille als Nächstes springen soll
  // Scrollt zum Ziel-Element und hebt es kurz farblich hervor, damit klar ist: genau HIER ist das
  // Neue, das gerade eine Benachrichtigung ausgelöst hat — nicht nur "irgendwo in diesem Bereich".
  function scrollToAndHighlight(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const target = el.closest(".breakdown-row") || el;
    target.classList.add("notify-target-highlight");
    setTimeout(() => target.classList.remove("notify-target-highlight"), 2600);
  }
  // Wartet darauf, dass das Sprungziel im DOM erscheint (statt nur EINMAL nach einer festen,
  // kurzen Verzögerung zu suchen) — auf einer echten Seite mit echter Netzwerk-Latenz kann das
  // Laden der Liste länger als die alte feste Wartezeit dauern, wodurch der Sprung sonst still
  // fehlschlägt und man nur oben im Bereich landet statt direkt bei der Nachricht/dem Kommentar.
  function scrollToAndHighlightWhenReady(selector, maxAttempts = 20) {
    let attempts = 0;
    const tryNow = () => {
      attempts += 1;
      if (document.querySelector(selector)) { scrollToAndHighlight(selector); return; }
      if (attempts < maxAttempts) setTimeout(tryNow, 150);
    };
    tryNow();
  }
  let notifyPrimed = false;
  let toastedNotificationIds = new Set();
  async function checkNotifications() {
    if (!Backend.currentUser()) { updateNotifyBadge(0); return; }
    const [requests, challenges, notifications, myMessages] = await Promise.all([Backend.getIncomingRequests(), Backend.getMyChallenges(), Backend.getUnreadNotifications(), Backend.getMyMessages()]);
    const unreadInbox = myMessages.inbox.filter((m) => !m.read);
    const unreadMsgCount = unreadInbox.length;
    const inboxBadge = document.getElementById("inboxTabBadge");
    if (inboxBadge) inboxBadge.style.display = unreadMsgCount > 0 ? "block" : "none";
    const challengeCount = challenges.incoming.length;
    let hasNew = false;
    let newestKind = null; // welche Art zuletzt neu dazukam -> bestimmt Ton/Farbe dieses Durchlaufs
    // Merkt sich, WOHIN ein Klick auf die blinkende Profil-Pille genau springen soll — nicht nur
    // "irgendwo ins Profil", sondern direkt zur betroffenen Zeile (Nachricht, Anfrage, Duell).
    // Neue Nachrichten im Postfach sollen genauso wie Freundschaftsanfragen/Duelle/Benachrichtigungen
    // das Profil-Symbol blinken lassen und einen Ton abspielen — vorher landeten sie nur als
    // stiller Punkt auf dem Postfach-Reiter, ohne echte Benachrichtigung auszulösen.
    if (unreadMsgCount > lastUnreadMsgCount && !toastedNotificationIds.has("msgcount-" + unreadMsgCount)) {
      toastedNotificationIds.add("msgcount-" + unreadMsgCount);
      const newestMsg = unreadInbox[0];
      const jumpToMsg = () => { activateTab("view-profile"); document.querySelector('[data-sub="sub-inbox"]').click(); scrollToAndHighlightWhenReady(`[data-msg-row="${newestMsg?.id}"]`); };
      showToast("✉️ Neue Nachricht im Postfach", jumpToMsg);
      notifyTarget = { kind: "mail", action: jumpToMsg };
      hasNew = true; newestKind = "mail";
    }
    lastUnreadMsgCount = unreadMsgCount;
    // Freundschaftsanfragen, Duell-Einladungen und persönliche Benachrichtigungen werden über ihre
    // eigene ID verfolgt (nicht nur über einen Zähler) — so wird auch das, was schon beim allerersten
    // Öffnen der Seite bereits wartet, zuverlässig gemeldet, statt beim ersten Check still verschluckt zu werden.
    requests.forEach((r) => {
      if (!toastedNotificationIds.has("freq-" + r.id)) {
        toastedNotificationIds.add("freq-" + r.id);
        const jumpToReq = () => { activateTab("view-profile"); document.querySelector('[data-sub="sub-friends"]').click(); scrollToAndHighlightWhenReady(`[data-accept="${r.id}"]`); };
        showToast("👥 Neue Freundschaftsanfrage — antippen zum Annehmen", jumpToReq);
        notifyTarget = { kind: "friendrequest", action: jumpToReq };
        hasNew = true; newestKind = "friendrequest";
      }
    });
    challenges.incoming.forEach((c) => {
      if (!toastedNotificationIds.has("chal-" + c.id)) {
        toastedNotificationIds.add("chal-" + c.id);
        const jumpToChal = () => { activateTab("view-profile"); document.querySelector('[data-sub="sub-friends"]').click(); scrollToAndHighlightWhenReady(`[data-accept-challenge="${c.id}"]`); };
        showToast("🎮 Neue Duell-Herausforderung — antippen zum Annehmen", jumpToChal);
        notifyTarget = { kind: "challenge", action: jumpToChal };
        hasNew = true; newestKind = "challenge";
      }
    });
    notifications.forEach((n) => {
      if (!toastedNotificationIds.has(n.id)) {
        toastedNotificationIds.add(n.id);
        // Versteckte Zielreferenz aus der Nachricht herauslösen (falls vorhanden) — steuert, wohin
        // ein Klick genau springt (z. B. direkt zum kommentierten/gelikten Beitrag im Schwarmwissen
        // statt nur allgemein ins Profil).
        const targetMatch = n.message.match(/\[\[target:(\w+):([\w-]+)\]\]/);
        const cleanMessage = n.message.replace(/\[\[target:[\w-]+:[\w-]+\]\]/, "");
        // WICHTIG — behebt einen echten Bug: bisher markierte NUR ein separater, versteckter
        // "Alle als gelesen"-Knopf im Profil (dismissNotificationsBtn) Benachrichtigungen als
        // gelesen. Klickte man stattdessen auf das blinkende Profilbild selbst (der naheliegendste
        // Weg), sprang man zwar zum Ziel, aber die Benachrichtigung blieb in der Datenbank
        // weiterhin "ungelesen" — sie kam bei jedem erneuten Check wieder, das Blinken hörte nie
        // auf, egal wie oft man draufklickte. Jetzt markiert schon der Klick selbst sie als
        // gelesen, bevor zum Ziel gesprungen wird.
        const markReadAndJump = (jumpFn) => () => { Backend.markNotificationsRead([n.id]); jumpFn(); };
        const jumpToOther = markReadAndJump(targetMatch
          ? () => {
              const [, view, textId] = targetMatch;
              const subTarget = view === "community" ? "sub-community" : "sub-tips";
              document.querySelector('[data-target="view-knowledge"]').click();
              setTimeout(() => {
                document.querySelector(`#knowledgeSubnav [data-sub="${subTarget}"]`)?.click();
                scrollToAndHighlightWhenReady(`[data-text-id="${textId}"]`);
              }, 150);
            }
          : () => document.querySelector('[data-target="view-profile"]').click());
        showToast(cleanMessage, jumpToOther);
        notifyTarget = { kind: "other", action: jumpToOther };
        hasNew = true; newestKind = "other";
      }
    });
    lastFriendReqCount = requests.length;
    lastChallengeReqCount = challengeCount;
    notifyPrimed = true;
    const totalCount = requests.length + challengeCount + notifications.length + unreadMsgCount;
    if (totalCount === 0) notifyTarget = null;
    updateNotifyBadge(totalCount, requests.length + challengeCount);
    if (hasNew) {
      if (newestKind) document.documentElement.style.setProperty("--notify-color", resolveNotifyColorHex(newestKind));
      playNotifySound(newestKind ? resolveNotifySound(newestKind) : undefined);
      startNotifyReminder();
    }
  }
  // Wiederholt den sanften Hinweiston alle 5 Sekunden, solange noch etwas unbestätigt ist — hört
  // von selbst auf, sobald das Lämpchen verschwindet (z. B. weil im Profil bestätigt wurde).
  let notifyReminderTimer = null;
  function startNotifyReminder() {
    if (notifyReminderTimer) return;
    notifyReminderTimer = setInterval(() => {
      const badge = document.getElementById("loginBtnBadge");
      if (!badge || badge.style.display === "none") {
        clearInterval(notifyReminderTimer);
        notifyReminderTimer = null;
        return;
      }
      playNotifySound();
    }, 5000);
  }
  // Sofortige Unterbrechung: sobald die Person die Benachrichtigung tatsächlich antippt (egal ob
  // über die Toast-Blase oder die Profil-Pille selbst), soll der Ton SOFORT aufhören — nicht erst
  // beim nächsten Hintergrund-Check in bis zu 20 Sekunden. Das System "weiß" damit sofort, dass die
  // Person die Nachricht bereits geöffnet hat.
  function stopNotifyReminder() {
    if (notifyReminderTimer) { clearInterval(notifyReminderTimer); notifyReminderTimer = null; }
    updateNotifyBadge(0);
  }
  checkNotifications();
  setInterval(checkNotifications, 20000);
  loadAndRenderAboutSection();

  const weatherOut = document.getElementById("weatherOut");
  const weatherIcon = document.getElementById("weatherIcon");
  // Niedliche, klar unterscheidbare Symbole je Wetterlage (WMO-Code -> Emoji)
  const WEATHER_ICONS = {
    0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
    45: "🌫️", 48: "🌫️",
    51: "🌦️", 53: "🌦️", 55: "🌧️", 56: "🌧️", 57: "🌧️",
    61: "🌧️", 63: "🌧️", 65: "⛈️",
    66: "🌨️", 67: "🌨️",
    71: "🌨️", 73: "❄️", 75: "❄️", 77: "🌨️",
    80: "🌦️", 81: "🌧️", 82: "⛈️",
    85: "🌨️", 86: "❄️",
    95: "⛈️", 96: "⛈️", 99: "⛈️",
  };
  async function updateWeather() {
    if (!weatherOut) return;
    try {
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.405&current=temperature_2m,weather_code&timezone=Europe%2FBerlin");
      if (!res.ok) throw new Error("Wetter nicht verfügbar");
      const data = await res.json();
      weatherOut.textContent = `${Math.round(data.current.temperature_2m)}°`;
      if (weatherIcon) weatherIcon.textContent = WEATHER_ICONS[data.current.weather_code] || "🌡️";
    } catch (e) {
      weatherOut.textContent = "—";
    }
  }
  updateWeather();
  setInterval(updateWeather, 15 * 60 * 1000);

  /* ============================================================
     ÜBUNGEN — Setup / Spiel / Auswertung
     ============================================================ */
  const setupEl = document.getElementById("exerciseSetup");
  const playEl = document.getElementById("exercisePlay");
  const resultsEl = document.getElementById("exerciseResults");

  let selectedCategories = new Set();
  let selectedDifficulty = "leicht";
  let orderMode = "mixed"; // 'mixed' | 'sequential'

  let selectedChallengeFriendIds = new Set();
  let challengePickerExpanded = false;
  let challengePickerSearch = "";
  // Wiederverwendbare Einladungs-Leiste für die neueren Spiele (Wortbaustelle, Buchstabensalat,
  // Kreuzworträtsel, Betonungs-Trainer) — dasselbe Muster wie bei den klassischen Übungen: auch
  // offline Freunde einladbar (spielen die Runde nach, sobald sie sich einloggen), mehrere
  // gleichzeitig auswählbar.
  const miniChallengeSelections = {}; // { gameKey: Set<friendId> }
  const miniChallengeExpanded = {}; // { gameKey: bool } -- aufgeklappt oder eingeklappt
  const miniChallengeSearch = {}; // { gameKey: string } -- Suchtext zum Filtern
  // Zwischenspeicher pro Spiel: verhindert, dass bei JEDEM Tastendruck/Klick (der die ganze
  // Runde neu rendert) die Einladungsleiste erneut vom Server geladen wird — das ließ sie kurz
  // leer erscheinen und dann nachträglich "reinspringen", was wie ein Layout-Sprung wirkte.
  // Nur beim ersten Aufruf pro Runde wird wirklich neu geladen, danach wird der Zwischenspeicher
  // sofort (ohne Verzögerung) wiederverwendet.
  const miniChallengeBarCache = {}; // cached: die geladene FREUNDESLISTE (teurer Netzwerk-Teil) —
  // NICHT das fertige HTML, sonst würde die Auswahl beim erneuten Rendern nie sichtbar, weil
  // immer der alte, unveränderte Stand aus dem Cache gezeigt würde.
  function renderMiniChallengeBarCached(gameKey, categoryId, targetElId, container, onRerender) {
    const el = document.getElementById(targetElId);
    if (!el) return;
    if (miniChallengeBarCache[gameKey]) {
      el.innerHTML = buildMiniChallengeBarHtml(gameKey, categoryId, miniChallengeBarCache[gameKey]);
      wireMiniChallengeBar(container, gameKey, onRerender);
      return;
    }
    fetchMiniChallengeFriends(gameKey).then((friends) => {
      miniChallengeBarCache[gameKey] = friends;
      const freshEl = document.getElementById(targetElId);
      if (freshEl) { freshEl.innerHTML = buildMiniChallengeBarHtml(gameKey, categoryId, friends); wireMiniChallengeBar(container, gameKey, onRerender); }
    });
  }
  async function fetchMiniChallengeFriends(gameKey) {
    if (!miniChallengeSelections[gameKey]) miniChallengeSelections[gameKey] = new Set();
    if (!Backend.currentUser()) return [];
    return await Backend.getFriends();
  }
  function buildMiniChallengeBarHtml(gameKey, categoryId, friends) {
    if (!friends.length) return "";
    const selected = miniChallengeSelections[gameKey];
    const expanded = miniChallengeExpanded[gameKey];
    const search = miniChallengeSearch[gameKey] || "";
    const selectedFriendObjs = friends.filter((f) => selected.has(f.id));
    // Aufklappbar statt einer immer sichtbaren, potenziell sehr langen Liste — gleiches Muster
    // wie bei Memory und den Haupt-Übungen: standardmäßig eingeklappt, mit Suchfeld zum Filtern,
    // ausgewählte Personen bleiben als Chips sichtbar.
    const filteredFriends = search ? friends.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())) : friends;
    const onlineFriends = filteredFriends.filter((f) => f.online);
    const offlineFriends = filteredFriends.filter((f) => !f.online);
    const pillHtml = (f) => `
      <button type="button" class="challenge-friend-pill ${!f.online ? "offline" : ""} ${selected.has(f.id) ? "selected" : ""}" data-mini-game="${gameKey}" data-mini-friend="${f.id}" ${!f.online ? 'title="Spielt die Runde, sobald sie sich wieder einloggen"' : ""}>
        ${f.online ? '<span class="online-dot"></span>' : ""}${f.name}${!f.online ? ' <span class="empty-note">(offline)</span>' : ""}
      </button>`;
    return `
      <div class="setup-bar" style="margin-top:10px; flex-direction:column; align-items:stretch;">
        <button type="button" class="emoji-toggle-link" data-mini-toggle="${gameKey}" style="text-align:left; font-size:0.82rem; font-weight:700; color:var(--cream-200);">
          🎮 Optional: Freunde herausfordern ${selectedFriendObjs.length ? `(${selectedFriendObjs.length} ausgewählt)` : ""} ${expanded ? "▾" : "▸"}
        </button>
        ${selectedFriendObjs.length ? `<div class="challenge-friend-list" style="margin-top:6px;">
          ${selectedFriendObjs.map((f) => `<button type="button" class="challenge-friend-pill selected" data-mini-game="${gameKey}" data-mini-friend="${f.id}">${f.name} ✕</button>`).join("")}
        </div>` : ""}
        ${expanded ? `
          <input type="text" class="vocab-search" data-mini-search="${gameKey}" placeholder="Nach Namen suchen…" value="${search}" style="margin-top:8px;" />
          <div class="challenge-friend-list" style="margin-top:6px; max-height:180px; overflow-y:auto;">
            ${[...onlineFriends, ...offlineFriends].length ? [...onlineFriends, ...offlineFriends].map(pillHtml).join("") : '<p class="empty-note">Niemanden gefunden.</p>'}
          </div>` : ""}
        ${selected.size ? `<button type="button" class="btn btn-coffee" id="miniChallengeSendBtn" data-mini-game="${gameKey}" data-mini-cat="${categoryId}" style="margin-top:8px;">🎮 ${selected.size} ${selected.size === 1 ? "Person" : "Personen"} herausfordern</button>` : ""}
      </div>`;
  }
  function wireMiniChallengeBar(container, gameKey, onRerender) {
    container.querySelector(`[data-mini-toggle="${gameKey}"]`)?.addEventListener("click", () => {
      miniChallengeExpanded[gameKey] = !miniChallengeExpanded[gameKey];
      onRerender();
    });
    container.querySelector(`[data-mini-search="${gameKey}"]`)?.addEventListener("input", (e) => {
      miniChallengeSearch[gameKey] = e.target.value;
      onRerender();
    });
    container.querySelectorAll(`[data-mini-game="${gameKey}"].challenge-friend-pill`).forEach((btn) => {
      btn.addEventListener("click", () => {
        const set = miniChallengeSelections[gameKey];
        const id = btn.dataset.miniFriend;
        if (set.has(id)) set.delete(id); else set.add(id);
        onRerender();
      });
    });
    const sendBtn = container.querySelector(`[data-mini-game="${gameKey}"]#miniChallengeSendBtn`);
    if (sendBtn) {
      sendBtn.addEventListener("click", async () => {
        const ids = [...miniChallengeSelections[gameKey]];
        const catId = sendBtn.dataset.miniCat;
        sendBtn.disabled = true; sendBtn.textContent = "Sende…";
        for (const fid of ids) {
          try { await Backend.createChallenge(fid, [catId]); } catch (e) { console.warn(e); }
        }
        miniChallengeSelections[gameKey] = new Set();
        onRerender();
      });
    }
  }
  let selectedQuizTopic = "";
  let selectedWortschatzTopic = "";

  async function renderSetup() {
    setupEl.style.display = "";
    playEl.style.display = "none";
    resultsEl.style.display = "none";

    const paused = Quiz.getState();
    const isPaused = paused && paused.index < paused.questions.length;
    const resumeBar = isPaused ? `
      <div class="demo-banner" style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <span>⏸ Du hast eine Runde offen (Frage ${paused.index + 1}/${paused.questions.length}).</span>
        <span style="display:flex; gap:6px;">
          <button type="button" class="btn btn-coffee" id="resumeBtn">▶ Fortsetzen</button>
          <button type="button" class="btn btn-ghost" id="discardBtn">✕ Verwerfen</button>
        </span>
      </div>` : "";

    const myProfile = Backend.currentProfile();
    const cards = ExerciseData.CATEGORIES.map((cat) => {
      const unlocked = isUnlocked(cat.unlock, myProfile) || (myProfile?.giftedCategories || []).includes(cat.id);
      let topicPicker = "";
      if (cat.id === "quiz" && selectedCategories.has("quiz")) {
        topicPicker = `
        <div class="quiztopic-row">
          <button type="button" class="order-pill quiztopic-pill" data-quiztopic="" aria-selected="${selectedQuizTopic === ""}">🏆 Alle Themen</button>
          ${ExerciseData.getQuizTopics().map((t) => `<button type="button" class="order-pill quiztopic-pill" data-quiztopic="${t}" aria-selected="${selectedQuizTopic === t}">${t}</button>`).join("")}
        </div>`;
      } else if (cat.id === "wortschatz" && selectedCategories.has("wortschatz")) {
        topicPicker = `
        <div class="quiztopic-row">
          <button type="button" class="order-pill wortschatztopic-pill" data-wortschatztopic="" aria-selected="${selectedWortschatzTopic === ""}">🧠 Alle Themen</button>
          ${ExerciseData.getWortschatzThemen().map((t) => `<button type="button" class="order-pill wortschatztopic-pill" data-wortschatztopic="${t}" aria-selected="${selectedWortschatzTopic === t}">${t}</button>`).join("")}
        </div>`;
      }
      if (!unlocked) {
        const cond = cat.unlock.type === "points" ? `Ab ${cat.unlock.value} Punkten` : `Pokal „${cat.unlock.match}" nötig`;
        return `
        <div class="category-card theme-locked" data-locked-info="🔒 ${cond}">
          <div class="cat-checkbox">🔒</div>
          <div class="cat-body">
            <div class="cat-title-row"><span class="cat-icon">${cat.icon}</span><span>${cat.title}</span></div>
            <div class="cat-info-text open">${cond} — weiter üben!</div>
          </div>
        </div>`;
      }
      return `
        <div class="category-card" data-cat="${cat.id}">
          <div class="cat-checkbox">${selectedCategories.has(cat.id) ? "✓" : ""}</div>
          <div class="cat-body">
            <div class="cat-title-row">
              <span class="cat-icon">${cat.icon}</span>
              <span>${cat.title}</span>
              ${personaLedHtml(cat.id)}
              <button type="button" class="cat-info-btn" data-info="${cat.id}" aria-label="Info">ⓘ</button>
              <button type="button" class="cat-collapse-btn" data-collapse="${cat.id}" aria-label="Einklappen">▾</button>
            </div>
            <div class="cat-info-text" id="info-${cat.id}">${cat.info}</div>
            ${topicPicker}
          </div>
        </div>`;
    }).join("");

    const maxAvailable = selectedCategories.size ? Quiz.poolSizeFor([...selectedCategories], { quiz: selectedQuizTopic, wortschatz: selectedWortschatzTopic }) : 0;
    const currentDiffCount = (Quiz.DIFFICULTIES.find((d) => d.id === selectedDifficulty) || {}).count || 0;
    if (currentDiffCount > maxAvailable) {
      const fitting = Quiz.DIFFICULTIES.filter((d) => d.count <= maxAvailable).sort((a, b) => b.count - a.count)[0];
      selectedDifficulty = fitting ? fitting.id : "leicht";
    }

    const isLoggedIn = Boolean(Backend.currentUser());
    const friends = isLoggedIn ? await Backend.getFriends() : [];
    const bestFriendIds = Backend.getBestFriendIds();
    // Bei vielen Freunden würde eine einzige, ungeordnete Blase aus Namen schnell unübersichtlich
    // — deshalb drei klare Gruppen, jede Person erscheint nur in der jeweils höchstpriorisierten:
    // 1) online, 2) beste Freunde (offline), 3) alle anderen, alphabetisch sortiert.
    const onlineFriends = friends.filter((f) => f.online);
    const bestFriendsOffline = friends.filter((f) => !f.online && bestFriendIds.includes(f.id));
    const otherFriends = friends.filter((f) => !f.online && !bestFriendIds.includes(f.id)).sort((a, b) => a.name.localeCompare(b.name, "de"));
    const challengePillHtml = (f) => `
      <button type="button" class="challenge-friend-pill ${!f.online ? "offline" : ""} ${selectedChallengeFriendIds.has(f.id) ? "selected" : ""}" data-challenge-friend="${f.id}" ${!f.online ? 'title="Spielt die Runde, sobald sie sich wieder einloggen"' : ""}>
        ${f.online ? '<span class="online-dot"></span>' : ""}${bestFriendIds.includes(f.id) ? "⭐ " : ""}${f.name}${!f.online ? ' <span class="empty-note">(offline)</span>' : ""}
      </button>`;
    // Bei vielen Freunden (potenziell hunderte) wäre eine komplett ausgeklappte A-Z-Liste völlig
    // unübersichtlich — deshalb standardmäßig nur die ersten paar, mit einem "mehr anzeigen"-
    // Knopf für den Rest, statt einer endlosen Bubble-Wand.
    const OTHER_FRIENDS_PREVIEW = 8;
    const otherFriendsPreview = otherFriends.slice(0, OTHER_FRIENDS_PREVIEW);
    const otherFriendsRest = otherFriends.slice(OTHER_FRIENDS_PREVIEW);
    const selectedFriendObjs = friends.filter((f) => selectedChallengeFriendIds.has(f.id));
    // Gesamte Auswahl standardmäßig eingeklappt, mit Suchfeld — bei sehr vielen Freunden (auch
    // "nur" die Online-Gruppe allein) war die Liste vorher immer komplett sichtbar und nahm viel
    // Platz ein, selbst wenn man gar keine Herausforderung starten wollte.
    const challengeFilterActive = challengePickerSearch.trim().length > 0;
    const filterMatch = (f) => !challengeFilterActive || f.name.toLowerCase().includes(challengePickerSearch.toLowerCase());
    const challengeBar = friends.length ? `
      <div class="setup-bar" style="margin-top:10px; flex-direction:column; align-items:stretch;">
        <button type="button" class="emoji-toggle-link" id="challengePickerToggle" style="text-align:left; font-size:0.82rem; font-weight:700; color:var(--cream-200);">
          🎮 Optional: Freunde herausfordern ${selectedFriendObjs.length ? `(${selectedFriendObjs.length} ausgewählt)` : ""} ${challengePickerExpanded ? "▾" : "▸"}
        </button>
        ${selectedFriendObjs.length ? `<div class="challenge-friend-list" style="margin-top:6px;">
          ${selectedFriendObjs.map((f) => `<button type="button" class="challenge-friend-pill selected" data-challenge-friend="${f.id}">${f.name} ✕</button>`).join("")}
        </div>` : ""}
        ${challengePickerExpanded ? `
          <input type="text" class="vocab-search" id="challengePickerSearchInput" placeholder="Nach Namen suchen…" value="${challengePickerSearch}" style="margin-top:8px;" />
          ${challengeFilterActive ? `<div class="challenge-friend-list" style="margin-top:6px;">${friends.filter(filterMatch).map(challengePillHtml).join("") || '<p class="empty-note">Niemanden gefunden.</p>'}</div>` : `
            ${onlineFriends.length ? `<p class="empty-note" style="font-size:0.72rem; margin:6px 0 2px;">🟢 Online</p><div class="challenge-friend-list">${onlineFriends.map(challengePillHtml).join("")}</div>` : ""}
            ${bestFriendsOffline.length ? `<p class="empty-note" style="font-size:0.72rem; margin:6px 0 2px;">⭐ Beste Freunde</p><div class="challenge-friend-list">${bestFriendsOffline.map(challengePillHtml).join("")}</div>` : ""}
            ${otherFriends.length ? `<p class="empty-note" style="font-size:0.72rem; margin:6px 0 2px;">A–Z</p><div class="challenge-friend-list">${otherFriendsPreview.map(challengePillHtml).join("")}</div>
              ${otherFriendsRest.length ? `<button type="button" class="emoji-toggle-link" id="challengeOthersMoreBtn" style="font-size:0.72rem; margin-top:4px;">+${otherFriendsRest.length} weitere anzeigen</button>
                <div class="challenge-friend-list" id="challengeOthersMoreList" style="display:none; margin-top:4px;">${otherFriendsRest.map(challengePillHtml).join("")}</div>` : ""}` : ""}
          `}` : ""}
      </div>` : "";

    setupEl.innerHTML = `
      ${resumeBar}
      <div class="category-grid">${cards}</div>
      ${challengeBar}
      <div class="setup-bar">
        <div class="diff-pills">
          ${Quiz.DIFFICULTIES.map((d) => `<button type="button" class="diff-pill" data-diff="${d.id}" aria-selected="${d.id === selectedDifficulty}" ${maxAvailable < d.count ? "disabled" : ""}>${d.label} (${d.count})</button>`).join("")}
        </div>
        <button type="button" class="btn-start" id="startBtn" ${selectedCategories.size === 0 ? "disabled" : ""}>${selectedChallengeFriendIds.size ? `Duell starten 🎮 (${selectedChallengeFriendIds.size})` : "Runde starten ▶"}</button>
      </div>
      ${selectedCategories.size > 1 ? `
        <div class="order-toggle">
          <button type="button" class="order-pill" data-order="mixed" aria-selected="${orderMode === "mixed"}">🔀 Gemischt</button>
          <button type="button" class="order-pill" data-order="sequential" aria-selected="${orderMode === "sequential"}">📶 Nacheinander</button>
        </div>` : ""}
      ${selectedCategories.size === 0 ? '<p class="empty-note">Wähle mindestens eine Kategorie aus, um zu starten. Mehrere Kategorien zusammen ergeben spannendere Charakter-Typen!</p>' : '<p class="empty-note">⚡ Tipp: Antworte innerhalb von 4 Sekunden richtig für einen Tempo-Bonus.</p>'}
    `;

    setupEl.querySelectorAll(".category-card").forEach((card) => {
      const id = card.dataset.cat;
      if (!id) {
        card.addEventListener("click", () => alert(card.dataset.lockedInfo || "Diese Kategorie ist noch gesperrt."));
        return;
      }
      card.classList.toggle("selected", selectedCategories.has(id));
      card.addEventListener("click", (e) => {
        if (e.target.closest(".cat-info-btn") || e.target.closest(".cat-collapse-btn") || e.target.closest(".quiztopic-row")) return;
        if (selectedCategories.has(id)) selectedCategories.delete(id);
        else selectedCategories.add(id);
        renderSetup();
      });
    });
    setupEl.querySelectorAll(".cat-info-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById(`info-${btn.dataset.info}`).classList.toggle("open");
      });
    });
    setupEl.querySelectorAll(".cat-collapse-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.closest(".category-card").classList.toggle("collapsed");
      });
    });
    setupEl.querySelectorAll(".diff-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedDifficulty = btn.dataset.diff;
        renderSetup();
      });
    });
    setupEl.querySelectorAll(".order-pill:not(.quiztopic-pill):not(.wortschatztopic-pill)").forEach((btn) => {
      btn.addEventListener("click", () => {
        orderMode = btn.dataset.order;
        renderSetup();
      });
    });
    setupEl.querySelectorAll(".quiztopic-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedQuizTopic = btn.dataset.quiztopic;
        renderSetup();
      });
    });
    setupEl.querySelectorAll(".wortschatztopic-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedWortschatzTopic = btn.dataset.wortschatztopic;
        renderSetup();
      });
    });
    document.getElementById("challengePickerToggle")?.addEventListener("click", () => {
      challengePickerExpanded = !challengePickerExpanded;
      renderSetup();
    });
    document.getElementById("challengePickerSearchInput")?.addEventListener("input", (e) => {
      challengePickerSearch = e.target.value;
      renderSetup();
    });
    setupEl.querySelectorAll("[data-challenge-friend]:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.challengeFriend;
        if (selectedChallengeFriendIds.has(id)) selectedChallengeFriendIds.delete(id);
        else selectedChallengeFriendIds.add(id);
        renderSetup();
      });
    });
    document.getElementById("challengeOthersMoreBtn")?.addEventListener("click", () => {
      const list = document.getElementById("challengeOthersMoreList");
      const btn = document.getElementById("challengeOthersMoreBtn");
      const opening = list.style.display === "none";
      list.style.display = opening ? "flex" : "none";
      if (opening) {
        list.querySelectorAll("[data-challenge-friend]:not([disabled])").forEach((b) => {
          b.addEventListener("click", () => {
            const id = b.dataset.challengeFriend;
            if (selectedChallengeFriendIds.has(id)) selectedChallengeFriendIds.delete(id);
            else selectedChallengeFriendIds.add(id);
            renderSetup();
          });
        });
      }
    });
    const startBtn = document.getElementById("startBtn");
    if (startBtn) startBtn.addEventListener("click", async () => {
      if (startBtn.disabled) return; // Schutz gegen Doppel-Tap auf Mobilgeräten
      startBtn.disabled = true;
      const titles = [...selectedCategories].map((id) => ExerciseData.getCategory(id).title).join(", ");
      const topicFilters = { quiz: selectedQuizTopic, wortschatz: selectedWortschatzTopic };
      if (selectedChallengeFriendIds.size) {
        try {
          // Bei mehreren Freunden: ein Duell pro Person anlegen, alle mit derselben Auswahl
          let firstChallengeId = null;
          for (const fid of selectedChallengeFriendIds) {
            const cid = await Backend.createChallenge(fid, [...selectedCategories]);
            if (!firstChallengeId) firstChallengeId = cid;
          }
          Quiz.startSession([...selectedCategories], selectedDifficulty, { challengeId: firstChallengeId }, orderMode, topicFilters);
        } catch (err) {
          alert(err.message || "Duell konnte nicht gestartet werden.");
          startBtn.disabled = false;
          return;
        }
      } else {
        Quiz.startSession([...selectedCategories], selectedDifficulty, null, orderMode, topicFilters);
      }
      Backend.notifyPracticing(titles);
      showToast(`🦊 Willkommen, ${personaForCategory([...selectedCategories][0])}!`);
      renderQuestion();
    });
    const resumeBtn = document.getElementById("resumeBtn");
    if (resumeBtn) resumeBtn.addEventListener("click", () => renderQuestion());
    const discardBtn = document.getElementById("discardBtn");
    if (discardBtn) discardBtn.addEventListener("click", () => {
      if (!confirm("Offene Runde wirklich verwerfen? Dein bisheriger Fortschritt geht dabei verloren.")) return;
      Quiz.reset();
      renderSetup();
    });
  }

  let currentSelection = [];
  const AUTO_ADVANCE_DELAY = 900;

  // Wiederverwendbarer "Fehler melden"-Button — kann in jedes Spiel eingebunden werden. Öffnet
  // eine kleine Auswahl (kein Text nötig), landet automatisch im Postfach des Betreibers.
  function reportBugButtonHtml() {
    return `<button type="button" class="bug-report-btn" id="bugReportBtn" title="Fehler melden">🪲</button>`;
  }
  // Gemeinsamer Fehlermelde-Dialog für beide Bug-Report-Knöpfe (den großen und den kleinen
  // "Mini"-Knopf in den Spielen) — mit einem optionalen Freitextfeld, damit man den Fehler bei
  // Bedarf genauer beschreiben kann, statt sich auf die feste Kategorie beschränken zu müssen.
  function openBugReportDialog(context) {
    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("div", { class: "profile-modal-card", style: "max-width:300px;" },
        Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
        Core.el("h3", {}, "🪲 Fehler melden"),
        Core.el("p", { class: "empty-note" }, "Was ist hier gerade schiefgelaufen? Du musst nichts schreiben, nur auswählen:"),
        Core.el("textarea", { id: "bugDetailInput", class: "guestbook-form-textarea", placeholder: "Beschreibung (optional) — hilft, den Fehler genauer zu verstehen …", maxlength: "300", style: "margin-bottom:10px;" }),
        ...["Rechtschreibfehler", "Spiel reagiert nicht / hängt", "Text abgeschnitten / falscher Zeilenumbruch", "Falsche Antwort markiert", "Fehlermeldung erschienen", "Sonstiges"].map((label) =>
          Core.el("button", { type: "button", class: "btn btn-ghost", style: "display:block; width:100%; margin-bottom:8px; text-align:left; white-space:normal; overflow-wrap:break-word;", onclick: async () => {
            const detail = document.getElementById("bugDetailInput")?.value.trim() || "";
            await Backend.reportBug(context, label, detail);
            box.remove();
            showToast("✅ Danke, Alex wurde informiert!");
          } }, label)
        )
      )
    );
    document.body.appendChild(box);
  }
  function wireBugReportButton(context) {
    const btn = document.getElementById("bugReportBtn");
    if (!btn) return;
    btn.addEventListener("click", () => openBugReportDialog(context));
  }
  function renderQuestion() {
    setupEl.style.display = "none";
    resultsEl.style.display = "none";
    playEl.style.display = "";
    currentSelection = [];
    Quiz.markShown();

    const q = Quiz.currentQuestion();
    const p = Quiz.progress();
    const isMulti = q.correct.length > 1;
    const isBlank = q.prompt.includes("___");
    const cat = ExerciseData.getCategory(q.categoryId);

    const promptHtml = isBlank
      ? q.prompt.replace("___", '<span class="blank-slot" id="blankSlot">___</span>')
      : q.prompt;
    // Steht die Lücke ganz am Satzanfang, muss das eingesetzte Wort dort großgeschrieben werden
    // (normale deutsche Rechtschreibung) — unabhängig davon, wie es in der Datenbank gespeichert
    // ist. Rein für die ANZEIGE, die interne Prüfung bleibt unverändert über den Index.
    const displayOption = (opt) => capitalizeIfSentenceStart(opt, q.prompt);

    playEl.innerHTML = `
      <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${(p.index / p.total) * 100}%"></div></div>
      <div class="question-card">
        ${reportBugButtonHtml()}
        <div class="question-meta"><span class="cat-tag">${cat.icon} ${cat.title}</span> · Frage ${p.index + 1} / ${p.total}${isMulti ? " · mehrere Antworten möglich" : ""}</div>
        <div class="question-prompt">${promptHtml}</div>
        <div class="option-list">
          ${q.options.map((opt, i) => `<button type="button" class="option-btn" data-idx="${i}"><span>${displayOption(opt)}</span></button>`).join("")}
        </div>
        <div class="question-explain" id="explainBox">${q.explain}</div>
        ${isMulti ? `<div class="quiz-actions"><button type="button" class="btn btn-coffee" id="checkBtn">Fertig ✓</button></div>` : ""}
        <div class="quiz-actions" style="justify-content:space-between; margin-top:14px;">
          <button type="button" class="btn btn-ghost" id="pauseBtn">⏸ Kategorien anpassen</button>
        </div>
      </div>
    `;

    document.getElementById("pauseBtn").addEventListener("click", () => {
      renderSetup();
    });
    wireBugReportButton(`Übung „${cat.title}" — Frage: „${q.prompt}"`);

    const optionBtns = playEl.querySelectorAll(".option-btn");
    const blankSlot = document.getElementById("blankSlot");

    function revealAndAdvance(selection) {
      const record = Quiz.submitAnswer(selection);
      const correctSet = new Set(q.correct);
      record.base > 0 ? Core.sound.correct() : Core.sound.wrong();
      optionBtns.forEach((b) => {
        const idx = Number(b.dataset.idx);
        b.classList.remove("picked");
        if (correctSet.has(idx)) b.classList.add("reveal-correct");
        else if (selection.includes(idx)) b.classList.add("reveal-wrong");
        b.disabled = true;
      });
      if (blankSlot) {
        const chosenIdx = selection[0];
        blankSlot.textContent = q.options[chosenIdx];
        blankSlot.classList.add(record.base > 0 ? "blank-correct" : "blank-wrong");
        if (record.base === 0) {
          const correctWord = q.options[q.correct[0]];
          blankSlot.insertAdjacentHTML("afterend", ` <span class="blank-correction">(richtig: ${correctWord})</span>`);
        }
      }
      document.getElementById("explainBox").classList.add("open");
      if (record.speedBonus > 0) {
        document.getElementById("explainBox").insertAdjacentHTML("beforebegin", '<div class="speed-bonus-flash">⚡ Blitzschnell! +1 Tempo-Bonus</div>');
      }
      setTimeout(() => {
        const hasMore = Quiz.advance();
        if (hasMore) renderQuestion();
        else renderResults();
      }, AUTO_ADVANCE_DELAY);
    }

    optionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        if (isMulti) {
          if (currentSelection.includes(idx)) currentSelection = currentSelection.filter((i) => i !== idx);
          else currentSelection.push(idx);
          optionBtns.forEach((b) => b.classList.toggle("picked", currentSelection.includes(Number(b.dataset.idx))));
        } else {
          optionBtns.forEach((b) => (b.disabled = true));
          revealAndAdvance([idx]);
        }
      });
    });

    const checkBtn = document.getElementById("checkBtn");
    if (checkBtn) {
      checkBtn.addEventListener("click", () => {
        if (currentSelection.length === 0) return;
        checkBtn.disabled = true;
        optionBtns.forEach((b) => (b.disabled = true));
        revealAndAdvance(currentSelection);
      });
    }
  }

  // Klassisches Mobile-Game-Sternemuster: links und rechts kleiner, Mitte größer und leicht nach
  // oben versetzt — ergibt den bekannten "Bogen"-Look. Staffelung an dieselben Schwellenwerte wie
  // die Erfolgstöne gekoppelt (70% / 40%), damit alles konsistent bleibt.
  // Echte SVG-Sterne mit prozentualer Teil-Füllung (nicht nur ganz hell/dunkel) — zeigt genau, wie
  // nah jemand an der nächsten Stufe dran ist. Modell: 0-50% füllt Stern 1 stufenlos, 50-90% füllt
  // Stern 2 stufenlos (Stern 1 bereits voll), 90-100% füllt Stern 3 stufenlos (1+2 bereits voll) —
  // bei genau 100% sind alle drei komplett voll.
  const STAR_SVG_PATH = "M12 2 L15 9 L22 9 L16.5 13.5 L18.5 21 L12 17 L5.5 21 L7.5 13.5 L2 9 L9 9 Z";
  function svgStar(fillPercent, size) {
    const clamped = Math.max(0, Math.min(100, fillPercent));
    const uid = `star${Math.random().toString(36).slice(2, 9)}`;
    // Füllung von UNTEN nach OBEN (wie eine Flüssigkeit, die ins Glas gegossen wird), nicht
    // seitlich — die Höhe des sichtbaren Ausschnitts wächst mit der Prozentzahl, verankert am
    // unteren Rand.
    const filledHeight = 24 * clamped / 100;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="overflow:visible;">
      <defs><clipPath id="${uid}"><rect x="0" y="${24 - filledHeight}" width="24" height="${filledHeight}" /></clipPath></defs>
      <path d="${STAR_SVG_PATH}" fill="rgba(0,0,0,0.15)" />
      <path d="${STAR_SVG_PATH}" fill="#f2b84b" clip-path="url(#${uid})" />
    </svg>`;
  }
  function starFillFor(percent, starIndex) {
    // starIndex: 1, 2 oder 3 — wie weit DIESER Stern gefüllt sein soll, gegeben das Gesamtergebnis
    if (starIndex === 1) return percent >= 50 ? 100 : Math.round((percent / 50) * 100);
    if (starIndex === 2) return percent < 50 ? 0 : percent >= 90 ? 100 : Math.round(((percent - 50) / 40) * 100);
    return percent < 90 ? 0 : Math.round(((percent - 90) / 10) * 100);
  }
  function starRatingArcHtml(percent) {
    // WICHTIG: die visuelle Reihenfolge (links → Mitte → rechts) muss der Füllreihenfolge
    // entsprechen (1. → 2. → 3. Stern) — sonst wirkt es verwirrend, wenn der optisch mittlere,
    // große Stern eigentlich der DRITTE (letzte) ist, während der rechte kleine Stern schon der
    // zweite war. Jetzt: klein (1., links) → groß (2., Mitte) → klein (3., rechts) — genau in
    // Lesereihenfolge, wie man es aus anderen Bewertungs-Apps kennt (immer links nach rechts).
    return `<div class="results-star-arc">
      <span class="results-star">${svgStar(starFillFor(percent, 1), 34)}</span>
      <span class="results-star results-star-lift">${svgStar(starFillFor(percent, 2), 52)}</span>
      <span class="results-star">${svgStar(starFillFor(percent, 3), 34)}</span>
    </div>`;
  }
  function renderResults() {
    playEl.style.display = "none";
    resultsEl.style.display = "";
    const r = Quiz.computeResults();

    if (r.basePercent >= 70) Core.sound.fanfare();
    else if (r.basePercent >= 40) Core.sound.okay();
    else Core.sound.fail();

    saveResultAndCheck({
      categories: r.categories,
      points: r.totalBase,
      bonus: r.totalBonus,
      percent: r.combinedPercent,
      character: r.character.name,
      badges: r.badges.map((b) => b.name),
      playedAt: r.playedAt,
    });

    // Automatische Zusammenfassung ins private Postfach — welche Wörter/Sätze gespielt wurden,
    // richtig/falsch, und (wenn vorhanden) eine kurze Erklärung zur Bedeutung.
    if (Backend.currentUser() && r.answers && r.answers.length) {
      const catTitles = [...new Set(r.answers.map((a) => a.categoryId))]
        .map((id) => ExerciseData.getCategory(id)?.title || id).join(", ");
      const lines = r.answers.slice(0, 20).map((a) => {
        const wordMatch = a.prompt.match(/___\s*([A-ZÄÖÜ][a-zäöüß]+)|([A-ZÄÖÜ][a-zäöüß]+)\s*___/);
        const word = wordMatch ? (wordMatch[1] || wordMatch[2]) : null;
        const meaning = word && ExerciseData.WORD_MEANINGS && ExerciseData.WORD_MEANINGS[word] ? ` — ${ExerciseData.WORD_MEANINGS[word]}` : "";
        const mark = a.base > 0 ? "✅" : "❌";
        return `${mark} ${a.prompt} → ${a.correctText}${meaning}`;
      }).join("\n");
      const summary = `📊 Du hast gerade „${catTitles}" gespielt — Ergebnis: ${r.combinedPercent}%.\n\n${lines}${r.answers.length > 20 ? `\n… und ${r.answers.length - 20} weitere.` : ""}`;
      Backend.sendSystemMessage(Backend.currentUser().id, summary);
    }

    const trophyLabel = `${r.character.name} – ${r.tier.replace("Deutsch-", "")}`;
    const newTrophy = Backend.addTrophy(trophyLabel);
    const profileForActivity = Backend.currentProfile();
    if (profileForActivity) {
      if (newTrophy) {
        Backend.addActivity(`${profileForActivity.name} hat den Pokal „${trophyLabel}" geholt! 🏆`);
      } else if (r.basePercent >= 70) {
        Backend.addActivity(`${profileForActivity.name} hat gerade ${r.basePercent}% als ${r.character.name} geschafft. ✨`);
      }
      updateTicker();
    }

    let challengeNote = "";
    if (r.meta && r.meta.challengeId) {
      Backend.submitChallengeResult(r.meta.challengeId, { percent: r.combinedPercent });
      challengeNote = `<div class="demo-banner" style="margin-bottom:16px;">🎮 Duell-Ergebnis eingetragen! Schau bei „Freunde", ob dein Gegner schon fertig ist.</div>`;
    }

    const breakdown = Object.entries(r.byCategory).map(([id, s]) => {
      const cat = ExerciseData.getCategory(id);
      const pct = Math.round((s.correct / s.total) * 100);
      return `<div class="breakdown-row">
        <span>${cat.icon} ${cat.title}</span>
        <div class="breakdown-bar-wrap"><div class="breakdown-bar" style="width:${pct}%"></div></div>
        <span>${s.correct}/${s.total}</span>
      </div>`;
    }).join("");

    resultsEl.innerHTML = `
      ${challengeNote}
      ${newTrophy ? `<div class="demo-banner">🏆 Neue Trophäe freigeschaltet: „${trophyLabel}"! Zu sehen in deiner Profil-Vitrine.</div>` : ""}
      <div class="question-card results-hero">
        ${starRatingArcHtml(r.basePercent)}
        <div class="results-points-line">
          <span class="results-points-big">+${r.totalBase}</span> <span class="empty-note">Punkte</span>
          ${r.totalBonus ? `<span class="results-bonus-chip">+${r.totalBonus} Bonus</span>` : ""}
        </div>
        <div class="results-percent">${r.basePercent}%${r.bonusPercent ? ` <span class="results-bonus">(+${r.bonusPercent} Bonus)</span>` : ""}</div>
        <div class="results-tier">${r.tier}</div>

        <div class="character-card">
          <div class="character-emoji">${r.character.emoji}</div>
          <h3>${r.character.name}</h3>
          <p class="empty-note">${r.character.desc}</p>
          <div class="badge-row">
            ${r.badges.map((b) => `<div class="badge-chip"><span class="emoji">${b.emoji}</span><span>${b.name}</span></div>`).join("")}
          </div>
        </div>

        <div class="breakdown-list">${breakdown}</div>

        <div class="quiz-actions" style="justify-content:center; margin-top:24px;">
          <button type="button" class="btn btn-ghost" id="againBtn">Neue Runde wählen</button>
        </div>
      </div>
    `;
    document.getElementById("againBtn").addEventListener("click", () => {
      Quiz.reset();
      renderSetup();
    });
  }

  renderSetup();

  /* ============================================================
     VOKABELTRAINER
     ============================================================ */
  const vocabArea = document.getElementById("vocabArea");
  function renderVocab(filter = "") {
    const list = VocabData.WORDS.filter((w) => w.word.toLowerCase().includes(filter.toLowerCase()) || w.en.toLowerCase().includes(filter.toLowerCase()));
    vocabArea.innerHTML = `
      <div class="vocab-toolbar"><input type="text" class="vocab-search" id="vocabSearch" placeholder="Wort suchen…" value="${filter}" /></div>
      <div class="vocab-grid">
        ${list.map((w) => `
          <div class="vocab-card">
            <div>
              <div class="vocab-word">${w.word}</div>
              ${isStressModeOn() ? `<div class="vocab-syl">${Core.formatStress(w.syl)}</div>` : ""}
              <div class="vocab-en">${w.de || w.en}</div>
              <div class="vocab-example">„${w.example}"</div>
            </div>
            <button type="button" class="speak-btn" data-word="${w.word.replace(/"/g, "&quot;")}" aria-label="Aussprache anhören">🔊</button>
          </div>`).join("")}
      </div>
      ${list.length === 0 ? '<p class="empty-note">Keine Treffer.</p>' : ""}
    `;
    document.getElementById("vocabSearch").addEventListener("input", (e) => renderVocab(e.target.value));
    vocabArea.querySelectorAll(".speak-btn").forEach((btn) => btn.addEventListener("click", () => Core.speak(btn.dataset.word)));
  }
  renderVocab();

  /* ============================================================
     BETONUNGS-TRAINER — Silbe anklicken statt nur lesen. Nutzt
     ausschließlich handgeprüfte Silbentrennung (VocabData.WORDS +
     ExerciseData.WORD_SYL), nie den groben, sitweiten Algorithmus.
     ============================================================ */
  // Entfernt einen vorangestellten Artikel (der/die/das) aus der Silbentrennung — in den
  // Grunddaten steht er bewusst mit drin (fürs Wörterbuch nützlich), aber im Betonungs-Trainer
  // darf er nicht als eigene Silben-Pille auftauchen, da sich die Betonung nur auf das Wort
  // selbst bezieht, nicht auf den Artikel davor.
  function stripArticleFromSyl(syl) {
    return syl.replace(/^(der|die|das)\s+/, "");
  }
  function stressTrainerWordPool() {
    const pool = [];
    VocabData.WORDS.forEach((w) => { if (w.syl && w.syl.includes("-")) pool.push({ word: w.word, syl: stripArticleFromSyl(w.syl), en: w.en }); });
    Object.entries(ExerciseData.WORD_SYL || {}).forEach(([word, syl]) => {
      if (syl.includes("-")) pool.push({ word, syl: stripArticleFromSyl(syl), en: ExerciseData.WORD_MEANINGS[word] });
    });
    // Typische "Problemwörter" für Deutschlernende werden dreifach ins Los-Topf gelegt, damit sie
    // im Schnitt deutlich häufiger drankommen als der übrige, eher zufällige Wortschatz — genau
    // die Wörter, bei denen sich Üben am meisten lohnt.
    Object.entries(ExerciseData.STRESS_PROBLEM_WORDS || {}).forEach(([word, syl]) => {
      for (let i = 0; i < 3; i++) pool.push({ word, syl: stripArticleFromSyl(syl), en: "" });
    });
    return pool;
  }
  // Schwierigkeitsstufen: LEICHT = zwei Silben, Betonung liegt (wie meistens im Deutschen) auf der
  // ersten Silbe — die "offensichtlichen" Fälle. SCHWER = alles, wo die Betonung NICHT auf der
  // ersten Silbe liegt (z. B. "arbeiten") oder das Wort vier Silben oder mehr hat — genau die
  // Fälle, bei denen man wirklich überlegen muss. MITTEL = alles dazwischen (Standard, wie bisher).
  function stressWordDifficulty(entry) {
    const syllables = entry.syl.split("-");
    const stressIdx = syllables.findIndex((s) => s === s.toUpperCase());
    if (syllables.length === 2 && stressIdx === 0) return "leicht";
    if (stressIdx > 0 || syllables.length >= 4) return "schwer";
    return "mittel";
  }
  function stressTrainerWordPoolForDifficulty(difficulty) {
    const pool = stressTrainerWordPool();
    if (difficulty === "alle") return pool;
    return pool.filter((e) => stressWordDifficulty(e) === difficulty);
  }
  // Kurze, pädagogisch begründete Erklärung, WARUM die Betonung so liegt — nur bei Mustern, die
  // ich wirklich sicher weiß (unbetonte Vorsilben, bekannte Fremdwort-Endungen), sonst schlicht
  // "typisches deutsches Muster" statt einer erfundenen Begründung.
  function explainStress(word, syl) {
    const lower = word.toLowerCase();
    const prefixes = { "be": "be-", "ge": "ge-", "er": "er-", "ver": "ver-", "zer": "zer-", "ent": "ent-", "emp": "emp-", "miss": "miss-" };
    for (const [p, label] of Object.entries(prefixes)) {
      if (lower.startsWith(p) && syl.split("-")[0].toLowerCase() === p) {
        return `Die Vorsilbe „${label}" wird im Deutschen nie betont — die Betonung springt auf die Silbe danach.`;
      }
    }
    const suffixes = { tion: "-tion", tät: "-tät", ieren: "-ieren", ismus: "-ismus" };
    for (const [suf, label] of Object.entries(suffixes)) {
      if (lower.endsWith(suf)) return `Wörter mit der Endung „${label}" (meist aus dem Lateinischen/Französischen) werden auf dieser Endung betont.`;
    }
    if (syl.split("-")[0] === syl.split("-")[0].toUpperCase()) {
      return "Typisches deutsches Muster: Die erste (Stamm-)Silbe trägt die Betonung.";
    }
    return "Bei diesem Wort (oft ein Lehnwort) liegt die Betonung nicht auf der ersten Silbe — das kommt bei Fremdwörtern öfter vor.";
  }
  let stTrainerSession = null;
  let stTrainerWord = null;
  let stTrainerDifficulty = "mittel"; // "leicht" | "mittel" | "schwer" | "alle"
  function newStressTrainerSession() {
    stTrainerSession = { round: 0, total: 10, correct: 0, usedWords: new Set() };
  }
  function pickStressTrainerWord() {
    let pool = stressTrainerWordPoolForDifficulty(stTrainerDifficulty);
    if (pool.length < 5) pool = stressTrainerWordPool(); // Sicherheitsnetz, falls eine Stufe zu wenige Wörter hat
    // Innerhalb einer Runde (10 Wörter) soll sich kein Wort wiederholen — bei nur 3-facher
    // Gewichtung der Problemwörter konnte es vorher durch Zufall leicht zu Dopplungen kommen.
    const usedWords = (stTrainerSession && stTrainerSession.usedWords) || new Set();
    let available = pool.filter((e) => !usedWords.has(e.word));
    if (available.length === 0) { usedWords.clear(); available = pool; } // Pool erschöpft -> zurücksetzen
    const entry = available[Math.floor(Math.random() * available.length)];
    usedWords.add(entry.word);
    const syllables = entry.syl.split("-");
    const correctIdx = syllables.findIndex((s) => s === s.toUpperCase());
    stTrainerWord = { ...entry, syllables, correctIdx };
  }
  function renderStressTrainerResults() {
    const area = document.getElementById("stressTrainerArea");
    const percent = Math.round((stTrainerSession.correct / stTrainerSession.total) * 100);
    // Rang-Titel, passend zum Betonungs-Trainer — "Sprachtalent" als anerkennender Titel für eine
    // richtig starke Runde, ähnlich wie "Superhirn" beim Memory oder die Ränge bei den Übungen.
    const tier = percent >= 90 ? "🌟 Sprachtalent" : percent >= 70 ? "🎯 Betonungs-Profi" : percent >= 50 ? "👂 Gutes Gehör" : "🌱 Übungssache";
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p class="eyebrow">🎯 BETONUNGS-TRAINER — RUNDE FERTIG</p>
        <h2 style="margin:8px 0;">${stTrainerSession.correct} / ${stTrainerSession.total} richtig (${percent}%)</h2>
        ${starRatingArcHtml(percent)}
        <p style="font-weight:800; font-size:1.1rem; color:var(--amber-400); margin:4px 0 0;">${tier}</p>
        <button type="button" class="btn btn-coffee" id="stPlayAgainBtn" style="margin-top:14px;">🔄 Neue Runde</button>
      </div>
    `;
    if (Backend.currentUser() && percent >= 90) {
      Backend.addTrophy(`Betonungs-Trainer – Sprachtalent`);
    }
    if (activeGameChallengeId) { Backend.submitChallengeResult(activeGameChallengeId, { percent }); activeGameChallengeId = null; }
    document.getElementById("stPlayAgainBtn").addEventListener("click", () => {
      newStressTrainerSession(); pickStressTrainerWord(); renderStressTrainer();
    });
  }
  function renderStressTrainer() {
    const area = document.getElementById("stressTrainerArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "betonungstrainer_aktiv", "Betonungs-Trainer", "🎯", true)) return;
    if (!stTrainerSession) newStressTrainerSession();
    if (!stTrainerWord) pickStressTrainerWord();
    if (stTrainerSession.round >= stTrainerSession.total) { renderStressTrainerResults(); return; }
    const w = stTrainerWord;
    area.innerHTML = `
      <div class="question-card">
        <p class="eyebrow">🎯 BETONUNGS-TRAINER · RUNDE ${stTrainerSession.round + 1} / ${stTrainerSession.total} <span class="subnav-info-icon" data-info="Ein paar zuverlässige Faustregeln zur deutschen Wortbetonung: Verben auf „-ieren&quot; werden IMMER auf dem „ie&quot; betont (stu-DIE-ren, te-le-fo-NIE-ren). Die Vorsilben be-, ge-, ver-, ent-, er-, zer-, emp- sind NIE betont — die Betonung liegt auf der Silbe danach (be-KOM-men, ver-STE-hen). Trennbare Vorsilben wie auf-, an-, aus-, ein-, mit-, vor-, zu- werden dagegen SELBST betont (AUF-stehen, MIT-nehmen). Bei den meisten anderen deutschen Wörtern liegt die Betonung auf der ersten Silbe des Wortstamms — Fremdwörter folgen oft ihrem eigenen, aus der Ursprungssprache übernommenen Muster.">ⓘ</span></p>
        <div id="stChallengeBar"></div>
        <div class="trophy-case" style="margin-bottom:10px;">
          ${[["leicht", "🟢 Leicht"], ["mittel", "🟡 Mittel"], ["schwer", "🔴 Schwer"]].map(([key, label]) => `<button type="button" class="trophy-chip st-diff-btn ${stTrainerDifficulty === key ? "selected" : ""}" data-diff="${key}">${label}</button>`).join("")}
        </div>
        <p class="empty-note" style="margin-bottom:12px;">Welche Silbe wird bei diesem Wort betont? Antippen zum Wählen.</p>
        <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap; margin:16px 0;">
          ${w.syllables.map((s, i) => `<button type="button" class="btn btn-ghost st-syl-btn" data-syl-idx="${i}" style="font-size:1.2rem; font-weight:800; text-transform:lowercase;">${s.toLowerCase()}</button>`).join("")}
        </div>
        <p class="empty-note" id="stFeedback" style="text-align:center;"></p>
      </div>
    `;
    renderMiniChallengeBarCached("betonungstrainer", "betonungstrainer", "stChallengeBar", area, renderStressTrainer);
    area.querySelectorAll(".st-diff-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.diff === stTrainerDifficulty) return;
        stTrainerDifficulty = btn.dataset.diff;
        newStressTrainerSession();
        pickStressTrainerWord();
        renderStressTrainer();
      });
    });
    area.querySelectorAll(".st-syl-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.sylIdx);
        area.querySelectorAll(".st-syl-btn").forEach((b) => { b.disabled = true; });
        const fb = document.getElementById("stFeedback");
        const correct = idx === w.correctIdx;
        stTrainerSession.round += 1;
        if (correct) {
          stTrainerSession.correct += 1;
          btn.style.background = "#4FA88E"; btn.style.color = "#fff";
          Core.sound.fanfare();
        } else {
          btn.style.background = "#E85F6F"; btn.style.color = "#fff";
          area.querySelectorAll(".st-syl-btn")[w.correctIdx].style.background = "#4FA88E";
          area.querySelectorAll(".st-syl-btn")[w.correctIdx].style.color = "#fff";
          Core.sound.wrong();
        }
        fb.innerHTML = `<strong>${w.word}</strong> wird auf <strong>„${w.syllables[w.correctIdx].toLowerCase()}"</strong> betont.<br>${explainStress(w.word, w.syl)}`;
        // Das Wort wird IMMER nochmal per Sprachausgabe vorgelesen — egal ob richtig oder
        // falsch geantwortet wurde, damit man die richtige Aussprache in jedem Fall hört und
        // daraus lernt. Nur eine kurze Verzögerung (nicht 500ms+), da manche Geräte (v. a. iOS)
        // Sprachausgabe nach zu langer Verzögerung nicht mehr als direkte Reaktion auf den
        // Tastendruck werten und sie dann stillschweigend unterdrücken.
        setTimeout(() => Core.speak(w.word), 150);
        setTimeout(() => {
          if (stTrainerSession.round >= stTrainerSession.total) {
            saveResultAndCheck({
              categories: ["betonungstrainer"], points: stTrainerSession.correct, bonus: 0,
              percent: Math.round((stTrainerSession.correct / stTrainerSession.total) * 100),
              character: "Betonungs-Profi", badges: [], playedAt: new Date().toISOString(),
            });
          } else {
            pickStressTrainerWord();
          }
          renderStressTrainer();
        }, 2200);
      });
    });
  }
  document.querySelector('#learnSubnav [data-sub="sub-stresstrainer"]')?.addEventListener("click", () => {
    newStressTrainerSession();
    pickStressTrainerWord();
    renderStressTrainer();
  });

  /* ============================================================
     WÖRTERBUCH — alle geprüften Vokabeln der Seite an einem Ort,
     durchsuchbar, mit Betonung und Bedeutung.
     ============================================================ */
  // Regelbasierte Betonung für Wörter ohne handgeprüfte Silbentrennung (aus allen
  // Übungskategorien gesammelt) — nutzt dieselben Regeln wie der sitweite Algorithmus,
  // klar getrennt vom handgeprüften Kernwortschatz.
  function ruleSylString(word) {
    const syllables = ruleSyllabify(word);
    if (syllables.length <= 1) return word;
    const idx = ruleStressIndex(word, syllables);
    return syllables.map((s, i) => (i === idx ? s.toUpperCase() : s.toLowerCase())).join("-");
  }
  // Sammelt einzelne, in Anführungszeichen genannte Wörter aus ALLEN Übungskategorien
  // (nicht nur Artikel) — so wächst das Wörterbuch mit dem tatsächlichen Inhalt der Seite.
  function extractExtendedVocabulary() {
    const found = new Map();
    ExerciseData.CATEGORIES.forEach((cat) => {
      try {
        const bank = cat.getBank();
        bank.forEach((q) => {
          const text = `${q.prompt || ""} ${q.explain || ""}`;
          const matches = text.match(/„([^„“]{2,30})“/g) || [];
          matches.forEach((m) => {
            const word = m.slice(1, -1).trim();
            if (/^[A-ZÄÖÜa-zäöüß]+$/.test(word) && word.length >= 3) {
              const key = word.toLowerCase();
              if (!found.has(key)) found.set(key, word);
            }
          });
        });
      } catch (e) { /* Kategorien, die nicht kompatibel sind, einfach überspringen */ }
    });
    return [...found.values()];
  }
  // Best-mögliche CEFR-Einstufung (A1–C2) für den handgeprüften Kernwortschatz — eigene
  // Einschätzung nach gängigen Sprachlern-Frequenzlisten, kein offizielles Zertifikat.
  const CEFR_A1_WORDS = new Set(["Tisch", "Lampe", "Fenster", "Stuhl", "Tür", "Auto", "Baum", "Blume", "Haus", "Hund", "Katze", "Apfel", "Banane", "Brot", "Käse", "Milch", "Wasser", "Suppe", "Fleisch", "Zucker", "Butter", "Salz", "Löffel", "Gabel", "Messer", "Teller", "Tasse", "Glas", "Bett", "Uhr", "Bild", "Handy", "Buch", "Stift", "Zug", "Bus", "Park", "Kind", "Mädchen", "Junge", "Frau", "Mann", "Baby", "Familie", "Jahr", "Monat", "Woche", "Sommer", "Sonne", "Wetter", "Regen", "Schnee", "Winter", "Garten", "Berg", "Fluss", "Stadt", "Land", "Wald", "Vogel", "Fisch", "sein", "haben", "gehen", "kommen", "machen", "sagen", "sehen", "essen", "trinken", "schlafen", "wohnen", "arbeiten", "spielen", "ja", "mal"]);
  const CEFR_A2_WORDS = new Set(["Schrank", "Kommode", "Spiegel", "Computer", "Tastatur", "Drucker", "Maus", "Kabel", "Rucksack", "Tasche", "Portemonnaie", "Schlüssel", "Brille", "Zeitung", "Heft", "Bahnhof", "Straße", "Ampel", "Fahrrad", "Flugzeug", "Flughafen", "Brücke", "Rathaus", "Bank", "Museum", "Supermarkt", "Bäckerei", "Krankenhaus", "Arzt", "Lehrer", "Lehrerin", "Wochenende", "Wolke", "Eis", "Wind", "Kälte", "Frühling", "Herbst", "Wiese", "Insel", "Schiff", "Blatt", "können", "müssen", "wollen", "werden", "wissen", "kennen", "verstehen", "bekommen", "denn", "eben", "halt", "eigentlich", "ruhig", "wohl"]);
  function cefrLevelFor(word) {
    if (CEFR_A1_WORDS.has(word)) return "A1";
    if (CEFR_A2_WORDS.has(word)) return "A2";
    // WICHTIG — logische Verknüpfung mit den Themenbereichen: bestimmte Kategorien deuten fürs
    // Deutsche verlässlich auf ein höheres Niveau hin, unabhängig vom einzelnen Wort selbst.
    // Umgangssprache setzt voraus, dass man die "neutrale" Standardform schon kennt, um die
    // informelle Abweichung davon einzuordnen — typischerweise erst ab B2 sinnvoll vermittelbar.
    // Trennbare Verben sind grammatikalisch anspruchsvoller (Wortstellung, Satzklammer) als
    // einfache Verben, daher B1/B2 statt der sonstigen B1-Standardeinstufung.
    const category = WORD_CATEGORIES[word];
    if (category === "Umgangssprache") return "B2";
    if (category === "Getrennte Verben") return "B1";
    // Abstrakte Begriffe (Argumentation, Konsequenz, Vermutung u. Ä.) und lange Fremdwörter mit
    // philosophischem/wissenschaftlichem Klang sind erfahrungsgemäß meist erst ab C1 aktiv nutzbar.
    if (/losigkeit|heit$|ung$|nis$|samkeit/i.test(word) && word.length > 12) return "C1";
    // Fremdwörter/Lehnwörter und abstraktere Begriffe sind erfahrungsgemäß meist B1 oder höher.
    if (/tion|tät|ismus|ieren|Universität|Bibliothek|Restaurant|Appetit|Toilette/i.test(word)) return "B1";
    return "B1"; // vorsichtige Standardeinstufung für alles, was nicht eindeutig A1/A2 ist
  }
  // Themen-Kategorien für den Wörterbuch-Filter — jedem geprüften Wort fest zugeordnet, damit man
  // gezielt z. B. nur "Essen & Trinken" oder "Tiere & Natur" üben kann.
  const WORD_CATEGORIES = {
    "Bett": "Haushalt & Wohnen",
    "Fenster": "Haushalt & Wohnen",
    "Glas": "Haushalt & Wohnen",
    "Kommode": "Haushalt & Wohnen",
    "Kommoden": "Haushalt & Wohnen",
    "Lampe": "Haushalt & Wohnen",
    "Lampen": "Haushalt & Wohnen",
    "Schlüssel": "Haushalt & Wohnen",
    "Schrank": "Haushalt & Wohnen",
    "Spiegel": "Haushalt & Wohnen",
    "Stuhl": "Haushalt & Wohnen",
    "Tisch": "Haushalt & Wohnen",
    "Tür": "Haushalt & Wohnen",
    "Teller": "Haushalt & Wohnen",
    "Tasse": "Haushalt & Wohnen",
    "Tassen": "Haushalt & Wohnen",
    "Löffel": "Haushalt & Wohnen",
    "Messer": "Haushalt & Wohnen",
    "Gabel": "Haushalt & Wohnen",
    "Gabeln": "Haushalt & Wohnen",
    "Kabel": "Haushalt & Wohnen",
    "Uhr": "Haushalt & Wohnen",
    "Bild": "Haushalt & Wohnen",
    "Heft": "Haushalt & Wohnen",
    "Stift": "Haushalt & Wohnen",
    "Tastatur": "Haushalt & Wohnen",
    "Computer": "Haushalt & Wohnen",
    "Drucker": "Haushalt & Wohnen",
    "Haus": "Haushalt & Wohnen",
    "das Haus": "Haushalt & Wohnen",
    "Rathaus": "Haushalt & Wohnen",
    "Rathäuser": "Haushalt & Wohnen",
    "Apfel": "Essen & Trinken",
    "Banane": "Essen & Trinken",
    "Bananen": "Essen & Trinken",
    "Brot": "Essen & Trinken",
    "Butter": "Essen & Trinken",
    "Eis": "Essen & Trinken",
    "Fleisch": "Essen & Trinken",
    "Fisch": "Essen & Trinken",
    "Käse": "Essen & Trinken",
    "Milch": "Essen & Trinken",
    "Salz": "Essen & Trinken",
    "Suppe": "Essen & Trinken",
    "Wasser": "Essen & Trinken",
    "Wein": "Essen & Trinken",
    "Zucker": "Essen & Trinken",
    "Bäckerei": "Essen & Trinken",
    "Hund": "Tiere & Natur",
    "Katze": "Tiere & Natur",
    "Katzen": "Tiere & Natur",
    "Vogel": "Tiere & Natur",
    "Pferd": "Tiere & Natur",
    "Maus": "Tiere & Natur",
    "Baum": "Tiere & Natur",
    "Blume": "Tiere & Natur",
    "Blumen": "Tiere & Natur",
    "Wald": "Tiere & Natur",
    "Wiese": "Tiere & Natur",
    "Wiesen": "Tiere & Natur",
    "Berg": "Tiere & Natur",
    "Fluss": "Tiere & Natur",
    "Insel": "Tiere & Natur",
    "Inseln": "Tiere & Natur",
    "Wolke": "Tiere & Natur",
    "Wolken": "Tiere & Natur",
    "Wind": "Tiere & Natur",
    "Regen": "Tiere & Natur",
    "Schnee": "Tiere & Natur",
    "Sonne": "Tiere & Natur",
    "Wetter": "Tiere & Natur",
    "Frühling": "Tiere & Natur",
    "Sommer": "Tiere & Natur",
    "Herbst": "Tiere & Natur",
    "Winter": "Tiere & Natur",
    "Garten": "Tiere & Natur",
    "Kälte": "Tiere & Natur",
    "Auto": "Verkehr & Reisen",
    "Autos": "Verkehr & Reisen",
    "Ampel": "Verkehr & Reisen",
    "Ampeln": "Verkehr & Reisen",
    "Bahnhof": "Verkehr & Reisen",
    "Bahnhöfe": "Verkehr & Reisen",
    "Brücke": "Verkehr & Reisen",
    "Brücken": "Verkehr & Reisen",
    "Flughafen": "Verkehr & Reisen",
    "Flughäfen": "Verkehr & Reisen",
    "Flugzeug": "Verkehr & Reisen",
    "Flugzeuge": "Verkehr & Reisen",
    "Fahrrad": "Verkehr & Reisen",
    "Fahrräder": "Verkehr & Reisen",
    "Schiff": "Verkehr & Reisen",
    "Straße": "Verkehr & Reisen",
    "Straßen": "Verkehr & Reisen",
    "Zug": "Verkehr & Reisen",
    "Land": "Verkehr & Reisen",
    "Stadt": "Verkehr & Reisen",
    "Rucksack": "Verkehr & Reisen",
    "Rucksäcke": "Verkehr & Reisen",
    "Supermarkt": "Einkaufen & Alltag",
    "Supermärkte": "Einkaufen & Alltag",
    "Tasche": "Einkaufen & Alltag",
    "Taschen": "Einkaufen & Alltag",
    "Portemonnaie": "Einkaufen & Alltag",
    "Handy": "Einkaufen & Alltag",
    "Handys": "Einkaufen & Alltag",
    "Zeitung": "Einkaufen & Alltag",
    "Zeitungen": "Einkaufen & Alltag",
    "Lehrer": "Schule & Arbeit",
    "Lehrerin": "Schule & Arbeit",
    "die Arbeit": "Schule & Arbeit",
    "arbeiten": "Schule & Arbeit",
    "Museum": "Schule & Arbeit",
    "Familie": "Familie & Menschen",
    "Frau": "Familie & Menschen",
    "die Frau": "Familie & Menschen",
    "Mann": "Familie & Menschen",
    "der Mann": "Familie & Menschen",
    "Kind": "Familie & Menschen",
    "das Kind": "Familie & Menschen",
    "Junge": "Familie & Menschen",
    "Jungen": "Familie & Menschen",
    "Mädchen": "Familie & Menschen",
    "Baby": "Familie & Menschen",
    "der Freund": "Familie & Menschen",
    "Arzt": "Familie & Menschen",
    "Krankenhaus": "Familie & Menschen",
    "Krankenhäuser": "Familie & Menschen",
    "Jahr": "Zeit & Kalender",
    "das Jahr": "Zeit & Kalender",
    "Monat": "Zeit & Kalender",
    "Monate": "Zeit & Kalender",
    "Woche": "Zeit & Kalender",
    "Wochen": "Zeit & Kalender",
    "Wochenende": "Zeit & Kalender",
    "der Tag": "Zeit & Kalender",
    "die Zeit": "Zeit & Kalender",
    "Park": "Zeit & Kalender",
    "Babo": "Jugendsprache",
    "Aura": "Jugendsprache",
    "Bock haben (auf)": "Jugendsprache",
    "Digga / Alter": "Jugendsprache",
    "Rizz": "Jugendsprache",
    "Sigma": "Jugendsprache",
    "based": "Jugendsprache",
    "chillen": "Jugendsprache",
    "cringe": "Jugendsprache",
    "flexen": "Jugendsprache",
    "goofy": "Jugendsprache",
    "high-key": "Jugendsprache",
    "krass": "Jugendsprache",
    "krank (positiv gemeint)": "Jugendsprache",
    "läuft bei dir": "Jugendsprache",
    "low-key": "Jugendsprache",
    "mid": "Jugendsprache",
    "sus": "Jugendsprache",
    "NPC": "Jugendsprache",
    "ach so": "Kleine Wörter & Partikeln",
    "auf jeden (Fall)": "Kleine Wörter & Partikeln",
    "denn": "Kleine Wörter & Partikeln",
    "deshalb": "Kleine Wörter & Partikeln",
    "doch": "Kleine Wörter & Partikeln",
    "eben": "Kleine Wörter & Partikeln",
    "eigentlich": "Kleine Wörter & Partikeln",
    "endlich": "Kleine Wörter & Partikeln",
    "gemeinsam": "Kleine Wörter & Partikeln",
    "gemütlich": "Kleine Wörter & Partikeln",
    "halt": "Kleine Wörter & Partikeln",
    "immer": "Kleine Wörter & Partikeln",
    "ja": "Kleine Wörter & Partikeln",
    "mal": "Kleine Wörter & Partikeln",
    "manchmal": "Kleine Wörter & Partikeln",
    "möglich": "Kleine Wörter & Partikeln",
    "natürlich": "Kleine Wörter & Partikeln",
    "plötzlich": "Kleine Wörter & Partikeln",
    "ruhig": "Kleine Wörter & Partikeln",
    "tja": "Kleine Wörter & Partikeln",
    "trotzdem": "Kleine Wörter & Partikeln",
    "unbedingt": "Kleine Wörter & Partikeln",
    "unterwegs": "Kleine Wörter & Partikeln",
    "vielleicht": "Kleine Wörter & Partikeln",
    "wichtig": "Kleine Wörter & Partikeln",
    "wohl": "Kleine Wörter & Partikeln",
    "na ja": "Kleine Wörter & Partikeln",
    "beginnen": "Grundverben",
    "bleiben": "Grundverben",
    "brauchen": "Grundverben",
    "denken": "Grundverben",
    "erzählen": "Grundverben",
    "fahren": "Grundverben",
    "finden": "Grundverben",
    "fühlen": "Grundverben",
    "geben": "Grundverben",
    "gehen": "Grundverben",
    "haben": "Grundverben",
    "helfen": "Grundverben",
    "kaufen": "Grundverben",
    "kommen": "Grundverben",
    "können": "Grundverben",
    "liegen": "Grundverben",
    "machen": "Grundverben",
    "müssen": "Grundverben",
    "nehmen": "Grundverben",
    "sagen": "Grundverben",
    "sehen": "Grundverben",
    "sein": "Grundverben",
    "spielen": "Grundverben",
    "sprechen": "Grundverben",
    "stehen": "Grundverben",
    "verstehen": "Grundverben",
    "werden": "Grundverben",
    "wissen": "Grundverben",
    "wollen": "Grundverben",
    "die Ausrede": "Abstrakte Begriffe",
    "die Erfahrung": "Abstrakte Begriffe",
    "die Frage": "Abstrakte Begriffe",
    "die Gelegenheit": "Abstrakte Begriffe",
    "die Hand": "Abstrakte Begriffe",
    "der Kopf": "Abstrakte Begriffe",
    "besonders": "Kleine Wörter & Partikeln",
    "Brillen": "Einkaufen & Alltag",
    "Brille": "Einkaufen & Alltag",
    "Buch": "Haushalt & Wohnen",
    "Bus": "Verkehr & Reisen",
    "Bank": "Verkehr & Reisen",
    "Blatt": "Tiere & Natur",
    // WICHTIG — zwei neue Themenbereiche wie gewünscht: "Getrennte Verben" (trennbare Verben wie
    // ankommen, abgeben, annehmen — das Präfix trennt sich im Hauptsatz vom Verbstamm und wandert
    // ans Satzende, z. B. "Ich komme um acht an") und "Umgangssprache" (lockere, informelle
    // Alltagswörter). Nur Wörter, die bereits echte, geprüfte Einträge im Wörterbuch haben,
    // werden hier einsortiert — diese Zuordnung fügt keine neuen Vokabeln hinzu, sie kategorisiert
    // nur vorhandene.
    "ankommen": "Getrennte Verben", "annehmen": "Getrennte Verben", "aufstehen": "Getrennte Verben",
    "mitkommen": "Getrennte Verben", "anrufen": "Getrennte Verben", "aufmachen": "Getrennte Verben",
    "anfangen": "Getrennte Verben", "aufhören": "Getrennte Verben", "einladen": "Getrennte Verben",
    "vorbereiten": "Getrennte Verben", "abholen": "Getrennte Verben", "anziehen": "Getrennte Verben",
    "einschlafen": "Getrennte Verben", "fernsehen": "Getrennte Verben", "kennenlernen": "Getrennte Verben",
    "teilnehmen": "Getrennte Verben", "zuhören": "Getrennte Verben", "nachdenken": "Getrennte Verben",
    "vorstellen": "Getrennte Verben", "umziehen": "Getrennte Verben",
    // WICHTIG — wie versprochen: Fortsetzung der Wörterbuch-Prüfung für Wörter aus den
    // Übungseinheiten (extractExtendedVocabulary), die bisher pauschal als "Sonstiges"
    // einsortiert waren. Dieser Batch sind alles bestätigt echte trennbare Verben.
    "abfahren": "Getrennte Verben", "abfallen": "Getrennte Verben", "abgeben": "Getrennte Verben",
    "abnehmen": "Getrennte Verben", "abräumen": "Getrennte Verben", "absagen": "Getrennte Verben",
    "abschließen": "Getrennte Verben", "abwarten": "Getrennte Verben", "anbieten": "Getrennte Verben",
    "anhalten": "Getrennte Verben", "anhören": "Getrennte Verben", "anmachen": "Getrennte Verben",
    "anmelden": "Getrennte Verben", "anpacken": "Getrennte Verben", "anprobieren": "Getrennte Verben",
    "ansehen": "Getrennte Verben", "ansetzen": "Getrennte Verben", "ansprechen": "Getrennte Verben",
    "ansteigen": "Getrennte Verben", "aufgeben": "Getrennte Verben", "aufgehen": "Getrennte Verben",
    "aufnehmen": "Getrennte Verben", "aufpassen": "Getrennte Verben", "aufprallen": "Getrennte Verben",
    "aufräumen": "Getrennte Verben", "aufschreiben": "Getrennte Verben", "aufwachen": "Getrennte Verben",
    "ausdrücken": "Getrennte Verben", "ausgeben": "Getrennte Verben", "ausgehen": "Getrennte Verben",
    "auskommen": "Getrennte Verben", "ausleihen": "Getrennte Verben", "ausmachen": "Getrennte Verben",
    "auspacken": "Getrennte Verben", "ausruhen": "Getrennte Verben", "ausräumen": "Getrennte Verben",
    "ausschalten": "Getrennte Verben", "ausschreiben": "Getrennte Verben", "aussehen": "Getrennte Verben",
    "aussetzen": "Getrennte Verben", "aussteigen": "Getrennte Verben", "ausziehen": "Getrennte Verben",
    "durchführen": "Getrennte Verben", "durchhalten": "Getrennte Verben", "durchziehen": "Getrennte Verben",
    "einchecken": "Getrennte Verben", "einfallen": "Getrennte Verben", "einnehmen": "Getrennte Verben",
    "einpacken": "Getrennte Verben", "einsteigen": "Getrennte Verben", "einziehen": "Getrennte Verben",
    // Zweiter Batch der Fortsetzung: Grundverben, Adjektive/Eigenschaften und Substantive aus
    // demselben Übungsinhalt-Wortschatz, sorgfältig nach Wortart eingeordnet.
    "bauen": "Grundverben", "beantworten": "Grundverben", "beeindrucken": "Grundverben",
    "beenden": "Grundverben", "befinden": "Grundverben", "begegnen": "Grundverben",
    "begreifen": "Grundverben", "begründen": "Grundverben", "begrüßen": "Grundverben",
    "behalten": "Grundverben", "behandeln": "Grundverben", "beibringen": "Grundverben",
    "beleuchten": "Grundverben", "bemerken": "Grundverben", "beobachten": "Grundverben",
    "beruhigen": "Grundverben", "beschäftigen": "Grundverben", "beschließen": "Grundverben",
    "beschreiben": "Grundverben", "beschützen": "Grundverben", "besitzen": "Grundverben",
    "besprechen": "Grundverben", "bestätigen": "Grundverben", "bestehen": "Grundverben",
    "bestellen": "Grundverben", "bestimmen": "Grundverben", "besuchen": "Grundverben",
    "betrachten": "Grundverben", "betreten": "Grundverben", "bewegen": "Grundverben",
    "beweisen": "Grundverben", "bewundern": "Grundverben", "bezahlen": "Grundverben",
    "bezeichnen": "Grundverben", "bieten": "Grundverben", "binden": "Grundverben",
    "bitten": "Grundverben", "blitzen": "Grundverben", "brechen": "Grundverben",
    "brennen": "Grundverben", "buchen": "Grundverben",
    "bedeutend": "Abstrakte Begriffe", "beliebt": "Abstrakte Begriffe", "bequem": "Abstrakte Begriffe",
    "bereit": "Abstrakte Begriffe", "berühmt": "Abstrakte Begriffe", "besetzt": "Abstrakte Begriffe",
    "betrunken": "Abstrakte Begriffe", "billig": "Abstrakte Begriffe", "dankbar": "Abstrakte Begriffe",
    "Berge": "Tiere & Natur", "Bäume": "Tiere & Natur", "Blätter": "Tiere & Natur",
    "Betten": "Haushalt & Wohnen", "Bücher": "Haushalt & Wohnen",
    "Brote": "Essen & Trinken",
    "damals": "Kleine Wörter & Partikeln", "danach": "Kleine Wörter & Partikeln",
    // Dritter Batch: Substantive mit Artikel aus demselben Übungsinhalt-Wortschatz.
    "das Kleid": "Haushalt & Wohnen", "das Licht": "Haushalt & Wohnen", "das Wohnzimmer": "Haushalt & Wohnen",
    "das Zelt": "Haushalt & Wohnen", "das Zimmer": "Haushalt & Wohnen", "der Anzug": "Haushalt & Wohnen",
    "das Kapitel": "Schule & Arbeit", "das Studium": "Schule & Arbeit", "das Programm": "Schule & Arbeit",
    "das Projekt": "Schule & Arbeit", "das Zeugnis": "Schule & Arbeit", "der Arbeitgeber": "Schule & Arbeit",
    "der Arbeitnehmer": "Schule & Arbeit", "der Beruf": "Schule & Arbeit",
    "das Lenkrad": "Verkehr & Reisen", "der Ausflug": "Verkehr & Reisen", "der Bahnhof": "Verkehr & Reisen",
    "der Berufsverkehr": "Verkehr & Reisen",
    "das Steak": "Essen & Trinken", "das Salz": "Essen & Trinken",
    "das Pferd": "Tiere & Natur", "der Baum": "Tiere & Natur", "der Berg": "Tiere & Natur",
    "das Interesse": "Abstrakte Begriffe", "das Mitleid": "Abstrakte Begriffe", "das Schicksal": "Abstrakte Begriffe",
    "das Wunder": "Abstrakte Begriffe", "der Ärger": "Abstrakte Begriffe",
    "das Mitglied": "Familie & Menschen", "der Ausländer": "Familie & Menschen", "der Autor": "Familie & Menschen",
    "der Quatsch": "Umgangssprache", "doof": "Umgangssprache",
    "der Job": "Umgangssprache", "total": "Umgangssprache", "der Kumpel": "Umgangssprache",
    "cool": "Umgangssprache", "der Typ": "Umgangssprache", "echt": "Umgangssprache",
    "kapieren": "Umgangssprache", "abhauen": "Umgangssprache"
  };
  function categoryForWord(word) {
    return WORD_CATEGORIES[word] || "Sonstiges";
  }
  function buildDictionaryEntries() {
    const entries = [];
    VocabData.WORDS.forEach((w) => entries.push({ word: w.word, syl: w.syl, meaning: w.de || w.en, example: w.example, level: cefrLevelFor(w.word), verified: true, category: categoryForWord(w.word) }));
    Object.entries(ExerciseData.WORD_MEANINGS || {}).forEach(([word, meaning]) => {
      entries.push({ word, syl: (ExerciseData.WORD_SYL || {})[word] || word, meaning, example: "", level: cefrLevelFor(word), verified: true, category: categoryForWord(word) });
    });
    const seenSoFar = new Set(entries.map((e) => e.word.toLowerCase()));
    // Wörter, die zwar eine handgeprüfte Betonung in WORD_SYL haben, aber (noch) keine eigene
    // deutsche Erklärung — trotzdem als "geprüft" zählen, da die Betonung selbst stimmt.
    Object.entries(ExerciseData.WORD_SYL || {}).forEach(([word, syl]) => {
      const key = word.toLowerCase();
      if (seenSoFar.has(key)) return;
      seenSoFar.add(key);
      entries.push({ word, syl, meaning: "", example: "", level: cefrLevelFor(word), verified: true, category: categoryForWord(word) });
    });
    const seen = new Set(entries.map((e) => e.word.toLowerCase()));
    // Erweiterter Wortschatz aus allen Übungskategorien — regelbasierte Betonung (nicht
    // handgeprüft), daher ohne CEFR-Einstufung (die würde ich sonst raten müssen).
    extractExtendedVocabulary().forEach((word) => {
      const key = word.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      entries.push({ word, syl: ruleSylString(word), meaning: "", example: "", level: null, verified: false, category: "Sonstiges" });
    });
    return entries.sort((a, b) => a.word.localeCompare(b.word, "de"));
  }
  let dictLevelFilter = "alle";
  let dictCategoryFilter = "alle";
  // ============================================================================
  // ERSTE SCHRITTE — Brücken-Baukasten für absolute Anfänger:innen. Zeigt statt
  // einer festen englischen Übersetzung automatisch die Muttersprache passend zum
  // im Profil hinterlegten Herkunftsland (Backend.currentProfile().origin) — mit
  // Englisch als Rückfall, wenn kein Land gesetzt ist oder keine Übersetzung für
  // die ermittelte Sprache vorliegt.
  const ORIGIN_TO_LANG = {
    "Ägypten": "ar", "Saudi-Arabien": "ar", "Vereinigte Arabische Emirate": "ar", "Irak": "ar",
    "Syrien": "ar", "Jordanien": "ar", "Marokko": "ar", "Tunesien": "ar", "Algerien": "ar", "Libanon": "ar",
    "Palästina": "ar", "Sudan": "ar", "Libyen": "ar", "Jemen": "ar", "Katar": "ar", "Kuwait": "ar", "Bahrain": "ar", "Oman": "ar",
    "Türkei": "tr",
    "Russland": "ru", "Weißrussland": "ru", "Kasachstan": "ru", "Kirgisistan": "ru", "Usbekistan": "ru",
    "Tadschikistan": "ru", "Turkmenistan": "ru", "Aserbaidschan": "ru", "Armenien": "ru", "Georgien": "ru", "Moldau": "ru",
    "Ukraine": "uk",
    "Iran": "fa", "Afghanistan": "fa",
    "Spanien": "es", "Mexiko": "es", "Argentinien": "es", "Kolumbien": "es", "Chile": "es", "Peru": "es", "Venezuela": "es",
    "Ecuador": "es", "Bolivien": "es", "Uruguay": "es", "Paraguay": "es", "Kuba": "es", "Dominikanische Republik": "es",
    "Guatemala": "es", "Honduras": "es", "El Salvador": "es", "Nicaragua": "es", "Costa Rica": "es", "Panama": "es",
    "Frankreich": "fr", "Belgien": "fr", "Schweiz": "fr", "Senegal": "fr", "Elfenbeinküste": "fr", "Kamerun": "fr",
    "Mali": "fr", "Niger": "fr", "Tschad": "fr", "Guinea": "fr", "Haiti": "fr", "Luxemburg": "fr",
    "Polen": "pl",
    "USA": "en", "Vereinigte Staaten": "en", "Großbritannien": "en", "Vereinigtes Königreich": "en",
    "Irland": "en", "Australien": "en", "Neuseeland": "en", "Indien": "en", "Nigeria": "en", "Kanada": "en",
    "Südafrika": "en", "Kenia": "en", "Ghana": "en", "Pakistan": "en", "Philippinen": "en",
  };
  function firstStepsLangFor(profile) {
    const origin = profile?.origin;
    return (origin && ORIGIN_TO_LANG[origin]) || "en";
  }
  function firstStepsTranslate(entry, lang) {
    return entry.translations[lang] || entry.translations.en;
  }
  let firstStepsLangOverride = null; // manuell gewählte Sprache, überschreibt firstStepsLangFor() solange gesetzt
  function renderFirstSteps() {
    const area = document.getElementById("firstStepsArea");
    if (!area) return;
    const profile = Backend.currentProfile();
    const langNames = { en: "Englisch", ar: "Arabisch", tr: "Türkisch", ru: "Russisch", uk: "Ukrainisch", fa: "Persisch/Farsi", es: "Spanisch", fr: "Französisch", pl: "Polnisch" };
    const lang = firstStepsLangOverride || firstStepsLangFor(profile);
    const rtl = lang === "ar" || lang === "fa";
    area.innerHTML = `
      <p class="empty-note" style="margin-bottom:14px;">Ein Baukasten für den allerersten Kontakt mit Deutsch — auch ohne ein einziges bereits bekanntes deutsches Wort. Erst eine kleine Kernliste an Bausteinen lernen, dann selbst Sätze daraus zusammensetzen.</p>
      <div class="question-card" style="margin-bottom:16px;">
        <p class="eyebrow" style="margin-top:0;">🌍 Übersetzung gerade in: ${langNames[lang]}${lang === "en" && !profile?.origin && !firstStepsLangOverride ? " (Standard — leg dein Herkunftsland im Profil fest, oder wähl unten manuell)" : ""}</p>
        <select id="firstStepsLangSelect" class="challenge-select" style="margin-top:6px;">
          <option value="">Automatisch (aus Herkunftsland)</option>
          ${Object.entries(langNames).map(([code, name]) => `<option value="${code}" ${firstStepsLangOverride === code ? "selected" : ""}>${name}</option>`).join("")}
        </select>
      </div>

      <p class="eyebrow">1. Bausteine lernen</p>
      <div class="breakdown-list" style="margin-bottom:20px;">
        ${ExerciseData.FIRST_STEPS_VOCAB.map((v) => `
          <div class="breakdown-row">
            <span style="font-weight:700;">${v.de}</span>
            <span dir="${rtl ? "rtl" : "ltr"}">${firstStepsTranslate(v, lang)}</span>
          </div>`).join("")}
      </div>

      <p class="eyebrow">2. Sätze aus den Bausteinen zusammensetzen</p>
      <div class="breakdown-list" style="margin-bottom:20px;">
        ${ExerciseData.FIRST_STEPS_SENTENCES.map((s) => `
          <div class="question-card" style="margin-bottom:8px;">
            <p style="font-weight:700; margin:0 0 4px;">${s.de}</p>
            <p class="empty-note" style="margin:0;" dir="${rtl ? "rtl" : "ltr"}">${firstStepsTranslate(s, lang)}</p>
          </div>`).join("")}
      </div>

      <p class="eyebrow">3. Building Bridges 🌉 — das Kern-Werkzeug</p>
      <div class="question-card" style="margin-bottom:16px;">
        <p class="empty-note" style="margin:0;">Der eigentliche Trick: ein <strong>konjugiertes Verb hier</strong> + ... + <strong>ein Infinitiv aus der Liste darunter ans Ende</strong>. Diese feste Reihenfolge sorgt automatisch für eine grammatikalisch richtige Wortstellung — man kann so kaum etwas falsch bauen.</p>
      </div>
      <div class="breakdown-list" style="margin-bottom:16px;">
        ${ExerciseData.FIRST_STEPS_CORE_VERBS.map((verb) => `
          <div class="question-card" style="margin-bottom:8px;">
            <p class="eyebrow" style="margin-top:0;">${verb.meaningDe}</p>
            ${verb.forms.map((f) => `
              <div class="breakdown-row" style="background:transparent; padding:4px 0;">
                <span style="font-weight:700;">${f.de}</span>
                <span dir="${rtl ? "rtl" : "ltr"}">${firstStepsTranslate(f, lang)}</span>
              </div>`).join("")}
          </div>`).join("")}
      </div>

      <p class="eyebrow">4. Infinitive zum Einsetzen (ans Ende anhängen)</p>
      <div class="breakdown-list" style="margin-bottom:20px;">
        ${ExerciseData.FIRST_STEPS_INFINITIVES.map((v) => `
          <div class="breakdown-row">
            <span style="font-weight:700;">${v.de}</span>
            <span dir="${rtl ? "rtl" : "ltr"}">${firstStepsTranslate(v, lang)}</span>
          </div>`).join("")}
      </div>

      <p class="eyebrow">5. So sieht die Kombination in echten Sätzen aus</p>
      <div class="breakdown-list" style="margin-bottom:20px;">
        ${ExerciseData.FIRST_STEPS_COMBOS.map((s) => `
          <div class="question-card" style="margin-bottom:8px;">
            <p style="font-weight:700; margin:0 0 4px;">${s.de}</p>
            <p class="empty-note" style="margin:0;" dir="${rtl ? "rtl" : "ltr"}">${firstStepsTranslate(s, lang)}</p>
          </div>`).join("")}
      </div>

      <p class="eyebrow">Warum wirkt „du" manchmal seltsam?</p>
      <div class="question-card" style="margin-bottom:20px;">
        <p style="margin:0;" dir="${rtl ? "rtl" : "ltr"}">${ExerciseData.FIRST_STEPS_CULTURE_NOTES.du_forms[lang] || ExerciseData.FIRST_STEPS_CULTURE_NOTES.du_forms.en}</p>
      </div>
      <p class="eyebrow">Warum wird aus der/die/das im Plural immer „die"?</p>
      <div class="question-card" style="margin-bottom:20px;">
        <p style="margin:0;" dir="${rtl ? "rtl" : "ltr"}">${ExerciseData.FIRST_STEPS_CULTURE_NOTES.plural_article[lang] || ExerciseData.FIRST_STEPS_CULTURE_NOTES.plural_article.en}</p>
      </div>
      <p class="eyebrow">Warum "zerfällt" ein Verb manchmal (z. B. ankommen)?</p>
      <div class="question-card" style="margin-bottom:20px;">
        <p style="margin:0;" dir="${rtl ? "rtl" : "ltr"}">${ExerciseData.FIRST_STEPS_CULTURE_NOTES.separable_verbs[lang] || ExerciseData.FIRST_STEPS_CULTURE_NOTES.separable_verbs.en}</p>
      </div>
      <p class="eyebrow">Warum steht das Verb bei "weil/dass/ob" plötzlich ganz am Ende?</p>
      <div class="question-card" style="margin-bottom:20px;">
        <p style="margin:0;" dir="${rtl ? "rtl" : "ltr"}">${ExerciseData.FIRST_STEPS_CULTURE_NOTES.verb_at_end[lang] || ExerciseData.FIRST_STEPS_CULTURE_NOTES.verb_at_end.en}</p>
      </div>
      <p class="eyebrow">Warum werden so viele Wörter großgeschrieben?</p>
      <div class="question-card">
        <p style="margin:0;" dir="${rtl ? "rtl" : "ltr"}">${ExerciseData.FIRST_STEPS_CULTURE_NOTES.noun_capitalization[lang] || ExerciseData.FIRST_STEPS_CULTURE_NOTES.noun_capitalization.en}</p>
      </div>
    `;
    document.getElementById("firstStepsLangSelect").addEventListener("change", (e) => {
      firstStepsLangOverride = e.target.value || null;
      renderFirstSteps();
    });
  }
  function renderDictionary(filter = "") {
    const area = document.getElementById("dictionaryArea");
    const all = buildDictionaryEntries();
    const verifiedCount = all.filter((e) => e.verified).length;
    const categories = ["alle", ...new Set(all.map((e) => e.category))].sort((a, b) => a === "alle" ? -1 : b === "alle" ? 1 : a.localeCompare(b, "de"));
    let list = all.filter((e) => e.word.toLowerCase().includes(filter.toLowerCase()) || (e.meaning || "").toLowerCase().includes(filter.toLowerCase()));
    if (dictLevelFilter !== "alle") {
      list = dictLevelFilter === "erweitert" ? list.filter((e) => !e.verified) : list.filter((e) => e.level === dictLevelFilter);
    }
    if (dictCategoryFilter !== "alle") {
      list = list.filter((e) => e.category === dictCategoryFilter);
    }
    area.innerHTML = `
      <p class="empty-note" style="margin-bottom:10px;">Alle Vokabeln der Seite an einem Ort (${all.length} Einträge, davon ${verifiedCount} mit handgeprüfter Betonung) — mit Betonung und Bedeutung.</p>
      <div class="vocab-toolbar"><input type="text" class="vocab-search" id="dictSearch" placeholder="Wort oder Bedeutung suchen…" value="${filter}" /></div>
      <div class="trophy-case" style="margin:10px 0;">
        ${["alle", "A1", "A2", "B1", "B2", "C1", "C2", "erweitert"].map((lvl) => `<button type="button" class="trophy-chip dict-level-btn ${dictLevelFilter === lvl ? "selected" : ""}" data-level="${lvl}">${lvl === "alle" ? "Alle" : lvl === "erweitert" ? "Erweitert (ungeprüft)" : lvl}</button>`).join("")}
      </div>
      <label class="empty-note" style="display:block; margin-bottom:4px;">Themenbereich</label>
      <select id="dictCategorySelect" class="challenge-select" style="margin-bottom:12px;">
        ${categories.map((c) => `<option value="${c}" ${dictCategoryFilter === c ? "selected" : ""}>${c === "alle" ? "Alle Themen" : c}</option>`).join("")}
      </select>
      <div class="vocab-grid">
        ${list.map((e) => `
          <div class="vocab-card">
            <div>
              <div class="vocab-word">${e.word}${e.level ? ` <span class="empty-note" style="font-size:0.7rem;">${e.level}</span>` : ""}</div>
              <div class="vocab-syl">${Core.formatStress(e.syl)}</div>
              <div class="vocab-en">${e.meaning || (e.verified ? "" : "aus dem Übungsinhalt — Bedeutung nicht hinterlegt")}</div>
              ${e.example ? `<div class="vocab-example">„${e.example}"</div>` : ""}
            </div>
            <button type="button" class="speak-btn" data-word="${e.word.replace(/"/g, "&quot;")}" aria-label="Aussprache anhören">🔊</button>
          </div>`).join("")}
      </div>
      ${list.length === 0 ? '<p class="empty-note">Keine Treffer.</p>' : ""}
    `;
    document.getElementById("dictSearch").addEventListener("input", (e) => renderDictionary(e.target.value));
    area.querySelectorAll(".dict-level-btn").forEach((btn) => {
      btn.addEventListener("click", () => { dictLevelFilter = btn.dataset.level; renderDictionary(filter); });
    });
    document.getElementById("dictCategorySelect").addEventListener("change", (e) => {
      dictCategoryFilter = e.target.value;
      renderDictionary(filter);
    });
    area.querySelectorAll(".speak-btn").forEach((btn) => btn.addEventListener("click", () => Core.speak(btn.dataset.word)));
  }
  document.querySelector('#learnSubnav [data-sub="sub-erste-schritte"]')?.addEventListener("click", () => renderFirstSteps());
  document.querySelector('#learnSubnav [data-sub="sub-dictionary"]')?.addEventListener("click", () => renderDictionary());

  /* ============================================================
     MEMORY
     ============================================================ */
  const memoryArea = document.getElementById("memoryArea");
  let memoryState = null;
  const MEMORY_PAIR_COUNT = 6; // fest — 12 Karten passen ohne Scrollen aufs Handy
  let memoryGameId = "synonyme";
  let memoryDifficulty = "mittel"; // 'leicht' (Orientierungshilfe) · 'mittel' (normal) · 'schwer' (mischt neu)
  let memoryChallengeFriendId = "";
  let selectedMemoryFriendIds = new Set();
  let memoryChallengeExpanded = false;
  let memoryChallengeSearch = "";
  let activeMemoryChallengeId = null;
  let activeMemoryOpponentName = "";
  // Generische Variante für alle anderen Spiele (Wort-Kanone, Wortblasen, Wackelturm, usw.), die
  // über eine Herausforderung gestartet werden — behebt einen echten Bug: bisher wurde beim
  // Annehmen einer Herausforderung NIRGENDS außer bei den normalen Übungen und Memory tatsächlich
  // Backend.submitChallengeResult() aufgerufen. Die Herausforderung blieb dadurch für immer als
  // "eingehend" markiert, egal ob das Spiel gespielt wurde — die blinkende Erinnerung verschwand
  // nie, und der/die Herausforderer:in sah nie ein Ergebnis. Wird beim Annehmen gesetzt (siehe
  // gameRouting) und beim jeweiligen Spielende ausgewertet.
  let activeGameChallengeId = null;

  async function newMemoryGame() {
    const game = ExerciseData.MEMORY_GAMES.find((g) => g.id === memoryGameId);
    const pairs = Core.drawUnique(game.getPairs(), MEMORY_PAIR_COUNT);
    let cards = [];
    pairs.forEach((p, i) => {
      cards.push({ id: `${i}-a`, pairId: i, label: p[0] });
      cards.push({ id: `${i}-b`, pairId: i, label: p[1] });
    });
    cards = Core.shuffle(cards);
    memoryState = { cards, flipped: [], matched: new Set(), lastSeenId: null, moves: 0, wrongFlash: [], finished: false, startedAt: Date.now() };
    await renderMemory();
  }

  // Erspielbare Kartenrückseiten-Designs für Memory — dasselbe Freischalt-Prinzip wie bei den
  // Sammelfiguren, damit sich das Spielen selbst lohnt, nicht nur die Punktzahl.
  const MEMORY_CARD_DESIGNS = [
    { id: "fuchs", name: "Fuchs (Standard)", emoji: "🦊", cls: "", unlock: null },
    { id: "eule", name: "Eule", emoji: "🦉", cls: "mcback-eule", unlock: { type: "points", value: 150 } },
    { id: "baer", name: "Bär", emoji: "🐻", cls: "mcback-baer", unlock: { type: "points", value: 350 } },
    { id: "hase", name: "Hase", emoji: "🐰", cls: "mcback-hase", unlock: { type: "points", value: 600 } },
    { id: "wolf", name: "Wolf", emoji: "🐺", cls: "mcback-wolf", unlock: { type: "trophy", match: "Superheld" } },
  ];
  function getMemoryCardDesign() {
    const profile = Backend.currentProfile();
    return (profile && profile.extraProfileData && profile.extraProfileData.memoryCardDesign) || "fuchs";
  }
  function setMemoryCardDesign(id) {
    Backend.updateExtraProfileField("memoryCardDesign", id);
  }
  async function renderMemory() {
    const profile = Backend.currentProfile();
    const activeDesign = getMemoryCardDesign();
    const designBar = `
      <p class="eyebrow" style="margin-top:2px;">🎴 Kartenrückseite</p>
      <div class="trophy-case" style="margin-bottom:10px;">
        ${MEMORY_CARD_DESIGNS.map((d) => {
          const unlocked = isUnlocked(d.unlock, profile);
          return `<button type="button" class="trophy-chip ${activeDesign === d.id ? "selected" : ""} ${!unlocked ? "trophy-chip-locked" : ""}" data-mcard-design="${d.id}" ${!unlocked ? "disabled" : ""}>${d.emoji} ${d.name}${!unlocked ? ` 🔒 ${d.unlock.type === "points" ? d.unlock.value + "P" : "Pokal"}` : ""}</button>`;
        }).join("")}
      </div>`;
    const gameBar = `
      <div class="category-grid" style="margin-bottom:10px;">
        ${ExerciseData.MEMORY_GAMES.map((g) => `
          <div class="category-card ${g.id === memoryGameId ? "selected" : ""}" data-game="${g.id}" style="padding:10px 14px;">
            <div class="cat-body"><div class="cat-title-row"><span class="cat-icon">${g.icon}</span><span>${g.label}</span></div></div>
          </div>`).join("")}
      </div>`;
    const diffBar = `
      <div class="order-toggle" style="margin-bottom:10px;">
        <button type="button" class="order-pill" data-mdiff="leicht" aria-selected="${memoryDifficulty === "leicht"}">Leicht</button>
        <button type="button" class="order-pill" data-mdiff="mittel" aria-selected="${memoryDifficulty === "mittel"}">Mittel</button>
        <button type="button" class="order-pill" data-mdiff="schwer" aria-selected="${memoryDifficulty === "schwer"}">Schwer</button>
      </div>`;

    const isLoggedIn = Boolean(Backend.currentUser());
    const memFriends = isLoggedIn ? await Backend.getFriends() : [];
    // Aufklappbar statt einer immer sichtbaren, potenziell sehr langen Liste — bei vielen
    // Freunden musste man vorher endlos scrollen, nur um überhaupt zum Spielfeld zu kommen.
    // Standardmäßig eingeklappt, mit Suchfeld zum gezielten Filtern statt Scrollen. Ausgewählte
    // Freunde bleiben als kompakte Chips sichtbar, auch wenn die Liste selbst zu ist.
    const filteredMemFriends = memoryChallengeSearch
      ? memFriends.filter((f) => f.name.toLowerCase().includes(memoryChallengeSearch.toLowerCase()))
      : memFriends;
    const selectedFriendObjs = memFriends.filter((f) => selectedMemoryFriendIds.has(f.id));
    const challengeBar = memFriends.length && !activeMemoryChallengeId ? `
      <div class="setup-bar" style="margin-top:0; margin-bottom:10px; flex-direction:column; align-items:stretch;">
        <button type="button" class="emoji-toggle-link" id="memChallengeToggle" style="text-align:left; font-size:0.82rem; font-weight:700; color:var(--cream-200);">
          🧠 Optional: Freunde herausfordern ${selectedFriendObjs.length ? `(${selectedFriendObjs.length} ausgewählt)` : ""} ${memoryChallengeExpanded ? "▾" : "▸"}
        </button>
        ${selectedFriendObjs.length ? `<div class="challenge-friend-list" style="margin-top:6px;">
          ${selectedFriendObjs.map((f) => `<button type="button" class="challenge-friend-pill selected" data-mem-challenge-friend="${f.id}">${f.name} ✕</button>`).join("")}
        </div>` : ""}
        ${memoryChallengeExpanded ? `
          <input type="text" class="vocab-search" id="memChallengeSearchInput" placeholder="Nach Namen suchen…" value="${memoryChallengeSearch}" style="margin-top:8px;" />
          <div class="challenge-friend-list" style="margin-top:6px; max-height:180px; overflow-y:auto;">
            ${filteredMemFriends.length ? filteredMemFriends.map((f) => `<button type="button" class="challenge-friend-pill ${!f.online ? "offline" : ""} ${selectedMemoryFriendIds.has(f.id) ? "selected" : ""}" data-mem-challenge-friend="${f.id}">${f.online ? '<span class="online-dot"></span>' : ""}${f.name}${!f.online ? ' <span class="empty-note">(offline)</span>' : ""}</button>`).join("") : '<p class="empty-note">Niemanden gefunden.</p>'}
          </div>` : ""}
        ${selectedMemoryFriendIds.size ? `<button type="button" class="btn btn-coffee" id="memStartChallengeBtn" style="margin-top:8px;">🎮 Duell starten (${selectedMemoryFriendIds.size})</button>` : ""}
      </div>` : "";

    memoryArea.innerHTML = `
      ${activeMemoryChallengeId ? `<div class="demo-banner">🎮 Duell gegen ${activeMemoryOpponentName || "deinen Freund"} läuft — dein Ergebnis wird nach dieser Runde verglichen.</div>` : ""}
      ${designBar}
      ${gameBar}
      ${diffBar}
      ${challengeBar}
      <p class="empty-note">Finde die deutschen Wortpaare mit gleicher Bedeutung.${memoryDifficulty === "leicht" ? " Schon gesehene Karten haben einen kleinen Punkt." : ""}${memoryDifficulty === "schwer" ? " Achtung: Nach jedem Fehlversuch mischen sich die Karten neu!" : ""}</p>
      <div class="memory-grid" id="memoryGrid">
        ${memoryState.cards.map((c) => {
          const isOpen = memoryState.flipped.includes(c.id) || memoryState.matched.has(c.pairId);
          const isWrong = memoryState.wrongFlash.includes(c.id);
          const cls = ["memory-card"];
          if (!isOpen) cls.push("hidden-face");
          if (!isOpen) { const d = MEMORY_CARD_DESIGNS.find((x) => x.id === activeDesign); if (d && d.cls) cls.push(d.cls); }
          if (memoryState.matched.has(c.pairId)) cls.push("matched");
          if (isWrong) cls.push("wrong-flash");
          const showHint = memoryDifficulty === "leicht" && !isOpen && memoryState.lastSeenId === c.id;
          const corners = isOpen ? `
            <svg class="corner-flourish tl" viewBox="0 0 20 20"><path d="M2 14 Q2 2 14 2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="2" cy="14" r="1.4" fill="currentColor"/></svg>
            <svg class="corner-flourish tr" viewBox="0 0 20 20"><path d="M6 2 Q18 2 18 14" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="18" cy="14" r="1.4" fill="currentColor"/></svg>
            <svg class="corner-flourish bl" viewBox="0 0 20 20"><path d="M2 6 Q2 18 14 18" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="14" cy="18" r="1.4" fill="currentColor"/></svg>
            <svg class="corner-flourish br" viewBox="0 0 20 20"><path d="M18 6 Q18 18 6 18" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="6" cy="18" r="1.4" fill="currentColor"/></svg>
          ` : "";
          const face = isOpen
            ? `${corners}<span>${c.label}</span>`
            : `<span class="fox-crest">${(MEMORY_CARD_DESIGNS.find((x) => x.id === activeDesign) || {}).emoji || "🦊"}</span>${showHint ? '<span class="seen-dot"></span>' : ""}`;
          return `<button type="button" class="${cls.join(" ")}" data-id="${c.id}" data-pair="${c.pairId}">${face}</button>`;
        }).join("")}
      </div>
      <p class="memory-status">Züge: ${memoryState.moves} · Gefunden: ${memoryState.matched.size} / ${memoryState.cards.length / 2}</p>
      ${memoryState.finished ? `<div class="question-card" style="text-align:center; margin-top:10px;">
        <p style="font-size:2rem; margin:4px 0;">🎉</p>
        <h3 style="margin:4px 0;">Runde geschafft!</h3>
        <p class="empty-note">Alle ${memoryState.cards.length / 2} Paare in <strong>${memoryState.moves}</strong> Zügen gefunden — Zeit: <strong>${memoryState.finishSeconds}s</strong>.</p>
        ${starRatingArcHtml(memoryState.finishScore || 0)}
        <p style="font-weight:700; margin-top:6px;">🧠 ${memoryState.finishTier}</p>
        <button type="button" class="btn btn-coffee" id="memoryPlayAgainBtn" style="margin-top:10px;">🔄 Neue Runde</button>
      </div>` : ""}
      <div class="quiz-actions" style="justify-content:flex-start;"><button type="button" class="btn btn-ghost" id="memoryRestart">🔄 Neu mischen</button></div>
    `;
    document.getElementById("memoryRestart").addEventListener("click", () => { activeMemoryChallengeId = null; activeMemoryOpponentName = ""; newMemoryGame(); });
    document.getElementById("memoryPlayAgainBtn")?.addEventListener("click", () => { activeMemoryChallengeId = null; activeMemoryOpponentName = ""; newMemoryGame(); });
    memoryArea.querySelectorAll(".memory-card").forEach((btn) => {
      btn.addEventListener("click", () => handleMemoryFlip(btn.dataset.id));
    });
    memoryArea.querySelectorAll("[data-mdiff]").forEach((btn) => {
      btn.addEventListener("click", () => {
        memoryDifficulty = btn.dataset.mdiff;
        newMemoryGame();
      });
    });
    memoryArea.querySelectorAll("[data-mcard-design]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setMemoryCardDesign(btn.dataset.mcardDesign);
        renderMemory();
      });
    });
    memoryArea.querySelectorAll("[data-game]").forEach((card) => {
      card.addEventListener("click", () => {
        memoryGameId = card.dataset.game;
        newMemoryGame();
      });
    });
    let memChallengeInProgress = false;
    document.getElementById("memChallengeToggle")?.addEventListener("click", () => {
      memoryChallengeExpanded = !memoryChallengeExpanded;
      renderMemory();
    });
    document.getElementById("memChallengeSearchInput")?.addEventListener("input", (e) => {
      memoryChallengeSearch = e.target.value;
      renderMemory();
    });
    memoryArea.querySelectorAll("[data-mem-challenge-friend]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.memChallengeFriend;
        if (selectedMemoryFriendIds.has(id)) selectedMemoryFriendIds.delete(id);
        else selectedMemoryFriendIds.add(id);
        renderMemory();
      });
    });
    const memStartChallengeBtn = document.getElementById("memStartChallengeBtn");
    if (memStartChallengeBtn) {
      memStartChallengeBtn.addEventListener("click", async () => {
        if (memChallengeInProgress || !selectedMemoryFriendIds.size) return;
        memChallengeInProgress = true;
        try {
          let firstId = null;
          let firstName = "";
          for (const fid of selectedMemoryFriendIds) {
            const cid = await Backend.createChallenge(fid, ["memory"]);
            if (!firstId) {
              firstId = cid;
              firstName = memFriends.find((f) => f.id === fid)?.name || "";
            }
          }
          activeMemoryChallengeId = firstId;
          activeMemoryOpponentName = selectedMemoryFriendIds.size > 1 ? `${firstName} +${selectedMemoryFriendIds.size - 1}` : firstName;
          newMemoryGame();
        } catch (err) {
          alert(err.message || "Duell konnte nicht gestartet werden.");
        } finally {
          memChallengeInProgress = false;
        }
      });
    }
  }

  function handleMemoryFlip(id) {
    if (memoryState.flipped.includes(id)) return;
    if (memoryState.flipped.length === 2) return;
    memoryState.flipped.push(id);
    renderMemory();
    if (memoryState.flipped.length === 2) {
      memoryState.moves += 1;
      const [a, b] = memoryState.flipped;
      const cardA = memoryState.cards.find((c) => c.id === a);
      const cardB = memoryState.cards.find((c) => c.id === b);
      if (cardA.pairId === cardB.pairId) {
        memoryState.matched.add(cardA.pairId);
        memoryState.flipped = [];
        memoryState.lastSeenId = null;
        Core.sound.correct();
        renderMemory();
        if (memoryState.matched.size === memoryState.cards.length / 2) {
          memoryState.finished = true;
          const pairs = memoryState.cards.length / 2;
          const seconds = (Date.now() - memoryState.startedAt) / 1000;
          // Zug- UND Zeit-basierte Wertung: weniger Züge und mehr Tempo = mehr Punkte
          const moveScore = pairs / Math.max(memoryState.moves, pairs);
          const timeScore = Core.clamp(1 - (seconds - pairs * 3) / (pairs * 12), 0.4, 1);
          const score = Math.max(10, Math.round(100 * moveScore * timeScore));
          Core.sound.fanfare();
          saveResultAndCheck({
            categories: ["memory"],
            points: score,
            bonus: 0,
            percent: score,
            character: "Gehirnjogger",
            badges: [],
            playedAt: new Date().toISOString(),
          });
          const memTier = score >= 90 ? "Superhirn" : score >= 70 ? "Scharfsinnig" : score >= 50 ? "Aufmerksam" : "Übungssache";
          Backend.addTrophy(`Gehirnjogger – ${memTier}`);
          // Für die Endauswertung merken — Zeit und Züge sollen sichtbar sein, nicht nur intern
          // in die Punkte einfließen.
          memoryState.finishSeconds = Math.round(seconds);
          memoryState.finishScore = score;
          memoryState.finishTier = memTier;
          if (activeMemoryChallengeId) {
            Backend.submitChallengeResult(activeMemoryChallengeId, { percent: score, moves: memoryState.moves, seconds: Math.round(seconds) });
            activeMemoryChallengeId = null; activeMemoryOpponentName = "";
          }
          renderMemory();
        }
      } else {
        memoryState.wrongFlash = [a, b];
        Core.sound.wrong();
        renderMemory();
        setTimeout(() => {
          memoryState.flipped = [];
          memoryState.wrongFlash = [];
          memoryState.lastSeenId = b; // zuletzt umgedrehte Karte -> leichte Orientierungshilfe
          if (memoryDifficulty === "schwer") {
            // Nur die noch nicht gefundenen Karten neu mischen, Position der gefundenen bleibt
            const openIdx = memoryState.cards.map((c, i) => (memoryState.matched.has(c.pairId) ? null : i)).filter((i) => i !== null);
            const openCards = openIdx.map((i) => memoryState.cards[i]);
            const shuffled = Core.shuffle(openCards);
            openIdx.forEach((i, k) => { memoryState.cards[i] = shuffled[k]; });
          }
          renderMemory();
        }, 700);
      }
    }
  }
  newMemoryGame();

  document.querySelector('#learnSubnav [data-sub="sub-memory"]')?.addEventListener("click", () => {
    activeMemoryChallengeId = null; activeMemoryOpponentName = "";
    memoryChallengeFriendId = "";
    newMemoryGame();
  });

  /* ============================================================
     WORTBAUSTELLE — Wort vervollständigen: einige Buchstaben sind schon
     da, die restlichen tippt man in der richtigen Reihenfolge aus einem
     durcheinandergewürfelten Buchstabenpool an (auf dem Handy zuverlässiger
     als echtes Ziehen). Tempo wird belohnt.
     ============================================================ */
  let wbState = null;
  /* ===== Satzpuzzle: Wortstellung im Satz — Wörter in richtiger Reihenfolge antippen ===== */
  let spSession = null; // { round, total, correct }
  let spIntroShown = false;
  // Verhindert erneute Punktevergabe, nur weil man zu einem anderen Spiel wechselt und
  // zurückkommt, während die Ergebnis-Anzeige schon steht — dasselbe Muster wie bei
  // Wort-Kanone/Wackelturm.
  let spResultsFinalized = false;
  let spCurrentEntry = null; // [chunks, explanation]
  let spShuffled = []; // gemischte Reihenfolge der Bausteine
  let spUsedIdx = []; // welche Indizes (aus spShuffled) schon in der gebauten Reihenfolge stecken
  let spUsedSentences = []; // welche Sätze in DIESER Sitzung schon dran waren — keine Wiederholungen
  let spMistakesThisSession = []; // { correctSentence, explain } — für die Postfach-Zusammenfassung am Ende
  function newSatzpuzzleSession() {
    spSession = { round: 0, total: 10, correct: 0 };
    spUsedSentences = [];
    spMistakesThisSession = [];
    spResultsFinalized = false;
  }
  function newSatzpuzzleRound() {
    let pool = ExerciseData.SATZPUZZLE.filter((e) => !spUsedSentences.includes(e[0].join(" ")));
    if (pool.length === 0) { spUsedSentences = []; pool = ExerciseData.SATZPUZZLE; } // Vorrat aufgebraucht -> neu beginnen
    const entry = pool[Math.floor(Math.random() * pool.length)];
    spUsedSentences.push(entry[0].join(" "));
    spCurrentEntry = entry;
    spShuffled = Core.shuffle(entry[0].map((word, i) => ({ word, correctIdx: i })));
    spUsedIdx = [];
  }
  function renderSatzpuzzleResults() {
    const area = document.getElementById("satzpuzzleArea");
    const percent = spSession.total > 0 ? Math.round((spSession.correct / spSession.total) * 100) : 0;
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p class="eyebrow">🧩 SATZPUZZLE — SITZUNG FERTIG</p>
        <p style="font-size:2rem; margin:8px 0;">🎉</p>
        <h2 style="margin:8px 0;">${spSession.correct} / ${spSession.total} Sätze richtig gebaut!</h2>
        ${starRatingArcHtml(percent)}
        <button type="button" class="btn btn-coffee" id="spPlayAgainBtn" style="margin-top:14px;">🔄 Neue Runden</button>
      </div>`;
    document.getElementById("spPlayAgainBtn").addEventListener("click", () => {
      newSatzpuzzleSession(); newSatzpuzzleRound(); renderSatzpuzzle();
    });
    if (!spResultsFinalized) {
      spResultsFinalized = true;
      if (Backend.currentUser()) {
        saveResultAndCheck({ categories: ["satzpuzzle"], points: spSession.correct, bonus: 0, percent, character: "Satzbaumeister:in", badges: [], playedAt: new Date().toISOString() });
        // WICHTIG — behebt den echten Bug: eine über eine Herausforderung gestartete Runde wurde
        // bisher nie ans Backend zurückgemeldet, siehe activeGameChallengeId (gameRouting).
        if (activeGameChallengeId) { Backend.submitChallengeResult(activeGameChallengeId, { percent }); activeGameChallengeId = null; }
        // Wer während der Runde Fehler gemacht hat, bekommt die richtigen Sätze zusätzlich als
        // Zusammenfassung ins Postfach — die kurze Einblendung im Spiel selbst (2,6s) reicht oft
        // nicht, um sich alles zu merken; so kann man in Ruhe nachlesen, was man beim nächsten
        // Mal besser machen könnte.
        if (spMistakesThisSession.length) {
          const summary = spMistakesThisSession.map((m, i) => `${i + 1}. „${m.correctSentence}“\n${m.explain}`).join("\n\n");
          Backend.sendSystemMessage(Backend.currentUser().id, `🧩 Deine Satzpuzzle-Runde: ${spSession.correct}/${spSession.total} richtig. Hier die korrekten Sätze zu deinen ${spMistakesThisSession.length} ${spMistakesThisSession.length === 1 ? "Fehler" : "Fehlern"}, zum Nachlesen:\n\n${summary}`);
        }
      }
    }
  }
  // Wiederverwendbare Variante für Spiele außerhalb der Haupt-Übungen (Satzpuzzle, Wackelturm,
  // Wort-Typ) — per Ereignis-Delegation, da diese Bereiche sich häufig neu zeichnen und
  // ein einmaliges Verdrahten sonst nach jedem Rundenwechsel verloren ginge.
  function miniBugReportBtnHtml(context) {
    return `<button type="button" class="bug-report-btn" data-mini-bug-context="${context}" title="Fehler melden">🪲</button>`;
  }
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-mini-bug-context]");
    if (!btn) return;
    openBugReportDialog(btn.dataset.miniBugContext);
  });
  function renderSatzpuzzle() {
    const area = document.getElementById("satzpuzzleArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "satzpuzzle_aktiv", "Satzpuzzle", "🧩", true)) return;
    if (!spIntroShown && !hasSeenGameIntro("satzpuzzle")) {
      // "SATZPUZZLE" als Reihe kleiner, bunter Puzzleteile (mit angedeuteten Verbindungsnoppen an
      // den Seiten) statt Emoji + Text — passend zum Zusammensetz-Thema des Spiels.
      const SP_TITLE_LETTERS = ["S", "A", "T", "Z", "P", "U", "Z", "Z", "L", "E"];
      const SP_TITLE_COLORS = ["#E85F6F", "#F2B84B", "#5BA8A0", "#A875D8", "#4A90D9", "#E8825F", "#7FB87A", "#E8D34B", "#B084CC", "#5BA8A0"];
      const pieceW = 36;
      const titleSvg = `<svg viewBox="0 0 ${pieceW * SP_TITLE_LETTERS.length + 10} 56" style="width:100%; max-width:400px; height:auto;">
        ${SP_TITLE_LETTERS.map((letter, i) => {
          const x = 5 + i * pieceW;
          return `<g>
            <rect x="${x}" y="8" width="${pieceW - 4}" height="40" rx="6" fill="${SP_TITLE_COLORS[i]}" stroke="#241505" stroke-width="1.3"/>
            <circle cx="${x + pieceW - 4}" cy="28" r="5" fill="${SP_TITLE_COLORS[i]}" stroke="#241505" stroke-width="1.3"/>
            <text x="${x + (pieceW - 4) / 2}" y="34" text-anchor="middle" font-family="Comic Sans MS, cursive, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF" stroke="#241505" stroke-width="0.5">${letter}</text>
          </g>`;
        }).join("")}
      </svg>`;
      area.innerHTML = `
        <div class="question-card" style="text-align:center;">
          <div style="display:flex; justify-content:center; overflow-x:auto;">${titleSvg}</div>
          <p class="empty-note">Im deutschen Hauptsatz steht das Verb an Position 2. Im Nebensatz (nach weil, dass, ob, wenn, obwohl …) wandert das Verb dagegen ganz ans Ende. Tipp die Bausteine in der richtigen Reihenfolge an, um den Satz zu bauen.</p>
          <button type="button" class="btn btn-coffee" id="spStartIntroBtn" style="margin-top:14px;">▶️ Los geht's</button>
        </div>`;
      document.getElementById("spStartIntroBtn").addEventListener("click", () => { spIntroShown = true; markGameIntroSeen("satzpuzzle"); renderSatzpuzzle(); });
      return;
    }
    if (!spSession) newSatzpuzzleSession();
    if (spSession.round >= spSession.total) { renderSatzpuzzleResults(); return; }
    if (!spCurrentEntry) newSatzpuzzleRound();
    const built = spUsedIdx.map((i) => spShuffled[i].word);
    area.innerHTML = `
      <div class="question-card">
        ${miniBugReportBtnHtml("Satzpuzzle: " + spCurrentEntry[0].join(" "))}
        <p class="eyebrow">🧩 SATZPUZZLE · RUNDE ${spSession.round + 1} / ${spSession.total} <span class="subnav-info-icon" data-info="Im deutschen Hauptsatz steht das Verb an Position 2. Im Nebensatz (nach weil, dass, ob, wenn, obwohl …) wandert das Verb dagegen ganz ans Ende. Genau das übst du hier.">ⓘ</span></p>
        <div id="spChallengeBar"></div>
        <p class="empty-note" style="margin-bottom:10px;">Tipp die Bausteine in der richtigen Reihenfolge an, um den Satz zu bauen. Ein gebautes Wort nochmal antippen macht es (und alles Spätere) rückgängig.</p>
        <div class="sp-built-row" style="min-height:44px; display:flex; flex-wrap:wrap; gap:6px; padding:10px; background:rgba(0,0,0,0.04); border-radius:var(--radius-sm); margin-bottom:14px;">
          ${built.length ? built.map((w, pos) => `<button type="button" class="trophy-chip sp-built-word" data-built-pos="${pos}" title="Antippen zum Rückgängigmachen">${w}</button>`).join("") : '<span class="empty-note">…</span>'}
        </div>
        <div class="sp-choices-row" style="display:flex; flex-wrap:wrap; gap:8px;">
          ${spShuffled.map((chunk, i) => `<button type="button" class="btn btn-ghost sp-choice-btn" data-idx="${i}" ${spUsedIdx.includes(i) ? "disabled style=\"opacity:0.25;\"" : ""}>${chunk.word}</button>`).join("")}
        </div>
        <p class="empty-note" id="spFeedback" style="text-align:center; margin-top:10px;"></p>
      </div>`;
    renderMiniChallengeBarCached("satzpuzzle", "satzpuzzle", "spChallengeBar", area, renderSatzpuzzle);
    document.querySelector(".sp-choices-row").querySelectorAll("[data-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        if (spUsedIdx.includes(idx)) return;
        spUsedIdx.push(idx);
        renderSatzpuzzle();
        if (spUsedIdx.length === spShuffled.length) checkSatzpuzzle();
      });
    });
    // Rückgängig: ein bereits gebautes Wort antippen entfernt dieses UND alle danach gebauten
    // Wörter — man kann also gezielt zu einer früheren Stelle zurück, falls man sich vertippt hat,
    // statt komplett von vorn anfangen zu müssen.
    area.querySelectorAll(".sp-built-word").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pos = Number(btn.dataset.builtPos);
        spUsedIdx = spUsedIdx.slice(0, pos);
        renderSatzpuzzle();
      });
    });
  }
  function checkSatzpuzzle() {
    const fb = document.getElementById("spFeedback");
    const chosenOrder = spUsedIdx.map((chosenIdx) => spShuffled[chosenIdx].correctIdx);
    // Neben der primären, vorgegebenen Reihenfolge können optional weitere, ebenso grammatisch
    // korrekte Anordnungen hinterlegt sein (drittes Array-Element, Liste von Index-Reihenfolgen) —
    // manche deutschen Sätze lassen sich auf mehr als eine richtige Art bauen (z. B. Haupt- und
    // Nebensatz vertauscht), und wer eine davon korrekt konstruiert, soll dafür nicht bestraft
    // werden, nur weil es nicht GENAU die eine im Datensatz hinterlegte Version ist.
    const primaryOrder = spCurrentEntry[0].map((_, i) => i);
    const alternativeOrders = spCurrentEntry[2] || [];
    const allValidOrders = [primaryOrder, ...alternativeOrders];
    const correctOrder = allValidOrders.some((order) => order.every((idx, pos) => idx === chosenOrder[pos]));
    spSession.round += 1;
    if (correctOrder) {
      spSession.correct += 1;
      Core.sound.correct();
      fb.innerHTML = `<strong style="color:#3E9A6E;">✅ Richtig!</strong> ${spCurrentEntry[1]}`;
    } else {
      Core.sound.wrong();
      const correctSentence = spCurrentEntry[0].join(" ");
      fb.innerHTML = `<strong style="color:#E85F6F;">Noch nicht ganz.</strong> Richtig wäre: „${correctSentence}“<br>${spCurrentEntry[1]}`;
      spMistakesThisSession.push({ correctSentence, explain: spCurrentEntry[1] });
    }
    setTimeout(() => { newSatzpuzzleRound(); renderSatzpuzzle(); }, 2600);
  }
  document.querySelector('#learnSubnav [data-sub="sub-satzpuzzle"]')?.addEventListener("click", () => {
    if (!spSession) newSatzpuzzleSession();
    if (!spCurrentEntry) newSatzpuzzleRound();
    renderSatzpuzzle();
  });

  /* ===== Wackelturm: Jenga-Prinzip — Fragen aus ALLEN Kategorien, Turm wird bei Fehlern
     instabiler, bis er nach 3 Fehlern einstürzt. Braucht keine eigenen neuen Fragen — zieht
     einfach zufällig aus allen bereits vorhandenen Übungskategorien. ===== */
  let wtBlocksRemoved = 0;
  let wtMistakes = 0;
  let wtCurrentQuestion = null;
  // Verhindert erneutes Feiern/Punktevergeben, nur weil man zu einem anderen Spiel wechselt und
  // zurückkommt, während der Turm schon geschafft ist — und sorgt dafür, dass danach automatisch
  // wieder ein bereiter, leerer Turm gezeigt wird, statt die letzte Frage/Feier zu wiederholen.
  let wtGameOverFinalized = false;
  let wtReadyForNewRound = false;
  // Startbildschirm mit Spielbeschreibung erscheint nur beim ALLERERSTEN Betreten dieser Sitzung
  // — danach direkt weiterspielen, ohne die Erklärung jedes Mal erneut zu zeigen.
  let wtIntroShown = false;
  let wtUsedPrompts = []; // welche Fragen (Text) in DIESER Sitzung schon dran waren
  const WT_MAX_MISTAKES = 3;
  const WT_TOTAL_BLOCKS = 18;
  function pickRandomWackelturmQuestion() {
    const cats = ExerciseData.CATEGORIES.filter((c) => c.getBank && (!c.unlock || isUnlocked(c.unlock, Backend.currentProfile())));
    // Bis zu 20 Versuche eine noch nicht gestellte Frage zu finden, bevor wir aufgeben und den
    // Vorrat für diese Sitzung zurücksetzen (falls wirklich alle verfügbaren Fragen schon dran waren).
    for (let attempt = 0; attempt < 20; attempt++) {
      const cat = cats[Math.floor(Math.random() * cats.length)];
      const bank = cat.getBank();
      const q = bank[Math.floor(Math.random() * bank.length)];
      if (!wtUsedPrompts.includes(q.prompt)) {
        wtUsedPrompts.push(q.prompt);
        return q;
      }
    }
    wtUsedPrompts = []; // Vorrat aufgebraucht -> neu beginnen
    const cat = cats[Math.floor(Math.random() * cats.length)];
    const bank = cat.getBank();
    return bank[Math.floor(Math.random() * bank.length)];
  }
  function newWackelturmGame() {
    wtBlocksRemoved = 0;
    wtMistakes = 0;
    wtUsedPrompts = [];
    wtGameOverFinalized = false;
    wtReadyForNewRound = false;
    wtCurrentQuestion = pickRandomWackelturmQuestion();
  }
  function renderWackelturm() {
    const area = document.getElementById("wackelturmArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "wackelturm_aktiv", "Wackelturm", "🗼", true)) return;
    // Beim allerersten Betreten dieser Sitzung: kurze Spielbeschreibung mit "Los geht's"-Knopf,
    // statt sofort mitten im Spiel zu landen, ohne zu wissen, worum es geht.
    if (!wtIntroShown && !hasSeenGameIntro("wackelturm")) {
      // Statt Emoji + Text: das Wort "WACKELTURM" als wackelig gestapelte Blöcke — jeder Block
      // trägt einen Buchstaben und ist leicht zufällig seitlich versetzt, wie ein echter,
      // instabiler Turm aus einzelnen Klötzen.
      const WT_TITLE_LETTERS = ["W", "A", "C", "K", "E", "L", "T", "U", "R", "M"];
      const WT_TITLE_COLORS = ["#E85F6F", "#F2B84B", "#5BA8A0", "#A875D8", "#4A90D9", "#E8825F", "#7FB87A", "#E8D34B", "#B084CC", "#5BA8A0"];
      const blockH = 30;
      const blockW = 58;
      const rows = 2;
      const perRow = Math.ceil(WT_TITLE_LETTERS.length / rows);
      const titleSvg = `<svg viewBox="0 0 ${blockW * perRow + 30} ${blockH * rows + 20}" style="width:100%; max-width:340px; height:auto;">
        ${WT_TITLE_LETTERS.map((letter, i) => {
          const row = rows - 1 - Math.floor(i / perRow);
          const colInRow = i % perRow;
          const jitter = ((i * 7) % 11) - 5;
          const x = 15 + colInRow * blockW + jitter;
          const y = 10 + row * blockH;
          return `<g>
            <rect x="${x}" y="${y}" width="${blockW - 6}" height="${blockH - 5}" rx="4" fill="${WT_TITLE_COLORS[i]}" stroke="#241505" stroke-width="1.5"/>
            <text x="${x + (blockW - 6) / 2}" y="${y + (blockH - 5) / 2 + 6}" text-anchor="middle" font-family="Comic Sans MS, cursive, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF" stroke="#241505" stroke-width="0.5">${letter}</text>
          </g>`;
        }).join("")}
      </svg>`;
      area.innerHTML = `
        <div class="question-card" style="text-align:center;">
          <div style="display:flex; justify-content:center;">${titleSvg}</div>
          <p class="empty-note">Wie beim Steckturm-Spiel: jede richtige Antwort entfernt sicher einen Block. Bei jeder falschen Antwort wird der Turm instabiler — nach 3 Fehlern stürzt er ein. Die Fragen kommen zufällig aus allen Übungskategorien, die du schon freigeschaltet hast. Schaffst du alle Blöcke, ohne dass er umfällt?</p>
          <button type="button" class="btn btn-coffee" id="wtStartIntroBtn" style="margin-top:14px;">▶️ Los geht's</button>
        </div>`;
      document.getElementById("wtStartIntroBtn").addEventListener("click", () => { wtIntroShown = true; markGameIntroSeen("wackelturm"); renderWackelturm(); });
      return;
    }
    // Nach einer geschafften Runde zeigt sich (nach kurzer Zeit automatisch) ein bereiter,
    // leerer Turm statt der letzten Frage — genau wie beim allerersten Einstieg, aber OHNE dass
    // dabei schon eine neue Runde/ein neues Spiel gezählt wird. Erst der aktive Klick auf "Neuer
    // Turm" startet wirklich etwas Neues.
    if (wtReadyForNewRound) {
      area.innerHTML = `
        <div class="question-card" style="text-align:center;">
          <p style="font-size:2.5rem;">🗼</p>
          <h2 style="margin:8px 0;">Bereit für einen neuen Turm?</h2>
          <p class="empty-note">Der letzte Turm ist geschafft — starte jederzeit eine neue Runde.</p>
          <button type="button" class="btn btn-coffee" id="wtStartBtn" style="margin-top:14px;">🔄 Neuer Turm</button>
        </div>`;
      document.getElementById("wtStartBtn").addEventListener("click", () => { newWackelturmGame(); renderWackelturm(); });
      return;
    }
    if (!wtCurrentQuestion) newWackelturmGame();
    const tiltDeg = wtMistakes * 5;
    const remainingBlocks = Math.max(1, WT_TOTAL_BLOCKS - wtBlocksRemoved);
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        ${miniBugReportBtnHtml("Wackelturm: " + wtCurrentQuestion.prompt)}
        <p class="eyebrow">🗼 WACKELTURM · ${wtBlocksRemoved} Blöcke sicher entfernt · ${wtMistakes}/${WT_MAX_MISTAKES} Fehler <span class="subnav-info-icon" data-info="Wie beim Steckturm-Spiel: jede richtige Antwort entfernt sicher einen Block. Bei jeder falschen Antwort wird der Turm instabiler — nach 3 Fehlern stürzt er ein. Die Fragen kommen zufällig aus allen Übungskategorien, die du schon freigeschaltet hast.">ⓘ</span></p>
        <div id="wtChallengeBar"></div>
        <div class="wt-tower-wrap">
          <div class="wt-tower" id="wtTower" style="transform: rotate(${tiltDeg}deg);">
            ${Array.from({ length: remainingBlocks }).map((_, i) => `<div class="wt-block" style="background: hsl(${28 + i * 7}, 58%, 56%);"></div>`).join("")}
          </div>
        </div>
        <p style="font-weight:700; margin:10px 0;">${wtCurrentQuestion.prompt.includes("___") ? wtCurrentQuestion.prompt.replace("___", '<span class="blank-slot">___</span>') : wtCurrentQuestion.prompt}</p>
        <div class="quiz-options">
          ${wtCurrentQuestion.options.map((opt, i) => `<button type="button" class="option-btn wt-opt-btn" data-idx="${i}"><span>${capitalizeIfSentenceStart(opt, wtCurrentQuestion.prompt)}</span></button>`).join("")}
        </div>
        <p class="empty-note" id="wtFeedback" style="margin-top:10px; min-height:20px;"></p>
      </div>`;
    renderMiniChallengeBarCached("wackelturm", "wackelturm", "wtChallengeBar", area, renderWackelturm);
    area.querySelectorAll(".wt-opt-btn").forEach((btn) => {
      btn.addEventListener("click", () => checkWackelturm(Number(btn.dataset.idx), btn));
    });
  }
  function checkWackelturm(idx, btn) {
    document.querySelectorAll(".wt-opt-btn").forEach((b) => { b.disabled = true; });
    const correct = wtCurrentQuestion.correct.includes(idx);
    const fb = document.getElementById("wtFeedback");
    const blankSlot = document.querySelector("#wackelturmArea .blank-slot");
    if (blankSlot) blankSlot.textContent = wtCurrentQuestion.options[wtCurrentQuestion.correct[0]];
    if (correct) {
      wtBlocksRemoved += 1;
      Core.sound.correct();
      btn.style.background = "#DFF3E5";
      fb.textContent = "✅ Sicher entfernt!";
    } else {
      wtMistakes += 1;
      Core.sound.wrong();
      btn.style.background = "#FBDCDC";
      fb.textContent = `⚠️ Der Turm wackelt! (${wtMistakes}/${WT_MAX_MISTAKES})`;
      const tower = document.getElementById("wtTower");
      if (tower) tower.style.transform = `rotate(${wtMistakes * 5}deg)`;
    }
    if (wtBlocksRemoved >= WT_TOTAL_BLOCKS) {
      setTimeout(renderWackelturmVictory, 1000);
      return;
    }
    if (wtMistakes >= WT_MAX_MISTAKES) {
      setTimeout(renderWackelturmCollapse, 1000);
      return;
    }
    setTimeout(() => { wtCurrentQuestion = pickRandomWackelturmQuestion(); renderWackelturm(); }, 1300);
  }
  function renderWackelturmVictory() {
    const area = document.getElementById("wackelturmArea");
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p style="font-size:2.5rem;">🏆</p>
        <h2 style="margin:8px 0;">Kompletter Turm geschafft!</h2>
        ${starRatingArcHtml(100)}
        <p class="empty-note">Alle ${WT_TOTAL_BLOCKS} Blöcke sicher entfernt, ohne dass er umgefallen ist — echt stark!</p>
        <button type="button" class="btn btn-coffee" id="wtRetryBtn" style="margin-top:14px;">🔄 Neuer Turm</button>
      </div>`;
    document.getElementById("wtRetryBtn").addEventListener("click", () => { newWackelturmGame(); renderWackelturm(); });
    // Nur beim ERSTEN Anzeigen dieser geschafften Runde Punkte vergeben — nicht erneut, nur weil
    // man zu einem anderen Spiel wechselt und zurückkommt (vorher kam dabei die letzte Frage UND
    // die Feier nochmal, inklusive doppelter Punktevergabe).
    if (!wtGameOverFinalized) {
      wtGameOverFinalized = true;
      if (Backend.currentUser()) {
        saveResultAndCheck({ categories: ["wackelturm"], points: wtBlocksRemoved + 5, bonus: 5, percent: 100, character: "Turmbaumeister:in", badges: [], playedAt: new Date().toISOString() });
        if (activeGameChallengeId) { Backend.submitChallengeResult(activeGameChallengeId, { percent: 100 }); activeGameChallengeId = null; }
      }
    }
    // Nach kurzer Zeit automatisch zum bereiten, leeren Turm wechseln — wie gewünscht, damit man
    // beim Zurückkommen nicht wieder die alte Feier sieht, sondern einen frischen Ausgangspunkt.
    setTimeout(() => { wtReadyForNewRound = true; if (document.getElementById("wackelturmArea")) renderWackelturm(); }, 3200);
  }
  function renderWackelturmCollapse() {
    Core.sound.fail();
    const area = document.getElementById("wackelturmArea");
    // "Genauigkeit" hier: wie viele der 18 Blöcke wurden sicher entfernt, bevor der Turm fiel.
    const accuracy = Math.round((wtBlocksRemoved / WT_TOTAL_BLOCKS) * 100);
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p style="font-size:2.5rem;">💥</p>
        <h2 style="margin:8px 0;">Der Turm ist eingestürzt!</h2>
        ${starRatingArcHtml(accuracy)}
        <p class="empty-note">Du hast <strong>${wtBlocksRemoved}</strong> Blöcke sicher entfernt, bevor er umgefallen ist.</p>
        <button type="button" class="btn btn-coffee" id="wtRetryBtn" style="margin-top:14px;">🔄 Neuer Turm</button>
      </div>`;
    document.getElementById("wtRetryBtn").addEventListener("click", () => { newWackelturmGame(); renderWackelturm(); });
    // Dieselbe Einmal-Absicherung wie bei renderWackelturmVictory() — vorher fehlte sie hier, was
    // beim Zurückkommen von einem anderen Spiel zu erneuter (doppelter) Punktevergabe UND
    // fälschlich erneut gemeldeten "neu freigeschalteten" Füchsen führte, obwohl man sie schon hatte.
    if (!wtGameOverFinalized) {
      wtGameOverFinalized = true;
      if (Backend.currentUser() && wtBlocksRemoved > 0) {
        saveResultAndCheck({ categories: ["wackelturm"], points: wtBlocksRemoved, bonus: 0, percent: 100, character: "Turmbauer:in", badges: [], playedAt: new Date().toISOString() });
      }
      if (activeGameChallengeId) { Backend.submitChallengeResult(activeGameChallengeId, { percent: accuracy }); activeGameChallengeId = null; }
    }
  }
  document.querySelector('#learnSubnav [data-sub="sub-wackelturm"]')?.addEventListener("click", () => {
    if (!wtCurrentQuestion) newWackelturmGame();
    renderWackelturm();
  });

  /* ===== Wort-Typ: Wörter per Antippen der richtigen Kategorie zuordnen ===== */
  let waSession = null; // { round, total, correct }
  let waCurrentWord = null; // [word, category]
  const WA_BUCKETS = [
    { key: "verb", label: "🏃 Verb" },
    { key: "adjektiv", label: "🎨 Adjektiv" },
    { key: "substantiv", label: "📦 Substantiv" },
    { key: "adverb", label: "⏰ Adverb" },
  ];
  let waUsedWords = []; // welche Wörter in DIESER Sitzung schon dran waren
  function newWortartenSession() {
    waSession = { round: 0, total: 15, correct: 0 };
    waUsedWords = [];
  }
  function newWortartenRound() {
    let pool = ExerciseData.WORTARTEN.filter((w) => !waUsedWords.includes(w[0]));
    if (pool.length === 0) { waUsedWords = []; pool = ExerciseData.WORTARTEN; }
    waCurrentWord = pool[Math.floor(Math.random() * pool.length)];
    waUsedWords.push(waCurrentWord[0]);
  }
  function renderWortartenResults() {
    const area = document.getElementById("wortartenArea");
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p class="eyebrow">🔤 WORT-TYP — SITZUNG FERTIG</p>
        <p style="font-size:2rem; margin:8px 0;">🎉</p>
        <h2 style="margin:8px 0;">${waSession.correct} / ${waSession.total} richtig zugeordnet!</h2>
        <button type="button" class="btn btn-coffee" id="waPlayAgainBtn" style="margin-top:14px;">🔄 Neue Runden</button>
      </div>`;
    document.getElementById("waPlayAgainBtn").addEventListener("click", () => {
      newWortartenSession(); newWortartenRound(); renderWortarten();
    });
    if (Backend.currentUser()) {
      const percent = Math.round((waSession.correct / waSession.total) * 100);
      saveResultAndCheck({ categories: ["wortarten"], points: waSession.correct, bonus: 0, percent, character: "Wort-Typ:in", badges: [], playedAt: new Date().toISOString() });
      if (activeGameChallengeId) { Backend.submitChallengeResult(activeGameChallengeId, { percent }); activeGameChallengeId = null; }
    }
  }
  function renderWortarten() {
    const area = document.getElementById("wortartenArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "wortarten_aktiv", "Wort-Typ", "🔤", true)) return;
    if (!waSession) newWortartenSession();
    if (waSession.round >= waSession.total) { renderWortartenResults(); return; }
    if (!waCurrentWord) newWortartenRound();
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        ${miniBugReportBtnHtml("Wort-Typ: " + waCurrentWord[0])}
        <p class="eyebrow">🔤 WORT-TYP · RUNDE ${waSession.round + 1} / ${waSession.total} <span class="subnav-info-icon" data-info="Ordne jedes Wort per Antippen der richtigen Kategorie zu: Verb (Tätigkeit), Adjektiv (Eigenschaft), Substantiv (Ding/Person, immer groß), oder Adverb (z. B. Zeit/Ort/Art, ändert sich nie).">ⓘ</span></p>
        <div id="waChallengeBar"></div>
        <p style="font-size:1.8rem; font-weight:800; margin:20px 0;">${waCurrentWord[0]}</p>
        <div class="trophy-case" style="justify-content:center;">
          ${WA_BUCKETS.map((b) => `<button type="button" class="trophy-chip wa-bucket-btn" data-bucket="${b.key}" style="font-size:0.95rem; padding:10px 16px;">${b.label}</button>`).join("")}
        </div>
        <p class="empty-note" id="waFeedback" style="margin-top:14px; min-height:20px;"></p>
      </div>`;
    renderMiniChallengeBarCached("wortarten", "wortarten", "waChallengeBar", area, renderWortarten);
    area.querySelectorAll(".wa-bucket-btn").forEach((btn) => {
      btn.addEventListener("click", () => checkWortarten(btn.dataset.bucket, btn));
    });
  }
  function checkWortarten(chosen, btn) {
    document.querySelectorAll(".wa-bucket-btn").forEach((b) => { b.disabled = true; });
    const correct = chosen === waCurrentWord[1];
    const fb = document.getElementById("waFeedback");
    waSession.round += 1;
    if (correct) {
      waSession.correct += 1;
      Core.sound.correct();
      btn.style.background = "#DFF3E5";
      fb.textContent = "✅ Richtig!";
    } else {
      Core.sound.wrong();
      btn.style.background = "#FBDCDC";
      const rightLabel = WA_BUCKETS.find((b) => b.key === waCurrentWord[1]).label;
      fb.textContent = `„${waCurrentWord[0]}“ ist eigentlich: ${rightLabel}`;
    }
    setTimeout(() => { newWortartenRound(); renderWortarten(); }, 1800);
  }
  document.querySelector('#learnSubnav [data-sub="sub-wortarten"]')?.addEventListener("click", () => {
    if (!waSession) newWortartenSession();
    if (!waCurrentWord) newWortartenRound();
    renderWortarten();
  });

  /* ===== Wort-Kanone: Fragen aus allen Kategorien — falsche Antworten fallen als Ziele herunter
     und müssen abgeschossen werden, BEVOR sie unten ankommen. Die richtige Antwort darf NICHT
     getroffen werden — landet sie unten, ist das richtig so. Braucht keine eigenen neuen Fragen. */
  let knLives = 3;
  let knPaused = false;
  let knPausedAt = null; // Zeitpunkt, an dem pausiert wurde — beim Fortsetzen wird die
  // verstrichene Pausendauer auf jedes spawnedAt draufgerechnet, damit die Fallbewegung nahtlos
  // an derselben Stelle weiterläuft, statt beim Fortsetzen plötzlich zu springen.
  // Wolken-Mechanik: mit jedem Fehler (weniger Leben) ziehen mehr/dichtere Wolken langsam übers
  // Bild und schieben sich zeitweise VOR die fallenden Wörter — echte zusätzliche Schwierigkeit,
  // nicht nur mehr Tempo. Bei vollen Leben ist der Himmel noch klar.
  let knCloudTimer = null;
  // Startet den wiederkehrenden Wolken-Spawn — läuft nur EINMAL (nicht bei jedem Rendern erneut
  // gestartet, sonst würden sich mehrere Intervalle überlagern und immer schneller spawnen).
  function startKanoneCloudTimer() {
    if (knCloudTimer) return;
    knCloudTimer = setInterval(() => {
      const container = document.getElementById("knClouds");
      // Sobald der Spielbereich verschwunden ist (Reiter verlassen, Runde vorbei), Timer sauber
      // stoppen statt für immer im Hintergrund weiterzulaufen.
      if (!container) { clearInterval(knCloudTimer); knCloudTimer = null; return; }
      const mistakes = 3 - knLives;
      // Bei vollen Leben (keine Fehler) noch klarer Himmel, kaum Wolken — mit jedem Fehler
      // ziehen mehr und dichtere Wolken auf, echte zusätzliche Schwierigkeit statt nur Tempo.
      const spawnChance = 0.15 + mistakes * 0.25;
      if (Math.random() > spawnChance) return;
      const cloud = document.createElement("span");
      cloud.className = "kn-cloud";
      cloud.textContent = "☁️";
      cloud.style.top = `${10 + Math.random() * 55}%`;
      cloud.style.fontSize = `${1.4 + mistakes * 0.5 + Math.random() * 0.6}rem`;
      cloud.style.opacity = `${0.55 + mistakes * 0.12}`;
      const duration = 9 - mistakes * 1.2; // mit mehr Fehlern ziehen Wolken auch etwas schneller
      cloud.style.animationDuration = `${duration}s`;
      container.appendChild(cloud);
      setTimeout(() => cloud.remove(), duration * 1000);
    }, 1800);
  }
  // Startbildschirm mit Spielbeschreibung erscheint nur beim ALLERERSTEN Betreten dieser Sitzung
  // — bisher legte das Spiel sofort beim Reinklicken los, ohne dass klar war, worum es geht.
  let knIntroShown = false;
  let knScore = 0;
  // Verhindert, dass der Fehler-Sound und die Punktevergabe erneut auslösen, nur weil man zu
  // einem anderen Spiel wechselt und zurückkommt, während die Runde bereits vorbei ist — vorher
  // rief jedes erneute Rendern des Abschluss-Bildschirms beides nochmal auf.
  let knGameOverFinalized = false;
  // Fehler-Zähler für die Bewertung am Rundenende — sowohl versehentlich getroffene richtige
  // Antworten als auch durchgekommene falsche Antworten zählen als Fehler.
  let knMistakes = 0;
  let knUsedPrompts = [];
  let knCurrentQuestion = null;
  let knActiveWords = [];
  let knRoundActive = false;
  let knAutoLandLast = false; // Häkchen-Option: letztes übrig bleibendes Wort automatisch landen lassen
  /* ===== Wortblasen: mehrere Wort-Sprechblasen erscheinen gleichzeitig, wachsen kurz und
     "zerplatzen" dann von selbst — bevor das passiert, muss die RICHTIGE Antwort angetippt
     werden. Anders als bei der Wort-Kanone (fallende Wörter, falsche abschießen) hier: Blasen,
     die richtige muss man TREFFEN, bevor die Zeit abläuft. Eigener Charakter durch den
     Zeitdruck-über-Zerplatzen statt Fallen. ===== */
  let bbLives = 3;
  let bbPaused = false;
  let bbPausedAt = null; // wie bei der Wort-Kanone: verstrichene Pausendauer wird beim Fortsetzen
  // auf jedes spawnedAt draufgerechnet, damit der Aufstieg nahtlos weiterläuft.
  let bbScore = 0;
  let bbMistakes = 0;
  let bbUsedPrompts = [];
  let bbCurrentQuestion = null;
  let bbActiveBubbles = [];
  let bbRoundActive = false;
  let bbGameOverFinalized = false;
  let bbIntroShown = false;
  const BB_BUBBLE_LIFETIME = 5.5; // Sekunden, bis eine Blase von selbst zerplatzt — kürzer als die
  // vorherigen 7.5s, damit man bei einer unbeantworteten Blase nicht so lange auf die
  // Fehler-Erkennung warten muss, aber immer noch genug Zeit zum Lesen und Nachdenken.
  function pickRandomBubbleQuestion() {
    // WICHTIG: die "Deutschland-Quiz"-Kategorie (allgemeines Sachwissen wie Geschichte, Kultur,
    // Fußball-Weltmeisterschaften …) bewusst ausgeschlossen — Wortblasen soll sich rein auf
    // Sprache konzentrieren, ohne zusätzlich noch Allgemeinwissen abzuverlangen. Das wäre für
    // Deutschlernende eine unfaire Doppelbelastung.
    const cats = ExerciseData.CATEGORIES.filter((c) => c.getBank && c.group !== "quiz" && (!c.unlock || isUnlocked(c.unlock, Backend.currentProfile())));
    for (let attempt = 0; attempt < 25; attempt++) {
      const cat = cats[Math.floor(Math.random() * cats.length)];
      const bank = cat.getBank();
      const q = bank[Math.floor(Math.random() * bank.length)];
      if (!bbUsedPrompts.includes(q.prompt) && q.options && q.options.length >= 2 && q.options.length <= 5 && q.options.every((o) => o.length <= 13)) {
        bbUsedPrompts.push(q.prompt);
        return q;
      }
    }
    bbUsedPrompts = [];
    return pickRandomBubbleQuestion();
  }
  function newBubbleGame() {
    bbLives = 3;
    bbScore = 0;
    bbMistakes = 0;
    bbUsedPrompts = [];
    bbGameOverFinalized = false;
    newBubbleRound();
  }
  function newBubbleRound() {
    bbCurrentQuestion = pickRandomBubbleQuestion();
    const correctIdx = bbCurrentQuestion.correct[0];
    // Positionen in einem Raster mit kleinen zufälligen Abweichungen, damit sich Blasen nicht
    // überlappen — anders als bei den fallenden Wörtern gibt es hier keine Bewegung, nur Wachsen.
    // Positionen mit GARANTIERTEM Mindestabstand in der Breite (X-Verteilung bleibt bestehen,
    // damit sich Blasen niemals seitlich überlappen). WICHTIG: die Höhe (Y) ist jetzt bewusst kein
    // fester Startpunkt mehr — jede Blase startet unten, VERSTECKT unterhalb des sichtbaren
    // Spielfelds, und steigt über ihre gesamte Lebensdauer nach oben auf, bis sie oben aus dem
    // Bild verschwindet (siehe @keyframes bbGrowAndPop). Vorher wuchsen die Blasen nur leicht an
    // einer schon sichtbaren Position im oberen Drittel — das war NICHT das gewünschte "von unten
    // aufsteigen bis sie verschwinden".
    const xPositions = [18, 78, 48, 14, 82];
    bbActiveBubbles = bbCurrentQuestion.options.map((opt, i) => ({
      id: `bb${i}-${Date.now()}`, text: capitalizeIfSentenceStart(opt, bbCurrentQuestion.prompt), isCorrect: i === correctIdx, resolved: false,
      left: Math.max(10, Math.min(88, xPositions[i % xPositions.length] + (Math.random() * 4 - 2))),
      top: 108, // unterhalb des sichtbaren Bereichs — der eigentliche Aufstieg passiert per Animation
      spawnedAt: Date.now(),
    }));
    bbRoundActive = true;
  }
  function resolveBubble(bid, wasCorrectClick) {
    const bubble = bbActiveBubbles.find((b) => b.id === bid);
    if (!bubble || bubble.resolved) return;
    bubble.resolved = true;
    const fb = document.getElementById("bbFeedback");
    if (bubble.isCorrect) {
      bbScore += 1;
      Core.sound.bubblePop();
      if (fb) fb.textContent = wasCorrectClick ? "💥 Richtig getroffen!" : "⏳ Zeit abgelaufen — die richtige Antwort ist zerplatzt!";
      if (!wasCorrectClick) { bbLives -= 1; bbMistakes += 1; }
    } else {
      if (wasCorrectClick) {
        // Falsche Blase angetippt
        bbLives -= 1;
        bbMistakes += 1;
        Core.sound.wrong();
        if (fb) fb.textContent = `⚠️ Das war falsch! (${bbLives} ❤️ übrig)`;
      } else {
        // Falsche Blase zerplatzt von selbst -> keine Strafe, aber trotzdem das Pop-Geräusch
        Core.sound.bubblePop();
      }
    }
    checkBubbleRoundDone();
  }
  function checkBubbleRoundDone() {
    // Ist die richtige Blase bereits erfolgreich geplatzt (angetippt, nicht durch Zeitablauf),
    // macht es keinen Sinn mehr, auf die übrigen falschen Blasen zu warten (die noch bis zu
    // mehrere Sekunden weiter schweben könnten) — die Aufgabe ist ja schon bewiesen gelöst. Ohne
    // diese Prüfung wirkte es, als würde dieselbe Frage nochmal erscheinen, während man in
    // Wahrheit nur auf die restlichen, noch nicht aufgelösten Blasen wartete.
    const correctBubble = bbActiveBubbles.find((b) => b.isCorrect);
    if (correctBubble && correctBubble.resolved) {
      if (bbLives <= 0) { setTimeout(renderBubbleGameOver, 900); return; }
      setTimeout(() => { newBubbleRound(); renderBubbleGame(); }, 900);
      return;
    }
    if (!bbActiveBubbles.every((b) => b.resolved)) { renderBubbleGame(); return; }
    if (bbLives <= 0) { setTimeout(renderBubbleGameOver, 900); return; }
    setTimeout(() => { newBubbleRound(); renderBubbleGame(); }, 900);
  }
  function renderBubbleGame() {
    const area = document.getElementById("bubblesArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "wortblasen_neu", "Wortblasen", "🫧")) return;
    if (!bbIntroShown && !hasSeenGameIntro("wortblasen")) {
      // WICHTIG — behebt einen echten Verstoß gegen die Vorgabe "keine Bubbles mit normalen
      // Schriftzeichen drin": vorher waren die Buchstaben hier <text>-Elemente mit Comic-Sans-
      // Schriftart innerhalb der Blasen — genau das Muster, das ausdrücklich vermieden werden
      // sollte. Jetzt zeichnet handDrawnLetterGroup() (dieselben handgebauten Strichformen wie bei
      // Vokabelmeister) die Buchstaben direkt als Linien in jede Blase hinein.
      const BB_TITLE_LETTERS = ["W", "O", "R", "T", "B", "L", "A", "S", "E", "N"];
      const BB_TITLE_COLORS = ["#5BA8A0", "#4A90D9", "#7FC4D4", "#3EC6C6", "#5BA8A0", "#4A90D9", "#7FC4D4", "#3EC6C6", "#5BA8A0", "#4A90D9"];
      const bubbleR = 19;
      const bubbleGap = 4;
      const step = bubbleR * 2 + bubbleGap;
      const titleSvg = `<svg viewBox="0 0 ${step * BB_TITLE_LETTERS.length + 10} ${bubbleR * 2 + 16}" style="width:100%; max-width:400px; height:auto;">
        ${BB_TITLE_LETTERS.map((letter, i) => {
          const cx = 10 + bubbleR + i * step;
          const cy = bubbleR + 8;
          return `<g>
            <circle cx="${cx}" cy="${cy}" r="${bubbleR}" fill="${BB_TITLE_COLORS[i]}" fill-opacity="0.75" stroke="#FFFFFF" stroke-width="1.5"/>
            <ellipse cx="${cx - 6}" cy="${cy - 7}" rx="5" ry="3" fill="#FFFFFF" fill-opacity="0.8"/>
            ${handDrawnLetterGroup(letter, cx, cy + 1, 22, "#FFFFFF", 2.6)}
          </g>`;
        }).join("")}
      </svg>`;
      area.innerHTML = `
        <div class="question-card" style="text-align:center;">
          <div style="display:flex; justify-content:center;">${titleSvg}</div>
          <p class="empty-note">Mehrere Wort-Blasen erscheinen gleichzeitig — tipp die RICHTIGE Antwort an, bevor sie von selbst zerplatzt! Tippst du eine falsche Blase an, oder zerplatzt die richtige ungetroffen, verlierst du ein Herz. Nach 3 Fehlern ist die Runde vorbei.</p>
          <button type="button" class="btn btn-coffee" id="bbStartIntroBtn" style="margin-top:14px;">▶️ Los geht's</button>
        </div>`;
      wireInlineFeatureFlagToggles(area, renderBubbleGame);
      document.getElementById("bbStartIntroBtn").addEventListener("click", () => { bbIntroShown = true; markGameIntroSeen("wortblasen"); newBubbleGame(); renderBubbleGame(); });
      return;
    }
    if (bbLives <= 0) { renderBubbleGameOver(); return; }
    if (!bbRoundActive) newBubbleGame();
    area.innerHTML = `
      <div class="question-card">
        ${miniBugReportBtnHtml("Wortblasen: " + bbCurrentQuestion.prompt)}
        <p class="eyebrow">🫧 WORTBLASEN · ${bbScore} Treffer
          <button type="button" class="btn btn-ghost" id="bbPauseBtn" style="float:right; padding:2px 10px; font-size:0.78rem;">${bbPaused ? "▶️ Weiter" : "⏸️ Pause"}</button>
        </p>
        <p class="eyebrow" style="margin-top:-6px;">${heartsLivesHtml(bbLives, 3)}</p>
        <p style="font-weight:700; margin:8px 0 12px;">${bbCurrentQuestion.prompt}</p>
        <div class="bb-pool" id="bbPool">
          ${bbActiveBubbles.map((b) => {
            const elapsed = ((Date.now() - b.spawnedAt) / 1000).toFixed(2);
            return `<button type="button" class="bb-bubble" data-bid="${b.id}" style="left:${b.left}%; top:${b.top}%; animation-duration:${BB_BUBBLE_LIFETIME}s; animation-delay:-${elapsed}s; animation-play-state:${bbPaused ? "paused" : "running"};" ${bbPaused ? "disabled" : ""}>${b.text}</button>`;
          }).join("")}
        </div>
        <p class="empty-note" id="bbFeedback" style="text-align:center; min-height:20px; margin-top:8px;"></p>
      </div>`;
    document.getElementById("bbPauseBtn")?.addEventListener("click", () => {
      if (bbPaused) {
        // Wie bei der Wort-Kanone: verstrichene Pausendauer auf jedes spawnedAt draufrechnen,
        // damit der Aufstieg nahtlos an derselben Stelle weiterläuft statt zu springen.
        const pausedDuration = Date.now() - bbPausedAt;
        bbActiveBubbles.forEach((b) => { if (b.spawnedAt) b.spawnedAt += pausedDuration; });
        bbPaused = false;
        bbPausedAt = null;
      } else {
        bbPaused = true;
        bbPausedAt = Date.now();
      }
      renderBubbleGame();
    });
    area.querySelectorAll(".bb-bubble").forEach((btn) => {
      btn.addEventListener("click", () => {
        const b = bbActiveBubbles.find((x) => x.id === btn.dataset.bid);
        if (!b || b.resolved) return;
        btn.style.pointerEvents = "none";
        btn.style.animationPlayState = "paused";
        btn.classList.add(b.isCorrect ? "bb-bubble-pop-good" : "bb-bubble-pop-bad");
        spawnBubbleSplashParticles(btn, b.isCorrect);
        resolveBubble(b.id, true);
      });
      btn.addEventListener("animationend", () => {
        const b = bbActiveBubbles.find((x) => x.id === btn.dataset.bid);
        if (!b || b.resolved) return;
        resolveBubble(b.id, false);
      });
    });
  }
  // Echtes "Platzen" statt nur Aufblähen/Verblassen: erzeugt 7 kleine, tropfenförmige Partikel
  // an der Position der Blase, die in verschiedene Richtungen auseinanderspritzen und dabei
  // verblassen — wie bei einer echten, zerplatzenden Seifenblase, statt eines reinen
  // Skalierungs-Effekts.
  function spawnBubbleSplashParticles(bubbleEl, isGood) {
    const rect = bubbleEl.getBoundingClientRect();
    const parent = bubbleEl.closest(".bb-pool") || bubbleEl.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - parentRect.left;
    const cy = rect.top + rect.height / 2 - parentRect.top;
    const color = isGood ? "#7fd99a" : "#e88a8a";
    const count = 7;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 22 + Math.random() * 18;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const drop = document.createElement("span");
      drop.className = "bb-splash-drop";
      drop.style.left = `${cx}px`;
      drop.style.top = `${cy}px`;
      drop.style.background = color;
      drop.style.setProperty("--dx", `${dx}px`);
      drop.style.setProperty("--dy", `${dy}px`);
      parent.appendChild(drop);
      drop.addEventListener("animationend", () => drop.remove());
    }
  }
  function renderBubbleGameOver() {
    const area = document.getElementById("bubblesArea");
    const totalAttempts = bbScore + bbMistakes;
    const accuracy = totalAttempts > 0 ? Math.round((bbScore / totalAttempts) * 100) : 0;
    let rating;
    if (bbScore === 0) rating = "🌱 Erster Versuch — nächstes Mal klappt's besser!";
    else if (accuracy >= 90) rating = "🎯 Blasenjäger:in! Fast alles getroffen.";
    else if (accuracy >= 70) rating = "💪 Richtig stark — sehr gute Trefferquote!";
    else if (accuracy >= 50) rating = "👍 Solide Runde — schon über die Hälfte getroffen.";
    else rating = "🌱 Übung macht den Meister — weiter dran bleiben!";
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p style="font-size:2.5rem;">🫧</p>
        <h2 style="margin:8px 0;">Runde beendet!</h2>
        ${starRatingArcHtml(accuracy)}
        <p class="empty-note">Du hast <strong>${bbScore}</strong> richtige Blasen getroffen${totalAttempts > 0 ? ` (${accuracy}% Genauigkeit)` : ""}.</p>
        <p style="font-weight:700; margin-top:8px;">${rating}</p>
        <button type="button" class="btn btn-coffee" id="bbRetryBtn" style="margin-top:14px;">🔄 Neue Runde</button>
      </div>`;
    document.getElementById("bbRetryBtn").addEventListener("click", () => { newBubbleGame(); renderBubbleGame(); });
    if (!bbGameOverFinalized) {
      bbGameOverFinalized = true;
      if (Backend.currentUser() && bbScore > 0) {
        saveResultAndCheck({ categories: ["wortblasen"], points: bbScore, bonus: 0, percent: 100, character: "Blasenjäger:in", badges: [], playedAt: new Date().toISOString() });
      }
    }
  }
  document.querySelector('#learnSubnav [data-sub="sub-bubbles"]')?.addEventListener("click", () => {
    renderBubbleGame();
  });

  /* WICHTIG — wie gewünscht: jeder Buchstabe unten ist eine eigens gestaltete SVG-Strichform, kein
     <text> mit einer System-Schriftart. Jeder Buchstabe ist als Satz einfacher Striche/Bögen auf
     einem 24×32-Raster von Hand definiert (gerade Linien als "L", Bögen als quadratische Bezier
     "Q") — dicke, runde Strichenden wie mit einem Filzstift gezeichnet, passend zu einem
     verspielten Wort-Lernspiel statt einer nüchternen Schrift. */
  const VM_LETTER_STROKES = {
    A: ["M2,30 L10,2 L18,30", "M5,19 L15,19"],
    B: ["M4,2 L4,30", "M4,2 Q17,2 17,9 Q17,16 4,16", "M4,16 Q18,16 18,23 Q18,30 4,30"],
    C: ["M20,7 Q12,-1 5,7 Q0,16 5,25 Q12,33 20,26"],
    D: ["M4,2 L4,30", "M4,2 Q20,2 20,16 Q20,30 4,30"],
    E: ["M18,2 L4,2 L4,30 L18,30", "M4,16 L15,16"],
    F: ["M18,2 L4,2 L4,30", "M4,16 L15,16"],
    G: ["M20,7 Q12,-1 5,7 Q0,16 5,25 Q12,33 20,26 L20,17 L13,17"],
    H: ["M4,2 L4,30", "M20,2 L20,30", "M4,16 L20,16"],
    I: ["M12,2 L12,30", "M5,2 L19,2", "M5,30 L19,30"],
    J: ["M18,2 L18,23 Q18,31 10,31 Q4,31 4,25"],
    K: ["M4,2 L4,30", "M19,2 L4,17", "M9,13 L19,30"],
    L: ["M5,2 L5,30 L19,30"],
    M: ["M3,30 L3,2 L12,18 L21,2 L21,30"],
    N: ["M4,30 L4,2 L20,30 L20,2"],
    O: ["M12,2 Q22,2 22,16 Q22,30 12,30 Q2,30 2,16 Q2,2 12,2"],
    P: ["M4,30 L4,2", "M4,2 Q19,2 19,10.5 Q19,19 4,19"],
    Q: ["M12,2 Q22,2 22,16 Q22,30 12,30 Q2,30 2,16 Q2,2 12,2", "M14,22 L22,32"],
    R: ["M4,30 L4,2", "M4,2 Q19,2 19,10.5 Q19,19 4,19", "M10,19 L20,30"],
    S: ["M19,7 Q13,-2 6,4 Q0,10 12,16 Q24,22 17,28 Q10,34 4,25"],
    T: ["M3,2 L21,2", "M12,2 L12,30"],
    U: ["M4,2 L4,21 Q4,30 12,30 Q20,30 20,21 L20,2"],
    V: ["M3,2 L12,30 L21,2"],
    W: ["M2,2 L7,30 L12,10 L17,30 L22,2"],
    X: ["M4,2 L20,30", "M20,2 L4,30"],
    Y: ["M3,2 L12,17 L21,2", "M12,17 L12,30"],
    Z: ["M4,2 L20,2 L4,30 L20,30"],
  };
  function vmLetterSvg(letter) {
    const strokes = VM_LETTER_STROKES[letter.toUpperCase()];
    if (!strokes) return letter; // Absicherung für unerwartete Zeichen — kommt im A–Z-Alphabet nicht vor
    return `<svg viewBox="0 0 24 32" width="22" height="30" class="vm-letter-svg" aria-label="${letter}">
      ${strokes.map((d) => `<path d="${d}" />`).join("")}
    </svg>`;
  }
  // Wiederverwendbare Variante derselben handgezeichneten Strichbuchstaben, aber als <g>-Gruppe
  // zur Einbettung INNERHALB eines größeren SVGs (z. B. in eine Sprechblase oder eine
  // Zielscheibe) — mit eigener Position, Größe und Farbe, statt eines separaten <svg>-Elements.
  // Nutzt dasselbe VM_LETTER_STROKES-Rasterformat (24×32) wie Vokabelmeister, damit auch hier
  // echte, selbst gestaltete Buchstabenformen statt Systemschrift-Text verwendet werden.
  function handDrawnLetterGroup(letter, cx, cy, size, color, strokeWidth) {
    const strokes = VM_LETTER_STROKES[letter.toUpperCase()];
    if (!strokes) return "";
    const scale = size / 32;
    const tx = cx - (24 * scale) / 2;
    const ty = cy - (32 * scale) / 2;
    return `<g transform="translate(${tx},${ty}) scale(${scale})" fill="none" stroke="${color}" stroke-width="${strokeWidth / scale}" stroke-linecap="round" stroke-linejoin="round">
      ${strokes.map((d) => `<path d="${d}" />`).join("")}
    </g>`;
  }
  /* ===== Vokabelmeister: Buchstabe wählen (selbst oder zufällig), dann Zeitdruck — so viele
     Wörter wie möglich mit diesem Anfangsbuchstaben eingeben. Prüft gegen eine kombinierte
     Wortliste aus mehreren Quellen der Seite (Vokabeln, Artikel-Nomen, Hobbys, Länder, Sprachen).
     Bei seltenen Buchstaben (X, Y, Q) ist die Bibliothek ehrlich begrenzt — wird im Spiel selbst
     angezeigt, damit niemand denkt, ein echtes Wort wäre einfach "falsch". ===== */
  let vmLetter = null;
  let vmTimeLeft = 60;
  let vmTimerId = null;
  let vmFoundWords = [];
  let vmRunning = false;
  let vmFinished = false;
  function vmBuildDictionary() {
    const words = new Set();
    // Wörter mit Artikel-Präfix ("der Apfel") müssen für den Buchstaben-Abgleich bereinigt
    // werden — sonst würde "der Apfel" fälschlich unter "D" statt "A" gezählt.
    const stripArticle = (w) => w.replace(/^(der|die|das)\s+/i, "");
    (VocabData.WORDS || []).forEach((w) => words.add(stripArticle(w.word).toLowerCase()));
    (VocabData.HOBBIES || []).forEach((h) => words.add(h.noun.toLowerCase()));
    (VocabData.COUNTRIES || []).forEach((c) => { if (c.name) words.add(c.name.toLowerCase()); if (typeof c === "string") words.add(c.toLowerCase()); });
    (VocabData.LANGUAGES || []).forEach((l) => { if (typeof l === "string") words.add(l.toLowerCase()); if (l && l.name) words.add(l.name.toLowerCase()); });
    (VocabData.MATERIALS || []).forEach((m) => { if (typeof m === "string") words.add(m.toLowerCase()); if (m && m.name) words.add(m.name.toLowerCase()); });
    Object.keys(WordbuildArtikel()).forEach((w) => words.add(w.toLowerCase()));
    return words;
  }
  function vmWordCountForLetter(letter) {
    const dict = vmBuildDictionary();
    let count = 0;
    dict.forEach((w) => { if (w[0].toUpperCase() === letter) count += 1; });
    return count;
  }
  function newVokabelmeisterRound(letter) {
    vmLetter = letter;
    vmTimeLeft = 60;
    vmFoundWords = [];
    vmRunning = true;
    vmFinished = false;
    if (vmTimerId) clearInterval(vmTimerId);
    vmTimerId = setInterval(() => {
      vmTimeLeft -= 1;
      if (vmTimeLeft <= 0) {
        clearInterval(vmTimerId);
        vmTimerId = null;
        vmRunning = false;
        vmFinished = true;
        Core.sound.fanfare();
        if (Backend.currentUser()) {
          saveResultAndCheck({ categories: ["vokabelmeister"], points: vmFoundWords.filter((w) => w.confirmed).length * 2, bonus: 0, percent: 100, character: "Wortschatz-Sammler:in", badges: [], playedAt: new Date().toISOString() });
        }
        renderVokabelmeister();
        return;
      }
      // WICHTIG: NICHT das gesamte renderVokabelmeister() (also innerHTML) jede Sekunde neu
      // aufrufen — das hat bisher das Eingabefeld mitsamt Fokus und bereits getipptem Text jede
      // Sekunde zerstört, sodass man praktisch nie ein Wort fertigtippen konnte. Nur die
      // Zeitanzeige selbst per textContent aktualisieren, alles andere bleibt unberührt.
      const timerEl = document.getElementById("vmTimerDisplay");
      if (timerEl) timerEl.textContent = `⏱️ ${vmTimeLeft}s`;
    }, 1000);
    renderVokabelmeister();
  }
  function renderVokabelmeister() {
    const area = document.getElementById("vokabelmeisterArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "vokabelmeister_neu", "Vokabelmeister", "🔤")) return;
    if (!vmLetter) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      area.innerHTML = `
        <div class="question-card" style="text-align:center;">
          <p style="font-size:2.5rem;">🔤</p>
          <h2 style="margin:8px 0;">Vokabelmeister</h2>
          <p class="empty-note">Wähl einen Buchstaben (oder lass das Los entscheiden) — dann hast du 60 Sekunden Zeit, so viele deutsche Wörter wie möglich einzugeben, die mit diesem Buchstaben beginnen.</p>
          <button type="button" class="btn btn-coffee" id="vmRandomLetterBtn" style="margin:10px 0;">🎲 Zufälliger Buchstabe</button>
          <div class="vm-letter-grid">
            ${alphabet.split("").map((l) => `<button type="button" class="vm-letter-btn" data-vm-letter="${l}">${vmLetterSvg(l)}</button>`).join("")}
          </div>
        </div>`;
      wireInlineFeatureFlagToggles(area, renderVokabelmeister);
      document.getElementById("vmRandomLetterBtn").addEventListener("click", () => {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        newVokabelmeisterRound(alphabet[Math.floor(Math.random() * alphabet.length)]);
      });
      area.querySelectorAll("[data-vm-letter]").forEach((btn) => {
        btn.addEventListener("click", () => newVokabelmeisterRound(btn.dataset.vmLetter));
      });
      return;
    }
    if (vmFinished) {
      const confirmedCount = vmFoundWords.filter((w) => w.confirmed).length;
      const unconfirmedCount = vmFoundWords.length - confirmedCount;
      area.innerHTML = `
        <div class="question-card" style="text-align:center;">
          <p style="font-size:2.5rem;">⏰</p>
          <h2 style="margin:8px 0;">Zeit um!</h2>
          <p class="empty-note">Buchstabe <strong>${vmLetter}</strong>: <strong>${confirmedCount}</strong> bestätigte Wörter gefunden${unconfirmedCount ? ` (+${unconfirmedCount} nicht in der Bibliothek erkannt, zählen nicht als Punkte, waren aber vielleicht trotzdem richtig)` : ""}.</p>
          <div class="breakdown-list" style="margin-top:10px; text-align:left;">
            ${vmFoundWords.map((w) => `<div class="breakdown-row"><span>${w.confirmed ? "✅" : "❔"} ${w.text}</span></div>`).join("")}
          </div>
          <button type="button" class="btn btn-coffee" id="vmNewRoundBtn" style="margin-top:14px;">🔄 Neue Runde</button>
        </div>`;
      document.getElementById("vmNewRoundBtn").addEventListener("click", () => { vmLetter = null; renderVokabelmeister(); });
      return;
    }
    const dictSize = vmWordCountForLetter(vmLetter);
    area.innerHTML = `
      <div class="question-card">
        <p class="eyebrow">🔤 VOKABELMEISTER · Buchstabe ${vmLetter} · <span id="vmTimerDisplay">⏱️ ${vmTimeLeft}s</span></p>
        ${dictSize < 3 ? `<p class="empty-note" style="font-size:0.74rem;">💡 Bei „${vmLetter}" ist unsere Bibliothek noch klein — auch echte, richtige Wörter werden dann eventuell nicht bestätigt erkannt. Trotzdem eine gute Herausforderung!</p>` : ""}
        <input type="text" id="vmWordInput" class="vocab-search" placeholder="Wort mit ${vmLetter} eingeben und Enter drücken…" autocomplete="off" style="margin-top:8px;" />
        <div class="breakdown-list" style="margin-top:10px;">
          ${vmFoundWords.length ? vmFoundWords.map((w) => `<div class="breakdown-row"><span>${w.confirmed ? "✅" : "❔"} ${w.text}</span></div>`).join("") : '<p class="empty-note">Noch kein Wort eingegeben.</p>'}
        </div>
      </div>`;
    const input = document.getElementById("vmWordInput");
    input.focus();
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const raw = input.value.trim();
      if (!raw) return;
      if (raw[0].toUpperCase() !== vmLetter) {
        showToast(`⚠️ Muss mit „${vmLetter}" beginnen.`);
        input.value = "";
        return;
      }
      if (vmFoundWords.some((w) => w.text.toLowerCase() === raw.toLowerCase())) {
        showToast("⚠️ Hattest du schon.");
        input.value = "";
        return;
      }
      const dict = vmBuildDictionary();
      const confirmed = dict.has(raw.toLowerCase());
      vmFoundWords.unshift({ text: raw, confirmed });
      if (confirmed) Core.sound.correct();
      input.value = "";
      renderVokabelmeister();
    });
  }
  document.querySelector('#learnSubnav [data-sub="sub-vokabelmeister"]')?.addEventListener("click", () => {
    renderVokabelmeister();
  });

  /* ===== Korrektour: Wörter fahren als Zug (Waggons, Lok voran) im Bogen von rechts oben durchs
     Bild und wieder hinaus — bevor der Zug ganz verschwunden ist, muss per Ampel-Signal
     entschieden werden, ob der Satz grammatikalisch richtig ist (Grün) oder einen typischen
     Fehler enthält (Rot). Eigener Charakter durch das kurze Zeitfenster beim Vorbeifahren, statt
     fallender oder zerplatzender Elemente wie bei den anderen Spielen. ===== */
  let ktScore = 0;
  let ktLives = 3;
  let ktPaused = false;
  let ktGameOverFinalized = false;
  let ktMistakes = 0;
  let ktCurrentSentence = null;
  let ktLastEntryId = null; // verhindert, dass unmittelbar hintereinander derselbe Satz (nur mit
  // korrekter oder fehlerhafter Variante) erneut gezogen wird — bei einem kleineren Pool war es
  // sonst spürbar häufig, dass genau der gerade falsch beantwortete Satz sofort nochmal kam.
  let ktIsCorrectSentence = false;
  let ktAnswered = false;
  let ktIntroShown = false;
  let ktRoundTimer = null;
  function ktBuildContentPool() {
    const pool = [];
    (ExerciseData.HAEUFIGE_FEHLER || []).forEach(([wrong, correct, explain]) => {
      // Nur echte, mehrteilige Sätze/Wendungen aufnehmen — ein paar Einträge in der Quelle sind
      // nur EIN einzelnes Wort (z. B. "einzigste" -> "einzige"). Als Satz-Zug mit nur einem
      // einzigen Waggon dargestellt, sagte die Rückmeldung dann unsinnig "der SATZ war
      // fehlerhaft", obwohl es gar kein Satz war. Für Korrektour bewusst nur Einträge mit
      // mindestens zwei Wörtern auf BEIDEN Seiten verwenden.
      if (!wrong.includes(" ") || !correct.includes(" ")) return;
      pool.push({ correctSentence: correct, wrongSentence: wrong, explain });
    });
    (ExerciseData.SS_ESZETT || []).forEach(([prompt, correct, wrong, explain]) => {
      if (!prompt.includes("___")) return;
      pool.push({ correctSentence: prompt.replace("___", correct), wrongSentence: prompt.replace("___", wrong), explain });
    });
    return pool;
  }
  function newKorrektourRound() {
    const pool = ktBuildContentPool();
    // Bei mehr als einem Eintrag im Pool: den zuletzt gezeigten Satz beim Ziehen ausschließen,
    // damit er nicht direkt nochmal (mit vertauschter richtig/falsch-Variante) drankommt — genau
    // das gemeldete "derselbe Satz kommt gleich nochmal"-Verhalten.
    const candidates = pool.length > 1 ? pool.filter((e) => e.correctSentence !== ktLastEntryId) : pool;
    const entry = candidates[Math.floor(Math.random() * candidates.length)];
    ktLastEntryId = entry.correctSentence;
    ktIsCorrectSentence = Math.random() < 0.5;
    ktCurrentSentence = ktIsCorrectSentence ? entry.correctSentence : entry.wrongSentence;
    ktCurrentSentence = { text: ktCurrentSentence, explain: entry.explain };
    ktAnswered = false;
    renderKorrektour();
  }
  function ktResolveSignal(saidCorrect) {
    if (ktAnswered) return;
    ktAnswered = true;
    if (ktRoundTimer) { clearTimeout(ktRoundTimer); ktRoundTimer = null; }
    const fb = document.getElementById("ktFeedback");
    const wasRight = saidCorrect === ktIsCorrectSentence;
    if (wasRight) {
      ktScore += 1;
      Core.sound.correct();
      if (fb) fb.textContent = `✅ Richtig! Der Satz war ${ktIsCorrectSentence ? "korrekt" : "fehlerhaft"}. ${ktCurrentSentence.explain}`;
    } else {
      ktLives -= 1;
      ktMistakes += 1;
      Core.sound.wrong();
      if (fb) fb.textContent = `⚠️ Leider nicht — der Satz war ${ktIsCorrectSentence ? "korrekt" : "fehlerhaft"}. ${ktCurrentSentence.explain}`;
    }
    setTimeout(() => {
      if (ktLives <= 0) { renderKorrektourGameOver(); return; }
      newKorrektourRound();
    }, 2200);
  }
  function renderKorrektour() {
    const area = document.getElementById("korrektourArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "korrektour_neu", "Korrektour", "🚂")) return;
    if (!ktIntroShown && !hasSeenGameIntro("korrektour")) {
      // Statt eines schlichten Text-Titels: ein kleiner, bunter Zug, bei dem jeder Waggon einen
      // Buchstaben von "KORREKTOUR" trägt — dem Kunstwort aus "Korrektur" + "Tour" (mit dem
      // zusätzlichen O vor dem U, das erst das Wortspiel ergibt) — passend zum Zug-Thema des
      // Spiels, kindlich-verspielt mit leichter Neigung pro Waggon statt einer starren Reihe. Der
      // T-Waggon (das eingefügte Kunstwort-T) bekommt bewusst die Signalfarbe aus dem ursprünglich
      // farblich hervorgehobenen Text-Titel, damit der Wortwitz weiterhin auffällt.
      const KT_TITLE_LETTERS = ["K", "O", "R", "R", "E", "K", "T", "O", "U", "R"];
      const KT_TITLE_COLORS = ["#5BA8A0", "#F2B84B", "#A875D8", "#4A90D9", "#7FB87A", "#B084CC", "#E85F6F", "#F2B84B", "#5BA8A0", "#A875D8"];
      const wagonW = 38;
      const titleSvg = `<svg viewBox="0 0 ${wagonW * KT_TITLE_LETTERS.length + 20} 70" style="width:100%; max-width:400px; height:auto;">
        ${KT_TITLE_LETTERS.map((letter, i) => {
          const x = 10 + i * wagonW;
          const rot = (i % 2 === 0 ? -1 : 1) * (4 + (i * 3) % 5);
          return `<g transform="translate(${x + wagonW / 2},35) rotate(${rot}) translate(${-wagonW / 2},-35)">
            <rect x="2" y="14" width="${wagonW - 6}" height="34" rx="6" fill="${KT_TITLE_COLORS[i]}" stroke="#241505" stroke-width="1.5"/>
            <circle cx="9" cy="52" r="5" fill="#241505"/>
            <circle cx="${wagonW - 11}" cy="52" r="5" fill="#241505"/>
            <text x="${(wagonW - 6) / 2 + 2}" y="37" text-anchor="middle" font-family="Comic Sans MS, cursive, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF" stroke="#241505" stroke-width="0.6">${letter}</text>
          </g>`;
        }).join("")}
      </svg>`;
      area.innerHTML = `
        <div class="question-card" style="text-align:center;">
          <div style="display:flex; justify-content:center;">${titleSvg}</div>
          <p class="empty-note">Ein Satz-Zug fährt am unteren Bildrand vorbei — du hast nur dieses kurze Zeitfenster, um zu entscheiden: Ist der Satz grammatikalisch RICHTIG (🟢 Grün) oder enthält er einen typischen Fehler (🔴 Rot)? Nach 3 Fehlern ist die Runde vorbei.</p>
          <button type="button" class="btn btn-coffee" id="ktStartIntroBtn" style="margin-top:14px;">▶️ Los geht's</button>
        </div>`;
      wireInlineFeatureFlagToggles(area, renderKorrektour);
      document.getElementById("ktStartIntroBtn").addEventListener("click", () => { ktIntroShown = true; markGameIntroSeen("korrektour"); ktScore = 0; ktLives = 3; ktMistakes = 0; ktGameOverFinalized = false; newKorrektourRound(); });
      return;
    }
    if (!ktCurrentSentence) { newKorrektourRound(); return; }
    const words = ktCurrentSentence.text.split(" ");
    // Echtes SVG statt Emoji für die Lokomotive — ein Emoji wie 🚂 wird je nach Plattform/
    // Schriftart unterschiedlich dargestellt (manchmal nach links, manchmal nach rechts fahrend),
    // ein selbst gezeichnetes SVG zeigt garantiert immer in dieselbe Richtung (nach links, in
    // Fahrtrichtung der Bewegung).
    // Speichenrad als eigene, wiederverwendbare Funktion — mit sichtbaren Speichen (statt eines
    // einzelnen Punkts in der Mitte, was wie ein Autoreifen aussah) und einer eigenen CSS-Klasse
    // für die Dreh-Animation, damit man beim Fahren wirklich sieht, wie sich die Speichen drehen.
    const wheelSvg = (cx, cy, r) => `
      <g class="kt-wheel" style="transform-origin:${cx}px ${cy}px;">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#241505"/>
        <circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="none" stroke="#8a6a3a" stroke-width="1.4"/>
        <line x1="${cx - r * 0.72}" y1="${cy}" x2="${cx + r * 0.72}" y2="${cy}" stroke="#e8a03d" stroke-width="1.6"/>
        <line x1="${cx}" y1="${cy - r * 0.72}" x2="${cx}" y2="${cy + r * 0.72}" stroke="#e8a03d" stroke-width="1.6"/>
        <line x1="${cx - r * 0.5}" y1="${cy - r * 0.5}" x2="${cx + r * 0.5}" y2="${cy + r * 0.5}" stroke="#e8a03d" stroke-width="1.4"/>
        <line x1="${cx - r * 0.5}" y1="${cy + r * 0.5}" x2="${cx + r * 0.5}" y2="${cy - r * 0.5}" stroke="#e8a03d" stroke-width="1.4"/>
        <circle cx="${cx}" cy="${cy}" r="${r * 0.18}" fill="#e8a03d"/>
      </g>`;
    // Deutlich größer und detailreicher als vorher — richtiger Kessel (zylindrisch), Schornstein,
    // Führerhaus mit Fenstern, Puffer vorne, und jetzt echte Speichenräder statt schlichter
    // Kreise, die eher wie Autoreifen wirkten.
    // WICHTIG — deutlich überarbeiteter Look: vorher nur ein einzelner, dünner Aufbau vorne ohne
    // erkennbaren Schornstein. Jetzt zwei echte Schornsteine (ein großer, ein kleiner) auf dem Bug,
    // ein Führerhaus-Fenster mit Sprossen, ein Kessel-Highlight für Rundung, und ein rotes
    // Stoßfänger-Detail vorne — insgesamt näher an einer klassischen Dampflokomotive.
    const locomotiveSvg = `<svg viewBox="0 0 84 58" width="76" height="52" class="kt-locomotive-svg">
      <rect x="2" y="4" width="6" height="16" rx="1.5" fill="#3a2f4a"/>
      <ellipse cx="5" cy="3" rx="5" ry="2.5" fill="#8a7a9a"/>
      <rect x="12" y="8" width="4" height="12" rx="1" fill="#4a3a5a"/>
      <ellipse cx="14" cy="7" rx="3" ry="1.8" fill="#8a7a9a"/>
      <rect x="16" y="14" width="30" height="20" rx="10" fill="#c9432f"/>
      <rect x="16" y="14" width="30" height="7" rx="6" fill="#e0594a" opacity="0.7"/>
      <rect x="16" y="20" width="30" height="4" fill="#a8321f"/>
      <rect x="44" y="8" width="30" height="26" rx="4" fill="#5a4a72"/>
      <rect x="49" y="12" width="9" height="9" rx="1.5" fill="#bfe3f0"/>
      <line x1="53.5" y1="12" x2="53.5" y2="21" stroke="#5a4a72" stroke-width="1"/>
      <rect x="60" y="12" width="9" height="9" rx="1.5" fill="#bfe3f0"/>
      <line x1="64.5" y1="12" x2="64.5" y2="21" stroke="#5a4a72" stroke-width="1"/>
      <rect x="70" y="34" width="6" height="8" fill="#3a2f4a"/>
      <rect x="8" y="30" width="8" height="4" rx="1" fill="#c9432f"/>
      <rect x="2" y="34" width="80" height="6" fill="#241505"/>
      ${wheelSvg(20, 47, 9)}
      ${wheelSvg(42, 47, 9)}
      ${wheelSvg(62, 47, 9)}
    </svg>`;
    // Wagen ebenfalls mit mehr Details: sichtbare Holzlatten-Struktur, ein Metallrahmen-Streifen
    // unten, und Nietenpunkte an den Ecken statt einer reinen Flat-Color-Fläche.
    const wagonSvg = (word) => `<span class="kt-wagon">
      <svg viewBox="0 0 84 50" class="kt-wagon-svg" aria-hidden="true">
        <rect x="2" y="4" width="80" height="28" rx="5" fill="#f0a94e" stroke="#96521a" stroke-width="1.5"/>
        <line x1="2" y1="12" x2="82" y2="12" stroke="#c98730" stroke-width="1" opacity="0.6"/>
        <line x1="2" y1="20" x2="82" y2="20" stroke="#c98730" stroke-width="1" opacity="0.6"/>
        <rect x="2" y="22" width="80" height="4" fill="#96521a" opacity="0.5"/>
        <circle cx="7" cy="8" r="1.4" fill="#96521a"/>
        <circle cx="77" cy="8" r="1.4" fill="#96521a"/>
        <circle cx="7" cy="28" r="1.4" fill="#96521a"/>
        <circle cx="77" cy="28" r="1.4" fill="#96521a"/>
        <rect x="2" y="26" width="80" height="6" fill="#241505"/>
        ${wheelSvg(19, 41, 8)}
        ${wheelSvg(65, 41, 8)}
      </svg>
      <span class="kt-wagon-text">${word}</span>
    </span>`;
    area.innerHTML = `
      <div class="question-card">
        ${miniBugReportBtnHtml("Korrektour: " + ktCurrentSentence.text)}
        <p class="eyebrow">🚂 KORREKTOUR · ${ktScore} Treffer
          <button type="button" class="btn btn-ghost" id="ktPauseBtn" style="float:right; padding:2px 10px; font-size:0.78rem;">${ktPaused ? "▶️ Weiter" : "⏸️ Pause"}</button>
        </p>
        <p class="eyebrow" style="margin-top:-6px;">${heartsLivesHtml(ktLives, 3)}</p>
        <div class="kt-track" id="ktTrack">
          <div class="kt-train" id="ktTrain" style="animation-play-state:${ktPaused ? "paused" : "running"};">
            <span class="kt-locomotive">${locomotiveSvg}</span>
            ${words.map(wagonSvg).join("")}
          </div>
        </div>
        <div class="kt-signal-row">
          <button type="button" class="kt-signal kt-signal-green" id="ktGreenBtn" ${ktAnswered || ktPaused ? "disabled" : ""}>🟢 Richtig</button>
          <button type="button" class="kt-signal kt-signal-red" id="ktRedBtn" ${ktAnswered || ktPaused ? "disabled" : ""}>🔴 Fehler drin</button>
        </div>
        <p class="empty-note" id="ktFeedback" style="text-align:center; min-height:36px; margin-top:8px;"></p>
      </div>`;
    document.getElementById("ktGreenBtn").addEventListener("click", () => ktResolveSignal(true));
    document.getElementById("ktRedBtn").addEventListener("click", () => ktResolveSignal(false));
    document.getElementById("ktPauseBtn")?.addEventListener("click", () => {
      // Anders als bei Wortblasen/Wort-Kanone braucht es hier KEIN Zeitstempel-Nachrechnen — der
      // Zug ist nur EIN einzelnes Element mit einer normalen CSS-Animation (kein spawnedAt-System
      // für mehrere unabhängige Elemente). animation-play-state:paused friert die tatsächliche
      // Position ein, und die ohnehin schon positionsbasierte (nicht zeitbasierte)
      // "komplett durch"-Prüfung unten erkennt das automatisch korrekt mit.
      ktPaused = !ktPaused;
      renderKorrektour();
    });
    // Kein Zeitdruck mehr WÄHREND der Zug noch (auch nur teilweise) sichtbar ist — man darf sich
    // die ganze Durchfahrt Zeit lassen. Aber sobald der LETZTE Waggon wirklich komplett aus dem
    // sichtbaren Bereich verschwunden ist, zählt eine noch fehlende Entscheidung als verpasst.
    // Über die tatsächliche Position gemessen (nicht über eine geschätzte, feste Zeit), da
    // unterschiedlich lange Sätze unterschiedlich lange Züge ergeben, die unterschiedlich lange
    // brauchen, bis sie komplett durch sind.
    const track = document.getElementById("ktTrack");
    const train = document.getElementById("ktTrain");
    if (track && train) {
      const checkFullyOffscreen = () => {
        if (ktAnswered) return;
        const trackRect = track.getBoundingClientRect();
        const trainRect = train.getBoundingClientRect();
        if (trainRect.right < trackRect.left) {
          // Letzter Waggon (rechter Rand des Zugs) ist komplett links aus dem Bild raus.
          ktAnswered = true;
          ktLives -= 1;
          ktMistakes += 1;
          Core.sound.wrong();
          const fb = document.getElementById("ktFeedback");
          if (fb) fb.textContent = `⏳ Der Zug ist schon durch — der Satz war ${ktIsCorrectSentence ? "korrekt" : "fehlerhaft"}. ${ktCurrentSentence.explain}`;
          setTimeout(() => {
            if (ktLives <= 0) { renderKorrektourGameOver(); return; }
            newKorrektourRound();
          }, 2200);
          return;
        }
        requestAnimationFrame(checkFullyOffscreen);
      };
      requestAnimationFrame(checkFullyOffscreen);
    }
  }
  function renderKorrektourGameOver() {
    const area = document.getElementById("korrektourArea");
    const totalAttempts = ktScore + ktMistakes;
    const accuracy = totalAttempts > 0 ? Math.round((ktScore / totalAttempts) * 100) : 0;
    let rating;
    if (ktScore === 0) rating = "🌱 Erster Versuch — nächstes Mal klappt's besser!";
    else if (accuracy >= 90) rating = "🚦 Fahrdienstleiter:in! Fast alles richtig erkannt.";
    else if (accuracy >= 70) rating = "💪 Richtig stark — sehr gutes Gespür für Grammatik!";
    else if (accuracy >= 50) rating = "👍 Solide Runde — schon über die Hälfte richtig.";
    else rating = "🌱 Übung macht den Meister — weiter dran bleiben!";
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p style="font-size:2.5rem;">🚂</p>
        <h2 style="margin:8px 0;">Runde beendet!</h2>
        ${starRatingArcHtml(accuracy)}
        <p class="empty-note">Du hast <strong>${ktScore}</strong> Sätze richtig eingeschätzt${totalAttempts > 0 ? ` (${accuracy}% Genauigkeit)` : ""}.</p>
        <p style="font-weight:700; margin-top:8px;">${rating}</p>
        <button type="button" class="btn btn-coffee" id="ktRetryBtn" style="margin-top:14px;">🔄 Neue Runde</button>
      </div>`;
    document.getElementById("ktRetryBtn").addEventListener("click", () => { ktScore = 0; ktLives = 3; ktMistakes = 0; ktGameOverFinalized = false; newKorrektourRound(); });
    // WICHTIG: Punkte/Freischaltungen nur beim ERSTEN Anzeigen dieser beendeten Runde vergeben —
    // sonst würde ein Wechsel zu einem anderen Spiel und zurück (der renderKorrektourGameOver()
    // erneut aufruft, ohne dass eine neue Runde gestartet wurde) dieselben Punkte und
    // Sammelfiguren-Freischaltungen fälschlich ein zweites Mal auslösen — genau das gemeldete
    // "denselben Fuchs zweimal bekommen"-Verhalten. Kanone und Wortblasen hatten diese
    // Absicherung schon, hier fehlte sie bisher.
    if (!ktGameOverFinalized) {
      ktGameOverFinalized = true;
      if (Backend.currentUser() && ktScore > 0) {
        saveResultAndCheck({ categories: ["korrektour"], points: ktScore, bonus: 0, percent: 100, character: "Fahrdienstleiter:in", badges: [], playedAt: new Date().toISOString() });
      }
    }
  }
  document.querySelector('#learnSubnav [data-sub="sub-korrektour"]')?.addEventListener("click", () => {
    renderKorrektour();
  });

  function pickRandomKanoneQuestion() {
    // Gleicher Ausschluss wie bei Wortblasen — keine Allgemeinwissens-Fragen bei der Wort-Kanone.
    const cats = ExerciseData.CATEGORIES.filter((c) => c.getBank && c.group !== "quiz" && (!c.unlock || isUnlocked(c.unlock, Backend.currentProfile())));
    for (let attempt = 0; attempt < 25; attempt++) {
      const cat = cats[Math.floor(Math.random() * cats.length)];
      const bank = cat.getBank();
      const q = bank[Math.floor(Math.random() * bank.length)];
      if (!knUsedPrompts.includes(q.prompt) && q.options && q.options.length >= 2 && q.options.length <= 5 && q.options.every((o) => o.length <= 18)) {
        knUsedPrompts.push(q.prompt);
        return q;
      }
    }
    knUsedPrompts = [];
    const cat = cats[Math.floor(Math.random() * cats.length)];
    const bank = cat.getBank();
    return bank.find((q) => q.options.length >= 2 && q.options.length <= 5 && q.options.every((o) => o.length <= 18)) || bank[0];
  }
  function newKanoneGame() {
    knLives = 3;
    knScore = 0;
    knMistakes = 0;
    knUsedPrompts = [];
    // Markierung zurücksetzen: Sound und Punktevergabe beim Abschluss-Bildschirm dürfen für DIESE
    // neue Runde wieder einmal auslösen.
    knGameOverFinalized = false;
    // Verbrannter Rasen gehört zur alten Runde — bei einer neuen Runde ist die kleine Spielwelt
    // wieder "heil".
    const grass = document.getElementById("knBurntGrass");
    if (grass) grass.innerHTML = "";
    newKanoneRound();
  }
  function newKanoneRound() {
    knCurrentQuestion = pickRandomKanoneQuestion();
    const correctIdx = knCurrentQuestion.correct[0];
    // WICHTIG: die Positionen werden jetzt mit GARANTIERTEM Mindestabstand berechnet, statt in
    // einem engen, zufälligen Cluster (35–65% Breite) — bei bis zu 5 Antwortoptionen PLUS zwei
    // möglichen Bonus-Elementen (Herz, Münze) gleichzeitig führte der enge Cluster praktisch
    // garantiert zu Überlappungen, besonders bei längeren Wörtern. Jetzt werden alle Elemente
    // (inklusive Bonus) VORAB gemeinsam geplant und über die volle Breite (10–90%) verteilt.
    const wantsHeartBonus = knLives < 3 && Math.random() < 0.25;
    const wantsCoinBonus = Math.random() < 0.3;
    const totalSlots = knCurrentQuestion.options.length + (wantsHeartBonus ? 1 : 0) + (wantsCoinBonus ? 1 : 0);
    const slotWidth = 80 / totalSlots;
    const slotOrder = Core.shuffle(Array.from({ length: totalSlots }, (_, i) => i));
    let slotIdx = 0;
    const nextSlotX = () => {
      const base = 10 + slotOrder[slotIdx] * slotWidth + slotWidth / 2;
      slotIdx += 1;
      // Kleine, absichtlich BEGRENZTE Abweichung (max. 1/3 der Slot-Breite) — genug für eine
      // natürliche, nicht perfekt-mechanische Verteilung, aber nie genug, um in den Nachbar-Slot
      // hineinzuragen und dort zu überlappen.
      return Math.max(8, Math.min(92, base + (Math.random() * slotWidth * 0.6 - slotWidth * 0.3)));
    };
    knActiveWords = Core.shuffle(knCurrentQuestion.options.map((opt, i) => ({
      id: `w${i}-${Date.now()}`, text: capitalizeIfSentenceStart(opt, knCurrentQuestion.prompt), isCorrect: i === correctIdx, resolved: false,
      xPercent: nextSlotX(),
      spawnedAt: null,
    })));
    // Gelegentlich (nicht bei jeder Runde) eine zusätzliche Bonus-Sprechblase mit ❤️+1 — schießt
    // man sie ab, gibt es ein Herz zurück (bis zum Maximum von 3). Damit lohnt sich langes
    // Durchhalten zusätzlich, nicht nur reines Punktesammeln. Nur wenn noch nicht alle 3 Herzen da
    // sind, sonst wäre sie wirkungslos.
    if (wantsHeartBonus) {
      knActiveWords.push({
        id: `bonus-${Date.now()}`, text: "❤️+1", isCorrect: false, isBonus: true, resolved: false,
        xPercent: nextSlotX(),
        spawnedAt: null,
      });
    }
    // Zusätzliche Bonus-Punkte-Münze — anders als das Herz bewusst NICHT leicht zu kriegen: fällt
    // deutlich SCHNELLER als normale Wörter und ist kleiner, also eine echte Herausforderung, kein
    // Selbstläufer. Belohnt gutes Timing/Zielen mit extra Punkten obendrauf.
    if (wantsCoinBonus) {
      knActiveWords.push({
        id: `coin-${Date.now()}`, text: "🪙+3", isCorrect: false, isBonus: true, isCoinBonus: true, resolved: false,
        xPercent: nextSlotX(),
        spawnedAt: null,
      });
    }
    knRoundActive = true;
  }
  function renderKanone() {
    const area = document.getElementById("kanoneArea");
    if (!area) return;
    // Die komplett neu gebaute Wort-Kanone (sequentielles Fallen, SVG-Kanone, Explosions-Effekte)
    // ist noch nicht öffentlich freigegeben — nur der Betreiber und Beta-Tester:innen spielen sie
    // schon. Alle anderen spielen ganz normal weiter die bisherige, bereits fertige Version — KEIN
    // Hinweis, kein Unterbrechen, sie merken nichts vom Update, bis es wirklich freigegeben wird.
    if (!Backend.isFeatureOn("wortkanone_redesign")) { renderKanoneOld(); return; }
    // Beim allerersten Betreten dieser Sitzung: kurze Spielbeschreibung mit "Los geht's"-Knopf,
    // statt dass sofort ohne Erklärung losgeschossen wird.
    if (!knIntroShown && !hasSeenGameIntro("wortkanone")) {
      // Statt Emoji + Text: das Wort "WORTKANONE" als Reihe kleiner Zielscheiben, passend zum
      // Zielscheiben-Thema der Wort-Kanone — jede Zielscheibe trägt einen Buchstaben mittig.
      const KN_TITLE_LETTERS = ["W", "O", "R", "T", "K", "A", "N", "O", "N", "E"];
      const targetR = 18;
      const step = targetR * 2 + 4;
      const titleSvg = `<svg viewBox="0 0 ${step * KN_TITLE_LETTERS.length + 8} ${targetR * 2 + 10}" style="width:100%; max-width:400px; height:auto;">
        ${KN_TITLE_LETTERS.map((letter, i) => {
          const cx = 8 + targetR + i * step;
          const cy = targetR + 5;
          return `<g>
            <circle cx="${cx}" cy="${cy}" r="${targetR}" fill="#E85F6F"/>
            <circle cx="${cx}" cy="${cy}" r="${targetR * 0.68}" fill="#FFFFFF"/>
            <circle cx="${cx}" cy="${cy}" r="${targetR * 0.36}" fill="#E85F6F"/>
            ${handDrawnLetterGroup(letter, cx, cy + 1, 20, "#FFFFFF", 2.4)}
          </g>`;
        }).join("")}
      </svg>`;
      area.innerHTML = `
        <div class="question-card" style="text-align:center;">
          <div style="display:flex; justify-content:center;">${titleSvg}</div>
          <p class="empty-note">Tipp die FALSCHE Antwort an, bevor sie unten ankommt — die richtige Antwort darfst du NICHT treffen, einfach durchlaufen lassen! Kommt eine falsche Antwort unten an, ohne getroffen zu werden, oder triffst du versehentlich die richtige, verlierst du ein Herz. Nach 3 Fehlern ist die Runde vorbei.</p>
          <button type="button" class="btn btn-coffee" id="knStartIntroBtn" style="margin-top:14px;">▶️ Los geht's</button>
        </div>`;
      document.getElementById("knStartIntroBtn").addEventListener("click", () => { knIntroShown = true; markGameIntroSeen("wortkanone"); renderKanone(); });
      return;
    }
    if (knLives <= 0) { renderKanoneGameOver(); return; }
    if (!knRoundActive) newKanoneRound();
    // Statt NUR einem einzelnen Wort sind jetzt bis zu 3 gleichzeitig sichtbar — näher beieinander
    // positioniert (siehe newKanoneRound), wie mehrere Blätter, die etwa zur gleichen Zeit fallen.
    // Jedes bekommt beim ERSTEN Erscheinen einen Zeitstempel; bei jedem Neu-Rendern wird darüber
    // ein passender NEGATIVER animation-delay berechnet, damit die Fallbewegung nahtlos weiterläuft
    // statt bei jedem Rendern von neuem oben zu beginnen.
    // ALLE Wörter dieser Frage erscheinen von Anfang an gemeinsam (nicht nur 3 mit den restlichen
    // nachrückend) — nur mit einem SEHR kurzen Start-Versatz (max. 60ms pro Wort), damit man sie
    // wirklich gemeinsam am Himmel sieht und sofort auf alle gleichzeitig reagieren muss/kann,
    // statt dass eines lange vor den anderen erscheint.
    const visibleWords = knActiveWords.filter((w) => !w.resolved);
    const now = Date.now();
    visibleWords.forEach((w, i) => { if (!w.spawnedAt) w.spawnedAt = now - i * 60; });
    // Deutlich langsamer als vorher (war 4.5s) — bei einem kleinen Spielfeld soll genug Zeit zum
    // Lesen und Nachdenken bleiben, statt einer reinen Reflex-Reaktion.
    const FALL_DURATION = 9;
    // Auto-Land bezieht sich weiterhin auf das VORDERSTE (am längsten fallende) Wort.
    const activeWord = visibleWords[0];
    // Auto-Land: sobald ALLE noch übrigen falschen Antworten schon abgeschossen sind (egal ob
    // dann noch 1 oder mehrere richtige Wörter übrig bleiben), landen die verbleibenden richtigen
    // sofort zügig, statt einzeln auf die normale Fallzeit zu warten — "das Gute hat gewonnen,
    // sobald nichts Falsches mehr übrig ist". Sucht das richtige Wort direkt (nicht nur das
    // vorderste sichtbare), da jetzt alle Wörter gleichzeitig erscheinen und die Reihenfolge
    // nicht mehr garantiert die richtige Antwort an erster Stelle zeigt.
    const remainingUnresolved = knActiveWords.filter((w) => !w.resolved);
    const noWrongLeft = remainingUnresolved.every((w) => w.isCorrect);
    const correctStillFalling = remainingUnresolved.find((w) => w.isCorrect);
    // WICHTIG — behebt den gemeldeten Bug: die letzte übrig bleibende (richtige) Blase "fliegt
    // selbstständig herunter, aber nicht zügiger". Vorher wurde das Wort zwar sofort als korrekt
    // GEWERTET (landKanoneWord), aber das sichtbare Element behielt seine normale, langsame
    // Fall-Animation (FALL_DURATION Sekunden) bei — man musste optisch trotzdem die volle Zeit
    // abwarten, bis es unten ankam. Jetzt wird das Element zusätzlich als "schnell landend"
    // markiert, was unten in der Render-Logik eine deutlich kürzere animation-duration auslöst.
    if (!knPaused && correctStillFalling && knAutoLandLast && noWrongLeft && !correctStillFalling.autoLanding) {
      correctStillFalling.autoLanding = true;
      setTimeout(() => landKanoneWord(correctStillFalling.id, null), 450);
    }
    area.innerHTML = `
      <div class="question-card">
        ${miniBugReportBtnHtml("Wort-Kanone: " + knCurrentQuestion.prompt)}
        <p class="eyebrow">🎯 WORT-KANONE · ${knScore} Treffer <span class="subnav-info-icon" data-info="Tipp die FALSCHE Antwort an, bevor sie unten ankommt — die richtige Antwort darfst du NICHT treffen, einfach durchlaufen lassen! Kommt eine falsche Antwort unten an, ohne getroffen zu werden, oder triffst du versehentlich die richtige, verlierst du ein Herz.">ⓘ</span>
          <button type="button" class="btn btn-ghost" id="knPauseBtn" style="float:right; padding:2px 10px; font-size:0.78rem;">${knPaused ? "▶️ Weiter" : "⏸️ Pause"}</button>
        </p>
        <p class="eyebrow" style="margin-top:-6px;">${heartsLivesHtml(knLives, 3)}</p>
        <div id="knChallengeBar"></div>
        <p style="font-weight:700; margin:8px 0 12px;">${knCurrentQuestion.prompt}</p>
        <div class="kn-sky" id="knSky">
          <span class="kn-sun" aria-hidden="true">☀️</span>
          <div class="kn-clouds" id="knClouds" aria-hidden="true"></div>
          <div class="kn-scenery" aria-hidden="true">
            <span class="kn-scenery-item" style="left:2%; font-size:1rem;">🌸</span>
            <span class="kn-scenery-item" style="left:6%; font-size:3.8rem;">🏡</span>
            <span class="kn-scenery-item" style="left:20%; font-size:3.4rem;">🌳</span>
            <span class="kn-scenery-item" style="left:34%; font-size:1rem;">🍄</span>
            <span class="kn-scenery-item" style="left:68%; font-size:3.2rem;">🌳</span>
            <span class="kn-scenery-item" style="left:84%; font-size:1rem;">🍄</span>
            <span class="kn-scenery-item" style="left:92%; font-size:0.9rem;">🌸</span>
          </div>
          <div class="kn-burnt-grass" id="knBurntGrass"></div>
          ${visibleWords.map((w) => {
            const elapsed = (now - w.spawnedAt) / 1000;
            // Die Punkte-Münze fällt bewusst deutlich schneller (halbe Zeit) und kleiner als
            // normale Wörter/das Herz — echte Herausforderung statt leichter Beute.
            let duration = w.isCoinBonus ? FALL_DURATION / 2 : FALL_DURATION;
            let effectiveElapsed = elapsed;
            // WICHTIG: bei automatisch landenden Wörtern werden Dauer UND verstrichene Zeit im
            // GLEICHEN Verhältnis verkürzt (hier 1/5) — nicht nur die Dauer allein. Der negative
            // animation-delay bezieht sich relativ auf die Gesamtdauer; würde nur die Dauer
            // verkürzt, wäre der alte (große) Delay-Wert plötzlich größer als die neue Dauer, und
            // das Element würde sofort ans Animationsende TELEPORTIEREN, statt sichtbar von seiner
            // aktuellen Position aus schnell weiterzufallen. Mit beiden gleich skaliert bleibt die
            // relative Position exakt erhalten (z. B. 6 von 9 Sekunden = 66% → 1.2 von 1.8
            // Sekunden = weiterhin 66%), nur läuft der Rest jetzt 5× schneller ab.
            if (w.autoLanding) {
              const SPEED_UP = 5;
              duration = duration / SPEED_UP;
              effectiveElapsed = elapsed / SPEED_UP;
            }
            return `<button type="button" class="kn-word ${w.isBonus ? "kn-word-bonus" : ""} ${w.isCoinBonus ? "kn-word-coin" : ""}" data-wid="${w.id}" style="left:${w.xPercent}%; animation-duration:${duration}s; animation-delay:-${effectiveElapsed.toFixed(2)}s; animation-play-state:${knPaused ? "paused" : "running"};" ${knPaused ? "disabled" : ""}>${w.text}</button>`;
          }).join("")}
          <svg id="knCannon" class="kn-cannon-svg" viewBox="0 0 60 44" style="left:50%;">
            <!-- Fester Lafetten-Sockel (Räder + Stütze) — bleibt bewusst UNBEWEGT, damit klar
                 sichtbar ist: nur der Kanonenkörper selbst dreht sich, nicht die ganze Kanone. -->
            <circle cx="18" cy="38" r="5" fill="#2a1f12" stroke="#4a3419" stroke-width="1.5" />
            <circle cx="42" cy="38" r="5" fill="#2a1f12" stroke="#4a3419" stroke-width="1.5" />
            <rect x="14" y="30" width="32" height="8" rx="2" fill="#5c4429" />
            <rect x="26" y="24" width="8" height="10" fill="#4a3419" />
            <!-- Der GESAMTE Kanonenkörper (Verbindungsstück + Rohr + Zündschnur) dreht sich als
                 EIN starrer Körper um den Drehzapfen. Neu gezeichnet: kürzeres, gleichmäßig
                 dickes Rohr mit klar RUNDER, OFFENER Mündung (dunkler Ring am Ende) und zwei
                 Verstärkungsringen — eindeutig als klassische Kanone erkennbar, statt eines
                 langen, spitz zulaufenden Rohrs. -->
            <g id="knCannonBarrel" style="transform-origin:30px 27px;">
              <circle cx="30" cy="27" r="5" fill="#3a3a3a" />
              <rect x="23" y="9" width="14" height="20" rx="3" fill="#3a3a3a" stroke="#242424" stroke-width="0.6" />
              <rect x="21.5" y="14" width="17" height="3" rx="1.2" fill="#242424" />
              <rect x="21.5" y="21" width="17" height="3" rx="1.2" fill="#242424" />
              <ellipse cx="30" cy="9" rx="7" ry="3" fill="#3a3a3a" stroke="#242424" stroke-width="0.6" />
              <ellipse cx="30" cy="9" rx="4.3" ry="1.9" fill="#0d0d0d" />
            </g>
          </svg>
        </div>
        <label class="empty-note" style="display:flex; align-items:center; gap:6px; margin-top:6px; cursor:pointer;">
          <input type="checkbox" id="knAutoLandToggle" ${knAutoLandLast ? "checked" : ""} />
          <span>⏩ Letzte richtige Antwort automatisch landen lassen (schneller weiterspielen)</span>
        </label>
        <p class="empty-note" id="knFeedback" style="text-align:center; min-height:20px;"></p>
        <button type="button" class="emoji-toggle-link" id="knRestartLink" style="font-size:0.75rem;">🔄 Runde neu starten (Punkte bleiben erhalten)</button>
        ${inlineFeatureFlagToggleHtml("wortkanone_redesign")}
      </div>`;
    renderMiniChallengeBarCached("wortkanone", "wortkanone", "knChallengeBar", area, renderKanone);
    wireInlineFeatureFlagToggles(area, renderKanone);
    startKanoneCloudTimer();
    document.getElementById("knPauseBtn")?.addEventListener("click", () => {
      if (knPaused) {
        // Fortsetzen: die verstrichene Pausendauer auf JEDEN spawnedAt-Zeitstempel addieren, damit
        // die Fallposition nahtlos an derselben Stelle weiterläuft, statt beim Fortsetzen
        // plötzlich nach unten zu springen (was passieren würde, wenn spawnedAt unverändert
        // bliebe, während die reale Zeit während der Pause ja trotzdem weiterlief).
        const pausedDuration = Date.now() - knPausedAt;
        knActiveWords.forEach((w) => { if (w.spawnedAt) w.spawnedAt += pausedDuration; });
        knPaused = false;
        knPausedAt = null;
      } else {
        knPaused = true;
        knPausedAt = Date.now();
      }
      renderKanone();
    });
    area.querySelectorAll(".kn-word").forEach((btn) => {
      btn.addEventListener("click", (e) => shootKanoneWord(btn.dataset.wid, btn, e));
      btn.addEventListener("animationend", () => landKanoneWord(btn.dataset.wid, btn));
    });
    // Frei-Schuss aus Spaß: tippt man auf eine LEERE Stelle im Himmel (nicht auf ein Wort oder
    // eine Bonus-Münze), zielt die Kanone trotzdem dorthin und feuert eine Kugel mit kleiner
    // Explosion ab — rein kosmetisch, ohne jede Auswirkung auf Punkte oder Leben.
    const sky = document.getElementById("knSky");
    if (sky) {
      sky.addEventListener("click", (e) => {
        if (e.target !== sky) return; // Wort/Münze/Kanone selbst haben eigene Handler, hier nicht doppelt feuern
        const fakeTarget = { getBoundingClientRect: () => ({ left: e.clientX, top: e.clientY, width: 1, height: 1 }) };
        aimKanoneAt(fakeTarget);
        Core.sound.whistle(0.22);
        const skyRect = sky.getBoundingClientRect();
        const cannon = document.getElementById("knCannon");
        const cannonRect = cannon.getBoundingClientRect();
        const ball = document.createElement("span");
        ball.className = "kn-cannonball";
        ball.textContent = "☄️";
        const startX = cannonRect.left - skyRect.left + cannonRect.width / 2;
        const startY = cannonRect.top - skyRect.top;
        ball.style.left = `${startX}px`;
        ball.style.top = `${startY}px`;
        sky.appendChild(ball);
        const targetX = e.clientX - skyRect.left;
        const targetY = e.clientY - skyRect.top;
        const dx = targetX - startX, dy = targetY - startY;
        const flightAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 45;
        requestAnimationFrame(() => {
          ball.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${flightAngleDeg}deg)`;
        });
        setTimeout(() => {
          ball.remove();
          const fx = document.createElement("span");
          fx.className = "kn-explosion-fx";
          fx.textContent = "💥";
          fx.style.left = `${targetX}px`;
          fx.style.top = `${targetY}px`;
          sky.appendChild(fx);
          setTimeout(() => fx.remove(), 650);
        }, 220);
      });
    }
    document.getElementById("knAutoLandToggle")?.addEventListener("change", (e) => {
      knAutoLandLast = e.target.checked;
      Backend.updateExtraProfileField("knAutoLandPref", knAutoLandLast);
    });
    document.getElementById("knRestartLink")?.addEventListener("click", () => {
      // Nur die aktuelle, evtl. feststeckende Runde neu aufbauen — Punktestand und Leben bleiben
      // unangetastet, das ist bewusst kein "alles auf null zurücksetzen".
      newKanoneRound();
      renderKanone();
    });
  }
  // Kanonenrohr dreht sich zur angetippten Stelle, bevor die Kugel "abgefeuert" wird — macht die
  // Kanone lebendig statt nur ein statisches Deko-Element zu sein.
  function aimKanoneAt(btn) {
    const sky = document.getElementById("knSky");
    const cannon = document.getElementById("knCannon");
    const barrel = document.getElementById("knCannonBarrel");
    if (!sky || !cannon || !barrel || !btn) return;
    const skyRect = sky.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const cannonRect = cannon.getBoundingClientRect();
    const dx = (btnRect.left + btnRect.width / 2) - (cannonRect.left + cannonRect.width / 2);
    const dy = (btnRect.top + btnRect.height / 2) - (cannonRect.top + cannonRect.height / 2);
    const angleDeg = Math.max(-70, Math.min(70, (Math.atan2(dx, -dy) * 180) / Math.PI));
    barrel.style.transform = `rotate(${angleDeg}deg)`;
  }
  // Kleine Kanonenkugel, die vom Kanonenrohr zum getroffenen Wort fliegt — erst BEI EINSCHLAG
  // kommt die Explosion, nicht sofort beim Antippen.
  function fireKanoneBall(btn, onImpact) {
    const sky = document.getElementById("knSky");
    const cannon = document.getElementById("knCannon");
    if (!sky || !cannon || !btn) { onImpact(); return; }
    Core.sound.whistle(0.22); // Pfeifgeräusch, exakt synchron zur 220ms-Flugzeit der Kugel unten
    const skyRect = sky.getBoundingClientRect();
    const cannonRect = cannon.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const ball = document.createElement("span");
    ball.className = "kn-cannonball";
    ball.textContent = "☄️";
    ball.style.left = `${cannonRect.left - skyRect.left + cannonRect.width / 2}px`;
    ball.style.top = `${cannonRect.top - skyRect.top}px`;
    sky.appendChild(ball);
    const targetX = btnRect.left - skyRect.left + btnRect.width / 2;
    const targetY = btnRect.top - skyRect.top + btnRect.height / 2;
    const startX = cannonRect.left - skyRect.left + cannonRect.width / 2;
    const startY = cannonRect.top - skyRect.top;
    const dx = targetX - startX;
    const dy = targetY - startY;
    // Das ☄️-Symbol zeigt von Natur aus mit dem "Kopf" nach oben rechts und dem Schweif nach
    // unten links (ca. -45°). Damit der Schweif immer sichtbar aus Richtung der Kanone kommt (wo
    // die Kugel ja tatsächlich herkommt), statt einfach fest seitlich zu hängen, wird die Drehung
    // an die TATSÄCHLICHE Flugrichtung angepasst — die Kugel "zeigt" dorthin, wo sie hinfliegt.
    const flightAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 45;
    requestAnimationFrame(() => {
      ball.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${flightAngleDeg}deg)`;
    });
    setTimeout(() => { ball.remove(); onImpact(); }, 220);
  }
  function shootKanoneWord(wid, btn, event) {
    const word = knActiveWords.find((w) => w.id === wid);
    if (!word || word.resolved) return;
    word.resolved = true;
    btn.style.pointerEvents = "none";
    btn.style.animationPlayState = "paused";
    aimKanoneAt(btn);
    const fb = document.getElementById("knFeedback");
    fireKanoneBall(btn, () => {
      if (word.isBonus) {
        if (word.isCoinBonus) {
          // Punkte-Münze getroffen: extra Punkte statt Herz — eigener, "reicherer" Sound zur
          // Unterscheidung vom Herz-Bonus.
          knScore += 3;
          Core.sound.correct();
          spawnKanoneExplosion(btn);
          btn.classList.add("kn-word-dissolve");
          fb.textContent = "🪙 +3 Bonus-Punkte!";
          checkKanoneRoundDone();
          return;
        }
        // Bonus-Sprechblase getroffen: Herz zurück (bis maximal 3), eigener, positiver Sound und
        // Rückmeldung — zählt NICHT als Treffer/Fehlschuss bei der eigentlichen Aufgabe.
        knLives = Math.min(3, knLives + 1);
        Core.sound.correct();
        spawnKanoneExplosion(btn);
        btn.classList.add("kn-word-dissolve");
        fb.textContent = `❤️ Herz aufgefüllt! (${knLives} ❤️)`;
        checkKanoneRoundDone();
        return;
      }
      if (word.isCorrect) {
        // Versehentlich die richtige Antwort getroffen: ERST Explosion+Feuer (wie beim echten
        // Treffer), DANN erst — leicht verzögert — der zweisilbige Fehler-Sound. So merkt man
        // sofort "getroffen", und kurz danach "das war aber falsch".
        word.wasWronglyShot = true;
        knLives -= 1;
        knMistakes += 1;
        Core.sound.explosion();
        spawnKanoneExplosion(btn);
        btn.classList.add("kn-word-wrong-hit");
        setTimeout(() => Core.sound.zonk(), 320);
        fb.textContent = `⚠️ Das war die richtige Antwort! (${knLives} ❤️ übrig)`;
      } else {
        knScore += 1;
        Core.sound.explosion();
        spawnKanoneExplosion(btn);
        btn.classList.add("kn-word-dissolve");
        fb.textContent = "💥 Volltreffer!";
      }
      checkKanoneRoundDone();
    });
  }
  // Kurzer 🔥-Explosionseffekt genau an der Stelle des getroffenen Worts — verschwindet nach
  // der Animation von selbst wieder.
  function spawnKanoneExplosion(btn) {
    const sky = document.getElementById("knSky");
    if (!sky) return;
    sky.classList.add("kn-firing");
    setTimeout(() => sky.classList.remove("kn-firing"), 150);
    const skyRect = sky.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const fx = document.createElement("span");
    fx.className = "kn-explosion-fx";
    fx.textContent = "💥";
    fx.style.left = `${btnRect.left - skyRect.left + btnRect.width / 2}px`;
    fx.style.top = `${btnRect.top - skyRect.top + btnRect.height / 2}px`;
    sky.appendChild(fx);
    setTimeout(() => fx.remove(), 700);
  }
  function landKanoneWord(wid, btn) {
    const word = knActiveWords.find((w) => w.id === wid);
    if (!word || word.resolved) return;
    word.resolved = true;
    const fb = document.getElementById("knFeedback");
    if (word.isBonus) {
      // Bonus-Sprechblase/Münze einfach ungenutzt durchgelassen — keine Strafe, sie war
      // schließlich freiwillig, kein Fehler, nur eine verpasste Chance.
      if (btn) btn.style.opacity = "0.4";
      fb.textContent = word.isCoinBonus ? "🪙 Münze verpasst — kein Problem, war nur freiwillig." : "❤️ Bonus verpasst — kein Problem, war nur freiwillig.";
      checkKanoneRoundDone();
      return;
    }
    if (word.isCorrect) {
      // Richtige Antwort unten angekommen, ohne getroffen zu werden — genau richtig gemacht,
      // wird grün markiert als positive Rückmeldung.
      if (btn) btn.classList.add("kn-word-landed-good");
      Core.sound.correct();
      fb.textContent = "✅ Richtige Antwort sicher unten angekommen!";
    } else {
      // Falsche Antwort durchgekommen, ohne abgeschossen zu werden — rot markiert plus einem
      // deutlich "böseren", intensiveren Fehler-Sound (zweisilbiger Buzzer statt einfachem Ton) —
      // das ist schließlich der schlimmste Fall im Spiel, ein Herzverlust.
      if (btn) btn.classList.add("kn-word-landed-bad");
      knLives -= 1;
      knMistakes += 1;
      Core.sound.zonk();
      fb.textContent = `⚠️ Falsche Antwort durchgekommen! (${knLives} ❤️ übrig)`;
      burnKanoneGrass(word.xPercent);
    }
    checkKanoneRoundDone();
  }
  // Jede durchgekommene falsche Antwort "verbrennt" die Stelle, an der sie gelandet ist — 3–4
  // Flammen um genau diese X-Position herum, jede mit eigener, KONTINUIERLICHER Flacker-Animation
  // (Größe, Transparenz, leichte seitliche Verschiebung — nicht nur einmalig zufällig, sondern
  // laufend), dazu eine dauerhafte, rötliche Verbrennungs-Färbung genau an dieser Stelle im Boden.
  function burnKanoneGrass(xPercent) {
    const grass = document.getElementById("knBurntGrass");
    if (!grass) return;
    const centerX = typeof xPercent === "number" ? xPercent : 50;
    // Verbrannte Boden-Färbung genau an der Einschlagsstelle — bleibt dauerhaft liegen.
    const scorch = document.createElement("span");
    scorch.className = "kn-scorch-mark";
    scorch.style.left = `${centerX}%`;
    grass.appendChild(scorch);
    const flameCount = 3 + Math.floor(Math.random() * 2); // 3–4 Flammen um die Einschlagsstelle
    for (let i = 0; i < flameCount; i++) {
      const flame = document.createElement("span");
      flame.className = "kn-burnt-grass-flame";
      flame.textContent = "🔥";
      // Mehrere Flammen NEBENEINANDER um die X-Position der Einschlagsstelle verteilt, nicht
      // exakt übereinander — jede mit eigener, zufälliger Verzögerung/Dauer, damit sie NICHT
      // synchron flackern (das würde künstlich wirken).
      const offset = (i - (flameCount - 1) / 2) * (5 + Math.random() * 3);
      flame.style.left = `${centerX + offset}%`;
      flame.style.setProperty("--flame-base-scale", (0.85 + Math.random() * 0.4).toFixed(2));
      flame.style.animationDuration = `${(0.5 + Math.random() * 0.4).toFixed(2)}s`;
      flame.style.animationDelay = `-${(Math.random() * 0.5).toFixed(2)}s`;
      if (Math.random() < 0.5) flame.style.setProperty("--flame-mirror", "-1");
      grass.appendChild(flame);
    }
  }
  function checkKanoneRoundDone() {
    // Ist die richtige Antwort bereits SICHER gelandet (durchgekommen, nicht versehentlich
    // abgeschossen), macht es keinen Sinn mehr, noch auf die übrigen falschen Antworten zu
    // warten — die Aufgabe ist ja schon bewiesen gelöst. Die Runde endet dann sofort, statt
    // sinnlos weiterzulaufen.
    const correctWord = knActiveWords.find((w) => w.isCorrect);
    const correctSafelyLanded = correctWord && correctWord.resolved && !correctWord.wasWronglyShot;
    if (correctSafelyLanded) {
      knRoundActive = false;
      // WICHTIG: renderKanoneGameOver() aufrufen, NICHT nur renderKanone() — sonst blieb das
      // Spiel bei aufgebrauchten Leben einfach in der letzten Szene stehen, ohne dass jemals eine
      // Endauswertung erschien (genau das gemeldete "am Ende gibt es keine Auswertung").
      if (knLives <= 0) { setTimeout(renderKanoneGameOver, 900); return; }
      setTimeout(() => { newKanoneRound(); renderKanone(); }, 900);
      return;
    }
    if (!knActiveWords.every((w) => w.resolved)) {
      // Runde noch nicht komplett — das NÄCHSTE Wort muss erscheinen (bei nur einem gleichzeitig
      // sichtbaren Wort passiert das sonst nie von selbst, das Spiel würde hier für immer hängen
      // bleiben). Kurze Pause, damit die Auflösungs-Animation des gerade geschossenen Worts noch
      // zu sehen ist, bevor das nächste reinfällt.
      if (knLives > 0) setTimeout(renderKanone, 600);
      else setTimeout(renderKanoneGameOver, 900);
      return;
    }
    knRoundActive = false;
    if (knLives <= 0) { setTimeout(renderKanoneGameOver, 900); return; }
    setTimeout(() => { newKanoneRound(); renderKanone(); }, 1100);
  }
  // ===== Alte, bisher live laufende Wort-Kanone-Version — bleibt für alle Nutzer unverändert
  // erreichbar, bis "wortkanone_redesign" freigegeben wird. Eigene Funktionsnamen, damit sie
  // nicht mit der neuen Version kollidiert. =====
  function renderKanoneOld() {
    const area = document.getElementById("kanoneArea");
    if (!area) return;
    // WICHTIG — behebt den gemeldeten Bug: diese ältere Version (die die meisten Nutzer sehen, da
    // das Redesign nur für Betreiber/Beta-Tester:innen aktiv ist) hatte bisher GAR KEIN Intro —
    // sie startete sofort mit dem Spielfeld. Nutzt dieselbe hasSeenGameIntro()-Prüfung wie die
    // neue Version, damit auch hier zuerst kurz erklärt wird, wie das Spiel funktioniert.
    if (!knIntroShown && !hasSeenGameIntro("wortkanone")) {
      // Dieselbe SVG-Zielscheiben-Titel-Logik wie im Redesign (keine Systemschrift, keine Emojis) —
      // konsistent, egal welche der beiden Versionen man gerade sieht.
      const KN_OLD_TITLE_LETTERS = ["W", "O", "R", "T", "K", "A", "N", "O", "N", "E"];
      const targetROld = 16;
      const stepOld = targetROld * 2 + 3;
      const titleSvgOld = `<svg viewBox="0 0 ${stepOld * KN_OLD_TITLE_LETTERS.length + 6} ${targetROld * 2 + 8}" style="width:100%; max-width:380px; height:auto;">
        ${KN_OLD_TITLE_LETTERS.map((letter, i) => {
          const cx = 6 + targetROld + i * stepOld;
          const cy = targetROld + 4;
          return `<g>
            <circle cx="${cx}" cy="${cy}" r="${targetROld}" fill="#E85F6F"/>
            <circle cx="${cx}" cy="${cy}" r="${targetROld * 0.68}" fill="#FFFFFF"/>
            <circle cx="${cx}" cy="${cy}" r="${targetROld * 0.36}" fill="#E85F6F"/>
            ${handDrawnLetterGroup(letter, cx, cy + 1, 17, "#FFFFFF", 2.2)}
          </g>`;
        }).join("")}
      </svg>`;
      area.innerHTML = `
        <div class="question-card" style="text-align:center;">
          <div style="display:flex; justify-content:center;">${titleSvgOld}</div>
          <p class="empty-note" style="margin-top:10px;">Tipp die FALSCHE Antwort an, bevor sie unten ankommt — die richtige Antwort darfst du NICHT treffen, einfach durchlaufen lassen! Kommt eine falsche Antwort unten an, ohne getroffen zu werden, oder triffst du versehentlich die richtige, verlierst du ein Herz. Nach 3 Fehlern ist die Runde vorbei.</p>
          <button type="button" class="btn btn-coffee" id="knOldStartIntroBtn" style="margin-top:14px;">▶️ Los geht's</button>
        </div>`;
      document.getElementById("knOldStartIntroBtn").addEventListener("click", () => { knIntroShown = true; markGameIntroSeen("wortkanone"); renderKanoneOld(); });
      return;
    }
    if (knLives <= 0) { renderKanoneGameOver(); return; }
    if (!knRoundActive) newKanoneRound();
    const n = knActiveWords.length;
    area.innerHTML = `
      <div class="question-card">
        ${miniBugReportBtnHtml("Wort-Kanone: " + knCurrentQuestion.prompt)}
        <p class="eyebrow">🎯 WORT-KANONE · ${knScore} Treffer <span class="subnav-info-icon" data-info="Tipp die FALSCHEN Antworten an, bevor sie unten ankommen — die richtige Antwort darfst du NICHT treffen! Kommt eine falsche Antwort unten an, ohne getroffen zu werden, oder triffst du versehentlich die richtige, verlierst du ein Herz.">ⓘ</span></p>
        <p class="eyebrow" style="margin-top:-6px;">${heartsLivesHtml(knLives, 3)}</p>
        <div id="knChallengeBar"></div>
        <p style="font-weight:700; margin:8px 0 12px;">${knCurrentQuestion.prompt}</p>
        <div class="kn-sky kn-sky-old" id="knSky">
          ${knActiveWords.map((w, i) => `<button type="button" class="kn-word kn-word-old" data-wid="${w.id}" style="left:${(100 / (n + 1)) * (i + 1)}%; animation-duration:${7 + n}s; animation-delay:${i * 0.9}s;">${w.text}</button>`).join("")}
        </div>
        <p class="empty-note" id="knFeedback" style="text-align:center; min-height:20px;"></p>
        ${inlineFeatureFlagToggleHtml("wortkanone_redesign")}
      </div>`;
    renderMiniChallengeBarCached("wortkanone", "wortkanone", "knChallengeBar", area, renderKanoneOld);
    wireInlineFeatureFlagToggles(area, renderKanone);
    area.querySelectorAll(".kn-word-old").forEach((btn) => {
      btn.addEventListener("click", () => shootKanoneWordOld(btn.dataset.wid, btn));
      btn.addEventListener("animationend", () => landKanoneWordOld(btn.dataset.wid, btn));
    });
  }
  function shootKanoneWordOld(wid, btn) {
    const word = knActiveWords.find((w) => w.id === wid);
    if (!word || word.resolved) return;
    word.resolved = true;
    btn.style.pointerEvents = "none";
    btn.style.animationPlayState = "paused";
    const fb = document.getElementById("knFeedback");
    if (word.isCorrect) {
      knLives -= 1;
      Core.sound.wrong();
      btn.style.background = "#FBDCDC";
      fb.textContent = `⚠️ Das war die richtige Antwort! (${knLives} ❤️ übrig)`;
    } else {
      knScore += 1;
      Core.sound.explosion();
      spawnKanoneExplosion(btn);
      btn.style.background = "#DFF3E5";
      fb.textContent = "💥 Volltreffer!";
    }
    btn.classList.add("kn-shot");
    checkKanoneRoundDoneOld();
  }
  function landKanoneWordOld(wid, btn) {
    const word = knActiveWords.find((w) => w.id === wid);
    if (!word || word.resolved) return;
    word.resolved = true;
    const fb = document.getElementById("knFeedback");
    if (word.isCorrect) {
      fb.textContent = "✅ Richtige Antwort sicher unten angekommen!";
    } else {
      knLives -= 1;
      Core.sound.wrong();
      fb.textContent = `⚠️ Falsche Antwort durchgekommen! (${knLives} ❤️ übrig)`;
    }
    checkKanoneRoundDoneOld();
  }
  function checkKanoneRoundDoneOld() {
    if (!knActiveWords.every((w) => w.resolved)) return;
    knRoundActive = false;
    if (knLives <= 0) { setTimeout(renderKanoneOld, 900); return; }
    setTimeout(() => { newKanoneRound(); renderKanoneOld(); }, 1100);
  }
  // Herzen-Anzeige mit festen 3 Plätzen — verlorene Herzen bleiben als leerer Umriss sichtbar
  // (statt einfach zu verschwinden), damit klar ist, dass dort vorher eins war.
  const HEART_SVG_PATH = "M12 21 C12 21 3 14.5 3 8.5 C3 5.5 5.5 3 8.5 3 C10 3 11.3 3.7 12 4.8 C12.7 3.7 14 3 15.5 3 C18.5 3 21 5.5 21 8.5 C21 14.5 12 21 12 21 Z";
  function heartsLivesHtml(lives, maxLives) {
    return Array.from({ length: maxLives }, (_, i) => {
      const filled = i < lives;
      return `<svg width="20" height="20" viewBox="0 0 24 24" style="vertical-align:middle;">
        <path d="${HEART_SVG_PATH}" fill="${filled ? "#e85f6f" : "none"}" stroke="#e85f6f" stroke-width="${filled ? 0 : 1.6}" opacity="${filled ? 1 : 0.55}" />
      </svg>`;
    }).join("");
  }
  function renderKanoneGameOver() {
    // Echte Bewertung statt nur der reinen Trefferzahl — Genauigkeit aus Treffern vs. Fehlern
    // berechnet, mit einer passenden Einstufung von "Übung macht den Meister" bis "Scharfschütze".
    // WICHTIG: diese Berechnung steht jetzt VOR dem einmaligen Abschluss-Block unten, damit der
    // Genauigkeitswert auch für die Herausforderungs-Meldung (submitChallengeResult) verfügbar ist.
    const totalAttempts = knScore + knMistakes;
    const accuracy = totalAttempts > 0 ? Math.round((knScore / totalAttempts) * 100) : 0;
    // Nur beim ERSTEN Anzeigen dieser beendeten Runde Sound abspielen und Punkte vergeben — nicht
    // erneut, nur weil man zu einem anderen Spiel wechselt und zurückkommt (das Panel "schließt"
    // sich dadurch bewusst nicht wirklich, man sieht einfach weiterhin den Abschluss-Bildschirm,
    // bis man aktiv "Neue Runde" antippt).
    if (!knGameOverFinalized) {
      knGameOverFinalized = true;
      Core.sound.fail();
      if (Backend.currentUser() && knScore > 0) {
        saveResultAndCheck({ categories: ["wortkanone"], points: knScore, bonus: 0, percent: 100, character: "Wort-Scharfschütze:in", badges: [], playedAt: new Date().toISOString() });
      }
      // WICHTIG — behebt den gemeldeten Bug: bisher wurde eine über eine Herausforderung
      // gestartete Wort-Kanone-Runde NIE ans Backend zurückgemeldet. Die Herausforderung blieb
      // dadurch für immer als "eingehend" markiert (die Erinnerung/das farbige Blinken verschwand
      // nie, egal wie oft man "annahm" und spielte), und der/die Herausforderer:in sah nie ein
      // Ergebnis. activeGameChallengeId wird beim Annehmen gesetzt (siehe gameRouting) und hier,
      // sobald die Runde tatsächlich zu Ende ist, ausgewertet und wieder zurückgesetzt.
      if (activeGameChallengeId) {
        Backend.submitChallengeResult(activeGameChallengeId, { percent: accuracy });
        activeGameChallengeId = null;
      }
    }
    const area = document.getElementById("kanoneArea");
    let rating;
    if (knScore === 0) rating = "🌱 Erster Versuch — nächstes Mal klappt's besser!";
    else if (accuracy >= 90) rating = "🎯 Scharfschütze:in! Fast alles getroffen.";
    else if (accuracy >= 70) rating = "💪 Richtig stark — sehr gute Trefferquote!";
    else if (accuracy >= 50) rating = "👍 Solide Runde — schon über die Hälfte getroffen.";
    else rating = "🌱 Übung macht den Meister — weiter dran bleiben!";
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p style="font-size:2.5rem;">🎯</p>
        <h2 style="margin:8px 0;">Runde beendet!</h2>
        ${starRatingArcHtml(accuracy)}
        <p class="empty-note">Du hast <strong>${knScore}</strong> falsche Antworten korrekt abgeschossen${totalAttempts > 0 ? ` (${accuracy}% Genauigkeit)` : ""}.</p>
        <p style="font-weight:700; margin-top:8px;">${rating}</p>
        <button type="button" class="btn btn-coffee" id="knRetryBtn" style="margin-top:14px;">🔄 Neue Runde</button>
      </div>`;
    document.getElementById("knRetryBtn").addEventListener("click", () => { newKanoneGame(); renderKanone(); });
  }
  document.querySelector('#learnSubnav [data-sub="sub-kanone"]')?.addEventListener("click", () => {
    // Häkchen dauerhaft aus dem Profil laden (nicht nur für diese Sitzung merken) — bleibt so
    // erhalten, auch nach einem Neuladen der Seite oder erneutem Login.
    const profile = Backend.currentProfile();
    const saved = profile?.extraProfileData?.knAutoLandPref;
    if (saved !== undefined) knAutoLandLast = saved;
    if (!knCurrentQuestion) newKanoneGame();
    renderKanone();
  });

  /* ===== Wer bin ich?: Emoji-Rätsel — Beruf/Rolle anhand von 2-3 Emojis erraten. Entweder frei
     eintippen (ohne Vorgabe, wie gewünscht) oder auf Wunsch aus 4 Antworten wählen. ===== */
  let wbiSession = null; // { round, total, correct }
  let wbiResultsFinalized = false;
  let wbiCurrentItem = null;
  let wbiUsedItems = [];
  let wbiTypeMode = false; // Standard: 4 Antworten zur Auswahl (freies Tippen ist zu schwer als Standard) — true = frei eintippen
  function newWerBinIchSession() {
    wbiSession = { round: 0, total: 10, correct: 0 };
    wbiUsedItems = [];
  }
  function newWerBinIchRound() {
    let pool = ExerciseData.WER_BIN_ICH.filter((it) => !wbiUsedItems.includes(it[0]));
    if (pool.length === 0) { wbiUsedItems = []; pool = ExerciseData.WER_BIN_ICH; }
    wbiCurrentItem = pool[Math.floor(Math.random() * pool.length)];
    wbiUsedItems.push(wbiCurrentItem[0]);
  }
  function renderWerBinIchResults() {
    const area = document.getElementById("werbinichArea");
    const percent = wbiSession.total > 0 ? Math.round((wbiSession.correct / wbiSession.total) * 100) : 0;
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p class="eyebrow">❓ WER BIN ICH? — SITZUNG FERTIG</p>
        <p style="font-size:2rem; margin:8px 0;">🎉</p>
        <h2 style="margin:8px 0;">${wbiSession.correct} / ${wbiSession.total} richtig erraten!</h2>
        ${starRatingArcHtml(percent)}
        <button type="button" class="btn btn-coffee" id="wbiPlayAgainBtn" style="margin-top:14px;">🔄 Neue Runden</button>
      </div>`;
    document.getElementById("wbiPlayAgainBtn").addEventListener("click", () => { wbiResultsFinalized = false; newWerBinIchSession(); newWerBinIchRound(); renderWerBinIch(); });
    // WICHTIG: Einmal-Absicherung ergänzt — vorher fehlte sie hier komplett, sodass ein Wechsel zu
    // einem anderen Spiel und zurück (was diese Funktion erneut aufruft) die Punkte jedes Mal
    // erneut vergab.
    if (!wbiResultsFinalized) {
      wbiResultsFinalized = true;
      if (Backend.currentUser()) {
        saveResultAndCheck({ categories: ["werbinich"], points: wbiSession.correct, bonus: 0, percent, character: "Rätsel-Detektiv:in", badges: [], playedAt: new Date().toISOString() });
        if (activeGameChallengeId) { Backend.submitChallengeResult(activeGameChallengeId, { percent }); activeGameChallengeId = null; }
      }
    }
  }
  function renderWerBinIch() {
    const area = document.getElementById("werbinichArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "werbinich_aktiv", "Wer bin ich?", "❓", true)) return;
    if (!wbiSession) newWerBinIchSession();
    if (wbiSession.round >= wbiSession.total) { renderWerBinIchResults(); return; }
    if (!wbiCurrentItem) newWerBinIchRound();
    const [emojis, correct, wrongs] = wbiCurrentItem;
    const choiceOpts = wbiTypeMode ? [] : Core.shuffle([correct, ...wrongs]);
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        ${miniBugReportBtnHtml("Wer bin ich: " + correct)}
        <p class="eyebrow">❓ WER BIN ICH? · RUNDE ${wbiSession.round + 1} / ${wbiSession.total}</p>
        <div id="wbiChallengeBar"></div>
        <label class="quiz-actions" style="justify-content:center; margin-bottom:10px; gap:8px; cursor:pointer; font-size:0.8rem;">
          <input type="checkbox" id="wbiModeToggle" ${wbiTypeMode ? "checked" : ""} />
          <span>Stattdessen selbst eintippen (schwieriger)</span>
        </label>
        <p style="font-size:2.8rem; margin:16px 0;">${emojis}</p>
        ${wbiTypeMode ? `
          <div class="form-field" style="max-width:260px; margin:0 auto;">
            <input type="text" id="wbiTypeInput" placeholder="Wer oder was ist das?" autocomplete="off" />
          </div>
          <button type="button" class="btn btn-coffee" id="wbiSubmitBtn" style="margin-top:10px;">Antworten</button>
        ` : `
          <div class="option-list">
            ${choiceOpts.map((opt, i) => `<button type="button" class="option-btn wbi-choice-btn" data-idx="${i}"><span>${opt}</span></button>`).join("")}
          </div>
        `}
        <p class="empty-note" id="wbiFeedback" style="margin-top:10px; min-height:20px;"></p>
      </div>`;
    renderMiniChallengeBarCached("werbinich", "werbinich", "wbiChallengeBar", area, renderWerBinIch);
    document.getElementById("wbiModeToggle")?.addEventListener("change", (e) => { wbiTypeMode = e.target.checked; renderWerBinIch(); });
    document.getElementById("wbiSubmitBtn")?.addEventListener("click", () => {
      const val = document.getElementById("wbiTypeInput").value;
      checkWerBinIch(val.trim().toLowerCase() === correct.toLowerCase());
    });
    document.getElementById("wbiTypeInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") document.getElementById("wbiSubmitBtn").click();
    });
    area.querySelectorAll(".wbi-choice-btn").forEach((btn) => {
      btn.addEventListener("click", () => checkWerBinIch(choiceOpts[Number(btn.dataset.idx)] === correct));
    });
  }
  function checkWerBinIch(isCorrect) {
    const [, correct] = wbiCurrentItem;
    const fb = document.getElementById("wbiFeedback");
    wbiSession.round += 1;
    if (isCorrect) {
      wbiSession.correct += 1;
      Core.sound.correct();
      fb.innerHTML = `<strong style="color:#3E9A6E;">✅ Richtig!</strong> Das war „${correct}“.`;
    } else {
      Core.sound.wrong();
      fb.innerHTML = `<strong style="color:#E85F6F;">Nicht ganz.</strong> Richtig wäre: „${correct}“.`;
    }
    document.getElementById("wbiSubmitBtn")?.setAttribute("disabled", "true");
    document.querySelectorAll(".wbi-choice-btn").forEach((b) => { b.disabled = true; });
    setTimeout(() => { newWerBinIchRound(); renderWerBinIch(); }, 2200);
  }
  document.querySelector('#learnSubnav [data-sub="sub-werbinich"]')?.addEventListener("click", () => {
    if (!wbiCurrentItem) newWerBinIchRound();
    renderWerBinIch();
  });

  let wbSession = null; // { round, total, points, bonus }
  const WB_TIERS = [
    { max: 3, title: "Buchstaben-Anfänger:in" }, { max: 6, title: "Wort-Entdecker:in" },
    { max: 8, title: "Wortbaumeister:in" }, { max: 10, title: "Buchstaben-Rätselkönig:in" },
  ];
  function newWordbuildSession() {
    wbSession = { round: 0, total: 10, points: 0, bonus: 0, playedWords: [] };
  }
  let wbDifficulty = "mittel"; // "leicht" | "mittel" | "schwer"
  function newWordbuildRound() {
    // LEICHT: kurze Wörter, fast alles schon vorgegeben (nur 1-2 Buchstaben fehlen).
    // MITTEL: normale Wörter, wie bisher (~35% vorgegeben).
    // SCHWER: entweder lange Wörter mit wenig Vorgabe, oder eine ganze Redewendung/ein ganzer
    // Satz (wie früher beim Glücksrad) — dabei bleiben Leerzeichen zwischen den Wörtern immer
    // schon sichtbar, nur echte Buchstaben müssen gefunden werden.
    let word, clue, isPhrase = false;
    if (wbDifficulty === "schwer" && Math.random() < 0.4 && ExerciseData.REDEWENDUNGEN?.length) {
      const entry = ExerciseData.REDEWENDUNGEN[Math.floor(Math.random() * ExerciseData.REDEWENDUNGEN.length)];
      word = entry[0].replace(/\.$/, "");
      clue = entry[1];
      isPhrase = true;
    } else {
      const entries = Object.entries(ExerciseData.WORD_MEANINGS).filter(([w]) => {
        if (wbDifficulty === "leicht") return w.length <= 7;
        if (wbDifficulty === "schwer") return w.length >= 8;
        return true;
      });
      const pool = entries.length ? entries : Object.entries(ExerciseData.WORD_MEANINGS);
      [word, clue] = pool[Math.floor(Math.random() * pool.length)];
    }
    const upper = word.toUpperCase();
    const letters = upper.split("");
    const revealFraction = wbDifficulty === "leicht" ? 0.75 : wbDifficulty === "schwer" ? 0.2 : 0.35;
    const letterIdxs = letters.map((ch, i) => i).filter((i) => letters[i] !== " ");
    const revealCount = Math.max(isPhrase ? 1 : 2, Math.min(letterIdxs.length - 1, Math.round(letterIdxs.length * revealFraction)));
    const revealPositions = new Set();
    while (revealPositions.size < revealCount) {
      revealPositions.add(letterIdxs[Math.floor(Math.random() * letterIdxs.length)]);
    }
    // Leerzeichen (bei Redewendungen) sind immer schon "aufgedeckt" -- niemand muss ein Leerzeichen suchen.
    letters.forEach((ch, i) => { if (ch === " ") revealPositions.add(i); });
    const pool = Core.shuffle(letterIdxs.filter((i) => !revealPositions.has(i)).map((i) => ({ ch: letters[i], id: Core.uid(), used: false })));
    wbState = {
      word: upper, clue, revealPositions, isPhrase,
      slots: letters.map((ch, i) => (revealPositions.has(i) ? ch : null)),
      pool,
      startedAt: Date.now(),
      finished: false,
      wrongFlash: false,
    };
  }
  function renderWordbuildResults() {
    const area = document.getElementById("wordbuildArea");
    const percent = Math.round((wbSession.points / wbSession.total) * 100);
    const tier = WB_TIERS.find((t) => wbSession.points <= t.max) || WB_TIERS[WB_TIERS.length - 1];
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p class="eyebrow">🔤 WORTBAUSTELLE — RUNDE FERTIG</p>
        <h2 style="margin:8px 0;">${wbSession.points} / ${wbSession.total} richtig</h2>
        <p style="font-size:1.1rem; font-weight:700; color:var(--amber-400);">${tier.title}</p>
        ${wbSession.bonus ? `<p class="empty-note">+ ${wbSession.bonus} Tempo-Bonus</p>` : ""}
        <button type="button" class="btn btn-coffee" id="wbPlayAgainBtn" style="margin-top:14px;">🔄 Neue Runde</button>
      </div>
    `;
    // WICHTIG — behebt den echten Bug: eine über eine Herausforderung gestartete Runde wurde
    // bisher nie ans Backend zurückgemeldet, siehe activeGameChallengeId (gameRouting).
    if (activeGameChallengeId) { Backend.submitChallengeResult(activeGameChallengeId, { percent }); activeGameChallengeId = null; }
    document.getElementById("wbPlayAgainBtn").addEventListener("click", () => {
      newWordbuildSession(); newWordbuildRound(); renderWordbuild();
    });
  }
  function renderWordbuild() {
    const area = document.getElementById("wordbuildArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "wortbaustelle_aktiv", "Wortbaustelle", "🔤", true)) return;
    if (!wbSession) newWordbuildSession();
    if (!wbState) newWordbuildRound();
    if (wbSession.round >= wbSession.total) { renderWordbuildResults(); return; }
    const s = wbState;
    const nextEmptyIdx = s.slots.findIndex((v) => v === null);
    area.innerHTML = `
      <div class="question-card">
        <p class="eyebrow">🔤 WORTBAUSTELLE · RUNDE ${wbSession.round + 1} / ${wbSession.total}</p>
        <div id="wbChallengeBar"></div>
        <div class="trophy-case" style="margin-bottom:8px;">
          ${[["leicht", "🟢 Leicht"], ["mittel", "🟡 Mittel"], ["schwer", "🔴 Schwer"]].map(([key, label]) => `<button type="button" class="trophy-chip wb-diff-btn ${wbDifficulty === key ? "selected" : ""}" data-wb-diff="${key}">${label}</button>`).join("")}
        </div>
        <h3 style="margin-bottom:10px;">${s.clue}</h3>
        <div class="wb-slot-row" id="wbSlotRow" style="flex-wrap:wrap; ${s.slots.length > 6 ? `--wb-slot-w: ${Math.max(24, Math.floor(260 / Math.min(s.slots.length, 12)))}px; --wb-font-size: ${Math.max(0.8, 1.3 - (s.slots.length - 6) * 0.06)}rem;` : ""}">
          ${(() => {
            // In Wort-Gruppen aufteilen (an Leerzeichen), damit ein Zeilenumbruch NUR zwischen
            // Wörtern passieren kann, nie mitten in einem Wort — jede Gruppe bleibt intern
            // zusammenhängend (nowrap), nur der äußere Container darf umbrechen.
            const groups = []; let current = [];
            s.word.split("").forEach((ch, i) => {
              if (ch === " ") { groups.push(current); current = []; }
              else current.push(i);
            });
            groups.push(current);
            return groups.map((idxs) => `<div class="wb-word-group">${idxs.map((i) => `
              <div class="wb-slot ${s.slots[i] ? (s.revealPositions.has(i) ? "wb-given" : "wb-filled") : "wb-empty"} ${s.wrongFlash && i === nextEmptyIdx ? "wb-wrong" : ""}"
                   data-slot-idx="${i}" data-filled="${s.slots[i] && !s.revealPositions.has(i) ? "1" : "0"}">${s.slots[i] || ""}</div>
            `).join("")}</div>`).join("");
          })()}
        </div>
        <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
          ${s.pool.map((p) => `<button type="button" class="btn btn-ghost wb-letter-btn" data-letter-id="${p.id}" ${p.used ? "disabled style=\"opacity:0.25;\"" : ""}>${p.ch}</button>`).join("")}
        </div>
        <div class="quiz-actions" style="justify-content:center; margin-top:14px;">
          <button type="button" class="btn btn-ghost" id="wbResetBtn">↺ Zurücksetzen</button>
          <button type="button" class="btn btn-ghost" id="wbSkipBtn">Überspringen ▶</button>
        </div>
      </div>
    `;
    renderMiniChallengeBarCached("wortbaustelle", "wortbaustelle", "wbChallengeBar", area, renderWordbuild);
    // Bei einem Wort, das breiter als der verfügbare Platz ist, würde "justify-content:center" den
    // Anfang (z. B. den ersten Buchstaben) standardmäßig außerhalb des sichtbaren Bereichs
    // zentrieren, ohne dass ersichtlich ist, dass man nach links scrollen könnte — sieht dann wie
    // ein abgeschnittenes, verändertes Wort aus. Explizit auf den Anfang zurücksetzen.
    const slotRow = document.getElementById("wbSlotRow");
    if (slotRow) slotRow.scrollLeft = 0;
    area.querySelectorAll(".wb-diff-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.wbDiff === wbDifficulty) return;
        wbDifficulty = btn.dataset.wbDiff;
        newWordbuildSession();
        newWordbuildRound();
        renderWordbuild();
      });
    });
    area.querySelectorAll("[data-letter-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const p = s.pool.find((x) => x.id === btn.dataset.letterId);
        const idx = s.slots.findIndex((v) => v === null);
        if (idx === -1) return;
        if (p.ch === s.word[idx]) {
          s.slots[idx] = p.ch;
          p.used = true;
          s.wrongFlash = false;
          if (!s.slots.includes(null)) {
            s.finished = true;
            const seconds = (Date.now() - s.startedAt) / 1000;
            const speedBonus = seconds < 8 ? 1 : 0;
            wbSession.round += 1;
            wbSession.points += 1;
            wbSession.bonus += speedBonus;
            wbSession.playedWords.push(`${s.word.charAt(0)}${s.word.slice(1).toLowerCase()} — ${s.clue}`);
            Core.sound.fanfare();
            if (wbSession.round >= wbSession.total) {
              saveResultAndCheck({
                categories: ["wortbaustelle"], points: wbSession.points, bonus: wbSession.bonus, percent: Math.round((wbSession.points / wbSession.total) * 100),
                character: (WB_TIERS.find((t) => wbSession.points <= t.max) || WB_TIERS[WB_TIERS.length - 1]).title,
                badges: [], playedAt: new Date().toISOString(),
              });
              if (Backend.currentUser()) {
                const wordList = wbSession.playedWords.map((w) => `• ${w}`).join("\n");
                Backend.sendSystemMessage(Backend.currentUser().id, `📊 Du hast gerade „Wortbaustelle" gespielt — Ergebnis: ${wbSession.points} / ${wbSession.total} richtig${wbSession.bonus ? ` (+${wbSession.bonus} Tempo-Bonus)` : ""}.\n\nDiese Wörter kamen vor:\n${wordList}`);
              }
              setTimeout(() => renderWordbuild(), 900);
            } else {
              setTimeout(() => { newWordbuildRound(); renderWordbuild(); }, 900);
            }
          }
        } else {
          s.wrongFlash = true;
          Core.sound.wrong();
        }
        renderWordbuild();
      });
    });
    document.getElementById("wbResetBtn").addEventListener("click", () => {
      s.slots = s.slots.map((ch, i) => (s.revealPositions.has(i) ? ch : null));
      s.pool.forEach((p) => { p.used = false; });
      renderWordbuild();
    });
    document.getElementById("wbSkipBtn").addEventListener("click", () => {
      wbSession.round += 1;
      if (wbSession.round >= wbSession.total) { renderWordbuild(); return; }
      newWordbuildRound(); renderWordbuild();
    });
  }
  document.querySelector('#learnSubnav [data-sub="sub-wordbuild"]')?.addEventListener("click", () => {
    newWordbuildSession();
    newWordbuildRound();
    renderWordbuild();
  });

  /* ============================================================
     BUCHSTABENSALAT — mehrere Wörter im Buchstabenraster finden.
     Start- und Endzelle antippen (waagerecht oder senkrecht, auch
     rückwärts) statt echtem Ziehen — auf dem Handy zuverlässiger.
     Bonuspunkt für den richtig zugeordneten Artikel.
     ============================================================ */
  let wsState = null;
  let wsSession = null; // { found, target, bonusHits }
  const WS_TIERS = [
    { max: 3, title: "Buchstaben-Entdecker:in" }, { max: 6, title: "Wortfinder:in" },
    { max: 8, title: "Salat-Detektiv:in" }, { max: 10, title: "Rätselkönig:in" },
  ];
  function newWordSearchSession() {
    wsSession = { correctCount: 0, wordsAttempted: 0, target: 10, playedWords: [] };
  }
  function buildWordSearch() {
    const size = 11;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const candidates = Object.entries(WordbuildArtikel()).filter(([w]) => w.length <= size);
    const chosen = Core.shuffle(candidates).slice(0, 10);
    const grid = Array.from({ length: size }, () => Array(size).fill(null));
    // Alle 4 Grundrichtungen inkl. diagonal — rückwärts wird beim Prüfen der Auswahl mit abgedeckt,
    // dadurch ergeben sich effektiv alle 8 Richtungen ("kreuz und quer").
    const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
    const placed = [];
    chosen.forEach(([word, article]) => {
      const upper = word.toUpperCase();
      let ok = false;
      for (let attempt = 0; attempt < 150 && !ok; attempt++) {
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        const rowStart = dir[0] === 1 ? 0 : (dir[0] === -1 ? upper.length - 1 : 0);
        const rowEnd = dir[0] === 1 ? size - upper.length : (dir[0] === -1 ? size - 1 : size - 1);
        const colStart = dir[1] === 1 ? 0 : (dir[1] === -1 ? upper.length - 1 : 0);
        const colEnd = dir[1] === 1 ? size - upper.length : (dir[1] === -1 ? size - 1 : size - 1);
        if (rowEnd < rowStart || colEnd < colStart) continue;
        const row = rowStart + Math.floor(Math.random() * (rowEnd - rowStart + 1));
        const col = colStart + Math.floor(Math.random() * (colEnd - colStart + 1));
        let fits = true;
        for (let i = 0; i < upper.length; i++) {
          const r = row + dir[0] * i, c = col + dir[1] * i;
          if (r < 0 || r >= size || c < 0 || c >= size) { fits = false; break; }
          if (grid[r][c] && grid[r][c] !== upper[i]) { fits = false; break; }
        }
        if (!fits) continue;
        for (let i = 0; i < upper.length; i++) {
          const r = row + dir[0] * i, c = col + dir[1] * i;
          grid[r][c] = upper[i];
        }
        placed.push({ word: upper, article, row, col, dir, found: false, articleDone: false });
        ok = true;
      }
    });
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return { size, grid, words: placed, selection: [], startedAt: Date.now(), pendingArticleFor: null };
  }
  function WordbuildArtikel() {
    // Nutzt dieselbe geprüfte Wörterliste wie die Artikel-Übung, damit hier keine
    // neuen, ungeprüften Inhalte entstehen.
    const cat = ExerciseData.getCategory("artikel");
    const out = {};
    cat.getBank().forEach((q) => {
      const word = q.prompt.replace("___ ", "").trim();
      const article = q.options[q.correct[0]];
      out[word] = article;
    });
    return out;
  }
  function renderWordSearchResults() {
    const area = document.getElementById("wordsearchArea");
    const tier = WS_TIERS.find((t) => wsSession.correctCount <= t.max) || WS_TIERS[WS_TIERS.length - 1];
    const percent = wsSession.target > 0 ? Math.round((wsSession.correctCount / wsSession.target) * 100) : 0;
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p class="eyebrow">🔍 BUCHSTABENSALAT — RUNDE FERTIG</p>
        <h2 style="margin:8px 0;">${wsSession.correctCount} / ${wsSession.target} richtig gelöst</h2>
        ${starRatingArcHtml(percent)}
        <p style="font-size:1.1rem; font-weight:700; color:var(--amber-400);">${tier.title}</p>
        <button type="button" class="btn btn-coffee" id="wsPlayAgainBtn" style="margin-top:14px;">🔄 Neue Runde</button>
      </div>
    `;
    if (activeGameChallengeId) { Backend.submitChallengeResult(activeGameChallengeId, { percent }); activeGameChallengeId = null; }
    document.getElementById("wsPlayAgainBtn").addEventListener("click", () => {
      newWordSearchSession(); wsState = buildWordSearch(); renderWordSearch();
    });
  }
  function isWsHintModeOn() {
    const profile = Backend.currentProfile();
    return Boolean(profile && profile.extraProfileData && profile.extraProfileData.wsHintMode);
  }
  function setWsHintMode(on) {
    Backend.updateExtraProfileField("wsHintMode", on);
  }
  function renderWordSearch() {
    const area = document.getElementById("wordsearchArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "buchstabensalat_aktiv", "Buchstabensalat", "🔍", true)) return;
    if (!wsSession) newWordSearchSession();
    if (!wsState) wsState = buildWordSearch();
    if (wsSession.wordsAttempted >= wsSession.target) { renderWordSearchResults(); return; }
    const s = wsState;
    area.innerHTML = `
      <div class="question-card">
        <p class="eyebrow">🔍 BUCHSTABENSALAT · ${wsSession.wordsAttempted} / ${wsSession.target} WÖRTER · ${wsSession.correctCount} RICHTIG</p>
        <div id="wsChallengeBar"></div>
        <p class="empty-note wrap-words" style="margin-bottom:10px;">Erste und letzte Zelle eines Wortes antippen — waagerecht, senkrecht oder diagonal, in jede Richtung. Danach den richtigen Artikel wählen, um das Wort abzuschließen.</p>
        <div class="ws-grid" style="grid-template-columns: repeat(${s.size}, minmax(0, 1fr));">
          ${s.grid.map((row, r) => row.map((ch, c) => {
            const isSelStart = s.selection[0] && s.selection[0][0] === r && s.selection[0][1] === c;
            const isFound = s.words.some((w) => w.found && cellInWord(w, r, c, s.size));
            const isHintStart = isWsHintModeOn() && !isFound && s.words.some((w) => !w.found && w.row === r && w.col === c);
            return `<button type="button" class="ws-cell ${isSelStart ? "ws-selected" : ""} ${isFound ? "ws-found" : ""} ${isHintStart ? "ws-hint" : ""}" data-r="${r}" data-c="${c}">${ch}</button>`;
          }).join("")).join("")}
        </div>
        <div class="trophy-case" style="justify-content:center;">
          ${s.words.map((w) => `<div class="trophy-chip ${w.articleDone ? "" : "trophy-chip-locked"}">${w.articleDone ? "✅" : (w.found ? "✏️" : "🔎")} ${w.found ? w.word : "?".repeat(w.word.length)}</div>`).join("")}
        </div>
        ${s.pendingArticleFor ? `
          <div class="question-card" style="margin-top:12px; border:2px solid var(--amber-400);">
            <p style="margin:0 0 8px;">✏️ Welcher Artikel gehört zu <strong>${s.pendingArticleFor.word}</strong>?</p>
            <div style="display:flex; gap:8px; justify-content:center;">
              ${["der", "die", "das"].map((a) => `<button type="button" class="btn btn-ghost" data-article-guess="${a}">${a}</button>`).join("")}
            </div>
          </div>` : `
          <label class="quiz-actions" style="justify-content:center; margin-top:10px; gap:8px; cursor:pointer;">
            <input type="checkbox" id="wsHintToggle" ${isWsHintModeOn() ? "checked" : ""} />
            <span>💡 Anfangsbuchstaben dauerhaft anzeigen</span>
          </label>`}
      </div>
    `;
    renderMiniChallengeBarCached("buchstabensalat", "buchstabensalat", "wsChallengeBar", area, renderWordSearch);
    area.querySelectorAll(".ws-cell").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (s.pendingArticleFor) return;
        const r = Number(btn.dataset.r), c = Number(btn.dataset.c);
        if (s.selection.length === 0) {
          s.selection = [[r, c]];
        } else {
          const [r0, c0] = s.selection[0];
          const match = matchWordSearchLine(s, r0, c0, r, c);
          s.selection = [];
          if (match) {
            match.found = true;
            Core.sound.correct();
            s.pendingArticleFor = match;
          } else {
            Core.sound.wrong();
          }
        }
        renderWordSearch();
      });
    });
    const hintToggle = document.getElementById("wsHintToggle");
    if (hintToggle) {
      hintToggle.addEventListener("change", () => {
        setWsHintMode(hintToggle.checked);
        renderWordSearch();
      });
    }
    area.querySelectorAll("[data-article-guess]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const correct = btn.dataset.articleGuess === s.pendingArticleFor.article;
        wsSession.wordsAttempted += 1;
        const word = s.pendingArticleFor.word;
        const wordCapitalized = word.charAt(0) + word.slice(1).toLowerCase();
        wsSession.playedWords.push(`${correct ? "✅" : "❌"} ${s.pendingArticleFor.article} ${wordCapitalized}`);
        if (correct) { Core.sound.fanfare(); wsSession.correctCount += 1; s.pendingArticleFor.articleDone = true; }
        else { Core.sound.wrong(); }
        s.pendingArticleFor = null;
        if (wsSession.wordsAttempted >= wsSession.target) {
          saveResultAndCheck({
            categories: ["buchstabensalat"], points: wsSession.correctCount, bonus: 0,
            percent: Math.round((wsSession.correctCount / wsSession.target) * 100),
            character: (WS_TIERS.find((t) => wsSession.correctCount <= t.max) || WS_TIERS[WS_TIERS.length - 1]).title,
            badges: [], playedAt: new Date().toISOString(),
          });
          if (Backend.currentUser()) {
            const wordList = wsSession.playedWords.map((w) => `• ${w}`).join("\n");
            Backend.sendSystemMessage(Backend.currentUser().id, `📊 Du hast gerade „Buchstabensalat" gespielt — ${wsSession.correctCount} von ${wsSession.target} Wörtern samt Artikel richtig gelöst.\n\nDiese Wörter kamen vor:\n${wordList}`);
          }
        }
        renderWordSearch();
      });
    });
  }
  function cellInWord(w, r, c, size) {
    for (let i = 0; i < w.word.length; i++) {
      if (w.row + w.dir[0] * i === r && w.col + w.dir[1] * i === c) return true;
    }
    return false;
  }
  function matchWordSearchLine(s, r0, c0, r1, c1) {
    const dr = Math.sign(r1 - r0), dc = Math.sign(c1 - c0);
    if (dr === 0 && dc === 0) return null;
    // Erlaubt: waagerecht, senkrecht UND diagonal (beide Richtungen) — "kreuz und quer".
    const rowDiff = Math.abs(r1 - r0), colDiff = Math.abs(c1 - c0);
    if (rowDiff !== 0 && colDiff !== 0 && rowDiff !== colDiff) return null; // keine "krumme" Auswahl
    let letters = "";
    let r = r0, c = c0;
    while (true) {
      letters += s.grid[r][c];
      if (r === r1 && c === c1) break;
      r += dr; c += dc;
      if (letters.length > s.size) return null; // Sicherheitsnetz
    }
    const reversed = letters.split("").reverse().join("");
    return s.words.find((w) => !w.found && (w.word === letters || w.word === reversed)) || null;
  }
  document.querySelector('#learnSubnav [data-sub="sub-wordsearch"]')?.addEventListener("click", () => {
    newWordSearchSession();
    wsState = buildWordSearch();
    renderWordSearch();
  });

  /* ============================================================
     KREUZWORTRÄTSEL — handgeprüfte, garantiert stimmige Raster
     (Buchstaben an jeder Kreuzung Zeile für Zeile nachgerechnet).
     '#' = keine Eingabe-Zelle (schwarzes Feld).
     ============================================================ */
  const CROSSWORDS = [
    {
      title: "Rätsel im Garten (3 Wörter)",
      rows: 5, cols: 6,
      grid: [
        ["#", "T", "#", "#", "M", "#"],
        ["G", "A", "R", "T", "E", "N"],
        ["#", "S", "#", "#", "E", "#"],
        ["#", "S", "#", "#", "R", "#"],
        ["#", "E", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "GARTEN", clue: "Fläche bei einem Haus, mit Blumen und Pflanzen" },
        { num: 2, dir: "down", row: 0, col: 1, answer: "TASSE", clue: "daraus trinkt man Kaffee oder Tee" },
        { num: 3, dir: "down", row: 0, col: 4, answer: "MEER", clue: "sehr großes, salziges Gewässer" },
      ],
    },
    {
      title: "Rätsel 1",
      rows: 5, cols: 6,
      grid: [
        ["A", "#", "#", "#", "#", "#"],
        ["P", "#", "#", "#", "#", "#"],
        ["F", "A", "H", "R", "E", "N"],
        ["E", "#", "#", "#", "#", "#"],
        ["L", "#", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "FAHREN", clue: "sich mit einem Fahrzeug fortbewegen" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "APFEL", clue: "eine runde, oft rote oder grüne Frucht" },
      ],
    },
    {
      title: "Rätsel 2",
      rows: 5, cols: 4,
      grid: [
        ["H", "E", "F", "T"],
        ["A", "#", "#", "#"],
        ["B", "#", "#", "#"],
        ["E", "#", "#", "#"],
        ["N", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "HEFT", clue: "kleines Buch zum Schreiben" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "HABEN", clue: "etwas besitzen" },
      ],
    },
    {
      title: "Rätsel 3",
      rows: 4, cols: 6,
      grid: [
        ["H", "#", "#", "#", "#", "#"],
        ["U", "#", "#", "#", "#", "#"],
        ["N", "#", "#", "#", "#", "#"],
        ["D", "E", "N", "K", "E", "N"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "DENKEN", clue: "mit dem Verstand arbeiten, überlegen" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "HUND", clue: "ein beliebtes Haustier, das bellt" },
      ],
    },
    {
      title: "Rätsel 4",
      rows: 4, cols: 8,
      grid: [
        ["#", "A", "#", "#", "#", "#", "#", "#"],
        ["T", "R", "O", "T", "Z", "D", "E", "M"],
        ["#", "Z", "#", "#", "#", "#", "#", "#"],
        ["#", "T", "#", "#", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "TROTZDEM", clue: "trotz eines Hindernisses, dennoch" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "ARZT", clue: "Person, die Kranke behandelt" },
      ],
    },
    {
      title: "Rätsel 5",
      rows: 6, cols: 6,
      grid: [
        ["#", "#", "#", "#", "M", "#"],
        ["#", "#", "#", "#", "Ü", "#"],
        ["#", "#", "#", "#", "S", "#"],
        ["#", "#", "#", "#", "S", "#"],
        ["L", "I", "E", "G", "E", "N"],
        ["#", "#", "#", "#", "N", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "LIEGEN", clue: "sich in waagerechter Lage befinden" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "MÜSSEN", clue: "eine Verpflichtung haben" },
      ],
    },
    {
      title: "Rätsel 6",
      rows: 4, cols: 6,
      grid: [
        ["#", "B", "#", "#", "#", "#"],
        ["#", "R", "#", "#", "#", "#"],
        ["S", "O", "M", "M", "E", "R"],
        ["#", "T", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "SOMMER", clue: "die warme Jahreszeit" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "BROT", clue: "aus Mehl gebackenes Grundnahrungsmittel" },
      ],
    },
    {
      title: "Rätsel 7",
      rows: 8, cols: 3,
      grid: [
        ["A", "#", "#"],
        ["R", "#", "#"],
        ["B", "U", "S"],
        ["E", "#", "#"],
        ["I", "#", "#"],
        ["T", "#", "#"],
        ["E", "#", "#"],
        ["N", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "BUS", clue: "großes Fahrzeug für viele Fahrgäste" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "ARBEITEN", clue: "einer beruflichen Tätigkeit nachgehen" },
      ],
    },
    {
      title: "Rätsel 8",
      rows: 5, cols: 4,
      grid: [
        ["#", "A", "#", "#"],
        ["#", "M", "#", "#"],
        ["#", "P", "#", "#"],
        ["B", "E", "T", "T"],
        ["#", "L", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "BETT", clue: "Möbelstück zum Schlafen" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "AMPEL", clue: "regelt den Verkehr mit rot, gelb, grün" },
      ],
    },
    {
      title: "Rätsel 9",
      rows: 6, cols: 5,
      grid: [
        ["#", "#", "L", "#", "#"],
        ["#", "#", "Ö", "#", "#"],
        ["#", "#", "F", "#", "#"],
        ["A", "P", "F", "E", "L"],
        ["#", "#", "E", "#", "#"],
        ["#", "#", "L", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "APFEL", clue: "eine runde, oft rote oder grüne Frucht" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "LÖFFEL", clue: "Besteck zum Suppe essen" },
      ],
    },
    {
      title: "Rätsel 10",
      rows: 8, cols: 7,
      grid: [
        ["F", "A", "M", "I", "L", "I", "E"],
        ["#", "#", "#", "#", "#", "#", "R"],
        ["#", "#", "#", "#", "#", "#", "Z"],
        ["#", "#", "#", "#", "#", "#", "Ä"],
        ["#", "#", "#", "#", "#", "#", "H"],
        ["#", "#", "#", "#", "#", "#", "L"],
        ["#", "#", "#", "#", "#", "#", "E"],
        ["#", "#", "#", "#", "#", "#", "N"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "FAMILIE", clue: "Eltern, Kinder und Verwandte" },
        { num: 1, dir: "down", row: 0, col: 6, answer: "ERZÄHLEN", clue: "eine Geschichte mündlich wiedergeben" },
      ],
    },
    {
      title: "Rätsel 11",
      rows: 6, cols: 6,
      grid: [
        ["#", "#", "#", "W", "#", "#"],
        ["#", "#", "#", "E", "#", "#"],
        ["#", "#", "#", "T", "#", "#"],
        ["#", "#", "#", "T", "#", "#"],
        ["#", "#", "#", "E", "#", "#"],
        ["F", "A", "H", "R", "E", "N"],
      ],
      words: [
        { num: 1, dir: "across", row: 5, col: 0, answer: "FAHREN", clue: "sich mit einem Fahrzeug fortbewegen" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "WETTER", clue: "wie es draußen ist (Regen, Sonne …)" },
      ],
    },
    {
      title: "Rätsel 12",
      rows: 5, cols: 6,
      grid: [
        ["#", "#", "G", "#", "#", "#"],
        ["#", "#", "E", "#", "#", "#"],
        ["F", "A", "H", "R", "E", "N"],
        ["#", "#", "E", "#", "#", "#"],
        ["#", "#", "N", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "FAHREN", clue: "sich mit einem Fahrzeug fortbewegen" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "GEHEN", clue: "sich zu Fuß fortbewegen" },
      ],
    },
    {
      title: "Rätsel 13",
      rows: 6, cols: 7,
      grid: [
        ["#", "#", "#", "#", "#", "N", "#"],
        ["D", "R", "U", "C", "K", "E", "R"],
        ["#", "#", "#", "#", "#", "H", "#"],
        ["#", "#", "#", "#", "#", "M", "#"],
        ["#", "#", "#", "#", "#", "E", "#"],
        ["#", "#", "#", "#", "#", "N", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "DRUCKER", clue: "druckt Dokumente auf Papier" },
        { num: 1, dir: "down", row: 0, col: 5, answer: "NEHMEN", clue: "etwas in die Hand oder an sich nehmen" },
      ],
    },
    {
      title: "Rätsel 14",
      rows: 4, cols: 5,
      grid: [
        ["B", "#", "#", "#", "#"],
        ["R", "#", "#", "#", "#"],
        ["O", "#", "#", "#", "#"],
        ["T", "A", "S", "S", "E"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "TASSE", clue: "Gefäß für heiße Getränke, mit Henkel" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "BROT", clue: "aus Mehl gebackenes Grundnahrungsmittel" },
      ],
    },
    {
      title: "Rätsel 15",
      rows: 6, cols: 5,
      grid: [
        ["#", "#", "#", "B", "#"],
        ["#", "#", "#", "U", "#"],
        ["#", "#", "#", "T", "#"],
        ["K", "Ä", "L", "T", "E"],
        ["#", "#", "#", "E", "#"],
        ["#", "#", "#", "R", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "KÄLTE", clue: "niedrige Temperatur" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "BUTTER", clue: "gelbes Fett aus Milch, zum Streichen" },
      ],
    },
    {
      title: "Rätsel 16",
      rows: 6, cols: 6,
      grid: [
        ["#", "#", "#", "#", "W", "#"],
        ["#", "#", "#", "#", "E", "#"],
        ["#", "#", "#", "#", "R", "#"],
        ["#", "#", "#", "#", "D", "#"],
        ["G", "A", "R", "T", "E", "N"],
        ["#", "#", "#", "#", "N", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "GARTEN", clue: "Fläche mit Pflanzen bei einem Haus" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "WERDEN", clue: "sich in etwas verändern" },
      ],
    },
    {
      title: "Rätsel 17",
      rows: 4, cols: 7,
      grid: [
        ["F", "A", "M", "I", "L", "I", "E"],
        ["#", "R", "#", "#", "#", "#", "#"],
        ["#", "Z", "#", "#", "#", "#", "#"],
        ["#", "T", "#", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "FAMILIE", clue: "Eltern, Kinder und Verwandte" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "ARZT", clue: "Person, die Kranke behandelt" },
      ],
    },
    {
      title: "Rätsel 18",
      rows: 7, cols: 3,
      grid: [
        ["B", "U", "S"],
        ["#", "#", "T"],
        ["#", "#", "R"],
        ["#", "#", "A"],
        ["#", "#", "S"],
        ["#", "#", "S"],
        ["#", "#", "E"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "BUS", clue: "großes Fahrzeug für viele Fahrgäste" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "STRASSE", clue: "Weg für Autos und Fahrzeuge" },
      ],
    },
    {
      title: "Rätsel 19",
      rows: 5, cols: 7,
      grid: [
        ["#", "#", "#", "#", "#", "H", "#"],
        ["F", "A", "H", "R", "R", "A", "D"],
        ["#", "#", "#", "#", "#", "N", "#"],
        ["#", "#", "#", "#", "#", "D", "#"],
        ["#", "#", "#", "#", "#", "Y", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "FAHRRAD", clue: "Zweirad, das man tritt" },
        { num: 1, dir: "down", row: 0, col: 5, answer: "HANDY", clue: "tragbares Telefon" },
      ],
    },
    {
      title: "Rätsel 20",
      rows: 7, cols: 6,
      grid: [
        ["#", "#", "#", "#", "S", "#"],
        ["#", "#", "#", "#", "P", "#"],
        ["#", "#", "#", "#", "I", "#"],
        ["#", "#", "#", "#", "E", "#"],
        ["#", "#", "#", "#", "L", "#"],
        ["M", "E", "S", "S", "E", "R"],
        ["#", "#", "#", "#", "N", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 5, col: 0, answer: "MESSER", clue: "Besteck zum Schneiden" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "SPIELEN", clue: "sich zum Vergnügen beschäftigen" },
      ],
    },
    {
      title: "Rätsel 21",
      rows: 7, cols: 6,
      grid: [
        ["#", "#", "W", "#", "#", "#"],
        ["#", "#", "I", "#", "#", "#"],
        ["M", "A", "C", "H", "E", "N"],
        ["#", "#", "H", "#", "#", "#"],
        ["#", "#", "T", "#", "#", "#"],
        ["#", "#", "I", "#", "#", "#"],
        ["#", "#", "G", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "MACHEN", clue: "etwas herstellen oder ausführen" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "WICHTIG", clue: "von großer Bedeutung" },
      ],
    },
    {
      title: "Rätsel 22",
      rows: 7, cols: 7,
      grid: [
        ["R", "A", "T", "H", "A", "U", "S"],
        ["#", "#", "#", "#", "#", "#", "T"],
        ["#", "#", "#", "#", "#", "#", "R"],
        ["#", "#", "#", "#", "#", "#", "A"],
        ["#", "#", "#", "#", "#", "#", "S"],
        ["#", "#", "#", "#", "#", "#", "S"],
        ["#", "#", "#", "#", "#", "#", "E"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "RATHAUS", clue: "Gebäude der Stadtverwaltung" },
        { num: 1, dir: "down", row: 0, col: 6, answer: "STRASSE", clue: "Weg für Autos und Fahrzeuge" },
      ],
    },
    {
      title: "Rätsel 23",
      rows: 4, cols: 7,
      grid: [
        ["#", "#", "#", "#", "#", "#", "K"],
        ["#", "#", "#", "#", "#", "#", "I"],
        ["M", "Ä", "D", "C", "H", "E", "N"],
        ["#", "#", "#", "#", "#", "#", "D"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "MÄDCHEN", clue: "ein junges weibliches Kind" },
        { num: 1, dir: "down", row: 0, col: 6, answer: "KIND", clue: "ein junger Mensch" },
      ],
    },
    {
      title: "Rätsel 24",
      rows: 5, cols: 4,
      grid: [
        ["K", "I", "N", "D"],
        ["A", "#", "#", "#"],
        ["B", "#", "#", "#"],
        ["E", "#", "#", "#"],
        ["L", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "KIND", clue: "ein junger Mensch" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "KABEL", clue: "Leitung für Strom oder Daten" },
      ],
    },
    {
      title: "Rätsel 25",
      rows: 4, cols: 7,
      grid: [
        ["W", "#", "#", "#", "#", "#", "#"],
        ["I", "#", "#", "#", "#", "#", "#"],
        ["N", "#", "#", "#", "#", "#", "#"],
        ["D", "R", "U", "C", "K", "E", "R"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "DRUCKER", clue: "druckt Dokumente auf Papier" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "WIND", clue: "bewegte Luft" },
      ],
    },
    {
      title: "Rätsel 26",
      rows: 5, cols: 3,
      grid: [
        ["B", "U", "S"],
        ["#", "#", "A"],
        ["#", "#", "G"],
        ["#", "#", "E"],
        ["#", "#", "N"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "BUS", clue: "großes Fahrzeug für viele Fahrgäste" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "SAGEN", clue: "etwas mündlich mitteilen" },
      ],
    },
    {
      title: "Rätsel 27",
      rows: 6, cols: 6,
      grid: [
        ["#", "B", "#", "#", "#", "#"],
        ["#", "R", "#", "#", "#", "#"],
        ["#", "Ü", "#", "#", "#", "#"],
        ["#", "C", "#", "#", "#", "#"],
        ["#", "K", "#", "#", "#", "#"],
        ["H", "E", "R", "B", "S", "T"],
      ],
      words: [
        { num: 1, dir: "across", row: 5, col: 0, answer: "HERBST", clue: "die Jahreszeit mit fallenden Blättern" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "BRÜCKE", clue: "führt über einen Fluss oder ein Tal" },
      ],
    },
    {
      title: "Rätsel 28",
      rows: 6, cols: 7,
      grid: [
        ["#", "#", "#", "#", "#", "B", "#"],
        ["#", "#", "#", "#", "#", "R", "#"],
        ["#", "#", "#", "#", "#", "I", "#"],
        ["#", "#", "#", "#", "#", "L", "#"],
        ["#", "#", "#", "#", "#", "L", "#"],
        ["M", "Ä", "D", "C", "H", "E", "N"],
      ],
      words: [
        { num: 1, dir: "across", row: 5, col: 0, answer: "MÄDCHEN", clue: "ein junges weibliches Kind" },
        { num: 1, dir: "down", row: 0, col: 5, answer: "BRILLE", clue: "Sehhilfe für die Augen" },
      ],
    },
    {
      title: "Rätsel 29",
      rows: 6, cols: 6,
      grid: [
        ["#", "#", "#", "#", "#", "K"],
        ["#", "#", "#", "#", "#", "Ö"],
        ["#", "#", "#", "#", "#", "N"],
        ["W", "I", "S", "S", "E", "N"],
        ["#", "#", "#", "#", "#", "E"],
        ["#", "#", "#", "#", "#", "N"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "WISSEN", clue: "eine Information im Gedächtnis haben" },
        { num: 1, dir: "down", row: 0, col: 5, answer: "KÖNNEN", clue: "eine Fähigkeit besitzen" },
      ],
    },
    {
      title: "Rätsel 30",
      rows: 6, cols: 7,
      grid: [
        ["#", "#", "#", "S", "#", "#", "#"],
        ["#", "#", "#", "C", "#", "#", "#"],
        ["#", "#", "#", "H", "#", "#", "#"],
        ["B", "L", "E", "I", "B", "E", "N"],
        ["#", "#", "#", "F", "#", "#", "#"],
        ["#", "#", "#", "F", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "BLEIBEN", clue: "an einem Ort verharren, nicht weggehen" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "SCHIFF", clue: "fährt auf dem Wasser" },
      ],
    },
    {
      title: "Rätsel 31",
      rows: 3, cols: 4,
      grid: [
        ["#", "#", "U", "#"],
        ["#", "#", "H", "#"],
        ["B", "E", "R", "G"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "BERG", clue: "eine hohe Erhebung im Land" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "UHR", clue: "zeigt die Uhrzeit" },
      ],
    },
    {
      title: "Rätsel 32",
      rows: 5, cols: 6,
      grid: [
        ["#", "#", "#", "#", "#", "I"],
        ["W", "E", "R", "D", "E", "N"],
        ["#", "#", "#", "#", "#", "S"],
        ["#", "#", "#", "#", "#", "E"],
        ["#", "#", "#", "#", "#", "L"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "WERDEN", clue: "sich in etwas verändern" },
        { num: 1, dir: "down", row: 0, col: 5, answer: "INSEL", clue: "Land, umgeben von Wasser" },
      ],
    },
    {
      title: "Rätsel 33",
      rows: 6, cols: 4,
      grid: [
        ["#", "F", "#", "#"],
        ["#", "Ü", "#", "#"],
        ["#", "H", "#", "#"],
        ["#", "L", "#", "#"],
        ["B", "E", "T", "T"],
        ["#", "N", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "BETT", clue: "Möbelstück zum Schlafen" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "FÜHLEN", clue: "eine Empfindung wahrnehmen" },
      ],
    },
    {
      title: "Rätsel 34",
      rows: 5, cols: 5,
      grid: [
        ["F", "#", "#", "#", "#"],
        ["I", "#", "#", "#", "#"],
        ["S", "U", "P", "P", "E"],
        ["C", "#", "#", "#", "#"],
        ["H", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "SUPPE", clue: "flüssiges, warmes Gericht" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "FISCH", clue: "Tier, das im Wasser lebt" },
      ],
    },
    {
      title: "Rätsel 35",
      rows: 6, cols: 6,
      grid: [
        ["#", "L", "#", "#", "#", "#"],
        ["#", "Ö", "#", "#", "#", "#"],
        ["#", "F", "#", "#", "#", "#"],
        ["#", "F", "#", "#", "#", "#"],
        ["N", "E", "H", "M", "E", "N"],
        ["#", "L", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "NEHMEN", clue: "etwas in die Hand oder an sich nehmen" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "LÖFFEL", clue: "Besteck zum Suppe essen" },
      ],
    },
    {
      title: "Rätsel 36",
      rows: 6, cols: 4,
      grid: [
        ["#", "#", "#", "S"],
        ["#", "#", "#", "C"],
        ["#", "#", "#", "H"],
        ["W", "E", "I", "N"],
        ["#", "#", "#", "E"],
        ["#", "#", "#", "E"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "WEIN", clue: "alkoholisches Getränk aus Trauben" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "SCHNEE", clue: "weiße, kalte Flocken im Winter" },
      ],
    },
    {
      title: "Rätsel 37",
      rows: 4, cols: 4,
      grid: [
        ["#", "#", "W", "#"],
        ["#", "#", "E", "#"],
        ["#", "#", "I", "#"],
        ["L", "A", "N", "D"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "LAND", clue: "ein Staat (oder Fläche außerhalb der Stadt)" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "WEIN", clue: "alkoholisches Getränk aus Trauben" },
      ],
    },
    {
      title: "Rätsel 38",
      rows: 4, cols: 5,
      grid: [
        ["#", "B", "#", "#", "#"],
        ["L", "A", "M", "P", "E"],
        ["#", "N", "#", "#", "#"],
        ["#", "K", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "LAMPE", clue: "spendet Licht in einem Raum" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "BANK", clue: "Sitzmöbel im Freien (oder ein Geldinstitut)" },
      ],
    },
    {
      title: "Rätsel 39",
      rows: 8, cols: 7,
      grid: [
        ["#", "#", "#", "#", "S", "#", "#"],
        ["#", "#", "#", "#", "P", "#", "#"],
        ["F", "A", "H", "R", "R", "A", "D"],
        ["#", "#", "#", "#", "E", "#", "#"],
        ["#", "#", "#", "#", "C", "#", "#"],
        ["#", "#", "#", "#", "H", "#", "#"],
        ["#", "#", "#", "#", "E", "#", "#"],
        ["#", "#", "#", "#", "N", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "FAHRRAD", clue: "Zweirad, das man tritt" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "SPRECHEN", clue: "mit der Stimme reden" },
      ],
    },
    {
      title: "Rätsel 40",
      rows: 5, cols: 7,
      grid: [
        ["#", "#", "#", "#", "#", "#", "H"],
        ["#", "#", "#", "#", "#", "#", "A"],
        ["#", "#", "#", "#", "#", "#", "B"],
        ["#", "#", "#", "#", "#", "#", "E"],
        ["S", "P", "I", "E", "L", "E", "N"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "SPIELEN", clue: "sich zum Vergnügen beschäftigen" },
        { num: 1, dir: "down", row: 0, col: 6, answer: "HABEN", clue: "etwas besitzen" },
      ],
    },
    {
      title: "Rätsel 41",
      rows: 6, cols: 5,
      grid: [
        ["W", "#", "#", "#", "#"],
        ["E", "#", "#", "#", "#"],
        ["T", "#", "#", "#", "#"],
        ["T", "I", "S", "C", "H"],
        ["E", "#", "#", "#", "#"],
        ["R", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "TISCH", clue: "ein Möbelstück zum Essen oder Arbeiten" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "WETTER", clue: "wie es draußen ist (Regen, Sonne …)" },
      ],
    },
    {
      title: "Rätsel 42",
      rows: 4, cols: 5,
      grid: [
        ["#", "#", "H", "#", "#"],
        ["#", "#", "U", "#", "#"],
        ["J", "U", "N", "G", "E"],
        ["#", "#", "D", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "JUNGE", clue: "ein junger männlicher Mensch" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "HUND", clue: "ein beliebtes Haustier, das bellt" },
      ],
    },
    {
      title: "Rätsel 43",
      rows: 5, cols: 8,
      grid: [
        ["#", "#", "#", "#", "#", "#", "A", "#"],
        ["#", "#", "#", "#", "#", "#", "M", "#"],
        ["#", "#", "#", "#", "#", "#", "P", "#"],
        ["B", "E", "G", "I", "N", "N", "E", "N"],
        ["#", "#", "#", "#", "#", "#", "L", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "BEGINNEN", clue: "mit etwas anfangen" },
        { num: 1, dir: "down", row: 0, col: 6, answer: "AMPEL", clue: "regelt den Verkehr mit rot, gelb, grün" },
      ],
    },
    {
      title: "Rätsel 44",
      rows: 5, cols: 4,
      grid: [
        ["#", "M", "#", "#"],
        ["B", "I", "L", "D"],
        ["#", "L", "#", "#"],
        ["#", "C", "#", "#"],
        ["#", "H", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "BILD", clue: "ein gemaltes oder gedrucktes Motiv" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "MILCH", clue: "weißes Getränk von der Kuh" },
      ],
    },
    {
      title: "Rätsel 45",
      rows: 4, cols: 7,
      grid: [
        ["#", "B", "#", "#", "#", "#", "#"],
        ["F", "A", "M", "I", "L", "I", "E"],
        ["#", "B", "#", "#", "#", "#", "#"],
        ["#", "Y", "#", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "FAMILIE", clue: "Eltern, Kinder und Verwandte" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "BABY", clue: "ein sehr kleines Kind" },
      ],
    },
    {
      title: "Rätsel 46",
      rows: 5, cols: 5,
      grid: [
        ["#", "#", "#", "#", "G"],
        ["#", "#", "#", "#", "E"],
        ["#", "#", "#", "#", "H"],
        ["B", "L", "U", "M", "E"],
        ["#", "#", "#", "#", "N"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "BLUME", clue: "eine Pflanze mit bunter Blüte" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "GEHEN", clue: "sich zu Fuß fortbewegen" },
      ],
    },
    {
      title: "Rätsel 47",
      rows: 5, cols: 5,
      grid: [
        ["#", "#", "K", "#", "#"],
        ["#", "#", "A", "#", "#"],
        ["G", "A", "B", "E", "L"],
        ["#", "#", "E", "#", "#"],
        ["#", "#", "L", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "GABEL", clue: "Besteck mit Zinken" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "KABEL", clue: "Leitung für Strom oder Daten" },
      ],
    },
    {
      title: "Rätsel 48",
      rows: 5, cols: 6,
      grid: [
        ["#", "#", "#", "#", "K", "#"],
        ["#", "#", "#", "#", "A", "#"],
        ["#", "#", "#", "#", "B", "#"],
        ["M", "A", "C", "H", "E", "N"],
        ["#", "#", "#", "#", "L", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "MACHEN", clue: "etwas herstellen oder ausführen" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "KABEL", clue: "Leitung für Strom oder Daten" },
      ],
    },
    {
      title: "Rätsel 49",
      rows: 6, cols: 6,
      grid: [
        ["#", "S", "#", "#", "#", "#"],
        ["#", "T", "#", "#", "#", "#"],
        ["#", "E", "#", "#", "#", "#"],
        ["#", "H", "#", "#", "#", "#"],
        ["N", "E", "H", "M", "E", "N"],
        ["#", "N", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "NEHMEN", clue: "etwas in die Hand oder an sich nehmen" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "STEHEN", clue: "sich aufrecht auf den Füßen befinden" },
      ],
    },
    {
      title: "Rätsel 50",
      rows: 5, cols: 6,
      grid: [
        ["#", "#", "W", "#", "#", "#"],
        ["#", "#", "O", "#", "#", "#"],
        ["H", "E", "L", "F", "E", "N"],
        ["#", "#", "K", "#", "#", "#"],
        ["#", "#", "E", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "HELFEN", clue: "jemandem Unterstützung geben" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "WOLKE", clue: "weiße oder graue Form am Himmel" },
      ],
    },
    {
      title: "Rätsel 51",
      rows: 6, cols: 5,
      grid: [
        ["#", "#", "#", "F", "#"],
        ["#", "#", "#", "I", "#"],
        ["#", "#", "#", "N", "#"],
        ["#", "#", "#", "D", "#"],
        ["G", "A", "B", "E", "L"],
        ["#", "#", "#", "N", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "GABEL", clue: "Besteck mit Zinken" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "FINDEN", clue: "etwas Gesuchtes entdecken" },
      ],
    },
    {
      title: "Rätsel 52",
      rows: 4, cols: 7,
      grid: [
        ["#", "J", "#", "#", "#", "#", "#"],
        ["#", "A", "#", "#", "#", "#", "#"],
        ["#", "H", "#", "#", "#", "#", "#"],
        ["D", "R", "U", "C", "K", "E", "R"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "DRUCKER", clue: "druckt Dokumente auf Papier" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "JAHR", clue: "zwölf Monate" },
      ],
    },
    {
      title: "Rätsel 53",
      rows: 5, cols: 6,
      grid: [
        ["#", "#", "#", "#", "A", "#"],
        ["#", "#", "#", "#", "M", "#"],
        ["#", "#", "#", "#", "P", "#"],
        ["K", "A", "U", "F", "E", "N"],
        ["#", "#", "#", "#", "L", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "KAUFEN", clue: "gegen Geld erwerben" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "AMPEL", clue: "regelt den Verkehr mit rot, gelb, grün" },
      ],
    },
    {
      title: "Rätsel 54",
      rows: 6, cols: 7,
      grid: [
        ["#", "#", "#", "#", "#", "#", "L"],
        ["#", "#", "#", "#", "#", "#", "Ö"],
        ["#", "#", "#", "#", "#", "#", "F"],
        ["#", "#", "#", "#", "#", "#", "F"],
        ["K", "O", "M", "M", "O", "D", "E"],
        ["#", "#", "#", "#", "#", "#", "L"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "KOMMODE", clue: "niedriger Schrank mit Schubladen" },
        { num: 1, dir: "down", row: 0, col: 6, answer: "LÖFFEL", clue: "Besteck zum Suppe essen" },
      ],
    },
    {
      title: "Rätsel 55",
      rows: 5, cols: 7,
      grid: [
        ["#", "#", "#", "I", "#", "#", "#"],
        ["#", "#", "#", "N", "#", "#", "#"],
        ["#", "#", "#", "S", "#", "#", "#"],
        ["#", "#", "#", "E", "#", "#", "#"],
        ["M", "Ö", "G", "L", "I", "C", "H"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "MÖGLICH", clue: "durchführbar, machbar" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "INSEL", clue: "Land, umgeben von Wasser" },
      ],
    },
    {
      title: "Rätsel 56",
      rows: 4, cols: 8,
      grid: [
        ["#", "#", "#", "#", "#", "#", "#", "G"],
        ["M", "A", "N", "C", "H", "M", "A", "L"],
        ["#", "#", "#", "#", "#", "#", "#", "A"],
        ["#", "#", "#", "#", "#", "#", "#", "S"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "MANCHMAL", clue: "gelegentlich, nicht immer" },
        { num: 1, dir: "down", row: 0, col: 7, answer: "GLAS", clue: "durchsichtiges Trinkgefäß" },
      ],
    },
    {
      title: "Rätsel 57",
      rows: 6, cols: 5,
      grid: [
        ["#", "#", "#", "#", "W"],
        ["#", "#", "#", "#", "I"],
        ["#", "#", "#", "#", "N"],
        ["#", "#", "#", "#", "T"],
        ["W", "I", "E", "S", "E"],
        ["#", "#", "#", "#", "R"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "WIESE", clue: "eine Fläche mit Gras" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "WINTER", clue: "die kalte Jahreszeit" },
      ],
    },
    {
      title: "Rätsel 58",
      rows: 8, cols: 6,
      grid: [
        ["#", "F", "#", "#", "#", "#"],
        ["#", "L", "#", "#", "#", "#"],
        ["#", "U", "#", "#", "#", "#"],
        ["#", "G", "#", "#", "#", "#"],
        ["#", "Z", "#", "#", "#", "#"],
        ["#", "E", "#", "#", "#", "#"],
        ["Z", "U", "C", "K", "E", "R"],
        ["#", "G", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 6, col: 0, answer: "ZUCKER", clue: "süße, weiße Kristalle zum Süßen" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "FLUGZEUG", clue: "fliegt durch die Luft" },
      ],
    },
    {
      title: "Rätsel 59",
      rows: 5, cols: 6,
      grid: [
        ["#", "#", "#", "#", "K", "#"],
        ["#", "#", "#", "#", "A", "#"],
        ["#", "#", "#", "#", "B", "#"],
        ["S", "C", "H", "N", "E", "E"],
        ["#", "#", "#", "#", "L", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "SCHNEE", clue: "weiße, kalte Flocken im Winter" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "KABEL", clue: "Leitung für Strom oder Daten" },
      ],
    },
    {
      title: "Rätsel 60",
      rows: 5, cols: 7,
      grid: [
        ["#", "#", "S", "#", "#", "#", "#"],
        ["#", "#", "T", "#", "#", "#", "#"],
        ["S", "P", "I", "E", "L", "E", "N"],
        ["#", "#", "F", "#", "#", "#", "#"],
        ["#", "#", "T", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "SPIELEN", clue: "sich zum Vergnügen beschäftigen" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "STIFT", clue: "zum Schreiben oder Malen" },
      ],
    },
    {
      title: "Rätsel 61",
      rows: 5, cols: 6,
      grid: [
        ["#", "W", "#", "#", "#", "#"],
        ["#", "O", "#", "#", "#", "#"],
        ["#", "L", "#", "#", "#", "#"],
        ["#", "K", "#", "#", "#", "#"],
        ["W", "E", "R", "D", "E", "N"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "WERDEN", clue: "sich in etwas verändern" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "WOLKE", clue: "weiße oder graue Form am Himmel" },
      ],
    },
    {
      title: "Rätsel 62",
      rows: 8, cols: 4,
      grid: [
        ["#", "B", "#", "#"],
        ["#", "R", "#", "#"],
        ["#", "A", "#", "#"],
        ["#", "U", "#", "#"],
        ["#", "C", "#", "#"],
        ["#", "H", "#", "#"],
        ["B", "E", "R", "G"],
        ["#", "N", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 6, col: 0, answer: "BERG", clue: "eine hohe Erhebung im Land" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "BRAUCHEN", clue: "etwas nötig haben" },
      ],
    },
    {
      title: "Rätsel 63",
      rows: 3, cols: 8,
      grid: [
        ["F", "L", "U", "G", "Z", "E", "U", "G"],
        ["#", "#", "H", "#", "#", "#", "#", "#"],
        ["#", "#", "R", "#", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "FLUGZEUG", clue: "fliegt durch die Luft" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "UHR", clue: "zeigt die Uhrzeit" },
      ],
    },
    {
      title: "Rätsel 64",
      rows: 5, cols: 6,
      grid: [
        ["#", "#", "#", "#", "T", "#"],
        ["#", "#", "#", "#", "A", "#"],
        ["#", "#", "#", "#", "S", "#"],
        ["#", "#", "#", "#", "S", "#"],
        ["L", "E", "H", "R", "E", "R"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "LEHRER", clue: "unterrichtet in der Schule (männlich)" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "TASSE", clue: "Gefäß für heiße Getränke, mit Henkel" },
      ],
    },
    {
      title: "Rätsel 65",
      rows: 5, cols: 6,
      grid: [
        ["#", "#", "#", "#", "#", "J"],
        ["#", "#", "#", "#", "#", "U"],
        ["L", "I", "E", "G", "E", "N"],
        ["#", "#", "#", "#", "#", "G"],
        ["#", "#", "#", "#", "#", "E"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "LIEGEN", clue: "sich in waagerechter Lage befinden" },
        { num: 1, dir: "down", row: 0, col: 5, answer: "JUNGE", clue: "ein junger männlicher Mensch" },
      ],
    },
    {
      title: "Rätsel 66",
      rows: 6, cols: 8,
      grid: [
        ["#", "#", "#", "L", "#", "#", "#", "#"],
        ["#", "#", "#", "Ö", "#", "#", "#", "#"],
        ["#", "#", "#", "F", "#", "#", "#", "#"],
        ["#", "#", "#", "F", "#", "#", "#", "#"],
        ["S", "P", "R", "E", "C", "H", "E", "N"],
        ["#", "#", "#", "L", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "SPRECHEN", clue: "mit der Stimme reden" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "LÖFFEL", clue: "Besteck zum Suppe essen" },
      ],
    },
    {
      title: "Rätsel 67",
      rows: 5, cols: 8,
      grid: [
        ["F", "#", "#", "#", "#", "#", "#", "#"],
        ["I", "#", "#", "#", "#", "#", "#", "#"],
        ["S", "#", "#", "#", "#", "#", "#", "#"],
        ["C", "O", "M", "P", "U", "T", "E", "R"],
        ["H", "#", "#", "#", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "COMPUTER", clue: "elektronisches Gerät zum Arbeiten/Spielen" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "FISCH", clue: "Tier, das im Wasser lebt" },
      ],
    },
    {
      title: "Rätsel 68",
      rows: 5, cols: 4,
      grid: [
        ["#", "#", "#", "I"],
        ["#", "#", "#", "M"],
        ["#", "#", "#", "M"],
        ["K", "Ä", "S", "E"],
        ["#", "#", "#", "R"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "KÄSE", clue: "ein Milchprodukt, oft auf Brot" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "IMMER", clue: "zu jeder Zeit, ausnahmslos" },
      ],
    },
    {
      title: "Rätsel 69",
      rows: 6, cols: 5,
      grid: [
        ["#", "#", "#", "#", "S"],
        ["#", "#", "#", "#", "O"],
        ["#", "#", "#", "#", "M"],
        ["#", "#", "#", "#", "M"],
        ["B", "L", "U", "M", "E"],
        ["#", "#", "#", "#", "R"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "BLUME", clue: "eine Pflanze mit bunter Blüte" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "SOMMER", clue: "die warme Jahreszeit" },
      ],
    },
    {
      title: "Rätsel 70",
      rows: 6, cols: 6,
      grid: [
        ["#", "S", "#", "#", "#", "#"],
        ["#", "C", "#", "#", "#", "#"],
        ["#", "H", "#", "#", "#", "#"],
        ["#", "N", "#", "#", "#", "#"],
        ["L", "E", "H", "R", "E", "R"],
        ["#", "E", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "LEHRER", clue: "unterrichtet in der Schule (männlich)" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "SCHNEE", clue: "weiße, kalte Flocken im Winter" },
      ],
    },
    {
      title: "Rätsel 71",
      rows: 6, cols: 7,
      grid: [
        ["#", "#", "#", "#", "#", "#", "K"],
        ["#", "#", "#", "#", "#", "#", "A"],
        ["#", "#", "#", "#", "#", "#", "U"],
        ["#", "#", "#", "#", "#", "#", "F"],
        ["#", "#", "#", "#", "#", "#", "E"],
        ["M", "Ä", "D", "C", "H", "E", "N"],
      ],
      words: [
        { num: 1, dir: "across", row: 5, col: 0, answer: "MÄDCHEN", clue: "ein junges weibliches Kind" },
        { num: 1, dir: "down", row: 0, col: 6, answer: "KAUFEN", clue: "gegen Geld erwerben" },
      ],
    },
    {
      title: "Rätsel 72",
      rows: 4, cols: 5,
      grid: [
        ["#", "#", "#", "#", "B"],
        ["#", "#", "#", "#", "A"],
        ["R", "E", "G", "E", "N"],
        ["#", "#", "#", "#", "K"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "REGEN", clue: "Wasser, das vom Himmel fällt" },
        { num: 1, dir: "down", row: 0, col: 4, answer: "BANK", clue: "Sitzmöbel im Freien (oder ein Geldinstitut)" },
      ],
    },
    {
      title: "Rätsel 73",
      rows: 6, cols: 4,
      grid: [
        ["#", "#", "#", "W"],
        ["#", "#", "#", "I"],
        ["#", "#", "#", "N"],
        ["#", "#", "#", "T"],
        ["K", "Ä", "S", "E"],
        ["#", "#", "#", "R"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "KÄSE", clue: "ein Milchprodukt, oft auf Brot" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "WINTER", clue: "die kalte Jahreszeit" },
      ],
    },
    {
      title: "Rätsel 74",
      rows: 6, cols: 6,
      grid: [
        ["#", "#", "#", "#", "#", "F"],
        ["#", "#", "#", "#", "#", "I"],
        ["#", "#", "#", "#", "#", "N"],
        ["#", "#", "#", "#", "#", "D"],
        ["B", "R", "Ü", "C", "K", "E"],
        ["#", "#", "#", "#", "#", "N"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "BRÜCKE", clue: "führt über einen Fluss oder ein Tal" },
        { num: 1, dir: "down", row: 0, col: 5, answer: "FINDEN", clue: "etwas Gesuchtes entdecken" },
      ],
    },
    {
      title: "Rätsel 75",
      rows: 8, cols: 8,
      grid: [
        ["#", "A", "#", "#", "#", "#", "#", "#"],
        ["#", "R", "#", "#", "#", "#", "#", "#"],
        ["#", "B", "#", "#", "#", "#", "#", "#"],
        ["L", "E", "H", "R", "E", "R", "I", "N"],
        ["#", "I", "#", "#", "#", "#", "#", "#"],
        ["#", "T", "#", "#", "#", "#", "#", "#"],
        ["#", "E", "#", "#", "#", "#", "#", "#"],
        ["#", "N", "#", "#", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "LEHRERIN", clue: "unterrichtet in der Schule (weiblich)" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "ARBEITEN", clue: "einer beruflichen Tätigkeit nachgehen" },
      ],
    },
    {
      title: "Rätsel 76",
      rows: 7, cols: 6,
      grid: [
        ["#", "D", "#", "#", "#", "#"],
        ["L", "E", "H", "R", "E", "R"],
        ["#", "S", "#", "#", "#", "#"],
        ["#", "H", "#", "#", "#", "#"],
        ["#", "A", "#", "#", "#", "#"],
        ["#", "L", "#", "#", "#", "#"],
        ["#", "B", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "LEHRER", clue: "unterrichtet in der Schule (männlich)" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "DESHALB", clue: "aus diesem Grund" },
      ],
    },
    {
      title: "Rätsel 77",
      rows: 5, cols: 5,
      grid: [
        ["K", "Ä", "L", "T", "E"],
        ["#", "#", "A", "#", "#"],
        ["#", "#", "M", "#", "#"],
        ["#", "#", "P", "#", "#"],
        ["#", "#", "E", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "KÄLTE", clue: "niedrige Temperatur" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "LAMPE", clue: "spendet Licht in einem Raum" },
      ],
    },
    {
      title: "Rätsel 78",
      rows: 6, cols: 5,
      grid: [
        ["#", "#", "#", "D", "#"],
        ["#", "#", "#", "E", "#"],
        ["S", "O", "N", "N", "E"],
        ["#", "#", "#", "K", "#"],
        ["#", "#", "#", "E", "#"],
        ["#", "#", "#", "N", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "SONNE", clue: "leuchtet und wärmt am Tag" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "DENKEN", clue: "mit dem Verstand arbeiten, überlegen" },
      ],
    },
    {
      title: "Rätsel 79",
      rows: 5, cols: 5,
      grid: [
        ["F", "#", "#", "#", "#"],
        ["I", "#", "#", "#", "#"],
        ["S", "O", "N", "N", "E"],
        ["C", "#", "#", "#", "#"],
        ["H", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "SONNE", clue: "leuchtet und wärmt am Tag" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "FISCH", clue: "Tier, das im Wasser lebt" },
      ],
    },
    {
      title: "Rätsel 80",
      rows: 4, cols: 4,
      grid: [
        ["#", "#", "J", "#"],
        ["#", "#", "A", "#"],
        ["#", "#", "H", "#"],
        ["B", "E", "R", "G"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "BERG", clue: "eine hohe Erhebung im Land" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "JAHR", clue: "zwölf Monate" },
      ],
    },
    {
      title: "Rätsel 81",
      rows: 5, cols: 6,
      grid: [
        ["M", "U", "S", "E", "U", "M"],
        ["I", "#", "#", "#", "#", "#"],
        ["L", "#", "#", "#", "#", "#"],
        ["C", "#", "#", "#", "#", "#"],
        ["H", "#", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "MUSEUM", clue: "Ort, an dem Kunst oder Geschichte gezeigt wird" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "MILCH", clue: "weißes Getränk von der Kuh" },
      ],
    },
    {
      title: "Rätsel 82",
      rows: 4, cols: 7,
      grid: [
        ["#", "#", "#", "#", "#", "#", "J"],
        ["#", "#", "#", "#", "#", "#", "A"],
        ["E", "N", "D", "L", "I", "C", "H"],
        ["#", "#", "#", "#", "#", "#", "R"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "ENDLICH", clue: "nach langem Warten, zum Schluss" },
        { num: 1, dir: "down", row: 0, col: 6, answer: "JAHR", clue: "zwölf Monate" },
      ],
    },
    {
      title: "Rätsel 83",
      rows: 7, cols: 4,
      grid: [
        ["#", "D", "#", "#"],
        ["#", "E", "#", "#"],
        ["#", "S", "#", "#"],
        ["#", "H", "#", "#"],
        ["M", "A", "N", "N"],
        ["#", "L", "#", "#"],
        ["#", "B", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "MANN", clue: "eine erwachsene männliche Person" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "DESHALB", clue: "aus diesem Grund" },
      ],
    },
    {
      title: "Rätsel 84",
      rows: 8, cols: 5,
      grid: [
        ["S", "T", "A", "D", "T"],
        ["P", "#", "#", "#", "#"],
        ["R", "#", "#", "#", "#"],
        ["E", "#", "#", "#", "#"],
        ["C", "#", "#", "#", "#"],
        ["H", "#", "#", "#", "#"],
        ["E", "#", "#", "#", "#"],
        ["N", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "STADT", clue: "großer Ort mit vielen Häusern" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "SPRECHEN", clue: "mit der Stimme reden" },
      ],
    },
    {
      title: "Rätsel 85",
      rows: 4, cols: 6,
      grid: [
        ["S", "T", "E", "H", "E", "N"],
        ["A", "#", "#", "#", "#", "#"],
        ["L", "#", "#", "#", "#", "#"],
        ["Z", "#", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "STEHEN", clue: "sich aufrecht auf den Füßen befinden" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "SALZ", clue: "würzt Speisen, weiße Kristalle" },
      ],
    },
    {
      title: "Rätsel 86",
      rows: 7, cols: 5,
      grid: [
        ["#", "W", "#", "#", "#"],
        ["#", "I", "#", "#", "#"],
        ["#", "C", "#", "#", "#"],
        ["#", "H", "#", "#", "#"],
        ["S", "T", "A", "D", "T"],
        ["#", "I", "#", "#", "#"],
        ["#", "G", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "STADT", clue: "großer Ort mit vielen Häusern" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "WICHTIG", clue: "von großer Bedeutung" },
      ],
    },
    {
      title: "Rätsel 87",
      rows: 7, cols: 6,
      grid: [
        ["#", "#", "#", "S", "#", "#"],
        ["#", "#", "#", "T", "#", "#"],
        ["#", "#", "#", "R", "#", "#"],
        ["#", "#", "#", "A", "#", "#"],
        ["M", "Ü", "S", "S", "E", "N"],
        ["#", "#", "#", "S", "#", "#"],
        ["#", "#", "#", "E", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "MÜSSEN", clue: "eine Verpflichtung haben" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "STRASSE", clue: "Weg für Autos und Fahrzeuge" },
      ],
    },
    {
      title: "Rätsel 88",
      rows: 8, cols: 6,
      grid: [
        ["#", "R", "#", "#", "#", "#"],
        ["#", "U", "#", "#", "#", "#"],
        ["#", "C", "#", "#", "#", "#"],
        ["#", "K", "#", "#", "#", "#"],
        ["#", "S", "#", "#", "#", "#"],
        ["B", "A", "N", "A", "N", "E"],
        ["#", "C", "#", "#", "#", "#"],
        ["#", "K", "#", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 5, col: 0, answer: "BANANE", clue: "eine gelbe, längliche Frucht" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "RUCKSACK", clue: "Tasche, die man auf dem Rücken trägt" },
      ],
    },
    {
      title: "Rätsel 89",
      rows: 6, cols: 4,
      grid: [
        ["#", "#", "T", "#"],
        ["#", "#", "A", "#"],
        ["K", "Ä", "S", "E"],
        ["#", "#", "C", "#"],
        ["#", "#", "H", "#"],
        ["#", "#", "E", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 2, col: 0, answer: "KÄSE", clue: "ein Milchprodukt, oft auf Brot" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "TASCHE", clue: "zum Tragen von Sachen" },
      ],
    },
    {
      title: "Rätsel 90",
      rows: 7, cols: 6,
      grid: [
        ["#", "#", "B", "#", "#", "#"],
        ["#", "#", "A", "#", "#", "#"],
        ["#", "#", "H", "#", "#", "#"],
        ["B", "A", "N", "A", "N", "E"],
        ["#", "#", "H", "#", "#", "#"],
        ["#", "#", "O", "#", "#", "#"],
        ["#", "#", "F", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "BANANE", clue: "eine gelbe, längliche Frucht" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "BAHNHOF", clue: "Ort, an dem Züge halten" },
      ],
    },
    {
      title: "Rätsel 91",
      rows: 5, cols: 7,
      grid: [
        ["#", "#", "#", "F", "#", "#", "#"],
        ["F", "A", "M", "I", "L", "I", "E"],
        ["#", "#", "#", "S", "#", "#", "#"],
        ["#", "#", "#", "C", "#", "#", "#"],
        ["#", "#", "#", "H", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "FAMILIE", clue: "Eltern, Kinder und Verwandte" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "FISCH", clue: "Tier, das im Wasser lebt" },
      ],
    },
    {
      title: "Rätsel 92",
      rows: 7, cols: 5,
      grid: [
        ["#", "#", "#", "S", "#"],
        ["#", "#", "#", "T", "#"],
        ["#", "#", "#", "R", "#"],
        ["#", "#", "#", "A", "#"],
        ["#", "#", "#", "S", "#"],
        ["#", "#", "#", "S", "#"],
        ["V", "O", "G", "E", "L"],
      ],
      words: [
        { num: 1, dir: "across", row: 6, col: 0, answer: "VOGEL", clue: "Tier, das fliegen kann" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "STRASSE", clue: "Weg für Autos und Fahrzeuge" },
      ],
    },
    {
      title: "Rätsel 93",
      rows: 6, cols: 4,
      grid: [
        ["B", "A", "U", "M"],
        ["R", "#", "#", "#"],
        ["Ü", "#", "#", "#"],
        ["C", "#", "#", "#"],
        ["K", "#", "#", "#"],
        ["E", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "BAUM", clue: "eine große Pflanze mit Stamm und Blättern" },
        { num: 1, dir: "down", row: 0, col: 0, answer: "BRÜCKE", clue: "führt über einen Fluss oder ein Tal" },
      ],
    },
    {
      title: "Rätsel 94",
      rows: 4, cols: 4,
      grid: [
        ["#", "P", "#", "#"],
        ["H", "A", "U", "S"],
        ["#", "R", "#", "#"],
        ["#", "K", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 1, col: 0, answer: "HAUS", clue: "ein Gebäude zum Wohnen" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "PARK", clue: "grüne Fläche zum Spazieren in der Stadt" },
      ],
    },
    {
      title: "Rätsel 95",
      rows: 7, cols: 6,
      grid: [
        ["#", "#", "B", "#", "#", "#"],
        ["#", "#", "A", "#", "#", "#"],
        ["#", "#", "H", "#", "#", "#"],
        ["#", "#", "N", "#", "#", "#"],
        ["F", "Ü", "H", "L", "E", "N"],
        ["#", "#", "O", "#", "#", "#"],
        ["#", "#", "F", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "FÜHLEN", clue: "eine Empfindung wahrnehmen" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "BAHNHOF", clue: "Ort, an dem Züge halten" },
      ],
    },
    {
      title: "Rätsel 96",
      rows: 7, cols: 4,
      grid: [
        ["#", "#", "Z", "#"],
        ["#", "#", "E", "#"],
        ["#", "#", "I", "#"],
        ["#", "#", "T", "#"],
        ["H", "A", "U", "S"],
        ["#", "#", "N", "#"],
        ["#", "#", "G", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "HAUS", clue: "ein Gebäude zum Wohnen" },
        { num: 1, dir: "down", row: 0, col: 2, answer: "ZEITUNG", clue: "gedruckte Nachrichten, täglich oder wöchentlich" },
      ],
    },
    {
      title: "Rätsel 97",
      rows: 7, cols: 6,
      grid: [
        ["#", "#", "#", "#", "#", "W"],
        ["#", "#", "#", "#", "#", "I"],
        ["#", "#", "#", "#", "#", "C"],
        ["#", "#", "#", "#", "#", "H"],
        ["H", "E", "R", "B", "S", "T"],
        ["#", "#", "#", "#", "#", "I"],
        ["#", "#", "#", "#", "#", "G"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "HERBST", clue: "die Jahreszeit mit fallenden Blättern" },
        { num: 1, dir: "down", row: 0, col: 5, answer: "WICHTIG", clue: "von großer Bedeutung" },
      ],
    },
    {
      title: "Rätsel 98",
      rows: 5, cols: 5,
      grid: [
        ["I", "M", "M", "E", "R"],
        ["#", "O", "#", "#", "#"],
        ["#", "N", "#", "#", "#"],
        ["#", "A", "#", "#", "#"],
        ["#", "T", "#", "#", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 0, col: 0, answer: "IMMER", clue: "zu jeder Zeit, ausnahmslos" },
        { num: 1, dir: "down", row: 0, col: 1, answer: "MONAT", clue: "ein Teil des Jahres, z. B. Januar" },
      ],
    },
    {
      title: "Rätsel 99",
      rows: 4, cols: 7,
      grid: [
        ["#", "#", "#", "#", "#", "W", "#"],
        ["#", "#", "#", "#", "#", "I", "#"],
        ["#", "#", "#", "#", "#", "N", "#"],
        ["K", "O", "M", "M", "O", "D", "E"],
      ],
      words: [
        { num: 1, dir: "across", row: 3, col: 0, answer: "KOMMODE", clue: "niedriger Schrank mit Schubladen" },
        { num: 1, dir: "down", row: 0, col: 5, answer: "WIND", clue: "bewegte Luft" },
      ],
    },
    {
      title: "Rätsel 100",
      rows: 6, cols: 5,
      grid: [
        ["#", "#", "#", "S", "#"],
        ["#", "#", "#", "C", "#"],
        ["#", "#", "#", "H", "#"],
        ["#", "#", "#", "N", "#"],
        ["G", "E", "H", "E", "N"],
        ["#", "#", "#", "E", "#"],
      ],
      words: [
        { num: 1, dir: "across", row: 4, col: 0, answer: "GEHEN", clue: "sich zu Fuß fortbewegen" },
        { num: 1, dir: "down", row: 0, col: 3, answer: "SCHNEE", clue: "weiße, kalte Flocken im Winter" },
      ],
    },
  ];
  let cwState = null;
  let cwIntroShown = false;
  let cwSession = null; // { round, total, correctCount, allWordsPlayed } -- mehrere Rätsel pro Sitzung, EINE Sammel-Nachricht am Ende
  function newCrosswordSession() {
    // Zufälliger Startpunkt statt immer index 0 — sonst begann JEDE neue Sitzung garantiert mit
    // demselben allerersten Rätsel im Pool, egal wie groß der Pool tatsächlich ist. Die folgenden
    // Runden zählen von hier aus normal weiter (currentIdx + 1), sodass man innerhalb einer
    // Sitzung trotzdem verschiedene, nicht wiederholte Rätsel bekommt.
    cwSession = { round: 0, total: 4, allWordsPlayed: [], startIdx: Math.floor(Math.random() * CROSSWORDS.length) };
  }
  function newCrossword(index) {
    if (!cwSession) newCrosswordSession();
    const puzzle = CROSSWORDS[index % CROSSWORDS.length];
    cwState = { puzzle, entries: {}, checked: false, startedAt: Date.now() };
  }
  function cwCellNumber(puzzle, r, c) {
    const w = puzzle.words.find((w) => w.row === r && w.col === c);
    return w ? w.num : null;
  }
  function cwWordCells(w) {
    const cells = [];
    for (let i = 0; i < w.answer.length; i++) cells.push(w.dir === "across" ? [w.row, w.col + i] : [w.row + i, w.col]);
    return cells;
  }
  function cwFindWord(puzzle, r, c, dir) {
    return puzzle.words.find((w) => w.dir === dir && cwWordCells(w).some(([wr, wc]) => wr === r && wc === c));
  }
  function cwNextCell(puzzle, r, c, dir) {
    const word = cwFindWord(puzzle, r, c, dir);
    if (!word) return null;
    const cells = cwWordCells(word);
    const idx = cells.findIndex(([wr, wc]) => wr === r && wc === c);
    if (idx === -1 || idx === cells.length - 1) return null;
    return cells[idx + 1];
  }
  function renderCrosswordResults() {
    const area = document.getElementById("crosswordArea");
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p class="eyebrow">✏️ KREUZWORTRÄTSEL — SITZUNG FERTIG</p>
        <p style="font-size:2rem; margin:8px 0;">🎉</p>
        <h2 style="margin:8px 0;">Alle Rätsel gelöst!</h2>
        ${starRatingArcHtml(100)}
        <p class="empty-note">Eine Zusammenfassung wartet in deinem Postfach.</p>
        <button type="button" class="btn btn-coffee" id="cwPlayAgainBtn" style="margin-top:14px;">🔄 Neue Runden</button>
      </div>
    `;
    if (activeGameChallengeId) { Backend.submitChallengeResult(activeGameChallengeId, { percent: 100 }); activeGameChallengeId = null; }
    document.getElementById("cwPlayAgainBtn").addEventListener("click", () => {
      newCrosswordSession(); newCrossword(cwSession.startIdx); renderCrossword();
    });
  }
  function renderCrossword() {
    const area = document.getElementById("crosswordArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "kreuzwortraetsel_aktiv", "Kreuzworträtsel", "✏️", true)) return;
    if (!cwIntroShown && !hasSeenGameIntro("kreuzwortraetsel")) {
      // "KREUZWORTRÄTSEL" als kleines, echtes Kreuzworträtsel-Gitter (schwarz umrandete, weiße
      // Kästchen) statt Emoji + Text — zwei Zeilen, da das Wort für eine einzelne Reihe zu lang ist.
      const CW_TITLE_LETTERS = ["K", "R", "E", "U", "Z", "W", "O", "R", "T", "R", "Ä", "T", "S", "E", "L"];
      const cellSize = 26;
      const perRow = 8;
      const titleSvg = `<svg viewBox="0 0 ${cellSize * perRow + 4} ${cellSize * 2 + 4}" style="width:100%; max-width:320px; height:auto;">
        ${CW_TITLE_LETTERS.map((letter, i) => {
          const row = Math.floor(i / perRow);
          const col = i % perRow;
          const x = 2 + col * cellSize;
          const y = 2 + row * cellSize;
          return `<g>
            <rect x="${x}" y="${y}" width="${cellSize - 2}" height="${cellSize - 2}" fill="#FFFFFF" stroke="#241505" stroke-width="1.3"/>
            <text x="${x + (cellSize - 2) / 2}" y="${y + (cellSize - 2) / 2 + 6}" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-weight="800" fill="#241505">${letter}</text>
          </g>`;
        }).join("")}
      </svg>`;
      area.innerHTML = `
        <div class="question-card" style="text-align:center;">
          <div style="display:flex; justify-content:center;">${titleSvg}</div>
          <p class="empty-note" style="margin-top:12px;">Antippen und tippen — waagerecht oder senkrecht, je nachdem wo du startest. Nochmal auf dieselbe Zelle tippen wechselt die Richtung.</p>
          <button type="button" class="btn btn-coffee" id="cwStartIntroBtn" style="margin-top:14px;">▶️ Los geht's</button>
        </div>`;
      document.getElementById("cwStartIntroBtn").addEventListener("click", () => { cwIntroShown = true; markGameIntroSeen("kreuzwortraetsel"); if (!cwSession) newCrosswordSession(); renderCrossword(); });
      return;
    }
    if (!cwSession) { renderCrosswordResults(); return; }
    if (!cwState) newCrossword(cwSession.startIdx);
    const { puzzle } = cwState;
    if (!cwState.activeDir) cwState.activeDir = "across";
    area.innerHTML = `
      <div class="question-card">
        <p class="eyebrow">✏️ KREUZWORTRÄTSEL · RUNDE ${cwSession.round + 1} / ${cwSession.total} · ${puzzle.title}</p>
        <div id="cwChallengeBar"></div>
        <p class="empty-note" style="margin-bottom:10px;">Antippen und tippen — waagerecht oder senkrecht, je nachdem wo du startest. Nochmal auf dieselbe Zelle tippen wechselt die Richtung.</p>
        <div class="cw-grid" style="grid-template-columns: repeat(${puzzle.cols}, minmax(0, 1fr)); max-width: min(${puzzle.cols * 42}px, 94vw);">
          ${puzzle.grid.map((row, r) => row.map((ch, c) => {
            if (ch === "#") return `<div class="cw-cell cw-block"></div>`;
            const num = cwCellNumber(puzzle, r, c);
            const key = `${r}-${c}`;
            const entered = cwState.entries[key] || "";
            const isCorrect = cwState.checked && entered.toUpperCase() === ch;
            const isWrong = cwState.checked && entered && entered.toUpperCase() !== ch;
            return `<div class="cw-cell ${isCorrect ? "cw-correct" : ""} ${isWrong ? "cw-wrong" : ""}">
              ${num ? `<span class="cw-num">${num}</span>` : ""}
              <input type="text" inputmode="text" autocomplete="off" autocapitalize="characters" class="cw-input" data-r="${r}" data-c="${c}" value="${entered}" />
            </div>`;
          }).join("")).join("")}
        </div>
        <div class="cw-clues">
          <div>
            <p class="eyebrow" style="margin-top:12px;">Waagerecht</p>
            ${puzzle.words.filter((w) => w.dir === "across").map((w) => `<p class="empty-note wrap-words">${w.num}. ${w.clue} (${w.answer.length})</p>`).join("")}
          </div>
          <div>
            <p class="eyebrow" style="margin-top:12px;">Senkrecht</p>
            ${puzzle.words.filter((w) => w.dir === "down").map((w) => `<p class="empty-note wrap-words">${w.num}. ${w.clue} (${w.answer.length})</p>`).join("")}
          </div>
        </div>
        <div class="quiz-actions" style="justify-content:center; margin-top:14px;">
          <button type="button" class="btn btn-coffee" id="cwCheckBtn">✓ Prüfen</button>
          <button type="button" class="btn btn-ghost" id="cwNextBtn">🔄 Nächstes Rätsel</button>
        </div>
        <p class="empty-note" id="cwFeedback" style="text-align:center; margin-top:10px;"></p>
      </div>
    `;
    renderMiniChallengeBarCached("kreuzwortraetsel", "kreuzwortraetsel", "cwChallengeBar", area, renderCrossword);
    area.querySelectorAll(".cw-input").forEach((input) => {
      const r = Number(input.dataset.r), c = Number(input.dataset.c);
      // Beim Antippen die Schreibrichtung festlegen: startet die Zelle ein Runter-Wort, aber
      // kein Waagerecht-Wort, ist "runter" gemeint. Startet sie ein Waagerecht-Wort, gilt das
      // (Standard-Konvention bei Kreuzworträtseln). Erneutes Antippen derselben Kreuzungszelle
      // schaltet um. "click" statt "focus", damit das automatische Weiterspringen beim Tippen
      // die Richtung nicht versehentlich zurücksetzt.
      input.addEventListener("click", () => {
        const hasAcross = !!cwFindWord(puzzle, r, c, "across");
        const hasDown = !!cwFindWord(puzzle, r, c, "down");
        const startsAcross = puzzle.words.some((w) => w.dir === "across" && w.row === r && w.col === c);
        const startsDown = puzzle.words.some((w) => w.dir === "down" && w.row === r && w.col === c);
        const sameCell = cwState.lastFocusedCell === `${r}-${c}`;
        if (sameCell && hasAcross && hasDown) {
          cwState.activeDir = cwState.activeDir === "across" ? "down" : "across";
        } else if (startsDown && !startsAcross) {
          cwState.activeDir = "down";
        } else if (startsAcross) {
          cwState.activeDir = "across";
        } else if (!(cwState.activeDir === "across" && hasAcross) && !(cwState.activeDir === "down" && hasDown)) {
          cwState.activeDir = hasAcross ? "across" : "down";
        }
        cwState.lastFocusedCell = `${r}-${c}`;
      });
      // Kein maxlength mehr — stattdessen wird beim Tippen immer nur das ZULETZT eingegebene
      // Zeichen übernommen. Das funktioniert zuverlässig mit jeder Tastatur (auch virtuelle
      // Handy-Tastaturen), unabhängig davon, ob die Zelle vorher schon einen Buchstaben (durch
      // das kreuzende Wort) enthielt — man kann an Kreuzungsfeldern also ganz normal weiterschreiben.
      input.addEventListener("input", (e) => {
        const raw = e.target.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, "");
        const val = raw.slice(-1); // nur das zuletzt getippte Zeichen behalten
        e.target.value = val;
        cwState.entries[`${r}-${c}`] = val;
        if (val) {
          const next = cwNextCell(puzzle, r, c, cwState.activeDir);
          if (next) {
            const [nr, nc] = next;
            const nextInput = area.querySelector(`.cw-input[data-r="${nr}"][data-c="${nc}"]`);
            // preventScroll verhindert, dass die Seite bei jedem Buchstaben hin- und herspringt.
            if (nextInput) nextInput.focus({ preventScroll: true });
          }
        }
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value) {
          const word = cwFindWord(puzzle, r, c, cwState.activeDir);
          if (word) {
            const cells = cwWordCells(word);
            const idx = cells.findIndex(([wr, wc]) => wr === r && wc === c);
            if (idx > 0) {
              const [pr, pc] = cells[idx - 1];
              const prevInput = area.querySelector(`.cw-input[data-r="${pr}"][data-c="${pc}"]`);
              if (prevInput) prevInput.focus({ preventScroll: true });
            }
          }
        }
      });
    });
    document.getElementById("cwCheckBtn").addEventListener("click", () => {
      cwState.checked = true;
      const allCorrect = puzzle.grid.every((row, r) => row.every((ch, c) => {
        if (ch === "#") return true;
        return (cwState.entries[`${r}-${c}`] || "").toUpperCase() === ch;
      }));
      const fb = document.getElementById("cwFeedback");
      if (allCorrect) {
        Core.sound.fanfare();
        const seconds = (Date.now() - cwState.startedAt) / 1000;
        cwSession.round += 1;
        cwSession.allWordsPlayed.push(...puzzle.words.map((w) => `• ${w.answer} — ${w.clue}`));
        saveResultAndCheck({
          categories: ["kreuzwortraetsel"], points: puzzle.words.length, bonus: seconds < 60 ? 1 : 0, percent: 100,
          character: "Rätsel-Genie", badges: [], playedAt: new Date().toISOString(),
        });
        if (cwSession.round >= cwSession.total) {
          fb.textContent = `🎉 Alles richtig! Sitzung fertig (${cwSession.total} Rätsel gelöst).`;
          if (Backend.currentUser()) {
            const wordList = cwSession.allWordsPlayed.join("\n");
            Backend.sendSystemMessage(Backend.currentUser().id, `📊 Du hast gerade ${cwSession.total} Kreuzworträtsel hintereinander gelöst — alles richtig!\n\nDiese Wörter kamen vor:\n${wordList}`);
          }
          // WICHTIG: cwSession erst NACH der Verzögerung auf null setzen, nicht sofort — sonst
          // würde der direkt folgende renderCrossword()-Aufruf unten schon vorzeitig zur
          // Abschluss-Anzeige springen, statt erst kurz die grün markierte, gelöste letzte
          // Runde zu zeigen.
          setTimeout(() => { cwSession = null; renderCrossword(); }, 1600);
        } else {
          fb.textContent = "🎉 Alles richtig! Weiter geht's mit dem nächsten Rätsel …";
          const nextIdx = CROSSWORDS.indexOf(puzzle) + 1;
          setTimeout(() => { newCrossword(nextIdx); renderCrossword(); }, 1600);
        }
      } else {
        Core.sound.wrong();
        fb.textContent = "Noch nicht ganz — rote Felder sind falsch, versuch es weiter!";
      }
      renderCrossword();
      const freshFb = document.getElementById("cwFeedback");
      if (freshFb) freshFb.textContent = fb.textContent;
    });
    document.getElementById("cwNextBtn").addEventListener("click", () => {
      const currentIdx = CROSSWORDS.indexOf(puzzle);
      newCrossword(currentIdx + 1);
      renderCrossword();
    });
  }
  document.querySelector('#learnSubnav [data-sub="sub-crossword"]')?.addEventListener("click", () => {
    if (!cwState) { newCrosswordSession(); newCrossword(cwSession.startIdx); }
    renderCrossword();
  });

  /* ============================================================
     KOMPASS
     ============================================================ */
  const kompassArea = document.getElementById("kompassArea");

  function kompassCard(title, explain, example, syl) {
    return `<div class="kompass-card">
      <div class="kompass-word">„${(isStressModeOn() && syl) ? stressHtml(syl) : title}"</div>
      <div class="kompass-explain">${explain}</div>
      <div class="kompass-example">„${example}"</div>
    </div>`;
  }

  // WICHTIG: alle drei starten mit null statt einem festen "B1" — das signalisiert "noch nicht
  // festgelegt", sodass applyDefaultCefrLevel() (siehe unten) beim allerersten Rendern jedes
  // Bereichs automatisch das im Profil hinterlegte Sprachniveau übernehmen kann. Sobald man
  // manuell umschaltet, steht hier ein echter Wert, der dann nicht mehr überschrieben wird.
  let historyLevel = null;
  // Archiv-Zustand: ob der Bereich aufgeklappt ist, aktueller Suchtext, und welcher Eintrag (falls
  // einer aus der Liste angetippt wurde) gerade im Detail angezeigt wird.
  let historyArchiveOpen = false;
  let historyArchiveSearch = "";
  let historyArchiveDate = null;
  let dichterLevel = null;
  let schneeLevel = null;
  const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
  // Setzt das Niveau eines Bereichs beim allerersten Aufruf auf das im Profil hinterlegte
  // Sprachniveau (falls eins gesetzt ist), sonst auf "B1" als neutrale Mitte — genau wie
  // ausdrücklich gewünscht: Inhalte sollen automatisch im eigenen Niveau starten, statt jedes Mal
  // manuell umschalten zu müssen. Gibt das zu verwendende Niveau zurück.
  function applyDefaultCefrLevel(currentValue, setter) {
    if (currentValue) return currentValue;
    const profileLevel = Backend.currentProfile()?.extraProfileData?.cefrLevel;
    const level = profileLevel && CEFR_LEVELS.includes(profileLevel) ? profileLevel : "B1";
    setter(level);
    return level;
  }
  // Wenn ein Inhalt nicht ALLE sechs Niveaus abdeckt: das nächstgelegene tatsächlich vorhandene
  // Niveau finden (z. B. C1 gewünscht, aber nur bis B2 vorhanden → B2 verwenden), statt einfach
  // nichts anzuzeigen oder auf einen falschen Standardwert zu springen.
  function nearestAvailableCefrLevel(entry, wantedLevel) {
    if (entry.levels[wantedLevel]) return wantedLevel;
    const wantedIdx = CEFR_LEVELS.indexOf(wantedLevel);
    const available = CEFR_LEVELS.filter((lvl) => entry.levels[lvl]);
    if (!available.length) return wantedLevel;
    available.sort((a, b) => Math.abs(CEFR_LEVELS.indexOf(a) - wantedIdx) - Math.abs(CEFR_LEVELS.indexOf(b) - wantedIdx));
    return available[0];
  }
  let kompassDichterOpenId = null; // welche Kachel gerade aufgeklappt ist (null = Kachel-Ansicht)
  let kompassTileScrollY = 0; // Scrollposition beim Öffnen einer Kachel, für die Wiederherstellung beim Zurückkehren
  let kompassSchneeOpenId = null;
  // WICHTIG: beide Rubriken sind bewusst als ausstehende Updates vorbereitet — nur die
  // Infrastruktur (Struktur, Niveau-Umschalter A1–C2, Beispieleinträge) steht schon, aber SICHTBAR
  // wird das für normale Nutzer:innen erst, wenn die Feature-Flags unten explizit freigegeben
  // werden. Bis dahin nur für Betreiber:in/Admins/eingeladene Beta-Tester:innen sichtbar (siehe
  // renderComingSoonGate).
  // Kleine, handgezeichnete SVG-Portrait-Kachel statt eines echten Fotos — es gibt hier keinen
  // Internetzugriff, um echte, rechtefreie Fotos zu laden. Jede Person/jedes Thema bekommt eine
  // eigene, thematisch passende, stilisierte Illustration statt eines generischen Platzhalters.
  function portraitSvg(initials, bgFrom, bgTo, symbol) {
    return `<svg viewBox="0 0 120 120" style="width:100%; height:100%; display:block;">
      <defs><linearGradient id="pg-${initials}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgFrom}"/><stop offset="100%" stop-color="${bgTo}"/>
      </linearGradient></defs>
      <rect width="120" height="120" fill="url(#pg-${initials})"/>
      <text x="60" y="46" text-anchor="middle" font-size="34" font-family="sans-serif">${symbol}</text>
      <text x="60" y="92" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-weight="700" fill="#FFFFFF" opacity="0.9">${initials}</text>
    </svg>`;
  }
  const DICHTER_ENTRIES = [
    {
      id: "goethe", name: "Johann Wolfgang von Goethe", years: "1749–1832",
      img: portraitSvg("JG", "#5BA8A0", "#3EC6C6", "✒️"),
      levels: {
        A1: "Goethe war ein berühmter deutscher Dichter. Er hat viele Gedichte und Bücher geschrieben. Sein bekanntestes Buch heißt „Faust“.",
        A2: "Johann Wolfgang von Goethe war ein sehr berühmter deutscher Dichter und Schriftsteller. Er lebte vor über 200 Jahren. Sein wichtigstes Werk heißt „Faust“ und wird noch heute in Theatern gespielt.",
        B1: "Goethe gilt als einer der bedeutendsten deutschen Dichter überhaupt. Neben Gedichten schrieb er Romane, Theaterstücke und war auch als Naturwissenschaftler tätig. Sein Hauptwerk „Faust“ beschäftigt sich mit dem Streben des Menschen nach Wissen und Erfüllung.",
        B2: "Johann Wolfgang von Goethe (1749–1832) war nicht nur Dichter, sondern auch Staatsmann, Naturforscher und Universalgelehrter. Sein Werk „Faust“, an dem er über 60 Jahre arbeitete, gilt als eines der wichtigsten Werke der deutschen Literaturgeschichte.",
        C1: "Goethe zählt zu den einflussreichsten Persönlichkeiten der deutschen Kulturgeschichte — als Dichter der Weimarer Klassik prägte er mit Werken wie „Faust“ und „Die Leiden des jungen Werthers“ die europäische Literatur nachhaltig und wirkte zugleich als Naturwissenschaftler und Staatsminister.",
        C2: "Als Zentralgestalt der Weimarer Klassik verkörpert Goethe wie kaum eine andere Figur das Ideal des Universalgelehrten: sein literarisches Schaffen, allen voran das lebenslange Ringen um „Faust“, verschmilzt mit naturwissenschaftlichen Studien und staatsmännischem Wirken zu einem einzigartigen kulturellen Vermächtnis.",
      },
    },
    {
      id: "schiller", name: "Friedrich Schiller", years: "1759–1805",
      img: portraitSvg("FS", "#A875D8", "#B084CC", "🎭"),
      levels: {
        A1: "Schiller war ein deutscher Dichter. Er hat Theaterstücke geschrieben. Ein bekanntes Stück heißt „Wilhelm Tell“.",
        A2: "Friedrich Schiller war ein wichtiger deutscher Dichter und Freund von Goethe. Er schrieb viele Theaterstücke, zum Beispiel „Wilhelm Tell“. Seine Werke handeln oft von Freiheit.",
        B1: "Schiller war einer der bedeutendsten deutschen Dramatiker. Zusammen mit Goethe prägte er die Weimarer Klassik. In seinen Theaterstücken wie „Wilhelm Tell“ oder „Die Räuber“ geht es oft um Freiheit und Gerechtigkeit.",
        B2: "Friedrich Schiller (1759–1805) gilt neben Goethe als der bedeutendste deutsche Dramatiker der Klassik. Seine Werke, darunter „Die Räuber“ und „Wilhelm Tell“, beschäftigen sich intensiv mit Freiheit, Moral und dem Widerstand gegen Unterdrückung.",
        C1: "Schillers dramatisches Werk, geprägt vom Ideal der Freiheit und moralischen Selbstbestimmung, machte ihn zu einer der zentralen Figuren der Weimarer Klassik — seine enge Zusammenarbeit mit Goethe gilt bis heute als einer der fruchtbarsten literarischen Dialoge der deutschen Geschichte.",
        C2: "Als Verfechter des Idealismus und der ästhetischen Erziehung des Menschen entwarf Schiller in seinen Dramen und philosophischen Schriften ein Menschenbild, das Freiheit und Sittlichkeit untrennbar miteinander verband — ein Vermächtnis, das die deutsche Geistesgeschichte nachhaltig prägte.",
      },
    },
    {
      id: "einstein", name: "Albert Einstein", years: "1879–1955",
      img: portraitSvg("AE", "#4A90D9", "#7FC4D4", "🧠"),
      levels: {
        A1: "Einstein war ein berühmter deutscher Wissenschaftler. Er hat die Relativitätstheorie entdeckt. Er hat den Nobelpreis gewonnen.",
        A2: "Albert Einstein war ein deutscher Physiker. Er ist sehr berühmt für seine Relativitätstheorie. Später ist er in die USA ausgewandert.",
        B1: "Albert Einstein zählt zu den bedeutendsten Physikern der Geschichte. Mit seiner Relativitätstheorie veränderte er das Verständnis von Raum und Zeit. 1921 erhielt er den Nobelpreis für Physik.",
        B2: "Albert Einstein (1879–1955), geboren in Ulm, revolutionierte mit der Relativitätstheorie das physikalische Weltbild grundlegend. Wegen seiner jüdischen Herkunft musste er 1933 vor den Nationalsozialisten in die USA fliehen.",
        C1: "Einsteins Relativitätstheorie stellte die klassische, newtonsche Physik grundlegend infrage und legte den Grundstein für die moderne theoretische Physik — sein Schicksal als Emigrant vor dem NS-Regime macht ihn zugleich zu einer zentralen Figur deutscher Geschichte des 20. Jahrhunderts.",
        C2: "Die von Einstein begründete Relativitätstheorie markiert einen der fundamentalsten Paradigmenwechsel der Naturwissenschaften und verschmilzt in seiner Biografie mit der Tragik der Emigration — eine Verbindung wissenschaftlichen Genies mit dem dunkelsten Kapitel deutscher Geschichte.",
      },
    },
    {
      id: "bach", name: "Johann Sebastian Bach", years: "1685–1750",
      img: portraitSvg("JB", "#E8825F", "#F2B84B", "🎼"),
      levels: {
        A1: "Bach war ein berühmter deutscher Musiker. Er hat viele Musikstücke geschrieben. Seine Musik ist heute noch bekannt.",
        A2: "Johann Sebastian Bach war ein deutscher Komponist. Er hat sehr viel Musik geschrieben, vor allem Kirchenmusik. Seine Musik wird bis heute gespielt.",
        B1: "Johann Sebastian Bach gilt als einer der bedeutendsten Komponisten der Musikgeschichte. Er schrieb hunderte Werke, besonders Kirchenmusik und Orgelstücke. Sein Werk beeinflusste die gesamte westliche Musik.",
        B2: "Johann Sebastian Bach (1685–1750) prägte mit seinem umfangreichen Werk — von Kantaten über Orgelmusik bis zu den Brandenburgischen Konzerten — die Musikgeschichte nachhaltig und gilt als Höhepunkt der Barockmusik.",
        C1: "Bachs kontrapunktische Meisterschaft und sein enormes kompositorisches Schaffen, das nahezu alle Gattungen seiner Zeit umfasst, machen ihn zu einer Schlüsselfigur der Musikgeschichte, deren Einfluss von Mozart bis in die heutige Kompositionslehre reicht.",
        C2: "In der Verschmelzung kontrapunktischer Komplexität mit tiefer geistlicher Ausdruckskraft erreicht Bachs Œuvre eine kompositorische Vollendung, die die Barockmusik zu ihrem Höhepunkt führte und als fundamentaler Bezugspunkt der abendländischen Musiktradition bis heute fortwirkt.",
      },
    },
  ];
  const SCHNEE_ENTRIES = [
    {
      id: "faxgeraet", name: "Das Faxgerät im Büroalltag",
      img: portraitSvg("📠", "#7FB87A", "#5BA8A0", "📠"),
      levels: {
        A1: "Früher hatten viele Büros ein Faxgerät. Man hat damit Papiere an andere Orte geschickt. Heute nutzen die meisten Menschen E-Mails.",
        A2: "Früher war das Faxgerät in fast jedem Büro zu finden. Damit konnte man Dokumente über die Telefonleitung an andere Orte senden. Heute wird das Faxgerät kaum noch benutzt, weil E-Mails viel schneller sind.",
        B1: "Das Faxgerät war jahrzehntelang ein fester Bestandteil des deutschen Büroalltags. Über die Telefonleitung wurden Dokumente sofort an andere Orte übertragen. Mit der Verbreitung von E-Mail und digitalen Dokumenten ist das Fax heute weitgehend aus dem Alltag verschwunden.",
        B2: "Über Jahrzehnte hinweg galt das Faxgerät als unverzichtbares Kommunikationsmittel in deutschen Büros und Behörden. Es ermöglichte die sofortige Übertragung von Dokumenten über die Telefonleitung. Erst mit der zunehmenden Digitalisierung wurde es fast vollständig durch E-Mail und elektronische Dokumente abgelöst.",
        C1: "Kaum ein Gerät verkörpert den Wandel der deutschen Bürokommunikation so deutlich wie das Faxgerät: einst als effizientes, sofortiges Übertragungsmittel geschätzt, wurde es mit dem Siegeszug digitaler Kommunikation binnen weniger Jahre nahezu vollständig verdrängt — mancherorts hält sich der „Faxzwang“ in Behörden bis heute hartnäckig.",
        C2: "Das Faxgerät steht exemplarisch für jene technischen Übergangsphänomene, die eine Ära prägten und binnen kürzester Zeit durch überlegene digitale Alternativen obsolet wurden — ein Umstand, den insbesondere die fortdauernde behördliche Anhänglichkeit an das Fax in Deutschland auf bemerkenswerte Weise konterkariert.",
      },
    },
    {
      id: "schreibmaschine", name: "Die Schreibmaschine",
      img: portraitSvg("⌨️", "#E85F6F", "#E8825F", "⌨️"),
      levels: {
        A1: "Früher haben Menschen mit einer Schreibmaschine geschrieben. Es gab keine Computer. Heute schreibt man meistens am Computer.",
        A2: "Vor dem Computer war die Schreibmaschine das wichtigste Gerät zum Schreiben von Briefen und Texten. Man musste jeden Buchstaben mit einer Taste anschlagen. Heute wird sie fast nicht mehr benutzt.",
        B1: "Die Schreibmaschine war jahrzehntelang unverzichtbar in Büros, Redaktionen und Haushalten. Texte wurden mechanisch Buchstabe für Buchstabe getippt, Fehler waren mühsam zu korrigieren. Der Computer hat sie fast vollständig verdrängt.",
        B2: "Bis in die 1980er-Jahre war die Schreibmaschine das zentrale Schreibgerät in deutschen Büros und Privathaushalten. Anders als am Computer ließen sich Tippfehler nur mühsam korrigieren, was eine ganz andere Schreibdisziplin erforderte. Mit dem PC verschwand sie fast vollständig.",
        C1: "Die Schreibmaschine prägte über ein Jahrhundert lang die Schreibkultur — ihre mechanischen Grenzen erzwangen eine Sorgfalt und Disziplin beim Formulieren, die mit der beliebigen Korrigierbarkeit digitaler Texte weitgehend verloren gegangen ist.",
        C2: "Als Verkörperung einer analogen Schreibkultur, deren mechanische Unerbittlichkeit zu einer eigenen Form gedanklicher Disziplin zwang, steht die Schreibmaschine sinnbildlich für einen Verlust an Langsamkeit und Sorgfalt, den die digitale Beliebigkeit des Textverarbeitungszeitalters mit sich brachte.",
      },
    },
    {
      id: "telefonzelle", name: "Die Telefonzelle",
      img: portraitSvg("☎️", "#F2B84B", "#E8D34B", "☎️"),
      levels: {
        A1: "Früher gab es viele Telefonzellen auf der Straße. Man konnte dort mit Münzen telefonieren. Heute gibt es fast keine mehr, weil alle ein Handy haben.",
        A2: "Telefonzellen standen früher an vielen Straßenecken in Deutschland. Mit Münzen oder einer Telefonkarte konnte man von dort aus telefonieren. Seit fast jeder ein Handy hat, sind sie fast verschwunden.",
        B1: "Die gelbe Telefonzelle gehörte jahrzehntelang zum typischen deutschen Straßenbild. Wer unterwegs telefonieren wollte, musste dort mit Münzen oder Telefonkarte bezahlen. Mit der Verbreitung von Mobiltelefonen wurden die meisten abgebaut.",
        B2: "Die Telefonzelle war bis in die 1990er-Jahre ein unverzichtbarer Bestandteil der öffentlichen Infrastruktur in Deutschland. Sie ermöglichte unterwegs Erreichbarkeit, lange bevor Mobiltelefone erschwinglich wurden. Heute erinnern nur noch vereinzelte, oft umfunktionierte Zellen an diese Zeit.",
        C1: "Die einst allgegenwärtige Telefonzelle steht sinnbildlich für eine Ära, in der Erreichbarkeit an feste Orte gebunden war — ihr fast vollständiges Verschwinden binnen weniger Jahrzehnte veranschaulicht, wie radikal die mobile Kommunikation den öffentlichen Raum verändert hat.",
        C2: "Als Relikt einer ortsgebundenen Kommunikationskultur markiert die Telefonzelle den Übergang zu einer Gesellschaft permanenter Erreichbarkeit — ihr Verschwinden aus dem Stadtbild dokumentiert eindrücklich die Geschwindigkeit technologischen und sozialen Wandels der letzten Jahrzehnte.",
      },
    },
    {
      id: "musikkassette", name: "Die Musikkassette",
      img: portraitSvg("📼", "#B084CC", "#A875D8", "📼"),
      levels: {
        A1: "Früher haben Menschen Musik auf Kassetten gehört. Man konnte Lieder selbst aufnehmen. Heute streamt man Musik über das Handy.",
        A2: "Die Musikkassette war früher sehr beliebt, um Musik zu hören und aufzunehmen. Viele Menschen haben sich eigene Mixtapes gemacht. Heute wird Musik meistens gestreamt.",
        B1: "Die Musikkassette prägte jahrzehntelang das Musikhören in Deutschland. Man konnte Lieder vom Radio aufnehmen oder eigene Zusammenstellungen, sogenannte Mixtapes, erstellen. Heute hat Streaming diese Technik fast vollständig abgelöst.",
        B2: "Von den 1970er- bis in die 1990er-Jahre war die Musikkassette das dominierende Format für privaten Musikgenuss in Deutschland. Besonders beliebt war das persönliche Zusammenstellen von Mixtapes für Freunde. Digitales Streaming hat sie heute fast völlig verdrängt.",
        C1: "Die Musikkassette ermöglichte erstmals einer breiten Öffentlichkeit, Musik selbst zusammenzustellen und weiterzugeben — die Kultur des selbstgemachten Mixtapes gilt vielen als eine persönlichere, verlorene Vorstufe heutiger digitaler Playlists.",
        C2: "Als demokratisierendes Medium eröffnete die Musikkassette erstmals eine partizipative Aneignung von Musikkultur durch selbst kuratierte Mixtapes — ein Stück analoger Handwerklichkeit und persönlicher Widmung, das im algorithmisch generierten Playlist-Zeitalter kaum eine Entsprechung findet.",
      },
    },
  ];
  // Zeigt zuerst eine kleine Kachel-Galerie (Bild, Name, Jahre/Kurztitel) — antippen öffnet die
  // ausführliche Detail-Ansicht mit Niveau-Umschalter für genau diesen einen Eintrag.
  function renderTileGallery(area, entries, openIdVar, setOpenIdVar, levelVar, setLevelVar, iconEmoji, subheading) {
    const openId = openIdVar();
    if (openId) {
      const entry = entries.find((e) => e.id === openId);
      if (entry) { renderEntryDetail(area, entries, entry, openIdVar, setOpenIdVar, levelVar, setLevelVar, iconEmoji, subheading); return; }
    }
    area.innerHTML = `
      <p class="empty-note" style="margin-bottom:14px;">${subheading}</p>
      <div class="kompass-tile-grid">
        ${entries.map((entry) => `
          <button type="button" class="kompass-tile" data-tile-id="${entry.id}">
            <div class="kompass-tile-img">${entry.img}</div>
            <span class="kompass-tile-name">${entry.name}</span>
            ${entry.years ? `<span class="kompass-tile-years">${entry.years}</span>` : ""}
          </button>`).join("")}
      </div>
    `;
    area.querySelectorAll("[data-tile-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        // WICHTIG — behebt den gemeldeten Bug: beim Öffnen einer Kachel wird die Detail-Ansicht
        // eingesetzt, die deutlich kürzer ist als die volle Kachel-Galerie darüber/darunter. War
        // man vorher weit unten gescrollt (z. B. bei einer Kachel spät in der Liste), lag diese
        // Scroll-Position danach außerhalb des jetzt viel kürzeren Dokuments — der Browser springt
        // dann von selbst nach oben. Beim Zurückkehren zur Galerie (siehe "Zurück"-Knopf unten)
        // wird dieselbe Position wiederhergestellt, statt oben zu landen.
        kompassTileScrollY = window.scrollY;
        setOpenIdVar(btn.dataset.tileId);
        renderTileGallery(area, entries, openIdVar, setOpenIdVar, levelVar, setLevelVar, iconEmoji, subheading);
      });
    });
  }
  function renderEntryDetail(area, entries, entry, openIdVar, setOpenIdVar, levelVar, setLevelVar, iconEmoji, subheading) {
    const level = levelVar();
    area.innerHTML = `
      <button type="button" class="btn btn-ghost tile-back-btn" style="margin-bottom:12px;">◀ Zurück zur Übersicht</button>
      <div class="question-card">
        <div style="display:flex; gap:14px; align-items:center; margin-bottom:10px;">
          <div style="width:64px; height:64px; flex-shrink:0; border-radius:var(--radius-sm); overflow:hidden;">${entry.img}</div>
          <div>
            <p class="eyebrow" style="margin:0;">${iconEmoji} ${entry.name}</p>
            ${entry.years ? `<p class="empty-note" style="margin:2px 0 0;">${entry.years}</p>` : ""}
          </div>
        </div>
        <div class="trophy-case" style="margin:10px 0; flex-wrap:nowrap; overflow-x:auto; justify-content:flex-start; padding-bottom:2px;">
          ${["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => `<button type="button" class="trophy-chip level-switch-btn" data-level="${lvl}" style="${lvl === level ? "background:var(--amber-400); color:#241505;" : ""}">${lvl}</button>`).join("")}
        </div>
        <p style="margin-top:8px;">${entry.levels[level]}</p>
      </div>
    `;
    // WICHTIG — behebt einen echten Bug: bei zwei gleichzeitig auf derselben Seite gerenderten
    // Bereichen (Dichter&Denker UND Schnee von gestern, beide jetzt im Kompass integriert) gab
    // es zwei Elemente mit derselben globalen ID "tileBackBtn" — document.getElementById fand
    // dabei immer nur das ERSTE, sodass der "Zurück"-Knopf im zweiten Bereich nie funktionierte.
    // area.querySelector() sucht jetzt gezielt nur innerhalb des eigenen, aufrufenden Bereichs.
    area.querySelector(".tile-back-btn").addEventListener("click", () => {
      setOpenIdVar(null);
      renderTileGallery(area, entries, openIdVar, setOpenIdVar, levelVar, setLevelVar, iconEmoji, subheading);
      // WICHTIG — ein einzelnes requestAnimationFrame reichte nicht zuverlässig aus (rund 2%
      // Restabweichung gemessen): der Browser hatte das neue, wieder hohe Layout offenbar nicht
      // in jedem Fall schon vollständig fertig, wenn der erste Frame lief. Ein zweites,
      // verschachteltes rAF wartet einen kompletten weiteren Frame ab, in dem das Layout
      // garantiert final steht, bevor die Position gesetzt wird.
      requestAnimationFrame(() => { requestAnimationFrame(() => { window.scrollTo({ top: kompassTileScrollY, behavior: "instant" }); }); });
    });
    area.querySelectorAll(".level-switch-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLevelVar(btn.dataset.level);
        renderEntryDetail(area, entries, entry, openIdVar, setOpenIdVar, levelVar, setLevelVar, iconEmoji, subheading);
      });
    });
  }
  function renderDichterUndDenker() {
    const area = document.getElementById("dichterArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "dichter_und_denker", "Dichter & Denker", "✒️")) return;
    dichterLevel = applyDefaultCefrLevel(dichterLevel, (v) => { dichterLevel = v; });
    renderTileGallery(area, DICHTER_ENTRIES, () => kompassDichterOpenId, (v) => { kompassDichterOpenId = v; }, () => dichterLevel, (v) => { dichterLevel = v; }, "✒️",
      "Berühmte deutsche Persönlichkeiten aus Literatur, Wissenschaft und Kultur — mit wählbarem Sprachniveau, genau wie „Es war einmal in Deutschland“.");
  }
  function renderSchneeVonGestern() {
    const area = document.getElementById("schneeArea");
    if (!area) return;
    if (!renderComingSoonGate(area, "schnee_von_gestern", "Schnee von gestern", "❄️")) return;
    schneeLevel = applyDefaultCefrLevel(schneeLevel, (v) => { schneeLevel = v; });
    renderTileGallery(area, SCHNEE_ENTRIES, () => kompassSchneeOpenId, (v) => { kompassSchneeOpenId = v; }, () => schneeLevel, (v) => { schneeLevel = v; }, "❄️",
      "Dinge, die früher typisch deutsch waren, heute aber nicht mehr dazugehören — mit wählbarem Sprachniveau.");
  }
  document.querySelector('#knowledgeSubnav [data-sub="sub-dichter"]')?.addEventListener("click", renderDichterUndDenker);
  document.querySelector('#knowledgeSubnav [data-sub="sub-schnee"]')?.addEventListener("click", renderSchneeVonGestern);
  function renderHowItWorks() {
    const area = document.getElementById("howItWorksArea");
    if (!area) return;
    area.innerHTML = `
      <p class="empty-note" style="margin-bottom:14px;">Eine kurze Erklärung, wie die Seite unter der Haube funktioniert — was passiert eigentlich, wenn du Kategorien auswählst und spielst?</p>

      <div class="material-card">
        <h3>🎯 Was passiert, wenn ich Kategorien auswähle?</h3>
        <p>Jede Übungskategorie gehört zu einer von vier Gruppen: <strong>Grammatik</strong> (z. B. Artikel, Zeitformen, Nebensatz-Konjunktionen), <strong>Wortschatz</strong> (z. B. Synonyme, Redewendungen, Themenwortschatz), <strong>Logik</strong> (z. B. wenn/ob/falls, als/wie) und <strong>Quiz</strong> (Deutschland-Wissen). Je mehr du innerhalb einer Gruppe spielst, desto mehr "fällst du in dieses Profil" — die Seite erkennt automatisch, worauf du gerade deinen Schwerpunkt legst.</p>
      </div>

      <div class="material-card">
        <h3>💪 Wie erkennt die Seite meine Schwächen?</h3>
        <p>Auf zwei Wegen: Erstens automatisch — wenn deine Trefferquote in einer Kategorie niedriger ist als in anderen, merkt sich die Seite das. Zweitens selbst eingeschätzt — in den Einstellungen kannst du pro Kategorie angeben, ob du dich "stark", "mittel" oder "schwach" fühlst. Diese Selbsteinschätzung hat Vorrang vor der automatischen Erkennung, weil du dich selbst am besten kennst.</p>
      </div>

      <div class="material-card">
        <h3>🎯 Was bringt mir das für die Tagesaufgabe?</h3>
        <p>Deine tägliche Kalenderblatt-Aufgabe wird nicht komplett zufällig gewählt — sie orientiert sich, wo möglich, an genau der Kategorie, die als deine aktuelle Schwäche erkannt wurde (ob selbst eingeschätzt oder automatisch). So übst du automatisch öfter genau das, was dir am meisten bringt, ohne dass du selbst daran denken musst.</p>
      </div>

      <div class="material-card">
        <h3>⭐ Wie funktionieren Punkte und Schwierigkeitsgrade?</h3>
        <p>Für jede richtig gelöste Frage gibt es Punkte, bei manchen Spielen zusätzlich einen kleinen Tempo-Bonus für schnelles, sicheres Antworten. Bei Spielen mit Schwierigkeitsgraden (🟢 Leicht/🟡 Mittel/🔴 Schwer) kannst du frei wählen — es gibt keine Einschränkung, wer welchen Grad spielen darf. Ein höherer Schwierigkeitsgrad bedeutet meist etwas anspruchsvollere Fragen, nicht automatisch mehr Punkte pro Frage.</p>
      </div>

      <div class="material-card">
        <h3>🦊 Was hat es mit den Sammelfiguren auf sich?</h3>
        <p>Beim Spielen sammelst du nach und nach Punkte und Erfolge — damit schaltest du automatisch neue Fuchs-Sammelfiguren frei, die du in deinem Profil sammeln und dir sogar als Profilbild einstellen kannst. Mehr dazu findest du direkt bei den Sammelfiguren in deinem Profil.</p>
        <button type="button" class="btn btn-ghost" data-help-jump="sub-account" style="margin-top:8px;">🦊 Zu den Sammelfiguren springen</button>
      </div>

      <div class="material-card">
        <h3>🏆 Orden und Pokale</h3>
        <p>Nach jeder Runde bekommst du einen Titel, zusammengesetzt aus deinem "Charakter" (welche Kategorien du gespielt hast) und deiner "Stufe" (wie gut du warst) — z. B. "Grammatik-Profi – Superheld". Die zwei höchsten Stufen zählen als 🏆 Pokal, alles darunter als 🎖️ Orden. Antippen zeigt dir genau, wie du sie verdient hast.</p>
        <button type="button" class="btn btn-ghost" data-help-jump="sub-missions" style="margin-top:8px;">🏆 Zu den Missionen springen</button>
      </div>

      <div class="material-card">
        <h3>👤 Wie ist mein Profil aufgebaut?</h3>
        <ul style="margin:0; padding-left:18px;">
          <li><strong>Profil</strong> — dein Steckbrief, Punkte, Vitrine, Sammelfiguren-Vorschau, Interview-Vorschau</li>
          <li><strong>Freunde</strong> — wen du kennst, Duelle, Online-Status</li>
          <li><strong>Ranking</strong> — wer heute/insgesamt vorn liegt, plus "Fuchs des Tages" (siehe unten)</li>
          <li><strong>Postfach</strong> — private Nachrichten, auch von Alex/dem Team</li>
          <li><strong>Gästebuch</strong> — öffentliche Grüße und Bewertungen</li>
          <li><strong>Interview</strong> — persönliche Fragen, ab 150 Punkten freigeschaltet</li>
          <li><strong>Sticker-Album</strong> — die vollständige Fuchs-Sammlung im Überblick</li>
          <li><strong>Design</strong> — das Aussehen der ganzen Seite ändern</li>
          <li><strong>Einstellungen</strong> — Benachrichtigungen, Sprachniveau, Seite teilen</li>
        </ul>
        <button type="button" class="btn btn-ghost" data-help-jump="sub-account" style="margin-top:8px;">👤 Zum Profil springen</button>
      </div>

      <div class="material-card">
        <h3>🎖️ Was bedeuten die kleinen Namens-Abzeichen?</h3>
        <p class="empty-note" style="margin-bottom:10px;">Falls du bei jemandem so ein Abzeichen neben dem Namen siehst — hier die Erklärung, damit du dich nicht wundern musst:</p>
        <div class="breakdown-list">
          <div class="breakdown-row"><span>${adminBadge(false, true, false)}</span><span class="empty-note">Betreibt die Seite</span></div>
          <div class="breakdown-row"><span>${adminBadge(true, false, false)}</span><span class="empty-note">Verwaltet die Seite</span></div>
          <div class="breakdown-row"><span>${adminBadge(false, false, true)}</span><span class="empty-note">Moderiert Inhalte</span></div>
          <div class="breakdown-row"><span>${adminBadge(false, false, false, false, true)}</span><span class="empty-note">Baut die Seite aktiv mit auf</span></div>
          <div class="breakdown-row"><span>${adminBadge(false, false, false, true)}</span><span class="empty-note">Testet neue Funktionen vorab</span></div>
          <div class="breakdown-row"><span>${adminBadge(false, false, false, false, false, true)}</span><span class="empty-note">Hat die Seite unterstützt</span></div>
        </div>
      </div>

      <div class="material-card">
        <h3>🦊 Was ist "Fuchs des Tages"?</h3>
        <p>Jeden Tag wird automatisch berechnet, wer am aktivsten war — nicht nur nach Punkten, sondern auch nach eingereichten Beiträgen, Platz 1 im Ranking und ob die Seite geteilt wurde. Wer gewinnt, bekommt Bonuspunkte UND eine kleine Zeugnis-artige Vorstellung mit Begründung. Vergangene Gewinner:innen stehen in der Hall of Fame.</p>
        <button type="button" class="btn btn-ghost" data-help-jump="sub-ranking" style="margin-top:8px;">🦊 Zu "Fuchs des Tages" springen</button>
      </div>

      <div class="material-card">
        <h3>✍️ Wie kann ich selbst etwas beitragen?</h3>
        <p>Du kannst eigene Lesetexte einreichen und Links vorschlagen — alles wird von Alex geprüft, bevor es öffentlich sichtbar wird. Für bestätigte Beiträge gibt's teilweise sogar Bonuspunkte.</p>
        <button type="button" class="btn btn-ghost" data-help-jump="sub-community" style="margin-top:8px;">✍️ Eigene Beiträge findest du hier</button>
      </div>

      <div class="material-card">
        <h3>💡 Was ist das Schwarmwissen?</h3>
        <p>Hier trägt die ganze Community wertvolle Tipps zusammen — von Lernenden für Lernende: was beim Deutschlernen bei anderen funktioniert hat, hilfreiche Links, kleine Tricks für schwierige Themen. Teil gerne selbst etwas, das dir geholfen hat, oder stöber durch das, was andere schon gesammelt haben.</p>
        <button type="button" class="btn btn-ghost" data-help-jump="sub-tips" style="margin-top:8px;">💡 Zum Schwarmwissen springen</button>
      </div>
    `;
    // Zuordnung: welcher Unterreiter gehört zu welchem Hauptreiter — nötig, damit der Sprung-Link
    // zuerst den richtigen Hauptreiter aktiviert, bevor der Unterreiter selbst angeklickt wird.
    const SUB_TO_MAIN_TAB = {
      "sub-account": "view-profile", "sub-friends": "view-profile", "sub-ranking": "view-profile",
      "sub-inbox": "view-profile", "sub-guestbook": "view-profile", "sub-interview": "view-profile",
      "sub-album": "view-profile", "sub-design": "view-profile", "sub-settings": "view-profile",
      "sub-community": "view-knowledge", "sub-links": "view-knowledge", "sub-tips": "view-knowledge",
      "sub-music": "view-knowledge", "sub-news": "view-knowledge", "sub-kompass": "view-knowledge",
      "sub-missions": "view-learn", "sub-exercises": "view-learn",
    };
    area.querySelectorAll("[data-help-jump]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.helpJump;
        const mainTab = SUB_TO_MAIN_TAB[target] || "view-profile";
        document.querySelector(`[data-target="${mainTab}"]`)?.click();
        setTimeout(() => {
          const subnavId = mainTab === "view-profile" ? "profileSubnav" : mainTab === "view-learn" ? "learnSubnav" : "knowledgeSubnav";
          document.querySelector(`#${subnavId} [data-sub="${target}"]`)?.click();
        }, 150);
      });
    });
  }
  document.querySelector('#knowledgeSubnav [data-sub="sub-howitworks"]')?.addEventListener("click", renderHowItWorks);
  document.querySelector('#knowledgeSubnav [data-sub="sub-kompass"]')?.addEventListener("click", renderKompass);

  const LOGIN_PLACEHOLDER_SVG = `<svg class="site-banner-svg" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="loginGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f2b84b"/><stop offset="100%" stop-color="#e8825f"/>
    </linearGradient></defs>
    <rect width="400" height="120" fill="url(#loginGrad)"/>
    <circle cx="60" cy="90" r="26" fill="rgba(255,255,255,0.1)"/>
    <circle cx="340" cy="20" r="22" fill="rgba(255,255,255,0.1)"/>
    <text x="200" y="55" text-anchor="middle" font-size="30" font-family="sans-serif">🦊👋</text>
    <text x="200" y="90" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="sans-serif">Willkommen!</text>
  </svg>`;
  const WISSEN_PLACEHOLDER_SVG = `<svg class="site-banner-svg" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="wissenGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4fa88e"/><stop offset="100%" stop-color="#3ec6c6"/>
    </linearGradient></defs>
    <rect width="400" height="120" fill="url(#wissenGrad)"/>
    <circle cx="350" cy="25" r="30" fill="rgba(255,255,255,0.1)"/>
    <circle cx="40" cy="90" r="18" fill="rgba(255,255,255,0.1)"/>
    <text x="200" y="55" text-anchor="middle" font-size="30" font-family="sans-serif">🧭</text>
    <text x="200" y="90" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="sans-serif">Wissen &amp; Kompass</text>
  </svg>`;
  // Kachel-Übersicht aller Spiele — ersetzt die frühere lange Liste einzelner Knöpfe direkt im
  // Hauptmenü. Jede Kachel simuliert beim Antippen einen Klick auf den zugehörigen, jetzt
  // unsichtbaren Original-Knopf (siehe index.html) — das behält alle dort schon registrierten
  // Klick-Listener bei, ohne dass jeder einzeln umgebaut werden musste.
  // Alphabetisch nach Name sortiert (vorher zufällig/nach Bauzeit geordnet — wirkte durcheinander,
  // z. B. stand der Betonungs-Trainer ganz unten statt einsortiert).
  // WICHTIG — behebt einen echten Bug: die Kacheln für noch nicht freigegebene, neue Spiele
  // (flagKey gesetzt) erschienen hier bisher UNBEDINGT für alle — auch wenn das Spiel selbst beim
  // Antippen nur "kommt bald" zeigte, verriet schon der sichtbare Name in der Liste, dass es
  // existiert. Ältere, längst etablierte Spiele (kein flagKey) bleiben immer sichtbar; neue,
  // ausdrücklich noch nicht freigegebene Spiele werden weiter unten in renderGamesOverview()
  // komplett aus der Liste gefiltert, bis der Flag aktiv angeschaltet ist (oder man
  // Beta-Tester:in/Admin ist).
  const GAMES_OVERVIEW_LIST = [
    { sub: "sub-stresstrainer", emoji: "🎯", name: "Betonungs-Trainer", persona: "Sprachkünstler" },
    { sub: "sub-wordsearch", emoji: "🔍", name: "Buchstabensalat", persona: "Sprachkünstler" },
    { sub: "sub-korrektour", emoji: "🚂", name: "KorrekTour", persona: "Grammatik-Profi", flagKey: "korrektour_neu" },
    { sub: "sub-crossword", emoji: "✏️", name: "Kreuzworträtsel", persona: "Sprachkünstler" },
    { sub: "sub-memory", emoji: "🧩", name: "Memory", persona: "Sprachkünstler" },
    { sub: "sub-satzpuzzle", emoji: "🧩", name: "Satzpuzzle", persona: "Grammatik-Profi" },
    { sub: "sub-vokabelmeister", emoji: "🔤", name: "Vokabelmeister", persona: "Sprachkünstler", flagKey: "vokabelmeister_neu" },
    { sub: "sub-wackelturm", emoji: "🗼", name: "Wackelturm", persona: "Gemischt" },
    { sub: "sub-werbinich", emoji: "❓", name: "Wer bin ich?", persona: "Logiker" },
    { sub: "sub-wordbuild", emoji: "🔤", name: "Wortbaustelle", persona: "Sprachkünstler" },
    { sub: "sub-bubbles", emoji: "🫧", name: "Wortblasen", persona: "Gemischt", flagKey: "wortblasen_neu" },
    { sub: "sub-kanone", emoji: "🎯", name: "Wort-Kanone", persona: "Gemischt", flagKey: "wortkanone_redesign" },
    { sub: "sub-wortarten", emoji: "🔤", name: "Wort-Typ", persona: "Grammatik-Profi" },
  ];
  // WICHTIG — wie gewünscht: eigens gestaltete SVG-Symbole statt normaler Emoji für jedes Spiel
  // in der Übersicht. Jedes Symbol ist eine kleine, selbst gezeichnete Szene aus einfachen
  // geometrischen Formen (Kreise, Rechtecke, Pfade) statt eines Systemschrift-Emojis — passend
  // zum jeweiligen Spielthema.
  function gameIconSvg(key) {
    const icons = {
      stresstrainer: `<circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
      wordsearch: `<circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14.8 14.8L20 20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`,
      korrektour: `<rect x="3" y="9" width="14" height="8" rx="2" fill="currentColor"/><rect x="6" y="4" width="5" height="6" rx="1" fill="currentColor"/><circle cx="7" cy="19" r="1.8" fill="currentColor"/><circle cx="14" cy="19" r="1.8" fill="currentColor"/><path d="M17 12h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
      crossword: `<rect x="3" y="3" width="6" height="6" fill="currentColor"/><rect x="10" y="3" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="10" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="10" y="10" width="6" height="6" fill="currentColor"/>`,
      memory: `<rect x="2" y="4" width="8" height="11" rx="1.5" fill="currentColor"/><rect x="12" y="6" width="8" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 9v5M13.5 11.5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
      satzpuzzle: `<path d="M4 4h6v2.5a1.5 1.5 0 0 0 3 0V4h6v6h-2.5a1.5 1.5 0 0 0 0 3H19v6h-6v-2.5a1.5 1.5 0 0 0-3 0V19H4v-6h2.5a1.5 1.5 0 0 0 0-3H4Z" fill="currentColor"/>`,
      vokabelmeister: `<rect x="4" y="3" width="14" height="17" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
      wackelturm: `<rect x="5" y="15" width="12" height="4" rx="1" fill="currentColor"/><rect x="6.5" y="9.5" width="9" height="4" rx="1" fill="currentColor" opacity="0.7"/><rect x="8" y="4" width="6" height="4" rx="1" fill="currentColor" opacity="0.45"/>`,
      werbinich: `<circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.3 8.8c0-1.7 1.3-2.8 2.9-2.8s2.7 1 2.7 2.4c0 1.6-1.6 1.9-2.4 3.2-.3.5-.4 1-.4 1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/><circle cx="11" cy="16" r="1" fill="currentColor"/>`,
      wordbuild: `<rect x="3" y="13" width="6" height="6" rx="1" fill="currentColor"/><rect x="10" y="13" width="6" height="6" rx="1" fill="currentColor" opacity="0.65"/><rect x="6.5" y="6" width="6" height="6" rx="1" fill="currentColor" opacity="0.85"/>`,
      bubbles: `<circle cx="8" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="15" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><ellipse cx="6" cy="7" rx="1.4" ry="0.9" fill="currentColor"/>`,
      kanone: `<circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="11" cy="11" r="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="11" cy="11" r="1.6" fill="currentColor"/>`,
      wortarten: `<rect x="3" y="4" width="7" height="7" rx="1.5" fill="currentColor"/><circle cx="16" cy="7.5" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 19l4-8 4 8M5.4 16.5h5.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    };
    return `<svg viewBox="0 0 22 22" width="26" height="26" aria-hidden="true">${icons[key] || ""}</svg>`;
  }
  function renderGamesOverview() {
    const area = document.getElementById("gamesOverviewArea");
    if (!area) return;
    // Nur Spiele ohne eigenen flagKey (längst etablierte Spiele) oder mit einem AKTIV
    // freigeschalteten Flag anzeigen — noch nicht freigegebene, neue Spiele sollen für normale
    // Nutzer:innen nicht mal als Menüpunkt sichtbar sein, nicht nur beim Antippen gesperrt.
    // WICHTIG: canModerate() zusätzlich zu isFeatureOn() geprüft — sonst wäre die Liste
    // inkonsistent mit renderComingSoonGate() selbst (das ja auch Admins/Moderator:innen immer
    // durchlässt, nicht nur Owner/Beta-Tester:innen wie isFeatureOn() allein).
    const canSeeGatedGames = Backend.canModerate && Backend.canModerate();
    const visibleGames = GAMES_OVERVIEW_LIST.filter((g) => !g.flagKey || Backend.isFeatureOn(g.flagKey) || canSeeGatedGames);
    // WICHTIG — behebt einen echten Bug: vorher wurden hier dieselben .kompass-tile-Klassen wie
    // bei Dichter & Denker/Schnee von gestern verwendet — als das Kachel-Design für JENE Bereiche
    // gebaut wurde, verwandelten sich diese Spiele-Buttons ungewollt gleich mit in Kacheln, obwohl
    // sie wie vorher als Pillen (schmale, breite Reihen mit Emoji+Name nebeneinander) aussehen
    // sollten. Jetzt eigene Klassen, unabhängig vom Kompass-Kachel-Design.
    area.innerHTML = `
      <p class="empty-note" style="margin-bottom:14px;">Alle Spiele an einem Ort — antippen zum Loslegen.</p>
      <div class="games-pill-list">
        ${visibleGames.map((g) => `
          <button type="button" class="games-pill" data-game-sub="${g.sub}">
            <span class="games-pill-emoji">${gameIconSvg(g.sub.replace("sub-", ""))}</span>
            <span class="games-pill-name">${g.name}</span>
            <span class="subnav-cat-tag" data-persona="${g.persona}" title="${g.persona}"></span>
          </button>`).join("")}
      </div>
    `;
    area.querySelectorAll("[data-game-sub]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelector(`#learnSubnav [data-sub="${btn.dataset.gameSub}"]`)?.click();
      });
    });
  }
  document.querySelector('#learnSubnav [data-sub="sub-games"]')?.addEventListener("click", renderGamesOverview);
  async function renderKompass() {
    const bannerUrl = await Backend.getEffectiveBannerUrl("wissen_banner");
    // Automatisches Tracking: sobald jemand hier war, gilt "Es war einmal in Deutschland" als
    // gelesen — kein extra "Ich hab's gelesen"-Knopf nötig, für Missionen, die das voraussetzen.
    const visitedProfile = Backend.currentProfile();
    if (visitedProfile) {
      const visited = (visitedProfile.extraProfileData && visitedProfile.extraProfileData.visitedSections) || [];
      if (!visited.includes("es-war-einmal")) {
        await Backend.updateExtraProfileField("visitedSections", [...visited, "es-war-einmal"]);
      }
    }
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const todayHistory = ExerciseData.germanHistoryForToday(`${mm}-${dd}`);
    // WICHTIG — genau wie bei den neuen Spielen: diese beiden Bereiche sind noch in Arbeit und
    // sollen für normale Nutzer:innen komplett unsichtbar bleiben (kein Wegweiser-Link, keine
    // Überschrift, kein Bereich) — nicht nur beim Öffnen gesperrt sein, siehe
    // renderComingSoonGate() innerhalb von renderDichterUndDenker()/renderSchneeVonGestern().
    // WICHTIG: canModerate() zusätzlich geprüft — konsistent mit renderGamesOverview() (siehe
    // dortiger Kommentar) und mit renderComingSoonGate() selbst, das Admins/Moderator:innen immer
    // durchlässt, nicht nur Owner/Beta-Tester:innen wie isFeatureOn() allein.
    const canSeeGatedSections = Backend.canModerate && Backend.canModerate();
    const dichterVisible = Backend.isFeatureOn("dichter_und_denker") || canSeeGatedSections;
    const schneeVisible = Backend.isFeatureOn("schnee_von_gestern") || canSeeGatedSections;
    kompassArea.innerHTML = `
      <div style="margin:-4px -4px 14px; border-radius:var(--radius-md); overflow:hidden;">${siteBannerHtml("wissen_banner", bannerUrl, WISSEN_PLACEHOLDER_SVG, "Wissen")}</div>
      <div class="wegweiser">
        <a href="#kompass-geschichte" class="wegweiser-item"><span>📜</span>Es war einmal in Deutschland</a>
        <a href="#kompass-redewendungen" class="wegweiser-item"><span>💬</span>Redewendungen</a>
        <a href="#kompass-jugendsprache" class="wegweiser-item"><span>🗣️</span>Umgangssprache &amp; Jugendslang</a>
        <a href="#kompass-partikeln" class="wegweiser-item"><span>✨</span>Kleine Wörter, große Wirkung</a>
        ${dichterVisible ? `<a href="#kompass-dichter" class="wegweiser-item"><span>✒️</span>Dichter &amp; Denker</a>` : ""}
        ${schneeVisible ? `<a href="#kompass-schnee" class="wegweiser-item"><span>❄️</span>Schnee von gestern</a>` : ""}
      </div>

      <h3 id="kompass-geschichte" class="kompass-heading">📜 Es war einmal in Deutschland …</h3>
      ${todayHistory ? (() => { historyLevel = applyDefaultCefrLevel(historyLevel, (v) => { historyLevel = v; }); return ""; })() : ""}
      ${todayHistory ? `
        <div class="question-card" style="margin-bottom:16px;">
          <p class="eyebrow">… vor ${now.getFullYear() - todayHistory.year} Jahren (${todayHistory.year})</p>
          <div class="trophy-case" style="margin:10px 0; flex-wrap:nowrap; overflow-x:auto; justify-content:flex-start; padding-bottom:2px;">
            ${["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => `<button type="button" class="trophy-chip hist-level-btn ${historyLevel === lvl ? "selected" : ""}" data-hist-level="${lvl}">${lvl}</button>`).join("")}
          </div>
          <p style="margin-top:8px;">${todayHistory.levels[historyLevel]}</p>
          ${todayHistory.sideFacts && todayHistory.sideFacts.length ? `
            <p class="eyebrow" style="margin-top:16px;">Außerdem an diesem Tag …</p>
            ${todayHistory.sideFacts.map((f) => `<p class="empty-note" style="margin-top:6px;">${f.year}: ${f.text.replace(/^\d{4}\s*/, "")}</p>`).join("")}
          ` : ""}
          ${todaysBirthdayGreeting(`${mm}-${dd}`) ? `<p style="margin-top:12px; font-weight:700;">🎂 Heute ist übrigens auch dein Geburtstag — alles Gute, ${todaysBirthdayGreeting(`${mm}-${dd}`)}!</p>` : ""}
        </div>
      ` : `
        <div class="question-card" style="margin-bottom:16px;">
          <p class="empty-note">Für den heutigen Tag ist noch kein geprüfter Eintrag hinterlegt — diese Sammlung wächst nach und nach, jeder Eintrag wird vorher recherchiert und geprüft.</p>
          ${todaysBirthdayGreeting(`${mm}-${dd}`) ? `<p style="margin-top:12px; font-weight:700;">🎂 Heute ist dein Geburtstag — alles Gute, ${todaysBirthdayGreeting(`${mm}-${dd}`)}!</p>` : ""}
        </div>
      `}
      <p class="empty-note" style="margin-bottom:10px;">Eine wachsende, sorgfältig geprüfte Sammlung wichtiger Momente der deutschen Geschichte — jeden Tag ein anderer, wenn ein geprüfter Eintrag für das Datum vorliegt.</p>
      <button type="button" class="btn btn-ghost" id="historyArchiveToggle" style="margin-bottom:16px;">${historyArchiveOpen ? "▲ Archiv schließen" : "📚 Archiv — alle bisherigen Tage ansehen"}</button>
      ${historyArchiveOpen ? `
        <div class="question-card" style="margin-bottom:16px;">
          <div class="vocab-toolbar" style="margin-bottom:10px;"><input type="text" class="vocab-search" id="historyArchiveSearch" placeholder="Nach Titel oder Jahr suchen…" value="${historyArchiveSearch}" /></div>
          <div class="breakdown-list">
            ${ExerciseData.getAllHistoryEntries()
              .filter((e) => !historyArchiveSearch || e.title.toLowerCase().includes(historyArchiveSearch.toLowerCase()) || String(e.year).includes(historyArchiveSearch))
              .map((e) => {
                const [mm2, dd2] = e.monthDay.split("-");
                return `<button type="button" class="breakdown-row breakdown-row-stacked" data-archive-date="${e.monthDay}" style="width:100%; text-align:left; cursor:pointer;"><span>${dd2}.${mm2}. — ${e.title}</span><span class="empty-note">${e.year}</span></button>`;
              }).join("")}
          </div>
          ${ExerciseData.getAllHistoryEntries().length === 0 ? `<p class="empty-note">Noch keine Einträge im Archiv.</p>` : ""}
        </div>
      ` : ""}
      ${historyArchiveDate ? (() => {
        const entry = ExerciseData.getAllHistoryEntries().find((e) => e.monthDay === historyArchiveDate);
        if (!entry) return "";
        const [mm3, dd3] = entry.monthDay.split("-");
        return `
          <div class="question-card" style="margin-bottom:16px; border:1.5px solid var(--teal-400);">
            <p class="eyebrow">📚 Aus dem Archiv: ${dd3}.${mm3}. — vor ${new Date().getFullYear() - entry.year} Jahren (${entry.year})</p>
            <div class="trophy-case" style="margin:10px 0; flex-wrap:nowrap; overflow-x:auto; justify-content:flex-start; padding-bottom:2px;">
              ${["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => `<button type="button" class="trophy-chip hist-archive-level-btn ${historyLevel === lvl ? "selected" : ""}" data-hist-level="${lvl}">${lvl}</button>`).join("")}
            </div>
            <p style="margin-top:8px;">${entry.levels[historyLevel]}</p>
            ${entry.sideFacts && entry.sideFacts.length ? `
              <p class="eyebrow" style="margin-top:16px;">Außerdem an diesem Tag …</p>
              ${entry.sideFacts.map((f) => `<p class="empty-note" style="margin-top:6px;">${f.year}: ${f.text.replace(/^\d{4}\s*/, "")}</p>`).join("")}
            ` : ""}
            <button type="button" class="btn btn-ghost" id="historyArchiveCloseEntry" style="margin-top:10px;">✕ Schließen</button>
          </div>`;
      })() : ""}

      <h3 id="kompass-redewendungen" class="kompass-heading">💬 Redewendungen</h3>
      <p class="empty-note">Eine kleine Auswahl — alle 30 kannst du in „Lernen → Übungen" spielerisch abfragen.</p>
      <div class="kompass-grid">${VocabData.REDEWENDUNGEN_KURZ.map((r) => kompassCard(r.phrase, r.explain, r.example)).join("")}</div>

      <h3 id="kompass-jugendsprache" class="kompass-heading">🗣️ Umgangssprache &amp; Jugendslang</h3>
      <div class="kompass-grid">${VocabData.JUGENDSPRACHE.map((j) => kompassCard(j.word, j.explain, j.example)).join("")}</div>

      <h3 id="kompass-partikeln" class="kompass-heading">✨ Kleine Wörter, große Wirkung</h3>
      <div class="kompass-grid">${VocabData.PARTIKELN.map((p) => kompassCard(p.word, p.explain, p.example, p.syl)).join("")}</div>
      ${dichterVisible ? `<h3 id="kompass-dichter" class="kompass-heading">✒️ Dichter &amp; Denker</h3>
      <div id="dichterArea"></div>` : ""}
      ${schneeVisible ? `<h3 id="kompass-schnee" class="kompass-heading">❄️ Schnee von gestern</h3>
      <div id="schneeArea"></div>` : ""}
    `;
    kompassArea.querySelectorAll(".hist-level-btn").forEach((btn) => {
      btn.addEventListener("click", () => { historyLevel = btn.dataset.histLevel; renderKompass(); });
    });
    document.getElementById("historyArchiveToggle")?.addEventListener("click", () => {
      historyArchiveOpen = !historyArchiveOpen;
      renderKompass();
    });
    document.getElementById("historyArchiveSearch")?.addEventListener("input", (e) => {
      historyArchiveSearch = e.target.value;
      renderKompass();
    });
    kompassArea.querySelectorAll("[data-archive-date]").forEach((btn) => {
      btn.addEventListener("click", () => {
        historyArchiveDate = btn.dataset.archiveDate;
        renderKompass();
        scrollToAndHighlightWhenReady(`[data-archive-date="${historyArchiveDate}"]`);
      });
    });
    document.getElementById("historyArchiveCloseEntry")?.addEventListener("click", () => {
      historyArchiveDate = null;
      renderKompass();
    });
    kompassArea.querySelectorAll(".hist-archive-level-btn").forEach((btn) => {
      btn.addEventListener("click", () => { historyLevel = btn.dataset.histLevel; renderKompass(); });
    });
    wireSiteBannerUploads(kompassArea);
    renderDichterUndDenker();
    renderSchneeVonGestern();
  }
  renderKompass();

  /* ============================================================
     MATERIALIEN & LINKS
     ============================================================ */
  function openLightbox(url, alt) {
    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("img", { src: url, alt: alt || "" }),
      Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕")
    );
    document.body.appendChild(box);
  }

  // Diashow durch eine Bilderliste (z. B. die ganze Galerie) — Vor/Zurück, Wischen, Zähler
  function openGallerySlideshow(urls, startIndex, alt) {
    let i = startIndex || 0;
    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } });
    function render() {
      box.innerHTML = "";
      // Derselbe quadratische Ausschnitt wie bei den Miniaturbildern (object-fit: cover) — auch
      // in der Vergrößerung, damit alle Fotos überall im selben, einheitlichen Format erscheinen.
      box.appendChild(Core.el("div", { class: "gallery-slideshow-frame" },
        Core.el("img", { src: urls[i], alt: alt || "" })
      ));
      box.appendChild(Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"));
      if (urls.length > 1) {
        box.appendChild(Core.el("button", { class: "lightbox-nav lightbox-prev", type: "button", onclick: (e) => { e.stopPropagation(); i = (i - 1 + urls.length) % urls.length; render(); } }, "‹"));
        box.appendChild(Core.el("button", { class: "lightbox-nav lightbox-next", type: "button", onclick: (e) => { e.stopPropagation(); i = (i + 1) % urls.length; render(); } }, "›"));
        box.appendChild(Core.el("div", { class: "lightbox-counter" }, `${i + 1} / ${urls.length}`));
      }
    }
    render();
    document.body.appendChild(box);
    let touchStartX = null;
    box.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; });
    box.addEventListener("touchend", (e) => {
      if (touchStartX === null || urls.length <= 1) return;
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (diff > 50) { i = (i - 1 + urls.length) % urls.length; render(); }
      else if (diff < -50) { i = (i + 1) % urls.length; render(); }
      touchStartX = null;
    });
  }

  document.getElementById("materialsArea").innerHTML = VocabData.MATERIALS.map((m) => {
    if (m.type === "story") {
      return `<div class="material-card material-card-visual">
        <h3>${m.title}</h3><p>${m.body}</p>
        <button type="button" class="material-thumb-btn" data-full="${m.fullImage}" data-alt="${m.title}">
          <img class="material-thumb" src="${m.coverImage}" alt="Cover: ${m.title}" loading="lazy" />
          <span class="material-thumb-label">▶ Geschichte öffnen</span>
        </button>
      </div>`;
    }
    if (m.type === "preview") {
      return `<div class="material-card material-card-visual">
        <h3>${m.title}</h3><p>${m.body}</p>
        <button type="button" class="material-thumb-btn" data-full="${m.image}" data-alt="${m.title}">
          <img class="material-thumb" src="${m.image}" alt="${m.title}" loading="lazy" />
          <span class="material-thumb-label">🔍 Großansicht</span>
        </button>
      </div>`;
    }
    return `<div class="material-card"><h3>${m.title}</h3><p>${m.body}</p></div>`;
  }).join("");

  document.querySelectorAll(".material-thumb-btn").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(btn.dataset.full, btn.dataset.alt));
  });

  // Deutlich sichtbarer Verweis oben in Materialien auf den eigenen "Eigene Beiträge"-Reiter
  document.getElementById("materialsArea").insertAdjacentHTML("afterbegin", `
    <button type="button" class="community-cta-card" id="goToCommunityTab">
      <span class="community-cta-icon">✍️</span>
      <span>
        <strong>Eigene Beiträge hochladen</strong>
        <span class="empty-note">Lesetexte mit Sprachniveau einreichen — direkt im Reiter „Eigene Beiträge"</span>
      </span>
      <span>→</span>
    </button>
  `);
  document.getElementById("goToCommunityTab").addEventListener("click", () => {
    document.querySelector('#knowledgeSubnav [data-sub="sub-community"]').click();
  });

  let communityLoaded = true; // wird nicht mehr zum Sperren verwendet, nur Kompatibilität
  // Popup zum nachträglichen Bearbeiten des eigenen Beitrags: Titelbild ändern/ergänzen und/oder
  // eine weitere Sprachniveau-Fassung zur bestehenden Geschichte hinzufügen.
  function openCommunityTextEditModal(textId, texts) {
    const t = texts.find((x) => x.id === textId);
    if (!t) return;
    const levelsObj = Backend.communityTextLevels(t);
    const availableLevels = Object.keys(levelsObj);
    const missingLevels = ["A1", "A2", "B1", "B2", "C1", "C2"].filter((l) => !availableLevels.includes(l));
    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("div", { class: "profile-modal-card" },
        Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
        Core.el("h3", {}, "✏️ Beitrag bearbeiten"),
        Core.el("div", { class: "form-field" },
          Core.el("label", { class: "empty-note" }, "Titelbild-Adresse (URL, optional)"),
          Core.el("input", { type: "text", id: "ctEditCoverUrl", class: "guestbook-form-textarea", style: "min-height:auto;", value: t.cover_url || "", placeholder: "https://…" })
        ),
        missingLevels.length ? Core.el("div", { class: "form-field" },
          Core.el("label", { class: "empty-note" }, `Weiteres Niveau ergänzen (bisher: ${availableLevels.join(", ") || "keins"})`),
          Core.el("select", { id: "ctEditNewLevel", class: "challenge-select" },
            ...missingLevels.map((l) => Core.el("option", { value: l }, l))
          ),
          Core.el("textarea", { id: "ctEditNewLevelText", class: "guestbook-form-textarea", placeholder: "Text für dieses Niveau…", style: "margin-top:6px;" })
        ) : Core.el("p", { class: "empty-note" }, "Alle sechs Niveaus sind bereits vorhanden."),
        Core.el("p", { class: "form-error", id: "ctEditError" }),
        Core.el("button", { type: "button", class: "btn btn-coffee", id: "ctEditSaveBtn", style: "margin-top:10px;" }, "Speichern")
      )
    );
    document.body.appendChild(box);
    document.getElementById("ctEditSaveBtn").addEventListener("click", async () => {
      const errBox = document.getElementById("ctEditError");
      errBox.textContent = "";
      const newCoverUrl = document.getElementById("ctEditCoverUrl").value.trim();
      const newLevelSelect = document.getElementById("ctEditNewLevel");
      const newLevelText = document.getElementById("ctEditNewLevelText");
      try {
        const updates = {};
        if (newCoverUrl !== (t.cover_url || "")) updates.coverUrl = newCoverUrl;
        if (newLevelSelect && newLevelText && newLevelText.value.trim()) {
          const merged = { ...levelsObj, [newLevelSelect.value]: newLevelText.value.trim() };
          updates.level = "multi";
          updates.body = JSON.stringify(merged);
        }
        if (Object.keys(updates).length === 0) { errBox.textContent = "Nichts zum Speichern angegeben."; return; }
        await Backend.updateCommunityText(textId, updates);
        box.remove();
        renderCommunityTexts();
      } catch (e) {
        errBox.textContent = e.message || "Speichern fehlgeschlagen.";
      }
    });
  }
  async function renderCommunityTexts() {
    const box = document.getElementById("communityStandaloneArea");
    if (!box) return;
    const user = Backend.currentUser();
    const texts = await Backend.getApprovedCommunityTexts();
    const myTexts = user ? await Backend.getMyCommunityTexts() : [];
    const myPending = myTexts.filter((t) => t.status !== "approved");
    const likesByText = {};
    await Promise.all(texts.map(async (t) => { likesByText[t.id] = await Backend.getLikesForText(t.id); }));
    const commentCountByText = {};
    await Promise.all(texts.map(async (t) => { commentCountByText[t.id] = (await Backend.getCommentsForText(t.id)).length; }));
    const authorProfiles = {};
    const uniqueAuthorIds = [...new Set(texts.map((t) => t.user_id).filter(Boolean))];
    await Promise.all(uniqueAuthorIds.map(async (uid) => { authorProfiles[uid] = await Backend.getPublicProfile(uid); }));

    box.innerHTML = `
      ${user ? `
        <div class="material-card">
          <button type="button" class="emoji-toggle-link" id="ctFormToggle" style="margin:0;">✏️ Eigenen Text einreichen ${myPending.length ? `(du hast ${myPending.length} in Prüfung)` : ""}</button>
          <div id="ctFormBody" style="display:none; margin-top:12px;">
            <p class="empty-note">Wird von Alex geprüft, bevor er für alle sichtbar wird.</p>
            <div class="form-field"><label>Titel</label><input type="text" id="ctTitle" maxlength="80" /></div>
            <div class="form-field">
              <label>Sprachniveau</label>
              <select id="ctLevel" class="challenge-select">
                ${["A1","A2","B1","B2","C1","C2"].map((l) => `<option value="${l}">${l}</option>`).join("")}
                <option value="alle">Alle Niveaus (ein Text in 6 Fassungen)</option>
              </select>
            </div>
            <div class="ct-all-levels-hint" id="ctAllLevelsHint" style="display:none;">
              <p style="margin:0 0 6px; font-weight:700;">📋 So bereitest du den Text vor:</p>
              <p class="empty-note" style="margin:0 0 8px;">Schreib deinen Text <strong>sechsmal untereinander</strong> — einmal pro Niveau, in der Reihenfolge A1 → A2 → B1 → B2 → C1 → C2. Zwischen jeder Fassung eine <strong>komplett leere Zeile</strong> (also zweimal Enter). Kein "A1:" oder Ähnliches davorschreiben — nur die sechs reinen Texte, das System erkennt die Reihenfolge automatisch. Den Titel oben nur einmal eintragen, nicht in jeder Fassung wiederholen.</p>
              <p style="margin:0 0 4px; font-weight:700; font-size:0.85rem;">Beispiel:</p>
              <pre class="ct-example-box">Ein Fuchs geht in den Wald.

Ein kleiner Fuchs läuft durch den Wald.

An einem Morgen lief ein kleiner Fuchs los…

(hier die B2-Fassung)

(hier die C1-Fassung)

(hier die C2-Fassung)</pre>
            </div>
            <div class="form-field"><label>Text</label><textarea id="ctBody" class="guestbook-form-textarea" style="min-height:120px;" maxlength="3000"></textarea></div>
            <div class="form-field">
              <label>Cover-Bild (optional)</label>
              <input type="file" id="ctCoverInput" accept="image/*" />
              <div id="ctCoverPreviewWrap" style="display:none; margin-top:8px;">
                <img id="ctCoverPreview" style="max-width:140px; border-radius:var(--radius-sm);" alt="" />
                <button type="button" class="emoji-toggle-link" id="ctCoverRemove" style="display:block; margin-top:4px;">Entfernen</button>
              </div>
            </div>
            <div class="form-error" id="ctError"></div>
            <button type="button" class="btn-submit" id="ctSubmitBtn">Einreichen</button>
          </div>
        </div>` : '<p class="empty-note">Melde dich an, um eigene Texte einzureichen.</p>'}

      ${myPending.length ? `
        <div class="material-card" style="margin-top:14px;">
          <h3>⏳ Deine Texte in Prüfung</h3>
          ${myPending.map((t) => `<div class="breakdown-row"><span>${t.title} <span class="level-badge" style="margin-left:4px;">${t.level}</span></span><span>Wartet auf Freischaltung</span></div>`).join("")}
        </div>` : ""}

      <p class="eyebrow" style="margin-top:20px;">📚 Alle Beiträge</p>
      <p class="empty-note">Lesetexte von anderen Lernenden — mit Sprachniveau markiert.</p>
      ${texts.length ? texts.map((t) => {
        const likes = likesByText[t.id] || [];
        const iLiked = user && likes.includes(user.id);
        const authorP = t.user_id ? authorProfiles[t.user_id] : null;
        const authorAvatar = authorP ? tinyAvatar({ avatar_url: authorP.avatar_url, avatar_emoji: authorP.avatar_emoji, name: t.author_name }) : "";
        const levelsObj = Backend.communityTextLevels(t);
        const availableLevels = Object.keys(levelsObj);
        const isMultiLevel = availableLevels.length > 1;
        const activeLevel = communityTextLevelChoice[t.id] && levelsObj[communityTextLevelChoice[t.id]] ? communityTextLevelChoice[t.id] : availableLevels[0];
        const isMine = user && t.user_id === user.id;
        return `
        <div class="material-card" data-text-id="${t.id}">
          ${t.cover_url ? `<img src="${t.cover_url}" class="community-text-cover-banner" alt="" data-modal-view-photo="${t.cover_url}" />` : ""}
          <div class="community-text-head">
            <span class="level-badge">${isMultiLevel ? `${availableLevels.length} Niveaus` : activeLevel}</span>
            <h3 style="margin:0;">${t.title}</h3>
          </div>
          ${isMultiLevel ? `
          <p class="empty-note" style="margin:4px 0 6px;">Auch verfügbar in: ${availableLevels.join(", ")}</p>
          <div class="trophy-case" style="margin:0 0 8px; flex-wrap:nowrap; overflow-x:auto; justify-content:flex-start; padding-bottom:2px;">
            ${availableLevels.map((lvl) => `<button type="button" class="trophy-chip community-level-btn ${activeLevel === lvl ? "selected" : ""}" data-ct-id="${t.id}" data-ct-level="${lvl}" style="flex-shrink:0;">${lvl}</button>`).join("")}
          </div>
          <p style="white-space:pre-wrap;">${levelsObj[activeLevel] || ""}</p>` : `
          <p style="white-space:pre-wrap;">${levelsObj[activeLevel] || t.body}</p>`}
          ${isMine ? `<button type="button" class="btn btn-ghost" style="margin-top:6px; font-size:0.78rem; padding:5px 12px;" data-edit-community-text="${t.id}">✏️ Titelbild ändern / weiteres Niveau ergänzen</button>` : ""}
          <div class="modal-meta-row" style="margin-top:8px; justify-content:flex-start;">
            <button type="button" class="friend-name-btn" style="display:inline-flex; align-items:center; gap:6px;" data-view-author="${t.user_id || ""}" ${!t.user_id ? "disabled" : ""}>${authorAvatar}${t.author_name}${adminBadge(authorP?.is_admin, authorP?.is_owner, authorP?.is_moderator)}</button>
            <span class="empty-note">${t.created_at ? new Date(t.created_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}</span>
          </div>
          <div class="modal-meta-row" style="margin-top:10px; justify-content:flex-start;">
            <button type="button" class="btn ${iLiked ? "btn-coffee" : "btn-ghost"}" style="padding:6px 14px; font-size:0.82rem;" data-like-text="${t.id}" data-author-id="${t.user_id || ""}" data-text-title="${t.title.replace(/"/g, "&quot;")}">${iLiked ? "❤️" : "🤍"} ${likes.length}</button>
            <button type="button" class="emoji-toggle-link" style="margin:0;" data-toggle-comments="${t.id}" data-author-id="${t.user_id || ""}" data-text-title="${t.title.replace(/"/g, "&quot;")}">💬 ${commentCountByText[t.id] || 0} ${commentCountByText[t.id] === 1 ? "Kommentar" : "Kommentare"}</button>
          </div>
          <div class="community-comments" id="comments-${t.id}" style="display:none; margin-top:10px;"></div>
          ${(user && t.user_id === user.id) ? `<button type="button" class="btn btn-ghost" style="margin-top:8px;" data-delete-own-text="${t.id}">🗑️ Eigenen Beitrag löschen</button>` : ""}
          ${(Backend.canModerate() && !(user && t.user_id === user.id)) ? `<button type="button" class="btn btn-ghost" style="margin-top:8px;" data-admin-delete-text="${t.id}">🛠️ Entfernen</button>` : ""}
        </div>`;
      }).join("") : '<p class="empty-note">Noch keine freigeschalteten Texte — sei die/der Erste!</p>'}
    `;

    const ctFormToggle = document.getElementById("ctFormToggle");
    if (ctFormToggle) {
      ctFormToggle.addEventListener("click", () => {
        const body = document.getElementById("ctFormBody");
        body.style.display = body.style.display === "none" ? "block" : "none";
      });
    }
    box.querySelectorAll("[data-view-author]").forEach((btn) => {
      if (btn.dataset.viewAuthor) btn.addEventListener("click", () => openProfileModal(btn.dataset.viewAuthor));
    });
    box.querySelectorAll("[data-modal-view-photo]").forEach((img) => {
      img.addEventListener("click", () => openLightbox(img.dataset.modalViewPhoto, "Beitragsbild"));
    });
    box.querySelectorAll("[data-like-text]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!user) { alert("Melde dich zuerst an, um zu liken."); return; }
        btn.disabled = true;
        try { await Backend.toggleLikeText(btn.dataset.likeText, btn.dataset.authorId || null, btn.dataset.textTitle); renderCommunityTexts(); }
        catch (err) { alert(err.message); btn.disabled = false; }
      });
    });
    box.querySelectorAll("[data-toggle-comments]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const wrap = document.getElementById(`comments-${btn.dataset.toggleComments}`);
        const opening = wrap.style.display === "none";
        wrap.style.display = opening ? "block" : "none";
        if (opening && !wrap.dataset.loaded) {
          wrap.dataset.loaded = "1";
          await renderCommentsFor(btn.dataset.toggleComments, wrap, user, btn.dataset.authorId || null, btn.dataset.textTitle);
        }
      });
    });
    box.querySelectorAll("[data-delete-own-text]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Diesen Beitrag wirklich löschen?")) return;
        try { await Backend.deleteMyCommunityText(btn.dataset.deleteOwnText); renderCommunityTexts(); }
        catch (err) { alert(err.message); }
      });
    });
    box.querySelectorAll(".community-level-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        communityTextLevelChoice[btn.dataset.ctId] = btn.dataset.ctLevel;
        renderCommunityTexts();
      });
    });
    box.querySelectorAll("[data-edit-community-text]").forEach((btn) => {
      btn.addEventListener("click", () => openCommunityTextEditModal(btn.dataset.editCommunityText, texts));
    });
    box.querySelectorAll("[data-admin-delete-text]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Diesen Beitrag als Admin entfernen?")) return;
        try { await Backend.adminDeleteCommunityText(btn.dataset.adminDeleteText); renderCommunityTexts(); }
        catch (err) { alert(err.message); }
      });
    });

    let pendingCoverFile = null;
    const coverInput = document.getElementById("ctCoverInput");
    if (coverInput) {
      coverInput.addEventListener("change", () => {
        const file = coverInput.files[0];
        if (!file) return;
        pendingCoverFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById("ctCoverPreview").src = e.target.result;
          document.getElementById("ctCoverPreviewWrap").style.display = "block";
        };
        reader.readAsDataURL(file);
      });
      const removeBtn = document.getElementById("ctCoverRemove");
      if (removeBtn) {
        removeBtn.addEventListener("click", () => {
          pendingCoverFile = null;
          coverInput.value = "";
          document.getElementById("ctCoverPreviewWrap").style.display = "none";
        });
      }
    }

    const submitBtn = document.getElementById("ctSubmitBtn");
    const levelSelect = document.getElementById("ctLevel");
    if (levelSelect) {
      levelSelect.addEventListener("change", () => {
        document.getElementById("ctAllLevelsHint").style.display = levelSelect.value === "alle" ? "block" : "none";
      });
    }
    if (submitBtn) {
      submitBtn.addEventListener("click", async () => {
        const title = document.getElementById("ctTitle").value.trim();
        const level = document.getElementById("ctLevel").value;
        const rawBody = document.getElementById("ctBody").value.trim();
        const errBox = document.getElementById("ctError");
        errBox.textContent = "";
        if (!title || !rawBody) { errBox.textContent = "Bitte Titel und Text ausfüllen."; return; }
        let body = rawBody;
        if (level === "alle") {
          // Text wird an Leerzeilen in genau 6 Abschnitte zerlegt (A1 bis C2, in dieser
          // Reihenfolge) und als strukturiertes JSON gespeichert, statt als einfacher Text.
          const parts = rawBody.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
          if (parts.length !== 6) {
            errBox.textContent = `Für "Alle Niveaus" werden genau 6 Textabschnitte erwartet (durch Leerzeilen getrennt) — gefunden: ${parts.length}.`;
            return;
          }
          const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
          body = JSON.stringify(Object.fromEntries(levels.map((l, i) => [l, parts[i]])));
        }
        submitBtn.textContent = "Wird gesendet …";
        submitBtn.disabled = true;
        try {
          let coverUrl = "";
          if (pendingCoverFile) {
            submitBtn.textContent = "Bild wird hochgeladen …";
            coverUrl = await Backend.uploadCommunityTextCover(pendingCoverFile);
          }
          await Backend.submitCommunityText({ title, level, body, coverUrl });
          renderCommunityTexts();
        } catch (err) {
          errBox.textContent = err.message || "Konnte nicht eingereicht werden.";
          submitBtn.textContent = "Einreichen";
          submitBtn.disabled = false;
        }
      });
    }
  }

  async function renderCommentsFor(textId, wrap, user, authorId, textTitle) {
    const comments = await Backend.getCommentsForText(textId);
    wrap.innerHTML = `
      ${comments.length ? comments.map((c) => `
        <div class="comment-row">
          <button type="button" class="friend-name-btn" data-view-author="${c.user_id || ""}" ${!c.user_id ? "disabled" : ""}>${c.author_name}</button>
          <span class="empty-note" style="margin-left:6px;">${new Date(c.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}</span>
          <p style="margin:2px 0 0;">${c.body}</p>
          ${(user && (c.user_id === user.id || Backend.canModerate())) ? `<button type="button" class="emoji-toggle-link" style="margin-top:2px; font-size:0.75rem;" data-delete-comment="${c.id}">🗑️ Löschen</button>` : ""}
        </div>`).join("") : '<p class="empty-note">Noch keine Kommentare.</p>'}
      ${user ? `
        <div class="form-field" style="margin-top:8px;">
          <textarea class="guestbook-form-textarea" style="min-height:60px;" id="newComment-${textId}" placeholder="Was denkst du über diesen Text?" maxlength="500"></textarea>
        </div>
        <button type="button" class="btn-submit" data-submit-comment="${textId}">Kommentieren</button>
      ` : '<p class="empty-note">Melde dich an, um zu kommentieren.</p>'}
    `;
    wrap.querySelectorAll("[data-view-author]").forEach((btn) => {
      if (btn.dataset.viewAuthor) btn.addEventListener("click", () => openProfileModal(btn.dataset.viewAuthor));
    });
    wrap.querySelectorAll("[data-delete-comment]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Kommentar löschen?")) return;
        try { await Backend.deleteComment(btn.dataset.deleteComment); await renderCommentsFor(textId, wrap, user, authorId, textTitle); }
        catch (err) { alert(err.message); }
      });
    });
    const submitCommentBtn = wrap.querySelector("[data-submit-comment]");
    if (submitCommentBtn) {
      submitCommentBtn.addEventListener("click", async () => {
        const ta = document.getElementById(`newComment-${textId}`);
        try {
          await Backend.addComment(textId, ta.value, authorId, textTitle);
          await renderCommentsFor(textId, wrap, user, authorId, textTitle);
        } catch (err) { alert(err.message); }
      });
    }
  }
  document.querySelector('#knowledgeSubnav [data-sub="sub-community"]')?.addEventListener("click", () => {
    renderCommunityTexts();
  });

  async function renderLinks() {
    const area = document.getElementById("linksArea");
    if (!area) return;
    const user = Backend.currentUser();
    const [userLinks, myLinks, pendingLinks] = await Promise.all([
      Backend.getApprovedUserLinks(),
      user ? Backend.getMyUserLinks() : Promise.resolve([]),
      Backend.canModerate() ? Backend.getPendingUserLinks() : Promise.resolve([]),
    ]);
    const myPending = myLinks.filter((l) => l.status === "pending");
    area.innerHTML = `
      ${VocabData.LINKS.map((l) => `<div class="link-card"><h3><a href="${l.url}" target="_blank" rel="noopener">${l.title} ↗</a></h3><p>${l.desc}</p></div>`).join("")}
      ${userLinks.map((l) => `<div class="link-card"><h3><a href="${l.url}" target="_blank" rel="noopener">${l.title} ↗</a></h3><p>${l.desc || ""}</p><p class="empty-note">Vorgeschlagen von ${l.author_name || "jemandem"}</p></div>`).join("")}
      <div class="question-card" style="margin-top:16px;">
        <button type="button" class="emoji-toggle-link" id="linkFormToggle">➕ Eigenen Link vorschlagen ${myPending.length ? `(du hast ${myPending.length} in Prüfung)` : ""}</button>
        <div id="linkFormBox" style="display:none; margin-top:10px;">
          <p class="empty-note">Wird von Alex geprüft, bevor er für alle sichtbar wird.</p>
          <div class="form-field"><label>Titel</label><input type="text" id="linkTitleInput" maxlength="80" /></div>
          <div class="form-field"><label>Adresse (URL)</label><input type="text" id="linkUrlInput" placeholder="https://…" /></div>
          <div class="form-field"><label>Kurzbeschreibung (optional)</label><input type="text" id="linkDescInput" maxlength="150" /></div>
          <p class="form-error" id="linkSubmitError"></p>
          <button type="button" class="btn btn-coffee" id="linkSubmitBtn">Vorschlagen</button>
        </div>
        ${myPending.length ? `<div style="margin-top:10px;">${myPending.map((l) => `<div class="breakdown-row"><span>${l.title}</span><span>Wartet auf Freischaltung</span></div>`).join("")}</div>` : ""}
      </div>
      ${Backend.canModerate() ? `<div class="question-card" style="margin-top:16px; border:2px solid var(--amber-400);">
        <h3>🛠️ Vorgeschlagene Links prüfen (${pendingLinks.length})</h3>
        ${pendingLinks.length ? pendingLinks.map((l) => `
          <div class="breakdown-row" style="align-items:flex-start; flex-direction:column; gap:4px;">
            <strong>${l.title}</strong>
            <a href="${l.url}" target="_blank" rel="noopener" class="empty-note">${l.url} ↗</a>
            ${l.desc ? `<p class="empty-note" style="margin:0;">${l.desc}</p>` : ""}
            <p class="empty-note" style="margin:0;">von ${l.author_name || "jemandem"}</p>
            <div style="display:flex; gap:8px; margin-top:4px;">
              <button type="button" class="btn btn-coffee" style="padding:5px 12px; font-size:0.78rem;" data-approve-link="${l.id}">✅ Freischalten</button>
              <button type="button" class="btn btn-ghost" style="padding:5px 12px; font-size:0.78rem;" data-reject-link="${l.id}">✕ Ablehnen</button>
            </div>
          </div>`).join("") : '<p class="empty-note">Nichts zu prüfen.</p>'}
      </div>` : ""}
    `;
    const toggleBtn = document.getElementById("linkFormToggle");
    if (toggleBtn) toggleBtn.addEventListener("click", () => {
      const box = document.getElementById("linkFormBox");
      box.style.display = box.style.display === "none" ? "block" : "none";
    });
    const submitBtn = document.getElementById("linkSubmitBtn");
    if (submitBtn) submitBtn.addEventListener("click", async () => {
      const errBox = document.getElementById("linkSubmitError");
      errBox.textContent = "";
      try {
        await Backend.submitLink({
          title: document.getElementById("linkTitleInput").value.trim(),
          url: document.getElementById("linkUrlInput").value.trim(),
          desc: document.getElementById("linkDescInput").value.trim(),
        });
        renderLinks();
      } catch (e) { errBox.textContent = "⚠️ " + e.message; }
    });
    area.querySelectorAll("[data-approve-link]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try { await Backend.approveUserLink(btn.dataset.approveLink); renderLinks(); }
        catch (e) { alert(e.message); }
      });
    });
    area.querySelectorAll("[data-reject-link]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Diesen Link-Vorschlag ablehnen und löschen?")) return;
        try { await Backend.rejectUserLink(btn.dataset.rejectLink); renderLinks(); }
        catch (e) { alert(e.message); }
      });
    });
  }
  renderLinks();
  document.querySelector('#knowledgeSubnav [data-sub="sub-links"]')?.addEventListener("click", () => renderLinks());
  // Vorstellungsrunde: geführtes Formular mit hilfreichen Platzhaltern, damit niemand vor einem
  // leeren Feld sitzt — plus eine kompakte Kartenübersicht aller Vorstellungen (mit dem jeweils
  // eigenen Design, aber bewusst NICHT das volle Profil-Panel), damit sich die Community
  // gegenseitig kennenlernen kann.
  async function renderIntroRound() {
    const area = document.getElementById("introRoundArea");
    if (!area) return;
    const user = Backend.currentUser();
    const profile = Backend.currentProfile();
    const mine = (profile && profile.extraProfileData && profile.extraProfileData.introduction) || {};
    area.innerHTML = `
      <p class="empty-note" style="margin-bottom:14px;">Lernt euch gegenseitig kennen! Stell dich kurz vor — auf Deutsch, das ist gleich noch eine gute Übung. Alle Felder sind freiwillig.</p>
      ${user ? `
      <div class="question-card" style="margin-bottom:16px;">
        <h3>✍️ Deine Vorstellung</h3>
        <div class="form-field">
          <label>Dein Bild für die Vorstellungskarte (optional)</label>
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px; flex-wrap:wrap;">
            <div id="introPhotoPreview" style="width:52px; height:52px; border-radius:50%; overflow:hidden; background:var(--plum-700); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              ${mine.photoUrl ? `<img src="${mine.photoUrl}" style="width:100%; height:100%; object-fit:cover;" />` : (mine.stickerKey && DMA_STICKERS[mine.stickerKey]) ? DMA_STICKERS[mine.stickerKey] : "🦊"}
            </div>
            <input type="hidden" id="introPhotoUrl" value="${mine.photoUrl || ""}" />
            <input type="hidden" id="introStickerKey" value="${mine.stickerKey || ""}" />
            <label class="btn btn-ghost" style="cursor:pointer; font-size:0.78rem;">📷 Foto hochladen<input type="file" accept="image/*" id="introPhotoUpload" style="display:none;" /></label>
            <button type="button" class="btn btn-ghost" id="introUseProfilePicBtn" style="font-size:0.78rem;">👤 Profilbild übernehmen</button>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${Object.keys(DMA_STICKERS).map((key) => `<button type="button" class="intro-sticker-pick" data-intro-sticker="${key}" style="background:none; border:1px solid rgba(0,0,0,0.1); border-radius:8px; padding:4px; cursor:pointer;">${DMA_STICKERS[key]}</button>`).join("")}
          </div>
        </div>
        <div class="form-field">
          <label>Über dich (Name, Alter, Herkunft …)</label>
          <textarea id="introAbout" class="guestbook-form-textarea" maxlength="300" placeholder="Sprich ein bisschen über dich selbst — wo du herkommst, wie du heißt, wie alt du bist …">${mine.about || ""}</textarea>
        </div>
        <div class="form-field">
          <label>Was möchtest du hier machen?</label>
          <textarea id="introGoal" class="guestbook-form-textarea" maxlength="200" placeholder="z. B. Ich möchte mein Deutsch aktiv trainieren, oder: Ich möchte neue Freunde finden, mit denen ich Deutsch sprechen kann.">${mine.goal || ""}</textarea>
        </div>
        <div class="form-field">
          <label>Wie hast du von dieser Seite gehört?</label>
          <textarea id="introSource" class="guestbook-form-textarea" maxlength="150" placeholder="z. B. durch Clubhouse, durch HelloTalk, durch meine Freundschaft mit Alex …">${mine.source || ""}</textarea>
        </div>
        <div class="form-field">
          <label>Deine Stadt/Region (optional)</label>
          <textarea id="introCity" class="guestbook-form-textarea" maxlength="200" placeholder="Wofür ist deine Stadt bekannt? Was magst du dort besonders?">${mine.city || ""}</textarea>
        </div>
        <button type="button" class="btn btn-coffee" id="introSaveBtn">Vorstellung speichern</button>
        <p class="empty-note" id="introSavedNote" style="display:none; margin-top:8px;">✅ Gespeichert — jetzt für alle sichtbar!</p>
      </div>` : `<p class="empty-note" style="margin-bottom:16px;">Melde dich an, um dich selbst vorzustellen.</p>`}
      <p class="eyebrow">👋 Wer ist schon dabei?</p>
      <div class="vocab-toolbar" style="margin-bottom:10px;">
        <input type="text" class="vocab-search" id="introSearchInput" placeholder="Nach Namen suchen…" />
      </div>
      <div id="introCardsArea"><p class="empty-note">Lade Vorstellungen…</p></div>
    `;
    document.getElementById("introPhotoUpload")?.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const url = await Backend.uploadStandalonePhoto(file);
        document.getElementById("introPhotoUrl").value = url;
        document.getElementById("introStickerKey").value = "";
        // WICHTIG — behebt den gemeldeten Bug: dieser <img>-Tag hatte bisher keine
        // class="avatar-photo", weshalb der Wassertropfen-Glanzeffekt (box-shadow, siehe
        // .avatar-photo) hier nie ankam, obwohl er im Haupt-Profilbild schon korrekt griff.
        document.getElementById("introPhotoPreview").innerHTML = `<img src="${url}" class="avatar-photo" style="width:100%; height:100%; object-fit:cover;" />`;
      } catch (err) { alert(err.message || "Hochladen fehlgeschlagen."); }
    });
    document.getElementById("introUseProfilePicBtn")?.addEventListener("click", () => {
      const currentAvatar = profile.avatarUrl;
      if (!currentAvatar) { alert("Du hast noch kein eigenes Profilbild hinterlegt."); return; }
      document.getElementById("introPhotoUrl").value = currentAvatar;
      document.getElementById("introStickerKey").value = "";
      document.getElementById("introPhotoPreview").innerHTML = `<img src="${currentAvatar}" class="avatar-photo" style="width:100%; height:100%; object-fit:cover;" />`;
    });
    document.querySelectorAll("[data-intro-sticker]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("introStickerKey").value = btn.dataset.introSticker;
        document.getElementById("introPhotoUrl").value = "";
        document.getElementById("introPhotoPreview").innerHTML = DMA_STICKERS[btn.dataset.introSticker];
      });
    });
    document.getElementById("introSaveBtn")?.addEventListener("click", async () => {
      await Backend.saveIntroduction({
        about: document.getElementById("introAbout").value,
        goal: document.getElementById("introGoal").value,
        source: document.getElementById("introSource").value,
        city: document.getElementById("introCity").value,
        photoUrl: document.getElementById("introPhotoUrl").value,
        stickerKey: document.getElementById("introStickerKey").value,
      });
      const note = document.getElementById("introSavedNote");
      note.style.display = "block";
      setTimeout(() => { note.style.display = "none"; }, 2500);
      loadIntroCards();
    });
    document.getElementById("introSearchInput")?.addEventListener("input", (e) => loadIntroCards(e.target.value));
    loadIntroCards();
  }
  async function loadIntroCards(searchQuery = "") {
    const wrap = document.getElementById("introCardsArea");
    if (!wrap) return;
    let list = await Backend.getAllIntroductions();
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    wrap.innerHTML = list.length ? `<div class="intro-card-grid">
      ${list.map((p) => `
        <div class="intro-card" data-theme="${p.theme || "bastelheft"}">
          <div class="intro-card-header">
            ${p.introduction.photoUrl ? `<img src="${p.introduction.photoUrl}" class="intro-card-avatar" />`
              : (p.introduction.stickerKey && DMA_STICKERS[p.introduction.stickerKey]) ? `<span class="intro-card-avatar intro-card-avatar-placeholder">${DMA_STICKERS[p.introduction.stickerKey]}</span>`
              : p.avatarUrl ? `<img src="${p.avatarUrl}" class="intro-card-avatar" />` : `<span class="intro-card-avatar intro-card-avatar-placeholder">🦊</span>`}
            <strong>${p.name}</strong>
          </div>
          ${p.introduction.about ? `<p class="intro-card-text">${p.introduction.about}</p>` : ""}
          ${p.introduction.city ? `<p class="intro-card-text">📍 ${p.introduction.city}</p>` : ""}
          ${p.introduction.goal ? `<p class="intro-card-text intro-card-goal">🎯 ${p.introduction.goal}</p>` : ""}
          ${p.introduction.source ? `<p class="intro-card-text intro-card-source">💡 ${p.introduction.source}</p>` : ""}
        </div>`).join("")}
    </div>` : `<p class="empty-note">${searchQuery ? "Niemand mit diesem Namen gefunden." : "Noch niemand hat sich vorgestellt — sei die/der Erste!"}</p>`;
  }
  document.querySelector('#knowledgeSubnav [data-sub="sub-intro"]')?.addEventListener("click", renderIntroRound);

  // "Schwarmwissen" — freier Austausch von Tipps, Links, Videos, Bildern zwischen
  // Nutzer:innen. Alex bietet die Inhalte an, lernt aber selbst kein Deutsch mehr — wer gerade
  // mittendrin steckt, weiß am besten, was wirklich hilft.
  async function renderTips() {
    const area = document.getElementById("tipsArea");
    if (!area) return;
    const user = Backend.currentUser();
    const [tips, myTips, pendingTips] = await Promise.all([
      Backend.getApprovedCommunityTips(),
      user ? Backend.getMyCommunityTips() : Promise.resolve([]),
      Backend.canModerate() ? Backend.getPendingCommunityTips() : Promise.resolve([]),
    ]);
    const myPending = myTips.filter((t) => t.status === "pending");
    area.innerHTML = `
      <p class="empty-note" style="margin-bottom:12px;">Hier tauscht ihr euch gegenseitig aus — was hat bei dir funktioniert? Eine Serie, ein Video, eine Übungsmethode? Teil es mit den anderen.</p>
      <div class="question-card">
        <button type="button" class="emoji-toggle-link" id="tipFormToggle">💡 Eigenen Tipp teilen ${myPending.length ? `(${myPending.length} in Prüfung)` : ""}</button>
        <div id="tipFormBox" style="display:none; margin-top:10px;">
          <p class="empty-note">Wird von Alex geprüft, bevor er für alle sichtbar wird.</p>
          <div class="form-field"><label>Dein Tipp</label><textarea id="tipTextInput" class="guestbook-form-textarea" maxlength="500" placeholder="z. B. „Nicos Weg hat mir beim Hörverstehen total geholfen…“"></textarea></div>
          <div class="form-field"><label>Link (optional — Video, Artikel, o. Ä.)</label><input type="text" id="tipLinkInput" placeholder="https://…" /></div>
          <div class="form-field">
            <label class="empty-note" style="cursor:pointer;">📷 Bild anhängen (optional) <input type="file" id="tipImageInput" accept="image/*" style="display:block; margin-top:4px;" /></label>
            <div id="tipImagePreviewBox"></div>
          </div>
          <p class="form-error" id="tipSubmitError"></p>
          <button type="button" class="btn btn-coffee" id="tipSubmitBtn">Teilen</button>
        </div>
        ${myPending.length ? `<div style="margin-top:10px;">${myPending.map((t) => `<div class="breakdown-row"><span>${t.text.slice(0, 40)}${t.text.length > 40 ? "…" : ""}</span><span>Wartet auf Freischaltung</span></div>`).join("")}</div>` : ""}
      </div>
      ${Backend.canModerate() ? `<div class="question-card" style="margin-top:14px; border:2px solid var(--amber-400);">
        <h3>🛠️ Vorgeschlagene Tipps prüfen (${pendingTips.length})</h3>
        ${pendingTips.length ? pendingTips.map((t) => `
          <div class="breakdown-row" style="align-items:flex-start; flex-direction:column; gap:4px;">
            <p style="margin:0; white-space:pre-wrap;">${t.text}</p>
            ${t.link ? `<a href="${t.link}" target="_blank" rel="noopener" class="empty-note">${t.link} ↗</a>` : ""}
            ${t.image_url ? `<img src="${t.image_url}" style="max-width:140px; border-radius:8px;" />` : ""}
            <p class="empty-note" style="margin:0;">von ${t.author_name || "jemandem"}</p>
            <div style="display:flex; gap:8px; margin-top:4px;">
              <button type="button" class="btn btn-coffee" style="padding:5px 12px; font-size:0.78rem;" data-approve-tip="${t.id}">✅ Freischalten</button>
              <button type="button" class="btn btn-ghost" style="padding:5px 12px; font-size:0.78rem;" data-reject-tip="${t.id}">✕ Ablehnen</button>
            </div>
          </div>`).join("") : '<p class="empty-note">Nichts zu prüfen.</p>'}
      </div>` : ""}
      <p class="eyebrow" style="margin-top:20px;">💬 Tipps aus der Gemeinschaft</p>
      ${tips.length ? tips.map((t) => `
        <div class="material-card" data-text-id="${t.id}">
          <p style="white-space:pre-wrap; margin:0 0 8px;">${t.text}</p>
          ${t.link ? `<a href="${t.link}" target="_blank" rel="noopener" class="empty-note">🔗 ${t.link}</a>` : ""}
          ${t.image_url ? `<img src="${t.image_url}" style="max-width:100%; border-radius:10px; margin-top:8px; cursor:pointer;" data-modal-view-photo="${t.image_url}" />` : ""}
          <p class="empty-note" style="margin-top:8px;">von ${t.author_name || "jemandem"}${user && t.user_id === user.id ? ` · <button type="button" class="emoji-toggle-link" style="display:inline; font-size:0.75rem;" data-delete-tip="${t.id}">löschen</button>` : ""}</p>
        </div>`).join("") : '<p class="empty-note">Noch keine Tipps — sei die/der Erste!</p>'}
    `;
    const toggleBtn = document.getElementById("tipFormToggle");
    if (toggleBtn) toggleBtn.addEventListener("click", () => {
      const box = document.getElementById("tipFormBox");
      box.style.display = box.style.display === "none" ? "block" : "none";
    });
    let pendingTipImageUrl = "";
    const imgInput = document.getElementById("tipImageInput");
    if (imgInput) imgInput.addEventListener("change", async () => {
      const file = imgInput.files[0];
      if (!file) return;
      const previewBox = document.getElementById("tipImagePreviewBox");
      previewBox.innerHTML = '<p class="empty-note">Lädt hoch…</p>';
      try {
        pendingTipImageUrl = await Backend.uploadCommunityTextCover(file);
        previewBox.innerHTML = `<img src="${pendingTipImageUrl}" style="max-width:120px; border-radius:8px; margin-top:6px;" />`;
      } catch (err) {
        previewBox.innerHTML = `<p class="form-error">⚠️ ${err.message}</p>`;
      }
    });
    const submitBtn = document.getElementById("tipSubmitBtn");
    if (submitBtn) submitBtn.addEventListener("click", async () => {
      const errBox = document.getElementById("tipSubmitError");
      errBox.textContent = "";
      try {
        await Backend.submitCommunityTip({
          text: document.getElementById("tipTextInput").value.trim(),
          link: document.getElementById("tipLinkInput").value.trim(),
          imageUrl: pendingTipImageUrl,
        });
        renderTips();
      } catch (e) { errBox.textContent = "⚠️ " + e.message; }
    });
    area.querySelectorAll("[data-approve-tip]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try { await Backend.approveCommunityTip(btn.dataset.approveTip); renderTips(); }
        catch (e) { alert(e.message); }
      });
    });
    area.querySelectorAll("[data-reject-tip]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Diesen Tipp ablehnen und löschen?")) return;
        try { await Backend.rejectCommunityTip(btn.dataset.rejectTip); renderTips(); }
        catch (e) { alert(e.message); }
      });
    });
    area.querySelectorAll("[data-delete-tip]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Diesen eigenen Tipp löschen?")) return;
        try { await Backend.deleteMyCommunityTip(btn.dataset.deleteTip); renderTips(); }
        catch (e) { alert(e.message); }
      });
    });
    area.querySelectorAll("[data-modal-view-photo]").forEach((img) => {
      img.addEventListener("click", () => openGallerySlideshow([img.dataset.modalViewPhoto], 0, "Bild"));
    });
  }
  renderTips();
  document.querySelector('#knowledgeSubnav [data-sub="sub-tips"]')?.addEventListener("click", () => renderTips());

  /* ============================================================
     NACHRICHTEN (RSS) — als Leseübung, schwierige Wörter markiert
     Hinweis: Viele Nachrichtenseiten blockieren das Abrufen von
     fremden Webseiten aus (CORS). Wir versuchen es über einen
     öffentlichen Umweg-Dienst; klappt das nicht, gibt's eine klare
     Meldung mit Link zur Original-Seite statt eines stillen Fehlers.
     ============================================================ */
  let newsLoaded = false;
  async function loadNews() {
    const area = document.getElementById("newsArea");
    if (newsLoaded || !area) return;
    area.innerHTML = `
      <p class="empty-note">Aktuelle Tagesschau-Meldungen als Leseübung. Lange/schwierige Wörter sind <span class="hard-word-demo">unterstrichen markiert</span> — gut zum Wortschatz-Sammeln.</p>
      <p class="empty-note" id="newsStatus">⏳ Lade Nachrichten …</p>
    `;
    try {
      const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://www.tagesschau.de/xml/rss2/");
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Feed nicht erreichbar");
      const xmlText = await res.text();
      const xml = new DOMParser().parseFromString(xmlText, "text/xml");
      const items = [...xml.querySelectorAll("item")].slice(0, 8);
      if (!items.length) throw new Error("Keine Meldungen gefunden");

      area.innerHTML = `
        <p class="empty-note">Aktuelle Tagesschau-Meldungen als Leseübung. Lange/schwierige Wörter sind <span class="hard-word-demo">unterstrichen markiert</span> — gut zum Wortschatz-Sammeln.</p>
        ${items.map((item) => {
          const title = item.querySelector("title")?.textContent || "";
          const desc = (item.querySelector("description")?.textContent || "").replace(/<[^>]+>/g, "");
          const link = item.querySelector("link")?.textContent || "#";
          return `<div class="material-card">
            <h3>${markHardWords(title)}</h3>
            <p>${markHardWords(desc)}</p>
            <a href="${link}" target="_blank" rel="noopener" class="empty-note" style="display:inline-block; margin-top:6px;">Ganzer Artikel ↗</a>
          </div>`;
        }).join("")}
      `;
      newsLoaded = true;
    } catch (e) {
      document.getElementById("newsStatus").innerHTML =
        `⚠️ Die Nachrichten konnten gerade nicht geladen werden (die Nachrichtenseite blockiert vermutlich externe Anfragen).<br><br>
         Lies stattdessen direkt hier: <a href="https://www.tagesschau.de" target="_blank" rel="noopener">tagesschau.de ↗</a>
         oder bei <a href="https://www.dw.com/de/deutsch-lernen/s-2055" target="_blank" rel="noopener">DW – Nachrichten in einfacher Sprache ↗</a>.`;
    }
  }

  // Wörter über 10 Buchstaben grob als "schwierig" markieren (einfache Faustregel, keine echte Analyse)
  function markHardWords(text) {
    return text.replace(/[A-Za-zÄÖÜäöüß]{11,}/g, (w) => `<span class="hard-word">${w}</span>`);
  }

  document.querySelector('#knowledgeSubnav [data-sub="sub-news"]')?.addEventListener("click", loadNews);

  /* ============================================================
     PROFIL / LOGIN / RANKING / GÄSTEBUCH / PREMIUM
     ============================================================ */
  loginBtn = document.getElementById("loginBtn");
  const loginBtnLabel = document.getElementById("loginBtnLabel");

  function refreshHeaderAuth() {
    const user = Backend.currentUser();
    const profile = Backend.currentProfile();
    const icon = document.getElementById("loginBtnIconInner");
    const roleIcon = profile && profile.isOwner ? "👑" : profile && profile.isAdmin ? "🛡️" : "";
    loginBtnLabel.innerHTML = user ? `${user.name.split(" ")[0]}${roleIcon ? ` <span class="role-icon-small">${roleIcon}</span>` : ""}` : "Anmelden";
    loginBtn.classList.toggle("btn-icon-only", !user);
    if (user && profile) {
      const flag = profile.origin ? (VocabData.COUNTRIES.find((c) => c.name === profile.origin) || {}).flag || "" : "";
      const flagHtml = flag ? `<span class="header-flag">${flag}</span>` : "";
      if (profile.avatarUrl) {
        icon.innerHTML = isFigureAvatarUrl(profile.avatarUrl)
          ? `<span class="header-avatar-figure-wrap"><img src="${profile.avatarUrl}" class="header-avatar-figure" alt="" /></span>${flagHtml}`
          : `<img src="${profile.avatarUrl}" class="header-avatar" alt="" />${flagHtml}`;
      } else if (profile.avatarEmoji) {
        icon.innerHTML = `<span class="header-avatar header-avatar-emoji">${profile.avatarEmoji}</span>${flagHtml}`;
      } else {
        const initials = profile.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
        icon.innerHTML = `<span class="header-avatar header-avatar-initials">${initials}</span>${flagHtml}`;
      }
    } else {
      icon.innerHTML = "👤";
    }
  }

  let authMode = "login";
  let profileEditMode = false;
  let profileEditPage = 0;
  let profileEditDraft = {}; // sammelt Eingaben über Seitenwechsel hinweg, bevor gespeichert wird
  function captureProfileEditDraft() {
    const ids = [
      "favCountryInput", "extraDreamDestInput", "extraVisitedInput", "extraWhyGermanInput", "extraLangGoalInput", "extraSportInput",
      "favMovieInput", "favSeriesInput", "favSongInput", "extraActorInput", "extraBookInput", "extraArtistInput",
      "favQuoteInput", "extraMottoInput", "extraSecretInput", "poemInput", "extraDreamInput", "extraHappyInput",
      "favFoodInput", "favDrinkInput", "extraColorInput", "extraAnimalInput", "extraSeasonSelect", "extraNumberInput", "extraTalentInput", "extraVacationInput", "extraGenderSymbolSelectTop", "extraCefrLevelSelect", "showcaseSongLinkInput",
      "extraLikesInput", "extraDislikesInput",
      "birthdayInput", "originSelect",
    ];
    const fieldMap = {
      favCountryInput: "favCountry", extraDreamDestInput: "dreamDestination", extraVisitedInput: "visitedCountries",
      extraWhyGermanInput: "whyGerman", extraLangGoalInput: "langGoal", extraSportInput: "favSport",
      favMovieInput: "favMovie", favSeriesInput: "favSeries", favSongInput: "favSong", extraActorInput: "favActor",
      extraBookInput: "favBook", extraArtistInput: "favArtist",
      favQuoteInput: "favQuote", extraMottoInput: "motto", extraSecretInput: "secret", poemInput: "poem", extraDreamInput: "bigDream", extraHappyInput: "whatMakesMeHappy",
      favFoodInput: "favFood", favDrinkInput: "favDrink", extraColorInput: "favColor", extraAnimalInput: "favAnimal", extraSeasonSelect: "favSeason",
      extraNumberInput: "favNumber", extraTalentInput: "talent", extraVacationInput: "favVacation", extraCefrLevelSelect: "cefrLevel", showcaseSongLinkInput: "showcaseSongUrl",
      extraLikesInput: "likes", extraDislikesInput: "dislikes",
      birthdayInput: "birthday", originSelect: "origin",
    };
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) profileEditDraft[fieldMap[id]] = el.value.trim();
    });
    // Checkbox statt Text-/Select-Feld — braucht .checked statt .value, und die gespeicherte
    // Bedeutung ist umgekehrt (Checkbox = "Alter ANZEIGEN", Feld = "Alter VERSTECKEN").
    const showAgeEl = document.getElementById("showAgeCheckbox");
    if (showAgeEl) profileEditDraft.hideAge = !showAgeEl.checked;
  }
  let profileViewPage = 0;

  // Große Detailansicht für eine bereits freigeschaltete Sammelfigur — Name, Bild groß, und
  // Beschreibung, warum/wofür man sie bekommen hat.
  function openFigureDetailModal(figId) {
    const fig = COLLECTIBLE_FIGURES.find((f) => f.id === figId);
    if (!fig) return;
    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("div", { class: "profile-modal-card", style: "text-align:center;" },
        Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
        Core.el("img", { src: fig.img, alt: fig.name, style: "width:160px; height:160px; object-fit:contain; margin:6px auto;" }),
        Core.el("h3", {}, fig.name),
        Core.el("p", { class: "empty-note" }, fig.desc),
        Core.el("button", { type: "button", class: "btn btn-coffee", style: "margin-top:12px;", onclick: async () => {
          if (!confirm(`Möchtest du "${fig.name}" als dein Profilbild verwenden?`)) return;
          await Backend.saveAvatarFromGallery(fig.img);
          box.remove();
          renderAccount();
          refreshHeaderAuth();
          showToast(`🦊 ${fig.name} ist jetzt dein Profilbild!`);
        } }, "🖼️ Als Profilbild verwenden")
      )
    );
    document.body.appendChild(box);
  }
  async function renderAccount() {
    const area = document.getElementById("accountArea");
    const user = Backend.currentUser();
    const myUnread = user ? await Backend.getUnreadNotifications() : [];
    if (user && myUnread.length) await Backend.refreshCurrentProfile();
    const profile = Backend.currentProfile();
    const extra = (profile && profile.extraProfileData) || {};
    const myFoxBedBadge = profile ? await foxOfPeriodBadgeHtml(Backend.currentUser()?.id) : "";
    // WICHTIG: profile (Backend.currentProfile()) hat KEIN eigenes "id"-Feld (anders als das
    // fremde Profil-Objekt aus getPublicProfile) — deshalb hier ein passendes Objekt für die
    // Transport-Leisten-Funktion zusammenbauen, die das Feld erwartet.
    const myTransportStrip = (profile && user) ? await profileTransportStripHtml({ id: user.id, extraProfileData: extra }) : "";

    const demoBanner = !Backend.isConfigured
      ? '<div class="demo-banner">🔧 Demo-Modus: Es ist noch kein Supabase-Projekt verbunden (siehe supabase-config.js). Konten &amp; Punkte bleiben nur für diese Sitzung erhalten.</div>'
      : "";

    if (!user) {
      const loginBannerUrl = await Backend.getSiteImage("login_banner");
      area.innerHTML = `
        ${demoBanner}
        <div class="question-card" style="padding:0; overflow:hidden;">
          ${siteBannerHtml("login_banner", loginBannerUrl, LOGIN_PLACEHOLDER_SVG, "Willkommen")}
          <div style="padding:16px;">
          <div class="auth-tabs">
            <button type="button" class="auth-tab" data-mode="login" aria-selected="${authMode === "login"}">Anmelden</button>
            <button type="button" class="auth-tab" data-mode="signup" aria-selected="${authMode === "signup"}">Registrieren</button>
          </div>
          <form id="authForm">
            ${authMode === "signup" ? '<div class="form-field"><label>Name</label><input type="text" id="authName" required /></div>' : ""}
            <div class="form-field"><label>E-Mail</label><input type="email" id="authEmail" required /></div>
            <div class="form-field"><label>Passwort</label><input type="password" id="authPassword" required minlength="6" /></div>
            <div class="form-error" id="authError"></div>
            <button type="submit" class="btn-submit">${authMode === "signup" ? "Konto erstellen" : "Anmelden"}</button>
          </form>
          </div>
        </div>
      `;
      wireSiteBannerUploads(area);
      area.querySelectorAll(".auth-tab").forEach((t) => t.addEventListener("click", () => { authMode = t.dataset.mode; renderAccount(); }));
      document.getElementById("authForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("authEmail").value.trim();
        const password = document.getElementById("authPassword").value;
        const errBox = document.getElementById("authError");
        try {
          if (authMode === "signup") {
            const name = document.getElementById("authName").value.trim();
            // Erst den evtl. zwischengespeicherten Wert verwenden (siehe
            // showReferralWelcomeIfPresent — der ref-Parameter ist zu diesem späten Zeitpunkt oft
            // schon aus der sichtbaren URL entfernt), nur falls der nicht existiert direkt aus der
            // aktuellen URL nachschauen.
            const refId = window.__pendingReferralId || new URLSearchParams(window.location.search).get("ref");
            await Backend.signUp(email, password, name, refId);
          } else {
            await Backend.signIn(email, password);
          }
          refreshHeaderAuth();
          // WICHTIG: das persönlich gewählte Design des Profils sofort anwenden — vorher blieb
          // nach dem Einloggen zunächst das vorherige (Session-)Design stehen, bis man die Seite
          // manuell neu geladen hat.
          applyTheme((Backend.currentProfile() && Backend.currentProfile().theme) || sessionTheme);
          await renderAccount();
          updateSpecialDayBar();
          Backend.touchActivity();
          notifyAboutAppUpdateIfNeeded();
          claimLoginStreak();
        } catch (err) {
          errBox.textContent = err.message || "Das hat leider nicht geklappt.";
        }
      });
      return;
    }

    const AVATAR_EMOJIS = ["🦊","🐱","🐶","🐼","🐨","🦁","🐸","🦉","🐧","🦄","🐢","🐝"];
    const initials = profile.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const myFriends = await Backend.getFriends();
    const friendCount = myFriends.length;
    const avatarHtml = profile.avatarUrl
      ? avatarPhotoHtml(profile.avatarUrl)
      : profile.avatarEmoji
        ? `<div class="initials-avatar emoji-avatar">${profile.avatarEmoji}</div>`
        : `<div class="initials-avatar">${initials}</div>`;

    if (!profileEditMode) {
      const hobbyReadout = (profile.hobbies || []).map((n) => {
        const h = VocabData.HOBBIES.find((x) => x.noun === n);
        return h ? `<div class="trophy-chip">${h.emoji} ${h.article} ${h.noun}</div>` : "";
      }).join("");
      const originFlag = profile.origin ? (VocabData.COUNTRIES.find((c) => c.name === profile.origin) || {}).flag || "🌍" : "";
      const pendingTexts = Backend.canModerate() ? await Backend.getPendingCommunityTexts() : [];
      area.innerHTML = `
        ${demoBanner}
        ${myUnread.length ? `
        <div class="question-card" style="border:2px solid var(--amber-400); margin-bottom:14px;">
          <h3>🔔 Neu für dich</h3>
          ${myUnread.map((n) => `<p style="margin:8px 0;">${n.message.replace(/\[\[target:[\w-]+:[\w-]+\]\]/, "")}</p>`).join("")}
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:6px;">
            <button type="button" class="btn btn-ghost" id="dismissNotificationsBtn">Gelesen, ausblenden</button>
            <button type="button" class="btn btn-ghost" id="muteNotifyBtn">${isNotifyMuted() ? "🔔 Ton wieder einschalten" : "🔕 Ton & Blinken stummschalten"}</button>
          </div>
        </div>` : ""}
        <div class="question-card profile-card-view">
          <button type="button" class="profile-points" id="pointsBreakdownBtn"><span class="num">${profile.points}</span><span class="empty-note">Punkte</span></button>
          ${myFoxBedBadge ? `<div class="fox-period-badge-stack">${myFoxBedBadge}</div>` : ""}
          <div class="profile-header-flow${myFoxBedBadge ? " has-fox-badges" : ""}">
            ${avatarHtml}
            <div class="profile-header-stack">
              <h2 style="margin:0 0 2px 0;" class="profile-header-name">${profile.name}${!extra.hideAge && calculateAge(profile.birthday) ? `, ${calculateAge(profile.birthday)}` : ""}${genderSymbolCompact(extra.genderSymbol) ? ` ${genderSymbolCompact(extra.genderSymbol)}` : ""}</h2>
              ${adminBadge(profile.isAdmin, profile.isOwner, profile.isModerator, profile.isBetaTester, profile.isContributor, profile.isSupporter) ? `<p style="margin:0 0 6px;">${adminBadge(profile.isAdmin, profile.isOwner, profile.isModerator, profile.isBetaTester, profile.isContributor, profile.isSupporter)}</p>` : ""}
              <span class="flow-badge"><button type="button" class="friend-name-btn" id="myFriendsToggle">👥 ${friendCount} ${friendCount === 1 ? "Freund" : "Freunde"}</button></span>
              <span class="profile-header-stack-row">
                ${originFlag ? `<span class="flow-badge">${originFlag} ${profile.origin}</span>` : ""}
                <span class="flow-badge">${zodiacBadgeHtml(profile.birthday)}</span>
              </span>
            </div>
          </div>
          <div style="clear:both;"></div>
          <div class="profile-header-below-photo">
            ${extra.proficiencyLevel ? `<span class="flow-badge">${PROFICIENCY_BADGE[extra.proficiencyLevel]}</span>` : `<span class="flow-badge" style="cursor:pointer;" id="proficiencyPromptBadge">⚖️ Sprachniveau festlegen</span>`}
            ${profile.isPremium && !(extra.hidePremiumBadge) ? '<span class="flow-badge">✨ Premium</span>' : ""}
            ${profile.bio ? `<p class="empty-note profile-bio-flow-text">${profile.bio}</p>` : `<button type="button" class="emoji-toggle-link" id="introPromptBtn">✏️ Noch keine Beschreibung — jetzt vorstellen</button>`}
          </div>
          ${showcaseSongStripHtml(profile)}
          ${myTransportStrip}
          <div style="clear:both;"></div>
          <div class="modal-friends-list" id="myFriendsList" style="display:none; margin-top:10px;">
            ${myFriends.length ? myFriends.map((f) => `<button type="button" class="friend-list-row" data-view-friend-profile="${f.id}">${tinyAvatar(f)}<span class="name">${f.name}</span>${adminBadge(f.is_admin, f.is_owner, f.is_moderator)}</button>`).join("") : '<p class="empty-note">Noch keine Freunde — oben nach Namen suchen.</p>'}
          </div>
          ${hobbyReadout ? `<p class="eyebrow" style="margin-top:12px;">🎯 Hobbys & Interessen</p><div class="trophy-case" style="margin-top:6px;">${hobbyReadout}</div>` : ""}
          ${renderExtendedSteckbrief(profile, "own")}
          <div class="badge-row">
            ${profile.badges.length ? profile.badges.map((b) => `<div class="badge-chip"><span class="emoji">🏅</span><span>${b}</span></div>`).join("") : '<p class="empty-note">Noch keine Abzeichen — spiel eine Runde in „Lernen"!</p>'}
          </div>
          ${profile.trophies && profile.trophies.length ? `<div class="quiz-actions" style="justify-content:center; gap:18px; margin-top:10px;">
            <button type="button" class="empty-note trophy-summary-link" id="trophySummaryJump" style="font-size:0.95rem; background:none; border:none; cursor:pointer; padding:0;">🎖️ ${trophyCounts(profile).orden} Orden · 🏆 ${trophyCounts(profile).pokale} Pokale</button>
          </div>` : ""}
          <p class="eyebrow" style="margin-top:14px;">🦊 Sammelfiguren <span class="subnav-info-icon" data-info="Diese Fuchs-Figuren sind Sammelobjekte, die man sich beim Deutschlernen erspielt — je mehr Punkte du sammelst (oder bestimmte Pokale erreichst), desto mehr Figuren schaltest du frei. Auf eine bereits freigeschaltete Figur tippen zeigt dir mehr dazu.">ⓘ</span></p>
          <div class="figure-case">
            ${COLLECTIBLE_FIGURES.map((fig) => figureTileHtml(fig, profile)).join("")}
          </div>
          <div class="quiz-actions" style="justify-content:flex-start;">
            <button type="button" class="btn btn-coffee" id="editProfileBtn">✏️ Bearbeiten</button>
            <button type="button" class="btn btn-ghost" id="logoutBtn">Abmelden</button>
          </div>
        </div>
        ${(profile.gallery || []).length ? `<div class="question-card" style="margin-top:16px;">
          <h3>📷 Galerie</h3>
          <div class="gallery-grid">
            ${(profile.gallery || []).map((url) => `<div class="gallery-thumb-wrap"><img src="${url}" class="gallery-thumb" alt="" data-view-photo="${url}" /></div>`).join("")}
          </div>
        </div>` : ""}
        ${Backend.canModerate() ? `<div class="question-card" style="margin-top:16px; border:2px solid var(--amber-400);">
          <h3>🛠️ Verwaltung — Eigene Beiträge freischalten</h3>
          ${pendingTexts.length ? pendingTexts.map((t) => `
            <div class="material-card" style="margin-top:10px;">
              <div class="community-text-head"><span class="level-badge">${t.level}</span><h3 style="margin:0;">${t.title}</h3></div>
              <p style="white-space:pre-wrap;">${t.body}</p>
              <p class="empty-note" style="margin-top:6px;">✍️ von ${t.author_name}</p>
              <div class="quiz-actions" style="justify-content:flex-start; margin-top:10px;">
                <button type="button" class="btn btn-coffee" data-approve-text="${t.id}">✅ Freischalten</button>
                <button type="button" class="btn btn-ghost" data-reject-text="${t.id}">✕ Ablehnen</button>
              </div>
            </div>`).join("") : '<p class="empty-note" style="margin-top:8px;">Nichts wartet gerade auf Freischaltung.</p>'}
        </div>` : ""}
        ${renderTrophyCase(profile)}
        ${renderAlbumPreview(profile)}
        ${renderInterviewPreview(profile)}
        ${await renderRecentMembers()}
        ${await renderActivityFeed()}
        ${profile.history.length ? `<div class="breakdown-list" style="margin-top:16px;">
          <p class="eyebrow" style="margin-top:0;">🎯 Deine letzten Ergebnisse</p>
          ${profile.history.slice(0, 8).map((h) => `<div class="breakdown-row"><span>${new Date(h.playedAt).toLocaleDateString("de-DE")}</span><span>${h.character}</span><span>${h.percent}%</span></div>`).join("")}
        </div>` : ""}
      `;
      document.getElementById("editProfileBtn").addEventListener("click", () => { profileEditMode = true; profileEditDraft = {}; profileEditPage = 0; renderAccount(); });
      const introBtn = document.getElementById("introPromptBtn");
      if (introBtn) introBtn.addEventListener("click", () => { profileEditMode = true; profileEditDraft = {}; profileEditPage = 0; renderAccount(); });
      document.getElementById("myFriendsToggle").addEventListener("click", () => {
        const list = document.getElementById("myFriendsList");
        list.style.display = list.style.display === "none" ? "flex" : "none";
      });
      document.getElementById("proficiencyPromptBadge")?.addEventListener("click", () => {
        document.querySelector('[data-target="view-profile"]')?.click();
        setTimeout(() => { document.querySelector('#profileSubnav [data-sub="sub-settings"]')?.click(); }, 150);
      });
      document.getElementById("pointsBreakdownBtn").addEventListener("click", () => showPointsBreakdown(profile));
      if (myTransportStrip) wireProfileTransportStrip(area, { id: user.id, name: profile.name, extraProfileData: extra });
      wireTrophyCaseToggle();
      document.getElementById("trophySummaryJump")?.addEventListener("click", () => {
        // Klick auf die "X Orden · Y Pokale"-Kurzfassung springt zur vollständigen Vitrine weiter
        // unten und klappt sie direkt komplett auf, statt nur unklickbarer Text zu sein.
        document.getElementById("trophyMoreBtn")?.click();
        document.getElementById("trophyCaseAnchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      wireSteckbriefPager(area, renderAccount);
      wireMusicPlayer(area);
      area.querySelectorAll("[data-figure-detail]").forEach((el) => {
        el.addEventListener("click", () => openFigureDetailModal(el.dataset.figureDetail));
      });
      const dismissBtn = document.getElementById("dismissNotificationsBtn");
      if (dismissBtn) {
        dismissBtn.addEventListener("click", async () => {
          await Backend.markNotificationsRead(myUnread.map((n) => n.id));
          myUnread.forEach((n) => toastedNotificationIds.add(n.id));
          checkNotifications();
          renderAccount();
        });
      }
      const muteBtn = document.getElementById("muteNotifyBtn");
      if (muteBtn) {
        muteBtn.addEventListener("click", () => {
          const newState = !isNotifyMuted();
          setNotifyMuted(newState);
          setNotifyBlinkMuted(newState);
          if (loginBtn) loginBtn.classList.toggle("notify-ring", !newState && myUnread.length > 0);
          renderAccount();
        });
      }
      area.querySelectorAll("[data-approve-text]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          try { await Backend.approveCommunityText(btn.dataset.approveText); renderAccount(); }
          catch (err) { alert(err.message); }
        });
      });
      area.querySelectorAll("[data-reject-text]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!confirm("Diesen Text wirklich ablehnen und löschen?")) return;
          try { await Backend.rejectCommunityText(btn.dataset.rejectText); renderAccount(); }
          catch (err) { alert(err.message); }
        });
      });
      document.getElementById("logoutBtn").addEventListener("click", async () => {
        await Backend.signOut();
        refreshHeaderAuth();
        renderAccount();
      });
      area.querySelectorAll("[data-view-photo]").forEach((img, idx, all) => {
        const urls = [...all].map((el) => el.dataset.viewPhoto);
        img.addEventListener("click", () => openGallerySlideshow(urls, idx, "Galerie-Foto"));
      });
      area.querySelectorAll("[data-view-friend-profile]").forEach((btn) => {
        btn.addEventListener("click", () => openProfileModal(btn.dataset.viewFriendProfile));
      });
      area.querySelectorAll("[data-view-member]").forEach((btn) => {
        btn.addEventListener("click", () => openProfileModal(btn.dataset.viewMember));
      });
      return;
    }

    area.innerHTML = `
      ${demoBanner}
      <div class="question-card">
        <div class="quiz-actions" style="justify-content:flex-start; margin-top:0; margin-bottom:12px;">
          <button type="button" class="btn btn-ghost" id="doneEditBtn">← Fertig, zurück zur Ansicht</button>
        </div>
        <div class="profile-header">
          <label class="avatar-upload-wrap">
            ${avatarHtml}
            <span class="avatar-edit-badge">📷</span>
            <input type="file" id="avatarInput" accept="image/*" style="display:none;" />
          </label>
          <div class="profile-name-col">
            <h2>${profile.name}${adminBadge(profile.isAdmin, profile.isOwner, profile.isModerator, profile.isBetaTester, profile.isContributor, profile.isSupporter)}</h2>
            <p class="empty-note">👥 ${friendCount} ${friendCount === 1 ? "Freund" : "Freunde"}${profile.isPremium && !(extra.hidePremiumBadge) ? " · ✨ Premium" : ""}</p>
          </div>
          <div class="profile-points"><div class="num">${profile.points}</div><div class="empty-note">Punkte</div></div>
        </div>
        <button type="button" class="emoji-toggle-link" id="previewProfileLink">👁️ Vorschau: So sehen andere dein Profil</button>
        ${showcaseSongStripHtml(profile)}
        ${(extra.previousAvatarUrl || extra.previousAvatarEmoji) ? `<button type="button" class="emoji-toggle-link" id="restoreAvatarLink">↩️ Voriges Profilbild wiederherstellen</button>` : ""}
        ${(profile.gallery || []).length ? `<button type="button" class="emoji-toggle-link" id="galleryAvatarToggleLink">🖼️ Foto aus meiner Galerie wählen</button>` : ""}
        <div class="emoji-picker-row" id="galleryAvatarPickerRow" style="display:none;">
          ${(profile.gallery || []).map((url) => `<button type="button" class="gallery-avatar-pick-btn" data-gallery-url="${url}" style="background-image:url('${url}');"></button>`).join("")}
        </div>
        <button type="button" class="emoji-toggle-link" id="emojiToggleLink">🎭 Kein Foto? Stattdessen Emoji wählen</button>
        <div class="emoji-picker-row" id="emojiPickerRow" style="display:none;">
          ${AVATAR_EMOJIS.map((e) => `<button type="button" class="emoji-pick-btn" data-emoji="${e}">${e}</button>`).join("")}
        </div>
        <div class="form-error" id="avatarError"></div>
        <div class="badge-row">
          ${profile.badges.length ? profile.badges.map((b) => `<div class="badge-chip"><span class="emoji">🏅</span><span>${b}</span></div>`).join("") : '<p class="empty-note">Noch keine Abzeichen — spiel eine Runde in „Lernen"!</p>'}
        </div>
        <div class="form-field" style="margin-top:16px;">
          <label>Über mich (sichtbar für Freunde)</label>
          <textarea id="bioInput" class="guestbook-form-textarea" placeholder="Ein paar Worte über dich…" maxlength="200">${profile.bio || ""}</textarea>
        </div>
        <div class="form-field">
          <label>Geburtstag (optional — bestimmt z. B. dein Sternzeichen)</label>
          <input type="date" id="birthdayInput" value="${profileEditDraft.birthday !== undefined ? profileEditDraft.birthday : (profile.birthday || "")}" />
          <label class="empty-note" style="display:flex; align-items:center; gap:6px; margin-top:8px; cursor:pointer;">
            <input type="checkbox" id="showAgeCheckbox" ${(profileEditDraft.hideAge !== undefined ? !profileEditDraft.hideAge : !extra.hideAge) ? "checked" : ""} />
            <span>Alter oben in der Leiste anzeigen (Geburtstag bleibt für dein Sternzeichen trotzdem gespeichert, auch wenn du das hier ausschaltest)</span>
          </label>
        </div>
        <div class="form-field" style="border:1.5px solid var(--amber-400); border-radius:10px; padding:10px 12px;">
          <label style="font-weight:700;">⚧️ Geschlechtssymbol im Profil (optional)</label>
          <div style="display:flex; align-items:center; gap:10px;">
            <select id="extraGenderSymbolSelectTop" class="challenge-select" style="flex:1;">
              <option value="">Nicht anzeigen</option>
              <option value="maennlich" ${(profileEditDraft.genderSymbol !== undefined ? profileEditDraft.genderSymbol : extra.genderSymbol) === "maennlich" ? "selected" : ""}>♂ männlich</option>
              <option value="weiblich" ${(profileEditDraft.genderSymbol !== undefined ? profileEditDraft.genderSymbol : extra.genderSymbol) === "weiblich" ? "selected" : ""}>♀ weiblich</option>
              <option value="divers" ${(profileEditDraft.genderSymbol !== undefined ? profileEditDraft.genderSymbol : extra.genderSymbol) === "divers" ? "selected" : ""}>⚥ divers</option>
            </select>
            <!-- Live-Vorschau, GENAU dieselbe Darstellung wie im echten Profil (dieselbe
                 genderSymbolCompact()-Funktion) — vorher sah man das gewählte Symbol erst nach
                 dem Speichern und erneuten Öffnen der Profilansicht, nicht schon hier beim
                 Auswählen selbst. -->
            <span id="genderSymbolPreview" style="flex-shrink:0; width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.06); border-radius:8px;">${genderSymbolCompact(profileEditDraft.genderSymbol !== undefined ? profileEditDraft.genderSymbol : extra.genderSymbol)}</span>
          </div>
        </div>
        <div class="form-field">
          <label>Sprachniveau nach GER (A1–C2, optional)</label>
          <p class="empty-note" style="margin:0 0 6px;">Bestimmt, in welchem Niveau Inhalte wie „Es war einmal in Deutschland“, „Dichter & Denker“ oder deine eigenen Beiträge automatisch angezeigt werden — statt jedes Mal manuell umschalten zu müssen.</p>
          <select id="extraCefrLevelSelect" class="challenge-select">
            <option value="">Nicht festgelegt</option>
            ${["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => `<option value="${lvl}" ${(profileEditDraft.cefrLevel !== undefined ? profileEditDraft.cefrLevel : extra.cefrLevel) === lvl ? "selected" : ""}>${lvl}</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label>Hobbys &amp; Interessen (übe dabei gleich Artikel mit!)</label>
          ${(profile.hobbies || []).length ? `<p class="hobby-readout">✓ Ich mag: ${(profile.hobbies || []).map((n) => { const h = VocabData.HOBBIES.find((x) => x.noun === n); return h ? `${h.emoji} ${h.article} ${h.noun}` : n; }).join(", ")}</p>` : '<p class="empty-note">Noch nichts ausgewählt — antippen zum Hinzufügen.</p>'}
          <div class="hobby-chip-row">
            ${VocabData.HOBBIES.map((h) => `<button type="button" class="hobby-chip ${((profile.hobbies || []).includes(h.noun)) ? "selected" : ""}" data-hobby="${h.noun}">${h.emoji} ${h.article} ${isStressModeOn() ? stressHtml(h.syl) : h.noun}</button>`).join("")}
          </div>
        </div>
        <div class="form-field">
          <label>Woher kommst du?</label>
          <select id="originSelect" class="challenge-select">
            <option value="">Nicht angeben</option>
            ${VocabData.COUNTRIES.map((c) => `<option value="${c.name}" ${(profileEditDraft.origin !== undefined ? profileEditDraft.origin : profile.origin) === c.name ? "selected" : ""}>${c.flag} ${c.name}</option>`).join("")}
          </select>
        </div>
        <p class="eyebrow" style="margin-top:20px;">📋 Erweiterter Steckbrief — mehrere Seiten</p>
        <div class="order-toggle" id="profilePageSwitch" style="margin-bottom:14px;">
          <button type="button" class="order-pill" data-ppage="0" aria-selected="${profileEditPage === 0}">🌍 Sprachen</button>
          <button type="button" class="order-pill" data-ppage="1" aria-selected="${profileEditPage === 1}">🎬 Kultur</button>
          <button type="button" class="order-pill" data-ppage="2" aria-selected="${profileEditPage === 2}">💭 Gedanken</button>
          <button type="button" class="order-pill" data-ppage="3" aria-selected="${profileEditPage === 3}">✨ Extra</button>
        </div>
        <div id="profilePageContent">
          ${profileEditPage === 0 ? `
            <div class="form-field">
              <label>Welche Sprachen sprichst oder lernst du?</label>
              <div class="hobby-chip-row">
                ${VocabData.LANGUAGES.map((l) => `<button type="button" class="hobby-chip lang-chip ${((profile.languages || []).includes(l)) ? "selected" : ""}" data-lang="${l}">${displayWord(l, VocabData.LANGUAGE_SYL)}</button>`).join("")}
              </div>
            </div>
            <div class="form-field">
              <label>Lieblingsland</label>
              <input type="text" id="favCountryInput" maxlength="60" value="${profileEditDraft.favCountry !== undefined ? profileEditDraft.favCountry : (profile.favCountry || "")}" placeholder="z. B. Portugal" />
            </div>
            <div class="form-field">
              <label>Traumreiseziel</label>
              <input type="text" id="extraDreamDestInput" maxlength="60" value="${profileEditDraft.dreamDestination !== undefined ? profileEditDraft.dreamDestination : (extra.dreamDestination || "")}" placeholder="z. B. Neuseeland" />
            </div>
            <div class="form-field">
              <label>Schon bereiste Länder (kommagetrennt)</label>
              <input type="text" id="extraVisitedInput" maxlength="150" value="${profileEditDraft.visitedCountries !== undefined ? profileEditDraft.visitedCountries : (extra.visitedCountries || "")}" placeholder="z. B. Italien, Türkei, Marokko" />
            </div>
            <div class="form-field">
              <label>Warum lernst du Deutsch?</label>
              <input type="text" id="extraWhyGermanInput" maxlength="120" value="${profileEditDraft.whyGerman !== undefined ? profileEditDraft.whyGerman : (extra.whyGerman || "")}" placeholder="z. B. für die Arbeit, wegen der Familie…" />
            </div>
            <div class="form-field">
              <label>Dein Sprachziel</label>
              <input type="text" id="extraLangGoalInput" maxlength="120" value="${profileEditDraft.langGoal !== undefined ? profileEditDraft.langGoal : (extra.langGoal || "")}" placeholder="z. B. flüssig ein Gespräch führen können" />
            </div>
            <div class="form-field">
              <label>Lieblingssport</label>
              <input type="text" id="extraSportInput" maxlength="60" value="${profileEditDraft.favSport !== undefined ? profileEditDraft.favSport : (extra.favSport || "")}" placeholder="z. B. Fußball" />
            </div>
          ` : ""}
          ${profileEditPage === 1 ? `
            <div class="form-field">
              <label>Lieblingsfilm</label>
              <input type="text" id="favMovieInput" maxlength="60" value="${profileEditDraft.favMovie !== undefined ? profileEditDraft.favMovie : (profile.favMovie || "")}" placeholder="z. B. Das Leben der Anderen" />
            </div>
            <div class="form-field">
              <label>Lieblingsserie</label>
              <input type="text" id="favSeriesInput" maxlength="60" value="${profileEditDraft.favSeries !== undefined ? profileEditDraft.favSeries : (profile.favSeries || "")}" placeholder="z. B. Dark" />
            </div>
            <div class="form-field">
              <label>Lieblingslied</label>
              <input type="text" id="favSongInput" maxlength="60" value="${profileEditDraft.favSong !== undefined ? profileEditDraft.favSong : (profile.favSong || "")}" placeholder="z. B. 99 Luftballons" />
            </div>
            <div class="form-field" style="border:1.5px solid var(--teal-400); border-radius:10px; padding:10px 12px;">
              <label style="font-weight:700;">🌟 Song im Profil-Player zeigen (optional)</label>
              <p class="empty-note" style="margin:0 0 8px;">Anders als „Lieblingslied" oben (nur Text): dieser Song ist direkt abspielbar im kleinen Player-Streifen auf deinem Profil — z. B. das deutsche Lied, das du gerade übst, statt deines allgemeinen Favoriten.</p>
              <select id="showcaseSongSelect" class="challenge-select">
                <option value="">Keinen Song zeigen</option>
                ${(await Backend.getPlaylist(Backend.currentUser()?.id)).map((s) => `<option value="${s.url}" data-song-title="${s.title}" ${(profileEditDraft.showcaseSongUrl !== undefined ? profileEditDraft.showcaseSongUrl : extra.showcaseSongUrl) === s.url ? "selected" : ""}>${s.title}</option>`).join("")}
              </select>
              <p class="empty-note" style="margin:6px 0 0;">${(await Backend.getPlaylist(Backend.currentUser()?.id)).length === 0 ? "Deine Playlist ist noch leer — füge zuerst Songs im Musik-Bereich hinzu." : "Nur Songs aus deiner eigenen Playlist wählbar — läuft dann direkt im selben Player weiter, kein eigener zweiter Player."}</p>
            </div>
            <div class="form-field">
              <label>Lieblingsschauspieler:in</label>
              <input type="text" id="extraActorInput" maxlength="60" value="${profileEditDraft.favActor !== undefined ? profileEditDraft.favActor : (extra.favActor || "")}" placeholder="z. B. Til Schweiger" />
            </div>
            <div class="form-field">
              <label>Lieblingsbuch</label>
              <input type="text" id="extraBookInput" maxlength="60" value="${profileEditDraft.favBook !== undefined ? profileEditDraft.favBook : (extra.favBook || "")}" placeholder="z. B. Der Vorleser" />
            </div>
            <div class="form-field">
              <label>Lieblingsband oder Künstler:in</label>
              <input type="text" id="extraArtistInput" maxlength="60" value="${profileEditDraft.favArtist !== undefined ? profileEditDraft.favArtist : (extra.favArtist || "")}" placeholder="z. B. Rammstein" />
            </div>
          ` : ""}
          ${profileEditPage === 2 ? `
            <div class="form-field">
              <label>Lieblingsspruch oder Zitat</label>
              <input type="text" id="favQuoteInput" maxlength="120" value="${profileEditDraft.favQuote !== undefined ? profileEditDraft.favQuote : (profile.favQuote || "")}" placeholder="z. B. Übung macht den Meister" />
            </div>
            <div class="form-field">
              <label>Dein Lebensmotto</label>
              <input type="text" id="extraMottoInput" maxlength="120" value="${profileEditDraft.motto !== undefined ? profileEditDraft.motto : (extra.motto || "")}" placeholder="z. B. Nie aufgeben" />
            </div>
            <div class="form-field">
              <label>🤫 Ein Geheimnis mit der Community teilen</label>
              ${profile.points >= 300 ? `
                <input type="text" id="extraSecretInput" maxlength="300" value="${profileEditDraft.secret !== undefined ? profileEditDraft.secret : (extra.secret || "")}" placeholder="Etwas, das andere über dich noch nicht wissen…" />
              ` : `<p class="empty-note">🔒 Ab 300 Punkten kannst du hier ein Geheimnis mit der Community teilen.</p>`}
            </div>
            <div class="form-field">
              <label>Dein größter Traum</label>
              <input type="text" id="extraDreamInput" maxlength="150" value="${profileEditDraft.bigDream !== undefined ? profileEditDraft.bigDream : (extra.bigDream || "")}" placeholder="z. B. einmal ein Buch schreiben" />
            </div>
            <div class="form-field">
              <label>Was macht dich glücklich?</label>
              <input type="text" id="extraHappyInput" maxlength="150" value="${profileEditDraft.whatMakesMeHappy !== undefined ? profileEditDraft.whatMakesMeHappy : (extra.whatMakesMeHappy || "")}" placeholder="z. B. Musik, Zeit mit Freunden…" />
            </div>
            <div class="form-field">
              <label>Ein eigenes Gedicht oder ein paar Zeilen auf Deutsch (übe dabei gleich freies Schreiben!)</label>
              <textarea id="poemInput" class="guestbook-form-textarea" style="min-height:100px;" maxlength="600" placeholder="Schreib ein kurzes Gedicht, einen Gedanken, ein Zitat…">${profileEditDraft.poem !== undefined ? profileEditDraft.poem : (profile.poem || "")}</textarea>
            </div>
          ` : ""}
          ${profileEditPage === 3 ? `
            <div class="form-field">
              <label>Lieblingsessen</label>
              <input type="text" id="favFoodInput" maxlength="60" value="${profileEditDraft.favFood !== undefined ? profileEditDraft.favFood : (profile.favFood || "")}" placeholder="z. B. Käsespätzle" />
            </div>
            <div class="form-field">
              <label>Lieblingsgetränk</label>
              <input type="text" id="favDrinkInput" maxlength="60" value="${profileEditDraft.favDrink !== undefined ? profileEditDraft.favDrink : (profile.favDrink || "")}" placeholder="z. B. Apfelschorle" />
            </div>
            <div class="form-field">
              <label>Lieblingsfarbe</label>
              <input type="text" id="extraColorInput" maxlength="40" value="${profileEditDraft.favColor !== undefined ? profileEditDraft.favColor : (extra.favColor || "")}" placeholder="z. B. Türkis" />
            </div>
            <div class="form-field">
              <label>Lieblingstier</label>
              <input type="text" id="extraAnimalInput" maxlength="40" value="${profileEditDraft.favAnimal !== undefined ? profileEditDraft.favAnimal : (extra.favAnimal || "")}" placeholder="z. B. Fuchs" />
            </div>
            <div class="form-field">
              <label>Lieblingsjahreszeit</label>
              <select id="extraSeasonSelect" class="challenge-select">
                <option value="">Nicht angeben</option>
                ${["Frühling", "Sommer", "Herbst", "Winter"].map((s) => `<option value="${s}" ${(profileEditDraft.favSeason !== undefined ? profileEditDraft.favSeason : extra.favSeason) === s ? "selected" : ""}>${s}</option>`).join("")}
              </select>
            </div>
            <div class="form-field">
              <label>Lieblingszahl</label>
              <input type="text" id="extraNumberInput" maxlength="10" value="${profileEditDraft.favNumber !== undefined ? profileEditDraft.favNumber : (extra.favNumber || "")}" placeholder="z. B. 7" />
            </div>
            <div class="form-field">
              <label>Ein Talent oder Hobby, auf das du stolz bist</label>
              <input type="text" id="extraTalentInput" maxlength="80" value="${profileEditDraft.talent !== undefined ? profileEditDraft.talent : (extra.talent || "")}" placeholder="z. B. Gitarre spielen" />
            </div>
            <div class="form-field">
              <label>Lieblingsurlaubsart</label>
              <input type="text" id="extraVacationInput" maxlength="60" value="${profileEditDraft.favVacation !== undefined ? profileEditDraft.favVacation : (extra.favVacation || "")}" placeholder="z. B. Wandern in den Bergen" />
            </div>
            <div class="form-field">
              <label>👍 Das mag ich</label>
              <input type="text" id="extraLikesInput" maxlength="150" value="${profileEditDraft.likes !== undefined ? profileEditDraft.likes : (extra.likes || "")}" placeholder="z. B. Sonnenschein, gute Musik, Kaffee" />
            </div>
            <div class="form-field">
              <label>👎 Das mag ich nicht</label>
              <input type="text" id="extraDislikesInput" maxlength="150" value="${profileEditDraft.dislikes !== undefined ? profileEditDraft.dislikes : (extra.dislikes || "")}" placeholder="z. B. Montagmorgen, Warteschlangen" />
            </div>
            <div class="form-field">
              <label>🎤 Interview</label>
              <p class="empty-note" style="margin:0 0 8px;">Ausführlichere Fragen zum Kennenlernen — separat vom restlichen Profil, in einem eigenen Bereich.</p>
              <button type="button" class="btn btn-ghost" id="openFullInterviewBtn">🎤 Interview beantworten/bearbeiten</button>
            </div>
          ` : ""}
        </div>
        <div class="form-error" id="profileSaveError"></div>
        <div class="quiz-actions" style="justify-content:flex-start;">
          <button type="button" class="btn btn-coffee" id="saveBioBtn">Speichern</button>
          <button type="button" class="btn btn-ghost" id="logoutBtn">Abmelden</button>
        </div>
      </div>
      <div class="question-card" style="margin-top:16px;">
        <h3>📷 Galerie</h3>
        <p class="empty-note">Bis zu 6 Fotos, die Freunde in deinem Profil sehen können.</p>
        <div class="gallery-grid" id="galleryGrid">
          ${(profile.gallery || []).map((url) => `
            <div class="gallery-thumb-wrap">
              <img src="${url}" class="gallery-thumb" alt="" data-view-photo="${url}" />
              <button type="button" class="gallery-remove-btn" data-remove-gallery="${url}">✕</button>
            </div>`).join("")}
          ${(profile.gallery || []).length < 6 ? `
            <label class="gallery-add-btn">
              +<input type="file" id="galleryInput" accept="image/*" style="display:none;" />
            </label>` : ""}
        </div>
        <div class="form-error" id="galleryError"></div>
      </div>
      ${renderTrophyCase(profile)}
      ${renderAlbumPreview(profile)}
      ${!profileEditMode ? renderInterviewPreview(profile) : ""}
      ${myFriends.length ? `<div class="breakdown-list" style="margin-top:16px;">
        <p class="eyebrow" style="margin-top:0;">👥 Deine Freunde</p>
        ${myFriends.map((f) => `<button type="button" class="friend-list-row" data-view-friend-profile="${f.id}">${tinyAvatar(f)}<span class="name">${f.name}</span>${adminBadge(f.is_admin, f.is_owner, f.is_moderator)}</button>`).join("")}
      </div>` : ""}
      ${await renderRecentMembers()}
      ${await renderActivityFeed()}
      ${profile.history.length ? `<div class="breakdown-list" style="margin-top:16px;">
        <p class="eyebrow" style="margin-top:0;">🎯 Deine letzten Ergebnisse</p>
        ${profile.history.slice(0, 8).map((h) => `<div class="breakdown-row"><span>${new Date(h.playedAt).toLocaleDateString("de-DE")}</span><span>${h.character}</span><span>${h.percent}%</span></div>`).join("")}
      </div>` : ""}
    `;
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await Backend.signOut();
      refreshHeaderAuth();
      renderAccount();
    });
    document.getElementById("saveBioBtn").addEventListener("click", async () => {
      const saveBtn = document.getElementById("saveBioBtn");
      const errBox = document.getElementById("profileSaveError");
      saveBtn.textContent = "Speichert …";
      saveBtn.disabled = true;
      captureProfileEditDraft(); // aktuelle Seite noch mit einsammeln, bevor gespeichert wird
      const val = (id, fallback) => {
        const field = { extraDreamDestInput: "dreamDestination", extraVisitedInput: "visitedCountries", extraActorInput: "favActor",
          extraMottoInput: "motto", extraSecretInput: "secret", extraColorInput: "favColor", extraAnimalInput: "favAnimal", extraSeasonSelect: "favSeason",
          extraWhyGermanInput: "whyGerman", extraLangGoalInput: "langGoal", extraBookInput: "favBook", extraArtistInput: "favArtist",
          extraDreamInput: "bigDream", extraHappyInput: "whatMakesMeHappy", extraNumberInput: "favNumber", extraTalentInput: "talent",
          extraSportInput: "favSport", extraVacationInput: "favVacation", extraGenderSymbolSelectTop: "genderSymbol", extraCefrLevelSelect: "cefrLevel", showcaseSongLinkInput: "showcaseSongUrl",
          extraLikesInput: "likes", extraDislikesInput: "dislikes",
          birthdayInput: "birthday", originSelect: "origin",
          favMovieInput: "favMovie", favSeriesInput: "favSeries", favSongInput: "favSong", favFoodInput: "favFood",
          favDrinkInput: "favDrink", favCountryInput: "favCountry", favQuoteInput: "favQuote", poemInput: "poem" }[id];
        if (profileEditDraft[field] !== undefined) return profileEditDraft[field];
        const el = document.getElementById(id);
        return el ? el.value.trim() : (fallback || "");
      };
      const bioText = document.getElementById("bioInput").value.trim();
      const newExtra = {
        dreamDestination: val("extraDreamDestInput", extra.dreamDestination),
        visitedCountries: val("extraVisitedInput", extra.visitedCountries),
        whyGerman: val("extraWhyGermanInput", extra.whyGerman),
        langGoal: val("extraLangGoalInput", extra.langGoal),
        favSport: val("extraSportInput", extra.favSport),
        favActor: val("extraActorInput", extra.favActor),
        favBook: val("extraBookInput", extra.favBook),
        favArtist: val("extraArtistInput", extra.favArtist),
        motto: val("extraMottoInput", extra.motto),
        bigDream: val("extraDreamInput", extra.bigDream),
        whatMakesMeHappy: val("extraHappyInput", extra.whatMakesMeHappy),
        favColor: val("extraColorInput", extra.favColor),
        favAnimal: val("extraAnimalInput", extra.favAnimal),
        favSeason: val("extraSeasonSelect", extra.favSeason),
        genderSymbol: val("extraGenderSymbolSelectTop", extra.genderSymbol),
        cefrLevel: val("extraCefrLevelSelect", extra.cefrLevel),
        // Checkbox statt Text-/Select-Feld — captureProfileEditDraft() (oben schon aufgerufen)
        // hat profileEditDraft.hideAge bereits aus der Checkbox befüllt.
        hideAge: profileEditDraft.hideAge !== undefined ? profileEditDraft.hideAge : (extra.hideAge || false),
        // WICHTIG — wie gewünscht: nur noch Auswahl aus der eigenen Playlist, kein freies
        // Text-/Link-Feld mehr (das führte beim Abspielen zu einem eigenen, von der echten
        // Playlist losgelösten zweiten Player, siehe playStandaloneSong-Fix weiter unten).
        showcaseSongUrl: (() => {
          const select = document.getElementById("showcaseSongSelect");
          return select ? select.value : (extra.showcaseSongUrl || "");
        })(),
        showcaseSongTitle: (() => {
          const select = document.getElementById("showcaseSongSelect");
          if (!select || !select.value) return "";
          return select.options[select.selectedIndex]?.dataset.songTitle || "";
        })(),
        favNumber: val("extraNumberInput", extra.favNumber),
        talent: val("extraTalentInput", extra.talent),
        favVacation: val("extraVacationInput", extra.favVacation),
        likes: val("extraLikesInput", extra.likes),
        dislikes: val("extraDislikesInput", extra.dislikes),
        // musicLink wird nicht mehr als eigenes Feld angezeigt (siehe Kultur-Bereich) — der Wert
        // bleibt aber im Hintergrund erhalten, damit ein bereits gesetzter Link beim nächsten
        // Speichern nicht verloren geht.
        musicLink: extra.musicLink || "",
        secret: profile.points >= 300 ? val("extraSecretInput", extra.secret) : (extra.secret || ""),
      };
      const [okBio, okBday, okOrigin, extendedResult] = await Promise.all([
        Backend.saveBio(bioText),
        Backend.saveBirthday(val("birthdayInput", profile.birthday) || ""),
        Backend.saveOrigin(val("originSelect", profile.origin) || ""),
        Backend.saveExtendedProfile({
          languages: profile.languages || [],
          favMovie: val("favMovieInput", profile.favMovie),
          favSeries: val("favSeriesInput", profile.favSeries),
          favSong: val("favSongInput", profile.favSong),
          favFood: val("favFoodInput", profile.favFood),
          favDrink: val("favDrinkInput", profile.favDrink),
          favCountry: val("favCountryInput", profile.favCountry),
          favQuote: val("favQuoteInput", profile.favQuote),
          poem: val("poemInput", profile.poem),
          extra: newExtra,
        }),
      ]);
      if (!okBio || !okBday || !okOrigin || !extendedResult.ok) {
        errBox.textContent = !extendedResult.ok
          ? "⚠️ " + extendedResult.message
          : "⚠️ Konnte nicht dauerhaft gespeichert werden — vermutlich blockiert Row Level Security (RLS) das Schreiben in Supabase. Bitte im SQL-Editor ausführen: alter table profiles disable row level security;";
        saveBtn.textContent = "Speichern";
        saveBtn.disabled = false;
        return;
      }
      if (bioText.length >= 10) {
        const gotTrophy = Backend.addTrophy("Vorstellungsrunde – Mutig auf Deutsch geschrieben");
        if (gotTrophy) Backend.addActivity(`${profile.name} hat sich in einem deutschen Profiltext vorgestellt. ✍️`);
      }
      Backend.addActivity(`${profile.name} hat sein Profil aktualisiert. 📝`);
      profileEditMode = false;
      renderAccount();
      updateSpecialDayBar();
      updateTicker();
    });
    document.getElementById("doneEditBtn").addEventListener("click", () => { profileEditMode = false; renderAccount(); });
    document.getElementById("previewProfileLink").addEventListener("click", () => openProfileModal(Backend.currentUser().id));
    const pageSwitch = document.getElementById("profilePageSwitch");
    if (pageSwitch) {
      pageSwitch.querySelectorAll("[data-ppage]").forEach((btn) => {
        btn.addEventListener("click", () => {
          captureProfileEditDraft();
          profileEditPage = Number(btn.dataset.ppage);
          renderAccount();
        });
      });
    }
    // Live-Vorschau direkt neben der Auswahl aktualisieren, sobald man ein anderes Symbol wählt —
    // ohne die ganze Seite neu aufzubauen, damit man sofort sieht, wie es im echten Profil
    // aussehen würde, statt erst nach dem Speichern.
    document.getElementById("extraGenderSymbolSelectTop")?.addEventListener("change", (e) => {
      const preview = document.getElementById("genderSymbolPreview");
      if (preview) preview.innerHTML = genderSymbolCompact(e.target.value);
    });
    document.getElementById("emojiToggleLink").addEventListener("click", () => {
      const row = document.getElementById("emojiPickerRow");
      row.style.display = row.style.display === "none" ? "flex" : "none";
    });
    area.querySelectorAll("[data-emoji]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (profile.avatarUrl) {
          const ok = confirm("Du hast schon ein Foto hochgeladen. Möchtest du es wirklich durch dieses Emoji ersetzen?");
          if (!ok) return;
        }
        Backend.saveAvatarEmoji(btn.dataset.emoji);
        renderAccount();
      });
    });
    const galleryAvatarToggle = document.getElementById("galleryAvatarToggleLink");
    if (galleryAvatarToggle) {
      galleryAvatarToggle.addEventListener("click", () => {
        const row = document.getElementById("galleryAvatarPickerRow");
        row.style.display = row.style.display === "none" ? "flex" : "none";
      });
      area.querySelectorAll("[data-gallery-url]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          await Backend.saveAvatarFromGallery(btn.dataset.galleryUrl);
          renderAccount();
          refreshHeaderAuth();
        });
      });
    }
    document.getElementById("restoreAvatarLink")?.addEventListener("click", async () => {
      const ok = await Backend.restorePreviousAvatar();
      if (ok) renderAccount();
    });
    document.getElementById("avatarInput").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const badge = document.querySelector(".avatar-edit-badge");
      badge.textContent = "⏳";
      try {
        await Backend.uploadAvatar(file);
        Backend.addActivity(`${profile.name} hat ein neues Profilbild hochgeladen. 🖼️`);
        updateTicker();
        renderAccount();
      } catch (err) {
        document.getElementById("avatarError").textContent = err.message || "Foto konnte nicht hochgeladen werden. Wähl unten alternativ ein Emoji als Profilbild.";
        badge.textContent = "📷";
      }
    });
    document.querySelector(".avatar-upload-wrap").addEventListener("click", (e) => {
      if (!Backend.isConfigured) {
        e.preventDefault();
        document.getElementById("avatarError").textContent = "Fotos hochladen geht erst, sobald Supabase verbunden ist — wähl in der Zwischenzeit gern ein Emoji als Profilbild.";
      }
    });
    area.querySelectorAll("[data-view-member]").forEach((btn) => {
      btn.addEventListener("click", () => openProfileModal(btn.dataset.viewMember));
    });
    area.querySelectorAll("[data-view-friend-profile]").forEach((btn) => {
      btn.addEventListener("click", () => openProfileModal(btn.dataset.viewFriendProfile));
    });
    area.querySelectorAll("[data-hobby]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const current = new Set(profile.hobbies || []);
        const wasEmpty = current.size === 0;
        if (current.has(btn.dataset.hobby)) current.delete(btn.dataset.hobby);
        else current.add(btn.dataset.hobby);
        const ok = await Backend.saveHobbies([...current]);
        if (!ok) {
          document.getElementById("profileSaveError").textContent = "⚠️ Hobby konnte nicht dauerhaft gespeichert werden — vermutlich blockiert RLS in Supabase das Schreiben.";
          return;
        }
        if (wasEmpty && current.size > 0) {
          const gotTrophy = Backend.addTrophy("Steckbrief – Hobbys ausgewählt");
          if (gotTrophy) Backend.addActivity(`${profile.name} hat Hobbys im Profil ausgewählt und dabei Artikel geübt. 🎨`);
        }
        renderAccount();
      });
    });
    area.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const current = new Set(profile.languages || []);
        if (current.has(btn.dataset.lang)) current.delete(btn.dataset.lang);
        else current.add(btn.dataset.lang);
        const result = await Backend.saveExtendedProfile({
          languages: [...current],
          favMovie: profile.favMovie || "",
          favSeries: profile.favSeries || "",
          favSong: profile.favSong || "",
          favFood: profile.favFood || "",
          favDrink: profile.favDrink || "",
          favCountry: profile.favCountry || "",
          favQuote: profile.favQuote || "",
          poem: profile.poem || "",
          extra,
        });
        renderAccount(); // immer neu rendern, damit der Klick sichtbar wird — auch wenn das Speichern fehlschlägt
        if (!result.ok) {
          const errBox = document.getElementById("profileSaveError");
          if (errBox) errBox.textContent = "⚠️ " + result.message;
        }
      });
    });
    const galleryInput = document.getElementById("galleryInput");
    if (galleryInput) {
      galleryInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          await Backend.uploadGalleryPhoto(file);
          Backend.addActivity(`${profile.name} hat ein neues Foto zur Galerie hinzugefügt. 📷`);
          updateTicker();
          renderAccount();
        } catch (err) {
          document.getElementById("galleryError").textContent = err.message || "Foto konnte nicht hochgeladen werden.";
        }
      });
    }
    area.querySelectorAll("[data-remove-gallery]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Backend.removeGalleryPhoto(btn.dataset.removeGallery);
        renderAccount();
      });
    });
    area.querySelectorAll("[data-view-photo]").forEach((img) => {
      img.addEventListener("click", () => openLightbox(img.dataset.viewPhoto, "Galerie-Foto"));
    });
  }

  function renderTrophyCase(profile, compact) {
    if (!profile.trophies || !profile.trophies.length) return "";
    // WICHTIG: nach CHARAKTER gruppiert statt einer flachen Liste — vorher standen z. B.
    // "Wissenschaftler – Lehrmeister" (Orden) und "Wissenschaftler – Profi" (Pokal) weit
    // auseinander in der Liste, obwohl es derselbe Charakter ist, nur eine höhere erreichte Stufe.
    // So wird auf einen Blick klar: Orden und Pokal sind keine grundsätzlich verschiedenen
    // Auszeichnungsarten, sondern die STUFEN innerhalb desselben Charakters — die zwei höchsten
    // Stufen zählen einfach als besonders wertvoller Pokal statt als Orden.
    const byCharacter = {};
    profile.trophies.forEach((t) => {
      const character = t.split(" – ")[0] || t;
      if (!byCharacter[character]) byCharacter[character] = [];
      byCharacter[character].push(t);
    });
    const characters = Object.keys(byCharacter);
    const visibleCharacters = compact ? characters.slice(0, 3) : characters;
    const extraCharacters = compact && characters.length > 3 ? characters.slice(3) : [];
    const chip = (t) => `<button type="button" class="trophy-chip trophy-chip-clickable" data-trophy-label="${t.replace(/"/g, "&quot;")}"><span class="emoji">${trophyKind(t) === "pokal" ? "🏆" : "🎖️"}</span><span>${t}</span></button>`;
    const groupHtml = (charList) => charList.map((character) => `
      <div class="trophy-char-group">
        <div class="trophy-case ${compact ? "trophy-case-compact" : ""}">${byCharacter[character].map(chip).join("")}</div>
      </div>`).join("");
    return `<div class="breakdown-list" style="margin-top:16px;" id="trophyCaseAnchor">
      <p class="eyebrow" style="margin-top:0;">🏆 Vitrine <span class="empty-note" style="font-weight:400;">— nach Charakter gruppiert, antippen für Details</span></p>
      ${groupHtml(visibleCharacters)}
      ${extraCharacters.length ? `<button type="button" class="trophy-chip trophy-chip-more" id="trophyMoreBtn">+${extraCharacters.length} weitere Charaktere anzeigen</button>
        <div id="trophyMoreList" style="display:none;">${groupHtml(extraCharacters)}</div>` : ""}
    </div>`;
  }
  // Charakter-Beschreibungen für die Trophäen-Detail-Erklärung — dieselbe Zuordnung wie in der
  // Punkte-Aufschlüsselungs-Erklärung, hier aber pro einzelnem Pokal nutzbar.
  const TROPHY_CHARACTER_DESC = {
    "Logiker": "Viel wenn/ob, als/wie oder kennen/wissen geübt — analytisches Denken steht im Vordergrund.",
    "Wissenschaftler": "Viel Deutschland-Quiz gespielt — Fakten-Wissen über Land und Leute.",
    "Sprachkünstler": "Viel mit Redewendungen und Synonymen gearbeitet — ein Gespür für Sprache.",
    "Grammatik-Profi": "Viel Artikel, Plural und typische Fehler geübt — die Grammatik-Basis sitzt.",
    "Abenteurer": "Eine bunte Mischung aus vielen verschiedenen Kategorien gespielt.",
    "Tausendsassa": "Wirklich alle Kategorien mindestens einmal ausprobiert — Vielseitigkeit pur.",
  };
  const TROPHY_TIER_DESC = {
    "Anfänger": "Erste Schritte gemacht — jede Reise beginnt klein!",
    "Fortgeschrittener": "Schon ein gutes Stück Sicherheit gewonnen.",
    "Lehrmeister": "Kann das Gelernte schon fast selbst weitergeben.",
    "Profi": "Sehr hohe Trefferquote — zählt bereits als Pokal, nicht nur Orden.",
    "Superheld": "Höchste Stufe — (fast) alles richtig. Die Krönung.",
  };
  function showTrophyDetail(label) {
    const parts = label.split(" – ");
    const character = parts[0];
    const tier = parts[1] || "";
    const charDesc = TROPHY_CHARACTER_DESC[character];
    const tierKey = Object.keys(TROPHY_TIER_DESC).find((k) => tier.includes(k));
    const tierDesc = tierKey ? TROPHY_TIER_DESC[tierKey] : null;
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `
      <div class="profile-modal-card" style="text-align:center;">
        <button type="button" class="lightbox-close" id="trophyDetailClose">✕</button>
        <p style="font-size:2.2rem; margin:6px 0;">🏆</p>
        <h3 style="margin-bottom:10px;">${label}</h3>
        <div style="text-align:left;">
          ${charDesc ? `<p><strong>${character}:</strong> ${charDesc}</p>` : ""}
          ${tierDesc ? `<p style="margin-top:8px;"><strong>${tierKey}:</strong> ${tierDesc}</p>` : ""}
          ${!charDesc && !tierDesc ? `<p class="empty-note">Ein besonderer Verdienst — genaueres steht direkt im Titel.</p>` : ""}
        </div>
      </div>`;
    document.body.appendChild(box);
    document.getElementById("trophyDetailClose").addEventListener("click", () => box.remove());
    box.addEventListener("click", (e) => { if (e.target === box) box.remove(); });
  }
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-trophy-label]");
    if (btn) showTrophyDetail(btn.dataset.trophyLabel);
  });
  function wireTrophyCaseToggle(root) {
    (root || document).querySelectorAll(".trophy-chip-more").forEach((btn) => {
      btn.addEventListener("click", () => {
        // Robuster über die feste, eindeutige ID statt closest/nextElementSibling-Suche — die
        // Struktur gruppiert die Trophäen jetzt nach Charakter, daher steht die "mehr"-Liste
        // nicht mehr zwingend als direktes Geschwisterelement des Knopfes.
        const list = document.getElementById("trophyMoreList");
        if (list) list.style.display = "block";
        btn.style.display = "none";
      });
    });
  }

  function lastSeenText(lastActive, online) {
    if (online) return "🟢 Gerade online";
    if (!lastActive) return "";
    const diffMs = Date.now() - new Date(lastActive).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `Zuletzt online vor ${mins} Min.`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Zuletzt online vor ${hours} Std.`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Zuletzt online vor ${days} ${days === 1 ? "Tag" : "Tagen"}`;
    return `Zuletzt online am ${new Date(lastActive).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}`;
  }

  // Erkennt, ob ein Profilbild eine Sammelfigur ist (Pfad beginnt mit "figures/") — dann wird sie
  // NICHT wie ein normales Foto rund beschnitten, sondern klebt unbeschnitten wie ein Sticker
  // obendrauf, damit keine Pfoten/Ohren/Schwanz abgeschnitten werden.
  function isFigureAvatarUrl(url) {
    return typeof url === "string" && url.startsWith("figures/");
  }
  function avatarPhotoHtml(url) {
    if (!url) return "";
    if (isFigureAvatarUrl(url)) {
      return `<div class="avatar-photo avatar-figure-sticker-wrap"><img src="${url}" alt="" class="avatar-figure-sticker" /></div>`;
    }
    return `<img src="${url}" alt="" class="avatar-photo" />`;
  }
  function tinyAvatar(m) {
    if (m.avatar_url) {
      // Sammelfigur-Sticker brauchen dieselbe unbeschnittene Sonderbehandlung wie überall sonst —
      // sonst wird der Fuchs hier klein und rund abgeschnitten statt vollständig zu erscheinen.
      if (isFigureAvatarUrl(m.avatar_url)) {
        return `<div class="tiny-avatar tiny-avatar-figure-wrap"><img src="${m.avatar_url}" alt="" class="tiny-avatar-figure-sticker" /></div>`;
      }
      return `<img src="${m.avatar_url}" class="tiny-avatar" alt="" />`;
    }
    if (m.avatar_emoji) return `<span class="tiny-avatar tiny-avatar-emoji">${m.avatar_emoji}</span>`;
    const initials = (m.name || "?").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    return `<span class="tiny-avatar tiny-avatar-initials">${initials}</span>`;
  }

  // Admin-Abzeichen — überall dort, wo ein Name/Profil auftaucht, konsistent anzeigbar
  // Erkennt die YouTube-Video-ID aus verschiedenen üblichen Link-Formaten (watch?v=, youtu.be/,
  // embed/), damit man einfach den Link kopieren kann, den man im Browser sieht.
  /* ===== Musik-Player: Admin-verwaltete Playlist mit Transportsteuerung & Favoriten ===== */
  let musicPlaylist = [];
  let musicCoverCollapsed = true; // Einklapp-Zustand: Cover-Fenster startet standardmäßig eingeklappt (nur Titel sichtbar), lässt sich bei Bedarf aufklappen — Ton läuft so oder so weiter.
  // Kompakte, aufklappbare Schnellliste DIREKT im Player selbst (nur Titel, antippen startet
  // sofort) — getrennt von der vollständigen Verwaltungsliste weiter unten mit all ihren Knöpfen.
  let musicQuickListOpen = false;
  // Wiederhol-/Zufallsmodus: "off" (einmal durch, dann Stopp am Ende), "one" (aktueller Song
  // wiederholt sich endlos), "all" (Playlist beginnt nach dem letzten Song wieder von vorn).
  let musicRepeatMode = "off";
  let musicShuffleOn = false;
  let musicFavIds = [];
  let musicCurrentIndex = -1;
  // Spielt man einen Song NUR aus dem Profil-Streifen heraus (ohne den Tab zu wechseln), soll der
  // Ton einfach hörbar laufen, OHNE dass die schwebende Player-Leiste sofort/ruckartig erscheint.
  // Erst beim tatsächlichen Wechsel des Tabs/der Seite "geht sie auf" — mit einer sanften
  // Erscheinungs-Animation statt eines abrupten Sprungs.
  let musicFloatingBarSuppressed = false;
  let musicIsPlaying = false;
  let musicShowFavoritesOnly = false;
  // Von Alex vorgeschlagene Songs — von mir recherchiert und bestätigt (echte, offizielle
  // YouTube-Videos). Über den "Vorschläge einfügen"-Button im Admin-Bereich mit einem Klick
  // übernehmbar, statt jeden Link einzeln eintippen zu müssen. Wird laufend um weitere
  // recherchierte Songs ergänzt.
  const MUSIC_SUGGESTIONS = [
    { title: "LOUA — Mit dir wach", url: "https://www.youtube.com/watch?v=GCExgRfrFr4" },
    { title: "Mark Forster — Übermorgen", url: "https://www.youtube.com/watch?v=1tD41isys1o" },
    { title: "Matthias Reim — Verdammt, ich lieb dich", url: "https://www.youtube.com/watch?v=x6q0ciiqyG0" },
    { title: "Alexander Veljanov — Mein Weg", url: "https://www.youtube.com/watch?v=9SLAdldR3Bs" },
    { title: "Nino de Angelo — Flieger", url: "https://www.youtube.com/watch?v=DTYepq8vhFI" },
    { title: "Rami Hattab — Goldener Handschuh", url: "https://www.youtube.com/watch?v=PyjVTTOJodg" },
    { title: "FASO — Richtiger Mensch Falscher Moment", url: "https://www.youtube.com/watch?v=OoJ1IeQUm6w" },
    { title: "Juliane Werding — Haus überm Meer", url: "https://www.youtube.com/watch?v=FthL9EgkfSk" },
    { title: "Purwien — Leb' wohl", url: "https://www.youtube.com/watch?v=mOqCn3zGPK8" },
    { title: "Alexa Feser — Mein Name ist", url: "https://www.youtube.com/watch?v=Nw158t1mCRY" },
    { title: "ela. — Immer Jemand Wach", url: "https://www.youtube.com/watch?v=Ab5VMH5sYng" },
    { title: "Der Wolf — Oh Shit, Frau Schmidt", url: "https://www.youtube.com/watch?v=RrNBTVoUHLU" },
    { title: "LEA x LINDA — Signal", url: "https://www.youtube.com/watch?v=a2utR5VcMGI" },
    { title: "Grossstadtgeflüster — Ich muss gar nix", url: "https://www.youtube.com/watch?v=7inaAem83FY" },
    { title: "Vanessa Mai — 747", url: "https://www.youtube.com/watch?v=GVHXuKkcYGo" },
    { title: "Xander Fox — Du", url: "music/Du.mp3" },
    { title: "Xander Fox — Nah (2011)", url: "music/Nah%20(2011).mp3" },
    { title: "Xander Fox — Nur Mit Mir", url: "music/Nur%20Mit%20Mir%20(Demo%201)-3.mp3" },
    { title: "Xander Fox — A Lovers Fairytale", url: "music/One%20Day%20In%20Rome%20-%20A%20Lovers%20Fairytale.mp3" },
    { title: "Xander Fox — Ein Leben Lang", url: "music/One%20Day%20In%20Rome%20-%20Ein%20Leben%20Lang.mp3" },
    { title: "Xander Fox — Mein Stiller Schmerz", url: "music/promised-eden_mein-stiller-schmerz.mp3" },
    { title: "Second Decay — I Hate Berlin", url: "https://www.youtube.com/watch?v=5fWv1wmsVgs" },
  ];
  let ytMusicPlayer = null;
  let ytApiLoading = false;
  let ytApiCallbacks = [];
  // Verhindert die Race-Condition, die dazu führte, dass beim schnellen Songwechsel immer wieder
  // das ERSTE, ursprünglich geladene Video gespielt wurde: onReady feuert asynchron und wusste
  // bisher nicht, ob der Nutzer zwischenzeitlich schon einen ANDEREN Song angefordert hatte.
  let ytPlayerIsReady = false;
  let ytDesiredVideoId = null;
  function loadYouTubeIframeApi(callback) {
    if (window.YT && window.YT.Player) { callback(); return; }
    ytApiCallbacks.push(callback);
    if (ytApiLoading) return;
    ytApiLoading = true;
    window.onYouTubeIframeAPIReady = () => { ytApiCallbacks.forEach((cb) => cb()); ytApiCallbacks = []; };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    // WICHTIG: bisher gab es KEINE Rückmeldung, wenn dieses Skript aus irgendeinem Grund nicht
    // laden konnte (Netzwerkproblem, Werbeblocker, der youtube.com blockiert, o. Ä.) — die Musik
    // spielte dann einfach nie, ohne jeden Hinweis, warum. Jetzt eine klare Fehlermeldung, statt
    // stiller Funkstille.
    tag.onerror = () => {
      ytApiLoading = false;
      showToast("⚠️ YouTube konnte nicht geladen werden — prüf deine Internetverbindung oder einen Werbeblocker.");
    };
    document.head.appendChild(tag);
  }
  function musicVisiblePlaylist() {
    return musicShowFavoritesOnly ? musicPlaylist.filter((s) => musicFavIds.includes(s.id)) : musicPlaylist;
  }
  // Echte SVG-Bedienelemente statt Emojis — sollen wie physische, plastische Knöpfe auf einem
  // Panel wirken (per CSS mit Verlauf, Schatten und "gedrückt"-Effekt beim Antippen ergänzt).
  const PLAYER_ICONS = {
    play: `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 4 L20 12 L6 20 Z" fill="currentColor"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" width="18" height="18"><rect x="5" y="4" width="5" height="16" rx="1.5" fill="currentColor"/><rect x="14" y="4" width="5" height="16" rx="1.5" fill="currentColor"/></svg>`,
    prev: `<svg viewBox="0 0 24 24" width="16" height="16"><rect x="4" y="4" width="2.5" height="16" rx="1" fill="currentColor"/><path d="M20 4 L8 12 L20 20 Z" fill="currentColor"/></svg>`,
    next: `<svg viewBox="0 0 24 24" width="16" height="16"><rect x="17.5" y="4" width="2.5" height="16" rx="1" fill="currentColor"/><path d="M4 4 L16 12 L4 20 Z" fill="currentColor"/></svg>`,
    // Vorher einfache Emojis (🔀🔂🔁) — jetzt echte SVGs, konsistent mit den anderen
    // Bedienelementen. Zwei gebogene Pfeile für Shuffle (kreuzende Wege), ein Pfeil-Kreis mit
    // "1"/ohne Zahl für Wiederholen-Einzeln/Alle.
    shuffle: `<svg viewBox="0 0 24 24" width="15" height="15"><path d="M4 6h3l9 12h4M16 6h4v4M4 18h3l3-4M16 18h4v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 6l-2.5-2M20 6l-2.5 2M20 18l-2.5-2M20 18l-2.5 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    repeatOne: `<svg viewBox="0 0 24 24" width="15" height="15"><path d="M4 8a5 5 0 0 1 5-5h6M20 16a5 5 0 0 1-5 5H9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 1l3 2-3 2M12 23l-3-2 3-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="12" y="15" text-anchor="middle" font-size="8" font-weight="800" fill="currentColor">1</text></svg>`,
    repeatAll: `<svg viewBox="0 0 24 24" width="15" height="15"><path d="M4 8a5 5 0 0 1 5-5h6M20 16a5 5 0 0 1-5 5H9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 1l3 2-3 2M12 23l-3-2 3-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    list: `<svg viewBox="0 0 24 24" width="15" height="15"><line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    collapse: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    expand: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    // Kleines, sich bewegendes Mini-Equalizer-Symbol statt des Lautsprecher-Emojis (🔊) für "spielt
    // gerade" in Song-Listeneinträgen — konsistent mit dem Rest der SVG-Bedienelemente.
    playingMini: `<svg viewBox="0 0 16 16" width="13" height="13" style="vertical-align:-2px;"><rect x="1" y="6" width="3" height="8" rx="1" fill="currentColor"><animate attributeName="height" values="8;3;8" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="6;10;6" dur="0.8s" repeatCount="indefinite"/></rect><rect x="6.5" y="2" width="3" height="12" rx="1" fill="currentColor"><animate attributeName="height" values="12;5;12" dur="0.7s" repeatCount="indefinite"/><animate attributeName="y" values="2;8;2" dur="0.7s" repeatCount="indefinite"/></rect><rect x="12" y="8" width="3" height="6" rx="1" fill="currentColor"><animate attributeName="height" values="6;12;6" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="8;2;8" dur="0.9s" repeatCount="indefinite"/></rect></svg>`,
    noteMini: `<svg viewBox="0 0 16 16" width="13" height="13" style="vertical-align:-2px;"><circle cx="4" cy="12" r="2.5" fill="currentColor"/><rect x="6" y="2" width="1.5" height="10.5" fill="currentColor"/><path d="M7.5 2 L13 3.5 V6 L7.5 4.5 Z" fill="currentColor"/></svg>`,
  };
  function formatMusicTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  // Aktualisiert die digitale Zeitanzeige alle Sekunde — funktioniert für YouTube UND direkte
  // MP3-Links gleichermaßen, je nachdem was gerade aktiv ist.
  setInterval(() => {
    const timeEl = document.getElementById("musicDigitalTime");
    if (!timeEl) return;
    let current = NaN, duration = NaN;
    const audioEl = document.getElementById("musicAudioNative");
    if (audioEl && audioEl.src && !audioEl.paused) {
      current = audioEl.currentTime; duration = audioEl.duration;
    } else if (ytMusicPlayer && typeof ytMusicPlayer.getCurrentTime === "function") {
      try { current = ytMusicPlayer.getCurrentTime(); duration = ytMusicPlayer.getDuration(); } catch (e) {}
    }
    timeEl.textContent = `${formatMusicTime(current)} / ${formatMusicTime(duration)}`;
  }, 1000);
  let musicPlaylistMode = "community"; // "community", "mine" oder "friend"
  let musicViewingFriendId = null;
  let musicViewingFriendName = "";
  let musicMyOwnSongUrls = [];
  function viewFriendPlaylist(friendId, friendName) {
    musicPlaylistMode = "friend";
    musicViewingFriendId = friendId;
    musicViewingFriendName = friendName;
    document.querySelector(".lightbox")?.remove(); // Profil-Popup schließen, sonst blockiert es die Musik-Ansicht darunter
    document.querySelector('[data-target="view-knowledge"]').click();
    document.querySelector('#knowledgeSubnav [data-sub="sub-music"]')?.click();
  }
  async function loadMusicPlaylist() {
    const user = Backend.currentUser();
    const ownerId = musicPlaylistMode === "mine" && user ? user.id : musicPlaylistMode === "friend" ? musicViewingFriendId : null;
    // WICHTIG: den GERADE SPIELENDEN Song merken, BEVOR die Liste ausgetauscht wird — sonst blieb
    // musicCurrentIndex auf seiner alten Zahl stehen, während musicPlaylist komplett durch eine
    // andere Ansicht (z. B. "Meine Playlist" statt "Gemeinsame Playlist") ersetzt wurde. Das
    // ließ den Player scheinbar "einen Titel weiterspringen" — er zeigte plötzlich den Song, der
    // zufällig an derselben Indexposition der NEUEN Liste steht, obwohl real noch der alte Song
    // lief.
    const currentlyPlayingSong = musicPlaylist[musicCurrentIndex];
    musicPlaylist = await Backend.getPlaylist(ownerId);
    // Die gemeinsame Playlist soll von Anfang an schon bestückt sein — niemand soll erst wissen
    // müssen, dass es einen extra Knopf zum Befüllen gibt. Ist sie beim allerersten Öffnen noch
    // komplett leer, füllt ein Admin sie automatisch mit den vorbereiteten Vorschlägen, sobald
    // er die Seite besucht — alle anderen Besucher:innen finden sie danach schon fertig vor.
    if (ownerId === null && musicPlaylist.length === 0 && Backend.canModerate && Backend.canModerate()) {
      for (const s of MUSIC_SUGGESTIONS) {
        try { await Backend.addPlaylistSong(s.title, s.url, null); } catch (e) { console.warn("Automatische Erstbefüllung fehlgeschlagen:", e); }
      }
      musicPlaylist = await Backend.getPlaylist(null);
    }
    // Den gerade spielenden Song in der neuen Liste wiederfinden (per ID, nicht Index) und
    // musicCurrentIndex korrekt darauf ausrichten — läuft er in der neuen Ansicht gar nicht mit
    // (z. B. ein Song aus der gemeinsamen Playlist, während man zu "Meine Playlist" wechselt),
    // wird er der Liste unsichtbar vorangestellt, damit der Index gültig bleibt und die
    // Wiedergabe ungestört weiterläuft, statt zu springen.
    if (currentlyPlayingSong) {
      const foundIdx = musicPlaylist.findIndex((s) => s.id === currentlyPlayingSong.id);
      if (foundIdx !== -1) {
        musicCurrentIndex = foundIdx;
      } else {
        musicPlaylist = [currentlyPlayingSong, ...musicPlaylist];
        musicCurrentIndex = 0;
      }
    }
    musicFavIds = user ? await Backend.getMyFavoriteSongIds() : [];
    if (musicPlaylistMode === "friend" && user) {
      const mine = await Backend.getPlaylist(user.id);
      musicMyOwnSongUrls = mine.map((s) => s.url);
    }
  }
  // Spielt einen einzelnen Song ab, der NICHT zwangsläufig schon in der aktuell geladenen
  // musicPlaylist steht (z. B. der Schaufenster-Song aus einem fremden Profil) — setzt ihn als
  // einzigen Eintrag, damit der globale Player direkt übernimmt und überall weiterläuft.
  // Schmaler Player-Streifen mit dem "Schaufenster"-Lieblingssong einer Person — funktioniert
  // sowohl im eigenen als auch im fremden Profil. p kann camelCase (eigenes Profil) oder
  // snake_case (fremdes, via getPublicProfile) sein.
  // Ganz einfache, geometrische SVG-Symbole speziell für den schmalen Streifen — bewusst
  // minimalistisch (kein Emoji, keine Materialoptik wie bei den Haupt-Player-Knöpfen): zwei
  // überlagerte Dreiecke für vor/zurück, ein Dreieck für Play, zwei Balken für Pause.
  const STRIP_ICONS = {
    prev: `<svg viewBox="0 0 20 20" width="13" height="13"><path d="M10 3 L2 10 L10 17 Z" fill="currentColor"/><path d="M18 3 L10 10 L18 17 Z" fill="currentColor"/></svg>`,
    next: `<svg viewBox="0 0 20 20" width="13" height="13"><path d="M10 3 L18 10 L10 17 Z" fill="currentColor"/><path d="M2 3 L10 10 L2 17 Z" fill="currentColor"/></svg>`,
    play: `<svg viewBox="0 0 20 20" width="12" height="12"><path d="M4 2 L18 10 L4 18 Z" fill="currentColor"/></svg>`,
    pause: `<svg viewBox="0 0 20 20" width="12" height="12"><rect x="3" y="2" width="5" height="16" rx="1" fill="currentColor"/><rect x="12" y="2" width="5" height="16" rx="1" fill="currentColor"/></svg>`,
    plus: `<svg viewBox="0 0 20 20" width="13" height="13"><path d="M10 3 V17 M3 10 H17" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    // Beliebtheit — bewusst KEIN Herz (das bleibt den persönlichen Favoriten vorbehalten) und
    // kein "auf-/absteigend", da es kein Gegenstück zum Herunterstufen gibt: ein Pfeil nach oben
    // zeigt "wird weitergereicht/wächst", die Zahl daneben zählt die Übernahmen.
    popularity: `<svg viewBox="0 0 20 20" width="11" height="11"><path d="M10 2 L17 11 H12.5 V18 H7.5 V11 H3 Z" fill="currentColor"/></svg>`,
  };
  // Schmaler Transport-Streifen für FREMDE Profile — zeigt die ganze Playlist der besuchten
  // Person (nicht nur einen einzelnen Song), mit Vor/Zurück-Navigation, digitaler Titel-Anzeige
  // und einem "+"-Knopf, um den gerade angezeigten Song direkt zur eigenen Playlist zu übernehmen.
  let profileStripPlaylist = [];
  let profileStripIndex = 0;
  let profileStripPlaying = false;
  async function profileTransportStripHtml(p) {
    const profileId = p.id;
    const list = await Backend.getPlaylist(profileId);
    if (!list.length) return "";
    // Lieblingssong (falls markiert) steht bewusst an erster Stelle, damit er direkt vorgestellt
    // wird, statt in der Liste irgendwo unterzugehen.
    const extra = p.extraProfileData || p.extra_profile_data || {};
    if (extra.showcaseSongUrl) {
      const favIdx = list.findIndex((s) => s.url === extra.showcaseSongUrl);
      if (favIdx > 0) { const [fav] = list.splice(favIdx, 1); list.unshift(fav); }
    }
    profileStripPlaylist = list;
    if (profileStripIndex >= list.length) profileStripIndex = 0;
    const song = list[profileStripIndex];
    const originalId = song.original_recommender_id || profileId;
    const popularity = await Backend.getSongPopularity(originalId, song.title);
    return `
      <div class="profile-transport-strip" data-strip-owner="${profileId}">
        <button type="button" class="strip-btn" data-strip-action="prev">${STRIP_ICONS.prev}</button>
        <button type="button" class="strip-btn" data-strip-action="playpause">${profileStripPlaying ? STRIP_ICONS.pause : STRIP_ICONS.play}</button>
        <button type="button" class="strip-btn" data-strip-action="next">${STRIP_ICONS.next}</button>
        <span class="strip-title">${song.title}</span>
        ${popularity > 0 ? `<span class="strip-popularity" title="So oft wurde dieser Song schon übernommen">${STRIP_ICONS.popularity}${popularity}</span>` : ""}
        <button type="button" class="strip-btn" data-strip-action="addmine" title="Zu meiner Playlist hinzufügen">${STRIP_ICONS.plus}</button>
      </div>`;
  }
  function wireProfileTransportStrip(root, profileObj) {
    const strip = root.querySelector(".profile-transport-strip");
    if (!strip) return;
    strip.querySelectorAll("[data-strip-action]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const action = btn.dataset.stripAction;
        const song = profileStripPlaylist[profileStripIndex];
        if (action === "prev") { profileStripIndex = (profileStripIndex - 1 + profileStripPlaylist.length) % profileStripPlaylist.length; profileStripPlaying = true; }
        if (action === "next") { profileStripIndex = (profileStripIndex + 1) % profileStripPlaylist.length; profileStripPlaying = true; }
        if (action === "playpause") { profileStripPlaying = !profileStripPlaying; }
        if (action === "addmine") {
          if (!Backend.currentUser()) { alert("Bitte zuerst anmelden."); return; }
          // Sich selbst einen eigenen Song "empfehlen" ergibt keinen Sinn — das erzeugte bisher
          // einen unnötigen Zweit-Eintrag in der eigenen Playlist, der die Beliebtheits-Zählung
          // künstlich (und dauerhaft, auch nach dem Löschen des Original-Songs) nach oben trieb.
          if (strip.dataset.stripOwner === Backend.currentUser().id) {
            showToast("Das ist schon dein eigener Song — kein Grund, ihn dir selbst zu empfehlen.");
            return;
          }
          try {
            // Kette weiterreichen: wenn der Song selbst schon eine ursprüngliche Quelle hat (er
            // wurde selbst schon mal übernommen), bleibt DIESE die Beliebtheits-Quelle — nicht
            // die Person, von der ich ihn gerade übernehme.
            const originalId = song.original_recommender_id || strip.dataset.stripOwner;
            const originalName = song.original_recommender_name || profileObj.name;
            await Backend.addPlaylistSong(song.title, song.url, Backend.currentUser().id, originalName, null, originalId, originalName);
            showToast(`➕ Zu deiner Playlist hinzugefügt (empfohlen von ${originalName})!`);
          } catch (err) { alert(err.message || "Konnte nicht hinzugefügt werden."); }
          return;
        }
        if (profileStripPlaying) {
          const nowSong = profileStripPlaylist[profileStripIndex];
          playStandaloneSong({ id: "strip-" + Date.now(), title: nowSong.title, url: nowSong.url });
        }
        const newStrip = await profileTransportStripHtml(profileObj);
        strip.outerHTML = newStrip;
        wireProfileTransportStrip(root, profileObj);
      });
    });
  }
  function showcaseSongStripHtml(p) {
    const extra = p.extraProfileData || p.extra_profile_data || {};
    if (!extra.showcaseSongUrl) return "";
    // Solange der Musik-Player selbst noch gesperrt ist (siehe renderMusicSection), macht ein
    // anklickbarer Schaufenster-Song im Profil auch keinen Sinn — er würde nur zu einem noch
    // fehlerhaften Player führen.
    if (!Backend.isFeatureOn("musik_player")) return "";
    return `
      <button type="button" class="showcase-song-strip" data-showcase-play-url="${extra.showcaseSongUrl}" data-showcase-play-title="${extra.showcaseSongTitle || "Lieblingssong"}">
        <span class="showcase-song-play-icon">${PLAYER_ICONS.play}</span>
        <span class="showcase-song-label">🌟 ${extra.showcaseSongTitle || "Lieblingssong"}</span>
      </button>`;
  }
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-showcase-play-url]");
    if (!btn) return;
    playStandaloneSong({ id: "showcase-" + Date.now(), title: btn.dataset.showcasePlayTitle, url: btn.dataset.showcasePlayUrl });
    showToast("🎵 Spielt jetzt in deinem Player weiter!");
  });
  function playStandaloneSong(song) {
    // WICHTIG — behebt den gemeldeten "zweiter Player"-Bug: da der Showcase-Song jetzt nur noch
    // aus der eigenen Playlist wählbar ist (kein freier Link mehr), muss er in dieser Playlist
    // bereits enthalten sein. Statt die komplette, echte Playlist mit einer Ein-Song-Liste zu
    // ÜBERSCHREIBEN, wird jetzt einfach an die passende Stelle INNERHALB der bestehenden Playlist
    // gesprungen — Vor/Zurück und die restliche Liste bleiben dadurch intakt, echt derselbe
    // Player, statt eines isolierten zweiten.
    const existingIdx = musicPlaylist.findIndex((s) => s.url === song.url);
    if (existingIdx !== -1) {
      musicFloatingBarSuppressed = true;
      playMusicIndex(existingIdx);
      return;
    }
    // Absicherung für ältere, noch nicht bereinigte Profile mit einem freien Link von vorher.
    musicFloatingBarSuppressed = true;
    musicPlaylist = [song];
    musicCurrentIndex = 0;
    playMusicIndex(0);
  }
  // Leichte Aktualisierung NUR für Play/Pause-Icon und Wellenform-Animation — im Gegensatz zu
  // renderMusicPlayerBar() baut das NICHT die komplette Leiste per innerHTML neu auf. Wichtig für
  // die YouTube-Zustandswechsel (onStateChange), die oft mehrfach hintereinander feuern (z. B.
  // durch Zwischenpufferung) — ein voller Neu-Aufbau bei jedem Wechsel ließ dabei sowohl die
  // Zeitanzeige (sprang kurz auf "--:--" zurück) als auch das Cover-Bild (wurde neu geladen)
  // sichtbar flackern.
  function updateMusicPlayPauseIconOnly() {
    const btn = document.getElementById("musicPlayPauseBtn");
    if (btn) btn.innerHTML = musicIsPlaying ? PLAYER_ICONS.pause : PLAYER_ICONS.play;
    const waveform = document.querySelector("#musicPlayerBarInner .kn-waveform");
    if (waveform) waveform.classList.toggle("waveform-playing", musicIsPlaying);
  }
  function playMusicIndex(playlistIdx) {
    const song = musicPlaylist[playlistIdx];
    if (!song) return;
    musicCurrentIndex = playlistIdx;
    // Zuletzt gespielten Song merken (Titel + Adresse, nicht nur der Index — der Index kann sich
    // je nach Playlist-Reihenfolge ändern), damit der Player beim nächsten Öffnen automatisch
    // wieder damit vorgeladen ist, statt leer zu starten.
    if (Backend.currentUser()) {
      Backend.updateExtraProfileField("lastPlayedSong", { title: song.title, url: song.url });
    }
    const audioEl = document.getElementById("musicAudioNative");
    // Spotify-Songs: eigenes Embed-Widget übernimmt die Wiedergabe komplett selbst (siehe
    // renderMusicPlayerBar) — hier nur sicherstellen, dass eine evtl. noch laufende YouTube-/
    // MP3-Wiedergabe vom vorherigen Song gestoppt wird, dann direkt zur UI-Aktualisierung springen.
    if (Backend.isSpotifyUrl(song.url)) {
      if (audioEl) audioEl.pause();
      if (ytMusicPlayer && ytMusicPlayer.stopVideo) { try { ytMusicPlayer.stopVideo(); } catch (e) {} }
      musicIsPlaying = false;
      renderMusicSection();
      return;
    }
    if (Backend.isDirectAudioUrl(song.url)) {
      if (ytMusicPlayer && ytMusicPlayer.stopVideo) { try { ytMusicPlayer.stopVideo(); } catch (e) {} }
      audioEl.src = song.url;
      audioEl.play().catch(() => {});
      musicIsPlaying = true;
      // WICHTIG: KEIN renderMusicPlayerBar() hier direkt aufrufen — renderMusicSection() weiter
      // unten baut den gesamten Bereich per area.innerHTML neu auf UND ruft danach selbst
      // renderMusicPlayerBar() auf. Ein früherer, direkter Aufruf hier würde das Video-/Cover-
      // Element in den (kurz danach überschriebenen) Bereich zurückverschieben, wo es dann beim
      // area.innerHTML-Neuaufbau spurlos verschwindet — genau das ließ MP3-Symbol/Cover nie
      // erscheinen.
    } else {
      audioEl.pause();
      const videoId = extractYouTubeId(song.url);
      if (!videoId) return;
      // Immer die zuletzt tatsächlich GEWÜNSCHTE Video-ID merken — das ist die "Quelle der
      // Wahrheit", unabhängig davon, wie viele Klicks währenddessen noch dazwischenkommen.
      ytDesiredVideoId = videoId;
      loadYouTubeIframeApi(() => {
        if (!ytMusicPlayer) {
          ytMusicPlayer = new YT.Player("musicYtHost", {
            // WICHTIG: eine vernünftige Ausgangsgröße hier, NICHT 1×1 Pixel — ein winzig
            // initialisierter YouTube-Player lädt/spielt oft unzuverlässig, selbst wenn CSS ihn
            // später sichtbar vergrößert. Die eigentliche kleine Vorschau-Darstellung übernimmt
            // ausschließlich das umgebende CSS (.music-video-square).
            height: "200", width: "200", videoId,
            playerVars: {
              origin: window.location.origin,
              // WICHTIG: Wir haben eigene Bedienelemente (Play/Pause, Weiter/Zurück usw.) — die
              // NATIVEN YouTube-Bedienelemente (Vollbild-Knopf, "Video-Info"-Overlay, verwandte
              // Videos am Ende) sollen deshalb komplett verschwinden, statt als zusätzliche,
              // schwebende Symbole über dem kleinen Video-Ausschnitt zu liegen.
              controls: 0,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              iv_load_policy: 3,
              disablekb: 1,
              // WICHTIG speziell für Mobilgeräte (iOS/Android): OHNE playsinline:1 versucht das
              // Video beim Start automatisch ins NATIVE Vollbild zu springen bzw. schlägt das als
              // Overlay vor — genau das ungewollte "Vergrößern-Vorschlag beim neuen Lied".
              playsinline: 1,
            },
            events: {
              // WICHTIG: NICHT einfach die videoId abspielen, mit der der Player ursprünglich
              // erstellt wurde — onReady feuert asynchron, und bis dahin kann der Nutzer längst
              // einen ANDEREN Song angefordert haben. Stattdessen immer die zuletzt gewünschte
              // Video-ID laden (das behebt den "immer wieder nur der erste Song"-Fehler).
              onReady: (e) => {
                ytPlayerIsReady = true;
                if (ytDesiredVideoId && ytDesiredVideoId !== videoId) {
                  e.target.loadVideoById(ytDesiredVideoId);
                } else {
                  e.target.playVideo();
                }
                musicIsPlaying = true;
                updateMusicPlayPauseIconOnly();
              },
              onStateChange: (e) => {
                if (window.YT && e.data === YT.PlayerState.ENDED) playNextMusic(true);
                if (window.YT && e.data === YT.PlayerState.PLAYING) { musicIsPlaying = true; updateMusicPlayPauseIconOnly(); }
                if (window.YT && e.data === YT.PlayerState.PAUSED) { musicIsPlaying = false; updateMusicPlayPauseIconOnly(); }
              },
              // WICHTIG: bisher wurden YouTube-Fehler (Video nicht verfügbar, Einbetten vom
              // Rechteinhaber gesperrt, ungültige ID …) gar nicht abgefangen — es passierte
              // einfach nichts sichtbar, ohne jeden Hinweis, was schiefging. Jetzt zeigt eine
              // klare Meldung, WARUM es nicht abspielt, statt stiller Funkstille.
              onError: (e) => {
                const reasons = { 2: "Die Video-ID ist ungültig.", 5: "Das Video kann in diesem Player nicht abgespielt werden.", 100: "Dieses Video wurde entfernt oder ist privat.", 101: "Der/die Ersteller:in hat das Einbetten dieses Videos gesperrt.", 150: "Der/die Ersteller:in hat das Einbetten dieses Videos gesperrt." };
                showToast(`⚠️ YouTube-Video kann nicht abgespielt werden: ${reasons[e.data] || "Unbekannter Fehler (Code " + e.data + ")"}`);
              },
            },
          });
        } else if (ytPlayerIsReady) {
          ytMusicPlayer.loadVideoById(videoId);
          musicIsPlaying = true;
        } else {
          // Der Player existiert zwar schon, ist aber noch nicht bereit (onReady vom vorherigen
          // Song steht noch aus) — loadVideoById() JETZT aufzurufen würde ins Leere laufen. Die
          // ytDesiredVideoId ist oben schon aktualisiert; sobald onReady feuert, lädt es
          // automatisch die zuletzt gewünschte ID nach.
        }
        // Auch hier KEIN direkter renderMusicPlayerBar()-Aufruf mehr — aus demselben Grund wie
        // beim MP3-Zweig oben: renderMusicSection() (unten) baut den Bereich neu auf und ruft
        // danach selbst renderMusicPlayerBar() korrekt auf.
      });
    }
    renderMusicSection();
  }
  function toggleMusicPlayPause() {
    const song = musicPlaylist[musicCurrentIndex];
    if (!song) return;
    const audioEl = document.getElementById("musicAudioNative");
    // WICHTIG — behebt den Bug "man kann gar kein Lied mehr abspielen": bisher ging dieser Knopf
    // davon aus, dass der Song schon einmal über playMusicIndex() (also durch einen Klick in der
    // Liste) geladen wurde. Öffnete man die Musik-Seite aber neu und tippte DIREKT auf diesen
    // großen Play-Knopf (ohne vorher einen Song in der Liste anzutippen), war weder ytMusicPlayer
    // initialisiert noch audioEl.src gesetzt — der Knopf tat dann buchstäblich nichts, wechselte
    // aber trotzdem sein eigenes Icon zu "Pause", was fälschlich den Eindruck erweckte, es würde
    // spielen. Jetzt: fehlt die tatsächliche Quelle noch, wird der Song zuerst richtig geladen.
    const needsFirstLoad = Backend.isDirectAudioUrl(song.url) ? !audioEl.src || !audioEl.src.includes(encodeURI(song.url.split("/").pop() || song.url)) : !ytMusicPlayer;
    if (needsFirstLoad) {
      playMusicIndex(musicCurrentIndex);
      return;
    }
    if (Backend.isDirectAudioUrl(song.url)) {
      if (musicIsPlaying) audioEl.pause(); else audioEl.play().catch(() => {});
    } else if (ytMusicPlayer) {
      if (musicIsPlaying) ytMusicPlayer.pauseVideo(); else ytMusicPlayer.playVideo();
    }
    musicIsPlaying = !musicIsPlaying;
    renderMusicPlayerBar();
  }
  // isAutoAdvance: true nur beim automatischen Songende (YouTube ENDED / Audio "ended"-Event) —
  // NICHT beim manuellen "Weiter"-Klick, der immer zum nächsten Song springen soll, unabhängig
  // vom Wiederhol-Modus.
  function playNextMusic(isAutoAdvance) {
    const list = musicVisiblePlaylist();
    if (!list.length) return;
    if (isAutoAdvance && musicRepeatMode === "one") {
      // Denselben Song einfach von vorn starten, statt zum nächsten zu springen.
      playMusicIndex(musicCurrentIndex);
      return;
    }
    const curSong = musicPlaylist[musicCurrentIndex];
    const curVisIdx = curSong ? list.findIndex((s) => s.id === curSong.id) : -1;
    if (musicShuffleOn) {
      // Zufälliger anderer Song aus der sichtbaren Liste (nicht derselbe, außer es gibt nur einen).
      const candidates = list.filter((_, i) => i !== curVisIdx);
      const pick = (candidates.length ? candidates : list)[Math.floor(Math.random() * (candidates.length || list.length))];
      playMusicIndex(musicPlaylist.findIndex((s) => s.id === pick.id));
      return;
    }
    const atEnd = curVisIdx === list.length - 1;
    if (isAutoAdvance && atEnd && musicRepeatMode === "off") {
      // Playlist ist einmal durch, kein Wiederhol-Modus aktiv — sauber stoppen statt endlos von
      // vorn zu beginnen.
      const audioEl = document.getElementById("musicAudioNative");
      if (audioEl) audioEl.pause();
      if (ytMusicPlayer && ytMusicPlayer.pauseVideo) { try { ytMusicPlayer.pauseVideo(); } catch (e) {} }
      musicIsPlaying = false;
      renderMusicPlayerBar();
      return;
    }
    const nextSong = list[(curVisIdx + 1) % list.length];
    playMusicIndex(musicPlaylist.findIndex((s) => s.id === nextSong.id));
  }
  function playPrevMusic() {
    const list = musicVisiblePlaylist();
    if (!list.length) return;
    const curSong = musicPlaylist[musicCurrentIndex];
    const curVisIdx = curSong ? list.findIndex((s) => s.id === curSong.id) : -1;
    const prevSong = list[(curVisIdx - 1 + list.length) % list.length];
    playMusicIndex(musicPlaylist.findIndex((s) => s.id === prevSong.id));
  }
  function renderMusicPlayerBar() {
    const bar = document.getElementById("musicPlayerBarInner");
    if (bar) {
      // WICHTIG: das echte Video-Element (per JS an seinen Platz verschoben, nicht Teil dieses
      // HTML-Strings) muss VOR dem Neusetzen von bar.innerHTML "in Sicherheit" gebracht werden —
      // sonst würde es beim Überschreiben mitgelöscht, da es zu diesem Zeitpunkt physisch
      // innerhalb von bar liegt.
      const videoSquareRescue = document.getElementById("musicVideoSquare");
      if (videoSquareRescue) document.body.appendChild(videoSquareRescue);
      const song = musicPlaylist[musicCurrentIndex];
      // Der Aufklapp-Knopf erscheint bei JEDEM Song — auch reine MP3-Links ohne eigenes Cover
      // zeigen jetzt ein animiertes Musik-Symbol statt einer leeren Fläche, damit dort nie mehr
      // "nichts" zu sehen ist.
      const hasVisualContent = Boolean(song);
      const playerUpdateOn = Backend.isFeatureOn("musikplayer_update");
      // Spotify-Songs bekommen ein eigenes, natives Einbettungs-Widget statt der normalen
      // Player-Leiste — Spotify bietet ohne Premium-Konto samt OAuth (Web Playback SDK) keine
      // programmatische Steuerung über eigene Play/Pause/Vor/Zurück-Knöpfe, wie es bei YouTube
      // über die Iframe-API möglich ist. Das native Embed bringt eigene, vollständige
      // Bedienelemente mit — ehrlicher und zuverlässiger, als zu versuchen, Spotify mit unseren
      // eigenen Knöpfen fernzusteuern, was technisch ohne diesen Premium-Zugang nicht geht.
      const spotifyInfo = song ? Backend.extractSpotifyEmbed(song.url) : null;
      if (song && spotifyInfo) {
        bar.innerHTML = `
          <div class="music-player-v2">
            <div class="music-player-title-block" style="margin-bottom:8px;">
              <span class="music-player-title">${song.title}</span>
              <span class="empty-note" style="font-size:0.7rem;">🎧 Spotify — eigene Bedienelemente unten im Fenster</span>
            </div>
            <iframe src="https://open.spotify.com/embed/${spotifyInfo.type}/${spotifyInfo.id}" width="100%" height="152" frameborder="0" allow="autoplay; encrypted-media; clipboard-write; fullscreen; picture-in-picture" loading="lazy" style="border-radius:12px;"></iframe>
            <div class="music-player-row-controls" style="margin-top:8px;">
              <button type="button" class="player-panel-btn ghost-btn" id="musicPrevBtn" aria-label="Vorheriger Song">${PLAYER_ICONS.prev}</button>
              <button type="button" class="player-panel-btn ghost-btn" id="musicNextBtn" aria-label="Nächster Song">${PLAYER_ICONS.next}</button>
            </div>
          </div>`;
        document.getElementById("musicPrevBtn")?.addEventListener("click", playPrevMusic);
        document.getElementById("musicNextBtn")?.addEventListener("click", () => playNextMusic(false));
        return;
      }
      bar.innerHTML = song ? `
        <div class="music-player-v2">
          <div class="music-player-row-top">
            <div id="musicVideoSquareSlot" class="music-player-cover-slot" style="${musicCoverCollapsed ? "display:none;" : ""}"></div>
            <div class="music-player-title-block">
              <span class="music-player-title">${song.title}</span>
              <span id="musicDigitalTime" class="player-digital-time">--:-- / --:--</span>
            </div>
            ${hasVisualContent ? `<button type="button" class="player-panel-btn ghost-btn music-player-collapse-btn" id="musicExpandToggle" title="${musicCoverCollapsed ? "Cover wieder einblenden" : "Nur Titel anzeigen, Cover ausblenden"}">${musicCoverCollapsed ? PLAYER_ICONS.expand : PLAYER_ICONS.collapse}</button>` : ""}
          </div>
          ${playerUpdateOn ? `<span class="kn-waveform music-player-waveform ${musicIsPlaying ? "waveform-playing" : ""}" aria-hidden="true">
            ${Array.from({ length: 24 }).map((_, i) => `<span class="waveform-bar" style="animation-delay:${(i * 0.045).toFixed(2)}s; height:${6 + (i % 6) * 3}px;"></span>`).join("")}
          </span>` : ""}
          <div class="music-player-row-controls">
            ${playerUpdateOn ? `
              <button type="button" class="player-mode-btn ${musicShuffleOn ? "active" : ""}" id="musicShuffleBtn" title="Zufallsmodus">${PLAYER_ICONS.shuffle}</button>
              <button type="button" class="player-mode-btn ${musicRepeatMode === "one" ? "active" : ""}" id="musicRepeatOneBtn" title="Diesen Song wiederholen">${PLAYER_ICONS.repeatOne}</button>
            ` : `<span class="music-player-controls-spacer"></span>`}
            <button type="button" class="player-panel-btn ghost-btn" id="musicPrevBtn" aria-label="Vorheriger Song">${PLAYER_ICONS.prev}</button>
            <button type="button" class="player-panel-btn music-player-play-main" id="musicPlayPauseBtn" aria-label="Play/Pause">${musicIsPlaying ? PLAYER_ICONS.pause : PLAYER_ICONS.play}</button>
            <button type="button" class="player-panel-btn ghost-btn" id="musicNextBtn" aria-label="Nächster Song">${PLAYER_ICONS.next}</button>
            ${playerUpdateOn ? `
              <button type="button" class="player-mode-btn ${musicRepeatMode === "all" ? "active" : ""}" id="musicRepeatAllBtn" title="Playlist wiederholen">${PLAYER_ICONS.repeatAll}</button>
              <button type="button" class="player-mode-btn" id="musicQuickListToggle" title="Song-Liste ein-/ausblenden">${PLAYER_ICONS.list}</button>
            ` : `<span class="music-player-controls-spacer"></span>`}
          </div>
        </div>
      ` : `<span class="empty-note">Kein Song ausgewählt — wähl unten einen aus der Liste.</span>`;
      // Das quadratische Video-Fenster physisch in die gerade sichtbare Leiste verschieben (Musik-
      // Reiter bevorzugt, sonst die schwebende Leiste) — dieselbe DOM-Node bleibt dabei bestehen,
      // sodass der YouTube-Player nicht neu geladen werden muss. Cover-Bild (falls gesetzt) liegt
      // als eigene Ebene DARÜBER und verdeckt das Video optisch, ohne es zu stoppen — Ton läuft
      // im Hintergrund unverändert weiter. Beim "Einklappen" wird nur die SICHTBARKEIT versteckt
      // (display:none am Slot), der Player selbst läuft im Hintergrund ungestört weiter.
      const videoSquare = document.getElementById("musicVideoSquare");
      const slot = document.getElementById("musicVideoSquareSlot");
      if (videoSquare && slot && song) {
        slot.appendChild(videoSquare);
        videoSquare.style.display = "";
        let coverLayer = videoSquare.querySelector(".music-cover-layer");
        let mp3Icon = videoSquare.querySelector(".music-mp3-icon");
        if (song.cover_url) {
          if (!coverLayer) {
            coverLayer = document.createElement("img");
            coverLayer.className = "music-cover-layer";
            videoSquare.appendChild(coverLayer);
          }
          coverLayer.src = song.cover_url;
          coverLayer.style.display = "";
          if (mp3Icon) mp3Icon.style.display = "none";
        } else if (Backend.isDirectAudioUrl(song.url)) {
          // WICHTIG — behebt den "grauen YouTube-Rest-Würfel"-Bug: das MP3-Symbol muss IMMER
          // gezeigt werden, wenn der aktuelle Song eine direkte Audiodatei ohne Cover ist —
          // unabhängig vom musikplayer_update-Feature-Flag (das war vorher nur fürs neue Layout
          // gedacht, hat aber ungewollt auch diese Verdeckungs-Logik mit ausgeschaltet). War das
          // Flag aus, fiel dieser Fall in den else-Zweig unten, der davon ausgeht, es handle sich
          // um ein aktives YouTube-Video — das alte, gestoppte YouTube-Bild blieb dann sichtbar,
          // obwohl in Wirklichkeit ein MP3 lief.
          if (coverLayer) coverLayer.style.display = "none";
          if (!mp3Icon) {
            mp3Icon = document.createElement("span");
            mp3Icon.className = "music-mp3-icon";
            mp3Icon.textContent = "🎵";
            videoSquare.appendChild(mp3Icon);
          }
          mp3Icon.style.display = "";
          mp3Icon.classList.toggle("music-mp3-icon-playing", musicIsPlaying);
        } else {
          if (coverLayer) coverLayer.style.display = "none";
          if (mp3Icon) mp3Icon.style.display = "none";
        }
      }
      document.getElementById("musicPrevBtn")?.addEventListener("click", playPrevMusic);
      document.getElementById("musicNextBtn")?.addEventListener("click", () => playNextMusic(false));
      document.getElementById("musicPlayPauseBtn")?.addEventListener("click", toggleMusicPlayPause);
      document.getElementById("musicExpandToggle")?.addEventListener("click", () => { musicCoverCollapsed = !musicCoverCollapsed; renderMusicPlayerBar(); });
      document.getElementById("musicQuickListToggle")?.addEventListener("click", () => {
        musicQuickListOpen = !musicQuickListOpen;
        renderMusicQuickList();
      });
      document.getElementById("musicShuffleBtn")?.addEventListener("click", () => {
        musicShuffleOn = !musicShuffleOn;
        renderMusicPlayerBar();
      });
      document.getElementById("musicRepeatOneBtn")?.addEventListener("click", () => {
        musicRepeatMode = musicRepeatMode === "one" ? "off" : "one";
        renderMusicPlayerBar();
      });
      document.getElementById("musicRepeatAllBtn")?.addEventListener("click", () => {
        musicRepeatMode = musicRepeatMode === "all" ? "off" : "all";
        renderMusicPlayerBar();
      });
      renderMusicQuickList();
    }
    renderMusicFloatingBar();
    applyPlayerTemplateClass();
  }
  // Kompakte Schnellliste DIREKT im Player — nur Titel, antippen startet sofort. Getrennt von
  // der vollständigen Verwaltungsliste weiter unten (die hat Löschen/Cover/Favorit-Knöpfe usw.,
  // was hier bewusst weggelassen wird, um es schnell und übersichtlich zu halten).
  function renderMusicQuickList() {
    const list = document.getElementById("musicQuickList");
    if (!list) return;
    if (!Backend.isFeatureOn("musikplayer_update")) { list.style.display = "none"; return; }
    list.style.display = musicQuickListOpen ? "block" : "none";
    if (!musicQuickListOpen) return;
    const visible = musicVisiblePlaylist();
    list.innerHTML = visible.length ? visible.map((s) => {
      const idx = musicPlaylist.findIndex((x) => x.id === s.id);
      const isCurrent = idx === musicCurrentIndex;
      return `<button type="button" class="glass-quick-list-item ${isCurrent ? "active" : ""}" data-quick-play="${idx}">${isCurrent && musicIsPlaying ? PLAYER_ICONS.playingMini : PLAYER_ICONS.noteMini} ${s.title}</button>`;
    }).join("") : `<p class="empty-note" style="padding:8px;">Noch keine Songs in der Liste.</p>`;
    list.querySelectorAll("[data-quick-play]").forEach((btn) => {
      btn.addEventListener("click", () => playMusicIndex(Number(btn.dataset.quickPlay)));
    });
  }
  // Schwebende Leiste, sichtbar auf der GANZEN Seite (nicht nur im Musik-Reiter) — erscheint erst,
  // sobald wirklich ein Song ausgewählt wurde, damit sie nicht unnötig Platz wegnimmt, wenn noch
  // niemand Musik gestartet hat.
  function renderMusicFloatingBar() {
    const floatBar = document.getElementById("musicFloatingBar");
    if (!floatBar) return;
    // Solange der Musik-Player gesperrt ist, soll auch die schwebende Leiste gar nicht erst
    // auftauchen können — konsistent mit dem gesperrten Musik-Bereich selbst.
    if (!Backend.isFeatureOn("musik_player")) { floatBar.style.display = "none"; return; }
    // WICHTIG: Das echte Video-/iframe-Element VOR jedem möglichen innerHTML-Setzen unten "in
    // Sicherheit" bringen (falls es gerade in floatBar liegt) — sonst würde es bei jedem der
    // folgenden innerHTML-Aufrufe (auch bei "" beim Verstecken) mitgelöscht und beim nächsten Mal
    // komplett neu erstellt. Ein iframe, das im DOM neu erstellt statt nur verschoben wird, lädt
    // sich dabei neu — das war die eigentliche Ursache des "Einfrieren und Kreiseln"-Verhaltens
    // bei jeder Seitennavigation, während gerade ein Song lief.
    const videoSquareRescue = document.getElementById("musicVideoSquare");
    if (videoSquareRescue) document.body.appendChild(videoSquareRescue);
    const song = musicPlaylist[musicCurrentIndex];
    if (!song) { floatBar.style.display = "none"; floatBar.innerHTML = ""; return; }
    const knowledgeViewOpen = document.getElementById("view-knowledge")?.dataset.active === "true";
    const musicTabOpen = knowledgeViewOpen && document.getElementById("sub-music")?.dataset.active === "true";
    // WICHTIG: Solange man bereits im Musik-Reiter ist, gibt es dort schon eine eigene Player-
    // Leiste — die schwebende Leiste blieb bisher IMMER sichtbar und überlagerte sich dann mit
    // dieser, mit zwei UNABHÄNGIGEN Play/Pause-Knöpfen an (fast) derselben Bildschirmstelle. Ein
    // einzelner Klick konnte dadurch beide gleichzeitig treffen und den Zustand zweimal
    // hintereinander umschalten — genau das "startet und stoppt sofort wieder"-Verhalten.
    if (musicTabOpen) { floatBar.style.display = "none"; floatBar.innerHTML = ""; return; }
    // Wenn die Leiste bereits für GENAU DIESEN Song aufgebaut ist, NICHT erneut floatBar.innerHTML
    // setzen — nur die wirklich dynamischen Teile (Play/Pause-Icon, Titel) aktualisieren.
    if (floatBar.dataset.builtForSongId === String(song.id) && floatBar.style.display === "flex") {
      const playPauseBtn = document.getElementById("mfbPlayPause");
      if (playPauseBtn) playPauseBtn.innerHTML = musicIsPlaying ? PLAYER_ICONS.pause : PLAYER_ICONS.play;
      const titleBtn = document.getElementById("mfbTitle");
      if (titleBtn) titleBtn.textContent = `🎵 ${song.title}`;
      return;
    }
    floatBar.style.display = "flex";
    floatBar.className = "music-floating-bar";
    floatBar.dataset.builtForSongId = String(song.id);
    floatBar.innerHTML = `
      <div id="musicVideoSquareSlotFloat" style="flex-shrink:0;"></div>
      <button type="button" class="mfb-ctrl" id="mfbPrev" aria-label="Vorheriger Song">${PLAYER_ICONS.prev}</button>
      <button type="button" class="mfb-ctrl" id="mfbPlayPause" aria-label="Play/Pause">${musicIsPlaying ? PLAYER_ICONS.pause : PLAYER_ICONS.play}</button>
      <button type="button" class="mfb-title" id="mfbTitle">🎵 ${song.title}</button>
      <button type="button" class="mfb-ctrl" id="mfbNext" aria-label="Nächster Song">${PLAYER_ICONS.next}</button>
    `;
    relocateMusicVideoSquare();
    // WICHTIG: className wurde oben komplett neu gesetzt (überschreibt auch eine eventuell schon
    // vorhandene player-tpl-*-Klasse) — die Design-Vorlage muss deshalb hier erneut angewendet
    // werden, sonst erscheint die schwebende Leiste beim Tab-Wechsel kurz im Standard-Design,
    // während die In-Page-Leiste weiterhin das richtige Design zeigt (genau das beschriebene
    // "wechselt beim Tab-Wechsel das Design"-Problem).
    applyPlayerTemplateClass();
    document.getElementById("mfbPrev").addEventListener("click", playPrevMusic);
    document.getElementById("mfbNext").addEventListener("click", () => playNextMusic(false));
    document.getElementById("mfbPlayPause").addEventListener("click", toggleMusicPlayPause);
    document.getElementById("mfbTitle").addEventListener("click", () => {
      document.querySelector('[data-target="view-knowledge"]').click();
      document.querySelector('#knowledgeSubnav [data-sub="sub-music"]').click();
    });
    // Der Inhalt ist jetzt fertig aufgebaut — solange nur aus dem Profil-Streifen heraus gehört
    // wird (noch kein Tab-Wechsel seitdem), bleibt die Leiste trotzdem unsichtbar. Der Ton läuft
    // unabhängig davon ganz normal weiter; erst beim tatsächlichen Tab-Wechsel wird sie sichtbar
    // gemacht (siehe revealMusicFloatingBarOnNavigation), mit einer sanften Erscheinungs-
    // Animation statt eines abrupten Sprungs.
    if (musicFloatingBarSuppressed) {
      floatBar.style.display = "none";
    }
  }
  // Macht die schwebende Leiste sichtbar, FALLS sie gerade wegen "nur im Profil gehört"
  // unterdrückt war — mit einer sanften Einblend-Animation statt eines ruckartigen Sprungs. Wird
  // beim tatsächlichen Wechsel des Haupt-Tabs aufgerufen (nicht beim bloßen Starten eines Songs).
  function revealMusicFloatingBarOnNavigation() {
    if (!musicFloatingBarSuppressed) return;
    musicFloatingBarSuppressed = false;
    renderMusicFloatingBar();
    const floatBar = document.getElementById("musicFloatingBar");
    if (floatBar && floatBar.style.display === "flex") {
      floatBar.classList.remove("music-floating-bar-reveal");
      // Reflow erzwingen, damit die Animation bei jedem Aufruf neu von vorn abspielt.
      void floatBar.offsetWidth;
      floatBar.classList.add("music-floating-bar-reveal");
    }
  }
  const PLAYER_TEMPLATES = {
    klassisch: { label: "☕ Klassisch", desc: "Warmes Design, passend zur Seite." },
    retro: { label: "📻 Retro-Stereo", desc: "Dunkles Panel mit LED-Akzenten, 80er/90er-Flair." },
    holz: { label: "🪵 Holzoptik", desc: "Warmes Holzpaneel-Design." },
    chrom: { label: "🪩 Chrom & Glas", desc: "Kühles, modernes High-End-Gerät mit glänzenden Metallflächen." },
    roehrenradio: { label: "📟 Röhrenradio", desc: "Nostalgisches Bakelit-Design, wie ein altes Röhrenradio." },
    flowerpower: { label: "🌼 Flowerpower", desc: "Bunte Blüten in verschiedenen Größen, wie mit Stickern beklebt." },
    wolken: { label: "☁️ Über den Wolken", desc: "Blau-weißer Himmelverlauf mit angedeuteter Wolkenstruktur." },
    halloween: { label: "🎃 Halloween", desc: "Kürbisse in verschiedenen Größen vor dunklem Nachthimmel." },
    ozean: { label: "🐠 Ozean", desc: "Dunkles Unterwasser-Design mit Fischen und aufsteigenden Blasen." },
  };
  function getPlayerTemplate() {
    const profile = Backend.currentProfile();
    return (profile && profile.extraProfileData && profile.extraProfileData.playerTemplate) || "klassisch";
  }
  async function setPlayerTemplate(key) {
    await Backend.updateExtraProfileField("playerTemplate", key);
    applyPlayerTemplateClass();
  }
  function applyPlayerTemplateClass() {
    const template = getPlayerTemplate();
    document.querySelectorAll(".music-floating-bar, #musicPlayerBarInner").forEach((el) => {
      // Generisch ALLE player-tpl-*-Klassen entfernen (nicht nur eine feste Liste) — sonst würde
      // beim Hinzufügen künftiger Vorlagen die vorherige Klasse beim Wechseln hängen bleiben.
      [...el.classList].forEach((c) => { if (c.startsWith("player-tpl-")) el.classList.remove(c); });
      el.classList.add(`player-tpl-${template}`);
    });
  }
  async function renderMusicSection() {
    const area = document.getElementById("musicArea");
    if (!area) return;
    // WICHTIG: der Musik-Player läuft noch nicht zuverlässig (Wiedergabe stoppt beim Navigieren) —
    // deshalb bewusst hinter einer Freigabe-Sperre versteckt, bis das behoben ist. Nur der/die
    // Betreiber:in bzw. eingeladene Beta-Tester:innen sehen den Bereich vorab, alle anderen sehen
    // "kommt bald", damit niemand auf ein noch fehlerhaftes Feature stößt.
    if (!renderComingSoonGate(area, "musik_player", "Musik", "🎵")) return;
    // Dieselbe Absicherung wie in renderMusicPlayerBar(): das echte Video-/Cover-Element muss VOR
    // dem Neusetzen von area.innerHTML "in Sicherheit" gebracht werden — sonst würde es beim
    // Überschreiben mitgelöscht, falls es zu diesem Zeitpunkt gerade innerhalb von area liegt.
    const videoSquareRescue = document.getElementById("musicVideoSquare");
    if (videoSquareRescue) document.body.appendChild(videoSquareRescue);
    const user = Backend.currentUser();
    const isAdmin = Backend.canModerate ? Backend.canModerate() : false;
    const isMine = musicPlaylistMode === "mine";
    const isFriendView = musicPlaylistMode === "friend";
    const canManage = isMine ? Boolean(user) : (isFriendView ? false : isAdmin);
    const ownerIdForActions = isMine && user ? user.id : null;
    const list = musicVisiblePlaylist();
    // Player OHNE Klick vorladen: bevorzugt den zuletzt gespielten Song (falls er noch in DIESER
    // Playlist existiert), sonst den ersten Song der Liste — NUR den Index setzen, NICHT
    // tatsächlich abspielen, damit man beim Öffnen nicht ungefragt Musik hört.
    if (musicCurrentIndex === -1 && list.length) {
      const lastPlayed = Backend.currentProfile()?.extraProfileData?.lastPlayedSong;
      const matchIdx = lastPlayed ? list.findIndex((s) => s.url === lastPlayed.url) : -1;
      musicCurrentIndex = matchIdx >= 0 ? matchIdx : 0;
    }
    area.innerHTML = `
      <p class="empty-note" style="margin-bottom:10px;">${isFriendView ? `🎵 ${musicViewingFriendName}s Playlist — hol dir Songs, die dir gefallen, direkt in deine eigene Playlist.` : isMine ? "Deine eigene Playlist — trag deine Lieblingssongs ein, andere können sie über dein Profil entdecken." : "Eine gemeinsame Playlist zum Deutschlernen — Songs werden von Alex ausgewählt."} Herz antippen, um Favoriten zu markieren.</p>
      <div class="order-toggle" style="margin-bottom:12px; flex-wrap:wrap;">
        <button type="button" class="order-pill" id="musicCommunityTab" aria-selected="${!isMine && !isFriendView}">🌐 Gemeinsame Playlist</button>
        <button type="button" class="order-pill" id="musicMineTab" aria-selected="${isMine}">👤 Meine Playlist</button>
        ${isFriendView ? `<button type="button" class="order-pill" aria-selected="true">🎵 ${musicViewingFriendName}s Playlist</button>` : ""}
      </div>
      ${!isFriendView ? `
      <div class="question-card" style="margin-bottom:14px;">
        <button type="button" class="emoji-toggle-link" id="musicUsersListToggle" style="margin:0;">🎵 Playlisten anderer Mitglieder entdecken</button>
        <div id="musicUsersListBody" style="display:none; margin-top:10px;"><p class="empty-note">Lade…</p></div>
      </div>` : ""}
      <div class="question-card" style="position:sticky; top:0; z-index:5; margin-bottom:14px;">
        ${inlineFeatureFlagToggleHtml("musikplayer_update")}
        <div id="musicPlayerBarInner" style="display:flex; align-items:center; gap:5px; flex-wrap:wrap;"></div>
        <div class="glass-quick-list" id="musicQuickList" style="display:${musicQuickListOpen ? "block" : "none"};"></div>
        <div style="display:flex; gap:6px; margin-top:10px; flex-wrap:wrap;">
          ${Object.entries(PLAYER_TEMPLATES).map(([key, t]) => `<button type="button" class="order-pill player-tpl-pick" data-tpl="${key}" aria-selected="${getPlayerTemplate() === key}" title="${t.desc}" style="font-size:0.78rem; padding:9px 12px; min-height:38px;">${t.label}</button>`).join("")}
        </div>
      </div>
      ${canManage ? `
        <div class="question-card" style="margin-bottom:14px;">
          <button type="button" class="emoji-toggle-link" id="musicAddToggle" style="margin:0;">➕ Song zur ${isMine ? "eigenen" : "gemeinsamen"} Playlist hinzufügen</button>
          <div id="musicAddFormBody" style="display:none; margin-top:12px;">
            <div class="form-field"><label>Titel</label><input type="text" id="musicTitleInput" maxlength="100" placeholder="z. B. 99 Luftballons — Nena" /></div>
            <div class="form-field"><label>YouTube-, Spotify- ODER direkter Audio-Link (z. B. GitHub-Rohlink zu einer MP3)</label><input type="text" id="musicUrlInput" placeholder="https://www.youtube.com/watch?v=… oder https://open.spotify.com/track/… oder https://…mp3" /></div>
            <button type="button" class="btn btn-coffee" id="musicAddSubmitBtn">Hinzufügen</button>
            <p class="form-error" id="musicAddError" style="display:none;"></p>
          </div>
          ${MUSIC_SUGGESTIONS.some((s) => !musicPlaylist.some((p) => p.title === s.title)) ? `<button type="button" class="emoji-toggle-link" id="musicSuggestBtn" style="margin-top:10px;">✨ Von dir gewünschte Songs einfügen (${MUSIC_SUGGESTIONS.filter((s) => !musicPlaylist.some((p) => p.title === s.title)).length})</button>` : ""}
          ${!isMine ? `<button type="button" class="emoji-toggle-link" id="musicTrashToggle" style="margin-top:10px; display:block;">🗑️ Entfernte Songs wiederherstellen</button>
          <div id="musicTrashBody" style="display:none; margin-top:10px;"></div>` : ""}
        </div>` : (isMine && !user ? `<p class="empty-note" style="margin-bottom:14px;">Bitte zuerst anmelden, um eine eigene Playlist anzulegen.</p>` : "")}
      <div class="order-toggle" style="margin-bottom:12px;">
        <button type="button" class="order-pill" id="musicAllTab" aria-selected="${!musicShowFavoritesOnly}">🎵 Alle Songs</button>
        <button type="button" class="order-pill" id="musicFavTab" aria-selected="${musicShowFavoritesOnly}">❤️ Favoriten</button>
      </div>
      <div class="breakdown-list">
        ${list.length ? list.map((s) => {
          const idx = musicPlaylist.findIndex((x) => x.id === s.id);
          const isFav = musicFavIds.includes(s.id);
          const isCurrent = idx === musicCurrentIndex;
          const alreadyInMine = isFriendView && user && musicMyOwnSongUrls.includes(s.url);
          return `<div class="breakdown-row" style="${isCurrent ? "background:rgba(242,184,75,0.15);" : ""} flex-direction:column; align-items:stretch; gap:4px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <button type="button" class="friend-name-btn" data-play-song="${idx}" style="text-align:left;">${isCurrent && musicIsPlaying ? PLAYER_ICONS.playingMini : PLAYER_ICONS.noteMini} ${s.title}</button>
              <span style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
                <button type="button" class="emoji-toggle-link" data-fav-song="${s.id}" style="font-size:1.1rem;">${isFav ? "❤️" : "🤍"}</button>
                ${isMine ? `<label class="emoji-toggle-link" style="font-size:1rem; cursor:pointer;" title="Eigenes Cover-Bild hochladen"><input type="file" accept="image/*" data-cover-upload="${s.id}" style="display:none;" />🖼️</label>` : ""}
                ${canManage ? (() => {
                  // Klar unterscheiden: ein SELBST hinzugefügter Song wird "gelöscht", ein von
                  // jemand anderem ÜBERNOMMENER Song wird "zurückgegeben" — die ursprünglich
                  // empfehlende Person behält dabei ihre Punkte, nur die eigene Übernahme wird
                  // rückgängig gemacht (verringert automatisch die Beliebtheits-Zählung, die live
                  // aus der Playlist-Datenbank gezählt wird).
                  const isTakenFromSomeoneElse = isMine && s.original_recommender_id && s.original_recommender_id !== user?.id;
                  const label = !isMine ? "aus Playlist entfernen" : isTakenFromSomeoneElse ? "↩️ zurückgeben" : "löschen";
                  const title = isTakenFromSomeoneElse ? "Aus deiner Liste entfernen — die ursprünglich empfehlende Person behält ihre Punkte, nur deine Übernahme wird rückgängig gemacht" : "";
                  return `<button type="button" class="emoji-toggle-link" data-delete-song="${s.id}" style="font-size:0.75rem;" title="${title}">${label}</button>`;
                })() : ""}
                ${isMine ? `<button type="button" class="emoji-toggle-link" data-set-showcase="${s.id}" data-showcase-title="${s.title}" data-showcase-url="${s.url}" title="Im Profil als Lieblingssong zeigen" style="font-size:1.1rem;">${(Backend.currentProfile()?.extraProfileData?.showcaseSongUrl === s.url) ? "🌟" : "☆"}</button>` : ""}
                ${isFriendView && user ? (alreadyInMine ? `<span class="empty-note" style="font-size:0.75rem;">✓ übernommen</span>` : `<button type="button" class="emoji-toggle-link" data-take-song="${s.id}" style="font-size:0.75rem;">+ übernehmen</button>`) : ""}
              </span>
            </div>
            ${s.recommended_by_name ? `<span class="empty-note" style="font-size:0.72rem;">💡 empfohlen von ${s.recommended_by_name}</span>` : ""}
          </div>`;
        }).join("") : `<p class="empty-note">${musicShowFavoritesOnly ? "Noch keine Favoriten markiert." : isMine ? "Noch keine eigenen Songs — füg oben welche hinzu!" : "Noch keine Songs in der Playlist."}</p>`}
      </div>
    `;
    renderMusicPlayerBar();
    document.getElementById("musicCommunityTab")?.addEventListener("click", async () => { musicPlaylistMode = "community"; await loadMusicPlaylist(); renderMusicSection(); });
    document.getElementById("musicUsersListToggle")?.addEventListener("click", async () => {
      const body = document.getElementById("musicUsersListBody");
      const opening = body.style.display === "none";
      body.style.display = opening ? "block" : "none";
      if (!opening) return;
      const users = await Backend.getUsersWithPlaylists();
      const others = users.filter((u) => !Backend.currentUser() || u.id !== Backend.currentUser().id);
      body.innerHTML = others.length ? `
        <div class="breakdown-list">
          ${others.map((u) => `<button type="button" class="breakdown-row friend-name-btn" data-open-user-playlist="${u.id}" data-open-user-name="${u.name}" style="width:100%; text-align:left; cursor:pointer;">${avatarPhotoHtml(u.avatar_url || "")}<span>🎵 ${u.name}s Playlist</span></button>`).join("")}
        </div>` : `<p class="empty-note">Noch niemand hat eine eigene Playlist angelegt.</p>`;
      body.querySelectorAll("[data-open-user-playlist]").forEach((btn) => {
        btn.addEventListener("click", () => viewFriendPlaylist(btn.dataset.openUserPlaylist, btn.dataset.openUserName));
      });
    });
    area.querySelectorAll(".player-tpl-pick").forEach((btn) => {
      btn.addEventListener("click", async () => {
        // WICHTIG: NICHT renderMusicSection() (kompletter Neuaufbau) nach einem reinen Layout-
        // Wechsel aufrufen — das ist für einen simplen visuellen Wechsel unnötig schwergewichtig
        // und riskiert genau die Art Nebenwirkung, die zuvor schon einmal einen laufenden Song
        // stören konnte. Nur die Template-Klasse anwenden und die aktive Markierung der Knöpfe
        // selbst aktualisieren reicht hier komplett aus.
        await setPlayerTemplate(btn.dataset.tpl);
        area.querySelectorAll(".player-tpl-pick").forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      });
    });
    wireInlineFeatureFlagToggles(area, renderMusicSection);
    document.getElementById("musicMineTab")?.addEventListener("click", async () => { musicPlaylistMode = "mine"; await loadMusicPlaylist(); renderMusicSection(); });
    document.getElementById("musicAddToggle")?.addEventListener("click", () => {
      const body = document.getElementById("musicAddFormBody");
      body.style.display = body.style.display === "none" ? "block" : "none";
    });
    document.getElementById("musicAddSubmitBtn")?.addEventListener("click", async () => {
      const title = document.getElementById("musicTitleInput").value;
      const url = document.getElementById("musicUrlInput").value;
      const errBox = document.getElementById("musicAddError");
      try {
        await Backend.addPlaylistSong(title, url, ownerIdForActions);
        await loadMusicPlaylist();
        renderMusicSection();
      } catch (err) {
        errBox.textContent = "⚠️ " + err.message;
        errBox.style.display = "block";
      }
    });
    document.getElementById("musicSuggestBtn")?.addEventListener("click", async () => {
      const missing = MUSIC_SUGGESTIONS.filter((s) => !musicPlaylist.some((p) => p.title === s.title));
      for (const s of missing) {
        try { await Backend.addPlaylistSong(s.title, s.url, ownerIdForActions); } catch (e) {}
      }
      await loadMusicPlaylist();
      renderMusicSection();
    });
    document.getElementById("musicTrashToggle")?.addEventListener("click", async (e) => {
      const body = document.getElementById("musicTrashBody");
      const opening = body.style.display === "none";
      body.style.display = opening ? "block" : "none";
      if (!opening) return;
      body.innerHTML = '<p class="empty-note">Lade…</p>';
      const hidden = await Backend.getHiddenPlaylistSongs();
      body.innerHTML = hidden.length ? hidden.map((s) => `
        <div class="breakdown-row"><span>🎵 ${s.title}</span><button type="button" class="emoji-toggle-link" data-restore-song="${s.id}" style="font-size:0.75rem;">↩️ wiederherstellen</button></div>
      `).join("") : '<p class="empty-note">Nichts entfernt — alles noch da!</p>';
      body.querySelectorAll("[data-restore-song]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          await Backend.restorePlaylistSong(btn.dataset.restoreSong);
          showToast("↩️ Song wiederhergestellt!");
          await loadMusicPlaylist();
          renderMusicSection();
        });
      });
    });
    document.getElementById("musicAllTab")?.addEventListener("click", () => { musicShowFavoritesOnly = false; renderMusicSection(); });
    document.getElementById("musicFavTab")?.addEventListener("click", () => { musicShowFavoritesOnly = true; renderMusicSection(); });
    area.querySelectorAll("[data-play-song]").forEach((btn) => {
      btn.addEventListener("click", () => playMusicIndex(Number(btn.dataset.playSong)));
    });
    area.querySelectorAll("[data-fav-song]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!user) { alert("Bitte zuerst anmelden, um Favoriten zu markieren."); return; }
        await Backend.toggleFavoriteSong(btn.dataset.favSong);
        musicFavIds = await Backend.getMyFavoriteSongIds();
        renderMusicSection();
      });
    });
    area.querySelectorAll("[data-cover-upload]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files[0];
        if (!file) return;
        try {
          const url = await Backend.uploadSongCover(file);
          await Backend.setSongCover(input.dataset.coverUpload, url);
          showToast("🖼️ Cover-Bild gespeichert!");
          renderMusicSection();
        } catch (e) { alert(e.message || "Upload fehlgeschlagen."); }
      });
    });
    area.querySelectorAll("[data-delete-song]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Diesen Song wirklich aus der Playlist entfernen?")) return;
        await Backend.deletePlaylistSong(btn.dataset.deleteSong, ownerIdForActions);
        await loadMusicPlaylist();
        renderMusicSection();
      });
    });
    area.querySelectorAll("[data-set-showcase]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const already = Backend.currentProfile()?.extraProfileData?.showcaseSongUrl === btn.dataset.showcaseUrl;
        await Backend.updateExtraProfileField("showcaseSongTitle", already ? "" : btn.dataset.showcaseTitle);
        await Backend.updateExtraProfileField("showcaseSongUrl", already ? "" : btn.dataset.showcaseUrl);
        showToast(already ? "Lieblingssong im Profil entfernt." : "🌟 Als Lieblingssong im Profil festgelegt!");
        renderMusicSection();
      });
    });
    area.querySelectorAll("[data-take-song]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const song = musicPlaylist.find((s) => s.id === btn.dataset.takeSong);
        if (!song || !user) return;
        try {
          await Backend.addPlaylistSong(song.title, song.url, user.id, musicViewingFriendName);
          await loadMusicPlaylist();
          renderMusicSection();
          showToast(`🎵 „${song.title}“ zu deiner Playlist hinzugefügt!`);
        } catch (err) {
          alert("⚠️ " + err.message);
        }
      });
    });
    // Freigabe-Schalter wird zentral von renderComingSoonGate() (ganz oben in dieser Funktion)
    // als Geschwister-Element vor dem Bereich eingefügt — kein separater Aufruf mehr nötig.
  }
  document.getElementById("musicAudioNative")?.addEventListener("ended", () => playNextMusic(true));
  document.querySelector('#knowledgeSubnav [data-sub="sub-music"]')?.addEventListener("click", async () => {
    await loadMusicPlaylist();
    renderMusicSection();
  });

  // Zehn persönliche, ein bisschen philosophische Interview-Fragen — bewusst KEINE einfachen
  // Likes/Dislikes, sondern Fragen mit echtem Nachdenkwert. Frei beantwortbar, keine Pflicht,
  // ab 150 Punkten freigeschaltet (fühlt sich früh genug erreichbar an).
  // Jede Frage hat eine Kategorie — daraus wird später NICHT der Textinhalt der Antworten
  // ausgewertet (das könnte ich nicht verlässlich), sondern das MUSTER, welche Art von Fragen
  // jemand überhaupt beantworten möchte. Wer viel aus "philosophisch" beantwortet, bekommt einen
  // anderen Profil-Titel als wer viel aus "abenteuer" oder "mindset" wählt.
  const INTERVIEW_QUESTIONS = [
    { id: "q1", cat: "mindset", text: "Was würdest du tun, wenn du wüsstest, dass du dabei nicht scheitern kannst?" },
    { id: "q2", cat: "persoenlich", text: "Welche Eigenschaft schätzt du an anderen Menschen am meisten?" },
    { id: "q3", cat: "abenteuer", text: "Wenn du eine Fähigkeit sofort meistern könntest — welche wäre das?" },
    { id: "q4", cat: "mindset", text: "Was war der beste Rat, den du je bekommen hast?" },
    { id: "q5", cat: "persoenlich", text: "Woran erkennst du, dass ein Tag richtig gut war?" },
    { id: "q6", cat: "philosophisch", text: "Was würdest du deinem jüngeren Ich gerne sagen?" },
    { id: "q7", cat: "philosophisch", text: "Welcher Moment hat deine Sicht auf das Leben verändert?" },
    { id: "q8", cat: "persoenlich", text: "Was bedeutet für dich echte Freundschaft?" },
    { id: "q9", cat: "abenteuer", text: "Welchen Ort auf der Welt müsstest du unbedingt noch sehen?" },
    { id: "q10", cat: "persoenlich", text: "Worauf bist du an dir selbst besonders stolz?" },
    { id: "q11", cat: "abenteuer", text: "Die Welt geht morgen unter — was machst du heute noch unbedingt?" },
    { id: "q12", cat: "abenteuer", text: "Du darfst nur drei Dinge auf eine einsame Insel mitnehmen — welche?" },
    { id: "q13", cat: "philosophisch", text: "Glaubst du, dass alles im Leben einen Grund hat? Warum (nicht)?" },
    { id: "q14", cat: "philosophisch", text: "Was macht ein Leben deiner Meinung nach lebenswert?" },
    { id: "q15", cat: "quer", text: "Welche weit verbreitete Meinung siehst du völlig anders als die meisten?" },
    { id: "q16", cat: "quer", text: "Was hältst du für eine Regel, die eigentlich keinen Sinn ergibt?" },
    { id: "q17", cat: "mindset", text: "Wie gehst du mit Rückschlägen um?" },
    { id: "q18", cat: "mindset", text: "Was motiviert dich, wenn es mal richtig schwerfällt?" },
    { id: "q19", cat: "kreativ", text: "Wenn du ein Buch schreiben würdest — worum würde es gehen?" },
    { id: "q20", cat: "kreativ", text: "Welches Tier würdest du für einen Tag sein wollen, und warum?" },
    { id: "q21", cat: "kreativ", text: "Erfinde ein neues Wort — was bedeutet es?" },
    { id: "q22", cat: "gesellschaft", text: "Was würdest du als Erstes ändern, wenn du für einen Tag die Welt verbessern könntest?" },
    { id: "q23", cat: "gesellschaft", text: "Was sollte in der Schule deiner Meinung nach mehr gelehrt werden?" },
    { id: "q24", cat: "persoenlich", text: "Was ist dein liebstes Kindheitserinnerung?" },
    { id: "q25", cat: "persoenlich", text: "Welche Musik hört dein Herz am liebsten?" },
    { id: "q26", cat: "abenteuer", text: "Zeitreise: in welche Epoche würdest du am liebsten kurz reisen?" },
    { id: "q27", cat: "abenteuer", text: "Superkraft für einen Tag — welche wählst du?" },
    { id: "q28", cat: "philosophisch", text: "Was bedeutet für dich Freiheit?" },
    { id: "q29", cat: "philosophisch", text: "Woran glaubst du, auch wenn du es nicht beweisen kannst?" },
    { id: "q30", cat: "mindset", text: "Was hast du kürzlich über dich selbst gelernt?" },
    { id: "q31", cat: "quer", text: "Welchen Trend verstehst du überhaupt nicht?" },
    { id: "q32", cat: "kreativ", text: "Wenn dein Leben ein Film wäre — welcher Titel würde passen?" },
    { id: "q33", cat: "persoenlich", text: "Was ist dein liebstes Ritual im Alltag?" },
    { id: "q34", cat: "gesellschaft", text: "Was schätzt du an deinem Herkunftsland/deiner Heimat am meisten?" },
    { id: "q35", cat: "mindset", text: "Wie sieht für dich ein perfekt ausgeglichenes Leben aus?" },
    { id: "q36", cat: "abenteuer", text: "Wenn Geld keine Rolle spielen würde — was würdest du morgen tun?" },
    { id: "q37", cat: "philosophisch", text: "Ist es besser, geliebt oder respektiert zu werden — und warum?" },
    { id: "q38", cat: "quer", text: "Was würdest du tun, wenn niemand dich beurteilen könnte?" },
    { id: "q39", cat: "kreativ", text: "Erfinde eine neue Feiertagstradition — was wird gefeiert und wie?" },
    { id: "q40", cat: "persoenlich", text: "Was ist deine liebste Art, einen freien Tag zu verbringen?" },
    { id: "q41", cat: "philosophisch", text: "Was bedeutet für dich echtes Glück?" },
    { id: "q42", cat: "philosophisch", text: "Kann man aus jedem Fehler etwas lernen — oder gibt es Ausnahmen?" },
    { id: "q43", cat: "philosophisch", text: "Was zählt für dich mehr: die Absicht oder das Ergebnis einer Handlung?" },
    { id: "q44", cat: "philosophisch", text: "Verändert sich der Mensch wirklich, oder bleibt der Kern immer gleich?" },
    { id: "q45", cat: "philosophisch", text: "Was würdest du als deine Lebensphilosophie in einem Satz beschreiben?" },
    { id: "q46", cat: "philosophisch", text: "Ist völlige Ehrlichkeit immer die beste Wahl?" },
    { id: "q47", cat: "abenteuer", text: "Welches Abenteuer bereust du, nie gewagt zu haben?" },
    { id: "q48", cat: "abenteuer", text: "Berge oder Meer — und warum genau das?" },
    { id: "q49", cat: "abenteuer", text: "Wenn du für ein Jahr in ein anderes Land ziehen müsstest — welches wäre es?" },
    { id: "q50", cat: "abenteuer", text: "Was ist das Mutigste, das du je gemacht hast?" },
    { id: "q51", cat: "abenteuer", text: "Ein One-Way-Ticket irgendwohin — wohin würde es dich ziehen?" },
    { id: "q52", cat: "abenteuer", text: "Welche verrückte Idee würdest du gerne mal ausprobieren?" },
    { id: "q53", cat: "mindset", text: "Was hilft dir, wenn du dich überfordert fühlst?" },
    { id: "q54", cat: "mindset", text: "Woran merkst du, dass du auf dem richtigen Weg bist?" },
    { id: "q55", cat: "mindset", text: "Was würdest du gerne schneller loslassen können?" },
    { id: "q56", cat: "mindset", text: "Wie definierst du für dich persönlich Erfolg?" },
    { id: "q57", cat: "mindset", text: "Was gibt dir an einem schlechten Tag wieder Energie?" },
    { id: "q58", cat: "quer", text: "Welchen Ratschlag hörst du oft, findest ihn aber falsch?" },
    { id: "q59", cat: "quer", text: "Was tust du anders als die meisten Leute in deinem Umfeld?" },
    { id: "q60", cat: "quer", text: "Welche Gewohnheit anderer verstehst du überhaupt nicht?" },
    { id: "q61", cat: "quer", text: "Wärst du lieber unauffällig richtig oder laut falsch?" },
    { id: "q62", cat: "quer", text: "Was ist eine unpopuläre Meinung, die du trotzdem vertrittst?" },
    { id: "q63", cat: "kreativ", text: "Wenn du einen Song schreiben würdest — welches Thema hätte er?" },
    { id: "q64", cat: "kreativ", text: "Erfinde ein Gericht — wie heißt es und was ist drin?" },
    { id: "q65", cat: "kreativ", text: "Wenn deine Woche eine Farbe wäre — welche, und warum?" },
    { id: "q66", cat: "kreativ", text: "Du entwirfst eine neue Insel — wie sieht sie aus?" },
    { id: "q67", cat: "kreativ", text: "Erfinde einen Beruf, den es noch nicht gibt." },
    { id: "q68", cat: "gesellschaft", text: "Was wünschst du dir für die nächste Generation?" },
    { id: "q69", cat: "gesellschaft", text: "Welche Erfindung hat die Welt am meisten verändert?" },
    { id: "q70", cat: "gesellschaft", text: "Was können Menschen aus unterschiedlichen Kulturen voneinander lernen?" },
    { id: "q71", cat: "gesellschaft", text: "Was macht deiner Meinung nach eine gute Gemeinschaft aus?" },
    { id: "q72", cat: "gesellschaft", text: "Welches gesellschaftliche Thema beschäftigt dich gerade am meisten?" },
    { id: "q73", cat: "persoenlich", text: "Was war ein Moment, in dem du wirklich stolz auf dich warst?" },
    { id: "q74", cat: "persoenlich", text: "Wer hat dich am meisten geprägt, und wie?" },
    { id: "q75", cat: "persoenlich", text: "Was schätzt du an dir selbst, das andere vielleicht nicht sofort sehen?" },
    { id: "q76", cat: "persoenlich", text: "Welche Kleinigkeit macht dich zuverlässig glücklich?" },
    { id: "q77", cat: "persoenlich", text: "Was würdest du gerne öfter tun, wenn du mehr Zeit hättest?" },
    { id: "q78", cat: "persoenlich", text: "Welches Talent hast du, das die wenigsten kennen?" },
    { id: "q79", cat: "persoenlich", text: "Was macht für dich ein gutes Gespräch aus?" },
    { id: "q80", cat: "persoenlich", text: "Wenn du einen Tag noch einmal erleben könntest — welchen?" },
  ];
  // Kategorie -> Profil-Titel, sobald sie den größten Anteil der beantworteten Fragen ausmacht.
  const INTERVIEW_TYPE_LABELS = {
    philosophisch: { emoji: "🧘", label: "Philosoph:in" },
    abenteuer: { emoji: "🧭", label: "Survivor" },
    mindset: { emoji: "🌱", label: "Mindset-Fokussierte:r" },
    quer: { emoji: "🔀", label: "Querdenker:in" },
    kreativ: { emoji: "🎨", label: "Kreativkopf" },
    gesellschaft: { emoji: "🌍", label: "Weltverbesserer:in" },
    persoenlich: { emoji: "💬", label: "Offene:r Erzähler:in" },
  };
  // Bestimmt den Interview-Typ NICHT aus dem Textinhalt der Antworten (das ließe sich nicht
  // verlässlich auswerten), sondern aus dem MUSTER, welche Kategorien von Fragen überhaupt
  // beantwortet wurden — wer z. B. mehrheitlich "philosophisch" wählt, gilt als Philosoph:in.
  function computeInterviewType(answers) {
    const answeredIds = Object.keys(answers || {}).filter((id) => answers[id] && answers[id].trim());
    if (answeredIds.length < 2) return null; // zu wenig Datengrundlage für eine faire Einordnung
    const counts = {};
    answeredIds.forEach((id) => {
      const q = INTERVIEW_QUESTIONS.find((x) => x.id === id);
      if (q) counts[q.cat] = (counts[q.cat] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) return null;
    const [topCat, topCount] = sorted[0];
    const percent = Math.round((topCount / answeredIds.length) * 100);
    return { ...INTERVIEW_TYPE_LABELS[topCat], percent, category: topCat };
  }
  // Kompakte Vorschau des Sticker-Albums — direkt in der Hauptprofilansicht sichtbar, ohne dass
  // man extra in den eigenen Reiter wechseln muss. Zeigt nur die ersten paar Sticker, mit Knopf
  // zum vollständigen Album für alle weiteren.
  document.body.addEventListener("click", (e) => {
    if (e.target.closest("#openFullAlbumBtn")) {
      document.querySelector('#profileSubnav [data-sub="sub-album"]')?.click();
    }
    if (e.target.closest("#openFullInterviewBtn")) {
      document.querySelector('#profileSubnav [data-sub="sub-interview"]')?.click();
    }
  });
  function renderAlbumPreview(profile) {
    const unlockedCount = COLLECTIBLE_FIGURES.filter((f) => isFigureUnlocked(f, profile)).length;
    const previewFigs = COLLECTIBLE_FIGURES.slice(0, 6);
    return `<div class="breakdown-list" style="margin-top:16px;">
      <p class="eyebrow" style="margin-top:0;">📔 Sticker-Album <span class="empty-note" style="font-weight:400;">(${unlockedCount}/${COLLECTIBLE_FIGURES.length})</span></p>
      <div class="figure-case" style="margin-bottom:8px;">
        ${previewFigs.map((fig) => figureTileHtml(fig, profile)).join("")}
      </div>
      <button type="button" class="btn btn-ghost" id="openFullAlbumBtn">📔 Ganzes Album ansehen</button>
    </div>`;
  }
  let albumChapterIdx = 0;
  let albumPageIdx = 0;
  let albumOnCoverPage = true; // jedes Kapitel startet mit einem eigenen Deckblatt, wie bei einem echten Buch
  const ALBUM_PER_PAGE = 12;
  function renderAlbum() {
    const area = document.getElementById("albumArea");
    if (!area) return;
    const profile = Backend.currentProfile();
    const activeChapters = COLLECTIBLE_CHAPTERS.filter((c) => c.active);
    const chapter = activeChapters[albumChapterIdx];
    // Deckblatt: eigene Titelseite pro Kapitel, wie bei einem echten Buch — erst ein Tipp
    // darauf öffnet die eigentlichen Sticker-Seiten. Wichtig für später, sobald mehrere
    // Sammelserien (z. B. eine Kroko-Serie) als eigene Kapitel dazukommen.
    // Persistente Überschriften-Zeile — sieht auf Cover UND aufgeschlagenen Seiten IDENTISCH aus
    // (Titel mittig, Kapitel-Knöpfe links/rechts davon), damit der Übergang zwischen beiden
    // keinen Bildsprung erzeugt. Auf dem Cover sind die Kapitel-Knöpfe nur unsichtbar (nicht
    // entfernt!), damit der reservierte Platz gleich bleibt — erst auf den aufgeschlagenen Seiten
    // werden sie sichtbar/aktiv.
    const totalUnlockedInChapter = chapter.figures.filter((f) => profile && isFigureUnlocked(f, profile)).length;
    const headerRow = `
      <div class="quiz-actions album-header-row" style="justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:nowrap; gap:4px;">
        <button type="button" class="btn btn-ghost" id="albumPrevChapter" aria-label="Vorheriges Kapitel" style="flex-shrink:0; padding:8px 10px; ${albumOnCoverPage ? "visibility:hidden;" : ""}" ${albumChapterIdx === 0 || activeChapters.length <= 1 ? "disabled" : ""}>⏮</button>
        <h3 style="margin:0; text-align:center; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">${chapter.emoji} ${chapter.title} <span class="empty-note" style="font-weight:400; font-size:0.8rem;">(${totalUnlockedInChapter}/${chapter.figures.length})</span></h3>
        <button type="button" class="btn btn-ghost" id="albumNextChapter" aria-label="Nächstes Kapitel" style="flex-shrink:0; padding:8px 10px; ${albumOnCoverPage ? "visibility:hidden;" : ""}" ${albumChapterIdx >= activeChapters.length - 1 || activeChapters.length <= 1 ? "disabled" : ""}>⏭</button>
      </div>`;
    if (albumOnCoverPage) {
      area.innerHTML = `
        ${headerRow}
        <div class="album-book">
          <button type="button" class="album-page-face album-cover-face" id="albumCoverFace" style="background:linear-gradient(160deg, var(--coral-400), var(--amber-400)); border-radius:14px; box-shadow:0 8px 24px rgba(0,0,0,0.25); padding:30px 18px; text-align:center; width:100%; border:none; cursor:pointer; aspect-ratio:1; box-sizing:border-box;">
            <p style="font-size:3.2rem; margin:0 0 8px;">${chapter.emoji}</p>
            <p class="empty-note" style="color:rgba(255,255,255,0.7); margin-top:14px;">📖 Antippen zum Aufschlagen</p>
          </button>
        </div>
      `;
      document.getElementById("albumCoverFace")?.addEventListener("click", () => { albumOnCoverPage = false; albumPageIdx = 0; renderAlbum(); });
      document.getElementById("albumPrevChapter")?.addEventListener("click", () => { albumChapterIdx = Math.max(0, albumChapterIdx - 1); albumOnCoverPage = true; renderAlbum(); });
      document.getElementById("albumNextChapter")?.addEventListener("click", () => { albumChapterIdx = Math.min(activeChapters.length - 1, albumChapterIdx + 1); albumOnCoverPage = true; renderAlbum(); });
      return;
    }
    const totalPages = Math.ceil(chapter.figures.length / ALBUM_PER_PAGE);
    albumPageIdx = Math.min(albumPageIdx, totalPages - 1);
    const totalUnlocked = chapter.figures.filter((f) => profile && isFigureUnlocked(f, profile)).length;
    const pageFigures = chapter.figures.slice(albumPageIdx * ALBUM_PER_PAGE, albumPageIdx * ALBUM_PER_PAGE + ALBUM_PER_PAGE);
    // Wie ein echtes, AUFGESCHLAGENES Buch: die Sticker dieses Blatts auf eine linke und eine
    // rechte Seite aufgeteilt, statt als einzelne, zentrierte Fläche — mit einer sichtbaren
    // "Buchrücken"-Trennlinie und leichtem Schatten in der Mitte dazwischen.
    const half = Math.ceil(ALBUM_PER_PAGE / 2);
    const leftFigures = pageFigures.slice(0, half);
    const rightFigures = pageFigures.slice(half);
    const renderSlot = (fig) => {
      const unlocked = profile && isFigureUnlocked(fig, profile);
      // Freigeschaltete Figuren jetzt antippbar — zeigt Details zu genau diesem Fuchs (wie schon
      // an anderen Stellen der Seite über openFigureDetailModal). Gesperrte bleiben absichtlich
      // nicht anklickbar, um nichts vorab zu verraten.
      const tag = unlocked ? "button" : "div";
      const extraAttrs = unlocked ? `type="button" data-figure-detail="${fig.id}" style="cursor:pointer; border:none; background:none;"` : "";
      return `<${tag} class="album-slot" ${extraAttrs} style="aspect-ratio:1; background:rgba(0,0,0,0.04); border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; padding:6px; transform:rotate(${(fig.id.length % 5) - 2}deg);" title="${unlocked ? fig.name : "Noch gesperrt"}">
        ${unlocked ? `<img src="${fig.img}" alt="${fig.name}" style="width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 2px 3px rgba(0,0,0,0.25));" />` : `<span style="font-size:1.4rem; opacity:0.3;">🔒</span>`}
      </${tag}>`;
    };
    const renderEmptySlots = (figures) => Array.from({ length: half - figures.length }).map(() => `<div></div>`).join("");
    // WICHTIG — behebt den gemeldeten Bug: bisher gab es hinter der sich drehenden rechten Seite
    // KEINE zweite Ebene — während der 380ms-Drehanimation war der Bereich dahinter kurz leer,
    // bevor renderAlbum() danach den neuen Inhalt einsetzte. Statt der leeren Fläche liegt jetzt
    // schon die tatsächlich kommende Seite (die nächsten Figuren) sichtbar dahinter, wie bei einem
    // echten Buch, bei dem man beim Umblättern schon die nächste Seite durchscheinen sieht.
    const nextPageFigures = chapter.figures.slice((albumPageIdx + 1) * ALBUM_PER_PAGE, (albumPageIdx + 1) * ALBUM_PER_PAGE + ALBUM_PER_PAGE);
    const nextLeftFigures = nextPageFigures.slice(0, half);
    area.innerHTML = `
      ${headerRow}
      <div class="album-book album-book-open" id="albumPageFace" style="aspect-ratio:1;">
        <div class="album-page-face album-page-left" id="albumPageLeftClick" style="cursor:pointer;" title="Zurückblättern">
          <div class="album-page-grid">
            ${leftFigures.map(renderSlot).join("")}
            ${renderEmptySlots(leftFigures)}
          </div>
        </div>
        <div class="album-spine" aria-hidden="true"></div>
        <div class="album-page-right-wrap">
          <div class="album-page-face album-page-right-behind">
            <div class="album-page-grid">
              ${nextLeftFigures.map(renderSlot).join("")}
              ${renderEmptySlots(nextLeftFigures)}
            </div>
          </div>
          <div class="album-page-face album-page-right" id="albumPageRightClick" style="cursor:${albumPageIdx < totalPages - 1 ? "pointer" : "default"};" title="Weiterblättern">
            <div class="album-page-grid">
              ${rightFigures.map(renderSlot).join("")}
              ${renderEmptySlots(rightFigures)}
            </div>
          </div>
        </div>
      </div>
      <div class="quiz-actions" style="justify-content:center; margin-top:12px; gap:16px; align-items:center;">
        <button type="button" class="btn btn-ghost" id="albumPrevPage" ${albumPageIdx === 0 ? "disabled" : ""}>◀ Seite zurück</button>
        <span class="empty-note">Seite ${albumPageIdx + 1} / ${totalPages}</span>
        <button type="button" class="btn btn-ghost" id="albumNextPage" ${albumPageIdx >= totalPages - 1 ? "disabled" : ""}>Seite weiter ▶</button>
      </div>
      <!-- Erklärung bewusst UNTER dem Buch statt darüber — sie soll nicht mehr das ganze Album
           nach unten schieben, sobald man das Deckblatt öffnet. Die Kapitel-Überschrift darf
           dagegen oben bleiben, das war ausdrücklich in Ordnung. -->
      <p class="empty-note" style="margin-top:14px;">Dein Sticker-Album — die Füchse sind erst der Anfang. Künftige Sammelserien (z. B. zu bestimmten Jahreszeiten) bekommen hier später ihr eigenes Kapitel, ohne dass du deine bisherigen Füchse verlierst.</p>
      ${activeChapters.length <= 1 ? `<div class="question-card" style="margin-top:16px; text-align:center; opacity:0.6;"><p class="empty-note">📔 Weitere Kapitel folgen, sobald neue Sammelserien starten!</p></div>` : ""}
    `;
    document.getElementById("albumPrevChapter")?.addEventListener("click", () => { albumChapterIdx = Math.max(0, albumChapterIdx - 1); albumPageIdx = 0; renderAlbum(); });
    document.getElementById("albumNextChapter")?.addEventListener("click", () => { albumChapterIdx = Math.min(activeChapters.length - 1, albumChapterIdx + 1); albumPageIdx = 0; renderAlbum(); });
    document.getElementById("albumPrevPage")?.addEventListener("click", () => turnAlbumPage(-1));
    document.getElementById("albumNextPage")?.addEventListener("click", () => turnAlbumPage(1));
    // Seiten selbst antippbar zum Blättern (links = zurück, rechts = weiter), wie bei einem
    // echten Buch — nicht nur über die separaten Knöpfe darunter. Ein Klick auf eine einzelne
    // Sammelfigur (die ihre eigene Detailansicht öffnet) löst das Blättern dabei NICHT zusätzlich
    // aus, sonst würde sich beides gegenseitig stören.
    document.getElementById("albumPageLeftClick")?.addEventListener("click", (e) => {
      if (e.target.closest("[data-figure-detail]")) return;
      turnAlbumPage(-1);
    });
    document.getElementById("albumPageRightClick")?.addEventListener("click", (e) => {
      if (e.target.closest("[data-figure-detail]")) return;
      if (albumPageIdx < totalPages - 1) turnAlbumPage(1);
    });
    area.querySelectorAll("[data-figure-detail]").forEach((el) => {
      el.addEventListener("click", () => openFigureDetailModal(el.dataset.figureDetail));
    });
  }
  function turnAlbumPage(direction) {
    // Von der allerersten Seite aus nach LINKS blättern führt zurück zum Deckblatt, genau wie bei
    // einem echten Buch — vorher stand hier nur ein deaktivierter Knopf, ohne dass man tatsächlich
    // zum Cover zurückkommen konnte.
    if (direction < 0 && albumPageIdx === 0) {
      albumOnCoverPage = true;
      renderAlbum();
      return;
    }
    // WICHTIG: die Dreh-Animation liegt jetzt NUR auf der rechten Seite (siehe CSS
    // .album-page-right.turning-next) — sie dreht sich um ihre linke Kante, die genau am
    // Buchrücken (der Mitte) liegt, statt dass (wie vorher) das gesamte Buch um seinen äußeren
    // linken Rand kippt.
    const rightPage = document.getElementById("albumPageRightClick");
    if (!rightPage) { albumPageIdx += direction; renderAlbum(); return; }
    rightPage.classList.add("turning-next");
    setTimeout(() => {
      albumPageIdx += direction;
      renderAlbum();
    }, 380); // auf halbem Weg der Drehung (wenn die Seite von der Kante aus gesehen wird) den Inhalt wechseln
  }
  document.querySelector('#profileSubnav [data-sub="sub-album"]')?.addEventListener("click", () => { albumPageIdx = 0; albumOnCoverPage = true; renderAlbum(); });

  // Kompakte Interview-Vorschau direkt im Profil — zeigt die ersten beantworteten Fragen (oder
  // eine Einladung, welche zu beantworten), mit Knopf zum vollständigen Bereich.
  function renderInterviewPreview(profile, isOwnProfile = true) {
    const answers = (profile.extraProfileData && profile.extraProfileData.interviewAnswers) || {};
    const answered = INTERVIEW_QUESTIONS.filter((q) => answers[q.id] && answers[q.id].trim());
    const unlocked = profile.points >= 150;
    // WICHTIG — die 150-Punkte-Freischaltung bleibt bewusst bestehen (Teil des Spielsystems,
    // korreliert mit den Sammelfiguren-Aufgaben). Der eigentliche gemeldete Bug war nicht die
    // Sperre selbst, sondern dass der GESAMTE Bereich bei fehlender Freischaltung komplett
    // verschwand (return "") — das Interview war dadurch unauffindbar, man wusste nicht mal, dass
    // es existiert. Jetzt bleibt es sichtbar, mit klarem Hinweis, was zum Freischalten fehlt.
    if (!unlocked) {
      return `<div class="breakdown-list" style="margin-top:16px;">
        <p class="eyebrow" style="margin-top:0;">🎤 Interview</p>
        <p class="empty-note">🔒 Ab 150 Punkten kannst du hier ausführlichere Fragen zum Kennenlernen beantworten — noch ${150 - profile.points} Punkte.</p>
      </div>`;
    }
    const type = computeInterviewType(answers);
    return `<div class="breakdown-list" style="margin-top:16px;">
      <p class="eyebrow" style="margin-top:0;">🎤 Interview <span class="empty-note" style="font-weight:400;">(${answered.length}/${INTERVIEW_QUESTIONS.length} beantwortet)</span></p>
      ${type ? `<div class="trophy-chip" style="margin-bottom:8px;"><span class="emoji">${type.emoji}</span><span>${type.label} <span class="empty-note">(${type.percent}% deiner Antworten)</span></span></div>` : ""}
      ${answered.length ? answered.slice(0, 2).map((q) => `
        <div class="question-card" style="margin-bottom:8px;">
          <p style="font-weight:700; font-size:0.86rem; margin-bottom:4px;">${q.text}</p>
          <p class="empty-note" style="font-size:0.84rem;">${answers[q.id].slice(0, 120)}${answers[q.id].length > 120 ? "…" : ""}</p>
        </div>`).join("") : `<p class="empty-note">${isOwnProfile ? "Noch keine Antworten — zeig etwas mehr von dir!" : "Noch keine Antworten hinterlegt."}</p>`}
      ${isOwnProfile ? `<button type="button" class="btn btn-ghost" id="openFullInterviewBtn">🎤 ${answered.length ? "Interview bearbeiten" : "Jetzt beantworten"}</button>` : ""}
    </div>`;
  }
  async function renderInterview() {
    const area = document.getElementById("interviewArea");
    if (!area) return;
    const profile = Backend.currentProfile();
    if (!profile) { area.innerHTML = '<p class="empty-note">Bitte zuerst anmelden.</p>'; return; }
    const answers = (profile.extraProfileData && profile.extraProfileData.interviewAnswers) || {};
    const unlocked = profile.points >= 150;
    area.innerHTML = `
      <p class="empty-note" style="margin-bottom:14px;">Kein einfaches Likes/Dislikes — sondern ein paar Fragen mit echtem Nachdenkwert. Alles freiwillig, du musst nicht jede Frage beantworten. Deine Antworten sind auf deinem Profil für andere sichtbar.</p>
      ${!unlocked ? `<p class="empty-note">🔒 Ab 150 Punkten kannst du hier deine Antworten eintragen — noch ${150 - profile.points} Punkte, spiel einfach weiter!</p>` : `
        ${Object.entries(INTERVIEW_TYPE_LABELS).map(([catKey, catInfo]) => {
          const questionsInCat = INTERVIEW_QUESTIONS.filter((q) => q.cat === catKey);
          if (!questionsInCat.length) return "";
          return `
            <p class="eyebrow" style="margin-top:18px;">${catInfo.emoji} ${catInfo.label.replace(/:in|:r/gi, "")}</p>
            <div class="breakdown-list">
              ${questionsInCat.map((q) => `
                <div class="question-card" style="margin-bottom:10px;">
                  <p style="font-weight:700; margin-bottom:8px;">${q.text}</p>
                  <textarea class="guestbook-form-textarea" data-interview-q="${q.id}" maxlength="300" placeholder="Deine Antwort (optional)…">${answers[q.id] || ""}</textarea>
                </div>`).join("")}
            </div>`;
        }).join("")}
        <button type="button" class="btn btn-coffee" id="interviewSaveBtn" style="margin-top:10px;">Antworten speichern</button>
        <p class="empty-note" id="interviewSavedNote" style="display:none; margin-top:8px;">✅ Gespeichert!</p>
      `}
    `;
    document.getElementById("interviewSaveBtn")?.addEventListener("click", async () => {
      const updated = {};
      area.querySelectorAll("[data-interview-q]").forEach((ta) => { updated[ta.dataset.interviewQ] = ta.value; });
      const note = document.getElementById("interviewSavedNote");
      // WICHTIG: das Ergebnis TATSÄCHLICH prüfen — vorher wurde bei einem fehlgeschlagenen
      // Speichervorgang (z. B. Netzwerkfehler) trotzdem "✅ Gespeichert!" angezeigt, obwohl die
      // Antworten in Wahrheit gar nicht in der Datenbank ankamen und beim nächsten Laden wieder
      // weg waren.
      const result = await Backend.updateExtraProfileField("interviewAnswers", updated);
      if (result && result.ok === false) {
        note.textContent = "⚠️ " + (result.message || "Konnte nicht gespeichert werden.");
        note.style.display = "block";
        return;
      }
      note.textContent = "✅ Gespeichert!";
      note.style.display = "block";
      setTimeout(() => { note.style.display = "none"; }, 2500);
    });
  }
  document.querySelector('#profileSubnav [data-sub="sub-interview"]')?.addEventListener("click", renderInterview);

  const MISSIONS_PLACEHOLDER_SVG = `<svg class="site-banner-svg" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="missionsGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e8825f"/><stop offset="100%" stop-color="#f2b84b"/>
    </linearGradient></defs>
    <rect width="400" height="120" fill="url(#missionsGrad)"/>
    <circle cx="60" cy="30" r="20" fill="rgba(255,255,255,0.12)"/>
    <circle cx="330" cy="85" r="26" fill="rgba(255,255,255,0.1)"/>
    <text x="200" y="55" text-anchor="middle" font-size="30" font-family="sans-serif">🦊</text>
    <text x="200" y="90" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="sans-serif">Missionen &amp; Füchse</text>
  </svg>`;
  async function renderMissions() {
    const area = document.getElementById("missionsArea");
    if (!area) return;
    const profile = Backend.currentProfile();
    const missionsBannerUrl = await Backend.getEffectiveBannerUrl("missions_banner");
    area.innerHTML = `
      <div style="margin:-4px -4px 14px; border-radius:var(--radius-md); overflow:hidden;">${siteBannerHtml("missions_banner", missionsBannerUrl, MISSIONS_PLACEHOLDER_SVG, "Missionen")}</div>
      <p class="empty-note" style="margin-bottom:14px;">Hier geht's nicht ums bloße Punktesammeln — sondern darum, fleißig in den Übungskategorien zu spielen und dir dadurch nach und nach Fuchs-Figuren zu verdienen. Jeder Fuchs steht für einen Meilenstein auf deinem Weg. Aktuell ist der Gesamtpunktestand (den du dir durchs Üben erspielst) der Maßstab dafür, gestaffelt nach Schwierigkeit — von "schnell erreichbar" bis "richtig selten". Du kannst dabei jedes Spiel in jedem Schwierigkeitsgrad frei wählen, das schränkt dich nicht ein.</p>

      <div class="material-card">
        <h3>🎖️ Wie funktionieren Orden und Pokale eigentlich?</h3>
        <p>Zwei Dinge zusammen bestimmen deinen Titel nach einer Runde: <strong>Welche Kategorien du gespielt hast</strong> bestimmt deinen "Charakter" — spielst du z. B. viel wenn/ob/als-wie/kennen-wissen, giltst du als <strong>🧠 Logiker</strong>; viel Deutschland-Quiz macht dich zum <strong>🔬 Wissenschaftler</strong>; Redewendungen & Synonyme zum <strong>💬 Sprachkünstler</strong>; Artikel/Plural/Fehler zum <strong>✍️ Grammatik-Profi</strong>; eine bunte Mischung macht dich zum <strong>🧭 Abenteurer</strong>; und wer wirklich alle 10 Kategorien spielt, wird zum <strong>🌟 Tausendsassa</strong>. <strong>Wie gut du dabei abschneidest</strong> (deine Trefferquote) bestimmt zusätzlich deine Stufe — von Deutsch-Anfänger über Fortgeschrittener und Lehrmeister bis hin zu Deutsch-Profi und ganz oben Deutsch-Superheld. Charakter + Stufe zusammen ergeben deinen Titel, z. B. "Grammatik-Profi – Superheld". Die beiden höchsten Stufen (Profi und Superheld) zählen als <strong>🏆 Pokal</strong>, alles darunter als <strong>🎖️ Orden</strong>.</p>
      </div>

      <div class="breakdown-list">
        ${COLLECTIBLE_FIGURES.map((fig) => {
          const unlocked = profile ? isFigureUnlocked(fig, profile) : false;
          return `<button type="button" class="breakdown-row mission-fox-row" data-mission-fox="${fig.id}" style="align-items:center; width:100%; text-align:left; cursor:pointer; background:none; border:none; font:inherit; color:inherit;">
            <span style="display:flex; align-items:center; gap:10px;">
              <img src="${fig.img}" alt="${fig.name}" style="width:36px; height:36px; object-fit:contain; flex-shrink:0; ${unlocked ? "" : "filter:grayscale(1) brightness(0) invert(0.65); opacity:0.6;"}" />
              <span>
                <strong>${fig.name}</strong><br>
                <span class="empty-note" style="font-size:0.76rem;">${fig.desc}</span>
              </span>
            </span>
            <span class="empty-note" style="font-size:0.78rem; text-align:right; flex-shrink:0; max-width:110px;">${unlocked ? "✅ Erspielt" : unlockShortText(fig.unlock)}</span>
          </button>`;
        }).join("")}
      </div>
      <p class="empty-note" style="margin-top:10px; font-size:0.76rem;">💡 Auf einen Fuchs tippen zeigt genau, wie viel dir noch fehlt.</p>
      <p class="empty-note" style="margin-top:14px; font-size:0.78rem;">🔮 Zukunftsmusik: mit der Zeit sollen weitere, abwechslungsreichere Wege dazukommen, Füchse zu verdienen — nicht nur über Punkte, sondern über konkrete kleine Herausforderungen (z. B. mehrere Spiele an einem Tag, hohe Schwierigkeitsgrade meistern, oder gezielt viel in einer bestimmten Kategorie spielen). Geplant ist auch ein System, das dein Spielverhalten erkennt — spielst du z. B. viel Deutschland-Quiz, giltst du eher als "Wissenschaftler"; spielst du alles quer durch, eher als "Tausendsassa". Solche Spielertypen sollen dann auch die passenden Füchse anziehen. Und vielleicht wechseln die verfügbaren Füchse irgendwann sogar saisonal (z. B. weihnachtliche Figuren) — mit einem eigenen Sammelalbum für alles, was du dir im Laufe der Zeit schon verdient hast.</p>
    `;
    area.querySelectorAll("[data-mission-fox]").forEach((btn) => {
      btn.addEventListener("click", () => showMissionFoxDetail(btn.dataset.missionFox, profile));
    });
    wireSiteBannerUploads(area);
  }
  // Persönliche Erklärung beim Antippen eines Fuchses in der Missions-Übersicht: zeigt genau, wie
  // viele Punkte noch fehlen (nicht nur die pauschale Schwelle) — und beim Kleinen Lernfuchs auch
  // den alternativen Weg über 5 Orden.
  function showMissionFoxDetail(figId, profile) {
    const fig = COLLECTIBLE_FIGURES.find((f) => f.id === figId);
    if (!fig) return;
    const unlocked = profile ? isFigureUnlocked(fig, profile) : false;
    let bodyHtml;
    if (unlocked) {
      bodyHtml = `<p class="empty-note">✅ Diesen Fuchs hast du dir schon verdient — er wartet in deinem Sticker-Album auf dich!</p>`;
    } else if (fig.unlock.type === "points") {
      const have = (profile && profile.points) || 0;
      const missing = Math.max(0, fig.unlock.value - have);
      const altPath = fig.id === "kleiner-lernfuchs" ? `<p class="empty-note" style="margin-top:8px;">Alternativ bekommst du ihn auch automatisch geschenkt, sobald du 5 Orden gesammelt hast — unabhängig vom Punktestand.</p>` : "";
      bodyHtml = `
        <p>Du brauchst insgesamt <strong>${fig.unlock.value} Punkte</strong>, um diesen Fuchs freizuschalten.</p>
        <p style="margin-top:8px;">Du hast aktuell <strong>${have} Punkte</strong> — noch <strong>${missing} Punkte</strong> bis dahin!</p>
        <p class="empty-note" style="margin-top:8px;">Punkte sammelst du beim Spielen — egal welches Spiel oder welcher Schwierigkeitsgrad, alles zählt.</p>
        ${altPath}`;
    } else if (fig.unlock.type === "character_points") {
      const have = ((profile && profile.history) || []).filter((h) => h.character === fig.unlock.character)
        .reduce((s, h) => s + Math.round((h.points || 0) + (h.bonus || 0)), 0);
      const missing = Math.max(0, fig.unlock.value - have);
      bodyHtml = `
        <p>Dieser Fuchs will speziell mit <strong>„${fig.unlock.character}"-Aufgaben</strong> verdient werden — Punkte aus anderen Bereichen zählen hier nicht mit.</p>
        <p style="margin-top:8px;">Du hast bisher <strong>${have} von ${fig.unlock.value} Punkten</strong> in diesem Bereich — noch <strong>${missing} Punkte</strong>!</p>
        <p class="empty-note" style="margin-top:8px;">Schau in „Übungen" nach Kategorien, die zu diesem Thema passen.</p>`;
    } else if (fig.unlock.type === "profile_field") {
      const fieldLabels = { languages: "Sprachen, die du sprichst", poem: "dein eigenes Zitat oder Gedicht", bio: "eine kurze Selbstbeschreibung", gallery: "ein eigenes Foto" };
      bodyHtml = `
        <p>Dieser Fuchs wartet darauf, dass du <strong>${fieldLabels[fig.unlock.field] || "dieses Profil-Feld"}</strong> in deinem Profil einträgst.</p>
        <p class="empty-note" style="margin-top:8px;">Zu finden unter Profil & Rang → Profil bearbeiten.</p>`;
    } else if (fig.unlock.type === "categories_tried") {
      const distinct = new Set();
      ((profile && profile.history) || []).forEach((h) => (h.categories || []).forEach((c) => distinct.add(c)));
      const missing = Math.max(0, fig.unlock.value - distinct.size);
      bodyHtml = `
        <p>Dieser Fuchs ist ein echter Entdecker — er will, dass du <strong>${fig.unlock.value} verschiedene Übungsarten</strong> ausprobierst, nicht nur eine.</p>
        <p style="margin-top:8px;">Du hast bisher <strong>${distinct.size} verschiedene</strong> ausprobiert — noch <strong>${missing}</strong>!</p>`;
    } else if (fig.unlock.type === "login_streak") {
      const streak = (profile && profile.extraProfileData && profile.extraProfileData.calendarStreak) || 0;
      const missing = Math.max(0, fig.unlock.value - streak);
      bodyHtml = `
        <p>Dieser Fuchs mag Regelmäßigkeit — reiß dein Kalenderblatt <strong>${fig.unlock.value} Tage am Stück</strong> ab, um ihn zu bekommen.</p>
        <p style="margin-top:8px;">Deine aktuelle Serie: <strong>${streak} Tage</strong> — noch <strong>${missing}</strong>!</p>`;
    } else if (fig.unlock.type === "trophy_count") {
      const have = (profile && profile.trophies || []).length;
      const missing = Math.max(0, fig.unlock.value - have);
      bodyHtml = `
        <p>Dieser Fuchs feiert deine gesammelten <strong>Trophäen</strong> (Orden + Pokale zusammen) — du brauchst insgesamt <strong>${fig.unlock.value}</strong>.</p>
        <p style="margin-top:8px;">Du hast bisher <strong>${have}</strong> — noch <strong>${missing}</strong>!</p>`;
    } else if (fig.unlock.type === "games_played") {
      const have = (profile && profile.history || []).length;
      const missing = Math.max(0, fig.unlock.value - have);
      bodyHtml = `
        <p>Dieser Fuchs belohnt Fleiß über viele Runden hinweg — spiele insgesamt <strong>${fig.unlock.value} Runden</strong> (egal welches Spiel).</p>
        <p style="margin-top:8px;">Du hast bisher <strong>${have}</strong> gespielt — noch <strong>${missing}</strong>!</p>`;
    } else if (fig.unlock.type === "songs_added") {
      const have = (profile && profile.extraProfileData && profile.extraProfileData.songsAddedCount) || 0;
      bodyHtml = have >= fig.unlock.value
        ? `<p>Du hast schon einen Song beigesteuert!</p>`
        : `<p>Dieser Fuchs liebt Musik — füg mindestens einen eigenen Song zu deiner Playlist hinzu (Wissen → Musik → Meine Playlist).</p>`;
    } else if (fig.unlock.type === "category_points") {
      const cats = Array.isArray(fig.unlock.categories) ? fig.unlock.categories : [fig.unlock.categories];
      const have = ((profile && profile.history) || []).filter((h) => (h.categories || []).some((c) => cats.includes(c)))
        .reduce((s, h) => s + Math.round((h.points || 0) + (h.bonus || 0)), 0);
      const missing = Math.max(0, fig.unlock.value - have);
      bodyHtml = `
        <p>Dieser Fuchs will speziell mit diesem Spiel verdient werden — Punkte aus anderen Spielen zählen hier nicht mit.</p>
        <p style="margin-top:8px;">Du hast bisher <strong>${have} von ${fig.unlock.value} Punkten</strong> dort — noch <strong>${missing}</strong>!</p>`;
    } else if (fig.unlock.type === "combo") {
      // Kombinations-Mission: jede Teilbedingung einzeln mit ihrem eigenen Status auflisten, statt
      // nur einer pauschalen Ja/Nein-Antwort — so sieht man genau, was noch fehlt und was schon
      // erledigt ist.
      bodyHtml = `
        <p>Diese Mission ist eine <strong>Kombination</strong> — alle Teile müssen erfüllt sein:</p>
        <div class="breakdown-list" style="margin-top:8px;">
          ${(fig.unlock.parts || []).map((part) => {
            const partDone = isUnlocked(part, profile);
            return `<div class="breakdown-row"><span>${partDone ? "✅" : "⏳"} ${unlockShortText(part)}</span></div>`;
          }).join("")}
        </div>`;
    } else {
      bodyHtml = `<p>Für diesen Fuchs brauchst du einen besonderen Pokal: <strong>${fig.unlock.match}</strong>.</p>`;
    }
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `
      <div class="profile-modal-card" style="text-align:center;">
        <button type="button" class="lightbox-close" id="missionFoxDetailClose">✕</button>
        <img src="${fig.img}" alt="${fig.name}" style="width:100px; height:100px; object-fit:contain; margin:6px auto 10px; ${unlocked ? "" : "filter:grayscale(1) brightness(0) invert(0.65); opacity:0.7;"}" />
        <h3 style="margin-bottom:4px;">${fig.name}</h3>
        <p class="empty-note" style="margin-bottom:12px;">${fig.desc}</p>
        <div style="text-align:left;">${bodyHtml}</div>
      </div>`;
    document.body.appendChild(box);
    document.getElementById("missionFoxDetailClose").addEventListener("click", () => box.remove());
    box.addEventListener("click", (e) => { if (e.target === box) box.remove(); });
  }
  document.querySelector('#learnSubnav [data-sub="sub-missions"]')?.addEventListener("click", renderMissions);

  function extractYouTubeId(url) {
    if (!url) return null;
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  // Kompakter, ausklappbarer YouTube-Mini-Player — startet eingeklappt (nur ein Button
  // "🎵 Musik abspielen"), öffnet sich erst auf Wunsch, damit nichts automatisch lärmt oder
  // Platz wegnimmt. Nutzt die normale YouTube-Einbettung (offiziell erlaubt), klein und
  // kartenförmig statt riesigem Video.
  function musicPlayerHtml(musicLink, idSuffix) {
    const videoId = extractYouTubeId(musicLink);
    if (!videoId) return "";
    return `
      <div class="music-player-card">
        <button type="button" class="btn btn-ghost music-player-toggle" data-music-toggle="${idSuffix}">🎵 Musik abspielen</button>
        <div class="music-player-frame" id="musicFrame-${idSuffix}" style="display:none;">
          <iframe width="100%" height="80" src="https://www.youtube.com/embed/${videoId}" title="Musik" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>
        </div>
      </div>`;
  }
  function wireMusicPlayer(root) {
    root.querySelectorAll("[data-music-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const frame = document.getElementById(`musicFrame-${btn.dataset.musicToggle}`);
        if (!frame) return;
        const opening = frame.style.display === "none";
        frame.style.display = opening ? "block" : "none";
        btn.textContent = opening ? "🎵 Musik verstecken" : "🎵 Musik abspielen";
      });
    });
  }
  function renderExtendedSteckbrief(p, viewId) {
    // p kann entweder das eigene Profil-Objekt (camelCase) oder ein via getPublicProfile
    // geladenes fremdes Profil (snake_case) sein — beide Formen abdecken.
    const languages = p.languages || [];
    const favMovie = p.favMovie || p.fav_movie || "";
    const favSeries = p.favSeries || p.fav_series || "";
    const favSong = p.favSong || p.fav_song || "";
    const favFood = p.favFood || p.fav_food || "";
    const favDrink = p.favDrink || p.fav_drink || "";
    const favCountry = p.favCountry || p.fav_country || "";
    const favQuote = p.favQuote || p.fav_quote || "";
    const poem = p.poem || "";
    const extra = p.extraProfileData || p.extra_profile_data || {};

    const pages = [
      { icon: "🌍", label: "Sprachen", html: `
        ${languages.length ? `<p class="eyebrow" style="margin-top:4px;">🗣️ Diese Sprachen spreche ich</p><div class="trophy-case" style="margin-top:6px;">${languages.map((l) => `<div class="trophy-chip">🗣️ ${l}</div>`).join("")}</div>` : ""}
        ${favCountry ? `<div class="breakdown-row"><span>🌍 Lieblingsland</span><span>${favCountry}</span></div>` : ""}
        ${extra.dreamDestination ? `<div class="breakdown-row breakdown-row-stacked"><span>✈️ Traumreiseziel</span><span>${extra.dreamDestination}</span></div>` : ""}
        ${extra.visitedCountries ? `<div class="breakdown-row breakdown-row-stacked"><span>🧳 Schon bereist</span><span>${extra.visitedCountries}</span></div>` : ""}
        ${extra.whyGerman ? `<div class="breakdown-row breakdown-row-stacked"><span>💡 Warum Deutsch?</span><span>${extra.whyGerman}</span></div>` : ""}
        ${extra.langGoal ? `<div class="breakdown-row breakdown-row-stacked"><span>🎯 Sprachziel</span><span>${extra.langGoal}</span></div>` : ""}
        ${extra.favSport ? `<div class="breakdown-row"><span>⚽ Lieblingssport</span><span>${extra.favSport}</span></div>` : ""}
      ` },
      { icon: "🎬", label: "Kultur", html: `
        ${favMovie ? `<div class="breakdown-row"><span>🎬 Lieblingsfilm</span><span>${favMovie}</span></div>` : ""}
        ${favSeries ? `<div class="breakdown-row"><span>📺 Lieblingsserie</span><span>${favSeries}</span></div>` : ""}
        ${favSong ? `<div class="breakdown-row"><span>🎵 Lieblingslied</span><span>${favSong}</span></div>` : ""}
        ${extra.favActor ? `<div class="breakdown-row breakdown-row-stacked"><span>🎭 Lieblingsschauspieler:in</span><span>${extra.favActor}</span></div>` : ""}
        ${extra.favBook ? `<div class="breakdown-row breakdown-row-stacked"><span>📚 Lieblingsbuch</span><span>${extra.favBook}</span></div>` : ""}
        ${extra.favArtist ? `<div class="breakdown-row breakdown-row-stacked"><span>🎤 Lieblingsband/Künstler:in</span><span>${extra.favArtist}</span></div>` : ""}
      ` },
      { icon: "💭", label: "Gedanken", html: `
        ${extra.motto ? `<div class="breakdown-row"><span>🌟 Lebensmotto</span><span>${extra.motto}</span></div>` : ""}
        ${extra.secret ? `<div class="poem-box" style="border-left-color:var(--coral-400);"><p style="margin:0;">🤫 ${extra.secret}</p></div>` : ""}
        ${extra.interviewAnswers && Object.values(extra.interviewAnswers).some((a) => a && a.trim()) ? `
          <p class="eyebrow" style="margin-top:14px;">🎤 Interview</p>
          <div class="breakdown-list">
            ${INTERVIEW_QUESTIONS.filter((q) => extra.interviewAnswers[q.id] && extra.interviewAnswers[q.id].trim()).map((q) => `
              <div class="question-card" style="margin-bottom:8px;">
                <p style="font-weight:700; font-size:0.82rem; margin:0 0 4px;">${q.text}</p>
                <p class="empty-note" style="margin:0; white-space:pre-wrap;">${extra.interviewAnswers[q.id]}</p>
              </div>`).join("")}
          </div>
        ` : ""}
        ${extra.bigDream ? `<div class="breakdown-row"><span>🌠 Größter Traum</span><span>${extra.bigDream}</span></div>` : ""}
        ${extra.whatMakesMeHappy ? `<div class="breakdown-row"><span>😊 Macht glücklich</span><span>${extra.whatMakesMeHappy}</span></div>` : ""}
        ${favQuote ? `<div class="poem-box" style="border-left-color:var(--teal-400);"><p style="margin:0;">💬 „${favQuote}"</p></div>` : ""}
        ${poem ? `<div class="poem-box"><p style="white-space:pre-wrap; font-style:italic; margin:0;">„${poem}"</p></div>` : ""}
      ` },
      { icon: "🍽️🎨", label: "Vorlieben", html: `
        ${favFood ? `<div class="breakdown-row"><span>🍽️ Lieblingsessen</span><span>${favFood}</span></div>` : ""}
        ${favDrink ? `<div class="breakdown-row"><span>🥤 Lieblingsgetränk</span><span>${favDrink}</span></div>` : ""}
        ${extra.favColor ? `<div class="breakdown-row"><span>🎨 Lieblingsfarbe</span><span>${extra.favColor}</span></div>` : ""}
        ${extra.favAnimal ? `<div class="breakdown-row"><span>🐾 Lieblingstier</span><span>${extra.favAnimal}</span></div>` : ""}
        ${extra.favSeason ? `<div class="breakdown-row"><span>🍂 Lieblingsjahreszeit</span><span>${extra.favSeason}</span></div>` : ""}
        ${extra.favNumber ? `<div class="breakdown-row"><span>🔢 Lieblingszahl</span><span>${extra.favNumber}</span></div>` : ""}
        ${extra.talent ? `<div class="breakdown-row"><span>⭐ Talent/Hobby</span><span>${extra.talent}</span></div>` : ""}
        ${extra.favVacation ? `<div class="breakdown-row"><span>🏖️ Lieblingsurlaubsart</span><span>${extra.favVacation}</span></div>` : ""}
      ` },
      { icon: "👍👎", label: "Mag ich", html: `
        ${extra.likes ? `<div class="breakdown-row"><span>👍 Das mag ich</span><span>${extra.likes}</span></div>` : ""}
        ${extra.dislikes ? `<div class="breakdown-row"><span>👎 Das mag ich nicht</span><span>${extra.dislikes}</span></div>` : ""}
      ` },
    ];
    const nonEmpty = pages.map((pg) => pg.html.trim().length > 0);
    if (!nonEmpty.some(Boolean)) return "";
    const activePage = Math.min(profileViewPages[viewId] || 0, pages.length - 1);
    return `<div class="breakdown-list" style="margin-top:12px;">
      <div class="order-toggle" data-steckbrief-switch="${viewId}" style="margin-bottom:10px;">
        ${pages.map((pg, i) => `<button type="button" class="order-pill" data-svpage="${i}" aria-selected="${activePage === i}">${pg.icon} ${pg.label}</button>`).join("")}
      </div>
      ${pages[activePage].html.trim() ? pages[activePage].html : '<p class="empty-note">Auf dieser Seite steht noch nichts.</p>'}
    </div>`;
  }
  const profileViewPages = {};
  function wireSteckbriefPager(root, rerenderFn) {
    root.querySelectorAll("[data-steckbrief-switch]").forEach((switchEl) => {
      const viewId = switchEl.dataset.steckbriefSwitch;
      switchEl.querySelectorAll("[data-svpage]").forEach((btn) => {
        btn.addEventListener("click", () => {
          profileViewPages[viewId] = Number(btn.dataset.svpage);
          rerenderFn();
        });
      });
    });
  }

  function adminBadge(isAdminFlag, isOwnerFlag, isModeratorFlag, isBetaTesterFlag, isContributorFlag, isSupporterFlag) {
    if (isOwnerFlag) return '<span class="admin-badge admin-badge-owner" title="Seitenbetreiber">👑 Betreiber</span>';
    if (isAdminFlag) return '<span class="admin-badge" title="Administrator">🛡️ Admin</span>';
    if (isModeratorFlag) return '<span class="admin-badge admin-badge-mod" title="Moderator">🧹 Mod</span>';
    if (isContributorFlag) return '<span class="admin-badge admin-badge-contributor" title="Mitgestalter:in">🛠️ Mitgestalter:in</span>';
    if (isBetaTesterFlag) return '<span class="admin-badge admin-badge-beta" title="Beta-Tester:in">🧪 Beta-Tester:in</span>';
    if (isSupporterFlag) return '<span class="admin-badge admin-badge-supporter" title="Unterstützer:in">💛 Unterstützer:in</span>';
    return "";
  }

  async function renderRecentMembers() {
    const members = await Backend.getRecentMembers();
    if (!members.length) return "";
    return `<div class="breakdown-list" style="margin-top:16px;">
      <p class="eyebrow" style="margin-top:0;">🆕 Neu dabei</p>
      ${members.map((m) => `
        <button type="button" class="member-row" data-view-member="${m.id}">
          ${tinyAvatar(m)}
          <span class="member-name">${m.name}</span>
          <span class="member-date">${m.created_at ? new Date(m.created_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : ""}</span>
        </button>`).join("")}
    </div>`;
  }

  // "Fuchs des Tages/der Woche/..."-Bett-Abzeichen: erscheint im Profil, sobald die Person GERADE
  // eine dieser Auszeichnungen hält — ein kleines, gemütliches Bett mit Patches in Fuchs-
  // Fellfarben (Orange-/Rostton-Flicken wie ein Patchwork), aus dem ein winziger Fuchskopf
  // herausschaut, als würde er dort gerade schlummern.
  // Ungefähres Startdatum der Seite — wird gebraucht, um zu entscheiden, ob ein "Fuchs des
  // Monats/Jahres" überhaupt schon sinnvoll ermittelt werden kann (siehe foxOfPeriodBadgeHtml).
  // Lieber ein paar Tage zu früh angesetzt als zu spät, damit die Auszeichnung nicht künstlich
  // länger als nötig verzögert wird.
  const SITE_LAUNCH_DATE = new Date("2026-08-25T00:00:00Z");
  async function foxOfPeriodBadgeHtml(userId) {
    if (!userId) return "";
    // Monat/Jahr werden NUR abgefragt, wenn seit dem Start der Seite auch wirklich schon ein
    // VOLLER Monat bzw. ein volles Jahr vergangen ist — vorher gäbe es dafür noch gar keine
    // sinnvolle Datengrundlage, und die Auszeichnung würde auf Basis eines unvollständigen
    // Zeitraums vergeben, was unfair wäre. Tag und Woche sind davon nicht betroffen, die können
    // von Anfang an sinnvoll ermittelt werden.
    const daysSinceLaunch = (Date.now() - SITE_LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24);
    const monthReady = daysSinceLaunch >= 30;
    const yearReady = daysSinceLaunch >= 365;
    const [day, week, month, year] = await Promise.all([
      Backend.getFoxOfTheDay().catch(() => null),
      Backend.getFoxOfWeek ? Backend.getFoxOfWeek().catch(() => null) : Backend.getFoxOfTheWeek().catch(() => null),
      monthReady && Backend.getFoxOfMonth ? Backend.getFoxOfMonth().catch(() => null) : Promise.resolve(null),
      yearReady && Backend.getFoxOfYear ? Backend.getFoxOfYear().catch(() => null) : Promise.resolve(null),
    ]);
    // Englische Bezeichnung NUR an dieser Stelle (wo die Auszeichnungen selbst vergeben/gezeigt
    // werden), wie ausdrücklich gewünscht.
    const labels = [];
    if (day && day.user_id === userId) labels.push("Fox of the Day");
    if (week && week.user_id === userId) labels.push("Fox of the Week");
    if (month && month.user_id === userId) labels.push("Fox of the Month");
    if (year && year.user_id === userId) labels.push("Fox of the Year");
    if (!labels.length) return "";
    // Jedes Badge einzeln, UNTEREINANDER gestapelt (statt mit "·" zu einer einzigen, oft viel zu
    // breiten Zeile zusammengefügt) — bei mehreren gleichzeitigen Auszeichnungen lief die lange
    // Zeile bisher über den Rand hinaus und wurde von der Punkteanzeige verdeckt.
    return labels.map((label) => `<span class="admin-badge fox-period-badge" style="display:block; width:fit-content; margin-bottom:4px;"><span class="fox-period-badge-emoji">🦊</span> <span class="fox-period-badge-text">${label}</span></span>`).join("");
  }
  async function openProfileModal(id, existingBox) {
    const p = await Backend.getPublicProfile(id);
    if (!p) {
      alert("Dieses Profil konnte nicht geladen werden. Das liegt entweder an Row Level Security (RLS) in Supabase, oder daran, dass eine kürzlich hinzugekommene Spalte in der Tabelle „profiles\" noch fehlt. Öffne die Browser-Konsole für die genaue Fehlermeldung, und führe sicherheitshalber das komplette Nachrüst-SQL aus dem README (Abschnitt „Nachrüst-SQL\") im Supabase SQL-Editor aus.");
      return;
    }
    Backend.recordProfileVisit(p.id); // nicht blockierend — Popup soll nicht auf das Speichern warten
    const initials = (p.name || "?").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const avatarHtml = p.avatar_url
      ? avatarPhotoHtml(p.avatar_url)
      : p.avatar_emoji
        ? `<div class="initials-avatar emoji-avatar">${p.avatar_emoji}</div>`
        : `<div class="initials-avatar">${initials}</div>`;
    const me = Backend.currentUser();
    const isMe = me && me.id === p.id;
    const theirFriends = await Backend.getFriends(p.id);
    const alreadyFriends = me && !isMe ? theirFriends.some((f) => f.id === me.id) : false;
    const profileNotes = await Backend.getProfileNotes(p.id);
    const profileVisitors = isMe ? await Backend.getProfileVisitors(p.id, Backend.canModerate()) : [];
    const originFlag = p.origin ? (VocabData.COUNTRIES.find((c) => c.name === p.origin) || {}).flag || "🌍" : "";
    // Wichtigste zuerst: echte Pokale (große Meisterleistungen) werden vor den häufigeren Orden
    // gezeigt, damit die vier sichtbaren Kacheln auch wirklich die beeindruckendsten sind.
    const sortedTrophies = [...(p.trophies || [])].sort((a, b) => (trophyKind(b) === "pokal") - (trophyKind(a) === "pokal"));
    const trophies = sortedTrophies.slice(0, 4);
    const trophyOverflow = sortedTrophies.length - trophies.length;
    const mySympathyLevel = (!isMe && me) ? await Backend.getMySympathyFor(p.id) : null;
    const allSympathyLevels = (!isMe && me) ? await Backend.getAllSympathyLevels() : [];
    const foxBedBadge = await foxOfPeriodBadgeHtml(p.id);

    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("div", { class: "profile-modal-card", "data-theme": p.theme || "bastelheft" },
        Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
        Core.el("p", { class: "empty-note", style: "text-align:center; margin:-6px 0 4px; letter-spacing:0.02em;" }, `🎨 ${p.name}s Design: ${(THEMES.find((t) => t.id === (p.theme || "bastelheft")) || {}).name || "Bastelheft"}`),
        Core.el("div", { class: "profile-modal-header", html: `${avatarHtml}<h2>${p.name}${!(p.extra_profile_data || {}).hideAge && calculateAge(p.birthday) ? `, ${calculateAge(p.birthday)}` : ""}${genderSymbolCompact((p.extra_profile_data || {}).genderSymbol) ? ` ${genderSymbolCompact((p.extra_profile_data || {}).genderSymbol)}` : ""}${adminBadge(p.is_admin, p.is_owner, p.is_moderator, p.is_beta_tester, p.is_contributor, p.is_supporter)}</h2>${foxBedBadge ? `<div class="fox-period-badge-stack">${foxBedBadge}</div>` : ""}` }),
        Core.el("p", { class: "modal-points-line" }, `🎯 ${p.points || 0} Punkte`),
        (p.extra_profile_data && p.extra_profile_data.proficiencyLevel) ? Core.el("p", { class: "empty-note", style: "text-align:center; margin-top:-4px;" }, PROFICIENCY_BADGE[p.extra_profile_data.proficiencyLevel]) : "",
        !isMe && me ? Core.el("div", { class: "sympathy-hearts-row", html: `
          <p class="empty-note" style="text-align:center; margin-bottom:4px;">Wie gerne magst du ${p.name}? <span class="subnav-info-icon" data-info="Ganz privat — nur du siehst deine Auswahl. Wählt ihr euch beide gegenseitig, bekommt ihr automatisch Nachricht, dass es ein Match ist.">ⓘ</span></p>
          <div style="display:flex; justify-content:center; gap:8px;">
            ${allSympathyLevels.map((lvl) => `<button type="button" class="sympathy-heart-btn" data-sympathy-level="${lvl.key}" title="${lvl.label}" style="background:none; border:none; cursor:pointer; font-size:1.4rem; opacity:${mySympathyLevel === lvl.key ? "1" : "0.3"}; filter:${mySympathyLevel === lvl.key ? "none" : "grayscale(0.6)"};"><svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 21 C12 21 3 14.5 3 8.5 C3 5.5 5.5 3 8.5 3 C10 3 11.3 3.7 12 4.8 C12.7 3.7 14 3 15.5 3 C18.5 3 21 5.5 21 8.5 C21 14.5 12 21 12 21 Z" fill="${lvl.color}"/></svg></button>`).join("")}
          </div>
        ` }) : "",
        Core.el("div", { html: showcaseSongStripHtml(p), style: "margin: 6px 0;" }),
        Core.el("div", { html: await profileTransportStripHtml(p) }),
        Core.el("p", { class: "empty-note", style: "text-align:center; margin-top:-4px;" }, lastSeenText(p.last_active, p.online)),
        Core.el("p", { class: "empty-note" }, p.bio || "Noch keine Beschreibung."),
        Core.el("div", { class: "modal-meta-row" },
          Core.el("span", { class: "flow-badge" },
            Core.el("button", { type: "button", class: "friend-name-btn", id: "modalFriendsToggle" }, `👥 ${theirFriends.length} ${theirFriends.length === 1 ? "Freund" : "Freunde"}`)
          ),
          originFlag ? Core.el("span", { class: "flow-badge" }, `${originFlag} ${p.origin}`) : "",
          zodiacBadgeHtml(p.birthday) ? Core.el("span", { class: "flow-badge", html: zodiacBadgeHtml(p.birthday) }) : ""
        ),
        Core.el("div", { class: "modal-friends-list", id: "modalFriendsList", style: "display:none;" },
          theirFriends.length
            ? theirFriends.map((f) => Core.el("button", {
                type: "button", class: "friend-list-row", onclick: () => openProfileModal(f.id, box),
              }, tinyAvatarNode(f), Core.el("span", { class: "name" }, f.name)))
            : Core.el("p", { class: "empty-note" }, "Noch keine Freunde.")
        ),
        p.hobbies && p.hobbies.length
          ? Core.el("div", { html: '<p class="eyebrow" style="text-align:center; margin-top:10px;">🎯 Hobbys & Interessen</p>' })
          : "",
        p.hobbies && p.hobbies.length
          ? Core.el("div", { class: "trophy-case", style: "justify-content:center; margin-top:6px;",
              html: p.hobbies.map((h) => {
                const hobby = VocabData.HOBBIES.find((x) => x.noun === h);
                return hobby ? `<div class="trophy-chip">${hobby.emoji} ${hobby.article} ${hobby.noun}</div>` : "";
              }).join("") })
          : "",
        Core.el("div", { html: renderExtendedSteckbrief(p, "modal-" + p.id) }),
        // WICHTIG: nutzt jetzt dieselbe renderTrophyCase()-Funktion wie das eigene Profil, statt
        // einer eigenen, abweichenden Inline-Struktur — vorher fehlte im fremden Profil sowohl die
        // "Vitrine"-Überschrift als auch die kompakte "X Orden / Y Pokale"-Zusammenfassung, die im
        // eigenen Profil sichtbar ist. Jetzt an beiden Stellen konsistent.
        trophies.length ? Core.el("div", { class: "quiz-actions", style: "justify-content:center; gap:18px; margin-top:10px;",
          html: `<span class="empty-note" style="font-size:0.95rem;">🎖️ ${trophyCounts({ trophies }).orden} Orden</span>
                 <span class="empty-note" style="font-size:0.95rem;">🏆 ${trophyCounts({ trophies }).pokale} Pokale</span>` }) : "",
        Core.el("div", { html: renderTrophyCase({ trophies }, true) }),
        COLLECTIBLE_FIGURES.some((fig) => isFigureUnlocked(fig, p))
          ? Core.el("div", { html: '<p class="eyebrow" style="text-align:center; margin-top:12px;">🦊 Sammelfiguren</p>' })
          : "",
        COLLECTIBLE_FIGURES.some((fig) => isFigureUnlocked(fig, p))
          ? Core.el("div", { class: "figure-case", style: "justify-content:center;",
              html: COLLECTIBLE_FIGURES.filter((fig) => isFigureUnlocked(fig, p)).map((fig) =>
                `<div class="figure-slot" data-figure-detail="${fig.id}" title="${fig.name} — ${fig.desc}"><img src="${fig.img}" alt="${fig.name}" loading="lazy" /></div>`
              ).join("") })
          : "",
        Core.el("div", { html: renderInterviewPreview(p, isMe) }),
        (p.gallery && p.gallery.length)
          ? Core.el("div", { class: "gallery-grid", id: "modalGalleryGrid", style: "margin-top:12px;",
              html: p.gallery.map((url) => `
                <div class="gallery-thumb-wrap">
                  <img src="${url}" class="gallery-thumb" alt="" data-modal-view-photo="${url}" />
                  ${(Backend.canModerate() && !isMe) ? `<button type="button" class="gallery-remove-btn" data-admin-delete-photo="${url}" title="Löschen">✕</button>` : ""}
                </div>`).join("") })
          : "",
        Core.el("div", { class: "quiz-actions", style: "justify-content:center; margin-top:16px;" },
          isMe
            ? Core.el("span", { class: "empty-note" }, "Das bist du 👋")
            : alreadyFriends
              ? Core.el("span", { class: "friend-status-badge" }, "✅ Ihr seid befreundet")
              : Core.el("button", {
                  class: "btn btn-coffee", type: "button", id: "modalAddFriend",
                  onclick: async (e) => {
                    if (!me) { alert("Melde dich zuerst an, um Freunde hinzuzufügen."); return; }
                    try { await Backend.sendFriendRequest(p.id); e.target.textContent = "Angefragt ✓"; e.target.disabled = true; }
                    catch (err) { alert(err.message); }
                  },
                }, "🤝 Freund werden")
        ),
        !isMe ? Core.el("div", { class: "quiz-actions", style: "justify-content:center;" },
          Core.el("button", { type: "button", class: "btn btn-ghost", onclick: () => viewFriendPlaylist(p.id, p.name) }, "🎵 Playlist ansehen")
        ) : "",
        Core.el("div", {
          class: "question-card", style: "text-align:left; margin-top:14px;",
          html: `
            <p class="eyebrow">👣 SPUREN HINTERLASSEN</p>
            ${profileNotes.length ? `<div class="breakdown-list" style="margin-bottom:10px;">
              ${profileNotes.map((n) => `<div class="breakdown-row" style="flex-direction:column; align-items:flex-start; gap:2px;">
                <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                  <strong style="font-size:0.82rem;">${n.author_name}</strong>
                  ${me && n.author_id === me.id ? `<button type="button" class="emoji-toggle-link" data-delete-note="${n.id}" style="font-size:0.68rem; color:var(--coral-400,#e85a5a);">🗑️ Löschen</button>` : ""}
                </div>
                <span class="empty-note">${n.message}</span>
              </div>`).join("")}
            </div>` : `<p class="empty-note" style="margin-bottom:10px;">Noch keine Spuren — sei die/der Erste!</p>`}
            ${!isMe && me ? `
              <textarea id="profileNoteInput" class="guestbook-form-textarea" maxlength="200" placeholder="Hinterlasse einen Gruß auf ${p.name}s Profil…"></textarea>
              <button type="button" class="btn btn-ghost" id="profileNoteSubmit" style="margin-top:6px;">Hinterlassen</button>
            ` : ""}
            ${isMe && Backend.canModerate() ? `
              <p class="eyebrow" style="margin-top:14px;">👁️ WER WAR HIER</p>
              ${profileVisitors.length ? profileVisitors.map((v) => `<div class="breakdown-row"><span>👤 ${v.visitor_name}</span><span class="empty-note" style="font-size:0.72rem;">${new Date(v.visited_at).toLocaleDateString("de-DE")}</span></div>`).join("") : '<p class="empty-note">Noch niemand da gewesen.</p>'}
            ` : ""}
          `,
        }),
        (Backend.isOwner() && !isMe && !p.is_owner)
          ? Core.el("div", { class: "quiz-actions", style: "justify-content:center; margin-top:10px; flex-wrap:wrap;" },
              Core.el("button", {
                class: p.is_admin ? "btn btn-ghost" : "btn btn-coffee", type: "button",
                onclick: async (e) => {
                  const makeAdmin = !p.is_admin;
                  if (!confirm(makeAdmin ? `${p.name} zum Administrator machen?` : `${p.name} die Admin-Rechte entziehen?`)) return;
                  try {
                    await Backend.setAdminStatus(p.id, makeAdmin);
                    p.is_admin = makeAdmin;
                    e.target.textContent = makeAdmin ? "🛡️ Admin-Rechte entziehen" : "🛡️ Zum Administrator machen";
                    e.target.className = makeAdmin ? "btn btn-ghost" : "btn btn-coffee";
                  } catch (err) { alert(err.message); }
                },
              }, p.is_admin ? "🛡️ Admin-Rechte entziehen" : "🛡️ Zum Administrator machen")
            )
          : "",
        (Backend.isAdmin() && !isMe && !p.is_admin && !p.is_owner)
          ? Core.el("div", { class: "quiz-actions", style: "justify-content:center; margin-top:8px; flex-wrap:wrap;" },
              Core.el("button", {
                class: p.is_moderator ? "btn btn-ghost" : "btn btn-coffee", type: "button",
                onclick: async (e) => {
                  const makeMod = !p.is_moderator;
                  if (!confirm(makeMod ? `${p.name} zum Moderator machen?` : `${p.name} die Moderator-Rechte entziehen?`)) return;
                  try {
                    await Backend.setModeratorStatus(p.id, makeMod);
                    p.is_moderator = makeMod;
                    e.target.textContent = makeMod ? "🧹 Moderator-Rechte entziehen" : "🧹 Zum Moderator machen";
                    e.target.className = makeMod ? "btn btn-ghost" : "btn btn-coffee";
                  } catch (err) { alert(err.message); }
                },
              }, p.is_moderator ? "🧹 Moderator-Rechte entziehen" : "🧹 Zum Moderator machen")
            )
          : "",
        (Backend.canModerate() && !isMe)
          ? Core.el("div", { class: "admin-tools-box" },
              Core.el("p", { class: "empty-note", style: "margin:0 0 6px; font-weight:700;" }, "🧹 Moderationswerkzeuge"),
              Core.el("div", { class: "quiz-actions", style: "justify-content:flex-start; margin-top:0; flex-wrap:wrap;" },
                Core.el("button", {
                  class: "btn btn-ghost", type: "button",
                  onclick: async () => {
                    if (!confirm(`Profilbild von ${p.name} entfernen?`)) return;
                    try { await Backend.adminDeleteAvatar(p.id); alert("Profilbild entfernt."); box.remove(); }
                    catch (err) { alert(err.message); }
                  },
                }, "🖼️ Profilbild entfernen")
              ),
              Backend.isAdmin() ? Core.el("div", { class: "quiz-actions", style: "justify-content:flex-start; margin-top:8px; flex-wrap:wrap;" },
                Core.el("button", {
                  class: "btn btn-ghost", type: "button", id: "modalGiftCategoryBtn",
                  onclick: async () => {
                    const locked = ExerciseData.CATEGORIES.filter((c) => c.unlock);
                    if (!locked.length) { alert("Es gibt aktuell keine sperrbaren Kategorien."); return; }
                    const choice = prompt(`Welche Kategorie soll ${p.name} geschenkt bekommen?\n\n` + locked.map((c, i) => `${i + 1}. ${c.title}`).join("\n") + "\n\nZahl eingeben:");
                    const idx = parseInt(choice, 10) - 1;
                    if (isNaN(idx) || !locked[idx]) return;
                    try { await Backend.adminGiftCategoryUnlock(p.id, locked[idx].id, locked[idx].title); alert(`„${locked[idx].title}" wurde ${p.name} geschenkt und freigeschaltet.`); }
                    catch (err) { alert(err.message); }
                  },
                }, "🎁 Kategorie schenken"),
                Core.el("button", {
                  class: "btn btn-ghost", type: "button", id: "modalGiftThemeBtn",
                  onclick: async () => {
                    const locked = THEMES.filter((t) => t.unlock);
                    if (!locked.length) { alert("Es gibt aktuell keine sperrbaren Designs."); return; }
                    const choice = prompt(`Welches Design soll ${p.name} geschenkt bekommen?\n\n` + locked.map((t, i) => `${i + 1}. ${t.name}`).join("\n") + "\n\nZahl eingeben:");
                    const idx = parseInt(choice, 10) - 1;
                    if (isNaN(idx) || !locked[idx]) return;
                    try { await Backend.adminGiftThemeUnlock(p.id, locked[idx].id, locked[idx].name); alert(`„${locked[idx].name}" wurde ${p.name} geschenkt und freigeschaltet.`); }
                    catch (err) { alert(err.message); }
                  },
                }, "🎨 Design schenken")
              ) : ""
            )
          : "",
        (Backend.isOwner() && !isMe && !p.is_owner)
          ? Core.el("div", { class: "admin-tools-box", style: "border-color:rgba(232,72,63,0.4);" },
              Core.el("p", { class: "empty-note", style: "margin:0 0 6px; font-weight:700;" }, "⚠️ Nur für den Betreiber"),
              Core.el("button", {
                class: "btn btn-ghost", type: "button", style: "color:var(--coral-400);",
                onclick: async () => {
                  if (!confirm(`Konto von ${p.name} wirklich unwiderruflich löschen? Das kann nicht rückgängig gemacht werden.`)) return;
                  if (!confirm("Bist du ganz sicher? Alle Profildaten gehen verloren.")) return;
                  try { await Backend.adminDeleteAccount(p.id); alert("Profil gelöscht. Hinweis: Der Login-Zugang selbst muss zusätzlich in Supabase unter Authentication -> Users entfernt werden."); box.remove(); }
                  catch (err) { alert(err.message); }
                },
              }, "🗑️ Konto löschen")
            )
          : ""
      )
    );
    // Beim Umblättern der Steckbrief-Seiten (existingBox gesetzt): NICHT erst das alte Popup
    // entfernen und dann asynchron neu laden — in der kurzen Lücke dazwischen wurde sonst kurz
    // die dahinterliegende Seite (z. B. das eigene Profil) sichtbar, was wie ein Aufblitzen/
    // Reinzoomen wirkte. Stattdessen: neues Popup exakt an derselben Stelle einfügen, dann erst
    // das alte entfernen — kein Moment, in dem gar kein Popup da ist.
    if (existingBox && existingBox.parentNode) {
      existingBox.parentNode.insertBefore(box, existingBox);
      existingBox.remove();
    } else {
      document.body.appendChild(box);
    }
    wireSteckbriefPager(box, () => openProfileModal(id, box));
    wireMusicPlayer(box);
    wireProfileTransportStrip(box, p);
    wireTrophyCaseToggle(box);
    box.querySelectorAll("[data-figure-detail]").forEach((el) => {
      el.addEventListener("click", () => openFigureDetailModal(el.dataset.figureDetail));
    });
    box.querySelectorAll("[data-sympathy-level]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          // Antippt man das Herz, das schon aktiv ist (volle Deckkraft), wird die Angabe
          // komplett zurückgenommen, statt sie erneut auf denselben Wert zu setzen — so kann
          // man eine einmal vergebene Sympathie-Stufe auch wieder entfernen.
          const alreadyActive = btn.style.opacity === "1";
          if (alreadyActive) {
            await Backend.removeSympathyLevel(p.id);
            showToast("💛 Zurückgenommen — keine Angabe mehr gespeichert.");
          } else {
            await Backend.setSympathyLevel(p.id, btn.dataset.sympathyLevel);
            showToast("💛 Gespeichert — ganz privat, nur du siehst deine Auswahl.");
          }
          openProfileModal(id, box);
        } catch (err) { alert(err.message || "Konnte nicht gespeichert werden."); }
      });
    });
    document.getElementById("profileNoteSubmit")?.addEventListener("click", async () => {
      try {
        await Backend.addProfileNote(p.id, document.getElementById("profileNoteInput").value);
        openProfileModal(id, box);
      } catch (err) { alert(err.message); }
    });
    box.querySelectorAll("[data-delete-note]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Diese eigene Spur wirklich löschen?")) return;
        try {
          await Backend.deleteMyProfileNote(btn.dataset.deleteNote);
          openProfileModal(id, box);
        } catch (err) { alert(err.message); }
      });
    });
    box.querySelectorAll("[data-modal-view-photo]").forEach((img, idx, all) => {
      const urls = [...all].map((el) => el.dataset.modalViewPhoto);
      img.addEventListener("click", () => openGallerySlideshow(urls, idx, "Foto"));
    });
    box.querySelectorAll("[data-admin-delete-photo]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (!confirm("Dieses Foto als Admin löschen?")) return;
        try {
          await Backend.adminDeleteGalleryPhoto(p.id, btn.dataset.adminDeletePhoto);
          btn.closest(".gallery-thumb-wrap").remove();
        } catch (err) { alert(err.message); }
      });
    });
    document.getElementById("modalFriendsToggle").addEventListener("click", () => {
      const list = document.getElementById("modalFriendsList");
      list.style.display = list.style.display === "none" ? "flex" : "none";
    });
    const trophyMoreBtn = document.getElementById("modalTrophyMoreBtn");
    if (trophyMoreBtn) {
      trophyMoreBtn.addEventListener("click", () => {
        document.getElementById("modalTrophyMoreList").style.display = "flex";
        trophyMoreBtn.style.display = "none";
      });
    }
  }

  async function showPointsBreakdown(profile) {
    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("div", { class: "profile-modal-card" },
        Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
        Core.el("h2", { style: "margin-bottom:10px;" }, `🎯 ${profile.points} Punkte insgesamt`),
        Core.el("p", { class: "empty-note", id: "breakdownLoading" }, "Lade Aufschlüsselung …")
      )
    );
    document.body.appendChild(box);
    const rows = await Backend.getFullPointsBreakdown();
    const loading = document.getElementById("breakdownLoading");
    if (!loading) return; // Popup wurde inzwischen geschlossen
    if (!rows.length) {
      loading.textContent = "Noch keine gespielten Runden erfasst.";
      return;
    }
    const sum = rows.reduce((s, [, pts]) => s + pts, 0);
    loading.outerHTML = `<div class="breakdown-list">${rows.map(([name, pts]) => `<div class="breakdown-row"><span>${name}</span><span>${pts} Pkt.</span></div>`).join("")}</div>${sum !== profile.points ? `<p class="empty-note" style="margin-top:8px;">Hinweis: ${sum} von ${profile.points} Punkten lassen sich aktuell einzelnen Kategorien zuordnen — der Rest stammt vermutlich aus älteren, vor dieser Funktion gespielten Runden.</p>` : ""}`;
  }

  function tinyAvatarNode(f) {
    if (f.avatar_url) {
      if (isFigureAvatarUrl(f.avatar_url)) {
        return Core.el("div", { class: "tiny-avatar tiny-avatar-figure-wrap" }, Core.el("img", { src: f.avatar_url, alt: "", class: "tiny-avatar-figure-sticker" }));
      }
      return Core.el("img", { src: f.avatar_url, class: "tiny-avatar", alt: "" });
    }
    if (f.avatar_emoji) return Core.el("span", { class: "tiny-avatar tiny-avatar-emoji" }, f.avatar_emoji);
    const initials = (f.name || "?").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    return Core.el("span", { class: "tiny-avatar tiny-avatar-initials" }, initials);
  }

  async function renderActivityFeed() {
    const items = await Backend.getActivity();
    if (!items.length) return "";
    return `<div class="breakdown-list" style="margin-top:16px;">
      <p class="eyebrow" style="margin-top:0;">🔔 Was gerade passiert</p>
      ${items.map((a) => `<div class="breakdown-row"><span>${a.text}</span><span class="empty-note">${new Date(a.date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</span></div>`).join("")}
    </div>`;
  }

  loginBtn.addEventListener("click", () => {
    stopNotifyReminder();
    if (notifyTarget) {
      const action = notifyTarget.action;
      notifyTarget = null;
      action();
      return;
    }
    activateTab("view-profile");
  });

  /* ============================================================
     FREUNDE
     ============================================================ */
  let friendChallengeTarget = null;

  // Eigene, handgezeichnete SVG-"Sticker" für das Postfach — ein erster kleiner Satz von vier,
  // lässt sich später leicht um weitere ergänzen (einfach neue Einträge in DMA_STICKERS).
  const DMA_STICKERS = {
    fuchs: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M20 8 L10 4 L13 14 Q9 18 9 24 Q9 33 20 35 Q31 33 31 24 Q31 18 27 14 L30 4 Z" fill="#E8825F"/><path d="M14 15 L12 8 L18 13 Z" fill="#F5C99A"/><path d="M26 15 L28 8 L22 13 Z" fill="#F5C99A"/><circle cx="15" cy="23" r="2" fill="#241505"/><circle cx="25" cy="23" r="2" fill="#241505"/><path d="M17 28 Q20 31 23 28" stroke="#241505" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M20 24 L18 27 L22 27 Z" fill="#241505"/></svg>`,
    eule: `<svg viewBox="0 0 40 40" width="28" height="28"><ellipse cx="20" cy="22" rx="12" ry="14" fill="#8B6F47"/><circle cx="14" cy="18" r="6" fill="#F5EFE4"/><circle cx="26" cy="18" r="6" fill="#F5EFE4"/><circle cx="14" cy="18" r="3" fill="#241505"/><circle cx="26" cy="18" r="3" fill="#241505"/><path d="M20 20 L17 25 L23 25 Z" fill="#E8A03D"/><path d="M9 10 L14 14 M31 10 L26 14" stroke="#8B6F47" stroke-width="3" stroke-linecap="round"/></svg>`,
    doktorhut: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M20 10 L36 17 L20 24 L4 17 Z" fill="#241505"/><path d="M12 20 L12 27 Q20 32 28 27 L28 20" fill="none" stroke="#241505" stroke-width="2"/><circle cx="36" cy="17" r="1.5" fill="#E8A03D"/><path d="M36 17 L36 27" stroke="#E8A03D" stroke-width="1.5"/><circle cx="36" cy="28" r="2" fill="#E8A03D"/></svg>`,
    herzblase: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M6 8 H34 Q36 8 36 10 V24 Q36 26 34 26 H16 L9 32 L10 26 H6 Q4 26 4 24 V10 Q4 8 6 8 Z" fill="#F6CC78"/><path d="M20 20 C16 15 10 17 10 21 C10 25 20 30 20 30 C20 30 30 25 30 21 C30 17 24 15 20 20 Z" fill="#E85F6F"/></svg>`,
    daumen: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M14 18 L14 34 L9 34 Q6 34 6 31 V21 Q6 18 9 18 Z" fill="#4FA88E"/><path d="M14 18 L18 6 Q19 3 22 4 Q25 5 24 9 L22 16 H31 Q35 16 34 20 L31 32 Q30 34 27 34 H16 V18 Z" fill="#F2B84B"/></svg>`,
    sonnenblume: `<svg viewBox="0 0 40 40" width="28" height="28"><circle cx="20" cy="18" r="6" fill="#8B6F47"/><g fill="#F2B84B"><ellipse cx="20" cy="6" rx="3.5" ry="6"/><ellipse cx="20" cy="30" rx="3.5" ry="6"/><ellipse cx="8" cy="18" rx="6" ry="3.5"/><ellipse cx="32" cy="18" rx="6" ry="3.5"/><ellipse cx="11" cy="9" rx="3.5" ry="6" transform="rotate(-45 11 9)"/><ellipse cx="29" cy="27" rx="3.5" ry="6" transform="rotate(-45 29 27)"/><ellipse cx="29" cy="9" rx="3.5" ry="6" transform="rotate(45 29 9)"/><ellipse cx="11" cy="27" rx="3.5" ry="6" transform="rotate(45 11 27)"/></g><path d="M20 30 L18 38 M20 30 L22 38" stroke="#4FA88E" stroke-width="2" stroke-linecap="round"/></svg>`,
    rakete: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M20 4 Q28 12 26 24 L14 24 Q12 12 20 4 Z" fill="#E8825F"/><circle cx="20" cy="16" r="3.5" fill="#F5EFE4"/><path d="M14 22 L8 30 L14 28 Z" fill="#4FA88E"/><path d="M26 22 L32 30 L26 28 Z" fill="#4FA88E"/><path d="M17 24 L15 34 L20 30 L25 34 L23 24 Z" fill="#F2B84B"/></svg>`,
    blitz: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M22 3 L9 22 H18 L15 37 L32 15 H22 Z" fill="#F2B84B" stroke="#241505" stroke-width="1"/></svg>`,
    stern: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M20 3 L24.5 15 L37 15 L27 23 L31 36 L20 28 L9 36 L13 23 L3 15 L15.5 15 Z" fill="#F2B84B" stroke="#241505" stroke-width="1"/></svg>`,
    note: `<svg viewBox="0 0 40 40" width="28" height="28"><circle cx="12" cy="30" r="5" fill="#4FA88E"/><circle cx="28" cy="26" r="5" fill="#4FA88E"/><path d="M17 30 V10 L33 6 V26" stroke="#241505" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    haken: `<svg viewBox="0 0 40 40" width="28" height="28"><circle cx="20" cy="20" r="17" fill="#4FA88E"/><path d="M11 20 L17 27 L29 12" stroke="#F5EFE4" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    buch: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M20 10 Q12 5 5 8 V30 Q12 27 20 32 Q28 27 35 30 V8 Q28 5 20 10 Z" fill="#E8825F"/><path d="M20 10 V32" stroke="#241505" stroke-width="1.5"/></svg>`,
    kaffee: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M8 16 H28 V27 Q28 33 20 33 Q12 33 12 27 Z" fill="#8B6F47"/><path d="M28 18 Q35 18 35 23 Q35 28 28 27" fill="none" stroke="#8B6F47" stroke-width="2.5"/><path d="M13 10 Q15 13 13 15 M20 10 Q22 13 20 15 M27 10 Q29 13 27 15" stroke="#A594D1" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
    konfetti: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M6 34 L16 12 Q17 9 20 10 Q23 11 22 14 L12 36 Z" fill="#E8825F"/><rect x="24" y="6" width="4" height="4" fill="#F2B84B" transform="rotate(20 26 8)"/><rect x="30" y="16" width="4" height="4" fill="#4FA88E" transform="rotate(-15 32 18)"/><circle cx="32" cy="8" r="2" fill="#E85F6F"/><rect x="10" y="4" width="3.5" height="3.5" fill="#A594D1" transform="rotate(35 12 6)"/></svg>`,
    ziel: `<svg viewBox="0 0 40 40" width="28" height="28"><circle cx="20" cy="20" r="16" fill="#E85F6F"/><circle cx="20" cy="20" r="10.5" fill="#F5EFE4"/><circle cx="20" cy="20" r="5" fill="#E85F6F"/><circle cx="20" cy="20" r="1.8" fill="#F5EFE4"/></svg>`,
    sprechblase: `<svg viewBox="0 0 40 40" width="28" height="28"><ellipse cx="20" cy="17" rx="16" ry="12" fill="#A594D1"/><path d="M13 27 L9 34 L18 28 Z" fill="#A594D1"/><circle cx="13" cy="17" r="2" fill="#F5EFE4"/><circle cx="20" cy="17" r="2" fill="#F5EFE4"/><circle cx="27" cy="17" r="2" fill="#F5EFE4"/></svg>`,
    panda: `<svg viewBox="0 0 40 40" width="28" height="28"><circle cx="20" cy="21" r="14" fill="#F5EFE4"/><circle cx="9" cy="9" r="5" fill="#241505"/><circle cx="31" cy="9" r="5" fill="#241505"/><ellipse cx="13" cy="20" rx="4" ry="5" fill="#241505"/><ellipse cx="27" cy="20" rx="4" ry="5" fill="#241505"/><circle cx="13" cy="20" r="1.8" fill="#F5EFE4"/><circle cx="27" cy="20" r="1.8" fill="#F5EFE4"/><ellipse cx="20" cy="27" rx="2.5" ry="2" fill="#241505"/><path d="M17 30 Q20 32 23 30" stroke="#241505" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`,
    katze: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M10 10 L14 18 L8 20 Z" fill="#F2B84B"/><path d="M30 10 L26 18 L32 20 Z" fill="#F2B84B"/><circle cx="20" cy="22" r="13" fill="#F2B84B"/><path d="M14 21 Q16 19 18 21" stroke="#241505" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M26 21 Q24 19 22 21" stroke="#241505" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M20 24 L18 27 L22 27 Z" fill="#E8825F"/><path d="M17 29 Q20 31 23 29" stroke="#241505" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M7 25 H14 M7 28 H14 M26 25 H33 M26 28 H33" stroke="#241505" stroke-width="1" stroke-linecap="round"/></svg>`,
    frosch: `<svg viewBox="0 0 40 40" width="28" height="28"><ellipse cx="20" cy="24" rx="15" ry="11" fill="#7BC47F"/><circle cx="13" cy="12" r="6" fill="#7BC47F"/><circle cx="27" cy="12" r="6" fill="#7BC47F"/><circle cx="13" cy="12" r="3" fill="#241505"/><circle cx="27" cy="12" r="3" fill="#241505"/><path d="M11 27 Q20 33 29 27" stroke="#241505" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    biene: `<svg viewBox="0 0 40 40" width="28" height="28"><ellipse cx="20" cy="22" rx="6" ry="10" fill="#F2B84B"/><path d="M15 15 H25 M14 20 H26 M15 25 H25" stroke="#241505" stroke-width="2.5"/><path d="M14 13 Q7 8 5 14 Q9 18 15 15 Z" fill="#F5EFE4" opacity="0.85"/><path d="M26 13 Q33 8 35 14 Q31 18 25 15 Z" fill="#F5EFE4" opacity="0.85"/><circle cx="17" cy="11" r="1.5" fill="#241505"/><circle cx="23" cy="11" r="1.5" fill="#241505"/><path d="M14 9 L11 5 M26 9 L29 5" stroke="#241505" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    schnecke: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M6 30 Q6 20 16 20 Q24 20 24 27 Q24 32 18 32 Q14 32 14 28 Q14 25 18 25" stroke="#4FA88E" stroke-width="0" fill="#E8825F"/><circle cx="17" cy="26" r="10" fill="#E8825F"/><circle cx="17" cy="26" r="6" fill="#F2B84B"/><circle cx="17" cy="26" r="2.5" fill="#E8825F"/><path d="M8 30 Q3 30 3 25 Q3 22 8 23" stroke="#4FA88E" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M8 23 L6 15 M11 22 L11 13" stroke="#4FA88E" stroke-width="2" stroke-linecap="round"/><circle cx="6" cy="14" r="1.8" fill="#4FA88E"/><circle cx="11" cy="12" r="1.8" fill="#4FA88E"/></svg>`,
    pinguin: `<svg viewBox="0 0 40 40" width="28" height="28"><ellipse cx="20" cy="22" rx="11" ry="15" fill="#241505"/><ellipse cx="20" cy="24" rx="6.5" ry="10" fill="#F5EFE4"/><circle cx="17" cy="15" r="1.6" fill="#241505"/><circle cx="23" cy="15" r="1.6" fill="#241505"/><path d="M18 18 L20 20 L22 18 Z" fill="#F2B84B"/><ellipse cx="10" cy="26" rx="3" ry="5" fill="#241505" transform="rotate(-20 10 26)"/><ellipse cx="30" cy="26" rx="3" ry="5" fill="#241505" transform="rotate(20 30 26)"/><path d="M15 36 L17 33 L20 36 L23 33 L25 36" fill="#F2B84B"/></svg>`,
    igel: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M12 30 Q6 28 8 18 Q10 8 20 8 Q30 8 32 18 Q34 28 28 30 Z" fill="#8B6F47"/><path d="M11 15 L5 10 M14 10 L10 4 M20 8 L19 2 M26 10 L30 4 M29 15 L35 10" stroke="#8B6F47" stroke-width="2" stroke-linecap="round"/><ellipse cx="20" cy="26" rx="10" ry="7" fill="#F5C99A"/><circle cx="16" cy="24" r="1.6" fill="#241505"/><circle cx="24" cy="24" r="1.6" fill="#241505"/><circle cx="20" cy="28" r="1.8" fill="#241505"/></svg>`,
    marienkaefer: `<svg viewBox="0 0 40 40" width="28" height="28"><circle cx="20" cy="21" r="14" fill="#E85F6F"/><path d="M20 7 V35" stroke="#241505" stroke-width="2"/><circle cx="20" cy="10" r="4" fill="#241505"/><circle cx="13" cy="16" r="2.2" fill="#241505"/><circle cx="27" cy="16" r="2.2" fill="#241505"/><circle cx="14" cy="26" r="2.2" fill="#241505"/><circle cx="26" cy="26" r="2.2" fill="#241505"/></svg>`,
    eichhoernchen: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M28 8 Q40 12 34 26 Q30 34 20 30 Q26 24 24 16 Q30 10 28 8 Z" fill="#E8825F"/><circle cx="14" cy="22" r="10" fill="#E8825F"/><circle cx="8" cy="15" r="3.5" fill="#E8825F"/><circle cx="11" cy="19" r="1.5" fill="#241505"/><ellipse cx="18" cy="25" rx="3" ry="2.2" fill="#F5EFE4"/><circle cx="19" cy="25" r="2" fill="#8B6F47"/></svg>`,
    faultier: `<svg viewBox="0 0 40 40" width="28" height="28"><circle cx="20" cy="20" r="15" fill="#C9A876"/><ellipse cx="20" cy="22" rx="9" ry="8" fill="#E8D5B0"/><path d="M14 20 Q16 18 18 20" stroke="#241505" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M22 20 Q24 18 26 20" stroke="#241505" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M17 26 Q20 27 23 26" stroke="#241505" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="10" cy="10" r="3.5" fill="#C9A876"/><circle cx="30" cy="10" r="3.5" fill="#C9A876"/></svg>`,
    einhorn: `<svg viewBox="0 0 40 40" width="28" height="28"><ellipse cx="18" cy="23" rx="12" ry="11" fill="#F5EFE4"/><path d="M18 12 L22 2 L21 13 Z" fill="#F2B84B"/><path d="M10 12 L5 8 M12 9 L9 3" stroke="#E8A6D0" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="22" r="1.8" fill="#241505"/><ellipse cx="9" cy="25" rx="3" ry="4" fill="#F5EFE4"/><path d="M6 15 Q0 18 4 24 Q7 20 10 18" fill="#A594D1"/><path d="M8 13 Q2 17 6 22" fill="#E8A6D0"/></svg>`,
    drache: `<svg viewBox="0 0 40 40" width="28" height="28"><ellipse cx="19" cy="23" rx="12" ry="10" fill="#7BC47F"/><path d="M10 15 L4 9 M14 12 L11 5 M19 11 L19 4" stroke="#4FA88E" stroke-width="2" stroke-linecap="round"/><circle cx="13" cy="21" r="1.8" fill="#241505"/><path d="M28 24 Q36 22 35 28 Q30 30 27 27" fill="#7BC47F"/><path d="M16 28 Q19 31 22 28" stroke="#241505" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M10 26 L4 30 L9 30 Z" fill="#F2B84B"/></svg>`,
    gespenst: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M8 32 V16 Q8 4 20 4 Q32 4 32 16 V32 L27 27 L22 32 L18 27 L13 32 Z" fill="#F5EFE4"/><circle cx="14" cy="16" r="2.2" fill="#241505"/><circle cx="26" cy="16" r="2.2" fill="#241505"/><ellipse cx="20" cy="22" rx="2.5" ry="3" fill="#241505"/></svg>`,
    roboter: `<svg viewBox="0 0 40 40" width="28" height="28"><rect x="8" y="14" width="24" height="18" rx="4" fill="#A594D1"/><circle cx="20" cy="8" r="3" fill="#8B6F47"/><path d="M20 11 V14" stroke="#8B6F47" stroke-width="2"/><circle cx="15" cy="22" r="3" fill="#F5EFE4"/><circle cx="25" cy="22" r="3" fill="#F5EFE4"/><circle cx="15" cy="22" r="1.3" fill="#241505"/><circle cx="25" cy="22" r="1.3" fill="#241505"/><rect x="14" y="27" width="12" height="2.5" rx="1.3" fill="#F5EFE4"/><rect x="2" y="18" width="5" height="3" rx="1.5" fill="#A594D1"/><rect x="33" y="18" width="5" height="3" rx="1.5" fill="#A594D1"/></svg>`,
    wolke: `<svg viewBox="0 0 40 40" width="28" height="28"><path d="M10 24 Q4 24 4 19 Q4 14 10 15 Q10 8 18 8 Q25 8 26 14 Q34 13 34 21 Q34 27 27 27 H11 Q10 27 10 24 Z" fill="#F5EFE4"/><circle cx="15" cy="19" r="1.6" fill="#241505"/><circle cx="24" cy="19" r="1.6" fill="#241505"/><path d="M15 23 Q19 26 24 23" stroke="#241505" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`,
    kaktus: `<svg viewBox="0 0 40 40" width="28" height="28"><rect x="16" y="14" width="8" height="20" rx="4" fill="#7BC47F"/><path d="M16 20 Q8 20 8 26 Q8 30 12 30 H16" fill="#7BC47F"/><path d="M24 17 Q32 17 32 23 Q32 27 28 27 H24" fill="#7BC47F"/><circle cx="18" cy="21" r="1.6" fill="#241505"/><circle cx="22" cy="21" r="1.6" fill="#241505"/><path d="M18 25 Q20 27 22 25" stroke="#241505" stroke-width="1.3" fill="none" stroke-linecap="round"/><ellipse cx="20" cy="35" rx="9" ry="3" fill="#8B6F47"/></svg>`,
  };
  // Zuordnung: normales Tastatur-Emoji -> hauseigener SVG-Sticker-Schlüssel. Nur bei Emojis mit
  // einer echten, eindeutigen Entsprechung — kein SVG-Sticker wird für ein Emoji "erzwungen", das
  // nicht wirklich passt.
  const EMOJI_TO_STICKER = {
    "🦊": "fuchs", "🦉": "eule", "🎓": "doktorhut", "💌": "herzblase", "👍": "daumen",
    "🌻": "sonnenblume", "🚀": "rakete", "⚡": "blitz", "⭐": "stern", "🎵": "note",
    "✅": "haken", "✔️": "haken", "📖": "buch", "📚": "buch", "☕": "kaffee",
    "🎉": "konfetti", "🎯": "ziel", "💬": "sprechblase", "🐼": "panda", "🐱": "katze",
    "🐸": "frosch", "🐝": "biene", "🐌": "schnecke", "🐧": "pinguin", "🦔": "igel",
    "🐞": "marienkaefer", "🐿️": "eichhoernchen", "🦥": "faultier", "🦄": "einhorn",
    "🐉": "drache", "🐲": "drache", "👻": "gespenst", "🤖": "roboter", "☁️": "wolke", "🌵": "kaktus",
  };
  // Ersetzt native Tastatur-Emojis im Text automatisch durch den passenden hauseigenen Sticker
  // (als [sticker:xyz]-Platzhalter, genau wie beim manuellen Antippen eines Stickers) — wird vor
  // dem Speichern/Senden aufgerufen, nicht während des Tippens (sonst würde der Cursor ständig
  // springen).
  function replaceNativeEmojisWithStickers(text) {
    if (!text) return text;
    let result = text;
    Object.entries(EMOJI_TO_STICKER).forEach(([emoji, key]) => {
      result = result.split(emoji).join(`[sticker:${key}]`);
    });
    return result;
  }
  function renderStickerRow() {
    const row = document.getElementById("inboxStickerRow");
    if (!row) return;
    row.innerHTML = Object.entries(DMA_STICKERS).map(([key, svg]) =>
      `<button type="button" class="hobby-chip sticker-pick-btn" data-sticker="${key}" style="padding:4px 8px;" title="[sticker:${key}] in den Text einfügen">${svg}</button>`
    ).join("");
    // Zusätzlich: verdiente Fuchs-Sammelfiguren als kleinere Sticker anbietbar — nur die, die man
    // sich bereits erspielt hat, nicht die gesperrten.
    const foxRow = document.getElementById("inboxFoxStickerRow");
    if (foxRow) {
      const profile = Backend.currentProfile();
      const unlocked = profile ? COLLECTIBLE_FIGURES.filter((fig) => isFigureUnlocked(fig, profile)) : [];
      foxRow.innerHTML = unlocked.map((fig) =>
        `<button type="button" class="hobby-chip fox-sticker-pick-btn" data-fox="${fig.id}" style="padding:2px 4px;" title="${fig.name} in den Text einfügen"><img src="${fig.img}" alt="${fig.name}" style="width:22px; height:22px; object-fit:contain; vertical-align:middle;" /></button>`
      ).join("");
      foxRow.querySelectorAll("[data-fox]").forEach((btn) => {
        btn.addEventListener("click", () => insertMessageToken(`[fox:${btn.dataset.fox}]`));
      });
    }
    // Klick fügt den Sticker-Platzhalter direkt an der aktuellen Cursor-Position im Textfeld ein
    // (wie ein normaler Emoji-Einschub) — so können mehrere Sticker an beliebigen Stellen im Text
    // verteilt werden, statt nur EINEN auswählen zu können, der am Ende angehängt wird.
    row.querySelectorAll("[data-sticker]").forEach((btn) => {
      btn.addEventListener("click", () => insertMessageToken(`[sticker:${btn.dataset.sticker}]`));
    });
  }
  function insertMessageToken(token) {
    const textarea = document.getElementById("inboxMessageInput");
    if (!textarea) return;
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    textarea.value = textarea.value.slice(0, start) + token + textarea.value.slice(end);
    const newPos = start + token.length;
    textarea.focus();
    textarea.setSelectionRange(newPos, newPos);
    textarea.dispatchEvent(new Event("input", { bubbles: true })); // löst Entwurf-Speicherung mit aus
  }

  let inboxViewTab = "in"; // "in" oder "out"
  // Welche Nachrichten gerade AUFGEKLAPPT sind — beim Betreten des Postfachs (siehe
  // enterInboxTab) neu befüllt mit genau den Nachrichten, die zu diesem Zeitpunkt ungelesen
  // waren. Alle anderen (auch früher schon gelesene) starten kompakt/zugeklappt, damit die
  // Übersicht nicht durch lauter aufgeklappten Alt-Text unübersichtlich wird — nur echte, neue
  // Nachrichten fallen sofort auf. Bleibt über renderInbox()-Aufrufe INNERHALB des Postfachs
  // (z. B. nach dem Löschen einer Nachricht) erhalten — nur ein erneutes BETRETEN setzt sie
  // zurück.
  let inboxExpandedIds = new Set();
  let inboxEverEntered = false;
  const communityTextLevelChoice = {}; // { textId: "A1" | "A2" | ... } — welches Niveau gerade angezeigt wird, bei Texten mit "Alle Niveaus"
  function getImportantMsgIds() {
    const profile = Backend.currentProfile();
    return (profile && profile.extraProfileData && profile.extraProfileData.importantMsgIds) || [];
  }
  function toggleImportantMsg(id) {
    const ids = new Set(getImportantMsgIds());
    if (ids.has(id)) ids.delete(id); else ids.add(id);
    Backend.updateExtraProfileField("importantMsgIds", [...ids]);
  }
  function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  // WICHTIG — behebt den gemeldeten Bug: echte, vom Nutzer selbst getippte Emojis (nicht die
  // [sticker:xxx]/[fox:xxx]-Platzhalter, die schon eigene Größen haben) erbten bisher die
  // native, teils sehr große System-Emoji-Darstellung und ließen kurze Nachrichten unnötig viele
  // Zeilen beanspruchen. \p{Extended_Pictographic} erkennt Emoji-Zeichen im Text (ohne die
  // Platzhalter-Syntax zu berühren, die nur eckige Klammern und Buchstaben enthält) und wickelt
  // sie in ein <span> mit relativ kleinerer Schriftgröße — der umgebende Text bleibt unverändert.
  function shrinkInlineEmojis(text) {
    return text.replace(/\p{Extended_Pictographic}/gu, (e) => `<span style="font-size:0.8em;">${e}</span>`);
  }
  async function renderInbox(isEntering) {
    const area = document.getElementById("inboxArea");
    if (!Backend.currentUser()) { area.innerHTML = '<p class="empty-note">Bitte zuerst anmelden.</p>'; return; }
    const [messages, friends] = await Promise.all([Backend.getMyMessages(), Backend.getFriends()]);
    // Beim BETRETEN des Postfachs (nicht bei jedem internen renderInbox()-Aufruf, z. B. nach dem
    // Löschen einer Nachricht) den aufgeklappt-Zustand neu setzen: nur die gerade noch
    // ungelesenen Nachrichten starten offen, alles andere kompakt — genau wie gewünscht.
    if (isEntering || !inboxEverEntered) {
      inboxEverEntered = true;
      inboxExpandedIds = new Set(messages.inbox.filter((m) => !m.read).map((m) => m.id));
    }
    const isAdmin = Backend.canModerate ? Backend.canModerate() : false;
    const list = inboxViewTab === "in" ? messages.inbox : inboxViewTab === "out" ? messages.outbox : [...messages.inbox, ...messages.outbox].filter((m) => getImportantMsgIds().includes(m.id));
    area.innerHTML = `
      <div class="question-card">
        <h3>✉️ Neue Nachricht schreiben</h3>
        <div class="form-field">
          <label class="empty-note" style="display:block; margin-bottom:8px;">An wen?</label>
          <div class="order-toggle" id="inboxRecipientMode" style="margin-bottom:10px;">
            <button type="button" class="order-pill" data-recipient-mode="select" aria-selected="true">👤 Bestimmte Personen</button>
            ${isAdmin ? `<button type="button" class="order-pill" data-recipient-mode="broadcast" aria-selected="false">📢 Rundmail an alle</button>` : ""}
          </div>
          <div id="inboxRecipientListWrap">
            <input type="text" class="vocab-search" id="inboxRecipientSearch" placeholder="Freund suchen…" style="margin-bottom:8px;" />
            <div id="inboxRecipientList" style="max-height:220px; overflow-y:auto; border:1px solid rgba(0,0,0,0.08); border-radius:var(--radius-sm); padding:4px;">
              ${Backend.canModerate() ? `<label class="checkbox-list-row"><input type="checkbox" data-recipient-id="${Backend.currentUser()?.id}" /> <span>🔧 Ich selbst (für Punkte-Korrekturen am eigenen Konto)</span></label>` : ""}
              ${friends.map((f) => `<label class="checkbox-list-row"><input type="checkbox" data-recipient-id="${f.id}" /> <span>${f.name}</span></label>`).join("") || '<p class="empty-note" style="padding:8px;">Noch keine Freunde — oben nach Namen suchen.</p>'}
            </div>
          </div>
          <p class="empty-note" id="inboxBroadcastNote" style="display:none; margin-top:6px;">📢 Diese Nachricht geht an <strong>alle</strong> Nutzer der Seite — keine einzelne Auswahl nötig.</p>
        </div>
        ${Backend.canModerate() ? `
        <div class="form-field question-card" style="border:2px solid var(--amber-400); padding:12px;">
          <label class="empty-note" style="display:flex; justify-content:space-between; align-items:center;">
            <span>🎁 Punkte mitschicken (optional) — auch Korrekturen als negativer Wert</span>
            <strong id="pointsGiftValueLabel" style="color:var(--amber-500,#c98a1f);">0 Punkte</strong>
          </label>
          <input type="range" id="pointsGiftSlider" min="-500" max="500" step="10" value="0" style="width:100%; margin-top:6px;" />
          <label class="empty-note" style="display:block; margin-top:8px;">Grund (füllt die Nachricht automatisch aus, danach noch anpassbar):</label>
          <select id="pointsReasonSelect" style="width:100%; margin-top:4px; padding:8px; border-radius:8px; border:1px solid var(--border-color,#ddd);">
            <option value="">— eigenen Text schreiben —</option>
            ${POINTS_REASON_TEMPLATES.map((r) => `<option value="${r.text.replace(/"/g, "&quot;")}">${r.label}</option>`).join("")}
          </select>
          <p class="empty-note" style="font-size:0.74rem; margin-top:4px;">In 10er-Schritten von −500 bis 500 — z. B. als Entschädigung, Belohnung, oder um versehentlich vergebene Punkte wieder zu korrigieren. Die Person bekommt automatisch eine erklärende Nachricht dazu. Vor dem Versenden erscheint zur Sicherheit noch eine Bestätigung.</p>
        </div>` : ""}
        <div class="form-field">
          <textarea id="inboxMessageInput" class="guestbook-form-textarea" maxlength="500" placeholder="Deine Nachricht…"></textarea>
        </div>
        <div class="form-field">
          <label class="empty-note" style="cursor:pointer;">📷 Bild anhängen (optional) <input type="file" id="inboxImageInput" accept="image/*" style="display:block; margin-top:4px;" /></label>
          <div id="inboxImagePreviewBox"></div>
        </div>
        <div class="form-field">
          <label class="empty-note">Eigene Sticker antippen, um sie an der Cursor-Position in den Text einzufügen (optional):</label>
          <div id="inboxStickerRow" style="display:flex; gap:8px; margin-top:6px; flex-wrap:wrap;"></div>
          <div id="inboxFoxStickerRow" style="display:flex; gap:6px; margin-top:8px; flex-wrap:wrap;"></div>
        </div>
        <button type="button" class="btn btn-coffee" id="inboxSendBtn">Senden</button>
        <div class="form-error" id="inboxSendError"></div>
      </div>
      <div class="question-card" style="margin-top:14px;">
        <div class="order-toggle" style="margin-bottom:12px;">
          <button type="button" class="order-pill" id="inboxTabIn" aria-selected="${inboxViewTab === "in"}">📥 Posteingang${messages.inbox.length ? ` (${messages.inbox.length})` : ""}</button>
          <button type="button" class="order-pill" id="inboxTabOut" aria-selected="${inboxViewTab === "out"}">📤 Postausgang${messages.outbox.length ? ` (${messages.outbox.length})` : ""}</button>
          <button type="button" class="order-pill" id="inboxTabImportant" aria-selected="${inboxViewTab === "important"}">⭐ Wichtig${getImportantMsgIds().length ? ` (${getImportantMsgIds().length})` : ""}</button>
        </div>
        ${list.length ? `<button type="button" class="btn btn-ghost" id="inboxDownloadAllBtn" style="margin-bottom:10px;">⬇️ Diese Ansicht als Text herunterladen</button>` : ""}
        ${list.length ? list.map((m) => {
          const isExpanded = inboxExpandedIds.has(m.id);
          const senderLabel = inboxViewTab === "out" ? "An: " + (m.to_user_name || "Freund") : (m.is_system ? "🔔 System" : (m.author_name || "Unbekannt"));
          const timeLabel = m.created_at ? new Date(m.created_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "";
          if (!isExpanded) {
            // Kompakte Zeile: nur Absender, Zeit und ein kurzer Textausschnitt — antippen klappt
            // sie auf. Macht die Übersicht deutlich kürzer, wenn viele Nachrichten schon gelesen
            // sind, statt dass man sich durch lauter ausgeklappte Alt-Nachrichten scrollen muss.
            const preview = m.body.replace(/^\[BETA_REQUEST\]\s*/, "").replace(/\[BETA_JUMP:[\w-]+\]/, "")
              // WICHTIG — vorher wurde JEDER Sticker/jedes Fox-Bild durch dasselbe generische
              // 🏷️-Symbol ersetzt, das in der Vorschau winzig und nichtssagend wirkte. Jetzt
              // erscheint der tatsächliche, kleine SVG-Sticker bzw. ein kleines Fox-Vorschaubild,
              // damit man auch in der Kompaktansicht direkt erkennt, was in der Nachricht steckt.
              .replace(/\[sticker:(\w+)\]/g, (_, key) => DMA_STICKERS[key] ? `<span style="display:inline-block; vertical-align:middle; width:24px; height:24px; overflow:hidden;">${DMA_STICKERS[key]}</span>` : "🏷️")
              .replace(/\[fox:([\w-]+)\]/g, (_, id) => { const fig = COLLECTIBLE_FIGURES.find((f) => f.id === id); return fig ? `<img src="${fig.img}" alt="" style="width:24px; height:24px; object-fit:contain; vertical-align:middle; display:inline-block;" />` : "🦊"; })
              .trim();
            return `
          <button type="button" class="breakdown-row inbox-row-compact" data-msg-expand="${m.id}" style="width:100%; text-align:left; align-items:flex-start; flex-direction:column; gap:2px; cursor:pointer; background:none; border:none; ${inboxViewTab === "in" && !m.read ? "border-left:3px solid var(--amber-400); padding-left:10px;" : ""}">
            <div style="display:flex; justify-content:space-between; width:100%;">
              <strong>${senderLabel}</strong>
              <span class="empty-note">${timeLabel}</span>
            </div>
            <p class="empty-note" style="margin:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:100%;">${preview}</p>
          </button>`;
          }
          return `
          <div class="breakdown-row" data-msg-row="${m.id}" style="align-items:flex-start; flex-direction:column; gap:4px; ${inboxViewTab === "in" && !m.read ? "border-left:3px solid var(--amber-400); padding-left:10px;" : ""}">
            <button type="button" data-msg-collapse="${m.id}" style="display:flex; justify-content:space-between; width:100%; background:none; border:none; cursor:pointer; padding:0;">
              <strong>${senderLabel}</strong>
              <span class="empty-note">${timeLabel} 🔽</span>
            </button>
            <p style="white-space:pre-wrap; margin:0;">${shrinkInlineEmojis(m.body
              .replace(/^\[BETA_REQUEST\]\s*/, "")
              .replace(/\n?\[BETA_JUMP:[\w-]+\]/, ""))
              .replace(/\[sticker:(\w+)\]/g, (_, key) => DMA_STICKERS[key] ? `<span style="display:inline-block; vertical-align:middle;">${DMA_STICKERS[key]}</span>` : "")
              .replace(/\[fox:([\w-]+)\]/g, (_, id) => { const fig = COLLECTIBLE_FIGURES.find((f) => f.id === id); return fig ? `<img src="${fig.img}" alt="${fig.name}" style="width:44px; height:44px; object-fit:contain; vertical-align:middle; display:inline-block;" />` : ""; })
            }</p>
            ${m.image_url ? `<img src="${m.image_url}" style="max-width:200px; border-radius:10px; margin-top:4px; cursor:pointer;" data-modal-view-photo="${m.image_url}" />` : ""}
            ${(() => {
              const jumpMatch = m.body.match(/\[BETA_JUMP:([\w-]+)\]/);
              return jumpMatch ? `<button type="button" class="btn btn-coffee" style="padding:6px 14px; font-size:0.8rem; margin-top:2px;" data-jump-to="${jumpMatch[1]}">🧪 Direkt hinspringen und mittesten</button>` : "";
            })()}
            ${inboxViewTab === "in" && m.body.startsWith("[BETA_REQUEST]") && m.from_user && Backend.canModerate && Backend.canModerate() ? `
            <div style="display:flex; gap:8px; margin-top:2px;">
              <button type="button" class="btn btn-coffee" style="padding:6px 14px; font-size:0.8rem;" data-approve-beta="${m.from_user}" data-approve-beta-name="${m.author_name || "Diese Person"}">🧪 Als Beta-Tester:in bestätigen</button>
            </div>` : ""}
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              ${inboxViewTab === "in" && !m.is_system && m.from_user ? `<button type="button" class="btn btn-ghost" style="padding:4px 12px; font-size:0.78rem; margin-top:2px;" data-reply-to="${m.from_user}" data-reply-name="${m.author_name}">↩️ Antworten</button>` : ""}
              <button type="button" class="btn btn-ghost" style="padding:4px 12px; font-size:0.78rem; margin-top:2px;" data-toggle-important="${m.id}">${getImportantMsgIds().includes(m.id) ? "⭐ Wichtig" : "☆ Als wichtig markieren"}</button>
              <button type="button" class="btn btn-ghost" style="padding:4px 12px; font-size:0.78rem; margin-top:2px;" data-download-msg="${m.id}">⬇️ Text</button>
              <button type="button" class="btn btn-ghost" style="padding:4px 12px; font-size:0.78rem; margin-top:2px;" data-delete-msg="${m.id}" data-is-sender="${inboxViewTab === "out"}">🗑️ Löschen</button>
            </div>
          </div>`;
        }).join("") : `<p class="empty-note">${inboxViewTab === "important" ? "Noch keine Nachrichten als wichtig markiert." : inboxViewTab === "in" ? "Noch keine Nachrichten — hier erscheinen auch automatische Zusammenfassungen, nachdem du eine Übungsrunde gespielt hast." : "Du hast noch nichts verschickt."}</p>`}
      </div>
    `;
    renderStickerRow();
    let selectedRecipients = new Set();
    let recipientMode = "select"; // "select" | "broadcast"
    // Entwurf wiederherstellen, falls beim letzten Mal etwas Angefangenes da war — im Profil
    // gespeichert, damit er auch bei einem Geräte-/Browser-Wechsel erhalten bleibt.
    const draft = (Backend.currentProfile()?.extraProfileData || {}).msgDraft;
    if (draft) {
      if (Array.isArray(draft.to)) selectedRecipients = new Set(draft.to);
      else if (draft.to) selectedRecipients = new Set([draft.to]); // alte Entwürfe (nur eine Person) weiterhin lesbar
      if (draft.body) document.getElementById("inboxMessageInput").value = draft.body;
    }
    const refreshRecipientChecks = () => {
      area.querySelectorAll("[data-recipient-id]").forEach((cb) => {
        cb.checked = selectedRecipients.has(cb.dataset.recipientId);
      });
    };
    refreshRecipientChecks();
    const draftSave = () => {
      const to = [...selectedRecipients];
      const body = document.getElementById("inboxMessageInput").value;
      if (to.length || body) Backend.updateExtraProfileField("msgDraft", { to, body });
      else Backend.updateExtraProfileField("msgDraft", null);
    };
    // Klares Entweder-Oder: entweder bestimmte Personen auswählen ODER eine Rundmail an alle —
    // beim Wechsel wird die Personen-Liste ein-/ausgeblendet, damit nie unklar ist, welcher Modus
    // gerade aktiv ist.
    document.querySelectorAll("#inboxRecipientMode [data-recipient-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        recipientMode = btn.dataset.recipientMode;
        document.querySelectorAll("#inboxRecipientMode [data-recipient-mode]").forEach((b) => {
          b.setAttribute("aria-selected", String(b === btn));
        });
        document.getElementById("inboxRecipientListWrap").style.display = recipientMode === "select" ? "" : "none";
        document.getElementById("inboxBroadcastNote").style.display = recipientMode === "broadcast" ? "" : "none";
      });
    });
    area.querySelectorAll("[data-recipient-id]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const id = cb.dataset.recipientId;
        if (cb.checked) selectedRecipients.add(id); else selectedRecipients.delete(id);
        draftSave();
      });
    });
    const recipientSearch = document.getElementById("inboxRecipientSearch");
    if (recipientSearch) recipientSearch.addEventListener("input", () => {
      const q = recipientSearch.value.trim().toLowerCase();
      area.querySelectorAll(".checkbox-list-row").forEach((row) => {
        const name = row.querySelector("span").textContent.toLowerCase();
        row.style.display = name.includes(q) ? "" : "none";
      });
    });
    document.getElementById("inboxMessageInput").addEventListener("input", draftSave);
    let pendingImageUrl = "";
    const imgInput = document.getElementById("inboxImageInput");
    if (imgInput) {
      imgInput.addEventListener("change", async () => {
        const file = imgInput.files[0];
        if (!file) return;
        const previewBox = document.getElementById("inboxImagePreviewBox");
        previewBox.innerHTML = '<p class="empty-note">Lädt hoch…</p>';
        try {
          pendingImageUrl = await Backend.uploadCommunityTextCover(file);
          previewBox.innerHTML = `<img src="${pendingImageUrl}" style="max-width:120px; border-radius:8px; margin-top:6px;" />`;
        } catch (err) {
          previewBox.innerHTML = `<p class="form-error">⚠️ ${err.message}</p>`;
        }
      });
    }
    const pointsSlider = document.getElementById("pointsGiftSlider");
    if (pointsSlider) {
      pointsSlider.addEventListener("input", () => {
        document.getElementById("pointsGiftValueLabel").textContent = `${pointsSlider.value} Punkte`;
      });
    }
    document.getElementById("pointsReasonSelect")?.addEventListener("change", (e) => {
      if (e.target.value) document.getElementById("inboxMessageInput").value = e.target.value;
    });
    document.getElementById("inboxSendBtn").addEventListener("click", async () => {
      const isBroadcast = recipientMode === "broadcast";
      // Native Tastatur-Emojis (z. B. 🦉, 👍) automatisch durch den passenden hauseigenen
      // Sticker ersetzen, bevor die Nachricht überhaupt verschickt wird.
      const body = replaceNativeEmojisWithStickers(document.getElementById("inboxMessageInput").value);
      const giftPoints = pointsSlider ? Number(pointsSlider.value) : 0;
      const errBox = document.getElementById("inboxSendError");
      if (!isBroadcast && selectedRecipients.size === 0) { errBox.textContent = "⚠️ Bitte mindestens eine Person auswählen."; return; }
      try {
        // Sticker stehen jetzt schon als Platzhalter direkt im Text selbst (mitten drin einfügbar),
        // deshalb muss hier nichts mehr zusätzlich angehängt werden.
        if (isBroadcast) {
          if (!confirm("Wirklich eine Rundmail an ALLE Nutzer schicken?")) return;
          await Backend.sendBroadcastMessage(body);
        } else {
          // An alle ausgewählten Personen gleichzeitig verschicken -- dieselbe Nachricht, jeweils
          // als eigene, echte Nachricht an jede Person (nicht nur eine Kopie sichtbar für alle).
          await Promise.all([...selectedRecipients].map((id) => Backend.sendPrivateMessage(id, body, pendingImageUrl)));
          if (giftPoints !== 0) {
            // Sicherheitsabfrage vor jeder Punkteänderung — ein Regler kann auf einem Touch-
            // Bildschirm leicht unbeabsichtigt verschoben werden (z. B. beim Scrollen), und ohne
            // diese Bestätigung würde eine solche versehentliche Berührung sofort echte Punkte an
            // reale Konten verschicken, ohne dass es dem Absender auffällt.
            const verb = giftPoints > 0 ? "verschenken" : "abziehen (korrigieren)";
            if (!confirm(`Wirklich ${Math.abs(giftPoints)} Punkte bei ${selectedRecipients.size} Person(en) ${verb}?`)) {
              renderInbox();
              return;
            }
            await Promise.all([...selectedRecipients].map((id) => Backend.adminGrantPoints(id, giftPoints, body)));
            showToast(giftPoints > 0 ? `🎁 ${giftPoints} Punkte an ${selectedRecipients.size} Person(en) verschenkt!` : `⚖️ ${Math.abs(giftPoints)} Punkte bei ${selectedRecipients.size} Person(en) korrigiert.`);
          }
        }
        renderInbox();
        Backend.updateExtraProfileField("msgDraft", null);
      } catch (err) {
        errBox.textContent = "⚠️ " + err.message;
      }
    });
    area.querySelectorAll("[data-reply-to]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.replyTo;
        const checkbox = area.querySelector(`[data-recipient-id="${targetId}"]`);
        if (checkbox) { selectedRecipients = new Set([targetId]); refreshRecipientChecks(); }
        document.getElementById("inboxMessageInput").focus();
        document.getElementById("inboxMessageInput").scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
    area.querySelectorAll("[data-modal-view-photo]").forEach((img) => {
      img.addEventListener("click", () => openGallerySlideshow([img.dataset.modalViewPhoto], 0, "Foto"));
    });
    document.getElementById("inboxTabIn").addEventListener("click", () => { inboxViewTab = "in"; renderInbox(); });
    document.getElementById("inboxTabOut").addEventListener("click", () => { inboxViewTab = "out"; renderInbox(); });
    document.getElementById("inboxTabImportant").addEventListener("click", () => { inboxViewTab = "important"; renderInbox(); });
    area.querySelectorAll("[data-msg-expand]").forEach((btn) => {
      btn.addEventListener("click", () => { inboxExpandedIds.add(btn.dataset.msgExpand); renderInbox(); });
    });
    area.querySelectorAll("[data-msg-collapse]").forEach((btn) => {
      btn.addEventListener("click", () => { inboxExpandedIds.delete(btn.dataset.msgCollapse); renderInbox(); });
    });
    // Wie gewünscht: ein Klick IRGENDWO innerhalb einer aufgeklappten Nachricht soll sie wieder
    // schließen — nicht nur auf den kleinen Kopfbereich oben. Klicks auf interaktive Elemente
    // (Antworten, Löschen, Bild vergrößern, Sprung-Knopf usw.) lösen das Zuklappen NICHT aus,
    // sonst könnte man diese Aktionen nie mehr auslösen, ohne die Nachricht versehentlich zu
    // schließen. Der Kopfbereich selbst hat schon einen eigenen data-msg-collapse-Handler (oben) —
    // dieser hier fängt zusätzlich Klicks auf den restlichen Fließtext-Bereich der Nachricht ab.
    area.querySelectorAll("[data-msg-row]").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest("button, a, img, input")) return;
        inboxExpandedIds.delete(row.dataset.msgRow);
        renderInbox();
      });
    });
    area.querySelectorAll("[data-toggle-important]").forEach((btn) => {
      btn.addEventListener("click", () => { toggleImportantMsg(btn.dataset.toggleImportant); renderInbox(); });
    });
    area.querySelectorAll("[data-jump-to]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const subId = btn.dataset.jumpTo;
        // Den passenden Unterreiter-Knopf irgendwo im Menü finden (er weiß selbst, zu welchem
        // Hauptbereich er gehört) — dort zuerst auf den Hauptreiter, dann auf den Unterreiter
        // klicken, damit man direkt bei genau dem Beta-Feature landet, das gerade getestet wird.
        const subPill = document.querySelector(`.subnav-pill[data-sub="${subId}"]`);
        if (!subPill) { showToast("⚠️ Dieser Bereich wurde nicht gefunden — evtl. inzwischen umbenannt."); return; }
        const navId = subPill.closest("[id$='Subnav']")?.id;
        const mainTabTarget = navId === "learnSubnav" ? "view-learn" : navId === "knowledgeSubnav" ? "view-knowledge" : navId === "profileSubnav" ? "view-profile" : null;
        if (mainTabTarget) {
          document.querySelector(`[data-target="${mainTabTarget}"]`)?.click();
        }
        setTimeout(() => subPill.click(), 150);
      });
    });
    area.querySelectorAll("[data-approve-beta]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await Backend.setBetaTesterStatus(btn.dataset.approveBeta, true);
          await Backend.sendSystemMessage(btn.dataset.approveBeta, "🧪 Du wurdest als Beta-Tester:in bestätigt! Du siehst jetzt neue Funktionen, bevor sie für alle freigegeben werden — probier sie gern aus und gib Rückmeldung.");
          showToast(`🧪 ${btn.dataset.approveBetaName} ist jetzt Beta-Tester:in!`);
          renderInbox();
        } catch (e) { alert(e.message || "Konnte nicht bestätigt werden."); }
      });
    });
    area.querySelectorAll("[data-download-msg]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const msg = list.find((m) => m.id === btn.dataset.downloadMsg);
        if (!msg) return;
        const who = inboxViewTab === "out" ? `An: ${msg.to_user_name || "Freund"}` : (msg.is_system ? "System" : (msg.author_name || "Unbekannt"));
        const when = msg.created_at ? new Date(msg.created_at).toLocaleString("de-DE") : "";
        downloadTextFile(`nachricht-${msg.id.slice(0, 8)}.txt`, `${who}\n${when}\n\n${msg.body}`);
      });
    });
    const downloadAllBtn = document.getElementById("inboxDownloadAllBtn");
    if (downloadAllBtn) {
      downloadAllBtn.addEventListener("click", () => {
        const combined = list.map((m) => {
          const who = inboxViewTab === "out" ? `An: ${m.to_user_name || "Freund"}` : (m.is_system ? "System" : (m.author_name || "Unbekannt"));
          const when = m.created_at ? new Date(m.created_at).toLocaleString("de-DE") : "";
          return `${who} — ${when}\n${m.body}`;
        }).join("\n\n---\n\n");
        downloadTextFile(`postfach-${inboxViewTab}.txt`, combined);
      });
    }
    area.querySelectorAll("[data-delete-msg]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Diese Nachricht wirklich löschen? (Nur bei dir — beim Gegenüber bleibt sie sichtbar.)")) return;
        await Backend.deletePrivateMessage(btn.dataset.deleteMsg, btn.dataset.isSender === "true");
        renderInbox();
      });
    });
    const unreadIds = messages.inbox.filter((m) => !m.read).map((m) => m.id);
    if (unreadIds.length) await Backend.markMessagesRead(unreadIds);
  }

  let friendFilterMode = "all"; // "all", "online" oder "best"
  async function renderFriends() {
    const area = document.getElementById("friendsArea");
    const user = Backend.currentUser();
    if (!user) {
      area.innerHTML = `<p class="empty-note">Melde dich im Reiter „Profil" an, um Freunde zu finden und herauszufordern.</p>`;
      return;
    }
    area.innerHTML = `<p class="empty-note">Lade …</p>`;

    const [friends, incoming, { incoming: incomingChallenges, outgoing: outgoingChallenges }] = await Promise.all([
      Backend.getFriends(),
      Backend.getIncomingRequests(),
      Backend.getMyChallenges(),
    ]);

    area.innerHTML = `
      <div class="question-card">
        <h3>🔎 Freunde finden</h3>
        <div class="vocab-toolbar" style="margin-top:10px;">
          <input type="text" class="vocab-search" id="friendSearch" placeholder="Name eingeben…" />
        </div>
        <div id="friendSearchResults"></div>
        <p class="empty-note" style="margin-top:8px;">${Backend.isConfigured ? "Suche findet alle registrierten Nutzer." : "Demo-Modus: Suche findet nur Konten, die in dieser Sitzung schon registriert wurden."}</p>
      </div>
      <div class="question-card" style="margin-top:14px; border:2px solid var(--amber-400);">
        <h3>🔗 Freund:innen einladen</h3>
        <p class="empty-note" style="margin-bottom:10px;">Teil deinen persönlichen Link — meldet sich jemand darüber an, bekommt ihr <strong>beide 25 Bonuspunkte</strong>.</p>
        <button type="button" class="btn btn-coffee" id="friendsShareBtn">🔗 Meinen Empfehlungs-Link teilen</button>
      </div>

      ${incoming.length ? `<div class="question-card" style="margin-top:14px;">
        <h3>📥 Freundschaftsanfragen</h3>
        ${incoming.map((r) => `<div class="breakdown-row"><span>${r.name}</span><div style="display:flex; gap:6px;"><button type="button" class="btn btn-coffee" data-accept="${r.id}">Annehmen</button><button type="button" class="btn btn-ghost" data-decline="${r.id}">Ablehnen</button></div></div>`).join("")}
      </div>` : ""}

      ${incomingChallenges.length ? `<div class="question-card" style="margin-top:14px;">
        <h3>🎮 Herausforderungen an dich</h3>
        ${incomingChallenges.map((c) => {
          const specialLabels = { memory: "🧠 Gehirnjogger", wortbaustelle: "🔤 Wortbaustelle", buchstabensalat: "🔍 Buchstabensalat", kreuzwortraetsel: "✏️ Kreuzworträtsel", betonungstrainer: "🎯 Betonungs-Trainer" };
          const label = specialLabels[c.categories[0]] || c.categories.map((id) => ExerciseData.getCategory(id)?.icon || "❓").join(" ");
          return `<div class="breakdown-row"><span>${c.fromName} · ${label}</span><button type="button" class="btn btn-coffee" data-accept-challenge="${c.id}" data-cats="${c.categories.join(",")}" data-from-name="${c.fromName}">Annehmen</button></div>`;
        }).join("")}
      </div>` : ""}

      <div class="question-card" style="margin-top:14px;">
        <h3>👥 Deine Freunde <span class="empty-note" style="font-weight:400; font-size:0.78rem;">(${friends.length})</span></h3>
        ${friends.length > 8 ? `
        <div class="order-toggle" style="margin-bottom:12px; flex-wrap:wrap;">
          <button type="button" class="order-pill friend-filter-pill" data-filter="all" aria-selected="${friendFilterMode === "all"}">Alle</button>
          <button type="button" class="order-pill friend-filter-pill" data-filter="online" aria-selected="${friendFilterMode === "online"}">🟢 Online</button>
          <button type="button" class="order-pill friend-filter-pill" data-filter="best" aria-selected="${friendFilterMode === "best"}">⭐ Beste Freunde</button>
        </div>` : ""}
        ${(() => {
          const bestIds = Backend.getBestFriendIds();
          const filtered = friends.filter((f) => friendFilterMode === "online" ? f.online : friendFilterMode === "best" ? bestIds.includes(f.id) : true);
          if (!filtered.length) return `<p class="empty-note">${friendFilterMode === "online" ? "Gerade niemand online." : friendFilterMode === "best" ? "Noch keine besten Freunde markiert — Stern antippen." : "Noch keine Freunde — oben nach Namen suchen."}</p>`;
          return filtered.map((f) => `
          <div class="breakdown-row">
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" class="friend-bulk-check" data-bulk-friend="${f.id}" data-bulk-name="${f.name}" />
              <button type="button" class="best-friend-star-btn" data-toggle-best="${f.id}" title="Als beste:r Freund:in markieren" style="background:none; border:none; cursor:pointer; font-size:1rem; padding:0 2px;">${bestIds.includes(f.id) ? "⭐" : "☆"}</button>
              <div>
                <button type="button" class="friend-name-btn" data-view-friend-profile="${f.id}">${f.online ? '<span class="online-dot"></span>' : ""}${f.name} · ${f.points} Pkt.${adminBadge(f.is_admin, f.is_owner, f.is_moderator)}</button>
                <div class="empty-note" style="font-size:0.72rem; margin-top:2px;">${lastSeenText(f.last_active, f.online)}</div>
              </div>
            </div>
            <button type="button" class="btn btn-ghost" data-challenge="${f.id}" data-name="${f.name}">🎮 Herausfordern</button>
          </div>`).join("");
        })()}
        ${friends.length ? `<button type="button" class="btn btn-coffee" id="bulkChallengeBtn" style="margin-top:10px; display:none;">🎮 Ausgewählte herausfordern</button>` : ""}
      </div>

      ${outgoingChallenges.length ? `<div class="question-card" style="margin-top:14px;">
        <h3>📤 Deine Duelle</h3>
        ${outgoingChallenges.map((c) => `<div class="breakdown-row">
          <span>${c.status !== "completed" ? `<input type="checkbox" class="cancel-challenge-check" data-cancel-id="${c.id}" style="margin-right:8px;" />` : ""}vs. ${c.toName}</span>
          <span class="empty-note">${c.status === "completed" ? (c.winner ? (c.winner === c.from ? "🏆 Gewonnen" : "Verloren") : "🤝 Unentschieden") : "Warte auf Gegner…"}</span>
        </div>`).join("")}
        ${outgoingChallenges.some((c) => c.status !== "completed") ? `<button type="button" class="btn btn-ghost" id="cancelSelectedChallengesBtn" style="margin-top:10px;">Ausgewählte zurückrufen</button>` : ""}
      </div>` : ""}

      <div id="challengePicker"></div>
    `;

    const cancelSelectedBtn = document.getElementById("cancelSelectedChallengesBtn");
    if (cancelSelectedBtn) {
      cancelSelectedBtn.addEventListener("click", async () => {
        const ids = [...area.querySelectorAll(".cancel-challenge-check:checked")].map((c) => c.dataset.cancelId);
        if (!ids.length) { alert("Bitte mindestens ein Duell auswählen."); return; }
        if (!confirm(`${ids.length} ${ids.length === 1 ? "Herausforderung" : "Herausforderungen"} wirklich zurückrufen?`)) return;
        const scrollY = window.scrollY;
        for (const id of ids) {
          try { await Backend.cancelChallenge(id); } catch (err) { console.warn(err); }
        }
        await renderFriends();
        window.scrollTo(0, scrollY);
      });
    }

    document.getElementById("friendsShareBtn")?.addEventListener("click", shareReferralLink);
    let searchTimer = null;
    document.getElementById("friendSearch").addEventListener("input", (e) => {
      clearTimeout(searchTimer);
      const q = e.target.value;
      searchTimer = setTimeout(async () => {
        const results = await Backend.searchUsers(q);
        document.getElementById("friendSearchResults").innerHTML = results.length
          ? results.map((r) => `<div class="breakdown-row"><button type="button" class="friend-name-btn" data-view-search-result="${r.id}">${r.name}</button><button type="button" class="btn btn-ghost" data-add="${r.id}">+ Freund werden</button></div>`).join("")
          : (q.trim() ? '<p class="empty-note">Niemand gefunden.</p>' : "");
        area.querySelectorAll("[data-add]").forEach((btn) => {
          btn.addEventListener("click", async () => {
            try { await Backend.sendFriendRequest(btn.dataset.add); btn.textContent = "Angefragt ✓"; btn.disabled = true; }
            catch (err) { alert(err.message); }
          });
        });
        area.querySelectorAll("[data-view-search-result]").forEach((btn) => {
          btn.addEventListener("click", () => openProfileModal(btn.dataset.viewSearchResult));
        });
      }, 250);
    });

    area.querySelectorAll("[data-accept]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await Backend.acceptFriendRequest(btn.dataset.accept);
        // Gecachte Freundeszahl aktualisieren — für die "friends_count"-Freischalt-Bedingung bei
        // Sammelfiguren, die synchron geprüft wird und daher keine eigene Datenbankabfrage machen
        // kann. Wird hier nachgezogen, sobald sich die Freundesliste tatsächlich ändert.
        try {
          const friends = await Backend.getFriends();
          await Backend.updateExtraProfileField("friendsCountCache", friends.length);
        } catch (e) { console.warn("Freundeszahl-Cache konnte nicht aktualisiert werden:", e); }
        checkNotifications();
        renderFriends();
      });
    });
    area.querySelectorAll("[data-decline]").forEach((btn) => {
      btn.addEventListener("click", async () => { await Backend.declineFriendRequest(btn.dataset.decline); checkNotifications(); renderFriends(); });
    });

    area.querySelectorAll(".friend-filter-pill").forEach((btn) => {
      btn.addEventListener("click", async () => {
        // WICHTIG: renderFriends() ist asynchron (wartet auf Backend.getFriends()) — die
        // "Nachher"-Messung MUSS deshalb auf das echte Fertigrendern warten (await), sonst
        // trifft sie noch den alten Inhalt, und der Ausgleich läuft komplett ins Leere. Das war
        // die eigentliche Ursache des Sprungs, nicht die Positions-Berechnung selbst.
        const beforeTop = area.getBoundingClientRect().top;
        friendFilterMode = btn.dataset.filter;
        await renderFriends();
        const newArea = document.getElementById("friendsArea");
        if (newArea) {
          const afterTop = newArea.getBoundingClientRect().top;
          window.scrollBy(0, afterTop - beforeTop);
        }
      });
    });
    area.querySelectorAll("[data-toggle-best]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await Backend.toggleBestFriend(btn.dataset.toggleBest);
        renderFriends();
      });
    });
    area.querySelectorAll("[data-view-friend-profile]").forEach((btn) => {
      btn.addEventListener("click", () => openProfileModal(btn.dataset.viewFriendProfile));
    });

    area.querySelectorAll("[data-challenge]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedChallengeFriendIds.clear();
        selectedChallengeFriendIds.add(btn.dataset.challenge);
        activateTab("view-learn");
        document.querySelector('#learnSubnav [data-sub="sub-exercises"]').click();
      });
    });

    const bulkChecks = area.querySelectorAll(".friend-bulk-check");
    const bulkBtn = document.getElementById("bulkChallengeBtn");
    function refreshBulkBtn() {
      const checked = [...bulkChecks].filter((c) => c.checked);
      if (bulkBtn) {
        bulkBtn.style.display = checked.length ? "inline-flex" : "none";
        bulkBtn.textContent = `🎮 Ausgewählte herausfordern (${checked.length})`;
      }
    }
    bulkChecks.forEach((c) => c.addEventListener("change", refreshBulkBtn));
    if (bulkBtn) {
      bulkBtn.addEventListener("click", () => {
        const checked = [...bulkChecks].filter((c) => c.checked);
        if (!checked.length) return;
        selectedChallengeFriendIds.clear();
        checked.forEach((c) => selectedChallengeFriendIds.add(c.dataset.bulkFriend));
        activateTab("view-learn");
        document.querySelector('#learnSubnav [data-sub="sub-exercises"]').click();
      });
    }

    area.querySelectorAll("[data-accept-challenge]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const categoryIds = btn.dataset.cats.split(",");
        const challengeId = btn.dataset.acceptChallenge;
        checkNotifications();
        // Jedes der neueren Spiele braucht seine eigene Weiterleitung — vorher landete eine
        // angenommene Einladung zu Wortbaustelle/Buchstabensalat/Kreuzworträtsel/Betonungs-
        // Trainer fälschlich in den klassischen Übungen, weil nur "memory" als Sonderfall
        // behandelt wurde.
        const gameRouting = {
          memory: () => {
            document.querySelector('#learnSubnav [data-sub="sub-memory"]').click();
            activeMemoryChallengeId = challengeId;
            activeMemoryOpponentName = btn.dataset.fromName || "";
            newMemoryGame();
          },
          wortbaustelle: () => {
            document.querySelector('#learnSubnav [data-sub="sub-wordbuild"]').click();
            activeGameChallengeId = challengeId;
            newWordbuildSession(); newWordbuildRound(); renderWordbuild();
          },
          buchstabensalat: () => {
            document.querySelector('#learnSubnav [data-sub="sub-wordsearch"]').click();
            activeGameChallengeId = challengeId;
            newWordSearchSession(); wsState = buildWordSearch(); renderWordSearch();
          },
          kreuzwortraetsel: () => {
            // Der Klick löst den Reiter-Wechsel-Handler aus, der bereits newCrosswordSession()
            // (mit zufälligem Startpunkt) und newCrossword() korrekt aufruft — ein zusätzlicher,
            // direkter newCrossword(0)-Aufruf hier würde das sofort wieder mit dem allerersten
            // Rätsel überschreiben.
            document.querySelector('#learnSubnav [data-sub="sub-crossword"]').click();
            activeGameChallengeId = challengeId;
          },
          betonungstrainer: () => {
            document.querySelector('#learnSubnav [data-sub="sub-stresstrainer"]').click();
            activeGameChallengeId = challengeId;
            newStressTrainerSession(); pickStressTrainerWord(); renderStressTrainer();
          },
          // WICHTIG — behebt einen echten Bug: diese 5 Spiele hatten bisher KEINE eigene Route
          // hier, obwohl man über die "Freunde herausfordern"-Mini-Leiste (siehe
          // renderMiniChallengeBarCached) durchaus zu genau diesen Spielen herausgefordert werden
          // konnte. Beim Annehmen fiel der Code auf den Standard-Fall (Quiz.startSession) zurück —
          // das funktioniert aber nur für normale ExerciseData.CATEGORIES-Kategorien, nicht für
          // diese eigenständigen Spiele. Ergebnis: man landete nur in der allgemeinen
          // Übungsübersicht, ohne dass tatsächlich eine Runde startete — genau das gemeldete
          // Verhalten ("ich sehe das Spiel nicht geöffnet, die Runde kann nicht starten").
          satzpuzzle: () => {
            document.querySelector('#learnSubnav [data-sub="sub-satzpuzzle"]').click();
            activeGameChallengeId = challengeId;
            newSatzpuzzleSession(); newSatzpuzzleRound(); renderSatzpuzzle();
          },
          wackelturm: () => {
            document.querySelector('#learnSubnav [data-sub="sub-wackelturm"]').click();
            activeGameChallengeId = challengeId;
            newWackelturmGame(); renderWackelturm();
          },
          wortarten: () => {
            document.querySelector('#learnSubnav [data-sub="sub-wortarten"]').click();
            activeGameChallengeId = challengeId;
            newWortartenSession(); newWortartenRound(); renderWortarten();
          },
          wortkanone: () => {
            document.querySelector('#learnSubnav [data-sub="sub-kanone"]').click();
            activeGameChallengeId = challengeId;
            newKanoneGame(); renderKanone();
          },
          werbinich: () => {
            document.querySelector('#learnSubnav [data-sub="sub-werbinich"]').click();
            activeGameChallengeId = challengeId;
            newWerBinIchRound(); renderWerBinIch();
          },
        };
        activateTab("view-learn");
        if (gameRouting[categoryIds[0]]) {
          gameRouting[categoryIds[0]]();
          return;
        }
        document.querySelector('#learnSubnav [data-sub="sub-exercises"]').click();
        Quiz.startSession(categoryIds, "leicht", { challengeId });
        showToast(`🦊 Willkommen, ${personaForCategory(categoryIds[0])}!`);
        renderQuestion();
      });
    });
  }

  function renderChallengePicker() {
    const box = document.getElementById("challengePicker");
    if (!friendChallengeTarget) { box.innerHTML = ""; return; }
    box.innerHTML = `
      <div class="question-card" style="margin-top:14px;">
        <h3>🎮 ${friendChallengeTarget.name} herausfordern</h3>
        <p class="empty-note">Wähle eine Kategorie — ihr spielt beide 10 Fragen, wer mehr Prozent holt, gewinnt.</p>
        <div class="category-grid" style="margin-top:10px;">
          ${ExerciseData.CATEGORIES.filter((c) => isUnlocked(c.unlock, Backend.currentProfile())).map((c) => `<div class="category-card" data-pick-cat="${c.id}"><div class="cat-checkbox"></div><div class="cat-body"><div class="cat-title-row"><span class="cat-icon">${c.icon}</span><span>${c.title}</span></div></div></div>`).join("")}
        </div>
        <p class="empty-note" style="margin-top:8px;">Nur Kategorien, die du selbst schon freigeschaltet hast, kannst du auch für ein Duell auswählen.</p>
      </div>
    `;
    let challengePickInProgress = false;
    box.querySelectorAll("[data-pick-cat]").forEach((card) => {
      card.addEventListener("click", async () => {
        if (challengePickInProgress) return; // Schutz gegen Doppel-Tap auf Mobilgeräten
        challengePickInProgress = true;
        const categoryId = card.dataset.pickCat;
        try {
          const challengeId = await Backend.createChallenge(friendChallengeTarget.id, [categoryId]);
          friendChallengeTarget = null;
          activateTab("view-learn");
          document.querySelector('#learnSubnav [data-sub="sub-exercises"]').click();
          Quiz.startSession([categoryId], "leicht", { challengeId });
          showToast(`🦊 Willkommen, ${personaForCategory(categoryId)}!`);
          renderQuestion();
        } finally {
          challengePickInProgress = false;
        }
      });
    });
  }

  let rankingMode = "alltime";
  let foxPeriodMode = "tag"; // Tab-Auswahl: Fuchs des Tages/der Woche/des Monats/des Jahres // "today" oder "alltime" -- Gesamt als Grundeinstellung, da das die
  // Zahl ist, die man normalerweise erwartet, wenn man "das Ranking" ansieht — "Heute" ist als
  // zweite Option für alle da, die gezielt sehen wollen, wer heute besonders aktiv war.
  // Wiederverwendbare Design-Banner-Grafik: zeigt das vom Betreiber hochgeladene Bild, oder — falls
  // noch keins hochgeladen wurde — einen zum Fuchs-Thema passenden SVG-Platzhalter, der schon
  // ordentlich aussieht, statt eine hässliche Lücke zu hinterlassen. Admins sehen zusätzlich einen
  // dezenten Hochladen-Knopf direkt auf dem Banner.
  function siteBannerHtml(key, currentUrl, placeholderSvg, altText) {
    // Der Vorschlags-Knopf ist jetzt für ALLE eingeloggten Nutzer:innen sichtbar (mehr
    // Mitgestaltungs-/Community-Gefühl) — nicht mehr nur für Admins. Wer kein Admin ist, schlägt
    // damit nur ein Bild vor (siehe proposeSiteBanner), das erst nach Bestätigung live geht.
    const canPropose = Boolean(Backend.currentUser && Backend.currentUser());
    return `
      <div class="site-banner" data-banner-key="${key}">
        ${currentUrl ? `<img src="${currentUrl}" alt="${altText}" class="site-banner-img" />` : placeholderSvg}
        ${canPropose ? `<label class="site-banner-upload-btn" title="${Backend.canModerate() ? "Eigene Grafik hochladen" : "Eigene Grafik vorschlagen (muss erst von einem Admin bestätigt werden)"}">📷<input type="file" accept="image/*" class="site-banner-upload-input" data-banner-key-input="${key}" style="display:none;" /></label>` : ""}
      </div>`;
  }
  function wireSiteBannerUploads(root) {
    root.querySelectorAll("[data-banner-key-input]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files[0];
        if (!file) return;
        try {
          const url = await Backend.uploadSiteImage(input.dataset.bannerKeyInput, file);
          showBannerProposeDialog(input.dataset.bannerKeyInput, url, root, input);
        } catch (e) { alert(e.message || "Upload fehlgeschlagen."); }
      });
    });
  }
  // Kleines Bestätigungs-Popup NACH dem Hochladen: standardmäßig gilt das Bild nur individuell
  // für die eigene Ansicht — nur mit ausdrücklich angehakter Option geht es (zusätzlich) als
  // Vorschlag an die Community, den Admins erst noch bestätigen müssen.
  function showBannerProposeDialog(key, url, root, inputEl) {
    const isAdmin = Backend.canModerate && Backend.canModerate();
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `
      <div class="profile-modal-card" style="text-align:center;">
        <img src="${url}" alt="" style="width:100%; max-height:160px; object-fit:cover; border-radius:10px; margin-bottom:10px;" />
        <label style="display:flex; align-items:center; gap:8px; text-align:left; margin-bottom:14px;">
          <input type="checkbox" id="bannerProposeCommunityCheck" />
          <span class="empty-note">${isAdmin ? "Auch sofort für die GANZE Community live setzen (sonst nur für dich persönlich)" : "Auch als Vorschlag für die GANZE Community einreichen — ein:e Admin muss das erst bestätigen (sonst gilt es nur für dich persönlich)"}</span>
        </label>
        <button type="button" class="btn btn-coffee" id="bannerProposeConfirmBtn">Übernehmen</button>
        <button type="button" class="btn btn-ghost" id="bannerProposeCancelBtn" style="margin-top:6px;">Abbrechen</button>
      </div>`;
    document.body.appendChild(box);
    box.addEventListener("click", (e) => { if (e.target === box) box.remove(); });
    document.getElementById("bannerProposeCancelBtn").addEventListener("click", () => box.remove());
    document.getElementById("bannerProposeConfirmBtn").addEventListener("click", async () => {
      const alsoForCommunity = document.getElementById("bannerProposeCommunityCheck").checked;
      try {
        const result = await Backend.proposeSiteBanner(key, url, alsoForCommunity);
        box.remove();
        if (result.needsApproval) {
          showToast("📩 Für dich sofort übernommen — Vorschlag für die Community wurde zusätzlich an die Admins gesendet.");
        } else if (alsoForCommunity) {
          showToast("🖼️ Für die ganze Community live gesetzt!");
        } else {
          showToast("🖼️ Für dich persönlich übernommen — andere sehen weiterhin das bisherige Bild.");
        }
        // Bild direkt im DOM austauschen statt eine bestimmte Render-Funktion neu aufzurufen —
        // funktioniert so unabhängig davon, an welcher Stelle der Banner gerade sitzt.
        const banner = inputEl.closest(".site-banner");
        if (banner) {
          const uploadBtnHtml = banner.querySelector(".site-banner-upload-btn").outerHTML;
          banner.innerHTML = `<img src="${url}" alt="" class="site-banner-img" />${uploadBtnHtml}`;
        }
        wireSiteBannerUploads(root);
      } catch (e) { alert(e.message || "Konnte nicht übernommen werden."); }
    });
  }
  const HALL_OF_FAME_PLACEHOLDER_SVG = `<svg class="site-banner-svg" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="hofGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e8825f"/><stop offset="100%" stop-color="#f2b84b"/>
    </linearGradient></defs>
    <rect width="400" height="120" fill="url(#hofGrad)"/>
    <circle cx="60" cy="60" r="38" fill="rgba(255,255,255,0.14)"/>
    <circle cx="340" cy="30" r="22" fill="rgba(255,255,255,0.12)"/>
    <text x="200" y="55" text-anchor="middle" font-size="30" font-family="sans-serif">🏆</text>
    <text x="200" y="90" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="sans-serif">Hall of Fame</text>
  </svg>`;
  async function renderRanking() {
    const area = document.getElementById("rankingArea");
    // WICHTIG: kein "Lade Ranking…"-Zwischenschritt mehr, der area.innerHTML sofort auf einen viel
    // kürzeren Platzhalter setzt — das ließ die Seite bei jedem Tab-Wechsel kurz nach oben
    // springen (weniger Inhalt = weniger Höhe), bevor der eigentliche Inhalt nachgeladen war und
    // die Seite wieder zurücksprang. Nur beim ALLERERSTEN Laden (Bereich noch komplett leer)
    // zeigen wir kurz einen Ladehinweis — bei jedem weiteren Tab-Wechsel bleibt der bisherige
    // Inhalt einfach stehen, bis die neuen Daten fertig sind, und wird dann in einem Schritt
    // ausgetauscht.
    if (!area.dataset.rankingLoadedOnce) area.innerHTML = '<p class="empty-note">Lade Ranking…</p>';
    const rows = rankingMode === "today" ? await Backend.getRankingToday() : await Backend.getRankingAllTime();
    const foxPeriodFns = { tag: () => Backend.getFoxOfTheDayShowcase(), woche: () => Backend.getFoxOfWeekShowcase(), monat: () => Backend.getFoxOfMonthShowcase(), jahr: () => Backend.getFoxOfYearShowcase() };
    const fox = await foxPeriodFns[foxPeriodMode]();
    const hallOfFame = await Backend.getFoxOfDayHallOfFame();
    const hofBannerUrl = await Backend.getEffectiveBannerUrl("hall_of_fame_banner");
    area.dataset.rankingLoadedOnce = "1";
    const periodTexts = { tag: { title: "Fuchs des Tages", suffix: "heute", report: "Mitarbeit heute" }, woche: { title: "Fuchs der Woche", suffix: "diese Woche", report: "Mitarbeit diese Woche" }, monat: { title: "Fuchs des Monats", suffix: "diesen Monat", report: "Mitarbeit diesen Monat" }, jahr: { title: "Fuchs des Jahres", suffix: "dieses Jahr", report: "Mitarbeit dieses Jahr" } };
    const pt = periodTexts[foxPeriodMode];
    area.innerHTML = `
      <div class="question-card" style="margin-bottom:14px;">
        <h3 style="margin-top:0;">🏆 Ranking</h3>
        <div class="order-toggle" style="margin-bottom:12px;">
          <button type="button" class="order-pill" id="rankTabToday" aria-selected="${rankingMode === "today"}">📅 Heute</button>
          <button type="button" class="order-pill" id="rankTabAllTime" aria-selected="${rankingMode === "alltime"}">🏆 Gesamt</button>
        </div>
        <table class="rank-table">
          ${rows.length ? rows.map((r, i) => `<tr>${r.user_id ? `<td>${i + 1}.</td><td><button type="button" class="friend-name-btn" data-view-ranked="${r.user_id}">${r.name}</button></td>` : `<td>${i + 1}.</td><td>${r.name}</td>`}<td>${r.points} Pkt.</td></tr>`).join("") : `<tr><td class="empty-note">${rankingMode === "today" ? "Noch keine Einträge heute — sei die/der Erste!" : "Noch keine Einträge."}</td></tr>`}
        </table>
      </div>
      <div class="order-toggle" style="margin-bottom:10px;">
        <button type="button" class="order-pill fox-period-pill" data-fox-period="tag" aria-selected="${foxPeriodMode === "tag"}">📅 Tag</button>
        <button type="button" class="order-pill fox-period-pill" data-fox-period="woche" aria-selected="${foxPeriodMode === "woche"}">🗓️ Woche</button>
        <button type="button" class="order-pill fox-period-pill" data-fox-period="monat" aria-selected="${foxPeriodMode === "monat"}">📆 Monat</button>
        <button type="button" class="order-pill fox-period-pill" data-fox-period="jahr" aria-selected="${foxPeriodMode === "jahr"}">🗓️ Jahr</button>
      </div>
      ${fox ? `
      <div class="question-card fox-of-day-showcase">
        <svg class="fox-bg-flourish" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M100 40 C70 40 50 65 45 95 C42 115 50 135 65 148 L60 170 L80 158 C87 161 93 162 100 162 C107 162 113 161 120 158 L140 170 L135 148 C150 135 158 115 155 95 C150 65 130 40 100 40 Z M70 55 L55 25 L80 48 Z M130 55 L145 25 L120 48 Z" fill="currentColor"/>
        </svg>
        <p class="eyebrow" style="margin-top:0;">🦊 ${pt.title}</p>
        <div style="display:flex; align-items:center; gap:14px; margin-bottom:10px; margin-top:14px;">
          <div style="width:56px; height:56px; flex-shrink:0; position:relative; overflow:hidden; border-radius:50%;">
            ${fox.profile?.avatar_url ? avatarPhotoHtml(fox.profile.avatar_url).replace('class="avatar-photo"', 'class="avatar-photo" style="width:100%; height:100%; object-fit:cover;"') : `<div class="initials-avatar" style="width:56px; height:56px;">${(fox.name || "?")[0].toUpperCase()}</div>`}
          </div>
          <div>
            <button type="button" class="friend-name-btn" data-view-ranked="${fox.user_id}" style="font-size:1.05rem; font-weight:800;">${fox.name}</button>
            <p class="empty-note" style="margin:2px 0 0;">${fox.total} Aktivitäts-Punkte ${pt.suffix}</p>
          </div>
        </div>
        <div class="fox-of-day-report-card">
          <p style="font-weight:700; margin:0 0 6px;">📋 ${pt.report}:</p>
          <ul style="margin:0; padding-left:18px;">
            ${fox.reportCard.map((line) => `<li>${line}</li>`).join("")}
          </ul>
          ${fox.profile?.languages?.length ? `<p class="empty-note" style="margin-top:8px;">🗣️ Spricht: ${fox.profile.languages.join(", ")}</p>` : ""}
          ${fox.profile?.origin ? `<p class="empty-note" style="margin-top:4px;">🌍 Kommt aus: ${fox.profile.origin}</p>` : ""}
        </div>
      </div>` : `<p class="empty-note">Noch keine Aktivität in diesem Zeitraum — sei die/der Erste!</p>`}
      ${hallOfFame.length ? `
      <div class="question-card" style="margin-top:14px; padding:0; overflow:hidden;">
        ${siteBannerHtml("hall_of_fame_banner", hofBannerUrl, HALL_OF_FAME_PLACEHOLDER_SVG, "Hall of Fame")}
        <div style="padding:16px;">
        <p class="eyebrow" style="margin-top:0;">🏛️ Hall of Fame — vergangene Füchse des Tages</p>
        <div class="breakdown-list">
          ${hallOfFame.slice(0, 10).map((h) => `<div class="breakdown-row"><span>🦊 ${h.name}</span><span class="empty-note">${new Date(h.date).toLocaleDateString("de-DE")}</span></div>`).join("")}
        </div>
        </div>
      </div>` : ""}
    `;
    wireSiteBannerUploads(area);
    // Scroll-Position bewusst erhalten: der geklickte Tab-Button verschwindet beim Neu-Rendern
    // kurz aus dem DOM (innerHTML wird komplett ersetzt) und verliert dabei seinen Fokus — das
    // ließ den Browser automatisch ganz an den Seitenanfang zurückspringen, statt an der Stelle
    // zu bleiben, an der man gerade war. renderRanking() ist async — erst NACH dem fertigen
    // Neu-Aufbau wiederherstellen, sonst kommt die Wiederherstellung zu früh.
    // Statt der ABSOLUTEN Fenster-Scroll-Position wird der Abstand zur Oberkante des Ranking-
    // Bereichs selbst gemerkt — bei unterschiedlich viel Inhalt zwischen "Heute"/"Gesamt" bzw.
    // den Fuchs-Zeiträumen ändert sich sonst die Seitenhöhe OBERHALB der Liste, wodurch dieselbe
    // Pixel-Position nach dem Neu-Rendern eine andere Stelle zeigte — spürbar auch nach der ersten
    // Korrektur noch. Relativ zum Bereich selbst bleibt der Blick zuverlässig an derselben Stelle.
    // Robustere Methode (dieselbe wie jetzt bei den Freunde-Filtern): einfach die VIEWPORT-
    // relative Position vorher/nachher direkt vergleichen und um die Differenz zurückschieben —
    // ohne window.scrollY zu verwenden, das der Browser bei einer kürzer werdenden Seite
    // bereits automatisch verändert haben könnte, bevor man ihn ausliest.
    function rememberScrollOffset() {
      return area.getBoundingClientRect().top;
    }
    function restoreScrollOffset(beforeTop) {
      const newArea = document.getElementById("rankingArea");
      if (!newArea) return;
      const afterTop = newArea.getBoundingClientRect().top;
      window.scrollBy(0, afterTop - beforeTop);
    }
    document.getElementById("rankTabToday").addEventListener("click", async () => { const off = rememberScrollOffset(); rankingMode = "today"; await renderRanking(); restoreScrollOffset(off); });
    document.getElementById("rankTabAllTime").addEventListener("click", async () => { const off = rememberScrollOffset(); rankingMode = "alltime"; await renderRanking(); restoreScrollOffset(off); });
    area.querySelectorAll("[data-fox-period]").forEach((btn) => {
      btn.addEventListener("click", async () => { const off = rememberScrollOffset(); foxPeriodMode = btn.dataset.foxPeriod; await renderRanking(); restoreScrollOffset(off); });
    });
    area.querySelectorAll("[data-view-ranked]").forEach((btn) => {
      btn.addEventListener("click", () => openProfileModal(btn.dataset.viewRanked));
    });
  }

  async function renderGuestbook() {
    const area = document.getElementById("guestbookArea");
    const entries = await Backend.getGuestbook();
    const avg = await Backend.getAverageRating();
    const user = Backend.currentUser();
    let selectedRating = 0;
    // Kleines Profilbild neben jedem Eintrag laden — inklusive Sammelfigur-Avatare, die dann über
    // dieselbe unbeschnittene Sticker-Logik wie überall sonst angezeigt werden.
    const authorProfiles = {};
    const uniqueAuthorIds = [...new Set(entries.map((e) => e.user_id).filter(Boolean))];
    await Promise.all(uniqueAuthorIds.map(async (uid) => { authorProfiles[uid] = await Backend.getPublicProfile(uid); }));
    area.innerHTML = `
      <div class="question-card">
        <h3>📖 Gästebuch &amp; Bewertungen</h3>
        ${avg ? `<p class="empty-note" style="margin-bottom:12px;">${"⭐".repeat(Math.round(avg.average))} ${avg.average.toFixed(1)} / 5 — basierend auf ${avg.count} Bewertung${avg.count === 1 ? "" : "en"}</p>` : ""}
        ${entries.map((e) => {
          const ap = e.user_id ? authorProfiles[e.user_id] : null;
          const avatarHtml = ap ? tinyAvatar({ avatar_url: ap.avatar_url, avatar_emoji: ap.avatar_emoji, name: e.name }) : "";
          return `<div class="guestbook-entry"><div style="display:flex; align-items:center; gap:8px;">${avatarHtml}${e.user_id ? `<button type="button" class="friend-name-btn gb-name" data-view-gb-author="${e.user_id}">${e.name}</button>` : `<div class="gb-name">${e.name}</div>`}</div>${e.rating ? `<div style="color:var(--amber-400); font-size:0.9rem;">${"⭐".repeat(e.rating)}</div>` : ""}<p>${e.message}</p><div class="gb-date">${new Date(e.date).toLocaleString("de-DE")}</div>${Backend.canModerate() ? `<button type="button" class="btn btn-ghost" style="margin-top:6px;" data-admin-delete-gb="${e.id}">🛠️ Löschen</button>` : ""}</div>`;
        }).join("") || '<p class="empty-note">Noch keine Einträge.</p>'}
        <form class="guestbook-form" id="guestbookForm">
          ${!user ? '<input type="text" id="gbName" placeholder="Dein Name" required />' : ""}
          <label class="empty-note" style="display:block; margin-bottom:4px;">Bewertung (optional)</label>
          <div id="gbStarPicker" style="display:flex; gap:4px; margin-bottom:10px; font-size:1.4rem;">
            ${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="gb-star-btn" data-star="${n}" style="background:none; border:none; cursor:pointer; opacity:0.35;">⭐</button>`).join("")}
          </div>
          <textarea id="gbMessage" placeholder="Hinterlasse eine Nachricht für Alex…" required></textarea>
          <button type="submit" class="btn-submit">Eintragen</button>
        </form>
      </div>
    `;
    area.querySelectorAll(".gb-star-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedRating = Number(btn.dataset.star);
        area.querySelectorAll(".gb-star-btn").forEach((b) => { b.style.opacity = Number(b.dataset.star) <= selectedRating ? "1" : "0.35"; });
      });
    });
    document.getElementById("guestbookForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = user ? Backend.currentProfile().name : document.getElementById("gbName").value.trim();
      const message = document.getElementById("gbMessage").value.trim();
      if (!message) return;
      await Backend.addGuestbookEntry(name, message, selectedRating || null);
      renderGuestbook();
    });
    area.querySelectorAll("[data-view-gb-author]").forEach((btn) => {
      btn.addEventListener("click", () => openProfileModal(btn.dataset.viewGbAuthor));
    });
    area.querySelectorAll("[data-admin-delete-gb]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Diesen Gästebuch-Eintrag als Admin löschen?")) return;
        try { await Backend.adminDeleteGuestbookEntry(btn.dataset.adminDeleteGb); renderGuestbook(); }
        catch (err) { alert(err.message); }
      });
    });
  }

  function renderPremium() {
    const area = document.getElementById("premiumArea");
    const user = Backend.currentUser();
    const isPremium = Backend.isPremium();
    area.innerHTML = `
      <div class="premium-card">
        <h2>✨ Premium-Inhalte</h2>
        <p class="empty-note">Zusätzliche Materialien für alle, die noch tiefer einsteigen wollen — finanziert über einen kleinen Beitrag statt Werbung.</p>
        ${isPremium
          ? '<p style="margin-top:12px; color: var(--teal-400); font-weight:700;">✓ Freigeschaltet — danke für deine Unterstützung!</p>'
          : `<div class="quiz-actions" style="justify-content:center; margin-top:16px;">
              <a class="btn btn-coffee" href="https://www.paypal.com/paypalme/XanderFox" target="_blank" rel="noopener">Premium unterstützen (PayPal)</a>
              ${user ? '<button type="button" class="btn btn-ghost" id="demoUnlock">Im Demo-Modus freischalten</button>' : ""}
            </div>
            <p class="empty-note" style="margin-top:10px;">Hinweis: Die echte Freischaltung nach Zahlung braucht eine kleine Server-Funktion (z. B. Supabase Edge Function + PayPal-Webhook) — siehe README. Der Demo-Button simuliert das Ergebnis lokal zum Testen.</p>`
        }
        <div class="premium-locked-list">
          <div class="premium-item"><span>📘 Erweiterte Grammatik-PDFs</span><span class="${isPremium ? "unlock-tag" : "lock-tag"}">${isPremium ? "freigeschaltet" : "gesperrt"}</span></div>
          <div class="premium-item"><span>🎧 Alex' Aussprache-Aufnahmen</span><span class="${isPremium ? "unlock-tag" : "lock-tag"}">${isPremium ? "freigeschaltet" : "gesperrt"}</span></div>
          <div class="premium-item"><span>🗓️ Wöchentliche Bonus-Quizrunde</span><span class="${isPremium ? "unlock-tag" : "lock-tag"}">${isPremium ? "freigeschaltet" : "gesperrt"}</span></div>
        </div>
        <p class="empty-note" style="margin-top:14px;">
          ⚠️ Diese drei Punkte sind aktuell nur Platzhalter-Beispiele, noch keine echten Dateien.
          Um z. B. ein PDF anzubieten: Datei im Repo in einen neuen Ordner <code>/materials/</code> hochladen
          und hier im Code (<code>app.js</code>, Funktion <code>renderPremium</code>) mit
          <code>&lt;a href="materials/deine-datei.pdf"&gt;</code> verlinken.
        </p>
      </div>
    `;
    const demoBtn = document.getElementById("demoUnlock");
    if (demoBtn) demoBtn.addEventListener("click", () => { Backend.unlockPremiumDemo(); renderPremium(); });
  }

  renderAccount();
  refreshHeaderAuth();

  // Ranking/Gästebuch/Premium erst rendern, wenn der jeweilige Reiter geöffnet wird
  document.querySelectorAll('#profileSubnav .subnav-pill').forEach((pill) => {
    pill.addEventListener("click", () => {
      if (pill.dataset.sub === "sub-ranking") renderRanking();
      if (pill.dataset.sub === "sub-guestbook") renderGuestbook();
      if (pill.dataset.sub === "sub-premium") renderPremium();
      if (pill.dataset.sub === "sub-account") renderAccount();
      if (pill.dataset.sub === "sub-friends") renderFriends();
      if (pill.dataset.sub === "sub-design") renderDesign();
      if (pill.dataset.sub === "sub-settings") renderSettings();
      if (pill.dataset.sub === "sub-inbox") renderInbox(true);
    });
  });

  // Beim Start: gespeichertes Theme des eingeloggten Profils anwenden, sonst Standard behalten
  applyTheme((Backend.currentProfile() && Backend.currentProfile().theme) || sessionTheme);

  // Falls Supabase verbunden ist: bestehende Anmeldung (Session) wiederherstellen
  Backend.restoreSession().then(async () => {
    await Backend.getFeatureFlags(); // Freigabe-Schalter laden — unabhängig davon, ob eingeloggt
    claimLoginStreak();
    refreshHeaderAuth();
    renderAccount();
    renderSetup();
    applyTheme((Backend.currentProfile() && Backend.currentProfile().theme) || sessionTheme);
    updateSpecialDayBar();
    notifyAboutAppUpdateIfNeeded();
  });

  // Update-Hinweis: sobald eine neue Version live geht, bekommt jeder eingeloggte Nutzer beim
  // nächsten Besuch EINMALIG eine kurze Postfach-Nachricht mit den wichtigsten Neuerungen —
  // nicht jeder kleine Bugfix, nur was für Schüler:innen wirklich zählt. Um eine neue Version
  // anzukündigen: APP_VERSION hochzählen und einen neuen Eintrag in APP_CHANGELOG ergänzen.
  const APP_VERSION = "115";
  const APP_CHANGELOG = {
    "21": "🎉 Neu: privates Postfach (mit Antworten & Bildern), mehrseitiger Steckbrief mit viel mehr Eintragsmöglichkeiten, neue Übung 'Lückentext-Geschichten', schwimmende Fische zeigen jetzt in die richtige Richtung, und ein paar hartnäckige Fehler beim Freischalten wurden behoben.",
  };
  function notifyAboutAppUpdateIfNeeded() {
    if (!Backend.currentUser()) return;
    const profile = Backend.currentProfile();
    const seenVersion = (profile && profile.extraProfileData && profile.extraProfileData.seenAppVersion) || null;
    if (seenVersion === APP_VERSION) return;
    const note = APP_CHANGELOG[APP_VERSION];
    if (!note) return;
    const messageText = `🆕 Was ist neu (Version ${APP_VERSION}):\n\n${note}`;
    // Zweite Absicherung: falls das Speichern der "gesehen"-Markierung aus irgendeinem Grund
    // fehlschlägt, verhindert diese zusätzliche Prüfung trotzdem, dass dieselbe Nachricht bei
    // jedem Neuladen erneut verschickt wird — sie schaut einfach nach, ob genau dieser Text
    // schon im Postfach liegt.
    Backend.getMyMessages().then((messages) => {
      const alreadySent = messages.inbox.some((m) => m.body === messageText);
      if (!alreadySent) Backend.sendSystemMessage(Backend.currentUser().id, messageText);
      Backend.updateExtraProfileField("seenAppVersion", APP_VERSION);
    });
  }

  // Online-Status: alle 60s "zuletzt aktiv" aktualisieren, solange eingeloggt
  setInterval(() => { if (Backend.currentUser()) Backend.touchActivity(); }, 60000);
})();
