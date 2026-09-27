(function () {
  var idx, docs, box, btn, input, results, debounceTimer;

  function buildIndex(items) {
    docs = {};
    items.forEach(function (item, i) { item.id = String(i); docs[item.id] = item; });
    return lunr(function () {
      // Keep common words like "why" and "the": titles here are short, so they matter.
      this.pipeline.remove(lunr.stopWordFilter);
      this.searchPipeline.remove(lunr.stopWordFilter);
      this.ref('id');
      this.field('title', { boost: 10 });
      this.field('body');
      items.forEach(function (item) { this.add(item); }, this);
    });
  }

  function render(query) {
    if (!query) { results.innerHTML = ''; return; }
    // Match each word as typed (stemmed, so "apple" finds "appl") and as a prefix
    // of longer words. Building the query directly also means characters like
    // ":" or "~" in the input can't break lunr's query parser.
    var hits = idx.query(function (q) {
      lunr.tokenizer(query).forEach(function (token) {
        var term = token.toString();
        q.term(term);
        if (term.length > 2) q.term(term, { wildcard: lunr.Query.wildcard.TRAILING, usePipeline: false });
      });
    });
    if (hits.length === 0) {
      results.innerHTML = '<li class="search-empty">No results</li>';
      return;
    }
    results.innerHTML = hits.slice(0, 8).map(function (hit) {
      var doc = docs[hit.ref];
      return '<li><a href="' + doc.url + '"><span class="search-result-title">' + doc.title +
        '</span><span class="search-result-section">' + doc.section + '</span></a></li>';
    }).join('');
  }

  function open() {
    box.classList.add('is-open');
    input.focus();
  }

  function close() {
    box.classList.remove('is-open');
    input.value = '';
    results.innerHTML = '';
  }

  document.addEventListener('DOMContentLoaded', function () {
    box = document.querySelector('.search-box');
    btn = document.getElementById('search-toggle');
    input = document.getElementById('search-input');
    results = document.getElementById('search-results');
    if (!box || !btn || !input || !results) return;

    btn.addEventListener('click', function () {
      if (box.classList.contains('is-open')) { close(); return; }
      open();
      if (!idx) {
        fetch('/search.json')
          .then(function (r) { return r.json(); })
          .then(function (items) { idx = buildIndex(items); });
      }
    });

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        if (idx) render(input.value.trim());
      }, 150);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) close();
    });

    document.addEventListener('click', function (e) {
      if (box.classList.contains('is-open') && !box.contains(e.target)) close();
    });
  });
})();
