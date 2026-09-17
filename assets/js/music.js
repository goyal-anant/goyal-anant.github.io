document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.music-thumb-wrap').forEach(function (wrap) {
    wrap.addEventListener('click', function () {
      wrap.classList.toggle('is-open');
    });
  });

  var audio = new Audio();
  var activeButton = null;

  function stopPlayback() {
    audio.pause();
    if (activeButton) {
      activeButton.classList.remove('is-playing');
      activeButton.setAttribute('aria-pressed', 'false');
    }
    activeButton = null;
  }

  document.querySelectorAll('.music-play').forEach(function (button) {
    button.addEventListener('click', function () {
      var wasActive = button === activeButton;
      stopPlayback();
      if (wasActive) return;

      audio.src = button.dataset.previewSrc;
      audio.play();
      button.classList.add('is-playing');
      button.setAttribute('aria-pressed', 'true');
      activeButton = button;
    });
  });

  audio.addEventListener('ended', stopPlayback);
});
