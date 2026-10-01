document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.book-grid .music-thumb-wrap').forEach(function (wrap) {
    wrap.addEventListener('click', function () {
      wrap.classList.toggle('is-open');
    });
  });

  var audio = new Audio();
  var activeButton = null;
  // A queue is "Play all" on one section or "Shuffle all" on the page.
  var queue = [];
  var queueButton = null;

  // One seek bar, moved into whichever card is playing.
  var seek = document.createElement('input');
  seek.type = 'range';
  seek.className = 'music-seek';
  seek.min = 0;
  seek.max = 1;
  seek.step = 'any';
  seek.setAttribute('aria-label', 'Seek');

  function showProgress() {
    var progress = audio.duration ? audio.currentTime / audio.duration : 0;
    seek.value = progress;
    seek.style.setProperty('--progress', progress * 100 + '%');
  }

  audio.addEventListener('timeupdate', showProgress);
  seek.addEventListener('input', function () {
    if (audio.duration) audio.currentTime = seek.value * audio.duration;
    showProgress();
  });

  // Tint the page with the average colour of the playing song's cover.
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 16;
  var context = canvas.getContext('2d', { willReadFrequently: true });

  function tint(button) {
    var img = button.closest('.music-card').querySelector('.music-thumb');
    if (!img.complete) {
      // Covers load lazily, so a card far down the page may not have one yet.
      img.addEventListener('load', function () {
        if (button === activeButton) tint(button);
      }, { once: true });
      return;
    }
    if (!img.naturalWidth) return;
    context.drawImage(img, 0, 0, 16, 16);
    var pixels = context.getImageData(0, 0, 16, 16).data;
    var sum = [0, 0, 0];
    for (var i = 0; i < pixels.length; i += 4) {
      sum[0] += pixels[i]; sum[1] += pixels[i + 1]; sum[2] += pixels[i + 2];
    }
    var n = pixels.length / 4;
    document.body.style.setProperty('--song-tint',
      'rgb(' + Math.round(sum[0] / n) + ' ' + Math.round(sum[1] / n) + ' ' + Math.round(sum[2] / n) + ')');
  }

  // Spin the playing song's cover like a record: ease up to speed on play,
  // then slow to a halt on stop and stay at whatever angle it stopped.
  var DEGREES_PER_SECOND = 10; // one turn in 36 s
  var stillMotion = matchMedia('(prefers-reduced-motion: reduce)');
  var records = new Map(); // cover -> { angle, speed, target }
  var lastFrame = null;
  var turning = false;

  function turn(now) {
    // Cap the step so a cover doesn't jump after the tab was in the background.
    var dt = lastFrame === null ? 0 : Math.min(0.1, (now - lastFrame) / 1000);
    var moving = false;
    records.forEach(function (r, cover) {
      if (!r.target && !r.speed) return;
      r.speed += (r.target - r.speed) * Math.min(1, dt * 2);
      if (!r.target && r.speed < 1) r.speed = 0;
      r.angle = (r.angle + r.speed * dt) % 360;
      cover.style.transform = 'rotate(' + r.angle + 'deg)';
      moving = true;
    });
    lastFrame = moving ? now : null;
    turning = moving;
    if (moving) requestAnimationFrame(turn);
  }

  function spin(button, on) {
    if (stillMotion.matches) return;
    var cover = button.closest('.music-card').querySelector('.vinyl .music-thumb');
    if (!cover) return;
    var r = records.get(cover) || { angle: 0, speed: 0 };
    r.target = on ? DEGREES_PER_SECOND : 0;
    records.set(cover, r);
    if (!turning) { turning = true; requestAnimationFrame(turn); }
  }

  function clearActive() {
    if (activeButton) {
      spin(activeButton, false);
      activeButton.classList.remove('is-playing', 'is-paused');
      activeButton.setAttribute('aria-pressed', 'false');
    }
    activeButton = null;
    seek.remove();
  }

  function stopPlayback() {
    audio.pause();
    clearActive();
    queue = [];
    if (queueButton) {
      queueButton.textContent = queueButton.dataset.label;
      queueButton.setAttribute('aria-pressed', 'false');
    }
    queueButton = null;
    document.body.style.removeProperty('--song-tint');
  }

  function play(button) {
    clearActive();
    // The 90 s preview comes from music.apple.com, not a public API, so
    // fall back to the 30 s one if its link ever stops working.
    audio.src = button.dataset.extendedSrc || button.dataset.previewSrc;
    audio.volume = 0; // fade() brings it up
    audio.play();
    button.classList.add('is-playing');
    button.setAttribute('aria-pressed', 'true');
    activeButton = button;
    spin(button, true);
    showProgress();
    button.parentNode.appendChild(seek);
    tint(button);
  }

  function playNext() {
    var next = queue.shift();
    if (!next) return stopPlayback();
    play(next);
    // Shuffle jumps anywhere on the page, so centre the card to make it easy
    // to spot; "Play all" only moves to the next card, so scroll just enough.
    var block = queueButton.dataset.queue === 'shuffle' ? 'center' : 'nearest';
    next.closest('.music-card').scrollIntoView({ block: block, behavior: 'smooth' });
  }

  // Pausing keeps the song, its place and any queue; the record winds down.
  function pauseOrResume(button) {
    var resume = audio.paused;
    if (resume) audio.play(); else audio.pause();
    button.classList.toggle('is-playing', resume);
    button.classList.toggle('is-paused', !resume);
    button.setAttribute('aria-pressed', String(resume));
    spin(button, resume);
  }

  document.querySelectorAll('.music-play').forEach(function (button) {
    button.addEventListener('click', function () {
      if (button === activeButton) return pauseOrResume(button);
      stopPlayback();
      play(button);
    });
  });

  document.querySelectorAll('.music-queue').forEach(function (button) {
    button.addEventListener('click', function () {
      var wasActive = button === queueButton;
      stopPlayback();
      if (wasActive) return;

      if (button.dataset.queue === 'shuffle') {
        queue = Array.from(document.querySelectorAll('.music-play'));
        for (var i = queue.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = queue[i]; queue[i] = queue[j]; queue[j] = tmp;
        }
      } else {
        queue = Array.from(button.closest('h2').nextElementSibling.querySelectorAll('.music-play'));
      }
      queueButton = button;
      button.textContent = 'Stop';
      button.setAttribute('aria-pressed', 'true');
      playNext();
    });
  });

  // Fade each song in and out, so one hands over gently to the next.
  var FADE_SECONDS = 2;
  var fading = false;
  function fade() {
    if (audio.paused) { fading = false; return; }
    var fadeIn = audio.currentTime / FADE_SECONDS;
    var fadeOut = audio.duration ? (audio.duration - audio.currentTime) / FADE_SECONDS : 1;
    audio.volume = Math.max(0, Math.min(1, fadeIn, fadeOut));
    requestAnimationFrame(fade);
  }
  audio.addEventListener('playing', function () {
    if (!fading) { fading = true; fade(); }
  });

  audio.addEventListener('ended', playNext);
  audio.addEventListener('error', function () {
    if (!activeButton) return;
    if (audio.src !== activeButton.dataset.previewSrc) {
      audio.src = activeButton.dataset.previewSrc;
      audio.play();
    } else {
      playNext();
    }
  });
});
