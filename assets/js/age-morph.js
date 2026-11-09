/* Age morph for "What makes us all look different?".
 * Six average faces, one per age group (0-2, 3-6, 7-9, 10-14, 15-19, 20-29), each
 * the average of about 150 front-facing FFHQ photos (FFHQ-Aging age labels), built by
 * content/what-makes-us-look-different/scripts/age_composites.py.
 * Between two groups: both averages are bent (thin-plate spline through their 68
 * landmarks) to the in-between landmark shape and cross-faded.
 */
(function () {
  var base = '/assets/', W = window.photoWarp;
  fetch(base + 'data/what-makes-us-look-different/age-composites.json').then(function (r) { return r.json(); })
    .then(function (d) {
      return Promise.all(d.groups.map(function (g) {
        return W.loadImage(base + 'images/what-makes-us-look-different/ages/' + g.image).then(function (im) { g.img = im; });
      })).then(function () { start(d); });
    })
    .catch(function (e) { console.error('am', e); document.getElementById('am-result').textContent = 'Could not load the face data.'; });

  function start(d) {
    var G = d.groups, grid = W.grid(d), age = document.getElementById('am-age'), out = document.getElementById('am-age-out');
    var cv = document.getElementById('am-canvas'), ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = d.w * dpr; cv.height = d.h * dpr;
    age.min = G[0].age; age.max = G[G.length - 1].age;
    var border = [];
    [0, d.w / 2, d.w].forEach(function (x) { [0, d.h / 2, d.h].forEach(function (y) { if (x !== d.w / 2 || y !== d.h / 2) border.push([x, y]); }); });
    // Grid nodes of group g bent so that its landmarks land on `to`.
    function bend(g, to) {
      var p = g.points.concat(border), v = g.points.map(function (q, i) { return [to[i][0] - q[0], to[i][1] - q[1]]; });
      border.forEach(function () { v.push([0, 0]); });
      var f = W.tps(p, v, 1);
      return grid.src.map(function (q) { var dq = f(q[0], q[1]); return [q[0] + dq[0], q[1] + dq[1]]; });
    }
    function draw() {
      var a = +age.value, i = 0;
      while (i < G.length - 2 && a > G[i + 1].age) i++;
      var A = G[i], B = G[i + 1], t = Math.max(0, Math.min(1, (a - A.age) / (B.age - A.age)));
      var mid = A.points.map(function (q, k) { return [q[0] + t * (B.points[k][0] - q[0]), q[1] + t * (B.points[k][1] - q[1])]; });
      ctx.globalAlpha = 1;
      W.draw(ctx, A.img, d, grid, bend(A, mid), dpr);
      if (t > 0) { ctx.globalAlpha = t; W.draw(ctx, B.img, d, grid, bend(B, mid), dpr); ctx.globalAlpha = 1; }
      out.textContent = a;
      var near = t < 0.5 ? A : B;
      document.getElementById('am-result').textContent = (t === 0 || t === 1)
        ? 'Average of ' + near.n + ' photos of people aged ' + near.label + '.'
        : 'In between the averages for ages ' + A.label + ' and ' + B.label + '.';
    }
    age.addEventListener('input', draw);
    var timer = null;
    document.getElementById('am-play').addEventListener('click', function () {
      if (timer) { clearInterval(timer); timer = null; return; }
      age.value = age.min; draw();
      timer = setInterval(function () {
        if (+age.value >= +age.max) { clearInterval(timer); timer = null; return; }
        age.value = +age.value + 0.5; draw();
      }, 120);
    });
    draw();
  }
})();
