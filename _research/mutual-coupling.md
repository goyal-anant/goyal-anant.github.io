---
title: "Mutual Coupling, a Friend"
summary: "Using the coupling between antenna elements to get more gain out of a compact array."
title_hi: "म्यूचुअल कपलिंग, एक दोस्त"
summary_hi: "एंटीना एलिमेंट्स के बीच की कपलिंग से छोटे ऐरे का गेन बढ़ाना।"
hindi: true
papers: [goyal2025coupling]
hero: research/mutual-coupling.svg
---
When antennas in an array sit close to each other, they talk: the current on one element induces current on its neighbours. This is *mutual coupling*, and the textbook treats it as a nuisance. You either space the elements far apart, around $$\lambda/2$$, or you fight it with decoupling structures.

But what if the array has to be small? In compact arrays for 6G and beyond, you cannot afford $$\lambda/2$$ spacing, so the coupling is going to be there whether you like it or not. So, we asked the opposite question: can we use it?

It turns out that we can. We tune two knobs: the spacing $$d$$ between the elements, which controls the coupling between neighbours, and the size $$k$$ of a metal cage around the array, which controls the coupling that comes back from the surroundings. By sweeping both, we got up to 2.62 dB more broadside gain at $$d = 0.2\lambda$$ than the usual progressive phase shift excitation. That is about 1.8 times the power in that direction, from an effect people normally try to kill.
