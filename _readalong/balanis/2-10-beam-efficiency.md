---
title: Beam Efficiency
book: balanis
section: "2.10"
---

## What this section is really saying

Beam efficiency is the share of the radiated power that goes into a cone of half-angle $$\theta_1$$ around the beam (Balanis eqs. 2-53 and 2-54).[^be] Put $$\theta_1$$ at the first null and it is the share in the main lobe; the rest leaks out through the side lobes. Both powers are radiated powers, so losses and mismatch cancel: beam efficiency depends on the shape of the pattern alone, like directivity.

## Predict first

A dish lit uniformly across its face has the highest directivity any dish of its size can have. What share of its power is inside its first null? And inside its half-power cone?

## How much of the power is in the beam

The dish here is the circular aperture of [§2.5](../2-5-beamwidth/) and [§2.6](../2-6-directivity/): diameter $$d$$, lit as $$(1-\rho^2)^p$$ from the centre ($$\rho = 0$$) to the rim ($$\rho = 1$$), where $$p = 0$$ is uniform, 1 parabolic and 2 parabolic squared.[^taper] The cone is set by $$u_1 = ka\sin\theta_1$$, with $$a = d/2$$, so it keeps its place on the beam when the dish grows. Balanis's own curves for this aperture (his Fig. 12.21) use the same $$u$$.[^ch12]

### Things to try

1. *Uniform*, cone at the first null: 83.8%. One sixth of the power is in the side lobes, which is far from the "high 90s" the book asks for.
2. *Half-power cone*: 47.4%. Less than half of the power is inside the half-power beamwidth.
3. *Parabolic*, first null: 98.2%. *Parabolic²*: 99.7%. The price is in the readout: the aperture efficiency falls to 0.75 and then 0.56, i.e. 1.25 dB and 2.55 dB of directivity lost. A dish with almost no power outside its main lobe is a dish with a wider main lobe.
4. Press *NEXRAD dish* ($$d/\lambda = 81.2$$) and then slide down to $$d/\lambda = 3$$: the angles change a lot (the first null of the parabolic taper goes from 1.15° to 33°) but the percentages hardly move (98.2% against 97.8%). Beam efficiency at the first null is a property of the taper, not of the size.

{% include readalong/beam-efficiency.html taper="0" dl="nexrad" cone="null" radiometer="off" caption="Left: the power pattern of a circular dish in dB against the angle off its axis, with the cone shaded. Right: the share of the radiated power inside a cone of half-angle θ₁ for the three tapers (the chosen one in blue; dots: first nulls). The model radiates into the front half only. NEXRAD: 8.54 m at 2.85 GHz, so d/λ = 81.2." %}

## Why radiometers care

A radiometer measures the heat a scene radiates, as a temperature. What it reads is the average of the scene weighted by the pattern, so with a fraction BE of the power in the main beam,

$$
T_A = \mathrm{BE}\;\bar T_{main} + (1-\mathrm{BE})\;\bar T_{side}
$$

where $$\bar T_{main}$$ and $$\bar T_{side}$$ are the average temperatures seen by the main beam and by everything else. Consider this scenario, with round numbers: the main beam is on the sea at 100 K, and the side lobes see land at 280 K.

### Things to try

1. *Uniform*: the radiometer reads 129.2 K, 29 K too warm. The side lobes hold 16% of the power, but they look at something almost three times as hot.
2. *Parabolic*: 103.2 K. A 1.25 dB loss in directivity buys a reading 9 times more accurate.
3. Set both temperatures equal: the error goes to zero for any taper. Beam efficiency only matters when the scene outside the beam is different from the scene inside it, which for a satellite looking at a coastline or a telescope looking past the Sun is always.

{% include readalong/beam-efficiency.html taper="0" dl="nexrad" cone="null" radiometer="on" tmain="100" tside="280" caption="The same dish and cone, with a radiometer behind it. The main beam sees one temperature and the side lobes another; the reading is their average weighted by the beam efficiency. Illustrative temperatures, not measured data." %}

## The gap

<details markdown="1">
<summary markdown="span">Where 83.8% comes from</summary>

For a narrow beam, $$\sin\theta \approx \theta$$, so $$u = ka\theta$$ and $$d\Omega \approx \theta\,d\theta\,d\phi$$. The uniform dish has $$U \propto [2J_1(u)/u]^2$$, so the power inside $$u_1$$ is proportional to

$$
\int_0^{u_1} \frac{4J_1^2(u)}{u^2}\,u\,du = 4\int_0^{u_1} \frac{J_1^2(u)}{u}\,du
$$

Now use $$J_0' = -J_1$$ and $$J_1' = J_0 - J_1/u$$:

$$
\frac{d}{du}\left[J_0^2 + J_1^2\right] = -2J_0J_1 + 2J_1\left(J_0 - \frac{J_1}{u}\right) = -\frac{2J_1^2}{u}
$$

So the integral is $$2\left[1 - J_0^2(u_1) - J_1^2(u_1)\right]$$, since $$J_0(0) = 1$$ and $$J_1(0) = 0$$. As $$u_1 \to \infty$$ both Bessel functions go to zero and the total is 2. Dividing,

$$
\mathrm{BE}(u_1) = 1 - J_0^2(u_1) - J_1^2(u_1)
$$

At the first null, $$u_1 = 3.832$$ and $$J_1 = 0$$, so $$\mathrm{BE} = 1 - J_0^2(3.832) = 1 - 0.403^2 = 0.838$$.

</details>

<details markdown="1">
<summary markdown="span">Beam efficiency and the beam solid angle</summary>

The beam solid angle $$\Omega_A$$ of [§2.6](../2-6-directivity/) is the integral of the normalised pattern over the whole sphere (Balanis eq. 2-24).[^omega] Stop the same integral at the first null and you get a *main-beam* solid angle $$\Omega_M$$. The ratio of the two is eq. (2-54) with $$\theta_1$$ at the first null, so

$$
\mathrm{BE} = \frac{\Omega_M}{\Omega_A}
$$

and since $$D_0 = 4\pi/\Omega_A$$, a main lobe of fixed shape gets less directivity the more power the side lobes hold.

</details>

## Common confusion

1. Beam efficiency is not an efficiency like $$e_{cd}$$ or $$e_0$$ of [§2.8](../2-8-antenna-efficiency/). It compares two parts of the radiated power, so a lossy antenna and a lossless one with the same pattern have the same beam efficiency.
2. "The beam" in the half-power sense holds only about half the power: 47% for the uniform dish, 54% for the parabolic one. Most of the rest is in the main lobe between the half-power points and the first null, and the side lobes get what is left.

## In the book

- §2.10, pp. 69–70: definition (2-53), the integral (2-54); the beam on the $$z$$-axis as in Fig. 2.1(a).
- Beam efficiency of real apertures: §12.5.4, p. 682, Fig. 12.15 and Example 12.4 (square apertures); §12.6.3, p. 691, Fig. 12.21, p. 694 (circular apertures).
- The beam solid angle: §2.6, eqs. (2-23) to (2-25). Tapers and side lobes: §7.10.2 and §12.7.

---

## References

[^be]: Balanis, §2.10, eqs. (2-53) and (2-54), pp. 69–70.
[^taper]: Balanis, §7.10.2, eqs. (7-45) and (7-46) and Table 7.2, pp. 421–422: circular apertures lit as $$(1-\rho^2)^n$$, $$n = 0, 1, 2$$.
[^ch12]: Balanis, §12.6.3, p. 691, and Fig. 12.21, p. 694, after W. F. Croswell in D. G. Fink (ed.), *Electronics Engineers' Handbook* (McGraw-Hill, 1975). The square-aperture version is §12.5.4 and Fig. 12.15, pp. 682–683.
[^omega]: Balanis, §2.6, eqs. (2-23) to (2-25), p. 50.
