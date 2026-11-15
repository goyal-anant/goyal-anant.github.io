// wire-loss: the resistance of a round metal wire at radio frequencies, and what it does to radiation efficiency
// e_cd = Rr / (Rr + RL), Balanis (2-90).
//   skin    resistance per metre of a straight round wire against b/delta: exact (Schelkunoff 1934, eq. 65, with
//           ordinary Bessel functions of k b = (1 - j) b / delta), the dc value (2-90a) and the thin-skin value (2-90b).
//   dipole  a centre-fed dipole with the sinusoidal current: Rr from the induced-EMF formula (efficiency-chain's
//           dipoleZ, Balanis 8-60a), RL from the exact per-metre resistance weighted by |I(z)|^2. Both are referred
//           to the feed; e_cd doesn't depend on that choice as long as both use the same current.
//   loop    a single-turn small loop, Rr = 20 pi^2 (C/lambda)^4 (Balanis 5-24) and RL = C times the per-metre
//           resistance (Balanis p. 239, uniform current), against a dipole made of the same length of wire.
// Metals: copper 5.7e7 S/m (Balanis Example 2.13), aluminium 6061-T6 at 43% IACS (100% IACS = 58 MS/m, NBS
// Handbook 100), stainless 304 at 72 microhm-cm. Markup from _includes/readalong/wire-loss.html; helpers from
// readalong.js (window.RA). The maths at the top has no DOM and is also run under node by
// content/balanis/checks/wire_loss.py.
(function () {
  var node = typeof module !== 'undefined';
  var E = node ? require('./efficiency-chain.js') : window.EfficiencyChain;
  var PI = Math.PI, C0 = 299792458, MU0 = 4e-7 * PI;
  var METALS = { cu: { name: 'Copper', sigma: 5.7e7 }, al: { name: 'Aluminium 6061', sigma: 0.43 * 5.8e7 }, ss: { name: 'Stainless 304', sigma: 1 / 72e-8 } };

  // complex numbers as [re, im]
  function mul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
  function div(a, b) { var d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; }
  // J0(z) and J1(z) by their power series; used for |z| up to about 30, where the series still holds 12 digits
  function bessel01(z) {
    var h = [z[0] / 2, z[1] / 2], h2 = mul(h, h), t0 = [1, 0], t1 = h, j0 = [1, 0], j1 = h;
    for (var k = 1; k < 200; k++) {
      t0 = mul(t0, h2); t0 = [-t0[0] / (k * k), -t0[1] / (k * k)];
      t1 = mul(t1, h2); t1 = [-t1[0] / (k * (k + 1)), -t1[1] / (k * (k + 1))];
      j0 = [j0[0] + t0[0], j0[1] + t0[1]]; j1 = [j1[0] + t1[0], j1[1] + t1[1]];
      if (Math.abs(t0[0]) + Math.abs(t0[1]) < 1e-17 * (Math.abs(j0[0]) + Math.abs(j0[1])) && k > 4) break;
    }
    return [j0, j1];
  }
  // R / Rdc of a round wire, x = b / delta. Beyond x = 20 the asymptotic series x/2 + 1/4 + 3/(32x) (error < 1e-5).
  function ratio(x) {
    if (x > 20) return x / 2 + 0.25 + 3 / (32 * x);
    var kb = [x, -x], J = bessel01(kb);
    return mul([x / 2, -x / 2], div(J[0], J[1]))[0];
  }
  // |J(r)| / |J(b)| inside the wire, for the cross-section shading
  function profile(x, rho) {
    if (x > 20) return Math.exp(-x * (1 - rho)) / Math.sqrt(Math.max(rho, 0.05));
    var a = bessel01([x * rho, -x * rho])[0], b = bessel01([x, -x])[0];
    return Math.hypot(a[0], a[1]) / Math.hypot(b[0], b[1]);
  }
  function delta(f, sigma) { return Math.sqrt(1 / (PI * f * MU0 * sigma)); }
  // resistance per metre of a wire of radius b (m): exact, dc (2-90a) and thin-skin (2-90b)
  function perMetre(f, b, sigma) {
    var d = delta(f, sigma), x = b / d, dc = 1 / (sigma * PI * b * b);
    return { delta: d, x: x, dc: dc, exact: dc * ratio(x), hf: dc * x / 2 };
  }
  // Dipole of length L wavelengths, wire radius b (m): Rr and RL referred to the current maximum and to the feed
  function dipole(f, b, sigma, L) {
    var lam = C0 / f, k = 2 * PI / lam, l = L * lam, w = perMetre(f, b, sigma), t = Math.pow(Math.sin(k * l / 2), 2);
    var Rm = E.dipoleZ(L, b / lam).R * t, weight = l / 2 - Math.sin(k * l) / (2 * k);
    var RLm = w.exact * weight, RLmHf = w.hf * weight;
    return { lam: lam, l: l, w: w, t: t, Rm: Rm, RLm: RLm, Rr: Rm / t, RL: RLm / t, RLhf: RLmHf / t,
      ecd: Rm / (Rm + RLm), ecdHf: Rm / (Rm + RLmHf) };
  }
  // Single-turn small loop of circumference C wavelengths
  function loop(f, b, sigma, C) {
    var lam = C0 / f, w = perMetre(f, b, sigma), Rr = 20 * PI * PI * Math.pow(C, 4), RL = C * lam * w.exact;
    return { lam: lam, a: C * lam / (2 * PI), w: w, Rr: Rr, RL: RL, ecd: Rr / (Rr + RL) };
  }

  var api = { METALS: METALS, ratio: ratio, profile: profile, delta: delta, perMetre: perMetre, dipole: dipole, loop: loop };
  if (node) { module.exports = api; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  function fmtF(f) { return f < 1e6 ? sig(f / 1e3, 3) + ' kHz' : f < 1e9 ? sig(f / 1e6, 3) + ' MHz' : sig(f / 1e9, 3) + ' GHz'; }
  function fmtLen(m) { return m < 1e-3 ? sig(m * 1e6, 3) + ' µm' : m < 1 ? sig(m * 1e3, 3) + ' mm' : m < 1e3 ? sig(m, 3) + ' m' : sig(m / 1e3, 3) + ' km'; }
  function fmtOhm(r) { return r > 1e6 ? 'very large' : r < 1e-3 ? sig(r * 1e6, 3) + ' µΩ' : r < 1 ? sig(r * 1e3, 3) + ' mΩ' : sig(r, 3) + ' Ω'; }
  function pct(e) { return e > 0.99 ? (100 * e).toFixed(2) + '%' : e < 0.01 ? sig(100 * e, 2) + '%' : (100 * e).toFixed(1) + '%'; }
  function dB(e) { var v = 10 * Math.log10(e); return (v < 0 ? '−' : '') + Math.abs(v).toFixed(e > 0.99 ? 3 : e > 0.9 ? 2 : 1) + ' dB'; }
  function logPos(lo, hi, v) { return Math.log(v / lo) / Math.log(hi / lo); }
  function logVal(lo, hi, p) { return lo * Math.pow(hi / lo, p); }
  function decades(lo, hi) { var out = []; for (var e = Math.ceil(Math.log10(lo) - 1e-9); e <= Math.log10(hi) + 1e-9; e++) out.push(Math.pow(10, e)); return out; }
  function tenFmt(v) { var e = Math.round(Math.log10(v)); return e >= -2 && e <= 3 ? String(+v.toPrecision(1)) : '1e' + e; }

  // a slider on a log scale that can also be set from outside (presets)
  function logSlider(parent, label, lo, hi, get, fmt, set) {
    var input = RA.slider(parent, { label: label, min: 0, max: 1, step: 'any', value: logPos(lo, hi, get()), fmt: function (p) { return fmt(logVal(lo, hi, p)); },
      onInput: function (p) { set(logVal(lo, hi, p)); } });
    return function () { input.value = logPos(lo, hi, get()); input.nextElementSibling.textContent = fmt(get()); };
  }
  function presets(parent, list, st, apply) {
    var wrap = RA.el('div', { class: 'ra-controls' }, parent), btns = [];
    list.forEach(function (p) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, wrap, p.label);
      b.addEventListener('click', function () { apply(p.set); });
      btns.push([p, b]);
    });
    return function () {
      btns.forEach(function (q) {
        var on = Object.keys(q[0].set).every(function (k) { var v = q[0].set[k]; return typeof v === 'string' ? st[k] === v : Math.abs(st[k] / v - 1) < 1e-6; });
        q[1].setAttribute('aria-pressed', String(on));
      });
    };
  }

  function init(root) {
    var d = root.dataset, kind = d.case || 'skin';
    var st = { f: +(d.f || 1) * 1e6, b: +(d.radius || 1) / 1000, metal: d.metal || 'cu', L: +(d.length || 0.5), C: +(d.c || 0.05) };
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var paint = [];
    var FR = kind === 'skin' ? [1e4, 1e11] : kind === 'dipole' ? [1e5, 3e11] : [1e6, 1e8];
    var BR = kind === 'skin' ? [1e-5, 1e-2] : kind === 'dipole' ? [5e-5, 1e-2] : [1e-4, 2e-2];
    paint.push(logSlider(controls, 'Frequency', FR[0], FR[1], function () { return st.f; }, fmtF, function (v) { st.f = v; draw(); }));
    paint.push(logSlider(controls, 'Wire radius <i>b</i>', BR[0], BR[1], function () { return st.b; }, fmtLen, function (v) { st.b = v; draw(); }));
    if (kind === 'dipole') paint.push(logSlider(controls, 'Length <i>l</i>/λ', 0.001, 1.5, function () { return st.L; }, function (v) { return sig(v, 3); }, function (v) { st.L = v; draw(); }));
    if (kind === 'loop') paint.push(logSlider(controls, 'Circumference <i>C</i>/λ', 0.01, 0.3, function () { return st.C; }, function (v) { return sig(v, 3); }, function (v) { st.C = v; draw(); }));
    paint.push(RA.toggle(controls, 'Metal', [['cu', 'Copper'], ['al', 'Aluminium'], ['ss', 'Stainless']], function () { return st.metal; }, function (v) { st.metal = v; draw(); }));
    var PRE = {
      skin: [{ label: '0.1 mm wire, 1 MHz', set: { f: 1e6, b: 1e-4, metal: 'cu' } }, { label: 'Balanis 100 MHz dipole wire', set: { f: 1e8, b: 9e-4, metal: 'cu' } }],
      dipole: [{ label: 'Balanis 100 MHz dipole', set: { f: 1e8, b: 9e-4, L: 0.5, metal: 'cu' } }, { label: 'Wi-Fi dipole', set: { f: 2.45e9, b: 5e-4, L: 0.47, metal: 'cu' } },
        { label: '10 m wire at 100 kHz', set: { f: 1e5, b: 1e-3, L: 10 / (C0 / 1e5), metal: 'cu' } }],
      loop: [{ label: '10 cm loop at 10 MHz', set: { f: 1e7, b: 1e-3, C: 2 * PI * 0.1 / (C0 / 1e7), metal: 'cu' } },
        { label: '1 m loop of 22 mm tube, 14 MHz', set: { f: 1.4e7, b: 1.1e-2, C: 2 * PI * 0.5 / (C0 / 1.4e7), metal: 'cu' } }] }[kind];
    paint.push(presets(root, PRE, st, function (s) { Object.keys(s).forEach(function (k) { st[k] = s[k]; }); draw(); }));
    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var draw = { skin: skin, dipole: dipoleCase, loop: loopCase }[kind](stage, st);
    var inner = draw;
    draw = function () { paint.forEach(function (p) { p(); }); inner(); };
    draw();
  }

  // ---- skin: cross-section and R/Rdc against b/delta
  function skin(stage, st) {
    var xbox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, xbox, 'Current density across the wire');
    var XS = svg('svg', { viewBox: '-1.25 -1.2 2.5 2.5', role: 'img', style: 'max-width: 220px' }, xbox), Xt = svg('title', {}, XS), XL = svg('g', {}, XS);
    var P = RA.plotBox(stage, 'Resistance against wire radius in skin depths'), PL = svg('g', {}, P.S);
    var rbox = RA.el('div', {}, stage);
    var rows = RA.readout(rbox, [['d', 'Skin depth δ'], ['x', '<i>b</i>/δ'], ['dc', 'DC (2-90a)'], ['ex', 'Exact'],
      ['hf', 'Skin formula (2-90b)'], ['err', '(2-90b) against exact']]);
    var XR = [0.1, 1000], sty = { ex: { stroke: 'var(--accent)', 'stroke-width': 1.8 }, dc: { stroke: 'currentColor', 'stroke-width': 1.2, 'stroke-dasharray': '4 3' },
      hf: { stroke: 'var(--ra-warm)', 'stroke-width': 1.4, 'stroke-dasharray': '6 3' } };
    var curve = [];
    for (var i = 0; i <= 200; i++) { var x = logVal(XR[0], XR[1], i / 200); curve.push([x, ratio(x)]); }
    return function () {
      var m = METALS[st.metal], w = perMetre(st.f, st.b, m.sigma), x = w.x;
      XL.textContent = '';
      var N = 48;
      for (var i = 0; i < N; i++) {
        var r = (i + 0.5) / N, p = Math.min(1, profile(x, r));
        svg('circle', { cx: 0, cy: 0, r: r, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1 / N + 0.002, 'stroke-opacity': (0.08 + 0.92 * p).toFixed(3) }, XL);
      }
      svg('circle', { cx: 0, cy: 0, r: 1, fill: 'none', stroke: 'currentColor', 'stroke-width': 0.012 }, XL);
      if (x > 1) {
        var rd = 1 - 1 / x;
        svg('circle', { cx: 0, cy: 0, r: rd, fill: 'none', stroke: 'currentColor', 'stroke-width': 0.01, 'stroke-dasharray': '0.04 0.03' }, XL);
        svg('text', { x: 0, y: -(rd + 1) / 2 + 0.025, 'font-size': 0.08, 'text-anchor': 'middle', fill: 'currentColor' }, XL).textContent = x < 6 ? 'δ' : '';
        if (x >= 6) svg('text', { x: 0, y: -1.08, 'font-size': 0.08, 'text-anchor': 'middle', fill: 'currentColor' }, XL).textContent = 'δ = ' + fmtLen(w.delta) + ', dashed ring';
      } else svg('text', { x: 0, y: -1.08, 'font-size': 0.08, 'text-anchor': 'middle', fill: 'currentColor' }, XL).textContent = 'δ = ' + fmtLen(w.delta) + ', larger than the wire';
      Xt.textContent = 'Cross-section of a ' + fmtLen(st.b) + ' radius ' + m.name.toLowerCase() + ' wire at ' + fmtF(st.f) + ': current density at the centre is ' +
        sig(100 * Math.min(1, profile(x, 0)), 2) + '% of its value at the surface.';
      PL.textContent = '';
      var F = RA.frame(PL, XR, [0.1, 1000], decades(XR[0], XR[1]), decades(0.1, 1000), 'b/δ (log scale)', 'R/Rdc', tenFmt, tenFmt, true, true);
      [['dc', [[XR[0], 1], [XR[1], 1]]], ['hf', [[XR[0], XR[0] / 2], [XR[1], XR[1] / 2]]], ['ex', curve]].forEach(function (q) {
        svg('path', Object.assign({ d: RA.path(q[1], F), fill: 'none' }, sty[q[0]]), PL);
      });
      var xc = Math.min(XR[1], Math.max(XR[0], x));
      svg('circle', { cx: F.X(xc), cy: F.clampY(F.Y(ratio(xc))), r: 3.2, fill: 'currentColor' }, PL);
      RA.legend(PL, 50, 36, [[sty.ex, 'exact (Bessel)'], [sty.hf, 'skin formula (2-90b)'], [sty.dc, 'dc (2-90a)']]);
      var err = w.hf / w.exact - 1;
      rows.d.td.textContent = fmtLen(w.delta);
      rows.x.td.textContent = sig(x, 3);
      rows.dc.td.textContent = fmtOhm(w.dc) + '/m';
      rows.ex.td.textContent = fmtOhm(w.exact) + '/m, ' + sig(w.exact / w.dc, 3) + ' × dc';
      rows.hf.td.textContent = fmtOhm(w.hf) + '/m';
      rows.err.td.textContent = (err >= 0 ? '+' : '−') + sig(Math.abs(100 * err), 2) + '%';
      P.title.textContent = 'Resistance over dc resistance against b over delta, log scales: exact Bessel curve, the dc line and the skin formula. This wire: b/delta ' +
        sig(x, 3) + ', exact ' + sig(w.exact / w.dc, 3) + ' times dc, skin formula off by ' + sig(100 * err, 2) + '%.';
    };
  }

  // ---- dipole: e_cd and the two resistances against length
  function dipoleCase(stage, st) {
    var A = RA.plotBox(stage, 'Radiation efficiency against length'), AL = svg('g', {}, A.S);
    var B = RA.plotBox(stage, 'Resistances at the feed'), BL = svg('g', {}, B.S);
    var rbox = RA.el('div', {}, stage);
    rbox.style.gridColumn = '1 / -1';
    var rows = RA.readout(rbox, [['len', 'Length, λ'], ['x', 'Skin depth, <i>b</i>/δ'], ['rr', 'Radiation resistance <i>R</i><sub>r</sub>'], ['rl', 'Loss resistance <i>R</i><sub>L</sub>'],
      ['e', '<i>e</i><sub>cd</sub>'], ['ehf', '<i>e</i><sub>cd</sub> with (2-90b)']]);
    var LR = [0.001, 1.5], sty = { e: { stroke: 'var(--accent)', 'stroke-width': 1.8 }, ehf: { stroke: 'var(--ra-warm)', 'stroke-width': 1.4, 'stroke-dasharray': '6 3' },
      rr: { stroke: 'var(--accent)', 'stroke-width': 1.8 }, rl: { stroke: 'var(--ra-warm)', 'stroke-width': 1.6 } };
    var lt = [0.001, 0.01, 0.1, 1];
    return function () {
      var m = METALS[st.metal], c = dipole(st.f, st.b, m.sigma, st.L), e = [], ehf = [], rr = [], rl = [];
      for (var i = 0; i <= 240; i++) {
        var L = logVal(LR[0], LR[1], i / 240), q = dipole(st.f, st.b, m.sigma, L);
        e.push([L, 100 * q.ecd]); ehf.push([L, 100 * q.ecdHf]); rr.push([L, q.Rr]); rl.push([L, q.RL]);
      }
      AL.textContent = '';
      var FA = RA.frame(AL, LR, [0, 100], lt, [0, 20, 40, 60, 80, 100], 'l/λ (log scale)', 'e_cd (%)', String, String, true, false);
      [['ehf', ehf], ['e', e]].forEach(function (q) { svg('path', Object.assign({ d: RA.path(q[1], FA), fill: 'none' }, sty[q[0]]), AL); });
      svg('line', { x1: FA.X(st.L), x2: FA.X(st.L), y1: FA.Y(100), y2: FA.Y(0), stroke: 'currentColor', 'stroke-opacity': 0.6 }, AL);
      svg('circle', { cx: FA.X(st.L), cy: FA.Y(100 * c.ecd), r: 3.2, fill: 'currentColor' }, AL);
      RA.legend(AL, 170, 140, [[sty.e, 'exact wire resistance'], [sty.ehf, 'skin formula (2-90b)']]);
      BL.textContent = '';
      var FB = RA.frame(BL, LR, [1e-5, 1e4], lt, decades(1e-5, 1e4).filter(function (v, i) { return i % 3 === 0; }), 'l/λ (log scale)', 'Ω', String, tenFmt, true, true);
      [['rr', rr], ['rl', rl]].forEach(function (q) { svg('path', Object.assign({ d: RA.path(q[1], FB), fill: 'none' }, sty[q[0]]), BL); });
      svg('line', { x1: FB.X(st.L), x2: FB.X(st.L), y1: FB.Y(1e4), y2: FB.Y(1e-5), stroke: 'currentColor', 'stroke-opacity': 0.6 }, BL);
      RA.legend(BL, 170, 140, [[sty.rr, 'radiation, Rr'], [sty.rl, 'loss, RL']]);
      rows.len.td.textContent = fmtLen(c.l) + ', λ = ' + fmtLen(c.lam);
      rows.x.td.textContent = fmtLen(c.w.delta) + ', ' + sig(c.w.x, 3);
      rows.rr.td.textContent = fmtOhm(c.Rr);
      rows.rl.td.textContent = fmtOhm(c.RL);
      rows.e.td.textContent = pct(c.ecd) + ', ' + dB(c.ecd);
      rows.ehf.td.textContent = pct(c.ecdHf);
      A.title.textContent = 'Radiation efficiency of a ' + m.name.toLowerCase() + ' dipole of ' + fmtLen(st.b) + ' radius at ' + fmtF(st.f) + ' against length from 0.001 to 1.5 wavelengths. At ' +
        sig(st.L, 3) + ' wavelengths: ' + pct(c.ecd) + ' (skin formula ' + pct(c.ecdHf) + ').';
      B.title.textContent = 'Radiation and loss resistance at the feed against length, log scales. At ' + sig(st.L, 3) + ' wavelengths: Rr ' + fmtOhm(c.Rr) + ', RL ' + fmtOhm(c.RL) + '.';
    };
  }

  // ---- loop: small loop against a dipole of the same wire
  function loopCase(stage, st) {
    var A = RA.plotBox(stage, 'Radiation efficiency against wire length'), AL = svg('g', {}, A.S);
    var rbox = RA.el('div', {}, stage);
    var tbl = RA.el('table', { class: 'ra-readout' }, rbox), hd = RA.el('thead', {}, tbl), hr = RA.el('tr', {}, hd);
    ['', 'Loop', 'Dipole'].forEach(function (h) { RA.el('th', {}, hr, h); });
    var tb = RA.el('tbody', {}, tbl), cells = {};
    [['size', 'Size'], ['rr', '<i>R</i><sub>r</sub>'], ['rl', '<i>R</i><sub>L</sub>'], ['e', '<i>e</i><sub>cd</sub>']].forEach(function (r) {
      var tr = RA.el('tr', {}, tb), th = RA.el('th', {}, tr);
      th.innerHTML = r[1];
      cells[r[0]] = [RA.el('td', {}, tr), RA.el('td', {}, tr)];
    });
    var CR = [0.01, 0.3], sty = { lp: { stroke: 'var(--accent)', 'stroke-width': 1.8 }, dp: { stroke: 'var(--ra-warm)', 'stroke-width': 1.6, 'stroke-dasharray': '6 3' } };
    return function () {
      var m = METALS[st.metal], lp = [], dp = [];
      for (var i = 0; i <= 160; i++) {
        var C = logVal(CR[0], CR[1], i / 160);
        lp.push([C, 100 * loop(st.f, st.b, m.sigma, C).ecd]); dp.push([C, 100 * dipole(st.f, st.b, m.sigma, C).ecd]);
      }
      var o = loop(st.f, st.b, m.sigma, st.C), q = dipole(st.f, st.b, m.sigma, st.C);
      AL.textContent = '';
      var F = RA.frame(AL, CR, [0, 100], [0.01, 0.02, 0.05, 0.1, 0.2, 0.3], [0, 20, 40, 60, 80, 100], 'wire length / λ (log scale)', 'e_cd (%)', String, String, true, false);
      [['dp', dp], ['lp', lp]].forEach(function (c) { svg('path', Object.assign({ d: RA.path(c[1], F), fill: 'none' }, sty[c[0]]), AL); });
      svg('line', { x1: F.X(st.C), x2: F.X(st.C), y1: F.Y(100), y2: F.Y(0), stroke: 'currentColor', 'stroke-opacity': 0.6 }, AL);
      svg('circle', { cx: F.X(st.C), cy: F.Y(100 * o.ecd), r: 3.2, fill: 'currentColor' }, AL);
      RA.legend(AL, 170, 110, [[sty.lp, 'small loop'], [sty.dp, 'straight dipole']]);
      cells.size[0].textContent = 'radius ' + fmtLen(o.a);
      cells.size[1].textContent = 'length ' + fmtLen(st.C * o.lam);
      cells.rr[0].textContent = fmtOhm(o.Rr); cells.rr[1].textContent = fmtOhm(q.Rr);
      cells.rl[0].textContent = fmtOhm(o.RL); cells.rl[1].textContent = fmtOhm(q.RL);
      cells.e[0].textContent = pct(o.ecd); cells.e[1].textContent = pct(q.ecd);
      A.title.textContent = 'Radiation efficiency against wire length in wavelengths for a single-turn small loop and a straight dipole of the same ' + m.name.toLowerCase() +
        ' wire, ' + fmtLen(st.b) + ' radius, at ' + fmtF(st.f) + '. At ' + sig(st.C, 3) + ' wavelengths: loop ' + pct(o.ecd) + ', dipole ' + pct(q.ecd) + '.';
    };
  }

  document.querySelectorAll('[data-widget="wire-loss"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
