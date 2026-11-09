/* Bending a photo on a canvas, shared by the photo figures of
 * "What makes us all look different?" (eigenface mixer, face growth slider).
 * The image is cut into a regular grid of triangles; each triangle is drawn with
 * the affine map from its place in the grid to its bent place.
 */
window.photoWarp = window.photoWarp || (function () {
  function grid(d) {
    var src = [], tris = [];
    for (var r = 0; r < d.ny; r++) for (var c = 0; c < d.nx; c++) src.push([c * d.step, r * d.step]);
    for (r = 0; r < d.ny - 1; r++) for (c = 0; c < d.nx - 1; c++) {
      var i = r * d.nx + c;
      tris.push([i, i + 1, i + d.nx], [i + 1, i + d.nx + 1, i + d.nx]);
    }
    return { src: src, tris: tris };
  }

  // Draw img (d.w x d.h) bent so that grid node n lands on Q[n].
  function draw(ctx, img, d, g, Q, dpr) {
    var P = g.src;
    // The unbent photo underneath covers any gap the bent edges leave.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(img, 0, 0, d.w, d.h);
    g.tris.forEach(function (t) {
      var s0 = P[t[0]], s1 = P[t[1]], s2 = P[t[2]], q0 = Q[t[0]], q1 = Q[t[1]], q2 = Q[t[2]];
      var den = (s1[0] - s0[0]) * (s2[1] - s0[1]) - (s2[0] - s0[0]) * (s1[1] - s0[1]);
      var a = ((q1[0] - q0[0]) * (s2[1] - s0[1]) - (q2[0] - q0[0]) * (s1[1] - s0[1])) / den;
      var c = ((q2[0] - q0[0]) * (s1[0] - s0[0]) - (q1[0] - q0[0]) * (s2[0] - s0[0])) / den;
      var b = ((q1[1] - q0[1]) * (s2[1] - s0[1]) - (q2[1] - q0[1]) * (s1[1] - s0[1])) / den;
      var e = ((q2[1] - q0[1]) * (s1[0] - s0[0]) - (q1[1] - q0[1]) * (s2[0] - s0[0])) / den;
      var tx = q0[0] - a * s0[0] - c * s0[1], ty = q0[1] - b * s0[0] - e * s0[1];
      // Clip to the bent triangle, grown by half a pixel to hide the seams.
      var cx = (q0[0] + q1[0] + q2[0]) / 3, cy = (q0[1] + q1[1] + q2[1]) / 3;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.beginPath();
      [q0, q1, q2].forEach(function (q, i) {
        var dx = q[0] - cx, dy = q[1] - cy, L = Math.hypot(dx, dy) || 1, k = (L + 0.6) / L;
        ctx[i ? 'lineTo' : 'moveTo'](cx + dx * k, cy + dy * k);
      });
      ctx.closePath();
      ctx.clip();
      ctx.transform(a, b, c, e, tx, ty);
      ctx.drawImage(img, 0, 0, d.w, d.h);
      ctx.restore();
    });
  }

  // Thin-plate spline through control points p[i] with displacements v[i];
  // returns f(x, y) -> [dx, dy]. lambda > 0 smooths (and copes with near-duplicates).
  function tps(p, v, lambda) {
    var n = p.length, m = n + 3, A = [], i, j;
    function U(dx, dy) { var r2 = dx * dx + dy * dy; return r2 > 0 ? 0.5 * r2 * Math.log(r2) : 0; }
    for (i = 0; i < m; i++) A.push(new Float64Array(m + 2));
    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) A[i][j] = U(p[i][0] - p[j][0], p[i][1] - p[j][1]);
      A[i][i] += lambda;
      A[i][n] = A[n][i] = 1; A[i][n + 1] = A[n + 1][i] = p[i][0]; A[i][n + 2] = A[n + 2][i] = p[i][1];
      A[i][m] = v[i][0]; A[i][m + 1] = v[i][1];
    }
    // Gaussian elimination with partial pivoting, two right-hand sides.
    for (var col = 0; col < m; col++) {
      var piv = col;
      for (i = col + 1; i < m; i++) if (Math.abs(A[i][col]) > Math.abs(A[piv][col])) piv = i;
      var tmp = A[col]; A[col] = A[piv]; A[piv] = tmp;
      for (i = 0; i < m; i++) {
        if (i === col || A[i][col] === 0) continue;
        var f = A[i][col] / A[col][col];
        for (j = col; j < m + 2; j++) A[i][j] -= f * A[col][j];
      }
    }
    var w = A.map(function (row, k) { return [row[m] / row[k], row[m + 1] / row[k]]; });
    return function (x, y) {
      var dx = w[n][0] + w[n + 1][0] * x + w[n + 2][0] * y, dy = w[n][1] + w[n + 1][1] * x + w[n + 2][1] * y;
      for (var k = 0; k < n; k++) { var u = U(x - p[k][0], y - p[k][1]); dx += w[k][0] * u; dy += w[k][1] * u; }
      return [dx, dy];
    };
  }

  function loadImage(src) {
    return new Promise(function (ok, no) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = no; im.src = src; });
  }
  return { grid: grid, draw: draw, tps: tps, loadImage: loadImage };
})();
