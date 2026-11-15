// friis-link: the Friis transmission equation (Balanis 2-118, 2-119), the radar range equation (2-126) and the RCS of
// a loaded antenna (2-134).
// case=link: a dB budget for three real links (Wi-Fi dipoles across a room, two 20 dBi horns on a bench, Voyager 2 to
//   the Canberra 70 m dish on 1 Jan 1996 from JPL's design control table) and the received power against distance,
//   with the near field (R < 2D^2/lambda) shaded and the distance where Friis would give back more than was sent.
//   "Hold gains" keeps G fixed as the frequency moves (the antennas are redesigned, sizes scale with lambda); "hold
//   areas" keeps the hardware, so G = 4 pi A / lambda^2.
// case=radar: one antenna sends and receives; a perfectly conducting sphere is the target, its backscatter RCS from
//   the exact Mie series. Echo power against range (slope 1/R^4) beside the one-way density (1/R^2), a detection
//   threshold and R_max = [Pt G^2 lambda^2 sigma / ((4 pi)^3 P_min)]^(1/4).
// case=rcs: Balanis (2-134) in the plane of the load's reflection coefficient. sigma / sigma_a is the squared distance
//   from Gamma_A to the point Gamma_0 = sqrt(sigma_s / sigma_a) e^(-j phi_r) - 1 (the zero-RCS load of 2-139), so the
//   contours are circles around Gamma_0 and passive loads fill the unit disk.
// Markup from _includes/readalong/friis-link.html; helpers from readalong.js (window.RA). The maths at the top has no
// DOM and is also run under node by content/balanis/checks/friis_link.py.
(function () {
  var PI = Math.PI, C0 = 299792458, AU = 1.495978707e11;
  function dB(x) { return 10 * Math.log10(x); }
  function un(d) { return Math.pow(10, d / 10); }

  // size: largest dimension of each antenna (m) at the preset frequency; other: fixed extra losses, dB
  var LINKS = {
    wifi: { label: 'Wi-Fi across a room', f: 2.45e9, pt: 20, gt: dB(1.641), gr: dB(1.641), R: 10, size: [C0 / 2.45e9 / 2, C0 / 2.45e9 / 2], other: 0, rng: [0.01, 1000] },
    bench: { label: 'Two horns on a bench', f: 10e9, pt: 0, gt: 20, gr: 20, R: 2, size: [0.14, 0.14], other: 0, rng: [0.02, 100] },
    // DESCANSO Article 4, Table 5-3: pointing -0.1 and -0.2, atmosphere -0.04, polarization -0.08 dB
    voyager: { label: 'Voyager 2 to Canberra, 1996', f: 8415e6, pt: 40.9, gt: 48.2, gr: 74.01, R: 7.273e12, size: [3.66, 70], other: -0.42, rng: [1e4, 1.5e13] },
  };

  // s: {preset, fx (frequency / preset frequency), R, hold: 'gain' | 'area', gt, gr (|Gamma|), psi (deg between the
  // two linear polarizations)}
  function link(s) {
    var L = LINKS[s.preset], f = L.f * s.fx, lam = C0 / f, k2 = s.hold === 'area' ? s.fx * s.fx : 1;
    var Gt = un(L.gt) * k2, Gr = un(L.gr) * k2;
    var size = L.size.map(function (d) { return s.hold === 'area' ? d : d / s.fx; });
    var spread = Math.pow(lam / (4 * PI * s.R), 2);
    var mt = 1 - s.gt * s.gt, mr = 1 - s.gr * s.gr, c = Math.cos(s.psi * PI / 180), plf = c * c;
    var terms = [['Pt', L.pt], ['Gt', dB(Gt)], ['space', dB(spread)], ['Gr', dB(Gr)], ['match', dB(mt * mr)], ['pol.', dB(plf)]];
    if (L.other) terms.push(['other', L.other]);
    var pr = terms.reduce(function (a, t) { return a + t[1]; }, 0);
    var big = Math.max(size[0], size[1]);
    return { f: f, lam: lam, Gt: Gt, Gr: Gr, At: Gt * lam * lam / (4 * PI), Ar: Gr * lam * lam / (4 * PI), size: size,
      spread: spread, fspl: -dB(spread), terms: terms, pr: pr, far: 2 * big * big / lam,
      absurd: lam * Math.sqrt(Gt * Gr) / (4 * PI),   // where (2-119) gives Pr = Pt
      prAt: function (R) { return pr + 20 * Math.log10(s.R / R); } };
  }

  // Exact backscatter RCS of a perfectly conducting sphere, radius a, wavenumber k (Mie series)
  function sphereRCS(a, k) {
    var x = k * a, N = Math.ceil(x + 4 * Math.cbrt(x) + 4), M = N + 20 + Math.ceil(Math.sqrt(x) * 4), j = new Array(M + 2);
    // j_n by downward recurrence, scaled to j_0 = sin x / x
    j[M + 1] = 0; j[M] = 1e-300;
    for (var n = M; n >= 1; n--) {
      j[n - 1] = (2 * n + 1) / x * j[n] - j[n + 1];
      if (Math.abs(j[n - 1]) > 1e250) for (var m = n - 1; m <= M + 1; m++) j[m] *= 1e-250;
    }
    var t0 = Math.sin(x) / x, t1 = Math.sin(x) / (x * x) - Math.cos(x) / x;   // true j_0, j_1: scale by the larger
    var scale = Math.abs(t0) > Math.abs(t1) ? t0 / j[0] : t1 / j[1];
    for (var i = 0; i <= N; i++) j[i] *= scale;
    var y = [-Math.cos(x) / x, -Math.cos(x) / (x * x) - Math.sin(x) / x];
    for (n = 1; n < N; n++) y[n + 1] = (2 * n + 1) / x * y[n] - y[n - 1];
    var sr = 0, si = 0;
    for (n = 1; n <= N; n++) {
      var hr = j[n], hi = y[n];                                      // h_n = j_n + i y_n
      var dr = x * j[n - 1] - n * j[n], di = x * y[n - 1] - n * y[n]; // [x h_n]'
      // a_n = j_n / h_n, b_n = [x j_n]' / [x h_n]'
      var h2 = hr * hr + hi * hi, d2 = dr * dr + di * di;
      var ar = j[n] * hr / h2, ai = -j[n] * hi / h2;
      var br = dr * dr / d2, bi = -dr * di / d2;
      var w = (n % 2 ? -1 : 1) * (2 * n + 1);
      sr += w * (ar - br); si += w * (ai - bi);
    }
    return PI / (k * k) * (sr * sr + si * si);
  }

  // Monostatic radar, one antenna of gain G (linear), Pt and pmin in W: echo power and maximum range
  function radar(Pt, G, lam, sigma, R) { return Pt * G * G * lam * lam * sigma / (Math.pow(4 * PI, 3) * Math.pow(R, 4)); }
  function rmax(Pt, G, lam, sigma, pmin) { return Math.pow(Pt * G * G * lam * lam * sigma / (Math.pow(4 * PI, 3) * pmin), 0.25); }

  // Balanis (2-134) with Gamma = (gr, gi): sigma / sigma_a
  function rcsLoad(s, phi, gr, gi) {
    var g0 = gamma0(s, phi), dx = g0[0] - gr, dy = g0[1] - gi;
    return dx * dx + dy * dy;
  }
  function gamma0(s, phi) { var r = Math.sqrt(s), p = phi * PI / 180; return [-1 + r * Math.cos(p), -r * Math.sin(p)]; }

  var api = { LINKS: LINKS, link: link, sphereRCS: sphereRCS, radar: radar, rmax: rmax, rcsLoad: rcsLoad, gamma0: gamma0, AU: AU };
  if (typeof module !== 'undefined') { module.exports = api; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  var SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function sup(n) { return String(n).replace('-', '⁻').replace(/\d/g, function (c) { return SUP[c]; }); }
  function sci(v, d) {   // 2.82 × 10⁻¹⁸
    if (v === 0) return '0';
    var e = Math.floor(Math.log10(Math.abs(v))), m = v / Math.pow(10, e);
    if (e >= -2 && e <= 3) return sig(v, d);
    return m.toFixed(d - 1) + ' × 10' + sup(e);
  }
  function watts(dbm) {
    var w = Math.pow(10, dbm / 10) / 1000;
    if (w >= 1e6) return sig(w / 1e6, 3) + ' MW';
    if (w >= 1e3) return sig(w / 1e3, 3) + ' kW';
    if (w >= 1) return sig(w, 3) + ' W';
    if (w >= 1e-3) return sig(w * 1e3, 3) + ' mW';
    if (w >= 1e-6) return sig(w * 1e6, 3) + ' µW';
    if (w >= 1e-9) return sig(w * 1e9, 3) + ' nW';
    return sci(w, 3) + ' W';
  }
  function dist(m) {
    if (m >= 0.1 * AU) return sig(m / AU, 3) + ' AU';
    if (m >= 1e3) return sig(m / 1e3, 3) + ' km';
    if (m >= 1) return sig(m, 3) + ' m';
    return sig(m * 100, 3) + ' cm';
  }
  function area(m2) {
    if (m2 >= 1) return sig(m2, 3) + ' m²';
    if (m2 >= 1e-4) return sig(m2 * 1e4, 3) + ' cm²';
    return sig(m2 * 1e6, 3) + ' mm²';
  }
  function freq(f) { return f >= 1e9 ? sig(f / 1e9, 3) + ' GHz' : sig(f / 1e6, 3) + ' MHz'; }
  function db1(v) { return (v < 0 ? '−' : '') + Math.abs(v).toFixed(1); }
  function logTicks(a, b) {
    var out = [], step = Math.max(1, Math.ceil((Math.log10(b) - Math.log10(a)) / 6));
    for (var e = Math.ceil(Math.log10(a)); e <= Math.floor(Math.log10(b)); e += step) out.push(Math.pow(10, e));
    return out;
  }
  function distTick(v) {
    if (v >= AU * 0.99) return sig(v / AU, 1) + ' AU';
    if (v >= 1e3) { var km = v / 1e3; return km >= 1e4 ? '10' + sup(Math.round(Math.log10(km))) + ' km' : sig(km, 1) + ' km'; }
    if (v >= 1) return sig(v, 1) + ' m';
    return sig(v * 100, 1) + ' cm';
  }
  function linTicks(lo, hi, n) {
    var st = RA.niceStep(hi - lo, n), out = [];
    for (var v = Math.ceil(lo / st) * st; v <= hi + 1e-9; v += st) out.push(Math.round(v * 1e6) / 1e6);
    return { ticks: out, step: st };
  }

  // ---- case=link ----
  function initLink(root) {
    var d = root.dataset;
    var s = { preset: d.preset || 'wifi', hold: d.hold || 'gain', fx: 1, R: 0, gt: 0, gr: 0, psi: 0 };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var paintP = RA.toggle(controls, 'Link', Object.keys(LINKS).map(function (k) { return [k, LINKS[k].label]; }),
      function () { return s.preset; }, function (v) { s.preset = v; reset(); });
    var paintH = RA.toggle(controls, 'Hold fixed', [['gain', 'Hold gains'], ['area', 'Hold areas']],
      function () { return s.hold; }, function (v) { s.hold = v; update(); });
    var rIn = RA.slider(controls, { label: 'Distance <i>R</i>', min: 0, max: 1, step: 'any', value: 0.5,
      fmt: function (u) { return dist(rFromU(u)); }, onInput: function (u) { s.R = rFromU(u); update(); } });
    var fIn = RA.slider(controls, { label: 'Frequency', min: -1, max: 1, step: 'any', value: 0,
      fmt: function (u) { return freq(LINKS[s.preset].f * Math.pow(10, u)); }, onInput: function (u) { s.fx = Math.pow(10, u); update(); } });
    var gtIn = RA.slider(controls, { label: '|Γ<sub>t</sub>|', min: 0, max: 0.9, step: 0.01, value: 0,
      fmt: function (v) { return v.toFixed(2); }, onInput: function (v) { s.gt = v; update(); } });
    var grIn = RA.slider(controls, { label: '|Γ<sub>r</sub>|', min: 0, max: 0.9, step: 0.01, value: 0,
      fmt: function (v) { return v.toFixed(2); }, onInput: function (v) { s.gr = v; update(); } });
    var pIn = RA.slider(controls, { label: 'Polarization twist', min: 0, max: 80, step: 1, value: 0,
      fmt: function (v) { return v + '°'; }, onInput: function (v) { s.psi = v; update(); } });
    function rFromU(u) { var r = LINKS[s.preset].rng; return r[0] * Math.pow(r[1] / r[0], u); }
    function uFromR(R) { var r = LINKS[s.preset].rng; return Math.log(R / r[0]) / Math.log(r[1] / r[0]); }

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var A = RA.plotBox(stage, 'The budget, step by step (dB)');
    var aLayer = svg('g', {}, A.S);
    var B = RA.plotBox(stage, 'Received power against distance');
    var bLayer = svg('g', {}, B.S);
    var rows = RA.readout(stage, [['lam', '<i>λ</i>'], ['g', '<i>G</i><sub>t</sub>, <i>G</i><sub>r</sub>'],
      ['a', '<i>A</i><sub>t</sub>, <i>A</i><sub>r</sub>'], ['fspl', 'Spreading, (<i>λ</i>/4π<i>R</i>)²'], ['pr', '<i>P</i><sub>r</sub>'],
      ['far', 'Far field from 2<i>D</i>²/<i>λ</i>'], ['abs', 'Friis gives <i>P</i><sub>r</sub> = <i>P</i><sub>t</sub> at'], ['df', 'Change from the preset frequency']]);

    function reset() {
      var L = LINKS[s.preset];
      s.R = L.R; s.fx = 1; s.gt = s.gr = 0; s.psi = 0;
      rIn.value = uFromR(L.R); fIn.value = 0; gtIn.value = grIn.value = pIn.value = 0;
      [rIn, fIn, gtIn, grIn, pIn].forEach(function (i) { i.dispatchEvent(new Event('input')); });
      update();
    }

    function update() {
      paintP(); paintH();
      var r = link(s), L = LINKS[s.preset];

      // waterfall: each step a bar from the running level; gains in accent, losses warm, Pt and Pr solid
      aLayer.textContent = '';
      var lv = [], run = 0;
      r.terms.forEach(function (t, i) { var a = run; run += t[1]; lv.push([t[0], i === 0 ? 0 : a, run, t[1]]); });
      lv.push(['Pr', 0, run, run]);
      var lo = Math.min(0, Math.min.apply(null, lv.map(function (q) { return Math.min(q[1], q[2]); })));
      var hi = Math.max(0, Math.max.apply(null, lv.map(function (q) { return Math.max(q[1], q[2]); })));
      var T = linTicks(lo, hi, 5); lo = Math.min(lo, T.ticks[0]); hi = Math.max(hi, T.ticks[T.ticks.length - 1]);
      var n = lv.length, F = RA.frame(aLayer, [0, n], [lo - (hi - lo) * 0.04, hi + (hi - lo) * 0.04], [], T.ticks, '', 'dBm',
        String, function (v) { return v < 0 ? '−' + Math.abs(v) : String(v); });
      lv.forEach(function (q, i) {
        var x0 = F.X(i + 0.15), x1 = F.X(i + 0.85), ya = F.Y(q[1]), yb = F.Y(q[2]);
        var ends = i === 0 || i === n - 1, col = ends ? 'currentColor' : q[3] >= 0 ? 'var(--accent)' : 'var(--ra-warm)';
        svg('rect', { x: x0, y: Math.min(ya, yb), width: x1 - x0, height: Math.max(1, Math.abs(yb - ya)), fill: col, 'fill-opacity': ends ? 0.55 : 0.75 }, aLayer);
        if (i < n - 1) svg('line', { x1: x1, x2: F.X(i + 1.15), y1: yb, y2: yb, stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-dasharray': '2 2' }, aLayer);
        svg('text', { x: (x0 + x1) / 2, y: 189, 'font-size': 9, 'text-anchor': 'middle', fill: 'currentColor' }, aLayer).textContent = q[0];
        var v = ends ? q[2] : q[3], txt = Math.abs(v) < 0.05 ? '0' : (v > 0 && !ends ? '+' : '') + db1(v);
        var ty = Math.min(ya, yb) - 3;
        svg('text', { x: (x0 + x1) / 2, y: Math.max(20, Math.min(185, ty)), 'font-size': 8.5, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.85 }, aLayer).textContent = txt;
      });
      A.title.textContent = 'Link budget in dB: ' + lv.map(function (q, i) { return q[0] + ' ' + db1(i === 0 || i === n - 1 ? q[2] : q[3]); }).join(', ') + '.';

      // Pr against R, log distance; the near field shaded; above Pt marked
      bLayer.textContent = '';
      var rg = L.rng, ys = [r.prAt(rg[0]), r.prAt(rg[1]), L.pt];
      var Ty = linTicks(Math.min.apply(null, ys), Math.max.apply(null, ys), 5);
      var yr = [Ty.ticks[0] - Ty.step * 0.5, Ty.ticks[Ty.ticks.length - 1] + Ty.step * 0.5];
      var G = RA.frame(bLayer, rg, yr, logTicks(rg[0], rg[1]), Ty.ticks, 'distance (log scale)', 'dBm', distTick,
        function (v) { return v < 0 ? '−' + Math.abs(v) : String(v); }, true);
      if (r.far > rg[0]) {
        var xf = G.clampX(G.X(Math.min(r.far, rg[1])));
        svg('rect', { x: G.X(rg[0]), y: 24, width: xf - G.X(rg[0]), height: 152, fill: 'currentColor', 'fill-opacity': 0.08 }, bLayer);
        svg('text', { x: G.X(rg[0]) + 4, y: 170, 'font-size': 8.5, fill: 'currentColor', 'fill-opacity': 0.75 }, bLayer).textContent = 'near field';
      }
      svg('line', { x1: G.X(rg[0]), x2: G.X(rg[1]), y1: G.Y(L.pt), y2: G.Y(L.pt), stroke: 'var(--ra-warm)', 'stroke-dasharray': '5 3', 'stroke-width': 1.3 }, bLayer);
      svg('text', { x: G.X(rg[1]) - 3, y: G.Y(L.pt) - 4, 'font-size': 8.5, 'text-anchor': 'end', fill: 'var(--ra-warm)' }, bLayer).textContent = 'Pt';
      var line = [[rg[0], r.prAt(rg[0])], [rg[1], r.prAt(rg[1])]];
      svg('path', { d: RA.path(line, G), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.2 }, bLayer);
      svg('circle', { cx: G.X(s.R), cy: G.clampY(G.Y(r.pr)), r: 3.8, fill: 'var(--accent)' }, bLayer);
      B.title.textContent = 'Received power falls 20 dB per decade of distance; near field shaded up to ' + dist(r.far) + '; here ' + db1(r.pr) + ' dBm at ' + dist(s.R) + '.';

      var gs = function (g) { return db1(dB(g)) + ' dBi'; };
      rows.lam.td.textContent = (r.lam >= 1 ? sig(r.lam, 3) + ' m' : sig(r.lam * 100, 3) + ' cm') + ' (' + freq(r.f) + ')';
      rows.g.td.textContent = gs(r.Gt) + ', ' + gs(r.Gr);
      rows.a.td.textContent = area(r.At) + ', ' + area(r.Ar);
      rows.fspl.td.textContent = '−' + r.fspl.toFixed(2) + ' dB';
      rows.pr.td.textContent = db1(r.pr) + ' dBm = ' + watts(r.pr);
      rows.far.td.textContent = dist(r.far) + (s.R < r.far ? ': this distance is inside it' : '');
      rows.abs.td.textContent = dist(r.absurd);
      var base = link({ preset: s.preset, hold: s.hold, fx: 1, R: s.R, gt: s.gt, gr: s.gr, psi: s.psi }).pr;
      var ddf = r.pr - base;
      rows.df.td.textContent = (Math.abs(ddf) < 0.05 ? '0.0' : (ddf > 0 ? '+' : '') + db1(ddf)) + ' dB (' + (s.hold === 'gain' ? '∝ λ²' : '∝ 1/λ²') + ')';
    }
    reset();
  }

  // ---- case=radar ----
  // An S-band radar with NEXRAD's dish gain (45.8 dBi at 2.85 GHz, NRC 2002); the power and threshold are our own
  // round numbers, adjustable.
  var RADAR = { f: 2.85e9, g: 45.8, pt: 1e5, pmin: -100, rng: [1e3, 1e6] };
  function initRadar(root) {
    var d = root.dataset, lam = C0 / RADAR.f, k = 2 * PI / lam, G = un(RADAR.g);
    var s = { pt: RADAR.pt, a: +(d.radius || 1), pmin: RADAR.pmin };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var ptIn = RA.slider(controls, { label: 'Peak power <i>P</i><sub>t</sub>', min: 3, max: 8, step: 'any', value: Math.log10(s.pt),
      fmt: function (u) { return watts(10 * u + 30); }, onInput: function (u) { s.pt = Math.pow(10, u); update(); } });
    var aIn = RA.slider(controls, { label: 'Sphere radius <i>a</i>', min: -3, max: Math.log10(20), step: 'any', value: Math.log10(s.a),
      fmt: function (u) { var a = Math.pow(10, u); return a >= 1 ? sig(a, 3) + ' m' : a >= 0.01 ? sig(a * 100, 3) + ' cm' : sig(a * 1000, 3) + ' mm'; },
      onInput: function (u) { s.a = Math.pow(10, u); update(); } });
    var mIn = RA.slider(controls, { label: 'Threshold <i>P</i><sub>min</sub>', min: -130, max: -90, step: 1, value: s.pmin,
      fmt: function (v) { return '−' + Math.abs(v) + ' dBm'; }, onInput: function (v) { s.pmin = v; update(); } });
    var btns = RA.el('div', { class: 'ra-controls' }, controls);
    btns.style.margin = '0';
    [['×16 power', function () { ptIn.value = Math.min(8, +ptIn.value + Math.log10(16)); ptIn.dispatchEvent(new Event('input')); }],
     ['Radius ÷100', function () { aIn.value = Math.max(-3, +aIn.value - 2); aIn.dispatchEvent(new Event('input')); }],
     ['Reset', function () { ptIn.value = Math.log10(RADAR.pt); aIn.value = Math.log10(+(d.radius || 1)); mIn.value = RADAR.pmin;
       [ptIn, aIn, mIn].forEach(function (i) { i.dispatchEvent(new Event('input')); }); }]].forEach(function (b) {
      RA.el('button', { type: 'button', class: 'ra-button' }, btns, b[0]).addEventListener('click', b[1]);
    });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var A = RA.plotBox(stage, 'Echo against range');
    var aLayer = svg('g', {}, A.S);
    var B = RA.plotBox(stage, 'Sphere RCS against radius');
    var bLayer = svg('g', {}, B.S);
    var rows = RA.readout(stage, [['lam', '<i>λ</i>, <i>G</i>'], ['sig', 'RCS <i>σ</i>'], ['ka', '<i>ka</i>, <i>σ</i>/π<i>a</i>²'],
      ['rmax', '<i>R</i><sub>max</sub>'], ['rule', '<i>R</i><sub>max</sub> ∝ (<i>P</i><sub>t</sub><i>σ</i>)<sup>1/4</sup>']]);

    // the RCS curve, computed once
    var curve = [];
    for (var u = -3; u <= Math.log10(20) + 1e-9; u += 0.01) { var a = Math.pow(10, u); curve.push([a, sphereRCS(a, k)]); }
    var ref = null;   // for the "against the start" readout

    function update() {
      var sigma = sphereRCS(s.a, k), pmin = Math.pow(10, s.pmin / 10) / 1000, Rm = rmax(s.pt, G, lam, sigma, pmin);
      if (!ref) ref = { pt: s.pt, sigma: sigma, Rm: Rm };
      var rg = RADAR.rng, dbm = function (w) { return 10 * Math.log10(w * 1000); };
      aLayer.textContent = '';
      var echo = function (R) { return dbm(radar(s.pt, G, lam, sigma, R)); };
      var one = function (R) { return dbm(s.pt * G / (4 * PI * R * R) * lam * lam / (4 * PI)); };   // into an isotropic antenna at the target
      var F = RA.frame(aLayer, rg, [-180, 40], [1e3, 1e4, 1e5, 1e6], [-160, -120, -80, -40, 0, 40], 'range (log scale)', 'dBm',
        distTick, function (v) { return v < 0 ? '−' + Math.abs(v) : String(v); }, true);
      svg('path', { d: RA.path([[rg[0], one(rg[0])], [rg[1], one(rg[1])]], F), fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.55, 'stroke-width': 1.5, 'stroke-dasharray': '5 3' }, aLayer);
      svg('path', { d: RA.path([[rg[0], echo(rg[0])], [rg[1], echo(rg[1])]], F), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.2 }, aLayer);
      svg('line', { x1: F.X(rg[0]), x2: F.X(rg[1]), y1: F.Y(s.pmin), y2: F.Y(s.pmin), stroke: 'var(--ra-warm)', 'stroke-width': 1.3 }, aLayer);
      svg('text', { x: F.X(rg[0]) + 3, y: F.Y(s.pmin) + 11, 'font-size': 8.5, fill: 'var(--ra-warm)' }, aLayer).textContent = 'threshold';
      if (Rm >= rg[0] && Rm <= rg[1]) {
        svg('line', { x1: F.X(Rm), x2: F.X(Rm), y1: F.Y(s.pmin), y2: 176, stroke: 'var(--accent)', 'stroke-dasharray': '2 2' }, aLayer);
        svg('circle', { cx: F.X(Rm), cy: F.Y(s.pmin), r: 3.8, fill: 'var(--accent)' }, aLayer);
      }
      RA.legend(aLayer, 150, 36, [[{ stroke: 'currentColor', 'stroke-opacity': 0.55, 'stroke-width': 1.5, 'stroke-dasharray': '5 3' }, 'one way, 1/R²'],
        [{ stroke: 'var(--accent)', 'stroke-width': 2.5 }, 'echo, 1/R⁴']]);
      A.title.textContent = 'Echo power against range, falling 40 dB per decade, beside the one-way power falling 20 dB per decade; maximum range ' + dist(Rm) + '.';

      bLayer.textContent = '';
      var G2 = RA.frame(bLayer, [1e-3, 20], [1e-12, 1e4], [1e-3, 1e-2, 0.1, 1, 10], [1e-12, 1e-8, 1e-4, 1, 1e4], 'radius (log scale)', 'm²',
        function (v) { return v >= 1 ? v + ' m' : v >= 0.01 ? v * 100 + ' cm' : v * 1000 + ' mm'; },
        function (v) { return v === 1 ? '1' : '10' + sup(Math.round(Math.log10(v))); }, true, true);
      svg('path', { d: RA.path([[1e-3, PI * 1e-6], [20, PI * 400]], G2), fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.55, 'stroke-dasharray': '5 3', 'stroke-width': 1.5 }, bLayer);
      svg('path', { d: RA.path(curve, G2), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }, bLayer);
      var xl = G2.X(lam / (2 * PI));
      svg('line', { x1: xl, x2: xl, y1: 24, y2: 176, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-dasharray': '2 3' }, bLayer);
      svg('text', { x: xl + 3, y: 172, 'font-size': 8.5, fill: 'currentColor', 'fill-opacity': 0.75 }, bLayer).textContent = 'ka = 1';
      svg('circle', { cx: G2.X(s.a), cy: G2.clampY(G2.Y(sigma)), r: 3.8, fill: 'var(--accent)' }, bLayer);
      RA.legend(bLayer, 52, 36, [[{ stroke: 'var(--accent)', 'stroke-width': 2.5 }, 'exact (Mie)'],
        [{ stroke: 'currentColor', 'stroke-opacity': 0.55, 'stroke-dasharray': '5 3', 'stroke-width': 1.5 }, 'πa², its shadow']]);
      B.title.textContent = 'Backscatter radar cross section of a metal sphere against its radius at ' + freq(RADAR.f) + ': it follows pi a squared above ka = 1 and falls as a to the sixth below.';

      rows.lam.td.textContent = sig(lam * 100, 3) + ' cm, ' + RADAR.g + ' dBi';
      rows.sig.td.textContent = area(sigma) + ' = ' + db1(dB(sigma)) + ' dBsm';
      rows.ka.td.textContent = sig(k * s.a, 3) + ', ' + sig(sigma / (PI * s.a * s.a), 3);
      rows.rmax.td.textContent = dist(Rm);
      rows.rule.td.textContent = '×' + sig(s.pt / ref.pt, 3) + ' power, ×' + sci(sigma / ref.sigma, 3) + ' RCS: range ×' + sig(Rm / ref.Rm, 3);
    }
    update();
  }

  // ---- case=rcs ----
  function initRcs(root) {
    var d = root.dataset, s = { s: +(d.ratio || 4), phi: +(d.phi || 0), g: [0, 0] };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var sIn = RA.slider(controls, { label: '<i>σ</i><sub>s</sub>/<i>σ</i><sub>a</sub>', min: 0, max: 16, step: 0.05, value: s.s,
      fmt: function (v) { return v.toFixed(2); }, onInput: function (v) { s.s = v; update(); } });
    var pIn = RA.slider(controls, { label: 'Phase <i>φ</i><sub>r</sub>', min: -180, max: 180, step: 1, value: s.phi,
      fmt: function (v) { return (v < 0 ? '−' : '') + Math.abs(v) + '°'; }, onInput: function (v) { s.phi = v; update(); } });
    var btns = RA.el('div', { class: 'ra-controls' }, controls);
    btns.style.margin = '0';
    var LOADS = [['Short', [-1, 0]], ['Open', [1, 0]], ['Matched', [0, 0]]];
    LOADS.forEach(function (L) {
      RA.el('button', { type: 'button', class: 'ra-button' }, btns, L[0]).addEventListener('click', function () { s.g = L[1].slice(); update(); });
    });
    RA.el('button', { type: 'button', class: 'ra-button' }, btns, 'Thin resonant dipole').addEventListener('click', function () {
      sIn.value = 4; pIn.value = 0; s.g = [-1, 0];
      [sIn, pIn].forEach(function (i) { i.dispatchEvent(new Event('input')); });
    });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var box = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, box, 'The load’s Γ plane: drag the load');
    var S = svg('svg', { viewBox: '-1.35 -1.35 2.7 2.7', role: 'img', tabindex: 0, style: 'touch-action: none; cursor: crosshair' }, box);
    var title = svg('title', {}, S);
    var defs = svg('defs', {}, S), cp = svg('clipPath', { id: 'friis-rcs-disk-' + Math.random().toString(36).slice(2) }, defs);
    svg('circle', { cx: 0, cy: 0, r: 1 }, cp);
    svg('circle', { cx: 0, cy: 0, r: 1, fill: 'currentColor', 'fill-opacity': 0.05, stroke: 'currentColor', 'stroke-opacity': 0.5, 'stroke-width': 0.012 }, S);
    svg('line', { x1: -1.25, x2: 1.25, y1: 0, y2: 0, stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.006 }, S);
    svg('line', { x1: 0, x2: 0, y1: -1.25, y2: 1.25, stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.006 }, S);
    [['short', -1], ['open', 1]].forEach(function (q) {
      svg('text', { x: q[1] * 1.08, y: 0.17, 'font-size': 0.085, 'text-anchor': q[1] < 0 ? 'end' : 'start', fill: 'currentColor', 'fill-opacity': 0.75 }, S).textContent = q[0];
    });
    svg('text', { x: 0.05, y: 0.15, 'font-size': 0.085, fill: 'currentColor', 'fill-opacity': 0.75 }, S).textContent = 'matched';
    svg('text', { x: 1.3, y: -1.2, 'font-size': 0.08, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.6 }, S).textContent = 'Re Γ →';
    var rings = svg('g', { 'clip-path': 'url(#' + cp.id + ')' }, S);
    var z0 = svg('g', {}, S);
    var dot = svg('circle', { r: 0.05, fill: 'var(--accent)', stroke: 'var(--bg)', 'stroke-width': 0.015 }, S);
    var rows = RA.readout(stage, [['here', 'This load'], ['short', 'Short, <i>σ</i><sub>s</sub>'], ['open', 'Open'], ['match', 'Matched'],
      ['span', 'Over all passive loads'], ['range', 'Matched, any <i>φ</i><sub>r</sub>'], ['book', 'As printed in (2-138)'], ['dip', 'If <i>σ</i><sub>a</sub> = 0.215<i>λ</i>²']]);

    function pick(e) {
      var r = S.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 2.7 - 1.35, y = (e.clientY - r.top) / r.height * 2.7 - 1.35;
      var m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; }
      s.g = [x, -y]; update();
    }
    var drag = false;
    S.addEventListener('pointerdown', function (e) { drag = true; S.setPointerCapture(e.pointerId); pick(e); });
    S.addEventListener('pointermove', function (e) { if (drag) pick(e); });
    S.addEventListener('pointerup', function () { drag = false; });
    S.addEventListener('keydown', function (e) {
      var st = 0.05, k = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, st], ArrowDown: [0, -st] }[e.key];
      if (!k) return;
      e.preventDefault();
      var x = s.g[0] + k[0], y = s.g[1] + k[1], m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; }
      s.g = [x, y]; update();
    });

    function f(v) { return sig(v, 3) + ' <i>σ</i><sub>a</sub>'; }
    function update() {
      var g0 = gamma0(s.s, s.phi), m0 = Math.hypot(g0[0], g0[1]);
      rings.textContent = ''; z0.textContent = '';
      [0.25, 1, 4, 9, 16].forEach(function (lv) {
        var r = Math.sqrt(lv);
        svg('circle', { cx: g0[0], cy: -g0[1], r: r, fill: 'var(--accent)', 'fill-opacity': 0.07, stroke: 'var(--accent)', 'stroke-opacity': 0.6, 'stroke-width': 0.01 }, rings);
        // label each ring where it crosses the line from Gamma_0 through the disk centre, if that point is inside
        var ux = m0 > 1e-6 ? -g0[0] / m0 : 1, uy = m0 > 1e-6 ? g0[1] / m0 : 0, lx = g0[0] + ux * r, ly = -g0[1] + uy * r;
        if (Math.hypot(lx, ly) < 0.95) svg('text', { x: lx + 0.02, y: ly - 0.02, 'font-size': 0.07, fill: 'var(--accent)' }, rings).textContent = lv + 'σa';
      });
      var inside = m0 <= 1;
      svg('circle', { cx: g0[0], cy: -g0[1], r: 0.035, fill: inside ? 'var(--ra-warm)' : 'none', stroke: 'var(--ra-warm)', 'stroke-width': 0.015 }, z0);
      if (Math.abs(g0[0]) < 1.3 && Math.abs(g0[1]) < 1.3)
        svg('text', { x: g0[0] + 0.06, y: -g0[1] - 0.05, 'font-size': 0.075, fill: 'var(--ra-warm)' }, z0).textContent = 'zero RCS' + (inside ? '' : ' (not passive)');
      dot.setAttribute('cx', s.g[0]); dot.setAttribute('cy', -s.g[1]);
      var here = rcsLoad(s.s, s.phi, s.g[0], s.g[1]);
      title.textContent = 'Reflection coefficient plane of the load. Contours of total RCS are circles around the zero-RCS point at ' +
        g0[0].toFixed(2) + (g0[1] < 0 ? ' − j' : ' + j') + Math.abs(g0[1]).toFixed(2) + '; this load gives ' + sig(here, 3) + ' times the antenna-mode RCS.';
      rows.here.td.innerHTML = 'Γ = ' + s.g[0].toFixed(2) + (s.g[1] < 0 ? ' − j' : ' + j') + Math.abs(s.g[1]).toFixed(2) + ': ' + f(here);
      rows.short.td.innerHTML = f(rcsLoad(s.s, s.phi, -1, 0));
      rows.open.td.innerHTML = f(rcsLoad(s.s, s.phi, 1, 0));
      rows.match.td.innerHTML = f(rcsLoad(s.s, s.phi, 0, 0));
      rows.span.td.innerHTML = f(Math.pow(Math.max(0, m0 - 1), 2)) + ' to ' + f(Math.pow(m0 + 1, 2));
      var rt = Math.sqrt(s.s);
      rows.range.td.innerHTML = f(Math.pow(rt - 1, 2)) + ' to ' + f(Math.pow(rt + 1, 2));
      rows.book.td.innerHTML = f(Math.abs(s.s - 1)) + ' to ' + f(s.s + 1);
      rows.dip.td.innerHTML = 'this load ' + sig(here * 0.2148, 3) + '<i>λ</i>²';
    }
    update();
  }

  document.querySelectorAll('[data-widget="friis-link"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    root.textContent = '';
    var c = root.dataset.case || 'link';
    (c === 'radar' ? initRadar : c === 'rcs' ? initRcs : initLink)(root);
  });
})();
