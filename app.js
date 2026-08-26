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
    { id: "bastelheft", name: "Bastelheft", emoji: "✂️", desc: "Hell, Papier & Washi-Tape, verspielte Candyfarben." },
    { id: "flickenteppich", name: "Flickenteppich", emoji: "🧵", desc: "Kräftige Patchwork-Farben, dicke verspielte Outlines." },
    { id: "wollknaeuel", name: "Wollknäuel", emoji: "🧶", desc: "Kuschelig-gestrickt, warme Herbstfarben." },
    { id: "papierfalz", name: "Papierfalz", emoji: "🕊️", desc: "Ruhig, gefaltetes Papier, gedeckte Erdtöne." },
    { id: "nachtflicken", name: "Nachtflicken", emoji: "🦇", desc: "Dunkel & verspielt, Neon-Filzpatches auf tiefem Lila." },
    { id: "kirmes", name: "Kirmes", emoji: "🎡", desc: "Bunt & fröhlich wie ein deutscher Jahrmarkt." },
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

  function renderDesign() {
    const area = document.getElementById("designArea");
    if (!area) return;
    const active = (Backend.currentProfile() && Backend.currentProfile().theme) || sessionTheme;
    area.innerHTML = `
      <p class="empty-note">Wähle dein Lieblings-Design — wirkt sofort auf der ganzen Seite.</p>
      <div class="category-grid">
        ${THEMES.map((t) => `
          <div class="category-card ${t.id === active ? "selected" : ""}" data-theme-pick="${t.id}">
            <div class="cat-checkbox">${t.id === active ? "✓" : ""}</div>
            <div class="cat-body">
              <div class="cat-title-row"><span class="cat-icon">${t.emoji}</span><span>${t.name}</span></div>
              <div class="cat-info-text open">${t.desc}</div>
            </div>
          </div>`).join("")}
      </div>
    `;
    area.querySelectorAll("[data-theme-pick]").forEach((card) => {
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
    updateDaytimeSky(berlin.getHours());
  }
  updateClock();
  setInterval(updateClock, 15000);

  // Tageszeiten-Himmel: nacht · dämmerung (morgens) · tag · dämmerung (abends)
  function updateDaytimeSky(hour) {
    const bar = document.getElementById("deckDisplay");
    if (!bar) return;
    let phase;
    if (hour >= 22 || hour < 6) phase = "night";
    else if (hour < 8) phase = "dawn";
    else if (hour < 18) phase = "day";
    else phase = "dusk";
    bar.setAttribute("data-daytime", phase);
  }

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

  function renderSetup() {
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
          </div>
        </div>`;
    }).join("");

    const maxAvailable = selectedCategories.size ? Quiz.poolSizeFor([...selectedCategories]) : 0;

    setupEl.innerHTML = `
      ${resumeBar}
      <div class="category-grid">${cards}</div>
      <div class="setup-bar">
        <div class="diff-pills">
          ${Quiz.DIFFICULTIES.map((d) => `<button type="button" class="diff-pill" data-diff="${d.id}" aria-selected="${d.id === selectedDifficulty}" ${maxAvailable < d.count ? "disabled" : ""}>${d.label} (${d.count})</button>`).join("")}
        </div>
        <button type="button" class="btn-start" id="startBtn" ${selectedCategories.size === 0 ? "disabled" : ""}>Runde starten ▶</button>
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
      card.classList.toggle("selected", selectedCategories.has(id));
      card.addEventListener("click", (e) => {
        if (e.target.closest(".cat-info-btn") || e.target.closest(".cat-collapse-btn")) return;
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
    setupEl.querySelectorAll(".order-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        orderMode = btn.dataset.order;
        renderSetup();
      });
    });
    const startBtn = document.getElementById("startBtn");
    if (startBtn) startBtn.addEventListener("click", () => {
      Quiz.startSession([...selectedCategories], selectedDifficulty, null, orderMode);
      const titles = [...selectedCategories].map((id) => ExerciseData.getCategory(id).title).join(", ");
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

  function newMemoryGame() {
    const game = ExerciseData.MEMORY_GAMES.find((g) => g.id === memoryGameId);
    const pairs = Core.drawUnique(game.getPairs(), MEMORY_PAIR_COUNT);
    let cards = [];
    pairs.forEach((p, i) => {
      cards.push({ id: `${i}-a`, pairId: i, label: p[0] });
      cards.push({ id: `${i}-b`, pairId: i, label: p[1] });
    });
    cards = Core.shuffle(cards);
    memoryState = { cards, flipped: [], matched: new Set(), lastSeenId: null, moves: 0, wrongFlash: [], finished: false };
    renderMemory();
  }

  function renderMemory() {
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
    memoryArea.innerHTML = `
      ${gameBar}
      ${diffBar}
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
    document.getElementById("memoryRestart").addEventListener("click", newMemoryGame);
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
          const score = Math.max(10, Math.round(100 * (pairs / Math.max(memoryState.moves, pairs))));
          Core.sound.fanfare();
          Backend.saveResult({
            categories: ["memory"],
            points: score,
            bonus: 0,
            percent: score,
            character: "Memory-Meister",
            badges: [],
            playedAt: new Date().toISOString(),
          });
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

  document.getElementById("linksArea").innerHTML = VocabData.LINKS.map((l) => `
    <div class="link-card"><h3><a href="${l.url}" target="_blank" rel="noopener">${l.title} ↗</a></h3><p>${l.desc}</p></div>`).join("");

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
    const avatarHtml = profile.avatarUrl
      ? `<img src="${profile.avatarUrl}" alt="" class="avatar-photo" />`
      : profile.avatarEmoji
        ? `<div class="initials-avatar emoji-avatar">${profile.avatarEmoji}</div>`
        : `<div class="initials-avatar">${initials}</div>`;

    area.innerHTML = `
      ${demoBanner}
      <div class="question-card">
        <div class="profile-header">
          <label class="avatar-upload-wrap">
            ${avatarHtml}
            <span class="avatar-edit-badge">📷</span>
            <input type="file" id="avatarInput" accept="image/*" style="display:none;" />
          </label>
          <div class="profile-name-col">
            <h2>${profile.name}</h2>
            ${profile.isPremium ? '<p class="empty-note">✨ Premium</p>' : ""}
          </div>
          <div class="profile-points"><div class="num">${profile.points}</div><div class="empty-note">Punkte</div></div>
        </div>
        <div class="emoji-picker-row">
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
        <div class="quiz-actions" style="justify-content:flex-start;">
          <button type="button" class="btn btn-coffee" id="saveBioBtn">Speichern</button>
          <button type="button" class="btn btn-ghost" id="logoutBtn">Abmelden</button>
        </div>
      </div>
      ${renderTrophyCase(profile)}
      ${await renderRecentMembers()}
      ${await renderActivityFeed()}
      ${profile.history.length ? `<div class="breakdown-list" style="margin-top:16px;">
        <p class="eyebrow" style="margin-top:0;">Letzte Ergebnisse</p>
        ${profile.history.slice(0, 8).map((h) => `<div class="breakdown-row"><span>${new Date(h.playedAt).toLocaleDateString("de-DE")}</span><span>${h.character}</span><span>${h.percent}%</span></div>`).join("")}
      </div>` : ""}
    `;
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await Backend.signOut();
      refreshHeaderAuth();
      renderAccount();
    });
    document.getElementById("saveBioBtn").addEventListener("click", () => {
      Backend.saveBio(document.getElementById("bioInput").value.trim());
      Backend.saveBirthday(document.getElementById("birthdayInput").value.trim());
      document.getElementById("saveBioBtn").textContent = "Gespeichert ✓";
      updateSpecialDayBar();
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
  }

  function renderTrophyCase(profile) {
    if (!profile.trophies || !profile.trophies.length) return "";
    return `<div class="breakdown-list" style="margin-top:16px;">
      <p class="eyebrow" style="margin-top:0;">🏆 Vitrine</p>
      <div class="badge-row" style="justify-content:flex-start;">
        ${profile.trophies.map((t) => `<div class="badge-chip"><span class="emoji">🏆</span><span>${t}</span></div>`).join("")}
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
    if (!p) return;
    const initials = (p.name || "?").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const avatarHtml = p.avatar_url
      ? `<img src="${p.avatar_url}" class="avatar-photo" alt="" />`
      : p.avatar_emoji
        ? `<div class="initials-avatar emoji-avatar">${p.avatar_emoji}</div>`
        : `<div class="initials-avatar">${initials}</div>`;
    const me = Backend.currentUser();
    const isMe = me && me.id === p.id;

    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("div", { class: "profile-modal-card" },
        Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
        Core.el("div", { class: "profile-modal-header", html: `${avatarHtml}<h2>${p.name}</h2>` }),
        Core.el("p", { class: "empty-note" }, p.bio || "Noch keine Beschreibung."),
        Core.el("div", { class: "badge-row", style: "justify-content:center;",
          html: (p.trophies && p.trophies.length ? p.trophies.map((t) => `<div class="badge-chip"><span class="emoji">🏆</span><span>${t}</span></div>`).join("") : "")
              + (p.badges && p.badges.length ? p.badges.map((b) => `<div class="badge-chip"><span class="emoji">🏅</span><span>${b}</span></div>`).join("") : "") }),
        Core.el("div", { class: "quiz-actions", style: "justify-content:center; margin-top:16px;" },
          isMe
            ? Core.el("span", { class: "empty-note" }, "Das bist du 👋")
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
        ${incomingChallenges.map((c) => `<div class="breakdown-row"><span>${c.fromName} · ${c.categories.map((id) => ExerciseData.getCategory(id).icon).join(" ")}</span><button type="button" class="btn btn-coffee" data-accept-challenge="${c.id}" data-cats="${c.categories.join(",")}">Annehmen</button></div>`).join("")}
      </div>` : ""}

      <div class="question-card" style="margin-top:14px;">
        <h3>👥 Deine Freunde</h3>
        ${friends.length ? friends.map((f) => `
          <div class="friend-block">
            <div class="breakdown-row">
              <button type="button" class="friend-name-btn" data-view-friend="${f.id}">${f.online ? '<span class="online-dot"></span>' : ""}${f.name} · ${f.points} Pkt.</button>
              <button type="button" class="btn btn-ghost" data-challenge="${f.id}" data-name="${f.name}">🎮 Herausfordern</button>
            </div>
            <div class="friend-profile-card" id="friend-profile-${f.id}" style="display:none;">
              <p class="empty-note">${f.bio ? f.bio : "Noch keine Beschreibung."}</p>
              <div class="badge-row" style="justify-content:flex-start;">
                ${f.badges && f.badges.length ? f.badges.map((b) => `<div class="badge-chip"><span class="emoji">🏅</span><span>${b}</span></div>`).join("") : '<span class="empty-note">Noch keine Abzeichen.</span>'}
              </div>
              ${f.trophies && f.trophies.length ? `<div class="badge-row" style="justify-content:flex-start; margin-top:8px;">${f.trophies.map((t) => `<div class="badge-chip"><span class="emoji">🏆</span><span>${t}</span></div>`).join("")}</div>` : ""}
            </div>
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
          ? results.map((r) => `<div class="breakdown-row"><span>${r.name}</span><button type="button" class="btn btn-ghost" data-add="${r.id}">+ Freund werden</button></div>`).join("")
          : (q.trim() ? '<p class="empty-note">Niemand gefunden.</p>' : "");
        area.querySelectorAll("[data-add]").forEach((btn) => {
          btn.addEventListener("click", async () => {
            try { await Backend.sendFriendRequest(btn.dataset.add); btn.textContent = "Angefragt ✓"; btn.disabled = true; }
            catch (err) { alert(err.message); }
          });
        });
      }, 250);
    });

    area.querySelectorAll("[data-accept]").forEach((btn) => {
      btn.addEventListener("click", async () => { await Backend.acceptFriendRequest(btn.dataset.accept); renderFriends(); });
    });

    area.querySelectorAll("[data-view-friend]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = document.getElementById(`friend-profile-${btn.dataset.viewFriend}`);
        card.style.display = card.style.display === "none" ? "block" : "none";
      });
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
          ${rows.length ? rows.map((r, i) => `<tr><td>${i + 1}.</td><td>${r.name}</td><td>${r.points} Pkt.</td></tr>`).join("") : '<tr><td class="empty-note">Noch keine Einträge heute — sei die/der Erste!</td></tr>'}
        </table>
      </div>
    `;
  }

  async function renderGuestbook() {
    const area = document.getElementById("guestbookArea");
    const entries = await Backend.getGuestbook();
    const user = Backend.currentUser();
    area.innerHTML = `
      <div class="question-card">
        <h3>📖 Gästebuch</h3>
        ${entries.map((e) => `<div class="guestbook-entry"><div class="gb-name">${e.name}</div><p>${e.message}</p><div class="gb-date">${new Date(e.date).toLocaleString("de-DE")}</div></div>`).join("") || '<p class="empty-note">Noch keine Einträge.</p>'}
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
