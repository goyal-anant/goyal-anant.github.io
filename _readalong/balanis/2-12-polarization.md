---
title: Polarization
book: balanis
section: "2.12"
---

## What this section is really saying

Stand at one point in the far field and watch the tip of $$\mathbf{E}$$ over one period: it draws an ellipse, and the direction it goes round is the *sense*. That ellipse is the wave's polarization, and an antenna's polarization in some direction is the polarization of the wave it radiates there (Balanis quotes the IEEE definitions).[^def] Linear and circular are the two flat ends of the ellipse. When the wave and the receiving antenna disagree, part of the power is lost, and the polarization loss factor (PLF) says how much.

## Predict first

A GPS satellite sends right-hand circular polarization. Your receiver has a straight wire antenna. How much signal do you lose, and does it help to turn the wire?

## The ellipse at one point

Two perpendicular components, $$E_{xo}$$ and $$E_{yo}$$, with a time-phase difference $$\Delta\phi = \phi_y - \phi_x$$, as in Balanis eqs. (2-55) to (2-57).[^eq] The wave travels in $$-z$$, and the left panel looks along its travel, i.e. into the screen. The right panel shows the same field along two wavelengths of $$z$$ at one instant.

### Things to try

1. *RHCP*: equal components, $$\Delta\phi = +90°$$. The tip goes round clockwise, which the IEEE calls right hand. Now look at the helix on the right: it is a *left*-handed screw along the travel. The hand of the rotation in time and the hand of the helix in space are opposite, so never read the sense off a picture of the helix.
2. *Elliptical* ($$E_{xo} = 1$$, $$E_{yo} = 0.6$$, $$\Delta\phi = 50°$$): axial ratio 2.57, i.e. 8.20 dB, tilted 64.8° from $$y$$, right hand. Drag $$\Delta\phi$$ through 0: the ellipse flattens to a line and comes back with the other sense.
3. *Where (2-68) slips* ($$E_{xo} = 0.5$$, $$E_{yo} = 1$$, $$\Delta\phi = 0$$): a line at 26.6° from $$y$$. Eq. (2-68) with an ordinary $$\tan^{-1}$$ gives 116.6°, which is the minor axis. It happens every time $$E_{yo} > E_{xo}$$; see "The gap".

{% include readalong/polarization-ellipse.html case="wave" exo="1" eyo="1" dphi="90" caption="Left: the tip of E at one point over one period (blue), for the wave of Balanis eq. (2-55) travelling in −z, seen along its travel; dashed lines are the major and minor axes and τ is the tilt from the y axis. Right: the same field at one instant along two wavelengths of z, drawn obliquely with x out of the screen; the dot is the point on the left. Play runs time forward." %}

## How much a mismatch costs

The PLF is $$\vert\hat\rho_w\cdot\hat\rho_a\vert^2$$, eq. (2-71), where $$\hat\rho_w$$ is the wave's unit polarization vector and $$\hat\rho_a$$ the antenna's.[^plf] Here both ellipses are drawn as seen along the wave's travel, and the antenna's ellipse is the wave it would receive best. The right panel turns the antenna through 180° with everything else fixed.

### Things to try

1. *Wi-Fi dipole turned 45°*: −3.01 dB, same idea as Balanis Example 2.11. The curve is $$\cos^2\psi$$: −1.25 dB at 30°, −6.02 dB at 60°, and nothing at 90°.
2. *Straight wire, GPS signal*: the GPS spec allows the L1 signal an axial ratio of up to 1.8 dB within ±13.8° of nadir.[^gps] Along the major axis the wire loses 2.20 dB, along the minor axis 4.00 dB, and on average 3 dB. For a perfectly circular wave the curve goes flat at −3.01 dB: turning a linear antenna in a circular wave changes nothing.
3. *RHCP antenna, LHCP wave*: with a perfect antenna the PLF would be zero. With an antenna of axial ratio 3 dB it is −15.5 dB, so a right-hand antenna rejects the wrong sense only as well as its own axial ratio allows. Try 1 dB (−24.8 dB) and 6 dB (−10.0 dB).
4. *GPS patch, worst tilt*: a 3 dB patch against the 1.8 dB satellite signal, with the two ellipses at right angles, loses only 0.33 dB. Two antennas of the same sense forgive a lot.

{% include readalong/polarization-ellipse.html case="link" wave="R,0,0" antenna="L,0,0" caption="Left: the wave's ellipse (blue) and the receiving antenna's (red, dashed), both seen along the wave's travel; arrowheads give the sense. Right: the polarization loss factor in dB as the antenna's tilt goes from 0 to 180°, with the current tilt marked. The readout gives both unit vectors in (x, y): ρ̂a is the antenna's in transmit mode, as in Balanis eq. (2-71). The GPS signal's 1.8 dB axial ratio is the limit in IS-GPS-200N §3.3.1.9." %}

## Crossed dipoles

Balanis ends the section with two crossed dipoles fed $$90°$$ apart by making one feed line a quarter wavelength longer.[^cross] Overhead, both dipoles see the same broadside field, so the wave is circular there. Away from zenith each dipole's own pattern, eq. (4-64), shrinks one component and not the other.[^dip] The feed is the other catch: a quarter-wave line delays the current by exactly $$90°$$ only when the dipole at its end is matched to the line.

### Things to try

1. *Ideal* feed: 0 dB at zenith, then 1.76 dB at 30°, 4.04 dB at 45° and 7.58 dB at 60° from zenith in the plane of one dipole, and linear at the horizon. In the plane at $$\varphi = 45°$$ it is $$1/\cos\theta$$: 3.01 dB at 45°. A low satellite sees an elliptical antenna.
2. *λ/2 on 50 Ω*: the half-wave dipole's $$73 + j42.5\ \Omega$$ makes $$I_2/I_1 = 1.69$$ at −59.8° instead of 1 at −90°, and the axial ratio at zenith is 6.78 dB.[^z] Overhead, where the design promised a circle, the wave is closer to linear than circular.
3. *λ/2 on 75 Ω*: the magnitudes are closer (1.13) but the phase is still −59.8°: 4.93 dB. The reactance spoils the phase whatever the line.
4. *Trimmed on 50 Ω*: the dipole cut for zero reactance at 2.45 GHz (60.7 Ω, from [§2.11](../2-11-bandwidth/)) gets the phase right but not the magnitudes: 1.68 dB at zenith.

{% include readalong/polarization-ellipse.html case="turnstile" feed="ideal" theta="45" phi="0" caption="Left: the sky above two crossed half-wave dipoles (along x and y), seen from above, zenith at the centre and the horizon at the rim, with the polarization ellipse of the radiated wave drawn at each direction (blue right hand, red left hand); the dashed circle marks the chosen direction. Right: the axial ratio against angle from zenith, in the plane of the x dipole (φ = 0°) and halfway between the dipoles (φ = 45°). Fields from Balanis eq. (4-64); the y dipole's line is a quarter wavelength longer; dipoles at one centre and at right angles have no mutual impedance." %}

## The gap

<details markdown="1">
<summary markdown="span">Why eq. (2-71) has no complex conjugate</summary>

Take the wave of Balanis Example 2.12: right-hand circular, coming in along $$-\hat r$$. In the fixed basis $$(\hat\theta, \hat\phi)$$ it is $$(\hat\theta + j\hat\phi)/\sqrt2$$. A right-hand antenna at the origin radiates outwards, along $$+\hat r$$, and the same right-hand rotation seen along $$+\hat r$$ is $$(\hat\theta - j\hat\phi)/\sqrt2$$. Reversing the travel conjugates the vector of the same physical polarization.

So the vector of the wave the antenna receives best is $$\hat\rho_r = \hat\rho_a^{\,*}$$, and the usual projection of one polarization on another,

$$
\mathrm{PLF} = \left\vert\hat\rho_w\cdot\hat\rho_r^{\,*}\right\vert^2 = \left\vert\hat\rho_w\cdot\hat\rho_a\right\vert^2,
$$

needs no conjugate once $$\hat\rho_a$$ is the transmit-mode vector. With the numbers above, $$\vert(1 + 1)/2\vert^2 = 1$$. Write both in the same direction of travel and you must conjugate one of them; mix the two directions and the conjugate is already there.

</details>

<details markdown="1">
<summary markdown="span">The tilt needs a four-quadrant arctangent</summary>

With $$a = E_{xo}$$, $$b = E_{yo}$$ and $$\delta = \Delta\phi$$, the direction of the major axis comes from

$$
\tan 2\psi = \frac{2ab\cos\delta}{a^2 - b^2},
$$

where $$\psi$$ is measured from $$x$$. The equation gives $$2\psi$$ only up to $$180°$$, so $$\psi$$ comes out up to $$90°$$, and one of the two answers is the minor axis. The sign of $$a^2 - b^2$$ decides which: use $$2\psi = \mathrm{atan2}(2ab\cos\delta,\ a^2 - b^2)$$, then $$\tau = 90° - \psi$$ from $$y$$, as in eq. (2-68). With a plain $$\tan^{-1}$$, eq. (2-68) is right when $$a > b$$ and off by $$90°$$ when $$a < b$$; when $$a = b$$ it divides by zero, while atan2 gives $$45°$$.

The sense has a similar trap: eqs. (2-63) and (2-64) say $$\Delta\phi > 0$$ is clockwise, which holds only after $$\Delta\phi$$ is brought into $$(-180°, 180°)$$. $$\Delta\phi = 288°$$ is $$-72°$$: counterclockwise.

</details>

<details markdown="1">
<summary markdown="span">What the quarter-wave line does to the current</summary>

A line of length $$\ell$$ and impedance $$Z_0$$, driven with $$V$$ at the junction and ended in $$Z_L$$, gives a load current

$$
I_L = \frac{V}{Z_L\cos\beta\ell + jZ_0\sin\beta\ell}.
$$

With $$\ell = 0$$ for one dipole and $$\lambda/4$$ for the other,

$$
\frac{I_2}{I_1} = \frac{Z_L}{jZ_0} = -j\,\frac{Z_L}{Z_0},
$$

which is $$-j$$, i.e. equal and $$90°$$ behind, only for $$Z_L = Z_0$$. The $$\lambda$$ here is the wavelength in the line, and the quarter wave is exact at one frequency only, so the axial ratio has a bandwidth of its own.

</details>

## Common confusion

1. "Right-hand circular means a right-handed corkscrew." Not in the IEEE convention: right hand is the rotation in time at one point, seen along the travel. At one instant the same field along the line of travel is a left-handed helix (first widget, item 1).
2. "A right-hand antenna rejects left-hand signals." Only to the extent of its axial ratio: 15.5 dB of rejection at 3 dB axial ratio, 24.8 dB at 1 dB. In general an antenna of axial ratio $$AR$$ receives a perfect circular wave of the opposite sense with $$\mathrm{PLF} = (AR - 1)^2/\big(2(AR^2 + 1)\big)$$.

## In the book

- §2.12, pp. 70–80. Definitions (pp. 70–73), the Poincaré sphere (p. 73, details in Fig. 17.24, p. 1040), §2.12.1 eqs. (2-55) to (2-68) with Fig. 2.23 (pp. 71–75), §2.12.2 eqs. (2-69) to (2-71a), Figs. 2.24 and 2.25, Examples 2.11 and 2.12 (pp. 76–79), crossed dipoles, Fig. 2.26 (p. 80).
- Eq. (2-68) as printed uses $$\tan^{-1}$$; it needs the four-quadrant form when $$E_{yo} > E_{xo}$$ (see "The gap").
- The far field as a local plane wave: §3.6. The vector effective length in eq. (2-71a): §2.15. Measuring polarization: Chapter 17.

---

## References

[^def]: Balanis, §2.12, pp. 70–72, quoting IEEE Std 145 for the polarization of an antenna and of a wave.
[^eq]: Balanis, §2.12.1, eqs. (2-55) to (2-57), p. 73; axial ratio eqs. (2-65) to (2-67) and tilt eq. (2-68), p. 74.
[^plf]: Balanis, §2.12.2, eqs. (2-69) to (2-71), p. 76; the remark that no conjugate is used, and Example 2.12, pp. 77–79.
[^gps]: IS-GPS-200N, *NAVSTAR GPS Space Segment/Navigation User Segment Interfaces* (Space Systems Command, 1 Aug 2022), §3.3.1.9, p. 18: the signal is right-hand circular, with L1 ellipticity no worse than 1.8 dB for Block IIR to IIIF satellites ([PDF](https://archive.gps.gov/technical/icwg/IS-GPS-200N.pdf)).
[^cross]: Balanis, §2.12.2, Fig. 2.26 and the text around it, p. 80.
[^dip]: Balanis, §4.5, eq. (4-64), p. 173.
[^z]: Balanis, §4.5, eq. (4-93a), p. 184.
