---
title: Input Impedance
book: balanis
section: "2.13"
---

## What this section is really saying

Seen from its two terminals, an antenna is an impedance, $$Z_A = R_A + jX_A$$, and its resistance has two parts: $$R_r$$, where power leaves as radiation, and $$R_L$$, where it turns into heat.[^za] Put it in series with a generator and the whole section is one loop current and three $$\tfrac12\vert I\vert^2R$$ terms. The receiving antenna gets the same circuit with the source moved to the antenna's side.

## Predict first

A full-wave dipole has a radiation resistance of about 199 Ω, nearly three times the half-wave dipole's 73 Ω. Fed at its centre from a 50 Ω line, is it a better match or a worse one?

## The transmitting circuit

The source here can give 1 W at most, i.e. $$\vert V_g\vert^2/8R_g = 1$$ W, and the powers are Balanis eqs. (2-76) to (2-78).[^tx] The presets are copper dipoles of 0.5 mm radius at 2.45 GHz, the same ones as in [§2.8](../2-8-antenna-efficiency/).

### Things to try

1. *λ/2 dipole on a 50 Ω source*: 0.860 W is radiated, 1.5 mW heats the copper, and the source supplies 1.45 W in all. Slide $$X_A$$ to 0 and the antenna takes 0.964 W: most of the mismatch was the $$+j42.5\ \Omega$$, not the 73 against 50.
2. *Conjugate source*: now the antenna takes the full 1 W and $$R_g$$ takes another 1 W, so the source supplies 2 W. This is eqs. (2-81) to (2-85): with a conjugate match, the radiated share of what the source supplies can never exceed one half.
3. *λ/10 dipole*: $$2.0 - j551\ \Omega$$. On a 50 Ω source it radiates 1.3 mW of the 1 W on offer. The conjugate source rescues it to 0.99 W, but only on paper: that source carries $$+j551\ \Omega$$, a coil, and a real coil has loss ([§2.8](../2-8-antenna-efficiency/) shows how much).
4. *On the map*, every antenna with the same $$R_A$$ and $$X_A$$ lands on the same spot, whatever its shape. The bright spot is the conjugate of $$Z_g$$, and it moves with the source.

{% include readalong/antenna-circuit.html case="transmit" gen="50" caption="Left: the series circuit of Balanis Fig. 2.27(b) for a source that can give 1 W at most, with the power in each resistor; bars run to 2 W and the dashed line marks 1 W. Right: power into the antenna (0 to 1 W) over antenna resistance and reactance for the chosen source; the cross is the conjugate match and the dot is the antenna. Presets: copper dipoles, 0.5 mm radius, 2.45 GHz, impedance from Balanis eqs. (8-60) and (8-61)." %}

## Which current the resistance belongs to

Balanis eq. (4-70) gives the radiation resistance of a dipole referred to the *maximum* of its sinusoidal current.[^rmax] The circuit above needs it at the feed. For a lossless antenna the radiated power is the same either way, so $$\tfrac12\vert I_{in}\vert^2R_{in} = \tfrac12\vert I_0\vert^2R_r$$, and with $$I_{in} = I_0\sin(kl/2)$$,

$$
R_{in} = \frac{R_r}{\sin^2(kl/2)},
$$

which is eq. (4-79).[^rin] Below $$l = \lambda/2$$ the feed carries the maximum anyway and the two agree. Above it they part, and at $$l = \lambda$$ the sinusoidal current is zero at the feed, so $$R_{in}$$ goes to infinity.

A real wire doesn't do that: its current near the feed is not exactly sinusoidal, and the input impedance stays finite. The red curves solve for the real current with the moment method of Balanis §8.5, for a 0.5 mm and a 0.05 mm wire.[^mom]

### Things to try

1. *λ/2*: 73.1 Ω both ways for the sinusoidal current; the moment method gives $$95.4 + j50.1\ \Omega$$ on the 0.5 mm wire and $$84.4 + j51.5\ \Omega$$ on the 0.05 mm one. A thicker wire and a real feed shift the numbers by tens of ohms.
2. *3λ/4*: the feed carries 0.707 of the maximum current, so 185.8 Ω at the maximum becomes 371.6 Ω at the feed.
3. *λ*: 199.1 Ω at the current maximum and infinity at the feed. The 0.5 mm wire gives $$407 - j604\ \Omega$$, and the 0.05 mm wire $$1173 - j1463\ \Omega$$: either way, far from 50 Ω. The resistance peaks a little short of λ: about 1020 Ω at $$0.84\lambda$$ on the thick wire and 2610 Ω at $$0.91\lambda$$ on the thin one.
4. *3λ/2*: a current maximum sits at the feed again, and the two sinusoidal curves meet at 105.5 Ω.

{% include readalong/antenna-circuit.html case="terminals" length="1" radius="0.5" caption="Top: a centre-fed dipole with its sinusoidal current, Balanis eq. (4-56), shaded; dashed lines are the current maxima and the dot is the feed. Bottom: radiation resistance at the current maximum, eq. (4-70), and at the feed, eq. (4-79), against length, log scale; red: input resistance by the moment method (Hallén's equation, magnetic-frill feed of a 50 Ω coax, 0.5 mm and 0.05 mm copper-free wires at 2.45 GHz)." %}

## The receiving circuit

In receive mode the incident wave becomes a voltage source $$V_T$$ inside the antenna, and the load sits where the generator was.[^rx] With a conjugate-matched load, the circuit sends half of the captured power to the load and the other half into $$R_r$$ and $$R_L$$, and Balanis reads the power in $$R_r$$ as power scattered back out (eqs. (2-86) to (2-89)). So a matched lossless antenna would always scatter as much as it delivers.

That holds for a thin dipole and not in general. The Thevenin circuit only promises the right voltage and current at the terminals; the power in its internal impedance is not the scattered power.[^collin] The real limit comes from the optical theorem: for a matched, lossless antenna the share that reaches the load lies between $$\tfrac12(1 - \sqrt{1-x})$$ and $$\tfrac12(1 + \sqrt{1-x})$$, where $$x = D_a/D_s$$ is the antenna's directivity towards the source over the directivity of its scattered field in the forward direction.[^af]

### Things to try

1. *Thin dipole*: $$x = 1$$ and the band shrinks to 50%: the one-mode antenna for which the circuit is right.
2. *3-dipole endfire array*: three half-wave dipoles 0.2 λ apart behind a lossless network, tuned for the largest absorbed share. It reaches 93%, at $$x = 0.252$$, right under the upper limit of 93.2%.
3. Slide $$x$$ towards 0: the band opens from 0% to 100%. An antenna can absorb almost all the power it takes out of the wave, but only if it scatters what's left into a very narrow beam.

{% include readalong/antenna-circuit.html case="receive" x="1" caption="Top: the share of the captured power that reaches a conjugate-matched load, from the Thevenin circuit (always 50%) and from the optical-theorem limits for the chosen x. Bottom: the allowed band against x = Da/Ds, with the thin dipole and the three-dipole endfire array computed by Andersen and Frandsen (2005)." %}

## The gap

<details markdown="1">
<summary markdown="span">Where the optical-theorem limits come from</summary>

Measure areas in units of $$\lambda^2/4\pi$$. A matched, lossless antenna absorbs $$a = D_a$$ (the effective area of §2.15), and scatters a total of $$s$$. The optical theorem ties the total power taken out of the wave to the scattered field straight ahead, and bounding that field by its size gives

$$
a + s \le 2\sqrt{D_s\,s},
$$

where $$D_s s$$ is the forward scattering. Squared, this is a quadratic in $$s$$, so $$s$$ lies between two roots. With $$\eta = a/(a+s)$$ and $$x = D_a/D_s \le 1$$,

$$
\left(\eta - \tfrac12\right)^2 \le \frac{1-x}{4}.
$$

The two limits meet at $$\eta = \tfrac12$$ only when $$D_s = D_a$$, i.e. when the antenna scatters with the same pattern it radiates: the minimum-scattering antenna, of which the thin dipole is the classic case.[^af]

</details>

## Common confusion

1. "About 200 Ω of radiation resistance means a full-wave dipole is a fair match to 50 Ω." That 199 Ω is referred to the current maximum. At the centre, where the line connects, the current is near zero and the impedance is hundreds to thousands of ohms, depending on the wire.
2. "A matched receiving antenna delivers at most half of what it captures." Only for a minimum-scattering antenna such as a thin dipole. The 50% comes from the circuit, and the circuit doesn't know about scattering.

## In the book

- §2.13, pp. 80–85. Eqs. (2-72) to (2-73) and Fig. 2.27, p. 81; transmit-mode powers (2-74) to (2-80), p. 82; conjugate match (2-81) to (2-85), p. 83; receive mode, Fig. 2.28 and (2-86) to (2-89), pp. 83–85.
- The footnote on p. 82: the series circuit doesn't hold for antennas with lossy dielectric or over lossy ground.
- Radiation resistance at the current maximum: §4.5.3, eq. (4-70), p. 177; at the feed: §4.5.5, eqs. (4-77) to (4-79), pp. 179–180. The moment method: §8.5, p. 458; Table 8.2, p. 461. Scattering by a loaded antenna: §2.17, eqs. (2-127) to (2-133). Radiation efficiency, $$R_L$$ of a wire: §2.14.

---

## References

[^za]: Balanis, §2.13, eqs. (2-72) and (2-73), pp. 80–81, quoting the IEEE definition of input impedance.
[^tx]: Balanis, §2.13, Fig. 2.27 and eqs. (2-74) to (2-85), pp. 81–83.
[^rmax]: Balanis, §4.5.3, eq. (4-70), p. 177.
[^rin]: Balanis, §4.5.5, eqs. (4-77) to (4-79), pp. 179–180.
[^mom]: Balanis, §8.5.1, pp. 458–459, and Table 8.2, p. 461 (magnetic-frill feed, eq. (8-32), p. 449). Our solver uses Hallén's equation with the exact kernel and pulse currents; for Balanis's 0.47 λ, 0.005 λ dipole it gives $$77.8 + j12.0\ \Omega$$ against his $$78.8 + j12.9\ \Omega$$ at 79 segments.
[^rx]: Balanis, §2.13, Fig. 2.28 and eqs. (2-86) to (2-89), pp. 83–85.
[^collin]: R. E. Collin, "Limitations of the Thevenin and Norton equivalent circuits for a receiving antenna," *IEEE Antennas and Propagation Magazine*, vol. 45, no. 2, pp. 119–124, 2003, [doi:10.1109/MAP.2003.1203128](https://doi.org/10.1109/MAP.2003.1203128) (abstract).
[^af]: J. Bach Andersen and A. Frandsen, "Absorption efficiency of receiving antennas," *IEEE Transactions on Antennas and Propagation*, vol. 53, no. 9, pp. 2843–2849, 2005, [doi:10.1109/TAP.2005.854532](https://doi.org/10.1109/TAP.2005.854532) ([author copy](https://vbn.aau.dk/en/publications/absorption-efficiency-of-receiving-antennas)).
