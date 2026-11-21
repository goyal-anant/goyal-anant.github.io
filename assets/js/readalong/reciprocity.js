// reciprocity: Balanis §3.8, Lorentz reciprocity and Rumsey's reaction on three examples. Lengths in wavelengths.
// case=link: two parallel thin dipoles (lengths l1, l2, side by side at spacing d, antenna 2 raised by h), sinusoidal
//   currents, induced EMF (Balanis 8-55b, 8-66, 8-68). Z21 is the reaction of antenna 1's field on antenna 2's current,
//   Z12 the other way round; they are two different integrals and come out equal. Self impedances the same way on the
//   wire's own surface (radius a), which reproduces (8-60a,b) and (8-61a,b). Conjugate-matched ends give the power
//   ratio of (3-72) both ways, against Friis with the directivity of each dipole towards the other.
// case=faraday: two linear antennas facing each other through a slab that turns the polarization by Omega. A magnetized
//   (Faraday) slab turns it the same way in absolute terms whichever way the wave goes; a chiral (twisted) slab turns it
//   the same way relative to the wave's own direction. Power coupled is cos^2 of the angle mismatch on arrival.
// case=solver: thin-wire moment method (mixed potential, triangle basis, delta gap, reduced kernel) for two unequal
//   wires. Galerkin testing gives a symmetric matrix and Z12 = Z21 exactly; pulse testing with unequal segment lengths
//   does not, and the gap falls as the mesh is refined: reciprocity as a check on the numbers.
// Markup from _includes/readalong/reciprocity.html; helpers from readalong.js (window.RA).
// The maths at the top has no DOM and is also run under node by content/balanis/checks/reciprocity.py.
(function () {
  var PI = Math.PI, K = 2 * PI, ETA = 376.730313, node = typeof module !== 'undefined';

  // ---- quadrature --------------------------------------------------------------------------------------------------
  // Gauss–Legendre nodes and weights on [-1, 1] by Newton on P_n
  var GL = {};
  function gauss(n) {
    if (GL[n]) return GL[n];
    var x = [], w = [];
    for (var i = 0; i < n; i++) {
      var z = Math.cos(PI * (i + 0.75) / (n + 0.5)), pp = 0;
      for (var it = 0; it < 100; it++) {
        var p1 = 1, p2 = 0;
        for (var j = 0; j < n; j++) { var p3 = p2; p2 = p1; p1 = ((2 * j + 1) * z * p2 - j * p3) / (j + 1); }
        pp = n * (z * p1 - p2) / (z * z - 1);
        var dz = p1 / pp; z -= dz;
        if (Math.abs(dz) < 1e-15) break;
      }
      x.push(z); w.push(2 / ((1 - z * z) * pp * pp));
    }
    return (GL[n] = { x: x, w: w });
  }
  // integral of a complex function f(z) -> [re, im] over [lo, hi], split at the given break points and graded
  // geometrically towards every break (panels from 'fine' upward), 10-point rule per panel
  function integrate(f, lo, hi, breaks, fine) {
    var pts = [lo, hi];
    breaks.forEach(function (b) { if (b > lo + 1e-12 && b < hi - 1e-12) pts.push(b); });
    pts.sort(function (a, b) { return a - b; });
    var edges = [];
    for (var i = 0; i + 1 < pts.length; i++) {
      var a = pts[i], b = pts[i + 1], mid = (a + b) / 2, left = [], right = [];
      for (var s = fine; s < (b - a) / 2; s *= 2) { left.push(a + s); right.push(b - s); }
      edges.push(a); left.forEach(function (e) { edges.push(e); }); edges.push(mid); right.reverse().forEach(function (e) { edges.push(e); });
    }
    edges.push(hi);
    var g = gauss(10), re = 0, im = 0;
    for (var e = 0; e + 1 < edges.length; e++) {
      var c = (edges[e] + edges[e + 1]) / 2, h = (edges[e + 1] - edges[e]) / 2;
      if (h <= 0) continue;
      for (var q = 0; q < 10; q++) { var v = f(c + h * g.x[q]); re += h * g.w[q] * v[0]; im += h * g.w[q] * v[1]; }
    }
    return [re, im];
  }

  // ---- link: induced EMF -------------------------------------------------------------------------------------------
  // E_z of a centre-fed dipole of length l, centred at z = zc, maximum current 1, at distance rho and height z
  // (Balanis 8-55b): -j eta/4pi [e^-jkR1/R1 + e^-jkR2/R2 - 2 cos(kl/2) e^-jkr/r]
  function Ez(l, zc, rho, z) {
    var u = z - zc, R1 = Math.hypot(rho, u - l / 2), R2 = Math.hypot(rho, u + l / 2), r = Math.hypot(rho, u), c = 2 * Math.cos(K * l / 2);
    var re = Math.cos(K * R1) / R1 + Math.cos(K * R2) / R2 - c * Math.cos(K * r) / r;
    var im = -Math.sin(K * R1) / R1 - Math.sin(K * R2) / R2 + c * Math.sin(K * r) / r;
    var s = ETA / (4 * PI);
    return [s * im, -s * re];   // times -j
  }
  // the sinusoidal current of (8-58), maximum 1
  function Iz(l, zc, z) { var t = l / 2 - Math.abs(z - zc); return t > 0 ? Math.sin(K * t) : 0; }
  // impedance at the input terminals of 'rx' from the field of 'tx' (each {l, zc}), wires rho apart:
  // Z = -1/(I_tx(in) I_rx(in)) integral E_z,tx I_rx dz   (8-66), input currents sin(kl/2) (8-69)
  function reaction(tx, rx, rho, fine) {
    var v = integrate(function (z) { var e = Ez(tx.l, tx.zc, rho, z), i = Iz(rx.l, rx.zc, z); return [e[0] * i, e[1] * i]; },
      rx.zc - rx.l / 2, rx.zc + rx.l / 2, [rx.zc, tx.zc, tx.zc - tx.l / 2, tx.zc + tx.l / 2], fine || Math.min(rho, 0.01) / 4);
    var n = -1 / (Math.sin(K * tx.l / 2) * Math.sin(K * rx.l / 2));
    return [n * v[0], n * v[1]];
  }
  var A_WIRE = 1e-3;   // wire radius for the self impedances
  function selfZ(l) { return reaction({ l: l, zc: 0 }, { l: l, zc: 0 }, A_WIRE); }
  // directivity of a sinusoidal dipole of length l in the direction theta from its axis
  function dirAt(l, th) {
    function U(t) { var s = Math.sin(t); if (s < 1e-9) return 0; var f = (Math.cos(K * l / 2 * Math.cos(t)) - Math.cos(K * l / 2)) / s; return f * f; }
    var n = 2000, sum = 0;
    for (var i = 0; i <= n; i++) { var t = PI * i / n, w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2; sum += w * U(t) * Math.sin(t); }
    var P = 2 * PI * sum * PI / n / 3;
    return 4 * PI * U(th) / P;
  }
  function cmul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
  function cadd(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function cdiv(p, q) { var d = q[0] * q[0] + q[1] * q[1]; return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; }
  function cabs(a) { return Math.hypot(a[0], a[1]); }
  // the two-port with a conjugate-matched generator at port s and a conjugate load at the other; returns
  // P_load / P_avail = 4 R_ss R_oo |I_o / V_g|^2, Balanis (3-72)
  function transfer(Z11, Z22, Z12, Z21, s) {
    var Zs = s === 1 ? Z11 : Z22, Zo = s === 1 ? Z22 : Z11, Zso = s === 1 ? Z12 : Z21, Zos = s === 1 ? Z21 : Z12;
    // [Zs + Zs*, Zso; Zos, Zo + Zo*] [Is; Io] = [1; 0]
    var a = [2 * Zs[0], 0], dd = [2 * Zo[0], 0];
    var det = cadd(cmul(a, dd), cmul([-Zso[0], -Zso[1]], Zos));
    var Io = cdiv([-Zos[0], -Zos[1]], det);
    return 4 * Zs[0] * Zo[0] * (Io[0] * Io[0] + Io[1] * Io[1]);
  }
  // everything for one layout: l1, l2, spacing d, antenna 2 raised by h
  function link(l1, l2, d, h) {
    var A = { l: l1, zc: 0 }, B = { l: l2, zc: h };
    var Z11 = selfZ(l1), Z22 = selfZ(l2), Z21 = reaction(A, B, d), Z12 = reaction(B, A, d);
    var r = Math.hypot(d, h), th = Math.atan2(d, h);
    var friis = dirAt(l1, th) * dirAt(l2, th) / Math.pow(4 * PI * r, 2);
    return { Z11: Z11, Z22: Z22, Z12: Z12, Z21: Z21, t12: transfer(Z11, Z22, Z12, Z21, 1), t21: transfer(Z11, Z22, Z12, Z21, 2), friis: friis, r: r, th: th };
  }

  // ---- faraday -----------------------------------------------------------------------------------------------------
  // polarization angle (degrees, measured looking from antenna 1 towards 2) after crossing a fraction f of the slab;
  // dir = +1 from 1 to 2 (starts at 0, antenna 1's angle), -1 from 2 to 1 (starts at psi, antenna 2's angle)
  function polAngle(medium, omega, psi, dir, f) {
    if (dir > 0) return omega * f;
    return psi + (medium === 'faraday' ? 1 : -1) * omega * f;
  }
  function coupling(medium, omega, psi) {
    var c = function (x) { var v = Math.cos(x * PI / 180); return v * v; };
    return { p12: c(psi - polAngle(medium, omega, psi, 1, 1)), p21: c(polAngle(medium, omega, psi, -1, 1)) };
  }

  // ---- solver: thin-wire moment method -----------------------------------------------------------------------------
  // wires: [{l, x, zc, n}], radius a. Unknowns are triangles on each wire's interior nodes; port at each wire's middle node.
  var MOM = { a: 0.002, wires: [{ l: 0.5, x: 0, zc: 0 }, { l: 0.3, x: 0.4, zc: 0.2 }] };
  // quadrature: 16 points on piece pairs closer than three piece lengths (the kernel peaks there), 6 elsewhere
  function mom(n1, n2, galerkin) {
    var a2 = MOM.a * MOM.a, segs = [], basis = [], ports = [];
    MOM.wires.forEach(function (w, wi) {
      var n = wi ? n2 : n1, z0 = w.zc - w.l / 2, dz = w.l / n, first = segs.length;
      for (var i = 0; i < n; i++) segs.push({ w: wi, x: w.x, a: z0 + i * dz, b: z0 + (i + 1) * dz });
      for (var j = 1; j < n; j++) basis.push({ w: wi, x: w.x, l: first + j - 1, r: first + j, zl: z0 + (j - 1) * dz, zc: z0 + j * dz, zr: z0 + (j + 1) * dz });
      ports.push(basis.length - (n - 1) + Math.floor((n - 1) / 2));   // the middle interior node (n even: the centre)
    });
    var gN = gauss(16), gF = gauss(6), N = basis.length;
    function rule(ca, xa, cb, xb, len) { return Math.hypot(ca - cb, xa - xb) < 3 * len ? gN : gF; }
    var Zr = new Float64Array(N * N), Zi = new Float64Array(N * N);
    function kern(z, x, zp, xp) { var R = Math.sqrt((z - zp) * (z - zp) + (x - xp) * (x - xp) + a2); return [Math.cos(K * R) / (4 * PI * R), -Math.sin(K * R) / (4 * PI * R)]; }
    // pieces of a triangle: [z_a, z_b, shape at z_a, shape at z_b] (linear), slope = (shape_b - shape_a)/(z_b - z_a)
    function pieces(b) { return [[b.zl, b.zc, 0, 1], [b.zc, b.zr, 1, 0]]; }
    var JKE = K * ETA, EJK = ETA / K;   // j omega mu = j k eta;  1/(j omega eps) = -j eta/k
    if (galerkin) {
      for (var m = 0; m < N; m++) for (var nn = m; nn < N; nn++) {
        var re = 0, im = 0;
        pieces(basis[m]).forEach(function (pt) {
          var st = (pt[3] - pt[2]) / (pt[1] - pt[0]), ht = (pt[1] - pt[0]) / 2, ct = (pt[0] + pt[1]) / 2;
          pieces(basis[nn]).forEach(function (ps) {
            var ss = (ps[3] - ps[2]) / (ps[1] - ps[0]), hs = (ps[1] - ps[0]) / 2, cs = (ps[0] + ps[1]) / 2;
            var g = rule(ct, basis[m].x, cs, basis[nn].x, 2 * Math.max(ht, hs)), gx = g.x, gw = g.w, nq = gx.length;
            for (var i = 0; i < nq; i++) {
              var zt = ct + ht * gx[i], ft = pt[2] + st * (zt - pt[0]);
              for (var j = 0; j < nq; j++) {
                var zs = cs + hs * gx[j], fs = ps[2] + ss * (zs - ps[0]), G = kern(zt, basis[m].x, zs, basis[nn].x), w = ht * hs * gw[i] * gw[j];
                // j k eta ft fs G  -  j (eta/k) st ss G
                var cA = JKE * ft * fs - EJK * st * ss;
                re += -w * cA * G[1]; im += w * cA * G[0];
              }
            }
          });
        });
        Zr[m * N + nn] = Zr[nn * N + m] = re; Zi[m * N + nn] = Zi[nn * N + m] = im;
      }
    } else {
      // pulse testing: the pulse runs from the middle of the triangle's left segment to the middle of its right one;
      // <E, pulse> ~ A_z at the node times the pulse length, plus phi at the two pulse ends
      for (var m2 = 0; m2 < N; m2++) {
        var bm = basis[m2], zA = (bm.zl + bm.zc) / 2, zB = (bm.zc + bm.zr) / 2, len = zB - zA;
        for (var n2_ = 0; n2_ < N; n2_++) {
          var re2 = 0, im2 = 0;
          pieces(basis[n2_]).forEach(function (ps) {
            var ss = (ps[3] - ps[2]) / (ps[1] - ps[0]), hs = (ps[1] - ps[0]) / 2, cs = (ps[0] + ps[1]) / 2;
            var g = rule(bm.zc, bm.x, cs, basis[n2_].x, Math.max(2 * hs, len)), gx = g.x, gw = g.w, nq = gx.length;
            for (var j = 0; j < nq; j++) {
              var zs = cs + hs * gx[j], fs = ps[2] + ss * (zs - ps[0]), w = hs * gw[j], xs = basis[n2_].x;
              var GA = kern(bm.zc, bm.x, zs, xs), G1 = kern(zB, bm.x, zs, xs), G0 = kern(zA, bm.x, zs, xs);
              // j k eta fs GA len  +  j (eta/k) ss (G(zB) - G(zA))
              re2 += -w * (JKE * fs * len * GA[1] + EJK * ss * (G1[1] - G0[1]));
              im2 += w * (JKE * fs * len * GA[0] + EJK * ss * (G1[0] - G0[0]));
            }
          });
          Zr[m2 * N + n2_] = re2; Zi[m2 * N + n2_] = im2;
        }
      }
    }
    // solve for each port driven with 1 V, the other port shorted: columns of the 2 x 2 Y, then Z = Y^-1
    var Y = [[null, null], [null, null]], currents = [];
    ports.forEach(function (p, c) {
      var br = new Float64Array(N), bi = new Float64Array(N); br[p] = 1;
      var x = solve(Zr.slice(), Zi.slice(), br, bi, N);
      currents.push(x);
      Y[0][c] = [x.re[ports[0]], x.im[ports[0]]]; Y[1][c] = [x.re[ports[1]], x.im[ports[1]]];
    });
    var det = cadd(cmul(Y[0][0], Y[1][1]), cmul([-Y[0][1][0], -Y[0][1][1]], Y[1][0]));
    var Zp = { Z11: cdiv(Y[1][1], det), Z22: cdiv(Y[0][0], det), Z12: cdiv([-Y[0][1][0], -Y[0][1][1]], det), Z21: cdiv([-Y[1][0][0], -Y[1][0][1]], det) };
    var asym = 0, big = 0;
    for (var p1 = 0; p1 < N * N; p1++) {
      var r1 = Math.floor(p1 / N), c1 = p1 % N, t = (c1 * N + r1);
      asym = Math.max(asym, Math.hypot(Zr[p1] - Zr[t], Zi[p1] - Zi[t])); big = Math.max(big, Math.hypot(Zr[p1], Zi[p1]));
    }
    Zp.gap = cabs([Zp.Z12[0] - Zp.Z21[0], Zp.Z12[1] - Zp.Z21[1]]) / cabs(Zp.Z12);
    Zp.matrixAsym = asym / big; Zp.basis = basis; Zp.ports = ports; Zp.currents = currents; Zp.N = N;
    return Zp;
  }
  // complex Gaussian elimination with partial pivoting, in place
  function solve(Ar, Ai, br, bi, N) {
    for (var c = 0; c < N; c++) {
      var piv = c, best = 0;
      for (var r = c; r < N; r++) { var v = Ar[r * N + c] * Ar[r * N + c] + Ai[r * N + c] * Ai[r * N + c]; if (v > best) { best = v; piv = r; } }
      if (piv !== c) {
        for (var k = 0; k < N; k++) {
          var t = Ar[c * N + k]; Ar[c * N + k] = Ar[piv * N + k]; Ar[piv * N + k] = t;
          t = Ai[c * N + k]; Ai[c * N + k] = Ai[piv * N + k]; Ai[piv * N + k] = t;
        }
        var u = br[c]; br[c] = br[piv]; br[piv] = u; u = bi[c]; bi[c] = bi[piv]; bi[piv] = u;
      }
      var pr = Ar[c * N + c], pi = Ai[c * N + c], pd = pr * pr + pi * pi;
      for (var r2 = c + 1; r2 < N; r2++) {
        var xr = Ar[r2 * N + c], xi = Ai[r2 * N + c];
        if (xr === 0 && xi === 0) continue;
        var fr = (xr * pr + xi * pi) / pd, fi = (xi * pr - xr * pi) / pd;
        for (var k2 = c; k2 < N; k2++) {
          var ar = Ar[c * N + k2], ai = Ai[c * N + k2];
          Ar[r2 * N + k2] -= fr * ar - fi * ai; Ai[r2 * N + k2] -= fr * ai + fi * ar;
        }
        br[r2] -= fr * br[c] - fi * bi[c]; bi[r2] -= fr * bi[c] + fi * br[c];
      }
    }
    var xr2 = new Float64Array(N), xi2 = new Float64Array(N);
    for (var r3 = N - 1; r3 >= 0; r3--) {
      var sr = br[r3], si = bi[r3];
      for (var k3 = r3 + 1; k3 < N; k3++) { sr -= Ar[r3 * N + k3] * xr2[k3] - Ai[r3 * N + k3] * xi2[k3]; si -= Ar[r3 * N + k3] * xi2[k3] + Ai[r3 * N + k3] * xr2[k3]; }
      var dr = Ar[r3 * N + r3], di = Ai[r3 * N + r3], dd = dr * dr + di * di;
      xr2[r3] = (sr * dr + si * di) / dd; xi2[r3] = (si * dr - sr * di) / dd;
    }
    return { re: xr2, im: xi2 };
  }
  // meshes the solver case steps through: segments on the long wire, and on the short one at 0.35 of that
  var MESHES = [10, 14, 20, 28, 40, 56, 80, 113, 160].map(function (n) { return [n, Math.round(0.35 * n)]; });

  var api = { Ez: Ez, Iz: Iz, reaction: reaction, selfZ: selfZ, dirAt: dirAt, transfer: transfer, link: link,
    polAngle: polAngle, coupling: coupling, mom: mom, MOM: MOM, MESHES: MESHES, A_WIRE: A_WIRE };
  if (node) { module.exports = api; return; }

  // ---- drawing -----------------------------------------------------------------------------------------------------
  var RA = window.RA, svg = RA.svg, sig = RA.sig, C0 = 299792458;
  function dB(x) { return 10 * Math.log10(x); }
  function fz(z, n) { n = n || 3; return sig(z[0], n) + (z[1] < 0 ? ' − j' : ' + j') + sig(Math.abs(z[1]), n) + ' Ω'; }
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
  // A Play/Pause button driving draw(t) with t in seconds; pauses off-screen and in hidden tabs, and with reduced
  // motion starts only on request. autoplay: start when first seen.
  function player(parent, root, draw, autoplay) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var st = { run: false, t: 0, last: null, visible: false, seen: false };
    var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, parent, 'Play');
    function tick(ts) {
      if (!st.run) return;
      if (st.visible && !document.hidden) { if (st.last != null) { st.t += Math.min(0.1, (ts - st.last) / 1000); draw(st.t); } st.last = ts; }
      else st.last = null;
      requestAnimationFrame(tick);
    }
    function set(on) {
      st.run = on; st.last = null; b.textContent = on ? 'Pause' : 'Play'; b.setAttribute('aria-pressed', String(on));
      if (on) requestAnimationFrame(tick);
    }
    b.addEventListener('click', function () { set(!st.run); });
    if (reduce) b.title = 'Animation: starts only on request';
    if (window.IntersectionObserver) new IntersectionObserver(function (es) {
      st.visible = es[0].isIntersecting;
      if (st.visible && !st.seen) { st.seen = true; if (autoplay && !reduce) set(true); }
    }).observe(root);
    else st.visible = true;
    return { t: function () { return st.t; } };
  }

  function init(root) {
    var d = root.dataset;
    root.textContent = '';
    ({ faraday: faradayCase, solver: solverCase }[d.case] || linkCase)(root, d);
  }

  // ---- link --------------------------------------------------------------------------------------------------------
  function linkCase(root, d) {
    var st = { lg: Math.log10(+(d.d || 0.5)), l2: +(d.l2 || 0.5), h: +(d.h || 0), tx: 1 }, L1 = 0.5;
    var box = RA.el('div', { class: 'ra-controls' }, root);
    var dIn = RA.slider(box, { label: 'Spacing <i>d</i>', min: -1, max: 1, step: 0.0005, value: st.lg,
      fmt: function (v) { return sig(Math.pow(10, v), 3) + ' λ'; }, onInput: function (v) { st.lg = v; update(false); } });
    var lIn = RA.slider(box, { label: 'Length of antenna 2', min: 0.1, max: 0.9, step: 0.01, value: st.l2,
      fmt: function (v) { return v.toFixed(2) + ' λ'; }, onInput: function (v) { st.l2 = v; update(true); } });
    var hIn = RA.slider(box, { label: 'Antenna 2 raised by <i>h</i>', min: 0, max: 1, step: 0.01, value: st.h,
      fmt: function (v) { return v.toFixed(2) + ' λ'; }, onInput: function (v) { st.h = v; update(true); } });
    var row = RA.el('div', { class: 'ra-controls' }, root);
    var paintTx = RA.toggle(row, 'Which one transmits', [[1, '1 transmits, 2 receives'], [2, '2 transmits, 1 receives']], function () { return st.tx; },
      function (v) { st.tx = v; update(false); });
    var PRE = [['Two Wi-Fi dipoles, 6.1 cm apart', 0.5, 0.5, 0], ['Unequal and staggered', 0.4, 0.3, 0.2], ['Far apart, 5 λ', 5, 0.5, 0]];
    var paintPre = presets(root, PRE, function (p) {
      st.lg = Math.log10(p[1]); st.l2 = p[2]; st.h = p[3];
      setSlider(dIn, st.lg, sig(p[1], 3) + ' λ'); setSlider(lIn, p[2], p[2].toFixed(2) + ' λ'); setSlider(hIn, p[3], p[3].toFixed(2) + ' λ');
      update(true);
    }, function (p) { return Math.abs(st.lg - Math.log10(p[1])) < 1e-4 && Math.abs(st.l2 - p[2]) < 1e-9 && Math.abs(st.h - p[3]) < 1e-9; });

    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var A = RA.plotBox(stage, 'Side view, to scale');
    var B = RA.plotBox(stage, 'Power delivered, against spacing');
    var uid = 'ra-rec-' + Math.random().toString(36).slice(2, 7);
    var clip = svg('clipPath', { id: uid }, svg('defs', {}, A.S));
    svg('rect', { x: 6, y: 6, width: 308, height: 198 }, clip);
    var waves = svg('g', { 'clip-path': 'url(#' + uid + ')' }, A.S), ants = svg('g', {}, A.S), labels = svg('g', {}, A.S);
    var scaleTxt = svg('text', { x: 312, y: 200, 'font-size': 9.5, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.7 }, A.S);
    var lx = [0.1, 0.2, 0.5, 1, 2, 5, 10];
    var FB = RA.frame(B.S, [0.1, 10], [-50, 0], lx, [-50, -40, -30, -20, -10, 0], 'spacing d (λ)', 'dB', String,
      function (y) { return y < 0 ? '−' + (-y) : String(y); }, true, false);
    var sty12 = { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.4 }, sty21 = { fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' };
    var styF = { fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.7, 'stroke-width': 1.2, 'stroke-dasharray': '1.5 2.5' };
    var c12 = svg('path', sty12, B.S), c21 = svg('path', sty21, B.S), cF = svg('path', styF, B.S);
    RA.legend(B.S, 196, 40, [[sty12, '1 → 2'], [sty21, '2 → 1'], [styF, 'Friis']]);
    var pLine = svg('line', { y1: 24, y2: 176, stroke: 'currentColor', 'stroke-opacity': 0.5, 'stroke-dasharray': '2 2' }, B.S);
    var pDot = svg('circle', { r: 3.5, fill: 'var(--accent)' }, B.S);
    A.title.textContent = 'Two parallel dipoles side by side, drawn to scale, with wavefronts leaving the one that transmits and the induced current on the other.';
    B.title.textContent = 'Power delivered to the receiver as a share of the power available from the generator, both ways, against spacing, with the Friis estimate.';
    var rows = RA.readout(RA.el('div', {}, root), [['z11', 'Self impedance <i>Z</i><sub>11</sub>, <i>Z</i><sub>22</sub> (at the feeds)'],
      ['z21', '<i>Z</i><sub>21</sub>: field of 1 on the current of 2'], ['z12', '<i>Z</i><sub>12</sub>: field of 2 on the current of 1'],
      ['gap', '|<i>Z</i><sub>21</sub> − <i>Z</i><sub>12</sub>| / |<i>Z</i><sub>21</sub>|'], ['p', 'Power delivered, 1 → 2 and 2 → 1'],
      ['f', 'Friis, with each one\'s directivity towards the other'], ['r', 'Spacing at 2.45 GHz']]);
    var cur = null, selfCache = {};
    function self(l) { var key = l.toFixed(3); return selfCache[key] || (selfCache[key] = selfZ(l)); }
    function linkAt(dd) {
      var A1 = { l: L1, zc: 0 }, B2 = { l: st.l2, zc: st.h }, Z11 = self(L1), Z22 = self(st.l2);
      var Z21 = reaction(A1, B2, dd), Z12 = reaction(B2, A1, dd), r = Math.hypot(dd, st.h), th = Math.atan2(dd, st.h);
      return { Z11: Z11, Z22: Z22, Z21: Z21, Z12: Z12, t12: transfer(Z11, Z22, Z12, Z21, 1), t21: transfer(Z11, Z22, Z12, Z21, 2),
        friis: dirAt(L1, th) * dirAt(st.l2, th) / Math.pow(4 * PI * r, 2) };
    }
    function curves() {
      var p12 = [], p21 = [], pf = [];
      for (var i = 0; i <= 120; i++) {
        var dd = Math.pow(10, -1 + 2 * i / 120), q = linkAt(dd);
        p12.push([dd, dB(q.t12)]); p21.push([dd, dB(q.t21)]); pf.push([dd, dB(q.friis)]);
      }
      c12.setAttribute('d', RA.path(p12, FB)); c21.setAttribute('d', RA.path(p21, FB)); cF.setAttribute('d', RA.path(pf, FB));
    }
    function scene(t) {
      var dd = Math.pow(10, st.lg), top = Math.max(L1 / 2, st.h + st.l2 / 2), bot = Math.min(-L1 / 2, st.h - st.l2 / 2);
      var sc = Math.min(220 / (dd + 0.6), 150 / (top - bot + 0.3)), x1 = 160 - sc * dd / 2, x2 = 160 + sc * dd / 2, zc = 105 + sc * (top + bot) / 2;
      var Y = function (z) { return zc - sc * z; };
      var src = st.tx === 1 ? [x1, Y(0)] : [x2, Y(st.h)], ph = (t || 0) % 1;
      while (waves.firstChild) waves.removeChild(waves.firstChild);
      for (var n = 0; n < 200; n++) {
        var rr = (n + ph) * sc / 4;   // a wavefront every quarter wavelength, moving out at one wavelength a second
        if (rr > 420) break;
        if (rr < 3) continue;
        svg('circle', { cx: src[0], cy: src[1], r: rr, fill: 'none', stroke: 'var(--accent)', 'stroke-opacity': (n % 2 ? 0.18 : 0.5) * Math.min(1, 60 / (rr + 20)) + 0.08, 'stroke-width': n % 2 ? 0.8 : 1.2 }, waves);
      }
      while (ants.firstChild) ants.removeChild(ants.firstChild);
      // each dipole: its wire, and its current envelope sin(k(l/2 - |z|)) swinging at the drive frequency
      var q = cur, rxAmp = Math.sqrt(st.tx === 1 ? q.t12 : q.t21);
      [[x1, 0, L1, 1], [x2, st.h, st.l2, 2]].forEach(function (a) {
        var isTx = a[3] === st.tx, amp = (isTx ? 1 : Math.min(1, 3 * rxAmp)) * Math.cos(2 * PI * ph), pts = [], w = 9;
        for (var i = 0; i <= 40; i++) { var z = -a[2] / 2 + a[2] * i / 40; pts.push([a[0] + w * amp * Math.sin(K * (a[2] / 2 - Math.abs(z))), Y(a[1] + z)]); }
        for (var j = 40; j >= 0; j--) { var z2 = -a[2] / 2 + a[2] * j / 40; pts.push([a[0] - w * amp * Math.sin(K * (a[2] / 2 - Math.abs(z2))), Y(a[1] + z2)]); }
        svg('path', { d: 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z', fill: isTx ? 'var(--accent)' : 'var(--ra-warm)', 'fill-opacity': 0.28 }, ants);
        svg('line', { x1: a[0], x2: a[0], y1: Y(a[1] + a[2] / 2), y2: Y(a[1] - a[2] / 2), stroke: 'currentColor', 'stroke-width': 2 }, ants);
        svg('rect', { x: a[0] - 2.5, y: Y(a[1]) - 2.5, width: 5, height: 5, fill: 'var(--bg)', stroke: 'currentColor', 'stroke-width': 1 }, ants);
      });
      while (labels.firstChild) labels.removeChild(labels.firstChild);
      [[x1, Y(L1 / 2), '1'], [x2, Y(st.h + st.l2 / 2), '2']].forEach(function (a) {
        svg('text', { x: a[0], y: a[1] - 6, 'font-size': 11, 'text-anchor': 'middle', fill: 'currentColor', 'font-weight': 600 }, labels).textContent = a[2];
      });
      scaleTxt.textContent = 'wavefronts λ/4 apart · ' + (st.tx === 1 ? '1' : '2') + ' transmits';
    }
    var anim = null;
    function update(redoCurves) {
      var dd = Math.pow(10, st.lg);
      cur = linkAt(dd);
      if (redoCurves) curves();
      var x = FB.X(dd); pLine.setAttribute('x1', x); pLine.setAttribute('x2', x);
      pDot.setAttribute('cx', x); pDot.setAttribute('cy', FB.clampY(FB.Y(dB(st.tx === 1 ? cur.t12 : cur.t21))));
      pDot.setAttribute('fill', st.tx === 1 ? 'var(--accent)' : 'var(--ra-warm)');
      rows.z11.td.textContent = fz(cur.Z11) + '; ' + fz(cur.Z22);
      rows.z21.td.textContent = fz(cur.Z21); rows.z12.td.textContent = fz(cur.Z12);
      var g = Math.hypot(cur.Z21[0] - cur.Z12[0], cur.Z21[1] - cur.Z12[1]) / Math.hypot(cur.Z21[0], cur.Z21[1]);
      rows.gap.td.textContent = g < 1e-9 ? 'below 10⁻⁹' : g.toExponential(1);
      rows.p.td.textContent = dB(cur.t12).toFixed(2) + ' dB and ' + dB(cur.t21).toFixed(2) + ' dB';
      rows.f.td.textContent = dB(cur.friis).toFixed(2) + ' dB';
      rows.r.td.textContent = sig(dd * C0 / 2.45e9 * 100, 3) + ' cm between the wires';
      paintTx(); paintPre(); scene(anim ? anim.t() : 0);
    }
    anim = player(row, root, function (t) { scene(t); }, true);
    update(true);
  }

  // ---- faraday -----------------------------------------------------------------------------------------------------
  function faradayCase(root, d) {
    var st = { medium: d.medium || 'faraday', om: +(d.omega || 45), psi: +(d.psi || 45), dir: 1 };
    var box = RA.el('div', { class: 'ra-controls' }, root);
    var paintMed = RA.toggle(box, 'Slab', [['faraday', 'Magnetized ferrite (Faraday)'], ['chiral', 'Twisted (chiral) medium']], function () { return st.medium; },
      function (v) { st.medium = v; update(); });
    var oIn = RA.slider(box, { label: 'Rotation in the slab <i>Ω</i>', min: 0, max: 90, step: 0.5, value: st.om,
      fmt: function (v) { return v.toFixed(1) + '°'; }, onInput: function (v) { st.om = v; update(); } });
    var pIn = RA.slider(box, { label: 'Antenna 2 tilted by <i>ψ</i>', min: 0, max: 90, step: 0.5, value: st.psi,
      fmt: function (v) { return v.toFixed(1) + '°'; }, onInput: function (v) { st.psi = v; update(); } });
    var row = RA.el('div', { class: 'ra-controls' }, root);
    var paintDir = RA.toggle(row, 'Direction', [[1, 'Send 1 → 2'], [-1, 'Send 2 → 1']], function () { return st.dir; }, function (v) { st.dir = v; update(); });
    var PRE = [['No rotation', 'faraday', 0, 45], ['Faraday, 22.5°', 'faraday', 22.5, 45], ['Isolator: Faraday, 45°', 'faraday', 45, 45], ['Chiral, 45°', 'chiral', 45, 45]];
    var paintPre = presets(root, PRE, function (p) {
      st.medium = p[1]; st.om = p[2]; st.psi = p[3]; setSlider(oIn, p[2], p[2].toFixed(1) + '°'); setSlider(pIn, p[3], p[3].toFixed(1) + '°'); update();
    }, function (p) { return st.medium === p[1] && Math.abs(st.om - p[2]) < 1e-9 && Math.abs(st.psi - p[3]) < 1e-9; });

    var stage = RA.el('div', { class: 'ra-pattern-stage', style: 'grid-template-columns: 1fr' }, root);
    var A = RA.plotBox(stage, 'The wave between the two antennas (oblique view)');
    A.S.setAttribute('viewBox', '0 0 320 150'); A.S.setAttribute('style', 'width: 100%; max-width: 640px');
    // oblique projection: z runs left to right; in the transverse plane, 'up' is up and 'across' leans back to the right
    var Z0 = 34, Z1 = 286, S0 = 120, S1 = 200, AX = 80, AMP = 34;
    function P(z, a, r) { var rad = a * PI / 180; return [z + 0.42 * r * Math.sin(rad), AX - r * Math.cos(rad)]; }
    var slab = svg('g', {}, A.S), ribbon = svg('g', {}, A.S), ends = svg('g', {}, A.S);
    svg('line', { x1: Z0, x2: Z1, y1: AX, y2: AX, stroke: 'currentColor', 'stroke-opacity': 0.35 }, A.S);
    var slabTxt = svg('text', { x: (S0 + S1) / 2 + 9, y: 141, 'font-size': 7, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.8 }, A.S);
    var bars = RA.el('div', { class: 'ra-bars' }, root);
    function bar(label) {
      var r = RA.el('div', { style: 'display: grid; grid-template-columns: 6.5em 1fr 10.5em; gap: 0.5em; align-items: center; margin: 0.2em 0' }, bars);
      RA.el('span', {}, r, label);
      var track = RA.el('span', { style: 'height: 0.8em; background: color-mix(in srgb, currentColor 12%, transparent); border-radius: 3px; overflow: hidden' }, r);
      var fill = RA.el('span', { style: 'display: block; height: 100%; width: 0' }, track);
      var out = RA.el('span', { style: 'font-variant-numeric: tabular-nums' }, r);
      return { fill: fill, out: out };
    }
    var b12 = bar('Power 1 → 2'), b21 = bar('Power 2 → 1');
    b12.fill.style.background = 'var(--accent)'; b21.fill.style.background = 'var(--ra-warm)';
    var rows = RA.readout(RA.el('div', {}, root), [['a2', 'Leaving 1 at 0°, arrives at 2 at'], ['a1', 'Leaving 2 at <i>ψ</i>, arrives at 1 at']]);
    A.title.textContent = 'A wave between two linear antennas, drawn as its electric field at many points along the path; the field turns inside the slab.';
    function ant(z, ang, col) {
      var e = svg('ellipse', { cx: z, cy: AX, rx: 0.42 * 42, ry: 42, fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.25 }, ends);
      var a = P(z, ang, 40), b = P(z, ang, -40);
      svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: col, 'stroke-width': 3, 'stroke-linecap': 'round' }, ends);
      return e;
    }
    function scene(t) {
      var ph = (t || 0) % 1;
      while (ribbon.firstChild) ribbon.removeChild(ribbon.firstChild);
      var LAM = 42;   // drawn wavelength
      for (var z = Z0 + 3; z < Z1 - 2; z += 3) {
        var f = Math.min(1, Math.max(0, (st.dir > 0 ? z - S0 : S1 - z) / (S1 - S0)));
        var ang = polAngle(st.medium, st.om, st.psi, st.dir, f);
        // the wave moves in the direction of travel: phase 2 pi (t - s/lambda), s the path length from the sender
        var s = st.dir > 0 ? z - Z0 : Z1 - z, amp = AMP * Math.cos(2 * PI * (ph - s / LAM));
        var tip = P(z, ang, amp);
        svg('line', { x1: z, y1: AX, x2: tip[0], y2: tip[1], stroke: st.dir > 0 ? 'var(--accent)' : 'var(--ra-warm)', 'stroke-width': 1, 'stroke-opacity': 0.8 }, ribbon);
      }
    }
    function update() {
      while (slab.firstChild) slab.removeChild(slab.firstChild);
      // the slab as an oblique box: front face, top and far side
      var fillS = { fill: st.medium === 'faraday' ? 'currentColor' : 'var(--ra-warm)', stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-linejoin': 'round' };
      [['M' + S0 + ' 30L' + (S0 + 18) + ' 12L' + (S1 + 18) + ' 12L' + S1 + ' 30Z', 0.12], ['M' + S1 + ' 30L' + (S1 + 18) + ' 12L' + (S1 + 18) + ' 112L' + S1 + ' 130Z', 0.16],
        ['M' + S0 + ' 30L' + S1 + ' 30L' + S1 + ' 130L' + S0 + ' 130Z', 0.06]].forEach(function (f) { svg('path', Object.assign({ d: f[0], 'fill-opacity': f[1] }, fillS), slab); });
      slabTxt.textContent = st.medium === 'faraday' ? 'ferrite, magnetized along the path (B →)' : 'twisted medium (no bias field)';
      while (ends.firstChild) ends.removeChild(ends.firstChild);
      ant(Z0, 0, 'currentColor'); ant(Z1, st.psi, 'currentColor');
      svg('text', { x: Z0, y: 141, 'font-size': 8, 'text-anchor': 'middle', fill: 'currentColor', 'font-weight': 600 }, ends).textContent = '1';
      svg('text', { x: Z1, y: 141, 'font-size': 8, 'text-anchor': 'middle', fill: 'currentColor', 'font-weight': 600 }, ends).textContent = '2';
      var c = coupling(st.medium, st.om, st.psi);
      [[b12, c.p12], [b21, c.p21]].forEach(function (q) {
        q[0].fill.style.width = (100 * q[1]).toFixed(1) + '%';
        q[0].out.textContent = (100 * q[1]).toFixed(1) + '% (' + (q[1] < 1e-6 ? 'below −60' : dB(q[1]).toFixed(1)) + ' dB)';
      });
      var a2 = polAngle(st.medium, st.om, st.psi, 1, 1), a1 = polAngle(st.medium, st.om, st.psi, -1, 1);
      rows.a2.td.textContent = a2.toFixed(1) + '°, antenna 2 at ' + st.psi.toFixed(1) + '°';
      rows.a1.td.textContent = a1.toFixed(1) + '°, antenna 1 at 0°';
      paintMed(); paintDir(); paintPre(); scene(anim ? anim.t() : 0);
    }
    var anim = null;
    anim = player(row, root, function (t) { scene(t); }, true);
    update();
  }

  // ---- solver ------------------------------------------------------------------------------------------------------
  function solverCase(root, d) {
    var st = { i: +(d.mesh || 4), test: d.test || 'pulse' }, res = { galerkin: [], pulse: [] };
    var box = RA.el('div', { class: 'ra-controls' }, root);
    var mIn = RA.slider(box, { label: 'Mesh', min: 0, max: MESHES.length - 1, step: 1, value: st.i,
      fmt: function (v) { return MESHES[v][0] + ' and ' + MESHES[v][1] + ' segments'; }, onInput: function (v) { st.i = v; update(); } });
    var row = RA.el('div', { class: 'ra-controls' }, root);
    var paintTest = RA.toggle(row, 'Testing', [['galerkin', 'Galerkin'], ['pulse', 'Pulse']], function () { return st.test; }, function (v) { st.test = v; update(); });
    var stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    var A = RA.plotBox(stage, 'The two wires, the mesh and the current');
    var B = RA.plotBox(stage, 'How far apart Z12 and Z21 come out');
    var geo = svg('g', {}, A.S), cur = svg('g', {}, A.S);
    var FB = RA.frame(B.S, [8, 200], [1e-16, 1e-2], [10, 20, 50, 100, 200], [1e-16, 1e-13, 1e-10, 1e-7, 1e-4], 'segments on the long wire', 'gap', String,
      function (y) { return '10' + String(Math.round(Math.log10(y))).replace('-', '⁻').replace(/\d/g, function (c) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]; }); }, true, true);
    var styP = { fill: 'none', stroke: 'var(--ra-warm)', 'stroke-width': 1.6 }, styG = { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.6 };
    var styS = { fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.6, 'stroke-dasharray': '4 3' };
    var lineP = svg('path', styP, B.S), lineG = svg('path', styG, B.S), slope = svg('path', styS, B.S), dots = svg('g', {}, B.S);
    RA.legend(B.S, 200, 120, [[styP, 'pulse'], [styG, 'Galerkin'], [styS, '∝ 1/N²']]);
    A.title.textContent = 'Two parallel wires, 0.5 and 0.3 wavelengths long, 0.4 wavelengths apart, the short one raised by 0.2; tick marks show the segments, and the shaded band the current when wire 1 is driven.';
    B.title.textContent = 'Relative difference between Z12 and Z21 against the number of segments, log–log: pulse testing falls as one over N squared, Galerkin stays at rounding level.';
    var rows = RA.readout(RA.el('div', {}, root), [['z12', '<i>Z</i><sub>12</sub>'], ['z21', '<i>Z</i><sub>21</sub>'], ['gap', '|<i>Z</i><sub>12</sub> − <i>Z</i><sub>21</sub>| / |<i>Z</i><sub>12</sub>|'],
      ['mat', 'Largest |<i>Z<sub>mn</sub></i> − <i>Z<sub>nm</sub></i>| in the matrix, per its largest entry'], ['z11', '<i>Z</i><sub>11</sub>']]);
    // geometry, 320 x 210 box: x from -0.15 to 0.55 wavelengths, z from -0.3 to 0.4
    var sc = 260, X = function (x) { return 70 + sc * x; }, Y = function (z) { return 115 - sc * z; };
    function drawMesh() {
      while (geo.firstChild) geo.removeChild(geo.firstChild);
      var m = MESHES[st.i];
      MOM.wires.forEach(function (w, wi) {
        var n = m[wi], z0 = w.zc - w.l / 2;
        svg('line', { x1: X(w.x), x2: X(w.x), y1: Y(z0), y2: Y(z0 + w.l), stroke: 'currentColor', 'stroke-width': 1.6 }, geo);
        for (var i = 0; i <= n; i++) { var z = z0 + w.l * i / n; svg('line', { x1: X(w.x) - 3, x2: X(w.x) + 3, y1: Y(z), y2: Y(z), stroke: 'currentColor', 'stroke-width': 0.7, 'stroke-opacity': 0.7 }, geo); }
        svg('text', { x: X(w.x) - 8, y: Y(z0 + w.l) - 4, 'font-size': 11, 'font-weight': 600, fill: 'currentColor', 'text-anchor': 'middle' }, geo).textContent = String(wi + 1);
        svg('text', { x: X(w.x), y: Y(z0) + 14, 'font-size': 9.5, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.75 }, geo).textContent = w.l + ' λ, ' + n + ' segments';
      });
    }
    function drawCurrent(r, t) {
      while (cur.firstChild) cur.removeChild(cur.firstChild);
      if (!r) return;
      var x = r.currents[0], ph = 2 * PI * ((t || 0) % 1);
      MOM.wires.forEach(function (w, wi) {
        var big = 0;   // each wire on its own scale: the induced current on wire 2 is much smaller
        r.basis.forEach(function (b, k) { if (b.w === wi) big = Math.max(big, Math.hypot(x.re[k], x.im[k])); });
        var pts = [[w.zc - w.l / 2, 0]];
        r.basis.forEach(function (b, k) { if (b.w === wi) pts.push([b.zc, (x.re[k] * Math.cos(ph) - x.im[k] * Math.sin(ph)) / big]); });
        pts.push([w.zc + w.l / 2, 0]);
        var d1 = pts.map(function (p, k) { return (k ? 'L' : 'M') + (X(w.x) + 26 * p[1]).toFixed(1) + ' ' + Y(p[0]).toFixed(1); }).join('');
        svg('path', { d: d1 + 'L' + X(w.x) + ' ' + Y(pts[pts.length - 1][0]) + 'L' + X(w.x) + ' ' + Y(pts[0][0]) + 'Z', fill: wi ? 'var(--ra-warm)' : 'var(--accent)', 'fill-opacity': 0.3, stroke: wi ? 'var(--ra-warm)' : 'var(--accent)', 'stroke-width': 1 }, cur);
      });
    }
    function plot() {
      var lp = [], lg = [];
      while (dots.firstChild) dots.removeChild(dots.firstChild);
      MESHES.forEach(function (m, i) {
        [['pulse', lp, 'var(--ra-warm)'], ['galerkin', lg, 'var(--accent)']].forEach(function (q) {
          var r = res[q[0]][i];
          if (!r) return;
          var y = Math.max(1.5e-16, r.gap);
          q[1].push([m[0], y]);
          svg('circle', { cx: FB.X(m[0]), cy: FB.clampY(FB.Y(y)), r: i === st.i && q[0] === st.test ? 4.5 : 2.6, fill: q[2] }, dots);
        });
      });
      lineP.setAttribute('d', lp.length > 1 ? RA.path(lp, FB) : ''); lineG.setAttribute('d', lg.length > 1 ? RA.path(lg, FB) : '');
      var p0 = res.pulse[0];
      if (p0) {
        var a = [MESHES[0][0], p0.gap * 3], b = [160, p0.gap * 3 * Math.pow(MESHES[0][0] / 160, 2)];
        slope.setAttribute('d', RA.path([a, b], FB));
      }
    }
    var anim = null;
    function update() {
      var r = res[st.test][st.i];
      if (!r) { r = res[st.test][st.i] = mom(MESHES[st.i][0], MESHES[st.i][1], st.test === 'galerkin'); }
      drawMesh(); drawCurrent(r, anim ? anim.t() : 0); plot();
      rows.z12.td.textContent = fz(r.Z12, 4); rows.z21.td.textContent = fz(r.Z21, 4);
      rows.gap.td.textContent = r.gap < 1e-13 ? r.gap.toExponential(1) + ' (rounding)' : r.gap.toExponential(2);
      rows.mat.td.textContent = r.matrixAsym === 0 ? '0 (symmetric by construction)' : r.matrixAsym.toExponential(1);
      rows.z11.td.textContent = fz(r.Z11);
      paintTest();
    }
    // fill in every mesh for both testings, one at a time so the page stays responsive
    var queue = [];
    MESHES.forEach(function (m, i) { queue.push(['pulse', i], ['galerkin', i]); });
    function next() {
      var q = queue.shift();
      if (!q) return;
      if (!res[q[0]][q[1]]) res[q[0]][q[1]] = mom(MESHES[q[1]][0], MESHES[q[1]][1], q[0] === 'galerkin');
      plot();
      setTimeout(next, 30);
    }
    var started = false, lastStep = 0;
    anim = player(row, root, function (t) {
      // the current swings once a second; every 1.5 s the mesh steps finer, round and round
      if (t - lastStep > 1.5) { lastStep = t; st.i = (st.i + 1) % MESHES.length; setSlider(mIn, st.i, MESHES[st.i][0] + ' and ' + MESHES[st.i][1] + ' segments'); update(); }
      drawCurrent(res[st.test][st.i], t);
    }, false);
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; update(); setTimeout(next, 50); } }).observe(root);
    else { update(); next(); }
    drawMesh(); paintTest();
  }

  document.querySelectorAll('[data-widget="reciprocity"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
