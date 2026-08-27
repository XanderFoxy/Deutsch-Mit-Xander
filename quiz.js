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

  function poolSizeFor(categoryIds) {
    return categoryIds.reduce((sum, id) => sum + ExerciseData.getCategory(id).getBank().length, 0);
  }

  function buildQuestions(categoryIds, count, orderMode, quizTopic) {
    const bankFor = (id) => (id === "quiz" && quizTopic ? ExerciseData.getCategory(id).getBank(quizTopic) : ExerciseData.getCategory(id).getBank());
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

  function startSession(categoryIds, difficultyId, meta, orderMode, quizTopic) {
    const diff = DIFFICULTIES.find((d) => d.id === difficultyId);
    const questions = buildQuestions(categoryIds, diff.count, orderMode, quizTopic);
    state = {
      categoryIds,
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
      const g = ExerciseData.getCategory(id).group;
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
    };
  }

  function reset() {
    state = null;
  }

  return {
    CHARACTERS,
    TIERS,
    DIFFICULTIES,
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
