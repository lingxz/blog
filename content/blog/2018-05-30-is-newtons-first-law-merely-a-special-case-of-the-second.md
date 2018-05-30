---
title: Is Newton's first law merely a special case of the second?
tags: [physics]
math: true
summary: I discuss why it might not be.
---

I did a survey of this question at my school about this, everyone who is familiar enough with Newton's three laws seem to agree that his first law is a subset of the second, even though some said that it has a different emphasis. I also found a [Quora question](https://www.quora.com/Why-is-Newtons-first-law-not-simply-a-derivative-of-the-second-law) about this, where most people agree they are mathematically the same. A mathematics student also brought up that a set of axioms does not have to be minimal, but it has to be helpful, which I agree with. Of course, even if Newton's first law contains no new mathematical information, I don't think it is unnecessary. If anything, it summarizes one of his most important realizations and is an emphatic rebuttal to Aristotle's belief that an object will remain at rest unless acted on by an external force. 

If you want to play along, ask yourself this question: if a certain equation of motion satisfies the second law, does it necessarily satisfy the first? My first answer is yes, but after recent thought I realized it might not be. 

I recently had a conversation with a friend about this, which started because I came across an interesting artifact called [Norton's Dome](https://en.wikipedia.org/wiki/Norton%27s_dome), a thought experiment proposed by John Norton that seems to violate determinism even in Newtonian physics. Norton gives the dome a longer exposition on [his website](https://www.pitt.edu/~jdnorton/Goodies/Dome/), but the basic idea is that there is a dome described by the equation

$$h(r) = \frac{2}{3g} r^{3/2}$$

on which the a ball is resting, at the very top. At this point, it is at equilibrium (though unstable). Any perturbation will push it rolling down the dome, but we assume there is none. 

<figure class="no-border">
  <img src="/img/nortons_dome.gif" title="Norton's Dome" alt="Norton's Dome">
  <figcaption>Norton's Dome, image taken from <a href="https://www.pitt.edu/~jdnorton/Goodies/Dome/">Norton's Web</a></figcaption>
</figure>

The simplest solution is that the ball remains forever at rest. However, due to the [mathematical properties](https://www.wikiwand.com/en/Lipschitz_continuity) of the dome, a second solution is admitted, and hence one can write the solution as 

$r(t) = (1/144) (t-T)^4 \text{ for } t \geq T$  
$r(t) = 0 \text{ for } t < T$.

which means that at some arbitrary time $T$, the ball will start rolling for no reason at all. With all the above information, it is impossible to determine time $T$ at which it starts rolling. 

Ok, so it seems there is this seemingly nonsense mathematical solution, which is fine. It is not uncommon in physics to reject solutions that are mathematically correct and physically wrong. 

But is it physically wrong? 

The first reaction is probably that there seems to be no cause to this sudden motion. But that's not a problem. Newton's laws only describe motion, they say nothing about cause and effect. 

It agrees with Newton's second law. It also agrees with time reversal symmetry. One can imagine the time-reversed situation where the ball is propelled from bottom to top, with just the right energy to stop at the top (this is only possible for this specific dome shape, others will require an infinite time for this to happen). The ascent could happen at any time, so if you reverse time, it could also set off at any time in the future. 

Norton also claims that it agrees with the first law, and this is where it gets a bit iffy. 

The first law says: 

> Every object will remain at rest or in uniform motion in a straight line unless compelled to change its state by the action of an external force. 

Norton interprets the first law as such: that in the absence of a net external force, a body is unaccelerated.

But by only applying the law at an instant, I think he is discarding a lot of what the word "remain" means. "Remain" necessary implies a time period, and by a normal interpretation of the word, I am still not convinced Norton's solution obeys the first law. The ball is at rest with no net external force acting on it, and clearly first law states it should *remain* at rest; rolling down the hill at some arbitrary time is a direct violation of that fact. 

Which is the more right interpretation? You decide. I would say I am not quite convinced by Norton's. 

And here we have a situation where the equation of motion satisfies the second law but, based on my interpretation, does not satisfy the first. That must necessarily mean that the first law says something that the second law doesn't, what is it?

In fact, if we look closely at the solution, we might notice where it goes wrong. At time $T$, acceleration is still zero, but the 4th order derivative, called snap / jounce, is not. This means at some arbitrary time $T$ the snap of the ball was instantaneously bumped up even though nobody touched the ball, and this "caused" the ball to begin its descent. 

Norton thinks this is fine, but I do think this is forbidden by Newtonian mechanics. The implication in Newton's first law must be that when there is no external force, all higher order derivatives must necessarily be zero, for the ball to *remain* at rest. 

So I think this is the important thing that Newton's first law says that the second law doesn't: while the second law talks about the second derivative of position, the first law imposes a specific condition on all higher derivatives. 

But what happens then to time reversal symmetry? I have no answer to that. What do you think? Either way, though, I doubt the ball is going anywhere. 

## Readings

- [Norton's website](https://www.pitt.edu/~jdnorton/Goodies/Dome/)
- [A Note on Norton's Dome](https://arxiv.org/abs/1801.01719)
- [A blog post about some of the pathological things about Norton's Dome](https://blog.gruffdavies.com/tag/the-dome/)
- and many more, just [google it](https://www.google.co.uk/search?q=norton%27s+dome&oq=norton%27s+dome&aqs=chrome..69i57j69i60l3j0l2.1397j0j1&sourceid=chrome&ie=UTF-8). 