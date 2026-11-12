// Read-along pages (_layouts/readalong.html). A reader can tick the sections they have worked through; the
// ticks live in this browser only (localStorage) and show on the book's contents. Without storage the box
// still ticks for the visit and nothing breaks.
(function () {
  var KEY = 'readalong:done';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  var done = load();
  document.querySelectorAll('input[data-done]').forEach(function (box) {
    var url = box.dataset.done;
    box.checked = done.indexOf(url) >= 0;
    box.addEventListener('change', function () {
      done = load().filter(function (u) { return u !== url; });
      if (box.checked) done.push(url);
      save(done);
    });
  });
  document.querySelectorAll('a[data-done-url]').forEach(function (a) {
    if (done.indexOf(a.dataset.doneUrl) >= 0) a.classList.add('is-done');
  });
})();
