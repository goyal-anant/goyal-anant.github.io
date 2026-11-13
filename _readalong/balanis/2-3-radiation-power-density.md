---
title: Radiation Power Density
book: balanis
section: "2.3"
---

## What this section is really saying

Power leaves an antenna as a flow of energy, and the Poynting vector measures that flow in watts per square metre. With phasors, its real part is the power that leaves for good and its imaginary part is energy that goes back and forth near the antenna. Add up the real part over any sphere around the antenna and you get the radiated power, the same number for every sphere.

## Predict first

A very short dipole at 2.4 GHz. On a sphere 2 mm around it, does power ever flow back into the antenna? And is the total power through that sphere more, less or the same as through a sphere 40 cm away? Check on the widget.

## Power around a short dipole

The short dipole is the one antenna whose fields Balanis writes down exactly at every distance, not only far away.[^fields] So we can put a sphere of radius $$r$$ around it at any distance and watch the energy cross it.

The distance is in $$kr = 2\pi r/\lambda$$, with $$r$$ in centimetres at 2.4 GHz in the table. The arrows and the curve are scaled to their largest outward value in a cycle, so the shape is visible at every distance; the density itself falls with $$r$$.

1. Start at $$kr = 20$$ ($$r = 40$$ cm): the arrows only point out. The flow pulses between zero and twice its average, twice per cycle, because $$\boldsymbol{\mathcal{E}}$$ and $$\boldsymbol{\mathcal{H}}$$ peak together.
2. At $$kr = 1$$ ($$r = 2.0$$ cm, the *radian distance*) $$E_\theta$$ is 45° behind $$H_\phi$$, so for part of each cycle the flow turns inward, at most 0.414 of the average. The real and imaginary power are equal in size here.
3. At $$kr = 0.1$$ ($$r = 2$$ mm) the inward and outward swings are each about a thousand times the average: almost all of it is energy sloshing in and out. Yet Re $$P/P_{rad}$$ is still 1.000. The imaginary part is $$-1/(kr)^3$$, and only it changes with distance.[^power]

{% include readalong/power-flow.html kr=1 %}

Far from any antenna the same thing holds with simpler numbers. A 100 mW source radiating equally in all directions gives $$100\text{ mW}/4\pi r^2$$: 79.6 µW/m² at 10 m and 0.796 µW/m² at 100 m. The density drops a hundred times, the area of the sphere grows a hundred times, and the total stays 100 mW (Balanis eqs. 2-10 and 2-11).[^iso]

## The gap

<details markdown="1">
<summary markdown="span">Where the $$\tfrac12$$ and the $$2\omega$$ term in eq. (2-7) come from</summary>

Write each instantaneous field as half the phasor plus half its conjugate, $$\boldsymbol{\mathcal{E}} = \tfrac12(\mathbf{E}e^{j\omega t} + \mathbf{E}^*e^{-j\omega t})$$, and the same for $$\boldsymbol{\mathcal{H}}$$. Multiply out:

$$
\boldsymbol{\mathcal{E}}\times\boldsymbol{\mathcal{H}} = \tfrac14\left(\mathbf{E}\times\mathbf{H}^* + \mathbf{E}^*\times\mathbf{H}\right) + \tfrac14\left(\mathbf{E}\times\mathbf{H}\,e^{j2\omega t} + \mathbf{E}^*\times\mathbf{H}^*e^{-j2\omega t}\right)
$$

Each bracket is a number plus its conjugate, i.e. twice its real part:

$$
\boldsymbol{\mathcal{E}}\times\boldsymbol{\mathcal{H}} = \tfrac12\,\mathrm{Re}\left[\mathbf{E}\times\mathbf{H}^*\right] + \tfrac12\,\mathrm{Re}\left[\mathbf{E}\times\mathbf{H}\,e^{j2\omega t}\right]
$$

The second term swings at $$2\omega$$ and averages to zero over a period, which leaves eq. (2-8). In the widget it is the swing of the curve about the dashed line. The $$\tfrac12$$ is there because $$\mathbf{E}$$ and $$\mathbf{H}$$ are peak values.[^avg]

</details>

<details markdown="1">
<summary markdown="span">Why every sphere gets the same real power</summary>

Take two spheres around the antenna, radii $$r_1 < r_2$$, in empty space. Averaged over a period, the energy stored between them doesn't grow, and nothing between them absorbs power. So whatever real power enters through the inner sphere must leave through the outer one, and $$\oint \tfrac12\mathrm{Re}(\mathbf{E}\times\mathbf{H}^*)\cdot d\mathbf{s}$$ is the same on both. The density falls as $$1/r^2$$ only because the area grows as $$r^2$$.

The imaginary part has no such rule. For the short dipole it is $$2\omega(\tilde W_m - \tilde W_e)$$, set by the difference between the magnetic and electric energy stored around the antenna (Balanis eq. 4-15); it is negative, so the electric energy wins, and it dies away as $$1/(kr)^3$$.[^reactive]

</details>

## Common confusion

1. You don't have to go to the far field to find $$P_{rad}$$. Eq. (2-9) takes the real part, and the real part is the same on every enclosing sphere, even at $$kr = 0.1$$. The far field only makes the integral easier: the fields are simpler there and the density is almost purely real.
2. The $$\tfrac12$$ in eqs. (2-8) and (2-9) is for peak phasors. With RMS values it goes away.[^avg] Mixing the two, e.g. RMS fields from a simulator in a formula written for peak values, puts the power off by a factor of 2, i.e. 3 dB.

## In the book

- §2.3, pp. 38–40, eqs. (2-3) to (2-11), and Example 2.2.
- The short dipole's fields and power at every distance: §4.2.1–4.2.2, pp. 151–155, eqs. (4-8b), (4-10a) to (4-10c) and (4-11) to (4-17). The radian distance: §4.2.3, p. 156.
- Next: §2.4, Radiation Intensity, multiplies the density by $$r^2$$ so that distance drops out.

---

## References

[^fields]: Balanis, §4.2.1, eqs. (4-8a) to (4-10c), pp. 153–154: the fields are "valid everywhere, except on the source itself".
[^power]: Balanis, §4.2.2, eqs. (4-12a) and (4-14), pp. 154–155. The widget uses the exact fields of eqs. (4-8b) and (4-10b).
[^iso]: Balanis, §2.3, eqs. (2-10) and (2-11), p. 40.
[^avg]: Balanis, §2.3, eqs. (2-5) to (2-8), p. 39.
[^reactive]: Balanis, §4.2.2, eqs. (4-15) to (4-17), p. 155.
