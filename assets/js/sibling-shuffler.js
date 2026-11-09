/* Sibling shuffler for "What makes us all look different?".
 * Two parents make two children. Each egg and sperm carries one copy of each of the
 * 22 autosomes, a mosaic of that parent's two copies: a random starting copy, switched
 * at each crossover. Crossovers per chromosome ~ Poisson(map length / 100 cM), placed
 * uniformly along the chromosome, no interference (Haldane).
 * ponytail: uniform placement in Mb ignores recombination hotspots; fine for genome-wide sharing.
 * Lengths: NCBI GRCh38.p14 (Mb). Map lengths: Bherer, Campbell & Auton 2017, Nat Commun
 * 8:14994 (female and male cM). Sharing = share of the genome the two children got from
 * the same grandparent copy, averaged over the mother's and father's side.
 */
(function () {
  // [Mb, female cM, male cM] for chromosomes 1-22
  var CHR = [[248.96,327.86,195.56],[242.19,310.68,186.74],[198.3,269.18,164.52],[190.21,256.34,144.12],
    [181.54,246.84,145.84],[170.81,232.37,135.3],[159.35,218.66,133.42],[145.14,202.85,117.06],
    [138.39,186.33,122.04],[133.8,203.95,127.31],[135.09,189.08,117.95],[133.28,196.13,129.16],
    [114.36,150.46,99.74],[107.04,135.59,96.25],[101.99,138.64,98.22],[90.34,150.6,99.55],
    [83.26,149.45,100.96],[80.37,138.22,94.65],[58.62,115.43,91.72],[64.44,119.07,94.52],
    [46.71,72.58,50.35],[50.82,76.31,61.02]];
  var TOTAL = CHR.reduce(function (a, c) { return a + c[0]; }, 0);

  function poisson(m) { var L = Math.exp(-m), k = 0, p = 1; do { k++; p *= Math.random(); } while (p > L); return k - 1; }

  // One copy of a chromosome in a gamete: sorted switch points in [0,1] and the starting copy (0 or 1).
  function gameteChr(cM) {
    var cuts = [], n = poisson(cM / 100);
    for (var i = 0; i < n; i++) cuts.push(Math.random());
    cuts.sort(function (a, b) { return a - b; });
    return { start: Math.random() < 0.5 ? 0 : 1, cuts: cuts };
  }
  // Pieces [from, to, copy] of a gamete chromosome.
  function pieces(g) {
    var out = [], from = 0, c = g.start;
    g.cuts.forEach(function (x) { out.push([from, x, c]); from = x; c = 1 - c; });
    out.push([from, 1, c]);
    return out;
  }
  // Pieces [from, to, same?] comparing the same parent's gametes in two children.
  function compare(a, b) {
    var pts = [0, 1].concat(a.cuts, b.cuts).sort(function (x, y) { return x - y; });
    var pa = pieces(a), pb = pieces(b), out = [];
    function at(p, x) { for (var i = 0; i < p.length; i++) if (x < p[i][1]) return p[i][2]; return p[p.length - 1][2]; }
    for (var i = 0; i + 1 < pts.length; i++) {
      if (pts[i + 1] <= pts[i]) continue;
      var mid = (pts[i] + pts[i + 1]) / 2;
      out.push([pts[i], pts[i + 1], at(pa, mid) === at(pb, mid)]);
    }
    return out;
  }
  function pair() {
    var chrs = CHR.map(function (c) {
      return { mum: compare(gameteChr(c[1]), gameteChr(c[1])), dad: compare(gameteChr(c[2]), gameteChr(c[2])) };
    });
    var shared = 0;
    chrs.forEach(function (c, i) {
      [c.mum, c.dad].forEach(function (side) {
        side.forEach(function (p) { if (p[2]) shared += (p[1] - p[0]) * CHR[i][0] / 2; });
      });
    });
    return { chrs: chrs, share: shared / TOTAL };
  }

  if (typeof document === 'undefined') { module.exports = { pair: pair }; return; }

  var root = document.getElementById('sib-shuffler');
  if (!root) return;
  var cvC = document.getElementById('ss-chr'), cvH = document.getElementById('ss-hist');
  var out = document.getElementById('ss-result'), shares = [], last = null;
  var MUM = '#d0403b', DAD = '#3b6fd8', LO = 0.35, HI = 0.65, BINS = 60;

  function setup(cv, h) {
    var w = cv.clientWidth, r = window.devicePixelRatio || 1;
    cv.width = w * r; cv.height = h * r; cv.style.height = h + 'px';
    var g = cv.getContext('2d'); g.setTransform(r, 0, 0, r, 0, 0);
    g.font = '11px ' + getComputedStyle(root).fontFamily;
    return { g: g, w: w, ink: getComputedStyle(root).color };
  }
  function drawChr() {
    var c = setup(cvC, 22 * 15 + 10), g = c.g, x0 = 22, W = c.w - x0 - 4;
    if (!last) return;
    last.chrs.forEach(function (ch, i) {
      var y = 4 + i * 15, len = CHR[i][0] / CHR[0][0] * W;
      g.fillStyle = c.ink; g.globalAlpha = 0.7; g.textAlign = 'right'; g.fillText(i + 1, x0 - 4, y + 10);
      [[ch.mum, MUM, 0], [ch.dad, DAD, 6]].forEach(function (s) {
        s[0].forEach(function (p) {
          g.fillStyle = s[1]; g.globalAlpha = p[2] ? 0.9 : 0.15;
          g.fillRect(x0 + p[0] * len, y + s[2], (p[1] - p[0]) * len, 5);
        });
      });
    });
    g.globalAlpha = 1;
  }
  function drawHist() {
    var c = setup(cvH, 150), g = c.g, x0 = 6, W = c.w - 12, base = 120, counts = new Array(BINS).fill(0);
    shares.forEach(function (s) { var b = Math.floor((s - LO) / (HI - LO) * BINS); if (b >= 0 && b < BINS) counts[b]++; });
    var mx = Math.max.apply(null, counts) || 1, X = function (v) { return x0 + (v - LO) / (HI - LO) * W; };
    g.fillStyle = c.ink; g.globalAlpha = 0.5;
    counts.forEach(function (n, i) { var h = n / mx * 100; g.fillRect(x0 + i * W / BINS + 0.5, base - h, W / BINS - 1, h); });
    // Visscher et al. 2006: mean 0.498, SD 0.036 over 4,401 real sibling pairs
    g.globalAlpha = 0.9; g.strokeStyle = c.ink; g.setLineDash([4, 3]);
    [0.498 - 0.036, 0.498, 0.498 + 0.036].forEach(function (v) { g.beginPath(); g.moveTo(X(v), 10); g.lineTo(X(v), base); g.stroke(); });
    g.setLineDash([]); g.textAlign = 'center'; g.fillStyle = c.ink;
    g.beginPath(); g.moveTo(x0, base); g.lineTo(x0 + W, base); g.stroke();
    [0.4, 0.5, 0.6].forEach(function (v) { g.fillText(Math.round(v * 100) + '%', X(v), base + 14); });
    g.fillText('real siblings: mean ± 1 SD', X(0.498), 8 + 0);
    g.textAlign = 'left'; g.fillText('genome shared', x0, base + 28);
  }
  function stats() {
    var n = shares.length, m = shares.reduce(function (a, b) { return a + b; }, 0) / n;
    var sd = Math.sqrt(shares.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / n);
    return { n: n, m: m, sd: sd, lo: Math.min.apply(null, shares), hi: Math.max.apply(null, shares) };
  }
  function show() {
    drawChr(); drawHist();
    var s = stats(), pct = function (v) { return (v * 100).toFixed(1) + '%'; };
    out.innerHTML = 'These two children share <b>' + pct(last.share) + '</b> of their genome. ' +
      'Over ' + s.n.toLocaleString('en-IN') + ' pairs so far: mean ' + pct(s.m) +
      (s.n > 1 ? ', SD ' + pct(s.sd) + ', range ' + pct(s.lo) + ' to ' + pct(s.hi) : '') +
      '. Real siblings: mean 49.8%, SD 3.6%, range 37.4% to 61.7%.';
  }
  function add(k) { for (var i = 0; i < k; i++) { last = pair(); shares.push(last.share); } show(); }
  document.getElementById('ss-one').addEventListener('click', function () { add(1); });
  document.getElementById('ss-many').addEventListener('click', function () { add(1000); });
  window.addEventListener('resize', function () { if (last) { drawChr(); drawHist(); } });
  add(1);
})();
