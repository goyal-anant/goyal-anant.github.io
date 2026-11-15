// area-budget: every lossless antenna collects from lambda^2 of area-times-solid-angle, however it spends it.
// A_e(theta) = (lambda^2 / 4 pi) D(theta) (Balanis eq. 2-110 read per direction), so the integral of A_e over the
// sphere is lambda^2 for every pattern: the isotropic antenna spreads it evenly, a dish puts nearly all of it into a
// pencil of solid angle. Patterns: isotropic, short dipole (sin^2), half-wave dipole (Balanis eq. 4-84) and the
// circular dish of beam-solid-angle.js ((1 - rho^2)^p taper, front half only).
// Panel 1: polar cut of A_e(theta), linear, with the isotropic circle. Panel 2: the budget curve, i.e. the share of
// lambda^2 collected by the directions where A_e is largest, against the solid angle they fill.
// Markup from _includes/readalong/area-budget.html; helpers from readalong.js (window.RA). The maths at the top has
// no DOM and is also run under node by content/balanis/checks/area_budget.py.
(function () {
  var PI = Math.PI, C0 = 299792458;
  var BSA = typeof module !== 'undefined' ? require('./beam-solid-angle.js') : window.BeamSolidAngle;
  var BANDS = [['fm', 'FM 100 MHz', 100e6], ['gps', 'GPS 1575 MHz', 1575.42e6], ['wifi', 'Wi-Fi 2.45 GHz', 2.45e9],
    ['nexrad', 'NEXRAD 2.85 GHz', 2.85e9], ['ku', 'Ku TV 12 GHz', 12e9]];

  // Power pattern U(theta), peak 1, on [0, tMax] with the solid-angle weight 2 pi sin(theta)
  function pattern(kind, p, dl) {
    if (kind === 'iso') return { U: function () { return 1; }, tMax: PI, N: 2000 };
    if (kind === 'short') return { U: function (t) { var s = Math.sin(t); return s * s; }, tMax: PI, N: 4000 };
    if (kind === 'half') return { U: function (t) {
      var s = Math.sin(t); if (s < 1e-9) return 0;
      var f = Math.cos(PI / 2 * Math.cos(t)) / s; return f * f;
    }, tMax: PI, N: 4000 };
    var P = BSA.pattern('dish', 0, p, dl);
    return { U: P.U, tMax: PI / 2, N: P.N };
  }
  // Midpoint samples, sorted by U from the largest down; returns D0 and the budget curve [solid angle, share]
  function budget(kind, p, dl) {
    var P = pattern(kind, p, dl), N = P.N, h = P.tMax / N, s = [], tot = 0, umax = 0;
    for (var i = 0; i < N; i++) {
      var t = (i + 0.5) * h, u = P.U(t), w = 2 * PI * Math.sin(t) * h;
      s.push([u, w]); tot += u * w; umax = Math.max(umax, u);
    }
    s.sort(function (a, b) { return b[0] - a[0]; });
    var om = 0, acc = 0, curve = [[0, 0]], half = null;
    s.forEach(function (q) {
      om += q[1]; acc += q[0] * q[1];
      if (half === null && acc >= tot / 2) half = om - (acc - tot / 2) / q[0];   // inside this strip, linearly
      curve.push([om, acc / tot]);
    });
    return { D0: 4 * PI * umax / tot, curve: curve, half: half, P: P, integral: acc / tot };
  }

  var api = { pattern: pattern, budget: budget, BANDS: BANDS };
  if (typeof module !== 'undefined') { module.exports = api; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  var KINDS = [['iso', 'Isotropic'], ['short', 'Short dipole'], ['half', 'Half-wave dipole'], ['dish', 'Dish']];
  var TAPERS = ['Uniform', 'Parabolic', 'Parabolic²'];
  function dB(v) { return 10 * Math.log10(v); }
  function area(m2) {   // m², cm² or mm², 3 significant figures
    if (m2 >= 1) return sig(m2, 3) + ' m²';
    if (m2 >= 1e-4) return sig(m2 * 1e4, 3) + ' cm²';
    return sig(m2 * 1e6, 3) + ' mm²';
  }
  function solid(sr) { return sr >= 0.1 ? sig(sr, 3) + ' sr' : sig(sr * Math.pow(180 / PI, 2), 3) + ' deg²'; }

  function init(root) {
    var d = root.dataset;
    var kind = d.pattern || 'half', band = d.band || 'wifi', p = +(d.taper || 1);
    var dl = d.dl === 'nexrad' ? BSA.NEXRAD : +(d.dl || 20);
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var paintK = RA.toggle(controls, 'Antenna', KINDS, function () { return kind; }, function (v) { kind = v; update(); });
    var paintB = RA.toggle(controls, 'Frequency', BANDS.map(function (b) { return [b[0], b[1]]; }), function () { return band; }, function (v) { band = v; update(); });
    var dishBox = RA.el('div', { class: 'ra-controls' }, controls);
    dishBox.style.margin = '0';
    var paintT = RA.toggle(dishBox, 'Taper', TAPERS.map(function (t, i) { return [i, t]; }), function () { return p; }, function (v) { p = v; update(); });
    var dlInput = RA.slider(dishBox, { label: '<i>d</i>/<i>λ</i>', min: 0, max: 1, step: 'any', value: Math.log(dl / 2) / Math.log(60),
      fmt: function (s) { return sig(2 * Math.pow(60, s), 3); }, onInput: function (s) { dl = 2 * Math.pow(60, s); update(); } });
    var nex = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, dishBox, 'NEXRAD dish');
    nex.addEventListener('click', function () {
      p = 1; band = 'nexrad'; dlInput.value = Math.log(BSA.NEXRAD / 2) / Math.log(60);
      dlInput.dispatchEvent(new Event('input'));
    });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var cutBox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, cutBox, 'Effective area against direction');
    var C = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', role: 'img' }, cutBox), cTitle = svg('title', {}, C);
    RA.polarGrid(C, [{ r: 0.5 }, { r: 1 }], function (a) { return (a <= 180 ? a : 360 - a) + '°'; }, { up: 'z', right: 'x' });
    var cPat = svg('path', { fill: 'var(--accent)', 'fill-opacity': 0.25, stroke: 'var(--accent)', 'stroke-width': 0.015 }, C);
    var cIso = svg('circle', { cx: 0, cy: 0, fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 0.014, 'stroke-dasharray': '0.04 0.03' }, C);
    var cLab = svg('text', { x: 0, y: 1.27, 'font-size': 0.075, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.8 }, C);

    var B = RA.plotBox(stage, 'The budget: share of λ² collected');
    var bLayer = svg('g', {}, B.S);
    var rows = RA.readout(stage, [['lam', '<i>λ</i>'], ['iso', 'Isotropic, <i>λ</i>²/4π'], ['d0', '<i>D</i><sub>0</sub>'],
      ['aem', '<i>A</i><sub>em</sub> = <i>λ</i>²<i>D</i><sub>0</sub>/4π'], ['int', '∫<i>A</i><sub>e</sub> dΩ'], ['half', 'Half of it from'],
      ['ap', 'Dish face'], ['eap', 'Aperture efficiency']]);

    var isoCurve = budget('iso').curve;
    function update() {
      paintK(); paintB(); paintT();
      dishBox.style.display = kind === 'dish' ? '' : 'none';
      nex.setAttribute('aria-pressed', String(p === 1 && band === 'nexrad' && Math.abs(dl - BSA.NEXRAD) < 0.05));
      var f = BANDS.filter(function (b) { return b[0] === band; })[0][2], lam = C0 / f, iso = lam * lam / (4 * PI);
      var r = budget(kind, p, dl), aem = iso * r.D0;

      // polar cut, radius 1 = the peak area; theta from z, clockwise on screen, mirrored to the left half
      var pts = [];
      for (var i = 0; i <= 1440; i++) {
        var th = 2 * PI * i / 1440, t = th <= PI ? th : 2 * PI - th;
        var u = t <= r.P.tMax ? r.P.U(t) : 0;
        pts.push((i ? 'L' : 'M') + (u * Math.sin(th)).toFixed(4) + ' ' + (-u * Math.cos(th)).toFixed(4));
      }
      cPat.setAttribute('d', pts.join('') + 'Z');
      cIso.setAttribute('r', Math.max(1 / r.D0, 0.004));
      cLab.textContent = 'dashed: isotropic, ' + area(iso) + (r.D0 > 100 ? ', too small to see' : '');
      cTitle.textContent = 'Effective area against direction, linear, peak ' + area(aem) + ', against the isotropic circle of ' + area(iso) + '.';

      // budget curve: share collected against solid angle, log x from 1e-6 sr to 4 pi
      bLayer.textContent = '';
      var F = RA.frame(bLayer, [1e-6, 4 * PI], [0, 1], [1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 0.1, 1, 4 * PI], [0, 0.5, 1],
        'solid angle filled (sr, log scale)', 'share',
        function (v) { return v === 4 * PI ? '4π' : v >= 0.1 ? String(v) : '10' + String(Math.round(Math.log10(v))).replace('-', '⁻').replace(/\d/g, function (c) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]; }); },
        function (v) { return Math.round(100 * v) + '%'; }, true);
      var thin = function (c) {   // keep the path light: about 400 points spread evenly in log solid angle
        var out = [], next = 1e-6;
        c.forEach(function (q) { if (q[0] >= next) { out.push(q); next = q[0] * 1.03; } });
        out.push(c[c.length - 1]);
        return out;
      };
      svg('path', { d: RA.path(thin(isoCurve), F), fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 1.5, 'stroke-dasharray': '5 3' }, bLayer);
      svg('path', { d: RA.path(thin(r.curve), F), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.2 }, bLayer);
      svg('circle', { cx: F.X(r.half), cy: F.Y(0.5), r: 3.5, fill: 'var(--accent)' }, bLayer);
      RA.legend(bLayer, 140, 12, [[{ stroke: 'var(--accent)', 'stroke-width': 3 }, 'this antenna']]);
      RA.legend(bLayer, 225, 12, [[{ stroke: 'var(--ra-warm)', 'stroke-width': 2, 'stroke-dasharray': '5 3' }, 'isotropic']]);
      B.title.textContent = 'Share of the lambda-squared budget collected by the strongest directions, against the solid angle they fill. Half of it comes from ' + solid(r.half) + '.';

      rows.lam.td.textContent = lam >= 1 ? sig(lam, 3) + ' m' : sig(lam * 100, 3) + ' cm';
      rows.iso.td.textContent = area(iso);
      rows.d0.td.textContent = sig(r.D0, 4) + ' = ' + dB(r.D0).toFixed(2) + ' dBi';
      rows.aem.td.textContent = area(aem);
      rows.int.td.innerHTML = r.integral.toFixed(3) + ' <i>λ</i>² = ' + area(lam * lam * r.integral);
      rows.half.td.textContent = solid(r.half) + ' (' + sig(100 * r.half / (4 * PI), 2) + '% of the sky)';
      var show = kind === 'dish';
      rows.ap.th.parentNode.style.display = rows.eap.th.parentNode.style.display = show ? '' : 'none';
      if (show) {
        var dm = dl * lam, ap = PI * dm * dm / 4;
        rows.ap.td.textContent = (dm >= 1 ? sig(dm, 3) + ' m' : sig(dm * 100, 3) + ' cm') + ' across, ' + area(ap);
        rows.eap.td.textContent = sig(100 * aem / ap, 3) + '%';
      }
    }
    update();
  }

  document.querySelectorAll('[data-widget="area-budget"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
