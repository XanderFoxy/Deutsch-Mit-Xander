# -*- coding: utf-8 -*-
"""Gemeinsames Handwerkszeug fuer die gezeichneten Tiere und Figuren.

Hier steht nur, was MEHRERE Bauskripte brauchen: Kurven, Schlaeuche,
Drehungen, Farbrechnung. Die Tiere selbst stehen je in ihrer eigenen
Datei (bau-tyrannosaurus.py, bau-hund.py, ...).
"""
import math

def z(v):
    """Zahl kurz schreiben — spart ueber 170 Szenen viele Kilobyte."""
    s = "%.1f" % v
    return s[:-2] if s.endswith(".0") else s

def mischen(hexfarbe, anteil):
    """Heller (anteil > 1) oder dunkler (anteil < 1) machen."""
    h = hexfarbe.lstrip("#")
    r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    f = lambda v: max(0, min(255, int(v * anteil)))
    return "#%02x%02x%02x" % (f(r), f(g), f(b))

def dunkler(hexfarbe, anteil):
    return mischen(hexfarbe, anteil)

def kurve(pkt, zu=True, spannung=0.5):
    """Catmull-Rom durch die Punkte, als kubische Bezierkurve ausgegeben.

    Von Hand geschriebene C-Befehle waren schon einmal die Quelle eines
    Fehlers, der in sieben Szenen einen ganzen Pfad geloescht hat (ein C
    mit vier statt sechs Zahlen). Hier kann das nicht mehr passieren.
    """
    n = len(pkt)
    if n < 3:
        return "M" + " L".join("%s %s" % (z(x), z(y)) for x, y in pkt)
    hol = (lambda i: pkt[i % n]) if zu else (lambda i: pkt[min(max(i, 0), n-1)])
    teile = ["M%s %s" % (z(pkt[0][0]), z(pkt[0][1]))]
    ende = n if zu else n - 1
    for i in range(ende):
        p0, p1, p2, p3 = hol(i-1), hol(i), hol(i+1), hol(i+2)
        c1 = (p1[0] + (p2[0]-p0[0])*spannung/3.0, p1[1] + (p2[1]-p0[1])*spannung/3.0)
        c2 = (p2[0] - (p3[0]-p1[0])*spannung/3.0, p2[1] - (p3[1]-p1[1])*spannung/3.0)
        teile.append("C%s %s %s %s %s %s" % (z(c1[0]), z(c1[1]), z(c2[0]), z(c2[1]),
                                             z(p2[0]), z(p2[1])))
    return " ".join(teile) + (" Z" if zu else "")

def schlauch(punkte, breiten, spannung=0.35):
    """Ein Glied als sich verjuengender Schlauch.

    ACHTUNG: hier stehen HALBE Breiten. Wurden einmal volle uebergeben,
    schlug sich das Polygon selbst und ergab eine Schleife weit
    ausserhalb des Beins.
    """
    links, rechts = [], []
    for i, (x, y) in enumerate(punkte):
        if i == 0:
            dx, dy = punkte[1][0]-x, punkte[1][1]-y
        elif i == len(punkte)-1:
            dx, dy = x-punkte[-2][0], y-punkte[-2][1]
        else:
            dx, dy = punkte[i+1][0]-punkte[i-1][0], punkte[i+1][1]-punkte[i-1][1]
        laenge = math.hypot(dx, dy) or 1.0
        nx, ny = -dy/laenge, dx/laenge
        b = breiten[i]
        links.append((x + nx*b, y + ny*b))
        rechts.append((x - nx*b, y - ny*b))
    return kurve(links + rechts[::-1], zu=True, spannung=spannung)

def drehe(punkte, winkel, um):
    """Punkte um einen Drehpunkt drehen.

    Gerechnet wird in Python, NICHT als SVG-transform: ein transform
    verschoebe auch einen Verlauf darunter (userSpaceOnUse), und das
    gedrehte Stueck bekaeme eine andere Stelle des Tonwertbogens.
    """
    a = math.radians(winkel)
    co, si = math.cos(a), math.sin(a)
    ux, uy = um
    return [(ux + (x-ux)*co - (y-uy)*si, uy + (x-ux)*si + (y-uy)*co) for x, y in punkte]

def strecke(punkte, fx, fy, um=(0.0, 0.0)):
    ux, uy = um
    return [(ux + (x-ux)*fx, uy + (y-uy)*fy) for x, y in punkte]
