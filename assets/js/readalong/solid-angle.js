// solid-angle: radiation intensity U (power per steradian) and how it adds up over a sphere.
// view "cone": a cone of fixed solid angle around a half-wave dipole cuts a patch on a sphere of radius r; the patch
//   grows as r^2, the density W falls as 1/r^2, and the power through the patch stays the same (U = r^2 W).
// view "rings": the sphere sliced into 10 degree bands; each band's solid angle goes as sin(theta), and the power
//   through it is U times that. A toggle drops the sin(theta) to show the wrong total.
// Markup from _includes/readalong/solid-angle.html; helpers from readalong.js (window.RA). The maths at the top has
// no DOM and is also run under node by content/balanis/checks/solid_angle.py.
(function () {
  var PI = Math.PI, DEG = PI / 180;
  var P_RAD = 0.1;   // watts radiated in every view: 100 mW
  var BAND = 10;     // band width, degrees

  // Power patterns, any scale: U is proportional to these (Balanis eqs. 4-26a and 4-87).
  var PATTERNS = {
    iso: { label: 'Isotropic', f: function () { return 1; } },
    short: { label: 'Short dipole', f: function (t) { var s = Math.sin(t); return s * s; } },
    half: { label: 'Half-wave dipole', f: function (t) {
      var s = Math.sin(t);
      if (s < 1e-9) return 0;
      var v = Math.cos(PI / 2 * Math.cos(t)) / s;
      return v * v;
    } }
  };

  // Simpson's rule on [a, b] with n (even) steps
  function simpson(g, a, b, n) {
    var h = (b - a) / n, s = g(a) + g(b);
    for (var i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * g(a + i * h);
    return s * h / 3;
  }
  var norms = {};
  // the pattern's integral over the sphere, 2 pi times the integral of f sin(theta) d theta
  function norm(name) {
    if (!(name in norms)) norms[name] = 2 * PI * simpson(function (t) { return PATTERNS[name].f(t) * Math.sin(t); }, 0, PI, 2000);
    return norms[name];
  }
  // radiation intensity in W/sr for P_RAD watts radiated
  function U(name, t) { return P_RAD * PATTERNS[name].f(t) / norm(name); }

  // Solid angle of a cone of half-angle a (radians): 2 pi (1 - cos a)
  function capOmega(a) { return 2 * PI * (1 - Math.cos(a)); }
  // Power through a cone of half-angle a whose axis is at polar angle t0: the integral of U over the cap, in the
  // cap's own coordinates (psi from the axis, beta around it), where cos(theta) = cos t0 cos psi + sin t0 sin psi cos beta.
  function capPower(name, t0, a) {
    var NP = 60, NB = 72, s = 0;
    for (var i = 0; i < NP; i++) {
      var psi = (i + 0.5) * a / NP, w = Math.sin(psi) * (a / NP) * (2 * PI / NB);
      for (var j = 0; j < NB; j++) {
        var b = (j + 0.5) * 2 * PI / NB;
        var c = Math.cos(t0) * Math.cos(psi) + Math.sin(t0) * Math.sin(psi) * Math.cos(b);
        s += U(name, Math.acos(Math.max(-1, Math.min(1, c)))) * w;
      }
    }
    return s;
  }
  // The cone view's numbers for a sphere of radius r (m), cone half-angle a and axis angle t0 (radians).
  function cone(r, a, t0) {
    var om = capOmega(a), u = U('half', t0);
    return { omega: om, sqdeg: om / (DEG * DEG), area: om * r * r, U: u, W: u / (r * r), power: capPower('half', t0, a) };
  }

  // The rings view: the power through each 10 degree band, with the sin(theta) (right) or without it (forget).
  function bands(name, forget) {
    var out = [];
    for (var d = 0; d < 180; d += BAND) {
      var a = d * DEG, b = (d + BAND) * DEG;
      var sa = forget ? 2 * PI * (b - a) : 2 * PI * (Math.cos(a) - Math.cos(b));   // the band's "solid angle"
      var p = 2 * PI * simpson(function (t) { return U(name, t) * (forget ? 1 : Math.sin(t)); }, a, b, 40);
      out.push({ from: d, to: d + BAND, omega: sa, share: sa / (4 * PI), power: p });
    }
    out.total = out.reduce(function (s, x) { return s + x.power; }, 0);
    return out;
  }

  if (typeof module !== 'undefined') {
    module.exports = { U: U, capOmega: capOmega, capPower: capPower, cone: cone, bands: bands, norm: norm, P_RAD: P_RAD };
    return;
  }

  // ---- drawing ------------------------------------------------------------------------------------------------

  // four significant figures, without trailing zeros
  function sig(v) { return String(Number(v.toPrecision(4))).replace('-', '−'); }

  function readout(parent, list) {
    var table = window.RA.el('table', { class: 'ra-readout' }, parent), rows = {};
    list.forEach(function (r) {
      var tr = window.RA.el('tr', {}, table), th = window.RA.el('th', {}, tr);
      th.innerHTML = r[1];
      rows[r[0]] = window.RA.el('td', {}, tr);
    });
    return rows;
  }
  // SVG path of an arc of radius rho from polar angle t1 to t2 (from straight up, clockwise)
  function arc(rho, t1, t2) {
    var d = '', n = 40;
    for (var i = 0; i <= n; i++) {
      var t = t1 + (t2 - t1) * i / n;
      d += (i ? 'L' : 'M') + (rho * Math.sin(t)).toFixed(4) + ' ' + (-rho * Math.cos(t)).toFixed(4);
    }
    return d;
  }
  // a vertical half-wave dipole at the origin with its red feed point, at the size the views use
  function dipole(g, h) {
    var svg = window.RA.svg;
    svg('line', { x1: 0, y1: -h, x2: 0, y2: -0.015, stroke: 'currentColor', 'stroke-width': 0.02 }, g);
    svg('line', { x1: 0, y1: 0.015, x2: 0, y2: h, stroke: 'currentColor', 'stroke-width': 0.02 }, g);
    svg('circle', { cx: 0, cy: 0, r: 0.018, fill: 'var(--ra-warm)' }, g);
  }

  function initCone(root) {
    var RA = window.RA, svg = RA.svg;
    var r = 10, a = 10 * DEG, t0 = 90 * DEG, RMAX = 100;
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    RA.slider(controls, { label: 'Distance <i>r</i>', min: 5, max: 100, step: 1, value: r,
      fmt: function (v) { return v + ' m'; }, onInput: function (v) { r = v; update(); } });
    RA.slider(controls, { label: 'Cone half-angle', min: 2, max: 40, step: 1, value: 10,
      fmt: function (v) { return v + '°'; }, onInput: function (v) { a = v * DEG; update(); } });
    RA.slider(controls, { label: 'Direction θ', min: 0, max: 90, step: 1, value: 90,
      fmt: function (v) { return v + '°'; }, onInput: function (v) { t0 = v * DEG; update(); } });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var box = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, box, 'Side view, distances to scale');
    var S = svg('svg', { viewBox: '-1.2 -1.2 2.4 2.4', role: 'img' }, box);
    svg('title', {}, S).textContent = 'Side view of a vertical half-wave dipole with a cone of fixed solid angle from its centre, cutting a patch on a sphere of radius r';
    var g = svg('g', {}, S);
    [0.25, 0.5, 0.75, 1].forEach(function (k) {
      svg('circle', { cx: 0, cy: 0, r: k, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.15, 'stroke-width': 0.006 }, g);
      svg('text', { x: 0.02, y: -k - 0.02, 'font-size': 0.06, fill: 'currentColor', 'fill-opacity': 0.6 }, g).textContent = (k * RMAX) + ' m';
    });
    // the pattern's shape, small and faint: it says which way U is large, not how far anything is
    var pat = '';
    for (var i = 0; i <= 360; i++) {
      var t = i * DEG, rho = 0.3 * PATTERNS.half.f(t);
      pat += (i ? 'L' : 'M') + (rho * Math.sin(t)).toFixed(4) + ' ' + (-rho * Math.cos(t)).toFixed(4);
    }
    svg('path', { d: pat + 'Z', fill: 'currentColor', 'fill-opacity': 0.08, stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-width': 0.006 }, g);
    var wedge = svg('path', { fill: 'var(--accent)', 'fill-opacity': 0.12, stroke: 'var(--accent)', 'stroke-opacity': 0.6, 'stroke-width': 0.006 }, g);
    var patch = svg('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 0.035, 'stroke-linecap': 'round' }, g);
    dipole(g, 0.08);
    svg('text', { x: 0, y: 1.17, 'font-size': 0.07, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, S).textContent = 'grey: pattern shape (not to scale)';

    var rows = readout(stage, [
      ['omega', 'Solid angle of the cone'], ['area', 'Patch area'], ['W', 'Power density <i>W</i> on the axis'],
      ['U', 'Intensity <i>U</i> on the axis'], ['P', 'Power through the patch']
    ]);

    function update() {
      wedge.setAttribute('d', 'M0 0' + arc(1, t0 - a, t0 + a).replace('M', 'L') + 'Z');
      patch.setAttribute('d', arc(r / RMAX, t0 - a, t0 + a));
      var c = cone(r, a, t0);
      rows.omega.innerHTML = sig(c.omega) + ' sr = ' + Math.round(c.sqdeg).toLocaleString('en') + ' deg<sup>2</sup>';
      rows.area.innerHTML = sig(c.area) + ' m<sup>2</sup>';
      rows.W.innerHTML = c.W * 1e6 < 0.01 ? '0 µW/m<sup>2</sup>' : sig(c.W * 1e6) + ' µW/m<sup>2</sup>';
      rows.U.textContent = sig(c.U * 1e3) + ' mW/sr';
      rows.P.textContent = sig(c.power * 1e3) + ' mW';
    }
    update();
  }

  function initRings(root) {
    var RA = window.RA, svg = RA.svg;
    var name = root.dataset.pattern in PATTERNS ? root.dataset.pattern : 'half', forget = false, sel = 8;
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var tog = RA.el('div', { class: 'ra-toggle', role: 'radiogroup', 'aria-label': 'Pattern' }, controls), btns = {};
    Object.keys(PATTERNS).forEach(function (k) {
      var b = RA.el('button', { type: 'button', role: 'radio' }, tog, PATTERNS[k].label);
      b.addEventListener('click', function () { name = k; update(); });
      btns[k] = b;
    });
    var forgetBtn = RA.el('button', { type: 'button', class: 'ra-button' }, controls);
    forgetBtn.innerHTML = 'Forget sin θ';
    forgetBtn.addEventListener('click', function () { forget = !forget; update(); });
    RA.slider(controls, { label: 'Band', min: 0, max: 17, step: 1, value: sel,
      fmt: function (v) { return v * BAND + '°–' + (v + 1) * BAND + '°'; }, onInput: function (v) { sel = v; update(); } });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var boxA = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, boxA, 'The sphere in 10° bands');
    var A = svg('svg', { viewBox: '-1.2 -1.2 2.4 2.4', role: 'img' }, boxA);
    svg('title', {}, A).textContent = 'Side view of a sphere around a vertical dipole, cut into bands 10 degrees wide in polar angle, with the chosen band filled';
    var gA = svg('g', {}, A);
    var band = svg('path', { fill: 'var(--accent)', 'fill-opacity': 0.3 }, gA);
    svg('circle', { cx: 0, cy: 0, r: 1, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.5, 'stroke-width': 0.008 }, gA);
    for (var d = BAND; d < 180; d += BAND) {
      var t = d * DEG;
      svg('ellipse', { cx: 0, cy: -Math.cos(t), rx: Math.sin(t), ry: 0.12 * Math.sin(t), fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.006 }, gA);
    }
    dipole(gA, 0.12);
    svg('text', { x: 0, y: -1.06, 'font-size': 0.07, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, A).textContent = 'θ = 0°';
    svg('text', { x: 0, y: 1.13, 'font-size': 0.07, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, A).textContent = 'θ = 180°';

    var boxB = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, boxB, 'Power through each band');
    var B = svg('svg', { viewBox: '0 0 300 190', role: 'img' }, boxB);
    svg('title', {}, B).textContent = 'Bar chart of the power through each 10 degree band of the sphere, from theta 0 to 180 degrees';
    var X0 = 34, X1 = 290, Y0 = 24, Y1 = 160, bw = (X1 - X0) / 18;
    var gridG = svg('g', {}, B);
    svg('line', { x1: X0, y1: Y1, x2: X1, y2: Y1, stroke: 'currentColor', 'stroke-opacity': 0.5 }, B);
    [0, 90, 180].forEach(function (v) {
      svg('text', { x: X0 + (X1 - X0) * v / 180, y: Y1 + 14, 'font-size': 10, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, B).textContent = v + '°';
    });
    svg('text', { x: X1, y: Y1 + 28, 'font-size': 11, 'text-anchor': 'end', fill: 'currentColor', 'font-style': 'italic' }, B).textContent = 'θ';
    var ghosts = [], bars = [];
    for (var i = 0; i < 18; i++) {
      ghosts.push(svg('rect', { x: X0 + i * bw + 1, width: bw - 2, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.45, 'stroke-dasharray': '3 2' }, B));
      var bar = svg('rect', { x: X0 + i * bw + 1, width: bw - 2, style: 'cursor:pointer' }, B);
      bar.addEventListener('click', (function (k) { return function () { sel = k; slider.value = k; slider.dispatchEvent(new Event('input')); }; })(i));
      bars.push(bar);
    }
    var slider = controls.querySelector('input');

    var rows = readout(stage, [
      ['omega', 'Solid angle of the band'], ['share', 'Share of the sphere'], ['P', 'Power through the band'], ['total', 'Total over the sphere']
    ]);

    function update() {
      Object.keys(btns).forEach(function (k) { btns[k].setAttribute('aria-checked', String(k === name)); });
      forgetBtn.setAttribute('aria-pressed', String(forget));
      var t1 = sel * BAND * DEG, t2 = (sel + 1) * BAND * DEG;
      band.setAttribute('d', 'M' + Math.sin(t1) + ' ' + -Math.cos(t1) + 'A1 1 0 0 1 ' + Math.sin(t2) + ' ' + -Math.cos(t2) +
        'L' + -Math.sin(t2) + ' ' + -Math.cos(t2) + 'A1 1 0 0 1 ' + -Math.sin(t1) + ' ' + -Math.cos(t1) + 'Z');

      var right = bands(name, false), shown = forget ? bands(name, true) : right;
      var max = 0;
      right.concat(shown).forEach(function (b) { max = Math.max(max, b.power); });
      var step = max * 1e3 > 20 ? 10 : max * 1e3 > 10 ? 5 : 2, top = Math.ceil(max * 1e3 / step) * step;
      var yOf = function (p) { return Y1 - (Y1 - Y0) * p * 1e3 / top; };
      gridG.textContent = '';
      for (var v = 0; v <= top; v += step) {
        svg('line', { x1: X0, x2: X1, y1: yOf(v / 1e3), y2: yOf(v / 1e3), stroke: 'currentColor', 'stroke-opacity': 0.12 }, gridG);
        svg('text', { x: X0 - 5, y: yOf(v / 1e3) + 4, 'font-size': 10, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.7 }, gridG).textContent = v;
      }
      svg('text', { x: X0 - 5, y: Y0 - 12, 'font-size': 10, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.7 }, gridG).textContent = 'mW';
      for (var i = 0; i < 18; i++) {
        var y = yOf(shown[i].power), yr = yOf(right[i].power);
        bars[i].setAttribute('y', y); bars[i].setAttribute('height', Y1 - y);
        bars[i].setAttribute('fill', forget ? 'var(--ra-warm)' : 'var(--accent)');
        bars[i].setAttribute('fill-opacity', i === sel ? 1 : 0.5);
        ghosts[i].setAttribute('y', yr); ghosts[i].setAttribute('height', Y1 - yr);
        ghosts[i].style.display = forget ? '' : 'none';
      }
      var b = shown[sel];
      rows.omega.textContent = sig(b.omega) + ' sr';
      rows.share.textContent = (100 * b.share).toFixed(1) + '%';
      rows.P.textContent = sig(b.power * 1e3) + ' mW';
      rows.total.textContent = (shown.total * 1e3).toFixed(1) + ' mW';
    }
    update();
  }

  document.querySelectorAll('[data-widget="solid-angle"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    (root.dataset.view === 'rings' ? initRings : initCone)(root);
  });
})();
