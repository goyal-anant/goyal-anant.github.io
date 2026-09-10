(function () {
  var el;
  function tick() {
    if (!el) el = document.getElementById('clock');
    if (!el) return;
    var now = new Date();
    el.textContent = now.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) + ' · ' + now.toLocaleTimeString(undefined, {
      hour: 'numeric', minute: '2-digit'
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    tick();
    setInterval(tick, 1000);
  });
})();
