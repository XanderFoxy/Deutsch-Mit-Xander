/* Misst die Bandenergie einer Tonspur — ohne ffprobe, mit roher PCM. */
const { execFileSync } = require("child_process");
const FF = "/tmp/claude-0/node_modules/ffmpeg-static/ffmpeg";
const datei = process.argv[2];
const roh = execFileSync(FF, ["-v", "error", "-i", datei, "-ac", "1", "-ar", "48000",
  "-f", "f32le", "-"], { maxBuffer: 1 << 28 });
const n = roh.length / 4;
const x = new Float32Array(n);
for (let i = 0; i < n; i++) x[i] = roh.readFloatLE(i * 4);

/* Goertzel je Band, ueber Bloecke von 8192 Punkten. */
const SR = 48000, N = 4096;
const BAENDER = [[20,60],[60,120],[120,250],[250,500],[500,1000],[1000,2000],[2000,4000],[4000,8000],[8000,16000]];
const summe = new Array(BAENDER.length).fill(0);
let bloecke = 0, spitze = 0, quadrat = 0;
for (let i = 0; i < n; i++) { const a = Math.abs(x[i]); if (a > spitze) spitze = a; quadrat += x[i]*x[i]; }
/* einfache DFT ueber Bins, dann Bins den Baendern zuordnen */
for (let off = 0; off + N <= n; off += N * 4) {
  bloecke++;
  const re = new Float64Array(N), im = new Float64Array(N);
  for (let i = 0; i < N; i++) re[i] = x[off + i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)));
  /* iterative FFT */
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
  }
  for (let len = 2; len <= N; len <<= 1) {
    const ang = -2 * Math.PI / len;
    for (let i = 0; i < N; i += len) {
      for (let k = 0; k < len / 2; k++) {
        const wr = Math.cos(ang * k), wi = Math.sin(ang * k);
        const ur = re[i+k], ui = im[i+k];
        const vr = re[i+k+len/2]*wr - im[i+k+len/2]*wi;
        const vi = re[i+k+len/2]*wi + im[i+k+len/2]*wr;
        re[i+k] = ur + vr; im[i+k] = ui + vi;
        re[i+k+len/2] = ur - vr; im[i+k+len/2] = ui - vi;
      }
    }
  }
  for (let b = 0; b < BAENDER.length; b++) {
    const [lo, hi] = BAENDER[b];
    let e = 0;
    const i0 = Math.max(1, Math.round(lo * N / SR)), i1 = Math.min(N/2 - 1, Math.round(hi * N / SR));
    for (let i = i0; i <= i1; i++) e += re[i]*re[i] + im[i]*im[i];
    summe[b] += e;
  }
}
const ges = summe.reduce((a, b) => a + b, 0) || 1;
console.log(datei);
console.log("  Spitze " + (20*Math.log10(spitze||1e-9)).toFixed(1) + " dB, RMS "
  + (20*Math.log10(Math.sqrt(quadrat/n)||1e-9)).toFixed(1) + " dB, " + bloecke + " Bloecke");
BAENDER.forEach(([lo,hi], b) => {
  const anteil = summe[b] / ges;
  const db = 10*Math.log10(anteil || 1e-12);
  console.log("  " + String(lo).padStart(6) + "–" + String(hi).padEnd(6) + " Hz  "
    + (anteil*100).toFixed(2).padStart(6) + " %   " + db.toFixed(1).padStart(6) + " dB  "
    + "#".repeat(Math.max(0, Math.round(anteil*120))));
});
