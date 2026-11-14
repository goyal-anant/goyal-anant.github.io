// efficiency-chain: where the power from a matched 1 W source goes, Balanis eqs. (2-44), (2-45): e0 = er ec ed.
// All three cases at 2.45 GHz (Wi-Fi), copper with sigma = 5.7e7 S/m as in Balanis Example 2.13.
//   dipole  a thin copper dipole of length L, radius b, on a 50 or 75 ohm line. Zin from the induced-EMF formulas,
//           Balanis eqs. (8-60a, b) and (8-61a, b); wire loss from eq. (2-90b) with the sinusoidal current.
//   short   a short dipole, the same formulas. With the matching coil: a series coil of quality factor Q cancels Xin
//           (adding |Xin| / Q in series) and an ideal lossless transformer brings the rest to 50 ohm, so Gamma = 0.
//   patch   a rectangular patch designed by Balanis eqs. (14-1) to (14-7), fed at its matched point (Gamma = 0),
//           with the thin-substrate quality factors of eqs. (14-83) to (14-87): e_c and e_d from Qrad, Qc and Qd.
// Markup from _includes/readalong/efficiency-chain.html; helpers from readalong.js (window.RA). The maths at the top
// has no DOM and is also run under node by content/balanis/checks/efficiency_chain.py.
(function () {
  var PI = Math.PI, C0 = 299792458, MU0 = 4e-7 * PI, EPS0 = 8.854187817e-12, EULER = 0.5772156649015329;
  var F = 2.45e9, LAMBDA = C0 / F, SIGMA = 5.7e7, ETA = 120 * PI;
  var SUBS = { fr4: { name: 'FR-4', er: 4.04, tand: 0.021 }, ro4003: { name: 'RO4003C', er: 3.55, tand: 0.0027 } };

  // Sine and cosine integrals by their power series (arguments here stay below 8, where the series is accurate)
  function Si(x) {
    var s = 0, t = x, k = 0;
    while (Math.abs(t) > 1e-17 * Math.max(1, Math.abs(s)) || k < 2) {
      s += t / (2 * k + 1);
      t *= -x * x / ((2 * k + 2) * (2 * k + 3));
      k++;
    }
    return s;
  }
  function Ci(x) {
    var s = 0, t = -x * x / 2, k = 1;
    while (Math.abs(t) > 1e-17 * Math.max(1, Math.abs(s)) || k < 2) {
      s += t / (2 * k);
      t *= -x * x / ((2 * k + 1) * (2 * k + 2));
      k++;
    }
    return EULER + Math.log(x) + s;
  }
  // Input impedance of a centre-fed dipole, length L and radius a in wavelengths: Balanis (8-60a, b), (8-61a, b)
  function dipoleZ(L, a) {
    var kl = 2 * PI * L, s = Math.sin(kl), c = Math.cos(kl);
    var Rm = ETA / (2 * PI) * (EULER + Math.log(kl) - Ci(kl) + 0.5 * s * (Si(2 * kl) - 2 * Si(kl)) +
      0.5 * c * (EULER + Math.log(kl / 2) + Ci(2 * kl) - 2 * Ci(kl)));
    var Xm = ETA / (4 * PI) * (2 * Si(kl) + c * (2 * Si(kl) - Si(2 * kl)) -
      s * (2 * Ci(kl) - Ci(2 * kl) - Ci(2 * (2 * PI) * a * a / L)));
    var t = Math.pow(Math.sin(kl / 2), 2);
    return { R: Rm / t, X: Xm / t };
  }
  // Copper loss of the wire, referred to the input: surface resistance Rs (2-90b) per unit length Rs / (2 pi b),
  // weighted by |I(z)|^2 of the sinusoidal current, I(z) = I0 sin(k(l/2 - |z|)). For l = lambda/2 this is Rhf / 2.
  function wireLoss(L, b) {
    var k = 2 * PI / LAMBDA, l = L * LAMBDA, Rs = Math.sqrt(PI * F * MU0 / SIGMA);
    var Rmax = Rs / (2 * PI * b) * (l / 2 - Math.sin(k * l) / (2 * k));
    return Rmax / Math.pow(Math.sin(k * l / 2), 2);
  }
  function gamma(R, X, Z0) {   // |Gamma| for Zin = R + jX on a line of real Z0
    var nr = R - Z0, dr = R + Z0;
    return Math.sqrt((nr * nr + X * X) / (dr * dr + X * X));
  }

  // Each case returns the impedance numbers and the ledger: the fraction of the incident power each stage removes.
  function dipole(L, bmm, Z0) {
    var b = bmm / 1000, z = dipoleZ(L, b / LAMBDA), RL = wireLoss(L, b), g = gamma(z.R + RL, z.X, Z0);
    var er = 1 - g * g, ec = z.R / (z.R + RL);
    return { Rr: z.R, X: z.X, RL: RL, Rin: z.R + RL, G: g, er: er, ec: ec, ed: 1, e0: er * ec,
      loss: [['refl', 1 - er], ['metal', er * (1 - ec)]] };
  }
  function shortDipole(L, bmm, Q, coil) {
    var b = bmm / 1000, z = dipoleZ(L, b / LAMBDA), RL = wireLoss(L, b);
    if (!coil) {
      var g = gamma(z.R + RL, z.X, 50), er = 1 - g * g, ec0 = z.R / (z.R + RL);
      return { Rr: z.R, X: z.X, RL: RL, Rc: 0, Rin: z.R + RL, G: g, er: er, ec: ec0, ed: 1, e0: er * ec0,
        loss: [['refl', 1 - er], ['metal', er * (1 - ec0)]] };
    }
    var Rc = Math.abs(z.X) / Q, Rt = z.R + RL + Rc;
    return { Rr: z.R, X: z.X, RL: RL, Rc: Rc, Rin: Rt, G: 0, er: 1, ec: z.R / Rt, ed: 1, e0: z.R / Rt,
      loss: [['refl', 0], ['coil', Rc / Rt], ['metal', RL / Rt]] };
  }
  // Patch at F on a substrate of thickness h (mm): W, L from (14-6), (14-1), (14-2), (14-7); G1 from (14-12) by
  // Simpson's rule, Grad = 2 G1 (both slots, no mutual term); Qrad (14-86) with K = L/4 and Gt/l = Grad/W (14-87).
  function patch(sub, hmm) {
    var S = SUBS[sub], h = hmm / 1000, er = S.er;
    var W = C0 / (2 * F) * Math.sqrt(2 / (er + 1));
    var ee = (er + 1) / 2 + (er - 1) / 2 / Math.sqrt(1 + 12 * h / W);
    var dL = 0.412 * h * (ee + 0.3) * (W / h + 0.264) / ((ee - 0.258) * (W / h + 0.8));
    var Lp = C0 / (2 * F * Math.sqrt(ee)) - 2 * dL;
    var k0 = 2 * PI * F / C0, N = 2000, dt = PI / N, I1 = 0;
    for (var i = 0; i <= N; i++) {
      var t = i * dt, c = Math.cos(t), st = Math.sin(t), v;
      v = Math.abs(c) < 1e-12 ? Math.pow(k0 * W / 2, 2) : Math.pow(Math.sin(k0 * W / 2 * c) / c, 2);
      I1 += (i === 0 || i === N ? 1 : i % 2 ? 4 : 2) * v * st * st * st;
    }
    I1 *= dt / 3;
    var G1 = I1 / (120 * PI * PI), Grad = 2 * G1;
    var Qrad = 2 * (2 * PI * F) * EPS0 * er * (Lp / 4) / (h * Grad / W);
    var Qc = h * Math.sqrt(PI * F * MU0 * SIGMA), Qd = 1 / S.tand;
    var Qt = 1 / (1 / Qrad + 1 / Qc + 1 / Qd);
    var ecd = Qt / Qrad;
    return { W: W, L: Lp, Qrad: Qrad, Qc: Qc, Qd: Qd, Qt: Qt, G: 0, er: 1, ecd: ecd, e0: ecd,
      ec: (1 / Qrad) / (1 / Qrad + 1 / Qc), ed: (1 / Qrad) / (1 / Qrad + 1 / Qd),
      loss: [['refl', 0], ['metal', Qt / Qc], ['diel', Qt / Qd]] };
  }

  var api = { F: F, LAMBDA: LAMBDA, SIGMA: SIGMA, SUBS: SUBS, Si: Si, Ci: Ci, dipoleZ: dipoleZ, wireLoss: wireLoss,
    gamma: gamma, dipole: dipole, shortDipole: shortDipole, patch: patch };
  if (typeof module !== 'undefined') { module.exports = api; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  function dB(v) { return 10 * Math.log10(v); }
  function dBtxt(v) { return v >= 0.99995 ? '0.00 dB' : v <= 0 ? '−∞ dB' : '−' + (-dB(v)).toFixed(2) + ' dB'; }
  function pct(v) { return v >= 0.9995 || v < 0.1 ? sig(100 * v, 3) + '%' : (100 * v).toFixed(1) + '%'; }
  function ohm(v) { return (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : Math.abs(v) >= 1 ? v.toFixed(2) : v.toFixed(3)) + ' Ω'; }
  var STAGE = {
    refl: { label: 'reflected back to the source', fill: 'currentColor', op: 0.35 },
    coil: { label: 'heat in the matching coil', fill: 'var(--art-maroon)', op: 0.9 },
    metal: { label: 'heat in the copper', fill: 'var(--ra-warm)', op: 0.9 },
    diel: { label: 'heat in the substrate', fill: 'var(--art-turmeric)', op: 0.9 }
  };

  // The ledger: one bar per stage, the power still travelling after it, and the slice the stage removed in its colour.
  function ledger(layer, r) {
    layer.textContent = '';
    var L = 8, Wb = 304, y = 14, P = 1, rows = [[null, 0]];
    r.loss.forEach(function (s) { if (s[0] !== 'refl' || s[1] > 0) rows.push(s); });
    rows.forEach(function (row) {
      var lost = row[1], before = P;
      P -= lost;
      svg('text', { x: L, y: y, 'font-size': 10, fill: 'currentColor', 'fill-opacity': 0.75 }, layer).textContent = row[0] ?
        STAGE[row[0]].label.charAt(0).toUpperCase() + STAGE[row[0]].label.slice(1) + ': ' +
        (lost < 1e-4 ? 'under 0.1 mW' : sig(lost, 3) + ' W (' + dBtxt(P / before) + ')') : '1 W leaves the source';
      if (row[0]) svg('rect', { x: L + Wb * Math.max(0, P), y: y + 4, width: Wb * lost, height: 12, fill: STAGE[row[0]].fill, 'fill-opacity': STAGE[row[0]].op }, layer);
      svg('rect', { x: L, y: y + 4, width: Wb * Math.max(0, P), height: 12, fill: 'var(--accent)', 'fill-opacity': 0.55 }, layer);
      y += 32;
    });
    svg('text', { x: L, y: y, 'font-size': 11, 'font-weight': 600, fill: 'currentColor' }, layer).textContent =
      'Radiated: ' + sig(Math.max(0, P), 3) + ' W = ' + dBtxt(P) + ' (e₀)';
    return y + 8;
  }

  function init(root) {
    var d = root.dataset, kind = d.case || 'dipole';
    var st = { L: +(d.length || 0.5), b: +(d.radius || 0.5), Z0: +(d.z0 || 50), Q: +(d.q || 100), coil: d.coil !== 'off',
      sub: d.substrate === 'ro4003' ? 'ro4003' : 'fr4', h: +(d.h || 1.6) };
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root), paint = [];
    if (kind === 'dipole') {
      RA.slider(controls, { label: 'Length', min: 0.40, max: 0.55, step: 0.0025, value: st.L, fmt: function (v) { return v.toFixed(4) + ' λ'; }, onInput: function (v) { st.L = v; update(); } });
      RA.slider(controls, { label: 'Radius', min: 0.1, max: 2, step: 0.05, value: st.b, fmt: function (v) { return v.toFixed(2) + ' mm'; }, onInput: function (v) { st.b = v; update(); } });
      paint.push(RA.toggle(controls, 'Line', [[50, '50 Ω line'], [75, '75 Ω line']], function () { return st.Z0; }, function (v) { st.Z0 = v; update(); }));
    } else if (kind === 'short') {
      RA.slider(controls, { label: 'Length', min: 0, max: 1, step: 'any', value: Math.log(st.L / 0.04) / Math.log(0.3 / 0.04),
        fmt: function (s) { return (0.04 * Math.pow(0.3 / 0.04, s)).toFixed(3) + ' λ'; }, onInput: function (s) { st.L = 0.04 * Math.pow(0.3 / 0.04, s); update(); } });
      var qs = RA.slider(controls, { label: 'Coil <i>Q</i>', min: 0, max: 1, step: 'any', value: Math.log(st.Q / 20) / Math.log(25),
        fmt: function (s) { return String(Math.round(20 * Math.pow(25, s))); }, onInput: function (s) { st.Q = 20 * Math.pow(25, s); update(); } });
      paint.push(RA.toggle(controls, 'Matching', [[true, 'Coil + transformer'], [false, 'Straight on 50 Ω']], function () { return st.coil; }, function (v) { st.coil = v; qs.disabled = !v; update(); }));
    } else {
      paint.push(RA.toggle(controls, 'Substrate', [['fr4', 'FR-4'], ['ro4003', 'RO4003C']], function () { return st.sub; }, function (v) { st.sub = v; update(); }));
      RA.slider(controls, { label: 'Thickness', min: 0.4, max: 3.2, step: 0.05, value: st.h, fmt: function (v) { return v.toFixed(2) + ' mm'; }, onInput: function (v) { st.h = v; update(); } });
    }

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var lbox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, lbox, 'Where 1 W goes');
    var LS = svg('svg', { viewBox: '0 0 320 210', role: 'img' }, lbox), Ltitle = svg('title', {}, LS), lLayer = svg('g', {}, LS);
    var SW = RA.plotBox(stage, kind === 'dipole' ? 'e₀ against length' : kind === 'short' ? 'e₀ against length (log scale)' : 'e₀ against thickness');
    var sLayer = svg('g', {}, SW.S);
    var rowsList = kind === 'patch' ?
      [['size', 'Patch W × L'], ['q', '<i>Q</i><sub>rad</sub>, <i>Q</i><sub>c</sub>, <i>Q</i><sub>d</sub>'], ['bw', 'Bandwidth, 1/<i>Q</i><sub>t</sub>'], ['ec', '<i>e</i><sub>c</sub> alone, <i>e</i><sub>d</sub> alone'], ['e0', '<i>e</i><sub>0</sub> = <i>e</i><sub>cd</sub>']] :
      [['zin', '<i>Z</i><sub>in</sub> at the antenna'], ['rl', kind === 'short' ? 'Copper, coil' : 'Copper loss <i>R</i><sub>L</sub>'], ['g', '|Γ|, VSWR'], ['er', '<i>e</i><sub>r</sub>'], ['ecd', '<i>e</i><sub>cd</sub>'], ['e0', '<i>e</i><sub>0</sub>']];
    var rows = RA.readout(root, rowsList);

    function model(x) {
      if (kind === 'dipole') return dipole(x == null ? st.L : x, st.b, st.Z0);
      if (kind === 'short') return shortDipole(x == null ? st.L : x, st.b, st.Q, st.coil);
      return patch(st.sub, x == null ? st.h : x);
    }
    function sweep() {
      sLayer.textContent = '';
      var xr, xt, logx = false, xlab, xf, curves = [], pts = 120;
      if (kind === 'dipole') { xr = [0.40, 0.55]; xt = [0.40, 0.45, 0.50, 0.55]; xlab = 'length / λ'; xf = function (v) { return v.toFixed(2); }; }
      else if (kind === 'short') { xr = [0.04, 0.3]; xt = [0.05, 0.1, 0.2, 0.3]; logx = true; xlab = 'length / λ (log scale)'; xf = String; }
      else { xr = [0.4, 3.2]; xt = [0.4, 1, 1.6, 2.4, 3.2]; xlab = 'substrate thickness (mm)'; xf = String; }
      var at = function (j) { return logx ? xr[0] * Math.pow(xr[1] / xr[0], j / pts) : xr[0] + (xr[1] - xr[0]) * j / pts; };
      var yr = kind === 'short' ? [-40, 0] : [0, 100], yt = kind === 'short' ? [-40, -30, -20, -10, 0] : [0, 25, 50, 75, 100];
      var val = function (r) { return kind === 'short' ? Math.max(-40, dB(r.e0)) : 100 * r.e0; };
      var G = RA.frame(sLayer, xr, yr, xt, yt, xlab, kind === 'short' ? 'e₀ (dB)' : 'e₀ (%)', xf, String, logx, false);
      var other;
      if (kind === 'dipole') other = [[50, 'on 50 Ω'], [75, 'on 75 Ω']].map(function (o) { return [function (x) { return dipole(x, st.b, o[0]); }, o[1], o[0] === st.Z0]; });
      else if (kind === 'short') other = [[true, 'coil, Q ' + Math.round(st.Q)], [false, 'straight on 50 Ω']].map(function (o) { return [function (x) { return shortDipole(x, st.b, st.Q, o[0]); }, o[1], o[0] === st.coil]; });
      else other = [['fr4', 'FR-4'], ['ro4003', 'RO4003C']].map(function (o) { return [function (x) { return patch(o[0], x); }, o[1], o[0] === st.sub]; });
      other.forEach(function (o, k) {
        var line = [];
        for (var j = 0; j <= pts; j++) { var x = at(j); line.push([x, val(o[0](x))]); }
        var sty = k ? { stroke: 'var(--ra-warm)', 'stroke-width': 1.8, 'stroke-dasharray': '5 3' } : { stroke: 'var(--accent)', 'stroke-width': 1.8 };
        svg('path', Object.assign({ d: RA.path(line, G), fill: 'none', 'stroke-opacity': o[2] ? 1 : 0.5 }, sty), sLayer);
        RA.legend(sLayer, 60 + 110 * k, 12, [[sty, o[1]]]);
      });
      var cur = model(), x0 = kind === 'patch' ? st.h : st.L;
      svg('circle', { cx: G.X(x0), cy: G.clampY(G.Y(val(cur))), r: 4, fill: 'var(--accent)', stroke: 'var(--bg, white)', 'stroke-width': 1 }, sLayer);
      SW.title.textContent = 'Total efficiency against ' + (kind === 'patch' ? 'substrate thickness' : 'dipole length') + ' for ' +
        other.map(function (o) { return o[1]; }).join(' and ') + '; the dot is the current setting, ' + pct(cur.e0) + '.';
    }

    function update() {
      paint.forEach(function (p) { p(); });
      var r = model(), hgt = ledger(lLayer, r);
      LS.setAttribute('viewBox', '0 0 320 ' + Math.max(120, hgt));
      Ltitle.textContent = 'Of 1 W from the source: ' + r.loss.filter(function (s) { return s[1] > 0; }).map(function (s) { return STAGE[s[0]].label + ' ' + sig(s[1], 3) + ' W'; }).join(', ') + '; radiated ' + sig(r.e0, 3) + ' W.';
      sweep();
      if (kind === 'patch') {
        rows.size.td.textContent = (1000 * r.W).toFixed(1) + ' × ' + (1000 * r.L).toFixed(1) + ' mm';
        rows.q.td.textContent = Math.round(r.Qrad) + ', ' + Math.round(r.Qc) + ', ' + Math.round(r.Qd);
        rows.bw.td.textContent = (100 / r.Qt).toFixed(2) + '% = ' + Math.round(2450 / r.Qt) + ' MHz';
        rows.ec.td.textContent = pct(r.ec) + ', ' + pct(r.ed);
      } else {
        rows.zin.td.textContent = ohm(r.Rr + r.RL) + (r.X < 0 ? ' − j' : ' + j') + ohm(Math.abs(r.X));
        rows.rl.td.textContent = kind === 'short' ? ohm(r.RL) + ', ' + (st.coil ? ohm(r.Rc) : 'none') : ohm(r.RL);
        rows.g.td.textContent = r.G.toFixed(3) + ', ' + (r.G > 0.999 ? '∞' : ((1 + r.G) / (1 - r.G)).toFixed(2));
        rows.er.td.textContent = pct(r.er) + ' = ' + dBtxt(r.er);
        rows.ecd.td.textContent = pct(r.ec) + ' = ' + dBtxt(r.ec);
      }
      rows.e0.td.textContent = pct(r.e0) + ' = ' + dBtxt(r.e0);
    }
    update();
  }

  document.querySelectorAll('[data-widget="efficiency-chain"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
