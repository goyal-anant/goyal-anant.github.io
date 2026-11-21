---
title: Duality Theorem
book: balanis
section: "3.7"
---

## What this section is really saying

The equations for $$\mathbf{A}$$ and its fields have the same form as the equations for $$\mathbf{F}$$ and its fields, with a few symbols traded. So once you have solved a problem with an electric current, you get the problem with a magnetic current for free: swap the symbols and read off the answer.[^dual] That is the whole theorem. The swap has one minus sign which is easy to lose, and it reaches further than the book's table: boundaries swap too.

## Predict first

A small loop lies flat, 6 mm above a large metal plate, at 2.45 GHz (that is 0.05 λ). A short dipole stands upright at the same height above the same plate. Compared with each one alone in free space, which radiates more, and by how much?

## The swap

Every row of Figure 1 is a pair of dual quantities. The electric-source column is [§3.2](../3-2-vector-potential-a/), the magnetic one is [§3.3](../3-3-vector-potential-f/), and comparing them line by line is how the book proves the theorem.[^pairs] Why is it fine to trade $$\epsilon$$ and $$\mu$$, when the medium doesn't change? Because the swap acts on the formulas, not on the space: in the $$\mathbf{F}$$ equations $$\epsilon$$ sits where $$\mu$$ sat in the $$\mathbf{A}$$ equations. After the swap you put the real $$\epsilon$$ and $$\mu$$ back in, and the answer is for the same free space.

{% include readalong/duality-mirror.html %}

The most used pair is the last one. A small loop of area $$S$$ carrying $$I_0$$ radiates like a short magnetic current with $$I_ml = jS\omega\mu I_0$$, so its fields are the short dipole's fields put through the swap.[^loop] Same $$\sin\theta$$ pattern, with $$\mathbf{E}$$ and $$\mathbf{H}$$ trading directions (the loop case of [§3.6](../3-6-far-field-radiation/#the-shadow-of-a) shows it on a sphere). Far away that is all. Close in, the swap has more to say.

## Near a dipole and near a loop

The ratio of the transverse $$E$$ to $$H$$ is the *wave impedance* $$Z$$. Far from any antenna it is $$\eta$$ = 377 Ω. For the short dipole,

$$
Z_e = \frac{E_\theta}{H_\phi} = \eta\,\frac{1 + \dfrac{1}{jkr} - \dfrac{1}{(kr)^2}}{1 + \dfrac{1}{jkr}},
$$

from Balanis eqs. (4-10a) to (4-10c).[^short] The swap sends $$\eta \to 1/\eta$$ and $$E \to H$$, so for the loop the same two brackets come out upside down: $$Z_m = -E_\phi/H_\theta$$ is $$\eta$$ times the inverse fraction. Multiply them and the brackets cancel:

$$
Z_e\,Z_m = \eta^2 \quad \text{at every } kr.
$$

Near a dipole the field is mostly electric (impedance far above 377 Ω), near a loop mostly magnetic (far below), and each is the other's mirror image about $$\eta$$.

### Things to try

1. *NFC, 10 cm at 13.56 MHz*, i.e. $$kr = 0.0284$$. The dipole's $$\vert Z_e\vert$$ is 13 250 Ω, the loop's $$\vert Z_m\vert$$ is 10.7 Ω, and their product is $$\eta^2$$ to six digits. An NFC reader at that distance sits in the loop's magnetic near field, 35 times below $$\eta$$.
2. *kr = 1*. Here the two phases are $$-45°$$ and $$+45°$$ and the dipole's $$\vert Z_e\vert$$ is 266 Ω, below $$\eta$$. It doesn't approach 377 Ω from above all the way: it dips to 257 Ω at $$kr = 1.17$$ before it settles.
3. Slide out. $$\vert Z_e\vert$$ stays within 10% of $$\eta$$ from $$kr$$ = 2.99 (0.48 λ) and within 1% from $$kr$$ = 9.95 (1.58 λ); the loop does the same, mirrored.

{% include readalong/duality.html case="impedance" kr=0.0284197 caption="Wave impedance of a short dipole (Z<sub>e</sub> = E<sub>θ</sub>/H<sub>φ</sub>, blue) and of a small loop (Z<sub>m</sub> = −E<sub>φ</sub>/H<sub>θ</sub>, red) against kr, from Balanis eqs. (4-10a) to (4-10c) and (5-20a) to (5-20d). Both scales of the left plot are logarithmic; the dashed line is η = 377 Ω. Neither depends on θ. The readout turns kr into a distance at 13.56 MHz (NFC, λ = 22.1 m) and at 2.45 GHz (Wi-Fi, λ = 12.24 cm)." %}

## Over a ground plane

Duality also swaps the walls. A perfect electric conductor (PEC) forces tangential $$\mathbf{E}$$ to zero; its dual, a perfect magnetic conductor (PMC), forces tangential $$\mathbf{H}$$ to zero. Over a PEC, a vertical electric dipole has an image pointing the same way, but a vertical magnetic dipole has a reversed one; over a PMC it is the other way round.[^images] So the dual of "a dipole standing on metal" is "a flat loop standing on a magnetic wall", not "a flat loop on metal". Put the loop on metal and you have changed the problem.

### Things to try

1. *Loop flat on metal*, the question above. The loop radiates 0.0389 times its free-space power, $$-14.1$$ dB. Its image carries the opposite current right under it and the two nearly cancel. Then *Dipole standing on metal*: 1.96 times, $$+2.9$$ dB, because its image adds.
2. *Its dual: loop over PMC*. The pattern and the 1.96 are those of the dipole on metal, as the swap promises. The readout's row "Its dual" says the same for any source you pick.
3. *Dipole lying on metal* (a horizontal electric dipole): 0.0773, $$-11.1$$ dB. A wire laid flat on a ground plane is shorted just like the flat loop.
4. Drag the height to 0.25 λ. The flat loop is now at 0.696 and the standing dipole at 1.30. At every height the two add up to exactly 2: one has $$\cos^2$$ in its array factor where the other has $$\sin^2$$.

{% include readalong/duality.html case="ground" kind="m" orient="v" wall="pec" h=0.05 caption="A short source at height h (in wavelengths) above an infinite flat perfect conductor, solved with one image below the surface (Balanis §4.7.1, Fig. 4.13). Far field only. The power is what the source sends into the upper half against what the same source, with the same current, sends in free space. The readout also gives h in millimetres at 2.45 GHz (λ = 12.24 cm)." %}

## The gap

<details markdown="1">
<summary markdown="span">The loop's fields by the swap, sign by sign</summary>

Start from the short dipole along $$z$$, Balanis eqs. (4-8a) to (4-10c), with $$C = kIl\sin\theta\,e^{-jkr}/4\pi r$$:

$$
E_\theta = j\eta C\left[1 + \frac{1}{jkr} - \frac{1}{(kr)^2}\right], \qquad H_\phi = jC\left[1 + \frac{1}{jkr}\right].
$$

Swap $$I \to I_m$$, $$\eta \to 1/\eta$$, $$\mathbf{E}_A \to \mathbf{H}_F$$ and $$\mathbf{H}_A \to -\mathbf{E}_F$$:

$$
H_\theta = \frac{jC_m}{\eta}\left[1 + \frac{1}{jkr} - \frac{1}{(kr)^2}\right], \qquad -E_\phi = jC_m\left[1 + \frac{1}{jkr}\right],
$$

with $$C_m = kI_ml\sin\theta\,e^{-jkr}/4\pi r$$. These are Balanis eqs. (5-20b) and (5-20d). Without the minus sign $$E_\phi$$ comes out with the wrong sign: fine for a pattern, wrong the moment the loop's field is added to another one (the Huygens pair of [§3.4](../3-4-fields-from-j-and-m/) would beam backwards). Dividing gives $$Z_m = -E_\phi/H_\theta$$, the dipole's fraction upside down.

</details>

## Common confusion

1. "There are no magnetic currents, so duality is only a trick." The loop is real hardware, and the swap gives its fields exactly. And on monopoles the book says a little more than is known: none has ever been detected, which is not the same as known not to exist. The latest searches still call them hypothetical.[^moedal]
2. "The dual of a problem is the same layout with the other source." The medium and the walls swap too. A dipole on a substrate of $$\epsilon_r = 4$$ has as its dual a loop on a slab of $$\mu_r = 4$$, and a dipole over metal a loop over a magnetic wall. Change only the source and the answer can be off by 17 dB (1.96 against 0.0389 above).

## In the book

- [§3.7](../3-7-duality/), p. 144, with Tables 3.1 and 3.2 (pp. 144–145). The pairs it compares: eqs. (3-2a), (3-3), (3-10), (3-14), (3-15) against (3-16), (3-17), (3-21), (3-25), (3-26), in [§3.2](../3-2-vector-potential-a/) and [§3.3](../3-3-vector-potential-f/).
- The short dipole, eqs. (4-8a) to (4-10c), pp. 153–154; images in electric and magnetic walls, §4.7.1, Fig. 4.13, p. 187.
- The loop as a magnetic dipole by duality, §5.2.2, eqs. (5-20a) to (5-21), p. 237.
- Duality again in Babinet's principle for slots and strips, §12.8, pp. 697–699.

---

## References

[^dual]: Balanis, [§3.7](../3-7-duality/), p. 144, and Table 3.2, p. 145.
[^pairs]: Balanis, Table 3.1, p. 144, and eqs. (3-2a) to (3-26), pp. 135–138.
[^loop]: Balanis, §5.2.2, eq. (5-21), p. 237.
[^short]: Balanis, §4.2, eqs. (4-8a) to (4-10c), pp. 153–154.
[^images]: Balanis, §4.7.1, Fig. 4.13, p. 187.
[^moedal]: MoEDAL Collaboration, "Search for magnetic monopoles produced via the Schwinger mechanism", *Nature* 602, 63–67 (2022), [doi:10.1038/s41586-021-04298-1](https://doi.org/10.1038/s41586-021-04298-1). The abstract calls monopoles "hypothetical" particles that have "never been experimentally detected".
