---
title: Bandwidth
book: balanis
section: "2.11"
---

## What this section is really saying

Bandwidth is the range of frequencies over which some property of the antenna stays within a spec (Balanis quotes the IEEE definition).[^bw] Every property has its own: *impedance bandwidth* for the match and the efficiency, *pattern bandwidth* for gain, beamwidth, side lobes and so on. For a small or resonant antenna the match runs out long before the pattern does, so "the bandwidth" of a dipole is its impedance bandwidth.

## Predict first

A Wi-Fi dipole is cut to resonate at 2.45 GHz. Over what range does its VSWR on 50 Ω stay below 2? And over what range does its directivity stay within 1 dB?

## One dipole, two bandwidths

The dipole here is a copper wire of radius 0.5 mm cut so that its reactance is zero at 2.45 GHz, which makes it 57.3 mm long ($$0.468\lambda$$). Its length is then fixed and the frequency moves, so $$L/\lambda$$ grows with $$f$$. The impedance comes from the induced-EMF formulas of §8.5[^z] and the pattern from eq. (4-64).[^dip] The shaded strips are the 2.4 GHz and 5 GHz Wi-Fi bands.[^fcc]

### Things to try

1. Default: VSWR $$\le 2$$ from 2.31 to 2.59 GHz, i.e. 11.5%. The 2.4 GHz band (2400 to 2483.5 MHz) is only 3.4% wide, so it fits with room to spare.
2. Same dipole, the directivity: within 1 dB of 2.10 dBi from below 1.2 GHz up to 4.44 GHz, i.e. more than 3.7:1. The pattern hardly cares; the match does.
3. Move the frequency to 1.2 GHz: the pattern is the short-dipole doughnut, 1.84 dBi and HPBW 87.5°, but VSWR is about 300. Then to 5.5 GHz: the wire is $$1.05\lambda$$ long, the beam has narrowed to 44.5° and only just started growing side lobes (they appear above 5.23 GHz, where $$L = \lambda$$), while VSWR is about 160. A 2.4 GHz dipole fails in the 5 GHz band on impedance, not on pattern.
4. Slide the wire radius down to 0.05 mm: the band shrinks to 6.9% and $$Q$$ rises from 5.2 to 8.2. Up to 1 mm and *Matched*: 16%. A fat dipole is a broadband dipole; the pattern band stays put.

{% include readalong/bandwidth.html case="dipole" radius="0.5" z0="50" vswr="2" f="2.45" caption="Top left: VSWR of a copper dipole cut for 2.45 GHz, against frequency, with the band where it stays under the limit shaded blue (yellow strips: the Wi-Fi bands of 47 CFR 15.247 and 15.407). Top right: its directivity, with the band within 1 dB of the value at 2.45 GHz shaded; the red line marks L = λ, above which side lobes appear. Bottom: the pattern at the chosen frequency (blue) and at 2.45 GHz (dashed), in linear directivity. The impedance model is infinite at the antiresonance near L = λ, so VSWR is drawn up to 10 only." %}

## Small antennas pay in bandwidth

Shrink an antenna and its reactance grows while its radiation resistance falls, so it stores more energy for each watt it radiates: its $$Q$$ goes up and its bandwidth goes down. Chu showed that this has a floor: any antenna that fits inside a sphere of radius $$r$$ has a $$Q$$ at least that of eq. (11-35), which goes as $$1/(kr)^3$$ when the sphere is small.[^chu] The thin dipole here is tuned by an ideal coil, so its $$Q$$ is $$\vert X\vert/R$$ with $$R$$ and $$X$$ from eq. (11-37).[^small] Its length is $$2r$$, i.e. it spans the whole sphere.

### Things to try

1. $$kr = 0.314$$, i.e. a dipole a tenth of a wavelength long (12.2 mm at 2.45 GHz), with $$l/2a = 50$$: $$Q = 545$$, so the VSWR $$\le 2$$ band is 0.13%. The Chu limit at the same size is $$Q = 35.1$$, i.e. 2.0%. A wire uses the sphere badly.
2. Radiation efficiency down to 10%: the band grows ten times, to 1.3%. A loss resistance in series lowers the $$Q$$ by the efficiency, $$Q_{lossy} = e_{cd}\,Q$$, and costs 10 dB of gain. At 6.5% efficiency the dipole reaches the Chu band; below that it beats it, by throwing the power away.
3. Slide $$kr$$ from 0.6 down to 0.1: the Chu band falls from about 12% to 0.07%, a factor of about 170 for a factor of 6 in size.
4. A fatter wire ($$l/2a$$ down to 10) helps, but only by the ratio of the logarithms; it does not change the slope.

{% include readalong/bandwidth.html case="small" kr="0.31416" ratio="50" ecd="0.1" caption="The VSWR ≤ 2 bandwidth of an antenna that fits in a sphere of radius r, against kr, both on log scales: the Chu limit for a lossless antenna (black; the grey region above it is out of reach without loss), a thin dipole of length 2r tuned by an ideal coil (blue), and the same dipole with a loss resistance in series (red, dashed). Bandwidth from Q as (s − 1)/(Q√s) with s = 2." %}

## The gap

<details markdown="1">
<summary markdown="span">Ratio and percentage are one scale</summary>

With $$r = f_U/f_L$$ and the centre at $$(f_U + f_L)/2$$,

$$
\mathrm{FBW} = \frac{f_U - f_L}{(f_U + f_L)/2} = \frac{2(r - 1)}{r + 1}
$$

So 2:1 is 66.7%, 3:1 is 100%, 10:1 is 163.6% and 40:1 is 190.2%. As $$r \to \infty$$ the percentage goes to 200% and no further, which is why broadband antennas are quoted as ratios: the percentage stops telling them apart.

</details>

<details markdown="1">
<summary markdown="span">From $$Q$$ to the VSWR bandwidth</summary>

Near resonance, a resonant antenna looks like a series $$RLC$$ circuit. With $$\delta = (f - f_0)/f_0$$ small,

$$
Z \approx R\,(1 + j2Q\delta)
$$

On a line matched at resonance, $$Z_0 = R$$, so

$$
\Gamma = \frac{Z - R}{Z + R} = \frac{j2Q\delta}{2 + j2Q\delta}, \qquad \vert\Gamma\vert = \frac{Q\vert\delta\vert}{\sqrt{1 + Q^2\delta^2}}
$$

A VSWR of $$s$$ means $$\vert\Gamma\vert = (s-1)/(s+1)$$. Solving for $$Q\delta$$ gives $$Q\delta = (s-1)/2\sqrt{s}$$, and the band is twice that $$\delta$$:

$$
\mathrm{FBW} = \frac{s - 1}{Q\sqrt{s}}
$$

For $$s = 2$$ this is $$0.707/Q$$. For the matched dipole above (radius 0.5 mm, $$Q = 5.17$$) it predicts 13.7%, and the full impedance model gives 13.3%: the $$RLC$$ picture holds even at $$Q = 5$$.

</details>

## Common confusion

1. "Bandwidth is $$1/Q$$." Balanis eq. (11-36) says so, and it is right for one criterion: $$1/Q$$ is the band where $$\vert Z\vert < \sqrt2 R$$, i.e. where a voltage source delivers half its peak power. On a matched line that is the VSWR 2.62 band (1 dB of mismatch loss). The VSWR 2 band is $$0.707/Q$$, and the half-power band on a matched line is $$2/Q$$. Always ask which spec a bandwidth number belongs to.
2. "This small antenna is broadband, so it is a good small antenna." Loss lowers $$Q$$, so a lossy antenna is broader. A tiny antenna with a wide match is either using its sphere very well or heating something; check its efficiency before you believe the bandwidth.

## In the book

- §2.11, p. 70. No equations; the IEEE definition, ratio and percentage, pattern and impedance bandwidth, frequency independent antennas (Chapter 11).
- $$Q$$ and the small-antenna limit: §11.5, pp. 637–641, eqs. (11-35) to (11-38), Figs. 11.16 and 11.17. Eq. (11-38) as printed is exactly $$1/6$$ of $$\vert X\vert/R$$ from its own eq. (11-37) (it gives $$Q = 90.8$$ for the tenth-wave dipole above, against 545); the full induced-EMF impedance of §8.5 agrees with (11-37) to within 10% up to $$kr = 0.62$$, so the widget uses $$\vert X\vert/R$$.
- The dipole's impedance: §8.5, eqs. (8-60a) to (8-61b); its pattern: §4.5, eq. (4-64). The radiation efficiency $$e_{cd}$$: §2.8 and §2.14.

---

## References

[^bw]: Balanis, §2.11, p. 70, quoting the IEEE definition (IEEE Std 145).
[^z]: Balanis, §8.5, eqs. (8-60a), (8-60b), (8-61a) and (8-61b), pp. 465–466. Copper loss is left out here; at this length it is below 1% (see [§2.8](../2-8-antenna-efficiency/)).
[^dip]: Balanis, §4.5, eq. (4-64), p. 173. Its directivity at half a wavelength is 1.641; Balanis eq. (4-91), p. 183, gives 1.643 with $$\mathrm{Cin}(2\pi)$$ rounded.
[^fcc]: 47 CFR §15.247(a), 2400–2483.5 MHz ([Cornell LII copy](https://www.law.cornell.edu/cfr/text/47/15.247)), and §15.407(a), 5150–5350 MHz and 5470–5850 MHz ([Cornell LII copy](https://www.law.cornell.edu/cfr/text/47/15.407)).
[^chu]: Balanis, §11.5, eq. (11-35), p. 639, after L. J. Chu, "Physical limitations of omnidirectional antennas", *J. Appl. Phys.* 19, 1163–1175 (1948), and R. C. Hansen, "Fundamental limitations in antennas", *Proc. IEEE* 69(2), 170–182 (1981).
[^small]: Balanis, §11.5, eq. (11-37), p. 640, which is eq. (4-37) for the resistance and eq. (8-62) for the reactance.
