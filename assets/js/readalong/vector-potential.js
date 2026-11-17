// vector-potential: the two pieces of the electric field of a short (infinitesimal) dipole, E = -j w A - grad(phi),
// in the Lorenz gauge (Balanis eqs. 3-7a, 3-13, 3-15) and in the Coulomb gauge. case=split draws -j w A, -grad(phi)
// and E on a meridian plane at any distance kr; case=gauge draws phi and A in both gauges, with the same E on top.
// case=loop is the dual (Balanis §3.3): a small loop as a magnetic dipole, H = -j w F - grad(phi_m) (3-19), (3-26),
// with E_phi out of the plane; case=loopcheck compares the exact uniform loop with that magnetic dipole (5-21).
// Markup comes from _includes/readalong/vector-potential.html; helpers from readalong.js (window.RA).
// The maths at the top has no DOM and is also run under node by content/balanis/checks/vector_potential.py.
(function () {
  var PI = Math.PI, node = typeof module !== 'undefined';
  var LAMBDA_CM = 29979245800 / 2.45e9;   // free-space wavelength at 2.45 GHz, in cm
  var LAMBDA_NFC_CM = 29979245800 / 13.56e6;   // at 13.56 MHz (NFC), in cm
  var KR_MIN = 0.05, KR_MAX = 20, KR_MIN_LOOP = 0.02;

  // Units: k = omega = mu = eps = 1 (so eta = 1) and I l = 1, with the e^{j w t} convention and a z-directed dipole
  // at the origin. Every quantity is a pair of spherical components [r, theta], each complex [re, im]. In these units
  // omega A has the units of E, so the three pieces of E can be compared directly.
  function cx(re, im) { return [re, im]; }
  function cmul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
  function cadd(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function csc(a, s) { return [a[0] * s, a[1] * s]; }
  function cabs(a) { return Math.hypot(a[0], a[1]); }
  function ejr(r) { return [Math.cos(r), -Math.sin(r)]; }   // e^{-j r}
  var J = [0, 1], MJ = [0, -1];

  // Lorenz gauge. A_z = e^{-jr}/(4 pi r) along the wire (Balanis eq. 4-4 in these units); phi from (3-13).
  function lorenz(r, th) {
    var c = Math.cos(th), s = Math.sin(th), e = ejr(r), a = csc(e, 1 / (4 * PI * r));
    var A = [csc(a, c), csc(a, -s)];
    var g = csc(cmul([r, -1], e), 1 / (r * r));                     // (r - j) e^{-jr} / r^2
    var phi = csc(g, c / (4 * PI));
    var dg = cmul(e, [-2 / (r * r), -1 / r + 2 / (r * r * r)]);       // d/dr of g
    var grad = [csc(dg, c / (4 * PI)), csc(g, -s / (4 * PI * r))];
    return { A: A, phi: phi, grad: grad };
  }
  // -j w A, -grad phi and their sum E (w = 1)
  function split(r, th) {
    var L = lorenz(r, th), wA = [cmul(MJ, L.A[0]), cmul(MJ, L.A[1])], gp = [csc(L.grad[0], -1), csc(L.grad[1], -1)];
    return { wA: wA, gp: gp, E: [cadd(wA[0], gp[0]), cadd(wA[1], gp[1])], phi: L.phi, A: L.A };
  }
  // Coulomb gauge: phi is the static potential of the dipole's charges p = I l/(j w) = -j, everywhere at once,
  // and A is whatever makes E = -j w A - grad phi the same field, i.e. A = j (E + grad phi).
  function coulomb(r, th) {
    var c = Math.cos(th), s = Math.sin(th), E = split(r, th).E;
    var phi = csc(MJ, c / (4 * PI * r * r));
    var grad = [csc(J, 2 * c / (4 * PI * r * r * r)), csc(J, s / (4 * PI * r * r * r))];
    var A = [cmul(J, cadd(E[0], grad[0])), cmul(J, cadd(E[1], grad[1]))];
    var gp = [csc(grad[0], -1), csc(grad[1], -1)], wA = [cmul(MJ, A[0]), cmul(MJ, A[1])];
    return { A: A, phi: phi, wA: wA, gp: gp, E: [cadd(wA[0], gp[0]), cadd(wA[1], gp[1])] };
  }
  function vabs(v) { return Math.hypot(cabs(v[0]), cabs(v[1])); }
  function arg(a) { return Math.atan2(a[1], a[0]); }

  // The numbers the split readout and plot show, at distance kr and angle th
  function splitStats(r, th) {
    var f = split(r, th);
    var Et = f.E[1], wAt = f.wA[1];
    return {
      kr: r, rcm: r * LAMBDA_CM / (2 * PI),
      gpOverWA: vabs(f.gp) / vabs(f.wA),                // size of the charge piece per size of the current piece
      eOverWA: vabs(f.E) / vabs(f.wA),
      radialLeft: cabs(f.E[0]) / cabs(f.wA[0]),         // what is left of the radial part after the two cancel
      thetaRatio: cabs(Et) / cabs(wAt),                 // E_theta per -j w A_theta: 1 far away
      thetaPhase: (arg(Et) - arg(wAt)) * 180 / PI,
      chargeShare: vabs(f.gp) / (vabs(f.gp) + vabs(f.wA))
    };
  }
  // The numbers the gauge readout shows
  function gaugeStats(r, th) {
    var L = lorenz(r, th), C = coulomb(r, th), sL = split(r, th);
    var dE = Math.hypot(cabs(cadd(C.E[0], csc(sL.E[0], -1))), cabs(cadd(C.E[1], csc(sL.E[1], -1)))) / vabs(sL.E);
    // phase of each phi relative to the charge on the dipole's upper end, q = p / l, i.e. relative to -j
    // phi_L / (-j cos(theta)/(4 pi r^2)) = (1 + j r) e^{-jr}, so the Lorenz lag is r - atan(r), unwrapped (it grows
    // past a cycle far out); the Coulomb phi is a real multiple of the charge, so its lag is 0 (or 180 past theta = 90)
    var lagL = (r - Math.atan(r)) * 180 / PI, lagC = -(arg(C.phi) - arg(MJ)) * 180 / PI;
    // direction of A: angle from the wire axis (z), using the peak vector's real direction at its largest instant
    function tilt(A) {
      var best = 0, ang = 0;
      for (var i = 0; i < 180; i++) {
        var t = PI * i / 180, ar = A[0][0] * Math.cos(t) - A[0][1] * Math.sin(t), at = A[1][0] * Math.cos(t) - A[1][1] * Math.sin(t);
        var m = Math.hypot(ar, at);
        if (m > best) { best = m; var ax = ar * Math.sin(th) + at * Math.cos(th), az = ar * Math.cos(th) - at * Math.sin(th); ang = Math.atan2(Math.abs(ax), Math.abs(az)) * 180 / PI; }
      }
      return ang;
    }
    return { kr: r, rcm: r * LAMBDA_CM / (2 * PI), dE: dE, lagL: lagL, lagC: ((lagC % 360) + 360) % 360,
      tiltL: tilt(L.A), tiltC: tilt(C.A), phiRatio: cabs(L.phi) / cabs(C.phi) };
  }

  // ---- the dual: a z-directed magnetic dipole, I_m l = 1 (Balanis §3.3) ----
  // F_z = eps I_m l e^{-jkr}/(4 pi r) is A_z with mu -> eps, and (3-19), (3-24) are (3-7a), (3-13) with the same swap,
  // so in these units the two pieces of H are the two pieces of the electric dipole's E, number for number.
  // E_F = -(1/eps) curl F has only a phi component, Balanis (5-20b): -j sin(th)/(4 pi r) (1 + 1/(j r)) e^{-jr}.
  function loopDual(r, th) {
    var f = split(r, th), e = cmul(cmul(MJ, cadd([1, 0], [0, -1 / r])), ejr(r));
    return { wF: f.wA, gp: f.gp, H: f.E, Ephi: csc(e, Math.sin(th) / (4 * PI * r)) };
  }
  function loopStats(r, th) {
    var s = splitStats(r, th), L = loopDual(r, th);
    s.rcm = r * LAMBDA_NFC_CM / (2 * PI);
    s.eOverH = cabs(L.Ephi) / vabs(L.H);                // |E| / (eta |H|), eta = 1: a plane wave gives 1
    return s;
  }
  // ---- the exact uniform loop against the magnetic dipole (5-21), units k = w = mu = eps = 1, I0 = 1 ----
  // The loop of radius a = ka in the xy-plane carries a uniform current, so div A = 0 and E = -j w A exactly:
  // A_phi = (a / 4 pi) integral of cos(p) e^{-jkR}/R dp, R^2 = r^2 + a^2 - 2 a r sin(th) cos(p).
  // The integrand is smooth and periodic, so the trapezoid rule converges fast.
  function loopExactEphi(ka, r, th) {
    var n = 512, re = 0, im = 0, st = Math.sin(th);
    for (var i = 0; i < n; i++) {
      var p = 2 * PI * i / n, R = Math.sqrt(r * r + ka * ka - 2 * ka * r * st * Math.cos(p)), c = Math.cos(p) / R;
      re += c * Math.cos(R); im -= c * Math.sin(R);
    }
    var A = csc([re, im], ka / (4 * PI) * 2 * PI / n);
    return cmul(MJ, A);
  }
  // magnetic dipole with I_m l = j w mu S I0 = j pi a^2 (5-21), field from (5-20b)
  function mdipEphi(ka, r, th) { return cmul([0, PI * ka * ka], loopDual(r, th).Ephi); }
  function loopError(ka, r, th) { return cabs(loopExactEphi(ka, r, th)) / cabs(mdipEphi(ka, r, th)) - 1; }
  function besselJ1(x) {   // series, fine for the x <= 1 used here
    var t = x / 2, s = 0, term = t;
    for (var m = 0; m < 30; m++) { s += term; term *= -(x * x / 4) / ((m + 1) * (m + 2)); }
    return s;
  }
  function farError(ka, th) { var x = ka * Math.sin(th); return 2 * besselJ1(x) / x - 1; }

  var api = { loopDual: loopDual, loopStats: loopStats, loopExactEphi: loopExactEphi, mdipEphi: mdipEphi, loopError: loopError,
    farError: farError, LAMBDA_NFC_CM: LAMBDA_NFC_CM, KR_MIN_LOOP: KR_MIN_LOOP, lorenz: lorenz, coulomb: coulomb, split: split, splitStats: splitStats, gaugeStats: gaugeStats, LAMBDA_CM: LAMBDA_CM, KR_MIN: KR_MIN, KR_MAX: KR_MAX };
  if (node) { module.exports = api; return; }

  // ---- drawing ----------------------------------------------------------------------------------------------------
  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PROBE = PI / 4;   // the probe point sits at 45 degrees from the wire
  function logPos(v, lo, hi) { lo = lo || KR_MIN; hi = hi || KR_MAX; return Math.log(v / lo) / Math.log(hi / lo); }
  function logVal(p, lo, hi) { lo = lo || KR_MIN; hi = hi || KR_MAX; return lo * Math.pow(hi / lo, p); }
  function fmtKr(kr) { return kr < 0.1 ? kr.toFixed(3) : kr < 1 ? kr.toFixed(2) : kr < 10 ? kr.toFixed(1) : kr.toFixed(0); }
  function fmtCm(cm) { return cm < 1 ? sig(cm * 10, 2) + ' mm' : cm < 100 ? sig(cm, 2) + ' cm' : sig(cm / 100, 2) + ' m'; }
  var rgbCache = {};
  function toRGB(c) {
    if (rgbCache[c]) return rgbCache[c];
    var x = document.createElement('canvas').getContext('2d'); x.fillStyle = c; var h = x.fillStyle;
    var out = h[0] === '#' ? [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)] : (h.match(/\d+/g) || [80, 120, 200]).slice(0, 3).map(Number);
    return (rgbCache[c] = out);
  }

  // One animation clock per widget, paused off screen, in a hidden tab and by the Play button.
  function clock(root, controls, frame) {
    var st = { run: !reduce, t: 0, last: null, visible: true };
    var play = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': String(st.run) }, controls, st.run ? 'Pause' : 'Play');
    function label() { play.textContent = st.run ? 'Pause' : 'Play'; play.setAttribute('aria-pressed', String(st.run)); }
    function tick(ts) {
      if (!st.run) return;
      if (st.visible && !document.hidden) {
        if (st.last != null) st.t += Math.min(0.1, (ts - st.last) / 1000);
        st.last = ts;
        frame(st.t);
      } else st.last = null;
      requestAnimationFrame(tick);
    }
    play.addEventListener('click', function () { st.run = !st.run; st.last = null; label(); if (st.run) requestAnimationFrame(tick); });
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { st.visible = es[0].isIntersecting; }).observe(root);
    if (st.run) requestAnimationFrame(tick);
    return st;
  }

  // A square map of the meridian plane (x right, z up) with the dipole at the centre; half-width R in kr.
  // Each arrow is a vector field at one instant, Re(v e^{j w t}), drawn per unit of the largest of the vectors
  // compared at that point, so the directions and relative sizes show at every distance.
  var N = 13, NS = 9, SIZE = 300, STRIP = 38;   // arrows per side; map size; strip under the map for the scale bar
  function makeMap(parent, title) {
    var box = RA.el('div', { class: 'ra-pattern-cut' }, parent);
    var cap = RA.el('p', {}, box);
    cap.innerHTML = title;
    var cv = RA.el('canvas', { width: SIZE * 2, height: (SIZE + STRIP) * 2, role: 'img' }, box);
    cv.style.width = '100%'; cv.style.maxWidth = SIZE + 'px'; cv.style.display = 'block'; cv.style.margin = '0 auto';
    return { cv: cv, ctx: cv.getContext('2d'), cap: cap };
  }
  function gridPoints(R, n) {
    var pts = [], h = 2 * R / n;
    for (var j = 0; j < n; j++) for (var i = 0; i < n; i++) {
      var x = -R + (i + 0.5) * h, z = R - (j + 0.5) * h, r = Math.hypot(x, z);
      if (r < 0.6 * h) continue;
      pts.push({ x: x, z: z, r: r, th: Math.acos(z / r), sx: x < 0 ? -1 : 1 });
    }
    return pts;
  }
  // instantaneous cartesian components (x, z) of a [r, theta] phasor vector at angle wt, on the side sx of the axis
  function inst(v, p, wt) {
    var c = Math.cos(wt), s = Math.sin(wt);
    var vr = v[0][0] * c - v[0][1] * s, vt = v[1][0] * c - v[1][1] * s;
    var st = Math.sin(p.th), ct = Math.cos(p.th);
    return [p.sx * (vr * st + vt * ct), vr * ct - vt * st];
  }
  // an arrow from its tail (x, y); arrow() centres one on (x, y)
  function arrowFrom(ctx, x, y, dx, dy) { arrow(ctx, x + dx / 2, y + dy / 2, dx, dy); }
  function arrow(ctx, x, y, dx, dy) {
    var L = Math.hypot(dx, dy);
    if (L < 0.8) return;
    var ux = dx / L, uy = dy / L, h = Math.min(5, 0.45 * L);
    ctx.beginPath();
    ctx.moveTo(x - dx / 2, y - dy / 2); ctx.lineTo(x + dx / 2, y + dy / 2);
    ctx.moveTo(x + dx / 2 - ux * h - uy * h * 0.5, y + dy / 2 - uy * h + ux * h * 0.5);
    ctx.lineTo(x + dx / 2, y + dy / 2);
    ctx.lineTo(x + dx / 2 - ux * h + uy * h * 0.5, y + dy / 2 - uy * h - ux * h * 0.5);
    ctx.stroke();
  }
  function drawFrame(ctx, R, probeKr, labels) {
    var fg = labels.fg, sc = SIZE / (2 * R), X = function (x) { return SIZE / 2 + x * sc; }, Z = function (z) { return SIZE / 2 - z * sc; };
    // the dipole (or the loop, seen almost edge-on), drawn larger than true scale so it can be seen
    ctx.strokeStyle = fg; ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (labels.loop) ctx.ellipse(SIZE / 2, SIZE / 2, 9, 3, 0, 0, 2 * PI);
    else { ctx.moveTo(SIZE / 2, SIZE / 2 - 9); ctx.lineTo(SIZE / 2, SIZE / 2 + 9); }
    ctx.stroke();
    // probe ring at 45 degrees on the right
    ctx.lineWidth = 1.2; ctx.setLineDash([3, 2]);
    ctx.beginPath(); ctx.arc(X(probeKr * Math.sin(PROBE)), Z(probeKr * Math.cos(PROBE)), 9, 0, 2 * PI); ctx.stroke(); ctx.setLineDash([]);
    // scale bar: one wavelength (2 pi in kr) when it fits, else a tenth
    var bar = [[2 * PI, 'λ'], [0.2 * PI, 'λ/10'], [0.02 * PI, 'λ/100'], [0.002 * PI, 'λ/1000']].filter(function (q) { return q[0] * sc <= SIZE * 0.4; })[0];
    ctx.fillStyle = fg; ctx.globalAlpha = 0.8;
    ctx.fillRect(SIZE - 8 - bar[0] * sc, SIZE + 13, bar[0] * sc, 1.5);
    ctx.font = '11px ' + labels.font; ctx.textAlign = 'right'; ctx.fillText(bar[1], SIZE - 14 - bar[0] * sc, SIZE + 17);
    ctx.textAlign = 'left'; ctx.fillText('kr = ' + fmtKr(R) + ' at the edge', 4, SIZE + 17);
    // key for the ring: the point the readout (and the plot's cursor) describe
    ctx.globalAlpha = 1; ctx.strokeStyle = fg; ctx.lineWidth = 1.2; ctx.setLineDash([3, 2]);
    ctx.beginPath(); ctx.arc(10, SIZE + 30, 5, 0, 2 * PI); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = 0.8; ctx.fillText('the point in the readout: kr = ' + fmtKr(probeKr) + ', 45° from the ' + (labels.loop ? 'axis' : 'wire'), 20, SIZE + 34);
    ctx.globalAlpha = 1;
  }

  function init(root) {
    var d = root.dataset;
    root.textContent = '';
    ({ gauge: gaugeCase, loop: loopCase, loopcheck: loopCheckCase }[d.case] || splitCase)(root, d);
  }

  function presets(parent, st, list, set, key) {
    key = key || 'kr';
    var pre = RA.el('div', { class: 'ra-controls' }, parent), btns = [];
    list.forEach(function (p) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, pre, p[0]);
      b.addEventListener('click', function () { set(p[1]); });
      btns.push([p[1], b]);
    });
    return { el: pre, paint: function () { btns.forEach(function (q) { q[1].setAttribute('aria-pressed', String(Math.abs(st[key] - q[0]) < 1e-9 * q[0])); }); } };
  }
  var PRESETS = [['Near: kr = 0.1', 0.1], ['Radian distance: kr = 1', 1], ['Far: kr = 15', 15]];

  // ---- split: -j w A, -grad phi and E -----------------------------------------------------------------------------
  function splitCase(root, d) {
    var st = { kr: Math.min(KR_MAX, Math.max(KR_MIN, +(d.kr || 1))), show: { wA: true, gp: true, E: true } };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var slider = RA.slider(controls, { label: 'Distance <i>kr</i>', min: 0, max: 1, step: 'any', value: logPos(st.kr),
      fmt: function (p) { return fmtKr(logVal(p)); }, onInput: function (p) { st.kr = logVal(p); update(); } });
    var layers = RA.el('div', { class: 'ra-controls', role: 'group', 'aria-label': 'Layers' }, root), lbtn = {};
    [['wA', '−<i>jω</i><b>A</b> (current)'], ['gp', '−∇<i>φ</i><sub>e</sub> (charges)'], ['E', '<b>E</b> (their sum)']].forEach(function (q) {
      var b = RA.el('button', { type: 'button', class: 'ra-button ra-layer-' + q[0], 'aria-pressed': 'true' }, layers);
      b.innerHTML = q[1];
      b.addEventListener('click', function () { st.show[q[0]] = !st.show[q[0]]; b.setAttribute('aria-pressed', String(st.show[q[0]])); frame(clk.t); });
      lbtn[q[0]] = b;
    });
    var pre = presets(root, st, PRESETS, function (kr) { st.kr = kr; slider.value = logPos(kr); slider.nextElementSibling.textContent = fmtKr(kr); update(); });
    var clk = clock(root, pre.el, function (t) { frame(t); });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var map = makeMap(stage, 'The field around the dipole, now');
    var plot = RA.plotBox(stage, 'Each piece per unit of |−jωA|, at 45° from the wire');
    var rows = RA.readout(RA.el('div', {}, root), [['r', '<i>r</i> at 2.45 GHz'], ['ratio', '|−∇<i>φ</i><sub>e</sub>| ÷ |−<i>jω</i><b>A</b>| at the ring'],
      ['radial', 'Radial parts: what their sum leaves'], ['theta', '<i>E</i><sub>θ</sub> ÷ (−<i>jωA</i><sub>θ</sub>)']]);

    // the plot: log-log against kr, three curves at theta = 45 degrees
    var F = RA.frame(plot.S, [KR_MIN, KR_MAX], [0.01, 1e4], [0.1, 1, 10], [0.01, 1, 100, 1e4], 'kr', '', function (x) { return String(x); },
      function (y) { return y === 1e4 ? '10⁴' : String(y); }, true, true);
    plot.title.textContent = 'Log-log plot against kr of the size of the charge term, of E, and of the radial part of E, each per unit of the current term, at 45 degrees from the wire';
    var cGp = [], cE = [], cR = [];
    for (var i = 0; i <= 160; i++) {
      var kr = logVal(i / 160), s = splitStats(kr, PROBE);
      cGp.push([kr, s.gpOverWA]); cE.push([kr, s.eOverWA]); cR.push([kr, s.radialLeft]);
    }
    svg('path', { d: RA.path(cGp, F), fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 2 }, plot.S);
    svg('path', { d: RA.path(cE, F), fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, plot.S);
    svg('path', { d: RA.path(cR, F), fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-dasharray': '5 3' }, plot.S);
    svg('line', { x1: F.X(KR_MIN), x2: F.X(KR_MAX), y1: F.Y(1), y2: F.Y(1), stroke: 'var(--accent)', 'stroke-width': 1.5 }, plot.S);
    RA.legend(plot.S, 196, 34, [[{ stroke: 'var(--ra-warm)', 'stroke-width': 2 }, '−∇φ (charges)'], [{ stroke: 'currentColor', 'stroke-width': 2 }, 'E'],
      [{ stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-dasharray': '5 3' }, 'radial part of E'], [{ stroke: 'var(--accent)', 'stroke-width': 1.5 }, '−jωA (current)']]);
    var marker = svg('line', { y1: 24, y2: 176, stroke: 'currentColor', 'stroke-opacity': 0.6, 'stroke-width': 1 }, plot.S);

    var pts, vecs;
    function update() {
      var R = 2 * st.kr;
      pts = gridPoints(R, NS);
      vecs = pts.map(function (p) {
        var f = split(p.r, p.th), m = vabs(f.wA) + vabs(f.gp);   // the two pieces laid tip to tail always fit
        return { f: f, m: m };
      });
      var s = splitStats(st.kr, PROBE);
      marker.setAttribute('x1', F.X(st.kr)); marker.setAttribute('x2', F.X(st.kr));
      rows.r.td.textContent = fmtCm(s.rcm) + ' (' + sig(st.kr / (2 * PI), 2) + ' λ)';
      rows.ratio.td.textContent = sig(s.gpOverWA, 3) + (s.gpOverWA > 1.05 ? ': the charges make most of the field' : '');
      rows.radial.td.textContent = s.radialLeft >= 1 ? sig(s.radialLeft, 3) + ' times the radial part of −jωA' : sig(100 * s.radialLeft, 2) + '% of the radial part of −jωA';
      rows.theta.td.textContent = sig(s.thetaRatio, 3) + ' at ' + RA.signed(s.thetaPhase, 1) + '°';
      map.cv.setAttribute('aria-label', 'Arrows of minus j omega A, minus grad phi and E on a plane through a vertical short dipole, out to kr = ' + fmtKr(R) +
        '. At the ring, the charge term is ' + sig(s.gpOverWA, 3) + ' times the current term.');
      pre.paint();
      frame(clk.t);
    }
    function frame(t) {
      var ctx = map.ctx, fg = getComputedStyle(map.cv).color, font = getComputedStyle(map.cv).fontFamily;
      var acc = RA.css('--accent') || '#36c', warm = RA.css('--ra-warm') || '#c63';
      ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.clearRect(0, 0, SIZE, SIZE + STRIP);
      var R = 2 * st.kr, h = SIZE / NS, wt = 2 * PI * t / 3;   // one period every 3 s
      var sc = SIZE / (2 * R);
      // tip to tail: -j w A from the grid point, -grad(phi) from its tip, and E from the point to where they end
      ctx.lineCap = 'round';
      pts.forEach(function (p, i) {
        var k = 0.85 * h / vecs[i].m, f = vecs[i].f, x = SIZE / 2 + p.x * sc, y = SIZE / 2 - p.z * sc;
        var a = inst(f.wA, p, wt), b = inst(f.gp, p, wt), e = inst(f.E, p, wt);
        var ax = a[0] * k, ay = -a[1] * k, bx = b[0] * k, by = -b[1] * k;
        ctx.globalAlpha = 0.85; ctx.lineWidth = 2;
        if (st.show.wA) { ctx.strokeStyle = acc; arrowFrom(ctx, x, y, ax, ay); }
        if (st.show.gp) { ctx.strokeStyle = warm; arrowFrom(ctx, st.show.wA ? x + ax : x, st.show.wA ? y + ay : y, bx, by); }
        ctx.globalAlpha = 1; ctx.lineWidth = 1.3;
        if (st.show.E) { ctx.strokeStyle = fg; arrowFrom(ctx, x, y, e[0] * k, -e[1] * k); }
        ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(x, y, 1.3, 0, 2 * PI); ctx.fill();
      });
      ctx.globalAlpha = 1;
      drawFrame(ctx, R, st.kr, { fg: fg, font: font });
    }
    RA.onTheme(function () { frame(clk.t); });
    update();
  }

  // ---- gauge: the same E from two different pairs of potentials ---------------------------------------------------
  function gaugeCase(root, d) {
    var st = { kr: Math.min(KR_MAX, Math.max(KR_MIN, +(d.kr || 5))) };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var slider = RA.slider(controls, { label: 'Distance <i>kr</i>', min: 0, max: 1, step: 'any', value: logPos(st.kr),
      fmt: function (p) { return fmtKr(logVal(p)); }, onInput: function (p) { st.kr = logVal(p); update(); } });
    var pre = presets(root, st, PRESETS, function (kr) { st.kr = kr; slider.value = logPos(kr); slider.nextElementSibling.textContent = fmtKr(kr); update(); });
    var clk = clock(root, pre.el, function (t) { frame(t); });
    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var maps = [makeMap(stage, 'Lorenz gauge (Balanis)'), makeMap(stage, 'Coulomb gauge')];
    var key = RA.el('p', { class: 'ra-key' }, root);
    key.innerHTML = 'Shading: <i>φ</i> (blue +, red −). Coloured arrows: −<i>jω</i><b>A</b>. Thin arrows: <b>E</b>, the same in both.';
    var rows = RA.readout(RA.el('div', {}, root), [['r', '<i>r</i> at 2.45 GHz'], ['lag', '<i>φ</i> at the ring lags the charges by'],
      ['tilt', '<b>A</b> at the ring, angle from the wire'], ['dE', 'Largest difference in <b>E</b> between the two']]);
    var G = 120, imgs = maps.map(function (m) { return m.ctx.createImageData(G, G); }), off = document.createElement('canvas');
    off.width = G; off.height = G;
    var pts, vecs, phis, scale;

    function update() {
      var R = 2 * st.kr;
      pts = gridPoints(R, N);
      vecs = pts.map(function (p) {
        var L = split(p.r, p.th), C = coulomb(p.r, p.th);
        return { L: L.wA, C: C.wA, E: L.E, m: Math.max(vabs(L.wA), vabs(C.wA), vabs(L.E)) };
      });
      // phi on a fine grid; one colour scale for both maps, set by the Lorenz phi halfway out on the axis
      phis = [new Float32Array(2 * G * G), new Float32Array(2 * G * G)];
      for (var j = 0; j < G; j++) for (var i = 0; i < G; i++) {
        var x = -R + (i + 0.5) * 2 * R / G, z = R - (j + 0.5) * 2 * R / G, r = Math.max(Math.hypot(x, z), 1e-6), th = Math.acos(z / r);
        var pl = lorenz(r, th).phi, pc = coulomb(r, th).phi, k = 2 * (j * G + i);
        phis[0][k] = pl[0]; phis[0][k + 1] = pl[1]; phis[1][k] = pc[0]; phis[1][k + 1] = pc[1];
      }
      scale = cabs(lorenz(R / 2, 0).phi);
      var s = gaugeStats(st.kr, PROBE), worst = 0;
      pts.forEach(function (p) { worst = Math.max(worst, gaugeStats(p.r, p.th).dE); });
      rows.r.td.textContent = fmtCm(s.rcm) + ' (' + sig(st.kr / (2 * PI), 2) + ' λ)';
      rows.lag.td.textContent = 'Lorenz ' + sig(s.lagL, 3) + '° (' + sig(s.lagL / 360, 2) + ' cycles), Coulomb ' + (s.lagC < 1e-6 || s.lagC > 360 - 1e-6 ? '0' : sig(s.lagC, 3)) + '°';
      rows.tilt.td.textContent = 'Lorenz ' + (s.tiltL < 1e-6 ? '0' : sig(s.tiltL, 2)) + '°, Coulomb ' + (s.tiltC < 1e-6 ? '0' : sig(s.tiltC, 3)) + '°';
      rows.dE.td.textContent = worst < 1e-12 ? 'none (below 10⁻¹² of E, rounding)' : sig(100 * worst, 2) + '% of E';
      maps.forEach(function (m, i) {
        m.cv.setAttribute('aria-label', (i ? 'Coulomb' : 'Lorenz') + ' gauge: the scalar potential as shading, minus j omega A and E as arrows, on a plane through a vertical short dipole out to kr = ' + fmtKr(R) + '.');
      });
      pre.paint();
      frame(clk.t);
    }
    function frame(t) {
      var acc = RA.css('--accent') || '#36c', warm = RA.css('--ra-warm') || '#c63', pos = toRGB(acc), neg = toRGB(warm);
      var R = 2 * st.kr, h = SIZE / N, wt = 2 * PI * t / 3, c = Math.cos(wt), s = Math.sin(wt), sc = SIZE / (2 * R);
      maps.forEach(function (m, mi) {
        var ctx = m.ctx, fg = getComputedStyle(m.cv).color, font = getComputedStyle(m.cv).fontFamily, img = imgs[mi], ph = phis[mi];
        for (var i = 0; i < G * G; i++) {
          var v = (ph[2 * i] * c - ph[2 * i + 1] * s) / scale, a = Math.tanh(Math.abs(v)), col = v > 0 ? pos : neg;
          img.data[4 * i] = col[0]; img.data[4 * i + 1] = col[1]; img.data[4 * i + 2] = col[2]; img.data[4 * i + 3] = Math.round(90 * a);
        }
        off.getContext('2d').putImageData(img, 0, 0);
        ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.clearRect(0, 0, SIZE, SIZE + STRIP);
        ctx.imageSmoothingEnabled = true; ctx.drawImage(off, 0, 0, SIZE, SIZE);
        ctx.strokeStyle = acc; ctx.lineWidth = 3.2; ctx.globalAlpha = 0.6;
        pts.forEach(function (p, i) {
          var v = inst(mi ? vecs[i].C : vecs[i].L, p, wt), k = 0.9 * h / vecs[i].m;
          arrow(ctx, SIZE / 2 + p.x * sc, SIZE / 2 - p.z * sc, v[0] * k, -v[1] * k);
        });
        ctx.globalAlpha = 1; ctx.strokeStyle = fg; ctx.lineWidth = 1.3;
        pts.forEach(function (p, i) {
          var v = inst(vecs[i].E, p, wt), k = 0.9 * h / vecs[i].m;
          arrow(ctx, SIZE / 2 + p.x * sc, SIZE / 2 - p.z * sc, v[0] * k, -v[1] * k);
        });
        drawFrame(ctx, R, st.kr, { fg: fg, font: font });
      });
    }
    RA.onTheme(function () { frame(clk.t); });
    update();
  }

  // ---- loop: the dual of split, H = -j w F - grad(phi_m) around a small loop, E out of the plane ------------------
  function loopCase(root, d) {
    var LO = KR_MIN_LOOP;
    var st = { kr: Math.min(KR_MAX, Math.max(LO, +(d.kr || 1))), show: { wA: true, gp: true, H: true, E: true } };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var slider = RA.slider(controls, { label: 'Distance <i>kr</i>', min: 0, max: 1, step: 'any', value: logPos(st.kr, LO),
      fmt: function (p) { return fmtKr(logVal(p, LO)); }, onInput: function (p) { st.kr = logVal(p, LO); update(); } });
    var layers = RA.el('div', { class: 'ra-controls', role: 'group', 'aria-label': 'Layers' }, root);
    [['wA', '−<i>jω</i><b>F</b>'], ['gp', '−∇<i>φ</i><sub>m</sub> (poles)'], ['H', '<b>H</b> (their sum)'], ['E', '<b>E</b> (out of the plane)']].forEach(function (q) {
      var b = RA.el('button', { type: 'button', class: 'ra-button ra-layer-' + ({ H: 'E', E: 'circ' }[q[0]] || q[0]), 'aria-pressed': 'true' }, layers);
      b.innerHTML = q[1];
      b.addEventListener('click', function () { st.show[q[0]] = !st.show[q[0]]; b.setAttribute('aria-pressed', String(st.show[q[0]])); frame(clk.t); });
    });
    var NFC = 2 * PI * 10 / LAMBDA_NFC_CM;   // 10 cm at 13.56 MHz
    var pre = presets(root, st, [['NFC, phone 10 cm away: kr = 0.028', NFC], ['kr = 1', 1], ['Far: kr = 15', 15]],
      function (kr) { st.kr = kr; slider.value = logPos(kr, LO); slider.nextElementSibling.textContent = fmtKr(kr); update(); });
    var clk = clock(root, pre.el, function (t) { frame(t); });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var map = makeMap(stage, 'The field around the loop, now');
    var plot = RA.plotBox(stage, 'Each piece per unit of |−jωF|, at 45° from the axis');
    var rows = RA.readout(RA.el('div', {}, root), [['r', '<i>r</i> at 13.56 MHz (NFC)'], ['ratio', '|−∇<i>φ</i><sub>m</sub>| ÷ |−<i>jω</i><b>F</b>| at the ring'],
      ['theta', '<i>H</i><sub>θ</sub> ÷ (−<i>jωF</i><sub>θ</sub>)'], ['eh', '|<b>E</b>| ÷ <i>η</i>|<b>H</b>| (1 in a plane wave)']]);

    var F = RA.frame(plot.S, [LO, KR_MAX], [0.01, 1e4], [0.1, 1, 10], [0.01, 1, 100, 1e4], 'kr', '', function (x) { return String(x); },
      function (y) { return y === 1e4 ? '10⁴' : String(y); }, true, true);
    plot.title.textContent = 'Log-log plot against kr of the size of the pole term, of H, and of E over eta H, each per unit of the F term, at 45 degrees from the axis';
    var cGp = [], cH = [], cE = [];
    for (var i = 0; i <= 160; i++) {
      var kr = logVal(i / 160, LO), s = loopStats(kr, PROBE);
      cGp.push([kr, s.gpOverWA]); cH.push([kr, s.eOverWA]); cE.push([kr, s.eOverH * s.eOverWA]);
    }
    svg('path', { d: RA.path(cGp, F), fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 2 }, plot.S);
    svg('path', { d: RA.path(cH, F), fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, plot.S);
    svg('path', { d: RA.path(cE, F), fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-dasharray': '1.5 3' }, plot.S);
    svg('line', { x1: F.X(LO), x2: F.X(KR_MAX), y1: F.Y(1), y2: F.Y(1), stroke: 'var(--accent)', 'stroke-width': 1.5 }, plot.S);
    RA.legend(plot.S, 196, 34, [[{ stroke: 'var(--ra-warm)', 'stroke-width': 2 }, '−∇φm (poles)'], [{ stroke: 'currentColor', 'stroke-width': 2 }, 'H'],
      [{ stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-dasharray': '1.5 3' }, 'E/η'], [{ stroke: 'var(--accent)', 'stroke-width': 1.5 }, '−jωF']]);
    var marker = svg('line', { y1: 24, y2: 176, stroke: 'currentColor', 'stroke-opacity': 0.6, 'stroke-width': 1 }, plot.S);

    var pts, vecs;
    function update() {
      var R = 2 * st.kr;
      pts = gridPoints(R, NS);
      vecs = pts.map(function (p) { var f = loopDual(p.r, p.th); return { f: f, m: vabs(f.wF) + vabs(f.gp) }; });
      var s = loopStats(st.kr, PROBE);
      marker.setAttribute('x1', F.X(st.kr)); marker.setAttribute('x2', F.X(st.kr));
      rows.r.td.textContent = fmtCm(s.rcm) + ' (' + sig(st.kr / (2 * PI), 2) + ' λ)';
      rows.ratio.td.textContent = sig(s.gpOverWA, 3) + (s.gpOverWA > 1.05 ? ': the poles make most of H' : '');
      rows.theta.td.textContent = sig(s.thetaRatio, 3) + ' at ' + RA.signed(s.thetaPhase, 1) + '°';
      rows.eh.td.textContent = sig(s.eOverH, 3) + (s.eOverH < 0.1 ? ': almost all magnetic' : s.eOverH > 0.95 ? ': a plane wave' : '');
      map.cv.setAttribute('aria-label', 'Arrows of minus j omega F, minus grad phi m and H on a plane through a small horizontal loop, with E as circles out of the plane, out to kr = ' + fmtKr(R) +
        '. At the ring, the pole term is ' + sig(s.gpOverWA, 3) + ' times the F term.');
      pre.paint();
      frame(clk.t);
    }
    function frame(t) {
      var ctx = map.ctx, fg = getComputedStyle(map.cv).color, font = getComputedStyle(map.cv).fontFamily;
      var acc = RA.css('--accent') || '#36c', warm = RA.css('--ra-warm') || '#c63';
      ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.clearRect(0, 0, SIZE, SIZE + STRIP);
      var R = 2 * st.kr, h = SIZE / NS, wt = 2 * PI * t / 3, sc = SIZE / (2 * R), c = Math.cos(wt), sn = Math.sin(wt);
      ctx.lineCap = 'round';
      pts.forEach(function (p, i) {
        var k = 0.85 * h / vecs[i].m, f = vecs[i].f, x = SIZE / 2 + p.x * sc, y = SIZE / 2 - p.z * sc;
        // E_phi first, under the arrows: a circle of radius half the length an arrow of the same size would have;
        // phi-hat points into the page on the right (x > 0) and out of it on the left. A dot marks out, a cross in.
        if (st.show.E) {
          var out = -p.sx * (f.Ephi[0] * c - f.Ephi[1] * sn), rad = Math.min(0.32 * h, 0.5 * Math.abs(out) * k);
          if (rad > 1.2) {
            ctx.globalAlpha = 0.55; ctx.strokeStyle = fg; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(x, y, rad, 0, 2 * PI); ctx.stroke();
            if (out > 0) { ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(x, y, Math.min(2, rad / 3), 0, 2 * PI); ctx.fill(); }
            else { var q = rad * 0.6; ctx.beginPath(); ctx.moveTo(x - q, y - q); ctx.lineTo(x + q, y + q); ctx.moveTo(x - q, y + q); ctx.lineTo(x + q, y - q); ctx.stroke(); }
          }
        }
        var a = inst(f.wF, p, wt), b = inst(f.gp, p, wt), e = inst(f.H, p, wt);
        var ax = a[0] * k, ay = -a[1] * k, bx = b[0] * k, by = -b[1] * k;
        ctx.globalAlpha = 0.85; ctx.lineWidth = 2;
        if (st.show.wA) { ctx.strokeStyle = acc; arrowFrom(ctx, x, y, ax, ay); }
        if (st.show.gp) { ctx.strokeStyle = warm; arrowFrom(ctx, st.show.wA ? x + ax : x, st.show.wA ? y + ay : y, bx, by); }
        ctx.globalAlpha = 1; ctx.lineWidth = 1.3;
        if (st.show.H) { ctx.strokeStyle = fg; arrowFrom(ctx, x, y, e[0] * k, -e[1] * k); }
        ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(x, y, 1.3, 0, 2 * PI); ctx.fill();
      });
      ctx.globalAlpha = 1;
      drawFrame(ctx, R, st.kr, { fg: fg, font: font, loop: true });
    }
    RA.onTheme(function () { frame(clk.t); });
    update();
  }

  // ---- loopcheck: how far the exact loop is from its magnetic dipole -------------------------------------------
  function loopCheckCase(root, d) {
    var KA_LO = 0.003, KA_HI = 1, LO = KR_MIN_LOOP, HI = 100, TH = PI / 2;
    var st = { ka: Math.min(KA_HI, Math.max(KA_LO, +(d.ka || 0.1))) };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var slider = RA.slider(controls, { label: 'Loop size <i>C</i>/λ', min: 0, max: 1, step: 'any', value: logPos(st.ka, KA_LO, KA_HI),
      fmt: function (p) { return sig(logVal(p, KA_LO, KA_HI), 2); }, onInput: function (p) { st.ka = logVal(p, KA_LO, KA_HI); update(); } });
    var NFC = 2 * PI * 2 / LAMBDA_NFC_CM;   // a 4 cm reader loop (radius 2 cm) at 13.56 MHz
    var pre = presets(root, st, [['NFC reader, 4 cm across', NFC], ['C = λ/10 (the book’s limit)', 0.1], ['C = λ/3', 1 / 3], ['C = λ', 1]],
      function (ka) { st.ka = ka; slider.value = logPos(ka, KA_LO, KA_HI); slider.nextElementSibling.textContent = sig(ka, 2); update(); }, 'ka');
    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var plot = RA.plotBox(stage, 'How far the magnetic dipole is from the loop, in the loop’s plane');
    var rows = RA.readout(RA.el('div', {}, root), [['a', 'Loop diameter at 13.56 MHz'], ['far', 'Error far away'], ['near', 'Error at <i>kr</i> = 1'],
      ['ok', 'Within 1% beyond']]);
    var F = RA.frame(plot.S, [LO, HI], [1e-6, 1], [0.1, 1, 10, 100], [1e-6, 1e-4, 1e-2, 1], 'kr', '', function (x) { return String(x); },
      function (y) { return y === 1 ? '100%' : y === 1e-2 ? '1%' : y === 1e-4 ? '0.01%' : '10⁻⁴ %'; }, true, true);
    plot.title.textContent = 'Log-log plot against kr of the relative error of the magnetic-dipole field against the exact uniform loop, in the plane of the loop';
    svg('line', { x1: F.X(LO), x2: F.X(HI), y1: F.Y(0.01), y2: F.Y(0.01), stroke: 'var(--accent)', 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, plot.S);
    var curve = svg('path', { fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 2 }, plot.S);
    var farLine = svg('line', { stroke: 'currentColor', 'stroke-width': 1.2, 'stroke-dasharray': '1.5 3' }, plot.S);
    RA.legend(plot.S, 120, 13, [[{ stroke: 'var(--ra-warm)', 'stroke-width': 2 }, '|error|, outside 2a']]);
    RA.legend(plot.S, 230, 13, [[{ stroke: 'currentColor', 'stroke-width': 1.2, 'stroke-dasharray': '1.5 3' }, 'far limit']]);
    function update() {
      var pts = [], from = Math.max(LO, 2 * st.ka), lastBad = from;
      for (var i = 0; i <= 200; i++) {
        var kr = from * Math.pow(HI / from, i / 200), e = loopError(st.ka, kr, TH);
        pts.push([kr, Math.max(1e-6, Math.abs(e))]);
        if (Math.abs(e) > 0.01) lastBad = kr;
      }
      curve.setAttribute('d', RA.path(pts, F));
      var fe = farError(st.ka, TH);
      farLine.setAttribute('x1', F.X(LO)); farLine.setAttribute('x2', F.X(HI));
      farLine.setAttribute('y1', F.clampY(F.Y(Math.max(1e-6, Math.abs(fe))))); farLine.setAttribute('y2', F.clampY(F.Y(Math.max(1e-6, Math.abs(fe)))));
      function pct(e) { return RA.signed(100 * e, Math.abs(e) < 1e-3 ? 4 : 2) + '%'; }
      rows.a.td.textContent = fmtCm(2 * st.ka * LAMBDA_NFC_CM / (2 * PI)) + ' (ka = ' + sig(st.ka, 2) + ')';
      rows.far.td.textContent = pct(fe) + (Math.abs(fe) > 0.05 ? ' (' + RA.signed(20 * Math.log10(1 + fe), 1) + ' dB)' : '');
      rows.near.td.textContent = 1 >= 2 * st.ka ? pct(loopError(st.ka, 1, TH)) : 'inside 2a';
      rows.ok.td.textContent = Math.abs(fe) > 0.01 ? 'never: even far away it is ' + sig(100 * Math.abs(fe), 2) + '% off' : lastBad <= from * 1.0001 ? 'everywhere outside 2a' : 'kr = ' + sig(lastBad, 2);
      pre.paint();
    }
    update();
  }

  document.querySelectorAll('[data-widget="vector-potential"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
