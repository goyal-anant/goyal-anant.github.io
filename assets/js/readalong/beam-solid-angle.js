// beam-solid-angle: directivity as 4 pi over the beam solid angle, and how well the beamwidth formulas guess it.
// Four pattern families, all symmetric about their axis:
//   cosn     U = cos^n(theta) on the upper hemisphere, one lobe (Balanis eq. 2-31, Table 2.1)
//   twolobe  U = |cos(theta)|^n on the whole sphere, two equal lobes
//   sinn     U = |sin(theta)|^n, omnidirectional (Balanis eq. 2-32); its angle t is the elevation off the horizon
//   dish     circular aperture of diameter d lit as (1 - rho^2)^p, p = 0, 1, 2, radiating into the front half only
// Panel 1 plots U against the solid angle enclosed (square degrees), so the area under the curve is the power and the
// box of the same area at full height has width Omega_A. Panel 2 is each formula's error against the HPBW.
// Markup from _includes/readalong/beam-solid-angle.html; helpers from readalong.js (window.RA). The maths at the top
// has no DOM and is also run under node by content/balanis/checks/beam_solid_angle.py.
(function () {
  var PI = Math.PI, DEG = PI / 180, SQDEG = Math.pow(180 / PI, 2);
  var NEXRAD = 8.54 * 2.85e9 / 299792458;   // d / lambda of the NEXRAD dish at 2.85 GHz
  var TAPERS = ['Uniform', 'Parabolic', 'Parabolic²'];

  // Bessel J_n(x) from its integral, (1/pi) times the integral over [0, pi] of cos(n t - x sin t), Simpson's rule
  // with about two points per radian of x, so large arguments (big dishes, far side lobes) stay resolved
  function besselJ(n, x) {
    var N = 200 + 2 * Math.ceil(x), h = PI / N, s = 0;
    for (var i = 0; i <= N; i++) {
      var t = i * h, w = i === 0 || i === N ? 1 : i % 2 ? 4 : 2;
      s += w * Math.cos(n * t - x * Math.sin(t));
    }
    return s * h / 3 / PI;
  }
  // Field of the dish, 1 on axis: 2^(p+1) (p+1)! J_(p+1)(u) / u^(p+1), u = (pi d / lambda) sin(theta).
  // Tabulated once per taper (step 0.01 in u) and read by linear interpolation.
  var FACT = [1, 1, 2, 6], DU = 0.01, UMAX = 400, tables = {};
  function dishField(p, u) {
    u = Math.abs(u);
    var tab = tables[p];
    if (!tab) {
      tab = tables[p] = new Float64Array(Math.ceil(UMAX / DU) + 2);
      for (var j = 0; j < tab.length; j++) {
        var x = j * DU;
        tab[j] = j === 0 ? 1 : Math.pow(2, p + 1) * FACT[p + 1] * besselJ(p + 1, x) / Math.pow(x, p + 1);
      }
    }
    var k = u / DU, i = Math.floor(k), f = k - i;
    return tab[i] * (1 - f) + tab[i + 1] * f;
  }
  function bisect(g, a, b) {
    var ga = g(a);
    for (var i = 0; i < 60; i++) {
      var m = (a + b) / 2, gm = g(m);
      if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m;
    }
    return (a + b) / 2;
  }

  // A pattern as a function of its angle t (radians, 0 on the beam peak): U(t), the weight w(t) = dOmega/dt, the
  // solid angle enclosed Omega(t), the full HPBW (radians), and U(theta) over the whole cut for the polar plot.
  // fam: family name; n: exponent (cosn, twolobe, sinn); p, dl: taper and d / lambda (dish).
  function pattern(fam, n, p, dl) {
    var P = { fam: fam, tMax: PI / 2 };
    if (fam === 'dish') {
      var a = PI * dl;
      P.U = function (t) { var f = dishField(p, a * Math.sin(t)); return f * f; };
      P.cut = function (th) { return Math.cos(th) > 0 ? P.U(th) : 0; };
      P.half = Math.asin(bisect(function (u) { var f = dishField(p, u); return f * f - 0.5; }, 0.1, 3) / a);
      P.N = Math.max(4000, 2 * Math.ceil(a / 0.04));
    } else {
      P.U = function (t) { return Math.pow(Math.cos(t), n); };
      P.half = Math.acos(Math.pow(0.5, 1 / n));
      P.N = 4000;
      P.cut = fam === 'cosn' ? function (th) { return Math.cos(th) > 0 ? Math.pow(Math.cos(th), n) : 0; }
        : fam === 'twolobe' ? function (th) { return Math.pow(Math.abs(Math.cos(th)), n); }
        : function (th) { return Math.pow(Math.abs(Math.sin(th)), n); };
    }
    if (fam === 'sinn') {
      P.w = function (t) { return 4 * PI * Math.cos(t); };
      P.omega = function (t) { return 4 * PI * Math.sin(t); };
      P.tOf = function (om) { return Math.asin(Math.min(1, om / (4 * PI))); };
    } else {
      var k = fam === 'twolobe' ? 4 * PI : 2 * PI;
      P.w = function (t) { return k * Math.sin(t); };
      P.omega = function (t) { return k * (1 - Math.cos(t)); };
      P.tOf = function (om) { return Math.acos(Math.max(0, 1 - om / k)); };
    }
    P.hpbw = 2 * P.half;
    return P;
  }
  // Beam solid angle (steradians): the integral of U dOmega by Simpson's rule
  function beamSolidAngle(P) {
    var N = P.N, h = P.tMax / N, s = 0;
    for (var i = 0; i <= N; i++) {
      var t = i * h, wt = i === 0 || i === N ? 1 : i % 2 ? 4 : 2;
      s += wt * P.U(t) * P.w(t);
    }
    return s * h / 3;
  }
  // Exact D0 and the two estimates from the HPBW: Kraus (2-26) and Tai and Pereira (2-30a) for beams with a
  // peak on an axis (round beam, so both planes have the same HPBW); McDonald (2-33a) and Pozar (2-33b) for omni.
  function directivity(P) {
    var omegaA = beamSolidAngle(P), H = P.hpbw, Hd = H / DEG, est;
    if (P.fam === 'sinn') est = [
      { name: 'McDonald', D: 101 / (Hd - 0.0027 * Hd * Hd) },
      { name: 'Pozar', D: -172.4 + 191 * Math.sqrt(0.818 + 1 / Hd) }];
    else est = [
      { name: 'Kraus', D: 4 * PI / (H * H) },
      { name: 'Tai–Pereira', D: 16 * Math.LN2 / (H * H) }];
    var D0 = 4 * PI / omegaA;
    est.forEach(function (e) { e.err = 100 * (e.D / D0 - 1); });
    return { D0: D0, omegaA: omegaA, hpbwDeg: Hd, est: est };
  }
  // Error curves against HPBW for one family: n from 1 to 450, or d / lambda from 2 to 120 for the dish
  var curves = {};
  function errorCurves(fam, p) {
    var key = fam + p;
    if (curves[key]) return curves[key];
    var out = [[], []], M = fam === 'dish' ? 48 : 90;
    for (var i = 0; i <= M; i++) {
      var s = i / M, d = fam === 'dish' ? directivity(pattern(fam, 0, p, 2 * Math.pow(60, s)))
        : directivity(pattern(fam, Math.pow(450, s)));
      out[0].push([d.hpbwDeg, d.est[0].err]); out[1].push([d.hpbwDeg, d.est[1].err]);
    }
    return (curves[key] = out);
  }

  var api = { pattern: pattern, directivity: directivity, errorCurves: errorCurves, dishField: dishField, bisect: bisect, NEXRAD: NEXRAD };
  if (typeof module !== 'undefined') { module.exports = api; return; }
  window.BeamSolidAngle = api;   // grid-directivity reuses the patterns and their exact D0

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg;
  var readout = RA.readout, toggle = RA.toggle, sig = RA.sig, signed = RA.signed, niceStep = RA.niceStep;
  var frame = RA.frame, path = RA.path, plotBox = RA.plotBox, legend = RA.legend;
  function dB(v) { return 10 * Math.log10(v); }

  var FAMS = [['cosn', 'cosⁿθ, one lobe'], ['twolobe', 'cosⁿθ, two lobes'], ['sinn', 'sinⁿθ, omni'], ['dish', 'Dish']];
  var STYLE = [{ stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-dasharray': '5 3' },
    { stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-dasharray': '1.5 2.5' }];

  function init(root) {
    var d = root.dataset;
    var fam = d.family || 'cosn', n = +(d.n || 5), p = +(d.taper || 1), dl = d.dl === 'nexrad' ? NEXRAD : +(d.dl || 20);
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var paintF = toggle(controls, 'Pattern', FAMS, function () { return fam; }, function (v) { fam = v; update(); });
    var nBox = RA.el('div', { class: 'ra-controls' }, controls), dishBox = RA.el('div', { class: 'ra-controls' }, controls);
    nBox.style.margin = dishBox.style.margin = '0';
    RA.slider(nBox, { label: '<i>n</i>', min: 0, max: 1, step: 'any', value: Math.log(n) / Math.log(450),
      fmt: function (s) { return sig(Math.pow(450, s), 3); }, onInput: function (s) { n = Math.pow(450, s); update(); } });
    var paintT = toggle(dishBox, 'Taper', TAPERS.map(function (t, i) { return [i, t]; }), function () { return p; }, function (v) { p = v; update(); });
    var dlInput = RA.slider(dishBox, { label: '<i>d</i>/<i>λ</i>', min: 0, max: 1, step: 'any', value: Math.log(dl / 2) / Math.log(60),
      fmt: function (s) { return sig(2 * Math.pow(60, s), 3); }, onInput: function (s) { dl = 2 * Math.pow(60, s); update(); } });
    var nex = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, dishBox, 'NEXRAD dish');
    nex.addEventListener('click', function () {
      p = 1; dlInput.value = Math.log(NEXRAD / 2) / Math.log(60);
      dlInput.dispatchEvent(new Event('input'));
    });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    // polar cut of the power pattern, linear, with the box (same power at full height) as a sector
    var cutBox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, cutBox, 'Pattern cut, linear power');
    var C = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', role: 'img' }, cutBox), cTitle = svg('title', {}, C);
    RA.polarGrid(C, [{ r: 0.5, label: '0.5' }, { r: 1 }], function (a) { return (a <= 180 ? a : 360 - a) + '°'; }, { up: 'z', right: 'x' });
    var cBoxPath = svg('path', { fill: 'var(--ra-warm)', 'fill-opacity': 0.12, stroke: 'var(--ra-warm)', 'stroke-width': 0.012, 'stroke-dasharray': '0.04 0.03' }, C);
    var cPat = svg('path', { fill: 'var(--accent)', 'fill-opacity': 0.25, stroke: 'var(--accent)', 'stroke-width': 0.015 }, C);

    var A = plotBox(stage, 'Bell and box: power is the area');
    var bellLayer = svg('g', {}, A.S);
    var rows = readout(stage, [['hp', 'HPBW'], ['ex', 'Exact <i>D</i><sub>0</sub>'], ['e0', ''], ['e1', ''], ['om', 'Beam solid angle'], ['sky', 'Share of the sky']]);
    var E = plotBox(stage, 'Error of the formula against the exact value');
    var errLayer = svg('g', {}, E.S);

    function update() {
      paintF(); paintT();
      nex.setAttribute('aria-pressed', String(p === 1 && Math.abs(dl - NEXRAD) < 0.05));   // pressed while on the NEXRAD preset
      nBox.style.display = fam === 'dish' ? 'none' : ''; dishBox.style.display = fam === 'dish' ? '' : 'none';
      var P = pattern(fam, n, p, dl), r = directivity(P), omA = r.omegaA;

      // polar cut: U(theta) over the full circle, theta from z, clockwise on screen
      var pts = [];
      for (var i = 0; i <= 1440; i++) {
        var th = 2 * PI * i / 1440, u = P.cut(th);
        pts.push((i ? 'L' : 'M') + (u * Math.sin(th)).toFixed(4) + ' ' + (-u * Math.cos(th)).toFixed(4));
      }
      cPat.setAttribute('d', pts.join('') + 'Z');
      var tA = P.tOf(omA), sector = function (c, h) {   // sector of radius 1 centred on direction c, half-angle h
        var a = c - h, b = c + h;
        return 'M0 0L' + Math.sin(a).toFixed(4) + ' ' + (-Math.cos(a)).toFixed(4) + 'A1 1 0 ' + (2 * h > PI ? 1 : 0) + ' 1 ' +
          Math.sin(b).toFixed(4) + ' ' + (-Math.cos(b)).toFixed(4) + 'Z';
      };
      cBoxPath.setAttribute('d', fam === 'sinn' ? sector(PI / 2, tA) + sector(3 * PI / 2, tA)
        : fam === 'twolobe' ? sector(0, tA) + sector(PI, tA) : sector(0, tA));
      cTitle.textContent = 'Polar cut of the power pattern with the box of the same power at full height, ' +
        (fam === 'sinn' ? 'a band ±' : 'a cone of half-angle ') + sig(tA / DEG, 3) + ' degrees' + (fam === 'sinn' ? ' around the horizon.' : '.');

      // bell and box: U against the solid angle enclosed, in square degrees
      bellLayer.textContent = '';
      var boxes = [omA].concat(r.est.map(function (e) { return 4 * PI / e.D; })).map(function (o) { return o * SQDEG; });
      var full = P.omega(P.tMax) * SQDEG, xmax = Math.min(full, 2.2 * Math.max.apply(null, boxes));
      var step = niceStep(xmax, 4), ticks = [];
      for (var x = 0; x <= xmax + 1e-9; x += step) ticks.push(x);
      var F = frame(bellLayer, [0, xmax], [0, 1.15], ticks, [0, 0.5, 1], 'solid angle inside (square degrees)', 'U / Umax',
        function (v) { return v ? sig(v, 3) : '0'; }, function (v) { return v; });
      var tX = P.tOf(xmax / SQDEG), bell = [];
      for (var j = 0; j <= 500; j++) { var t = tX * j / 500; bell.push([P.omega(t) * SQDEG, P.U(t)]); }
      svg('rect', { x: F.X(0), y: F.Y(1), width: F.X(boxes[0]) - F.X(0), height: F.Y(0) - F.Y(1), fill: 'var(--ra-warm)', 'fill-opacity': 0.12, stroke: 'var(--ra-warm)', 'stroke-width': 1.5 }, bellLayer);
      svg('path', { d: path(bell, F) + 'L' + F.X(bell[bell.length - 1][0]) + ' ' + F.Y(0) + 'L' + F.X(0) + ' ' + F.Y(0) + 'Z', fill: 'var(--accent)', 'fill-opacity': 0.25, stroke: 'var(--accent)', 'stroke-width': 2 }, bellLayer);
      r.est.forEach(function (e, k) {
        var xx = F.clampX(F.X(boxes[k + 1]));
        svg('path', Object.assign({ d: 'M' + F.X(0) + ' ' + F.Y(1) + 'L' + xx + ' ' + F.Y(1) + 'L' + xx + ' ' + F.Y(0), fill: 'none' }, STYLE[k]), bellLayer);
      });
      legend(bellLayer, 195, 40, [[{ stroke: 'var(--accent)', 'stroke-width': 3 }, 'the pattern'],
        [{ stroke: 'var(--ra-warm)', 'stroke-width': 3 }, 'box, same area'],
        [STYLE[0], r.est[0].name + ' box'], [STYLE[1], r.est[1].name + ' box']]);
      A.title.textContent = 'Radiation intensity against the solid angle it fills. The box of the same area at full height is ' +
        sig(boxes[0], 3) + ' square degrees wide; the ' + r.est[0].name + ' box is ' + sig(boxes[1], 3) + ' and the ' + r.est[1].name + ' box ' + sig(boxes[2], 3) + '.';

      // error against HPBW, log axis
      errLayer.textContent = '';
      var cv = errorCurves(fam, p), ys = [];
      cv.forEach(function (c) { c.forEach(function (q) { ys.push(q[1]); }); });
      r.est.forEach(function (e) { ys.push(e.err); });
      var ylo = Math.min(0, Math.min.apply(null, ys)), yhi = Math.max(0, Math.max.apply(null, ys)), ys2 = niceStep(yhi - ylo, 5);
      ylo = Math.floor(ylo / ys2) * ys2; yhi = Math.ceil(yhi / ys2) * ys2;
      var yt = [];
      for (var y = ylo; y <= yhi + 1e-9; y += ys2) yt.push(y);
      var G = frame(errLayer, [0.5, 180], [ylo, yhi], [1, 3, 10, 30, 100, 180], yt, 'HPBW (degrees, log scale)', 'error %',
        function (v) { return v; }, function (v) { return signed(v, 0); }, true);
      cv.forEach(function (c, k) { svg('path', Object.assign({ d: path(c, G), fill: 'none' }, STYLE[k]), errLayer); });
      r.est.forEach(function (e, k) {
        svg('circle', { cx: G.X(r.hpbwDeg), cy: G.clampY(G.Y(e.err)), r: 4, fill: k ? 'var(--bg, white)' : 'var(--accent)', stroke: 'var(--accent)', 'stroke-width': 1.5 }, errLayer);
      });
      legend(errLayer, 130, 12, [[STYLE[0], r.est[0].name]]); legend(errLayer, 215, 12, [[STYLE[1], r.est[1].name]]);
      E.title.textContent = 'Percentage error of ' + r.est[0].name + ' and ' + r.est[1].name + ' against the exact directivity, as the beam narrows. ' +
        'This pattern: ' + signed(r.est[0].err, 1) + '% and ' + signed(r.est[1].err, 1) + '%.';

      rows.hp.td.textContent = sig(r.hpbwDeg, 3) + '°';
      rows.ex.td.textContent = sig(r.D0, 4) + ' = ' + dB(r.D0).toFixed(2) + ' dBi';
      ['e0', 'e1'].forEach(function (k, i) {
        var e = r.est[i];
        rows[k].th.textContent = e.name;
        rows[k].td.textContent = sig(e.D, 4) + ' (' + signed(e.err, 1) + '%, ' + signed(dB(e.D / r.D0), 2) + ' dB)';
      });
      rows.om.td.textContent = sig(omA * SQDEG, 4) + ' deg² = ' + sig(omA, 3) + ' sr';
      rows.sky.td.textContent = '1 / ' + sig(r.D0, 4) + ' = ' + sig(100 / r.D0, 3) + '%';
    }
    update();
  }

  document.querySelectorAll('[data-widget="beam-solid-angle"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
