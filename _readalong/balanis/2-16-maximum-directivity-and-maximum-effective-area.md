---
title: Maximum Directivity and Maximum Effective Area
book: balanis
section: "2.16"
---

## What this section is really saying

Directivity says how well an antenna aims when it transmits; effective area says how much it collects when it receives. They are the same property seen from the two ends of a link, and the exchange rate between them is one number for every antenna:

$$
A_{em} = \frac{\lambda^2}{4\pi}D_0,
$$

Balanis eq. (2-110).[^ae] Losses, mismatch and polarization then cut it down, eqs. (2-111) and (2-112).

## Predict first

Two Wi-Fi access points: one has a half-wave dipole, the other a 15 dBi panel antenna. Which one has the bigger effective area, and by roughly how much?

## One exchange rate, fixed by one antenna

Balanis puts two antennas a distance $$R$$ apart, Fig. 2.30, and sends power one way and then the other. If the space between them is linear, passive and isotropic, the received power is the same both ways, and that forces $$D/A_e$$ to be the same for both antennas, eq. (2-105).[^twoway] Turn either antenna and the same argument holds for each pair of directions, so the rule is not only for the peak: $$A_e(\theta,\phi) = (\lambda^2/4\pi)D(\theta,\phi)$$ in every direction.

What the two-antenna argument can't give is the value of the ratio. Balanis borrows it from the short dipole of §2.15, whose $$A_{em} = 0.119\lambda^2$$ came from its circuit and $$D_0 = 1.5$$ from its pattern: $$0.119\lambda^2/1.5 = \lambda^2/4\pi$$, eq. (2-108). The answer to the question at the top follows: the panel's area is $$10^{1.5}/1.64 = 19$$ times the dipole's.

Now integrate $$A_e(\theta,\phi)$$ over the whole sphere. Directivity averages to exactly 1 over the sphere (that is its definition, §2.6), so for every lossless antenna

$$
\oint A_e\,d\Omega = \lambda^2.
$$

This is a fixed budget. An antenna can't make more area; it can only move it from some directions to others.

### Things to try

1. *Isotropic*, Wi-Fi: 11.9 cm² in every direction, and half of the budget comes from half of the sky.
2. *Half-wave dipole*, Wi-Fi: 19.6 cm² broadside, the same number §2.15 got from the circuit. Along the wire there is none, and half the budget comes from 32% of the sky.
3. *Half-wave dipole*, FM: the same pattern, but 1.17 m². The budget scales with $$\lambda^2$$, so a lower frequency means a bigger antenna in every direction.
4. *NEXRAD dish*: 43.0 m² straight ahead, 75% of the 57.3 m² face for this taper. Half of its budget comes from 0.56 square degrees, i.e. 0.0014% of the sky. The same dish collects next to nothing from anywhere else.
5. With the dish, change only $$d/\lambda$$: the peak area grows with the face, and the budget curve moves left. Its end is always 100% at $$4\pi$$.

{% include readalong/area-budget.html pattern="half" band="wifi" caption="Left: effective area against direction (θ from the z axis), linear, scaled to its peak; the dashed circle is the isotropic area λ²/4π at the same frequency. Dipoles lie along z; the dish looks along z and is taken to radiate nothing behind it. Right: the directions are sorted from the largest effective area down, and the curve is the share of λ² they collect against the solid angle they fill, on a log scale; the dot marks half. Dish: circular aperture lit as (1 − ρ²)ⁿ, as in §2.5. Half-wave dipole: Balanis eq. (4-84)." %}

## Two ovens: the exchange rate without any antenna

There is a way to get $$\lambda^2/4\pi$$ that doesn't lean on the short dipole at all, and I like it more.[^era] Put a lossless antenna inside a closed oven whose walls are black and at temperature $$T$$. Connect it, through a filter of bandwidth $$B$$, to a matched resistor in a second oven at the same temperature.

The resistor sends thermal noise down the line, $$kTB$$ (Nyquist). The antenna collects the walls' glow: in one polarization, half of the Rayleigh–Jeans brightness $$2kT/\lambda^2$$ per unit area and solid angle, over its effective area in every direction. Both ovens are at the same temperature, so no net power can flow from one to the other; otherwise one oven would heat the other with no temperature difference between them, which the second law forbids. Setting the two equal gives $$\oint A_e\,d\Omega = \lambda^2$$ again, for any antenna, aimed anywhere.

In the figure the cone is the horn's beam. The walls glow equally in every direction, so whichever patch of absorber the beam lands on, the horn collects the same power: turn it and the patch moves, the readout doesn't. Turn the knob and the field gets stronger as $$\sqrt T$$ and the noise power as $$T$$, on both sides at once.

{% include readalong/cavities.html %}

## The gap

<details markdown="1">
<summary markdown="span">The two ovens, in equations</summary>

The resistor delivers $$kT$$ per hertz to a matched line. The walls of a black cavity at temperature $$T$$, at radio frequencies where $$h\nu \ll kT$$, have a brightness (power per unit area, per steradian, per hertz)

$$
B_\nu = \frac{2kT}{\lambda^2},
$$

shared equally between two polarizations. An antenna receives one of them, so it collects

$$
P_\nu = \frac{1}{2}\oint A_e(\theta,\phi)\,B_\nu\,d\Omega = \frac{kT}{\lambda^2}\oint A_e\,d\Omega.
$$

No net flow means $$P_\nu = kT$$, hence $$\oint A_e\,d\Omega = \lambda^2$$, i.e. the average of $$A_e$$ over the sphere is $$\lambda^2/4\pi$$.[^era] With $$A_e \propto D$$ from Balanis eq. (2-105) per direction, and $$D$$ averaging to 1, eq. (2-110) follows.

At 290 K and $$B = 1$$ MHz both sides carry $$kTB = 4.00$$ fW, about $$-114$$ dBm, which is where the familiar receiver noise floor of $$-174$$ dBm/Hz comes from.

</details>

## Common confusion

1. "Higher frequencies fade faster in free space." The $$1/\lambda^2$$ in the Friis equation (§2.17) is the receive antenna's area at fixed gain, $$\lambda^2D/4\pi$$, not a loss in space. Hold the areas fixed instead: two 60 cm dishes with 60% aperture efficiency, 1 km apart, pass $$-64.9$$ dB at 1 GHz and $$-44.9$$ dB at 10 GHz, 20 dB better. Two half-wave dipoles go from $$-88.2$$ dB to $$-108.2$$ dB, 20 dB worse.
2. "An isotropic antenna has no area because it has no size." It has $$\lambda^2/4\pi$$ in every direction, 11.9 cm² at 2.45 GHz, and that is the average of every lossless antenna at that frequency.

## In the book

- §2.16, pp. 92–94. Fig. 2.30 and eqs. (2-101) to (2-103), p. 92. Eqs. (2-103a) to (2-110), p. 93. Losses, mismatch and polarization, eqs. (2-111) and (2-112), p. 94.
- The short dipole's $$A_{em} = 3\lambda^2/8\pi$$: Example 2.15, §2.15. Directivity and beam solid angle: §2.6. The efficiencies in (2-111) and (2-112): §2.8 and §2.12.2. Equation (2-110) is the step into the Friis equation, §2.17, eq. (2-115); the same brightness argument returns in antenna temperature, §2.18.

---

## References

[^ae]: Balanis, §2.16, eq. (2-110), p. 93; with losses, eq. (2-111), and with mismatch and polarization, eq. (2-112), p. 94.
[^twoway]: Balanis, §2.16, eqs. (2-101) to (2-105), pp. 92–93; the ratio for the short dipole, eqs. (2-107) and (2-108), p. 93.
[^era]: J. J. Condon and S. M. Ransom, *Essential Radio Astronomy* (Princeton University Press, 2016), §3.1.4, "The Effective Area of a Receiving Antenna", eqs. (3.36) to (3.41), and $$A_0\Omega_A = \lambda^2$$, eq. (3.43); [online edition at NRAO](https://www.cv.nrao.edu/~sransom/web/Ch3.html).
