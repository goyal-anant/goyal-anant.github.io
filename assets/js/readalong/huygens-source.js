// huygens-source: step 4 of Balanis's recipe (§3.4, eqs. 3-29, 3-30) on the case that needs both potentials, a short
// electric current along y (through A) and a short magnetic current along -x (through F) at the same point.
// Far fields only (Balanis 3-58a, 3-59b), with the common factor j w mu I l e^{-jkr}/(4 pi r) dropped:
//   E_A = -a (yhat minus its radial part),   E_F = K (rhat x (-xhat)),   K = I_m l / (eta I l).
// With a = K = 1 this is the Huygens source of Balanis §15.4.1 D: |E| goes as 1 + cos(theta) in every plane.
// case=sum: two pattern cuts with each current alone and the sum (fields, or powers for comparison).
// case=sky: the polarization over the front half of the sky, seen from the front.
// Markup from _includes/readalong/huygens-source.html; helpers from readalong.js (window.RA).
// The maths at the top has no DOM and is also run under node by content/balanis/checks/huygens_source.py.
(function () {
  var PI = Math.PI, node = typeof module !== 'undefined';
  function cmul(p, q) { return [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]]; }
  function cabs2(p) { return p[0] * p[0] + p[1] * p[1]; }

  // [E_theta, E_phi] as complex pairs; a is real (0 or 1), K complex [re, im]
  function fields(th, ph, a, K) {
    var c = Math.cos(th), sp = Math.sin(ph), cp = Math.cos(ph);
    var EA = [[-a * c * sp, 0], [-a * cp, 0]];
    var EF = [[-K[0] * sp, -K[1] * sp], [-K[0] * c * cp, -K[1] * c * cp]];
    return { A: EA, F: EF, E: [[EA[0][0] + EF[0][0], EA[0][1] + EF[0][1]], [EA[1][0] + EF[1][0], EA[1][1] + EF[1][1]]] };
  }
  // radiation intensity up to a constant: |E_A + E_F|^2, or with powers=true |E_A|^2 + |E_F|^2
  function U(th, ph, a, K, powers) {
    var f = fields(th, ph, a, K);
    if (powers) return cabs2(f.A[0]) + cabs2(f.A[1]) + cabs2(f.F[0]) + cabs2(f.F[1]);
    return cabs2(f.E[0]) + cabs2(f.E[1]);
  }
  // total power, closed form: the integral over the sphere is (8 pi / 3)(a^2 + |K|^2) either way, because the
  // cross term of |E_A + E_F|^2 integrates to zero
  function total(a, K) { return 8 * PI / 3 * (a * a + cabs2(K)); }
  function peak(a, K, powers) {
    var best = 0, at = [0, 0];
    for (var i = 0; i <= 360; i++) for (var j = 0; j < 72; j++) {
      var th = PI * i / 360, ph = 2 * PI * j / 72, u = U(th, ph, a, K, powers);
      if (u > best) { best = u; at = [th, ph]; }
    }
    return { U: best, th: at[0], ph: at[1] };
  }
  // Ludwig's third definition: co-polar along y on the axis, cross-polar along x
  function ludwig(th, ph, a, K) {
    var f = fields(th, ph, a, K), sp = Math.sin(ph), cp = Math.cos(ph);
    var co = [sp * f.E[0][0] + cp * f.E[1][0], sp * f.E[0][1] + cp * f.E[1][1]];
    var cr = [cp * f.E[0][0] - sp * f.E[1][0], cp * f.E[0][1] - sp * f.E[1][1]];
    return { co: co, cr: cr };
  }
  // peak cross-polar level over the front half of the sky (theta <= 90 deg), against the peak co-polar level there
  function worstCross(a, K) {
    var cr = 0, co = 0;
    for (var i = 0; i <= 90; i++) for (var j = 0; j < 72; j++) {
      var l = ludwig(PI / 2 * i / 90, 2 * PI * j / 72, a, K);
      cr = Math.max(cr, cabs2(l.cr)); co = Math.max(co, cabs2(l.co));
    }
    return co > 0 ? cr / co : Infinity;
  }
  // half-power beamwidth in one cut through +z (phi0 and phi0 + 180), degrees; null if the cut's peak is not on +z
  function hpbw(phi0, a, K, powers) {
    var top = U(0, 0, a, K, powers);
    if (top <= 0) return null;
    for (var i = 1; i <= 1800; i++) if (U(PI * i / 1800, phi0, a, K, powers) > top * (1 + 1e-9)) return null;
    function edge(ph) {
      var lo = 0, hi = PI;
      if (U(hi, ph, a, K, powers) >= top / 2) return null;
      for (var k = 0; k < 60; k++) { var m = (lo + hi) / 2; if (U(m, ph, a, K, powers) >= top / 2) lo = m; else hi = m; }
      return lo * 180 / PI;
    }
    var e1 = edge(phi0), e2 = edge(phi0 + PI);
    return e1 == null || e2 == null ? null : e1 + e2;
  }
  function stats(a, K, powers) {
    var P = total(a, K), pk = peak(a, K, powers), front = U(0, 0, a, K, powers), back = U(PI, 0, a, K, powers);
    return {
      D0: 4 * PI * pk.U / P, peakTh: pk.th,
      fb: back > 0 ? 10 * Math.log10(front / back) : Infinity,
      hpE: hpbw(PI / 2, a, K, powers), hpH: hpbw(0, a, K, powers),
      cross: powers ? null : worstCross(a, K)
    };
  }
  // polarization at one direction, projected on the sky map seen from the front: the map's radial direction is
  // theta-hat, its azimuthal direction phi-hat; returns the 2-D phasor [x, y] (complex each)
  function skyVector(th, ph, a, K) {
    var f = fields(th, ph, a, K), cp = Math.cos(ph), sp = Math.sin(ph);
    return [[cp * f.E[0][0] - sp * f.E[1][0], cp * f.E[0][1] - sp * f.E[1][1]], [sp * f.E[0][0] + cp * f.E[1][0], sp * f.E[0][1] + cp * f.E[1][1]]];
  }

  var api = { fields: fields, U: U, total: total, peak: peak, ludwig: ludwig, worstCross: worstCross, hpbw: hpbw, stats: stats, skyVector: skyVector };
  if (node) { module.exports = api; return; }

  // ---- drawing ---------------------------------------------------------------------------------------------------
  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  function dB(x) { return 10 * Math.log10(x); }
  function fmtDb(x) { return x > 100 ? 'no back lobe at all' : x < -100 ? 'no front lobe: the beam points back' : RA.signed(x, 1) + ' dB'; }

  // shared controls: |K|, its phase, presets; st holds a (0 or 1), mag, phase (deg)
  var PRESETS = [['J only', 1, 0, 0], ['M only', 0, 1, 0], ['Huygens: <i>I<sub>m</sub>l</i> = <i>ηIl</i>', 1, 1, 0], ['10% too strong', 1, 1.1, 0], ['10° late', 1, 1, -10]];
  function controls(root, st, onChange) {
    var box = RA.el('div', { class: 'ra-controls' }, root);
    var mIn = RA.slider(box, { label: '|<i>K</i>| = |<i>I<sub>m</sub>l</i>| ÷ <i>η</i>|<i>Il</i>|', min: 0, max: 2, step: 0.01, value: st.mag,
      fmt: function (v) { return v.toFixed(2); }, onInput: function (v) { st.mag = v; if (!st.a && v === 0) st.a = 1; onChange(); } });   // never both off
    var pIn = RA.slider(box, { label: 'Phase of <i>K</i>', min: -180, max: 180, step: 1, value: st.phase,
      fmt: function (v) { return RA.signed(v, 0) + '°'; }, onInput: function (v) { st.phase = v; onChange(); } });
    var pre = RA.el('div', { class: 'ra-controls' }, root), btns = [];
    PRESETS.forEach(function (p) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, pre);
      b.innerHTML = p[0];
      b.addEventListener('click', function () {
        st.a = p[1]; st.mag = p[2]; st.phase = p[3];
        mIn.value = p[2]; mIn.nextElementSibling.textContent = p[2].toFixed(2);
        pIn.value = p[3]; pIn.nextElementSibling.textContent = RA.signed(p[3], 0) + '°';
        onChange();
      });
      btns.push([p, b]);
    });
    return { pre: pre, paint: function () {
      btns.forEach(function (q) { var p = q[0]; q[1].setAttribute('aria-pressed', String(st.a === p[1] && Math.abs(st.mag - p[2]) < 1e-9 && Math.abs(st.phase - p[3]) < 1e-9)); });
    } };
  }
  function Kof(st) { var t = st.phase * PI / 180; return [st.mag * Math.cos(t), st.mag * Math.sin(t)]; }

  function init(root) {
    var d = root.dataset;
    root.textContent = '';
    (d.case === 'sky' ? skyCase : sumCase)(root, d);
  }

  // ---- sum: two cuts --------------------------------------------------------------------------------------------
  function sumCase(root, d) {
    var st = { a: 1, mag: +(d.mag != null ? d.mag : 1), phase: +(d.phase || 0), powers: false };
    var ctl = controls(root, st, update);
    var paintMode = RA.toggle(ctl.pre, 'How to add', [[false, 'Add fields'], [true, 'Add powers']], function () { return st.powers; },
      function (v) { st.powers = v; update(); });
    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var cuts = [['E-plane (y–z), the plane of J', PI / 2, 'y'], ['H-plane (x–z), the plane of M', 0, 'x']].map(function (c) {
      var box = RA.el('div', { class: 'ra-pattern-cut' }, stage);
      RA.el('p', {}, box, c[0]);
      var S = svg('svg', { viewBox: '-1.3 -1.3 2.6 2.62', role: 'img' }, box), title = svg('title', {}, S);
      RA.polarGrid(S, [{ r: 0.5 }, { r: 1 }], function (a) { return (a <= 180 ? a : 360 - a) + '°'; }, { up: 'z', right: c[2] });
      var tot = svg('path', { fill: 'var(--accent)', 'fill-opacity': 0.2, stroke: 'var(--accent)', 'stroke-width': 0.016 }, S);
      var pa = svg('path', { fill: 'none', stroke: 'currentColor', 'stroke-width': 0.012, 'stroke-dasharray': '0.035 0.025' }, S);
      var pf = svg('path', { fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 0.012, 'stroke-dasharray': '0.035 0.025' }, S);
      return { phi: c[1], S: S, title: title, tot: tot, pa: pa, pf: pf, name: c[0] };
    });
    var key = RA.el('p', { class: 'ra-key' }, root);
    key.innerHTML = 'Filled: the pair. Dashed: <b>E</b><sub>A</sub> of <b>J</b> alone (grey) and <b>E</b><sub>F</sub> of <b>M</b> alone (red). One scale for all, |<b>E</b>|, not dB.';
    var rows = RA.readout(RA.el('div', {}, root), [['d0', 'Directivity <i>D</i><sub>0</sub>'], ['fb', 'Front to back'], ['hp', 'Half-power beamwidth: E-plane, H-plane'],
      ['xp', 'Peak cross-polar level, front half (Ludwig 3), against the peak']]);

    function cutPath(cut, fn, scale) {
      var pts = [];
      for (var i = 0; i <= 360; i++) {
        var al = 2 * PI * i / 360, th = al <= PI ? al : 2 * PI - al, ph = al <= PI ? cut.phi : cut.phi + PI;
        var r = Math.sqrt(fn(th, ph)) / scale;
        pts.push((i ? 'L' : 'M') + (r * Math.sin(al)).toFixed(4) + ' ' + (-r * Math.cos(al)).toFixed(4));
      }
      return pts.join('') + 'Z';
    }
    function update() {
      var K = Kof(st), a = st.a, s = stats(a, K, st.powers);
      // one scale: the largest |E| of the pair or of either alone
      var m = Math.max(peak(a, K, st.powers).U, peak(a, [0, 0], false).U, peak(0, K, false).U);
      var scale = Math.sqrt(m) || 1;
      cuts.forEach(function (c) {
        c.tot.setAttribute('d', cutPath(c, function (th, ph) { return U(th, ph, a, K, st.powers); }, scale));
        c.pa.setAttribute('d', a ? cutPath(c, function (th, ph) { return U(th, ph, a, [0, 0], false); }, scale) : '');
        c.pf.setAttribute('d', st.mag ? cutPath(c, function (th, ph) { return U(th, ph, 0, K, false); }, scale) : '');
        c.title.textContent = c.name + ': polar plot of the field of the pair, ' + (st.powers ? 'with the powers added' : 'with the fields added') + ', and of each current alone.';
      });
      rows.d0.td.textContent = sig(s.D0, 4) + ' (' + dB(s.D0).toFixed(2) + ' dBi)' + (Math.abs(s.D0 - 1.5) < 1e-6 ? ', as for one dipole' : '');
      rows.fb.td.textContent = fmtDb(s.fb);
      rows.hp.td.textContent = (s.hpE == null ? 'no single beam on +z' : sig(s.hpE, 4) + '°') + ', ' + (s.hpH == null ? 'no single beam on +z' : sig(s.hpH, 4) + '°');
      rows.xp.td.textContent = s.cross == null ? '— (powers have no polarization)' : s.cross < 1e-25 ? 'none: pure everywhere' : RA.signed(dB(s.cross), 1) + ' dB';
      ctl.paint(); paintMode();
    }
    update();
  }

  // ---- sky: polarization over the front half ---------------------------------------------------------------------
  function skyCase(root, d) {
    var st = { a: 1, mag: +(d.mag != null ? d.mag : 1), phase: +(d.phase || 0) };
    var ctl = controls(root, st, update);
    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var box = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, box, 'The front half of the sky, seen from the front');
    var S = svg('svg', { viewBox: '-1.25 -1.25 2.5 2.5', role: 'img' }, box), title = svg('title', {}, S);
    [30, 60, 90].forEach(function (t) {
      svg('circle', { cx: 0, cy: 0, r: t / 90, fill: 'none', stroke: 'currentColor', 'stroke-opacity': t === 90 ? 0.4 : 0.15, 'stroke-width': 0.006 }, S);
    });
    svg('text', { x: 1.15, y: 0.025, 'font-size': 0.08, 'font-style': 'italic', 'text-anchor': 'middle', fill: 'currentColor' }, S).textContent = 'x';
    svg('text', { x: 0, y: -1.13, 'font-size': 0.08, 'font-style': 'italic', 'text-anchor': 'middle', fill: 'currentColor' }, S).textContent = 'y';
    var layer = svg('g', {}, S);
    // ring labels on top of the marks, with a halo in the page colour so they stay readable
    [30, 60, 90].forEach(function (t) {
      svg('text', { x: 0.02, y: -t / 90 - 0.02, 'font-size': 0.065, fill: 'currentColor', 'fill-opacity': 0.75, stroke: 'var(--bg)', 'stroke-width': 0.025,
        'paint-order': 'stroke' }, S).textContent = 'θ = ' + t + '°';
    });
    var side = RA.el('div', {}, stage);
    var rows = RA.readout(side, [['xp', 'Peak cross-polar level, front half, against the peak'], ['edge', 'At θ = 60°, φ = 45°: cross ÷ co'], ['d0', 'Directivity <i>D</i><sub>0</sub>']]);
    var note = RA.el('p', { class: 'ra-key' }, side);
    note.innerHTML = 'Each mark is the path the tip of <b>E</b> traces in one cycle at that direction: a line for linear polarization, an ellipse otherwise. Its size is |<b>E</b>| there, per the largest.';
    function update() {
      var K = Kof(st), a = st.a, s = stats(a, K, false), pts = [], top = 0;
      for (var r = 1; r <= 6; r++) {
        var n = Math.max(1, Math.round(6 * r));
        for (var j = 0; j < n; j++) {
          var th = (PI / 2) * r / 6.3, ph = 2 * PI * j / n, v = skyVector(th, ph, a, K);
          pts.push({ th: th, ph: ph, v: v }); top = Math.max(top, cabs2(v[0]) + cabs2(v[1]));
        }
      }
      pts.push({ th: 0, ph: 0, v: skyVector(1e-6, 0, a, K) });
      top = Math.max(top, cabs2(pts[pts.length - 1].v[0]) + cabs2(pts[pts.length - 1].v[1]));
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      pts.forEach(function (p) {
        var cx = (p.th / (PI / 2)) * Math.cos(p.ph), cy = -(p.th / (PI / 2)) * Math.sin(p.ph);   // y up on the page
        var sc = 0.085 / Math.sqrt(top || 1), path = [];
        for (var k = 0; k <= 24; k++) {
          var t = 2 * PI * k / 24, c = Math.cos(t), s2 = Math.sin(t);
          var x = p.v[0][0] * c - p.v[0][1] * s2, y = p.v[1][0] * c - p.v[1][1] * s2;
          path.push((k ? 'L' : 'M') + (cx + sc * x).toFixed(4) + ' ' + (cy - sc * y).toFixed(4));
        }
        svg('path', { d: path.join(''), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 0.014, 'stroke-linejoin': 'round' }, layer);
      });
      var l = ludwig(PI / 3, PI / 4, a, K), co = cabs2(l.co), cr = cabs2(l.cr);
      rows.xp.td.textContent = s.cross < 1e-25 ? 'none: every mark is parallel to y' : RA.signed(dB(s.cross), 1) + ' dB';
      rows.edge.td.textContent = co < 1e-30 ? (cr < 1e-30 ? 'no field' : 'all cross') : cr / co < 1e-25 ? '0' : sig(Math.sqrt(cr / co), 3) + ' (' + RA.signed(dB(cr / co), 1) + ' dB)';
      rows.d0.td.textContent = sig(s.D0, 4) + ' (' + dB(s.D0).toFixed(2) + ' dBi)';
      title.textContent = 'Polarization of the far field over the front half of the sky, seen from the front; worst cross-polar level ' + rows.xp.td.textContent + '.';
      ctl.paint();
    }
    update();
  }

  document.querySelectorAll('[data-widget="huygens-source"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
