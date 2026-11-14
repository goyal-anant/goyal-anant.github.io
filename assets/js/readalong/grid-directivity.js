// grid-directivity: maximum directivity from a sum of rectangles, as in Balanis eqs. (2-38) to (2-43), against the
// exact value. Every pattern here is symmetric in phi, so only the theta sum matters (the phi sum is exact).
//   sin1   U = sin(theta), whose integrand sin^2(theta) is a full period: the sum is exact for any N >= 2
//   short  U = sin^2(theta), short dipole, D0 = 1.5
//   half   half-wave dipole, U = [cos((pi/2) cos theta) / sin theta]^2
//   cosn   U = cos^n(theta) on the upper hemisphere, D0 = 2(n + 1)
//   dish   NEXRAD dish model, parabolic taper, d / lambda = 81.19 (from beam-solid-angle)
// Two rules over N steps of h = pi / N: trailing edge theta_i = i h (2-38b) and midpoint theta_i = (i - 1/2) h (2-38c).
// Panel 1 draws U sin(theta) and the rectangles the sum adds; panel 2 the error against step / HPBW.
// Markup from _includes/readalong/grid-directivity.html; helpers from readalong.js (window.RA). The maths at the top
// has no DOM and is also run under node by content/balanis/checks/grid_directivity.py.
(function () {
  var PI = Math.PI, DEG = PI / 180;
  var B = typeof module !== 'undefined' ? require('./beam-solid-angle.js') : window.BeamSolidAngle;

  function halfWave(th) {
    var s = Math.sin(th);
    if (Math.abs(s) < 1e-9) return 0;
    var f = Math.cos(PI / 2 * Math.cos(th)) / s;
    return f * f;
  }
  // Simpson's rule for 2 pi times the integral of U sin(theta) over [0, pi]
  function power(cut) {
    var N = 4000, h = PI / N, s = 0;
    for (var i = 0; i <= N; i++) {
      var t = i * h, w = i === 0 || i === N ? 1 : i % 2 ? 4 : 2;
      s += w * cut(t) * Math.sin(t);
    }
    return 2 * PI * s * h / 3;
  }
  // A pattern: cut(theta) over [0, pi] with peak 1, the exact D0 and the HPBW in degrees
  var cache = {};
  function pattern(kind, n) {
    var key = kind + (kind === 'cosn' ? n : '');
    if (cache[key]) return cache[key];
    var P;
    if (kind === 'sin1') P = { cut: Math.sin, D0: 4 / PI, hpbw: 120 };
    else if (kind === 'short') P = { cut: function (t) { var s = Math.sin(t); return s * s; }, D0: 1.5, hpbw: 90 };
    else if (kind === 'half') {
      P = { cut: halfWave };
      P.D0 = 4 * PI / power(halfWave);
      P.hpbw = 180 - 2 * B.bisect(function (t) { return halfWave(t) - 0.5; }, 0.1, PI / 2) / DEG;
    } else {
      var Q = kind === 'dish' ? B.pattern('dish', 0, 1, B.NEXRAD) : B.pattern('cosn', n), r = B.directivity(Q);
      P = { cut: Q.cut, D0: r.D0, hpbw: r.hpbwDeg };
    }
    P.kind = kind;
    return (cache[key] = P);
  }
  // The book's sum with N steps. rule: 'trail' or 'mid'; sampled: take U_max from the samples instead of the true 1.
  function numeric(P, N, rule, sampled) {
    var h = PI / N, off = rule === 'mid' ? 0.5 : 0, s = 0, um = 0;
    for (var i = 1; i <= N; i++) {
      var t = (i - off) * h, u = P.cut(t);
      s += u * Math.sin(t);
      if (u > um) um = u;
    }
    var Prad = 2 * PI * h * s, D = 4 * PI * (sampled ? um : 1) / Prad;
    return { N: N, step: 180 / N, D: D, err: D / P.D0 - 1, umax: sampled ? um : 1 };
  }
  function stepsFor(step) { return Math.max(2, Math.round(180 / step)); }
  // |error| against step / HPBW for both rules, steps from 0.05 to 90 degrees
  var curves = {};
  function errorCurves(P, sampled) {
    var key = P.kind + P.D0 + sampled;
    if (curves[key]) return curves[key];
    var out = { trail: [], mid: [] }, last = 0;
    for (var k = 0; k <= 80; k++) {
      var N = stepsFor(0.05 * Math.pow(1800, k / 80));
      if (N === last) continue;
      last = N;
      ['trail', 'mid'].forEach(function (rule) {
        out[rule].push([180 / N / P.hpbw, Math.abs(numeric(P, N, rule, sampled).err)]);
      });
    }
    return (curves[key] = out);
  }

  var api = { pattern: pattern, numeric: numeric, stepsFor: stepsFor, errorCurves: errorCurves };
  if (typeof module !== 'undefined') { module.exports = api; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg, sig = RA.sig, signed = RA.signed;
  function dB(v) { return 10 * Math.log10(v); }
  var KINDS = [['sin1', 'sin θ'], ['short', 'Short dipole'], ['half', 'Half-wave dipole'], ['cosn', 'cosⁿθ'], ['dish', 'NEXRAD dish']];
  var RULES = [['trail', 'Trailing edge'], ['mid', 'Midpoint']];
  var STYLE = { trail: { stroke: 'var(--accent)', 'stroke-width': 1.8 },
    mid: { stroke: 'var(--ra-warm)', 'stroke-width': 1.8, 'stroke-dasharray': '5 3' } };
  // grid steps on the slider, each a whole number of steps in 180 degrees
  var STEPS = [0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 9, 10, 12, 15, 18, 20, 30, 45, 60, 90];
  var FLOOR = 1e-8, TOP = 1e3;   // relative error shown between 1e-6 % and 1e5 %
  var SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function pow10(e) { return e === 0 ? '1' : e === 1 ? '10' : '10' + String(e).split('').map(function (c) { return SUP[c]; }).join(''); }

  function init(root) {
    var d = root.dataset, kind = d.pattern || 'sin1', n = +(d.n || 10), rule = d.rule === 'mid' ? 'mid' : 'trail';
    var N = stepsFor(+(d.step || 10)), sampled = false;
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var paintK = RA.toggle(controls, 'Pattern', KINDS, function () { return kind; }, function (v) { kind = v; update(); });
    var nBox = RA.el('div', { class: 'ra-controls' }, controls);
    nBox.style.margin = '0';
    RA.slider(nBox, { label: '<i>n</i>', min: 0, max: 1, step: 'any', value: Math.log(n) / Math.log(450),
      fmt: function (s) { return sig(Math.pow(450, s), 3); }, onInput: function (s) { n = Math.pow(450, s); update(); } });
    var paintR = RA.toggle(controls, 'Rule', RULES, function () { return rule; }, function (v) { rule = v; update(); });
    var i0 = 0;
    STEPS.forEach(function (s, i) { if (Math.abs(Math.log(s * N / 180)) < Math.abs(Math.log(STEPS[i0] * N / 180))) i0 = i; });
    N = stepsFor(STEPS[i0]);
    RA.slider(controls, { label: 'Step', min: 0, max: STEPS.length - 1, step: 1, value: i0,
      fmt: function (i) { return STEPS[i] + '°'; }, onInput: function (i) { N = stepsFor(STEPS[i]); update(); } });
    var lab = RA.el('label', { class: 'ra-check' }, controls), box = RA.el('input', { type: 'checkbox' }, lab);
    RA.el('span', {}, lab, ' Read Umax off the samples');
    box.addEventListener('change', function () { sampled = box.checked; update(); });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var A = RA.plotBox(stage, 'What the sum adds up: U sin θ');
    var aLayer = svg('g', {}, A.S);
    var E = RA.plotBox(stage, 'Error against step / HPBW');
    var eLayer = svg('g', {}, E.S);
    var rows = RA.readout(root, [['grid', 'Grid'], ['hp', 'Steps across the HPBW'], ['ex', 'Exact <i>D</i><sub>0</sub>'],
      ['nu', 'Sum <i>D</i><sub>0</sub>'], ['er', 'Error'], ['um', '<i>U</i><sub>max</sub> used']]);

    function update() {
      paintK(); paintR();
      nBox.style.display = kind === 'cosn' ? '' : 'none';
      var P = pattern(kind, n), r = numeric(P, N, rule, sampled), h = PI / N;

      // panel 1: U sin(theta) and the rectangles
      aLayer.textContent = '';
      var full = kind === 'sin1' || kind === 'short' || kind === 'half';
      var xmax = full ? 180 : Math.min(180, Math.max(3 * P.hpbw, 4 * r.step));
      var xs = RA.niceStep(xmax, 4), xt = [];
      for (var x = 0; x <= xmax + 1e-9; x += xs) xt.push(x);
      var curve = [], gmax = 0;
      for (var j = 0; j <= 800; j++) {
        var t = xmax * DEG * j / 800, g = P.cut(t) * Math.sin(t);
        curve.push([t / DEG, g]);
        if (g > gmax) gmax = g;
      }
      curve.forEach(function (q) { q[1] /= gmax; });
      var F = RA.frame(aLayer, [0, xmax], [0, 1.15], xt, [0, 0.5, 1], 'θ (degrees)', 'U sin θ, scaled',
        function (v) { return String(+v.toPrecision(3)); }, function (v) { return v; });
      var off = rule === 'mid' ? 0.5 : 0, rect = '', dots = [], count = 0;
      for (var i = 1; i <= N; i++) {
        var tc = (i - off) * h, a = rule === 'mid' ? tc - h / 2 : tc - h, b = a + h;
        if (a / DEG >= xmax) break;
        var y = P.cut(tc) * Math.sin(tc) / gmax, x0 = F.X(a / DEG), x1 = F.clampX(F.X(b / DEG)), yy = F.clampY(F.Y(y));
        rect += 'M' + x0.toFixed(2) + ' ' + F.Y(0) + 'L' + x0.toFixed(2) + ' ' + yy.toFixed(2) + 'L' + x1.toFixed(2) + ' ' + yy.toFixed(2) + 'L' + x1.toFixed(2) + ' ' + F.Y(0);
        dots.push([F.X(tc / DEG), yy]); count++;
      }
      svg('path', { d: rect, fill: 'var(--ra-warm)', 'fill-opacity': 0.15, stroke: 'var(--ra-warm)', 'stroke-width': count > 120 ? 0 : 0.8 }, aLayer);
      svg('path', { d: RA.path(curve, F), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }, aLayer);
      if (count <= 60) dots.forEach(function (q) { if (q[0] <= 310) svg('circle', { cx: q[0], cy: q[1], r: 2.2, fill: 'var(--ra-warm)' }, aLayer); });
      RA.legend(aLayer, 236, 36, [[{ stroke: 'var(--accent)', 'stroke-width': 3 }, 'exact'], [{ stroke: 'var(--ra-warm)', 'stroke-width': 3 }, 'rectangles']]);
      A.title.textContent = 'U times sin theta for the ' + KINDS.filter(function (k) { return k[0] === kind; })[0][1] +
        ' pattern from 0 to ' + sig(xmax, 3) + ' degrees, with the ' + (rule === 'mid' ? 'midpoint' : 'trailing-edge') +
        ' rectangles of a ' + sig(r.step, 3) + ' degree grid.';

      // panel 2: |error| against step / HPBW, log-log
      eLayer.textContent = '';
      var cv = errorCurves(P, sampled), xr = [3e-4, 120];
      var G = RA.frame(eLayer, xr, [FLOOR * 100, TOP * 100], [1e-3, 1e-2, 0.1, 1, 10, 100], [1e-6, 1e-4, 1e-2, 1, 100, 1e4],
        'step / HPBW (log scale)', '|error| %', function (v) { return v >= 1 ? String(v) : String(+v.toPrecision(1)); },
        function (v) { return pow10(Math.round(Math.log10(v))); }, true, true);
      var clampE = function (e) { return 100 * Math.min(TOP, Math.max(FLOOR, e)); };
      // slope guides, error proportional to step^2 and step^4
      [[2, 'step²'], [4, 'step⁴']].forEach(function (s, k) {
        var x0 = 1.5e-3, x1 = 1.5e-2, y0 = 1e-5, y1 = y0 * Math.pow(10, s[0]);
        svg('line', { x1: G.X(x0), y1: G.Y(y0), x2: G.X(x1), y2: G.Y(y1), stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-dasharray': '2 2' }, eLayer);
        svg('text', { x: G.X(x1) + 3, y: G.Y(y1) + (k ? 8 : 3), 'font-size': 9, fill: 'currentColor', 'fill-opacity': 0.6 }, eLayer).textContent = s[1];
      });
      ['trail', 'mid'].forEach(function (rl) {
        var pts = cv[rl].map(function (q) { return [q[0], clampE(q[1])]; });
        svg('path', Object.assign({ d: RA.path(pts, G), fill: 'none' }, STYLE[rl]), eLayer);
      });
      svg('circle', { cx: G.clampX(G.X(r.step / P.hpbw)), cy: G.clampY(G.Y(clampE(Math.abs(r.err)))), r: 4,
        fill: rule === 'mid' ? 'var(--ra-warm)' : 'var(--accent)', stroke: 'var(--bg, white)', 'stroke-width': 1 }, eLayer);
      RA.legend(eLayer, 60, 12, [[STYLE.trail, 'trailing edge']]); RA.legend(eLayer, 160, 12, [[STYLE.mid, 'midpoint']]);
      E.title.textContent = 'Size of the error in percent against the grid step divided by the half-power beamwidth, both on log scales, ' +
        'for the trailing-edge and midpoint rules. This grid: ' + signed(100 * r.err, 3) + ' percent.';

      rows.grid.td.textContent = 'N = ' + N + ' steps of ' + sig(r.step, 3) + '°';
      rows.hp.td.textContent = 'HPBW ' + sig(P.hpbw, 3) + '°, ' + sig(P.hpbw / r.step, 3) + ' steps';
      rows.ex.td.textContent = sig(P.D0, 5) + ' = ' + dB(P.D0).toFixed(2) + ' dBi';
      rows.nu.td.textContent = sig(r.D, 5) + ' = ' + dB(r.D).toFixed(2) + ' dBi';
      rows.er.td.textContent = Math.abs(r.err) < 5e-11 ? 'exact (to rounding)' :
        (Math.abs(r.err) < 1e-4 ? signed(100 * r.err, 6) : Math.abs(r.err) >= 10 ? (r.err > 0 ? '+' : '−') + sig(100 * Math.abs(r.err), 3) : signed(100 * r.err, Math.abs(r.err) < 0.01 ? 3 : 1)) + '%, ' + signed(dB(r.D / P.D0), 2) + ' dB';
      rows.um.td.textContent = sampled ? sig(r.umax, 4) + ' (largest sample)' : '1 (true peak)';
    }
    update();
  }

  document.querySelectorAll('[data-widget="grid-directivity"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
