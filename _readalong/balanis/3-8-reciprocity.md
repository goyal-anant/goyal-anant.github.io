---
title: Reciprocity and Reaction Theorems
book: balanis
section: "3.8"
---

## What this section is really saying

Swap the transmitter and the receiver, and the signal that gets through is the same. In circuits you know this as "swap the source and the meter, the reading doesn't change"; Maxwell's equations give the same thing for fields, as long as the medium is linear and has no magnetic bias.[^lorentz] The book uses it for two facts the rest of antenna theory leans on: the coupling between two antennas is the same both ways, and an antenna's pattern is the same whether it transmits or receives.

## Predict first

A Wi-Fi router has an upright dipole; across the room, a laptop has a small antenna that looks nothing like it. When the router transmits, the laptop gets $$-60$$ dB of the available power. Now the laptop transmits, with the same generator and the same matching at both ends. What does the router get?

## The theorem in one line

Take two sets of sources at one frequency, $$\mathbf{J}_1, \mathbf{M}_1$$ and $$\mathbf{J}_2, \mathbf{M}_2$$, each alone producing its own fields. If every source sits inside a finite region and the fields go out to infinity as outgoing waves, then

$$
\begin{aligned}
&\int_V \left(\mathbf{E}_1\cdot\mathbf{J}_2 - \mathbf{H}_1\cdot\mathbf{M}_2\right) dv \\
&\quad = \int_V \left(\mathbf{E}_2\cdot\mathbf{J}_1 - \mathbf{H}_2\cdot\mathbf{M}_1\right) dv,
\end{aligned}
$$

Balanis eq. (3-66).[^ff] The left side is what the fields of set 1 do to the sources of set 2; Rumsey called it the *reaction* $$\langle 1,2\rangle$$, and the theorem is $$\langle 1,2\rangle = \langle 2,1\rangle$$.[^reaction] There is no complex conjugate anywhere, so a reaction is not a power. It is a coupling number, and the next section shows that for two antennas it is the mutual impedance itself.

## Two antennas, both ways

For two thin wires the reaction becomes Balanis's induced-EMF formula: the field of antenna 1 along antenna 2, times the current on antenna 2, integrated along it,[^emf]

$$
Z_{21} = -\frac{1}{I_1 I_2}\int E_{z,1}(z)\, I_2(z)\, dz .
$$

$$Z_{12}$$ is the same thing the other way round: a different field on a different wire. The widget works both integrals out separately. Each end then gets a conjugate-matched generator or load, as in Balanis's two-antenna circuit, and the power that reaches the load, per the power the generator has available, is $$4R_1R_2\vert Y_{21}\vert^2$$ (eq. 3-72).[^two] Swap the roles and it is $$4R_2R_1\vert Y_{12}\vert^2$$, equal as soon as $$Z_{12} = Z_{21}$$. So the answer above is $$-60$$ dB again.

### Things to try

1. *Two Wi-Fi dipoles, 6.1 cm apart* (half a wavelength at 2.45 GHz). $$Z_{21}$$ and $$Z_{12}$$ both come out $$-12.5 - j29.9$$ Ω, and $$-13.38$$ dB gets through in either direction. Friis would say $$-11.66$$ dB: at this distance the antennas are in each other's near field and Friis doesn't apply yet.
2. *Unequal and staggered*: antenna 2 is now 0.3 λ long and raised by 0.2 λ, so its own impedance is $$20.1 - j334$$ Ω against the half-wave's $$73.1 + j42.1$$ Ω. The two integrals are over different wires with different fields, and still both give $$1.97 - j16.25$$ Ω. Press the transmit toggle: the wavefronts change direction, and the numbers stay put.
3. Slide the spacing out. Both curves stay on top of each other all the way, and they meet the Friis line: 0.15 dB apart at 2 λ, 0.02 dB at 5 λ. Friis is the far-field end of this same two-port.

{% include readalong/reciprocity.html case="link" d=0.5 l2=0.5 h=0 caption="Two parallel thin dipoles, antenna 1 half a wavelength long, side by side at spacing d, with sinusoidal currents (induced EMF, Balanis eqs. (8-55b), (8-66) and (8-68)); wire radius 0.001 λ for the self impedances. The power is what the conjugate-matched load receives, per the power available from the conjugate-matched generator (Balanis eq. (3-72)), in dB. Friis: free-space loss with each dipole's directivity towards the other (<a href='../2-17-friis-transmission-and-radar-range-equations/'>§2.17</a>). The readout turns d into centimetres at 2.45 GHz (λ = 12.24 cm)." %}

## One pattern, measured both ways

Balanis's second use is the pattern.[^pattern] Two antennas, open-circuit voltage at one per current at the other: $$Z_{21} = V_2^{oc}/I_1$$ and $$Z_{12} = V_1^{oc}/I_2$$. Equal, for every position. So turn the antenna under test on a table and record the voltage at the probe (transmit pattern), or at the antenna (receive pattern): the two records are the same curve.

Figure 1 is the chamber of the pattern-measurement figure in [§2.2](../2-2-radiation-pattern/#how-a-cut-is-measured) (its Fig 1), with one switch added. On the first turn the dipole transmits and the horn's receiver reads the level: the solid trace. On the second turn the horn transmits and the dipole's receiver reads it: the dashed trace, drawn right over the first. In practice the antenna under test is the one that receives: the transmitter, with its sources and amplifiers, stays still on a stable mount, and the receiver on the table can be as simple as a diode detector.[^measure]

{% include readalong/reciprocity-range.html %}

## Where it breaks

The derivation of (3-60) needs the medium to treat both waves alike. In the book that is "linear and isotropic"; the exact condition is that the permittivity and permeability, if they are tensors, are symmetric.[^caloz] A ferrite or a plasma in a steady magnetic field breaks this, and the visible symptom is *Faraday rotation*: the polarization turns as the wave goes through, and it turns the same way in absolute terms whichever way the wave travels. So a round trip doubles the turn instead of undoing it. Isolators, the one-way valves of microwave circuits, can be built on exactly this.[^iso]

### Things to try

1. *No rotation*, antenna 2 tilted 45°: 50% gets through each way, the usual polarization mismatch of [§2.12](../2-12-polarization/).
2. *Faraday, 22.5°*: 85.4% from 1 to 2, but 14.6% from 2 to 1. Same slab, same antennas, different answer: $$Z_{12} \neq Z_{21}$$.
3. *Isolator: Faraday, 45°*: 100% one way, nothing the other way. Then *Chiral, 45°*: a twisted medium turns the polarization by the same 45°, but relative to the wave's own direction, so the return trip undoes it and 100% gets through both ways. Turning the polarization is not what breaks reciprocity; the bias field is.

{% include readalong/reciprocity.html case="faraday" medium="faraday" omega=22.5 psi=45 caption="Two linear antennas facing each other through a slab that turns the polarization by Ω; antenna 1 at 0°, antenna 2 tilted by ψ, angles seen from antenna 1 looking towards 2. The power is the share that the receiving antenna picks up, cos² of the angle between the arriving field and the antenna. The slab and the wave are schematic, not to scale." %}

## Reciprocity as a check on a solver

Moment-method codes (Balanis Ch. 8) turn a wire antenna into a matrix equation. Whether the computed $$Z_{12}$$ equals $$Z_{21}$$ depends on how the equations are tested. Test each segment with the same function that carries its current (*Galerkin*) and the matrix is symmetric by construction: reciprocity comes out exact. Test at points or with short pulses on segments of different lengths, and it comes out only approximately.

### Things to try

1. *Pulse* testing: $$\vert Z_{12} - Z_{21}\vert/\vert Z_{12}\vert$$ is $$2.2\times10^{-3}$$ with 10 and 4 segments and $$1.3\times10^{-5}$$ with 160 and 56, i.e. about 170 times smaller for 16 times more segments, close to $$1/N^2$$. The gap is discretisation error, and it is a free error bar on the result.
2. *Galerkin*: about $$10^{-15}$$ at every mesh, which is rounding.
3. Watch $$Z_{11}$$ while the mesh steps: with Galerkin testing it drifts from 85 to 94 Ω. A perfectly symmetric matrix can still be inaccurate; reciprocity checks the bookkeeping, not the physics of the feed.

{% include readalong/reciprocity.html case="solver" mesh=0 test="pulse" caption="Thin-wire moment method: two parallel wires 0.5 λ and 0.3 λ long, 0.4 λ apart, the short one raised by 0.2 λ, radius 0.002 λ; triangle basis, delta-gap feed at each wire's middle, mixed-potential form. N is the number of segments on the long wire; the short one has 0.35 N, so the two meshes have different segment lengths. Play steps through the meshes; the shaded band is the current when wire 1 is driven, each wire on its own scale." %}

## The gap

<details markdown="1">
<summary markdown="span">Where (3-60) comes from, and what "isotropic" is for</summary>

Use $$\nabla\cdot(\mathbf{a}\times\mathbf{b}) = \mathbf{b}\cdot\nabla\times\mathbf{a} - \mathbf{a}\cdot\nabla\times\mathbf{b}$$ with $$\nabla\times\mathbf{E} = -\mathbf{M} - j\omega\mu\mathbf{H}$$ and $$\nabla\times\mathbf{H} = \mathbf{J} + j\omega\epsilon\mathbf{E}$$:

$$
\begin{aligned}
&\nabla\cdot(\mathbf{E}_1\times\mathbf{H}_2) = -\mathbf{H}_2\cdot\mathbf{M}_1 - \mathbf{E}_1\cdot\mathbf{J}_2 \\
&\qquad - j\omega\mu\,\mathbf{H}_1\cdot\mathbf{H}_2 - j\omega\epsilon\,\mathbf{E}_1\cdot\mathbf{E}_2 .
\end{aligned}
$$

Swap 1 and 2 and subtract. The $$j\omega\mu\,\mathbf{H}_1\cdot\mathbf{H}_2$$ and $$j\omega\epsilon\,\mathbf{E}_1\cdot\mathbf{E}_2$$ terms cancel, and what is left is (3-60). That cancellation is the only place the medium enters. With a tensor permittivity the two terms are $$\mathbf{E}_1\cdot\bar\epsilon\,\mathbf{E}_2$$ and $$\mathbf{E}_2\cdot\bar\epsilon\,\mathbf{E}_1$$, equal exactly when $$\bar\epsilon$$ is symmetric. Loss doesn't matter (a complex $$\epsilon$$ cancels just as well); a magnetic bias, which makes the tensor non-symmetric, does.

</details>

<details markdown="1">
<summary markdown="span">Why the surface term at infinity is zero</summary>

Balanis drops the surface integral of $$\mathbf{E}_1\times\mathbf{H}_2 - \mathbf{E}_2\times\mathbf{H}_1$$ "in the far field" (3-64). It vanishes at every point, not only on average. In the far field $$\mathbf{H} = \hat{\mathbf{r}}\times\mathbf{E}/\eta$$ with $$\mathbf{E}\perp\hat{\mathbf{r}}$$ ([§3.6](../3-6-far-field-radiation/)), so

$$
\begin{aligned}
&\mathbf{E}_1\times(\hat{\mathbf{r}}\times\mathbf{E}_2) - \mathbf{E}_2\times(\hat{\mathbf{r}}\times\mathbf{E}_1) \\
&\quad = \hat{\mathbf{r}}(\mathbf{E}_1\cdot\mathbf{E}_2) - \hat{\mathbf{r}}(\mathbf{E}_2\cdot\mathbf{E}_1) = 0 .
\end{aligned}
$$

With a conjugate on one field, as in the Poynting vector, the two terms no longer cancel; that is why power is not reciprocal in the same way. And since the region between any closed surface around all the sources and infinity is source-free, (3-63) moves the zero onto that surface too.

</details>

<details markdown="1">
<summary markdown="span">The reaction is the mutual impedance</summary>

For a thin wire 2 fed at a gap, the current density is $$\mathbf{J}_2 = \hat{\mathbf{z}}\,I_2(z)$$ along the wire, so $$\langle 1,2\rangle = \int E_{z,1}\,I_2\,dz$$, and Balanis eq. (8-66) reads $$Z_{21} = -\langle 1,2\rangle/(I_1 I_2)$$, with $$I_1, I_2$$ the input currents. The same for $$Z_{12}$$ with $$\langle 2,1\rangle$$. So (3-69) is $$Z_{12} = Z_{21}$$, and the induced-EMF values of Ch. 8 are reciprocal because the free-space field of a source at $$\mathbf{r}'$$ seen at $$\mathbf{r}$$ is the same as that of a source at $$\mathbf{r}$$ seen at $$\mathbf{r}'$$.

</details>

## Common confusion

1. "Reciprocity needs the two antennas polarization matched." Balanis says this on p. 148,[^polar] but (3-76) holds for any polarizations, as he says himself a page later. Polarization only decides which part of the field the probe picks up; it picks up the same part in both directions.
2. "Reciprocal means the two antennas are alike." The dipole and the 0.3 λ wire above have impedances $$73 + j42$$ and $$20 - j334$$ Ω and different gains. What is equal is the transfer between them, not the antennas.
3. "Lossy means nonreciprocal." Wet ground and sea water are lossy and reciprocal; a lossless magnetized ferrite is not.[^caloz]

## In the book

- [§3.8](../3-8-reciprocity/), pp. 144–150: eqs. (3-60) to (3-69); [§3.8.1](../3-8-reciprocity/#two-antennas-both-ways), eqs. (3-70) to (3-73), Figs. 3.3 and 3.4, p. 147; [§3.8.2](../3-8-reciprocity/#one-pattern-measured-both-ways), eqs. (3-74) to (3-77), Fig. 3.5, pp. 148–149.
- The induced-EMF method: §8.5, eqs. (8-55b), (8-60a,b) and (8-61a), pp. 463–465; mutual impedance §8.6, eqs. (8-63) to (8-69), pp. 468–472.
- Patterns measured on a range: [§2.2](../2-2-radiation-pattern/) and Ch. 17. Friis: [§2.17](../2-17-friis-transmission-and-radar-range-equations/).

---

## References

[^lorentz]: Balanis, [§3.8](../3-8-reciprocity/), eqs. (3-60) and (3-61), pp. 144–145.
[^ff]: Balanis, eqs. (3-64) to (3-66), p. 146.
[^reaction]: Balanis, eqs. (3-67) to (3-69), pp. 146–147, after V. H. Rumsey, "Reaction Concept in Electromagnetic Theory", *Physical Review* 94, 1483–1491 (1954), [doi:10.1103/PhysRev.94.1483](https://doi.org/10.1103/PhysRev.94.1483), his ref. [4].
[^emf]: Balanis, §8.5, eq. (8-55b), p. 463, and §8.6, eqs. (8-66), p. 470, and (8-68), p. 472.
[^two]: Balanis, [§3.8.1](../3-8-reciprocity/#two-antennas-both-ways), eqs. (3-70) to (3-73) and Figs. 3.3 and 3.4, pp. 147–148.
[^pattern]: Balanis, [§3.8.2](../3-8-reciprocity/#one-pattern-measured-both-ways), eqs. (3-74) to (3-77) and Fig. 3.5, pp. 148–149.
[^measure]: Balanis, p. 150.
[^polar]: Balanis, p. 148; compare p. 149, below eq. (3-77).
[^caloz]: C. Caloz, A. Alù, S. Tretyakov, D. Sounas, K. Achouri and Z.-L. Deck-Léger, "Electromagnetic Nonreciprocity", *Physical Review Applied* 10, 047001 (2018), [doi:10.1103/PhysRevApplied.10.047001](https://doi.org/10.1103/PhysRevApplied.10.047001); preprint [arXiv:1804.00235](https://arxiv.org/abs/1804.00235). Sec. VI (a chiral medium against a Faraday medium), Sec. VII (reciprocity holds for symmetric permittivity and permeability tensors) and Sec. XII (a lossy waveguide without bias is reciprocal).
[^iso]: Caloz et al. (2018), Sec. XVIII: isolators may be of Faraday, resonance, field-displacement or circulator type.
