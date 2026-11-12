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
  return { svg: svg, el: el, slider: slider, css: css, onTheme: onTheme, polarGrid: polarGrid };
})();
