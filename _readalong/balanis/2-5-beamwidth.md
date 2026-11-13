---
title: Beamwidth
book: balanis
section: "2.5"
---

## What this section is really saying

Beamwidth is the angle between two equal points on either side of the beam peak. Without a qualifier it means the half-power beamwidth (HPBW): the two directions where $$U$$ is half its peak, i.e. $$-3$$ dB. The first-null beamwidth (FNBW) uses the nulls instead. §2.2 already measures both live; this page is about the two claims at the end of the section: a narrow beam costs you side lobes, and the beamwidth decides whether you can tell two sources apart.

## Predict first

A weather radar 100 km away looks at two storm cells 1.5 km apart. Its beam is about 1.6 km wide at that distance. Does it see one storm or two? Check on the second widget.

## Narrow beam or low side lobes

The dish here is the NEXRAD weather radar's: 8.54 m across, working between 2.7 and 3.0 GHz.[^nexrad] How a dish is lit across its face, its *taper*, is chosen by the feed. Lit evenly (uniform), every part of the dish works fully and the beam is as narrow as it can be, but the sharp edge of the illumination rings into high side lobes. Lit more at the centre than at the rim, $$(1-\rho^2)^n$$ with $$\rho$$ the distance from the centre over the radius, the edge is soft and the side lobes drop, but the beam is wider, since the outer part of the dish is doing less.[^taper]

1. Click through the three tapers at 2.85 GHz. The HPBW goes 0.726°, 0.896°, 1.039°; the first side lobe goes $$-17.6$$, $$-24.6$$, $$-30.6$$ dB. Every step down in side lobes is paid for with a wider beam and less of the dish put to use (100%, 75%, 56%).
2. Stay on *Parabolic* and slide the frequency from 2.7 to 3.0 GHz: the HPBW goes from 0.946° to 0.851°. The real dish measures 0.96° and 0.88°, with a first side lobe of $$-29$$ dB, so it sits close to this taper.[^nexrad]
3. Watch the last row of numbers, FNBW/2 ÷ HPBW: 1.19, 1.29, 1.38. Keep it in mind for the next section.

{% include readalong/beam-resolution.html view="taper" caption="The 8.54 m NEXRAD dish lit with three tapers (the chosen one in colour, the other two faint). Red bar: the HPBW on the dashed −3 dB line; red circles: the first nulls; dotted line: the first side lobe. Patterns from Balanis eq. (7-45) with the tapers of eq. (7-46)." %}

## Telling two storms apart

As the radar's beam sweeps past the two cells, the output rises and falls. If it dips between them, you see two storms; if it doesn't, one. Balanis's rule says two sources can be told apart when they are at least FNBW/2 apart, i.e. the peak of one sits on the first null of the other (the *Rayleigh criterion* of optics).[^res] It is a convention, not a law: at that spacing the dip is clear, but a smaller dip still shows. The dip disappears altogether at a smaller spacing, the *Sparrow limit*, where the output between the two stops curving down.[^sparrow]

1. With the defaults (1.5 km, rain, one-way) the dip is only $$-0.08$$ dB: two cells on paper, one on the screen. Switch to *Two-way (radar)*: the dip is $$-2.52$$ dB. A radar sends and receives through the same dish, so the pattern acts twice, the echo goes as $$U^2$$, and the beam that matters is narrower: 1.12 km instead of 1.56 km at 100 km.[^radar]
2. Back to one-way, try *Uniform*: $$-1.32$$ dB at the same 1.5 km. *Parabolic²*: one peak. The taper which gave you low side lobes takes away resolution.
3. Parabolic, one-way, 2 km (just under Rayleigh's 2.01 km): $$-2.07$$ dB. Now switch the echoes to *In phase*: one peak. *Antiphase*: the output goes to zero between them.

{% include readalong/beam-resolution.html view="scan" caption="Two storm cells (red dots) 100 km from the NEXRAD dish at 2.85 GHz. Grey: the beam where it points now. Blue: the receiver output against where the beam points, scaled to its peak. Rain: the two echoes add in power. In phase and antiphase: they add in field, as from two point targets." %}

## The gap

<details markdown="1">
<summary markdown="span">Why FNBW/2 is close to the HPBW, and when it isn't</summary>

A dish of diameter $$D$$ lit as $$(1-\rho^2)^n$$ has the field pattern (Balanis eq. 7-45 with 7-46)

$$
F_n(u) = \frac{2^{n+1}(n+1)!\,J_{n+1}(u)}{u^{n+1}}, \qquad u = \frac{\pi D}{\lambda}\sin\theta
$$

with $$J_{n+1}$$ a Bessel function. Half power is where $$F_n^2 = 1/2$$ and the first null is the first zero of $$J_{n+1}$$. For a uniform dish ($$n = 0$$) these are at $$u = 1.616$$ and $$u = 3.832$$, and for a big dish $$\sin\theta \approx \theta$$, so

$$
\mathrm{HPBW} = \frac{2 \times 1.616}{\pi}\frac{\lambda}{D} = 1.03\,\frac{\lambda}{D}, \qquad \frac{\mathrm{FNBW}}{2} = \frac{3.832}{\pi}\frac{\lambda}{D} = 1.22\,\frac{\lambda}{D}
$$

in radians. The two differ by 19%, which is what the "≈" in Balanis hides. For a tapered dish the null moves out faster than the half-power point: 29% apart for $$n = 1$$, 38% for $$n = 2$$.[^taper] For a uniform line source instead of a dish, $$U \propto (\sin u/u)^2$$, it is 13% (half power at $$u = 1.392$$, null at $$\pi$$).

</details>

## Common confusion

1. FNBW/2 ≈ HPBW holds only for a uniform distribution, and even then to about 20%. Balanis says "uniform", but the rule gets used for every antenna. For a strongly tapered dish FNBW/2 is 38% larger than the HPBW.
2. The resolution rule assumes the two sources add in power, like rain or two separate transmitters. Two point targets lit by the same radar add in field, with a phase that depends on their exact distances: at the same spacing they can merge into one peak or split with a zero between them.

## In the book

- §2.5, pp. 42–44, Fig. 2.11 and Example 2.4. The exact root of Example 2.4 gives an HPBW of 28.75°; the book rounds $$\theta_h$$ to 0.25 rad and gets 28.65°.
- HPBW in a pattern: §2.2, Fig. 2.2. Circular apertures with taper: §7.10.2, pp. 421–422, eqs. (7-45), (7-46) and Table 7.2; in full in §12.6. The radar range equation: §2.17.2, eq. (2-124).
- Next: §2.6 Directivity, where a narrow beam turns into a high directivity.

---

## References

[^nexrad]: National Research Council, *Weather Radar Technology Beyond NEXRAD* (National Academies Press, 2002), Appendix A, "NEXRAD WSR-88D System Characteristics", pp. 69–70: reflector 8.54 m (28 ft) circular; one-way 3 dB beamwidth 0.96° at 2.7 GHz and 0.88° at 3.0 GHz; gain 45.8 dB at 2.85 GHz; first side lobe $$-29$$ dB; transmitter 2.7–3.0 GHz.
[^taper]: Balanis, §7.10.2, eqs. (7-45) and (7-46) and Table 7.2, pp. 421–422: HPBW, FNBW, first side lobe and directivity factor of circular apertures with $$n = 0, 1, 2$$. Our numbers agree with the table to within 1%.
[^res]: Balanis, §2.5, p. 43.
[^sparrow]: C. M. Sparrow, "On spectroscopic resolving power," *Astrophysical Journal* 44, 76 (1916), doi:[10.1086/142271](https://doi.org/10.1086/142271). He states Rayleigh's criterion, with a dip of $$8/\pi^2 \approx 0.81$$ for a $$(\sin u/u)^2$$ line, and finds the dip vanishing at a spacing of 2.606 in $$u$$ instead of $$\pi$$.
[^radar]: Balanis, §2.17.2, eq. (2-124), p. 97: the received power goes as the product of the transmitting and receiving directivities in the target's direction; when one dish does both, that is its pattern squared.
