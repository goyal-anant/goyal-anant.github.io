document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.music-thumb-wrap').forEach(function (wrap) {
    wrap.addEventListener('click', function () {
      wrap.classList.toggle('is-open');
    });
  });
});
