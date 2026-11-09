/* Bits calculator for "What makes us all look different?".
 * n independent traits with k distinguishable levels each give k^n combinations,
 * i.e. n log2(k) bits. Telling P people apart needs log2(P) bits.
 * P = 8.2 billion, UN World Population Prospects 2024.
 */
(function () {
  var P = 8.2e9, need = Math.log2(P), max = 2 * need;
  var n = document.getElementById('bc-n'), k = document.getElementById('bc-k');
  var fill = document.getElementById('bc-fill'), out = document.getElementById('bc-result');
  document.querySelector('#bits-calc .bc-need').style.left = (need / max * 100) + '%';
  function big(x) {
    if (x < 10) return x.toFixed(1);
    if (x < 1e4) return Math.round(x).toLocaleString('en-IN');
    var e = Math.floor(Math.log10(x));
    return (x / Math.pow(10, e)).toFixed(1) + ' × 10<sup>' + e + '</sup>';
  }
  function update() {
    var N = +n.value, K = +k.value, bits = N * Math.log2(K), combos = Math.pow(K, N);
    document.getElementById('bc-n-out').textContent = N;
    document.getElementById('bc-k-out').textContent = K;
    fill.style.width = Math.min(bits / max, 1) * 100 + '%';
    fill.classList.toggle('bc-enough', bits >= need);
    var msg = N + ' traits × log<sub>2</sub>(' + K + ') = <b>' + bits.toFixed(1) + ' bits</b>, i.e. ' + big(combos) +
      ' different faces. Telling 8.2 billion people apart needs ' + need.toFixed(1) + ' bits. ';
    msg += bits >= need
      ? 'Enough: on average there are ' + big(combos / P) + ' possible faces per person.'
      : 'Not enough: on average about ' + big(P / combos) + ' people would share each face.';
    out.innerHTML = msg;
  }
  n.addEventListener('input', update);
  k.addEventListener('input', update);
  update();
})();
