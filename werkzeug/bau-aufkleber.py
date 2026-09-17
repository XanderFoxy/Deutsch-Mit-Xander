#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BEWEGTE AUFKLEBER FÜR DAS KLASSENZIMMER
=======================================

GEMELDET: „Die GIPHY-Bilder gehen immer noch nicht auszusuchen. Man kann
irgendwas reinschreiben, aber ich möchte, dass man anhand von Bildern
irgendwas auswählt … es ist schon eine Auswahl da, die hat dann zwar noch
eine eigene Suche, aber man soll schon diese Vorschaubilder angezeigt
bekommen."

WARUM DAS BISHER NICHT GING: die Suche lief über den öffentlichen
Beta-Schlüssel von GIPHY (dc6zaTOxFJmzC). Den gibt es seit Jahren nur noch
dem Namen nach — er antwortet mit einem Fehler, und der Kasten blieb leer.
Ohne eigenen Schlüssel war da also nie etwas zu sehen, egal was man
eingetippt hat.

DIE LÖSUNG: eine eigene Auswahl, die zum Haus gehört und niemanden um
Erlaubnis fragen muss. Diese Aufkleber sind SVG — also Zeichnungen, keine
Fotos — und sie bewegen sich über CSS-Animationen, die im SVG selbst
stehen. Sie sind winzig (ein bis drei Kilobyte), sie laufen ohne Netz,
sie sehen in jeder Grösse scharf aus, und sie funktionieren in jedem
Browser, der auch den Rest der Seite anzeigt.

Die GIPHY-Suche bleibt daneben bestehen — wer einen eigenen Schlüssel
einträgt (window.GIPHY_KEY in supabase-config.js), bekommt sie zusätzlich.

    python3 werkzeug/bau-aufkleber.py
"""

import os

HIER = os.path.dirname(os.path.abspath(__file__))
ZIEL = os.path.join(os.path.dirname(HIER), "sticker")


def huelle(inhalt, breite=120, hoehe=120, stil=""):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
        'width="%d" height="%d">\n'
        "<style>\n"
        "  * { transform-box: fill-box; transform-origin: 50%% 50%%; }\n"
        "  @media (prefers-reduced-motion: reduce) {\n"
        "    * { animation: none !important; }\n"
        "  }\n"
        "%s"
        "</style>\n"
        "%s\n</svg>\n" % (breite, hoehe, breite, hoehe, stil, inhalt)
    )


# ---------------------------------------------------------------
# Ein Gesicht als Grundform — damit alle Aufkleber zusammenpassen
# ---------------------------------------------------------------
def gesicht(farbe, inneres, stil="", klasse="kopf"):
    return huelle(
        '<g class="%s">'
        '<circle cx="60" cy="60" r="46" fill="%s"/>'
        '<circle cx="60" cy="60" r="46" fill="none" stroke="rgba(0,0,0,.14)" stroke-width="3"/>'
        "%s</g>" % (klasse, farbe, inneres),
        stil=stil,
    )


AUGE = '<circle cx="%d" cy="50" r="6" fill="#2b2118"/>'
GELB = "#f7c948"

AUFKLEBER = {}

# --- lachen: der Kopf wackelt, der Mund geht auf und zu ----------
AUFKLEBER["lachen"] = gesicht(
    GELB,
    (AUGE % 44) + (AUGE % 76)
    + '<path class="mund" d="M38 68 Q60 96 82 68 Z" fill="#8c3b2e"/>'
    + '<ellipse class="mund" cx="60" cy="70" rx="10" ry="4" fill="#e8848a"/>',
    stil=(
        "  .kopf { animation: wack 0.7s ease-in-out infinite; }\n"
        "  .mund { animation: mund 0.7s ease-in-out infinite; }\n"
        "  @keyframes wack { 0%,100%{transform:rotate(-7deg)} 50%{transform:rotate(7deg)} }\n"
        "  @keyframes mund { 0%,100%{transform:scaleY(.6)} 50%{transform:scaleY(1.15)} }\n"
    ),
)

# --- winken: eine Hand, die winkt --------------------------------
AUFKLEBER["winken"] = huelle(
    '<g class="hand">'
    '<path d="M46 104 L46 62 Q46 54 53 54 Q60 54 60 62 L60 44 Q60 36 67 36 '
    "Q74 36 74 44 L74 40 Q74 32 81 32 Q88 32 88 40 L88 60 Q88 90 70 104 Z\" "
    'fill="#f3b57b" stroke="rgba(0,0,0,.16)" stroke-width="2.5" stroke-linejoin="round"/>'
    '<path d="M46 74 Q34 66 30 74 Q28 82 40 88" fill="#f3b57b" '
    'stroke="rgba(0,0,0,.16)" stroke-width="2.5"/>'
    "</g>",
    stil=(
        "  .hand { animation: winken 0.9s ease-in-out infinite; transform-origin: 50% 90%; }\n"
        "  @keyframes winken { 0%,100%{transform:rotate(-16deg)} 50%{transform:rotate(16deg)} }\n"
    ),
)

# --- daumen: geht hoch und runter --------------------------------
AUFKLEBER["daumen"] = huelle(
    '<g class="dm">'
    '<rect x="26" y="56" width="20" height="44" rx="5" fill="#e0a06a" '
    'stroke="rgba(0,0,0,.16)" stroke-width="2.5"/>'
    '<path d="M50 100 L50 58 Q50 50 58 44 Q66 38 64 26 Q63 18 70 18 '
    "Q78 18 80 28 Q82 40 76 52 L92 52 Q100 52 100 60 L96 92 Q95 100 87 100 Z\" "
    'fill="#f3b57b" stroke="rgba(0,0,0,.16)" stroke-width="2.5" stroke-linejoin="round"/>'
    "</g>",
    stil=(
        "  .dm { animation: hoch 0.85s ease-in-out infinite; }\n"
        "  @keyframes hoch { 0%,100%{transform:translateY(5px) rotate(-4deg)} "
        "50%{transform:translateY(-6px) rotate(4deg)} }\n"
    ),
)

# --- herz: schlägt (lub-dub) -------------------------------------
AUFKLEBER["herz"] = huelle(
    '<g class="hz">'
    '<path d="M60 100 C20 74 14 48 30 36 C44 26 57 34 60 44 '
    'C63 34 76 26 90 36 C106 48 100 74 60 100 Z" fill="#e0546a"/>'
    '<ellipse cx="42" cy="46" rx="8" ry="5" fill="rgba(255,255,255,.45)" '
    'transform="rotate(-30 42 46)"/>'
    "</g>",
    stil=(
        "  .hz { animation: puls 1.1s cubic-bezier(.35,0,.3,1) infinite; }\n"
        "  @keyframes puls { 0%,38%,100%{transform:scale(1)} "
        "9%{transform:scale(1.28)} 17%{transform:scale(1.02)} 26%{transform:scale(1.16)} }\n"
    ),
)

# --- klatschen: zwei Hände, die zusammenschlagen ----------------
AUFKLEBER["klatschen"] = huelle(
    '<g class="li">'
    '<path d="M40 96 L40 56 Q40 46 48 46 Q56 46 56 56 L56 96 Z" fill="#f3b57b"/>'
    '<path d="M24 96 L24 62 Q24 52 32 52 Q40 52 40 62 L40 96 Z" fill="#e8a768"/>'
    '<path d="M22 92 q-8 -10 -2 -18 q6 -6 10 2" fill="#e8a768"/>'
    '<rect x="20" y="90" width="38" height="16" rx="7" fill="#f3b57b"/>'
    '</g>'
    '<g class="re">'
    '<path d="M80 96 L80 56 Q80 46 72 46 Q64 46 64 56 L64 96 Z" fill="#e8a768"/>'
    '<path d="M96 96 L96 62 Q96 52 88 52 Q80 52 80 62 L80 96 Z" fill="#d9975c"/>'
    '<path d="M98 92 q8 -10 2 -18 q-6 -6 -10 2" fill="#d9975c"/>'
    '<rect x="62" y="90" width="38" height="16" rx="7" fill="#e8a768"/>'
    '</g>'
    '<g class="fz" opacity="0">'
    '<path d="M60 34 L60 18 M40 40 L30 28 M80 40 L90 28 M26 58 L12 54 M94 58 L108 54" '
    'stroke="#f7c948" stroke-width="4" stroke-linecap="round"/></g>',
    stil=(
        "  .li { animation: kli 0.42s ease-in-out infinite; }\n"
        "  .re { animation: kre 0.42s ease-in-out infinite; }\n"
        "  .fz { animation: fz 0.42s ease-out infinite; }\n"
        "  @keyframes kli { 0%,100%{transform:translateX(-13px) rotate(-12deg)} "
        "50%{transform:translateX(3px) rotate(0)} }\n"
        "  @keyframes kre { 0%,100%{transform:translateX(13px) rotate(12deg)} "
        "50%{transform:translateX(-3px) rotate(0)} }\n"
        "  @keyframes fz { 0%,44%{opacity:0} 56%{opacity:.95} 100%{opacity:0} }\n"
    ),
)

# --- denken: eine Gedankenblase mit Punkten ----------------------
AUFKLEBER["denken"] = huelle(
    '<ellipse cx="66" cy="46" rx="42" ry="28" fill="#fdf8f0" '
    'stroke="rgba(0,0,0,.18)" stroke-width="2.5"/>'
    '<circle cx="34" cy="82" r="9" fill="#fdf8f0" stroke="rgba(0,0,0,.18)" stroke-width="2.5"/>'
    '<circle cx="21" cy="98" r="5" fill="#fdf8f0" stroke="rgba(0,0,0,.18)" stroke-width="2.5"/>'
    '<circle class="p1" cx="48" cy="46" r="5.5" fill="#8a7a66"/>'
    '<circle class="p2" cx="66" cy="46" r="5.5" fill="#8a7a66"/>'
    '<circle class="p3" cx="84" cy="46" r="5.5" fill="#8a7a66"/>',
    stil=(
        "  .p1,.p2,.p3 { animation: tupf 1.3s ease-in-out infinite; }\n"
        "  .p2 { animation-delay: .18s } .p3 { animation-delay: .36s }\n"
        "  @keyframes tupf { 0%,100%{opacity:.25;transform:translateY(0)} "
        "45%{opacity:1;transform:translateY(-5px)} }\n"
    ),
)

# --- schlafen: Zs steigen auf ------------------------------------
AUFKLEBER["schlafen"] = gesicht(
    "#b8a6d6",
    '<path d="M36 50 Q44 44 52 50" stroke="#2b2118" stroke-width="4" '
    'fill="none" stroke-linecap="round"/>'
    '<path d="M68 50 Q76 44 84 50" stroke="#2b2118" stroke-width="4" '
    'fill="none" stroke-linecap="round"/>'
    '<ellipse cx="60" cy="76" rx="9" ry="7" fill="#6b4a3f"/>'
    '<text class="z1" x="92" y="36" font-size="22" font-family="Georgia,serif" '
    'fill="#6b5a86" font-weight="bold">z</text>'
    '<text class="z2" x="100" y="22" font-size="16" font-family="Georgia,serif" '
    'fill="#6b5a86" font-weight="bold">z</text>',
    stil=(
        "  .z1,.z2 { animation: steigt 2.1s ease-in-out infinite; }\n"
        "  .z2 { animation-delay: .7s }\n"
        "  @keyframes steigt { 0%{opacity:0;transform:translateY(6px) scale(.7)} "
        "35%{opacity:1} 100%{opacity:0;transform:translateY(-16px) scale(1.15)} }\n"
    ),
)

# --- weinen: eine Träne fällt ------------------------------------
AUFKLEBER["weinen"] = gesicht(
    "#8fc4e8",
    (AUGE % 44) + (AUGE % 76)
    + '<path d="M40 82 Q60 66 80 82" stroke="#2b2118" stroke-width="4.5" '
    'fill="none" stroke-linecap="round"/>'
    + '<path class="tr" d="M44 60 q-5 9 0 13 q6 4 6-3 q0-5-6-10 z" fill="#4a9fd8"/>',
    stil=(
        "  .tr { animation: faellt 1.6s ease-in infinite; }\n"
        "  @keyframes faellt { 0%{opacity:0;transform:translateY(0)} "
        "18%{opacity:1} 100%{opacity:0;transform:translateY(42px)} }\n"
    ),
)

# --- feuer/begeistert: Flamme ------------------------------------
AUFKLEBER["feuer"] = huelle(
    '<g class="fl"><path d="M60 104 C28 96 24 68 42 48 C44 60 52 62 54 54 '
    'C58 36 50 28 60 14 C72 30 92 42 92 68 C92 90 78 100 60 104 Z" fill="#e0642a"/></g>'
    '<g class="fl2"><path d="M60 100 C44 94 42 76 54 64 C56 74 62 74 64 68 '
    'C68 56 62 52 68 42 C78 54 80 66 80 76 C80 90 72 98 60 100 Z" fill="#f7c948"/></g>',
    stil=(
        "  .fl { animation: lodern 0.66s ease-in-out infinite; }\n"
        "  .fl2 { animation: lodern2 0.48s ease-in-out infinite; }\n"
        "  @keyframes lodern { 0%,100%{transform:scaleY(1) scaleX(1)} "
        "50%{transform:scaleY(1.08) scaleX(.94)} }\n"
        "  @keyframes lodern2 { 0%,100%{transform:scaleY(.92) translateY(2px)} "
        "50%{transform:scaleY(1.1) translateY(-2px)} }\n"
    ),
)

# --- stern: funkelt ----------------------------------------------
AUFKLEBER["stern"] = huelle(
    '<g class="st"><path d="M60 12 L72 46 L108 48 L79 69 L90 104 L60 83 '
    'L30 104 L41 69 L12 48 L48 46 Z" fill="#f7c948" '
    'stroke="rgba(0,0,0,.14)" stroke-width="2.5" stroke-linejoin="round"/></g>'
    '<g class="fk"><path d="M100 22 L100 34 M94 28 L106 28" stroke="#fff3c4" '
    'stroke-width="3" stroke-linecap="round"/></g>',
    stil=(
        "  .st { animation: dreh 2.6s ease-in-out infinite; }\n"
        "  .fk { animation: funkel 1.3s ease-in-out infinite; }\n"
        "  @keyframes dreh { 0%,100%{transform:rotate(-10deg) scale(.96)} "
        "50%{transform:rotate(10deg) scale(1.05)} }\n"
        "  @keyframes funkel { 0%,100%{opacity:0;transform:scale(.5)} "
        "50%{opacity:1;transform:scale(1.2)} }\n"
    ),
)

# --- fuchs: der Kopf schaut hin und her --------------------------
AUFKLEBER["fuchs"] = huelle(
    '<g class="kopf">'
    '<path d="M22 40 L30 12 L50 28 Z" fill="#e0642a"/>'
    '<path d="M98 40 L90 12 L70 28 Z" fill="#e0642a"/>'
    '<path d="M60 26 C90 26 100 48 100 64 C100 86 82 102 60 102 '
    'C38 102 20 86 20 64 C20 48 30 26 60 26 Z" fill="#e8763a"/>'
    '<path d="M60 62 C74 62 86 70 86 80 C86 92 74 102 60 102 '
    'C46 102 34 92 34 80 C34 70 46 62 60 62 Z" fill="#fdf1e2"/>'
    '<circle cx="46" cy="58" r="5.5" fill="#2b2118"/>'
    '<circle cx="74" cy="58" r="5.5" fill="#2b2118"/>'
    '<path d="M60 76 l-7 -6 h14 z" fill="#2b2118"/>'
    "</g>",
    stil=(
        "  .kopf { animation: schau 2.4s ease-in-out infinite; }\n"
        "  @keyframes schau { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }\n"
    ),
)

# --- kaffee: Dampf steigt ----------------------------------------
AUFKLEBER["kaffee"] = huelle(
    '<path d="M26 52 h56 v26 a28 28 0 0 1 -56 0 z" fill="#fdf8f0" '
    'stroke="rgba(0,0,0,.2)" stroke-width="3"/>'
    '<path d="M82 58 h10 a12 12 0 0 1 0 24 h-10" fill="none" '
    'stroke="rgba(0,0,0,.2)" stroke-width="3"/>'
    '<path d="M30 58 h48 v18 a24 24 0 0 1 -48 0 z" fill="#6b4a3f"/>'
    '<rect x="16" y="100" width="76" height="7" rx="3.5" fill="rgba(0,0,0,.2)"/>'
    '<g class="d1"><path d="M42 44 q6 -8 0 -16 q-6 -8 0 -14" stroke="#cbbfae" '
    'stroke-width="3.5" fill="none" stroke-linecap="round"/></g>'
    '<g class="d2"><path d="M64 44 q6 -8 0 -16 q-6 -8 0 -14" stroke="#cbbfae" '
    'stroke-width="3.5" fill="none" stroke-linecap="round"/></g>',
    stil=(
        "  .d1,.d2 { animation: dampf 2.3s ease-in-out infinite; }\n"
        "  .d2 { animation-delay: .8s }\n"
        "  @keyframes dampf { 0%{opacity:0;transform:translateY(8px) scale(.8)} "
        "30%{opacity:.9} 100%{opacity:0;transform:translateY(-12px) scale(1.15)} }\n"
    ),
)

# --- party: Konfetti aus einer Tüte ------------------------------
AUFKLEBER["party"] = huelle(
    '<path d="M18 104 L46 40 L82 76 Z" fill="#e0964a" '
    'stroke="rgba(0,0,0,.16)" stroke-width="2.5" stroke-linejoin="round"/>'
    '<g class="k1"><rect x="62" y="20" width="9" height="13" rx="2" fill="#e0546a"/></g>'
    '<g class="k2"><rect x="84" y="34" width="8" height="12" rx="2" fill="#4a86c9"/></g>'
    '<g class="k3"><circle cx="96" cy="18" r="5" fill="#5aa86b"/></g>'
    '<g class="k4"><rect x="74" y="52" width="8" height="11" rx="2" fill="#9a5ac9"/></g>',
    stil=(
        "  .k1,.k2,.k3,.k4 { animation: flieg 1.25s ease-out infinite; }\n"
        "  .k2 { animation-delay:.2s } .k3 { animation-delay:.42s } .k4 { animation-delay:.62s }\n"
        "  @keyframes flieg { 0%{opacity:0;transform:translate(-22px,26px) rotate(0)} "
        "22%{opacity:1} 100%{opacity:0;transform:translate(14px,-22px) rotate(220deg)} }\n"
    ),
)

# --- nachdenken/fragezeichen -------------------------------------
AUFKLEBER["frage"] = huelle(
    '<g class="fr"><text x="60" y="92" font-size="96" font-family="Georgia,serif" '
    'font-weight="bold" fill="#4a86c9" text-anchor="middle">?</text></g>',
    stil=(
        "  .fr { animation: kipp 1.5s ease-in-out infinite; }\n"
        "  @keyframes kipp { 0%,100%{transform:rotate(-12deg) scale(.95)} "
        "50%{transform:rotate(12deg) scale(1.06)} }\n"
    ),
)

# --- ok/haken ----------------------------------------------------
AUFKLEBER["fertig"] = huelle(
    '<circle class="ri" cx="60" cy="60" r="44" fill="none" stroke="#5aa86b" stroke-width="7"/>'
    '<path class="hk" d="M36 62 L54 80 L86 42" fill="none" stroke="#5aa86b" '
    'stroke-width="9" stroke-linecap="round" stroke-linejoin="round" '
    'stroke-dasharray="90" stroke-dashoffset="0"/>',
    stil=(
        "  .hk { animation: malen 1.8s ease-in-out infinite; }\n"
        "  .ri { animation: atmen 1.8s ease-in-out infinite; }\n"
        "  @keyframes malen { 0%{stroke-dashoffset:90} 35%,100%{stroke-dashoffset:0} }\n"
        "  @keyframes atmen { 0%,100%{transform:scale(1)} 35%{transform:scale(1.07)} }\n"
    ),
)

# --- blume: wächst und wiegt sich --------------------------------
AUFKLEBER["blume"] = huelle(
    '<g class="bl">'
    '<path d="M60 108 L60 56" stroke="#5aa86b" stroke-width="6" stroke-linecap="round"/>'
    '<path d="M60 82 q-20 -6 -24 -20 q18 -2 24 14" fill="#5aa86b"/>'
    '<g class="kopf">'
    '<circle cx="60" cy="32" r="13" fill="#f7c948"/>'
    '<circle cx="60" cy="10" r="12" fill="#e8848a"/>'
    '<circle cx="82" cy="32" r="12" fill="#e8848a"/>'
    '<circle cx="60" cy="54" r="12" fill="#e8848a"/>'
    '<circle cx="38" cy="32" r="12" fill="#e8848a"/>'
    '<circle cx="60" cy="32" r="10" fill="#f7c948"/>'
    "</g></g>",
    stil=(
        "  .bl { animation: wiegen 2.8s ease-in-out infinite; transform-origin: 50% 95%; }\n"
        "  .kopf { animation: drehen 5.5s linear infinite; }\n"
        "  @keyframes wiegen { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }\n"
        "  @keyframes drehen { to { transform: rotate(360deg) } }\n"
    ),
)

# --- regenbogen --------------------------------------------------
AUFKLEBER["regenbogen"] = huelle(
    "".join(
        '<path class="b%d" d="M%d 100 a%d %d 0 0 1 %d 0" fill="none" stroke="%s" '
        'stroke-width="9" stroke-linecap="round"/>'
        % (i, 12 + i * 9, 48 - i * 9, 48 - i * 9, (48 - i * 9) * 2, f)
        for i, f in enumerate(["#e0546a", "#e0964a", "#f7c948", "#5aa86b", "#4a86c9"])
    ),
    stil=(
        "  .b0,.b1,.b2,.b3,.b4 { animation: leuchten 2.2s ease-in-out infinite; }\n"
        "  .b1{animation-delay:.12s} .b2{animation-delay:.24s}\n"
        "  .b3{animation-delay:.36s} .b4{animation-delay:.48s}\n"
        "  @keyframes leuchten { 0%,100%{opacity:.6} 50%{opacity:1} }\n"
    ),
)

# --- schnee: eine Wolke, aus der Flocken fallen ------------------
AUFKLEBER["schnee"] = huelle(
    '<path d="M32 50 a18 18 0 0 1 17 -17 a22 22 0 0 1 41 6 a15 15 0 0 1 -3 29 '
    'H36 a15 15 0 0 1 -4 -18 z" fill="#dce9f2" '
    'stroke="rgba(70,100,130,.25)" stroke-width="2.5" stroke-linejoin="round"/>'
    + "".join(
        '<g class="f%d"><path d="M%d 74 v18 M%d 78 l-6 6 M%d 78 l6 6 '
        'M%d 88 l-6 -6 M%d 88 l6 -6" stroke="#8fc4e8" stroke-width="3" '
        'stroke-linecap="round"/></g>' % (i, x, x, x, x, x)
        for i, x in enumerate([34, 52, 70, 88])
    ),
    stil=(
        "  .f0,.f1,.f2,.f3 { animation: rieseln 2.4s linear infinite; }\n"
        "  .f1{animation-delay:.6s} .f2{animation-delay:1.2s} .f3{animation-delay:1.8s}\n"
        "  @keyframes rieseln { 0%{opacity:0;transform:translateY(-10px) rotate(0)} "
        "20%{opacity:1} 80%{opacity:1} "
        "100%{opacity:0;transform:translateY(32px) rotate(180deg)} }\n"
    ),
)


def main():
    os.makedirs(ZIEL, exist_ok=True)
    for name, inhalt in sorted(AUFKLEBER.items()):
        pfad = os.path.join(ZIEL, name + ".svg")
        with open(pfad, "w", encoding="utf-8") as f:
            f.write(inhalt)
        print("%-14s %5d Bytes" % (name, len(inhalt.encode("utf-8"))))
    print("\n%d Aufkleber in %s" % (len(AUFKLEBER), ZIEL))


if __name__ == "__main__":
    main()
