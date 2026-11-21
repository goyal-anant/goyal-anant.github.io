---
title: Solution of the Inhomogeneous Vector Potential Wave Equation
book: balanis
section: "3.5"
---

## What this section is really saying

[§3.4](../3-2-vector-potential-a/#two-paths-from-a-current-to-its-fields) quoted the radiation integral; this section is where it comes from. Take one point of current. Away from it, $$A_z$$ is an outgoing spherical wave, $$e^{-jkr}/r$$. Right at it, the wave equation is the Poisson equation of electrostatics, which fixes the constant in front. Then every point of a real antenna gets its own spherical wave, with its own distance $$R$$, and the sum is $$\mathbf{A}$$ (eq. 3-49).[^steps]

## Predict first

A Wi-Fi router 10 m away, at 2.45 GHz. The field at your laptop now was made by the current in the router's antenna some time ago. How many cycles ago?

## A point source, switched on

The book picks $$e^{-jkr}/r$$ over $$e^{+jkr}/r$$ in one line: one goes out, the other comes in. In phasors both are fine solutions. The difference shows only in time, when the source has a start. So, this widget switches a point current on at $$t = 0$$, $$I(t) = \sin\omega t$$, and draws the potential times $$r$$ (so the $$1/r$$ spreading doesn't hide the wave), scaled so the steady wave has amplitude 1. Lengths are in wavelengths and time in periods.

1. Outward, probe at 3 λ (36.7 cm at 2.45 GHz). Nothing reaches the probe until $$t = 3$$ periods, i.e. 1.22 ns after the switch-on, and from that moment the field is the steady wave $$\sin\omega(t - r/c)$$ exactly: 0% off. This is the retarded potential: the field at $$r$$ is the current $$r/c$$ earlier, divided by $$4\pi r$$. The phasor $$e^{-jkr}$$ is just that delay, $$kr = \omega\, r/c$$.
2. Inward, $$e^{+jkr}$$. The field is the current $$r/c$$ later. Go to negative times: at $$t = -3$$ periods the wave is already at the probe, coming in from far away, three periods before anyone switches the source on. Correct maths, impossible physics; this is why the book drops (3-36).
3. Line source (2-D), same probe. The front still arrives at $$t = 3$$, but now the field is 64% off its steady state over the first period, 14% after three periods and still 5% after nine. A point source in 3-D settles at once; a line source never quite does.

{% include readalong/retarded-potential.html case="turnon" kind="out" t=4 r=3 caption="A current switched on at t = 0 and then sin ωt. Left: the field times distance at one instant, out to 10 wavelengths; the dashed curve is the steady state, the thin line is the front (the distance light has travelled since the switch-on) and the red dashed line is the probe. Right: the field at the probe against time, with the source current dashed. Point source: the steady wave is sin ω(t ∓ r/c). Line source: divided by its own steady amplitude, |H<sub>0</sub><sup>(2)</sup>(kρ)|/4. Distances and times at 2.45 GHz (λ = 12.24 cm, one period 0.408 ns)." %}

The last case is why the book's shortcut, "the static solution times $$e^{-jkr}$$", works in 3-D. A point source in 3-D sends out a sharp shell: what left the source at one instant arrives at $$r$$ at one instant, smaller by $$1/r$$ and nothing else. So the static $$1/r$$ survives unchanged, and the only new thing is the delay. In 2-D the static potential is $$-\ln\rho/2\pi$$, but $$\ln\rho\, e^{-jk\rho}$$ isn't a solution at all; the line source needs a Hankel function.

## A wire, piece by piece

The shortcut is exact for a point. A real antenna is many points, and each one gets its own $$R$$ and its own delay: the $$e^{-jkR}$$ sits inside the integral (3-49). The tempting mistake is to do the static integral first and multiply the result by one $$e^{-jkr}$$ from the centre. This widget does both for a centre-fed wire with the sinusoidal current of Balanis eq. (4-56),[^current] cut into 16 pieces and seen from 50 λ away.

1. Half-wave, $$\theta = 30^\circ$$. The pieces from the two ends arrive 0.43 of a cycle apart, so the chain bends, and the true sum is 0.835 of the static sum. At $$90^\circ$$ every piece is the same distance away and the two sums agree. So the pattern narrows: half-power beamwidth 78.1° against 90.0°, and $$D_0 = 1.641$$ against 1.500, the short dipole's.[^halfwave]
2. Full-wave. At $$30^\circ$$ the chain nearly closes on itself, 0.174 of the static sum, and the beam is 47.8° wide with $$D_0 = 2.41$$.[^fullwave] The static version still says 90.0° and 1.500: it can't tell a 1.25 λ wire from a short one.
3. Short, λ/20. All pieces are within 0.05 λ of each other, the chain is nearly straight and the two agree to 0.2% in every direction. This is the only case where "static times one $$e^{-jkr}$$" is fine, and it's the infinitesimal dipole of §4.2.

{% include readalong/retarded-potential.html case="sum" l=0.5 th=30 caption="Left: the 16 pieces of the wire, each I(z′)Δz′ (r/R) e<sup>−jk(R−r)</sup> at 50 wavelengths, i.e. relative to the centre's distance r, added head to tail (blue; the thin arrow is their sum), against the same pieces all at one phase (red). Right: |E<sub>θ</sub>| far away against direction, each curve per its own peak; the dotted line is θ. Beamwidth and D<sub>0</sub> by numerical integration of the far field. Lengths at 2.45 GHz." %}

## The gap

<details markdown="1">
<summary markdown="span">Why the two solutions are $$e^{\mp jkr}/r$$</summary>

Write $$A_z = u(r)/r$$. For $$r > 0$$,

$$
\frac{d^2 A_z}{dr^2} + \frac{2}{r}\frac{dA_z}{dr} = \frac{1}{r}\frac{d^2 u}{dr^2},
$$

so eq. (3-34) becomes $$u'' + k^2 u = 0$$: a wave on a string, $$u = e^{\mp jkr}$$. The $$1/r$$ is only spreading; the wave itself lives in $$u$$, which is why the widget draws $$r$$ times the potential.

</details>

<details markdown="1">
<summary markdown="span">Why the static analogy is exact, not a guess</summary>

The precise statement is that $$G = e^{-jkR}/4\pi R$$ solves $$\nabla^2 G + k^2 G = -\delta$$. Away from the source this is (3-34). At the source, integrate over a small ball of radius $$a$$. The flux of $$\nabla G$$ through its surface is $$-(1 + jka)e^{-jka}$$, which goes to $$-1$$, the same as for the static $$1/4\pi R$$. The $$k^2 G$$ term adds $$k^2\int G\,dv = (1 + jka)e^{-jka} - 1$$, about $$(ka)^2/2$$, which goes to 0; the two together give exactly $$-1$$ for a ball of any size. So near the source the $$k^2$$ term really doesn't matter, as the book says, and the constant is the static one: $$C_1 = \mu I l/4\pi$$ for a current element.[^c1]

</details>

<details markdown="1">
<summary markdown="span">The part of $$e^{-jkR}/R$$ that radiates</summary>

$$e^{-jkR}/R = \cos(kR)/R - j\sin(kR)/R$$. Only the first part blows up at $$R = 0$$, so only it is fixed by matching the static solution. The second part is finite everywhere and solves the wave equation with no source at all; matching can't fix it. The outward choice does, and this is the part that carries the power. At the source it is $$-jk/4\pi$$. Put it into the field of a short current element at its own position: $$-j\omega\mathbf{A}$$ gives $$-\omega\mu k I l/4\pi$$, the $$\nabla(\nabla\cdot\mathbf{A})$$ term of (3-15) gives back a third of it, and

$$
E_z = -\frac{\omega\mu k\, I l}{6\pi}, \qquad P = -\tfrac12\,\mathrm{Re}\,(E_z I^* l) = \frac{\omega\mu k\,\vert I\vert^2 l^2}{12\pi}, \qquad R_r = \frac{2P}{\vert I\vert^2} = \frac{\eta k^2 l^2}{6\pi} = 80\pi^2\left(\frac{l}{\lambda}\right)^2,
$$

which is Balanis eq. (4-19), the short dipole's radiation resistance, found here without going to the far field.[^rr]

</details>

## Common confusion

1. "Find the static potential, then multiply by $$e^{-jkr}$$." Only for a point, or inside the integral with $$R$$ from each point. For anything longer than about a tenth of a wavelength it throws the pattern away (the wire widget).
2. "The $$r$$ in (3-42) and (3-43) is the distance from the origin." There it is already the distance from each point of the source; from (3-49) on the book calls it $$R$$.

## In the book

- [§3.5](../3-5-radiation-integral/), pp. 139–142, eqs. (3-31) to (3-54), Fig. 3.2. The integral is first quoted as (3-27), (3-28) in §3.4, p. 138, and the recipe it feeds is on the [§3.2 page](../3-2-vector-potential-a/#two-paths-from-a-current-to-its-fields).
- Used first in §4.2 (eq. 4-4, p. 153) for the infinitesimal dipole, and in §4.5 (eq. 4-56, p. 170) for the finite dipole.
- Next: §3.6 takes $$R$$ apart far from the source.

---

## References

[^steps]: Balanis, [§3.5](../3-5-radiation-integral/), eqs. (3-31) to (3-49), pp. 139–142.
[^current]: Balanis, §4.5.1, eq. (4-56), p. 170.
[^halfwave]: Balanis, §4.6, eq. (4-91), p. 183, gives $$D_0 \simeq 1.643$$ and eq. (4-65), p. 173, a 3-dB beamwidth of 78° for the half-wave dipole. 1.641 is the same integral done more finely.
[^fullwave]: Balanis, eq. (4-65), p. 173: 47.8° for $$l = \lambda$$.
[^c1]: Balanis, eqs. (3-38) to (3-43), pp. 140–141; for the current element, eq. (4-4), p. 153.
[^rr]: Balanis, §4.2.2, eq. (4-19), p. 155.
