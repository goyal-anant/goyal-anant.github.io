---
title: Far-Field Radiation
book: balanis
section: "3.6"
---

## What this section is really saying

Far from the antenna, keep only the part of $$\mathbf{A}$$ that falls as $$1/r$$. Then the electric field is $$-j\omega\mathbf{A}$$ with its radial part thrown away, and $$\mathbf{H}$$ is $$\mathbf{E}$$ turned by 90° about $$\hat{\mathbf{a}}_r$$ and divided by $$\eta$$: a TEM wave going out.[^steps] No curl, no gradient of a divergence. Every pattern from Chapter 4 on is computed this way. This page is about two things the section says quickly: what "far" means, and what "drop the radial part" looks like.

## Predict first

The book says the far field starts at $$2D^2/\lambda$$. For a half-wave Wi-Fi dipole at 2.45 GHz ($$\lambda$$ = 12.24 cm, $$D$$ = 6.12 cm) that is 6.12 cm. How far off is the far-field formula at 6.12 cm?

## How far is far

The far-field formulas make two separate approximations. The first drops the terms of the field that fall as $$1/r^2$$ and $$1/r^3$$; that needs $$kr \gg 1$$, a distance counted in wavelengths, whatever the antenna's size. The second replaces the distance $$R$$ from each point of the antenna by $$r - r'\cos\psi$$; that needs $$r \ge 2D^2/\lambda$$, which grows with the square of the size ([§2.2](../2-2-radiation-pattern/#near-field-and-far-field) has where it comes from). The book mentions only the second. The far field begins beyond whichever wall is further out.

This widget puts a centre-fed wire with the sinusoidal current of eq. (4-56) on the $$z$$ axis, computes its exact fields in closed form,[^exact] and compares them with the far-field formula at every distance.

### Things to try

1. *Half-wave* at 6.12 cm (0.5 λ), the answer to the question above. The radial field there is two thirds of the peak far field, the pattern is off by 75%, and $$E_\theta$$ is 21° late. The total $$\vert E\vert$$ pattern comes within 10% only beyond 2.54 λ (31.0 cm) and within 1% beyond 25.0 λ (3.06 m). For this antenna $$2D^2/\lambda$$ is the wrong wall; $$kr$$ is the one that matters.
2. *Short, 0.1 λ*. Here $$2D^2/\lambda$$ is 0.02 λ, 2.4 mm, which means nothing. Watch the dashed phase curve: at 1 λ the phase is 9.3° late, at 10 λ still 0.92°. The amplitude settles as $$1/(kr)^2$$ but the phase only as $$1/kr$$ (the gap below), so a magnitude pattern is fine much sooner than a phase measurement.
3. *3 λ wire*. Now $$2D^2/\lambda$$ = 18 λ (2.2 m) is far beyond $$kr = 1$$. At 18 λ the radial field is only 3.1% but the pattern is still 13.5% off, from the path differences across the wire. Within 10% from 24.3 λ, within 1% from 244 λ. For a big antenna it is the other wall that matters.

{% include readalong/far-field.html case="distance" l=0.5 r=0.5 caption="Left: errors of the far-field formula against distance, both scales logarithmic. Pattern error: the largest difference between the exact |E| (E<sub>r</sub> included) and the far-field |E<sub>θ</sub>|, each normalised to its own peak, over all directions, in % of the peak. Radial field: the largest |E<sub>r</sub>| over all directions, in % of the peak far field. Phase: of the exact E<sub>θ</sub> against the far-field one, at the direction of the beam peak. The last curve is |E<sub>θ</sub>|/η|H<sub>φ</sub>| minus 1 at the peak. Right: the E-plane pattern at the probe, exact (filled) against the far-field formula (dashed). Exact fields from Balanis eqs. (8-53) to (8-55b); distances at 2.45 GHz (λ = 12.24 cm)." %}

## The shadow of A

Why does the radial part go? In [§3.2](../3-2-vector-potential-a/) the field had two pieces, $$-j\omega\mathbf{A}$$ and the gradient term, and far away their radial parts cancel (try that widget at $$kr = 15$$). Their tangential parts don't: the gradient term's are smaller by $$1/kr$$. So what is left of $$-j\omega\mathbf{A}$$ is its *shadow* on the sphere, the part tangent to it.

For a wire along $$z$$, $$\mathbf{A}$$ points along $$z$$ everywhere. Its shadow at angle $$\theta$$ from the wire has length $$\sin\theta$$ and points along $$\hat{\mathbf{a}}_\theta$$. That one projection is the short dipole's whole pattern and its polarization.

### Things to try

1. *Wire*, $$\theta = 45°$$. The dropped radial part is $$\cos 45° = 0.71$$ of $$\vert\mathbf{A}\vert$$, as big as the shadow. If you kept it, $$E_r$$ would equal $$E_\theta$$; the true $$E_r$$ has no $$1/r$$ part at all.
2. Move the point up to $$\theta = 1°$$. $$\mathbf{A}$$ now points straight out of the sphere and its shadow is gone: the null along the wire.
3. *Loop*. Now $$\mathbf{F}$$ points along $$z$$ (a small loop is a magnetic current, [§3.3](../3-3-vector-potential-f/)), its shadow is now $$\mathbf{H}$$, and $$\mathbf{E} = -\eta\,\hat{\mathbf{a}}_r\times\mathbf{H}$$ lies across it (eq. 3-59). Same $$\sin\theta$$ pattern, but at the chosen point $$\mathbf{E}$$ is horizontal: the wire's fields turned by 90°. This swap is §3.7.
4. *Play*. $$\mathbf{E}$$ and $$\mathbf{H}$$ swing together, at right angles to each other and to $$\hat{\mathbf{a}}_r$$, everywhere on the sphere. That is "TEM to $$r$$".

{% include readalong/far-field.html case="shadow" kind="wire" th=45 ph=0 caption="A sphere far from a short source at its centre; drag to turn it (or use the arrow keys), tap a dot to pick a direction. The key above says what each colour is. Arrow lengths are relative, with the −jω left out; Play swings E and H through one cycle every 2 seconds." %}

## The gap

<details markdown="1">
<summary markdown="span">Why $$E_r$$ has no $$1/r$$ part</summary>

Write the radial part of $$\mathbf{A}$$ as $$A_r = a(\theta,\phi)\,e^{-jkr}/r$$. Each $$\partial/\partial r$$ of $$e^{-jkr}/r$$ gives $$-jk$$ times it, plus terms one power of $$r$$ smaller. So

$$
\nabla\cdot\mathbf{A} = -jk\,A_r + O\!\left(\frac{1}{r^2}\right), \qquad \frac{\partial}{\partial r}(\nabla\cdot\mathbf{A}) = -k^2 A_r + O\!\left(\frac{1}{r^2}\right),
$$

and the radial part of eq. (3-15) is

$$
E_r = -j\omega A_r - \frac{j}{\omega\mu\epsilon}\left(-k^2 A_r\right) + O\!\left(\frac{1}{r^2}\right) = -j\omega A_r + j\omega A_r + O\!\left(\frac{1}{r^2}\right),
$$

since $$k^2 = \omega^2\mu\epsilon$$. The $$\theta$$ and $$\phi$$ parts of $$\nabla(\nabla\cdot\mathbf{A})$$ carry $$\frac{1}{r}\frac{\partial}{\partial\theta}$$ and $$\frac{1}{r\sin\theta}\frac{\partial}{\partial\phi}$$, so they start at $$1/r^2$$ and only $$-j\omega A_\theta$$, $$-j\omega A_\phi$$ survive.

</details>

<details markdown="1">
<summary markdown="span">Why the phase settles so slowly</summary>

For a short dipole the exact $$E_\theta$$ is the far-field one times $$1 + \frac{1}{jkr} - \frac{1}{(kr)^2}$$ (Balanis eq. 4-10b).[^short] The $$1/jkr$$ term is at right angles to the 1, so it turns the phase by about $$-1/kr$$ radian but changes the length only at second order:

$$
\left\vert 1 + \frac{1}{jkr} - \frac{1}{(kr)^2}\right\vert^2 = 1 - \frac{1}{(kr)^2} + \frac{1}{(kr)^4}.
$$

At $$r = 10\lambda$$, $$kr = 62.8$$: the phase is $$57.3°/62.8 = 0.91°$$ late (0.92° exactly), the amplitude off by 0.013%.

</details>

## Common confusion

1. "$$\mathbf{E} = -j\omega\mathbf{A}$$ in the far field." Only its $$\theta$$ and $$\phi$$ components; the book says so in small print under (3-58a). For a $$z$$-directed wire $$A_r/A_\theta = -\cot\theta$$, so keeping $$A_r$$ gives a radial field as big as $$E_\theta$$ at 45°.
2. "The far field starts at one distance." It depends on the antenna's size in wavelengths, and on what you measure: for the half-wave dipole the magnitude pattern is within 10% from 2.5 λ, and within 1% only from 25 λ.

## In the book

- [§3.6](../3-6-far-field-radiation/), pp. 142–144, eqs. (3-55) to (3-59b). Field regions: [§2.2.4](../2-2-radiation-pattern/#near-field-and-far-field), p. 34, Figs. 2.7 and 2.8 (pp. 34–35).
- The short dipole's regions in §4.2.4 to §4.2.6, pp. 158–160; the far-field recipe as Table 4.1, p. 162; $$2D^2/\lambda$$ derived in §4.4.1, eqs. (4-40) to (4-55c), pp. 166–170.
- Next: §3.7, duality, the wire-and-loop swap of the second widget.

---

## References

[^steps]: Balanis, [§3.6](../3-6-far-field-radiation/), eqs. (3-56) to (3-59b), pp. 142–143.
[^exact]: Balanis, §8.5.2, eqs. (8-53), (8-55a), (8-55b), p. 463: the exact fields of a thin wire with a sinusoidal current, for any distance.
[^short]: Balanis, §4.2, eqs. (4-10a) to (4-10c), p. 154.
