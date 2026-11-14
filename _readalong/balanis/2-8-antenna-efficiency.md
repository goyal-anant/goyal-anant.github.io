---
title: Antenna Efficiency
book: balanis
section: "2.8"
---

## What this section is really saying

Of the power that comes up the line, some bounces back at the antenna's terminals, some heats the metal, some heats the dielectric, and the rest is radiated. Each step keeps a fraction, so the total efficiency is their product, $$e_0 = e_r e_c e_d$$ (Balanis eq. 2-44).[^eff] The first one is easy to measure and to fix; the other two hide inside the antenna and are lumped together as $$e_{cd}$$ (2-45). A good match tells you nothing about $$e_{cd}$$.

## Predict first

A Wi-Fi antenna is a straight copper wire 6.1 mm long (a twentieth of a wavelength at 2.45 GHz). It is matched perfectly to 50 Ω with a good coil, quality factor 100, so the VSWR is 1.0 and nothing is reflected. What fraction of the power is radiated?

## Mismatch: a half-wave dipole on a real line

The reflection efficiency is $$e_r = 1 - \vert\Gamma\vert^2$$, with $$\Gamma = (Z_{in} - Z_0)/(Z_{in} + Z_0)$$. All the widgets below are at 2.45 GHz, in copper, and start with 1 W leaving a source matched to the line. The dipole's impedance comes from the induced-EMF formulas of §8.5,[^z] and its copper loss from the surface resistance of §2.14.[^rl]

### Things to try

1. Length 0.5 λ on 50 Ω: $$Z_{in} = 73.3 + j42.5\ \Omega$$, $$\vert\Gamma\vert = 0.372$$, VSWR 2.18, and 0.14 W goes back to the source, i.e. $$-0.65$$ dB. The copper takes 0.0015 W.
2. Switch to 75 Ω: the loss drops to $$-0.35$$ dB. The resistance is closer; the reactance is the same.
3. Slide the length down to 0.4685 λ (57.3 mm). The reactance goes to zero and $$Z_{in} = 60.8\ \Omega$$, so even on 50 Ω only 1% is reflected ($$-0.05$$ dB). This is why a real half-wave dipole is cut a few percent short.
4. Change the radius: a thicker wire resonates shorter, at a lower resistance. Over the whole range of both sliders the copper never takes more than about 1%: for a wire this long, $$e_{cd}$$ is not the problem.

{% include readalong/efficiency-chain.html case="dipole" length="0.5" radius="0.5" z0="50" caption="Left: where 1 W from the source goes. Each bar is the power still travelling after one stage, with the slice that stage removed in its colour (grey: reflected; red: heat in the copper). Right: the total efficiency against length for a 50 Ω line (solid) and a 75 Ω line (dashed); the dot is the current setting. Copper wire of the chosen radius at 2.45 GHz, where a wavelength is 122 mm." %}

## Matched is not efficient

A short dipole radiates very little for its current: its radiation resistance is a fraction of an ohm, and in series with it sits a huge capacitive reactance. To match it you cancel the reactance with a coil and then transform the small resistance up to 50 Ω. The coil is never lossless: a coil of quality factor $$Q$$ that cancels a reactance $$X$$ puts a resistance $$\vert X\vert/Q$$ in series with the antenna.[^short] The transformer here is ideal, so $$\Gamma = 0$$ exactly.

### Things to try

1. Length 0.05 λ, $$Q = 100$$: $$Z_{in} = 0.51 - j1138\ \Omega$$, so the coil adds 11.4 Ω against a radiation resistance of 0.5 Ω. Nothing is reflected, and 4.2% is radiated ($$-13.8$$ dB). The answer to the prediction.
2. Double the coil's $$Q$$ to 200: 8.0%. Double the length instead, to 0.1 λ: 19.8%. The radiation resistance grows as the length squared and the reactance falls, so length helps more than a better coil.
3. Choose *Straight on 50 Ω*: without the match, $$\vert\Gamma\vert$$ is 0.99996 and $$e_0$$ drops to $$-41$$ dB. So the match is still worth 27 dB here; it just can't make the antenna efficient.

{% include readalong/efficiency-chain.html case="short" length="0.05" radius="0.25" q="100" caption="The same ledger for a short copper dipole, wire radius 0.25 mm, matched by a series coil of quality factor Q and an ideal lossless transformer (dark red: heat in the coil). Right: total efficiency in dB against length (log scale) with the coil (solid) and connected straight to a 50 Ω line (dashed)." %}

## Dielectric loss: a Wi-Fi patch

A wire in air has no dielectric to heat. A patch antenna does: it is a copper rectangle on a circuit board, and most of its field sits inside the board. Balanis's chapter on microstrip antennas gives each loss a quality factor, radiation $$Q_{rad}$$, copper $$Q_c$$ and dielectric $$Q_d = 1/\tan\delta$$, and the radiated share is $$e_{cd} = Q_t/Q_{rad}$$ with $$1/Q_t = 1/Q_{rad} + 1/Q_c + 1/Q_d$$ (eqs. 14-83 to 14-87).[^q] So a model can split $$e_c$$ from $$e_d$$, even though a measurement sees only their product. The patch is fed at the point where it matches 50 Ω, so nothing is reflected.

### Things to try

1. FR-4, the cheap board inside most electronics ($$\epsilon_r = 4.04$$, $$\tan\delta = 0.021$$ at 2 GHz),[^fr4] 1.6 mm: about 32% radiated. The board takes 0.65 W, the copper only 0.03 W.
2. Switch to RO4003C, a low-loss microwave board ($$\epsilon_r = 3.55$$, $$\tan\delta = 0.0027$$),[^ro] same thickness: about 77%.
3. Make the board thinner. At 0.8 mm FR-4 falls to 18.5% and RO4003C to 57%. A thin patch stores more energy for each watt it radiates ($$Q_{rad}$$ grows as $$1/h$$), so every loss takes a bigger share; the bandwidth, about $$1/Q_t$$, shrinks with it.

{% include readalong/efficiency-chain.html case="patch" substrate="fr4" h="1.6" caption="The ledger for a rectangular copper patch designed for 2.45 GHz on the chosen board (yellow: heat in the board). Right: total efficiency against board thickness for FR-4 (solid) and RO4003C (dashed). The quality factors are Balanis's thin-board approximations, without surface waves: a model, not a measurement." %}

## The gap

<details markdown="1">
<summary markdown="span">Where $$1 - \vert\Gamma\vert^2$$ comes from, and the copper loss of a dipole</summary>

On a lossless line of real impedance $$Z_0$$, the incident wave of amplitude $$V^+$$ carries $$\vert V^+\vert^2/2Z_0$$ towards the antenna, and the reflected wave $$\Gamma V^+$$ carries $$\vert\Gamma\vert^2$$ times that back. The antenna accepts the difference:

$$
P_{acc} = \frac{\vert V^+\vert^2}{2Z_0}\left(1 - \vert\Gamma\vert^2\right)
$$

If the source is matched to the line, the reflected wave is absorbed there and the story ends. If not, it bounces back towards the antenna and the bookkeeping changes; $$e_r$$ is then the ratio of accepted to incident power, not to what the source could deliver. The reflected power goes back to the source; none of it heats the antenna.

For the copper loss, the current on a thin dipole of length $$l$$ is close to $$I(z) = I_0\sin[k(l/2 - \vert z\vert)]$$. Each length $$dz$$ of wire of radius $$b$$ has resistance $$R_s\,dz/2\pi b$$, with $$R_s = \sqrt{\omega\mu_0/2\sigma}$$ (eq. 2-90b). Adding up $$\tfrac12\vert I(z)\vert^2 R_s\,dz/2\pi b$$ over the wire and dividing by $$\tfrac12\vert I_{in}\vert^2$$, with $$I_{in} = I_0\sin(kl/2)$$:

$$
R_L = \frac{R_s}{2\pi b}\,\frac{l/2 - \sin(kl)/2k}{\sin^2(kl/2)}
$$

At $$l = \lambda/2$$ this is half the resistance of the same wire carrying a uniform current, the factor $$\tfrac12$$ Balanis uses in §2.14.

</details>

## Common confusion

1. "VSWR 1.0, so the antenna is good." A 50 Ω resistor has VSWR 1.0 and radiates nothing. The short dipole above is matched perfectly and loses 96% of the power in its coil.
2. Return loss is not mismatch loss. A return loss of 10 dB means $$\vert\Gamma\vert^2 = 0.1$$, so the antenna loses only $$-10\log_{10}(0.9) = 0.46$$ dB. The usual "VSWR below 2" costs at most 0.51 dB.

## In the book

- §2.8, pp. 64–65: eqs. (2-44) and (2-45), Fig. 2.22 (the reference terminals and the losses).
- $$e_{cd} = R_r/(R_r + R_L)$$ and the wire's resistance: §2.14, eqs. (2-90) to (2-90b). Gain $$G_0 = e_{cd}D_0$$ and the absolute gain that includes $$e_r$$: §2.9, next.
- The dipole's input impedance: §4.5, eq. (4-93a), and §8.5, eqs. (8-60a) to (8-62). Patch design and quality factors: §14.2, eqs. (14-1) to (14-7), (14-12) and (14-83) to (14-87).

---

## References

[^eff]: Balanis, §2.8, eqs. (2-44) and (2-45) and Fig. 2.22, pp. 64–65.
[^z]: Balanis, §8.5, eqs. (8-60a), (8-60b), (8-61a) and (8-61b), pp. 465–466; at half a wavelength they give 73 + j42.5 Ω, eq. (4-93a), §4.5.
[^rl]: Balanis, §2.14, eqs. (2-90) and (2-90b), pp. 85–86, with copper at $$\sigma = 5.7\times10^{7}$$ S/m as in the book.
[^short]: Short-dipole impedance: Balanis eq. (4-37) for the resistance and eq. (8-62), p. 466, for the reactance; the widget uses the full formulas of note 2, which agree with both to 2% at a twentieth of a wavelength.
[^q]: Balanis, §14.2, eqs. (14-83) to (14-87), pp. 852–853; the patch is sized by eqs. (14-1) to (14-7) and its slot conductance is eq. (14-12).
[^fr4]: Isola Group, [*370HR* laminate data sheet](https://www.isola-group.com/wp-content/uploads/data-sheets/370hr_2.pdf): Dk 4.04 and Df 0.0210 at 2 GHz (Bereskin stripline).
[^ro]: Rogers Corporation, [RO4003C laminates](https://www.rogerscorp.com/advanced-electronics-solutions/ro4000-series-laminates/ro4003c-laminates): design Dk 3.55, dissipation factor 0.0027.
