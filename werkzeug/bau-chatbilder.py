#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BILDER FÜR DEN CHAT — aus Buchstaben und aus Emojis
===================================================

GEWÜNSCHT: „Die ASCII-Codes können noch ein bisschen umfangreicher sein,
nicht so einfach und billig. Der Fuchs kann zum Beispiel ein richtig
schöner, realistischer Fuchs sein … und dann so etwas mit Emojis, wie
bei einem ASCII-Code aus Emojis mit Sternen, Rakete, Planeten — so
verschiedene Bilderthemen, die kleine Geschichten erzählen."

Dieses Werkzeug schreibt die beiden Sammlungen in livechat.js:

  ASCII      →  /ascii <name>   Bilder aus Buchstaben. Sie stehen nur
                richtig da, wenn jede Stelle gleich breit ist; beim
                Zeichnen kommen sie deshalb in Schreibmaschinenschrift.

  EMOJIBILD  →  /bild <name>    Bilder aus Emojis. Bunt, ohne feste
                Breite, und sie erzählen etwas. Als Abstand steht das
                Geviertleerzeichen U+3000 — genauso breit wie ein Emoji,
                sonst verrutscht alles.

Warum ein Werkzeug und nicht von Hand in livechat.js? Weil jedes Bild
Zeile für Zeile gesetzt wird und die Sonderzeichen beim Einbetten in
Javascript maskiert werden müssen. Von Hand geht das einmal gut und
beim zweiten Mal schief.

    python3 werkzeug/bau-chatbilder.py
"""

import io
import os
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
ZIEL = os.path.join(os.path.dirname(HIER), "livechat.js")

# ===============================================================
# BILDER AUS BUCHSTABEN
# ---------------------------------------------------------------
# Hinweis für später: die Roh-Strings stehen in EINFACHEN
# Anführungszeichen, damit ein doppeltes Anführungszeichen im Bild
# einfach dastehen kann. Ein Backslash am Zeilenende ginge in einem
# Roh-String nicht — deshalb endet keine Zeile auf \.
# ===============================================================
ASCII = {}

ASCII["fuchs"] = [
    r'    /\     /\    ',
    r'   /  \___/  \   ',
    r'  /  o     o  \  ',
    r' |      w      | ',
    r'  \    ___    /  ',
    r'   \  \___/  /   ',
    r'    \_______/    ',
    r'   /         \   ',
    r'  /  \_____/  \  ',
    r' (_/         \_) ',
    r'   ~~~~~~~~~~~   ',
    r'      — %NAME%   ',
]

ASCII["lachen"] = [
    r"        .-'''''''''-.       ",
    r"      .'             '.     ",
    r"     /   \       /     \    ",
    r"    :     o     o       :   ",
    r"    |          ^        |   ",
    r"    :   \             / :   ",
    r"     \   '.         .'  /   ",
    r"      '.   '-.....-'  .'    ",
    r"        '-...........-'     ",
    r"                            ",
    r"     H A   H A   H A !      ",
    r"        — %NAME%          ",
]

ASCII["herz"] = [
    r"     ,d8888b.  ,d8888b.    ",
    r"   ,88888888888888888888,  ",
    r"  d8888888888888888888888b ",
    r"  888888888888888888888888 ",
    r"  `8888888888888888888888' ",
    r"   `Y88888888888888888Y'   ",
    r"     `Y888888888888Y'      ",
    r"       `Y8888888Y'         ",
    r"         `Y888Y'           ",
    r"           `Y'             ",
    r"                           ",
    r"        — %NAME%          ",
]

ASCII["kaffee"] = [
    r"         )  (  )           ",
    r"        (   )  (           ",
    r"         )  (  )           ",
    r"     .----------.          ",
    r"     |          |___       ",
    r"     |          |   \      ",
    r"     |  ~~~~~~  |    |     ",
    r"     |          |   /      ",
    r"     |          |__/       ",
    r"      \        /           ",
    r"       `------'            ",
    r"    ________________       ",
    r"                           ",
    r"        — %NAME%          ",
]

ASCII["katze"] = [
    r"       /\_____/\           ",
    r"      /  o   o  \          ",
    r"     ( ==  ^  == )         ",
    r"      )         (          ",
    r"     (           )         ",
    r"    ( (  )   (  ) )        ",
    r"   (__(__)___(__)__)       ",
    r"                           ",
    r"        — %NAME%         ",
]

ASCII["hund"] = [
    r"     ,--.        ,--.      ",
    r"    /    \______/    \     ",
    r"   |                  |    ",
    r"   |    (o)    (o)    |    ",
    r"   |        __        |    ",
    r"    \      (__)      /     ",
    r"     \    '----'    /      ",
    r"      `.__________.'       ",
    r"       /          \        ",
    r"      |   \    /   |       ",
    r"       \   '--'   /        ",
    r"        `--------'         ",
    r"                           ",
    r"        — %NAME%         ",
]

ASCII["daumen"] = [
    r"           ____            ",
    r"          /    |           ",
    r"         /  /| |           ",
    r"        |  / | |           ",
    r"        | |  | |           ",
    r"   _____| |__| |_____      ",
    r"  |                  |     ",
    r"  |   das findet      |    ",
    r"  |   %NAME% gut      |    ",
    r"  |__________________|     ",
]

ASCII["schiff"] = [
    r"                |             ",
    r"               /|\            ",
    r"              / | \           ",
    r"             /  |  \          ",
    r"            /___|___\         ",
    r"                |             ",
    r"   \____________|___________/ ",
    r"    \                      /  ",
    r"     \____________________/   ",
    r"  ~~~~~~~~~~~~~~~~~~~~~~~~~~  ",
    r"   ~~~~~~~~~~~~~~~~~~~~~~~~   ",
    r"                              ",
    r"          — %NAME%           ",
]

ASCII["haus"] = [
    r"            /\             ",
    r"           /  \            ",
    r"          /    \           ",
    r"         /      \          ",
    r"        /________\         ",
    r"        | __  __ |         ",
    r"        ||  ||  ||         ",
    r"        ||__||__||         ",
    r"        |   ____ |         ",
    r"        |  | o  ||         ",
    r"    ____|__|____||____     ",
    r"                           ",
    r"        — %NAME%          ",
]

ASCII["baum"] = [
    r"         &&&&&&&&&         ",
    r"       &&&&&&&&&&&&&       ",
    r"     &&&&&&&&&&&&&&&&&     ",
    r"    &&&&&&&&&&&&&&&&&&&    ",
    r"     &&&&&&&&&&&&&&&&&     ",
    r"       &&&&&&&&&&&&&       ",
    r"          &&&&&&&          ",
    r"            |||            ",
    r"            |||            ",
    r"           /|||\           ",
    r"    ______/_____\______    ",
    r"                           ",
    r"        — %NAME%          ",
]

ASCII["achtung"] = [
    r"          /\               ",
    r"         /  \              ",
    r"        /    \             ",
    r"       /  /\  \            ",
    r"      /   ||   \           ",
    r"     /    ||    \          ",
    r"    /     ||     \         ",
    r"   /      ()      \        ",
    r"  /________________\       ",
    r"                           ",
    r"        — %NAME%         ",
]

ASCII["fertig"] = [
    r"       .-----------.       ",
    r"     .'             '.     ",
    r"    /                 \    ",
    r"   |              /    |   ",
    r"   |             /     |   ",
    r"   |   \        /      |   ",
    r"   |    \      /       |   ",
    r"    \    \    /       /    ",
    r"     '.   \  /      .'     ",
    r"       '---\/------'       ",
    r"                           ",
    r"        — %NAME%          ",
]

ASCII["blume"] = [
    r"        _(_)_              ",
    r"    @@@@(_)@@@@            ",
    r"   @@@@@(_)@@@@@           ",
    r"    @@@@(_)@@@@            ",
    r"        (_)                ",
    r"         |                 ",
    r"      \  |                 ",
    r"       \ |   /             ",
    r"        \|  /              ",
    r"         | /               ",
    r"     ____|/____            ",
    r"                           ",
    r"        — %NAME%          ",
]

ASCII["traurig"] = [
    r"        .-'''''''''-.      ",
    r"      .'             '.    ",
    r"     /   .         .   \   ",
    r"    :   (')       (')   :  ",
    r"    |          v         | ",
    r"    :     .-------.      : ",
    r"     \   /         \    /  ",
    r"      '.             .'    ",
    r"        '-.........-'      ",
    r"                           ",
    r"        — %NAME%         ",
]

ASCII["stern"] = [
    r"             *             ",
    r"            ***            ",
    r"           *****           ",
    r" ************************* ",
    r"  ***********************  ",
    r"    *******************    ",
    r"      ***************      ",
    r"       *************       ",
    r"      ****     ****        ",
    r"     ***         ***       ",
    r"    **             **      ",
    r"                           ",
    r"        — %NAME%          ",
]

ASCII["winken"] = [
    r"        _   _   _          ",
    r"   _   | | | | | |         ",
    r"  | |  | | | | | |  _      ",
    r"  | |  | | | | | | | |     ",
    r"  | |__| |_| |_| |_| |     ",
    r"   \                 |     ",
    r"    \                |     ",
    r"     \              /      ",
    r"      |            |       ",
    r"      |            |       ",
    r"      |____________|       ",
    r"                           ",
    r"        — %NAME%          ",
]

ASCII["rakete"] = [
    r"            /\             ",
    r"           /  \            ",
    r"          /    \           ",
    r"         |      |          ",
    r"         |  ()  |          ",
    r"         |      |          ",
    r"        /|      |\         ",
    r"       / |      | \        ",
    r"      /__|______|__\       ",
    r"          \    /           ",
    r"           \  /            ",
    r"            \/             ",
    r"            **             ",
    r"           ****            ",
    r"                           ",
    r"        — %NAME%          ",
]

ASCII["geschenk"] = [
    r'       \  |  /       ',
    r'       .-----.       ',
    r'   ---(  * *  )---   ',
    r'       `--+--`       ',
    r'   .-----------.     ',
    r'   |     ||    |     ',
    r'   |=====||====|     ',
    r'   |     ||    |     ',
    r'   |     ||    |     ',
    r'   `-----------`     ',
    r'      — %NAME%      ',
]

ASCII["ueberraschung"] = [
    r'     *   .   *       ',
    r'   .   \ | /   .     ',
    r'      --( )--        ',
    r'   *   / | \   *     ',
    r'      .-----.        ',
    r'     /       \       ',
    r'    |  !!!!!  |      ',
    r'     \       /       ',
    r'      `-----`        ',
    r'      — %NAME%      ',
]

# ===============================================================
# BILDER AUS EMOJIS — sie erzaehlen eine kleine Geschichte
# ---------------------------------------------------------------
# Der Abstand ist U+3000 (Geviertleerzeichen). Ein gewoehnliches
# Leerzeichen ist halb so breit wie ein Emoji; damit zerfaellt jede
# Anordnung. Mit U+3000 steht alles im Raster.
# ===============================================================
L = "　"


def z(*teile):
    return "".join(teile)


EMOJI = {}

EMOJI["sternenhimmel"] = [
    z("⭐", "🌙", "✨", L, L, "⭐", L, "✨", "🌟"),
    z(L, "✨", L, L, "🌌", L, L, "⭐", L),
    z("🌟", L, "⭐", L, "✨", L, "🌠", L, L),
    z(L, L, "✨", L, L, "⭐", L, L, "✨"),
    z("🌳", "🌲", "🏕️", "🔥", "🏕️", "🌲", "🌳", "🌲"),
    "gute Nacht, sagt %NAME%",
]

EMOJI["rakete"] = [
    z(L, L, L, L, "🪐", L, L, "⭐"),
    z(L, "⭐", L, L, L, L, "🛸", L),
    z(L, L, L, "🚀", L, L, L, L),
    z(L, L, "🔥", "🔥", L, L, "✨", L),
    z(L, L, L, "🌍", L, L, L, L),
    "%NAME% hebt ab",
]

EMOJI["sonnenaufgang"] = [
    z(L, L, L, L, "☀️", L, L, L),
    z(L, L, "☁️", L, L, L, "☁️", L),
    z("🐦", L, L, L, L, L, L, "🐦"),
    z("🌲", "🌳", "🏠", "🌳", "🌲", "🌳", "🌲", "🌳"),
    z("🌿", "🌼", "🌿", "🌼", "🌿", "🌼", "🌿", "🌼"),
    "Guten Morgen von %NAME%",
]

EMOJI["meer"] = [
    z("☀️", L, L, "☁️", L, L, "🕊️", L),
    z(L, L, "⛵", L, L, L, L, L),
    z("🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊", "🌊"),
    z("🐟", L, "🐠", L, L, "🐡", L, "🐟"),
    z("🏖️", "🌴", "🏖️", L, "🐚", L, "🏖️", "🌴"),
    "%NAME% macht Urlaub",
]

EMOJI["geburtstag"] = [
    z("🎈", L, "🎉", L, "🎈", L, "🎉", L, "🎈"),
    z(L, "✨", L, L, L, L, "✨", L),
    z(L, L, "🕯️", "🕯️", "🕯️", L, L),
    z(L, L, "🎂", "🎂", "🎂", L, L),
    z("🎊", L, "🎁", L, "🥳", L, "🎁", L, "🎊"),
    "Herzlichen Glueckwunsch von %NAME%",
]

EMOJI["wald"] = [
    z(L, L, "☀️", L, L, L, "☁️", L),
    z("🌲", "🌳", "🌲", "🌳", "🌲", "🌳", "🌲", "🌳"),
    z("🌳", "🦊", "🌳", L, "🦌", L, "🌳", "🌲"),
    z("🌿", "🍄", "🌿", "🌿", "🍄", "🌿", "🌿", "🍄"),
    "%NAME% geht spazieren",
]

EMOJI["winter"] = [
    z("❄️", L, "❄️", L, "❄️", L, "❄️", L, "❄️"),
    z(L, "❄️", L, "❄️", L, "❄️", L, "❄️"),
    z("🎄", L, "⛄", L, L, "🏠", L, "🎄"),
    z("⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"),
    "%NAME% friert ein bisschen",
]

EMOJI["klassenzimmer"] = [
    z("📚", "📖", "✏️", L, "🧑‍🏫", L, "✏️", "📖", "📚"),
    z(L, L, L, "⬛", "⬛", "⬛", L, L, L),
    z("🧑", L, "👩", L, "👨", L, "🧒", L, "👱"),
    z("🪑", "🪑", "🪑", "🪑", "🪑", "🪑", "🪑"),
    "%NAME% ist im Unterricht",
]

EMOJI["gewitter"] = [
    z("☁️", "⛈️", "☁️", L, "⛈️", "☁️", L),
    z(L, "⚡", L, L, "⚡", L, L, "⚡"),
    z("🌧️", "🌧️", "🌧️", "🌧️", "🌧️", "🌧️"),
    z("☂️", L, L, "🏠", L, L, "☂️"),
    "%NAME% bleibt lieber drinnen",
]

EMOJI["herz"] = [
    z(L, "❤️", "❤️", L, L, "❤️", "❤️", L),
    z("❤️", "❤️", "❤️", "❤️", "❤️", "❤️", "❤️"),
    z(L, "❤️", "❤️", "❤️", "❤️", "❤️", L),
    z(L, L, "❤️", "❤️", "❤️", L, L),
    z(L, L, L, "❤️", L, L, L),
    "von %NAME%",
]

EMOJI["katze"] = [
    z(L, "🔺", L, L, L, "🔺", L),
    z(L, L, "🐱", L, L, L, L),
    z(L, "🐾", L, L, "🐾", L, L),
    z(L, L, "🧶", L, L, L, L),
    "%NAME% hat eine Katze",
]

EMOJI["kaffeepause"] = [
    z(L, "♨️", L, "♨️", L, "♨️", L),
    z(L, "☕", L, "🥐", L, "☕", L),
    z(L, "📖", L, L, L, "📖", L),
    "%NAME% macht Pause",
]

EMOJI["geschenk"] = [
    z("\u2728", L, "\U0001f388", L, "\u2728", L, "\U0001f388", L, "\u2728"),
    z(L, L, "\U0001f381", "\U0001f381", "\U0001f381", L, L),
    z(L, "\U0001f380", L, "\U0001f380", L, "\U0001f380", L),
    z("\U0001f973", L, L, "\u2764\ufe0f", L, L, "\U0001f970"),
    "%NAME%",
]

EMOJI["fussball"] = [
    z("🥅", L, L, L, L, L, L, "🥅"),
    z(L, L, "🏃", L, "⚽", L, L, L),
    z("🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩", "🟩"),
    z(L, "📣", L, "📣", L, "📣", L, "📣"),
    "%NAME% schiesst ein Tor",
]

EMOJI["musik"] = [
    z("🎵", L, "🎶", L, L, "🎵", L, "🎶"),
    z(L, "🎸", L, "🥁", L, "🎹", L),
    z(L, L, L, "🧑‍🎤", L, L, L),
    z("👏", "👏", "👏", "👏", "👏", "👏", "👏"),
    "%NAME% macht Musik",
]

EMOJI["halloween"] = [
    z("🌙", L, "🦇", L, L, "🦇", L, "🌙"),
    z(L, "👻", L, L, "👻", L, L),
    z("🎃", L, "🕸️", L, "🕷️", L, "🎃"),
    z("🪦", "🌲", "🪦", "🏚️", "🪦", "🌲", "🪦"),
    "Buh! sagt %NAME%",
]

EMOJI["weihnachten"] = [
    z("⭐", L, "❄️", L, "❄️", L, "❄️", L, "⭐"),
    z(L, L, L, "🎄", L, L, L),
    z(L, L, "🎁", "🎁", "🎁", L, L),
    z("🦌", "🛷", L, L, L, "🎅", "🔔"),
    "Frohe Weihnachten von %NAME%",
]


def als_js(zeilen):
    """Eine Zeilenliste als Javascript-Ausdruck — jedes Zeichen ausserhalb
    von ASCII wird zu \\uXXXX, damit die Datei überall gleich gelesen wird."""
    teile = []
    for zeile in zeilen:
        t = zeile.replace("\\", "\\\\").replace('"', '\\"')
        aus = []
        for ch in t:
            k = ord(ch)
            if k < 128:
                aus.append(ch)
            elif k > 0xFFFF:
                n = k - 0x10000
                aus.append("\\u%04x\\u%04x" % (0xD800 + (n >> 10), 0xDC00 + (n & 0x3FF)))
            else:
                aus.append("\\u%04x" % k)
        teile.append('"' + "".join(aus) + '"')
    return "\n      [" + ",\n       ".join(teile) + '].join("\\n")'


KOPF = '''  /* =========================================================
     BILDER AUS BUCHSTABEN UND AUS EMOJIS
     ---------------------------------------------------------
     GEWÜNSCHT: „Die ASCII-Codes können noch ein bisschen
     umfangreicher sein, nicht so einfach und billig. Der Fuchs kann
     zum Beispiel ein richtig schöner, realistischer Fuchs sein …
     und dann so etwas mit Emojis, wie bei einem ASCII-Code aus
     Emojis mit Sternen, Rakete, Planeten — so verschiedene
     Bilderthemen, die kleine Geschichten erzählen."

     Deshalb zweierlei:

       /ascii <name>   Bilder aus Buchstaben, wie sie damals durch
         die Chats gingen. Sie stehen nur richtig da, wenn jede
         Stelle gleich breit ist — beim Zeichnen kommen sie deshalb
         in Schreibmaschinenschrift.

       /bild <name>    Bilder aus Emojis: bunt, ohne feste Breite,
         und sie erzählen etwas. Ein Sternenhimmel mit Lagerfeuer,
         eine Rakete, die vor einem Planeten abhebt, ein
         Sonnenaufgang über dem Dorf. Als Abstand steht zwischen
         den Zeichen ein Geviertleerzeichen (U+3000) — genauso
         breit wie ein Emoji; mit einem gewöhnlichen Leerzeichen
         verrutscht jede Anordnung.

     Beide Sammlungen stehen in werkzeug/bau-chatbilder.py und
     werden von dort hierher geschrieben. Wer etwas ändern will,
     ändert es DORT und lässt das Werkzeug laufen.
     ========================================================= */
'''


def main():
    teile = [KOPF, "  var ASCII = {"]
    teile.append(",\n".join("    %s:%s" % (k, als_js(ASCII[k])) for k in sorted(ASCII)))
    teile.append("  };")
    teile.append("")
    teile.append("  var EMOJIBILD = {")
    teile.append(",\n".join("    %s:%s" % (k, als_js(EMOJI[k])) for k in sorted(EMOJI)))
    teile.append("  };")
    neu = "\n".join(teile)

    s = io.open(ZIEL, encoding="utf-8").read()
    zeilen = s.split("\n")

    start = None
    for i, zl in enumerate(zeilen):
        if zl.strip().startswith("var ASCII = {"):
            start = i
            break
    if start is None:
        sys.exit("var ASCII nicht gefunden — nichts geändert.")

    # Den Kommentarblock davor mitnehmen
    k = start - 1
    while k > 0 and not zeilen[k].strip().startswith("/* ==="):
        k -= 1

    # Bis zum Ende von ASCII, und falls schon vorhanden auch EMOJIBILD
    ende = start
    while ende < len(zeilen) and zeilen[ende].rstrip() != "  };":
        ende += 1
    nach = ende + 1
    while nach < len(zeilen) and not zeilen[nach].strip():
        nach += 1
    if nach < len(zeilen) and zeilen[nach].strip().startswith("var EMOJIBILD = {"):
        ende = nach
        while ende < len(zeilen) and zeilen[ende].rstrip() != "  };":
            ende += 1

    io.open(ZIEL, "w", encoding="utf-8").write(
        "\n".join(zeilen[:k] + neu.split("\n") + zeilen[ende + 1:])
    )
    print("%d Bilder aus Buchstaben, %d aus Emojis" % (len(ASCII), len(EMOJI)))


if __name__ == "__main__":
    main()
