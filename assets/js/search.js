(function () {
  var items, idx = {}, docs, box, btn, input, results, debounceTimer;

  var lang = function () { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en'; };

  // One index per language, built the first time it is needed.
  function index() {
    var l = lang();
    if (idx[l]) return idx[l];
    docs = {};
    items.forEach(function (item, i) { item.id = String(i); docs[item.id] = item; });
    idx[l] = lunr(function () {
      if (l === 'hi') {
        // lunr's trimmer treats Devanagari as punctuation and its stemmer is
        // English, so Hindi words go in as typed.
        this.pipeline.reset();
        this.searchPipeline.reset();
      } else {
        // Keep common words like "why" and "the": titles here are short, so they matter.
        this.pipeline.remove(lunr.stopWordFilter);
        this.searchPipeline.remove(lunr.stopWordFilter);
      }
      this.ref('id');
      this.field('title', { boost: 10, extractor: function (d) { return l === 'hi' ? d.title_hi : d.title; } });
      this.field('body', { extractor: function (d) { return l === 'hi' ? d.body_hi : d.body; } });
      items.forEach(function (item) { this.add(item); }, this);
    });
    return idx[l];
  }

  function render(query) {
    if (!query) { results.innerHTML = ''; return; }
    // Match each word as typed (stemmed, so "apple" finds "appl") and as a prefix
    // of longer words. Building the query directly also means characters like
    // ":" or "~" in the input can't break lunr's query parser.
    var hits = index().query(function (q) {
      lunr.tokenizer(query).forEach(function (token) {
        var term = token.toString();
        q.term(term);
        if (term.length > 2) q.term(term, { wildcard: lunr.Query.wildcard.TRAILING, usePipeline: false });
      });
    });
    if (hits.length === 0) {
      results.innerHTML = '<li class="search-empty">' + t('No results', 'कुछ नहीं मिला') + '</li>';
      return;
    }
    results.innerHTML = hits.slice(0, 8).map(function (hit) {
      var doc = docs[hit.ref];
      return '<li><a href="' + doc.url + '"><span class="search-result-title">' + t(doc.title, doc.title_hi) +
        '</span><span class="search-result-section">' + t(doc.section, doc.section_hi) + '</span></a></li>';
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
      if (!items) {
        fetch('/search.json')
          .then(function (r) { return r.json(); })
          .then(function (data) { items = data; });
      }
    });

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        if (items) render(input.value.trim());
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
