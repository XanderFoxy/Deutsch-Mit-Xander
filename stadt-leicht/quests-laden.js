/* =====================================================================
   QUESTS NACHLADEN — FASSUNG 832
   ---------------------------------------------------------------------
   XANDER (Funk 213): „Bitte gestalte überall Quest innerhalb der Stadt
   mit Leuten die in Deutsch Hilfe brauchen … immer mal ein paar
   Missionen". Die Quests (quests.js, ≈ 40 KB) stecken nicht in der
   gebündelten leicht.min.js: der kleine Rahmen im Spiel soll nicht
   schwerer werden (Sonde 799: < 330 KB). Diese Vertretung steht in der
   Bündelung an ihrer Stelle, merkt sich schon jetzt, was das Spiel über
   die Schwächen sagt („leicht-kopf" → schwach), und holt quests.min.js
   erst, wenn die Stadt steht und eine Weile offen ist.
   ?quest=1 lädt sofort (und die erste Quest kommt gleich), ?quest=0 nie;
   im stillen Prüfbild (still=1) und unter Sonden (navigator.webdriver)
   kommen sie nur mit ?quest=1. Mit ?quelle=1 lädt quests.js direkt,
   dann tut diese Datei nichts.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  if (!ST || ST.quests || !window.LEICHT_QUESTS) return;
  const q = new URLSearchParams(location.search), wahl = q.get("quest");
  const info = (ST.questInfo = ST.questInfo || { schwach: [] });
  window.addEventListener("message", (ev) => {
    if (ev.origin !== location.origin || ev.source !== window.parent || !ev.data || ev.data.typ !== "leicht-kopf") return;
    if (Array.isArray(ev.data.schwach)) info.schwach = ev.data.schwach.filter((x) => typeof x === "string").slice(0, 40);
  });
  if (wahl === "0" || (wahl !== "1" && (q.get("still") === "1" || navigator.webdriver))) return;
  ST.quests = { vertretung: true };
  const holen = () => {
    const s = document.createElement("script");
    s.src = window.LEICHT_QUESTS; s.async = true;
    document.head.appendChild(s);
  };
  /* erst wenn die Stadt steht; im kleinen Rahmen 20 s später, im großen Bild 6 s */
  const warte = setInterval(() => {
    if (!window.__fertig) return;
    clearInterval(warte);
    setTimeout(holen, wahl === "1" ? 0 : q.get("mini") === "1" ? 20000 : 6000);
  }, 500);
})();
