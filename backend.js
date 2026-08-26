/* =========================================================
   BACKEND — Supabase-Anbindung mit Demo-Fallback
   ---------------------------------------------------------
   Trage deine Projektdaten in supabase-config.js ein, um echte
   Konten, ein dauerhaftes Ranking und ein persistentes Gästebuch
   zu bekommen. Ohne Konfiguration läuft die App im Demo-Modus:
   alles funktioniert sofort, aber die Daten leben nur, solange
   der Tab offen ist (kein localStorage, siehe README).
   ========================================================= */

const Backend = (function () {
  "use strict";

  const cfg = window.SUPABASE_CONFIG || { url: "", anonKey: "" };
  const isConfigured = Boolean(cfg.url && cfg.anonKey && cfg.url.startsWith("https://"));
  let client = null;

  if (isConfigured && window.supabase) {
    client = window.supabase.createClient(cfg.url, cfg.anonKey);
  }

  /* ---------------- Demo-Zustand (nur im Speicher) ---------------- */
  const demo = {
    user: null, // { id, email, name }
    profile: null, // { name, bio, points, badges:[], history:[], isPremium }
    guestbook: [
      { id: Core.uid(), name: "Marie", message: "Tolle Seite, danke Alex! 🎶", date: new Date(Date.now() - 86400000).toISOString() },
      { id: Core.uid(), name: "Tom", message: "Die Redewendungen haben mir sehr geholfen.", date: new Date(Date.now() - 3600000).toISOString() },
    ],
    ranking: [
      { name: "Sophie", points: 187, date: todayKey() },
      { name: "Kwame", points: 152, date: todayKey() },
      { name: "Yui", points: 140, date: todayKey() },
    ],
    users: {}, // demo "Datenbank" für Registrierungen: email -> {password, profile}
    friends: [], // { id, a, b, status: 'pending'|'accepted', requestedBy }
    challenges: [], // { id, from, to, categories, fromResult, toResult, status, winner, createdAt }
    activity: [], // { id, text, date }
  };

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function defaultProfile(name) {
    return { name, bio: "", points: 0, badges: [], history: [], isPremium: false, theme: "bastelheft" };
  }

  /* ================= AUTH ================= */

  async function signUp(email, password, name) {
    if (client) {
      const { data, error } = await client.auth.signUp({ email, password, options: { data: { name } } });
      if (error) throw error;
      return data.user;
    }
    if (demo.users[email]) throw new Error("Diese E-Mail ist im Demo-Modus schon registriert.");
    demo.users[email] = { password, profile: defaultProfile(name) };
    demo.user = { id: Core.uid(), email, name };
    demo.profile = demo.users[email].profile;
    return demo.user;
  }

  async function signIn(email, password) {
    if (client) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.user;
    }
    const record = demo.users[email];
    if (!record || record.password !== password) {
      throw new Error("Im Demo-Modus unbekannte Zugangsdaten. Registriere dich zuerst.");
    }
    demo.user = { id: Core.uid(), email, name: record.profile.name };
    demo.profile = record.profile;
    return demo.user;
  }

  async function signOut() {
    if (client) {
      await client.auth.signOut();
      return;
    }
    demo.user = null;
    demo.profile = null;
  }

  function currentUser() {
    return demo.user; // im echten Supabase-Modus würde man client.auth.getUser() cachen
  }

  function currentProfile() {
    return demo.profile;
  }

  /* ================= PROFIL & PUNKTE ================= */

  async function saveResult(result) {
    // result: { categories:[ids], points, bonus, percent, character, badges:[], playedAt }
    if (!demo.profile) return; // nicht eingeloggt -> Ergebnis wird nur lokal in der Session gezeigt
    demo.profile.points += Math.round(result.points + result.bonus);
    demo.profile.history.unshift(result);
    result.badges.forEach((b) => {
      if (!demo.profile.badges.includes(b)) demo.profile.badges.push(b);
    });

    if (client) {
      // Erwartete Tabelle: results (user_id, categories, points, bonus, percent, character, played_at)
      try {
        await client.from("results").insert({
          user_id: demo.user.id,
          categories: result.categories,
          points: result.points,
          bonus: result.bonus,
          percent: result.percent,
          character: result.character,
          played_at: result.playedAt,
        });
      } catch (e) {
        console.warn("Supabase-Speichern fehlgeschlagen, Ergebnis bleibt lokal:", e);
      }
    }

    // Tagesranking aktualisieren (Demo)
    const existing = demo.ranking.find((r) => r.name === demo.profile.name && r.date === todayKey());
    if (existing) {
      existing.points = Math.max(existing.points, demo.profile.points);
    } else {
      demo.ranking.push({ name: demo.profile.name, points: demo.profile.points, date: todayKey() });
    }
  }

  async function getRanking() {
    if (client) {
      try {
        const { data, error } = await client
          .from("daily_ranking")
          .select("*")
          .eq("date", todayKey())
          .order("points", { ascending: false })
          .limit(20);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase-Ranking nicht verfügbar, zeige Demo-Daten:", e);
      }
    }
    return demo.ranking
      .filter((r) => r.date === todayKey())
      .sort((a, b) => b.points - a.points)
      .slice(0, 20);
  }

  /* ================= GÄSTEBUCH ================= */

  async function getGuestbook() {
    if (client) {
      try {
        const { data, error } = await client
          .from("guestbook")
          .select("*")
          .order("date", { ascending: false })
          .limit(50);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase-Gästebuch nicht verfügbar, zeige Demo-Daten:", e);
      }
    }
    return demo.guestbook.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async function addGuestbookEntry(name, message) {
    const entry = { id: Core.uid(), name, message, date: new Date().toISOString() };
    if (client) {
      try {
        await client.from("guestbook").insert({ name, message });
      } catch (e) {
        console.warn("Supabase-Insert fehlgeschlagen, Eintrag bleibt lokal:", e);
      }
    }
    demo.guestbook.unshift(entry);
    return entry;
  }

  /* ================= PREMIUM (bezahlbarer Zusatzinhalt) ================= */
  // Echte Zahlungsprüfung braucht eine serverseitige Funktion (z. B. Supabase Edge
  // Function + PayPal-Webhook), die is_premium in der Profil-Tabelle setzt. Diese
  // Demo simuliert die Freischaltung lokal, damit die App vollständig testbar ist.

  function unlockPremiumDemo() {
    if (demo.profile) demo.profile.isPremium = true;
  }

  function isPremium() {
    return Boolean(demo.profile && demo.profile.isPremium);
  }

  /* ================= FREUNDE, DUELLE & AKTIVITÄT =================
     Hinweis Demo-Modus: Suche/Freunde funktionieren nur innerhalb
     derselben Browser-Sitzung (z. B. zum Testen: zwei Konten nach-
     einander in diesem Tab registrieren). Mit Supabase verbunden
     werden echte, geräteübergreifende Konten gefunden — dafür bitte
     zusätzlich die Tabellen "profiles" und "friends" aus der README
     anlegen (Abschnitt Supabase einrichten).
     ================================================================ */

  function addActivity(text) {
    demo.activity.unshift({ id: Core.uid(), text, date: new Date().toISOString() });
    demo.activity = demo.activity.slice(0, 20);
  }

  function getActivity() {
    return demo.activity.slice(0, 6);
  }

  async function searchUsers(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    if (client) {
      try {
        const { data, error } = await client.from("profiles").select("name").ilike("name", `%${q}%`).limit(10);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase-Suche nicht verfügbar, durchsuche Demo-Konten:", e);
      }
    }
    const me = demo.user ? demo.user.email : null;
    return Object.entries(demo.users)
      .filter(([email, u]) => email !== me && u.profile.name.toLowerCase().includes(q))
      .map(([email, u]) => ({ email, name: u.profile.name }))
      .slice(0, 10);
  }

  function friendPairId(a, b) {
    return [a, b].sort().join("::");
  }

  function sendFriendRequest(targetEmail) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    const pair = friendPairId(demo.user.email, targetEmail);
    if (demo.friends.some((f) => friendPairId(f.a, f.b) === pair)) {
      throw new Error("Da gibt es schon eine Anfrage oder Freundschaft.");
    }
    demo.friends.push({ id: Core.uid(), a: demo.user.email, b: targetEmail, status: "pending", requestedBy: demo.user.email });
  }

  function getIncomingRequests() {
    if (!demo.user) return [];
    return demo.friends
      .filter((f) => f.status === "pending" && f.requestedBy !== demo.user.email && (f.a === demo.user.email || f.b === demo.user.email))
      .map((f) => ({ id: f.id, email: f.requestedBy, name: (demo.users[f.requestedBy] && demo.users[f.requestedBy].profile.name) || f.requestedBy }));
  }

  function acceptFriendRequest(id) {
    const f = demo.friends.find((x) => x.id === id);
    if (f) f.status = "accepted";
  }

  function getFriends() {
    if (!demo.user) return [];
    return demo.friends
      .filter((f) => f.status === "accepted" && (f.a === demo.user.email || f.b === demo.user.email))
      .map((f) => {
        const otherEmail = f.a === demo.user.email ? f.b : f.a;
        const u = demo.users[otherEmail];
        return { email: otherEmail, name: (u && u.profile.name) || otherEmail, points: (u && u.profile.points) || 0 };
      });
  }

  function createChallenge(toEmail, categoryIds) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    const challenge = {
      id: Core.uid(),
      from: demo.user.email,
      to: toEmail,
      categories: categoryIds,
      fromResult: null,
      toResult: null,
      status: "pending",
      winner: null,
      createdAt: new Date().toISOString(),
    };
    demo.challenges.push(challenge);
    const toName = (demo.users[toEmail] && demo.users[toEmail].profile.name) || toEmail;
    addActivity(`${demo.profile.name} fordert ${toName} zu einem Duell heraus. 🎮`);
    return challenge.id;
  }

  function getMyChallenges() {
    if (!demo.user) return { incoming: [], outgoing: [] };
    const me = demo.user.email;
    const withNames = (c) => ({
      ...c,
      fromName: (demo.users[c.from] && demo.users[c.from].profile.name) || c.from,
      toName: (demo.users[c.to] && demo.users[c.to].profile.name) || c.to,
    });
    return {
      incoming: demo.challenges.filter((c) => c.to === me && c.status === "pending" && !c.toResult).map(withNames),
      outgoing: demo.challenges.filter((c) => c.from === me).map(withNames),
    };
  }

  function submitChallengeResult(challengeId, result) {
    const c = demo.challenges.find((x) => x.id === challengeId);
    if (!c || !demo.user) return;
    const isFrom = c.from === demo.user.email;
    if (isFrom) c.fromResult = result;
    else c.toResult = result;

    if (c.fromResult && c.toResult) {
      c.status = "completed";
      const fromName = (demo.users[c.from] && demo.users[c.from].profile.name) || c.from;
      const toName = (demo.users[c.to] && demo.users[c.to].profile.name) || c.to;
      if (c.fromResult.percent === c.toResult.percent) {
        c.winner = null;
        addActivity(`${fromName} und ${toName} haben unentschieden gespielt (${c.fromResult.percent}%). 🤝`);
      } else {
        const winnerIsFrom = c.fromResult.percent > c.toResult.percent;
        c.winner = winnerIsFrom ? c.from : c.to;
        const winnerName = winnerIsFrom ? fromName : toName;
        const loserName = winnerIsFrom ? toName : fromName;
        const winnerPct = winnerIsFrom ? c.fromResult.percent : c.toResult.percent;
        const loserPct = winnerIsFrom ? c.toResult.percent : c.fromResult.percent;
        addActivity(`${winnerName} hat ${loserName} im Duell geschlagen (${winnerPct}% zu ${loserPct}%). 🏆`);
      }
    }
  }

  function notifyPracticing(categoryTitle) {
    if (!demo.user) return;
    addActivity(`${demo.profile.name} übt gerade „${categoryTitle}“ …`);
  }

  return {
    isConfigured,
    signUp,
    signIn,
    signOut,
    currentUser,
    currentProfile,
    saveResult,
    getRanking,
    getGuestbook,
    addGuestbookEntry,
    unlockPremiumDemo,
    isPremium,
    searchUsers,
    sendFriendRequest,
    getIncomingRequests,
    acceptFriendRequest,
    getFriends,
    createChallenge,
    getMyChallenges,
    submitChallengeResult,
    addActivity,
    getActivity,
    notifyPracticing,
  };
})();
