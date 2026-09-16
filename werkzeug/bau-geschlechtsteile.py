# -*- coding: utf-8 -*-
"""
=========================================================
DIE GESCHLECHTSTEILE — vier Detailbilder für die Bilderwelt
---------------------------------------------------------
DER AUFTRAG
„Bei den Geschlechtsteilen sollen die einzelnen Bereiche
 besser anwählbar sein, auch umgangssprachlich, und das soll
 da sein, wo es gemeint ist. Die äußeren Schamlippen, die
 inneren Schamlippen, die ganzen Einzeldetails vom Penis —
 die sind noch nicht benannt, nicht anwählbar, nicht
 auffindbar."

WAS VORHER DA WAR
Im Bild „Die Geschlechtsorgane" gab es sechs Flächen, und
davon waren nur zwei überhaupt Geschlechtsteile: „die
männlichen Geschlechtsorgane" und „die weiblichen
Geschlechtsorgane" — zwei Klümpchen ohne ein einziges
benanntes Einzelteil. Wer „Schamlippe" lernen wollte, fand
das Wort auf der ganzen Seite nicht.

DIE ENTSCHEIDENDE GESTALTUNGSFRAGE: WIE TRIFFT MAN ES?
In der Bilderwelt IST die Zeichnung eines Dings zugleich
seine Schaltfläche. Bei einem Kinderzimmer geht das gut: der
Teddy ist gross und liegt allein. Hier geht es NICHT: die
inneren Schamlippen liegen unter den äusseren, der Kitzler
ist wenige Millimeter gross, die Harnröhrenöffnung noch
kleiner. Zeichnung-als-Schaltfläche hiesse hier:
übereinanderliegende Trefferflächen, von denen man auf dem
Telefon keine sicher trifft. Genau das war die Klage.

Darum ist es hier umgekehrt gebaut, so wie es im
Biologiebuch seit hundert Jahren gemacht wird:

  * Die ZEICHNUNG ist Kulisse — sie wird nicht angetippt.
  * Jedes Teil bekommt einen eigenen PUNKT am Bildrand mit
    einer Linie, die genau auf die Stelle zeigt.
  * Der Punkt ist gross (unsichtbare Trefferfläche r=17),
    liegt frei, und überlappt mit keinem anderen.

Damit ist jedes Einzelteil sicher zu treffen, UND es zeigt
auf die Stelle, an der es wirklich sitzt.

WARUM ZAHLEN AUF DEN PUNKTEN UND KEINE WÖRTER
Die Bilderwelt hat ein Suchspiel: ein Wort wird genannt, man
muss es im Bild finden. Stünde das Wort in der Zeichnung,
wäre das Spiel kaputt. Zahlen verraten nichts.

DER TON
Das ist Schulbuch-Anatomie, gezeichnet wie im
Biologieunterricht: gedämpfte Farben, klare Umrisse, nichts
Ausgeschmücktes. Die Umgangssprache steht nicht im Bild,
sondern auf der Wortkarte — dafür gibt es
data-umgangssprache.js, und der Umschalter der Seite bedient
sie schon.
=========================================================
"""
import json, io, math, os

PAPIER = "#f6f0ec"
GITTER = "#e7dfcf"

HAUT       = "#f2d9c4"
HAUT_DUNK  = "#e6c4a8"
RAND       = "#cfa585"
SCHLEIM    = "#e3a49a"
SCHLEIM_D  = "#cf8578"
OEFFNUNG   = "#a8635c"
HAAR       = "#9a7a5c"
MARKE      = "#8a5f2a"
MARKE_BG   = "#fffdf6"


# =========================================================
# LICHT UND SCHATTEN
# ---------------------------------------------------------
# GEMELDET: „Die Zeichnungen waren früher viel mehr detailreich
# mit Licht und Schatten. Die sahen viel besser aus, viel
# realistischer."
#
# Eine flache Fläche mit einem Strich drumherum sieht aus wie
# ein Schnittmuster. Plastisch wird sie erst durch drei Dinge,
# und zwar in dieser Reihenfolge der Wirkung:
#
#   1. EIN VERLAUF über die ganze Form. Licht kommt von links
#      oben (so wird es seit der Renaissance gezeichnet, und
#      das Auge erwartet es), Schatten sammelt sich rechts
#      unten. Das allein macht aus einer Scheibe eine Kugel.
#   2. EIN WEICHER SCHLAGSCHATTEN unter der Form. Er sagt dem
#      Auge, dass etwas VOR etwas anderem liegt.
#   3. EIN SCHMALES GLANZLICHT an der Oberkante. Es sitzt dort,
#      wo die Wölbung am stärksten zum Licht zeigt.
#
# Die Verläufe stehen EINMAL in den defs und werden über die
# Kennung wiederverwendet — jede Form ihren eigenen Verlauf zu
# geben, blähte die Datei auf das Dreifache.
# =========================================================
def licht_defs():
    return (
        '<defs>'
        # Haut: hell nach links oben, satt nach rechts unten
        '<linearGradient id="gLicht" x1="0.15" y1="0.05" x2="0.85" y2="0.95">'
        '<stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/>'
        '<stop offset="0.45" stop-color="#ffffff" stop-opacity="0.05"/>'
        '<stop offset="1" stop-color="#8a6a4e" stop-opacity="0.28"/>'
        '</linearGradient>'
        # Schleimhaut: etwas kühler im Schatten, damit sie sich von Haut abhebt
        '<linearGradient id="gSchleim" x1="0.2" y1="0.05" x2="0.8" y2="0.95">'
        '<stop offset="0" stop-color="#ffffff" stop-opacity="0.45"/>'
        '<stop offset="0.5" stop-color="#ffffff" stop-opacity="0.02"/>'
        '<stop offset="1" stop-color="#8d4a45" stop-opacity="0.32"/>'
        '</linearGradient>'
        # Vertiefung: dunkel an den Rändern, hell in der Mitte — für Höhlungen
        '<radialGradient id="gTiefe" cx="0.5" cy="0.42" r="0.62">'
        '<stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>'
        '<stop offset="0.7" stop-color="#7c4038" stop-opacity="0.10"/>'
        '<stop offset="1" stop-color="#5e2b25" stop-opacity="0.42"/>'
        '</radialGradient>'
        '<filter id="fWeich" x="-30%" y="-30%" width="160%" height="160%">'
        '<feGaussianBlur stdDeviation="3.2"/>'
        '</filter>'
        '<filter id="fWeichFein" x="-30%" y="-30%" width="160%" height="160%">'
        '<feGaussianBlur stdDeviation="1.5"/>'
        '</filter>'
        '</defs>'
    )


def licht(d, verlauf="gLicht"):
    """Dieselbe Form noch einmal, nur als Verlauf darüber."""
    return f'<path d="{d}" fill="url(#{verlauf})"/>'


def schlagschatten(d, dx=2.5, dy=3.5, staerke=0.20, weich="fWeich"):
    """Die Form als dunkler, weicher Fleck darunter — darum wird sie
       VOR der eigentlichen Form gezeichnet."""
    return (f'<g transform="translate({dx},{dy})" opacity="{staerke}" filter="url(#{weich})">'
            f'<path d="{d}" fill="#4a3320"/></g>')


def glanz(d, staerke=0.5):
    """Ein schmales Glanzlicht — als Linie entlang der Oberkante."""
    return (f'<path d="{d}" fill="none" stroke="#ffffff" stroke-width="2.6" '
            f'stroke-linecap="round" opacity="{staerke}" filter="url(#fWeichFein)"/>')


def kulisse_rahmen(b, h):
    """Papier und Gitter — genau wie in den anderen Detailbildern,
       damit die neuen Bilder nicht wie Fremdkörper wirken."""
    s = f'<rect x="0" y="0" width="{b}" height="{h}" rx="0" fill="{PAPIER}"/>'
    for y in range(20, h, 20):
        s += f'<line x1="0" y1="{y}" x2="{b}" y2="{y}" stroke="{GITTER}" stroke-width="1" stroke-linecap="round"/>'
    for x in range(20, b, 20):
        s += f'<line x1="{x}" y1="0" x2="{x}" y2="{h}" stroke="{GITTER}" stroke-width="1" stroke-linecap="round"/>'
    return s


def zeiger(mx, my, zx, zy):
    """Die Linie vom Punkt zur Stelle — und der kleine Ring auf der
       Stelle selbst. Beides gehört in die KULISSE, nicht in das Teil.

       WARUM DAS WICHTIG IST, und es kostete einen Anlauf:
       Die App legt hinter jedes Teil eine unsichtbare Trefferfläche in
       der Grösse seiner Bounding-Box — damit man auch danebentippen
       darf. Steckte die lange Zeigerlinie im Teil, wäre diese Box
       hundert Pixel breit, ihre Mitte läge im Leeren, und die Boxen
       benachbarter Punkte überlappten sich dort, wo sich ihre Linien
       kreuzen. Dann trifft man beim Danebentippen den Nachbarn.

       Liegt die Linie in der Kulisse, ist die Box eines Punktes genau
       der Punkt: 34 x 34, mittig auf dem, was man sieht, und keine
       zwei überlappen sich. Genau das war der Wunsch — „besser
       anwählbar"."""
    laenge = math.hypot(zx - mx, zy - my)
    ex, ey = (zx - mx) / laenge, (zy - my) / laenge
    ax, ay = mx + ex * 12, my + ey * 12          # am Rand des Punktes los
    bx, by = zx - ex * 5, zy - ey * 5            # kurz vor der Stelle halt
    return (
        f'<line x1="{ax:.1f}" y1="{ay:.1f}" x2="{bx:.1f}" y2="{by:.1f}" '
        f'stroke="{MARKE}" stroke-width="1.3" stroke-linecap="round" '
        f'stroke-dasharray="3 2.5" opacity="0.75"/>'
        f'<circle cx="{zx:.1f}" cy="{zy:.1f}" r="4.2" fill="none" stroke="{MARKE}" stroke-width="1.6"/>'
        f'<circle cx="{zx:.1f}" cy="{zy:.1f}" r="1.5" fill="{MARKE}"/>'
    )


def marke(nummer):
    """Der Anwählpunkt selbst — und NUR er. Die durchsichtige Scheibe
       r=17 ist die Trefferfläche: ohne sie wäre der Punkt zehn Pixel
       gross und auf dem Telefon nicht sicher zu treffen."""
    return (
        f'<circle cx="0" cy="0" r="17" fill="transparent"/>'
        f'<circle cx="0" cy="0" r="10.5" fill="{MARKE_BG}" stroke="{MARKE}" stroke-width="2"/>'
        f'<text x="0" y="3.9" text-anchor="middle" font-family="Nunito, sans-serif" '
        f'font-size="11.5" font-weight="800" fill="{MARKE}">{nummer}</text>'
    )


ZEIGER = []          # sammelt die Linien des gerade gebauten Bildes


def teil(tid, de, syl, it, itsyl, en, mx, my, nummer, zx, zy, lupe=None):
    ZEIGER.append(zeiger(mx, my, zx, zy))
    t = {"id": tid, "de": de, "syl": syl, "it": it, "itSyl": itsyl, "en": en,
         "x": mx, "y": my, "kunst": marke(nummer)}
    if lupe:
        t["lupe"] = lupe
    return t


def haare(punkte, laenge=9, breite=1.6, farbe=HAAR):
    """Schamhaar als einzelne Striche. Kein Muster, kein Filz —
       so, wie es im Schulbuch angedeutet wird."""
    s = ""
    for (x, y, winkel) in punkte:
        r = math.radians(winkel)
        s += (f'<line x1="{x:.1f}" y1="{y:.1f}" '
              f'x2="{x + math.cos(r) * laenge:.1f}" y2="{y + math.sin(r) * laenge:.1f}" '
              f'stroke="{farbe}" stroke-width="{breite}" stroke-linecap="round" opacity="0.55"/>')
    return s


# =========================================================
# BILD 1 — DIE ÄUSSEREN WEIBLICHEN GESCHLECHTSTEILE (die Vulva)
# ---------------------------------------------------------
# Aufsicht, wie im Schulbuch. Die Mittelachse liegt bei x=170,
# alles ist daran gespiegelt — darum wird jede Form einmal
# gerechnet und einmal mit scale(-1,1) gespiegelt.
# =========================================================
M = 170          # Mittelachse


def gespiegelt(pfad):
    return f'<g transform="translate({M},0) scale(-1,1) translate({-M},0)">{pfad}</g>'


def vulva_zeichnung():
    s = ""

    # --- Schamhügel: die gewölbte Fläche über dem Schambein ---
    # Unten abgerundet, nicht abgeschnitten: eine gerade Kante sähe aus
    # wie ein Fehler in der Zeichnung, nicht wie ein Körperteil.
    D_HUEGEL = ("M120 112 C116 66 140 34 170 34 C200 34 224 66 220 112 "
                "C206 122 134 122 120 112 Z")
    s += schlagschatten(D_HUEGEL, 2, 3, 0.16)
    s += (f'<path d="{D_HUEGEL}" fill="{HAUT}" stroke="{RAND}" stroke-width="1.4" stroke-linejoin="round"/>')
    s += licht(D_HUEGEL)
    s += glanz("M140 56 C152 44 188 44 200 56", 0.42)
    s += haare([(128 + i * 9, 52 + (i % 3) * 7, 250 + (i % 5) * 12) for i in range(10)])
    s += haare([(134 + i * 10, 74 + (i % 2) * 6, 255 + (i % 4) * 14) for i in range(9)])

    # --- Äussere Schamlippen: zwei lange Wülste, die alles umschliessen ---
    D_AUSSEN = ("M162 84 C138 88 120 112 116 148 C112 184 126 218 152 240 "
                "C160 247 166 248 170 248 L170 84 Z")
    s += schlagschatten(D_AUSSEN, 2, 3, 0.18) + gespiegelt(schlagschatten(D_AUSSEN, 2, 3, 0.18))
    aussen = (f'<path d="{D_AUSSEN}" fill="{HAUT}" stroke="{RAND}" stroke-width="1.5" stroke-linejoin="round"/>'
              + licht(D_AUSSEN))
    s += aussen + gespiegelt(aussen)
    # eine angedeutete Falte, damit der Wulst als Wulst zu erkennen ist
    falte = (f'<path d="M150 106 C136 130 134 176 146 214" fill="none" '
             f'stroke="{HAUT_DUNK}" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>')
    s += falte + gespiegelt(falte)

    # --- Der Vorhof: die Fläche zwischen den inneren Schamlippen ---
    D_VORHOF = ("M170 96 C156 100 148 124 148 156 C148 190 158 214 170 226 "
                "C182 214 192 190 192 156 C192 124 184 100 170 96 Z")
    s += (f'<path d="{D_VORHOF}" fill="{SCHLEIM}" stroke="{SCHLEIM_D}" stroke-width="1.2"/>')
    # Eine Höhlung wird nach innen dunkler, nicht heller — darum gTiefe.
    s += f'<path d="{D_VORHOF}" fill="url(#gTiefe)"/>' 

    # --- Innere Schamlippen: die zarteren Falten darin ---
    D_INNEN = ("M170 98 C158 104 152 128 153 158 C154 188 162 210 170 222 "
               "C168 206 162 184 162 158 C162 132 166 112 170 98 Z")
    innen = (f'<path d="{D_INNEN}" fill="{SCHLEIM_D}" stroke="{OEFFNUNG}" stroke-width="1.0" opacity="0.92"/>'
             + licht(D_INNEN, "gSchleim"))
    s += innen + gespiegelt(innen)

    # --- Klitorisvorhaut: die kleine Kapuze ganz oben ---
    D_KAPUZE = ("M158 100 C158 90 163 85 170 85 C177 85 182 90 182 100 "
                "C178 104 174 106 170 106 C166 106 162 104 158 100 Z")
    s += schlagschatten(D_KAPUZE, 1, 2, 0.22, "fWeichFein")
    s += (f'<path d="{D_KAPUZE}" fill="{HAUT_DUNK}" stroke="{RAND}" stroke-width="1.2" stroke-linejoin="round"/>')
    s += licht(D_KAPUZE)

    # --- Klitoris (Kitzler): nur die Spitze ist von aussen zu sehen ---
    s += (f'<circle cx="170" cy="110" r="5.2" fill="{SCHLEIM_D}" stroke="{OEFFNUNG}" stroke-width="1.3"/>'
          f'<circle cx="168.4" cy="108.4" r="1.7" fill="#ffffff" opacity="0.45"/>')

    # --- Harnröhrenöffnung: klein, zwischen Kitzler und Scheideneingang ---
    s += (f'<ellipse cx="170" cy="134" rx="3.6" ry="2.6" fill="{OEFFNUNG}" '
          f'stroke="{SCHLEIM_D}" stroke-width="0.9"/>')

    # --- Scheideneingang ---
    D_EINGANG = ("M170 148 C178 154 182 166 182 178 C182 190 177 200 170 206 "
                 "C163 200 158 190 158 178 C158 166 162 154 170 148 Z")
    s += (f'<path d="{D_EINGANG}" fill="{OEFFNUNG}" stroke="{SCHLEIM_D}" stroke-width="1.1"/>')
    s += f'<path d="{D_EINGANG}" fill="url(#gTiefe)"/>' 

    # --- Jungfernhäutchen: der schmale Saum am Rand des Eingangs ---
    s += ('<path d="M170 149 C177 155 181 166 181 178 C181 189 176 199 170 205" '
          f'fill="none" stroke="#f0c9be" stroke-width="2.2" stroke-linecap="round" opacity="0.95"/>')
    s += ('<path d="M170 149 C163 155 159 166 159 178 C159 189 164 199 170 205" '
          f'fill="none" stroke="#f0c9be" stroke-width="2.2" stroke-linecap="round" opacity="0.95"/>')

    # --- Damm: die Strecke zwischen Scheideneingang und After ---
    s += (f'<path d="M156 226 C162 231 178 231 184 226 C182 240 176 248 170 252 '
          f'C164 248 158 240 156 226 Z" fill="{HAUT}" stroke="{RAND}" stroke-width="1.3"/>')

    return s


VULVA = {
    "id": "vulva",
    "titel": "Die äußeren weiblichen Geschlechtsteile",
    "emoji": "🌸",
    "thema": "Körper",
    "detail": True,
    "breite": 340,
    "hoehe": 300,
}
ZEIGER = []
VULVA["teile"] = [
    teil("v_schamhuegel", "der Schamhügel", "SCHAM-hü-gel",
         "il monte di Venere", "MON-te di VE-ne-re", "mons pubis",
         46, 44, 1, 154, 60),
    teil("v_schamhaar", "das Schamhaar", "SCHAM-haar",
         "i peli pubici", "PE-li PU-bi-ci", "pubic hair",
         294, 44, 2, 206, 78),
    teil("v_klitorisvorhaut", "die Klitorisvorhaut", "KLI-to-ris-vor-haut",
         "il cappuccio clitorideo", "cap-PUC-cio cli-to-RI-de-o", "clitoral hood",
         46, 86, 3, 159, 96),
    teil("v_klitoris", "die Klitoris", "KLI-to-ris",
         "la clitoride", "cli-TO-ri-de", "clitoris",
         46, 126, 4, 170, 110),
    teil("v_harnroehre", "die Harnröhrenöffnung", "HARN-röh-ren-öff-nung",
         "il meato uretrale", "me-A-to u-re-TRA-le", "urethral opening",
         46, 166, 5, 170, 134),
    teil("v_scheideneingang", "der Scheideneingang", "SCHEI-den-ein-gang",
         "l'ingresso vaginale", "in-GRES-so va-gi-NA-le", "vaginal opening",
         46, 206, 6, 166, 176),
    teil("v_schamlippen_aussen", "die äußeren Schamlippen", "ÄU-ße-re SCHAM-lip-pen",
         "le grandi labbra", "GRAN-di LAB-bra", "outer labia",
         294, 96, 7, 124, 150),
    teil("v_schamlippen_innen", "die inneren Schamlippen", "IN-ne-re SCHAM-lip-pen",
         "le piccole labbra", "PIC-co-le LAB-bra", "inner labia",
         294, 140, 8, 188, 150),
    teil("v_jungfernhaeutchen", "das Jungfernhäutchen", "JUNG-fern-häut-chen",
         "l'imene", "I-me-ne", "hymen",
         294, 184, 9, 181, 192),
    teil("v_damm", "der Damm", "DAMM",
         "il perineo", "pe-ri-NE-o", "perineum",
         294, 232, 10, 176, 240),
    teil("v_innen", "die weiblichen Geschlechtsorgane", "WEIB-li-che Ge-SCHLECHTS-or-ga-ne",
         "gli organi genitali femminili", "OR-ga-ni ge-ni-TA-li fem-mi-NI-li",
         "female reproductive organs",
         170, 286, 11, 170, 212, lupe="frau_innen"),
]
VULVA["kulisse"] = kulisse_rahmen(340, 300) + licht_defs() + vulva_zeichnung() + "".join(ZEIGER)


# =========================================================
# BILD 2 — DER PENIS UND DER HODENSACK
# ---------------------------------------------------------
# Ansicht von vorn, Spitze oben. Die Vorhaut ist
# zurückgestreift gezeichnet — anders wäre weder die Eichel
# noch die Kranzfurche noch das Bändchen zu sehen, und genau
# die sollen ja benennbar werden.
# =========================================================
def penis_zeichnung():
    s = ""

    # --- Schaft ---
    # Er reicht absichtlich HINTER die Eichel hinauf (bis y=66). Beim
    # ersten Anlauf endete er bei y=84, und weil sowohl Eichel als auch
    # Vorhautkragen an den Seiten höher liegen, klaffte dort eine Lücke:
    # die Eichel sah aus wie ein Pilz, der über dem Schaft schwebt.
    D_SCHAFT = ("M142 78 C142 70 146 66 170 66 C194 66 198 70 198 78 "
                "L198 178 C198 188 186 194 170 194 C154 194 142 188 142 178 Z")
    s += schlagschatten(D_SCHAFT, 2.5, 3, 0.18)
    s += (f'<path d="{D_SCHAFT}" fill="{HAUT}" stroke="{RAND}" stroke-width="1.5" stroke-linejoin="round"/>')
    s += licht(D_SCHAFT)
    s += glanz("M156 86 C154 116 154 152 157 180", 0.38)
    # eine Längsschattierung, damit der Schaft rund wirkt
    s += (f'<path d="M152 92 C150 120 150 160 154 188" fill="none" '
          f'stroke="{HAUT_DUNK}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>')

    # --- Vorhaut: der zurückgestreifte Kragen ---
    s += (f'<path d="M140 96 C140 86 152 80 170 80 C188 80 200 86 200 96 '
          'C200 104 188 109 170 109 C152 109 140 104 140 96 Z" '
          f'fill="{HAUT_DUNK}" stroke="{RAND}" stroke-width="1.4"/>')
    s += (f'<path d="M146 99 C156 103 184 103 194 99" fill="none" '
          f'stroke="{RAND}" stroke-width="1" stroke-linecap="round" opacity="0.7"/>')

    # --- Eichel ---
    D_EICHEL = ("M170 28 C186 28 200 42 200 60 C200 72 194 80 170 80 "
                "C146 80 140 72 140 60 C140 42 154 28 170 28 Z")
    s += (f'<path d="{D_EICHEL}" fill="{SCHLEIM}" stroke="{SCHLEIM_D}" stroke-width="1.5" stroke-linejoin="round"/>')
    s += licht(D_EICHEL, "gSchleim")
    s += (f'<path d="M156 40 C152 48 151 58 152 68" fill="none" stroke="#ffffff" '
          'stroke-width="3" stroke-linecap="round" opacity="0.28"/>')

    # --- Kranzfurche: der Wulstrand am unteren Ende der Eichel ---
    s += (f'<path d="M141 73 C152 80 188 80 199 73" fill="none" '
          f'stroke="{SCHLEIM_D}" stroke-width="2.6" stroke-linecap="round"/>')

    # --- Harnröhrenöffnung: der senkrechte Schlitz in der Eichel ---
    s += (f'<path d="M170 38 L170 48" stroke="{OEFFNUNG}" stroke-width="3.2" stroke-linecap="round"/>')

    # --- Vorhautbändchen: das Hautbändchen unter der Eichel ---
    s += (f'<path d="M170 76 C167 82 167 88 170 93 C173 88 173 82 170 76 Z" '
          f'fill="{SCHLEIM_D}" stroke="{OEFFNUNG}" stroke-width="0.9"/>')

    # --- Hodensack ---
    D_SACK = ("M142 180 C118 186 104 208 104 232 C104 258 126 278 152 278 "
              "C162 278 168 275 170 272 C172 275 178 278 188 278 C214 278 236 258 236 232 "
              "C236 208 222 186 198 180 Z")
    s += schlagschatten(D_SACK, 2.5, 4, 0.18)
    s += (f'<path d="{D_SACK}" fill="{HAUT}" stroke="{RAND}" stroke-width="1.5" stroke-linejoin="round"/>')
    s += licht(D_SACK)
    # die Naht in der Mitte — sie teilt den Sack sichtbar in zwei Kammern
    s += (f'<path d="M170 194 L170 276" stroke="{HAUT_DUNK}" stroke-width="2" '
          'stroke-linecap="round" opacity="0.8"/>')

    # --- Hoden: durchscheinend gezeichnet, sonst wäre nichts zu benennen ---
    for cx in (139, 201):
        d = (f"M{cx} 207 C{cx+13} 207 {cx+23} 219 {cx+23} 234 "
             f"C{cx+23} 249 {cx+13} 261 {cx} 261 C{cx-13} 261 {cx-23} 249 {cx-23} 234 "
             f"C{cx-23} 219 {cx-13} 207 {cx} 207 Z")
        s += (f'<path d="{d}" fill="{HAUT_DUNK}" stroke="{RAND}" stroke-width="1.3" opacity="0.92"/>')
        s += licht(d)

    # --- Nebenhoden: die Kappe, die aussen oben auf dem Hoden sitzt ---
    s += (f'<path d="M120 246 C112 236 113 220 121 210 C126 204 131 203 133 207 '
          f'C127 216 125 234 128 246 Z" fill="{SCHLEIM}" stroke="{SCHLEIM_D}" stroke-width="1.1"/>')
    s += (f'<path d="M220 246 C228 236 227 220 219 210 C214 204 209 203 207 207 '
          f'C213 216 215 234 212 246 Z" fill="{SCHLEIM}" stroke="{SCHLEIM_D}" stroke-width="1.1"/>')

    # --- Samenleiter: die Röhre, die vom Nebenhoden nach oben zieht ---
    s += (f'<path d="M126 208 C124 196 130 188 140 183" fill="none" '
          f'stroke="{SCHLEIM_D}" stroke-width="3.2" stroke-linecap="round"/>')
    s += (f'<path d="M214 208 C216 196 210 188 200 183" fill="none" '
          f'stroke="{SCHLEIM_D}" stroke-width="3.2" stroke-linecap="round"/>')

    # --- Schamhaar am Ansatz ---
    # Weiter nach aussen als beim ersten Anlauf: dort lagen die Striche
    # auf dem Schaft und sahen aus wie Kratzer in der Zeichnung.
    s += haare([(100 + i * 7, 176 + (i % 3) * 6, 245 + (i % 4) * 14) for i in range(6)])
    s += haare([(206 + i * 7, 176 + (i % 3) * 6, 265 + (i % 4) * 14) for i in range(6)])

    return s


PENIS = {
    "id": "penis",
    "titel": "Der Penis und der Hodensack",
    "emoji": "🔎",
    "thema": "Körper",
    "detail": True,
    "breite": 340,
    "hoehe": 300,
}
ZEIGER = []
PENIS["teile"] = [
    teil("p_harnroehre", "die Harnröhrenöffnung", "HARN-röh-ren-öff-nung",
         "il meato uretrale", "me-A-to u-re-TRA-le", "urethral opening",
         46, 30, 1, 170, 43),
    teil("p_eichel", "die Eichel", "EI-chel",
         "il glande", "GLAN-de", "glans",
         46, 68, 2, 154, 58),
    teil("p_kranzfurche", "die Kranzfurche", "KRANZ-fur-che",
         "il solco coronale", "SOL-co co-ro-NA-le", "coronal sulcus",
         294, 44, 3, 194, 76),
    teil("p_baendchen", "das Vorhautbändchen", "VOR-haut-bänd-chen",
         "il frenulo", "FRE-nu-lo", "frenulum",
         294, 86, 4, 172, 85),
    teil("p_vorhaut", "die Vorhaut", "VOR-haut",
         "il prepuzio", "pre-PU-zio", "foreskin",
         46, 108, 5, 146, 99),
    teil("p_schaft", "der Penisschaft", "PE-nis-schaft",
         "l'asta del pene", "A-sta del PE-ne", "penile shaft",
         46, 150, 6, 158, 145),
    teil("p_schamhaar", "das Schamhaar", "SCHAM-haar",
         "i peli pubici", "PE-li PU-bi-ci", "pubic hair",
         294, 130, 7, 226, 180),
    teil("p_samenleiter", "der Samenleiter", "SA-men-lei-ter",
         "il dotto deferente", "DOT-to de-fe-REN-te", "vas deferens",
         294, 176, 8, 215, 197),
    teil("p_hodensack", "der Hodensack", "HO-den-sack",
         "lo scroto", "SCRO-to", "scrotum",
         46, 196, 9, 118, 262),
    teil("p_hoden", "der Hoden", "HO-den",
         "il testicolo", "te-STI-co-lo", "testicle",
         46, 244, 10, 139, 240),
    teil("p_nebenhoden", "der Nebenhoden", "NE-ben-ho-den",
         "l'epididimo", "e-pi-DI-di-mo", "epididymis",
         294, 226, 11, 220, 230),
    teil("p_innen", "die männlichen Geschlechtsorgane", "MÄNN-li-che Ge-SCHLECHTS-or-ga-ne",
         "gli organi genitali maschili", "OR-ga-ni ge-ni-TA-li ma-SCHI-li",
         "male reproductive organs",
         294, 272, 12, 205, 258, lupe="mann_innen"),
]
PENIS["kulisse"] = kulisse_rahmen(340, 300) + licht_defs() + penis_zeichnung() + "".join(ZEIGER)


# =========================================================
# BILD 3 — INNEN: DIE WEIBLICHEN GESCHLECHTSORGANE
# ---------------------------------------------------------
# Gebärmutter mit Eileitern und Eierstöcken, von vorn — das
# Bild, das in jedem Biologiebuch steht.
# =========================================================
def frau_innen_zeichnung():
    s = ""

    # --- Gebärmutter: der birnenförmige Körper ---
    D_GEBAER = ("M132 88 C132 76 146 70 170 70 C194 70 208 76 208 88 "
                "C208 126 196 156 186 172 L154 172 C144 156 132 126 132 88 Z")
    s += schlagschatten(D_GEBAER, 2.5, 3.5, 0.18)
    s += (f'<path d="{D_GEBAER}" fill="{SCHLEIM}" stroke="{SCHLEIM_D}" stroke-width="1.6" stroke-linejoin="round"/>')
    s += licht(D_GEBAER, "gSchleim")
    # die Höhle darin, angedeutet
    s += (f'<path d="M148 92 C150 118 158 142 164 158 L176 158 C182 142 190 118 192 92 '
          f'C182 88 158 88 148 92 Z" fill="{HAUT}" stroke="{RAND}" stroke-width="1" opacity="0.75"/>')

    # --- Gebärmutterhals ---
    s += (f'<path d="M154 172 L186 172 L182 206 L158 206 Z" '
          f'fill="{SCHLEIM_D}" stroke="{OEFFNUNG}" stroke-width="1.3"/>')

    # --- Muttermund: die Öffnung am unteren Ende ---
    s += (f'<ellipse cx="170" cy="206" rx="13" ry="5" fill="{OEFFNUNG}" '
          f'stroke="{SCHLEIM_D}" stroke-width="1.1"/>')

    # --- Scheide: der Kanal nach aussen ---
    s += (f'<path d="M157 208 C154 232 152 252 150 268 L190 268 '
          f'C188 252 186 232 183 208 Z" fill="{SCHLEIM}" stroke="{SCHLEIM_D}" stroke-width="1.5"/>')
    s += (f'<path d="M166 214 C164 234 163 250 162 266" fill="none" '
          f'stroke="{SCHLEIM_D}" stroke-width="1.1" stroke-linecap="round" opacity="0.7"/>')
    s += (f'<path d="M174 214 C176 234 177 250 178 266" fill="none" '
          f'stroke="{SCHLEIM_D}" stroke-width="1.1" stroke-linecap="round" opacity="0.7"/>')

    # --- Eileiter: die beiden geschwungenen Röhren ---
    for richtung in (-1, 1):
        x = lambda v: 170 + richtung * v
        s += (f'<path d="M{x(36):.0f} 82 C{x(58):.0f} 70 {x(76):.0f} 78 {x(84):.0f} 96" '
              f'fill="none" stroke="{SCHLEIM_D}" stroke-width="5" stroke-linecap="round"/>')
        # die Fransen am offenen Ende
        for i in range(4):
            w = math.radians(40 + i * 26)
            s += (f'<line x1="{x(84):.0f}" y1="96" '
                  f'x2="{x(84 + math.cos(w) * 12):.0f}" y2="{96 + math.sin(w) * 12:.0f}" '
                  f'stroke="{SCHLEIM_D}" stroke-width="2" stroke-linecap="round"/>')

    # --- Eierstöcke ---
    for cx in (82, 258):
        d = (f"M{cx} 102 C{cx+11} 102 {cx+20} 108 {cx+20} 116 "
             f"C{cx+20} 124 {cx+11} 130 {cx} 130 C{cx-11} 130 {cx-20} 124 {cx-20} 116 "
             f"C{cx-20} 108 {cx-11} 102 {cx} 102 Z")
        s += schlagschatten(d, 1.5, 2.5, 0.16, "fWeichFein")
        s += (f'<path d="{d}" fill="{HAUT_DUNK}" stroke="{RAND}" stroke-width="1.4"/>')
        s += licht(d)
        for dx, dy in ((-7, -3), (4, 2), (9, -4), (-2, 4)):
            s += f'<circle cx="{cx + dx}" cy="{116 + dy}" r="2.6" fill="{SCHLEIM}" opacity="0.85"/>'

    return s


FRAU_INNEN = {
    "id": "frau_innen", "titel": "Innen: die weiblichen Geschlechtsorgane",
    "emoji": "🔬", "thema": "Körper", "detail": True, "breite": 340, "hoehe": 300,
}
ZEIGER = []
FRAU_INNEN["teile"] = [
    teil("fi_eierstock", "der Eierstock", "EI-er-stock",
         "l'ovaio", "o-VA-io", "ovary", 42, 62, 1, 76, 110),
    teil("fi_eileiter", "der Eileiter", "EI-lei-ter",
         "la tuba di Falloppio", "TU-ba di fal-LOP-pio", "fallopian tube",
         42, 140, 2, 124, 80),
    teil("fi_gebaermutter", "die Gebärmutter", "Ge-BÄR-mut-ter",
         "l'utero", "U-te-ro", "uterus", 298, 62, 3, 186, 110),
    teil("fi_gebaermutterhals", "der Gebärmutterhals", "Ge-BÄR-mut-ter-hals",
         "il collo dell'utero", "COL-lo del-l'U-te-ro", "cervix",
         298, 140, 4, 184, 186),
    teil("fi_muttermund", "der Muttermund", "MUT-ter-mund",
         "l'orifizio uterino", "o-ri-FI-zio u-te-RI-no", "cervical opening",
         298, 206, 5, 180, 206),
    teil("fi_scheide", "die Scheide", "SCHEI-de",
         "la vagina", "va-GI-na", "vagina", 42, 224, 6, 154, 244),
    teil("fi_aussen", "die äußeren weiblichen Geschlechtsteile", "ÄU-ße-re GE-schlechts-tei-le",
         "i genitali esterni", "ge-ni-TA-li e-STER-ni", "external genitals",
         298, 268, 7, 186, 264, lupe="vulva"),
]
FRAU_INNEN["kulisse"] = kulisse_rahmen(340, 300) + licht_defs() + frau_innen_zeichnung() + "".join(ZEIGER)


# =========================================================
# BILD 4 — INNEN: DIE MÄNNLICHEN GESCHLECHTSORGANE
# =========================================================
def mann_innen_zeichnung():
    s = ""

    # --- Harnblase --- etwas kleiner als im ersten Anlauf, sonst
    # beherrscht sie ein Bild, in dem sie nur Nachbarin ist.
    D_BLASE = ("M170 35 C192 35 210 48 210 64 C210 80 192 93 170 93 "
               "C148 93 130 80 130 64 C130 48 148 35 170 35 Z")
    s += schlagschatten(D_BLASE, 2.5, 3.5, 0.16)
    s += (f'<path d="{D_BLASE}" fill="{HAUT}" stroke="{RAND}" stroke-width="1.5"/>')
    s += licht(D_BLASE)
    s += glanz("M146 48 C154 42 178 41 190 46", 0.40)

    # --- Prostata: sitzt wie ein Ring unter der Blase ---
    D_PROSTATA = ("M144 104 C144 96 196 96 196 104 C198 122 188 132 170 132 "
                  "C152 132 142 122 144 104 Z")
    s += (f'<path d="{D_PROSTATA}" fill="{SCHLEIM}" stroke="{SCHLEIM_D}" stroke-width="1.5"/>')
    s += licht(D_PROSTATA, "gSchleim")

    # --- Samenbläschen: die beiden Säckchen hinten oben ---
    # Sie sitzen HINTER und ÜBER der Prostata, nicht seitlich an der
    # Blase — dort sahen sie aus wie zwei angeklebte Ohren.
    for richtung in (-1, 1):
        x = 170 + richtung * 44
        s += (f'<path d="M{x} 104 C{x + richtung * 16} 100 {x + richtung * 20} 84 '
              f'{x + richtung * 10} 78 C{x} 74 {x - richtung * 6} 90 {x} 104 Z" '
              f'fill="{SCHLEIM_D}" stroke="{OEFFNUNG}" stroke-width="1.2"/>')
        s += (f'<path d="M{x} 104 C{x - richtung * 8} 108 {x - richtung * 14} 110 '
              f'{170 + richtung * 24} 110" fill="none" stroke="{SCHLEIM_D}" '
              'stroke-width="2.6" stroke-linecap="round"/>')

    # --- Harnröhre: der Weg von der Blase nach draussen ---
    s += (f'<path d="M170 132 L170 200 C170 226 170 246 170 262" fill="none" '
          f'stroke="{OEFFNUNG}" stroke-width="4" stroke-linecap="round" opacity="0.85"/>')

    # --- Penis im Schnitt, damit die Harnröhre irgendwo hinführt ---
    s += (f'<path d="M150 200 L190 200 L188 264 C184 272 156 272 152 264 Z" '
          f'fill="{HAUT}" stroke="{RAND}" stroke-width="1.4" stroke-linejoin="round" opacity="0.9"/>')

    # --- Samenleiter: vom Hoden hinauf zur Prostata ---
    s += (f'<path d="M96 214 C88 184 104 140 138 114" fill="none" '
          f'stroke="{SCHLEIM_D}" stroke-width="3.4" stroke-linecap="round"/>')
    s += (f'<path d="M244 214 C252 184 236 140 202 114" fill="none" '
          f'stroke="{SCHLEIM_D}" stroke-width="3.4" stroke-linecap="round"/>')

    # --- Hoden und Nebenhoden ---
    for cx, seite in ((92, -1), (248, 1)):
        d = (f"M{cx} 214 C{cx+14} 214 {cx+26} 227 {cx+26} 244 "
             f"C{cx+26} 261 {cx+14} 274 {cx} 274 C{cx-14} 274 {cx-26} 261 {cx-26} 244 "
             f"C{cx-26} 227 {cx-14} 214 {cx} 214 Z")
        s += schlagschatten(d, 2, 3, 0.16)
        s += (f'<path d="{d}" fill="{HAUT_DUNK}" stroke="{RAND}" stroke-width="1.4"/>')
        s += licht(d)
        rx = cx - seite * 24
        s += (f'<path d="M{rx} 262 C{rx - seite * 10} 250 {rx - seite * 9} 228 {rx + seite * 1} 216 '
              f'C{rx + seite * 6} 212 {rx + seite * 9} 216 {rx + seite * 6} 222 '
              f'C{rx - seite * 2} 234 {rx - seite * 3} 252 {rx + seite * 2} 262 Z" '
              f'fill="{SCHLEIM}" stroke="{SCHLEIM_D}" stroke-width="1.1"/>')

    return s


MANN_INNEN = {
    "id": "mann_innen", "titel": "Innen: die männlichen Geschlechtsorgane",
    "emoji": "🔬", "thema": "Körper", "detail": True, "breite": 340, "hoehe": 300,
}
ZEIGER = []
MANN_INNEN["teile"] = [
    teil("mi_harnblase", "die Harnblase", "HARN-bla-se",
         "la vescica", "ve-SCI-ca", "bladder", 42, 44, 1, 140, 62),
    teil("mi_samenblaeschen", "das Samenbläschen", "SA-men-bläs-chen",
         "la vescicola seminale", "ve-SCI-co-la se-mi-NA-le", "seminal vesicle",
         298, 44, 2, 222, 88),
    teil("mi_prostata", "die Prostata", "PRO-sta-ta",
         "la prostata", "PRO-sta-ta", "prostate", 42, 108, 3, 152, 116),
    teil("mi_samenleiter", "der Samenleiter", "SA-men-lei-ter",
         "il dotto deferente", "DOT-to de-fe-REN-te", "vas deferens",
         298, 116, 4, 236, 150),
    teil("mi_harnroehre", "die Harnröhre", "HARN-röh-re",
         "l'uretra", "u-RE-tra", "urethra", 298, 180, 5, 172, 186),
    teil("mi_nebenhoden", "der Nebenhoden", "NE-ben-ho-den",
         "l'epididimo", "e-pi-DI-di-mo", "epididymis", 42, 168, 6, 70, 232),
    teil("mi_hoden", "der Hoden", "HO-den",
         "il testicolo", "te-STI-co-lo", "testicle", 42, 232, 7, 96, 250),
    teil("mi_hodensack_aussen", "der Penis und der Hodensack", "PE-nis und HO-den-sack",
         "il pene e lo scroto", "PE-ne e SCRO-to", "penis and scrotum",
         298, 246, 8, 250, 250, lupe="penis"),
]
MANN_INNEN["kulisse"] = kulisse_rahmen(340, 300) + licht_defs() + mann_innen_zeichnung() + "".join(ZEIGER)


# =========================================================
# SCHREIBEN
# =========================================================
KOPF = ("/* {titel} — gebaut von werkzeug/bau-geschlechtsteile.py.\n"
        "   Nicht von Hand aendern; der Bauplan steht dort, mit der\n"
        "   Begruendung fuer die Anwaehlpunkte am Rand. */\n"
        "window.DMA_SZENE = window.DMA_SZENE || {{}};\n"
        'window.DMA_SZENE["{sid}"] = ')

for szene in (VULVA, PENIS, FRAU_INNEN, MANN_INNEN):
    pfad = os.path.join("szenen", szene["id"] + ".js")
    with io.open(pfad, "w", encoding="utf-8") as f:
        f.write(KOPF.format(titel=szene["titel"], sid=szene["id"]))
        f.write(json.dumps(szene, ensure_ascii=False, separators=(",", ":")))
        f.write(";\n")
    print("geschrieben:", pfad, len(szene["teile"]), "Teile,",
          os.path.getsize(pfad), "Bytes")
