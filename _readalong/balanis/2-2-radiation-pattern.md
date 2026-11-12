---
title: Radiation Pattern
book: balanis
section: "2.2"
---

## What this section is really saying

A radiation pattern is a map of how strongly an antenna radiates in each direction, drawn on a sphere far away. Most of §2.2 is vocabulary for that map: field or power, linear or dB, lobes, principal planes. The one piece of physics is how far "far" is: the map stops changing beyond about $$2D^2/\lambda$$.

## Predict first

A half-wave dipole is a 6 cm wire at 2.4 GHz. Does it radiate most along the wire or broadside to it? Does it radiate along the wire at all? Check on the first widget.

## Three antennas in 3D and in two cuts

On top, the 3D pattern: its distance from the centre in any direction is the field strength there, not a distance in metres.[^radius] Drag it to turn it. Below it, two flat cuts through it, in the colours of the curves on the surface; you can't plot a sphere on paper, so you take slices.[^cuts]

The buttons switch between field $$\vert E\vert$$, power $$\vert E\vert^2$$ and dB. The dashed circle is the half-power level: 0.707, 0.5 or $$-3$$ dB. The HPBW in the table doesn't change with the scale, because it is the same pair of directions drawn three times.

### A dipole: the doughnut

A wire of length $$L$$ along $$z$$, fed at the red dot. It sends nothing along its own axis, so the pattern is a doughnut. The H-plane cut is a circle, i.e. the dipole is *omnidirectional*; the E-plane cut is a figure of eight with an HPBW of 78.1°.[^dipole]

1. Shrink $$L$$ to $$0.05\lambda$$: the HPBW goes to about 90°, the short dipole.
2. At $$L = 1.25\lambda$$ the beam narrows to 32.6° and side lobes appear at $$-10.3$$ dB; at $$1.5\lambda$$ the strongest beams leave at about 42° from the wire.
3. Any plane holding the wire is an E-plane, so $$x$$-$$z$$ is only one of infinitely many.

{% include readalong/pattern-explorer.html antenna="dipole" %}

### An array: lots of lobes

Points along $$z$$ that radiate equally in all directions, spaced $$d$$ apart, each fed with a phase $$\beta$$ behind its neighbour: the *array factor* of Chapter 6.[^array] It opens on Balanis's Figures 2.2 and 2.4 array ($$N = 10$$, $$d = 0.25\lambda$$, $$\beta = -0.6\pi$$): HPBW 38.6°, biggest minor lobe $$-9.1$$ dB. Isotropic points have no polarization, so there are no E- or H-planes here.

1. Set $$\beta = 0$$: the beam swings to $$\theta = 90°$$ and the HPBW drops to 20.5°. The Figure 2.2 caption leaves out $$\beta$$, and with $$\beta = 0$$ you won't get its 38.64°.
2. Find the major lobe, the side lobes and the back lobe of §2.2.1 on the $$\theta$$ cut.
3. With $$\beta = 0$$, push $$d$$ to $$1\lambda$$: two more beams as strong as the main one appear along $$z$$, i.e. more than one major lobe.

{% include readalong/pattern-explorer.html antenna="array" params="N=10,d=0.25,beta=-0.6" %}

### A waveguide aperture: two different planes

The open end of a rectangular waveguide, $$a$$ by $$b$$, in a metal sheet. The field across it points along $$y$$ (red arrow; ⊙ where it points out of the cut) and falls to zero at the side walls like half a cosine.[^aperture] So the E-plane is $$y$$-$$z$$ and the H-plane is $$x$$-$$z$$, and here they look different.

At $$a = b = 3\lambda$$ the E-plane beam is narrower (17.0° against 22.2°) but its side lobes are higher ($$-13.3$$ dB against $$-25.1$$ dB). Along $$y$$ the field stops suddenly at the edges; along $$x$$ it fades to zero. A sudden edge buys a narrower beam and pays in side lobes, a trade-off that comes back for every aperture and array in the book.

1. Grow $$a$$ alone: only the H-plane narrows.
2. Make the opening small, say $$0.76\lambda$$ by $$0.34\lambda$$: the E-plane never falls to half power before the sheet, and the table shows a dash.

{% include readalong/pattern-explorer.html antenna="aperture" params="a=3,b=3" %}

## How a cut is measured

The antenna sits on a turntable in a room lined with foam pyramids, which soak up echoes; a probe antenna stays put on the far side. One turn of the table and the probe has seen the antenna from every direction in one plane: one cut.[^cuts]

In Fig 1 the platter is also the chart. A pen pointing at the probe moves out when the signal is strong and in when it is weak, and the chart turns with the antenna, so the trace *is* the pattern: here the dipole's E-plane figure of eight. Stop the table where the pen is nearest the centre, and the wire points at the probe. The probe is drawn far closer than in a real chamber.

{% include readalong/pattern-range.html %}

## Near field and far field

The pattern only stops changing with distance in the far field. Balanis splits the space around an antenna of size $$D$$ into three regions:[^regions]

1. *reactive near field*, $$R < 0.62\sqrt{D^3/\lambda}$$: energy sloshes back and forth next to the antenna;
2. *radiating near field* (Fresnel), up to $$2D^2/\lambda$$: energy leaves, but the pattern's shape still changes with distance;
3. *far field* (Fraunhofer), beyond $$2D^2/\lambda$$.

For a 60 cm dish at 12 GHz ($$\lambda = 2.5$$ cm), $$2D^2/\lambda = 28.8$$ m and the reactive region ends at 1.82 m. A dish you can carry in one hand needs a probe almost 30 m away.

In Fig 2 the probe slides along a log-scale rail, and its screen shows the pattern at that distance (solid) against the far field (dashed). At 3 m there are no nulls: the side lobes merge into one shoulder around a wider beam. Past the second pin the curves coincide, apart from the first null, which at $$2D^2/\lambda$$ is still about $$-30$$ dB instead of $$-38$$ dB. Balanis shows the same for a reflector in Figure 2.9, and notes that $$4D^2/\lambda$$ does better.[^fig29]

{% include readalong/field-regions.html %}

The curves add up the waves from every point of the dish over their exact path lengths, for a dish lit more at its centre than at its rim. Far away this gives an HPBW of $$72.6\lambda/D$$ (3.0°) and side lobes at $$-24.6$$ dB. The sum leaves out the reactive field, so in the first region the curve is only a hint.

## The gap

<details markdown="1">
<summary markdown="span">Where does $$2D^2/\lambda$$ come from?</summary>

For an antenna along $$z$$ from $$-D/2$$ to $$D/2$$, the distance from a point $$z'$$ on it to an observer at $$(r, \theta)$$ is (Balanis eq. 4-41)

$$
R = \sqrt{r^2 - 2rz'\cos\theta + z'^2} = r - z'\cos\theta + \frac{z'^2\sin^2\theta}{2r} + \dots
$$

The far-field formulas keep the first two terms. The third is largest at $$\theta = 90°$$ and $$z' = D/2$$, where it is $$D^2/8r$$. Asking its phase to stay below $$\pi/8$$:

$$
\frac{2\pi}{\lambda}\,\frac{D^2}{8r} \le \frac{\pi}{8} \quad\Longrightarrow\quad r \ge \frac{2D^2}{\lambda},
$$

i.e. the path from the edge is off by at most $$\lambda/16$$.[^gap] The $$\pi/8$$ is a convention, not a law; low side-lobe work uses a stricter one. Keeping the third term and bounding the fourth the same way gives $$0.62\sqrt{D^3/\lambda}$$ (eqs. 4-49 to 4-52a). Both count only path errors across the antenna and ignore the reactive field near it, which is why they need $$D > \lambda$$.

</details>

## Common confusion

1. "Side lobe levels of $$-20$$ dB or smaller are usually not desirable" (p. 31) reads backwards: side lobes *higher* than about $$-20$$ dB are the bad ones, and below $$-30$$ dB takes careful design.[^sll]
2. $$2D^2/\lambda$$ is not every antenna's far-field distance. For the 2.4 GHz half-wave dipole it gives 6.25 cm, still in the reactive near field; the formula assumes $$D > \lambda$$. For a small antenna the far field is where $$kr \gg 1$$; a short dipole's reactive region ends near $$\lambda/2\pi$$, where $$kr = 1$$.[^small]

## In the book

- §2.2, pp. 27–38, Figures 2.1–2.10, eqs. (2-1) and (2-2).
- Region boundaries: §4.4, pp. 166–170, eqs. (4-41) to (4-55c).
- Dipoles: §4.5–4.6. Arrays: §6.3. Waveguide aperture: §12.5.3.
- HPBW and FNBW in full: §2.5, Beamwidth.

---

## References

[^radius]: Balanis, §2.2.1, p. 32: the radial distance in a 3D pattern plot represents $$\vert E\vert$$.
[^cuts]: Balanis, §2.2, pp. 29–30.
[^regions]: Balanis, §2.2.4, pp. 34–35, quoting the IEEE definitions, and eqs. (4-55a) to (4-55c), p. 170.
[^fig29]: Balanis, §2.2.4, p. 36 and Figure 2.9; §4.4.1, p. 168.
[^gap]: Balanis, §4.4.1, eqs. (4-41) to (4-45), pp. 166–167.
[^sll]: Balanis, §2.2.1, pp. 31–32.
[^small]: Balanis, §2.2.4, p. 34 and the footnotes on pp. 34–35; the radian distance $$kr = 1$$ and the far field $$kr \gg 1$$ of a short dipole are in §4.2, pp. 156–159.
[^dipole]: Balanis, §4.5, eqs. (4-62a), (4-64) and (4-65), pp. 172–173: the pattern of a dipole of length $$l$$, and its half-power beamwidth, 78° for $$l = \lambda/2$$ and 90° for a very short one.
[^array]: Balanis, §6.3, eq. (6-10c), p. 293: the normalised array factor of $$N$$ equally spaced, equally fed elements.
[^aperture]: Balanis, §12.5.3, pp. 624–626: a rectangular waveguide with the TE$$_{10}$$ field distribution, mounted on an infinite ground plane. The widget uses the same far-field form.
