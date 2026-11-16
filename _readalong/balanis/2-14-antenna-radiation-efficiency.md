---
title: Antenna Radiation Efficiency
book: balanis
section: "2.14"
---

## What this section is really saying

All the heat an antenna makes, in its metal and in any dielectric, is lumped into one resistor $$R_L$$ in series with the radiation resistance $$R_r$$, so the radiation efficiency is $$e_{cd} = R_r/(R_r + R_L)$$.[^ecd] For a metal wire Balanis gives $$R_L$$ from its dc resistance and from the skin effect. So radiation efficiency is a contest between two resistors, and the metal only decides one of them.

## Predict first

A copper half-wave dipole for 2.45 GHz Wi-Fi, and a 10 m copper wire fed as a dipole at 100 kHz, where the wavelength is 3 km. Which one turns more of its power into heat?

## Where the current flows in a wire

At radio frequencies the current crowds towards the surface of a wire and decays into it over the skin depth $$\delta = \sqrt{2/\omega\mu_0\sigma}$$. Balanis eq. (2-90b) replaces this with a uniform current in a layer one skin depth thick:[^rhf]

$$
R_{hf} = \frac{l}{2\pi b}\sqrt{\frac{\omega\mu_0}{2\sigma}},
$$

for a wire of radius $$b$$. The exact answer for a round wire comes in Bessel functions, and for a thick wire it comes to $$R_{hf}$$ plus a quarter of the dc resistance.[^schel]

The metals are copper at Balanis's $$5.7\times10^7$$ S/m, aluminium 6061-T6 at 43% of the annealed-copper standard ($$2.49\times10^7$$ S/m), and stainless steel 304 ($$1.39\times10^6$$ S/m).[^metals]

### Things to try

1. *0.1 mm wire at 1 MHz*: $$\delta = 66.7$$ µm, so the wire is only 1.5 skin depths thick. The true resistance is 1.10 times the dc value; eq. (2-90b) gives 0.75 times, i.e. 32% too low.
2. *Balanis's 100 MHz dipole wire* (0.9 mm radius): 135 skin depths, and eq. (2-90b) is within 0.4%.
3. Shrink the radius until the dashed ring reaches the centre, at $$b = \delta$$: eq. (2-90b) is now half the true value. It is 15% low at $$b/\delta = 3$$ and 5% low at 10.
4. *Stainless*: its conductivity is 41 times lower than copper's, so its skin depth is 6.4 times larger.

{% include readalong/wire-loss.html case="skin" f="1" radius="0.1" caption="Left: current density across a round wire, from Schelkunoff's exact solution; stronger colour is more current, the dashed ring is one skin depth in from the surface. Right: resistance over its dc value, against wire radius in skin depths, log scales: exact, the skin formula of Balanis eq. (2-90b), and the dc value (2-90a). Conductivities: copper 5.7e7 S/m, aluminium 6061-T6 2.49e7 S/m, stainless 304 1.39e6 S/m." %}

## The dipole

On a dipole the current is not uniform, so each piece of wire loses power in proportion to $$\vert I(z)\vert^2$$. For the half-wave dipole this weighting gives $$R_L = R_{hf}/2$$, the factor in Balanis Example 2.13.[^ex] The widget does the same weighting for any length, with the exact resistance per metre, and refers both $$R_r$$ and $$R_L$$ to the feed. Near $$l = \lambda$$ the current at the feed goes to zero and both resistances blow up there, but their ratio doesn't: $$e_{cd}$$ only needs both referred to the same current.

### Things to try

1. *Balanis's 100 MHz dipole*: 99.52%, same as his Example 2.13. The exact wire resistance changes only the fourth digit.
2. *Wi-Fi dipole* ($$0.47\lambda$$, 0.5 mm wire): $$R_r = 61.2\ \Omega$$ against $$R_L = 0.113\ \Omega$$, so 99.82%. Switch to stainless and it is still 98.8%, a loss of 0.05 dB.
3. *10 m wire at 100 kHz*: $$R_r = 0.0022\ \Omega$$ against $$R_L = 0.049\ \Omega$$, so 4.3%; 96% of the power heats the copper. With eq. (2-90b) it would read 4.7%, since the wire is only 4.7 skin depths thick.
4. Keep the length and drop the frequency. $$R_r$$ of a short dipole falls as $$f^2$$ while $$R_L$$ falls only as $$\sqrt f$$, so every decade down multiplies $$R_L/R_r$$ by about 32.

{% include readalong/wire-loss.html case="dipole" f="100" radius="0.9" length="0.5" caption="Left: radiation efficiency of a centre-fed dipole against its length in wavelengths, with the exact wire resistance and with the skin formula of Balanis eq. (2-90b). Right: radiation resistance (induced-EMF formula, Balanis eq. (8-60a)) and loss resistance, both referred to the feed, against length, log scales. Sinusoidal current, Balanis eq. (4-56)." %}

## The small loop

A small loop is much worse. Its radiation resistance goes as the fourth power of its size, $$20\pi^2(C/\lambda)^4$$ for a single turn of circumference $$C$$, against the square for a short dipole.[^loop] Its loss resistance is that of a straight wire of length $$C$$ carrying the full current all the way round.[^looploss] So bend a short dipole into a ring and its loss resistance triples, since the current no longer tapers to zero at the ends, while its radiation resistance collapses.

### Things to try

1. *10 cm loop at 10 MHz*, 1 mm copper wire: $$R_r = 3.8\times10^{-5}\ \Omega$$ against $$R_L = 0.084\ \Omega$$, so 0.045%. The same 63 cm of wire, straightened into a dipole, reaches 76%.
2. *1 m loop of 22 mm tube at 14 MHz*: 67%. A loop needs to be large and fat to be efficient.
3. More turns raise $$R_r$$ as $$N^2$$, but the turns crowd each other's current (the proximity effect), which the widget leaves out.[^looploss]

{% include readalong/wire-loss.html case="loop" f="10" radius="1" c="0.02094" caption="Radiation efficiency against wire length in wavelengths for a single-turn small loop (radiation resistance from Balanis eq. (5-24), uniform current) and for a straight dipole of the same wire (sinusoidal current, as above). Small-loop formula, so circumferences up to 0.3 wavelength only." %}

## The gap

<details markdown="1">
<summary markdown="span">The exact resistance of a round wire</summary>

Inside a good conductor the current density obeys a diffusion equation. For a round wire it depends only on the distance $$r$$ from the axis, and the solution that stays finite on the axis is $$J(r) \propto J_0(kr)$$, with $$k = (1-j)/\delta$$. Divide the field at the surface by the total current and the impedance per unit length is

$$
Z' = \frac{k}{2\pi b\,\sigma}\,\frac{J_0(kb)}{J_1(kb)}.
$$

For a thin wire, $$kb \to 0$$ and $$J_0/J_1 \to 2/kb$$, which gives back $$1/\sigma\pi b^2$$, the dc value. For a thick wire the Bessel functions turn into exponentials and

$$
R' \approx \frac{1}{2\pi b}\sqrt{\frac{\omega\mu_0}{2\sigma}} + \frac{1}{4\sigma\pi b^2},
$$

i.e. eq. (2-90b) plus a quarter of the dc resistance, within 1% once $$b > 4.2\,\delta$$.[^schel]

</details>

## Common confusion

1. "Eq. (2-90b) is the ac resistance of a wire." Only for a wire many skin depths thick. It is 51% low when the radius is one skin depth, 15% at three and 5% at ten.
2. "A copper antenna is an efficient antenna." The same copper gives 99.8% as a Wi-Fi dipole and 4.3% as a 10 m wire at 100 kHz. What decides it is how small $$R_r$$ is.

## In the book

- [§2.14](../2-14-antenna-radiation-efficiency/), pp. 85–86: eq. (2-90), the dc resistance (2-90a) and the skin formula (2-90b), p. 86; Example 2.13, p. 86. Its dB line takes the logarithm of 0.9905 instead of 0.9952; the −0.02 dB it prints is right for 0.9952. The $$R_{hf}/2$$ factor is left to Problem 2.52.
- The efficiency chain $$e_0 = e_r e_c e_d$$: [§2.8](../2-8-antenna-efficiency/). $$R_r$$ and $$R_L$$ in the antenna's circuit: [§2.13](../2-13-input-impedance/).
- Dipole radiation resistance: §4.5.3, eq. (4-70), p. 177; §8.5, eq. (8-60a), p. 465. Small loop: §5.2, eq. (5-24), p. 238; its loss resistance and the proximity effect, eq. (5-25) and Fig. 5.3, pp. 239–240.

---

## References

[^ecd]: Balanis, [§2.14](../2-14-antenna-radiation-efficiency/), eq. (2-90), pp. 85–86.
[^rhf]: Balanis, [§2.14](../2-14-antenna-radiation-efficiency/), eqs. (2-90a) and (2-90b), p. 86.
[^schel]: S. A. Schelkunoff, "The electromagnetic theory of coaxial transmission lines and cylindrical shields," *Bell System Technical Journal*, vol. 13, no. 4, pp. 532–579, 1934, [doi:10.1002/j.1538-7305.1934.tb00679.x](https://doi.org/10.1002/j.1538-7305.1934.tb00679.x), eqs. (65) to (67), pp. 551–552 ([scan](https://archive.org/details/bstj13-4-532)). He writes it with modified Bessel functions; ours is the same function.
[^metals]: Copper: Balanis, Example 2.13, p. 86. The International Annealed Copper Standard, 58 m/(Ω·mm²) at 20 °C, i.e. $$5.8\times10^7$$ S/m: National Bureau of Standards, *Copper Wire Tables*, Handbook 100, 1966, p. 2 ([pdf](https://nvlpubs.nist.gov/nistpubs/Legacy/hb/nbshandbook100.pdf)). Aluminium 6061-T6, 43% IACS at 20 °C: Protolabs, "Sheet Coil & Plate Alloy 6061, Technical Data" ([pdf](https://Protolabs.com/media/1021492/6061-t651-cnc.pdf)). Stainless 304, 72 µΩ·cm at 20 °C: Cleveland-Cliffs, "304/304L Stainless Steel" product data bulletin, 2021 ([pdf](https://d1io3yog0oux5.cloudfront.net/_7ce3a04c09e74bf31ff5f89fc888db25/clevelandcliffs/db/1190/10510/file/CLF_ProductData_304-304LSS_052021.pdf)).
[^ex]: Balanis, Example 2.13, p. 86, which refers the factor to Problem 2.52.
[^loop]: Balanis, §5.2, eq. (5-24), p. 238.
[^looploss]: Balanis, §5.2, p. 239: the single-turn loss as a straight wire of length $$C$$, and eq. (5-25) with Fig. 5.3 for the proximity effect in multiturn loops.
