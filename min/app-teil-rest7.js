dmaTeilPasst("c4e7f910c707"),UNTERRICHT_ZULETZT="dma_unterricht_glocke",PREMIUM_BEDARF=24,PREMIUM_JAHR=20,PREMIUM_MONAT=2,KOSTEN_KURS=.92,KOSTEN_EINTRAEGE=36199,KOSTEN_ZEICHEN=157e4,BR_FRISUR_M=["kurz","locken","bart_kurz","pony"],BR_FRISUR_W=["lang","zopf","dutt","locken","kurz","pony"],BR_HAAR=["schwarz","dunkelbraun","braun","blond","rot","grau"],BR_HAUT=["sehrhell","hell","mittel","oliv","dunkel","sehrdunkel"],BR_FARBEN=["rot","blau","gruen","gelb","schwarz","weiss","grau","braun"],BR_SCHUHE=["halbschuh","turnschuh","stiefel"],BR_UNTERTEIL_M=["jeans","hose"],BR_UNTERTEIL_W=["jeans","hose","rock"],BR_OBERTEIL_M=["tshirt","hemd","pullover"],BR_OBERTEIL_W=["tshirt","hemd","pullover","bluse"],BR_FIGUREN=["erwachsen-w","erwachsen-m","jugendlich-w","jugendlich-m","alt-w","alt-m","kind-w","kind-m"],BR_PRAEP_TAUSCH={in:"neben",an:"hinter",auf:"neben",vor:"hinter"},BR_ZUSAMMEN_AKK={"in-n":"ins","an-n":"ans","auf-n":"aufs","vor-n":"vors"},BR_ZUSAMMEN_DAT={"in-m":"im","in-n":"im","an-m":"am","an-n":"am"},BR_AKKUSATIV={m:"den",f:"die",n:"das"},BR_DATIV={m:"dem",f:"der",n:"dem"},BR_RUNDEN=8,HALL_OF_FAME_PLACEHOLDER_SVG=`<svg class="site-banner-svg" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="hofGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e8825f"/><stop offset="100%" stop-color="#f2b84b"/>
    </linearGradient></defs>
    <rect width="400" height="120" fill="url(#hofGrad)"/>
    <circle cx="60" cy="60" r="38" fill="rgba(255,255,255,0.14)"/>
    <circle cx="340" cy="30" r="22" fill="rgba(255,255,255,0.12)"/>
    <text x="200" y="55" text-anchor="middle" font-size="30" font-family="sans-serif">🏆</text>
    <text x="200" y="90" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="sans-serif">Hall of Fame</text>
  </svg>`,SPIEL_ZU_WORTQUELLE={betonungstrainer:"stresstrainer",silbenturm:"silbenturm",flussfuchs:"flussfuchs",setzerei:"setzerei",wortkette:"wortkette",augenblick:"augenblick",wortbaustelle:"wordbuild",meinesaetze:"meinesaetze"},dmaTeilImpl[1663]=async function(){const e=document.getElementById("friendsArea");if(!Backend.currentUser()){e.innerHTML='<p class="empty-note">Melde dich im Reiter „Profil" an, um Freunde zu finden und herauszufordern.</p>';return}e.innerHTML='<p class="empty-note">Lade …</p>';const[t,a,l]=await Promise.all([Backend.getFriends(),Backend.getIncomingRequests(),Backend.getMyChallenges()]),s=challengesFuerRaum(l.incoming),c=challengesFuerRaum(l.incomingAlle||l.incoming),r=c.filter(i=>i.abgelaufen),d=challengesFuerRaum(l.outgoing);herausforderungenMerken(s),e.innerHTML=`
      <div class="question-card">
        <h3>🔎 Freunde finden</h3>
        <div class="vocab-toolbar" style="margin-top:10px;">
          <input type="text" class="vocab-search" id="friendSearch" placeholder="Name eingeben…" />
        </div>
        <div id="friendSearchResults"></div>
        <p class="empty-note" style="margin-top:8px;">${Backend.isConfigured?"Suche findet alle registrierten Nutzer.":"Demo-Modus: Suche findet nur Konten, die in dieser Sitzung schon registriert wurden."}</p>
      </div>
      <div class="question-card" style="margin-top:14px; border:2px solid var(--amber-400);">
        <h3>🔗 Freund:innen einladen</h3>
        <p class="empty-note" style="margin-bottom:10px;">Teil deinen persönlichen Link — meldet sich jemand darüber an, bekommt ihr <strong>beide 25 Bonuspunkte</strong>.</p>
        <button type="button" class="btn btn-coffee" id="friendsShareBtn">🔗 Meinen Empfehlungs-Link teilen</button>
      </div>

      ${a.length?`<div class="question-card" style="margin-top:14px;">
        <h3>📥 Freundschaftsanfragen</h3>
        ${a.map(i=>`<div class="breakdown-row"><span>${i.name}</span><div style="display:flex; gap:6px;"><button type="button" class="btn btn-coffee" data-accept="${i.id}">Annehmen</button><button type="button" class="btn btn-ghost" data-decline="${i.id}">Ablehnen</button></div></div>`).join("")}
      </div>`:""}

      ${c.length?`<div class="question-card" style="margin-top:14px;">
        <h3>🎮 Herausforderungen an dich</h3>
        ${c.map(i=>{const o={memory:"🧠 Gehirnjogger",wortbaustelle:"🔤 Wortbaustelle",buchstabensalat:"🔍 Buchstabensalat",kreuzwortraetsel:"✏️ Kreuzworträtsel",betonungstrainer:"🎯 Betonungs-Trainer"}[i.categories[0]]||i.categories.map(k=>ExerciseData.activeGetCategory(k)?.icon||"❓").join(" "),g=i.extra&&i.extra.wortliste,f=i.status==="pending"&&!i.toResult&&!i.abgelaufen,w=i.abgelaufen?`⌛ Abgelaufen — seit über ${Backend.challengeFristTage?Backend.challengeFristTage():14} Tagen keine Antwort`:i.status==="completed"?"✔ Beendet":i.toResult?"▶ Du hast gespielt — es fehlt noch das Ergebnis des Gegenübers":"⏳ Offen";return`<div class="breakdown-row${i.abgelaufen?" duell-abgelaufen":""}" style="flex-wrap:wrap; gap:6px;" data-challenge-row="${i.id}">
            <span>${i.fromName} · ${o}${g?`<span class="empty-note" style="display:block; font-size:0.72rem;">📋 mit der Liste „${g.name}“ — ${g.woerter.length} Wörter</span>`:""}<span class="empty-note" style="display:block; font-size:0.72rem;">${w}</span></span>
            <span style="display:flex; gap:6px; flex-wrap:wrap;">
              ${f?`<button type="button" class="btn btn-coffee" data-accept-challenge="${i.id}" data-cats="${i.categories.join(",")}" data-from-name="${i.fromName}">Annehmen</button>`:""}
              <button type="button" class="btn btn-ghost" data-remove-challenge="${i.id}" data-remove-name="${i.fromName}">🗑️ Entfernen</button>
            </span></div>`}).join("")}
        ${r.length?`<button type="button" class="btn btn-ghost" id="removeExpiredChallengesBtn" style="margin-top:10px;">🧹 Alle abgelaufenen entfernen (${r.length})</button>`:""}
        <p class="empty-note" style="margin-top:8px; font-size:0.72rem;">Entfernen betrifft nur, was du BEKOMMEN hast. Deine eigenen, noch wartenden Herausforderungen stehen weiter unten unter „Deine Duelle" und bleiben unangetastet.</p>
      </div>`:""}

      <div class="question-card" style="margin-top:14px;">
        <h3>👥 Deine Freunde <span class="empty-note" style="font-weight:400; font-size:0.78rem;">(${t.length})</span></h3>
        ${t.length>8?`
        <div class="order-toggle" style="margin-bottom:12px; flex-wrap:wrap;">
          <button type="button" class="order-pill friend-filter-pill" data-filter="all" aria-selected="${friendFilterMode==="all"}">Alle</button>
          <button type="button" class="order-pill friend-filter-pill" data-filter="online" aria-selected="${friendFilterMode==="online"}">🟢 Online</button>
          <button type="button" class="order-pill friend-filter-pill" data-filter="best" aria-selected="${friendFilterMode==="best"}">⭐ Beste Freunde</button>
        </div>`:""}
        ${(()=>{const i=Backend.getBestFriendIds(),u=t.filter(o=>friendFilterMode==="online"?o.online:friendFilterMode==="best"?i.includes(o.id):!0);return u.length?u.map(o=>`
          <div class="breakdown-row">
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" class="friend-bulk-check" data-bulk-friend="${o.id}" data-bulk-name="${o.name}" />
              <button type="button" class="best-friend-star-btn" data-toggle-best="${o.id}" title="Als beste:r Freund:in markieren" style="background:none; border:none; cursor:pointer; font-size:1rem; padding:0 2px;">${i.includes(o.id)?"⭐":"☆"}</button>
              <div>
                <button type="button" class="friend-name-btn" data-view-friend-profile="${o.id}">${o.online?'<span class="online-dot"></span>':""}${o.name} · ${o.points} Pkt.${adminBadge(o.is_admin,o.is_owner,o.is_moderator)}</button>
                <div class="empty-note" style="font-size:0.72rem; margin-top:2px;">${lastSeenText(o.last_active,o.online)}</div>
              </div>
            </div>
            <button type="button" class="btn btn-ghost" data-challenge="${o.id}" data-name="${o.name}">🎮 Herausfordern</button>
          </div>`).join(""):`<p class="empty-note">${friendFilterMode==="online"?"Gerade niemand online.":friendFilterMode==="best"?"Noch keine besten Freunde markiert — Stern antippen.":"Noch keine Freunde — oben nach Namen suchen."}</p>`})()}
        ${t.length?'<button type="button" class="btn btn-coffee" id="bulkChallengeBtn" style="margin-top:10px; display:none;">🎮 Ausgewählte herausfordern</button>':""}
      </div>

      ${d.length?`<div class="question-card" style="margin-top:14px;">
        <h3>📤 Deine Duelle</h3>
        ${d.map(i=>`<div class="breakdown-row">
          <span>${i.status!=="completed"?`<input type="checkbox" class="cancel-challenge-check" data-cancel-id="${i.id}" style="margin-right:8px;" />`:""}vs. ${i.toName}</span>
          <span class="empty-note">${i.status==="completed"?i.winner?i.winner===i.from?"🏆 Gewonnen":"Verloren":"🤝 Unentschieden":i.status==="entfernt"?"🚫 Vom Gegenüber entfernt":i.abgelaufen?"⌛ Abgelaufen — keine Antwort":"Warte auf Gegner…"}</span>
        </div>`).join("")}
        ${d.some(i=>i.status!=="completed")?'<button type="button" class="btn btn-ghost" id="cancelSelectedChallengesBtn" style="margin-top:10px;">Ausgewählte zurückrufen</button>':""}
      </div>`:""}

      <div id="challengePicker"></div>
    `;const h=document.getElementById("cancelSelectedChallengesBtn");h&&h.addEventListener("click",async()=>{const i=[...e.querySelectorAll(".cancel-challenge-check:checked")].map(o=>o.dataset.cancelId);if(!i.length){alert("Bitte mindestens ein Duell auswählen.");return}if(!confirm(`${i.length} ${i.length===1?"Herausforderung":"Herausforderungen"} wirklich zurückrufen?`))return;const u=window.scrollY;for(const o of i)try{await Backend.cancelChallenge(o)}catch(g){console.warn(g)}await renderFriends(),window.scrollTo(0,u)}),e.querySelectorAll("[data-remove-challenge]").forEach(i=>{i.addEventListener("click",async()=>{const u=i.dataset.removeChallenge,o=i.dataset.removeName||"dieser Person";if(!confirm(`Herausforderung von ${o} wirklich entfernen?

Sie verschwindet aus deiner Liste und meldet sich nicht mehr. Deine eigenen, noch wartenden Herausforderungen bleiben davon unberührt.`))return;const g=window.scrollY;i.disabled=!0;try{await Backend.entferneEmpfangeneChallenge(u)}catch(f){i.disabled=!1,alert(f.message||"Die Herausforderung konnte nicht entfernt werden.");return}herausforderungVergessen(u),await checkNotifications(),await renderFriends(),window.scrollTo(0,g)})}),document.getElementById("removeExpiredChallengesBtn")?.addEventListener("click",async()=>{const i=r.length;if(!confirm(`${i} abgelaufene ${i===1?"Herausforderung":"Herausforderungen"} entfernen?

Das sind die, auf die seit über ${Backend.challengeFristTage?Backend.challengeFristTage():14} Tagen niemand reagiert hat. Nur Empfangenes wird weggeräumt.`))return;const u=window.scrollY;r.forEach(g=>herausforderungVergessen(g.id));let o=0;try{o=await Backend.entferneAbgelaufeneChallenges()}catch(g){console.warn(g)}await checkNotifications(),await renderFriends(),window.scrollTo(0,u),o&&showToast(`🧹 ${o} abgelaufene ${o===1?"Herausforderung":"Herausforderungen"} entfernt.`)}),document.getElementById("friendsShareBtn")?.addEventListener("click",shareReferralLink);let m=null;document.getElementById("friendSearch").addEventListener("input",i=>{clearTimeout(m);const u=i.target.value;m=setTimeout(async()=>{const o=await Backend.searchUsers(u);document.getElementById("friendSearchResults").innerHTML=o.length?o.map(g=>`<div class="breakdown-row"><button type="button" class="friend-name-btn" data-view-search-result="${g.id}">${g.name}</button><button type="button" class="btn btn-ghost" data-add="${g.id}">+ Freund werden</button></div>`).join(""):u.trim()?'<p class="empty-note">Niemand gefunden.</p>':"",e.querySelectorAll("[data-add]").forEach(g=>{g.addEventListener("click",async()=>{try{await Backend.sendFriendRequest(g.dataset.add),g.textContent="Angefragt ✓",g.disabled=!0}catch(f){alert(f.message)}})}),e.querySelectorAll("[data-view-search-result]").forEach(g=>{g.addEventListener("click",()=>openProfileModal(g.dataset.viewSearchResult))})},250)}),e.querySelectorAll("[data-accept]").forEach(i=>{i.addEventListener("click",async()=>{await Backend.acceptFriendRequest(i.dataset.accept);try{const u=await Backend.getFriends();await Backend.updateExtraProfileField("friendsCountCache",u.length)}catch(u){console.warn("Freundeszahl-Cache konnte nicht aktualisiert werden:",u)}checkNotifications(),renderFriends()})}),e.querySelectorAll("[data-decline]").forEach(i=>{i.addEventListener("click",async()=>{await Backend.declineFriendRequest(i.dataset.decline),checkNotifications(),renderFriends()})}),e.querySelectorAll(".friend-filter-pill").forEach(i=>{i.addEventListener("click",async()=>{const u=e.getBoundingClientRect().top;friendFilterMode=i.dataset.filter,await renderFriends();const o=document.getElementById("friendsArea");if(o){const g=o.getBoundingClientRect().top;window.scrollBy(0,g-u)}})}),e.querySelectorAll("[data-toggle-best]").forEach(i=>{i.addEventListener("click",async()=>{await Backend.toggleBestFriend(i.dataset.toggleBest),renderFriends()})}),e.querySelectorAll("[data-view-friend-profile]").forEach(i=>{i.addEventListener("click",()=>openProfileModal(i.dataset.viewFriendProfile))}),e.querySelectorAll("[data-challenge]").forEach(i=>{i.addEventListener("click",()=>{selectedChallengeFriendIds.clear(),selectedChallengeFriendIds.add(i.dataset.challenge),activateTab("view-learn"),document.querySelector('#learnSubnav [data-sub="sub-exercises"]').click()})});const p=e.querySelectorAll(".friend-bulk-check"),b=document.getElementById("bulkChallengeBtn");function y(){const i=[...p].filter(u=>u.checked);b&&(b.style.display=i.length?"inline-flex":"none",b.textContent=`🎮 Ausgewählte herausfordern (${i.length})`)}p.forEach(i=>i.addEventListener("change",y)),b&&b.addEventListener("click",()=>{const i=[...p].filter(u=>u.checked);i.length&&(selectedChallengeFriendIds.clear(),i.forEach(u=>selectedChallengeFriendIds.add(u.dataset.bulkFriend)),activateTab("view-learn"),document.querySelector('#learnSubnav [data-sub="sub-exercises"]').click())}),e.querySelectorAll("[data-accept-challenge]").forEach(i=>{i.addEventListener("click",()=>{const u=i.dataset.cats.split(","),o=i.dataset.acceptChallenge;checkNotifications(),geliehenAlleWeg();const g=herausforderungListe(o);if(g){const k=SPIEL_ZU_WORTQUELLE[u[0]]||u[0];geliehenSetzen(k,g),showToast(`📋 Ihr spielt beide mit „${g.name}“ — ${g.woerter.length} Wörter.`)}const f={memory:()=>{document.querySelector('#learnSubnav [data-sub="sub-memory"]').click(),activeMemoryChallengeId=o,activeMemoryOpponentName=i.dataset.fromName||"",newMemoryGame()},wortbaustelle:()=>{document.querySelector('#learnSubnav [data-sub="sub-wordbuild"]').click(),activeGameChallengeId=o,newWordbuildSession(),newWordbuildRound(),renderWordbuild()},buchstabensalat:()=>{document.querySelector('#learnSubnav [data-sub="sub-wordsearch"]').click(),activeGameChallengeId=o,newWordSearchSession(),wsState=buildWordSearch(),renderWordSearch()},kreuzwortraetsel:()=>{document.querySelector('#learnSubnav [data-sub="sub-crossword"]').click(),activeGameChallengeId=o},betonungstrainer:()=>{document.querySelector('#learnSubnav [data-sub="sub-stresstrainer"]').click(),activeGameChallengeId=o,newStressTrainerSession(),pickStressTrainerWord(),renderStressTrainer()},satzpuzzle:()=>{document.querySelector('#learnSubnav [data-sub="sub-satzpuzzle"]').click(),activeGameChallengeId=o,newSatzpuzzleSession(),newSatzpuzzleRound(),renderSatzpuzzle()},wackelturm:()=>{document.querySelector('#learnSubnav [data-sub="sub-wackelturm"]').click(),activeGameChallengeId=o,newWackelturmGame(),renderWackelturm()},wortarten:()=>{document.querySelector('#learnSubnav [data-sub="sub-wortarten"]').click(),activeGameChallengeId=o,newWortartenSession(),newWortartenRound(),renderWortarten()},wortkanone:()=>{document.querySelector('#learnSubnav [data-sub="sub-kanone"]').click(),activeGameChallengeId=o,newKanoneGame(),renderKanone()},werbinich:()=>{document.querySelector('#learnSubnav [data-sub="sub-werbinich"]').click(),activeGameChallengeId=o,newWerBinIchRound(),renderWerBinIch()}};if(activateTab("view-learn"),f[u[0]]){f[u[0]]();return}const w=SPIEL_ZU_REITER[u[0]];if(w){const k=document.querySelector(`#learnSubnav [data-sub="${w}"]`);if(k){activeGameChallengeId=o,k.click(),showToast("🎮 Viel Erfolg — dein Ergebnis wird für das Duell gezählt.");return}}document.querySelector('#learnSubnav [data-sub="sub-exercises"]').click(),Quiz.startSession(u,"leicht",{challengeId:o}),showToast(`🦊 Willkommen, ${personaForCategory(u[0])}!`),renderQuestion()})})},dmaTeilImpl[1664]=function(){const e=document.getElementById("challengePicker");if(!friendChallengeTarget){e.innerHTML="";return}e.innerHTML=`
      <div class="question-card" style="margin-top:14px;">
        <h3>🎮 ${friendChallengeTarget.name} herausfordern</h3>
        <p class="empty-note">Wähle eine Kategorie — ihr spielt beide 10 Fragen, wer mehr Prozent holt, gewinnt.</p>
        <div class="category-grid" style="margin-top:10px;">
          ${ExerciseData.activeCategories().filter(t=>isUnlocked(t.unlock,Backend.currentProfile())).map(t=>`<div class="category-card" data-pick-cat="${t.id}"><div class="cat-checkbox"></div><div class="cat-body"><div class="cat-title-row"><span class="cat-icon">${t.icon}</span><span>${t.title}</span></div></div></div>`).join("")}
        </div>
        <p class="empty-note" style="margin-top:8px;">Nur Kategorien, die du selbst schon freigeschaltet hast, kannst du auch für ein Duell auswählen.</p>
      </div>
    `;let n=!1;e.querySelectorAll("[data-pick-cat]").forEach(t=>{t.addEventListener("click",async()=>{if(n)return;n=!0;const a=t.dataset.pickCat;try{const l=await challengeErstellen(friendChallengeTarget.id,[a]);friendChallengeTarget=null,activateTab("view-learn"),document.querySelector('#learnSubnav [data-sub="sub-exercises"]').click(),Quiz.startSession([a],"leicht",{challengeId:l}),showToast(`🦊 Willkommen, ${personaForCategory(a)}!`),renderQuestion()}finally{n=!1}})})},dmaTeilImpl[1666]=function(e,n,t,a){const l=Backend.canModerate&&Backend.canModerate(),s=document.createElement("div");s.className="lightbox",s.innerHTML=`
      <div class="profile-modal-card" style="text-align:center;">
        <img src="${n}" alt="" style="width:100%; max-height:160px; object-fit:cover; border-radius:10px; margin-bottom:10px;" />
        <label style="display:flex; align-items:center; gap:8px; text-align:left; margin-bottom:14px;">
          <input type="checkbox" id="bannerProposeCommunityCheck" />
          <span class="empty-note">${l?"Auch sofort für die GANZE Community live setzen (sonst nur für dich persönlich)":"Auch als Vorschlag für die GANZE Community einreichen — ein:e Admin muss das erst bestätigen (sonst gilt es nur für dich persönlich)"}</span>
        </label>
        <button type="button" class="btn btn-coffee" id="bannerProposeConfirmBtn">Übernehmen</button>
        <button type="button" class="btn btn-ghost" id="bannerProposeCancelBtn" style="margin-top:6px;">Abbrechen</button>
      </div>`,document.body.appendChild(s),s.addEventListener("click",c=>{c.target===s&&s.remove()}),document.getElementById("bannerProposeCancelBtn").addEventListener("click",()=>s.remove()),document.getElementById("bannerProposeConfirmBtn").addEventListener("click",async()=>{const c=document.getElementById("bannerProposeCommunityCheck").checked;try{const r=await Backend.proposeSiteBanner(e,n,c);s.remove(),r.needsApproval?showToast("📩 Für dich sofort übernommen — Vorschlag für die Community wurde zusätzlich an die Admins gesendet."):c?showToast("🖼️ Für die ganze Community live gesetzt!"):showToast("🖼️ Für dich persönlich übernommen — andere sehen weiterhin das bisherige Bild.");const d=a.closest(".site-banner");if(d){const h=d.querySelector(".site-banner-upload-btn").outerHTML;d.innerHTML=`<img src="${n}" alt="" class="site-banner-img" />${h}`}wireSiteBannerUploads(t)}catch(r){alert(r.message||"Konnte nicht übernommen werden.")}})},dmaTeilImpl[1667]=async function(){const e=document.getElementById("rankingArea");e.dataset.rankingLoadedOnce||(e.innerHTML='<p class="empty-note">Lade Ranking…</p>');const n=rankingMode==="today"?await Backend.getRankingToday():await Backend.getRankingAllTime(),a=await{tag:()=>Backend.getFoxOfTheDayShowcase(),woche:()=>Backend.getFoxOfWeekShowcase(),monat:()=>Backend.getFoxOfMonthShowcase(),jahr:()=>Backend.getFoxOfYearShowcase()}[foxPeriodMode](),l=await Backend.getFoxOfDayHallOfFame(),s=await Backend.getEffectiveBannerUrl("hall_of_fame_banner");e.dataset.rankingLoadedOnce="1";const r={tag:{title:"Fuchs des Tages",suffix:"heute",report:"Mitarbeit heute"},woche:{title:"Fuchs der Woche",suffix:"diese Woche",report:"Mitarbeit diese Woche"},monat:{title:"Fuchs des Monats",suffix:"diesen Monat",report:"Mitarbeit diesen Monat"},jahr:{title:"Fuchs des Jahres",suffix:"dieses Jahr",report:"Mitarbeit dieses Jahr"}}[foxPeriodMode];e.innerHTML=`
      <div class="question-card" style="margin-bottom:14px;">
        <h3 style="margin-top:0;">🏆 Ranking</h3>
        <div class="order-toggle" style="margin-bottom:12px;">
          <button type="button" class="order-pill" id="rankTabToday" aria-selected="${rankingMode==="today"}">📅 Heute</button>
          <button type="button" class="order-pill" id="rankTabAllTime" aria-selected="${rankingMode==="alltime"}">🏆 Gesamt</button>
        </div>
        <table class="rank-table">
          ${n.length?n.map((m,p)=>`<tr>${m.user_id?`<td>${p+1}.</td><td><button type="button" class="friend-name-btn" data-view-ranked="${m.user_id}">${m.name}</button></td>`:`<td>${p+1}.</td><td>${m.name}</td>`}<td>${m.points} Pkt.</td></tr>`).join(""):`<tr><td class="empty-note">${rankingMode==="today"?"Noch keine Einträge heute — sei die/der Erste!":"Noch keine Einträge."}</td></tr>`}
        </table>
      </div>
      <div class="order-toggle" style="margin-bottom:10px;">
        <button type="button" class="order-pill fox-period-pill" data-fox-period="tag" aria-selected="${foxPeriodMode==="tag"}">📅 Tag</button>
        <button type="button" class="order-pill fox-period-pill" data-fox-period="woche" aria-selected="${foxPeriodMode==="woche"}">🗓️ Woche</button>
        <button type="button" class="order-pill fox-period-pill" data-fox-period="monat" aria-selected="${foxPeriodMode==="monat"}">📆 Monat</button>
        <button type="button" class="order-pill fox-period-pill" data-fox-period="jahr" aria-selected="${foxPeriodMode==="jahr"}">🗓️ Jahr</button>
      </div>
      ${a?`
      <div class="question-card fox-of-day-showcase">
        <svg class="fox-bg-flourish" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path d="M100 40 C70 40 50 65 45 95 C42 115 50 135 65 148 L60 170 L80 158 C87 161 93 162 100 162 C107 162 113 161 120 158 L140 170 L135 148 C150 135 158 115 155 95 C150 65 130 40 100 40 Z M70 55 L55 25 L80 48 Z M130 55 L145 25 L120 48 Z" fill="currentColor"/>
        </svg>
        <p class="eyebrow" style="margin-top:0;">🦊 ${r.title}</p>
        <div class="fox-kopfzeile">
          <div class="fox-avatar">
            ${a.profile?.avatar_url?avatarPhotoHtml(a.profile.avatar_url):`<div class="initials-avatar">${(a.name||"?")[0].toUpperCase()}</div>`}
          </div>
          <div class="fox-kopf-text">
            <button type="button" class="friend-name-btn" data-view-ranked="${a.user_id}">${escapeHtml(a.name||"")}</button>
            <p class="empty-note" style="margin:2px 0 0;">${a.total} Aktivitäts-Punkte ${r.suffix}${a.uebernommen?" — aus den Tagen davor, heute hat noch niemand gepunktet":""}</p>
          </div>
        </div>
        <div class="fox-of-day-report-card">
          <p style="font-weight:700; margin:0 0 6px;">📋 ${r.report}:</p>
          
          ${Array.isArray(a.reportCard)&&a.reportCard.length?`<ul style="margin:0; padding-left:18px;">${a.reportCard.map(m=>`<li>${escapeHtml(String(m))}</li>`).join("")}</ul>`:'<p class="empty-note" style="margin:0;">Für diesen Zeitraum liegt keine Aufschlüsselung vor.</p>'}
          ${a.profile?.languages?.length?`<p class="empty-note" style="margin-top:8px;">🗣️ Spricht: ${a.profile.languages.join(", ")}</p>`:""}
          ${a.profile?.origin?`<p class="empty-note" style="margin-top:4px;">🌍 Kommt aus: ${a.profile.origin}</p>`:""}
          <p class="empty-note" style="margin-top:8px; font-size:0.68rem;">So wird gerechnet: erspielte Punkte aus Übungen und Spielen zählen eins zu eins, jeder eigene Beitrag 50, eine Weiterempfehlung 20. Bloß eingeloggt zu sein oder das Profil auszufüllen zählt nicht.</p>
        </div>
      </div>`:'<p class="empty-note">Noch keine Aktivität in diesem Zeitraum — sei die/der Erste!</p>'}
      <div class="question-card" style="margin-top:14px;">
        <p class="eyebrow" style="margin-top:0;">👥 Alle Mitglieder <span class="subnav-info-icon" data-info="Alle, die sich hier je angemeldet haben — mit grünem Punkt, wenn jemand gerade online ist. Auf einen Namen tippen öffnet das Profil.">ⓘ</span></p>
        <div id="mitgliederListe"><p class="empty-note">Wird geladen …</p></div>
      </div>
      ${l.length?`
      <div class="question-card" style="margin-top:14px; padding:0; overflow:hidden;">
        ${siteBannerHtml("hall_of_fame_banner",s,HALL_OF_FAME_PLACEHOLDER_SVG,"Hall of Fame")}
        <div style="padding:16px;">
        <p class="eyebrow" style="margin-top:0;">🏛️ Hall of Fame — vergangene Füchse des Tages</p>
        <div class="breakdown-list">
          ${l.slice(0,10).map(m=>`<div class="breakdown-row"><span>🦊 ${m.name}</span><span class="empty-note">${new Date(m.date).toLocaleDateString("de-DE")}</span></div>`).join("")}
        </div>
        </div>
      </div>`:""}
    `,wireSiteBannerUploads(e),renderMitgliederListe();function d(){return e.getBoundingClientRect().top}function h(m){const p=document.getElementById("rankingArea");if(!p)return;const b=p.getBoundingClientRect().top;window.scrollBy(0,b-m)}document.getElementById("rankTabToday").addEventListener("click",async()=>{const m=d();rankingMode="today",await renderRanking(),h(m)}),document.getElementById("rankTabAllTime").addEventListener("click",async()=>{const m=d();rankingMode="alltime",await renderRanking(),h(m)}),e.querySelectorAll("[data-fox-period]").forEach(m=>{m.addEventListener("click",async()=>{const p=d();foxPeriodMode=m.dataset.foxPeriod,await renderRanking(),h(p)})}),e.querySelectorAll("[data-view-ranked]").forEach(m=>{m.addEventListener("click",()=>openProfileModal(m.dataset.viewRanked))})},dmaTeilImpl[1668]=async function(){const e=document.getElementById("guestbookArea"),n=await Backend.getGuestbook(),t=await Backend.getAverageRating(),a=Backend.currentUser();let l=0;const s={},c=[...new Set(n.map(r=>r.user_id).filter(Boolean))];await Promise.all(c.map(async r=>{s[r]=await Backend.getPublicProfile(r)})),e.innerHTML=`
      <div class="question-card">
        <h3>📖 Gästebuch &amp; Bewertungen</h3>
        ${t?`<p class="empty-note" style="margin-bottom:12px;">${"⭐".repeat(Math.round(t.average))} ${t.average.toFixed(1)} / 5 — basierend auf ${t.count} Bewertung${t.count===1?"":"en"}</p>`:""}
        ${n.map(r=>{const d=r.user_id?s[r.user_id]:null;return`<div class="guestbook-entry"><div style="display:flex; align-items:center; gap:8px;">${d?tinyAvatar({avatar_url:d.avatar_url,avatar_emoji:d.avatar_emoji,name:r.name}):""}${r.user_id?`<button type="button" class="friend-name-btn gb-name" data-view-gb-author="${r.user_id}">${r.name}</button>`:`<div class="gb-name">${r.name}</div>`}</div>${r.rating?`<div style="color:var(--amber-400); font-size:0.9rem;">${"⭐".repeat(r.rating)}</div>`:""}<p>${r.message}</p><div class="gb-date">${new Date(r.date).toLocaleString("de-DE")}</div>${Backend.canModerate()?`<button type="button" class="btn btn-ghost" style="margin-top:6px;" data-admin-delete-gb="${r.id}">🛠️ Löschen</button>`:""}</div>`}).join("")||'<p class="empty-note">Noch keine Einträge.</p>'}
        <form class="guestbook-form" id="guestbookForm">
          ${a?"":'<input type="text" id="gbName" placeholder="Dein Name" required />'}
          <label class="empty-note" style="display:block; margin-bottom:4px;">Bewertung (optional)</label>
          <div id="gbStarPicker" style="display:flex; gap:4px; margin-bottom:10px; font-size:1.4rem;">
            ${[1,2,3,4,5].map(r=>`<button type="button" class="gb-star-btn" data-star="${r}" style="background:none; border:none; cursor:pointer; opacity:0.35;">⭐</button>`).join("")}
          </div>
          <textarea id="gbMessage" placeholder="Hinterlasse eine Nachricht für Alex…" required></textarea>
          <button type="submit" class="btn-submit">Eintragen</button>
        </form>
      </div>
    `,e.querySelectorAll(".gb-star-btn").forEach(r=>{r.addEventListener("click",()=>{l=Number(r.dataset.star),e.querySelectorAll(".gb-star-btn").forEach(d=>{d.style.opacity=Number(d.dataset.star)<=l?"1":"0.35"})})}),document.getElementById("guestbookForm").addEventListener("submit",async r=>{r.preventDefault();const d=a?Backend.currentProfile().name:document.getElementById("gbName").value.trim(),h=document.getElementById("gbMessage").value.trim();h&&(await Backend.addGuestbookEntry(d,h,l||null),renderGuestbook())}),e.querySelectorAll("[data-view-gb-author]").forEach(r=>{r.addEventListener("click",()=>openProfileModal(r.dataset.viewGbAuthor))}),e.querySelectorAll("[data-admin-delete-gb]").forEach(r=>{r.addEventListener("click",async()=>{if(confirm("Diesen Gästebuch-Eintrag als Admin löschen?"))try{await Backend.adminDeleteGuestbookEntry(r.dataset.adminDeleteGb),renderGuestbook()}catch(d){alert(d.message)}})})},dmaTeilImpl[1669]=function(e){const n=!!(window.AusspracheP&&AusspracheP.zentralDa());return e?n?'<p class="stimmen-hinweis stimmen-hinweis-kurz">🔊 Vorgelesen wird von einer neuronalen Stimme — dieselbe Technik, mit der Wörterbücher ihre Aussprachebeispiele erzeugen.</p>':'<p class="stimmen-hinweis stimmen-hinweis-kurz">🔊 Die Stimme kommt aus deinem Gerät und betont manche Wörter falsch — die Silbenschrift darüber ist im Zweifel richtig, nicht die Stimme. Angemeldet bekommst du die bessere Stimme.</p>':`<details class="stimmen-hinweis">
      <summary>🔊 Warum klingt die Stimme manchmal falsch?</summary>
      <p>Diese Seite hat keine eigene Stimme. Wenn du auf 🔊 tippst, gibt sie den Text an dein
      Gerät weiter — Android, iPhone, Windows und Mac bringen jeweils ihre eigene Vorlesestimme
      mit. Wie das Wort dann klingt, entscheidet also dein Telefon, nicht diese Seite.</p>
      <p>Diese eingebauten Stimmen sind gut bei normalen deutschen Wörtern und schlecht bei allem
      anderen. Sie verlesen sich zuverlässig bei:</p>
      <ul>
        <li><strong>Fremdwörtern.</strong> „Bonbon“ spricht man im Deutschen französisch-nasal
            („Bong-Bong“); viele Stimmen sagen „Bon-bons“, Buchstabe für Buchstabe.</li>
        <li><strong>dem Z.</strong> Deutsches z ist immer <em>ts</em> — Zeit heißt „Tsait“.
            Manche Stimmen sprechen es englisch als weiches s.</li>
        <li><strong>zusammengesetzten Wörtern.</strong> Die Betonung liegt im Deutschen fast
            immer auf dem ERSTEN Teil: <em>HAUS·tür</em>, nicht <em>haus·TÜR</em>. Stimmen
            verschieben das gern.</li>
        <li><strong>Namen und Abkürzungen.</strong> Die rät die Maschine schlicht.</li>
      </ul>
      <p><strong>Was das für dich heißt:</strong> Nimm die Stimme als Hilfe, nicht als Vorbild.
      Wo auf dieser Seite eine Silbenschrift steht (<em>BON-bon</em>, <em>Ta-BLETT</em>), ist
      sie von Hand geprüft — sie hat recht, auch wenn die Stimme etwas anderes sagt. Und wenn du
      ein Wort wirklich sicher brauchst, hör es dir von einem Menschen an.</p>
      <p class="empty-note">Woran wir arbeiten: echte, einmal aufgenommene Audiodateien statt
      der Gerätestimme. Was das kostet, steht offen unter „Wissen → Was die App kostet“.</p>
    </details>`},dmaTeilImpl[1670]=function(){return window.DMA_DIALEKT||[]},dmaTeilImpl[1671]=function(){return window.DMA_DIALEKT_REGIONEN||[]},dmaTeilImpl[1672]=function(e){return String(e||"").replace(/^(der|die|das)\s+/i,"").trim()},dmaTeilImpl[1673]=function(e){const n=String(e||"").trim();if(!n)return null;const t=diaOhneArtikel(n).toLowerCase();return t&&diaListe().find(a=>diaOhneArtikel(a.hoch).toLowerCase()===t)||null},dmaTeilImpl[1674]=function(e){const n=diaRegionen().find(t=>e.formen&&e.formen[t.id]);return n?e.formen[n.id]+" ("+n.name+")":e.hoch},dmaTeilImpl[1675]=function(e){return diaRegionen().filter(n=>e.formen&&e.formen[n.id]).length},dmaTeilImpl[1676]=function(){const e=diaSuche.trim().toLowerCase();return diaListe().filter(n=>diaGruppeFilter!=="alle"&&n.gruppe!==diaGruppeFilter||diaRegionFilter!=="alle"&&!(n.formen&&n.formen[diaRegionFilter])?!1:!e||n.hoch.toLowerCase().includes(e)||(n.was||"").toLowerCase().includes(e)?!0:diaRegionen().some(t=>String((n.formen||{})[t.id]||"").toLowerCase().includes(e)))},dmaTeilImpl[1677]=function(){const e=document.getElementById("dialektArea");if(!e)return;const n=diaListe();if(!n.length){e.innerHTML='<p class="empty-note">Die Wörterliste wird geladen …</p>';return}const t=diaRegionen(),a=[...new Set(n.map(r=>r.gruppe))],l=diaGefiltert(),s=diaRegionFilter!=="alle"?t.find(r=>r.id===diaRegionFilter):null;e.innerHTML=`
      <div class="question-card">
        <p class="eyebrow" style="margin-top:0;">🗺️ Dialekte und Regionen</p>
        <h3 style="margin:4px 0 8px;">Dasselbe Ding, sieben Namen</h3>
        <p class="empty-note" style="margin-bottom:8px;">
          Hochdeutsch ist überall richtig — aber gehört wird oft etwas anderes. Wer in München
          „Brötchen“ sagt, wird verstanden; wer die Frau vor sich verstehen will, muss „Semmel“
          kennen. Hier steht zu ${n.length} Alltagswörtern, wie sie in den großen Sprachräumen
          heißen.
        </p>
        <p class="empty-note" style="margin-bottom:0;">
          <strong>Wichtig:</strong> Die Grenzen der Wörter laufen quer durch die Landkarte, nicht
          entlang der Bundesländer. Die Angaben sind Schwerpunkte — in jeder größeren Stadt hört
          man beides. Steht bei einer Region nichts, sagt man dort schlicht das hochdeutsche Wort.
        </p>
      </div>

      <div class="question-card" style="margin-top:12px;">
        <div class="vocab-toolbar">
          <input type="text" class="vocab-search" id="diaSuche" placeholder="Wort suchen — z. B. Brötchen, Semmel, Sahne …" value="${escapeHtml(diaSuche)}" />
        </div>
        <label class="empty-note" style="display:block; margin:10px 0 4px;">Region</label>
        <div class="trophy-case">
          <button type="button" class="trophy-chip ${diaRegionFilter==="alle"?"selected":""}" data-dia-region="alle">Alle Regionen</button>
          ${t.map(r=>`<button type="button" class="trophy-chip ${diaRegionFilter===r.id?"selected":""}" data-dia-region="${r.id}">${r.emoji} ${escapeHtml(r.name)}</button>`).join("")}
        </div>
        ${s?`<p class="empty-note" style="margin:8px 0 0;">${s.emoji} <strong>${escapeHtml(s.name)}</strong> — ${escapeHtml(s.raum)}. Gezeigt werden nur die Wörter, die dort anders heißen.</p>`:""}
        <label class="empty-note" style="display:block; margin:10px 0 4px;">Thema</label>
        <div class="trophy-case">
          <button type="button" class="trophy-chip ${diaGruppeFilter==="alle"?"selected":""}" data-dia-gruppe="alle">Alle Themen</button>
          ${a.map(r=>`<button type="button" class="trophy-chip ${diaGruppeFilter===r?"selected":""}" data-dia-gruppe="${escapeHtml(r)}">${escapeHtml(r)}</button>`).join("")}
        </div>
        <p class="empty-note" style="margin:10px 0 0;">${l.length} ${l.length===1?"Wort":"Wörter"}</p>
      </div>

      ${l.length?l.map(r=>diaKarteHtml(r)).join(""):'<p class="empty-note" style="margin-top:12px;">Kein Treffer. Vielleicht ein anderes Wort probieren?</p>'}

      <div class="question-card" style="margin-top:12px;">
        <p class="eyebrow" style="margin-top:0;">Und jetzt abfragen</p>
        <p class="empty-note" style="margin:0 0 10px;">
          Im Spiel „Der Sprachatlas“ tippst du auf einer Karte an, wo ein Wort zu Hause ist —
          dieselben Wörter, andere Richtung.
        </p>
        <button type="button" class="btn btn-coffee" id="diaZumAtlas">🗺️ Zum Sprachatlas</button>
      </div>
      ${miniBugReportBtnHtml("Dialekt-Bereich")}
    `;const c=document.getElementById("diaSuche");if(c&&c.addEventListener("input",r=>{diaSuche=r.target.value,clearTimeout(diaTippUhr),diaTippUhr=setTimeout(()=>{const d=r.target.selectionStart;renderDialekt();const h=document.getElementById("diaSuche");if(h){h.focus();try{h.setSelectionRange(d,d)}catch{}}},180)}),e.querySelectorAll("[data-dia-region]").forEach(r=>r.addEventListener("click",()=>{diaRegionFilter=r.dataset.diaRegion,renderDialekt()})),e.querySelectorAll("[data-dia-gruppe]").forEach(r=>r.addEventListener("click",()=>{diaGruppeFilter=r.dataset.diaGruppe,renderDialekt()})),e.querySelectorAll("[data-dia-sprich]").forEach(r=>r.addEventListener("click",()=>{Core.speak(r.dataset.diaSprich,"de")})),document.getElementById("diaZumAtlas")?.addEventListener("click",()=>{jumpToSubnavTarget('#learnSubnav [data-sub="sub-sprachatlas"]',"#sprachatlasArea",40),document.querySelector('.tape-tab[data-target="view-learn"]')?.click(),setTimeout(()=>jumpToSubnavTarget('#learnSubnav [data-sub="sub-sprachatlas"]',"#sprachatlasArea",40),60)}),diaHervor){const r=e.querySelector(`[data-dia-wort="${cssEscapeWert(diaHervor)}"]`);r&&(r.classList.add("dia-karte-hervor"),requestAnimationFrame(()=>r.scrollIntoView({behavior:"smooth",block:"center"}))),diaHervor=null}},dmaTeilImpl[1678]=function(e){return String(e||"").replace(/["\\]/g,"\\$&")},dmaTeilImpl[1679]=function(e){const n=diaRegionen(),t=diaAbweichungen(e);return`
      <div class="question-card dia-karte" data-dia-wort="${escapeHtml(e.hoch)}" style="margin-top:12px;">
        <div class="dia-kopf">
          <div>
            <p class="eyebrow" style="margin:0;">Hochdeutsch</p>
            <h3 style="margin:2px 0 0;">${escapeHtml(e.hoch)}</h3>
          </div>
          <button type="button" class="btn btn-ghost bw-hoerknopf" data-dia-sprich="${escapeHtml(diaOhneArtikel(e.hoch))}" aria-label="Wort vorlesen">🔊</button>
        </div>
        <p class="empty-note" style="margin:6px 0 0;">${escapeHtml(e.was||"")}</p>
        <p class="empty-note" style="margin:4px 0 10px;">${t} von ${n.length} Regionen sagen etwas anderes.</p>
        <div class="dia-gitter">
          ${n.map(a=>{const l=(e.formen||{})[a.id];return`<div class="dia-zelle ${l?"dia-zelle-anders":"dia-zelle-gleich"}">
              <span class="dia-region">${a.emoji} ${escapeHtml(a.name)}</span>
              <span class="dia-form">${l?escapeHtml(l):"wie hochdeutsch"}</span>
              ${l?`<button type="button" class="dia-hoer" data-dia-sprich="${escapeHtml(diaOhneArtikel(l.split(" / ")[0]))}" aria-label="${escapeHtml(a.name)}: vorlesen">🔊</button>`:""}
            </div>`}).join("")}
        </div>
        ${e.notiz?`<p class="dia-notiz">💡 ${escapeHtml(e.notiz)}</p>`:""}
      </div>`},dmaTeilImpl[1680]=function(){return(window.DMA_PLAETZE||[]).filter(e=>e.an!==!1&&["stehen","sitzen","liegen"].indexOf(e.haltung)>=0&&brPraeposition(e.wo)&&e.wort)},dmaTeilImpl[1681]=function(e){const n=String(e||"");return/^im\s|^in\s/.test(n)?"in":/^am\s|^an\s/.test(n)?"an":/^auf\s/.test(n)?"auf":/^vor\s/.test(n)?"vor":null},dmaTeilImpl[1682]=function(e){const n=String(e||"").trim().split(/\s+/)[0].toLowerCase();return n==="der"?"m":n==="die"?"f":"n"},dmaTeilImpl[1683]=function(e){return String(e||"").replace(/^(der|die|das)\s+/i,"")},dmaTeilImpl[1684]=function(e){return String(e.wo||"").trim().split(/\s+/).pop()||brNomen(e.wort)},dmaTeilImpl[1685]=function(e,n,t){const a=n.wort,l=brGeschlecht(a),s=brOrtsNomen(n),c=e+"-"+l;return t==="akk"?BR_ZUSAMMEN_AKK[c]?BR_ZUSAMMEN_AKK[c]+" "+s:e+" "+BR_AKKUSATIV[l]+" "+s:BR_ZUSAMMEN_DAT[c]?BR_ZUSAMMEN_DAT[c]+" "+s:e+" "+BR_DATIV[l]+" "+s},dmaTeilImpl[1686]=function(e){return e[Math.floor(Math.random()*e.length)]},dmaTeilImpl[1687]=async function(e){if(window.DMA_BILDERWELT_NEU)return brNeueAufgabeNeu(e);window.DMA_PLAETZE||await brDatei("data-plaetze.js"),await szenenLaden();const n=brPlaetze();if(!n.length)return null;const t=e?n.find(p=>p.id===e):brZufall(n);if(!t)return null;await szeneLaden(t.szene);const a=brZufall(BR_FIGUREN);if((window.DMA_FIGUR||{})[a]?(window.DMA_FIGUR[a].haltungen||{})[t.haltung]||await brDatei("figuren/"+a+"-teil2.js"):(await brDatei("figuren/"+a+".js"),await brDatei("figuren/"+a+"-teil2.js")),t.haltung==="sitzen_seit"){await brDatei("figuren/"+a+"-teil3.js"),window.DMA_SEITSITZ_BAUEN||await brDatei("figuren/seitsitz.js");try{window.DMA_SEITSITZ_BAUEN&&window.DMA_SEITSITZ_BAUEN(a)}catch{}}const l=(window.DMA_FIGUR||{})[a];if(!l||!(l.haltungen||{})[t.haltung])return null;const[s,c]=a.split("-"),r=Object.keys(l.haltungen[t.haltung].frisuren||{}),h=(c==="w"?BR_FRISUR_W:BR_FRISUR_M).filter(p=>r.indexOf(p)>=0),m=Object.keys(l.haltungen[t.haltung].gesichter||{});return{szene:t.szene,platz:t,alter:s,geschlecht:c,haut:brZufall(BR_HAUT),haarfarbe:brZufall(BR_HAAR),frisur:h.length?brZufall(h):r[0]||"kurz",gesicht:m.length?brZufall(m):"g1",haltung:t.haltung,kleidung:{oberteil:{stueck:brZufall(c==="w"?BR_OBERTEIL_W:BR_OBERTEIL_M),farbe:brZufall(BR_FARBEN)},unterteil:{stueck:brZufall(c==="w"?BR_UNTERTEIL_W:BR_UNTERTEIL_M),farbe:brZufall(BR_FARBEN)},schuhe:{stueck:brZufall(BR_SCHUHE),farbe:brZufall(BR_FARBEN)}}}},dmaTeilImpl[1688]=async function(e){window.DMA_PLAETZE||await brDatei(window.DMA_BW_PFAD("data-plaetze.js")),await szenenLaden();const n=brPlaetze();if(!n.length)return null;const t=e?n.find(p=>p.id===e):brZufall(n);if(!t)return null;await szeneLaden(t.szene);const a=brZufall(BR_FIGUREN);if(window.DMA_MENSCH||await brDatei(window.DMA_BW_PFAD("figuren/mensch.js")),!window.DMA_MENSCH)return null;const[l,s]=a.split("-"),c=s==="w"?BR_FRISUR_W:BR_FRISUR_M,r=brZufall(c),d=[r.indexOf("bart")===0?"kurz":r],h=r.indexOf("bart")===0&&l!=="kind"&&l!=="jugendlich"?r:"",m=["g1","g2","g3","g4"];return{szene:t.szene,platz:t,alter:l,geschlecht:s,haut:brZufall(BR_HAUT),haarfarbe:brZufall(BR_HAAR),frisur:d[0],bart:h,gesicht:brZufall(m),haltung:t.haltung,kleidung:{oberteil:{stueck:brZufall(s==="w"?BR_OBERTEIL_W:BR_OBERTEIL_M),farbe:brZufall(BR_FARBEN)},unterteil:{stueck:brZufall(s==="w"?BR_UNTERTEIL_W:BR_UNTERTEIL_M),farbe:brZufall(BR_FARBEN)},schuhe:{stueck:brZufall(BR_SCHUHE),farbe:brZufall(BR_FARBEN)}}}},dmaTeilImpl[1689]=function(e){if(window.DMA_BILDERWELT_NEU)return brBildHtmlNeu(e);const n=(window.DMA_SZENE||{})[e.szene];if(!n||typeof bkFigurSvg!="function")return'<p class="empty-note">Das Bild wird geladen …</p>';const t=bkFigurSvg(e,0);if(!t)return'<p class="empty-note">Das Bild wird geladen …</p>';const a=bkFigurAnker(t,e.platz),l=s=>Math.round(s*10)/10;return`<div class="br-buehne"><svg viewBox="0 0 ${n.breite} ${n.hoehe}" class="br-svg"
        role="img" aria-label="Ein Mensch an einem Ort — welcher Satz beschreibt das Bild?">
      ${window.DMA_FIGUR_DEFS||""}
      <g class="br-kulisse">${n.kulisse}</g>
      
      ${(n.teile||[]).filter(s=>(e.platz.verdeckt||[]).indexOf(s.id)<0).map(s=>`<g transform="translate(${s.x},${s.y})">${s.kunst}</g>`).join("")}
      <g transform="translate(${l(a.x)},${l(a.y)})">${t.svg}</g>
    </svg></div>`},dmaTeilImpl[1690]=function(e){const n=(window.DMA_SZENE||{})[e.szene];if(!n||typeof bkFigurSvg!="function")return'<p class="empty-note">Das Bild wird geladen …</p>';const t=bkFigurSvg(e,0);if(!t)return'<p class="empty-note">Das Bild wird geladen …</p>';const a=bkFigurAnker(t,e.platz),l=s=>Math.round(s*10)/10;return`<div class="br-buehne"><svg viewBox="0 0 ${n.breite} ${n.hoehe}" class="br-svg"
        role="img" aria-label="Ein Mensch an einem Ort — welcher Satz beschreibt das Bild?">
      <g class="br-kulisse">${n.kulisse}</g>
      
      ${(n.teile||[]).filter(s=>(e.platz.verdeckt||[]).indexOf(s.id)<0).map(s=>`<g transform="translate(${s.x},${s.y})">${s.kunst}</g>`).join("")}
      <g class="br-figur" transform="translate(${l(a.x)},${l(a.y)})">${t.svg}</g>
    </svg></div>`},dmaTeilImpl[1691]=function(e){return(typeof BK_SUBJEKT<"u"?BK_SUBJEKT:{})[e.alter+"-"+e.geschlecht]||{wort:"die Person",artikel:"die",pron:"sie"}},dmaTeilImpl[1692]=function(e){return(typeof BK_VERB<"u"?BK_VERB:{})[e]||"ist"},dmaTeilImpl[1693]=function(e,n){const t=e.kleidung.oberteil,a=(typeof BK_STUECK<"u"?BK_STUECK:{})[t.stueck];if(!a)return"";const l=a[1];if(l==="p")return"";const s=n||t.farbe,c=(typeof BK_FARBE<"u"?BK_FARBE:{})[s],r=a[0].replace(/^(der|die|das)\s+/,"");return"mit "+BR_DATIV[l]+" "+(c?c[1].m+" ":"")+r},dmaTeilImpl[1694]=function(e){return String(e).charAt(0).toUpperCase()+String(e).slice(1)},dmaTeilImpl[1695]=function(e){const n=brSubjekt(e),t=brMerkmal(e);return brGross(n.wort)+(t?" "+t:"")+" "+brVerb(e.haltung)+" "+e.platz.wo+"."},dmaTeilImpl[1696]=function(e){const n=brSubjekt(e),t=brMerkmal(e),a=brGross(n.wort)+(t?" "+t:""),l=brPraeposition(e.platz.wo),s=[],r={stehen:"sitzen",sitzen:"stehen",liegen:"sitzen"}[e.haltung]||"stehen";if(s.push({text:a+" "+brVerb(r)+" "+e.platz.wo+".",art:"verb",warum:`Falsches Verb. Schau ins Bild: ${n.pron==="er"?"er":n.pron==="es"?"es":"sie"} <strong>${brVerb(e.haltung)}</strong>, nicht ${brVerb(r)}.`}),l){s.push({text:a+" "+brVerb(e.haltung)+" "+brOrt(l,e.platz,"akk")+".",art:"kasus",warum:`Falscher Fall. <em>${escapeHtml(l)}</em> kann Dativ oder Akkusativ — der Akkusativ antwortet auf <strong>wohin?</strong> (eine Bewegung), der Dativ auf <strong>wo?</strong> (ein Ort). Hier bewegt sich niemand irgendwohin, also: <strong>${escapeHtml(e.platz.wo)}</strong>.`});const d=BR_PRAEP_TAUSCH[l];d&&s.push({text:a+" "+brVerb(e.haltung)+" "+brOrt(d,e.platz,"dat")+".",art:"praeposition",warum:`Falsche Präposition. <em>${escapeHtml(d)}</em> ist ein anderer Ort als <em>${escapeHtml(l)}</em> — im Bild ist es <strong>${escapeHtml(e.platz.wo)}</strong>.`})}if(t){const d=brZufall(BR_FARBEN.filter(h=>h!==e.kleidung.oberteil.farbe));s.push({text:brGross(n.wort)+" "+brMerkmal(e,d)+" "+brVerb(e.haltung)+" "+e.platz.wo+".",art:"kleidung",warum:"Falsche Farbe. Der Satz stimmt grammatisch — er beschreibt nur eine andere Person als die im Bild."})}return s},dmaTeilImpl[1697]=function(e){const n={text:brRichtigerSatz(e),ok:!0},t=Core.shuffle(brFalscheSaetze(e)),a=t.filter(d=>d.art!=="kleidung"),l=t.filter(d=>d.art==="kleidung"),s=a.concat(l),c=[],r=new Set;for(s.forEach(d=>{c.length>=2||r.has(d.art)||(r.add(d.art),c.push(d))});c.length<2&&t.length>c.length;){const d=t.find(h=>c.indexOf(h)<0);if(!d)break;c.push(d)}return Core.shuffle([n].concat(c.map(d=>Object.assign({ok:!1},d))))},dmaTeilImpl[1698]=async function(){const e=document.getElementById("bilderraetselArea");if(!e)return;if(autoWeiterAbbrechen(),brRunde||(brRunde={nummer:0,richtig:0,letzte:null}),brRunde.nummer>=BR_RUNDEN){brErgebnisZeichnen(e);return}if(!brZustand){if(e.innerHTML='<div class="question-card"><p class="empty-note">Das Bild wird zusammengesetzt …</p></div>',brZustand=await brNeueAufgabe(),!brZustand){e.innerHTML='<div class="question-card"><p class="empty-note">Die Bilder konnten nicht geladen werden. Seite neu laden und noch einmal versuchen.</p></div>';return}brZustand.saetze=brAufgabeBauen(brZustand)}const n=brZustand,t=brRunde.letzte;e.innerHTML=`
      <div class="question-card">
        ${miniBugReportBtnHtml("Bilderrätsel: "+n.platz.id)}
        <p class="eyebrow">🖼️ DAS BILDERRÄTSEL · BILD ${brRunde.nummer+1} / ${BR_RUNDEN}
          <span class="subnav-info-icon" data-info="Jedes Bild wird neu zusammengesetzt: ein Mensch und ein Ort. Von den drei Sätzen beschreibt genau einer das Bild. Die beiden anderen sind grammatisch richtig gebaut — sie sagen nur etwas anderes, als zu sehen ist.">ⓘ</span></p>
        ${fortschrittHtml(brRunde.nummer,BR_RUNDEN)}
        ${brBildHtml(n)}
        <p class="br-frage">Welcher Satz beschreibt das Bild?</p>
        <div class="br-saetze">
          ${n.saetze.map((a,l)=>{let s="";return t&&(s=a.ok?" br-satz-richtig":t.gewaehlt===l?" br-satz-daneben":""),`<button type="button" class="br-satz${s}" data-br-satz="${l}" ${t?"disabled":""}>${escapeHtml(a.text)}</button>`}).join("")}
        </div>
        ${t?`<p class="bw-rueckmeldung ${t.ok?"bw-ok":"bw-falsch"}">
            ${t.ok?"✅ Richtig.":"❌ "+(n.saetze[t.gewaehlt].warum||"")}
            ${t.ok?"":"<br>Richtig wäre: <strong>"+escapeHtml(n.saetze.find(a=>a.ok).text)+"</strong>"}
          </p>`:'<p class="empty-note" style="margin-top:8px;">Zwei der drei Sätze sind grammatisch völlig in Ordnung — sie beschreiben nur ein anderes Bild. Schau genau hin.</p>'}
        <div class="quiz-actions" style="justify-content:flex-start; flex-wrap:wrap; margin-top:12px;">
          <button type="button" class="btn btn-ghost" id="brUeberspringen">↷ Anderes Bild</button>
        </div>
      </div>`,e.querySelectorAll("[data-br-satz]").forEach(a=>a.addEventListener("click",()=>{brAntwort(Number(a.dataset.brSatz))})),document.getElementById("brUeberspringen")?.addEventListener("click",()=>{brZustand=null,brRunde.letzte=null,renderBilderraetsel()})},dmaTeilImpl[1699]=function(e){if(!brZustand||brRunde.letzte)return;const n=brZustand.saetze[e],t=!!(n&&n.ok);if(brRunde.letzte={gewaehlt:e,ok:t},t?(brRunde.richtig+=1,Core.sound.correct()):Core.sound.wrong(),spielNotiz(t,brZustand.saetze.find(a=>a.ok).text),renderBilderraetsel(),t&&window.DMA_BILDERWELT_NEU&&typeof window.bkWinken=="function"){const a=document.querySelector("#bilderraetselArea .br-figur");a&&window.bkWinken(a,brZustand,AUTO_WEITER_RICHTIG_MS-60)}autoWeiter(t,()=>{brRunde.nummer+=1,brRunde.letzte=null,brZustand=null,renderBilderraetsel()})},dmaTeilImpl[1700]=function(e){const n=Math.round(brRunde.richtig/Math.max(1,BR_RUNDEN)*100);e.innerHTML=ergebnisSchirmHtml({punkte:brRunde.richtig*2,prozent:n,tier:"Bildleser:in",charakter:"Das Bilderrätsel",zeilen:[{name:"🖼️ Richtig gelesen",anteil:n,wert:brRunde.richtig+"/"+BR_RUNDEN}],knoepfe:'<button type="button" class="btn btn-coffee" id="brNochmal">🔄 Neue Runde</button>'}),document.getElementById("brNochmal")?.addEventListener("click",()=>{brRunde=null,brZustand=null,renderBilderraetsel()}),Backend.currentUser()&&(saveResultAndCheck({categories:["bilderraetsel"],points:brRunde.richtig*2,bonus:0,percent:n,character:"Bildleser:in",badges:[],playedAt:new Date().toISOString()}),activeGameChallengeId&&(Backend.submitChallengeResult(activeGameChallengeId,{percent:n}),activeGameChallengeId=null,geliehenAlleWeg()))},dmaTeilImpl[1701]=function(e){return(e*KOSTEN_KURS).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})},dmaTeilImpl[1702]=function(){const e=document.getElementById("kostenArea");e&&(e.innerHTML=`
      <div class="question-card">
        <p class="eyebrow" style="margin-top:0;">💶 Was diese Seite kostet</p>
        <h3 style="margin:4px 0 8px;">Offen gerechnet, nicht geschätzt</h3>
        <p class="empty-note" style="margin-bottom:6px;">
          Diese Seite hat keine Werbung, verkauft keine Daten und gehört keiner Firma. Sie kostet
          trotzdem Geld — nur eben sehr wenig, und das lässt sich nachrechnen. Hier steht jede
          Zahl, mit der gerechnet wurde.
        </p>
        <p class="empty-note" style="margin:0;">
          Gemessen wurde der Wortschatz dieser Seite:
          <strong>${KOSTEN_EINTRAEGE.toLocaleString("de-DE")} verschiedene deutsche Einträge</strong>
          mit zusammen rund <strong>${(KOSTEN_ZEICHEN/1e6).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} Millionen Zeichen</strong>. Das ist die Menge, um die es
          bei der Sprachausgabe geht.
        </p>
      </div>

      <div class="question-card kosten-block" style="margin-top:12px;">
        <h3 style="margin:0 0 4px;">✅ Was heute nichts kostet</h3>
        <ul class="kosten-liste">
          <li><strong>Die Seite selbst.</strong> Sie besteht aus Dateien, die dein Browser lädt —
            kein Server rechnet dabei etwas aus. Solche Dateien kann man kostenlos ausliefern lassen.</li>
          <li><strong>Die Sprachausgabe, so wie sie jetzt ist.</strong> Sie kommt aus deinem eigenen
            Gerät. Das kostet uns nichts — und klingt genau deshalb manchmal schief
            (siehe „Warum klingt die Stimme manchmal falsch?“ weiter unten).</li>
          <li><strong>Konten, Punkte, Freunde, Beiträge.</strong> Dafür läuft eine Datenbank
            (Supabase). Deren kostenlose Stufe reicht bis
            <strong>50 000 aktive Nutzer:innen im Monat</strong>, 500 MB Datenbank, 1 GB Speicher
            und 5 GB Datenverkehr.</li>
        </ul>
        <p class="empty-note" style="margin:8px 0 0;">
          Ein Haken hat die kostenlose Stufe: Wird eine Woche lang gar nicht zugegriffen, legt
          Supabase das Projekt schlafen und man muss es von Hand wecken. Solange hier jemand lernt,
          passiert das nicht.
        </p>
      </div>

      <div class="question-card kosten-block" style="margin-top:12px;">
        <h3 style="margin:0 0 4px;">🎙️ Was eine gute Stimme kostet</h3>
        <p class="empty-note" style="margin:0 0 10px;">
          Der einzige Posten, der wirklich ins Geld gehen könnte, ist eine richtige Sprachausgabe:
          Jedes Wort einmal von einer guten Computerstimme sprechen lassen, statt es dem Telefon zu
          überlassen. Abgerechnet wird nach Zeichen — deshalb war die Messung oben der erste
          Schritt.
        </p>
        <div class="kosten-tabelle-huelle">
          <table class="kosten-tabelle">
            <thead><tr><th>Stimme</th><th>Kostenlos</th><th>Danach je 1 Mio. Zeichen</th><th>Diese Seite einmal komplett</th></tr></thead>
            <tbody>
              <tr><td>Google <strong>Standard</strong></td><td>4 Mio. Zeichen</td><td>4 $</td><td class="kosten-gut">0 $ — passt ins Freikontingent</td></tr>
              <tr><td>Google <strong>WaveNet</strong></td><td>1 Mio. Zeichen</td><td>4 $</td><td class="kosten-gut">≈ 2,28 $ (${kostenEuro(2.28)} €)</td></tr>
              <tr><td>Google <strong>Neural2</strong></td><td>1 Mio. Zeichen</td><td>16 $</td><td>≈ 9 $ (${kostenEuro(9)} €)</td></tr>
              <tr><td>Google <strong>Chirp 3 HD</strong></td><td>—</td><td>30 $</td><td>≈ 47 $ (${kostenEuro(47)} €)</td></tr>
              <tr><td>Google <strong>Studio</strong></td><td>—</td><td>160 $</td><td class="kosten-teuer">≈ 251 $ (${kostenEuro(251)} €)</td></tr>
              <tr><td>ElevenLabs <strong>Flash / Turbo v2.5</strong></td><td>—</td><td>60 $ (0,06 $ je 1000 Zeichen)</td><td>≈ 94 $ (${kostenEuro(94)} €)</td></tr>
              <tr><td>ElevenLabs <strong>Multilingual</strong></td><td>—</td><td>120 $ (0,12 $ je 1000 Zeichen)</td><td class="kosten-teuer">≈ 188 $ (${kostenEuro(188)} €)</td></tr>
            </tbody>
          </table>
        </div>
        <p class="empty-note" style="margin:10px 0 0;">
          ElevenLabs verkauft außerdem Pakete: 5 $ für 30 000 Zeichen, 22 $ für 100 000,
          99 $ für 500 000, 330 $ für 2 Millionen. Für 1,57 Millionen Zeichen bräuchte man
          das große Paket — mehr als hundertmal so viel wie der Weg darüber.
        </p>
        <div class="kosten-merksatz">
          <strong>Der entscheidende Punkt:</strong> Das ist eine EINMALIGE Rechnung, keine
          monatliche. Jedes Wort wird ein einziges Mal gesprochen und als Tondatei abgelegt.
          Danach hört jede Person auf der Welt dieselbe Datei — und das kostet
          <strong>0 € im Monat</strong>. Nur wenn man jedes Wort bei jedem Antippen neu erzeugen
          ließe, liefe der Zähler immer weiter.
        </div>
        <p class="empty-note" style="margin:10px 0 0;">
          Gewählt wäre also <strong>Google WaveNet für rund ${kostenEuro(2.28)} €</strong> — einmal,
          für alle ${KOSTEN_EINTRAEGE.toLocaleString("de-DE")} Wörter. Das ist weniger als ein Kaffee.
        </p>
      </div>

      <div class="question-card kosten-block" style="margin-top:12px;">
        <h3 style="margin:0 0 4px;">🗄️ Ab wann die Datenbank Geld kostet</h3>
        <p class="empty-note" style="margin:0 0 10px;">
          Solange die Seite in die kostenlose Stufe passt, kostet sie null. Die Grenze ist klar
          benannt — und sie ist weit weg:
        </p>
        <div class="kosten-tabelle-huelle">
          <table class="kosten-tabelle">
            <thead><tr><th></th><th>Kostenlos</th><th>Pro — 25 $ im Monat</th></tr></thead>
            <tbody>
              <tr><td>Aktive Nutzer:innen / Monat</td><td>50 000</td><td>100 000</td></tr>
              <tr><td>Datenbank</td><td>500 MB</td><td>8 GB</td></tr>
              <tr><td>Dateispeicher</td><td>1 GB</td><td>100 GB</td></tr>
              <tr><td>Datenverkehr</td><td>5 GB</td><td>250 GB</td></tr>
              <tr><td>Pausiert ohne Zugriff</td><td>nach einer Woche</td><td>nie</td></tr>
            </tbody>
          </table>
        </div>
        <p class="empty-note" style="margin:10px 0 0;">
          Der erste Posten, an den man stößt, ist meistens nicht die Nutzerzahl, sondern der
          Datenverkehr: Profilbilder, eigene Bilder, Beiträge. 5 GB im Monat sind schnell voll,
          wenn viele Leute Fotos hochladen. Dann — und erst dann — werden aus 0 € die
          <strong>25 $ im Monat (${kostenEuro(25)} €)</strong> für die Pro-Stufe.
        </p>
      </div>

      <div class="question-card kosten-block" style="margin-top:12px;">
        <h3 style="margin:0 0 4px;">🧮 Die ganze Rechnung auf einen Blick</h3>
        <div class="kosten-tabelle-huelle">
          <table class="kosten-tabelle">
            <thead><tr><th>Posten</th><th>Einmalig</th><th>Jeden Monat</th></tr></thead>
            <tbody>
              <tr><td>Seite ausliefern</td><td>—</td><td class="kosten-gut">0 €</td></tr>
              <tr><td>Stimme aus dem Gerät</td><td>—</td><td class="kosten-gut">0 €</td></tr>
              <tr><td>Alle Wörter einmal aufnehmen (WaveNet)</td><td>${kostenEuro(2.28)} €</td><td class="kosten-gut">0 €</td></tr>
              <tr><td>Datenbank, solange sie in die kostenlose Stufe passt</td><td>—</td><td class="kosten-gut">0 €</td></tr>
              <tr><td>Datenbank Pro, sobald sie nicht mehr passt</td><td>—</td><td>${kostenEuro(25)} €</td></tr>
            </tbody>
          </table>
        </div>
        <p class="empty-note" style="margin:10px 0 0;">
          Heute: nahezu null. Später, mit vielen Menschen auf der Seite: rund
          <strong>${kostenEuro(25)} € im Monat</strong>. Genau diese Lücke soll Premium schließen —
          und keinen Cent mehr. Wie das gerechnet ist, steht unter
          <strong>Profil &amp; Rang → ✨ Premium</strong>.
        </p>
      </div>

      <div class="question-card kosten-block" style="margin-top:12px;">
        <h3 style="margin:0 0 8px;">🔊 Die Sache mit der Stimme</h3>
        ${stimmenHinweisHtml(!1)}
      </div>
      ${miniBugReportBtnHtml("Kostenseite")}
    `)},dmaTeilImpl[1703]=function(){return Math.ceil(PREMIUM_BEDARF/PREMIUM_MONAT)},dmaTeilImpl[1704]=function(){const e=document.getElementById("premiumArea"),n=Backend.currentUser(),t=Backend.isPremium();e.innerHTML=`
      <div class="premium-card">
        <h2>✨ Premium — ${PREMIUM_MONAT} € im Monat</h2>
        <p class="empty-note" style="margin-top:6px;">
          Kein Abo mit Kleingedrucktem, keine Werbung, kein Datenverkauf. Der Preis ist so
          gerechnet, dass er die tatsächlichen Kosten deckt — und einen Euro für die Arbeit.
          Wer will, rechnet unten nach.
        </p>
        ${t?'<p style="margin-top:12px; color: var(--teal-400); font-weight:700;">✓ Freigeschaltet — danke, dass du das hier trägst.</p>':`<div class="quiz-actions" style="justify-content:center; margin-top:16px; flex-wrap:wrap;">
              <a class="btn btn-coffee" href="https://www.paypal.com/paypalme/XanderFox" target="_blank" rel="noopener">${PREMIUM_MONAT} € im Monat unterstützen</a>
              <a class="btn btn-ghost" href="https://www.paypal.com/paypalme/XanderFox" target="_blank" rel="noopener">Lieber ${PREMIUM_JAHR} € im Jahr</a>
              ${n?'<button type="button" class="btn btn-ghost" id="demoUnlock">Im Demo-Modus freischalten</button>':""}
            </div>
            <p class="empty-note" style="margin-top:10px;">
              ${PREMIUM_JAHR} € im Jahr sind zwei Monate geschenkt. Die echte Freischaltung nach
              Zahlung braucht noch eine kleine Server-Funktion (Supabase Edge Function +
              PayPal-Webhook, siehe README) — bis dahin schaltet Alex von Hand frei. Der
              Demo-Knopf probiert das Ergebnis nur örtlich aus.
            </p>`}

        <div class="premium-rechnung">
          <h3>Woher die ${PREMIUM_MONAT} € kommen</h3>
          <div class="kosten-tabelle-huelle">
            <table class="kosten-tabelle">
              <tbody>
                <tr><td>Datenbank (Supabase Pro), sobald die kostenlose Stufe nicht mehr reicht</td><td>25 $ ≈ ${kostenEuro(25)} €</td></tr>
                <tr><td>Sprachausgabe — einmal vorproduziert, danach nie wieder</td><td class="kosten-gut">0,00 €</td></tr>
                <tr><td>Die Seite ausliefern</td><td class="kosten-gut">0,00 €</td></tr>
                <tr><td>Für die Arbeit daran — ein Euro, wie besprochen</td><td>1,00 €</td></tr>
                <tr class="kosten-summe"><td><strong>Zusammen im Monat</strong></td><td><strong>${PREMIUM_BEDARF},00 €</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p class="kosten-merksatz" style="margin-top:10px;">
            ${PREMIUM_BEDARF} € geteilt durch ${PREMIUM_MONAT} € macht <strong>${premiumTraeger()} Menschen</strong>.
            So viele mit Premium, und die Seite trägt sich vollständig. Alles darüber hinaus geht
            in das, was noch fehlt — zuerst in die echten Sprachaufnahmen.
          </p>
          <p class="empty-note" style="margin:8px 0 0;">
            Zum Vergleich: Alle ${KOSTEN_EINTRAEGE.toLocaleString("de-DE")} Wörter EINMAL von einer
            guten Stimme aufnehmen zu lassen kostet rund ${kostenEuro(2.28)} € — einmalig, für
            immer. Das ist ein Monatsbeitrag von einer einzigen Person.
          </p>
          <button type="button" class="btn btn-ghost" id="premiumZurKostenseite" style="margin-top:10px;">💶 Die ganze Rechnung ansehen</button>
        </div>

        <div class="premium-spalten">
          <div class="premium-spalte">
            <h3>🆓 Das bleibt für immer kostenlos</h3>
            <p class="empty-note" style="margin:0 0 8px;">Nichts davon wird jemals hinter Premium wandern. Es war kostenlos, es bleibt kostenlos.</p>
            <ul class="kosten-liste">
              <li>Alle Übungen, alle Spiele, der Lernweg</li>
              <li>Die Bilderwelt mit allen Szenen und dem Baukasten</li>
              <li>Das Wörterbuch, der Aussprache- und der Betonungs-Trainer</li>
              <li>Der Dialekt-Bereich und der Umgangssprache-Umschalter</li>
              <li>Konto, Punkte, Ranking, Freunde, Postfach, eigene Beiträge</li>
              <li>Die Sprachausgabe aus deinem Gerät</li>
            </ul>
          </div>
          <div class="premium-spalte">
            <h3>✨ Was Premium dazugibt</h3>
            <p class="empty-note" style="margin:0 0 8px;">Ehrlich getrennt: was es schon gibt, und was erst daraus entstehen soll.</p>
            <div class="premium-locked-list">
              <div class="premium-item"><span>🙏 Du trägst die laufenden Kosten mit</span><span class="unlock-tag">sofort</span></div>
              <div class="premium-item"><span>📔 Dein Name in der Danke-Liste (wenn du magst)</span><span class="unlock-tag">sofort</span></div>
              <div class="premium-item"><span>🧪 Neue Spiele vorab testen</span><span class="unlock-tag">sofort</span></div>
              <div class="premium-item"><span>🎧 Echte Sprachaufnahmen statt Gerätestimme</span><span class="lock-tag">in Arbeit</span></div>
              <div class="premium-item"><span>📘 Grammatik-Hefte zum Ausdrucken</span><span class="lock-tag">geplant</span></div>
              <div class="premium-item"><span>🖼️ Mehr Speicherplatz für eigene Bilder</span><span class="lock-tag">geplant</span></div>
            </div>
            <p class="empty-note" style="margin-top:10px;">
              „In Arbeit“ und „geplant“ heißt: Es gibt sie noch nicht. Wer heute Premium nimmt,
              bezahlt den Betrieb — nicht ein Versprechen. Sobald etwas fertig ist, steht es hier
              ohne Sternchen.
            </p>
          </div>
        </div>
        ${miniBugReportBtnHtml("Premium-Seite")}
      </div>
    `;const a=document.getElementById("demoUnlock");a&&a.addEventListener("click",()=>{Backend.unlockPremiumDemo(),renderPremium()}),document.getElementById("premiumZurKostenseite")?.addEventListener("click",()=>{document.querySelector('.tape-tab[data-target="view-knowledge"]')?.click(),setTimeout(()=>{jumpToSubnavTarget('#knowledgeSubnav [data-sub="sub-kosten"]',"#kostenArea",40),renderKosten()},60)})},dmaTeilImpl[1705]=function(){try{const e=new URL(location.href);e.searchParams.set("frisch",String(Date.now())),location.replace(e.toString())}catch{location.reload()}},dmaTeilImpl[1706]=function(e){if(typeof window.dmaFassungKnopf=="function"){neueFassungGesagt=!0,window.dmaFassungKnopf(String(e));return}if(document.getElementById("dmaNeueFassung"))return;neueFassungGesagt=!0;const n=document.createElement("div");n.id="dmaNeueFassung",n.className="dma-neuestand",n.setAttribute("role","status"),n.innerHTML=`
      <span class="dma-neuestand-text">✨ Es gibt eine neuere Fassung der Seite
        (${e} statt ${escapeHtml(String(window.DMA_VERSION||"?"))}).
        Dein Gerät zeigt noch die alte — deshalb fehlen dir neue Knöpfe.</span>
      <button type="button" class="dma-neuestand-knopf" id="dmaNeueFassungLaden">Jetzt neu laden</button>
      <button type="button" class="dma-neuestand-zu" id="dmaNeueFassungZu" aria-label="Später">✕</button>`,document.body.appendChild(n),document.getElementById("dmaNeueFassungLaden")?.addEventListener("click",neueFassungLaden),document.getElementById("dmaNeueFassungZu")?.addEventListener("click",()=>n.remove())},dmaTeilImpl[1707]=function(){try{return Number(localStorage.getItem(UNTERRICHT_ZULETZT)||0)}catch{return 0}},dmaTeilImpl[1708]=function(){const e=unterrichtZuletzt();if(!e)return"";const n=Math.floor((Date.now()-e)/6e4);if(n<1)return"gerade eben";if(n<60)return"vor "+n+" Minute"+(n===1?"":"n");const t=Math.floor(n/60);if(t<24)return"vor "+t+" Stunde"+(t===1?"":"n");const a=Math.floor(t/24);return"vor "+a+" Tag"+(a===1?"":"en")},dmaTeilImpl[1709]=function(){const e=unterrichtHerWort();return`
      <div class="question-card" style="margin-top:14px;">
        <h3>🔔 Der Unterricht beginnt</h3>
        <p class="empty-note" style="margin-bottom:10px;">
          Ein Druck, und jede:r bekommt ins Postfach: du bist jetzt im Klassenzimmer und
          machst Unterricht. Danach landest du selbst direkt dort. Nur du siehst diesen Knopf.
        </p>
        <label style="display:block; font-size:0.78rem; opacity:.8; margin-bottom:4px;">
          Was in der Nachricht stehen soll:
        </label>
        <input type="text" class="challenge-select" id="unterrichtText" maxlength="240"
               style="width:100%;"
               value="Ich bin jetzt im Klassenzimmer und mache Unterricht — komm dazu, ich freue mich auf dich!">
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:10px;">
          <button type="button" class="btn btn-coffee" id="unterrichtGlocke">
            🔔 Alle einladen und ins Klassenzimmer
          </button>
        </div>
        ${e?`<p class="empty-note" style="margin:8px 0 0; font-size:0.74rem;">
          Zuletzt gerufen: ${e}. Du entscheidest, wann wieder — hier hält dich nichts auf.
        </p>`:""}
      </div>`},dmaTeilImpl[1710]=function(){const e=document.getElementById("unterrichtGlocke");e&&e.addEventListener("click",async()=>{const n=document.getElementById("unterrichtText"),t=(n?n.value:"").trim();if(!t){showToast("Schreib noch dazu, was du sagen möchtest.");return}if(confirm("Diese Nachricht geht an ALLE Mitglieder ins Postfach. Abschicken?")){e.disabled=!0;try{await Backend.sendBroadcastMessage(t);try{localStorage.setItem(UNTERRICHT_ZULETZT,String(Date.now()))}catch{}showToast("🔔 Die Einladung liegt in jedem Postfach. Bis gleich im Klassenzimmer!"),activateTab("view-knowledge"),setTimeout(()=>{const a=document.querySelector('.subnav-pill[data-sub="sub-livechat"]');a&&a.click()},320)}catch(a){e.disabled=!1,showToast("Das ging nicht: "+(a&&a.message?a.message:"unbekannter Fehler"))}}})},dmaTeilImpl[1711]=function(e){try{localStorage.setItem(TUTOR_SCHALTER,e?"an":"aus")}catch{}e||tutorSchliessen(!0),tutorReiterPflegen()},dmaTeilImpl[1712]=function(e){try{localStorage.setItem(TUTOR_ART,e==="comic"?"comic":"foto")}catch{}},dmaTeilImpl[1713]=function(e){return e&&(e.id==="lcFeld"||e.id==="lcSendeGifSuche"||e.id==="lcSendeGifAdresse"||e.id==="lcLink")},dmaTeilImpl[1714]=function(){try{if(window.DMA_FILM&&window.DMA_FILM.kannAlphaWebm)return!!window.DMA_FILM.kannAlphaWebm()}catch{}return!1},dmaTeilImpl[1715]=function(e){const n=document.getElementById("tutorMaske");if(!n)return!1;tutorMaskeStoppen();const t=n.getContext("webgl",{premultipliedAlpha:!0,alpha:!0})||n.getContext("experimental-webgl",{premultipliedAlpha:!0,alpha:!0});if(!t)return!1;const a=document.createElement("video");a.muted=!0,a.playsInline=!0,a.setAttribute("playsinline",""),a.crossOrigin="anonymous",a.src="tutor/video/"+e+"-maske.mp4"+(window.DMA_V?DMA_V("tutor/"):"?v="+(window.DMA_VERSION||"1"));const l="attribute vec2 p;varying vec2 t;void main(){t=vec2((p.x+1.0)/2.0,(1.0-p.y)/2.0);gl_Position=vec4(p,0.0,1.0);}",s="precision mediump float;varying vec2 t;uniform sampler2D b;void main(){vec3 c=texture2D(b,vec2(t.x*0.5,t.y)).rgb;float a=texture2D(b,vec2(t.x*0.5+0.5,t.y)).r;gl_FragColor=vec4(c*a,a);}",c=(i,u)=>{const o=t.createShader(i);return t.shaderSource(o,u),t.compileShader(o),o},r=t.createProgram();t.attachShader(r,c(t.VERTEX_SHADER,l)),t.attachShader(r,c(t.FRAGMENT_SHADER,s)),t.linkProgram(r),t.useProgram(r);const d=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,d),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW);const h=t.getAttribLocation(r,"p");t.enableVertexAttribArray(h),t.vertexAttribPointer(h,2,t.FLOAT,!1,0,0);const m=t.createTexture();t.bindTexture(t.TEXTURE_2D,m),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.clearColor(0,0,0,0),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA);let p=!0;const b=()=>{if(p){if(a.readyState>=2){n.width!==a.videoWidth/2&&a.videoWidth&&(n.width=Math.round(a.videoWidth/2),n.height=a.videoHeight,t.viewport(0,0,n.width,n.height));try{t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,a),t.clear(t.COLOR_BUFFER_BIT),t.drawArrays(t.TRIANGLE_STRIP,0,4),n.classList.add("tutor-video-da"),tutorFilmLaeuft(!0)}catch{}}requestAnimationFrame(b)}};a.onerror=()=>tutorMaskeStoppen(),a.onended=()=>tutorMaskeStoppen();const y=a.play();return y&&y.catch&&y.catch(()=>tutorMaskeStoppen()),requestAnimationFrame(b),tutorMaskeLauf={video:a,halt:()=>{p=!1}},!0};
//# sourceURL=min/app-teil-rest7.js
