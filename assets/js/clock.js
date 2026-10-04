(function () {
  var el;
  function tick() {
    if (!el) el = document.getElementById('clock');
    if (!el) return;
    var now = new Date();
    var locale = document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi-IN-u-nu-latn' : undefined;
    el.textContent = now.toLocaleDateString(locale, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) + ' · ' + now.toLocaleTimeString(locale, {
      hour: '2-digit', minute: '2-digit', hour12: false
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    tick();
    setInterval(tick, 1000);
  });
})();
