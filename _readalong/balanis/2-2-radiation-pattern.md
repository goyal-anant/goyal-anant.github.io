---
title: Radiation Pattern
book: balanis
section: "2.2"
---

## What this section is really saying

*Draft: Phase 2.*

## Predict first

## Three antennas in 3D and in two cuts

Each widget below draws the far-field pattern of one antenna in two ways. On top is the full 3D pattern: in every direction, the distance of the surface from the centre is how strong the field is in that direction, not a distance in metres.[^radius] Drag it (or click it and use the arrow keys) to turn it around. Below it are two flat cuts through the same pattern, in the colours of the two curves traced on the surface. This is how patterns are measured and drawn in practice: you can't plot a sphere on paper, so you take a few slices through it.[^cuts]

The three buttons switch the scale between field $$\vert E\vert$$, power $$\vert E\vert^2$$ and dB. The dashed circle on each cut is the half-power level, i.e. 0.707 on the field scale, 0.5 on the power scale and $$-3$$ dB on the dB scale. Switch between them and watch the table: the half-power beamwidth (HPBW) doesn't change, because it is the same pair of directions drawn three times. The table also gives the first-null beamwidth (FNBW), the angle between the first nulls on either side of the main beam, and the side-lobe level (SLL), the biggest lobe outside the main beam relative to the main beam.

### A dipole: the doughnut

A straight wire along $$z$$, fed at its centre, with total length $$L$$. It opens at $$L = 0.5\lambda$$, the half-wave dipole; at 2.4 GHz, the Wi-Fi band, that is a wire about 6 cm long. In the plots the wire is the black line through the centre, and the red dot in its middle is where it is fed.

The 3D pattern is a doughnut with the wire through its hole: a dipole sends nothing along its own axis. The H-plane cut (the $$x$$-$$y$$ plane) is a circle, so this antenna is *omnidirectional*: the same in every direction around the wire, but not in elevation. That is why the H-plane column of the table is empty. The E-plane cut is the figure of eight, with an HPBW of 78.1°.[^dipole]

Things to try:

1. Shrink $$L$$ to $$0.05\lambda$$. The doughnut gets fatter and the HPBW goes to about 90°, the pattern of a very short dipole.
2. Make $$L$$ longer than $$\lambda$$. At $$1.25\lambda$$ the main beam narrows to 32.6° and side lobes appear at $$-10.3$$ dB. Go to $$1.5\lambda$$ and the beam at $$\theta = 90°$$ shrinks; the strongest radiation now leaves at about 42° from the wire.
3. Which plane is the E-plane? It is the plane that holds the electric field and the direction of maximum radiation. For a vertical dipole every vertical plane qualifies, so the $$x$$-$$z$$ plane is only one of infinitely many E-planes.

{% include readalong/pattern-explorer.html antenna="dipole" %}

### An array: lots of lobes

Ten points along $$z$$, each radiating equally in all directions, spaced $$d$$ apart, and each fed with a phase that lags its neighbour by $$\beta$$. The pattern is the *array factor* of Chapter 6; here it is just a pattern with many lobes to name.[^array] The widget opens with $$N = 10$$, $$d = 0.25\lambda$$ and $$\beta = -0.6\pi$$, the array Balanis uses for Figures 2.2 and 2.4: HPBW 38.6°, and the biggest minor lobe at $$-9.1$$ dB, the "about $$-9$$ dB" in the text.

Points that radiate equally in all directions have no polarization, so there is no E-plane or H-plane here; the cuts are just named by the angle that changes along them.

Things to try:

1. Set $$\beta = 0$$. The main beam swings from the $$z$$ axis to $$\theta = 90°$$ and the HPBW drops to 20.5°. Keep this in mind for Figure 2.2: its caption gives $$N$$ and $$d$$ but not $$\beta$$, and with $$\beta = 0$$ you will not get 38.64°.
2. Count the lobes on the $$\theta$$ cut and find the major lobe, the side lobes next to it and the back lobe opposite it. These are the names of §2.2.1.
3. With $$\beta = 0$$, push $$d$$ up to $$1\lambda$$. Two more beams, as strong as the main one, appear along the $$z$$ axis. Now the pattern has more than one major lobe.

{% include readalong/pattern-explorer.html antenna="array" params="N=10,d=0.25,beta=-0.6" %}

### A waveguide aperture: two different planes

The open end of a rectangular metal waveguide, flush with a large flat metal sheet in the $$x$$-$$y$$ plane. The opening is $$a$$ wide (along $$x$$) and $$b$$ tall (along $$y$$). The electric field across it points along $$y$$, strongest in the middle and falling to zero at the two side walls, like half a cosine.[^aperture] In the plots the opening is the small rectangle in the metal sheet, and the red arrow across it shows which way that field points. In the cuts, the two short walls under the sheet are the waveguide; in the H-plane the field points straight out of the screen, so it shows as a dot in a circle. Nothing goes below the metal sheet, so the pattern lives in the upper half only.

This is the antenna where the E- and H-planes look different. The E-plane holds the field, so it is the $$y$$-$$z$$ plane; the H-plane is the $$x$$-$$z$$ plane. They line up with the coordinate planes only because the waveguide was placed that way.

At $$a = b = 3\lambda$$ the E-plane beam is narrower (17.0° against 22.2°), yet its side lobes are much higher ($$-13.3$$ dB against $$-25.1$$ dB). Same size of opening in both planes, so why? Along $$y$$ the field is uniform and stops suddenly at the edges; along $$x$$ it fades smoothly to zero. The sudden edge buys a narrower beam and pays for it in side lobes. This trade-off comes back for every aperture and array in the book.

Things to try:

1. Set $$a = 0.76\lambda$$ and $$b = 0.34\lambda$$, about the size of a standard X-band waveguide at 10 GHz. The beam is now so wide that the E-plane never falls to half power before it reaches the metal sheet, and the table shows a dash.
2. Grow $$a$$ alone and watch only the H-plane narrow. The beam is narrow in the plane where the opening is wide.

{% include readalong/pattern-explorer.html antenna="aperture" params="a=3,b=3" %}

## The gap

## Common confusion

---

## References

[^radius]: Balanis, §2.2.1, p. 32: the radial distance in a 3D pattern plot represents $$\vert E\vert$$.
[^cuts]: Balanis, §2.2, pp. 29–30.
[^dipole]: Balanis, §4.5, eqs. (4-62a), (4-64) and (4-65), pp. 172–173: the pattern of a dipole of length $$l$$, and its half-power beamwidth, 78° for $$l = \lambda/2$$ and 90° for a very short one.
[^array]: Balanis, §6.3, eq. (6-10c), p. 293: the normalised array factor of $$N$$ equally spaced, equally fed elements.
[^aperture]: Balanis, §12.5.3, pp. 624–626: a rectangular waveguide with the TE$$_{10}$$ field distribution, mounted on an infinite ground plane. The widget uses the same far-field form.
