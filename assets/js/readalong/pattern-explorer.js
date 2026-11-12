// pattern-explorer: a radiation pattern in 3D next to its two principal cuts, as field, power or dB, with the
// half-power beamwidth (HPBW), first-null beamwidth (FNBW) and side-lobe level (SLL) of each cut.
// Markup comes from _includes/readalong/pattern-explorer.html; helpers from readalong.js (window.RA).
// The maths at the top has no DOM and is also run under node by content/balanis/checks/pattern_explorer.py.
(function () {
  var PI = Math.PI, D2R = PI / 180;
  var STEP = 0.05;   // degrees between samples along a cut
  var FLOOR = 40;    // dB range shown on the dB scale

  // Each antenna gives |E| (any scale; normalised later) at (theta, phi) in radians, its parameters, and its two
  // principal cuts. A cut is the great circle cos(a) u + sin(a) v; a runs clockwise from u (drawn up) towards v.
  var ANTENNAS = {
    dipole: {
      name: 'Dipole along z',
      params: { L: { label: 'Length <i>L</i>', min: 0.05, max: 2, step: 0.05, value: 0.5, unit: 'λ' } },
      field: function (p, th) {
        var s = Math.sin(th), h = PI * p.L;   // h = kL/2
        return s < 1e-9 ? 0 : Math.abs((Math.cos(h * Math.cos(th)) - Math.cos(h)) / s);
      },
      cuts: [
        { name: 'E-plane', plane: 'x-z', u: [0, 0, 1], v: [1, 0, 0], angle: 'θ' },
        { name: 'H-plane', plane: 'x-y', u: [1, 0, 0], v: [0, 1, 0], angle: 'φ' }
      ]
    },
    array: {
      name: 'Array of isotropic sources along z',
      params: {
        N: { label: 'Elements <i>N</i>', min: 2, max: 20, step: 1, value: 10, unit: '' },
        d: { label: 'Spacing <i>d</i>', min: 0.05, max: 1.5, step: 0.05, value: 0.25, unit: 'λ' },
        beta: { label: 'Phase step <i>β</i>', min: -1, max: 1, step: 0.05, value: 0, unit: 'π' }
      },
      field: function (p, th) {
        var psi = 2 * PI * p.d * Math.cos(th) + PI * p.beta, den = p.N * Math.sin(psi / 2);
        return Math.abs(den) < 1e-12 ? 1 : Math.abs(Math.sin(p.N * psi / 2) / den);
      },
      cuts: [
        { name: 'θ cut', plane: 'x-z', u: [0, 0, 1], v: [1, 0, 0], angle: 'θ' },
        { name: 'φ cut', plane: 'x-y', u: [1, 0, 0], v: [0, 1, 0], angle: 'φ' }
      ]
    },
    aperture: {
      // Rectangular aperture a (along x) by b (along y) in a ground plane, E along y with the TE10 cos(pi x/a) taper.
      name: 'Waveguide aperture in a ground plane',
      params: {
        a: { label: 'Width <i>a</i>', min: 0.3, max: 6, step: 0.02, value: 0.76, unit: 'λ' },
        b: { label: 'Height <i>b</i>', min: 0.3, max: 6, step: 0.02, value: 0.34, unit: 'λ' }
      },
      field: function (p, th, ph) {
        if (th > PI / 2 + 1e-9) return NaN;   // no field below the ground plane; NaN so beamwidths stop at the plane
        var st = Math.sin(th), X = PI * p.a * st * Math.cos(ph), Y = PI * p.b * st * Math.sin(ph);
        var t = 2 * X / PI, fx = Math.abs(1 - t * t) < 1e-9 ? PI / 4 : Math.cos(X) / (1 - t * t);
        var fy = Math.abs(Y) < 1e-12 ? 1 : Math.sin(Y) / Y;
        var c = Math.cos(th), sp = Math.sin(ph), cp = Math.cos(ph);
        return Math.abs(fx * fy) * Math.sqrt(sp * sp + c * c * cp * cp);
      },
      cuts: [
        { name: 'E-plane', plane: 'y-z', u: [0, 0, 1], v: [0, 1, 0], angle: 'θ' },
        { name: 'H-plane', plane: 'x-z', u: [0, 0, 1], v: [1, 0, 0], angle: 'θ' }
      ]
    }
  };

  function direction(cut, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [c * cut.u[0] + s * cut.v[0], c * cut.u[1] + s * cut.v[1], c * cut.u[2] + s * cut.v[2]];
  }
  function angles(d) { return [Math.acos(Math.max(-1, Math.min(1, d[2]))), Math.atan2(d[1], d[0])]; }

  // |E| along a cut, one sample every STEP degrees from a = 0.
  function sampleCut(ant, p, cut) {
    var n = Math.round(360 / STEP), f = new Float64Array(n);
    for (var i = 0; i < n; i++) { var tp = angles(direction(cut, i * STEP * D2R)); f[i] = ant.field(p, tp[0], tp[1]); }
    return f;
  }

  // HPBW, FNBW (degrees) and SLL (dB) of the main lobe on one cut. Any one of them is null when the cut has none,
  // e.g. no half-power points in the H-plane of a dipole, which is a circle.
  function metrics(f) {
    var n = f.length, i0 = 0, i;
    while (i0 < n && isNaN(f[i0])) i0++;
    for (i = i0 + 1; i < n; i++) if (f[i] > f[i0]) i0 = i;
    var m = f[i0];
    if (!(m > 0)) return { peak: null, hpbw: null, fnbw: null, sll: null };
    var p = new Float64Array(n);
    for (i = 0; i < n; i++) p[i] = (f[i] / m) * (f[i] / m);
    function at(k) { return p[((k % n) + n) % n]; }
    function walk(dir) {
      var half = null, nul = null;
      for (var k = 1; k < n / 2 && (half === null || nul === null); k++) {
        var a = at(i0 + dir * (k - 1)), b = at(i0 + dir * k);
        if (isNaN(b)) break;   // reached the ground plane
        if (half === null && b < 0.5) half = (k - 1 + (a - 0.5) / (a - b)) * STEP;
        // a null is where the pattern turns back up, is exactly zero, or vanishes at a ground plane
        var zero = b === 0 || (b < 1e-12 && isNaN(at(i0 + dir * (k + 1))));
        if (nul === null && (zero || b > a * (1 + 1e-9) + 1e-15)) nul = zero ? k : k - 1;
      }
      return { half: half, nul: nul };
    }
    var R = walk(1), L = walk(-1);
    var out = {
      peak: i0 * STEP,
      hpbw: R.half !== null && L.half !== null ? R.half + L.half : null,
      fnbw: R.nul !== null && L.nul !== null ? (R.nul + L.nul) * STEP : null,
      sll: null
    };
    if (R.nul !== null && L.nul !== null) {
      var best = 0;
      for (var k = R.nul + 1; k < n - L.nul; k++) {
        var v = at(i0 + k);
        // a local maximum outside the main lobe; one as high as the main lobe is another major lobe, not a side lobe
        if (v > at(i0 + k - 1) && v >= at(i0 + k + 1) && v < 0.999 && v > best) best = v;
      }
      if (best > 1e-6) out.sll = 10 * Math.log10(best);
    }
    return out;
  }

  // The numbers the widget shows, for a given antenna and parameters.
  function readout(kind, params) {
    var ant = ANTENNAS[kind];
    return ant.cuts.map(function (cut) { return metrics(sampleCut(ant, params, cut)); });
  }

  if (typeof module !== 'undefined') { module.exports = { ANTENNAS: ANTENNAS, readout: readout, STEP: STEP }; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var SCALES = {
    field: { label: 'Field |<i>E</i>|', r: function (f) { return f > 0 ? f : 0; }, half: Math.SQRT1_2, rings: [[0.25], [0.5, '0.5'], [0.75], [1, '1']] },
    power: { label: 'Power |<i>E</i>|<sup>2</sup>', r: function (f) { return f > 0 ? f * f : 0; }, half: 0.5, rings: [[0.25], [0.5, '0.5'], [0.75], [1, '1']] },
    db: {
      label: 'dB', half: (FLOOR - 3) / FLOOR,
      r: function (f) { return f > 0 ? Math.max(0, (20 * Math.log10(f) + FLOOR) / FLOOR) : 0; },
      rings: [[0.25, '−30 dB'], [0.5, '−20 dB'], [0.75, '−10 dB'], [1, '0 dB']]
    }
  };
  var CUT_COLOURS = ['--accent', '--art-turmeric'];

  // The antenna, drawn at the centre of every plot. Units are those of the plots (pattern maximum = 1), so the
  // antenna is not to scale with the pattern; it only grows and shrinks with its own parameters.
  function geometry(kind, p) {
    if (kind === 'dipole') {
      var h = 0.08 + 0.16 * p.L, g = 0.02;
      return [{ t: 'line', a: [0, 0, g], b: [0, 0, h] }, { t: 'line', a: [0, 0, -g], b: [0, 0, -h] }, { t: 'feed', p: [0, 0, 0] }];
    }
    if (kind === 'array') {
      var c = Math.min(0.25, 0.7 / Math.max(1e-9, (p.N - 1) * p.d)), out = [];
      for (var n = 0; n < p.N; n++) out.push({ t: 'dot', p: [0, 0, (n - (p.N - 1) / 2) * p.d * c] });
      return out;
    }
    var k = Math.min(0.12, 0.5 / Math.max(p.a, p.b)), x = p.a * k / 2, y = p.b * k / 2;
    return [
      { t: 'ground' },
      { t: 'rect', pts: [[-x, -y, 0], [x, -y, 0], [x, y, 0], [-x, y, 0]] },
      { t: 'arrow', a: [0, -0.75 * y, 0], b: [0, 0.75 * y, 0] }   // the field across the opening points along y
    ];
  }

  function fmtDeg(v) { return v === null ? '—' : v.toFixed(1) + '°'; }
  function fmtDb(v) { return v === null ? 'none' : v.toFixed(1).replace('-', '\u2212') + ' dB'; }

  function init(root) {
    var RA = window.RA;
    var kind = root.dataset.antenna || 'dipole';
    var ant = ANTENNAS[kind];
    var params = {};
    Object.keys(ant.params).forEach(function (k) { params[k] = ant.params[k].value; });
    (root.dataset.params || '').split(',').forEach(function (kv) {
      var parts = kv.split('=');
      if (parts.length === 2 && parts[0].trim() in params) params[parts[0].trim()] = +parts[1];
    });
    var scale = SCALES[root.dataset.scale] ? root.dataset.scale : 'db';
    var view = { az: 35 * D2R, el: 22 * D2R };

    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root);
    Object.keys(ant.params).forEach(function (k) {
      var spec = ant.params[k];
      RA.slider(controls, {
        label: spec.label, min: spec.min, max: spec.max, step: spec.step, value: params[k],
        fmt: function (v) { return (spec.step < 1 ? v.toFixed(2) : String(v)) + (spec.unit ? ' ' + spec.unit : ''); },
        onInput: function (v) { params[k] = v; update(); }
      });
    });
    var scaleBox = RA.el('div', { class: 'ra-toggle', role: 'radiogroup', 'aria-label': 'Scale' }, controls);
    var scaleButtons = {};
    Object.keys(SCALES).forEach(function (s) {
      var b = RA.el('button', { type: 'button', role: 'radio' }, scaleBox);
      b.innerHTML = SCALES[s].label;
      b.addEventListener('click', function () { scale = s; update(); });
      scaleButtons[s] = b;
    });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var canvas = RA.el('canvas', { class: 'ra-pattern-3d', tabindex: 0, role: 'img' }, stage);
    var side = RA.el('div', { class: 'ra-pattern-side' }, stage);
    var table = RA.el('table', { class: 'ra-readout' }, side);
    RA.el('p', { class: 'ra-pattern-note' }, side, 'The antenna sits at the centre of each plot, drawn larger than it would be next to the pattern. Drag the 3D view to turn it.');
    var polars = ant.cuts.map(function (cut, i) {
      var box = RA.el('div', { class: 'ra-pattern-cut' }, stage);
      var head = RA.el('p', { class: 'ra-pattern-cut-name' }, box);
      head.innerHTML = '<span style="color:var(' + CUT_COLOURS[i] + ')">' + cut.name + '</span> (' + cut.plane + ' plane)';
      var s = RA.svg('svg', { viewBox: '-1.3 -1.3 2.6 2.6', role: 'img' }, box);
      var title = RA.svg('title', {}, s);
      return { svg: s, title: title };
    });

    var data; // per cut: samples and metrics
    var mesh; // 3D surface radii

    function compute() {
      data = ant.cuts.map(function (cut) { var f = sampleCut(ant, params, cut); return { f: f, m: metrics(f) }; });
      // normalise everything to the largest |E| anywhere: check a coarse sphere and both cuts
      var nT = 60, nP = 72, raw = [], max = 0, i, j;
      for (i = 0; i <= nT; i++) {
        raw.push([]);
        for (j = 0; j <= nP; j++) { var v = ant.field(params, i * PI / nT, j * 2 * PI / nP); raw[i].push(v); if (v > max) max = v; }
      }
      data.forEach(function (d) { for (var k = 0; k < d.f.length; k++) if (d.f[k] > max) max = d.f[k]; });
      mesh = { nT: nT, nP: nP, raw: raw, max: max };
    }

    function drawPolar(k) {
      var P = polars[k], cut = ant.cuts[k], d = data[k], sc = SCALES[scale], g = P.svg;
      while (g.lastChild !== P.title) g.removeChild(g.lastChild);
      RA.polarGrid(RA.svg('g', {}, g), sc.rings.map(function (r) { return { r: r[0], label: r[1] }; }), function (a) {
        if (cut.angle === 'θ') return (a > 180 ? 360 - a : a) + '°';
        return a + '°';
      }, { up: cut.u[2] ? 'z' : 'x', right: cut.v[0] ? 'x' : 'y' });
      var colour = 'var(' + CUT_COLOURS[k] + ')', n = d.f.length, pts = [], max = mesh.max;
      for (var i = 0; i <= n; i += 4) {
        var a = (i % n) * STEP * D2R, r = sc.r(d.f[i % n] / max);
        pts.push((r * Math.sin(a)).toFixed(4) + ',' + (-r * Math.cos(a)).toFixed(4));
      }
      RA.svg('circle', { cx: 0, cy: 0, r: sc.half, fill: 'none', stroke: colour, 'stroke-width': 0.008, 'stroke-dasharray': '0.03 0.03', 'stroke-opacity': 0.8 }, g);
      RA.svg('polyline', { points: pts.join(' '), fill: colour, 'fill-opacity': 0.12, stroke: colour, 'stroke-width': 0.016, 'stroke-linejoin': 'round' }, g);
      drawAntenna2d(g, cut);
      var m = d.m;
      if (m.hpbw !== null) {
        // the two half-power directions of the main lobe
        var f = d.f, i0 = Math.round(m.peak / STEP);
        [1, -1].forEach(function (dir) {
          var k2 = 0;
          while (k2 < n / 2 && (f[((i0 + dir * k2) % n + n) % n] / f[i0]) ** 2 >= 0.5) k2++;
          var a = (i0 + dir * k2) * STEP * D2R;
          RA.svg('line', { x1: 0, y1: 0, x2: 1.05 * Math.sin(a), y2: -1.05 * Math.cos(a), stroke: colour, 'stroke-width': 0.008 }, g);
        });
      }
      P.title.textContent = cut.name + ' pattern in the ' + cut.plane + ' plane, ' + scale + ' scale. HPBW ' + fmtDeg(m.hpbw) +
        ', FNBW ' + fmtDeg(m.fnbw) + ', side-lobe level ' + fmtDb(m.sll) + '.';
    }

    // The antenna seen in a cut's plane: x along v, y up along u.
    function drawAntenna2d(g, cut) {
      function p2(q) { return [q[0] * cut.v[0] + q[1] * cut.v[1] + q[2] * cut.v[2], -(q[0] * cut.u[0] + q[1] * cut.u[1] + q[2] * cut.u[2])]; }
      var a = RA.svg('g', { class: 'ra-antenna' }, g);
      geometry(kind, params).forEach(function (pr) {
        if (pr.t === 'ground') {
          RA.svg('line', { x1: -1.02, y1: 0, x2: 1.02, y2: 0, stroke: 'currentColor', 'stroke-width': 0.02, 'stroke-opacity': 0.55 }, a);
          for (var x = -0.94; x < 1.03; x += 0.1) RA.svg('line', { x1: x, y1: 0.01, x2: x - 0.06, y2: 0.07, stroke: 'currentColor', 'stroke-width': 0.008, 'stroke-opacity': 0.4 }, a);
        } else if (pr.t === 'rect') {
          var q = pr.pts.map(p2), xs = q.map(function (v) { return v[0]; });
          var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
          // the opening is a gap in the sheet, with the waveguide's walls running down behind it
          RA.svg('line', { x1: x0, y1: 0, x2: x1, y2: 0, stroke: 'var(--bg)', 'stroke-width': 0.04 }, a);
          RA.svg('path', { d: 'M' + x0 + ' 0V0.2M' + x1 + ' 0V0.2', stroke: 'currentColor', 'stroke-width': 0.025, fill: 'none' }, a);
        } else if (pr.t === 'line' || pr.t === 'arrow') {
          var s = p2(pr.a), e = p2(pr.b);
          if (Math.hypot(e[0] - s[0], e[1] - s[1]) < 1e-3) {
            // seen end-on: a wire is a dot; a field arrow points out of the plane, drawn as a dot in a circle
            if (pr.t === 'line') RA.svg('circle', { cx: s[0], cy: s[1], r: 0.03, fill: 'currentColor' }, a);
            else {
              RA.svg('circle', { cx: s[0], cy: 0.1, r: 0.045, fill: 'var(--bg)', stroke: 'var(--art-maroon)', 'stroke-width': 0.015 }, a);
              RA.svg('circle', { cx: s[0], cy: 0.1, r: 0.014, fill: 'var(--art-maroon)' }, a);
            }
            return;
          }
          if (pr.t === 'arrow') { s[1] += 0.1; e[1] += 0.1; }   // the field drawn inside the waveguide, under the sheet
          var col = pr.t === 'arrow' ? 'var(--art-maroon)' : 'currentColor';
          RA.svg('line', { x1: s[0], y1: s[1], x2: e[0], y2: e[1], stroke: col, 'stroke-width': 0.03, 'stroke-linecap': 'round' }, a);
          if (pr.t === 'arrow') {
            var ang = Math.atan2(e[1] - s[1], e[0] - s[0]), L = 0.06;
            RA.svg('path', { d: 'M' + e[0] + ' ' + e[1] + 'L' + (e[0] - L * Math.cos(ang - 0.5)) + ' ' + (e[1] - L * Math.sin(ang - 0.5)) +
              'L' + (e[0] - L * Math.cos(ang + 0.5)) + ' ' + (e[1] - L * Math.sin(ang + 0.5)) + 'Z', fill: col }, a);
          }
        } else {
          var c = p2(pr.p);
          RA.svg('circle', { cx: c[0], cy: c[1], r: pr.t === 'feed' ? 0.018 : 0.025, fill: pr.t === 'feed' ? 'var(--art-maroon)' : 'currentColor' }, a);
        }
      });
    }

    function draw3d() {
      var dpr = window.devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      var ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var S = Math.min(w, h) * 0.36, cx = w / 2, cy = h / 2 + h * 0.04;
      var ca = Math.cos(view.az), sa = Math.sin(view.az), ce = Math.cos(view.el), se = Math.sin(view.el);
      var R = [-sa, ca, 0], U = [-se * ca, -se * sa, ce], W = [ce * ca, ce * sa, se];
      function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
      function proj(p) { return [cx + S * dot(p, R), cy - S * dot(p, U), dot(p, W)]; }
      var sc = SCALES[scale], fg = RA.css('--fg'), surface = RA.css('--muted');

      ctx.font = '12px ' + RA.css('--font-figure');
      ctx.lineWidth = 1;
      var axes = [[[1.3, 0, 0], 'x'], [[0, 1.3, 0], 'y'], [[0, 0, 1.3], 'z']];
      ctx.strokeStyle = fg; ctx.globalAlpha = 0.35;
      axes.forEach(function (ax) { var o = proj([0, 0, 0]), e = proj(ax[0]); ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(e[0], e[1]); ctx.stroke(); });
      ctx.globalAlpha = 1;
      var geom = geometry(kind, params), bg = RA.css('--bg'), mark = RA.css('--art-maroon');
      function path(points) { ctx.beginPath(); points.forEach(function (q, n) { var P = proj(q); ctx[n ? 'lineTo' : 'moveTo'](P[0], P[1]); }); ctx.closePath(); }
      function drawGround() {
        path([[-0.95, -0.95, 0], [0.95, -0.95, 0], [0.95, 0.95, 0], [-0.95, 0.95, 0]]);
        ctx.fillStyle = fg; ctx.globalAlpha = 0.07; ctx.fill();
        ctx.strokeStyle = fg; ctx.globalAlpha = 0.3; ctx.lineWidth = 1; ctx.stroke();
        ctx.globalAlpha = 1;
      }
      var hasGround = geom.some(function (pr) { return pr.t === 'ground'; });
      if (hasGround && view.el >= 0) drawGround();   // seen from above, the sheet is behind the pattern

      var nT = mesh.nT, nP = mesh.nP, pts = [], i, j;
      for (i = 0; i <= nT; i++) {
        pts.push([]);
        for (j = 0; j <= nP; j++) {
          var th = i * PI / nT, ph = j * 2 * PI / nP, r = sc.r(mesh.raw[i][j] / mesh.max);
          pts[i].push([r * Math.sin(th) * Math.cos(ph), r * Math.sin(th) * Math.sin(ph), r * Math.cos(th)]);
        }
      }
      var quads = [];
      for (i = 0; i < nT; i++) for (j = 0; j < nP; j++) {
        var q = [pts[i][j], pts[i + 1][j], pts[i + 1][j + 1], pts[i][j + 1]];
        var e1 = [q[2][0] - q[0][0], q[2][1] - q[0][1], q[2][2] - q[0][2]], e2 = [q[3][0] - q[1][0], q[3][1] - q[1][1], q[3][2] - q[1][2]];
        var nx = e1[1] * e2[2] - e1[2] * e2[1], ny = e1[2] * e2[0] - e1[0] * e2[2], nz = e1[0] * e2[1] - e1[1] * e2[0];
        var nl = Math.hypot(nx, ny, nz);
        if (nl < 1e-12) continue;
        var depth = (dot(q[0], W) + dot(q[1], W) + dot(q[2], W) + dot(q[3], W)) / 4;
        var light = Math.abs((nx * (W[0] + U[0] * 0.6) + ny * (W[1] + U[1] * 0.6) + nz * (W[2] + U[2] * 0.6)) / nl / 1.166);
        quads.push([depth, q, light]);
      }
      quads.sort(function (a, b) { return a[0] - b[0]; });
      ctx.lineJoin = 'round';
      quads.forEach(function (Q) {
        var a = proj(Q[1][0]), b = proj(Q[1][1]), c = proj(Q[1][2]), d = proj(Q[1][3]);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath();
        ctx.fillStyle = surface; ctx.globalAlpha = 1;
        ctx.fill();
        ctx.fillStyle = Q[2] > 0.5 ? '#fff' : '#000';
        ctx.globalAlpha = Q[2] > 0.5 ? (Q[2] - 0.5) * 0.7 : (0.5 - Q[2]) * 0.9;
        ctx.fill();
        ctx.globalAlpha = 0.12; ctx.strokeStyle = '#000'; ctx.lineWidth = 0.5; ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // the two cuts traced on the surface; faint where they run behind it
      data.forEach(function (dd, k) {
        var cut = ant.cuts[k], n = dd.f.length;
        ctx.strokeStyle = RA.css(CUT_COLOURS[k]); ctx.lineWidth = 2;
        var prev = null;
        for (var s = 0; s <= n; s += 40) {
          var a = (s % n) * STEP * D2R, r = sc.r(dd.f[s % n] / mesh.max), dir = direction(cut, a);
          var P = proj([r * dir[0] * 1.01, r * dir[1] * 1.01, r * dir[2] * 1.01]);
          if (prev) {
            ctx.globalAlpha = (P[2] + prev[2]) / 2 < -0.05 ? 0.25 : 1;
            ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(P[0], P[1]); ctx.stroke();
          }
          prev = P;
        }
      });
      if (hasGround && view.el < 0) drawGround();   // seen from below, it hides the pattern

      // the antenna, on top, with a thin outline in the background colour so it reads over the surface
      geom.forEach(function (pr) {
        ctx.globalAlpha = 1;
        if (pr.t === 'rect') {
          path(pr.pts); ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = fg; ctx.lineWidth = 1.5; ctx.stroke();
        } else if (pr.t === 'line' || pr.t === 'arrow') {
          var a = proj(pr.a), b = proj(pr.b), col = pr.t === 'arrow' ? mark : fg;
          ctx.lineCap = 'round';
          ctx.strokeStyle = bg; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
          ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
          if (pr.t === 'arrow') {
            var ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
            ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(b[0] + 4 * Math.cos(ang), b[1] + 4 * Math.sin(ang));
            ctx.lineTo(b[0] - 6 * Math.cos(ang - 0.6), b[1] - 6 * Math.sin(ang - 0.6)); ctx.lineTo(b[0] - 6 * Math.cos(ang + 0.6), b[1] - 6 * Math.sin(ang + 0.6)); ctx.fill();
          }
        } else if (pr.t === 'dot' || pr.t === 'feed') {
          var c = proj(pr.p);
          ctx.beginPath(); ctx.arc(c[0], c[1], pr.t === 'feed' ? 4 : 4.5, 0, 2 * PI);
          ctx.fillStyle = pr.t === 'feed' ? mark : fg; ctx.strokeStyle = bg; ctx.lineWidth = 1.5; ctx.fill(); ctx.stroke();
        }
      });
      ctx.globalAlpha = 1; ctx.fillStyle = fg;
      axes.forEach(function (ax) { var e = proj(ax[0]); ctx.fillText(ax[1], e[0] + 4, e[1] - 4); });
      canvas.setAttribute('aria-label', '3D ' + ant.name.toLowerCase() + ' radiation pattern, ' + scale + ' scale. Drag or use the arrow keys to turn it.');
    }

    function drawTable() {
      var rows = [['HPBW', 'hpbw', fmtDeg], ['FNBW', 'fnbw', fmtDeg], ['Side-lobe level', 'sll', fmtDb]];
      var html = '<thead><tr><th></th>' + ant.cuts.map(function (c, i) {
        return '<th style="color:var(' + CUT_COLOURS[i] + ')">' + c.name + '</th>';
      }).join('') + '</tr></thead><tbody>';
      rows.forEach(function (r) {
        html += '<tr><th>' + r[0] + '</th>' + data.map(function (d) { return '<td>' + r[2](d.m[r[1]]) + '</td>'; }).join('') + '</tr>';
      });
      table.innerHTML = html + '</tbody><caption>— means the cut has no such points, e.g. when it is a circle or stops at a ground plane first.</caption>';
    }

    function update() {
      compute();
      Object.keys(scaleButtons).forEach(function (s) { scaleButtons[s].setAttribute('aria-checked', s === scale); });
      polars.forEach(function (_, k) { drawPolar(k); });
      draw3d();
      drawTable();
    }

    var drag = null;
    canvas.addEventListener('pointerdown', function (e) { drag = [e.clientX, e.clientY]; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) {
      if (!drag) return;
      view.az -= (e.clientX - drag[0]) * 0.01;
      view.el = Math.max(-PI / 2, Math.min(PI / 2, view.el + (e.clientY - drag[1]) * 0.01));
      drag = [e.clientX, e.clientY];
      draw3d();
    });
    canvas.addEventListener('pointerup', function () { drag = null; });
    canvas.addEventListener('pointercancel', function () { drag = null; });
    canvas.addEventListener('keydown', function (e) {
      var d = { ArrowLeft: [0.1, 0], ArrowRight: [-0.1, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] }[e.key];
      if (!d) return;
      e.preventDefault();
      view.az += d[0]; view.el = Math.max(-PI / 2, Math.min(PI / 2, view.el + d[1]));
      draw3d();
    });
    if (window.ResizeObserver) new ResizeObserver(draw3d).observe(canvas);
    RA.onTheme(draw3d);
    update();
  }

  document.querySelectorAll('[data-widget="pattern-explorer"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
