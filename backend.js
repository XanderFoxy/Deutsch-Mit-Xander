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

  async function fetchOrCreateProfile(userId, email, name) {
    try {
      const { data, error } = await client.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (!error && data) {
        return {
          name: data.name || name || email,
          bio: data.bio || "",
          points: data.points || 0,
          badges: data.badges || [],
          history: [],
          isPremium: Boolean(data.is_premium),
          theme: data.theme || "bastelheft",
        };
      }
      // Noch kein Profil-Eintrag -> anlegen
      const { error: insertError } = await client.from("profiles").insert({ id: userId, name: name || email, points: 0, badges: [], is_premium: false, theme: "bastelheft" });
      if (insertError) console.warn("Profil-Tabelle nicht erreichbar (fehlt sie noch in Supabase?):", insertError.message);
    } catch (e) {
      console.warn("Profil konnte nicht geladen/angelegt werden — Login funktioniert trotzdem, nur ohne gespeicherte Punkte:", e);
    }
    return defaultProfile(name || email);
  }

  async function loadHistory(userId) {
    try {
      const { data, error } = await client
        .from("results")
        .select("*")
        .eq("user_id", userId)
        .order("played_at", { ascending: false })
        .limit(8);
      if (!error && data) {
        return data.map((r) => ({ playedAt: r.played_at, character: r.character, percent: r.percent }));
      }
    } catch (e) {
      console.warn("Verlauf konnte nicht geladen werden:", e);
    }
    return [];
  }

  async function restoreSession() {
    if (!client) return;
    try {
      const { data } = await client.auth.getSession();
      const session = data && data.session;
      if (!session) return;
      const authUser = session.user;
      const name = (authUser.user_metadata && authUser.user_metadata.name) || authUser.email;
      demo.user = { id: authUser.id, email: authUser.email, name };
      demo.profile = await fetchOrCreateProfile(authUser.id, authUser.email, name);
      demo.profile.history = await loadHistory(authUser.id);
    } catch (e) {
      console.warn("Sitzung konnte nicht wiederhergestellt werden:", e);
    }
  }

  async function signUp(email, password, name) {
    if (client) {
      const redirectTo = window.location.origin + window.location.pathname;
      const { data, error } = await client.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: redirectTo } });
      if (error) throw error;
      if (!data.session) {
        // Standardeinstellung bei Supabase: E-Mail-Bestätigung nötig, bevor man sich einloggen kann.
        throw new Error("Fast fertig! Bitte bestätige deine E-Mail-Adresse über den Link, den wir dir gerade geschickt haben — schau auch im Spam-Ordner. Danach kannst du dich hier anmelden.");
      }
      demo.user = { id: data.user.id, email: data.user.email, name };
      demo.profile = await fetchOrCreateProfile(data.user.id, data.user.email, name);
      return demo.user;
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
      if (error) {
        if (error.message && error.message.toLowerCase().includes("invalid login credentials")) {
          throw new Error("E-Mail oder Passwort stimmen nicht — oder du hast deine E-Mail noch nicht bestätigt (Link in deinem Postfach prüfen).");
        }
        throw error;
      }
      const name = (data.user.user_metadata && data.user.user_metadata.name) || data.user.email;
      demo.user = { id: data.user.id, email: data.user.email, name };
      demo.profile = await fetchOrCreateProfile(data.user.id, data.user.email, name);
      demo.profile.history = await loadHistory(data.user.id);
      return demo.user;
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
    }
    demo.user = null;
    demo.profile = null;
  }

  function currentUser() {
    return demo.user;
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
        await client.from("profiles").update({ points: demo.profile.points, badges: demo.profile.badges }).eq("id", demo.user.id);
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
    if (!demo.profile) return;
    demo.profile.isPremium = true;
    if (client && demo.user) {
      client.from("profiles").update({ is_premium: true }).eq("id", demo.user.id)
        .then(() => {}, (e) => console.warn("Premium-Status konnte nicht gespeichert werden:", e));
    }
  }

  function isPremium() {
    return Boolean(demo.profile && demo.profile.isPremium);
  }

  /* ================= FREUNDE, DUELLE & AKTIVITÄT =================
     Läuft komplett echt (geräteübergreifend), sobald Supabase verbunden
     ist — dafür zusätzlich die Tabellen "profiles", "friends",
     "challenges" und "activity" aus der README anlegen. Ohne Supabase
     läuft alles im Demo-Modus (nur innerhalb der Browser-Sitzung).
     ================================================================ */

  function myId() {
    return demo.user ? demo.user.id : null;
  }

  async function addActivity(text) {
    demo.activity.unshift({ id: Core.uid(), text, date: new Date().toISOString() });
    demo.activity = demo.activity.slice(0, 20);
    if (client) {
      try {
        await client.from("activity").insert({ user_id: myId(), text });
      } catch (e) {
        console.warn("Aktivität konnte nicht gespeichert werden:", e);
      }
    }
  }

  async function getActivity() {
    if (client) {
      try {
        const { data, error } = await client.from("activity").select("*").order("date", { ascending: false }).limit(6);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Aktivität konnte nicht geladen werden, zeige lokale Daten:", e);
      }
    }
    return demo.activity.slice(0, 6);
  }

  async function searchUsers(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    if (client) {
      try {
        const { data, error } = await client.from("profiles").select("id,name").ilike("name", `%${q}%`).neq("id", myId() || "").limit(10);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase-Suche nicht verfügbar, durchsuche Demo-Konten:", e);
      }
    }
    const me = demo.user ? demo.user.email : null;
    return Object.entries(demo.users)
      .filter(([email, u]) => email !== me && u.profile.name.toLowerCase().includes(q))
      .map(([email, u]) => ({ id: email, name: u.profile.name }))
      .slice(0, 10);
  }

  function friendPairId(a, b) {
    return [a, b].sort().join("::");
  }

  async function sendFriendRequest(targetId) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (client) {
      const { data: existing } = await client
        .from("friends").select("id")
        .or(`and(user_a.eq.${myId()},user_b.eq.${targetId}),and(user_a.eq.${targetId},user_b.eq.${myId()})`);
      if (existing && existing.length) throw new Error("Da gibt es schon eine Anfrage oder Freundschaft.");
      const { error } = await client.from("friends").insert({ user_a: myId(), user_b: targetId, status: "pending", requested_by: myId() });
      if (error) throw error;
      return;
    }
    const pair = friendPairId(demo.user.email, targetId);
    if (demo.friends.some((f) => friendPairId(f.a, f.b) === pair)) {
      throw new Error("Da gibt es schon eine Anfrage oder Freundschaft.");
    }
    demo.friends.push({ id: Core.uid(), a: demo.user.email, b: targetId, status: "pending", requestedBy: demo.user.email });
  }

  async function namesFor(ids) {
    if (!ids.length) return {};
    if (client) {
      try {
        const { data, error } = await client.from("profiles").select("id,name,points,badges,bio").in("id", ids);
        if (!error && data) return Object.fromEntries(data.map((p) => [p.id, p]));
      } catch (e) {
        console.warn("Profile konnten nicht geladen werden:", e);
      }
      return {};
    }
    return Object.fromEntries(ids.map((email) => [email, {
      id: email,
      name: (demo.users[email] && demo.users[email].profile.name) || email,
      points: (demo.users[email] && demo.users[email].profile.points) || 0,
      badges: (demo.users[email] && demo.users[email].profile.badges) || [],
      bio: (demo.users[email] && demo.users[email].profile.bio) || "",
    }]));
  }

  function saveBio(bio) {
    if (!demo.profile) return;
    demo.profile.bio = bio;
    if (client && demo.user) {
      client.from("profiles").update({ bio }).eq("id", demo.user.id)
        .then(() => {}, (e) => console.warn("Profiltext konnte nicht gespeichert werden:", e));
    }
  }

  async function getIncomingRequests() {
    if (!demo.user) return [];
    if (client) {
      const { data, error } = await client.from("friends").select("*")
        .eq("status", "pending").neq("requested_by", myId())
        .or(`user_a.eq.${myId()},user_b.eq.${myId()}`);
      if (error || !data) return [];
      const names = await namesFor(data.map((f) => f.requested_by));
      return data.map((f) => ({ id: f.id, id_other: f.requested_by, name: (names[f.requested_by] && names[f.requested_by].name) || f.requested_by }));
    }
    return demo.friends
      .filter((f) => f.status === "pending" && f.requestedBy !== demo.user.email && (f.a === demo.user.email || f.b === demo.user.email))
      .map((f) => ({ id: f.id, id_other: f.requestedBy, name: (demo.users[f.requestedBy] && demo.users[f.requestedBy].profile.name) || f.requestedBy }));
  }

  async function acceptFriendRequest(id) {
    if (client) {
      await client.from("friends").update({ status: "accepted" }).eq("id", id);
      return;
    }
    const f = demo.friends.find((x) => x.id === id);
    if (f) f.status = "accepted";
  }

  async function getFriends() {
    if (!demo.user) return [];
    if (client) {
      const { data, error } = await client.from("friends").select("*")
        .eq("status", "accepted").or(`user_a.eq.${myId()},user_b.eq.${myId()}`);
      if (error || !data) return [];
      const otherIds = data.map((f) => (f.user_a === myId() ? f.user_b : f.user_a));
      const names = await namesFor(otherIds);
      return otherIds.map((id) => ({
        id,
        name: (names[id] && names[id].name) || id,
        points: (names[id] && names[id].points) || 0,
        badges: (names[id] && names[id].badges) || [],
        bio: (names[id] && names[id].bio) || "",
      }));
    }
    return demo.friends
      .filter((f) => f.status === "accepted" && (f.a === demo.user.email || f.b === demo.user.email))
      .map((f) => {
        const otherEmail = f.a === demo.user.email ? f.b : f.a;
        const u = demo.users[otherEmail];
        return {
          id: otherEmail,
          name: (u && u.profile.name) || otherEmail,
          points: (u && u.profile.points) || 0,
          badges: (u && u.profile.badges) || [],
          bio: (u && u.profile.bio) || "",
        };
      });
  }

  async function createChallenge(toId, categoryIds) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    let challengeId;
    if (client) {
      const { data, error } = await client.from("challenges")
        .insert({ from_user: myId(), to_user: toId, categories: categoryIds, status: "pending" })
        .select("id").single();
      if (error) throw error;
      challengeId = data.id;
      const names = await namesFor([toId]);
      await addActivity(`${demo.profile.name} fordert ${(names[toId] && names[toId].name) || "jemanden"} zu einem Duell heraus. 🎮`);
      return challengeId;
    }
    const challenge = {
      id: Core.uid(),
      from: demo.user.email,
      to: toId,
      categories: categoryIds,
      fromResult: null,
      toResult: null,
      status: "pending",
      winner: null,
      createdAt: new Date().toISOString(),
    };
    demo.challenges.push(challenge);
    const toName = (demo.users[toId] && demo.users[toId].profile.name) || toId;
    await addActivity(`${demo.profile.name} fordert ${toName} zu einem Duell heraus. 🎮`);
    return challenge.id;
  }

  async function getMyChallenges() {
    if (!demo.user) return { incoming: [], outgoing: [] };
    if (client) {
      const { data, error } = await client.from("challenges").select("*").or(`from_user.eq.${myId()},to_user.eq.${myId()}`);
      if (error || !data) return { incoming: [], outgoing: [] };
      const ids = [...new Set(data.flatMap((c) => [c.from_user, c.to_user]))];
      const names = await namesFor(ids);
      const withNames = (c) => ({
        id: c.id, from: c.from_user, to: c.to_user, categories: c.categories, status: c.status, winner: c.winner,
        fromResult: c.from_result, toResult: c.to_result,
        fromName: (names[c.from_user] && names[c.from_user].name) || c.from_user,
        toName: (names[c.to_user] && names[c.to_user].name) || c.to_user,
      });
      return {
        incoming: data.filter((c) => c.to_user === myId() && c.status === "pending" && !c.to_result).map(withNames),
        outgoing: data.filter((c) => c.from_user === myId()).map(withNames),
      };
    }
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

  async function submitChallengeResult(challengeId, result) {
    if (!demo.user) return;
    if (client) {
      const { data: c, error } = await client.from("challenges").select("*").eq("id", challengeId).single();
      if (error || !c) return;
      const isFrom = c.from_user === myId();
      const patch = isFrom ? { from_result: result } : { to_result: result };
      const fromResult = isFrom ? result : c.from_result;
      const toResult = isFrom ? c.to_result : result;
      if (fromResult && toResult) {
        const names = await namesFor([c.from_user, c.to_user]);
        const fromName = (names[c.from_user] && names[c.from_user].name) || c.from_user;
        const toName = (names[c.to_user] && names[c.to_user].name) || c.to_user;
        if (fromResult.percent === toResult.percent) {
          patch.status = "completed"; patch.winner = null;
          await addActivity(`${fromName} und ${toName} haben unentschieden gespielt (${fromResult.percent}%). 🤝`);
        } else {
          const winnerIsFrom = fromResult.percent > toResult.percent;
          patch.status = "completed";
          patch.winner = winnerIsFrom ? c.from_user : c.to_user;
          const winnerName = winnerIsFrom ? fromName : toName;
          const loserName = winnerIsFrom ? toName : fromName;
          const winnerPct = winnerIsFrom ? fromResult.percent : toResult.percent;
          const loserPct = winnerIsFrom ? toResult.percent : fromResult.percent;
          await addActivity(`${winnerName} hat ${loserName} im Duell geschlagen (${winnerPct}% zu ${loserPct}%). 🏆`);
        }
      }
      await client.from("challenges").update(patch).eq("id", challengeId);
      return;
    }
    const c = demo.challenges.find((x) => x.id === challengeId);
    if (!c) return;
    const isFrom = c.from === demo.user.email;
    if (isFrom) c.fromResult = result;
    else c.toResult = result;

    if (c.fromResult && c.toResult) {
      c.status = "completed";
      const fromName = (demo.users[c.from] && demo.users[c.from].profile.name) || c.from;
      const toName = (demo.users[c.to] && demo.users[c.to].profile.name) || c.to;
      if (c.fromResult.percent === c.toResult.percent) {
        c.winner = null;
        await addActivity(`${fromName} und ${toName} haben unentschieden gespielt (${c.fromResult.percent}%). 🤝`);
      } else {
        const winnerIsFrom = c.fromResult.percent > c.toResult.percent;
        c.winner = winnerIsFrom ? c.from : c.to;
        const winnerName = winnerIsFrom ? fromName : toName;
        const loserName = winnerIsFrom ? toName : fromName;
        const winnerPct = winnerIsFrom ? c.fromResult.percent : c.toResult.percent;
        const loserPct = winnerIsFrom ? c.toResult.percent : c.fromResult.percent;
        await addActivity(`${winnerName} hat ${loserName} im Duell geschlagen (${winnerPct}% zu ${loserPct}%). 🏆`);
      }
    }
  }

  function notifyPracticing(categoryTitle) {
    if (!demo.user) return;
    addActivity(`${demo.profile.name} übt gerade „${categoryTitle}“ …`);
  }

  function saveThemePreference(themeId) {
    if (client && demo.user) {
      client.from("profiles").update({ theme: themeId }).eq("id", demo.user.id)
        .then(() => {}, (e) => console.warn("Design konnte nicht gespeichert werden:", e));
    }
  }

  return {
    isConfigured,
    restoreSession,
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
    saveThemePreference,
    saveBio,
  };
})();
