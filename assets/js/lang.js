// Runs in <head> so the page paints in the stored language straight away.
// Both languages sit in the HTML as lang="en" / lang="hi"; CSS hides the one
// that is off, keyed on data-lang.
(function () {
  var root = document.documentElement;
  function set(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
  }
  var stored = null;
  try { stored = localStorage.getItem('lang'); } catch (e) {}
  if (stored === 'hi') set('hi');

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-lang') === 'hi' ? 'en' : 'hi';
      set(next);
      try { localStorage.setItem('lang', next); } catch (e) {}
    });
  });
})();
