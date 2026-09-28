/* Probehaus: prüft den Kern (Wände, Giebel, Dach, Fenster, Tür, Schnee). */
(function () {
  const ST = window.STADT, PI = ST.pinsel;
  ST.modell("probehaus", {
    name: "Probehaus", gruppe: "Häuser", grund: [8, 6], hoehe: 10, bauzeit: 120,
    bauen(M, o) {
      const B = 8, T = 6, H = 5.4, HF = 3.6;
      const wand = (w, h, name) => (g, F) => {
        PI.putz(g, 0, 0, F.w, F.h, "#efe6d2", F, { boden: true, saat: name.length });
        PI.quader(g, 0, F.h - 0.6, F.w, 0.6, F, {});
        if (F.w > 7) {
          for (let i = 0; i < 3; i++) PI.fenster(g, 1 + i * 2.3, (F.h - H) + 1.1 + HF, 1.0, 1.35, F, { laeden: "#2f5d3a", kasten: o.jahr === "winter" ? "winter" : "sommer" });
          PI.tuer(g, 3.3, F.h - 2.5, 1.1, 2.2, F, { bogen: true, jahr: "1742" });
          PI.hausnummer(g, 4.7, F.h - 2.0, F, 12);
          PI.klingel(g, 4.75, F.h - 1.6, F, "Weber");
        } else {
          PI.fenster(g, F.w / 2 - 0.5, (F.h - H) + 1.1 + HF, 1.0, 1.35, F, { laeden: "#2f5d3a" });
        }
      };
      const wandLicht = (g, F) => {
        if (F.w > 7) for (let i = 0; i < 3; i++) PI.fensterLicht(g, 1 + i * 2.3, (F.h - H) + 1.1 + HF, 1.0, 1.35, F, {});
      };
      M.teil("haus");
      M.flaeche({ name: "sued", o: [-B / 2, T / 2, H], u: [1, 0, 0], v: [0, 0, -1], w: B, h: H, malen: wand(B, H, "sued"), leuchten: wandLicht, ao: true, traufe: 0.5 });
      M.flaeche({ name: "nord", o: [B / 2, -T / 2, H], u: [-1, 0, 0], v: [0, 0, -1], w: B, h: H, malen: wand(B, H, "nord"), leuchten: wandLicht, ao: true, traufe: 0.5 });
      const giebel = [[0, HF], [T / 2, 0], [T, HF], [T, HF + H], [0, HF + H]];
      M.flaeche({ name: "ost", o: [B / 2, T / 2, H + HF], u: [0, -1, 0], v: [0, 0, -1], w: T, h: H + HF, umriss: giebel, malen: wand(T, H + HF, "ost"), ao: true });
      M.flaeche({ name: "west", o: [-B / 2, -T / 2, H + HF], u: [0, 1, 0], v: [0, 0, -1], w: T, h: H + HF, umriss: giebel, malen: wand(T, H + HF, "west"), ao: true });
      M.teil("dach");
      const dach = (g, F) => {
        PI.biberschwanz(g, 0, 0, F.w, F.h, F, {});
        if (o.jahr === "winter") PI.schneeDach(g, 0, 0, F.w, F.h, F, {});
      };
      M.satteldach({ x: -B / 2, y: -T / 2, b: B, t: T, z: H, hf: HF, ueT: 0.5, ueG: 0.35 }, dach, dach);
      M.teil("kamin");
      M.quader({ x: 1.6, y: -0.3, z: H + HF - 0.4, b: 0.6, t: 0.6, h: 1.4 }, { sued: "#8c4a3a", ost: "#8c4a3a", west: "#8c4a3a", nord: "#8c4a3a", oben: "#333" });
      M.rauchAus(1.9, 0, H + HF + 1.1, 1);
    }
  });
})();
