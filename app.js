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

  /* ============ Haupt-Tab-Navigation ============ */
  const tabs = document.querySelectorAll(".tape-tab");
  const views = document.querySelectorAll(".view");

  function activateTab(targetId) {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.target === targetId)));
    views.forEach((v) => (v.dataset.active = String(v.id === targetId)));
    history.replaceState(null, "", `#${targetId}`);
  }
  tabs.forEach((t) => t.addEventListener("click", () => activateTab(t.dataset.target)));
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
  let tourSeen = true;
  try { tourSeen = Boolean(localStorage.getItem("dma_tour_seen")); } catch (e) {}
  if (!tourSeen) setTimeout(startTour, 600);
  const tourReplayLink = document.getElementById("tourReplayLink");
  if (tourReplayLink) tourReplayLink.addEventListener("click", (e) => { e.preventDefault(); startTour(); });

  wireSubnav("knowledgeSubnav");
  wireSubnav("profileSubnav");
  document.querySelector('#learnSubnav [data-sub="sub-exercises"]').addEventListener("click", () => {
    renderSetup();
  });

  /* ============================================================
     DESIGN / THEMES — 4 austauschbare Vorlagen
     ============================================================ */
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
  let sessionTheme = "bastelheft";

  function applyTheme(id) {
    document.documentElement.setAttribute("data-theme", id);
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
    return true;
  }
  function isThemeUnlocked(t, profile) { return isUnlocked(t.unlock, profile) || (profile?.giftedThemes || []).includes(t.id); }

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
      </div>`;
    };
    area.innerHTML = `
      <p class="empty-note">Wähle dein Lieblings-Design — wirkt sofort auf der ganzen Seite. Gesperrte Designs sind Geschenke fürs Weiterlernen — einfach fleißig üben!</p>
      <p class="eyebrow" style="margin-top:16px;">☀️ Helle Designs</p>
      <div class="category-grid">
        ${THEMES.filter((t) => t.mode === "hell").map(themeCard).join("")}
      </div>
      <p class="eyebrow" style="margin-top:20px;">🌙 Dunkle Designs</p>
      <div class="category-grid">
        ${THEMES.filter((t) => t.mode === "dunkel").map(themeCard).join("")}
      </div>
    `;
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

  function updateSpecialDayBar() {
    const el = document.getElementById("specialDayOut");
    if (!el) return;
    const now = new Date();
    const berlin = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
    const key = `${String(berlin.getMonth() + 1).padStart(2, "0")}-${String(berlin.getDate()).padStart(2, "0")}`;
    const profile = Backend.currentProfile();
    let text = GERMAN_HOLIDAYS[key] || "";
    if (profile && profile.birthday && /^\d{4}-\d{2}-\d{2}$/.test(profile.birthday)) {
      if (profile.birthday.slice(5) === key) {
        text = `🎂 Alles Gute, ${profile.name.split(" ")[0]}!`;
      }
    }
    el.textContent = text;
    el.style.display = text ? "inline" : "none";
  }
  updateSpecialDayBar();

  /* ============ Lauftext-Ticker ============ */
  let tickerVisible = true;
  async function updateTicker() {
    const track = document.getElementById("tickerTrack");
    if (!track) return;
    const items = await Backend.getActivity();
    if (items.length) {
      track.textContent = items.map((a) => `• ${a.text}`).join("   ");
      // Safari/iOS startet die CSS-Animation nach Textänderung sonst nicht neu -> Reflow erzwingen
      track.style.animation = "none";
      void track.offsetHeight;
      track.style.animation = "";
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

  /* ============ Kurze Pop-up-Benachrichtigung bei neuen Anfragen ============ */
  function showToast(text, onClick) {
    const toast = Core.el("div", { class: "toast-popup", onclick: onClick || (() => {}) }, text);
    if (onClick) toast.classList.add("toast-clickable");
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("toast-visible"), 20);
    setTimeout(() => {
      toast.classList.remove("toast-visible");
      setTimeout(() => toast.remove(), 400);
    }, 5500);
  }
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

  // Stummschaltung für Benachrichtigungs-Ton + roten Ring — bleibt dauerhaft im Browser gespeichert,
  // z. B. wenn gerade viele Anfragen reinkommen und man das nicht ständig hören/sehen möchte.
  function isNotifyMuted() {
    try { return localStorage.getItem("dma_notify_muted") === "1"; } catch (e) { return false; }
  }
  function setNotifyMuted(muted) {
    try { localStorage.setItem("dma_notify_muted", muted ? "1" : "0"); } catch (e) {}
  }

  function playNotifySound() {
    if (isNotifyMuted()) return;
    try {
      if (!sharedAudioCtx) return; // Seite wurde noch nicht angetippt -> Browser erlaubt noch keinen Ton
      const ctx = sharedAudioCtx;
      if (ctx.state === "suspended") ctx.resume();
      [880, 1108].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = ctx.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.14, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch (e) { /* Ton ist rein dekorativ -- bei Problemen einfach still bleiben */ }
  }

  function goToFriendsInbox() {
    activateTab("view-profile");
    document.querySelector('#profileSubnav [data-sub="sub-friends"]').click();
  }
  function updateNotifyBadge(count) {
    const badge = document.getElementById("loginBtnBadge");
    if (badge) badge.style.display = count > 0 ? "block" : "none";
    const tabBadge = document.getElementById("friendsTabBadge");
    if (tabBadge) tabBadge.style.display = count > 0 ? "block" : "none";
    if (loginBtn) loginBtn.classList.toggle("notify-ring", count > 0 && !isNotifyMuted());
  }
  let lastFriendReqCount = 0;
  let lastChallengeReqCount = 0;
  let notifyPrimed = false;
  let toastedNotificationIds = new Set();
  async function checkNotifications() {
    if (!Backend.currentUser()) { updateNotifyBadge(0); return; }
    const [requests, challenges, notifications, unreadMsgCount] = await Promise.all([Backend.getIncomingRequests(), Backend.getMyChallenges(), Backend.getUnreadNotifications(), Backend.getUnreadMessageCount()]);
    const inboxBadge = document.getElementById("inboxTabBadge");
    if (inboxBadge) inboxBadge.style.display = unreadMsgCount > 0 ? "block" : "none";
    const challengeCount = challenges.incoming.length;
    let hasNew = false;
    // Freundschaftsanfragen, Duell-Einladungen und persönliche Benachrichtigungen werden über ihre
    // eigene ID verfolgt (nicht nur über einen Zähler) — so wird auch das, was schon beim allerersten
    // Öffnen der Seite bereits wartet, zuverlässig gemeldet, statt beim ersten Check still verschluckt zu werden.
    requests.forEach((r) => {
      if (!toastedNotificationIds.has("freq-" + r.id)) {
        toastedNotificationIds.add("freq-" + r.id);
        showToast("👥 Neue Freundschaftsanfrage — antippen zum Annehmen", goToFriendsInbox);
        hasNew = true;
      }
    });
    challenges.incoming.forEach((c) => {
      if (!toastedNotificationIds.has("chal-" + c.id)) {
        toastedNotificationIds.add("chal-" + c.id);
        showToast("🎮 Neue Duell-Herausforderung — antippen zum Annehmen", goToFriendsInbox);
        hasNew = true;
      }
    });
    notifications.forEach((n) => {
      if (!toastedNotificationIds.has(n.id)) {
        toastedNotificationIds.add(n.id);
        showToast(n.message, () => document.querySelector('[data-target="view-profile"]').click());
        hasNew = true;
      }
    });
    lastFriendReqCount = requests.length;
    lastChallengeReqCount = challengeCount;
    notifyPrimed = true;
    const totalCount = requests.length + challengeCount + notifications.length;
    updateNotifyBadge(totalCount);
    if (hasNew) {
      playNotifySound();
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
  checkNotifications();
  setInterval(checkNotifications, 20000);

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
        <button type="button" class="btn btn-coffee" id="resumeBtn">▶ Fortsetzen</button>
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
    const onlineFriends = friends.filter((f) => f.online);
    const offlineFriends = friends.filter((f) => !f.online);
    const challengeBar = friends.length ? `
      <div class="setup-bar" style="margin-top:10px; flex-direction:column; align-items:stretch;">
        <label style="font-size:0.82rem; font-weight:700; color:var(--cream-200);">🎮 Optional: Freunde herausfordern (auch mehrere gleichzeitig)</label>
        <div class="challenge-friend-list">
          ${onlineFriends.map((f) => `
            <button type="button" class="challenge-friend-pill ${selectedChallengeFriendIds.has(f.id) ? "selected" : ""}" data-challenge-friend="${f.id}">
              <span class="online-dot"></span>${f.name}
            </button>`).join("")}
          ${offlineFriends.map((f) => `
            <button type="button" class="challenge-friend-pill offline ${selectedChallengeFriendIds.has(f.id) ? "selected" : ""}" data-challenge-friend="${f.id}" title="Spielt die Runde, sobald sie sich wieder einloggen">
              ${f.name} <span class="empty-note">(offline)</span>
            </button>`).join("")}
        </div>
      </div>` : "";

    setupEl.innerHTML = `
      ${resumeBar}
      <div class="category-grid">${cards}</div>
      <div class="setup-bar">
        <div class="diff-pills">
          ${Quiz.DIFFICULTIES.map((d) => `<button type="button" class="diff-pill" data-diff="${d.id}" aria-selected="${d.id === selectedDifficulty}" ${maxAvailable < d.count ? "disabled" : ""}>${d.label} (${d.count})</button>`).join("")}
        </div>
        <button type="button" class="btn-start" id="startBtn" ${selectedCategories.size === 0 ? "disabled" : ""}>${selectedChallengeFriendIds.size ? `Duell starten 🎮 (${selectedChallengeFriendIds.size})` : "Runde starten ▶"}</button>
      </div>
      ${challengeBar}
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
    setupEl.querySelectorAll("[data-challenge-friend]:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.challengeFriend;
        if (selectedChallengeFriendIds.has(id)) selectedChallengeFriendIds.delete(id);
        else selectedChallengeFriendIds.add(id);
        renderSetup();
      });
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
      renderQuestion();
    });
    const resumeBtn = document.getElementById("resumeBtn");
    if (resumeBtn) resumeBtn.addEventListener("click", () => renderQuestion());
  }

  let currentSelection = [];
  const AUTO_ADVANCE_DELAY = 900;

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

    playEl.innerHTML = `
      <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${(p.index / p.total) * 100}%"></div></div>
      <div class="question-card">
        <div class="question-meta"><span class="cat-tag">${cat.icon} ${cat.title}</span> · Frage ${p.index + 1} / ${p.total}${isMulti ? " · mehrere Antworten möglich" : ""}</div>
        <div class="question-prompt">${promptHtml}</div>
        <div class="option-list">
          ${q.options.map((opt, i) => `<button type="button" class="option-btn" data-idx="${i}"><span>${opt}</span></button>`).join("")}
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

  function renderResults() {
    playEl.style.display = "none";
    resultsEl.style.display = "";
    const r = Quiz.computeResults();

    if (r.basePercent >= 70) Core.sound.fanfare();
    else if (r.basePercent >= 40) Core.sound.okay();
    else Core.sound.fail();

    Backend.saveResult({
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
              <div class="vocab-syl">${Core.formatStress(w.syl)}</div>
              <div class="vocab-en">${w.en}</div>
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
     MEMORY
     ============================================================ */
  const memoryArea = document.getElementById("memoryArea");
  let memoryState = null;
  const MEMORY_PAIR_COUNT = 6; // fest — 12 Karten passen ohne Scrollen aufs Handy
  let memoryGameId = "synonyme";
  let memoryDifficulty = "mittel"; // 'leicht' (Orientierungshilfe) · 'mittel' (normal) · 'schwer' (mischt neu)
  let memoryChallengeFriendId = "";
  let selectedMemoryFriendIds = new Set();
  let activeMemoryChallengeId = null;
  let activeMemoryOpponentName = "";

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

  async function renderMemory() {
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
    const challengeBar = memFriends.length && !activeMemoryChallengeId ? `
      <div class="setup-bar" style="margin-top:0; margin-bottom:10px; flex-direction:column; align-items:stretch;">
        <label style="font-size:0.82rem; font-weight:700; color:var(--cream-200);">🧠 Optional: Freunde herausfordern (auch mehrere gleichzeitig, auch offline)</label>
        <div class="challenge-friend-list">
          ${memFriends.map((f) => `<button type="button" class="challenge-friend-pill ${!f.online ? "offline" : ""} ${selectedMemoryFriendIds.has(f.id) ? "selected" : ""}" data-mem-challenge-friend="${f.id}">${f.online ? '<span class="online-dot"></span>' : ""}${f.name}${!f.online ? ' <span class="empty-note">(offline)</span>' : ""}</button>`).join("")}
        </div>
        ${selectedMemoryFriendIds.size ? `<button type="button" class="btn btn-coffee" id="memStartChallengeBtn" style="margin-top:8px;">🎮 Duell starten (${selectedMemoryFriendIds.size})</button>` : ""}
      </div>` : "";

    memoryArea.innerHTML = `
      ${activeMemoryChallengeId ? `<div class="demo-banner">🎮 Duell gegen ${activeMemoryOpponentName || "deinen Freund"} läuft — dein Ergebnis wird nach dieser Runde verglichen.</div>` : ""}
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
            : `<span class="fox-crest">🦊</span>${showHint ? '<span class="seen-dot"></span>' : ""}`;
          return `<button type="button" class="${cls.join(" ")}" data-id="${c.id}" data-pair="${c.pairId}">${face}</button>`;
        }).join("")}
      </div>
      <p class="memory-status">Züge: ${memoryState.moves} · Gefunden: ${memoryState.matched.size} / ${memoryState.cards.length / 2}</p>
      ${memoryState.finished ? '<div class="demo-banner">🦊 Runde geschafft! Punkte wurden deinem Profil gutgeschrieben.</div>' : ""}
      <div class="quiz-actions" style="justify-content:flex-start;"><button type="button" class="btn btn-ghost" id="memoryRestart">🔄 Neu mischen</button></div>
    `;
    document.getElementById("memoryRestart").addEventListener("click", () => { activeMemoryChallengeId = null; activeMemoryOpponentName = ""; newMemoryGame(); });
    memoryArea.querySelectorAll(".memory-card").forEach((btn) => {
      btn.addEventListener("click", () => handleMemoryFlip(btn.dataset.id));
    });
    memoryArea.querySelectorAll("[data-mdiff]").forEach((btn) => {
      btn.addEventListener("click", () => {
        memoryDifficulty = btn.dataset.mdiff;
        newMemoryGame();
      });
    });
    memoryArea.querySelectorAll("[data-game]").forEach((card) => {
      card.addEventListener("click", () => {
        memoryGameId = card.dataset.game;
        newMemoryGame();
      });
    });
    let memChallengeInProgress = false;
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
          Backend.saveResult({
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

  document.querySelector('#learnSubnav [data-sub="sub-memory"]').addEventListener("click", () => {
    activeMemoryChallengeId = null; activeMemoryOpponentName = "";
    memoryChallengeFriendId = "";
    newMemoryGame();
  });

  /* ============================================================
     KOMPASS
     ============================================================ */
  const kompassArea = document.getElementById("kompassArea");

  function kompassCard(title, explain, example) {
    return `<div class="kompass-card">
      <div class="kompass-word">„${title}"</div>
      <div class="kompass-explain">${explain}</div>
      <div class="kompass-example">„${example}"</div>
    </div>`;
  }

  kompassArea.innerHTML = `
    <div class="wegweiser">
      <a href="#kompass-redewendungen" class="wegweiser-item"><span>💬</span>Redewendungen</a>
      <a href="#kompass-jugendsprache" class="wegweiser-item"><span>🗣️</span>Umgangssprache &amp; Jugendslang</a>
      <a href="#kompass-partikeln" class="wegweiser-item"><span>✨</span>Kleine Wörter, große Wirkung</a>
    </div>

    <h3 id="kompass-redewendungen" class="kompass-heading">💬 Redewendungen</h3>
    <p class="empty-note">Eine kleine Auswahl — alle 30 kannst du in „Lernen → Übungen" spielerisch abfragen.</p>
    <div class="kompass-grid">${VocabData.REDEWENDUNGEN_KURZ.map((r) => kompassCard(r.phrase, r.explain, r.example)).join("")}</div>

    <h3 id="kompass-jugendsprache" class="kompass-heading">🗣️ Umgangssprache &amp; Jugendslang</h3>
    <div class="kompass-grid">${VocabData.JUGENDSPRACHE.map((j) => kompassCard(j.word, j.explain, j.example)).join("")}</div>

    <h3 id="kompass-partikeln" class="kompass-heading">✨ Kleine Wörter, große Wirkung</h3>
    <div class="kompass-grid">${VocabData.PARTIKELN.map((p) => kompassCard(p.word, p.explain, p.example)).join("")}</div>
  `;

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
      box.appendChild(Core.el("img", { src: urls[i], alt: alt || "" }));
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
              </select>
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
        return `
        <div class="material-card">
          ${t.cover_url ? `<img src="${t.cover_url}" class="community-text-cover-banner" alt="" data-modal-view-photo="${t.cover_url}" />` : ""}
          <div class="community-text-head">
            <span class="level-badge">${t.level}</span>
            <h3 style="margin:0;">${t.title}</h3>
          </div>
          <p style="white-space:pre-wrap;">${t.body}</p>
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
    if (submitBtn) {
      submitBtn.addEventListener("click", async () => {
        const title = document.getElementById("ctTitle").value.trim();
        const level = document.getElementById("ctLevel").value;
        const body = document.getElementById("ctBody").value.trim();
        const errBox = document.getElementById("ctError");
        errBox.textContent = "";
        if (!title || !body) { errBox.textContent = "Bitte Titel und Text ausfüllen."; return; }
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
  document.querySelector('#knowledgeSubnav [data-sub="sub-community"]').addEventListener("click", () => {
    renderCommunityTexts();
  });

  document.getElementById("linksArea").innerHTML = VocabData.LINKS.map((l) => `
    <div class="link-card"><h3><a href="${l.url}" target="_blank" rel="noopener">${l.title} ↗</a></h3><p>${l.desc}</p></div>`).join("");

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

  document.querySelector('#knowledgeSubnav [data-sub="sub-news"]').addEventListener("click", loadNews);

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
        icon.innerHTML = `<img src="${profile.avatarUrl}" class="header-avatar" alt="" />${flagHtml}`;
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
      "favCountryInput", "extraDreamDestInput", "extraVisitedInput",
      "favMovieInput", "favSeriesInput", "favSongInput", "extraActorInput",
      "favQuoteInput", "extraMottoInput", "poemInput",
      "favFoodInput", "favDrinkInput", "extraColorInput", "extraAnimalInput", "extraSeasonSelect",
    ];
    const fieldMap = {
      favCountryInput: "favCountry", extraDreamDestInput: "dreamDestination", extraVisitedInput: "visitedCountries",
      favMovieInput: "favMovie", favSeriesInput: "favSeries", favSongInput: "favSong", extraActorInput: "favActor",
      favQuoteInput: "favQuote", extraMottoInput: "motto", poemInput: "poem",
      favFoodInput: "favFood", favDrinkInput: "favDrink", extraColorInput: "favColor", extraAnimalInput: "favAnimal", extraSeasonSelect: "favSeason",
    };
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) profileEditDraft[fieldMap[id]] = el.value.trim();
    });
  }
  let profileViewPage = 0;

  async function renderAccount() {
    const area = document.getElementById("accountArea");
    const user = Backend.currentUser();
    const myUnread = user ? await Backend.getUnreadNotifications() : [];
    if (user && myUnread.length) await Backend.refreshCurrentProfile();
    const profile = Backend.currentProfile();
    const extra = (profile && profile.extraProfileData) || {};

    const demoBanner = !Backend.isConfigured
      ? '<div class="demo-banner">🔧 Demo-Modus: Es ist noch kein Supabase-Projekt verbunden (siehe supabase-config.js). Konten &amp; Punkte bleiben nur für diese Sitzung erhalten.</div>'
      : "";

    if (!user) {
      area.innerHTML = `
        ${demoBanner}
        <div class="question-card">
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
      `;
      area.querySelectorAll(".auth-tab").forEach((t) => t.addEventListener("click", () => { authMode = t.dataset.mode; renderAccount(); }));
      document.getElementById("authForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("authEmail").value.trim();
        const password = document.getElementById("authPassword").value;
        const errBox = document.getElementById("authError");
        try {
          if (authMode === "signup") {
            const name = document.getElementById("authName").value.trim();
            await Backend.signUp(email, password, name);
          } else {
            await Backend.signIn(email, password);
          }
          refreshHeaderAuth();
          renderAccount();
          updateSpecialDayBar();
          Backend.touchActivity();
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
      ? `<img src="${profile.avatarUrl}" alt="" class="avatar-photo" />`
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
          ${myUnread.map((n) => `<p style="margin:8px 0;">${n.message}</p>`).join("")}
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:6px;">
            <button type="button" class="btn btn-ghost" id="dismissNotificationsBtn">Gelesen, ausblenden</button>
            <button type="button" class="btn btn-ghost" id="muteNotifyBtn">${isNotifyMuted() ? "🔔 Ton wieder einschalten" : "🔕 Ton & Blinken stummschalten"}</button>
          </div>
        </div>` : ""}
        <div class="question-card profile-card-view">
          <button type="button" class="profile-points" id="pointsBreakdownBtn"><span class="num">${profile.points}</span><span class="empty-note">Punkte</span></button>
          <div class="profile-header">
            ${avatarHtml}
            <div class="profile-name-col">
              <h2 style="margin-bottom:2px;">${profile.name}${adminBadge(profile.isAdmin, profile.isOwner, profile.isModerator)}</h2>
              <div class="modal-meta-row" style="margin-top:0; justify-content:flex-start;">
                <button type="button" class="friend-name-btn" id="myFriendsToggle">👥 ${friendCount} ${friendCount === 1 ? "Freund" : "Freunde"}</button>
                ${profile.isPremium ? '<span class="empty-note">✨ Premium</span>' : ""}
                ${originFlag ? `<span class="empty-note">${originFlag} ${profile.origin}</span>` : ""}
              </div>
            </div>
          </div>
          <div class="modal-friends-list" id="myFriendsList" style="display:none; margin-top:10px;">
            ${myFriends.length ? myFriends.map((f) => `<button type="button" class="friend-list-row" data-view-friend-profile="${f.id}">${tinyAvatar(f)}<span class="name">${f.name}</span>${adminBadge(f.is_admin, f.is_owner, f.is_moderator)}</button>`).join("") : '<p class="empty-note">Noch keine Freunde — oben nach Namen suchen.</p>'}
          </div>
          ${profile.bio ? `<p class="empty-note" style="margin-top:10px;">${profile.bio}</p>` : `<button type="button" class="emoji-toggle-link" id="introPromptBtn" style="margin-top:8px;">✏️ Noch keine Beschreibung — jetzt vorstellen</button>`}
          ${hobbyReadout ? `<div class="trophy-case" style="margin-top:10px;">${hobbyReadout}</div>` : ""}
          ${renderExtendedSteckbrief(profile, "own")}
          <div class="badge-row">
            ${profile.badges.length ? profile.badges.map((b) => `<div class="badge-chip"><span class="emoji">🏅</span><span>${b}</span></div>`).join("") : '<p class="empty-note">Noch keine Abzeichen — spiel eine Runde in „Lernen"!</p>'}
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
      document.getElementById("pointsBreakdownBtn").addEventListener("click", () => showPointsBreakdown(profile));
      wireSteckbriefPager(area, renderAccount);
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
          setNotifyMuted(!isNotifyMuted());
          if (loginBtn) loginBtn.classList.toggle("notify-ring", !isNotifyMuted() && myUnread.length > 0);
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
            <h2>${profile.name}${adminBadge(profile.isAdmin, profile.isOwner, profile.isModerator)}</h2>
            <p class="empty-note">👥 ${friendCount} ${friendCount === 1 ? "Freund" : "Freunde"}${profile.isPremium ? " · ✨ Premium" : ""}</p>
          </div>
          <div class="profile-points"><div class="num">${profile.points}</div><div class="empty-note">Punkte</div></div>
        </div>
        <button type="button" class="emoji-toggle-link" id="previewProfileLink">👁️ Vorschau: So sehen andere dein Profil</button>
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
          <label>Geburtstag (optional — erscheint dann oben in der Leiste)</label>
          <input type="date" id="birthdayInput" value="${profile.birthday || ""}" />
        </div>
        <div class="form-field">
          <label>Hobbys &amp; Interessen (übe dabei gleich Artikel mit!)</label>
          ${(profile.hobbies || []).length ? `<p class="hobby-readout">✓ Ich mag: ${(profile.hobbies || []).map((n) => { const h = VocabData.HOBBIES.find((x) => x.noun === n); return h ? `${h.emoji} ${h.article} ${h.noun}` : n; }).join(", ")}</p>` : '<p class="empty-note">Noch nichts ausgewählt — antippen zum Hinzufügen.</p>'}
          <div class="hobby-chip-row">
            ${VocabData.HOBBIES.map((h) => `<button type="button" class="hobby-chip ${((profile.hobbies || []).includes(h.noun)) ? "selected" : ""}" data-hobby="${h.noun}">${h.emoji} ${h.article} ${h.noun}</button>`).join("")}
          </div>
        </div>
        <div class="form-field">
          <label>Woher kommst du?</label>
          <select id="originSelect" class="challenge-select">
            <option value="">Nicht angeben</option>
            ${VocabData.COUNTRIES.map((c) => `<option value="${c.name}" ${profile.origin === c.name ? "selected" : ""}>${c.flag} ${c.name}</option>`).join("")}
          </select>
        </div>
        <p class="eyebrow" style="margin-top:20px;">📋 Erweiterter Steckbrief — mehrere Seiten</p>
        <div class="order-toggle" id="profilePageSwitch" style="margin-bottom:14px;">
          <button type="button" class="order-pill" data-ppage="0" aria-selected="${profileEditPage === 0}">1 · 🌍 Sprachen</button>
          <button type="button" class="order-pill" data-ppage="1" aria-selected="${profileEditPage === 1}">2 · 🎬 Kultur</button>
          <button type="button" class="order-pill" data-ppage="2" aria-selected="${profileEditPage === 2}">3 · 💭 Gedanken</button>
          <button type="button" class="order-pill" data-ppage="3" aria-selected="${profileEditPage === 3}">4 · ✨ Extra</button>
        </div>
        <div id="profilePageContent">
          ${profileEditPage === 0 ? `
            <div class="form-field">
              <label>Welche Sprachen sprichst oder lernst du?</label>
              <div class="hobby-chip-row">
                ${VocabData.LANGUAGES.map((l) => `<button type="button" class="hobby-chip lang-chip ${((profile.languages || []).includes(l)) ? "selected" : ""}" data-lang="${l}">${l}</button>`).join("")}
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
            <div class="form-field">
              <label>Lieblingsschauspieler:in</label>
              <input type="text" id="extraActorInput" maxlength="60" value="${profileEditDraft.favActor !== undefined ? profileEditDraft.favActor : (extra.favActor || "")}" placeholder="z. B. Til Schweiger" />
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
          extraMottoInput: "motto", extraColorInput: "favColor", extraAnimalInput: "favAnimal", extraSeasonSelect: "favSeason",
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
        favActor: val("extraActorInput", extra.favActor),
        motto: val("extraMottoInput", extra.motto),
        favColor: val("extraColorInput", extra.favColor),
        favAnimal: val("extraAnimalInput", extra.favAnimal),
        favSeason: val("extraSeasonSelect", extra.favSeason),
      };
      const [okBio, okBday, okOrigin, extendedResult] = await Promise.all([
        Backend.saveBio(bioText),
        Backend.saveBirthday(document.getElementById("birthdayInput").value.trim()),
        Backend.saveOrigin(document.getElementById("originSelect").value),
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
    const list = compact ? profile.trophies.slice(0, 4) : profile.trophies;
    const extra = compact && profile.trophies.length > 4 ? profile.trophies.slice(4) : [];
    return `<div class="breakdown-list" style="margin-top:16px;">
      <p class="eyebrow" style="margin-top:0;">🏆 Vitrine</p>
      <div class="trophy-case ${compact ? "trophy-case-compact" : ""}">
        ${list.map((t) => `<div class="trophy-chip"><span class="emoji">🏆</span><span>${t}</span></div>`).join("")}
        ${extra.length ? `<button type="button" class="trophy-chip trophy-chip-more" id="trophyMoreBtn">+${extra.length} mehr anzeigen</button>` : ""}
      </div>
      ${extra.length ? `<div class="trophy-more-list" id="trophyMoreList" style="display:none;">
        ${extra.map((t) => `<div class="trophy-chip"><span class="emoji">🏆</span><span>${t}</span></div>`).join("")}
      </div>` : ""}
    </div>`;
  }
  function wireTrophyCaseToggle() {
    const btn = document.getElementById("trophyMoreBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const list = document.getElementById("trophyMoreList");
      list.style.display = "flex";
      btn.style.display = "none";
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

  function tinyAvatar(m) {
    if (m.avatar_url) return `<img src="${m.avatar_url}" class="tiny-avatar" alt="" />`;
    if (m.avatar_emoji) return `<span class="tiny-avatar tiny-avatar-emoji">${m.avatar_emoji}</span>`;
    const initials = (m.name || "?").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    return `<span class="tiny-avatar tiny-avatar-initials">${initials}</span>`;
  }

  // Admin-Abzeichen — überall dort, wo ein Name/Profil auftaucht, konsistent anzeigbar
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
        ${languages.length ? `<div class="trophy-case" style="margin-top:4px;">${languages.map((l) => `<div class="trophy-chip">🗣️ ${l}</div>`).join("")}</div>` : ""}
        ${favCountry ? `<div class="breakdown-row"><span>🌍 Lieblingsland</span><span>${favCountry}</span></div>` : ""}
        ${extra.dreamDestination ? `<div class="breakdown-row"><span>✈️ Traumreiseziel</span><span>${extra.dreamDestination}</span></div>` : ""}
        ${extra.visitedCountries ? `<div class="breakdown-row"><span>🧳 Schon bereist</span><span>${extra.visitedCountries}</span></div>` : ""}
      ` },
      { icon: "🎬", label: "Kultur", html: `
        ${favMovie ? `<div class="breakdown-row"><span>🎬 Lieblingsfilm</span><span>${favMovie}</span></div>` : ""}
        ${favSeries ? `<div class="breakdown-row"><span>📺 Lieblingsserie</span><span>${favSeries}</span></div>` : ""}
        ${favSong ? `<div class="breakdown-row"><span>🎵 Lieblingslied</span><span>${favSong}</span></div>` : ""}
        ${extra.favActor ? `<div class="breakdown-row"><span>🎭 Lieblingsschauspieler:in</span><span>${extra.favActor}</span></div>` : ""}
      ` },
      { icon: "💭", label: "Gedanken", html: `
        ${extra.motto ? `<div class="breakdown-row"><span>🌟 Lebensmotto</span><span>${extra.motto}</span></div>` : ""}
        ${favQuote ? `<div class="poem-box" style="border-left-color:var(--teal-400);"><p style="margin:0;">💬 „${favQuote}"</p></div>` : ""}
        ${poem ? `<div class="poem-box"><p style="white-space:pre-wrap; font-style:italic; margin:0;">„${poem}"</p></div>` : ""}
      ` },
      { icon: "✨", label: "Extra", html: `
        ${favFood ? `<div class="breakdown-row"><span>🍽️ Lieblingsessen</span><span>${favFood}</span></div>` : ""}
        ${favDrink ? `<div class="breakdown-row"><span>🥤 Lieblingsgetränk</span><span>${favDrink}</span></div>` : ""}
        ${extra.favColor ? `<div class="breakdown-row"><span>🎨 Lieblingsfarbe</span><span>${extra.favColor}</span></div>` : ""}
        ${extra.favAnimal ? `<div class="breakdown-row"><span>🐾 Lieblingstier</span><span>${extra.favAnimal}</span></div>` : ""}
        ${extra.favSeason ? `<div class="breakdown-row"><span>🍂 Lieblingsjahreszeit</span><span>${extra.favSeason}</span></div>` : ""}
      ` },
    ];
    const nonEmpty = pages.map((pg) => pg.html.trim().length > 0);
    if (!nonEmpty.some(Boolean)) return "";
    const activePage = Math.min(profileViewPages[viewId] || 0, pages.length - 1);
    return `<div class="breakdown-list" style="margin-top:12px;">
      <div class="order-toggle" data-steckbrief-switch="${viewId}" style="margin-bottom:10px;">
        ${pages.map((pg, i) => `<button type="button" class="order-pill" data-svpage="${i}" aria-selected="${activePage === i}">${i + 1} · ${pg.icon}</button>`).join("")}
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

  function adminBadge(isAdminFlag, isOwnerFlag, isModeratorFlag) {
    if (isOwnerFlag) return '<span class="admin-badge admin-badge-owner" title="Seitenbetreiber">👑 Betreiber</span>';
    if (isAdminFlag) return '<span class="admin-badge" title="Administrator">🛡️ Admin</span>';
    if (isModeratorFlag) return '<span class="admin-badge admin-badge-mod" title="Moderator">🧹 Mod</span>';
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

  async function openProfileModal(id) {
    const p = await Backend.getPublicProfile(id);
    if (!p) {
      alert("Dieses Profil konnte nicht geladen werden. Das liegt entweder an Row Level Security (RLS) in Supabase, oder daran, dass eine kürzlich hinzugekommene Spalte in der Tabelle „profiles\" noch fehlt. Öffne die Browser-Konsole für die genaue Fehlermeldung, und führe sicherheitshalber das komplette Nachrüst-SQL aus dem README (Abschnitt „Nachrüst-SQL\") im Supabase SQL-Editor aus.");
      return;
    }
    const initials = (p.name || "?").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const avatarHtml = p.avatar_url
      ? `<img src="${p.avatar_url}" class="avatar-photo" alt="" />`
      : p.avatar_emoji
        ? `<div class="initials-avatar emoji-avatar">${p.avatar_emoji}</div>`
        : `<div class="initials-avatar">${initials}</div>`;
    const me = Backend.currentUser();
    const isMe = me && me.id === p.id;
    const theirFriends = await Backend.getFriends(p.id);
    const alreadyFriends = me && !isMe ? theirFriends.some((f) => f.id === me.id) : false;
    const originFlag = p.origin ? (VocabData.COUNTRIES.find((c) => c.name === p.origin) || {}).flag || "🌍" : "";
    const trophies = (p.trophies || []).slice(0, 4);
    const trophyOverflow = (p.trophies || []).length - trophies.length;

    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("div", { class: "profile-modal-card" },
        Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
        Core.el("div", { class: "profile-modal-header", html: `${avatarHtml}<h2>${p.name}${adminBadge(p.is_admin, p.is_owner, p.is_moderator)}</h2>` }),
        Core.el("p", { class: "modal-points-line" }, `🎯 ${p.points || 0} Punkte`),
        Core.el("p", { class: "empty-note", style: "text-align:center; margin-top:-4px;" }, lastSeenText(p.last_active, p.online)),
        Core.el("p", { class: "empty-note" }, p.bio || "Noch keine Beschreibung."),
        Core.el("div", { class: "modal-meta-row" },
          Core.el("button", { type: "button", class: "friend-name-btn", id: "modalFriendsToggle" }, `👥 ${theirFriends.length} ${theirFriends.length === 1 ? "Freund" : "Freunde"}`),
          originFlag ? Core.el("span", { class: "empty-note" }, `${originFlag} ${p.origin}`) : ""
        ),
        Core.el("div", { class: "modal-friends-list", id: "modalFriendsList", style: "display:none;" },
          theirFriends.length
            ? theirFriends.map((f) => Core.el("button", {
                type: "button", class: "friend-list-row", onclick: () => { box.remove(); openProfileModal(f.id); },
              }, tinyAvatarNode(f), Core.el("span", { class: "name" }, f.name)))
            : Core.el("p", { class: "empty-note" }, "Noch keine Freunde.")
        ),
        p.hobbies && p.hobbies.length
          ? Core.el("div", { class: "trophy-case", style: "justify-content:center; margin-top:8px;",
              html: p.hobbies.map((h) => {
                const hobby = VocabData.HOBBIES.find((x) => x.noun === h);
                return hobby ? `<div class="trophy-chip">${hobby.emoji} ${hobby.article} ${hobby.noun}</div>` : "";
              }).join("") })
          : "",
        Core.el("div", { html: renderExtendedSteckbrief(p, "modal-" + p.id) }),
        Core.el("div", { class: "trophy-case trophy-case-compact", id: "modalTrophyCase", style: "justify-content:center; margin-top:10px;",
          html: trophies.map((t) => `<div class="trophy-chip"><span class="emoji">🏆</span><span>${t}</span></div>`).join("")
              + (trophyOverflow > 0 ? `<button type="button" class="trophy-chip trophy-chip-more" id="modalTrophyMoreBtn">+${trophyOverflow} mehr anzeigen</button>` : "")
              + (p.badges && p.badges.length ? p.badges.slice(0, 3).map((b) => `<div class="trophy-chip"><span class="emoji">🏅</span><span>${b}</span></div>`).join("") : "") }),
        trophyOverflow > 0 ? Core.el("div", { class: "trophy-more-list", id: "modalTrophyMoreList", style: "display:none;",
          html: (p.trophies || []).slice(4).map((t) => `<div class="trophy-chip"><span class="emoji">🏆</span><span>${t}</span></div>`).join("") }) : "",
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
    document.body.appendChild(box);
    wireSteckbriefPager(box, () => { box.remove(); openProfileModal(id); });
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
    if (f.avatar_url) return Core.el("img", { src: f.avatar_url, class: "tiny-avatar", alt: "" });
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

  loginBtn.addEventListener("click", () => activateTab("view-profile"));

  /* ============================================================
     FREUNDE
     ============================================================ */
  let friendChallengeTarget = null;

  async function renderInbox() {
    const area = document.getElementById("inboxArea");
    if (!Backend.currentUser()) { area.innerHTML = '<p class="empty-note">Bitte zuerst anmelden.</p>'; return; }
    const [messages, friends] = await Promise.all([Backend.getMyMessages(), Backend.getFriends()]);
    area.innerHTML = `
      <div class="question-card">
        <h3>✉️ Neue Nachricht schreiben</h3>
        <div class="form-field">
          <select id="inboxRecipientSelect" class="challenge-select">
            <option value="">Freund auswählen…</option>
            ${friends.map((f) => `<option value="${f.id}">${f.name}</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <textarea id="inboxMessageInput" class="guestbook-form-textarea" maxlength="500" placeholder="Deine Nachricht…"></textarea>
        </div>
        <button type="button" class="btn btn-coffee" id="inboxSendBtn">Senden</button>
        <div class="form-error" id="inboxSendError"></div>
      </div>
      <div class="question-card" style="margin-top:14px;">
        <h3>📬 Dein Postfach</h3>
        ${messages.length ? messages.map((m) => `
          <div class="breakdown-row" style="align-items:flex-start; flex-direction:column; gap:4px; ${!m.read ? "border-left:3px solid var(--amber-400); padding-left:10px;" : ""}">
            <div style="display:flex; justify-content:space-between; width:100%;">
              <strong>${m.is_system ? "🔔 System" : (m.author_name || "Unbekannt")}</strong>
              <span class="empty-note">${m.created_at ? new Date(m.created_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : ""}</span>
            </div>
            <p style="white-space:pre-wrap; margin:0;">${m.body}</p>
          </div>`).join("") : '<p class="empty-note">Noch keine Nachrichten — hier erscheinen auch automatische Zusammenfassungen, nachdem du eine Übungsrunde gespielt hast.</p>'}
      </div>
    `;
    document.getElementById("inboxSendBtn").addEventListener("click", async () => {
      const to = document.getElementById("inboxRecipientSelect").value;
      const body = document.getElementById("inboxMessageInput").value;
      const errBox = document.getElementById("inboxSendError");
      if (!to) { errBox.textContent = "⚠️ Bitte einen Freund auswählen."; return; }
      try {
        await Backend.sendPrivateMessage(to, body);
        renderInbox();
      } catch (err) {
        errBox.textContent = "⚠️ " + err.message;
      }
    });
    const unreadIds = messages.filter((m) => !m.read).map((m) => m.id);
    if (unreadIds.length) await Backend.markMessagesRead(unreadIds);
  }

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

      ${incoming.length ? `<div class="question-card" style="margin-top:14px;">
        <h3>📥 Freundschaftsanfragen</h3>
        ${incoming.map((r) => `<div class="breakdown-row"><span>${r.name}</span><button type="button" class="btn btn-coffee" data-accept="${r.id}">Annehmen</button></div>`).join("")}
      </div>` : ""}

      ${incomingChallenges.length ? `<div class="question-card" style="margin-top:14px;">
        <h3>🎮 Herausforderungen an dich</h3>
        ${incomingChallenges.map((c) => `<div class="breakdown-row"><span>${c.fromName} · ${c.categories[0] === "memory" ? "🧠 Gehirnjogger" : c.categories.map((id) => ExerciseData.getCategory(id).icon).join(" ")}</span><button type="button" class="btn btn-coffee" data-accept-challenge="${c.id}" data-cats="${c.categories.join(",")}" data-from-name="${c.fromName}">Annehmen</button></div>`).join("")}
      </div>` : ""}

      <div class="question-card" style="margin-top:14px;">
        <h3>👥 Deine Freunde</h3>
        ${friends.length ? friends.map((f) => `
          <div class="breakdown-row">
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" class="friend-bulk-check" data-bulk-friend="${f.id}" data-bulk-name="${f.name}" />
              <div>
                <button type="button" class="friend-name-btn" data-view-friend-profile="${f.id}">${f.online ? '<span class="online-dot"></span>' : ""}${f.name} · ${f.points} Pkt.${adminBadge(f.is_admin, f.is_owner, f.is_moderator)}</button>
                <div class="empty-note" style="font-size:0.72rem; margin-top:2px;">${lastSeenText(f.last_active, f.online)}</div>
              </div>
            </div>
            <button type="button" class="btn btn-ghost" data-challenge="${f.id}" data-name="${f.name}">🎮 Herausfordern</button>
          </div>`).join("") : '<p class="empty-note">Noch keine Freunde — oben nach Namen suchen.</p>'}
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
      btn.addEventListener("click", async () => { await Backend.acceptFriendRequest(btn.dataset.accept); checkNotifications(); renderFriends(); });
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
        if (categoryIds[0] === "memory") {
          activateTab("view-learn");
          document.querySelector('#learnSubnav [data-sub="sub-memory"]').click();
          activeMemoryChallengeId = challengeId;
          activeMemoryOpponentName = btn.dataset.fromName || "";
          newMemoryGame();
          return;
        }
        activateTab("view-learn");
        document.querySelector('#learnSubnav [data-sub="sub-exercises"]').click();
        Quiz.startSession(categoryIds, "leicht", { challengeId });
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
          ${ExerciseData.CATEGORIES.map((c) => `<div class="category-card" data-pick-cat="${c.id}"><div class="cat-checkbox"></div><div class="cat-body"><div class="cat-title-row"><span class="cat-icon">${c.icon}</span><span>${c.title}</span></div></div></div>`).join("")}
        </div>
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
          renderQuestion();
        } finally {
          challengePickInProgress = false;
        }
      });
    });
  }

  async function renderRanking() {
    const area = document.getElementById("rankingArea");
    area.innerHTML = '<p class="empty-note">Lade Ranking…</p>';
    const rows = await Backend.getRanking();
    area.innerHTML = `
      <div class="question-card">
        <h3>🏆 Heutiges Ranking</h3>
        <table class="rank-table">
          ${rows.length ? rows.map((r, i) => `<tr>${r.user_id ? `<td>${i + 1}.</td><td><button type="button" class="friend-name-btn" data-view-ranked="${r.user_id}">${r.name}</button></td>` : `<td>${i + 1}.</td><td>${r.name}</td>`}<td>${r.points} Pkt.</td></tr>`).join("") : '<tr><td class="empty-note">Noch keine Einträge heute — sei die/der Erste!</td></tr>'}
        </table>
      </div>
    `;
    area.querySelectorAll("[data-view-ranked]").forEach((btn) => {
      btn.addEventListener("click", () => openProfileModal(btn.dataset.viewRanked));
    });
  }

  async function renderGuestbook() {
    const area = document.getElementById("guestbookArea");
    const entries = await Backend.getGuestbook();
    const user = Backend.currentUser();
    area.innerHTML = `
      <div class="question-card">
        <h3>📖 Gästebuch</h3>
        ${entries.map((e) => `<div class="guestbook-entry">${e.user_id ? `<button type="button" class="friend-name-btn gb-name" data-view-gb-author="${e.user_id}">${e.name}</button>` : `<div class="gb-name">${e.name}</div>`}<p>${e.message}</p><div class="gb-date">${new Date(e.date).toLocaleString("de-DE")}</div>${Backend.canModerate() ? `<button type="button" class="btn btn-ghost" style="margin-top:6px;" data-admin-delete-gb="${e.id}">🛠️ Löschen</button>` : ""}</div>`).join("") || '<p class="empty-note">Noch keine Einträge.</p>'}
        <form class="guestbook-form" id="guestbookForm">
          ${!user ? '<input type="text" id="gbName" placeholder="Dein Name" required />' : ""}
          <textarea id="gbMessage" placeholder="Hinterlasse eine Nachricht für Alex…" required></textarea>
          <button type="submit" class="btn-submit">Eintragen</button>
        </form>
      </div>
    `;
    document.getElementById("guestbookForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = user ? Backend.currentProfile().name : document.getElementById("gbName").value.trim();
      const message = document.getElementById("gbMessage").value.trim();
      if (!message) return;
      await Backend.addGuestbookEntry(name, message);
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
      if (pill.dataset.sub === "sub-inbox") renderInbox();
    });
  });

  // Beim Start: gespeichertes Theme des eingeloggten Profils anwenden, sonst Standard behalten
  applyTheme((Backend.currentProfile() && Backend.currentProfile().theme) || sessionTheme);

  // Falls Supabase verbunden ist: bestehende Anmeldung (Session) wiederherstellen
  Backend.restoreSession().then(() => {
    refreshHeaderAuth();
    renderAccount();
    renderSetup();
    applyTheme((Backend.currentProfile() && Backend.currentProfile().theme) || sessionTheme);
    updateSpecialDayBar();
  });

  // Online-Status: alle 60s "zuletzt aktiv" aktualisieren, solange eingeloggt
  setInterval(() => { if (Backend.currentUser()) Backend.touchActivity(); }, 60000);
})();
