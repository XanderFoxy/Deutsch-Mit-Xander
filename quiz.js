/* =========================================================
   QUIZ — Übungs-Engine (Setup, Fragen, Auswertung)
   ========================================================= */

const Quiz = (function () {
  "use strict";

  const CHARACTERS = {
    logiker: { name: "Logiker", emoji: "🧠🔍", desc: "Meister der Regeln: wenn/ob, als/wie, kennen/wissen, das/dass." },
    wissenschaftler: { name: "Wissenschaftler", emoji: "🔬🏆", desc: "Faktenwissen rund um Deutschland." },
    sprachkuenstler: { name: "Sprachkünstler", emoji: "💬🎨", desc: "Redewendungen und Synonyme im Griff." },
    grammatikprofi: { name: "Grammatik-Profi", emoji: "✍️📐", desc: "Artikel, Plural und typische Fehler perfektioniert." },
    abenteurer: { name: "Abenteurer", emoji: "🧭🎩", desc: "Mutig durch viele verschiedene Kategorien gereist." },
    tausendsassa: { name: "Tausendsassa", emoji: "🌟", desc: "Alle 10 Kategorien gemeistert — Respekt!" },
  };

  const TIERS = [
    { max: 29, title: "Deutsch-Anfänger" },
    { max: 49, title: "Deutsch-Lernender" },
    { max: 69, title: "Deutsch-Fortgeschrittener" },
    { max: 89, title: "Deutsch-Lehrmeister" },
    { max: 100, title: "Deutsch-Profi" },
    { max: Infinity, title: "Deutsch-Superheld" },
  ];

  const DIFFICULTIES = [
    { id: "leicht", label: "Leicht", count: 10 },
    { id: "mittel", label: "Mittel", count: 20 },
    { id: "schwer", label: "Schwer", count: 30 },
  ];

  let state = null;

  const TOPIC_FILTERABLE = ["quiz", "wortschatz"];

  /* =========================================================
     SPRACHNIVEAU DER FRAGEN
     ---------------------------------------------------------
     Der Schwierigkeitsgrad (Leicht/Mittel/Schwer) bestimmt AUSSCHLIESSLICH
     die Anzahl der Fragen — daran ändert sich nichts. Wie anspruchsvoll die
     Fragen sprachlich sind, entscheidet dagegen das Sprachniveau, das
     standardmäßig aus dem Profil kommt.

     Woher das Niveau einer Frage stammt, in dieser Reihenfolge:
       1. q.level, wenn die Frage es ausdrücklich mitbringt (neue Inhalte)
       2. das Grundniveau ihrer Kategorie (Tabelle unten)
       3. ein Zuschlag, wenn die Frage sprachlich deutlich länger ist als
          in ihrer Kategorie üblich — lange Sätze sind schwerer, auch wenn
          die Grammatik dieselbe ist.
     ========================================================= */
  const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const KATEGORIE_GRUNDNIVEAU = {
    artikel: "A1",
    plural: "A1",
    "kennen-wissen": "A2",
    wortschatz: "A2",
    wortpaare: "A2",
    "ss-eszett": "A2",
    "das-dass": "B1",
    "wenn-ob": "B1",
    "als-wie": "B1",
    "haeufige-fehler": "B1",
    zeitformen: "B1",
    nebensatz: "B1",
    synonyme: "B1",
    lueckentext: "B1",
    quiz: "B1",
    homophone: "B1",
    "sinn-trainer": "B2",
    praefixverben: "B2",
    relativsatz: "B2",
    redewendungen: "B2",
    konnektoren: "B2",
    "doppelt-gemoppelt": "C1",
    jedesto: "C1",
  };
  function levelIndex(level) {
    const i = LEVELS.indexOf(level);
    return i === -1 ? 2 : i; // unbekannt → B1 als neutrale Mitte
  }
  /* Wortschatz-Messung: Das Niveau einer Aufgabe hängt nicht nur an ihrer Grammatik,
     sondern auch daran, WELCHE WÖRTER darin vorkommen. Dafür wird das Wörterbuch
     (VocabData.WORDS, jedes Wort mit festem Niveau) als Maßstab genommen.
     Bewusst NICHT das schwerste einzelne Wort — ein seltener Ausreißer würde sonst
     jede Aufgabe nach C2 schieben. Gemessen wird das Niveau, auf dem neun von zehn
     erkannten Wörtern abgedeckt sind. */
  let wortNiveauKarteCache = null;
  function wortNiveauKarte() {
    if (wortNiveauKarteCache) return wortNiveauKarteCache;
    const karte = new Map();
    const quelle = (typeof VocabData !== "undefined" && VocabData.WORDS) || [];
    quelle.forEach((w) => {
      if (!w || !w.word || !w.level) return;
      const idx = LEVELS.indexOf(w.level);
      if (idx < 0) return;
      const grund = w.word.replace(/^(der|die|das)\s+/i, "").toLowerCase();
      const bisher = karte.get(grund);
      // Das NIEDRIGSTE hinterlegte Niveau gilt — ein Wort ist ab dem Zeitpunkt bekannt,
      // an dem man es zum ersten Mal lernt.
      if (bisher === undefined || idx < bisher) karte.set(grund, idx);
    });
    wortNiveauKarteCache = karte;
    return karte;
  }
  function wortschatzNiveauIndex(text) {
    const karte = wortNiveauKarte();
    if (!karte.size) return null;
    const woerter = String(text || "").toLowerCase().match(/[a-zäöüß]{3,}/g) || [];
    const stufen = [];
    woerter.forEach((w) => {
      const idx = karte.get(w);
      if (idx !== undefined) stufen.push(idx);
    });
    // Unter fünf erkannten Wörtern ist die Messung zu wackelig, um darauf zu bauen.
    if (stufen.length < 5) return null;
    stufen.sort((a, b) => a - b);
    return stufen[Math.min(stufen.length - 1, Math.floor(stufen.length * 0.9))];
  }
  function questionLevel(q, categoryId) {
    if (q && q.level && LEVELS.includes(q.level)) return q.level;
    if (q && q.__niveau) return q.__niveau; // schon einmal berechnet
    let idx = levelIndex(KATEGORIE_GRUNDNIVEAU[categoryId] || "B1");
    // Längenzuschlag: sehr lange Aufgabenstellungen sind auch bei gleicher
    // Grammatik anspruchsvoller — mehr zu lesen, mehr im Kopf zu behalten.
    const text = `${(q && q.prompt) || ""}`;
    const woerter = text.split(/\s+/).filter(Boolean).length;
    if (woerter >= 16) idx += 1;
    if (woerter >= 26) idx += 1;
    // Wortschatz-Messung darf das Niveau anheben, aber nie senken: eine A1-Kategorie
    // mit gehobenem Wortschatz ist eben doch keine A1-Aufgabe mehr.
    const ausWortschatz = wortschatzNiveauIndex(text);
    if (ausWortschatz !== null && ausWortschatz > idx) idx = ausWortschatz;
    const ergebnis = LEVELS[Math.min(idx, LEVELS.length - 1)];
    if (q && typeof q === "object") {
      try { Object.defineProperty(q, "__niveau", { value: ergebnis, enumerable: false, configurable: true }); } catch (e) { /* eingefrorene Objekte einfach überspringen */ }
    }
    return ergebnis;
  }
  // Passende Fragen für ein gewünschtes Niveau: alles, was das Niveau NICHT
  // übersteigt — wer auf B2 lernt, darf auch leichtere Fragen bekommen, aber
  // keine, die deutlich darüber liegen. Bleiben zu wenige übrig, wird der
  // Bereich schrittweise geöffnet, damit eine Runde nie an zu wenig Material
  // scheitert (lieber eine etwas zu schwere Frage als eine leere Runde).
  function filterByLevel(bank, categoryId, wantedLevel, mindestens) {
    if (!wantedLevel || !LEVELS.includes(wantedLevel)) return bank;
    const wantedIdx = levelIndex(wantedLevel);
    for (let spielraum = 0; spielraum < LEVELS.length; spielraum++) {
      const treffer = bank.filter((q) => levelIndex(questionLevel(q, categoryId)) <= wantedIdx + spielraum);
      if (treffer.length >= (mindestens || 1)) return treffer;
    }
    return bank;
  }

  function poolSizeFor(categoryIds, topicFilters, level) {
    return categoryIds.reduce((sum, id) => {
      const t = topicFilters && topicFilters[id];
      const bank = TOPIC_FILTERABLE.includes(id) && t ? ExerciseData.activeGetCategory(id).getBank(t) : ExerciseData.activeGetCategory(id).getBank();
      return sum + filterByLevel(bank, id, level, 1).length;
    }, 0);
  }

  function buildQuestions(categoryIds, count, orderMode, topicFilters, level) {
    const bankFor = (id) => {
      const t = topicFilters && topicFilters[id];
      const roh = TOPIC_FILTERABLE.includes(id) && t ? ExerciseData.activeGetCategory(id).getBank(t) : ExerciseData.activeGetCategory(id).getBank();
      // Wie viele Fragen aus dieser Kategorie mindestens gebraucht werden — danach
      // richtet sich, wie weit der Niveau-Bereich notfalls geöffnet werden muss.
      const mindestens = Math.max(1, Math.ceil(count / Math.max(1, categoryIds.length)));
      return filterByLevel(roh, id, level, mindestens);
    };
    if (orderMode === "sequential" && categoryIds.length > 1) {
      const per = Math.floor(count / categoryIds.length);
      let remainder = count - per * categoryIds.length;
      let sequence = [];
      categoryIds.forEach((id) => {
        const bank = bankFor(id).map((q) => ({ ...q, categoryId: id }));
        const take = per + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder -= 1;
        sequence = sequence.concat(Core.drawUnique(bank, take));
      });
      return sequence;
    }
    let pool = [];
    categoryIds.forEach((id) => {
      const bank = bankFor(id);
      bank.forEach((q) => pool.push({ ...q, categoryId: id }));
    });
    return Core.drawUnique(pool, count);
  }

  function startSession(categoryIds, difficultyId, meta, orderMode, topicFilters, level) {
    const diff = DIFFICULTIES.find((d) => d.id === difficultyId);
    const questions = buildQuestions(categoryIds, diff.count, orderMode, topicFilters, level);
    state = {
      categoryIds,
      level: level || null,
      difficulty: diff,
      questions,
      index: 0,
      answers: [],
      startedAt: Date.now(),
      questionShownAt: Date.now(),
      meta: meta || null,
    };
    return state;
  }

  function markShown() {
    if (state) state.questionShownAt = Date.now();
  }

  function currentQuestion() {
    return state.questions[state.index];
  }

  function progress() {
    return { index: state.index, total: state.questions.length };
  }

  function submitAnswer(selectedIndices) {
    const q = currentQuestion();
    const correctSet = new Set(q.correct);
    const correctSelected = selectedIndices.filter((i) => correctSet.has(i));
    const base = correctSelected.length > 0 ? 1 : 0;
    const multiBonus = correctSelected.length > 1 ? correctSelected.length - 1 : 0;
    const elapsedMs = state.questionShownAt ? Date.now() - state.questionShownAt : Infinity;
    const speedBonus = base > 0 && elapsedMs < 4000 ? 1 : 0;
    const record = {
      categoryId: q.categoryId,
      prompt: q.prompt,
      correctText: q.options && q.correct ? q.correct.map((i) => q.options[i]).join(", ") : "",
      selected: selectedIndices,
      base,
      bonus: multiBonus + speedBonus,
      speedBonus,
      fullyCorrect: correctSelected.length === q.correct.length && selectedIndices.length === q.correct.length,
    };
    state.answers.push(record);
    return record;
  }

  function advance() {
    state.index += 1;
    return state.index < state.questions.length;
  }

  function computeResults() {
    const total = state.questions.length;
    const totalBase = state.answers.reduce((s, a) => s + a.base, 0);
    const totalBonus = state.answers.reduce((s, a) => s + a.bonus, 0);
    const basePercent = Math.round((totalBase / total) * 100);
    const bonusPercent = Math.round((totalBonus / total) * 100);
    const combinedPercent = basePercent + bonusPercent;

    const tier = TIERS.find((t) => combinedPercent <= t.max).title;

    const byCategory = {};
    state.answers.forEach((a) => {
      byCategory[a.categoryId] = byCategory[a.categoryId] || { correct: 0, total: 0 };
      byCategory[a.categoryId].total += 1;
      if (a.base > 0) byCategory[a.categoryId].correct += 1;
    });

    const groupCounts = {};
    state.categoryIds.forEach((id) => {
      const g = ExerciseData.activeGetCategory(id).group;
      groupCounts[g] = (groupCounts[g] || 0) + 1;
    });
    const distinctGroups = Object.keys(groupCounts).length;
    const distinctCategories = state.categoryIds.length;

    let characterKey;
    if (distinctCategories >= 10) {
      characterKey = "tausendsassa";
    } else if (distinctGroups >= 3 && distinctCategories >= 4) {
      characterKey = "abenteurer";
    } else {
      const topGroup = Object.entries(groupCounts).sort((a, b) => b[1] - a[1])[0][0];
      characterKey = { logik: "logiker", quiz: "wissenschaftler", wortschatz: "sprachkuenstler", grammatik: "grammatikprofi" }[topGroup] || "abenteurer";
    }

    const character = CHARACTERS[characterKey];
    const badges = characterKey === "tausendsassa" ? Object.values(CHARACTERS) : [character];

    return {
      total,
      totalBase,
      totalBonus,
      basePercent,
      bonusPercent,
      combinedPercent,
      tier,
      byCategory,
      character,
      characterKey,
      badges,
      categories: state.categoryIds,
      playedAt: new Date().toISOString(),
      meta: state.meta,
      answers: state.answers,
    };
  }

  function reset() {
    state = null;
  }

  return {
    CHARACTERS,
    TIERS,
    DIFFICULTIES,
    LEVELS,
    questionLevel,
    poolSizeFor,
    startSession,
    markShown,
    currentQuestion,
    progress,
    submitAnswer,
    advance,
    computeResults,
    reset,
    getState: () => state,
  };
})();
