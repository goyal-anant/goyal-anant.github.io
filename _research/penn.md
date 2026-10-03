---
title: "PENN"
summary: "A physics-embedded neural network that solves the cavity model of a patch antenna, fast and differentiable."
papers: [gupta2025penn]
hero: research/penn.svg
---
A microstrip patch antenna can be modelled as a small cavity: two metal plates with magnetic walls on the sides. The cavity model gives you the fields for each $$TM_{mnp}$$ mode, and from them the far-field pattern. The problem is that a full-wave FEM solver takes minutes per design, and inverse design needs hundreds of solves plus gradients.

So, we built a PDE solver as a neural network that learns from physics, not data: there is no training dataset, the loss comes from the governing equations. It is a hybrid of the textbook cavity solution and a physics-constrained residual network, and it takes the 3D dimensions of the patch and predicts the far-field pattern for any mode.

Since the whole thing is differentiable, you get gradients with respect to the design variables for free via automatic differentiation. We checked them against finite differences and the relative error is around 0.07 %. A commercial FEM solver needs two full solves, i.e. about 6 minutes, for the same gradient; the trained network is roughly 200,000 times faster, which is what makes it useful for inverse design. It also generalises to dimensions it has not seen.
