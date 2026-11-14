// bandwidth: one antenna, several bandwidths (Balanis §2.11), and the Q limit on small antennas (Balanis §11.5).
//   dipole  a copper-free 2.45 GHz Wi-Fi dipole of wire radius b, trimmed so that X = 0 at 2.45 GHz, then swept from
//           1.2 to 6 GHz with its length fixed (length and radius in wavelengths scale with f). Impedance from the
//           induced-EMF formulas (efficiency-chain's dipoleZ, Balanis 8-60, 8-61); pattern from Balanis (4-64)
//           (gain-pattern's dipoleD). Impedance band: VSWR <= s on a 50 or 75 ohm line, or on R0 (matched).
//           Pattern band: D0 within 1 dB of its value at 2.45 GHz. Q = (f0 / 2 R0) dX/df at f0; a series RLC with
//           that Q on a matched line has a VSWR <= s band of (s - 1) / (Q sqrt s).
//   small   Q against kr for an antenna inside a sphere of radius r: the Chu limit (11-35), a thin dipole tuned by
//           an ideal series coil, Q = |X| / R with Balanis (11-37), and the dipole with a series loss resistance,
//           Q_lossy = e_cd Q; band (s - 1) / (Q sqrt s) with s = 2. (Balanis prints (11-38) as this Q divided by 6.)
// The induced-EMF impedance is infinite at the antiresonance near L = lambda (about 5.1 GHz here); VSWR is drawn up
// to 10 only. Markup from _includes/readalong/bandwidth.html; helpers from readalong.js (window.RA). The maths at
// the top has no DOM and is also run under node by content/balanis/checks/bandwidth.py.
(function () {
  var node = typeof module !== 'undefined';
  var E = node ? require('./efficiency-chain.js') : window.EfficiencyChain;
  var GP = node ? require('./gain-pattern.js') : window.GainPattern;
  var PI = Math.PI, F0 = E.F / 1e9, FMIN = 1.2, FMAX = 6;   // GHz

  function resLength(bmm) {   // L / lambda at F0 where X = 0 (bisection; X rises through 0 just below lambda/2)
    var a = bmm / 1000 / E.LAMBDA, lo = 0.40, hi = 0.499;
    for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (E.dipoleZ(m, a).X > 0) hi = m; else lo = m; }
    return (lo + hi) / 2;
  }
  function zAt(f, L0, bmm) {   // input impedance at f GHz of the dipole cut for F0
    var s = f / F0;
    return E.dipoleZ(L0 * s, bmm / 1000 / E.LAMBDA * s);
  }
  function vswr(z, Z0) { var g = E.gamma(z.R, z.X, Z0); return (1 + g) / (1 - g); }
  function Qof(L0, bmm) {   // (f0 / 2 R0) dX/df, central difference
    var h = 1e-5, R0 = zAt(F0, L0, bmm).R;
    return (zAt(F0 * (1 + h), L0, bmm).X - zAt(F0 * (1 - h), L0, bmm).X) / (2 * h) / (2 * R0);
  }
  function fbw(Q, s) { return (s - 1) / (Q * Math.sqrt(s)); }
  function pattern(L) {   // D0 and the half-power beamwidth of the broadside lobe (degrees)
    var d = GP.dipoleD(L), half = d.D(PI / 2) / 2, lo = 0, hi = PI / 2;
    for (var i = 0; i < 50; i++) { var m = (lo + hi) / 2; if (d.D(m) < half) lo = m; else hi = m; }
    return { D0: d.D0, D: d.D, hpbw: 2 * (90 - (lo + hi) / 2 * 180 / PI) };
  }
  // Edge of the band around f0 where ok(f) holds, searched outwards to `end`; null if it reaches `end`.
  function edge(ok, end) {
    var n = 400, prev = F0;
    for (var i = 1; i <= n; i++) {
      var f = F0 * Math.pow(end / F0, i / n);
      if (!ok(f)) {
        var a = prev, b = f;
        for (var j = 0; j < 50; j++) { var m = Math.sqrt(a * b); if (ok(m)) a = m; else b = m; }
        return Math.sqrt(a * b);
      }
      prev = f;
    }
    return null;
  }
  function dipoleBands(bmm, Z0, s) {   // Z0 = 0 means matched to R0
    var L0 = resLength(bmm), R0 = zAt(F0, L0, bmm).R, z0 = Z0 || R0, D00 = pattern(L0).D0;
    var okZ = function (f) { return vswr(zAt(f, L0, bmm), z0) <= s; };
    var okP = function (f) { return Math.abs(10 * Math.log10(pattern(L0 * f / F0).D0 / D00)) <= 1; };
    var Q = Qof(L0, bmm);
    return { L0: L0, R0: R0, Z0: z0, Q: Q, pred: fbw(Q, s), D00: D00,
      zlo: edge(okZ, FMIN), zhi: edge(okZ, FMAX), plo: edge(okP, FMIN), phi: edge(okP, FMAX), lobes: F0 / L0 };
  }

  function chuQ(kr) { return (1 + 2 * kr * kr) / (Math.pow(kr, 3) * (1 + kr * kr)); }   // Balanis (11-35)
  function smallDipoleQ(kr, ratio) {   // |X| / R from Balanis (11-37); l = 2r, so pi l / lambda = kr; ratio = l / 2a
    var x = kr, R = 20 * x * x, X = 120 * (Math.log(ratio) - 1) / Math.tan(x);   // 20 pi^2 (l/lambda)^2 = 20 x^2
    return X / R;
  }

  var api = { F0: F0, FMIN: FMIN, FMAX: FMAX, resLength: resLength, zAt: zAt, vswr: vswr, Qof: Qof, fbw: fbw,
    pattern: pattern, dipoleBands: dipoleBands, chuQ: chuQ, smallDipoleQ: smallDipoleQ };
  if (node) { module.exports = api; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  var BANDS = [[2.4, 2.4835, 'Wi-Fi 2.4'], [5.15, 5.35, 'Wi-Fi 5'], [5.47, 5.85, '']];   // 47 CFR 15.247, 15.407
  function pct(v) { return (100 * v).toFixed(1) + '%'; }
  function ghz(v) { return v.toFixed(2) + ' GHz'; }
  function band(lo, hi) {
    if (lo == null || hi == null) return null;
    return { w: (hi - lo) / ((hi + lo) / 2), r: hi / lo };
  }

  function init(root) {
    var d = root.dataset, kind = d.case || 'dipole';
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    if (kind === 'small') return small(root, controls, stage, d);

    var st = { b: +(d.radius || 0.5), Z0: +(d.z0 || 50), s: +(d.vswr || 2), f: +(d.f || F0) }, paint = [];
    RA.slider(controls, { label: 'Wire radius', min: 0, max: 1, step: 'any', value: Math.log(st.b / 0.05) / Math.log(20),
      fmt: function (v) { return (0.05 * Math.pow(20, v)).toFixed(2) + ' mm'; }, onInput: function (v) { st.b = 0.05 * Math.pow(20, v); full(); } });
    paint.push(RA.toggle(controls, 'Line', [[50, '50 Ω'], [75, '75 Ω'], [0, 'Matched']], function () { return st.Z0; }, function (v) { st.Z0 = v; full(); }));
    RA.slider(controls, { label: 'VSWR limit', min: 1.5, max: 3, step: 0.1, value: st.s, fmt: function (v) { return v.toFixed(1); }, onInput: function (v) { st.s = v; full(); } });
    RA.slider(controls, { label: 'Frequency', min: 0, max: 1, step: 'any', value: Math.log(st.f / FMIN) / Math.log(FMAX / FMIN),
      fmt: function (v) { return (FMIN * Math.pow(FMAX / FMIN, v)).toFixed(2) + ' GHz'; }, onInput: function (v) { st.f = FMIN * Math.pow(FMAX / FMIN, v); cursor(); } });

    var A = RA.plotBox(stage, 'Impedance: VSWR against frequency'), aL = svg('g', {}, A.S), aC = svg('g', {}, A.S);
    var B = RA.plotBox(stage, 'Pattern: directivity against frequency'), bL = svg('g', {}, B.S), bC = svg('g', {}, B.S);
    var pbox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, pbox, 'Pattern in the plane of the wire');
    var PS = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.75', role: 'img' }, pbox), Ptitle = svg('title', {}, PS), pL = svg('g', {}, PS);
    var rbox = RA.el('div', {}, stage);
    var rows = RA.readout(rbox, [['len', 'Cut for 2.45 GHz: length, <i>R</i><sub>0</sub>'], ['zin', 'At this frequency: <i>L</i>/λ, <i>Z</i><sub>in</sub>'],
      ['vs', 'VSWR'], ['dp', '<i>D</i><sub>0</sub>, HPBW'], ['zb', 'Impedance band'], ['q', '<i>Q</i>, (<i>s</i> − 1)/(<i>Q</i>√<i>s</i>)'], ['pb', 'Pattern band (<i>D</i><sub>0</sub> ± 1 dB)']]);
    var xt = [1.2, 1.5, 2, 3, 4, 5, 6], c = null, FA, FB, Dcurve = {};

    function shade(L, F, lo, hi, yr) {
      var x1 = F.X(lo == null ? FMIN : lo), x2 = F.X(hi == null ? FMAX : hi);
      svg('rect', { x: x1, y: F.Y(yr[1]), width: x2 - x1, height: F.Y(yr[0]) - F.Y(yr[1]), fill: 'var(--accent)', 'fill-opacity': 0.13 }, L);
    }
    function full() {
      paint.forEach(function (p) { p(); });
      c = dipoleBands(st.b, st.Z0, st.s);
      var key = c.L0.toFixed(5);
      if (!Dcurve[key]) {
        var pts = [];
        for (var i = 0; i <= 160; i++) { var f = FMIN * Math.pow(FMAX / FMIN, i / 160); pts.push([f, 10 * Math.log10(pattern(c.L0 * f / F0).D0)]); }
        Dcurve = {}; Dcurve[key] = pts;
      }
      // VSWR
      aL.textContent = '';
      var yA = [1, 10];
      FA = RA.frame(aL, [FMIN, FMAX], yA, xt, [1, 1.5, 2, 3, 5, 10], 'frequency (GHz, log scale)', 'VSWR', String, String, true, true);
      BANDS.forEach(function (b) {
        svg('rect', { x: FA.X(b[0]), y: FA.Y(10), width: FA.X(b[1]) - FA.X(b[0]), height: FA.Y(1) - FA.Y(10), fill: 'var(--art-turmeric)', 'fill-opacity': 0.28 }, aL);
        if (b[2]) svg('text', { x: FA.X(b[0]) - 2, y: FA.Y(1) - 4, 'font-size': 8.5, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.75 }, aL).textContent = b[2];
      });
      shade(aL, FA, c.zlo, c.zhi, yA);
      svg('line', { x1: FA.X(FMIN), x2: FA.X(FMAX), y1: FA.Y(st.s), y2: FA.Y(st.s), stroke: 'currentColor', 'stroke-dasharray': '4 3' }, aL);
      // the curve in pieces, broken where VSWR leaves the plot (above 10)
      var seg = [], segs = [seg];
      for (var i = 0; i <= 400; i++) {
        var f = FMIN * Math.pow(FMAX / FMIN, i / 400), v = vswr(zAt(f, c.L0, st.b), c.Z0);
        if (v <= 10) seg.push([f, v]); else if (seg.length) { seg.push([f, 10]); segs.push(seg = []); }
        else if (i < 400) { var vn = vswr(zAt(FMIN * Math.pow(FMAX / FMIN, (i + 1) / 400), c.L0, st.b), c.Z0); if (vn <= 10) seg.push([f, 10]); }
      }
      segs.forEach(function (q) { if (q.length > 1) svg('path', { d: RA.path(q, FA), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.8 }, aL); });
      // directivity
      bL.textContent = '';
      var yB = [1, 6];
      FB = RA.frame(bL, [FMIN, FMAX], yB, xt, [1, 2, 3, 4, 5, 6], 'frequency (GHz, log scale)', 'dBi', String, String, true, false);
      shade(bL, FB, c.plo, c.phi, yB);
      var D0dB = 10 * Math.log10(c.D00);
      [D0dB - 1, D0dB + 1].forEach(function (y) { svg('line', { x1: FB.X(FMIN), x2: FB.X(FMAX), y1: FB.Y(y), y2: FB.Y(y), stroke: 'currentColor', 'stroke-dasharray': '4 3' }, bL); });
      svg('line', { x1: FB.X(c.lobes), x2: FB.X(c.lobes), y1: FB.Y(6), y2: FB.Y(1), stroke: 'var(--ra-warm)', 'stroke-dasharray': '2 2' }, bL);
      svg('text', { x: FB.X(c.lobes) - 3, y: FB.Y(6) + 9, 'font-size': 8.5, 'text-anchor': 'end', fill: 'var(--ra-warm)' }, bL).textContent = 'side lobes beyond';
      svg('path', { d: RA.path(Dcurve[key], FB), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.8 }, bL);

      var zb = band(c.zlo, c.zhi), pb = band(c.plo, c.phi);
      rows.len.td.textContent = (c.L0 * E.LAMBDA * 1000).toFixed(1) + ' mm (' + c.L0.toFixed(3) + ' λ), ' + c.R0.toFixed(1) + ' Ω';
      rows.zb.td.textContent = zb ? ghz(c.zlo) + ' to ' + ghz(c.zhi) + ', ' + pct(zb.w) : 'wider than the plot';
      rows.q.td.textContent = c.Q.toFixed(2) + ', ' + pct(c.pred) + ' if matched';
      rows.pb.td.textContent = (c.plo == null ? 'below 1.2' : c.plo.toFixed(2)) + ' to ' + (c.phi == null ? 'above 6' : c.phi.toFixed(2)) + ' GHz' +
        (c.plo == null ? ', more than ' + (c.phi / FMIN).toFixed(1) + ':1' : ', ' + pb.r.toFixed(1) + ':1');
      A.title.textContent = 'VSWR against frequency on ' + (st.Z0 ? st.Z0 + ' ohm' : 'a matched ' + c.R0.toFixed(0) + ' ohm line') + ': under ' + st.s.toFixed(1) +
        (zb ? ' from ' + ghz(c.zlo) + ' to ' + ghz(c.zhi) + ' (' + pct(zb.w) + ')' : '') + '. The Wi-Fi 2.4 and 5 GHz bands are shaded.';
      B.title.textContent = 'Directivity against frequency: within 1 dB of ' + D0dB.toFixed(2) + ' dBi' + (c.plo == null ? ' from below 1.2 GHz' : ' from ' + ghz(c.plo)) +
        ' to ' + (c.phi == null ? 'above 6 GHz' : ghz(c.phi)) + '; side lobes appear above ' + ghz(c.lobes) + '.';
      cursor();
    }
    function cursor() {
      [[aC, FA, 10], [bC, FB, 6]].forEach(function (q) {
        q[0].textContent = '';
        svg('line', { x1: q[1].X(st.f), x2: q[1].X(st.f), y1: q[1].Y(q[2]), y2: q[1].Y(1), stroke: 'currentColor', 'stroke-width': 1.2 }, q[0]);
      });
      var L = c.L0 * st.f / F0, z = zAt(st.f, c.L0, st.b), v = vswr(z, c.Z0), p = pattern(L), p0 = pattern(c.L0);
      svg('circle', { cx: FA.X(st.f), cy: FA.clampY(FA.Y(Math.min(10, v))), r: 3, fill: 'currentColor' }, aC);
      svg('circle', { cx: FB.X(st.f), cy: FB.Y(10 * Math.log10(p.D0)), r: 3, fill: 'currentColor' }, bC);
      pL.textContent = '';
      var top = 3.5, R = function (x) { return x / top; };
      RA.polarGrid(pL, [1, 2, 3].map(function (r) { return { r: R(r), label: r === 3 ? 'D = 3' : String(r) }; }), function (a) { return (a <= 180 ? a : 360 - a) + '°'; });
      var wire = Math.min(0.9, 0.3 + 0.4 * L);
      svg('line', { x1: 0, y1: -wire / 2, x2: 0, y2: wire / 2, stroke: 'currentColor', 'stroke-width': 0.03, 'stroke-linecap': 'round' }, pL);
      [[p0, { stroke: 'currentColor', 'stroke-dasharray': '0.05 0.03', 'stroke-width': 0.014 }], [p, { stroke: 'var(--accent)', 'stroke-width': 0.024 }]].forEach(function (q) {
        var pts = [];
        for (var i = 0; i <= 360; i++) {
          var a = i * PI / 180, t = a <= PI ? a : 2 * PI - a, rr = R(q[0].D(t));
          pts.push((i ? 'L' : 'M') + (rr * Math.sin(a)).toFixed(4) + ' ' + (-rr * Math.cos(a)).toFixed(4));
        }
        svg('path', Object.assign({ d: pts.join(''), fill: 'none' }, q[1]), pL);
      });
      [[{ stroke: 'currentColor', 'stroke-dasharray': '0.05 0.03', 'stroke-width': 0.014 }, 'design, 2.45 GHz'], [{ stroke: 'var(--accent)', 'stroke-width': 0.024 }, 'at ' + st.f.toFixed(2) + ' GHz']].forEach(function (it, i) {
        var x = -1.2 + 1.25 * i;
        svg('line', Object.assign({ x1: x, x2: x + 0.14, y1: 1.33, y2: 1.33 }, it[0]), pL);
        svg('text', { x: x + 0.18, y: 1.355, 'font-size': 0.07, fill: 'currentColor' }, pL).textContent = it[1];
      });
      Ptitle.textContent = 'Directivity pattern, linear, of the ' + (c.L0 * E.LAMBDA * 1000).toFixed(1) + ' mm dipole at ' + st.f.toFixed(2) + ' GHz (L = ' + L.toFixed(3) +
        ' wavelengths): D0 ' + p.D0.toFixed(2) + ', HPBW ' + p.hpbw.toFixed(1) + ' degrees; dashed at 2.45 GHz.';
      rows.zin.td.textContent = L.toFixed(3) + ' λ, ' + (v > 1000 ? 'very large' : z.R.toFixed(1) + (z.X < 0 ? ' − j' : ' + j') + Math.abs(z.X).toFixed(1) + ' Ω');
      rows.vs.td.textContent = v > 100 ? 'over 100' : v.toFixed(2);
      rows.dp.td.textContent = (10 * Math.log10(p.D0)).toFixed(2) + ' dBi, ' + p.hpbw.toFixed(1) + '°';
    }
    full();
  }

  // Q and VSWR-2 bandwidth against electrical size kr
  function small(root, controls, stage, d) {
    var st = { kr: +(d.kr || 0.31416), ratio: +(d.ratio || 50), e: +(d.ecd || 0.1) }, s = 2, KR = [0.1, 0.6];
    function lin(lo, hi, v) { return Math.log(v / lo) / Math.log(hi / lo); }
    function exp(lo, hi, v) { return lo * Math.pow(hi / lo, v); }
    RA.slider(controls, { label: 'Size <i>kr</i>', min: 0, max: 1, step: 'any', value: lin(KR[0], KR[1], st.kr), fmt: function (v) { return exp(KR[0], KR[1], v).toFixed(3); },
      onInput: function (v) { st.kr = exp(KR[0], KR[1], v); update(); } });
    RA.slider(controls, { label: 'Wire <i>l</i>/2<i>a</i>', min: 0, max: 1, step: 'any', value: lin(10, 1000, st.ratio), fmt: function (v) { return String(Math.round(exp(10, 1000, v))); },
      onInput: function (v) { st.ratio = exp(10, 1000, v); update(); } });
    RA.slider(controls, { label: 'Radiation efficiency', min: 0, max: 1, step: 'any', value: lin(0.02, 1, st.e), fmt: function (v) { return sig(100 * exp(0.02, 1, v), 2) + '%'; },
      onInput: function (v) { st.e = exp(0.02, 1, v); update(); } });
    var P = RA.plotBox(stage, 'VSWR ≤ 2 bandwidth against size'), L = svg('g', {}, P.S);
    var rbox = RA.el('div', {}, stage);
    var rows = RA.readout(rbox, [['size', 'Dipole length <i>l</i> = 2<i>r</i> (at 2.45 GHz)'], ['chu', 'Chu limit: <i>Q</i>, band'], ['dip', 'Thin dipole: <i>Q</i>, band'],
      ['loss', 'Lossy dipole: <i>Q</i>, band'], ['cost', 'Gain given up']]);
    var sty = { chu: { stroke: 'currentColor', 'stroke-width': 1.6 }, dip: { stroke: 'var(--accent)', 'stroke-width': 1.8 }, loss: { stroke: 'var(--ra-warm)', 'stroke-width': 1.6, 'stroke-dasharray': '5 3' } };
    function update() {
      L.textContent = '';
      var yr = [1e-5, 1], F = RA.frame(L, KR, yr, [0.1, 0.2, 0.3, 0.4, 0.6], [1e-5, 1e-4, 0.001, 0.01, 0.1, 1], 'kr (log scale)', 'band',
        String, function (y) { return sig(100 * y, 1) + '%'; }, true, true);
      var chu = [], dip = [], loss = [], top = [];
      for (var i = 0; i <= 120; i++) {
        var kr = exp(KR[0], KR[1], i / 120), qc = chuQ(kr), qd = smallDipoleQ(kr, st.ratio);
        chu.push([kr, fbw(qc, s)]); dip.push([kr, fbw(qd, s)]); loss.push([kr, fbw(st.e * qd, s)]);
      }
      top = chu.concat([[KR[1], 1], [KR[0], 1]]);
      svg('path', { d: RA.path(top, F) + 'Z', fill: 'currentColor', 'fill-opacity': 0.08 }, L);
      svg('text', { x: F.X(0.13), y: F.Y(0.4), 'font-size': 9, fill: 'currentColor', 'fill-opacity': 0.75 }, L).textContent = 'out of reach without loss';
      [['chu', chu], ['dip', dip], ['loss', loss]].forEach(function (q) { svg('path', Object.assign({ d: RA.path(q[1], F), fill: 'none' }, sty[q[0]]), L); });
      svg('line', { x1: F.X(st.kr), x2: F.X(st.kr), y1: F.Y(1), y2: F.Y(1e-5), stroke: 'currentColor', 'stroke-opacity': 0.6 }, L);
      RA.legend(L, 180, 150, [[sty.chu, 'Chu limit (11-35)'], [sty.dip, 'thin dipole, |X|/R (11-37)'], [sty.loss, 'same dipole, lossy']]);
      var qc = chuQ(st.kr), qd = smallDipoleQ(st.kr, st.ratio), ql = st.e * qd, l = st.kr / PI;
      function bw(q) { var w = fbw(q, s); return w * 100 < 1 ? (100 * w).toFixed(2) + '%' : (100 * w).toFixed(1) + '%'; }
      rows.size.td.textContent = l.toFixed(3) + ' λ = ' + (l * E.LAMBDA * 1000).toFixed(1) + ' mm';
      rows.chu.td.textContent = sig(qc, 3) + ', ' + bw(qc);
      rows.dip.td.textContent = sig(qd, 3) + ', ' + bw(qd);
      rows.loss.td.textContent = sig(ql, 3) + ', ' + bw(ql);
      rows.cost.td.textContent = (-10 * Math.log10(st.e)).toFixed(1) + ' dB';
      P.title.textContent = 'VSWR 2 bandwidth against kr on log scales. At kr ' + st.kr.toFixed(3) + ' the Chu limit allows ' + bw(qc) + ', the thin dipole gets ' + bw(qd) +
        ', and the same dipole at ' + sig(100 * st.e, 2) + '% efficiency gets ' + bw(ql) + '.';
    }
    update();
  }

  document.querySelectorAll('[data-widget="bandwidth"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
