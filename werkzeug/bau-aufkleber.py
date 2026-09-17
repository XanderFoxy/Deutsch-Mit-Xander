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
import math

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

# --- winken: eine Hand mit vier Fingern und Daumen, die wedelt ----
AUFKLEBER["winken"] = huelle(
    '<g class="hand">'
    # Handflaeche
    '<path d="M36 108 L36 64 Q36 52 48 52 L82 52 Q94 52 94 64 L94 84 '
    'Q94 104 76 112 L52 112 Q40 110 36 108 Z" fill="#f3b57b" '
    'stroke="rgba(120,70,30,.4)" stroke-width="2.5" stroke-linejoin="round"/>'
    # vier Finger
    '<rect x="40" y="30" width="12" height="34" rx="6" fill="#f6c090" '
    'stroke="rgba(120,70,30,.4)" stroke-width="2.2"/>'
    '<rect x="54" y="22" width="12" height="42" rx="6" fill="#f6c090" '
    'stroke="rgba(120,70,30,.4)" stroke-width="2.2"/>'
    '<rect x="68" y="26" width="12" height="38" rx="6" fill="#f6c090" '
    'stroke="rgba(120,70,30,.4)" stroke-width="2.2"/>'
    '<rect x="82" y="34" width="11" height="30" rx="5.5" fill="#f6c090" '
    'stroke="rgba(120,70,30,.4)" stroke-width="2.2"/>'
    # Daumen
    '<path d="M36 74 Q22 68 18 78 Q15 90 30 96" fill="#f3b57b" '
    'stroke="rgba(120,70,30,.4)" stroke-width="2.5" stroke-linecap="round"/>'
    '</g>'
    # Bewegungsstriche
    '<g class="str"><path d="M104 46 q8 6 0 14 M108 36 q14 12 0 30" '
    'stroke="#e0964a" stroke-width="3" fill="none" stroke-linecap="round"/></g>',
    stil=(
        "  .hand { animation: winken 0.8s ease-in-out infinite; "
        "transform-origin: 50% 92%; }\n"
        "  .str { animation: strich 0.8s ease-in-out infinite; }\n"
        "  @keyframes winken { 0%,100%{transform:rotate(-18deg)} "
        "50%{transform:rotate(18deg)} }\n"
        "  @keyframes strich { 0%,100%{opacity:.15;transform:translateX(-4px)} "
        "50%{opacity:.9;transform:translateX(3px)} }\n"
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
    "</g>",
    # GEMELDET: „Bei dem Herz, das schlaegt, ist links ein kleines
    # weisses Symbol. Ich weiss nicht, was das sein soll — das muss da
    # gar nicht hin."
    #
    # Es war ein GLANZLICHT: eine weisse Ellipse, die eine Spiegelung
    # auf einer glaenzenden Oberflaeche andeuten sollte. Sie stand
    # schief im Herz, weil sie ein transform="rotate(-30 42 46)" trug —
    # und der Drehpunkt darin wird von der Regel
    # „* { transform-origin: 50% 50% }" im Kopf dieser Datei
    # ueberschrieben. Statt sich an Ort und Stelle zu neigen, wanderte
    # sie dabei zur Seite. Ein Fleck, der nicht dort sitzt, wo Licht
    # auftreffen wuerde, sieht nicht nach Glanz aus, sondern nach
    # einem fremden Zeichen. Weg damit.
    stil=(
        "  .hz { animation: puls 1.1s cubic-bezier(.35,0,.3,1) infinite; }\n"
        "  @keyframes puls { 0%,38%,100%{transform:scale(1)} "
        "9%{transform:scale(1.28)} 17%{transform:scale(1.02)} 26%{transform:scale(1.16)} }\n"
    ),
)

# --- klatschen: zwei Haende von VORN, die zusammenschlagen --------
# GEMELDET: „Die klatschenden Haende sind keine richtigen Haende. Das
# sieht aus, als wenn zwei Wassereis aneinander klatschen."
#
# Das traf zu, und der Grund stand in der alten Zeichnung: die Hand war
# im PROFIL gezeichnet — eine abgerundete Flaeche auf einem Stiel. Von
# der Seite sieht eine Hand aber immer aus wie ein Eis am Stiel, weil
# genau das fehlt, woran man eine Hand erkennt: die einzelnen Finger
# und der abgespreizte Daumen.
#
# Jetzt von VORN, leicht schraeg. Vier Finger stehen als getrennte
# Glieder nebeneinander, unterschiedlich lang (der Mittelfinger am
# laengsten, der kleine am kuerzesten — sonst wirkt es wie ein Kamm),
# der Daumen sitzt tiefer und zeigt nach aussen. Die Handflaeche ist
# unten breit und oben schmaler, wie ein Handballen eben ist.
def _hand(seite, haut, saum):
    """Eine Hand von vorn. seite = -1 links, +1 rechts."""
    sp = 1 if seite > 0 else -1
    # Fingerlaengen: klein, Ring, Mittel, Zeige — von aussen nach innen.
    finger = [(20, 46), (31, 38), (42, 34), (53, 40)]
    glieder = "".join(
        '<rect x="%d" y="%d" width="9.5" height="%d" rx="4.75" fill="%s" '
        'stroke="%s" stroke-width="2"/>' % (x, y, 92 - y, haut, saum)
        for x, y in finger
    )
    # Die Fugen zwischen den Fingern — ohne sie verschmelzen sie zu
    # einer Flaeche, sobald der Aufkleber klein dargestellt wird.
    fugen = "".join(
        '<line x1="%.1f" y1="%d" x2="%.1f" y2="86" stroke="%s" '
        'stroke-width="1.5" opacity=".5"/>' % (x + 9.5 + 0.9, y + 8, x + 9.5 + 0.9, y)
        for x, y in finger[:-1]
    )
    return (
        '<g class="raum" transform="translate(%d 0) scale(%d 1) rotate(%d 46 76)">'
        % (60 if sp > 0 else 60, sp, -12)
        # Handgelenk
        + '<path d="M26 104 Q26 96 34 95 L58 95 Q66 96 66 104 L66 116 L26 116 Z" '
          'fill="%s" stroke="%s" stroke-width="2.2" stroke-linejoin="round"/>' % (haut, saum)
        # Die Finger stehen HINTER der Handflaeche, damit die Flaeche
        # ihre Wurzeln verdeckt und keine Kanten quer ueber sie laufen.
        + glieder
        # Daumen: tiefer angesetzt, nach aussen abgespreizt
        + '<g class="raum" transform="rotate(-38 18 84)">'
          '<rect x="8" y="62" width="11" height="26" rx="5.5" fill="%s" '
          'stroke="%s" stroke-width="2"/></g>' % (haut, saum)
        # Handflaeche
        + '<path d="M18 92 Q18 70 24 64 L60 64 Q68 70 68 92 Q68 100 58 100 '
          'L28 100 Q18 100 18 92 Z" fill="%s" stroke="%s" stroke-width="2.2" '
          'stroke-linejoin="round"/>' % (haut, saum)
        + fugen
        # Die Lebenslinie — eine einzige weiche Falte reicht, damit die
        # Flaeche nicht leer wirkt.
        + '<path d="M28 70 Q34 84 46 88" stroke="%s" stroke-width="1.8" '
          'fill="none" opacity=".45" stroke-linecap="round"/>' % saum
        + "</g>"
    )


AUFKLEBER["klatschen"] = huelle(
    '<g class="li">' + _hand(-1, "#f3b57b", "rgba(120,70,30,.5)") + '</g>'
    '<g class="re">' + _hand(1, "#e8a768", "rgba(120,70,30,.5)") + '</g>'
    '<g class="fz" opacity="0">'
    '<path d="M60 26 L60 10 M40 32 L30 18 M80 32 L90 18 '
    'M26 52 L10 46 M94 52 L110 46" '
    'stroke="#f7c948" stroke-width="4" stroke-linecap="round"/></g>',
    stil=(
        "  .li { animation: kli 0.42s ease-in-out infinite; }\n"
        "  .re { animation: kre 0.42s ease-in-out infinite; }\n"
        "  .fz { animation: fz 0.42s ease-out infinite; }\n"
        # Beim Zusammenschlagen kippen die Haende leicht nach vorn und
        # werden einen Hauch schmaler — so sieht man den Aufprall.
        "  @keyframes kli { 0%,100%{transform:translateX(-19px) rotate(-10deg) scaleX(1)} "
        "48%{transform:translateX(2px) rotate(2deg) scaleX(.94)} }\n"
        "  @keyframes kre { 0%,100%{transform:translateX(19px) rotate(10deg) scaleX(1)} "
        "48%{transform:translateX(-2px) rotate(-2deg) scaleX(.94)} }\n"
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
# GEMELDET: „Aus der Wolke fallen Sterne — sollen das eigentlich
# Regentropfen sein? Ich weiss es nicht."
#
# Genau das war der Fehler: die Flocke war ein Stern aus fuenf geraden
# Strichen durch einen Punkt. So sieht kein Schneekristall aus, und
# weil sie sich beim Fallen auch noch drehte, las man sie als
# funkelnden Stern.
#
# Eine echte Flocke hat SECHS Arme (nicht fuenf), und an jedem Arm
# sitzen zwei kleine Aeste schraeg nach aussen. Erst diese Aeste
# machen sie unverwechselbar; ohne sie ist jede Flocke ein Stern.
# Damit die Frage gar nicht erst aufkommt, gibt es den Regen jetzt
# ausserdem als eigenen Aufkleber mit richtigen Tropfen.
def _wolke(farbe="#dce9f2", saum="rgba(70,100,130,.25)"):
    return ('<path d="M32 50 a18 18 0 0 1 17 -17 a22 22 0 0 1 41 6 '
            'a15 15 0 0 1 -3 29 H36 a15 15 0 0 1 -4 -18 z" fill="%s" '
            'stroke="%s" stroke-width="2.5" stroke-linejoin="round"/>' % (farbe, saum))


def _flocke(x, y, farbe="#8fc4e8"):
    """Sechs Arme, jeder mit zwei Aesten — daran erkennt man Schnee.

    Die Punkte werden AUSGERECHNET, nicht gedreht. Ein
    transform="rotate(w x y)" waere hier naemlich wirkungslos bis
    schaedlich: die Regel „* { transform-origin: 50% 50% }" im Kopf
    dieser Datei ueberschreibt den Drehpunkt, und dann dreht sich jeder
    Arm um seine EIGENE Mitte statt um die Mitte der Flocke. Genau so
    zerfiel die Flocke beim ersten Versuch in drei versprengte Y.
    """
    lang, ast_bei, ast_lang = 11.0, 7.5, 4.6
    striche = []
    for i in range(6):
        w = math.radians(i * 60 - 90)
        dx, dy = math.cos(w), math.sin(w)
        ex, ey = x + dx * lang, y + dy * lang
        striche.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>' % (x, y, ex, ey))
        # Die beiden Aeste sitzen auf dem Arm und stehen 60 Grad ab.
        gx, gy = x + dx * ast_bei, y + dy * ast_bei
        for seite in (-60, 60):
            v = math.radians(i * 60 - 90 + seite)
            striche.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>'
                           % (gx, gy, gx + math.cos(v) * ast_lang, gy + math.sin(v) * ast_lang))
    return ('<g stroke="%s" stroke-width="2" stroke-linecap="round">%s</g>'
            % (farbe, "".join(striche)))


AUFKLEBER["schnee"] = huelle(
    _wolke()
    + "".join(
        '<g class="f%d">%s</g>' % (i, _flocke(x, 82))
        for i, x in enumerate([34, 52, 70, 88])
    ),
    stil=(
        "  .f0,.f1,.f2,.f3 { animation: rieseln 2.8s linear infinite; }\n"
        "  .f1{animation-delay:.7s} .f2{animation-delay:1.4s} .f3{animation-delay:2.1s}\n"
        # Schnee dreht sich nur SACHTE — eine halbe Umdrehung, nicht
        # mehr. Bei 180 Grad wie vorher funkelte sie wie ein Stern.
        "  @keyframes rieseln { 0%{opacity:0;transform:translateY(-12px) rotate(0)} "
        "20%{opacity:1} 80%{opacity:1} "
        "100%{opacity:0;transform:translateY(30px) rotate(60deg)} }\n"
    ),
)

# --- regen: dieselbe Wolke, aber mit richtigen Tropfen ------------
# Ein Tropfen ist oben spitz und unten rund — das ist der ganze
# Unterschied zum Stern, und er genuegt vollkommen.
AUFKLEBER["regen"] = huelle(
    _wolke("#cfdfe9", "rgba(60,90,120,.3)")
    + "".join(
        '<g class="t%d"><path d="M%d 72 q5.5 9 5.5 13.5 a5.5 5.5 0 0 1 -11 0 '
        'q0 -4.5 5.5 -13.5 z" fill="#5b9bd5" stroke="rgba(30,70,110,.35)" '
        'stroke-width="1.4"/></g>' % (i, x)
        for i, x in enumerate([36, 54, 72, 90])
    ),
    stil=(
        "  .t0,.t1,.t2,.t3 { animation: fallen 1.5s ease-in infinite; }\n"
        "  .t1{animation-delay:.38s} .t2{animation-delay:.75s} .t3{animation-delay:1.12s}\n"
        "  @keyframes fallen { 0%{opacity:0;transform:translateY(-8px) scaleY(.7)} "
        "18%{opacity:1;transform:translateY(0) scaleY(1)} "
        "82%{opacity:1} "
        "100%{opacity:0;transform:translateY(32px) scaleY(1.25)} }\n"
    ),
)


# ===============================================================
# NOCH MEHR AUSWAHL
# ---------------------------------------------------------------
# GEWUENSCHT: „Da koennen auch noch andere Sachen passieren."
# ===============================================================

# --- zwinkern -----------------------------------------------------
AUFKLEBER["zwinkern"] = gesicht(
    GELB,
    '<circle cx="44" cy="50" r="6" fill="#2b2118"/>'
    '<path class="lid" d="M68 50 Q76 44 84 50" stroke="#2b2118" stroke-width="4.5" '
    'fill="none" stroke-linecap="round"/>'
    '<path d="M42 72 Q60 86 78 72" stroke="#2b2118" stroke-width="4.5" '
    'fill="none" stroke-linecap="round"/>',
    stil=(
        "  .lid { animation: zwink 1.7s ease-in-out infinite; }\n"
        "  @keyframes zwink { 0%,72%,100%{transform:scaleY(1)} "
        "80%{transform:scaleY(.15)} 88%{transform:scaleY(1)} }\n"
    ),
)

# --- staunen ------------------------------------------------------
AUFKLEBER["staunen"] = gesicht(
    "#f6a96b",
    '<circle class="au" cx="44" cy="48" r="7" fill="#2b2118"/>'
    '<circle class="au" cx="76" cy="48" r="7" fill="#2b2118"/>'
    '<ellipse class="mu" cx="60" cy="78" rx="11" ry="14" fill="#8c3b2e"/>',
    stil=(
        "  .au { animation: gross 1.4s ease-in-out infinite; }\n"
        "  .mu { animation: gross2 1.4s ease-in-out infinite; }\n"
        "  @keyframes gross { 0%,100%{transform:scale(1)} 45%{transform:scale(1.35)} }\n"
        "  @keyframes gross2 { 0%,100%{transform:scale(1)} 45%{transform:scale(1.25)} }\n"
    ),
)

# --- nachdenken: eine Gluehbirne geht an --------------------------
AUFKLEBER["idee"] = huelle(
    '<g class="bi">'
    '<path d="M60 14 a26 26 0 0 1 16 46 q-4 4 -4 10 h-24 q0 -6 -4 -10 '
    'a26 26 0 0 1 16 -46 z" fill="#f7c948" '
    'stroke="rgba(120,90,20,.4)" stroke-width="2.5" stroke-linejoin="round"/>'
    '<path d="M48 78 h24 M50 86 h20 M54 94 h12" stroke="#a08050" '
    'stroke-width="4" stroke-linecap="round"/>'
    '</g>'
    '<g class="sk"><path d="M60 4 L60 -2 M28 22 L20 16 M92 22 L100 16 '
    'M16 52 L6 52 M104 52 L114 52" stroke="#f7c948" stroke-width="3.5" '
    'stroke-linecap="round"/></g>',
    stil=(
        "  .bi { animation: anaus 1.6s ease-in-out infinite; }\n"
        "  .sk { animation: strahlen 1.6s ease-in-out infinite; }\n"
        "  @keyframes anaus { 0%,100%{opacity:.45;filter:none} "
        "50%{opacity:1;filter:drop-shadow(0 0 10px rgba(247,201,72,.9))} }\n"
        "  @keyframes strahlen { 0%,100%{opacity:0;transform:scale(.8)} "
        "50%{opacity:.95;transform:scale(1.1)} }\n"
    ),
)

# --- schreiben: ein Stift, der schreibt ---------------------------
# GEMELDET: „Der Stift sieht nicht aus, als wenn er richtig schreibt."
#
# Der Fehler war handfest: die Linie lag bei y=108, die Stiftspitze
# wanderte aber bei y=96 — zwoelf Pixel darueber. Der Stift schwebte
# also ueber dem Papier und die Linie erschien von allein. Dazu lief
# die Linie IMMER von links nach rechts durch, egal wo der Stift gerade
# war; beim Zurueckwandern schrieb er rueckwaerts weiter.
#
# Jetzt liegt die Spitze GENAU auf der Linie (beide y=96), der Stift
# wandert nur einmal von links nach rechts, und die Linie wird im
# selben Takt aufgedeckt. Dazu ein Papierblatt, damit klar ist, worauf
# geschrieben wird, und ein zweiter, schon geschriebener Strich
# darueber — eine einzelne Linie sieht aus wie ein Unterstrich.
AUFKLEBER["schreiben"] = huelle(
    # Das Blatt
    '<rect x="10" y="20" width="100" height="92" rx="5" fill="#fdf8f0" '
    'stroke="rgba(90,70,45,.3)" stroke-width="2.2"/>'
    # Zwei bereits geschriebene Zeilen
    '<path d="M22 46 h60 M22 66 h72" stroke="rgba(74,134,201,.45)" '
    'stroke-width="3" stroke-linecap="round"/>'
    # Die Zeile, die gerade entsteht — sie beginnt und endet dort,
    # wo die Spitze beginnt und endet.
    '<g class="li"><path d="M22 96 h62" stroke="#4a86c9" stroke-width="3.6" '
    'stroke-linecap="round" stroke-dasharray="62" stroke-dashoffset="62"/></g>'
    # Der Stift. Die Spitze sitzt im Ursprung (0,0) der Gruppe, damit
    # das Verschieben sie genau auf der Zeile entlangfuehrt.
    '<g class="st">'
    '<g transform="translate(22 96)">'
    '<path d="M0 0 L6 -14 L34 -70 L48 -62 L20 -6 Z" fill="#e0964a" '
    'stroke="rgba(100,60,20,.45)" stroke-width="2.4" stroke-linejoin="round"/>'
    '<path d="M6 -14 L20 -6 L0 0 Z" fill="#f6dfc0" '
    'stroke="rgba(100,60,20,.45)" stroke-width="2.2" stroke-linejoin="round"/>'
    '<path d="M0 0 L3.5 -7.5 L10.5 -3.5 Z" fill="#2b2118"/>'
    '<path d="M34 -70 L48 -62 L52 -70 L38 -78 Z" fill="#c07a34" '
    'stroke="rgba(100,60,20,.45)" stroke-width="2.2" stroke-linejoin="round"/>'
    '</g></g>',
    stil=(
        # transform-box: fill-box wuerde den Ursprung in die Mitte des
        # Stiftes legen — hier soll aber in Zeichenkoordinaten
        # verschoben werden, sonst laeuft die Spitze an der Zeile vorbei.
        "  .st { transform-box: view-box; transform-origin: 0 0; "
        "animation: wandern 2.6s ease-in-out infinite; }\n"
        "  .li path { animation: malen 2.6s ease-in-out infinite; }\n"
        "  @keyframes wandern { 0%{transform:translateX(0)} "
        "62%{transform:translateX(62px)} 78%{transform:translateX(62px)} "
        "100%{transform:translateX(0)} }\n"
        "  @keyframes malen { 0%{stroke-dashoffset:62} 62%{stroke-dashoffset:0} "
        "78%{stroke-dashoffset:0} 100%{stroke-dashoffset:62} }\n"
    ),
)

# --- musik: Noten steigen auf -------------------------------------
# GEMELDET: „Die Noten gehoeren nicht zusammen, die sind irgendwie
# ganz eigenartig gebaut, die sehen nicht realistisch aus."
#
# Beides stimmte. Die alten Notenkoepfe sassen bei y=86 und y=80, der
# Balken darueber lief aber von y=84 nach y=78 — die Haelse endeten
# also NEBEN den Koepfen statt in ihnen, und der Balken hing frei in
# der Luft. Die einzelne Note hatte ausserdem ihre Faehnchen am
# falschen Ende und einen Hals, der links vom Kopf stand.
#
# So ist eine Note wirklich gebaut:
#   * der Kopf ist eine SCHRAEG gestellte Ellipse (etwa -20 Grad),
#   * der Hals sitzt RECHTS am Kopf und geht nach OBEN — er beruehrt
#     den Kopf an dessen rechtem Rand, nicht in der Mitte,
#   * bei zwei Achtelnoten verbindet ein BALKEN die oberen Enden
#     beider Haelse, und beide Haelse sind gleich lang,
#   * eine einzelne Achtelnote traegt statt des Balkens ein Faehnchen,
#     das vom oberen Ende des Halses nach rechts unten schwingt.
# Der Notenkopf bekommt ausserdem ein helles Loch — eine Viertelnote
# ist ausgefuellt, eine halbe nicht; das Loch macht den Unterschied
# sichtbar und die Form lesbarer.
def _note(x, y, farbe, hals_hoch=44, offen=False):
    """Ein Notenkopf mit Hals. Der Hals steht rechts und geht hinauf."""
    return (
        # rotate OHNE Drehpunkt: die Regel „* { transform-origin:
        # 50% 50% }" setzt den Drehpunkt ohnehin auf die Mitte der
        # eigenen Form — und das ist bei einer Ellipse genau ihr
        # Mittelpunkt. Mit einem zusaetzlichen Drehpunkt im Attribut
        # wird die Verschiebung ZWEIMAL gerechnet, und der Kopf
        # wandert vom Hals weg. Genau das war zu sehen.
        '<ellipse cx="%d" cy="%d" rx="11" ry="8" fill="%s" '
        'transform="rotate(-20)"/>' % (x, y, farbe)
        + ('<ellipse cx="%d" cy="%d" rx="5" ry="2.6" fill="#fdf8f0" '
           'transform="rotate(-20)"/>' % (x, y) if offen else "")
        + '<rect x="%.1f" y="%d" width="3.6" height="%d" fill="%s"/>'
          % (x + 8.4, y - hals_hoch - 2, hals_hoch + 4, farbe)
    )


AUFKLEBER["musik"] = huelle(
    # Zwei Achtelnoten mit gemeinsamem Balken
    '<g class="n1">'
    + _note(34, 88, "#9a5ac9", 46)
    + _note(66, 80, "#9a5ac9", 38)
    # Der Balken verbindet die OBEREN Enden beider Haelse: von
    # (34+8.4, 88-46-2) nach (66+8.4, 80-38-2) — also 40 nach 40.
    + '<path d="M42.4 40 L78 40 L78 51 L42.4 51 Z" fill="#9a5ac9"/>'
    + '</g>'
    # Eine einzelne Achtelnote mit Faehnchen
    '<g class="n2">'
    + _note(92, 50, "#4a86c9", 32)
    + '<path d="M100.4 16 q13 5 12 16 q-1 -8 -12 -10 z" fill="#4a86c9"/>'
    + '</g>',
    stil=(
        "  .n1 { animation: tanz 1.5s ease-in-out infinite; }\n"
        "  .n2 { animation: schweb 2.4s ease-in-out infinite; }\n"
        "  @keyframes tanz { 0%,100%{transform:rotate(-5deg) translateY(0)} "
        "50%{transform:rotate(5deg) translateY(-4px)} }\n"
        "  @keyframes schweb { 0%{opacity:0;transform:translateY(14px) scale(.7)} "
        "30%{opacity:1} 100%{opacity:0;transform:translateY(-22px) scale(1.15)} }\n"
    ),
)

# --- sonne: strahlend ---------------------------------------------
# GEWUENSCHT: „Eine strahlende Sonne wuerde in die Emojis auch noch
# passen."
#
# Strahlend heisst hier: die Strahlen sind nicht alle gleich. Eine
# Sonne mit zwoelf identischen Zacken sieht aus wie ein Zahnrad. Also
# abwechselnd lange und kurze Strahlen, dazu ein zweiter, weiterer
# Kranz aus Licht, der langsam atmet — das ist das Strahlen.
def _sonne_strahlen(n, lang_a, lang_b, r, breite, farbe, klasse=""):
    import math as _m
    teile = []
    for i in range(n):
        w = _m.radians(i * (360.0 / n) - 90)
        lang = lang_a if i % 2 == 0 else lang_b
        x1, y1 = 60 + _m.cos(w) * r, 60 + _m.sin(w) * r
        x2, y2 = 60 + _m.cos(w) * (r + lang), 60 + _m.sin(w) * (r + lang)
        teile.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>' % (x1, y1, x2, y2))
    return ('<g%s stroke="%s" stroke-width="%s" stroke-linecap="round">%s</g>'
            % (' class="%s"' % klasse if klasse else "", farbe, breite, "".join(teile)))


AUFKLEBER["sonne"] = huelle(
    # Der aeussere Lichtkranz — er atmet.
    '<circle class="hof" cx="60" cy="60" r="40" fill="rgba(247,201,72,.28)"/>'
    + _sonne_strahlen(16, 17, 10, 36, 5, "#f5b731", "str")
    + '<circle cx="60" cy="60" r="30" fill="#f7c948"/>'
    + '<circle cx="60" cy="60" r="30" fill="none" stroke="rgba(180,120,20,.25)" stroke-width="2.5"/>'
    # Ein warmer Kern, damit die Scheibe nicht flach wirkt
    + '<circle cx="52" cy="52" r="17" fill="rgba(255,240,180,.55)"/>',
    stil=(
        "  .str { animation: dreh 22s linear infinite; }\n"
        "  .hof { animation: atmen 3.2s ease-in-out infinite; }\n"
        "  @keyframes dreh { to { transform: rotate(360deg); } }\n"
        "  @keyframes atmen { 0%,100%{transform:scale(1);opacity:.55} "
        "50%{transform:scale(1.13);opacity:.95} }\n"
    ),
)

# --- umarmung: zwei Menschen, die sich wirklich umarmen -----------
# GEWUENSCHT: „Oder eine Umarmung, was realistisch aussieht."
#
# Realistisch heisst bei einer Umarmung vor allem eines: die Arme
# gehen UM den anderen HERUM, nicht daneben. Man muss sehen, dass ein
# Arm hinter dem Ruecken des anderen verschwindet. Deshalb ist die
# Zeichnung in Schichten gebaut:
#   1. der hintere Arm der linken Figur (er liegt hinter allem),
#   2. Koerper und Kopf der rechten Figur,
#   3. Koerper und Kopf der linken Figur,
#   4. der vordere Arm der rechten Figur (er liegt ueber allem).
# Dadurch greifen die Arme sichtbar umeinander. Die Koepfe neigen sich
# ausserdem gegeneinander — zwei gerade Koepfe nebeneinander sehen aus
# wie zwei Leute, die auf denselben Bus warten.
def _figur(mx, kopf_x, haut, kleid, neigung):
    """Eine Figur von vorn: Rumpf und Kopf.

    mx      Mitte des Rumpfes
    kopf_x  Mitte des Kopfes (er darf aus der Rumpfmitte wandern —
            genau das ist das Anlehnen)
    neigung Grad, um die sich der Kopf zum anderen hin neigt
    """
    return (
        # Rumpf: unten breit, oben schmaler — ein Oberkoerper, kein Rohr.
        '<path d="M%d 112 Q%d 74 %d 68 Q%d 74 %d 112 Z" fill="%s" '
        'stroke="rgba(60,40,20,.3)" stroke-width="2" stroke-linejoin="round"/>'
        % (mx - 19, mx - 17, mx, mx + 17, mx + 19, kleid)
        # Hals
        + '<rect x="%d" y="56" width="11" height="16" rx="5" fill="%s"/>'
          % (kopf_x - 5.5, haut)
        # Kopf, zum anderen hin geneigt
        + '<g class="raum" transform="rotate(%d %d 46)">'
          '<circle cx="%d" cy="46" r="16" fill="%s" '
          'stroke="rgba(60,40,20,.3)" stroke-width="2"/>'
          '<circle cx="%.1f" cy="44" r="2" fill="#4a3526"/>'
          '<circle cx="%.1f" cy="44" r="2" fill="#4a3526"/>'
          '<path d="M%.1f 52 q%.1f 4 %.1f 0" stroke="#4a3526" stroke-width="1.8" '
          'fill="none" stroke-linecap="round"/>'
          '</g>'
          % (neigung, kopf_x, kopf_x, haut,
             kopf_x - 5.5, kopf_x + 5.5,
             kopf_x - 4.5, 4.5, 9.0)
    )


# GEMELDET beim ersten Versuch: die beiden Koepfe verschmolzen zu einem
# Klumpen und die Arme lasen sich als Kragen. Beides hatte denselben
# Grund — alles sass auf derselben Hoehe und zu dicht beieinander.
#
# Was eine Umarmung erkennbar macht, sind drei Dinge:
#   * die Koepfe stehen GETRENNT und neigen sich zueinander (nicht
#     uebereinander — sonst ist es ein Kopf),
#   * die Arme laufen UM den anderen HERUM, und man sieht am Ende jedes
#     Armes eine HAND auf der fremden Schulter; ohne Hand ist ein Arm
#     nur ein Balken,
#   * ein Arm liegt VORN, der andere HINTEN. Erst dadurch greifen die
#     beiden ineinander, statt nebeneinander zu stehen.
AUFKLEBER["umarmung"] = huelle(
    # 1. Der Arm der linken Figur — er liegt HINTEN, um den anderen herum.
    '<g class="um">'
    '<path d="M34 80 Q60 66 92 82" stroke="#f3b57b" stroke-width="10" '
    'fill="none" stroke-linecap="round"/>'
    '<ellipse cx="93" cy="83" rx="7" ry="5.5" fill="#f3b57b" '
    'stroke="rgba(60,40,20,.28)" stroke-width="1.6"/>'
    # 2. Die rechte Figur
    + _figur(76, 80, "#e8a768", "#6aa6ee", -11)
    # 3. Die linke Figur — sie steht vorn
    + _figur(46, 40, "#f3b57b", "#e0546a", 11)
    # 4. Der Arm der rechten Figur — er liegt VORN.
    + '<path d="M88 80 Q60 66 30 84" stroke="#e8a768" stroke-width="10" '
      'fill="none" stroke-linecap="round"/>'
      '<ellipse cx="29" cy="85" rx="7" ry="5.5" fill="#e8a768" '
      'stroke="rgba(60,40,20,.28)" stroke-width="1.6"/>'
      '</g>'
    # Ein Herz, das ueber den beiden aufsteigt
      '<g class="hz"><path d="M60 18 C50 10 44 16 48 23 C51 28 60 32 60 32 '
      'C60 32 69 28 72 23 C76 16 70 10 60 18 Z" fill="#e0546a"/></g>',
    stil=(
        # Das Druecken: beide zusammen werden kurz schmaler und hoeher.
        "  .um { animation: druecken 2.6s ease-in-out infinite; "
        "transform-origin: 50% 90%; }\n"
        "  .hz { animation: hoch 2.6s ease-in-out infinite; }\n"
        "  @keyframes druecken { 0%,100%{transform:scale(1,1)} "
        "44%{transform:scale(.95,1.035)} 62%{transform:scale(.985,1.01)} }\n"
        "  @keyframes hoch { 0%,20%{opacity:0;transform:translateY(10px) scale(.6)} "
        "50%{opacity:1;transform:translateY(-2px) scale(1.1)} "
        "100%{opacity:0;transform:translateY(-16px) scale(.9)} }\n"
    ),
)

# --- sanduhr: die Zeit laeuft -------------------------------------# --- sanduhr: die Zeit laeuft -------------------------------------
AUFKLEBER["warten"] = huelle(
    '<g class="su">'
    '<path d="M32 16 h56 M32 104 h56" stroke="#a0784a" stroke-width="6" '
    'stroke-linecap="round"/>'
    '<path d="M36 18 q0 28 24 42 q-24 14 -24 42 h48 q0 -28 -24 -42 '
    'q24 -14 24 -42 z" fill="rgba(255,255,255,.22)" '
    'stroke="#a0784a" stroke-width="3" stroke-linejoin="round"/>'
    '<path class="ob" d="M40 22 q0 20 20 34 q20 -14 20 -34 z" fill="#e0964a"/>'
    # Der Rinnsal durch die Enge — ohne ihn sieht man nur zwei Haufen,
    # die sich veraendern, aber nichts, was hindurchlaeuft.
    '<rect class="ri" x="58.4" y="56" width="3.2" height="26" fill="#e0964a"/>'
    '<path class="un" d="M44 100 q0 -14 16 -22 q16 8 16 22 z" fill="#e0964a"/>'
    '</g>',
    stil=(
        "  .su { animation: kipp 4s ease-in-out infinite; }\n"
        # GEMELDET: „Die Animation der Sanduhr macht keinen Sinn, weil
        # sich unten zwar der Haufen fuellt, aber oben rutscht ja nicht
        # nach unten durch, sondern wird zur Decke hin kleiner."
        #
        # Genau daran lag es: transform-origin stand auf 50% 0, also am
        # OBEREN Rand des Sandes. Beim Schrumpfen blieb damit die
        # Oberkante stehen und die Unterkante wanderte hinauf — der
        # Sand loeste sich von der Enge nach oben auf.
        #
        # In einer echten Sanduhr laeuft der Sand unten durch die Enge
        # ab, und der SANDSPIEGEL SINKT. Die Unterkante bleibt also an
        # der Enge stehen, die Oberkante kommt herunter. Das ist
        # transform-origin: 50% 100% — derselbe Wert wie beim Haufen
        # unten, der von seiner Grundflaeche aus waechst.
        "  .ob { animation: leer 4s linear infinite; transform-origin: 50% 100%; }\n"
        "  .un { animation: voll 4s linear infinite; transform-origin: 50% 100%; }\n"
        "  .ri { animation: rinnt 4s linear infinite; transform-origin: 50% 0; }\n"
        "  @keyframes kipp { 0%,88%{transform:rotate(0)} 96%,100%{transform:rotate(180deg)} }\n"
        "  @keyframes leer { 0%{transform:scaleY(1)} 85%,100%{transform:scaleY(.04)} }\n"
        "  @keyframes voll { 0%{transform:scaleY(.05)} 85%,100%{transform:scaleY(1)} }\n"
        # Der Rinnsal laeuft, solange oben noch Sand ist, und hoert auf,
        # wenn die Uhr durch ist — sonst rinnt sie aus dem Nichts weiter.
        "  @keyframes rinnt { 0%,84%{opacity:.95;transform:scaleY(1)} "
        "86%,100%{opacity:0;transform:scaleY(0)} }\n"
    ),
)

# --- pflanze waechst ----------------------------------------------
AUFKLEBER["wachsen"] = huelle(
    '<path d="M28 108 q32 -10 64 0 z" fill="#8a6a43"/>'
    '<g class="pf">'
    '<path d="M60 104 L60 44" stroke="#5aa86b" stroke-width="5" stroke-linecap="round"/>'
    '<path d="M60 82 q-22 -8 -26 -24 q20 -2 26 16" fill="#5aa86b"/>'
    '<path d="M60 66 q22 -8 26 -24 q-20 -2 -26 16" fill="#6fbd80"/>'
    '<circle cx="60" cy="40" r="9" fill="#f7c948"/>'
    '</g>',
    stil=(
        "  .pf { animation: waechst 3.4s ease-in-out infinite; "
        "transform-origin: 50% 92%; }\n"
        "  @keyframes waechst { 0%{transform:scale(.25)} 55%{transform:scale(1.05)} "
        "70%{transform:scale(1)} 100%{transform:scale(1)} }\n"
    ),
)

# --- glocke laeutet -----------------------------------------------
AUFKLEBER["glocke"] = huelle(
    '<g class="gl">'
    '<path d="M60 16 a8 8 0 0 1 8 8 q22 10 22 42 q0 14 8 22 h-76 '
    'q8 -8 8 -22 q0 -32 22 -42 a8 8 0 0 1 8 -8 z" fill="#f0b040" '
    'stroke="rgba(110,70,10,.4)" stroke-width="2.5" stroke-linejoin="round"/>'
    '<circle cx="60" cy="98" r="8" fill="#c98f2c"/>'
    '</g>'
    '<g class="kl"><path d="M14 44 q-8 6 0 14 M106 44 q8 6 0 14" '
    'stroke="#e0964a" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>',
    stil=(
        "  .gl { animation: laeutet 0.7s ease-in-out infinite; "
        "transform-origin: 50% 12%; }\n"
        "  .kl { animation: klang 0.7s ease-in-out infinite; }\n"
        "  @keyframes laeutet { 0%,100%{transform:rotate(-13deg)} "
        "50%{transform:rotate(13deg)} }\n"
        "  @keyframes klang { 0%,100%{opacity:.2} 50%{opacity:1} }\n"
    ),
)

# --- pokal --------------------------------------------------------
AUFKLEBER["pokal"] = huelle(
    '<g class="pk">'
    '<path d="M34 20 h52 v22 a26 26 0 0 1 -52 0 z" fill="#f0b040" '
    'stroke="rgba(110,70,10,.4)" stroke-width="2.5" stroke-linejoin="round"/>'
    '<path d="M34 26 h-12 a14 14 0 0 0 14 22 M86 26 h12 a14 14 0 0 1 -14 22" '
    'fill="none" stroke="#f0b040" stroke-width="5"/>'
    '<rect x="54" y="66" width="12" height="18" fill="#c98f2c"/>'
    '<rect x="38" y="84" width="44" height="12" rx="3" fill="#c98f2c"/>'
    '<rect x="32" y="96" width="56" height="10" rx="3" fill="#a0784a"/>'
    '</g>'
    '<g class="gz"><path d="M96 14 L96 26 M90 20 L102 20" stroke="#fff3c4" '
    'stroke-width="3.5" stroke-linecap="round"/></g>',
    stil=(
        "  .pk { animation: stolz 2.2s ease-in-out infinite; }\n"
        "  .gz { animation: glitzer 1.5s ease-in-out infinite; }\n"
        "  @keyframes stolz { 0%,100%{transform:translateY(0) rotate(-2deg)} "
        "50%{transform:translateY(-5px) rotate(2deg)} }\n"
        "  @keyframes glitzer { 0%,100%{opacity:0;transform:scale(.5)} "
        "50%{opacity:1;transform:scale(1.25)} }\n"
    ),
)

# --- traurig: enttaeuscht, ohne Traene (die hat „weinen") ---------
AUFKLEBER["traurig"] = gesicht(
    "#e8c07a",
    '<path class="br" d="M34 42 Q44 36 54 42" stroke="#2b2118" stroke-width="4" '
    'fill="none" stroke-linecap="round"/>'
    '<path class="br" d="M66 42 Q76 36 86 42" stroke="#2b2118" stroke-width="4" '
    'fill="none" stroke-linecap="round"/>'
    '<circle cx="44" cy="56" r="5.5" fill="#2b2118"/>'
    '<circle cx="76" cy="56" r="5.5" fill="#2b2118"/>'
    '<path class="mu" d="M42 84 Q60 74 78 84" stroke="#2b2118" stroke-width="4.5" '
    'fill="none" stroke-linecap="round"/>',
    stil=(
        "  .kopf { animation: senkt 3s ease-in-out infinite; }\n"
        "  .mu { animation: zuck 3s ease-in-out infinite; }\n"
        "  @keyframes senkt { 0%,100%{transform:translateY(0) rotate(0)} "
        "50%{transform:translateY(4px) rotate(-3deg)} }\n"
        "  @keyframes zuck { 0%,100%{transform:translateY(0)} "
        "50%{transform:translateY(2px)} }\n"
    ),
)

# --- katze --------------------------------------------------------
AUFKLEBER["katze"] = huelle(
    '<g class="kp">'
    '<path d="M24 46 L30 14 L52 32 Z" fill="#8a8f98"/>'
    '<path d="M24 46 L32 22 L48 34 Z" fill="#e8a0b0"/>'
    '<path d="M96 46 L90 14 L68 32 Z" fill="#8a8f98"/>'
    '<path d="M96 46 L88 22 L72 34 Z" fill="#e8a0b0"/>'
    '<ellipse cx="60" cy="66" rx="38" ry="34" fill="#9aa0aa"/>'
    '<ellipse class="au" cx="45" cy="60" rx="7" ry="9" fill="#5aa86b"/>'
    '<ellipse class="au" cx="75" cy="60" rx="7" ry="9" fill="#5aa86b"/>'
    '<ellipse cx="45" cy="60" rx="2.5" ry="8" fill="#20281f"/>'
    '<ellipse cx="75" cy="60" rx="2.5" ry="8" fill="#20281f"/>'
    '<path d="M60 76 l-6 -5 h12 z" fill="#e8848a"/>'
    '<path d="M60 80 q-6 6 -12 2 M60 80 q6 6 12 2" stroke="#20281f" '
    'stroke-width="2.2" fill="none" stroke-linecap="round"/>'
    '<path d="M18 62 h-14 M18 70 h-15 M102 62 h14 M102 70 h15" '
    'stroke="#e8edf2" stroke-width="2" stroke-linecap="round"/>'
    '</g>',
    stil=(
        "  .kp { animation: schnurr 2.6s ease-in-out infinite; }\n"
        "  .au { animation: blinzel 4.2s ease-in-out infinite; }\n"
        "  @keyframes schnurr { 0%,100%{transform:rotate(-4deg)} "
        "50%{transform:rotate(4deg)} }\n"
        "  @keyframes blinzel { 0%,92%,100%{transform:scaleY(1)} "
        "96%{transform:scaleY(.1)} }\n"
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
