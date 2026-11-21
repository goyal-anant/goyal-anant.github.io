// duality: Balanis §3.7 on the two short sources it pairs, the electric dipole (4-8a)-(4-10c) and its dual, the
// magnetic dipole or small loop (5-20a)-(5-20d).
// case=impedance: the wave impedance of each against kr. Dipole Z_e = E_theta / H_phi, loop Z_m = -E_phi / H_theta
//   (both are eta far away). The loop's bracket is the dipole's upside down, so Z_e Z_m = eta^2 at every kr.
// case=ground: a short electric or magnetic dipole, vertical (z) or horizontal (x), at height h above a flat perfect
//   electric (PEC) or magnetic (PMC) conductor, by images (Balanis Fig. 4.13). Far field only, lengths in wavelengths.
// Markup from _includes/readalong/duality.html; helpers from readalong.js (window.RA).
// The maths at the top has no DOM and is also run under node by content/balanis/checks/duality.py.
(function () {
  var PI = Math.PI, ETA = 376.730313, node = typeof module !== 'undefined';

  // ---- impedance ---------------------------------------------------------------------------------------------------
  // complex helpers as [re, im]
  function cdiv(p, q) { var d = q[0] * q[0] + q[1] * q[1]; return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; }
  // 1 + 1/(j kr) - 1/(kr)^2 and 1 + 1/(j kr)
  function brackets(kr) { return { full: [1 - 1 / (kr * kr), -1 / kr], half: [1, -1 / kr] }; }
  function Ze(kr) { var b = brackets(kr), z = cdiv(b.full, b.half); return [ETA * z[0], ETA * z[1]]; }
  function Zm(kr) { var b = brackets(kr), z = cdiv(b.half, b.full); return [ETA * z[0], ETA * z[1]]; }
  function mag(z) { return Math.hypot(z[0], z[1]); }
  function phase(z) { return Math.atan2(z[1], z[0]) * 180 / PI; }

  // ---- ground ------------------------------------------------------------------------------------------------------
  // image sign (Balanis Fig. 4.13): +1 when the image points the same way as the source
  function imageSign(kind, orient, wall) {
    var s = (kind === 'e') === (orient === 'v') ? 1 : -1;   // PEC: vertical electric and horizontal magnetic keep their sign
    return wall === 'pec' ? s : -s;                        // PMC is the dual: every sign flips
  }
  // |E|^2 of the source alone in free space, peak 1: sin^2 theta for z, 1 - sin^2 theta cos^2 phi for x
  function element(orient, th, ph) {
    var s = Math.sin(th);
    return orient === 'v' ? s * s : 1 - s * s * Math.cos(ph) * Math.cos(ph);
  }
  // |array factor|^2 of source and image: 4 cos^2(kh cos th) or 4 sin^2(kh cos th)
  function arrayFactor(sign, h, th) {
    var x = 2 * PI * h * Math.cos(th), c = sign > 0 ? Math.cos(x) : Math.sin(x);
    return 4 * c * c;
  }
  // |E|^2 above the conductor (zero below it), on the scale where the source alone peaks at 1
  function U(kind, orient, wall, h, th, ph) {
    if (th > PI / 2) return 0;
    return element(orient, th, ph) * arrayFactor(imageSign(kind, orient, wall), h, th);
  }
  // radiated power against the same source in free space (8 pi / 3 on this scale), and the peak of U.
  // Simpson in theta over the upper half, midpoint in phi (periodic, so exact for these trig polynomials)
  function power(kind, orient, wall, h) {
    var nt = 600, np = orient === 'v' ? 1 : 72, sum = 0, top = 0;
    for (var i = 0; i <= nt; i++) {
      var th = PI / 2 * i / nt, w = i === 0 || i === nt ? 1 : i % 2 ? 4 : 2, row = 0;
      for (var j = 0; j < np; j++) {
        var u = U(kind, orient, wall, h, th, 2 * PI * (j + 0.5) / np);
        row += u; if (u > top) top = u;
      }
      sum += w * row / np * Math.sin(th);
    }
    var P = 2 * PI * sum * (PI / 2 / nt) / 3;
    return { ratio: P / (8 * PI / 3), D0: P > 0 ? 4 * PI * top / P : 0, top: top };
  }

  var api = { Ze: Ze, Zm: Zm, mag: mag, phase: phase, imageSign: imageSign, element: element, arrayFactor: arrayFactor, U: U, power: power };
  if (node) { module.exports = api; return; }

  // ---- drawing -----------------------------------------------------------------------------------------------------
  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  function dB(x) { return 10 * Math.log10(x); }
  function setSlider(input, v, txt) { input.value = v; input.nextElementSibling.textContent = txt; }
  function presets(parent, list, apply, isOn) {
    var box = RA.el('div', { class: 'ra-controls' }, parent), btns = [];
    list.forEach(function (p) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, box);
      b.innerHTML = p[0];
      b.addEventListener('click', function () { apply(p); });
      btns.push([p, b]);
    });
    return function () { btns.forEach(function (q) { q[1].setAttribute('aria-pressed', String(isOn(q[0]))); }); };
  }

  function init(root) {
    var d = root.dataset;
    root.textContent = '';
    (d.case === 'ground' ? groundCase : impedanceCase)(root, d);
  }

  // ---- impedance ---------------------------------------------------------------------------------------------------
  var C0 = 299792458;
  function impedanceCase(root, d) {
    var st = { lg: Math.log10(+(d.kr || 0.1)) };
    var box = RA.el('div', { class: 'ra-controls' }, root);
    var kIn = RA.slider(box, { label: 'Probe <i>kr</i>', min: -2, max: 2, step: 0.005, value: st.lg,
      fmt: function (v) { return sig(Math.pow(10, v), 3); }, onInput: function (v) { st.lg = v; update(); } });
    var PRE = [['NFC, 10 cm at 13.56 MHz', 2 * PI * 0.1 * 13.56e6 / C0], ['<i>kr</i> = 1', 1], ['Wi-Fi, 1 m at 2.45 GHz', 2 * PI * 2.45e9 / C0]];
    var paintPre = presets(root, PRE, function (p) {
      st.lg = Math.log10(p[1]); setSlider(kIn, st.lg, sig(p[1], 3)); update();
    }, function (p) { return Math.abs(st.lg - Math.log10(p[1])) < 1e-4; });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var A = RA.plotBox(stage, 'Wave impedance |Z| in ohms');
    var B = RA.plotBox(stage, 'Its phase');
    var lx = [0.01, 0.1, 1, 10, 100], fx = function (x) { return String(x); };
    var FA = RA.frame(A.S, [0.01, 100], [1, 1e5], lx, [1, 10, 100, 1e3, 1e4, 1e5], 'kr', 'Ω', fx,
      function (y) { return y >= 1e3 ? (y / 1e3) + 'k' : String(y); }, true, true);
    var FB = RA.frame(B.S, [0.01, 100], [-90, 90], lx, [-90, -45, 0, 45, 90], 'kr', 'degrees', fx,
      function (y) { return (y > 0 ? '+' : y < 0 ? '−' : '') + Math.abs(y); }, true, false);
    var xs = [];
    for (var i = 0; i <= 400; i++) xs.push(Math.pow(10, -2 + 4 * i / 400));
    var styE = { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.8 }, styM = { fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 1.8 };
    var styEta = { stroke: 'currentColor', 'stroke-opacity': 0.6, 'stroke-dasharray': '4 3' };
    svg('line', Object.assign({ x1: FA.X(0.01), x2: FA.X(100), y1: FA.Y(ETA), y2: FA.Y(ETA) }, styEta), A.S);
    svg('text', { x: FA.X(0.012), y: FA.Y(ETA) - 4, 'font-size': 9.5, fill: 'currentColor', 'fill-opacity': 0.75 }, A.S).textContent = 'η = 377 Ω';
    svg('path', Object.assign({ d: RA.path(xs.map(function (x) { return [x, mag(Ze(x))]; }), FA) }, styE), A.S);
    svg('path', Object.assign({ d: RA.path(xs.map(function (x) { return [x, mag(Zm(x))]; }), FA) }, styM), A.S);
    svg('path', Object.assign({ d: RA.path(xs.map(function (x) { return [x, phase(Ze(x))]; }), FB) }, styE), B.S);
    svg('path', Object.assign({ d: RA.path(xs.map(function (x) { return [x, phase(Zm(x))]; }), FB) }, styM), B.S);
    RA.legend(A.S, 200, 40, [[styE, 'dipole'], [styM, 'loop']]);
    RA.legend(B.S, 200, 40, [[styM, 'loop'], [styE, 'dipole']]);
    var probe = [FA, FB].map(function (F, n) {
      var S = n ? B.S : A.S;
      return { F: F, line: svg('line', { y1: 24, y2: 176, stroke: 'currentColor', 'stroke-opacity': 0.5, 'stroke-dasharray': '2 2' }, S),
        e: svg('circle', { r: 3.5, fill: 'var(--accent)' }, S), m: svg('circle', { r: 3.5, fill: 'var(--ra-warm)' }, S) };
    });
    A.title.textContent = 'Log–log plot of the wave impedance of a short dipole and of a small loop against kr. The dipole starts far above 377 ohms, the loop far below, and both settle on 377 ohms; on the log scale they are mirror images about it.';
    B.title.textContent = 'Phase of the two wave impedances against kr: the dipole from minus 90 degrees, the loop from plus 90, both to 0.';
    var rows = RA.readout(RA.el('div', {}, root), [['ze', 'Dipole <i>Z<sub>e</sub></i> = <i>E<sub>θ</sub></i> / <i>H<sub>φ</sub></i>'],
      ['zm', 'Loop <i>Z<sub>m</sub></i> = −<i>E<sub>φ</sub></i> / <i>H<sub>θ</sub></i>'], ['pr', '<i>Z<sub>e</sub> Z<sub>m</sub></i> / <i>η</i><sup>2</sup>'],
      ['r', 'That <i>kr</i> is at']]);
    function update() {
      var kr = Math.pow(10, st.lg), ze = Ze(kr), zm = Zm(kr);
      probe.forEach(function (p, n) {
        var x = p.F.X(kr);
        p.line.setAttribute('x1', x); p.line.setAttribute('x2', x);
        [[p.e, ze], [p.m, zm]].forEach(function (q) {
          q[0].setAttribute('cx', x); q[0].setAttribute('cy', p.F.clampY(p.F.Y(n ? phase(q[1]) : mag(q[1]))));
        });
      });
      rows.ze.td.textContent = sig(mag(ze), 4) + ' Ω, ' + RA.signed(phase(ze), 1) + '°';
      rows.zm.td.textContent = sig(mag(zm), 4) + ' Ω, ' + RA.signed(phase(zm), 1) + '°';
      var p = [(ze[0] * zm[0] - ze[1] * zm[1]) / (ETA * ETA), (ze[0] * zm[1] + ze[1] * zm[0]) / (ETA * ETA)];
      rows.pr.td.textContent = p[0].toFixed(6) + (Math.abs(p[1]) < 5e-7 ? '' : ' ' + RA.signed(p[1], 6) + 'j');
      function cm(f) { var r = kr * C0 / f / (2 * PI); return r >= 1 ? sig(r, 3) + ' m' : sig(r * 100, 3) + ' cm'; }
      rows.r.td.textContent = cm(13.56e6) + ' at 13.56 MHz, ' + cm(2.45e9) + ' at 2.45 GHz';
      paintPre();
    }
    update();
  }

  // ---- ground ------------------------------------------------------------------------------------------------------
  function describe(kind, orient) {
    if (kind === 'e') return (orient === 'v' ? 'vertical' : 'horizontal') + ' electric dipole';
    return orient === 'v' ? 'flat loop (vertical magnetic dipole)' : 'upright loop (horizontal magnetic dipole)';
  }
  function groundCase(root, d) {
    var st = { kind: d.kind || 'm', orient: d.orient || 'v', wall: d.wall || 'pec', h: +(d.h || 0.05) };
    var box = RA.el('div', { class: 'ra-controls' }, root);
    var paintKind = RA.toggle(box, 'Source', [['e', 'Electric'], ['m', 'Magnetic']], function () { return st.kind; }, function (v) { st.kind = v; update(); });
    var paintOrient = RA.toggle(box, 'Orientation', [['v', 'Vertical'], ['h', 'Horizontal']], function () { return st.orient; }, function (v) { st.orient = v; update(); });
    var paintWall = RA.toggle(box, 'Conductor', [['pec', 'Electric (PEC)'], ['pmc', 'Magnetic (PMC)']], function () { return st.wall; }, function (v) { st.wall = v; update(); });
    var hIn = RA.slider(box, { label: 'Height <i>h</i>', min: 0.01, max: 1, step: 0.005, value: st.h,
      fmt: function (v) { return v.toFixed(3) + ' λ'; }, onInput: function (v) { st.h = v; update(); } });
    var PRE = [['Loop flat on metal', 'm', 'v', 'pec', 0.05], ['Dipole standing on metal', 'e', 'v', 'pec', 0.05], ['Its dual: loop over PMC', 'm', 'v', 'pmc', 0.05],
      ['Dipole lying on metal', 'e', 'h', 'pec', 0.05]];
    var paintPre = presets(root, PRE, function (p) {
      st.kind = p[1]; st.orient = p[2]; st.wall = p[3]; st.h = p[4]; setSlider(hIn, p[4], p[4].toFixed(3) + ' λ'); update();
    }, function (p) { return st.kind === p[1] && st.orient === p[2] && st.wall === p[3] && Math.abs(st.h - p[4]) < 1e-9; });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    // geometry: the source, the conductor and the image; height drawn as 16 + 60 h units so a low source stays clear of the plate
    var gbox = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, gbox, 'Source and image, side view (not to scale)');
    var G = svg('svg', { viewBox: '0 0 260 200', role: 'img' }, gbox), gTitle = svg('title', {}, G);
    var defs = svg('defs', {}, G);
    function marker(id, open) {
      var m = svg('marker', { id: id, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 4, markerHeight: 4, orient: 'auto-start-reverse' }, defs);
      svg('path', { d: 'M0,0 L10,5 L0,10 z', style: open ? 'fill: var(--bg); stroke: var(--accent); stroke-width: 1.5' : 'fill: var(--accent)' }, m);
    }
    var uid = 'ra-dual-' + Math.random().toString(36).slice(2, 7);
    marker(uid + '-e', false); marker(uid + '-m', true);
    var Y0 = 100, X0 = 70;
    var wallRect = svg('rect', { x: 10, y: Y0 - 1.5, width: 240, height: 3 }, G);
    var wallTxt = svg('text', { x: 252, y: 194, 'font-size': 10, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.75 }, G);
    var src = svg('g', { style: 'color: var(--accent)' }, G), img = svg('g', { style: 'color: var(--accent)', 'stroke-dasharray': '3 2', opacity: 0.7 }, G);
    var srcTxt = svg('text', { x: 98, 'font-size': 10, fill: 'currentColor' }, G);
    var imgTxt = svg('text', { x: 98, 'font-size': 10, fill: 'currentColor', 'fill-opacity': 0.75 }, G);
    var hLine = svg('line', { x1: 30, x2: 30, y1: Y0, stroke: 'currentColor', 'stroke-opacity': 0.5 }, G);
    var hTxt = svg('text', { x: 24, 'font-size': 10, 'text-anchor': 'end', fill: 'currentColor' }, G);
    function drawDipole(g, y, sign) {
      while (g.firstChild) g.removeChild(g.firstChild);
      var L = 24, m = 'url(#' + uid + '-' + st.kind + ')', line = { stroke: 'currentColor', 'stroke-width': 2.2, 'marker-end': m };
      if (st.orient === 'v') svg('line', Object.assign({ x1: X0, x2: X0, y1: y + sign * L / 2, y2: y - sign * L / 2 }, line), g);
      else svg('line', Object.assign({ x1: X0 - sign * L / 2, x2: X0 + sign * L / 2, y1: y, y2: y }, line), g);
      if (st.kind === 'm') {   // the loop the magnetic dipole stands for, seen edge-on
        if (st.orient === 'v') svg('ellipse', { cx: X0, cy: y, rx: 10, ry: 3, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.2 }, g);
        else svg('ellipse', { cx: X0, cy: y, rx: 3, ry: 10, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.2 }, g);
      }
    }

    var side = RA.el('div', {}, stage);
    var rows = RA.readout(side, [['img', 'Image'], ['p', 'Radiated power, against the same source in free space'], ['d0', 'Directivity <i>D</i><sub>0</sub>'],
      ['dual', 'Its dual, with the other conductor'], ['other', 'The same source over the other conductor'], ['wifi', '<i>h</i> at 2.45 GHz']]);

    var cuts = [['x–z plane', 0, 'x'], ['y–z plane', PI / 2, 'y']].map(function (c) {
      var b = RA.el('div', { class: 'ra-pattern-cut' }, stage);
      RA.el('p', {}, b, c[0]);
      var S = svg('svg', { viewBox: '-1.3 -1.3 2.6 1.5', role: 'img' }, b), title = svg('title', {}, S);
      [0.5, 1].forEach(function (r) {
        svg('path', { d: 'M' + (-r) + ' 0 A' + r + ' ' + r + ' 0 0 1 ' + r + ' 0', fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.18, 'stroke-width': 0.006 }, S);
      });
      for (var a = -90; a <= 90; a += 30) {
        var t = a * PI / 180;
        svg('line', { x1: 0, y1: 0, x2: Math.sin(t), y2: -Math.cos(t), stroke: 'currentColor', 'stroke-opacity': 0.12, 'stroke-width': 0.006 }, S);
        if (Math.abs(a) < 90) svg('text', { x: 1.13 * Math.sin(t), y: -1.13 * Math.cos(t) + 0.025, 'font-size': 0.07, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, S).textContent = Math.abs(a) + '°';
      }
      svg('line', { x1: -1.25, x2: 1.25, y1: 0, y2: 0, stroke: 'currentColor', 'stroke-opacity': 0.6, 'stroke-width': 0.012 }, S);
      svg('text', { x: 0.06, y: -1.1, 'font-size': 0.075, 'font-style': 'italic', fill: 'currentColor' }, S).textContent = 'z';
      svg('text', { x: 1.22, y: -0.05, 'font-size': 0.075, 'font-style': 'italic', 'text-anchor': 'middle', fill: 'currentColor' }, S).textContent = c[2];
      var free = svg('path', { fill: 'none', stroke: 'currentColor', 'stroke-width': 0.012, 'stroke-dasharray': '0.035 0.025' }, S);
      var tot = svg('path', { fill: 'var(--accent)', 'fill-opacity': 0.2, stroke: 'var(--accent)', 'stroke-width': 0.016 }, S);
      return { phi: c[1], name: c[0], S: S, title: title, free: free, tot: tot };
    });
    var key = RA.el('p', { class: 'ra-key' }, root);
    key.innerHTML = 'Patterns: |<b>E</b>| above the conductor (filled) and of the same source alone in free space (dashed), on one scale where the free-space peak is 1 and the outer ring is 2. Arrows: single head electric, open head magnetic; the ring is the loop it stands for. Image dashed.';

    function cutPath(cut, fn) {
      var pts = [];
      for (var i = 0; i <= 360; i++) {
        var al = -PI / 2 + PI * i / 360, th = Math.abs(al), ph = al >= 0 ? cut.phi : cut.phi + PI, r = Math.sqrt(fn(th, ph)) / 2;
        pts.push((i ? 'L' : 'M') + (r * Math.sin(al)).toFixed(4) + ' ' + (-r * Math.cos(al)).toFixed(4));
      }
      return pts.join('');
    }
    function update() {
      var s = imageSign(st.kind, st.orient, st.wall), pw = power(st.kind, st.orient, st.wall, st.h);
      var otherWall = st.wall === 'pec' ? 'pmc' : 'pec', otherKind = st.kind === 'e' ? 'm' : 'e';
      var po = power(st.kind, st.orient, otherWall, st.h), pd = power(otherKind, st.orient, otherWall, st.h);
      var hy = Y0 - (16 + 60 * st.h);
      drawDipole(src, hy, 1); drawDipole(img, 2 * Y0 - hy, s);
      wallRect.setAttribute('style', st.wall === 'pec' ? 'fill: currentColor; fill-opacity: 0.35' : 'fill: var(--ra-warm); fill-opacity: 0.35');
      var wallName = st.wall === 'pec' ? 'perfect electric conductor' : 'perfect magnetic conductor';
      wallTxt.textContent = 'plate: ' + wallName;
      srcTxt.setAttribute('y', hy + 4); imgTxt.setAttribute('y', 2 * Y0 - hy + 4);
      srcTxt.textContent = 'source'; imgTxt.textContent = s > 0 ? 'image, same way' : 'image, reversed';
      hLine.setAttribute('y2', hy); hTxt.setAttribute('y', (Y0 + hy) / 2 + 3); hTxt.textContent = 'h';
      gTitle.textContent = 'Side view: a ' + describe(st.kind, st.orient) + ' at ' + st.h.toFixed(3) + ' wavelengths above a ' + wallName + ', and its image the same distance below, ' + (s > 0 ? 'pointing the same way.' : 'reversed.');
      cuts.forEach(function (c) {
        c.tot.setAttribute('d', cutPath(c, function (th, ph) { return U(st.kind, st.orient, st.wall, st.h, th, ph); }) + 'Z');
        c.free.setAttribute('d', cutPath(c, function (th, ph) { return element(st.orient, th, ph); }));
        c.title.textContent = c.name + ': the field above the conductor against the same source in free space.';
      });
      rows.img.td.textContent = s > 0 ? 'same way: adds near the surface' : 'reversed: cancels near the surface';
      rows.p.td.textContent = sig(pw.ratio, 3) + ' × (' + RA.signed(dB(pw.ratio), 1) + ' dB)';
      rows.d0.td.textContent = sig(pw.D0, 3) + ' (' + dB(pw.D0).toFixed(2) + ' dBi)';
      rows.dual.td.textContent = (otherKind === 'e' ? 'electric' : 'magnetic') + ' over ' + otherWall.toUpperCase() + ': ' + sig(pd.ratio, 3) + ' ×, the same';
      rows.other.td.textContent = 'over ' + otherWall.toUpperCase() + ': ' + sig(po.ratio, 3) + ' × (' + RA.signed(dB(po.ratio), 1) + ' dB)';
      rows.wifi.td.textContent = sig(st.h * C0 / 2.45e9 * 1000, 3) + ' mm';
      paintKind(); paintOrient(); paintWall(); paintPre();
    }
    update();
  }

  document.querySelectorAll('[data-widget="duality"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
