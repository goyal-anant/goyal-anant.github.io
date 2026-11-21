---
title: The Vector Potential F for a Magnetic Current Source M
book: balanis
section: "3.3"
---

## What this section is really saying

This is [§3.2](../3-2-vector-potential-a/) again, with a magnetic current $$\mathbf{M}$$ in place of $$\mathbf{J}$$. Now $$\mathbf{E}$$ is the curl of a potential $$\mathbf{F}$$, $$\mathbf{H}$$ comes out in two pieces, $$-j\omega\mathbf{F}$$ and $$-\nabla\phi_m$$, and a second Lorenz condition folds $$\phi_m$$ into $$\mathbf{F}$$. Nobody has a wire carrying magnetic current, but the slots, coax feeds and small loops of the later chapters are all worked out this way.

## Predict first

An NFC reader at 13.56 MHz and a phone 10 cm away from it. Is the phone in the reader's far field? And is the field there mostly electric or mostly magnetic?

## Why a second potential

$$\mathbf{A}$$ was built on $$\nabla\cdot\mathbf{B} = 0$$. With a magnetic current, Faraday's law picks up a $$-\mathbf{M}$$ (Balanis eq. 3-21), and its divergence gives $$\nabla\cdot\mathbf{B} = -\nabla\cdot\mathbf{M}/j\omega$$: wherever $$\mathbf{M}$$ starts or stops, $$\mathbf{B}$$ has a source, so it is no longer a curl. $$\mathbf{D}$$ still has no source, as there is no electric charge here, so it takes over: $$\mathbf{E}_F = -\frac{1}{\epsilon}\nabla\times\mathbf{F}$$ (eq. 3-16).[^steps]

From there every line of the section is a line of [§3.2](../3-2-vector-potential-a/) with these swaps:

$$
\begin{alignat*}{3}
\mathbf{J} &\to \mathbf{M}, &\qquad \mathbf{A} &\to \mathbf{F}, &\qquad \phi_e &\to \phi_m, \\
\mathbf{E} &\to \mathbf{H}, & \mathbf{H} &\to -\mathbf{E}, & \mu &\leftrightarrow \epsilon
\end{alignat*}
$$

The minus sign in (3-16), which $$\mathbf{H}_A = \nabla\times\mathbf{A}/\mu$$ doesn't have, is the $$\mathbf{H}\to-\mathbf{E}$$ swap: it comes from the minus in front of $$\mathbf{M}$$ in Faraday's law. Balanis turns the swap into a theorem in [§3.7](../3-7-duality/).

## The two pieces of H

The magnetic current one can build is a small loop of ordinary current. Seen from outside, a loop of area $$S$$ carrying $$I_0$$ acts as a magnetic current element $$I_m l = j\omega\mu S I_0$$ along its axis (Balanis eq. 5-21).[^loop] Put through (3-19) and (3-24), it gives the [§3.2](../3-2-vector-potential-a/#the-two-pieces-of-e) widget with $$\mathbf{E}$$ and $$\mathbf{H}$$ swapped: blue $$-j\omega\mathbf{F}$$ from each dot, red $$-\nabla\phi_m$$ from its tip, and a thin $$\mathbf{H}$$ from the dot. $$\mathbf{E}$$ only goes around the axis, so it is drawn as circles: a dot where it comes out of the plane, a cross where it goes in.

1. Start at the NFC preset, $$kr = 0.028$$: the phone at 10 cm. The red $$-\nabla\phi_m$$ is 1,960 times the blue $$-j\omega\mathbf{F}$$, and $$\mathbf{H}$$ is the static field of a bar magnet, swinging back and forth. $$\vert\mathbf{E}\vert$$ is 1.3% of $$\eta\vert\mathbf{H}\vert$$, so the circles are too small to see. So, the phone is nowhere near the far field ($$kr = 1$$ is 3.5 m away) and NFC works through the magnetic near field.
2. Go to $$kr = 1$$. The two pieces are 1.87 to 1, the same number as for the dipole on [§3.2](../3-2-vector-potential-a/#the-two-pieces-of-e): the swap holds number for number.
3. Go far, $$kr = 15$$. $$H_\theta$$ is $$-j\omega F_\theta$$ to within 0.2% in size and $$4^\circ$$ in phase, and $$\vert\mathbf{E}\vert = \eta\vert\mathbf{H}\vert$$ to 0.4%: a plane wave.

{% include readalong/vector-potential.html case="loop" kr=1 caption="A small loop in the horizontal plane (the ellipse, seen nearly edge on) as a magnetic current element along its axis, with the e<sup>jωt</sup> convention of the book; one period takes 3 s. The distances are at 13.56 MHz. The plot is at 45° from the axis, each piece per unit of |−jω<b>F</b>| there; <b>E</b> is divided by η = 377 Ω so that it fits on the same scale, and it climbs to 1 as the wave becomes plane." %}

## What a magnetic current is

Balanis opens the section by saying that magnetic currents seem impossible to build. As a wire, yes. But the later chapters use $$\mathbf{M}$$ all the time, each time as a stand-in for something real that gives the same fields outside and is easier to integrate. A slot becomes a line of $$\mathbf{M}$$ instead of a whole metal plate with currents all over it.[^equiv] A coax feed becomes a ring of $$\mathbf{M}$$, the magnetic frill;[^frill] the moment-method curve on [§2.13](../2-13-input-impedance/) is fed this way. A small loop becomes one magnetic current element; small loops, often wound on a ferrite rod, are the receiving antennas of portable radios.[^ferrite]

{% include readalong/magnetic-currents.html %}

## How small is a small loop

Eq. (5-21) holds for a small loop only. The widget compares the two paths: the exact loop, a uniform current $$I_0$$ around a ring of radius $$a$$, through $$\mathbf{A}$$, and its magnetic current element through $$\mathbf{F}$$. Balanis's rule for "small" is a circumference $$C < \lambda/10$$.

1. The NFC reader loop, 4 cm across: $$C/\lambda = 0.0057$$. Far away the two agree to 0.0004%. At the phone, 10 cm away, they differ by 1.5%, because 10 cm is only five loop radii and the loop's own size still shows. Beyond 12 cm ($$kr = 0.035$$) they agree to 1%.
2. $$C = \lambda/10$$: 0.12% far away, 0.19% at $$kr = 1$$. Balanis's rule is generous.
3. $$C = \lambda$$: far away the loop is 12% weaker than its magnetic current element, 1.1 dB, and that never gets better with distance. By then the current isn't uniform around the loop either (§5.3).

{% include readalong/vector-potential.html case="loopcheck" ka=0.1 caption="In the plane of the loop (θ = 90°). Error: the exact loop's |<i>E</i><sub>φ</sub>| per the magnetic current element's, minus one; the exact loop is <b>E</b> = −jω<b>A</b> with <b>A</b> summed around the ring, the element is Balanis eqs. (5-20b) and (5-21). The curve starts at twice the loop radius, and it dips where the error changes sign. The dotted far limit is 2<i>J</i><sub>1</sub>(<i>ka</i>)/<i>ka</i> − 1, the large-loop far field, eq. (5-54b), per the small loop's; the dashed line is 1%. Diameters at 13.56 MHz." %}

## The gap

<details markdown="1">
<summary markdown="span">The real loop has no magnetic poles</summary>

Through $$\mathbf{F}$$, most of the loop's near $$\mathbf{H}$$ is $$-\nabla\phi_m$$: the field of two magnetic charges at the ends of the magnetic current element. The real loop has no such charges. Its current is uniform, so $$\nabla\cdot\mathbf{J} = 0$$ and there is no electric charge anywhere either. Its $$\mathbf{A}$$ goes around the axis and doesn't change along that direction, so $$\nabla\cdot\mathbf{A} = 0$$, $$\phi_e = 0$$ by (3-13), and

$$
\mathbf{E} = -j\omega\mathbf{A}, \qquad \mathbf{H} = \frac{1}{\mu}\nabla\times\mathbf{A}
$$

at every distance. The two paths give the same fields outside the loop (the second widget); the poles belong to the stand-in, not to the loop.

</details>

<details markdown="1">
<summary markdown="span">Units</summary>

$$\mathbf{M}$$ is in V/m², so a magnetic current $$I_m$$ is in volts, the voltage across a slot or a coax gap. From eq. (3-28), $$\mathbf{F}$$ is in (F/m)(V/m²)(m²) = C/m, and $$\frac{1}{\epsilon}\nabla\times\mathbf{F}$$ is in V/m, as it should be. $$\phi_m$$ is in amperes. For comparison, $$\mathbf{A}$$ is in Wb/m.

</details>

## Common confusion

1. "Magnetic currents don't exist, so this section can be skipped." The apertures of Chapter 12 are worked out with $$\mathbf{M}$$, and so is any antenna fed by a coax, once the feed is modelled as a frill.
2. "The minus sign in (3-16) is a typo." It is the $$\mathbf{H}\to-\mathbf{E}$$ swap; with it, Faraday's law with $$\mathbf{M}$$ comes out right.

## In the book

- [§3.3](../3-3-vector-potential-f/), pp. 137–138, eqs. (3-16) to (3-26). The recipe of [§3.4](../3-4-fields-from-j-and-m/), eqs. (3-28) to (3-30a), pp. 138–139.
- Small loop as a magnetic dipole: §5.2.2, p. 237, eqs. (5-20a) to (5-21); large loop far field: §5.3, eq. (5-54b), p. 248; ferrite loop: §5.7, pp. 266–267.
- Magnetic frill: §8.3.3, eq. (8-28), p. 447. Surface equivalence: §12.2, eqs. (12-1) to (12-4), pp. 654–655.
- Next: [§3.7](../3-7-duality/) makes the swap a theorem.

---

## References

[^steps]: Balanis, [§3.3](../3-3-vector-potential-f/), eqs. (3-16) to (3-26), pp. 137–138.
[^loop]: Balanis, §5.2.2, eqs. (5-20a) to (5-20d) and (5-21), p. 237.
[^equiv]: Balanis, §12.2, eqs. (12-1) to (12-4), pp. 654–655: on a surface, the tangential $$\mathbf{E}$$ is replaced by $$\mathbf{M}_s = -\hat{\mathbf{n}}\times\mathbf{E}$$.
[^frill]: Balanis, §8.3.3, eq. (8-28), p. 447.
[^ferrite]: Balanis, §5.1, p. 231 (small loops in portable radios and pagers), and §5.7, pp. 266–267 (the ferrite loop).
