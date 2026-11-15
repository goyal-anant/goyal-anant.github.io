---
title: Vector Effective Length and Equivalent Areas
book: balanis
section: "2.15"
---

## What this section is really saying

A receiving antenna is described by two numbers. The vector effective length $$\boldsymbol\ell_e$$ turns the incoming field into a voltage at the open terminals, $$V_{oc} = \mathbf E^i\cdot\boldsymbol\ell_e$$.[^le] The effective area $$A_e$$ turns the incoming power density into the power that reaches the load, $$P_T = A_e W_i$$.[^ae] Neither is a physical size of the antenna, and for a wire both are far bigger than the metal.

## Predict first

A Wi-Fi dipole is a 1 mm wire about 6 cm long. Seen from the incoming wave, the wire covers 0.6 cm². How big is the patch of the wave it collects power from: about the same, ten times that, or a hundred times?

## Where the power comes from

Put a short dipole in a plane wave and the wave drives a current on it. That current radiates a wave of its own, and the two add up around the wire. Below are the lines along which energy flows on average (the time-averaged Poynting vector) for the wave plus the dipole's own field, computed exactly. The lines that end in the wire carry the power it absorbs, and they are bent in from a band much wider than the wire.[^bohren] The dipole is $$\lambda/50$$ long and $$\lambda/300$$ thick, drawn to scale, with its reactance tuned out so only the load resistance $$R_T$$ is left to choose.

With $$R_L = 0$$ and a matched load, $$R_T = R_r$$, the area is $$3\lambda^2/8\pi = 0.119\lambda^2$$, the same as Balanis Example 2.15. For any other load, Balanis eq. (2-95) gives

$$
A_e = \frac{3\lambda^2}{8\pi}\,\frac{4R_TR_r}{(R_r + R_L + R_T)^2}.
$$

### Things to try

1. *Matched*: the band of lines that end in the wire is 0.36λ wide seen from above and 0.50λ seen from the side, 109 and 149 times the wire's thickness.
2. *Open circuit*: no current flows, the wave passes straight through and nothing is collected.
3. *Shorted*: the current is twice the matched value, so the wire scatters four times as much, but the load takes nothing and every line bends round the wire.
4. *Matched, lossy*: $$R_L = R_r$$ and $$R_T = 2R_r$$, as at the end of Balanis Example 2.15. The effective area halves to $$0.060\lambda^2$$; the wire absorbs $$0.090\lambda^2$$ and a third of that heats the wire.
5. Try 'Pause' on any of them: the shading is the instantaneous electric field. Behind the wire, to its right, the incident wave and the wire's own wave partly cancel; the power missing there is the power the wire takes out.

{% include readalong/effective-area.html case="flow" plane="H" load="1" caption="A plane wave travelling left to right past a short dipole at the centre (λ/50 long, λ/300 thick, drawn to scale and less than a pixel thick, so a dashed ring marks it), with its reactance tuned out and a load resistance R_T. Lines: time-averaged Poynting vector of the incident wave plus the dipole's exact field (Balanis eqs. (4-8a) to (4-10b)); bold lines end in the wire, and the shaded band between them carries the absorbed power. Dots move along the lines. Shading: instantaneous electric field along the wire, one period every 2 seconds. The band width is measured 1.4 wavelengths upstream." %}

## Effective length depends on the current you pick

Balanis defines $$\boldsymbol\ell_e$$ from the far field the antenna radiates with a current $$I_{in}$$ at its terminals, eq. (2-92). For the short dipole with its triangular current it is $$(l/2)\sin\theta$$, half the length, Balanis Example 2.14. A half-wave dipole does better, $$\lambda/\pi$$ or 0.64 of its length, because its current tapers less.

But $$\boldsymbol\ell_e$$ is referred to a current, and on a long dipole the current at the feed is not the largest current on the wire. The same thing happened to $$R_r$$ in §2.13. Referred to the feed, $$\ell_e$$ grows past the physical length at $$0.74\lambda$$, and in the sinusoidal-current model it goes to infinity at one wavelength, where the feed sits at a current null. The available power stays finite, since $$\vert V_{oc}\vert^2$$ and $$R_{in}$$ both blow up together. So $$A_e$$ is the number that doesn't care where you feed.

### Things to try

1. *FM rabbit ears, 1 mV/m*: a half-wave dipole at 100 MHz. $$\vert\ell_e\vert = 0.954$$ m, so $$V_{oc} = 954$$ µV, and a matched receiver gets $$-58.1$$ dBm. The same power comes from $$A_eW_i$$: $$1.17\ \mathrm{m}^2 \times 1.33\ \mathrm{nW/m^2}$$.
2. *Wi-Fi dipole*, half-wave at 2.45 GHz: $$\ell_e = 3.9$$ cm and $$A_{em} = 19.6\ \mathrm{cm}^2$$, 32 times the 0.6 cm² of a 1 mm wire seen side-on. That is the answer to the question at the top.
3. Shorten it to $$0.05\lambda$$: $$\ell_e$$ is 0.50 of the length, Example 2.14's half, while $$A_{em}$$ is still $$0.119\lambda^2$$.
4. Lengthen it to $$0.75\lambda$$: $$\ell_e$$ at the feed is 1.03 times the length. Then try *Full wave*: $$\ell_e$$, $$V_{oc}$$ and $$R_{in}$$ are all infinite here, and $$A_{em} = 0.192\lambda^2$$.
5. Move the wave round with θ: $$V_{oc}$$ follows the pattern, and from along the wire (θ = 0°) there is no voltage at all.

{% include readalong/effective-area.html case="length" length="0.5" f="100" field="0.001" caption="Left: a centre-fed dipole with its standing-wave current (shaded) and wavefronts of a plane wave arriving from θ; the readout under it is the open-circuit voltage at the feed. Middle: the magnitude of the vector effective length against direction, from Balanis eq. (2-92) with the sinusoidal current, referred to the feed (solid) and to the current maximum (dashed). Right: at broadside, effective length over physical length, at the feed and at the current maximum, and the maximum effective area in units of λ²/4, against length. Radiation resistance from the induced-EMF formula, Balanis eq. (8-60a)." %}

## Apertures: never more than the opening

For a dish or a horn the comparison goes the other way. A large aperture lit with uniform amplitude and phase has $$A_{em}$$ equal to its physical area, and any taper towards the rim makes it smaller; the ratio is the aperture efficiency $$\epsilon_{ap} = A_{em}/A_p$$, eq. (2-100). Real dishes taper on purpose, to keep their side lobes down (the taper view in §2.5).

### Things to try

1. *Uniform*: 100%. *Parabolic*, $$(1-\rho^2)$$: 75.0%. *Parabolic squared*: 55.6%.
2. The NEXRAD weather radar, an 8.54 m dish with a measured gain of 45.8 dBi at 2.85 GHz, has an effective area of 33.5 m² out of 57.3 m², i.e. 58%.[^nexrad] A measured gain includes everything: taper, spillover past the rim, blockage and loss.
3. The bars compare the wires: a half-wave Wi-Fi dipole collects 32 times its cross-section, and Balanis's $$\lambda/50$$ dipole of $$\lambda/300$$ wire about 1,790 times.

{% include readalong/effective-area.html case="aperture" taper="1" caption="Left: a circular aperture face-on, shaded by the field over it, which falls towards the rim as set by the taper and oscillates in phase everywhere; the dashed circle has the same area as the maximum effective area. Right: maximum effective area over physical area, log scale. The wires use the lengthwise cross-section (length times diameter) as their physical area; NEXRAD uses its measured gain." %}

## The gap

<details markdown="1">
<summary markdown="span">From effective length to effective area</summary>

Take a lossless antenna with a conjugate-matched load. Balanis eq. (2-96) gives $$A_{em} = \vert V_T\vert^2/(8W_iR_r)$$. A polarization-matched plane wave of amplitude $$E$$ induces $$\vert V_T\vert = E\vert\ell_e\vert$$ and carries $$W_i = E^2/2\eta$$, so

$$
A_{em} = \frac{\eta\,\vert\ell_e\vert^2}{4R_r},
$$

with $$\ell_e$$ and $$R_r$$ referred to the same current. For the short dipole with a uniform current, $$\ell_e = l$$ and $$R_r = 80\pi^2(l/\lambda)^2$$; with the triangular current, $$\ell_e = l/2$$ and $$R_r = 20\pi^2(l/\lambda)^2$$.[^short] Both give

$$
A_{em} = \frac{120\pi\,l^2}{4\cdot 80\pi^2 l^2/\lambda^2} = \frac{3\lambda^2}{8\pi}.
$$

Halving the effective length quarters the radiation resistance, so the area stays. It only depends on the pattern, which is $$\sin^2\theta$$ in both cases, and §2.16 turns this into $$A_{em} = \lambda^2D_0/4\pi$$.

</details>

## Common confusion

1. "A wire antenna collects the power that falls on the wire." It collects from $$A_e$$, which for a short dipole is $$0.119\lambda^2$$ however thin the wire is. The wire's own current reaches out and pulls the power in.
2. "The effective length is a length on the antenna." It changes with direction, and with the current it is referred to: at the feed of a $$0.75\lambda$$ dipole it is already longer than the dipole.

## In the book

- §2.15, pp. 87–92. Fig. 2.29, p. 87. Effective length, eqs. (2-91) to (2-93), p. 88; Example 2.14, pp. 88–89. Effective area, eqs. (2-94) to (2-96), p. 89. Scattering, loss and capture areas, eqs. (2-97) to (2-99), and aperture efficiency, eq. (2-100), p. 90. Example 2.15 and the effective width, pp. 91–92.
- Balanis says on p. 89 that under conjugate matching half of the captured power is scattered, and on p. 90 that a lossless antenna's scattering area can equal its physical area. Both follow from the circuit of Fig. 2.28 and hold for a thin dipole, not for every antenna.[^af] See §2.13.
- The vector effective length in the polarization loss factor: §2.12.2. The short dipole's field: §4.3, eq. (4-36a). Maximum effective area and directivity: §2.16, eq. (2-110), p. 93.

---

## References

[^le]: Balanis, §2.15.1, eqs. (2-91) to (2-93), p. 88.
[^ae]: Balanis, §2.15.2, eq. (2-94), p. 89.
[^bohren]: The same picture explains how a small particle can absorb more light than falls on its cross-section: C. F. Bohren, "How can a particle absorb more than the light incident on it?", *American Journal of Physics*, vol. 51, no. 4, pp. 323–327, 1983, [doi:10.1119/1.13262](https://doi.org/10.1119/1.13262).
[^nexrad]: National Research Council, *Weather Radar Technology Beyond NEXRAD* (National Academies Press, 2002), Appendix A, "NEXRAD WSR-88D System Characteristics", pp. 69–70: reflector 8.54 m (28 ft) circular; gain 45.8 dB at 2.85 GHz.
[^short]: Uniform current: Balanis, Example 2.15, p. 91. Triangular current: Example 2.14, p. 88, and §4.3.
[^af]: J. Bach Andersen and A. Frandsen, "Absorption efficiency of receiving antennas," *IEEE Transactions on Antennas and Propagation*, vol. 53, no. 9, pp. 2843–2849, 2005, [doi:10.1109/TAP.2005.854532](https://doi.org/10.1109/TAP.2005.854532) ([author copy](https://vbn.aau.dk/en/publications/absorption-efficiency-of-receiving-antennas)).
