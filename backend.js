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

  // Verwandelt technische "Tabelle/Spalte fehlt"-Fehler von Supabase in eine
  // klare, handlungsleitende Meldung statt eines kryptischen Postgres-Textes.
  function friendlyDbError(rawMessage) {
    const msg = rawMessage || "";
    if (/does not exist/i.test(msg) || /Could not find the table/i.test(msg) || /schema cache/i.test(msg) || /column .* does not exist/i.test(msg)) {
      return "Diese Funktion braucht noch eine Datenbank-Anpassung, die noch nicht eingerichtet ist. Bitte im Supabase SQL-Editor einmal das komplette Nachrüst-SQL aus dem README (Abschnitt „4e. Nachrüst-SQL\") ausführen — danach funktioniert es. (Technische Meldung: " + msg + ")";
    }
    // WICHTIG: Rohe Postgres-/Supabase-Fehlermeldungen enthalten oft technische SQL-Details
    // (Spalten-, Tabellen- oder Regel-Namen) — für alle weiteren, häufigen Fehlertypen gibt es
    // hier jetzt ebenfalls eine verständliche Übersetzung, statt die rohe Meldung ungefiltert
    // durchzureichen. Ganz am Ende steht als sicheres Auffangnetz eine allgemeine, freundliche
    // Nachricht, damit NIE wieder unübersetzte Datenbank-Technik sichtbar wird.
    if (/permission denied|row-level security|RLS/i.test(msg)) {
      return "Dafür fehlt gerade die Berechtigung in der Datenbank — meist hilft es, das Nachrüst-SQL aus dem README noch einmal komplett auszuführen. (Technische Meldung: " + msg + ")";
    }
    if (/duplicate key|unique constraint/i.test(msg)) {
      return "Das gibt es in dieser Form schon — bitte einmal neu laden und nochmal versuchen.";
    }
    if (/foreign key/i.test(msg)) {
      return "Der zugehörige Eintrag scheint nicht (mehr) zu existieren. Bitte einmal neu laden und nochmal versuchen.";
    }
    if (/network|fetch failed|Failed to fetch/i.test(msg)) {
      return "Verbindung zum Server ist gerade nicht möglich — bitte die Internetverbindung prüfen und nochmal versuchen.";
    }
    if (!msg) return "Das hat leider nicht geklappt — bitte nochmal versuchen.";
    return "Das hat leider nicht geklappt. Falls das öfter passiert, sag gerne Bescheid, was genau du gemacht hast. (Technische Meldung: " + msg + ")";
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
    playlistSongs: [], // { id, title, url, added_by, created_at }
    songFavorites: [], // { user_id, song_id }
  };

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function defaultProfile(name) {
    return { name, bio: "", birthday: "", avatarUrl: "", avatarEmoji: "", gallery: [], hobbies: [], origin: "", points: 0, badges: [], trophies: [], history: [], isPremium: false, theme: "bastelheft", isAdmin: false, isOwner: false, isModerator: false, giftedCategories: [], giftedThemes: [], languages: [], favMovie: "", favSeries: "", favSong: "", favFood: "", favDrink: "", favCountry: "", favQuote: "", poem: "", profileBannerUrl: "", extraProfileData: {} };
  }

  /* ================= AUTH ================= */

  async function fetchOrCreateProfile(userId, email, name) {
    try {
      const { data, error } = await client.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (!error && data) {
        return {
          name: data.name || name || email,
          bio: data.bio || "",
          birthday: data.birthday || "",
          avatarUrl: data.avatar_url || "",
          avatarEmoji: data.avatar_emoji || "",
          gallery: data.gallery || [],
          hobbies: data.hobbies || [],
          origin: data.origin || "",
          points: data.points || 0,
          badges: data.badges || [],
          trophies: data.trophies || [],
          history: [],
          isPremium: Boolean(data.is_premium),
          theme: data.theme || "bastelheft",
          isAdmin: Boolean(data.is_admin),
          isOwner: Boolean(data.is_owner),
          isModerator: Boolean(data.is_moderator),
          isBetaTester: Boolean(data.is_beta_tester),
          isContributor: Boolean(data.is_contributor),
          isSupporter: Boolean(data.is_supporter),
          giftedCategories: data.gifted_categories || [],
          giftedThemes: data.gifted_themes || [],
          languages: data.languages || [],
          favMovie: data.fav_movie || "",
          favSeries: data.fav_series || "",
          favSong: data.fav_song || "",
          favFood: data.fav_food || "",
          poem: data.poem || "",
          favDrink: data.fav_drink || "",
          favCountry: data.fav_country || "",
          favQuote: data.fav_quote || "",
          profileBannerUrl: data.profile_banner_url || "",
          extraProfileData: data.extra_profile_data || {},
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
        return data.map((r) => ({ playedAt: r.played_at, character: r.character, percent: r.percent, points: r.points }));
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

  async function signUp(email, password, name, referrerId = null) {
    if (client) {
      const redirectTo = window.location.origin + window.location.pathname;
      const { data, error } = await client.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: redirectTo } });
      if (error) throw error;
      if (!data.session) {
        // Manche Supabase-Projekte liefern die Session verzögert, obwohl "Confirm email"
        // eigentlich aus ist. Ein direkter Login-Versuch fängt diesen Fall ab, bevor wir
        // die Nutzerin fälschlich zur E-Mail-Bestätigung schicken.
        try {
          const retry = await client.auth.signInWithPassword({ email, password });
          if (!retry.error && retry.data.session) {
            demo.user = { id: retry.data.user.id, email: retry.data.user.email, name };
            demo.profile = await fetchOrCreateProfile(retry.data.user.id, retry.data.user.email, name);
            await applyReferralBonus(referrerId);
            return demo.user;
          }
        } catch (e) { /* fällt unten durch zur Bestätigungs-Meldung */ }
        throw new Error("Fast fertig! Bitte bestätige deine E-Mail-Adresse über den Link, den wir dir gerade geschickt haben — schau auch im Spam-Ordner. Kommt gar keine Mail an, ist meist das Supabase-E-Mail-Limit erreicht oder „Confirm email“ steht noch auf an (Dashboard → Authentication → Providers → Email).");
      }
      demo.user = { id: data.user.id, email: data.user.email, name };
      demo.profile = await fetchOrCreateProfile(data.user.id, data.user.email, name);
      await applyReferralBonus(referrerId);
      return demo.user;
    }
    if (demo.users[email]) throw new Error("Diese E-Mail ist im Demo-Modus schon registriert.");
    demo.users[email] = { password, profile: defaultProfile(name) };
    demo.user = { id: email, email, name };
    demo.profile = demo.users[email].profile;
    await applyReferralBonus(referrerId);
    return demo.user;
  }
  // Empfehlungs-Bonus: sowohl die werbende Person als auch der/die neu Registrierte bekommen je
  // 50 Punkte, wenn die Anmeldung über einen personalisierten Empfehlungs-Link kam. Läuft bewusst
  // NACH erfolgreicher Registrierung, niemals bei bloß angestoßener E-Mail-Bestätigung.
  const REFERRAL_BONUS_POINTS = 25;
  async function applyReferralBonus(referrerId) {
    if (!referrerId || !demo.user || referrerId === demo.user.id) return;
    try {
      await adminGrantPoints(demo.user.id, REFERRAL_BONUS_POINTS, "Willkommen! Du hast dich über einen Empfehlungs-Link angemeldet — hier sind 25 Extra-Punkte zum Start! 🎉");
      await adminGrantPoints(referrerId, REFERRAL_BONUS_POINTS, `Danke, dass du die Seite weiterempfohlen hast — ${demo.user.email ? "jemand" : "eine Person"} hat sich über deinen Link angemeldet! 🎉`);
    } catch (e) { console.warn("Empfehlungs-Bonus konnte nicht vergeben werden:", e); }
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
    demo.user = { id: email, email, name: record.profile.name };
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

  // Lädt das eigene Profil frisch aus der Datenbank und ersetzt die lokal
  // zwischengespeicherten Werte — wichtig nach Geschenken/Freischaltungen,
  // die von einer anderen Person ausgelöst wurden und sonst erst nach
  // manuellem Neuladen der Seite sichtbar würden.
  async function refreshCurrentProfile() {
    if (!demo.user) return demo.profile;
    if (client) {
      const fresh = await fetchOrCreateProfile(demo.user.id, demo.user.email, demo.user.name);
      const history = demo.profile ? demo.profile.history : [];
      demo.profile = Object.assign({}, fresh, { history });
    }
    return demo.profile;
  }

  /* ================= PROFIL & PUNKTE ================= */

  async function getFullPointsBreakdown() {
    if (!demo.user) return [];
    if (client) {
      try {
        const { data, error } = await client.from("results").select("character,points,bonus").eq("user_id", demo.user.id);
        if (!error && data) {
          const sums = {};
          // WICHTIG: bonus mitzählen, nicht nur points — sonst fehlen Tempo-Boni, Tagesaufgaben-
          // Punkte und Ranking-Belohnungen in der Aufschlüsselung, obwohl sie im Gesamtstand
          // längst mitgezählt wurden. Das war der Grund, warum sich die Summe nie ausging.
          data.forEach((r) => { sums[r.character] = (sums[r.character] || 0) + Math.round((r.points || 0) + (r.bonus || 0)); });
          return Object.entries(sums).sort((a, b) => b[1] - a[1]);
        }
      } catch (e) {
        console.warn("Punkte-Aufschlüsselung konnte nicht geladen werden:", e);
      }
      return [];
    }
    const sums = {};
    (demo.profile.history || []).forEach((h) => { sums[h.character] = (sums[h.character] || 0) + Math.round((h.points || 0) + (h.bonus || 0)); });
    return Object.entries(sums).sort((a, b) => b[1] - a[1]);
  }

  async function saveResult(result) {
    // result: { categories:[ids], points, bonus, percent, character, badges:[], playedAt }
    if (!demo.profile) return; // nicht eingeloggt -> Ergebnis wird nur lokal in der Session gezeigt
    const earned = Math.round(result.points + result.bonus);
    demo.profile.history.unshift(result);
    result.badges.forEach((b) => {
      if (!demo.profile.badges.includes(b)) demo.profile.badges.push(b);
    });

    if (client) {
      // Erwartete Tabelle: results (user_id, categories, points, bonus, percent, character, played_at)
      const { error: resultsError } = await client.from("results").insert({
        user_id: demo.user.id,
        categories: result.categories,
        points: result.points,
        bonus: result.bonus,
        percent: result.percent,
        character: result.character,
        played_at: result.playedAt,
      });
      if (resultsError) console.warn("Tabelle results konnte nicht gespeichert werden:", resultsError.message);

      // KRITISCH — echte Wettlaufbedingung behoben: Punkte NIE aus dem lokalen (möglicherweise
      // veralteten) Stand hochrechnen, sondern immer direkt vorher den WIRKLICH aktuellen
      // Serverstand abholen und ERST DANN draufaddieren. Sonst könnte ein zweites Gerät (z. B.
      // Handy + Tablet gleichzeitig offen) mit einem älteren lokalen Stand den neueren Stand des
      // anderen Geräts überschreiben — Punkte gehen dabei komplett und unbemerkt verloren.
      const { data: freshRow } = await client.from("profiles").select("points").eq("id", demo.user.id).maybeSingle();
      const serverPoints = freshRow ? (freshRow.points || 0) : demo.profile.points;
      const newTotal = serverPoints + earned;
      demo.profile.points = newTotal;

      let profileError = (await client.from("profiles").update({ points: newTotal, badges: demo.profile.badges }).eq("id", demo.user.id)).error;
      if (profileError) {
        await new Promise((r) => setTimeout(r, 800));
        profileError = (await client.from("profiles").update({ points: newTotal, badges: demo.profile.badges }).eq("id", demo.user.id)).error;
      }
      if (profileError) {
        console.warn("Punkte/Abzeichen im Profil konnten nicht gespeichert werden:", profileError.message);
        if (typeof window !== "undefined" && window.__dmaPointsSaveFailed) window.__dmaPointsSaveFailed();
      }
    } else {
      demo.profile.points += earned;
    }

    // Tagesranking aktualisieren (Demo-Fallback)
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

  // Gesamt-Bestenliste — einfach nach Lebenszeit-Punktestand aus den Profilen sortiert.
  async function getRankingAllTime() {
    if (client) {
      try {
        const { data, error } = await client.from("profiles").select("id,name,points").order("points", { ascending: false }).limit(20);
        if (!error && data) return data.map((p) => ({ user_id: p.id, name: p.name, points: p.points }));
      } catch (e) { console.warn("Gesamt-Ranking nicht verfügbar:", e); }
      return [];
    }
    // Dedupe: das eigene Konto kann sowohl in demo.users als auch separat in demo.profile
    // auftauchen, je nachdem wie es angelegt wurde — ohne Entdopplung erschien man doppelt.
    const combined = Object.entries(demo.users || {}).map(([email, u]) => ({ user_id: email, name: u.profile.name, points: u.profile.points }))
      .concat(demo.profile && demo.user ? [{ user_id: demo.user.id, name: demo.profile.name, points: demo.profile.points }] : []);
    const seen = new Set();
    const deduped = combined.filter((r) => (seen.has(r.user_id) ? false : (seen.add(r.user_id), true)));
    return deduped.sort((a, b) => b.points - a.points).slice(0, 20);
  }

  // Echte Tages-Rangliste — nur die HEUTE tatsächlich verdienten Punkte zählen (nicht der
  // Lebenszeit-Gesamtstand), damit auch neue Spieler eine faire Chance haben, andere an einem
  // einzelnen Tag einzuholen.
  async function getRankingToday() {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    if (client) {
      try {
        const { data, error } = await client.from("results").select("user_id,points,bonus").gte("played_at", start.toISOString());
        if (error || !data) return [];
        const totals = {};
        data.forEach((r) => { totals[r.user_id] = (totals[r.user_id] || 0) + Math.round((r.points || 0) + (r.bonus || 0)); });
        const ids = Object.keys(totals);
        if (!ids.length) return [];
        const { data: profiles } = await client.from("profiles").select("id,name").in("id", ids);
        return ids.map((id) => ({ user_id: id, name: (profiles || []).find((p) => p.id === id)?.name || "?", points: totals[id] }))
          .sort((a, b) => b.points - a.points).slice(0, 20);
      } catch (e) { console.warn("Tages-Ranking nicht verfügbar:", e); return []; }
    }
    if (!demo.profile) return [];
    const todaysPoints = (demo.profile.history || [])
      .filter((h) => new Date(h.playedAt) >= start)
      .reduce((sum, h) => sum + Math.round((h.points || 0) + (h.bonus || 0)), 0);
    return todaysPoints > 0 ? [{ user_id: demo.user ? demo.user.id : null, name: demo.profile.name, points: todaysPoints }] : [];
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

  async function addGuestbookEntry(name, message, rating = null) {
    const entry = { id: Core.uid(), name, message, rating, date: new Date().toISOString(), user_id: demo.user ? demo.user.id : null };
    if (client) {
      try {
        await client.from("guestbook").insert({ name, message, rating, user_id: demo.user ? demo.user.id : null });
      } catch (e) {
        console.warn("Supabase-Insert fehlgeschlagen, Eintrag bleibt lokal:", e);
      }
    }
    demo.guestbook.unshift(entry);
    // Eigener Zähler in extraProfileData (statt einer Live-Datenbankabfrage) — für die
    // Kombinations-Missionen der Sammelfiguren, nach demselben Muster wie songsAddedCount.
    if (demo.user && demo.profile) {
      const current = (demo.profile.extraProfileData && demo.profile.extraProfileData.guestbookEntriesCount) || 0;
      await updateExtraProfileField("guestbookEntriesCount", current + 1);
    }
    return entry;
  }
  async function getAverageRating() {
    const entries = await getGuestbook();
    const rated = entries.filter((e) => e.rating);
    if (!rated.length) return null;
    return { average: rated.reduce((sum, e) => sum + e.rating, 0) / rated.length, count: rated.length };
  }

  /* ================= PREMIUM (bezahlbarer Zusatzinhalt) ================= */
  // Echte Zahlungsprüfung braucht eine serverseitige Funktion (z. B. Supabase Edge
  // Function + PayPal-Webhook), die is_premium in der Profil-Tabelle setzt. Diese
  // Demo simuliert die Freischaltung lokal, damit die App vollständig testbar ist.

  async function togglePremium(on) {
    if (!demo.profile) return;
    demo.profile.isPremium = on;
    if (client && demo.user) {
      const { error } = await client.from("profiles").update({ is_premium: on }).eq("id", demo.user.id);
      if (error) console.warn("Premium-Status konnte nicht gespeichert werden:", error);
    }
  }
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

  /* ================= PERSÖNLICHE BENACHRICHTIGUNGEN (Geschenke, Likes, Kommentare) ================= */
  demo.notifications = demo.notifications || [];
  demo.privateMessages = demo.privateMessages || [];

  // targetRef (optional): { view: "community"|"tips", textId: "..." } — wird als versteckte
  // Kennung ans Ende der Nachricht angehängt (wie bei den Sticker-Kürzeln), damit ein Klick auf
  // die Benachrichtigung direkt zum betroffenen Beitrag springen kann, statt nur allgemein zum
  // Profil. Braucht dadurch keine Datenbank-Änderung.
  async function addNotification(targetUserId, message, targetRef) {
    if (!targetUserId) return;
    const finalMessage = targetRef ? `${message}[[target:${targetRef.view}:${targetRef.textId}]]` : message;
    if (client) {
      try {
        await client.from("notifications").insert({ user_id: targetUserId, message: finalMessage });
      } catch (e) {
        console.warn("Benachrichtigung konnte nicht gespeichert werden:", e);
      }
      return;
    }
    demo.notifications.push({ id: Core.uid(), user_id: targetUserId, message: finalMessage, read: false, created_at: new Date().toISOString() });
  }

  /* ---------------------------------------------------------
     PRIVATES POSTFACH — Nachrichten zwischen Freunden + automatische
     System-Zusammenfassung nach gespielten Runden.
     --------------------------------------------------------- */
  async function sendPrivateMessage(toUserId, body, imageUrl) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (!body || !body.trim()) {
      if (!imageUrl) throw new Error("Nachricht darf nicht leer sein.");
    }
    if (client) {
      const { error } = await client.from("private_messages").insert({
        from_user: demo.user.id, to_user: toUserId, author_name: demo.profile.name, body: (body || "").trim(), is_system: false, image_url: imageUrl || null,
      });
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    demo.privateMessages.push({ id: Core.uid(), from_user: demo.user.id, to_user: toUserId, author_name: demo.profile.name, body: (body || "").trim(), is_system: false, image_url: imageUrl || null, read: false, created_at: new Date().toISOString() });
  }

  // Admin schickt gestaffelt Punkte per Postfach — z. B. als Entschädigung oder Belohnung.
  // Erhöht die Punktzahl der Zielperson direkt in der profiles-Tabelle UND schickt gleichzeitig
  // eine erklärende System-Nachricht, damit klar ist, wofür.
  async function adminGrantPoints(toUserId, amount, reason) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Ungültige Punktzahl.");
    if (client) {
      const { data: target, error: fetchErr } = await client.from("profiles").select("points").eq("id", toUserId).maybeSingle();
      if (fetchErr || !target) throw new Error(friendlyDbError(fetchErr?.message || "Profil nicht gefunden."));
      const { error } = await client.from("profiles").update({ points: (target.points || 0) + amount }).eq("id", toUserId);
      if (error) throw new Error(friendlyDbError(error.message));
    } else {
      demo.allProfiles = demo.allProfiles || [];
      const target = demo.allProfiles.find((p) => p.id === toUserId) || demo.profile;
      if (target) target.points = (target.points || 0) + amount;
    }
    const messageText = `🎁 Du hast ${amount} Punkte geschenkt bekommen!${reason ? `\n\nGrund: ${reason}` : ""}`;
    await sendSystemMessage(toUserId, messageText);
  }
  async function sendBroadcastMessage(body) {
    if (!isAdmin()) throw new Error("Nur Administratoren oder der Betreiber können Rundmails verschicken.");
    if (!body || !body.trim()) throw new Error("Nachricht darf nicht leer sein.");
    const text = `📢 ${body.trim()}`;
    if (client) {
      const { data: allUsers, error } = await client.from("profiles").select("id");
      if (error) throw new Error(friendlyDbError(error.message));
      const rows = (allUsers || []).map((u) => ({ from_user: demo.user.id, to_user: u.id, author_name: `📢 ${demo.profile.name} (Team)`, body: text, is_system: false }));
      if (rows.length) {
        const { error: insErr } = await client.from("private_messages").insert(rows);
        if (insErr) throw new Error(friendlyDbError(insErr.message));
      }
      return;
    }
    Object.keys(demo.users).forEach((uid) => {
      demo.privateMessages.push({ id: Core.uid(), from_user: demo.user.id, to_user: uid, author_name: `📢 ${demo.profile.name} (Team)`, body: text, is_system: false, read: false, created_at: new Date().toISOString() });
    });
  }

  async function sendSystemMessage(toUserId, body) {
    if (!toUserId) return;
    if (client) {
      try {
        await client.from("private_messages").insert({ from_user: null, to_user: toUserId, author_name: "System", body, is_system: true });
      } catch (e) { console.warn("System-Nachricht konnte nicht gespeichert werden:", e); }
      return;
    }
    demo.privateMessages.push({ id: Core.uid(), from_user: null, to_user: toUserId, author_name: "System", body, is_system: true, read: false, created_at: new Date().toISOString() });
    return;
  }
  // Fehlermeldung von Nutzer:innen — landet automatisch im Postfach des Betreibers, ohne dass
  // die Person selbst etwas schreiben muss. Nur die Art des Fehlers und der Ort (welches Spiel,
  // welche Frage gerade angezeigt wurde) werden mitgeschickt.
  async function reportBug(context, errorType) {
    const reporterName = demo.profile ? demo.profile.name : "Unbekannt";
    const reporterId = demo.user ? demo.user.id : null;
    // Zusätzlich zur Nachricht (unten) in eine eigene, übersichtliche Sammelstelle schreiben, die
    // der Admin gebündelt einsehen kann, statt zwischen allen anderen Postfach-Nachrichten suchen
    // zu müssen.
    const record = { reporter_name: reporterName, reporter_id: reporterId, context, category: errorType, resolved: false, created_at: new Date().toISOString() };
    if (client) {
      client.from("bug_reports").insert(record).then(() => {}, (e) => console.warn("Bug-Report konnte nicht gespeichert werden:", e));
    } else {
      demo.bugReports = demo.bugReports || [];
      record.id = Core.uid();
      demo.bugReports.push(record);
    }
    let ownerId = null;
    if (client) {
      try {
        const { data } = await client.from("profiles").select("id").eq("is_owner", true).limit(1);
        if (data && data[0]) ownerId = data[0].id;
      } catch (e) { console.warn("Betreiber nicht gefunden:", e); }
    } else {
      const ownerEmail = Object.keys(demo.users || {}).find((email) => demo.users[email].profile.isOwner) || (demo.profile && demo.profile.isOwner ? demo.user.id : null);
      ownerId = ownerEmail;
    }
    if (!ownerId) return;
    const body = `🪲 FEHLERMELDUNG\n\nVon: ${reporterName}\nOrt: ${context}\nArt: ${errorType}\nZeitpunkt: ${new Date().toLocaleString("de-DE")}`;
    await sendSystemMessage(ownerId, body);
  }

  async function getMyMessages() {
    if (!demo.user) return { inbox: [], outbox: [] };
    if (client) {
      const { data, error } = await client.from("private_messages").select("*")
        .or(`to_user.eq.${demo.user.id},from_user.eq.${demo.user.id}`)
        .order("created_at", { ascending: false }).limit(120);
      if (error || !data) return { inbox: [], outbox: [] };
      const outboxRaw = data.filter((m) => m.from_user === demo.user.id && !m.deleted_by_sender);
      const names = await namesFor([...new Set(outboxRaw.map((m) => m.to_user))]);
      return {
        inbox: data.filter((m) => m.to_user === demo.user.id && !m.deleted_by_recipient),
        outbox: outboxRaw.map((m) => ({ ...m, to_user_name: (names[m.to_user] && names[m.to_user].name) || "Freund" })),
      };
    }
    const all = demo.privateMessages.filter((m) => m.to_user === demo.user.id || m.from_user === demo.user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return {
      inbox: all.filter((m) => m.to_user === demo.user.id && !m.deleted_by_recipient).slice(0, 120),
      outbox: all.filter((m) => m.from_user === demo.user.id && !m.deleted_by_sender).map((m) => ({
        ...m, to_user_name: (demo.users[m.to_user] && demo.users[m.to_user].profile.name) || "Freund",
      })).slice(0, 120),
    };
  }

  async function deletePrivateMessage(id, iAmSender) {
    if (!demo.user) return;
    const field = iAmSender ? "deleted_by_sender" : "deleted_by_recipient";
    if (client) {
      await client.from("private_messages").update({ [field]: true }).eq("id", id);
      return;
    }
    const m = demo.privateMessages.find((x) => x.id === id);
    if (m) m[field] = true;
  }

  async function getUnreadMessageCount() {
    if (!demo.user) return 0;
    if (client) {
      const { count, error } = await client.from("private_messages").select("id", { count: "exact", head: true }).eq("to_user", demo.user.id).eq("read", false);
      if (error) return 0;
      return count || 0;
    }
    return demo.privateMessages.filter((m) => m.to_user === demo.user.id && !m.read).length;
  }

  async function markMessagesRead(ids) {
    if (!ids || !ids.length) return;
    if (client) {
      await client.from("private_messages").update({ read: true }).in("id", ids);
      return;
    }
    demo.privateMessages.forEach((m) => { if (ids.includes(m.id)) m.read = true; });
  }

  async function getUnreadNotifications() {
    if (!demo.user) return [];
    if (client) {
      try {
        const { data, error } = await client.from("notifications").select("*").eq("user_id", demo.user.id).eq("read", false).order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) { console.warn("Benachrichtigungen konnten nicht geladen werden:", e); }
      return [];
    }
    return demo.notifications.filter((n) => n.user_id === demo.user.id && !n.read);
  }

  async function markNotificationsRead(ids) {
    if (!demo.user || !ids.length) return;
    if (client) {
      try {
        await client.from("notifications").update({ read: true }).in("id", ids);
      } catch (e) { console.warn("Benachrichtigungen konnten nicht als gelesen markiert werden:", e); }
      return;
    }
    demo.notifications.forEach((n) => { if (ids.includes(n.id)) n.read = true; });
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

  /* ================= MUSIK-PLAYER (gemeinsame Playlist + eigene Playlists) =================
     Songs werden über die Oberfläche verwaltet, kein Code nötig. Unterstützt sowohl
     YouTube-Links als auch direkte Audio-Dateien (z. B. ein GitHub-Rohlink zu einer MP3).
     owner_id = null → gemeinsame Community-Playlist (nur Admins verwalten sie).
     owner_id = eine Nutzer-ID → die eigene Playlist dieser Person (jede/r verwaltet nur die eigene). */
  function isDirectAudioUrl(url) {
    return /\.(mp3|m4a|wav|ogg|aac)(\?.*)?$/i.test(url || "");
  }
  /* ================= SEITENINHALTE (admin-editierbar, für alle sichtbar) =================
     Für Bereiche wie "Über mich" — jeder kann sie lesen, aber nur Admins ändern sie. Fehlt ein
     Wert (noch keine Tabelle angelegt, oder noch nie geändert), gilt einfach der feste Text aus
     dem HTML weiter — das Nachrüsten dieser Funktion ist also risikofrei. */
  /* ================= FEHLERMELDUNGEN (Bug-Reports) =================
     Ergänzt die bestehende reportBug()-Funktion (die weiterhin eine Nachricht ins Postfach
     schickt) um eine zusätzliche, übersichtliche Sammelstelle für den Admin-Bereich — sonst
     gehen Meldungen im normalen Postfach zwischen allen anderen Nachrichten unter. */
  /* ================= PROFIL-BESUCHER & PROFIL-SPUREN =================
     Wer war da? Nur für Admins/Moderatoren sichtbar (auf dem eigenen Profil), da normale
     Mitglieder das laut Wunsch nicht sehen sollen. "Spuren" sind kurze Grüße, die JEDER auf
     einem fremden Profil hinterlassen kann — unabhängig von der Besucher-Anzeige. */
  async function recordProfileVisit(profileOwnerId) {
    if (!demo.user || demo.user.id === profileOwnerId) return; // sich selbst nicht mitzählen
    const row = { visitor_id: demo.user.id, visitor_name: demo.profile.name, visited_id: profileOwnerId, visited_at: new Date().toISOString() };
    if (client) {
      try { await client.from("profile_visits").upsert(row, { onConflict: "visitor_id,visited_id" }); }
      catch (e) { console.warn("Profilbesuch konnte nicht gespeichert werden:", e); }
      return;
    }
    demo.profileVisits = demo.profileVisits || [];
    const existing = demo.profileVisits.find((v) => v.visitor_id === row.visitor_id && v.visited_id === row.visited_id);
    if (existing) existing.visited_at = row.visited_at; else demo.profileVisits.push(row);
  }
  async function getProfileVisitors(profileOwnerId, requesterIsAdmin) {
    if (!requesterIsAdmin) return [];
    if (client) {
      const { data, error } = await client.from("profile_visits").select("*").eq("visited_id", profileOwnerId).order("visited_at", { ascending: false }).limit(20);
      if (!error && data) return data;
      return [];
    }
    return (demo.profileVisits || []).filter((v) => v.visited_id === profileOwnerId).sort((a, b) => new Date(b.visited_at) - new Date(a.visited_at));
  }
  async function addProfileNote(profileOwnerId, message) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (!message.trim()) throw new Error("Nachricht darf nicht leer sein.");
    const note = { profile_owner_id: profileOwnerId, author_id: demo.user.id, author_name: demo.profile.name, message: message.trim(), created_at: new Date().toISOString() };
    if (client) {
      const { error } = await client.from("profile_notes").insert(note);
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    demo.profileNotes = demo.profileNotes || [];
    note.id = Core.uid();
    demo.profileNotes.push(note);
  }
  // Eigene, selbst geschriebene Spuren wieder löschen können — bewusst NUR der eigene Eintrag
  // (author_id muss übereinstimmen), unabhängig davon, auf wessen Profil er steht.
  async function deleteMyProfileNote(noteId) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (client) {
      const { error } = await client.from("profile_notes").delete().eq("id", noteId).eq("author_id", demo.user.id);
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    demo.profileNotes = (demo.profileNotes || []).filter((n) => !(n.id === noteId && n.author_id === demo.user.id));
  }
  async function getProfileNotes(profileOwnerId) {
    if (client) {
      const { data, error } = await client.from("profile_notes").select("*").eq("profile_owner_id", profileOwnerId).order("created_at", { ascending: false }).limit(30);
      if (!error && data) return data;
      return [];
    }
    return (demo.profileNotes || []).filter((n) => n.profile_owner_id === profileOwnerId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async function getBugReports() {
    if (!isAdmin()) return [];
    if (client) {
      const { data, error } = await client.from("bug_reports").select("*").order("created_at", { ascending: false });
      if (!error && data) return data;
      return [];
    }
    return [...(demo.bugReports || [])].reverse();
  }
  // Sobald ein Admin einen Fehler als erledigt/verifiziert markiert, bekommt die meldende Person
  // automatisch 10 Punkte gutgeschrieben — als kleiner Dank fürs Mithelfen. Passiert nur einmal
  // (steuert über das "resolved"-Flag), auch wenn versehentlich mehrfach geklickt wird.
  async function resolveBugReport(id) {
    if (!isAdmin()) throw new Error("Nur Administratoren können das.");
    if (client) {
      const { data: report, error: fetchErr } = await client.from("bug_reports").select("resolved,reporter_id").eq("id", id).maybeSingle();
      if (fetchErr) throw new Error(friendlyDbError(fetchErr.message));
      const alreadyResolved = report && report.resolved;
      const { error } = await client.from("bug_reports").update({ resolved: true }).eq("id", id);
      if (error) throw new Error(friendlyDbError(error.message));
      if (!alreadyResolved && report && report.reporter_id) {
        try { await adminGrantPoints(report.reporter_id, 10, "Danke fürs Melden eines Fehlers — bestätigt und behoben!"); }
        catch (e) { console.warn("Belohnung für Bug-Melder konnte nicht vergeben werden:", e); }
      }
      return;
    }
    const r = (demo.bugReports || []).find((x) => x.id === id);
    if (r && !r.resolved) {
      r.resolved = true;
      if (r.reporter_id) {
        try { await adminGrantPoints(r.reporter_id, 10, "Danke fürs Melden eines Fehlers — bestätigt und behoben!"); }
        catch (e) { console.warn("Belohnung für Bug-Melder konnte nicht vergeben werden:", e); }
      }
    }
  }

  async function getSiteContent(key) {
    if (client) {
      try {
        const { data, error } = await client.from("site_content").select("value").eq("key", key).maybeSingle();
        if (!error && data) return data.value;
      } catch (e) { console.warn("Seiteninhalt konnte nicht geladen werden:", e); }
      return null;
    }
    return (demo.siteContent && demo.siteContent[key]) || null;
  }
  async function setSiteContent(key, value) {
    if (!isAdmin()) throw new Error("Nur Administratoren können Seiteninhalte ändern.");
    if (client) {
      const { error } = await client.from("site_content").upsert({ key, value });
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    demo.siteContent = demo.siteContent || {};
    demo.siteContent[key] = value;
  }

  // ============ FREIGABE-SCHALTER FÜR NEUE FEATURES ============
  // Neue, noch nicht ganz fertig geprüfte Funktionen werden hinter einem benannten Schalter
  // versteckt — für ALLE Besucher unsichtbar/inaktiv, außer für dich als Betreiber (du siehst und
  // kannst sie live testen, bevor irgendjemand sonst sie zu Gesicht bekommt). Sobald du zufrieden
  // bist, schaltest du den betreffenden Namen frei — ab dem Moment sehen es alle. Reißt du die
  // Freigabe zurück, verschwindet es für alle wieder augenblicklich, so als wäre nichts gewesen.
  // Genutzt wird dafür dieselbe generische site_content-Tabelle, unter dem festen Schlüssel
  // "feature_flags" — ein einziges JSON-Objekt mit allen bekannten Schaltern.
  let featureFlagsCache = null;
  async function getFeatureFlags() {
    if (featureFlagsCache) return featureFlagsCache;
    const stored = await getSiteContent("feature_flags");
    featureFlagsCache = stored || {};
    return featureFlagsCache;
  }
  async function setFeatureFlag(key, enabled) {
    const flags = await getFeatureFlags();
    flags[key] = enabled;
    featureFlagsCache = flags;
    await setSiteContent("feature_flags", flags);
  }
  // Prüft, ob ein Feature gerade sichtbar sein soll: für dich als Betreiber IMMER ja (damit du in
  // echt durchklicken/durchspielen kannst, bevor es live geht) — für alle anderen nur, wenn du es
  // bereits ausdrücklich freigeschaltet hast.
  function isFeatureOn(key) {
    if (isOwner()) return true;
    if (demo.profile && demo.profile.isBetaTester) return true;
    return Boolean(featureFlagsCache && featureFlagsCache[key]);
  }
  // Für die Admin-Oberfläche selbst: der ECHTE, rohe Schalter-Zustand, OHNE die
  // "Betreiber sieht immer alles"-Sonderregel — sonst würde der Umschalter fälschlich immer
  // als "an" erscheinen, egal ob er für alle anderen wirklich schon freigegeben ist.
  function getRawFeatureFlag(key) {
    return Boolean(featureFlagsCache && featureFlagsCache[key]);
  }

  let lastPlaylistLoadError = null;
  let lastUserListError = null;
  async function getPlaylist(ownerId = null) {
    if (client) {
      try {
        let q = client.from("playlist_songs").select("*").order("created_at", { ascending: true });
        q = ownerId ? q.eq("owner_id", ownerId) : q.is("owner_id", null);
        const { data, error } = await q;
        if (!error && data) return data.filter((s) => !s.hidden);
        if (error) { console.warn("Playlist-Ladefehler (Tabelle/Spalte fehlt evtl. noch — siehe README-SQL):", error.message); lastPlaylistLoadError = error.message; }
      } catch (e) { console.warn("Playlist konnte nicht geladen werden:", e); lastPlaylistLoadError = String(e); }
      return [];
    }
    return demo.playlistSongs.filter((s) => (s.owner_id || null) === ownerId && !s.hidden);
  }
  // Vorstellungsrunde: eigene Vorstellung speichern (liegt in extraProfileData, kein eigenes
  // DB-Feld nötig) und alle vorhandenen Vorstellungen der Community abrufen — für die kompakte
  // Kartenansicht, damit sich Lernende gegenseitig kennenlernen können.
  async function saveIntroduction(introData) {
    await updateExtraProfileField("introduction", introData);
  }
  async function getAllIntroductions() {
    if (client) {
      try {
        const { data, error } = await client.from("profiles").select("id, name, theme, avatar_url, extra_profile_data").not("extra_profile_data->introduction", "is", null);
        if (error || !data) return [];
        return data.filter((p) => p.extra_profile_data && p.extra_profile_data.introduction).map((p) => ({
          id: p.id, name: p.name, theme: p.theme, avatarUrl: p.avatar_url, introduction: p.extra_profile_data.introduction,
        }));
      } catch (e) { return []; }
    }
    // Demo-Modus: durchsucht alle bekannten Demo-Profile nach einer hinterlegten Vorstellung.
    const results = [];
    Object.values(demo.users || {}).forEach((u) => {
      if (u.profile && u.profile.extraProfileData && u.profile.extraProfileData.introduction) {
        results.push({ id: u.profile.id || "demo", name: u.profile.name, theme: u.profile.theme, avatarUrl: u.profile.avatarUrl, introduction: u.profile.extraProfileData.introduction });
      }
    });
    if (demo.profile && demo.profile.extraProfileData && demo.profile.extraProfileData.introduction) {
      results.push({ id: demo.user.id, name: demo.profile.name, theme: demo.profile.theme, avatarUrl: demo.profile.avatarUrl, introduction: demo.profile.extraProfileData.introduction });
    }
    return results;
  }
  // Liste aller Personen, die schon mindestens einen Song in ihrer EIGENEN Playlist haben — für
  // die Übersicht "Playlisten der anderen", damit man mit einem Klick direkt zur Playlist einer
  // bestimmten Person springen kann, ohne erst über deren Profil suchen zu müssen.
  async function getUsersWithPlaylists() {
    if (client) {
      try {
        const { data, error } = await client.from("playlist_songs").select("owner_id").not("owner_id", "is", null);
        if (error || !data) return [];
        const ownerIds = [...new Set(data.map((r) => r.owner_id))];
        if (!ownerIds.length) return [];
        const { data: profiles } = await client.from("profiles").select("id, name, avatar_url").in("id", ownerIds);
        return profiles || [];
      } catch (e) { console.warn("Playlisten-Übersicht konnte nicht geladen werden:", e); return []; }
    }
    const ownerIds = [...new Set(demo.playlistSongs.filter((s) => s.owner_id).map((s) => s.owner_id))];
    return ownerIds.map((id) => {
      const entry = demo.users && demo.users[id]; // im Demo-Modus ist die Nutzer-ID die E-Mail selbst
      return entry ? { id, name: entry.profile.name, avatar_url: entry.profile.avatarUrl } : { id, name: "Unbekannt", avatar_url: null };
    });
  }
  async function addPlaylistSong(title, url, ownerId = null, recommendedByName = null, coverUrl = null, originalRecommenderId = null, originalRecommenderName = null) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (ownerId === null && !isAdmin()) throw new Error("Nur Administratoren können Songs zur gemeinsamen Playlist hinzufügen.");
    if (ownerId !== null && ownerId !== demo.user.id) throw new Error("Du kannst nur zu deiner eigenen Playlist hinzufügen.");
    if (!title.trim() || !url.trim()) throw new Error("Titel und Link dürfen nicht leer sein.");
    const song = {
      title: title.trim(), url: url.trim(), added_by: demo.user.id, owner_id: ownerId,
      recommended_by_name: recommendedByName, cover_url: coverUrl || null,
      // Verfolgt die URSPRÜNGLICHE Quelle über beliebig lange Übernahme-Ketten hinweg — wichtig
      // für die Beliebtheits-Zählung: wenn A's Song von B übernommen wird und dann von C aus B's
      // Playlist übernommen wird, soll die Beliebtheit trotzdem korrekt bei A landen, nicht bei B.
      original_recommender_id: originalRecommenderId, original_recommender_name: originalRecommenderName,
      created_at: new Date().toISOString(),
    };
    // Zähler für den Musikerfuchs — nur bei der EIGENEN Playlist, nicht bei Beiträgen zur
    // gemeinsamen (die zählen als Admin-Kuration, nicht als persönlicher Musikbeitrag).
    if (ownerId === demo.user.id) {
      const extra = demo.profile.extraProfileData || {};
      extra.songsAddedCount = (extra.songsAddedCount || 0) + 1;
      demo.profile.extraProfileData = extra;
      updateExtraProfileField("songsAddedCount", extra.songsAddedCount);
    }
    let savedSong;
    if (client) {
      const { data, error } = await client.from("playlist_songs").insert(song).select().single();
      if (error) throw new Error(friendlyDbError(error.message));
      savedSong = data;
    } else {
      song.id = Core.uid();
      demo.playlistSongs.push(song);
      savedSong = song;
    }
    // Automatische kleine Belohnung für die URSPRÜNGLICHE empfehlende Person, sobald ihr Song von
    // jemand anderem übernommen wird — die Beliebtheit eines Songs (siehe getSongPopularity) macht
    // sich so auch in echten Punkten bemerkbar, nicht nur als Anzeige.
    if (originalRecommenderId && originalRecommenderId !== demo.user.id) {
      try { await adminGrantPoints(originalRecommenderId, 5, `Dein empfohlener Song „${title.trim()}" wurde von jemandem übernommen — macht ihn beliebter! 🎵`); }
      catch (e) { console.warn("Beliebtheits-Bonus konnte nicht vergeben werden:", e); }
    }
    return savedSong;
  }
  // Zählt, wie oft ein Song (verfolgt über die ursprünglich empfehlende Person + Titel) in andere
  // Playlists übernommen wurde — die "Beliebtheit" eines Songs.
  async function getSongPopularity(originalRecommenderId, title) {
    if (!originalRecommenderId) return 0;
    if (client) {
      try {
        const { count, error } = await client.from("playlist_songs").select("id", { count: "exact", head: true })
          .eq("original_recommender_id", originalRecommenderId).eq("title", title);
        if (!error) return count || 0;
        return 0;
      } catch (e) { return 0; }
    }
    return (demo.playlistSongs || []).filter((s) => s.original_recommender_id === originalRecommenderId && s.title === title).length;
  }
  // Cover-Bild für einen Song hochladen — Alternative zum YouTube-Video als "Cover-Ansicht" im
  // aufgeklappten Player-Fenster (siehe renderMusicPlayer/setSongCover).
  async function uploadSongCover(file) {
    if (!client || !demo.user) throw new Error("Bilder hochladen geht nur mit verbundenem Supabase.");
    const path = `${demo.user.id}/song-cover-${Date.now()}-${file.name}`;
    const { error: uploadError } = await client.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) throw new Error("Upload fehlgeschlagen: " + uploadError.message);
    const { data } = client.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl;
  }
  async function setSongCover(songId, coverUrl) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (client) {
      const { error } = await client.from("playlist_songs").update({ cover_url: coverUrl }).eq("id", songId);
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    const song = (demo.playlistSongs || []).find((s) => s.id === songId);
    if (song) song.cover_url = coverUrl;
  }
  // Bei der GEMEINSAMEN Playlist wird nichts mehr wirklich gelöscht — nur versteckt (soft
  // delete), damit mühsam zusammengetragene Musik nie komplett verloren geht und jederzeit
  // wiederhergestellt werden kann. Bei der EIGENEN Playlist bleibt es echtes Löschen, da dort
  // jede Person selbst über ihre eigene, kleinere Auswahl entscheidet.
  async function deletePlaylistSong(id, ownerId = null) {
    // Eigene Playlist: die Person selbst darf löschen. Gemeinsame Playlist: nur Admins.
    if (ownerId === null && !isAdmin()) throw new Error("Nur Administratoren können Songs aus der gemeinsamen Playlist entfernen.");
    if (ownerId !== null && (!demo.user || ownerId !== demo.user.id) && !isAdmin()) throw new Error("Du kannst nur Songs aus deiner eigenen Playlist entfernen.");
    if (ownerId === null) {
      // Gemeinsame Playlist: nur verstecken, nicht zerstören.
      if (client) {
        const { error } = await client.from("playlist_songs").update({ hidden: true }).eq("id", id);
        if (error) throw new Error(friendlyDbError(error.message));
        return;
      }
      const song = (demo.playlistSongs || []).find((s) => s.id === id);
      if (song) song.hidden = true;
      return;
    }
    if (client) {
      const { error } = await client.from("playlist_songs").delete().eq("id", id);
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    demo.playlistSongs = demo.playlistSongs.filter((s) => s.id !== id);
  }
  // Versteckte (nicht gelöschte) Songs aus der gemeinsamen Playlist wieder anzeigen —
  // Papierkorb-Ansicht für Admins.
  async function getHiddenPlaylistSongs() {
    if (!isAdmin()) return [];
    if (client) {
      try {
        const { data, error } = await client.from("playlist_songs").select("*").is("owner_id", null).eq("hidden", true).order("created_at", { ascending: false });
        if (!error && data) return data;
        return [];
      } catch (e) { return []; }
    }
    return (demo.playlistSongs || []).filter((s) => !s.owner_id && s.hidden);
  }
  async function restorePlaylistSong(id) {
    if (!isAdmin()) throw new Error("Nur Administratoren können Songs wiederherstellen.");
    if (client) {
      const { error } = await client.from("playlist_songs").update({ hidden: false }).eq("id", id);
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    const song = (demo.playlistSongs || []).find((s) => s.id === id);
    if (song) song.hidden = false;
  }
  async function toggleFavoriteSong(songId) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (client) {
      const { data: existing } = await client.from("song_favorites").select("id").eq("user_id", demo.user.id).eq("song_id", songId).maybeSingle();
      if (existing) {
        await client.from("song_favorites").delete().eq("id", existing.id);
        return false;
      }
      const { error } = await client.from("song_favorites").insert({ user_id: demo.user.id, song_id: songId });
      if (error) throw new Error(friendlyDbError(error.message));
      return true;
    }
    const idx = demo.songFavorites.findIndex((f) => f.user_id === demo.user.id && f.song_id === songId);
    if (idx >= 0) { demo.songFavorites.splice(idx, 1); return false; }
    demo.songFavorites.push({ user_id: demo.user.id, song_id: songId });
    return true;
  }
  async function getMyFavoriteSongIds() {
    if (!demo.user) return [];
    if (client) {
      try {
        const { data, error } = await client.from("song_favorites").select("song_id").eq("user_id", demo.user.id);
        if (!error && data) return data.map((f) => f.song_id);
      } catch (e) { console.warn("Favoriten konnten nicht geladen werden:", e); }
      return [];
    }
    return demo.songFavorites.filter((f) => f.user_id === demo.user.id).map((f) => f.song_id);
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
        const { data, error } = await client.from("profiles").select("*").in("id", ids);
        if (!error && data) return Object.fromEntries(data.map((p) => [p.id, p]));
        if (error) console.warn("Profil-Namen-Abfrage fehlgeschlagen:", error.message);
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
      trophies: (demo.users[email] && demo.users[email].profile.trophies) || [],
      bio: (demo.users[email] && demo.users[email].profile.bio) || "",
      avatar_emoji: (demo.users[email] && demo.users[email].profile.avatarEmoji) || "",
    }]));
  }

  function isRecentlyActive(lastActive) {
    if (!lastActive) return false;
    return Date.now() - new Date(lastActive).getTime() < 90 * 1000;
  }

  function touchActivity() {
    if (client && demo.user) {
      client.from("profiles").update({ last_active: new Date().toISOString() }).eq("id", demo.user.id)
        .then(() => {}, () => {});
    }
  }

  async function saveBio(bio) {
    if (!demo.profile) return true;
    demo.profile.bio = bio;
    if (client && demo.user) {
      const { data, error } = await client.from("profiles").update({ bio }).eq("id", demo.user.id).select();
      if (error || !data || !data.length) return false;
    }
    return true;
  }

  // Leichtgewichtige, gezielte Aktualisierung EINES Feldes in extra_profile_data — für schnelle
  // Umschalter (Lernprofil-Bewertung, u. ä.), ohne dass man wie bei saveExtendedProfile alle
  // anderen Profilfelder mitschicken muss. WICHTIG: das ist der einzig richtige Ort für solche
  // Einstellungen — localStorage ist geräte-lokal und wird NIE zwischen Handy und Rechner
  // abgeglichen, was genau das Problem war, dass Einstellungen auf einem Gerät gemacht auf einem
  // anderen Gerät nicht ankamen.
  async function updateExtraProfileField(key, value) {
    if (!demo.profile) return { ok: true };
    demo.profile.extraProfileData = demo.profile.extraProfileData || {};
    demo.profile.extraProfileData[key] = value;
    if (client && demo.user) {
      const { error } = await client.from("profiles").update({ extra_profile_data: demo.profile.extraProfileData }).eq("id", demo.user.id);
      if (error) return { ok: false, message: friendlyDbError(error.message) };
    }
    return { ok: true };
  }
  // "Beste Freunde" markieren — nutzt dasselbe flexible extra_profile_data-Feld statt einer
  // eigenen Tabelle, damit dafür kein zusätzliches Nachrüst-SQL nötig ist.
  async function toggleBestFriend(friendId) {
    if (!demo.profile) return { ok: true };
    const current = (demo.profile.extraProfileData && demo.profile.extraProfileData.bestFriendIds) || [];
    const isBest = current.includes(friendId);
    const updated = isBest ? current.filter((id) => id !== friendId) : [...current, friendId];
    return updateExtraProfileField("bestFriendIds", updated);
  }
  function getBestFriendIds() {
    return (demo.profile && demo.profile.extraProfileData && demo.profile.extraProfileData.bestFriendIds) || [];
  }
  // Sympathie-System — vier rein freundschaftliche Stufen (bewusst keine romantischen/intimen
  // Stufen, siehe README für die Begründung), jede mit eigener Herzfarbe. Läuft über eine
  // eigene Tabelle statt extra_profile_data, weil die Angaben PRIVAT bleiben müssen, bis beide
  // Seiten sich gegenseitig markiert haben (ein "Match") — RLS regelt, dass niemand die
  // Angaben der jeweils anderen Person vorab einsehen kann.
  const SYMPATHY_LEVELS = [
    { key: "spielen", label: "Ich spiele gerne mit dir", color: "#8bc9a8" },
    { key: "unterhalten", label: "Ich unterhalte mich gerne mit dir", color: "#5ba8a0" },
    { key: "befreundet", label: "Ich bin gerne mit dir befreundet", color: "#e8825f" },
    { key: "naeher", label: "Ich wäre gerne noch näher befreundet", color: "#d64550" },
  ];
  // Ein paar naheliegende Begriffe, die auf romantischen/sexuellen statt freundschaftlichen
  // Inhalt hindeuten — hält die vom Betreiber selbst hinzugefügten Stufen bewusst in derselben,
  // ursprünglich festgelegten Ausrichtung, auch wenn er sie später erweitert.
  const SYMPATHY_BLOCKED_WORDS = ["fantasie", "traum", "träum", "sexy", "verliebt", "küss", "kuss", "romantisch", "date", "dating", "flirt", "intim", "körper", "heiß", "scharf"];
  function containsBlockedSympathyWording(text) {
    const lower = (text || "").toLowerCase();
    return SYMPATHY_BLOCKED_WORDS.some((w) => lower.includes(w));
  }
  // Eigene, vom Betreiber definierte Stufen — zusätzlich zu den vier eingebauten. Gespeichert über
  // dasselbe flexible site_content-System wie die Design-Banner und Feature-Flags.
  async function getAllSympathyLevels() {
    const custom = (await getSiteContent("custom_sympathy_levels")) || [];
    return [...SYMPATHY_LEVELS, ...custom];
  }
  async function addCustomSympathyLevel(label, color, description) {
    if (!isAdmin()) throw new Error("Nur der Betreiber kann eigene Sympathie-Stufen anlegen.");
    if (containsBlockedSympathyWording(label) || containsBlockedSympathyWording(description)) {
      throw new Error("Diese Stufe bleibt bewusst freundschaftlich statt romantisch/intim ausgerichtet — bitte anders formulieren.");
    }
    const custom = (await getSiteContent("custom_sympathy_levels")) || [];
    const key = "custom_" + Date.now();
    custom.push({ key, label: label.trim(), color, description: (description || "").trim() });
    await setSiteContent("custom_sympathy_levels", custom);
    return key;
  }
  async function removeCustomSympathyLevel(key) {
    if (!isAdmin()) throw new Error("Nur der Betreiber kann eigene Sympathie-Stufen entfernen.");
    const custom = (await getSiteContent("custom_sympathy_levels")) || [];
    await setSiteContent("custom_sympathy_levels", custom.filter((l) => l.key !== key));
  }
  async function setSympathyLevel(toUserId, level) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (toUserId === demo.user.id) throw new Error("Das geht nicht für dich selbst.");
    if (client) {
      const { error } = await client.from("friend_sympathy").upsert(
        { from_user_id: demo.user.id, to_user_id: toUserId, level },
        { onConflict: "from_user_id,to_user_id" }
      );
      if (error) throw new Error(friendlyDbError(error.message));
    } else {
      demo.sympathyEntries = demo.sympathyEntries || [];
      const existing = demo.sympathyEntries.find((e) => e.from_user_id === demo.user.id && e.to_user_id === toUserId);
      if (existing) existing.level = level;
      else demo.sympathyEntries.push({ from_user_id: demo.user.id, to_user_id: toUserId, level });
    }
    await checkSympathyMatch(toUserId);
  }
  // Eine bereits vergebene Sympathie-Angabe komplett zurücknehmen — nicht nur zu einer anderen
  // Stufe wechseln, sondern ganz entfernen (zurück zu "keine Angabe").
  async function removeSympathyLevel(toUserId) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (client) {
      const { error } = await client.from("friend_sympathy").delete().eq("from_user_id", demo.user.id).eq("to_user_id", toUserId);
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    demo.sympathyEntries = (demo.sympathyEntries || []).filter((e) => !(e.from_user_id === demo.user.id && e.to_user_id === toUserId));
  }
  async function getMySympathyFor(otherUserId) {
    if (!demo.user) return null;
    if (client) {
      const { data } = await client.from("friend_sympathy").select("level").eq("from_user_id", demo.user.id).eq("to_user_id", otherUserId).maybeSingle();
      return data ? data.level : null;
    }
    const entry = (demo.sympathyEntries || []).find((e) => e.from_user_id === demo.user.id && e.to_user_id === otherUserId);
    return entry ? entry.level : null;
  }
  // Match = beide Seiten haben sich GEGENSEITIG irgendeine Stufe gegeben — unabhängig davon, ob
  // beide dieselbe Stufe gewählt haben. Beide bekommen dann automatisch eine Nachricht.
  async function checkSympathyMatch(otherUserId) {
    if (!demo.user) return;
    let theirLevelForMe = null;
    if (client) {
      const { data } = await client.from("friend_sympathy").select("level").eq("from_user_id", otherUserId).eq("to_user_id", demo.user.id).maybeSingle();
      theirLevelForMe = data ? data.level : null;
    } else {
      const entry = (demo.sympathyEntries || []).find((e) => e.from_user_id === otherUserId && e.to_user_id === demo.user.id);
      theirLevelForMe = entry ? entry.level : null;
    }
    if (!theirLevelForMe) return; // noch kein Match, die andere Person hat sich noch nicht geäußert
    // Doppel-Benachrichtigung vermeiden: nur beim ERSTEN Erreichen des Matches verschicken.
    const alreadyNotifiedKey = [demo.user.id, otherUserId].sort().join("_");
    if ((demo.profile.extraProfileData?.sympathyMatchesNotified || []).includes(alreadyNotifiedKey)) return;
    const myName = demo.profile.name;
    await sendSystemMessage(otherUserId, `💛 Ihr mögt euch gegenseitig! ${myName} mag dich mittlerweile auch sehr gern.`);
    await sendSystemMessage(demo.user.id, `💛 Ihr mögt euch gegenseitig! Es ist ein Match — ihr mögt euch beide sehr gern.`);
    const notified = [...(demo.profile.extraProfileData?.sympathyMatchesNotified || []), alreadyNotifiedKey];
    await updateExtraProfileField("sympathyMatchesNotified", notified);
  }
  async function saveExtendedProfile({ languages, favMovie, favSeries, favSong, favFood, favDrink, favCountry, favQuote, poem, extra }) {
    if (!demo.profile) return { ok: true };
    demo.profile.languages = languages;
    demo.profile.favMovie = favMovie;
    demo.profile.favSeries = favSeries;
    demo.profile.favSong = favSong;
    demo.profile.favFood = favFood;
    demo.profile.favDrink = favDrink;
    demo.profile.favCountry = favCountry;
    demo.profile.favQuote = favQuote;
    demo.profile.poem = poem;
    // WICHTIG: zusammenführen statt komplett ersetzen — sonst würden Felder, die über den
    // schlankeren updateExtraProfileField-Weg gespeichert wurden (z. B. Lernprofil-Bewertung,
    // Laufband-Einstellungen, "schon gesehene" Meilensteine), beim nächsten Abschicken des
    // normalen Bearbeitungsformulars unabsichtlich wieder gelöscht.
    demo.profile.extraProfileData = { ...(demo.profile.extraProfileData || {}), ...(extra || {}) };
    if (client && demo.user) {
      const { data, error } = await client.from("profiles").update({
        languages, fav_movie: favMovie, fav_series: favSeries, fav_song: favSong, fav_food: favFood,
        fav_drink: favDrink, fav_country: favCountry, fav_quote: favQuote, poem, extra_profile_data: demo.profile.extraProfileData,
      }).eq("id", demo.user.id).select();
      if (error) return { ok: false, message: friendlyDbError(error.message) };
      if (!data || !data.length) return { ok: false, message: "Speichern hat nichts zurückgegeben — evtl. blockiert Row Level Security (RLS) den Schreibzugriff." };
    }
    return { ok: true };
  }

  function addTrophy(label) {
    if (!demo.profile) return false;
    if (demo.profile.trophies.includes(label)) return false;
    demo.profile.trophies.push(label);
    if (client && demo.user) {
      client.from("profiles").update({ trophies: demo.profile.trophies }).eq("id", demo.user.id)
        .then(() => {}, (e) => console.warn("Trophäe konnte nicht gespeichert werden:", e));
    }
    return true;
  }

  async function saveBirthday(birthday) {
    if (!demo.profile) return true;
    demo.profile.birthday = birthday;
    if (client && demo.user) {
      const { data, error } = await client.from("profiles").update({ birthday }).eq("id", demo.user.id).select();
      if (error || !data || !data.length) return false;
    }
    return true;
  }

  // Sichert das GERADE AKTUELLE Profilbild (egal ob Foto oder Emoji), BEVOR es geändert wird —
  // damit man sich, falls man sich nach dem Speichern doch wieder umentscheidet, mit einem Klick
  // zurück zum vorherigen Bild holen kann, statt es komplett zu verlieren. Nur EIN Schritt zurück,
  // keine volle Historie — genau wie gewünscht.
  async function backupCurrentAvatarBeforeChange() {
    if (!demo.profile) return;
    if (!demo.profile.avatarUrl && !demo.profile.avatarEmoji) return; // nichts zu sichern
    await updateExtraProfileField("previousAvatarUrl", demo.profile.avatarUrl || "");
    await updateExtraProfileField("previousAvatarEmoji", demo.profile.avatarEmoji || "");
  }
  async function restorePreviousAvatar() {
    if (!demo.profile) return false;
    const extra = demo.profile.extraProfileData || {};
    const prevUrl = extra.previousAvatarUrl || "";
    const prevEmoji = extra.previousAvatarEmoji || "";
    if (!prevUrl && !prevEmoji) return false;
    // Das aktuelle Bild wird selbst zum neuen "vorherigen" — so kann man auch mehrfach
    // hin- und herwechseln, ohne dass etwas verloren geht.
    const currentUrl = demo.profile.avatarUrl || "";
    const currentEmoji = demo.profile.avatarEmoji || "";
    demo.profile.avatarUrl = prevUrl;
    demo.profile.avatarEmoji = prevEmoji;
    if (client && demo.user) {
      await client.from("profiles").update({ avatar_url: prevUrl, avatar_emoji: prevEmoji || null }).eq("id", demo.user.id);
    }
    await updateExtraProfileField("previousAvatarUrl", currentUrl);
    await updateExtraProfileField("previousAvatarEmoji", currentEmoji);
    return true;
  }
  async function uploadAvatar(file) {
    if (!client || !demo.user) throw new Error("Fotos hochladen geht nur mit verbundenem Supabase.");
    await backupCurrentAvatarBeforeChange();
    const path = `${demo.user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await client.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) {
      if (uploadError.message && uploadError.message.toLowerCase().includes("bucket not found")) {
        throw new Error("Der Speicherort für Fotos fehlt noch — in Supabase unter Storage einen Bucket namens „avatars“ (öffentlich) anlegen (siehe README, Abschnitt 4b). Bis dahin kannst du unten ein Emoji als Profilbild wählen.");
      }
      throw new Error("Upload fehlgeschlagen: " + uploadError.message);
    }
    const { data } = client.storage.from("avatars").getPublicUrl(path);
    const url = data.publicUrl;
    await client.from("profiles").update({ avatar_url: url, avatar_emoji: null }).eq("id", demo.user.id);
    demo.profile.avatarUrl = url;
    demo.profile.avatarEmoji = "";
    return url;
  }

  // Ein bereits in der Galerie hochgeladenes Foto direkt als Profilbild übernehmen — ohne
  // erneuten Upload, einfach die schon vorhandene Bild-Adresse speichern.
  async function saveAvatarFromGallery(url) {
    if (!demo.profile) return false;
    await backupCurrentAvatarBeforeChange();
    demo.profile.avatarUrl = url;
    demo.profile.avatarEmoji = "";
    if (client && demo.user) {
      const { error } = await client.from("profiles").update({ avatar_url: url, avatar_emoji: null }).eq("id", demo.user.id);
      if (error) return false;
    }
    return true;
  }

  async function saveAvatarEmoji(emoji) {
    if (!demo.profile) return;
    await backupCurrentAvatarBeforeChange();
    demo.profile.avatarEmoji = emoji;
    demo.profile.avatarUrl = "";
    if (client && demo.user) {
      client.from("profiles").update({ avatar_emoji: emoji, avatar_url: "" }).eq("id", demo.user.id)
        .then(() => {}, (e) => console.warn("Emoji-Avatar konnte nicht gespeichert werden:", e));
    }
  }

  const GALLERY_MAX = 6;

  async function uploadGalleryPhoto(file) {
    if (!client || !demo.user) throw new Error("Fotos hochladen geht nur mit verbundenem Supabase.");
    if (!demo.profile.gallery) demo.profile.gallery = [];
    if (demo.profile.gallery.length >= GALLERY_MAX) throw new Error(`Maximal ${GALLERY_MAX} Fotos in der Galerie.`);
    const path = `${demo.user.id}/gallery-${Date.now()}-${file.name}`;
    const { error: uploadError } = await client.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) {
      if (uploadError.message && uploadError.message.toLowerCase().includes("bucket not found")) {
        throw new Error("Der Speicherort für Fotos fehlt noch (siehe README, Abschnitt 4b).");
      }
      throw new Error("Upload fehlgeschlagen: " + uploadError.message);
    }
    const { data } = client.storage.from("avatars").getPublicUrl(path);
    demo.profile.gallery.push(data.publicUrl);
    const { error: dbError } = await client.from("profiles").update({ gallery: demo.profile.gallery }).eq("id", demo.user.id);
    if (dbError) {
      demo.profile.gallery.pop(); // Upload hat geklappt, aber Speichern in der Datenbank nicht -> zurückrollen
      throw new Error("Foto konnte nicht dauerhaft gespeichert werden — vermutlich fehlt die Spalte „gallery“ in der profiles-Tabelle (siehe README, Abschnitt Supabase einrichten).");
    }
    return demo.profile.gallery;
  }

  function removeGalleryPhoto(url) {
    if (!demo.profile || !demo.profile.gallery) return;
    demo.profile.gallery = demo.profile.gallery.filter((u) => u !== url);
    if (client && demo.user) {
      client.from("profiles").update({ gallery: demo.profile.gallery }).eq("id", demo.user.id)
        .then(() => {}, (e) => console.warn("Galerie konnte nicht aktualisiert werden:", e));
    }
  }

  async function saveHobbies(hobbies) {
    if (!demo.profile) return true;
    demo.profile.hobbies = hobbies;
    if (client && demo.user) {
      const { data, error } = await client.from("profiles").update({ hobbies }).eq("id", demo.user.id).select();
      if (error || !data || !data.length) return false;
    }
    return true;
  }

  async function saveOrigin(origin) {
    if (!demo.profile) return true;
    demo.profile.origin = origin;
    if (client && demo.user) {
      const { data, error } = await client.from("profiles").update({ origin }).eq("id", demo.user.id).select();
      if (error || !data || !data.length) return false;
    }
    return true;
  }

  async function getRecentMembers() {
    if (client) {
      try {
        const { data, error } = await client.from("profiles").select("id,name,avatar_url,avatar_emoji,created_at").order("created_at", { ascending: false }).limit(5);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Neue Mitglieder konnten nicht geladen werden:", e);
      }
      return [];
    }
    return Object.entries(demo.users).slice(-5).reverse().map(([email, u]) => ({
      id: email, name: u.profile.name, avatar_url: u.profile.avatarUrl, avatar_emoji: u.profile.avatarEmoji, created_at: new Date().toISOString(),
    }));
  }

  async function getPublicProfile(id) {
    if (client) {
      try {
        const { data, error } = await client.from("profiles").select("*").eq("id", id).maybeSingle();
        if (!error && data) {
          return {
            id: data.id, name: data.name, bio: data.bio, avatar_url: data.avatar_url, avatar_emoji: data.avatar_emoji,
            badges: data.badges, trophies: data.trophies, points: data.points, origin: data.origin, hobbies: data.hobbies,
            is_admin: Boolean(data.is_admin), is_owner: Boolean(data.is_owner), is_moderator: Boolean(data.is_moderator), gallery: data.gallery || [],
            is_beta_tester: Boolean(data.is_beta_tester), is_contributor: Boolean(data.is_contributor), is_supporter: Boolean(data.is_supporter),
            last_active: data.last_active, online: isRecentlyActive(data.last_active),
            languages: data.languages || [], fav_movie: data.fav_movie || "", fav_series: data.fav_series || "",
            fav_song: data.fav_song || "", fav_food: data.fav_food || "", poem: data.poem || "",
            fav_drink: data.fav_drink || "", fav_country: data.fav_country || "", fav_quote: data.fav_quote || "",
            extra_profile_data: data.extra_profile_data || {}, theme: data.theme || "", birthday: data.birthday || "",
          };
        }
        if (error) console.warn("Profil-Abfrage fehlgeschlagen:", error.message);
      } catch (e) {
        console.warn("Profil konnte nicht geladen werden:", e);
      }
      return null;
    }
    const u = demo.users[id];
    if (!u) return null;
    return {
      id, name: u.profile.name, bio: u.profile.bio, avatar_url: u.profile.avatarUrl, avatar_emoji: u.profile.avatarEmoji,
      badges: u.profile.badges, trophies: u.profile.trophies, points: u.profile.points,
      origin: u.profile.origin, hobbies: u.profile.hobbies, is_admin: u.profile.isAdmin, is_owner: u.profile.isOwner,
      is_moderator: u.profile.isModerator, gallery: u.profile.gallery, last_active: u.profile.lastActive || null, online: false,
      is_beta_tester: u.profile.isBetaTester, is_contributor: u.profile.isContributor, is_supporter: u.profile.isSupporter,
      languages: u.profile.languages || [], fav_movie: u.profile.favMovie || "", fav_series: u.profile.favSeries || "",
      fav_song: u.profile.favSong || "", fav_food: u.profile.favFood || "", poem: u.profile.poem || "",
      fav_drink: u.profile.favDrink || "", fav_country: u.profile.favCountry || "", fav_quote: u.profile.favQuote || "",
      extra_profile_data: u.profile.extraProfileData || {}, theme: u.profile.theme || "", birthday: u.profile.birthday || "",
    };
  }

  async function getIncomingRequests() {
    if (!demo.user) return [];
    if (client) {
      // Bewusst einfach gehalten (alle eigenen Freundschafts-Zeilen holen, dann in JS filtern) —
      // vermeidet Sonderfälle beim Verketten mehrerer Filter direkt in der Datenbankabfrage.
      const { data, error } = await client.from("friends").select("*").or(`user_a.eq.${myId()},user_b.eq.${myId()}`);
      if (error) { console.warn("Freundschaftsanfragen konnten nicht geladen werden:", error.message); return []; }
      if (!data) return [];
      const pending = data.filter((f) => f.status === "pending" && f.requested_by !== myId());
      const names = await namesFor(pending.map((f) => f.requested_by));
      return pending.map((f) => ({ id: f.id, id_other: f.requested_by, name: (names[f.requested_by] && names[f.requested_by].name) || f.requested_by }));
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
  // Fehlte bisher komplett: eine Anfrage, die man nicht annehmen möchte, blieb für immer als
  // "pending" stehen und konnte bei jedem Neuladen der Seite erneut eine Benachrichtigung auslösen.
  async function declineFriendRequest(id) {
    if (client) {
      await client.from("friends").delete().eq("id", id);
      return;
    }
    demo.friends = demo.friends.filter((x) => x.id !== id);
  }

  async function getFriends(forId) {
    const targetId = forId || myId();
    if (!targetId) return [];
    if (client) {
      const { data, error } = await client.from("friends").select("*")
        .eq("status", "accepted").or(`user_a.eq.${targetId},user_b.eq.${targetId}`);
      if (error || !data) return [];
      const otherIds = data.map((f) => (f.user_a === targetId ? f.user_b : f.user_a));
      const names = await namesFor(otherIds);
      return otherIds.map((id) => ({
        id,
        name: (names[id] && names[id].name) || id,
        points: (names[id] && names[id].points) || 0,
        badges: (names[id] && names[id].badges) || [],
        trophies: (names[id] && names[id].trophies) || [],
        bio: (names[id] && names[id].bio) || "",
        avatar_url: (names[id] && names[id].avatar_url) || "",
        avatar_emoji: (names[id] && names[id].avatar_emoji) || "",
        is_admin: Boolean(names[id] && names[id].is_admin),
        is_owner: Boolean(names[id] && names[id].is_owner),
        is_moderator: Boolean(names[id] && names[id].is_moderator),
        online: names[id] ? isRecentlyActive(names[id].last_active) : false,
        last_active: names[id] ? names[id].last_active : null,
        birthday: (names[id] && names[id].birthday) || "",
      }));
    }
    return demo.friends
      .filter((f) => f.status === "accepted" && (f.a === targetId || f.b === targetId))
      .map((f) => {
        const otherEmail = f.a === targetId ? f.b : f.a;
        const u = demo.users[otherEmail];
        return {
          id: otherEmail,
          name: (u && u.profile.name) || otherEmail,
          points: (u && u.profile.points) || 0,
          badges: (u && u.profile.badges) || [],
          trophies: (u && u.profile.trophies) || [],
          bio: (u && u.profile.bio) || "",
          avatar_url: (u && u.profile.avatarUrl) || "",
          avatar_emoji: (u && u.profile.avatarEmoji) || "",
          birthday: (u && u.profile.birthday) || "",
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

  async function cancelChallenge(challengeId) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (client) {
      const { error } = await client.from("challenges").delete().eq("id", challengeId).eq("from_user", myId()).eq("status", "pending");
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    demo.challenges = demo.challenges.filter((c) => !(c.id === challengeId && c.from === demo.user.email && c.status === "pending"));
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

  /* ================= COMMUNITY-TEXTE (User-Uploads, warten auf Freischaltung) ================= */
  demo.communityTexts = demo.communityTexts || [];
  demo.userLinks = demo.userLinks || [];
  demo.communityTips = demo.communityTips || [];
  // "Von Lernenden für Lernende" — freie Tipp-Beiträge (Text + optionaler Link + optionales
  // Bild), z. B. "Diese Serie hat mir geholfen" oder "Diese Übungsmethode hat bei mir
  // funktioniert". Dasselbe Freigabe-Muster wie bei Texten/Links.
  async function submitCommunityTip({ text, link, imageUrl }) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (!text) throw new Error("Bitte einen Tipp-Text schreiben.");
    if (client) {
      const { error } = await client.from("community_tips").insert({
        user_id: demo.user.id, author_name: demo.profile.name, text, link: link || "", image_url: imageUrl || "", status: "pending",
      });
      if (error) throw new Error(friendlyDbError(error.message));
      addActivity(`${demo.profile.name} hat einen Schwarmwissen-Tipp geteilt. 💡`);
      return;
    }
    demo.communityTips.push({ id: Core.uid(), user_id: demo.user.id, author_name: demo.profile.name, text, link: link || "", image_url: imageUrl || "", status: "pending", created_at: new Date().toISOString() });
    addActivity(`${demo.profile.name} hat einen Schwarmwissen-Tipp geteilt. 💡`);
  }
  async function getApprovedCommunityTips() {
    if (client) {
      try {
        const { data, error } = await client.from("community_tips").select("*").eq("status", "approved").order("created_at", { ascending: false }).limit(50);
        if (!error && data) return data;
      } catch (e) { console.warn("Tipps konnten nicht geladen werden:", e); }
      return [];
    }
    return demo.communityTips.filter((t) => t.status === "approved").sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  async function getMyCommunityTips() {
    if (!demo.user) return [];
    if (client) {
      try {
        const { data, error } = await client.from("community_tips").select("*").eq("user_id", demo.user.id).order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) { console.warn("Eigene Tipps konnten nicht geladen werden:", e); }
      return [];
    }
    return demo.communityTips.filter((t) => t.user_id === demo.user.id);
  }
  async function getPendingCommunityTips() {
    if (!canModerate()) return [];
    if (client) {
      try {
        const { data, error } = await client.from("community_tips").select("*").eq("status", "pending").order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) { console.warn("Ausstehende Tipps konnten nicht geladen werden:", e); }
      return [];
    }
    return demo.communityTips.filter((t) => t.status === "pending");
  }
  async function approveCommunityTip(id) {
    if (!canModerate()) throw new Error("Keine Moderationsrechte.");
    if (client) {
      const { data: row } = await client.from("community_tips").select("user_id,text").eq("id", id).maybeSingle();
      const { error } = await client.from("community_tips").update({ status: "approved" }).eq("id", id);
      if (error) throw new Error("Konnte nicht freigeschaltet werden: " + error.message);
      if (row && row.user_id) await addNotification(row.user_id, `💡 Dein Tipp wurde freigeschaltet und ist jetzt für alle sichtbar!`);
      return;
    }
    const t = demo.communityTips.find((x) => x.id === id);
    if (t) {
      t.status = "approved";
      if (t.user_id) await addNotification(t.user_id, `💡 Dein Tipp wurde freigeschaltet und ist jetzt für alle sichtbar!`);
    }
  }
  async function rejectCommunityTip(id) {
    if (!canModerate()) throw new Error("Keine Moderationsrechte.");
    if (client) {
      const { error } = await client.from("community_tips").delete().eq("id", id);
      if (error) throw new Error("Konnte nicht abgelehnt werden: " + error.message);
      return;
    }
    demo.communityTips = demo.communityTips.filter((x) => x.id !== id);
  }
  async function deleteMyCommunityTip(id) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (client) {
      const { error } = await client.from("community_tips").delete().eq("id", id).eq("user_id", demo.user.id);
      if (error) throw new Error("Konnte nicht gelöscht werden: " + error.message);
      return;
    }
    demo.communityTips = demo.communityTips.filter((x) => !(x.id === id && x.user_id === demo.user.id));
  }
  // Von Nutzer:innen vorgeschlagene Links für "Weiterführende Links" — landet erst als Vorschlag,
  // wird von Alex geprüft/freigeschaltet, danach bekommt die einreichende Person eine
  // Benachrichtigung. Dasselbe Muster wie bei den eigenen Text-Beiträgen.
  async function submitLink({ title, url, desc }) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (!title || !url) throw new Error("Bitte Titel und Adresse angeben.");
    if (client) {
      const { error } = await client.from("user_links").insert({
        user_id: demo.user.id, author_name: demo.profile.name, title, url, desc: desc || "", status: "pending",
      });
      if (error) throw new Error(friendlyDbError(error.message));
      addActivity(`${demo.profile.name} hat einen Link vorgeschlagen: „${title}". 🔗`);
      return;
    }
    demo.userLinks.push({ id: Core.uid(), user_id: demo.user.id, author_name: demo.profile.name, title, url, desc: desc || "", status: "pending", created_at: new Date().toISOString() });
    addActivity(`${demo.profile.name} hat einen Link vorgeschlagen: „${title}". 🔗`);
  }
  async function getApprovedUserLinks() {
    if (client) {
      try {
        const { data, error } = await client.from("user_links").select("*").eq("status", "approved").order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) { console.warn("Nutzer-Links konnten nicht geladen werden:", e); }
      return [];
    }
    return demo.userLinks.filter((l) => l.status === "approved");
  }
  async function getMyUserLinks() {
    if (!demo.user) return [];
    if (client) {
      try {
        const { data, error } = await client.from("user_links").select("*").eq("user_id", demo.user.id).order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) { console.warn("Eigene Links konnten nicht geladen werden:", e); }
      return [];
    }
    return demo.userLinks.filter((l) => l.user_id === demo.user.id);
  }
  async function getPendingUserLinks() {
    if (!canModerate()) return [];
    if (client) {
      try {
        const { data, error } = await client.from("user_links").select("*").eq("status", "pending").order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) { console.warn("Ausstehende Links konnten nicht geladen werden:", e); }
      return [];
    }
    return demo.userLinks.filter((l) => l.status === "pending");
  }
  async function approveUserLink(id) {
    if (!canModerate()) throw new Error("Keine Moderationsrechte.");
    if (client) {
      const { data: linkRow } = await client.from("user_links").select("user_id,title").eq("id", id).maybeSingle();
      const { error } = await client.from("user_links").update({ status: "approved" }).eq("id", id);
      if (error) throw new Error("Konnte nicht freigeschaltet werden: " + error.message);
      if (linkRow && linkRow.user_id) {
        await addNotification(linkRow.user_id, `🔗 Dein vorgeschlagener Link „${linkRow.title || ""}" wurde freigeschaltet!`);
      }
      return;
    }
    const l = demo.userLinks.find((x) => x.id === id);
    if (l) {
      l.status = "approved";
      if (l.user_id) await addNotification(l.user_id, `🔗 Dein vorgeschlagener Link „${l.title || ""}" wurde freigeschaltet!`);
    }
  }
  async function rejectUserLink(id) {
    if (!canModerate()) throw new Error("Keine Moderationsrechte.");
    if (client) {
      const { error } = await client.from("user_links").delete().eq("id", id);
      if (error) throw new Error("Konnte nicht abgelehnt werden: " + error.message);
      return;
    }
    demo.userLinks = demo.userLinks.filter((x) => x.id !== id);
  }


  async function uploadCommunityTextCover(file) {
    if (!client || !demo.user) throw new Error("Fotos hochladen geht nur mit verbundenem Supabase.");
    const path = `${demo.user.id}/cover-${Date.now()}-${file.name}`;
    const { error: uploadError } = await client.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) {
      if (uploadError.message && uploadError.message.toLowerCase().includes("bucket not found")) {
        throw new Error("Der Speicherort für Fotos fehlt noch (siehe README, Abschnitt 4b).");
      }
      throw new Error("Upload fehlgeschlagen: " + uploadError.message);
    }
    const { data } = client.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl;
  }

  async function submitCommunityText({ title, level, body, coverUrl }) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (client) {
      const { error } = await client.from("community_texts").insert({
        user_id: demo.user.id, author_name: demo.profile.name, title, level, body, status: "pending", cover_url: coverUrl || null,
      });
      if (error) throw new Error(friendlyDbError(error.message));
      addActivity(`${demo.profile.name} hat einen eigenen Beitrag eingereicht: „${title}". ✍️`);
      return;
    }
    demo.communityTexts.push({ id: Core.uid(), user_id: demo.user.id, author_name: demo.profile.name, title, level, body, cover_url: coverUrl || null, status: "pending", created_at: new Date().toISOString() });
    addActivity(`${demo.profile.name} hat einen eigenen Beitrag eingereicht: „${title}". ✍️`);
  }
  // Nachträgliches Bearbeiten des eigenen Beitrags — Titelbild ändern/ergänzen und/oder eine
  // weitere Sprachniveau-Fassung zur bestehenden Geschichte hinzufügen (ohne dass man vorher
  // alle 6 Niveaus auf einmal schreiben muss).
  async function updateCommunityText(id, { coverUrl, level, body } = {}) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    const updates = {};
    if (coverUrl !== undefined) updates.cover_url = coverUrl || null;
    if (level !== undefined) updates.level = level;
    if (body !== undefined) updates.body = body;
    if (client) {
      const { error } = await client.from("community_texts").update(updates).eq("id", id).eq("user_id", demo.user.id);
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    const t = demo.communityTexts.find((x) => x.id === id && x.user_id === demo.user.id);
    if (!t) throw new Error("Beitrag nicht gefunden oder nicht deiner.");
    Object.assign(t, updates.cover_url !== undefined ? { cover_url: updates.cover_url } : {}, updates.level !== undefined ? { level: updates.level } : {}, updates.body !== undefined ? { body: updates.body } : {});
  }
  // Verwandelt JEDE Speicherform (einzelnes Niveau als Klartext, "alle" mit allen 6 als JSON,
  // oder "multi" mit einer beliebigen Teilmenge als JSON) einheitlich in ein { NIVEAU: Text }
  // Objekt — so kann man mit demselben Code arbeiten, egal wie der Beitrag ursprünglich
  // gespeichert wurde.
  function communityTextLevels(t) {
    if (t.level === "alle" || t.level === "multi") {
      try { return JSON.parse(t.body); } catch (e) { return {}; }
    }
    return { [t.level]: t.body };
  }

  async function getApprovedCommunityTexts() {
    if (client) {
      try {
        const { data, error } = await client.from("community_texts").select("*").eq("status", "approved").order("created_at", { ascending: false }).limit(20);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Community-Texte konnten nicht geladen werden:", e);
      }
      return [];
    }
    return demo.communityTexts.filter((t) => t.status === "approved");
  }

  /* ================= LIKES & KOMMENTARE bei Community-Texten ================= */
  demo.textLikes = demo.textLikes || []; // { id, text_id, user_id }
  demo.textComments = demo.textComments || []; // { id, text_id, user_id, author_name, body, created_at }

  async function getLikesForText(textId) {
    if (client) {
      try {
        const { data, error } = await client.from("community_text_likes").select("user_id").eq("text_id", textId);
        if (!error && data) return data.map((r) => r.user_id);
      } catch (e) { console.warn("Likes konnten nicht geladen werden:", e); }
      return [];
    }
    return demo.textLikes.filter((l) => l.text_id === textId).map((l) => l.user_id);
  }

  async function toggleLikeText(textId, authorId, textTitle) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    const likedBy = await getLikesForText(textId);
    const alreadyLiked = likedBy.includes(demo.user.id);
    if (client) {
      if (alreadyLiked) {
        const { error } = await client.from("community_text_likes").delete().eq("text_id", textId).eq("user_id", demo.user.id);
        if (error) throw new Error(friendlyDbError(error.message));
      } else {
        const { error } = await client.from("community_text_likes").insert({ text_id: textId, user_id: demo.user.id });
        if (error) throw new Error(friendlyDbError(error.message));
        // Der Autor/die Autorin bekommt für jeden erhaltenen Like 2 Bonuspunkte
        if (authorId && authorId !== demo.user.id) {
          const { data: authorProfile } = await client.from("profiles").select("points").eq("id", authorId).maybeSingle();
          if (authorProfile) {
            await client.from("profiles").update({ points: (authorProfile.points || 0) + 2 }).eq("id", authorId);
          }
          await addNotification(authorId, `❤️ ${demo.profile.name} hat deinen Beitrag „${textTitle || ""}" geliked!`, { view: "community", textId });
        }
      }
      return !alreadyLiked;
    }
    if (alreadyLiked) {
      demo.textLikes = demo.textLikes.filter((l) => !(l.text_id === textId && l.user_id === demo.user.id));
    } else {
      demo.textLikes.push({ id: Core.uid(), text_id: textId, user_id: demo.user.id });
      if (authorId && authorId !== demo.user.id && demo.users[authorId]) {
        demo.users[authorId].profile.points += 2;
        await addNotification(authorId, `❤️ ${demo.profile.name} hat deinen Beitrag „${textTitle || ""}" geliked!`, { view: "community", textId });
      }
    }
    return !alreadyLiked;
  }

  async function getCommentsForText(textId) {
    if (client) {
      try {
        const { data, error } = await client.from("community_text_comments").select("*").eq("text_id", textId).order("created_at", { ascending: true });
        if (!error && data) return data;
      } catch (e) { console.warn("Kommentare konnten nicht geladen werden:", e); }
      return [];
    }
    return demo.textComments.filter((c) => c.text_id === textId);
  }

  async function addComment(textId, body, authorId, textTitle) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (!body.trim()) throw new Error("Kommentar darf nicht leer sein.");
    if (client) {
      const { error } = await client.from("community_text_comments").insert({
        text_id: textId, user_id: demo.user.id, author_name: demo.profile.name, body: body.trim(),
      });
      if (error) throw new Error(friendlyDbError(error.message));
      if (authorId && authorId !== demo.user.id) {
        const { data: authorProfile } = await client.from("profiles").select("points").eq("id", authorId).maybeSingle();
        if (authorProfile) {
          await client.from("profiles").update({ points: (authorProfile.points || 0) + 1 }).eq("id", authorId);
        }
        await addNotification(authorId, `💬 ${demo.profile.name} hat deinen Beitrag „${textTitle || ""}" kommentiert.`, { view: "community", textId });
      }
      return;
    }
    demo.textComments.push({ id: Core.uid(), text_id: textId, user_id: demo.user.id, author_name: demo.profile.name, body: body.trim(), created_at: new Date().toISOString() });
    if (authorId && authorId !== demo.user.id) {
      if (demo.users[authorId]) demo.users[authorId].profile.points += 1;
      await addNotification(authorId, `💬 ${demo.profile.name} hat deinen Beitrag „${textTitle || ""}" kommentiert.`, { view: "community", textId });
    }
  }

  async function deleteComment(commentId) {
    const isMineOrAdmin = isAdmin();
    if (client) {
      let query = client.from("community_text_comments").delete().eq("id", commentId);
      if (!isMineOrAdmin) query = query.eq("user_id", demo.user ? demo.user.id : "");
      const { error } = await query;
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    demo.textComments = demo.textComments.filter((c) => !(c.id === commentId && (isMineOrAdmin || c.user_id === (demo.user && demo.user.id))));
  }

  async function getMyCommunityTexts() {
    if (!demo.user) return [];
    if (client) {
      try {
        const { data, error } = await client.from("community_texts").select("*").eq("user_id", demo.user.id).order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Eigene Community-Texte konnten nicht geladen werden:", e);
      }
      return [];
    }
    return demo.communityTexts.filter((t) => t.author_name === demo.profile.name);
  }

  /* ================= VERWALTUNG (nur für Admin-Konten sichtbar) ================= */
  function isAdmin() {
    return Boolean(demo.profile && (demo.profile.isAdmin || demo.profile.isOwner));
  }
  function isOwner() {
    return Boolean(demo.profile && demo.profile.isOwner);
  }

  async function getPendingCommunityTexts() {
    if (!canModerate()) return [];
    if (client) {
      try {
        const { data, error } = await client.from("community_texts").select("*").eq("status", "pending").order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Ausstehende Texte konnten nicht geladen werden:", e);
      }
      return [];
    }
    return demo.communityTexts.filter((t) => t.status === "pending");
  }

  async function approveCommunityText(id) {
    if (!canModerate()) throw new Error("Keine Moderationsrechte.");
    if (client) {
      const { data: textRow } = await client.from("community_texts").select("user_id,title").eq("id", id).maybeSingle();
      const { error } = await client.from("community_texts").update({ status: "approved" }).eq("id", id);
      if (error) throw new Error("Konnte nicht freigeschaltet werden: " + error.message);
      if (textRow && textRow.user_id) {
        await addNotification(textRow.user_id, `🎉 Dein Beitrag „${textRow.title || ""}" wurde freigeschaltet!`);
      }
      return;
    }
    const t = demo.communityTexts.find((x) => x.id === id);
    if (t) {
      t.status = "approved";
      if (t.user_id) await addNotification(t.user_id, `🎉 Dein Beitrag „${t.title || ""}" wurde freigeschaltet!`);
    }
  }

  async function rejectCommunityText(id) {
    if (!canModerate()) throw new Error("Keine Moderationsrechte.");
    if (client) {
      const { error } = await client.from("community_texts").delete().eq("id", id);
      if (error) throw new Error("Konnte nicht abgelehnt werden: " + error.message);
      return;
    }
    demo.communityTexts = demo.communityTexts.filter((x) => x.id !== id);
  }

  async function deleteMyCommunityText(id) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    if (client) {
      const { error } = await client.from("community_texts").delete().eq("id", id).eq("user_id", demo.user.id);
      if (error) throw new Error("Konnte nicht gelöscht werden: " + error.message);
      return;
    }
    demo.communityTexts = demo.communityTexts.filter((x) => !(x.id === id && x.user_id === demo.user.id));
  }

  /* ---- Weitere Moderations-Werkzeuge (Moderator, Admin, Betreiber) ---- */
  async function adminDeleteCommunityText(id) {
    if (!canModerate()) throw new Error("Keine Moderationsrechte.");
    if (client) {
      const { error } = await client.from("community_texts").delete().eq("id", id);
      if (error) throw new Error("Konnte nicht gelöscht werden: " + error.message);
      return;
    }
    demo.communityTexts = demo.communityTexts.filter((x) => x.id !== id);
  }

  async function adminDeleteGalleryPhoto(targetUserId, url) {
    if (!canModerate()) throw new Error("Keine Moderationsrechte.");
    if (client) {
      const { data, error: selErr } = await client.from("profiles").select("gallery").eq("id", targetUserId).maybeSingle();
      if (selErr) throw new Error("Konnte nicht geladen werden: " + selErr.message);
      const newGallery = (data?.gallery || []).filter((u) => u !== url);
      const { error } = await client.from("profiles").update({ gallery: newGallery }).eq("id", targetUserId);
      if (error) throw new Error("Konnte nicht gelöscht werden: " + error.message);
      return;
    }
    const u = demo.users[targetUserId];
    if (u) u.profile.gallery = (u.profile.gallery || []).filter((x) => x !== url);
  }

  async function adminDeleteAvatar(targetUserId) {
    if (!canModerate()) throw new Error("Keine Moderationsrechte.");
    if (client) {
      const { error } = await client.from("profiles").update({ avatar_url: "", avatar_emoji: "" }).eq("id", targetUserId);
      if (error) throw new Error("Konnte nicht entfernt werden: " + error.message);
      return;
    }
    const u = demo.users[targetUserId];
    if (u) { u.profile.avatarUrl = ""; u.profile.avatarEmoji = ""; }
  }

  async function adminDeleteGuestbookEntry(entryId) {
    if (!canModerate()) throw new Error("Keine Moderationsrechte.");
    if (client) {
      const { error } = await client.from("guestbook").delete().eq("id", entryId);
      if (error) throw new Error("Konnte nicht gelöscht werden: " + error.message);
      return;
    }
    demo.guestbook = demo.guestbook.filter((x) => x.id !== entryId);
  }

  async function adminDeleteAccount(targetUserId) {
    if (!isOwner()) throw new Error("Nur der Seitenbetreiber kann Konten löschen.");
    if (client) {
      // Hinweis: Löscht das Profil und zugehörige Inhalte. Der Auth-Nutzer selbst
      // kann ohne Service-Role-Key nicht aus der App heraus gelöscht werden —
      // dafür bitte zusätzlich Supabase -> Authentication -> Users -> Löschen nutzen.
      const { error } = await client.from("profiles").delete().eq("id", targetUserId);
      if (error) throw new Error("Konnte nicht gelöscht werden: " + error.message);
      return;
    }
    delete demo.users[targetUserId];
  }

  async function adminGiftCategoryUnlock(targetUserId, categoryId, categoryTitle) {
    if (!isAdmin()) throw new Error("Nur Administratoren oder der Betreiber können Kategorien verschenken.");
    if (client) {
      const { data, error: selErr } = await client.from("profiles").select("gifted_categories").eq("id", targetUserId).maybeSingle();
      if (selErr) throw new Error(friendlyDbError(selErr.message));
      const current = data?.gifted_categories || [];
      if (current.includes(categoryId)) return;
      const { error } = await client.from("profiles").update({ gifted_categories: [...current, categoryId] }).eq("id", targetUserId);
      if (error) throw new Error(friendlyDbError(error.message));
      await addNotification(targetUserId, `🎁 Du hast die Kategorie „${categoryTitle || categoryId}" geschenkt bekommen — sie ist jetzt freigeschaltet!`);
      return;
    }
    const u = demo.users[targetUserId];
    if (u) {
      u.profile.giftedCategories = u.profile.giftedCategories || [];
      if (!u.profile.giftedCategories.includes(categoryId)) {
        u.profile.giftedCategories.push(categoryId);
        await addNotification(targetUserId, `🎁 Du hast die Kategorie „${categoryTitle || categoryId}" geschenkt bekommen — sie ist jetzt freigeschaltet!`);
      }
    }
  }

  async function adminGiftThemeUnlock(targetUserId, themeId, themeTitle) {
    if (!isAdmin()) throw new Error("Nur Administratoren oder der Betreiber können Designs verschenken.");
    if (client) {
      const { data, error: selErr } = await client.from("profiles").select("gifted_themes").eq("id", targetUserId).maybeSingle();
      if (selErr) throw new Error(friendlyDbError(selErr.message));
      const current = data?.gifted_themes || [];
      if (current.includes(themeId)) return;
      const { error } = await client.from("profiles").update({ gifted_themes: [...current, themeId] }).eq("id", targetUserId);
      if (error) throw new Error(friendlyDbError(error.message));
      await addNotification(targetUserId, `🎁 Du hast das Design „${themeTitle || themeId}" geschenkt bekommen — es ist jetzt freigeschaltet!`);
      return;
    }
    const u = demo.users[targetUserId];
    if (u) {
      u.profile.giftedThemes = u.profile.giftedThemes || [];
      if (!u.profile.giftedThemes.includes(themeId)) {
        u.profile.giftedThemes.push(themeId);
        await addNotification(targetUserId, `🎁 Du hast das Design „${themeTitle || themeId}" geschenkt bekommen — es ist jetzt freigeschaltet!`);
      }
    }
  }

  async function setAdminStatus(targetUserId, value) {
    if (!isOwner()) throw new Error("Nur der Seitenbetreiber kann Administrator-Rechte vergeben.");
    if (client) {
      const { error } = await client.from("profiles").update({ is_admin: value }).eq("id", targetUserId);
      if (error) throw new Error(friendlyDbError(error.message));
      const names = await namesFor([targetUserId]);
      const targetName = (names[targetUserId] && names[targetUserId].name) || "jemand";
      await addActivity(value ? `${targetName} wurde von ${demo.profile.name} zum Administrator ernannt. 🛡️` : `${targetName} ist nicht mehr Administrator. 🛡️`);
      return;
    }
    const u = demo.users[targetUserId];
    if (u) {
      u.profile.isAdmin = value;
      await addActivity(value ? `${u.profile.name} wurde von ${demo.profile.name} zum Administrator ernannt. 🛡️` : `${u.profile.name} ist nicht mehr Administrator. 🛡️`);
    }
  }

  function isModerator() {
    return Boolean(demo.profile && demo.profile.isModerator);
  }
  // Inhalte moderieren (Texte freischalten, Kommentare/Gästebuch löschen) dürfen
  // Moderatoren, Admins und der Betreiber gleichermaßen.
  function canModerate() {
    return isOwner() || isAdmin() || isModerator();
  }
  // Vollständige Nutzerliste für Admins/Moderatoren — nicht nur die zuletzt aktiven, sondern
  // wirklich ALLE registrierten Konten, damit man einen echten Überblick hat, wer da ist.
  async function getAllUsers() {
    if (!canModerate()) return [];
    if (client) {
      try {
        const { data, error } = await client.from("profiles").select("id,name,points,is_admin,is_owner,is_moderator,is_beta_tester,is_contributor,is_supporter,extra_profile_data,last_active").order("name", { ascending: true });
        if (error) {
          // WICHTIG: den Fehler nicht still verschlucken — sonst sieht der Admin nur "0 Personen
          // registriert" ohne jeden Hinweis, dass in Wahrheit z. B. eine Spalte in der Datenbank
          // fehlt (typischerweise, weil ein Nachrüst-SQL aus dem README noch nicht ausgeführt
          // wurde). lastUserListError wird in der Oberfläche angezeigt, damit das auffindbar ist.
          lastUserListError = error.message;
          console.warn("Nutzerliste konnte nicht geladen werden:", error.message);
          return [];
        }
        lastUserListError = null;
        if (!data) return [];
        return data.map((p) => ({
          id: p.id, name: p.name, points: p.points || 0,
          is_admin: Boolean(p.is_admin), is_owner: Boolean(p.is_owner), is_moderator: Boolean(p.is_moderator),
          is_beta_tester: Boolean(p.is_beta_tester), is_contributor: Boolean(p.is_contributor), is_supporter: Boolean(p.is_supporter),
          proficiency_level: (p.extra_profile_data && p.extra_profile_data.proficiencyLevel) || "fortgeschritten",
          online: isRecentlyActive(p.last_active), last_active: p.last_active,
        }));
      } catch (e) { lastUserListError = String(e); console.warn("Nutzerliste nicht verfügbar:", e); return []; }
    }
    return Object.entries(demo.users || {}).map(([email, u]) => ({
      id: email, name: u.profile.name, points: u.profile.points || 0,
      is_admin: Boolean(u.profile.isAdmin), is_owner: Boolean(u.profile.isOwner), is_moderator: Boolean(u.profile.isModerator),
      is_beta_tester: Boolean(u.profile.isBetaTester), is_contributor: Boolean(u.profile.isContributor), is_supporter: Boolean(u.profile.isSupporter),
      proficiency_level: (u.profile.extraProfileData && u.profile.extraProfileData.proficiencyLevel) || "fortgeschritten",
      online: false, last_active: null,
    })).sort((a, b) => a.name.localeCompare(b.name, "de"));
  }

  async function setModeratorStatus(targetUserId, value) {
    if (!isAdmin()) throw new Error("Nur Administratoren oder der Betreiber können Moderator-Rechte vergeben.");
    if (client) {
      const { error } = await client.from("profiles").update({ is_moderator: value }).eq("id", targetUserId);
      if (error) throw new Error(friendlyDbError(error.message));
      const names = await namesFor([targetUserId]);
      const targetName = (names[targetUserId] && names[targetUserId].name) || "jemand";
      await addActivity(value ? `${targetName} wurde von ${demo.profile.name} zum Moderator ernannt. 🧹` : `${targetName} ist nicht mehr Moderator. 🧹`);
      return;
    }
    const u = demo.users[targetUserId];
    if (u) {
      u.profile.isModerator = value;
      await addActivity(value ? `${u.profile.name} wurde von ${demo.profile.name} zum Moderator ernannt. 🧹` : `${u.profile.name} ist nicht mehr Moderator. 🧹`);
    }
  }
  // Beta-Tester:in — eigene, kleinere Rolle ohne Moderationsrechte, aber mit Zugriff auf noch
  // nicht öffentlich freigegebene Features (siehe isFeatureOn) plus dem kleinen Extra, dass eigene
  // Beiträge sofort für sie selbst sichtbar sind, auch vor der Freischaltung durch den Betreiber
  // (Vorwarnung: nur für SIE SELBST, nicht für die Öffentlichkeit — siehe communityTextLevels-
  // Anzeige-Logik).
  async function setBetaTesterStatus(targetUserId, value) {
    if (!isAdmin()) throw new Error("Nur Administratoren oder der Betreiber können diese Rolle vergeben.");
    if (client) {
      const { error } = await client.from("profiles").update({ is_beta_tester: value }).eq("id", targetUserId);
      if (error) throw new Error(friendlyDbError(error.message));
      const names = await namesFor([targetUserId]);
      const targetName = (names[targetUserId] && names[targetUserId].name) || "jemand";
      if (value) await sendSystemMessage(targetUserId, "🧪 Du bist jetzt Beta-Tester:in! Du kannst neue, noch nicht öffentliche Funktionen als Erste:r ausprobieren — schau regelmäßig in den Einstellungen vorbei.");
      await addActivity(value ? `${targetName} ist jetzt Beta-Tester:in! 🧪` : `${targetName} ist nicht mehr Beta-Tester:in.`);
      return;
    }
    const u = demo.users[targetUserId];
    if (u) {
      u.profile.isBetaTester = value;
      if (value) await sendSystemMessage(targetUserId, "🧪 Du bist jetzt Beta-Tester:in! Du kannst neue, noch nicht öffentliche Funktionen als Erste:r ausprobieren — schau regelmäßig in den Einstellungen vorbei.");
      await addActivity(value ? `${u.profile.name} ist jetzt Beta-Tester:in! 🧪` : `${u.profile.name} ist nicht mehr Beta-Tester:in.`);
    }
  }
  // Mitgestalter:in — für Menschen, die die Seite aktiv mit aufbauen (regelmäßig eigene Beiträge,
  // Links, Schwarmwissen einreichen), OHNE dass es sich wie eine Herabstufung gegenüber Admin/Mod
  // anfühlt — bewusst als "gemeinsam etwas schaffen", nicht als Hierarchiestufe formuliert.
  async function setContributorStatus(targetUserId, value) {
    if (!isAdmin()) throw new Error("Nur Administratoren oder der Betreiber können diese Rolle vergeben.");
    if (client) {
      const { error } = await client.from("profiles").update({ is_contributor: value }).eq("id", targetUserId);
      if (error) throw new Error(friendlyDbError(error.message));
      const names = await namesFor([targetUserId]);
      const targetName = (names[targetUserId] && names[targetUserId].name) || "jemand";
      if (value) await sendSystemMessage(targetUserId, "🛠️ Du bist jetzt offiziell Mitgestalter:in! Danke, dass du die Seite mit aufbaust — das sieht jetzt auch jeder an deinem Profil.");
      await addActivity(value ? `${targetName} ist jetzt Mitgestalter:in! 🛠️` : `${targetName} ist nicht mehr Mitgestalter:in.`);
      return;
    }
    const u = demo.users[targetUserId];
    if (u) {
      u.profile.isContributor = value;
      if (value) await sendSystemMessage(targetUserId, "🛠️ Du bist jetzt offiziell Mitgestalter:in! Danke, dass du die Seite mit aufbaust — das sieht jetzt auch jeder an deinem Profil.");
      await addActivity(value ? `${u.profile.name} ist jetzt Mitgestalter:in! 🛠️` : `${u.profile.name} ist nicht mehr Mitgestalter:in.`);
    }
  }
  // Unterstützer:in — für Menschen, die die Seite finanziell unterstützt haben (z. B. per PayPal-
  // Spende). WICHTIG, ehrlich: es gibt keine automatische Erkennung von PayPal-Spenden, da die
  // Seite keinen eigenen Server hat, der PayPal-Benachrichtigungen empfangen könnte — das muss der
  // Betreiber nach jeder Spende manuell hier vergeben.
  async function setSupporterStatus(targetUserId, value) {
    if (!isAdmin()) throw new Error("Nur Administratoren oder der Betreiber können diese Rolle vergeben.");
    if (client) {
      const { error } = await client.from("profiles").update({ is_supporter: value }).eq("id", targetUserId);
      if (error) throw new Error(friendlyDbError(error.message));
      const names = await namesFor([targetUserId]);
      const targetName = (names[targetUserId] && names[targetUserId].name) || "jemand";
      if (value) await sendSystemMessage(targetUserId, "💛 Ganz herzlichen Dank für deine Unterstützung! Du trägst jetzt offiziell das Unterstützer-Abzeichen in deinem Profil.");
      await addActivity(value ? `${targetName} ist jetzt Unterstützer:in — danke für die Unterstützung! 💛` : `${targetName} ist nicht mehr als Unterstützer:in markiert.`);
      return;
    }
    const u = demo.users[targetUserId];
    if (u) {
      u.profile.isSupporter = value;
      if (value) await sendSystemMessage(targetUserId, "💛 Ganz herzlichen Dank für deine Unterstützung! Du trägst jetzt offiziell das Unterstützer-Abzeichen in deinem Profil.");
      await addActivity(value ? `${u.profile.name} ist jetzt Unterstützer:in — danke für die Unterstützung! 💛` : `${u.profile.name} ist nicht mehr als Unterstützer:in markiert.`);
    }
  }
  // "Fuchs des Tages" — zusammengesetzter Aktivitäts-Wert, nicht nur die reinen Spiel-Punkte:
  // gewichtet mehrere Arten von Fleiß/Beitrag zu einem Gesamtwert zusammen. Wer heute den
  // höchsten Wert hat, gilt als "Fuchs des Tages". Da die Seite keinen eigenen Server für exakte
  // Mitternachts-Krönung hat, wird das bei jedem Aufruf LIVE für den aktuellen Tag neu berechnet.
  const DAILY_ACTIVITY_WEIGHTS = {
    rankingFirstPlace: 100, // heute Platz 1 im Punkte-Ranking
    contribution: 50,       // pro eingereichtem Beitrag heute (Text/Tipp/Link)
    siteShared: 20,         // die Seite heute mit jemandem geteilt
  };
  async function getDailyActivityScores() {
    return getActivityScoresForPeriod(1);
  }
  // Generalisierte Version der Tages-Aktivitäts-Berechnung — nimmt die Anzahl Tage zurück
  // entgegen (1=heute, 7=Woche, 30=Monat, 365=Jahr), damit "Fuchs des Tages" auf denselben
  // Prinzipien auch für Woche/Monat/Jahr funktioniert, ohne die Logik zu verdoppeln.
  async function getActivityScoresForPeriod(daysBack) {
    const start = new Date(); start.setDate(start.getDate() - (daysBack - 1)); start.setHours(0, 0, 0, 0);
    const scores = {}; // user_id -> { name, points, contributions, shared, total }
    if (client) {
      try {
        const { data: rankingRows } = await client.from("daily_ranking").select("user_id,name,points,date").gte("date", start.toISOString().slice(0, 10));
        (rankingRows || []).forEach((r) => {
          if (!r.user_id) return;
          scores[r.user_id] = scores[r.user_id] || { name: r.name, points: 0, contributions: 0, shared: false, total: 0 };
          scores[r.user_id].points += r.points || 0;
          scores[r.user_id].total += r.points || 0;
        });
      } catch (e) { console.warn("Zeitraum-Ranking-Abfrage fehlgeschlagen:", e); }
    } else {
      (demo.ranking || []).forEach((r) => {
        if (!r.user_id || new Date(r.date) < start) return;
        scores[r.user_id] = scores[r.user_id] || { name: r.name, points: 0, contributions: 0, shared: false, total: 0 };
        scores[r.user_id].points += r.points || 0;
        scores[r.user_id].total += r.points || 0;
      });
    }
    // Bei "heute" (daysBack=1) bekommt Platz 1 im Tages-Ranking zusätzlich den Erstplatzierten-
    // Bonus — bei längeren Zeiträumen zählt stattdessen einfach die Gesamtpunktzahl im Zeitraum.
    if (daysBack === 1) {
      const sorted = Object.entries(scores).sort((a, b) => b[1].points - a[1].points);
      if (sorted.length) scores[sorted[0][0]].total += DAILY_ACTIVITY_WEIGHTS.rankingFirstPlace;
    }
    if (client) {
      try {
        const [texts, tips, links] = await Promise.all([
          client.from("community_texts").select("user_id,author_name").gte("created_at", start.toISOString()),
          client.from("community_tips").select("user_id,author_name").gte("created_at", start.toISOString()),
          client.from("user_links").select("user_id,author_name").gte("created_at", start.toISOString()),
        ]);
        [...(texts.data || []), ...(tips.data || []), ...(links.data || [])].forEach((row) => {
          if (!row.user_id) return;
          scores[row.user_id] = scores[row.user_id] || { name: row.author_name, points: 0, contributions: 0, shared: false, total: 0 };
          scores[row.user_id].contributions += 1;
          scores[row.user_id].total += DAILY_ACTIVITY_WEIGHTS.contribution;
        });
      } catch (e) { console.warn("Beitrags-Zählung für Fuchs-Zeitraum fehlgeschlagen:", e); }
    } else {
      [...(demo.communityTexts || []), ...(demo.communityTips || []), ...(demo.userLinks || [])].forEach((row) => {
        if (!row.user_id || new Date(row.created_at) < start) return;
        scores[row.user_id] = scores[row.user_id] || { name: row.author_name, points: 0, contributions: 0, shared: false, total: 0 };
        scores[row.user_id].contributions += 1;
        scores[row.user_id].total += DAILY_ACTIVITY_WEIGHTS.contribution;
      });
    }
    if (daysBack === 1 && demo.siteSharesToday) {
      Object.keys(demo.siteSharesToday).forEach((uid) => {
        if (scores[uid]) { scores[uid].shared = true; scores[uid].total += DAILY_ACTIVITY_WEIGHTS.siteShared; }
      });
    }
    return Object.entries(scores).map(([user_id, s]) => ({ user_id, ...s })).sort((a, b) => b.total - a.total);
  }
  async function getFoxOfTheDay() {
    const scores = await getDailyActivityScores();
    return scores.length ? scores[0] : null;
  }
  async function getFoxOfWeek() {
    const scores = await getActivityScoresForPeriod(7);
    return scores.length ? scores[0] : null;
  }
  async function getFoxOfMonth() {
    const scores = await getActivityScoresForPeriod(30);
    return scores.length ? scores[0] : null;
  }
  async function getFoxOfYear() {
    const scores = await getActivityScoresForPeriod(365);
    return scores.length ? scores[0] : null;
  }
  // Einmalige Bonus-Gutschrift pro Tag, sobald jemand als aktueller Fuchs des Tages erkannt wird —
  // steuert über ein Datum im Profil, damit niemand mehrfach am selben Tag belohnt wird, egal wie
  // oft die Seite neu geladen wird.
  async function claimFoxOfDayBonusIfEligible() {
    if (!demo.user || !demo.profile) return null;
    const todayKey = new Date().toISOString().slice(0, 10);
    const already = demo.profile.extraProfileData && demo.profile.extraProfileData.foxOfDayClaimedDate === todayKey;
    if (already) return null;
    const fox = await getFoxOfTheDay();
    if (!fox || fox.user_id !== demo.user.id) return null;
    await updateExtraProfileField("foxOfDayClaimedDate", todayKey);
    const bonus = 30;
    demo.profile.points = (demo.profile.points || 0) + bonus;
    if (client) {
      await client.from("profiles").update({ points: demo.profile.points }).eq("id", demo.user.id);
    }
    await sendSystemMessage(demo.user.id, `🦊 Herzlichen Glückwunsch — du bist heute "Fuchs des Tages"! Für deinen besonderen Fleiß gibt's ${bonus} Bonuspunkte obendrauf. 🎉`);
    await addActivity(`${demo.profile.name} ist heute Fuchs des Tages! 🦊🎉`);
    await addToFoxOfDayHallOfFame({ name: demo.profile.name, total: fox.total });
    return { bonus };
  }
  // Die Seite mit jemandem teilen — zählt in die Tages-Aktivität mit ein (siehe oben), aber nie
  // alleine entscheidend fürs Gewinnen.
  async function recordSiteShare() {
    if (!demo.user) return;
    demo.siteSharesToday = demo.siteSharesToday || {};
    demo.siteSharesToday[demo.user.id] = true;
  }
  // Generisches System für hochladbare Design-Grafiken an bestimmten Stellen der Seite (z. B.
  // Hall-of-Fame-Banner, Wissen-Header) — im echten Speicher verankert (site_content-Tabelle,
  // kein localStorage), bleibt bei jedem künftigen Update unberührt, da AUSSCHLIESSLICH der
  // Betreiber sie über diese Funktion ändert.
  async function uploadSiteImage(key, file) {
    if (!isAdmin()) throw new Error("Nur Administratoren oder der Betreiber können Design-Grafiken ändern.");
    if (!client) throw new Error("Bilder hochladen geht nur mit verbundenem Supabase.");
    const path = `site-images/${key}-${Date.now()}-${file.name}`;
    const { error: uploadError } = await client.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) throw new Error("Upload fehlgeschlagen: " + uploadError.message);
    const { data } = client.storage.from("avatars").getPublicUrl(path);
    await setSiteContent(`site_image_${key}`, data.publicUrl);
    return data.publicUrl;
  }
  async function getSiteImage(key) {
    return await getSiteContent(`site_image_${key}`);
  }
  // nur "hat die meisten Punkte", sondern konkret benannt (geteilt, Beiträge eingereicht, Platz 1).
  function buildFoxOfDayReportCard(entry) {
    const lines = [];
    if (entry.rankPlace === 1) lines.push("Sie/Er steht heute auf Platz 1 im Ranking — fleißig Deutsch geübt!");
    if (entry.contributions > 0) lines.push(`Hat heute ${entry.contributions} eigene Beiträge zur Seite beigesteuert.`);
    if (entry.shared) lines.push("Hat die Seite heute mit Freund:innen geteilt und ihnen damit etwas Gutes getan.");
    if (!lines.length) lines.push("War heute einfach besonders aktiv unterwegs.");
    return lines;
  }
  async function getFoxOfTheDayShowcase() {
    return getFoxShowcaseForPeriod(1, "Tages");
  }
  // Generische Showcase-Funktion für Woche/Monat/Jahr — dasselbe Prinzip wie beim Tages-Fuchs,
  // nur mit dem jeweils längeren Zeitraum.
  async function getFoxShowcaseForPeriod(daysBack, label) {
    const scores = await getActivityScoresForPeriod(daysBack);
    if (!scores.length) return null;
    const top = scores[0];
    const entry = { ...top, rankPlace: 1 };
    const profile = top.user_id ? await getPublicProfile(top.user_id) : null;
    return { ...entry, reportCard: buildFoxOfDayReportCard(entry), profile, periodLabel: label };
  }
  async function getFoxOfWeekShowcase() {
    return getFoxShowcaseForPeriod(7, "Wochen");
  }
  async function getFoxOfMonthShowcase() {
    return getFoxShowcaseForPeriod(30, "Monats");
  }
  async function getFoxOfYearShowcase() {
    return getFoxShowcaseForPeriod(365, "Jahres");
  }
  // Bewerbung als Beta-Tester:in — landet als normale Nachricht im Postfach des Betreibers, der
  // die Rolle dann über die bestehende Admin-Nutzerliste vergeben kann (siehe setBetaTesterStatus).
  async function applyForBetaTester() {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    let ownerId = null;
    if (client) {
      try {
        const { data } = await client.from("profiles").select("id").eq("is_owner", true).limit(1);
        if (data && data[0]) ownerId = data[0].id;
      } catch (e) {}
    } else {
      const ownerEmail = Object.keys(demo.users || {}).find((email) => demo.users[email].profile.isOwner);
      ownerId = ownerEmail || null; // im Demo-Modus ist die E-Mail selbst die ID
    }
    if (!ownerId) return;
    await sendPrivateMessage(ownerId, `🧪 ${demo.profile.name} möchte gerne Beta-Tester:in werden — schau in der Nutzerliste unter Einstellungen vorbei, um die Rolle zu vergeben.`, null);
  }
  // Hall of Fame: kurzer, wachsender Verlauf vergangener Krönungen — genutzt wird dieselbe
  // generische site_content-Tabelle (kein neues SQL nötig), gedeckelt auf die letzten 30 Einträge.
  // Interner Systemschreibzugriff OHNE Admin-Prüfung — für automatische Vorgänge wie die
  // Hall-of-Fame-Eintragung, die JEDE Person auslösen kann (nicht nur Admins), im Unterschied zum
  // öffentlichen setSiteContent (das bewusst nur Admins erlaubt, absichtlich Seiteninhalte zu
  // ändern).
  async function setSiteContentInternal(key, value) {
    if (client) {
      const { error } = await client.from("site_content").upsert({ key, value });
      if (error) throw new Error(friendlyDbError(error.message));
      return;
    }
    demo.siteContent = demo.siteContent || {};
    demo.siteContent[key] = value;
  }
  async function addToFoxOfDayHallOfFame(entry) {
    const stored = (await getSiteContent("fox_of_day_hall_of_fame")) || [];
    stored.unshift({ name: entry.name, date: new Date().toISOString().slice(0, 10), total: entry.total });
    await setSiteContentInternal("fox_of_day_hall_of_fame", stored.slice(0, 30));
  }
  async function getFoxOfDayHallOfFame() {
    return (await getSiteContent("fox_of_day_hall_of_fame")) || [];
  }
  // und Dankes-Nachricht. Bewusst kein Muss/Zwang — eine Anerkennung fürs Unterstützen, nicht ein
  // "Punkte kaufen"-System (kein automatischer PayPal-Abgleich, siehe setSupporterStatus).
  async function grantDonationPoints(targetUserId, euroAmount) {
    if (!isAdmin()) throw new Error("Nur Administratoren oder der Betreiber können das.");
    const points = Math.round(euroAmount * 10);
    await setSupporterStatus(targetUserId, true);
    await adminGrantPoints(targetUserId, points, `Vielen Dank für deine Spende von ${euroAmount} € — als kleine Anerkennung gibt's ${points} Bonuspunkte obendrauf! 💛`);
  }
  // "Fuchs der Woche" — dasselbe Prinzip wie "Fuchs des Tages", nur über 7 Tage summiert (reine
  // Spielpunkte als Basis; wer über die Woche konstant aktiv war, gewinnt).
  async function getFoxOfTheWeek() {
    const start = new Date(); start.setDate(start.getDate() - 7);
    if (client) {
      try {
        const { data, error } = await client.from("results").select("user_id,points,bonus").gte("played_at", start.toISOString());
        if (error || !data || !data.length) return null;
        const totals = {};
        data.forEach((r) => { totals[r.user_id] = (totals[r.user_id] || 0) + Math.round((r.points || 0) + (r.bonus || 0)); });
        const topId = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0];
        if (!topId) return null;
        const { data: p } = await client.from("profiles").select("id,name").eq("id", topId).maybeSingle();
        return p ? { id: p.id, name: p.name, points: totals[topId] } : null;
      } catch (e) { console.warn("Fuchs der Woche nicht verfügbar:", e); return null; }
    }
    if (!demo.profile) return null;
    const weekPoints = (demo.profile.history || []).filter((h) => new Date(h.playedAt) >= start)
      .reduce((sum, h) => sum + Math.round((h.points || 0) + (h.bonus || 0)), 0);
    return weekPoints > 0 ? { id: demo.user ? demo.user.id : null, name: demo.profile.name, points: weekPoints } : null;
  }
  // Kleines Feedback-Formular fürs Beta-Testen — landet als normale Nachricht im Postfach des
  // Betreibers, damit keine eigene Tabelle+SQL-Nachtrag nötig ist.
  async function submitBetaFeedback({ featureLabel, consistent, issues, comment }) {
    if (!demo.user) throw new Error("Bitte zuerst anmelden.");
    let ownerId = null;
    if (client) {
      try {
        const { data } = await client.from("profiles").select("id").eq("is_owner", true).limit(1);
        if (data && data[0]) ownerId = data[0].id;
      } catch (e) {}
    } else {
      const ownerEmail = Object.keys(demo.users || {}).find((email) => demo.users[email].profile.isOwner);
      ownerId = ownerEmail || null; // im Demo-Modus ist die E-Mail selbst die ID
    }
    if (!ownerId) return;
    const issueText = issues.length ? `\nGefundene Probleme: ${issues.join(", ")}` : "";
    const text = `🧪 Beta-Feedback zu „${featureLabel}" von ${demo.profile.name}:\n${consistent ? "✅ War stimmig/konsistent" : "⚠️ War NICHT stimmig"}${issueText}${comment ? `\n\nKommentar: ${comment}` : ""}`;
    await sendPrivateMessage(ownerId, text, null);
  }

  return {
    isConfigured,
    restoreSession,
    signUp,
    signIn,
    signOut,
    REFERRAL_BONUS_POINTS,
    currentUser,
    currentProfile,
    refreshCurrentProfile,
    saveResult,
    getRanking,
    getRankingAllTime,
    getRankingToday,
    getGuestbook,
    addGuestbookEntry, getAverageRating,
    unlockPremiumDemo, togglePremium,
    isPremium,
    searchUsers,
    sendFriendRequest,
    getIncomingRequests,
    acceptFriendRequest,
    declineFriendRequest,
    getFriends,
    createChallenge,
    cancelChallenge,
    getMyChallenges,
    submitChallengeResult,
    addActivity,
    getActivity,
    getPlaylist, addPlaylistSong, deletePlaylistSong, toggleFavoriteSong, getMyFavoriteSongIds, isDirectAudioUrl, getUsersWithPlaylists,
    getHiddenPlaylistSongs, restorePlaylistSong,
    uploadSongCover, setSongCover, getSongPopularity,
    saveIntroduction, getAllIntroductions,
    getLastPlaylistLoadError: () => lastPlaylistLoadError,
    getLastUserListError: () => lastUserListError,
    getSiteContent, setSiteContent, getFeatureFlags, setFeatureFlag, isFeatureOn, getRawFeatureFlag,
    recordProfileVisit, getProfileVisitors, addProfileNote, getProfileNotes, deleteMyProfileNote,
    getBugReports, resolveBugReport,
    notifyPracticing,
    saveThemePreference,
    uploadGalleryPhoto,
    removeGalleryPhoto,
    saveHobbies,
    saveOrigin,
    submitCommunityText,
    updateCommunityText,
    communityTextLevels,
    uploadCommunityTextCover,
    getApprovedCommunityTexts,
    getMyCommunityTexts,
    getFullPointsBreakdown,
    isAdmin,
    isOwner,
    isModerator,
    canModerate,
    getAllUsers,
    setModeratorStatus, setBetaTesterStatus, submitBetaFeedback, setContributorStatus, setSupporterStatus, getFoxOfTheWeek, applyForBetaTester,
    getFoxOfTheDay, getDailyActivityScores, claimFoxOfDayBonusIfEligible, recordSiteShare, grantDonationPoints,
    getFoxOfWeek, getFoxOfMonth, getFoxOfYear, getFoxOfWeekShowcase, getFoxOfMonthShowcase, getFoxOfYearShowcase,
    getFoxOfTheDayShowcase, getFoxOfDayHallOfFame, uploadSiteImage, getSiteImage,
    getPendingCommunityTexts,
    approveCommunityText,
    rejectCommunityText,
    submitLink,
    getApprovedUserLinks,
    getMyUserLinks,
    getPendingUserLinks,
    approveUserLink,
    rejectUserLink,
    submitCommunityTip,
    getApprovedCommunityTips,
    getMyCommunityTips,
    getPendingCommunityTips,
    approveCommunityTip,
    rejectCommunityTip,
    deleteMyCommunityTip,
    setAdminStatus,
    deleteMyCommunityText,
    adminDeleteCommunityText,
    adminDeleteGalleryPhoto,
    adminDeleteAvatar,
    adminDeleteGuestbookEntry,
    adminDeleteAccount,
    adminGiftCategoryUnlock,
    adminGiftThemeUnlock,
    getUnreadNotifications,
    addNotification,
    sendPrivateMessage,
    sendBroadcastMessage,
    getMyMessages,
    deletePrivateMessage,
    getUnreadMessageCount,
    markMessagesRead,
    sendSystemMessage, adminGrantPoints,
    reportBug,
    markNotificationsRead,
    getLikesForText,
    toggleLikeText,
    getCommentsForText,
    addComment,
    deleteComment,
    saveBio,
    saveExtendedProfile, updateExtraProfileField, toggleBestFriend, getBestFriendIds,
    SYMPATHY_LEVELS, setSympathyLevel, removeSympathyLevel, getMySympathyFor,
    getAllSympathyLevels, addCustomSympathyLevel, removeCustomSympathyLevel,
    saveBirthday,
    uploadAvatar,
    restorePreviousAvatar,
    saveAvatarFromGallery,
    getRecentMembers,
    getPublicProfile,
    saveAvatarEmoji,
    addTrophy,
    touchActivity,
  };
})();
