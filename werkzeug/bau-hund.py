# -*- coding: utf-8 -*-
"""Der Hund und der Welpe — neu gezeichnet.

WARUM NEU: an der alten Zeichnung fehlte dem Hund der Hals. Der Kopf
sass als Wolkenform mit lauter Ausbuchtungen direkt auf der Brust, die
Schnauze war ein glatter Kegel ohne Kiefer, die Beine waren gerade
Roehren ohne Schulter, Ellenbogen und Sprunggelenk, der Schwanz ein
gerader Stock, und die Haarstriche standen ueber den Umriss hinaus.

WAS JETZT STIMMT (Maszverhaeltnisse eines mittelgrossen Haushundes,
Widerristhoehe 55 cm):
  Rumpflaenge : Widerristhoehe   = 1,10 : 1      (leicht rechteckig)
  Kopflaenge  : Widerristhoehe   = 0,40 : 1
  Schaedel : Fang                = 1 : 1         (beim Welpen 1 : 0,6)
  Brusttiefe                     = 0,48 der Widerristhoehe
  Vorderbein: Schulterblatt, Oberarm, Unterarm, Vordermittelfuss
  Hinterbein: Oberschenkel, Unterschenkel, Sprunggelenk, Hintermittelfuss
              — das Sprunggelenk zeigt nach HINTEN, das ist der Winkel,
              an dem man einen Hund ueberhaupt als Hund erkennt.

WELPE: nicht einfach kleiner. Der Kopf ist im Verhaeltnis viel groesser
(0,52 statt 0,40), der Fang kurz, der Schaedel rund, das Auge absolut
fast so gross wie beim erwachsenen Tier, die Beine kurz und dick, die
Pfoten zu gross. Genau daran erkennt das Auge ein Jungtier.

Aufruf:  python3 werkzeug/bau-hund.py        (schreibt die Szenen)
         python3 werkzeug/bau-hund.py -p hund
"""
import json, math, os, shutil, sys, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from zeichenwerk import z, kurve, schlauch, drehe, dunkler, strecke

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FARBE = {
    "fell":    "#c9a05c",
    "hell":    "#e4c58c",
    "dunkel":  "#9a7038",
    "tief":    "#5e4320",
    "kontur":  "#4a3417",
    "nase":    "#2b2118",
    "auge":    "#3a2a18",
    "zunge":   "#c9707a",
    "band":    "#c0392b",
    "marke":   "#e0b13c",
}

# ------------------------------------------------------------ Landmarken
# Blickrichtung nach RECHTS, Boden bei y = 0.
def masse(welpe):
    """Alle Landmarken in einem Satz — beim Welpen mit anderen
    Verhaeltnissen, nicht nur kleiner."""
    if not welpe:
        return dict(
            umriss=[
                # Kopflaenge 14 = 0,40 der Widerristhoehe. Der Fang ist
                # 6,4 lang und 4,7 TIEF — vorher war er eine duenne
                # Roehre, und daraus wurde ein Windhund.
                (19.0, -35.8),   # Nasenspitze (das Nasenleder steht vor)
                (18.8, -38.0),   # Nasenruecken vorn
                (15.4, -38.6),
                (12.6, -38.8),   # Stop — der Absatz zwischen Fang und Stirn
                (10.4, -41.2),   # Stirn
                (7.2,  -41.8),   # Schaedeldach
                (4.4,  -40.4),   # Hinterhaupt
                (1.2,  -37.4),   # Nacken
                (-2.0, -34.6),   # Widerrist
                (-9.0, -34.0),   # Ruecken
                (-16.0, -33.6),  # Kruppe
                (-21.0, -31.2),  # Schwanzwurzel
                (-24.4, -25.6),  # Gesaess
                (-23.4, -20.8),  # Keule — der Oberschenkel gehoert in den
                (-19.4, -18.6),  #   Umriss, sonst hat der Hund kein Hinterteil
                (-13.0, -20.4),  # LENDE: hier ist der Hund aufgezogen. Ohne
                (-6.6,  -18.4),  #   diese Einschnuerung wird jeder Hund ein Fass.
                (-0.6,  -18.6),  # Bauch
                (3.4,   -21.6),  # Brustbein — die Brust ist TIEFER als der Bauch
                (5.0,   -25.6),  # Vorbrust
                (5.6,   -29.8),  # Kehle
                (8.8,   -32.4),  # Backe und Kieferwinkel
                (13.5,  -33.4),  # Unterkiefer
                (18.0,  -33.6),  # Kinn
            ],
            ohr=[(7.4, -40.8), (10.4, -38.4), (10.6, -33.0), (8.8, -28.8),
                 (6.0, -29.6), (4.8, -34.6), (5.2, -39.2)],
            schwanz=([(-21.0, -31.4), (-25.0, -34.0), (-28.6, -37.6), (-30.2, -41.4)],
                     [2.1, 1.6, 1.1, 0.7]),
            vorn=([(2.4, -26.4), (3.6, -18.4), (4.0, -8.2), (4.6, -1.2)],
                  [5.0, 3.2, 2.4, 2.3]),
            hinten=([(-18.2, -25.8), (-13.8, -17.4), (-18.4, -8.8), (-16.8, -1.2)],
                    [7.0, 4.2, 2.8, 2.5]),
            auge=(11.6, -38.6, 1.15),
            nase=(18.2, -36.8, 1.85),
            maul=[(13.8, -33.8), (16.2, -34.8), (17.8, -35.6)],
            halsband=(-0.4, -33.0, 5.6),
            boden=(-6, 18),
            fern=-3.2,
        )
    # --- Welpe --------------------------------------------------------
    # Ein Welpe ist NICHT ein kleiner Hund. Widerristhoehe 21:
    #   Kopflaenge   0,52 der Widerristhoehe (erwachsen 0,40)
    #   Fang : Schaedel   0,6 : 1            (erwachsen 1 : 1)
    #   Brusttiefe   0,42                    (erwachsen 0,48)
    #   Auge absolut fast so gross wie beim erwachsenen Tier
    #   Pfoten zu gross, Beine kurz und dick, kaum Lendeneinzug
    return dict(
        umriss=[
            (13.6, -21.8),   # Nasenspitze — kurzer Fang
            (13.4, -23.6),
            (11.2, -24.2),
            (9.6,  -24.4),   # Stop, beim Welpen viel deutlicher als spaeter
            (8.0,  -26.6),   # runde Stirn
            (5.0,  -27.4),   # Schaedeldach, kugelig
            (2.2,  -26.4),   # Hinterhaupt
            (-0.4, -23.6),   # kurzer Nacken
            (-3.2, -21.4),   # Widerrist
            (-8.0, -21.2),   # Ruecken, noch weich
            (-12.8, -21.4),  # Kruppe
            (-15.8, -19.6),  # Schwanzwurzel
            (-18.2, -16.0),  # Gesaess
            (-17.4, -12.4),  # Keule
            (-14.4, -10.8),
            (-9.6,  -11.6),  # nur wenig aufgezogen — Welpen haben Kugelbaeuche
            (-4.6,  -11.0),
            (0.0,   -11.8),
            (2.4,   -13.8),  # Brustbein
            (3.6,   -16.8),  # Vorbrust
            (4.2,   -19.4),  # Kehle
            (6.4,   -20.6),  # Backe
            (10.0,  -20.6),  # Unterkiefer
            (12.8,  -20.4),  # Kinn
        ],
        ohr=[(5.0, -27.0), (7.6, -25.0), (7.8, -20.2), (6.2, -17.0),
             (3.8, -17.6), (3.0, -21.8), (3.2, -25.4)],
        schwanz=([(-15.8, -19.8), (-17.8, -21.4), (-19.4, -23.0), (-20.0, -24.8)],
                 [1.5, 1.2, 0.9, 0.55]),
        vorn=([(1.6, -16.0), (2.2, -9.6), (2.6, -4.2), (3.0, -1.0)],
              [3.4, 2.5, 2.1, 2.3]),
        hinten=([(-13.6, -14.8), (-10.6, -9.4), (-13.8, -4.6), (-12.6, -1.0)],
                [4.6, 2.9, 2.2, 2.4]),
        auge=(9.2, -24.0, 1.3),            # absolut fast so gross wie beim Grossen
        nase=(13.0, -22.4, 1.4),
        maul=[(10.4, -20.8), (12.0, -21.6), (13.0, -22.2)],
        halsband=None,
        boden=(-5, 11),
        fern=-2.0,
    )

# ------------------------------------------------------------------ Bild
def zeichne(welpe=False, vorsilbe="hd"):
    m = masse(welpe)
    P = vorsilbe
    t = []
    a = t.append
    U = m["umriss"]
    oben = min(y for _, y in U)

    bx, brx = m["boden"]
    a('<ellipse class="bw-bodenschatten" cx="%s" cy="0.6" rx="%s" ry="%s" '
      'fill="#4a3417" opacity="0.15"/>' % (z(bx), z(brx), z(brx*0.16)))

    a('<defs>')
    a('<linearGradient id="%sk" x1="0" y1="%s" x2="0" y2="0" gradientUnits="userSpaceOnUse">'
      '<stop offset="0" stop-color="%s"/><stop offset="0.52" stop-color="%s"/>'
      '<stop offset="1" stop-color="%s"/></linearGradient>'
      % (P, z(oben), FARBE["dunkel"], FARBE["fell"], FARBE["hell"]))
    a('<linearGradient id="%sb" x1="0" y1="%s" x2="0" y2="0" gradientUnits="userSpaceOnUse">'
      '<stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'
      % (P, z(oben*0.62), dunkler(FARBE["fell"], 0.94), dunkler(FARBE["fell"], 0.82)))
    a('<clipPath id="%sc"><path d="%s"/></clipPath>' % (P, kurve(U)))
    a('<radialGradient id="%ss"><stop offset="0" stop-color="%s" stop-opacity="0.42"/>'
      '<stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>'
      % (P, FARBE["tief"], FARBE["tief"]))
    a('</defs>')

    # --- ferne Beine: dahinter, abgedunkelt, versetzt ------------------
    def bein(satz, fuell, strich, versatz=(0.0, 0.0)):
        punkte, breiten = satz
        p = [(x+versatz[0], y+versatz[1]) for x, y in punkte]
        k = (' stroke="%s" stroke-width="0.45" stroke-linejoin="round"' % FARBE["kontur"]) if strich else ''
        return '<path d="%s" fill="%s"%s/>' % (schlauch(p, breiten), fuell, k)

    def pfote(punkt, breite, fuell, strich=True):
        """Eine Hundepfote ist ein RUNDES Polster mit drei Zehen vorn —
        kein Klumpen. Sie sitzt auf dem Boden und ragt nach vorn."""
        x, y = punkt
        b = breite
        k = (' stroke="%s" stroke-width="0.4" stroke-linejoin="round"' % FARBE["kontur"]) if strich else ''
        rund = kurve([(x - b*0.9, y - b*0.5), (x + b*0.8, y - b*0.7),
                      (x + b*1.55, y - b*0.1), (x + b*1.5, y + b*0.85),
                      (x + b*0.3, y + b*1.05), (x - b*0.85, y + b*0.7)], spannung=0.42)
        s = ['<path d="%s" fill="%s"%s/>' % (rund, fuell, k)]
        if strich:
            for i in range(3):
                zx = x + b*(0.15 + i*0.52)
                s.append('<path d="M%s %s C%s %s %s %s %s %s" fill="none" stroke="%s" '
                         'stroke-width="0.4" stroke-opacity="0.3" stroke-linecap="round"/>'
                         % (z(zx), z(y + b*0.2), z(zx + b*0.1), z(y + b*0.6),
                            z(zx + b*0.14), z(y + b*0.8), z(zx + b*0.1), z(y + b*0.98),
                            FARBE["tief"]))
        return "".join(s)

    fern = dunkler(FARBE["fell"], 0.8)
    versatz = (m.get("fern", -3.0), 0.0)
    a('<g opacity="0.95">')
    a(bein(m["hinten"], fern, False, versatz))
    a(bein(m["vorn"], fern, False, versatz))
    for satz in (m["hinten"], m["vorn"]):
        p = satz[0][-1]
        a(pfote((p[0]+versatz[0], p[1]+versatz[1]), satz[1][-1], fern, strich=False))
    a('</g>')

    # --- Schwanz (hinter dem Koerper) ---------------------------------
    a(bein(m["schwanz"], "url(#%sb)" % P, True))

    # --- NAHE Beine, und zwar VOR dem Rumpf gezeichnet ----------------
    #     Das obere Ende steckt im Koerper und wird gleich vom Rumpf
    #     verdeckt. Zeichnete man die Beine danach, klebte der
    #     Oberschenkel als Platte mit eigener Kontur auf der Flanke —
    #     genau der Eindruck, den die alte Zeichnung machte.
    a(bein(m["hinten"], "url(#%sb)" % P, True))
    a(pfote(m["hinten"][0][-1], m["hinten"][1][-1], "url(#%sb)" % P))
    a(bein(m["vorn"], "url(#%sb)" % P, True))
    a(pfote(m["vorn"][0][-1], m["vorn"][1][-1], "url(#%sb)" % P))

    # --- Koerper: EIN geschlossener Umriss ----------------------------
    a('<path d="%s" fill="url(#%sk)" stroke="%s" stroke-width="0.55" '
      'stroke-linejoin="round"/>' % (kurve(U), P, FARBE["kontur"]))

    # --- Modellierung, am Umriss beschnitten --------------------------
    a('<g clip-path="url(#%sc)">' % P)
    # Brustkorb und der Schatten unter ihm
    brust_x = U[17][0] - (6 if not welpe else 4)
    a('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#%ss)"/>'
      % (z(brust_x), z(U[17][1]-1), z(9 if not welpe else 6.5), z(4.4 if not welpe else 3.2), P))
    # heller Bauch / Brust
    a('<path d="%s" fill="%s" opacity="0.26"/>'
      % (kurve([(x, y+ (1.2 if not welpe else 0.9)) for x, y in U[14:20]]
               + [(U[19][0]-3, U[19][1]+5), (U[16][0], U[16][1]+4), (U[14][0]+2, U[14][1]+3)],
               spannung=0.4), FARBE["hell"]))
    # Schulterblatt und Keule als weiche Kuppen
    a('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" opacity="0.16" '
      'transform="rotate(-18 %s %s)"/>'
      % (z(U[18][0]-3), z(U[18][1]-5), z(4.4 if not welpe else 3.2), z(6.0 if not welpe else 4.2),
         FARBE["hell"], z(U[18][0]-3), z(U[18][1]-5)))
    a('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" opacity="0.16"/>'
      % (z(U[12][0]+3), z(U[12][1]-2), z(5.2 if not welpe else 3.6), z(5.6 if not welpe else 4.0),
         FARBE["hell"]))
    # Lichtsaum oben auf Ruecken und Schaedel
    a('<path d="%s" fill="none" stroke="%s" stroke-width="%s" stroke-opacity="0.3" '
      'stroke-linecap="round"/>'
      % (kurve(U[3:12], zu=False, spannung=0.5), FARBE["hell"], z(1.6 if not welpe else 1.2)))
    # kurze Fellstriche — INNERHALB des Umrisses, nicht darueber hinaus
    schritt = 3.4 if not welpe else 2.4
    n = int((U[8][0] - U[11][0]) / schritt) + 1
    for i in range(max(n, 3)):
        x = U[11][0] + i*schritt
        y = U[9][1] + 1.6
        a('<path d="M%s %s l%s %s" stroke="%s" stroke-width="0.42" stroke-opacity="0.14" '
          'stroke-linecap="round"/>' % (z(x), z(y), z(1.6), z(2.6), FARBE["tief"]))
    a('</g>')

    # --- Kopf: Ohr, Auge, Nase, Maul ----------------------------------
    a('<path d="%s" fill="%s" stroke="%s" stroke-width="0.5" stroke-linejoin="round"/>'
      % (kurve(m["ohr"], spannung=0.4), dunkler(FARBE["fell"], 0.84), FARBE["kontur"]))
    a('<path d="%s" fill="%s" opacity="0.35"/>'
      % (kurve([(x+0.8, y+1.2) for x, y in m["ohr"][2:6]] + [(m["ohr"][1][0]+0.6, m["ohr"][1][1]+1.6)],
               spannung=0.4), FARBE["tief"]))
    ax, ay, ar = m["auge"]
    a('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s"/>'
      % (z(ax), z(ay), z(ar), z(ar*0.92), FARBE["auge"]))
    a('<circle cx="%s" cy="%s" r="%s" fill="#0f0b06"/>' % (z(ax), z(ay), z(ar*0.6)))
    a('<circle cx="%s" cy="%s" r="%s" fill="#fff" opacity="0.85"/>'
      % (z(ax-ar*0.32), z(ay-ar*0.34), z(ar*0.26)))
    a('<path d="M%s %s C%s %s %s %s %s %s" fill="none" stroke="%s" stroke-width="0.45" '
      'stroke-opacity="0.5" stroke-linecap="round"/>'
      % (z(ax-ar*1.5), z(ay-ar*1.1), z(ax-ar*0.5), z(ay-ar*2.0), z(ax+ar*0.5), z(ay-ar*2.0),
         z(ax+ar*1.5), z(ay-ar*1.0), FARBE["tief"]))
    nx, ny, nr = m["nase"]
    a('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s"/>'
      % (z(nx), z(ny), z(nr), z(nr*0.78), FARBE["nase"]))
    a('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#fff" opacity="0.28"/>'
      % (z(nx-nr*0.3), z(ny-nr*0.32), z(nr*0.34), z(nr*0.22)))
    a('<path d="%s" fill="none" stroke="%s" stroke-width="0.5" stroke-opacity="0.55" '
      'stroke-linecap="round"/>' % (kurve(m["maul"], zu=False, spannung=0.4), FARBE["tief"]))
    # Schnurrhaare
    for i in range(3):
        a('<path d="M%s %s l%s %s" stroke="%s" stroke-width="0.28" stroke-opacity="0.28" '
          'stroke-linecap="round"/>'
          % (z(nx-nr*1.6), z(ny+1.0+i*0.9), z(-2.6 - i*0.4), z(-0.7 + i*0.7), FARBE["tief"]))

    # --- Halsband mit Marke (nur beim erwachsenen Hund) ----------------
    if m["halsband"]:
        hx, hy, hr = m["halsband"]
        a('<path d="M%s %s C%s %s %s %s %s %s" fill="none" stroke="%s" stroke-width="2.0" '
          'stroke-linecap="round"/>'
          % (z(hx-hr*0.9), z(hy-2.2), z(hx), z(hy+2.4), z(hx+hr*0.7), z(hy+2.2), z(hx+hr*1.1), z(hy-2.6),
             FARBE["band"]))
        a('<circle cx="%s" cy="%s" r="1.5" fill="%s" stroke="%s" stroke-width="0.3"/>'
          % (z(hx+hr*0.1), z(hy+2.6), FARBE["marke"], FARBE["tief"]))
    return "".join(t)

# -------------------------------------------------------------- Einbauen
ZIELE = [("haustiere", "hund", False), ("haustiere", "welpe", True),
         ("bauernhof", "hund", False)]

def einbauen():
    sicher = os.path.join(WURZEL, "sicherung",
                          datetime.datetime.now().strftime("%Y-%m-%d") + "-hund")
    os.makedirs(sicher, exist_ok=True)
    nach_szene = {}
    for szene, teil, welpe in ZIELE:
        nach_szene.setdefault(szene, []).append((teil, welpe))
    for szene, liste in nach_szene.items():
        pfad = os.path.join(WURZEL, "szenen", szene + ".js")
        txt = open(pfad, encoding="utf-8").read()
        i = txt.index('{"id"'); j = txt.rindex("};")
        d = json.loads(txt[i:j+1])
        if not os.path.exists(os.path.join(sicher, szene + ".js")):
            shutil.copy2(pfad, sicher)
        for teil, welpe in liste:
            for x in d["teile"]:
                if x["id"] == teil:
                    alt = len(x.get("kunst") or "")
                    x["kunst"] = zeichne(welpe, vorsilbe=("wp" if welpe else "hd") + szene[:2])
                    print("%-12s %-8s %6d -> %6d" % (szene, teil, alt, len(x["kunst"])))
                    break
            else:
                print("!! %s fehlt in %s" % (teil, szene))
        open(pfad, "w", encoding="utf-8").write(
            txt[:i] + json.dumps(d, ensure_ascii=False, separators=(",", ":")) + txt[j+1:])

if __name__ == "__main__":
    if "-p" in sys.argv:
        print(zeichne(welpe=("welpe" in sys.argv)))
    else:
        einbauen()
