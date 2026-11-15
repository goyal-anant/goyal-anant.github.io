// antenna-temperature: what an antenna "sees" is the brightness of the scene around it, weighted by its pattern
// (Balanis eq. 2-144), T_A = (1 / 4 pi) times the integral of D T_B over the sphere; then losses on the way to the
// receiver add their own noise (Balanis eqs. 2-146 to 2-148).
//   case=scene  8.4 GHz (X band, the Deep Space Network's downlink). Sky from ITU-R P.372 eq. (10) with a zenith
//               attenuation fixed by JPL's Voyager 2 link budget (0.04 dB at 58 deg elevation); below about 5 deg the
//               air mass is that of a uniform spherical shell 6 km thick (schematic). Ground from Balanis eq. (2-143)
//               with Fresnel reflection and ITU-R P.527 permittivities, plus the cold sky it reflects.
//               Antennas: isotropic, vertical half-wave dipole, or a dish ((1 - rho^2)^p taper, front half, from
//               beam-solid-angle.js) with an optional schematic spillover spread evenly over its back half.
//   case=chain  antenna loss e_A at T_p, a line of loss L dB at T_0, a receiver T_r: every lossy part with power
//               transmission t turns T_in into t T_in + (1 - t) T. Balanis's (2-146) is shown beside it; its antenna
//               term is larger by 1 / e_A.
// Markup from _includes/readalong/antenna-temperature.html; helpers from readalong.js (window.RA). The maths at the
// top has no DOM and is also run under node by content/balanis/checks/antenna_temperature.py.
(function () {
  var PI = Math.PI, DEG = PI / 180;
  var BSA = typeof module !== 'undefined' ? require('./beam-solid-angle.js') : window.BeamSolidAngle;
  var F_GHZ = 8.4;

  // ---- sky ------------------------------------------------------------------------------------------------------
  var TMR = 275, TCMB = 2.7;                     // ITU-R P.372 eq. (10): mean radiating temperature, cosmic background
  var AZ = 0.04 * Math.sin(58.01 * DEG);         // zenith attenuation (dB) from JPL's 0.04 dB at 58.01 deg elevation
  var RE = 6371, HS = 6;                         // km: Earth radius and the (schematic) thickness of the absorbing shell
  function airMass(el) {                         // path through the shell over its thickness; 1 / sin(el) when high
    var q = RE / HS, s = Math.sin(el);
    return Math.sqrt(q * q * s * s + 2 * q + 1) - q * s;
  }
  function skyT(el) {                            // el in radians, 0 to pi/2
    var t = Math.pow(10, -AZ * airMass(el) / 10);
    return TMR * (1 - t) + TCMB * t;
  }

  // ---- ground: ITU-R P.527-5 permittivities, eps = eps' - j eps'' ----------------------------------------------
  function water(f, T, S) {                      // eqs. (5)-(27); f in GHz, T in deg C, S in g/kg
    var Th = 300 / (T + 273.15) - 1, es = 77.66 + 103.3 * Th, e1 = 0.0671 * es, ei = 3.52 - 7.52 * Th;
    var f1 = 20.20 - 146.4 * Th + 316 * Th * Th, f2 = 39.8 * f1, sig = 0;
    if (S > 0) {
      es *= Math.exp(-3.33330e-3 * S + 4.74868e-6 * S * S);
      f1 *= 1 + S * (2.3232e-3 - 7.9208e-5 * T + 3.6764e-6 * T * T + 3.5594e-7 * T * T * T + 8.9795e-9 * T * T * T * T);
      e1 *= Math.exp(-6.28908e-3 * S + 1.76032e-4 * S * S - 9.22144e-5 * T * S);
      f2 *= 1 + S * (-1.99723e-2 + 1.81176e-4 * T);
      ei *= 1 + S * (-2.04265e-3 + 1.57883e-4 * T);
      var s35 = 2.903602 + 8.607e-2 * T + 4.738817e-4 * T * T - 2.991e-6 * T * T * T + 4.3047e-9 * T * T * T * T;
      var R15 = S * (37.5109 + 5.45216 * S + 1.4409e-2 * S * S) / (1004.75 + 182.283 * S + S * S);
      var a0 = (6.9431 + 3.2841 * S - 9.9486e-2 * S * S) / (84.850 + 69.024 * S + S * S), a1 = 49.843 - 0.2276 * S + 0.198e-2 * S * S;
      sig = s35 * R15 * (1 + a0 * (T - 15) / (a1 + T));
    }
    var x1 = f / f1, x2 = f / f2;
    return [(es - e1) / (1 + x1 * x1) + (e1 - ei) / (1 + x2 * x2) + ei,
      x1 * (es - e1) / (1 + x1 * x1) + x2 * (e1 - ei) / (1 + x2 * x2) + 18 * sig / f];
  }
  function soil(f, T, mv, Ps, Pc, rs, rb) {      // eqs. (37)-(49)
    var Th = 300 / (T + 273.15) - 1, es = 77.66 + 103.3 * Th, e1 = 0.0671 * es, ei = 3.52 - 7.52 * Th;
    var f1 = 20.20 - 146.4 * Th + 316 * Th * Th, f2 = 39.8 * f1, x1 = f / f1, x2 = f / f2, xs = f / 1.35;
    var s1 = 0.0467 + 0.2204 * rb - 0.004111 * Ps - 0.006614 * Pc, s2 = -1.645 + 1.939 * rb - 0.0225622 * Ps + 0.01594 * Pc;
    var sp = xs * (s1 - s2) / (1 + xs * xs), spp = s2 + (s1 - s2) / (1 + xs * xs);
    var efp = (es - e1) / (1 + x1 * x1) + (e1 - ei) / (1 + x2 * x2) + ei + 18 * sp * (rs - rb) / (f * rs * mv);
    var efpp = x1 * (es - e1) / (1 + x1 * x1) + x2 * (e1 - ei) / (1 + x2 * x2) + 18 * spp * (rs - rb) / (f * rs * mv);
    var bp = 1.2748 - 0.00519 * Ps - 0.00152 * Pc, bpp = 1.33797 - 0.00603 * Ps - 0.00166 * Pc, a = 0.65;
    var esm = Math.pow(1.01 + 0.44 * rs, 2) - 0.062;
    return [Math.pow(1 + rb / rs * (Math.pow(esm, a) - 1) + Math.pow(mv, bp) * Math.pow(efp, a) - mv, 1 / a),
      Math.pow(Math.pow(mv, bpp) * Math.pow(efpp, a), 1 / a)];
  }
  // [key, label, eps at 8.4 GHz, physical temperature K]; soil is silty loam (P.527 Table 1) at 23 deg C
  var GROUNDS = [
    ['dry', 'Dry soil', soil(F_GHZ, 23, 0.07, 30.63, 13.48, 2.59, 1.5750), 296.15],
    ['wet', 'Wet soil', soil(F_GHZ, 23, 0.5, 30.63, 13.48, 2.59, 1.5750), 296.15],
    ['sea', 'Sea', water(F_GHZ, 20, 35), 293.15]];
  function cdiv(a, b) { var d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; }
  function csqrt(a) {
    var r = Math.sqrt(Math.hypot(a[0], a[1])), t = Math.atan2(a[1], a[0]) / 2;
    return [r * Math.cos(t), r * Math.sin(t)];
  }
  // |Gamma|^2 for H and V at incidence angle ti (from the vertical); eps as [eps', eps''] meaning eps' - j eps''
  function fresnel(eps, ti) {
    var c = Math.cos(ti), s2 = Math.sin(ti) * Math.sin(ti), er = [eps[0], -eps[1]];
    var q = csqrt([er[0] - s2, er[1]]);
    var h = cdiv([c - q[0], -q[1]], [c + q[0], q[1]]);
    var ec = [er[0] * c, er[1] * c], v = cdiv([ec[0] - q[0], ec[1] - q[1]], [ec[0] + q[0], ec[1] + q[1]]);
    return [h[0] * h[0] + h[1] * h[1], v[0] * v[0] + v[1] * v[1]];
  }
  // Brightness looking down at depression angle dep (radians below the horizon): emission plus reflected sky
  function groundT(g, dep, pol) {
    var G = GROUNDS.filter(function (x) { return x[0] === g; })[0], r = fresnel(G[2], PI / 2 - dep);
    var R = pol === 'h' ? r[0] : pol === 'v' ? r[1] : (r[0] + r[1]) / 2;
    return (1 - R) * G[3] + R * skyT(dep);
  }

  // Brightness against elevation, tabulated every 0.05 deg from -90 to 90 and read by linear interpolation
  var NT = 3600, tabs = {};
  function brightness(g, pol) {
    var key = g + pol, tab = tabs[key];
    if (!tab) {
      tab = tabs[key] = new Float64Array(NT + 1);
      for (var i = 0; i <= NT; i++) {
        var el = (-90 + 180 * i / NT) * DEG;
        tab[i] = el > 0 ? skyT(el) : el < 0 ? groundT(g, -el, pol) : (skyT(1e-9) + groundT(g, 1e-9, pol)) / 2;
      }
    }
    return function (el) {
      var k = (el / DEG + 90) * NT / 180, i = Math.max(0, Math.min(NT - 1, Math.floor(k))), f = k - i;
      return tab[i] * (1 - f) + tab[i + 1] * f;
    };
  }

  // ---- antenna temperature ---------------------------------------------------------------------------------------
  var DIP = function (el) { var c = Math.cos(el); return c < 1e-9 ? 0 : Math.pow(Math.cos(PI / 2 * Math.sin(el)) / c, 2); };
  // Patterns that depend on elevation only (isotropic, vertical half-wave dipole): T_A = (1/2) int D T_B cos(el) d el
  function tempByElevation(U, TB) {
    var N = 1800, h = PI / N, num = 0, den = 0, sky = 0;
    for (var i = 0; i < N; i++) {
      var el = -PI / 2 + (i + 0.5) * h, w = U(el) * Math.cos(el) * h, t = TB(el);
      num += w * t; den += w; if (el > 0) sky += w * t;
    }
    return { TA: num / den, sky: sky / den, ground: (num - sky) / den, D0: 2 * U(0) / den };
  }
  // Ring average of T_B at angle psi from a boresight at elevation e; sky and ground parts separately
  function ring(TB, e, psi, M) {
    var se = Math.sin(e), ce = Math.cos(e), cp = Math.cos(psi), sp = Math.sin(psi), all = 0, sky = 0;
    for (var j = 0; j < M; j++) {
      var ph = (j + 0.5) * PI / M, sb = se * cp + ce * sp * Math.cos(ph);
      var el = Math.asin(Math.max(-1, Math.min(1, sb))), t = TB(el);
      all += t; if (el > 0) sky += t;
    }
    return [all / M, sky / M];
  }
  // Dish table: U(psi) on midpoints of [0, pi/2] and its normalisation, per taper and d / lambda
  var dishCache = {};
  function dishTable(p, dl) {
    var key = p + ',' + dl.toFixed(4);
    if (dishCache[key]) return dishCache[key];
    var N = Math.min(3600, Math.max(600, Math.ceil(30 * dl))), h = PI / 2 / N, a = PI * dl, U = new Float64Array(N), W = new Float64Array(N), den = 0;
    for (var i = 0; i < N; i++) {
      var psi = (i + 0.5) * h, f = BSA.dishField(p, a * Math.sin(psi));
      U[i] = f * f; W[i] = 2 * PI * Math.sin(psi) * h; den += U[i] * W[i];
    }
    dishCache = {};   // keep one table: the sliders move through many values
    return (dishCache[key] = { N: N, h: h, U: U, W: W, D0: 4 * PI / den, den: den });
  }
  // Dish at elevation e (radians) with spillover share s spread evenly over the back half
  function tempDish(TB, e, p, dl, s) {
    var D = dishTable(p, dl), num = 0, sky = 0, M = 96;
    for (var i = 0; i < D.N; i++) {
      var r = ring(TB, e, (i + 0.5) * D.h, M), w = D.U[i] * D.W[i];
      num += w * r[0]; sky += w * r[1];
    }
    var NB = 180, hb = PI / 2 / NB, bn = 0, bs = 0, bw = 0;
    for (var k = 0; k < NB; k++) {
      var psi = PI / 2 + (k + 0.5) * hb, rr = ring(TB, e, psi, M), wb = Math.sin(psi) * hb;
      bn += wb * rr[0]; bs += wb * rr[1]; bw += wb;
    }
    var front = num / D.den, frontSky = sky / D.den, back = bn / bw, backSky = bs / bw;
    var TA = (1 - s) * front + s * back, sk = (1 - s) * frontSky + s * backSky;
    return { TA: TA, sky: sk, ground: TA - sk, D0: (1 - s) * D.D0, front: front, back: back };
  }
  // opts: kind (iso | dipole | dish), el (deg, boresight), g (ground), pol (h | v | avg), p, dl, s (spillover share)
  function antennaTemp(o) {
    var pol = o.kind === 'dipole' ? 'v' : o.pol || 'avg', TB = brightness(o.g, pol);
    if (o.kind === 'iso') return tempByElevation(function () { return 1; }, TB);
    if (o.kind === 'dipole') return tempByElevation(DIP, TB);
    return tempDish(TB, o.el * DEG, o.p, o.dl, o.s || 0);
  }

  // ---- the chain ---------------------------------------------------------------------------------------------------
  // c: TA, eA, Tp, LdB (line loss), T0, Tr. Consistent: each lossy part t T_in + (1 - t) T. Balanis eq. (2-146):
  // [T_A + (1/e_A - 1) T_p] e^(-2 alpha l) + T_0 (1 - e^(-2 alpha l)), i.e. the antenna term without the factor e_A.
  function chain(c) {
    var t = Math.pow(10, -c.LdB / 10);
    var ant = c.eA * c.TA + (1 - c.eA) * c.Tp, Ta = ant * t + c.T0 * (1 - t);
    var antB = c.TA + (1 / c.eA - 1) * c.Tp, TaB = antB * t + c.T0 * (1 - t);
    return { t: t, ant: ant, Ta: Ta, Ts: Ta + c.Tr, antB: antB, TaB: TaB, TsB: TaB + c.Tr,
      lossless: (Ta + c.Tr) / (c.eA * t) };   // the same system temperature referred to a lossless antenna (ITU-R P.372)
  }

  var DSS43 = [[11.66, 33.6], [13.96, 31.4], [16.31, 29.8], [18.72, 28.5], [21.18, 27.4], [23.69, 26.5], [26.24, 25.7],
    [28.83, 25.0], [31.45, 24.4], [34.11, 23.8], [36.80, 23.3], [39.52, 22.8], [42.26, 22.4], [45.02, 22.1], [47.81, 21.7],
    [50.61, 21.4], [53.42, 21.1], [56.25, 20.8], [59.09, 20.6], [61.93, 20.4], [64.77, 20.2]];
  var DSS43_TR = 13.2;   // receiver temperature in the same JPL table, K

  var api = { skyT: skyT, airMass: airMass, water: water, soil: soil, fresnel: fresnel, groundT: groundT, GROUNDS: GROUNDS,
    antennaTemp: antennaTemp, chain: chain, DSS43: DSS43, DSS43_TR: DSS43_TR, AZ: AZ };
  if (typeof module !== 'undefined') { module.exports = api; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  function K(v) { return (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)) + ' K'; }
  function deg(v) { return (v < 0 ? '−' : '') + Math.abs(Math.round(v)) + '°'; }

  function initScene(root) {
    var d = root.dataset;
    var st = { kind: d.antenna || 'dish', el: +(d.el || 45), g: d.ground || 'dry', pol: d.pol || 'h', p: +(d.taper || 1),
      dl: +(d.dl || 30), s: +(d.spill || 0) / 100 };
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var paintK = RA.toggle(controls, 'Antenna', [['iso', 'Isotropic'], ['dipole', 'Vertical half-wave dipole'], ['dish', 'Dish']],
      function () { return st.kind; }, function (v) { st.kind = v; update(true); });
    var paintG = RA.toggle(controls, 'Below the horizon', GROUNDS.map(function (g) { return [g[0], g[1]]; }),
      function () { return st.g; }, function (v) { st.g = v; update(true); });
    var polBox = RA.el('div', { class: 'ra-controls' }, controls);
    polBox.style.margin = '0';
    var paintP = RA.toggle(polBox, 'Polarization', [['h', 'Horizontal'], ['v', 'Vertical'], ['avg', 'Average of the two']],
      function () { return st.pol; }, function (v) { st.pol = v; update(true); });
    var dishBox = RA.el('div', { class: 'ra-controls' }, controls);
    dishBox.style.margin = '0';
    var elInput = RA.slider(dishBox, { label: 'Pointing elevation', min: -90, max: 90, step: 1, value: st.el, fmt: deg,
      onInput: function (v) { st.el = v; update(false); } });
    var paintT = RA.toggle(dishBox, 'Taper', ['Uniform', 'Parabolic', 'Parabolic²'].map(function (t, i) { return [i, t]; }),
      function () { return st.p; }, function (v) { st.p = v; update(true); });
    RA.slider(dishBox, { label: '<i>d</i>/<i>λ</i>', min: 0, max: 1, step: 'any', value: Math.log(st.dl / 2) / Math.log(60),
      fmt: function (s) { return sig(2 * Math.pow(60, s), 3); }, onInput: function (s) { st.dl = 2 * Math.pow(60, s); update(true); } });
    RA.slider(dishBox, { label: 'Spillover', min: 0, max: 10, step: 0.5, value: st.s * 100, fmt: function (v) { return v + '%'; },
      onInput: function (v) { st.s = v / 100; update(true); } });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var cutBox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, cutBox, 'Scene brightness and the pattern');
    var C = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', role: 'img' }, cutBox), cTitle = svg('title', {}, C);
    svg('path', { d: 'M -1.05 0 A 1.05 1.05 0 0 1 1.05 0 Z', fill: 'var(--accent)', 'fill-opacity': 0.07 }, C);
    var gnd = svg('path', { d: 'M -1.05 0 A 1.05 1.05 0 0 0 1.05 0 Z', fill: 'var(--ra-warm)', 'fill-opacity': 0.1 }, C);
    [0.25, 0.5, 0.75, 1].forEach(function (r) {
      svg('circle', { cx: 0, cy: 0, r: r, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.14, 'stroke-width': 0.006 }, C);
    });
    svg('line', { x1: -1.15, x2: 1.15, y1: 0, y2: 0, stroke: 'currentColor', 'stroke-opacity': 0.5, 'stroke-width': 0.008 }, C);
    var labs = [[0, -1.16, 'zenith'], [0, 1.22, 'nadir'], [1.2, 0.03, 'horizon']];
    labs.forEach(function (l) {
      svg('text', { x: l[0], y: l[1], 'font-size': 0.07, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, C).textContent = l[2];
    });
    svg('text', { x: -1.25, y: -1.17, 'font-size': 0.065, fill: 'var(--ra-warm)' }, C).textContent = 'brightness, ring = 100 K';
    svg('text', { x: -1.25, y: -1.08, 'font-size': 0.065, fill: 'var(--accent)' }, C).textContent = 'pattern, dB (40 dB range)';
    var cTB = svg('path', { fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 0.016 }, C);
    var cPat = svg('path', { fill: 'var(--accent)', 'fill-opacity': 0.22, stroke: 'var(--accent)', 'stroke-width': 0.014 }, C);

    var P = RA.plotBox(stage, 'Antenna temperature against pointing');
    var pLayer = svg('g', {}, P.S);
    var rows = RA.readout(stage, [['ta', '<i>T</i><sub>A</sub>'], ['sky', 'from the sky'], ['gnd', 'from the ground or sea'],
      ['tb', 'Brightness straight ahead'], ['d0', '<i>D</i><sub>0</sub>']]);

    var curve = null;
    function update(all) {
      paintK(); paintG(); paintP(); paintT();
      var dish = st.kind === 'dish';
      dishBox.style.display = dish ? '' : 'none';
      polBox.style.display = st.kind === 'dipole' ? 'none' : '';
      var pol = st.kind === 'dipole' ? 'v' : st.pol, TB = brightness(st.g, pol);
      var r = antennaTemp(st);
      if (all || !curve) {
        curve = [];
        if (dish) for (var e = -90; e <= 90; e += 3) curve.push([e, antennaTemp(Object.assign({}, st, { el: e })).TA]);
        else curve = [[-90, r.TA], [90, r.TA]];
      }

      // scene polar plot: angle = elevation (0 at the right horizon, counter-clockwise), radius = brightness / 400 K
      var tb = [], pat = [];
      for (var i = 0; i <= 720; i++) {
        var a = 2 * PI * i / 720, el = Math.asin(Math.sin(a));   // a in 0..2pi: right half then left half mirrored
        var R = Math.min(1.05, TB(el) / 400);
        tb.push((i ? 'L' : 'M') + (R * Math.cos(a)).toFixed(4) + ' ' + (-R * Math.sin(a)).toFixed(4));
        var u;
        if (st.kind === 'iso') u = 1;
        else if (st.kind === 'dipole') u = DIP(el);
        else {
          var be = st.el * DEG, psi = Math.acos(Math.max(-1, Math.min(1, Math.cos(a) * Math.cos(be) + Math.sin(a) * Math.sin(be))));
          // relative to the peak directivity (1 - s) D0: f^2 in front, 2 s / ((1 - s) D0) behind
          var D = dishTable(st.p, st.dl), f = BSA.dishField(st.p, PI * st.dl * Math.sin(psi));
          u = psi < PI / 2 ? f * f : 2 * st.s / ((1 - st.s) * D.D0);
        }
        var q = u > 1e-4 ? 1 + Math.log10(u) / 4 : 0;
        pat.push((i ? 'L' : 'M') + (q * Math.cos(a)).toFixed(4) + ' ' + (-q * Math.sin(a)).toFixed(4));
      }
      cTB.setAttribute('d', tb.join('') + 'Z');
      cPat.setAttribute('d', pat.join('') + 'Z');
      cTitle.textContent = 'Brightness of the scene in each direction of the vertical plane, sky above and ' +
        GROUNDS.filter(function (g) { return g[0] === st.g; })[0][1].toLowerCase() + ' below, with the antenna pattern in dB on top.' +
        ' Antenna temperature ' + K(r.TA) + '.';

      // T_A against pointing, with JPL's DSS-43 system temperature minus its receiver
      pLayer.textContent = '';
      var hi = Math.max(60, Math.max.apply(null, curve.map(function (c) { return c[1]; })) * 1.1);
      var Ty = hi > 200 ? [0, 100, 200, 300] : [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200].filter(function (v) { return v <= hi; });
      var F = RA.frame(pLayer, [-90, 90], [0, Ty[Ty.length - 1] * (hi > 200 ? 1 : 1.05)], [-90, -60, -30, 0, 30, 60, 90], Ty,
        'pointing elevation', 'K', deg, String);
      var line = [];
      for (var e2 = -90; e2 <= 90; e2 += 1) line.push([e2, TB(e2 * DEG)]);
      svg('path', { d: RA.path(line, F), fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 1.4, 'stroke-dasharray': '5 3' }, pLayer);
      svg('path', { d: RA.path(curve, F), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.2 }, pLayer);
      DSS43.forEach(function (q) {
        svg('circle', { cx: F.X(q[0]), cy: F.clampY(F.Y(q[1] - DSS43_TR)), r: 2.2, fill: 'none', stroke: 'currentColor', 'stroke-width': 1 }, pLayer);
      });
      if (dish) svg('circle', { cx: F.X(st.el), cy: F.clampY(F.Y(r.TA)), r: 3.8, fill: 'var(--accent)' }, pLayer);
      RA.legend(pLayer, 150, 70, [[{ stroke: 'var(--accent)', 'stroke-width': 3 }, 'T_A, this antenna'],
        [{ stroke: 'var(--ra-warm)', 'stroke-width': 2, 'stroke-dasharray': '5 3' }, 'brightness straight ahead']]);
      svg('circle', { cx: 158, cy: 93, r: 2.2, fill: 'none', stroke: 'currentColor' }, pLayer);
      svg('text', { x: 170, y: 96, 'font-size': 9.5, fill: 'currentColor' }, pLayer).textContent = 'DSS-43, minus receiver (JPL)';
      P.title.textContent = 'Antenna temperature against pointing elevation for this antenna, the brightness straight ahead, and JPL\'s ' +
        'DSS-43 system temperature minus its 13.2 K receiver over a 1996 Voyager pass.';

      rows.ta.td.textContent = K(r.TA);
      rows.sky.td.textContent = K(r.sky);
      rows.gnd.td.textContent = K(r.ground);
      rows.tb.th.parentNode.style.display = dish ? '' : 'none';
      rows.tb.td.textContent = K(TB(st.el * DEG));
      rows.d0.td.textContent = sig(r.D0, 4) + ' = ' + (10 * Math.log10(r.D0)).toFixed(2) + ' dBi';
    }
    update(true);
  }

  var PRESETS = {
    dss43: { TA: 7.92, eA: 1, Tp: 290, LdB: 0, T0: 290, Tr: 13.2 },
    xband: { TA: 60, eA: 0.95, Tp: 290, LdB: 0.5, T0: 290, Tr: 75 },
    small: { TA: 50, eA: 0.5, Tp: 290, LdB: 0, T0: 290, Tr: 100 }
  };
  function initChain(root) {
    var c = Object.assign({}, PRESETS[root.dataset.preset || 'xband']), preset = root.dataset.preset || 'xband';
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root), inputs = {};
    var paintPre = RA.toggle(controls, 'Preset', [['dss43', 'DSS-43 on Voyager'], ['xband', 'Waveguide-fed dish'], ['small', 'Small lossy antenna']],
      function () { return preset; }, function (v) {
        preset = v; c = Object.assign({}, PRESETS[v]);
        Object.keys(inputs).forEach(function (k) { inputs[k].value = c[k]; inputs[k].dispatchEvent(new Event('input')); });
        preset = v; update();
      });
    function sl(k, label, min, max, step, fmt) {
      inputs[k] = RA.slider(controls, { label: label, min: min, max: max, step: step, value: c[k], fmt: fmt,
        onInput: function (v) { c[k] = v; preset = null; update(); } });
    }
    sl('TA', '<i>T</i><sub>A</sub> of the scene', 2, 300, 0.1, K);
    sl('eA', 'Antenna efficiency <i>e</i><sub>A</sub>', 0.2, 1, 0.01, function (v) { return Math.round(v * 100) + '%'; });
    sl('Tp', 'Antenna at <i>T</i><sub>p</sub>', 4, 330, 1, K);
    sl('LdB', 'Line loss', 0, 3, 0.05, function (v) { return v.toFixed(2) + ' dB'; });
    sl('T0', 'Line at <i>T</i><sub>0</sub>', 4, 330, 1, K);
    sl('Tr', 'Receiver <i>T</i><sub>r</sub>', 2, 500, 0.1, K);

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var A = RA.plotBox(stage, 'Noise temperature along the chain');
    var aLayer = svg('g', {}, A.S);
    var B = RA.plotBox(stage, 'At the receiver, against antenna efficiency');
    var bLayer = svg('g', {}, B.S);
    var rows = RA.readout(stage, [['ant', 'After the antenna\'s loss'], ['ta', '<i>T</i><sub>a</sub> at the receiver'],
      ['ts', '<i>T</i><sub>s</sub> = <i>T</i><sub>a</sub> + <i>T</i><sub>r</sub>'], ['tab', 'Balanis eq. (2-146), <i>T</i><sub>a</sub>'],
      ['diff', 'Difference'], ['ref', '<i>T</i><sub>s</sub> referred to a lossless antenna']]);

    function update() {
      paintPre();
      var r = chain(c);
      // waterfall in K: scene, antenna loss, line, receiver, T_s; Balanis's levels as a dashed warm step
      aLayer.textContent = '';
      var lv = [['scene', 0, c.TA], ['antenna', c.TA, r.ant], ['line', r.ant, r.Ta], ['receiver', r.Ta, r.Ts], ['Tₛ', 0, r.Ts]];
      var lb = [c.TA, r.antB, r.TaB, r.TsB, r.TsB];
      var top = Math.max(r.Ts, r.TsB) * 1.12, step = RA.niceStep(top, 4), ticks = [];
      for (var v = 0; v <= top; v += step) ticks.push(v);
      var F = RA.frame(aLayer, [0, 5], [0, top], [], ticks, '', 'K', String, String);
      lv.forEach(function (q, i) {
        var x0 = F.X(i + 0.15), x1 = F.X(i + 0.85), ya = F.Y(q[1]), yb = F.Y(q[2]), ends = i === 0 || i === 4;
        var col = ends ? 'currentColor' : q[2] >= q[1] ? 'var(--accent)' : 'var(--ra-warm)';
        svg('rect', { x: x0, y: Math.min(ya, yb), width: x1 - x0, height: Math.max(1, Math.abs(yb - ya)), fill: col, 'fill-opacity': ends ? 0.5 : 0.75 }, aLayer);
        svg('line', { x1: x0, x2: x1, y1: F.Y(lb[i]), y2: F.Y(lb[i]), stroke: 'var(--ra-warm)', 'stroke-width': 1.6, 'stroke-dasharray': '4 2' }, aLayer);
        svg('text', { x: (x0 + x1) / 2, y: 189, 'font-size': 9, 'text-anchor': 'middle', fill: 'currentColor' }, aLayer).textContent = q[0];
        svg('text', { x: (x0 + x1) / 2, y: Math.max(20, Math.min(ya, yb, F.Y(lb[i])) - 4), 'font-size': 8.5, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.85 }, aLayer)
          .textContent = (ends ? '' : q[2] >= q[1] ? '+' : '−') + (ends ? q[2] : Math.abs(q[2] - q[1])).toFixed(1);
      });
      RA.legend(aLayer, 150, 12, [[{ stroke: 'var(--ra-warm)', 'stroke-width': 2, 'stroke-dasharray': '4 2' }, 'Balanis (2-146)']]);
      A.title.textContent = 'Noise temperature after each part: scene ' + K(c.TA) + ', after the antenna ' + K(r.ant) + ', at the receiver ' +
        K(r.Ta) + ', system ' + K(r.Ts) + '. Balanis eq. (2-146) gives ' + K(r.TaB) + ' at the receiver.';

      // T_a against e_A, both forms
      bLayer.textContent = '';
      var pts = [], ptsB = [];
      for (var e = 0.2; e <= 1.0001; e += 0.01) {
        pts.push([e, chain(Object.assign({}, c, { eA: e })).Ta]);
        ptsB.push([e, chain(Object.assign({}, c, { eA: e })).TaB]);
      }
      var mx = Math.max.apply(null, ptsB.map(function (q) { return q[1]; })) * 1.05, st2 = RA.niceStep(mx, 4), t2 = [];
      for (var w = 0; w <= mx; w += st2) t2.push(w);
      var G = RA.frame(bLayer, [0.2, 1], [0, mx], [0.2, 0.4, 0.6, 0.8, 1], t2, 'antenna efficiency eA', 'K',
        function (v) { return Math.round(v * 100) + '%'; }, String);
      svg('path', { d: RA.path(ptsB, G), fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 1.6, 'stroke-dasharray': '5 3' }, bLayer);
      svg('path', { d: RA.path(pts, G), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.2 }, bLayer);
      svg('circle', { cx: G.X(c.eA), cy: G.clampY(G.Y(r.Ta)), r: 3.8, fill: 'var(--accent)' }, bLayer);
      RA.legend(bLayer, 140, 12, [[{ stroke: 'var(--accent)', 'stroke-width': 3 }, 'each loss as t T + (1 − t) T'],
        [{ stroke: 'var(--ra-warm)', 'stroke-width': 2, 'stroke-dasharray': '5 3' }, 'Balanis (2-146)']]);
      B.title.textContent = 'Antenna temperature at the receiver against antenna efficiency, consistent form and Balanis eq. (2-146); they part as 1 over e_A.';

      rows.ant.td.textContent = K(r.ant);
      rows.ta.td.textContent = K(r.Ta);
      rows.ts.td.textContent = K(r.Ts);
      rows.tab.td.textContent = K(r.TaB);
      rows.diff.td.textContent = (r.TaB - r.Ta >= 0 ? '+' : '−') + K(Math.abs(r.TaB - r.Ta)) + ' (' + sig(100 * (r.TaB - r.Ta) / r.Ta, 2) + '%)';
      rows.ref.td.textContent = K(r.lossless);
    }
    update();
  }

  document.querySelectorAll('[data-widget="antenna-temperature"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    (root.dataset.case === 'chain' ? initChain : initScene)(root);
  });
})();
