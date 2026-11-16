---
title: Antenna Temperature
book: balanis
section: "2.18"
---

## What this section is really saying

Everything warm glows at radio frequencies, and an antenna can't tell that glow from a signal. The glow of a surface is its *brightness temperature*: its physical temperature times its emissivity, Balanis eq. (2-143).[^tb] The antenna reports the brightness all around it, weighted by its pattern, eq. (2-144), as the temperature of a resistor that would give the same noise. Then every lossy part between the antenna and the receiver mixes in some of its own temperature, eqs. (2-146) to (2-148).

## Predict first

A dish at room temperature looks straight down at a calm sea, at 8.4 GHz. What antenna temperature does it report: about 290 K, about 200 K, or about 110 K?

## The scene, weighted by the pattern

Eq. (2-144) divides by the integral of the gain, which turns the gain into directivity. So the rule is

$$
T_A = \frac{1}{4\pi}\oint D(\theta,\phi)\,T_B(\theta,\phi)\,d\Omega ,
$$

an average of the scene's brightness with the pattern as the weights. It comes straight out of [§2.16](../2-16-maximum-directivity-and-maximum-effective-area/): a brightness $$T_B$$ means a specific intensity $$2kT_B/\lambda^2$$, the antenna takes one polarization of it over $$A_e = \lambda^2 D/4\pi$$ in each direction, and $$kT_A$$ is what it collects per hertz.[^era] If the scene is the same temperature everywhere, $$T_A$$ is that temperature for every antenna, which is the two ovens of [§2.16](../2-16-maximum-directivity-and-maximum-effective-area/) again.

Here the scene is a real one at 8.4 GHz, the frequency the Deep Space Network listens to Voyager on. The sky is the atmosphere's own glow plus the 2.7 K cosmic background, with the attenuation from JPL's Voyager link budget;[^itu372][^voy] the ground is soil or sea, with permittivities from the ITU's models and the reflection from Fresnel's formulas.[^itu527]

### Things to try

1. The dish straight up: 4.8 K, i.e. 2.7 K of cosmic background through the air and 2.1 K from the air itself. Balanis's "about 5 K toward zenith" is X band.
2. Lower it to 10°: 14.6 K, and 25.5 K at 5°. The path through the air grows as $$1/\sin(\text{el})$$, and so does its glow.
3. Point it at the horizon: 71 K, half of the beam on the sky and half on the ground.
4. Straight down, the answer to the question at the top: dry soil 255 K, wet soil 157 K, the sea 112 K. Water reflects 63% at 8.4 GHz, so the sea is mostly a mirror for the cold sky.
5. Over the sea at $$-30$$°, switch the polarization: 66 K horizontal, 181 K vertical. At $$-10$$° it is 36 K against 279 K: vertical polarization is near the sea's Brewster angle, where it reflects almost nothing and so emits almost like a black body.
6. *Isotropic* over dry soil: 115 K, and only 5.7 K of it from the sky. A *vertical half-wave dipole*: 134 K. Antennas that see the ground are warm.
7. The circles are JPL's measured system temperature of the 70 m DSS-43 over a Voyager pass, minus its 13.2 K receiver.[^voy] They sit 2 to 3 K above the curve: in JPL's own breakdown 2.88 K at 58° comes from the ground, through the feed's spillover past the dish's edge, which a perfect aperture doesn't have. A spillover of 1.5% to 2% puts the curve through them at high elevation; near the horizon the measured temperature rises faster.

{% include readalong/antenna-temperature.html case="scene" antenna="dish" el="45" ground="dry" pol="h" caption="Left: the vertical plane through the antenna. The red curve is the brightness temperature of the scene in each direction (the rings are 100 K apart), the sky above the horizon and the ground or sea below it; the blue shape is the antenna's pattern in dB, 40 dB from the centre to the peak. Right: antenna temperature against pointing elevation (blue), the brightness straight ahead (red dashed) and DSS-43's measured system temperature minus its receiver (circles; JPL). Sky: ITU-R P.372 eq. (10) with 0.034 dB zenith attenuation, from JPL's 0.04 dB at 58°; below about 5° the air mass of a uniform shell 6 km thick (schematic). Ground: dry and wet silty loam at 23 °C, sea water at 20 °C and 35 g/kg (ITU-R P.527), each emitting (1 − |Γ|²)T and reflecting |Γ|² of the sky. Dish: circular, lit as (1 − ρ²)ⁿ as in <a href='../2-5-beamwidth/'>§2.5</a>, radiating into its front half, with an optional spillover spread evenly over its back half (schematic)." %}

## A dish over a field and the sea

The same thing as a picture. The shore is 20° below the horizon as the dish sees it, so the beam lands on the field when the dish points steeper than that and on the sea when it points shallower. The rings get brighter with the brightness straight ahead; the readout's $$T_A$$ takes in the whole pattern. Between the shore and the horizon the dish is cold again, because a calm sea seen at a grazing angle reflects the sky.

{% include readalong/tipping-dish.html %}

## Noise added on the way in

Anything lossy at physical temperature $$T$$ that passes a fraction $$t$$ of the power turns an input temperature $$T_{in}$$ into

$$
T_{out} = t\,T_{in} + (1-t)\,T .
$$

It absorbs $$1-t$$ of what comes in and, by Kirchhoff, emits the same fraction of a black body at its own temperature. The air in front of the dish does this; so does the antenna's own ohmic loss, with $$t = e_A$$, and the cable, with $$t = e^{-2\alpha l}$$. At the receiver,

$$
T_a = \big[e_A T_A + (1-e_A)T_p\big]e^{-2\alpha l} + T_0\big(1-e^{-2\alpha l}\big),
$$

and the receiver's own $$T_r$$ adds on top, $$T_s = T_a + T_r$$, eq. (2-148). The line term is Balanis's eq. (2-146) exactly; the antenna term differs, see "In the book".

### Things to try

1. *DSS-43 on Voyager*: 7.92 K from the scene (ground 2.88 K, cosmic background 2.68 K, air 2.36 K) and 13.2 K from the receiver make JPL's 21.12 K.[^voy] The receiver is more than half of it, and that is a cooled amplifier.
2. *Waveguide-fed dish* (my own round numbers): 60 K of scene, 95% efficiency, 0.5 dB of line at 290 K, a 75 K receiver: 95.3 K at the receiver and 170.3 K for the system. Only 0.5 dB of loss added 23.8 K.
3. Pull the line loss to 3 dB: half the scene is gone and 145 K of the line's own noise has come in.
4. *Small lossy antenna*: 50% efficient, 50 K of scene: 170 K after the antenna. Balanis's eq. (2-146) gives 340 K.
5. Drag the efficiency down on the right: the two forms part as $$1/e_A$$.

{% include readalong/antenna-temperature.html case="chain" preset="xband" caption="Left: noise temperature after each part, from the scene's T_A through the antenna's own loss and the line to the receiver; each bar is what that part adds (blue) or takes away (red), and the last is the system temperature T_s. Dashed red: the same levels from Balanis eq. (2-146). Right: antenna temperature at the receiver against the antenna's efficiency, each loss taken as t T_in + (1 − t) T (blue) and by eq. (2-146) (red dashed). The last row of the table is the same system temperature referred to the terminals of an equivalent lossless antenna, the reference point of ITU-R P.372." %}

## The gap

<details markdown="1">
<summary markdown="span">From brightness to antenna temperature</summary>

At radio frequencies, where $$h\nu \ll kT$$, a black body at temperature $$T$$ has a specific intensity (power per unit area, per steradian, per hertz) of $$2kT/\lambda^2$$, Rayleigh–Jeans. Any brightness, black body or not, can be written the same way with its own $$T_B$$.[^era] The antenna receives one polarization, half of it, over $$A_e(\theta,\phi)$$:

$$
kT_A = \frac{1}{2}\oint A_e\,\frac{2kT_B}{\lambda^2}\,d\Omega
\quad\Longrightarrow\quad
T_A = \frac{1}{\lambda^2}\oint A_e T_B\,d\Omega = \frac{1}{4\pi}\oint D\,T_B\,d\Omega ,
$$

using $$A_e = \lambda^2 D/4\pi$$, eq. (2-110). Eq. (2-144) is the same thing with $$G/\oint G\,d\Omega$$ for $$D/4\pi$$.

Rayleigh–Jeans fails for cold things at high frequencies. The cosmic background, 2.7255 K, has a Rayleigh–Jeans brightness of 2.69 K at 1.4 GHz and 2.49 K at 10 GHz, but 1.00 K at 100 GHz.

</details>

<details markdown="1">
<summary markdown="span">Why each loss adds $$(1-t)T$$</summary>

Put a lossy part at temperature $$T$$ between two matched loads, both also at $$T$$. Nothing can heat or cool, so the part must send out exactly as much as it absorbs. From the load on its input it passes $$tT$$ and absorbs $$(1-t)T$$; to keep the output at $$T$$ it must add $$(1-t)T$$ itself. That emission depends only on the part, so it stays the same when the input is colder or hotter, and $$T_{out} = tT_{in} + (1-t)T$$ in general. The same argument with a sky instead of a load gives the atmosphere's glow, $$T_B = T_{atm}(1 - e^{-\tau})$$ for an optical depth $$\tau$$, and the same with a surface gives eq. (2-143): an opaque surface that reflects $$\vert\Gamma\vert^2$$ absorbs, and so emits, $$1-\vert\Gamma\vert^2$$.[^era2]

</details>

## Common confusion

1. "Antenna temperature is how hot the antenna is." It is the temperature of a matched resistor that gives the same noise per hertz.[^era] A dish at 290 K pointed at the zenith at X band reports about 5 K.
2. "The ground is 300 K." Only a black ground at 300 K is. At 8.4 GHz dry soil looks straight up at about 255 K, wet soil about 157 K and the sea about 112 K, and all of them change with angle and polarization.

## In the book

- [§2.18](../2-18-antenna-temperature/), pp. 104–108. Brightness temperature, eq. (2-143), and the pattern-weighted antenna temperature, eqs. (2-144) and (2-145), p. 106. Fig. 2.35 and the chain, eqs. (2-146) to (2-148), pp. 107–108; Example 2.18, p. 108.
- Eq. (2-146a) adds $$T_{AP} = (1/e_A - 1)T_p$$ to $$T_A$$. That is the antenna's loss noise referred to the terminals of an equivalent *lossless* antenna, as in ITU-R P.372;[^itu372] but eq. (2-146) then multiplies only by the line's $$e^{-2\alpha l}$$, which is the receiver's reference point. The factor $$e_A$$ is missing, so the antenna's part comes out $$1/e_A$$ too large. Same numbers as Example 2.18 (150 K, $$e_A$$ 99%, 300 K, 1.3 dB of line at 300 K): eq. (2-146) gives 191.05 K, the consistent form 189.92 K. The example prints 190.90 K because it also rounds $$\alpha$$ to 0.0149 Np/m. At 99% the difference is about 1 K; at 50% it is a factor of 2.
- "About 100–150 K toward the horizon" (p. 106) has no frequency attached. At 8.4 GHz the clear sky is about 25 K at 5° elevation.
- Directivity and the beam solid angle: [§2.6](../2-6-directivity/). Main-beam and side-lobe pickup: [§2.10](../2-10-beam-efficiency/). Radiation efficiency: [§2.8](../2-8-antenna-efficiency/) and [§2.14](../2-14-antenna-radiation-efficiency/). $$\oint A_e\,d\Omega = \lambda^2$$ and the two ovens: [§2.16](../2-16-maximum-directivity-and-maximum-effective-area/). The Voyager link: [§2.17](../2-17-friis-transmission-and-radar-range-equations/).

---

## References

[^tb]: Balanis, [§2.18](../2-18-antenna-temperature/), eq. (2-143), p. 106.
[^era]: J. J. Condon and S. M. Ransom, *Essential Radio Astronomy* (Princeton University Press, 2016), §3.1.6, "Antenna Temperature", eqs. (3.47) to (3.54); Rayleigh–Jeans brightness temperature, [§2.2.3](../2-2-radiation-pattern/#three-antennas-in-3d-and-in-two-cuts), eqs. (2.31) to (2.33); [online edition at NRAO](https://www.cv.nrao.edu/~sransom/web/Ch3.html).
[^era2]: Condon and Ransom, [§2.2.3](../2-2-radiation-pattern/#three-antennas-in-3d-and-in-two-cuts), "Emission and Absorption of Radio Waves in the Earth's Atmosphere", eqs. (2.34) to (2.41); [online](https://www.cv.nrao.edu/~sransom/web/Ch2.html).
[^itu372]: ITU-R Recommendation P.372-16, *Radio noise* (08/2022), §1.2.1, eqs. (1) to (5), and §3.1, eqs. (10) and (11); [PDF at ITU](https://www.itu.int/dms_pubrec/itu-r/rec/p/R-REC-P.372-16-202208-S!!PDF-E.pdf).
[^itu527]: ITU-R Recommendation P.527-5, *Electrical characteristics of the surface of the Earth* (08/2019), §5.1.2, eqs. (14) to (27), §5.2, eqs. (36) to (49) and Table 1; [PDF at ITU](https://www.itu.int/dms_pubrec/itu-r/rec/p/R-REC-P.527-5-201908-S!!PDF-E.pdf).
[^voy]: R. Ludwig and J. Taylor, *Voyager Telecommunications*, DESCANSO Design and Performance Summary Series, Article 4 (JPL, March 2002), Table 5-3 (DSS-43, 1 January 1996, 58° elevation: total 21.12 K) and Table 5-5 (system noise temperature over a pass); [PDF at JPL](https://descanso.jpl.nasa.gov/DPSummary/Descanso4--Voyager_new.pdf).
