/* Colour game for "Why is an apple red?".
 *
 * Colour of an object under a light = sum over wavelength of
 *   light spectrum x object reflectance x CIE 1931 colour-matching functions,
 * then converted to sRGB (IEC 61966-2-1 matrix and gamma).
 *
 * Data (5 nm steps, 380-700 nm):
 *   xbar/ybar/zbar  CIE 1931 2-degree colour-matching functions (CIE, doi:10.25039/CIE.DS.xvudnb9b, via cvrl.org)
 *   d65             CIE standard illuminant D65, daylight (CIE, doi:10.25039/CIE.DS.hjfjmt59)
 *   apple leaf      mean of the 30 spectra measured on 16 Jul 2025, Braun et al. (Zenodo, doi:10.5281/zenodo.22143346, CC BY 4.0)
 *   red/green apple SCHEMATIC, not measured: the curves of Figure 4 in the post
 *   screen          SCHEMATIC: red (620 nm) and green (530 nm) sub-pixel bands, mixed so the
 *                   L:M cone ratio equals that of 589 nm light (Stockman & Sharpe cone data)
 *   white paper     idealised: reflects 90% at every wavelength
 * Sodium lamp: a single line at 589 nm.
 */
(function () {
  var D = {"lam":[380,385,390,395,400,405,410,415,420,425,430,435,440,445,450,455,460,465,470,475,480,485,490,495,500,505,510,515,520,525,530,535,540,545,550,555,560,565,570,575,580,585,590,595,600,605,610,615,620,625,630,635,640,645,650,655,660,665,670,675,680,685,690,695,700],"xbar":[0.00137,0.00224,0.00424,0.00765,0.01431,0.02319,0.04351,0.07763,0.13438,0.21477,0.2839,0.3285,0.34828,0.34806,0.3362,0.3187,0.2908,0.2511,0.19536,0.1421,0.09564,0.05795,0.03201,0.0147,0.0049,0.0024,0.0093,0.0291,0.06327,0.1096,0.1655,0.22575,0.2904,0.3597,0.43345,0.51205,0.5945,0.6784,0.7621,0.8425,0.9163,0.9786,1.0263,1.0567,1.0622,1.0456,1.0026,0.9384,0.85445,0.7514,0.6424,0.5419,0.4479,0.3608,0.2835,0.2187,0.1649,0.1212,0.0874,0.0636,0.04677,0.0329,0.0227,0.01584,0.01136],"ybar":[4e-05,6e-05,0.00012,0.00022,0.0004,0.00064,0.00121,0.00218,0.004,0.0073,0.0116,0.01684,0.023,0.0298,0.038,0.048,0.06,0.0739,0.09098,0.1126,0.13902,0.1693,0.20802,0.2586,0.323,0.4073,0.503,0.6082,0.71,0.7932,0.862,0.91485,0.954,0.9803,0.99495,1.0,0.995,0.9786,0.952,0.9154,0.87,0.8163,0.757,0.6949,0.631,0.5668,0.503,0.4412,0.381,0.321,0.265,0.217,0.175,0.1382,0.107,0.0816,0.061,0.04458,0.032,0.0232,0.017,0.01192,0.00821,0.00572,0.0041],"zbar":[0.00645,0.01055,0.02005,0.03621,0.06785,0.1102,0.2074,0.3713,0.6456,1.03905,1.3856,1.62296,1.74706,1.7826,1.77211,1.7441,1.6692,1.5281,1.28764,1.0419,0.81295,0.6162,0.46518,0.3533,0.272,0.2123,0.1582,0.1117,0.07825,0.05725,0.04216,0.02984,0.0203,0.0134,0.00875,0.00575,0.0039,0.00275,0.0021,0.0018,0.00165,0.0014,0.0011,0.001,0.0008,0.0006,0.00034,0.00024,0.00019,0.0001,5e-05,3e-05,2e-05,1e-05,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"d65":[49.98,52.31,54.65,68.7,82.75,87.12,91.49,92.46,93.43,90.06,86.68,95.77,104.86,110.94,117.01,117.41,117.81,116.34,114.86,115.39,115.92,112.37,108.81,109.08,109.35,108.58,107.8,106.3,104.79,106.24,107.69,106.05,104.41,104.22,104.05,102.02,100.0,98.17,96.33,96.06,95.79,92.24,88.69,89.35,90.01,89.8,89.6,88.65,87.7,85.49,83.29,83.49,83.7,81.86,80.03,80.12,80.21,81.25,82.28,80.28,78.28,74.0,69.72,70.67,71.61],"screen":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0001,0.0005,0.002,0.0072,0.023,0.0625,0.1458,0.2916,0.5,0.7349,0.9259,1.0,0.9259,0.7349,0.5,0.2916,0.1458,0.0625,0.023,0.0072,0.002,0.0005,0.0009,0.0081,0.0547,0.2602,0.8752,2.0816,3.5009,4.1633,3.5009,2.0816,0.8752,0.2602,0.0547,0.0081,0.0009,0.0001,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"objects":{"red apple":[0.059,0.059,0.059,0.059,0.059,0.058,0.057,0.057,0.056,0.055,0.054,0.053,0.052,0.051,0.051,0.05,0.049,0.048,0.047,0.046,0.045,0.044,0.043,0.042,0.041,0.04,0.039,0.037,0.036,0.035,0.033,0.032,0.03,0.029,0.027,0.03,0.033,0.036,0.039,0.042,0.045,0.058,0.07,0.083,0.095,0.131,0.166,0.201,0.236,0.273,0.309,0.345,0.382,0.393,0.405,0.416,0.427,0.44,0.452,0.465,0.477,0.489,0.5,0.511,0.523],"green apple":[0.077,0.077,0.077,0.077,0.077,0.077,0.077,0.077,0.077,0.077,0.077,0.077,0.077,0.082,0.086,0.091,0.095,0.1,0.105,0.109,0.114,0.142,0.171,0.2,0.229,0.258,0.286,0.315,0.343,0.372,0.4,0.407,0.414,0.42,0.427,0.416,0.405,0.393,0.382,0.366,0.35,0.334,0.318,0.302,0.286,0.273,0.261,0.248,0.235,0.222,0.209,0.193,0.177,0.161,0.145,0.13,0.114,0.111,0.108,0.105,0.165,0.226,0.286,0.357,0.427],"apple leaf":[0.113,0.106,0.087,0.077,0.085,0.088,0.066,0.063,0.066,0.065,0.062,0.059,0.06,0.06,0.059,0.059,0.06,0.059,0.059,0.058,0.058,0.059,0.059,0.062,0.065,0.072,0.086,0.106,0.133,0.159,0.181,0.194,0.201,0.205,0.208,0.208,0.202,0.191,0.175,0.16,0.147,0.138,0.132,0.128,0.125,0.121,0.114,0.107,0.101,0.097,0.097,0.095,0.089,0.08,0.074,0.07,0.066,0.062,0.061,0.062,0.067,0.074,0.091,0.136,0.206]}};
  var root = document.getElementById('colour-game');
  if (!root) return;

  D.objects['white paper'] = D.lam.map(function () { return 0.9; });
  var OBJECTS = ['red apple', 'green apple', 'apple leaf', 'white paper'];
  var LIGHTS = {
    sun: { name: 'sunlight', spd: D.d65 },
    sodium: { name: 'a sodium lamp (589 nm)', mono: 589 },
    phone: { name: 'your phone screen showing "yellow"', spd: D.screen }
  };

  function at(arr, l) { // linear interpolation on the 5 nm grid
    var i = Math.min(Math.max(Math.floor((l - 380) / 5), 0), arr.length - 2);
    var f = (l - D.lam[i]) / 5;
    return arr[i] + (arr[i + 1] - arr[i]) * f;
  }
  function xyz(refl, light) {
    var X = 0, Y = 0, Z = 0;
    if (light.mono) {
      var r = at(refl, light.mono);
      return [r * at(D.xbar, light.mono), r * at(D.ybar, light.mono), r * at(D.zbar, light.mono)];
    }
    for (var i = 0; i < D.lam.length; i++) {
      var p = light.spd[i] * refl[i];
      X += p * D.xbar[i]; Y += p * D.ybar[i]; Z += p * D.zbar[i];
    }
    return [X, Y, Z];
  }
  function linRGB(c) {
    return [3.2406 * c[0] - 1.5372 * c[1] - 0.4986 * c[2],
           -0.9689 * c[0] + 1.8758 * c[1] + 0.0415 * c[2],
            0.0557 * c[0] - 0.2040 * c[1] + 1.0570 * c[2]];
  }
  function gamma(v) {
    v = Math.min(Math.max(v, 0), 1);
    return Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055));
  }
  // Colours of all objects under one light. Normalised so a perfect white would have Y = 1
  // (the eye adjusts to brightness), pushed into the screen's gamut by adding white, then
  // scaled together so relative brightness between objects is kept.
  function scene(light) {
    var w = xyz(D.lam.map(function () { return 1; }), light)[1];
    var out = {}, peak = 1;
    OBJECTS.forEach(function (o) {
      var c = xyz(D.objects[o], light).map(function (v) { return v / w; });
      var rgb = linRGB(c), lo = Math.min(rgb[0], rgb[1], rgb[2]);
      if (lo < 0) rgb = rgb.map(function (v) { return v - lo; });
      peak = Math.max(peak, rgb[0], rgb[1], rgb[2]);
      out[o] = { rgb: rgb, Y: c[1] };
    });
    OBJECTS.forEach(function (o) {
      var s = out[o].rgb.map(function (v) { return gamma(v / peak); });
      out[o].css = 'rgb(' + s.join(',') + ')';
      out[o].srgb = s;
      out[o].name = colourName(s);
    });
    return out;
  }
  function colourName(s) {
    var r = s[0] / 255, g = s[1] / 255, b = s[2] / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    if (mx < 0.12) return 'almost black';
    var sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    var tone = l < 0.3 ? 'dark ' : l > 0.75 ? 'light ' : '';
    if (sat < 0.15) return l > 0.85 ? 'white' : tone + 'grey';
    var h = 0;
    if (mx === r) h = ((g - b) / d + 6) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h *= 60;
    var hue = h < 15 ? 'red' : h < 40 ? (l < 0.4 ? 'brown' : 'orange') : h < 65 ? (l < 0.35 ? 'olive' : 'yellow')
      : h < 160 ? 'green' : h < 200 ? 'cyan' : h < 260 ? 'blue' : h < 320 ? 'purple' : h < 345 ? 'pink' : 'red';
    if (hue === 'brown' || hue === 'olive') tone = l < 0.2 ? 'dark ' : l > 0.4 ? 'light ' : '';
    return tone + hue;
  }
  function dist(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
  }
  function pct(v) { return Math.round(v * 100); }
  function explain(obj, key, S) {
    var R = D.objects[obj];
    if (key === 'sun') return 'Sunlight has every colour in it, so the ' + obj + ' simply shows its own colour.';
    if (key === 'sodium') {
      var rel = S[obj].Y / S['white paper'].Y;
      return 'The sodium lamp gives only 589 nm light, so all the ' + obj + ' can do is reflect more or less of it: about ' +
        pct(at(R, 589)) + '% here. You get a ' + (rel < 0.2 ? 'very dark' : rel < 0.5 ? 'dim' : 'bright') +
        ' version of the lamp\'s own colour, nothing else.';
    }
    var pr = at(R, 620), pg = at(R, 530);
    return 'Your screen\'s "yellow" is red light plus green light. The ' + obj + ' reflects about ' + pct(pr) +
      '% of the red and ' + pct(pg) + '% of the green, so ' +
      (pr > 1.5 * pg ? 'the red wins and it looks reddish.' : pg > 1.5 * pr ? 'the green wins and it looks greenish.' : 'it stays yellowish.');
  }

  var scenes = {};
  Object.keys(LIGHTS).forEach(function (k) { scenes[k] = scene(LIGHTS[k]); });

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function swatch(c) {
    var s = el('span', 'cg-swatch');
    s.style.background = c.css;
    s.setAttribute('aria-hidden', 'true');
    return s;
  }

  /* ---------- quiz ---------- */
  var quiz = el('div', 'cg-quiz');
  root.appendChild(quiz);
  var qs, qi, score;

  function start() {
    qs = [];
    OBJECTS.forEach(function (o) { Object.keys(LIGHTS).forEach(function (k) { qs.push([o, k]); }); });
    for (var i = qs.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = qs[i]; qs[i] = qs[j]; qs[j] = t; }
    qs = qs.slice(0, 10); qi = 0; score = 0;
    ask();
  }
  function ask() {
    quiz.innerHTML = '';
    if (qi === qs.length) {
      quiz.appendChild(el('p', 'cg-title', 'You got ' + score + ' out of ' + qs.length + '.'));
      quiz.appendChild(el('p', null, score >= 8 ? 'Very good, your eyes have been properly fooled and un-fooled :)'
        : 'The sodium lamp and the phone screen trick almost everyone. Read the last two sections again and try once more!'));
      var again = el('button', 'cg-next', 'Play again');
      again.onclick = start;
      quiz.appendChild(again);
      again.focus();
      return;
    }
    var obj = qs[qi][0], key = qs[qi][1], S = scenes[key], right = S[obj];
    var pool = [];
    Object.keys(LIGHTS).forEach(function (k) { if (k !== key) pool.push(scenes[k][obj]); });
    OBJECTS.forEach(function (o) { if (o !== obj) pool.push(S[o]); });
    [[30, 30, 30], [128, 128, 128], [40, 90, 200]].forEach(function (s) {
      pool.push({ css: 'rgb(' + s.join(',') + ')', srgb: s, name: colourName(s) });
    });
    var opts = [right];
    pool.forEach(function (c) {
      if (opts.length < 4 && opts.every(function (o) { return o.name !== c.name && dist(o.srgb, c.srgb) > 45; })) opts.push(c);
    });
    opts.sort(function () { return Math.random() - 0.5; });

    quiz.appendChild(el('p', 'cg-count', 'Question ' + (qi + 1) + ' of ' + qs.length + ' · score ' + score));
    quiz.appendChild(el('p', 'cg-title', 'How does the ' + obj + ' look under ' + LIGHTS[key].name + '?'));
    var group = el('div', 'cg-options');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Possible colours');
    var fb = el('p', 'cg-feedback');
    fb.setAttribute('aria-live', 'polite');
    opts.forEach(function (c) {
      var b = el('button', 'cg-option');
      b.type = 'button';
      b.appendChild(swatch(c));
      b.appendChild(el('span', null, c.name));
      b.onclick = function () {
        var ok = c === right;
        if (ok) score++;
        [].forEach.call(group.children, function (x) { x.disabled = true; });
        b.classList.add(ok ? 'cg-right' : 'cg-wrong');
        group.children[opts.indexOf(right)].classList.add('cg-right');
        fb.textContent = (ok ? 'Right! ' : 'Not quite, it looks ' + right.name + '. ') + explain(obj, key, S);
        var next = el('button', 'cg-next', qi + 1 === qs.length ? 'See score' : 'Next');
        next.onclick = function () { qi++; ask(); };
        quiz.appendChild(next);
        next.focus();
      };
      group.appendChild(b);
    });
    quiz.appendChild(group);
    quiz.appendChild(fb);
  }

  /* ---------- free play ---------- */
  var play = el('div', 'cg-play');
  play.appendChild(el('p', 'cg-title', 'Or play freely: pick a light'));
  var bar = el('div', 'cg-lights');
  var row = el('div', 'cg-row');
  var slider = document.createElement('input');
  slider.type = 'range'; slider.min = 400; slider.max = 700; slider.value = 589;
  slider.setAttribute('aria-label', 'Wavelength of a single-colour light, in nanometres');
  var sliderLabel = el('span', 'cg-count');
  var current = 'sun';

  function render() {
    var light = current === 'mono' ? { mono: +slider.value } : LIGHTS[current];
    var S = current === 'mono' ? scene(light) : scenes[current];
    sliderLabel.textContent = current === 'mono' ? slider.value + ' nm' : '';
    row.innerHTML = '';
    OBJECTS.forEach(function (o) {
      var f = el('figure', 'cg-item');
      f.appendChild(swatch(S[o]));
      f.appendChild(el('figcaption', null, o + ': ' + S[o].name));
      row.appendChild(f);
    });
    [].forEach.call(bar.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', b.dataset.k === current ? 'true' : 'false');
    });
  }
  [['sun', 'Sunlight'], ['sodium', 'Sodium lamp'], ['phone', 'Phone "yellow"'], ['mono', 'One wavelength']].forEach(function (p) {
    var b = el('button', 'cg-light', p[1]);
    b.type = 'button'; b.dataset.k = p[0];
    b.onclick = function () { current = p[0]; render(); };
    bar.appendChild(b);
  });
  slider.oninput = function () { current = 'mono'; render(); };
  play.appendChild(bar);
  var sl = el('div', 'cg-slider');
  sl.appendChild(slider); sl.appendChild(sliderLabel);
  play.appendChild(sl);
  play.appendChild(row);
  root.appendChild(play);

  start();
  render();
})();
