---
title: The Vector Potential A for an Electric Current Source J
book: balanis
section: "3.2"
---

## What this section is really saying

Finding the fields of a current head-on is hard, so Balanis goes through a helper: the vector potential $$\mathbf{A}$$. Its curl gives $$\mathbf{H}$$, and $$\mathbf{E}$$ comes out in two pieces, $$-j\omega\mathbf{A}$$ from the moving current and $$-\nabla\phi_e$$ from the charges the current leaves at its ends. Balanis then picks the divergence of $$\mathbf{A}$$ (the Lorenz condition) so that $$\phi_e$$ follows from $$\mathbf{A}$$, and one wave equation for $$\mathbf{A}$$ alone is left. This page also covers §3.1, which has no page of its own; [§3.4](../3-4-fields-from-j-and-m/) puts this section and the next together.

## Predict first

A 2.45 GHz Wi-Fi dipole, and a point 2 mm from it. Which piece makes most of the electric field there: the current, through $$-j\omega\mathbf{A}$$, or the charges at the ends, through $$-\nabla\phi_e$$? And 30 cm away?

## Two paths from a current to its fields

Path 1 is one integral, but its kernel is the full field of a tiny current element: parts in $$1/R$$, $$1/R^2$$ and $$1/R^3$$, each pointing its own way. The short dipole's fields show all three (Balanis eqs. 4-10a and 4-10b).[^dipole] Path 2 integrates against $$e^{-jkR}/4\pi R$$ alone, and the result points along the current: a $$z$$-directed wire gives an $$\mathbf{A}$$ with only a $$z$$ component (Balanis eq. 4-4).[^dipole] The hard part, the integral, gets easy; what is left is differentiation, which always works.[^intro]

{% include readalong/two-paths.html %}

## The two pieces of E

Balanis gets $$\mathbf{E}_A = -\nabla\phi_e - j\omega\mathbf{A}$$ (eq. 3-7a) in three lines and then folds $$\phi_e$$ into $$\mathbf{A}$$ with eq. (3-15).[^steps] The two pieces are worth a look before they are folded, because they do very different jobs. The widget takes a short dipole and adds the two pieces tip to tail on a plane through the wire, at one instant: blue $$-j\omega\mathbf{A}$$ from each dot, red $$-\nabla\phi_e$$ from its tip, and a thin $$\mathbf{E}$$ from the dot to where they end. The arrows at each dot are scaled to fit there, so the field's fall with distance doesn't hide the shape. The ring marks a point $$45^\circ$$ from the wire, at the distance on the slider, and the map shows twice that distance.

1. Start near, at $$kr = 0.1$$ (2 mm at 2.45 GHz). The red $$-\nabla\phi_e$$ is 158 times the blue $$-j\omega\mathbf{A}$$, and $$\mathbf{E}$$ is the field lines of two charges, one at each end: the static dipole field, swinging back and forth.
2. Go to $$kr = 1$$ (1.9 cm). The two pieces are of the same size, 1.87 to 1.
3. Go far, $$kr = 15$$ (29 cm). The blue arrows all still point along the wire, but $$\mathbf{E}$$ is now across the line of sight. The radial parts of the two pieces cancel to 13%, and the leftover falls one power of $$r$$ faster than the rest. Across the line of sight $$E_\theta$$ is $$-j\omega A_\theta$$ to within 0.2% in size and $$4^\circ$$ in phase. The red arrows run straight back along the line of sight, so the thin ones end beside the blue ones.

{% include readalong/vector-potential.html case="split" kr=1 caption="A short dipole, current along the vertical axis, with the e<sup>jωt</sup> convention of the book; one period takes 3 s. The plot is at 45° from the wire, each piece per unit of |−jω<b>A</b>| there: far out −∇φ<sub>e</sub> and <b>E</b> both settle at 0.71, i.e. cos 45° and sin 45° of the current term, and the radial part of <b>E</b> keeps falling as 2/kr." %}

That last step is the far-field rule of §3.6: far from any antenna, $$\mathbf{E} \approx -j\omega\mathbf{A}$$ with its radial part dropped. The charges' only job out there is to cancel that radial part.

## A is a choice

Eq. (3-2) fixes the curl of $$\mathbf{A}$$ and nothing else. Add the gradient of any function $$\chi$$ to $$\mathbf{A}$$ and its curl doesn't change, by the same identity as eq. (3-6); change $$\phi_e$$ by $$-j\omega\chi$$ at the same time and $$\mathbf{E}$$ doesn't change either. So Balanis is free to pick $$\nabla\cdot\mathbf{A}$$, and he picks it so that (3-12) becomes the clean (3-14).[^steps] That choice is the Lorenz condition. Another common one is $$\nabla\cdot\mathbf{A} = 0$$, the Coulomb condition. The widget puts the two side by side for the same dipole.

1. At $$kr = 15$$, watch the shading. In the Lorenz gauge $$\phi_e$$ travels out as a wave and arrives 773° late, 2.1 cycles. In the Coulomb gauge it is the static potential of the end charges, in step with them everywhere at once, 30 cm away included.
2. The coloured arrows differ too: Lorenz $$\mathbf{A}$$ points along the wire everywhere; Coulomb $$\mathbf{A}$$ is tilted $$44.6^\circ$$ from it at the ring, almost across the line of sight.
3. The thin $$\mathbf{E}$$ arrows are the same in both, at every point and every instant. The instant-everywhere $$\phi$$ of the Coulomb gauge is cancelled by an instant-everywhere part of its $$\mathbf{A}$$, and the field itself still travels at the speed of light.[^gauge]

{% include readalong/vector-potential.html case="gauge" kr=15 caption="The same short dipole in two gauges; one period takes 3 s. The shading is the scalar potential at that instant, on one colour scale for both maps, set by the Lorenz potential halfway out on the axis; near the wire it saturates. The tilt of <b>A</b> is the angle from the wire of its largest instantaneous direction at the ring." %}

So "$$\mathbf{A}$$ points along the current" is a property of the Lorenz gauge, not of $$\mathbf{A}$$. It is the reason antenna books use it: both potentials are then plain retarded integrals over the sources, eqs. (3-27) and (3-28).

## The gap

<details markdown="1">
<summary markdown="span">Where $$\phi_e$$ comes from</summary>

Balanis never brings in charge in this section, which makes $$\phi_e$$ look like bookkeeping. Take the divergence of Ampère's law (3-10): $$\nabla\cdot\mathbf{J} = -j\omega\epsilon\nabla\cdot\mathbf{E}$$, and with $$\nabla\cdot\mathbf{E} = \rho/\epsilon$$ that is charge conservation, $$\nabla\cdot\mathbf{J} = -j\omega\rho$$. Now take the divergence of (3-14) and use the Lorenz condition (3-13), $$\nabla\cdot\mathbf{A} = -j\omega\mu\epsilon\phi_e$$:

$$
-j\omega\mu\epsilon\left(\nabla^2\phi_e + k^2\phi_e\right) = -\mu\nabla\cdot\mathbf{J} = j\omega\mu\rho
$$

i.e.

$$
\nabla^2\phi_e + k^2\phi_e = -\frac{\rho}{\epsilon}
$$

The same equation as (3-14) with $$\rho/\epsilon$$ in place of $$\mu\mathbf{J}$$, so $$\phi_e$$ is the retarded potential of the charges. On a short dipole the current $$I$$ piles up charge $$\pm I/j\omega$$ at the two ends, and $$-\nabla\phi_e$$ is their field.

</details>

<details markdown="1">
<summary markdown="span">Why the gradient term in (3-15) dies away far out</summary>

At a distance $$r$$ the potentials vary as $$e^{-jkr}/r$$ along the line of sight. Each derivative along it brings down $$-jk$$ plus a correction of order $$1/r$$. So $$-\nabla\phi_e$$ far out is the line-of-sight derivative only, which points radially, and the Lorenz condition makes it equal and opposite to the radial part of $$-j\omega\mathbf{A}$$. What survives is the part of $$-j\omega\mathbf{A}$$ across the line of sight. The leftover of the radial cancellation is one power of $$kr$$ smaller, which is the dashed line in the first widget falling as $$2/kr$$.

</details>

## Common confusion

1. "$$\phi_e$$ is a mathematical leftover." Close to an antenna it is most of the field: at $$kr = 0.1$$ it is 158 times the current term. It drops out of the working only because (3-13) writes it in terms of $$\mathbf{A}$$.
2. "$$\mathbf{A}$$ points along the wire, so $$\mathbf{E}$$ does too." $$-j\omega\mathbf{A}$$ does; $$\mathbf{E}$$ doesn't. Far out the charges remove the radial part, and what is left is across the line of sight. And $$\mathbf{A}$$ points along the wire only in the Lorenz gauge.

## In the book

- §3.1, pp. 133–135, Fig. 3.1 (the two paths). [§3.2](../3-2-vector-potential-a/), pp. 135–137, eqs. (3-1) to (3-15). [§3.4](../3-4-fields-from-j-and-m/), pp. 138–139, eqs. (3-27) to (3-30a) (the recipe).
- Balanis calls (3-13) the Lorentz condition; it is due to L. V. Lorenz, in the 1860s, and was credited to H. A. Lorentz later.[^lorenz]
- The short dipole done the book's way: §4.2.1, pp. 151–154, eqs. (4-4) to (4-10c).
- Next: [§3.3](../3-3-vector-potential-f/), the same construction for a magnetic current, with $$\mathbf{F}$$ in place of $$\mathbf{A}$$.

---

## References

[^dipole]: Balanis, §4.2.1, eq. (4-4), p. 153, and eqs. (4-10a) to (4-10c), p. 154. The widget's sum $$-j\omega\mathbf{A} - \nabla\phi_e$$ reproduces (4-10a) and (4-10b) at every point.
[^intro]: Balanis, §3.1, pp. 133–135, and Fig. 3.1.
[^steps]: Balanis, [§3.2](../3-2-vector-potential-a/), eqs. (3-2) to (3-15), pp. 135–136.
[^gauge]: J. D. Jackson, "From Lorenz to Coulomb and other explicit gauge transformations," *American Journal of Physics* 70, 917–928 (2002), [doi:10.1119/1.1491265](https://doi.org/10.1119/1.1491265): in the Coulomb gauge the scalar potential is instantaneous, while the fields are the same in every gauge and propagate at the speed of light.
[^lorenz]: J. D. Jackson and L. B. Okun, "Historical roots of gauge invariance," *Reviews of Modern Physics* 73, 663–680 (2001), [doi:10.1103/RevModPhys.73.663](https://doi.org/10.1103/RevModPhys.73.663).
