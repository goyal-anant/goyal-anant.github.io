// gain-pattern: directivity, gain and absolute (realized) gain of one antenna, Balanis eqs. (2-46) to (2-52):
// G = e_cd D (2-49) and G_abs = e_r e_cd D = e0 D (2-49b). Since e_cd and e_r have no angle, each pattern is the
// directivity pattern moved down by the same number of dB in every direction.
//   dipole  a copper dipole at 2.45 GHz on a 50 or 75 ohm line (efficiency-chain's dipole model)
//   short   a short dipole with a coil of quality factor Q and an ideal transformer, or straight on 50 ohm
//           (efficiency-chain's shortDipole model)
//   nexrad  the WSR-88D dish (8.54 m): its measured gain and beamwidth against the beamwidth rules of thumb
//           41,253 / HPBW^2 (2-27), 32,400 / HPBW^2 (2-27a) and 30,000 / HPBW^2 (2-51), and the exact D0 of a circular
//           aperture with three tapers (beam-solid-angle's dish model)
// The dipole pattern is Balanis (4-64), [cos(pi L cos t) - cos(pi L)] / sin t, with L in wavelengths; D0 by Simpson.
// Markup from _includes/readalong/gain-pattern.html; helpers from readalong.js (window.RA). The maths at the top
// has no DOM and is also run under node by content/balanis/checks/gain_pattern.py.
(function () {
  var node = typeof module !== 'undefined';
  var E = node ? require('./efficiency-chain.js') : window.EfficiencyChain;
  var B = node ? require('./beam-solid-angle.js') : window.BeamSolidAngle;
  var PI = Math.PI;

  function dipoleU(L, t) {   // radiation intensity of a centre-fed dipole, length L wavelengths, peak-free scale
    var s = Math.sin(t);
    if (s < 1e-9) return 0;
    var f = (Math.cos(PI * L * Math.cos(t)) - Math.cos(PI * L)) / s;
    return f * f;
  }
  function dipoleD(L) {   // returns { D0, D(t) } with D0 = 4 pi Umax / Prad
    var N = 2000, h = PI / N, s = 0, umax = 0;
    for (var i = 0; i <= N; i++) {
      var t = i * h, u = dipoleU(L, t);
      s += (i === 0 || i === N ? 1 : i % 2 ? 4 : 2) * u * Math.sin(t);
      if (u > umax) umax = u;
    }
    var prad = 2 * PI * s * h / 3;
    return { D0: 4 * PI * umax / prad, D: function (t) { return 4 * PI * dipoleU(L, t) / prad; } };
  }
  var DBD = 10 * Math.log10(dipoleD(0.5).D0);   // the half-wave dipole, 2.15 dBi: 0 dBd

  // One antenna: D0 and the efficiencies, all as plain ratios
  function dipoleCase(L, bmm, Z0) {
    var r = E.dipole(L, bmm, Z0), d = dipoleD(L);
    return { D0: d.D0, D: d.D, ecd: r.ec, er: r.er, r: r };
  }
  function shortCase(L, bmm, Q, coil) {
    var r = E.shortDipole(L, bmm, Q, coil), d = dipoleD(L);
    return { D0: d.D0, D: d.D, ecd: r.ec, er: r.er, r: r };
  }

  // NEXRAD (NRC 2002, Appendix A): 8.54 m; one-way beamwidth 0.96 deg at 2.7 GHz and 0.88 deg at 3.0 GHz; gain
  // 45.8 dB at 2.85 GHz. The beamwidth at 2.85 GHz is the straight-line value between the two, 0.92 deg.
  var NX = { d: 8.54, f: 2.85e9, G: 45.8, hp: 0.96 + (0.88 - 0.96) * (2.85 - 2.7) / (3.0 - 2.7) };
  NX.dl = NX.d * NX.f / 299792458;
  NX.area = 10 * Math.log10(Math.pow(PI * NX.dl, 2));   // (pi d / lambda)^2: a uniform, lossless aperture
  function rules(hpDeg) {
    return [41253, 32400, 30000].map(function (k) { return 10 * Math.log10(k / (hpDeg * hpDeg)); });
  }
  var dishCache = {};
  function dish(p) {   // exact D0 (dBi) and HPBW (deg) of the NEXRAD-size aperture with taper (1 - rho^2)^p
    if (!dishCache[p]) {
      var d = B.directivity(B.pattern('dish', 0, p, NX.dl));
      dishCache[p] = { D0: 10 * Math.log10(d.D0), hp: d.hpbwDeg };
    }
    return dishCache[p];
  }

  var api = { dipoleU: dipoleU, dipoleD: dipoleD, DBD: DBD, dipoleCase: dipoleCase, shortCase: shortCase,
    NX: NX, rules: rules, dish: dish };
  if (node) { module.exports = api; return; }
  window.GainPattern = api;   // bandwidth reuses the dipole pattern

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  function dB(v) { return 10 * Math.log10(v); }
  function num(v) { return (v < 0 ? '−' : '') + Math.abs(v).toFixed(2); }
  function pct(v) { return v >= 0.9995 || v < 0.1 ? sig(100 * v, 3) + '%' : (100 * v).toFixed(1) + '%'; }

  function init(root) {
    var d = root.dataset, kind = d.case || 'dipole';
    var st = { L: +(d.length || 0.5), b: +(d.radius || 0.5), Z0: +(d.z0 || 50), Q: +(d.q || 100), coil: d.coil !== 'off',
      unit: d.unit === 'dbd' ? 'dbd' : 'dbi', taper: +(d.taper || 1) };
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root), paint = [];
    if (kind === 'dipole') {
      RA.slider(controls, { label: 'Length', min: 0.40, max: 0.55, step: 0.0025, value: st.L, fmt: function (v) { return v.toFixed(4) + ' λ'; }, onInput: function (v) { st.L = v; update(); } });
      paint.push(RA.toggle(controls, 'Line', [[50, '50 Ω line'], [75, '75 Ω line']], function () { return st.Z0; }, function (v) { st.Z0 = v; update(); }));
    } else if (kind === 'short') {
      RA.slider(controls, { label: 'Length', min: 0, max: 1, step: 'any', value: Math.log(st.L / 0.04) / Math.log(0.3 / 0.04),
        fmt: function (s) { return (0.04 * Math.pow(0.3 / 0.04, s)).toFixed(3) + ' λ'; }, onInput: function (s) { st.L = 0.04 * Math.pow(0.3 / 0.04, s); update(); } });
      var qs = RA.slider(controls, { label: 'Coil <i>Q</i>', min: 0, max: 1, step: 'any', value: Math.log(st.Q / 20) / Math.log(25),
        fmt: function (s) { return String(Math.round(20 * Math.pow(25, s))); }, onInput: function (s) { st.Q = 20 * Math.pow(25, s); update(); } });
      qs.disabled = !st.coil;
      paint.push(RA.toggle(controls, 'Matching', [[true, 'Coil + transformer'], [false, 'Straight on 50 Ω']], function () { return st.coil; }, function (v) { st.coil = v; qs.disabled = !v; update(); }));
    } else {
      paint.push(RA.toggle(controls, 'Taper', [[0, 'Uniform'], [1, 'Parabolic'], [2, 'Parabolic²']], function () { return st.taper; }, function (v) { st.taper = v; st.redraw(); }));
    }
    if (kind !== 'nexrad') paint.push(RA.toggle(controls, 'Unit', [['dbi', 'dBi'], ['dbd', 'dBd']], function () { return st.unit; }, function (v) { st.unit = v; st.redraw(); }));

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    st.redraw = function () { update(); };
    if (kind === 'nexrad') return nexrad(root, stage, st, paint);

    var pbox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, pbox, 'Pattern in the plane of the wire');
    var PS = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.75', role: 'img' }, pbox), Ptitle = svg('title', {}, PS), pLayer = svg('g', {}, PS);
    var W = RA.plotBox(stage, 'From directivity to absolute gain'), wLayer = svg('g', {}, W.S);
    var rows = RA.readout(root, [['d0', 'Directivity <i>D</i><sub>0</sub>'], ['ecd', 'Radiation efficiency <i>e</i><sub>cd</sub>'],
      ['g0', 'Gain <i>G</i><sub>0</sub> = <i>e</i><sub>cd</sub><i>D</i><sub>0</sub>'], ['er', 'Mismatch <i>e</i><sub>r</sub>'],
      ['ga', 'Absolute gain <i>G</i><sub>0abs</sub> = <i>e</i><sub>0</sub><i>D</i><sub>0</sub>']]);
    var floor = kind === 'short' ? -40 : -20, top = 5;

    function update() {
      paint.forEach(function (p) { p(); });
      var c = kind === 'dipole' ? dipoleCase(st.L, st.b, st.Z0) : shortCase(st.L, st.b, st.Q, st.coil);
      var off = st.unit === 'dbd' ? DBD : 0, u = st.unit === 'dbd' ? ' dBd' : ' dBi';
      var lcd = dB(c.ecd), ler = dB(c.er), D0 = dB(c.D0), G0 = D0 + lcd, Ga = G0 + ler;

      // polar cut: radius linear in dB from floor (centre) to top (outer ring); theta from the wire axis (up)
      pLayer.textContent = '';
      var R = function (v) { return Math.max(0, (v - floor) / (top - floor)); }, rings = [];
      for (var v = floor + 10; v <= top - 5 + 1e-9; v += kind === 'short' ? 10 : 5) rings.push({ r: R(v + off), label: String(v).replace('-', '−') });
      RA.polarGrid(pLayer, rings, function (a) { return (a <= 180 ? a : 360 - a) + '°'; });
      svg('line', { x1: 0, y1: -0.16, x2: 0, y2: 0.16, stroke: 'currentColor', 'stroke-width': 0.03, 'stroke-linecap': 'round' }, pLayer);
      [[0, '0 dBi (isotropic)', { stroke: 'currentColor', 'stroke-dasharray': '0.012 0.03', 'stroke-opacity': 0.8 }],
        [DBD, '2.15 dBi (half-wave dipole) = 0 dBd', { stroke: 'var(--art-turmeric)', 'stroke-dasharray': '0.06 0.03' }]].forEach(function (ref) {
        svg('circle', Object.assign({ cx: 0, cy: 0, r: R(ref[0]), fill: 'none', 'stroke-width': 0.012 }, ref[2]), pLayer);
      });
      var curves = [[0, { stroke: 'currentColor', 'stroke-dasharray': '0.05 0.03', 'stroke-width': 0.014 }, 'directivity'],
        [lcd, { stroke: 'var(--accent)', 'stroke-width': 0.022 }, 'gain'],
        [lcd + ler, { stroke: 'var(--ra-warm)', 'stroke-width': 0.016 }, 'absolute gain']];
      curves.forEach(function (cv) {
        var pts = [];
        for (var i = 0; i <= 360; i++) {
          var a = i * PI / 180, t = a <= PI ? a : 2 * PI - a, Dt = c.D(t), rr = Dt > 0 ? R(dB(Dt) + cv[0]) : 0;
          pts.push((i ? 'L' : 'M') + (rr * Math.sin(a)).toFixed(4) + ' ' + (-rr * Math.cos(a)).toFixed(4));
        }
        svg('path', Object.assign({ d: pts.join(''), fill: 'none' }, cv[1]), pLayer);
      });
      var leg = [[{ stroke: 'currentColor', 'stroke-dasharray': '0.05 0.03', 'stroke-width': 0.014 }, 'Directivity'],
        [{ stroke: 'var(--accent)', 'stroke-width': 0.022 }, 'Gain'], [{ stroke: 'var(--ra-warm)', 'stroke-width': 0.016 }, 'Absolute gain'],
        [{ stroke: 'currentColor', 'stroke-dasharray': '0.012 0.03', 'stroke-width': 0.012 }, 'Isotropic, 0 dBi'],
        [{ stroke: 'var(--art-turmeric)', 'stroke-dasharray': '0.06 0.03', 'stroke-width': 0.012 }, 'Half-wave dipole, 0 dBd']];
      leg.forEach(function (it, i) {
        var x = i < 3 ? -1.25 + 0.85 * i : -1.25 + 1.25 * (i - 3), y = i < 3 ? 1.27 : 1.39;
        svg('line', Object.assign({ x1: x, x2: x + 0.14, y1: y - 0.022, y2: y - 0.022 }, it[0]), pLayer);
        svg('text', { x: x + 0.18, y: y, 'font-size': 0.065, fill: 'currentColor' }, pLayer).textContent = it[1];
      });
      Ptitle.textContent = 'Polar cut in ' + u.trim() + ', ' + (floor - off).toFixed(0) + ' at the centre: directivity peaks at ' + num(D0 - off) + u +
        ', gain at ' + num(G0 - off) + u + ', absolute gain at ' + num(Ga - off) + u + '.';

      // ladder: D0, then the e_cd step, then the e_r step
      wLayer.textContent = '';
      var lo = kind === 'short' ? (st.coil ? -40 : -60) : -2, hi = kind === 'short' ? 5 : 3;
      if (Ga < lo) lo = Math.floor((Ga - 2) / 10) * 10;
      var step = RA.niceStep(hi - lo, 5), yt = [];
      for (var y = Math.ceil((lo - off) / step) * step; y <= hi - off + 1e-9; y += step) yt.push(y + off);
      var names = ['D₀', 'losses', 'G₀', 'mismatch', 'G₀abs'];
      var F = RA.frame(wLayer, [-0.5, 4.5], [lo, hi], [0, 1, 2, 3, 4], yt, '', u.trim(), function (i) { return names[i]; },
        function (y) { return (Math.round((y - off) * 10) / 10).toString().replace('-', '−'); });
      [[0, '0 dBi', { stroke: 'currentColor', 'stroke-dasharray': '2 3' }], [DBD, '0 dBd', { stroke: 'var(--art-turmeric)', 'stroke-dasharray': '6 3' }]].forEach(function (ref) {
        if (ref[0] < lo || ref[0] > hi) return;
        svg('line', Object.assign({ x1: F.X(-0.5), x2: F.X(4.5), y1: F.Y(ref[0]), y2: F.Y(ref[0]), 'stroke-width': 1 }, ref[2]), wLayer);
      });
      var bw = F.X(0.35) - F.X(0);
      function bar(i, a, b2, fill, op) {
        var y1 = F.clampY(F.Y(Math.max(a, b2))), y2 = F.clampY(F.Y(Math.min(a, b2)));
        svg('rect', { x: F.X(i) - bw, y: y1, width: 2 * bw, height: Math.max(0.8, y2 - y1), fill: fill, 'fill-opacity': op }, wLayer);
      }
      bar(0, lo, D0, 'currentColor', 0.35);
      bar(1, D0, G0, 'var(--ra-warm)', 0.9);
      bar(2, lo, G0, 'var(--accent)', 0.6);
      bar(3, G0, Ga, 'currentColor', 0.6);
      bar(4, lo, Ga, 'var(--ra-warm)', 0.6);
      [[0, D0 - off, D0, -4], [1, lcd, Math.min(D0, G0), 11], [2, G0 - off, G0, -4], [3, ler, Math.min(G0, Ga), 11], [4, Ga - off, Ga, -4]].forEach(function (q) {
        var t = q[0] % 2 ? (q[1] > -0.005 ? '0.00 dB' : num(q[1]) + ' dB') : num(q[1]);
        svg('text', { x: F.X(q[0]), y: F.clampY(F.Y(q[2])) + q[3], 'font-size': 9, 'text-anchor': 'middle', fill: 'currentColor' }, wLayer).textContent = t;
      });
      W.title.textContent = 'Directivity ' + num(D0 - off) + u + ', minus ' + (-lcd).toFixed(2) + ' dB of radiation efficiency gives gain ' + num(G0 - off) + u +
        ', minus ' + (-ler).toFixed(2) + ' dB of mismatch gives absolute gain ' + num(Ga - off) + u + '.';

      rows.d0.td.textContent = sig(c.D0, 4) + ' = ' + num(D0 - off) + u;
      rows.ecd.td.textContent = pct(c.ecd) + ' = ' + num(lcd) + ' dB';
      rows.g0.td.textContent = sig(c.D0 * c.ecd, 3) + ' = ' + num(G0 - off) + u;
      rows.er.td.textContent = pct(c.er) + ' = ' + num(ler) + ' dB (|Γ| ' + c.r.G.toFixed(3) + ')';
      rows.ga.td.textContent = sig(c.D0 * c.ecd * c.er, 3) + ' = ' + num(Ga - off) + u;
    }
    update();
  }

  // NEXRAD: gain against half-power beamwidth, log scale, with the three rules as straight lines
  function nexrad(root, stage, st, paint) {
    var P = RA.plotBox(stage, 'Gain against beamwidth (8.54 m dish, 2.85 GHz)'), layer = svg('g', {}, P.S);
    var rows = RA.readout(root, [['model', 'Model dish: HPBW, exact <i>D</i><sub>0</sub>'], ['kraus', '41,253 / HPBW² on the model'],
      ['meas', 'NEXRAD measured: HPBW, <i>G</i><sub>0</sub>'], ['rules', '41,253 / 32,400 / 30,000 over HPBW²'],
      ['ap', '(π<i>d</i>/λ)², aperture efficiency'], ['gd', 'Measured <i>G</i><sub>0</sub> − model <i>D</i><sub>0</sub>']]);
    var xr = [0.6, 1.2], yr = [43, 51];
    function update() {
      paint.forEach(function (p) { p(); });
      layer.textContent = '';
      var F = RA.frame(layer, xr, yr, [0.6, 0.7, 0.8, 0.9, 1.0, 1.2], [43, 44, 45, 46, 47, 48, 49, 50, 51], 'half-power beamwidth (degrees, log scale)', 'dBi',
        function (x) { return x.toFixed(1); }, String, true, false);
      var sty = [{ stroke: 'currentColor', 'stroke-dasharray': '5 3', 'stroke-width': 1.3 }, { stroke: 'var(--art-turmeric)', 'stroke-width': 1.5 },
        { stroke: 'var(--accent)', 'stroke-width': 1.8 }];
      [41253, 32400, 30000].forEach(function (k, i) {
        var pts = [];
        for (var j = 0; j <= 40; j++) { var x = xr[0] * Math.pow(xr[1] / xr[0], j / 40); pts.push([x, 10 * Math.log10(k / (x * x))]); }
        svg('path', Object.assign({ d: RA.path(pts, F), fill: 'none' }, sty[i]), layer);
      });
      svg('line', { x1: F.X(xr[0]), x2: F.X(xr[1]), y1: F.Y(NX.area), y2: F.Y(NX.area), stroke: 'currentColor', 'stroke-opacity': 0.5, 'stroke-dasharray': '1.5 2.5' }, layer);
      svg('text', { x: F.X(1.19), y: F.Y(NX.area) + 10, 'font-size': 8.5, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.75 }, layer).textContent = '(πd/λ)², uniform and lossless';
      [0, 1, 2].forEach(function (p) {
        var m = dish(p), on = p === st.taper;
        svg('circle', { cx: F.X(m.hp), cy: F.Y(m.D0), r: on ? 4 : 2.6, fill: on ? 'currentColor' : 'none', stroke: 'currentColor', 'stroke-width': 1.2 }, layer);
      });
      svg('rect', { x: F.X(NX.hp) - 4, y: F.Y(NX.G) - 4, width: 8, height: 8, fill: 'var(--ra-warm)', transform: 'rotate(45 ' + F.X(NX.hp) + ' ' + F.Y(NX.G) + ')' }, layer);
      svg('text', { x: F.X(NX.hp) - 8, y: F.Y(NX.G) + 13, 'font-size': 9, 'text-anchor': 'end', fill: 'var(--ra-warm)' }, layer).textContent = 'NEXRAD, measured';
      RA.legend(layer, 172, 36, [[sty[0], '41,253 / HPBW² (2-27)'], [sty[1], '32,400 / HPBW² (2-27a)'], [sty[2], '30,000 / HPBW² (2-51)'],
        [{ stroke: 'currentColor', 'stroke-width': 1.2 }, 'model dish, exact D₀']]);
      var m = dish(st.taper), r = rules(NX.hp), eta = Math.pow(10, (NX.G - NX.area) / 10);
      P.title.textContent = 'Gain in dBi against half-power beamwidth. The measured NEXRAD point (' + NX.hp.toFixed(2) + '°, ' + NX.G + ' dBi) sits on the 32,400 line and ' +
        (NX.G - r[2]).toFixed(1) + ' dB above the 30,000 line; the ' + ['uniform', 'parabolic', 'parabolic²'][st.taper] + ' model dish has D0 ' + m.D0.toFixed(1) + ' dBi at ' + m.hp.toFixed(2) + '°.';
      rows.model.td.textContent = m.hp.toFixed(3) + '°, ' + m.D0.toFixed(2) + ' dBi';
      rows.kraus.td.textContent = (10 * Math.log10(41253 / (m.hp * m.hp))).toFixed(2) + ' dBi';
      rows.meas.td.textContent = NX.hp.toFixed(2) + '°, ' + NX.G.toFixed(1) + ' dBi';
      rows.rules.td.textContent = r.map(function (v) { return v.toFixed(1); }).join(' / ') + ' dBi';
      rows.ap.td.textContent = NX.area.toFixed(2) + ' dBi, ' + Math.round(100 * eta) + '%';
      rows.gd.td.textContent = num(NX.G - m.D0) + ' dB';
    }
    st.redraw = update;
    update();
  }

  document.querySelectorAll('[data-widget="gain-pattern"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
