// beam-resolution: beamwidth, side lobes and resolving two targets, on a circular dish the size of the NEXRAD
// weather radar (8.54 m, 2.7 to 3.0 GHz).
// view "taper": the dish lit with three tapers (1 - rho^2)^n, n = 0, 1, 2; the pattern in dB with HPBW, first nulls and
//   first side lobe (Balanis eq. 7-46 and Table 7.2).
// view "scan": two storm cells 100 km away; the beam sweeps across them and the trace is the receiver output against
//   where the beam points. Echoes add in power (rain) or in field (two point targets, in phase or in antiphase), over
//   the one-way or the two-way (radar) pattern.
// Markup from _includes/readalong/beam-resolution.html; helpers from readalong.js (window.RA). The maths at the top has
// no DOM and is also run under node by content/balanis/checks/beam_resolution.py.
(function () {
  var PI = Math.PI, DEG = PI / 180;
  var DISH = 8.54;       // m, NEXRAD reflector diameter
  var RANGE = 100;       // km, distance to the storm cells
  var C = 299792458;
  var TAPERS = ['Uniform', 'Parabolic', 'Parabolic²'];

  // Bessel J_n(x) from its integral, (1/pi) times the integral over [0, pi] of cos(n t - x sin t), by Simpson's rule
  function besselJ(n, x) {
    var N = 200, h = PI / N, s = 0;
    for (var i = 0; i <= N; i++) {
      var t = i * h, w = i === 0 || i === N ? 1 : i % 2 ? 4 : 2;
      s += w * Math.cos(n * t - x * Math.sin(t));
    }
    return s * h / 3 / PI;
  }
  var FACT = [1, 1, 2, 6];
  // Field pattern of a circular aperture lit as (1 - rho^2)^n, 1 on the axis: 2^(n+1) (n+1)! J_(n+1)(u) / u^(n+1),
  // with u = (pi D / lambda) sin(theta)
  function field(n, u) {
    u = Math.abs(u);
    if (u < 1e-6) return 1;
    return Math.pow(2, n + 1) * FACT[n + 1] * besselJ(n + 1, u) / Math.pow(u, n + 1);
  }
  function kD(f) { return PI * DISH * f / C; }           // pi D / lambda, f in Hz
  function angleOf(u, f) { return Math.asin(Math.min(1, u / kD(f))) / DEG; }   // degrees off the axis

  // root of g on [a, b] by bisection (g(a) and g(b) of opposite sign)
  function bisect(g, a, b) {
    var ga = g(a);
    for (var i = 0; i < 60; i++) {
      var m = (a + b) / 2, gm = g(m);
      if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m;
    }
    return (a + b) / 2;
  }
  var beams = {};
  // Beam numbers in u: half power (one-way and two-way), first null, first side lobe (power, linear), taper efficiency.
  function beamU(n) {
    if (beams[n]) return beams[n];
    var half = bisect(function (u) { return field(n, u) * field(n, u) - 0.5; }, 0.1, 4);
    var half2 = bisect(function (u) { return Math.pow(field(n, u), 4) - 0.5; }, 0.1, 4);
    var u = half, step = 0.01;
    while (field(n, u + step) > 0) u += step;
    var nul = bisect(function (v) { return field(n, v); }, u, u + step);
    var sll = 0;
    for (var v = nul; v < nul + 6; v += 0.005) sll = Math.max(sll, field(n, v) * field(n, v));
    // taper efficiency: (integral of a rho)^2 / (integral of a^2 rho) / (1/2), with a = (1 - rho^2)^n
    var eff = 2 * Math.pow(1 / (2 * (n + 1)), 2) / (1 / (2 * (2 * n + 1)));
    return (beams[n] = { half: half, half2: half2, nul: nul, sll: sll, eff: eff });
  }
  // The same in degrees at frequency f (Hz). hpbw and fnbw are full widths; hpbw2 is the two-way (radar) HPBW.
  function beam(n, f) {
    var b = beamU(n);
    return { hpbw: 2 * angleOf(b.half, f), hpbw2: 2 * angleOf(b.half2, f), fnbw: 2 * angleOf(b.nul, f),
      sllDb: 10 * Math.log10(b.sll), eff: b.eff, lamOverD: C / f / DISH / DEG };
  }

  // Receiver output when the beam points at az (degrees) and the two targets sit at -sep/2 and +sep/2 (degrees).
  // mode: 'rain' (powers add), 'in' or 'anti' (fields add, in phase or in antiphase); two: two-way pattern.
  function echo(n, f, sep, mode, two, az) {
    var k = kD(f);
    var g1 = field(n, k * Math.sin((az + sep / 2) * DEG)), g2 = field(n, k * Math.sin((az - sep / 2) * DEG));
    if (two) { g1 *= g1; g2 *= g2; }
    if (mode === 'rain') return g1 * g1 + g2 * g2;
    var s = mode === 'in' ? g1 + g2 : g1 - g2;
    return s * s;
  }
  // The whole sweep from -span to span degrees, normalised to its peak, and the dip between the targets:
  // ratio = output with the beam halfway between them over the peak; twoPeaks when that is a minimum.
  function sweep(n, f, sep, mode, two, span) {
    var N = 600, pts = [], peak = 0;
    for (var i = 0; i <= N; i++) {
      var az = -span + 2 * span * i / N, p = echo(n, f, sep, mode, two, az);
      pts.push([az, p]); peak = Math.max(peak, p);
    }
    pts.forEach(function (q) { q[1] /= peak; });
    var mid = echo(n, f, sep, mode, two, 0) / peak, d = sep / 200;
    var twoPeaks = mid < 0.9999 && echo(n, f, sep, mode, two, d) / peak > mid;
    return { pts: pts, ratio: mid, twoPeaks: twoPeaks, peak: peak };
  }
  // Sparrow limit: the smallest separation (degrees) at which rain echoes show a dip, i.e. the output halfway
  // between the targets stops being a maximum
  function sparrow(n, f, two) {
    var b = beam(n, f);
    return bisect(function (sep) {
      var d = 1e-3;
      return echo(n, f, sep, 'rain', two, d) + echo(n, f, sep, 'rain', two, -d) - 2 * echo(n, f, sep, 'rain', two, 0);
    }, 0.3 * b.hpbw, b.fnbw);
  }
  function km(deg) { return RANGE * deg * DEG; }

  if (typeof module !== 'undefined') {
    module.exports = { field: field, beam: beam, echo: echo, sweep: sweep, sparrow: sparrow, km: km, DISH: DISH, RANGE: RANGE };
    return;
  }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg;
  function readout(parent, list) {
    var table = RA.el('table', { class: 'ra-readout' }, parent), rows = {};
    list.forEach(function (r) {
      var tr = RA.el('tr', {}, table), th = RA.el('th', {}, tr);
      th.innerHTML = r[1];
      rows[r[0]] = RA.el('td', {}, tr);
    });
    return rows;
  }
  function toggle(parent, label, items, get, set) {
    var tog = RA.el('div', { class: 'ra-toggle', role: 'radiogroup', 'aria-label': label }, parent), btns = [];
    items.forEach(function (it) {
      var b = RA.el('button', { type: 'button', role: 'radio' }, tog, it[1]);
      b.addEventListener('click', function () { set(it[0]); });
      btns.push([it[0], b]);
    });
    return function () { btns.forEach(function (x) { x[1].setAttribute('aria-checked', String(x[0] === get())); }); };
  }
  function fmt(v, d) { return v.toFixed(d).replace('-', '−'); }
  // A plot box: x from x0 to x1, y from y0 (bottom) to y1 (top), in a 320 x 210 viewBox
  function frame(S, xr, yr, xticks, yticks, xlabel, ylabel, yfmt) {
    var L = 38, R = 310, T = 24, B = 176;
    var X = function (x) { return L + (R - L) * (x - xr[0]) / (xr[1] - xr[0]); };
    var Y = function (y) { return B - (B - T) * (y - yr[0]) / (yr[1] - yr[0]); };
    var g = svg('g', {}, S);
    yticks.forEach(function (y) {
      svg('line', { x1: L, x2: R, y1: Y(y), y2: Y(y), stroke: 'currentColor', 'stroke-opacity': 0.12 }, g);
      svg('text', { x: L - 5, y: Y(y) + 3.5, 'font-size': 10, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = yfmt(y);
    });
    xticks.forEach(function (x) {
      svg('line', { x1: X(x), x2: X(x), y1: T, y2: B, stroke: 'currentColor', 'stroke-opacity': 0.08 }, g);
      svg('text', { x: X(x), y: B + 13, 'font-size': 10, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = fmt(x, 0);
    });
    svg('line', { x1: L, x2: R, y1: B, y2: B, stroke: 'currentColor', 'stroke-opacity': 0.5 }, g);
    svg('text', { x: (L + R) / 2, y: B + 28, 'font-size': 10, 'text-anchor': 'middle', fill: 'currentColor' }, g).textContent = xlabel;
    svg('text', { x: L - 5, y: T - 4, 'font-size': 10, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = ylabel;
    return { X: X, Y: Y, clamp: function (y) { return Math.max(T, Math.min(B, y)); } };
  }
  function line(pts, P) {
    return pts.map(function (q, i) { return (i ? 'L' : 'M') + P.X(q[0]).toFixed(2) + ' ' + P.clamp(P.Y(q[1])).toFixed(2); }).join('');
  }

  function initTaper(root) {
    var n = 1, f = 2.85e9, SPAN = 4, FLOOR = -50;
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var paint = toggle(controls, 'Taper', TAPERS.map(function (t, i) { return [i, t]; }), function () { return n; }, function (v) { n = v; update(); });
    RA.slider(controls, { label: 'Frequency', min: 2.7, max: 3.0, step: 0.01, value: 2.85,
      fmt: function (v) { return v.toFixed(2) + ' GHz'; }, onInput: function (v) { f = v * 1e9; update(); } });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var box = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, box, 'Power pattern of the 8.54 m dish');
    var S = svg('svg', { viewBox: '0 0 320 210', role: 'img' }, box);
    var title = svg('title', {}, S);
    var P = frame(S, [-SPAN, SPAN], [FLOOR, 0], [-4, -2, 0, 2, 4], [0, -10, -20, -30, -40, -50], 'degrees off the beam axis', 'dB', function (y) { return y; });
    var others = [0, 1, 2].map(function () { return svg('path', { fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.25, 'stroke-width': 1 }, S); });
    var main = svg('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }, S);
    svg('line', { x1: P.X(-SPAN), x2: P.X(SPAN), y1: P.Y(-3), y2: P.Y(-3), stroke: 'currentColor', 'stroke-dasharray': '4 3', 'stroke-opacity': 0.6 }, S);
    var hp = svg('line', { stroke: 'var(--ra-warm)', 'stroke-width': 2.5 }, S);
    var nulls = [0, 1].map(function () { return svg('circle', { r: 3, fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 1.5 }, S); });
    var sl = svg('line', { stroke: 'var(--accent)', 'stroke-dasharray': '2 2', 'stroke-width': 1 }, S);

    var rows = readout(stage, [
      ['hpbw', 'HPBW'], ['fn', 'FNBW/2'], ['ratio', 'FNBW/2 ÷ HPBW'], ['sll', 'First side lobe'], ['eff', 'Use of the dish area']
    ]);
    function curve(k) {
      var pts = [];
      for (var i = 0; i <= 400; i++) {
        var a = -SPAN + 2 * SPAN * i / 400, v = field(k, kD(f) * Math.sin(a * DEG));
        pts.push([a, Math.max(FLOOR - 5, 10 * Math.log10(v * v + 1e-12))]);
      }
      return pts;
    }
    function update() {
      paint();
      [0, 1, 2].forEach(function (k) { others[k].setAttribute('d', k === n ? '' : line(curve(k), P)); });
      main.setAttribute('d', line(curve(n), P));
      var b = beam(n, f), h = b.hpbw / 2, z = b.fnbw / 2;
      hp.setAttribute('x1', P.X(-h)); hp.setAttribute('x2', P.X(h)); hp.setAttribute('y1', P.Y(-3)); hp.setAttribute('y2', P.Y(-3));
      nulls[0].setAttribute('cx', P.X(-z)); nulls[1].setAttribute('cx', P.X(z));
      nulls.forEach(function (c) { c.setAttribute('cy', P.Y(FLOOR)); });
      sl.setAttribute('x1', P.X(-SPAN)); sl.setAttribute('x2', P.X(SPAN)); sl.setAttribute('y1', P.Y(b.sllDb)); sl.setAttribute('y2', P.Y(b.sllDb));
      rows.hpbw.innerHTML = fmt(b.hpbw, 3) + '° = ' + fmt(b.hpbw / b.lamOverD, 2) + ' <i>λ</i>/<i>D</i>';
      rows.fn.innerHTML = fmt(b.fnbw / 2, 3) + '° = ' + fmt(b.fnbw / 2 / b.lamOverD, 2) + ' <i>λ</i>/<i>D</i>';
      rows.ratio.textContent = fmt(b.fnbw / 2 / b.hpbw, 2);
      rows.sll.textContent = fmt(b.sllDb, 1) + ' dB';
      rows.eff.textContent = Math.round(100 * b.eff) + '%';
      title.textContent = TAPERS[n] + ' taper at ' + (f / 1e9).toFixed(2) + ' GHz: HPBW ' + fmt(b.hpbw, 3) + ' degrees, first nulls at ±' +
        fmt(z, 3) + ' degrees, first side lobe ' + fmt(b.sllDb, 1) + ' dB. The other two tapers are drawn faintly.';
    }
    update();
  }

  function initScan(root) {
    var n = 1, f = 2.85e9, sepKm = 1.5, mode = 'rain', two = false, az = 0, SPANKM = 4;
    var SPAN = SPANKM / RANGE / DEG;
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var paintT = toggle(controls, 'Taper', TAPERS.map(function (t, i) { return [i, t]; }), function () { return n; }, function (v) { n = v; update(); });
    var paintM = toggle(controls, 'Echoes', [['rain', 'Rain: powers add'], ['in', 'In phase'], ['anti', 'Antiphase']], function () { return mode; }, function (v) { mode = v; update(); });
    var paintP = toggle(controls, 'Path', [[false, 'One-way'], [true, 'Two-way (radar)']], function () { return two; }, function (v) { two = v; update(); });
    RA.slider(controls, { label: 'Cells apart', min: 0.2, max: 4, step: 0.05, value: sepKm,
      fmt: function (v) { return v.toFixed(2) + ' km'; }, onInput: function (v) { sepKm = v; update(); } });
    RA.slider(controls, { label: 'Beam at', min: -SPANKM, max: SPANKM, step: 0.05, value: 0,
      fmt: function (v) { return fmt(v, 2) + ' km'; }, onInput: function (v) { az = v / RANGE / DEG; update(); } });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var box = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, box, 'Two cells 100 km from the radar');
    var S = svg('svg', { viewBox: '0 0 320 210', role: 'img' }, box);
    var title = svg('title', {}, S);
    var P = frame(S, [-SPANKM, SPANKM], [0, 1.08], [-4, -2, 0, 2, 4], [0, 0.5, 1], 'across the beam at 100 km (km)', 'output', function (y) { return y; });
    var beamFill = svg('path', { fill: 'currentColor', 'fill-opacity': 0.08, stroke: 'currentColor', 'stroke-opacity': 0.3 }, S);
    var trace = svg('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }, S);
    var cursor = svg('line', { stroke: 'currentColor', 'stroke-opacity': 0.5, 'stroke-dasharray': '3 3' }, S);
    var dot = svg('circle', { r: 3.5, fill: 'var(--accent)' }, S);
    var cells = [0, 1].map(function () { return svg('circle', { r: 5, fill: 'var(--ra-warm)' }, S); });

    var rows = readout(stage, [
      ['sep', 'Cells apart'], ['dip', 'Dip between them'], ['hp', 'Beam width at 100 km'], ['ray', 'Rayleigh (FNBW/2)'], ['spa', 'Sparrow']
    ]);
    function update() {
      paintT(); paintM(); paintP();
      var sep = sepKm / RANGE / DEG, b = beam(n, f);
      var s = sweep(n, f, sep, mode, two, SPAN);
      trace.setAttribute('d', line(s.pts.map(function (q) { return [km(q[0]), q[1]]; }), P));
      // the beam itself, where it points now: one-way or two-way power pattern, peak 1
      var pts = [];
      for (var i = 0; i <= 300; i++) {
        var x = -SPANKM + 2 * SPANKM * i / 300, g = field(n, kD(f) * Math.sin((x / RANGE / DEG - az) * DEG));
        pts.push([x, two ? Math.pow(g, 4) : g * g]);
      }
      beamFill.setAttribute('d', line(pts, P) + 'L' + P.X(SPANKM) + ' ' + P.Y(0) + 'L' + P.X(-SPANKM) + ' ' + P.Y(0) + 'Z');
      var x = P.X(km(az)), y = P.Y(echo(n, f, sep, mode, two, az) / s.peak);
      cursor.setAttribute('x1', x); cursor.setAttribute('x2', x); cursor.setAttribute('y1', P.Y(0)); cursor.setAttribute('y2', P.Y(1.08));
      dot.setAttribute('cx', x); dot.setAttribute('cy', y);
      cells[0].setAttribute('cx', P.X(-sepKm / 2)); cells[1].setAttribute('cx', P.X(sepKm / 2));
      cells.forEach(function (c) { c.setAttribute('cy', P.Y(0)); });

      var hp = two ? b.hpbw2 : b.hpbw, ray = b.fnbw / 2, spa = sparrow(n, f, two);
      rows.sep.innerHTML = fmt(sep, 3) + '° = ' + fmt(sep / hp, 2) + ' HPBW';
      var dip = !s.twoPeaks ? 'none: one peak' : s.ratio < 1e-6 ? 'down to zero' : fmt(10 * Math.log10(s.ratio), 2) + ' dB';
      rows.dip.textContent = dip;
      rows.hp.textContent = fmt(km(hp), 2) + ' km (' + fmt(hp, 3) + '°)';
      rows.ray.textContent = fmt(km(ray), 2) + ' km';
      rows.spa.textContent = fmt(km(spa), 2) + ' km';
      title.textContent = 'Receiver output as the beam sweeps across two storm cells ' + sepKm.toFixed(2) + ' km apart at 100 km; ' +
        (s.twoPeaks ? 'two peaks, dip between them: ' + dip + '.' : 'a single peak, so the cells are not resolved.');
    }
    update();
  }

  document.querySelectorAll('[data-widget="beam-resolution"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    (root.dataset.view === 'scan' ? initScan : initTaper)(root);
  });
})();
