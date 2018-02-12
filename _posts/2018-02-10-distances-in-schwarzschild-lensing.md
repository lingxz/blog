---
title: Distances in Schwarzschild lensing
excerpt: There are 3 commonly used distance measures in Schwarzschild gravitational lensing to parameterise the light ray. 
math: true
tags:
    - physics
---

In my final year project I have been dealing a lot with gravitational lensing by a Schwarzschild black hole. The famous formula for the bending angle (in units of $$c = G = 1$$) is this:

$$\alpha = \frac{4M}{R}$$

This formula forms the basis for one of the key observational confirmations of Einstein's theory of General Relativity (GR). The Newtonian prediction is only half of the GR result. 

When I first started out on my project, I was a little confused about which distance $$R$$ was referring to. 

There are 3 distances that are typically used as length measures:

1. $$b$$, the impact parameter, defined as the perpendicular distance between the light path and the black hole
2. $$r_0$$, the distance of closest approach between the light path and the black hole
3. $$R$$, the distance at turning point assuming the light ray was bent at a single point

Their differences between them can be seen in the diagram below. The pink path is the path the light ray actually took, where the distance of closest approach $$r_0$$ is defined, whereas the orange path is the light path assuming the bending occurs at a single point (which is a pretty good assumption, since the bending angle is small), from which $$R$$ is defined. 

<img alt="Schwarzschild lensing distances" src="{{ '/assets/img/schwarzschild-lensing.jpg' | absolute_url }}">

These distances are similar, but not the same. To be precise, they are all equal to one another to first order. This means that to first order in $$M/R$$, the bending angle can be written equivalently as

$$\alpha = \frac{4M}{R} = \frac{4M}{r_0} = \frac{4M}{b}.$$

However, they can no longer be used interchangeably from second order onwards. It is easy to convert between them using the relationships between the three distance measures:

$$\frac{r_0}{b} = 1 - \frac{M}{b} - \frac{3}{2}\left (\frac{M}{b} \right )^2 - 4\left (\frac{M}{b}\right )^3 + ... $$

$$\frac{R}{r_0} = 1 + \frac{M}{R} + \frac{3}{16} \left (\frac{M}{R} \right )^2 + ...$$

For example, here is a table of the second and third order coefficients for the different distance measures:

|            | 2nd order    | 3rd order  |
| --------- | ------------- | ----- |
| $$M/R$$     | $$15\pi/4$$ | $$401/12$$ |
| $$M/r_0$$  | $$-4 + 15\pi/4 $$  | $$122/3 - 15\pi/2$$  |
| $$M/b$$    | $$15\pi/4$$    |    $$128/3$$ |

[This paper](https://arxiv.org/pdf/gr-qc/0511019.pdf) contains a detailed derivation of the lensing formula up to arbitrary order.  