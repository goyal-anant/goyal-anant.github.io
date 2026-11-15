---
title: Friis Transmission Equation and Radar Range Equation
book: balanis
section: "2.17"
---

## What this section is really saying

Every link is a chain of areas. The transmitter spreads its power over a sphere, $$4\pi R^2$$, and the receiver keeps the share its effective area covers. Friis is that sentence with gains written in for the areas:

$$
\frac{P_r}{P_t} = \left(\frac{\lambda}{4\pi R}\right)^2 G_{0t}G_{0r},
$$

Balanis eq. (2-119).[^friis] A radar does the trip twice, so it pays $$1/R^2$$ twice, eq. (2-126).[^radar] And an antenna is itself a target: what it scatters depends on the load at its terminals.

## Predict first

A radar sees a big target at 200 km. How far away can it see a target with one ten-thousandth of its radar cross section?

## Friis: two areas and a sphere

The factor $$(\lambda/4\pi R)^2$$ is called the *free-space loss*, but nothing is lost in free space. Write it as $$(\lambda^2/4\pi)/(4\pi R^2)$$: it is the area of an isotropic antenna, §2.16, over the area of the sphere. All the power is still out there; this is the share an isotropic receiver catches. Swap both gains for areas with $$G = 4\pi A/\lambda^2$$ and Friis becomes

$$
\frac{P_r}{P_t} = \frac{A_t A_r}{\lambda^2 R^2},
$$

and there is no frequency in it at all except through $$\lambda^2$$ in the denominator. The equation goes back to a short note by Friis in 1946.[^hf] So whether a link gets better or worse with frequency depends on what you hold fixed: fixed gains lose $$\lambda^2$$, fixed dishes gain it.

The formula also needs the far field. Inside $$2D^2/\lambda$$ (§2.5) the gains are not yet the far-field gains, and close enough in, Friis says the receiver gets back more than was sent.

### Things to try

1. *Wi-Fi across a room*: two half-wave dipoles, 20 dBm in, 10 m apart: $$-35.9$$ dBm comes out. Double the distance: 6 dB less, $$-41.9$$ dBm.
2. Still Wi-Fi, *Hold gains*, frequency up to 5 GHz: $$-42.1$$ dBm, 6.2 dB worse. Now *Hold areas* (keep the same two antennas and only change the frequency): $$-29.7$$ dBm, 6.2 dB *better*. The spreading bar is the same in both; only the gain bars move.
3. *Two horns on a bench*, 20 dBi each at 10 GHz: the far field starts at 1.31 m. Slide in to 0.24 m and Friis gives back exactly what went in; at 0.1 m it says $$+7.6$$ dBm comes out of 0 dBm. The formula is fine; it is being used where it doesn't apply.
4. *Voyager 2 to Canberra*, 1 Jan 1996, from JPL's own link budget: 12.3 W into a 3.66 m dish, 48.62 AU to a 70 m dish. The spreading is $$-308.2$$ dB and $$-145.5$$ dBm arrives, i.e. $$2.8\times10^{-18}$$ W, the same as JPL's table.[^voy]
5. Twist the polarization by 45°: 3 dB gone, as $$\cos^2$$ of the twist (§2.12.2).

{% include readalong/friis-link.html case="link" preset="wifi" caption="Left: the link budget of Balanis eq. (2-118) in dB, one bar per term, from the power in (Pt) to the power delivered to the receiver's load (Pr); gains in blue, losses in red. 'space' is (λ/4πR)², 'match' is (1 − |Γt|²)(1 − |Γr|²), 'pol.' is cos² of the twist between two linear polarizations, and 'other' is the pointing, atmosphere and polarization losses in JPL's Voyager table. Right: received power against distance, log scale; shaded where the distance is inside the far-field boundary 2D²/λ, D the larger antenna's largest dimension; the red dashed line is the power sent. 'Hold gains' keeps the gains as the frequency moves (antennas scaled with λ); 'Hold areas' keeps the antennas, so G = 4πA/λ²." %}

## Radar: the trip both ways

Now put a target in the way. It catches the power falling on its radar cross section $$\sigma$$ and, by the definition of $$\sigma$$, sends it out again as if isotropically, eq. (2-120). That second spreading is another $$4\pi R^2$$, so with one antenna for sending and receiving,

$$
P_r = \frac{P_t G^2 \lambda^2 \sigma}{(4\pi)^3 R^4}.
$$

The $$R^4$$ is expensive. Set $$P_r$$ to the weakest echo the receiver can find and solve for $$R$$: the maximum range goes as $$(P_t\sigma)^{1/4}$$. So the answer to the question at the top is 20 km. To double the range, you need 16 times the power.

The target here is a metal sphere, whose RCS I can compute exactly for any size. A big sphere scatters its shadow area, $$\pi a^2$$; one much smaller than the wavelength scatters far less, as $$a^6$$, and in between it rings.

### Things to try

1. Start: a 1 m sphere, $$\sigma = 3.13$$ m², seen out to 399 km with 100 kW and a $$-100$$ dBm threshold (my own round numbers; the dish has NEXRAD's 45.8 dBi at 2.85 GHz[^nrc]).
2. *×16 power*: 798 km. Twice, not 16 times.
3. *Reset*, then *Radius ÷100*: a 1 cm sphere, $$1.03\times10^{-4}$$ of the RCS, seen to 40 km, i.e. one tenth.
4. Shrink it to 1 mm: $$\sigma$$ drops to $$3.6\times10^{-10}$$ m², 8,700 times below its shadow area, and the range to 4 km. That steep fall below $$ka = 1$$ is why small objects nearly vanish at long wavelengths.
5. Compare the two lines on the left: one decade of range costs the one-way power 20 dB and the echo 40 dB.

{% include readalong/friis-link.html case="radar" caption="Left: echo power at the radar against range (solid, Balanis eq. 2-126 with one antenna both ways and R1 = R2), and, for comparison, the one-way power an isotropic antenna at the target would receive (dashed); the red line is the detection threshold and the dot the maximum range. Right: the backscatter radar cross section of a perfectly conducting sphere against its radius at 2.85 GHz, from the exact Mie series, with its shadow area πa² dashed; ka = 1 marks a sphere whose circumference is one wavelength. Antenna gain 45.8 dBi (NEXRAD); power and threshold are adjustable round numbers, not NEXRAD's." %}

## There and back

The same story as a bench. The ring that leaves the dish fades as it spreads; the sphere sends back its own ring, which fades again on the way home. The screen is an A-scope: time runs left to right, and the echo sits at the round-trip delay $$2R/c$$, 10 ns for 1.5 m. Move the sphere from 1 m to 2 m and the blip moves right and drops by 12 dB.

{% include readalong/radar-range.html %}

## An antenna as a target

An antenna on an aircraft is part of the aircraft's radar cross section, and its echo depends on what is connected to it. Balanis splits the scattered field into a *structural* part, which is there whatever the load, and an *antenna-mode* part, which is the antenna re-radiating what its load reflects, eq. (2-134):

$$
\sigma = \left\vert \sqrt{\sigma_s} - (1+\Gamma_A)\sqrt{\sigma_a}\,e^{j\phi_r}\right\vert^2 .
$$

Divide by $$\sigma_a$$ and this is the squared distance, in the plane of the load's reflection coefficient $$\Gamma_A$$, from $$\Gamma_A$$ to one fixed point, $$\Gamma_0 = \sqrt{\sigma_s/\sigma_a}\,e^{-j\phi_r} - 1$$. So every contour of equal RCS is a circle around $$\Gamma_0$$, and choosing a load means choosing a point in the unit disk. If $$\Gamma_0$$ is inside the disk, some passive load makes the antenna invisible to that radar, eq. (2-139); if it is outside, none can.

### Things to try

1. *Thin resonant dipole* ($$\sigma_s = 4\sigma_a$$, in phase; the same numbers as Balanis's Example 2.17): short gives $$4\sigma_a = 0.859\lambda^2$$, the matched load a quarter of that, and the open circuit nothing, since $$\Gamma_0$$ sits on the open-circuit point.
2. Drag the load round the edge of the disk: the RCS is the squared distance to $$\Gamma_0$$, so it grows away from the open circuit.
3. Turn the phase $$\phi_r$$ to 120°: $$\Gamma_0$$ leaves the disk and the best passive load still leaves $$2.71\sigma_a$$.
4. Sweep $$\phi_r$$ all the way round with the load matched: the RCS stays between $$\sigma_a$$ and $$9\sigma_a$$. The readout shows what eq. (2-138) prints for the same case, $$3\sigma_a$$ to $$5\sigma_a$$; see "In the book".

{% include readalong/friis-link.html case="rcs" ratio="4" phi="0" caption="The plane of the load's reflection coefficient Γ_A = (Z_L − Z_A)/(Z_L + Z_A); passive loads fill the unit disk, short on the left, open on the right, matched at the centre. Circles: total RCS of Balanis eq. (2-134) at 0.25, 1, 4, 9 and 16 times the antenna-mode RCS σa, centred on the zero-RCS load of eq. (2-139), marked in red (hollow when no passive load reaches it). The last row puts in σa = G0²λ²/4π = 0.215λ² for a half-wave dipole, Balanis eq. (2-141) with a matched load." %}

## The gap

<details markdown="1">
<summary markdown="span">Friis in areas, and the radar equation, in three lines each</summary>

Power density at $$R$$ from the transmitter: $$W = P_tG_t/4\pi R^2$$. Power into the receiver: $$P_r = WA_r$$, with $$A_r = \lambda^2G_r/4\pi$$ from §2.16. Multiply: eq. (2-119). Replace $$G_t$$ by $$4\pi A_t/\lambda^2$$ as well and the $$4\pi$$s cancel to $$A_tA_r/\lambda^2R^2$$.

For the radar, the target collects $$P_c = \sigma W$$, eq. (2-121), and re-radiates it over $$4\pi R^2$$, eq. (2-122). The radar collects $$A_r$$ of that:

$$
P_r = \frac{P_tG}{4\pi R^2}\cdot\frac{\sigma}{4\pi R^2}\cdot\frac{\lambda^2G}{4\pi}.
$$

Solving $$P_r = P_{min}$$ for $$R$$ gives $$R_{max} = [P_tG^2\lambda^2\sigma/(4\pi)^3P_{min}]^{1/4}$$.

</details>

<details markdown="1">
<summary markdown="span">Why the RCS contours are circles</summary>

Take eq. (2-134) and pull $$e^{j\phi_r}$$ out of the bracket (its magnitude is 1):

$$
\frac{\sigma}{\sigma_a} = \left\vert \sqrt{\sigma_s/\sigma_a}\,e^{-j\phi_r} - 1 - \Gamma_A \right\vert^2 = \vert\Gamma_0 - \Gamma_A\vert^2 .
$$

Setting it to zero gives eqs. (2-139a) and (2-139b) at once. With $$\Gamma_A = 0$$ it is $$\vert\Gamma_0\vert^2$$, and as $$\phi_r$$ turns, $$\vert\Gamma_0\vert$$ runs from $$\vert\sqrt{\sigma_s/\sigma_a} - 1\vert$$ to $$\sqrt{\sigma_s/\sigma_a} + 1$$. Square it: the matched RCS lies between $$(\sqrt{\sigma_s}-\sqrt{\sigma_a})^2$$ and $$(\sqrt{\sigma_s}+\sqrt{\sigma_a})^2$$.

</details>

## Common confusion

1. "Higher frequencies lose more in free space." Space treats every frequency the same. The $$\lambda^2$$ in eq. (2-119) belongs to the receiving antenna: at fixed gain its area shrinks as $$\lambda^2$$. Keep the dishes and raise the frequency, and the link gets better.
2. "$$e_r$$ in eq. (2-115) is the reflection efficiency." Not here. In this section $$e_t$$ and $$e_r$$ are the radiation efficiencies of the two antennas ($$e_{cdt}$$, $$e_{cdr}$$ in eq. 2-118); in §2.8 the same $$e_r$$ meant reflection efficiency.

## In the book

- §2.17, pp. 94–104. Friis: Fig. 2.31 and eqs. (2-113) to (2-119), pp. 94–96. Radar range: Fig. 2.32 and eqs. (2-120) to (2-126), pp. 96–98, Example 2.16. Antenna RCS: Table 2.2 and eqs. (2-127) to (2-142), pp. 98–103, Example 2.17; measured dipole RCS, Fig. 2.33, p. 104.
- Eq. (2-138) on p. 102, as printed, $$\vert\sigma_s - \sigma_a\vert \le \sigma \le \vert\sigma_s + \sigma_a\vert$$, is missing its square roots: from eq. (2-137) the bounds are $$(\sqrt{\sigma_s}\mp\sqrt{\sigma_a})^2$$. Example 2.17's own matched value, $$\sigma_a$$ with $$\sigma_s = 4\sigma_a$$, falls outside the printed range.
- Eq. (2-142) takes $$\vert 2R_A/Z_A\vert^2 = 4$$, i.e. a resonant dipole with $$X_A = 0$$, a little shorter than $$\lambda/2$$. For the exact half wave, $$Z_A = 73 + j42.5\ \Omega$$, the factor is 2.99. The "computed value of −22.5 dBsm" on p. 104 is $$\lambda^2$$ at 4.02 GHz; $$0.86\lambda^2$$ is $$-23.2$$ dBsm, closer to the measured $$-24$$.
- The effective area in Friis: §2.16, eqs. (2-110) to (2-112). Efficiencies: §2.8. Polarization loss factor: §2.12.2. Far-field distance: §2.5. A receiving antenna's scattered power: §2.13 and §2.15.

---

## References

[^friis]: Balanis, §2.17.1, eqs. (2-113) to (2-119), pp. 94–96.
[^radar]: Balanis, §2.17.2, eqs. (2-120) to (2-126), pp. 96–98.
[^hf]: H. T. Friis, "A Note on a Simple Transmission Formula," *Proceedings of the IRE* 34(5), 254–256 (1946), [doi:10.1109/JRPROC.1946.234568](https://doi.org/10.1109/JRPROC.1946.234568).
[^voy]: R. Ludwig and J. Taylor, *Voyager Telecommunications*, DESCANSO Design and Performance Summary Series, Article 4 (JPL, March 2002), Table 5-3, "Voyager 2 downlink carrier design control table", for DSS-43 on 1 January 1996; [PDF at JPL](https://descanso.jpl.nasa.gov/DPSummary/Descanso4--Voyager_new.pdf).
[^nrc]: National Research Council, *Weather Radar Technology Beyond NEXRAD* (National Academies Press, 2002), Appendix A, pp. 69–70.
