/* =========================================================
   APP.JS — verbindet alle Module mit der Oberfläche
   ========================================================= */
(function () {
  "use strict";

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
  wireSubnav("knowledgeSubnav");
  wireSubnav("profileSubnav");

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

  function isThemeUnlocked(t, profile) {
    if (!t.unlock) return true;
    if (!profile) return false;
    if (t.unlock.type === "points") return profile.points >= t.unlock.value;
    if (t.unlock.type === "trophy") return (profile.trophies || []).some((tr) => tr.includes(t.unlock.match));
    return true;
  }

  function renderDesign() {
    const area = document.getElementById("designArea");
    if (!area) return;
    const profile = Backend.currentProfile();
    const active = (profile && profile.theme) || sessionTheme;
    const themeCard = (t) => {
      const unlocked = isThemeUnlocked(t, profile);
      const conditionText = !t.unlock ? "" : t.unlock.type === "points" ? `🔒 Ab ${t.unlock.value} Punkten` : `🔒 Pokal „${t.unlock.match}" nötig`;
      return `
      <div class="category-card ${t.id === active ? "selected" : ""} ${!unlocked ? "theme-locked" : ""}" data-theme-pick="${unlocked ? t.id : ""}" ${!unlocked ? `data-locked-info="${conditionText}"` : ""}>
        <div class="cat-checkbox">${t.id === active ? "✓" : unlocked ? "" : "🔒"}</div>
        <div class="cat-body">
          <div class="cat-title-row"><span class="cat-icon">${unlocked ? t.emoji : "🔒"}</span><span>${t.name}</span></div>
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
  function goToFriendsInbox() {
    activateTab("view-profile");
    document.querySelector('#profileSubnav [data-sub="sub-friends"]').click();
  }
  function updateNotifyBadge(count) {
    const badge = document.getElementById("loginBtnBadge");
    if (badge) badge.style.display = count > 0 ? "block" : "none";
    const tabBadge = document.getElementById("friendsTabBadge");
    if (tabBadge) tabBadge.style.display = count > 0 ? "block" : "none";
  }
  let lastFriendReqCount = 0;
  let lastChallengeReqCount = 0;
  let notifyPrimed = false;
  async function checkNotifications() {
    if (!Backend.currentUser()) { updateNotifyBadge(0); return; }
    const [requests, challenges] = await Promise.all([Backend.getIncomingRequests(), Backend.getMyChallenges()]);
    const challengeCount = challenges.incoming.length;
    if (notifyPrimed) {
      if (requests.length > lastFriendReqCount) showToast("👥 Neue Freundschaftsanfrage — antippen zum Annehmen", goToFriendsInbox);
      if (challengeCount > lastChallengeReqCount) showToast("🎮 Neue Duell-Herausforderung — antippen zum Annehmen", goToFriendsInbox);
    }
    lastFriendReqCount = requests.length;
    lastChallengeReqCount = challengeCount;
    notifyPrimed = true;
    updateNotifyBadge(requests.length + challengeCount);
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

    const cards = ExerciseData.CATEGORIES.map((cat) => {
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
            <button type="button" class="challenge-friend-pill offline" data-challenge-friend="${f.id}" disabled title="Gerade nicht online">
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
  let activeMemoryChallengeId = null;

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
        <label style="font-size:0.82rem; font-weight:700; color:var(--cream-200);">🧠 Optional: gegen einen Freund spielen (Gehirnjogger-Duell)</label>
        <select id="memoryChallengeSelect" class="challenge-select">
          <option value="">Kein Duell — nur für mich üben</option>
          ${memFriends.map((f) => `<option value="${f.id}" ${memoryChallengeFriendId === f.id ? "selected" : ""}>${f.name}${f.online ? " 🟢" : ""}</option>`).join("")}
        </select>
      </div>` : "";

    memoryArea.innerHTML = `
      ${activeMemoryChallengeId ? '<div class="demo-banner">🎮 Duell-Runde läuft — dein Ergebnis wird nach dieser Runde mit deinem Gegner verglichen.</div>' : ""}
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
    document.getElementById("memoryRestart").addEventListener("click", () => { activeMemoryChallengeId = null; newMemoryGame(); });
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
    const memChallengeSelect = document.getElementById("memoryChallengeSelect");
    if (memChallengeSelect) {
      memChallengeSelect.addEventListener("change", async (e) => {
        memoryChallengeFriendId = e.target.value;
        if (memoryChallengeFriendId) {
          try {
            activeMemoryChallengeId = await Backend.createChallenge(memoryChallengeFriendId, ["memory"]);
          } catch (err) {
            alert(err.message || "Duell konnte nicht gestartet werden.");
            memoryChallengeFriendId = "";
          }
        }
        newMemoryGame();
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
            activeMemoryChallengeId = null;
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
    activeMemoryChallengeId = null;
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

  let communityLoaded = false;
  async function renderCommunityTexts() {
    const box = document.getElementById("communityStandaloneArea");
    if (!box) return;
    const texts = await Backend.getApprovedCommunityTexts();
    const user = Backend.currentUser();

    box.innerHTML = `
      <p class="empty-note">Lesetexte von anderen Lernenden — mit Sprachniveau markiert. Bilder können aktuell noch nicht mit eingereicht werden, nur Text.</p>
      ${texts.length ? texts.map((t) => `
        <div class="material-card">
          <div class="community-text-head">
            <span class="level-badge">${t.level}</span>
            <h3 style="margin:0;">${t.title}</h3>
          </div>
          <p style="white-space:pre-wrap;">${t.body}</p>
          <p class="empty-note" style="margin-top:8px;">✍️ gepostet von ${t.author_name}</p>
        </div>`).join("") : '<p class="empty-note">Noch keine freigeschalteten Texte — sei die/der Erste!</p>'}

      ${user ? `
        <div class="material-card" style="margin-top:14px;">
          <h3>✏️ Eigenen Text einreichen</h3>
          <p class="empty-note">Wird von Alex geprüft, bevor er für alle sichtbar wird.</p>
          <div class="form-field"><label>Titel</label><input type="text" id="ctTitle" maxlength="80" /></div>
          <div class="form-field">
            <label>Sprachniveau</label>
            <select id="ctLevel" class="challenge-select">
              ${["A1","A2","B1","B2","C1","C2"].map((l) => `<option value="${l}">${l}</option>`).join("")}
            </select>
          </div>
          <div class="form-field"><label>Text</label><textarea id="ctBody" class="guestbook-form-textarea" style="min-height:120px;" maxlength="3000"></textarea></div>
          <div class="form-error" id="ctError"></div>
          <button type="button" class="btn-submit" id="ctSubmitBtn">Einreichen</button>
        </div>` : '<p class="empty-note" style="margin-top:10px;">Melde dich an, um eigene Texte einzureichen.</p>'}
    `;

    const submitBtn = document.getElementById("ctSubmitBtn");
    if (submitBtn) {
      submitBtn.addEventListener("click", async () => {
        const title = document.getElementById("ctTitle").value.trim();
        const level = document.getElementById("ctLevel").value;
        const body = document.getElementById("ctBody").value.trim();
        const errBox = document.getElementById("ctError");
        if (!title || !body) { errBox.textContent = "Bitte Titel und Text ausfüllen."; return; }
        try {
          await Backend.submitCommunityText({ title, level, body });
          submitBtn.textContent = "Eingereicht ✓ (wartet auf Freischaltung)";
          submitBtn.disabled = true;
        } catch (err) {
          errBox.textContent = err.message || "Konnte nicht eingereicht werden.";
        }
      });
    }
  }
  document.querySelector('#knowledgeSubnav [data-sub="sub-community"]').addEventListener("click", () => {
    if (!communityLoaded) { communityLoaded = true; renderCommunityTexts(); }
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
  const loginBtn = document.getElementById("loginBtn");
  const loginBtnLabel = document.getElementById("loginBtnLabel");

  function refreshHeaderAuth() {
    const user = Backend.currentUser();
    const profile = Backend.currentProfile();
    const icon = document.getElementById("loginBtnIcon");
    loginBtnLabel.textContent = user ? user.name.split(" ")[0] : "Anmelden";
    loginBtn.classList.toggle("btn-icon-only", !user);
    if (user && profile) {
      if (profile.avatarUrl) {
        icon.innerHTML = `<img src="${profile.avatarUrl}" class="header-avatar" alt="" />`;
      } else if (profile.avatarEmoji) {
        icon.innerHTML = `<span class="header-avatar header-avatar-emoji">${profile.avatarEmoji}</span>`;
      } else {
        const initials = profile.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
        icon.innerHTML = `<span class="header-avatar header-avatar-initials">${initials}</span>`;
      }
    } else {
      icon.innerHTML = "👤";
    }
  }

  let authMode = "login";
  let profileEditMode = false;

  async function renderAccount() {
    const area = document.getElementById("accountArea");
    const user = Backend.currentUser();
    const profile = Backend.currentProfile();

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
      area.innerHTML = `
        ${demoBanner}
        <div class="question-card profile-card-view">
          <div class="profile-points"><span class="num">${profile.points}</span><span class="empty-note">Punkte</span></div>
          <div class="profile-header">
            ${avatarHtml}
            <div class="profile-name-col">
              <h2>${profile.name}</h2>
              <div class="modal-meta-row" style="margin-top:2px;">
                <button type="button" class="friend-name-btn" id="myFriendsToggle">👥 ${friendCount} ${friendCount === 1 ? "Freund" : "Freunde"}</button>
                ${profile.isPremium ? '<span class="empty-note">✨ Premium</span>' : ""}
                ${originFlag ? `<span class="empty-note">${originFlag} ${profile.origin}</span>` : ""}
              </div>
            </div>
          </div>
          <div class="modal-friends-list" id="myFriendsList" style="display:none; margin-top:10px;">
            ${myFriends.length ? myFriends.map((f) => `<button type="button" class="friend-list-row" data-view-friend-profile="${f.id}">${tinyAvatar(f)}<span class="name">${f.name}</span></button>`).join("") : '<p class="empty-note">Noch keine Freunde — oben nach Namen suchen.</p>'}
          </div>
          ${profile.bio ? `<p class="empty-note" style="margin-top:10px;">${profile.bio}</p>` : `<button type="button" class="emoji-toggle-link" id="introPromptBtn" style="margin-top:8px;">✏️ Noch keine Beschreibung — jetzt vorstellen</button>`}
          ${hobbyReadout ? `<div class="trophy-case" style="margin-top:10px;">${hobbyReadout}</div>` : ""}
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
        ${renderTrophyCase(profile)}
        ${await renderRecentMembers()}
        ${await renderActivityFeed()}
        ${profile.history.length ? `<div class="breakdown-list" style="margin-top:16px;">
          <p class="eyebrow" style="margin-top:0;">🎯 Deine letzten Ergebnisse</p>
          ${profile.history.slice(0, 8).map((h) => `<div class="breakdown-row"><span>${new Date(h.playedAt).toLocaleDateString("de-DE")}</span><span>${h.character}</span><span>${h.percent}%</span></div>`).join("")}
        </div>` : ""}
      `;
      document.getElementById("editProfileBtn").addEventListener("click", () => { profileEditMode = true; renderAccount(); });
      const introBtn = document.getElementById("introPromptBtn");
      if (introBtn) introBtn.addEventListener("click", () => { profileEditMode = true; renderAccount(); });
      document.getElementById("myFriendsToggle").addEventListener("click", () => {
        const list = document.getElementById("myFriendsList");
        list.style.display = list.style.display === "none" ? "flex" : "none";
      });
      document.getElementById("logoutBtn").addEventListener("click", async () => {
        await Backend.signOut();
        refreshHeaderAuth();
        renderAccount();
      });
      area.querySelectorAll("[data-view-photo]").forEach((img) => {
        img.addEventListener("click", () => openLightbox(img.dataset.viewPhoto, "Galerie-Foto"));
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
            <h2>${profile.name}</h2>
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
        ${myFriends.map((f) => `<button type="button" class="friend-list-row" data-view-friend-profile="${f.id}">${tinyAvatar(f)}<span class="name">${f.name}</span></button>`).join("")}
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
      const bioText = document.getElementById("bioInput").value.trim();
      const [okBio, okBday, okOrigin] = await Promise.all([
        Backend.saveBio(bioText),
        Backend.saveBirthday(document.getElementById("birthdayInput").value.trim()),
        Backend.saveOrigin(document.getElementById("originSelect").value),
      ]);
      if (!okBio || !okBday || !okOrigin) {
        errBox.textContent = "⚠️ Konnte nicht dauerhaft gespeichert werden — vermutlich blockiert Row Level Security (RLS) das Schreiben in Supabase. Bitte im SQL-Editor ausführen: alter table profiles disable row level security;";
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
    const extra = compact && profile.trophies.length > 4 ? profile.trophies.length - 4 : 0;
    return `<div class="breakdown-list" style="margin-top:16px;">
      <p class="eyebrow" style="margin-top:0;">🏆 Vitrine</p>
      <div class="trophy-case ${compact ? "trophy-case-compact" : ""}">
        ${list.map((t) => `<div class="trophy-chip"><span class="emoji">🏆</span><span>${t}</span></div>`).join("")}
        ${extra ? `<div class="trophy-chip trophy-chip-more">+${extra} mehr</div>` : ""}
      </div>
    </div>`;
  }

  function tinyAvatar(m) {
    if (m.avatar_url) return `<img src="${m.avatar_url}" class="tiny-avatar" alt="" />`;
    if (m.avatar_emoji) return `<span class="tiny-avatar tiny-avatar-emoji">${m.avatar_emoji}</span>`;
    const initials = (m.name || "?").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    return `<span class="tiny-avatar tiny-avatar-initials">${initials}</span>`;
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
      alert("Dieses Profil konnte nicht geladen werden. Das liegt vermutlich an Row Level Security (RLS) in Supabase, die das Lesen fremder Profile blockiert. Bitte im SQL-Editor ausführen:\n\nalter table profiles disable row level security;");
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
        Core.el("div", { class: "profile-modal-header", html: `${avatarHtml}<h2>${p.name}</h2>` }),
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
        Core.el("div", { class: "trophy-case trophy-case-compact", style: "justify-content:center; margin-top:10px;",
          html: trophies.map((t) => `<div class="trophy-chip"><span class="emoji">🏆</span><span>${t}</span></div>`).join("")
              + (trophyOverflow > 0 ? `<div class="trophy-chip trophy-chip-more">+${trophyOverflow} mehr</div>` : "")
              + (p.badges && p.badges.length ? p.badges.slice(0, 3).map((b) => `<div class="trophy-chip"><span class="emoji">🏅</span><span>${b}</span></div>`).join("") : "") }),
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
        )
      )
    );
    document.body.appendChild(box);
    document.getElementById("modalFriendsToggle").addEventListener("click", () => {
      const list = document.getElementById("modalFriendsList");
      list.style.display = list.style.display === "none" ? "flex" : "none";
    });
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
        ${incomingChallenges.map((c) => `<div class="breakdown-row"><span>${c.fromName} · ${c.categories[0] === "memory" ? "🧠 Gehirnjogger" : c.categories.map((id) => ExerciseData.getCategory(id).icon).join(" ")}</span><button type="button" class="btn btn-coffee" data-accept-challenge="${c.id}" data-cats="${c.categories.join(",")}">Annehmen</button></div>`).join("")}
      </div>` : ""}

      <div class="question-card" style="margin-top:14px;">
        <h3>👥 Deine Freunde</h3>
        ${friends.length ? friends.map((f) => `
          <div class="breakdown-row">
            <button type="button" class="friend-name-btn" data-view-friend-profile="${f.id}">${f.online ? '<span class="online-dot"></span>' : ""}${f.name} · ${f.points} Pkt.</button>
            <button type="button" class="btn btn-ghost" data-challenge="${f.id}" data-name="${f.name}">🎮 Herausfordern</button>
          </div>`).join("") : '<p class="empty-note">Noch keine Freunde — oben nach Namen suchen.</p>'}
      </div>

      ${outgoingChallenges.length ? `<div class="question-card" style="margin-top:14px;">
        <h3>📤 Deine Duelle</h3>
        ${outgoingChallenges.map((c) => `<div class="breakdown-row"><span>vs. ${c.toName}</span><span class="empty-note">${c.status === "completed" ? (c.winner ? (c.winner === c.from ? "🏆 Gewonnen" : "Verloren") : "🤝 Unentschieden") : "Warte auf Gegner…"}</span></div>`).join("")}
      </div>` : ""}

      <div id="challengePicker"></div>
    `;

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
        friendChallengeTarget = { id: btn.dataset.challenge, name: btn.dataset.name };
        renderChallengePicker();
      });
    });

    area.querySelectorAll("[data-accept-challenge]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const categoryIds = btn.dataset.cats.split(",");
        const challengeId = btn.dataset.acceptChallenge;
        checkNotifications();
        if (categoryIds[0] === "memory") {
          activateTab("view-learn");
          document.querySelector('#learnSubnav [data-sub="sub-memory"]').click();
          activeMemoryChallengeId = challengeId;
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
    box.querySelectorAll("[data-pick-cat]").forEach((card) => {
      card.addEventListener("click", async () => {
        const categoryId = card.dataset.pickCat;
        const challengeId = await Backend.createChallenge(friendChallengeTarget.id, [categoryId]);
        friendChallengeTarget = null;
        activateTab("view-learn");
        document.querySelector('#learnSubnav [data-sub="sub-exercises"]').click();
        Quiz.startSession([categoryId], "leicht", { challengeId });
        renderQuestion();
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
        ${entries.map((e) => `<div class="guestbook-entry">${e.user_id ? `<button type="button" class="friend-name-btn gb-name" data-view-gb-author="${e.user_id}">${e.name}</button>` : `<div class="gb-name">${e.name}</div>`}<p>${e.message}</p><div class="gb-date">${new Date(e.date).toLocaleString("de-DE")}</div></div>`).join("") || '<p class="empty-note">Noch keine Einträge.</p>'}
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
    });
  });

  // Beim Start: gespeichertes Theme des eingeloggten Profils anwenden, sonst Standard behalten
  applyTheme((Backend.currentProfile() && Backend.currentProfile().theme) || sessionTheme);

  // Falls Supabase verbunden ist: bestehende Anmeldung (Session) wiederherstellen
  Backend.restoreSession().then(() => {
    refreshHeaderAuth();
    renderAccount();
    applyTheme((Backend.currentProfile() && Backend.currentProfile().theme) || sessionTheme);
    updateSpecialDayBar();
  });

  // Online-Status: alle 60s "zuletzt aktiv" aktualisieren, solange eingeloggt
  setInterval(() => { if (Backend.currentUser()) Backend.touchActivity(); }, 60000);
})();
