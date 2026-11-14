---
title: Gain
book: balanis
section: "2.9"
---

## What this section is really saying

Directivity divides the radiation intensity by the power radiated; gain divides it by the power accepted at the antenna's terminals, $$G = 4\pi U/P_{in}$$ (Balanis eq. 2-46).[^gain] The difference is the heat inside the antenna, so $$G = e_{cd}D$$ (2-49). Balanis then adds an *absolute gain*, $$G_{abs} = e_r e_{cd} D = e_0 D$$ (2-49b), which also counts the mismatch to the line. Neither efficiency depends on direction, so in dB each pattern is the directivity pattern moved down by a constant.

## Predict first

A lossless short dipole has a directivity of 1.76 dBi, and a half-wave dipole 2.15 dBi. Now take the Wi-Fi wire from §2.8: a twentieth of a wavelength at 2.45 GHz, matched to 50 Ω with a coil of quality factor 100. What is its gain?

## From directivity to gain

All the dipoles here are copper at 2.45 GHz, with the impedance and losses of the [§2.8 widget](../2-8-antenna-efficiency/). The pattern of a dipole of any length is Balanis eq. (4-64);[^dip] its directivity comes from integrating that pattern. Two reference rings are drawn: 0 dBi, a lossless isotropic radiator, and 2.15 dBi, a lossless half-wave dipole. Gain against the second is quoted in *dBd*, so $$G_{dBd} = G_{dBi} - 2.15$$.[^cfr]

### Things to try

1. Length 0.5 λ on 50 Ω: directivity 2.15 dBi, gain 2.14 dBi, absolute gain 1.50 dBi. The copper costs 0.01 dB; the mismatch costs 0.65 dB.
2. Switch to 75 Ω: the absolute gain rises to 1.80 dBi. The gain does not move, because gain stops at the terminals and does not know which line is connected.
3. Slide the length to 0.4685 λ, where the dipole resonates: absolute gain 2.05 dBi. A slightly shorter dipole has less directivity (2.10 dBi) but loses almost nothing to mismatch.
4. Press *dBd*: every number drops by 2.15, and the 0.5 λ dipole on 50 Ω is at $$-0.65$$ dBd.

{% include readalong/gain-pattern.html case="dipole" length="0.5" radius="0.5" z0="50" caption="Left: the pattern in the plane of the wire (the wire runs up the page) in dB, with the centre at −20 dBi: directivity (grey dashed), gain (blue) and absolute gain (red), against a lossless isotropic radiator (dotted) and a lossless half-wave dipole (yellow dashed). Right: the same three peaks as a ladder; the red step is the radiation efficiency and the grey step the mismatch. Copper wire of radius 0.5 mm at 2.45 GHz, where a wavelength is 122 mm." %}

## Gain or absolute gain?

For the half-wave dipole the three curves sit within 0.7 dB of each other. For a short dipole they come apart, and which one you quote changes the story completely.

### Things to try

1. Length 0.05 λ with the coil, $$Q = 100$$: directivity 1.76 dBi, gain $$-12.0$$ dBi. The match is perfect, so the absolute gain is the same. The gain curve sits inside the isotropic ring in every direction: this antenna is worse than a lossless isotropic radiator everywhere. The answer to the prediction.
2. Choose *Straight on 50 Ω*: now the gain is 1.62 dBi, because the bare wire turns 97% of what it accepts into radiation. But it accepts almost nothing, and the absolute gain is $$-39.4$$ dBi. By the IEEE definition this is a fine antenna; on a real line it is useless.
3. Back to the coil, and double the length to 0.1 λ: $$-5.3$$ dBi. Directivity barely changed (1.78 dBi); the 7 dB all came from efficiency.

{% include readalong/gain-pattern.html case="short" length="0.05" radius="0.25" q="100" caption="The same view for a short copper dipole, wire radius 0.25 mm, matched by a coil of quality factor Q and an ideal lossless transformer, or connected straight to a 50 Ω line. The centre of the polar plot is −40 dBi." %}

## Where 30,000 comes from

For narrow beams, Balanis gives a gain estimate from the two half-power beamwidths in degrees, $$G_0 \approx 30{,}000/(\Theta_1\Theta_2)$$ (2-51), next to the directivity estimates $$41{,}253/(\Theta_1\Theta_2)$$ (2-27) and $$32{,}400/(\Theta_1\Theta_2)$$ (2-27a).[^rules] The NEXRAD weather radar dish (8.54 m) has a measured gain of 45.8 dBi at 2.85 GHz, and its beamwidth there is about 0.92°.[^nexrad] The dots are the exact directivity of a circular dish of the same size with three illumination tapers, as in [§2.5](../2-5-beamwidth/).[^taper]

### Things to try

1. Read the three lines at 0.92°: 46.9, 45.8 and 45.5 dBi. The 41,253 rule overshoots the measured gain by 1.1 dB; the other two land within 0.3 dB.
2. *Parabolic* taper: the model dish has a beamwidth of 0.90° and a directivity of 46.9 dBi, right on the 41,253 line. The real dish is 1.1 dB below it: spillover past the rim, blockage by the feed, surface errors and losses, all of which a gain counts and a directivity of an ideal aperture does not.
3. *Uniform*: 48.1 dBi, the most any aperture of this size can do, $$(\pi d/\lambda)^2$$. The measured gain is 58% of that, the dish's *aperture efficiency*.

{% include readalong/gain-pattern.html case="nexrad" taper="1" caption="Gain in dBi against half-power beamwidth (log scale) for the three rules of thumb, the exact directivity of a circular aperture 8.54 m across at 2.85 GHz with uniform, parabolic and parabolic-squared illumination (circles; filled: the chosen taper), and the measured NEXRAD gain (red diamond). The dotted line is the directivity of the uniform aperture." %}

## The gap

<details markdown="1">
<summary markdown="span">Why the beamwidth rules have different constants</summary>

For a dish of diameter $$d$$, write the gain as an aperture efficiency times the uniform-aperture directivity, and the beamwidth in degrees as a constant times $$\lambda/d$$:

$$
G_0 = \eta_{ap}\left(\frac{\pi d}{\lambda}\right)^2, \qquad \Theta = k\,\frac{\lambda}{d}
\quad\Rightarrow\quad G_0\,\Theta^2 = \eta_{ap}\,\pi^2 k^2
$$

The diameter cancels, so the product is a constant for a given kind of dish. For NEXRAD, $$\eta_{ap} = 0.58$$ and $$k = 0.92 \times 81.2 = 74.7°$$ ($$d/\lambda = 81.2$$ at 2.85 GHz), so $$G_0\Theta^2 \approx 32{,}200$$. The 41,253 of (2-27) is $$4\pi(180/\pi)^2$$: it assumes all the power sits in a box one beamwidth wide, which [§2.6](../2-6-directivity/) showed overestimates a real beam. A smaller constant folds in both the beam shape and the losses.

</details>

## Common confusion

1. "Absolute gain" means two things. In the FCC's definitions (taken from the ITU Radio Regulations), absolute or isotropic gain is gain relative to an isotropic antenna,[^cfr] i.e. Balanis's $$G$$ in dBi. Balanis's $$G_{abs}$$ is something else: gain including the mismatch. Check which one a datasheet means before comparing.
2. dBd and dBi get mixed up on datasheets and licences. A "2 dBd" antenna is 4.15 dBi. The FCC's effective radiated power (e.r.p.) is referenced to a half-wave dipole and its e.i.r.p. to an isotropic antenna, so e.r.p. is 2.15 dB below e.i.r.p. for the same transmitter.[^cfr]

## In the book

- §2.9, pp. 65–69: gain (2-46), (2-46a); $$G = e_{cd}D$$ (2-47) to (2-49a); absolute gain (2-49b), (2-49c); partial gains (2-50) to (2-50b); the 30,000 rule (2-51); dB (2-52); Example 2.10 does the same ladder for a lossless dipole on a 50 Ω line.
- Directivity and its beamwidth estimates: §2.6, eqs. (2-16) to (2-27a). The efficiencies: §2.8, eqs. (2-44), (2-45), and §2.14.
- Dipole pattern: §4.5, eq. (4-64). Circular apertures: §7.10.2, Table 7.2. Aperture efficiency of reflectors: Chapter 15.

---

## References

[^gain]: Balanis, §2.9, eqs. (2-46) to (2-52), pp. 65–69, quoting the IEEE definitions (IEEE Std 145).
[^dip]: Balanis, §4.5, eq. (4-64), p. 173. Its directivity at half a wavelength is 1.641, i.e. 2.15 dBi; Balanis eq. (4-91), p. 183, gives 1.643 with $$\mathrm{Cin}(2\pi)$$ rounded.
[^cfr]: 47 CFR §2.1, definitions of "Effective radiated power", "Equivalent isotropically radiated power" and "Gain of an antenna" ([Cornell LII copy](https://www.law.cornell.edu/cfr/text/47/2.1)).
[^rules]: Balanis, §2.6, eqs. (2-27) and (2-27a), p. 51, and §2.9, eq. (2-51), p. 68.
[^nexrad]: National Research Council, *Weather Radar Technology Beyond NEXRAD* (National Academies Press, 2002), Appendix A, pp. 69–70: reflector 8.54 m circular; one-way 3 dB beamwidth 0.96° at 2.7 GHz and 0.88° at 3.0 GHz; gain 45.8 dB at 2.85 GHz. The beamwidth at 2.85 GHz is the straight-line value between the two.
[^taper]: Balanis, §7.10.2, eqs. (7-45) and (7-46) and Table 7.2, pp. 421–422: circular apertures lit as $$(1-\rho^2)^n$$, $$n = 0, 1, 2$$.
