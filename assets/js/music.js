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

      // The 90 s preview comes from music.apple.com, not a public API, so
      // fall back to the 30 s one if its link ever stops working.
      audio.src = button.dataset.extendedSrc || button.dataset.previewSrc;
      audio.play();
      button.classList.add('is-playing');
      button.setAttribute('aria-pressed', 'true');
      activeButton = button;
    });
  });

  audio.addEventListener('ended', stopPlayback);
  audio.addEventListener('error', function () {
    if (activeButton && audio.src !== activeButton.dataset.previewSrc) {
      audio.src = activeButton.dataset.previewSrc;
      audio.play();
    }
  });
});
