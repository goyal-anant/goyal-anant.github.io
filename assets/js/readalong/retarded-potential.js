// retarded-potential: where the radiation integral of Balanis §3.5 (eqs. 3-35 to 3-49) comes from.
// case=turnon: a point current switched on at t = 0, I(t) = sin(w t) for t > 0. In 3-D the potential at r is the
// current r/c earlier divided by 4 pi r (the outward solution e^{-jkr}/r, eq. 3-35); the inward one e^{+jkr}/r
// (3-36) is the current r/c later; a line source (2-D) has a tail, so it only creeps up to its steady state
// -j/4 H0^(2)(k rho). case=sum: a wire of length L with a sinusoidal current, summed point by point with e^{-jkR}/R
// (3-49), against the static integral times one e^{-jkr} from the centre.
// Units: lengths in wavelengths, time in periods, c = 1, so k = w = 2 pi. Markup from
// _includes/readalong/retarded-potential.html; helpers from readalong.js (window.RA).
// The maths at the top has no DOM and is also run under node by content/balanis/checks/retarded_potential.py.
(function () {
  var PI = Math.PI, TAU = 2 * PI, node = typeof module !== 'undefined';
  var LAMBDA_CM = 29979245800 / 2.45e9;   // free-space wavelength at 2.45 GHz (Wi-Fi), in cm
  var T_NS = 1e9 / 2.45e9;                // one period at 2.45 GHz, in ns

  // ---- turn-on ---------------------------------------------------------------------------------------------------
  // r times the potential, scaled so the steady wave has amplitude 1: the source current r/c earlier (outward) or
  // r/c later (inward), and nothing before the wave gets there.
  function u3(r, t, inward) {
    var tt = inward ? t + r : t - r;
    return tt > 0 ? Math.sin(TAU * tt) : 0;
  }
  function steady3(r, t, inward) { return Math.sin(TAU * (inward ? t + r : t - r)); }

  // Bessel J0, Y0 (Abramowitz and Stegun 9.4.1 to 9.4.3 and 9.4.6, error below 1e-7); H0^(2) = J0 - j Y0
  function bessel0(x) {
    if (x <= 3) {
      var y = (x / 3) * (x / 3);
      var j0 = 1 + y * (-2.2499997 + y * (1.2656208 + y * (-0.3163866 + y * (0.0444479 + y * (-0.0039444 + y * 0.0002100)))));
      var y0 = (2 / PI) * Math.log(x / 2) * j0 + 0.36746691 + y * (0.60559366 + y * (-0.74350384 + y * (0.25300117 +
        y * (-0.04261214 + y * (0.00427916 - y * 0.00024846)))));
      return [j0, y0];
    }
    var z = 3 / x;
    var f0 = 0.79788456 + z * (-0.00000077 + z * (-0.00552740 + z * (-0.00009512 + z * (0.00137237 + z * (-0.00072805 + z * 0.00014476)))));
    var t0 = x - 0.78539816 + z * (-0.04166397 + z * (-0.00003954 + z * (0.00262573 + z * (-0.00054125 + z * (-0.00029333 + z * 0.00013558)))));
    var s = f0 / Math.sqrt(x);
    return [s * Math.cos(t0), s * Math.sin(t0)];
  }
  // steady state of the line source, -j/4 H0^(2)(k rho) e^{j w t}, imaginary part (the source is sin w t),
  // divided by its amplitude |H0^(2)|/4
  function steady2(rho, t) {
    var b = bessel0(TAU * rho), re = -b[1] / 4, im = -b[0] / 4, amp = Math.hypot(b[0], b[1]) / 4;   // -j/4 (J0 - j Y0)
    return (re * Math.sin(TAU * t) + im * Math.cos(TAU * t)) / amp;
  }
  // line source switched on at t = 0: the 2-D Green's function 1/(2 pi sqrt(tau^2 - rho^2)) for tau > rho, convolved
  // with sin(w t); with tau = rho cosh s the integrand is sin(w (t - rho cosh s)) / (2 pi). Simpson's rule.
  function u2(rho, t) {
    if (t <= rho) return 0;
    var S = Math.log(t / rho + Math.sqrt((t / rho) * (t / rho) - 1));   // acosh
    var n = 2 * Math.ceil(16 * (t - rho) + 12 * S + 16), h = S / n, sum = 0;
    for (var i = 0; i <= n; i++) {
      var v = Math.sin(TAU * (t - rho * Math.cosh(i * h)));
      sum += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * v;
    }
    var b = bessel0(TAU * rho);
    return sum * h / 3 / (2 * PI) / (Math.hypot(b[0], b[1]) / 4);
  }
  // field at r and t for a source kind: 'out', 'in', 'line'; and its steady state
  function field(kind, r, t) { return kind === 'line' ? u2(r, t) : u3(r, t, kind === 'in'); }
  function steady(kind, r, t) { return kind === 'line' ? steady2(r, t) : steady3(r, t, kind === 'in'); }
  // largest |field - steady| over the period that ends at t (only once the wave is there), 48 samples
  function offSteady(kind, r, t) {
    var arrive = kind === 'in' ? -r : r, worst = 0;
    if (t <= arrive) return null;
    for (var i = 0; i < 48; i++) {
      var tt = t - i / 48;
      if (tt <= arrive) break;
      worst = Math.max(worst, Math.abs(field(kind, r, tt) - steady(kind, r, tt)));
    }
    return worst;
  }

  // ---- wire ------------------------------------------------------------------------------------------------------
  // sinusoidal current on a centre-fed wire of length L (Balanis eq. 4-56), peak 1
  function current(z, L) { return Math.sin(TAU * (L / 2 - Math.abs(z))); }
  // far-field |E_theta| up to a constant: sin(theta) |integral of I(z) e^{jkz cos(theta)} dz|, by the midpoint rule
  // on n pieces; with phase=false, sin(theta) times the integral of I alone (the static integral times one e^{-jkr})
  function pattern(L, th, phase, n) {
    n = n || 400;
    var c = Math.cos(th), re = 0, im = 0, h = L / n;
    for (var i = 0; i < n; i++) {
      var z = -L / 2 + (i + 0.5) * h, I = current(z, L) * h, p = phase === false ? 0 : TAU * z * c;
      re += I * Math.cos(p); im += I * Math.sin(p);
    }
    return Math.sin(th) * Math.hypot(re, im);
  }
  // the pieces at a point at distance r (in wavelengths) and angle th: I dz e^{-jk(R - r)} r/R, each relative to the
  // centre's distance r, so the arrows show only what differs from piece to piece. The static-times-one-phase
  // version has every piece at phase 0: I dz r/R.
  function pieces(L, th, n, r) {
    var out = [], h = L / n;
    for (var i = 0; i < n; i++) {
      var z = -L / 2 + (i + 0.5) * h, R = Math.sqrt(r * r + z * z - 2 * r * z * Math.cos(th)), a = current(z, L) * h * r / R;
      out.push({ z: z, right: [a * Math.cos(TAU * (R - r)), -a * Math.sin(TAU * (R - r))], wrong: [a, 0] });
    }
    return out;
  }
  // half-power beamwidth (degrees) of a pattern symmetric about 90 degrees with its peak there, and directivity
  function hpbw(fn) {
    var top = fn(PI / 2), lo = 1e-6, hi = PI / 2;
    for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (fn(m) < top / Math.SQRT2) lo = m; else hi = m; }
    return 2 * (90 - hi * 180 / PI);
  }
  function directivity(fn) {
    var n = 720, h = PI / n, sum = 0, top = 0;
    for (var i = 0; i <= n; i++) {
      var th = i * h, f = fn(th), v = f * f * Math.sin(th);
      top = Math.max(top, f * f);
      sum += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * v;
    }
    return 2 * top / (sum * h / 3);
  }
  function wireStats(L) {
    var right = function (th) { return pattern(L, th, true); }, wrong = function (th) { return pattern(L, th, false); };
    return { hpbwRight: hpbw(right), hpbwWrong: hpbw(wrong), d0Right: directivity(right), d0Wrong: directivity(wrong) };
  }

  var api = { u3: u3, steady3: steady3, bessel0: bessel0, steady2: steady2, u2: u2, field: field, steady: steady, offSteady: offSteady,
    current: current, pattern: pattern, pieces: pieces, hpbw: hpbw, directivity: directivity, wireStats: wireStats, LAMBDA_CM: LAMBDA_CM, T_NS: T_NS };
  if (node) { module.exports = api; return; }

  // ---- drawing ---------------------------------------------------------------------------------------------------
  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fmtCm(cm) { return cm < 100 ? sig(cm, 3) + ' cm' : sig(cm / 100, 3) + ' m'; }

  function init(root) {
    var d = root.dataset;
    root.textContent = '';
    (d.case === 'sum' ? sumCase : turnonCase)(root, d);
  }

  // ---- turnon ----------------------------------------------------------------------------------------------------
  var T0 = -5, T1 = 12, RMAX = 10;
  function turnonCase(root, d) {
    var st = { kind: d.kind || 'out', t: +(d.t || 4), r: +(d.r || 3), run: false, last: null, visible: true };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var tIn = RA.slider(controls, { label: 'Time <i>t</i>', min: T0, max: T1, step: 0.01, value: st.t,
      fmt: function (v) { return RA.signed(v, 2) + ' periods'; }, onInput: function (v) { st.t = v; frame(); } });
    var rIn = RA.slider(controls, { label: 'Probe at <i>r</i>', min: 0.2, max: RMAX, step: 0.05, value: st.r,
      fmt: function (v) { return v.toFixed(2) + ' λ'; }, onInput: function (v) { st.r = v; update(); } });
    var row = RA.el('div', { class: 'ra-controls' }, root);
    var paintKind = RA.toggle(row, 'Source', [['out', ''], ['in', ''], ['line', '']], function () { return st.kind; }, function (k) { st.kind = k; update(); });
    var KINDS = ['Point, outward <i>e</i><sup>−<i>jkr</i></sup>', 'Point, inward <i>e</i><sup>+<i>jkr</i></sup>', 'Line source (2-D)'];
    row.querySelectorAll('[role=radio]').forEach(function (b, i) { b.innerHTML = KINDS[i]; });   // RA.toggle writes plain text
    var play = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, row, 'Play');

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var A = RA.plotBox(stage, 'Now, against distance');
    var B = RA.plotBox(stage, 'At the probe, against time');
    var FA = RA.frame(A.S, [0, RMAX], [-1.5, 1.5], [0, 2, 4, 6, 8, 10], [-1, 0, 1], 'distance r (wavelengths)', '',
      String, function (y) { return y === 0 ? '0' : RA.signed(y, 0); });
    var FB = RA.frame(B.S, [T0, T1], [-1.5, 1.5], [-5, 0, 5, 10], [-1, 0, 1], 'time t (periods)', '',
      function (x) { return x > 0 ? '+' + x : x < 0 ? '−' + (-x) : '0'; }, function (y) { return y === 0 ? '0' : RA.signed(y, 0); });
    var aSteady = svg('path', { fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.4, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, A.S);
    var aCurve = svg('path', { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }, A.S);
    var aProbe = svg('line', { y1: 24, y2: 176, stroke: 'var(--ra-warm)', 'stroke-width': 1.2, 'stroke-dasharray': '2 2' }, A.S);
    var aFront = svg('line', { y1: 24, y2: 176, stroke: 'currentColor', 'stroke-opacity': 0.5, 'stroke-width': 1 }, A.S);
    var bSource = svg('path', { fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.4, 'stroke-width': 1, 'stroke-dasharray': '3 3' }, B.S);
    var bCurve = svg('path', { fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 2 }, B.S);
    var bNow = svg('line', { y1: 24, y2: 176, stroke: 'currentColor', 'stroke-opacity': 0.6, 'stroke-width': 1 }, B.S);
    svg('line', { x1: FB.X(0), x2: FB.X(0), y1: 24, y2: 176, stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-width': 1 }, B.S);
    svg('text', { x: FB.X(0) - 3, y: 170, 'font-size': 9, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.7 }, B.S).textContent = 'switched on';
    RA.legend(A.S, 160, 9, [[{ stroke: 'var(--accent)', 'stroke-width': 2 }, 'field'], [{ stroke: 'currentColor', 'stroke-opacity': 0.4, 'stroke-dasharray': '3 3' }, 'steady state']]);
    RA.legend(B.S, 160, 9, [[{ stroke: 'var(--ra-warm)', 'stroke-width': 2 }, 'field at the probe'], [{ stroke: 'currentColor', 'stroke-opacity': 0.4, 'stroke-dasharray': '3 3' }, 'source current']]);
    var rows = RA.readout(RA.el('div', {}, root), [['r', 'Probe at 2.45 GHz'], ['arr', 'The wave reaches the probe at'], ['off', 'Off its steady state, over the last period']]);

    var src = [];
    for (var i = 0; i <= 400; i++) { var tt = T0 + (T1 - T0) * i / 400; src.push([tt, tt > 0 ? Math.sin(TAU * tt) : 0]); }
    bSource.setAttribute('d', RA.path(src, FB));

    function update() {
      paintKind();
      var tr = [];
      for (var i = 0; i <= 500; i++) { var tt = T0 + (T1 - T0) * i / 500; tr.push([tt, field(st.kind, st.r, tt)]); }
      bCurve.setAttribute('d', RA.path(tr, FB));
      aProbe.setAttribute('x1', FA.X(st.r)); aProbe.setAttribute('x2', FA.X(st.r));
      rows.r.td.textContent = fmtCm(st.r * LAMBDA_CM) + ' (' + sig(st.r, 3) + ' λ)';
      var arrive = st.kind === 'in' ? -st.r : st.r;
      rows.arr.td.textContent = 't = ' + RA.signed(arrive, 2) + ' periods (' + RA.signed(arrive * T_NS, 2) + ' ns)' +
        (arrive < 0 ? ': before the source is switched on' : ', ' + sig(st.r, 3) + ' cycles after the current');
      B.title.textContent = 'The field at ' + sig(st.r, 3) + ' wavelengths against time, with the source current dashed.';
      frame();
    }
    function frame() {
      var pts = [], ss = [], R0 = st.kind === 'line' ? 0.04 : 0;
      for (var i = 0; i <= 400; i++) {
        var r = R0 + (RMAX - R0) * i / 400;
        if (r === 0) r = 1e-6;
        pts.push([r, field(st.kind, r, st.t)]); ss.push([r, steady(st.kind, r, st.t)]);
      }
      aCurve.setAttribute('d', RA.path(pts, FA)); aSteady.setAttribute('d', RA.path(ss, FA));
      var front = st.kind === 'in' ? -st.t : st.t;   // where the wave has got to
      aFront.style.display = front > 0 && front < RMAX ? '' : 'none';
      aFront.setAttribute('x1', FA.X(Math.max(0, front))); aFront.setAttribute('x2', FA.X(Math.max(0, front)));
      bNow.setAttribute('x1', FB.X(st.t)); bNow.setAttribute('x2', FB.X(st.t));
      var off = offSteady(st.kind, st.r, st.t);
      rows.off.td.textContent = off == null ? 'nothing there yet' : off < 1e-9 ? '0: steady from the moment it arrives' :
        sig(100 * off, 2) + '% of the steady amplitude';
      A.title.textContent = 'The field times distance at t = ' + st.t.toFixed(2) + ' periods, against distance out to 10 wavelengths, with the steady state dashed.';
    }
    // Play: time runs at one period every 1.5 s and wraps from the end back to the start
    function tick(ts) {
      if (!st.run) return;
      if (st.visible && !document.hidden) {
        if (st.last != null) {
          st.t += Math.min(0.1, (ts - st.last) / 1000) / 1.5;
          if (st.t > T1) st.t = T0;
          tIn.value = st.t; tIn.nextElementSibling.textContent = RA.signed(st.t, 2) + ' periods';
          frame();
        }
        st.last = ts;
      } else st.last = null;
      requestAnimationFrame(tick);
    }
    play.addEventListener('click', function () {
      st.run = !st.run; st.last = null; play.textContent = st.run ? 'Pause' : 'Play'; play.setAttribute('aria-pressed', String(st.run));
      if (st.run) requestAnimationFrame(tick);
    });
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { st.visible = es[0].isIntersecting; }).observe(root);
    update();
  }

  // ---- sum -------------------------------------------------------------------------------------------------------
  var NP = 16, RPROBE = 50;
  function sumCase(root, d) {
    var st = { L: +(d.l || 0.5), th: +(d.th || 30) * PI / 180 };
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    var lIn = RA.slider(controls, { label: 'Wire length <i>L</i>', min: 0.05, max: 1.25, step: 0.01, value: st.L,
      fmt: function (v) { return v.toFixed(2) + ' λ'; }, onInput: function (v) { st.L = v; update(); } });
    RA.slider(controls, { label: 'Direction <i>θ</i>', min: 0, max: 180, step: 1, value: Math.round(st.th * 180 / PI),
      fmt: function (v) { return v + '°'; }, onInput: function (v) { st.th = v * PI / 180; draw(); } });
    var pre = RA.el('div', { class: 'ra-controls' }, root), pbtn = [];
    [['Short, λ/20', 0.05], ['Half-wave', 0.5], ['Full-wave', 1], ['1.25 λ', 1.25]].forEach(function (p) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, pre, p[0]);
      b.addEventListener('click', function () { st.L = p[1]; lIn.value = p[1]; lIn.nextElementSibling.textContent = p[1].toFixed(2) + ' λ'; update(); });
      pbtn.push([p[1], b]);
    });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var pBox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, pBox, 'The pieces added head to tail, at θ');
    var P = svg('svg', { viewBox: '0 0 320 210', role: 'img' }, pBox), pTitle = svg('title', {}, P);
    var pLayer = svg('g', {}, P);
    var cBox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, cBox, 'Pattern |E| far away, each per its own peak');
    var C = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', role: 'img' }, cBox), cTitle = svg('title', {}, C);
    RA.polarGrid(C, [{ r: 0.5 }, { r: 1 }], function (a) { return (a <= 180 ? a : 360 - a) + '°'; }, { up: 'z', right: 'x' });
    var cWrong = svg('path', { fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 0.014, 'stroke-dasharray': '0.04 0.03' }, C);
    var cRight = svg('path', { fill: 'var(--accent)', 'fill-opacity': 0.2, stroke: 'var(--accent)', 'stroke-width': 0.016 }, C);
    var cWire = svg('line', { x1: 0, x2: 0, stroke: 'currentColor', 'stroke-width': 0.03 }, C);
    var cDir = svg('line', { x1: 0, y1: 0, stroke: 'currentColor', 'stroke-opacity': 0.7, 'stroke-width': 0.01, 'stroke-dasharray': '0.03 0.02' }, C);
    var rows = RA.readout(RA.el('div', {}, root), [['L', 'Wire at 2.45 GHz'], ['ratio', 'At <i>θ</i>: true sum ÷ static sum'],
      ['hp', 'Half-power beamwidth: true, static'], ['d0', 'Directivity <i>D</i><sub>0</sub>: true, static']]);
    var key = RA.el('p', { class: 'ra-key' }, root);
    key.innerHTML = 'Blue: each piece with its own <i>e</i><sup>−<i>jkR</i></sup> (eq. 3-49). Red, dashed: the static integral times one <i>e</i><sup>−<i>jkr</i></sup> from the centre.';

    var right, wrong;
    function update() {
      right = []; wrong = [];
      var top = 0, topW = 0, n = 360;
      for (var i = 0; i <= n; i++) {
        var th = PI * i / n, a = pattern(st.L, th, true, 200), b = pattern(st.L, th, false, 200);
        right.push([th, a]); wrong.push([th, b]); top = Math.max(top, a); topW = Math.max(topW, b);
      }
      function polar(list, m) {
        var half = list.map(function (q) { return [Math.sin(q[0]) * q[1] / m, -Math.cos(q[0]) * q[1] / m]; });
        var other = half.slice().reverse().map(function (p) { return [-p[0], p[1]]; });
        return half.concat(other).map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(4) + ' ' + p[1].toFixed(4); }).join('') + 'Z';
      }
      cRight.setAttribute('d', polar(right, top)); cWrong.setAttribute('d', polar(wrong, topW));
      var hw = Math.min(0.9, 0.25 + 0.5 * st.L);
      cWire.setAttribute('y1', -hw / 2); cWire.setAttribute('y2', hw / 2);
      var s = wireStats(st.L);
      rows.L.td.textContent = fmtCm(st.L * LAMBDA_CM) + ' (' + st.L.toFixed(2) + ' λ)';
      rows.hp.td.textContent = sig(s.hpbwRight, 3) + '°, ' + sig(s.hpbwWrong, 3) + '°';
      rows.d0.td.textContent = sig(s.d0Right, 4) + ' (' + sig(10 * Math.log10(s.d0Right), 3) + ' dBi), ' + sig(s.d0Wrong, 4) + ' (' + sig(10 * Math.log10(s.d0Wrong), 3) + ' dBi)';
      cTitle.textContent = 'Polar pattern of a ' + st.L.toFixed(2) + '-wavelength wire: true half-power beamwidth ' + sig(s.hpbwRight, 3) +
        ' degrees, against ' + sig(s.hpbwWrong, 3) + ' for the static integral times one phase.';
      pbtn.forEach(function (q) { q[1].setAttribute('aria-pressed', String(Math.abs(q[0] - st.L) < 1e-9)); });
      draw();
    }
    function draw() {
      var th = st.th, dx = Math.sin(th), dy = -Math.cos(th);
      cDir.setAttribute('x2', 1.05 * dx); cDir.setAttribute('y2', 1.05 * dy);
      // phasors: blue chain head to tail from the left, red chain (all at phase 0) under it, one scale for both
      var ps = pieces(st.L, th, NP, RPROBE);
      while (pLayer.firstChild) pLayer.removeChild(pLayer.firstChild);
      // chain points in data units, then one scale that fits both chains in the box
      var chain = [[0, 0]], sr = [0, 0], wx = [0];
      ps.forEach(function (p) { sr[0] += p.right[0]; sr[1] += p.right[1]; chain.push([sr[0], sr[1]]); wx.push(wx[wx.length - 1] + p.wrong[0]); });
      var xs = chain.map(function (q) { return q[0]; }).concat(wx), ys = chain.map(function (q) { return q[1]; });
      var xlo = Math.min.apply(null, xs), xhi = Math.max.apply(null, xs), ylo = Math.min.apply(null, ys), yhi = Math.max.apply(null, ys);
      var sc = Math.min(270 / Math.max(1e-12, xhi - xlo), 120 / Math.max(1e-12, yhi - ylo));
      var x0 = 25 - xlo * sc, yR = 25 + yhi * sc, yW = 176;
      svg('line', { x1: x0, x2: x0, y1: 18, y2: 182, stroke: 'currentColor', 'stroke-opacity': 0.25 }, pLayer);
      svg('text', { x: 25, y: yW + 18, 'font-size': 9.5, fill: 'currentColor', 'fill-opacity': 0.75 }, pLayer).textContent = 'static integral, one phase for all: every piece in line';
      for (var i = 1; i < chain.length; i++)
        arrow(pLayer, x0 + chain[i - 1][0] * sc, yR - chain[i - 1][1] * sc, x0 + chain[i][0] * sc, yR - chain[i][1] * sc, 'var(--accent)', 1.6);
      arrow(pLayer, x0, yR, x0 + sr[0] * sc, yR - sr[1] * sc, 'currentColor', 1);   // the resultant
      for (i = 1; i < wx.length; i++) arrow(pLayer, x0 + wx[i - 1] * sc, yW, x0 + wx[i] * sc, yW, 'var(--ra-warm)', 1.6);
      var sumW = wx[wx.length - 1];
      var ratio = Math.hypot(sr[0], sr[1]) / Math.abs(sumW);
      rows.ratio.td.textContent = sig(ratio, 3) + (Math.abs(ratio - 1) < 0.005 ? ': the phases don’t matter here' : ': the pieces ' + (ratio < 1 ? 'partly cancel' : 'add up'));
      pTitle.textContent = 'At ' + Math.round(th * 180 / PI) + ' degrees from the wire, the ' + NP + ' pieces of the wire add head to tail to ' + sig(ratio, 3) + ' times the static sum.';
    }
    function arrow(g, x1, y1, x2, y2, col, w) {
      var L = Math.hypot(x2 - x1, y2 - y1);
      svg('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
      if (L < 3) return;
      var ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = Math.min(5, 0.45 * L);
      svg('path', { d: 'M' + (x2 - ux * h - uy * h * 0.45) + ' ' + (y2 - uy * h + ux * h * 0.45) + 'L' + x2 + ' ' + y2 + 'L' + (x2 - ux * h + uy * h * 0.45) + ' ' + (y2 - uy * h - ux * h * 0.45),
        fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linejoin': 'round' }, g);
    }
    update();
  }

  document.querySelectorAll('[data-widget="retarded-potential"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
