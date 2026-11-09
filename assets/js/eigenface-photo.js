/* Photo eigenface mixer for "What makes us all look different?".
 * The average of the 102 neutral front photos of the Face Research Lab London Set
 * (DeBruine & Jones 2017, CC BY 4.0), bent to a new shape:
 * shape = average points + sum_k b_k * (component k, one standard deviation).
 * The grid nodes move with the components (smooth thin-plate-spline fields, one
 * per component); assets/js/photo-warp.js draws the bent photo. Data and image built by
 * content/what-makes-us-look-different/scripts/eigenfaces_photo.py.
 */
(function () {
  var base = '/assets/', img;
  var data = fetch(base + 'data/what-makes-us-look-different/eigenfaces-photo.json').then(function (r) { return r.json(); });
  var loaded = window.photoWarp.loadImage(base + 'images/what-makes-us-look-different/mean-face.jpg').then(function (im) { img = im; });
  Promise.all([data, loaded]).then(function (v) { start(v[0]); })
    .catch(function (e) { console.error('efp', e); document.getElementById('efp-result').textContent = 'Could not load the face data.'; });

  function start(d) {
    var K = d.comps.length, b = new Array(K).fill(0), inputs = [];
    var cv = document.getElementById('efp-canvas'), ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = d.w * dpr; cv.height = d.h * dpr;
    var box = document.getElementById('efp-sliders');
    for (var k = 0; k < K; k++) {
      var lab = document.createElement('label');
      lab.className = 'bc-slider';
      lab.innerHTML = 'Component ' + (k + 1) + ' (' + Math.round(d.frac[k] * 100) + '%) ' +
        '<input type="range" min="-3" max="3" step="0.1" value="0"> <output>0.0</output>';
      box.appendChild(lab);
      inputs.push(lab.querySelector('input'));
      inputs[k].addEventListener('input', read);
    }
    function read() {
      inputs.forEach(function (el, k) { b[k] = +el.value; el.nextElementSibling.textContent = b[k].toFixed(1); });
      draw();
    }
    function set(v) { inputs.forEach(function (el, k) { el.value = v[k]; }); read(); }
    var W = window.photoWarp, g = W.grid(d), N = g.src.length;
    function draw() {
      var Q = new Array(N);
      for (var n = 0; n < N; n++) {
        var x = g.src[n][0], y = g.src[n][1];
        for (var k = 0; k < K; k++) { x += b[k] * d.comps[k][n][0]; y += b[k] * d.comps[k][n][1]; }
        Q[n] = [x, y];
      }
      W.draw(ctx, img, d, g, Q, dpr);
      var z = Math.sqrt(b.reduce(function (s, v) { return s + v * v; }, 0));
      document.getElementById('efp-result').textContent = z === 0
        ? 'The average of ' + d.n + ' faces. These ' + K + ' components together cover ' +
          Math.round(d.cum[K - 1] * 100) + '% of how the faces differ in shape.'
        : 'This face is ' + z.toFixed(1) + ' standard deviations away from the average, counted over these ' + K + ' components.';
    }
    function gauss() { return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random()); }
    document.getElementById('efp-random').addEventListener('click', function () {
      set(b.map(function () { return Math.max(-3, Math.min(3, gauss())).toFixed(1); }));
    });
    document.getElementById('efp-reset').addEventListener('click', function () { set(b.map(function () { return 0; })); });
    read();
  }
})();
