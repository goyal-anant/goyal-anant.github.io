---
title: Radiation Intensity
book: balanis
section: "2.4"
---

## What this section is really saying

The power density $$W$$ of §2.3 falls as $$1/r^2$$, so it describes the distance as much as the antenna. Multiply it by $$r^2$$ and the distance drops out: what is left, $$U = r^2 W$$, is the power per unit solid angle, in watts per steradian, and it depends only on the direction. Add $$U$$ up over all directions and you get the radiated power.

## Predict first

A 100 mW half-wave dipole stands vertically. Split the sphere around it into 18 bands, each 10° of polar angle wide. Which band carries more power: the one around the equator, or the one at the top? And by about how much? Check on the second widget.

## Why the distance drops out

A solid angle is to a sphere what an angle is to a circle: a cone from the centre cuts a patch of area $$A$$ on a sphere of radius $$r$$, and its solid angle is $$\Omega = A/r^2$$ steradians. The whole sphere is $$4\pi$$ sr.[^sr] So a fixed cone cuts a patch which grows as $$r^2$$, while the density falls as $$1/r^2$$, and the power through the patch is the same at every distance. Power per steradian is the number that stays.

1. Leave the cone at 10° half-angle, pointing broadside ($$\theta = 90°$$). Its solid angle is 0.09546 sr, i.e. 313 square degrees. At 10 m the patch is 9.546 m² and $$W$$ is 130.6 µW/m²; at 100 m the patch is 954.6 m² and $$W$$ is 1.306 µW/m². The power through it stays 1.233 mW.
2. The power is close to $$U\,\Omega = 13.06 \times 0.09546 = 1.247$$ mW, a little less because $$U$$ drops away from broadside inside the cone. Make the cone 2° and the two agree to 0.05%: $$U$$ is the power through a small cone divided by its solid angle.
3. Turn the cone to $$\theta = 30°$$: $$U$$ falls to 2.279 mW/sr, and at $$\theta = 0°$$, along the wire, to zero.

{% include readalong/solid-angle.html view="cone" %}

## Adding up over the sphere

To get the total power, add $$U\,d\Omega$$ over all directions (Balanis eq. 2-13):

$$
P_{rad} = \int_0^{2\pi}\!\!\int_0^{\pi} U(\theta,\phi)\,\sin\theta\,d\theta\,d\phi
$$

The $$\sin\theta$$ is the size of the band. A ring at polar angle $$\theta$$ has radius $$r\sin\theta$$, so a band of width $$d\theta$$ has area $$2\pi r^2\sin\theta\,d\theta$$: wide at the equator, nothing at the poles.[^domega] The band within 30° of the equator is half the sphere; the two caps within 30° of the poles together are only 13%.

1. Start with *Isotropic*, where $$U$$ is the same everywhere. The band from 0° to 10° is 0.09546 sr, 0.76% of the sphere, and carries 0.7596 mW; the band from 80° to 90° is 1.091 sr, 8.7%, and carries 8.682 mW. Same $$U$$, eleven times the power, only because the band is bigger.
2. Switch to *Half-wave dipole*. Now both effects push the same way: $$U$$ is largest broadside and the bands are largest there too. The 80° to 90° band carries 14.04 mW, the top band 0.01174 mW. The total is still 100.0 mW.
3. Press *Forget sin θ*. Every band now counts as if it were as big as the equator's, and the total jumps to 157.1 mW for the isotropic source, 117.8 mW for the short dipole and 115.2 mW for the half-wave dipole. The dashed outlines are the correct bars.

{% include readalong/solid-angle.html view="rings" pattern="iso" %}

## The gap

<details markdown="1">
<summary markdown="span">Where $$U = \vert\mathbf{E}\vert^2 r^2/2\eta$$ (eq. 2-12a) comes from</summary>

Far from the antenna the fields look locally like a plane wave going outward: $$\mathbf{H} = \hat{\mathbf{a}}_r\times\mathbf{E}/\eta$$, with $$\mathbf{E}$$ transverse. Then

$$
\tfrac12\,\mathrm{Re}\left(\mathbf{E}\times\mathbf{H}^*\right) = \hat{\mathbf{a}}_r\,\frac{\vert\mathbf{E}\vert^2}{2\eta}
$$

and the far field has the form $$\mathbf{E} = \mathbf{E}^\circ(\theta,\phi)\,e^{-jkr}/r$$, so $$\vert\mathbf{E}\vert^2 = \vert\mathbf{E}^\circ\vert^2/r^2$$. Multiply by $$r^2$$ and you get $$U = \vert\mathbf{E}^\circ\vert^2/2\eta$$, with no $$r$$ left. This is why a plot of $$U$$ is the power pattern.[^U]

</details>

<details markdown="1">
<summary markdown="span">Why $$U$$ is called a far-field parameter</summary>

You can compute $$r^2\,\mathrm{Re}\,W_r$$ at any distance, but close to the antenna it is not yet the pattern. For a half-wave dipole, from its exact fields,[^near] here it is divided by the far-field $$U$$ in the same direction:

| $$\theta$$ | $$r = 0.3\lambda$$ | $$0.5\lambda$$ | $$1\lambda$$ | $$2\lambda$$ | $$5\lambda$$ | $$20\lambda$$ |
|---|---|---|---|---|---|---|
| 90° | 0.768 | 0.894 | 0.970 | 0.992 | 0.999 | 1.000 |
| 30° | 2.33 | 1.43 | 1.096 | 1.023 | 1.004 | 1.000 |
{: .ra-readout}

At $$0.3\lambda$$ the real power leaves the sphere with more of it towards the wire's axis than the far pattern says, yet the total through the sphere is 36.56 W for every ampere squared of feed current at every radius in the table, as §2.3 says it must be.[^hw] Only the way it is spread over directions changes, and it settles to $$U$$ within a few wavelengths.

The short dipole of §2.3 is the exception: there $$r^2\,\mathrm{Re}\,W_r \propto \sin^2\theta$$ exactly at every distance (Balanis eq. 4-12a).

</details>

## Common confusion

1. $$U$$ is not a power density. It is in W/sr and doesn't change with distance; $$W$$ is in W/m² and falls as $$1/r^2$$. The 100 mW dipole above has $$U = 13.06$$ mW/sr broadside at 1 m and at 1 km.
2. Integrating $$U\,d\theta\,d\phi$$ without the $$\sin\theta$$, on paper or by summing a pattern sampled on an even grid of $$\theta$$ and $$\phi$$. The poles get counted as if they were as big as the equator, and the total is too large: 57% for an isotropic source, 15% for a half-wave dipole.

## In the book

- §2.4, pp. 40–42, eqs. (2-12) to (2-15), and Example 2.3 (same idea as our cone, on Example 2.2's pattern).
- Radian and steradian: §2.2.5, pp. 36–37, eqs. (2-1), (2-2) and Fig. 2.10.
- The half-wave dipole's $$U$$ and total power: §4.6, pp. 182–184, eqs. (4-87) to (4-90). Its exact near fields: §8.5.2, pp. 462–463, eqs. (8-53) to (8-55b).
- Next: §2.5 Beamwidth, then §2.6 Directivity, which compares $$U$$ in one direction with its average $$P_{rad}/4\pi$$.

---

## References

[^sr]: Balanis, §2.2.5, pp. 36–37, Fig. 2.10.
[^domega]: Balanis, §2.2.5, eqs. (2-1) and (2-2), p. 37.
[^U]: Balanis, §2.4, eqs. (2-12) and (2-12a), pp. 40–41.
[^near]: Balanis, §8.5.2, eqs. (8-53), (8-55a) and (8-55b), pp. 462–463: the fields of a thin dipole with a sinusoidal current, valid at every distance. The table is computed from them.
[^hw]: Balanis, §4.6, eqs. (4-87) to (4-90), pp. 182–183: $$P_{rad} = \eta\,\vert I_0\vert^2\,\mathrm{Cin}(2\pi)/8\pi$$. With $$\eta = 120\pi$$ Ω and $$\mathrm{Cin}(2\pi) = 2.438$$ this is 36.56 W per A².
