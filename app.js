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
  // Sammelfiguren-Vitrine — kleine Sticker-Figuren, die man sich durch Übung verdient. Jede
  // Figur ist thematisch an eine Übungskategorie gekoppelt (passendes Charakter-Kostüm), damit
  // man wirklich für "diese Art von Wissen" belohnt wird, nicht zufällig.
  // Welcher Sammelfigur-Charakter zu welcher Übungskategorie passt — wird als kleine "Willkommen,
  // [Figur]!"-Vorstellung angezeigt, bevor eine Runde in dieser Kategorie beginnt, damit klar ist,
  // "als was" man gerade übt.
  const CATEGORY_PERSONA = {
    artikel: "Professor Schlaufuchs", plural: "Professor Schlaufuchs", synonyme: "Lesefuchs",
    "wenn-ob": "Professor Schlaufuchs", "als-wie": "Professor Schlaufuchs", "kennen-wissen": "Professor Schlaufuchs",
    "das-dass": "Professor Schlaufuchs", redewendungen: "Märchenfuchs", "haeufige-fehler": "Kommissar Fehlerfrei",
    "ss-eszett": "Kommissar Fehlerfrei", nebensatz: "Brückenfuchs", relativsatz: "Brückenfuchs",
    zeitformen: "Zeitfuchs", wortschatz: "Naturfotograf", konnektoren: "Brückenfuchs",
    jedesto: "Brückenfuchs", quiz: "Quizfuchs", lueckentext: "Märchenfuchs",
    wortbaustelle: "Rätselfuchs", buchstabensalat: "Rätselfuchs", kreuzwortraetsel: "Rätselfuchs",
    betonungstrainer: "Sprachtalent",
  };
  function personaForCategory(catId) {
    return CATEGORY_PERSONA[catId] || "Abenteuer-Fuchs";
  }
  const COLLECTIBLE_FIGURES = [
    { id: "kleiner-lernfuchs", name: "Kleiner Lernfuchs", img: "figures/kleiner-lernfuchs.png", desc: "Für den Anfang — willkommen!", unlock: { type: "points", value: 20 } },
    { id: "pausenfuchs", name: "Pausenfuchs", img: "figures/pausenfuchs.png", desc: "Gönnt sich eine Verschnaufpause", unlock: { type: "points", value: 40 } },
    { id: "professor-schlaufuchs", name: "Professor Schlaufuchs", img: "figures/professor-schlaufuchs.png", desc: "Grammatik-Experte", unlock: { type: "points", value: 60 } },
    { id: "lesefuchs", name: "Lesefuchs", img: "figures/lesefuchs.png", desc: "Liest für sein Leben gern", unlock: { type: "points", value: 75 } },
    { id: "zeitfuchs", name: "Zeitfuchs", img: "figures/zeitfuchs.png", desc: "Meister der Zeitformen", unlock: { type: "points", value: 90 } },
    { id: "musikerfuchs", name: "Musikerfuchs", img: "figures/musikerfuchs.png", desc: "Immer mit der Gitarre unterwegs", unlock: { type: "points", value: 100 } },
    { id: "maerchenfuchs", name: "Märchenfuchs", img: "figures/maerchenfuchs.png", desc: "Kenner von Redewendungen & Geschichten", unlock: { type: "points", value: 120 } },
    { id: "brueckenfuchs", name: "Brückenfuchs", img: "figures/brueckenfuchs.png", desc: "Verbindet Sätze mit zweiteiligen Konnektoren", unlock: { type: "points", value: 150 } },
    { id: "kommissar-fehlerfrei", name: "Kommissar Fehlerfrei", img: "figures/kommissar-fehlerfrei.png", desc: "Rechtschreib-Detektiv", unlock: { type: "points", value: 180 } },
    { id: "raetselfuchs", name: "Rätselfuchs", img: "figures/raetselfuchs.png", desc: "Kreuzworträtsel-Fan", unlock: { type: "points", value: 220 } },
    { id: "baeckerfuchs", name: "Bäckerfuchs", img: "figures/baeckerfuchs.png", desc: "Frisch aus dem Wortschatz-Ofen", unlock: { type: "points", value: 260 } },
    { id: "naturfotograf", name: "Naturfotograf", img: "figures/naturfotograf.png", desc: "Hält Wortschatz-Momente fest", unlock: { type: "points", value: 320 } },
    { id: "quizfuchs", name: "Quizfuchs", img: "figures/quizfuchs.png", desc: "Deutschland-Quiz-Kenner", unlock: { type: "points", value: 380 } },
    { id: "studierfuchs", name: "Studierfuchs", img: "figures/studierfuchs.png", desc: "Fleißig am Lernen", unlock: { type: "points", value: 440 } },
    { id: "malerfuchs", name: "Malerfuchs", img: "figures/malerfuchs.png", desc: "Kreativer Kopf", unlock: { type: "points", value: 500 } },
    { id: "abenteuerfuchs", name: "Abenteuer-Fuchs", img: "figures/abenteuerfuchs.png", desc: "Immer auf Entdeckungstour", unlock: { type: "points", value: 570 } },
    { id: "schlummerfuchs", name: "Schlummerfuchs", img: "figures/schlummerfuchs.png", desc: "Wohlverdiente Ruhe nach dem Üben", unlock: { type: "points", value: 650 } },
    { id: "feierfuchs", name: "Feierfuchs", img: "figures/feierfuchs.png", desc: "Feiert jeden Fortschritt", unlock: { type: "points", value: 750 } },
    { id: "absolventenfuchs", name: "Absolventenfuchs", img: "figures/absolventenfuchs.png", desc: "Großer Meilenstein erreicht", unlock: { type: "points", value: 850 } },
    { id: "championfuchs", name: "Champion-Fuchs", img: "figures/championfuchs.png", desc: "Die Krönung der Sammlung", unlock: { type: "points", value: 1000 } },
  ];
  // Orden (kleine, häufige Verdienste) vs. Pokale (große, seltene Meisterleistungen) — Trennung
  // anhand bekannter Top-Rang-Namen in der Trophäen-Bezeichnung selbst, ohne die bestehenden
  // Vergabestellen einzeln umbauen zu müssen.
  const TOP_TIER_KEYWORDS = ["Deutsch-Profi", "Deutsch-Superheld", "Superhirn", "Champion", "Sprachtalent"];
  function trophyKind(label) {
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

  function getLearningProfile() {
    try { return JSON.parse(localStorage.getItem("dma_learning_profile") || "{}"); } catch (e) { return {}; }
  }
  function setLearningRating(catId, rating) {
    const profile = getLearningProfile();
    profile[catId] = rating;
    try { localStorage.setItem("dma_learning_profile", JSON.stringify(profile)); } catch (e) {}
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
  async function loadAdminUserList() {
    const box = document.getElementById("adminUserListArea");
    if (!box) return;
    const allUsers = await Backend.getAllUsers();
    const isRealAdmin = Backend.currentProfile()?.isAdmin || Backend.currentProfile()?.isOwner;
    const filtered = adminUserSearch ? allUsers.filter((u) => u.name.toLowerCase().includes(adminUserSearch.toLowerCase())) : allUsers;
    box.innerHTML = `
      <p style="font-weight:800; font-size:1.3rem; margin:4px 0 10px;">${allUsers.length} ${allUsers.length === 1 ? "Person" : "Personen"} registriert</p>
      <input type="text" class="vocab-search" id="adminUserSearchInput" placeholder="Nach Namen suchen…" value="${adminUserSearch}" style="margin-bottom:10px;" />
      <div style="max-height:340px; overflow-y:auto;">
        ${filtered.length ? filtered.map((u) => `
          <div class="breakdown-row">
            <span style="display:flex; align-items:center; gap:6px;">
              <span class="online-dot" style="opacity:${u.online ? 1 : 0.25};"></span>
              ${u.name}${adminBadge(u.is_admin, u.is_owner, u.is_moderator)}
            </span>
            <span style="display:flex; align-items:center; gap:8px;">
              <span class="empty-note">${u.points} P.</span>
              ${isRealAdmin && !u.is_owner ? `<button type="button" class="btn btn-ghost" style="padding:3px 9px; font-size:0.72rem;" data-toggle-mod="${u.id}" data-currently-mod="${u.is_moderator}">${u.is_moderator ? "Mod entfernen" : "Zu Mod machen"}</button>` : ""}
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
      ${Backend.canModerate() ? `<div class="question-card" style="margin-top:14px;">
        <h3>👥 Alle registrierten Nutzer</h3>
        <div id="adminUserListArea"><p class="empty-note">Lade Nutzerliste…</p></div>
      </div>` : ""}
    `;
    if (Backend.canModerate()) loadAdminUserList();
    area.querySelectorAll(".learning-rate-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLearningRating(btn.dataset.cat, btn.dataset.rating);
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
    if (tickerBlinkCheck) tickerBlinkCheck.addEventListener("change", () => setTickerBlink(tickerBlinkCheck.checked));
    area.querySelectorAll(".notify-kind-sound").forEach((sel) => {
      sel.addEventListener("change", () => {
        setNotifyTypeSetting(sel.dataset.kind, "sound", sel.value);
        if (sel.value) playNotifySound(sel.value); // direkt vorhören, was gerade gewählt wurde
      });
    });
    area.querySelectorAll(".notify-kind-color").forEach((sel) => {
      sel.addEventListener("change", () => setNotifyTypeSetting(sel.dataset.kind, "color", sel.value));
    });
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
  function getShownMilestones() {
    try { return new Set(JSON.parse(localStorage.getItem("dma_shown_milestones") || "[]")); } catch (e) { return new Set(); }
  }
  function markMilestoneShown(key) {
    try {
      const shown = getShownMilestones();
      shown.add(key);
      localStorage.setItem("dma_shown_milestones", JSON.stringify([...shown]));
    } catch (e) {}
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
    const rewardKey = `dma_daily_rank_reward_${todayDateKey()}`;
    let alreadyRewarded = false;
    try { alreadyRewarded = localStorage.getItem(rewardKey) === "1"; } catch (e) {}
    if (alreadyRewarded) return;
    const todayRanking = await Backend.getRankingToday();
    if (!todayRanking.length || todayRanking[0].user_id !== user.id) return;
    // Nur belohnen, wenn wirklich mehr als eine Person heute überhaupt mitgemacht hat — sonst
    // ist "Platz 1" nicht wirklich eine Leistung, sondern nur die einzige Person, die heute spielt.
    if (todayRanking.length < 2) return;
    try { localStorage.setItem(rewardKey, "1"); } catch (e) {}
    saveResultAndCheck({ categories: [], points: 0, bonus: 5, percent: 100, character: "Tagesbester", badges: [], playedAt: new Date().toISOString() });
    Backend.sendSystemMessage(user.id, `🏆 Du bist heute Tagesbeste:r im Ranking! +5 Bonuspunkte als kleines Dankeschön für deinen Einsatz heute — weiter so!`);
    showToast("🏆 Heute Tagesbeste:r! +5 Bonuspunkte");
  }
  function checkForSpecialMoment(profile) {
    if (!profile) return;
    const shown = getShownMilestones();
    // Punkte-Meilensteine
    for (const m of POINT_MILESTONES) {
      const key = `points-${m}`;
      if (profile.points >= m && !shown.has(key)) {
        markMilestoneShown(key);
        showSpecialMomentModal(
          `${m} Punkte erreicht!`,
          `Schön, dass du dabeibleibst und so fleißig übst — das ist ein echter Meilenstein! Ich freu mich, dass dir die Seite hilft.`
        );
        return; // nur einen Moment gleichzeitig zeigen, nicht mehrere übereinander
      }
    }
    // Erste Trophäe überhaupt (Pokal, also die "großen" Erfolge — siehe trophyKind())
    const hasPokal = (profile.trophies || []).some((t) => trophyKind(t) === "pokal");
    if (hasPokal && !shown.has("first-pokal")) {
      markMilestoneShown("first-pokal");
      showSpecialMomentModal(
        "Dein erster großer Pokal!",
        "Das ist eine richtige Meisterleistung — herzlichen Glückwunsch! Solche Momente sind genau der Grund, warum ich diese Seite mit Freude weiterpflege."
      );
      return;
    }
    // Lange Serien (Login-Streak)
    let streak = 0;
    try { streak = Number(localStorage.getItem("dma_calendar_streak") || "0"); } catch (e) {}
    for (const days of [7, 30, 100]) {
      const key = `streak-${days}`;
      if (streak >= days && !shown.has(key)) {
        markMilestoneShown(key);
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
  function saveResultAndCheck(result) {
    Backend.saveResult(result);
    checkForSpecialMoment(Backend.currentProfile());
    checkDailyRankingReward();
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
        Core.el("div", { class: "question-card", style: "margin:10px 0;" },
          Core.el("p", {}, "So sehen deine Übungen mit diesem Design aus."),
          Core.el("button", { type: "button", class: "btn btn-coffee", style: "margin-top:8px;" }, "Beispiel-Button")
        ),
        Core.el("div", { class: "trophy-case", style: "justify-content:center;" },
          Core.el("div", { class: "trophy-chip" }, "🏆 Beispiel-Pokal")
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
  // Geschlechtssymbol — klassische astronomische Zeichen, optional vom Profil-Inhaber gewählt.
  const GENDER_SYMBOLS = {
    maennlich: { label: "männlich", svg: `<circle cx="10" cy="14" r="6" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M14.2 9.8 L20 4 M14 4 L20 4 L20 10" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    weiblich: { label: "weiblich", svg: `<circle cx="12" cy="9" r="6" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M12 15 L12 22 M8.5 19 L15.5 19" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    divers: { label: "divers", svg: `<circle cx="12" cy="10" r="6" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M12 16 L12 22 M9 19 L15 19 M16.2 5.8 L21 1 M16 1 L21 1 L21 6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
  };
  function genderBadgeHtml(key) {
    const g = GENDER_SYMBOLS[key];
    if (!g) return "";
    return `<span class="zodiac-badge" title="${g.label}"><svg viewBox="0 0 24 24" width="16" height="16">${g.svg}</svg> ${g.label}</span>`;
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
    // Pro Tag genau eine Aufgabe — wird beim ersten Öffnen erzeugt und dann im Browser
    // gespeichert, damit sie bei erneutem Öffnen exakt dieselbe bleibt (nicht jedes Mal neu).
    try {
      const saved = localStorage.getItem("dma_calendar_task_" + todayDateKey());
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const task = pickDailyTaskFresh();
    try { localStorage.setItem("dma_calendar_task_" + todayDateKey(), JSON.stringify(task)); } catch (e) {}
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
    try { return localStorage.getItem("dma_calendar_task_attempted") === todayDateKey(); } catch (e) { return false; }
  }
  function getDailyTaskAttemptResult() {
    try { return localStorage.getItem("dma_calendar_task_result"); } catch (e) { return null; }
  }
  function markDailyTaskAttempted(wasCorrect) {
    try {
      localStorage.setItem("dma_calendar_task_attempted", todayDateKey());
      localStorage.setItem("dma_calendar_task_result", wasCorrect ? "correct" : "wrong");
    } catch (e) {}
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
    // Logische Erweiterung: falls für den heutigen Tag ein Eintrag bei "Es war einmal in
    // Deutschland" existiert, gibt es hier einen kurzen, unauffälligen Link dahin — es ist ja
    // genau an diesem Kalendertag passiert. Bewusst kurz gehalten (nur der Titel, gekürzt),
    // damit die feste Kartengröße nicht gesprengt wird.
    const md = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const historyEntry = ExerciseData.germanHistoryForToday(md);
    const historyLinkHtml = historyEntry ? `<button type="button" class="btn btn-ghost" id="calHistoryLinkBtn" style="margin-top:10px; font-size:0.78rem; padding:6px 12px;">📜 Es war einmal in Deutschland … heute vor ${new Date().getFullYear() - historyEntry.year} Jahren</button>` : "";
    if (isDailyTaskSolvedToday()) {
      const wasCorrect = getDailyTaskAttemptResult() === "correct";
      back.innerHTML = `
        ${specialDayHtml}
        <p class="cal-tip-title">${wasCorrect ? "✅ Tagesaufgabe gelöst!" : "📅 Tagesaufgabe schon versucht"}</p>
        <p class="cal-tip-text">${wasCorrect ? "Du hast deine Aufgabe für heute schon erledigt — komm morgen wieder für eine neue!" : "Du hast es heute schon versucht — kein Problem, morgen kommt eine neue Chance!"}</p>
        <hr style="width:100%; border:none; border-top:1px solid rgba(0,0,0,0.1); margin:14px 0;" />
        <p class="cal-tip-title" style="font-size:0.85rem;">💡 Wusstest du außerdem …</p>
        <p class="cal-tip-text" id="calTipText" style="font-size:0.85rem;">${truncate(pickDailyTip().text, 220)}</p>
        <button type="button" class="btn btn-ghost" id="calAnotherBtn" style="margin-top:10px;">🔄 Anderen Tipp</button>
        ${historyLinkHtml}
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
      <p class="cal-tip-title">🎯 Tagesaufgabe</p>
      ${cwCalendarTask.focus ? `<p class="empty-note" style="margin:-4px 0 8px;">${cwCalendarTask.focus.kind === "self-assessed" ? `🧭 Du hast „${cwCalendarTask.focus.label}" selbst als Schwäche markiert — hier eine Frage, um genau daran zu arbeiten!` : cwCalendarTask.focus.kind === "weak" ? `💪 Bei „${cwCalendarTask.focus.label}" liegt dein Schnitt bei ${cwCalendarTask.focus.percent}% — hier eine Frage, um genau das zu festigen!` : `🔎 Du übst gerade viel „${cwCalendarTask.focus.label}" (${cwCalendarTask.focus.percent}% deiner letzten Runden)${cwCalendarTask.isPersonalized ? " — hier eine passende Frage dazu!" : ""}`}</p>` : ""}
      <p class="cal-tip-text">${questionText}</p>
      <div style="display:flex; flex-direction:column; gap:8px; width:100%; margin-top:6px;" id="calTaskOptions">
        ${cwCalendarTask.options.map((opt, i) => `<button type="button" class="btn btn-ghost" data-task-answer="${i}" style="text-align:left;">${opt}</button>`).join("")}
      </div>
      <p class="empty-note" id="calTaskFeedback" style="margin-top:8px;"></p>
      <hr style="width:100%; border:none; border-top:1px solid rgba(0,0,0,0.1); margin:14px 0;" />
      <p class="cal-tip-title" style="font-size:0.85rem;">💡 Wusstest du außerdem …</p>
      <p class="cal-tip-text" id="calTipText" style="font-size:0.85rem;">${truncate(pickDailyTip().text, 220)}</p>
      <button type="button" class="btn btn-ghost" id="calAnotherBtn" style="margin-top:10px;">🔄 Anderen Tipp</button>
      ${historyLinkHtml}
    `;
    back.querySelectorAll("[data-task-answer]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.taskAnswer);
        const fb = document.getElementById("calTaskFeedback");
        back.querySelectorAll("[data-task-answer]").forEach((b) => { b.disabled = true; });
        const correct = idx === cwCalendarTask.correctIdx;
        if (correct) {
          btn.style.background = "#4FA88E"; btn.style.color = "#fff";
          Core.sound.fanfare();
          fb.textContent = "🎉 Richtig! Bonuspunkt fürs Lösen der Tagesaufgabe.";
          claimDailyTaskPoints();
          markDailyTaskAttempted(true);
        } else {
          btn.style.background = "#E85F6F"; btn.style.color = "#fff";
          Core.sound.wrong();
          fb.textContent = "Nicht ganz — aber macht nichts, morgen kommt eine neue Aufgabe!";
          markDailyTaskAttempted(false);
        }
        if (Backend.currentUser()) {
          const questionShort = cwCalendarTask.word;
          const correctOption = cwCalendarTask.options[cwCalendarTask.correctIdx];
          Backend.sendSystemMessage(Backend.currentUser().id, `📅 Du hast gerade deine Tagesaufgabe gemacht — ${correct ? "richtig gelöst! 🎉" : "leider nicht ganz getroffen."}\n\n${questionShort}\n→ Richtige Antwort: ${correctOption}`);
        }
        setTimeout(() => renderCalendarBack(), 1400);
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
        document.querySelector('[data-target="view-knowledge"]').click();
        document.getElementById("calCloseBtn")?.click();
        setTimeout(() => {
          document.querySelector('[data-sub="sub-kompass"]')?.click();
        }, 150);
      });
    }
  }
  function claimDailyTaskPoints() {
    if (!Backend.currentUser()) return;
    if (isDailyTaskSolvedToday()) return;
    try { localStorage.setItem("dma_calendar_task_claimed", todayDateKey()); } catch (e) {}
    saveResultAndCheck({
      categories: ["tageskalender"], points: 0, bonus: 2, percent: 100,
      character: "Tagesaufgabe gelöst", badges: [], playedAt: new Date().toISOString(),
    });
  }
  // Login-Streak: einmal pro Tag eine kleine, zufällige Punkte-Überraschung fürs Vorbeischauen —
  // muss keine Aufgabe sein, allein das Einloggen wird schon leicht belohnt, wie bei einem
  // Adventskalender. Ab 7 Tagen am Stück gibt's zusätzlich eine Trophäe.
  function claimLoginStreak() {
    if (!Backend.currentUser()) return;
    const todayKey = new Date().toISOString().slice(0, 10);
    let lastLogin = null, streak = 0;
    try {
      lastLogin = localStorage.getItem("dma_last_login_day");
      streak = Number(localStorage.getItem("dma_login_streak") || "0");
    } catch (e) {}
    if (lastLogin === todayKey) return; // heute schon verbucht
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    streak = lastLogin === yesterday ? streak + 1 : 1; // Kette gerissen -> von vorn
    try {
      localStorage.setItem("dma_last_login_day", todayKey);
      localStorage.setItem("dma_login_streak", String(streak));
    } catch (e) {}
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
  if (calOverlay) calOverlay.addEventListener("click", (e) => { if (e.target === calOverlay) calOverlay.style.display = "none"; });
  const calFrontFace = document.getElementById("calFrontFace");
  if (calFrontFace) calFrontFace.addEventListener("click", () => {
    document.getElementById("calendarModalPage").classList.add("torn");
    Core.sound.correct();
    claimDailyCalendarPoints();
  });
  function claimDailyCalendarPoints() {
    if (!Backend.currentUser()) return;
    const todayKey = new Date().toISOString().slice(0, 10);
    let lastClaim = null;
    try { lastClaim = localStorage.getItem("dma_calendar_claimed"); } catch (e) {}
    if (lastClaim === todayKey) return; // heute schon abgerissen — keine doppelten Punkte
    // Kalender-Serie: reißt man an mehreren Tagen HINTEREINANDER ab, steigen die Punkte —
    // genau wie beim Login-Streak. Reißt man einen Tag aus, fängt die Serie wieder bei vorne an.
    let streak = 0;
    try { streak = Number(localStorage.getItem("dma_calendar_streak") || "0"); } catch (e) {}
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    streak = lastClaim === yesterday ? streak + 1 : 1;
    try {
      localStorage.setItem("dma_calendar_claimed", todayKey);
      localStorage.setItem("dma_calendar_streak", String(streak));
    } catch (e) {}
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
    const text = items.length ? items.map((a) => `• ${a.text}`).join("   ") : track.textContent;
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
    track.style.animation = ""; // Safari/iOS startet die Animation nach Textänderung sonst nicht neu
    track.style.animationDuration = `${duration}s`; // MUSS nach dem Zurücksetzen von "animation" gesetzt werden, sonst wird sie mit zurückgesetzt
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
    const toast = Core.el("div", { class: "toast-popup", onclick: onClick || (() => {}) }, text);
    if (onClick) toast.classList.add("toast-clickable");
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("toast-visible"), 20);
    setTimeout(() => {
      toast.classList.remove("toast-visible");
      setTimeout(() => toast.remove(), 400);
    }, 5500);
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

  // Stummschaltung für Benachrichtigungs-Ton + roten Ring — bleibt dauerhaft im Browser gespeichert,
  // z. B. wenn gerade viele Anfragen reinkommen und man das nicht ständig hören/sehen möchte.
  function isNotifyMuted() {
    try { return localStorage.getItem("dma_notify_muted") === "1"; } catch (e) { return false; }
  }
  function setNotifyMuted(muted) {
    try { localStorage.setItem("dma_notify_muted", muted ? "1" : "0"); } catch (e) {}
  }
  // Getrennt vom Ton: das Blinken/Leuchten der Profil-Pille kann unabhängig ausgeschaltet werden
  // (z. B. Ton an, aber kein optisches Blinken — oder umgekehrt).
  function isNotifyBlinkMuted() {
    try { return localStorage.getItem("dma_notify_blink_muted") === "1"; } catch (e) { return false; }
  }
  function setNotifyBlinkMuted(muted) {
    try { localStorage.setItem("dma_notify_blink_muted", muted ? "1" : "0"); } catch (e) {}
  }

  // Betonungsmodus — sitweiter Umschalter. Zeigt bei allen Wörtern, für die eine geprüfte
  // Silbentrennung vorliegt (Vokabeltrainer, Hobbys, Länder, Sprachen, Artikel-Wortschatz),
  // die betonte Silbe unterstrichen an — wie im Duden. Ungeprüfte Wörter bleiben unverändert.
  function isStressModeOn() {
    try { return localStorage.getItem("dma_stress_mode") === "1"; } catch (e) { return false; }
  }
  function setStressMode(on) {
    try { localStorage.setItem("dma_stress_mode", on ? "1" : "0"); } catch (e) {}
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
    try { return JSON.parse(localStorage.getItem("dma_stress_excluded") || "[]"); } catch (e) { return []; }
  }
  function setStressExcludedSections(ids) {
    try { localStorage.setItem("dma_stress_excluded", JSON.stringify(ids)); } catch (e) {}
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
  function getNotifySoundKey() {
    try { return localStorage.getItem("dma_notify_sound") || "ding"; } catch (e) { return "ding"; }
  }
  function setNotifySoundKey(key) {
    try { localStorage.setItem("dma_notify_sound", key); } catch (e) {}
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
    try { return localStorage.getItem("dma_notify_color") || "coral"; } catch (e) { return "coral"; }
  }
  function setNotifyColorKey(key) {
    try { localStorage.setItem("dma_notify_color", key); } catch (e) {}
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
    try { return JSON.parse(localStorage.getItem("dma_notify_type_settings") || "{}"); } catch (e) { return {}; }
  }
  function setNotifyTypeSetting(kind, field, value) {
    const all = getNotifyTypeSettings();
    if (!all[kind]) all[kind] = {};
    if (value === "") delete all[kind][field]; else all[kind][field] = value;
    try { localStorage.setItem("dma_notify_type_settings", JSON.stringify(all)); } catch (e) {}
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
    try { return localStorage.getItem("dma_heading_font") || "standard"; } catch (e) { return "standard"; }
  }
  function setHeadingFontKey(key) {
    try { localStorage.setItem("dma_heading_font", key); } catch (e) {}
    applyHeadingFont();
  }
  function applyHeadingFont() {
    const preset = HEADING_FONT_PRESETS[getHeadingFontKey()] || HEADING_FONT_PRESETS.standard;
    document.documentElement.style.setProperty("--font-display", preset.css);
  }

  function isTickerBlinkOn() {
    try { return localStorage.getItem("dma_ticker_blink") === "1"; } catch (e) { return false; }
  }
  function setTickerBlink(on) {
    try { localStorage.setItem("dma_ticker_blink", on ? "1" : "0"); } catch (e) {}
    const wrap = document.querySelector(".ticker-track-wrap");
    if (wrap) wrap.classList.toggle("ticker-blink", on);
  }
  applyNotifyColor();
  setTickerBlink(isTickerBlinkOn());
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
      const jumpToMsg = () => { activateTab("view-profile"); document.querySelector('[data-sub="sub-inbox"]').click(); setTimeout(() => scrollToAndHighlight(`[data-msg-row="${newestMsg?.id}"]`), 200); };
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
        const jumpToReq = () => { activateTab("view-profile"); document.querySelector('[data-sub="sub-friends"]').click(); setTimeout(() => scrollToAndHighlight(`[data-accept="${r.id}"]`), 200); };
        showToast("👥 Neue Freundschaftsanfrage — antippen zum Annehmen", jumpToReq);
        notifyTarget = { kind: "friendrequest", action: jumpToReq };
        hasNew = true; newestKind = "friendrequest";
      }
    });
    challenges.incoming.forEach((c) => {
      if (!toastedNotificationIds.has("chal-" + c.id)) {
        toastedNotificationIds.add("chal-" + c.id);
        const jumpToChal = () => { activateTab("view-profile"); document.querySelector('[data-sub="sub-friends"]').click(); setTimeout(() => scrollToAndHighlight(`[data-accept-challenge="${c.id}"]`), 200); };
        showToast("🎮 Neue Duell-Herausforderung — antippen zum Annehmen", jumpToChal);
        notifyTarget = { kind: "challenge", action: jumpToChal };
        hasNew = true; newestKind = "challenge";
      }
    });
    notifications.forEach((n) => {
      if (!toastedNotificationIds.has(n.id)) {
        toastedNotificationIds.add(n.id);
        const jumpToOther = () => document.querySelector('[data-target="view-profile"]').click();
        showToast(n.message, jumpToOther);
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
  // Wiederverwendbare Einladungs-Leiste für die neueren Spiele (Wortbaustelle, Buchstabensalat,
  // Kreuzworträtsel, Betonungs-Trainer) — dasselbe Muster wie bei den klassischen Übungen: auch
  // offline Freunde einladbar (spielen die Runde nach, sobald sie sich einloggen), mehrere
  // gleichzeitig auswählbar.
  const miniChallengeSelections = {}; // { gameKey: Set<friendId> }
  // Zwischenspeicher pro Spiel: verhindert, dass bei JEDEM Tastendruck/Klick (der die ganze
  // Runde neu rendert) die Einladungsleiste erneut vom Server geladen wird — das ließ sie kurz
  // leer erscheinen und dann nachträglich "reinspringen", was wie ein Layout-Sprung wirkte.
  // Nur beim ersten Aufruf pro Runde wird wirklich neu geladen, danach wird der Zwischenspeicher
  // sofort (ohne Verzögerung) wiederverwendet.
  const miniChallengeBarCache = {};
  function renderMiniChallengeBarCached(gameKey, categoryId, targetElId, container, onRerender) {
    const el = document.getElementById(targetElId);
    if (!el) return;
    if (miniChallengeBarCache[gameKey]) {
      el.innerHTML = miniChallengeBarCache[gameKey];
      wireMiniChallengeBar(container, gameKey, onRerender);
      return;
    }
    renderMiniChallengeBar(gameKey, categoryId).then((html) => {
      miniChallengeBarCache[gameKey] = html;
      const freshEl = document.getElementById(targetElId);
      if (freshEl) { freshEl.innerHTML = html; wireMiniChallengeBar(container, gameKey, onRerender); }
    });
  }
  async function renderMiniChallengeBar(gameKey, categoryId) {
    if (!miniChallengeSelections[gameKey]) miniChallengeSelections[gameKey] = new Set();
    if (!Backend.currentUser()) return "";
    const friends = await Backend.getFriends();
    if (!friends.length) return "";
    const selected = miniChallengeSelections[gameKey];
    const onlineFriends = friends.filter((f) => f.online);
    const offlineFriends = friends.filter((f) => !f.online);
    return `
      <div class="setup-bar" style="margin-top:10px; flex-direction:column; align-items:stretch;">
        <label style="font-size:0.82rem; font-weight:700; color:var(--cream-200);">🎮 Optional: Freunde herausfordern (auch mehrere gleichzeitig)</label>
        <div class="challenge-friend-list">
          ${onlineFriends.map((f) => `
            <button type="button" class="challenge-friend-pill ${selected.has(f.id) ? "selected" : ""}" data-mini-game="${gameKey}" data-mini-friend="${f.id}">
              <span class="online-dot"></span>${f.name}
            </button>`).join("")}
          ${offlineFriends.map((f) => `
            <button type="button" class="challenge-friend-pill offline ${selected.has(f.id) ? "selected" : ""}" data-mini-game="${gameKey}" data-mini-friend="${f.id}" title="Spielt die Runde, sobald sie sich wieder einloggen">
              ${f.name} <span class="empty-note">(offline)</span>
            </button>`).join("")}
        </div>
        ${selected.size ? `<button type="button" class="btn btn-coffee" id="miniChallengeSendBtn" data-mini-game="${gameKey}" data-mini-cat="${categoryId}" style="margin-top:8px;">🎮 ${selected.size} ${selected.size === 1 ? "Person" : "Personen"} herausfordern</button>` : ""}
      </div>`;
  }
  function wireMiniChallengeBar(container, gameKey, onRerender) {
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
      showToast(`🦊 Willkommen, ${personaForCategory([...selectedCategories][0])}!`);
      renderQuestion();
    });
    const resumeBtn = document.getElementById("resumeBtn");
    if (resumeBtn) resumeBtn.addEventListener("click", () => renderQuestion());
  }

  let currentSelection = [];
  const AUTO_ADVANCE_DELAY = 900;

  // Wiederverwendbarer "Fehler melden"-Button — kann in jedes Spiel eingebunden werden. Öffnet
  // eine kleine Auswahl (kein Text nötig), landet automatisch im Postfach des Betreibers.
  function reportBugButtonHtml() {
    return `<button type="button" class="bug-report-btn" id="bugReportBtn" title="Fehler melden">🐛</button>`;
  }
  function wireBugReportButton(context) {
    const btn = document.getElementById("bugReportBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
        Core.el("div", { class: "profile-modal-card", style: "max-width:300px;" },
          Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
          Core.el("h3", {}, "🐛 Fehler melden"),
          Core.el("p", { class: "empty-note" }, "Was ist hier gerade schiefgelaufen? Du musst nichts schreiben, nur auswählen:"),
          ...["Rechtschreibfehler", "Spiel reagiert nicht / hängt", "Text abgeschnitten / falscher Zeilenumbruch", "Falsche Antwort markiert", "Sonstiges"].map((label) =>
            Core.el("button", { type: "button", class: "btn btn-ghost", style: "display:block; width:100%; margin-bottom:8px; text-align:left;", onclick: async () => {
              await Backend.reportBug(context, label);
              box.remove();
              showToast("✅ Danke, Alex wurde informiert!");
            } }, label)
          )
        )
      );
      document.body.appendChild(box);
    });
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

    playEl.innerHTML = `
      <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${(p.index / p.total) * 100}%"></div></div>
      <div class="question-card">
        ${reportBugButtonHtml()}
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
  function stressTrainerWordPool() {
    const pool = [];
    VocabData.WORDS.forEach((w) => { if (w.syl && w.syl.includes("-")) pool.push({ word: w.word, syl: w.syl, en: w.en }); });
    Object.entries(ExerciseData.WORD_SYL || {}).forEach(([word, syl]) => {
      if (syl.includes("-")) pool.push({ word, syl, en: ExerciseData.WORD_MEANINGS[word] });
    });
    // Typische "Problemwörter" für Deutschlernende werden dreifach ins Los-Topf gelegt, damit sie
    // im Schnitt deutlich häufiger drankommen als der übrige, eher zufällige Wortschatz — genau
    // die Wörter, bei denen sich Üben am meisten lohnt.
    Object.entries(ExerciseData.STRESS_PROBLEM_WORDS || {}).forEach(([word, syl]) => {
      for (let i = 0; i < 3; i++) pool.push({ word, syl, en: "" });
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
        <p style="font-weight:800; font-size:1.1rem; color:var(--amber-400); margin:4px 0 0;">${tier}</p>
        <button type="button" class="btn btn-coffee" id="stPlayAgainBtn" style="margin-top:14px;">🔄 Neue Runde</button>
      </div>
    `;
    if (Backend.currentUser() && percent >= 90) {
      Backend.addTrophy(`Betonungs-Trainer – Sprachtalent`);
    }
    document.getElementById("stPlayAgainBtn").addEventListener("click", () => {
      newStressTrainerSession(); pickStressTrainerWord(); renderStressTrainer();
    });
  }
  function renderStressTrainer() {
    const area = document.getElementById("stressTrainerArea");
    if (!stTrainerSession) newStressTrainerSession();
    if (!stTrainerWord) pickStressTrainerWord();
    if (stTrainerSession.round >= stTrainerSession.total) { renderStressTrainerResults(); return; }
    const w = stTrainerWord;
    area.innerHTML = `
      <div class="question-card">
        <p class="eyebrow">🎯 BETONUNGS-TRAINER · RUNDE ${stTrainerSession.round + 1} / ${stTrainerSession.total}</p>
        <div class="trophy-case" style="margin-bottom:10px;">
          ${[["leicht", "🟢 Leicht"], ["mittel", "🟡 Mittel"], ["schwer", "🔴 Schwer"]].map(([key, label]) => `<button type="button" class="trophy-chip st-diff-btn ${stTrainerDifficulty === key ? "selected" : ""}" data-diff="${key}">${label}</button>`).join("")}
        </div>
        <p class="empty-note" style="margin-bottom:12px;">Welche Silbe wird bei diesem Wort betont? Antippen zum Wählen.</p>
        <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap; margin:16px 0;">
          ${w.syllables.map((s, i) => `<button type="button" class="btn btn-ghost st-syl-btn" data-syl-idx="${i}" style="font-size:1.2rem; font-weight:800; text-transform:lowercase;">${s.toLowerCase()}</button>`).join("")}
        </div>
        <p class="empty-note" id="stFeedback" style="text-align:center;"></p>
        <div id="stChallengeBar"></div>
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
        // Nur bei richtiger Antwort: das Wort nochmal per Sprachausgabe vorlesen — aber ERST,
        // nachdem der Bestätigungston fertig abgespielt ist (kleine Verzögerung), sonst würden
        // sich Ton und Sprachausgabe hörbar überlappen statt sauber nacheinander zu kommen.
        if (correct) setTimeout(() => Core.speak(w.word), 500);
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
  document.querySelector('#learnSubnav [data-sub="sub-stresstrainer"]').addEventListener("click", () => {
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
    "Blatt": "Tiere & Natur"
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
        ${["alle", "A1", "A2", "B1", "erweitert"].map((lvl) => `<button type="button" class="trophy-chip dict-level-btn ${dictLevelFilter === lvl ? "selected" : ""}" data-level="${lvl}">${lvl === "alle" ? "Alle" : lvl === "erweitert" ? "Erweitert (ungeprüft)" : lvl}</button>`).join("")}
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
  document.querySelector('#learnSubnav [data-sub="sub-dictionary"]').addEventListener("click", () => renderDictionary());

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
    try { return localStorage.getItem("dma_memory_card_design") || "fuchs"; } catch (e) { return "fuchs"; }
  }
  function setMemoryCardDesign(id) {
    try { localStorage.setItem("dma_memory_card_design", id); } catch (e) {}
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
     WORTBAUSTELLE — Wort vervollständigen: einige Buchstaben sind schon
     da, die restlichen tippt man in der richtigen Reihenfolge aus einem
     durcheinandergewürfelten Buchstabenpool an (auf dem Handy zuverlässiger
     als echtes Ziehen). Tempo wird belohnt.
     ============================================================ */
  let wbState = null;
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
    document.getElementById("wbPlayAgainBtn").addEventListener("click", () => {
      newWordbuildSession(); newWordbuildRound(); renderWordbuild();
    });
  }
  function renderWordbuild() {
    const area = document.getElementById("wordbuildArea");
    if (!wbSession) newWordbuildSession();
    if (!wbState) newWordbuildRound();
    if (wbSession.round >= wbSession.total) { renderWordbuildResults(); return; }
    const s = wbState;
    const nextEmptyIdx = s.slots.findIndex((v) => v === null);
    area.innerHTML = `
      <div class="question-card">
        <p class="eyebrow">🔤 WORTBAUSTELLE · RUNDE ${wbSession.round + 1} / ${wbSession.total}</p>
        <div class="trophy-case" style="margin-bottom:8px;">
          ${[["leicht", "🟢 Leicht"], ["mittel", "🟡 Mittel"], ["schwer", "🔴 Schwer"]].map(([key, label]) => `<button type="button" class="trophy-chip wb-diff-btn ${wbDifficulty === key ? "selected" : ""}" data-wb-diff="${key}">${label}</button>`).join("")}
        </div>
        <h3 style="margin-bottom:10px;">${s.clue}</h3>
        <div class="wb-slot-row" style="flex-wrap:wrap; ${s.slots.length > 8 ? `--wb-slot-w: ${Math.max(26, Math.floor(300 / Math.min(s.slots.length, 12)))}px; --wb-font-size: ${Math.max(0.85, 1.3 - (s.slots.length - 8) * 0.05)}rem;` : ""}">
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
        <div id="wbChallengeBar"></div>
      </div>
    `;
    renderMiniChallengeBarCached("wortbaustelle", "wortbaustelle", "wbChallengeBar", area, renderWordbuild);
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
  document.querySelector('#learnSubnav [data-sub="sub-wordbuild"]').addEventListener("click", () => {
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
    area.innerHTML = `
      <div class="question-card" style="text-align:center;">
        <p class="eyebrow">🔍 BUCHSTABENSALAT — RUNDE FERTIG</p>
        <h2 style="margin:8px 0;">${wsSession.correctCount} / ${wsSession.target} richtig gelöst</h2>
        <p style="font-size:1.1rem; font-weight:700; color:var(--amber-400);">${tier.title}</p>
        <button type="button" class="btn btn-coffee" id="wsPlayAgainBtn" style="margin-top:14px;">🔄 Neue Runde</button>
      </div>
    `;
    document.getElementById("wsPlayAgainBtn").addEventListener("click", () => {
      newWordSearchSession(); wsState = buildWordSearch(); renderWordSearch();
    });
  }
  function isWsHintModeOn() {
    try { return localStorage.getItem("dma_ws_hint_mode") === "1"; } catch (e) { return false; }
  }
  function setWsHintMode(on) {
    try { localStorage.setItem("dma_ws_hint_mode", on ? "1" : "0"); } catch (e) {}
  }
  function renderWordSearch() {
    const area = document.getElementById("wordsearchArea");
    if (!wsSession) newWordSearchSession();
    if (!wsState) wsState = buildWordSearch();
    if (wsSession.wordsAttempted >= wsSession.target) { renderWordSearchResults(); return; }
    const s = wsState;
    area.innerHTML = `
      <div class="question-card">
        <p class="eyebrow">🔍 BUCHSTABENSALAT · ${wsSession.wordsAttempted} / ${wsSession.target} WÖRTER · ${wsSession.correctCount} RICHTIG</p>
        <p class="empty-note wrap-words" style="margin-bottom:10px;">Erste und letzte Zelle eines Wortes antippen — waagerecht, senkrecht oder diagonal, in jede Richtung. Danach den richtigen Artikel wählen, um das Wort abzuschließen.</p>
        <div class="ws-grid" style="grid-template-columns: repeat(${s.size}, 1fr);">
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
        <div id="wsChallengeBar"></div>
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
  document.querySelector('#learnSubnav [data-sub="sub-wordsearch"]').addEventListener("click", () => {
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
  let cwSession = null; // { round, total, correctCount, allWordsPlayed } -- mehrere Rätsel pro Sitzung, EINE Sammel-Nachricht am Ende
  function newCrosswordSession() {
    cwSession = { round: 0, total: 4, allWordsPlayed: [] };
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
  function renderCrossword() {
    const area = document.getElementById("crosswordArea");
    if (!cwState) newCrossword(0);
    const { puzzle } = cwState;
    if (!cwState.activeDir) cwState.activeDir = "across";
    area.innerHTML = `
      <div class="question-card">
        <p class="eyebrow">✏️ KREUZWORTRÄTSEL · RUNDE ${cwSession.round + 1} / ${cwSession.total} · ${puzzle.title}</p>
        <p class="empty-note" style="margin-bottom:10px;">Antippen und tippen — waagerecht oder senkrecht, je nachdem wo du startest. Nochmal auf dieselbe Zelle tippen wechselt die Richtung.</p>
        <div class="cw-grid" style="grid-template-columns: repeat(${puzzle.cols}, 1fr); max-width: ${puzzle.cols * 42}px;">
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
        <div id="cwChallengeBar"></div>
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
          cwSession = null; // naechster Aufruf startet automatisch eine frische Sitzung
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
      document.getElementById("cwFeedback").textContent = fb.textContent;
    });
    document.getElementById("cwNextBtn").addEventListener("click", () => {
      const currentIdx = CROSSWORDS.indexOf(puzzle);
      newCrossword(currentIdx + 1);
      renderCrossword();
    });
  }
  document.querySelector('#learnSubnav [data-sub="sub-crossword"]').addEventListener("click", () => {
    if (!cwState) { newCrosswordSession(); newCrossword(0); }
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

  let historyLevel = "B1";
  function renderKompass() {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const todayHistory = ExerciseData.germanHistoryForToday(`${mm}-${dd}`);
    kompassArea.innerHTML = `
      <div class="wegweiser">
        <a href="#kompass-geschichte" class="wegweiser-item"><span>📜</span>Es war einmal in Deutschland</a>
        <a href="#kompass-redewendungen" class="wegweiser-item"><span>💬</span>Redewendungen</a>
        <a href="#kompass-jugendsprache" class="wegweiser-item"><span>🗣️</span>Umgangssprache &amp; Jugendslang</a>
        <a href="#kompass-partikeln" class="wegweiser-item"><span>✨</span>Kleine Wörter, große Wirkung</a>
      </div>

      <h3 id="kompass-geschichte" class="kompass-heading">📜 Es war einmal in Deutschland …</h3>
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
        </div>
      ` : `
        <div class="question-card" style="margin-bottom:16px;">
          <p class="empty-note">Für den heutigen Tag ist noch kein geprüfter Eintrag hinterlegt — diese Sammlung wächst nach und nach, jeder Eintrag wird vorher recherchiert und geprüft.</p>
        </div>
      `}
      <p class="empty-note" style="margin-bottom:16px;">Eine wachsende, sorgfältig geprüfte Sammlung wichtiger Momente der deutschen Geschichte — jeden Tag ein anderer, wenn ein geprüfter Eintrag für das Datum vorliegt.</p>

      <h3 id="kompass-redewendungen" class="kompass-heading">💬 Redewendungen</h3>
      <p class="empty-note">Eine kleine Auswahl — alle 30 kannst du in „Lernen → Übungen" spielerisch abfragen.</p>
      <div class="kompass-grid">${VocabData.REDEWENDUNGEN_KURZ.map((r) => kompassCard(r.phrase, r.explain, r.example)).join("")}</div>

      <h3 id="kompass-jugendsprache" class="kompass-heading">🗣️ Umgangssprache &amp; Jugendslang</h3>
      <div class="kompass-grid">${VocabData.JUGENDSPRACHE.map((j) => kompassCard(j.word, j.explain, j.example)).join("")}</div>

      <h3 id="kompass-partikeln" class="kompass-heading">✨ Kleine Wörter, große Wirkung</h3>
      <div class="kompass-grid">${VocabData.PARTIKELN.map((p) => kompassCard(p.word, p.explain, p.example, p.syl)).join("")}</div>
    `;
    kompassArea.querySelectorAll(".hist-level-btn").forEach((btn) => {
      btn.addEventListener("click", () => { historyLevel = btn.dataset.histLevel; renderKompass(); });
    });
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
        <div class="material-card">
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
  document.querySelector('#knowledgeSubnav [data-sub="sub-community"]').addEventListener("click", () => {
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
  document.querySelector('#knowledgeSubnav [data-sub="sub-links"]').addEventListener("click", () => renderLinks());

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
        <div class="material-card">
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
  document.querySelector('#knowledgeSubnav [data-sub="sub-tips"]').addEventListener("click", () => renderTips());

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
      "favCountryInput", "extraDreamDestInput", "extraVisitedInput", "extraWhyGermanInput", "extraLangGoalInput", "extraSportInput",
      "favMovieInput", "favSeriesInput", "favSongInput", "extraMusicLinkInput", "extraActorInput", "extraBookInput", "extraArtistInput",
      "favQuoteInput", "extraMottoInput", "poemInput", "extraDreamInput", "extraHappyInput",
      "favFoodInput", "favDrinkInput", "extraColorInput", "extraAnimalInput", "extraSeasonSelect", "extraNumberInput", "extraTalentInput", "extraVacationInput", "extraGenderSymbolSelectTop",
      "extraLikesInput", "extraDislikesInput",
      "birthdayInput", "originSelect",
    ];
    const fieldMap = {
      favCountryInput: "favCountry", extraDreamDestInput: "dreamDestination", extraVisitedInput: "visitedCountries",
      extraWhyGermanInput: "whyGerman", extraLangGoalInput: "langGoal", extraSportInput: "favSport",
      favMovieInput: "favMovie", favSeriesInput: "favSeries", favSongInput: "favSong", extraMusicLinkInput: "musicLink", extraActorInput: "favActor",
      extraBookInput: "favBook", extraArtistInput: "favArtist",
      favQuoteInput: "favQuote", extraMottoInput: "motto", poemInput: "poem", extraDreamInput: "bigDream", extraHappyInput: "whatMakesMeHappy",
      favFoodInput: "favFood", favDrinkInput: "favDrink", extraColorInput: "favColor", extraAnimalInput: "favAnimal", extraSeasonSelect: "favSeason",
      extraNumberInput: "favNumber", extraTalentInput: "talent", extraVacationInput: "favVacation",
      extraLikesInput: "likes", extraDislikesInput: "dislikes",
      birthdayInput: "birthday", originSelect: "origin",
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
          <div class="profile-header-flow">
            ${avatarHtml}
            <h2 style="margin:0 0 4px;">${profile.name}${adminBadge(profile.isAdmin, profile.isOwner, profile.isModerator)}</h2>
            <span class="flow-badge"><button type="button" class="friend-name-btn" id="myFriendsToggle">👥 ${friendCount} ${friendCount === 1 ? "Freund" : "Freunde"}</button></span>
            ${profile.isPremium ? '<span class="flow-badge">✨ Premium</span>' : ""}
            ${originFlag ? `<span class="flow-badge">${originFlag} ${profile.origin}</span>` : ""}
            <span class="flow-badge">${zodiacBadgeHtml(profile.birthday)}</span>
            ${genderBadgeHtml(extra.genderSymbol) ? `<span class="flow-badge">${genderBadgeHtml(extra.genderSymbol)}</span>` : ""}
          </div>
          <div style="clear:both;"></div>
          <div class="modal-friends-list" id="myFriendsList" style="display:none; margin-top:10px;">
            ${myFriends.length ? myFriends.map((f) => `<button type="button" class="friend-list-row" data-view-friend-profile="${f.id}">${tinyAvatar(f)}<span class="name">${f.name}</span>${adminBadge(f.is_admin, f.is_owner, f.is_moderator)}</button>`).join("") : '<p class="empty-note">Noch keine Freunde — oben nach Namen suchen.</p>'}
          </div>
          ${profile.bio ? `<p class="empty-note" style="margin-top:10px;">${profile.bio}</p>` : `<button type="button" class="emoji-toggle-link" id="introPromptBtn" style="margin-top:8px;">✏️ Noch keine Beschreibung — jetzt vorstellen</button>`}
          ${hobbyReadout ? `<p class="eyebrow" style="margin-top:12px;">🎯 Hobbys & Interessen</p><div class="trophy-case" style="margin-top:6px;">${hobbyReadout}</div>` : ""}
          ${renderExtendedSteckbrief(profile, "own")}
          <div class="badge-row">
            ${profile.badges.length ? profile.badges.map((b) => `<div class="badge-chip"><span class="emoji">🏅</span><span>${b}</span></div>`).join("") : '<p class="empty-note">Noch keine Abzeichen — spiel eine Runde in „Lernen"!</p>'}
          </div>
          ${profile.trophies && profile.trophies.length ? `<div class="quiz-actions" style="justify-content:center; gap:18px; margin-top:10px;">
            <span class="empty-note" style="font-size:0.95rem;">🎖️ ${trophyCounts(profile).orden} Orden</span>
            <span class="empty-note" style="font-size:0.95rem;">🏆 ${trophyCounts(profile).pokale} Pokale</span>
          </div>` : ""}
          <p class="eyebrow" style="margin-top:14px;">🦊 Sammelfiguren</p>
          <div class="figure-case">
            ${COLLECTIBLE_FIGURES.map((fig) => {
              const unlocked = isFigureUnlocked(fig, profile);
              return `<div class="figure-slot ${unlocked ? "" : "figure-locked"}" title="${unlocked ? fig.name + " — " + fig.desc : "Gesperrt — " + (fig.unlock.type === "points" ? `ab ${fig.unlock.value} Punkten` : "besonderer Pokal nötig")}">
                <img src="${fig.img}" alt="${fig.name}" loading="lazy" />
                ${unlocked ? "" : '<span class="figure-lock-icon">🔒</span>'}
              </div>`;
            }).join("")}
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
      wireMusicPlayer(area);
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
            <h2>${profile.name}${adminBadge(profile.isAdmin, profile.isOwner, profile.isModerator)}</h2>
            <p class="empty-note">👥 ${friendCount} ${friendCount === 1 ? "Freund" : "Freunde"}${profile.isPremium ? " · ✨ Premium" : ""}</p>
          </div>
          <div class="profile-points"><div class="num">${profile.points}</div><div class="empty-note">Punkte</div></div>
        </div>
        <button type="button" class="emoji-toggle-link" id="previewProfileLink">👁️ Vorschau: So sehen andere dein Profil</button>
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
          <label>Geburtstag (optional — erscheint dann oben in der Leiste)</label>
          <input type="date" id="birthdayInput" value="${profileEditDraft.birthday !== undefined ? profileEditDraft.birthday : (profile.birthday || "")}" />
        </div>
        <div class="form-field">
          <label>Geschlechtssymbol im Profil (optional)</label>
          <select id="extraGenderSymbolSelectTop" class="challenge-select">
            <option value="">Nicht anzeigen</option>
            <option value="maennlich" ${(profileEditDraft.genderSymbol !== undefined ? profileEditDraft.genderSymbol : extra.genderSymbol) === "maennlich" ? "selected" : ""}>♂ männlich</option>
            <option value="weiblich" ${(profileEditDraft.genderSymbol !== undefined ? profileEditDraft.genderSymbol : extra.genderSymbol) === "weiblich" ? "selected" : ""}>♀ weiblich</option>
            <option value="divers" ${(profileEditDraft.genderSymbol !== undefined ? profileEditDraft.genderSymbol : extra.genderSymbol) === "divers" ? "selected" : ""}>⚥ divers</option>
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
            <div class="form-field">
              <label>🎵 Musik-Link (YouTube, optional) — eigene Musik oder ein Lieblingssong zum Anhören</label>
              <input type="text" id="extraMusicLinkInput" maxlength="200" value="${profileEditDraft.musicLink !== undefined ? profileEditDraft.musicLink : (extra.musicLink || "")}" placeholder="https://www.youtube.com/watch?v=…" />
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
          extraWhyGermanInput: "whyGerman", extraLangGoalInput: "langGoal", extraBookInput: "favBook", extraArtistInput: "favArtist",
          extraDreamInput: "bigDream", extraHappyInput: "whatMakesMeHappy", extraNumberInput: "favNumber", extraTalentInput: "talent",
          extraSportInput: "favSport", extraVacationInput: "favVacation", extraGenderSymbolSelectTop: "genderSymbol",
          extraLikesInput: "likes", extraDislikesInput: "dislikes", extraMusicLinkInput: "musicLink",
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
        favNumber: val("extraNumberInput", extra.favNumber),
        talent: val("extraTalentInput", extra.talent),
        favVacation: val("extraVacationInput", extra.favVacation),
        likes: val("extraLikesInput", extra.likes),
        dislikes: val("extraDislikesInput", extra.dislikes),
        musicLink: val("extraMusicLinkInput", extra.musicLink),
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
        });
      });
    }
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
  // Erkennt die YouTube-Video-ID aus verschiedenen üblichen Link-Formaten (watch?v=, youtu.be/,
  // embed/), damit man einfach den Link kopieren kann, den man im Browser sieht.
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
        ${extra.dreamDestination ? `<div class="breakdown-row"><span>✈️ Traumreiseziel</span><span>${extra.dreamDestination}</span></div>` : ""}
        ${extra.visitedCountries ? `<div class="breakdown-row"><span>🧳 Schon bereist</span><span>${extra.visitedCountries}</span></div>` : ""}
        ${extra.whyGerman ? `<div class="breakdown-row"><span>💡 Warum Deutsch?</span><span>${extra.whyGerman}</span></div>` : ""}
        ${extra.langGoal ? `<div class="breakdown-row"><span>🎯 Sprachziel</span><span>${extra.langGoal}</span></div>` : ""}
        ${extra.favSport ? `<div class="breakdown-row"><span>⚽ Lieblingssport</span><span>${extra.favSport}</span></div>` : ""}
      ` },
      { icon: "🎬", label: "Kultur", html: `
        ${favMovie ? `<div class="breakdown-row"><span>🎬 Lieblingsfilm</span><span>${favMovie}</span></div>` : ""}
        ${favSeries ? `<div class="breakdown-row"><span>📺 Lieblingsserie</span><span>${favSeries}</span></div>` : ""}
        ${favSong ? `<div class="breakdown-row"><span>🎵 Lieblingslied</span><span>${favSong}</span></div>` : ""}
        ${musicPlayerHtml(extra.musicLink, viewId)}
        ${extra.favActor ? `<div class="breakdown-row"><span>🎭 Lieblingsschauspieler:in</span><span>${extra.favActor}</span></div>` : ""}
        ${extra.favBook ? `<div class="breakdown-row"><span>📚 Lieblingsbuch</span><span>${extra.favBook}</span></div>` : ""}
        ${extra.favArtist ? `<div class="breakdown-row"><span>🎤 Lieblingsband/Künstler:in</span><span>${extra.favArtist}</span></div>` : ""}
      ` },
      { icon: "💭", label: "Gedanken", html: `
        ${extra.motto ? `<div class="breakdown-row"><span>🌟 Lebensmotto</span><span>${extra.motto}</span></div>` : ""}
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
    // Wichtigste zuerst: echte Pokale (große Meisterleistungen) werden vor den häufigeren Orden
    // gezeigt, damit die vier sichtbaren Kacheln auch wirklich die beeindruckendsten sind.
    const sortedTrophies = [...(p.trophies || [])].sort((a, b) => (trophyKind(b) === "pokal") - (trophyKind(a) === "pokal"));
    const trophies = sortedTrophies.slice(0, 4);
    const trophyOverflow = sortedTrophies.length - trophies.length;

    const box = Core.el("div", { class: "lightbox", onclick: (e) => { if (e.target === box) box.remove(); } },
      Core.el("div", { class: "profile-modal-card", "data-theme": p.theme || "bastelheft" },
        Core.el("button", { class: "lightbox-close", type: "button", onclick: () => box.remove() }, "✕"),
        Core.el("p", { class: "empty-note", style: "text-align:center; margin:-6px 0 4px; letter-spacing:0.02em;" }, `🎨 ${p.name}s Design: ${(THEMES.find((t) => t.id === (p.theme || "bastelheft")) || {}).name || "Bastelheft"}`),
        Core.el("div", { class: "profile-modal-header", html: `${avatarHtml}<h2>${p.name}${adminBadge(p.is_admin, p.is_owner, p.is_moderator)}</h2>` }),
        Core.el("p", { class: "modal-points-line" }, `🎯 ${p.points || 0} Punkte`),
        Core.el("p", { class: "empty-note", style: "text-align:center; margin-top:-4px;" }, lastSeenText(p.last_active, p.online)),
        Core.el("p", { class: "empty-note" }, p.bio || "Noch keine Beschreibung."),
        Core.el("div", { class: "modal-meta-row" },
          Core.el("span", { class: "flow-badge" },
            Core.el("button", { type: "button", class: "friend-name-btn", id: "modalFriendsToggle" }, `👥 ${theirFriends.length} ${theirFriends.length === 1 ? "Freund" : "Freunde"}`)
          ),
          originFlag ? Core.el("span", { class: "flow-badge" }, `${originFlag} ${p.origin}`) : "",
          (zodiacBadgeHtml(p.birthday) + genderBadgeHtml((p.extra_profile_data || {}).genderSymbol)) ? Core.el("span", { class: "flow-badge", html: zodiacBadgeHtml(p.birthday) + genderBadgeHtml((p.extra_profile_data || {}).genderSymbol) }) : ""
        ),
        Core.el("div", { class: "modal-friends-list", id: "modalFriendsList", style: "display:none;" },
          theirFriends.length
            ? theirFriends.map((f) => Core.el("button", {
                type: "button", class: "friend-list-row", onclick: () => { box.remove(); openProfileModal(f.id); },
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
        Core.el("div", { class: "trophy-case trophy-case-compact", id: "modalTrophyCase", style: "justify-content:center; margin-top:10px;",
          html: trophies.map((t) => `<div class="trophy-chip"><span class="emoji">🏆</span><span>${t}</span></div>`).join("")
              + (p.badges && p.badges.length ? p.badges.slice(0, 3).map((b) => `<div class="trophy-chip"><span class="emoji">🏅</span><span>${b}</span></div>`).join("") : "")
              + (trophyOverflow > 0 ? `<button type="button" class="trophy-chip trophy-chip-more" id="modalTrophyMoreBtn">+${trophyOverflow} mehr anzeigen</button>` : "") }),
        trophyOverflow > 0 ? Core.el("div", { class: "trophy-more-list", id: "modalTrophyMoreList", style: "display:none;",
          html: sortedTrophies.slice(4).map((t) => `<div class="trophy-chip"><span class="emoji">🏆</span><span>${t}</span></div>`).join("") }) : "",
        COLLECTIBLE_FIGURES.some((fig) => isFigureUnlocked(fig, p))
          ? Core.el("div", { html: '<p class="eyebrow" style="text-align:center; margin-top:12px;">🦊 Sammelfiguren</p>' })
          : "",
        COLLECTIBLE_FIGURES.some((fig) => isFigureUnlocked(fig, p))
          ? Core.el("div", { class: "figure-case", style: "justify-content:center;",
              html: COLLECTIBLE_FIGURES.filter((fig) => isFigureUnlocked(fig, p)).map((fig) =>
                `<div class="figure-slot" title="${fig.name} — ${fig.desc}"><img src="${fig.img}" alt="${fig.name}" loading="lazy" /></div>`
              ).join("") })
          : "",
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
    wireMusicPlayer(box);
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

  loginBtn.addEventListener("click", () => {
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
  };
  function renderStickerRow() {
    const row = document.getElementById("inboxStickerRow");
    if (!row) return;
    row.innerHTML = Object.entries(DMA_STICKERS).map(([key, svg]) =>
      `<button type="button" class="hobby-chip sticker-pick-btn" data-sticker="${key}" style="padding:4px 8px;">${svg}</button>`
    ).join("");
    let selected = null;
    row.querySelectorAll("[data-sticker]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.sticker;
        selected = selected === key ? null : key;
        row.querySelectorAll("[data-sticker]").forEach((b) => b.classList.toggle("selected", b.dataset.sticker === selected));
        row.dataset.selectedSticker = selected || "";
      });
    });
  }

  let inboxViewTab = "in"; // "in" oder "out"
  const communityTextLevelChoice = {}; // { textId: "A1" | "A2" | ... } — welches Niveau gerade angezeigt wird, bei Texten mit "Alle Niveaus"
  function getImportantMsgIds() {
    try { return JSON.parse(localStorage.getItem("dma_important_msgs") || "[]"); } catch (e) { return []; }
  }
  function toggleImportantMsg(id) {
    const ids = new Set(getImportantMsgIds());
    if (ids.has(id)) ids.delete(id); else ids.add(id);
    try { localStorage.setItem("dma_important_msgs", JSON.stringify([...ids])); } catch (e) {}
  }
  function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function renderInbox() {
    const area = document.getElementById("inboxArea");
    if (!Backend.currentUser()) { area.innerHTML = '<p class="empty-note">Bitte zuerst anmelden.</p>'; return; }
    const [messages, friends] = await Promise.all([Backend.getMyMessages(), Backend.getFriends()]);
    const isAdmin = Backend.canModerate ? Backend.canModerate() : false;
    const list = inboxViewTab === "in" ? messages.inbox : inboxViewTab === "out" ? messages.outbox : [...messages.inbox, ...messages.outbox].filter((m) => getImportantMsgIds().includes(m.id));
    area.innerHTML = `
      <div class="question-card">
        <h3>✉️ Neue Nachricht schreiben</h3>
        <div class="form-field">
          <label class="empty-note" style="display:block; margin-bottom:6px;">An wen? (mehrere gleichzeitig möglich)</label>
          <div class="challenge-friend-list" id="inboxRecipientPills">
            ${friends.map((f) => `<button type="button" class="challenge-friend-pill" data-recipient-id="${f.id}">${f.name}</button>`).join("")}
          </div>
          ${isAdmin ? `<label style="display:flex; align-items:center; gap:6px; margin-top:8px; cursor:pointer;"><input type="checkbox" id="inboxBroadcastCheck" /> <span class="empty-note">📢 Rundmail an ALLE Nutzer (statt einzelner Auswahl)</span></label>` : ""}
        </div>
        <div class="form-field">
          <textarea id="inboxMessageInput" class="guestbook-form-textarea" maxlength="500" placeholder="Deine Nachricht…"></textarea>
        </div>
        <div class="form-field">
          <label class="empty-note" style="cursor:pointer;">📷 Bild anhängen (optional) <input type="file" id="inboxImageInput" accept="image/*" style="display:block; margin-top:4px;" /></label>
          <div id="inboxImagePreviewBox"></div>
        </div>
        <div class="form-field">
          <label class="empty-note">Eigene Sticker anhängen (optional):</label>
          <div id="inboxStickerRow" style="display:flex; gap:8px; margin-top:6px; flex-wrap:wrap;"></div>
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
        ${list.length ? list.map((m) => `
          <div class="breakdown-row" data-msg-row="${m.id}" style="align-items:flex-start; flex-direction:column; gap:4px; ${inboxViewTab === "in" && !m.read ? "border-left:3px solid var(--amber-400); padding-left:10px;" : ""}">
            <div style="display:flex; justify-content:space-between; width:100%;">
              <strong>${inboxViewTab === "out" ? "An: " + (m.to_user_name || "Freund") : (m.is_system ? "🔔 System" : (m.author_name || "Unbekannt"))}</strong>
              <span class="empty-note">${m.created_at ? new Date(m.created_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : ""}</span>
            </div>
            <p style="white-space:pre-wrap; margin:0;">${m.body.replace(/\[sticker:(\w+)\]/, (_, key) => DMA_STICKERS[key] ? `<span style="display:inline-block; vertical-align:middle;">${DMA_STICKERS[key]}</span>` : "")}</p>
            ${m.image_url ? `<img src="${m.image_url}" style="max-width:200px; border-radius:10px; margin-top:4px; cursor:pointer;" data-modal-view-photo="${m.image_url}" />` : ""}
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              ${inboxViewTab === "in" && !m.is_system && m.from_user ? `<button type="button" class="btn btn-ghost" style="padding:4px 12px; font-size:0.78rem; margin-top:2px;" data-reply-to="${m.from_user}" data-reply-name="${m.author_name}">↩️ Antworten</button>` : ""}
              <button type="button" class="btn btn-ghost" style="padding:4px 12px; font-size:0.78rem; margin-top:2px;" data-toggle-important="${m.id}">${getImportantMsgIds().includes(m.id) ? "⭐ Wichtig" : "☆ Als wichtig markieren"}</button>
              <button type="button" class="btn btn-ghost" style="padding:4px 12px; font-size:0.78rem; margin-top:2px;" data-download-msg="${m.id}">⬇️ Text</button>
              <button type="button" class="btn btn-ghost" style="padding:4px 12px; font-size:0.78rem; margin-top:2px;" data-delete-msg="${m.id}" data-is-sender="${inboxViewTab === "out"}">🗑️ Löschen</button>
            </div>
          </div>`).join("") : `<p class="empty-note">${inboxViewTab === "important" ? "Noch keine Nachrichten als wichtig markiert." : inboxViewTab === "in" ? "Noch keine Nachrichten — hier erscheinen auch automatische Zusammenfassungen, nachdem du eine Übungsrunde gespielt hast." : "Du hast noch nichts verschickt."}</p>`}
      </div>
    `;
    renderStickerRow();
    let selectedRecipients = new Set();
    // Entwurf wiederherstellen, falls beim letzten Mal etwas Angefangenes da war
    try {
      const draft = JSON.parse(localStorage.getItem("dma_msg_draft") || "null");
      if (draft) {
        if (Array.isArray(draft.to)) selectedRecipients = new Set(draft.to);
        else if (draft.to) selectedRecipients = new Set([draft.to]); // alte Entwürfe (nur eine Person) weiterhin lesbar
        if (draft.body) document.getElementById("inboxMessageInput").value = draft.body;
      }
    } catch (e) {}
    const refreshRecipientPills = () => {
      area.querySelectorAll("[data-recipient-id]").forEach((btn) => {
        btn.classList.toggle("selected", selectedRecipients.has(btn.dataset.recipientId));
      });
    };
    refreshRecipientPills();
    const draftSave = () => {
      try {
        const to = [...selectedRecipients];
        const body = document.getElementById("inboxMessageInput").value;
        if (to.length || body) localStorage.setItem("dma_msg_draft", JSON.stringify({ to, body }));
        else localStorage.removeItem("dma_msg_draft");
      } catch (e) {}
    };
    area.querySelectorAll("[data-recipient-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.recipientId;
        if (selectedRecipients.has(id)) selectedRecipients.delete(id); else selectedRecipients.add(id);
        refreshRecipientPills();
        draftSave();
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
    document.getElementById("inboxSendBtn").addEventListener("click", async () => {
      const broadcastCheck = document.getElementById("inboxBroadcastCheck");
      const isBroadcast = broadcastCheck && broadcastCheck.checked;
      const body = document.getElementById("inboxMessageInput").value;
      const errBox = document.getElementById("inboxSendError");
      if (!isBroadcast && selectedRecipients.size === 0) { errBox.textContent = "⚠️ Bitte mindestens eine Person auswählen."; return; }
      try {
        const stickerKey = document.getElementById("inboxStickerRow")?.dataset.selectedSticker || "";
        const finalBody = body + (stickerKey ? ` [sticker:${stickerKey}]` : "");
        if (isBroadcast) {
          if (!confirm("Wirklich eine Rundmail an ALLE Nutzer schicken?")) return;
          await Backend.sendBroadcastMessage(finalBody);
        } else {
          // An alle ausgewählten Personen gleichzeitig verschicken -- dieselbe Nachricht, jeweils
          // als eigene, echte Nachricht an jede Person (nicht nur eine Kopie sichtbar für alle).
          await Promise.all([...selectedRecipients].map((id) => Backend.sendPrivateMessage(id, finalBody, pendingImageUrl)));
        }
        renderInbox();
        try { localStorage.removeItem("dma_msg_draft"); } catch (e) {}
      } catch (err) {
        errBox.textContent = "⚠️ " + err.message;
      }
    });
    area.querySelectorAll("[data-reply-to]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.replyTo;
        const pillBtn = area.querySelector(`[data-recipient-id="${targetId}"]`);
        if (pillBtn) { selectedRecipients = new Set([targetId]); refreshRecipientPills(); }
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
    area.querySelectorAll("[data-toggle-important]").forEach((btn) => {
      btn.addEventListener("click", () => { toggleImportantMsg(btn.dataset.toggleImportant); renderInbox(); });
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
    area.querySelectorAll("[data-decline]").forEach((btn) => {
      btn.addEventListener("click", async () => { await Backend.declineFriendRequest(btn.dataset.decline); checkNotifications(); renderFriends(); });
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
            newWordbuildSession(); newWordbuildRound(); renderWordbuild();
          },
          buchstabensalat: () => {
            document.querySelector('#learnSubnav [data-sub="sub-wordsearch"]').click();
            newWordSearchSession(); wsState = buildWordSearch(); renderWordSearch();
          },
          kreuzwortraetsel: () => {
            document.querySelector('#learnSubnav [data-sub="sub-crossword"]').click();
            newCrossword(0); renderCrossword();
          },
          betonungstrainer: () => {
            document.querySelector('#learnSubnav [data-sub="sub-stresstrainer"]').click();
            newStressTrainerSession(); pickStressTrainerWord(); renderStressTrainer();
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

  let rankingMode = "today"; // "today" oder "alltime"
  async function renderRanking() {
    const area = document.getElementById("rankingArea");
    area.innerHTML = '<p class="empty-note">Lade Ranking…</p>';
    const rows = rankingMode === "today" ? await Backend.getRankingToday() : await Backend.getRankingAllTime();
    area.innerHTML = `
      <div class="question-card">
        <h3>🏆 Ranking</h3>
        <div class="order-toggle" style="margin-bottom:12px;">
          <button type="button" class="order-pill" id="rankTabToday" aria-selected="${rankingMode === "today"}">📅 Heute</button>
          <button type="button" class="order-pill" id="rankTabAllTime" aria-selected="${rankingMode === "alltime"}">🏆 Gesamt</button>
        </div>
        <table class="rank-table">
          ${rows.length ? rows.map((r, i) => `<tr>${r.user_id ? `<td>${i + 1}.</td><td><button type="button" class="friend-name-btn" data-view-ranked="${r.user_id}">${r.name}</button></td>` : `<td>${i + 1}.</td><td>${r.name}</td>`}<td>${r.points} Pkt.</td></tr>`).join("") : `<tr><td class="empty-note">${rankingMode === "today" ? "Noch keine Einträge heute — sei die/der Erste!" : "Noch keine Einträge."}</td></tr>`}
        </table>
      </div>
    `;
    document.getElementById("rankTabToday").addEventListener("click", () => { rankingMode = "today"; renderRanking(); });
    document.getElementById("rankTabAllTime").addEventListener("click", () => { rankingMode = "alltime"; renderRanking(); });
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
      if (pill.dataset.sub === "sub-settings") renderSettings();
      if (pill.dataset.sub === "sub-inbox") renderInbox();
    });
  });

  // Beim Start: gespeichertes Theme des eingeloggten Profils anwenden, sonst Standard behalten
  applyTheme((Backend.currentProfile() && Backend.currentProfile().theme) || sessionTheme);

  // Falls Supabase verbunden ist: bestehende Anmeldung (Session) wiederherstellen
  Backend.restoreSession().then(() => {
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
  const APP_VERSION = "22";
  const APP_CHANGELOG = {
    "21": "🎉 Neu: privates Postfach (mit Antworten & Bildern), mehrseitiger Steckbrief mit viel mehr Eintragsmöglichkeiten, neue Übung 'Lückentext-Geschichten', schwimmende Fische zeigen jetzt in die richtige Richtung, und ein paar hartnäckige Fehler beim Freischalten wurden behoben.",
  };
  function notifyAboutAppUpdateIfNeeded() {
    if (!Backend.currentUser()) return;
    let seenVersion = null;
    try { seenVersion = localStorage.getItem("dma_seen_version"); } catch (e) {}
    if (seenVersion === APP_VERSION) return;
    const note = APP_CHANGELOG[APP_VERSION];
    if (!note) return;
    const messageText = `🆕 Was ist neu (Version ${APP_VERSION}):\n\n${note}`;
    // Zweite Absicherung UNABHÄNGIG von localStorage: falls das Speichern der "gesehen"-Markierung
    // aus irgendeinem Grund fehlschlägt (z. B. eingeschränkter Browser-Speicher), verhindert diese
    // zusätzliche Prüfung trotzdem, dass dieselbe Nachricht bei jedem Neuladen erneut verschickt
    // wird — sie schaut einfach nach, ob genau dieser Text schon im Postfach liegt.
    Backend.getMyMessages().then((messages) => {
      const alreadySent = messages.inbox.some((m) => m.body === messageText);
      if (!alreadySent) Backend.sendSystemMessage(Backend.currentUser().id, messageText);
      try { localStorage.setItem("dma_seen_version", APP_VERSION); } catch (e) {}
    });
  }

  // Online-Status: alle 60s "zuletzt aktiv" aktualisieren, solange eingeloggt
  setInterval(() => { if (Backend.currentUser()) Backend.touchActivity(); }, 60000);
})();
