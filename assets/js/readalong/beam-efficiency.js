// beam-efficiency: the share of the radiated power inside a cone of half-angle theta1 around the beam (Balanis
// eqs. 2-53, 2-54), for a circular dish of diameter d lit as (1 - rho^2)^p, p = 0, 1, 2. The dish model (front half
// only, no obliquity factor) is the one in beam-solid-angle.js. The cone is set by u1 = (pi d / lambda) sin(theta1),
// so it follows the beam when d / lambda changes. A third panel turns the beam efficiency into the error of a
// radiometer whose main beam sees one temperature and whose side lobes see another.
// Markup from _includes/readalong/beam-efficiency.html; helpers from readalong.js (window.RA). The maths at the top
// has no DOM and is also run under node by content/balanis/checks/beam_efficiency.py.
(function () {
  var node = typeof module !== 'undefined';
  var B = node ? require('./beam-solid-angle.js') : window.BeamSolidAngle;
  var PI = Math.PI, DEG = PI / 180;
  var TAPERS = ['Uniform', 'Parabolic', 'Parabolic²'];
  var ETA = [1, 0.75, 5 / 9];          // aperture efficiency of (1 - rho^2)^p: (2p + 1) / (p + 1)^2
  var UMAX = 16;                       // the plots run out to u = 16
  var NULLS = [[3, 4.5], [4.5, 5.8], [5.8, 7]];   // brackets for the first zero of the field, per taper

  // Everything the widget shows for one dish: first null and half-power angles, the cumulative beam efficiency
  // BE(theta) from the trapezoid rule on a fine grid in theta (0 to 90 degrees), D0 and the aperture efficiency.
  function model(p, dl) {
    var a = PI * dl, f = function (u) { return B.dishField(p, u); };
    var uNull = B.bisect(f, NULLS[p][0], NULLS[p][1]), uHalf = B.bisect(function (u) { return f(u) * f(u) - 0.5; }, 0.1, 3);
    var N = Math.max(8000, Math.ceil(a / 0.02)), h = PI / 2 / N, cum = new Float64Array(N + 1), prev = 0;
    for (var i = 1; i <= N; i++) {
      var t = i * h, fi = f(a * Math.sin(t)), g = fi * fi * Math.sin(t);
      cum[i] = cum[i - 1] + (prev + g) * h / 2;
      prev = g;
    }
    var tot = cum[N];
    function be(theta) {   // beam efficiency inside a cone of half-angle theta (radians)
      if (theta >= PI / 2) return 1;
      var k = theta / h, j = Math.floor(k), r = k - j;
      return (cum[j] * (1 - r) + cum[j + 1] * r) / tot;
    }
    function thetaOf(u) { return u >= a ? PI / 2 : Math.asin(u / a); }
    return { p: p, dl: dl, a: a, uNull: uNull, uHalf: uHalf, thetaOf: thetaOf, be: be,
      beU: function (u) { return be(thetaOf(u)); },
      U: function (t) { var v = f(a * Math.sin(t)); return v * v; },
      D0: B.directivity(B.pattern('dish', 0, p, dl)).D0, eta: ETA[p] };
  }
  // Antenna temperature of a radiometer: the main beam sees tMain, everything outside it sees tSide
  function antennaTemp(be, tMain, tSide) { return be * tMain + (1 - be) * tSide; }

  var api = { model: model, antennaTemp: antennaTemp, ETA: ETA, NEXRAD: B.NEXRAD };
  if (node) { module.exports = api; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg, sig = RA.sig, frame = RA.frame, path = RA.path, legend = RA.legend;
  function dB(v) { return 10 * Math.log10(v); }
  function pct(v) { return (100 * v).toFixed(1) + '%'; }

  function init(root) {
    var d = root.dataset;
    var p = +(d.taper || 0), dl = d.dl === 'nexrad' ? B.NEXRAD : +(d.dl || 20), radiometer = d.radiometer !== 'off';
    var tMain = +(d.tmain || 100), tSide = +(d.tside || 280), models = {};
    function get(q) { var k = q + ':' + dl; return models[k] || (models[k] = model(q, dl)); }
    var M = get(p), u1 = d.cone === 'half' ? M.uHalf : d.cone === 'null' || !d.cone ? M.uNull : +d.cone;
    root.textContent = '';

    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var paintT = RA.toggle(controls, 'Taper', TAPERS.map(function (t, i) { return [i, t]; }), function () { return p; },
      function (v) {   // a cone on a preset (first null, half power) moves to the new taper's preset
        var key = ['uNull', 'uHalf'].filter(function (k) { return Math.abs(u1 - get(p)[k]) < 0.005; })[0];
        p = v;
        if (key) { uInput.value = get(p)[key]; uInput.dispatchEvent(new Event('input')); } else update();
      });
    var dlInput = RA.slider(controls, { label: '<i>d</i>/<i>λ</i>', min: 0, max: 1, step: 'any', value: Math.log(dl / 3) / Math.log(40),
      fmt: function (s) { return sig(3 * Math.pow(40, s), 3); }, onInput: function (s) { dl = 3 * Math.pow(40, s); update(); } });
    var nex = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, controls, 'NEXRAD dish');
    nex.addEventListener('click', function () {
      dlInput.value = Math.log(B.NEXRAD / 3) / Math.log(40);
      dlInput.dispatchEvent(new Event('input'));
    });
    var coneBox = RA.el('div', { class: 'ra-controls' }, root);
    var uInput = RA.slider(coneBox, { label: 'Cone, <i>θ</i><sub>1</sub>', min: 0, max: UMAX, step: 'any', value: u1,
      fmt: function (u) { return sig(get(p).thetaOf(u) / DEG, 3) + '°'; }, onInput: function (u) { u1 = u; update(); } });
    // preset buttons show as pressed while the widget sits on their value
    var snaps = [];
    function snap(label, key) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, coneBox, label);
      b.addEventListener('click', function () { uInput.value = get(p)[key]; uInput.dispatchEvent(new Event('input')); });
      snaps.push([b, key]);
    }
    snap('First null', 'uNull'); snap('Half-power cone', 'uHalf');

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var A = RA.plotBox(stage, 'Pattern, with the cone shaded'), patLayer = svg('g', {}, A.S);
    var E = RA.plotBox(stage, 'Share of the power inside the cone'), beLayer = svg('g', {}, E.S);
    var rows = RA.readout(stage, [['th', 'Cone half-angle <i>θ</i><sub>1</sub>'], ['u', '<i>u</i><sub>1</sub> = <i>ka</i> sin <i>θ</i><sub>1</sub>'],
      ['be', 'Beam efficiency'], ['out', 'Outside the cone'], ['nu', 'First null'], ['hp', 'HPBW / 2'],
      ['d0', 'Directivity <i>D</i><sub>0</sub>'], ['eta', 'Aperture efficiency']]);

    var radBox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, radBox, 'Radiometer (illustrative numbers)');
    var radControls = RA.el('div', { class: 'ra-controls' }, radBox);
    RA.slider(radControls, { label: 'Main beam sees', min: 0, max: 300, step: 1, value: tMain,
      fmt: function (v) { return v + ' K'; }, onInput: function (v) { tMain = v; update(); } });
    RA.slider(radControls, { label: 'Side lobes see', min: 0, max: 300, step: 1, value: tSide,
      fmt: function (v) { return v + ' K'; }, onInput: function (v) { tSide = v; update(); } });
    var R = svg('svg', { viewBox: '0 0 320 70', role: 'img' }, radBox), rTitle = svg('title', {}, R), radLayer = svg('g', {}, R);
    var radText = RA.el('p', {}, radBox);
    if (!radiometer) radBox.style.display = 'none';

    function update() {
      paintT();
      nex.setAttribute('aria-pressed', String(Math.abs(dl - B.NEXRAD) < 0.05));
      snaps.forEach(function (s) { s[0].setAttribute('aria-pressed', String(Math.abs(u1 - get(p)[s[1]]) < 0.005)); });
      var m = get(p), th1 = m.thetaOf(u1), be = m.be(th1);
      var xmax = m.thetaOf(UMAX) / DEG, step = RA.niceStep(xmax, 4), ticks = [];
      for (var x = 0; x <= xmax + 1e-9; x += step) ticks.push(x);
      var xfmt = function (v) { return v ? sig(v, 2) : '0'; }, K = 600, i, t;

      // pattern in dB against theta, cone shaded
      patLayer.textContent = '';
      var F = frame(patLayer, [0, xmax], [-40, 0], ticks, [-40, -30, -20, -10, 0], 'θ (degrees)', 'dB',
        xfmt, function (v) { return v; });
      var cone = Math.min(th1 / DEG, xmax);
      svg('rect', { x: F.X(0), y: F.Y(0), width: F.X(cone) - F.X(0), height: F.Y(-40) - F.Y(0), fill: 'var(--ra-warm)', 'fill-opacity': 0.15 }, patLayer);
      svg('line', { x1: F.X(cone), x2: F.X(cone), y1: F.Y(0), y2: F.Y(-40), stroke: 'var(--ra-warm)', 'stroke-width': 1.5 }, patLayer);
      var pts = [];
      for (i = 0; i <= K; i++) { t = xmax * DEG * i / K; pts.push([t / DEG, Math.max(-40, dB(Math.max(m.U(t), 1e-6)))]); }
      svg('path', { d: path(pts, F), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }, patLayer);
      A.title.textContent = TAPERS[p] + ' dish, d/λ = ' + sig(dl, 3) + ': power pattern in dB against the angle off the beam axis, ' +
        'with the cone of half-angle ' + sig(th1 / DEG, 3) + ' degrees shaded.';

      // beam efficiency against theta1, all three tapers
      beLayer.textContent = '';
      var G = frame(beLayer, [0, xmax], [0, 100], ticks, [0, 25, 50, 75, 100], 'cone half-angle θ₁ (degrees)', '%',
        xfmt, function (v) { return v; });
      [0, 1, 2].forEach(function (q) {
        var mq = get(q), cq = [];
        for (var j = 0; j <= K; j++) { var tt = xmax * DEG * j / K; cq.push([tt / DEG, 100 * mq.be(tt)]); }
        var on = q === p, tn = mq.thetaOf(mq.uNull) / DEG;
        svg('path', { d: path(cq, G), fill: 'none', stroke: on ? 'var(--accent)' : 'currentColor', 'stroke-opacity': on ? 1 : 0.4,
          'stroke-width': on ? 2 : 1.2, 'stroke-dasharray': on ? '' : q === 1 ? '5 3' : '1.5 2.5' }, beLayer);
        svg('circle', { cx: G.X(tn), cy: G.Y(100 * mq.be(tn * DEG)), r: 2.5, fill: on ? 'var(--accent)' : 'currentColor', 'fill-opacity': on ? 1 : 0.5 }, beLayer);
      });
      svg('line', { x1: G.X(cone), x2: G.X(cone), y1: G.Y(0), y2: G.Y(100 * be), stroke: 'var(--ra-warm)', 'stroke-width': 1, 'stroke-dasharray': '3 2' }, beLayer);
      svg('circle', { cx: G.X(cone), cy: G.Y(100 * be), r: 4, fill: 'var(--ra-warm)' }, beLayer);
      legend(beLayer, 200, 125, [[{ stroke: 'currentColor', 'stroke-opacity': 0.6, 'stroke-width': 1.2 }, TAPERS[0]],
        [{ stroke: 'currentColor', 'stroke-opacity': 0.6, 'stroke-width': 1.2, 'stroke-dasharray': '5 3' }, TAPERS[1]],
        [{ stroke: 'currentColor', 'stroke-opacity': 0.6, 'stroke-width': 1.2, 'stroke-dasharray': '1.5 2.5' }, TAPERS[2]]]);
      E.title.textContent = 'Beam efficiency against the cone half-angle for the uniform, parabolic and parabolic-squared dish; dots ' +
        'mark each first null. This cone holds ' + pct(be) + ' of the power.';

      rows.th.td.textContent = sig(th1 / DEG, 3) + '°';
      rows.u.td.textContent = (u1 >= m.a ? m.a : u1).toFixed(2);
      rows.be.td.textContent = pct(be);
      rows.out.td.textContent = pct(1 - be) + ' = ' + (be < 1 ? RA.signed(dB(1 - be), 1) + ' dB' : '−∞ dB');
      rows.nu.td.textContent = sig(m.thetaOf(m.uNull) / DEG, 3) + '° (' + pct(m.beU(m.uNull)) + ' inside)';
      rows.hp.td.textContent = sig(m.thetaOf(m.uHalf) / DEG, 3) + '° (' + pct(m.beU(m.uHalf)) + ' inside)';
      rows.d0.td.textContent = dB(m.D0).toFixed(2) + ' dBi';
      rows.eta.td.textContent = m.eta.toFixed(2) + ' (' + RA.signed(dB(m.eta), 2) + ' dB)';

      // radiometer: a 0 to 300 K scale with the two scene temperatures and the reading
      radLayer.textContent = '';
      var tA = antennaTemp(be, tMain, tSide), X = function (T) { return 20 + 280 * T / 300; };
      svg('line', { x1: X(0), x2: X(300), y1: 34, y2: 34, stroke: 'currentColor', 'stroke-opacity': 0.5 }, radLayer);
      for (var T = 0; T <= 300; T += 50) {
        svg('line', { x1: X(T), x2: X(T), y1: 31, y2: 37, stroke: 'currentColor', 'stroke-opacity': 0.5 }, radLayer);
        svg('text', { x: X(T), y: 52, 'font-size': 10, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, radLayer).textContent = T + ' K';
      }
      svg('line', { x1: X(tMain), x2: X(tA), y1: 34, y2: 34, stroke: 'var(--ra-warm)', 'stroke-width': 4, 'stroke-opacity': 0.5 }, radLayer);
      [[tMain, 'main', 'var(--accent)', -1], [tSide, 'side', 'currentColor', -1], [tA, 'reads', 'var(--ra-warm)', 1]].forEach(function (k) {
        svg('circle', { cx: X(k[0]), cy: 34, r: 4.5, fill: k[2] }, radLayer);
        svg('text', { x: X(k[0]), y: k[3] < 0 ? 22 : 66, 'font-size': 11, 'text-anchor': 'middle', fill: k[2] }, radLayer).textContent = k[1];
      });
      var err = tA - tMain;
      radText.textContent = 'Reads ' + tA.toFixed(1) + ' K = ' + be.toFixed(3) + ' × ' + tMain + ' + ' + (1 - be).toFixed(3) + ' × ' + tSide +
        '; error ' + (err >= 0 ? '+' : '−') + Math.abs(err).toFixed(1) + ' K.';
      rTitle.textContent = 'Temperature scale: the main beam sees ' + tMain + ' K, the side lobes ' + tSide + ' K, and the radiometer reads ' + tA.toFixed(1) + ' K.';
    }
    update();
  }

  document.querySelectorAll('[data-widget="beam-efficiency"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
