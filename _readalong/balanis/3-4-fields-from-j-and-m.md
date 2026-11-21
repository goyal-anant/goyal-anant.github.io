---
title: Electric and Magnetic Fields for Electric (J) and Magnetic (M) Current Sources
book: balanis
section: "3.4"
---

## What this section is really saying

This is the recipe the rest of the book runs on. Given an electric current $$\mathbf{J}$$ and a magnetic current $$\mathbf{M}$$, integrate each into its potential, $$\mathbf{A}$$ by eq. (3-27) and $$\mathbf{F}$$ by eq. (3-28); differentiate each potential into its fields; add the two sets, eqs. (3-29) and (3-30).[^recipe] The first three steps are [§3.2](../3-2-vector-potential-a/) and [§3.3](../3-3-vector-potential-f/) put side by side. The fourth, the adding, is the one that does something new, and it needs a case with both currents to be seen.

## Predict first

An electric dipole and a magnetic dipole at the same point, at right angles to each other. Each alone has a directivity of 1.5. What is the directivity of the pair?

## The recipe in one table

Lay the two rows next to each other and a pattern shows up. Each potential gives one field with a single curl: $$\mathbf{H}_A$$ from $$\mathbf{A}$$, and $$\mathbf{E}_F$$ from $$\mathbf{F}$$. The other field needs a gradient term as well. The reason is the charge: an electric current that starts and stops leaves electric charge, which only $$\mathbf{E}$$ feels, so the gradient term lands in $$\mathbf{E}_A$$; a magnetic current leaves magnetic "charge", so it lands in $$\mathbf{H}_F$$. [§3.2](../3-2-vector-potential-a/#the-two-pieces-of-e) and [§3.3](../3-3-vector-potential-f/#the-two-pieces-of-h) show those terms at work.

{% include readalong/recipe.html %}

## Adding fields, not patterns

The simplest source with both currents: a short electric current along $$y$$ and a short magnetic current along $$-x$$, at the same point. Let $$K = I_m l/\eta I l$$ be the strength of the magnetic one per the electric one, with its phase. With $$K = 1$$, i.e. $$I_m l = \eta\, I l$$, this is the *Huygens source*, which Balanis brings back in Chapter 15 as the ideal feed for a dish.[^feed]

1. *J only*, then *M only*. Each is a doughnut, $$D_0 = 1.5$$, as much power backward as forward.
2. *Huygens*. The two add in front and cancel straight behind: in every plane $$\vert\mathbf{E}\vert$$ goes as $$1 + \cos\theta$$, a cardioid. $$D_0 = 3$$ (4.77 dBi), the beam is 131° wide in both planes, and there is no back lobe at all.
3. Toggle to *Add powers*. Adding $$\vert\mathbf{E}_A\vert^2 + \vert\mathbf{E}_F\vert^2$$ gives a lumpy ball with $$D_0 = 1.5$$ again and no front or back. The pair radiates the same total power either way (The gap); all of the extra 3 dB is in where the phases send it.
4. *10% too strong*: the back lobe comes back at 26.4 dB below the front. *10° late*: 21.2 dB. $$\vert K\vert = 0.5$$: only 9.5 dB. The cancellation behind needs the two currents matched in size and in phase.
5. Phase $$180^\circ$$: the same cardioid, pointing backward.

{% include readalong/huygens-source.html case="sum" mag=1 phase=0 caption="Far field only, Balanis eqs. (3-58a) and (3-59b), up to a common factor. <b>J</b> is a short electric current along y, <b>M</b> a short magnetic current along −x, both at the origin; K = I<sub>m</sub>l/ηIl, with η = 377 Ω. D<sub>0</sub> and the beamwidths are found from the pattern on a fine grid; the cross-polar level is defined below the next widget." %}

## Why a dish wants this feed

A dish turns the feed's field into currents on its surface, and the field those currents make across the aperture is only as clean as the feed's polarization. Ludwig's third definition of cross-polarization is the one a pattern range measures: the reference polarization is set on the axis and the probe keeps its orientation as it swings round. A feed with no cross-polarization by this definition makes surface currents on a paraboloid that all run one way.[^ludwig] The map shows the feed's polarization over the front half of the sky, as seen from in front: at each direction, the path the tip of $$\mathbf{E}$$ traces in one cycle.

1. *J only*. The marks tilt away from $$y$$ off the principal planes; at $$\theta = 60^\circ$$, $$\phi = 45^\circ$$ the cross-polar field is a third of the co-polar one. The peak cross-polar level is 6 dB below the peak, out at $$\theta = 90^\circ$$.
2. *Huygens*. Every mark is parallel to $$y$$: no cross-polarization anywhere. This is why Balanis calls it the ideal feed (and the reason the dish could then be a grid of parallel wires).[^feed]
3. *10% too strong*: −32.5 dB; *10° late*: −27.2 dB. The marks look almost the same; a cross-polar field of 2 to 4% of the peak is too small to see by eye, and the readout catches it.

{% include readalong/huygens-source.html case="sky" mag=1 phase=0 caption="The front half of the sky (θ up to 90°) as seen from +z, with θ as the distance from the centre; x to the right, y up. Co- and cross-polar follow Ludwig's third definition: co-polar along y on the axis. The peak cross-polar level is the largest cross-polar |E|² in the front half per the largest co-polar |E|² there." %}

The same cardioid comes back in Chapter 12. By the equivalence principle an aperture with a field across it is a sheet of $$\mathbf{J}_s$$ and $$\mathbf{M}_s$$, and a uniform aperture in free space radiates with a factor $$(1 + \cos\theta)$$ in both components of its far field.[^aperture] Each patch of a horn's mouth is a small Huygens source, and the horn's pattern is their sum, worked out with this recipe.

## The gap

<details markdown="1">
<summary markdown="span">The Huygens source's field, in one line</summary>

Far away, $$\mathbf{E}_A = -j\omega\mathbf{A}$$ without its radial part and $$\mathbf{E}_F = j\omega\eta\,\hat{\mathbf{r}}\times\mathbf{F}$$ (eqs. 3-58a and 3-59b).[^far] With $$\mathbf{A}\propto\mu I l\,\hat{\mathbf{y}}$$ and $$\mathbf{F}\propto -\epsilon I_m l\,\hat{\mathbf{x}}$$, and dropping the common factor $$j\omega\mu I l\, e^{-jkr}/4\pi r$$,

$$
E_\theta = -\sin\phi\,(\cos\theta + K), \qquad E_\phi = -\cos\phi\,(1 + K\cos\theta).
$$

At $$K = 1$$ both carry $$(1 + \cos\theta)$$, so $$\vert\mathbf{E}\vert = 1 + \cos\theta$$ in every plane.

</details>

<details markdown="1">
<summary markdown="span">Why the total power doesn't change</summary>

Integrate $$\vert E_\theta\vert^2 + \vert E_\phi\vert^2$$ over $$\phi$$ first, then over $$c = \cos\theta$$ from $$-1$$ to 1:

$$
\pi\int_{-1}^{1}\left(\vert c + K\vert^2 + \vert 1 + Kc\vert^2\right)dc = \frac{8\pi}{3}\left(1 + \vert K\vert^2\right).
$$

The cross terms are odd in $$c$$ and vanish: the pair radiates exactly what the two radiate apart, for any phase. Interference only moves the power around, here all of it to the front. With $$K = 1$$ the peak is $$2^2 = 4$$, so $$D_0 = 4\pi \cdot 4/(16\pi/3) = 3$$.

</details>

<details markdown="1">
<summary markdown="span">Two routes in step 3, and where each works</summary>

$$\mathbf{E}_A$$ can come from (3-15) or from Ampère's law, $$\nabla\times\mathbf{H}_A/j\omega\epsilon$$ (eq. 3-29a). The second is Maxwell's equation with $$\mathbf{J} = 0$$, so it holds only outside the source; (3-15) holds everywhere, inside the current too. The same goes for (3-26) against (3-30a) with $$\mathbf{M}$$. Far away the gradient terms of (3-15) and (3-26) only cancel the radial parts (the [§3.2](../3-2-vector-potential-a/#the-two-pieces-of-e) widget at $$kr = 15$$), which is why the far field is $$-j\omega$$ times the potential across the line of sight.

</details>

## Common confusion

1. "Work out each current's pattern and add the patterns." Fields add, as vectors with their phases. Here adding patterns gives $$D_0 = 1.5$$ and the right answer is 3.
2. "(3-29a) is just another form of (3-29)." Only outside the sources, where $$\mathbf{J} = 0$$.

## In the book

- [§3.4](../3-4-fields-from-j-and-m/), pp. 138–139, eqs. (3-27) to (3-30a). Steps 2 and 3 in detail: [§3.2](../3-2-vector-potential-a/) for $$\mathbf{A}$$, [§3.3](../3-3-vector-potential-f/) for $$\mathbf{F}$$; the integrals (3-27) and (3-28) are derived in [§3.5](../3-5-radiation-integral/).
- Far-field forms used here: [§3.6](../3-6-far-field-radiation/), eqs. (3-58a) and (3-59b), p. 143.
- Huygens source as a reflector feed: §15.4.1 D, pp. 906–907, Fig. 15.17. Apertures with both currents: §12.2, p. 653, and Table 12.1, p. 672.

---

## References

[^recipe]: Balanis, [§3.4](../3-4-fields-from-j-and-m/), eqs. (3-27) to (3-30a), pp. 138–139.
[^feed]: Balanis, §15.4.1 D, pp. 906–907, and Fig. 15.17: crossed electric and magnetic dipoles with moments in the ratio $$\sqrt{\mu/\epsilon}$$, free of cross-polarization, called a Huygens' source.
[^ludwig]: A. C. Ludwig, "The definition of cross polarization," *IEEE Transactions on Antennas and Propagation*, vol. 21, no. 1, pp. 116–119, 1973, [doi:10.1109/TAP.1973.1140406](https://doi.org/10.1109/TAP.1973.1140406).
[^aperture]: Balanis, §12.2, p. 653 (the equivalence principle), and Table 12.1, p. 672, the column for a uniform aperture in free space.
[^far]: Balanis, [§3.6](../3-6-far-field-radiation/), eqs. (3-58a) and (3-59b), p. 143.
