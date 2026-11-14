// antenna-circuit: the antenna as a circuit element, Balanis §2.13, eqs. (2-72) to (2-89).
//   transmit   generator Vg, Zg in series with ZA = Rr + RL + jXA (Fig. 2.27b). The source can give 1 W at most
//              (|Vg|^2 / 8Rg = 1 W); the powers in Rr, RL and Rg from (2-76) to (2-78). Presets are 2.45 GHz copper
//              dipoles of 0.5 mm radius from efficiency-chain.js. Map: power into the antenna over (RA, XA).
//   terminals  radiation resistance at the current maximum, Balanis (4-70), against the input resistance at the
//              feed, (4-79), for the sinusoidal current; and the moment-method input impedance of real wires (MOM).
//   receive    absorption efficiency of a matched, lossless receiving antenna (absorbed over absorbed plus
//              scattered) against x = D_a / D_s, between the optical-theorem bounds (1 -+ sqrt(1 - x)) / 2
//              (Andersen and Frandsen 2005); the Thevenin circuit always gives 1/2.
// Markup from _includes/readalong/antenna-circuit.html; helpers from readalong.js (window.RA). The maths at the top
// has no DOM and is also run under node by content/balanis/checks/antenna_circuit.py.
(function () {
  var EC = typeof module !== 'undefined' ? require('./efficiency-chain.js') : window.EfficiencyChain;
  var PI = Math.PI;

  // Moment-method input impedance (Hallén, exact kernel, magnetic-frill feed with b/a = 2.3, i.e. a 50 ohm coax)
  // of centre-fed copper-free dipoles at 2.45 GHz, for lengths 0.05 to 1.5 wavelengths in steps of 0.01.
  // Computed and checked by content/balanis/checks/antenna_circuit.py; [R, X] in ohms.
  var MOM = {
    "0.5": [[0.77,-1064.76],[1.01,-941.12],[1.29,-847.82],[1.6,-774.0],[1.95,-712.17],[2.33,-660.35],[2.76,-615.48],[3.22,-575.76],[3.73,-540.7],[4.29,-508.91],[4.89,-480.23],[5.53,-453.91],[6.24,-429.45],[6.99,-406.83],[7.8,-385.55],[8.67,-365.62],[9.6,-346.75],[10.59,-328.73],[11.66,-311.6],[12.8,-295.1],[14.01,-279.29],[15.31,-264.02],[16.7,-249.16],[18.18,-234.76],[19.76,-220.68],[21.44,-206.96],[23.24,-193.49],[25.16,-180.22],[27.2,-167.18],[29.39,-154.27],[31.73,-141.52],[34.22,-128.87],[36.89,-116.26],[39.74,-103.74],[42.79,-91.22],[46.05,-78.73],[49.55,-66.23],[53.3,-53.67],[57.31,-41.08],[61.63,-28.39],[66.27,-15.63],[71.25,-2.77],[76.62,10.23],[82.39,23.35],[88.63,36.64],[95.35,50.07],[102.61,63.68],[110.48,77.49],[118.99,91.46],[128.22,105.65],[138.23,120.0],[149.1,134.54],[160.95,149.27],[173.83,164.12],[187.89,179.12],[203.21,194.18],[219.93,209.25],[238.25,224.29],[258.24,239.14],[280.14,253.73],[304.07,267.85],[330.24,281.31],[358.87,293.86],[390.08,305.15],[424.1,314.81],[460.98,322.34],[500.84,327.2],[543.73,328.71],[589.39,326.11],[637.67,318.56],[687.91,305.19],[739.42,285.09],[791.17,257.41],[841.66,221.6],[889.3,177.22],[932.07,124.5],[968.04,64.05],[995.35,-2.98],[1012.4,-74.58],[1018.22,-148.64],[1012.5,-222.45],[995.68,-293.64],[968.82,-360.06],[933.58,-419.83],[891.77,-471.96],[845.46,-515.76],[796.42,-551.26],[746.22,-578.84],[696.29,-599.1],[647.52,-612.87],[600.76,-620.99],[556.42,-624.32],[514.72,-623.66],[475.9,-619.72],[439.87,-613.13],[406.65,-604.44],[376.07,-594.1],[347.97,-582.47],[322.23,-569.88],[298.63,-556.56],[277.05,-542.74],[257.31,-528.57],[239.22,-514.15],[222.69,-499.63],[207.54,-485.05],[193.69,-470.49],[181.0,-455.99],[169.38,-441.58],[158.75,-427.29],[149.02,-413.12],[140.12,-399.11],[131.98,-385.24],[124.54,-371.52],[117.76,-357.95],[111.59,-344.52],[105.98,-331.24],[100.91,-318.09],[96.33,-305.05],[92.23,-292.14],[88.57,-279.32],[85.34,-266.6],[82.52,-253.97],[80.09,-241.41],[78.04,-228.91],[76.36,-216.46],[75.04,-204.05],[74.08,-191.68],[73.46,-179.31],[73.2,-166.96],[73.3,-154.6],[73.74,-142.23],[74.55,-129.85],[75.72,-117.42],[77.27,-104.95],[79.21,-92.43],[81.54,-79.86],[84.3,-67.22],[87.49,-54.51],[91.13,-41.72],[95.25,-28.84],[99.89,-15.88],[105.05,-2.84],[110.8,10.3],[117.15,23.51],[124.15,36.81],[131.84,50.17]],
    "0.05": [[0.48,-2314.38],[0.7,-2023.71],[0.94,-1801.47],[1.22,-1624.95],[1.54,-1480.4],[1.9,-1359.3],[2.29,-1255.85],[2.74,-1166.04],[3.22,-1087.1],[3.75,-1016.82],[4.32,-953.72],[4.94,-896.52],[5.62,-844.21],[6.34,-796.14],[7.12,-751.56],[7.95,-710.1],[8.84,-671.29],[9.8,-634.71],[10.81,-600.19],[11.91,-567.36],[13.06,-536.15],[14.28,-506.29],[15.6,-477.55],[16.99,-449.95],[18.47,-423.21],[20.04,-397.38],[21.7,-372.27],[23.48,-347.73],[25.36,-323.82],[27.37,-300.34],[29.49,-277.35],[31.74,-254.72],[34.15,-232.33],[36.7,-210.26],[39.42,-188.33],[42.31,-166.63],[45.38,-145.03],[48.67,-123.43],[52.15,-101.93],[55.89,-80.34],[59.87,-58.77],[64.12,-37.09],[68.67,-15.22],[73.54,6.78],[78.77,29.05],[84.36,51.52],[90.37,74.29],[96.85,97.47],[103.82,120.98],[111.34,144.98],[119.45,169.41],[128.22,194.38],[137.75,219.99],[148.06,246.19],[159.3,273.14],[171.53,300.79],[184.87,329.26],[199.49,358.67],[215.5,388.97],[233.12,420.33],[252.51,452.72],[273.93,486.25],[297.67,521.02],[324.02,556.99],[353.38,594.28],[386.16,632.82],[422.89,672.64],[464.18,713.7],[510.71,755.8],[563.31,798.79],[622.93,842.22],[690.67,885.59],[767.78,928.13],[855.65,968.58],[955.8,1005.39],[1069.76,1036.15],[1198.95,1057.79],[1344.35,1066.21],[1506.16,1055.91],[1683.0,1020.47],[1871.17,952.23],[2063.58,843.69],[2249.09,688.91],[2412.66,485.39],[2537.04,237.6],[2606.16,-42.73],[2609.71,-336.33],[2546.65,-620.62],[2425.2,-875.46],[2260.91,-1086.57],[2071.19,-1248.15],[1872.35,-1361.22],[1676.88,-1431.52],[1492.59,-1466.8],[1324.11,-1475.05],[1172.93,-1463.31],[1039.11,-1437.44],[921.67,-1402.03],[818.97,-1360.41],[729.44,-1315.14],[651.36,-1267.93],[583.24,-1220.06],[523.74,-1172.39],[471.63,-1125.45],[425.91,-1079.64],[385.67,-1035.13],[350.19,-992.07],[318.81,-950.52],[291.0,-910.44],[266.3,-871.84],[244.31,-834.64],[224.7,-798.79],[207.18,-764.21],[191.52,-730.83],[177.5,-698.56],[164.94,-667.35],[153.69,-637.1],[143.62,-607.75],[134.61,-579.24],[126.56,-551.48],[119.39,-524.44],[113.02,-498.05],[107.38,-472.22],[102.43,-446.95],[98.11,-422.16],[94.38,-397.81],[91.2,-373.86],[88.55,-350.25],[86.4,-326.96],[84.72,-303.92],[83.51,-281.13],[82.75,-258.54],[82.42,-236.09],[82.53,-213.79],[83.06,-191.55],[84.02,-169.4],[85.41,-147.27],[87.23,-125.12],[89.5,-102.96],[92.22,-80.7],[95.41,-58.37],[99.09,-35.91],[103.27,-13.26],[107.99,9.55],[113.28,32.62],[119.16,55.91]]
  };

  // Transmit mode, Fig. 2.27(b). Vg is set so that the source's available power is 1 W.
  function circuit(Rr, RL, XA, Rg, Xg) {
    var Vg2 = 8 * Rg, Rt = Rr + RL + Rg, Xt = XA + Xg, I2 = Vg2 / (Rt * Rt + Xt * Xt);
    var Pr = I2 * Rr / 2, PL = I2 * RL / 2, Pg = I2 * Rg / 2;
    return { I: Math.sqrt(I2), Pr: Pr, PL: PL, Pg: Pg, Pin: Pr + PL, Ps: Pr + PL + Pg };
  }
  // Radiation resistance at the current maximum (4-70) and at the terminals (4-79), sinusoidal current
  function terminals(L, amm) {
    var z = EC.dipoleZ(L, amm / 1000 / EC.LAMBDA), s2 = Math.pow(Math.sin(PI * L), 2);
    return { Rmax: z.R * s2, Xmax: z.X * s2, Rin: z.R, Xin: z.X, feed: Math.abs(Math.sin(PI * L)) };
  }
  function mom(L, amm) {   // linear interpolation in the table
    var t = MOM[String(amm)], u = Math.max(0, Math.min(t.length - 1, (L - 0.05) * 100)), i = Math.min(t.length - 2, Math.floor(u)), f = u - i;
    return { R: t[i][0] + f * (t[i + 1][0] - t[i][0]), X: t[i][1] + f * (t[i + 1][1] - t[i][1]) };
  }
  function bounds(x) { var r = Math.sqrt(Math.max(0, 1 - x)); return [(1 - r) / 2, (1 + r) / 2]; }
  // Andersen and Frandsen 2005: thin dipole (minimum scattering, x = 1, 50%) and their three-dipole endfire array
  var POINTS = [{ x: 1, eta: 0.5, label: 'thin dipole' }, { x: 0.252, eta: 0.93, label: '3-dipole endfire array' }];

  var api = { MOM: MOM, circuit: circuit, terminals: terminals, mom: mom, bounds: bounds, POINTS: POINTS };
  if (typeof module !== 'undefined') { module.exports = api; return; }

  // ---- drawing ------------------------------------------------------------------------------------------------

  var RA = window.RA, svg = RA.svg, sig = RA.sig;
  function ohm(v) { var a = Math.abs(v); return (a >= 100 ? v.toFixed(0) : a >= 10 ? v.toFixed(1) : a >= 1 ? v.toFixed(2) : v.toFixed(3)) + ' Ω'; }
  function zt(R, X) { return Math.abs(X) < 1e-9 ? ohm(R) : ohm(R) + (X < 0 ? ' − j' : ' + j') + ohm(Math.abs(X)); }
  function W(v) { return v < 0.01 ? sig(1000 * v, 3) + ' mW' : sig(v, 3) + ' W'; }
  function gam(R, X, Z0) { var nr = R - Z0, dr = R + Z0; return Math.sqrt((nr * nr + X * X) / (dr * dr + X * X)); }
  function logSlider(parent, label, lo, hi, v, fmt, on) {
    var k = Math.log(hi / lo), inp = RA.slider(parent, { label: label, min: 0, max: 1, step: 'any', value: Math.log(v / lo) / k,
      fmt: function (s) { return fmt(lo * Math.exp(k * s)); }, onInput: function (s) { on(lo * Math.exp(k * s)); } });
    return function (val) { inp.value = Math.log(val / lo) / k; inp.dispatchEvent(new Event('input')); };
  }
  function linSlider(parent, label, lo, hi, step, v, fmt, on) {
    var inp = RA.slider(parent, { label: label, min: lo, max: hi, step: step, value: v, fmt: fmt, onInput: on });
    return function (val) { inp.value = val; inp.dispatchEvent(new Event('input')); };
  }
  function panel(stage, caption, h) {
    var box = RA.el('div', { class: 'ra-pattern-cut' }, stage);
    RA.el('p', {}, box, caption);
    var S = svg('svg', { viewBox: '0 0 320 ' + h, role: 'img' }, box);
    return { S: S, title: svg('title', {}, S), g: svg('g', {}, S) };
  }
  function box(g, x, y, w, h, label, sub) {   // a labelled circuit element
    svg('rect', { x: x, y: y, width: w, height: h, rx: 2, fill: 'var(--bg, white)', stroke: 'currentColor', 'stroke-width': 1.2 }, g);
    svg('text', { x: x + w / 2, y: y + h / 2 + 3.5, 'font-size': 10, 'text-anchor': 'middle', 'font-style': 'italic', fill: 'currentColor' }, g).textContent = label;
    if (sub) svg('text', { x: x + w / 2, y: y + h + 11, 'font-size': 8.5, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.75 }, g).textContent = sub;
  }

  // ---- transmit ----
  function transmit(root, d, controls, stage) {
    var a0 = EC.dipole(0.5, 0.5, 50);
    var st = { Rr: a0.Rr, RL: a0.RL, XA: a0.X, gen: d.gen === '75' ? 75 : d.gen === 'conj' ? 'conj' : 50 };
    var PRE = [['half', 'λ/2 dipole', EC.dipole(0.5, 0.5, 50)], ['trim', '0.47 λ dipole', EC.dipole(0.47, 0.5, 50)], ['short', 'λ/10 dipole', EC.dipole(0.1, 0.5, 50)]];
    var pre = RA.el('div', { class: 'ra-toggle' }, controls), preBtns = [], set = {};
    PRE.forEach(function (p) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, pre, p[1]);
      b.addEventListener('click', function () { set.Rr(p[2].Rr); set.RL(p[2].RL); set.XA(p[2].X); });
      preBtns.push([b, p[2]]);
    });
    set.Rr = logSlider(controls, '<i>R</i><sub>r</sub>', 0.1, 1000, st.Rr, ohm, function (v) { st.Rr = v; update(); });
    set.RL = logSlider(controls, '<i>R</i><sub>L</sub>', 0.01, 100, st.RL, ohm, function (v) { st.RL = v; update(); });
    set.XA = linSlider(controls, '<i>X</i><sub>A</sub>', -600, 600, 0.5, st.XA, function (v) { return (v < 0 ? '−' : '+') + Math.abs(v).toFixed(1) + ' Ω'; }, function (v) { st.XA = v; update(); });
    var paintGen = RA.toggle(controls, 'Generator', [[50, '50 Ω source'], [75, '75 Ω source'], ['conj', 'Conjugate source']], function () { return st.gen; }, function (v) { st.gen = v; update(); });

    var C = panel(stage, 'Where the power goes', 250), M = panel(stage, 'Power into the antenna (shading)', 210);
    var rows = RA.readout(root, [['zg', '<i>Z</i><sub>g</sub>'], ['za', '<i>Z</i><sub>A</sub>'], ['i', '|<i>I</i><sub>g</sub>|'], ['ps', 'Supplied by the source'], ['eff', 'Radiated / supplied']]);

    function gen() { return st.gen === 'conj' ? [st.Rr + st.RL, -st.XA] : [st.gen, 0]; }
    function drawCircuit(g, r, Zg) {
      g.textContent = '';
      // loop: source on the left, Zg on top, antenna (Rr, RL, XA) down the right side
      var l = svg('g', { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.2 }, g);
      svg('path', { d: 'M40 20 H280 V100 H40 Z' }, l);
      svg('circle', { cx: 40, cy: 60, r: 13, fill: 'var(--bg, white)' }, l);
      svg('path', { d: 'M33 60 q3.5 -7 7 0 t7 0' }, l);
      svg('text', { x: 18, y: 64, 'font-size': 10, 'text-anchor': 'end', 'font-style': 'italic', fill: 'currentColor' }, g).textContent = 'V';
      svg('text', { x: 8, y: 80, 'font-size': 8, fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = 'source';
      box(g, 78, 12, 40, 16, 'Rg', ohm(Zg[0]));
      box(g, 128, 12, 40, 16, 'Xg', Math.abs(Zg[1]) < 1e-9 ? '0 Ω' : (Zg[1] < 0 ? '−' : '+') + ohm(Math.abs(Zg[1])));
      box(g, 262, 30, 36, 14, 'Rr');
      box(g, 262, 54, 36, 14, 'RL');
      box(g, 262, 78, 36, 14, 'XA');
      svg('text', { x: 123, y: 52, 'font-size': 8.5, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = 'generator Zg';
      svg('text', { x: 254, y: 40, 'font-size': 8.5, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.75 }, g).textContent = ohm(st.Rr);
      svg('text', { x: 254, y: 64, 'font-size': 8.5, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.75 }, g).textContent = ohm(st.RL);
      svg('text', { x: 254, y: 88, 'font-size': 8.5, 'text-anchor': 'end', fill: 'currentColor', 'fill-opacity': 0.75 }, g).textContent = (st.XA < 0 ? '−' : '+') + ohm(Math.abs(st.XA));
      svg('text', { x: 212, y: 14, 'font-size': 8.5, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = 'a';
      svg('text', { x: 212, y: 112, 'font-size': 8.5, 'text-anchor': 'middle', fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = 'b';
      svg('line', { x1: 212, x2: 212, y1: 20, y2: 100, stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-dasharray': '3 3' }, g);
      svg('text', { x: 236, y: 112, 'font-size': 8.5, fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = 'antenna';
      // bars, scaled to 2 W (a conjugate source supplies 2 W); a longer bar is clipped with an arrow
      var bars = [['Radiated, in Rr', r.Pr, 'var(--accent)'], ['Heat in the antenna, in RL', r.PL, 'var(--ra-warm)'], ['Heat in the generator, in Rg', r.Pg, 'currentColor']];
      var y = 136, Wb = 300;
      svg('text', { x: 10, y: y - 8, 'font-size': 9, fill: 'currentColor', 'fill-opacity': 0.7 }, g).textContent = 'The source can give 1 W at most (dashed line)';
      bars.forEach(function (b) {
        svg('text', { x: 10, y: y + 4, 'font-size': 10, fill: 'currentColor' }, g).textContent = b[0] + ': ' + W(b[1]);
        svg('rect', { x: 10, y: y + 8, width: Wb * Math.min(1, b[1] / 2), height: 11, fill: b[2], 'fill-opacity': b[2] === 'currentColor' ? 0.35 : 0.75 }, g);
        if (b[1] > 2) svg('path', { d: 'M' + (10 + Wb) + ' ' + (y + 8) + ' l6 5.5 l-6 5.5 z', fill: 'currentColor' }, g);
        svg('line', { x1: 10 + Wb / 2, x2: 10 + Wb / 2, y1: y + 6, y2: y + 21, stroke: 'currentColor', 'stroke-opacity': 0.6, 'stroke-dasharray': '2 2' }, g);
        y += 36;
      });
    }
    function drawMap(g, Zg) {
      g.textContent = '';
      var F = RA.frame(g, [1, 1000], [-600, 600], [1, 10, 100, 1000], [-600, -300, 0, 300, 600], 'antenna resistance RA = Rr + RL (Ω, log scale)', 'XA (Ω)', String, String, true, false);
      var nx = 64, ny = 40, cells = svg('g', {}, g);
      for (var i = 0; i < nx; i++) for (var j = 0; j < ny; j++) {
        var R0 = Math.exp(Math.log(1000) * i / nx), R1 = Math.exp(Math.log(1000) * (i + 1) / nx), X0 = -600 + 1200 * j / ny, X1 = X0 + 1200 / ny;
        var p = circuit(Math.sqrt(R0 * R1), 0, (X0 + X1) / 2, Zg[0], Zg[1]).Pin;
        svg('rect', { x: F.X(R0), y: F.Y(X1), width: F.X(R1) - F.X(R0) + 0.3, height: F.Y(X0) - F.Y(X1) + 0.3, fill: 'var(--accent)', 'fill-opacity': (0.75 * p).toFixed(3) }, cells);
      }
      g.insertBefore(cells, g.firstChild);
      var cx = F.X(Zg[0]), cy = F.Y(-Zg[1]);
      svg('path', { d: 'M' + (cx - 5) + ' ' + (cy - 5) + 'l10 10m0 -10l-10 10', stroke: 'currentColor', 'stroke-width': 1.6 }, g);
      svg('text', { x: cx - 4, y: cy + 16, 'font-size': 9, 'text-anchor': 'end', fill: 'currentColor' }, g).textContent = 'conjugate of Zg: 1 W';
      var RAv = st.Rr + st.RL, inside = RAv >= 1 && RAv <= 1000 && Math.abs(st.XA) <= 600;
      svg('circle', { cx: F.clampX(F.X(Math.max(1, Math.min(1000, RAv)))), cy: F.clampY(F.Y(st.XA)), r: 4.5, fill: inside ? 'var(--ra-warm)' : 'none', stroke: 'var(--ra-warm)', 'stroke-width': 1.5 }, g);
    }
    function update() {
      paintGen();
      preBtns.forEach(function (p) { p[0].setAttribute('aria-pressed', String(Math.abs(p[1].Rr - st.Rr) < 0.01 * p[1].Rr && Math.abs(p[1].X - st.XA) < 0.6)); });
      var Zg = gen(), r = circuit(st.Rr, st.RL, st.XA, Zg[0], Zg[1]);
      drawCircuit(C.g, r, Zg);
      C.title.textContent = 'Series circuit of a source with internal impedance ' + zt(Zg[0], Zg[1]) + ' and an antenna of ' + zt(st.Rr + st.RL, st.XA) +
        '. Of a source that can give 1 W: radiated ' + W(r.Pr) + ', heat in the antenna ' + W(r.PL) + ', heat in the generator ' + W(r.Pg) + '.';
      drawMap(M.g, Zg);
      M.title.textContent = 'Power into the antenna, shaded from 0 to 1 W, over antenna resistance and reactance, for a source of ' + zt(Zg[0], Zg[1]) +
        '; the cross is the conjugate match and the dot is the current antenna, ' + W(r.Pin) + '.';
      rows.zg.td.textContent = zt(Zg[0], Zg[1]);
      rows.za.td.textContent = zt(st.Rr + st.RL, st.XA);
      rows.i.td.textContent = sig(1000 * r.I, 3) + ' mA (peak)';
      rows.ps.td.textContent = W(r.Ps) + ' (into the antenna ' + W(r.Pin) + ')';
      rows.eff.td.textContent = sig(100 * r.Pr / r.Ps, 3) + '%';
    }
    update();
  }

  // ---- terminals ----
  function terms(root, d, controls, stage) {
    var st = { L: +(d.length || 0.75), a: d.radius === '0.05' ? 0.05 : 0.5 };
    var setL = linSlider(controls, 'Length', 0.05, 1.5, 0.005, st.L, function (v) { return v.toFixed(3) + ' λ'; }, function (v) { st.L = v; update(); });
    var paintA = RA.toggle(controls, 'Wire radius', [[0.5, '0.5 mm wire'], [0.05, '0.05 mm wire']], function () { return st.a; }, function (v) { st.a = v; update(); });
    var jumps = RA.el('div', { class: 'ra-toggle' }, controls), jb = [];
    [[0.5, 'λ/2'], [0.75, '3λ/4'], [1, 'λ'], [1.5, '3λ/2']].forEach(function (j) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, jumps, j[1]);
      b.addEventListener('click', function () { setL(j[0]); });
      jb.push([b, j[0]]);
    });
    var Wp = panel(stage, 'Current on the wire', 150), P = RA.plotBox(stage, 'Resistance against length (log scale)'), pl = svg('g', {}, P.S);
    var rows = RA.readout(root, [['rmax', '<i>R</i><sub>r</sub> at the current maximum (4-70)'], ['feed', '<i>I</i><sub>in</sub> / <i>I</i><sub>0</sub> (4-78)'], ['rin', '<i>R</i><sub>in</sub> = <i>R</i><sub>r</sub> / sin²(<i>kl</i>/2) (4-79)'], ['mom', '<i>Z</i><sub>in</sub>, moment method'], ['g', '|Γ| on 50 Ω (moment method)']]);

    function drawWire(g) {
      g.textContent = '';
      var x0 = 160, sc = 290 / 1.5, h = st.L / 2, y0 = 82, A = 46, k = 2 * PI;
      var top = [], bot = [];
      for (var i = 0; i <= 200; i++) {
        var z = -h + st.L * i / 200, v = Math.abs(Math.sin(k * (h - Math.abs(z))));
        top.push([x0 + sc * z, y0 - A * v]); bot.push([x0 + sc * z, y0 + A * v]);
      }
      var dpath = 'M' + top.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'L' + bot.reverse().map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z';
      svg('path', { d: dpath, fill: 'var(--accent)', 'fill-opacity': 0.22, stroke: 'var(--accent)', 'stroke-width': 1 }, g);
      svg('line', { x1: x0 - sc * h, x2: x0 - 2.5, y1: y0, y2: y0, stroke: 'currentColor', 'stroke-width': 2.5 }, g);
      svg('line', { x1: x0 + 2.5, x2: x0 + sc * h, y1: y0, y2: y0, stroke: 'currentColor', 'stroke-width': 2.5 }, g);
      svg('circle', { cx: x0, cy: y0, r: 3.5, fill: 'currentColor', stroke: 'var(--bg, white)', 'stroke-width': 1 }, g);
      // current maxima: |sin k(h - |z|)| = 1 at h - |z| = 1/4 + n/2
      for (var n = 0; 0.25 + n / 2 <= h + 1e-9; n++) {
        var zz = h - 0.25 - n / 2;
        [-zz, zz].forEach(function (zv, q) {
          if (q && zz < 1e-9) return;
          svg('line', { x1: x0 + sc * zv, x2: x0 + sc * zv, y1: y0 - A - 4, y2: y0 + A + 4, stroke: 'currentColor', 'stroke-opacity': 0.55, 'stroke-dasharray': '3 2' }, g);
        });
      }
      svg('text', { x: 6, y: 14, 'font-size': 9, fill: 'currentColor', 'fill-opacity': 0.75 }, g).textContent = 'shaded: |I(z)|, sinusoidal; dashed: current maxima; dot: feed';
      svg('text', { x: x0, y: y0 + A + 16, 'font-size': 9, 'text-anchor': 'middle', fill: 'currentColor' }, g).textContent =
        'feed current = ' + Math.abs(Math.sin(PI * st.L)).toFixed(3) + ' of the maximum';
    }
    function drawPlot() {
      pl.textContent = '';
      var F = RA.frame(pl, [0.05, 1.5], [1, 10000], [0.25, 0.5, 0.75, 1, 1.25, 1.5], [1, 10, 100, 1000, 10000], 'length / λ', 'R (Ω)', String, function (v) { return v >= 1000 ? (v / 1000) + 'k' : String(v); }, false, true);
      svg('line', { x1: F.X(0.05), x2: F.X(1.5), y1: F.Y(50), y2: F.Y(50), stroke: 'currentColor', 'stroke-opacity': 0.5, 'stroke-dasharray': '1 2' }, pl);
      svg('text', { x: F.X(0.06), y: F.Y(50) - 3, 'font-size': 8, fill: 'currentColor', 'fill-opacity': 0.7 }, pl).textContent = '50 Ω';
      var a = [], b = [], m = [], m2 = [], other = st.a === 0.5 ? 0.05 : 0.5;
      for (var i = 0; i <= 290; i++) {
        var L = 0.05 + 1.45 * i / 290, t = terminals(L, st.a);
        a.push([L, Math.max(1, t.Rmax)]); b.push([L, Math.min(1e4, Math.max(1, t.Rin))]);
        m.push([L, Math.max(1, mom(L, st.a).R)]); m2.push([L, Math.max(1, mom(L, other).R)]);
      }
      var sA = { stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-dasharray': '5 3' }, sB = { stroke: 'var(--accent)', 'stroke-width': 1.8 },
        sM = { stroke: 'var(--ra-warm)', 'stroke-width': 1.8 }, sM2 = { stroke: 'var(--ra-warm)', 'stroke-width': 1, 'stroke-opacity': 0.45 };
      [[m2, sM2], [a, sA], [b, sB], [m, sM]].forEach(function (c) { svg('path', Object.assign({ d: RA.path(c[0], F), fill: 'none' }, c[1]), pl); });
      RA.legend(pl, 46, 220, [[sA, 'Rr at the current maximum']]);
      RA.legend(pl, 196, 220, [[sB, 'Rin, sinusoidal']]);
      RA.legend(pl, 46, 233, [[sM, 'Rin, moment method, ' + st.a + ' mm']]);
      RA.legend(pl, 216, 233, [[sM2, other + ' mm']]);
      svg('line', { x1: F.X(st.L), x2: F.X(st.L), y1: 24, y2: 176, stroke: 'currentColor', 'stroke-opacity': 0.4 }, pl);
      P.S.setAttribute('viewBox', '0 0 320 240');
      P.title.textContent = 'Radiation resistance at the current maximum and input resistance at the feed against dipole length from 0.05 to 1.5 wavelengths, log scale, with the moment-method input resistance of 0.5 mm and 0.05 mm wires at 2.45 GHz. The sinusoidal input resistance goes to infinity at one wavelength; the moment-method curves stay finite.';
    }
    function update() {
      paintA();
      jb.forEach(function (j) { j[0].setAttribute('aria-pressed', String(Math.abs(st.L - j[1]) < 1e-6)); });
      var t = terminals(st.L, st.a), z = mom(st.L, st.a);
      drawWire(Wp.g);
      Wp.title.textContent = 'A centre-fed dipole ' + st.L.toFixed(3) + ' wavelengths long with its sinusoidal current; the feed carries ' + t.feed.toFixed(3) + ' of the maximum current.';
      drawPlot();
      rows.rmax.td.textContent = ohm(t.Rmax);
      rows.feed.td.textContent = t.feed.toFixed(3);
      rows.rin.td.textContent = t.feed < 0.02 ? 'over 10⁵ Ω (model fails)' : ohm(t.Rin);
      rows.mom.td.textContent = zt(z.R, z.X);
      rows.g.td.textContent = gam(z.R, z.X, 50).toFixed(3);
    }
    update();
  }

  // ---- receive ----
  function receive(root, d, controls, stage) {
    var st = { x: +(d.x || 1) };
    var setX = logSlider(controls, '<i>D</i><sub>a</sub> / <i>D</i><sub>s</sub>', 0.01, 1, st.x, function (v) { return v.toFixed(3); }, function (v) { st.x = v; update(); });
    var pb = RA.el('div', { class: 'ra-toggle' }, controls), btns = [];
    POINTS.forEach(function (p) {
      var b = RA.el('button', { type: 'button', class: 'ra-button', 'aria-pressed': 'false' }, pb, p.label);
      b.addEventListener('click', function () { setX(p.x); });
      btns.push([b, p]);
    });
    var B = panel(stage, 'Where the captured power goes', 150), P = RA.plotBox(stage, 'Absorbed share against Da / Ds'), pl = svg('g', {}, P.S);
    var rows = RA.readout(root, [['circ', 'Thevenin circuit, (2-86) to (2-89)'], ['lo', 'Smallest absorbed share allowed'], ['hi', 'Largest absorbed share allowed']]);

    function bar(g, y, label, lo, hi) {
      svg('text', { x: 10, y: y, 'font-size': 10, fill: 'currentColor' }, g).textContent = label;
      var x0 = 10, Wb = 300;
      svg('rect', { x: x0, y: y + 5, width: Wb, height: 14, fill: 'currentColor', 'fill-opacity': 0.18 }, g);
      svg('rect', { x: x0, y: y + 5, width: Wb * lo, height: 14, fill: 'var(--accent)', 'fill-opacity': 0.8 }, g);
      if (hi > lo) svg('rect', { x: x0 + Wb * lo, y: y + 5, width: Wb * (hi - lo), height: 14, fill: 'var(--accent)', 'fill-opacity': 0.3 }, g);
    }
    function update() {
      btns.forEach(function (b) { b[0].setAttribute('aria-pressed', String(Math.abs(st.x - b[1].x) < 1e-3)); });
      var bd = bounds(st.x), g = B.g;
      g.textContent = '';
      bar(g, 20, 'The circuit: half to the load, half scattered', 0.5, 0.5);
      bar(g, 66, 'Allowed for this antenna: ' + (100 * bd[0]).toFixed(1) + '% to ' + (100 * bd[1]).toFixed(1) + '% to the load', bd[0], bd[1]);
      btns.forEach(function (b) {
        if (Math.abs(st.x - b[1].x) < 1e-3) bar(g, 112, 'The ' + b[1].label + ': ' + Math.round(100 * b[1].eta) + '% to the load', b[1].eta, b[1].eta);
      });
      B.title.textContent = 'Share of the captured power delivered to a conjugate-matched load: the Thevenin circuit always gives 50%; for Da/Ds = ' + st.x.toFixed(3) + ' the optical theorem allows ' + (100 * bd[0]).toFixed(1) + '% to ' + (100 * bd[1]).toFixed(1) + '%.';

      pl.textContent = '';
      var F = RA.frame(pl, [0, 1], [0, 1], [0, 0.25, 0.5, 0.75, 1], [0, 0.25, 0.5, 0.75, 1], 'Da / Ds (antenna directivity over scatter directivity)', 'to the load', String, function (v) { return Math.round(100 * v) + '%'; }, false, false);
      var lo = [], hi = [];
      for (var i = 0; i <= 200; i++) { var x = i / 200, q = bounds(x); lo.push([x, q[0]]); hi.push([x, q[1]]); }
      svg('path', { d: RA.path(hi.concat(lo.slice().reverse()), F) + 'Z', fill: 'var(--accent)', 'fill-opacity': 0.18, stroke: 'var(--accent)', 'stroke-width': 1.4 }, pl);
      svg('line', { x1: F.X(0), x2: F.X(1), y1: F.Y(0.5), y2: F.Y(0.5), stroke: 'currentColor', 'stroke-dasharray': '4 3', 'stroke-opacity': 0.7 }, pl);
      svg('text', { x: F.X(0.02), y: F.Y(0.5) - 4, 'font-size': 8.5, fill: 'currentColor', 'fill-opacity': 0.8 }, pl).textContent = 'Thevenin circuit: 50%';
      POINTS.forEach(function (p) {
        svg('circle', { cx: F.X(p.x), cy: F.Y(p.eta), r: 4, fill: 'var(--ra-warm)' }, pl);
        svg('text', { x: F.X(p.x) - (p.x > 0.8 ? 6 : -7), y: F.Y(p.eta) + (p.x > 0.8 ? 14 : 14), 'font-size': 8.5, 'text-anchor': p.x > 0.8 ? 'end' : 'start', fill: 'currentColor' }, pl).textContent = p.label;
      });
      svg('line', { x1: F.X(st.x), x2: F.X(st.x), y1: F.Y(bd[0]), y2: F.Y(bd[1]), stroke: 'currentColor', 'stroke-width': 2 }, pl);
      P.title.textContent = 'Allowed absorbed share of a matched lossless receiving antenna against the ratio of its directivity to the directivity of its scattered field, from the optical theorem: a band between (1 − √(1 − x))/2 and (1 + √(1 − x))/2, meeting at 50% for x = 1. Points: thin dipole 50%, three-dipole endfire array 93% at x = 0.252.';
      rows.circ.td.textContent = '50%, always';
      rows.lo.td.textContent = (100 * bd[0]).toFixed(1) + '%';
      rows.hi.td.textContent = (100 * bd[1]).toFixed(1) + '%';
    }
    update();
  }

  function init(root) {
    var d = root.dataset, kind = d.case || 'transmit';
    root.textContent = '';
    var controls = RA.el('div', { class: 'ra-controls' }, root), stage = RA.el('div', { class: 'ra-pattern-stage' }, root);
    (kind === 'terminals' ? terms : kind === 'receive' ? receive : transmit)(root, d, controls, stage);
  }
  document.querySelectorAll('[data-widget="antenna-circuit"]:not([data-ready])').forEach(function (root) {
    root.setAttribute('data-ready', '');
    init(root);
  });
})();
