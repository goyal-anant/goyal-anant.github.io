// effective-area: how much of an incoming plane wave an antenna collects, Balanis §2.15, eqs. (2-91) to (2-100).
//   flow      a short z-directed dipole at the origin in a plane wave E = z E0 exp(-jkx). The induced current is
//             I = E0 l / (Rr + RL + RT) (reactance tuned out); the total field is the wave plus the dipole's own
//             exact field, and the time-averaged Poynting vector S = Re(E x H*)/2 is traced as streamlines in the
//             H-plane (z = 0) or the E-plane (y = 0). Streamlines that end in the dipole carry the absorbed power.
//             Effective area Ae = (3 lambda^2 / 8 pi) 4 RT Rr / (Rr + RL + RT)^2, from (2-95).
//   length    a centre-fed dipole with the sinusoidal current: vector effective length from (2-92) referred to the
//             current maximum and to the feed, Rr from Balanis (8-60a) (efficiency-chain's dipoleZ), and
//             Aem = eta |le|^2 / (4 Rr) with both at the same current, which equals lambda^2 D0 / 4 pi.
//   aperture  a circular aperture of diameter d with the taper (1 - rho^2)^n: taper efficiency (2n + 1)/(n + 1)^2,
//             Aem = eps pi d^2 / 4, with the NEXRAD dish (8.54 m, 45.8 dBi at 2.85 GHz, NRC 2002) and wires.
// Markup from _includes/readalong/effective-area.html; helpers from readalong.js (window.RA). The maths at the top
// has no DOM and is also run under node by content/balanis/checks/effective_area.py.
(function () {
  var node = typeof module !== 'undefined';
  var EC = node ? require('./efficiency-chain.js') : window.EfficiencyChain;
  var PI = Math.PI, ETA = 120 * PI, K = 2 * PI, C0 = 299792458;   // lengths in wavelengths in the flow case

  // ---- flow -------------------------------------------------------------------------------------------------------
  // Dipole moment I l for a unit incident field, load RT = rho Rr and loss RL = loss Rr, Rr = 80 pi^2 (l/lambda)^2
  function moment(rho, loss) { return 1 / (80 * PI * PI * (1 + rho + loss)); }
  function aeFlow(rho, loss) { return 3 / (8 * PI) * 4 * rho / Math.pow(1 + rho + loss, 2); }
  function aAbs(rho, loss) { return 3 / (8 * PI) * 4 * (rho + loss) / Math.pow(1 + rho + loss, 2); }
  // complex helpers [re, im]
  function cm(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
  function ce(ph) { return [Math.cos(ph), Math.sin(ph)]; }
  // Total E and H at (u, v) in the chosen plane: H-plane u = x, v = y (z = 0); E-plane u = x, v = z (y = 0).
  // Returns in-plane components: plane H: Ez (out of plane), Hx, Hy. Plane E: Ex, Ez, Hy (out of plane).
  function fieldsAt(u, v, plane, Il) {
    var r = Math.hypot(u, v), kr = K * r, ph = ce(-kr), inc = ce(-K * u);
    var a = [1, -1 / kr], b = [1 - 1 / (kr * kr), -1 / kr];   // 1 + 1/(jkr) and 1 + 1/(jkr) - 1/(kr)^2
    var cH = cm(cm([0, K * Il / (4 * PI * r)], a), ph);        // H_phi / sin(theta)
    var cT = cm(cm([0, ETA * K * Il / (4 * PI * r)], b), ph);  // E_theta / sin(theta)
    if (plane === 'H') {                                       // theta = 90 deg: theta-hat = -z, phi-hat = (-y, x)/r
      var Ez = [inc[0] - cT[0], inc[1] - cT[1]];
      return { Ez: Ez, Hx: [-cH[0] * v / r, -cH[1] * v / r], Hy: [cH[0] * u / r - inc[0] / ETA, cH[1] * u / r - inc[1] / ETA] };
    }
    var ct = v / r, st = Math.abs(u) / r, sg = u >= 0 ? 1 : -1;   // phi = 0 for x > 0, pi for x < 0
    var cR = cm(cm([ETA * Il / (2 * PI * r * r), 0], a), ph);    // E_r / cos(theta)
    var Er = [cR[0] * ct, cR[1] * ct], Et = [cT[0] * st, cT[1] * st], Hp = [cH[0] * st, cH[1] * st];
    // r-hat = (sg st, ct), theta-hat = (sg ct, -st) in (x, z); phi-hat = sg y-hat
    return { Ex: [sg * (Er[0] * st + Et[0] * ct), sg * (Er[1] * st + Et[1] * ct)],
      Ez: [Er[0] * ct - Et[0] * st + inc[0], Er[1] * ct - Et[1] * st + inc[1]],
      Hy: [sg * Hp[0] - inc[0] / ETA, sg * Hp[1] - inc[1] / ETA] };
  }
  // time-averaged Poynting vector (in-plane components) over the incident density 1/(2 eta)
  function poynting(u, v, plane, Il) {
    var f = fieldsAt(u, v, plane, Il), re = function (a, b) { return a[0] * b[0] + a[1] * b[1]; };   // Re(a b*)
    if (plane === 'H') return [-ETA * re(f.Ez, f.Hy), ETA * re(f.Ez, f.Hx)];   // S = Ez z x H*
    return [-ETA * re(f.Ez, f.Hy), ETA * re(f.Ex, f.Hy)];                      // S = (Ex, Ez) x Hy y*
  }
  // Streamline from (u, v) along S by RK4 with step h (wavelengths). Ends in the dipole (r < rEnd), off the box, or
  // after n steps.
  function trace(u, v, plane, Il, box, h, n, rEnd) {
    var pts = [[u, v]], hit = false;
    function dir(p) { var s = poynting(p[0], p[1], plane, Il), m = Math.hypot(s[0], s[1]) || 1; return [s[0] / m, s[1] / m]; }
    for (var i = 0; i < n; i++) {
      var p = pts[pts.length - 1], k1 = dir(p), k2 = dir([p[0] + h / 2 * k1[0], p[1] + h / 2 * k1[1]]);
      var k3 = dir([p[0] + h / 2 * k2[0], p[1] + h / 2 * k2[1]]), k4 = dir([p[0] + h * k3[0], p[1] + h * k3[1]]);
      var q = [p[0] + h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), p[1] + h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])];
      pts.push(q);
      if (Math.hypot(q[0], q[1]) < rEnd) { hit = true; pts.push([0, 0]); break; }
      if (q[0] < box[0] - 1e-9 || q[0] > box[1] || Math.abs(q[1]) > box[2]) break;
    }
    return { pts: pts, hit: hit };
  }
  // Half-width at u = x0 of the bundle of streamlines that end in the dipole (bisection on the start offset)
  function captureHalf(plane, rho, loss, x0, h) {
    var Il = moment(rho, loss), box = [x0, -x0, 2], lo = 0, hi = 1.2;
    if (rho + loss === 0) return 0;
    if (!trace(x0, 1e-4, plane, Il, box, h, 4000, 0.01).hit) return 0;
    for (var i = 0; i < 22; i++) {
      var m = (lo + hi) / 2;
      if (trace(x0, m, plane, Il, box, h, 4000, 0.01).hit) lo = m; else hi = m;
    }
    return lo;
  }

  // ---- length -----------------------------------------------------------------------------------------------------
  // |le(theta)| / lambda of a dipole of length L wavelengths, referred to the current maximum; the feed value is this
  // over sin(kl/2) (negative past one wavelength: the feed current reverses). Far field of I0 sin k(l/2 - |z|):
  // E_theta = j eta I0 e^-jkr / (2 pi r) [cos(kl/2 cos t) - cos(kl/2)] / sin t, so by (2-92) |le| = (lambda/pi) [..]/sin t.
  function leMax(L, t) {
    var s = Math.sin(t), kl2 = PI * L;
    if (s < 1e-6) return 0;
    return (Math.cos(kl2 * Math.cos(t)) - Math.cos(kl2)) / (PI * s);
  }
  function feed(L) { return Math.sin(PI * L); }
  // Radiation resistance at the current maximum (efficiency-chain's dipoleZ is referred to the feed)
  function rMax(L) { return EC.dipoleZ(L, 1e-4).R * Math.pow(Math.sin(PI * L), 2); }
  // Maximum effective area / lambda^2 in the broadside... in the direction of maximum: eta |le|^2 / (4 Rr) at the
  // same current, maximised over theta
  function aem(L) {
    var R = rMax(L), best = 0, bt = PI / 2;
    for (var i = 1; i < 1800; i++) { var t = i * PI / 1800, l = leMax(L, t); if (l * l > best) { best = l * l; bt = t; } }
    return { a: ETA * best / (4 * R), theta: bt, R: R };
  }

  // ---- aperture ---------------------------------------------------------------------------------------------------
  function taperEff(n) { return (2 * n + 1) / Math.pow(n + 1, 2); }
  var NEXRAD = { d: 8.54, f: 2.85e9, gdb: 45.8 };
  function nexrad() {
    var lam = C0 / NEXRAD.f, ae = Math.pow(10, NEXRAD.gdb / 10) * lam * lam / (4 * PI), ap = PI * NEXRAD.d * NEXRAD.d / 4;
    return { lam: lam, ae: ae, ap: ap, eff: ae / ap };
  }

  var api = { moment: moment, aeFlow: aeFlow, aAbs: aAbs, poynting: poynting, trace: trace, captureHalf: captureHalf,
    leMax: leMax, feed: feed, rMax: rMax, aem: aem, taperEff: taperEff, nexrad: nexrad };
  if (node) { module.exports = api; return; }

  // ---- drawing ----------------------------------------------------------------------------------------------------
  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fmtLen(m) { return m < 1e-3 ? sig(m * 1e6, 3) + ' µm' : m < 1 ? sig(m * 100, 3) + ' cm' : sig(m, 3) + ' m'; }
  function fmtArea(m2) { return m2 < 1e-4 ? sig(m2 * 1e6, 3) + ' mm²' : m2 < 1 ? sig(m2 * 1e4, 3) + ' cm²' : sig(m2, 3) + ' m²'; }
  function fmtF(f) { return f < 1e9 ? sig(f / 1e6, 3) + ' MHz' : sig(f / 1e9, 3) + ' GHz'; }
  function fmtV(v) { return v < 1e-6 ? sig(v * 1e9, 3) + ' nV' : v < 1e-3 ? sig(v * 1e6, 3) + ' µV' : v < 1 ? sig(v * 1e3, 3) + ' mV' : sig(v, 3) + ' V'; }
  function fmtDbm(p) { return (10 * Math.log10(p / 1e-3)).toFixed(1).replace('-', '−') + ' dBm'; }
  function logPos(lo, hi, v) { return Math.log(v / lo) / Math.log(hi / lo); }
  function logVal(lo, hi, p) { return lo * Math.pow(hi / lo, p); }

  // Shared animation clock: one requestAnimationFrame loop per widget, paused off screen and by the Play button.
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

  function init(root) {
    var d = root.dataset, kind = d.case || 'flow';
    root.textContent = '';
    ({ flow: flowCase, length: lengthCase, aperture: apertureCase })[kind](root, d);
  }

  // ---- flow: Poynting streamlines into a short dipole -------------------------------------------------------------
  // The page shows x from -1.4 to 1.4 wavelengths and the transverse axis from -0.9 to 0.9.
  function flowCase(root, d) {
    var st = { plane: d.plane || 'H', rho: +(d.load || 1), loss: d.loss === 'on' ? 1 : 0, open: false };
    var X0 = -1.4, X1 = 1.4, Y1 = 0.9, W = 560, H = Math.round(W * Y1 / X1), sc = W / (X1 - X0);
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var paintPlane = RA.toggle(controls, 'Cut', [['H', 'H-plane (top view)'], ['E', 'E-plane (side view)']], function () { return st.plane; }, function (v) { st.plane = v; rebuild(); });
    var LO = 0.01, HI = 100;
    var load = RA.slider(controls, { label: 'Load <i>R</i><sub>T</sub>/<i>R</i><sub>r</sub>', min: 0, max: 1, step: 'any', value: logPos(LO, HI, st.rho),
      fmt: function (p) { return sig(logVal(LO, HI, p), 2); }, onInput: function (p) { st.rho = logVal(LO, HI, p); st.open = false; rebuild(); } });
    var paintLoss = RA.toggle(controls, 'Wire loss', [[0, 'None'], [1, 'RL = Rr']], function () { return st.loss; },
      function (v) { st.loss = v; rebuild(); });
    var pre = RA.el('div', { class: 'ra-controls' }, root), pbtn = [];
    [['Matched', 1, 0], ['Open circuit', 0, 0], ['Shorted', 0, 0], ['Matched, lossy', 2, 1]].forEach(function (p) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, pre, p[0]);
      b.addEventListener('click', function () { st.rho = p[1]; st.loss = p[2]; st.open = p[0] === 'Open circuit'; rebuild(); });
      pbtn.push([p, b]);
    });
    var clk = clock(root, pre, function (t) { frame(t); });

    var wrap = RA.el('div', { class: 'ra-flow' }, root);
    var cv = RA.el('canvas', { width: W * 2, height: H * 2, role: 'img' }, wrap);
    cv.style.width = '100%'; cv.style.maxWidth = W + 'px'; cv.style.display = 'block'; cv.style.margin = '0 auto';
    var ctx = cv.getContext('2d');
    var rows = RA.readout(RA.el('div', {}, root), [['ae', 'Effective area <i>A</i><sub>e</sub>'], ['split', 'Of the absorbed power'],
      ['w', 'Capture band at the left edge'], ['wire', 'Wire, λ/50 long and λ/300 thick']]);

    // background wave: complex Ez on a coarse grid, multiplied by exp(j w t) each frame
    var GX = 140, GY = Math.round(GX * Y1 / X1), grid, lines, cap, img = ctx.createImageData(GX, GY), off = document.createElement('canvas');
    off.width = GX; off.height = GY;
    var px = function (x) { return (x - X0) * sc; }, py = function (y) { return H / 2 - y * sc; };

    function rebuild() {
      var rho = st.rho, Il = st.open ? 0 : moment(rho, st.loss);
      grid = new Float32Array(GX * GY * 2);
      for (var j = 0; j < GY; j++) for (var i = 0; i < GX; i++) {
        var x = X0 + (i + 0.5) / GX * (X1 - X0), y = Y1 - (j + 0.5) / GY * 2 * Y1;
        if (Math.hypot(x, y) < 0.02) { x = 0.02; }
        var f = fieldsAt(x, y, st.plane, Il);
        grid[2 * (j * GX + i)] = f.Ez[0]; grid[2 * (j * GX + i) + 1] = f.Ez[1];
      }
      // streamlines from the left edge, evenly spaced (the incident flow there is nearly uniform)
      lines = [];
      var half = Il ? captureHalf(st.plane, rho, st.loss, X0, 0.01) : 0;
      cap = { half: half };
      var N = 26;   // seeds sit half a gap off the axis: a line started exactly on it meets the stagnation points
      for (var k = 0; k < N; k++) {
        var v0 = -Y1 + 2 * Y1 * (k + 0.5) / N;
        lines.push(Il ? trace(X0, v0, st.plane, Il, [X0, X1, Y1], 0.01, 900, 0.01) : { pts: [[X0, v0], [X1, v0]], hit: false });
      }
      // with nothing absorbed (open or shorted) a line can still run into the point dipole's singular near field and
      // out again, so no line is drawn as ending in the load
      if (rho + st.loss === 0) lines.forEach(function (l) { l.hit = false; });
      if (half > 0) [-half, half].forEach(function (v) { var t = trace(X0, v * 0.999, st.plane, Il, [X0, X1, Y1], 0.01, 4000, 0.01); t.edge = true; lines.push(t); });
      lines.forEach(function (l) {   // arc length table for the moving dots
        var s = [0];
        for (var i = 1; i < l.pts.length; i++) s.push(s[i - 1] + Math.hypot(l.pts[i][0] - l.pts[i - 1][0], l.pts[i][1] - l.pts[i - 1][1]));
        l.s = s;
      });
      cap.ae = Il ? aeFlow(rho, st.loss) : 0;
      paint(rho);
      frame(clk.t);
    }
    function paint(rho) {
      paintPlane(); paintLoss();
      load.value = st.open ? 1 : logPos(LO, HI, Math.max(LO, rho));
      load.nextElementSibling.textContent = st.open ? 'open' : rho === 0 ? 'short' : sig(rho, 2);
      pbtn.forEach(function (q) {
        var p = q[0], on = p[0] === 'Open circuit' ? !!st.open : !st.open && Math.abs(st.rho - p[1]) <= 1e-6 * p[1] && st.loss === p[2];
        q[1].setAttribute('aria-pressed', String(on));
      });
      var a = cap.ae, ab = st.open ? 0 : aAbs(rho, st.loss), a0 = 3 / (8 * PI);
      rows.ae.td.textContent = sig(a, 3) + ' λ², ' + Math.round(100 * a / a0) + '% of the matched 0.119 λ²';
      rows.split.td.textContent = ab === 0 ? 'nothing is absorbed' : Math.round(100 * a / ab) + '% to the load, ' + Math.round(100 * (1 - a / ab)) + '% heats the wire';
      rows.w.td.textContent = cap.half > 0 ? sig(2 * cap.half, 2) + ' λ wide' : 'none: no streamline ends in the wire';
      rows.wire.td.textContent = cap.half > 0 ? 'capture band is ' + Math.round(2 * cap.half * 300) + ' times the wire thickness' : 'it collects nothing';
      cv.setAttribute('aria-label', 'Time-averaged energy flow of a plane wave travelling left to right past a short dipole, ' + (st.plane === 'H' ? 'seen from above (H-plane)' : 'seen from the side (E-plane)') +
        '. ' + rows.ae.td.textContent + '. ' + rows.w.td.textContent + '.');
    }
    function frame(t) {
      var dark = getComputedStyle(cv).color, acc = RA.css('--accent') || '#36c', warm = RA.css('--ra-warm') || '#c63';
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // wave: Re(Ez exp(j w t)), one period every 2 s, shaded with the accent colour
      var w = 2 * PI * t / 2, c = Math.cos(w), s = Math.sin(w), pos = toRGB(acc), neg = toRGB(warm);
      for (var i = 0; i < GX * GY; i++) {
        var v = grid[2 * i] * c - grid[2 * i + 1] * s, a = Math.tanh(Math.abs(v) / 1.2), col = v > 0 ? pos : neg;
        img.data[4 * i] = col[0]; img.data[4 * i + 1] = col[1]; img.data[4 * i + 2] = col[2];
        img.data[4 * i + 3] = Math.round(60 * a);
      }
      off.getContext('2d').putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(off, 0, 0, W, H);
      // capture band
      var edges = lines.filter(function (l) { return l.edge; });
      if (edges.length === 2) {
        ctx.beginPath();
        edges[0].pts.forEach(function (p, i) { ctx[i ? 'lineTo' : 'moveTo'](px(p[0]), py(p[1])); });
        edges[1].pts.slice().reverse().forEach(function (p) { ctx.lineTo(px(p[0]), py(p[1])); });
        ctx.fillStyle = acc; ctx.globalAlpha = 0.18; ctx.fill(); ctx.globalAlpha = 1;
      }
      lines.forEach(function (l) {
        ctx.beginPath();
        l.pts.forEach(function (p, i) { ctx[i ? 'lineTo' : 'moveTo'](px(p[0]), py(p[1])); });
        ctx.strokeStyle = l.hit ? acc : dark; ctx.globalAlpha = l.hit ? 0.9 : 0.35; ctx.lineWidth = l.hit ? 1.4 : 0.8; ctx.stroke();
        ctx.globalAlpha = 1;
        // dots moving along the line, 0.25 wavelength apart, at 0.3 wavelength per second
        var L = l.s[l.s.length - 1], gap = 0.25, off0 = (0.3 * t) % gap;
        ctx.fillStyle = l.hit ? acc : dark;
        for (var a = off0; a < L; a += gap) { var p = at(l, a); ctx.beginPath(); ctx.arc(px(p[0]), py(p[1]), l.hit ? 2 : 1.4, 0, 2 * PI); ctx.globalAlpha = l.hit ? 1 : 0.5; ctx.fill(); }
        ctx.globalAlpha = 1;
      });
      // the wire at true scale: lambda/300 thick, lambda/50 long (a dot seen from above)
      ctx.fillStyle = dark;
      if (st.plane === 'H') { ctx.beginPath(); ctx.arc(px(0), py(0), Math.max(1, sc / 600), 0, 2 * PI); ctx.fill(); }
      else ctx.fillRect(px(0) - Math.max(0.5, sc / 600), py(0.01), Math.max(1, sc / 300), sc / 50);
      // a ring and a label so the reader can find the wire, which is under a pixel thick at this scale
      ctx.beginPath(); ctx.arc(px(0), py(0), 9, 0, 2 * PI);
      ctx.strokeStyle = dark; ctx.lineWidth = 1.2; ctx.setLineDash([3, 2]); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(px(0) + 6.4, py(0) + 6.4); ctx.lineTo(px(0) + 28, py(0) + 34); ctx.lineWidth = 0.8; ctx.stroke();
      ctx.font = '11px ' + getComputedStyle(cv).fontFamily; ctx.fillStyle = dark;
      ctx.fillText('wire, to scale', px(0) + 30, py(0) + 44);
      ctx.globalAlpha = 0.8;
      ctx.fillText('wave →', 8, 14);
      ctx.fillText(st.plane === 'H' ? 'E points out of the screen' : 'E points up', 8, H - 8);
      // scale bar, a quarter wavelength
      ctx.fillRect(W - 8 - sc / 4, H - 14, sc / 4, 1.5); ctx.textAlign = 'right'; ctx.fillText('λ/4', W - 8, H - 18); ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
    }
    function at(l, a) {
      var s = l.s, lo = 0, hi = s.length - 1;
      while (hi - lo > 1) { var m = (lo + hi) >> 1; if (s[m] < a) lo = m; else hi = m; }
      var f = (a - s[lo]) / ((s[hi] - s[lo]) || 1), p = l.pts[lo], q = l.pts[hi];
      return [p[0] + f * (q[0] - p[0]), p[1] + f * (q[1] - p[1])];
    }
    RA.onTheme(function () { frame(clk.t); });
    rebuild();
  }
  var rgbCache = {};
  function toRGB(c) {
    if (rgbCache[c]) return rgbCache[c];
    var x = document.createElement('canvas').getContext('2d'); x.fillStyle = c; var h = x.fillStyle;
    var out = h[0] === '#' ? [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)] : (h.match(/\d+/g) || [80, 120, 200]).slice(0, 3).map(Number);
    return (rgbCache[c] = out);
  }

  // ---- length: vector effective length and the open-circuit voltage ----------------------------------------------
  function lengthCase(root, d) {
    var st = { L: +(d.length || 0.5), f: +(d.f || 100) * 1e6, E: +(d.field || 1e-3), th: 90 };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var sl = {};
    function logS(key, label, lo, hi, fmt) {
      var inp = RA.slider(controls, { label: label, min: 0, max: 1, step: 'any', value: logPos(lo, hi, st[key]), fmt: function (p) { return fmt(logVal(lo, hi, p)); },
        onInput: function (p) { st[key] = logVal(lo, hi, p); draw(); } });
      sl[key] = function () { inp.value = logPos(lo, hi, st[key]); inp.nextElementSibling.textContent = fmt(st[key]); };
    }
    var lin = RA.slider(controls, { label: 'Length <i>l</i>/λ', min: 0.05, max: 1.5, step: 0.005, value: st.L, fmt: function (v) { return v.toFixed(3); }, onInput: function (v) { st.L = v; draw(); } });
    sl.L = function () { lin.value = st.L; lin.nextElementSibling.textContent = st.L.toFixed(3); };
    var thS = RA.slider(controls, { label: 'Wave arrives from θ', min: 0, max: 180, step: 1, value: st.th, fmt: function (v) { return v + '°'; }, onInput: function (v) { st.th = v; draw(); } });
    sl.th = function () { thS.value = st.th; thS.nextElementSibling.textContent = st.th + '°'; };
    logS('f', 'Frequency', 1e6, 1e10, fmtF);
    logS('E', 'Field strength', 1e-6, 1, function (v) { return fmtV(v) + '/m'; });
    var pre = RA.el('div', { class: 'ra-controls' }, root), pbtn = [];
    [['FM rabbit ears, 1 mV/m', { L: 0.5, f: 1e8, E: 1e-3, th: 90 }], ['Wi-Fi dipole', { L: 0.5, f: 2.45e9, E: 0.1, th: 90 }], ['Full wave', { L: 1, f: 1e8, E: 1e-3, th: 90 }]].forEach(function (p) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, pre, p[0]);
      b.addEventListener('click', function () { Object.assign(st, p[1]); draw(); });
      pbtn.push(p.concat(b));
    });
    var clk = clock(root, pre, function (t) { anim(t); });
    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);

    // 1. the dipole, its current, and the wave arriving from theta
    var boxA = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, boxA, 'The dipole, its current, the incoming wave');
    var A = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', role: 'img' }, boxA), At = svg('title', {}, A);
    var cid = 'ea-clip-' + Math.random().toString(36).slice(2, 8);
    svg('rect', { x: -1.3, y: -1.3, width: 2.6, height: 2.6 }, svg('clipPath', { id: cid }, svg('defs', {}, A)));
    var gW = svg('g', { 'clip-path': 'url(#' + cid + ')' }, A), gD = svg('g', {}, A), vText = svg('text', { x: 0.12, y: 1.22, 'font-size': 0.1, fill: 'currentColor' }, A);
    // 2. polar |le(theta)|
    var boxB = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, boxB, 'Effective length |ℓe(θ)|');
    var B = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', role: 'img' }, boxB), Bt = svg('title', {}, B), gB = svg('g', {}, B);
    // 3. le/l and Aem against length
    var P = RA.plotBox(stage, 'Effective length at the feed, and Aem, against length'), PL = svg('g', {}, P.S);
    var rbox = RA.el('div', {}, stage);
    var rows = RA.readout(rbox, [['lam', 'Wavelength, length'], ['lm', '|ℓe| at the current maximum'], ['lf', '|ℓe| at the feed'], ['voc', 'Open-circuit voltage at the feed'],
      ['rin', 'Radiation resistance at the feed'], ['ae', 'Effective area in this direction'], ['p', 'Power into a matched load']]);
    var sty = { f: { stroke: 'var(--accent)', 'stroke-width': 1.8 }, m: { stroke: 'currentColor', 'stroke-width': 1.2, 'stroke-dasharray': '4 3' },
      a: { stroke: 'var(--ra-warm)', 'stroke-width': 1.6 } };
    var curve = [];
    for (var i = 0; i <= 290; i++) {
      var L = 0.05 + i * 0.005, lm = leMax(L, PI / 2), sf = feed(L);
      curve.push({ L: L, lf: Math.abs(sf) > 1e-3 ? lm / sf / L : NaN, lm: lm / L, a: aem(L).a });
    }
    var cur;
    function draw() {
      Object.keys(sl).forEach(function (k) { sl[k](); });
      pbtn.forEach(function (q) { var on = Object.keys(q[1]).every(function (k) { return Math.abs(st[k] - q[1][k]) <= 1e-9 * Math.abs(q[1][k]) + 1e-12; }); q[2].setAttribute('aria-pressed', String(on)); });
      var lam = C0 / st.f, t = st.th * PI / 180, lm = leMax(st.L, t), sf = feed(st.L), R = rMax(st.L);
      var Rin = Math.abs(sf) > 1e-6 ? R / (sf * sf) : Infinity, lf = Math.abs(sf) > 1e-6 ? lm / sf : Infinity;
      var ae = ETA * lm * lm / (4 * R) * lam * lam, Wi = st.E * st.E / (2 * ETA), voc = st.E * Math.abs(lf) * lam;
      cur = { lam: lam, voc: voc, lf: lf };
      rows.lam.td.textContent = fmtLen(lam) + ', ' + fmtLen(st.L * lam);
      rows.lm.td.textContent = sig(Math.abs(lm), 3) + ' λ = ' + fmtLen(Math.abs(lm) * lam);
      rows.lf.td.textContent = isFinite(lf) ? sig(Math.abs(lf), 3) + ' λ = ' + fmtLen(Math.abs(lf) * lam) + ', ' + sig(Math.abs(lf) / st.L, 3) + ' × its length' + (lf < 0 ? ' (feed current reversed)' : '') : 'infinite (no current at the feed)';
      rows.voc.td.textContent = isFinite(voc) ? fmtV(voc) : 'infinite in this model';
      rows.rin.td.textContent = isFinite(Rin) ? sig(Rin, 3) + ' Ω' : 'infinite in this model';
      rows.ae.td.textContent = sig(ae / (lam * lam), 3) + ' λ² = ' + fmtArea(ae);
      rows.p.td.textContent = ae > 0 ? fmtDbm(ae * Wi) + ' (' + fmtV(st.E) + '/m)' : 'none';
      // polar
      gB.textContent = '';
      var mx = 0, pts1 = [], pts2 = [];
      for (var i = 0; i <= 360; i++) { var tt = i * PI / 180, a = Math.abs(leMax(st.L, tt % (2 * PI) > PI ? 2 * PI - tt % (2 * PI) : tt)); mx = Math.max(mx, a); pts1.push([tt, a]); }
      var fr = isFinite(lf) && Math.abs(sf) > 1e-6 ? 1 / Math.abs(sf) : null, top = Math.max(mx, fr && fr * mx < 20 * mx ? fr * mx : mx);
      var scale = 1 / (top || 1);
      RA.polarGrid(gB, [{ r: 0.5, label: sig(top / 2, 2) + ' λ' }, { r: 1, label: sig(top, 2) + ' λ' }], function (a) { return a + '°'; }, { up: 'z', right: 'x' });
      function poly(k, attrs) {
        svg('path', Object.assign({ d: pts1.map(function (q, i) { var r = q[1] * k * scale; return (i ? 'L' : 'M') + (r * Math.sin(q[0])).toFixed(4) + ' ' + (-r * Math.cos(q[0])).toFixed(4); }).join('') + 'Z', fill: 'none' }, attrs), gB);
      }
      poly(1, { stroke: 'currentColor', 'stroke-width': 0.012, 'stroke-dasharray': '0.04 0.03' });
      if (fr && fr * mx * scale <= 1.0001) poly(fr, { stroke: 'var(--accent)', 'stroke-width': 0.02 });
      var rr = Math.abs(lm) * (fr && fr * mx * scale <= 1.0001 ? fr : 1) * scale;
      svg('circle', { cx: rr * Math.sin(t), cy: -rr * Math.cos(t), r: 0.04, fill: 'currentColor' }, gB);
      svg('text', { x: -1.25, y: 1.25, 'font-size': 0.075, fill: 'currentColor', 'fill-opacity': 0.7 }, gB).textContent = fr && fr * mx * scale <= 1.0001 ? 'solid: at the feed · dashed: at the current max' : 'at the current max (feed value off scale)';
      Bt.textContent = 'Polar plot of the effective length against direction for a ' + st.L.toFixed(3) + ' wavelength dipole, referred to the feed and to the current maximum.';
      // le/l and Aem against L
      PL.textContent = '';
      var F = RA.frame(PL, [0.05, 1.5], [0, 2], [0.25, 0.5, 0.75, 1, 1.25, 1.5], [0, 0.5, 1, 1.5, 2], 'l/λ', '', String, String, false, false);
      var seg = [], segs = [];
      curve.forEach(function (q) { if (isFinite(q.lf) && Math.abs(q.lf) < 2.2) seg.push([q.L, Math.abs(q.lf)]); else if (seg.length) { segs.push(seg); seg = []; } });
      if (seg.length) segs.push(seg);
      segs.forEach(function (s) { svg('path', Object.assign({ d: RA.path(s, F), fill: 'none' }, sty.f), PL); });
      svg('path', Object.assign({ d: RA.path(curve.map(function (q) { return [q.L, q.lm]; }), F), fill: 'none' }, sty.m), PL);
      svg('path', Object.assign({ d: RA.path(curve.map(function (q) { return [q.L, 4 * q.a]; }), F), fill: 'none' }, sty.a), PL);
      svg('line', { x1: F.X(st.L), x2: F.X(st.L), y1: F.Y(2), y2: F.Y(0), stroke: 'currentColor', 'stroke-opacity': 0.5 }, PL);
      RA.legend(PL, 50, 38, [[sty.f, '|ℓe|/l at the feed'], [sty.m, '|ℓe|/l at the current max'], [sty.a, 'Aem in units of λ²/4']]);
      P.title.textContent = 'Effective length over physical length at broadside, at the feed (goes to infinity at one wavelength) and at the current maximum, and the maximum effective area, which stays finite, against dipole length.';
      At.textContent = 'A dipole of ' + st.L.toFixed(3) + ' wavelengths along z with its standing-wave current, and a plane wave arriving from ' + st.th + ' degrees. Open-circuit voltage ' + rows.voc.td.textContent + '.';
      anim(clk.t);
    }
    function anim(t) {
      // the dipole is drawn 1.6 units tall for 1.5 wavelengths at most; the current |I(z)| as a filled envelope
      var Ls = 1.6 / Math.max(st.L, 0.6), h = st.L / 2 * Ls, w = 2 * PI * t / 2, th = st.th * PI / 180;
      gD.textContent = '';
      var env = [], n = 60;
      for (var i = 0; i <= n; i++) { var z = -h + 2 * h * i / n, I = Math.sin(PI * st.L - 2 * PI * Math.abs(z / Ls)); env.push([0.35 * I * Math.cos(w), z]); }
      svg('path', { d: env.map(function (q, i) { return (i ? 'L' : 'M') + q[0].toFixed(4) + ' ' + (-q[1]).toFixed(4); }).join('') + 'L0 ' + (-h).toFixed(4) + 'L0 ' + h.toFixed(4) + 'Z', fill: 'var(--accent)', 'fill-opacity': 0.3, stroke: 'none' }, gD);
      svg('line', { x1: 0, y1: -h, x2: 0, y2: -0.025, stroke: 'currentColor', 'stroke-width': 0.025 }, gD);
      svg('line', { x1: 0, y1: 0.025, x2: 0, y2: h, stroke: 'currentColor', 'stroke-width': 0.025 }, gD);
      svg('circle', { cx: 0, cy: 0, r: 0.03, fill: 'none', stroke: 'currentColor', 'stroke-width': 0.012 }, gD);
      // wavefronts: lines perpendicular to the arrival direction, moving towards the dipole, one wavelength apart
      gW.textContent = '';
      var ux = Math.sin(th), uz = Math.cos(th), ph = (t / 2) % 1;
      for (var k = -6; k <= 6; k++) {   // crests (solid) and troughs (dashed), half a wavelength apart
        var s = (k / 2 + ph) * Ls;   // distance along the arrival direction; moves one wavelength per period (2 s)
        var cx = ux * (1.2 - s), cz = uz * (1.2 - s);
        if (Math.abs(1.2 - s) > 1.9) continue;
        svg('line', { x1: cx - uz * 1.8, y1: -(cz + ux * 1.8), x2: cx + uz * 1.8, y2: -(cz - ux * 1.8), stroke: 'var(--ra-warm)', 'stroke-width': 0.012, 'stroke-opacity': 0.6,
          'stroke-dasharray': ((k % 2) + 2) % 2 ? '0.04 0.04' : 'none' }, gW);
      }
      svg('text', { x: 1.18 * ux, y: -1.18 * uz, 'font-size': 0.09, 'text-anchor': 'middle', fill: 'var(--ra-warm)' }, gW).textContent = 'θ = ' + st.th + '°';
      vText.textContent = cur && isFinite(cur.voc) ? 'V(t) at the feed: ' + (cur.voc * Math.cos(w) >= 0 ? '+' : '−') + fmtV(Math.abs(cur.voc * Math.cos(w))) : 'V at the feed: infinite here';
    }
    RA.onTheme(draw);
    draw();
  }

  // ---- aperture: physical area against effective area ------------------------------------------------------------
  function apertureCase(root, d) {
    var st = { n: +(d.taper || 1), dl: +(d.size || 10) };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var nS = RA.slider(controls, { label: 'Edge taper <i>n</i> in (1 − ρ<sup>2</sup>)<sup><i>n</i></sup>', min: 0, max: 3, step: 0.05, value: st.n, fmt: function (v) { return v.toFixed(2); }, onInput: function (v) { st.n = v; draw(); } });
    var pre = RA.el('div', { class: 'ra-controls' }, root), pbtn = [];
    [['Uniform', 0], ['Parabolic', 1], ['Parabolic squared', 2]].forEach(function (p) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, pre, p[0]);
      b.addEventListener('click', function () { st.n = p[1]; draw(); });
      pbtn.push(p.concat(b));
    });
    var clk = clock(root, pre, function (t) { anim(t); });
    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var boxA = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, boxA, 'Aperture face-on: physical and effective area');
    var A = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', role: 'img' }, boxA), At = svg('title', {}, A);
    var defs = svg('defs', {}, A), gA = svg('g', {}, A), stops = [];
    var P = RA.plotBox(stage, 'Effective area over physical area (log scale)'), PL = svg('g', {}, P.S);
    var rows = RA.readout(RA.el('div', {}, stage), [['eff', 'Aperture (taper) efficiency'], ['nx', 'NEXRAD dish, measured']]);
    var nx = nexrad();
    // wires: a lambda/2 dipole of a 1 mm wire at 2.45 GHz, a lambda/50 dipole of a lambda/300 wire; physical area is
    // the lengthwise cross-section, length times diameter
    var lamW = C0 / 2.45e9;
    var BARS = function () {
      return [['λ/50 dipole, λ/300 wire', (3 / (8 * PI)) / ((1 / 50) * (1 / 300))], ['Wi-Fi λ/2, 1 mm wire', aem(0.5).a * lamW * lamW / (0.5 * lamW * 1e-3)],
        ['This, aperture', taperEff(st.n)], ['NEXRAD, measured', nx.eff]];
    };
    function draw() {
      nS.value = st.n; nS.nextElementSibling.textContent = st.n.toFixed(2);
      pbtn.forEach(function (q) { q[2].setAttribute('aria-pressed', String(Math.abs(st.n - q[1]) < 1e-9)); });
      var e = taperEff(st.n);
      rows.eff.td.textContent = (100 * e).toFixed(1) + '% (uniform 100%, parabolic 75.0%, parabolic squared 55.6%)';
      rows.nx.td.textContent = sig(nx.ae, 3) + ' m² of ' + sig(nx.ap, 3) + ' m², ' + Math.round(100 * nx.eff) + '%';
      PL.textContent = '';
      var bars = BARS(), F = RA.frame(PL, [0, 1], [0.1, 1e4], [], [0.1, 1, 10, 100, 1000], '', 'Aem / area', String, function (v) { return v >= 1 ? String(v) : '0.1'; }, false, true);
      bars.forEach(function (b, i) {
        var x = 0.06 + i * 0.24, y0 = F.Y(0.1), y1 = F.Y(Math.max(0.1, b[1]));
        svg('rect', { x: F.X(x), y: y1, width: F.X(0.16) - F.X(0), height: y0 - y1, fill: i === 2 ? 'var(--accent)' : 'currentColor', 'fill-opacity': i === 2 ? 0.8 : 0.35 }, PL);
        svg('text', { x: F.X(x + 0.08), y: y1 - 4, 'font-size': 9.5, 'text-anchor': 'middle', fill: 'currentColor' }, PL).textContent = b[1] >= 10 ? Math.round(b[1]).toLocaleString('en-US') : sig(b[1], 2);
        b[0].split(', ').forEach(function (part, j) {
          svg('text', { x: F.X(x + 0.08), y: 189 + 10 * j, 'font-size': 8.5, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.8 }, PL).textContent = part;
        });
      });
      P.title.textContent = 'Bar chart, log scale, of maximum effective area over physical area: ' + bars.map(function (b) { return b[0] + ' ' + sig(b[1], 3); }).join('; ') + '.';
      // face-on aperture shaded by the taper, with the equal-area effective disc
      defs.textContent = '';
      var g = svg('radialGradient', { id: 'ea-taper-' + uid }, defs);
      stops = [];
      for (var i = 0; i <= 20; i++) { var r = i / 20; stops.push([svg('stop', { offset: r }, g), Math.pow(1 - r * r, st.n)]); }
      gA.textContent = '';
      svg('circle', { cx: 0, cy: 0, r: 1, fill: 'url(#ea-taper-' + uid + ')', stroke: 'currentColor', 'stroke-width': 0.015 }, gA);
      svg('circle', { cx: 0, cy: 0, r: Math.sqrt(e), fill: 'none', stroke: 'currentColor', 'stroke-width': 0.025, 'stroke-dasharray': '0.06 0.04' }, gA);
      svg('text', { x: 0, y: -1.1, 'font-size': 0.085, 'text-anchor': 'middle', fill: 'currentColor' }, gA).textContent = 'rim: physical area';
      svg('text', { x: 0, y: 1.2, 'font-size': 0.085, 'text-anchor': 'middle', fill: 'currentColor' }, gA).textContent = 'dashed: same area as Aem, ' + (100 * e).toFixed(1) + '%';
      At.textContent = 'Circular aperture seen face-on, shaded by the field taper with n = ' + st.n.toFixed(2) + '; a dashed circle of the same area as the effective area, ' + (100 * e).toFixed(1) + '% of the physical area.';
      anim(clk.t);
    }
    var uid = Math.random().toString(36).slice(2, 8);
    function anim(t) {
      // the aperture field, in phase everywhere and oscillating, one period every 2 s; amplitude follows the taper
      var c = Math.cos(PI * t);
      stops.forEach(function (q) {
        q[0].setAttribute('stop-color', c >= 0 ? 'var(--accent)' : 'var(--ra-warm)');
        q[0].setAttribute('stop-opacity', (0.8 * q[1] * Math.abs(c)).toFixed(3));
      });
    }
    RA.onTheme(draw);
    draw();
  }

  document.querySelectorAll('[data-widget="effective-area"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
