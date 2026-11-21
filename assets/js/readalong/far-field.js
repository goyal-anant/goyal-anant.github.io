// far-field: when the far-field formulas of Balanis §3.6 (eqs. 3-56 to 3-59b) hold, and what they say.
// case=distance: a centre-fed wire of length L with the sinusoidal current of Balanis eq. (4-56). Its exact fields
// (closed form, the same as Balanis's Ch. 8 near-field expressions) against the far field (4-58a) at distance r:
// the error of the |E| pattern, the radial field E_r, the phase of E_theta and the wave impedance, against r, with
// the two walls kr = 1 and 2D^2/lambda. case=shadow: the far E is -j omega times the shadow of A on the sphere
// (its radial part dropped), H = a_r x E / eta; for a loop (F along z) the roles swap (eq. 3-59).
// Units: lengths in wavelengths, k = 2 pi, eta = 1, I0 = 1, fields in units of eta I0 / 4 pi.
// Markup from _includes/readalong/far-field.html; helpers from readalong.js (window.RA).
// The maths at the top has no DOM and is also run under node by content/balanis/checks/far_field.py.
(function () {
  var PI = Math.PI, TAU = 2 * PI, node = typeof module !== 'undefined';
  var LAMBDA_CM = 29979245800 / 2.45e9;   // free-space wavelength at 2.45 GHz (Wi-Fi), in cm

  // e^{-jkR}/R as [re, im]
  function g(R) { var p = TAU * R; return [Math.cos(p) / R, -Math.sin(p) / R]; }
  // exact fields of the wire at (r, th): [Er, Eth, Hph] as [re, im] pairs, in units of eta I0 / 4 pi (H times eta)
  function exact(L, r, th) {
    var y = r * Math.sin(th), z = r * Math.cos(th), c = Math.cos(PI * L);   // cos(kL/2)
    if (th < 1e-9) {   // on the axis E is along z, so E_r = E_z, and E_theta = H_phi = 0
      var a0 = g(r - L / 2), b0 = g(r + L / 2), o0 = g(r);
      return [[a0[1] + b0[1] - 2 * c * o0[1], -(a0[0] + b0[0] - 2 * c * o0[0])], [0, 0], [0, 0]];
    }
    var R1 = Math.hypot(y, z - L / 2), R2 = Math.hypot(y, z + L / 2);
    var a = g(R1), b = g(R2), o = g(r);
    // Ez = -j [a + b - 2c o];  Ey = (j / y)[(z - L/2) a + (z + L/2) b - 2 z c o];  eta Hphi = (j / y)[R1 a + R2 b - 2 c r o]
    var sz = [a[0] + b[0] - 2 * c * o[0], a[1] + b[1] - 2 * c * o[1]];
    var sy = [(z - L / 2) * a[0] + (z + L / 2) * b[0] - 2 * z * c * o[0], (z - L / 2) * a[1] + (z + L / 2) * b[1] - 2 * z * c * o[1]];
    var sh = [R1 * a[0] + R2 * b[0] - 2 * c * r * o[0], R1 * a[1] + R2 * b[1] - 2 * c * r * o[1]];
    var Ez = [sz[1], -sz[0]], Ey = [-sy[1] / y, sy[0] / y], H = [-sh[1] / y, sh[0] / y];
    var s = Math.sin(th), co = Math.cos(th);
    return [[Ey[0] * s + Ez[0] * co, Ey[1] * s + Ez[1] * co], [Ey[0] * co - Ez[0] * s, Ey[1] * co - Ez[1] * s], H];
  }
  // far field E_theta (Balanis 4-58a shape) in the same units: 2 j e^{-jkr}/r f(th)
  function shape(L, th) { if (th < 1e-9) return 0; return (Math.cos(PI * L * Math.cos(th)) - Math.cos(PI * L)) / Math.sin(th); }
  function far(L, r, th) { var o = g(r), f = 2 * shape(L, th); return [-o[1] * f, o[0] * f]; }
  function abs(p) { return Math.hypot(p[0], p[1]); }
  function div(p, q) { var d = q[0] * q[0] + q[1] * q[1]; return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; }

  var NTH = 181;   // angles 0 to 90 degrees in steps of 0.5 (the wire is symmetric about 90)
  function angles() { var a = []; for (var i = 0; i < NTH; i++) a.push(PI / 2 * i / (NTH - 1)); return a; }
  var TH = angles();
  // where the far pattern peaks
  function peakAngle(L) { var best = TH[NTH - 1], v = 0; TH.forEach(function (t) { var f = Math.abs(shape(L, t)); if (f > v + 1e-12) { v = f; best = t; } }); return best; }
  // errors of the far field at distance r, each in %, phase in degrees
  function errors(L, r) {
    var tp = peakAngle(L), ex = [], fa = [], mE = 0, mF = 0, mR = 0;
    TH.forEach(function (t) {
      var e = exact(L, r, t), m = Math.hypot(abs(e[0]), abs(e[1])), f = abs(far(L, r, t));
      ex.push(m); fa.push(f); mE = Math.max(mE, m); mF = Math.max(mF, f); mR = Math.max(mR, abs(e[0]));
    });
    var pat = 0;
    for (var i = 0; i < NTH; i++) pat = Math.max(pat, Math.abs(ex[i] / mE - fa[i] / mF));
    var e = exact(L, r, tp), q = div(e[1], far(L, r, tp));
    return { pattern: 100 * pat, radial: 100 * mR / mF, phase: Math.atan2(q[1], q[0]) * 180 / PI,
      impedance: 100 * Math.abs(abs(e[1]) / abs(e[2]) - 1), peak: tp, ex: ex, fa: fa, mE: mE, mF: mF };
  }
  function rMin(L) { return Math.max(0.05, 0.6 * L); }
  // the distance beyond which the pattern error stays below pct (scan in from 2000 wavelengths)
  function wall(L, pct) {
    var lo = Math.log(rMin(L)), hi = Math.log(2000), n = 240, prev = Math.exp(hi);
    for (var i = n; i >= 0; i--) {
      var r = Math.exp(lo + (hi - lo) * i / n);
      if (errors(L, r).pattern > pct) {   // refine between r and prev by bisection
        var a = r, b = prev;
        for (var j = 0; j < 40; j++) { var m = Math.sqrt(a * b); if (errors(L, m).pattern > pct) a = m; else b = m; }
        return b;
      }
      prev = r;
    }
    return rMin(L);
  }

  // ---- shadow: the far field from a potential along z ---------------------------------------------------------------
  // At direction (th, ph) the potential P = z-hat (A for a wire, F for a loop). Its radial part is cos th, its
  // tangential part (the shadow) -sin th theta-hat. Wire: E = -j w (shadow), H = a_r x E / eta, both along theta / phi.
  // Loop: H = -j w (shadow), E = -eta a_r x H. Returned as real unit-free 3-vectors of the amplitudes (the -j dropped).
  function unit(th, ph) { return [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)]; }
  function thHat(th, ph) { return [Math.cos(th) * Math.cos(ph), Math.cos(th) * Math.sin(ph), -Math.sin(th)]; }
  function phHat(th, ph) { return [-Math.sin(ph), Math.cos(ph), 0]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function scale(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
  function triad(kind, th, ph) {
    var r = unit(th, ph), P = [0, 0, 1], Pr = Math.cos(th), shadow = [P[0] - r[0] * Pr, P[1] - r[1] * Pr, P[2] - r[2] * Pr];
    var E, H;
    if (kind === 'loop') { H = shadow; E = scale(cross(r, H), -1); }
    else { E = shadow; H = cross(r, E); }
    return { r: r, P: P, radial: Pr, shadow: shadow, E: E, H: H };
  }

  var api = { exact: exact, far: far, shape: shape, errors: errors, wall: wall, peakAngle: peakAngle, rMin: rMin,
    triad: triad, unit: unit, thHat: thHat, phHat: phHat, LAMBDA_CM: LAMBDA_CM };
  if (node) { module.exports = api; return; }

  // ---- drawing ---------------------------------------------------------------------------------------------------
  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  function fmtCm(cm) { return cm < 100 ? sig(cm, 3) + ' cm' : sig(cm / 100, 3) + ' m'; }
  function fmtL(r) { return (r < 1 ? r.toFixed(2) : sig(r, 3)) + ' λ'; }

  function init(root) {
    var d = root.dataset;
    root.textContent = '';
    (d.case === 'shadow' ? shadowCase : distanceCase)(root, d);
  }

  // ---- distance ----------------------------------------------------------------------------------------------------
  var R0 = 0.05, R1 = 1000, Y0 = 0.01, Y1 = 100;
  function distanceCase(root, d) {
    var st = { L: +(d.l || 0.5), r: +(d.r || 0.5) };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var lIn = RA.slider(controls, { label: 'Wire length <i>L</i>', min: 0.05, max: 5, step: 0.05, value: st.L,
      fmt: function (v) { return v.toFixed(2) + ' λ'; }, onInput: function (v) { st.L = v; update(); } });
    var rIn = RA.slider(controls, { label: 'Probe at <i>r</i>', min: Math.log10(R0), max: Math.log10(R1), step: 0.01, value: Math.log10(st.r),
      fmt: function (v) { return fmtL(Math.pow(10, v)); }, onInput: function (v) { st.r = Math.pow(10, v); probe(); } });
    var pre = RA.el('div', { class: 'ra-controls' }, root), pbtn = [];
    [['Short, 0.1 λ', 0.1, 1], ['Half-wave', 0.5, 0.5], ['3 λ wire', 3, 18]].forEach(function (p) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, pre, p[0]);
      b.addEventListener('click', function () {
        st.L = p[1]; st.r = p[2];
        lIn.value = p[1]; lIn.nextElementSibling.textContent = p[1].toFixed(2) + ' λ';
        rIn.value = Math.log10(p[2]); rIn.nextElementSibling.textContent = fmtL(p[2]);
        update();
      });
      pbtn.push([p[1], b]);
    });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var A = RA.plotBox(stage, 'Far-field formula against the exact field');
    var xt = [0.1, 1, 10, 100, 1000], yt = [0.01, 0.1, 1, 10, 100];
    var FA = RA.frame(A.S, [R0, R1], [Y0, Y1], xt, yt, 'distance r (wavelengths)', 'error',
      function (x) { return x < 1 ? String(x) : sig(x, 1); }, function (y) { return y < 1 ? String(y) : sig(y, 1); }, true, true);
    var walls = [0, 1].map(function () {
      var gl = svg('g', {}, A.S);
      return { line: svg('line', { y1: 24, y2: 176, stroke: 'currentColor', 'stroke-opacity': 0.45, 'stroke-dasharray': '1 2' }, gl),
        text: svg('text', { y: 19, 'font-size': 8.5, fill: 'currentColor', 'fill-opacity': 0.8 }, gl) };
    });
    var STY = [['radial', { stroke: 'var(--ra-warm)', 'stroke-width': 3.2, 'stroke-opacity': 0.75 }, 'largest E_r, % of peak'],
      ['pattern', { stroke: 'var(--accent)', 'stroke-width': 1.4 }, '|E| pattern, % of peak'],
      ['phase', { stroke: 'currentColor', 'stroke-width': 1.3, 'stroke-dasharray': '4 2' }, 'phase at peak, degrees'],
      ['impedance', { stroke: 'currentColor', 'stroke-opacity': 0.5, 'stroke-width': 1.2, 'stroke-dasharray': '1 2' }, '|E|/η|H| off 1, %']];
    var curves = {};
    STY.forEach(function (s) { curves[s[0]] = svg('path', Object.assign({ fill: 'none' }, s[1]), A.S); });
    var pLine = svg('line', { y1: 24, y2: 176, stroke: 'var(--ra-warm)', 'stroke-width': 1.2, 'stroke-dasharray': '3 2' }, A.S);
    var legend = RA.el('div', { class: 'ra-key' }, root);   // HTML legend: plot is too busy for one inside

    var pBox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    var pCap = RA.el('p', {}, pBox, '');
    var C = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', role: 'img' }, pBox), cTitle = svg('title', {}, C);
    RA.polarGrid(C, [{ r: 0.5 }, { r: 1 }], function (a) { return (a <= 180 ? a : 360 - a) + '°'; }, { up: 'z', right: 'x' });
    var cFar = svg('path', { fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 0.014, 'stroke-dasharray': '0.04 0.03' }, C);
    var cEx = svg('path', { fill: 'var(--accent)', 'fill-opacity': 0.2, stroke: 'var(--accent)', 'stroke-width': 0.016 }, C);
    var cWire = svg('line', { x1: 0, x2: 0, stroke: 'currentColor', 'stroke-width': 0.03 }, C);
    var rows = RA.readout(RA.el('div', {}, root), [['L', 'Wire at 2.45 GHz'], ['walls', '<i>kr</i> = 1 and 2<i>D</i><sup>2</sup>/λ'],
      ['ten', 'Pattern within 10%, 1% beyond'], ['r', 'Probe'], ['err', 'At the probe: pattern, <i>E<sub>r</sub></i>'],
      ['ph', 'At the probe: phase of <i>E<sub>θ</sub></i>, |<i>E</i>|/η|<i>H</i>|']]);
    legend.innerHTML = '<span style="color:var(--accent)">━</span> worst error of the normalised |<i>E</i>| pattern, % of its peak &nbsp; ' +
      '<span style="color:var(--ra-warm);opacity:0.75">▬</span> largest <i>E<sub>r</sub></i>, % of the peak far field &nbsp; ' +
      '<span>╍</span> phase of <i>E<sub>θ</sub></i> at the beam peak, degrees late against <i>e</i><sup>−<i>jkr</i></sup>/<i>r</i> &nbsp; ' +
      '<span style="opacity:0.55">┈</span> |<i>E<sub>θ</sub></i>|/η|<i>H<sub>φ</sub></i>| off 1, %. Dotted verticals: <i>kr</i> = 1 and 2<i>D</i><sup>2</sup>/λ.';

    var data;
    function update() {
      var lo = rMin(st.L), n = 160, pts = { pattern: [], radial: [], phase: [], impedance: [] };
      for (var i = 0; i <= n; i++) {
        var r = Math.exp(Math.log(lo) + (Math.log(R1) - Math.log(lo)) * i / n), e = errors(st.L, r);
        pts.pattern.push([r, e.pattern]); pts.radial.push([r, e.radial]); pts.phase.push([r, Math.abs(e.phase)]); pts.impedance.push([r, e.impedance]);
      }
      STY.forEach(function (s) {
        var dd = '', pen = false;
        pts[s[0]].forEach(function (q) {
          var inside = q[1] >= Y0 && q[1] <= Y1;
          if (inside) dd += (pen ? 'L' : 'M') + FA.X(q[0]).toFixed(2) + ' ' + FA.Y(q[1]).toFixed(2);
          pen = inside;
        });
        curves[s[0]].setAttribute('d', dd);
      });
      var kr1 = 1 / TAU, ff = 2 * st.L * st.L, close = Math.abs(FA.X(ff) - FA.X(kr1)) < 44;
      [[kr1, 'kr = 1'], [ff, '2D²/λ']].forEach(function (w, i) {   // labels above the plot, staggered when close
        var x = FA.X(Math.max(R0, w[0])), show = w[0] >= R0;
        walls[i].line.style.display = walls[i].text.style.display = show ? '' : 'none';
        walls[i].line.setAttribute('x1', x); walls[i].line.setAttribute('x2', x);
        walls[i].text.setAttribute('x', Math.min(296, x)); walls[i].text.setAttribute('text-anchor', 'middle');
        walls[i].text.setAttribute('y', close && i === 1 ? 9 : 19);
        walls[i].text.textContent = w[1];
      });
      var w10 = wall(st.L, 10), w1 = wall(st.L, 1);
      data = { w10: w10, w1: w1 };
      rows.L.td.textContent = fmtCm(st.L * LAMBDA_CM) + ' (' + st.L.toFixed(2) + ' λ)';
      rows.walls.td.textContent = fmtCm(kr1 * LAMBDA_CM) + ', ' + fmtCm(ff * LAMBDA_CM) + ' (' + fmtL(ff) + ')';
      rows.ten.td.textContent = fmtL(w10) + ' (' + fmtCm(w10 * LAMBDA_CM) + '), ' + fmtL(w1) + ' (' + fmtCm(w1 * LAMBDA_CM) + ')';
      var hw = Math.min(0.9, 0.2 + 0.15 * st.L);
      cWire.setAttribute('y1', -hw / 2); cWire.setAttribute('y2', hw / 2);
      A.title.textContent = 'Errors of the far-field formula for a ' + st.L.toFixed(2) + '-wavelength wire against distance: the pattern is within 10% beyond ' +
        sig(w10, 3) + ' wavelengths and within 1% beyond ' + sig(w1, 3) + '.';
      pbtn.forEach(function (q) { q[1].setAttribute('aria-pressed', String(Math.abs(q[0] - st.L) < 1e-9)); });
      probe();
    }
    function probe() {
      if (st.r < rMin(st.L)) { st.r = rMin(st.L); rIn.value = Math.log10(st.r); rIn.nextElementSibling.textContent = fmtL(st.r); }
      var x = FA.X(st.r); pLine.setAttribute('x1', x); pLine.setAttribute('x2', x);
      var e = errors(st.L, st.r);
      function polar(vals, m) {
        // vals over 0..90 degrees; mirror to the full E-plane cut
        var half = TH.map(function (t, i) { return [Math.sin(t) * vals[i] / m, -Math.cos(t) * vals[i] / m]; });
        var lower = half.slice().reverse().map(function (p) { return [p[0], -p[1]]; });
        var right = half.concat(lower), left = right.slice().reverse().map(function (p) { return [-p[0], p[1]]; });
        return right.concat(left).map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(4) + ' ' + p[1].toFixed(4); }).join('') + 'Z';
      }
      cEx.setAttribute('d', polar(e.ex, e.mE)); cFar.setAttribute('d', polar(e.fa, e.mF));
      pCap.textContent = 'Pattern |E| at ' + fmtL(st.r) + ', each per its own peak';
      rows.r.td.textContent = fmtCm(st.r * LAMBDA_CM) + ' (' + fmtL(st.r) + ', kr = ' + sig(TAU * st.r, 3) + ')';
      rows.err.td.textContent = sig(e.pattern, 2) + '%, ' + sig(e.radial, 2) + '% of the peak far field';
      rows.ph.td.textContent = (e.phase < 0 ? sig(-e.phase, 2) + '° late' : sig(e.phase, 2) + '° early') + ', off 1 by ' + sig(e.impedance, 2) + '%';
      cTitle.textContent = 'E-plane pattern at ' + sig(st.r, 3) + ' wavelengths, exact against the far-field formula; worst difference ' + sig(e.pattern, 2) + '% of the peak.';
    }
    update();
  }

  // ---- shadow ------------------------------------------------------------------------------------------------------
  var GRID_TH = [22.5, 45, 67.5, 90, 112.5, 135, 157.5], GRID_PH = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  function shadowCase(root, d) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var st = { kind: d.kind || 'wire', th: +(d.th || 45), ph: +(d.ph || 0), yaw: -0.55, pitch: 0.35, run: false, t: 0, last: null, visible: true };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var thIn = RA.slider(controls, { label: 'Point <i>θ</i>', min: 1, max: 179, step: 1, value: st.th,
      fmt: function (v) { return v + '°'; }, onInput: function (v) { st.th = v; draw(); } });
    var phIn = RA.slider(controls, { label: 'Point <i>φ</i>', min: 0, max: 359, step: 1, value: st.ph,
      fmt: function (v) { return v + '°'; }, onInput: function (v) { st.ph = v; draw(); } });
    var row = RA.el('div', { class: 'ra-controls' }, root);
    var paintKind = RA.toggle(row, 'Source', [['wire', 'Wire: A along z'], ['loop', 'Loop: F along z']], function () { return st.kind; },
      function (k) { st.kind = k; draw(); });
    var play = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, row, 'Play');

    var stage = RA.el('div', { class: 'ra-pattern-stage', style: 'grid-template-columns: 1fr' }, root);
    var box = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, box, 'Far away, on a sphere round the source (drag to turn it)');
    var S = svg('svg', { viewBox: '-1.45 -1.4 2.9 2.8', role: 'img', tabindex: 0, style: 'touch-action: none; cursor: grab; max-width: 440px' }, box);
    var sTitle = svg('title', {}, S);
    var layer = svg('g', {}, S);
    var rows = RA.readout(RA.el('div', {}, root), [['dir', 'Direction'], ['drop', 'Radial part of the potential, dropped'],
      ['E', '|<i>E</i>| there, per the peak'], ['pol', '<i>E</i> and <i>H</i> point along'], ['naive', 'Had the radial part been kept']]);
    var key = RA.el('p', { class: 'ra-key' }, root);

    // orthographic view: yaw about z, then pitch; returns [screen x, screen y (down), depth toward the viewer]
    function view(p) {
      var cy = Math.cos(st.yaw), sy = Math.sin(st.yaw), cb = Math.cos(st.pitch), sb = Math.sin(st.pitch);
      var x1 = p[0] * cy - p[1] * sy, y1 = p[0] * sy + p[1] * cy, z1 = p[2];
      return [x1, -(z1 * cb + y1 * sb), -y1 * cb + z1 * sb];
    }
    function arrow(p, v, len, col, w, op) {
      var a = view(p), b = view([p[0] + v[0] * len, p[1] + v[1] * len, p[2] + v[2] * len]);
      var L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L < 1e-3) return;
      var attrs = { stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' };
      if (op != null) attrs['stroke-opacity'] = op;
      svg('line', Object.assign({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, attrs), layer);
      if (L < 0.03) return;
      var ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, h = Math.min(0.06, 0.4 * L);
      svg('path', Object.assign({ d: 'M' + (b[0] - ux * h - uy * h * 0.5) + ' ' + (b[1] - uy * h + ux * h * 0.5) + 'L' + b[0] + ' ' + b[1] +
        'L' + (b[0] - ux * h + uy * h * 0.5) + ' ' + (b[1] - uy * h - ux * h * 0.5), 'stroke-linejoin': 'round' }, attrs), layer);
    }
    function ring(fn, n, attrs) {   // a curve on the sphere; front half solid, back half faint
      var front = '', back = '', prevF = null;
      for (var i = 0; i <= n; i++) {
        var q = view(fn(i / n)), f = q[2] >= 0, cmd = (prevF === f ? 'L' : 'M') + q[0].toFixed(4) + ' ' + q[1].toFixed(4);
        if (f) { front += cmd; if (prevF === false) back += 'L' + q[0].toFixed(4) + ' ' + q[1].toFixed(4); }
        else { back += cmd; if (prevF === true) front += 'L' + q[0].toFixed(4) + ' ' + q[1].toFixed(4); }
        prevF = f;
      }
      svg('path', Object.assign({ d: back, fill: 'none', 'stroke-opacity': 0.08 }, attrs), layer);
      svg('path', Object.assign({ d: front, fill: 'none', 'stroke-opacity': 0.3 }, attrs), layer);
    }
    function draw() {
      paintKind();
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      var wave = st.run ? Math.cos(TAU * st.t) : 1, loop = st.kind === 'loop';
      var cE = 'var(--accent)', cH = 'var(--ra-warm)';
      svg('circle', { cx: 0, cy: 0, r: 1, fill: 'currentColor', 'fill-opacity': 0.04, stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-width': 0.008 }, layer);
      var line = { stroke: 'currentColor', 'stroke-width': 0.007 };
      ring(function (u) { return unit(PI / 2, TAU * u); }, 96, line);   // equator
      ring(function (u) { return unit(TAU * u, 0); }, 96, line);         // meridian through x
      ring(function (u) { return unit(TAU * u, PI / 2); }, 96, line);    // meridian through y
      // the source at the centre: a short wire along z, or a small loop in the x-y plane
      if (loop) ring(function (u) { return scale(unit(PI / 2, TAU * u), 0.12); }, 48, { stroke: 'currentColor', 'stroke-width': 0.02 });
      else { var w0 = view([0, 0, -0.14]), w1 = view([0, 0, 0.14]); svg('line', { x1: w0[0], y1: w0[1], x2: w1[0], y2: w1[1], stroke: 'currentColor', 'stroke-width': 0.025 }, layer); }
      var zt = view([0, 0, 1.22]); svg('text', { x: zt[0] + 0.04, y: zt[1], 'font-size': 0.09, 'font-style': 'italic', fill: 'currentColor', 'fill-opacity': 0.7 }, layer).textContent = 'z';
      var z0 = view([0, 0, 1]); svg('line', { x1: z0[0], y1: z0[1], x2: zt[0], y2: zt[1], stroke: 'currentColor', 'stroke-opacity': 0.4, 'stroke-width': 0.008 }, layer);
      // every grid point on the front: the potential (thin, grey) and its shadow, the far field (E for a wire, H for a loop)
      GRID_TH.forEach(function (t) {
        GRID_PH.forEach(function (p) {
          var th = t * PI / 180, ph = p * PI / 180, T = triad(st.kind, th, ph);
          if (view(T.r)[2] < 0.05) return;
          arrow(T.r, T.P, 0.2, 'currentColor', 0.008, 0.35);
          arrow(T.r, T.shadow, 0.2 * wave, loop ? cH : cE, 0.016);
        });
      });
      // the chosen point: potential, its radial part, the shadow, and the triad E, H, a_r
      var th = st.th * PI / 180, ph = st.ph * PI / 180, T = triad(st.kind, th, ph), vis = view(T.r)[2] >= 0;
      var big = 0.5;
      arrow(T.r, T.r, 0.3, 'currentColor', 0.016, vis ? 0.8 : 0.3);
      arrow(T.r, T.P, big, 'currentColor', 0.012, vis ? 0.6 : 0.25);
      arrow(T.r, scale(T.r, T.radial), big, 'currentColor', 0.012, vis ? 0.35 : 0.15);
      arrow(T.r, T.E, big * wave, cE, 0.03, vis ? 1 : 0.35);
      arrow(T.r, T.H, big * wave, cH, 0.03, vis ? 1 : 0.35);
      var c = view(T.r);
      svg('circle', { cx: c[0], cy: c[1], r: 0.03, fill: vis ? 'currentColor' : 'none', stroke: 'currentColor', 'stroke-width': 0.01 }, layer);
      [[T.E, 'E', cE], [T.H, 'H', cH], [T.r, 'r̂', 'currentColor']].forEach(function (q) {
        var m = Math.hypot(q[0][0], q[0][1], q[0][2]);
        if (m < 1e-6) return;
        var sg = q[1] !== 'r̂' && wave < 0 ? -1 : 1, len = sg * ((q[1] === 'r̂' ? 0.3 : big * Math.abs(wave) * m) + 0.08);
        var tip = view([T.r[0] + q[0][0] / m * len, T.r[1] + q[0][1] / m * len, T.r[2] + q[0][2] / m * len]);
        svg('text', { x: tip[0], y: tip[1] + 0.03, 'font-size': 0.1, 'font-weight': 'bold', 'text-anchor': 'middle', fill: q[2] }, layer).textContent = q[1];
      });
      var s = Math.sin(th);
      var ah = function (x) { return '<b>â</b><sub>' + x + '</sub>'; }, cot = RA.signed(1 / Math.tan(th), 2);
      rows.dir.td.textContent = 'θ = ' + st.th + '°, φ = ' + st.ph + '°';
      rows.drop.td.innerHTML = 'cos <i>θ</i> = ' + RA.signed(Math.cos(th), 2) + ' of |<b>' + (loop ? 'F' : 'A') + '</b>|; the shadow keeps sin <i>θ</i> = ' + s.toFixed(2);
      rows.E.td.innerHTML = s.toFixed(2) + ' (' + (s > 1e-3 ? sig(20 * Math.log10(s), 2) + ' dB' : 'null') + '): the whole sin <i>θ</i> pattern';
      rows.pol.td.innerHTML = loop ? '<b>E</b> along ' + ah('φ') + ' (horizontal), <b>H</b> along ' + ah('θ') : '<b>E</b> along ' + ah('θ') + ' (vertical), <b>H</b> along ' + ah('φ');
      rows.naive.td.innerHTML = loop ? '<i>H<sub>r</sub></i> = cot <i>θ</i> × <i>H<sub>θ</sub></i> = ' + cot + ' × <i>H<sub>θ</sub></i>; the true one has no 1/<i>r</i> part' :
        '<i>E<sub>r</sub></i> = cot <i>θ</i> × <i>E<sub>θ</sub></i> = ' + cot + ' × <i>E<sub>θ</sub></i>; the true one has no 1/<i>r</i> part';
      sTitle.textContent = (loop ? 'A small loop: F along z on a far sphere, its shadow H along theta, E along phi.' :
        'A short wire: A along z on a far sphere, its shadow E along theta, H along phi.') + ' At theta ' + st.th + ' degrees the far field is ' + s.toFixed(2) + ' of its peak.';
      key.innerHTML = loop ?
        'Grey: <b>F</b>, the same everywhere. Red: its shadow on the sphere, −<i>jω</i><b>F</b> with the radial part dropped, which is <b>H</b> (eq. 3-59a). Blue: <b>E</b> = −η <b>â</b><sub><i>r</i></sub> × <b>H</b>. Same pattern as the wire, polarization turned by 90°.' :
        'Grey: <b>A</b>, the same everywhere. Blue: its shadow on the sphere, −<i>jω</i><b>A</b> with the radial part dropped, which is <b>E</b> (eq. 3-58a). Red: <b>H</b> = <b>â</b><sub><i>r</i></sub> × <b>E</b>/η. At the chosen point the faint grey arrow along <b>r̂</b> is the radial part that cancels.';
    }
    // drag turns the sphere: the front moves with the pointer; a tap picks the nearest grid point on the front
    var drag = null;
    S.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY, moved: 0 }; S.setPointerCapture(e.pointerId); S.style.cursor = 'grabbing'; });
    S.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var px = S.getBoundingClientRect().width / 2.9, dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.moved += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY;
      st.yaw += dx / px; st.pitch = Math.max(-1.4, Math.min(1.4, st.pitch + dy / px));
      draw();
    });
    function up(e) {
      if (!drag) return;
      S.style.cursor = 'grab';
      if (drag.moved < 4) pick(e);
      drag = null;
    }
    S.addEventListener('pointerup', up); S.addEventListener('pointercancel', function () { drag = null; S.style.cursor = 'grab'; });
    function pick(e) {
      var b = S.getBoundingClientRect(), x = (e.clientX - b.left) / b.width * 2.9 - 1.45, y = (e.clientY - b.top) / b.height * 2.8 - 1.4, best = null, bd = 0.15;
      GRID_TH.forEach(function (t) { GRID_PH.forEach(function (p) {
        var q = view(unit(t * PI / 180, p * PI / 180)), dd = Math.hypot(q[0] - x, q[1] - y);
        if (q[2] >= 0 && dd < bd) { bd = dd; best = [t, p]; }
      }); });
      if (!best) return;
      st.th = Math.round(best[0]); st.ph = best[1];
      thIn.value = st.th; thIn.nextElementSibling.textContent = st.th + '°';
      phIn.value = st.ph; phIn.nextElementSibling.textContent = st.ph + '°';
      draw();
    }
    S.addEventListener('keydown', function (e) {
      var k = { ArrowLeft: [-0.1, 0], ArrowRight: [0.1, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] }[e.key];
      if (!k) return;
      e.preventDefault(); st.yaw += k[0]; st.pitch = Math.max(-1.4, Math.min(1.4, st.pitch + k[1])); draw();
    });
    // Play: the fields swing at one cycle every 2 s; E and H in step, the potential drawn as its amplitude
    function tick(ts) {
      if (!st.run) return;
      if (st.visible && !document.hidden) {
        if (st.last != null) { st.t = (st.t + Math.min(0.1, (ts - st.last) / 1000) / 2) % 1; draw(); }
        st.last = ts;
      } else st.last = null;
      requestAnimationFrame(tick);
    }
    play.addEventListener('click', function () {
      st.run = !st.run; st.last = null; play.textContent = st.run ? 'Pause' : 'Play'; play.setAttribute('aria-pressed', String(st.run));
      if (st.run) requestAnimationFrame(tick); else { st.t = 0; draw(); }
    });
    if (reduce) play.title = 'Animation: starts only on request';
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { st.visible = es[0].isIntersecting; }).observe(root);
    draw();
  }

  document.querySelectorAll('[data-widget="far-field"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
