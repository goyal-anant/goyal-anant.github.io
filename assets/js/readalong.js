// Read-along pages (_layouts/readalong.html). A reader can tick the sections they have worked through; the
// ticks live in this browser only (localStorage) and show on the book's contents. Without storage the box
// still ticks for the visit and nothing breaks.
(function () {
  var KEY = 'readalong:done';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  var done = load();
  document.querySelectorAll('input[data-done]').forEach(function (box) {
    var url = box.dataset.done;
    box.checked = done.indexOf(url) >= 0;
    box.addEventListener('change', function () {
      done = load().filter(function (u) { return u !== url; });
      if (box.checked) done.push(url);
      save(done);
    });
  });
  document.querySelectorAll('a[data-done-url]').forEach(function (a) {
    if (done.indexOf(a.dataset.doneUrl) >= 0) a.classList.add('is-done');
  });
})();

// Shared helpers for read-along widgets (_includes/readalong/*.html). Plain SVG, no libraries; colours come from
// currentColor and the theme's CSS variables so every widget reads in light and dark.
window.RA = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs, parent) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }
  function el(tag, attrs, parent, text) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  // A labelled range input with a live value. opts: label, min, max, step, value, fmt(v), onInput(v).
  function slider(parent, opts) {
    var wrap = el('label', { class: 'ra-slider' }, parent);
    var name = el('span', { class: 'ra-slider-name' }, wrap);
    name.innerHTML = opts.label;
    var input = el('input', { type: 'range', min: opts.min, max: opts.max, step: opts.step, value: opts.value }, wrap);
    var out = el('output', {}, wrap);
    var fmt = opts.fmt || String;
    function show() { out.textContent = fmt(+input.value); }
    input.addEventListener('input', function () { show(); opts.onInput(+input.value); });
    show();
    return input;
  }
  // Theme colour by CSS variable name, read when drawing (the theme can change while the page is open).
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  // Call fn whenever the light/dark theme changes.
  function onTheme(fn) {
    new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', fn);
  }
  // Polar grid in a viewBox of -1.3..1.3. rings: [{r, label}], spokes every 30 degrees from the top, clockwise.
  // spokeLabel(alphaDeg) gives the text at each spoke; axis {up, right} names the two in-plane axes.
  function polarGrid(g, rings, spokeLabel, axis) {
    rings.forEach(function (ring) {
      svg('circle', { cx: 0, cy: 0, r: ring.r, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.18, 'stroke-width': 0.006 }, g);
      // ring labels sit between the 0 and 30 degree spokes, clear of both
      if (ring.label) svg('text', { x: ring.r * 0.259 + 0.01, y: -ring.r * 0.966 + 0.055, 'font-size': 0.06, fill: 'currentColor', 'fill-opacity': 0.6 }, g).textContent = ring.label;
    });
    for (var a = 0; a < 360; a += 30) {
      var t = a * Math.PI / 180, s = Math.sin(t), c = -Math.cos(t);
      svg('line', { x1: 0, y1: 0, x2: s, y2: c, stroke: 'currentColor', 'stroke-opacity': 0.12, 'stroke-width': 0.006 }, g);
      var tx = svg('text', { x: 1.13 * s, y: 1.13 * c + 0.025, 'font-size': 0.07, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, g);
      tx.textContent = spokeLabel(a);
    }
    if (axis) {
      // axis names beside the 0 and 90 degree labels
      svg('text', { x: 0.1, y: -1.105, 'font-size': 0.075, 'font-style': 'italic', fill: 'currentColor' }, g).textContent = axis.up;
      svg('text', { x: 1.13, y: 0.12, 'font-size': 0.075, 'font-style': 'italic', 'text-anchor': 'middle', fill: 'currentColor' }, g).textContent = axis.right;
    }
  }
  // Plot pieces shared by the 2-D widgets (beam-solid-angle, grid-directivity)
  function readout(parent, list) {
    var table = el('table', { class: 'ra-readout' }, parent), rows = {};
    list.forEach(function (r) {
      var tr = el('tr', {}, table), th = el('th', {}, tr);
      rows[r[0]] = { th: th, td: el('td', {}, tr) };
      th.innerHTML = r[1];
    });
    return rows;
  }
  function toggle(parent, label, items, get, set) {
    var tog = el('div', { class: 'ra-toggle', role: 'radiogroup', 'aria-label': label }, parent), btns = [];
    items.forEach(function (it) {
      var b = el('button', { type: 'button', role: 'radio' }, tog, it[1]);
      b.addEventListener('click', function () { set(it[0]); });
      btns.push([it[0], b]);
    });
    return function () { btns.forEach(function (x) { x[1].setAttribute('aria-checked', String(x[0] === get())); }); };
  }
  function sig(v, d) {   // d significant figures, plain notation, thousands separated
    var r = +v.toPrecision(d), dec = Math.max(0, d - 1 - Math.floor(Math.log10(Math.abs(r) || 1)));
    return r.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function signed(v, d) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(d); }
  function niceStep(span, n) {
    var raw = span / n, m = Math.pow(10, Math.floor(Math.log10(raw))), r = raw / m;
    return m * (r < 1.5 ? 1 : r < 3.5 ? 2 : r < 7.5 ? 5 : 10);
  }
  // A plot box in a 320 x 210 viewBox; X and Y map data to the box (either may be logarithmic)
  function frame(S, xr, yr, xticks, yticks, xlabel, ylabel, xfmt, yfmt, logx, logy) {
    var L = 42, R = 310, T = 24, B = 176;
    var fx = logx ? Math.log : function (x) { return x; };
    var X = function (x) { return L + (R - L) * (fx(x) - fx(xr[0])) / (fx(xr[1]) - fx(xr[0])); };
    var fy = logy ? Math.log : function (y) { return y; };
    var Y = function (y) { return B - (B - T) * (fy(y) - fy(yr[0])) / (fy(yr[1]) - fy(yr[0])); };
    var g = svg('g', {}, S);
    yticks.forEach(function (y) {
      svg('line', { x1: L, x2: R, y1: Y(y), y2: Y(y), stroke: 'currentColor', 'stroke-opacity': y === 0 ? 0.45 : 0.12 }, g);
      svg('text', { x: L - 5, y: Y(y) + 3.5, 'font-size': 10, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = yfmt(y);
    });
    xticks.forEach(function (x) {
      svg('line', { x1: X(x), x2: X(x), y1: T, y2: B, stroke: 'currentColor', 'stroke-opacity': 0.08 }, g);
      svg('text', { x: X(x), y: B + 13, 'font-size': 10, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = xfmt(x);
    });
    svg('line', { x1: L, x2: R, y1: B, y2: B, stroke: 'currentColor', 'stroke-opacity': 0.5 }, g);
    svg('text', { x: (L + R) / 2, y: B + 28, 'font-size': 10, 'text-anchor': 'middle', fill: 'currentColor' }, g).textContent = xlabel;
    svg('text', { x: L - 5, y: T - 6, 'font-size': 10, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = ylabel;
    return { g: g, X: X, Y: Y, clampY: function (y) { return Math.max(T, Math.min(B, y)); }, clampX: function (x) { return Math.max(L, Math.min(R, x)); } };
  }
  function path(pts, F) {
    return pts.map(function (q, i) { return (i ? 'L' : 'M') + F.clampX(F.X(q[0])).toFixed(2) + ' ' + F.clampY(F.Y(q[1])).toFixed(2); }).join('');
  }
  function plotBox(parent, caption) {
    var box = el('div', { class: 'ra-pattern-cut' }, parent);
    el('p', {}, box, caption);
    var S = svg('svg', { viewBox: '0 0 320 210', role: 'img' }, box);
    return { S: S, title: svg('title', {}, S) };
  }
  function legend(S, x, y, items) {
    items.forEach(function (it, i) {
      var yy = y + 13 * i;
      svg('line', Object.assign({ x1: x, x2: x + 16, y1: yy - 3, y2: yy - 3 }, it[0]), S);
      svg('text', { x: x + 20, y: yy, 'font-size': 9.5, fill: 'currentColor' }, S).textContent = it[1];
    });
  }

  return { svg: svg, el: el, slider: slider, css: css, onTheme: onTheme, polarGrid: polarGrid, readout: readout, toggle: toggle,
    sig: sig, signed: signed, niceStep: niceStep, frame: frame, path: path, plotBox: plotBox, legend: legend };
})();
