---
title: "OAM"
summary: "Orbital angular momentum links over long distances, with identical transmitter and receiver arrays."
papers: [bhat2024oam]
hero: research/oam.svg
---
A radio wave can carry *orbital angular momentum* (OAM): its phase front twists like a corkscrew as it travels, and the number of twists per wavelength is the mode. Different modes are orthogonal, so in principle you can send several data streams on the same frequency, one per mode.

The catch is that OAM beams diverge, and the ring of the beam grows with distance. A common way to generate the beam is a uniform circular array (UCA), and to receive it properly the receiver ring has to match the beam size at the far end. If the receiver radius is different from the transmitter radius, you need two different designs, which is annoying.

So, we derived an analytical expression for the transmitter UCA radius such that, for a given link distance, the receiver radius comes out the same. We simulated it at 26 GHz for 50 m and 100 m using modes 1 and 2, and then multiplexed both modes on concentric UCAs and reported the mode purity at 50 m.
