---
title: Numerical Techniques
book: balanis
section: "2.7"
---

## What this section is really saying

For a real antenna the integral for $$P_{rad}$$ rarely has a closed form, so you cut $$\theta$$ and $$\phi$$ into equal steps and add up rectangles (Balanis eqs. 2-38 to 2-43).[^sum] Each rectangle takes its height from one sample: the trailing edge of the step or its middle. The book's example comes out exact even with two steps, but that is a property of that pattern, not of the method. What sets the error is the size of the step against the width of the beam.

## Predict first

The NEXRAD weather radar's beam is about 0.9° wide (§2.5)[^nexrad] and its exact directivity is 46.88 dBi (§2.6). Add up its pattern on the book's 10° grid. What directivity comes out?

## Why the book's example is exact

All the patterns here are the same for every $$\phi$$, so only the $$\theta$$ sum matters. Each rectangle adds $$U(\theta_i)\sin\theta_i$$ times the step, and the $$\sin\theta$$ comes from the solid angle (§2.4). The book's Example 2.9 uses a pattern with a $$\sin\theta$$ of its own,[^ex] so the sum is over $$\sin^2\theta$$, i.e. one full period of $$\cos 2\theta$$ sitting on a constant. Equally spaced samples of a full cosine period add up to zero, for any number of samples from 2 up, so the rectangles get the constant exactly. *The gap* below has the one-line proof.

### sin θ against the dipoles

1. *sin θ*, any step, either rule: $$D_0 = 4/\pi = 1.2732$$, exact. On the right, both error curves lie on the floor of the plot.
2. *Short dipole*, step 90° (two samples): the trailing edge gives 1.273 and the midpoint 1.801, against the exact 1.5. Its integrand $$\sin^3\theta$$ is not a full period of anything. At 10° it is 1.49998, close but not exact.
3. *Half-wave dipole*, 10°: an error of $$-0.0008\%$$. Halve the step to 5° and it drops 16 times, to $$-0.00005\%$$. Both dipoles have nulls along the axis, and that buys the fast convergence (*The gap*).

{% include readalong/grid-directivity.html pattern="sin1" step="10" caption="Left: U sin θ for one pattern (blue), scaled to its peak, and the rectangles the book's sum adds (red), each taking its height from the dot. Right: the size of the error in percent against the step divided by the half-power beamwidth, both on log scales, for the trailing edge (solid) and the midpoint (dashed); the dot marks the grid on the left. The two grey lines show the slopes of an error that falls as the step squared and as its fourth power." %}

## The step against the beam

A beam pointing up the $$z$$ axis has its peak where $$\sin\theta = 0$$, so the integrand starts from zero with a slope, and the rectangles cut that corner badly. The error now falls only as the step squared, and the trailing edge misses about twice as much as the midpoint over-counts. On the right this is the line of slope 2, against slope 4 for the dipoles.

### cosⁿθ

1. $$n = 10$$ (HPBW 42.2°), step 10°: $$D_0 = 22$$ exact; the trailing edge gives 22.64 ($$+2.9\%$$), the midpoint 21.69 ($$-1.4\%$$). At 5° the trailing edge is $$+0.71\%$$: half the step, a quarter of the error.
2. $$n = 100$$ (HPBW 13.5°), step 10°: the trailing edge is now $$+48\%$$ (1.7 dB) and the midpoint $$-16\%$$. Same grid, narrower beam.
3. Same beam, step 3° (about a quarter of the HPBW): $$+2.4\%$$ and $$-1.2\%$$, i.e. 0.1 dB.

### NEXRAD dish

1. Step 10°: the trailing edge gives 85.16 dBi and the midpoint 73.33 dBi, against 46.88. The whole beam fits inside the first rectangle, which takes its height from a side lobe, and the sum sees almost none of the power.
2. Step 0.25°, a quarter of the HPBW: $$+0.18$$ dB and $$-0.09$$ dB. At 0.1°, $$+0.03$$ dB. So a quarter of the beamwidth is good to about 0.2 dB, and a tenth to a few hundredths.
3. Tick *Read Umax off the samples* at 0.25°: the trailing edge drops to $$-0.73$$ dB. Neither rule ever samples $$\theta = 0$$, so on a beam along $$z$$ the largest sample is below the real peak. With a measured or simulated table that is the only peak you have, so put $$\theta = 0$$ in the grid.

{% include readalong/grid-directivity.html pattern="dish" step="10" caption="The same panels for a NEXRAD-sized dish (d/λ = 81, parabolic taper, as on the §2.5 and §2.6 pages). The left plot zooms in to a few beamwidths or a few steps, whichever is wider." %}

## The gap

<details markdown="1">
<summary markdown="span">Why $$\sin\theta$$ is exact, and why the error goes as the step squared or to the fourth</summary>

Take $$N$$ steps of $$h = \pi/N$$ and samples $$\theta_i = (i - c)h$$, with $$c = 0$$ for the trailing edge and $$c = 1/2$$ for the midpoint. For the pattern $$U = \sin\theta$$ the sum is

$$
h\sum_{i=1}^{N}\sin^2\theta_i = \frac{h}{2}\sum_{i=1}^{N}\left(1 - \cos 2\theta_i\right)
$$

The angles $$2\theta_i$$ are $$N$$ equally spaced points around the full circle, so the cosines are the real parts of $$N$$ unit vectors spread evenly round it, and they add to zero for any $$N \ge 2$$. What is left is $$Nh/2 = \pi/2$$, the exact integral. With $$N = 1$$ there is only one vector and nothing to cancel it.

For a general pattern write the integrand as $$g(\theta) = f(\theta)\sin\theta$$. Because $$\sin\theta$$ is zero at both ends, the trailing-edge sum is the trapezoid rule, and the Euler–Maclaurin formula gives its leading error:

$$
\int_0^\pi g\,d\theta - h\sum_{i=1}^{N} g(\theta_i) \approx \frac{h^2}{12}\left[g'(0) - g'(\pi)\right] = \frac{h^2}{12}\left[f(0) + f(\pi)\right]
$$

The midpoint error is half of this, with the opposite sign. So:

1. If the pattern is zero along both directions of the $$z$$ axis, $$f(0) = f(\pi) = 0$$, the $$h^2$$ term vanishes and the error falls as $$h^4$$. That is every wire dipole.
2. If the peak is on the axis, $$f(0) = 1$$, and the error falls as $$h^2$$. The sum is short of the true power, so the trailing edge over-estimates $$D_0$$.

For $$\cos^n\theta$$ with $$n \ge 2$$ the pattern also goes smoothly to zero at 90°, so the formula holds as written; $$\cos\theta$$ itself has a corner there that adds a term of its own.

</details>

## Common confusion

1. "Example 2.9 shows the method is exact." It shows that one pattern is. Try the short dipole with two steps: 15% low with the trailing edge, 20% high with the midpoint.
2. "Ten degrees is fine, the book used it." Fine for a dipole, useless for a dish. Pick the step from the beamwidth: a quarter of the HPBW for about 0.2 dB, a tenth for a few hundredths of a dB.

## In the book

- §2.7, pp. 58–64: separable patterns eqs. (2-34) to (2-41), the sampling schemes (2-38b), (2-38c), (2-39b), (2-39c), the general form (2-43), Fig. 2.19 (the grid), Examples 2.9(a) and (b) with Fig. 2.20, and Fig. 2.21 (the rectangles of $$\sin^2\phi$$). The book's `Directivity` program uses the trailing edge, eq. (2-43).
- $$D_0 = 4\pi U_{max}/P_{rad}$$ and the exact values used here: §2.6. Solid angle and $$d\Omega = \sin\theta\,d\theta\,d\phi$$: §2.4. The NEXRAD dish model: §2.5.
- Next: §2.8 Antenna Efficiency.

---

## References

[^sum]: Balanis, §2.7, eqs. (2-34) to (2-43), pp. 59–61.
[^ex]: Balanis, §2.7, Examples 2.9(a) and (b), pp. 61–63, and Fig. 2.21, p. 64.
[^nexrad]: National Research Council, *Weather Radar Technology Beyond NEXRAD* (National Academies Press, 2002), Appendix A, pp. 69–70: reflector 8.54 m circular; one-way 3 dB beamwidth 0.96° at 2.7 GHz and 0.88° at 3.0 GHz.
