// power-flow: the Poynting vector around a short (infinitesimal) dipole, from its exact fields, at any distance kr.
// Shows the instantaneous radial flow on a sphere and over one cycle, and the real and reactive power through the
// sphere against kr. Markup comes from _includes/readalong/power-flow.html; helpers from readalong.js (window.RA).
// The maths at the top has no DOM and is also run under node by content/balanis/checks/power_flow.py.
(function () {
  var PI = Math.PI;
  var LAMBDA_CM = 29979245800 / 2.4e9;   // free-space wavelength at 2.4 GHz, in cm
  var KR_MIN = 0.1, KR_MAX = 20;

  // Exact fields of a z-directed short dipole (Balanis eqs. 4-8b, 4-10b), divided by the far-field terms they
  // share, so E_theta -> gE and H_phi -> gH (times j eta A sin(theta) and j A sin(theta), A = k I0 l / 4 pi r,
  // and the common e^{-jkr}, which only shifts time). Complex numbers are [re, im].
  function g(kr) {
    var x = 1 / kr;
    return { E: [1 - x * x, -x], H: [1, -x] };
  }
  function mul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
  function conj(a) { return [a[0], -a[1]]; }

  // Everything per unit of the far-field average density at the same r and theta, i.e. per (eta/2) A^2 sin^2(theta).
  //   complex density W = gE gH*  (its real part is the average flow, its imaginary part the reactive part)
  //   instantaneous radial flow = Re(W) + Re(c e^{j 2 wt}),  c = -gE gH  (the j j of the two prefactors gives -1)
  // Since the sin^2(theta) and r^2 dependence is the same at every distance, the power through the whole sphere,
  // per unit of P_rad, is the same complex number W.
  function model(kr) {
    var f = g(kr), W = mul(f.E, conj(f.H)), c = mul(f.E, f.H);
    c = [-c[0], -c[1]];
    var amp = Math.hypot(c[0], c[1]);
    return {
      kr: kr,
      rcm: kr * LAMBDA_CM / (2 * PI),
      W: W,                                          // [Re P / P_rad, Im P / P_rad]
      c: c,
      phase: Math.atan2(W[1], W[0]) * 180 / PI,     // phase of E_theta relative to H_phi, degrees
      minOverAvg: (W[0] - amp) / W[0],               // most inward flow in a cycle, per unit of the average
      peak: W[0] + amp                               // largest outward flow in a cycle
    };
  }
  // instantaneous radial flow at angle wt (radians), per unit of the far-field average at theta = 90 degrees
  function flow(m, wt) { return m.W[0] + m.c[0] * Math.cos(2 * wt) - m.c[1] * Math.sin(2 * wt); }

  if (typeof module !== 'undefined') { module.exports = { model: model, flow: flow, LAMBDA_CM: LAMBDA_CM }; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  function fmt(v, d) { return v.toFixed(d).replace('-', '−'); }
  // three significant figures; small or large values as m × 10^n (HTML)
  function sci(v) {
    var a = Math.abs(v);
    if (a >= 0.01 && a < 1000) return fmt(v, a < 1 ? 3 : a < 10 ? 2 : a < 100 ? 1 : 0);
    var n = Math.floor(Math.log10(a)), mant = v / Math.pow(10, n);
    return fmt(mant, 2) + ' × 10<sup>' + fmt(n, 0) + '</sup>';
  }

  function init(root) {
    var RA = window.RA, svg = RA.svg;
    var toU = function (kr) { return Math.log(kr / KR_MIN) / Math.log(KR_MAX / KR_MIN); };
    var toKr = function (u) { return KR_MIN * Math.pow(KR_MAX / KR_MIN, u); };
    var m = model(Math.min(KR_MAX, Math.max(KR_MIN, +root.dataset.kr || 0.5)));
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var playing = !reduce, wt = PI / 4, last = null, visible = true;

    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    RA.slider(controls, {
      label: 'Distance <i>kr</i>', min: 0, max: 1, step: 0.001, value: toU(m.kr),
      fmt: function (u) { var kr = toKr(u); return kr.toFixed(kr < 1 ? 2 : 1); },
      onInput: function (u) { m = model(toKr(u)); update(); }
    });
    var play = RA.el('button', { type: 'button', class: 'ra-button' }, controls);
    play.addEventListener('click', function () { playing = !playing; last = null; update(); if (playing) tick(); });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);

    // 1. the sphere, side view, with arrows of the radial flow
    var boxA = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, boxA, 'Flow through a sphere of radius r, now');
    var A = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', role: 'img' }, boxA);
    svg('title', {}, A).textContent = 'Side view of a sphere around a vertical short dipole, with arrows showing the instantaneous radial Poynting vector';
    var gA = svg('g', { color: 'currentColor' }, A);
    svg('circle', { cx: 0, cy: 0, r: 0.7, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-width': 0.01, 'stroke-dasharray': '0.03 0.03' }, gA);
    svg('line', { x1: 0, y1: -0.14, x2: 0, y2: -0.02, stroke: 'currentColor', 'stroke-width': 0.025 }, gA);
    svg('line', { x1: 0, y1: 0.02, x2: 0, y2: 0.14, stroke: 'currentColor', 'stroke-width': 0.025 }, gA);
    svg('circle', { cx: 0, cy: 0, r: 0.022, fill: 'var(--ra-warm)' }, gA);
    var arrows = [];
    for (var s = -1; s <= 1; s += 2) for (var d = 15; d <= 165; d += 15) {
      var th = d * PI / 180;
      arrows.push({ th: th, x: s * Math.sin(th), y: -Math.cos(th), el: svg('path', { 'stroke-width': 0.018, 'stroke-linejoin': 'round' }, gA) });
    }
    var keyA = svg('text', { x: 0, y: 1.22, 'font-size': 0.09, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, A);

    // 2. one cycle at theta = 90 degrees
    var boxB = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, boxB, 'Flow at the equator over one cycle');
    var B = svg('svg', { viewBox: '0 0 300 190', role: 'img' }, boxB);
    svg('title', {}, B).textContent = 'Instantaneous radial Poynting vector at the equator over one period, with its average and zero';
    var X0 = 34, X1 = 290, Y0 = 20, Y1 = 160, ym = (Y0 + Y1) / 2;
    var yOf = function (v) { return ym - v * (Y1 - Y0) / 2; };   // v in -1..1 (per unit of the peak)
    svg('line', { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: 'currentColor', 'stroke-opacity': 0.5 }, B);
    svg('line', { x1: X0, y1: ym, x2: X1, y2: ym, stroke: 'currentColor', 'stroke-opacity': 0.5 }, B);
    svg('text', { x: X0 - 6, y: ym + 4, 'font-size': 11, 'text-anchor': 'end', fill: 'currentColor' }, B).textContent = '0';
    svg('text', { x: X0 + 4, y: Y0 - 6, 'font-size': 11, fill: 'currentColor', 'fill-opacity': 0.7 }, B).textContent = 'outward';
    svg('text', { x: X0 + 4, y: Y1 + 14, 'font-size': 11, fill: 'currentColor', 'fill-opacity': 0.7 }, B).textContent = 'inward';
    svg('text', { x: X1, y: Y1 + 26, 'font-size': 11, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.7 }, B).textContent = 'one period →';
    var avgLine = svg('line', { x1: X0, x2: X1, stroke: 'var(--accent)', 'stroke-dasharray': '5 4', 'stroke-width': 1.5 }, B);
    var avgText = svg('text', { x: X1, 'font-size': 11, 'text-anchor': 'end', fill: 'var(--accent)' }, B);
    var curve = svg('path', { fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, B);
    var dot = svg('circle', { r: 4.5 }, B);

    // 3. real and reactive power through the sphere against kr
    var boxC = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, boxC).innerHTML = 'Power through the sphere, per unit of <i>P</i><sub>rad</sub>';
    var C = svg('svg', { viewBox: '0 0 300 200', role: 'img' }, boxC);
    svg('title', {}, C).textContent = 'Log-log plot of the real and imaginary power through the sphere against kr: the real part stays at 1, the imaginary part falls as one over kr cubed';
    var CX0 = 44, CX1 = 290, CY0 = 12, CY1 = 168, LMIN = -4, LMAX = 3;
    var cx = function (kr) { return CX0 + (CX1 - CX0) * toU(kr); };
    var cy = function (v) { return CY1 - (CY1 - CY0) * (Math.log10(v) - LMIN) / (LMAX - LMIN); };
    for (var e = LMIN; e <= LMAX; e++) {
      svg('line', { x1: CX0, x2: CX1, y1: cy(Math.pow(10, e)), y2: cy(Math.pow(10, e)), stroke: 'currentColor', 'stroke-opacity': 0.12 }, C);
      svg('text', { x: CX0 - 5, y: cy(Math.pow(10, e)) + 4, 'font-size': 10, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.7 }, C).textContent = String(Math.pow(10, e));
    }
    [0.1, 1, 10].forEach(function (kr) {
      svg('line', { x1: cx(kr), x2: cx(kr), y1: CY0, y2: CY1, stroke: 'currentColor', 'stroke-opacity': 0.12 }, C);
      svg('text', { x: cx(kr), y: CY1 + 14, 'font-size': 10, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, C).textContent = String(kr);
    });
    svg('text', { x: CX1, y: CY1 + 28, 'font-size': 11, 'text-anchor': 'end', fill: 'currentColor', 'font-style': 'italic' }, C).textContent = 'kr';
    var re = '', im = '';
    for (var i = 0; i <= 200; i++) {
      var mm = model(toKr(i / 200)), y = Math.max(CY0, Math.min(CY1, cy(Math.abs(mm.W[1]))));
      re += (i ? 'L' : 'M') + cx(mm.kr).toFixed(1) + ' ' + cy(mm.W[0]).toFixed(1);
      im += (i ? 'L' : 'M') + cx(mm.kr).toFixed(1) + ' ' + y.toFixed(1);
    }
    svg('path', { d: re, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }, C);
    svg('path', { d: im, fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 2 }, C);
    svg('text', { x: CX1 - 4, y: cy(1) - 6, 'font-size': 11, 'text-anchor': 'end', fill: 'var(--accent)' }, C).textContent = 'real (radiated)';
    svg('text', { x: cx(2.2), y: cy(0.25), 'font-size': 11, fill: 'var(--ra-warm)' }, C).textContent = '|imaginary| (stored)';
    var marker = svg('line', { y1: CY0, y2: CY1, stroke: 'currentColor', 'stroke-width': 1.5 }, C);

    // 4. readout
    var table = RA.el('table', { class: 'ra-readout' }, stage);
    var rows = {};
    [['r', '<i>r</i> at 2.4 GHz'], ['phase', 'Phase of <i>E</i><sub>θ</sub> against <i>H</i><sub>φ</sub>'],
     ['min', 'Most inward flow ÷ average'], ['re', 'Re <i>P</i> ÷ <i>P</i><sub>rad</sub>'], ['im', 'Im <i>P</i> ÷ <i>P</i><sub>rad</sub>']
    ].forEach(function (r) {
      var tr = RA.el('tr', {}, table), th = RA.el('th', {}, tr);
      th.innerHTML = r[1];
      rows[r[0]] = RA.el('td', {}, tr);
    });

    function arrowPath(x, y, ux, uy, len) {
      var x2 = x + ux * len, y2 = y + uy * len, h = Math.min(0.06, Math.abs(len) * 0.6), sg = len < 0 ? -1 : 1;
      var bx = x2 - sg * ux * h, by = y2 - sg * uy * h, px = -uy * h * 0.55, py = ux * h * 0.55;
      return 'M' + x + ' ' + y + 'L' + x2 + ' ' + y2 + 'M' + (bx + px) + ' ' + (by + py) + 'L' + x2 + ' ' + y2 + 'L' + (bx - px) + ' ' + (by - py);
    }

    function frame() {
      var v = flow(m, wt) / m.peak;   // per unit of the largest outward value in a cycle
      arrows.forEach(function (a) {
        var len = 0.5 * v * Math.sin(a.th) * Math.sin(a.th);
        a.el.setAttribute('d', Math.abs(len) < 0.004 ? '' : arrowPath(0.7 * a.x, 0.7 * a.y, a.x, a.y, len));
        a.el.setAttribute('stroke', len < 0 ? 'var(--ra-warm)' : 'var(--accent)');
        a.el.setAttribute('fill', 'none');
      });
      var x = X0 + (X1 - X0) * ((wt % PI) / PI);
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', yOf(v));
      dot.setAttribute('fill', v < 0 ? 'var(--ra-warm)' : 'var(--accent)');
    }

    function update() {
      var d = '';
      for (var i = 0; i <= 120; i++) {
        var t = PI * i / 120;   // the flow repeats every half period of the field
        d += (i ? 'L' : 'M') + (X0 + (X1 - X0) * i / 120).toFixed(1) + ' ' + yOf(flow(m, t) / m.peak).toFixed(1);
      }
      curve.setAttribute('d', d);
      var ya = yOf(m.W[0] / m.peak);
      avgLine.setAttribute('y1', ya); avgLine.setAttribute('y2', ya);
      avgText.setAttribute('y', ya - 5); avgText.textContent = 'average';
      marker.setAttribute('x1', cx(m.kr)); marker.setAttribute('x2', cx(m.kr));
      keyA.textContent = 'blue: outward · red: inward';
      rows.r.textContent = m.rcm.toFixed(m.rcm < 10 ? 2 : 1) + ' cm';
      rows.phase.textContent = fmt(m.phase, 2) + '°';
      rows.min.innerHTML = sci(m.minOverAvg);
      rows.re.textContent = m.W[0].toFixed(3);
      rows.im.innerHTML = sci(m.W[1]);
      play.textContent = playing ? 'Pause' : 'Play';
      play.setAttribute('aria-pressed', String(playing));
      frame();
    }

    function tick(ts) {
      if (!playing) return;
      if (ts != null && visible) {
        if (last != null) wt = (wt + (ts - last) / 1000 * PI / 2) % (2 * PI);   // one half period every 2 s
        last = ts;
        frame();
      } else last = null;
      requestAnimationFrame(tick);
    }
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(root);
    update();
    if (playing) requestAnimationFrame(tick);
  }

  document.querySelectorAll('[data-widget="power-flow"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
