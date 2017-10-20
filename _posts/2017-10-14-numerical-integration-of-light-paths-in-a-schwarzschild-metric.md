---
title: Numerical integration of light paths in a Schwarzschild metric
excerpt: Solving the null geodesic differential equations in a Schwarzschild spacetime numerically and tracing out the light rays and their bend angles. 
math: true
tags: 
    - physics
---

*Jump to...*
* TOC
{:toc}

## Differential equations of orbit

The Schwarzschild metric is one of the most famous solutions to the Einstein field equations, and the line element in this metric (in natural units $$c = G = 1$$) is given by:

$$ds^2 = -f(r) dt^2 + \frac{dr^2}{f(r)} + r^2(d\theta^2 + \sin^2 \theta d\phi^2)$$

We are interested in the trajectory of a light ray in such a metric. Since the metric is spherically symmetric, any light ray that starts with a certain $$\theta$$ must stay in the same $$\theta$$ plane, hence we can arbitrarily set $$\theta = \pi/2$$ and do away with all the $$\theta$$ terms. 

Light follows a null (lightlike) trajectory given by $$ds^2 = 0$$. In the absence of external forces, it should also travel along a geodesic. These are governed by the geodesic equations, which can be derived using Euler-Lagrange equations. Due to the symmetry of the metric, applying the Euler-Lagrange equations to the metric gives us two conserved quantities:

$$f \dot{t} = E = \text{constant}$$

$$r^2 \dot{\phi} = L = \text{constant}$$

where $$\dot{}$$ refers to derivative with respect to an affine parameter. 

Using the null condition, we have 

$$f\dot{t}^2 - \frac{\dot{r}^2}{f} - r^2\dot{\phi}^2 = 0$$

This can be expressed in terms of $$\dot{r}$$, and differentiating again gives the second-order differential equation for $$r$$:

$$\ddot{r} = \frac{L^2(r - 3M)}{r^4}$$

This can be easily converted into a first-order differential equation to be solved numerically by setting a variable $$p = \dot{r}$$. So we have these 3 differential equations to compute numerically:

$$\dot{r} = p$$

$$\dot{p} = \frac{L^2(r - 3M)}{r^4}$$

$$\dot{\phi} = \frac{L}{r^2}$$

(This can of course be solved analytically in the weak gravity limit, which gives the light bending equation $$\Delta \phi = 4M/R$$.)

## Initial conditions

In principle, we need the initial values of $$r$$, $$p$$, and $$\phi$$ to start the numerical simulation. However, if we fix the incoming velocity to be horizontal, then we would only need to specify the initial $$x_0$$ and $$y_0$$ coordinates. 

The initial conditions then can be given as follows:

$$r = \sqrt{x_0^2 + b^2}$$

$$\phi = \cos^{-1} \left ( \frac{x_0}{r} \right )$$

$$\dot{r} = p = \cos{\phi}$$

$$L = r^2 \dot{\phi} = r \sqrt{1 - \dot{r}^2}$$

Then, the only free parameters to specify $$b$$ and $$x_0$$, in addition to mass. 

## Graphs

For a mass of $$M = 1$$ (corresponding to Schwarzschild black hole radius of 2), this is a plot of the trajectories with different impact parameters $$b$$:

<img alt="Light rays visualization" src="{{ '/assets/img/visualization_trans.png' | absolute_url }}">

And they do fit quite well with the theoretical deflection angle, for large impact parameters:

<img alt="Numerical deflection angle vs theoretical deflection" src="{{ '/assets/img/deflections.png' | absolute_url }}">