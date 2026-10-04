// Runs in <head> so the page paints in the stored language straight away.
// Both languages sit in the HTML as lang="en" / lang="hi"; CSS hides the one
// that is off, keyed on data-lang. Attributes CSS can't reach (aria-label,
// title, placeholder, alt, the tab title) carry their Hindi in data-hi-* and
// are swapped here. Scripts that build text use window.t(en, hi) and listen
// for 'langchange' on document.
(function () {
  var root = document.documentElement;
  var ATTRS = ['aria-label', 'title', 'placeholder', 'alt'];
  var hi = function () { return root.getAttribute('data-lang') === 'hi'; };
  window.t = function (en, hiText) { return hi() && hiText ? hiText : en; };

  function swapAttributes() {
    ATTRS.forEach(function (a) {
      document.querySelectorAll('[data-hi-' + a + ']').forEach(function (el) {
        if (!el.hasAttribute('data-en-' + a)) el.setAttribute('data-en-' + a, el.getAttribute(a) || '');
        el.setAttribute(a, el.getAttribute(hi() ? 'data-hi-' + a : 'data-en-' + a));
      });
    });
    var title = document.querySelector('title[data-hi]');
    if (title) {
      if (!title.hasAttribute('data-en')) title.setAttribute('data-en', document.title);
      document.title = title.getAttribute(hi() ? 'data-hi' : 'data-en');
    }
  }

  function set(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    swapAttributes();
    document.dispatchEvent(new Event('langchange'));
  }
  var stored = null;
  try { stored = localStorage.getItem('lang'); } catch (e) {}
  if (stored === 'hi') set('hi');

  document.addEventListener('DOMContentLoaded', function () {
    swapAttributes();
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = hi() ? 'en' : 'hi';
      set(next);
      try { localStorage.setItem('lang', next); } catch (e) {}
    });
  });
})();
