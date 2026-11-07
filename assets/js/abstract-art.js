// Abstract portrait, drawn into an <svg viewBox="0 0 544 627">.
// Maroon disc: the self, tradition. Turmeric dry brush: the builder's hand.
// One ink line knots while it searches, then straightens and rests on a dot (seek not, find).
// A small indigo square: the off-balance rational counterweight.
// Colours come from --art-* CSS variables (fallbacks are the light palette), so the
// home page can follow the theme. drawAbstractArt(svg, { animate: true }) lets the pen
// trace the line once the figure scrolls into view, after opts.delay ms (default 500).
window.drawAbstractArt = function (svg, opts = {}) {
  const NS = 'http://www.w3.org/2000/svg';
  const el = (t, a, parent = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); parent.appendChild(e); return e; };
  let seed = 7; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pts = a => a.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
  const INK = 'var(--art-ink, #1f1b18)', MAROON = 'var(--art-maroon, rgb(120,0,0))',
        TURMERIC = 'var(--art-turmeric, rgb(226,158,38))', INDIGO = 'var(--art-indigo, rgb(36,52,104))';

  el('defs', {}).innerHTML = `
    <filter id="art-pigment" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="2" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="7" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="9" result="g"/>
      <feColorMatrix in="g" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.35 1.12" result="ga"/>
      <feComposite in="d" in2="ga" operator="in"/>
    </filter>`;

  // maroon disc
  el('circle', { cx: 360, cy: 228, r: 142, style: `fill:${MAROON}`, filter: 'url(#art-pigment)' });

  // dry brush: many bristles along one gentle curve, each with its own breaks and ends
  const g = el('g', { style: 'mix-blend-mode:var(--art-blend, multiply)' });
  const A = [22, 432], Cc = [270, 368], B = [530, 386], width = 64;
  for (let i = 0; i < 140; i++) {
    const off = (rnd() - .5) * width, t0 = rnd() * .08 + Math.abs(off) / width * .12, t1 = 1 - rnd() * .12 - Math.abs(off) / width * .2;
    const wob = rnd() * 6.28, path = [];
    for (let t = t0; t <= t1; t += .004) {
      const x = (1-t)*(1-t)*A[0] + 2*(1-t)*t*Cc[0] + t*t*B[0], y = (1-t)*(1-t)*A[1] + 2*(1-t)*t*Cc[1] + t*t*B[1];
      const dx = 2*(1-t)*(Cc[0]-A[0]) + 2*t*(B[0]-Cc[0]), dy = 2*(1-t)*(Cc[1]-A[1]) + 2*t*(B[1]-Cc[1]), L = Math.hypot(dx, dy);
      const o = off * (1 - .25 * Math.sin(Math.PI * t)) + 1.2 * Math.sin(wob + t * 9);
      path.push([x - dy / L * o, y + dx / L * o]);
    }
    const dash = rnd() < .55 ? `${40 + rnd() * 300} ${2 + rnd() * 14}` : 'none';
    el('path', { d: 'M' + pts(path), fill: 'none', style: `stroke:${TURMERIC}`, 'stroke-width': (.7 + rnd() * 2.6).toFixed(2), 'stroke-linecap': 'round',
                 'stroke-dasharray': dash, 'stroke-dashoffset': rnd() * 200, opacity: (.35 + rnd() * .55).toFixed(2) }, g);
  }

  // indigo square
  el('rect', { x: 74, y: 222, width: 52, height: 52, style: `fill:${INDIGO}`, transform: 'rotate(-7 100 248)', filter: 'url(#art-pigment)' });

  // the searching line: a pen that turns hard and unevenly (knots, switchbacks), drifting
  // after a slowly moving anchor; then it lets go and steers straight to the dot
  const noise = (n) => { const f = [...Array(n)].map(() => [.5 + rnd() * 3, rnd() * 6.28, rnd()]); return s => f.reduce((a, [w, p, m]) => a + m * Math.sin(w * s + p), 0) / f.reduce((a, q) => a + q[2], 0); };
  const rN = noise(4), kN = noise(5), tx = noise(6), ty = noise(6), wN = noise(4);
  const T = [318, 556], step = .7, line = [];
  let x = 92, y = 92, th = .3, dir = 1, s = 0;
  const K1 = 3600;                                                          // steps spent searching
  for (let k = 0; k < 9000; k++, s += step) {
    const u = Math.min(1, k / K1);
    const ax = 100 + 60 * u + 18 * Math.sin(u * 7), ay = 96 + 120 * u;     // where the knot drifts
    const r = 4 + 15 * (.5 + .5 * rN(s / 70)) ** 1.5;                      // loop radius wanders
    if (rnd() < .0025) dir = -dir;                                         // switchback
    let kappa;
    if (k < K1) {
      const toA = Math.atan2(ay - y, ax - x), far = Math.hypot(ax - x, ay - y);
      const pull = Math.atan2(Math.sin(toA - th), Math.cos(toA - th)) * Math.min(1, far / 30) * .09;
      kappa = dir / r + .06 * kN(s / 25) + pull;
    } else {
      const toT = Math.atan2(T[1] - y, T[0] - x);
      const calm = Math.min(1, (k - K1) / 260);
      kappa = (1 - calm) * (dir / (r * 2) + .05 * kN(s / 25)) + calm * Math.atan2(Math.sin(toT - th), Math.cos(toT - th)) * .045 + .004 * kN(s / 60);
      if (Math.hypot(T[0] - x, T[1] - y) < 4) break;
    }
    th += kappa * step; x += step * Math.cos(th); y += step * Math.sin(th);
    const shake = .6 * (1 - .7 * Math.min(1, Math.max(0, (k - K1) / 800))); // hand tremor, calmer at the end
    line.push([x + shake * tx(s / 4), y + shake * ty(s / 4)]);
  }

  // pen pressure: short overlapping pieces of varying weight, all under one mask
  // that the animation sweeps along the line
  const animate = opts.animate && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pen = el('g', {});
  for (let i = 0; i < line.length - 1; i += 30) {
    const seg = line.slice(i, i + 32), wgt = 1.1 + .9 * (.5 + .5 * wN(i / 120));
    el('path', { d: 'M' + pts(seg), fill: 'none', style: `stroke:${INK}`, 'stroke-width': wgt.toFixed(2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .92 }, pen);
  }
  const dot = el('circle', { cx: T[0], cy: T[1], r: 5, style: `fill:${INK}` });
  if (!animate) return;

  const mask = el('mask', { id: 'art-reveal', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 544, height: 627 });
  const trace = el('path', { d: 'M' + pts(line), fill: 'none', stroke: '#fff', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
                             pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, mask);
  pen.setAttribute('mask', 'url(#art-reveal)');
  dot.style.opacity = 0;
  new IntersectionObserver((entries, io) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    trace.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay: opts.delay ?? 500, duration: 6000, easing: 'cubic-bezier(.35,.1,.45,1)', fill: 'forwards' })
      .finished.then(() => dot.animate([{ opacity: 0, r: 1 }, { opacity: 1, r: 5 }], { duration: 400, easing: 'ease-out', fill: 'forwards' }));
  }, { threshold: .4 }).observe(svg);
};
