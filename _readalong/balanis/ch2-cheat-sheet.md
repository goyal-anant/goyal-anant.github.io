---
title: Chapter 2 cheat sheet
book: balanis
sheet: 2
permalink: /read-along/balanis/ch2-cheat-sheet/
---

This is Chapter 2 on one page: every quantity with its equation, unit, meaning and the conditions it needs, enough to follow Chapter 3 onwards without reading the chapter. Equation numbers are Balanis's; each § link opens the full page with its widget, and *Why* opens the reasoning. The chapter is one chain, from the fields around an antenna to the power and noise at the far end of a link.

{% include readalong/sheet-map-ch2.html %}

## Where the power goes {#power}

Radiation pattern <span class="ra-ref">[§2.2](../2-2-radiation-pattern/) · pp. 27–34</span>
: How strongly the antenna radiates in each direction, on a far-field sphere.[^pat] The *field pattern* plots $$\vert E\vert$$, the *power pattern* $$\vert E\vert^2$$; normalised and in dB they are the same curve. The *major lobe* holds the peak; the *side lobe level* is the largest other lobe, in dB below the peak. *Isotropic*: equal in all directions (ideal). *Omnidirectional*: equal in all directions of one plane. The *E-plane* holds $$\mathbf E$$ and the peak direction, the *H-plane* $$\mathbf H$$ and the peak direction.

  <!--noread-->
  <details markdown="1"><summary markdown="span">Why</summary>
  In the far field every component goes as $$e^{-jkr}/r$$ times a function of direction alone. Divide by the peak and $$r$$ drops out, so what is left is a property of the antenna, not of where you stand.
  </details>
  <!--/noread-->

Field regions <span class="ra-ref">[§2.2](../2-2-radiation-pattern/) · pp. 34–35</span>
: With $$D$$ the antenna's largest dimension: *reactive near field* for $$r < 0.62\sqrt{D^3/\lambda}$$ (stored energy dominates), *radiating near field* out to $$2D^2/\lambda$$ (the pattern still changes with $$r$$), *far field* beyond.[^reg] This needs $$D > \lambda$$. For a small antenna "far" means $$kr \gg 1$$; a short dipole's reactive region ends near $$kr = 1$$, i.e. $$r = \lambda/2\pi$$; $$2D^2/\lambda$$ would put a 2.4 GHz half-wave dipole's far field at 6.25 cm, inside it.

  <!--noread-->
  <details markdown="1"><summary markdown="span">Why</summary>
  At $$2D^2/\lambda$$ the paths from the centre and from the edge of the antenna to the observer differ by $$\lambda/16$$, i.e. a phase error of $$\pi/8$$. That is the conventional point where the pattern stops changing in a way anyone cares about.
  </details>
  <!--/noread-->

Solid angle <span class="ra-ref">[§2.4](../2-4-radiation-intensity/) · (2-2)</span>
: $$d\Omega = \sin\theta\,d\theta\,d\phi$$, in steradians: one steradian cuts an area $$r^2$$ out of a sphere of radius $$r$$. The whole sphere is $$4\pi$$ sr, i.e. 41,253 square degrees.[^sr]

  <!--noread-->
  <details markdown="1"><summary markdown="span">Why</summary>
  A patch $$d\theta$$ by $$d\phi$$ on the sphere has sides $$r\,d\theta$$ and $$r\sin\theta\,d\phi$$: circles of latitude shrink towards the poles. Leave out the $$\sin\theta$$ and the poles count as much as the equator.
  </details>
  <!--/noread-->

Power density <span class="ra-ref">[§2.3](../2-3-radiation-power-density/) · (2-8) to (2-11)</span>
: $$\mathbf W = \tfrac12\,\mathrm{Re}\big(\mathbf E\times\mathbf H^*\big)$$ in W/m², and $$P_{rad} = \oint_S \mathbf W\cdot d\mathbf s$$.[^W] The time-averaged Poynting vector for peak phasors (RMS phasors drop the $$\tfrac12$$). Its real part leaves for good and is the same through every closed surface, near or far; the imaginary part of $$\mathbf E\times\mathbf H^*$$ is energy going back and forth near the antenna. In the far field $$W = \vert\mathbf E\vert^2/2\eta$$, radial, $$\eta \approx 377\ \Omega$$; isotropic, $$W_0 = P_{rad}/4\pi r^2$$.

  <!--noread-->
  <details markdown="1"><summary markdown="span">Why</summary>
  Between two spheres there is nothing to absorb power, so the real flux through both must be equal. The reactive part falls faster than $$1/r^2$$, which is why it only matters close in.
  </details>
  <!--/noread-->

Radiation intensity <span class="ra-ref">[§2.4](../2-4-radiation-intensity/) · (2-12) to (2-15)</span>
: $$U = r^2 W_{rad}$$ in W/sr; in the far field $$U = \dfrac{r^2}{2\eta}\big(\vert E_\theta\vert^2 + \vert E_\phi\vert^2\big)$$.[^U] Power per unit solid angle, a function of direction only; $$P_{rad} = \oint U\,d\Omega$$ and isotropic $$U_0 = P_{rad}/4\pi$$. Far field only: near a half-wave dipole $$r^2\,\mathrm{Re}\,W$$ still changes with $$r$$.

  <!--noread-->
  <details markdown="1"><summary markdown="span">Why</summary>
  $$W$$ falls as $$1/r^2$$ only because the same power spreads over an area that grows as $$r^2$$. Multiply the $$r^2$$ back and what is left is what the antenna sends into each direction.
  </details>
  <!--/noread-->

## How focused the antenna is {#focus}

Directivity <span class="ra-ref">[§2.6](../2-6-directivity/) · (2-16), (2-17)</span>
: $$D = \dfrac{4\pi U}{P_{rad}} = \dfrac{U}{U_0}$$, no unit; $$D_0$$ is its maximum, in dBi when written as $$10\log_{10}D$$.[^D] Intensity against an isotropic source radiating the *same power*, so losses and mismatch don't enter. Partial directivities add: $$D_0 = D_\theta + D_\phi$$.

Beam solid angle <span class="ra-ref">[§2.6](../2-6-directivity/) · (2-23), (2-24)</span>
: $$\Omega_A = \oint F_n(\theta,\phi)\,d\Omega$$, with $$F_n$$ the power pattern normalised to 1 at the peak, and $$D_0 = 4\pi/\Omega_A$$.[^omega] The solid angle the power would fill at full peak intensity: the antenna lights $$1/D_0$$ of the sky.

  <!--noread-->
  <details markdown="1"><summary markdown="span">Why</summary>
  By definition $$P_{rad} = U_{max}\,\Omega_A$$. Put that into $$D_0 = 4\pi U_{max}/P_{rad}$$.
  </details>
  <!--/noread-->

Beamwidth <span class="ra-ref">[§2.5](../2-5-beamwidth/) · pp. 42–44</span>
: *HPBW*: the angle between the $$-3$$ dB directions either side of the peak; *FNBW*: between the first nulls.[^bw] Tapering an aperture's excitation towards its edges lowers the side lobes and widens the beam. Two equal sources are resolved about FNBW/2 apart, which is close to the HPBW only for uniform excitation.

  <!--noread-->
  <details markdown="1"><summary markdown="span">Why</summary>
  An aperture of width $$D$$ makes a beam about $$\lambda/D$$ radians wide. A taper uses its edges less, which acts like a smaller aperture with softer edges: wider beam, weaker side lobes.
  </details>
  <!--/noread-->

Directivity from beamwidths <span class="ra-ref">[§2.6](../2-6-directivity/) · (2-27), (2-27a), (2-30b)</span>
: With $$\Theta_{1d}$$, $$\Theta_{2d}$$ the HPBWs in degrees in two perpendicular planes:

  $$
  D_0 \approx \frac{41{,}253}{\Theta_{1d}\Theta_{2d}}\ \text{(Kraus)},\qquad D_0 \approx \frac{32{,}400}{\Theta_{1d}\Theta_{2d}}\ \text{(planar arrays)},\qquad D_0 \approx \frac{72{,}815}{\Theta_{1d}^2 + \Theta_{2d}^2}\ \text{(Tai and Pereira)}.
  $$

  For one narrow main lobe with small side lobes. Tai and Pereira is exact for a narrow Gaussian beam, which Kraus puts 13.3% high; side lobes push both up (Kraus about 20% on a uniform dish). Omnidirectional patterns: (2-32) to (2-33b).[^est]

Numerical directivity <span class="ra-ref">[§2.7](../2-7-numerical-techniques/) · (2-43)</span>
: $$P_{rad} \approx \dfrac{\pi}{N}\dfrac{2\pi}{M}\displaystyle\sum_{j=1}^{M}\sum_{i=1}^{N} U(\theta_i,\phi_j)\sin\theta_i$$, then $$D_0 = 4\pi U_{max}/P_{rad}$$.[^num] Pick the step from the beam: HPBW/4 gives about 0.2 dB of error, HPBW/10 a few hundredths. The book's 10° grid suits a dipole, not a dish.

Beam efficiency <span class="ra-ref">[§2.10](../2-10-beam-efficiency/) · (2-53), (2-54)</span>
: $$\mathrm{BE} = \dfrac{\int_0^{2\pi}\!\int_0^{\theta_1} U\sin\theta\,d\theta\,d\phi}{\oint U\,d\Omega}$$: the share of radiated power inside a cone of half-angle $$\theta_1$$, a property of the pattern alone.[^be] Inside the first null, a uniformly lit circular aperture keeps 83.8%, a parabolic taper 98.2%; the half-power cone holds only about half.

  <!--noread-->
  <details markdown="1"><summary markdown="span">Why</summary>
  For a large, uniformly lit circular aperture the share inside $$u = ka\sin\theta_1$$ is $$1 - J_0^2(u) - J_1^2(u)$$. At the first null $$J_1 = 0$$, and $$1 - J_0^2$$ is 0.838.
  </details>
  <!--/noread-->

## What is lost on the way in {#lost}

Efficiency chain <span class="ra-ref">[§2.8](../2-8-antenna-efficiency/) · (2-44), (2-45)</span>
: $$e_0 = e_r\,e_c\,e_d = e_r\,e_{cd}$$, with the reflection efficiency $$e_r = 1 - \vert\Gamma\vert^2$$, $$\Gamma = \dfrac{Z_{in} - Z_0}{Z_{in} + Z_0}$$ and $$\mathrm{VSWR} = \dfrac{1 + \vert\Gamma\vert}{1 - \vert\Gamma\vert}$$.[^eff] The share of the line's power that is radiated. $$e_r$$ is measured and fixed from outside; conduction and dielectric losses can't be separated even by measurement, so they are lumped as $$e_{cd}$$. A good match says nothing about $$e_{cd}$$: a 50 Ω resistor has VSWR 1.

Input impedance <span class="ra-ref">[§2.13](../2-13-input-impedance/) · (2-72), (2-73), (2-79), (2-80)</span>
: $$Z_A = R_A + jX_A$$ with $$R_A = R_r + R_L$$: radiation resistance plus loss resistance.[^za] In series with a generator $$Z_g$$ every power is $$\tfrac12\vert I\vert^2R$$; at conjugate match ($$R_r + R_L = R_g$$, $$X_A = -X_g$$) the antenna gets half the source's power. Receiving is the same circuit with the source in the antenna. $$R_r$$ depends on the current it is referred to: a full-wave dipole has 199 Ω at its current maximum, hundreds to thousands at its centre feed. Not valid with lossy dielectric or over lossy ground.

Radiation efficiency <span class="ra-ref">[§2.14](../2-14-antenna-radiation-efficiency/) · (2-90) to (2-90b)</span>
: $$e_{cd} = \dfrac{R_r}{R_r + R_L}$$.[^ecd] For a wire of length $$l$$ and radius $$b$$, $$R_{dc} = \dfrac{l}{\sigma\pi b^2}$$ and at high frequency $$R_{hf} = \dfrac{l}{2\pi b}\sqrt{\dfrac{\omega\mu_0}{2\sigma}}$$, which needs $$b \gg \delta = 1/\sqrt{\pi f\mu_0\sigma}$$: it is 51% low at $$b = \delta$$ and 5% low at $$10\delta$$. A half-wave dipole's sinusoidal current halves it at the feed. The metal decides only $$R_L$$: the same copper gives 99.8% as a Wi-Fi dipole, 4.3% as a 10 m wire at 100 kHz.

Gain <span class="ra-ref">[§2.9](../2-9-gain/) · (2-46) to (2-51)</span>
: $$G = \dfrac{4\pi U}{P_{in}} = e_{cd}D$$, and the absolute gain $$G_{abs} = e_r e_{cd} D = e_0 D$$.[^gain] Gain divides by the power accepted at the terminals, absolute gain by the power available from the line; in dB both are the directivity pattern moved down. dBi = dBd + 2.15. Practical antennas: $$G_0 \approx 30{,}000/(\Theta_{1d}\Theta_{2d})$$.

Bandwidth <span class="ra-ref">[§2.11](../2-11-bandwidth/) · p. 70</span>
: The frequencies over which a property stays within spec: *impedance bandwidth* for the match, *pattern bandwidth* for gain, beamwidth, side lobes, polarization.[^band] Broadband as a ratio (10:1), narrowband as a percentage. A resonant antenna's match runs out first: its VSWR-2 band on a matched line is $$(s-1)/(Q\sqrt s) = 0.707/Q$$, while the $$1/Q$$ of (11-36) is the VSWR-2.62 band. Inside a sphere of radius $$r$$, $$Q$$ has a floor rising as $$1/(kr)^3$$ (Chu, (11-35)): small means narrowband, unless lossy.

## Matching the wave {#wave}

Polarization <span class="ra-ref">[§2.12](../2-12-polarization/) · (2-55) to (2-68)</span>
: The figure the tip of $$\mathbf E$$ traces in time at one point, seen with the wave travelling away: clockwise is right hand.[^pol] With amplitudes $$E_{xo}$$, $$E_{yo}$$ and phase difference $$\Delta\phi$$: linear for $$\Delta\phi = n\pi$$, circular for $$E_{xo} = E_{yo}$$ and $$\Delta\phi = \pm(\tfrac12 + 2n)\pi$$, elliptical otherwise. Axial ratio AR = major/minor axis, from 1 (circular) to $$\infty$$ (linear). An antenna's polarization is that of the wave it radiates, so it changes with direction.

Polarization loss factor <span class="ra-ref">[§2.12](../2-12-polarization/) · (2-71)</span>
: $$\mathrm{PLF} = \vert\hat{\boldsymbol\rho}_w\cdot\hat{\boldsymbol\rho}_a\vert^2 = \cos^2\psi_p$$, with $$\hat{\boldsymbol\rho}_a$$ the antenna's polarization in transmit mode and no complex conjugate.[^plf] Linear at angle $$\psi$$: $$\cos^2\psi$$. Linear on circular: 3 dB. Circular: 1 for the same sense, 0 for the opposite, but a real antenna with axial ratio AR takes $$(\mathrm{AR} - 1)^2/\big(2(\mathrm{AR}^2 + 1)\big)$$ of the opposite sense: only 15.5 dB of rejection at 3 dB AR.

## Receiving {#receiving}

Vector effective length <span class="ra-ref">[§2.15](../2-15-vector-effective-length-and-equivalent-areas/) · (2-91) to (2-93)</span>
: Defined by the antenna's own far field, $$\mathbf E_a = -j\eta\dfrac{kI_{in}}{4\pi r}\boldsymbol\ell_e\,e^{-jkr}$$, and used for reception as $$V_{oc} = \mathbf E^i\cdot\boldsymbol\ell_e$$.[^le] Field in, open-circuit voltage out, polarization included. It changes with direction and with the current it is referred to: a short dipole with triangular current has $$\vert\boldsymbol\ell_e\vert = (l/2)\sin\theta$$, while at the feed of a $$0.75\lambda$$ dipole it is longer than the wire.

Effective area <span class="ra-ref">[§2.15](../2-15-vector-effective-length-and-equivalent-areas/) · (2-94) to (2-100)</span>
: $$A_e = P_T/W_i$$: the power delivered to the load over the incident power density, in m².[^ae] At conjugate match it is $$A_{em}$$; scattering, loss and capture areas count re-radiated, heated and total power the same way, and $$\epsilon_{ap} = A_{em}/A_p$$ against the physical area. Not a size: a short dipole has $$0.119\lambda^2$$ however thin, as its own current pulls the power in.

Maximum effective area <span class="ra-ref">[§2.16](../2-16-maximum-directivity-and-maximum-effective-area/) · (2-110) to (2-112)</span>
: $$A_{em} = \dfrac{\lambda^2}{4\pi}D_0$$ for every antenna; with the losses, mismatch and polarization, $$A_{em} = e_0\dfrac{\lambda^2}{4\pi}D_0\vert\hat{\boldsymbol\rho}_w\cdot\hat{\boldsymbol\rho}_a\vert^2$$.[^aem] Directivity and effective area are one property seen from the two ends of a link; every lossless antenna averages $$\lambda^2/4\pi$$ over all directions, i.e. $$\oint A_e\,d\Omega = \lambda^2$$.[^era]

  <!--noread-->
  <details markdown="1"><summary markdown="span">Why</summary>
  Balanis gets $$\lambda^2/4\pi$$ by comparing any antenna with a short dipole, whose $$A_{em}$$ he works out from its circuit. A more general route: put the antenna, matched, in a closed box at temperature $$T$$. The walls glow with a brightness of $$2kT/\lambda^2$$ per hertz per steradian, the antenna takes one polarization, i.e. half of it, so it receives $$(kT\,\Delta f/\lambda^2)\oint A_e\,d\Omega$$. In equilibrium that must equal the $$kT\,\Delta f$$ its matched load sends back, so $$\oint A_e\,d\Omega = \lambda^2$$ whatever the antenna's shape.
  </details>
  <!--/noread-->

## Links and noise {#links}

Friis transmission equation <span class="ra-ref">[§2.17](../2-17-friis-transmission-and-radar-range-equations/) · (2-118), (2-119)</span>
: In general $$\dfrac{P_r}{P_t} = e_{cdt}e_{cdr}\big(1 - \vert\Gamma_t\vert^2\big)\big(1 - \vert\Gamma_r\vert^2\big)\Big(\dfrac{\lambda}{4\pi R}\Big)^2 D_t D_r\,\vert\hat{\boldsymbol\rho}_t\cdot\hat{\boldsymbol\rho}_r\vert^2$$, and for matched, aligned antennas $$\dfrac{P_r}{P_t} = \Big(\dfrac{\lambda}{4\pi R}\Big)^2 G_{0t}G_{0r}$$.[^friis] Free space, each antenna in the other's far field. $$(4\pi R/\lambda)^2$$ is the *free-space loss*.

  <!--noread-->
  <details markdown="1"><summary markdown="span">Why</summary>
  At distance $$R$$ the transmitter gives $$W = P_tG_t/4\pi R^2$$. The receiver collects $$W A_{er}$$ with $$A_{er} = \lambda^2G_r/4\pi$$. Multiply.
  </details>
  <!--/noread-->

Radar range equation <span class="ra-ref">[§2.17](../2-17-friis-transmission-and-radar-range-equations/) · (2-120) to (2-126)</span>
: $$\dfrac{P_r}{P_t} = e_{cdt}e_{cdr}\big(1 - \vert\Gamma_t\vert^2\big)\big(1 - \vert\Gamma_r\vert^2\big)\,\sigma\,\dfrac{D_tD_r}{4\pi}\Big(\dfrac{\lambda}{4\pi R_1R_2}\Big)^2\vert\hat{\boldsymbol\rho}_w\cdot\hat{\boldsymbol\rho}_r\vert^2$$.[^radar] The radar cross section $$\sigma$$ (m², or dBsm) is the area that, re-radiating what it intercepts equally in all directions, returns what the target does. One antenna: $$R_1 = R_2$$, the echo falls as $$1/R^4$$.

Radar cross section of an antenna <span class="ra-ref">[§2.17](../2-17-friis-transmission-and-radar-range-equations/) · (2-127) to (2-142)</span>
: An antenna scatters a structural part, blind to the load, and an antenna-mode part that goes through its terminals, so its RCS depends on the load. Matched, $$\sigma = \big\vert\sqrt{\sigma_s} - \sqrt{\sigma_a}\,e^{j\phi_r}\big\vert^2$$ (2-137), which lies between $$(\sqrt{\sigma_s} - \sqrt{\sigma_a})^2$$ and $$(\sqrt{\sigma_s} + \sqrt{\sigma_a})^2$$.[^rcs] A shorted resonant half-wave dipole has $$\sigma \approx 0.86\lambda^2$$ broadside.

Brightness temperature <span class="ra-ref">[§2.18](../2-18-antenna-temperature/) · (2-143)</span>
: $$T_B = \varepsilon T_m = \big(1 - \vert\Gamma\vert^2\big)T_m$$: a surface at physical temperature $$T_m$$ glows like a black body at $$T_B$$, with emissivity $$\varepsilon$$.[^tb] Reflective surfaces look cold: at 8.4 GHz the sea, seen from straight above, is about 112 K.

Antenna temperature <span class="ra-ref">[§2.18](../2-18-antenna-temperature/) · (2-144), (2-145)</span>
: $$T_A = \dfrac{\oint T_B(\theta,\phi)\,G(\theta,\phi)\,d\Omega}{\oint G(\theta,\phi)\,d\Omega}$$ and the noise power is $$P = kT_A\,\Delta f$$, with $$k = 1.381\times10^{-23}$$ J/K.[^ta] The temperature of a matched resistor giving the same noise per hertz, not the antenna's own: a 290 K dish pointed at the zenith at X band reports about 5 K. Needs $$hf \ll kT$$ (Rayleigh–Jeans).

Receiver noise chain <span class="ra-ref">[§2.18](../2-18-antenna-temperature/) · (2-146) to (2-148)</span>
: Balanis writes $$T_a = T_Ae^{-2\alpha l} + T_{AP}e^{-2\alpha l} + T_0\big(1 - e^{-2\alpha l}\big)$$ with $$T_{AP} = (1/e_A - 1)T_p$$, and the system temperature $$T_s = T_a + T_r$$.[^chain] A lossy part at $$T$$ passing a share $$e$$ adds $$(1 - e)T$$; applied to the antenna too, that gives $$T_a = \big[e_AT_A + (1 - e_A)T_p\big]e^{-2\alpha l} + T_0\big(1 - e^{-2\alpha l}\big)$$; eq. (2-146) makes the antenna's part $$1/e_A$$ too large.[^itu]

## Traps

1. Adding $$U$$ over the sphere without $$\sin\theta$$, on paper or on an even grid: 57% too much for an isotropic source, 15% for a half-wave dipole. [§2.4](../2-4-radiation-intensity/)
2. RMS fields in a formula written for peak phasors: power off by a factor of 2, i.e. 3 dB. [§2.3](../2-3-radiation-power-density/)
3. Return loss is not mismatch loss: 10 dB of return loss costs 0.46 dB. [§2.8](../2-8-antenna-efficiency/)
4. The FCC's "absolute gain" is gain against isotropic, Balanis's $$G$$; his $$G_{abs}$$ also counts mismatch. e.r.p. is against a dipole, 2.15 dB below e.i.r.p. [§2.9](../2-9-gain/)
5. Right-hand circular is the rotation in time at one point, seen along the travel; frozen in time, the same field is a left-handed helix. [§2.12](../2-12-polarization/)
6. "A matched receiver gets half of what it captures" holds for minimum-scattering antennas like a thin dipole; in general the share runs from 0 to 100%.[^af] [§2.13](../2-13-input-impedance/)
7. Higher frequencies don't fade faster in free space: the $$\lambda^2$$ in Friis is the receiving area at fixed gain. Two 60 cm dishes 1 km apart get 20 dB *better* from 1 to 10 GHz; two dipoles get 20 dB worse. [§2.16](../2-16-maximum-directivity-and-maximum-effective-area/)
8. In Friis, (2-115), Balanis's $$e_r$$ is a radiation efficiency; in [§2.8](../2-8-antenna-efficiency/) the same symbol is the reflection efficiency. [§2.17](../2-17-friis-transmission-and-radar-range-equations/)

## Slips in the book

Nine places where the 3rd edition is wrong or easy to misread. Open them when you hit one; each is worked out on its section page.

<!--noread-->
<details markdown="1"><summary markdown="span">The nine slips</summary>

1. p. 31: "side lobe levels of $$-20$$ dB or smaller are usually not desirable" reads backwards; side lobes *above* about $$-20$$ dB are the bad ones. [§2.2](../2-2-radiation-pattern/)
2. Example 2.4: the exact HPBW is 28.75°, not 28.65° (rounding). [§2.5](../2-5-beamwidth/)
3. Eq. (2-18): $$1.67\sin^3\theta$$ is a fit; $$\sin^3\theta$$ integrates to $$D_0 = 16/3\pi = 1.698$$. The exact half-wave value is 1.641; (4-91) prints 1.643 from a rounded $$\mathrm{Cin}(2\pi)$$. [§2.6](../2-6-directivity/)
4. Eq. (2-68): a plain arctangent gives the minor axis's tilt when $$E_{yo} > E_{xo}$$; use the four-quadrant form. [§2.12](../2-12-polarization/)
5. Example 2.13: the dB line takes the log of 0.9905, not 0.9952 (the printed $$-0.02$$ dB is right). [§2.14](../2-14-antenna-radiation-efficiency/)
6. Eq. (2-138) misses its square roots: the bounds are $$(\sqrt{\sigma_s}\mp\sqrt{\sigma_a})^2$$; Example 2.17's own value falls outside the printed range. [§2.17](../2-17-friis-transmission-and-radar-range-equations/)
7. Eq. (2-142) assumes $$X_A = 0$$; with 73 + j42.5 Ω the factor 4 becomes 2.99. The $$-22.5$$ dBsm computed on p. 104 is $$\lambda^2$$ at 4.02 GHz; $$0.86\lambda^2$$ is $$-23.2$$ dBsm. [§2.17](../2-17-friis-transmission-and-radar-range-equations/)
8. Eq. (2-146) makes the antenna's noise $$1/e_A$$ too large: Example 2.18 should give 189.92 K (191.05 K by (2-146), 190.90 K printed). [§2.18](../2-18-antenna-temperature/)
9. Eq. (11-38), used for bandwidth, is exactly $$1/6$$ of $$\vert X\vert/R$$ from (11-37). [§2.11](../2-11-bandwidth/)

</details>
<!--/noread-->

## In the book

Chapter 2, pp. 27–108 (§2.1 and §2.19 have no page here). The dipole fields and impedances behind most numbers: §4.2 to §4.6 and §8.5; circular apertures: §7.10.2 and §12.6; small-antenna $$Q$$: §11.5.

---

## References

[^pat]: Balanis, [§2.2](../2-2-radiation-pattern/), pp. 27–34: pattern, lobes, isotropic and omnidirectional, principal planes, quoting the IEEE definitions (IEEE Std 145).
[^reg]: Balanis, [§2.2.4](../2-2-radiation-pattern/#near-field-and-far-field), pp. 34–35, and §4.4, eqs. (4-41) to (4-55c), pp. 166–170. For small antennas, §4.2, pp. 156–159.
[^sr]: Balanis, [§2.2.5](../2-2-radiation-pattern/), eqs. (2-1) and (2-2), pp. 36–37.
[^W]: Balanis, [§2.3](../2-3-radiation-power-density/), eqs. (2-3) to (2-11), pp. 38–40.
[^U]: Balanis, [§2.4](../2-4-radiation-intensity/), eqs. (2-12) to (2-15), pp. 40–41.
[^D]: Balanis, [§2.6](../2-6-directivity/), eqs. (2-16) to (2-17b), pp. 44–48. The half-wave dipole: §4.6, eq. (4-91), p. 183, gives 1.643 with $$\mathrm{Cin}(2\pi)$$ rounded; with $$\mathrm{Cin}(2\pi) = 2.4376$$ it is 1.641.
[^omega]: Balanis, [§2.6](../2-6-directivity/), eqs. (2-22) to (2-25), p. 50.
[^bw]: Balanis, [§2.5](../2-5-beamwidth/), pp. 42–44. Tapered circular apertures: §7.10.2, Table 7.2, pp. 421–422.
[^est]: Balanis, [§2.6.1](../2-6-directivity/#one-lobe-two-lobes-omni), eqs. (2-26) to (2-30b), pp. 51–54; omnidirectional patterns, [§2.6.2](../2-6-directivity/#one-lobe-two-lobes-omni), eqs. (2-32) to (2-33b), pp. 55–57. C.-T. Tai and C. S. Pereira, "An approximate formula for calculating the directivity of an antenna," *IEEE Trans. Antennas Propag.* 24(2), 235–236 (1976), doi:[10.1109/TAP.1976.1141313](https://doi.org/10.1109/TAP.1976.1141313).
[^num]: Balanis, [§2.7](../2-7-numerical-techniques/), eqs. (2-34) to (2-43), pp. 58–61.
[^be]: Balanis, [§2.10](../2-10-beam-efficiency/), eqs. (2-53) and (2-54), pp. 69–70; circular apertures, §12.6.3, p. 691, and Fig. 12.21, p. 694.
[^eff]: Balanis, [§2.8](../2-8-antenna-efficiency/), eqs. (2-44) and (2-45) and Fig. 2.22, pp. 64–65.
[^za]: Balanis, [§2.13](../2-13-input-impedance/), eqs. (2-72) to (2-89) and Figs. 2.27 and 2.28, pp. 80–85; the footnote on p. 82 on lossy dielectric and lossy ground. Radiation resistance at the current maximum and at the feed: §4.5.3, eq. (4-70), p. 177, and §4.5.5, eqs. (4-77) to (4-79), pp. 179–180.
[^ecd]: Balanis, [§2.14](../2-14-antenna-radiation-efficiency/), eqs. (2-90) to (2-90b) and Example 2.13, pp. 85–86. The exact round-wire resistance: S. A. Schelkunoff, "The electromagnetic theory of coaxial transmission lines and cylindrical shields," *Bell System Technical Journal* 13(4), 532–579 (1934), doi:[10.1002/j.1538-7305.1934.tb00679.x](https://doi.org/10.1002/j.1538-7305.1934.tb00679.x).
[^gain]: Balanis, [§2.9](../2-9-gain/), eqs. (2-46) to (2-52), pp. 65–69.
[^band]: Balanis, [§2.11](../2-11-bandwidth/), p. 70, quoting the IEEE definition; $$Q$$ and the Chu limit, §11.5, eqs. (11-35) to (11-38), pp. 637–641.
[^pol]: Balanis, [§2.12](../2-12-polarization/), pp. 70–75, eqs. (2-55) to (2-68), quoting the IEEE definitions.
[^plf]: Balanis, [§2.12.2](../2-12-polarization/#how-much-a-mismatch-costs), eqs. (2-69) to (2-71) and Example 2.12, pp. 76–79.
[^le]: Balanis, [§2.15.1](../2-15-vector-effective-length-and-equivalent-areas/#effective-length-depends-on-the-current-you-pick), eqs. (2-91) to (2-93) and Example 2.14, pp. 87–89.
[^ae]: Balanis, [§2.15.2](../2-15-vector-effective-length-and-equivalent-areas/#where-the-power-comes-from), eqs. (2-94) to (2-100) and Example 2.15, pp. 89–92.
[^aem]: Balanis, [§2.16](../2-16-maximum-directivity-and-maximum-effective-area/), eqs. (2-101) to (2-112), pp. 92–94.
[^era]: J. J. Condon and S. M. Ransom, *Essential Radio Astronomy* (Princeton University Press, 2016), §3.1.4, "The Effective Area of a Receiving Antenna", eqs. (3.36) to (3.43); [online edition at NRAO](https://www.cv.nrao.edu/~sransom/web/Ch3.html).
[^friis]: Balanis, [§2.17.1](../2-17-friis-transmission-and-radar-range-equations/#friis-two-areas-and-a-sphere), eqs. (2-113) to (2-119), pp. 94–96.
[^radar]: Balanis, [§2.17.2](../2-17-friis-transmission-and-radar-range-equations/#radar-the-trip-both-ways), eqs. (2-120) to (2-126), pp. 96–98.
[^rcs]: Balanis, [§2.17.3](../2-17-friis-transmission-and-radar-range-equations/#an-antenna-as-a-target), eqs. (2-127) to (2-142) and Table 2.2, pp. 98–104.
[^tb]: Balanis, [§2.18](../2-18-antenna-temperature/), eq. (2-143), p. 106. The sea at 8.4 GHz: ITU-R Recommendation P.527-5, *Electrical characteristics of the surface of the Earth* (08/2019), §5.1.2; [PDF at ITU](https://www.itu.int/dms_pubrec/itu-r/rec/p/R-REC-P.527-5-201908-S!!PDF-E.pdf), with the Fresnel reflection at normal incidence.
[^ta]: Balanis, [§2.18](../2-18-antenna-temperature/), eqs. (2-144) and (2-145), p. 106. J. J. Condon and S. M. Ransom, *Essential Radio Astronomy*, §3.1.6, "Antenna Temperature"; [online edition at NRAO](https://www.cv.nrao.edu/~sransom/web/Ch3.html).
[^chain]: Balanis, [§2.18](../2-18-antenna-temperature/), eqs. (2-146) to (2-148) and Example 2.18, pp. 107–108.
[^itu]: ITU-R Recommendation P.372-16, *Radio noise* (08/2022), §1.2.1, eqs. (1) to (5); [PDF at ITU](https://www.itu.int/dms_pubrec/itu-r/rec/p/R-REC-P.372-16-202208-S!!PDF-E.pdf).
[^af]: J. Bach Andersen and A. Frandsen, "Absorption efficiency of receiving antennas," *IEEE Transactions on Antennas and Propagation* 53(9), 2843–2849 (2005), doi:[10.1109/TAP.2005.854532](https://doi.org/10.1109/TAP.2005.854532).
