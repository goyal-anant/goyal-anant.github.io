// polarization-ellipse: the figure traced by E at one point, the loss between two polarizations, and the crossed
// dipole (Balanis §2.12).
//   wave       E = x Exo cos(wt + kz) + y Eyo cos(wt + kz + dphi), the wave of Balanis (2-55) to (2-57), travelling in
//              -z and viewed along its travel (x right, y up). Axial ratio and tilt from the Stokes parameters; the
//              tilt is measured from +y towards +x, like tau in (2-68), and the readout also shows (2-68) with a plain
//              arctan, which picks the minor axis whenever Eyo > Exo. Right: the same field along 2 wavelengths of z.
//   link       a wave and a receiving antenna, each given by axial ratio, tilt and sense. Both are drawn as seen
//              along the wave's travel; the antenna's ellipse is the wave it receives best. PLF = |w . conj(r)|^2,
//              which is Balanis's (2-71), |rho_w . rho_a|^2 with no conjugate, because his rho_a is the antenna's
//              transmit-mode vector and that is conj(r) in this basis.
//   turnstile  two half-wave dipoles along x and y, currents I1 and I2 = -j (ZL / Z0) I1: the y dipole's line is a
//              quarter wave longer. ZL = Z0 gives quadrature; a dipole that is not matched to the line does not.
//              Fields from the half-wave dipole of Balanis (4-64), each along the part of its wire perpendicular to r.
//              Crossed dipoles at one centre have no mutual impedance, so each sees only its own ZL.
// Markup from _includes/readalong/polarization-ellipse.html; helpers from readalong.js (window.RA). The maths at the
// top has no DOM and is also run under node by content/balanis/checks/polarization_ellipse.py.
(function () {
  var node = typeof module !== 'undefined';
  var PI = Math.PI, D2R = PI / 180;

  // complex numbers as [re, im]
  function cx(r, i) { return [r, i || 0]; }
  function mul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
  function div(a, b) { var d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; }
  function abs(a) { return Math.hypot(a[0], a[1]); }
  function arg(a) { return Math.atan2(a[1], a[0]); }
  function conj(a) { return [a[0], -a[1]]; }

  // Ellipse of the field (Ex, Ey) (complex), viewed along travel with x right, y up.
  // tau: major axis from +y towards +x, degrees in [0, 180). sense: +1 clockwise (right hand), -1 left, 0 linear.
  function ellipse(Ex, Ey) {
    var a = abs(Ex), b = abs(Ey), d = arg(Ey) - arg(Ex);
    var S0 = a * a + b * b, S1 = a * a - b * b, S2 = 2 * a * b * Math.cos(d), S3 = 2 * a * b * Math.sin(d);
    var L = Math.hypot(S1, S2), OA = Math.sqrt((S0 + L) / 2), OB = Math.sqrt(Math.max(0, (S0 - L) / 2));
    var psi = Math.atan2(S2, S1) / 2 / D2R;   // from +x towards +y
    var tau = ((90 - psi) % 180 + 180) % 180;
    var s3 = S0 ? S3 / S0 : 0;
    return { OA: OA, OB: OB, AR: OB > 1e-12 * OA ? OA / OB : Infinity, tau: tau, sense: Math.abs(s3) < 1e-9 ? 0 : s3 > 0 ? 1 : -1,
      stokes: [S1 / S0, S2 / S0, s3] };
  }
  // Balanis (2-68) as printed, with the principal arctan (NaN when Exo = Eyo)
  function bookTau(a, b, d) {
    var t = 90 - Math.atan(2 * a * b * Math.cos(d) / (a * a - b * b)) / 2 / D2R;
    return ((t % 180) + 180) % 180;
  }
  // Unit Jones vector for an axial ratio (dB; Infinity = linear), tilt tau (deg, from +y towards +x), sense +1 RH, -1 LH.
  function jones(ARdB, tau, sense) {
    var B = sense === 0 || !isFinite(ARdB) ? 0 : Math.pow(10, -ARdB / 20), n = Math.hypot(1, B), t = tau * D2R;
    var m = [Math.sin(t), Math.cos(t)], q = [Math.cos(t), -Math.sin(t)];   // major and minor directions
    // E = m + (-j sense B) q: at tau = 0, Ex = -j sense B, Ey = 1, so dphi = +90 deg for sense +1 (clockwise)
    return [cx(m[0] / n, -sense * B * q[0] / n), cx(m[1] / n, -sense * B * q[1] / n)];
  }
  function dot(u, v) { var p = mul(u[0], v[0]), r = mul(u[1], v[1]); return [p[0] + r[0], p[1] + r[1]]; }
  function plf(w, r) { var x = dot(w, [conj(r[0]), conj(r[1])]); return x[0] * x[0] + x[1] * x[1]; }

  // Crossed half-wave dipoles: far field (E_theta, E_phi), arbitrary units, with I1 = 1 and I2 = k.
  function feedRatio(ZL, Z0) { return Z0 ? div(mul(cx(0, -1), ZL), cx(Z0)) : cx(0, -1); }   // Z0 = 0: ideal
  function turnstile(th, ph, k) {
    var st = Math.sin(th), ct = Math.cos(th), sp = Math.sin(ph), cp = Math.cos(ph);
    function f(c) { var s2 = 1 - c * c; return s2 < 1e-12 ? 0 : Math.cos(PI / 2 * c) / s2; }   // (4-64) over sin psi
    var fx = f(st * cp), fy = f(st * sp);
    // the part of x (and y) perpendicular to r, in (theta, phi) components
    var Et = [fx * ct * cp + fy * ct * sp * k[0], fy * ct * sp * k[1]];
    var Ep = [-fx * sp + fy * cp * k[0], fy * cp * k[1]];
    return { Et: Et, Ep: Ep };
  }
  // Polarization of the outgoing wave: viewed along r, theta-hat is up and phi-hat is right.
  function turnstileEllipse(th, ph, k) { var e = turnstile(th, ph, k); return ellipse(e.Ep, e.Et); }

  var FEEDS = [['ideal', 'Ideal', null, 0], ['h50', 'λ/2 on 50 Ω', [73.08, 42.5], 50], ['h75', 'λ/2 on 75 Ω', [73.08, 42.5], 75],
    ['trim', 'Trimmed on 50 Ω', [60.7, 0], 50]];   // 60.7 ohm: bandwidth.js dipoleBands(0.5, 50, 2).R0
  function feed(id) {
    for (var i = 0; i < FEEDS.length; i++) if (FEEDS[i][0] === id) return FEEDS[i][2] ? feedRatio(FEEDS[i][2], FEEDS[i][3]) : cx(0, -1);
  }
  function dB(AR) { return isFinite(AR) ? 20 * Math.log10(AR) : Infinity; }

  var api = { ellipse: ellipse, bookTau: bookTau, jones: jones, plf: plf, feedRatio: feedRatio, turnstile: turnstile,
    turnstileEllipse: turnstileEllipse, feed: feed, FEEDS: FEEDS, dB: dB };
  if (node) { module.exports = api; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function senseName(s) { return s > 0 ? 'right hand (clockwise)' : s < 0 ? 'left hand (counterclockwise)' : 'none (linear)'; }
  function arTxt(AR) { return isFinite(AR) && AR < 1e4 ? AR.toFixed(2) + ' (' + dB(AR).toFixed(2) + ' dB)' : '∞ (linear)'; }
  function cTxt(z) { var re = Math.abs(z[0]) < 5e-4 ? 0 : z[0], im = Math.abs(z[1]) < 5e-4 ? 0 : z[1];
    if (!im) return re.toFixed(3); if (!re) return (im < 0 ? '−' : '') + 'j' + Math.abs(im).toFixed(3);
    return re.toFixed(3) + (im < 0 ? ' − j' : ' + j') + Math.abs(im).toFixed(3); }
  function vTxt(v) { return '(' + cTxt(v[0]) + ', ' + cTxt(v[1]) + ')'; }

  // Points of the ellipse traced by (Ex, Ey) over one period, scaled by s, in screen units (y down).
  function trace(Ex, Ey, s, n) {
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var w = 2 * PI * i / n, x = Ex[0] * Math.cos(w) - Ex[1] * Math.sin(w), y = Ey[0] * Math.cos(w) - Ey[1] * Math.sin(w);
      pts.push([s * x, -s * y]);
    }
    return pts;
  }
  function d(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(4) + ' ' + p[1].toFixed(4); }).join(''); }
  // Small arrowheads along the trace, pointing the way the tip moves.
  function arrows(g, Ex, Ey, s, size, attrs) {
    [0.12, 0.62].forEach(function (f) {
      var p = trace(Ex, Ey, s, 400), i = Math.round(f * 400), a = p[i], b = p[i + 4];
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
      if (L < 1e-6) return;
      dx /= L; dy /= L;
      var tip = [a[0] + dx * size, a[1] + dy * size];
      svg('path', Object.assign({ d: 'M' + (a[0] - dy * size * 0.6) + ' ' + (a[1] + dx * size * 0.6) + 'L' + tip[0] + ' ' + tip[1] + 'L' + (a[0] + dy * size * 0.6) + ' ' + (a[1] - dx * size * 0.6) + 'Z' }, attrs), g);
    });
  }
  function axes(g, xl, yl) {
    [[0, -1.15, 0, 1.15], [-1.15, 0, 1.15, 0]].forEach(function (l) {
      svg('line', { x1: l[0], y1: l[1], x2: l[2], y2: l[3], stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.008 }, g);
    });
    svg('text', { x: 1.2, y: 0.03, 'font-size': 0.08, 'font-style': 'italic', fill: 'currentColor' }, g).textContent = xl;
    svg('text', { x: 0.04, y: -1.18, 'font-size': 0.08, 'font-style': 'italic', fill: 'currentColor' }, g).textContent = yl;
  }
  function ellipseBox(stage, caption) {
    var box = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, box, caption);
    var S = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', role: 'img' }, box);
    return { S: S, title: svg('title', {}, S), g: svg('g', {}, S) };
  }
  function group(controls, label) {
    var g = RA.el('div', { class: 'ra-controls' }, controls);
    RA.el('strong', {}, g, label);
    return g;
  }

  function init(root) {
    var data = root.dataset, kind = data.case || 'wave';
    root.textContent = '';
    var controls = RA.el('div', {}, root);
    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    if (kind === 'link') return link(root, controls, stage, data);
    if (kind === 'turnstile') return crossed(root, controls, stage, data);
    wave(root, controls, stage, data);
  }

  // ---- case wave ----
  function wave(root, controls, stage, data) {
    var st = { a: +(data.exo || 1), b: +(data.eyo || 1), dp: +(data.dphi || 90), t: 0, run: !reduce }, sl = {};
    var c = RA.el('div', { class: 'ra-controls' }, controls);
    sl.a = RA.slider(c, { label: '<i>E</i><sub>xo</sub>', min: 0, max: 1, step: 0.01, value: st.a, fmt: function (v) { return v.toFixed(2); }, onInput: function (v) { st.a = v; update(); } });
    sl.b = RA.slider(c, { label: '<i>E</i><sub>yo</sub>', min: 0, max: 1, step: 0.01, value: st.b, fmt: function (v) { return v.toFixed(2); }, onInput: function (v) { st.b = v; update(); } });
    sl.d = RA.slider(c, { label: 'Δφ = φ<sub>y</sub> − φ<sub>x</sub>', min: -180, max: 180, step: 1, value: st.dp, fmt: function (v) { return v + '°'; }, onInput: function (v) { st.dp = v; update(); } });
    var p = RA.el('div', { class: 'ra-controls' }, controls), presets = [];
    [['Linear', 1, 0.5, 0], ['RHCP', 1, 1, 90], ['LHCP', 1, 1, -90], ['Elliptical', 1, 0.6, 50], ['Where (2-68) slips', 0.5, 1, 0]].forEach(function (q) {
      var b = RA.el('button', { type: 'button', class: 'ra-button' }, p, q[0]);
      b.addEventListener('click', function () { st.a = q[1]; st.b = q[2]; st.dp = q[3]; sl.a.value = q[1]; sl.b.value = q[2]; sl.d.value = q[3];
        [sl.a, sl.b, sl.d].forEach(function (s) { s.dispatchEvent(new Event('input')); }); });
      presets.push([q, b]);
    });
    var play = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': String(st.run) }, p, 'Play');
    play.addEventListener('click', function () { st.run = !st.run; play.setAttribute('aria-pressed', String(st.run)); if (st.run) loop(); });

    var A = ellipseBox(stage, 'At one point, looking along the travel (−z, into the screen)');
    var gStatic = svg('g', {}, A.g), gTip = svg('g', {}, A.g);
    var hbox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, hbox, 'Along two wavelengths of z, at one instant');
    var H = svg('svg', { viewBox: '-0.4 -1.35 3.2 2.6', role: 'img' }, hbox), Htitle = svg('title', {}, H), hStatic = svg('g', {}, H), hDyn = svg('g', {}, H);
    var rbox = RA.el('div', {}, stage);
    var rows = RA.readout(rbox, [['type', 'Polarization'], ['ar', 'Axial ratio <i>OA</i>/<i>OB</i>'], ['tau', 'Tilt τ from <i>y</i>'], ['book', '(2-68) with plain tan<sup>−1</sup>'], ['sense', 'Sense (IEEE)']]);
    var Ex, Ey, e, S = 1;

    // oblique view: travel runs to the right, x comes out of the screen towards the lower left, y is up
    function P(x, y, s) { return [s * 1.15 - 0.42 * x, -y * 0.95 + 0.3 * x]; }
    function update() {
      var dr = st.dp * D2R;
      Ex = cx(st.a); Ey = [st.b * Math.cos(dr), st.b * Math.sin(dr)];
      e = ellipse(Ex, Ey);
      presets.forEach(function (q) { q[1].setAttribute('aria-pressed', String(Math.abs(st.a - q[0][1]) < 1e-9 && Math.abs(st.b - q[0][2]) < 1e-9 && st.dp === q[0][3])); });
      S = e.OA > 0 ? 1 / e.OA : 1;
      gStatic.textContent = '';
      axes(gStatic, 'x', 'y');
      if (e.OA > 0) {
        var col = 'var(--accent)';
        svg('path', { d: d(trace(Ex, Ey, S, 240)) + 'Z', fill: col, 'fill-opacity': 0.08, stroke: col, 'stroke-width': 0.02 }, gStatic);
        var t = e.tau * D2R, ma = [Math.sin(t), -Math.cos(t)], mi = [Math.cos(t), Math.sin(t)], ob = e.OB * S;
        if (e.AR > 1.0005) svg('line', { x1: -ma[0], y1: -ma[1], x2: ma[0], y2: ma[1], stroke: 'currentColor', 'stroke-dasharray': '0.04 0.03', 'stroke-width': 0.008 }, gStatic);
        if (ob > 0.02 && e.AR > 1.0005) svg('line', { x1: -mi[0] * ob, y1: -mi[1] * ob, x2: mi[0] * ob, y2: mi[1] * ob, stroke: 'currentColor', 'stroke-dasharray': '0.02 0.02', 'stroke-width': 0.008 }, gStatic);
        // tilt arc from +y to the major axis (the end of it with y >= 0)
        var tt = e.tau > 90 ? e.tau - 180 : e.tau, r0 = 0.32, arc = [];
        for (var i = 0; i <= 30; i++) { var u = tt * D2R * i / 30; arc.push([r0 * Math.sin(u), -r0 * Math.cos(u)]); }
        if (e.AR > 1.0005) svg('path', { d: d(arc), fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 0.012 }, gStatic);
        if (e.AR > 1.0005) svg('text', { x: r0 * Math.sin(tt * D2R / 2) * 1.35 + (tt < 0 ? -0.08 : 0.02), y: -r0 * Math.cos(tt * D2R / 2) * 1.3, 'font-size': 0.08, fill: 'var(--ra-warm)' }, gStatic).textContent = 'τ';
        if (e.sense) arrows(gStatic, Ex, Ey, S, 0.07, { fill: col });
      }
      hStatic.textContent = '';
      var ax0 = P(0, 0, 0), ax1 = P(0, 0, 2.2);
      svg('line', { x1: ax0[0], y1: ax0[1], x2: ax1[0], y2: ax1[1], stroke: 'currentColor', 'stroke-opacity': 0.5, 'stroke-width': 0.01 }, hStatic);
      svg('path', { d: 'M' + ax1[0] + ' ' + ax1[1] + 'l-0.06 -0.035v0.07Z', fill: 'currentColor', 'fill-opacity': 0.5 }, hStatic);
      svg('text', { x: ax1[0], y: 1.2, 'font-size': 0.08, 'text-anchor': 'end', fill: 'currentColor' }, hStatic).textContent = 'travel (−z)';
      [[P(0.9, 0, 0), 'x'], [P(0, 0.9, 0), 'y']].forEach(function (q) {
        svg('line', { x1: ax0[0], y1: ax0[1], x2: q[0][0], y2: q[0][1], stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.008 }, hStatic);
        svg('text', { x: q[0][0] - 0.06, y: q[0][1] + (q[1] === 'x' ? 0.08 : -0.02), 'font-size': 0.08, 'font-style': 'italic', fill: 'currentColor' }, hStatic).textContent = q[1];
      });
      var dpTxt = e.sense ? senseName(e.sense) : 'linear';
      rows.type.td.textContent = e.OA === 0 ? 'no field' : !e.sense ? 'linear' : e.AR < 1.0005 ? 'circular' : 'elliptical';
      rows.ar.td.textContent = e.OA === 0 ? '–' : arTxt(e.AR);
      rows.tau.td.textContent = e.OA === 0 || e.AR < 1.0005 ? '–' : e.tau.toFixed(1) + '°';
      var bt = bookTau(st.a, st.b, st.dp * D2R);
      rows.book.td.textContent = e.OA === 0 || e.AR < 1.0005 ? '–' : isNaN(bt) ? 'divides by zero' : bt.toFixed(1) + '°' + (Math.abs(bt - e.tau) > 0.5 && Math.abs(Math.abs(bt - e.tau) - 180) > 0.5 ? ' (minor axis)' : '');
      rows.sense.td.textContent = senseName(e.sense);
      A.title.textContent = 'Polarization ellipse for Exo ' + st.a.toFixed(2) + ', Eyo ' + st.b.toFixed(2) + ', phase difference ' + st.dp + ' degrees: ' +
        rows.type.td.textContent + ', axial ratio ' + rows.ar.td.textContent + ', tilt ' + rows.tau.td.textContent + ' from y, sense ' + dpTxt + '.';
      Htitle.textContent = 'The same field drawn along two wavelengths of z at one instant: the tips form a helix whose hand is opposite to the sense of rotation in time.';
      draw();
    }
    function draw() {
      var w = st.t;
      gTip.textContent = '';
      if (e.OA > 0) {
        var x = S * (Ex[0] * Math.cos(w) - Ex[1] * Math.sin(w)), y = -S * (Ey[0] * Math.cos(w) - Ey[1] * Math.sin(w));
        svg('line', { x1: 0, y1: 0, x2: x, y2: y, stroke: 'currentColor', 'stroke-width': 0.018 }, gTip);
        svg('circle', { cx: x, cy: y, r: 0.04, fill: 'currentColor' }, gTip);
      }
      hDyn.textContent = '';
      if (e.OA === 0) return;
      var tips = [], k = 0.85 * S;
      for (var i = 0; i <= 160; i++) {
        var s = 2 * i / 160, ph = w - 2 * PI * s;   // travelling in -z: e^{j(wt + kz)}, z = -s wavelengths
        var ex = k * (Ex[0] * Math.cos(ph) - Ex[1] * Math.sin(ph)), ey = k * (Ey[0] * Math.cos(ph) - Ey[1] * Math.sin(ph)), q = P(ex, ey, s);
        tips.push(q);
        if (i % 5 === 0) { var o = P(0, 0, s); svg('line', { x1: o[0], y1: o[1], x2: q[0], y2: q[1], stroke: 'var(--accent)', 'stroke-opacity': 0.45, 'stroke-width': 0.01 }, hDyn); }
      }
      svg('path', { d: d(tips), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 0.02 }, hDyn);
      svg('circle', { cx: tips[0][0], cy: tips[0][1], r: 0.035, fill: 'currentColor' }, hDyn);
    }
    // time runs forward (e^{jwt}): the tip moves the way the arrows show, one turn in 3 s
    var last = null;
    function loop(ts) {
      if (!st.run) { last = null; return; }
      if (ts != null) { if (last != null) st.t += (ts - last) / 1000 * 2 * PI / 3; last = ts; draw(); }
      requestAnimationFrame(loop);
    }
    update();
    if (st.run) loop();
  }

  // ---- case link ----
  function link(root, controls, stage, data) {
    function parse(s, dflt) { var q = (s || dflt).split(','); return { s: q[0] === 'R' ? 1 : q[0] === 'L' ? -1 : 0, ar: +q[1], tau: +q[2] }; }
    var st = { w: parse(data.wave, 'R,0,0'), a: parse(data.antenna, 'L,0,0') }, paints = [], sliders = {};
    ['w', 'a'].forEach(function (key) {
      var g = group(controls, key === 'w' ? 'Wave' : 'Antenna');
      paints.push(RA.toggle(g, key === 'w' ? 'Wave sense' : 'Antenna sense', [[1, 'RH'], [-1, 'LH'], [0, 'Linear']], function () { return st[key].s; }, function (v) { st[key].s = v; update(); }));
      sliders[key + 'ar'] = RA.slider(g, { label: 'Axial ratio', min: 0, max: 20, step: 0.1, value: st[key].ar, fmt: function (v) { return v.toFixed(1) + ' dB'; }, onInput: function (v) { st[key].ar = v; update(); } });
      sliders[key + 'tau'] = RA.slider(g, { label: 'Tilt τ', min: 0, max: 180, step: 1, value: st[key].tau, fmt: function (v) { return v + '°'; }, onInput: function (v) { st[key].tau = v; update(); } });
    });
    var pg = RA.el('div', { class: 'ra-controls' }, controls), presets = [];
    [['Wi-Fi dipole turned 45°', [0, 0, 0], [0, 0, 45]], ['Straight wire, GPS signal', [1, 1.8, 0], [0, 0, 0]],
      ['RHCP antenna, LHCP wave', [-1, 0, 0], [1, 3, 0]], ['GPS patch, worst tilt', [1, 1.8, 0], [1, 3, 90]]].forEach(function (q) {
      var b = RA.el('button', { type: 'button', class: 'ra-button' }, pg, q[0]);
      b.addEventListener('click', function () {
        [['w', q[1]], ['a', q[2]]].forEach(function (x) {
          st[x[0]] = { s: x[1][0], ar: x[1][1], tau: x[1][2] };
          sliders[x[0] + 'ar'].value = x[1][1]; sliders[x[0] + 'tau'].value = x[1][2];
          sliders[x[0] + 'ar'].dispatchEvent(new Event('input')); sliders[x[0] + 'tau'].dispatchEvent(new Event('input'));
        });
        update();
      });
      presets.push([q, b]);
    });
    var A = ellipseBox(stage, 'Both seen along the wave’s travel');
    var B = RA.plotBox(stage, 'PLF as the antenna turns'), bg = svg('g', {}, B.S);
    var rbox = RA.el('div', {}, stage);
    var rows = RA.readout(rbox, [['plf', 'PLF'], ['w', 'Wave ρ̂<sub>w</sub> in (<i>x</i>, <i>y</i>)'], ['a', 'Antenna ρ̂<sub>a</sub>, transmit mode'], ['xp', 'This antenna against a perfect circular wave of the other sense']]);
    function J(p) { return jones(p.s ? p.ar : Infinity, p.tau, p.s); }
    function pdB(v) { return v < 1e-12 ? '−∞ dB' : (10 * Math.log10(v)).toFixed(2) + ' dB'; }
    function update() {
      paints.forEach(function (p) { p(); });
      Object.keys(sliders).forEach(function (k) { sliders[k].disabled = k.slice(1) === 'ar' && st[k[0]].s === 0; });
      presets.forEach(function (q) {
        var on = [['w', q[0][1]], ['a', q[0][2]]].every(function (x) { var p = st[x[0]]; return p.s === x[1][0] && (p.s === 0 || Math.abs(p.ar - x[1][1]) < 1e-9) && Math.abs(p.tau - x[1][2]) < 1e-9; });
        q[1].setAttribute('aria-pressed', String(on));
      });
      var w = J(st.w), r = J(st.a), v = plf(w, r);
      A.g.textContent = '';
      axes(A.g, 'x', 'y');
      [[w, { stroke: 'var(--accent)', 'stroke-width': 0.024 }, 'var(--accent)'], [r, { stroke: 'var(--ra-warm)', 'stroke-width': 0.018, 'stroke-dasharray': '0.06 0.035' }, 'var(--ra-warm)']].forEach(function (q) {
        var e = ellipse(q[0][0], q[0][1]), s = 1 / e.OA;
        svg('path', Object.assign({ d: d(trace(q[0][0], q[0][1], s, 240)) + 'Z', fill: 'none' }, q[1]), A.g);
        if (e.sense) arrows(A.g, q[0][0], q[0][1], s, 0.07, { fill: q[2] });
      });
      [['var(--accent)', null, 'wave'], ['var(--ra-warm)', '0.06 0.035', 'antenna']].forEach(function (it, i) {
        var x = -1.2 + 1.2 * i;
        svg('line', { x1: x, x2: x + 0.14, y1: 1.2, y2: 1.2, stroke: it[0], 'stroke-width': 0.02, 'stroke-dasharray': it[1] || 'none' }, A.g);
        svg('text', { x: x + 0.18, y: 1.225, 'font-size': 0.075, fill: 'currentColor' }, A.g).textContent = it[2];
      });
      // PLF against antenna tilt
      bg.textContent = '';
      var pts = [], lo = 0;
      for (var t = 0; t <= 180; t += 1) { var vv = plf(w, jones(st.a.s ? st.a.ar : Infinity, t, st.a.s)); pts.push([t, Math.max(-30, 10 * Math.log10(Math.max(vv, 1e-6)))]); lo = Math.min(lo, pts[t][1]); }
      // the scale follows the curve, so a 2 dB ripple is not flattened by a 30 dB axis
      var yr = lo > -5.5 ? [-6, [-6, -4, -3, -2, 0]] : lo > -11 ? [-12, [-12, -9, -6, -3, 0]] : [-30, [-30, -20, -10, -3, 0]];
      var F = RA.frame(bg, [0, 180], [yr[0], 0], [0, 45, 90, 135, 180], yr[1], 'antenna tilt τ (degrees)', 'PLF (dB)', function (x) { return x + '°'; }, String, false, false);
      svg('path', { d: RA.path(pts, F), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.8 }, bg);
      svg('circle', { cx: F.X(st.a.tau), cy: F.clampY(F.Y(Math.max(-30, 10 * Math.log10(Math.max(v, 1e-6))))), r: 3.2, fill: 'currentColor' }, bg);
      rows.plf.td.textContent = v.toFixed(4) + ', ' + pdB(v);
      rows.w.td.textContent = vTxt(w);
      rows.a.td.textContent = vTxt([conj(r[0]), conj(r[1])]);
      if (st.a.s) {
        var ar = Math.pow(10, st.a.ar / 20);
        rows.xp.td.textContent = st.a.ar < 0.005 ? 'perfect (AR 0 dB)' : (-10 * Math.log10((ar - 1) * (ar - 1) / (2 * (ar * ar + 1)))).toFixed(1) + ' dB';
      } else rows.xp.td.textContent = 'linear: none for CP';
      A.title.textContent = 'Wave ellipse (solid) and the antenna’s ellipse (dashed) seen along the wave’s travel; polarization loss factor ' + rows.plf.td.textContent + '.';
      B.title.textContent = 'Polarization loss factor in dB against the antenna’s tilt from 0 to 180 degrees, with the current tilt marked.';
    }
    update();
  }

  // ---- case turnstile ----
  function crossed(root, controls, stage, data) {
    var st = { feed: data.feed || 'ideal', th: +(data.theta || 45), ph: +(data.phi || 0) }, paint;
    var c = RA.el('div', { class: 'ra-controls' }, controls);
    paint = RA.toggle(c, 'Feed', FEEDS.map(function (f) { return [f[0], f[1]]; }), function () { return st.feed; }, function (v) { st.feed = v; update(); });
    RA.slider(c, { label: 'From zenith θ', min: 0, max: 90, step: 1, value: st.th, fmt: function (v) { return v + '°'; }, onInput: function (v) { st.th = v; update(); } });
    RA.slider(c, { label: 'Azimuth φ', min: 0, max: 359, step: 1, value: st.ph, fmt: function (v) { return v + '°'; }, onInput: function (v) { st.ph = v; update(); } });
    var A = ellipseBox(stage, 'Polarization over the sky, seen from above');
    var B = RA.plotBox(stage, 'Axial ratio against angle from zenith'), bg = svg('g', {}, B.S);
    var rbox = RA.el('div', {}, stage);
    var rows = RA.readout(rbox, [['k', '<i>I</i><sub>2</sub>/<i>I</i><sub>1</sub>'], ['z', 'At zenith: axial ratio, sense'], ['here', 'At (θ, φ): axial ratio'], ['hs', 'At (θ, φ): sense'], ['eq', 'At 30°, 45°, 60° (φ = 0)']]);
    var R = function (th) { return th / 90; };
    function update() {
      paint();
      var k = feed(st.feed), g = A.g;
      g.textContent = '';
      [30, 60, 90].forEach(function (t) {
        svg('circle', { cx: 0, cy: 0, r: R(t), fill: 'none', stroke: 'currentColor', 'stroke-opacity': t === 90 ? 0.4 : 0.15, 'stroke-width': 0.006 }, g);
        svg('text', { x: R(t) * 0.26 + 0.01, y: -R(t) * 0.97 + 0.055, 'font-size': 0.055, fill: 'currentColor', 'fill-opacity': 0.6 }, g).textContent = t + '°';
      });
      // the two dipoles, small, at the centre
      svg('line', { x1: -0.16, y1: 0, x2: 0.16, y2: 0, stroke: 'currentColor', 'stroke-width': 0.02, 'stroke-opacity': 0.6 }, g);
      svg('line', { x1: 0, y1: -0.16, x2: 0, y2: 0.16, stroke: 'currentColor', 'stroke-width': 0.02, 'stroke-opacity': 0.6 }, g);
      svg('text', { x: 1.04, y: 0.03, 'font-size': 0.07, 'font-style': 'italic', fill: 'currentColor' }, g).textContent = 'x';
      svg('text', { x: 0.03, y: -1.04, 'font-size': 0.07, 'font-style': 'italic', fill: 'currentColor' }, g).textContent = 'y';
      // field ellipse at each grid direction; in the map, theta-hat points outwards and phi-hat counterclockwise
      var top = 0;
      var grid = [[0, 0]];
      [15, 30, 45, 60, 75].forEach(function (t) { for (var p = 0; p < 360; p += t < 40 ? 45 : 30) grid.push([t, p]); });
      grid.forEach(function (q) { var e = turnstile(q[0] * D2R, q[1] * D2R, k); top = Math.max(top, Math.hypot(abs(e.Et), abs(e.Ep))); });
      grid.forEach(function (q) {
        var th = q[0] * D2R, ph = q[1] * D2R, e = turnstile(th, ph, k), el = ellipse(e.Ep, e.Et), s = 0.075 / top;
        var cxm = R(q[0]) * Math.cos(ph), cym = -R(q[0]) * Math.sin(ph), pts = [];
        for (var i = 0; i <= 48; i++) {
          var w = 2 * PI * i / 48, et = e.Et[0] * Math.cos(w) - e.Et[1] * Math.sin(w), ep = e.Ep[0] * Math.cos(w) - e.Ep[1] * Math.sin(w);
          pts.push([cxm + s * (et * Math.cos(ph) - ep * Math.sin(ph)), cym - s * (et * Math.sin(ph) + ep * Math.cos(ph))]);
        }
        svg('path', { d: d(pts) + 'Z', fill: 'none', stroke: el.sense > 0 ? 'var(--accent)' : el.sense < 0 ? 'var(--ra-warm)' : 'currentColor', 'stroke-width': 0.012 }, g);
      });
      svg('circle', { cx: R(st.th) * Math.cos(st.ph * D2R), cy: -R(st.th) * Math.sin(st.ph * D2R), r: 0.1, fill: 'none', stroke: 'currentColor', 'stroke-width': 0.012, 'stroke-dasharray': '0.03 0.02' }, g);
      [['var(--accent)', 'right hand'], ['var(--ra-warm)', 'left hand']].forEach(function (it, i) {
        var x = -1.2 + 1.1 * i;
        svg('circle', { cx: x + 0.05, cy: 1.2, r: 0.04, fill: 'none', stroke: it[0], 'stroke-width': 0.015 }, g);
        svg('text', { x: x + 0.13, y: 1.225, 'font-size': 0.07, fill: 'currentColor' }, g).textContent = it[1];
      });
      // AR against theta in the planes phi = 0 and phi = 45 deg
      bg.textContent = '';
      var F = RA.frame(bg, [0, 90], [0, 20], [0, 15, 30, 45, 60, 75, 90], [0, 3, 6, 10, 15, 20], 'angle from zenith θ (degrees)', 'AR (dB)', function (x) { return x + '°'; }, String, false, false);
      var sty = [[0, { stroke: 'var(--accent)', 'stroke-width': 1.8 }, 'φ = 0°'], [45, { stroke: 'var(--ra-warm)', 'stroke-width': 1.6, 'stroke-dasharray': '5 3' }, 'φ = 45°']];
      sty.forEach(function (q) {
        var pts = [];
        for (var t = 0; t <= 89.5; t += 0.5) pts.push([t, Math.min(20, dB(turnstileEllipse(t * D2R, q[0] * D2R, k).AR))]);
        svg('path', Object.assign({ d: RA.path(pts, F), fill: 'none' }, q[1]), bg);
      });
      RA.legend(B.S, 60, 40, sty.map(function (q) { return [q[1], q[2]]; }));
      var eh = turnstileEllipse(st.th * D2R, st.ph * D2R, k), ez = turnstileEllipse(0, 0, k);
      svg('line', { x1: F.X(st.th), x2: F.X(st.th), y1: F.Y(20), y2: F.Y(0), stroke: 'currentColor', 'stroke-opacity': 0.6 }, bg);
      rows.k.td.textContent = abs(k).toFixed(3) + ' at ' + (arg(k) / D2R).toFixed(1) + '°';
      rows.z.td.textContent = arTxt(ez.AR) + ', ' + (ez.sense > 0 ? 'right' : ez.sense < 0 ? 'left' : 'linear');
      rows.here.td.textContent = arTxt(eh.AR);
      rows.hs.td.textContent = senseName(eh.sense);
      rows.eq.td.textContent = [30, 45, 60].map(function (t) { return dB(turnstileEllipse(t * D2R, 0, k).AR).toFixed(2); }).join(', ') + ' dB';
      A.title.textContent = 'Map of the sky above two crossed half-wave dipoles, zenith at the centre and the horizon at the rim, with the polarization ellipse drawn at each direction: blue right hand, red left hand. Axial ratio at zenith ' + arTxt(ez.AR) + '.';
      B.title.textContent = 'Axial ratio in dB against angle from zenith in the planes phi 0 and 45 degrees; at theta ' + st.th + ' and phi ' + st.ph + ' it is ' + arTxt(eh.AR) + '.';
    }
    update();
  }

  document.querySelectorAll('[data-widget="polarization-ellipse"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
