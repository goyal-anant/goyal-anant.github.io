// Hovering the letters of the name plays Für Elise, one note per letter,
// and each letter wobbles as its note plays. Loaded only on the home page.
(function () {
  var mark = document.querySelector('.site-mark');
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!mark || !AudioCtx) return;

  // Für Elise as MIDI note numbers (60 = middle C): the main theme twice,
  // the middle section, then the main theme again. Each entry is one
  // right-hand note; [note, [left-hand notes]] also rolls a left-hand
  // arpeggio after it, as in the score.
  var Am = [45, 52, 57], E = [40, 52, 56];
  var theme = [
    76, 75, 76, 75, 76, 71, 74, 72, [69, Am], 60, 64, 69, [71, E], 64, 68, 71,
    [72, Am], 64, 76, 75, 76, 75, 76, 71, 74, 72, [69, Am], 60, 64, 69,
    [71, E], 64, 72, 71, [69, Am]
  ];
  var bridge = [71, 72, 74];
  var middle = [
    [76, [48, 55, 60]], 67, 77, 76, [74, [43, 55, 59]], 65, 76, 74,
    [72, Am], 64, 74, 72, [71, [40, 52, 64]], 64, 64, 76,
    64, 76, 76, 88, 75, 76, 75
  ];
  var notes = theme.concat(theme, bridge, middle, theme);
  var ctx, soften, next = 0, restart, hint;

  function tone(note, start, volume, length) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 440 * Math.pow(2, (note - 69) / 12);
    gain.gain.setValueAtTime(0, start);
    // A gentle fade-in avoids the click of a hard start.
    gain.gain.linearRampToValueAtTime(volume, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, start + length);
    osc.connect(gain).connect(soften);
    osc.start(start);
    osc.stop(start + length);
  }

  function play() {
    var t = ctx.currentTime;
    var step = notes[next];
    var right = Array.isArray(step) ? step[0] : step;
    var left = Array.isArray(step) ? step[1] : [];
    tone(right, t, 0.12, 1);
    // Left hand follows in sixteenth notes, a little softer.
    left.forEach(function (note, i) { tone(note, t + 0.14 * (i + 1), 0.08, 1.2); });

    next = (next + 1) % notes.length;
    // Start the melody over after a pause.
    clearTimeout(restart);
    restart = setTimeout(function () { next = 0; }, 1500);
  }

  // Browsers keep audio muted until the visitor clicks or presses a key,
  // so the first such gesture anywhere on the page turns sound on.
  function unlock(e) {
    if (!ctx) {
      ctx = new AudioCtx();
      // Filter out the bright overtones for a softer, rounder tone.
      soften = ctx.createBiquadFilter();
      soften.type = 'lowpass';
      soften.frequency.value = 900;
      soften.connect(ctx.destination);
    }
    ctx.resume();
    if (hint && e.target === hint) play();
    if (hint) hint.remove();
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
  }
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);

  // A faint note beside the name hints that there is sound.
  hint = document.createElement('button');
  hint.type = 'button';
  hint.className = 'sound-hint';
  hint.textContent = '♪';
  hint.title = 'Click to turn on sound, then hover over my name';
  hint.setAttribute('aria-label', 'Turn on sound');
  mark.appendChild(hint);

  mark.addEventListener('mouseover', function (e) {
    // the Hindi name's gap is a span too (a bare space would show in English), so skip blanks
    if (e.target.parentNode !== mark || e.target.tagName !== 'SPAN' || !e.target.textContent.trim()) return;
    if (ctx && ctx.state === 'running') {
      play();
      // Restart the wobble even if the letter is still mid-wobble.
      e.target.classList.remove('wobble');
      void e.target.offsetWidth;
      e.target.classList.add('wobble');
    }
  });
})();
