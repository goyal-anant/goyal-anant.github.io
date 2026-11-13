---
title: Directivity
book: balanis
section: "2.6"
---

## What this section is really saying

Directivity compares an antenna with an isotropic source radiating the same power: $$D = 4\pi U/P_{rad}$$, and $$D_0$$ is its value at the peak. Write the power as $$U_{max}$$ times a solid angle $$\Omega_A$$, and $$D_0 = 4\pi/\Omega_A$$: the antenna behaves as if all its power went into $$1/D_0$$ of the sky at full strength. The second half of the section guesses $$\Omega_A$$ from the beamwidths alone (Kraus, Tai and Pereira); this page shows when those guesses work and why.

## Predict first

A beam is 1° wide in both planes. What share of the sky does it fill, and what is its directivity in dBi? Then check it against a real dish of about that beamwidth, the NEXRAD radar, in the second widget.

## Directivity is a share of the sky

Take the pattern and redraw it against the solid angle it fills instead of against the angle. The area under the curve is then the radiated power, and a box at full height with the same area has width $$\Omega_A$$, the beam solid angle (Balanis eq. 2-24).[^omega] The directivity is the whole sky, 41,253 square degrees, divided by that width.

Kraus's formula puts a box of width $$\Theta_1\Theta_2$$ there instead, the product of the two half-power beamwidths, i.e. it pretends the beam has a flat top and vertical walls out to the half-power points.[^kraus] Tai and Pereira use the same two beamwidths but a smaller box, $$\pi\Theta_1\Theta_2/(4\ln 2)$$ for a round beam.[^tp] Which one is closer depends on the shape of the beam, and the widget draws all three boxes on the real curve.

### One lobe, two lobes, omni

1. *cosⁿθ, one lobe*, $$n = 5$$ (the start): $$D_0 = 12$$, Kraus 11.87 ($$-1.1\%$$), Tai–Pereira 10.48 ($$-12.7\%$$). Kraus is almost exact here by luck: its error passes through zero at $$n = 5.5$$.
2. Drag $$n$$ down to 1: an HPBW of 120°, $$D_0 = 4$$, and the box covers a quarter of the sky. Both formulas are now 28 to 37% low: the flat box can't hold a beam that wide.
3. Drag $$n$$ up to 450 (HPBW 6.4°): $$D_0 = 902$$, Kraus $$+13.1\%$$, Tai–Pereira $$-0.17\%$$. Watch the error panel: as the beam narrows, Kraus climbs towards $$+13.3\%$$ and Tai–Pereira falls towards zero. *The gap* below says why.
4. *cosⁿθ, two lobes*, $$n = 20$$: the exact $$D_0$$ halves to 21, but the beamwidth didn't change, so Kraus still says 45.9, i.e. $$+118\%$$. The formulas only see the main lobe.
5. *sinⁿθ, omni*, $$n = 2$$ (a short dipole): $$D_0 = 1.5$$. An omni pattern has no half-power points in the horizontal plane, so Kraus has nothing to multiply; McDonald's and Pozar's formulas take over (Balanis eqs. 2-33a, 2-33b), at $$-1.2\%$$ and $$+1.1\%$$.

{% include readalong/beam-solid-angle.html family="cosn" n="5" caption="Left: the power pattern in one cut (blue) and the box of the same power at full height (red), as a cone or, for the omni pattern, a band around the horizon. Right: the same pattern against the solid angle it fills, in square degrees; the blue area is the power, the red box has the same area. Dashed and dotted: the boxes the two formulas use. Bottom: their error against the exact directivity as the beam narrows, the dots marking the pattern above." %}

## A real dish: NEXRAD

The §2.5 page used the NEXRAD weather radar's 8.54 m dish at 2.85 GHz, i.e. 81 wavelengths across.[^nexrad] A dish has side lobes, and side lobes are exactly what the beamwidth formulas never see: they are weak but cover a lot of sky.

1. *NEXRAD dish* (parabolic taper): HPBW 0.896°, exact $$D_0$$ = 46.88 dBi, Kraus 47.11 dBi, Tai–Pereira 46.57 dBi. Both are within 0.3 dB, and the box is under one square degree: $$1/48{,}787$$ of the sky.
2. Switch to *Uniform*: the beam narrows to 0.726° and $$D_0$$ rises to 48.13 dBi, but the side lobes come up to $$-17.6$$ dB and both formulas now over-shoot, Kraus by 20%, Tai–Pereira by 6%. On the right, the side lobes are the low hump past the box; small in height, wide in solid angle.
3. Slide $$d/\lambda$$ anywhere above about 10: the errors barely move. For a big dish they depend on the taper, not on the size.

The measured *gain* of the real NEXRAD dish is 45.8 dB,[^nexrad] about 1 dB under the directivity of the model. Gain counts what the antenna loses and wastes on the way; directivity doesn't. That is §2.9.

{% include readalong/beam-solid-angle.html family="dish" taper="1" dl="nexrad" caption="A circular dish lit with one of three tapers, radiating into the front half only (Balanis eqs. 7-45, 7-46), here the size of the NEXRAD dish at 2.85 GHz (d/λ = 81). Same panels as above; the error curves now run over d/λ from 2 to 120 for the chosen taper." %}

## The gap

<details markdown="1">
<summary markdown="span">Where 41,253 and Tai and Pereira's $$16\ln 2$$ come from</summary>

The whole sphere is $$4\pi$$ steradians, and one steradian is $$(180/\pi)^2$$ square degrees, so the sky is $$4\pi(180/\pi)^2 = 41{,}253$$ square degrees. Kraus's box is $$\Theta_1\Theta_2$$ wide, which gives Balanis eq. (2-27).

Now take a narrow round beam shaped like a bell, a Gaussian with half power at $$\theta = \Theta/2$$:

$$
U = U_{max}\exp\!\left(-4\ln 2\,\frac{\theta^2}{\Theta^2}\right)
$$

For a narrow beam $$\sin\theta \approx \theta$$, so $$d\Omega \approx 2\pi\theta\,d\theta$$ and

$$
\Omega_A = \int_0^\infty 2\pi\theta\, e^{-4\ln 2\,\theta^2/\Theta^2}\,d\theta = \frac{\pi\Theta^2}{4\ln 2}, \qquad D_0 = \frac{4\pi}{\Omega_A} = \frac{16\ln 2}{\Theta^2}
$$

This is Tai and Pereira's formula (Balanis eqs. 2-29a and 2-30a with $$\Theta_1 = \Theta_2$$). So it is exact for a Gaussian beam, and on the same beam Kraus is too high by $$4\pi/(16\ln 2) = 1.133$$, i.e. 13.3% or 0.54 dB.

Why does $$\cos^n\theta$$ follow this? For small $$\theta$$, $$\ln\cos\theta \approx -\theta^2/2$$, so

$$
\cos^n\theta = e^{n\ln\cos\theta} \approx e^{-n\theta^2/2}
$$

a Gaussian. The larger $$n$$, the narrower the beam and the better the approximation: that is the trend down the columns of Balanis Table 2.1, and the reason the two error curves in the widget level off at $$+13.3\%$$ and $$0$$.

</details>

## Common confusion

1. "Same power" in the definition means the same *radiated* power. An antenna that reflects half its input back to the transmitter, or burns it in its metal, has the same directivity as a perfect one. NEXRAD: about 46.9 dBi of directivity in the model, 45.8 dB of measured gain.
2. Balanis eq. (2-18) writes the half-wave dipole as $$1.67\sin^3\theta$$. If you integrate $$\sin^3\theta$$ yourself you get $$16/3\pi = 1.698$$, not 1.67, and the exact value is 1.641 (2.15 dB).[^hw] $$\sin^3\theta$$ is only a fit to the pattern; don't worry if your integral disagrees with the book in the second decimal.

## In the book

- §2.6, pp. 44–58: definitions eqs. (2-16) to (2-17b), Examples 2.5 and 2.6, Figs. 2.12 and 2.13; general form and $$\Omega_A$$ eqs. (2-19) to (2-25); §2.6.1 directional patterns, eqs. (2-26) to (2-31), Example 2.7, Table 2.1, Fig. 2.16; §2.6.2 omnidirectional patterns, eqs. (2-32) to (2-33b), Figs. 2.17, 2.18 and Example 2.8.
- Radiation intensity and the solid angle: §2.4. Partial directivities (2-17) come back with polarization in §2.12. The half-wave dipole's exact $$D_0$$: §4.6, eq. (4-91), p. 183. Dish patterns: §7.10.2.
- Next: §2.7 Numerical Techniques, where the integral for $$\Omega_A$$ is done on a computer, as the widget does here.

---

## References

[^omega]: Balanis, §2.6, eqs. (2-23) to (2-25), p. 50, and the definition of the beam solid angle on the same page.
[^kraus]: Balanis, §2.6.1, eqs. (2-26) and (2-27), p. 51, after Kraus (Balanis ref. [5]).
[^tp]: C.-T. Tai and C. S. Pereira, "An approximate formula for calculating the directivity of an antenna," *IEEE Trans. Antennas Propag.* 24(2), 235–236 (1976), doi:[10.1109/TAP.1976.1141313](https://doi.org/10.1109/TAP.1976.1141313); in Balanis as eqs. (2-29) to (2-30b), pp. 53–54.
[^nexrad]: National Research Council, *Weather Radar Technology Beyond NEXRAD* (National Academies Press, 2002), Appendix A, pp. 69–70: reflector 8.54 m circular; one-way 3 dB beamwidth 0.96° at 2.7 GHz and 0.88° at 3.0 GHz; gain 45.8 dB at 2.85 GHz; first side lobe $$-29$$ dB.
[^hw]: Balanis, §4.6, eq. (4-91), p. 183, gives 1.643 with $$\mathrm{Cin}(2\pi)$$ rounded to 2.435; with $$\mathrm{Cin}(2\pi) = 2.4376$$ it is 1.641.
